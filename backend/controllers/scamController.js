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

// ── Compute risk level from report count ─────────────────────────────────────
const computeRiskLevel = (reports) => {
  if (reports >= 10) return "CRITICAL";
  if (reports >= 5)  return "HIGH";
  if (reports >= 2)  return "MEDIUM";
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
    if (!value || value.trim().length < 3)
      return res.status(400).json({ message: "Please provide a valid phone, URL, or UPI ID." });

    const scam = await Scam.findOne({ value: value.trim().toLowerCase() });

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
// Public. Query param version (for GET requests from frontend).
const checkScamGet = async (req, res) => {
  req.body = { value: req.query.query };
  return checkScam(req, res);
};

// ── GET /api/scam/trending ────────────────────────────────────────────────────
// Public. Returns top reported scams + stats.
const getTrending = async (req, res) => {
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
      topTargets,
      topCategories: topCategories.map(c => ({ category: c._id, count: c.count, avgRisk: Math.round(c.avgRisk) })),
      stats: { totalScams, criticalCount, highCount, recentCount }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
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

module.exports = { checkScam, checkScamGet, getTrending, upsertScamIntelligence };
