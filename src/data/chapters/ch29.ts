import type { TheoryChapter } from '../../types/vault';

export const CH29_BITMASK_SOS_DP: TheoryChapter = {
  slug: 'bitmask-dp-sos',
  topicId: 'dp-21',
  title: 'Bitmask DP & Sum Over Subsets (SOS DP)',
  domain: 'Search, Greedy & DP',
  ratingTier: '1900–2200',
  usacoDivision: 'Gold',
  subtitle:
    'Compress exponential subset states into single 32-bit integers, enumerate submasks in O(3^N), and aggregate subset or superset sums across all 2^N masks in O(N 2^N) via SOS Zeta Transforms.',
  analogyTitle: 'The 20-Switch Circuit Panel & Hypercube Dimension Sweep',
  analogyBody:
    'Imagine an industrial control room with `N <= 20` toggle switches. Every combination of ON/OFF switches is just an integer `mask` from `0` to `2^N - 1` (`1,048,575`). **Bitmask DP** turns "which cities have I visited?" or "which workers are already assigned?" into an integer array index! Even better, suppose every switch configuration `mask` holds a frequency `A[mask]`, and for EVERY `mask` you want the sum of `A[sub]` over all sub-configurations `sub` whose ON switches are a subset of `mask`. Checking every pair takes `4^N`; looping submasks `for (s = mask; s; s = (s - 1) & mask)` takes `3^N`; **SOS DP** instead sweeps one switch dimension `i = 0 .. N-1` at a time, adding `dp[mask ^ (1 << i)]` into `dp[mask]` whenever bit `i` is ON—visiting each of the `2^N` hypercube vertices once per dimension in blazing `O(N 2^N)`!',
  prerequisites: [
    {
      slug: 'knapsack-lis-classic-dp',
      title: '1D/2D Dynamic Programming & Knapsack State Design',
    },
  ],
  traceTitle: 'Interactive Submask Enumeration & 4-Bit SOS DP Dimension-by-Dimension Transform',
  traceSubtitle:
    'Watch `F[mask]` over `N = 4` bits (`16` masks, showing indices `0..7` & `8..15`) transform into subset sums `SOS[mask] = sum_{sub subset mask} A[sub]` dimension by dimension (`bit 0 -> bit 1 -> bit 2 -> bit 3`).',
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Step 1: Initialize SOS Table F[mask] = A[mask] & Enumerate Submasks of 1011 (11)',
      explanation:
        'Suppose A[0]=1, A[1]=2, A[2]=0, A[3]=4, A[5]=3, A[8]=5, A[9]=1, A[11]=2 (all others 0). Submask trick `sub = (sub - 1) & 11` visits strictly {11(1011), 10(1010), 9(1001), 8(1000), 3(0011), 2(0010), 1(0001), 0(0000)} in O(3^N) total across all masks.',
      mode: 'array',
      arrays: [
        {
          name: 'F[0..7] (Initial)',
          cells: [
            { index: 0, value: 1, highlight: 'active' },
            { index: 1, value: 2, highlight: 'active' },
            { index: 2, value: 0, highlight: 'active' },
            { index: 3, value: 4, highlight: 'active' },
            { index: 4, value: 0, highlight: 'neutral' },
            { index: 5, value: 3, highlight: 'neutral' },
            { index: 6, value: 0, highlight: 'neutral' },
            { index: 7, value: 0, highlight: 'neutral' },
          ],
        },
        {
          name: 'F[8..15] (Initial)',
          cells: [
            { index: 8, value: 5, highlight: 'active' },
            { index: 9, value: 1, highlight: 'active' },
            { index: 10, value: 0, highlight: 'active' },
            { index: 11, value: 2, highlight: 'active' },
            { index: 12, value: 0, highlight: 'neutral' },
            { index: 13, value: 0, highlight: 'neutral' },
            { index: 14, value: 0, highlight: 'neutral' },
            { index: 15, value: 0, highlight: 'neutral' },
          ],
        },
      ],
      variables: { Dimension: 'Init', SubmasksOf11: '11,10,9,8,3,2,1,0', TotalSubmaskOps: '3^4 = 81' },
    },
    {
      stepNumber: 2,
      title: 'Step 2: Dimension i = 0 (Allow Bit 0 to Flip 1 -> 0)',
      explanation:
        'For every mask with bit 0 set (`mask & 1`), add `F[mask ^ 1]`. Now `F[mask]` holds sums over submasks differing ONLY in bit 0: e.g., F[1]+=F[0]=3, F[3]+=F[2]=4, F[5]+=F[4]=3, F[9]+=F[8]=6, F[11]+=F[10]=2.',
      mode: 'array',
      arrays: [
        {
          name: 'F[0..7] (After bit 0)',
          cells: [
            { index: 0, value: 1, highlight: 'neutral' },
            { index: 1, value: 3, highlight: 'updated' },
            { index: 2, value: 0, highlight: 'neutral' },
            { index: 3, value: 4, highlight: 'updated' },
            { index: 4, value: 0, highlight: 'neutral' },
            { index: 5, value: 3, highlight: 'updated' },
            { index: 6, value: 0, highlight: 'neutral' },
            { index: 7, value: 0, highlight: 'updated' },
          ],
        },
        {
          name: 'F[8..15] (After bit 0)',
          cells: [
            { index: 8, value: 5, highlight: 'neutral' },
            { index: 9, value: 6, highlight: 'updated' },
            { index: 10, value: 0, highlight: 'neutral' },
            { index: 11, value: 2, highlight: 'updated' },
            { index: 12, value: 0, highlight: 'neutral' },
            { index: 13, value: 0, highlight: 'updated' },
            { index: 14, value: 0, highlight: 'neutral' },
            { index: 15, value: 0, highlight: 'updated' },
          ],
        },
      ],
      variables: { ActiveBit: 0, Rule: 'if (mask & 1) F[mask] += F[mask ^ 1]', 'F[11]': 2 },
    },
    {
      stepNumber: 3,
      title: 'Step 3: Dimension i = 1 (Allow Bits {0, 1} to Vary)',
      explanation:
        'For every mask with bit 1 set (`mask & 2`), add `F[mask ^ 2]`. Now F[3]=4+3=7, F[7]=0+3=3, F[11]=2+6=8, F[10]=0+5=5. Every vertex now sums all submasks differing in bits {0, 1}!',
      mode: 'array',
      arrays: [
        {
          name: 'F[0..7] (After bit 1)',
          cells: [
            { index: 0, value: 1, highlight: 'neutral' },
            { index: 1, value: 3, highlight: 'neutral' },
            { index: 2, value: 1, highlight: 'updated' },
            { index: 3, value: 7, highlight: 'updated' },
            { index: 4, value: 0, highlight: 'neutral' },
            { index: 5, value: 3, highlight: 'neutral' },
            { index: 6, value: 0, highlight: 'updated' },
            { index: 7, value: 3, highlight: 'updated' },
          ],
        },
        {
          name: 'F[8..15] (After bit 1)',
          cells: [
            { index: 8, value: 5, highlight: 'neutral' },
            { index: 9, value: 6, highlight: 'neutral' },
            { index: 10, value: 5, highlight: 'updated' },
            { index: 11, value: 8, highlight: 'updated' },
            { index: 12, value: 0, highlight: 'neutral' },
            { index: 13, value: 0, highlight: 'neutral' },
            { index: 14, value: 0, highlight: 'updated' },
            { index: 15, value: 0, highlight: 'updated' },
          ],
        },
      ],
      variables: { ActiveBit: 1, Rule: 'if (mask & 2) F[mask] += F[mask ^ 2]', 'F[11]': 8 },
    },
    {
      stepNumber: 4,
      title: 'Step 4: Sweep Bits i = 2 and i = 3 -> Complete SOS Zeta Transform',
      explanation:
        'After bit 2: F[4..7] absorb F[0..3] (F[5]=6, F[7]=10) and F[12..15] absorb F[8..11]. After bit 3: F[8..15] absorb F[0..7], yielding F[11] = F[11]+F[3] = 8+7 = 15 (= A[0]+A[1]+A[3]+A[8]+A[9]+A[11]) and F[15] = 18!',
      mode: 'array',
      arrays: [
        {
          name: 'SOS[0..7] (Final)',
          cells: [
            { index: 0, value: 1, highlight: 'neutral' },
            { index: 1, value: 3, highlight: 'neutral' },
            { index: 2, value: 1, highlight: 'neutral' },
            { index: 3, value: 7, highlight: 'neutral' },
            { index: 4, value: 1, highlight: 'neutral' },
            { index: 5, value: 6, highlight: 'neutral' },
            { index: 6, value: 1, highlight: 'neutral' },
            { index: 7, value: 10, highlight: 'window' },
          ],
        },
        {
          name: 'SOS[8..15] (Final)',
          cells: [
            { index: 8, value: 6, highlight: 'updated' },
            { index: 9, value: 9, highlight: 'updated' },
            { index: 10, value: 6, highlight: 'updated' },
            { index: 11, value: 15, highlight: 'active' },
            { index: 12, value: 6, highlight: 'updated' },
            { index: 13, value: 12, highlight: 'updated' },
            { index: 14, value: 6, highlight: 'updated' },
            { index: 15, value: 18, highlight: 'active' },
          ],
        },
      ],
      variables: { ActiveBits: '2 then 3', 'SOS[11]': 15, 'SOS[15]': 18, Complexity: '4 * 16 = 64 ops' },
    },
  ],
  reductionClues: [
    {
      clue: '"N <= 20 items, tracks visited set / assigned subset, find min cost or number of ways"',
      translation:
        'Classic Bitmask DP! Index states by integer `mask` in `[0, 2^N)`. If counting permutations/matchings where index `i = popcount(mask)` is forced, drop `i` from the state to shrink memory and runtime from `O(N^2 2^N)` to `O(N 2^N)`.',
    },
    {
      clue: '"Partition N <= 16 items into groups by splitting mask into two disjoint submasks"',
      translation:
        'Submask Iteration: `for (int sub = mask; sub > 0; sub = (sub - 1) & mask)`. Because every item can be in `{excluded, mask\\sub, sub}`, summing over all masks performs strictly `3^N` iterations (`3^16 = 4.3e7`, sub-second in C++!).',
    },
    {
      clue: '"For each A[i] <= 10^6 (up to 20 bits), count how many A[j] satisfy (A[i] & A[j]) == 0 or (A[i] | A[j]) == A[i]"',
      translation:
        'SOS DP (Subset Zeta Transform)! `(x | y) == x` means `y` is a submask of `x`; `(x & y) == 0` means `y` is a submask of the bitwise complement `(~x) & ((1 << B) - 1)`! Compute `sos[mask]` in `O(B 2^B)` then answer each query in `O(1)`.',
    },
    {
      clue: '"Need exact frequency of pairs (i, j) whose bitwise AND equals exactly 0 (or K) via Inclusion-Exclusion"',
      translation:
        'Superset SOS DP + Mobius Inversion! First compute `sup[mask] = sum_{mask subset sup} cnt[sup]`, square `ways[mask] = sup[mask]^2` (pairs whose AND is a superset of `mask`), then reverse the SOS loop with subtraction (`ways[mask] -= ways[mask | (1 << i)]`) to recover exact `AND == K` counts!',
    },
  ],
  timeComplexity: 'Bitmask DP: O(N 2^N) to O(N^2 2^N) | Submask Loop: O(3^N) | SOS Zeta Transform: O(B * 2^B)',
  spaceComplexity: 'O(2^N) or O(N * 2^N)',
  pitfalls: [
    {
      type: 'WA',
      title: '1 << N Integer Overflow When N >= 31 (or Missing 1LL << N)',
      detail:
        'In C++ and Java, `1 << 31` is undefined behavior or negative (`INT_MIN`)! Even for `N <= 20`, checking bit `i` in 64-bit masks requires `(mask >> i) & 1` or `1ULL << i`.',
    },
    {
      type: 'WA',
      title: 'Looping Submasks and Forgetting sub == 0 (Empty Subset)',
      detail:
        'The standard loop `for (int sub = mask; sub > 0; sub = (sub - 1) & mask)` skips `sub = 0`. If the empty subset is valid, handle `0` explicitly or use `int sub = mask; do { ... sub = (sub - 1) & mask; } while (sub != mask);`.',
    },
    {
      type: 'WA',
      title: 'Iterating Mask Inside Inner Bit Loop With Wrong Loop Order in SOS DP',
      detail:
        'In `O(N 2^N)` 1D SOS DP, the bit dimension `i` MUST be the outer loop and `mask` the inner loop! Putting `mask` outside and `i` inside updates `F[mask]` using partially transformed entries and misses multi-bit submasks.',
    },
    {
      type: 'MLE',
      title: 'Storing 2D DP[N][2^N] When 1D DP[2^N] or Popcount Ordering Suffices',
      detail:
        'For `N = 20`, `20 * 2^20 * 8 bytes = 160 MB` (tight on 256 MB judges). Whenever transitions move from `mask` to `mask | (1 << j)`, the number of processed items equals `__builtin_popcount(mask)`, cutting space to `2^N` (`8 MB`).',
    },
  ],
  implementations: {
    cpp20: `#include <bits/stdc++.h>
using namespace std;

// Sum Over Subsets (SOS) Zeta & Mobius Transform in O(B * 2^B)
// Forward Subset Sum:  sos[mask] = sum_{sub subset mask} freq[sub]
// Forward Superset Sum: sup[mask] = sum_{mask subset sup} freq[sup]
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, bits = 20;
    if (!(cin >> n)) return 0;
    int full = 1 << bits;
    vector<int> a(n);
    vector<long long> sos(full, 0), sup(full, 0);

    for (int i = 0; i < n; i++) {
        cin >> a[i];
        sos[a[i]]++;
        sup[a[i]]++;
    }

    // 1. Subset Zeta Transform: outer loop = bit dimension, inner loop = mask
    for (int b = 0; b < bits; b++) {
        for (int mask = 0; mask < full; mask++) {
            if (mask & (1 << b)) {
                sos[mask] += sos[mask ^ (1 << b)];
            } else {
                sup[mask] += sup[mask ^ (1 << b)];
            }
        }
    }

    int all_ones = full - 1;
    // Print (1) submasks of a[i], (2) supermasks of a[i], (3) disjoint (a[i] & x == 0)
    for (int i = 0; i < n; i++) {
        int x = a[i];
        int comp = all_ones ^ x;
        cout << sos[x] << " " << sup[x] << " " << sos[comp] << "\\n";
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

    let bits = 20usize;
    let full = 1usize << bits;
    let mut a = Vec::with_capacity(n);
    let mut sos = vec![0i64; full];
    let mut sup = vec![0i64; full];

    for _ in 0..n {
        let x: usize = it.next().unwrap().parse().unwrap();
        a.push(x);
        sos[x] += 1;
        sup[x] += 1;
    }

    for b in 0..bits {
        let bit = 1usize << b;
        for mask in 0..full {
            if (mask & bit) != 0 {
                sos[mask] += sos[mask ^ bit];
            } else {
                sup[mask] += sup[mask ^ bit];
            }
        }
    }

    let all_ones = full - 1;
    let mut out = String::new();
    for x in a {
        let comp = all_ones ^ x;
        out.push_str(&format!("{} {} {}\\n", sos[x], sup[x], sos[comp]));
    }
    print!("{}", out);
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
        int nextInt() throws IOException {
            int c = readByte();
            while (c >= 0 && c <= ' ') c = readByte();
            if (c == -1) return Integer.MIN_VALUE;
            int res = 0;
            while (c > ' ') { res = res * 10 + (c - '0'); c = readByte(); }
            return res;
        }
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        int n = fs.nextInt();
        if (n == Integer.MIN_VALUE) return;

        final int bits = 20;
        final int full = 1 << bits;
        int[] a = new int[n];
        long[] sos = new long[full];
        long[] sup = new long[full];

        for (int i = 0; i < n; i++) {
            a[i] = fs.nextInt();
            sos[a[i]]++;
            sup[a[i]]++;
        }

        for (int b = 0; b < bits; b++) {
            int bit = 1 << b;
            for (int mask = 0; mask < full; mask++) {
                if ((mask & bit) != 0) {
                    sos[mask] += sos[mask ^ bit];
                } else {
                    sup[mask] += sup[mask ^ bit];
                }
            }
        }

        int allOnes = full - 1;
        StringBuilder sb = new StringBuilder();
        for (int x : a) {
            sb.append(sos[x]).append(' ')
              .append(sup[x]).append(' ')
              .append(sos[allOnes ^ x]).append('\\n');
        }
        System.out.print(sb);
    }
}`,
    python3: `import sys

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    a = [int(data[i + 1]) for i in range(n)]

    bits = 20
    full = 1 << bits
    sos = [0] * full
    sup = [0] * full
    for x in a:
        sos[x] += 1
        sup[x] += 1

    for b in range(bits):
        step = 1 << b
        for mask in range(full):
            if mask & step:
                sos[mask] += sos[mask ^ step]
            else:
                sup[mask] += sup[mask ^ step]

    all_ones = full - 1
    out = [f"{sos[x]} {sup[x]} {sos[all_ones ^ x]}" for x in a]
    sys.stdout.write("\\n".join(out) + "\\n")

if __name__ == "__main__":
    solve()`,
    ruby: `tokens = $stdin.read.split
exit if tokens.empty?
n = tokens[0].to_i
a = Array.new(n) { |i| tokens[i + 1].to_i }

bits = 20
full = 1 << bits
sos = Array.new(full, 0)
sup = Array.new(full, 0)
a.each do |x|
  sos[x] += 1
  sup[x] += 1
end

bits.times do |b|
  bit = 1 << b
  full.times do |mask|
    if (mask & bit) != 0
      sos[mask] += sos[mask ^ bit]
    else
      sup[mask] += sup[mask ^ bit]
    end
  end
end

all_ones = full - 1
out = a.map { |x| "#{sos[x]} #{sup[x]} #{sos[all_ones ^ x]}" }
puts out.join("\\n")`,
  },
  practiceProblems: [
    {
      id: 'ch29-p1',
      tier: 'Warmup',
      ratingRange: '1750–1950',
      title: 'Travelling Salesperson Problem (TSP) Shortest Hamiltonian Tour',
      statement:
        'Given N cities (0..N-1) and an N x N matrix of directed travel costs w[u][v], find the minimum-cost Hamiltonian cycle that starts at city 0, visits every other city exactly once, and returns to city 0.',
      constraints: '2 <= N <= 18, 0 <= w[u][v] <= 10^6',
      sampleInput: '4\n0 10 15 20\n10 0 35 25\n15 35 0 30\n20 25 30 0',
      sampleOutput: '80',
      hints: [
        'Define `dp[mask][u]` = minimum cost to start at city `0`, visit the exact set `mask` of cities, and currently stand at city `u`. Base case: `dp[1][0] = 0`.',
        'For each `mask` containing city `0` and current endpoint `u`, transition to any unvisited `v` (`!(mask & (1 << v))`) with cost `+ w[u][v]`. Final answer: `min_u (dp[(1 << N) - 1][u] + w[u][0])`.',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    if (!(cin >> n)) return 0;
    vector<vector<long long>> w(n, vector<long long>(n));
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) cin >> w[i][j];
    }

    const long long INF = 4e18;
    int full = 1 << n;
    vector<vector<long long>> dp(full, vector<long long>(n, INF));
    dp[1][0] = 0;

    for (int mask = 1; mask < full; mask += 2) { // City 0 must be visited
        for (int u = 0; u < n; u++) {
            if (dp[mask][u] >= INF) continue;
            for (int v = 0; v < n; v++) {
                if (!(mask & (1 << v))) {
                    int nmask = mask | (1 << v);
                    dp[nmask][v] = min(dp[nmask][v], dp[mask][u] + w[u][v]);
                }
            }
        }
    }

    long long ans = INF;
    for (int u = 1; u < n; u++) {
        ans = min(ans, dp[full - 1][u] + w[u][0]);
    }
    cout << ans << "\\n";
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
    let mut w = vec![vec![0i64; n]; n];
    for i in 0..n {
        for j in 0..n {
            w[i][j] = it.next().unwrap().parse().unwrap();
        }
    }

    let inf = 4_000_000_000_000_000_000i64;
    let full = 1usize << n;
    let mut dp = vec![inf; full * n];
    dp[1 * n + 0] = 0;

    for mask in (1..full).step_by(2) {
        for u in 0..n {
            let cur = dp[mask * n + u];
            if cur >= inf {
                continue;
            }
            for v in 0..n {
                if (mask & (1 << v)) == 0 {
                    let nmask = mask | (1 << v);
                    let cand = cur + w[u][v];
                    if cand < dp[nmask * n + v] {
                        dp[nmask * n + v] = cand;
                    }
                }
            }
        }
    }

    let mut ans = inf;
    for u in 1..n {
        let cand = dp[(full - 1) * n + u] + w[u][0];
        if cand < ans {
            ans = cand;
        }
    }
    println!("{}", ans);
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

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        long first = fs.nextLong();
        if (first == Long.MIN_VALUE) return;
        int n = (int) first;
        long[][] w = new long[n][n];
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) w[i][j] = fs.nextLong();
        }

        final long INF = Long.MAX_VALUE / 4;
        int full = 1 << n;
        long[][] dp = new long[full][n];
        for (long[] row : dp) Arrays.fill(row, INF);
        dp[1][0] = 0;

        for (int mask = 1; mask < full; mask += 2) {
            for (int u = 0; u < n; u++) {
                long cur = dp[mask][u];
                if (cur >= INF) continue;
                for (int v = 0; v < n; v++) {
                    if ((mask & (1 << v)) == 0) {
                        int nm = mask | (1 << v);
                        if (cur + w[u][v] < dp[nm][v]) dp[nm][v] = cur + w[u][v];
                    }
                }
            }
        }

        long ans = INF;
        for (int u = 1; u < n; u++) ans = Math.min(ans, dp[full - 1][u] + w[u][0]);
        System.out.println(ans);
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
    w = [[int(next(it)) for _ in range(n)] for _ in range(n)]

    INF = 10**18
    full = 1 << n
    dp = [[INF] * n for _ in range(full)]
    dp[1][0] = 0

    for mask in range(1, full, 2):
        row = dp[mask]
        for u in range(n):
            cur = row[u]
            if cur >= INF:
                continue
            wu = w[u]
            for v in range(n):
                if not (mask & (1 << v)):
                    nm = mask | (1 << v)
                    cand = cur + wu[v]
                    if cand < dp[nm][v]:
                        dp[nm][v] = cand

    ans = min(dp[full - 1][u] + w[u][0] for u in range(1, n))
    print(ans)

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
idx = 0
n = tokens[idx].to_i
idx += 1
w = Array.new(n) do
  Array.new(n) do
    v = tokens[idx].to_i
    idx += 1
    v
  end
