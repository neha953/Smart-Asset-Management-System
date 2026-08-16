const API = "http://localhost:5000/api/assignments";

const ASSETS_API = "http://localhost:5000/api/assets";

const EMPLOYEES_API = "http://localhost:5000/api/employees";


let records = [];

let assets = [];

let employees = [];



/* =========================
   AUTH HEADERS
========================= */

function getHeaders() {

    const token =
        localStorage.getItem("token") ||
        localStorage.getItem("authToken") ||
        localStorage.getItem("accessToken") ||
        "";

    return {

        "Content-Type": "application/json",

        "Authorization": `Bearer ${token}`

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

    if (
        data.data &&
        Array.isArray(data.data[key])
    ) {
        return data.data[key];
    }

    return [];

}



/* =========================
   MESSAGE
========================= */

function showMessage(text, type = "success") {

    const message =
        document.getElementById("message");

    message.textContent = text;

    message.className =
        `message show ${type}`;

    setTimeout(() => {

        message.className = "message";

    }, 3000);

}



/* =========================
   API GET
========================= */

async function getData(url) {

    const response = await fetch(
        url,
        {
            method: "GET",
            headers: getHeaders()
        }
    );

    if (!response.ok) {

        const errorData =
            await response.json().catch(() => ({}));

        throw new Error(
            errorData.message ||
            "Request failed"
        );

    }

    return response.json();

}



/* =========================
   LOAD ASSIGNMENTS
========================= */

async function loadAssignments() {

    const tableBody =
        document.getElementById("tableBody");

    tableBody.innerHTML = `
        <tr>
            <td colspan="7" class="empty">
                Loading assignments...
            </td>
        </tr>
    `;


    try {

        const data =
            await getData(API);

        records =
            normalize(data, "assignments");

        renderAssignments();

    } catch (error) {

        console.error(
            "Load Assignments Error:",
            error
        );

        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="empty">
                    ${error.message}
                </td>
            </tr>
        `;

    }

}



/* =========================
   LOAD ASSETS + EMPLOYEES
========================= */

async function loadOptions() {

    try {

        const [
            assetsResponse,
            employeesResponse
        ] = await Promise.all([

            getData(ASSETS_API),

            getData(EMPLOYEES_API)

        ]);


        assets =
            normalize(
                assetsResponse,
                "assets"
            );


        employees =
            normalize(
                employeesResponse,
                "employees"
            );


        populateAssetDropdown();

        populateEmployeeDropdown();


    } catch (error) {

        console.error(
            "Load Options Error:",
            error
        );

    }

}



/* =========================
   ASSET DROPDOWN
========================= */

function populateAssetDropdown() {

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

        option.value =
            asset.id;

        option.textContent =
            `${asset.asset_name || "Asset"} (${asset.asset_code || asset.id})`;

        select.appendChild(option);

    });

}



/* =========================
   EMPLOYEE DROPDOWN
========================= */

function populateEmployeeDropdown() {

    const select =
        document.getElementById("employeeId");


    select.innerHTML = `
        <option value="">
            Select employee
        </option>
    `;


    employees.forEach(employee => {

        const option =
            document.createElement("option");

        option.value =
            employee.id;

        option.textContent =
            employee.full_name ||
            employee.name ||
            `Employee #${employee.id}`;

        select.appendChild(option);

    });

}



/* =========================
   FIND ASSET NAME
========================= */

function getAssetName(assetId) {

    const asset =
        assets.find(
            item => item.id == assetId
        );


    if (asset) {

        return (
            asset.asset_name ||
            `Asset #${assetId}`
        );

    }


    return `Asset #${assetId}`;

}



/* =========================
   FIND EMPLOYEE NAME
========================= */

function getEmployeeName(employeeId) {

    const employee =
        employees.find(
            item => item.id == employeeId
        );


    if (employee) {

        return (
            employee.full_name ||
            employee.name ||
            `Employee #${employeeId}`
        );

    }


    return `Employee #${employeeId}`;

}



/* =========================
   FORMAT DATE
========================= */

