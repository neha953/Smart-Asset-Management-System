/* =========================================
   EMPLOYEES PAGE
========================================= */

const API_URL = "http://localhost:5000/api/employees";


/* =========================================
   ELEMENTS
========================================= */

const employeesBody =
    document.getElementById("employeesBody");

const searchInput =
    document.getElementById("searchInput");

const statusFilter =
    document.getElementById("statusFilter");

const refreshButton =
    document.getElementById("refreshButton");

const addEmployeeButton =
    document.getElementById("addEmployeeButton");

const employeeModal =
    document.getElementById("employeeModal");

const closeModal =
    document.getElementById("closeModal");

const cancelButton =
    document.getElementById("cancelButton");

const employeeForm =
    document.getElementById("employeeForm");

const modalTitle =
    document.getElementById("modalTitle");

const messageBox =
    document.getElementById("message");

const logoutButton =
    document.getElementById("logoutButton");


/* =========================================
   FORM ELEMENTS
========================================= */

const employeeId =
    document.getElementById("employeeId");

const fullName =
    document.getElementById("fullName");

const email =
    document.getElementById("email");

const phone =
    document.getElementById("phone");

const department =
    document.getElementById("department");

const designation =
    document.getElementById("designation");

const status =
    document.getElementById("status");


/* =========================================
   DATA
========================================= */

let employees = [];

let editingEmployeeId = null;


/* =========================================
   TOKEN
========================================= */

function getToken() {

    return localStorage.getItem("token");

}


/* =========================================
   AUTH HEADERS
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
   LOAD USER
========================================= */

function loadUser() {

    const storedUser =
        localStorage.getItem("user");

    if (!storedUser) {
        return;
    }

    try {

        const user =
            JSON.parse(storedUser);

        const userName =
            document.getElementById("userName");

        const userRole =
            document.getElementById("userRole");

        const profileAvatar =
            document.getElementById("profileAvatar");


        if (userName) {

            userName.textContent =
                user.name ||
                user.full_name ||
                user.username ||
                "Admin User";

        }


        if (userRole) {

            userRole.textContent =
                user.role ||
                "System Administrator";

        }


        if (profileAvatar) {

            const name =
                user.name ||
                user.full_name ||
                user.username ||
                "Admin";

            profileAvatar.textContent =
                name.charAt(0).toUpperCase();

        }

    } catch (error) {

        console.error(
            "User data error:",
            error
        );

    }

}


/* =========================================
   MESSAGE
========================================= */

function showMessage(text, type) {

    messageBox.textContent = text;

    messageBox.className =
        "message show " + type;


    setTimeout(() => {

        messageBox.className =
            "message";

    }, 3500);

}


/* =========================================
   LOAD EMPLOYEES
========================================= */

async function loadEmployees() {

    employeesBody.innerHTML = `
        <tr>
            <td
                colspan="8"
                class="empty"
            >
                Loading employees...
            </td>
        </tr>
    `;


    try {

        const response =
            await fetch(
                API_URL,
                {
                    method: "GET",
                    headers: getHeaders()
                }
            );


        if (response.status === 401) {

            showMessage(
                "Session expired. Please login again.",
                "error"
            );

            return;

        }


        if (response.status === 403) {

            showMessage(
                "You are not authorized to view employees.",
                "error"
            );

            return;

        }


        const result =
            await response.json();


        if (!response.ok || !result.success) {

            throw new Error(
                result.message ||
                "Unable to load employees."
            );

        }


        employees =
            result.data || [];


        renderEmployees();


    } catch (error) {

        console.error(
            "Load Employees Error:",
            error
        );


        employeesBody.innerHTML = `
            <tr>
                <td
                    colspan="8"
                    class="empty"
                >
                    Unable to load employees.
                    <br><br>
                    Please check the backend server.
                </td>
            </tr>
        `;

    }

}


/* =========================================
   RENDER EMPLOYEES
========================================= */

