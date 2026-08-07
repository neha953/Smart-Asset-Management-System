require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const db = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const verifyToken = require("./middleware/authMiddleware");
const authorizeRole = require("./middleware/roleMiddleware");

const app = express();

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});

app.use(limiter);

// Routes
app.use("/api/auth", authRoutes);

// Public Route
app.get("/", (req, res) => {
    res.send("Smart Asset Management API Running");
});

// Protected Route
app.get("/api/admin/dashboard", verifyToken, authorizeRole("Admin"), (req, res) => {

    res.status(200).json({
        success: true,
        message: "Welcome Admin",
        user: req.user
    });

});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});