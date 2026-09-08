const checkoutForm =
    document.getElementById("checkout-form");


checkoutForm.addEventListener("submit", function(event) {

    event.preventDefault();


    
    const name =
        document.getElementById("name").value.trim();

    const phone =
        document.getElementById("phone").value.trim();

    const address =
        document.getElementById("address").value.trim();

    const city =
        document.getElementById("city").value.trim();

    const pincode =
        document.getElementById("pincode").value.trim();


    
    const payment =
        document.querySelector(
            'input[name="payment"]:checked'
        );


    
    if (!payment) {

        alert("Please select a payment method.");

        return;
    }


    
    const cart =
        JSON.parse(localStorage.getItem("cart")) || [];


    
    if (cart.length === 0) {

        alert("Your cart is empty.");

        return;
    }


    
    const order = {

        orderId: "BB" + Date.now(),

        name: name,

        phone: phone,

        address: address,

        city: city,

        pincode: pincode,

        payment: payment.value,

        products: cart,

        date: new Date().toLocaleString()

    };


    
    localStorage.setItem(
        "order",
        JSON.stringify(order)
    );


    
    localStorage.removeItem("cart");



    window.location.href =
        "OrderSuccess.html";

});