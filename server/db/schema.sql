-- Database schema for Trending AI PDFs tracking system

-- Table for tracking page views
CREATE TABLE IF NOT EXISTS pageviews (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    page VARCHAR(255) NOT NULL,
    user_agent TEXT,
    ip_hash VARCHAR(64),
    referrer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table for tracking PDF downloads
CREATE TABLE IF NOT EXISTS pdf_downloads (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    pdf_id VARCHAR(255) NOT NULL,
    pdf_title VARCHAR(500),
    section VARCHAR(255),
    user_agent TEXT,
    ip_hash VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table for tracking link clicks
CREATE TABLE IF NOT EXISTS link_clicks (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    link_url TEXT NOT NULL,
    link_type VARCHAR(100),
    link_title VARCHAR(500),
    user_agent TEXT,
    ip_hash VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_pageviews_timestamp ON pageviews(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_pageviews_page ON pageviews(page);
CREATE INDEX IF NOT EXISTS idx_pdf_downloads_timestamp ON pdf_downloads(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_pdf_downloads_pdf_id ON pdf_downloads(pdf_id);
CREATE INDEX IF NOT EXISTS idx_link_clicks_timestamp ON link_clicks(timestamp DESC);

-- View for daily visitor stats
CREATE OR REPLACE VIEW daily_visitor_stats AS
SELECT 
    DATE(timestamp) as date,
    COUNT(DISTINCT ip_hash) as unique_visitors,
    COUNT(*) as total_pageviews
FROM pageviews
GROUP BY DATE(timestamp)
ORDER BY date DESC;

-- View for popular PDFs
CREATE OR REPLACE VIEW popular_pdfs AS
SELECT 
    pdf_id,
    pdf_title,
    section,
    COUNT(*) as download_count,
    MAX(timestamp) as last_downloaded
FROM pdf_downloads
GROUP BY pdf_id, pdf_title, section
ORDER BY download_count DESC;

-- View for traffic sources
CREATE OR REPLACE VIEW traffic_sources AS
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
GROUP BY source
ORDER BY visit_count DESC;
