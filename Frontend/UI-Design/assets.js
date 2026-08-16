/* =========================================
   ASSETS PAGE JAVASCRIPT
========================================= */

const API_BASE_URL = "http://localhost:5000/api";


/* =========================================
   ELEMENTS
========================================= */

const assetsTableBody =
    document.getElementById("assetsTableBody");

const searchInput =
    document.getElementById("searchInput");

const statusFilter =
    document.getElementById("statusFilter");

const refreshButton =
    document.getElementById("refreshButton");

const addAssetButton =
    document.getElementById("addAssetButton");

const assetModal =
    document.getElementById("assetModal");

const closeModal =
    document.getElementById("closeModal");

const cancelButton =
    document.getElementById("cancelButton");

const assetForm =
    document.getElementById("assetForm");

const pageMessage =
    document.getElementById("pageMessage");

const modalTitle =
    document.getElementById("modalTitle");

const saveButton =
    document.getElementById("saveButton");

const categoryId =
    document.getElementById("categoryId");

const vendorId =
    document.getElementById("vendorId");


/* =========================================
   DATA
========================================= */

let allAssets = [];

let editingAssetId = null;


/* =========================================
   TOKEN
========================================= */

function getToken() {

    return localStorage.getItem("token");

}


/* =========================================
   API HEADERS
========================================= */

function getHeaders() {

    const token = getToken();

    return {

        "Content-Type": "application/json",

        ...(token
            ? {
                "Authorization":
                    `Bearer ${token}`
            }
            : {}
        )

    };

}


/* =========================================
   MESSAGE
========================================= */

function showMessage(message, type) {

    pageMessage.textContent = message;

    pageMessage.className = "page-message show";

    pageMessage.classList.add(type);

}


/* =========================================
   CLEAR MESSAGE
========================================= */

function clearMessage() {

    pageMessage.textContent = "";

    pageMessage.className = "page-message";

}


/* =========================================
   CHECK LOGIN
========================================= */

function checkAuthentication() {

    const token = getToken();

    if (!token) {

        window.location.href = "index.html";

        return false;

    }

    return true;

}


/* =========================================
   USER INFO
========================================= */

function loadUserInfo() {

    const userData =
        localStorage.getItem("user");

    if (!userData) {
        return;
    }

    try {

        const user = JSON.parse(userData);

        const userName =
            document.getElementById("userName");

        const userRole =
            document.getElementById("userRole");

        const profileAvatar =
            document.getElementById("profileAvatar");


        if (user.name) {

            userName.textContent =
                user.name;

            profileAvatar.textContent =
                user.name
                    .charAt(0)
                    .toUpperCase();

        }


        if (user.role) {

            userRole.textContent =
                user.role;

        }

    } catch (error) {

        console.error(
            "User data error:",
            error
        );

    }

}


/* =========================================
   FETCH ASSETS
========================================= */

async function loadAssets() {

    clearMessage();

    assetsTableBody.innerHTML = `

        <tr>

            <td
                colspan="10"
                class="empty-state"
            >
                Loading assets...
            </td>

        </tr>

    `;


    try {

        const response = await fetch(
            `${API_BASE_URL}/assets`,
            {
                method: "GET",
                headers: getHeaders()
            }
        );


        if (response.status === 401) {

            localStorage.removeItem("token");

            localStorage.removeItem("user");

            window.location.href =
                "index.html";

            return;

        }


        const data =
            await response.json();


        if (!response.ok || !data.success) {

            throw new Error(
                data.message ||
                "Unable to load assets"
            );

        }


        allAssets =
            Array.isArray(data.data)
                ? data.data
                : [];


        renderAssets();


    } catch (error) {

        console.error(
            "Load Assets Error:",
            error
        );


        assetsTableBody.innerHTML = `

            <tr>

                <td
                    colspan="10"
                    class="empty-state"
                >
                    Unable to load assets.
                </td>

            </tr>

        `;


        showMessage(
            error.message ||
            "Unable to load assets.",
            "error"
        );

    }

}


/* =========================================
   RENDER ASSETS
========================================= */

