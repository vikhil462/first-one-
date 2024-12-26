// Main application file
import { loadComponent } from './componentLoader.js';
import { setupNavigation } from './navigation.js';
import { initAuth } from './auth.js';

// Initial load
document.addEventListener('DOMContentLoaded', async () => {
    // Load header and footer
    await loadComponent('header-container', 'components/header.html');
    await loadComponent('footer-container', 'components/footer.html');
    
    // Load initial page content
    await loadComponent('main-container', 'components/home.html');
    
    // Setup navigation and authentication
    setupNavigation();
    initAuth();
}); 