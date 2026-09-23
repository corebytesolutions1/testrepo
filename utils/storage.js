const fs = require("fs");
const path = require("path");

const LOCAL_PDF_DIR = path.join(__dirname, "..", "public", "pdf");
const useCloud = !!process.env.S3_BUCKET;

/**
 * Two storage backends:
 *
 * 1. LOCAL DISK (default) — writes into public/pdf/, served directly by
 *    Express static middleware. Works great on a normal server or your own
 *    machine, where the filesystem is persistent. Does NOT work on Vercel
 *    or other serverless platforms — their filesystem is read-only outside
 *    /tmp, and /tmp is wiped between invocations, so uploaded files vanish.
 *
 * 2. S3-COMPATIBLE CLOUD STORAGE (opt-in) — set S3_BUCKET (+ the other
 *    S3_* vars below) in .env and uploads go to a real bucket instead,
 *    which is what you need for Vercel/serverless deployments. Works with
 *    AWS S3, Cloudflare R2, Backblaze B2, Supabase Storage, or any
 *    S3-compatible provider — just point S3_ENDPOINT at the provider's
 *    endpoint.
 *
 * Required env vars for cloud mode:
 *   S3_BUCKET, S3_REGION, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY
 *   S3_ENDPOINT (optional — omit for real AWS S3, required for
 *     R2/B2/Supabase/etc.)
 *   S3_PUBLIC_URL_BASE (optional — public base URL to prefix filenames with;
 *     REQUIRED for Supabase, since its public URL format doesn't follow the
 *     generic virtual-hosted pattern this file defaults to otherwise)
 *
 * Install the AWS SDK when you enable cloud mode: npm install @aws-sdk/client-s3
 *
 * IMPORTANT — forcePathStyle: every client below sets `forcePathStyle: true`.
 * Without it, the AWS SDK defaults to "virtual-hosted-style" addressing —
 * putting the bucket name in front of the hostname, e.g.
 * `my-bucket.project-ref.supabase.co` — which several S3-compatible
 * providers (Supabase Storage among them) don't support. The client then
 * tries to open a TLS connection to a hostname with no valid certificate,
 * which fails as a generic-looking handshake/SSL error that has nothing
 * obviously to do with "wrong hostname" in the message. forcePathStyle
 * keeps the bucket in the URL path instead (`endpoint/my-bucket/key`),
 * which every provider supports.
 */

function makeClient() {
  const { S3Client } = require("@aws-sdk/client-s3");
  return new S3Client({
    region: process.env.S3_REGION || "auto",
    endpoint: process.env.S3_ENDPOINT || undefined,
    forcePathStyle: true,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
    }
  });
}

function isCloudEnabled() {
  return useCloud;
}

// Builds the public URL from S3_ENDPOINT when S3_PUBLIC_URL_BASE isn't set
// explicitly. This assumes path-style URLs (endpoint/bucket/key), matching
// forcePathStyle above. Works for Backblaze B2, Cloudflare R2, and real AWS
// S3. Does NOT work for Supabase — set S3_PUBLIC_URL_BASE explicitly for
// that provider (see README).
function defaultPublicBase() {
  const bucket = process.env.S3_BUCKET;
  const endpoint = (process.env.S3_ENDPOINT || "https://s3.amazonaws.com").replace(/\/$/, "");
  return `${endpoint}/${bucket}`;
}

async function saveFile(file) {
  const safeName = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;

  if (!useCloud) {
    // multer.diskStorage already wrote the file for us in this mode —
    // this branch only runs if saveFile is called directly with a buffer
    // (e.g. from memoryStorage). Kept simple since local mode is handled
    // by multer's disk storage engine directly in routes/admin.js.
    fs.writeFileSync(path.join(LOCAL_PDF_DIR, safeName), file.buffer);
    return `/pdf/${safeName}`;
  }

  // Lazy-require so the AWS SDK is only needed when cloud mode is actually on.
  const { PutObjectCommand } = require("@aws-sdk/client-s3");
  const client = makeClient();

  await client.send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: safeName,
      Body: file.buffer,
      ContentType: "application/pdf"
    })
  );

  const base = process.env.S3_PUBLIC_URL_BASE || defaultPublicBase();
  return `${base.replace(/\/$/, "")}/${safeName}`;
}

async function deleteFile(fileUrlOrPath) {
  if (!fileUrlOrPath) return;

  if (!useCloud) {
    // Only ever delete files inside public/pdf — never accept an arbitrary path.
    if (!fileUrlOrPath.startsWith("/pdf/")) return;
    const fullPath = path.join(LOCAL_PDF_DIR, path.basename(fileUrlOrPath));
    fs.promises.unlink(fullPath).catch(() => {
      // File already gone or never existed locally (e.g. a seed/demo
      // notice) — not an error worth surfacing to the admin.
    });
    return;
  }

  const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
  const client = makeClient();
  const key = fileUrlOrPath.split("/").pop();
  await client.send(new DeleteObjectCommand({ Bucket: process.env.S3_BUCKET, Key: key }));
}

module.exports = { isCloudEnabled, saveFile, deleteFile, LOCAL_PDF_DIR };
