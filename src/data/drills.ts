export type DrillRatingTier =
  | '800–1400'
  | '1400–1800'
  | '1800–2200'
  | '2200–2600'
  | '2600–3300+';

export interface DrillFailureExplanation {
  optionIndex: number;
  optionLabel: string;
  failureVerdict: 'TLE' | 'WA' | 'MLE';
  reason: string;
}

export interface DrillScenario {
  id: string;
  number: number;
  title: string;
  ratingTier: DrillRatingTier;
  domain: string;
  problemSummary: string;
  constraints: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  targetComplexity: string;
  whyCorrect: string;
  whyOthersFail: [
    DrillFailureExplanation,
    DrillFailureExplanation,
    DrillFailureExplanation,
  ];
  linkedChapterSlug: string;
  linkedChapterTitle: string;
}

export const DRILL_SCENARIOS: DrillScenario[] = [
  // =========================================================================
  // TIER 1: 800–1400 (Foundation & Bronze -> Silver) — Scenarios 01 to 06
  // =========================================================================
  {
    id: 'drill-01',
    number: 1,
    title: 'Subgrid Thermal Blanket Updates',
    ratingTier: '800–1400',
    domain: 'Foundations & Arrays',
    problemSummary:
      'You are given an R × C server floor grid initially filled with zeros. First, you receive U offline rectangular heating operations, each adding +Δ temperature to all cells inside subrectangle (r1, c1) .. (r2, c2). After all U updates finish, you must answer Q static queries asking for the total sum of temperatures inside an arbitrary rectangular region (qr1, qc1) .. (qr2, qc2).',
    constraints:
      '1 ≤ R, C ≤ 2,000 · 1 ≤ U, Q ≤ 2 × 10^5 · |Δ| ≤ 10^4 · Time Limit: 1.5s',
    options: [
      '2D Difference Array for O(1) updates + 2D Prefix Sums for O(1) queries',
      '2D Segment Tree with Lazy Propagation over R × C',
      '1D Fenwick Tree per row (R separate BITs of length C)',
      'Brute-force loop over subrectangles for each update and query',
    ],
    correctIndex: 0,
    targetComplexity: 'O(R·C + U + Q)',
    whyCorrect:
      'Because all U updates are given offline before any of the Q queries, each rectangular update only touches 4 corner markers in a 2D Difference Array in O(1) time. Running two passes of 2D Prefix Sums in O(R·C) reconstructs the final array and its prefix sums, answering each query in O(1) via inclusion-exclusion.',
    whyOthersFail: [
      {
        optionIndex: 1,
        optionLabel: '2D Segment Tree with Lazy Propagation over R × C',
        failureVerdict: 'MLE',
        reason:
          '2D Lazy Segment Trees do not support general 2D range-add + 2D range-sum without O(4·R × 4·C) = 6.4 × 10^7 nodes (~512 MB) and O(U log R log C) overhead.',
      },
      {
        optionIndex: 2,
        optionLabel: '1D Fenwick Tree per row (R separate BITs of length C)',
        failureVerdict: 'TLE',
        reason:
          'Updating R rows per update takes O(U · R log C) ≈ 2×10^5 × 2000 × 11 ≈ 4.4 × 10^9 operations, far exceeding the 1.5s limit.',
      },
      {
        optionIndex: 3,
        optionLabel:
          'Brute-force loop over subrectangles for each update and query',
        failureVerdict: 'TLE',
        reason:
          'Each update/query touches up to R·C = 4 × 10^6 cells, requiring O((U + Q) · R · C) ≈ 1.6 × 10^12 operations.',
      },
    ],
    linkedChapterSlug: 'prefix-sums-difference-arrays',
    linkedChapterTitle: '1D/2D Prefix Sums & Difference Arrays',
  },
  {
    id: 'drill-02',
    number: 2,
    title: 'Longest K-Unique Frequency Stream',
    ratingTier: '800–1400',
    domain: 'Sorting, Searching & Greedy',
    problemSummary:
      'Given an array A of N positive integers representing packet channel IDs, find the maximum length of a contiguous subarray A[L..R] that contains at most K distinct channel IDs. All elements are positive integers and the validity condition is monotonic with respect to shrinking the window.',
    constraints:
      '1 ≤ K ≤ N ≤ 5 × 10^5 · 1 ≤ A[i] ≤ 5 × 10^5 · Time Limit: 1.0s',
    options: [
      'Binary Search on subarray length L with a fresh hash map check',
      'Two-Pointer Sliding Window with a direct array frequency table and distinct counter',
      'Dynamic Programming dp[i][k] storing max length ending at i with k distinct values',
      'Divide and Conquer splitting at the midpoint and merging frequency maps',
    ],
    correctIndex: 1,
    targetComplexity: 'O(N) Time, O(max A_i) Space',
    whyCorrect:
      'The number of distinct elements in A[L..R] is monotonically non-decreasing as R grows and monotonically non-increasing as L advances. A single-pass Two-Pointer window with a flat frequency array freq[A[i]] advances L and R at most N times each, achieving strict O(N) time with zero hashing overhead.',
    whyOthersFail: [
      {
        optionIndex: 0,
        optionLabel:
          'Binary Search on subarray length L with a fresh hash map check',
        failureVerdict: 'TLE',
        reason:
          'Binary search adds an unnecessary log N factor (19 passes), and using std::unordered_map inside the check risks O(N log N) or hash-collision TLE within 1.0s.',
      },
      {
        optionIndex: 2,
        optionLabel:
          'Dynamic Programming dp[i][k] storing max length ending at i with k distinct values',
        failureVerdict: 'MLE',
        reason:
          'An N × K DP table requires 5×10^5 × 5×10^5 = 2.5 × 10^11 states, which immediately triggers MLE and TLE.',
      },
      {
        optionIndex: 3,
        optionLabel:
          'Divide and Conquer splitting at the midpoint and merging frequency maps',
        failureVerdict: 'WA',
        reason:
          'Cross-midpoint windows cannot be merged in O(1) because two halves sharing duplicate elements alter the combined distinct count non-linearly.',
      },
    ],
    linkedChapterSlug: 'two-pointers-sliding-window',
    linkedChapterTitle: 'Two Pointers & Sliding Window Invariants',
  },
  {
    id: 'drill-03',
    number: 3,
    title: 'Minimum Drone Battery Capacity for K Sorties',
    ratingTier: '800–1400',
    domain: 'Sorting, Searching & Greedy',
    problemSummary:
      'N cargo packages stand in a fixed conveyor queue with weights w_1, w_2, ..., w_N. You have K drone flights to ship all packages in their exact queue order; a drone with battery capacity C can carry a contiguous batch of packages whose total weight does not exceed C. Find the minimum integer battery capacity C required to ship all N packages within at most K flights.',
    constraints:
      '1 ≤ K ≤ N ≤ 2 × 10^5 · 1 ≤ w_i ≤ 10^9 · Time Limit: 1.0s',
    options: [
      '0/1 Knapsack DP over total weight sum W = ∑ w_i',
      'Greedy Priority Queue assigning the heaviest package to the lightest flight',
      'Binary Search on Answer C in [max(w_i), ∑w_i] with an O(N) greedy feasibility scan',
      'Interval DP partitioning N elements into K contiguous segments in O(N²K)',
    ],
    correctIndex: 2,
    targetComplexity: 'O(N log(∑ w_i))',
    whyCorrect:
      'The feasibility predicate check(C) — "can we partition A into ≤ K contiguous segments each of sum ≤ C?" — is strictly monotonic in C and computable in O(N) via a greedy left-to-right scan. Binary searching C over [max(w_i), 2×10^14] takes ~48 iterations × 2×10^5 operations ≈ 9.6 × 10^6 operations.',
    whyOthersFail: [
      {
        optionIndex: 0,
        optionLabel: '0/1 Knapsack DP over total weight sum W = ∑ w_i',
        failureVerdict: 'MLE',
        reason:
          'Total weight W reaches 2 × 10^14, making weight-indexed DP arrays impossible to allocate or iterate.',
      },
      {
        optionIndex: 1,
        optionLabel:
          'Greedy Priority Queue assigning the heaviest package to the lightest flight',
        failureVerdict: 'WA',
        reason:
          'Reordering packages violates the contiguous conveyor queue constraint.',
      },
      {
        optionIndex: 3,
        optionLabel:
          'Interval DP partitioning N elements into K contiguous segments in O(N²K)',
        failureVerdict: 'TLE',
        reason:
          'O(N²K) with N, K = 2 × 10^5 requires 8 × 10^15 operations.',
      },
    ],
    linkedChapterSlug: 'binary-search-on-answer',
    linkedChapterTitle: 'Binary Search on Answer & Fractional Programming',
  },
  {
    id: 'drill-04',
    number: 4,
    title: 'Peak Concurrent Laser Beams on a 10¹⁸ Axis',
    ratingTier: '800–1400',
    domain: 'Foundations & Arrays',
    problemSummary:
      'You are given N horizontal laser segments [L_i, R_i] along a 1D coordinate axis where coordinates reach up to 10^18. Each segment i emits power P_i across every integer point x ∈ [L_i, R_i]. Compute the maximum total power accumulated at any single integer coordinate x, and the total count of integer coordinates that receive at least M units of power.',
    constraints:
      '1 ≤ N ≤ 2 × 10^5 · 0 ≤ L_i ≤ R_i ≤ 10^18 · 1 ≤ P_i ≤ 10^9 · Time Limit: 1.5s',
    options: [
      'Coordinate Compression / Event Sweep sorting 2N endpoints (L_i, +P_i) and (R_i + 1, -P_i)',
      'Direct Difference Array diff[0 .. 10^18] of size 10^18',
      'Dynamic Sparse Segment Tree with lazy propagation over [0, 10^18]',
      'Pairwise intersection checks between all N(N-1)/2 pairs of segments',
    ],
    correctIndex: 0,
    targetComplexity: 'O(N log N)',
    whyCorrect:
      'Only 2N distinct coordinates (L_i and R_i + 1) ever change the active power sum. Sorting the 2N events in O(N log N) and sweeping left-to-right maintains the exact running power and multiplies each elementary interval length (coords[k+1] - coords[k]) in O(1).',
    whyOthersFail: [
      {
        optionIndex: 1,
        optionLabel: 'Direct Difference Array diff[0 .. 10^18] of size 10^18',
        failureVerdict: 'MLE',
        reason:
          'Allocating an array of length 10^18 requires 8 Exabytes of RAM.',
      },
      {
        optionIndex: 2,
        optionLabel:
          'Dynamic Sparse Segment Tree with lazy propagation over [0, 10^18]',
        failureVerdict: 'MLE',
        reason:
          'A 60-level dynamic pointer segment tree over 2×10^5 updates allocates ~2.4 × 10^7 nodes and adds a 60× constant factor compared to a flat event sort.',
      },
      {
        optionIndex: 3,
        optionLabel:
          'Pairwise intersection checks between all N(N-1)/2 pairs of segments',
        failureVerdict: 'TLE',
        reason:
          'O(N²) takes 4 × 10^10 operations and still fails to compute the exact count of coordinates with ≥ M multi-way overlap.',
      },
    ],
    linkedChapterSlug: 'coordinate-compression-offline-sorting',
    linkedChapterTitle: 'Coordinate Compression & Offline Query Sorting',
  },
  {
    id: 'drill-05',
    number: 5,
    title: 'Dragon Armor Penetration Ordering',
    ratingTier: '800–1400',
    domain: 'Sorting, Searching & Greedy',
    problemSummary:
      'You must defeat N bosses in some permutation. Boss i requires your current energy to be at least A_i to enter battle, and after the battle your energy changes by B_i (where all B_i < 0, meaning every boss drains |B_i| energy, and you cannot skip any boss). Determine whether there exists an ordering of all N bosses such that your initial energy E never drops below the required threshold A_i before any fight or below 0 after any fight.',
    constraints:
      '1 ≤ N ≤ 2 × 10^5 · 1 ≤ E, A_i, |B_i| ≤ 10^9 · Time Limit: 1.0s',
    options: [
      'Sort bosses by ascending energy drain |B_i| first',
      'Sort bosses by descending entry requirement A_i first',
      'Pairwise Exchange Argument: sort bosses by descending (max(A_i, |B_i|) - |B_i|)',
      'Bitmask DP over the 2^N subsets of defeated bosses',
    ],
    correctIndex: 2,
    targetComplexity: 'O(N log N)',
    whyCorrect:
      'Comparing two adjacent bosses i and j via a local exchange argument shows that fighting i before j requires initial energy ≥ max(effA_i, effA_j + |B_i|), where effA_i = max(A_i, |B_i|). Simplifying this inequality proves i should precede j iff (effA_i - |B_i|) > (effA_j - |B_j|), yielding a total transitive order in O(N log N).',
    whyOthersFail: [
      {
        optionIndex: 0,
        optionLabel: 'Sort bosses by ascending energy drain |B_i| first',
        failureVerdict: 'WA',
        reason:
          'Fails whenever a boss has a tiny drain |B_i| = 1 but requires a huge entry threshold A_i = 100 that must be satisfied while energy is still high.',
      },
      {
        optionIndex: 1,
        optionLabel: 'Sort bosses by descending entry requirement A_i first',
        failureVerdict: 'WA',
        reason:
          'Counterexample: Boss 1 (A=10, drain=9) vs Boss 2 (A=9, drain=1) with E=10. Fighting Boss 1 first leaves 1 energy (< 9), whereas fighting Boss 2 first leaves 9 energy (Still fails if E=10, but with E=11 Boss 2 then Boss 1 succeeds while Boss 1 then Boss 2 leaves 2 < 9).',
      },
      {
        optionIndex: 3,
        optionLabel: 'Bitmask DP over the 2^N subsets of defeated bosses',
        failureVerdict: 'TLE',
        reason:
          '2^(200,000) states is astronomically beyond the 10^8 operation budget.',
      },
    ],
    linkedChapterSlug: 'exchange-arguments-greedy',
    linkedChapterTitle: 'Exchange Arguments & Matroid Greedy Scheduling',
  },
  {
    id: 'drill-06',
    number: 6,
    title: 'Synchronized Planetary Beacon Cycles',
    ratingTier: '800–1400',
    domain: 'Number Theory & Math',
    problemSummary:
      'You are given K planetary beacons. Beacon i flashes at every timestamp t ≥ 0 satisfying t ≡ r_i (mod m_i), where the moduli m_1, m_2, ..., m_K are NOT guaranteed to be pairwise coprime. Find the smallest non-negative timestamp t where all K beacons flash simultaneously, or report -1 if their phases are mutually contradictory.',
    constraints:
      '1 ≤ K ≤ 10^5 · 1 ≤ m_i ≤ 10^9 · lcm(m_1, ..., m_K) ≤ 10^18 · Time Limit: 1.0s',
    options: [
      'Generalized Chinese Remainder Theorem (ExGCD pairwise merging checking (r_2 - r_1) % gcd(m_1, m_2) == 0)',
      'Standard coprime CRT formula using Fermat’s Little Theorem a^(m-2) mod m',
      'Brute-force step by m_1 and test all K congruences',
      'Prime-factorize every m_i by trial division up to m_i in O(K · m_i)',
    ],
    correctIndex: 0,
    targetComplexity: 'O(K log(max m_i))',
    whyCorrect:
      'When moduli are not pairwise coprime, a solution to t ≡ r_1 (mod m_1) and t ≡ r_2 (mod m_2) exists iff r_1 ≡ r_2 (mod g) where g = gcd(m_1, m_2). Extended Euclidean Algorithm (ExGCD) merges each pair into a single congruence modulo lcm(m_1, m_2) in O(log(min(m_1, m_2))) time using __int128_t to prevent overflow.',
    whyOthersFail: [
      {
        optionIndex: 1,
        optionLabel:
          'Standard coprime CRT formula using Fermat’s Little Theorem a^(m-2) mod m',
        failureVerdict: 'WA',
        reason:
          'Fermat’s Little Theorem requires prime moduli, and standard CRT requires gcd(m_i, m_j) = 1; non-coprime moduli have no modular inverse.',
      },
      {
        optionIndex: 2,
        optionLabel: 'Brute-force step by m_1 and test all K congruences',
        failureVerdict: 'TLE',
        reason:
          'When m_1 = 2 and lcm = 10^18, stepping by m_1 requires 5 × 10^17 iterations.',
      },
      {
        optionIndex: 3,
        optionLabel:
          'Prime-factorize every m_i by trial division up to m_i in O(K · m_i)',
        failureVerdict: 'TLE',
        reason:
          'K = 10^5 with m_i = 10^9 would take 10^14 operations; ExGCD merges directly without factorization.',
      },
    ],
    linkedChapterSlug: 'modular-arithmetic-fermat-crt',
    linkedChapterTitle: 'Modular Arithmetic, Fermat & Chinese Remainder Theorem',
  },

  // =========================================================================
  // TIER 2: 1400–1800 (Gold Core & Div. 2 C/D) — Scenarios 07 to 12
  // =========================================================================
  {
    id: 'drill-07',
    number: 7,
    title: 'Grid Teleportation with Free Conveyor Arrows',
    ratingTier: '1400–1800',
    domain: 'Graph Theory',
    problemSummary:
      'An R × C warehouse grid contains a directional conveyor belt arrow (N, S, E, or W) in every cell. Moving from cell (r, c) in the direction of its arrow costs 0 seconds; overriding the conveyor to step into any of the other 3 orthogonal neighbors costs 1 second. Find the minimum seconds required to travel from (1, 1) to (R, C).',
    constraints:
      '1 ≤ R, C ≤ 2,000 (Total vertices V = 4 × 10^6) · Time Limit: 1.5s',
    options: [
      '0-1 BFS using a double-ended deque (push_front for 0-weight edges, push_back for 1-weight edges)',
      'Bellman-Ford Shortest Path relaxing all 4V edges V-1 times',
      'Standard unweighted BFS treating all 4 transitions as cost 1',
      'Floyd-Warshall All-Pairs Shortest Path on V vertices',
    ],
    correctIndex: 0,
    targetComplexity: 'O(R · C)',
    whyCorrect:
      'All edge weights are strictly in {0, 1}. 0-1 BFS maintains the deque invariant that queued distances differ by at most 1 and remain sorted by pushing weight-0 transitions to the front and weight-1 transitions to the back, visiting each of the 4×10^6 cells in strict O(V + E) linear time without a priority queue’s log V overhead.',
    whyOthersFail: [
      {
        optionIndex: 1,
        optionLabel:
          'Bellman-Ford Shortest Path relaxing all 4V edges V-1 times',
        failureVerdict: 'TLE',
        reason:
          'O(V · E) on 4 × 10^6 vertices takes ~6.4 × 10^13 operations.',
      },
      {
        optionIndex: 2,
        optionLabel:
          'Standard unweighted BFS treating all 4 transitions as cost 1',
        failureVerdict: 'WA',
        reason:
          'Unweighted BFS counts total steps rather than 0/1 override cost, failing whenever a longer path of 0-cost conveyor arrows beats a direct 1-cost step.',
      },
      {
        optionIndex: 3,
        optionLabel: 'Floyd-Warshall All-Pairs Shortest Path on V vertices',
        failureVerdict: 'MLE',
        reason:
          'O(V^3) time and O(V^2) space on 4 × 10^6 vertices requires petabytes of memory.',
      },
    ],
    linkedChapterSlug: 'bfs-dfs-01bfs-toposort',
    linkedChapterTitle: 'BFS, DFS, 0-1 BFS & Topological Sort',
  },
  {
    id: 'drill-08',
    number: 8,
    title: 'Sum of Minimums over All Contiguous Subarrays',
    ratingTier: '1400–1800',
    domain: 'Range Queries & Trees',
    problemSummary:
      'You are given an array A of N integers. Compute the sum of min(A[L..R]) over all N(N+1)/2 contiguous subarrays 1 ≤ L ≤ R ≤ N, modulo 10^9 + 7. Duplicate values can occur in A and must be counted without double-counting equal minimums.',
    constraints:
      '1 ≤ N ≤ 10^6 · 1 ≤ A[i] ≤ 10^9 · Time Limit: 1.0s',
    options: [
      'Monotonic Increasing Stack computing previous strictly smaller L_i and next smaller-or-equal R_i',
      'Enumerate all N(N+1)/2 pairs (L, R) and query a Sparse Table in O(1)',
      'Divide and Conquer sorting every subarray independently',
      '2D Dynamic Programming dp[L][R] = min(dp[L][R-1], A[R])',
    ],
    correctIndex: 0,
    targetComplexity: 'O(N)',
    whyCorrect:
      'By Contribution Technique, each element A[i] acts as the unique leftmost minimum for all subarrays starting in (L_i, i] and ending in [i, R_i), where L_i is the nearest index < i with A[L_i] < A[i] and R_i is the nearest index > i with A[R_i] ≤ A[i]. A Monotonic Increasing Stack finds all L_i and R_i in two linear O(N) scans.',
    whyOthersFail: [
      {
        optionIndex: 1,
        optionLabel:
          'Enumerate all N(N+1)/2 pairs (L, R) and query a Sparse Table in O(1)',
        failureVerdict: 'TLE',
        reason:
          'Even with O(1) RMQ queries, iterating over N(N+1)/2 ≈ 5 × 10^11 pairs takes thousands of seconds.',
      },
      {
        optionIndex: 2,
        optionLabel: 'Divide and Conquer sorting every subarray independently',
        failureVerdict: 'TLE',
        reason:
          'There are Θ(N²) subarrays; any per-subarray inspection is Ω(N²).',
      },
      {
        optionIndex: 3,
        optionLabel: '2D Dynamic Programming dp[L][R] = min(dp[L][R-1], A[R])',
        failureVerdict: 'MLE',
        reason:
          'An N × N table for N = 10^6 requires 10^12 integers (~4 TB of RAM).',
      },
    ],
    linkedChapterSlug: 'monotonic-stack-queue',
    linkedChapterTitle: 'Monotonic Stack & Monotonic Queue',
  },
  {
    id: 'drill-09',
    number: 9,
    title: 'Heavy-Vehicle Bridge Weight Threshold Queries',
    ratingTier: '1400–1800',
    domain: 'Range Queries & Trees',
    problemSummary:
      'An undirected road network has N cities and M bridges, where bridge e has weight limit w_e. You are given Q independent queries (u_q, v_q, W_q): determine how many cities are reachable from u_q, and whether v_q is reachable from u_q, using only bridges with weight limit w_e ≥ W_q. There are no online modifications to the graph.',
    constraints:
      '1 ≤ N, M, Q ≤ 2 × 10^5 · 1 ≤ w_e, W_q ≤ 10^9 · Time Limit: 1.5s',
    options: [
      'Run a fresh BFS from u_q filtering edges w_e ≥ W_q for each of the Q queries',
      'Offline Query Sorting by descending W_q + Disjoint Set Union (DSU) inserting edges w_e ≥ W_q',
      'Floyd-Warshall bottleneck paths matrix over all N × N pairs',
      'Adjacency matrix multiplication over the max-min semiring',
    ],
    correctIndex: 1,
    targetComplexity: 'O((M + Q) log M + (M + Q) α(N))',
    whyCorrect:
      'As the weight threshold W_q decreases, the set of usable bridges grows monotonically. Sorting both the M bridges and the Q queries in descending order of weight allows a single two-pointer sweep that unions valid edges into a DSU once each, answering every query in O(α(N)) amortized time.',
    whyOthersFail: [
      {
        optionIndex: 0,
        optionLabel:
          'Run a fresh BFS from u_q filtering edges w_e ≥ W_q for each of the Q queries',
        failureVerdict: 'TLE',
        reason:
          'Q separate BFS traversals take O(Q · (N + M)) ≈ 8 × 10^10 operations.',
      },
      {
        optionIndex: 2,
        optionLabel:
          'Floyd-Warshall bottleneck paths matrix over all N × N pairs',
        failureVerdict: 'MLE',
        reason:
          'N = 2 × 10^5 makes an N × N matrix (4 × 10^10 entries) and O(N^3) time impossible.',
      },
      {
        optionIndex: 3,
        optionLabel:
          'Adjacency matrix multiplication over the max-min semiring',
        failureVerdict: 'TLE',
        reason:
          'Dense O(N^3 log N) matrix exponentiation cannot run for N = 2 × 10^5.',
      },
    ],
    linkedChapterSlug: 'disjoint-set-union-rollback',
    linkedChapterTitle: 'Disjoint Set Union (DSU) & DSU with Rollback',
  },
  {
    id: 'drill-10',
    number: 10,
    title: 'Asteroid Vault Exact Subset Weight',
    ratingTier: '1400–1800',
    domain: 'Sorting, Searching & Greedy',
    problemSummary:
      'You have N = 40 rare titanium ingots with individual masses w_1, w_2, ..., w_40 (where each mass can be up to 10^14 grams) and a cargo bay limit W ≤ 10^15. Find the maximum total mass of a subset of ingots that does not exceed W.',
    constraints:
      '1 ≤ N ≤ 40 · 1 ≤ w_i ≤ 10^14 · 1 ≤ W ≤ 10^15 · Time Limit: 1.5s',
    options: [
      '0/1 Knapsack DP array dp[0 .. W] indexed by weight',
      'Brute-force recursion over all 2^40 subsets',
      'Meet-in-the-Middle: split into two halves of 20 ingots, generate 2^20 subset sums each, sort and two-pointer / binary search',
      'Greedy selection sorting ingots by descending weight w_i',
    ],
    correctIndex: 2,
    targetComplexity: 'O(2^(N/2) · (N/2)) ≈ 2 × 10^7 ops',
    whyCorrect:
      'N = 40 is too large for 2^40 ≈ 1.1 × 10^12 brute force, and W = 10^15 is far too large for pseudo-polynomial Knapsack DP. Splitting the 40 ingots into two halves of size 20 produces two lists of 2^20 = 1,048,576 subset sums. Sorting one list and sweeping/binary-searching for W - s takes under 0.15 seconds.',
    whyOthersFail: [
      {
        optionIndex: 0,
        optionLabel: '0/1 Knapsack DP array dp[0 .. W] indexed by weight',
        failureVerdict: 'MLE',
        reason:
          'W = 10^15 requires petabytes of memory; pseudo-polynomial DP only works when W ≤ 10^7.',
      },
      {
        optionIndex: 1,
        optionLabel: 'Brute-force recursion over all 2^40 subsets',
        failureVerdict: 'TLE',
        reason:
          '2^40 ≈ 1.1 × 10^12 subsets exceeds the 10^8 operation budget by 4 orders of magnitude.',
      },
      {
        optionIndex: 3,
        optionLabel: 'Greedy selection sorting ingots by descending weight w_i',
        failureVerdict: 'WA',
        reason:
          'Subset Sum is NP-hard; e.g. weights {6, 5, 5} with W = 10 greedily picks {6} instead of {5, 5} = 10.',
      },
    ],
    linkedChapterSlug: 'meet-in-the-middle',
    linkedChapterTitle: 'Meet-in-the-Middle & Horowitz-Sahni',
  },
  {
    id: 'drill-11',
    number: 11,
    title: 'Zero-Adjacent-Twin Numbers in [L, R]',
    ratingTier: '1400–1800',
    domain: 'Dynamic Programming',
    problemSummary:
      'Count how many integers x in the inclusive range [L, R] satisfy two conditions in base 10: no two adjacent digits of x are identical, and the sum of the digits of x is divisible by M. The upper bound R can have up to 100 decimal digits.',
    constraints:
      '0 ≤ L ≤ R ≤ 10^100 · 1 ≤ M ≤ 50 · Time Limit: 1.0s',
    options: [
      'Digit DP on state (pos, prev_digit, sum_mod_M, is_tight, is_started) computing f(R) - f(L - 1)',
      'Iterate x from L to R and test digit adjacency and digit sum',
      'Sieve of Eratosthenes up to R',
      'Inclusion-Exclusion over prime factors of R',
    ],
    correctIndex: 0,
    targetComplexity: 'O(10 · |digits(R)| · 11 · M)',
    whyCorrect:
      'When R reaches 10^100, the number of digits D is only 100. Digit DP builds numbers most-significant-digit first while tracking (pos ∈ [0,100], prev_digit ∈ [0..9 or none], sum_mod ∈ [0..M-1], tight ∈ {0,1}, started ∈ {0,1}). Total states = 100 × 11 × 50 × 4 = 2.2 × 10^5 with 10 transitions each (~2.2 × 10^6 operations).',
    whyOthersFail: [
      {
        optionIndex: 1,
        optionLabel:
          'Iterate x from L to R and test digit adjacency and digit sum',
        failureVerdict: 'TLE',
        reason:
          'Iterating up to 10^100 exceeds the age of the universe.',
      },
      {
        optionIndex: 2,
        optionLabel: 'Sieve of Eratosthenes up to R',
        failureVerdict: 'MLE',
        reason:
          'Sieves operate on value magnitude O(R), not digit length O(log_10 R).',
      },
      {
        optionIndex: 3,
        optionLabel: 'Inclusion-Exclusion over prime factors of R',
        failureVerdict: 'WA',
        reason:
          'Base-10 digit adjacency and digit sum modulo M have no multiplicative structure over prime factors of R.',
      },
    ],
    linkedChapterSlug: 'digit-dp-automaton',
    linkedChapterTitle: 'Digit DP & Automaton State Compression',
  },
  {
    id: 'drill-12',
    number: 12,
    title: 'Binary Circuit Switch Assignment with Pairwise Clauses',
    ratingTier: '1400–1800',
    domain: 'Graph Theory',
    problemSummary:
      'You control N boolean power switches x_1, ..., x_N ∈ {0, 1}. There are M safety requirements; each requirement specifies two literals (l_a, l_b) and demands that at least one of them evaluates to true (l_a ∨ l_b), or that two switches cannot both be on (¬x_i ∨ ¬x_j). Determine if a valid assignment exists and output one valid truth table.',
    constraints:
      '1 ≤ N, M ≤ 2 × 10^5 · Time Limit: 1.0s',
    options: [
      '2-SAT Implication Graph (¬l_a → l_b, ¬l_b → l_a) + Tarjan’s Strongly Connected Components (SCC)',
      'Backtracking DPLL SAT solver with unit propagation',
      'Bipartite 2-Coloring via simple undirected BFS',
      'Gaussian Elimination over GF(2)',
    ],
    correctIndex: 0,
    targetComplexity: 'O(N + M)',
    whyCorrect:
      'Every 2-clause (l_a ∨ l_b) is logically equivalent to two directed implications (¬l_a ⇒ l_b) and (¬l_b ⇒ l_a) on 2N literal vertices. The formula is satisfiable iff no variable x_i shares the same Strongly Connected Component with ¬x_i. Tarjan’s SCC algorithm solves and assigns topological truth values in strict O(N + M) linear time.',
    whyOthersFail: [
      {
        optionIndex: 1,
        optionLabel: 'Backtracking DPLL SAT solver with unit propagation',
        failureVerdict: 'TLE',
        reason:
          'General backtracking can explore O(2^N) branches when guessing unassigned literals without SCC condensation.',
      },
      {
        optionIndex: 2,
        optionLabel: 'Bipartite 2-Coloring via simple undirected BFS',
        failureVerdict: 'WA',
        reason:
          '2-coloring only handles symmetric XOR constraints (x_i ≠ x_j), whereas (x_i ∨ x_j) allows both x_i = 1 and x_j = 1 simultaneously.',
      },
      {
        optionIndex: 3,
        optionLabel: 'Gaussian Elimination over GF(2)',
        failureVerdict: 'WA',
        reason:
          'GF(2) linear systems solve XOR equations (a ⊕ b = 1), not inclusive OR clauses (a ∨ b = 1), and take O(N^3 / 64) time.',
      },
    ],
    linkedChapterSlug: 'tarjan-scc-2sat-bridges',
    linkedChapterTitle: 'Tarjan SCC, 2-SAT, Bridges & Articulation Points',
  },

  // =========================================================================
  // TIER 3: 1800–2200 (Candidate Master & Platinum) — Scenarios 13 to 18
  // =========================================================================
  {
    id: 'drill-13',
    number: 13,
    title: 'Affine Range Multiply-Add & Modulo Sum Queries',
    ratingTier: '1800–2200',
    domain: 'Range Queries & Trees',
    problemSummary:
      'Maintain an array A of N integers under Q online operations of three types: (1) multiply every A[i] in [L, R] by b, (2) add c to every A[i] in [L, R], and (3) output the sum of A[L..R] modulo 998,244,353. Operations are strictly interleaved and online.',
    constraints:
      '1 ≤ N, Q ≤ 2 × 10^5 · 0 ≤ b, c < 998,244,353 · Time Limit: 1.5s',
    options: [
      'Segment Tree with Lazy Propagation composing affine tags f(x) = (mul · x + add) mod P',
      'Two standard Fenwick Trees (BIT) for range add and range sum',
      'Sparse Table precomputing block products and sums',
      'Difference Array updated in O(1) per query',
    ],
    correctIndex: 0,
    targetComplexity: 'O((N + Q) log N)',
    whyCorrect:
      'Both range multiplication and range addition are special cases of the affine linear map T_{b,c}(x) = b·x + c, which is closed under function composition: T_{b2,c2}(T_{b1,c1}(x)) = (b2·b1)x + (b2·c1 + c2). A Lazy Segment Tree stores (mul, add) at each node and updates subtree sums via sum_new = b · sum_old + c · len in O(1) per push.',
    whyOthersFail: [
      {
        optionIndex: 1,
        optionLabel:
          'Two standard Fenwick Trees (BIT) for range add and range sum',
        failureVerdict: 'WA',
        reason:
          'A Fenwick Tree only handles prefix-invertible single-parameter group updates; scaling a range by b non-uniformly scales prior additions and cannot be decomposed into two BITs.',
      },
      {
        optionIndex: 2,
        optionLabel: 'Sparse Table precomputing block products and sums',
        failureVerdict: 'TLE',
        reason:
          'Sparse Tables are static structures; rebuilding after online updates takes O(Q · N log N).',
      },
      {
        optionIndex: 3,
        optionLabel: 'Difference Array updated in O(1) per query',
        failureVerdict: 'TLE',
        reason:
          'Difference arrays require O(N) prefix reconstruction to answer each interleaved online sum query, taking O(Q · N) total time.',
      },
    ],
    linkedChapterSlug: 'lazy-propagation-segment-tree',
    linkedChapterTitle: 'Segment Tree with Lazy Propagation &Segment Beats',
  },
  {
    id: 'drill-14',
    number: 14,
    title: 'Static Range K-th Smallest Element (Online)',
    ratingTier: '1800–2200',
    domain: 'Range Queries & Trees',
    problemSummary:
      'You are given a static array A[1..N] and Q online queries (L, R, K), where the parameters of query i are XOR-encrypted with the answer to query i-1. For each query, return the K-th smallest value inside the subarray A[L..R].',
    constraints:
      '1 ≤ N, Q ≤ 2 × 10^5 · |A[i]| ≤ 10^9 · Strict Online Encryption · Time Limit: 1.5s',
    options: [
      'Persistent Segment Tree (Chairman Tree) over coordinate-compressed values with path-copied prefix roots',
      'Mo’s Algorithm with an Order-Statistic Set',
      'Sort a copy of A[L..R] for each query and index element K-1',
      'Standard Segment Tree storing only the minimum and maximum of each node',
    ],
    correctIndex: 0,
    targetComplexity: 'O((N + Q) log N) Time & Space',
    whyCorrect:
      'Coordinate-compressing A into [1..M] and building N prefix versions of a value-frequency Segment Tree via path copying allocates only O(N log N) nodes. For any online query (L, R, K), the frequency of values in [vl, mid] inside A[L..R] is cnt(root[R].left) - cnt(root[L-1].left), allowing binary search down the two prefix roots simultaneously in O(log N) time.',
    whyOthersFail: [
      {
        optionIndex: 1,
        optionLabel: 'Mo’s Algorithm with an Order-Statistic Set',
        failureVerdict: 'WA',
        reason:
          'Queries are XOR-encrypted with the previous answer (strictly online), so offline Mo’s Algorithm cannot sort the queries ahead of time.',
      },
      {
        optionIndex: 2,
        optionLabel:
          'Sort a copy of A[L..R] for each query and index element K-1',
        failureVerdict: 'TLE',
        reason:
          'O(Q · N log N) takes ~7 × 10^11 operations.',
      },
      {
        optionIndex: 3,
        optionLabel:
          'Standard Segment Tree storing only the minimum and maximum of each node',
        failureVerdict: 'WA',
        reason:
          'Knowing min and max of O(log N) disjoint intervals provides no information about the rank-K order statistic across their union.',
      },
    ],
    linkedChapterSlug: 'persistent-segment-tree',
    linkedChapterTitle: 'Persistent Segment Trees & Functional Data Structures',
  },
  {
    id: 'drill-15',
    number: 15,
    title: 'Offline Range Sum of Cube Frequencies',
    ratingTier: '1800–2200',
    domain: 'Range Queries & Trees',
    problemSummary:
      'Given an array A[1..N] and Q offline queries [L_q, R_q], compute ∑_v (freq(v, L_q, R_q))^3 for each query, where freq(v, L, R) is the number of occurrences of value v inside A[L..R]. There are no updates.',
    constraints:
      '1 ≤ N, Q ≤ 1.5 × 10^5 · 1 ≤ A[i] ≤ 10^6 · Offline Queries · Time Limit: 2.0s',
    options: [
      'Mo’s Algorithm (Block / Hilbert Curve Order) with O(1) incremental Δ(c^3) = (c±1)^3 - c^3 updates',
      'Standard Segment Tree merging frequency hash maps at every internal node',
      'Fenwick Tree of prefix cube sums',
      'Brute-force frequency array clear and recount per query',
    ],
    correctIndex: 0,
    targetComplexity: 'O((N + Q) √N)',
    whyCorrect:
      'Frequency cubes ∑ freq(v)^3 lack an associative O(1) merge across two arbitrary halves, ruling out standard Segment Trees. However, adding or removing a single element at an endpoint changes only one value’s count c → c ± 1 in O(1) time. Sorting the offline queries in Mo’s √N block order bounds pointer movement to O((N + Q)√N) ≈ 5.8 × 10^7 O(1) steps.',
    whyOthersFail: [
      {
        optionIndex: 1,
        optionLabel:
          'Standard Segment Tree merging frequency hash maps at every internal node',
        failureVerdict: 'TLE',
        reason:
          'Merging two frequency maps at query time takes O(N) per query, degenerating to O(Q · N).',
      },
      {
        optionIndex: 2,
        optionLabel: 'Fenwick Tree of prefix cube sums',
        failureVerdict: 'WA',
        reason:
          '(a + b)^3 ≠ a^3 + b^3; cube frequencies are not prefix-subtractable.',
      },
      {
        optionIndex: 3,
        optionLabel: 'Brute-force frequency array clear and recount per query',
        failureVerdict: 'TLE',
        reason:
          'O(Q · N) = 2.25 × 10^10 operations.',
      },
    ],
    linkedChapterSlug: 'sqrt-decomposition-mo-algorithm',
    linkedChapterTitle: 'Sqrt Decomposition & Mo’s Algorithm (Standard, Tree, Rollback)',
  },
  {
    id: 'drill-16',
    number: 16,
    title: 'Bitwise-AND Zero Compatible Pair Counting',
    ratingTier: '1800–2200',
    domain: 'Dynamic Programming',
    problemSummary:
      'You are given an array A of N integers where each A[i] is a 20-bit bitmask (0 ≤ A[i] < 2^20). For every element A[i], compute the sum of weights W[j] over all j such that (A[i] & A[j]) == 0 (i.e., A[j] is a bitwise submask of the bitwise complement ~A[i]).',
    constraints:
      '1 ≤ N ≤ 10^6 · 0 ≤ A[i] < 2^20 (B = 20 bits) · Time Limit: 1.5s',
    options: [
      'Sum Over Subsets (SOS) DP / Fast Zeta Transform in O(B · 2^B) + O(1) lookup at mask (~A[i])',
      'Iterate over all 3^B submask pairs using for (s = m; s; s = (s-1)&m)',
      'Nested O(N²) loop checking (A[i] & A[j]) == 0',
      'Trie traversal branching down both 0 and 1 whenever ~A[i] has a 1-bit',
    ],
    correctIndex: 0,
    targetComplexity: 'O(N + B · 2^B) ≈ 2.2 × 10^7 ops',
    whyCorrect:
      'The condition (A[i] & A[j]) == 0 is identical to A[j] ⊆ (~A[i]), where ~A[i] is the 20-bit complement. Accumulating F[mask] = ∑_{A[j] == mask} W[j] and running the B-dimensional SOS DP transition F[mask] += F[mask ^ (1 << bit)] for bit = 0..19 computes all 2^20 submask sums in 20 × 2^20 ≈ 2.1 × 10^7 operations.',
    whyOthersFail: [
      {
        optionIndex: 1,
        optionLabel:
          'Iterate over all 3^B submask pairs using for (s = m; s; s = (s-1)&m)',
        failureVerdict: 'TLE',
        reason:
          'For B = 20, 3^20 = 3,486,784,401 iterations, which causes TLE within 1.5s.',
      },
      {
        optionIndex: 2,
        optionLabel: 'Nested O(N²) loop checking (A[i] & A[j]) == 0',
        failureVerdict: 'TLE',
        reason:
          'N = 10^6 yields 10^12 pair checks.',
      },
      {
        optionIndex: 3,
        optionLabel:
          'Trie traversal branching down both 0 and 1 whenever ~A[i] has a 1-bit',
        failureVerdict: 'TLE',
        reason:
          'When ~A[i] has all 20 bits set, the Trie query branches at every level and visits all 2^20 leaves per query.',
      },
    ],
    linkedChapterSlug: 'bitmask-dp-sos',
    linkedChapterTitle: 'Bitmask DP, Traveling Salesperson & SOS DP (Zeta Transform)',
  },
  {
    id: 'drill-17',
    number: 17,
    title: 'Tree Path Range Increment & Path Maximum Queries',
    ratingTier: '1800–2200',
    domain: 'Range Queries & Trees',
    problemSummary:
      'You are given a static tree of N vertices with initial weights on each vertex. Process Q online operations: (1) add +v to all vertices along the unique simple path between u and w, and (2) query the maximum vertex weight along the unique simple path between u and w.',
    constraints:
      '1 ≤ N, Q ≤ 1.5 × 10^5 · |v| ≤ 10^9 · Time Limit: 2.0s',
    options: [
      'Heavy-Light Decomposition (HLD) decomposing any tree path into O(log N) contiguous Segment Tree intervals',
      'Euler Tour Subtree Flattening (tin[u]..tout[u]) with a single Lazy Segment Tree',
      'Binary Lifting LCA storing static path maximums in up[u][k]',
      'Small-to-Large Merging (DSU on Tree / Sack)',
    ],
    correctIndex: 0,
    targetComplexity: 'O(Q log² N)',
    whyCorrect:
      'Heavy-Light Decomposition orders heavy chains contiguously in the DFS array so that any u-to-w simple path partitions into at most 2 log_2 N contiguous intervals. Backing the flattened array with a Lazy Propagation Segment Tree supports both path-add and path-max in O(log² N) per query.',
    whyOthersFail: [
      {
        optionIndex: 1,
        optionLabel:
          'Euler Tour Subtree Flattening (tin[u]..tout[u]) with a single Lazy Segment Tree',
        failureVerdict: 'WA',
        reason:
          'Subtree Euler Tour maps subtrees to contiguous ranges, not u-w paths; and maximum is not invertible, so prefix-to-root trick (tin/tout ±v) only works for point-update/path-sum, not path-update/path-max.',
      },
      {
        optionIndex: 2,
        optionLabel:
          'Binary Lifting LCA storing static path maximums in up[u][k]',
        failureVerdict: 'TLE',
        reason:
          'Binary lifting tables cannot be dynamically updated under path additions without O(N log N) rebuilds.',
      },
      {
        optionIndex: 3,
        optionLabel: 'Small-to-Large Merging (DSU on Tree / Sack)',
        failureVerdict: 'WA',
        reason:
          'DSU on Tree answers offline static subtree queries in O(N log N), not dynamic online path updates.',
      },
    ],
    linkedChapterSlug: 'heavy-light-decomposition',
    linkedChapterTitle: 'Heavy-Light Decomposition (HLD)',
  },
  {
    id: 'drill-18',
    number: 18,
    title: 'Maximum XOR Subset & K-th Smallest Distinct Subset XOR',
    ratingTier: '1800–2200',
    domain: 'Number Theory & Math',
    problemSummary:
      'You are given a multiset S of N 60-bit non-negative integers. Answer Q queries of two types: (1) insert a new 60-bit integer x into S, and (2) return the K-th smallest distinct value obtainable by XOR-ing some subset of S (or -1 if fewer than K distinct XOR sums exist).',
    constraints:
      '1 ≤ N, Q ≤ 2 × 10^5 · 0 ≤ x < 2^60 · 1 ≤ K ≤ 2^60 · Time Limit: 1.0s',
    options: [
      'GF(2) Linear XOR Basis (60-entry echelon array) reduced to Reduced Row Echelon Form (RREF)',
      '0/1 Binary Trie storing all 2^N subset XOR sums explicitly',
      'Fast Walsh-Hadamard Transform (FWHT) over an array of length 2^60',
      'Meet-in-the-Middle splitting S into two halves',
    ],
    correctIndex: 0,
    targetComplexity: 'O((N + Q) · 60)',
    whyCorrect:
      'The set of all subset XOR sums of S forms a vector subspace over GF(2) of dimension D ≤ 60. Inserting each number into a 60-element upper-triangular basis takes at most 60 XOR operations. Diagonalizing the basis into RREF maps the binary bits of (K - 1) isomorphically to the K-th smallest distinct XOR sum in O(D) time.',
    whyOthersFail: [
      {
        optionIndex: 1,
        optionLabel:
          '0/1 Binary Trie storing all 2^N subset XOR sums explicitly',
        failureVerdict: 'MLE',
        reason:
          'There are up to 2^60 distinct subset XOR sums; storing them in a Trie is impossible.',
      },
      {
        optionIndex: 2,
        optionLabel:
          'Fast Walsh-Hadamard Transform (FWHT) over an array of length 2^60',
        failureVerdict: 'MLE',
        reason:
          'FWHT requires O(B · 2^B) memory and time, which is only feasible for B ≤ 22.',
      },
      {
        optionIndex: 3,
        optionLabel: 'Meet-in-the-Middle splitting S into two halves',
        failureVerdict: 'TLE',
        reason:
          'N = 2 × 10^5 makes 2^(N/2) subset enumeration impossible.',
      },
    ],
    linkedChapterSlug: 'xor-basis-gaussian-elimination',
    linkedChapterTitle: 'Linear Algebra, Gaussian Elimination & GF(2) XOR Basis',
  },

  // =========================================================================
  // TIER 4: 2200–2600 (Master & ICPC Regionals) — Scenarios 19 to 24
  // =========================================================================
  {
    id: 'drill-19',
    number: 19,
    title: 'Non-Monotonic Lumberjack Chain Sawing DP',
    ratingTier: '2200–2600',
    domain: 'Range Queries & Trees',
    problemSummary:
      'You are computing dp[i] = min_{1 ≤ j < i} (dp[j] + B[j] · A[i]), where neither the slopes B[j] nor the query points A[i] are monotonic (both A[i] and B[j] oscillate positively and negatively across [-10^9, 10^9]). Compute dp[N] for N = 2 × 10^5.',
    constraints:
      '1 ≤ N ≤ 2 × 10^5 · -10^9 ≤ A[i], B[j] ≤ 10^9 · Time Limit: 1.5s',
    options: [
      'Dynamic Li Chao Segment Tree over [-10^9, 10^9] (or coordinate-compressed query points A[i])',
      'Two-pointer Deque Convex Hull Trick assuming monotonic slopes and monotonic queries',
      'Naive O(N²) inner loop over all 1 ≤ j < i',
      'Divide & Conquer DP Optimization assuming monotonic opt[i] ≤ opt[i+1]',
    ],
    correctIndex: 0,
    targetComplexity: 'O(N log N)',
    whyCorrect:
      'Each transition state j defines a linear function L_j(x) = B[j]·x + dp[j] queried at x = A[i]. Because slopes B[j] and queries A[i] have arbitrary signs and non-monotonic order, the optimal j is not monotonic. A Li Chao Tree maintains the lower envelope of arbitrary lines in O(log N) per insertion and O(log N) per point query.',
    whyOthersFail: [
      {
        optionIndex: 1,
        optionLabel:
          'Two-pointer Deque Convex Hull Trick assuming monotonic slopes and monotonic queries',
        failureVerdict: 'WA',
        reason:
          'Deque CHT pops lines from the front and back assuming sorted slopes and sorted query points; non-monotonic slopes destroy envelope convexity.',
      },
      {
        optionIndex: 2,
        optionLabel: 'Naive O(N²) inner loop over all 1 ≤ j < i',
        failureVerdict: 'TLE',
        reason:
          'O(N²) = 4 × 10^10 operations.',
      },
      {
        optionIndex: 3,
        optionLabel:
          'Divide & Conquer DP Optimization assuming monotonic opt[i] ≤ opt[i+1]',
        failureVerdict: 'WA',
        reason:
          'When A[i] and B[j] are non-monotonic, the cost function violates the quadrangle inequality and opt[i] jumps backward arbitrarily.',
      },
    ],
    linkedChapterSlug: 'li-chao-tree-convex-hull-trick',
    linkedChapterTitle: 'Convex Hull Trick (CHT) & Li Chao Tree',
  },
  {
    id: 'drill-20',
    number: 20,
    title: 'Exactly K Factory Hubs on a 1D Highway',
    ratingTier: '2200–2600',
    domain: 'Dynamic Programming',
    problemSummary:
      'N villages lie at sorted positions x_1 < x_2 < ... < x_N on a highway. You must build exactly K supply hubs to minimize the total distance from each village to its nearest hub. Denote f(k) as the optimal total cost using k hubs; because of diminishing returns, f(k) is convex (f(k) - f(k-1) ≤ f(k+1) - f(k)). Both N and K can be up to 2 × 10^5.',
    constraints:
      '1 ≤ K ≤ N ≤ 2 × 10^5 · 0 ≤ x_i ≤ 10^9 · Time Limit: 2.0s',
    options: [
      'Aliens Trick (WQS Binary Search / Lagrangian Relaxation) penalizing each hub by λ + 1D CHT / Monotone Queue DP',
      '2D Divide & Conquer DP computing all K layers in O(K · N log N)',
      'Knuth’s Optimization in O(N²)',
      'Greedy selection picking the K largest adjacent gaps',
    ],
    correctIndex: 0,
    targetComplexity: 'O(N log(∑ x_i))',
    whyCorrect:
      'When both N and K are 2 × 10^5, any O(N · K) algorithm takes 4 × 10^10 operations. Because f(k) is convex in k, WQS Binary Search replaces the hard constraint "use exactly K hubs" with a Lagrangian per-hub penalty λ, reducing the problem to O(log C) runs of an unconstrained 1D DP solved in O(N) via Monge/1D1D queue.',
    whyOthersFail: [
      {
        optionIndex: 1,
        optionLabel:
          '2D Divide & Conquer DP computing all K layers in O(K · N log N)',
        failureVerdict: 'TLE',
        reason:
          'O(K · N log N) for N = K = 2 × 10^5 takes ~7 × 10^11 operations.',
      },
      {
        optionIndex: 2,
        optionLabel: 'Knuth’s Optimization in O(N²)',
        failureVerdict: 'TLE',
        reason:
          'O(N²) = 4 × 10^10 operations exceeds the 2.0s time limit.',
      },
      {
        optionIndex: 3,
        optionLabel: 'Greedy selection picking the K largest adjacent gaps',
        failureVerdict: 'WA',
        reason:
          'Gap-splitting optimizes the sum of (R - L) span costs, not the 1-median hub distance ∑ |x_i - median|.',
      },
    ],
    linkedChapterSlug: 'aliens-trick-wqs-binary-search',
    linkedChapterTitle: 'Aliens Trick (WQS Binary Search / Lagrangian Relaxation)',
  },
  {
    id: 'drill-21',
    number: 21,
    title: 'R&D Experiments vs. Equipment Dependencies (Project Selection)',
    ratingTier: '2200–2600',
    domain: 'Graph Theory',
    problemSummary:
      'A lab can choose from N profitable research experiments (experiment i yields revenue R_i > 0) and M specialized instruments (instrument j costs C_j > 0 to purchase). Each experiment i requires a specific subset of instruments to be purchased before it can be performed, and may also require other prerequisite experiments. Find the maximum net profit (Total Revenue minus Total Cost).',
    constraints:
      '1 ≤ N, M ≤ 2,500 · Total prerequisite edges E ≤ 2 × 10^4 · R_i, C_j ≤ 10^9 · Time Limit: 1.5s',
    options: [
      'Maximum-Weight Closure via Dinic’s Max-Flow / s-t Min-Cut (Answer = ∑ R_i - MinCut(s, t))',
      'Topological Sort + Longest Path DP on the DAG',
      '0/1 Knapsack DP over instrument costs',
      'Greedy selection of experiments where R_i exceeds immediate instrument costs',
    ],
    correctIndex: 0,
    targetComplexity: 'O(V²E) worst-case, fast Dinic in < 0.05s',
    whyCorrect:
      'This is the classic Maximum-Weight Closure of a directed graph. Connect source s → each experiment i with capacity R_i, each instrument j → sink t with capacity C_j, and prerequisite edges i → j with capacity ∞. Any finite s-t cut leaves a closed dependency set on the s-side, and Dinic’s algorithm finds the minimum lost revenue + paid cost in milliseconds.',
    whyOthersFail: [
      {
        optionIndex: 1,
        optionLabel: 'Topological Sort + Longest Path DP on the DAG',
        failureVerdict: 'WA',
        reason:
          'Multiple experiments share the same expensive instruments; DAG DP double-counts shared instrument costs across reconverging paths.',
      },
      {
        optionIndex: 2,
        optionLabel: '0/1 Knapsack DP over instrument costs',
        failureVerdict: 'WA',
        reason:
          'Experiments have arbitrary many-to-many bipartite/DAG dependencies that cannot be ordered into independent knapsack items.',
      },
      {
        optionIndex: 3,
        optionLabel:
          'Greedy selection of experiments where R_i exceeds immediate instrument costs',
        failureVerdict: 'WA',
        reason:
          'Two experiments each yielding R = 60 that share an instrument costing C = 100 are unprofitable individually (60 < 100) but yield +20 net profit together (120 - 100 = 20).',
      },
    ],
    linkedChapterSlug: 'max-flow-dinic-min-cut',
    linkedChapterTitle: 'Max-Flow (Dinic’s Algorithm) & Min-Cut Reductions',
  },
  {
    id: 'drill-22',
    number: 22,
    title: 'All-Pairs Dice Sum Distribution Modulo 998244353',
    ratingTier: '2200–2600',
    domain: 'Number Theory & Math',
    problemSummary:
      'You are given two non-negative integer frequency arrays A[0..N] and B[0..N], where A[v] is the number of red cards with value v and B[u] is the number of blue cards with value u. For every possible sum S ∈ [0, 2N], compute C[S] = ∑_{v + u = S} (A[v] · B[u]) mod 998,244,353.',
    constraints:
      '1 ≤ N ≤ 2.5 × 10^5 · 0 ≤ A[v], B[u] < 998,244,353 · Time Limit: 1.0s',
    options: [
      'Number Theoretic Transform (NTT) using primitive root g = 3 modulo 998,244,353 = 119 · 2^23 + 1',
      'Direct O(N²) nested convolution loop',
      'Karatsuba Divide & Conquer Polynomial Multiplication in O(N^1.585)',
      'Prefix Sums over A and B',
    ],
    correctIndex: 0,
    targetComplexity: 'O(N log N)',
    whyCorrect:
      'The sequence C[S] is the exact Cauchy polynomial convolution of A(x) and B(x). Because 998,244,353 = 119 × 2^23 + 1 is an NTT-friendly prime with primitive root g = 3, in-place Cooley-Tukey NTT transforms A and B to point-value form, multiplies pointwise, and inverts in O(N log N) exact modular arithmetic with zero floating-point precision loss.',
    whyOthersFail: [
      {
        optionIndex: 1,
        optionLabel: 'Direct O(N²) nested convolution loop',
        failureVerdict: 'TLE',
        reason:
          'N = 2.5 × 10^5 requires 6.25 × 10^10 operations.',
      },
      {
        optionIndex: 2,
        optionLabel:
          'Karatsuba Divide & Conquer Polynomial Multiplication in O(N^1.585)',
        failureVerdict: 'TLE',
        reason:
          'For N = 2.5 × 10^5, N^1.585 ≈ 3.6 × 10^8 recursive array allocations, exceeding 1.0s.',
      },
      {
        optionIndex: 3,
        optionLabel: 'Prefix Sums over A and B',
        failureVerdict: 'WA',
        reason:
          'Prefix sums compute ∑_{u ≤ S} B[u], whereas convolution weights each B[S - v] by a different coefficient A[v].',
      },
    ],
    linkedChapterSlug: 'fft-ntt-polynomial-convolution',
    linkedChapterTitle: 'FFT, NTT & Fast Walsh-Hadamard Transform (FWHT)',
  },
  {
    id: 'drill-23',
    number: 23,
    title: 'Longest Common Substring & Distinct Substring Occurrences',
    ratingTier: '2200–2600',
    domain: 'Strings & Automata',
    problemSummary:
      'Given a primary genome string S of length N and Q query strings T_q, you must first count the total number of distinct substrings of S that appear at least K times in S, and then for each T_q find the length of the longest substring of T_q that also appears in S.',
    constraints:
      '1 ≤ |S| ≤ 5 × 10^5 · ∑ |T_q| ≤ 5 × 10^5 · Alphabet: a–z · Time Limit: 1.5s',
    options: [
      'Suffix Automaton (SAM) with Link Tree endpos-size aggregation in O(|S| + ∑|T_q|)',
      'Aho-Corasick Automaton built over all substrings of S',
      'KMP Prefix Function run for each substring of S',
      'Single-Modulus Polynomial Rolling Hash without length binary search',
    ],
    correctIndex: 0,
    targetComplexity: 'O(|S| + ∑ |T_q|)',
    whyCorrect:
      'A Suffix Automaton compresses all O(|S|²) substrings into at most 2|S| - 1 states (endpos equivalence classes) in O(|S|) time. Each state u covers exactly len(u) - len(link(u)) distinct substrings, and propagating terminal counts bottom-up on the suffix-link tree gives exact occurrence counts for every state, while streaming T_q through SAM transitions finds the longest match at every prefix in O(|T_q|).',
    whyOthersFail: [
      {
        optionIndex: 1,
        optionLabel: 'Aho-Corasick Automaton built over all substrings of S',
        failureVerdict: 'MLE',
        reason:
          'S has Θ(|S|²) ≈ 1.25 × 10^11 substrings; inserting all of them into a Trie causes immediate MLE.',
      },
      {
        optionIndex: 2,
        optionLabel: 'KMP Prefix Function run for each substring of S',
        failureVerdict: 'TLE',
        reason:
          'KMP only matches a single fixed pattern in O(|S|); running it across all substrings is O(|S|^3).',
      },
      {
        optionIndex: 3,
        optionLabel:
          'Single-Modulus Polynomial Rolling Hash without length binary search',
        failureVerdict: 'TLE',
        reason:
          'Enumerating all substring hashes still takes O(|S|²) unless paired with Suffix Array / SAM.',
      },
    ],
    linkedChapterSlug: 'suffix-automaton-sam',
    linkedChapterTitle: 'Suffix Automaton (SAM) & Palindromic Tree (Eertree)',
  },
  {
    id: 'drill-24',
    number: 24,
    title: 'Minimum-Weight Simple K-Vertex Path in a General Graph',
    ratingTier: '2200–2600',
    domain: 'Randomized, Games & Interactive',
    problemSummary:
      'You are given a general directed weighted graph G = (V, E) with N = 5,000 vertices, M = 15,000 edges, and a small path length parameter K = 8. Find the minimum total weight of a simple directed path containing exactly K distinct vertices (no vertex may be visited twice).',
    constraints:
      '1 ≤ N ≤ 5,000 · 1 ≤ M ≤ 15,000 · K = 8 · w_e ≥ 1 · Time Limit: 2.0s',
    options: [
      'Color Coding: randomly color vertices with K colors + O(2^K · M) Rainbow Bitmask DP repeated ~e^K times',
      'Dijkstra’s Algorithm tracking only (current_vertex, steps_taken ∈ [1..K])',
      'Bitmask DP over all 2^N vertex subsets',
      'DFS backtracking enumerating all N^K walks',
    ],
    correctIndex: 0,
    targetComplexity: 'O(T · 2^K · M) with T ≈ 120 trials',
    whyCorrect:
      'In a random K-coloring of V, any fixed simple K-path receives K distinct colors (becomes "rainbow") with probability K! / K^K = 8! / 8^8 ≈ 0.0024. For a fixed coloring, finding the lightest rainbow K-path takes O(2^K · M) ≈ 256 × 15,000 = 3.84 × 10^6 operations via bitmask DP over the 2^8 color masks. Running ~400–500 independent random colorings (or K-bipartition for odd cycles) succeeds with high probability within 2.0s.',
    whyOthersFail: [
      {
        optionIndex: 1,
        optionLabel:
          'Dijkstra’s Algorithm tracking only (current_vertex, steps_taken ∈ [1..K])',
        failureVerdict: 'WA',
        reason:
          'Without remembering which vertices were already visited, Dijkstra traverses negative/cheap small cycles (e.g., u ↔ v) repeatedly, producing a walk with repeated vertices instead of a simple path.',
      },
      {
        optionIndex: 2,
        optionLabel: 'Bitmask DP over all 2^N vertex subsets',
        failureVerdict: 'MLE',
        reason:
          'N = 5,000 makes a 2^5000 bitmask state space impossible; Color Coding compresses the bitmask dimension from N = 5,000 down to K = 8.',
      },
      {
        optionIndex: 3,
        optionLabel: 'DFS backtracking enumerating all N^K walks',
        failureVerdict: 'TLE',
        reason:
          'Even with degree d ≈ 20, d^K = 20^8 = 2.56 × 10^10 paths.',
      },
    ],
    linkedChapterSlug: 'color-coding-random-bipartition',
    linkedChapterTitle: 'Color Coding & Randomized Bipartition (FPT)',
  },

  // =========================================================================
  // TIER 5: 2600–3300+ (Grandmaster & World Finals) — Scenarios 25 to 30
  // =========================================================================
  {
    id: 'drill-25',
    number: 25,
    title: 'Online Dynamic Forest Edge Cut/Link & Path XOR Sums',
    ratingTier: '2600–3300+',
    domain: 'Range Queries & Trees',
    problemSummary:
      'Maintain a dynamic forest of N vertices under Q strictly online operations: (1) link(u, v) adding an undirected edge between two disconnected trees, (2) cut(u, v) deleting an existing edge, (3) update(u, x) changing vertex u’s weight to x, and (4) query(u, v) returning the bitwise XOR sum of vertex weights along the unique path between u and v (or -1 if disconnected).',
    constraints:
      '1 ≤ N, Q ≤ 1.5 × 10^5 · Strictly Online (XOR-encrypted queries) · Time Limit: 1.5s',
    options: [
      'Link-Cut Tree (LCT) using auxiliary Splay trees with access(u), makeroot(u), link, and cut',
      'Heavy-Light Decomposition (HLD) rebuilt from scratch after every link/cut',
      'Offline Segment Tree over Time + Rollback DSU',
      'Disjoint Set Union (DSU) with path compression',
    ],
    correctIndex: 0,
    targetComplexity: 'O((N + Q) log N) amortized',
    whyCorrect:
      'Link-Cut Trees partition the dynamic forest into preferred paths represented by auxiliary Splay trees keyed by depth. Calling makeroot(u) and access(v) isolates the exact u-to-v path inside v’s Splay tree root, allowing online edge insertions, edge deletions, vertex updates, and path aggregates in O(log N) amortized time.',
    whyOthersFail: [
      {
        optionIndex: 1,
        optionLabel:
          'Heavy-Light Decomposition (HLD) rebuilt from scratch after every link/cut',
        failureVerdict: 'TLE',
        reason:
          'HLD relies on a static DFS tree; relinking edges changes heavy/light edges across the tree, requiring O(N) rebuilds per query (O(Q · N) total).',
      },
      {
        optionIndex: 2,
        optionLabel: 'Offline Segment Tree over Time + Rollback DSU',
        failureVerdict: 'WA',
        reason:
          'Queries are strictly online (encrypted) and ask for path XOR aggregates rather than mere connectivity.',
      },
      {
        optionIndex: 3,
        optionLabel: 'Disjoint Set Union (DSU) with path compression',
        failureVerdict: 'WA',
        reason:
          'DSU with path compression destroys original tree topology and does not support online arbitrary edge deletions (cut) or path queries.',
      },
    ],
    linkedChapterSlug: 'link-cut-tree',
    linkedChapterTitle: 'Link-Cut Trees & Dynamic Tree Connectivity',
  },
  {
    id: 'drill-26',
    number: 26,
    title: 'Minimum L1 Modification Cost to Make Array Strictly Increasing',
    ratingTier: '2600–3300+',
    domain: 'Dynamic Programming',
    problemSummary:
      'Given an integer array A[1..N], you may change each element A[i] to any integer B[i] at cost |A[i] - B[i]|. Find the minimum total cost ∑_{i=1}^N |A[i] - B[i]| required so that B[1] < B[2] < ... < B[N] is strictly increasing.',
    constraints:
      '1 ≤ N ≤ 5 × 10^5 · |A[i]| ≤ 10^9 · Time Limit: 1.0s',
    options: [
      'Slope Trick Convex DP: transform A\'[i] = A[i] - i and maintain slope-change breakpoints in a Max-Heap',
      '2D DP dp[i][v] storing minimum cost for prefix i ending at value v',
      'Longest Increasing Subsequence (LIS) in O(N log N) leaving LIS elements fixed',
      'Greedy clamp setting B[i] = max(B[i-1] + 1, A[i]) from left to right',
    ],
    correctIndex: 0,
    targetComplexity: 'O(N log N)',
    whyCorrect:
      'Substituting A\'[i] = A[i] - i and B\'[i] = B[i] - i converts the strict inequality B[i] < B[i+1] into non-decreasing B\'[1] ≤ B\'[2] ≤ ... ≤ B\'[N]. The prefix cost function F_i(x) = min_{y ≤ x} F_{i-1}(y) + |x - A\'[i]| is continuous, convex, and piecewise-linear with integer slopes. Slope Trick maintains the negative-slope breakpoints in a single std::priority_queue in O(N log N) time and 15 lines of code.',
    whyOthersFail: [
      {
        optionIndex: 1,
        optionLabel:
          '2D DP dp[i][v] storing minimum cost for prefix i ending at value v',
        failureVerdict: 'TLE',
        reason:
          'Even after coordinate compression, there are N = 5 × 10^5 distinct values, making O(N²) = 2.5 × 10^11 operations.',
      },
      {
        optionIndex: 2,
        optionLabel:
          'Longest Increasing Subsequence (LIS) in O(N log N) leaving LIS elements fixed',
        failureVerdict: 'WA',
        reason:
          'LIS minimizes the count of modified elements (L0 norm), not the sum of absolute changes ∑|A[i] - B[i]| (L1 norm).',
      },
      {
        optionIndex: 3,
        optionLabel:
          'Greedy clamp setting B[i] = max(B[i-1] + 1, A[i]) from left to right',
        failureVerdict: 'WA',
        reason:
          'If A = [100, 1, 2, 3, 4], lowering A[1] from 100 to 0 costs 100, whereas clamping B[2..5] up to 101..104 costs ~400.',
      },
    ],
    linkedChapterSlug: 'slope-trick-convex-dp',
    linkedChapterTitle: 'Slope Trick & Convex Piecewise-Linear DP',
  },
  {
    id: 'drill-27',
    number: 27,
    title: 'Maximum Pairing in a Non-Bipartite Tournament Lobby',
    ratingTier: '2600–3300+',
    domain: 'Graph Theory',
    problemSummary:
      'There are N players in a tournament lobby and M compatibility links between pairs of players. Because compatibility depends on overlapping hero pools and ping, the graph G = (V, E) contains arbitrary odd cycles (triangles, pentagons, etc.) and is NOT bipartite. Find the maximum number of disjoint 2-player pairs that can be matched simultaneously.',
    constraints:
      '1 ≤ N ≤ 500 · 1 ≤ M ≤ N(N-1)/2 · General Undirected Graph · Time Limit: 1.5s',
    options: [
      'Edmonds’ Blossom Algorithm (Alternating BFS contracting odd cycles into super-vertices) or Tutte Matrix Rank',
      'Hopcroft-Karp Bipartite Matching after 2-coloring the vertices',
      'Greedy matching picking vertices of minimum degree first',
      'Standard s-t Max-Flow splitting each vertex into u_in and u_out',
    ],
    correctIndex: 0,
    targetComplexity: 'O(V · E) to O(V^3)',
    whyCorrect:
      'In a general non-bipartite graph, odd cycles ("blossoms") break standard alternating-path BFS because a vertex can be reached at both even and odd alternating distances. Edmonds’ Blossom Algorithm contracts each discovered odd cycle of length 2k+1 into a single pseudo-vertex, recursively finds an augmenting path in the contracted graph, and lifts it back in O(V^3) time.',
    whyOthersFail: [
      {
        optionIndex: 1,
        optionLabel:
          'Hopcroft-Karp Bipartite Matching after 2-coloring the vertices',
        failureVerdict: 'WA',
        reason:
          'Graphs with odd cycles are not 2-colorable; discarding odd-cycle edges loses valid matchings.',
      },
      {
        optionIndex: 2,
        optionLabel:
          'Greedy matching picking vertices of minimum degree first',
        failureVerdict: 'WA',
        reason:
          'On a 4-vertex path 1-2-3-4 (or bull graph), greedy degree tie-breaking can pick edge (2,3) and strand 1 and 4.',
      },
      {
        optionIndex: 3,
        optionLabel:
          'Standard s-t Max-Flow splitting each vertex into u_in and u_out',
        failureVerdict: 'WA',
        reason:
          'In the presence of odd triangles (1-2-3-1), directed bipartite flow sends 1/2 unit of fractional flow around the cycle (1_in→2_out, 2_in→3_out, 3_in→1_out) instead of an integral undirected matching.',
      },
    ],
    linkedChapterSlug: 'general-graph-matching-blossom',
    linkedChapterTitle: 'General Graph Matching (Edmonds’ Blossom & Tutte Matrix)',
  },
  {
    id: 'drill-28',
    number: 28,
    title: 'Sublinear Prefix Sum of Euler’s Totient φ(n) up to N = 10¹⁰',
    ratingTier: '2600–3300+',
    domain: 'Number Theory & Math',
    problemSummary:
      'Given a single large integer N ≤ 10^10, compute the prefix sum Φ(N) = ∑_{n=1}^N φ(n) modulo 10^9 + 7 and the Mertens function M(N) = ∑_{n=1}^N μ(n), where φ is Euler’s totient function and μ is the Möbius function.',
    constraints:
      '1 ≤ N ≤ 10^10 · Time Limit: 1.5s · Memory Limit: 256 MB',
    options: [
      'Du’s Sieve (Dirichlet Hyperbola Method): linear-sieve up to N^(2/3) + recursive O(√n) quotient block memoization',
      'Linear Euler Sieve allocating phi[1 .. N] of size 10^10',
      'Factorize each integer n ∈ [1..N] independently using Pollard’s Rho',
      'Segment Tree over [1..N]',
    ],
    correctIndex: 0,
    targetComplexity: 'O(N^(2/3)) Time ≈ 2.1 × 10^7 ops, O(N^(2/3)) Space',
    whyCorrect:
      'Using the Dirichlet convolution identities φ * 1 = Id and μ * 1 = ε, the prefix sum S_f(n) = ∑_{i ≤ n} f(i) satisfies g(1)S_f(n) = S_{f*g}(n) - ∑_{d=2}^n g(d) S_f(⌊n/d⌋). Precomputing S_f up to B = N^(2/3) ≈ 4.64 × 10^6 with a linear sieve and grouping the 2√n distinct floor quotients ⌊n/d⌋ evaluates Φ(10^10) in O(N^(2/3)) time.',
    whyOthersFail: [
      {
        optionIndex: 1,
        optionLabel:
          'Linear Euler Sieve allocating phi[1 .. N] of size 10^10',
        failureVerdict: 'MLE',
        reason:
          'An array of 10^10 integers requires 40 GB of RAM and ~15 seconds of CPU time.',
      },
      {
        optionIndex: 2,
        optionLabel:
          'Factorize each integer n ∈ [1..N] independently using Pollard’s Rho',
        failureVerdict: 'TLE',
        reason:
          'Iterating 10^10 times is already Ω(N) = 10^10 operations.',
      },
      {
        optionIndex: 3,
        optionLabel: 'Segment Tree over [1..N]',
        failureVerdict: 'MLE',
        reason:
          'A segment tree cannot compute number-theoretic multiplicative sums or fit 10^10 leaves in memory.',
      },
    ],
    linkedChapterSlug: 'dirichlet-convolution-du-sieve',
    linkedChapterTitle: 'Dirichlet Convolution, Sublinear Du’s Sieve & Min_25 Sieve',
  },
  {
    id: 'drill-29',
    number: 29,
    title: 'Colorful Spanning Forest with GF(2) Linearly Independent Labels',
    ratingTier: '2600–3300+',
    domain: 'Randomized, Games & Interactive',
    problemSummary:
      'You are given an undirected graph G = (V, E) with N vertices and M edges, where each edge e carries a 60-bit integer key k_e. Find the maximum size of an edge subset I ⊆ E such that: (1) I contains no cycles in G (Graphic Matroid), and (2) the keys {k_e : e ∈ I} are linearly independent over GF(2) (Linear XOR Matroid).',
    constraints:
      '1 ≤ N ≤ 60 · 1 ≤ M ≤ 300 · 1 ≤ k_e < 2^60 · Time Limit: 1.5s',
    options: [
      'Matroid Intersection Algorithm (shortest augmenting path in the bipartite exchange graph between Graphic & GF(2) Linear Matroids)',
      'Kruskal’s Greedy Algorithm sorting edges by k_e and checking DSU + XOR Basis simultaneously',
      'Standard s-t Max-Flow between vertices and 60 bit positions',
      '2^M brute-force search over all edge subsets',
    ],
    correctIndex: 0,
    targetComplexity: 'O(R² · M) where R ≤ min(N-1, 60)',
    whyCorrect:
      'Acyclic edge sets form the Graphic Matroid M_1 and GF(2)-independent key sets form the Linear Matroid M_2. The intersection of two matroids is not a matroid, so greedy fails, but Lawler/Edmonds Matroid Intersection builds the bipartite exchange digraph D(I) (using DSU circuits for M_1 and XOR-basis unique representations for M_2) and augments along the shortest X_1 → X_2 BFS path in O(R² M) time.',
    whyOthersFail: [
      {
        optionIndex: 1,
        optionLabel:
          'Kruskal’s Greedy Algorithm sorting edges by k_e and checking DSU + XOR Basis simultaneously',
        failureVerdict: 'WA',
        reason:
          'Greedy without exchange-graph augmentation gets stuck in local maxima of size R/2 (e.g., picking one edge that blocks both a cycle and a basis vector needed by two other edges).',
      },
      {
        optionIndex: 2,
        optionLabel:
          'Standard s-t Max-Flow between vertices and 60 bit positions',
        failureVerdict: 'WA',
        reason:
          'Neither graphic acyclicity nor multi-bit GF(2) linear independence can be encoded as simple bipartite vertex capacities.',
      },
      {
        optionIndex: 3,
        optionLabel: '2^M brute-force search over all edge subsets',
        failureVerdict: 'TLE',
        reason:
          '2^300 subsets is completely intractable.',
      },
    ],
    linkedChapterSlug: 'matroid-intersection',
    linkedChapterTitle: 'Matroid Intersection (Graphic, Linear & Partition Matroids)',
  },
  {
    id: 'drill-30',
    number: 30,
    title: 'Online FIFO Queue of Undirected Graph Edges with Connectivity Queries',
    ratingTier: '2600–3300+',
    domain: 'Randomized, Games & Interactive',
    problemSummary:
      'Maintain an undirected graph on N vertices under Q strictly online operations: (1) PUSH(u, v) appending edge (u, v) to the back of an active FIFO queue of edges, (2) POP() removing the oldest edge from the front of the active FIFO queue, and (3) QUERY() returning the current number of connected components.',
    constraints:
      '1 ≤ N, Q ≤ 2 × 10^5 · Strictly Online FIFO Queue · Time Limit: 2.0s',
    options: [
      'FIFO Queue Simulation on a LIFO Rollback DSU (Binary Counter 2-Color A/B Stack Rebalancing in O(log Q) amortized undo steps)',
      'DSU with Path Compression and direct edge deletion',
      'Offline Segment Tree over Time (Divide and Conquer over edge lifespans)',
      'Rebuild the entire DSU from scratch on every POP() operation',
    ],
    correctIndex: 0,
    targetComplexity: 'O(Q log Q · log N) amortized online',
    whyCorrect:
      'Rollback DSU natively supports only LIFO stack undo(), whereas a queue pops the oldest (bottom) element. By coloring stack elements Type B (back pushes) and Type A (reversed front pops) and using binary-counter block unwinding whenever a Type B element sits at the top during a pop, each edge is unwound and re-pushed at most O(log Q) times amortized, achieving strictly online FIFO deletion.',
    whyOthersFail: [
      {
        optionIndex: 1,
        optionLabel: 'DSU with Path Compression and direct edge deletion',
        failureVerdict: 'WA',
        reason:
          'Path compression destroys historical parent links; you cannot un-union an arbitrary edge without a rollback log.',
      },
      {
        optionIndex: 2,
        optionLabel:
          'Offline Segment Tree over Time (Divide and Conquer over edge lifespans)',
        failureVerdict: 'WA',
        reason:
          'Offline Segment Tree over Time requires knowing each edge’s pop timestamp in advance; here operations are strictly online.',
      },
      {
        optionIndex: 3,
        optionLabel:
          'Rebuild the entire DSU from scratch on every POP() operation',
        failureVerdict: 'TLE',
        reason:
          'With Q/2 pushes followed by Q/2 interleaved pops, rebuilding takes O(Q² log N) ≈ 4 × 10^10 operations.',
      },
    ],
    linkedChapterSlug: 'online-offline-amortized-potential',
    linkedChapterTitle: 'Online-to-Offline Reductions, SWAG & Amortized Potential Method',
  },
];
