/**
 * Main Application Entry Point
 * Initializes app, router, and tracking
 */

import router from './router/router.js';
import { createNavbar } from './shared/components/Navbar.js';
import { initializeTracking } from './features/tracking/services/trackingService.js';
import { renderHomePage } from './pages/home.js';
import { renderLatestPage } from './pages/latest.js';
import { renderCategoriesPage } from './pages/categories.js';
import { renderStatsPage } from './pages/stats.js';
import { renderAboutPage } from './pages/about.js';

// Import styles
import './shared/styles/design-tokens.css';
import './shared/styles/global.css';
import './pages/pages.css';

/**
 * Initialize the application
 */
async function initApp() {
  console.log('🚀 Initializing Trending AI PDFs...');
  
  // Remove the initial loader
  const loader = document.getElementById('root-loader');
  if (loader) {
    loader.remove();
  }
  
  // Add navbar
  const navbar = createNavbar();
  document.body.insertBefore(navbar, document.body.firstChild);
  
  // Create app container
  const app = document.createElement('div');
  app.id = 'app';
  document.body.appendChild(app);
  
  // Set up routes
  router.addRoutes({
    '/': renderHomePage,
    '/latest': renderLatestPage,
    '/categories': renderCategoriesPage,
    '/stats': renderStatsPage,
    '/about': renderAboutPage
  });
  
  // Set 404 handler
  router.setNotFound(() => {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="container page-content">
        <div class="error-state">
          <span class="error-icon">🔍</span>
          <h1>404 - Page Not Found</h1>
          <p>The page you're looking for doesn't exist.</p>
          <a href="/" data-link class="button">Go Home</a>
        </div>
      </div>
    `;
  });
  
  // Initialize tracking
  initializeTracking();
  
  // Start router
  router.start();
  
  console.log('✅ Application initialized successfully');
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
