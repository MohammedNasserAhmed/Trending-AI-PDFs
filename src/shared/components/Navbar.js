/**
 * Navbar Component
 * Modern navigation bar with GitHub stats
 */

import { getState, subscribe } from '../../state/store.js';
import { createLink } from '../../router/router.js';
import { autoRefreshGitHubStats } from '../../features/github/services/githubService.js';
import './Navbar.css';

export function createNavbar() {
  const nav = document.createElement('nav');
  nav.className = 'navbar';
  nav.id = 'main-navbar';

  nav.innerHTML = `
    <div class="navbar-container">
      <div class="navbar-brand">
        <a href="/" data-link class="brand-link">
          <span class="brand-icon">📚</span>
          <span class="brand-text">Trending AI PDFs</span>
        </a>
      </div>
      
      <div class="navbar-links">
        <a href="/" data-link class="nav-link">Home</a>
        <a href="/latest" data-link class="nav-link">Latest</a>
        <a href="/categories" data-link class="nav-link">Categories</a>
        <a href="/stats" data-link class="nav-link">Analytics</a>
        <a href="/about" data-link class="nav-link">About</a>
      </div>
      
      <div class="navbar-stats" id="github-stats-widget">
        <div class="stats-loading">
          <span class="spinner"></span>
        </div>
      </div>
    </div>
  `;

  // Initialize GitHub stats
  initializeGitHubStats(nav);

  return nav;
}

function initializeGitHubStats(nav) {
  const statsWidget = nav.querySelector('#github-stats-widget');

  const cleanup = autoRefreshGitHubStats((stats) => {
    if (!stats) {
      statsWidget.innerHTML = '';
      return;
    }

    statsWidget.innerHTML = `
      <a href="https://github.com/${stats.owner || 'user'}/${stats.repo || 'repo'}" 
         target="_blank" 
         rel="noopener noreferrer" 
         class="github-stats">
        <div class="stat-item">
          <span class="stat-label">Stars</span>
          <span class="stat-value">${formatNumber(stats.stars || 0)}</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-label">Forks</span>
          <span class="stat-value">${formatNumber(stats.forks || 0)}</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-label">Watch</span>
          <span class="stat-value">${formatNumber(stats.watchers || 0)}</span>
        </div>
      </a>
    `;
  }, 5); // Refresh every 5 minutes

  // Store cleanup function
  nav._cleanup = cleanup;
}

function formatNumber(num) {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
}

export default createNavbar;
