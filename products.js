
"use strict";

// ========================================
// BLACK BOX - PRODUCTS.JS
// ========================================

// 1. PRODUCT IMAGE SLIDER
document.querySelectorAll(".image-slider").forEach(slider => {
    const images = [...slider.querySelectorAll(".product-image")];
    const prevBtn = slider.querySelector(".prev");
    const nextBtn = slider.querySelector(".next");

    let currentIndex = images.findIndex(image =>
        image.classList.contains("active")
    );

    if (currentIndex < 0) currentIndex = 0;

    function showImage(index) {
        if (!images.length) return;

        currentIndex = (index + images.length) % images.length;

        images.forEach((image, i) => {
            image.classList.toggle("active", i === currentIndex);
        });
    }

    if (images.length) showImage(currentIndex);

    nextBtn?.addEventListener("click", event => {
        event.stopPropagation();
        showImage(currentIndex + 1);
    });

    prevBtn?.addEventListener("click", event => {
        event.stopPropagation();
        showImage(currentIndex - 1);
    });
});

// 2. LOCAL STORAGE HELPERS
function readStorage(key) {
    try {
        const data = JSON.parse(localStorage.getItem(key));
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.warn("Unable to read " + key, error);
        return [];
    }
}

let wishlist = readStorage("wishlist");
let cart = readStorage("cart");

// 3. GET PRODUCT DETAILS
function getProductData(card) {
    const name =
        card.querySelector("h3")?.textContent.trim() ||
        card.dataset.name ||
        "";

    const description =
        card.querySelector("p")?.textContent.trim() || "";

    const priceElement =
        card.querySelector(".product-price") ||
        card.querySelector(".price");

    const priceText = priceElement?.textContent || "";
    const price = Number(priceText.replace(/[^\d.]/g, "")) || 0;

    const image =
        card.querySelector(".product-image.active") ||
        card.querySelector(".product-image") ||
        card.querySelector("img");

    const imageSrc = image?.getAttribute("src") || "";

    return {
        name,
        description,
        price,
        image: imageSrc
    };
}

// 4. FIX OLD WISHLIST FORMAT
function normalizeWishlist() {
    wishlist = wishlist
        .map(item => {
            if (typeof item === "string") {
                return {
                    name: item,
                    description: "",
                    price: 0,
                    image: ""
                };
            }

            if (!item || typeof item !== "object") {
                return null;
            }

            return {
                ...item,
                name: item.name || item.title || "",
                description: item.description || "",
                price: Number(item.price) || 0,
                image: item.image || item.imageUrl || ""
            };
        })
        .filter(item => item && item.name);

    // Fill in details for products available on this page.
    document.querySelectorAll(".product-card").forEach(card => {
        const product = getProductData(card);

        const index = wishlist.findIndex(item =>
            item.name === product.name
        );

        if (index !== -1) {
            const oldItem = wishlist[index];

            wishlist[index] = {
                ...product,
                ...oldItem,
                name: product.name,
                description: oldItem.description || product.description,
                price: Number(oldItem.price) || product.price,
                image: oldItem.image || product.image
            };
        }
    });

    localStorage.setItem("wishlist", JSON.stringify(wishlist));
}

normalizeWishlist();

// 5. UPDATE WISHLIST BUTTONS
function updateWishlistButtons() {
    document.querySelectorAll(".favorite-btn").forEach(button => {
        const card = button.closest(".product-card");
        if (!card) return;

        const product = getProductData(card);

        const isWishlisted = wishlist.some(item =>
            item && item.name === product.name
        );

        button.classList.toggle("active", isWishlisted);
        button.setAttribute("aria-pressed", String(isWishlisted));

        button.innerHTML = isWishlisted
            ? '<i class="fa-solid fa-heart"></i>'
            : '<i class="fa-regular fa-heart"></i>';
    });
}

// 6. ADD / REMOVE WISHLIST ITEMS
document.querySelectorAll(".favorite-btn").forEach(button => {
    button.addEventListener("click", function(event) {
        event.stopPropagation();

        const card = this.closest(".product-card");
        if (!card) return;

        const product = getProductData(card);
        if (!product.name) return;

        const index = wishlist.findIndex(item =>
            item && item.name === product.name
        );

        if (index >= 0) {
            wishlist.splice(index, 1);
        } else {
            wishlist.push(product);
        }

        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        updateWishlistButtons();
    });
});

// 7. UPDATE CART COUNT
function updateCartCount() {
    const countElement = document.getElementById("cart-count");
    if (!countElement) return;

    const total = cart.reduce((sum, item) => {
        return sum + Math.max(1, Number(item?.quantity) || 1);
    }, 0);

    countElement.textContent = total;
}

// 8. UPDATE CART BUTTONS
function updateCartButtons() {
    document.querySelectorAll(".cart-btn").forEach(button => {
        const card = button.closest(".product-card");
        if (!card) return;

        const product = getProductData(card);
        const exists = cart.some(item =>
            item && item.name === product.name
        );

        button.classList.toggle("added", exists);

        button.innerHTML = exists
            ? '<i class="fa-solid fa-cart-shopping"></i> Go to Cart'
            : '<i class="fa-solid fa-cart-shopping"></i> Add to Cart';
    });
}

// 9. ADD TO CART / GO TO CART
document.querySelectorAll(".cart-btn").forEach(button => {
    button.addEventListener("click", function(event) {
        event.stopPropagation();

        const card = this.closest(".product-card");
        if (!card) return;

        const product = getProductData(card);
        if (!product.name) return;

        const existing = cart.find(item =>
            item && item.name === product.name
        );

        if (existing) {
            window.location.href = "cart.html";
            return;
        }

        cart.push({
            ...product,
            quantity: 1
        });

        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();
        updateCartButtons();
    });
});

