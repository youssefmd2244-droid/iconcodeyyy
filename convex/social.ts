import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ═══ Social Accounts ═══

export const listAccounts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("socialAccounts").order("desc").collect();
  },
});

export const addAccount = mutation({
  args: {
    platform: v.string(),
    accountName: v.string(),
    accountId: v.optional(v.string()),
    profileUrl: v.optional(v.string()),
    postsPerDay: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("socialAccounts", {
      platform: args.platform,
      accountName: args.accountName,
      accountId: args.accountId ?? "",
      profileUrl: args.profileUrl ?? "",
      isConnected: true,
      autoPost: true,
      postsPerDay: args.postsPerDay,
      createdAt: Date.now(),
    });
  },
});

export const updateAccount = mutation({
  args: {
    id: v.id("socialAccounts"),
    autoPost: v.optional(v.boolean()),
    postsPerDay: v.optional(v.number()),
    isConnected: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const filtered: Record<string, unknown> = {};
    for (const [k, val] of Object.entries(updates)) {
      if (val !== undefined) filtered[k] = val;
    }
    await ctx.db.patch(id, filtered);
  },
});

export const deleteAccount = mutation({
  args: { id: v.id("socialAccounts") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// ═══ Scheduled Posts ═══

export const listScheduled = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;
    return await ctx.db
      .query("scheduledPosts")
      .order("desc")
      .take(limit);
  },
});

export const createScheduledPost = mutation({
  args: {
    generationId: v.optional(v.id("generations")),
    socialAccountId: v.id("socialAccounts"),
    platform: v.string(),
    caption: v.string(),
    hashtags: v.array(v.string()),
    mediaUrl: v.optional(v.string()),
    mediaType: v.string(),
    scheduledAt: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("scheduledPosts", {
      ...args,
      status: "scheduled",
      createdAt: Date.now(),
    });
  },
});

export const updatePostStatus = mutation({
  args: {
    id: v.id("scheduledPosts"),
    status: v.union(
      v.literal("scheduled"),
      v.literal("posting"),
      v.literal("posted"),
      v.literal("failed"),
    ),
    error: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const updates: Record<string, unknown> = { status: args.status };
    if (args.status === "posted") updates.postedAt = Date.now();
    if (args.error) updates.error = args.error;
    await ctx.db.patch(args.id, updates);
  },
});

export const deleteScheduledPost = mutation({
  args: { id: v.id("scheduledPosts") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const scheduledStats = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("scheduledPosts").collect();
    return {
      total: all.length,
      scheduled: all.filter(p => p.status === "scheduled").length,
      posted: all.filter(p => p.status === "posted").length,
      failed: all.filter(p => p.status === "failed").length,
    };
  },
});

// ═══ Content Plans ═══

export const listPlans = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("contentPlans").order("desc").collect();
  },
});

export const createPlan = mutation({
  args: {
    niche: v.string(),
    style: v.string(),
    platforms: v.array(v.string()),
    videosPerDay: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("contentPlans", {
      ...args,
      isActive: true,
      totalGenerated: 0,
      createdAt: Date.now(),
    });
  },
});

export const updatePlan = mutation({
  args: {
    id: v.id("contentPlans"),
    isActive: v.optional(v.boolean()),
    ideas: v.optional(v.array(v.object({
      title: v.string(),
      prompt: v.string(),
      caption: v.string(),
      hashtags: v.array(v.string()),
      status: v.string(),
    }))),
    totalGenerated: v.optional(v.number()),
    lastRunAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const filtered: Record<string, unknown> = {};
    for (const [k, val] of Object.entries(updates)) {
      if (val !== undefined) filtered[k] = val;
    }
    await ctx.db.patch(id, filtered);
  },
});

export const deletePlan = mutation({
  args: { id: v.id("contentPlans") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
