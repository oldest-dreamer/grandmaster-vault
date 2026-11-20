import type { VaultBreakdown } from '../../types/vault';

export const VAULT09_ALIENS_LI_CHAO: VaultBreakdown = {
  slug: 'exact-k-partition-aliens-li-chao-tree',
  title:
    'Exact-K Array Partitioning with Non-Monotonic Linear Costs -> Aliens Trick (WQS) + Li Chao Tree',
  rating: 2800,
  ratingTier: '2600–3300+',
  usacoDivision: 'Advanced',
  domain: 'Search, Greedy & DP',
  sourceTag: '2600–2900 Multi-Topic Reduction Vault (WQS Lagrangian Relaxation + Li Chao CHT)',
  reductionHeadline:
    'Collapse an O(K · N²) 2D DP into O(N log N log V) by relaxing the exact-K partition count via a Lagrangian penalty λ and solving the non-monotonic 1D linear envelope with a coordinate-compressed Li Chao Tree.',
  linkedChapters: [
    {
      number: 26,
      slug: 'aliens-trick-wqs-binary-search',
      title: 'Aliens Trick (WQS Binary Search / Lagrangian Relaxation)',
    },
    {
      number: 12,
      slug: 'li-chao-tree-convex-hull-trick',
      title: 'Convex Hull Trick (CHT) & Li Chao Tree',
    },
  ],
  keyTraps: [
    {
      title: 'Trap 1: Collinear Hull Points Breaking Naive cnt == K Termination',
      detail:
        'When the convex cost curve f(k) has flat segments (multiple partition counts k sharing the exact same discrete slope λ), no single λ may uniquely yield cnt == K without tie-breaking. Always tie-break Equal-Cost DP transitions by MINIMUM segment count (pair<long long, int> minimizing {cost, segments}) and binary search for the largest λ where cnt(λ) <= K, then reconstruct ans = dp_cost(λ) - K * λ!',
    },
    {
      title: 'Trap 2: O(X_max) Memory Allocation Inside the WQS Binary Search Loop',
      detail:
        'Because WQS binary search runs ~60 iterations, allocating a dynamic pointer Li Chao Tree over [-10^9, 10^9] on every iteration allocates ~60 * N log(10^9) nodes and triggers MLE/TLE. Instead, coordinate-compress the N distinct query coordinates x_i = P[i] once at the start into an O(N)-node flat array Li Chao Tree!',
    },
  ],
  stage1Statement: {
    statement:
      'You are given an array A[1..N] of signed integers (which can be positive, zero, or negative). Let P[i] = sum_{t=1}^i A[t] be its prefix sum array (with P[0] = 0). You must partition A[1..N] into exactly K non-empty contiguous subarrays (j_0 = 0 < j_1 < j_2 < ... < j_K = N), where segment (j, i] incurs cost (P[i] - P[j])^2 + C_0. Because A[t] can be negative, the prefix sums P[i] are NOT monotonic! Find the minimum total cost over all valid K-partitions (where C_0 = 0, i.e., minimize sum_{r=1}^K (P[j_r] - P[j_{r-1}])^2).',
    constraints: [
      '1 <= K <= N <= 10^5',
      '-10^6 <= A[i] <= 10^6 (so |P[i]| <= 10^{11}, or |P[i]| <= 10^7)',
      'Optimal cost f(k) is convex in k',
      'Time Limit: 2.0 seconds',
    ],
    sampleInput: `5 2
4 -1 3 -2 5`,
    sampleOutput: `41`,
    sampleExplanation:
      'Array A = [4, -1, 3, -2, 5], prefix sums P = [0, 4, 3, 6, 4, 9]. Notice P oscillates (4 -> 3 -> 6 -> 4 -> 9)! We must partition into K = 2 subarrays to minimize (P[j] - 0)^2 + (P[5] - P[j])^2 = P[j]^2 + (9 - P[j])^2. Choosing split point j = 4 (where P[4] = 4) gives subarrays A[1..4] (sum 4) and A[5..5] (sum 5), with total cost 4^2 + 5^2 = 16 + 25 = 41.',
  },
  stage2NaiveFailure: {
    naiveApproaches: [
      {
        approach: 'Standard 2D Dynamic Programming dp[k][i]',
        complexity: 'O(K * N^2)',
        verdict: 'TLE',
        reason:
          'With N, K <= 10^5, O(K * N^2) reaches 10^15 operations.',
      },
      {
        approach: 'K-Layer Li Chao Tree (One Li Chao Tree per Layer k = 1..K)',
        complexity: 'O(K * N log N)',
        verdict: 'TLE',
        reason:
          'Even after optimizing the inner j-loop to O(log N) with Li Chao Tree, running K = 10^5 layers still takes 10^5 * 10^5 * 17 ~ 1.7 * 10^11 operations.',
      },
      {
        approach: 'Aliens Trick + Monotonic Deque Convex Hull Trick',
        complexity: 'O(N log V)',
        verdict: 'WA',
        reason:
          'Because A[i] contains negative numbers, the prefix sums P[i] are NOT monotonic, so both line slopes m_j = -2*P[j] and query points x_i = P[i] jump back and forth, violating the deque CHT monotonicity invariant!',
      },
    ],
    constraintWhispers: [
      'N, K <= 10^5 means we CANNOT loop over k = 1..K. Whenever K is O(N) and the cost function f(k) is convex, Aliens Trick (WQS Binary Search) replaces the K-dimension with O(log V) binary search steps over a penalty parameter lambda!',
      'Expanding the segment cost: (P[i] - P[j])^2 + lambda = (-2*P[j]) * P[i] + (dp[j] + P[j]^2) + P[i]^2 + lambda, which is a linear function L_j(x) = m_j * x + b_j queried at non-monotonic x = P[i].',
      'A coordinate-compressed Li Chao Tree handles arbitrary non-monotonic slopes m_j and non-monotonic query points x = P[i] in O(log N) time with tie-breaking on segment counts!',
    ],
  },
  stage3AhaReduction: {
    coreInsight:
      'Relax the exact-K constraint by charging a Lagrangian penalty λ for every subarray created. For a fixed λ, compute the unconstrained 1D DP dp[i] = min_{0 <= j < i} (dp[j] + (P[i] - P[j])^2 + λ) in O(N log N) time using a coordinate-compressed Li Chao Tree that tracks (cost, segment_count) pairs!',
    steps: [
      {
        title: '1. Algebraic Linearization for Li Chao Tree',
        proofNote:
          'Rewrite dp[i] = P[i]^2 + λ + min_{0 <= j < i} ( (-2 * P[j]) * P[i] + (dp[j] + P[j]^2) ). Each completed state j inserts the line L_j(x) = m_j * x + b_j with slope m_j = -2 * P[j], intercept b_j = dp[j] + P[j]^2, and segment count cnt[j] into the Li Chao Tree.',
      },
      {
        title: '2. Tie-Breaking Line Comparison for Collinear Hulls',
        proofNote:
          'Equip each line in the Li Chao Tree with its segment count c_j = cnt[j]. Define line evaluation at x as the lexicographical pair eval(L, x) = (L.m * x + L.b, L.cnt). A line L_1 beats L_2 at x iff eval(L_1, x) < eval(L_2, x). Since two distinct lines intersect at most once, even with tie-breaking their dominance intervals remain contiguous, preserving the Li Chao Tree bisection invariant!',
      },
      {
        title: '3. Coordinate Compression on Query Points P[1..N]',
        proofNote:
          'Sort and deduplicate all prefix sums xs = unique(sort(P[1..N])). Build a flat array Li Chao Tree of size 4 * |xs|. Each WQS probe resets the 4 * |xs| nodes to the identity line (m=0, b=INF, cnt=INF) in O(N) time and runs the N transitions in O(N log N).',
      },
      {
        title: '4. WQS Binary Search Recovery Formula',
        proofNote:
          'As penalty λ increases from 0 to max_cost, the optimal number of segments cnt(λ) decreases monotonically from N down to 1. Binary search for the largest integer λ where min_segments(λ) <= K (or smallest λ where min_segments(λ) <= K; wait: as λ grows, segments become more expensive so min_segments(λ) DECREASES! Thus we binary search for the smallest λ where min_segments(λ) <= K) and output dp[N].cost - K * best_λ.',
      },
    ],
  },
  stage4DryRun: {
    intro:
      'Trace the Sample Input: A = [4, -1, 3, -2, 5], P = [0, 4, 3, 6, 4, 9], K = 2. Watch how non-monotonic P[i] inserts lines of slope -2*P[j] into the Li Chao Tree across WQS penalty probes until cnt(λ) <= 2 recovers optimal cost 41.',
    traceSteps: [
      {
        stepNumber: 1,
        title: 'Non-Monotonic Prefix Sums & Coordinate Compression',
        explanation:
          'Prefix sums P[0..5] = [0, 4, 3, 6, 4, 9]. Sorted unique query coordinates for the Li Chao Tree are xs = [3, 4, 6, 9] (4 leaves). Base state j = 0 inserts line L_0(x) = 0*x + 0 with cnt = 0.',
        mode: 'array',
        arrays: [
          {
            name: 'Prefix Sums P[0..5] (Oscillating!)',
            cells: [
              { index: 0, value: 0, label: 'P[0]', highlight: 'active' },
              { index: 1, value: 4, label: 'P[1]', highlight: 'window' },
              { index: 2, value: 3, label: 'P[2] < P[1]', highlight: 'updated' },
              { index: 3, value: 6, label: 'P[3]', highlight: 'window' },
              { index: 4, value: 4, label: 'P[4] < P[3]', highlight: 'updated' },
              { index: 5, value: 9, label: 'P[5]', highlight: 'window' },
            ],
          },
        ],
        variables: { K: 2, CompressedLeaves: '[3, 4, 6, 9]', InitialLine: 'L_0(x) = 0' },
      },
      {
        stepNumber: 2,
        title: 'WQS Probe λ = 0: Unconstrained Minimum Uses Too Many Segments',
        explanation:
          'With penalty λ = 0, splitting at zero/negative swings is free or cheap: the DP prefers 3+ segments (e.g., [4,-1]=3, [3,-2]=1, [5]=5 -> cost 9 + 1 + 25 = 35 with cnt = 3 > K = 2). Since cnt(0) = 3 > 2, we must INCREASE penalty λ!',
        mode: 'array',
        arrays: [
          {
            name: 'DP States at Penalty λ = 0',
            cells: [
              { index: 1, value: '16 (c=1)', label: 'i=1', highlight: 'neutral' },
              { index: 2, value: '9 (c=1)', label: 'i=2', highlight: 'active' },
              { index: 3, value: '18 (c=2)', label: 'i=3', highlight: 'neutral' },
              { index: 4, value: '10 (c=2)', label: 'i=4', highlight: 'active' },
              { index: 5, value: '35 (c=3)', label: 'i=5', highlight: 'updated' },
            ],
          },
        ],
        variables: { Lambda: 0, 'dp[5].cost': 35, 'dp[5].cnt': '3 > K=2', Action: 'Increase λ' },
      },
      {
        stepNumber: 3,
        title: 'WQS Probe λ = 20: Li Chao Tree Selects 2-Segment Envelope',
        explanation:
          'At λ = 20, a 3-segment partition pays 3*20 = 60 in penalties (35 + 60 = 95), whereas the 2-segment partition (j=4, P[4]=4) pays 4^2 + 5^2 + 2*20 = 41 + 40 = 81! Line L_4(x) = -8x + (36 + 16) = -8x + 52 evaluated at x = P[5] = 9 gives -72 + 52 + 81 + 20 = 81 with cnt = 2 <= K.',
        mode: 'array',
        arrays: [
          {
            name: 'Li Chao Tree Active Lines at λ = 20',
            cells: [
              { index: 0, value: 'L_0: 0x + 0', label: 'cnt=0', highlight: 'neutral' },
              { index: 1, value: 'L_2: -6x + 38', label: 'cnt=1 (P=3)', highlight: 'window' },
              { index: 2, value: 'L_4: -8x + 52', label: 'cnt=1 (P=4)', highlight: 'active' },
            ],
          },
        ],
        variables: { Lambda: 20, 'dp[5].cost': 81, 'dp[5].cnt': '2 == K', BestSplit: 'j = 4' },
      },
      {
        stepNumber: 4,
        title: 'Lagrangian Recovery: True Cost = dp[N].cost - K * λ = 41',
        explanation:
          'At the threshold penalty best_λ = 6 (where 2-segment cost 41 + 2*6 = 53 first beats 3-segment cost 35 + 3*6 = 53 on tie-break cnt=2), subtracting K * best_λ = 53 - 2*6 recovers the exact K=2 cost 41!',
        mode: 'array',
        arrays: [
          {
            name: 'Optimal K = 2 Partition Recovered',
            cells: [
              { index: 0, value: '[4, -1, 3, -2]', label: 'Seg 1: sum=4, cost=16', highlight: 'updated' },
              { index: 1, value: '[5]', label: 'Seg 2: sum=5, cost=25', highlight: 'updated' },
            ],
          },
        ],
        variables: { ThresholdLambda: 6, PenalizedDP: 53, RecoveredAnswer: '53 - 2*6 = 41' },
      },
    ],
  },
  stage5Solutions: {
    timeComplexity: 'O(N log N log(max_cost))',
    spaceComplexity: 'O(N)',
    implementations: {
      cpp20: `#include <bits/stdc++.h>
using namespace std;

static constexpr long long INF = (1LL << 60);

struct Line {
    long long m = 0;
    long long b = INF;
    int cnt = 1e9;

    pair<long long, int> eval(long long x) const {
        if (b >= INF) return {INF, 1e9};
        return {m * x + b, cnt};
    }
};

struct LiChaoTree {
    int n;
    vector<long long> xs;
    vector<Line> tree;

    explicit LiChaoTree(const vector<long long>& coords) : xs(coords) {
        n = (int)xs.size();
        tree.assign(4 * max(1, n), Line{});
    }

    void clear() {
        fill(tree.begin(), tree.end(), Line{});
    }

    void insert(int p, int l, int r, Line nw) {
        int mid = (l + r) >> 1;
        bool left_better = nw.eval(xs[l]) < tree[p].eval(xs[l]);
        bool mid_better = nw.eval(xs[mid]) < tree[p].eval(xs[mid]);
        if (mid_better) swap(tree[p], nw);
        if (l == r) return;
        if (left_better != mid_better) {
            insert(p << 1, l, mid, nw);
        } else {
            insert(p << 1 | 1, mid + 1, r, nw);
        }
    }

    pair<long long, int> query(int p, int l, int r, int idx) const {
        auto res = tree[p].eval(xs[idx]);
        if (l == r) return res;
        int mid = (l + r) >> 1;
        if (idx <= mid) return min(res, query(p << 1, l, mid, idx));
        return min(res, query(p << 1 | 1, mid + 1, r, idx));
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, k;
    if (!(cin >> n >> k)) return 0;

    vector<long long> P(n + 1, 0);
    vector<long long> xs(n);
    for (int i = 1; i <= n; ++i) {
        long long a;
        cin >> a;
        P[i] = P[i - 1] + a;
        xs[i - 1] = P[i];
    }
    sort(xs.begin(), xs.end());
    xs.erase(unique(xs.begin(), xs.end()), xs.end());

    vector<int> q_idx(n + 1, 0);
    for (int i = 1; i <= n; ++i) {
        q_idx[i] = (int)(lower_bound(xs.begin(), xs.end(), P[i]) - xs.begin());
    }

    int M = (int)xs.size();
    LiChaoTree lct(xs);
    vector<long long> dp(n + 1, 0);
    vector<int> cnt(n + 1, 0);

    auto solve_with_penalty = [&](long long lambda) -> pair<long long, int> {
        lct.clear();
        dp[0] = 0;
        cnt[0] = 0;
        lct.insert(1, 0, M - 1, Line{-2 * P[0], dp[0] + P[0] * P[0], cnt[0]});

        for (int i = 1; i <= n; ++i) {
            auto [best_val, best_c] = lct.query(1, 0, M - 1, q_idx[i]);
            dp[i] = best_val + P[i] * P[i] + lambda;
            cnt[i] = best_c + 1;
            lct.insert(1, 0, M - 1, Line{-2 * P[i], dp[i] + P[i] * P[i], cnt[i]});
        }
        return {dp[n], cnt[n]};
    };

    long long max_p = 0;
    for (int i = 0; i <= n; ++i) max_p = max(max_p, abs(P[i]));
    long long lo = 0, hi = 4 * max_p * max_p + 5;
    long long best_lambda = hi;

    while (lo <= hi) {
        long long mid = lo + (hi - lo) / 2;
        auto [cost, segs] = solve_with_penalty(mid);
        if (segs <= k) {
            best_lambda = mid;
            hi = mid - 1;
        } else {
            lo = mid + 1;
        }
    }

    auto [final_cost, _] = solve_with_penalty(best_lambda);
    cout << (final_cost - 1LL * k * best_lambda) << '\\n';
    return 0;
}`,
      rust: `use std::io::{self, Read};

const INF: i64 = 1i64 << 60;

#[derive(Clone, Copy)]
struct Line {
    m: i64,
    b: i64,
    cnt: i32,
}

impl Default for Line {
    fn default() -> Self {
        Self { m: 0, b: INF, cnt: 1_000_000_000 }
    }
}

impl Line {
    fn eval(&self, x: i64) -> (i64, i32) {
        if self.b >= INF {
            (INF, 1_000_000_000)
        } else {
            (self.m * x + self.b, self.cnt)
        }
    }
}

struct LiChaoTree {
    xs: Vec<i64>,
    tree: Vec<Line>,
}

impl LiChaoTree {
    fn new(xs: Vec<i64>) -> Self {
        let m = xs.len().max(1);
        Self {
            xs,
            tree: vec![Line::default(); 4 * m],
        }
    }

    fn clear(&mut self) {
        self.tree.fill(Line::default());
    }

    fn insert(&mut self, p: usize, l: usize, r: usize, mut nw: Line) {
        let mid = (l + r) >> 1;
        let left_better = nw.eval(self.xs[l]) < self.tree[p].eval(self.xs[l]);
        let mid_better = nw.eval(self.xs[mid]) < self.tree[p].eval(self.xs[mid]);
        if mid_better {
            std::mem::swap(&mut self.tree[p], &mut nw);
        }
        if l == r {
            return;
        }
        if left_better != mid_better {
            self.insert(p << 1, l, mid, nw);
        } else {
            self.insert(p << 1 | 1, mid + 1, r, nw);
        }
    }

    fn query(&self, p: usize, l: usize, r: usize, idx: usize) -> (i64, i32) {
        let res = self.tree[p].eval(self.xs[idx]);
        if l == r {
            return res;
        }
        let mid = (l + r) >> 1;
        let sub = if idx <= mid {
            self.query(p << 1, l, mid, idx)
        } else {
            self.query(p << 1 | 1, mid + 1, r, idx)
        };
        res.min(sub)
    }
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let Some(n_str) = it.next() else { return; };
    let n: usize = n_str.parse().unwrap();
    let k: i32 = it.next().unwrap().parse().unwrap();

    let mut p = vec![0i64; n + 1];
    let mut xs = Vec::with_capacity(n);
    for i in 1..=n {
        let a: i64 = it.next().unwrap().parse().unwrap();
        p[i] = p[i - 1] + a;
        xs.push(p[i]);
    }
    xs.sort_unstable();
    xs.dedup();

    let mut q_idx = vec![0usize; n + 1];
    for i in 1..=n {
        q_idx[i] = xs.binary_search(&p[i]).unwrap();
    }

    let m = xs.len();
    let mut lct = LiChaoTree::new(xs);
    let mut dp = vec![0i64; n + 1];
    let mut cnt = vec![0i32; n + 1];

    let mut solve_penalty = |lambda: i64| -> (i64, i32) {
        lct.clear();
        dp[0] = 0;
        cnt[0] = 0;
        lct.insert(1, 0, m - 1, Line { m: 0, b: 0, cnt: 0 });
        for i in 1..=n {
            let (best_val, best_c) = lct.query(1, 0, m - 1, q_idx[i]);
            dp[i] = best_val + p[i] * p[i] + lambda;
            cnt[i] = best_c + 1;
            lct.insert(
                1,
                0,
                m - 1,
                Line {
                    m: -2 * p[i],
                    b: dp[i] + p[i] * p[i],
                    cnt: cnt[i],
                },
            );
        }
        (dp[n], cnt[n])
    };

    let max_p = p.iter().map(|x| x.abs()).max().unwrap_or(0);
    let mut lo = 0i64;
    let mut hi = 4 * max_p * max_p + 5;
    let mut best_lambda = hi;

    while lo <= hi {
        let mid = lo + (hi - lo) / 2;
        let (_cost, segs) = solve_penalty(mid);
        if segs <= k {
            best_lambda = mid;
            hi = mid - 1;
        } else {
            lo = mid + 1;
        }
    }

    let (final_cost, _) = solve_penalty(best_lambda);
    println!("{}", final_cost - (k as i64) * best_lambda);
}`,
      java21: `import java.io.*;
import java.util.*;

public class Main {
    static final long INF = 1L << 60;

    static final class FastScanner {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer("");
        String next() throws IOException {
            while (!st.hasMoreTokens()) {
                String line = br.readLine();
                if (line == null) return null;
                st = new StringTokenizer(line);
            }
            return st.nextToken();
        }
        int nextInt() throws IOException { return Integer.parseInt(next()); }
        long nextLong() throws IOException { return Long.parseLong(next()); }
    }

    static long[] xs;
    static long[] treeM, treeB;
    static int[] treeC;

    static long evalVal(int node, long x) {
        if (treeB[node] >= INF) return INF;
        return treeM[node] * x + treeB[node];
    }

    static boolean isBetter(long m1, long b1, int c1, long m2, long b2, int c2, long x) {
        long v1 = (b1 >= INF) ? INF : m1 * x + b1;
        long v2 = (b2 >= INF) ? INF : m2 * x + b2;
        if (v1 != v2) return v1 < v2;
        return c1 < c2;
    }

    static void insert(int p, int l, int r, long m, long b, int c) {
        int mid = (l + r) >> 1;
        boolean leftBetter = isBetter(m, b, c, treeM[p], treeB[p], treeC[p], xs[l]);
        boolean midBetter = isBetter(m, b, c, treeM[p], treeB[p], treeC[p], xs[mid]);
        if (midBetter) {
            long tm = treeM[p]; treeM[p] = m; m = tm;
            long tb = treeB[p]; treeB[p] = b; b = tb;
            int tc = treeC[p]; treeC[p] = c; c = tc;
        }
        if (l == r || b >= INF) return;
        if (leftBetter != midBetter) insert(p << 1, l, mid, m, b, c);
        else insert(p << 1 | 1, mid + 1, r, m, b, c);
    }

    static long bestVal;
    static int bestCnt;

    static void query(int p, int l, int r, int idx) {
        long v = evalVal(p, xs[idx]);
        int c = treeC[p];
        if (v < bestVal || (v == bestVal && c < bestCnt)) {
            bestVal = v;
            bestCnt = c;
        }
        if (l == r) return;
        int mid = (l + r) >> 1;
        if (idx <= mid) query(p << 1, l, mid, idx);
        else query(p << 1 | 1, mid + 1, r, idx);
    }

    static long[] solvePenalty(long lambda, int n, int M, long[] P, int[] qIdx, long[] dp, int[] cnt) {
        Arrays.fill(treeM, 0);
        Arrays.fill(treeB, INF);
        Arrays.fill(treeC, 1_000_000_000);
        dp[0] = 0;
        cnt[0] = 0;
        insert(1, 0, M - 1, 0, 0, 0);

        for (int i = 1; i <= n; i++) {
            bestVal = INF;
            bestCnt = 1_000_000_000;
            query(1, 0, M - 1, qIdx[i]);
            dp[i] = bestVal + P[i] * P[i] + lambda;
            cnt[i] = bestCnt + 1;
            insert(1, 0, M - 1, -2 * P[i], dp[i] + P[i] * P[i], cnt[i]);
        }
        return new long[]{dp[n], cnt[n]};
    }

    public static void main(String[] args) throws Exception {
        FastScanner sc = new FastScanner();
        String first = sc.next();
        if (first == null) return;
        int n = Integer.parseInt(first);
        int k = sc.nextInt();

        long[] P = new long[n + 1];
        long[] raw = new long[n];
        long maxP = 0;
        for (int i = 1; i <= n; i++) {
            P[i] = P[i - 1] + sc.nextLong();
            raw[i - 1] = P[i];
            maxP = Math.max(maxP, Math.abs(P[i]));
        }
        Arrays.sort(raw);
        int M = 0;
        for (int i = 0; i < n; i++) {
            if (i == 0 || raw[i] != raw[i - 1]) raw[M++] = raw[i];
        }
        xs = Arrays.copyOf(raw, M);

        int[] qIdx = new int[n + 1];
        for (int i = 1; i <= n; i++) qIdx[i] = Arrays.binarySearch(xs, P[i]);

        treeM = new long[4 * M];
        treeB = new long[4 * M];
        treeC = new int[4 * M];
        long[] dp = new long[n + 1];
        int[] cnt = new int[n + 1];

        long lo = 0, hi = 4 * maxP * maxP + 5, bestLambda = hi;
        while (lo <= hi) {
            long mid = lo + (hi - lo) / 2;
            long[] res = solvePenalty(mid, n, M, P, qIdx, dp, cnt);
            if (res[1] <= k) {
                bestLambda = mid;
                hi = mid - 1;
            } else {
                lo = mid + 1;
            }
        }
        long[] fin = solvePenalty(bestLambda, n, M, P, qIdx, dp, cnt);
        System.out.println(fin[0] - k * bestLambda);
    }
}`,
      python3: `from bisect import bisect_left
import sys

sys.setrecursionlimit(200000)
INF = 1 << 60

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    k = int(data[1])
    A = [int(x) for x in data[2 : 2 + n]]

    P = [0] * (n + 1)
    for i in range(1, n + 1):
        P[i] = P[i - 1] + A[i - 1]

    xs = sorted(set(P[1:]))
    M = len(xs)
    q_idx = [0] * (n + 1)
    for i in range(1, n + 1):
        q_idx[i] = bisect_left(xs, P[i])

    tree_m = [0] * (4 * M)
    tree_b = [INF] * (4 * M)
    tree_c = [10**9] * (4 * M)

    def eval_line(m: int, b: int, c: int, x: int):
        if b >= INF:
            return (INF, 10**9)
        return (m * x + b, c)

    def insert(p: int, l: int, r: int, m: int, b: int, c: int) -> None:
        while True:
            mid = (l + r) >> 1
            left_better = eval_line(m, b, c, xs[l]) < eval_line(
                tree_m[p], tree_b[p], tree_c[p], xs[l]
            )
            mid_better = eval_line(m, b, c, xs[mid]) < eval_line(
                tree_m[p], tree_b[p], tree_c[p], xs[mid]
            )
            if mid_better:
                tree_m[p], m = m, tree_m[p]
                tree_b[p], b = b, tree_b[p]
                tree_c[p], c = c, tree_c[p]
            if l == r or b >= INF:
                return
            if left_better != mid_better:
                p = p << 1
                r = mid
            else:
                p = p << 1 | 1
                l = mid + 1

    def query(idx: int):
        p, l, r = 1, 0, M - 1
        x = xs[idx]
        best = (INF, 10**9)
        while True:
            cand = eval_line(tree_m[p], tree_b[p], tree_c[p], x)
            if cand < best:
                best = cand
            if l == r:
                return best
            mid = (l + r) >> 1
            if idx <= mid:
                p = p << 1
                r = mid
            else:
                p = p << 1 | 1
                l = mid + 1

    def solve_penalty(lam: int):
        for i in range(4 * M):
            tree_m[i] = 0
            tree_b[i] = INF
            tree_c[i] = 10**9
        insert(1, 0, M - 1, 0, 0, 0)
        dp_n = 0
        cnt_n = 0
        for i in range(1, n + 1):
            val, c = query(q_idx[i])
            pi = P[i]
            dp_i = val + pi * pi + lam
            cnt_i = c + 1
            insert(1, 0, M - 1, -2 * pi, dp_i + pi * pi, cnt_i)
            if i == n:
                dp_n, cnt_n = dp_i, cnt_i
        return dp_n, cnt_n

    max_p = max(abs(x) for x in P)
    lo, hi = 0, 4 * max_p * max_p + 5
    best_lam = hi
    while lo <= hi:
        mid = (lo + hi) // 2
        _, segs = solve_penalty(mid)
        if segs <= k:
            best_lam = mid
            hi = mid - 1
        else:
            lo = mid + 1

    final_cost, _ = solve_penalty(best_lam)
    print(final_cost - k * best_lam)

if __name__ == "__main__":
    solve()`,
      ruby: `INF = 1 << 60

tokens = STDIN.read.split.map(&:to_i)
exit if tokens.empty?
n = tokens[0]
k = tokens[1]
p_arr = Array.new(n + 1, 0)
(1..n).each { |i| p_arr[i] = p_arr[i - 1] + tokens[i + 1] }

xs = p_arr[1..n].uniq.sort
m_len = xs.size
q_idx = Array.new(n + 1, 0)
(1..n).each { |i| q_idx[i] = xs.bsearch_index { |v| v >= p_arr[i] } }

tree_m = Array.new(4 * m_len, 0)
tree_b = Array.new(4 * m_len, INF)
tree_c = Array.new(4 * m_len, 1_000_000_000)

eval_line = lambda do |m, b, c, x|
  b >= INF ? [INF, 1_000_000_000] : [m * x + b, c]
end

insert_line = lambda do |m, b, c|
  p = 1; l = 0; r = m_len - 1
  loop do
    mid = (l + r) >> 1
    lb = (eval_line.call(m, b, c, xs[l]) <=> eval_line.call(tree_m[p], tree_b[p], tree_c[p], xs[l])) < 0
    mb = (eval_line.call(m, b, c, xs[mid]) <=> eval_line.call(tree_m[p], tree_b[p], tree_c[p], xs[mid])) < 0
    if mb
      tree_m[p], m = m, tree_m[p]
      tree_b[p], b = b, tree_b[p]
      tree_c[p], c = c, tree_c[p]
    end
    break if l == r || b >= INF
    if lb != mb
      p <<= 1; r = mid
    else
      p = (p << 1) | 1; l = mid + 1
    end
  end
end

query_line = lambda do |idx|
  p = 1; l = 0; r = m_len - 1
  x = xs[idx]
  best_v = INF; best_c = 1_000_000_000
  loop do
    if tree_b[p] < INF
      v = tree_m[p] * x + tree_b[p]
      c = tree_c[p]
      if v < best_v || (v == best_v && c < best_c)
        best_v = v; best_c = c
      end
    end
    break if l == r
    mid = (l + r) >> 1
    if idx <= mid
      p <<= 1; r = mid
    else
      p = (p << 1) | 1; l = mid + 1
    end
  end
  [best_v, best_c]
end

solve_penalty = lambda do |lam|
  tree_m.fill(0)
  tree_b.fill(INF)
  tree_c.fill(1_000_000_000)
  insert_line.call(0, 0, 0)
  dp_n = 0; cnt_n = 0
  (1..n).each do |i|
    val, c = query_line.call(q_idx[i])
    pi = p_arr[i]
    dp_i = val + pi * pi + lam
    cnt_i = c + 1
    insert_line.call(-2 * pi, dp_i + pi * pi, cnt_i)
    if i == n
      dp_n = dp_i; cnt_n = cnt_i
    end
  end
  [dp_n, cnt_n]
end

max_p = p_arr.map(&:abs).max
lo = 0
hi = 4 * max_p * max_p + 5
best_lam = hi

while lo <= hi
  mid = (lo + hi) / 2
  _cost, segs = solve_penalty.call(mid)
  if segs <= k
    best_lam = mid
    hi = mid - 1
  else
    lo = mid + 1
  end
end

final_cost, _ = solve_penalty.call(best_lam)
puts(final_cost - k * best_lam)`,
    },
  },
};