end

inf = 10**18
full = 1 << n
dp = Array.new(full) { Array.new(n, inf) }
dp[1][0] = 0

mask = 1
while mask < full
  n.times do |u|
    cur = dp[mask][u]
    next if cur >= inf
    n.times do |v|
      if (mask & (1 << v)) == 0
        nm = mask | (1 << v)
        cand = cur + w[u][v]
        dp[nm][v] = cand if cand < dp[nm][v]
      end
    end
  end
  mask += 2
end

ans = (1...n).map { |u| dp[full - 1][u] + w[u][0] }.min
puts ans`,
      },
    },
    {
      id: 'ch29-p2',
      tier: 'Standard',
      ratingRange: '1900–2100',
      title: 'Compatible Bipartite Matching Counting in O(N 2^N)',
      statement:
        'There are N men and N women (N <= 21). An N x N binary matrix A[i][j] equals 1 if man i is compatible with woman j. Count the number of valid perfect matchings pairing all N men and women modulo 10^9 + 7.',
      constraints: '1 <= N <= 21',
      sampleInput: '3\n0 1 1\n1 0 1\n1 1 1',
      sampleOutput: '3',
      hints: [
        'Instead of tracking BOTH `man_mask` and `woman_mask` (which would be `4^N`), assign men strictly in order `0, 1, ..., N-1`! For any `mask` of assigned women, the next man to pair is automatically `i = popcount(mask)`!',
        'Thus `dp[mask]` only needs `2^N` states, and for each `mask` you only transition to compatible women `j` not yet in `mask`: `O(N * 2^N)`.',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    if (!(cin >> n)) return 0;
    vector<vector<int>> ok(n, vector<int>(n));
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) cin >> ok[i][j];
    }

    const int MOD = 1000000007;
    int full = 1 << n;
    vector<int> dp(full, 0);
    dp[0] = 1;

    for (int mask = 0; mask < full - 1; mask++) {
        if (dp[mask] == 0) continue;
        int i = __builtin_popcount(mask);
        for (int j = 0; j < n; j++) {
            if (ok[i][j] && !(mask & (1 << j))) {
                int nm = mask | (1 << j);
                dp[nm] += dp[mask];
                if (dp[nm] >= MOD) dp[nm] -= MOD;
            }
        }
    }

    cout << dp[full - 1] << "\\n";
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

    let mut ok_mask = vec![0usize; n];
    for i in 0..n {
        for j in 0..n {
            let v: usize = it.next().unwrap().parse().unwrap();
            if v == 1 {
                ok_mask[i] |= 1 << j;
            }
        }
    }

    const MOD: u32 = 1_000_000_007;
    let full = 1usize << n;
    let mut dp = vec![0u32; full];
    dp[0] = 1;

    for mask in 0..(full - 1) {
        let cur = dp[mask];
        if cur == 0 {
            continue;
        }
        let i = mask.count_ones() as usize;
        let mut avail = ok_mask[i] & !mask;
        while avail != 0 {
            let lsb = avail & avail.wrapping_neg();
            let nm = mask | lsb;
            dp[nm] += cur;
            if dp[nm] >= MOD {
                dp[nm] -= MOD;
            }
            avail ^= lsb;
        }
    }

    println!("{}", dp[full - 1]);
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
        int nextInt() throws IOException {
            int c = readByte();
            while (c >= 0 && c <= ' ') c = readByte();
            if (c == -1) return Integer.MIN_VALUE;
            int res = 0;
            while (c > ' ') { res = res * 10 + (c - '0'); c = readByte(); }
            return res;
        }
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        int n = fs.nextInt();
        if (n == Integer.MIN_VALUE) return;

        int[] compat = new int[n];
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (fs.nextInt() == 1) compat[i] |= (1 << j);
            }
        }

        final int MOD = 1_000_000_007;
        int full = 1 << n;
        int[] dp = new int[full];
        dp[0] = 1;

        for (int mask = 0; mask < full - 1; mask++) {
            int cur = dp[mask];
            if (cur == 0) continue;
            int i = Integer.bitCount(mask);
            int avail = compat[i] & ~mask;
            while (avail != 0) {
                int lsb = avail & -avail;
                int nm = mask | lsb;
                int sum = dp[nm] + cur;
                dp[nm] = sum >= MOD ? sum - MOD : sum;
                avail ^= lsb;
            }
        }
        System.out.println(dp[full - 1]);
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
    compat = [0] * n
    for i in range(n):
        m = 0
        for j in range(n):
            if int(next(it)) == 1:
                m |= 1 << j
        compat[i] = m

    MOD = 1_000_000_007
    full = 1 << n
    dp = [0] * full
    dp[0] = 1

    # Group masks by popcount so Python loop avoids calling bit_count on zeros
    by_bits = [[] for _ in range(n)]
    for mask in range(full - 1):
        by_bits[mask.bit_count()].append(mask)

    for i in range(n):
        c_mask = compat[i]
        for mask in by_bits[i]:
            cur = dp[mask]
            if cur == 0:
                continue
            avail = c_mask & ~mask
            while avail:
                lsb = avail & -avail
                nm = mask | lsb
                dp[nm] = (dp[nm] + cur) % MOD
                avail ^= lsb

    print(dp[full - 1])

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
idx = 0
n = tokens[idx].to_i
idx += 1

compat = Array.new(n, 0)
n.times do |i|
  m = 0
  n.times do |j|
    m |= (1 << j) if tokens[idx].to_i == 1
    idx += 1
  end
  compat[i] = m
end

mod = 1_000_000_007
full = 1 << n
dp = Array.new(full, 0)
dp[0] = 1

pop = Array.new(full, 0)
(1...full).each { |m| pop[m] = pop[m >> 1] + (m & 1) }

(0...(full - 1)).each do |mask|
  cur = dp[mask]
  next if cur == 0
  i = pop[mask]
  avail = compat[i] & ~mask
  while avail != 0
    lsb = avail & -avail
    nm = mask | lsb
    val = dp[nm] + cur
    dp[nm] = val >= mod ? val - mod : val
    avail ^= lsb
  end
end

puts dp[full - 1]`,
      },
    },
    {
      id: 'ch29-p3',
      tier: 'Boss',
      ratingRange: '2050–2300',
      title: 'Subsets With Bitwise AND == 0 via SOS Superset Zeta & Mobius Inversion',
      statement:
        'Given an array of N integers (1 <= N <= 10^6, 0 <= A[i] <= 10^6), count the number of non-empty subsequences whose total bitwise AND equals 0 modulo 10^9 + 7.',
      constraints: '1 <= N <= 10^6, 0 <= A[i] <= 10^6 (20 bits)',
      sampleInput: '4\n2 3 4 7',
      sampleOutput: '8',
      hints: [
        'For each mask `m`, let `sup[m]` = number of array elements `A[i]` such that `(A[i] & m) == m` (i.e. `m` is a submask of `A[i]`, or `A[i]` is a superset of `m`). Compute `sup[m]` in `O(B 2^B)` with SOS Superset Zeta Transform!',
        'Then the number of non-empty subsequences whose bitwise AND is a superset of `m` is `ways[m] = (2^{sup[m]} - 1) mod P`. By Inclusion-Exclusion (or inverse SOS Mobius), `ans = sum_m (-1)^{popcount(m)} * (2^{sup[m]} - 1)`!',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    if (!(cin >> n)) return 0;
    const int BITS = 20;
    const int FULL = 1 << BITS;
    const long long MOD = 1000000007LL;

    vector<int> sup(FULL, 0);
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        sup[x]++;
    }

    // SOS Superset Transform: sup[mask] = count of elements containing mask
    for (int b = 0; b < BITS; b++) {
        for (int mask = 0; mask < FULL; mask++) {
            if (!(mask & (1 << b))) {
                sup[mask] += sup[mask ^ (1 << b)];
            }
        }
    }

    vector<long long> pow2(n + 1, 1);
    for (int i = 1; i <= n; i++) {
        pow2[i] = (pow2[i - 1] * 2) % MOD;
    }

    // Inclusion-Exclusion over all masks for AND == 0
    long long ans = 0;
    for (int mask = 0; mask < FULL; mask++) {
        long long ways = (pow2[sup[mask]] - 1 + MOD) % MOD;
        if (__builtin_popcount(mask) & 1) {
            ans -= ways;
            if (ans < 0) ans += MOD;
        } else {
            ans += ways;
            if (ans >= MOD) ans -= MOD;
        }
    }

    cout << ans << "\\n";
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

    const BITS: usize = 20;
    const FULL: usize = 1 << BITS;
    const MOD: i64 = 1_000_000_007;

    let mut sup = vec![0usize; FULL];
    for _ in 0..n {
        let x: usize = it.next().unwrap().parse().unwrap();
        sup[x] += 1;
    }

    for b in 0..BITS {
        let bit = 1usize << b;
        for mask in 0..FULL {
            if (mask & bit) == 0 {
                sup[mask] += sup[mask ^ bit];
            }
        }
    }

    let mut pow2 = vec![1i64; n + 1];
    for i in 1..=n {
        pow2[i] = (pow2[i - 1] * 2) % MOD;
    }

    let mut ans = 0i64;
    for mask in 0..FULL {
        let ways = (pow2[sup[mask]] - 1 + MOD) % MOD;
        if (mask.count_ones() & 1) == 1 {
            ans = (ans - ways + MOD) % MOD;
        } else {
            ans = (ans + ways) % MOD;
        }
    }
    println!("{}", ans);
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
        int nextInt() throws IOException {
            int c = readByte();
            while (c >= 0 && c <= ' ') c = readByte();
            if (c == -1) return Integer.MIN_VALUE;
            int res = 0;
            while (c > ' ') { res = res * 10 + (c - '0'); c = readByte(); }
            return res;
        }
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        int n = fs.nextInt();
        if (n == Integer.MIN_VALUE) return;

        final int BITS = 20;
        final int FULL = 1 << BITS;
        final long MOD = 1_000_000_007L;

        int[] sup = new int[FULL];
        for (int i = 0; i < n; i++) sup[fs.nextInt()]++;

        for (int b = 0; b < BITS; b++) {
            int bit = 1 << b;
            for (int mask = 0; mask < FULL; mask++) {
                if ((mask & bit) == 0) sup[mask] += sup[mask ^ bit];
            }
        }

        long[] pow2 = new long[n + 1];
        pow2[0] = 1;
        for (int i = 1; i <= n; i++) pow2[i] = (pow2[i - 1] * 2) % MOD;

        long ans = 0;
        for (int mask = 0; mask < FULL; mask++) {
            long ways = (pow2[sup[mask]] - 1 + MOD) % MOD;
            if ((Integer.bitCount(mask) & 1) == 1) {
                ans -= ways;
                if (ans < 0) ans += MOD;
            } else {
                ans += ways;
                if (ans >= MOD) ans -= MOD;
            }
        }
        System.out.println(ans);
    }
}`,
        python3: `import sys

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    BITS = 20
    FULL = 1 << BITS
    MOD = 1_000_000_007

    sup = [0] * FULL
    for i in range(1, n + 1):
        sup[int(data[i])] += 1

    for b in range(BITS):
        bit = 1 << b
        for mask in range(FULL):
            if not (mask & bit):
                sup[mask] += sup[mask ^ bit]

    pow2 = [1] * (n + 1)
    for i in range(1, n + 1):
        pow2[i] = (pow2[i - 1] * 2) % MOD

    ans = 0
    for mask in range(FULL):
        ways = pow2[sup[mask]] - 1
        if mask.bit_count() & 1:
            ans = (ans - ways) % MOD
        else:
            ans = (ans + ways) % MOD
    print(ans)

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
n = tokens[0].to_i
bits = 20
full = 1 << bits
mod = 1_000_000_007

