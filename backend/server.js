const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

// ========================================
// LOAD ENVIRONMENT VARIABLES
// ========================================

dotenv.config();

const app = express();

// ========================================
// ROUTES
// ========================================

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
// MIDDLEWARE
// ========================================

app.use(cors());

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);

// ========================================
// FRONTEND PATH
// ========================================

// server.js is inside:
// Smart-Asset-Management-System/backend
//
// Frontend is:
// Smart-Asset-Management-System/Frontend/UI-Design

const frontendPath = path.resolve(
    __dirname,
    "..",
    "Frontend",
    "UI-Design"
);

console.log("========================================");
console.log("SMART ASSET MANAGEMENT SYSTEM");
console.log("========================================");

console.log("Backend directory:");
console.log(__dirname);

console.log("");

console.log("Frontend path:");
console.log(frontendPath);

console.log("");

console.log(
    "Frontend folder exists:",
    fs.existsSync(frontendPath)
);

console.log("");

console.log(
    "index.html exists:",
    fs.existsSync(path.join(frontendPath, "index.html"))
);

console.log(
    "dashboard.html exists:",
    fs.existsSync(path.join(frontendPath, "dashboard.html"))
);

console.log(
    "assets.html exists:",
    fs.existsSync(path.join(frontendPath, "assets.html"))
);

console.log(
    "employees.html exists:",
    fs.existsSync(path.join(frontendPath, "employees.html"))
);

console.log("========================================");

// ========================================
// STATIC FRONTEND FILES
// ========================================

app.use(
    express.static(frontendPath)
);

// ========================================
// HELPER FUNCTION
// ========================================

function sendFrontendPage(res, fileName) {

    const filePath = path.join(
        frontendPath,
        fileName
    );

    console.log("Opening frontend page:");
    console.log(filePath);

    if (!fs.existsSync(filePath)) {

        console.error(
            "Frontend file not found:",
            filePath
        );

        return res.status(404).send(
            `${fileName} not found at: ${filePath}`
        );
    }

    return res.sendFile(filePath);
}

// ========================================
// FRONTEND HOME
// ========================================

app.get("/", (req, res) => {

    sendFrontendPage(
        res,
        "index.html"
    );

});

// ========================================
// DASHBOARD
// ========================================

app.get("/dashboard.html", (req, res) => {

    sendFrontendPage(
        res,
        "dashboard.html"
    );

});

// Support old URL too
app.get(
    "/Frontend/UI-Design/dashboard.html",
    (req, res) => {

        sendFrontendPage(
            res,
            "dashboard.html"
        );

    }
);

// ========================================
// ASSETS
// ========================================

app.get("/assets.html", (req, res) => {

    sendFrontendPage(
        res,
        "assets.html"
    );

});

// Support old URL too
app.get(
    "/Frontend/UI-Design/assets.html",
    (req, res) => {

        sendFrontendPage(
            res,
            "assets.html"
        );

    }
);

// ========================================
// EMPLOYEES
// ========================================

app.get("/employees.html", (req, res) => {

    sendFrontendPage(
        res,
        "employees.html"
    );

});

// Support old URL too
app.get(
    "/Frontend/UI-Design/employees.html",
    (req, res) => {

        sendFrontendPage(
            res,
            "employees.html"
        );

    }
);

// ========================================
// ASSIGNMENTS
// ========================================

app.get("/assignments.html", (req, res) => {

    sendFrontendPage(
        res,
        "assignments.html"
    );

});

// Support old URL too
app.get(
    "/Frontend/UI-Design/assignments.html",
    (req, res) => {

        sendFrontendPage(
            res,
            "assignments.html"
        );

    }
);

// ========================================
// MAINTENANCE
// ========================================

app.get("/maintenance.html", (req, res) => {

    sendFrontendPage(
        res,
        "maintenance.html"
    );

});

// Support old URL too
app.get(
    "/Frontend/UI-Design/maintenance.html",
    (req, res) => {

        sendFrontendPage(
            res,
            "maintenance.html"
        );

    }
);

// ========================================
// WARRANTIES
// ========================================

app.get("/warranties.html", (req, res) => {

    sendFrontendPage(
        res,
        "warranties.html"
    );

});

// Support old URL too
app.get(
    "/Frontend/UI-Design/warranties.html",
    (req, res) => {

        sendFrontendPage(
            res,
            "warranties.html"
        );

    }
);

// ========================================
// REPORTS
// ========================================

app.get("/reports.html", (req, res) => {

    sendFrontendPage(
        res,
        "reports.html"
    );

});

// Support old URL too
app.get(
    "/Frontend/UI-Design/reports.html",
    (req, res) => {

        sendFrontendPage(
            res,
            "reports.html"
        );

    }
);

// ========================================
// AUDIT LOGS
// ========================================

app.get("/audit-logs.html", (req, res) => {

    sendFrontendPage(
        res,
        "audit-logs.html"
    );

});

// Support old URL too
app.get(
    "/Frontend/UI-Design/audit-logs.html",
    (req, res) => {

        sendFrontendPage(
            res,
            "audit-logs.html"
        );

    }
);

// ========================================
// API TEST
// ========================================

app.get("/api", (req, res) => {

    res.json({
        success: true,
        message: "Smart Asset Management System API is running"
    });

});

// ========================================
// API ROUTES
// ========================================

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/employees",
    employeeRoutes
);

app.use(
    "/api/assets",
    assetRoutes
);

app.use(
    "/api/categories",
    categoryRoutes
);

app.use(
    "/api/vendors",
    vendorRoutes
);

app.use(
    "/api/assignments",
    assignmentRoutes
);

app.use(
    "/api/maintenance",
    maintenanceRoutes
);

app.use(
    "/api/software-licenses",
    softwareLicenseRoutes
);

app.use(
    "/api/audit-logs",
    auditLogRoutes
);

app.use(
    "/api/warranties",
    warrantyRoutes
);

app.use(
    "/api/dashboard",
    dashboardRoutes
);
app.use("/api/reports", reportRoutes);

// ========================================
// 404 HANDLER
// ========================================

app.use((req, res) => {

    console.log(
        "404 - Route not found:",
        req.method,
        req.originalUrl
    );

    res.status(404).json({
        success: false,
        message: "Route not found",
        path: req.originalUrl
    });

});

// ========================================
// ERROR HANDLER
// ========================================

app.use(
    (err, req, res, next) => {

        console.error("========================================");
        console.error("SERVER ERROR");
        console.error(err);
        console.error("========================================");

        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message
        });

    }
);

// ========================================
// START SERVER
// ========================================

const PORT = process.env.PORT || 5000;

app.listen(
    PORT,
    () => {

        console.log("");
        console.log("========================================");
        console.log("SMART ASSET MANAGEMENT SYSTEM");
        console.log("========================================");
        console.log(
            `Server running at http://localhost:${PORT}`
        );
        console.log(
            `Frontend folder: ${frontendPath}`
        );
        console.log("========================================");
        console.log("");
    }
);