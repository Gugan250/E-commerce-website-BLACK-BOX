document.querySelectorAll(".image-slider").forEach(slider => {

    const images = slider.querySelectorAll(".product-image");
    const prevBtn = slider.querySelector(".prev");
    const nextBtn = slider.querySelector(".next");

    let currentIndex = 0;

    function showImage(index) {

        images.forEach(image => {
            image.classList.remove("active");
        });

        if (images[index]) {
            images[index].classList.add("active");
        }
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

let wishlist =
    JSON.parse(localStorage.getItem("wishlist")) || [];


function updateWishlistButtons() {

    document.querySelectorAll(".favorite-btn").forEach(button => {

        const card =
            button.closest(".product-card");

        if (!card) return;

        const productName =
            card.dataset.name;


        if (wishlist.includes(productName)) {

            button.classList.add("active");

            button.innerHTML =
                '<i class="fa-solid fa-heart"></i>';

        } else {

            button.classList.remove("active");

            button.innerHTML =
                '<i class="fa-regular fa-heart"></i>';

        }

    });

}


document.querySelectorAll(".favorite-btn").forEach(button => {

    button.addEventListener("click", function (e) {

        e.stopPropagation();

        const card =
            this.closest(".product-card");

        if (!card) return;

        const productName =
            card.dataset.name;


        if (wishlist.includes(productName)) {

            wishlist =
                wishlist.filter(
                    item => item !== productName
                );

        } else {

            wishlist.push(productName);

        }


        localStorage.setItem(
            "wishlist",
            JSON.stringify(wishlist)
        );


        updateWishlistButtons();

    });

});

let cart =
    JSON.parse(localStorage.getItem("cart")) || [];

function updateCartCount() {

    const cartCount =
        document.getElementById("cart-count");

    if (!cartCount) return;

    cartCount.textContent = cart.length;

}

function getProductData(card) {

    const name =
        card.querySelector("h3")?.textContent.trim() || "";

    const description =
        card.querySelector("p")?.textContent.trim() || "";

    const priceElement =
        card.querySelector(".product-price");


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
        image ? image.getAttribute("src") : "";


    return {
        name: name,
        description: description,
        price: price,
        image: imageSrc
    };

}

function updateCartButtons() {

    document.querySelectorAll(".cart-btn").forEach(button => {

        const card =
            button.closest(".product-card");

        if (!card) return;


        const productName =
            card.querySelector("h3")?.textContent.trim();


        const existingProduct =
            cart.find(
                item => item.name === productName
            );


        if (existingProduct) {

            button.innerHTML =
                '<i class="fa-solid fa-cart-shopping"></i> Go to Cart';

            button.classList.add("added");

        } else {

            button.innerHTML =
                '<i class="fa-solid fa-cart-shopping"></i> Add to Cart';

            button.classList.remove("added");

        }

    });

}

document.querySelectorAll(".cart-btn").forEach(button => {

    button.addEventListener("click", function (e) {

        e.stopPropagation();


        const card =
            this.closest(".product-card");

        if (!card) return;


        const product =
            getProductData(card);


        const existingProduct =
            cart.find(
                item => item.name === product.name
            );

        if (existingProduct) {

            window.location.href = "cart.html";

            return;

        }

        cart.push(product);


        localStorage.setItem(
            "cart",
            JSON.stringify(cart)
        );

        this.innerHTML =
            '<i class="fa-solid fa-cart-shopping"></i> Go to Cart';

        this.classList.add("added");


        updateCartCount();

    });

});


updateCartCount();

updateCartButtons();

const modal =
    document.getElementById("imageModal");

const modalImage =
    document.getElementById("modalImage");

const modalClose =
    document.getElementById("modalClose");

const modalPrev =
    document.getElementById("modalPrev");

const modalNext =
    document.getElementById("modalNext");

const modalImageContainer =
    document.getElementById("modalImageContainer");


let currentModalImages = [];

let currentModalIndex = 0;

let zoomed = false;

document.querySelectorAll(".product-image").forEach(image => {

    image.addEventListener("click", function (e) {

        e.stopPropagation();


        if (!modal || !modalImage) return;


        const slider =
            this.closest(".image-slider");


        if (!slider) return;


        currentModalImages =
            Array.from(
                slider.querySelectorAll(".product-image")
            );


        currentModalIndex =
            currentModalImages.indexOf(this);


        if (currentModalIndex < 0) {
            currentModalIndex = 0;
        }


        showModalImage();


        modal.classList.add("active");


        zoomed = false;

        if (modalImageContainer) {
            modalImageContainer.classList.remove("zooming");
        }

    });

});

function showModalImage() {

    if (
        !modalImage ||
        currentModalImages.length === 0
    ) {
        return;
    }


    modalImage.src =
        currentModalImages[currentModalIndex].src;

}

if (modalPrev) {

    modalPrev.addEventListener("click", function (e) {

        e.stopPropagation();


        if (currentModalImages.length === 0) {
            return;
        }


        currentModalIndex--;


        if (currentModalIndex < 0) {

            currentModalIndex =
                currentModalImages.length - 1;

        }


        showModalImage();

    });

}

if (modalNext) {

    modalNext.addEventListener("click", function (e) {

        e.stopPropagation();


        if (currentModalImages.length === 0) {
            return;
        }


        currentModalIndex++;


        if (
            currentModalIndex >=
            currentModalImages.length
        ) {

            currentModalIndex = 0;

        }


        showModalImage();

    });

}

function closeImageModal() {

    if (!modal) return;

    modal.classList.remove("active");

    zoomed = false;


    if (modalImageContainer) {

        modalImageContainer.classList.remove(
            "zooming"
        );

    }

}


if (modalClose) {

    modalClose.addEventListener(
        "click",
        function (e) {

            e.stopPropagation();

            closeImageModal();

        }
    );

}

if (modal) {

    modal.addEventListener("click", function (e) {

        if (e.target === modal) {

            closeImageModal();

        }

    });

}

if (modalImageContainer) {

    modalImageContainer.addEventListener(
        "click",
        function (e) {

            e.stopPropagation();

            zoomed = !zoomed;


            if (zoomed) {

                modalImageContainer.classList.add(
                    "zooming"
                );

            } else {

                modalImageContainer.classList.remove(
                    "zooming"
                );

            }

        }
    );

}

document.addEventListener("keydown", function (e) {

    if (!modal ||
        !modal.classList.contains("active")) {
        return;
    }

    if (e.key === "Escape") {

        closeImageModal();

    }

    if (e.key === "ArrowLeft" && modalPrev) {

        modalPrev.click();

    }

    if (e.key === "ArrowRight" && modalNext) {

        modalNext.click();

    }

});

const searchInput =
    document.getElementById("searchInput");

const searchBtn =
    document.getElementById("searchBtn");

const suggestionsBox =
    document.getElementById("suggestions");

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

        productName: productName,

        description: description,

        dataName: dataName,

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

        suggestionsBox.style.display = "none";

    }

    if (searchText === "") {

        productCards.forEach(card => {

            card.style.display = "";

        });

        return;

    }


    const foundProducts = [];


    productCards.forEach(card => {

        const data =
            getSearchData(card);


        if (
            data.searchData.includes(searchText)
        ) {

            card.style.display = "";

            foundProducts.push({
                card: card,
                data: data
            });

        } else {

            card.style.display = "none";

        }

    });

    if (
        suggestionsBox &&
        foundProducts.length > 0
    ) {

        foundProducts
            .slice(0, 6)
            .forEach(item => {


                const suggestion =
                    document.createElement("div");


                suggestion.classList.add(
                    "suggestion-item"
                );


                suggestion.innerHTML = `

                    <span class="suggestion-icon">
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </span>

                    <div>

                        <strong>
                            ${item.data.productName}
                        </strong>

                        <br>

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

                        suggestionsBox.style.display =
                            "none";


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

        suggestionsBox.style.display = "block";

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

            suggestionsBox.style.display =
                "none";

        }

    }
);

const highlightStyle =
    document.createElement("style");


highlightStyle.textContent = `

    .search-highlight {

        outline: 3px solid #2874f0;

        transform: translateY(-5px);

        transition:
            transform 0.3s ease,
            outline 0.3s ease;

    }

`;


document.head.appendChild(
    highlightStyle
);

updateWishlistButtons();

updateCartButtons();

updateCartCount();
