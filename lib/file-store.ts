import fs from "fs/promises"
import path from "path"

export interface FileMeta {
  id: string
  url: string
  pathname: string
  filename: string
  contentType?: string
  size?: number
  uploadedAt?: string
  category?: string
  ownerId?: string // To associate files with users
}

const FILE_PATH = path.join(process.cwd(), "data", "files.json")

async function readStore(): Promise<FileMeta[]> {
  try {
    const content = await fs.readFile(FILE_PATH, "utf8")
    return JSON.parse(content || "[]") as FileMeta[]
  } catch (err) {
    // If file doesn't exist, return empty array
    return []
  }
}

async function writeStore(files: FileMeta[]) {
  await fs.mkdir(path.dirname(FILE_PATH), { recursive: true })
  await fs.writeFile(FILE_PATH, JSON.stringify(files, null, 2), "utf8")
}

export async function getAllFiles(ownerId?: string): Promise<FileMeta[]> {
  const files = await readStore()
  if (ownerId) {
    return files.filter(f => f.ownerId === ownerId)
  }
  // For public access, you might want to return only public files
  // but for now, we'll assume an admin/full view if no ownerId is given.
  return files
}

export async function addFile(meta: FileMeta): Promise<void> {
  const files = await readStore()
  files.push(meta)
  await writeStore(files)
}

export async function findFileByPath(pathname: string): Promise<FileMeta | undefined> {
  const files = await readStore()
  return files.find((f) => f.pathname === pathname || f.url === pathname)
}

export async function removeFileByPath(pathname: string, ownerId?: string): Promise<void> {
  let files = await readStore()
  const fileToDelete = files.find(f => f.pathname === pathname || f.url === pathname)
  
  if (ownerId && fileToDelete?.ownerId !== ownerId) {
    throw new Error("Unauthorized: You can only delete your own files.")
  }

  files = files.filter((f) => f.pathname !== pathname && f.url !== pathname)
  await writeStore(files)
}

export async function updateFile(pathname: string, changes: Partial<FileMeta>): Promise<void> {
  const files = await readStore()
  const idx = files.findIndex((f) => f.pathname === pathname || f.url === pathname)
  if (idx !== -1) {
    files[idx] = { ...files[idx], ...changes }
    await writeStore(files)
  }
}

export default {
  getAllFiles,
  addFile,
  findFileByPath,
  removeFileByPath,
  updateFile,
}
