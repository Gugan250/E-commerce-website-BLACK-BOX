let wishlist =
    JSON.parse(localStorage.getItem("wishlist")) || [];

let cart =
    JSON.parse(localStorage.getItem("cart")) || [];

const wishlistItems =
    document.getElementById("wishlist-items");

const emptyWishlist =
    document.getElementById("empty-wishlist");


function displayWishlist() {

    wishlistItems.innerHTML = "";

    if (wishlist.length === 0) {

        emptyWishlist.style.display = "block";
        wishlistItems.style.display = "none";

        return;
    }

    emptyWishlist.style.display = "none";
    wishlistItems.style.display = "grid";


    wishlist.forEach(function (product, index) {

        const card = document.createElement("div");

        card.classList.add("wishlist-card");

        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">

            <div class="wishlist-info">

                <h3>${product.name}</h3>

                <p>${product.description}</p>

                <span class="wishlist-price">
                    ₹${product.price}
                </span>

                <div class="wishlist-actions">

                    <button
                        class="remove-wishlist"
                        data-index="${index}">
                        <i class="fa-solid fa-heart"></i>
                    </button>

                    <button
                        class="wishlist-cart"
                        data-index="${index}">
                        <i class="fa-solid fa-cart-shopping"></i>
                        Add to Cart
                    </button>

                </div>

            </div>
        `;

        wishlistItems.appendChild(card);
    });
}

wishlistItems.addEventListener("click", function (event) {

    const button =
        event.target.closest("button");

    if (!button) return;

    const index =
        Number(button.dataset.index);

    if (button.classList.contains("remove-wishlist")) {

        wishlist.splice(index, 1);

        localStorage.setItem(
            "wishlist",
            JSON.stringify(wishlist)
        );

        displayWishlist();

        return;
    }

    if (button.classList.contains("wishlist-cart")) {

        const product = wishlist[index];

        const existingProduct =
            cart.find(
                item => item.name === product.name
            );


        if (existingProduct) {

            existingProduct.quantity++;

        } else {
            cart.push({

                name: product.name,

                description: product.description,

                image: product.image,

                price: product.price,

                quantity: 1

            });
        }

        localStorage.setItem(
            "cart",
            JSON.stringify(cart)
        );

        button.innerHTML =
            '<i class="fa-solid fa-check"></i> Added';


        button.classList.add("added");


        console.log("Cart:", cart);
    }

});

displayWishlist();