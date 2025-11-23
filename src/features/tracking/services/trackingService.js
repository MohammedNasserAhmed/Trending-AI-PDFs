/**
 * Tracking Service
 * Client-side tracking utilities for pageviews, downloads, and clicks
 */

import apiClient from '../../../shared/api/client.js';

/**
 * Track a page view
 */
export async function trackPageView(page = window.location.pathname) {
  try {
    const referrer = document.referrer || '';
    
    await apiClient.post('/api/tracking/pageview', {
      page,
      referrer
    });
  } catch (error) {
    console.error('Failed to track pageview:', error);
  }
}

/**
 * Track a PDF download
 */
export async function trackDownload(pdfId, pdfTitle, section) {
  try {
    await apiClient.post('/api/tracking/download', {
      pdfId,
      pdfTitle,
      section
    });
  } catch (error) {
    console.error('Failed to track download:', error);
  }
}

/**
 * Track a link click
 */
export async function trackClick(linkUrl, linkType = 'external', linkTitle = '') {
  try {
    await apiClient.post('/api/tracking/click', {
      linkUrl,
      linkType,
      linkTitle
    });
  } catch (error) {
    console.error('Failed to track click:', error);
  }
}

/**
 * Get tracking statistics
 */
export async function getTrackingStats() {
  try {
    const response = await apiClient.get('/api/tracking/stats');
    return response.stats;
  } catch (error) {
    console.error('Failed to fetch tracking stats:', error);
    return null;
  }
}

/**
 * Initialize tracking for the session
 */
export function initializeTracking() {
  // Track initial page view
  trackPageView();
  
  // Track page visibility changes
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      trackPageView();
    }
  });
}

export default {
  trackPageView,
  trackDownload,
  trackClick,
  getTrackingStats,
  initializeTracking
};
