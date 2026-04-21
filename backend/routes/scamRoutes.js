const express = require("express");
const { checkScam, checkScamGet, getTrending, getActivity } = require("../controllers/scamController");

const { validateScamCheck, validateScamCheckGet, handleValidationErrors } = require("../validators/scamValidator");

const router = express.Router();

router.post("/check",    validateScamCheck, handleValidationErrors, checkScam);
router.get("/check",     validateScamCheckGet, handleValidationErrors, checkScamGet);
router.get("/trending",  getTrending);
router.get("/activity",  getActivity);

module.exports = router;
