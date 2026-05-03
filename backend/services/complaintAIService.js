const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

// Debug: Check API Key
if (!process.env.GEMINI_API_KEY) {
  console.error("[AI-SERVICE] CRITICAL ERROR: GEMINI_API_KEY is missing from .env file!");
} else {
  console.log("[AI-SERVICE] Gemini API Key loaded successfully.");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });
console.log("Gemini Model Active");


/**
 * Generates an AI Safety Summary and guidance for a submitted complaint.
 * @param {Object} complaintData - The data submitted by the user.
 * @returns {Promise<Object>} - Structured AI safety guidance.
 */
const generateComplaintAISummary = async (complaintData) => {
  console.log("[AI-SERVICE] Analyzing Complaint Input:", JSON.stringify(complaintData, null, 2));
  
  try {
    const { title, scamType, scamTarget, description, location, evidenceStatus } = complaintData;

    const prompt = `
      You are an Expert Cyber Crime Investigator at CyberShield. 
      Your task is to conduct a deep analysis of the following user complaint and provide a high-intelligence, context-aware safety guidance response.

      COMPLAINT INTEL:
      - Title: ${title}
      - Initial Category: ${scamType}
      - Reported Target (ID/URL/Number): ${scamTarget}
      - Full Description: ${description}
      - Location: ${location}
      - Evidence Available: ${evidenceStatus ? 'Yes' : 'No'}

      ANALYSIS REQUIREMENTS:
      1. **Likely Scam Type**: Identify the specific sub-category (e.g., "SBI KYC Phishing", "Telegram Task Fraud", "UPI Collect-Request Scam", "OLX QR Code Fraud"). Do NOT use generic labels like "Digital Risk" or "General Fraud".
      2. **Severity Level**: Determine if this is Low, Medium, High, or Critical based on financial loss, data theft risk, and ongoing threat.
      3. **Confidence Score**: Provide a realistic percentage (0-100) based on the clarity of details provided in the description.
      4. **Immediate Actions**: Provide 3-5 specific, high-priority steps the user MUST take now based on the scam type (e.g., "Dial 1930 immediately", "Freeze the specific UPI ID in your banking app", "Revoke Google Account permissions").
      5. **Prevention Tips**: Provide 2-4 future-proofing tips tailored to this specific scam pattern.
      6. **Reassurance**: Provide a professional yet empathetic message that acknowledges the specific situation.

      STRICT OUTPUT REQUIREMENT:
      Return ONLY a valid JSON object. No markdown, no "json" tag, no introduction, no explanation.
      
      JSON SCHEMA:
      {
        "likelyScamType": "Specific investigative category",
        "severityLevel": "Low | Medium | High | Critical",
        "confidenceScore": number,
        "immediateActions": ["Specific action 1", "Specific action 2", "..."],
        "preventionTips": ["Specific tip 1", "Specific tip 2", "..."],
        "reassuranceMessage": "Context-aware professional reassurance",
        "disclaimer": "Standard AI safety disclaimer"
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rawText = response.text();
    
    console.log("[AI-SERVICE] Gemini Raw Output:", rawText);

    // Robust JSON cleaning
    let cleanText = rawText.trim();
    // Remove markdown code blocks if present
    if (cleanText.startsWith("```")) {
      cleanText = cleanText.replace(/^```(json)?/, "").replace(/```$/, "").trim();
    }
    
    // Find the first { and last } to isolate the JSON object
    const startIdx = cleanText.indexOf("{");
    const endIdx = cleanText.lastIndexOf("}");
    
    if (startIdx === -1 || endIdx === -1) {
      throw new Error("Could not find JSON object in Gemini response");
    }
    
    cleanText = cleanText.substring(startIdx, endIdx + 1);

    try {
      const parsed = JSON.parse(cleanText);
      
      // Ensure all fields exist with defaults
      const finalResult = {
        likelyScamType: parsed.likelyScamType || "Cyber Fraud Attempt",
        severityLevel: parsed.severityLevel || "Medium",
        confidenceScore: parsed.confidenceScore || 65,
        immediateActions: Array.isArray(parsed.immediateActions) && parsed.immediateActions.length > 0 
          ? parsed.immediateActions 
          : ["Do not share OTPs", "Block the scammer", "Secure your bank account"],
        preventionTips: Array.isArray(parsed.preventionTips) && parsed.preventionTips.length > 0
          ? parsed.preventionTips
          : ["Enable 2FA", "Avoid suspicious links"],
        reassuranceMessage: parsed.reassuranceMessage || "Your report has been logged. CyberShield investigators will review the evidence.",
        disclaimer: parsed.disclaimer || "This is an AI-generated preliminary assessment. Final admin verification is pending."
      };

      console.log("[AI-SERVICE] Successfully Parsed JSON:", JSON.stringify(finalResult, null, 2));
      return finalResult;

    } catch (parseError) {
      console.error("[AI-SERVICE] JSON Parse Error. Raw data was:", cleanText);
      throw parseError;
    }

  } catch (error) {
    console.error("[AI-SERVICE] Generation/Parsing Failed. Reason:", error.message);
    
    // Fallback: This is what the user is seeing when it fails
    return {
      likelyScamType: "Cyber Intelligence Alert",
      severityLevel: "High",
      confidenceScore: 40,
      immediateActions: [
        "Change your online banking passwords immediately.",
        "Report the suspicious transaction to your bank's toll-free number.",
        "Secure your email and social media accounts with Two-Factor Authentication (2FA)."
      ],
      preventionTips: [
        "Never share your OTP, PIN, or CVV with anyone calling from 'banks' or 'service providers'.",
        "Avoid clicking on links received from unknown numbers or emails."
      ],
      reassuranceMessage: "Your complaint has been successfully recorded in the CyberShield network. Preliminary guidance is provided for your safety while admin review is underway.",
      disclaimer: "AI guidance is temporarily operating in fallback mode. Final verification by expert investigators is pending."
    };
  }
};

module.exports = { generateComplaintAISummary };
