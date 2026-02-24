const analyzeComplaint = (title = "", description = "") => {
  const text = (title + " " + description).toLowerCase();

  let crimeType = "General";
  let riskScore = 0;
  let matchedKeywords = [];

  // Financial Fraud Keywords
  const financialKeywords = ["otp", "bank", "account", "upi", "money", "transfer", "transaction"];
  const harassmentKeywords = ["threat", "blackmail", "harassment"];
  const identityKeywords = ["identity", "aadhaar", "pan card"];
  const hackingKeywords = ["hacked", "password", "login", "unauthorized"];

  // Financial fraud detection
  financialKeywords.forEach(word => {
    if (text.includes(word)) {
      riskScore += 15;
      crimeType = "Financial Fraud";
      matchedKeywords.push(word);
    }
  });

  // Harassment detection
  harassmentKeywords.forEach(word => {
    if (text.includes(word)) {
      riskScore += 12;
      crimeType = "Harassment";
      matchedKeywords.push(word);
    }
  });

  // Identity theft detection
  identityKeywords.forEach(word => {
    if (text.includes(word)) {
      riskScore += 14;
      crimeType = "Identity Theft";
      matchedKeywords.push(word);
    }
  });

  // Account hacking detection
  hackingKeywords.forEach(word => {
    if (text.includes(word)) {
      riskScore += 13;
      crimeType = "Account Hacking";
      matchedKeywords.push(word);
    }
  });

  // Minimum base risk
  if (riskScore === 0) {
    riskScore = 20;
  }

  // Cap maximum risk
  if (riskScore > 95) {
    riskScore = 95;
  }

  // Determine Priority
  let priority = "Low";

  if (riskScore >= 75) {
    priority = "Critical";
  } else if (riskScore >= 55) {
    priority = "High";
  } else if (riskScore >= 35) {
    priority = "Medium";
  }

  return { crimeType, riskScore, priority, matchedKeywords };
};

module.exports = analyzeComplaint;