const API = "http://localhost:5000/api/maintenance";
const ASSETS_API = "http://localhost:5000/api/assets";

let records = [];
let assets = [];


// =========================
// AUTH HEADERS
// =========================

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


// =========================
// NORMALIZE API RESPONSE
// =========================

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

    if (
        data.data &&
        Array.isArray(data.data[key])
    ) {
        return data.data[key];
    }

    return [];

}


// =========================
// MESSAGE
// =========================

function showMessage(text, type = "success") {

    const message =
        document.getElementById("message");

    message.textContent = text;

    message.className =
        "message show " + type;

    setTimeout(() => {

        message.className = "message";

    }, 3000);

}


// =========================
// GET REQUEST
// =========================

async function get(url) {

    const response = await fetch(
        url,
        {
            method: "GET",
            headers: headers()
        }
    );

    if (!response.ok) {

        throw new Error(
            "Request failed"
        );

    }

    return response.json();

}


// =========================
// LOAD ASSETS
// =========================

async function loadAssets() {

    try {

        const data =
            await get(ASSETS_API);

        assets =
            normalize(data, "assets");


        const select =
            document.getElementById("assetId");


        select.innerHTML = `
            <option value="">
                Select asset
            </option>
        `;


        assets.forEach(asset => {

            const option =
                document.createElement("option");

            option.value = asset.id;

            option.textContent =
                `${asset.asset_name || "Asset #" + asset.id}
                 ${asset.asset_code ? "(" + asset.asset_code + ")" : ""}`;


            select.appendChild(option);

        });

    }
    catch (error) {

        console.error(
            "Load Assets Error:",
            error
        );

    }

}


// =========================
// LOAD MAINTENANCE
// =========================

async function loadMaintenance() {

    try {

        const data =
            await get(API);

        records =
            normalize(data, "maintenance");


        render();

    }
    catch (error) {

        console.error(
            "Load Maintenance Error:",
            error
        );


        document.getElementById(
            "tableBody"
        ).innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="empty"
                >
                    ${error.message}
                </td>

            </tr>

        `;

    }

}


// =========================
// FIND ASSET NAME
// =========================

function getAssetName(assetId) {

    const asset =
        assets.find(
            item => item.id == assetId
        );


    if (!asset) {

        return "Asset #" + assetId;

    }


    return (
        asset.asset_name ||
        "Asset #" + asset.id
    );

}


// =========================
// STATUS CLASS
// =========================

function getStatusClass(status) {

    if (status === "Completed") {

        return "badge-completed";

    }

    if (status === "Pending") {

        return "badge-pending";

    }

    if (status === "In Progress") {

        return "badge-in-progress";

    }

    return "badge-other";

}


// =========================
// RENDER TABLE
// =========================

function render() {

    const search =
        document
            .getElementById("searchInput")
            .value
            .toLowerCase()
            .trim();


    const statusFilter =
        document.getElementById(
            "statusFilter"
        ).value;


    const filtered =
        records.filter(record => {

            const assetName =
                getAssetName(
                    record.asset_id
                );


            const text = `

                ${record.id}

                ${assetName}

                ${record.asset_id}

                ${record.maintenance_date || ""}

                ${record.description || ""}

                ${record.status || ""}

                ${record.cost || ""}

            `.toLowerCase();


            const matchesSearch =
                text.includes(search);


            const matchesStatus =
                !statusFilter ||
                record.status === statusFilter;


            return (
                matchesSearch &&
                matchesStatus
            );

        });


    const tableBody =
        document.getElementById(
            "tableBody"
        );


    if (!filtered.length) {

        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="empty"
                >
                    No maintenance records found.
                </td>

            </tr>

        `;

        return;

    }


    tableBody.innerHTML =
        filtered.map(record => {

            const status =
                record.status || "-";


            const statusClass =
                getStatusClass(status);


            const description =
                record.description || "-";


            const cost =
                record.cost !== null &&
                record.cost !== undefined &&
                record.cost !== ""
                    ? Number(record.cost).toFixed(2)
                    : "0.00";


            return `

                <tr>

                    <td>
                        ${record.id}
                    </td>


                    <td>

                        <strong>
                            ${getAssetName(
                                record.asset_id
                            )}
                        </strong>

                    </td>


                    <td>
                        ${record.maintenance_date || "-"}
                    </td>


                    <td
                        class="description-cell"
                        title="${description}"
                    >
                        ${description}
                    </td>


                    <td>

                        <span
                            class="badge ${statusClass}"
                        >
                            ${status}
                        </span>

                    </td>


                    <td>
                        ${cost}
                    </td>


                    <td>

                        <div class="actions">

                            <button
                                class="edit-btn"
                                onclick="editRecord(${record.id})"
                            >
                                Edit
                            </button>


                            <button
                                class="delete-btn"
                                onclick="deleteRecord(${record.id})"
                            >
                                Delete
                            </button>

                        </div>

                    </td>

                </tr>

            `;

        }).join("");

}


// =========================
// OPEN ADD MODAL
// =========================

function openAdd() {

    document
        .getElementById("form")
        .reset();


    document
        .getElementById("maintenanceId")
        .value = "";


    document
        .getElementById("modalTitle")
        .textContent =
        "New Maintenance";


    document
        .getElementById("status")
        .value =
        "Pending";


    document
        .getElementById("modal")
        .classList
        .add("show");

}


// =========================
// EDIT RECORD
// =========================

