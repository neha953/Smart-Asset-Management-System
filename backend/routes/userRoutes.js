const express = require("express");
const router = express.Router();

const {
    getMyProfile,
    updateMyProfile,
    changeMyPassword,
    listUsers,
    addUser,
    removeUser
} = require("../controllers/userController");

const verifyToken = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/roleMiddleware");

router.get("/me", verifyToken, getMyProfile);
router.put("/me", verifyToken, updateMyProfile);
router.put("/me/password", verifyToken, changeMyPassword);

router.get("/", verifyToken, authorizeRole("Admin"), listUsers);
router.post("/", verifyToken, authorizeRole("Admin"), addUser);
router.delete("/:id", verifyToken, authorizeRole("Admin"), removeUser);

module.exports = router;