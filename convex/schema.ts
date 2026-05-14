import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,

  // AI generation jobs
  generations: defineTable({
    prompt: v.string(),
    type: v.union(
      v.literal("text-to-image"),
      v.literal("text-to-video"),
      v.literal("image-upscale"),
      v.literal("style-transfer"),
    ),
    model: v.optional(v.string()),
    duration: v.optional(v.number()),
    style: v.optional(v.string()),
    aspectRatio: v.optional(v.string()),
    inputImageStorageId: v.optional(v.id("_storage")),
    inputImageUrl: v.optional(v.string()),
    status: v.union(
      v.literal("queued"),
      v.literal("generating"),
      v.literal("done"),
      v.literal("failed"),
    ),
    resultUrl: v.optional(v.string()),
    resultStorageId: v.optional(v.id("_storage")),
    error: v.optional(v.string()),
    createdAt: v.number(),
    completedAt: v.optional(v.number()),
    // Auto-content fields
    aiCaption: v.optional(v.string()),
    aiHashtags: v.optional(v.array(v.string())),
    aiTitle: v.optional(v.string()),
    niche: v.optional(v.string()),
    retryCount: v.optional(v.number()),
  }).index("by_status", ["status"])
    .index("by_createdAt", ["createdAt"]),

  // Social media accounts
  socialAccounts: defineTable({
    platform: v.string(), // facebook, instagram, youtube, tiktok, x, snapchat, kwai, whatsapp, telegram
    accountName: v.string(),
    accountId: v.optional(v.string()),
    profileUrl: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    isConnected: v.boolean(),
    autoPost: v.boolean(),
    postsPerDay: v.number(),
    bestPostingTimes: v.optional(v.array(v.string())),
    createdAt: v.number(),
    lastPostedAt: v.optional(v.number()),
  }).index("by_platform", ["platform"])
    .index("by_createdAt", ["createdAt"]),

  // Scheduled posts queue
  scheduledPosts: defineTable({
    generationId: v.optional(v.id("generations")),
    socialAccountId: v.id("socialAccounts"),
    platform: v.string(),
    caption: v.string(),
    hashtags: v.array(v.string()),
    mediaUrl: v.optional(v.string()),
    mediaType: v.string(), // "image" or "video"
    scheduledAt: v.number(),
    status: v.union(
      v.literal("scheduled"),
      v.literal("posting"),
      v.literal("posted"),
      v.literal("failed"),
    ),
    postedAt: v.optional(v.number()),
    error: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_status", ["status"])
    .index("by_scheduledAt", ["scheduledAt"])
    .index("by_socialAccountId", ["socialAccountId"]),

  // Content plans (auto-content generation)
  contentPlans: defineTable({
    niche: v.string(),
    style: v.string(),
    platforms: v.array(v.string()),
    videosPerDay: v.number(),
    isActive: v.boolean(),
    totalGenerated: v.number(),
    ideas: v.optional(v.array(v.object({
      title: v.string(),
      prompt: v.string(),
      caption: v.string(),
      hashtags: v.array(v.string()),
      status: v.string(),
    }))),
    createdAt: v.number(),
    lastRunAt: v.optional(v.number()),
  }).index("by_isActive", ["isActive"])
    .index("by_createdAt", ["createdAt"]),
});

export default schema;
