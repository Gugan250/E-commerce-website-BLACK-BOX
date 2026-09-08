const signupForm =
    document.getElementById("signup-form");

const nameInput =
    document.getElementById("name");

const emailInput =
    document.getElementById("email");

const passwordInput =
    document.getElementById("password");

const confirmPasswordInput =
    document.getElementById("confirm-password");

const errorMessage =
    document.getElementById("signup-error");

const showPassword =
    document.getElementById("show-password");

showPassword.addEventListener("click", function () {

    if (passwordInput.type === "password") {

        passwordInput.type = "text";
        confirmPasswordInput.type = "text";

        showPassword.innerHTML =
            '<i class="fa-solid fa-eye-slash"></i>';

    } else {

        passwordInput.type = "password";
        confirmPasswordInput.type = "password";

        showPassword.innerHTML =
            '<i class="fa-solid fa-eye"></i>';
    }

});

signupForm.addEventListener("submit", function (event) {

    event.preventDefault();


    const name =
        nameInput.value.trim();

    const email =
        emailInput.value.trim().toLowerCase();

    const password =
        passwordInput.value;

    const confirmPassword =
        confirmPasswordInput.value;

    const gmailPattern =
        /^[a-zA-Z0-9._%+-]+@gmail\.com$/;


    if (!gmailPattern.test(email)) {

        showError(
            "Please enter a valid Gmail address."
        );

        return;
    }

    if (password.length < 6) {

        showError(
            "Password must be at least 6 characters."
        );

        return;
    }

    if (password !== confirmPassword) {

        showError(
            "Passwords do not match."
        );

        return;
    }

    const existingUser =
        JSON.parse(
            localStorage.getItem("user")
        );


    if (existingUser) {

        if (existingUser.email === email) {

            showError(
                "This Gmail is already registered."
            );

            return;
        }
    }

    const user = {

        name: name,

        email: email,

        password: password

    };


    localStorage.setItem(
        "user",
        JSON.stringify(user)
    );


    alert("Account created successfully!");

    window.location.href =
        "Login.html";

});

function showError(message) {

    errorMessage.textContent =
        message;

    errorMessage.style.display =
        "block";
}