const sliders = document.querySelectorAll(".image-slider");

sliders.forEach((slider) => {

    const images = slider.querySelectorAll(".product-image");
    const prevBtn = slider.querySelector(".prev");
    const nextBtn = slider.querySelector(".next");

    let currentIndex = 0;

    function showImage(index) {

        images.forEach((image) => {
            image.classList.remove("active");
        });

        images[index].classList.add("active");
    }

    nextBtn.addEventListener("click", () => {

        currentIndex++;

        if (currentIndex >= images.length) {
            currentIndex = 0;
        }

        showImage(currentIndex);
    });

    prevBtn.addEventListener("click", () => {

        currentIndex--;

        if (currentIndex < 0) {
            currentIndex = images.length - 1;
        }

        showImage(currentIndex);
    });

});

let wishlist =
    JSON.parse(localStorage.getItem("wishlist")) || [];

const favoriteButtons =
    document.querySelectorAll(".favorite-btn");

favoriteButtons.forEach(function (button) {

    const card = button.closest(".product-card");

    const icon = button.querySelector("i");

    const name =
        card.querySelector("h3").textContent.trim();

    
    const alreadySaved =
        wishlist.some(product => product.name === name);

    if (alreadySaved) {
        button.classList.add("active");

        icon.classList.remove("fa-regular");
        icon.classList.add("fa-solid");
    }

    button.addEventListener("click", function () {

        const description =
            card.querySelector("p").textContent.trim();

        const image =
            card.querySelector(".product-image").src;

        const price =
            card.querySelector(".product-price").textContent
                .replace("₹", "")
                .replace(",", "")
                .trim();

        const existingProduct =
            wishlist.find(product => product.name === name);

        if (existingProduct) {

            wishlist = wishlist.filter(
                product => product.name !== name
            );

            button.classList.remove("active");

            icon.classList.remove("fa-solid");
            icon.classList.add("fa-regular");

        } else {

            wishlist.push({
                name: name,
                description: description,
                image: image,
                price: Number(price)
            });

            button.classList.add("active");

            icon.classList.remove("fa-regular");
            icon.classList.add("fa-solid");
        }

        localStorage.setItem(
            "wishlist",
            JSON.stringify(wishlist)
        );

        console.log("Wishlist:", wishlist);
    });
});

const imageModal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");
const modalClose = document.getElementById("modalClose");
const modalPrev = document.getElementById("modalPrev");
const modalNext = document.getElementById("modalNext");
const modalContainer =
    document.getElementById("modalImageContainer");


let modalImages = [];
let modalIndex = 0;

document.querySelectorAll(".image-slider").forEach((slider) => {

    const images =
        slider.querySelectorAll(".product-image");

    images.forEach((image, index) => {

        image.addEventListener("click", function (event) {

            if (
                event.target.closest(".prev") ||
                event.target.closest(".next")
            ) {
                return;
            }

            modalImages =
                Array.from(images).map(img => img.src);

            const activeImage =
                slider.querySelector(".product-image.active");

            modalIndex =
                Array.from(images).indexOf(activeImage);

            if (modalIndex < 0) {
                modalIndex = index;
            }

            openImageViewer();

        });

    });

});

function openImageViewer() {

    modalImage.src =
        modalImages[modalIndex];

    imageModal.classList.add("active");

    document.body.style.overflow = "hidden";

    resetZoom();

}

function closeImageViewer() {

    imageModal.classList.remove("active");

    document.body.style.overflow = "";

    resetZoom();

}

modalClose.addEventListener(
    "click",
    closeImageViewer
);

modalNext.addEventListener("click", function () {

    modalIndex++;

    if (modalIndex >= modalImages.length) {
        modalIndex = 0;
    }

    modalImage.src =
        modalImages[modalIndex];

    resetZoom();

});

modalPrev.addEventListener("click", function () {

    modalIndex--;

    if (modalIndex < 0) {
        modalIndex = modalImages.length - 1;
    }

    modalImage.src =
        modalImages[modalIndex];

    resetZoom();

});

imageModal.addEventListener("click", function (event) {

    if (event.target === imageModal) {
        closeImageViewer();
    }

});

document.addEventListener("keydown", function (event) {

    if (!imageModal.classList.contains("active")) {
        return;
    }

    if (event.key === "Escape") {
        closeImageViewer();
    }

    if (event.key === "ArrowRight") {

        modalNext.click();

    }

    if (event.key === "ArrowLeft") {

        modalPrev.click();

    }

});

modalContainer.addEventListener(
    "mousemove",
    function (event) {

        if (window.innerWidth <= 600) {
            return;
        }

        const rect =
            modalContainer.getBoundingClientRect();

        const x =
            ((event.clientX - rect.left) / rect.width) * 100;

        const y =
            ((event.clientY - rect.top) / rect.height) * 100;

        modalImage.style.transformOrigin =
            `${x}% ${y}%`;

        modalImage.style.transform =
            "scale(2.2)";

        modalContainer.classList.add("zooming");

    }
);

modalContainer.addEventListener(
    "mouseleave",
    function () {

        resetZoom();

    }
);

function resetZoom() {

    modalImage.style.transform =
        "scale(1)";

    modalImage.style.transformOrigin =
        "center center";

    modalContainer.classList.remove(
        "zooming"
    );

}