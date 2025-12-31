const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const loginBox = document.getElementById("loginBox");
const registerBox = document.getElementById("registerBox");

document.getElementById("showRegister").addEventListener("click", (e) => {
    e.preventDefault();
    loginBox.classList.add("hidden");
    registerBox.classList.remove("hidden");
});

document.getElementById("showLogin").addEventListener("click", (e) => {
    e.preventDefault();
    registerBox.classList.add("hidden");
    loginBox.classList.remove("hidden");
});

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const res = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });
    const data = await res.json();

    const msgEl = document.getElementById("loginMessage");
    msgEl.innerText = data.message;

    if (data.success) {
        msgEl.style.color = "green";
        localStorage.setItem("isLoggedIn", "true"); // Store login state
        setTimeout(() => window.location.href = "index.html", 1000);
    } else {
        msgEl.style.color = "red";
    }
});

registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("regEmail").value;
    const password = document.getElementById("regPassword").value;

    const res = await fetch("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });
    const data = await res.json();

    const msgEl = document.getElementById("regMessage");
    msgEl.innerText = data.message;

    if (data.success) {
        msgEl.style.color = "green";
        setTimeout(() => {
            registerBox.classList.add("hidden");
            loginBox.classList.remove("hidden");
        }, 1500);
    } else {
        msgEl.style.color = "red";
    }
});
