import { z } from "zod";

export const basicInfoSchema = z.object({
  displayName: z.string().min(2).max(60),
  headline: z.string().min(5).max(120),
  bio: z.string().max(2000).optional().default(""),
  bioEs: z.string().max(2000).optional().default(""),
  countryCode: z.string().length(2).optional().default(""),
  city: z.string().max(100).optional().default(""),
  timezone: z.string().max(50).optional().default(""),
  yearsExperience: z
    .enum(["0-1", "1-3", "3-5", "5-10", "10-15", "15+", ""])
    .optional()
    .default(""),
  availabilityStatus: z
    .enum(["available", "limited", "booked", "not_taking_work"])
    .default("available"),
  bilingualProfile: z.coerce.boolean().default(false),
});

export const pricingSchema = z.object({
  pricingCurrency: z.string().length(3).default("USD"),
  hourlyRateMin: z.coerce.number().min(0).max(999).optional(),
  hourlyRateMax: z.coerce.number().min(0).max(999).optional(),
  projectBudgetRange: z.string().max(30).optional().default(""),
  freeConsultation: z.coerce.boolean().default(false),
  openToNegotiation: z.coerce.boolean().default(true),
  pricingModels: z
    .array(
      z.enum([
        "hourly",
        "project_based",
        "monthly_retainer",
        "milestone",
        "get_a_quote",
        "equity_rev_share",
      ]),
    )
    .default([]),
  paymentMethods: z
    .array(
      z.enum([
        "bank_transfer",
        "paypal",
        "wise",
        "crypto",
        "payoneer",
        "other",
      ]),
    )
    .default([]),
});

export const workPreferencesSchema = z.object({
  workArrangement: z
    .array(z.enum(["remote", "hybrid", "onsite"]))
    .default([]),
  timeOverlapNote: z.string().max(200).optional().default(""),
  preferredDuration: z
    .array(z.enum(["short", "medium", "long", "any"]))
    .default([]),
  teamPreference: z
    .array(z.enum(["solo", "small", "large", "any"]))
    .default([]),
  openToSubcontracting: z.coerce.boolean().default(false),
  openToBeingSubbed: z.coerce.boolean().default(false),
  ndaWilling: z.coerce.boolean().default(true),
  contractOpenness: z
    .array(z.enum(["freelance", "contract_to_hire", "fulltime"]))
    .default(["freelance"]),
});

export const socialLinksSchema = z.object({
  calendarUrl: z.string().url().or(z.literal("")).optional().default(""),
  websiteUrl: z.string().url().or(z.literal("")).optional().default(""),
  githubUrl: z.string().url().or(z.literal("")).optional().default(""),
  linkedinUrl: z.string().url().or(z.literal("")).optional().default(""),
  stackoverflowUrl: z.string().url().or(z.literal("")).optional().default(""),
  twitterUrl: z.string().url().or(z.literal("")).optional().default(""),
});

export const skillsSchema = z.object({
  skills: z
    .array(
      z.object({
        techTagId: z.string().uuid(),
        skillLevel: z.enum(["primary", "secondary"]),
      }),
    )
    .max(25),
});

export const latamSchema = z.object({
  taxInvoiceType: z.string().max(50).optional().default(""),
  canInvoiceUsd: z.coerce.boolean().default(false),
});

export const inquirySchema = z.object({
  developerId: z.string().uuid(),
  subject: z.string().min(5).max(200),
  description: z.string().min(20).max(5000),
  projectTypeId: z.string().uuid().optional().default(""),
  budgetRange: z.string().max(30).optional().default(""),
  timeline: z.string().max(100).optional().default(""),
});

export const reviewSchema = z.object({
  developerId: z.string().uuid(),
  ratingOverall: z.coerce.number().int().min(1).max(5),
  ratingCommunication: z.coerce.number().int().min(1).max(5).optional(),
  ratingQuality: z.coerce.number().int().min(1).max(5).optional(),
  ratingTimeliness: z.coerce.number().int().min(1).max(5).optional(),
  ratingValue: z.coerce.number().int().min(1).max(5).optional(),
  reviewText: z.string().max(2000).optional().default(""),
  isAnonymous: z.coerce.boolean().default(false),
  inquiryId: z.string().uuid().optional().default(""),
});

export const timeEntrySchema = z.object({
  projectName: z.string().max(150).optional().default(""),
  clientName: z.string().max(100).optional().default(""),
  entryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  hours: z.coerce.number().min(0.01).max(24),
  description: z.string().max(2000).optional().default(""),
  hourlyRate: z.coerce.number().min(0).max(9999).optional(),
  isBillable: z.coerce.boolean().default(true),
});

export type BasicInfoInput = z.infer<typeof basicInfoSchema>;
export type PricingInput = z.infer<typeof pricingSchema>;
export type WorkPreferencesInput = z.infer<typeof workPreferencesSchema>;
export type SocialLinksInput = z.infer<typeof socialLinksSchema>;
export type SkillsInput = z.infer<typeof skillsSchema>;
export type LatamInput = z.infer<typeof latamSchema>;
export type InquiryInput = z.infer<typeof inquirySchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type TimeEntryInput = z.infer<typeof timeEntrySchema>;