function renderAssets() {

    const searchValue =
        searchInput.value
            .trim()
            .toLowerCase();


    const statusValue =
        statusFilter.value;


    const filteredAssets =
        allAssets.filter(asset => {


            const searchableText = `

                ${asset.asset_name || ""}

                ${asset.asset_code || ""}

                ${asset.location || ""}

                ${asset.category_name || ""}

                ${asset.vendor_name || ""}

            `.toLowerCase();


            const matchesSearch =
                !searchValue ||
                searchableText.includes(
                    searchValue
                );


            const matchesStatus =
                !statusValue ||
                asset.asset_status ===
                    statusValue;


            return (
                matchesSearch &&
                matchesStatus
            );

        });


    if (filteredAssets.length === 0) {

        assetsTableBody.innerHTML = `

            <tr>

                <td
                    colspan="10"
                    class="empty-state"
                >
                    No assets found.
                </td>

            </tr>

        `;

        return;

    }


    assetsTableBody.innerHTML =
        filteredAssets
            .map(asset => createAssetRow(asset))
            .join("");

}


/* =========================================
   CREATE TABLE ROW
========================================= */

function createAssetRow(asset) {

    const statusClass =
        getStatusClass(
            asset.asset_status
        );


    const price =
        asset.price !== null &&
        asset.price !== undefined
            ? Number(asset.price).toLocaleString()
            : "-";


    const warranty =
        formatDate(
            asset.warranty_expiry
        );


    return `

        <tr>

            <td>
                ${escapeHtml(
                    asset.id
                )}
            </td>


            <td>

                <strong>
                    ${escapeHtml(
                        asset.asset_name || "-"
                    )}
                </strong>

            </td>


            <td>
                ${escapeHtml(
                    asset.asset_code || "-"
                )}
            </td>


            <td>
                ${escapeHtml(
                    asset.category_name ||
                    asset.category ||
                    "-"
                )}
            </td>


            <td>
                ${escapeHtml(
                    asset.vendor_name ||
                    asset.vendor ||
                    "-"
                )}
            </td>


            <td>

                <span
                    class="status-badge ${statusClass}"
                >
                    ${escapeHtml(
                        asset.asset_status ||
                        "-"
                    )}
                </span>

            </td>


            <td>
                ${escapeHtml(
                    asset.location || "-"
                )}
            </td>


            <td>
                ${price}
            </td>


            <td>
                ${warranty}
            </td>


            <td>

                <div class="action-buttons">

                    <button
                        type="button"
                        class="edit-btn"
                        onclick="editAsset(${asset.id})"
                    >
                        Edit
                    </button>


                    <button
                        type="button"
                        class="delete-btn"
                        onclick="deleteAsset(${asset.id})"
                    >
                        Delete
                    </button>

                </div>

            </td>

        </tr>

    `;

}


/* =========================================
   STATUS CLASS
========================================= */

function getStatusClass(status) {

    switch (status) {

        case "Available":
            return "status-available";

        case "Assigned":
            return "status-assigned";

        case "Maintenance":
            return "status-maintenance";

        case "Retired":
            return "status-retired";

        case "Lost":
            return "status-lost";

        default:
            return "status-other";

    }

}


/* =========================================
   FORMAT DATE
========================================= */

function formatDate(date) {

    if (!date) {
        return "-";
    }


    const parsed =
        new Date(date);


    if (isNaN(parsed.getTime())) {
        return date;
    }


    return parsed.toLocaleDateString();

}


/* =========================================
   ESCAPE HTML
========================================= */

function escapeHtml(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}


/* =========================================
   LOAD CATEGORIES
========================================= */

async function loadCategories() {

    try {

        const response = await fetch(
            `${API_BASE_URL}/categories`,
            {
                method: "GET",
                headers: getHeaders()
            }
        );


        const data =
            await response.json();


        if (!response.ok || !data.success) {

            throw new Error(
                data.message ||
                "Unable to load categories"
            );

        }


        const categories =
            Array.isArray(data.data)
                ? data.data
                : [];


        categoryId.innerHTML = `

            <option value="">
                Select category
            </option>

        `;


        categories.forEach(category => {

            const option =
                document.createElement("option");


            option.value =
                category.id;


            option.textContent =
                category.category_name ||
                category.name ||
                `Category ${category.id}`;


            categoryId.appendChild(option);

        });


    } catch (error) {

        console.error(
            "Load Categories Error:",
            error
        );

    }

}


