const API_URL = 'http://localhost:5000/api';

export function initAuth() {
    // Check if user is logged in
    const loggedInUser = sessionStorage.getItem('currentUser');
    updateAuthUI(loggedInUser);

    window.setAuthMode = (mode) => {
        const modalTitle = document.getElementById('authModalTitle');
        const authForm = document.getElementById('auth-form');
        modalTitle.textContent = mode === 'login' ? 'Login' : 'Sign Up';
        authForm.dataset.mode = mode;
    };

    window.handleAuth = async (event) => {
        event.preventDefault();
        const form = event.target;
        const mode = form.dataset.mode;
        const username = form.username.value;
        const password = form.password.value;

        clearErrors();

        try {
            const response = await fetch(`${API_URL}/auth/${mode === 'login' ? 'login' : 'register'}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error);
            }

            sessionStorage.setItem('currentUser', username);
            updateAuthUI(username);
            bootstrap.Modal.getInstance(document.getElementById('authModal')).hide();
            form.reset();

        } catch (error) {
            showError('password', error.message);
        }
    };

    window.logout = () => {
        sessionStorage.removeItem('currentUser');
        updateAuthUI(null);
    };
}

function updateAuthUI(username) {
    const authButtons = document.getElementById('auth-buttons');
    const logoutBtn = document.getElementById('logout-btn');
    const userWelcome = document.getElementById('user-welcome');
    const usernameDisplay = document.getElementById('username-display');

    if (username) {
        authButtons.style.display = 'none';
        logoutBtn.style.display = 'block';
        userWelcome.style.display = 'block';
        usernameDisplay.textContent = username;
    } else {
        authButtons.style.display = 'block';
        logoutBtn.style.display = 'none';
        userWelcome.style.display = 'none';
    }
}

function showError(field, message) {
    const errorElement = document.getElementById(`${field}-error`);
    errorElement.textContent = message;
    document.getElementById(field).classList.add('is-invalid');
}

function clearErrors() {
    const errors = document.getElementsByClassName('invalid-feedback');
    const inputs = document.getElementsByClassName('form-control');
    Array.from(errors).forEach(error => error.textContent = '');
    Array.from(inputs).forEach(input => input.classList.remove('is-invalid'));
} 