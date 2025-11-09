const form = document.getElementById('login-form');
const errorMessage = document.getElementById('error-message');

form.addEventListener('submit', async (e) => {
        e.preventDefault();

                const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        errorMessage.innerText = '';

        try {
        // Cambié la URL al backend local
        const response = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: {
                'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
        throw new Error(data.message);
        }

        console.log("Token recibido:", data.token);
        console.log("Usuario:", data.user);

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        alert('¡Login exitoso!');
        window.location.href = 'index.html';

        } catch (error) {
        console.error('Error en login:', error.message);
        errorMessage.innerText = error.message;
        }
});