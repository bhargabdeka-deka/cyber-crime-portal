const analyzeComplaint = (title = "", description = "") => {
  const text = (title + " " + description).toLowerCase();

  const categories = {
    "Financial Fraud":  { keywords: ["otp","bank","account","upi","money","transfer","transaction","fraud","payment","credit card","debit card","wallet"], weight: 15 },
    "Identity Theft":   { keywords: ["identity","aadhaar","pan","pan card","documents","kyc","ssn","passport"], weight: 14 },
    "Account Hacking":  { keywords: ["hacked","password","login","unauthorized","access","breach","phishing","2fa"], weight: 13 },
    "Cyber Harassment": { keywords: ["threat","blackmail","harassment","extortion","cyberbullying","stalking","abuse"], weight: 12 },
    "Job Scam":         { keywords: ["job","work from home","hiring","salary","offer letter","recruitment","part time","earn money","daily income","task"], weight: 14 },
    "Lottery Scam":     { keywords: ["lottery","winner","prize","lucky draw","congratulations","claim","reward","gift"], weight: 13 },
    "Investment Scam":  { keywords: ["invest","returns","profit","trading","crypto","bitcoin","double money","scheme","ponzi","roi","guaranteed"], weight: 15 },
    "Romance Scam":     { keywords: ["love","relationship","dating","girlfriend","boyfriend","marriage","send money","emergency","stranded"], weight: 12 }
  };

  const categoryToScamType = {
    "Financial Fraud": "UPI Fraud", "Identity Theft": "Identity Theft",
    "Account Hacking": "Account Hacking", "Cyber Harassment": "Cyber Harassment",
    "Job Scam": "Job Scam", "Lottery Scam": "Lottery Scam",
    "Investment Scam": "Investment Scam", "Romance Scam": "Romance Scam"
  };

  let totalScore = 0, matchedKeywords = [], categoryScores = {};

  for (const category in categories) {
    const { keywords, weight } = categories[category];
    let cs = 0;
    const hits = keywords.filter(w => text.includes(w));
    hits.forEach(w => { matchedKeywords.push(w); });
    cs = hits.length * weight;
    totalScore += cs;
    if (cs > 0) categoryScores[category] = cs;
  }

  if (totalScore === 0) totalScore = 20;
  if (totalScore > 95)  totalScore = 95;

  let primaryCategory = "General";
  if (Object.keys(categoryScores).length > 0)
    primaryCategory = Object.keys(categoryScores).reduce((a, b) => categoryScores[a] > categoryScores[b] ? a : b);

  const scamType = categoryToScamType[primaryCategory] || "Other";
  let priority = "Low";
  if (totalScore >= 75) priority = "Critical";
  else if (totalScore >= 55) priority = "High";
  else if (totalScore >= 35) priority = "Medium";

  return { crimeType: primaryCategory, scamType, riskScore: totalScore, priority, matchedKeywords };
};

export default analyzeComplaint;
