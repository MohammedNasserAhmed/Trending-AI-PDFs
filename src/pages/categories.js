/**
 * Categories Page
 * Browse PDFs by category/section
 */

import { fetchCatalog, groupBySection } from '../features/catalog/services/catalogService.js';
import { createCatalogTable } from '../features/catalog/components/CatalogTable.js';

export async function renderCategoriesPage() {
  const app = document.getElementById('app');
  app.innerHTML = '';
  
  const container = document.createElement('div');
  container.className = 'container page-content';
  
  const header = document.createElement('header');
  header.className = 'page-header';
  header.innerHTML = `
    <h1>📂 Browse by Category</h1>
    <p>Explore PDFs organized by topic</p>
  `;
  
  container.appendChild(header);
  
  const loading = document.createElement('div');
  loading.innerHTML = '<div class="spinner"></div><p>Loading categories...</p>';
  container.appendChild(loading);
  
  app.appendChild(container);
  
  try {
    const catalogData = await fetchCatalog();
    const grouped = groupBySection(catalogData);
    
    loading.remove();
    
    Object.entries(grouped).forEach(([section, pdfs]) => {
      const sectionDiv = document.createElement('div');
      sectionDiv.className = 'category-section';
      sectionDiv.style.marginBottom = 'var(--space-8)';
      
      const sectionHeader = document.createElement('h2');
      sectionHeader.textContent = section.replace(/_/g, ' ');
      sectionHeader.className = 'category-header';
      sectionHeader.style.marginBottom = 'var(--space-4)';
      
      sectionDiv.appendChild(sectionHeader);
      
      const table = createCatalogTable(pdfs);
      sectionDiv.appendChild(table);
      
      container.appendChild(sectionDiv);
    });
  } catch (error) {
    loading.innerHTML = `
      <div class="error-state">
        <h3>Failed to load categories</h3>
        <p>${error.message}</p>
      </div>
    `;
  }
}

export default renderCategoriesPage;
