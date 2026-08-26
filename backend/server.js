require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cron = require("node-cron");
const { checkExpiries } = require("./utils/expiryChecker");

const app = express();

const userRoutes = require("./routes/userRoutes");
const emailSettingsRoutes = require("./routes/emailSettingsRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const authRoutes = require("./routes/authRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const assetRoutes = require("./routes/assetRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const maintenanceRoutes = require("./routes/maintenanceRoutes");
const softwareLicenseRoutes = require("./routes/softwareLicenseRoutes");
const auditLogRoutes = require("./routes/auditLogRoutes");
const warrantyRoutes = require("./routes/warrantyRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const reportRoutes = require("./routes/reportRoutes");

// ========================================
// SECURITY MIDDLEWARE
// ========================================

app.use(
    helmet({
        contentSecurityPolicy: false
    })
);

const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many requests. Please try again later."
    }
});

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many login attempts. Please try again in 15 minutes."
    }
});

app.use("/api", generalLimiter);
app.use("/api/auth/login", loginLimiter);

// ========================================
// MIDDLEWARE
// ========================================

app.use(cors());

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);

const frontendPath = path.resolve(
    __dirname,
    "..",
    "Frontend",
    "UI-Design"
);

app.use(
    express.static(frontendPath)
);

function sendFrontendPage(res, fileName) {

    const filePath = path.join(
        frontendPath,
        fileName
    );

    if (!fs.existsSync(filePath)) {

        return res.status(404).send(
            `${fileName} not found at: ${filePath}`
        );
    }

    return res.sendFile(filePath);
}

app.get("/", (req, res) => {
    sendFrontendPage(res, "index.html");
});

app.get("/dashboard.html", (req, res) => {
    sendFrontendPage(res, "dashboard.html");
});
app.get("/Frontend/UI-Design/dashboard.html", (req, res) => {
    sendFrontendPage(res, "dashboard.html");
});

app.get("/assets.html", (req, res) => {
    sendFrontendPage(res, "assets.html");
});
app.get("/Frontend/UI-Design/assets.html", (req, res) => {
    sendFrontendPage(res, "assets.html");
});

app.get("/employees.html", (req, res) => {
    sendFrontendPage(res, "employees.html");
});
app.get("/Frontend/UI-Design/employees.html", (req, res) => {
    sendFrontendPage(res, "employees.html");
});

app.get("/assignments.html", (req, res) => {
    sendFrontendPage(res, "assignments.html");
});
app.get("/Frontend/UI-Design/assignments.html", (req, res) => {
    sendFrontendPage(res, "assignments.html");
});

app.get("/maintenance.html", (req, res) => {
    sendFrontendPage(res, "maintenance.html");
});
app.get("/Frontend/UI-Design/maintenance.html", (req, res) => {
    sendFrontendPage(res, "maintenance.html");
});

app.get("/warranties.html", (req, res) => {
    sendFrontendPage(res, "warranties.html");
});
app.get("/Frontend/UI-Design/warranties.html", (req, res) => {
    sendFrontendPage(res, "warranties.html");
});

app.get("/reports.html", (req, res) => {
    sendFrontendPage(res, "reports.html");
});
app.get("/Frontend/UI-Design/reports.html", (req, res) => {
    sendFrontendPage(res, "reports.html");
});

app.get("/audit-logs.html", (req, res) => {
    sendFrontendPage(res, "audit-logs.html");
});
app.get("/Frontend/UI-Design/audit-logs.html", (req, res) => {
    sendFrontendPage(res, "audit-logs.html");
});

app.get("/api", (req, res) => {
    res.json({
        success: true,
        message: "Smart Asset Management System API is running"
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/software-licenses", softwareLicenseRoutes);
app.use("/api/audit-logs", auditLogRoutes);
app.use("/api/warranties", warrantyRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/email-settings", emailSettingsRoutes);

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
        path: req.originalUrl
    });
});

app.use((err, req, res, next) => {
    console.error("SERVER ERROR:", err);
    res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: err.message
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
// Check for expiring warranties/licenses once at startup,
        // then every day at 9:00 AM
        checkExpiries();
        cron.schedule("0 9 * * *", checkExpiries);
    });