sup = Array.new(full, 0)
(1..n).each { |i| sup[tokens[i].to_i] += 1 }

bits.times do |b|
  bit = 1 << b
  full.times do |mask|
    sup[mask] += sup[mask ^ bit] if (mask & bit) == 0
  end
end

pow2 = Array.new(n + 1, 1)
(1..n).each { |i| pow2[i] = (pow2[i - 1] * 2) % mod }

pop = Array.new(full, 0)
(1...full).each { |m| pop[m] = pop[m >> 1] + (m & 1) }

ans = 0
full.times do |mask|
  ways = (pow2[sup[mask]] - 1) % mod
  if (pop[mask] & 1) == 1
    ans = (ans - ways) % mod
  else
    ans = (ans + ways) % mod
  end
end
puts ans`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'CSES',
      title: 'SOS Bit Problem',
      difficulty: 'Hard / Bitmask + SOS',
      url: 'https://cses.fi/problemset/task/1654',
      patternNote: 'Direct 3-in-1 subset, superset, and bitwise-disjoint SOS DP queries over 20 bits.',
    },
    {
      platform: 'AtCoder',
      title: 'ABC180 E - Traveling Salesman among Aerial Cities',
      difficulty: '1500–1700',
      url: 'https://atcoder.jp/contests/abc180/tasks/abc180_e',
      patternNote: 'Asymmetric 3D directed TSP solved directly via `dp[mask][u]`.',
    },
    {
      platform: 'Codeforces',
      title: 'Compatible Numbers (CF 165E)',
      difficulty: '2200',
      url: 'https://codeforces.com/problemset/problem/165/E',
      patternNote: 'Canonical SOS DP problem: find an element in the submask of `~a[i]` in `O(B * 2^B)`.',
    },
    {
      platform: 'CodeChef',
      title: 'AND Subsequences / Bitmask Subsets',
      difficulty: 'Div1 Medium',
      url: 'https://www.codechef.com/problems/SUBSPLAY',
      patternNote: 'Superset SOS DP paired with Inclusion-Exclusion for exact bitwise-AND subset counting.',
    },
    {
      platform: 'HackerRank',
      title: 'Xor-sequence / Bitmask DP Matching',
      difficulty: 'Hard',
      url: 'https://www.hackerrank.com/challenges/matching-sets/problem',
      patternNote: 'Apply popcount layer indexing to drop an entire `N` factor from matching DP.',
    },
    {
      platform: 'NeetCode 150',
      title: 'Shortest Path Visiting All Nodes',
      difficulty: 'Hard (LeetCode 847)',
      url: 'https://leetcode.com/problems/shortest-path-visiting-all-nodes/',
      patternNote: 'BFS over `(node, visited_mask)` bitmask states—same state encoding as TSP.',
    },
  ],
  interviewNotes: [
    'Bitmask DP is one of the highest-signal patterns when interview constraints drop to `N <= 16..20` (e.g., TSP, task assignment, partitioning into `K` equal-sum subsets).',
    'Know when to swap `dp[i][mask]` for `dp[mask]` using `popcount(mask)`: it halves memory bugs and often cuts complexity by `O(N)`.',
    'Explain why submask enumeration `for (sub = mask; sub; sub = (sub - 1) & mask)` sums to `O(3^N)` rather than `O(4^N)` using the binomial theorem `(1 + 2)^N`.',
  ],
  projectBlueprint: {
    title: 'Combinatorial Feature Selection & Subspace Evaluator',
    tagline: 'Evaluate predictive synergy across all 2^N feature subsets using SOS DP zeta transforms and bitmask Pareto pruning.',
    stackSummary: 'C++20 / Rust Core Evaluator, Bitmask Feature Indexing, SOS Marginal Variance Aggregator',
    asciiDiagram: `
