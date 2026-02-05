"use client";

import { useState, useRef } from "react";
import Image from "next/image";

interface Props {
  currentPhotoUrl: string | null;
  currentBannerUrl: string | null;
  profileName: string;
}

export function PhotoUpload({
  currentPhotoUrl,
  currentBannerUrl,
  profileName,
}: Props) {
  const [photoUrl, setPhotoUrl] = useState(currentPhotoUrl);
  const [bannerUrl, setBannerUrl] = useState(currentBannerUrl);
  const [uploading, setUploading] = useState<"photo" | "banner" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const photoInput = useRef<HTMLInputElement>(null);
  const bannerInput = useRef<HTMLInputElement>(null);

  async function handleUpload(type: "profile-photo" | "banner", file: File) {
    setError(null);
    setUploading(type === "profile-photo" ? "photo" : "banner");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Upload failed");
        return;
      }

      if (type === "profile-photo") {
        setPhotoUrl(data.url);
      } else {
        setBannerUrl(data.url);
      }
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(null);
    }
  }

  return (
    <div className="bg-surface rounded-xl border border-border overflow-hidden">
      {/* Banner */}
      <div className="relative h-32 sm:h-40 bg-gradient-to-r from-primary/20 to-primary/5">
        {bannerUrl && (
          <Image
            src={bannerUrl}
            alt="Profile banner"
            fill
            className="object-cover"
          />
        )}
        <button
          type="button"
          onClick={() => bannerInput.current?.click()}
          disabled={uploading !== null}
          className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 bg-background/80 backdrop-blur-sm text-foreground text-xs font-medium rounded-lg hover:bg-background transition-colors disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[16px]">
            {uploading === "banner" ? "hourglass_top" : "add_photo_alternate"}
          </span>
          {uploading === "banner" ? "Uploading..." : "Change Banner"}
        </button>
        <input
          ref={bannerInput}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUpload("banner", file);
            e.target.value = "";
          }}
        />
      </div>

      {/* Photo + info */}
      <div className="px-6 pb-6">
        <div className="flex items-end gap-4 -mt-10">
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-4 border-surface overflow-hidden bg-background-alt flex items-center justify-center">
              {photoUrl ? (
                <Image
                  src={photoUrl}
                  alt={profileName}
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="material-symbols-outlined text-3xl text-muted">
                  person
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => photoInput.current?.click()}
              disabled={uploading !== null}
              className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[14px]">
                {uploading === "photo" ? "hourglass_top" : "edit"}
              </span>
            </button>
            <input
              ref={photoInput}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload("profile-photo", file);
                e.target.value = "";
              }}
            />
          </div>
          <div className="pb-1">
            <p className="text-sm font-semibold text-foreground">
              {profileName}
            </p>
            <p className="text-xs text-muted">
              Click the icons to upload a photo or banner
            </p>
          </div>
        </div>

        {error && (
          <p className="mt-3 text-sm text-error">{error}</p>
        )}
      </div>
    </div>
  );
}
