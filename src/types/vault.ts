export type RatingTier =
  | '800–1100'
  | '1200–1400'
  | '1400–1600'
  | '1600–1900'
  | '1900–2200'
  | '2200–2600'
  | '2600–3300+';

export type UsacoDivision =
  | 'Bronze'
  | 'Silver'
  | 'Gold'
  | 'Platinum'
  | 'Advanced';

export type MasterDomain =
  | 'Data Structures'
  | 'Search, Greedy & DP'
  | 'Graph & Tree Theory'
  | 'Math, Number Theory & Algebra'
  | 'Strings & Geometry'
  | 'Theoretical & Randomized';

export type LanguageId = 'cpp20' | 'rust' | 'java21' | 'python3' | 'ruby';

export type TopicStatus = 'Full Guide Live' | 'Syllabus Mapped';

export interface SyllabusTopic {
  id: string;
  number: number;
  slug: string;
  title: string;
  domain: MasterDomain;
  ratingTier: RatingTier;
  usacoDivision: UsacoDivision;
  status: TopicStatus;
  summary: string;
  complexity: string;
  prerequisites: string[];
}

export interface LanguageImplementation {
  cpp20: string;
  rust: string;
  java21: string;
  python3: string;
  ruby: string;
}

export interface TraceArrayCell {
  index: number;
  value: number | string;
  label?: string;
  highlight?: 'active' | 'window' | 'updated' | 'neutral';
}

export interface TraceGraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
  state: 'unmatched' | 'even' | 'odd' | 'blossom' | 'matched' | 'active';
  matchWith?: string | null;
}

export interface TraceGraphEdge {
  id: string;
  from: string;
  to: string;
  weight?: number;
  state: 'default' | 'matched' | 'augmenting' | 'blossom-cycle' | 'contracted';
}

export interface TraceStep {
  stepNumber: number;
  title: string;
  explanation: string;
  mode: 'array' | 'graph';
  arrays?: {
    name: string;
    cells: TraceArrayCell[];
  }[];
  graph?: {
    nodes: TraceGraphNode[];
    edges: TraceGraphEdge[];
    blossomRing?: string[];
    calloutMetric?: string;
  };
  variables?: Record<string, string | number>;
}

export interface ReductionClue {
  clue: string;
  translation: string;
}

export interface PitfallItem {
  type: 'WA' | 'TLE' | 'MLE' | 'RE';
  title: string;
  detail: string;
}

export interface PracticeProblem {
  id: string;
  tier: 'Warmup' | 'Standard' | 'Boss';
  ratingRange: string;
  title: string;
  statement: string;
  constraints: string;
  sampleInput: string;
  sampleOutput: string;
  hints: string[];
  solutions: LanguageImplementation;
}

export interface PlatformProblemLink {
  platform:
    | 'CSES'
    | 'AtCoder'
    | 'Codeforces'
    | 'CodeChef'
    | 'HackerRank'
    | 'NeetCode 150';
  title: string;
  difficulty: string;
  url: string;
  patternNote: string;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  detail: string;
}

export interface ProjectBlueprint {
  title: string;
  tagline: string;
  stackSummary: string;
  asciiDiagram: string;
  milestones: ProjectMilestone[];
  starterCode: string;
}

export interface TheoryChapter {
  slug: string;
  topicId: string;
  title: string;
  domain: MasterDomain;
  ratingTier: RatingTier;
  usacoDivision: UsacoDivision;
  subtitle: string;
  analogyTitle: string;
  analogyBody: string;
  prerequisites: { slug: string; title: string }[];
  traceTitle: string;
  traceSubtitle: string;
  allowDynamicGraphEdit?: boolean;
  traceSteps: TraceStep[];
  reductionClues: ReductionClue[];
  timeComplexity: string;
  spaceComplexity: string;
  pitfalls: PitfallItem[];
  implementations: LanguageImplementation;
  practiceProblems: PracticeProblem[];
  platformRadar: PlatformProblemLink[];
  interviewNotes: string[];
  projectBlueprint: ProjectBlueprint;
}

export interface VaultBreakdown {
  slug: string;
  title: string;
  rating: number;
  ratingTier: RatingTier;
  usacoDivision: UsacoDivision;
  domain: MasterDomain;
  sourceTag: string;
  reductionHeadline: string;
  linkedChapters?: {
    number: number;
    slug: string;
    title: string;
  }[];
  keyTraps?: {
    title: string;
    detail: string;
  }[];
  stage1Statement: {
    statement: string;
    constraints: string[];
    sampleInput: string;
    sampleOutput: string;
    sampleExplanation: string;
  };
  stage2NaiveFailure: {
    naiveApproaches: {
      approach: string;
      complexity: string;
      verdict: 'TLE' | 'WA' | 'MLE';
      reason: string;
    }[];
    constraintWhispers: string[];
  };
  stage3AhaReduction: {
    coreInsight: string;
    steps: {
      title: string;
      proofNote: string;
    }[];
  };
  stage4DryRun: {
    intro: string;
    traceSteps: TraceStep[];
  };
  stage5Solutions: {
    timeComplexity: string;
    spaceComplexity: string;
    implementations: LanguageImplementation;
  };
}

export interface MistakeLogEntry {
  id: string;
  problemTitle: string;
  platform: string;
  ratingTier: RatingTier;
  failureType: 'WA' | 'TLE' | 'Misread' | 'Edge Case' | 'Overflow' | 'Implementation';
  rootCause: string;
  preventionRule: string;
  createdAt: string;
}

export interface UserProgressState {
  completedTopics: string[];
  bookmarkedSlugs: string[];
  solvedProblems: string[];
  projectChecklists: Record<string, string[]>;
  mistakeLogs: MistakeLogEntry[];
}

export interface CustomCmsEntry {
  id: string;
  entryType: 'syllabus' | 'theory' | 'vault';
  slug: string;
  title: string;
  ratingTier: RatingTier;
  usacoDivision: UsacoDivision;
  domain: MasterDomain;
  summary: string;
  payload: Partial<SyllabusTopic & TheoryChapter & VaultBreakdown>;
  updatedAt: string;
}

export interface AuthSessionState {
  email: string | null;
  userId: string | null;
  isAdmin: boolean;
  isDemoAdmin: boolean;
  mode: 'supabase' | 'local';
}