// INITIAL CART AND WISHLIST DISPLAY
updateWishlistButtons();
updateCartButtons();
updateCartCount();


// 10. PRODUCT IMAGE ZOOM MODAL
const modal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");
const modalClose = document.getElementById("modalClose");
const modalPrev = document.getElementById("modalPrev");
const modalNext = document.getElementById("modalNext");
const modalImageContainer =
    document.getElementById("modalImageContainer");

let modalImages = [];
let modalIndex = 0;
let isZoomed = false;

document.querySelectorAll(".product-image").forEach(image => {
    image.addEventListener("click", function(event) {
        event.stopPropagation();

        if (!modal || !modalImage) return;

        const slider = this.closest(".image-slider");

        modalImages = slider
            ? [...slider.querySelectorAll(".product-image")]
            : [this];

        modalIndex = Math.max(0, modalImages.indexOf(this));

        showModalImage();
        modal.classList.add("active");

        isZoomed = false;
        modalImageContainer?.classList.remove("zooming");
    });
});

function showModalImage() {
    if (!modalImage || !modalImages.length) return;

    modalImage.src = modalImages[modalIndex].src;
    modalImage.alt = modalImages[modalIndex].alt || "Product image";
}

function closeImageModal() {
    modal?.classList.remove("active");
    isZoomed = false;
    modalImageContainer?.classList.remove("zooming");
}

modalClose?.addEventListener("click", event => {
    event.stopPropagation();
    closeImageModal();
});

modalPrev?.addEventListener("click", event => {
    event.stopPropagation();
    if (!modalImages.length) return;

    modalIndex = (modalIndex - 1 + modalImages.length) % modalImages.length;
    showModalImage();
});

modalNext?.addEventListener("click", event => {
    event.stopPropagation();
    if (!modalImages.length) return;

    modalIndex = (modalIndex + 1) % modalImages.length;
    showModalImage();
});

modal?.addEventListener("click", event => {
    if (event.target === modal) closeImageModal();
});

modalImageContainer?.addEventListener("click", event => {
    event.stopPropagation();

    isZoomed = !isZoomed;
    modalImageContainer.classList.toggle("zooming", isZoomed);
});

document.addEventListener("keydown", event => {
    if (!modal?.classList.contains("active")) return;

    if (event.key === "Escape") closeImageModal();
    if (event.key === "ArrowLeft") modalPrev?.click();
    if (event.key === "ArrowRight") modalNext?.click();
});

// 11. PRODUCT SEARCH AND SUGGESTIONS
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const suggestionsBox = document.getElementById("suggestions");

const productCards = [
    ...document.querySelectorAll(".product-card")
];

function getSearchData(card) {
    const productName =
        card.querySelector("h3")?.textContent.trim() || "";

    const description =
        card.querySelector("p")?.textContent.trim() || "";

    const dataName = card.dataset.name || "";

    return {
        productName,
        description,
        searchData: `${productName} ${description} ${dataName}`.toLowerCase()
    };
}

function searchProducts() {
    if (!searchInput) return;

    const searchText = searchInput.value.trim().toLowerCase();

    if (suggestionsBox) {
        suggestionsBox.innerHTML = "";
        suggestionsBox.style.display = "none";
    }

    if (!searchText) {
        productCards.forEach(card => {
            card.style.display = "";
        });
        return;
    }

    const foundProducts = [];

    productCards.forEach(card => {
        const data = getSearchData(card);

        if (data.searchData.includes(searchText)) {
            card.style.display = "";
            foundProducts.push({ card, data });
        } else {
            card.style.display = "none";
        }
    });

    if (!suggestionsBox || !foundProducts.length) return;

    foundProducts.slice(0, 6).forEach(item => {
        const suggestion = document.createElement("div");
        suggestion.classList.add("suggestion-item");

        const icon = document.createElement("span");
        icon.className = "suggestion-icon";
        icon.innerHTML =
            '<i class="fa-solid fa-magnifying-glass"></i>';

        const details = document.createElement("div");

        const name = document.createElement("strong");
        name.textContent = item.data.productName;

        const description = document.createElement("small");
        description.textContent = item.data.description;

        details.append(
            name,
            document.createElement("br"),
            description
        );

        suggestion.append(icon, details);

        suggestion.addEventListener("click", () => {
            searchInput.value = item.data.productName;

            suggestionsBox.innerHTML = "";
            suggestionsBox.style.display = "none";

            // Show only the selected matching product.
            productCards.forEach(card => {
                card.style.display = card === item.card ? "" : "none";
            });

            item.card.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

            item.card.classList.add("search-highlight");

            window.setTimeout(() => {
                item.card.classList.remove("search-highlight");
            }, 1500);
        });

        suggestionsBox.appendChild(suggestion);
    });

    suggestionsBox.style.display = "block";
}

if (searchInput) {
    searchInput.addEventListener("input", searchProducts);

    searchInput.addEventListener("keydown", event => {
        if (event.key !== "Enter") return;

        event.preventDefault();
        searchProducts();
    });
}

searchBtn?.addEventListener("click", searchProducts);

document.addEventListener("click", event => {
    if (
        suggestionsBox &&
        searchInput &&
        !searchInput.contains(event.target) &&
        !suggestionsBox.contains(event.target)
    ) {
        suggestionsBox.innerHTML = "";
        suggestionsBox.style.display = "none";
    }
});

// 12. SEARCH HIGHLIGHT STYLE
const highlightStyle = document.createElement("style");

highlightStyle.textContent = `
    .search-highlight {
        outline: 3px solid #2874f0;
        transform: translateY(-5px);
        transition: transform 0.3s ease, outline 0.3s ease;
    }
`;

document.head.appendChild(highlightStyle);

// END OF BLACK BOX PRODUCTS.JS