/* =========================================
   LOAD VENDORS
========================================= */

async function loadVendors() {

    try {

        const response = await fetch(
            `${API_BASE_URL}/vendors`,
            {
                method: "GET",
                headers: getHeaders()
            }
        );


        const data =
            await response.json();


        if (!response.ok || !data.success) {

            throw new Error(
                data.message ||
                "Unable to load vendors"
            );

        }


        const vendors =
            Array.isArray(data.data)
                ? data.data
                : [];


        vendorId.innerHTML = `

            <option value="">
                Select vendor
            </option>

        `;


        vendors.forEach(vendor => {

            const option =
                document.createElement("option");


            option.value =
                vendor.id;


            option.textContent =
                vendor.vendor_name ||
                vendor.name ||
                `Vendor ${vendor.id}`;


            vendorId.appendChild(option);

        });


    } catch (error) {

        console.error(
            "Load Vendors Error:",
            error
        );

    }

}


/* =========================================
   OPEN MODAL
========================================= */

function openModal(asset = null) {

    clearMessage();

    assetForm.reset();


    if (asset) {

        editingAssetId =
            asset.id;


        modalTitle.textContent =
            "Edit Asset";


        saveButton.textContent =
            "Update Asset";


        document.getElementById(
            "assetId"
        ).value =
            asset.id || "";


        document.getElementById(
            "assetName"
        ).value =
            asset.asset_name || "";


        document.getElementById(
            "assetCode"
        ).value =
            asset.asset_code || "";


        document.getElementById(
            "categoryId"
        ).value =
            asset.category_id || "";


        document.getElementById(
            "vendorId"
        ).value =
            asset.vendor_id || "";


        document.getElementById(
            "purchaseDate"
        ).value =
            formatInputDate(
                asset.purchase_date
            );


        document.getElementById(
            "warrantyExpiry"
        ).value =
            formatInputDate(
                asset.warranty_expiry
            );


        document.getElementById(
            "assetStatus"
        ).value =
            asset.asset_status ||
            "Available";


        document.getElementById(
            "location"
        ).value =
            asset.location || "";


        document.getElementById(
            "price"
        ).value =
            asset.price ?? "";


        document.getElementById(
            "qrCode"
        ).value =
            asset.qr_code || "";


    } else {

        editingAssetId = null;


        modalTitle.textContent =
            "Register New Asset";


        saveButton.textContent =
            "Save Asset";


        document.getElementById(
            "assetId"
        ).value = "";

    }


    assetModal.classList.add("show");

}


/* =========================================
   CLOSE MODAL
========================================= */

function closeAssetModal() {

    assetModal.classList.remove(
        "show"
    );

    assetForm.reset();

    editingAssetId = null;

}


/* =========================================
   DATE FOR INPUT
========================================= */

function formatInputDate(date) {

    if (!date) {
        return "";
    }


    return String(date)
        .substring(0, 10);

}


/* =========================================
   ADD ASSET
========================================= */

addAssetButton.addEventListener(
    "click",
    async function () {

        await loadCategories();

        await loadVendors();

        openModal();

    }
);


/* =========================================
   CLOSE EVENTS
========================================= */

closeModal.addEventListener(
    "click",
    closeAssetModal
);


cancelButton.addEventListener(
    "click",
    closeAssetModal
);


assetModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            assetModal
        ) {

            closeAssetModal();

        }

    }
);


/* =========================================
   EDIT ASSET
========================================= */

window.editAsset = async function (id) {

    const asset =
        allAssets.find(
            item =>
                Number(item.id) ===
                Number(id)
        );


    if (!asset) {

        showMessage(
            "Asset not found.",
            "error"
        );

        return;

    }


    await loadCategories();

    await loadVendors();

    openModal(asset);

};


/* =========================================
   DELETE ASSET
========================================= */

