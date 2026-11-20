import type { TheoryChapter } from '../../types/vault';

export const CH40_INTERVAL_REROOTING_DP: TheoryChapter = {
  slug: 'interval-tree-rerooting-dp',
  topicId: 'dp-23',
  title: 'Interval DP & All-Roots Tree Rerooting DP',
  domain: 'Search, Greedy & DP',
  ratingTier: '1600–1900',
  usacoDivision: 'Gold',
  subtitle:
    'Master bottom-up increasing-length DP over contiguous intervals [l..r] (including circular 2N doubling & Knuth optimization), and two-pass Down/Up tree rerooting DP computing optimal values from EVERY root in O(N).',
  analogyTitle: 'The Folding Blueprint & Shifting Camera Anchor Analogy',
  analogyBody:
    '**Interval DP** works like assembling a foldable bridge from adjacent panels: you never know the optimal cost of span `[l..r]` until you have already solved every shorter sub-span `[l..k]` and `[k+1..r]` for all split midpoints `k`. So instead of row-by-row loops, you iterate by **subsegment length `len = 2..N`**—walking diagonally across the `N x N` table! **All-Roots Tree Rerooting DP**, on the other hand, solves a classic tree bottleneck: computing an answer assuming node `1` is the root takes `O(N)`, so repeating it from all `N` nodes would cost `O(N^2)`. Instead, run TWO `O(N)` passes: Pass 1 (**Downward `down[u]`**) pulls subtree answers upward to root `1`; Pass 2 (**Upward / Reroot**) slides the camera anchor across every edge `u -> v`! When moving the root from `u` to child `v`, `v`’s subtree stays intact while the entire rest of the tree becomes a single new child of `v`—computed using `u`’s answer minus `v`’s contribution (or via **prefix/suffix sibling products** when division isn’t invertible)!',
  prerequisites: [
    {
      slug: 'knapsack-lis-classic-dp',
      title: 'Knapsack, LIS & Classic Dynamic Programming',
    },
  ],
  traceTitle: 'Interactive Diagonal Interval DP & Two-Pass Tree Rerooting Trace',
  traceSubtitle:
    'Merge array `[4, 2, 3, 5]` by increasing interval length `dp[l][r]`, and slide root `1 -> 2` on a 6-node tree (`1-2, 1-3, 2-4, 2-5, 3-6`) for All-Roots Distance Sum.',
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Step 1: Interval DP Base Case (len = 1) & Prefix Sums for [4, 2, 3, 5]',
      explanation:
        'Initialize dp[i][i] = 0 (single slime costs 0 to form). Precompute prefix sums P = [0, 4, 6, 9, 14] so merging any range [l..r] adds cost P[r] - P[l-1].',
      mode: 'array',
      arrays: [
        {
          name: 'Interval Diagonal dp[i][i] (len=1)',
          cells: [
            { index: 1, value: 0, label: '4', highlight: 'neutral' },
            { index: 2, value: 0, label: '2', highlight: 'neutral' },
            { index: 3, value: 0, label: '3', highlight: 'neutral' },
            { index: 4, value: 0, label: '5', highlight: 'neutral' },
          ],
        },
        {
          name: 'Prefix Sums P[0..4]',
          cells: [
            { index: 0, value: 0, highlight: 'neutral' },
            { index: 1, value: 4, highlight: 'window' },
            { index: 2, value: 6, highlight: 'window' },
            { index: 3, value: 9, highlight: 'window' },
            { index: 4, value: 14, highlight: 'window' },
          ],
        },
      ],
      variables: { Phase: 'Interval len=1', PrefixReady: 'true' },
    },
    {
      stepNumber: 2,
      title: 'Step 2: Diagonal Fill len = 2..4 -> Optimal Split at k = 2 or 3 gives dp[1][4] = 28',
      explanation:
        'len=2: dp[1][2]=6, dp[2][3]=5, dp[3][4]=8. len=3: dp[1][3]=min(0+5, 6+0)+9=14, dp[2][4]=min(0+8, 5+0)+10=15. len=4: dp[1][4]=min(k=1: 0+15, k=2: 6+8, k=3: 14+0)+14 = 14 + 14 = 28! Every longer span reads strictly shorter spans!',
      mode: 'array',
      arrays: [
        {
          name: 'Solved Diagonals (dp[1][2], dp[2][3], dp[1][3], dp[2][4], dp[1][4])',
          cells: [
            { index: 0, value: 6, label: '[1..2]', highlight: 'window' },
            { index: 1, value: 5, label: '[2..3]', highlight: 'window' },
            { index: 2, value: 8, label: '[3..4]', highlight: 'window' },
            { index: 3, value: 14, label: '[1..3]', highlight: 'updated' },
            { index: 4, value: 15, label: '[2..4]', highlight: 'updated' },
            { index: 5, value: 28, label: '[1..4]', highlight: 'active' },
          ],
        },
      ],
      variables: { BestSplitK: 2, MergeCostSum14: 14, TotalOptCost: 28 },
    },
    {
      stepNumber: 3,
      title: 'Step 3: Rerooting Pass 1 (Bottom-Up Subtree Size sz[u] & Down-Distance Sum down[u])',
      explanation:
        'On 6-node tree (1-2, 1-3, 2-4, 2-5, 3-6), Pass 1 computes sz = [-, 6, 3, 2, 1, 1, 1] and down[1] = 8 (distances from root 1: 2->1, 3->1, 4->2, 5->2, 6->2 -> sum = 8).',
      mode: 'graph',
      graph: {
        calloutMetric: 'Pass 1 Downward DFS: sz[1]=6, ans[1]=down[1]=8',
        nodes: [
          { id: '1', label: '1 (ans=8)', x: 260, y: 40, state: 'active' },
          { id: '2', label: '2 (sz=3)', x: 140, y: 125, state: 'even' },
          { id: '3', label: '3 (sz=2)', x: 380, y: 125, state: 'even' },
          { id: '4', label: '4 (sz=1)', x: 75, y: 215, state: 'unmatched' },
          { id: '5', label: '5 (sz=1)', x: 205, y: 215, state: 'unmatched' },
          { id: '6', label: '6 (sz=1)', x: 380, y: 215, state: 'unmatched' },
        ],
        edges: [
          { id: 'e12', from: '1', to: '2', state: 'matched' },
          { id: 'e13', from: '1', to: '3', state: 'matched' },
          { id: 'e24', from: '2', to: '4', state: 'default' },
          { id: 'e25', from: '2', to: '5', state: 'default' },
          { id: 'e36', from: '3', to: '6', state: 'default' },
        ],
      },
      variables: { Root1Ans: 8, TreeNodesN: 6 },
    },
    {
      stepNumber: 4,
      title: 'Step 4: Rerooting Pass 2 — Slide Anchor 1 -> 2 in O(1): ans[2] = ans[1] + N - 2*sz[2]',
      explanation:
        'Moving root across edge 1 -> 2 brings the sz[2]=3 nodes in subtree(2) 1 step CLOSER (-3) and pushes the N - sz[2] = 3 outside nodes 1 step FARTHER (+3): ans[2] = 8 + (6 - 2*3) = 8! Similarly edge 1 -> 3 gives ans[3] = 8 + (6 - 2*2) = 10.',
      mode: 'graph',
      graph: {
        calloutMetric: 'Pass 2 Reroot: ans[2]=8, ans[3]=10, ans[4]=12, ans[5]=12, ans[6]=14',
        nodes: [
          { id: '1', label: '1 (ans=8)', x: 260, y: 40, state: 'matched' },
          { id: '2', label: '2 (ans=8)', x: 140, y: 125, state: 'active' },
          { id: '3', label: '3 (ans=10)', x: 380, y: 125, state: 'matched' },
          { id: '4', label: '4 (ans=12)', x: 75, y: 215, state: 'even' },
          { id: '5', label: '5 (ans=12)', x: 205, y: 215, state: 'even' },
          { id: '6', label: '6 (ans=14)', x: 380, y: 215, state: 'even' },
        ],
        edges: [
          { id: 'e12', from: '1', to: '2', state: 'augmenting' },
          { id: 'e13', from: '1', to: '3', state: 'augmenting' },
          { id: 'e24', from: '2', to: '4', state: 'matched' },
          { id: 'e25', from: '2', to: '5', state: 'matched' },
          { id: 'e36', from: '3', to: '6', state: 'matched' },
        ],
      },
      variables: { BestHubNodes: '1 and 2 (sum=8)', TimePerEdge: 'O(1)', TotalTime: 'O(N)' },
    },
  ],
  reductionClues: [
    {
      clue: '"Merge adjacent elements, burst balloons, or parenthesize an expression over N <= 500"',
      translation:
        'Classic **Interval DP**: iterate `len = 2..N` and left endpoint `l`, testing every split `k` in `[l..r-1]`. Note: for **Circular** arrays, duplicate `A` to length `2N` (`A[i + N] = A[i]`) and take `min_{i=1..N} dp[i][i + N - 1]`!',
    },
    {
      clue: '"Compute a tree DP value (sum of distances, max depth, longest path, or coloring ways) assuming EVERY node i = 1..N is the root"',
      translation:
        '**All-Roots Rerooting DP**: Pass 1 computes `down[u]` post-order from root `1`; Pass 2 pushes `up[v]` pre-order to each child `v` before recursing into `v`!',
    },
    {
      clue: '"Rerooting DP uses a product over children modulo M (where M may NOT be prime, or a child product could equal 0 mod M)"',
      translation:
        'NEVER divide by `dp[v]`! Build **prefix and suffix products** across `u`’s adjacency list: `up[v]` simply multiplies `fromParent(u) * pref[idx - 1] * suff[idx + 1]` in `O(deg(u))` with zero division!',
    },
    {
      clue: '"Interval DP with N <= 3000 and Quadrangle Inequality cost(a, c) + cost(b, d) <= cost(a, d) + cost(b, c)"',
      translation:
        'Apply **Knuth’s Optimization**: track `opt[l][r]` and restrict split `k` to `[opt[l][r - 1] .. opt[l + 1][r]]`—dropping Interval DP from `O(N^3)` straight down to `O(N^2)`!',
    },
  ],
  timeComplexity: 'Interval DP: O(N^3) (O(N^2) with Knuth) | Rerooting Tree DP: O(N)',
  spaceComplexity: 'Interval DP: O(N^2) | Rerooting Tree DP: O(N)',
  pitfalls: [
    {
      type: 'WA',
      title: 'Iterating Interval DP by (l, r) Row-Major Order Instead of Increasing Length',
      detail:
        'If you loop `for (l = 1..n) for (r = l..n)`, then `dp[l][r]` reads `dp[k + 1][r]` (`l < k + 1`), which hasn’t been computed yet! ALWAYS loop `for (len = 2..n)` on the outside (or `l` decreasing from `n` down to `1` and `r` increasing from `l + 1` to `n`).',
    },
    {
      type: 'WA',
      title: 'Dividing by Child DP Value Modulo M During Rerooting When Value Is 0 mod M',
      detail:
        'In problems like CSES/AtCoder *Subtree* (count connected black subtrees mod arbitrary `M`), `(down[v] + 1) % M` can be `0`, or `M` is composite (`modInverse` doesn’t exist!). Always replace division with **prefix/suffix exclusion arrays** over each node’s children!',
    },
    {
      type: 'RE',
      title: 'Recursive DFS Stack Overflow on Line Trees of N = 2 * 10^5 in Java / Python / Ruby',
      detail:
        'A straight path of `2 * 10^5` vertices has recursion depth `200,000`, which crashes default Java/Python/Ruby stacks. Precompute a BFS topological `order[]` array (`parent[]`), iterate `order` **in reverse** for Pass 1 (`down`), and **forward** for Pass 2 (`up`)—100% iterative and stack-overflow-proof!',
    },
    {
      type: 'WA',
      title: 'Forgetting Circular Doubling Boundary Checks on 2N Interval DP',
      detail:
        'When duplicating `A[1..N]` into `A[1..2N]`, build prefix sums up to `2N`, run length `len = 2..N` (ONLY up to `N`, not `2N`!), and take `min/max` over `dp[i][i + N - 1]` for `i = 1..N`.',
    },
  ],
  implementations: {
    cpp20: `#include <bits/stdc++.h>
using namespace std;

// Combined Demonstration:
// Part A (if N <= 400): O(N^3) Interval DP (Slimes merge)
// Standard Benchmark Mode: O(N) Two-Pass All-Roots Rerooting DP (Tree Distances II)
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    if (!(cin >> n)) return 0;
    vector<vector<int>> adj(n + 1);
    for (int i = 0; i < n - 1; i++) {
        int u, v;
        cin >> u >> v;
        adj[u].push_back(v);
        adj[v].push_back(u);
    }

    vector<int> parent(n + 1, 0), order;
    order.reserve(n);
    order.push_back(1);
    for (size_t i = 0; i < order.size(); i++) {
        int u = order[i];
        for (int v : adj[u]) {
            if (v != parent[u]) {
                parent[v] = u;
                order.push_back(v);
            }
        }
    }

    vector<long long> sz(n + 1, 1), ans(n + 1, 0);
    // Pass 1 (Reverse BFS = Post-order): accumulate subtree sizes and root-1 distances
    for (int i = n - 1; i >= 1; i--) {
        int u = order[i], p = parent[u];
        sz[p] += sz[u];
        ans[1] += sz[u]; // every node in u's subtree crosses edge (p, u) toward root 1
    }

    // Pass 2 (Forward BFS = Pre-order): slide root across edge p -> u
    for (int i = 1; i < n; i++) {
        int u = order[i], p = parent[u];
        ans[u] = ans[p] + (long long)n - 2LL * sz[u];
    }

    for (int i = 1; i <= n; i++) {
        cout << ans[i] << (i == n ? '\\n' : ' ');
    }
    return 0;
}`,
    rust: `use std::io::{self, Read};

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let n: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };

    let mut adj = vec![Vec::new(); n + 1];
    for _ in 0..n - 1 {
        let u: usize = it.next().unwrap().parse().unwrap();
        let v: usize = it.next().unwrap().parse().unwrap();
        adj[u].push(v);
        adj[v].push(u);
    }

    let mut parent = vec![0usize; n + 1];
    let mut order = Vec::with_capacity(n);
    order.push(1usize);
    let mut idx = 0;
    while idx < order.len() {
        let u = order[idx];
        idx += 1;
        for &v in &adj[u] {
            if v != parent[u] {
                parent[v] = u;
                order.push(v);
            }
        }
    }

    let mut sz = vec![1i64; n + 1];
    let mut ans = vec![0i64; n + 1];
    for &u in order.iter().skip(1).rev() {
        let p = parent[u];
        sz[p] += sz[u];
        ans[1] += sz[u];
    }

    let n_i64 = n as i64;
    for &u in order.iter().skip(1) {
        let p = parent[u];
        ans[u] = ans[p] + n_i64 - 2 * sz[u];
    }

    let out: Vec<String> = (1..=n).map(|i| ans[i].to_string()).collect();
    println!("{}", out.join(" "));
}`,
    java21: `import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class Main {
    static final class FastScanner {
        private final InputStream in;
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;
        FastScanner(InputStream in) { this.in = in; }
        private int readByte() throws IOException {
            if (ptr >= len) {
                ptr = 0;
                len = in.read(buf);
                if (len <= 0) return -1;
            }
            return buf[ptr++];
        }
        int nextInt() throws IOException {
            int c = readByte();
            while (c >= 0 && c <= ' ') c = readByte();
            if (c == -1) return Integer.MIN_VALUE;
            int res = 0;
            while (c > ' ') { res = res * 10 + (c - '0'); c = readByte(); }
            return res;
        }
    }

    @SuppressWarnings("unchecked")
    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        int n = fs.nextInt();
        if (n == Integer.MIN_VALUE) return;

        List<Integer>[] adj = new ArrayList[n + 1];
        for (int i = 1; i <= n; i++) adj[i] = new ArrayList<>();
        for (int i = 0; i < n - 1; i++) {
            int u = fs.nextInt(), v = fs.nextInt();
            adj[u].add(v);
            adj[v].add(u);
        }

        int[] parent = new int[n + 1];
        int[] order = new int[n];
        int qt = 0;
        order[qt++] = 1;
        for (int qh = 0; qh < qt; qh++) {
            int u = order[qh];
            for (int v : adj[u]) {
                if (v != parent[u]) {
                    parent[v] = u;
                    order[qt++] = v;
                }
            }
        }

        long[] sz = new long[n + 1];
        Arrays.fill(sz, 1);
        long[] ans = new long[n + 1];

        for (int i = n - 1; i >= 1; i--) {
            int u = order[i], p = parent[u];
            sz[p] += sz[u];
            ans[1] += sz[u];
        }
        for (int i = 1; i < n; i++) {
            int u = order[i], p = parent[u];
            ans[u] = ans[p] + n - 2L * sz[u];
        }

        StringBuilder sb = new StringBuilder();
        for (int i = 1; i <= n; i++) {
            if (i > 1) sb.append(' ');
            sb.append(ans[i]);
        }
        sb.append('\\n');
        System.out.print(sb);
    }
}`,
    python3: `import sys

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    n = int(next(it))
    adj = [[] for _ in range(n + 1)]
    for _ in range(n - 1):
        u = int(next(it))
        v = int(next(it))
        adj[u].append(v)
        adj[v].append(u)

    parent = [0] * (n + 1)
    order = [1]
    for u in order:
        p = parent[u]
        for v in adj[u]:
            if v != p:
                parent[v] = u
                order.append(v)

    sz = [1] * (n + 1)
    ans = [0] * (n + 1)
    for u in reversed(order[1:]):
        p = parent[u]
        sz[p] += sz[u]
        ans[1] += sz[u]

    for u in order[1:]:
        p = parent[u]
        ans[u] = ans[p] + n - 2 * sz[u]

    sys.stdout.write(" ".join(str(ans[i]) for i in range(1, n + 1)) + "\\n")

if __name__ == "__main__":
    solve()`,
    ruby: `tokens = $stdin.read.split
exit if tokens.empty?
idx = 0
n = tokens[idx].to_i; idx += 1
adj = Array.new(n + 1) { [] }
(n - 1).times do
  u = tokens[idx].to_i; idx += 1
  v = tokens[idx].to_i; idx += 1
  adj[u] << v
  adj[v] << u
end

parent = Array.new(n + 1, 0)
order = [1]
head = 0
while head < order.length
  u = order[head]; head += 1
  p = parent[u]
  adj[u].each do |v|
    next if v == p
    parent[v] = u
    order << v
  end
end

sz = Array.new(n + 1, 1)
ans = Array.new(n + 1, 0)
(n - 1).downto(1) do |i|
  u = order[i]
  p = parent[u]
  sz[p] += sz[u]
  ans[1] += sz[u]
end

(1...n).each do |i|
  u = order[i]
  p = parent[u]
  ans[u] = ans[p] + n - 2 * sz[u]
end

puts (1..n).map { |i| ans[i].to_s }.join(" ")`,
  },
  practiceProblems: [
    {
      id: 'ch40-p1',
      tier: 'Warmup',
      ratingRange: '1600–1800',
      title: 'Slimes — Optimal Adjacent Interval Merging in O(N^3)',
      statement:
        'There are N slimes arranged in a line, with initial sizes A[1..N]. In one operation, choose two adjacent slimes of sizes x and y and merge them into one slime of size x + y, paying cost x + y. Repeat until only 1 slime remains. Find the minimum total merging cost.',
      constraints: '2 <= N <= 400, 1 <= A[i] <= 10^9',
      sampleInput: '4\n10 20 30 40',
      sampleOutput: '190',
      hints: [
        'Let `dp[l][r]` = minimum cost to merge `A[l..r]` into a single slime. Base case: `dp[i][i] = 0`.',
        'Regardless of how `A[l..r]` is split at `k`, the final merge step always sums the ENTIRE interval `sum(l, r) = P[r] - P[l - 1]`. Thus `dp[l][r] = min_{l <= k < r}(dp[l][k] + dp[k + 1][r]) + sum(l, r)`.',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    if (!(cin >> n)) return 0;
    vector<long long> pref(n + 1, 0);
    for (int i = 1; i <= n; i++) {
        long long x;
        cin >> x;
        pref[i] = pref[i - 1] + x;
    }

    const long long INF = 4e18;
    vector<vector<long long>> dp(n + 1, vector<long long>(n + 1, 0));
    for (int len = 2; len <= n; len++) {
        for (int l = 1; l + len - 1 <= n; l++) {
            int r = l + len - 1;
            long long best = INF;
            for (int k = l; k < r; k++) {
                best = min(best, dp[l][k] + dp[k + 1][r]);
            }
            dp[l][r] = best + (pref[r] - pref[l - 1]);
        }
    }
    cout << dp[1][n] << "\\n";
    return 0;
}`,
        rust: `use std::io::{self, Read};

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let n: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };

    let mut pref = vec![0i64; n + 1];
    for i in 1..=n {
        let x: i64 = it.next().unwrap().parse().unwrap();
        pref[i] = pref[i - 1] + x;
    }

    let inf = i64::MAX / 4;
    let mut dp = vec![vec![0i64; n + 1]; n + 1];
    for len in 2..=n {
        for l in 1..=n - len + 1 {
            let r = l + len - 1;
            let mut best = inf;
            for k in l..r {
                best = best.min(dp[l][k] + dp[k + 1][r]);
            }
            dp[l][r] = best + (pref[r] - pref[l - 1]);
        }
    }
    println!("{}", dp[1][n]);
}`,
        java21: `import java.io.IOException;
