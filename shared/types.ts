// ============================================
// Kaitel Training Platform - Shared Types
// ============================================

export type UserRole = "agent" | "supervisor" | "admin";

export type SimulationDifficulty = 1 | 2 | 3 | 4 | 5;

export type ScenarioCategory =
  | "informative"
  | "claims"
  | "fraud"
  | "money_laundering"
  | "theft"
  | "account_management"
  | "loans"
  | "cards";

export type MarkerCategory =
  | "excellent"
  | "good"
  | "needs_improvement"
  | "critical_error";

export type AgentLevel = "junior" | "intermediate" | "senior" | "expert";

export type ClientGender = "male" | "female";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  level: AgentLevel;
  xp: number;
  createdAt: string;
}

export interface Scenario {
  id: number;
  title: string;
  description: string;
  category: ScenarioCategory;
  difficulty: SimulationDifficulty;
  clientName: string;
  clientGender: ClientGender;
  clientPersonality: string;
  context: string;
  objectives: string[];
  expectedProtocol: string[];
  estimatedDuration: number; // minutes
}

export interface Simulation {
  id: number;
  userId: number;
  scenarioId: number;
  status: "in_progress" | "completed" | "abandoned";
  startedAt: string;
  completedAt?: string;
  score?: number;
  messages: SimulationMessage[];
}

export interface SimulationMessage {
  id: number;
  role: "agent" | "client" | "system";
  content: string;
  audioUrl?: string;
  timestamp: string;
}

export interface Evaluation {
  id: number;
  simulationId: number;
  userId: number;
  empathy: number;
  clarity: number;
  protocol: number;
  problemSolving: number;
  trustBuilding: number;
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  feedback: string;
  evaluatedAt: string;
}

export interface VoiceAnalysis {
  id: number;
  simulationId: number;
  userId: number;
  transcription: string;
  speechSpeed: number;
  pauseCount: number;
  clarityScore: number;
  confidenceScore: number;
  empathyScore: number;
  professionalismScore: number;
  enthusiasmScore: number;
  overallVocalScore: number;
  insights: string[];
  analyzedAt: string;
}

export interface TimelineMarker {
  id: number;
  simulationId: number;
  userId: number;
  timestamp: number; // seconds into recording
  category: MarkerCategory;
  note: string;
  createdAt: string;
}

export interface Badge {
  id: number;
  name: string;
  description: string;
  icon: string;
  requirement: string;
  xpReward: number;
}

export interface UserBadge {
  id: number;
  userId: number;
  badgeId: number;
  unlockedAt: string;
  badge: Badge;
}

export interface AgentProgress {
  userId: number;
  level: AgentLevel;
  xp: number;
  xpToNextLevel: number;
  totalSimulations: number;
  completedSimulations: number;
  averageScore: number;
  badges: UserBadge[];
  recentEvaluations: Evaluation[];
  strengths: string[];
  weaknesses: string[];
}

export interface DashboardStats {
  totalSimulations: number;
  completedSimulations: number;
  averageScore: number;
  averageEmpathy: number;
  averageClarity: number;
  averageProtocol: number;
  averageProblemSolving: number;
  averageTrustBuilding: number;
  recentSimulations: Simulation[];
  scoreHistory: { date: string; score: number }[];
  categoryPerformance: { category: ScenarioCategory; avgScore: number; count: number }[];
}

export interface SupervisorDashboard {
  teamMembers: (User & { lastActivity: string; avgScore: number })[];
  teamAverageScore: number;
  totalSimulationsThisWeek: number;
  topPerformers: { user: User; score: number }[];
  needsAttention: { user: User; reason: string }[];
  categoryBreakdown: { category: ScenarioCategory; avgScore: number }[];
}

// Level thresholds
export const LEVEL_THRESHOLDS: Record<AgentLevel, { minXp: number; maxXp: number }> = {
  junior: { minXp: 0, maxXp: 999 },
  intermediate: { minXp: 1000, maxXp: 2999 },
  senior: { minXp: 3000, maxXp: 5999 },
  expert: { minXp: 6000, maxXp: Infinity },
};

export const MARKER_COLORS: Record<MarkerCategory, string> = {
  excellent: "#00D084",
  good: "#3B82F6",
  needs_improvement: "#F59E0B",
  critical_error: "#EF4444",
};

export const CATEGORY_LABELS: Record<ScenarioCategory, string> = {
  informative: "Consulta Informativa",
  claims: "Reclamos",
  fraud: "Fraude",
  money_laundering: "Lavado de Activos",
  theft: "Robo",
  account_management: "Gestión de Cuenta",
  loans: "Préstamos",
  cards: "Tarjetas",
};

export const DIFFICULTY_LABELS: Record<SimulationDifficulty, string> = {
  1: "Básico",
  2: "Intermedio",
  3: "Avanzado",
  4: "Experto",
  5: "Maestro",
};

export const LEVEL_LABELS: Record<AgentLevel, string> = {
  junior: "Junior",
  intermediate: "Intermedio",
  senior: "Senior",
  expert: "Experto",
};
