const WARRANTY_API = "http://localhost:5000/api/warranties";
const LICENSE_API = "http://localhost:5000/api/software-licenses";

let warranties = [];
let licenses = [];

let currentTab = "warranty";


/* =========================
   AUTH HEADERS
========================= */

function headers() {

    return {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + (
            localStorage.getItem("token") ||
            localStorage.getItem("authToken") ||
            localStorage.getItem("accessToken") ||
            ""
        )
    };

}


/* =========================
   NORMALIZE API RESPONSE
========================= */

function normalize(data, key) {

    if (Array.isArray(data)) {
        return data;
    }

    if (Array.isArray(data[key])) {
        return data[key];
    }

    if (Array.isArray(data.data)) {
        return data.data;
    }

    if (Array.isArray(data.data?.[key])) {
        return data.data[key];
    }

    return [];
}


/* =========================
   MESSAGE
========================= */

function showMessage(text, type = "success") {

    const message = document.getElementById("message");

    message.textContent = text;

    message.className = "message show " + type;

    setTimeout(() => {
        message.className = "message";
    }, 3000);

}


/* =========================
   GET REQUEST
========================= */

async function get(url) {

    const response = await fetch(url, {
        method: "GET",
        headers: headers()
    });

    if (!response.ok) {
        throw new Error("Request failed");
    }

    return response.json();

}


/* =========================
   SWITCH TABS
========================= */

window.switchTab = function (tab) {

    currentTab = tab;

    const warrantyTab = document.getElementById("warrantyTab");
    const licenseTab = document.getElementById("licenseTab");

    const warrantyToolbar =
        document.getElementById("warrantyToolbar");

    const licenseToolbar =
        document.getElementById("licenseToolbar");

    const warrantySection =
        document.getElementById("warrantySection");

    const licenseSection =
        document.getElementById("licenseSection");

    const pageTitle =
        document.getElementById("pageTitle");

    const pageDescription =
        document.getElementById("pageDescription");

    const addButton =
        document.getElementById("addButton");


    if (tab === "warranty") {

        warrantyTab.classList.add("active");
        licenseTab.classList.remove("active");

        warrantyToolbar.classList.remove("hidden");
        licenseToolbar.classList.add("hidden");

        warrantySection.classList.remove("hidden");
        licenseSection.classList.add("hidden");

        pageTitle.textContent = "Warranty Management";

        pageDescription.textContent =
            "Track asset warranties, vendors and warranty status.";

        addButton.textContent = "+ Add Warranty";

    } else {

        licenseTab.classList.add("active");
        warrantyTab.classList.remove("active");

        warrantyToolbar.classList.add("hidden");
        licenseToolbar.classList.remove("hidden");

        warrantySection.classList.add("hidden");
        licenseSection.classList.remove("hidden");

        pageTitle.textContent = "Software License Management";

        pageDescription.textContent =
            "Track software licenses, vendors, expiry dates and status.";

        addButton.textContent = "+ Add Software License";

    }

};


/* =========================
   LOAD WARRANTIES
========================= */

async function loadWarranties() {

    const body = document.getElementById("warrantyBody");

    body.innerHTML = `
        <tr>
            <td colspan="8" class="empty">
                Loading warranties...
            </td>
        </tr>
    `;

    try {

        const data = await get(WARRANTY_API);

        warranties = normalize(data, "warranties");

        renderWarranties();

    } catch (error) {

        console.error(error);

        body.innerHTML = `
            <tr>
                <td colspan="8" class="empty">
                    Unable to load warranties.
                </td>
            </tr>
        `;

    }

}


/* =========================
   RENDER WARRANTIES
========================= */

