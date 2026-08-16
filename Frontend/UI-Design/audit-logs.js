const API = "http://localhost:5000/api/audit-logs";

let records = [];


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


function showMessage(text, type = "success") {

    const message = document.getElementById("message");

    message.textContent = text;

    message.className =
        "message show " + type;

    setTimeout(() => {

        message.className = "message";

    }, 3000);

}


async function get(url) {

    const response = await fetch(url, {
        headers: headers()
    });

    if (!response.ok) {

        throw new Error(
            "Request failed: " + response.status
        );

    }

    return response.json();

}


async function loadAuditLogs() {

    try {

        const data = await get(API);

        records = normalize(data, "auditLogs");

        populateTableFilter();

        render();

    } catch (error) {

        console.error(error);

        document.getElementById("tableBody").innerHTML = `
            <tr>
                <td colspan="6" class="empty">
                    ${error.message}
                </td>
            </tr>
        `;

    }

}


function populateTableFilter() {

    const filter =
        document.getElementById("tableFilter");

    const currentValue = filter.value;

    const tables = [
        ...new Set(
            records
                .map(item => item.table_name)
                .filter(Boolean)
        )
    ];

    filter.innerHTML = `
        <option value="">
            All tables
        </option>
    `;

    tables.forEach(table => {

        const option =
            document.createElement("option");

        option.value = table;

        option.textContent = table;

        filter.appendChild(option);

    });

    filter.value = currentValue;

}


function render() {

    const search =
        document
            .getElementById("searchInput")
            .value
            .toLowerCase();

    const tableFilter =
        document.getElementById("tableFilter").value;


    const filtered = records.filter(item => {

        const text = `
            ${item.id || ""}
            ${item.user_id || ""}
            ${item.action || ""}
            ${item.table_name || ""}
            ${item.created_at || ""}
        `.toLowerCase();

        const matchesSearch =
            text.includes(search);

        const matchesTable =
            !tableFilter ||
            item.table_name === tableFilter;

        return matchesSearch && matchesTable;

    });


    if (!filtered.length) {

        document.getElementById("tableBody").innerHTML = `
            <tr>
                <td colspan="6" class="empty">
                    No audit logs found.
                </td>
            </tr>
        `;

        return;

    }


    document.getElementById("tableBody").innerHTML =
        filtered.map(item => `

            <tr>

                <td>
                    ${item.id}
                </td>

                <td>
                    <strong>
                        User #${item.user_id}
                    </strong>
                </td>

                <td>
                    <span class="action-badge">
                        ${item.action || "-"}
                    </span>
                </td>

                <td>
                    ${item.table_name || "-"}
                </td>

                <td>
                    ${formatDate(item.created_at)}
                </td>

                <td>

                    <div class="actions">

                        <button
                            class="edit-btn"
                            onclick="editRecord(${item.id})"
                        >
                            Edit
                        </button>

                        <button
                            class="delete-btn"
                            onclick="deleteRecord(${item.id})"
                        >
                            Delete
                        </button>

                    </div>

                </td>

            </tr>

        `).join("");

}


function formatDate(value) {

    if (!value) {
        return "-";
    }

    const date = new Date(value);

    if (isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleString();

}


function openAdd() {

    document
        .getElementById("form")
        .reset();

    document
        .getElementById("auditLogId")
        .value = "";

    document
        .getElementById("modalTitle")
        .textContent = "Add Audit Log";

    document
        .getElementById("modal")
        .classList.add("show");

}


window.editRecord = function (id) {

    const record =
        records.find(item => item.id == id);

    if (!record) {
        return;
    }


    document
        .getElementById("auditLogId")
        .value = record.id;

    document
        .getElementById("userId")
        .value = record.user_id || "";

    document
        .getElementById("action")
        .value = record.action || "";

    document
        .getElementById("tableName")
        .value = record.table_name || "";


    document
        .getElementById("modalTitle")
        .textContent = "Edit Audit Log";

    document
        .getElementById("modal")
        .classList.add("show");

};


window.deleteRecord = async function (id) {

    if (!confirm("Delete this audit log?")) {
        return;
    }


    try {

        const response =
            await fetch(`${API}/${id}`, {

                method: "DELETE",

                headers: headers()

            });


        if (!response.ok) {

            throw new Error(
                "Delete failed"
            );

        }


        showMessage(
            "Audit log deleted successfully"
        );

        loadAuditLogs();


    } catch (error) {

        console.error(error);

        showMessage(
            error.message,
            "error"
        );

    }

};


document
    .getElementById("form")
    .addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const id =
                document
                    .getElementById("auditLogId")
                    .value;


            const payload = {

                user_id:
                    Number(
                        document
                            .getElementById("userId")
                            .value
                    ),

                action:
                    document
                        .getElementById("action")
                        .value
                        .trim(),

                table_name:
                    document
                        .getElementById("tableName")
                        .value
                        .trim()

            };


            if (!payload.user_id ||
                !payload.action) {

                showMessage(
                    "User ID and action are required",
                    "error"
                );

                return;

            }


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

                            headers: headers(),

                            body:
                                JSON.stringify(payload)

                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Could not save audit log"
                    );

                }


                document
                    .getElementById("modal")
                    .classList.remove("show");


                showMessage(
                    id
                        ? "Audit log updated successfully"
                        : "Audit log added successfully"
                );


                loadAuditLogs();


            } catch (error) {

                console.error(error);

                showMessage(
                    error.message,
                    "error"
                );

            }

        }
    );


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
                .classList.remove("show");

        }
    );


document
    .getElementById("cancelButton")
    .addEventListener(
        "click",
        function () {

            document
                .getElementById("modal")
                .classList.remove("show");

        }
    );


document
    .getElementById("refreshButton")
    .addEventListener(
        "click",
        loadAuditLogs
    );


document
    .getElementById("searchInput")
    .addEventListener(
        "input",
        render
    );


document
    .getElementById("tableFilter")
    .addEventListener(
        "change",
        render
    );


document
    .getElementById("logoutButton")
    .addEventListener(
        "click",
        function () {

            localStorage.clear();

            location.href =
                "UI-Design/index.html";

        }
    );


loadAuditLogs();