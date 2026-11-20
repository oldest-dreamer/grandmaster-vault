import type { RatingTier } from '../types/vault';

export type TopicMasteryStatus = 'not_started' | 'learning' | 'mastered';

export interface ConstraintDecoderRow {
  constraint: string;
  maxComplexity: string;
  targetParadigms: string;
  warning: string;
}

export const CONSTRAINT_DECODER_ROWS: ConstraintDecoderRow[] = [
  {
    constraint: 'N ≤ 11',
    maxComplexity: 'O(N!) or O(N · 2^N)',
    targetParadigms:
      'Brute-Force Permutations (std::next_permutation), Backtracking with Pruning',
    warning:
      '12! = 4.79 × 10^8 exceeds a 1.0s limit; switch to Bitmask DP at N ≥ 12.',
  },
  {
    constraint: 'N ≤ 20',
    maxComplexity: 'O(2^N) or O(N · 2^N)',
    targetParadigms:
      'Bitmask DP (TSP / Hamiltonian Path), SOS DP (Fast Zeta Transform), Subset Enumeration',
    warning:
      'O(3^N) submask iteration passes up to N ≤ 15 (3^15 = 1.43 × 10^7) but TLEs at N = 20 (3^20 = 3.48 × 10^9).',
  },
  {
    constraint: 'N ≤ 40',
    maxComplexity: 'O(2^(N/2) · N)',
    targetParadigms:
      'Meet-in-the-Middle (Horowitz-Sahni split into two 20-element halves + Two Pointers / Binary Search)',
    warning:
      'Direct O(2^40) ≈ 1.1 × 10^12 TLEs; pseudo-polynomial DP MLEs when weights W ≥ 10^9.',
  },
  {
    constraint: 'N ≤ 500',
    maxComplexity: 'O(N^3)',
    targetParadigms:
      'Floyd-Warshall, Interval DP, Gaussian Elimination, Edmonds’ Blossom Matching, Max-Flow / MCMF',
    warning:
      'O(N^4) = 6.25 × 10^10 TLEs unless optimized via Knuth / Divide & Conquer DP or std::bitset<500> (/64).',
  },
  {
    constraint: 'N ≤ 5,000',
    maxComplexity: 'O(N^2)',
    targetParadigms:
      '2D Classic DP (Knapsack / Edit Distance / Tree Knapsack), O(N^2) Dijkstra, Color Coding FPT',
    warning:
      'O(N^2 log N) ≈ 3.2 × 10^8 is borderline in 1.0s; eliminate the log factor with Monotonic Queues or CHT.',
  },
  {
    constraint: 'N ≤ 2 × 10^5',
    maxComplexity: 'O(N log N) or O(N √N)',
    targetParadigms:
      'Sorting + Two Pointers, Binary Search on Answer, Fenwick / Lazy Segment Tree, HLD, Dijkstra, NTT, SAM',
    warning:
      'Any unpruned O(N^2) nested loop reaches 4 × 10^10 operations and immediately gets TLE.',
  },
  {
    constraint: 'N ≤ 2 × 10^6',
    maxComplexity: 'O(N)',
    targetParadigms:
      'Prefix Sums, Difference Arrays, Monotonic Stack/Deque, 0-1 BFS, KMP / Z-Function / Manacher, Linear Sieve',
    warning:
      'Heavy pointer structures or O(N log^2 N) trees risk TLE/MLE; prefer flat contiguous vectors and fast I/O.',
  },
  {
    constraint: 'N ≤ 10^18',
    maxComplexity: 'O(log N) or O(√N) or O(N^(2/3))',
    targetParadigms:
      'Matrix Exponentiation, Digit DP, Binary Exponentiation, Miller-Rabin & Pollard’s Rho, Du’s Sieve (N ≤ 10^10)',
    warning:
      'Even an O(N) single loop is impossible; state must be compressed logarithmically or algebraically.',
  },
];

export interface RatingTierMetaItem {
  tier: RatingTier;
  usaco: string;
  label: string;
  focus: string;
}

