import fs from "fs/promises"
import path from "path"

type ScanResult = {
  ok: boolean
  infected?: boolean
  viruses?: string[] | null
  error?: string
  skipped?: boolean
}

/**
 * Try to scan a file using the 'clamscan' npm wrapper (requires ClamAV installed).
 * If the scanner or clamd isn't available this will return { skipped: true }.
 * This is a best-effort, non-blocking wrapper — in production you may want a
 * dedicated scanning worker, or a commercial scanning API.
 */
export async function scanFile(filePath: string): Promise<ScanResult> {
  try {
    // Try dynamic import of node-clam / clamscan wrapper
    // We avoid hard runtime dependency, and return skipped if not available.
    // Preferred package: 'clamscan' (node-clam wrapper). If not installed, skip.
    let NodeClam: any
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      NodeClam = require("clamscan")
    } catch (e) {
      return { ok: true, skipped: true }
    }

    const ClamScan = NodeClam.NodeClam || NodeClam
    const clamscan = await new ClamScan().init({
      remove_infected: false,
      debug_mode: false,
    })

    // clamscan usually exposes is_infected(filePath) returning { is_infected, file, viruses }
    const res = await (clamscan as any).is_infected(filePath)

    if (!res) {
      return { ok: true, skipped: true }
    }

    const infected = !!res.is_infected

    return {
      ok: true,
      infected,
      viruses: res.viruses || null,
    }
  } catch (err: any) {
    return { ok: false, error: String(err?.message || err) }
  }
}

export async function scanBufferToTempAndScan(buffer: ArrayBuffer): Promise<ScanResult> {
  const tmpDir = path.join(process.cwd(), "tmp")
  await fs.mkdir(tmpDir, { recursive: true })
  const tmpFile = path.join(tmpDir, `upload-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`)
  try {
    await fs.writeFile(tmpFile, Buffer.from(buffer))
    const res = await scanFile(tmpFile)
    await fs.unlink(tmpFile).catch(() => {})
    return res
  } catch (err: any) {
    try {
      await fs.unlink(tmpFile).catch(() => {})
    } catch {}
    return { ok: false, error: String(err?.message || err) }
  }
}

export default { scanFile, scanBufferToTempAndScan }
