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

        if (images[index]) {
            images[index].classList.add("active");
        }
    }

    if (nextBtn) {

        nextBtn.addEventListener("click", () => {

            currentIndex++;

            if (currentIndex >= images.length) {
                currentIndex = 0;
            }

            showImage(currentIndex);
        });
    }

    if (prevBtn) {

        prevBtn.addEventListener("click", () => {

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

const favoriteButtons =
    document.querySelectorAll(".favorite-btn");

favoriteButtons.forEach(function (button) {

    const card =
        button.closest(".product-card");

    const icon =
        button.querySelector("i");

    const name =
        card.querySelector("h3").textContent.trim();


    const alreadySaved =
        wishlist.some(product => product.name === name);


    if (alreadySaved) {

        button.classList.add("active");

        if (icon) {
            icon.classList.remove("fa-regular");
            icon.classList.add("fa-solid");
        }
    }


    button.addEventListener("click", function () {

        const description =
            card.querySelector("p").textContent.trim();

        const image =
            card.querySelector(".product-image").src;

        const price =
            card.querySelector(".product-price")
                .textContent
                .replace("₹", "")
                .replace(",", "")
                .trim();


        const existingProduct =
            wishlist.find(
                product => product.name === name
            );


        if (existingProduct) {

            wishlist =
                wishlist.filter(
                    product => product.name !== name
                );

            button.classList.remove("active");

            if (icon) {
                icon.classList.remove("fa-solid");
                icon.classList.add("fa-regular");
            }

        }

        else {

            wishlist.push({

                name: name,

                description: description,

                image: image,

                price: Number(price)

            });


            button.classList.add("active");

            if (icon) {
                icon.classList.remove("fa-regular");
                icon.classList.add("fa-solid");
            }
        }


        localStorage.setItem(
            "wishlist",
            JSON.stringify(wishlist)
        );

        console.log("Wishlist:", wishlist);

    });

});

let cart =
    JSON.parse(localStorage.getItem("cart")) || [];

const cartButtons =
    document.querySelectorAll(".cart-btn");


function updateCartButton(button, added) {

    if (added) {

        button.innerHTML =
            '<i class="fa-solid fa-cart-shopping"></i> Go to Cart';

        button.classList.add("go-to-cart");

    }

    else {

        button.innerHTML =
            '<i class="fa-solid fa-cart-shopping"></i> Add to Cart';

        button.classList.remove("go-to-cart");

    }

}


cartButtons.forEach(function (button) {

    const card =
        button.closest(".product-card");

    if (!card) {
        return;
    }

    const name =
        card.querySelector("h3").textContent.trim();


    const alreadyInCart =
        cart.some(
            product => product.name === name
        );


    if (alreadyInCart) {

        updateCartButton(button, true);

    }

    button.addEventListener("click", function () {

        const existingProduct =
            cart.find(
                product => product.name === name
            );

        if (existingProduct) {

            window.location.href = "cart.html";

            return;
        }

        const description =
            card.querySelector("p").textContent.trim();

        const image =
            card.querySelector(".product-image").src;

        const price =
            card.querySelector(".product-price")
                .textContent
                .replace("₹", "")
                .replace(",", "")
                .trim();

        cart.push({

            name: name,

            description: description,

            image: image,

            price: Number(price),

            quantity: 1

        });

        localStorage.setItem(
            "cart",
            JSON.stringify(cart)
        );

        updateCartButton(button, true);


        console.log("Cart:", cart);

    });

});

const imageModal =
    document.getElementById("imageModal");

const modalImage =
    document.getElementById("modalImage");

const modalClose =
    document.getElementById("modalClose");

const modalPrev =
    document.getElementById("modalPrev");

const modalNext =
    document.getElementById("modalNext");

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
                Array.from(images)
                    .map(img => img.src);


            const activeImage =
                slider.querySelector(
                    ".product-image.active"
                );


            modalIndex =
                Array.from(images)
                    .indexOf(activeImage);


            if (modalIndex < 0) {

                modalIndex = index;

            }


            openImageViewer();

        });

    });

});

function openImageViewer() {

    if (!imageModal || !modalImage) {
        return;
    }

    modalImage.src =
        modalImages[modalIndex];

    imageModal.classList.add("active");

    document.body.style.overflow =
        "hidden";

    resetZoom();

}

function closeImageViewer() {

    if (!imageModal) {
        return;
    }

    imageModal.classList.remove("active");

    document.body.style.overflow =
        "";

    resetZoom();

}


if (modalClose) {

    modalClose.addEventListener(
        "click",
        closeImageViewer
    );

}

if (modalNext) {

    modalNext.addEventListener(
        "click",
        function () {

            modalIndex++;

            if (
                modalIndex >= modalImages.length
            ) {

                modalIndex = 0;

            }


            modalImage.src =
                modalImages[modalIndex];

            resetZoom();

        }
    );

}

if (modalPrev) {

    modalPrev.addEventListener(
        "click",
        function () {

            modalIndex--;

            if (modalIndex < 0) {

                modalIndex =
                    modalImages.length - 1;

            }


            modalImage.src =
                modalImages[modalIndex];

            resetZoom();

        }
    );

}

if (imageModal) {

    imageModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target === imageModal
            ) {

                closeImageViewer();

            }

        }
    );

}

document.addEventListener(
    "keydown",
    function (event) {

        if (
            !imageModal ||
            !imageModal.classList.contains("active")
        ) {
            return;
        }

        if (event.key === "Escape") {

            closeImageViewer();

        }


        if (
            event.key === "ArrowRight" &&
            modalNext
        ) {

            modalNext.click();

        }


        if (
            event.key === "ArrowLeft" &&
            modalPrev
        ) {

            modalPrev.click();

        }

    }
);

if (modalContainer) {

    modalContainer.addEventListener(
        "mousemove",
        function (event) {

            if (window.innerWidth <= 600) {
                return;
            }


            const rect =
                modalContainer.getBoundingClientRect();


            const x =
                ((event.clientX - rect.left) /
                    rect.width) * 100;


            const y =
                ((event.clientY - rect.top) /
                    rect.height) * 100;


            modalImage.style.transformOrigin =
                `${x}% ${y}%`;


            modalImage.style.transform =
                "scale(2.2)";


            modalContainer.classList.add(
                "zooming"
            );

        }
    );


    modalContainer.addEventListener(
        "mouseleave",
        function () {

            resetZoom();

        }
    );

}

function resetZoom() {

    if (!modalImage) {
        return;
    }

    modalImage.style.transform =
        "scale(1)";

    modalImage.style.transformOrigin =
        "center center";


    if (modalContainer) {

        modalContainer.classList.remove(
            "zooming"
        );

    }

}