export const RATING_TIER_META: RatingTierMetaItem[] = [
  {
    tier: '800–1100',
    usaco: 'Bronze',
    label: 'Foundations & Invariants',
    focus:
      '1D/2D prefix sums, difference arrays, two pointers, sliding window monotonicity, and prime sieves.',
  },
  {
    tier: '1200–1400',
    usaco: 'Silver',
    label: 'Search, Greedy & Modular Math',
    focus:
      'Coordinate compression, binary search on monotonic predicates, exchange arguments, and CRT.',
  },
  {
    tier: '1400–1600',
    usaco: 'Gold',
    label: 'Core Trees, DP & Shortest Paths',
    focus:
      'Monotonic stacks, DSU, Sparse Table, Fenwick trees, classical DP, Dijkstra, MST, and rolling hashes.',
  },
  {
    tier: '1600–1900',
    usaco: 'Gold → Platinum',
    label: 'Segment Trees, Rerooting & Automata',
    focus:
      'Lazy Segment Trees, Meet-in-the-Middle, Digit DP, Tree Rerooting, LCA, Tarjan 2-SAT, and KMP/Z/Manacher.',
  },
  {
    tier: '1900–2200',
    usaco: 'Platinum',
    label: 'Candidate Master & Advanced Structures',
    focus:
      'Persistent Segment Trees, Mo’s Algorithm, SOS DP, DSU on Tree, HLD, Hopcroft-Karp, XOR Basis, and Aho-Corasick.',
  },
  {
    tier: '2200–2600',
    usaco: 'Advanced',
    label: 'Master & ICPC Regional Reductions',
    focus:
      'Treaps, Li Chao CHT, CDQ, Plug DP, D&C/Knuth DP, Aliens Trick, Centroid Decomp, Dinic/MCMF, FFT/NTT, and SAM.',
  },
  {
    tier: '2600–3300+',
    usaco: 'Advanced',
    label: 'Grandmaster & World Finals',
    focus:
      'Link-Cut Trees, Slope Trick, Dynamic DP, SMAWK, Edmonds’ Blossom, FPS, Du’s Sieve, Matroid Intersection & Simplex.',
  },
];

export type RoadmapTrackId =
  | 'track-1-foundation'
  | 'track-2-gold-core'
  | 'track-3-platinum-cm'
  | 'track-4-master-icpc'
  | 'track-5-grandmaster-wf';

export interface RoadmapTrack {
  id: RoadmapTrackId;
  trackNumber: number;
  title: string;
  subtitle: string;
  ratingRange: '800–1400' | '1400–1800' | '1800–2200' | '2200–2600' | '2600–3300+';
  usacoDivision: string;
  accentColor: 'emerald' | 'sky' | 'violet' | 'amber' | 'rose';
  targetMilestone: string;
  coreSkills: string[];
  topicSlugs: string[];
}

