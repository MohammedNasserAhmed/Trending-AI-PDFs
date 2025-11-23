/**
 * Lightweight Client-Side Router
 * Handles navigation without full page reloads
 */

class Router {
  constructor() {
    this.routes = new Map();
    this.currentPath = window.location.pathname;
    this.notFoundHandler = null;
    
    // Listen to browser navigation
    window.addEventListener('popstate', () => {
      this.handleRoute(window.location.pathname);
    });
    
    // Intercept link clicks
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-link]')) {
        e.preventDefault();
        this.navigate(e.target.getAttribute('href'));
      }
    });
  }

  /**
   * Register a route
   */
  addRoute(path, handler) {
    this.routes.set(path, handler);
  }

  /**
   * Register multiple routes at once
   */
  addRoutes(routesConfig) {
    Object.entries(routesConfig).forEach(([path, handler]) => {
      this.addRoute(path, handler);
    });
  }

  /**
   * Set 404 handler
   */
  setNotFound(handler) {
    this.notFoundHandler = handler;
  }

  /**
   * Navigate to a path
   */
  navigate(path) {
    window.history.pushState({}, '', path);
    this.handleRoute(path);
  }

  /**
   * Handle route change
   */
  async handleRoute(path) {
    this.currentPath = path;
    
    // Find matching route
    let handler = this.routes.get(path);
    
    // Try to match dynamic routes (e.g., /category/:id)
    if (!handler) {
      for (const [routePath, routeHandler] of this.routes) {
        const params = this.matchRoute(routePath, path);
        if (params) {
          handler = () => routeHandler(params);
          break;
        }
      }
    }
    
    // Execute handler or show 404
    if (handler) {
      try {
        await handler();
      } catch (error) {
        console.error('Route handler error:', error);
      }
    } else if (this.notFoundHandler) {
      this.notFoundHandler();
    }
  }

  /**
   * Match dynamic route patterns
   */
  matchRoute(pattern, path) {
    const patternParts = pattern.split('/').filter(Boolean);
    const pathParts = path.split('/').filter(Boolean);
    
    if (patternParts.length !== pathParts.length) {
      return null;
    }
    
    const params = {};
    
    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i].startsWith(':')) {
        const paramName = patternParts[i].slice(1);
        params[paramName] = pathParts[i];
      } else if (patternParts[i] !== pathParts[i]) {
        return null;
      }
    }
    
    return params;
  }

  /**
   * Get current path
   */
  getCurrentPath() {
    return this.currentPath;
  }

  /**
   * Start router (handle initial route)
   */
  start() {
    this.handleRoute(window.location.pathname);
  }
}

// Create global router instance
const router = new Router();

export default router;

// Helper function to create navigation links
export function createLink(href, text, className = '') {
  const link = document.createElement('a');
  link.href = href;
  link.textContent = text;
  link.className = className;
  link.setAttribute('data-link', '');
  return link;
}
