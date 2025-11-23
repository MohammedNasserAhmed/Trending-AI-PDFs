/**
 * Catalog Table Component
 * Display PDF catalog with images and links
 */

import { trackDownload } from '../../tracking/services/trackingService.js';
import './CatalogTable.css';

export function createCatalogTable(items = []) {
  const container = document.createElement('div');
  container.className = 'catalog-table-container';

  if (items.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <span class="empty-icon">📭</span>
        <h3>No PDFs found</h3>
        <p>Try adjusting your search or filters</p>
      </div>
    `;
    return container;
  }

  const table = document.createElement('table');
  table.className = 'catalog-table';
  
  table.innerHTML = `
    <thead>
      <tr>
        <th>Title</th>
        <th>Section</th>
        <th>Link</th>
        <th>Preview</th>
      </tr>
    </thead>
    <tbody id="catalog-tbody">
    </tbody>
  `;

  const tbody = table.querySelector('#catalog-tbody');

  items.forEach(item => {
    const row = createTableRow(item);
    tbody.appendChild(row);
  });

  container.appendChild(table);
  return container;
}

function createTableRow(item) {
  const tr = document.createElement('tr');
  tr.className = 'catalog-row slide-in-up';
  
  // Title cell
  const titleCell = document.createElement('td');
  titleCell.className = 'cell-title';
  titleCell.textContent = item.title || 'Untitled';
  
  // Section cell
  const sectionCell = document.createElement('td');
  sectionCell.className = 'cell-section';
  const badge = document.createElement('span');
  badge.className = 'section-badge';
  badge.textContent = item.section || 'General';
  badge.style.background = getSectionColor(item.section);
  sectionCell.appendChild(badge);
  
  // Link cell
  const linkCell = document.createElement('td');
  linkCell.className = 'cell-link';
  if (item.link) {
    const link = document.createElement('a');
    link.href = item.link;
    link.textContent = 'Download PDF';
    link.className = 'download-link';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.addEventListener('click', () => {
      trackDownload(item.link, item.title, item.section);
    });
    linkCell.appendChild(link);
  } else {
    linkCell.textContent = 'N/A';
  }
  
  // Image cell
  const imageCell = document.createElement('td');
  imageCell.className = 'cell-image';
  const imgSrc = getImageUrl(item);
  if (imgSrc) {
    const img = document.createElement('img');
    img.src = imgSrc;
    img.alt = `${item.title} preview`;
    img.className = 'pdf-preview';
    img.onerror = function() {
      this.style.display = 'none';
    };
    imageCell.appendChild(img);
  }
  
  tr.appendChild(titleCell);
  tr.appendChild(sectionCell);
  tr.appendChild(linkCell);
  tr.appendChild(imageCell);
  
  return tr;
}

function getImageUrl(item) {
  if (item.image) {
    // Handle Google Drive URLs
    if (item.image.includes('drive.google.com')) {
      const match = item.image.match(/\/file\/d\/([^/]+)\//);
      if (match) {
        return `https://drive.google.com/uc?export=view&id=${match[1]}`;
      }
    }
    return item.image;
  }
  
  // Derive from link if available
  if (item.link && item.link.startsWith('./PDFs/')) {
    return item.link.replace('.pdf', '.png').replace('/book_file', '/first_page_image');
  }
  
  return null;
}

function getSectionColor(section) {
  const colors = {
    'Foundational_ML_Deep_Learning': 'linear-gradient(135deg, #6fa8dc, #5a8bc4)',
    'NLP_Transformers': 'linear-gradient(135deg, #ffd966, #e6c34e)',
    'Computer_Vision': 'linear-gradient(135deg, #93c47d, #7ab063)',
    'Reinforcement_Learning': 'linear-gradient(135deg, #e69138, #cc7a20)',
    'AI_Ethics': 'linear-gradient(135deg, #c27ba0, #a6628a)',
    'Time_Series_Analytics': 'linear-gradient(135deg, #76a5af, #5e8a93)',
    'MLOps_Production_AI': 'linear-gradient(135deg, #8e7cc3, #7563a8)'
  };
  
  return colors[section] || 'linear-gradient(135deg, #555, #777)';
}

export default createCatalogTable;
