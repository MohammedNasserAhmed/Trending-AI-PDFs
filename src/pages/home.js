/**
 * Home Page
 * Main catalog view with filters
 */

import { getState, subscribe, setCatalogData } from '../state/store.js';
import { fetchCatalog } from '../features/catalog/services/catalogService.js';
import { createFilterPanel } from '../features/catalog/components/FilterPanel.js';
import { createCatalogTable } from '../features/catalog/components/CatalogTable.js';

export async function renderHomePage() {
  const app = document.getElementById('app');
  app.innerHTML = '';
  
  const container = document.createElement('div');
  container.className = 'container page-content';
  
  const header = document.createElement('header');
  header.className = 'page-header';
  header.innerHTML = `
    <h1>📚 AI PDF Catalog</h1>
    <p>Comprehensive collection of trending AI research and cookbooks</p>
  `;
  
  container.appendChild(header);
  
  // Add loading state
  const loading = document.createElement('div');
  loading.className = 'loading-state';
  loading.innerHTML = '<div class="spinner"></div><p>Loading catalog...</p>';
  container.appendChild(loading);
  
  app.appendChild(container);
  
  // Fetch catalog data
  try {
    const catalogData = await fetchCatalog();
    setCatalogData(catalogData);
    
    // Remove loading
    loading.remove();
    
    // Add filter panel
    const filterPanel = createFilterPanel(catalogData);
    container.appendChild(filterPanel);
    
    // Add catalog table
    const catalogContainer = document.createElement('div');
    catalogContainer.id = 'catalog-container';
    container.appendChild(catalogContainer);
    
    // Subscribe to state changes to update table
    subscribe((state) => {
      catalogContainer.innerHTML = '';
      const table = createCatalogTable(state.filteredCatalog);
      catalogContainer.appendChild(table);
    });
    
    // Initial render
    const state = getState();
    const table = createCatalogTable(state.filteredCatalog);
    catalogContainer.appendChild(table);
    
  } catch (error) {
    loading.innerHTML = `
      <div class="error-state">
        <span class="error-icon">⚠️</span>
        <h3>Failed to load catalog</h3>
        <p>${error.message}</p>
      </div>
    `;
  }
}

export default renderHomePage;
