const { analyzeTarget } = require("./backend/services/aiScamAnalyzer");

async function test() {
  const targets = ["9876543210", "sbi-kyc-verify.xyz", "safe-site.com"];
  for (const t of targets) {
    const res = await analyzeTarget(t);
    console.log(`Target: ${t}`);
    console.log(`Risk Score: ${res.aiRiskScore}`);
    console.log(`Severity: ${res.aiSeverity}`);
    console.log(`Category: ${res.aiCategory}`);
    console.log("---");
  }
}

test();
