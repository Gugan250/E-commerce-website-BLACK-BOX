const logoutBtn =
    document.getElementById("logout-btn");


logoutBtn.addEventListener("click", function () {

    const confirmLogout =
        confirm("Are you sure you want to logout?");


    if (confirmLogout) {

        localStorage.removeItem("user");

        alert("Logged out successfully!");

        window.location.href = "index.html";

    }

});
