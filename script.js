let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartButtons = document.querySelectorAll(".cart-btn");

cartButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const card = button.closest(".product-card");

        const name = card.querySelector("h3").textContent;
        const description = card.querySelector("p").textContent;
        const image = card.querySelector(".product-image").src;

        const existingProduct = cart.find(
            product => product.name === name
        );


        if (existingProduct) {

            cart = cart.filter(
                product => product.name !== name
            );

            button.classList.remove("added");

            button.innerHTML =
                '<i class="fa-solid fa-cart-shopping"></i> Add to Cart';

        } else {

    const price = card.querySelector(".product-price").textContent
        .replace("₹", "")
        .trim();

    cart.push({

        name: name,
        description: description,
        image: image,
        price: Number(price),
        quantity: 1

    });

    button.classList.add("added");

    button.innerHTML =
        '<i class="fa-solid fa-check"></i> Added';
}


        localStorage.setItem(
            "cart",
            JSON.stringify(cart)
        );

    });

});