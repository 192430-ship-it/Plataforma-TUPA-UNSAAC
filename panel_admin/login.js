document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('adminLoginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorContainer = document.getElementById('loginError');
    const adminPanelUrl = 'panel_admin.html';

    const setError = (message) => {
        errorContainer.textContent = message;
        errorContainer.classList.remove('hidden');
    };

    if (localStorage.getItem('adminLoggedIn') === 'true') {
        window.location.href = adminPanelUrl;
        return;
    }

    if (!loginForm) return;

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        errorContainer.classList.add('hidden');

        const username = usernameInput.value.trim();
        const password = passwordInput.value;

        if (!username || !password) {
            setError('Por favor ingrese usuario y contraseña.');
            return;
        }

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Usuario o contraseña incorrectos.');
            }

            localStorage.setItem('adminLoggedIn', 'true');
            localStorage.setItem('adminUser', JSON.stringify(data.user));
            window.location.href = adminPanelUrl;
        } catch (err) {
            setError(err.message || 'No se pudo iniciar sesión.');
        }
    });
});
