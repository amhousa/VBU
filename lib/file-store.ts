import pool from './db'

export interface FileMeta {
  id: string
  url: string
  pathname: string
  filename: string
  contentType?: string
  size?: number
  uploadedAt?: string
  category?: string
  ownerId?: string
  access?: "public" | "private"
}

async function ensureTableExists() {
  const query = `
    CREATE TABLE IF NOT EXISTS files (
      id TEXT PRIMARY KEY,
      url TEXT NOT NULL,
      pathname TEXT NOT NULL,
      filename TEXT NOT NULL,
      content_type TEXT,
      size BIGINT,
      uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      category TEXT,
      owner_id TEXT,
      access TEXT DEFAULT 'public'
    );
    CREATE INDEX IF NOT EXISTS idx_files_owner_id ON files(owner_id);
    CREATE INDEX IF NOT EXISTS idx_files_access ON files(access);
  `
  await pool.query(query)
}

export async function getAllFiles(ownerId?: string): Promise<FileMeta[]> {
  await ensureTableExists()
  
  let query = 'SELECT * FROM files'
  const params: any[] = []
  
  if (ownerId) {
    query += ' WHERE owner_id = $1'
    params.push(ownerId)
  }
  
  const result = await pool.query(query, params)
  
  return result.rows.map(row => ({
    id: row.id,
    url: row.url,
    pathname: row.pathname,
    filename: row.filename,
    contentType: row.content_type,
    size: row.size,
    uploadedAt: row.uploaded_at?.toISOString(),
    category: row.category,
    ownerId: row.owner_id,
    access: row.access,
  }))
}

export async function addFile(meta: FileMeta): Promise<void> {
  await ensureTableExists()
  
  const query = `
    INSERT INTO files (id, url, pathname, filename, content_type, size, uploaded_at, category, owner_id, access)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
  `
  const params = [
    meta.id,
    meta.url,
    meta.pathname,
    meta.filename,
    meta.contentType,
    meta.size,
    meta.uploadedAt ? new Date(meta.uploadedAt) : new Date(),
    meta.category,
    meta.ownerId,
    meta.access,
  ]
  
  await pool.query(query, params)
}

export async function findFileByPath(pathname: string): Promise<FileMeta | undefined> {
  await ensureTableExists()
  
  const query = 'SELECT * FROM files WHERE pathname = $1 OR url = $1'
  const result = await pool.query(query, [pathname])
  
  if (result.rows.length === 0) return undefined
  
  const row = result.rows[0]
  return {
    id: row.id,
    url: row.url,
    pathname: row.pathname,
    filename: row.filename,
    contentType: row.content_type,
    size: row.size,
    uploadedAt: row.uploaded_at?.toISOString(),
    category: row.category,
    ownerId: row.owner_id,
    access: row.access,
  }
}

export async function removeFileByPath(pathname: string, ownerId?: string): Promise<void> {
  await ensureTableExists()
  
  let query = 'DELETE FROM files WHERE pathname = $1 OR url = $1'
  const params: any[] = [pathname]
  
  if (ownerId) {
    query += ' AND owner_id = $2'
    params.push(ownerId)
  }
  
  await pool.query(query, params)
}

export async function updateFile(pathname: string, changes: Partial<FileMeta>): Promise<void> {
  await ensureTableExists()
  
  const fields = []
  const params: any[] = []
  let paramIndex = 1
  
  if (changes.url !== undefined) {
    fields.push(`url = $${paramIndex++}`)
    params.push(changes.url)
  }
  if (changes.pathname !== undefined) {
    fields.push(`pathname = $${paramIndex++}`)
    params.push(changes.pathname)
  }
  if (changes.filename !== undefined) {
    fields.push(`filename = $${paramIndex++}`)
    params.push(changes.filename)
  }
  if (changes.contentType !== undefined) {
    fields.push(`content_type = $${paramIndex++}`)
    params.push(changes.contentType)
  }
  if (changes.size !== undefined) {
    fields.push(`size = $${paramIndex++}`)
    params.push(changes.size)
  }
  if (changes.uploadedAt !== undefined) {
    fields.push(`uploaded_at = $${paramIndex++}`)
    params.push(new Date(changes.uploadedAt))
  }
  if (changes.category !== undefined) {
    fields.push(`category = $${paramIndex++}`)
    params.push(changes.category)
  }
  if (changes.ownerId !== undefined) {
    fields.push(`owner_id = $${paramIndex++}`)
    params.push(changes.ownerId)
  }
  if (changes.access !== undefined) {
    fields.push(`access = $${paramIndex++}`)
    params.push(changes.access)
  }
  
  if (fields.length === 0) return
  
  const query = `UPDATE files SET ${fields.join(', ')} WHERE pathname = $${paramIndex} OR url = $${paramIndex}`
  params.push(pathname)
  
  await pool.query(query, params)
}








export default {
  getAllFiles,
  addFile,
  findFileByPath,
  removeFileByPath,
  updateFile,
}
