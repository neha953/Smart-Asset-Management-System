document.addEventListener("DOMContentLoaded", function () {

    const userData = localStorage.getItem("user");
    if (!userData) return;

    let user;
    try { user = JSON.parse(userData); } catch (e) { return; }

    const role = user.role;
    const page = window.location.pathname.split("/").pop() || "dashboard.html";

    const allowedPages = {
        Admin: null, // null = all pages allowed
        SubAdmin: ["users.html"], // everything EXCEPT this list
        ReportViewer: ["reports.html", "profile.html"],
        Reader: ["permissions.html", "profile.html"]
    };

    // Redirect if current page isn't allowed for this role
    if (role === "ReportViewer" && !allowedPages.ReportViewer.includes(page)) {
        window.location.href = "reports.html";
        return;
    }

    if (role === "Reader" && !allowedPages.Reader.includes(page)) {
        window.location.href = "permissions.html";
        return;
    }

    if (role === "SubAdmin" && allowedPages.SubAdmin.includes(page)) {
        window.location.href = "dashboard.html";
        return;
    }

    // Hide sidebar links this role shouldn't see
    document.querySelectorAll(".nav-item").forEach(link => {

        const href = link.getAttribute("href");

        if (role === "ReportViewer" && !["reports.html"].includes(href)) {
            link.style.display = "none";
        }

        if (role === "Reader" && !["permissions.html"].includes(href)) {
            link.style.display = "none";
        }

        if (role === "SubAdmin" && href === "users.html") {
            link.style.display = "none";
        }

    });

    // Hide add/edit/delete buttons for view-only roles
    if (role === "SubAdmin" || role === "ReportViewer" || role === "Reader") {

        document.querySelectorAll(
            ".primary-action, .edit-btn, .delete-btn, #addAssetButton, #addUserButton, #exportButton"
        ).forEach(el => {
            if (el) el.style.display = "none";
        });

    }

});