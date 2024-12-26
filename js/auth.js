const API_URL = 'http://localhost:5000/api';

export function initAuth() {
    const loggedInUser = sessionStorage.getItem('currentUser');
    updateAuthUI(loggedInUser);

    window.setAuthMode = (mode) => {
        const modalTitle = document.getElementById('authModalTitle');
        const authForm = document.getElementById('auth-form');
        const loginFields = document.getElementById('login-fields');
        const signupFields = document.getElementById('signup-fields');
        const confirmPasswordField = document.getElementById('confirm-password-field');
        
        // Reset form
        authForm.reset();
        clearErrors();
        
        if (mode === 'login') {
            modalTitle.textContent = 'Login';
            loginFields.style.display = 'block';
            signupFields.style.display = 'none';
            confirmPasswordField.style.display = 'none';
            
            // Update required fields
            document.getElementById('identifier').required = true;
            document.getElementById('password').required = true;
            
            // Remove required from signup fields
            const signupInputs = signupFields.querySelectorAll('input');
            signupInputs.forEach(input => input.required = false);
            document.getElementById('confirmPassword').required = false;
        } else {
            modalTitle.textContent = 'Sign Up';
            loginFields.style.display = 'none';
            signupFields.style.display = 'block';
            confirmPasswordField.style.display = 'block';
            
            // Remove required from login fields
            document.getElementById('identifier').required = false;
            
            // Update required fields for signup
            document.getElementById('firstName').required = true;
            document.getElementById('lastName').required = true;
            document.getElementById('username').required = true;
            document.getElementById('email').required = true;
            document.getElementById('password').required = true;
            document.getElementById('confirmPassword').required = true;
        }
        
        authForm.dataset.mode = mode;
    };

    window.handleAuth = async (event) => {
        event.preventDefault();
        const form = event.target;
        const mode = form.dataset.mode;
        
        clearErrors();
        
        try {
            if (mode === 'login') {
                const identifier = form.identifier.value;
                const password = form.password.value;
                
                if (!identifier || !password) {
                    throw new Error('Please fill in all fields');
                }
                
                // Send login request to backend
                const response = await fetch(`${API_URL}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        identifier: identifier,
                        password: password
                    })
                });

                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.error || 'Login failed');
                }

                // Store user data
                sessionStorage.setItem('currentUser', data.username);
                sessionStorage.setItem('firstName', data.firstName);
                sessionStorage.setItem('isAdmin', data.isAdmin);
                
            } else { // signup
                const firstName = form.firstName.value;
                const lastName = form.lastName.value;
                const username = form.username.value;
                const email = form.email.value;
                const password = form.password.value;
                const confirmPassword = form.confirmPassword.value;
                
                // Validate all fields are filled
                if (!firstName || !lastName || !username || !email || !password || !confirmPassword) {
                    throw new Error('Please fill in all fields');
                }
                
                // Validate password match
                if (password !== confirmPassword) {
                    throw new Error('Passwords do not match');
                }
                
                // Send signup request to backend
                const response = await fetch(`${API_URL}/auth/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        firstName,
                        lastName,
                        username,
                        email,
                        password
                    })
                });

                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.error || 'Registration failed');
                }
            }
            
            // Update UI on success
            updateAuthUI(sessionStorage.getItem('currentUser'));
            
            // Close modal and reset form
            bootstrap.Modal.getInstance(document.getElementById('authModal')).hide();
            form.reset();
            
        } catch (error) {
            showError('password', error.message);
        }
    };

    window.logout = () => {
        sessionStorage.clear();
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
        const firstName = sessionStorage.getItem('firstName') || username;
        usernameDisplay.textContent = firstName;
    } else {
        authButtons.style.display = 'block';
        logoutBtn.style.display = 'none';
        userWelcome.style.display = 'none';
    }
}

function showError(field, message) {
    const errorElement = document.getElementById(`${field}-error`);
    if (errorElement) {
        errorElement.textContent = message;
        document.getElementById(field)?.classList.add('is-invalid');
    }
}

function clearErrors() {
    const errors = document.getElementsByClassName('invalid-feedback');
    const inputs = document.getElementsByClassName('form-control');
    Array.from(errors).forEach(error => error.textContent = '');
    Array.from(inputs).forEach(input => input.classList.remove('is-invalid'));
}