+-------------------------+      +----------------------------------+
| Raw Feature Matrix X    | ---> | Bitmask Feature Signature (0..2^B)|
+-------------------------+      +----------------------------------+
                                                  |
          +---------------------------------------+
          v
+-----------------------------------+     +-------------------------+
| SOS Zeta Transform O(B * 2^B)     | --> | Optimal k-Feature Mask  |
| Sum Information Gain Across Subs  |     | + Synergy Pruning API   |
+-----------------------------------+     +-------------------------+`,
    milestones: [
      {
        id: 'm1',
        title: '1. Encode Binary Feature Masks & Synergy Scores',
        detail: 'Map up to 20 candidate ML features to single integer masks and record solo + pairwise interaction scores.',
      },
      {
        id: 'm2',
        title: '2. Compute Full Subset Information via SOS DP',
        detail: 'Run the `O(B * 2^B)` Zeta Transform so every candidate feature subset instantly aggregates all sub-interactions.',
      },
      {
        id: 'm3',
        title: '3. Extract Cost-Constrained Optimal Feature Subsets',
        detail: 'Filter masks by `popcount(mask) <= K` and run inverse Mobius diagnostics to flag redundant correlated features.',
      },
    ],
    starterCode: `// Combinatorial Feature Selection & Subspace Evaluator (Runnable C++20 Prototype)