function renderEmployees() {

    const search =
        searchInput.value
            .trim()
            .toLowerCase();


    const selectedStatus =
        statusFilter.value;


    const filtered =
        employees.filter(employee => {


            const name =
                String(
                    employee.full_name ||
                    employee.name ||
                    ""
                ).toLowerCase();


            const employeeEmail =
                String(
                    employee.email ||
                    ""
                ).toLowerCase();


            const employeeDepartment =
                String(
                    employee.department ||
                    ""
                ).toLowerCase();


            const employeeDesignation =
                String(
                    employee.designation ||
                    ""
                ).toLowerCase();


            const employeePhone =
                String(
                    employee.phone ||
                    ""
                ).toLowerCase();


            const employeeStatus =
                employee.status ||
                employee.employee_status ||
                "Active";


            const matchesSearch =
                !search ||
                name.includes(search) ||
                employeeEmail.includes(search) ||
                employeeDepartment.includes(search) ||
                employeeDesignation.includes(search) ||
                employeePhone.includes(search);


            const matchesStatus =
                !selectedStatus ||
                employeeStatus === selectedStatus;


            return (
                matchesSearch &&
                matchesStatus
            );

        });


    if (filtered.length === 0) {

        employeesBody.innerHTML = `
            <tr>
                <td
                    colspan="8"
                    class="empty"
                >
                    No employees found.
                </td>
            </tr>
        `;

        return;

    }


    employeesBody.innerHTML =
        filtered
            .map(employee => createEmployeeRow(employee))
            .join("");

}


/* =========================================
   CREATE EMPLOYEE ROW
========================================= */

function createEmployeeRow(employee) {

    const id =
        employee.employee_id ||
        employee.id ||
        employee.employeeId;


    const name =
        employee.full_name ||
        employee.name ||
        "-";


    const employeeEmail =
        employee.email ||
        "-";


    const employeeDepartment =
        employee.department ||
        "-";


    const employeeDesignation =
        employee.designation ||
        "-";


    const employeePhone =
        employee.phone ||
        "-";


    const employeeStatus =
        employee.status ||
        employee.employee_status ||
        "Active";


    const badgeClass =
        employeeStatus === "Active"
            ? "badge-active"
            : "badge-inactive";


    return `

        <tr>

            <td>
                ${escapeHTML(id)}
            </td>

            <td>
                <strong>
                    ${escapeHTML(name)}
                </strong>
            </td>

            <td>
                ${escapeHTML(employeeEmail)}
            </td>

            <td>
                ${escapeHTML(employeeDepartment)}
            </td>

            <td>
                ${escapeHTML(employeeDesignation)}
            </td>

            <td>
                ${escapeHTML(employeePhone)}
            </td>

            <td>

                <span
                    class="badge ${badgeClass}"
                >
                    ${escapeHTML(employeeStatus)}
                </span>

            </td>

            <td>

                <div class="actions">

                    <button
                        type="button"
                        class="edit-btn"
                        onclick="editEmployee(${Number(id)})"
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        class="delete-btn"
                        onclick="deleteEmployee(${Number(id)})"
                    >
                        Delete
                    </button>

                </div>

            </td>

        </tr>

    `;

}


/* =========================================
   ESCAPE HTML
========================================= */

