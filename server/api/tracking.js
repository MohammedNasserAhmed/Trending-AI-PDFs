import express from 'express';
import { sql, hashIP } from '../db/client.js';

const router = express.Router();

/**
 * POST /api/tracking/pageview
 * Record a page view
 */
router.post('/pageview', async (req, res) => {
  try {
    const { page, referrer } = req.body;
    const userAgent = req.headers['user-agent'];
    const ip = req.ip || req.connection.remoteAddress;
    const ipHash = hashIP(ip);

    await sql`
      INSERT INTO pageviews (page, user_agent, ip_hash, referrer)
      VALUES (${page}, ${userAgent}, ${ipHash}, ${referrer || null})
    `;

    res.status(201).json({ success: true, message: 'Pageview recorded' });
  } catch (error) {
    console.error('Error recording pageview:', error);
    res.status(500).json({ success: false, error: 'Failed to record pageview' });
  }
});

/**
 * POST /api/tracking/download
 * Record a PDF download
 */
router.post('/download', async (req, res) => {
  try {
    const { pdfId, pdfTitle, section } = req.body;
    const userAgent = req.headers['user-agent'];
    const ip = req.ip || req.connection.remoteAddress;
    const ipHash = hashIP(ip);

    await sql`
      INSERT INTO pdf_downloads (pdf_id, pdf_title, section, user_agent, ip_hash)
      VALUES (${pdfId}, ${pdfTitle}, ${section}, ${userAgent}, ${ipHash})
    `;

    res.status(201).json({ success: true, message: 'Download recorded' });
  } catch (error) {
    console.error('Error recording download:', error);
    res.status(500).json({ success: false, error: 'Failed to record download' });
  }
});

/**
 * POST /api/tracking/click
 * Record a link click
 */
router.post('/click', async (req, res) => {
  try {
    const { linkUrl, linkType, linkTitle } = req.body;
    const userAgent = req.headers['user-agent'];
    const ip = req.ip || req.connection.remoteAddress;
    const ipHash = hashIP(ip);

    await sql`
      INSERT INTO link_clicks (link_url, link_type, link_title, user_agent, ip_hash)
      VALUES (${linkUrl}, ${linkType || null}, ${linkTitle || null}, ${userAgent}, ${ipHash})
    `;

    res.status(201).json({ success: true, message: 'Click recorded' });
  } catch (error) {
    console.error('Error recording click:', error);
    res.status(500).json({ success: false, error: 'Failed to record click' });
  }
});

/**
 * GET /api/tracking/stats
 * Get overview statistics
 */
router.get('/stats', async (req, res) => {
  try {
    // Total pageviews
    const pageviews = await sql`SELECT COUNT(*) as count FROM pageviews`;
    
    // Total unique visitors (last 30 days)
    const uniqueVisitors = await sql`
      SELECT COUNT(DISTINCT ip_hash) as count 
      FROM pageviews 
      WHERE timestamp > NOW() - INTERVAL '30 days'
    `;
    
    // Total downloads
    const downloads = await sql`SELECT COUNT(*) as count FROM pdf_downloads`;
    
    // Total clicks
    const clicks = await sql`SELECT COUNT(*) as count FROM link_clicks`;

    res.json({
      success: true,
      stats: {
        totalPageviews: parseInt(pageviews[0].count),
        uniqueVisitors30Days: parseInt(uniqueVisitors[0].count),
        totalDownloads: parseInt(downloads[0].count),
        totalClicks: parseInt(clicks[0].count)
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch stats' });
  }
});

export default router;
