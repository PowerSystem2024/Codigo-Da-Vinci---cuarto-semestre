const form = document.getElementById('register-form');
const errorMessage = document.getElementById('error-message');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    errorMessage.innerText = '';

    try {
        // Cambié la URL al backend local
        const response = await fetch('https://e-commerce-backend-73ik.onrender.com/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        alert('¡Usuario registrado con éxito! Por favor, inicia sesión.');
        window.location.href = 'login.html';

    } catch (error) {
        console.error('Error en registro:', error.message);
        errorMessage.innerText = error.message;
    }
});