window.deleteAsset = async function (id) {

    const asset =
        allAssets.find(
            item =>
                Number(item.id) ===
                Number(id)
        );


    if (!asset) {

        showMessage(
            "Asset not found.",
            "error"
        );

        return;

    }


    const confirmed =
        confirm(
            `Are you sure you want to delete "${asset.asset_name}"?`
        );


    if (!confirmed) {
        return;
    }


    try {

        const response = await fetch(
            `${API_BASE_URL}/assets/${id}`,
            {
                method: "DELETE",
                headers: getHeaders()
            }
        );


        if (response.status === 401) {

            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "user"
            );

            window.location.href =
                "index.html";

            return;

        }


        const data =
            await response.json();


        if (!response.ok || !data.success) {

            throw new Error(
                data.message ||
                "Unable to delete asset"
            );

        }


        showMessage(
            "Asset deleted successfully.",
            "success"
        );


        await loadAssets();

    } catch (error) {

        console.error(
            "Delete Asset Error:",
            error
        );


        showMessage(
            error.message ||
            "Unable to delete asset.",
            "error"
        );

    }

};


/* =========================================
   FORM SUBMIT
========================================= */

assetForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const assetData = {

            asset_name:
                document.getElementById(
                    "assetName"
                ).value.trim(),


            asset_code:
                document.getElementById(
                    "assetCode"
                ).value.trim(),


            category_id:
                document.getElementById(
                    "categoryId"
                ).value,


            vendor_id:
                document.getElementById(
                    "vendorId"
                ).value,


            purchase_date:
                document.getElementById(
                    "purchaseDate"
                ).value,


            warranty_expiry:
                document.getElementById(
                    "warrantyExpiry"
                ).value,


            asset_status:
                document.getElementById(
                    "assetStatus"
                ).value,


            location:
                document.getElementById(
                    "location"
                ).value.trim(),


            price:
                document.getElementById(
                    "price"
                ).value,


            qr_code:
                document.getElementById(
                    "qrCode"
                ).value.trim()

        };


        if (
            !assetData.asset_name ||
            !assetData.asset_code ||
            !assetData.category_id ||
            !assetData.vendor_id ||
            !assetData.purchase_date ||
            !assetData.warranty_expiry ||
            !assetData.asset_status ||
            !assetData.location ||
            assetData.price === ""
        ) {

            showMessage(
                "Please fill all required fields.",
                "error"
            );

            return;

        }


        saveButton.disabled = true;


        saveButton.textContent =
            editingAssetId
                ? "Updating..."
                : "Saving...";


        try {

            const url =
                editingAssetId

                    ? `${API_BASE_URL}/assets/${editingAssetId}`

                    : `${API_BASE_URL}/assets`;


            const method =
                editingAssetId
                    ? "PUT"
                    : "POST";


            const response =
                await fetch(
                    url,
                    {
                        method: method,

                        headers: getHeaders(),

                        body:
                            JSON.stringify(
                                assetData
                            )
                    }
                );


            if (response.status === 401) {

                localStorage.removeItem(
                    "token"
                );

                localStorage.removeItem(
                    "user"
                );

                window.location.href =
                    "index.html";

                return;

            }


            const data =
                await response.json();


            if (
                !response.ok ||
                !data.success
            ) {

                throw new Error(
                    data.message ||
                    "Unable to save asset"
                );

            }


            showMessage(

                editingAssetId
                    ? "Asset updated successfully."
                    : "Asset created successfully.",

                "success"

            );


            closeAssetModal();


            await loadAssets();


        } catch (error) {

            console.error(
                "Save Asset Error:",
                error
            );


            showMessage(
                error.message ||
                "Unable to save asset.",
                "error"
            );


        } finally {

            saveButton.disabled =
                false;


            saveButton.textContent =
                editingAssetId
                    ? "Update Asset"
                    : "Save Asset";

        }

    }
);


/* =========================================
   SEARCH
========================================= */

searchInput.addEventListener(
    "input",
    renderAssets
);


/* =========================================
   STATUS FILTER
========================================= */

statusFilter.addEventListener(
    "change",
    renderAssets
);


/* =========================================
   REFRESH
========================================= */

refreshButton.addEventListener(
    "click",
    loadAssets
);


/* =========================================
   LOGOUT
========================================= */

document
    .getElementById("logoutButton")
    .addEventListener(
        "click",
        function () {

            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "user"
            );

            window.location.href =
                "index.html";

        }
    );


/* =========================================
   INITIALIZE
========================================= */

async function initializeAssetsPage() {

    if (!checkAuthentication()) {
        return;
    }


    loadUserInfo();


    await loadAssets();

}


/* =========================================
   START
========================================= */

initializeAssetsPage();