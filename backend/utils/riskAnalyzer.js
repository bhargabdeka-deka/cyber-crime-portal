const analyzeComplaint = (title = "", description = "") => {
  const text = (title + " " + description).toLowerCase();

  // ===== CYBER CRIME CATEGORIES =====
  const categories = {
    "Financial Fraud": {
      keywords: [
        "otp", "bank", "account", "upi", "money",
        "transfer", "transaction", "fraud", "payment",
        "credit card", "debit card"
      ],
      weight: 15
    },
    "Identity Theft": {
      keywords: [
        "identity", "aadhaar", "pan", "pan card",
        "documents", "kyc", "ssn"
      ],
      weight: 14
    },
    "Account Hacking": {
      keywords: [
        "hacked", "password", "login", "unauthorized",
        "access", "breach", "phishing"
      ],
      weight: 13
    },
    "Cyber Harassment": {
      keywords: [
        "threat", "blackmail", "harassment",
        "extortion", "cyberbullying", "stalking"
      ],
      weight: 12
    }
  };

  let totalScore = 0;
  let matchedKeywords = [];
  let categoryScores = {};

  // ===== CATEGORY SCORING =====
  for (const category in categories) {
    const { keywords, weight } = categories[category];
    let categoryScore = 0;

    keywords.forEach(word => {
      if (text.includes(word)) {
        categoryScore += weight;
        totalScore += weight;
        matchedKeywords.push(word);
      }
    });

    if (categoryScore > 0) {
      categoryScores[category] = categoryScore;
    }
  }

  // ===== MINIMUM BASE SCORE =====
  if (totalScore === 0) {
    totalScore = 20;
  }

  // ===== MAX CAP =====
  if (totalScore > 95) {
    totalScore = 95;
  }

  // ===== PRIMARY CRIME TYPE =====
  let primaryCrimeType = "General";

  if (Object.keys(categoryScores).length > 0) {
    primaryCrimeType = Object.keys(categoryScores).reduce((a, b) =>
      categoryScores[a] > categoryScores[b] ? a : b
    );
  }

  // ===== PRIORITY LEVEL =====
  let priority = "Low";

  if (totalScore >= 75) {
    priority = "Critical";
  } else if (totalScore >= 55) {
    priority = "High";
  } else if (totalScore >= 35) {
    priority = "Medium";
  }

  // ===== CONFIDENCE LEVEL =====
  let confidence = "Low";

  if (matchedKeywords.length >= 6) {
    confidence = "High";
  } else if (matchedKeywords.length >= 3) {
    confidence = "Medium";
  }

  // ===== EXPLANATION (FOR VIVA + REPORT) =====
  let explanation = "Limited cybercrime indicators detected.";

  if (confidence === "High") {
    explanation =
      "Multiple high-risk cybercrime indicators detected across different categories.";
  } else if (confidence === "Medium") {
    explanation =
      "Moderate number of suspicious cybercrime indicators detected.";
  }

  return {
    crimeType: primaryCrimeType,
    riskScore: totalScore,
    priority,
    confidence,
    matchedKeywords,
    explanation
  };
};

module.exports = analyzeComplaint;
