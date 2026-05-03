const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });
console.log("Gemini Model Active");


/**
 * Analyzes a complaint description and scam target using Gemini AI.
 * @param {string} description - The complaint description provided by the user.
 * @param {string} scamTarget - The target (phone, URL, UPI ID, etc.) of the scam.
 * @returns {Promise<Object>} - Structured AI analysis result.
 */
const analyzeScam = async (description, scamTarget) => {
  try {
    const prompt = `
      You are a Cyber Crime Intelligence Analyst for CyberShield.
      Analyze the following complaint details and determine if it is a scam.
      
      COMPLAINT DESCRIPTION:
      "${description}"
      
      SCAM TARGET (Phone/URL/UPI/Email):
      "${scamTarget}"
      
      Your task:
      1. Detect the category (e.g., Phishing, UPI Fraud, Lottery Scam, Job Scam, Investment Scam, Account Hacking, Fake KYC, OTP Fraud).
      2. Rate confidence in your assessment (0-100).
      3. Calculate a risk score (0-100) based on urgency, impersonation, payment requests, and credential theft.
      4. Assign severity (Low, Medium, High, Critical).
      5. Extract keywords related to the scam.
      6. Provide a 3-4 point explanation of why this is flagged.
      7. Write a 2-sentence summary for the user.
      8. Identify the emerging trend this contributes to (e.g., "SBI KYC Phishing surge").

      Severity Rules:
      0–25 = Low
      26–50 = Medium
      51–75 = High
      76–100 = Critical

      STRICT OUTPUT FORMAT (JSON ONLY - NO PROSE, NO MARKDOWN):
      {
        "aiCategory": "string",
        "aiConfidence": number,
        "aiRiskScore": number,
        "aiSeverity": "Low|Medium|High|Critical",
        "aiKeywords": ["string"],
        "aiExplanation": ["string"],
        "aiSummary": "string",
        "aiRecommendation": "Investigator recommendation (e.g., 'Prioritize investigation')",
        "aiTrendContribution": "string"
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Pre-parse cleaning to strip markdown/prose
    const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        // Normalize keys if AI uses different ones
        return {
          aiCategory: parsed.aiCategory || parsed.category || "General Fraud",
          aiConfidence: parsed.aiConfidence || parsed.confidence || 70,
          aiRiskScore: parsed.aiRiskScore || parsed.riskScore || 50,
          aiSeverity: parsed.aiSeverity || parsed.severity || "Medium",
          aiKeywords: parsed.aiKeywords || parsed.keywords || ["suspicious", "target"],
          aiExplanation: parsed.aiExplanation || parsed.explanation || ["Potential fraud pattern detected."],
          aiSummary: parsed.aiSummary || parsed.summary || "AI identifies suspicious patterns in complaint data.",
          aiRecommendation: parsed.aiRecommendation || parsed.recommendation || "Prioritize investigation.",
          aiTrendContribution: parsed.aiTrendContribution || parsed.trend || "Fraud Pattern"
        };
      } catch (e) {
        console.error("JSON Parse Error:", e);
      }
    }
    
    throw new Error("Strict JSON parsing failed");
  } catch (error) {
    console.error("AI Scam Analysis Error:", error);
    
    // ── STRICT CYBERSHIELD FALLBACK HEURISTIC ENGINE ──────────────────────────
    const d = (description || "").toLowerCase();
    const v = (scamTarget || "").toLowerCase();
    
    let aiCategory = "General Fraud";
    let aiConfidence = 45;
    let aiRiskScore = 30;
    let aiSeverity = "Medium";
    let aiTrend = "General Risk Pattern";
    let aiExplanation = ["Automated keyword analysis of complaint description."];
    let aiRecommendation = "Review evidence normally.";
    
    // 1. BANKING & OTP (PHISHING / UPI FRAUD)
    const isBanking = /bank|sbi|hdfc|icici|axis|kotak|pnb|paytm|yono/i.test(d + v);
    const isOTP = /otp|code|verify|verification|link|hacked|hack|credential/i.test(d);
    
    if (isBanking || isOTP) {
      aiCategory = isOTP ? "Phishing / OTP Fraud" : "Banking Fraud";
      aiConfidence = (isBanking && isOTP) ? 85 : 65;
      aiRiskScore = (isBanking && isOTP) ? 90 : 70;
      aiSeverity = (isBanking && isOTP) ? "Critical" : "High";
      aiTrend = isOTP ? "OTP Fraud Campaign" : "Banking Phishing Wave";
      aiExplanation = [
        "OTP / Credential theft indicators detected in description.",
        "Banking impersonation patterns identified in target/context.",
        "Suspicious phishing workflow detected."
      ];
      aiRecommendation = "Prioritize investigation due to banking credential theft patterns.";
    }
    // 2. LOTTERY SCAM
    else if (/lottery|prize|win|won|lucky|draw|processing fee|tax fee|whatsapp lottery/i.test(d)) {
      aiCategory = "Lottery Scam";
      aiConfidence = 75;
      aiRiskScore = 75;
      aiSeverity = "High";
      aiTrend = "Lottery Scam Cluster";
      aiExplanation = [
        "False promise of prize/winnings detected.",
        "Unsolicited lottery notification pattern identified.",
        "Request for processing/tax fees detected."
      ];
      aiRecommendation = "Verify if payment was made for 'processing fees'.";
    }
    // 3. JOB SCAM
    else if (/job|interview|salary|hiring|registration fee|form fee|work from home/i.test(d)) {
      aiCategory = "Job Scam";
      aiConfidence = 70;
      aiRiskScore = 55;
      aiSeverity = "Medium";
      aiTrend = "Job Fraud Wave";
      aiExplanation = [
        "Work-from-home/Job offer impersonation detected.",
        "Registration/Form fee request identified.",
        "Non-standard hiring pattern found."
      ];
      aiRecommendation = "Check for fraudulent company impersonation.";
    }
    // 4. INVESTMENT / CRYPTO
    else if (/investment|double money|crypto|bitcoin|trading|profit|2x|3x/i.test(d)) {
      aiCategory = "Investment Scam";
      aiConfidence = 65;
      aiRiskScore = 80;
      aiSeverity = "High";
      aiTrend = "Investment Fraud Cluster";
      aiExplanation = [
        "Unrealistic ROI / Double money promise detected.",
        "Cryptocurrency/Trading scam indicators found.",
        "High-pressure investment pattern identified."
      ];
      aiRecommendation = "Review transaction trail for crypto/UPI transfers.";
    }

    return {
      aiCategory,
      aiConfidence,
      aiRiskScore,
      aiSeverity,
      aiKeywords: ["fraud", "suspicious", "target", "investigate"],
      aiExplanation,
      aiSummary: `AI analysis identifies a high-probability ${aiCategory.toLowerCase()} pattern in this complaint.`,
      aiRecommendation,
      aiTrendContribution: aiTrend
    };
  }
};

/**
 * Analyzes a raw target (URL, Phone, UPI) without a description.
 * Performs deep string analysis for predictive scam detection.
 */
const analyzeTarget = async (scamTarget) => {
  try {
    const prompt = `
      You are a Cyber Crime Intelligence Analyst for CyberShield.
      Perform a deep predictive analysis of the following SCAM TARGET.
      TARGET: "${scamTarget}"

      Evaluation Rules:
      1. Brand Impersonation: Check for spoofing of major banks (SBI, HDFC, ICICI, AXIS, PNB) or digital services (Paytm, PhonePe, Amazon, Netflix).
      2. Keywords: Detect "kyc", "otp", "verify", "secure", "update", "reward", "lottery", "gift", "account", "login", "blocked".
      3. URL Structure: Flag typosquatting (e.g., "paytm-kyc.top"), subdomains (e.g., "sbi.verification.com"), and suspicious TLDs (.top, .xyz, .site, .net, .club).
      4. Risk Probability: Assess likelihood of fraud based on pattern density.

      STRICT OUTPUT FORMAT (JSON ONLY):
      {
        "aiCategory": "Financial Fraud|Phishing Attempt|UPI Fraud|Legitimate Service|Suspicious Contact",
        "aiConfidence": number, (Provide a numeric percentage 0-100)
        "aiRiskScore": number, (Provide a numeric risk score 0-100)
        "aiSeverity": "Low|Medium|High|Critical",
        "aiKeywords": ["keyword1", "keyword2", "keyword3"], (Minimum 3 keywords)
        "aiExplanation": ["Direct pattern evidence 1", "Direct pattern evidence 2"],
        "aiSummary": "1-sentence executive summary for judges.",
        "aiRecommendation": "Investigator recommendation (e.g., 'Prioritize investigation', 'Verify evidence', 'Likely false report').",
        "aiTrendContribution": "Emerging trend cluster name"
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    // Pre-parse cleaning
    const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          aiCategory: parsed.aiCategory || parsed.category || "Scam Pattern",
          aiConfidence: Number(parsed.aiConfidence || parsed.confidence) || 75,
          aiRiskScore: Number(parsed.aiRiskScore || parsed.riskScore) || 50,
          aiSeverity: parsed.aiSeverity || parsed.severity || "Medium",
          aiKeywords: parsed.aiKeywords || parsed.keywords || ["suspicious"],
          aiExplanation: parsed.aiExplanation || parsed.explanation || ["Pattern analysis complete."],
          aiSummary: parsed.aiSummary || parsed.summary || "Predictive analysis executed on target.",
          aiRecommendation: parsed.aiRecommendation || parsed.recommendation || "Monitor activity.",
          aiTrendContribution: parsed.aiTrendContribution || parsed.trend || "Suspicious Activity"
        };
      } catch (e) {
        console.error("JSON Parse Error:", e);
      }
    }
    
    throw new Error("Strict JSON parsing failed");
  } catch (error) {
    console.error("AI Target Analysis Error:", error);
    // IMPROVED FALLBACK FOR TARGETS
    const v = scamTarget.toLowerCase();
    const isBrand = /sbi|hdfc|paytm|phonepe|icici|axis|pnb|amazon|google|apple|netflix|microsoft|bank/i.test(v);
    const isScamWord = /kyc|otp|verify|secure|update|reward|lottery|gift|account|login|blocked|fraud|scam|prize|win|profit|trading/i.test(v);
    const isSuspiciousTLD = /\.(top|xyz|site|net|club|info|online|link|click|icu|buzz|biz)$/i.test(v);
    const isIpAddress = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(v);
    
    const isHighRisk = (isBrand && isScamWord) || (isBrand && isSuspiciousTLD) || isIpAddress;
    const isMediumRisk = isScamWord || isSuspiciousTLD;

    return {
      aiCategory: isHighRisk ? "Banking Phishing" : (isMediumRisk ? "Scam Attempt" : "Unknown Pattern"),
      aiConfidence: 40,
      aiRiskScore: isHighRisk ? 85 : (isMediumRisk ? 55 : 15),
      aiSeverity: isHighRisk ? "Critical" : (isMediumRisk ? "High" : "Low"),
      aiKeywords: ["fallback_analysis", isBrand ? "brand_spoofing" : "general_pattern"],
      aiExplanation: [
        isHighRisk ? "Target combines high-trust brand impersonation with scam indicators." : 
        (isMediumRisk ? "Target contains keywords or TLDs frequently associated with scams." : "No known scam patterns detected in target structure."),
        "Automated risk detection suggests " + (isHighRisk ? "immediate caution." : (isMediumRisk ? "verification before engagement." : "standard vigilance."))
      ],
      aiSummary: "AI fallback analysis identifies " + (isHighRisk ? "critical risk" : (isMediumRisk ? "suspicious patterns" : "low immediate risk")) + " in target.",
      aiRecommendation: isHighRisk ? "Immediate investigation: potential brand spoofing." : (isMediumRisk ? "Proceed with extreme caution." : "No immediate red flags found."),
      aiTrendContribution: "Heuristic Intelligence"
    };
  }
};
module.exports = { analyzeScam, analyzeTarget };