function renderWarranties() {

    const body =
        document.getElementById("warrantyBody");

    const search =
        document.getElementById("warrantySearch")
            .value
            .toLowerCase();

    const status =
        document.getElementById("warrantyStatusFilter")
            .value;


    const filtered = warranties.filter(warranty => {

        const text = `
            ${warranty.id || ""}
            ${warranty.asset_id || ""}
            ${warranty.vendor || ""}
            ${warranty.status || ""}
            ${warranty.description || ""}
        `.toLowerCase();

        return (
            text.includes(search) &&
            (!status || warranty.status === status)
        );

    });


    if (!filtered.length) {

        body.innerHTML = `
            <tr>
                <td colspan="8" class="empty">
                    No warranties found.
                </td>
            </tr>
        `;

        return;
    }


    body.innerHTML = filtered.map(warranty => {

        const statusClass =
            warranty.status === "Active"
                ? "badge-active"
                : warranty.status === "Expired"
                    ? "badge-expired"
                    : "badge-inactive";


        return `
            <tr>

                <td>
                    ${warranty.id}
                </td>

                <td>
                    <strong>
                        Asset #${warranty.asset_id}
                    </strong>
                </td>

                <td>
                    ${warranty.warranty_start_date || "-"}
                </td>

                <td>
                    ${warranty.warranty_end_date || "-"}
                </td>

                <td>
                    ${warranty.vendor || "-"}
                </td>

                <td>

                    <span class="badge ${statusClass}">
                        ${warranty.status || "-"}
                    </span>

                </td>

                <td>
                    ${warranty.description || "-"}
                </td>

                <td>

                    <div class="actions">

                        <button
                            class="edit-btn"
                            onclick="editWarranty(${warranty.id})"
                        >
                            Edit
                        </button>

                        <button
                            class="delete-btn"
                            onclick="deleteWarranty(${warranty.id})"
                        >
                            Delete
                        </button>

                    </div>

                </td>

            </tr>
        `;

    }).join("");

}


/* =========================
   OPEN ADD WARRANTY
========================= */

function openAddWarranty() {

    document.getElementById("warrantyForm").reset();

    document.getElementById("warrantyId").value = "";

    document.getElementById("warrantyModalTitle").textContent =
        "Add Warranty";

    document.getElementById("warrantyModal")
        .classList.add("show");

}


/* =========================
   EDIT WARRANTY
========================= */

window.editWarranty = function (id) {

    const warranty =
        warranties.find(item => item.id == id);

    if (!warranty) {
        return;
    }


    document.getElementById("warrantyId").value =
        warranty.id;

    document.getElementById("warrantyAssetId").value =
        warranty.asset_id;

    document.getElementById("warrantyStartDate").value =
        warranty.warranty_start_date || "";

    document.getElementById("warrantyEndDate").value =
        warranty.warranty_end_date || "";

    document.getElementById("warrantyVendor").value =
        warranty.vendor || "";

    document.getElementById("warrantyStatus").value =
        warranty.status || "Active";

    document.getElementById("warrantyDescription").value =
        warranty.description || "";


    document.getElementById("warrantyModalTitle").textContent =
        "Edit Warranty";

    document.getElementById("warrantyModal")
        .classList.add("show");

};


/* =========================
   DELETE WARRANTY
========================= */

window.deleteWarranty = async function (id) {

    if (!confirm("Delete this warranty?")) {
        return;
    }


    try {

        const response = await fetch(
            `${WARRANTY_API}/${id}`,
            {
                method: "DELETE",
                headers: headers()
            }
        );


        if (!response.ok) {
            throw new Error("Delete failed");
        }


        showMessage(
            "Warranty deleted successfully"
        );

        loadWarranties();


    } catch (error) {

        console.error(error);

        showMessage(
            error.message,
            "error"
        );

    }

};


/* =========================
   SAVE WARRANTY
========================= */

document.getElementById("warrantyForm")
    .addEventListener("submit", async function (event) {

        event.preventDefault();


        const id =
            document.getElementById("warrantyId").value;


        const startDate =
            document.getElementById("warrantyStartDate").value;

        const endDate =
            document.getElementById("warrantyEndDate").value;


        if (new Date(startDate) > new Date(endDate)) {

            showMessage(
                "Warranty end date must be after start date.",
                "error"
            );

            return;
        }


        const payload = {

            asset_id: Number(
                document.getElementById("warrantyAssetId").value
            ),

            warranty_start_date: startDate,

            warranty_end_date: endDate,

            vendor:
                document.getElementById("warrantyVendor").value,

            status:
                document.getElementById("warrantyStatus").value,

            description:
                document.getElementById("warrantyDescription").value

        };


        try {

            const response = await fetch(
                id
                    ? `${WARRANTY_API}/${id}`
                    : WARRANTY_API,
                {
                    method: id ? "PUT" : "POST",

                    headers: headers(),

                    body: JSON.stringify(payload)
                }
            );


            if (!response.ok) {

                const errorData =
                    await response.json()
                        .catch(() => null);

                throw new Error(
                    errorData?.message ||
                    "Could not save warranty"
                );

            }


            document.getElementById("warrantyModal")
                .classList.remove("show");


            showMessage(
                id
                    ? "Warranty updated successfully"
                    : "Warranty added successfully"
            );


            loadWarranties();


        } catch (error) {

            console.error(error);

            showMessage(
                error.message,
                "error"
            );

        }

    });


