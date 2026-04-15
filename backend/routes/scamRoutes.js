const express = require("express");
const { checkScam, checkScamGet, getTrending, getActivity } = require("../controllers/scamController");

const router = express.Router();

router.post("/check",    checkScam);
router.get("/check",     checkScamGet);
router.get("/trending",  getTrending);
router.get("/activity",  getActivity);

module.exports = router;
