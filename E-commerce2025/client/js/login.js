const form = document.getElementById('login-form');
const errorMessage = document.getElementById('error-message');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    errorMessage.innerText = '';

    try {
        // Llamamos a la ruta /api/login del backend
        const response = await fetch('https://e-commerce-backend-73ik.onrender.com/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            // Si el backend devuelve un error (ej: "Contraseña incorrecta")
            throw new Error(data.message);
        }

        // ¡ÉXITO! Aquí guardamos el token
        console.log("Token recibido:", data.token);
        console.log("Usuario:", data.user);

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user)); // Guardamos los datos del usuario

        alert('¡Login exitoso!');
        window.location.href = 'index.html'; // Redirige a la tienda principal

    } catch (error) {
        console.error('Error en login:', error.message);
        errorMessage.innerText = error.message;
    }
});