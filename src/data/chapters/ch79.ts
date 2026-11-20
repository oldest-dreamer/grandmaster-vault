import type { TheoryChapter } from '../../types/vault';

export const CH79_COLOR_CODING_FPT: TheoryChapter = {
  slug: 'color-coding-random-bipartition',
  topicId: 'th-75',
  title: 'Color Coding & Random Partitioning (FPT Algorithms)',
  domain: 'Theoretical & Randomized',
  ratingTier: '2200–2600',
  usacoDivision: 'Platinum',
  subtitle: 'Alon-Yuster-Zwick randomized vertex coloring, O(2^K E) colorful path and tree bitmask DP, and O(e^K poly) fixed-parameter subgraph discovery',
  analogyTitle: 'Turning N-Vertex Self-Intersection Checks Into a K-Bit Palette',
  analogyBody:
    'Finding a minimum-weight simple path or simple cycle of length K in a general graph is NP-hard when K is part of the input, because standard DP dp[len][u] cannot prevent revisiting earlier vertices without tracking an O(2^N) bitmask of all N vertices.\n\nAlon, Yuster, and Zwick’s Color Coding technique breaks this exponential dependence on N into a Fixed-Parameter Tractable (FPT) dependency purely on K: assign every vertex v in V a uniformly random color col[v] in {0, 1, ..., K - 1}, and restrict our search strictly to "colorful" subgraphs where all K vertices carry distinct colors. Any colorful path or tree is automatically simple, so bitmask DP only needs a K-bit mask dp[mask][u] running in O(2^K E) time per trial!\n\nAny fixed optimal K-vertex target subgraph receives K distinct colors in a single trial with probability P_hit = K! / K^K >= e^{-K}. Repeating T = ceil(C * K^K / K!) independent randomized trials drives the failure probability (1 - P_hit)^T <= e^{-C} below 10^-9 while keeping total work O(e^K * 2^K * E) = O((2e)^K E). For K-cycles, anchoring the smallest vertex ID s to color 0 and coloring only vertices v > s with {1..K-1} cuts the required trials by a further factor of ~e.',
  prerequisites: [
    { slug: 'bitmask-dp-sos', title: 'Bitmask DP, Submask Iteration & SOS DP' },
  ],
  traceTitle: 'Color Coding Bitmask DP on K = 4 Colorful Simple Path',
  traceSubtitle: 'Random 4-coloring vertices, propagating dp[mask][u] in O(2^K E), and bounding failure probability across T trials',
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Step 1: Assign Random K-Coloring col[v] in {0, 1, 2, 3}',
      explanation: 'Every vertex receives a color from 0..K-1. Suppose the optimal 4-vertex path 4 - 3 - 2 - 5 (weight 1 + 2 + 3 = 6) receives colors [0, 1, 2, 3]—making it a valid colorful path in this trial.',
      mode: 'graph',
      graph: {
        nodes: [
          { id: '1', label: '1 (c1)', x: 80, y: 70, state: 'unmatched' },
          { id: '2', label: '2 (c2)', x: 220, y: 70, state: 'active' },
          { id: '3', label: '3 (c1)', x: 220, y: 175, state: 'active' },
          { id: '4', label: '4 (c0)', x: 80, y: 175, state: 'matched' },
          { id: '5', label: '5 (c3)', x: 360, y: 70, state: 'matched' },
          { id: '6', label: '6 (c0)', x: 360, y: 175, state: 'unmatched' },
        ],
        edges: [
          { id: 'e12', from: '1', to: '2', weight: 5, state: 'default' },
          { id: 'e23', from: '2', to: '3', weight: 2, state: 'matched' },
          { id: 'e34', from: '3', to: '4', weight: 1, state: 'matched' },
          { id: 'e45', from: '4', to: '5', weight: 4, state: 'default' },
          { id: 'e13', from: '1', to: '3', weight: 10, state: 'default' },
          { id: 'e25', from: '2', to: '5', weight: 3, state: 'matched' },
          { id: 'e56', from: '5', to: '6', weight: 2, state: 'default' },
        ],
        calloutMetric: 'Trial Hit Prob: 4!/4^4 = 24/256 = 9.38%',
      },
      variables: { K: 4, hitProbSingleTrial: '9.38%', trialsFor1e9: 210, paletteBits: 4 },
    },
    {
      stepNumber: 2,
      title: 'Step 2: Propagate Colorful Path DP dp[mask][u] in O(2^K E)',
      explanation: 'Initialize dp[1 << col[u]][u] = 0 for all u. For each mask, relax every edge (u, v, w) when (mask & (1 << col[v])) == 0 into dp[mask | (1 << col[v])][v].',
      mode: 'array',
      arrays: [
        {
          name: 'Optimal Colorful States Along 4 -> 3 -> 2 -> 5',
          cells: [
            { index: 0, value: 'dp[0001][4] = 0', label: 'start', highlight: 'neutral' },
            { index: 1, value: 'dp[0011][3] = 1', label: '+4->3', highlight: 'active' },
            { index: 2, value: 'dp[0111][2] = 3', label: '+3->2', highlight: 'active' },
            { index: 3, value: 'dp[1111][5] = 6', label: '+2->5', highlight: 'updated' },
          ],
        },
      ],
      variables: { maskFull: '1111 (15)', bestThisTrial: 6, transitionsPerTrial: 'O(2^K * E)' },
    },
    {
      stepNumber: 3,
      title: 'Step 3: Repeat Across T Independent Trials & Take Global Minimum',
      explanation: 'After T trials with SplitMix64 re-colorings, global minimum min_trial min_u dp[(1<<K)-1][u] converges to the exact optimal weight 6 with failure probability < 10^-9.',
      mode: 'array',
      arrays: [
        {
          name: 'Cumulative Success Probability vs Trial Count (K = 4)',
          cells: [
            { index: 1, value: '9.4%', label: 'T=1', highlight: 'neutral' },
            { index: 10, value: '62.7%', label: 'T=10', highlight: 'active' },
            { index: 50, value: '99.27%', label: 'T=50', highlight: 'active' },
            { index: 200, value: '99.9999997%', label: 'T=200', highlight: 'updated' },
          ],
        },
      ],
      variables: { globalBest: 6, optimalPath: '4 - 3 - 2 - 5', errorBound: '< 3e-9' },
    },
  ],
  reductionClues: [
    {
      clue: 'Find minimum or maximum weight simple path of small fixed length K (K <= 10) in a graph of N <= 2000',
      translation: 'Randomly color vertices with K colors and run dp[mask][u] in O(2^K E) across O(e^K) independent trials.',
    },
    {
      clue: 'Find optimal K-vertex connected subgraph / K-edge Steiner tree without visiting vertices twice',
      translation: 'Color Coding + submask tree merging dp[mask][u] = opt(dp[sub][u] + dp[mask ^ sub][v] + w(u, v)) in O(3^K E) per trial.',
    },
    {
      clue: 'Detect or optimize a simple cycle of exact length K (3 <= K <= 8) in a general graph',
      translation: 'Anchor minimum vertex ID s in the cycle with color 0, color vertices v > s with {1..K-1}, and close paths back to s.',
    },
    {
      clue: 'Probabilistic failure bound must stay below 10^-6 under strict contest time limits',
      translation: 'Compute exact P_hit = K!/K^K and set trial count T ~ ceil(18 / P_hit) (capped for K=8 or time-budgeted) with fast SplitMix64 re-coloring.',
    },
  ],
  timeComplexity: 'O(T * 2^K * E) for K-paths (T = O(e^K)); O(T * 3^K * E) for K-vertex trees',
  spaceComplexity: 'O(2^K * N)',
  pitfalls: [
    {
      type: 'WA',
      title: 'Confusing K Vertices With K Edges in Palette Size',
      detail: 'A simple path of K vertices has K - 1 edges and needs K colors (mask up to 2^K - 1). A path of K edges has K + 1 vertices and needs K + 1 colors!',
    },
    {
      type: 'TLE',
      title: 'Running Naive K^K / K! Trials Without Capping or Pruning Unreachable States',
      detail: 'Skip any state dp[mask][u] == INF before iterating over adjacency lists of u, and flatten dp[mask * N + u] into a single contiguous array for L1 cache locality.',
    },
    {
      type: 'WA',
      title: 'Allowing Submask Overlap in Colorful Tree Merging',
      detail: 'In colorful K-vertex tree DP, when merging subtrees rooted at u and v across edge (u, v), submask m1 MUST contain bit col[u], m2 MUST contain bit col[v], and (m1 & m2) == 0.',
    },
    {
      type: 'WA',
      title: 'Weak Linear Congruential Modulo Low Bits Causing Correlated Colorings',
      detail: 'Never use raw rand() % K or low bits of simple LCGs. Use SplitMix64 mixing so every vertex color is independent across all trials.',
    },
  ],
  implementations: {
    cpp20: `#include <algorithm>
#include <cstdint>
#include <iostream>
#include <limits>
#include <vector>

using namespace std;

static constexpr long long INF = (1LL << 60);

struct Edge {
    int to;
    long long w;
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m, k;
    if (!(cin >> n >> m >> k)) return 0;
    vector<vector<Edge>> adj(n);
    for (int i = 0; i < m; ++i) {
        int u, v;
        long long w;
        cin >> u >> v >> w;
        --u;
        --v;
        if (u == v) continue;
        adj[u].push_back({v, w});
        adj[v].push_back({u, w});
    }
    if (k == 1) {
        cout << 0 << '\\n';
        return 0;
    }

    int full = (1 << k) - 1;
    // Choose trial count T ~ 18 * K^K / K! bounded for fast execution
    double inv_prob = 1.0;
    for (int i = 1; i <= k; ++i) inv_prob *= (double)k / (double)i;
    int trials = max(40, min(800, (int)(inv_prob * 16.0)));

    uint64_t seed = 0x9E3779B97F4A7C15ULL ^ (uint64_t)(n * 131 + k);
    auto next_u64 = [&]() -> uint64_t {
        seed += 0x9E3779B97F4A7C15ULL;
        uint64_t z = seed;
        z = (z ^ (z >> 30)) * 0xBF58476D1CE4E5B9ULL;
        z = (z ^ (z >> 27)) * 0x94D049BB133111EBULL;
        return z ^ (z >> 31);
    };

    vector<int> col(n);
    vector<long long> dp((size_t)(1 << k) * n);
    long long best = INF;

    for (int t = 0; t < trials; ++t) {
        for (int i = 0; i < n; ++i) col[i] = (int)(next_u64() % (uint64_t)k);
        fill(dp.begin(), dp.end(), INF);
        for (int i = 0; i < n; ++i) dp[(1 << col[i]) * n + i] = 0;

        for (int mask = 1; mask < full; ++mask) {
            int base = mask * n;
            for (int u = 0; u < n; ++u) {
                long long cur = dp[base + u];
                if (cur >= best) continue;
                for (const auto& e : adj[u]) {
                    int bit = 1 << col[e.to];
                    if (mask & bit) continue;
                    int nidx = (mask | bit) * n + e.to;
                    long long cand = cur + e.w;
                    if (cand < dp[nidx]) dp[nidx] = cand;
                }
            }
        }
        int fbase = full * n;
        for (int u = 0; u < n; ++u) {
            if (dp[fbase + u] < best) best = dp[fbase + u];
        }
    }

    if (best >= INF / 2) cout << -1 << '\\n';
    else cout << best << '\\n';
    return 0;
}`,
    rust: `use std::io::{self, Read};

const INF: i64 = 1_i64 << 60;

fn next_u64(seed: &mut u64) -> u64 {
    *seed = seed.wrapping_add(0x9E37_79B9_7F4A_7C15);
    let mut z = *seed;
    z = (z ^ (z >> 30)).wrapping_mul(0xBF58_476D_1CE4_E5B9);
    z = (z ^ (z >> 27)).wrapping_mul(0x94D0_49BB_1331_11EB);
    z ^ (z >> 31)
}

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let n: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };
    let m: usize = it.next().unwrap().parse().unwrap();
    let k: usize = it.next().unwrap().parse().unwrap();
    let mut adj = vec![Vec::<(usize, i64)>::new(); n];
    for _ in 0..m {
        let u: usize = it.next().unwrap().parse::<usize>().unwrap() - 1;
        let v: usize = it.next().unwrap().parse::<usize>().unwrap() - 1;
        let w: i64 = it.next().unwrap().parse().unwrap();
        if u == v {
            continue;
        }
        adj[u].push((v, w));
        adj[v].push((u, w));
    }
    if k == 1 {
        println!("0");
        return;
    }

    let full = (1usize << k) - 1;
    let mut inv_prob = 1.0_f64;
    for i in 1..=k {
        inv_prob *= (k as f64) / (i as f64);
    }
    let trials = ((inv_prob * 16.0) as usize).clamp(40, 800);

    let mut seed: u64 = 0x9E37_79B9_7F4A_7C15 ^ ((n * 131 + k) as u64);
    let mut col = vec![0usize; n];
    let mut dp = vec![INF; (1usize << k) * n];
    let mut best = INF;

    for _ in 0..trials {
        for c in &mut col {
            *c = (next_u64(&mut seed) as usize) % k;
        }
        dp.fill(INF);
        for i in 0..n {
            dp[(1usize << col[i]) * n + i] = 0;
        }
        for mask in 1..full {
            let base = mask * n;
            for u in 0..n {
                let cur = dp[base + u];
                if cur >= best {
                    continue;
                }
                for &(v, w) in &adj[u] {
                    let bit = 1usize << col[v];
                    if (mask & bit) != 0 {
                        continue;
                    }
                    let nidx = (mask | bit) * n + v;
                    let cand = cur + w;
                    if cand < dp[nidx] {
                        dp[nidx] = cand;
                    }
                }
            }
        }
        let fbase = full * n;
        for u in 0..n {
            if dp[fbase + u] < best {
                best = dp[fbase + u];
            }
        }
    }

    if best >= INF / 2 {
        println!("-1");
    } else {
        println!("{}", best);
    }
}`,
    java21: `import java.io.BufferedInputStream;
import java.io.IOException;
import java.util.Arrays;

public class Main {
    static final long INF = 1L << 60;

    static class FastScanner {
        private final BufferedInputStream in = new BufferedInputStream(System.in);
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;

        private int readByte() throws IOException {
            if (ptr >= len) {
                ptr = 0;
                len = in.read(buf);
                if (len <= 0) return -1;
            }
            return buf[ptr++];
        }

        long nextLong() throws IOException {
            int c = readByte();
            while (c >= 0 && c <= 32) c = readByte();
            if (c < 0) return 0;
            long sign = 1;
            if (c == '-') { sign = -1; c = readByte(); }
            long res = 0;
            while (c > 32) { res = res * 10 + (c - '0'); c = readByte(); }
            return res * sign;
        }
    }

    static long seed;

    static long nextU64() {
        seed += 0x9E3779B97F4A7C15L;
        long z = seed;
        z = (z ^ (z >>> 30)) * 0xBF58476D1CE4E5B9L;
        z = (z ^ (z >>> 27)) * 0x94D049BB133111EBL;
        return z ^ (z >>> 31);
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        int n = (int) fs.nextLong();
        if (n == 0) return;
        int m = (int) fs.nextLong();
        int k = (int) fs.nextLong();

        int[] head = new int[n];
        Arrays.fill(head, -1);
        int[] to = new int[2 * m + 1];
        int[] nxt = new int[2 * m + 1];
        long[] wt = new long[2 * m + 1];
        int ec = 0;
        for (int i = 0; i < m; i++) {
            int u = (int) fs.nextLong() - 1;
            int v = (int) fs.nextLong() - 1;
            long w = fs.nextLong();
            if (u == v) continue;
            to[ec] = v; wt[ec] = w; nxt[ec] = head[u]; head[u] = ec++;
            to[ec] = u; wt[ec] = w; nxt[ec] = head[v]; head[v] = ec++;
        }
        if (k == 1) {
            System.out.println(0);
            return;
        }

        int full = (1 << k) - 1;
        double invProb = 1.0;
        for (int i = 1; i <= k; i++) invProb *= (double) k / i;
        int trials = Math.max(40, Math.min(800, (int) (invProb * 16.0)));

        seed = 0x9E3779B97F4A7C15L ^ (n * 131L + k);
        int[] col = new int[n];
        long[] dp = new long[(1 << k) * n];
        long best = INF;

        for (int t = 0; t < trials; t++) {
            for (int i = 0; i < n; i++) {
                col[i] = (int) Long.remainderUnsigned(nextU64(), k);
            }
            Arrays.fill(dp, INF);
            for (int i = 0; i < n; i++) dp[(1 << col[i]) * n + i] = 0;

            for (int mask = 1; mask < full; mask++) {
                int base = mask * n;
                for (int u = 0; u < n; u++) {
                    long cur = dp[base + u];
                    if (cur >= best) continue;
                    for (int e = head[u]; e != -1; e = nxt[e]) {
                        int v = to[e];
                        int bit = 1 << col[v];
                        if ((mask & bit) != 0) continue;
                        int nidx = (mask | bit) * n + v;
                        long cand = cur + wt[e];
                        if (cand < dp[nidx]) dp[nidx] = cand;
                    }
                }
            }
            int fbase = full * n;
            for (int u = 0; u < n; u++) {
                if (dp[fbase + u] < best) best = dp[fbase + u];
            }
        }
        System.out.println(best >= INF / 2 ? -1 : best);
    }
}`,
    python3: `import sys

sys.setrecursionlimit(200000)
INF = 1 << 60
MASK64 = (1 << 64) - 1


def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    m = int(data[1])
    k = int(data[2])
    adj = [[] for _ in range(n)]
    idx = 3
    for _ in range(m):
        u = int(data[idx]) - 1
        v = int(data[idx + 1]) - 1
        w = int(data[idx + 2])
        idx += 3
        if u == v:
            continue
        adj[u].append((v, w))
        adj[v].append((u, w))
    if k == 1:
        sys.stdout.write("0\\n")
        return

    full = (1 << k) - 1
    inv_prob = 1.0
    for i in range(1, k + 1):
        inv_prob *= k / i
    trials = max(40, min(600, int(inv_prob * 16.0)))

    seed = (0x9E3779B97F4A7C15 ^ (n * 131 + k)) & MASK64
    best = INF
    sz = (1 << k) * n

    for _ in range(trials):
        col = [0] * n
        for i in range(n):
            seed = (seed + 0x9E3779B97F4A7C15) & MASK64
            z = ((seed ^ (seed >> 30)) * 0xBF58476D1CE4E5B9) & MASK64
            z = ((z ^ (z >> 27)) * 0x94D049BB133111EB) & MASK64
            z ^= z >> 31
            col[i] = z % k
        dp = [INF] * sz
        for i in range(n):
            dp[(1 << col[i]) * n + i] = 0
        for mask in range(1, full):
            base = mask * n
            for u in range(n):
                cur = dp[base + u]
                if cur >= best:
                    continue
                for v, w in adj[u]:
                    bit = 1 << col[v]
                    if mask & bit:
                        continue
                    nidx = (mask | bit) * n + v
                    cand = cur + w
                    if cand < dp[nidx]:
                        dp[nidx] = cand
        fbase = full * n
        for u in range(n):
            if dp[fbase + u] < best:
                best = dp[fbase + u]

    sys.stdout.write(f"{-1 if best >= INF // 2 else best}\\n")


if __name__ == "__main__":
    solve()`,
    ruby: `INF = 1 << 60
MASK64 = (1 << 64) - 1

data = STDIN.read.split
exit if data.empty?
n = data[0].to_i
m = data[1].to_i
k = data[2].to_i
adj = Array.new(n) { [] }
idx = 3
m.times do
  u = data[idx].to_i - 1
  v = data[idx + 1].to_i - 1
  w = data[idx + 2].to_i
  idx += 3
  next if u == v
  adj[u] << [v, w]
  adj[v] << [u, w]
end

if k == 1
  puts 0
  exit
end

full = (1 << k) - 1
inv_prob = 1.0
(1..k).each { |i| inv_prob *= k.to_f / i }
trials = [[(inv_prob * 16.0).to_i, 40].max, 600].min

seed = (0x9E3779B97F4A7C15 ^ (n * 131 + k)) & MASK64
best = INF
sz = (1 << k) * n

trials.times do
  col = Array.new(n)
  n.times do |i|
    seed = (seed + 0x9E3779B97F4A7C15) & MASK64
    z = ((seed ^ (seed >> 30)) * 0xBF58476D1CE4E5B9) & MASK64
    z = ((z ^ (z >> 27)) * 0x94D049BB133111EB) & MASK64
    z ^= z >> 31
    col[i] = z % k
  end
  dp = Array.new(sz, INF)
  n.times { |i| dp[(1 << col[i]) * n + i] = 0 }
  (1...full).each do |mask|
    base = mask * n
    n.times do |u|
      cur = dp[base + u]
      next if cur >= best
      adj[u].each do |v, w|
        bit = 1 << col[v]
        next if (mask & bit) != 0
        nidx = (mask | bit) * n + v
        cand = cur + w
        dp[nidx] = cand if cand < dp[nidx]
      end
    end
  end
  fbase = full * n
  n.times { |u| best = dp[fbase + u] if dp[fbase + u] < best }
end

puts best >= INF / 2 ? -1 : best`,
  },
  practiceProblems: [
    {
      id: 'ch79-p1',
      tier: 'Warmup',
      ratingRange: '2200–2400',
      title: 'Minimum-Weight Simple Path of Exact K Vertices via Color Coding',
      statement:
        'Given an undirected weighted graph with N vertices (1 <= N <= 500), M edges (0 <= M <= 4000), and a target vertex count K (1 <= K <= 7), find the minimum total edge weight of a simple path visiting exactly K distinct vertices (K - 1 edges), or output -1 if no such simple path exists.',
      constraints: '1 <= N <= 500; 0 <= M <= 4000; 1 <= K <= 7; 1 <= w <= 10^9; Time Limit: 2.0s',
      sampleInput: '6 7 4\n1 2 5\n2 3 2\n3 4 1\n4 5 4\n1 3 10\n2 5 3\n5 6 2',
      sampleOutput: '6',
      hints: [
        'Assign each vertex u a pseudorandom color col[u] in [0, K - 1] using SplitMix64 and run bitmask DP dp[mask][u] where mask tracks used colors.',
        'Repeat across T = max(40, min(600, ceil(16 * K^K / K!))) trials and take the global minimum over dp[(1 << K) - 1][u].',
      ],
      solutions: {
        cpp20: `#include <algorithm>
#include <cstdint>
#include <iostream>
#include <vector>

using namespace std;

static constexpr long long INF = (1LL << 60);

struct Edge { int to; long long w; };

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m, k;
    if (!(cin >> n >> m >> k)) return 0;
    vector<vector<Edge>> adj(n);
    for (int i = 0; i < m; ++i) {
        int u, v;
        long long w;
        cin >> u >> v >> w;
        --u; --v;
        if (u == v) continue;
        adj[u].push_back({v, w});
        adj[v].push_back({u, w});
    }
    if (k == 1) { cout << 0 << '\\n'; return 0; }

    int full = (1 << k) - 1;
    double inv_p = 1.0;
    for (int i = 1; i <= k; ++i) inv_p *= (double)k / i;
    int trials = max(40, min(600, (int)(inv_p * 16.0)));

    uint64_t seed = 0x9E3779B97F4A7C15ULL ^ (uint64_t)(n * 131 + k);
    auto next_u64 = [&]() -> uint64_t {
        seed += 0x9E3779B97F4A7C15ULL;
        uint64_t z = seed;
        z = (z ^ (z >> 30)) * 0xBF58476D1CE4E5B9ULL;
        z = (z ^ (z >> 27)) * 0x94D049BB133111EBULL;
        return z ^ (z >> 31);
    };

    vector<int> col(n);
    vector<long long> dp((size_t)(1 << k) * n);
    long long best = INF;

    for (int t = 0; t < trials; ++t) {
        for (int i = 0; i < n; ++i) col[i] = (int)(next_u64() % (uint64_t)k);
        fill(dp.begin(), dp.end(), INF);
        for (int i = 0; i < n; ++i) dp[(1 << col[i]) * n + i] = 0;
        for (int mask = 1; mask < full; ++mask) {
            int base = mask * n;
            for (int u = 0; u < n; ++u) {
                long long cur = dp[base + u];
                if (cur >= best) continue;
                for (const auto& e : adj[u]) {
                    int bit = 1 << col[e.to];
                    if (mask & bit) continue;
                    int nidx = (mask | bit) * n + e.to;
                    if (cur + e.w < dp[nidx]) dp[nidx] = cur + e.w;
                }
            }
        }
        int fbase = full * n;
        for (int u = 0; u < n; ++u) best = min(best, dp[fbase + u]);
    }
    cout << (best >= INF / 2 ? -1 : best) << '\\n';
    return 0;
}`,
        rust: `use std::io::{self, Read};

const INF: i64 = 1_i64 << 60;

fn next_u64(seed: &mut u64) -> u64 {
    *seed = seed.wrapping_add(0x9E37_79B9_7F4A_7C15);
    let mut z = *seed;
    z = (z ^ (z >> 30)).wrapping_mul(0xBF58_476D_1CE4_E5B9);
    z = (z ^ (z >> 27)).wrapping_mul(0x94D0_49BB_1331_11EB);
    z ^ (z >> 31)
}

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let n: usize = match it.next() { Some(v) => v.parse().unwrap(), None => return };
    let m: usize = it.next().unwrap().parse().unwrap();
    let k: usize = it.next().unwrap().parse().unwrap();
    let mut adj = vec![Vec::<(usize, i64)>::new(); n];
    for _ in 0..m {
        let u: usize = it.next().unwrap().parse::<usize>().unwrap() - 1;
        let v: usize = it.next().unwrap().parse::<usize>().unwrap() - 1;
        let w: i64 = it.next().unwrap().parse().unwrap();
        if u != v { adj[u].push((v, w)); adj[v].push((u, w)); }
    }
    if k == 1 { println!("0"); return; }

    let full = (1usize << k) - 1;
    let mut inv_p = 1.0_f64;
    for i in 1..=k { inv_p *= (k as f64) / (i as f64); }
    let trials = ((inv_p * 16.0) as usize).clamp(40, 600);
    let mut seed: u64 = 0x9E37_79B9_7F4A_7C15 ^ ((n * 131 + k) as u64);
    let mut col = vec![0usize; n];
    let mut dp = vec![INF; (1usize << k) * n];
    let mut best = INF;

    for _ in 0..trials {
        for c in &mut col { *c = (next_u64(&mut seed) as usize) % k; }
        dp.fill(INF);
        for i in 0..n { dp[(1usize << col[i]) * n + i] = 0; }
        for mask in 1..full {
            let base = mask * n;
            for u in 0..n {
                let cur = dp[base + u];
                if cur >= best { continue; }
                for &(v, w) in &adj[u] {
                    let bit = 1usize << col[v];
                    if (mask & bit) != 0 { continue; }
                    let nidx = (mask | bit) * n + v;
                    if cur + w < dp[nidx] { dp[nidx] = cur + w; }
                }
            }
        }
        let fbase = full * n;
        for u in 0..n { if dp[fbase + u] < best { best = dp[fbase + u]; } }
    }
    println!("{}", if best >= INF / 2 { -1 } else { best });
}`,
        java21: `import java.io.BufferedInputStream;
import java.io.IOException;
import java.util.Arrays;

public class Main {
    static final long INF = 1L << 60;

    static class FastScanner {
        private final BufferedInputStream in = new BufferedInputStream(System.in);
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;

        private int readByte() throws IOException {
            if (ptr >= len) {
                ptr = 0;
                len = in.read(buf);
                if (len <= 0) return -1;
            }
            return buf[ptr++];
        }

        long nextLong() throws IOException {
            int c = readByte();
            while (c >= 0 && c <= 32) c = readByte();
            if (c < 0) return 0;
            long res = 0;
            while (c > 32) { res = res * 10 + (c - '0'); c = readByte(); }
            return res;
        }
    }

    static long seed;
    static long nextU64() {
        seed += 0x9E3779B97F4A7C15L;
        long z = seed;
        z = (z ^ (z >>> 30)) * 0xBF58476D1CE4E5B9L;
        z = (z ^ (z >>> 27)) * 0x94D049BB133111EBL;
        return z ^ (z >>> 31);
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        int n = (int) fs.nextLong();
        if (n == 0) return;
        int m = (int) fs.nextLong(), k = (int) fs.nextLong();
        int[] head = new int[n]; Arrays.fill(head, -1);
        int[] to = new int[2 * m + 1], nxt = new int[2 * m + 1];
        long[] wt = new long[2 * m + 1];
        int ec = 0;
        for (int i = 0; i < m; i++) {
            int u = (int) fs.nextLong() - 1, v = (int) fs.nextLong() - 1;
            long w = fs.nextLong();
            if (u == v) continue;
            to[ec] = v; wt[ec] = w; nxt[ec] = head[u]; head[u] = ec++;
            to[ec] = u; wt[ec] = w; nxt[ec] = head[v]; head[v] = ec++;
        }
        if (k == 1) { System.out.println(0); return; }

        int full = (1 << k) - 1;
        double invP = 1.0;
        for (int i = 1; i <= k; i++) invP *= (double) k / i;
        int trials = Math.max(40, Math.min(600, (int) (invP * 16.0)));
        seed = 0x9E3779B97F4A7C15L ^ (n * 131L + k);
        int[] col = new int[n];
        long[] dp = new long[(1 << k) * n];
        long best = INF;

        for (int t = 0; t < trials; t++) {
            for (int i = 0; i < n; i++) col[i] = (int) Long.remainderUnsigned(nextU64(), k);
            Arrays.fill(dp, INF);
            for (int i = 0; i < n; i++) dp[(1 << col[i]) * n + i] = 0;
            for (int mask = 1; mask < full; mask++) {
                int base = mask * n;
                for (int u = 0; u < n; u++) {
                    long cur = dp[base + u];
                    if (cur >= best) continue;
                    for (int e = head[u]; e != -1; e = nxt[e]) {
                        int v = to[e], bit = 1 << col[v];
                        if ((mask & bit) != 0) continue;
                        int nidx = (mask | bit) * n + v;
                        if (cur + wt[e] < dp[nidx]) dp[nidx] = cur + wt[e];
                    }
                }
            }
            int fbase = full * n;
            for (int u = 0; u < n; u++) if (dp[fbase + u] < best) best = dp[fbase + u];
        }
        System.out.println(best >= INF / 2 ? -1 : best);
    }
}`,
        python3: `import sys

sys.setrecursionlimit(200000)
INF = 1 << 60
MASK64 = (1 << 64) - 1


def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n, m, k = int(data[0]), int(data[1]), int(data[2])
    adj = [[] for _ in range(n)]
    idx = 3
    for _ in range(m):
        u, v, w = int(data[idx]) - 1, int(data[idx + 1]) - 1, int(data[idx + 2])
        idx += 3
        if u != v:
            adj[u].append((v, w))
            adj[v].append((u, w))
    if k == 1:
        sys.stdout.write("0\\n")
        return

    full = (1 << k) - 1
    inv_p = 1.0
    for i in range(1, k + 1):
        inv_p *= k / i
    trials = max(40, min(500, int(inv_p * 16.0)))
    seed = (0x9E3779B97F4A7C15 ^ (n * 131 + k)) & MASK64
    best = INF
    sz = (1 << k) * n

    for _ in range(trials):
        col = [0] * n
        for i in range(n):
            seed = (seed + 0x9E3779B97F4A7C15) & MASK64
            z = ((seed ^ (seed >> 30)) * 0xBF58476D1CE4E5B9) & MASK64
            z = ((z ^ (z >> 27)) * 0x94D049BB133111EB) & MASK64
            z ^= z >> 31
            col[i] = z % k
        dp = [INF] * sz
        for i in range(n):
            dp[(1 << col[i]) * n + i] = 0
        for mask in range(1, full):
            base = mask * n
            for u in range(n):
                cur = dp[base + u]
                if cur >= best:
                    continue
                for v, w in adj[u]:
                    bit = 1 << col[v]
                    if not (mask & bit):
                        nidx = (mask | bit) * n + v
                        if cur + w < dp[nidx]:
                            dp[nidx] = cur + w
        fbase = full * n
        for u in range(n):
            if dp[fbase + u] < best:
                best = dp[fbase + u]
    sys.stdout.write(f"{-1 if best >= INF // 2 else best}\\n")


if __name__ == "__main__":
    solve()`,
        ruby: `INF = 1 << 60
MASK64 = (1 << 64) - 1

data = STDIN.read.split
exit if data.empty?
n = data[0].to_i; m = data[1].to_i; k = data[2].to_i
adj = Array.new(n) { [] }
idx = 3
m.times do
  u = data[idx].to_i - 1; v = data[idx + 1].to_i - 1; w = data[idx + 2].to_i
  idx += 3
  next if u == v
  adj[u] << [v, w]; adj[v] << [u, w]
end
if k == 1
  puts 0
  exit
end

full = (1 << k) - 1
inv_p = 1.0
(1..k).each { |i| inv_p *= k.to_f / i }
trials = [[(inv_p * 16.0).to_i, 40].max, 500].min
seed = (0x9E3779B97F4A7C15 ^ (n * 131 + k)) & MASK64
best = INF
sz = (1 << k) * n

trials.times do
  col = Array.new(n)
  n.times do |i|
    seed = (seed + 0x9E3779B97F4A7C15) & MASK64
    z = ((seed ^ (seed >> 30)) * 0xBF58476D1CE4E5B9) & MASK64
    z = ((z ^ (z >> 27)) * 0x94D049BB133111EB) & MASK64
    z ^= z >> 31
    col[i] = z % k
  end
  dp = Array.new(sz, INF)
  n.times { |i| dp[(1 << col[i]) * n + i] = 0 }
  (1...full).each do |mask|
    base = mask * n
    n.times do |u|
      cur = dp[base + u]
      next if cur >= best
      adj[u].each do |v, w|
        bit = 1 << col[v]
        next if (mask & bit) != 0
        nidx = (mask | bit) * n + v
        dp[nidx] = cur + w if cur + w < dp[nidx]
      end
    end
  end
  fbase = full * n
  n.times { |u| best = dp[fbase + u] if dp[fbase + u] < best }
end
puts best >= INF / 2 ? -1 : best`,
      },
    },
    {
      id: 'ch79-p2',
      tier: 'Standard',
      ratingRange: '2400–2600',
      title: 'Maximum-Weight K-Vertex Tree Subgraph via Random Vertex Partitioning',
      statement:
        'Given an undirected graph with N vertices (1 <= N <= 200), M weighted edges (0 <= M <= 1500), and K (1 <= K <= 6), find the maximum total edge weight of a connected tree subgraph spanning exactly K distinct vertices (using K - 1 edges), or output -1 if no connected component has at least K vertices.',
      constraints: '1 <= N <= 200; 0 <= M <= 1500; 1 <= K <= 6; 1 <= w <= 10^9; Time Limit: 2.0s',
      sampleInput: '5 5 4\n1 2 10\n1 3 10\n1 4 10\n2 3 1\n4 5 2',
      sampleOutput: '30',
      hints: [
        'Unlike paths (which only extend endpoints), a star tree like 1-{2,3,4} branches at vertex 1. Color vertices with K colors and define dp[mask][u] = max weight of a colorful tree on color set mask containing vertex u.',
        'Transition in ascending order of popcount(mask): merge disjoint submasks dp[mask][u] = max(dp[sub][u] + dp[mask ^ sub][u]) at the same root u, then propagate across edges (u, v, w) to dp[mask | (1 << col[v])][v].',
      ],
      solutions: {
        cpp20: `#include <algorithm>
#include <cstdint>
#include <iostream>
#include <vector>

using namespace std;

static constexpr long long NEG_INF = -(1LL << 58);

struct Edge { int to; long long w; };

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m, k;
    if (!(cin >> n >> m >> k)) return 0;
    vector<vector<Edge>> adj(n);
    for (int i = 0; i < m; ++i) {
        int u, v;
        long long w;
        cin >> u >> v >> w;
        --u; --v;
        if (u == v) continue;
        adj[u].push_back({v, w});
        adj[v].push_back({u, w});
    }
    if (k == 1) { cout << 0 << '\\n'; return 0; }

    int full = (1 << k) - 1;
    double inv_p = 1.0;
    for (int i = 1; i <= k; ++i) inv_p *= (double)k / i;
    int trials = max(35, min(320, (int)(inv_p * 14.0)));

    uint64_t seed = 0x9E3779B97F4A7C15ULL ^ (uint64_t)(n * 97 + k);
    auto next_u64 = [&]() -> uint64_t {
        seed += 0x9E3779B97F4A7C15ULL;
        uint64_t z = seed;
        z = (z ^ (z >> 30)) * 0xBF58476D1CE4E5B9ULL;
        z = (z ^ (z >> 27)) * 0x94D049BB133111EBULL;
        return z ^ (z >> 31);
    };

    vector<int> col(n);
    vector<vector<long long>> dp(1 << k, vector<long long>(n, NEG_INF));
    long long best = NEG_INF;

    for (int t = 0; t < trials; ++t) {
        for (int i = 0; i < n; ++i) col[i] = (int)(next_u64() % (uint64_t)k);
        for (int mask = 0; mask <= full; ++mask) fill(dp[mask].begin(), dp[mask].end(), NEG_INF);
        for (int u = 0; u < n; ++u) dp[1 << col[u]][u] = 0;

        for (int mask = 1; mask <= full; ++mask) {
            for (int u = 0; u < n; ++u) {
                int ub = 1 << col[u];
                if (!(mask & ub)) continue;
                for (int sub = (mask - 1) & mask; sub > 0; sub = (sub - 1) & mask) {
                    if (!(sub & ub)) continue;
                    int rem = (mask ^ sub) | ub;
                    if (dp[sub][u] > NEG_INF / 2 && dp[rem][u] > NEG_INF / 2) {
                        dp[mask][u] = max(dp[mask][u], dp[sub][u] + dp[rem][u]);
                    }
                }
            }
            if (mask == full) break;
            for (int u = 0; u < n; ++u) {
                long long cur = dp[mask][u];
                if (cur <= NEG_INF / 2) continue;
                for (const auto& e : adj[u]) {
                    int bit = 1 << col[e.to];
                    if (mask & bit) continue;
                    dp[mask | bit][e.to] = max(dp[mask | bit][e.to], cur + e.w);
                }
            }
        }
        for (int u = 0; u < n; ++u) best = max(best, dp[full][u]);
    }
    cout << (best <= NEG_INF / 2 ? -1 : best) << '\\n';
    return 0;
}`,
        rust: `use std::io::{self, Read};

const NEG_INF: i64 = -(1_i64 << 58);

fn next_u64(seed: &mut u64) -> u64 {
    *seed = seed.wrapping_add(0x9E37_79B9_7F4A_7C15);
    let mut z = *seed;
    z = (z ^ (z >> 30)).wrapping_mul(0xBF58_476D_1CE4_E5B9);
    z = (z ^ (z >> 27)).wrapping_mul(0x94D0_49BB_1331_11EB);
    z ^ (z >> 31)
}

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let n: usize = match it.next() { Some(v) => v.parse().unwrap(), None => return };
    let m: usize = it.next().unwrap().parse().unwrap();
    let k: usize = it.next().unwrap().parse().unwrap();
    let mut adj = vec![Vec::<(usize, i64)>::new(); n];
    for _ in 0..m {
        let u: usize = it.next().unwrap().parse::<usize>().unwrap() - 1;
        let v: usize = it.next().unwrap().parse::<usize>().unwrap() - 1;
        let w: i64 = it.next().unwrap().parse().unwrap();
        if u != v { adj[u].push((v, w)); adj[v].push((u, w)); }
    }
    if k == 1 { println!("0"); return; }

    let full = (1usize << k) - 1;
    let mut inv_p = 1.0_f64;
    for i in 1..=k { inv_p *= (k as f64) / (i as f64); }
    let trials = ((inv_p * 14.0) as usize).clamp(35, 320);
    let mut seed: u64 = 0x9E37_79B9_7F4A_7C15 ^ ((n * 97 + k) as u64);
    let mut col = vec![0usize; n];
    let mut dp = vec![vec![NEG_INF; n]; 1usize << k];
    let mut best = NEG_INF;

    for _ in 0..trials {
        for c in &mut col { *c = (next_u64(&mut seed) as usize) % k; }
        for row in &mut dp { row.fill(NEG_INF); }
        for u in 0..n { dp[1usize << col[u]][u] = 0; }

        for mask in 1..=full {
            for u in 0..n {
                let ub = 1usize << col[u];
                if (mask & ub) == 0 { continue; }
                let mut sub = (mask - 1) & mask;
                while sub > 0 {
                    if (sub & ub) != 0 {
                        let rem = (mask ^ sub) | ub;
                        if dp[sub][u] > NEG_INF / 2 && dp[rem][u] > NEG_INF / 2 {
                            let val = dp[sub][u] + dp[rem][u];
                            if val > dp[mask][u] { dp[mask][u] = val; }
                        }
                    }
                    sub = (sub - 1) & mask;
                }
            }
            if mask == full { break; }
            for u in 0..n {
                let cur = dp[mask][u];
                if cur <= NEG_INF / 2 { continue; }
                for &(v, w) in &adj[u] {
                    let bit = 1usize << col[v];
                    if (mask & bit) != 0 { continue; }
                    if cur + w > dp[mask | bit][v] { dp[mask | bit][v] = cur + w; }
                }
            }
        }
        for u in 0..n { if dp[full][u] > best { best = dp[full][u]; } }
    }
    println!("{}", if best <= NEG_INF / 2 { -1 } else { best });
}`,
        java21: `import java.io.BufferedInputStream;
import java.io.IOException;
import java.util.Arrays;

public class Main {
    static final long NEG_INF = -(1L << 58);

    static class FastScanner {
        private final BufferedInputStream in = new BufferedInputStream(System.in);
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;

        private int readByte() throws IOException {
            if (ptr >= len) {
                ptr = 0;
                len = in.read(buf);
                if (len <= 0) return -1;
            }
            return buf[ptr++];
        }

        long nextLong() throws IOException {
            int c = readByte();
            while (c >= 0 && c <= 32) c = readByte();
            if (c < 0) return 0;
            long res = 0;
            while (c > 32) { res = res * 10 + (c - '0'); c = readByte(); }
            return res;
        }
    }

    static long seed;
    static long nextU64() {
        seed += 0x9E3779B97F4A7C15L;
        long z = seed;
        z = (z ^ (z >>> 30)) * 0xBF58476D1CE4E5B9L;
        z = (z ^ (z >>> 27)) * 0x94D049BB133111EBL;
        return z ^ (z >>> 31);
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        int n = (int) fs.nextLong();
        if (n == 0) return;
        int m = (int) fs.nextLong(), k = (int) fs.nextLong();
        int[] head = new int[n]; Arrays.fill(head, -1);
        int[] to = new int[2 * m + 1], nxt = new int[2 * m + 1];
        long[] wt = new long[2 * m + 1];
        int ec = 0;
        for (int i = 0; i < m; i++) {
            int u = (int) fs.nextLong() - 1, v = (int) fs.nextLong() - 1;
            long w = fs.nextLong();
            if (u == v) continue;
            to[ec] = v; wt[ec] = w; nxt[ec] = head[u]; head[u] = ec++;
            to[ec] = u; wt[ec] = w; nxt[ec] = head[v]; head[v] = ec++;
        }
        if (k == 1) { System.out.println(0); return; }

        int full = (1 << k) - 1;
        double invP = 1.0;
        for (int i = 1; i <= k; i++) invP *= (double) k / i;
        int trials = Math.max(35, Math.min(320, (int) (invP * 14.0)));
        seed = 0x9E3779B97F4A7C15L ^ (n * 97L + k);
        int[] col = new int[n];
        long[][] dp = new long[1 << k][n];
        long best = NEG_INF;

        for (int t = 0; t < trials; t++) {
            for (int i = 0; i < n; i++) col[i] = (int) Long.remainderUnsigned(nextU64(), k);
            for (int mask = 0; mask <= full; mask++) Arrays.fill(dp[mask], NEG_INF);
            for (int u = 0; u < n; u++) dp[1 << col[u]][u] = 0;

            for (int mask = 1; mask <= full; mask++) {
                for (int u = 0; u < n; u++) {
                    int ub = 1 << col[u];
                    if ((mask & ub) == 0) continue;
                    for (int sub = (mask - 1) & mask; sub > 0; sub = (sub - 1) & mask) {
                        if ((sub & ub) == 0) continue;
                        int rem = (mask ^ sub) | ub;
                        if (dp[sub][u] > NEG_INF / 2 && dp[rem][u] > NEG_INF / 2) {
                            long val = dp[sub][u] + dp[rem][u];
                            if (val > dp[mask][u]) dp[mask][u] = val;
                        }
                    }
                }
                if (mask == full) break;
                for (int u = 0; u < n; u++) {
                    long cur = dp[mask][u];
                    if (cur <= NEG_INF / 2) continue;
                    for (int e = head[u]; e != -1; e = nxt[e]) {
                        int v = to[e], bit = 1 << col[v];
                        if ((mask & bit) != 0) continue;
                        if (cur + wt[e] > dp[mask | bit][v]) dp[mask | bit][v] = cur + wt[e];
                    }
                }
            }
            for (int u = 0; u < n; u++) if (dp[full][u] > best) best = dp[full][u];
        }
        System.out.println(best <= NEG_INF / 2 ? -1 : best);
    }
}`,
        python3: `import sys

sys.setrecursionlimit(200000)
NEG_INF = -(1 << 58)
MASK64 = (1 << 64) - 1


def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n, m, k = int(data[0]), int(data[1]), int(data[2])
    adj = [[] for _ in range(n)]
    idx = 3
    for _ in range(m):
        u, v, w = int(data[idx]) - 1, int(data[idx + 1]) - 1, int(data[idx + 2])
        idx += 3
        if u != v:
            adj[u].append((v, w))
            adj[v].append((u, w))
    if k == 1:
        sys.stdout.write("0\\n")
        return

    full = (1 << k) - 1
    inv_p = 1.0
    for i in range(1, k + 1):
        inv_p *= k / i
    trials = max(35, min(260, int(inv_p * 14.0)))
    seed = (0x9E3779B97F4A7C15 ^ (n * 97 + k)) & MASK64
    best = NEG_INF

    for _ in range(trials):
        col = [0] * n
        for i in range(n):
            seed = (seed + 0x9E3779B97F4A7C15) & MASK64
            z = ((seed ^ (seed >> 30)) * 0xBF58476D1CE4E5B9) & MASK64
            z = ((z ^ (z >> 27)) * 0x94D049BB133111EB) & MASK64
            z ^= z >> 31
            col[i] = z % k
        dp = [[NEG_INF] * n for _ in range(1 << k)]
        for u in range(n):
            dp[1 << col[u]][u] = 0
        for mask in range(1, full + 1):
            dpm = dp[mask]
            for u in range(n):
                ub = 1 << col[u]
                if not (mask & ub):
                    continue
                sub = (mask - 1) & mask
                while sub > 0:
                    if sub & ub:
                        rem = (mask ^ sub) | ub
                        v1 = dp[sub][u]
                        v2 = dp[rem][u]
                        if v1 > NEG_INF // 2 and v2 > NEG_INF // 2 and v1 + v2 > dpm[u]:
                            dpm[u] = v1 + v2
                    sub = (sub - 1) & mask
            if mask == full:
                break
            for u in range(n):
                cur = dpm[u]
                if cur <= NEG_INF // 2:
                    continue
                for v, w in adj[u]:
                    bit = 1 << col[v]
                    if not (mask & bit):
                        if cur + w > dp[mask | bit][v]:
                            dp[mask | bit][v] = cur + w
        for u in range(n):
            if dp[full][u] > best:
                best = dp[full][u]

    sys.stdout.write(f"{-1 if best <= NEG_INF // 2 else best}\\n")


if __name__ == "__main__":
    solve()`,
        ruby: `NEG_INF = -(1 << 58)
MASK64 = (1 << 64) - 1

data = STDIN.read.split
exit if data.empty?
n = data[0].to_i; m = data[1].to_i; k = data[2].to_i
adj = Array.new(n) { [] }
idx = 3
m.times do
  u = data[idx].to_i - 1; v = data[idx + 1].to_i - 1; w = data[idx + 2].to_i
  idx += 3
  next if u == v
  adj[u] << [v, w]; adj[v] << [u, w]
end
if k == 1
  puts 0
  exit
end

full = (1 << k) - 1
inv_p = 1.0
(1..k).each { |i| inv_p *= k.to_f / i }
trials = [[(inv_p * 14.0).to_i, 35].max, 240].min
seed = (0x9E3779B97F4A7C15 ^ (n * 97 + k)) & MASK64
best = NEG_INF

trials.times do
  col = Array.new(n)
  n.times do |i|
    seed = (seed + 0x9E3779B97F4A7C15) & MASK64
    z = ((seed ^ (seed >> 30)) * 0xBF58476D1CE4E5B9) & MASK64
    z = ((z ^ (z >> 27)) * 0x94D049BB133111EB) & MASK64
    z ^= z >> 31
    col[i] = z % k
  end
  dp = Array.new(1 << k) { Array.new(n, NEG_INF) }
  n.times { |u| dp[1 << col[u]][u] = 0 }
  (1..full).each do |mask|
    dpm = dp[mask]
    n.times do |u|
      ub = 1 << col[u]
      next if (mask & ub) == 0
      sub = (mask - 1) & mask
      while sub > 0
        if (sub & ub) != 0
          rem = (mask ^ sub) | ub
          v1 = dp[sub][u]; v2 = dp[rem][u]
          dpm[u] = v1 + v2 if v1 > NEG_INF / 2 && v2 > NEG_INF / 2 && v1 + v2 > dpm[u]
        end
        sub = (sub - 1) & mask
      end
    end
    break if mask == full
    n.times do |u|
      cur = dpm[u]
      next if cur <= NEG_INF / 2
      adj[u].each do |v, w|
        bit = 1 << col[v]
        next if (mask & bit) != 0
        dp[mask | bit][v] = cur + w if cur + w > dp[mask | bit][v]
      end
    end
  end
  n.times { |u| best = dp[full][u] if dp[full][u] > best }
end
puts best <= NEG_INF / 2 ? -1 : best`,
      },
    },
    {
      id: 'ch79-p3',
      tier: 'Boss',
      ratingRange: '2600–2900',
      title: 'Minimum-Weight Simple Cycle of Exact Length K via Split-and-Color',
      statement:
        'Given an undirected simple weighted graph with N vertices (3 <= N <= 150), M edges (0 <= M <= 1500), and cycle length K (3 <= K <= 7), find the minimum total edge weight of a simple cycle visiting exactly K distinct vertices and K edges, or output -1 if no simple K-cycle exists.',
      constraints: '3 <= N <= 150; 0 <= M <= 1500; 3 <= K <= 7; 1 <= w <= 10^9; Time Limit: 2.0s',
      sampleInput: '5 6 4\n1 2 2\n2 3 3\n3 4 4\n4 1 1\n1 3 10\n2 5 1',
      sampleOutput: '10',
      hints: [
        'Anchor the minimum vertex index s of the cycle to color 0 and only allow vertices v > s with random colors in {1, ..., K - 1}.',
        'A single random assignment of {1..K-1} to all vertices can be reused across every anchor s: initialize dp[1][s] = 0, forbid transitions to u <= s, and close the cycle via edge (u, s) at mask == (1 << K) - 1.',
      ],
      solutions: {
        cpp20: `#include <algorithm>
#include <cstdint>
#include <iostream>
#include <vector>

using namespace std;

static constexpr long long INF = (1LL << 60);

struct Edge { int to; long long w; };

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m, k;
    if (!(cin >> n >> m >> k)) return 0;
    vector<vector<Edge>> adj(n);
    for (int i = 0; i < m; ++i) {
        int u, v;
        long long w;
        cin >> u >> v >> w;
        --u; --v;
        if (u == v) continue;
        adj[u].push_back({v, w});
        adj[v].push_back({u, w});
    }

    int full = (1 << k) - 1;
    int km1 = k - 1;
    double inv_p = 1.0;
    for (int i = 1; i <= km1; ++i) inv_p *= (double)km1 / i;
    int trials = max(30, min(220, (int)(inv_p * 14.0)));

    uint64_t seed = 0x9E3779B97F4A7C15ULL ^ (uint64_t)(n * 193 + k);
    auto next_u64 = [&]() -> uint64_t {
        seed += 0x9E3779B97F4A7C15ULL;
        uint64_t z = seed;
        z = (z ^ (z >> 30)) * 0xBF58476D1CE4E5B9ULL;
        z = (z ^ (z >> 27)) * 0x94D049BB133111EBULL;
        return z ^ (z >> 31);
    };

    vector<int> col(n);
    vector<long long> dp((size_t)(1 << k) * n);
    long long best = INF;

    for (int t = 0; t < trials; ++t) {
        for (int i = 0; i < n; ++i) col[i] = 1 + (int)(next_u64() % (uint64_t)km1);
        for (int s = 0; s <= n - k; ++s) {
            fill(dp.begin(), dp.end(), INF);
            dp[1 * n + s] = 0;
            for (int mask = 1; mask < full; mask += 2) {
                int base = mask * n;
                for (int u = s; u < n; ++u) {
                    long long cur = dp[base + u];
                    if (cur >= best) continue;
                    for (const auto& e : adj[u]) {
                        if (e.to <= s) continue;
                        int bit = 1 << col[e.to];
                        if (mask & bit) continue;
                        int nidx = (mask | bit) * n + e.to;
                        if (cur + e.w < dp[nidx]) dp[nidx] = cur + e.w;
                    }
                }
            }
            int fbase = full * n;
            for (const auto& e : adj[s]) {
                if (e.to > s && dp[fbase + e.to] + e.w < best) {
                    best = dp[fbase + e.to] + e.w;
                }
            }
        }
    }
    cout << (best >= INF / 2 ? -1 : best) << '\\n';
    return 0;
}`,
        rust: `use std::io::{self, Read};

const INF: i64 = 1_i64 << 60;

fn next_u64(seed: &mut u64) -> u64 {
    *seed = seed.wrapping_add(0x9E37_79B9_7F4A_7C15);
    let mut z = *seed;
    z = (z ^ (z >> 30)).wrapping_mul(0xBF58_476D_1CE4_E5B9);
    z = (z ^ (z >> 27)).wrapping_mul(0x94D0_49BB_1331_11EB);
    z ^ (z >> 31)
}

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let n: usize = match it.next() { Some(v) => v.parse().unwrap(), None => return };
    let m: usize = it.next().unwrap().parse().unwrap();
    let k: usize = it.next().unwrap().parse().unwrap();
    let mut adj = vec![Vec::<(usize, i64)>::new(); n];
    for _ in 0..m {
        let u: usize = it.next().unwrap().parse::<usize>().unwrap() - 1;
        let v: usize = it.next().unwrap().parse::<usize>().unwrap() - 1;
        let w: i64 = it.next().unwrap().parse().unwrap();
        if u != v { adj[u].push((v, w)); adj[v].push((u, w)); }
    }

    let full = (1usize << k) - 1;
    let km1 = k - 1;
    let mut inv_p = 1.0_f64;
    for i in 1..=km1 { inv_p *= (km1 as f64) / (i as f64); }
    let trials = ((inv_p * 14.0) as usize).clamp(30, 220);
    let mut seed: u64 = 0x9E37_79B9_7F4A_7C15 ^ ((n * 193 + k) as u64);
    let mut col = vec![0usize; n];
    let mut dp = vec![INF; (1usize << k) * n];
    let mut best = INF;

    for _ in 0..trials {
        for c in &mut col { *c = 1 + ((next_u64(&mut seed) as usize) % km1); }
        for s0 in 0..=(n - k) {
            dp.fill(INF);
            dp[n + s0] = 0;
            let mut mask = 1usize;
            while mask < full {
                let base = mask * n;
                for u in s0..n {
                    let cur = dp[base + u];
                    if cur >= best { continue; }
                    for &(v, w) in &adj[u] {
                        if v <= s0 { continue; }
                        let bit = 1usize << col[v];
                        if (mask & bit) != 0 { continue; }
                        let nidx = (mask | bit) * n + v;
                        if cur + w < dp[nidx] { dp[nidx] = cur + w; }
                    }
                }
                mask += 2;
            }
            let fbase = full * n;
            for &(v, w) in &adj[s0] {
                if v > s0 && dp[fbase + v] + w < best {
                    best = dp[fbase + v] + w;
                }
            }
        }
    }
    println!("{}", if best >= INF / 2 { -1 } else { best });
}`,
        java21: `import java.io.BufferedInputStream;
import java.io.IOException;
import java.util.Arrays;

public class Main {
    static final long INF = 1L << 60;

    static class FastScanner {
        private final BufferedInputStream in = new BufferedInputStream(System.in);
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;

        private int readByte() throws IOException {
            if (ptr >= len) {
                ptr = 0;
                len = in.read(buf);
                if (len <= 0) return -1;
            }
            return buf[ptr++];
        }

        long nextLong() throws IOException {
            int c = readByte();
            while (c >= 0 && c <= 32) c = readByte();
            if (c < 0) return 0;
            long res = 0;
            while (c > 32) { res = res * 10 + (c - '0'); c = readByte(); }
            return res;
        }
    }

    static long seed;
    static long nextU64() {
        seed += 0x9E3779B97F4A7C15L;
        long z = seed;
        z = (z ^ (z >>> 30)) * 0xBF58476D1CE4E5B9L;
        z = (z ^ (z >>> 27)) * 0x94D049BB133111EBL;
        return z ^ (z >>> 31);
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        int n = (int) fs.nextLong();
        if (n == 0) return;
        int m = (int) fs.nextLong(), k = (int) fs.nextLong();
        int[] head = new int[n]; Arrays.fill(head, -1);
        int[] to = new int[2 * m + 1], nxt = new int[2 * m + 1];
        long[] wt = new long[2 * m + 1];
        int ec = 0;
        for (int i = 0; i < m; i++) {
            int u = (int) fs.nextLong() - 1, v = (int) fs.nextLong() - 1;
            long w = fs.nextLong();
            if (u == v) continue;
            to[ec] = v; wt[ec] = w; nxt[ec] = head[u]; head[u] = ec++;
            to[ec] = u; wt[ec] = w; nxt[ec] = head[v]; head[v] = ec++;
        }

        int full = (1 << k) - 1;
        int km1 = k - 1;
        double invP = 1.0;
        for (int i = 1; i <= km1; i++) invP *= (double) km1 / i;
        int trials = Math.max(30, Math.min(220, (int) (invP * 14.0)));
        seed = 0x9E3779B97F4A7C15L ^ (n * 193L + k);
        int[] col = new int[n];
        long[] dp = new long[(1 << k) * n];
        long best = INF;

        for (int t = 0; t < trials; t++) {
            for (int i = 0; i < n; i++) col[i] = 1 + (int) Long.remainderUnsigned(nextU64(), km1);
            for (int s = 0; s <= n - k; s++) {
                Arrays.fill(dp, INF);
                dp[n + s] = 0;
                for (int mask = 1; mask < full; mask += 2) {
                    int base = mask * n;
                    for (int u = s; u < n; u++) {
                        long cur = dp[base + u];
                        if (cur >= best) continue;
                        for (int e = head[u]; e != -1; e = nxt[e]) {
                            int v = to[e];
                            if (v <= s) continue;
                            int bit = 1 << col[v];
                            if ((mask & bit) != 0) continue;
                            int nidx = (mask | bit) * n + v;
                            if (cur + wt[e] < dp[nidx]) dp[nidx] = cur + wt[e];
                        }
                    }
                }
                int fbase = full * n;
                for (int e = head[s]; e != -1; e = nxt[e]) {
                    int v = to[e];
                    if (v > s && dp[fbase + v] + wt[e] < best) best = dp[fbase + v] + wt[e];
                }
            }
        }
        System.out.println(best >= INF / 2 ? -1 : best);
    }
}`,
        python3: `import sys

sys.setrecursionlimit(200000)
INF = 1 << 60
MASK64 = (1 << 64) - 1


def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n, m, k = int(data[0]), int(data[1]), int(data[2])
    adj = [[] for _ in range(n)]
    idx = 3
    for _ in range(m):
        u, v, w = int(data[idx]) - 1, int(data[idx + 1]) - 1, int(data[idx + 2])
        idx += 3
        if u != v:
            adj[u].append((v, w))
            adj[v].append((u, w))

    full = (1 << k) - 1
    km1 = k - 1
    inv_p = 1.0
    for i in range(1, km1 + 1):
        inv_p *= km1 / i
    trials = max(25, min(160, int(inv_p * 13.0)))
    seed = (0x9E3779B97F4A7C15 ^ (n * 193 + k)) & MASK64
    best = INF
    sz = (1 << k) * n

    for _ in range(trials):
        col = [0] * n
        for i in range(n):
            seed = (seed + 0x9E3779B97F4A7C15) & MASK64
            z = ((seed ^ (seed >> 30)) * 0xBF58476D1CE4E5B9) & MASK64
            z = ((z ^ (z >> 27)) * 0x94D049BB133111EB) & MASK64
            z ^= z >> 31
            col[i] = 1 + (z % km1)
        for s in range(n - k + 1):
            dp = [INF] * sz
            dp[n + s] = 0
            for mask in range(1, full, 2):
                base = mask * n
                for u in range(s, n):
                    cur = dp[base + u]
                    if cur >= best:
                        continue
                    for v, w in adj[u]:
                        if v <= s:
                            continue
                        bit = 1 << col[v]
                        if not (mask & bit):
                            nidx = (mask | bit) * n + v
                            if cur + w < dp[nidx]:
                                dp[nidx] = cur + w
            fbase = full * n
            for v, w in adj[s]:
                if v > s and dp[fbase + v] + w < best:
                    best = dp[fbase + v] + w

    sys.stdout.write(f"{-1 if best >= INF // 2 else best}\\n")


if __name__ == "__main__":
    solve()`,
        ruby: `INF = 1 << 60
MASK64 = (1 << 64) - 1

data = STDIN.read.split
exit if data.empty?
n = data[0].to_i; m = data[1].to_i; k = data[2].to_i
adj = Array.new(n) { [] }
idx = 3
m.times do
  u = data[idx].to_i - 1; v = data[idx + 1].to_i - 1; w = data[idx + 2].to_i
  idx += 3
  next if u == v
  adj[u] << [v, w]; adj[v] << [u, w]
end

full = (1 << k) - 1
km1 = k - 1
inv_p = 1.0
(1..km1).each { |i| inv_p *= km1.to_f / i }
trials = [[(inv_p * 13.0).to_i, 25].max, 140].min
seed = (0x9E3779B97F4A7C15 ^ (n * 193 + k)) & MASK64
best = INF
sz = (1 << k) * n

trials.times do
  col = Array.new(n)
  n.times do |i|
    seed = (seed + 0x9E3779B97F4A7C15) & MASK64
    z = ((seed ^ (seed >> 30)) * 0xBF58476D1CE4E5B9) & MASK64
    z = ((z ^ (z >> 27)) * 0x94D049BB133111EB) & MASK64
    z ^= z >> 31
    col[i] = 1 + (z % km1)
  end
  (0..(n - k)).each do |s|
    dp = Array.new(sz, INF)
    dp[n + s] = 0
    mask = 1
    while mask < full
      base = mask * n
      (s...n).each do |u|
        cur = dp[base + u]
        next if cur >= best
        adj[u].each do |v, w|
          next if v <= s
          bit = 1 << col[v]
          next if (mask & bit) != 0
          nidx = (mask | bit) * n + v
          dp[nidx] = cur + w if cur + w < dp[nidx]
        end
      end
      mask += 2
    end
    fbase = full * n
    adj[s].each do |v, w|
      best = dp[fbase + v] + w if v > s && dp[fbase + v] + w < best
    end
  end
end
puts best >= INF / 2 ? -1 : best`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'Codeforces',
      title: 'Cycle and Path Color Coding (CF 1314D / Odd Length Cycles)',
      difficulty: '2300',
      url: 'https://codeforces.com/problemset/problem/1314/D',
      patternNote: 'Randomly partition or color vertices to forbid self-intersections in small fixed-length walks.',
    },
    {
      platform: 'AtCoder',
      title: 'ABC / AGC Colorful Subgraph & Steiner FPT Problems',
      difficulty: '2400',
      url: 'https://atcoder.jp/contests',
      patternNote: 'Merge colorful submasks dp[sub][u] + dp[mask ^ sub][u] in O(3^K N + 2^K E) across e^K trials.',
    },
    {
      platform: 'CodeChef',
      title: 'Fixed-Parameter K-Path and K-Cycle Discovery',
      difficulty: '2500',
      url: 'https://www.codechef.com/problems',
      patternNote: 'Anchor minimum cycle vertex to color 0 and color remaining vertices with K - 1 colors.',
    },
  ],
  interviewNotes: [
    'By Stirling’s approximation, K! / K^K >= sqrt(2 * pi * K) * e^{-K}, so O(e^K) independent trials suffice to hit any target K-vertex subgraph with high probability.',
    'Anchoring the start of a K-cycle to color 0 reduces the random palette to K - 1 colors, improving hit probability from K!/K^K to (K-1)!/(K-1)^{K-1}.',
    'Color coding can be derandomized theoretically via (N, K)-universal hash families, though SplitMix64 Monte Carlo trials are orders of magnitude faster in contests.',
  ],
  projectBlueprint: {
    title: 'Biological Protein-Interaction Motif & Anomaly Pathway Detector',
    tagline: 'Fixed-parameter subgraph discovery engine for signaling pathways and multi-hop fraud rings',
    stackSummary: 'C++20 / Rust SplitMix64 Color Coder + Contiguous L1 Bitmask DP + Submask Tree Merger',
    asciiDiagram:
`[Graph G=(V,E)] ---> [SplitMix64 K-Coloring] ---> [Bitmask Path/Tree DP O(2^K E)]
        ^                                                      |
        +----------- [Repeat T ~ 16 * K^K / K! Trials] <-------+`,
    milestones: [
      { id: 'm1', title: 'Monte Carlo K-Coloring Scheduler', detail: 'Calibrate trial count T from K!/K^K for < 10^-7 false-negative probability.' },
      { id: 'm2', title: 'Colorful Path & Cycle Engine', detail: 'Contiguous 1D dp[mask * N + u] array with branch-pruned transitions.' },
      { id: 'm3', title: 'Colorful Tree Submask Merger', detail: 'Combine branching subtrees via 3^K disjoint submask iteration.' },
    ],
    starterCode: `// Single-trial colorful path transition:
// if (!(mask & (1 << col[v]))) dp[mask | (1 << col[v])][v] = min(..., dp[mask][u] + w);`,
  },
};
