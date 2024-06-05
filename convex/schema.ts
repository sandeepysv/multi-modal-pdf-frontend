import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    username: v.string(),
    imageUrl: v.string(),
    clerkId: v.string(),
    email: v.string(),
  })
    .index("by_email", ["email"])
    .index("by_clerkId", ["clerkId"]),
  chats: defineTable({
    userId: v.id("users"),
    title: v.string(),
  }).index("by_userId", ["userId"]),
  messages: defineTable({
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    chatId: v.id("chats"),
  }).index("by_chatId", ["chatId"]),
});
