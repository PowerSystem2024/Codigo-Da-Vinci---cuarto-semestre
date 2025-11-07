const modalContainer = document.getElementById("modal-container");
const modalOverlay = document.getElementById("modal-overlay");

const cartBtn = document.getElementById("cart-btn");
const cartCounter = document.getElementById("cart-counter");

const displayCart = async () => {
    modalContainer.innerHTML = "";
    modalContainer.style.display = "block";
    modalOverlay.style.display = "block";

    // ... (El código de 'modalHeader' y 'modalBody' sigue igual) ...
    // Modal Header
    const modalHeader = document.createElement("div");

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

            // Delete
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
            <div id="wallet_container"></div> `;
        
        // 🔽 ¡AQUÍ ESTÁ EL ARREGLO! 🔽
        // Verificamos si el usuario está logueado
        const token = localStorage.getItem('token');

        if (token) {
            // --- SI ESTÁ LOGUEADO, MOSTRAMOS EL BOTÓN DE PAGO ---
            modalFooter.innerHTML += `<button id="checkout-btn" class="btn-primary">Go to checkout</button>`;
            modalContainer.append(modalFooter);
            
            // --- INICIAMOS MERCADO PAGO ---
            const mp = new MercadoPago('APP_USR-6c3f820c-534d-4218-a758-7ba03ffe0456', {
                locale: 'es-AR'
            });

            document.getElementById("checkout-btn").addEventListener("click", async () => {
                try {
                    const orderData = cart.map(product => {
                        return {
                            title: product.productName,
                            quantity: product.quantity,
                            price: product.price,
                        };
                    });
                    
                    const response = await fetch("https://e-commerce-backend-73ik.onrender.com/create_preference", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(orderData), 
                    });

                    const preference = await response.json();
                    createCheckoutButton(preference.id, mp); // Pasamos 'mp'

                } catch (error) {
                    alert("error :(");
                }
            });

        } else {
            // --- SI NO ESTÁ LOGUEADO, MOSTRAMOS UN MENSAJE ---
            modalFooter.innerHTML += `<p style="color: red; margin-top: 15px;">Necesitás <a href="login.html" style="color: blue;">iniciar sesión</a> para pagar.</p>`;
            modalContainer.append(modalFooter);
        }
        

    } else {
        const modalText = document.createElement("h2");
        modalText.className = "modal-body";
        modalText.innerText = "Your cart is empty";
        modalContainer.append(modalText);
    }
};

// Función de Mercado Pago (la saqué de displayCart para que no se redeclare)
const createCheckoutButton = (preferenceId, mp) => {
    const bricksBuilder = mp.bricks();

    const renderComponent = async () => {
        if (window.checkoutButton) {
            window.checkoutButton.unmount();
        }

        window.checkoutButton = await bricksBuilder.create("wallet", "wallet_container", {
            initialization: {
                preferenceId: preferenceId,
                redirectMode: 'modal',
            },
        });
    };
    renderComponent();
};


// --- El resto de tu código (no cambia) ---
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