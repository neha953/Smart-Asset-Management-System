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
// LOAD DEPRECIATION REPORT
// ========================================

async function loadDepreciationReport() {

    const response =
        await get(
            `${API}/reports/depreciation`
        );

    const data =
        response.data || [];

    const totals =
        response.totals || {};

    const container =
        document.getElementById(
            "depreciationList"
        );


    if (!data.length) {

        container.innerHTML = `
            <div class="loading">
                No depreciation data available.
            </div>
        `;

        return;

    }


    const rows =
        data.map(item => `

            <tr>
                <td>${item.asset_name || "-"}</td>
                <td>${item.asset_code || "-"}</td>
                <td>${item.category_name || "-"}</td>
                <td>Rs. ${formatNumber(item.original_price)}</td>
                <td>${item.years_used}</td>
                <td>Rs. ${formatNumber(item.accumulated_depreciation)}</td>
                <td><strong>Rs. ${formatNumber(item.current_value)}</strong></td>
            </tr>

        `).join("");


    container.innerHTML = `

        <p style="margin-bottom:12px; color:#475569;">
            Total original value: <strong>Rs. ${formatNumber(totals.total_original_value)}</strong>
            &nbsp;|&nbsp;
            Total current value: <strong>Rs. ${formatNumber(totals.total_current_value)}</strong>
            &nbsp;|&nbsp;
            Total depreciation: <strong>Rs. ${formatNumber(totals.total_depreciation)}</strong>
        </p>

        <table style="width:100%; border-collapse:collapse;">
            <thead>
                <tr style="text-align:left; border-bottom:2px solid #e2e8f0;">
                    <th style="padding:8px;">Asset</th>
                    <th style="padding:8px;">Code</th>
                    <th style="padding:8px;">Category</th>
                    <th style="padding:8px;">Original Price</th>
                    <th style="padding:8px;">Years Used</th>
                    <th style="padding:8px;">Depreciation</th>
                    <th style="padding:8px;">Current Value</th>
                </tr>
            </thead>
            <tbody>
                ${rows}
            </tbody>
        </table>

    `;

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

            loadLicenseReport(),

            loadDepreciationReport()

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