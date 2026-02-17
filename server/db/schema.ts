import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// ============================================
// Users
// ============================================
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role", { enum: ["agent", "supervisor", "admin"] })
    .notNull()
    .default("agent"),
  avatarUrl: text("avatar_url"),
  level: text("level", {
    enum: ["junior", "intermediate", "senior", "expert"],
  })
    .notNull()
    .default("junior"),
  xp: integer("xp").notNull().default(0),
  teamId: integer("team_id"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});

// ============================================
// Scenarios
// ============================================
export const scenarios = sqliteTable("scenarios", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category", {
    enum: [
      "informative",
      "claims",
      "fraud",
      "money_laundering",
      "theft",
      "account_management",
      "loans",
      "cards",
    ],
  }).notNull(),
  difficulty: integer("difficulty").notNull().default(1),
  clientName: text("client_name").notNull(),
  clientGender: text("client_gender", { enum: ["male", "female"] }).notNull(),
  clientPersonality: text("client_personality").notNull(),
  context: text("context").notNull(),
  objectives: text("objectives").notNull(), // JSON array
  expectedProtocol: text("expected_protocol").notNull(), // JSON array
  systemPrompt: text("system_prompt").notNull(),
  estimatedDuration: integer("estimated_duration").notNull().default(10),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});

// ============================================
// Simulations
// ============================================
export const simulations = sqliteTable("simulations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  scenarioId: integer("scenario_id")
    .notNull()
    .references(() => scenarios.id),
  status: text("status", {
    enum: ["in_progress", "completed", "abandoned"],
  })
    .notNull()
    .default("in_progress"),
  score: real("score"),
  startedAt: text("started_at")
    .notNull()
    .default(sql`(datetime('now'))`),
  completedAt: text("completed_at"),
});

// ============================================
// Simulation Messages
// ============================================
export const simulationMessages = sqliteTable("simulation_messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  simulationId: integer("simulation_id")
    .notNull()
    .references(() => simulations.id),
  role: text("role", { enum: ["agent", "client", "system"] }).notNull(),
  content: text("content").notNull(),
  audioUrl: text("audio_url"),
  timestamp: text("timestamp")
    .notNull()
    .default(sql`(datetime('now'))`),
});

// ============================================
// Evaluations
// ============================================
export const evaluations = sqliteTable("evaluations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  simulationId: integer("simulation_id")
    .notNull()
    .references(() => simulations.id),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  empathy: real("empathy").notNull(),
  clarity: real("clarity").notNull(),
  protocol: real("protocol").notNull(),
  problemSolving: real("problem_solving").notNull(),
  trustBuilding: real("trust_building").notNull(),
  overallScore: real("overall_score").notNull(),
  strengths: text("strengths").notNull(), // JSON array
  weaknesses: text("weaknesses").notNull(), // JSON array
  recommendations: text("recommendations").notNull(), // JSON array
  feedback: text("feedback").notNull(),
  evaluatedAt: text("evaluated_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});

// ============================================
// Voice Analyses
// ============================================
export const voiceAnalyses = sqliteTable("voice_analyses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  simulationId: integer("simulation_id")
    .notNull()
    .references(() => simulations.id),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  transcription: text("transcription").notNull(),
  speechSpeed: real("speech_speed").notNull(),
  pauseCount: integer("pause_count").notNull(),
  clarityScore: real("clarity_score").notNull(),
  confidenceScore: real("confidence_score").notNull(),
  empathyScore: real("empathy_score").notNull(),
  professionalismScore: real("professionalism_score").notNull(),
  enthusiasmScore: real("enthusiasm_score").notNull(),
  overallVocalScore: real("overall_vocal_score").notNull(),
  insights: text("insights").notNull(), // JSON array
  analyzedAt: text("analyzed_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});

// ============================================
// Timeline Markers
// ============================================
export const timelineMarkers = sqliteTable("timeline_markers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  simulationId: integer("simulation_id")
    .notNull()
    .references(() => simulations.id),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  timestamp: real("timestamp").notNull(), // seconds
  category: text("category", {
    enum: ["excellent", "good", "needs_improvement", "critical_error"],
  }).notNull(),
  note: text("note").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});

// ============================================
// Badges
// ============================================
export const badges = sqliteTable("badges", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  requirement: text("requirement").notNull(),
  xpReward: integer("xp_reward").notNull().default(100),
});

// ============================================
// User Badges
// ============================================
export const userBadges = sqliteTable("user_badges", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  badgeId: integer("badge_id")
    .notNull()
    .references(() => badges.id),
  unlockedAt: text("unlocked_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});