function escapeHTML(value) {

    if (value === null ||
        value === undefined) {

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
   OPEN ADD MODAL
========================================= */

function openAddModal() {

    editingEmployeeId = null;

    employeeId.value = "";

    employeeForm.reset();

    status.value = "Active";

    modalTitle.textContent =
        "Add Employee";

    employeeModal.classList.add("show");

}


/* =========================================
   OPEN EDIT MODAL
========================================= */

function editEmployee(id) {

    const employee =
        employees.find(item => {

            const employeeIdValue =
                item.employee_id ||
                item.id ||
                item.employeeId;

            return Number(employeeIdValue) === Number(id);

        });


    if (!employee) {

        showMessage(
            "Employee record not found.",
            "error"
        );

        return;

    }


    editingEmployeeId = id;


    employeeId.value = id;


    fullName.value =
        employee.full_name ||
        employee.name ||
        "";


    email.value =
        employee.email ||
        "";


    phone.value =
        employee.phone ||
        "";


    department.value =
        employee.department ||
        "";


    designation.value =
        employee.designation ||
        "";


    status.value =
        employee.status ||
        employee.employee_status ||
        "Active";


    modalTitle.textContent =
        "Edit Employee";


    employeeModal.classList.add("show");

}


/* =========================================
   CLOSE MODAL
========================================= */

function closeEmployeeModal() {

    employeeModal.classList.remove("show");

    editingEmployeeId = null;

    employeeForm.reset();

    employeeId.value = "";

}


/* =========================================
   SAVE EMPLOYEE
========================================= */

employeeForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const employeeData = {

            full_name:
                fullName.value.trim(),

            email:
                email.value.trim(),

            phone:
                phone.value.trim(),

            department:
                department.value.trim(),

            designation:
                designation.value.trim(),

            status:
                status.value

        };


        if (!employeeData.full_name) {

            showMessage(
                "Please enter employee name.",
                "error"
            );

            return;

        }


        try {

            let url = API_URL;

            let method = "POST";


            if (editingEmployeeId) {

                url =
                    `${API_URL}/${editingEmployeeId}`;

                method = "PUT";

            }


            const response =
                await fetch(
                    url,
                    {
                        method: method,

                        headers: getHeaders(),

                        body:
                            JSON.stringify(
                                employeeData
                            )
                    }
                );


            const result =
                await response.json();


            if (!response.ok ||
                !result.success) {

                throw new Error(
                    result.message ||
                    "Unable to save employee."
                );

            }


            closeEmployeeModal();


            showMessage(
                editingEmployeeId
                    ? "Employee updated successfully."
                    : "Employee added successfully.",
                "success"
            );


            await loadEmployees();


        } catch (error) {

            console.error(
                "Save Employee Error:",
                error
            );


            showMessage(
                error.message ||
                "Unable to save employee.",
                "error"
            );

        }

    }
);


/* =========================================
   DELETE EMPLOYEE
========================================= */

async function deleteEmployee(id) {

    const employee =
        employees.find(item => {

            const employeeIdValue =
                item.employee_id ||
                item.id ||
                item.employeeId;

            return Number(employeeIdValue) === Number(id);

        });


    const name =
        employee
            ? (
                employee.full_name ||
                employee.name ||
                "this employee"
            )
            : "this employee";


    const confirmed =
        confirm(
            `Are you sure you want to delete ${name}?`
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/${id}`,
                {
                    method: "DELETE",
                    headers: getHeaders()
                }
            );


        const result =
            await response.json();


        if (!response.ok ||
            !result.success) {

            throw new Error(
                result.message ||
                "Unable to delete employee."
            );

        }


        showMessage(
            "Employee deleted successfully.",
            "success"
        );


        await loadEmployees();


    } catch (error) {

        console.error(
            "Delete Employee Error:",
            error
        );


        showMessage(
            error.message ||
            "Unable to delete employee.",
            "error"
        );

    }

}


/* =========================================
   SEARCH
========================================= */

searchInput.addEventListener(
    "input",
    renderEmployees
);


/* =========================================
   FILTER
========================================= */

statusFilter.addEventListener(
    "change",
    renderEmployees
);


/* =========================================
   REFRESH
========================================= */

refreshButton.addEventListener(
    "click",
    loadEmployees
);


/* =========================================
   ADD BUTTON
========================================= */

addEmployeeButton.addEventListener(
    "click",
    openAddModal
);


/* =========================================
   CLOSE BUTTON
========================================= */

closeModal.addEventListener(
    "click",
    closeEmployeeModal
);


cancelButton.addEventListener(
    "click",
    closeEmployeeModal
);


/* =========================================
   CLICK OUTSIDE MODAL
========================================= */

employeeModal.addEventListener(
    "click",
    function(event) {

        if (
            event.target === employeeModal
        ) {

            closeEmployeeModal();

        }

    }
);


/* =========================================
   ESC KEY
========================================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Escape" &&
            employeeModal.classList.contains("show")
        ) {

            closeEmployeeModal();

        }

    }
);


/* =========================================
   LOGOUT
========================================= */

logoutButton.addEventListener(
    "click",
    function() {

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        window.location.href =
            "index.html";

    }
);


/* =========================================
   INITIALIZE
========================================= */

loadUser();

loadEmployees();