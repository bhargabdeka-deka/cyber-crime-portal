const Scam = require("../models/Scam");

// ── Detect type from value ────────────────────────────────────────────────────
const detectType = (value = "") => {
  const v = value.trim().toLowerCase();
  if (/^[6-9]\d{9}$/.test(v.replace(/\s/g, "")))          return "phone";
  if (/^[\w.-]+@[\w.-]+\.\w+$/.test(v))                    return "email";
  if (/^[\w.-]+@[\w]+$/.test(v))                           return "upi";
  if (/^(https?:\/\/|www\.)/.test(v) || v.includes("."))   return "url";
  return "other";
};

// ── Compute risk level from risk score ───────────────────────────────────────
const getSeverityTier = (score) => {
  if (score >= 76) return "Critical";
  if (score >= 51) return "High";
  if (score >= 26) return "Medium";
  return "Low";
};

// ── Compute confidence label from report count ────────────────────────────────
const getConfidenceTier = (count) => {
  if (count >= 16) return "Critical";
  if (count >= 6)  return "High";
  if (count >= 1)  return "Medium";
  return "Low";
};

// ── Part 3: Premium Scam Reputation Engine V3 ─────────────────────────────────
const calculateRiskScore = async (scamTarget) => {
  const Complaint = require("../models/Complaint");
  const User = require("../models/User");

  const escapedTarget = scamTarget.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const reports = await Complaint.find({ scamTarget: { $regex: escapedTarget, $options: "i" } })
    .populate("user", "trustScore name");
  
  const reportCount = reports.length;
  const breakdown = [];

  const existing = await Scam.findOne({ value: scamTarget.toLowerCase() });
  const baselineReports = Math.max(reportCount, existing?.reports || 0);
  
  // PHASE 2 — BASELINE: baselineReports × 4
  let score = baselineReports * 4;
  breakdown.push(`${baselineReports} total reports recorded (Community + Database)`);

  // PHASE 3 — CATEGORY BOOST
  const types = reports.map(r => r.crimeType);
  let categoryBonus = 0;
  if (types.some(t => t === "Phishing"))         categoryBonus = 20;
  else if (types.some(t => t === "UPI Fraud"))   categoryBonus = 20;
  else if (types.some(t => t === "Lottery Scam")) categoryBonus = 15;
  else if (types.some(t => t === "Job Scam"))     categoryBonus = 10;
  
  if (categoryBonus > 0) {
    score += categoryBonus;
    breakdown.push(`High-risk category boost (+${categoryBonus})`);
  }

  // PHASE 3 — VERIFIED BOOST
  let trustedCount = 0;
  let resolvedCount = 0;
  reports.forEach(r => {
    if (r.user?.trustScore >= 70) trustedCount++;
    if (r.status === "Resolved") resolvedCount++;
  });

  if (resolvedCount > 0) {
    score += 20;
    breakdown.push(`Admin verified threat (+20)`);
  } else if (trustedCount > 0) {
    score += 10;
    breakdown.push(`Community verified threat (+10)`);
  }

  // PHASE 4 — AI BOOST (+0–20)
  let aiScoreTotal = 0;
  let aiConfidenceTotal = 0;
  let aiCount = 0;
  let aiExplanations = [];
  let aiSummaries = [];

  reports.forEach(r => {
    if (r.aiRiskScore > 0) {
      aiScoreTotal += r.aiRiskScore;
      aiConfidenceTotal += r.aiConfidence;
      aiCount++;
      if (r.aiExplanation) r.aiExplanation.forEach(e => aiExplanations.push(e));
      if (r.aiSummary) aiSummaries.push(r.aiSummary);
    }
  });

  if (aiCount > 0) {
    const avgAiScore = aiScoreTotal / aiCount;
    const aiBonus = Math.round((avgAiScore / 100) * 20);
    score += aiBonus;
    breakdown.push(`AI predictive intelligence boost (+${aiBonus})`);
  }

  // PHASE 5 — FINAL SCORE CLAMP
  const finalScore = Math.min(100, Math.max(0, Math.round(score)));
  
  // PHASE 6 — CONFIDENCE
  const finalConfidenceValue = Math.min(100, (baselineReports * 4) + (resolvedCount ? 30 : (trustedCount ? 15 : 0)) + (aiCount ? 10 : (existing?.aiConfidence ? 5 : 0)));
  let confidenceTier = "Low";
  if (finalConfidenceValue >= 71) confidenceTier = "Critical";
  else if (finalConfidenceValue >= 41) confidenceTier = "High";
  else if (finalConfidenceValue >= 21) confidenceTier = "Medium";

  // PHASE 7 — SEVERITY
  const level = getSeverityTier(finalScore);

  return { 
    riskScore: finalScore, 
    riskLevel: level, 
    riskReasons: breakdown,
    reasonBreakdown: breakdown,
    communityVerified: trustedCount >= 1 || resolvedCount >= 1,
    aiConfidence: finalConfidenceValue,
    confidenceTier: confidenceTier,
    aiSummary: aiSummaries[0] || existing?.aiSummary || (baselineReports > 10 ? "Repeated scam activity detected across community database." : "Predictive analysis merged with community data."),
    aiExplanations: aiExplanations.length > 0 ? [...new Set(aiExplanations)].slice(0, 4) : (existing?.aiKeywords ? [`Recognized pattern: ${existing.aiKeywords.join(", ")}`] : ["Pattern analysis merged with community data."]),
    aiSeverity: level
  };
};

