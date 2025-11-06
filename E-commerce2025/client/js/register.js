const form = document.getElementById('register-form');
const errorMessage = document.getElementById('error-message');

form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Evita que el formulario se envíe de la forma tradicional

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    errorMessage.innerText = ''; // Limpia errores anteriores

    try {
        // Llamamos a la ruta /api/register que creamos en el backend
        const response = await fetch('http://localhost:8080/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            // Si el backend devuelve un error (ej: "El correo ya existe")
            throw new Error(data.message);
        }

        // Si todo sale bien
        alert('¡Usuario registrado con éxito! Por favor, inicia sesión.');
        window.location.href = 'login.html'; // Redirige al login

    } catch (error) {
        console.error('Error en registro:', error.message);
        errorMessage.innerText = error.message;
    }
});