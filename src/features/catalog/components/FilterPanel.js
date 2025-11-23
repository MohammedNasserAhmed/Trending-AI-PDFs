/**
 * Filter Panel Component
 * Search and section filters for catalog
 */

import { setSearchQuery, setSelectedSection, subscribe } from '../../../state/store.js';
import { getSections } from '../services/catalogService.js';
import './FilterPanel.css';

export function createFilterPanel(catalogData = []) {
  const panel = document.createElement('div');
  panel.className = 'filter-panel';
  
  const sections = getSections(catalogData);
  
  panel.innerHTML = `
    <div class="filter-container">
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input
          type="search"
          id="search-input"
          class="search-input"
          placeholder="Search PDFs by title or topic..."
        />
      </div>
      
      <div class="filter-select-wrapper">
        <select id="section-filter" class="section-filter">
          <option value="">All Sections</option>
          ${sections.map(section => `
            <option value="${section}">${formatSectionName(section)}</option>
          `).join('')}
        </select>
      </div>
      
      <div class="results-count" id="results-count">
        <span class="count-text">Loading...</span>
      </div>
    </div>
  `;
  
  // Attach event listeners
  const searchInput = panel.querySelector('#search-input');
  const sectionFilter = panel.querySelector('#section-filter');
  
  searchInput.addEventListener('input', (e) => {
    setSearchQuery(e.target.value);
  });
  
  sectionFilter.addEventListener('change', (e) => {
    setSelectedSection(e.target.value);
  });
  
  // Subscribe to state changes for results count
  subscribe((state) => {
    updateResultsCount(panel, state.filteredCatalog.length);
  });
  
  return panel;
}

function updateResultsCount(panel, count) {
  const countElement = panel.querySelector('#results-count .count-text');
  if (countElement) {
    countElement.textContent = `${count} PDF${count !== 1 ? 's' : ''} found`;
  }
}

function formatSectionName(section) {
  return section.replace(/_/g, ' ');
}

export default createFilterPanel;
