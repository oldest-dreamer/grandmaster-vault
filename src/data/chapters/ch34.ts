import type { TheoryChapter } from '../../types/vault';

export const CH34_SPARSE_TABLE_RMQ: TheoryChapter = {
  slug: 'sparse-table-rmq',
  topicId: 'ds-05',
  title: 'Sparse Table & Disjoint Sparse Table (O(1) RMQ)',
  domain: 'Data Structures',
  ratingTier: '1400–1600',
  usacoDivision: 'Gold',
  subtitle:
    'Answer static range minimum, maximum, and GCD queries in strict O(1) via overlapping power-of-two blocks—and extend O(1) queries to non-idempotent products or arbitrary monoids using Disjoint Sparse Tables.',
  analogyTitle: 'The Overlapping Ruler & Divide-and-Conquer Midpoint Bridge Analogy',
  analogyBody:
    'Suppose you only own wooden rulers of lengths `1, 2, 4, 8, 16, ...` (`2^k`). If someone asks for the **minimum height** across window `[L, R]` of length `6`, you do NOT need a size-6 ruler! Simply place one size-4 ruler starting at `L` (`[L, L+3]`) and a second size-4 ruler ending at `R` (`[R-3, R]`): the two rulers overlap harmlessly in the middle, and because `min(x, x) = x` and `gcd(x, x) = x` (**idempotence**), combining just TWO precomputed entries answers ANY range query in **two array lookups (`O(1)`)**! What if the operation is **non-idempotent** (like range product modulo `10^9` where overlap double-multiplies and inverses might not exist)? Build a **Disjoint Sparse Table**: at every binary tree midpoint `mid`, precompute suffix products moving left and prefix products moving right—so any query `[L, R]` splits cleanly at the unique level `k` where `L` and `R` straddle `mid`, answering EVEN non-idempotent monoids in `O(1)`!',
  prerequisites: [
    {
      slug: 'prefix-sums-difference-arrays',
      title: '1D/2D Prefix Sums & Difference Arrays',
    },
  ],
  traceTitle: 'Interactive Power-of-Two Sparse Table Build & O(1) Overlapping RMQ Lookup Trace',
  traceSubtitle:
    'Build `st[k][i] = min(A[i .. i + 2^k - 1])` over 8 elements `[7, 2, 5, 1, 9, 4, 3, 6]` and answer `min[1..6]` in `O(1)` using `k = floor(log2(6)) = 2`.',
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Step 1: Base Level k = 0 (Length 2^0 = 1) & Precomputed lg[1..8] Table',
      explanation:
        'Initialize st[0][i] = A[i] for all i in 0..7. Also precompute integer floor(log2(len)): lg = [0, 0, 1, 1, 2, 2, 2, 2, 3].',
      mode: 'array',
      arrays: [
        {
          name: 'st[0] (Intervals of len 1)',
          cells: [
            { index: 0, value: 7, highlight: 'active' },
            { index: 1, value: 2, highlight: 'active' },
            { index: 2, value: 5, highlight: 'active' },
            { index: 3, value: 1, highlight: 'active' },
            { index: 4, value: 9, highlight: 'active' },
            { index: 5, value: 4, highlight: 'active' },
            { index: 6, value: 3, highlight: 'active' },
            { index: 7, value: 6, highlight: 'active' },
          ],
        },
        {
          name: 'lg[1..8]',
          cells: [
            { index: 1, value: 0, highlight: 'neutral' },
            { index: 2, value: 1, highlight: 'neutral' },
            { index: 3, value: 1, highlight: 'neutral' },
            { index: 4, value: 2, highlight: 'window' },
            { index: 5, value: 2, highlight: 'window' },
            { index: 6, value: 2, highlight: 'window' },
            { index: 7, value: 2, highlight: 'window' },
            { index: 8, value: 3, highlight: 'neutral' },
          ],
        },
      ],
      variables: { LevelK: 0, WindowLen: 1, BuildProgress: 'N entries' },
    },
    {
      stepNumber: 2,
      title: 'Step 2: Level k = 1 (Merge Pairs of Length 2^1 = 2)',
      explanation:
        'For i = 0..6: st[1][i] = min(st[0][i], st[0][i + 1]). We get [2, 2, 1, 1, 4, 3, 3] covering every length-2 window in O(N).',
      mode: 'array',
      arrays: [
        {
          name: 'st[0] (len 1)',
          cells: [
            { index: 0, value: 7, highlight: 'window' },
            { index: 1, value: 2, highlight: 'window' },
            { index: 2, value: 5, highlight: 'neutral' },
            { index: 3, value: 1, highlight: 'neutral' },
            { index: 4, value: 9, highlight: 'neutral' },
            { index: 5, value: 4, highlight: 'neutral' },
            { index: 6, value: 3, highlight: 'neutral' },
            { index: 7, value: 6, highlight: 'neutral' },
          ],
        },
        {
          name: 'st[1] (len 2)',
          cells: [
            { index: 0, value: 2, highlight: 'updated' },
            { index: 1, value: 2, highlight: 'updated' },
            { index: 2, value: 1, highlight: 'updated' },
            { index: 3, value: 1, highlight: 'updated' },
            { index: 4, value: 4, highlight: 'updated' },
            { index: 5, value: 3, highlight: 'updated' },
            { index: 6, value: 3, highlight: 'updated' },
          ],
        },
      ],
      variables: { LevelK: 1, WindowLen: 2, Recurrence: 'min(st[0][i], st[0][i+1])' },
    },
    {
      stepNumber: 3,
      title: 'Step 3: Levels k = 2 (Length 4) & k = 3 (Length 8)',
      explanation:
        'st[2][i] = min(st[1][i], st[1][i + 2]): yields [1, 1, 1, 1, 3] for i=0..4! Level k=3 gives st[3][0] = min(st[2][0], st[2][4]) = min(1, 3) = 1.',
      mode: 'array',
      arrays: [
        {
          name: 'st[2] (len 4)',
          cells: [
            { index: 0, value: 1, highlight: 'updated' },
            { index: 1, value: 1, highlight: 'active' },
            { index: 2, value: 1, highlight: 'updated' },
            { index: 3, value: 1, highlight: 'active' },
            { index: 4, value: 3, highlight: 'updated' },
          ],
        },
        {
          name: 'st[3] (len 8)',
          cells: [{ index: 0, value: 1, highlight: 'active' }],
        },
      ],
      variables: { TotalBuildOps: 'O(N log N)', TableEntries: '8 * 4', MaxPower: 3 },
    },
    {
      stepNumber: 4,
      title: 'Step 4: O(1) RMQ Query on [L=1, R=6] Using Overlapping Blocks of Length 4',
      explanation:
        'Length = 6 - 1 + 1 = 6 -> k = lg[6] = 2 (block length 4). Combine left block st[2][1] = min[1..4] = 1 AND right block st[2][6 - 4 + 1] = st[2][3] = min[3..6] = 1 -> min(1, 1) = 1 in strict O(1)!',
      mode: 'array',
      arrays: [
        {
          name: 'A[0..7] Query Window [1..6]',
          cells: [
            { index: 0, value: 7, highlight: 'neutral' },
            { index: 1, value: 2, highlight: 'window' },
            { index: 2, value: 5, highlight: 'window' },
            { index: 3, value: 1, highlight: 'active' },
            { index: 4, value: 9, highlight: 'active' },
            { index: 5, value: 4, highlight: 'window' },
            { index: 6, value: 3, highlight: 'window' },
            { index: 7, value: 6, highlight: 'neutral' },
          ],
        },
        {
          name: 'O(1) Lookup Result',
          cells: [
            { index: 0, value: 'st[2][1]=1', highlight: 'updated' },
            { index: 1, value: 'st[2][3]=1', highlight: 'updated' },
            { index: 2, value: 'min=1', highlight: 'active' },
          ],
        },
      ],
      variables: { Query: '[1, 6]', k: 2, OverlapIndices: '[3, 4]', Answer: 1 },
    },
  ],
  reductionClues: [
    {
      clue: '"Immutable array with up to 10^6 RMQ / Range Max / Range GCD queries and tight TL"',
      translation:
        'Use a **Standard Sparse Table**! `O(N log N)` build + true `O(1)` two-lookup query beats `O(log N)` Segment Trees by ~5x–10x on high-query static benchmarks.',
    },
    {
      clue: '"Compute Euler-Tour O(1) Lowest Common Ancestor (LCA) via RMQ on depth array"',
      translation:
        'Flatten the tree with a `2N - 1` Euler tour recording `(depth, node)` and build a Sparse Table on it—every `lca(u, v)` becomes a single `O(1)` RMQ lookup!',
    },
    {
      clue: '"Find longest subarray with GCD > 1, or count subarrays with a fixed GCD / OR / AND value"',
      translation:
        'A Sparse Table answers `gcd(L, R)` in `O(1)`. Fixing `L`, `gcd(L, R)` is monotonically non-increasing in `R` and changes at most `log2(maxA) <= 30` times—binary search each jump or longest valid `R` in `O(N log N)`!',
    },
    {
      clue: '"Static range queries over a NON-idempotent associative operation (e.g. product mod M, matrix multiply) in O(1)"',
      translation:
        'Standard Sparse Table fails when intervals overlap, and Segment Tree costs `O(log N)` per query. Build a **Disjoint Sparse Table** (`O(N log N)` space/build): compute prefix/suffix aggregates around binary-tree midpoints and answer ANY `[L, R]` in `O(1)` using bit-XOR `31 - clz(L ^ R)`!',
    },
  ],
  timeComplexity: 'Build: O(N log N) | Standard RMQ / Disjoint Sparse Table Query: O(1)',
  spaceComplexity: 'O(N log N)',
  pitfalls: [
    {
      type: 'TLE',
      title: 'Calling std::log2() Inside the O(1) Query Loop',
      detail:
        'Calling floating-point `log2(r - l + 1)` inside `10^6` queries adds slow FPU calls and risks floating-point rounding (`floor(log2(8))` returning `2`!). Precompute `lg[1..N]` with `lg[i] = lg[i >> 1] + 1` or use `31 - __builtin_clz(len)`.',
    },
    {
      type: 'MLE',
      title: 'Indexing st[N][LOG] Instead of st[LOG][N] Ruins Cache Locality & Memory',
      detail:
        'Always store `st[k][i]` (level `k` as the outer dimension, index `i` as the inner contiguous row)! Not only does `st[k][i]` boost CPU cache hit rates 4x during `O(N log N)` build, in Disjoint Sparse Tables it keeps midpoint scans sequential.',
    },
    {
      type: 'WA',
      title: 'Using Overlapping Sparse Table for Range Sum or Product Modulo M',
      detail:
        'Overlapping `[L, L+2^k-1]` and `[R-2^k+1, R]` double-counts the middle intersection! Only **idempotent** operations (`min`, `max`, `gcd`, `bitwise OR`, `bitwise AND`) tolerate overlap; use a **Disjoint Sparse Table** for `sum`, `product`, or `matrix` monoids.',
    },
    {
      type: 'WA',
      title: 'Forgetting L == R Base Case in Disjoint Sparse Table Lookup',
      detail:
        'In a Disjoint Sparse Table, the level is chosen via `bit = highestBit(L ^ R)`. When `L == R`, `L ^ R == 0`, so `clz(0)` is undefined behavior in C++! Always short-circuit `if (L == R) return st[0][L];` first.',
    },
  ],
  implementations: {
    cpp20: `#include <bits/stdc++.h>
using namespace std;

// Static O(1) RMQ Sparse Table with cache-friendly st[k][i] layout
struct SparseTable {
    int n, LOG;
    vector<int> lg;
    vector<vector<long long>> st;

    explicit SparseTable(const vector<long long>& a) : n((int)a.size()) {
        lg.assign(n + 1, 0);
        for (int i = 2; i <= n; i++) lg[i] = lg[i >> 1] + 1;
        LOG = lg[n] + 1;
        st.assign(LOG, vector<long long>(n));
        st[0] = a;
        for (int k = 1; k < LOG; k++) {
            int half = 1 << (k - 1);
            int limit = n - (1 << k) + 1;
            for (int i = 0; i < limit; i++) {
                st[k][i] = min(st[k - 1][i], st[k - 1][i + half]);
            }
        }
    }

    // 0-indexed inclusive range minimum [l, r] in O(1)
    long long query(int l, int r) const {
        int k = lg[r - l + 1];
        return min(st[k][l], st[k][r - (1 << k) + 1]);
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, q;
    if (!(cin >> n >> q)) return 0;
    vector<long long> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];

    SparseTable rmq(a);
    while (q--) {
        int l, r;
        cin >> l >> r; // 1-indexed [l, r]
        cout << rmq.query(l - 1, r - 1) << "\\n";
    }
    return 0;
}`,
    rust: `use std::io::{self, Read};

struct SparseTable {
    lg: Vec<usize>,
    st: Vec<Vec<i64>>,
}

impl SparseTable {
    fn new(a: &[i64]) -> Self {
        let n = a.len();
        let mut lg = vec![0usize; n + 1];
        for i in 2..=n {
            lg[i] = lg[i >> 1] + 1;
        }
        let log_n = lg[n] + 1;
        let mut st = vec![vec![0i64; n]; log_n];
        st[0].copy_from_slice(a);
        for k in 1..log_n {
            let half = 1usize << (k - 1);
            let limit = n + 1 - (1usize << k);
            for i in 0..limit {
                st[k][i] = st[k - 1][i].min(st[k - 1][i + half]);
            }
        }
        Self { lg, st }
    }

    fn query(&self, l: usize, r: usize) -> i64 {
        let k = self.lg[r - l + 1];
        self.st[k][l].min(self.st[k][r + 1 - (1 << k)])
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
    let q: usize = it.next().unwrap().parse().unwrap();
    let mut a = Vec::with_capacity(n);
    for _ in 0..n {
        a.push(it.next().unwrap().parse().unwrap());
    }

    let rmq = SparseTable::new(&a);
    let mut out = String::new();
    for _ in 0..q {
        let l: usize = it.next().unwrap().parse::<usize>().unwrap() - 1;
        let r: usize = it.next().unwrap().parse::<usize>().unwrap() - 1;
        out.push_str(&format!("{}\\n", rmq.query(l, r)));
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
        long nIn = fs.nextLong();
        if (nIn == Long.MIN_VALUE) return;
        int n = (int) nIn;
        int q = (int) fs.nextLong();

        int[] lg = new int[n + 1];
        for (int i = 2; i <= n; i++) lg[i] = lg[i >> 1] + 1;
        int LOG = lg[n] + 1;

        long[][] st = new long[LOG][n];
        for (int i = 0; i < n; i++) st[0][i] = fs.nextLong();

        for (int k = 1; k < LOG; k++) {
            int half = 1 << (k - 1);
            int limit = n - (1 << k) + 1;
            for (int i = 0; i < limit; i++) {
                st[k][i] = Math.min(st[k - 1][i], st[k - 1][i + half]);
            }
        }

        StringBuilder sb = new StringBuilder();
        while (q-- > 0) {
            int l = (int) fs.nextLong() - 1;
            int r = (int) fs.nextLong() - 1;
            int k = lg[r - l + 1];
            long ans = Math.min(st[k][l], st[k][r - (1 << k) + 1]);
            sb.append(ans).append('\\n');
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
    it = iter(data)
    n = int(next(it))
    q = int(next(it))
    a = [int(next(it)) for _ in range(n)]

    lg = [0] * (n + 1)
    for i in range(2, n + 1):
        lg[i] = lg[i >> 1] + 1
    log_n = lg[n] + 1

    st = [a]
    for k in range(1, log_n):
        prev = st[k - 1]
        half = 1 << (k - 1)
        limit = n - (1 << k) + 1
        st.append([prev[i] if prev[i] < prev[i + half] else prev[i + half] for i in range(limit)])

    out = []
    for _ in range(q):
        l = int(next(it)) - 1
        r = int(next(it)) - 1
        k = lg[r - l + 1]
        row = st[k]
        v1 = row[l]
        v2 = row[r - (1 << k) + 1]
        out.append(str(v1 if v1 < v2 else v2))
    sys.stdout.write("\\n".join(out) + "\\n")

if __name__ == "__main__":
    solve()`,
    ruby: `tokens = $stdin.read.split
exit if tokens.empty?
idx = 0
n = tokens[idx].to_i
q = tokens[idx + 1].to_i
idx += 2

a = Array.new(n) { |i| tokens[idx + i].to_i }
idx += n

lg = Array.new(n + 1, 0)
(2..n).each { |i| lg[i] = lg[i >> 1] + 1 }
log_n = lg[n] + 1

st = [a]
(1...log_n).each do |k|
  prev = st[k - 1]
  half = 1 << (k - 1)
  limit = n - (1 << k) + 1
  st << Array.new(limit) { |i| prev[i] < prev[i + half] ? prev[i] : prev[i + half] }
end

out = []
q.times do
  l = tokens[idx].to_i - 1
  r = tokens[idx + 1].to_i - 1
  idx += 2
  k = lg[r - l + 1]
  row = st[k]
  v1 = row[l]
  v2 = row[r - (1 << k) + 1]
  out << (v1 < v2 ? v1 : v2)
end
puts out.join("\\n")`,
  },
  practiceProblems: [
    {
      id: 'ch34-p1',
      tier: 'Warmup',
      ratingRange: '1300–1450',
      title: 'Static Range Minimum Queries in O(1)',
      statement:
        'Given an immutable array of N integers (1..N) and Q queries [a, b], output the minimum value in subarray A[a..b] for every query in O(1) query time.',
      constraints: '1 <= N, Q <= 2 * 10^5, 1 <= A[i] <= 10^9',
      sampleInput: '8 4\n3 2 4 5 1 1 5 3\n2 4\n5 6\n1 8\n3 3',
      sampleOutput: '2\n1\n1\n4',
      hints: [
        'Precompute `lg[i] = lg[i >> 1] + 1` and build `st[k][i] = min(st[k-1][i], st[k-1][i + (1<<(k-1))])` for `k = 1..lg[N]`.',
        'Answer `[a, b]` (0-indexed `[l, r]`) via `k = lg[r - l + 1]` and `min(st[k][l], st[k][r - (1 << k) + 1])`.',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, q;
    if (!(cin >> n >> q)) return 0;
    vector<int> lg(n + 1, 0);
    for (int i = 2; i <= n; i++) lg[i] = lg[i >> 1] + 1;

    int LOG = lg[n] + 1;
    vector<vector<int>> st(LOG, vector<int>(n));
    for (int i = 0; i < n; i++) cin >> st[0][i];

    for (int k = 1; k < LOG; k++) {
        int half = 1 << (k - 1);
        int limit = n - (1 << k) + 1;
        for (int i = 0; i < limit; i++) {
            st[k][i] = min(st[k - 1][i], st[k - 1][i + half]);
        }
    }

    while (q--) {
        int a, b;
        cin >> a >> b;
        int l = a - 1, r = b - 1;
        int k = lg[r - l + 1];
        cout << min(st[k][l], st[k][r - (1 << k) + 1]) << "\\n";
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
    let q: usize = it.next().unwrap().parse().unwrap();

    let mut lg = vec![0usize; n + 1];
    for i in 2..=n {
        lg[i] = lg[i >> 1] + 1;
    }
    let log_n = lg[n] + 1;
    let mut st = vec![vec![0i32; n]; log_n];
    for i in 0..n {
        st[0][i] = it.next().unwrap().parse().unwrap();
    }
    for k in 1..log_n {
        let half = 1usize << (k - 1);
        let limit = n + 1 - (1usize << k);
        for i in 0..limit {
            st[k][i] = st[k - 1][i].min(st[k - 1][i + half]);
        }
    }

    let mut out = String::new();
    for _ in 0..q {
        let l: usize = it.next().unwrap().parse::<usize>().unwrap() - 1;
        let r: usize = it.next().unwrap().parse::<usize>().unwrap() - 1;
        let k = lg[r - l + 1];
        out.push_str(&format!("{}\\n", st[k][l].min(st[k][r + 1 - (1 << k)])));
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
        int q = fs.nextInt();

        int[] lg = new int[n + 1];
        for (int i = 2; i <= n; i++) lg[i] = lg[i >> 1] + 1;
        int LOG = lg[n] + 1;

        int[][] st = new int[LOG][n];
        for (int i = 0; i < n; i++) st[0][i] = fs.nextInt();
        for (int k = 1; k < LOG; k++) {
            int half = 1 << (k - 1);
            int limit = n - (1 << k) + 1;
            for (int i = 0; i < limit; i++) {
                st[k][i] = Math.min(st[k - 1][i], st[k - 1][i + half]);
            }
        }

        StringBuilder sb = new StringBuilder();
        while (q-- > 0) {
            int l = fs.nextInt() - 1;
            int r = fs.nextInt() - 1;
            int k = lg[r - l + 1];
            sb.append(Math.min(st[k][l], st[k][r - (1 << k) + 1])).append('\\n');
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
    it = iter(data)
    n = int(next(it))
    q = int(next(it))
    a = [int(next(it)) for _ in range(n)]

    lg = [0] * (n + 1)
    for i in range(2, n + 1):
        lg[i] = lg[i >> 1] + 1
    log_n = lg[n] + 1

    st = [a]
    for k in range(1, log_n):
        prev = st[k - 1]
        half = 1 << (k - 1)
        limit = n - (1 << k) + 1
        st.append([prev[i] if prev[i] < prev[i + half] else prev[i + half] for i in range(limit)])

    out = []
    for _ in range(q):
        l = int(next(it)) - 1
        r = int(next(it)) - 1
        k = lg[r - l + 1]
        row = st[k]
        v1, v2 = row[l], row[r - (1 << k) + 1]
        out.append(str(v1 if v1 < v2 else v2))
    sys.stdout.write("\\n".join(out) + "\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
idx = 0
n = tokens[idx].to_i
q = tokens[idx + 1].to_i
idx += 2
a = Array.new(n) { |i| tokens[idx + i].to_i }
idx += n

lg = Array.new(n + 1, 0)
(2..n).each { |i| lg[i] = lg[i >> 1] + 1 }
log_n = lg[n] + 1

st = [a]
(1...log_n).each do |k|
  prev = st[k - 1]
  half = 1 << (k - 1)
  limit = n - (1 << k) + 1
  st << Array.new(limit) { |i| prev[i] < prev[i + half] ? prev[i] : prev[i + half] }
end

out = []
q.times do
  l = tokens[idx].to_i - 1
  r = tokens[idx + 1].to_i - 1
  idx += 2
  k = lg[r - l + 1]
  row = st[k]
  v1 = row[l]
  v2 = row[r - (1 << k) + 1]
  out << (v1 < v2 ? v1 : v2)
end
puts out.join("\\n")`,
      },
    },
    {
      id: 'ch34-p2',
      tier: 'Standard',
      ratingRange: '1500–1700',
      title: 'Longest Subarray With GCD > 1 (Sparse Table + Binary Search)',
      statement:
        'Given an array A of N positive integers (1 <= N <= 2 * 10^5), find the maximum length of a contiguous subarray A[L..R] whose greatest common divisor gcd(A[L], ..., A[R]) is strictly greater than 1 (output 0 if every element is 1).',
      constraints: '1 <= N <= 2 * 10^5, 1 <= A[i] <= 10^9',
      sampleInput: '6\n3 6 12 5 10 15',
      sampleOutput: '3',
      hints: [
        'Build a GCD Sparse Table (`st[k][i] = gcd(st[k-1][i], st[k-1][i + 2^(k-1)])`) so any subarray `gcd(L, R)` takes `O(1)`.',
        'For each left endpoint `L` (or binary search on subarray length `len`!), check whether `gcd(L, R) > 1` monotonically as `R` grows (`gcd` only shrinks or stays constant!). Binary search the farthest `R >= L` with `gcd(L, R) > 1` in `O(log N)` using `O(1)` queries!',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    if (!(cin >> n)) return 0;
    vector<int> lg(n + 1, 0);
    for (int i = 2; i <= n; i++) lg[i] = lg[i >> 1] + 1;

    int LOG = lg[n] + 1;
    vector<vector<int>> st(LOG, vector<int>(n));
    for (int i = 0; i < n; i++) cin >> st[0][i];

    for (int k = 1; k < LOG; k++) {
        int half = 1 << (k - 1);
        int limit = n - (1 << k) + 1;
        for (int i = 0; i < limit; i++) {
            st[k][i] = std::gcd(st[k - 1][i], st[k - 1][i + half]);
        }
    }

    auto query_gcd = [&](int l, int r) {
        int k = lg[r - l + 1];
        return std::gcd(st[k][l], st[k][r - (1 << k) + 1]);
    };

    int best = 0;
    for (int i = 0; i < n; i++) {
        if (st[0][i] <= 1) continue;
        int lo = i, hi = n - 1, far = i;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (query_gcd(i, mid) > 1) {
                far = mid;
                lo = mid + 1;
            } else {
                hi = mid - 1;
            }
        }
        best = max(best, far - i + 1);
    }

    cout << best << "\\n";
    return 0;
}`,
        rust: `use std::io::{self, Read};

fn gcd(mut a: i32, mut b: i32) -> i32 {
    while b != 0 {
        let r = a % b;
        a = b;
        b = r;
    }
    a
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let n: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };

    let mut lg = vec![0usize; n + 1];
    for i in 2..=n {
        lg[i] = lg[i >> 1] + 1;
    }
    let log_n = lg[n] + 1;
    let mut st = vec![vec![0i32; n]; log_n];
    for i in 0..n {
        st[0][i] = it.next().unwrap().parse().unwrap();
    }
    for k in 1..log_n {
        let half = 1usize << (k - 1);
        let limit = n + 1 - (1usize << k);
        for i in 0..limit {
            st[k][i] = gcd(st[k - 1][i], st[k - 1][i + half]);
        }
    }

    let query_gcd = |l: usize, r: usize| -> i32 {
        let k = lg[r - l + 1];
        gcd(st[k][l], st[k][r + 1 - (1 << k)])
    };

    let mut best = 0usize;
    for i in 0..n {
        if st[0][i] <= 1 {
            continue;
        }
        let (mut lo, mut hi, mut far) = (i, n - 1, i);
        while lo <= hi {
            let mid = lo + (hi - lo) / 2;
            if query_gcd(i, mid) > 1 {
                far = mid;
                lo = mid + 1;
            } else {
                if mid == 0 {
                    break;
                }
                hi = mid - 1;
            }
        }
        best = best.max(far - i + 1);
    }
    println!("{}", best);
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

    static int gcd(int a, int b) {
        while (b != 0) { int r = a % b; a = b; b = r; }
        return a;
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        int n = fs.nextInt();
        if (n == Integer.MIN_VALUE) return;

        int[] lg = new int[n + 1];
        for (int i = 2; i <= n; i++) lg[i] = lg[i >> 1] + 1;
        int LOG = lg[n] + 1;
        int[][] st = new int[LOG][n];
        for (int i = 0; i < n; i++) st[0][i] = fs.nextInt();

        for (int k = 1; k < LOG; k++) {
            int half = 1 << (k - 1);
            int limit = n - (1 << k) + 1;
            for (int i = 0; i < limit; i++) {
                st[k][i] = gcd(st[k - 1][i], st[k - 1][i + half]);
            }
        }

        int best = 0;
        for (int i = 0; i < n; i++) {
            if (st[0][i] <= 1) continue;
            int lo = i, hi = n - 1, far = i;
            while (lo <= hi) {
                int mid = (lo + hi) >>> 1;
                int k = lg[mid - i + 1];
                if (gcd(st[k][i], st[k][mid - (1 << k) + 1]) > 1) {
                    far = mid;
                    lo = mid + 1;
                } else {
                    hi = mid - 1;
                }
            }
            best = Math.max(best, far - i + 1);
        }
        System.out.println(best);
    }
}`,
        python3: `import math
import sys

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    a = [int(data[i + 1]) for i in range(n)]

    lg = [0] * (n + 1)
    for i in range(2, n + 1):
        lg[i] = lg[i >> 1] + 1
    log_n = lg[n] + 1

    st = [a]
    for k in range(1, log_n):
        prev = st[k - 1]
        half = 1 << (k - 1)
        limit = n - (1 << k) + 1
        st.append([math.gcd(prev[i], prev[i + half]) for i in range(limit)])

    best = 0
    for i in range(n):
        if a[i] <= 1:
            continue
        lo, hi, far = i, n - 1, i
        while lo <= hi:
            mid = (lo + hi) >> 1
            k = lg[mid - i + 1]
            row = st[k]
            if math.gcd(row[i], row[mid - (1 << k) + 1]) > 1:
                far = mid
                lo = mid + 1
            else:
                hi = mid - 1
        if far - i + 1 > best:
            best = far - i + 1
    print(best)

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
n = tokens[0].to_i
a = Array.new(n) { |i| tokens[i + 1].to_i }

lg = Array.new(n + 1, 0)
(2..n).each { |i| lg[i] = lg[i >> 1] + 1 }
log_n = lg[n] + 1

st = [a]
(1...log_n).each do |k|
  prev = st[k - 1]
  half = 1 << (k - 1)
  limit = n - (1 << k) + 1
  st << Array.new(limit) { |i| prev[i].gcd(prev[i + half]) }
end

best = 0
n.times do |i|
  next if a[i] <= 1
  lo = i
  hi = n - 1
  far = i
  while lo <= hi
    mid = (lo + hi) >> 1
    k = lg[mid - i + 1]
    row = st[k]
    if row[i].gcd(row[mid - (1 << k) + 1]) > 1
      far = mid
      lo = mid + 1
    else
      hi = mid - 1
    end
  end
  len = far - i + 1
  best = len if len > best
end
puts best`,
      },
    },
    {
      id: 'ch34-p3',
      tier: 'Boss',
      ratingRange: '1900–2150',
      title: 'Disjoint Sparse Table for Non-Idempotent O(1) Range Product Mod P',
      statement:
        'Given an immutable array A[0..N-1], an arbitrary composite integer modulus P (1 <= P <= 10^9), and Q static range queries [L, R] (0-indexed), compute (A[L] * A[L+1] * ... * A[R]) mod P in strict O(1) per query without modular inverses.',
      constraints: '1 <= N <= 2 * 10^5, 1 <= Q <= 5 * 10^5, 1 <= P <= 10^9 (P may be non-prime)',
      sampleInput: '5 100 3\n2 3 5 7 11\n0 4\n1 3\n2 2',
      sampleOutput: '10\n5\n5',
      hints: [
        'Pad array length `N` up to the next power of two `S = 2^B` with multiplicative identity `1 % P`. Build table `dst[level][i]` for `level = 0..B-1`.',
        'For block size `len = 2^(level + 1)` and each block midpoint `mid = start + len/2`: fill **suffix products** `dst[level][mid - 1 .. start]` moving left, and **prefix products** `dst[level][mid .. start + len - 1]` moving right! Then any query `[L, R]` with `L < R` belongs to the unique level `k = highestBitIndex(L ^ R)` where `L` is left of `mid` and `R` is right of `mid`: answer is simply `(dst[k][L] * dst[k][R]) % P`!',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, q;
    long long P;
    if (!(cin >> n >> P >> q)) return 0;

    int B = 1;
    while ((1 << B) < max(2, n)) B++;
    int S = 1 << B;
    vector<long long> a(S, 1 % P);
    for (int i = 0; i < n; i++) {
        cin >> a[i];
        a[i] %= P;
    }

    // Disjoint Sparse Table: dst[level][i] holds suffix (left of mid) / prefix (right of mid)
    vector<vector<long long>> dst(B, vector<long long>(S, 1 % P));
    for (int lvl = 0; lvl < B; lvl++) {
        int half = 1 << lvl;
        int full = half << 1;
        for (int start = 0; start < S; start += full) {
            int mid = start + half;
            dst[lvl][mid - 1] = a[mid - 1];
            for (int i = mid - 2; i >= start; i--) {
                dst[lvl][i] = (dst[lvl][i + 1] * a[i]) % P;
            }
            dst[lvl][mid] = a[mid];
            for (int i = mid + 1; i < start + full; i++) {
                dst[lvl][i] = (dst[lvl][i - 1] * a[i]) % P;
            }
        }
    }

    while (q--) {
        int l, r;
        cin >> l >> r;
        if (l == r) {
            cout << a[l] << "\\n";
        } else {
            int lvl = 31 - __builtin_clz(l ^ r);
            cout << (dst[lvl][l] * dst[lvl][r]) % P << "\\n";
        }
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
    let p: i64 = it.next().unwrap().parse().unwrap();
    let q: usize = it.next().unwrap().parse().unwrap();

    let mut b = 1usize;
    while (1usize << b) < n.max(2) {
        b += 1;
    }
    let s = 1usize << b;
    let mut a = vec![1i64 % p; s];
    for i in 0..n {
        a[i] = it.next().unwrap().parse::<i64>().unwrap() % p;
    }

    let mut dst = vec![vec![1i64 % p; s]; b];
    for lvl in 0..b {
        let half = 1usize << lvl;
        let full = half << 1;
        let mut start = 0usize;
        while start < s {
            let mid = start + half;
            dst[lvl][mid - 1] = a[mid - 1];
            for i in (start..mid - 1).rev() {
                dst[lvl][i] = (dst[lvl][i + 1] * a[i]) % p;
            }
            dst[lvl][mid] = a[mid];
            for i in (mid + 1)..(start + full) {
                dst[lvl][i] = (dst[lvl][i - 1] * a[i]) % p;
            }
            start += full;
        }
    }

    let mut out = String::new();
    for _ in 0..q {
        let l: usize = it.next().unwrap().parse().unwrap();
        let r: usize = it.next().unwrap().parse().unwrap();
        if l == r {
            out.push_str(&format!("{}\\n", a[l]));
        } else {
            let lvl = (usize::BITS - 1 - (l ^ r).leading_zeros()) as usize;
            out.push_str(&format!("{}\\n", (dst[lvl][l] * dst[lvl][r]) % p));
        }
    }
    print!("{}", out);
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

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        long nIn = fs.nextLong();
        if (nIn == Long.MIN_VALUE) return;
        int n = (int) nIn;
        long P = fs.nextLong();
        int q = (int) fs.nextLong();

        int B = 1;
        while ((1 << B) < Math.max(2, n)) B++;
        int S = 1 << B;
        long[] a = new long[S];
        Arrays.fill(a, 1 % P);
        for (int i = 0; i < n; i++) a[i] = fs.nextLong() % P;

        long[][] dst = new long[B][S];
        for (int lvl = 0; lvl < B; lvl++) {
            int half = 1 << lvl;
            int full = half << 1;
            for (int start = 0; start < S; start += full) {
                int mid = start + half;
                dst[lvl][mid - 1] = a[mid - 1];
                for (int i = mid - 2; i >= start; i--) {
                    dst[lvl][i] = (dst[lvl][i + 1] * a[i]) % P;
                }
                dst[lvl][mid] = a[mid];
                for (int i = mid + 1; i < start + full; i++) {
                    dst[lvl][i] = (dst[lvl][i - 1] * a[i]) % P;
                }
            }
        }

        StringBuilder sb = new StringBuilder();
        while (q-- > 0) {
            int l = (int) fs.nextLong();
            int r = (int) fs.nextLong();
            if (l == r) {
                sb.append(a[l]).append('\\n');
            } else {
                int lvl = 31 - Integer.numberOfLeadingZeros(l ^ r);
                sb.append((dst[lvl][l] * dst[lvl][r]) % P).append('\\n');
            }
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
    it = iter(data)
    n = int(next(it))
    P = int(next(it))
    q = int(next(it))

    B = 1
    while (1 << B) < max(2, n):
        B += 1
    S = 1 << B
    a = [1 % P] * S
    for i in range(n):
        a[i] = int(next(it)) % P

    dst = [[0] * S for _ in range(B)]
    for lvl in range(B):
        half = 1 << lvl
        full = half << 1
        row = dst[lvl]
        for start in range(0, S, full):
            mid = start + half
            row[mid - 1] = a[mid - 1]
            for i in range(mid - 2, start - 1, -1):
                row[i] = (row[i + 1] * a[i]) % P
            row[mid] = a[mid]
            for i in range(mid + 1, start + full):
                row[i] = (row[i - 1] * a[i]) % P

    out = []
    for _ in range(q):
        l = int(next(it))
        r = int(next(it))
        if l == r:
            out.append(str(a[l]))
        else:
            lvl = (l ^ r).bit_length() - 1
            row = dst[lvl]
            out.append(str((row[l] * row[r]) % P))
    sys.stdout.write("\\n".join(out) + "\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
idx = 0
n = tokens[idx].to_i
p_mod = tokens[idx + 1].to_i
q = tokens[idx + 2].to_i
idx += 3

b = 1
b += 1 while (1 << b) < [2, n].max
s = 1 << b
a = Array.new(s, 1 % p_mod)
n.times do |i|
  a[i] = tokens[idx].to_i % p_mod
  idx += 1
end

dst = Array.new(b) { Array.new(s, 0) }
b.times do |lvl|
  half = 1 << lvl
  full = half << 1
  row = dst[lvl]
  (0...s).step(full) do |start|
    mid = start + half
    row[mid - 1] = a[mid - 1]
    (mid - 2).downto(start) { |i| row[i] = (row[i + 1] * a[i]) % p_mod }
    row[mid] = a[mid]
    ((mid + 1)...(start + full)).each { |i| row[i] = (row[i - 1] * a[i]) % p_mod }
  end
end

out = []
q.times do
  l = tokens[idx].to_i
  r = tokens[idx + 1].to_i
  idx += 2
  if l == r
    out << a[l]
  else
    lvl = (l ^ r).bit_length - 1
    out << ((dst[lvl][l] * dst[lvl][r]) % p_mod)
  end
end
puts out.join("\\n")`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'CSES',
      title: 'Static Range Minimum Queries',
      difficulty: 'Easy / Range Queries',
      url: 'https://cses.fi/problemset/task/1647',
      patternNote: 'Direct O(1) RMQ Sparse Table benchmark over N = 2e5 elements and Q = 2e5 queries.',
    },
    {
      platform: 'AtCoder',
      title: 'ABC214 F / ARC117 D (Range RMQ + Euler LCA)',
      difficulty: '1500–1800',
      url: 'https://atcoder.jp/contests/abc214/tasks',
      patternNote: 'Pair Sparse Table RMQ with Euler Tours for O(1) LCA inside heavy DP transitions.',
    },
    {
      platform: 'Codeforces',
      title: 'CGCDSSQ (CF 475D) & Maximum of Minimums',
      difficulty: '1800–2000',
      url: 'https://codeforces.com/problemset/problem/475/D',
      patternNote: 'Use O(1) GCD Sparse Table + Binary Search to jump between distinct subarray GCD boundaries.',
    },
    {
      platform: 'CodeChef',
      title: 'Product on the Segment by Modulo (SEGPROD)',
      difficulty: 'Hard',
      url: 'https://www.codechef.com/problems/SEGPROD',
      patternNote: 'Canonical Disjoint Sparse Table problem: `2 * 10^7` non-coprime range product queries in O(1)!',
    },
    {
      platform: 'HackerRank',
      title: 'Range Minimum Query & Subarray GCD',
      difficulty: 'Medium',
      url: 'https://www.hackerrank.com/challenges/range-minimum-query/problem',
      patternNote: 'Compare Sparse Table O(1) lookup throughput against iterative Segment Trees on immutable logs.',
    },
    {
      platform: 'NeetCode 150',
      title: 'Sliding Window Maximum & Continuous Subarrays',
      difficulty: 'Hard (LeetCode 239)',
      url: 'https://leetcode.com/problems/sliding-window-maximum/',
      patternNote: 'Static fixed-size or variable-size range extrema can be queried in O(1) with Sparse Table.',
    },
  ],
  interviewNotes: [
    'Whenever an interviewer specifies an **immutable** array ("no updates, millions of range min/max/GCD queries"), Sparse Table is the optimal O(N log N) build / O(1) query answer.',
    'Explain why idempotence (`f(x, x) = x`) allows overlapping power-of-two blocks—and impress systems/infra interviewers by mentioning **Disjoint Sparse Tables** when asked how to support non-idempotent range products in O(1).',
    'Cache-friendly `st[k][i]` ordering vs `st[i][k]` is a great systems optimization talking point.',
  ],
  projectBlueprint: {
    title: 'Immutable Time-Series Telemetry Min/Max Lookup Engine',
    tagline: 'Serve sub-microsecond O(1) historical SLA latency min/max/percentile range queries over immutable server telemetry logs.',
    stackSummary: 'C++20 Cache-Aligned Sparse Table, Disjoint Aggregation Layer, Zero-Allocation Query API',
    asciiDiagram: `
+------------------------------+      +------------------------------------+
| Immutable Telemetry Window   | ---> | Cache-Friendly st[k][i] Tables     |
| Latency[0..N-1] (ns)         |      | Min Table + Max Table O(N log N)   |
+------------------------------+      +------------------------------------+
                                                       |
          +--------------------------------------------+
          v
+------------------------------------+     +-------------------------------+
| O(1) Range Query [t1, t2]          | --> | Instant Dashboard Sparkline   |
| 2 Lookups: st[k][L] & st[k][R-2^k] |     | Peak Spike & Floor Readout    |
+------------------------------------+     +-------------------------------+`,
    milestones: [
      {
        id: 'm1',
        title: '1. Precompute Log2 Lookup & Cache-Aligned st[k][i] Buffers',
        detail: 'Pack min and max Sparse Tables along contiguous row vectors for fast SIMD-friendly construction.',
      },
      {
        id: 'm2',
        title: '2. Zero-Branch O(1) Query Dispatcher',
        detail: 'Expose `min_latency(t1, t2)` and `max_latency(t1, t2)` executing in constant CPU cycles without heap allocation.',
      },
      {
        id: 'm3',
        title: '3. Disjoint Sparse Table Checksum / Multiplicative Verifier',
        detail: 'Add a Disjoint Sparse Table alongside RMQ to query non-idempotent checksums across arbitrary time intervals in `O(1)`.',
      },
    ],
    starterCode: `// Immutable Time-Series Telemetry Min/Max Lookup Engine (Runnable C++20 Prototype)
#include <bits/stdc++.h>
using namespace std;

struct TelemetryEngine {
    int n;
    vector<int> lg;
    vector<vector<int>> stMin, stMax;

    explicit TelemetryEngine(const vector<int>& samples) : n((int)samples.size()) {
        lg.assign(n + 1, 0);
        for (int i = 2; i <= n; i++) lg[i] = lg[i >> 1] + 1;
        int LOG = lg[n] + 1;
        stMin.assign(LOG, vector<int>(n));
        stMax.assign(LOG, vector<int>(n));
        stMin[0] = stMax[0] = samples;
        for (int k = 1; k < LOG; k++) {
            int half = 1 << (k - 1), lim = n - (1 << k) + 1;
            for (int i = 0; i < lim; i++) {
                stMin[k][i] = min(stMin[k - 1][i], stMin[k - 1][i + half]);
                stMax[k][i] = max(stMax[k - 1][i], stMax[k - 1][i + half]);
            }
        }
    }

    pair<int, int> query_minmax(int l, int r) const {
        int k = lg[r - l + 1];
        int mn = min(stMin[k][l], stMin[k][r - (1 << k) + 1]);
        int mx = max(stMax[k][l], stMax[k][r - (1 << k) + 1]);
        return {mn, mx};
    }
};

int main() {
    vector<int> latencyMs = {42, 18, 95, 31, 14, 120, 64, 29};
    TelemetryEngine engine(latencyMs);
    for (auto [l, r] : vector<pair<int, int>>{{0, 3}, {2, 6}, {4, 7}}) {
        auto [mn, mx] = engine.query_minmax(l, r);
        cout << "Window [" << l << ".." << r << "] -> Min: " << mn << " ms | Max: " << mx << " ms\\n";
    }
    return 0;
}`,
  },
};
