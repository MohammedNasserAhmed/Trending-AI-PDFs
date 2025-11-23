import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

/**
 * GET /api/github/repo-stats
 * Get GitHub repository statistics (stars, forks, watchers)
 */
router.get('/repo-stats', async (req, res) => {
  try {
    const owner = process.env.GITHUB_REPO_OWNER;
    const repo = process.env.GITHUB_REPO_NAME;
    
    if (!owner || !repo) {
      return res.status(400).json({ 
        success: false, 
        error: 'GitHub repository not configured' 
      });
    }

    const url = `https://api.github.com/repos/${owner}/${repo}`;
    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Trending-AI-PDFs'
    };
    
    // Add token if available for higher rate limits
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }

    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      throw new Error(`GitHub API responded with ${response.status}`);
    }

    const data = await response.json();

    res.json({
      success: true,
      stats: {
        stars: data.stargazers_count,
        forks: data.forks_count,
        watchers: data.watchers_count,
        openIssues: data.open_issues_count,
        description: data.description,
        language: data.language,
        lastUpdated: data.updated_at
      }
    });
  } catch (error) {
    console.error('Error fetching GitHub stats:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch GitHub stats',
      message: error.message 
    });
  }
});

export default router;
