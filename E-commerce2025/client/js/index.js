const shopContent = document.getElementById("shopContent");
let cart = []; // El carrito ahora es global para este script

// 1. Envolvemos todo en una función 'async' para poder usar 'await'
async function cargarProductos() {
    let productos = []; // Array para guardar los productos de la BD

    try {
        // 2. Hacemos un 'fetch' a la nueva ruta de tu backend
        const response = await fetch("http://localhost:8080/api/productos");
        productos = await response.json(); // Convertimos la respuesta en JSON
        console.log("Productos cargados desde la BD:", productos);
    } catch (error) {
        console.error("Error al cargar productos:", error);
        shopContent.innerHTML = "<h1>Error al cargar productos</h1>";
        return; // Detenemos la ejecución si hay un error
    }

    // 3. El resto de tu código (el .forEach) va aquí adentro
    productos.forEach((product) => {
        const content = document.createElement("div");
        // Asegúrate de que los nombres de las columnas de tu BD coincidan aquí
        // (product.img, product.productname, product.price)
        content.innerHTML = `
        <img src="${product.img}"> 
        <h3>${product.productname}</h3> 
        <p>${product.price} $</p>
        `;
        shopContent.append(content);

        const buyButton = document.createElement("button");
        buyButton.innerText = "Comprar";

        content.append(buyButton);

        buyButton.addEventListener("click", ()=>{
            const repeat = cart.some((repeatProduct) => repeatProduct.id === product.id)

            if(repeat) {
                cart.forEach((prod)=> {
                    if(prod.id === product.id){
                        prod.quantity++;
                        displayCartCounter();
                    }
                })
            }else {
                cart.push({
                id: product.id,
                productName: product.productname, // Asegúrate de que coincida con tu BD
                price: product.price,
                quantity: product.quantity,
                img: product.img,
                });
                displayCartCounter();
            }
            
            console.log(cart)
        })
    });
}

// 4. Llamamos a la función para que se ejecute apenas cargue la página
cargarProductos();