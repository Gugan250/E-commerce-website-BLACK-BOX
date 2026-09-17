document.querySelectorAll(".image-slider").forEach(slider => {

    const images = slider.querySelectorAll(".product-image");
    const prevBtn = slider.querySelector(".prev");
    const nextBtn = slider.querySelector(".next");

    let currentIndex = 0;

    function showImage(index) {

        images.forEach(image => {
            image.classList.remove("active");
        });

        images[index].classList.add("active");
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", function (e) {

            e.stopPropagation();

            currentIndex++;

            if (currentIndex >= images.length) {
                currentIndex = 0;
            }

            showImage(currentIndex);
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", function (e) {

            e.stopPropagation();

            currentIndex--;

            if (currentIndex < 0) {
                currentIndex = images.length - 1;
            }

            showImage(currentIndex);
        });
    }

});

let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

function updateWishlistButtons() {

    document.querySelectorAll(".favorite-btn").forEach(button => {

        const card = button.closest(".product-card");

        if (!card) return;

        const productName = card.dataset.name;

        if (wishlist.includes(productName)) {

            button.classList.add("active");

            button.innerHTML = "❤️";

        } else {

            button.classList.remove("active");

            button.innerHTML = "♡";

        }

    });

}

document.querySelectorAll(".favorite-btn").forEach(button => {

    button.addEventListener("click", function (e) {

        e.stopPropagation();

        const card = this.closest(".product-card");

        if (!card) return;

        const productName = card.dataset.name;

        if (wishlist.includes(productName)) {

            wishlist = wishlist.filter(item => item !== productName);

            this.classList.remove("active");

            this.innerHTML = "♡";

        } else {

            wishlist.push(productName);

            this.classList.add("active");

            this.innerHTML = "❤️";

        }

        localStorage.setItem(
            "wishlist",
            JSON.stringify(wishlist)
        );

    });

});


updateWishlistButtons();

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function updateCartCount() {

    const cartCount = document.getElementById("cart-count");

    if (!cartCount) return;

    cartCount.textContent = cart.length;

}

function getProductData(card) {

    const name =
        card.querySelector("h3")?.textContent.trim() || "";

    const description =
        card.querySelector("p")?.textContent.trim() || "";

    const priceElement =
        card.querySelector(".price");

    let price = 0;

    if (priceElement) {

        price =
            parseInt(
                priceElement.textContent
                    .replace(/[₹,]/g, "")
            ) || 0;

    }

    const image =
        card.querySelector(".product-image.active") ||
        card.querySelector(".product-image");

    const imageSrc =
        image ? image.src : "";

    return {
        name,
        description,
        price,
        image: imageSrc
    };

}

function updateCartButtons() {

    document.querySelectorAll(".add-cart-btn").forEach(button => {

        const card = button.closest(".product-card");

        if (!card) return;

        const productName =
            card.querySelector("h3")?.textContent.trim();

        const existingProduct =
            cart.find(item => item.name === productName);

        if (existingProduct) {

            button.textContent = "Go to Cart";

            button.classList.add("go-to-cart");

        } else {

            button.textContent = "Add to Cart";

            button.classList.remove("go-to-cart");

        }

    });

}

document.querySelectorAll(".add-cart-btn").forEach(button => {

    button.addEventListener("click", function (e) {

        e.stopPropagation();

        const card =
            this.closest(".product-card");

        if (!card) return;

        const product =
            getProductData(card);

        const existingProduct =
            cart.find(item => item.name === product.name);

        if (existingProduct) {

            window.location.href = "cart.html";

            return;

        }
        
        cart.push(product);

        localStorage.setItem(
            "cart",
            JSON.stringify(cart)
        );

        this.textContent = "Go to Cart";

        this.classList.add("go-to-cart");


        updateCartCount();

    });

});


updateCartCount();

updateCartButtons();

const modal =
    document.getElementById("imageModal");

const modalImage =
    document.getElementById("modalImage");

const closeModal =
    document.querySelector(".close-modal");

document.querySelectorAll(".product-image").forEach(image => {

    image.addEventListener("click", function () {

        if (!modal || !modalImage) return;

        modal.style.display = "flex";

        modalImage.src = this.src;

        modalImage.style.transform =
            "scale(1)";

    });

});

if (closeModal) {

    closeModal.addEventListener("click", function () {

        modal.style.display = "none";

    });

}