#include <bits/stdc++.h>
using namespace std;

int main() {
    int numFeatures = 4; // e.g., [Age, Income, Tenure, Usage]
    int full = 1 << numFeatures;
    // Marginal interaction gains defined for individual/paired feature masks
    vector<double> gain(full, 0.0);
    gain[1 << 0] = 0.25; // Age
    gain[1 << 1] = 0.40; // Income
    gain[1 << 2] = 0.15; // Tenure
    gain[1 << 3] = 0.30; // Usage
    gain[(1 << 0) | (1 << 1)] = 0.18; // Age + Income synergy
    gain[(1 << 1) | (1 << 3)] = 0.22; // Income + Usage synergy

    vector<double> totalScore = gain;
    for (int b = 0; b < numFeatures; b++) {
        for (int mask = 0; mask < full; mask++) {
            if (mask & (1 << b)) {
                totalScore[mask] += totalScore[mask ^ (1 << b)];
            }
        }
    }

    int maxAllowed = 3;
    int bestMask = 0;
    for (int mask = 0; mask < full; mask++) {
        if (__builtin_popcount(mask) <= maxAllowed && totalScore[mask] > totalScore[bestMask]) {
            bestMask = mask;
        }
    }
    cout << "Best Feature Mask (<= " << maxAllowed << " features): " << bestMask
         << " | Cumulative Synergy Score: " << totalScore[bestMask] << "\\n";
    return 0;
}`,
  },
};
