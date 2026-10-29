/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface StudentProfile {
  name: string;
  gradeSection: string;
  school: string;
  dateStarted: string;
}

export interface SimulationTrial {
  id: string;
  trialNumber: number;
  volume: number; // in Liters (L)
  pressure: number; // in Kilopascals (kPa)
  temperature: number; // in Kelvin (K), constant 298 K
  pvProduct: number; // P * V (kPa·L)
  inverseVolume: number; // 1 / V (L⁻¹)
  collisionCount: number; // collisions per second
  notes?: string;
}

export interface MetacognitivePlanning {
  taskDescription: string;
  whyImportant: string;
  mainGoal: string;
  resourcesNeeded: string;
  timeNeeded: string;
  taskDivision: string;
}

export interface MetacognitiveMonitoring {
  understandTask: string;
  makesSense: string;
  reachingGoals: string;
  strategiesWorking: string;
  improvementsNeeded: string;
}

export interface MetacognitiveEvaluating {
  reachedGoal: string;
  strategyWorked: string;
  strategyNotWorked: string;
  doDifferently: string;
}

export interface ReflectiveLog {
  helpfulAspect: string;
  importantDetails: string;
  realLifeApplication: string;
  hardshipsAndSuggestions: string;
  confidenceRating: number; // 1 to 5
}

export interface ArgumentationBoardData {
  guidingQuestion: string;
  claim: string;
  evidence: string;
  reasoning: string;
  rubricEvaluation?: ADIEvaluation;
}

export interface ADIEvaluation {
  overallScore: number; // 1 to 4
  levelLabel: 'Beginning' | 'Developing' | 'Proficient' | 'Exemplary';
  claimScore: number;
  claimFeedback: string;
  evidenceScore: number;
  evidenceFeedback: string;
  reasoningScore: number;
  reasoningFeedback: string;
  detectedMisconceptions: string[];
  actionableTips: string[];
  praise: string;
}

export interface PracticeProblem {
  id: string;
  title: string;
  scenario: string;
  p1: number;
  v1: number;
  p2?: number;
  v2?: number;
  unitP: string;
  unitV: string;
  unknownVar: 'P2' | 'V2' | 'P1' | 'V1';
  correctAnswer: number;
  tolerance: number;
  stepExplanation: string[];
  hint: string;
}

export type TIMADIPhaseId = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface PhaseInfo {
  id: TIMADIPhaseId;
  name: string;
  subtitle: string;
  duration: string;
  iconName: string;
}
