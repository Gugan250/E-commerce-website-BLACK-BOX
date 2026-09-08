const loginForm =
    document.getElementById("login-form");

const emailInput =
    document.getElementById("email");

const passwordInput =
    document.getElementById("password");

const errorMessage =
    document.getElementById("login-error");

const showPassword =
    document.getElementById("show-password");

showPassword.addEventListener("click", function () {

    if (passwordInput.type === "password") {

        passwordInput.type = "text";

        showPassword.innerHTML =
            '<i class="fa-solid fa-eye-slash"></i>';

    } else {

        passwordInput.type = "password";

        showPassword.innerHTML =
            '<i class="fa-solid fa-eye"></i>';

    }

});

loginForm.addEventListener("submit", function (event) {

    event.preventDefault();


    const email =
        emailInput.value.trim().toLowerCase();

    const password =
        passwordInput.value;


    const gmailPattern =
        /^[a-zA-Z0-9._%+-]+@gmail\.com$/;


    if (!gmailPattern.test(email)) {

        showError(
            "Please enter a valid Gmail address."
        );

        return;
    }

    const user =
        JSON.parse(
            localStorage.getItem("user")
        );

    if (!user) {

        showError(
            "Account not found. Please create an account."
        );

        return;
    }

    if (
        email !== user.email ||
        password !== user.password
    ) {

        showError(
            "Incorrect Gmail or Password."
        );

        return;
    }

    localStorage.setItem(
        "loggedIn",
        "true"
    );


    alert("Login successful!");


    window.location.href =
        "index.html";

});

function showError(message) {

    errorMessage.textContent =
        message;

    errorMessage.style.display =
        "block";

}