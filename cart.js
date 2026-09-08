let cart =
    JSON.parse(localStorage.getItem("cart")) || [];

const cartItemsContainer =
    document.getElementById("cart-items");

const emptyCart =
    document.getElementById("empty-cart");

const subtotalElement =
    document.getElementById("subtotal");

const deliveryElement =
    document.getElementById("delivery");

const totalElement =
    document.getElementById("total");

const checkoutBtn =
    document.getElementById("checkout-btn");

function displayCart() {

    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
        emptyCart.style.display = "block";
        
        const cartContainer = document.querySelector(".cart-container");
        if (cartContainer) {
            cartContainer.style.display = "none";
        }

        subtotalElement.textContent = "₹0";
        deliveryElement.textContent = "₹0";
        totalElement.textContent = "₹0";
        return;
    }

    emptyCart.style.display = "none";

    const cartContainer = document.querySelector(".cart-container");
    if (cartContainer) {
        cartContainer.style.display = "grid";
    }

    cart.forEach(function (product, index) {

        const cartItem =
            document.createElement("div");

        cartItem.classList.add("cart-item");

        cartItem.innerHTML = `

            <img
                src="${product.image}"
                alt="${product.name}"
                class="cart-item-image"
            >

            <div class="cart-item-details">

                <h3>${product.name}</h3>

                <p>${product.description}</p>

                <span class="cart-price">
                    ₹${product.price}
                </span>

            </div>

            <div class="quantity-box">

                <button
                    class="quantity-btn decrease"
                    data-index="${index}">
                    -
                </button>

                <span class="quantity">
                    ${product.quantity}
                </span>

                <button
                    class="quantity-btn increase"
                    data-index="${index}">
                    +
                </button>

            </div>

            <button
                class="remove-btn"
                data-index="${index}">

                <i class="fa-solid fa-trash"></i>

            </button>

        `;

        cartItemsContainer.appendChild(cartItem);

    });

    updateTotal();
}

function updateTotal() {

    let subtotal = 0;

    cart.forEach(function (product) {

        subtotal +=
            product.price * product.quantity;

    });

    let delivery = 0;

    if (subtotal > 0) {
        delivery = 50;
    }

    let total =
        subtotal + delivery;

    subtotalElement.textContent =
        "₹" + subtotal;

    deliveryElement.textContent =
        "₹" + delivery;

    totalElement.textContent =
        "₹" + total;
}

function saveCart() {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

}

cartItemsContainer.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest("button");

        if (!button) {
            return;
        }

        const index =
            Number(button.dataset.index);

        // Safety check to prevent out-of-bounds or NaN errors
        if (isNaN(index) || index < 0 || index >= cart.length) {
            return;
        }

        if (button.classList.contains("increase")) {

            cart[index].quantity++;

        }

        else if (button.classList.contains("decrease")) {

            cart[index].quantity--;

            if (cart[index].quantity <= 0) {

                cart.splice(index, 1);

            }

        }

        else if (button.classList.contains("remove-btn")) {

            cart.splice(index, 1);

        }

        saveCart();

        displayCart();

    }
);

if (checkoutBtn) {

    checkoutBtn.addEventListener(
        "click",
        function () {

            if (cart.length === 0) {

                alert("Your cart is empty!");

                return;
            }

            window.location.href =
                "checkout.html";

        }
    );

}

displayCart();
