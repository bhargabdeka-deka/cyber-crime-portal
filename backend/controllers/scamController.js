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

// ── Compute risk level from report count + recency ───────────────────────────
const computeRiskLevel = (reports, lastReportedAt) => {
  // Recency boost: reported in last 7 days = +2 virtual reports
  const daysSince = lastReportedAt
    ? (Date.now() - new Date(lastReportedAt)) / (1000 * 60 * 60 * 24)
    : 999;
  const recencyBoost = daysSince < 7 ? 2 : daysSince < 30 ? 1 : 0;
  const effective = reports + recencyBoost;

  if (effective >= 10) return "CRITICAL";
  if (effective >= 5)  return "HIGH";
  if (effective >= 2)  return "MEDIUM";
  return "LOW";
};

// ── Risk level → frontend verdict ────────────────────────────────────────────
const riskToVerdict = (riskLevel, reports) => {
  if (reports === 0)          return { verdict: "safe",      label: "No Reports Found",  color: "#10b981" };
  if (riskLevel === "CRITICAL") return { verdict: "dangerous", label: "Highly Dangerous",  color: "#ef4444" };
  if (riskLevel === "HIGH")     return { verdict: "warning",   label: "Suspicious",        color: "#f59e0b" };
  if (riskLevel === "MEDIUM")   return { verdict: "caution",   label: "Reported",          color: "#f59e0b" };
  return                               { verdict: "caution",   label: "Reported Once",     color: "#f59e0b" };
};

// ── POST /api/scam/check ──────────────────────────────────────────────────────
// Public. Body: { value }
const checkScam = async (req, res) => {
  try {
    const { value } = req.body;
    const v = value.toLowerCase();

    const scam = await Scam.findOne({ value: v });

    if (!scam) {
      return res.json({
        status: "SAFE",
        verdict: "safe",
        verdictLabel: "No Reports Found",
        verdictColor: "#10b981",
        reports: 0,
        riskLevel: "LOW",
        message: "This number/link has not been reported in our database.",
        value: value.trim()
      });
    }

    const { verdict, label, color } = riskToVerdict(scam.riskLevel, scam.reports);

    return res.json({
      status: "SCAM",
      verdict,
      verdictLabel: label,
      verdictColor: color,
      value: scam.value,
      type: scam.type,
      reports: scam.reports,
      riskLevel: scam.riskLevel,
      avgRiskScore: scam.avgRiskScore,
      category: scam.category,
      description: scam.description,
      locations: scam.locations,
      lastReportedAt: scam.lastReportedAt,
      relatedCaseIds: scam.relatedCaseIds
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ── GET /api/scam/check?query= ────────────────────────────────────────────────
const checkScamGet = async (req, res) => {
  try {
    const value = req.query.query;
    const v = value.toLowerCase();

    const scam = await Scam.findOne({ value: v });

    if (!scam) {
      return res.json({
        status: "SAFE", verdict: "safe",
        verdictLabel: "No Reports Found", verdictColor: "#10b981",
        reports: 0, riskLevel: "LOW",
        message: "This number/link has not been reported in our database.",
        value: value.trim()
      });
    }

    const { verdict, label, color } = riskToVerdict(scam.riskLevel, scam.reports);
    return res.json({
      status: "SCAM", verdict,
      verdictLabel: label, verdictColor: color,
      value: scam.value, type: scam.type,
      reports: scam.reports, riskLevel: scam.riskLevel,
      avgRiskScore: scam.avgRiskScore, category: scam.category,
      description: scam.description, locations: scam.locations,
      lastReportedAt: scam.lastReportedAt, relatedCaseIds: scam.relatedCaseIds,
      actionAdvice: getActionAdvice(scam.category, scam.riskLevel)
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
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
  const doThis = ["Block this number/contact immediately", "Report to cybercrime.gov.in", "Warn your contacts about this scam"];
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

    res.json({
      success: true,
      topTargets,
      topCategories: topCategories.map(c => ({ category: c._id, count: c.count, avgRisk: Math.round(c.avgRisk) })),
      stats: { totalScams, criticalCount, highCount, recentCount }
    });
  } catch (error) {
    next(error);
  }
};

// ── Internal: upsert Scam doc when a complaint is filed ──────────────────────
// Called from complaintService — NOT an HTTP handler.
const upsertScamIntelligence = async ({ value, category, description, riskScore, caseId, location }) => {
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
    existing.riskLevel = computeRiskLevel(existing.reports);
    if (category)    existing.category    = category;
    if (description) existing.description = description;
    if (location && !existing.locations.includes(location)) existing.locations.push(location);
    if (caseId && !existing.relatedCaseIds.includes(caseId)) existing.relatedCaseIds.push(caseId);
    await existing.save();
  } else {
    await Scam.create({
      value: v, type, category, description,
      reports: 1, riskLevel: computeRiskLevel(1),
      avgRiskScore: riskScore,
      lastReportedAt: new Date(),
      locations: location ? [location] : [],
      relatedCaseIds: caseId ? [caseId] : []
    });
  }
};

module.exports = { checkScam, checkScamGet, getTrending, getActivity, upsertScamIntelligence };
