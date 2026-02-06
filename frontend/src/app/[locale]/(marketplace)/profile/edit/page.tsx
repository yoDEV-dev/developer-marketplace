import { TopBar } from "@/components/layout/TopBar";
import { requireSession } from "@/lib/session";
import {
  getEditableProfile,
  getProfileSkills,
  getProfileAiTools,
  getProfilePricingModels,
  getProfilePaymentMethods,
} from "@/repositories/profile";
import { getTechTags, getCountries, getCurrencies, getAiTools } from "@/repositories/lookups";
import { BasicInfoForm } from "@/components/profile/edit/BasicInfoForm";
import { PricingForm } from "@/components/profile/edit/PricingForm";
import { WorkPreferencesForm } from "@/components/profile/edit/WorkPreferencesForm";
import { SocialLinksForm } from "@/components/profile/edit/SocialLinksForm";
import { SkillsForm } from "@/components/profile/edit/SkillsForm";
import { AiToolsForm } from "@/components/profile/edit/AiToolsForm";
import { PublishToggle } from "@/components/profile/edit/PublishToggle";
import { PhotoUpload } from "@/components/profile/edit/PhotoUpload";

export default async function ProfileEditPage() {
  const session = await requireSession();

  // If no DB, show placeholder
  if (!process.env.DATABASE_URL) {
    return (
      <>
        <TopBar showSearch={false} />
        <div className="p-6">
          <div className="max-w-3xl mx-auto bg-surface rounded-xl border border-border p-8 text-center">
            <span className="material-symbols-outlined text-5xl text-muted mb-4">
              database
            </span>
            <h2 className="text-xl font-bold text-foreground mb-2">
              Database not connected
            </h2>
            <p className="text-muted">
              Connect a PostgreSQL database to edit your profile.
            </p>
          </div>
        </div>
      </>
    );
  }

  const [profile, skills, profileAiTools, pricingModels, paymentMethods, techTags, countries, currencies, allAiTools] =
    await Promise.all([
      getEditableProfile(session.profileId),
      getProfileSkills(session.profileId),
      getProfileAiTools(session.profileId),
      getProfilePricingModels(session.profileId),
      getProfilePaymentMethods(session.profileId),
      getTechTags(),
      getCountries(),
      getCurrencies(),
      getAiTools(),
    ]);

  if (!profile) {
    return (
      <>
        <TopBar showSearch={false} />
        <div className="p-6 text-center text-muted">Profile not found.</div>
      </>
    );
  }

  return (
    <>
      <TopBar showSearch={false} />

      <div className="p-4 lg:p-6 max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Edit Profile</h1>
            <p className="text-muted text-sm mt-1">
              Profile completion: {profile.profile_completion_pct}%
            </p>
          </div>
          <PublishToggle isPublished={profile.is_published} />
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: `${profile.profile_completion_pct}%` }}
          />
        </div>

        {/* Photo & Banner */}
        <PhotoUpload
          currentPhotoUrl={profile.profile_photo_url}
          currentBannerUrl={profile.banner_image_url}
          profileName={profile.display_name}
        />

        {/* Basic Info */}
        <BasicInfoForm
          profile={profile}
          countries={countries}
        />

        {/* Skills */}
        <SkillsForm
          currentSkills={skills}
          techTags={techTags}
        />

        {/* AI Tools */}
        <AiToolsForm
          currentAiTools={profileAiTools}
          aiTools={allAiTools}
        />

        {/* Pricing */}
        <PricingForm
          profile={profile}
          currencies={currencies}
          currentPricingModels={pricingModels}
          currentPaymentMethods={paymentMethods}
        />

        {/* Work Preferences */}
        <WorkPreferencesForm profile={profile} />

        {/* Social Links */}
        <SocialLinksForm profile={profile} />
      </div>
    </>
  );
}
