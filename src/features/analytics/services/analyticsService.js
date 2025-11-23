/**
 * Analytics Service
 * Fetch analytics data from backend
 */

import apiClient from '../../../shared/api/client.js';

/**
 * Get visitor statistics over time
 */
export async function getVisitorStats(days = 30) {
  try {
    const response = await apiClient.get(`/api/analytics/visitors?days=${days}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch visitor stats:', error);
    return [];
  }
}

/**
 * Get popular PDFs
 */
export async function getPopularPDFs(limit = 10) {
  try {
    const response = await apiClient.get(`/api/analytics/popular-pdfs?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch popular PDFs:', error);
    return [];
  }
}

/**
 * Get traffic sources
 */
export async function getTrafficSources() {
  try {
    const response = await apiClient.get('/api/analytics/traffic-sources');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch traffic sources:', error);
    return [];
  }
}

/**
 * Get section popularity
 */
export async function getSectionPopularity() {
  try {
    const response = await apiClient.get('/api/analytics/section-popularity');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch section popularity:', error);
    return [];
  }
}

/**
 * Get all analytics data
 */
export async function getAllAnalytics() {
  try {
    const [visitors, popularPDFs, trafficSources, sectionPopularity] = await Promise.all([
      getVisitorStats(),
      getPopularPDFs(),
      getTrafficSources(),
      getSectionPopularity()
    ]);

    return {
      visitors,
      popularPDFs,
      trafficSources,
      sectionPopularity
    };
  } catch (error) {
    console.error('Failed to fetch analytics:', error);
    return null;
  }
}

export default {
  getVisitorStats,
  getPopularPDFs,
  getTrafficSources,
  getSectionPopularity,
  getAllAnalytics
};