import java.io.InputStream;

public class Main {
    static final class FastScanner {
        private final InputStream in;
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;
        FastScanner(InputStream in) { this.in = in; }
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
            while (c >= 0 && c <= ' ') c = readByte();
            if (c == -1) return Long.MIN_VALUE;
            long res = 0;
            while (c > ' ') { res = res * 10 + (c - '0'); c = readByte(); }
            return res;
        }
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        long nIn = fs.nextLong();
        if (nIn == Long.MIN_VALUE) return;
        int n = (int) nIn;

        long[] pref = new long[n + 1];
        for (int i = 1; i <= n; i++) pref[i] = pref[i - 1] + fs.nextLong();

        long[][] dp = new long[n + 1][n + 1];
        final long INF = Long.MAX_VALUE / 4;
        for (int len = 2; len <= n; len++) {
            for (int l = 1; l + len - 1 <= n; l++) {
                int r = l + len - 1;
                long best = INF;
                for (int k = l; k < r; k++) {
                    long cand = dp[l][k] + dp[k + 1][r];
                    if (cand < best) best = cand;
                }
                dp[l][r] = best + (pref[r] - pref[l - 1]);
            }
        }
        System.out.println(dp[1][n]);
    }
}`,
        python3: `import sys

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    n = int(next(it))
    pref = [0] * (n + 1)
    for i in range(1, n + 1):
        pref[i] = pref[i - 1] + int(next(it))

    INF = 10**18
    dp = [[0] * (n + 1) for _ in range(n + 1)]
    for length in range(2, n + 1):
        for l in range(1, n - length + 2):
            r = l + length - 1
            best = INF
            row_l = dp[l]
            for k in range(l, r):
                cand = row_l[k] + dp[k + 1][r]
                if cand < best:
                    best = cand
            row_l[r] = best + pref[r] - pref[l - 1]
    sys.stdout.write(f"{dp[1][n]}\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
n = tokens[0].to_i
pref = Array.new(n + 1, 0)
(1..n).each { |i| pref[i] = pref[i - 1] + tokens[i].to_i }

inf = 10**18
dp = Array.new(n + 1) { Array.new(n + 1, 0) }
(2..n).each do |len|
  (1..(n - len + 1)).each do |l|
    r = l + len - 1
    best = inf
    (l...r).each do |k|
      cand = dp[l][k] + dp[k + 1][r]
      best = cand if cand < best
    end
    dp[l][r] = best + pref[r] - pref[l - 1]
  end
end
puts dp[1][n]`,
      },
    },
    {
      id: 'ch40-p2',
      tier: 'Standard',
      ratingRange: '1750–1950',
      title: 'Tree Distances II — All-Roots Path Distance Sum & Farthest Node Eccentricity',
      statement:
        'Given an unweighted tree of N vertices, compute for EVERY vertex `i = 1..N` TWO classic all-roots metrics: (1) `sumDist[i]` = sum of shortest-path distances from `i` to all other vertices, and (2) `maxDist[i]` = distance from `i` to the farthest vertex in the tree (eccentricity). Output `sumDist[i]` on line 1 and `maxDist[i]` on line 2!',
      constraints: '1 <= N <= 2 * 10^5',
      sampleInput: '5\n1 2\n1 3\n3 4\n3 5',
      sampleOutput: '6 9 5 8 8\n2 3 2 3 3',
      hints: [
        'For `sumDist[i]`, Pass 1 computes `sz[u]` and `sumDist[1]`; Pass 2 pushes `sumDist[v] = sumDist[u] + N - 2 * sz[v]`.',
        'For `maxDist[i]`, track BOTH the **largest** child depth `best1[u]` (and which child achieved it) AND the **second-largest** child depth `best2[u]` in Pass 1—then in Pass 2, `upMax[v] = 1 + max(upMax[u], v == bestChild[u] ? best2[u] : best1[u])`!',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    if (!(cin >> n)) return 0;
    vector<vector<int>> adj(n + 1);
    for (int i = 0; i < n - 1; i++) {
        int u, v;
        cin >> u >> v;
        adj[u].push_back(v);
        adj[v].push_back(u);
    }

    vector<int> parent(n + 1, 0), order;
    order.reserve(n);
    order.push_back(1);
    for (size_t i = 0; i < order.size(); i++) {
        int u = order[i];
        for (int v : adj[u]) {
            if (v != parent[u]) {
                parent[v] = u;
                order.push_back(v);
            }
        }
    }

    vector<long long> sz(n + 1, 1), sumDist(n + 1, 0);
    vector<int> best1(n + 1, 0), best2(n + 1, 0), bestChild(n + 1, 0), upMax(n + 1, 0);

    // Pass 1 (Bottom-Up)
    for (int i = n - 1; i >= 1; i--) {
        int u = order[i], p = parent[u];
        sz[p] += sz[u];
        sumDist[1] += sz[u];
        int cand = best1[u] + 1;
        if (cand > best1[p]) {
            best2[p] = best1[p];
            best1[p] = cand;
            bestChild[p] = u;
        } else if (cand > best2[p]) {
            best2[p] = cand;
        }
    }

    // Pass 2 (Top-Down)
    for (int i = 1; i < n; i++) {
        int u = order[i], p = parent[u];
        sumDist[u] = sumDist[p] + (long long)n - 2LL * sz[u];
        int viaParent = (bestChild[p] == u ? best2[p] : best1[p]);
        upMax[u] = max(upMax[p], viaParent) + 1;
    }

    for (int i = 1; i <= n; i++) cout << sumDist[i] << (i == n ? '\\n' : ' ');
    for (int i = 1; i <= n; i++) cout << max(best1[i], upMax[i]) << (i == n ? '\\n' : ' ');
    return 0;
}`,
        rust: `use std::io::{self, Read};

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let n: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };

    let mut adj = vec![Vec::new(); n + 1];
    for _ in 0..n - 1 {
        let u: usize = it.next().unwrap().parse().unwrap();
        let v: usize = it.next().unwrap().parse().unwrap();
        adj[u].push(v);
        adj[v].push(u);
    }

    let mut parent = vec![0usize; n + 1];
    let mut order = Vec::with_capacity(n);
    order.push(1usize);
    let mut idx = 0;
    while idx < order.len() {
        let u = order[idx];
        idx += 1;
        for &v in &adj[u] {
            if v != parent[u] {
                parent[v] = u;
                order.push(v);
            }
        }
    }

    let mut sz = vec![1i64; n + 1];
    let mut sum_dist = vec![0i64; n + 1];
    let mut best1 = vec![0i32; n + 1];
    let mut best2 = vec![0i32; n + 1];
    let mut best_child = vec![0usize; n + 1];
    let mut up_max = vec![0i32; n + 1];

    for &u in order.iter().skip(1).rev() {
        let p = parent[u];
        sz[p] += sz[u];
        sum_dist[1] += sz[u];
        let cand = best1[u] + 1;
        if cand > best1[p] {
            best2[p] = best1[p];
            best1[p] = cand;
            best_child[p] = u;
        } else if cand > best2[p] {
            best2[p] = cand;
        }
    }

    let n_i64 = n as i64;
    for &u in order.iter().skip(1) {
        let p = parent[u];
        sum_dist[u] = sum_dist[p] + n_i64 - 2 * sz[u];
        let via_p = if best_child[p] == u { best2[p] } else { best1[p] };
        up_max[u] = up_max[p].max(via_p) + 1;
    }

    let line1: Vec<String> = (1..=n).map(|i| sum_dist[i].to_string()).collect();
    let line2: Vec<String> = (1..=n).map(|i| best1[i].max(up_max[i]).to_string()).collect();
    println!("{}\\n{}", line1.join(" "), line2.join(" "));
}`,
        java21: `import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class Main {
    static final class FastScanner {
        private final InputStream in;
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;
        FastScanner(InputStream in) { this.in = in; }
        private int readByte() throws IOException {
            if (ptr >= len) {
                ptr = 0;
                len = in.read(buf);
                if (len <= 0) return -1;
            }
            return buf[ptr++];
        }
        int nextInt() throws IOException {
            int c = readByte();
            while (c >= 0 && c <= ' ') c = readByte();
            if (c == -1) return Integer.MIN_VALUE;
            int res = 0;
            while (c > ' ') { res = res * 10 + (c - '0'); c = readByte(); }
            return res;
        }
    }

    @SuppressWarnings("unchecked")
    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        int n = fs.nextInt();
        if (n == Integer.MIN_VALUE) return;

        List<Integer>[] adj = new ArrayList[n + 1];
        for (int i = 1; i <= n; i++) adj[i] = new ArrayList<>();
        for (int i = 0; i < n - 1; i++) {
            int u = fs.nextInt(), v = fs.nextInt();
            adj[u].add(v);
            adj[v].add(u);
        }

        int[] parent = new int[n + 1];
        int[] order = new int[n];
        int qt = 0;
        order[qt++] = 1;
        for (int qh = 0; qh < qt; qh++) {
            int u = order[qh];
            for (int v : adj[u]) {
                if (v != parent[u]) {
                    parent[v] = u;
                    order[qt++] = v;
                }
            }
        }

        long[] sz = new long[n + 1];
        Arrays.fill(sz, 1);
        long[] sumDist = new long[n + 1];
        int[] best1 = new int[n + 1], best2 = new int[n + 1];
        int[] bestChild = new int[n + 1], upMax = new int[n + 1];

        for (int i = n - 1; i >= 1; i--) {
            int u = order[i], p = parent[u];
            sz[p] += sz[u];
            sumDist[1] += sz[u];
            int cand = best1[u] + 1;
            if (cand > best1[p]) {
                best2[p] = best1[p];
                best1[p] = cand;
                bestChild[p] = u;
            } else if (cand > best2[p]) {
                best2[p] = cand;
            }
        }

        for (int i = 1; i < n; i++) {
            int u = order[i], p = parent[u];
            sumDist[u] = sumDist[p] + n - 2L * sz[u];
            int viaP = (bestChild[p] == u) ? best2[p] : best1[p];
            upMax[u] = Math.max(upMax[p], viaP) + 1;
        }

        StringBuilder sb = new StringBuilder();
        for (int i = 1; i <= n; i++) {
            if (i > 1) sb.append(' ');
            sb.append(sumDist[i]);
        }
        sb.append('\\n');
        for (int i = 1; i <= n; i++) {
            if (i > 1) sb.append(' ');
            sb.append(Math.max(best1[i], upMax[i]));
        }
        sb.append('\\n');
        System.out.print(sb);
    }
}`,
        python3: `import sys

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    n = int(next(it))
    adj = [[] for _ in range(n + 1)]
    for _ in range(n - 1):
        u = int(next(it))
        v = int(next(it))
        adj[u].append(v)
        adj[v].append(u)

    parent = [0] * (n + 1)
    order = [1]
    for u in order:
        p = parent[u]
        for v in adj[u]:
            if v != p:
                parent[v] = u
                order.append(v)

    sz = [1] * (n + 1)
    sum_dist = [0] * (n + 1)
    best1 = [0] * (n + 1)
    best2 = [0] * (n + 1)
    best_child = [0] * (n + 1)
    up_max = [0] * (n + 1)

    for u in reversed(order[1:]):
        p = parent[u]
        sz[p] += sz[u]
        sum_dist[1] += sz[u]
        cand = best1[u] + 1
        if cand > best1[p]:
            best2[p] = best1[p]
            best1[p] = cand
            best_child[p] = u
        elif cand > best2[p]:
            best2[p] = cand

    for u in order[1:]:
        p = parent[u]
        sum_dist[u] = sum_dist[p] + n - 2 * sz[u]
        via_p = best2[p] if best_child[p] == u else best1[p]
        up_max[u] = max(up_max[p], via_p) + 1

    l1 = " ".join(str(sum_dist[i]) for i in range(1, n + 1))
    l2 = " ".join(str(max(best1[i], up_max[i])) for i in range(1, n + 1))
    sys.stdout.write(f"{l1}\\n{l2}\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
idx = 0
n = tokens[idx].to_i; idx += 1
adj = Array.new(n + 1) { [] }
(n - 1).times do
  u = tokens[idx].to_i; idx += 1
  v = tokens[idx].to_i; idx += 1
  adj[u] << v
  adj[v] << u
end

parent = Array.new(n + 1, 0)
order = [1]
head = 0
while head < order.length
  u = order[head]; head += 1
  p = parent[u]
  adj[u].each do |v|
    next if v == p
    parent[v] = u
    order << v
  end
end

sz = Array.new(n + 1, 1)
sum_dist = Array.new(n + 1, 0)
best1 = Array.new(n + 1, 0)
best2 = Array.new(n + 1, 0)
best_child = Array.new(n + 1, 0)
up_max = Array.new(n + 1, 0)

(n - 1).downto(1) do |i|
  u = order[i]; p = parent[u]
  sz[p] += sz[u]
  sum_dist[1] += sz[u]
  cand = best1[u] + 1
  if cand > best1[p]
    best2[p] = best1[p]
    best1[p] = cand
    best_child[p] = u
  elsif cand > best2[p]
    best2[p] = cand
  end
end

(1...n).each do |i|
  u = order[i]; p = parent[u]
  sum_dist[u] = sum_dist[p] + n - 2 * sz[u]
  via_p = best_child[p] == u ? best2[p] : best1[p]
  up_max[u] = [up_max[p], via_p].max + 1
end

puts (1..n).map { |i| sum_dist[i].to_s }.join(" ")
puts (1..n).map { |i| [best1[i], up_max[i]].max.to_s }.join(" ")`,
      },
    },
    {
      id: 'ch40-p3',
      tier: 'Boss',
      ratingRange: '2100–2400',
      title: 'Subtree Painting Ways (All-Roots Connected Black Component Mod M Without Division)',
      statement:
        'Given a tree with N vertices and an arbitrary modulus M (NOT necessarily prime!), paint every vertex either Black or White. For EACH vertex `v = 1..N`, count the number of valid colorings modulo M in which `v` is Black and all Black vertices form a single connected component. (Note: Because M can be composite and factors can equal 0 mod M, division is impossible—you MUST use prefix/suffix sibling products!)',
      constraints: '1 <= N <= 10^5, 2 <= M <= 10^9',
      sampleInput: '4 100\n1 2\n1 3\n1 4',
      sampleOutput: '8 5 5 5',
      hints: [
        'For root `1`, let `down[u]` = number of ways to color subtree `u` with `u` painted Black. Every child `v` can either be White (`1` way) OR Black (`down[v]` ways), so `down[u] = prod_{v in children(u)} (down[v] + 1) mod M`!',
        'To reroot to child `v_i` of `u`, `up[v_i]` (ways for the outside tree when `u` is White or connected) satisfies `up[v_i] = (1 + up[u] * pref[i - 1] * suff[i + 1]) mod M`: `u` painted Black contributes `up[u] * pref[i-1] * suff[i+1]` (using prefix/suffix sibling exclusion to avoid modular division), plus `1` if `u` is painted White! So `ans[v] = down[v] * up[v] mod M`.',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

// AtCoder DP V (Subtree) — Prefix/Suffix Product Rerooting avoiding modular division
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    long long M;
    if (!(cin >> n >> M)) return 0;

    vector<vector<int>> adj(n + 1), children(n + 1);
    for (int i = 0; i < n - 1; i++) {
        int u, v;
        cin >> u >> v;
        adj[u].push_back(v);
        adj[v].push_back(u);
    }

    vector<int> parent(n + 1, 0), order;
    order.reserve(n);
    order.push_back(1);
    for (size_t i = 0; i < order.size(); i++) {
        int u = order[i];
        for (int v : adj[u]) {
            if (v != parent[u]) {
                parent[v] = u;
                children[u].push_back(v);
                order.push_back(v);
            }
        }
    }

    vector<long long> down(n + 1, 1), up(n + 1, 1);
    // Pass 1: bottom-up product of (down[child] + 1)
    for (int i = n - 1; i >= 0; i--) {
        int u = order[i];
        long long prod = 1;
        for (int v : children[u]) {
            prod = prod * ((down[v] + 1) % M) % M;
        }
        down[u] = prod;
    }

    // Pass 2: top-down prefix/suffix product exclusion across children[u]
    for (int i = 0; i < n; i++) {
        int u = order[i];
        int k = (int)children[u].size();
        if (k == 0) continue;
        vector<long long> pref(k + 1, 1), suff(k + 1, 1);
        for (int j = 0; j < k; j++) {
            long long term = (down[children[u][j]] + 1) % M;
            pref[j + 1] = pref[j] * term % M;
        }
        for (int j = k - 1; j >= 0; j--) {
            long long term = (down[children[u][j]] + 1) % M;
            suff[j] = suff[j + 1] * term % M;
        }
        for (int j = 0; j < k; j++) {
            int v = children[u][j];
            long long excl = up[u] * pref[j] % M * suff[j + 1] % M;
            up[v] = (excl + 1) % M; // +1 allows parent u to be painted White
        }
    }

    for (int i = 1; i <= n; i++) {
        cout << (down[i] * up[i] % M) << (i == n ? '\\n' : ' ');
    }
    return 0;
}`,
        rust: `use std::io::{self, Read};

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let n: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };
    let m: i64 = it.next().unwrap().parse().unwrap();

    let mut adj = vec![Vec::new(); n + 1];
    for _ in 0..n - 1 {
        let u: usize = it.next().unwrap().parse().unwrap();
        let v: usize = it.next().unwrap().parse().unwrap();
        adj[u].push(v);
        adj[v].push(u);
    }

    let mut parent = vec![0usize; n + 1];
    let mut children = vec![Vec::new(); n + 1];
    let mut order = Vec::with_capacity(n);
    order.push(1usize);
    let mut idx = 0;
    while idx < order.len() {
        let u = order[idx];
        idx += 1;
        for &v in &adj[u] {
            if v != parent[u] {
                parent[v] = u;
                children[u].push(v);
                order.push(v);
            }
        }
    }

    let mut down = vec![1i64; n + 1];
    let mut up = vec![1i64; n + 1];

    for &u in order.iter().rev() {
        let mut prod = 1i64;
        for &v in &children[u] {
            prod = prod * ((down[v] + 1) % m) % m;
        }
        down[u] = prod;
    }

    for &u in &order {
        let k = children[u].len();
        if k == 0 {
            continue;
        }
        let mut pref = vec![1i64; k + 1];
        let mut suff = vec![1i64; k + 1];
        for j in 0..k {
            let term = (down[children[u][j]] + 1) % m;
            pref[j + 1] = pref[j] * term % m;
        }
        for j in (0..k).rev() {
            let term = (down[children[u][j]] + 1) % m;
            suff[j] = suff[j + 1] * term % m;
        }
        for j in 0..k {
            let v = children[u][j];
            let excl = up[u] * pref[j] % m * suff[j + 1] % m;
            up[v] = (excl + 1) % m;
        }
    }

    let out: Vec<String> = (1..=n).map(|i| (down[i] * up[i] % m).to_string()).collect();
    println!("{}", out.join(" "));
}`,
        java21: `import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class Main {
    static final class FastScanner {
        private final InputStream in;
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;
        FastScanner(InputStream in) { this.in = in; }
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
            while (c >= 0 && c <= ' ') c = readByte();
            if (c == -1) return Long.MIN_VALUE;
            long res = 0;
            while (c > ' ') { res = res * 10 + (c - '0'); c = readByte(); }
            return res;
        }
    }

    @SuppressWarnings("unchecked")
    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        long nIn = fs.nextLong();
        if (nIn == Long.MIN_VALUE) return;
        int n = (int) nIn;
        long M = fs.nextLong();

        List<Integer>[] adj = new ArrayList[n + 1];
        List<Integer>[] children = new ArrayList[n + 1];
        for (int i = 1; i <= n; i++) {
            adj[i] = new ArrayList<>();
            children[i] = new ArrayList<>();
        }
        for (int i = 0; i < n - 1; i++) {
            int u = (int) fs.nextLong(), v = (int) fs.nextLong();
            adj[u].add(v);
            adj[v].add(u);
        }

        int[] parent = new int[n + 1];
        int[] order = new int[n];
        int qt = 0;
        order[qt++] = 1;
        for (int qh = 0; qh < qt; qh++) {
            int u = order[qh];
            for (int v : adj[u]) {
                if (v != parent[u]) {
                    parent[v] = u;
                    children[u].add(v);
                    order[qt++] = v;
                }
            }
        }

        long[] down = new long[n + 1];
        long[] up = new long[n + 1];
        Arrays.fill(down, 1);
        Arrays.fill(up, 1);

        for (int i = n - 1; i >= 0; i--) {
            int u = order[i];
            long prod = 1;
            for (int v : children[u]) prod = prod * ((down[v] + 1) % M) % M;
            down[u] = prod;
        }

        for (int i = 0; i < n; i++) {
            int u = order[i];
            int k = children[u].size();
            if (k == 0) continue;
            long[] pref = new long[k + 1], suff = new long[k + 1];
            pref[0] = 1;
            suff[k] = 1;
            for (int j = 0; j < k; j++) {
                long term = (down[children[u].get(j)] + 1) % M;
                pref[j + 1] = pref[j] * term % M;
            }
            for (int j = k - 1; j >= 0; j--) {
                long term = (down[children[u].get(j)] + 1) % M;
                suff[j] = suff[j + 1] * term % M;
            }
            for (int j = 0; j < k; j++) {
                int v = children[u].get(j);
                long excl = up[u] * pref[j] % M * suff[j + 1] % M;
                up[v] = (excl + 1) % M;
            }
        }

        StringBuilder sb = new StringBuilder();
        for (int i = 1; i <= n; i++) {
            if (i > 1) sb.append(' ');
            sb.append(down[i] * up[i] % M);
        }
        sb.append('\\n');
        System.out.print(sb);
    }
}`,
        python3: `import sys

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    n = int(next(it))
    M = int(next(it))

    adj = [[] for _ in range(n + 1)]
    for _ in range(n - 1):
        u = int(next(it))
        v = int(next(it))
        adj[u].append(v)
        adj[v].append(u)

    parent = [0] * (n + 1)
    children = [[] for _ in range(n + 1)]
    order = [1]
    for u in order:
        p = parent[u]
        for v in adj[u]:
            if v != p:
                parent[v] = u
                children[u].append(v)
                order.append(v)

    down = [1] * (n + 1)
    up = [1] * (n + 1)
    for u in reversed(order):
        prod = 1
        for v in children[u]:
            prod = prod * ((down[v] + 1) % M) % M
        down[u] = prod

    for u in order:
        ch = children[u]
        k = len(ch)
        if k == 0:
            continue
        pref = [1] * (k + 1)
        suff = [1] * (k + 1)
        for j in range(k):
            pref[j + 1] = pref[j] * ((down[ch[j]] + 1) % M) % M
        for j in range(k - 1, -1, -1):
            suff[j] = suff[j + 1] * ((down[ch[j]] + 1) % M) % M
        for j in range(k):
            v = ch[j]
            excl = up[u] * pref[j] % M * suff[j + 1] % M
            up[v] = (excl + 1) % M

    sys.stdout.write(" ".join(str(down[i] * up[i] % M) for i in range(1, n + 1)) + "\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
idx = 0
n = tokens[idx].to_i; idx += 1
mod = tokens[idx].to_i; idx += 1

adj = Array.new(n + 1) { [] }
(n - 1).times do
  u = tokens[idx].to_i; idx += 1
  v = tokens[idx].to_i; idx += 1
  adj[u] << v
  adj[v] << u
end

parent = Array.new(n + 1, 0)
children = Array.new(n + 1) { [] }
order = [1]
head = 0
while head < order.length
  u = order[head]; head += 1
  p = parent[u]
  adj[u].each do |v|
    next if v == p
    parent[v] = u
    children[u] << v
    order << v
  end
end

down = Array.new(n + 1, 1)
up = Array.new(n + 1, 1)
order.reverse_each do |u|
  prod = 1
  children[u].each { |v| prod = prod * ((down[v] + 1) % mod) % mod }
  down[u] = prod
end

order.each do |u|
  ch = children[u]
  k = ch.length
  next if k == 0
  pref = Array.new(k + 1, 1)
  suff = Array.new(k + 1, 1)
  k.times { |j| pref[j + 1] = pref[j] * ((down[ch[j]] + 1) % mod) % mod }
  (k - 1).downto(0) { |j| suff[j] = suff[j + 1] * ((down[ch[j]] + 1) % mod) % mod }
  k.times do |j|
    v = ch[j]
    excl = up[u] * pref[j] % mod * suff[j + 1] % mod
    up[v] = (excl + 1) % mod
  end
end

puts (1..n).map { |i| (down[i] * up[i] % mod).to_s }.join(" ")`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'CSES',
      title: 'Tree Distances II',
      difficulty: 'Medium',
      url: 'https://cses.fi/problemset/task/1133',
      patternNote: 'Canonical O(N) two-pass Down/Up tree rerooting benchmark.',
    },
    {
      platform: 'AtCoder',
      title: 'Educational DP N - Slimes & V - Subtree',
      difficulty: '1600–2000',
      url: 'https://atcoder.jp/contests/dp/tasks/dp_v',
      patternNote: 'Covers both O(N^3) Interval DP (Slimes) and division-free prefix/suffix Rerooting DP (Subtree).',
    },
    {
      platform: 'Codeforces',
      title: 'Tree Painting (CF 1187E)',
      difficulty: '2100',
      url: 'https://codeforces.com/problemset/problem/1187/E',
      patternNote: 'Maximize sum of component sizes over all possible starting roots in O(N).',
    },
    {
      platform: 'CodeChef',
      title: 'SUBWAY / Circular Interval Merging',
      difficulty: 'Medium-Hard',
      url: 'https://www.codechef.com/problems/MSTICK',
      patternNote: 'Doubled-array circular interval DP & range aggregation patterns.',
    },
    {
      platform: 'HackerRank',
      title: 'Matrix Chain Multiplication / Tree Pruning',
      difficulty: 'Medium-Hard',
      url: 'https://www.hackerrank.com/challenges/tree-pruning/problem',
      patternNote: 'Interval/subtree partitioning DP over ordered DFS Euler segments.',
    },
    {
      platform: 'NeetCode 150',
      title: 'Burst Balloons',
      difficulty: 'Hard',
      url: 'https://neetcode.io/problems/burst-balloons',
      patternNote: 'Reverse-thinking Interval DP: pick the LAST balloon `k` to burst inside `(l, r)`!',
    },
  ],
  interviewNotes: [
    'On **Burst Balloons** or **Matrix Chain Multiplication**, emphasize the "think about the LAST operation inside `[l, r]`" trick: choosing the last split `k` freezes the left/right boundaries so `[l, k-1]` and `[k+1, r]` become completely independent subproblems!',
    'In **All-Roots Tree Rerooting**, clearly separate Pass 1 (`down[u]` depending only on `u`’s subtree) and Pass 2 (`up[v]` representing the entire outside tree excluding `v`). When combining across children uses non-invertible operations (`max`, `min`, `mod M`), always build **prefix + suffix** exclusion arrays.',
    'Always mention **Knuth Optimization** (`O(N^3) -> O(N^2)`) whenever an Interval DP transition cost satisfies the Quadrangle Inequality (`opt[l][r-1] <= opt[l][r] <= opt[l+1][r]`).',
  ],
  projectBlueprint: {
    title: 'Distributed Network Latency & Compiler Expression Cost Optimizer',
    tagline:
      'Dual-engine optimizer: (1) All-Nodes Optimal Server Hub Locator minimizing global packet RTT on arbitrary tree topologies in O(N), and (2) Compiler AST / Join-Order Cost Optimizer using Interval DP.',
    stackSummary: 'C++20 Iterative Two-Pass Rerooting Engine, O(N^3) Relational Join-Order Interval Optimizer',
    asciiDiagram: `Tree Topology Analyzer (O(N)):          SQL / Expression Join Optimizer (O(N^3)):
   [N1]---[N2]---[N4]                      Table Sizes: [10x30, 30x5, 5x60]
           |                               dp[1][2] = 1500, dp[2][3] = 9000
          [N3]                             dp[1][3] = min((A1*A2)*A3 = 4500,
Pass 1: sumDown(N1) -> Pass 2: reroot all!                A1*(A2*A3) = 27000) -> 4500`,
    milestones: [
      {
        id: 'm1',
        title: '1. Iterative Topology Hub Scorer',
        detail: 'Compute total packet-hop latency and worst-case SLA eccentricity for every node in `O(N)`.',
      },
      {
        id: 'm2',
        title: '2. Optimal Join-Order / Matrix Parenthesizer',
        detail: 'Reconstruct the exact optimal parenthesization tree using `split[l][r]` backpointers.',
      },
      {
        id: 'm3',
        title: '3. Non-Prime Modulo Fault-Tolerant Rerooter',
        detail: 'Use prefix/suffix sibling exclusion to guarantee zero division errors across arbitrary weights.',
      },
    ],
    starterCode: `#include <bits/stdc++.h>
using namespace std;

// Dual Optimizer: All-Roots Network Hub Locator + Matrix Join-Order Parenthesizer
struct HubReport {
    int bestHub;
    long long minTotalLatency;
    int minEccentricity;
};

HubReport analyzeNetworkTopology(int n, const vector<pair<int, int>>& links) {
    vector<vector<int>> adj(n + 1);
    for (auto [u, v] : links) {
        adj[u].push_back(v);
        adj[v].push_back(u);
    }
    vector<int> parent(n + 1, 0), order = {1};
    for (size_t i = 0; i < order.size(); i++) {
        int u = order[i];
        for (int v : adj[u]) if (v != parent[u]) { parent[v] = u; order.push_back(v); }
    }

    vector<long long> sz(n + 1, 1), sumD(n + 1, 0);
    vector<int> b1(n + 1, 0), b2(n + 1, 0), bc(n + 1, 0), upMax(n + 1, 0);
    for (int i = n - 1; i >= 1; i--) {
        int u = order[i], p = parent[u];
        sz[p] += sz[u];
        sumD[1] += sz[u];
        int cand = b1[u] + 1;
        if (cand > b1[p]) { b2[p] = b1[p]; b1[p] = cand; bc[p] = u; }
        else if (cand > b2[p]) b2[p] = cand;
    }
    for (int i = 1; i < n; i++) {
        int u = order[i], p = parent[u];
        sumD[u] = sumD[p] + n - 2LL * sz[u];
        upMax[u] = max(upMax[p], bc[p] == u ? b2[p] : b1[p]) + 1;
    }

    HubReport rep{1, sumD[1], max(b1[1], upMax[1])};
    for (int i = 2; i <= n; i++) {
        if (sumD[i] < rep.minTotalLatency) {
            rep = {i, sumD[i], max(b1[i], upMax[i])};
        }
    }
    return rep;
}

long long optimizeMatrixJoinOrder(const vector<long long>& dims) {
    int n = (int)dims.size() - 1;
    vector<vector<long long>> dp(n + 1, vector<long long>(n + 1, 0));
    for (int len = 2; len <= n; len++) {
        for (int l = 1; l + len - 1 <= n; l++) {
            int r = l + len - 1;
            dp[l][r] = LLONG_MAX / 4;
            for (int k = l; k < r; k++) {
                dp[l][r] = min(dp[l][r], dp[l][k] + dp[k + 1][r] + dims[l - 1] * dims[k] * dims[r]);
            }
        }
    }
    return dp[1][n];
}

int main() {
    auto hub = analyzeNetworkTopology(5, {{1, 2}, {1, 3}, {3, 4}, {3, 5}});
    cout << "Optimal Hub: Node " << hub.bestHub
         << " | Total Hop Latency: " << hub.minTotalLatency
         << " | Max Hop SLA: " << hub.minEccentricity << "\\n";
    cout << "Optimal Matrix Join Cost [10x30, 30x5, 5x60]: "
         << optimizeMatrixJoinOrder({10, 30, 5, 60}) << "\\n";
    return 0;
}`,
  },
};