if (modal) {

    modal.addEventListener("click", function (e) {

        if (e.target === modal) {

            modal.style.display = "none";

        }

    });

}

let zoomLevel = 1;

if (modalImage) {

    modalImage.addEventListener("wheel", function (e) {

        e.preventDefault();

        if (e.deltaY < 0) {

            zoomLevel += 0.1;

        } else {

            zoomLevel -= 0.1;

        }

        if (zoomLevel < 1) {

            zoomLevel = 1;

        }

        if (zoomLevel > 3) {

            zoomLevel = 3;

        }

        this.style.transform =
            `scale(${zoomLevel})`;

    });

}

document.querySelectorAll(".product-image").forEach(image => {

    image.addEventListener("click", function () {

        zoomLevel = 1;

    });

});

const searchInput =
    document.getElementById("searchInput");

const suggestionsBox =
    document.getElementById("suggestions");

const searchBtn =
    document.getElementById("searchBtn");

const productCards =
    document.querySelectorAll(".product-card");

function getSearchData(card) {

    const productName =
        card.querySelector("h3")?.textContent
            .toLowerCase()
            .trim() || "";

    const description =
        card.querySelector("p")?.textContent
            .toLowerCase()
            .trim() || "";

    const dataName =
        card.dataset.name
            ?.toLowerCase()
            .trim() || "";

    return {
        productName,
        description,
        dataName,
        searchData:
            `${productName} ${description} ${dataName}`
                .toLowerCase()
    };

}

function searchProducts() {

    if (!searchInput) return;

    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();

    if (suggestionsBox) {

        suggestionsBox.innerHTML = "";

    }

    if (searchText === "") {

        productCards.forEach(card => {

            card.style.display = "";

        });

        return;

    }


    let foundProducts = [];


    productCards.forEach(card => {

        const data =
            getSearchData(card);

        if (data.searchData.includes(searchText)) {

            card.style.display = "";

            foundProducts.push({
                card,
                data
            });

        } else {

            card.style.display = "none";

        }

    });

    if (
        suggestionsBox &&
        foundProducts.length > 0
    ) {

        foundProducts.forEach(item => {

            const suggestion =
                document.createElement("div");

            suggestion.classList.add(
                "suggestion-item"
            );


            suggestion.innerHTML = `
                <span class="suggestion-icon">🔍</span>

                <div class="suggestion-content">

                    <strong>
                        ${item.data.productName}
                    </strong>

                    <small>
                        ${item.data.description}
                    </small>

                </div>
            `;

            suggestion.addEventListener(
                "click",
                function () {

                    searchInput.value =
                        item.data.productName;


                    suggestionsBox.innerHTML = "";

                    item.card.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });

                    item.card.classList.add(
                        "search-highlight"
                    );


                    setTimeout(() => {

                        item.card.classList.remove(
                            "search-highlight"
                        );

                    }, 1500);

                }
            );


            suggestionsBox.appendChild(
                suggestion
            );

        });

    }

}

if (searchInput) {

    searchInput.addEventListener(
        "input",
        searchProducts
    );

}

if (searchBtn) {

    searchBtn.addEventListener(
        "click",
        function () {

            searchProducts();

            if (!searchInput) return;

            const firstVisible =
                [...productCards].find(card => {

                    return card.style.display !== "none";

                });


            if (firstVisible) {

                firstVisible.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

            }

        }
    );

}

if (searchInput) {

    searchInput.addEventListener(
        "keydown",
        function (e) {

            if (e.key === "Enter") {

                e.preventDefault();

                searchProducts();


                const firstVisible =
                    [...productCards].find(card => {

                        return card.style.display !== "none";

                    });


                if (firstVisible) {

                    firstVisible.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });

                }

            }

        }
    );

}

document.addEventListener(
    "click",
    function (e) {

        if (
            suggestionsBox &&
            searchInput &&
            !searchInput.contains(e.target) &&
            !suggestionsBox.contains(e.target)
        ) {

            suggestionsBox.innerHTML = "";

        }

    }
);

const highlightStyle =
    document.createElement("style");

highlightStyle.textContent = `

    .search-highlight {
        outline: 3px solid #2874f0;
        transform: translateY(-5px);
        transition: 0.3s ease;
    }

`;

document.head.appendChild(highlightStyle);

updateCartCount();

updateCartButtons();

updateWishlistButtons();
