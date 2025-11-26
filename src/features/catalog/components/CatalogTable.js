/**
 * Catalog Table Component
 * Display PDF catalog with images, summaries, and clickable previews
 */

import { trackDownload } from '../../tracking/services/trackingService.js';
import { showImageLightbox, convertGoogleDriveUrl } from '../../../shared/components/ImageLightbox.js';
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
        <th>Preview</th>
        <th>Title</th>
        <th>Summary</th>
        <th>Section</th>
        <th>Link</th>
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
  
  // Image cell (moved to first position)
  const imageCell = document.createElement('td');
  imageCell.className = 'cell-image';
  const imgSrc = getImageUrl(item);
  if (imgSrc) {
    const img = document.createElement('img');
    img.src = imgSrc;
    img.alt = `${item.title} preview`;
    img.className = 'pdf-preview clickable';
    img.title = 'Click to view full size';
    img.onerror = function() {
      this.style.display = 'none';
    };
    
    // Add click handler for lightbox
    img.addEventListener('click', () => {
      showImageLightbox(imgSrc, item.title);
    });
    
    imageCell.appendChild(img);
  } else {
    // Placeholder if no image
    const placeholder = document.createElement('div');
    placeholder.className = 'image-placeholder';
    placeholder.textContent = '📄';
    imageCell.appendChild(placeholder);
  }
  
  // Title cell
  const titleCell = document.createElement('td');
  titleCell.className = 'cell-title';
  titleCell.textContent = item.title || 'Untitled';
  
  // Summary cell (NEW!)
  const summaryCell = document.createElement('td');
  summaryCell.className = 'cell-summary';
  if (item.summary) {
    summaryCell.textContent = item.summary;
  } else {
    const noSummary = document.createElement('span');
    noSummary.className = 'no-summary';
    noSummary.textContent = 'No summary available';
    summaryCell.appendChild(noSummary);
  }
  
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
    link.textContent = 'Download'  ;
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
  
  tr.appendChild(imageCell);
  tr.appendChild(titleCell);
  tr.appendChild(summaryCell);
  tr.appendChild(sectionCell);
  tr.appendChild(linkCell);
  
  return tr;
}

function getImageUrl(item) {
  if (item.image) {
    // Check if it's a Google Drive URL
    if (item.image.includes('drive.google.com')) {
      return convertGoogleDriveUrl(item.image);
    }
    // Otherwise return as is (e.g. S3, direct links)
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
    'AI Agents and Agentic Workflows': 'linear-gradient(135deg, #FF6B6B, #EE5253)',
    'Generative AI and LLMs': 'linear-gradient(135deg, #4834D4, #686DE0)',
    'Prompt Engineering': 'linear-gradient(135deg, #F0932B, #FFBE76)',
    'AI Engineering and MLOps': 'linear-gradient(135deg, #6AB04C, #BADC58)',
    'Enterprise and Business AI': 'linear-gradient(135deg, #22A6B3, #7ED6DF)',
    'Data Science and Fundamentals': 'linear-gradient(135deg, #30336B, #535C68)',
    'Tools and Productivity': 'linear-gradient(135deg, #BE2EDD, #E056FD)',
    
    // Legacy mappings (fallback)
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
