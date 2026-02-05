import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { uploadImage, uploadCV, deletePreviousUpload } from "@/lib/upload";
import { queryOne } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.R2_ACCOUNT_ID) {
    return NextResponse.json(
      { error: "File storage not configured" },
      { status: 503 },
    );
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const type = formData.get("type") as string | null;
  const projectId = formData.get("projectId") as string | null;

  if (!file || !type) {
    return NextResponse.json(
      { error: "Missing file or type" },
      { status: 400 },
    );
  }

  const validTypes = ["profile-photo", "banner", "portfolio", "cv"];
  if (!validTypes.includes(type)) {
    return NextResponse.json({ error: "Invalid upload type" }, { status: 400 });
  }

  try {
    let result: { url: string; key: string };

    if (type === "cv") {
      result = await uploadCV(file, session.profileId);

      // Update profile with CV URL (no cv_url column in schema yet, skip DB update)
    } else {
      result = await uploadImage(
        file,
        type as "profile-photo" | "banner" | "portfolio",
        session.profileId,
        projectId || undefined,
      );

      // Update the DB with the new URL
      if (type === "profile-photo") {
        // Delete old photo from R2
        const current = await queryOne<{ profile_photo_url: string | null }>(
          "SELECT profile_photo_url FROM developer_profiles WHERE id = $1",
          [session.profileId],
        );
        await deletePreviousUpload(current?.profile_photo_url);

        await queryOne(
          "UPDATE developer_profiles SET profile_photo_url = $1 WHERE id = $2 RETURNING id",
          [result.url, session.profileId],
        );
      } else if (type === "banner") {
        const current = await queryOne<{ banner_image_url: string | null }>(
          "SELECT banner_image_url FROM developer_profiles WHERE id = $1",
          [session.profileId],
        );
        await deletePreviousUpload(current?.banner_image_url);

        await queryOne(
          "UPDATE developer_profiles SET banner_image_url = $1 WHERE id = $2 RETURNING id",
          [result.url, session.profileId],
        );
      }
      // portfolio images are managed separately (linked to portfolio_projects)
    }

    return NextResponse.json({ url: result.url });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
