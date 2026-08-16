const API = "http://localhost:5000/api/reports";


// ========================================
// AUTH HEADERS
// ========================================

function headers() {

    return {

        "Content-Type": "application/json",

        "Authorization":
            "Bearer " +
            (
                localStorage.getItem("token") ||
                localStorage.getItem("authToken") ||
                localStorage.getItem("accessToken") ||
                ""
            )

    };

}


// ========================================
// API GET
// ========================================

async function get(url) {

    const response = await fetch(
        url,
        {
            headers: headers()
        }
    );

    if (!response.ok) {

        throw new Error(
            "Failed to load report data"
        );

    }

    return response.json();

}


// ========================================
// ERROR MESSAGE
// ========================================

function showError(message) {

    const box =
        document.getElementById("errorBox");

    box.textContent = message;

    box.style.display = "block";

}


// ========================================
// FORMAT NUMBER
// ========================================

function formatNumber(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "0";

    }

    return Number(value).toLocaleString();

}


// ========================================
// LOAD DASHBOARD REPORT
// ========================================

async function loadDashboardReport() {

    const response =
        await get(
            `${API}/dashboard`
        );

    const data =
        response.data || {};


    document.getElementById(
        "totalAssets"
    ).textContent =
        formatNumber(
            data.total_assets
        );


    document.getElementById(
        "activeEmployees"
    ).textContent =
        formatNumber(
            data.active_employees
        );


    document.getElementById(
        "assignedAssets"
    ).textContent =
        formatNumber(
            data.assigned_assets
        );


    document.getElementById(
        "maintenanceAssets"
    ).textContent =
        formatNumber(
            data.maintenance_assets
        );


    document.getElementById(
        "totalAssetValue"
    ).textContent =
        "Rs. " +
        formatNumber(
            data.total_asset_value
        );


    document.getElementById(
        "totalAssignments"
    ).textContent =
        formatNumber(
            data.total_assignments
        );


    document.getElementById(
        "activeAssignments"
    ).textContent =
        formatNumber(
            data.active_assignments
        );


    document.getElementById(
        "totalMaintenance"
    ).textContent =
        formatNumber(
            data.total_maintenance
        );


    document.getElementById(
        "activeWarranties"
    ).textContent =
        formatNumber(
            data.active_warranties
        );


    document.getElementById(
        "activeLicenses"
    ).textContent =
        formatNumber(
            data.active_licenses
        );

}


// ========================================
// LOAD ASSET REPORT
// ========================================

async function loadAssetReport() {

    const response =
        await get(
            `${API}/assets`
        );

    const data =
        response.data || [];


    const container =
        document.getElementById(
            "assetStatusList"
        );


    if (!data.length) {

        container.innerHTML = `
            <div class="loading">
                No asset status data available.
            </div>
        `;

        return;

    }


    container.innerHTML =
        data.map(item => `

            <div class="status-row">

                <span class="status-name">
                    ${item.asset_status || "Unknown"}
                </span>

                <span class="status-count">
                    ${formatNumber(item.total)}
                </span>

            </div>

        `).join("");

}


// ========================================
// LOAD MAINTENANCE REPORT
// ========================================

async function loadMaintenanceReport() {

    const response =
        await get(
            `${API}/maintenance`
        );

    const data =
        response.data || [];


    const container =
        document.getElementById(
            "maintenanceList"
        );


    if (!data.length) {

        container.innerHTML = `
            <div class="loading">
                No maintenance data available.
            </div>
        `;

        return;

    }


    container.innerHTML =
        data.map(item => `

            <div class="status-row">

                <span class="status-name">

                    ${item.status || "Unknown"}

                    <small
                        style="
                            display:block;
                            color:#94a3b8;
                            margin-top:3px;
                        "
                    >
                        Cost: Rs.
                        ${formatNumber(item.total_cost)}
                    </small>

                </span>

                <span class="status-count">
                    ${formatNumber(item.total)}
                </span>

            </div>

        `).join("");

}


// ========================================
// LOAD WARRANTY REPORT
// ========================================

async function loadWarrantyReport() {

    const response =
        await get(
            `${API}/warranties`
        );

    const data =
        response.data || [];


    const container =
        document.getElementById(
            "warrantyList"
        );


    if (!data.length) {

        container.innerHTML = `
            <div class="loading">
                No warranty data available.
            </div>
        `;

        return;

    }


    container.innerHTML =
        data.map(item => `

            <div class="status-row">

                <span class="status-name">
                    ${item.status || "Unknown"}
                </span>

                <span class="status-count">
                    ${formatNumber(item.total)}
                </span>

            </div>

        `).join("");

}


// ========================================
// LOAD LICENSE REPORT
// ========================================

async function loadLicenseReport() {

    const response =
        await get(
            `${API}/licenses`
        );

    const data =
        response.data || [];


    const container =
        document.getElementById(
            "licenseList"
        );


    if (!data.length) {

        container.innerHTML = `
            <div class="loading">
                No software license data available.
            </div>
        `;

        return;

    }


    container.innerHTML =
        data.map(item => `

            <div class="status-row">

                <span class="status-name">
                    ${item.status || "Unknown"}
                </span>

                <span class="status-count">
                    ${formatNumber(item.total)}
                </span>

            </div>

        `).join("");

}


// ========================================
// LOAD EVERYTHING
// ========================================

async function loadReports() {

    const errorBox =
        document.getElementById(
            "errorBox"
        );

    errorBox.style.display = "none";


    try {

        await Promise.all([

            loadDashboardReport(),

            loadAssetReport(),

            loadMaintenanceReport(),

            loadWarrantyReport(),

            loadLicenseReport()

        ]);

    }

    catch (error) {

        console.error(
            "Reports Error:",
            error
        );

        showError(
            error.message ||
            "Unable to load report data."
        );

    }

}


// ========================================
// REFRESH
// ========================================

document
    .getElementById("refreshButton")
    .addEventListener(
        "click",
        loadReports
    );


// ========================================
// PRINT
// ========================================

document
    .getElementById("printButton")
    .addEventListener(
        "click",
        () => {

            window.print();

        }
    );


// ========================================
// LOGOUT
// ========================================

document
    .getElementById("logoutButton")
    .addEventListener(
        "click",
        () => {

            localStorage.clear();

            window.location.href =
                "index.html";

        }
    );


// ========================================
// USER INFO
// ========================================

function loadUserInfo() {

    const user =
        JSON.parse(
            localStorage.getItem("user") ||
            "null"
        );


    if (!user) {

        return;

    }


    const name =
        user.name ||
        user.full_name ||
        user.username ||
        "Admin User";


    const role =
        user.role ||
        "System Administrator";


    document.getElementById(
        "userName"
    ).textContent = name;


    document.getElementById(
        "userRole"
    ).textContent = role;


    const avatar =
        document.getElementById(
            "profileAvatar"
        );


    avatar.textContent =
        name.charAt(0).toUpperCase();

}


// ========================================
// INITIALIZE
// ========================================

loadUserInfo();

loadReports();