/* =========================
   LOAD LICENSES
========================= */

async function loadLicenses() {

    const body =
        document.getElementById("licenseBody");


    body.innerHTML = `
        <tr>
            <td colspan="7" class="empty">
                Loading software licenses...
            </td>
        </tr>
    `;


    try {

        const data =
            await get(LICENSE_API);

        licenses =
            normalize(data, "licenses");

        renderLicenses();


    } catch (error) {

        console.error(error);

        body.innerHTML = `
            <tr>
                <td colspan="7" class="empty">
                    Unable to load software licenses.
                </td>
            </tr>
        `;

    }

}


/* =========================
   RENDER LICENSES
========================= */

function renderLicenses() {

    const body =
        document.getElementById("licenseBody");


    const search =
        document.getElementById("licenseSearch")
            .value
            .toLowerCase();


    const status =
        document.getElementById("licenseStatusFilter")
            .value;


    const filtered =
        licenses.filter(license => {

            const text = `
                ${license.id || ""}
                ${license.asset_id || ""}
                ${license.license_key || ""}
                ${license.expiry_date || ""}
                ${license.vendor || ""}
                ${license.status || ""}
            `.toLowerCase();


            return (
                text.includes(search) &&
                (!status || license.status === status)
            );

        });


    if (!filtered.length) {

        body.innerHTML = `
            <tr>
                <td colspan="7" class="empty">
                    No software licenses found.
                </td>
            </tr>
        `;

        return;
    }


    body.innerHTML =
        filtered.map(license => {

            const statusClass =
                license.status === "Active"
                    ? "badge-active"
                    : license.status === "Expired"
                        ? "badge-expired"
                        : "badge-inactive";


            return `
                <tr>

                    <td>
                        ${license.id}
                    </td>

                    <td>
                        <strong>
                            Asset #${license.asset_id}
                        </strong>
                    </td>

                    <td>
                        ${license.license_key || "-"}
                    </td>

                    <td>
                        ${license.expiry_date || "-"}
                    </td>

                    <td>
                        ${license.vendor || "-"}
                    </td>

                    <td>

                        <span class="badge ${statusClass}">
                            ${license.status || "-"}
                        </span>

                    </td>

                    <td>

                        <div class="actions">

                            <button
                                class="edit-btn"
                                onclick="editLicense(${license.id})"
                            >
                                Edit
                            </button>

                            <button
                                class="delete-btn"
                                onclick="deleteLicense(${license.id})"
                            >
                                Delete
                            </button>

                        </div>

                    </td>

                </tr>
            `;

        }).join("");

}


/* =========================
   OPEN ADD LICENSE
========================= */

function openAddLicense() {

    document.getElementById("licenseForm").reset();

    document.getElementById("licenseId").value = "";

    document.getElementById("licenseModalTitle").textContent =
        "Add Software License";

    document.getElementById("licenseModal")
        .classList.add("show");

}


/* =========================
   EDIT LICENSE
========================= */

window.editLicense = function (id) {

    const license =
        licenses.find(item => item.id == id);

    if (!license) {
        return;
    }


    document.getElementById("licenseId").value =
        license.id;

    document.getElementById("licenseAssetId").value =
        license.asset_id;

    document.getElementById("licenseKey").value =
        license.license_key || "";

    document.getElementById("licenseExpiryDate").value =
        license.expiry_date || "";

    document.getElementById("licenseVendor").value =
        license.vendor || "";

    document.getElementById("licenseStatus").value =
        license.status || "Active";


    document.getElementById("licenseModalTitle").textContent =
        "Edit Software License";

    document.getElementById("licenseModal")
        .classList.add("show");

};


