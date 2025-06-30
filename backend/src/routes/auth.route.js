const express = require("express");
const { handleControlLogin, handleControlSignup, handleControlLogOut, handleControlUpdateProfile, checkAuth } = require("../controllers/auth.controller");
const protectRoute = require("../middlewares/auth.middleware");


const router = express.Router();

router.post("/login",handleControlLogin);
router.post("/signup",handleControlSignup);
router.post("/logout",handleControlLogOut);

router.put("/update-profile",protectRoute,handleControlUpdateProfile);

router.get("/check",protectRoute,checkAuth);

module.exports = router;