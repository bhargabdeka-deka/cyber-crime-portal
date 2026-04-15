const express = require("express");
const { checkScam, checkScamGet, getTrending } = require("../controllers/scamController");

const router = express.Router();

// Public routes — no auth needed
router.post("/check",    checkScam);     // POST /api/scam/check   { value }
router.get("/check",     checkScamGet);  // GET  /api/scam/check?query=
router.get("/trending",  getTrending);   // GET  /api/scam/trending

module.exports = router;