function formatDate(date) {

    if (!date) {
        return "-";
    }

    return String(date).split("T")[0];

}



/* =========================
   RENDER ASSIGNMENTS
========================= */

function renderAssignments() {

    const tableBody =
        document.getElementById("tableBody");


    const search =
        document
            .getElementById("searchInput")
            .value
            .trim()
            .toLowerCase();


    const status =
        document
            .getElementById("statusFilter")
            .value;


    const filtered =
        records.filter(record => {

            const assetName =
                getAssetName(
                    record.asset_id
                );


            const employeeName =
                getEmployeeName(
                    record.employee_id
                );


            const searchableText = `

                ${record.id}

                ${assetName}

                ${employeeName}

                ${record.status || ""}

                ${record.assigned_date || ""}

                ${record.return_date || ""}

            `.toLowerCase();


            const matchesSearch =
                searchableText.includes(search);


            const matchesStatus =
                !status ||
                record.status === status;


            return (
                matchesSearch &&
                matchesStatus
            );

        });



    if (!filtered.length) {

        tableBody.innerHTML = `
            <tr>
                <td
                    colspan="7"
                    class="empty"
                >
                    No assignments found.
                </td>
            </tr>
        `;

        return;

    }



    tableBody.innerHTML =
        filtered.map(record => {

            const assetName =
                getAssetName(
                    record.asset_id
                );


            const employeeName =
                getEmployeeName(
                    record.employee_id
                );


            const badgeClass =
                record.status === "Assigned"
                    ? "badge-assigned"
                    : record.status === "Returned"
                        ? "badge-returned"
                        : "badge-other";


            return `

                <tr>

                    <td>
                        ${record.id}
                    </td>


                    <td>

                        <strong>
                            ${assetName}
                        </strong>

                    </td>


                    <td>
                        ${employeeName}
                    </td>


                    <td>
                        ${formatDate(
                            record.assigned_date
                        )}
                    </td>


                    <td>
                        ${formatDate(
                            record.return_date
                        )}
                    </td>


                    <td>

                        <span
                            class="badge ${badgeClass}"
                        >
                            ${record.status || "-"}
                        </span>

                    </td>


                    <td>

                        <div class="actions">

                            <button
                                class="edit-btn"
                                onclick="editAssignment(${record.id})"
                            >
                                Edit
                            </button>


                            <button
                                class="delete-btn"
                                onclick="deleteAssignment(${record.id})"
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
   OPEN ADD MODAL
========================= */

function openAddModal() {

    document
        .getElementById("form")
        .reset();


    document
        .getElementById("assignmentId")
        .value = "";


    document
        .getElementById("modalTitle")
        .textContent =
        "New Assignment";


    document
        .getElementById("status")
        .value =
        "Assigned";


    document
        .getElementById("modal")
        .classList
        .add("show");

}



/* =========================
   EDIT ASSIGNMENT
========================= */

window.editAssignment =
    function (id) {

        const record =
            records.find(
                item => item.id == id
            );


        if (!record) {

            showMessage(
                "Assignment not found.",
                "error"
            );

            return;

        }


        document
            .getElementById("assignmentId")
            .value =
            record.id;


        document
            .getElementById("assetId")
            .value =
            record.asset_id;


        document
            .getElementById("employeeId")
            .value =
            record.employee_id;


        document
            .getElementById("assignedDate")
            .value =
            formatDate(
                record.assigned_date
            );


        document
            .getElementById("returnDate")
            .value =
            formatDate(
                record.return_date
            );


        document
            .getElementById("status")
            .value =
            record.status ||
            "Assigned";


        document
            .getElementById("modalTitle")
            .textContent =
            "Edit Assignment";


        document
            .getElementById("modal")
            .classList
            .add("show");

    };



/* =========================
   DELETE ASSIGNMENT
========================= */

window.deleteAssignment =
    async function (id) {

        const confirmed =
            confirm(
                "Are you sure you want to delete this assignment?"
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
                        headers: getHeaders()
                    }
                );


            const data =
                await response
                    .json()
                    .catch(() => ({}));


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Delete failed"
                );

            }


            showMessage(
                "Assignment deleted successfully."
            );


            await loadAssignments();

        } catch (error) {

            console.error(
                "Delete Assignment Error:",
                error
            );


            showMessage(
                error.message,
                "error"
            );

        }

    };



/* =========================
   SAVE ASSIGNMENT
========================= */

document
    .getElementById("form")
    .addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const id =
                document
                    .getElementById("assignmentId")
                    .value;


            const assetId =
                document
                    .getElementById("assetId")
                    .value;


            const employeeId =
                document
                    .getElementById("employeeId")
                    .value;


            const assignedDate =
                document
                    .getElementById("assignedDate")
                    .value;


            const returnDate =
                document
                    .getElementById("returnDate")
                    .value;


            const status =
                document
                    .getElementById("status")
                    .value;



            if (
                !assetId ||
                !employeeId ||
                !assignedDate
            ) {

                showMessage(
                    "Asset, employee and assigned date are required.",
                    "error"
                );

                return;

            }



            const payload = {

                asset_id:
                    Number(assetId),

                employee_id:
                    Number(employeeId),

                assigned_date:
                    assignedDate,

                return_date:
                    returnDate ||
                    null,

                status:
                    status ||
                    "Assigned"

            };



            try {

                const url =
                    id
                        ? `${API}/${id}`
                        : API;


                const method =
                    id
                        ? "PUT"
                        : "POST";


                const response =
                    await fetch(
                        url,
                        {
                            method,
                            headers: getHeaders(),
                            body:
                                JSON.stringify(
                                    payload
                                )
                        }
                    );


                const data =
                    await response
                        .json()
                        .catch(() => ({}));


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Could not save assignment"
                    );

                }


                document
                    .getElementById("modal")
                    .classList
                    .remove("show");


                showMessage(
                    id
                        ? "Assignment updated successfully."
                        : "Assignment created successfully."
                );


                await loadAssignments();


            } catch (error) {

                console.error(
                    "Save Assignment Error:",
                    error
                );


                showMessage(
                    error.message,
                    "error"
                );

            }

        }
    );



/* =========================
   CLOSE MODAL
========================= */

function closeModal() {

    document
        .getElementById("modal")
        .classList
        .remove("show");

}


document
    .getElementById("closeModal")
    .addEventListener(
        "click",
        closeModal
    );


document
    .getElementById("cancelButton")
    .addEventListener(
        "click",
        closeModal
    );



/* =========================
   ADD BUTTON
========================= */

document
    .getElementById("addButton")
    .addEventListener(
        "click",
        openAddModal
    );



/* =========================
   REFRESH
========================= */

document
    .getElementById("refreshButton")
    .addEventListener(
        "click",
        async function () {

            await loadOptions();

            await loadAssignments();

        }
    );



/* =========================
   SEARCH
========================= */

document
    .getElementById("searchInput")
    .addEventListener(
        "input",
        renderAssignments
    );



/* =========================
   STATUS FILTER
========================= */

document
    .getElementById("statusFilter")
    .addEventListener(
        "change",
        renderAssignments
    );



/* =========================
   CLOSE MODAL ON BACKDROP
========================= */

document
    .getElementById("modal")
    .addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                this
            ) {

                closeModal();

            }

        }
    );



/* =========================
   LOGOUT
========================= */

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



/* =========================
   USER INFO
========================= */

function loadUserInfo() {

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
            user.user_role ||
            "System Administrator";


        const userName =
            document.getElementById(
                "userName"
            );


        const userRole =
            document.getElementById(
                "userRole"
            );


        const avatar =
            document.getElementById(
                "profileAvatar"
            );


        if (userName) {
            userName.textContent =
                name;
        }


        if (userRole) {
            userRole.textContent =
                role;
        }


        if (avatar) {
            avatar.textContent =
                name
                    .charAt(0)
                    .toUpperCase();
        }

    } catch (error) {

        console.error(
            "User Info Error:",
            error
        );

    }

}



/* =========================
   INITIALIZE
========================= */

loadUserInfo();

loadOptions();

loadAssignments();