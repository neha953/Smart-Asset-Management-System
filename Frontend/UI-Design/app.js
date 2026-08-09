const app = document.getElementById("app");

app.innerHTML = `
<div class="login-page">

    <section class="brand-panel">

        <div class="brand">
            <div class="brand-icon">A</div>

            <div>
                <div class="brand-name">AEGIS ASSETOPS</div>
                <div class="brand-subtitle">ENTERPRISE ASSET INTELLIGENCE</div>
            </div>
        </div>

        <div class="brand-content">

            <div class="eyebrow">
                IT ASSET OPERATIONS PLATFORM
            </div>

            <h1>
                Control every asset.
                <span>From one command center.</span>
            </h1>

            <p>
                A centralized platform for tracking, assigning,
                maintaining and governing enterprise IT assets.
            </p>

            <div class="feature-list">

                <div class="feature">
                    <div class="check">✓</div>
                    <div>
                        <strong>Asset Intelligence</strong>
                        <small>Real-time asset visibility and tracking</small>
                    </div>
                </div>

                <div class="feature">
                    <div class="check">✓</div>
                    <div>
                        <strong>Lifecycle Management</strong>
                        <small>Assignments, maintenance and warranties</small>
                    </div>
                </div>

                <div class="feature">
                    <div class="check">✓</div>
                    <div>
                        <strong>Enterprise Security</strong>
                        <small>Role-based access and audit monitoring</small>
                    </div>
                </div>

            </div>

        </div>

    </section>


    <section class="login-panel">

        <div class="login-container">

            <div class="secure-label">
                SECURE ACCESS
            </div>

            <h2>Welcome back</h2>

            <p class="login-description">
                Sign in to access your asset operations command center.
            </p>

            <form id="loginForm">

                <label for="email">WORK EMAIL</label>

                <input
                    type="email"
                    id="email"
                    placeholder="admin@smartasset.com"
                    value="admin@smartasset.com"
                    required
                >

                <div class="password-label">
                    <label for="password">PASSWORD</label>

                    <a href="#" id="forgotPassword">
                        Forgot password?
                    </a>
                </div>

                <input
                    type="password"
                    id="password"
                    placeholder="Enter your password"
                    required
                >

                <div class="remember-row">

                    <label class="remember">
                        <input type="checkbox" id="rememberMe">
                        <span>Keep me signed in</span>
                    </label>

                </div>

                <button type="submit" id="loginButton">
                    <span>Access Command Center</span>
                    <span class="arrow">→</span>
                </button>

                <div id="loginMessage"></div>

            </form>


            <div class="security-card">

                <div class="security-icon">
                    ✓
                </div>

                <div>
                    <strong>Protected access</strong>
                    <small>
                        Your session is secured using authenticated access controls.
                    </small>
                </div>

            </div>

        </div>

    </section>

</div>
`;


/* =========================
   LOGIN
========================= */

const loginForm = document.getElementById("loginForm");
const loginButton = document.getElementById("loginButton");
const loginMessage = document.getElementById("loginMessage");

loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
        showMessage("Please enter your email and password.", "error");
        return;
    }

    loginButton.disabled = true;
    loginButton.innerHTML = `
        <span>Authenticating...</span>
        <span>...</span>
    `;

    try {

        const response = await fetch(
            "http://localhost:5000/api/auth/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }
        );

        const data = await response.json();

        if (response.ok && data.success) {

            if (data.token) {
                localStorage.setItem("token", data.token);
            }

            if (data.user) {
                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );
            }

            showMessage(
                "Login successful. Redirecting...",
                "success"
            );

            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 800);

        } else {

            showMessage(
                data.message || "Login failed.",
                "error"
            );

            resetLoginButton();
        }

    } catch (error) {

        console.error("Login Error:", error);

        showMessage(
            "Unable to connect to the server.",
            "error"
        );

        resetLoginButton();
    }

});


/* =========================
   MESSAGE
========================= */

function showMessage(message, type) {

    loginMessage.textContent = message;

    loginMessage.className = "";

    loginMessage.classList.add(type);
}


/* =========================
   RESET BUTTON
========================= */

function resetLoginButton() {

    loginButton.disabled = false;

    loginButton.innerHTML = `
        <span>Access Command Center</span>
        <span class="arrow">→</span>
    `;
}


/* =========================
   FORGOT PASSWORD
========================= */

document
    .getElementById("forgotPassword")
    .addEventListener("click", function (event) {

        event.preventDefault();

        showMessage(
            "Please contact your system administrator to reset your password.",
            "info"
        );

    });