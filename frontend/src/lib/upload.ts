import sharp from "sharp";
import { uploadToR2, deleteFromR2, urlToKey } from "./r2";

const MAX_PHOTO_SIZE = 5 * 1024 * 1024; // 5 MB input limit
const MAX_CV_SIZE = 5 * 1024 * 1024; // 5 MB

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];
const ALLOWED_CV_TYPES = ["application/pdf"];

type UploadType = "profile-photo" | "banner" | "portfolio" | "cv";

interface UploadResult {
  url: string;
  key: string;
}

/** Validate and resize an image, then upload to R2 */
export async function uploadImage(
  file: File,
  type: UploadType,
  profileId: string,
  extraId?: string,
): Promise<UploadResult> {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error("Invalid image type. Allowed: JPEG, PNG, WebP, GIF.");
  }
  if (file.size > MAX_PHOTO_SIZE) {
    throw new Error("Image too large. Maximum 5 MB.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  let processed: Buffer;
  let ext: string;

  switch (type) {
    case "profile-photo":
      processed = await sharp(buffer)
        .resize(400, 400, { fit: "cover", position: "centre" })
        .webp({ quality: 85 })
        .toBuffer();
      ext = "webp";
      break;

    case "banner":
      processed = await sharp(buffer)
        .resize(1200, 400, { fit: "cover", position: "centre" })
        .webp({ quality: 85 })
        .toBuffer();
      ext = "webp";
      break;

    case "portfolio":
      processed = await sharp(buffer)
        .resize(1200, undefined, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: 85 })
        .toBuffer();
      ext = "webp";
      break;

    default:
      throw new Error(`Unknown image upload type: ${type}`);
  }

  const timestamp = Date.now();
  const key = buildKey(type, profileId, `${timestamp}.${ext}`, extraId);

  const url = await uploadToR2(key, processed, `image/${ext}`);
  return { url, key };
}

/** Upload a CV PDF to R2 (no processing) */
export async function uploadCV(
  file: File,
  profileId: string,
): Promise<UploadResult> {
  if (!ALLOWED_CV_TYPES.includes(file.type)) {
    throw new Error("Invalid file type. Only PDF is allowed for CVs.");
  }
  if (file.size > MAX_CV_SIZE) {
    throw new Error("File too large. Maximum 5 MB.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const key = `cvs/${profileId}/cv.pdf`;
  const url = await uploadToR2(key, buffer, "application/pdf");
  return { url, key };
}

/** Delete a previous upload if it exists */
export async function deletePreviousUpload(
  currentUrl: string | null | undefined,
): Promise<void> {
  if (!currentUrl) return;
  const key = urlToKey(currentUrl);
  if (key) {
    await deleteFromR2(key);
  }
}

function buildKey(
  type: UploadType,
  profileId: string,
  filename: string,
  extraId?: string,
): string {
  switch (type) {
    case "profile-photo":
      return `profiles/${profileId}/photo-${filename}`;
    case "banner":
      return `profiles/${profileId}/banner-${filename}`;
    case "portfolio":
      return `portfolios/${profileId}/${extraId || "img"}-${filename}`;
    default:
      return `uploads/${profileId}/${filename}`;
  }
}
