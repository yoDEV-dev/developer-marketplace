"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

interface Review {
  id: string;
  clientName: string;
  clientCompany?: string;
  clientAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  projectType?: string;
  verified?: boolean;
}

interface ReviewsSectionProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

export function ReviewsSection({ reviews, averageRating, totalReviews }: ReviewsSectionProps) {
  const locale = useLocale();
  const t = useTranslations("reviews");
  const tProfile = useTranslations("profile");

  return (
    <section id="reviews" className="scroll-mt-20">
      <div className="bg-surface rounded-2xl border border-border p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">star</span>
            {t("title")}
          </h2>

          {/* Rating Summary */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`material-symbols-outlined text-lg ${
                      star <= Math.round(averageRating)
                        ? "fill text-accent"
                        : "text-border"
                    }`}
                  >
                    star
                  </span>
                ))}
              </div>
              <span className="font-bold text-foreground text-lg">{averageRating.toFixed(1)}</span>
            </div>
            <span className="text-muted text-sm">
              {tProfile("reviews_count", { count: totalReviews })}
            </span>
          </div>
        </div>

        {/* Rating Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 p-4 bg-background-alt rounded-xl">
          {[
            { key: "communication", icon: "chat" },
            { key: "quality", icon: "code" },
            { key: "timeliness", icon: "schedule" },
            { key: "value", icon: "payments" },
          ].map((item) => (
            <div key={item.key} className="text-center">
              <span className="material-symbols-outlined text-muted text-xl mb-1">{item.icon}</span>
              <p className="text-xs text-muted mb-1">{t(item.key as keyof typeof t)}</p>
              <p className="font-bold text-foreground">5.0</p>
            </div>
          ))}
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} locale={locale} />
          ))}
        </div>

        {/* Load More */}
        {totalReviews > reviews.length && (
          <button className="w-full mt-6 py-3 text-primary font-semibold hover:bg-primary/5 rounded-xl transition-colors">
            {tProfile("viewAllReviews", { count: totalReviews })}
          </button>
        )}
      </div>
    </section>
  );
}

function ReviewCard({ review, locale }: { review: Review; locale: string }) {
  const t = useTranslations("reviews");

  const formattedDate = new Date(review.date).toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="border-b border-border last:border-0 pb-6 last:pb-0">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full overflow-hidden bg-background-alt shrink-0">
          {review.clientAvatar ? (
            <Image
              src={review.clientAvatar}
              alt={review.clientName}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="material-symbols-outlined text-muted">person</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-semibold text-foreground">{review.clientName}</span>
            {review.verified && (
              <span className="flex items-center gap-1 text-xs text-accent">
                <span className="material-symbols-outlined text-sm fill">verified</span>
                {t("verified")}
              </span>
            )}
          </div>

          {review.clientCompany && (
            <p className="text-sm text-muted mb-2">{review.clientCompany}</p>
          )}

          {/* Rating & Date */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`material-symbols-outlined text-sm ${
                    star <= review.rating ? "fill text-accent" : "text-border"
                  }`}
                >
                  star
                </span>
              ))}
            </div>
            <span className="text-xs text-muted">{formattedDate}</span>
            {review.projectType && (
              <span className="text-xs text-muted">• {review.projectType}</span>
            )}
          </div>

          {/* Comment */}
          <p className="text-text-secondary leading-relaxed">{review.comment}</p>
        </div>
      </div>
    </div>
  );
}
