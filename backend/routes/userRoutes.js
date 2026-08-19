const express = require("express");
const router = express.Router();

const {
    getMyProfile,
    updateMyProfile,
    changeMyPassword
} = require("../controllers/userController");

const verifyToken = require("../middleware/authMiddleware");

router.get("/me", verifyToken, getMyProfile);
router.put("/me", verifyToken, updateMyProfile);
router.put("/me/password", verifyToken, changeMyPassword);

module.exports = router;