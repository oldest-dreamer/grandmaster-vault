import type { TheoryChapter } from '../../types/vault';

export const CH51_DIVIDE_CONQUER_KNUTH_DP: TheoryChapter = {
  slug: 'divide-conquer-knuth-dp',
  topicId: 'dp-25',
  title: 'Divide & Conquer DP and Knuth-Yao Optimization',
  domain: 'Search, Greedy & DP',
  ratingTier: '2200–2600',
  usacoDivision: 'Platinum',
  subtitle:
    'Shrink O(K * N^2) partitioning DP down to O(K * N log N) via monotonic opt[k][i] <= opt[k][i+1] midpoint splitting (including O(1) Mo-style pointer sliding!), and cut O(N^3) interval DP to O(N^2) using Knuth-Yao opt[i][j-1] <= opt[i][j] <= opt[i+1][j].',
  analogyTitle: 'The Shrinking Searchlight Corridor & Quadrangle Bracket Analogy',
  analogyBody:
    'In `K`-layer partition DP (`dp[k][i] = min_{j < i}(dp[k-1][j] + C(j+1, i))`), checking every split `j` takes `O(K * N^2)` — instant TLE when `N = 5000`. Yet whenever cost `C(a, b)` satisfies the **Quadrangle Inequality** (`C(a, c) + C(b, d) <= C(a, d) + C(b, c)` for `a <= b <= c <= d`), the optimal split point `opt[k][i]` is **monotonically non-decreasing** (`opt[k][i] <= opt[k][i+1]`)! Therefore, **Divide & Conquer DP** computes the midpoint `mid = (l + r) / 2` first by brute-forcing `j` inside `[optL .. min(mid - 1, optR)]`: once we discover `bestJ` for `mid`, the entire left half `[l .. mid - 1]` ONLY needs `[optL .. bestJ]`, and the right half `[mid + 1 .. r]` ONLY needs `[bestJ .. optR]`! Across all `log N` recursion levels, the intervals `[optL .. optR]` partition `[1 .. N]`, dropping work per layer to **`O(N log N)`**! Meanwhile, for single-table **Interval DP** (`dp[i][j] = min_{i < k < j}(dp[i][k] + dp[k][j]) + C(i, j)`), **Knuth-Yao Optimization** proves `opt[i][j-1] <= opt[i][j] <= opt[i+1][j]`, telescoping each diagonal’s total `k`-checks down to **`O(N^2)`**!',
  prerequisites: [
    {
      slug: 'interval-tree-rerooting-dp',
      title: 'Interval DP & All-Roots Tree Rerooting DP',
    },
  ],
  traceTitle: 'Interactive D&C DP Search Window Halving & Knuth Diagonal Bounds Trace',
  traceSubtitle:
    'Watch `compute(l=1, r=6, optL=0, optR=5)` solve `mid=3` with split `opt=1`, splitting the valid split range cleanly for left `[1..2]` and right `[4..6]`.',
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Step 1: Root Call compute(l=1, r=6, optL=0, optR=5) Evaluates Midpoint i = 3',
      explanation:
        'Suppose we are filling layer k = 2 on array A = [2, 3, 1, 2, 2, 4] (Subarray Squares). Check j in [optL=0 .. min(2, 5)=2] for mid = 3: best split occurs at bestJ = 1 (splitting [2] | [3,1] or [2,3] | [1]).',
      mode: 'array',
      arrays: [
        {
          name: 'Valid Split Bounds at Root (mid = 3)',
          cells: [
            { index: 1, value: 'opt in [0..5]', label: 'i=1', highlight: 'window' },
            { index: 2, value: 'opt in [0..5]', label: 'i=2', highlight: 'window' },
            { index: 3, value: 'opt = 1 (Solved)', label: 'mid=3', highlight: 'active' },
            { index: 4, value: 'opt in [0..5]', label: 'i=4', highlight: 'window' },
            { index: 5, value: 'opt in [0..5]', label: 'i=5', highlight: 'window' },
            { index: 6, value: 'opt in [0..5]', label: 'i=6', highlight: 'window' },
          ],
        },
      ],
      variables: { MidIndex: 3, DiscoveredOpt: 1, CandidatesChecked: 3 },
    },
    {
      stepNumber: 2,
      title: 'Step 2: Left Branch [1..2] Clamped to [0..1], Right Branch [4..6] Clamped to [1..5]',
      explanation:
        'Because opt[i] is non-decreasing, EVERY i in [1..2] must have opt <= 1, and EVERY i in [4..6] must have opt >= 1! Total candidate work across ANY single recursion depth never exceeds 2 * N!',
      mode: 'array',
      arrays: [
        {
          name: 'Disjoint Clamped Candidate Ranges Across Depth 1',
          cells: [
            { index: 1, value: 'opt in [0..1]', label: 'Left Child', highlight: 'updated' },
            { index: 2, value: 'opt in [0..1]', label: 'Left Child', highlight: 'updated' },
            { index: 3, value: 'opt = 1', label: 'Locked', highlight: 'neutral' },
            { index: 4, value: 'opt in [1..5]', label: 'Right Child', highlight: 'active' },
            { index: 5, value: 'opt in [1..5]', label: 'Right Child', highlight: 'active' },
            { index: 6, value: 'opt in [1..5]', label: 'Right Child', highlight: 'active' },
          ],
        },
      ],
      variables: { LeftWindow: '[0..1]', RightWindow: '[1..5]', DepthComplexity: 'O(N) per level' },
    },
    {
      stepNumber: 3,
      title: 'Step 3: Knuth-Yao Interval DP Telescopes Each Diagonal Length to O(N)',
      explanation:
        'For dp[i][j] = min(dp[i][k] + dp[k][j]) + C(i, j), Knuth’s bound opt[i][j-1] <= k <= opt[i+1][j] means summing (opt[i+1][j] - opt[i][j-1] + 1) across a fixed length L = j - i telescopes completely to <= 2N iterations per length -> exact O(N^2) overall!',
      mode: 'array',
      arrays: [
        {
          name: 'Knuth Bracket Bounds for Interval [i..j]',
          cells: [
            { index: 0, value: 'opt[i][j-1]', label: 'Lower Bound', highlight: 'window' },
            { index: 1, value: '<= opt[i][j] <=', label: 'Optimal k', highlight: 'active' },
            { index: 2, value: 'opt[i+1][j]', label: 'Upper Bound', highlight: 'updated' },
          ],
        },
      ],
      variables: { NaiveTime: 'O(N^3)', KnuthTime: 'O(N^2)', Condition: 'Quadrangle + Monotone' },
    },
  ],
  reductionClues: [
    {
      clue: '"Partition array A[1..N] into K subarrays minimizing sum of convex costs (e.g. square of subarray sum, or pairwise dislikes)"',
      translation:
        '**Divide & Conquer DP (`O(K * N log N)`)**: verify `C(a, c) + C(b, d) <= C(a, d) + C(b, c)` (true for `(P[r]-P[l])^2`, pairwise dislikes, and distinct element counts!), then run `compute(l, r, optL, optR)` per layer `1..K`!',
    },
    {
      clue: '"Cost C(l, r) has NO closed-form O(1) prefix formula (e.g. number of equal pairs in A[l..r])"',
      translation:
        '**D&C DP + Mo-Style Sliding Window**: maintain two global pointers `[curL, curR]` inside `compute(l, r, optL, optR)`! Because `mid`, `optL..optR`, and sub-calls stay localized inside the recursion tree, total pointer moves stay **`O(N log N)`** per layer!',
    },
    {
      clue: '"Interval DP dp[i][j] = min_{i < k < j}(dp[i][k] + dp[k][j]) + C(i, j) with N up to 3000"',
      translation:
        '**Knuth-Yao Optimization (`O(N^2)`)**: iterate interval length `len` ascending, set `opt[i][i+1] = i`, and loop `k` strictly between `opt[i][j - 1]` and `opt[i + 1][j]`!',
    },
    {
      clue: '"N is up to 10^5 and K is up to 10^5, so even O(K * N log N) is too slow"',
      translation:
        'Check **Aliens Trick (WQS Binary Search)** if the optimal cost curve `f(K)` is convex in `K`, removing the `K` dimension altogether!',
    },
  ],
  timeComplexity: 'Divide & Conquer DP: O(K * N log N) | Knuth-Yao DP: O(N^2)',
  spaceComplexity: 'D&C DP: O(N) rolling arrays | Knuth-Yao DP: O(N^2)',
  pitfalls: [
    {
      type: 'WA',
      title: 'Allowing Split Index j >= mid Inside compute(l, r, optL, optR)',
      detail:
        'When each subarray must be **non-empty** (`j < mid`), ALWAYS loop `j` from `optL` up to **`min(mid - 1, optR)`**! Allowing `j == mid` lets empty subarrays steal transitions, returning wrong answers on `K`-partition problems.',
    },
    {
      type: 'WA',
      title: 'Applying Knuth-Yao Without Checking BOTH Quadrangle Inequality AND Monotonicity',
      detail:
        'Divide & Conquer DP ONLY requires the **Quadrangle Inequality** on `C(l, r)`. Knuth-Yao ALSO requires **Monotonicity on the containment order** (`C(b, c) <= C(a, d)` for `a <= b <= c <= d`). Always verify on small random stress tests against brute force `O(N^3)`!',
    },
    {
      type: 'TLE',
      title: 'Allocating Full 2D dp[K][N] Table Instead of 2 Rolling 1D Arrays',
      detail:
        'Keeping just `prev[N+1]` and `cur[N+1]` cuts space from `O(KN)` down to `O(N)` and improves L1 cache hit rate significantly.',
    },
    {
      type: 'WA',
      title: 'Setting DP Infinity Too Small (`1e9`) for Squared-Sum Costs',
      detail:
        'In *Subarray Squares*, `N <= 3000` and `A[i] <= 10^5` give `(3 * 10^8)^2 = 9 * 10^{16}`! Always use `INF = 4e18` (`i64::MAX / 4`, `Long.MAX_VALUE / 4`) and 64-bit arithmetic.',
    },
  ],
  implementations: {
    cpp20: `#include <bits/stdc++.h>
using namespace std;

// Divide & Conquer DP (O(K * N log N)) — Partition Array Into K Subarrays Minimizing Sum of Squares
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, k;
    if (!(cin >> n >> k)) return 0;
    vector<long long> pref(n + 1, 0);
    for (int i = 1; i <= n; i++) {
        long long x;
        cin >> x;
        pref[i] = pref[i - 1] + x;
    }

    auto cost = [&](int l, int r) -> long long {
        long long s = pref[r] - pref[l - 1];
        return s * s;
    };

    const long long INF = 4e18;
    vector<long long> prevDp(n + 1, INF), curDp(n + 1, INF);
    prevDp[0] = 0;

    function<void(int, int, int, int)> compute = [&](int l, int r, int optL, int optR) {
        if (l > r) return;
        int mid = (l + r) >> 1;
        pair<long long, int> best = {INF, optL};
        int limit = min(mid - 1, optR);
        for (int j = optL; j <= limit; j++) {
            if (prevDp[j] >= INF) continue;
            long long cand = prevDp[j] + cost(j + 1, mid);
            if (cand < best.first) best = {cand, j};
        }
        curDp[mid] = best.first;
        int opt = best.second;
        compute(l, mid - 1, optL, opt);
        compute(mid + 1, r, opt, optR);
    };

    for (int layer = 1; layer <= k; layer++) {
        fill(curDp.begin(), curDp.end(), INF);
        compute(layer, n, layer - 1, n - 1);
        swap(prevDp, curDp);
    }
    cout << prevDp[n] << "\\n";
    return 0;
}`,
    rust: `use std::io::{self, Read};

const INF: i64 = i64::MAX / 4;

fn compute(
    l: usize,
    r: usize,
    opt_l: usize,
    opt_r: usize,
    pref: &[i64],
    prev_dp: &[i64],
    cur_dp: &mut [i64],
) {
    if l > r {
        return;
    }
    let mid = (l + r) >> 1;
    let mut best_val = INF;
    let mut best_j = opt_l;
    let limit = opt_r.min(mid - 1);
    for j in opt_l..=limit {
        if prev_dp[j] >= INF {
            continue;
        }
        let s = pref[mid] - pref[j];
        let cand = prev_dp[j] + s * s;
        if cand < best_val {
            best_val = cand;
            best_j = j;
        }
    }
    cur_dp[mid] = best_val;
    if mid > l {
        compute(l, mid - 1, opt_l, best_j, pref, prev_dp, cur_dp);
    }
    if mid < r {
        compute(mid + 1, r, best_j, opt_r, pref, prev_dp, cur_dp);
    }
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let n: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };
    let k: usize = it.next().unwrap().parse().unwrap();

    let mut pref = vec![0i64; n + 1];
    for i in 1..=n {
        let x: i64 = it.next().unwrap().parse().unwrap();
        pref[i] = pref[i - 1] + x;
    }

    let mut prev_dp = vec![INF; n + 1];
    let mut cur_dp = vec![INF; n + 1];
    prev_dp[0] = 0;

    for layer in 1..=k {
        cur_dp.fill(INF);
        compute(layer, n, layer - 1, n - 1, &pref, &prev_dp, &mut cur_dp);
        std::mem::swap(&mut prev_dp, &mut cur_dp);
    }
    println!("{}", prev_dp[n]);
}`,
    java21: `import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;

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
            long sign = 1;
            if (c == '-') { sign = -1; c = readByte(); }
            long res = 0;
            while (c > ' ') { res = res * 10 + (c - '0'); c = readByte(); }
            return res * sign;
        }
    }

    static final long INF = Long.MAX_VALUE / 4;
    static long[] pref, prevDp, curDp;

    static void compute(int l, int r, int optL, int optR) {
        if (l > r) return;
        int mid = (l + r) >>> 1;
        long bestVal = INF;
        int bestJ = optL;
        int limit = Math.min(mid - 1, optR);
        for (int j = optL; j <= limit; j++) {
            if (prevDp[j] >= INF) continue;
            long s = pref[mid] - pref[j];
            long cand = prevDp[j] + s * s;
            if (cand < bestVal) {
                bestVal = cand;
                bestJ = j;
            }
        }
        curDp[mid] = bestVal;
        compute(l, mid - 1, optL, bestJ);
        compute(mid + 1, r, bestJ, optR);
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        long nIn = fs.nextLong();
        if (nIn == Long.MIN_VALUE) return;
        int n = (int) nIn, k = (int) fs.nextLong();

        pref = new long[n + 1];
        for (int i = 1; i <= n; i++) pref[i] = pref[i - 1] + fs.nextLong();

        prevDp = new long[n + 1];
        curDp = new long[n + 1];
        Arrays.fill(prevDp, INF);
        prevDp[0] = 0;

        for (int layer = 1; layer <= k; layer++) {
            Arrays.fill(curDp, INF);
            compute(layer, n, layer - 1, n - 1);
            long[] tmp = prevDp; prevDp = curDp; curDp = tmp;
        }
        System.out.println(prevDp[n]);
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
    k = int(next(it))
    pref = [0] * (n + 1)
    for i in range(1, n + 1):
        pref[i] = pref[i - 1] + int(next(it))

    INF = 10**30
    prev_dp = [INF] * (n + 1)
    prev_dp[0] = 0

    for layer in range(1, k + 1):
        cur_dp = [INF] * (n + 1)

        def compute(l: int, r: int, opt_l: int, opt_r: int) -> None:
            if l > r:
                return
            mid = (l + r) >> 1
            best_val = INF
            best_j = opt_l
            limit = opt_r if opt_r < mid - 1 else mid - 1
            pm = pref[mid]
            for j in range(opt_l, limit + 1):
                pj = prev_dp[j]
                if pj >= INF:
                    continue
                s = pm - pref[j]
                cand = pj + s * s
                if cand < best_val:
                    best_val = cand
                    best_j = j
            cur_dp[mid] = best_val
            compute(l, mid - 1, opt_l, best_j)
            compute(mid + 1, r, best_j, opt_r)

        compute(layer, n, layer - 1, n - 1)
        prev_dp = cur_dp

    sys.stdout.write(f"{prev_dp[n]}\\n")

if __name__ == "__main__":
    solve()`,
    ruby: `tokens = $stdin.read.split
exit if tokens.empty?
idx = 0
n = tokens[idx].to_i; idx += 1
k = tokens[idx].to_i; idx += 1

pref = Array.new(n + 1, 0)
(1..n).each do |i|
  pref[i] = pref[i - 1] + tokens[idx].to_i
  idx += 1
end

INF = 10**30
prev_dp = Array.new(n + 1, INF)
prev_dp[0] = 0

(1..k).each do |layer|
  cur_dp = Array.new(n + 1, INF)
  compute = lambda do |l, r, opt_l, opt_r|
    return if l > r
    mid = (l + r) >> 1
    best_val = INF
    best_j = opt_l
    limit = opt_r < mid - 1 ? opt_r : mid - 1
    pm = pref[mid]
    (opt_l..limit).each do |j|
      pj = prev_dp[j]
      next if pj >= INF
      s = pm - pref[j]
      cand = pj + s * s
      if cand < best_val
        best_val = cand
        best_j = j
      end
    end
    cur_dp[mid] = best_val
    compute.call(l, mid - 1, opt_l, best_j)
    compute.call(mid + 1, r, best_j, opt_r)
  end
  compute.call(layer, n, layer - 1, n - 1)
  prev_dp = cur_dp
end
puts prev_dp[n]`,
  },
  practiceProblems: [
    {
      id: 'ch51-p1',
      tier: 'Warmup',
      ratingRange: '2050–2250',
      title: 'Subarray Squares — Divide & Conquer DP in O(K * N log N)',
      statement:
        'Given an array of `N` positive integers, split it into `K` contiguous non-empty subarrays. The cost of each subarray is the **square of the sum of its elements**. Minimize the total cost across all `K` subarrays.',
      constraints: '1 <= K <= N <= 3000, 1 <= x_i <= 10^5',
      sampleInput: '5 2\n2 3 1 2 2',
      sampleOutput: '50',
      hints: [
        'Let `dp[k][i]` be the minimum cost to partition `A[1..i]` into `k` groups: `dp[k][i] = min_{j < i}(dp[k - 1][j] + (pref[i] - pref[j])^2)`.',
        'Because `f(x) = x^2` is convex, the cost satisfies the Quadrangle Inequality! Use `compute(l, r, optL, optR)` evaluating `mid` first so each layer takes `O(N log N)`.',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, k;
    if (!(cin >> n >> k)) return 0;
    vector<long long> pref(n + 1, 0);
    for (int i = 1; i <= n; i++) {
        long long x;
        cin >> x;
        pref[i] = pref[i - 1] + x;
    }

    const long long INF = 4e18;
    vector<long long> prevDp(n + 1, INF), curDp(n + 1, INF);
    prevDp[0] = 0;

    function<void(int, int, int, int)> solveLayer = [&](int l, int r, int optL, int optR) {
        if (l > r) return;
        int mid = (l + r) >> 1;
        long long bestVal = INF;
        int bestJ = optL;
        for (int j = optL; j <= min(mid - 1, optR); j++) {
            if (prevDp[j] >= INF) continue;
            long long s = pref[mid] - pref[j];
            long long cand = prevDp[j] + s * s;
            if (cand < bestVal) { bestVal = cand; bestJ = j; }
        }
        curDp[mid] = bestVal;
        solveLayer(l, mid - 1, optL, bestJ);
        solveLayer(mid + 1, r, bestJ, optR);
    };

    for (int layer = 1; layer <= k; layer++) {
        fill(curDp.begin(), curDp.end(), INF);
        solveLayer(layer, n, layer - 1, n - 1);
        swap(prevDp, curDp);
    }
    cout << prevDp[n] << "\\n";
    return 0;
}`,
        rust: `use std::io::{self, Read};

const INF: i64 = i64::MAX / 4;

fn solve_layer(l: usize, r: usize, opt_l: usize, opt_r: usize, pref: &[i64], prev_dp: &[i64], cur_dp: &mut [i64]) {
    if l > r { return; }
    let mid = (l + r) >> 1;
    let mut best_val = INF;
    let mut best_j = opt_l;
    for j in opt_l..=opt_r.min(mid - 1) {
        if prev_dp[j] >= INF { continue; }
        let s = pref[mid] - pref[j];
        let cand = prev_dp[j] + s * s;
        if cand < best_val { best_val = cand; best_j = j; }
    }
    cur_dp[mid] = best_val;
    if mid > l { solve_layer(l, mid - 1, opt_l, best_j, pref, prev_dp, cur_dp); }
    if mid < r { solve_layer(mid + 1, r, best_j, opt_r, pref, prev_dp, cur_dp); }
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let n: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };
    let k: usize = it.next().unwrap().parse().unwrap();
    let mut pref = vec![0i64; n + 1];
    for i in 1..=n {
        let x: i64 = it.next().unwrap().parse().unwrap();
        pref[i] = pref[i - 1] + x;
    }

    let mut prev_dp = vec![INF; n + 1];
    let mut cur_dp = vec![INF; n + 1];
    prev_dp[0] = 0;
    for layer in 1..=k {
        cur_dp.fill(INF);
        solve_layer(layer, n, layer - 1, n - 1, &pref, &prev_dp, &mut cur_dp);
        std::mem::swap(&mut prev_dp, &mut cur_dp);
    }
    println!("{}", prev_dp[n]);
}`,
        java21: `import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;

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

    static final long INF = Long.MAX_VALUE / 4;
    static long[] pref, prevDp, curDp;

    static void solveLayer(int l, int r, int optL, int optR) {
        if (l > r) return;
        int mid = (l + r) >>> 1;
        long bestVal = INF;
        int bestJ = optL;
        for (int j = optL; j <= Math.min(mid - 1, optR); j++) {
            if (prevDp[j] >= INF) continue;
            long s = pref[mid] - pref[j];
            long cand = prevDp[j] + s * s;
            if (cand < bestVal) { bestVal = cand; bestJ = j; }
        }
        curDp[mid] = bestVal;
        solveLayer(l, mid - 1, optL, bestJ);
        solveLayer(mid + 1, r, bestJ, optR);
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        long nIn = fs.nextLong();
        if (nIn == Long.MIN_VALUE) return;
        int n = (int) nIn, k = (int) fs.nextLong();
        pref = new long[n + 1];
        for (int i = 1; i <= n; i++) pref[i] = pref[i - 1] + fs.nextLong();
        prevDp = new long[n + 1];
        curDp = new long[n + 1];
        Arrays.fill(prevDp, INF);
        prevDp[0] = 0;
        for (int layer = 1; layer <= k; layer++) {
            Arrays.fill(curDp, INF);
            solveLayer(layer, n, layer - 1, n - 1);
            long[] t = prevDp; prevDp = curDp; curDp = t;
        }
        System.out.println(prevDp[n]);
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
    k = int(next(it))
    pref = [0] * (n + 1)
    for i in range(1, n + 1):
        pref[i] = pref[i - 1] + int(next(it))

    INF = 10**30
    prev_dp = [INF] * (n + 1)
    prev_dp[0] = 0

    for layer in range(1, k + 1):
        cur_dp = [INF] * (n + 1)

        def rec(l: int, r: int, opt_l: int, opt_r: int) -> None:
            if l > r:
                return
            mid = (l + r) >> 1
            best_val = INF
            best_j = opt_l
            lim = opt_r if opt_r < mid - 1 else mid - 1
            pm = pref[mid]
            for j in range(opt_l, lim + 1):
                pj = prev_dp[j]
                if pj >= INF:
                    continue
                s = pm - pref[j]
                cand = pj + s * s
                if cand < best_val:
                    best_val = cand
                    best_j = j
            cur_dp[mid] = best_val
            rec(l, mid - 1, opt_l, best_j)
            rec(mid + 1, r, best_j, opt_r)

        rec(layer, n, layer - 1, n - 1)
        prev_dp = cur_dp

    sys.stdout.write(f"{prev_dp[n]}\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
idx = 0
n = tokens[idx].to_i; idx += 1
k = tokens[idx].to_i; idx += 1
pref = Array.new(n + 1, 0)
(1..n).each do |i|
  pref[i] = pref[i - 1] + tokens[idx].to_i
  idx += 1
end

INF = 10**30
prev_dp = Array.new(n + 1, INF)
prev_dp[0] = 0

(1..k).each do |layer|
  cur_dp = Array.new(n + 1, INF)
  rec = lambda do |l, r, opt_l, opt_r|
    return if l > r
    mid = (l + r) >> 1
    best_val = INF
    best_j = opt_l
    lim = opt_r < mid - 1 ? opt_r : mid - 1
    pm = pref[mid]
    (opt_l..lim).each do |j|
      pj = prev_dp[j]
      next if pj >= INF
      s = pm - pref[j]
      cand = pj + s * s
      if cand < best_val
        best_val = cand
        best_j = j
      end
    end
    cur_dp[mid] = best_val
    rec.call(l, mid - 1, opt_l, best_j)
    rec.call(mid + 1, r, best_j, opt_r)
  end
  rec.call(layer, n, layer - 1, n - 1)
  prev_dp = cur_dp
end
puts prev_dp[n]`,
      },
    },
    {
      id: 'ch51-p2',
      tier: 'Standard',
      ratingRange: '2150–2350',
      title: 'Breaking a String — O(M^2) Knuth-Yao Interval DP Optimization',
      statement:
        'A string of length `L` must be cut at `M` specified break positions `c_1 < c_2 < ... < c_M`. Each cut of a piece of length `len` costs `len` units of work. Find the **minimum total cost** to execute all `M` cuts in optimal order.',
      constraints: '1 <= L <= 10^7, 1 <= M <= 1000',
      sampleInput: '20 3\n2 8 10',
      sampleOutput: '38',
      hints: [
        'Append endpoints `0` and `L` to form array `p[0..M+1]` (`K = M + 2` points). Define `dp[i][j]` as the minimum cost to make all cuts strictly inside `[p[i], p[j]]`: `dp[i][j] = min_{i < k < j}(dp[i][k] + dp[k][j]) + (p[j] - p[i])`.',
        'Base cases: `dp[i][i + 1] = 0`, `opt[i][i + 1] = i`. For `len = 2 .. M + 1`, iterate `k` ONLY from **`opt[i][j - 1]` to `opt[i + 1][j]`** (Knuth-Yao), dropping `O(M^3)` down to exact **`O(M^2)`**!',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    long long L;
    int m;
    if (!(cin >> L >> m)) return 0;
    vector<long long> p(m + 2);
    p[0] = 0;
    for (int i = 1; i <= m; i++) cin >> p[i];
    p[m + 1] = L;

    int kCount = m + 2;
    const long long INF = 4e18;
    vector<vector<long long>> dp(kCount, vector<long long>(kCount, 0));
    vector<vector<int>> opt(kCount, vector<int>(kCount, 0));

    for (int i = 0; i + 1 < kCount; i++) opt[i][i + 1] = i;

    for (int len = 2; len < kCount; len++) {
        for (int i = 0; i + len < kCount; i++) {
            int j = i + len;
            dp[i][j] = INF;
            int lo = max(i + 1, opt[i][j - 1]);
            int hi = min(j - 1, opt[i + 1][j]);
            for (int k = lo; k <= hi; k++) {
                long long cand = dp[i][k] + dp[k][j] + (p[j] - p[i]);
                if (cand < dp[i][j]) {
                    dp[i][j] = cand;
                    opt[i][j] = k;
                }
            }
        }
    }
    cout << dp[0][kCount - 1] << "\\n";
    return 0;
}`,
        rust: `use std::io::{self, Read};

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let l_len: i64 = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };
    let m: usize = it.next().unwrap().parse().unwrap();

    let mut p = Vec::with_capacity(m + 2);
    p.push(0);
    for _ in 0..m {
        p.push(it.next().unwrap().parse::<i64>().unwrap());
    }
    p.push(l_len);

    let kc = m + 2;
    let inf = i64::MAX / 4;
    let mut dp = vec![vec![0i64; kc]; kc];
    let mut opt = vec![vec![0usize; kc]; kc];
    for i in 0..(kc - 1) {
        opt[i][i + 1] = i;
    }

    for len in 2..kc {
        for i in 0..(kc - len) {
            let j = i + len;
            dp[i][j] = inf;
            let lo = (i + 1).max(opt[i][j - 1]);
            let hi = (j - 1).min(opt[i + 1][j]);
            for k in lo..=hi {
                let cand = dp[i][k] + dp[k][j] + (p[j] - p[i]);
                if cand < dp[i][j] {
                    dp[i][j] = cand;
                    opt[i][j] = k;
                }
            }
        }
    }
    println!("{}", dp[0][kc - 1]);
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
        long L = fs.nextLong();
        if (L == Long.MIN_VALUE) return;
        int m = (int) fs.nextLong();
        long[] p = new long[m + 2];
        p[0] = 0;
        for (int i = 1; i <= m; i++) p[i] = fs.nextLong();
        p[m + 1] = L;

        int kc = m + 2;
        long INF = Long.MAX_VALUE / 4;
        long[][] dp = new long[kc][kc];
        int[][] opt = new int[kc][kc];
        for (int i = 0; i + 1 < kc; i++) opt[i][i + 1] = i;

        for (int len = 2; len < kc; len++) {
            for (int i = 0; i + len < kc; i++) {
                int j = i + len;
                dp[i][j] = INF;
                int lo = Math.max(i + 1, opt[i][j - 1]);
                int hi = Math.min(j - 1, opt[i + 1][j]);
                for (int k = lo; k <= hi; k++) {
                    long cand = dp[i][k] + dp[k][j] + (p[j] - p[i]);
                    if (cand < dp[i][j]) { dp[i][j] = cand; opt[i][j] = k; }
                }
            }
        }
        System.out.println(dp[0][kc - 1]);
    }
}`,
        python3: `import sys

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    L = int(next(it))
    m = int(next(it))
    p = [0] + [int(next(it)) for _ in range(m)] + [L]
    kc = m + 2

    INF = 10**30
    dp = [[0] * kc for _ in range(kc)]
    opt = [[0] * kc for _ in range(kc)]
    for i in range(kc - 1):
        opt[i][i + 1] = i

    for length in range(2, kc):
        for i in range(kc - length):
            j = i + length
            best = INF
            best_k = i + 1
            lo = opt[i][j - 1]
            if lo < i + 1:
                lo = i + 1
            hi = opt[i + 1][j]
            if hi > j - 1:
                hi = j - 1
            seg = p[j] - p[i]
            row_i = dp[i]
            for k in range(lo, hi + 1):
                cand = row_i[k] + dp[k][j] + seg
                if cand < best:
                    best = cand
                    best_k = k
            dp[i][j] = best
            opt[i][j] = best_k

    sys.stdout.write(f"{dp[0][kc - 1]}\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
idx = 0
l_len = tokens[idx].to_i; idx += 1
m = tokens[idx].to_i; idx += 1
p = [0] + Array.new(m) { tokens[idx].to_i.tap { idx += 1 } } + [l_len]
kc = m + 2

INF = 10**30
dp = Array.new(kc) { Array.new(kc, 0) }
opt = Array.new(kc) { Array.new(kc, 0) }
(0...(kc - 1)).each { |i| opt[i][i + 1] = i }

(2...kc).each do |len|
  (0...(kc - len)).each do |i|
    j = i + len
    best = INF
    best_k = i + 1
    lo = [i + 1, opt[i][j - 1]].max
    hi = [j - 1, opt[i + 1][j]].min
    seg = p[j] - p[i]
    (lo..hi).each do |k|
      cand = dp[i][k] + dp[k][j] + seg
      if cand < best
        best = cand
        best_k = k
      end
    end
    dp[i][j] = best
    opt[i][j] = best_k
  end
end
puts dp[0][kc - 1]`,
      },
    },
    {
      id: 'ch51-p3',
      tier: 'Boss',
      ratingRange: '2300–2600',
      title: 'Ciel and Gondolas — 2D Prefix Dislike Matrix & O(K * N log N) Partitioning',
      statement:
        '`N` people stand in a line (`1..N`), with an `N x N` symmetric pairwise unfamiliarity matrix `U[i][j]`. Group the line into `K` contiguous non-empty gondolas minimizing the total unfamiliarity across pairs placed in the same gondola.',
      constraints: '1 <= K <= N <= 4000, 0 <= U[i][j] <= 9, U[i][i] = 0',
      sampleInput: '4 2\n0 1 1 1\n1 0 1 1\n1 1 0 1\n1 1 1 0',
      sampleOutput: '2',
      hints: [
        'Precompute the 2D prefix sum `pref[i][j]` of the matrix `U` in `O(N^2)`: then the unfamiliarity cost inside any contiguous block `[l .. r]` is `(pref[r][r] - pref[l-1][r] - pref[r][l-1] + pref[l-1][l-1]) / 2` in `O(1)`!',
        'Apply Divide & Conquer DP `compute(l, r, optL, optR)` across layers `1..K` for total runtime `O(N^2 + K * N log N)`!',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, k;
    if (!(cin >> n >> k)) return 0;
    vector<vector<int>> pref(n + 1, vector<int>(n + 1, 0));
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= n; j++) {
            int u;
            cin >> u;
            pref[i][j] = u + pref[i - 1][j] + pref[i][j - 1] - pref[i - 1][j - 1];
        }
    }

    auto cost = [&](int l, int r) -> int {
        return (pref[r][r] - pref[l - 1][r] - pref[r][l - 1] + pref[l - 1][l - 1]) >> 1;
    };

    const int INF = 1e9;
    vector<int> prevDp(n + 1, INF), curDp(n + 1, INF);
    prevDp[0] = 0;

    function<void(int, int, int, int)> compute = [&](int l, int r, int optL, int optR) {
        if (l > r) return;
        int mid = (l + r) >> 1;
        int bestVal = INF, bestJ = optL;
        for (int j = optL; j <= min(mid - 1, optR); j++) {
            if (prevDp[j] >= INF) continue;
            int cand = prevDp[j] + cost(j + 1, mid);
            if (cand < bestVal) { bestVal = cand; bestJ = j; }
        }
        curDp[mid] = bestVal;
        compute(l, mid - 1, optL, bestJ);
        compute(mid + 1, r, bestJ, optR);
    };

    for (int layer = 1; layer <= k; layer++) {
        fill(curDp.begin(), curDp.end(), INF);
        compute(layer, n, layer - 1, n - 1);
        swap(prevDp, curDp);
    }
    cout << prevDp[n] << "\\n";
    return 0;
}`,
        rust: `use std::io::{self, Read};

