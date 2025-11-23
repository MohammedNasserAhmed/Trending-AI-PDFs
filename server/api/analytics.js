import express from 'express';
import { sql } from '../db/client.js';

const router = express.Router();

/**
 * GET /api/analytics/visitors
 * Get visitor count over time (last 30 days by default)
 */
router.get('/visitors', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    
    const result = await sql`
      SELECT 
        DATE(timestamp) as date,
        COUNT(DISTINCT ip_hash) as unique_visitors,
        COUNT(*) as total_pageviews
      FROM pageviews
      WHERE timestamp > NOW() - INTERVAL '${days} days'
      GROUP BY DATE(timestamp)
      ORDER BY date ASC
    `;

    res.json({
      success: true,
      data: result.map(row => ({
        date: row.date,
        uniqueVisitors: parseInt(row.unique_visitors),
        totalPageviews: parseInt(row.total_pageviews)
      }))
    });
  } catch (error) {
    console.error('Error fetching visitor data:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch visitor data' });
  }
});

/**
 * GET /api/analytics/popular-pdfs
 * Get most downloaded PDFs
 */
router.get('/popular-pdfs', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const result = await sql`
      SELECT 
        pdf_id,
        pdf_title,
        section,
        COUNT(*) as download_count,
        MAX(timestamp) as last_downloaded
      FROM pdf_downloads
      GROUP BY pdf_id, pdf_title, section
      ORDER BY download_count DESC
      LIMIT ${limit}
    `;

    res.json({
      success: true,
      data: result.map(row => ({
        pdfId: row.pdf_id,
        title: row.pdf_title,
        section: row.section,
        downloadCount: parseInt(row.download_count),
        lastDownloaded: row.last_downloaded
      }))
    });
  } catch (error) {
    console.error('Error fetching popular PDFs:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch popular PDFs' });
  }
});

/**
 * GET /api/analytics/traffic-sources
 * Get traffic source breakdown
 */
router.get('/traffic-sources', async (req, res) => {
  try {
    const result = await sql`
      SELECT 
        CASE 
          WHEN referrer IS NULL OR referrer = '' THEN 'Direct'
          WHEN referrer LIKE '%google.%' THEN 'Google'
          WHEN referrer LIKE '%github.%' THEN 'GitHub'
          WHEN referrer LIKE '%twitter.%' OR referrer LIKE '%t.co%' THEN 'Twitter'
          WHEN referrer LIKE '%linkedin.%' THEN 'LinkedIn'
          ELSE 'Other'
        END as source,
        COUNT(*) as visit_count
      FROM pageviews
      WHERE timestamp > NOW() - INTERVAL '30 days'
      GROUP BY source
      ORDER BY visit_count DESC
    `;

    res.json({
      success: true,
      data: result.map(row => ({
        source: row.source,
        visitCount: parseInt(row.visit_count)
      }))
    });
  } catch (error) {
    console.error('Error fetching traffic sources:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch traffic sources' });
  }
});

/**
 * GET /api/analytics/section-popularity
 * Get download counts by section
 */
router.get('/section-popularity', async (req, res) => {
  try {
    const result = await sql`
      SELECT 
        section,
        COUNT(*) as download_count,
        COUNT(DISTINCT pdf_id) as unique_pdfs
      FROM pdf_downloads
      WHERE section IS NOT NULL
      GROUP BY section
      ORDER BY download_count DESC
    `;

    res.json({
      success: true,
      data: result.map(row => ({
        section: row.section,
        downloadCount: parseInt(row.download_count),
        uniquePdfs: parseInt(row.unique_pdfs)
      }))
    });
  } catch (error) {
    console.error('Error fetching section popularity:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch section popularity' });
  }
});

export default router;
