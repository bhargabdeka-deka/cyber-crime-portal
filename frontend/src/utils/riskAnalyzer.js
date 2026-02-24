const analyzeComplaint = (title, description) => {
  const text = (title + " " + description).toLowerCase();

  let crimeType = "General";
  let riskScore = 10;

  if (
    text.includes("otp") ||
    text.includes("bank") ||
    text.includes("account") ||
    text.includes("money") ||
    text.includes("upi")
  ) {
    crimeType = "Financial Fraud";
    riskScore = 80;
  }

  if (
    text.includes("threat") ||
    text.includes("blackmail") ||
    text.includes("harassment")
  ) {
    crimeType = "Harassment";
    riskScore = 60;
  }

  if (
    text.includes("aadhaar") ||
    text.includes("pan") ||
    text.includes("identity")
  ) {
    crimeType = "Identity Theft";
    riskScore = 75;
  }

  if (
    text.includes("hacked") ||
    text.includes("password")
  ) {
    crimeType = "Account Hacking";
    riskScore = 70;
  }

  let priority = "Low";

  if (riskScore >= 80) priority = "Critical";
  else if (riskScore >= 60) priority = "High";
  else if (riskScore >= 40) priority = "Medium";

  return { crimeType, riskScore, priority };
};

export default analyzeComplaint;