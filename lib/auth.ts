import pool from './db'
import crypto from 'crypto'

interface SessionData {
  token: string
  email: string
  createdAt: number
  expiresAt: number
}

interface OtpData {
  email: string
  code: string
  expiresAt: number
}

async function ensureTablesExist() {
  const query = `
    CREATE TABLE IF NOT EXISTS otps (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL,
      code TEXT NOT NULL,
      expires_at BIGINT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS sessions (
      id SERIAL PRIMARY KEY,
      token TEXT UNIQUE NOT NULL,
      email TEXT NOT NULL,
      created_at BIGINT NOT NULL,
      expires_at BIGINT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_otps_email ON otps(email);
    CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
    CREATE INDEX IF NOT EXISTS idx_sessions_email ON sessions(email);
  `
  try {
    await pool.query(query)
  } catch (error) {
    console.error('Error creating tables:', error)
  }
}

export async function saveOtp(email: string, code: string): Promise<void> {
  await ensureTablesExist()
  
  try {
    const expiresAt = Date.now() + 10 * 60 * 1000 // 10 minutes
    
    // Remove existing OTP for this email
    await pool.query('DELETE FROM otps WHERE email = $1', [email])
    
    // Add new OTP
    await pool.query(
      'INSERT INTO otps (email, code, expires_at) VALUES ($1, $2, $3)',
      [email, code, expiresAt]
    )
  } catch (error) {
    console.error('Error saving OTP:', error)
    throw error
  }
}

export async function verifyOtp(email: string, code: string): Promise<boolean> {
  await ensureTablesExist()
  
  try {
    const result = await pool.query(
      'SELECT * FROM otps WHERE email = $1 AND code = $2',
      [email, code]
    )
    
    if (result.rows.length === 0) return false
    
    const otp = result.rows[0]
    
    // Check expiration
    if (Date.now() > otp.expires_at) {
      await pool.query('DELETE FROM otps WHERE id = $1', [otp.id])
      return false
    }
    
    // Valid OTP - remove it (single use)
    await pool.query('DELETE FROM otps WHERE id = $1', [otp.id])
    
    return true
  } catch (error) {
    console.error('Error verifying OTP:', error)
    return false
  }
}

export async function createSession(email: string): Promise<string> {
  await ensureTablesExist()
  
  try {
    const token = crypto.randomBytes(32).toString('hex')
    const createdAt = Date.now()
    const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
    
    // Remove old sessions for this email
    await pool.query('DELETE FROM sessions WHERE email = $1', [email])
    
    // Add new session
    await pool.query(
      'INSERT INTO sessions (token, email, created_at, expires_at) VALUES ($1, $2, $3, $4)',
      [token, email, createdAt, expiresAt]
    )
    
    return token
  } catch (error) {
    console.error('Error creating session:', error)
    throw error
  }
}

export async function getUserFromToken(token: string): Promise<string | null> {
  await ensureTablesExist()
  
  try {
    const result = await pool.query(
      'SELECT * FROM sessions WHERE token = $1',
      [token]
    )
    
    if (result.rows.length === 0) return null
    
    const session = result.rows[0]
    
    // Check expiration
    if (Date.now() > session.expires_at) {
      await pool.query('DELETE FROM sessions WHERE id = $1', [session.id])
      return null
    }
    
    return session.email
  } catch (error) {
    console.error('Error getting user from token:', error)
    return null
  }
}

export async function validateToken(token: string | null | undefined): Promise<{ isValid: boolean; email: string | null }> {
  if (!token) {
    return { isValid: false, email: null }
  }
  
  const email = await getUserFromToken(token)
  return { isValid: !!email, email }
}
