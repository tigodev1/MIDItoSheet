import { pgTable, text, serial, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const conversionJobs = pgTable("conversion_jobs", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // 'youtube-to-midi' | 'midi-to-sheet'
  status: text("status").notNull().default('pending'), // 'pending' | 'processing' | 'completed' | 'failed'
  sourceUrl: text("source_url"),
  sourceFileName: text("source_file_name"),
  outputFileName: text("output_file_name"),
  progress: real("progress").default(0),
  settings: text("settings"), // JSON string
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const audioFiles = pgTable("audio_files", {
  id: serial("id").primaryKey(),
  fileName: text("file_name").notNull(),
  originalName: text("original_name").notNull(),
  fileType: text("file_type").notNull(), // 'midi' | 'mp3' | 'wav' | 'sheet'
  fileSize: integer("file_size").notNull(),
  duration: real("duration"),
  metadata: text("metadata"), // JSON string
  createdAt: timestamp("created_at").defaultNow(),
});

export const userSessions = pgTable("user_sessions", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull().unique(),
  lastActivity: timestamp("last_activity").defaultNow(),
  preferences: text("preferences"), // JSON string
});

export const insertConversionJobSchema = createInsertSchema(conversionJobs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAudioFileSchema = createInsertSchema(audioFiles).omit({
  id: true,
  createdAt: true,
});

export const insertUserSessionSchema = createInsertSchema(userSessions).omit({
  id: true,
});

export type ConversionJob = typeof conversionJobs.$inferSelect;
export type InsertConversionJob = z.infer<typeof insertConversionJobSchema>;
export type AudioFile = typeof audioFiles.$inferSelect;
export type InsertAudioFile = z.infer<typeof insertAudioFileSchema>;
export type UserSession = typeof userSessions.$inferSelect;
export type InsertUserSession = z.infer<typeof insertUserSessionSchema>;