window.editRecord = function (id) {

    const record =
        records.find(
            item => item.id == id
        );


    if (!record) {

        return;

    }


    document
        .getElementById("maintenanceId")
        .value =
        record.id;


    document
        .getElementById("assetId")
        .value =
        record.asset_id;


    document
        .getElementById("maintenanceDate")
        .value =
        record.maintenance_date || "";


    document
        .getElementById("description")
        .value =
        record.description || "";


    document
        .getElementById("status")
        .value =
        record.status || "Pending";


    document
        .getElementById("cost")
        .value =
        record.cost ?? "";


    document
        .getElementById("modalTitle")
        .textContent =
        "Edit Maintenance";


    document
        .getElementById("modal")
        .classList
        .add("show");

};


// =========================
// DELETE RECORD
// =========================

window.deleteRecord = async function (id) {

    const confirmed =
        confirm(
            "Delete this maintenance record?"
        );


    if (!confirmed) {

        return;

    }


    try {

        const response =
            await fetch(
                `${API}/${id}`,
                {
                    method: "DELETE",
                    headers: headers()
                }
            );


        if (!response.ok) {

            throw new Error(
                "Delete failed"
            );

        }


        showMessage(
            "Maintenance record deleted successfully."
        );


        await loadMaintenance();

    }
    catch (error) {

        console.error(
            "Delete Maintenance Error:",
            error
        );


        showMessage(
            error.message,
            "error"
        );

    }

};


// =========================
// FORM SUBMIT
// =========================

document
    .getElementById("form")
    .addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const id =
                document
                    .getElementById(
                        "maintenanceId"
                    )
                    .value;


            const assetId =
                document
                    .getElementById(
                        "assetId"
                    )
                    .value;


            const maintenanceDate =
                document
                    .getElementById(
                        "maintenanceDate"
                    )
                    .value;


            const description =
                document
                    .getElementById(
                        "description"
                    )
                    .value
                    .trim();


            const status =
                document
                    .getElementById(
                        "status"
                    )
                    .value;


            const costValue =
                document
                    .getElementById(
                        "cost"
                    )
                    .value;


            if (!assetId) {

                showMessage(
                    "Please select an asset.",
                    "error"
                );

                return;

            }


            if (!maintenanceDate) {

                showMessage(
                    "Please select a maintenance date.",
                    "error"
                );

                return;

            }


            const payload = {

                asset_id:
                    Number(assetId),

                maintenance_date:
                    maintenanceDate,

                description:
                    description || null,

                status:
                    status,

                cost:
                    costValue === ""
                        ? 0
                        : Number(costValue)

            };


            try {

                const response =
                    await fetch(
                        id
                            ? `${API}/${id}`
                            : API,
                        {
                            method:
                                id
                                    ? "PUT"
                                    : "POST",

                            headers:
                                headers(),

                            body:
                                JSON.stringify(
                                    payload
                                )

                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Could not save maintenance record."
                    );

                }


                document
                    .getElementById("modal")
                    .classList
                    .remove("show");


                showMessage(
                    id
                        ? "Maintenance record updated successfully."
                        : "Maintenance record added successfully."
                );


                await loadMaintenance();

            }
            catch (error) {

                console.error(
                    "Save Maintenance Error:",
                    error
                );


                showMessage(
                    error.message,
                    "error"
                );

            }

        }
    );


// =========================
// BUTTON EVENTS
// =========================

document
    .getElementById("addButton")
    .addEventListener(
        "click",
        openAdd
    );


document
    .getElementById("closeModal")
    .addEventListener(
        "click",
        function () {

            document
                .getElementById("modal")
                .classList
                .remove("show");

        }
    );


document
    .getElementById("cancelButton")
    .addEventListener(
        "click",
        function () {

            document
                .getElementById("modal")
                .classList
                .remove("show");

        }
    );


document
    .getElementById("refreshButton")
    .addEventListener(
        "click",
        function () {

            loadMaintenance();

        }
    );


document
    .getElementById("searchInput")
    .addEventListener(
        "input",
        render
    );


document
    .getElementById("statusFilter")
    .addEventListener(
        "change",
        render
    );


// =========================
// CLOSE MODAL ON OUTSIDE CLICK
// =========================

document
    .getElementById("modal")
    .addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                document.getElementById("modal")
            ) {

                document
                    .getElementById("modal")
                    .classList
                    .remove("show");

            }

        }
    );


// =========================
// LOGOUT
// =========================

document
    .getElementById("logoutButton")
    .addEventListener(
        "click",
        function () {

            localStorage.clear();

            window.location.href =
                "index.html";

        }
    );


// =========================
// LOAD USER
// =========================

function loadUser() {

    try {

        const storedUser =
            localStorage.getItem("user");


        if (!storedUser) {

            return;

        }


        const user =
            JSON.parse(storedUser);


        const name =
            user.full_name ||
            user.name ||
            user.username ||
            "Admin User";


        const role =
            user.role ||
            "System Administrator";


        const avatar =
            name
                .charAt(0)
                .toUpperCase();


        document
            .getElementById("userName")
            .textContent =
            name;


        document
            .getElementById("userRole")
            .textContent =
            role;


        document
            .getElementById("profileAvatar")
            .textContent =
            avatar;

    }
    catch (error) {

        console.error(
            "User Load Error:",
            error
        );

    }

}


// =========================
// INITIAL LOAD
// =========================

loadUser();

loadAssets().then(() => {

    loadMaintenance();

});