// Navigation handler
import { loadComponent } from './componentLoader.js';

export function setupNavigation() {
    document.addEventListener('click', async (e) => {
        if (e.target.matches('[data-page]')) {
            e.preventDefault();
            const page = e.target.getAttribute('data-page');
            await loadComponent('main-container', `components/${page}.html`);
        }
    });
} 