document.addEventListener("DOMContentLoaded", function () {

    const themeToggle = document.getElementById("themeToggle");

    if (localStorage.getItem("darkMode") === "true") {
        document.body.classList.add("dark-mode");
        if (themeToggle) themeToggle.textContent = "☀️";
    }

    if (themeToggle) {

        themeToggle.addEventListener("click", function () {

            document.body.classList.toggle("dark-mode");

            const isDark = document.body.classList.contains("dark-mode");

            localStorage.setItem("darkMode", isDark);

            themeToggle.textContent = isDark ? "☀️" : "🌙";

        });

    }

});