const mongoose = require("mongoose");
require("dotenv").config();

const Complaint = require("./models/Complaint");
const { analyzeScam } = require("./services/aiScamAnalyzer");

async function reAnalyze() {
  await mongoose.connect(process.env.MONGO_URI);
  const pending = await Complaint.find({ aiCategory: null });
  console.log(`Found ${pending.length} complaints needing AI analysis.`);

  for (const c of pending) {
    console.log(`Analyzing Case: ${c.caseId}...`);
    try {
      const aiResults = await analyzeScam(c.description, c.scamTarget);
      
      c.aiCategory = aiResults.aiCategory;
      c.aiConfidence = aiResults.aiConfidence;
      c.aiRiskScore = aiResults.aiRiskScore;
      c.aiSeverity = aiResults.aiSeverity;
      c.aiKeywords = aiResults.aiKeywords;
      c.aiExplanation = aiResults.aiExplanation;
      c.aiSummary = aiResults.aiSummary;
      c.aiRecommendation = aiResults.aiRecommendation;
      c.aiTrendContribution = aiResults.aiTrendContribution;
      
      // Update main fields if AI found something stronger
      if (aiResults.aiRiskScore > c.riskScore) c.riskScore = aiResults.aiRiskScore;
      if (aiResults.aiSeverity) c.priority = aiResults.aiSeverity;

      await c.save();
      console.log(`✅ Updated Case: ${c.caseId}`);
    } catch (err) {
      console.error(`❌ Failed Case: ${c.caseId}`, err.message);
    }
  }

  mongoose.disconnect();
  console.log("Done!");
}

reAnalyze();
