/**
 * Latest Page
 * Shows recently added PDFs
 */

import { fetchCatalog, getLatestPDFs } from '../features/catalog/services/catalogService.js';
import { createCatalogTable } from '../features/catalog/components/CatalogTable.js';

export async function renderLatestPage() {
  const app = document.getElementById('app');
  app.innerHTML = '';
  
  const container = document.createElement('div');
  container.className = 'container page-content';
  
  const header = document.createElement('header');
  header.className = 'page-header';
  header.innerHTML = `
    <h1>🆕 Latest PDFs</h1>
    <p>Recently added to the collection</p>
  `;
  
  container.appendChild(header);
  
  const loading = document.createElement('div');
  loading.className = 'loading-state';
  loading.innerHTML = '<div class="spinner"></div><p>Loading latest PDFs...</p>';
  container.appendChild(loading);
  
  app.appendChild(container);
  
  try {
    const catalogData = await fetchCatalog();
    const latestPDFs = getLatestPDFs(catalogData, 20);
    
    loading.remove();
    
    const table = createCatalogTable(latestPDFs);
    container.appendChild(table);
  } catch (error) {
    loading.innerHTML = `
      <div class="error-state">
        <h3>Failed to load PDFs</h3>
        <p>${error.message}</p>
      </div>
    `;
  }
}

export default renderLatestPage;
