const modalContainer = document.getElementById("modal-container");
const modalOverlay = document.getElementById("modal-overlay");

const cartBtn = document.getElementById("cart-btn");
const cartCounter = document.getElementById("cart-counter");

const displayCart = () => {
    modalContainer.innerHTML = "";
    modalContainer.style.display = "block";
    modalOverlay.style.display = "block";

    // Modal Header
    const modalHeader = document.createElement("div");
    modalHeader.className = "modal-header";

    const modalClose = document.createElement("div");
    modalClose.innerText = "❌";
    modalClose.className = "modal-close";
    modalHeader.append(modalClose);

    modalClose.addEventListener("click", () => {
        modalContainer.style.display = "none";
        modalOverlay.style.display = "none";
    });

    const modalTitle = document.createElement("div");
    modalTitle.innerText = "Cart";
    modalTitle.className = "modal-title";
    modalHeader.append(modalTitle);

    modalContainer.append(modalHeader);

    // Modal Body
    if (cart.length > 0) {
        cart.forEach((product) => {
            const modalBody = document.createElement("div");
            modalBody.className = "modal-body";
            modalBody.innerHTML = `
                <div class="product">
                    <img class="product-img" src="${product.img}" />
                    <div class="product-info">
                        <h4>${product.productName}</h4>
                    </div>
                    <div class="quantity">
                        <span class="quantity-btn-decrese">-</span>
                        <span class="quantity-input">${product.quantity}</span>
                        <span class="quantity-btn-increse">+</span>
                    </div>
                    <div class="price">${product.price * product.quantity} $</div>
                    <div class="delete-product">❌</div>
                </div>
            `;
            modalContainer.append(modalBody);

            const decrese = modalBody.querySelector(".quantity-btn-decrese");
            decrese.addEventListener("click", () => {
                if (product.quantity !== 1) {
                    product.quantity--;
                    displayCart();
                    displayCartCounter();
                }
            });

            const increse = modalBody.querySelector(".quantity-btn-increse");
            increse.addEventListener("click", () => {
                product.quantity++;
                displayCart();
                displayCartCounter();
            });

            const deleteProduct = modalBody.querySelector(".delete-product");
            deleteProduct.addEventListener("click", () => {
                deleteCartProduct(product.id);
            });
        });

        // Modal Footer
        const total = cart.reduce((acc, el) => acc + el.price * el.quantity, 0);

        const modalFooter = document.createElement("div");
        modalFooter.className = "modal-footer";
        modalFooter.innerHTML = `
            <div class="total-price">Total: $${total}</div>
            <button id="checkout-btn" class="btn-primary">Go to checkout</button>
            <div id="wallet_container"></div>
        `;
        modalContainer.append(modalFooter);

        // --- INICIO DEL CÓDIGO CORREGIDO ---
        const mp = new MercadoPago("APP_USR-6c3f820c-534d-4218-a758-7ba03ffe0456", {
            locale: "es-AR",
        });

        document.getElementById("checkout-btn").addEventListener("click", async () => {
            try {
                // Mapeamos el carrito para enviarlo al backend
                const itemsToSend = cart.map((prod) => {
                    return {
                        title: prod.productName,
                        quantity: prod.quantity,
                        price: prod.price,
                    };
                });
                
                const response = await fetch("http://localhost:8080/create_preference", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    // Enviamos el array de items en el body
                    body: JSON.stringify({ items: itemsToSend }),
                });

                const preference = await response.json();
                createCheckoutButton(preference.id);
            } catch (error) {
                console.error(error);
                alert("Hubo un error al procesar el pago :(");
            }
        });

        const createCheckoutButton = (preferenceId) => {
            document.getElementById("checkout-btn").remove(); // Ocultamos el botón original
            const bricksBuilder = mp.bricks();
            bricksBuilder.create("wallet", "wallet_container", {
                initialization: {
                    preferenceId: preferenceId,
                    redirectMode: 'modal',
                },
            });
        };
        // --- FIN DEL CÓDIGO CORREGIDO ---

    } else {
        const modalText = document.createElement("h2");
        modalText.className = "modal-body";
        modalText.innerText = "Your cart is empty";
        modalContainer.append(modalText);
    }
};

cartBtn.addEventListener("click", displayCart);

const deleteCartProduct = (id) => {
    const foundId = cart.findIndex((el) => el.id === id);
    cart.splice(foundId, 1);
    displayCart();
    displayCartCounter();
};

const displayCartCounter = () => {
    const cartLength = cart.reduce((acc, el) => acc + el.quantity, 0);
    if (cartLength > 0) {
        cartCounter.style.display = "block";
        cartCounter.innerText = cartLength;
    } else {
        cartCounter.style.display = "none";
    }
};