/* =========================
   DELETE LICENSE
========================= */

window.deleteLicense = async function (id) {

    if (!confirm("Delete this software license?")) {
        return;
    }


    try {

        const response =
            await fetch(
                `${LICENSE_API}/${id}`,
                {
                    method: "DELETE",
                    headers: headers()
                }
            );


        if (!response.ok) {
            throw new Error("Delete failed");
        }


        showMessage(
            "Software license deleted successfully"
        );


        loadLicenses();


    } catch (error) {

        console.error(error);

        showMessage(
            error.message,
            "error"
        );

    }

};


/* =========================
   SAVE LICENSE
========================= */

document.getElementById("licenseForm")
    .addEventListener("submit", async function (event) {

        event.preventDefault();


        const id =
            document.getElementById("licenseId").value;


        const payload = {

            asset_id: Number(
                document.getElementById("licenseAssetId").value
            ),

            license_key:
                document.getElementById("licenseKey").value,

            expiry_date:
                document.getElementById("licenseExpiryDate").value,

            vendor:
                document.getElementById("licenseVendor").value,

            status:
                document.getElementById("licenseStatus").value

        };


        try {

            const response =
                await fetch(
                    id
                        ? `${LICENSE_API}/${id}`
                        : LICENSE_API,
                    {
                        method: id ? "PUT" : "POST",

                        headers: headers(),

                        body: JSON.stringify(payload)
                    }
                );


            if (!response.ok) {

                const errorData =
                    await response.json()
                        .catch(() => null);

                throw new Error(
                    errorData?.message ||
                    "Could not save software license"
                );

            }


            document.getElementById("licenseModal")
                .classList.remove("show");


            showMessage(
                id
                    ? "Software license updated successfully"
                    : "Software license added successfully"
            );


            loadLicenses();


        } catch (error) {

            console.error(error);

            showMessage(
                error.message,
                "error"
            );

        }

    });


/* =========================
   BUTTON EVENTS
========================= */

document.getElementById("addButton")
    .addEventListener("click", function () {

        if (currentTab === "warranty") {
            openAddWarranty();
        } else {
            openAddLicense();
        }

    });


/* =========================
   WARRANTY MODAL EVENTS
========================= */

document.getElementById("closeWarrantyModal")
    .addEventListener("click", function () {

        document.getElementById("warrantyModal")
            .classList.remove("show");

    });


document.getElementById("cancelWarrantyButton")
    .addEventListener("click", function () {

        document.getElementById("warrantyModal")
            .classList.remove("show");

    });


/* =========================
   LICENSE MODAL EVENTS
========================= */

document.getElementById("closeLicenseModal")
    .addEventListener("click", function () {

        document.getElementById("licenseModal")
            .classList.remove("show");

    });


document.getElementById("cancelLicenseButton")
    .addEventListener("click", function () {

        document.getElementById("licenseModal")
            .classList.remove("show");

    });


/* =========================
   REFRESH
========================= */

document.getElementById("refreshWarrantyButton")
    .addEventListener("click", loadWarranties);


document.getElementById("refreshLicenseButton")
    .addEventListener("click", loadLicenses);


/* =========================
   SEARCH
========================= */

document.getElementById("warrantySearch")
    .addEventListener("input", renderWarranties);


document.getElementById("warrantyStatusFilter")
    .addEventListener("change", renderWarranties);


document.getElementById("licenseSearch")
    .addEventListener("input", renderLicenses);


document.getElementById("licenseStatusFilter")
    .addEventListener("change", renderLicenses);


/* =========================
   LOGOUT
========================= */

document.getElementById("logoutButton")
    .addEventListener("click", function () {

        localStorage.clear();

        location.href = "index.html";

    });


/* =========================
   CLOSE MODALS ON BACKDROP
========================= */

document.getElementById("warrantyModal")
    .addEventListener("click", function (event) {

        if (event.target === this) {
            this.classList.remove("show");
        }

    });


document.getElementById("licenseModal")
    .addEventListener("click", function (event) {

        if (event.target === this) {
            this.classList.remove("show");
        }

    });


/* =========================
   INITIAL LOAD
========================= */

loadWarranties();
loadLicenses();