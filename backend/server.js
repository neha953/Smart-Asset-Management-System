const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const assignmentRoutes = require("./routes/assignmentRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const authRoutes = require("./routes/authRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const assetRoutes = require("./routes/assetRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const maintenanceRoutes = require("./routes/maintenanceRoutes");
const softwareLicenseRoutes = require("./routes/softwareLicenseRoutes");
const auditLogRoutes = require("./routes/auditLogRoutes");

dotenv.config();

const app = express();


// Middleware
app.use(cors());
app.use(express.json());


// Test route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Smart Asset Management System API is running"
    });
});


// Authentication routes
app.use("/api/auth", authRoutes);


// Employee routes
app.use("/api/employees", employeeRoutes);


// Asset routes
app.use("/api/assets", assetRoutes);


// Category routes
app.use("/api/categories", categoryRoutes);

// vendor routes
app.use("/api/vendors", vendorRoutes);

// vassignment routes
app.use("/api/assignments", assignmentRoutes);

// maintainance routes
app.use("/api/maintenance", maintenanceRoutes);

// softwarelicense routes
app.use("/api/software-licenses", softwareLicenseRoutes);

app.use("/api/audit-logs", auditLogRoutes);

// Handle unknown routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});


// Global error handler
app.use((err, req, res, next) => {

    console.error("Server Error:", err);

    res.status(500).json({
        success: false,
        message: "Internal Server Error"
    });

});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});