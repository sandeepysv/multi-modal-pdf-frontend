import { ConvexError, v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { getUserByClerkId } from "./_utils";

export const create = mutation({
  args: {},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized!");
    }

    const currentUser = await getUserByClerkId({
      ctx,
      clerkId: identity.subject,
    });

    if (!currentUser) {
      throw new ConvexError("User not found!");
    }

    const chatId = await ctx.db.insert("chats", {
      userId: currentUser._id,
      title: "New Chat",
    });

    return chatId;
  },
});

export const list = query({
  args: {},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized!");
    }

    const currentUser = await getUserByClerkId({
      ctx,
      clerkId: identity.subject,
    });

    if (!currentUser) {
      throw new ConvexError("User not found!");
    }

    return ctx.db
      .query("chats")
      .withIndex("by_userId", (q) => q.eq("userId", currentUser._id))
      .collect();
  },
});

export const update = internalMutation({
  args: { chatId: v.id("chats"), title: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized!");
    }

    const currentUser = await getUserByClerkId({
      ctx,
      clerkId: identity.subject,
    });

    if (!currentUser) {
      throw new ConvexError("User not found!");
    }

    const chats = await ctx.db
      .query("chats")
      .withIndex("by_userId", (q) => q.eq("userId", currentUser._id));

    if (!chats) {
      throw new ConvexError("Chat not found!");
    }

    await ctx.db.replace(args.chatId, {
      userId: currentUser._id,
      title: args.title,
    });
  },
});
