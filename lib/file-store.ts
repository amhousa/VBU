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
  // Note: visibility/share removed — all uploads return public links
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

export async function getAllFiles(): Promise<FileMeta[]> {
  return readStore()
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

export async function removeFileByPath(pathname: string): Promise<void> {
  let files = await readStore()
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