export const ROADMAP_TRACKS: RoadmapTrack[] = [
  {
    id: 'track-1-foundation',
    trackNumber: 1,
    title: 'Track 1 — Foundation & Bronze → Silver',
    subtitle: 'Invariants, Monotonicity, Prefix structures, and Fundamental Graph Traversals',
    ratingRange: '800–1400',
    usacoDivision: 'USACO Bronze → Silver · Codeforces Newbie → Specialist',
    accentColor: 'emerald',
    targetMilestone:
      'Eliminate O(N²) brute-force bottlenecks using prefix differences, two pointers, binary search on answer, and O(V + E) graph traversals.',
    coreSkills: [
      '1D/2D Prefix Sums & Difference Array range updates in O(1)',
      'Monotonic Two-Pointer & Sliding Window invariants in O(N)',
      'Binary Search on monotonic predicates & Greedy exchange proofs',
      'Prime Sieves, Modular Inverse, CRT, and BFS / 0-1 BFS / Toposort',
    ],
    topicSlugs: [
      'prefix-sums-difference-arrays',
      'two-pointers-sliding-window',
      'euclidean-gcd-sieve-factorization',
      'coordinate-compression-offline-sorting',
      'binary-search-on-answer',
      'exchange-arguments-greedy',
      'modular-arithmetic-fermat-crt',
      'bfs-dfs-01bfs-toposort',
    ],
  },
  {
    id: 'track-2-gold-core',
    trackNumber: 2,
    title: 'Track 2 — Gold Core & Div. 2 C/D',
    subtitle: 'Point/Range Trees, Classical DP, Shortest Paths, Tree Rerooting & String Automata',
    ratingRange: '1400–1800',
    usacoDivision: 'USACO Gold · Codeforces Expert (1600–1899)',
    accentColor: 'sky',
    targetMilestone:
      'Master O(N log N) logarithmic data structures (Fenwick, Segment Tree, DSU), state-space DP, LCA/SCC graph reductions, and linear string matching.',
    coreSkills: [
      'Monotonic Stacks, DSU with Rollback, Sparse Table RMQ & Fenwick Binary Lifting',
      'Point/Range Segment Trees, Meet-in-the-Middle (N ≤ 40), Digit DP & Rerooting DP',
      'Dijkstra, MST (Kruskal/Borůvka), Binary Lifting LCA & Tarjan SCC / 2-SAT',
      'Combinatorics, Möbius Inversion, Matrix Exponentiation, Sprague-Grundy & KMP/Z/Manacher',
    ],
    topicSlugs: [
      'monotonic-stack-queue',
      'disjoint-set-union-rollback',
      'sparse-table-rmq',
      'fenwick-tree-binary-lifting',
      'knapsack-lis-classic-dp',
      'dijkstra-bellman-floyd',
      'mst-kruskal-boruvka',
      'combinatorics-lucas-catalan',
      'polynomial-rolling-hash',
      '2d-vectors-cross-product-orientation',
      'segment-tree-point-range',
      'meet-in-the-middle',
      'digit-dp-automaton',
      'interval-tree-rerooting-dp',
      'lca-binary-lifting-euler-tour',
      'tarjan-scc-2sat-bridges',
      'inclusion-exclusion-mobius',
      'matrix-exponentiation-linear-recurrence',
      'sprague-grundy-combinatorial-games',
      'expected-value-linearity',
      'kmp-z-function-manacher',
    ],
  },
  {
    id: 'track-3-platinum-cm',
    trackNumber: 3,
    title: 'Track 3 — Candidate Master & Platinum',
    subtitle: 'Lazy & Persistent Trees, HLD, Bitmask/SOS DP, Hopcroft-Karp & GF(2) XOR Basis',
    ratingRange: '1800–2200',
    usacoDivision: 'USACO Platinum · Codeforces Candidate Master (1900–2199)',
    accentColor: 'violet',
    targetMilestone:
      'Conquer tree path queries, persistent historical state versions, O(3^N / N·2^N) subset convolutions, and multi-pattern automata.',
    coreSkills: [
      'Lazy Propagation Segment Trees, Persistent Segment Trees & Mo’s Algorithm (Hilbert Order)',
      'Bitmask DP, SOS DP (Zeta Transform), DSU on Tree (Small-to-Large) & Heavy-Light Decomposition',
      'Hopcroft-Karp Bipartite Matching, Hierholzer Eulerian Paths & GF(2) XOR Basis',
      'Aho-Corasick Automaton, 2D Convex Hulls, Line Sweep & Heavy/Light Sqrt Splitting',
    ],
    topicSlugs: [
      'interactive-adaptive-adversary',
      'lazy-propagation-segment-tree',
      'persistent-segment-tree',
      'sqrt-decomposition-mo-algorithm',
      'bitmask-dp-sos',
      'eulerian-path-hierholzer',
      'small-to-large-dsu-on-tree',
      'heavy-light-decomposition',
      'bipartite-matching-hopcroft-karp',
      'xor-basis-gaussian-elimination',
      'trie-aho-corasick-automaton',
      'convex-hull-andrew-monotone',
      'line-sweep-closest-pair-delaunay',
      'randomized-hashing-xor-fingerprints',
      'heavy-light-sqrt-threshold-splitting',
    ],
  },
  {
    id: 'track-4-master-icpc',
    trackNumber: 4,
    title: 'Track 4 — Master & ICPC Regionals',
    subtitle: 'DP Optimizations (CHT, D&C, Aliens), Network Flows, FFT/NTT & Suffix Structures',
    ratingRange: '2200–2600',
    usacoDivision: 'Codeforces Master / International Master · ICPC Regional Medalist',
    accentColor: 'amber',
    targetMilestone:
      'Collapse quadratic DP transitions via convexity/Monge properties, model min-cut/MCMF networks, and apply algebraic convolutions and Suffix Automata.',
    coreSkills: [
      'Implicit Treaps, Li Chao Tree (CHT), CDQ Divide & Conquer & Wavelet Trees',
      'Broken Profile (Plug) DP, D&C / Knuth DP Optimization & Aliens Trick (WQS Binary Search)',
      'Centroid Decomposition, Dinic Max-Flow / Min-Cut & Min-Cost Max-Flow / Hungarian',
      'Pollard’s Rho, FFT/NTT Convolution, Berlekamp-Massey, Burnside, Suffix Array/SAM & Minkowski Sums',
    ],
    topicSlugs: [
      'treap-implicit-rope',
      'li-chao-tree-convex-hull-trick',
      'cdq-divide-conquer-offline',
      'merge-sort-wavelet-tree',
      'broken-profile-plug-dp',
      'divide-conquer-knuth-dp',
      'aliens-trick-wqs-binary-search',
      'centroid-decomposition',
      'max-flow-dinic-min-cut',
      'min-cost-max-flow-hungarian',
      'miller-rabin-pollard-rho',
      'fft-ntt-polynomial-convolution',
      'lagrange-interpolation-berlekamp-massey',
      'burnside-polya-counting',
      'suffix-array-lcp-kasai',
      'suffix-automaton-sam',
      'half-plane-intersection-minkowski',
      'color-coding-random-bipartition',
      'simulated-annealing-local-search',
      'hall-marriage-dilworth-combinatorial',
    ],
  },
  {
    id: 'track-5-grandmaster-wf',
    trackNumber: 5,
    title: 'Track 5 — Grandmaster & World Finals',
    subtitle: 'Link-Cut Trees, Slope Trick, Dynamic DP, Blossom, FPS, Matroids & LP Duality',
    ratingRange: '2600–3300+',
    usacoDivision: 'Codeforces Grandmaster / LGM · ICPC World Finals & IOI Gold',
    accentColor: 'rose',
    targetMilestone:
      'Execute World-Finals-tier data structures and algebraic reductions: dynamic forests, general graph matching, formal power series Newton iteration, and matroid intersection.',
    coreSkills: [
      'Link-Cut Trees, Slope Trick Convex DP, Dynamic DP (Matrix SegTree) & SMAWK Monotone Minima',
      'Edmonds’ Blossom General Matching, Lengauer-Tarjan Dominator Trees, Gomory-Hu & Chu-Liu Directed MST',
      'Formal Power Series (exp/ln/sqrt), Dirichlet / Du’s Sieve, Matrix-Tree / Pfaffian & Lyndon Runs',
      '3D Convex Hull / Voronoi, Matroid Intersection, Simplex LP Duality & Amortized Potential / SWAG',
    ],
    topicSlugs: [
      'link-cut-tree',
      'slope-trick-convex-dp',
      'dynamic-dp-matrix-segtree',
      'smawk-monotone-minima',
      'general-graph-matching-blossom',
      'dominator-tree-lengauer-tarjan',
      'gomory-hu-stoer-wagner',
      'directed-mst-chu-liu-edmonds',
      'formal-power-series-generating-functions',
      'dirichlet-convolution-du-sieve',
      'matrix-tree-kirchhoff-pfaffian',
      'lyndon-duval-runs',
      '3d-convex-hull-voronoi',
      'matroid-intersection',
      'lp-duality-simplex-method',
      'online-offline-amortized-potential',
    ],
  },
];
