import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const sql = neon(process.env.DATABASE_URL);

/**
 * Hash IP address for privacy-compliant tracking
 */
export function hashIP(ip) {
  if (!ip) return null;
  return crypto.createHash('sha256').update(ip + process.env.IP_SALT || 'default-salt').digest('hex');
}

/**
 * Test database connection
 */
export async function testConnection() {
  try {
    const result = await sql`SELECT NOW()`;
    console.log('✅ Database connected successfully:', result[0].now);
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

/**
 * Initialize database schema
 */
export async function initializeSchema() {
  try {
    // Create pageviews table
    await sql`
      CREATE TABLE IF NOT EXISTS pageviews (
        id SERIAL PRIMARY KEY,
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        page VARCHAR(255) NOT NULL,
        user_agent TEXT,
        ip_hash VARCHAR(64),
        referrer TEXT
      )
    `;

    // Create pdf_downloads table
    await sql`
      CREATE TABLE IF NOT EXISTS pdf_downloads (
        id SERIAL PRIMARY KEY,
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        pdf_id VARCHAR(255) NOT NULL,
        pdf_title VARCHAR(500),
        section VARCHAR(255),
        user_agent TEXT,
        ip_hash VARCHAR(64)
      )
    `;

    // Create link_clicks table
    await sql`
      CREATE TABLE IF NOT EXISTS link_clicks (
        id SERIAL PRIMARY KEY,
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        link_url TEXT NOT NULL,
        link_type VARCHAR(100),
        link_title VARCHAR(500),
        user_agent TEXT,
        ip_hash VARCHAR(64)
      )
    `;

    console.log('✅ Database schema initialized');
    return true;
  } catch (error) {
    console.error('❌ Schema initialization failed:', error.message);
    return false;
  }
}

export { sql };