const INF: i32 = 1_000_000_000;

fn cost(pref: &[Vec<i32>], l: usize, r: usize) -> i32 {
    (pref[r][r] - pref[l - 1][r] - pref[r][l - 1] + pref[l - 1][l - 1]) >> 1
}

fn compute(l: usize, r: usize, opt_l: usize, opt_r: usize, pref: &[Vec<i32>], prev_dp: &[i32], cur_dp: &mut [i32]) {
    if l > r { return; }
    let mid = (l + r) >> 1;
    let mut best_val = INF;
    let mut best_j = opt_l;
    for j in opt_l..=opt_r.min(mid - 1) {
        if prev_dp[j] >= INF { continue; }
        let cand = prev_dp[j] + cost(pref, j + 1, mid);
        if cand < best_val { best_val = cand; best_j = j; }
    }
    cur_dp[mid] = best_val;
    if mid > l { compute(l, mid - 1, opt_l, best_j, pref, prev_dp, cur_dp); }
    if mid < r { compute(mid + 1, r, best_j, opt_r, pref, prev_dp, cur_dp); }
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let n: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };
    let k: usize = it.next().unwrap().parse().unwrap();

    let mut pref = vec![vec![0i32; n + 1]; n + 1];
    for i in 1..=n {
        for j in 1..=n {
            let u: i32 = it.next().unwrap().parse().unwrap();
            pref[i][j] = u + pref[i - 1][j] + pref[i][j - 1] - pref[i - 1][j - 1];
        }
    }

    let mut prev_dp = vec![INF; n + 1];
    let mut cur_dp = vec![INF; n + 1];
    prev_dp[0] = 0;
    for layer in 1..=k {
        cur_dp.fill(INF);
        compute(layer, n, layer - 1, n - 1, &pref, &prev_dp, &mut cur_dp);
        std::mem::swap(&mut prev_dp, &mut cur_dp);
    }
    println!("{}", prev_dp[n]);
}`,
        java21: `import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;

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
            if (c == -1) return -1;
            int res = 0;
            while (c > ' ') { res = res * 10 + (c - '0'); c = readByte(); }
            return res;
        }
    }

    static final int INF = 1_000_000_000;
    static int[][] pref;
    static int[] prevDp, curDp;

    static int cost(int l, int r) {
        return (pref[r][r] - pref[l - 1][r] - pref[r][l - 1] + pref[l - 1][l - 1]) >> 1;
    }

    static void compute(int l, int r, int optL, int optR) {
        if (l > r) return;
        int mid = (l + r) >>> 1;
        int bestVal = INF, bestJ = optL;
        for (int j = optL; j <= Math.min(mid - 1, optR); j++) {
            if (prevDp[j] >= INF) continue;
            int cand = prevDp[j] + cost(j + 1, mid);
            if (cand < bestVal) { bestVal = cand; bestJ = j; }
        }
        curDp[mid] = bestVal;
        compute(l, mid - 1, optL, bestJ);
        compute(mid + 1, r, bestJ, optR);
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        int n = fs.nextInt();
        if (n == -1) return;
        int k = fs.nextInt();
        pref = new int[n + 1][n + 1];
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= n; j++) {
                pref[i][j] = fs.nextInt() + pref[i - 1][j] + pref[i][j - 1] - pref[i - 1][j - 1];
            }
        }
        prevDp = new int[n + 1];
        curDp = new int[n + 1];
        Arrays.fill(prevDp, INF);
        prevDp[0] = 0;
        for (int layer = 1; layer <= k; layer++) {
            Arrays.fill(curDp, INF);
            compute(layer, n, layer - 1, n - 1);
            int[] t = prevDp; prevDp = curDp; curDp = t;
        }
        System.out.println(prevDp[n]);
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
    k = int(next(it))

    pref = [[0] * (n + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        row = pref[i]
        prow = pref[i - 1]
        for j in range(1, n + 1):
            row[j] = int(next(it)) + prow[j] + row[j - 1] - prow[j - 1]

    INF = 10**9
    prev_dp = [INF] * (n + 1)
    prev_dp[0] = 0

    for layer in range(1, k + 1):
        cur_dp = [INF] * (n + 1)

        def rec(l: int, r: int, opt_l: int, opt_r: int) -> None:
            if l > r:
                return
            mid = (l + r) >> 1
            best_val = INF
            best_j = opt_l
            lim = opt_r if opt_r < mid - 1 else mid - 1
            pm = pref[mid]
            pm_val = pm[mid]
            for j in range(opt_l, lim + 1):
                pj = prev_dp[j]
                if pj >= INF:
                    continue
                c = (pm_val - pref[j][mid] - pm[j] + pref[j][j]) >> 1
                cand = pj + c
                if cand < best_val:
                    best_val = cand
                    best_j = j
            cur_dp[mid] = best_val
            rec(l, mid - 1, opt_l, best_j)
            rec(mid + 1, r, best_j, opt_r)

        rec(layer, n, layer - 1, n - 1)
        prev_dp = cur_dp

    sys.stdout.write(f"{prev_dp[n]}\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
idx = 0
n = tokens[idx].to_i; idx += 1
k = tokens[idx].to_i; idx += 1

pref = Array.new(n + 1) { Array.new(n + 1, 0) }
(1..n).each do |i|
  (1..n).each do |j|
    u = tokens[idx].to_i; idx += 1
    pref[i][j] = u + pref[i - 1][j] + pref[i][j - 1] - pref[i - 1][j - 1]
  end
end

INF = 10**9
prev_dp = Array.new(n + 1, INF)
prev_dp[0] = 0

(1..k).each do |layer|
  cur_dp = Array.new(n + 1, INF)
  rec = lambda do |l, r, opt_l, opt_r|
    return if l > r
    mid = (l + r) >> 1
    best_val = INF
    best_j = opt_l
    lim = opt_r < mid - 1 ? opt_r : mid - 1
    pm = pref[mid]
    (opt_l..lim).each do |j|
      pj = prev_dp[j]
      next if pj >= INF
      c = (pm[mid] - pref[j][mid] - pm[j] + pref[j][j]) >> 1
      cand = pj + c
      if cand < best_val
        best_val = cand
        best_j = j
      end
    end
    cur_dp[mid] = best_val
    rec.call(l, mid - 1, opt_l, best_j)
    rec.call(mid + 1, r, best_j, opt_r)
  end
  rec.call(layer, n, layer - 1, n - 1)
  prev_dp = cur_dp
end
puts prev_dp[n]`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'CSES',
      title: 'Subarray Squares',
      difficulty: 'Platinum (2150)',
      url: 'https://cses.fi/problemset/task/2086',
      patternNote: 'Direct O(K * N log N) Divide & Conquer DP with O(1) prefix squared sums.',
    },
    {
      platform: 'Codeforces',
      title: 'Ciel and Gondolas (321E)',
      difficulty: '2100',
      url: 'https://codeforces.com/problemset/problem/321/E',
      patternNote: 'Classic D&C DP + 2D prefix sums; requires fast I/O for 4000 x 4000 input.',
    },
    {
      platform: 'AtCoder',
      title: 'Yet Another Minimization Problem (CF 868F)',
      difficulty: '2500',
      url: 'https://codeforces.com/problemset/problem/868/F',
      patternNote: 'Combine D&C DP with Mo-style two-pointer frequency tracking for non-closed-form costs.',
    },
    {
      platform: 'CodeChef',
      title: 'CHEFAOR / Breaking a String',
      difficulty: '2200',
      url: 'https://www.codechef.com/problems/CHEFAOR',
      patternNote: 'Knuth-Yao and D&C DP benchmarks demonstrating Quadrangle Inequality speedups.',
    },
    {
      platform: 'HackerRank',
      title: 'Guardians of the Lunatics',
      difficulty: 'Advanced',
      url: 'https://www.hackerrank.com/challenges',
      patternNote: 'Partition N cells into G groups minimizing length * sum using D&C DP.',
    },
    {
      platform: 'NeetCode 150',
      title: 'Split Array Largest Sum / Burst Balloons',
      difficulty: 'Hard',
      url: 'https://neetcode.io/practice',
      patternNote: 'Generalize interval DP and K-way array partitioning to quadratic/convex costs.',
    },
  ],
  interviewNotes: [
    'Whenever you see `O(K * N^2)` partition DP with `N ~ 3000..8000`, immediately test the Quadrangle Inequality `C(a, c) + C(b, d) <= C(a, d) + C(b, c)` on random triples—if it holds, Divide & Conquer DP cuts runtime by `N / log N` (over 300x faster!).',
    'Never compute `cost(l, r)` greedily inside Knuth-Yao without proving both Quadrangle Inequality AND Monotonicity (`a <= b <= c <= d => C(b, c) <= C(a, d)`), whereas D&C DP ONLY needs the Quadrangle Inequality.',
    'If the cost function `C(l, r)` cannot be precomputed in `O(1)` (e.g. number of distinct elements or matching pairs), maintain a global Mo-style sliding window `[curL, curR]` inside `compute(l, r, optL, optR)`—the total pointer distance moved stays strictly `O(N log N)` per DP layer.',
  ],
  projectBlueprint: {
    title: 'Distributed Database Shard & Cost-Balanced Partition Planner',
    tagline:
      'TypeScript query-optimizer module using Divide & Conquer DP to split ordered time-series tables into K load-balanced shards minimizing squared-load variance.',
    stackSummary: 'TypeScript / Node.js with D&C Monotonic Split Search & Prefix Accumulators',
    asciiDiagram: `[Table Row Weights A[1..N]] -> [Prefix Sum O(N)] -> [K-Layer D&C Split Search]
                                                            |
                        [compute(l, r, optL, optR)] --------+--------> [Balanced Shards O(K N log N)]`,
    milestones: [
      {
        id: 'm1',
        title: 'Convex Shard Cost Evaluator',
        detail: 'Compute contiguous shard load imbalance sum^2 in O(1) via Float64 prefix sums.',
      },
      {
        id: 'm2',
        title: 'Monotonic D&C Optimizer',
        detail: 'Implement compute(l, r, optL, optR) recording opt[layer][i] for full boundary reconstruction.',
      },
      {
        id: 'm3',
        title: 'Boundary Backtracker',
        detail: 'Trace opt[layer][n] backwards from K down to 1 to emit exact shard start/end offsets.',
      },
    ],
    starterCode: `export function planBalancedShards(weights: number[], k: number): { minCost: number; splits: number[] } {
  const n = weights.length;
  const pref = new Float64Array(n + 1);
  for (let i = 1; i <= n; i++) pref[i] = pref[i - 1] + weights[i - 1];

  const INF = 1e30;
  let prev = new Float64Array(n + 1).fill(INF);
  prev[0] = 0;
  const optTable: Int32Array[] = Array.from({ length: k + 1 }, () => new Int32Array(n + 1));

  for (let layer = 1; layer <= k; layer++) {
    const cur = new Float64Array(n + 1).fill(INF);
    const compute = (l: number, r: number, optL: number, optR: number): void => {
      if (l > r) return;
      const mid = (l + r) >> 1;
      let bestVal = INF;
      let bestJ = optL;
      const lim = Math.min(mid - 1, optR);
      for (let j = optL; j <= lim; j++) {
        if (prev[j] >= INF) continue;
        const s = pref[mid] - pref[j];
        const cand = prev[j] + s * s;
        if (cand < bestVal) {
          bestVal = cand;
          bestJ = j;
        }
      }
      cur[mid] = bestVal;
      optTable[layer][mid] = bestJ;
      compute(l, mid - 1, optL, bestJ);
      compute(mid + 1, r, bestJ, optR);
    };
    compute(layer, n, layer - 1, n - 1);
    prev = cur;
  }

  const splits: number[] = [];
  let curPos = n;
  for (let layer = k; layer >= 1; layer--) {
    const cut = optTable[layer][curPos];
    splits.push(cut);
    curPos = cut;
  }
  splits.reverse();
  return { minCost: prev[n], splits };
}

console.log(planBalancedShards([2, 3, 1, 2, 2], 2));`,
  },
};