const updateScamReputation = async (scamTarget) => {
  if (!scamTarget) return;
  const data = await calculateRiskScore(scamTarget);
  await Scam.findOneAndUpdate(
    { value: scamTarget.toLowerCase() },
    { ...data },
    { upsert: false }
  );
};

// ── Risk level → frontend verdict ────────────────────────────────────────────
const riskToVerdict = (riskLevel, reports) => {
  if (reports === 0)          return { verdict: "safe",      label: "Safe / No Reports", color: "#10b981" };
  if (riskLevel === "Critical") return { verdict: "dangerous", label: "Highly Dangerous",  color: "#ef4444" };
  if (riskLevel === "High")     return { verdict: "warning",   label: "High Risk",         color: "#f97316" };
  if (riskLevel === "Medium")   return { verdict: "warning",   label: "Suspicious",        color: "#f59e0b" };
  if (riskLevel === "Mild")     return { verdict: "caution",   label: "Reported",          color: "#fbbf24" };
  return                               { verdict: "caution",   label: "Caution",           color: "#fbbf24" };
};

// ── POST /api/scam/check ──────────────────────────────────────────────────────
// Public. Body: { value }
const checkScam = async (req, res) => {
  try {
    const { value } = req.body;
    if (!value || !value.trim()) {
      return res.status(400).json({ success: false, message: "Please provide a value to check." });
    }
    const v = value.trim().toLowerCase();

    // ── Premium AI Integration Layer (ALWAYS RUN) ──────────
    const { analyzeTarget } = require("../services/aiScamAnalyzer");
    const aiPredictive = await analyzeTarget(value.trim());

    const scam = await Scam.findOne({ value: v });

    if (!scam) {
      return res.json({
        status: aiPredictive.aiRiskScore > 20 ? "SUSPICIOUS" : "SAFE",
        verdict: aiPredictive.aiRiskScore > 20 ? "warning" : "safe",
        verdictLabel: aiPredictive.aiRiskScore > 20 ? "AI Flagged" : "AI Verified Safe",
        verdictColor: aiPredictive.aiRiskScore > 20 ? "#f59e0b" : "#10b981",
        reports: 0,
        riskLevel: aiPredictive.aiSeverity,
        riskScore: aiPredictive.aiRiskScore,
        avgRiskScore: aiPredictive.aiRiskScore,
        confidenceLevel: aiPredictive.aiConfidence,
        reasonBreakdown: aiPredictive.aiExplanation,
        communityVerified: false,
        aiSummary: aiPredictive.aiSummary,
        aiKeywords: aiPredictive.aiKeywords,
        aiExplanations: aiPredictive.aiExplanation,
        aiTrend: aiPredictive.aiTrendContribution,
        category: aiPredictive.aiCategory,
        aiConfidence: aiPredictive.aiConfidence,
        message: "AI predictive analysis completed.",
        value: value.trim()
      });
    }

    // Merge DB + AI Predictive
    const details = await calculateRiskScore(scam.value);
    const finalRiskScore = Math.max(details.riskScore, aiPredictive.aiRiskScore);
    const finalSeverity = getSeverityTier(finalRiskScore);
    
    return res.json({
      status: "SCAM",
      verdict: scam.reports >= 10 ? "dangerous" : (scam.reports >= 3 ? "warning" : "caution"),
      verdictLabel: scam.reports >= 10 ? "High Community Threat" : (scam.reports >= 3 ? "Repeated Scam Activity" : "Reported Once"),
      reports: scam.reports,
      riskLevel: details.riskLevel,
      riskScore: details.riskScore,
      avgRiskScore: details.riskScore,
      confidenceLevel: Math.max(details.aiConfidence || 0, aiPredictive.aiConfidence),
      reasonBreakdown: [...new Set([...(details.reasonBreakdown || []), ...aiPredictive.aiExplanation])],
      communityVerified: details.communityVerified,
      aiSummary: aiPredictive.aiRiskScore > (scam.avgRiskScore || 0) ? aiPredictive.aiSummary : (scam.aiSummary || aiPredictive.aiSummary),
      aiKeywords: [...new Set([...(details.aiKeywords || []), ...aiPredictive.aiKeywords])],
      aiExplanations: aiPredictive.aiExplanation,
      aiTrend: scam.aiTrendLabel || aiPredictive.aiTrendContribution,
      category: scam.category || aiPredictive.aiCategory,
      message: "AI predictive analysis merged with community reports.",
      value: scam.value,
      type: scam.type,
      description: scam.description,
      locations: scam.locations,
      lastReportedAt: scam.lastReportedAt,
      relatedCaseIds: scam.relatedCaseIds
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ── GET /api/scam/check?query= ────────────────────────────────────────────────
const checkScamGet = async (req, res) => {
  try {
    const value = req.query.query;
    if (!value || !value.trim()) {
      return res.status(400).json({ success: false, message: "Please provide a query parameter." });
    }
    const v = value.trim().toLowerCase();

    // ── Premium AI Integration Layer (ALWAYS RUN) ──────────
    const { analyzeTarget } = require("../services/aiScamAnalyzer");
    const aiPredictive = await analyzeTarget(value.trim());

    const scam = await Scam.findOne({ value: v });

    if (!scam) {
      return res.json({
        status: aiPredictive.aiRiskScore > 20 ? "SUSPICIOUS" : "SAFE",
        verdict: aiPredictive.aiRiskScore > 20 ? "warning" : "safe",
        verdictLabel: aiPredictive.aiRiskScore > 20 ? "AI Flagged" : "AI Verified Safe",
        verdictColor: aiPredictive.aiRiskScore > 20 ? "#f59e0b" : "#10b981",
        reports: 0,
        riskLevel: aiPredictive.aiSeverity,
        riskScore: aiPredictive.aiRiskScore,
        avgRiskScore: aiPredictive.aiRiskScore,
        confidenceLevel: aiPredictive.aiConfidence,
        reasonBreakdown: aiPredictive.aiExplanation,
        communityVerified: false,
        aiSummary: aiPredictive.aiSummary,
        aiKeywords: aiPredictive.aiKeywords,
        aiExplanations: aiPredictive.aiExplanation,
        aiTrend: aiPredictive.aiTrendContribution,
        category: aiPredictive.aiCategory,
        aiConfidence: aiPredictive.aiConfidence,
        message: "AI predictive analysis completed.",
        value: value.trim()
      });
    }

    // Merge DB + AI Predictive
    const details = await calculateRiskScore(scam.value);
    const finalRiskScore = Math.max(details.riskScore, aiPredictive.aiRiskScore);
    const finalSeverity = getSeverityTier(finalRiskScore);

    return res.json({
      status: "SCAM", 
      verdict: scam.reports >= 10 ? "dangerous" : (scam.reports >= 3 ? "warning" : "caution"),
      verdictLabel: scam.reports >= 10 ? "High Community Threat" : (scam.reports >= 3 ? "Repeated Scam Activity" : "Reported Once"),
      value: scam.value, type: scam.type,
      reports: scam.reports, riskLevel: details.riskLevel,
      riskScore: details.riskScore,
      avgRiskScore: details.riskScore,
      confidenceLevel: Math.max(details.aiConfidence || 0, aiPredictive.aiConfidence),
      reasonBreakdown: [...new Set([...(details.reasonBreakdown || []), ...aiPredictive.aiExplanation])],
      communityVerified: details.communityVerified,
      aiSummary: aiPredictive.aiRiskScore > (scam.avgRiskScore || 0) ? aiPredictive.aiSummary : (scam.aiSummary || aiPredictive.aiSummary),
      aiKeywords: [...new Set([...(details.aiKeywords || []), ...aiPredictive.aiKeywords])],
      aiExplanations: aiPredictive.aiExplanation,
      aiTrend: scam.aiTrendLabel || aiPredictive.aiTrendContribution,
      category: scam.category || aiPredictive.aiCategory,
      message: "AI predictive analysis merged with community reports.",
      actionAdvice: getActionAdvice(scam.category || aiPredictive.aiCategory, finalSeverity),
      description: scam.description,
      locations: scam.locations,
      lastReportedAt: scam.lastReportedAt,
      relatedCaseIds: scam.relatedCaseIds
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ── Action advice based on category ─────────────────────────────────────────
const getActionAdvice = (category, riskLevel) => {
  if (riskLevel === "LOW" || riskLevel === undefined) return null;
  const avoid = {
    "UPI Fraud":       ["Share your UPI PIN or OTP", "Send money to verify your account", "Click payment links from unknown numbers"],
    "Phishing":        ["Click links in this message", "Enter your password on this site", "Download attachments from this source"],
    "Job Scam":        ["Pay any registration or training fee", "Share Aadhaar/PAN for 'verification'", "Work before receiving a written offer"],
    "Lottery Scam":    ["Pay any 'processing fee' to claim prize", "Share bank details to receive winnings", "Believe you won something you didn't enter"],
    "Investment Scam": ["Send money for guaranteed returns", "Invest in unregistered schemes", "Trust promises of daily/weekly profits"],
    "Romance Scam":    ["Send money to someone you haven't met", "Share personal photos or documents", "Trust urgent financial requests"],
    "Identity Theft":  ["Share Aadhaar, PAN, or passport details", "Complete KYC on unofficial platforms", "Give biometric data to unknown agents"],
    "Account Hacking": ["Share OTP or 2FA codes", "Click 'verify account' links", "Give remote access to your device"],
    "Cyber Harassment":["Engage or respond to threats", "Share personal information", "Pay any demanded amount"],
  };
  const doThis = [
    "Block this number/contact immediately",
    "Report to cybercrime.gov.in",
    "Create a CyberShield account to report this scam and strengthen community protection",
    "Warn your contacts about this scam"
  ];
  return { avoid: avoid[category] || ["Share personal information", "Send money", "Click unknown links"], doThis };
};

// ── GET /api/scam/activity — recent scam activity feed ───────────────────────
const getActivity = async (req, res, next) => {
  try {
    const recent = await Scam.find()
      .sort({ lastReportedAt: -1 })
      .limit(8)
      .select("value type category reports riskLevel lastReportedAt");
    res.json({ success: true, data: recent });
  } catch (error) {
    next(error);
  }
};
// Public. Returns top reported scams + stats.
const getTrending = async (req, res, next) => {
  try {
    const topTargets = await Scam.find()
      .sort({ reports: -1 })
      .limit(10)
      .select("value type category reports riskLevel avgRiskScore lastReportedAt locations");

    const topCategories = await Scam.aggregate([
      { $group: { _id: "$category", count: { $sum: "$reports" }, avgRisk: { $avg: "$avgRiskScore" } } },
      { $sort: { count: -1 } },
      { $limit: 6 }
    ]);

    const totalScams    = await Scam.countDocuments();
    const criticalCount = await Scam.countDocuments({ riskLevel: "CRITICAL" });
    const highCount     = await Scam.countDocuments({ riskLevel: "HIGH" });

    const since       = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentCount = await Scam.countDocuments({ lastReportedAt: { $gte: since } });

    // AI Emerging Threats Aggregation
    const Complaint = require("../models/Complaint");
    const emergingThreats = await Complaint.aggregate([
      { $match: { aiTrendContribution: { $ne: "", $ne: "General activity", $ne: null } } },
      { $group: { _id: "$aiTrendContribution", count: { $sum: 1 }, latest: { $max: "$createdAt" } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      success: true,
      topTargets,
      topCategories: topCategories.map(c => ({ category: c._id, count: c.count, avgRisk: Math.round(c.avgRisk) })),
      stats: { totalScams, criticalCount, highCount, recentCount },
      emergingThreats: emergingThreats.map(t => ({ threat: t._id, count: t.count, lastSeen: t.latest }))
    });
  } catch (error) {
    next(error);
  }
};

// ── Internal: upsert Scam doc when a complaint is filed ──────────────────────
// Called from complaintService — NOT an HTTP handler.
const upsertScamIntelligence = async ({ value, category, description, riskScore, caseId, location, aiResults = {} }) => {
  if (!value || value.trim() === "") return;

  const v    = value.trim().toLowerCase();
  const type = detectType(v);

  const existing = await Scam.findOne({ value: v });

  if (existing) {
    existing.reports       += 1;
    existing.lastReportedAt = new Date();
    existing.avgRiskScore   = Math.round(
      (existing.avgRiskScore * (existing.reports - 1) + riskScore) / existing.reports
    );
    existing.riskLevel = getSeverityTier(existing.avgRiskScore);
    if (category)    existing.category    = category;
    if (description) existing.description = description;
    if (location && !existing.locations.includes(location)) existing.locations.push(location);
    if (caseId && !existing.relatedCaseIds.includes(caseId)) existing.relatedCaseIds.push(caseId);
    
    // Update AI intelligence if new results are stronger or existing is empty
    if (aiResults.aiSummary) {
      if (!existing.aiSummary || (aiResults.aiConfidence || 0) > (existing.aiConfidence || 0)) {
        existing.aiSummary     = aiResults.aiSummary;
        existing.aiConfidence  = aiResults.aiConfidence;
        existing.aiKeywords    = aiResults.aiKeywords;
        existing.aiSeverity    = aiResults.aiSeverity;
        existing.aiTrendLabel  = aiResults.aiTrendContribution;
      }
    }
    
    await existing.save();
  } else {
    await Scam.create({
      value: v, type, category, description,
      reports: 1, riskLevel: getSeverityTier(riskScore),
      avgRiskScore: riskScore,
      lastReportedAt: new Date(),
      locations: location ? [location] : [],
      relatedCaseIds: caseId ? [caseId] : [],
      // AI Intelligence Fields
      aiSummary:    aiResults.aiSummary || null,
      aiConfidence: aiResults.aiConfidence || 0,
      aiKeywords:   aiResults.aiKeywords || [],
      aiSeverity:   aiResults.aiSeverity || null,
      aiTrendLabel: aiResults.aiTrendContribution || null
    });
  }
};

module.exports = { checkScam, checkScamGet, getTrending, getActivity, upsertScamIntelligence, updateScamReputation };
