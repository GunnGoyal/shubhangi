import fs from "node:fs";
import path from "node:path";
import { nanoid } from "nanoid";

const MAGIC: Record<string, number[][]> = {
  "application/pdf": [[0x25, 0x50, 0x44, 0x46]],
};

const MAX_BYTES = 5 * 1024 * 1024;

export type UploadValidation =
  | { ok: true; mime: string }
  | { ok: false; reason: string };

export function validateUploadBuffer(
  buffer: Buffer,
  declaredMime: string,
): UploadValidation {
  if (buffer.length > MAX_BYTES) {
    return { ok: false, reason: "File exceeds maximum size." };
  }
  const signatures = MAGIC[declaredMime];
  if (!signatures) {
    return { ok: false, reason: "File type not permitted." };
  }
  const match = signatures.some((sig) =>
    sig.every((byte, i) => buffer[i] === byte),
  );
  if (!match) {
    return { ok: false, reason: "File content does not match declared type." };
  }
  return { ok: true, mime: declaredMime };
}

/** Store outside public web root (isolated uploads directory). */
export function storeUpload(buffer: Buffer, mime: string): string {
  const base = path.join(process.cwd(), "data", "uploads");
  if (!fs.existsSync(base)) {
    fs.mkdirSync(base, { recursive: true });
  }
  const ext = mime === "application/pdf" ? "pdf" : "bin";
  const filename = `${nanoid()}.${ext}`;
  const full = path.join(base, filename);
  fs.writeFileSync(full, buffer, { mode: 0o600 });
  return filename;
}
