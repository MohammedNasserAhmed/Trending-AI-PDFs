/**
 * Image Lightbox Component
 * 
 * Displays full-size images in a modal overlay when user clicks on thumbnails
 */

import './ImageLightbox.css';

let currentLightbox = null;

/**
 * Create and show image lightbox
 */
export function showImageLightbox(imageUrl, title) {
  // Close existing lightbox if any
  closeLightbox();

  // Create lightbox overlay
  const overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.onclick = closeLightbox;

  // Create lightbox container
  const container = document.createElement('div');
  container.className = 'lightbox-container';
  container.onclick = (e) => e.stopPropagation(); // Prevent closing when clicking image

  // Create close button
  const closeBtn = document.createElement('button');
  closeBtn.className = 'lightbox-close';
  closeBtn.innerHTML = '×';
  closeBtn.onclick = closeLightbox;
  closeBtn.setAttribute('aria-label', 'Close');

  // Create image
  const img = document.createElement('img');
  img.src = imageUrl;
  img.alt = title || 'Preview';
  img.className = 'lightbox-image';

  // Loading state
  img.onload = () => {
    img.classList.add('loaded');
  };

  // Create caption if title provided
  if (title) {
    const caption = document.createElement('div');
    caption.className = 'lightbox-caption';
    caption.textContent = title;
    container.appendChild(caption);
  }

  // Assemble lightbox
  container.appendChild(closeBtn);
  container.appendChild(img);
  overlay.appendChild(container);
  document.body.appendChild(overlay);

  // Prevent body scroll
  document.body.style.overflow = 'hidden';

  // Store reference
  currentLightbox = overlay;

  // Add keyboard support (ESC to close)
  document.addEventListener('keydown', handleKeyPress);

  // Animate in
  requestAnimationFrame(() => {
    overlay.classList.add('visible');
  });
}

/**
 * Close lightbox
 */
export function closeLightbox() {
  if (!currentLightbox) return;

  currentLightbox.classList.remove('visible');
  
  setTimeout(() => {
    if (currentLightbox && currentLightbox.parentNode) {
      currentLightbox.parentNode.removeChild(currentLightbox);
    }
    currentLightbox = null;
    document.body.style.overflow = '';
    document.removeEventListener('keydown', handleKeyPress);
  }, 300); // Match CSS transition duration
}

/**
 * Handle keyboard events
 */
function handleKeyPress(e) {
  if (e.key === 'Escape') {
    closeLightbox();
  }
}

/**
 * Convert Google Drive sharing link to direct image URL
 * Input: https://drive.google.com/file/d/FILE_ID/view?usp=drive_link
 * Output: https://drive.google.com/uc?export=view&id=FILE_ID
 */
export function convertGoogleDriveUrl(url) {
  if (!url) return '';
  
  // Check if it's a Google Drive URL
  if (url.includes('drive.google.com')) {
    // Extract file ID from various Google Drive URL formats
    const patterns = [
      /\/file\/d\/([a-zA-Z0-9_-]+)/,  // /file/d/FILE_ID
      /id=([a-zA-Z0-9_-]+)/,           // ?id=FILE_ID
      /\/d\/([a-zA-Z0-9_-]+)/          // /d/FILE_ID
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return `https://drive.google.com/uc?export=view&id=${match[1]}`;
      }
    }
  }
  
  // Return original URL if not Google Drive or can't parse
  return url;
}
