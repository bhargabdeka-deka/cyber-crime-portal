const createComplaintService = async (userId, title, description, file) => {
  const caseId = "CASE-" + Date.now();

  const { crimeType, riskScore, priority } =
    analyzeComplaint(title, description);

  const complaint = new Complaint({
    caseId,
    user: userId,
    title,
    description,
    crimeType,
    riskScore,
    priority,
    evidence: file ? file.path.replace(/\\/g, "/") : null
  });

  const savedComplaint = await complaint.save();

  // 🔥 EMAIL ALERT FOR CRITICAL CASE
  if (savedComplaint.riskScore >= 80) {
    await sendEmail(
      "🚨 Critical Cyber Crime Alert",
      `
A critical complaint has been submitted.

Case ID: ${savedComplaint.caseId}
Crime Type: ${savedComplaint.crimeType}
Risk Score: ${savedComplaint.riskScore}
Priority: ${savedComplaint.priority}

Please log in to the admin dashboard immediately.
`
    );
  }

  return savedComplaint;
};
