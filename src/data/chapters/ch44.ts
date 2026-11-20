import type { TheoryChapter } from '../../types/vault';

export const CH44_LI_CHAO_CHT: TheoryChapter = {
  slug: 'li-chao-tree-convex-hull-trick',
  topicId: 'ds-12',
  title: 'Li Chao Tree & Dynamic Convex Hull Trick',
  domain: 'Data Structures',
  ratingTier: '2200–2600',
  usacoDivision: 'Platinum',
  subtitle:
    'Optimize 1D DP transitions dp[i] = min(m[j]*x[i] + b[j]) in O(N) via monotonic Convex Hull Trick—and handle arbitrary non-monotonic line/segment insertions and min/max queries over [-10^9, 10^9] in O(log C) using a Sparse Li Chao Tree.',
  analogyTitle: 'The Roof-Beam Tournament & Midpoint Winner Analogy',
  analogyBody:
    'In **Monotonic Convex Hull Trick (CHT)**, lines arrive ordered by slope `m`, forming a clean lower envelope where you pop obsolete roof beams off a stack/deque as queries `x` march rightward. What happens when lines arrive in **scrambled slope order**, or only exist over **segments `[l, r)`**? Maintaining a dynamic upper/lower hull with `std::set` works, yet requires delicate iterator math. Enter the **Li Chao Tree**: a segment tree over the x-coordinate range `[L, R]` where every node stores **one single winning line**—specifically, the line that currently wins at the interval’s **midpoint `mid`**! When a new challenger line enters `[L, R]`, evaluate both lines at `mid`: swap so the better line at `mid` stays in the node, and notice a crucial geometric truth—two straight lines intersect **at most once**! Therefore, the displaced (losing-at-`mid`) line can beat the winner on **at most ONE side** (either strictly left `[L, mid]` OR strictly right `[mid + 1, R]`), so we simply push it down into that single half! Zero hull iterators, `O(log C)` depth, and segment restrictions `[ql, qr)` work just like normal segment-tree range decomposition!',
  prerequisites: [
    {
      slug: 'segment-tree-point-range',
      title: 'Segment Tree (Point Update, Range Query)',
    },
  ],
  traceTitle: 'Interactive Li Chao Tree Midpoint Comparison & Single-Branch Descent Trace',
  traceSubtitle:
    'Insert lines `L1: y = 2x + 1`, `L2: y = -x + 10`, `L3: y = 0x + 4` over x-domain `[0..7]`, then query `min(x = 5)`.',
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Step 1: Insert L1 (y = 2x + 1) into Empty Root [0..7]',
      explanation:
        'Root node [0..7] (mid = 3) has no stored line yet, so L1 (y = 2x + 1) takes root [0..7] immediately in O(1).',
      mode: 'array',
      arrays: [
        {
          name: 'Li Chao Root Node [0..7] (mid=3)',
          cells: [
            { index: 0, value: '2x+1', label: 'Root [0..7]', highlight: 'active' },
            { index: 1, value: 'none', label: 'Left [0..3]', highlight: 'neutral' },
            { index: 2, value: 'none', label: 'Right [4..7]', highlight: 'neutral' },
          ],
        },
      ],
      variables: { MidX: 3, RootLine: '2x + 1', L1AtMid: 7 },
    },
    {
      stepNumber: 2,
      title: 'Step 2: Insert L2 (y = -x + 10) — Compare at Left=0 and Mid=3',
      explanation:
        'At mid=3: L2(3)=7 == L1(3)=7, while at x=0: L2(0)=10 > L1(0)=1 (L1 wins left!), and at x=7: L2(7)=3 < L1(7)=15 (L2 wins right!). Since L1 stays at Root [0..7] (winning left+mid), push L2 down into ONLY Right Child [4..7]!',
      mode: 'array',
      arrays: [
        {
          name: 'Li Chao Tree After L2 Insertion',
          cells: [
            { index: 0, value: '2x+1', label: 'Root [0..7]', highlight: 'window' },
            { index: 1, value: 'none', label: 'Left [0..3]', highlight: 'neutral' },
            { index: 2, value: '-x+10', label: 'Right [4..7]', highlight: 'updated' },
          ],
        },
      ],
      variables: { L1At0: 1, L2At0: 10, DisplacedBranch: 'Right [4..7]' },
    },
    {
      stepNumber: 3,
      title: 'Step 3: Insert L3 (y = 0x + 4) — Swap at Root [0..7] (mid=3) & Push L1 Left!',
      explanation:
        'At mid=3: L3(3)=4 < L1(3)=7 -> L3 beats L1 at midpoint! Swap them so L3 (y=4) now sits at Root [0..7]. Check left endpoint x=0: L1(0)=1 < L3(0)=4, so displaced L1 beats L3 on the LEFT! Push L1 down into Left [0..3] (never touching Right [4..7]!).',
      mode: 'array',
      arrays: [
        {
          name: 'Li Chao Tree After L3 Insertion (Root Swapped!)',
          cells: [
            { index: 0, value: '0x+4', label: 'Root [0..7]', highlight: 'active' },
            { index: 1, value: '2x+1', label: 'Left [0..3]', highlight: 'updated' },
            { index: 2, value: '-x+10', label: 'Right [4..7]', highlight: 'window' },
          ],
        },
      ],
      variables: { NewRoot: 'y = 4', DisplacedLine: '2x + 1', PushedTo: 'Left [0..3]' },
    },
    {
      stepNumber: 4,
      title: 'Step 4: Query min(x = 5) — Collect min Along Root [0..7] -> Right [4..7] -> Leaf [5]',
      explanation:
        'Walk down the single path containing x = 5: Root [0..7] gives L3(5) = 4. Step right to [4..7]: Right gives L2(5) = -5 + 10 = 5. Minimum along path = min(4, 5) = 4 in O(log C)! (Notice query(x = 7) visits Root=4, Right=-7+10=3 -> min=3!).',
      mode: 'array',
      arrays: [
        {
          name: 'Query Path Evaluations at x = 5 vs x = 7',
          cells: [
            { index: 0, value: 'Root: 4', label: 'x=5', highlight: 'active' },
            { index: 1, value: 'Right: 5', label: 'x=5', highlight: 'window' },
            { index: 2, value: 'Ans=4', label: 'min(x=5)', highlight: 'active' },
            { index: 3, value: 'Ans=3', label: 'min(x=7)', highlight: 'updated' },
          ],
        },
      ],
      variables: { QueryX: 5, PathMin: 4, QueryX7Min: 3 },
    },
  ],
  reductionClues: [
    {
      clue: '"DP transition dp[i] = min_{j < i}(dp[j] + m[j] * x[i]) where slopes m[j] are monotonic AND queries x[i] are monotonic"',
      translation:
        '**Monotonic Convex Hull Trick (Deque)** runs in strict **`O(N)`** total time with zero tree nodes—just pop front while `eval(q[0], x) >= eval(q[1], x)` and pop back using cross-product intersection check!',
    },
    {
      clue: '"Insert arbitrary lines y = m*x + b (non-monotonic slopes) and query min/max at arbitrary x in [-10^9, 10^9]"',
      translation:
        '**Sparse/Dynamic Li Chao Tree**! Allocate child nodes lazily on demand (`O(Q log C)` nodes, ~`31 * Q` integers for `[-10^9, 10^9]`). Never needs `std::set` iterators or rational division!',
    },
    {
      clue: '"Insert linear SEGMENTS y = a*x + b valid ONLY on sub-interval [l, r), then query min at x"',
      translation:
        '**Segment-Restricted Li Chao Tree**! Recursively split `[ql, qr]` into `O(log C)` canonical segment-tree nodes inside `[l, r]`, and run standard Li Chao midpoint insertion inside each covered canonical node—`O(log^2 C)` per segment add and `O(log C)` per query!',
    },
    {
      clue: '"Maximization instead of minimization (dp[i] = max(m*x + b))"',
      translation:
        'Simply negate `(m, b)` -> `(-m, -b)`, query `min`, and negate the result (or invert the `<` comparison to `>`)!',
    },
  ],
  timeComplexity: 'Monotonic CHT: O(N) | Li Chao Line Add / Query: O(log C) | Segment Add: O(log^2 C)',
  spaceComplexity: 'Monotonic CHT: O(N) | Sparse Li Chao Tree: O(Q log C) nodes',
  pitfalls: [
    {
      type: 'WA',
      title: 'Using (l + r) / 2 Instead of floorDiv When Coordinates Can Be Negative',
      detail:
        'In C++/Rust/Java, `(-1 + 0) / 2` truncates toward zero to `0`, NOT `-1`, causing infinite recursion on `[-1, 0]` because `[mid + 1, r] = [1, 0]` while `[l, mid] = [-1, 0]`! ALWAYS compute `long long mid = l + ((r - l) >> 1)` (arithmetic right shift or `Math.floorDiv(l + r, 2)`), which guarantees `l <= mid < r` for ALL negative and positive bounds!',
    },
    {
      type: 'WA',
      title: '64-Bit Overflow in CHT Intersection Cross-Product (a1 - a2) * (b3 - b1)',
      detail:
        'In Monotonic CHT, comparing intersection points `(b2 - b1)/(m1 - m2) >= (b3 - b2)/(m2 - m3)` multiplies differences of up to `10^12 * 10^9 = 10^21`, overflowing 64-bit integers! Always cast to `__int128` (C++), `i128` (Rust), `BigInteger` (Java), or use `long double` carefully—OR simply use a **Li Chao Tree** which NEVER cross-multiplies lines!',
    },
    {
      type: 'MLE',
      title: 'Initializing a Sparse Li Chao Tree With Dynamic Heap Nodes on 2 * 10^5 Queries',
      detail:
        'On Segment Add (`O(log^2 C)` nodes per segment), `2 * 10^5` segments can allocate several million nodes! Use flat index vectors (`lc[]`, `rc[]`, `m[]`, `b[]`) rather than `new Node()` pointers, and coordinate-compress the query `x`-coordinates when offline (`C <= 2 * 10^5`, depth `18` instead of `31`)!',
    },
    {
      type: 'WA',
      title: 'Returning Empty Identity Line When Leaf Reaches l == r Before Checking Current Node',
      detail:
        'In Li Chao `insert(node, l, r, newLine)`, if `l == r` and the new line beats the current node’s line at `l`, store the better line and `return` immediately BEFORE computing `mid` and recursing—preventing out-of-bounds leaf splits!',
    },
  ],
  implementations: {
    cpp20: `#include <bits/stdc++.h>
using namespace std;

// Sparse Dynamic Li Chao Tree over [-1e9, 1e9]: O(log C) Line Add & Point Min Query
struct SparseLiChao {
    static constexpr long long X_MIN = -1'000'000'000LL;
    static constexpr long long X_MAX =  1'000'000'000LL;
    static constexpr long long INF   =  4'000'000'000'000'000'000LL;

    struct Line {
        long long m = 0, b = INF;
        long long eval(long long x) const {
            if (b == INF) return INF;
            return m * x + b;
        }
    };

    struct Node {
        Line line;
        int lc = 0, rc = 0;
    };

    vector<Node> tree;

    SparseLiChao(int reserveNodes = 2000000) {
        tree.reserve(reserveNodes);
        tree.push_back(Node{}); // 0: empty sentinel
        tree.push_back(Node{}); // 1: root over [X_MIN, X_MAX]
    }

    void addLine(int node, long long l, long long r, Line nw) {
        if (tree[node].line.b == INF) {
            tree[node].line = nw;
            return;
        }
        long long mid = l + ((r - l) >> 1);
        bool leftBetter = nw.eval(l) < tree[node].line.eval(l);
        bool midBetter  = nw.eval(mid) < tree[node].line.eval(mid);
        if (midBetter) swap(tree[node].line, nw);
        if (l == r) return;
        if (leftBetter != midBetter) {
            if (!tree[node].lc) {
                tree[node].lc = (int)tree.size();
                tree.push_back(Node{});
            }
            addLine(tree[node].lc, l, mid, nw);
        } else {
            if (!tree[node].rc) {
                tree[node].rc = (int)tree.size();
                tree.push_back(Node{});
            }
            addLine(tree[node].rc, mid + 1, r, nw);
        }
    }

    void add(long long m, long long b) {
        addLine(1, X_MIN, X_MAX, Line{m, b});
    }

    long long query(long long x) const {
        int node = 1;
        long long l = X_MIN, r = X_MAX, ans = INF;
        while (node) {
            ans = min(ans, tree[node].line.eval(x));
            if (l == r) break;
            long long mid = l + ((r - l) >> 1);
            if (x <= mid) {
                node = tree[node].lc;
                r = mid;
            } else {
                node = tree[node].rc;
                l = mid + 1;
            }
        }
        return ans;
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, q;
    if (!(cin >> n >> q)) return 0;
    SparseLiChao lct((n + q) * 20);
    for (int i = 0; i < n; i++) {
        long long m, b;
        cin >> m >> b;
        lct.add(m, b);
    }
    while (q--) {
        int type;
        cin >> type;
        if (type == 0) {
            long long m, b;
            cin >> m >> b;
            lct.add(m, b);
        } else {
            long long x;
            cin >> x;
            cout << lct.query(x) << "\\n";
        }
    }
    return 0;
}`,
    rust: `use std::io::{self, Read};

const X_MIN: i64 = -1_000_000_000;
const X_MAX: i64 = 1_000_000_000;
const INF: i128 = i128::MAX / 4;

#[derive(Clone, Copy)]
struct Line {
    m: i64,
    b: i128,
}

impl Line {
    fn eval(&self, x: i64) -> i128 {
        if self.b == INF {
            INF
        } else {
            (self.m as i128) * (x as i128) + self.b
        }
    }
}

struct Node {
    line: Line,
    lc: usize,
    rc: usize,
}

struct SparseLiChao {
    tree: Vec<Node>,
}

impl SparseLiChao {
    fn new(cap: usize) -> Self {
        let mut tree = Vec::with_capacity(cap);
        let empty = Line { m: 0, b: INF };
        tree.push(Node { line: empty, lc: 0, rc: 0 });
        tree.push(Node { line: empty, lc: 0, rc: 0 });
        Self { tree }
    }

    fn add(&mut self, m: i64, b: i64) {
        let mut nw = Line { m, b: b as i128 };
        let mut node = 1usize;
        let mut l = X_MIN;
        let mut r = X_MAX;
        loop {
            if self.tree[node].line.b == INF {
                self.tree[node].line = nw;
                return;
            }
            let mid = l + ((r - l) >> 1);
            let left_better = nw.eval(l) < self.tree[node].line.eval(l);
            let mid_better = nw.eval(mid) < self.tree[node].line.eval(mid);
            if mid_better {
                std::mem::swap(&mut self.tree[node].line, &mut nw);
            }
            if l == r {
                return;
            }
            if left_better != mid_better {
                if self.tree[node].lc == 0 {
                    let id = self.tree.len();
                    self.tree[node].lc = id;
                    self.tree.push(Node { line: Line { m: 0, b: INF }, lc: 0, rc: 0 });
                }
                node = self.tree[node].lc;
                r = mid;
            } else {
                if self.tree[node].rc == 0 {
                    let id = self.tree.len();
                    self.tree[node].rc = id;
                    self.tree.push(Node { line: Line { m: 0, b: INF }, lc: 0, rc: 0 });
                }
                node = self.tree[node].rc;
                l = mid + 1;
            }
        }
    }

    fn query(&self, x: i64) -> i128 {
        let mut node = 1usize;
        let mut l = X_MIN;
        let mut r = X_MAX;
        let mut ans = INF;
        while node != 0 {
            ans = ans.min(self.tree[node].line.eval(x));
            if l == r {
                break;
            }
            let mid = l + ((r - l) >> 1);
            if x <= mid {
                node = self.tree[node].lc;
                r = mid;
            } else {
                node = self.tree[node].rc;
                l = mid + 1;
            }
        }
        ans
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

    let mut lct = SparseLiChao::new((n + q) * 16 + 10);
    for _ in 0..n {
        let m: i64 = it.next().unwrap().parse().unwrap();
        let b: i64 = it.next().unwrap().parse().unwrap();
        lct.add(m, b);
    }

    let mut out = String::new();
    for _ in 0..q {
        let typ: i32 = it.next().unwrap().parse().unwrap();
        if typ == 0 {
            let m: i64 = it.next().unwrap().parse().unwrap();
            let b: i64 = it.next().unwrap().parse().unwrap();
            lct.add(m, b);
        } else {
            let x: i64 = it.next().unwrap().parse().unwrap();
            out.push_str(&format!("{}\\n", lct.query(x)));
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
            long sign = 1;
            if (c == '-') { sign = -1; c = readByte(); }
            long res = 0;
            while (c > ' ') { res = res * 10 + (c - '0'); c = readByte(); }
            return res * sign;
        }
    }

    static final long X_MIN = -1_000_000_000L;
    static final long X_MAX = 1_000_000_000L;
    static final long INF = 4_000_000_000_000_000_000L;

    static long[] lm, lb;
    static int[] lc, rc;
    static int ptr = 1;

    static void ensureCapacity(int needed) {
        if (needed < lm.length) return;
        int nCap = lm.length * 2;
        lm = Arrays.copyOf(lm, nCap);
        lb = Arrays.copyOf(lb, nCap);
        lc = Arrays.copyOf(lc, nCap);
        rc = Arrays.copyOf(rc, nCap);
    }

    static long eval(long m, long b, long x) {
        return b == INF ? INF : m * x + b;
    }

    static void add(long m, long b) {
        int node = 1;
        long l = X_MIN, r = X_MAX;
        while (true) {
            if (lb[node] == INF) {
                lm[node] = m;
                lb[node] = b;
                return;
            }
            long mid = l + ((r - l) >> 1);
            boolean leftBetter = eval(m, b, l) < eval(lm[node], lb[node], l);
            boolean midBetter = eval(m, b, mid) < eval(lm[node], lb[node], mid);
            if (midBetter) {
                long tm = lm[node], tb = lb[node];
                lm[node] = m; lb[node] = b;
                m = tm; b = tb;
            }
            if (l == r) return;
            if (leftBetter != midBetter) {
                if (lc[node] == 0) {
                    ensureCapacity(ptr + 2);
                    lc[node] = ++ptr;
                    lb[ptr] = INF;
                }
                node = lc[node];
                r = mid;
            } else {
                if (rc[node] == 0) {
                    ensureCapacity(ptr + 2);
                    rc[node] = ++ptr;
                    lb[ptr] = INF;
                }
                node = rc[node];
                l = mid + 1;
            }
        }
    }

    static long query(long x) {
        int node = 1;
        long l = X_MIN, r = X_MAX, ans = INF;
        while (node != 0) {
            long val = eval(lm[node], lb[node], x);
            if (val < ans) ans = val;
            if (l == r) break;
            long mid = l + ((r - l) >> 1);
            if (x <= mid) { node = lc[node]; r = mid; }
            else { node = rc[node]; l = mid + 1; }
        }
        return ans;
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        long nIn = fs.nextLong();
        if (nIn == Long.MIN_VALUE) return;
        int n = (int) nIn, q = (int) fs.nextLong();

        int initCap = Math.max(16, (n + q) * 8);
        lm = new long[initCap];
        lb = new long[initCap];
        lc = new int[initCap];
        rc = new int[initCap];
        lb[0] = INF;
        lb[1] = INF;

        for (int i = 0; i < n; i++) add(fs.nextLong(), fs.nextLong());

        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < q; i++) {
            long typ = fs.nextLong();
            if (typ == 0) add(fs.nextLong(), fs.nextLong());
            else sb.append(query(fs.nextLong())).append('\\n');
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

    X_MIN = -10**9
    X_MAX = 10**9
    INF = 10**30

    lm = [0, 0]
    lb = [INF, INF]
    lc = [0, 0]
    rc = [0, 0]

    def add(m: int, b: int) -> None:
        node = 1
        l, r = X_MIN, X_MAX
        while True:
            nb = lb[node]
            if nb == INF:
                lm[node] = m
                lb[node] = b
                return
            nm = lm[node]
            mid = (l + r) >> 1
            left_better = (m * l + b) < (nm * l + nb)
            mid_better = (m * mid + b) < (nm * mid + nb)
            if mid_better:
                lm[node], lb[node] = m, b
                m, b = nm, nb
            if l == r:
                return
            if left_better != mid_better:
                if lc[node] == 0:
                    lc[node] = len(lb)
                    lm.append(0)
                    lb.append(INF)
                    lc.append(0)
                    rc.append(0)
                node = lc[node]
                r = mid
            else:
                if rc[node] == 0:
                    rc[node] = len(lb)
                    lm.append(0)
                    lb.append(INF)
                    lc.append(0)
                    rc.append(0)
                node = rc[node]
                l = mid + 1

    def query(x: int) -> int:
        node = 1
        l, r = X_MIN, X_MAX
        ans = INF
        while node:
            if lb[node] != INF:
                cand = lm[node] * x + lb[node]
                if cand < ans:
                    ans = cand
            if l == r:
                break
            mid = (l + r) >> 1
            if x <= mid:
                node = lc[node]
                r = mid
            else:
                node = rc[node]
                l = mid + 1
        return ans

    for _ in range(n):
        add(int(next(it)), int(next(it)))

    out = []
    for _ in range(q):
        typ = int(next(it))
        if typ == 0:
            add(int(next(it)), int(next(it)))
        else:
            out.append(str(query(int(next(it)))))
    sys.stdout.write("\\n".join(out) + "\\n")

if __name__ == "__main__":
    solve()`,
    ruby: `tokens = $stdin.read.split
exit if tokens.empty?
idx = 0
n = tokens[idx].to_i; idx += 1
q = tokens[idx].to_i; idx += 1

X_MIN = -1_000_000_000
X_MAX =  1_000_000_000
INF = 10**30

lm = [0, 0]
lb = [INF, INF]
lc = [0, 0]
rc = [0, 0]

add = lambda do |m, b|
  node = 1
  l = X_MIN
  r = X_MAX
  loop do
    nb = lb[node]
    if nb == INF
      lm[node] = m
      lb[node] = b
      return
    end
    nm = lm[node]
    mid = (l + r) >> 1
    left_better = (m * l + b) < (nm * l + nb)
    mid_better = (m * mid + b) < (nm * mid + nb)
    if mid_better
      lm[node] = m
      lb[node] = b
      m = nm
      b = nb
    end
    return if l == r
    if left_better != mid_better
      if lc[node] == 0
        lc[node] = lb.length
        lm << 0; lb << INF; lc << 0; rc << 0
      end
      node = lc[node]
      r = mid
    else
      if rc[node] == 0
        rc[node] = lb.length
        lm << 0; lb << INF; lc << 0; rc << 0
      end
      node = rc[node]
      l = mid + 1
    end
  end
end

query = lambda do |x|
  node = 1
  l = X_MIN
  r = X_MAX
  ans = INF
  while node != 0
    if lb[node] != INF
      cand = lm[node] * x + lb[node]
      ans = cand if cand < ans
    end
    break if l == r
    mid = (l + r) >> 1
    if x <= mid
      node = lc[node]
      r = mid
    else
      node = rc[node]
      l = mid + 1
    end
  end
  ans
end

n.times do
  m = tokens[idx].to_i; idx += 1
  b = tokens[idx].to_i; idx += 1
  add.call(m, b)
end

out = []
q.times do
  typ = tokens[idx].to_i; idx += 1
  if typ == 0
    m = tokens[idx].to_i; idx += 1
    b = tokens[idx].to_i; idx += 1
    add.call(m, b)
  else
    x = tokens[idx].to_i; idx += 1
    out << query.call(x).to_s
  end
end
puts out.join("\\n")`,
  },
  practiceProblems: [
    {
      id: 'ch44-p1',
      tier: 'Warmup',
      ratingRange: '1850–2050',
      title: 'Monster Game I — Monotonic Convex Hull Trick DP in O(N)',
      statement:
        'You must defeat `N` monsters in sequence (`1..N`). Monster `i` has strength `s[i]` (`s[1] <= s[2] <= ... <= s[N]`). Initially your weapon skill factor is `x`. Defeating monster `i` takes time `s[i] * current_skill`, and after defeating monster `i` you may optionally upgrade your weapon skill to `f[i]` (where `f[1] >= f[2] >= ... >= f[N]`, monotonically non-increasing!). Find the minimum total time to defeat monster `N`.',
      constraints: '1 <= N <= 2 * 10^5, 1 <= s[i], f[i], x <= 10^6, s non-decreasing, f non-increasing',
      sampleInput: '5 100\n20 30 30 50 70\n60 30 20 10 5',
      sampleOutput: '5300',
      hints: [
        'Write the DP recurrence: `dp[i] = min_{0 <= j < i}(f[j] * s[i] + dp[j])`, with `f[0] = x, dp[0] = 0`!',
        'Because slopes `m = f[j]` are non-increasing AND query points `s[i]` are non-decreasing, maintain a monotonic lower-hull deque: pop from the front while `eval(dq[0], s[i]) >= eval(dq[1], s[i])`, and pop from the back using `__int128` cross-product `(b2 - b1)*(m1 - m3) >= (b3 - b1)*(m1 - m2)` (note: handle equal slopes `f[j] == f[last]` carefully by keeping the smaller intercept `b = dp[j]` and popping `dq.back()` if `nw.b < dq.back().b`)!',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

// CSES Monster Game I: Monotonic Convex Hull Trick in strict O(N)
struct Line {
    long long m, b;
    long long eval(long long x) const { return m * x + b; }
};

// Returns true if line l2 is completely redundant between l1 (steeper) and l3 (flatter)
bool bad(const Line& l1, const Line& l2, const Line& l3) {
    // Compare intersection x(l1, l2) >= x(l1, l3):
    // (l2.b - l1.b) / (l1.m - l2.m) >= (l3.b - l1.b) / (l1.m - l3.m)
    __int128 lhs = (__int128)(l2.b - l1.b) * (l1.m - l3.m);
    __int128 rhs = (__int128)(l3.b - l1.b) * (l1.m - l2.m);
    return lhs >= rhs;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    long long x0;
    if (!(cin >> n >> x0)) return 0;
    vector<long long> s(n + 1), f(n + 1);
    for (int i = 1; i <= n; i++) cin >> s[i];
    for (int i = 1; i <= n; i++) cin >> f[i];

    deque<Line> dq;
    dq.push_back({x0, 0});

    auto addLine = [&](Line nw) {
        if (!dq.empty() && dq.back().m == nw.m) {
            if (nw.b >= dq.back().b) return;
            dq.pop_back();
        }
        while (dq.size() >= 2 && bad(dq[dq.size() - 2], dq.back(), nw)) {
            dq.pop_back();
        }
        dq.push_back(nw);
    };

    long long ans = 0;
    for (int i = 1; i <= n; i++) {
        while (dq.size() >= 2 && dq[0].eval(s[i]) >= dq[1].eval(s[i])) {
            dq.pop_front();
        }
        long long dpi = dq[0].eval(s[i]);
        if (i == n) ans = dpi;
        addLine({f[i], dpi});
    }
    cout << ans << "\\n";
    return 0;
}`,
        rust: `use std::collections::VecDeque;
use std::io::{self, Read};

#[derive(Clone, Copy)]
struct Line {
    m: i64,
    b: i64,
}

impl Line {
    fn eval(&self, x: i64) -> i64 {
        self.m * x + self.b
    }
}

fn bad(l1: Line, l2: Line, l3: Line) -> bool {
    let lhs = (l2.b - l1.b) as i128 * (l1.m - l3.m) as i128;
    let rhs = (l3.b - l1.b) as i128 * (l1.m - l2.m) as i128;
    lhs >= rhs
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let n: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };
    let x0: i64 = it.next().unwrap().parse().unwrap();
    let mut s = vec![0i64; n + 1];
    let mut f = vec![0i64; n + 1];
    for i in 1..=n {
        s[i] = it.next().unwrap().parse().unwrap();
    }
    for i in 1..=n {
        f[i] = it.next().unwrap().parse().unwrap();
    }

    let mut dq: VecDeque<Line> = VecDeque::with_capacity(n + 1);
    dq.push_back(Line { m: x0, b: 0 });
    let mut ans = 0i64;

    for i in 1..=n {
        while dq.len() >= 2 && dq[0].eval(s[i]) >= dq[1].eval(s[i]) {
            dq.pop_front();
        }
        let dpi = dq[0].eval(s[i]);
        if i == n {
            ans = dpi;
        }
        let nw = Line { m: f[i], b: dpi };
        if let Some(&last) = dq.back() {
            if last.m == nw.m {
                if nw.b >= last.b {
                    continue;
                }
                dq.pop_back();
            }
        }
        while dq.len() >= 2 && bad(dq[dq.len() - 2], dq[dq.len() - 1], nw) {
            dq.pop_back();
        }
        dq.push_back(nw);
    }
    println!("{}", ans);
}`,
        java21: `import java.io.IOException;
import java.io.InputStream;
import java.math.BigInteger;

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

    static boolean bad(long m1, long b1, long m2, long b2, long m3, long b3) {
        BigInteger lhs = BigInteger.valueOf(b2 - b1).multiply(BigInteger.valueOf(m1 - m3));
        BigInteger rhs = BigInteger.valueOf(b3 - b1).multiply(BigInteger.valueOf(m1 - m2));
        return lhs.compareTo(rhs) >= 0;
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        long nIn = fs.nextLong();
        if (nIn == Long.MIN_VALUE) return;
        int n = (int) nIn;
        long x0 = fs.nextLong();

        long[] s = new long[n + 1], f = new long[n + 1];
        for (int i = 1; i <= n; i++) s[i] = fs.nextLong();
        for (int i = 1; i <= n; i++) f[i] = fs.nextLong();

        long[] dm = new long[n + 2], db = new long[n + 2];
        int head = 0, tail = 0;
        dm[tail] = x0; db[tail++] = 0;

        long ans = 0;
        for (int i = 1; i <= n; i++) {
            while (tail - head >= 2 && dm[head] * s[i] + db[head] >= dm[head + 1] * s[i] + db[head + 1]) {
                head++;
            }
            long dpi = dm[head] * s[i] + db[head];
            if (i == n) ans = dpi;
            long nm = f[i], nb = dpi;
            if (tail > head && dm[tail - 1] == nm) {
                if (nb >= db[tail - 1]) continue;
                tail--;
            }
            while (tail - head >= 2 && bad(dm[tail - 2], db[tail - 2], dm[tail - 1], db[tail - 1], nm, nb)) {
                tail--;
            }
            dm[tail] = nm; db[tail++] = nb;
        }
        System.out.println(ans);
    }
}`,
        python3: `import sys
from collections import deque

sys.setrecursionlimit(200000)

def bad(l1, l2, l3) -> bool:
    return (l2[1] - l1[1]) * (l1[0] - l3[0]) >= (l3[1] - l1[1]) * (l1[0] - l2[0])

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    n = int(next(it))
    x0 = int(next(it))
    s = [0] + [int(next(it)) for _ in range(n)]
    f = [0] + [int(next(it)) for _ in range(n)]

    dq = deque([(x0, 0)])
    ans = 0
    for i in range(1, n + 1):
        si = s[i]
        while len(dq) >= 2 and dq[0][0] * si + dq[0][1] >= dq[1][0] * si + dq[1][1]:
            dq.popleft()
        dpi = dq[0][0] * si + dq[0][1]
        if i == n:
            ans = dpi
        nw = (f[i], dpi)
        if dq and dq[-1][0] == nw[0]:
            if nw[1] >= dq[-1][1]:
                continue
            dq.pop()
        while len(dq) >= 2 and bad(dq[-2], dq[-1], nw):
            dq.pop()
        dq.append(nw)
    sys.stdout.write(f"{ans}\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
idx = 0
n = tokens[idx].to_i; idx += 1
x0 = tokens[idx].to_i; idx += 1
s = [0] + Array.new(n) { tokens[idx].to_i.tap { idx += 1 } }
f = [0] + Array.new(n) { tokens[idx].to_i.tap { idx += 1 } }

bad = lambda do |l1, l2, l3|
  (l2[1] - l1[1]) * (l1[0] - l3[0]) >= (l3[1] - l1[1]) * (l1[0] - l2[0])
end

dm = [x0]
db = [0]
head = 0
ans = 0

(1..n).each do |i|
  si = s[i]
  head += 1 while dm.length - head >= 2 && dm[head] * si + db[head] >= dm[head + 1] * si + db[head + 1]
  dpi = dm[head] * si + db[head]
  ans = dpi if i == n
  nm = f[i]
  nb = dpi
  if dm.length > head && dm[-1] == nm
    next if nb >= db[-1]
    dm.pop
    db.pop
  end
  while dm.length - head >= 2 && bad.call([dm[-2], db[-2]], [dm[-1], db[-1]], [nm, nb])
    dm.pop
    db.pop
  end
  dm << nm
  db << nb
end
puts ans`,
      },
    },
    {
      id: 'ch44-p2',
      tier: 'Standard',
      ratingRange: '2050–2250',
      title: 'Line Add Get Min — Dynamic Non-Monotonic Li Chao Tree (Offline Coordinate Compression)',
      statement:
        'Start with `N` linear functions `y = a_i * x + b_i` and process `Q` arbitrary-order operations: `0 a b` (insert a new line `y = a * x + b`, where slopes `a` can increase or decrease arbitrarily), and `1 p` (output the minimum `a * p + b` among all inserted lines at point `p`). Demonstrate coordinate-compressed Li Chao Tree (`O(log Q)` depth with zero sparse pointers!).',
      constraints: '1 <= N, Q <= 2 * 10^5, |a|, |p| <= 10^9, |b| <= 10^18',
      sampleInput: '2 4\n-1 5\n2 0\n1 3\n0 -2 10\n1 3\n1 -1',
      sampleOutput: '2\n2\n-2',
      hints: [
        'Because ALL query `x`-coordinates `p` are known from input, collect and sort+deduplicate all `p` into `xs[0..M-1]` (`M <= 2 * 10^5`).',
        'Build a **standard array-based Li Chao Tree** of size `4 * M` indexed by `xs[l]`, `xs[mid]`, `xs[r]`! Now the tree height is at most `18` instead of `31`, uses `O(M)` contiguous cache-friendly arrays, and runs ~3x faster than sparse pointer allocation!',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

// Library Checker: Line Add Get Min using Coordinate-Compressed Li Chao Tree
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, q;
    if (!(cin >> n >> q)) return 0;

    vector<pair<long long, long long>> initLines(n);
    for (int i = 0; i < n; i++) cin >> initLines[i].first >> initLines[i].second;

    struct Op { int type; long long a, b; };
    vector<Op> ops(q);
    vector<long long> xs;
    for (int i = 0; i < q; i++) {
        cin >> ops[i].type;
        if (ops[i].type == 0) cin >> ops[i].a >> ops[i].b;
        else { cin >> ops[i].a; xs.push_back(ops[i].a); }
    }

    if (xs.empty()) return 0;
    sort(xs.begin(), xs.end());
    xs.erase(unique(xs.begin(), xs.end()), xs.end());
    int m = (int)xs.size();

    const long long INF = 4'000'000'000'000'000'000LL;
    struct Line { long long a = 0, b = INF; };
    vector<Line> tree(4 * m);

    auto eval = [&](const Line& ln, long long x) -> long long {
        return ln.b == INF ? INF : ln.a * x + ln.b;
    };

    auto addLine = [&](Line nw) {
        int node = 1, l = 0, r = m - 1;
        while (true) {
            if (tree[node].b == INF) { tree[node] = nw; return; }
            int mid = (l + r) >> 1;
            bool leftBetter = eval(nw, xs[l]) < eval(tree[node], xs[l]);
            bool midBetter  = eval(nw, xs[mid]) < eval(tree[node], xs[mid]);
            if (midBetter) swap(tree[node], nw);
            if (l == r) return;
            if (leftBetter != midBetter) { node = node << 1; r = mid; }
            else { node = (node << 1) | 1; l = mid + 1; }
        }
    };

    auto query = [&](long long x) -> long long {
        int idx = (int)(lower_bound(xs.begin(), xs.end(), x) - xs.begin());
        int node = 1, l = 0, r = m - 1;
        long long ans = INF;
        while (true) {
            ans = min(ans, eval(tree[node], x));
            if (l == r) break;
            int mid = (l + r) >> 1;
            if (idx <= mid) { node = node << 1; r = mid; }
            else { node = (node << 1) | 1; l = mid + 1; }
        }
        return ans;
    };

    for (auto [a, b] : initLines) addLine({a, b});
    for (const auto& op : ops) {
        if (op.type == 0) addLine({op.a, op.b});
        else cout << query(op.a) << "\\n";
    }
    return 0;
}`,
        rust: `use std::io::{self, Read};

const INF: i128 = i128::MAX / 4;

#[derive(Clone, Copy)]
struct Line {
    a: i64,
    b: i128,
}

impl Line {
    fn eval(&self, x: i64) -> i128 {
        if self.b == INF {
            INF
        } else {
            (self.a as i128) * (x as i128) + self.b
        }
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

    let mut init_lines = Vec::with_capacity(n);
    for _ in 0..n {
        let a: i64 = it.next().unwrap().parse().unwrap();
        let b: i64 = it.next().unwrap().parse().unwrap();
        init_lines.push(Line { a, b: b as i128 });
    }

    let mut ops = Vec::with_capacity(q);
    let mut xs = Vec::new();
    for _ in 0..q {
        let typ: i32 = it.next().unwrap().parse().unwrap();
        if typ == 0 {
            let a: i64 = it.next().unwrap().parse().unwrap();
            let b: i64 = it.next().unwrap().parse().unwrap();
            ops.push((0, a, b as i128));
        } else {
            let x: i64 = it.next().unwrap().parse().unwrap();
            xs.push(x);
            ops.push((1, x, 0));
        }
    }

    if xs.is_empty() {
        return;
    }
    xs.sort_unstable();
    xs.dedup();
    let m = xs.len();
    let mut tree = vec![Line { a: 0, b: INF }; 4 * m + 4];

    let add_line = |mut nw: Line, tree: &mut [Line]| {
        let mut node = 1usize;
        let mut l = 0usize;
        let mut r = m - 1;
        loop {
            if tree[node].b == INF {
                tree[node] = nw;
                return;
            }
            let mid = (l + r) >> 1;
            let left_b = nw.eval(xs[l]) < tree[node].eval(xs[l]);
            let mid_b = nw.eval(xs[mid]) < tree[node].eval(xs[mid]);
            if mid_b {
                std::mem::swap(&mut tree[node], &mut nw);
            }
            if l == r {
                return;
            }
            if left_b != mid_b {
                node <<= 1;
                r = mid;
            } else {
                node = (node << 1) | 1;
                l = mid + 1;
            }
        }
    };

    for ln in init_lines {
        add_line(ln, &mut tree);
    }

    let mut out = String::new();
    for (typ, a, b) in ops {
        if typ == 0 {
            add_line(Line { a, b }, &mut tree);
        } else {
            let idx = xs.binary_search(&a).unwrap();
            let mut node = 1usize;
            let mut l = 0usize;
            let mut r = m - 1;
            let mut ans = INF;
            loop {
                ans = ans.min(tree[node].eval(a));
                if l == r {
                    break;
                }
                let mid = (l + r) >> 1;
                if idx <= mid {
                    node <<= 1;
                    r = mid;
                } else {
                    node = (node << 1) | 1;
                    l = mid + 1;
                }
            }
            out.push_str(&format!("{}\\n", ans));
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
            long sign = 1;
            if (c == '-') { sign = -1; c = readByte(); }
            long res = 0;
            while (c > ' ') { res = res * 10 + (c - '0'); c = readByte(); }
            return res * sign;
        }
    }

    static final long INF = 4_000_000_000_000_000_000L;
    static long[] ta, tb, xs;
    static int m;

    static long eval(long a, long b, long x) {
        return b == INF ? INF : a * x + b;
    }

    static void addLine(long a, long b) {
        int node = 1, l = 0, r = m - 1;
        while (true) {
            if (tb[node] == INF) { ta[node] = a; tb[node] = b; return; }
            int mid = (l + r) >>> 1;
            boolean leftB = eval(a, b, xs[l]) < eval(ta[node], tb[node], xs[l]);
            boolean midB = eval(a, b, xs[mid]) < eval(ta[node], tb[node], xs[mid]);
            if (midB) {
                long oa = ta[node], ob = tb[node];
                ta[node] = a; tb[node] = b;
                a = oa; b = ob;
            }
            if (l == r) return;
            if (leftB != midB) { node <<= 1; r = mid; }
            else { node = (node << 1) | 1; l = mid + 1; }
        }
    }

    static long query(long x) {
        int idx = Arrays.binarySearch(xs, 0, m, x);
        int node = 1, l = 0, r = m - 1;
        long ans = INF;
        while (true) {
            long val = eval(ta[node], tb[node], x);
            if (val < ans) ans = val;
            if (l == r) break;
            int mid = (l + r) >>> 1;
            if (idx <= mid) { node <<= 1; r = mid; }
            else { node = (node << 1) | 1; l = mid + 1; }
        }
        return ans;
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        long nIn = fs.nextLong();
        if (nIn == Long.MIN_VALUE) return;
        int n = (int) nIn, q = (int) fs.nextLong();

        long[] ia = new long[n], ib = new long[n];
        for (int i = 0; i < n; i++) { ia[i] = fs.nextLong(); ib[i] = fs.nextLong(); }

        int[] ot = new int[q];
        long[] oa = new long[q], ob = new long[q], rawX = new long[q];
        int xc = 0;
        for (int i = 0; i < q; i++) {
            ot[i] = (int) fs.nextLong();
            if (ot[i] == 0) { oa[i] = fs.nextLong(); ob[i] = fs.nextLong(); }
            else { oa[i] = fs.nextLong(); rawX[xc++] = oa[i]; }
        }
        if (xc == 0) return;

        Arrays.sort(rawX, 0, xc);
        xs = new long[xc];
        m = 0;
        for (int i = 0; i < xc; i++) if (i == 0 || rawX[i] != rawX[i - 1]) xs[m++] = rawX[i];

        ta = new long[4 * m + 4];
        tb = new long[4 * m + 4];
        Arrays.fill(tb, INF);

        for (int i = 0; i < n; i++) addLine(ia[i], ib[i]);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < q; i++) {
            if (ot[i] == 0) addLine(oa[i], ob[i]);
            else sb.append(query(oa[i])).append('\\n');
        }
        System.out.print(sb);
    }
}`,
        python3: `import sys
from bisect import bisect_left

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    n = int(next(it))
    q = int(next(it))

    init_lines = [(int(next(it)), int(next(it))) for _ in range(n)]
    ops = []
    xs_raw = []
    for _ in range(q):
        t = int(next(it))
        if t == 0:
            ops.append((0, int(next(it)), int(next(it))))
        else:
            x = int(next(it))
            xs_raw.append(x)
            ops.append((1, x, 0))

    if not xs_raw:
        return
    xs = sorted(set(xs_raw))
    m = len(xs)
    INF = 10**30
    ta = [0] * (4 * m + 4)
    tb = [INF] * (4 * m + 4)

    def add_line(a: int, b: int) -> None:
        node = 1
        l, r = 0, m - 1
        while True:
            nb = tb[node]
            if nb == INF:
                ta[node] = a
                tb[node] = b
                return
            na = ta[node]
            mid = (l + r) >> 1
            xl, xm = xs[l], xs[mid]
            left_b = (a * xl + b) < (na * xl + nb)
            mid_b = (a * xm + b) < (na * xm + nb)
            if mid_b:
                ta[node], tb[node] = a, b
                a, b = na, nb
            if l == r:
                return
            if left_b != mid_b:
                node <<= 1
                r = mid
            else:
                node = (node << 1) | 1
                l = mid + 1

    def query(x: int) -> int:
        idx = bisect_left(xs, x)
        node = 1
        l, r = 0, m - 1
        ans = INF
        while True:
            if tb[node] != INF:
                cand = ta[node] * x + tb[node]
                if cand < ans:
                    ans = cand
            if l == r:
                break
            mid = (l + r) >> 1
            if idx <= mid:
                node <<= 1
                r = mid
            else:
                node = (node << 1) | 1
                l = mid + 1
        return ans

    for a, b in init_lines:
        add_line(a, b)
    out = []
    for t, a, b in ops:
        if t == 0:
            add_line(a, b)
        else:
            out.append(str(query(a)))
    sys.stdout.write("\\n".join(out) + "\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
idx = 0
n = tokens[idx].to_i; idx += 1
q = tokens[idx].to_i; idx += 1

init_lines = Array.new(n) do
  a = tokens[idx].to_i; idx += 1
  b = tokens[idx].to_i; idx += 1
  [a, b]
end

ops = []
xs_raw = []
q.times do
  t = tokens[idx].to_i; idx += 1
  if t == 0
    a = tokens[idx].to_i; idx += 1
    b = tokens[idx].to_i; idx += 1
    ops << [0, a, b]
  else
    x = tokens[idx].to_i; idx += 1
    xs_raw << x
    ops << [1, x, 0]
  end
end

exit if xs_raw.empty?
xs = xs_raw.uniq.sort
m = xs.length
INF = 10**30
ta = Array.new(4 * m + 4, 0)
tb = Array.new(4 * m + 4, INF)

add_line = lambda do |a, b|
  node = 1
  l = 0
  r = m - 1
  loop do
    nb = tb[node]
    if nb == INF
      ta[node] = a
      tb[node] = b
      return
    end
    na = ta[node]
    mid = (l + r) >> 1
    xl = xs[l]
    xm = xs[mid]
    left_b = (a * xl + b) < (na * xl + nb)
    mid_b = (a * xm + b) < (na * xm + nb)
    if mid_b
      ta[node] = a; tb[node] = b
      a = na; b = nb
    end
    return if l == r
    if left_b != mid_b
      node <<= 1
      r = mid
    else
      node = (node << 1) | 1
      l = mid + 1
    end
  end
end

query = lambda do |x|
  pos = xs.bsearch_index { |v| v >= x }
  node = 1
  l = 0
  r = m - 1
  ans = INF
  loop do
    if tb[node] != INF
      cand = ta[node] * x + tb[node]
      ans = cand if cand < ans
    end
    break if l == r
    mid = (l + r) >> 1
    if pos <= mid
      node <<= 1
      r = mid
    else
      node = (node << 1) | 1
      l = mid + 1
    end
  end
  ans
end

init_lines.each { |a, b| add_line.call(a, b) }
out = []
ops.each do |t, a, b|
  if t == 0
    add_line.call(a, b)
  else
    out << query.call(a).to_s
  end
end
puts out.join("\\n")`,
      },
    },
    {
      id: 'ch44-p3',
      tier: 'Boss',
      ratingRange: '2250–2500',
      title: 'Segment Add Get Min — Range-Restricted Linear Segments on Sparse Li Chao Tree',
      statement:
        'Maintain a set of **linear segments** `(l, r, a, b)` representing `y = a * x + b` active ONLY for integers `x` in `[l, r]` (inclusive `[l, r]`, or half-open `[l, r)` in Library Checker—here inclusive `[l, r]` for crystal clarity!). Start with `N` initial segments and process `Q` operations: `0 l r a b` (add segment on `[l, r]`), and `1 p` (output minimum value among all segments covering `p`, or `INF` if none covers `p`).',
      constraints: '1 <= N, Q <= 2 * 10^5, -10^9 <= l <= r <= 10^9, |p|, |a| <= 10^9, |b| <= 10^18',
      sampleInput: '2 4\n0 4 -1 5\n3 6 2 -3\n1 2\n1 3\n1 5\n1 7',
      sampleOutput: '3\n2\n7\nINF',
      hints: [
        'Decompose segment `[ql, qr]` into `O(log C)` fully-covered nodes `[l, r]` of the Sparse Li Chao Tree (`ql <= l && r <= qr`), and call `insertLine(node, l, r, nw)` inside ONLY those covered nodes!',
        'When descending during `addSegment(node, l, r, ql, qr, nw)`: if `[l, r]` partially overlaps `[ql, qr]`, lazily allocate `lc` / `rc` BEFORE recursing down—and notice `query(x)` remains IDENTICAL (`O(log C)`) because every ancestor node covering `x` stores the best full-span line inside that node!',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

// Segment Add Get Min via Sparse Li Chao Tree over [-1e9, 1e9]: O(log^2 C) add, O(log C) query
struct SegmentLiChao {
    static constexpr long long X_MIN = -1'000'000'000LL;
    static constexpr long long X_MAX =  1'000'000'000LL;
    static constexpr long long INF   =  4'000'000'000'000'000'000LL;

    struct Line {
        long long a = 0, b = INF;
        long long eval(long long x) const { return b == INF ? INF : a * x + b; }
    };
    struct Node { Line line; int lc = 0, rc = 0; };
    vector<Node> tree;

    SegmentLiChao(int reserveNodes = 4000000) {
        tree.reserve(reserveNodes);
        tree.push_back(Node{});
        tree.push_back(Node{});
    }

    int newNode() {
        tree.push_back(Node{});
        return (int)tree.size() - 1;
    }

    void insertIntoNode(int node, long long l, long long r, Line nw) {
        while (true) {
            if (tree[node].line.b == INF) { tree[node].line = nw; return; }
            long long mid = l + ((r - l) >> 1);
            bool leftB = nw.eval(l) < tree[node].line.eval(l);
            bool midB  = nw.eval(mid) < tree[node].line.eval(mid);
            if (midB) swap(tree[node].line, nw);
            if (l == r) return;
            if (leftB != midB) {
                if (!tree[node].lc) { int c = newNode(); tree[node].lc = c; }
                node = tree[node].lc;
                r = mid;
            } else {
                if (!tree[node].rc) { int c = newNode(); tree[node].rc = c; }
                node = tree[node].rc;
                l = mid + 1;
            }
        }
    }

    void addSegment(int node, long long l, long long r, long long ql, long long qr, Line nw) {
        if (ql > r || qr < l) return;
        if (ql <= l && r <= qr) {
            insertIntoNode(node, l, r, nw);
            return;
        }
        long long mid = l + ((r - l) >> 1);
        if (ql <= mid) {
            if (!tree[node].lc) { int c = newNode(); tree[node].lc = c; }
            addSegment(tree[node].lc, l, mid, ql, qr, nw);
        }
        if (qr > mid) {
            if (!tree[node].rc) { int c = newNode(); tree[node].rc = c; }
            addSegment(tree[node].rc, mid + 1, r, ql, qr, nw);
        }
    }

    void add(long long ql, long long qr, long long a, long long b) {
        addSegment(1, X_MIN, X_MAX, ql, qr, Line{a, b});
    }

    long long query(long long x) const {
        int node = 1;
        long long l = X_MIN, r = X_MAX, ans = INF;
        while (node) {
            ans = min(ans, tree[node].line.eval(x));
            if (l == r) break;
            long long mid = l + ((r - l) >> 1);
            if (x <= mid) { node = tree[node].lc; r = mid; }
            else { node = tree[node].rc; l = mid + 1; }
        }
        return ans;
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, q;
    if (!(cin >> n >> q)) return 0;
    SegmentLiChao lct((n + q) * 32 + 10);
    for (int i = 0; i < n; i++) {
        long long l, r, a, b;
        cin >> l >> r >> a >> b;
        lct.add(l, r, a, b);
    }
    while (q--) {
        int type;
        cin >> type;
        if (type == 0) {
            long long l, r, a, b;
            cin >> l >> r >> a >> b;
            lct.add(l, r, a, b);
        } else {
            long long x;
            cin >> x;
            long long res = lct.query(x);
            if (res == SegmentLiChao::INF) cout << "INF\\n";
            else cout << res << "\\n";
        }
    }
    return 0;
}`,
        rust: `use std::io::{self, Read};

const X_MIN: i64 = -1_000_000_000;
const X_MAX: i64 = 1_000_000_000;
const INF: i128 = i128::MAX / 4;

#[derive(Clone, Copy)]
struct Line {
    a: i64,
    b: i128,
}

impl Line {
    fn eval(&self, x: i64) -> i128 {
        if self.b == INF {
            INF
        } else {
            (self.a as i128) * (x as i128) + self.b
        }
    }
}

struct Node {
    line: Line,
    lc: usize,
    rc: usize,
}

struct SegLiChao {
    tree: Vec<Node>,
}

impl SegLiChao {
    fn new(cap: usize) -> Self {
        let mut tree = Vec::with_capacity(cap);
        let empty = Line { a: 0, b: INF };
        tree.push(Node { line: empty, lc: 0, rc: 0 });
        tree.push(Node { line: empty, lc: 0, rc: 0 });
        Self { tree }
    }

    fn alloc(&mut self) -> usize {
        let id = self.tree.len();
        self.tree.push(Node { line: Line { a: 0, b: INF }, lc: 0, rc: 0 });
        id
    }

    fn insert_node(&mut self, mut node: usize, mut l: i64, mut r: i64, mut nw: Line) {
        loop {
            if self.tree[node].line.b == INF {
                self.tree[node].line = nw;
                return;
            }
            let mid = l + ((r - l) >> 1);
            let left_b = nw.eval(l) < self.tree[node].line.eval(l);
            let mid_b = nw.eval(mid) < self.tree[node].line.eval(mid);
            if mid_b {
                std::mem::swap(&mut self.tree[node].line, &mut nw);
            }
            if l == r {
                return;
            }
            if left_b != mid_b {
                if self.tree[node].lc == 0 {
                    let c = self.alloc();
                    self.tree[node].lc = c;
                }
                node = self.tree[node].lc;
                r = mid;
            } else {
                if self.tree[node].rc == 0 {
                    let c = self.alloc();
                    self.tree[node].rc = c;
                }
                node = self.tree[node].rc;
                l = mid + 1;
            }
        }
    }

    fn add_seg(&mut self, node: usize, l: i64, r: i64, ql: i64, qr: i64, nw: Line) {
        if ql > r || qr < l {
            return;
        }
        if ql <= l && r <= qr {
            self.insert_node(node, l, r, nw);
            return;
        }
        let mid = l + ((r - l) >> 1);
        if ql <= mid {
            if self.tree[node].lc == 0 {
                let c = self.alloc();
                self.tree[node].lc = c;
            }
            let left = self.tree[node].lc;
            self.add_seg(left, l, mid, ql, qr, nw);
        }
        if qr > mid {
            if self.tree[node].rc == 0 {
                let c = self.alloc();
                self.tree[node].rc = c;
            }
            let right = self.tree[node].rc;
            self.add_seg(right, mid + 1, r, ql, qr, nw);
        }
    }

    fn query(&self, x: i64) -> i128 {
        let mut node = 1usize;
        let mut l = X_MIN;
        let mut r = X_MAX;
        let mut ans = INF;
        while node != 0 {
            ans = ans.min(self.tree[node].line.eval(x));
            if l == r {
                break;
            }
            let mid = l + ((r - l) >> 1);
            if x <= mid {
                node = self.tree[node].lc;
                r = mid;
            } else {
                node = self.tree[node].rc;
                l = mid + 1;
            }
        }
        ans
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

    let mut lct = SegLiChao::new((n + q) * 32 + 10);
    for _ in 0..n {
        let l: i64 = it.next().unwrap().parse().unwrap();
        let r: i64 = it.next().unwrap().parse().unwrap();
        let a: i64 = it.next().unwrap().parse().unwrap();
        let b: i64 = it.next().unwrap().parse().unwrap();
        lct.add_seg(1, X_MIN, X_MAX, l, r, Line { a, b: b as i128 });
    }

    let mut out = String::new();
    for _ in 0..q {
        let typ: i32 = it.next().unwrap().parse().unwrap();
        if typ == 0 {
            let l: i64 = it.next().unwrap().parse().unwrap();
            let r: i64 = it.next().unwrap().parse().unwrap();
            let a: i64 = it.next().unwrap().parse().unwrap();
            let b: i64 = it.next().unwrap().parse().unwrap();
            lct.add_seg(1, X_MIN, X_MAX, l, r, Line { a, b: b as i128 });
        } else {
            let x: i64 = it.next().unwrap().parse().unwrap();
            let res = lct.query(x);
            if res == INF {
                out.push_str("INF\\n");
            } else {
                out.push_str(&format!("{}\\n", res));
            }
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
            long sign = 1;
            if (c == '-') { sign = -1; c = readByte(); }
            long res = 0;
            while (c > ' ') { res = res * 10 + (c - '0'); c = readByte(); }
            return res * sign;
        }
    }

    static final long X_MIN = -1_000_000_000L;
    static final long X_MAX = 1_000_000_000L;
    static final long INF = 4_000_000_000_000_000_000L;

    static long[] lm, lb;
    static int[] lc, rc;
    static int ptr = 1;

    static int alloc() {
        if (ptr + 2 >= lm.length) {
            int nCap = lm.length * 2;
            lm = Arrays.copyOf(lm, nCap);
            lb = Arrays.copyOf(lb, nCap);
            lc = Arrays.copyOf(lc, nCap);
            rc = Arrays.copyOf(rc, nCap);
        }
        int id = ++ptr;
        lb[id] = INF;
        return id;
    }

    static long eval(long a, long b, long x) {
        return b == INF ? INF : a * x + b;
    }

    static void insertNode(int node, long l, long r, long a, long b) {
        while (true) {
            if (lb[node] == INF) { lm[node] = a; lb[node] = b; return; }
            long mid = l + ((r - l) >> 1);
            boolean leftB = eval(a, b, l) < eval(lm[node], lb[node], l);
            boolean midB = eval(a, b, mid) < eval(lm[node], lb[node], mid);
            if (midB) {
                long oa = lm[node], ob = lb[node];
                lm[node] = a; lb[node] = b;
                a = oa; b = ob;
            }
            if (l == r) return;
            if (leftB != midB) {
                if (lc[node] == 0) lc[node] = alloc();
                node = lc[node]; r = mid;
            } else {
                if (rc[node] == 0) rc[node] = alloc();
                node = rc[node]; l = mid + 1;
            }
        }
    }

    static void addSegment(int node, long l, long r, long ql, long qr, long a, long b) {
        if (ql > r || qr < l) return;
        if (ql <= l && r <= qr) { insertNode(node, l, r, a, b); return; }
        long mid = l + ((r - l) >> 1);
        if (ql <= mid) {
            if (lc[node] == 0) lc[node] = alloc();
            addSegment(lc[node], l, mid, ql, qr, a, b);
        }
        if (qr > mid) {
            if (rc[node] == 0) rc[node] = alloc();
            addSegment(rc[node], mid + 1, r, ql, qr, a, b);
        }
    }

    static long query(long x) {
        int node = 1;
        long l = X_MIN, r = X_MAX, ans = INF;
        while (node != 0) {
            long val = eval(lm[node], lb[node], x);
            if (val < ans) ans = val;
            if (l == r) break;
            long mid = l + ((r - l) >> 1);
            if (x <= mid) { node = lc[node]; r = mid; }
            else { node = rc[node]; l = mid + 1; }
        }
        return ans;
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        long nIn = fs.nextLong();
        if (nIn == Long.MIN_VALUE) return;
        int n = (int) nIn, q = (int) fs.nextLong();

        int cap = Math.max(32, (n + q) * 16);
        lm = new long[cap];
        lb = new long[cap];
        lc = new int[cap];
        rc = new int[cap];
        lb[0] = INF; lb[1] = INF;

        for (int i = 0; i < n; i++) {
            addSegment(1, X_MIN, X_MAX, fs.nextLong(), fs.nextLong(), fs.nextLong(), fs.nextLong());
        }
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < q; i++) {
            if (fs.nextLong() == 0) {
                addSegment(1, X_MIN, X_MAX, fs.nextLong(), fs.nextLong(), fs.nextLong(), fs.nextLong());
            } else {
                long res = query(fs.nextLong());
                sb.append(res == INF ? "INF" : res).append('\\n');
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
    q = int(next(it))

    X_MIN = -10**9
    X_MAX = 10**9
    INF = 10**30

    lm = [0, 0]
    lb = [INF, INF]
    lc = [0, 0]
    rc = [0, 0]

    def alloc() -> int:
        idx = len(lb)
        lm.append(0)
        lb.append(INF)
        lc.append(0)
        rc.append(0)
        return idx

    def insert_node(node: int, l: int, r: int, a: int, b: int) -> None:
        while True:
            nb = lb[node]
            if nb == INF:
                lm[node] = a
                lb[node] = b
                return
            na = lm[node]
            mid = (l + r) >> 1
            left_b = (a * l + b) < (na * l + nb)
            mid_b = (a * mid + b) < (na * mid + nb)
            if mid_b:
                lm[node], lb[node] = a, b
                a, b = na, nb
            if l == r:
                return
            if left_b != mid_b:
                if lc[node] == 0:
                    lc[node] = alloc()
                node = lc[node]
                r = mid
            else:
                if rc[node] == 0:
                    rc[node] = alloc()
                node = rc[node]
                l = mid + 1

    def add_seg(ql: int, qr: int, a: int, b: int) -> None:
        stk = [(1, X_MIN, X_MAX)]
        while stk:
            node, l, r = stk.pop()
            if ql <= l and r <= qr:
                insert_node(node, l, r, a, b)
                continue
            mid = (l + r) >> 1
            if ql <= mid:
                if lc[node] == 0:
                    lc[node] = alloc()
                stk.append((lc[node], l, mid))
            if qr > mid:
                if rc[node] == 0:
                    rc[node] = alloc()
                stk.append((rc[node], mid + 1, r))

    def query(x: int) -> int:
        node = 1
        l, r = X_MIN, X_MAX
        ans = INF
        while node:
            if lb[node] != INF:
                cand = lm[node] * x + lb[node]
                if cand < ans:
                    ans = cand
            if l == r:
                break
            mid = (l + r) >> 1
            if x <= mid:
                node = lc[node]
                r = mid
            else:
                node = rc[node]
                l = mid + 1
        return ans

    for _ in range(n):
        add_seg(int(next(it)), int(next(it)), int(next(it)), int(next(it)))

    out = []
    for _ in range(q):
        if int(next(it)) == 0:
            add_seg(int(next(it)), int(next(it)), int(next(it)), int(next(it)))
        else:
            res = query(int(next(it)))
            out.append("INF" if res == INF else str(res))
    sys.stdout.write("\\n".join(out) + "\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
idx = 0
n = tokens[idx].to_i; idx += 1
q = tokens[idx].to_i; idx += 1

X_MIN = -1_000_000_000
X_MAX =  1_000_000_000
INF = 10**30

lm = [0, 0]
lb = [INF, INF]
lc = [0, 0]
rc = [0, 0]

alloc = lambda do
  id = lb.length
  lm << 0; lb << INF; lc << 0; rc << 0
  id
end

insert_node = lambda do |node, l, r, a, b|
  loop do
    nb = lb[node]
    if nb == INF
      lm[node] = a; lb[node] = b
      return
    end
    na = lm[node]
    mid = (l + r) >> 1
    left_b = (a * l + b) < (na * l + nb)
    mid_b = (a * mid + b) < (na * mid + nb)
    if mid_b
      lm[node] = a; lb[node] = b
      a = na; b = nb
    end
    return if l == r
    if left_b != mid_b
      lc[node] = alloc.call if lc[node] == 0
      node = lc[node]; r = mid
    else
      rc[node] = alloc.call if rc[node] == 0
      node = rc[node]; l = mid + 1
    end
  end
end

add_seg = lambda do |ql, qr, a, b|
  stk = [[1, X_MIN, X_MAX]]
  until stk.empty?
    node, l, r = stk.pop
    if ql <= l && r <= qr
      insert_node.call(node, l, r, a, b)
      next
    end
    mid = (l + r) >> 1
    if ql <= mid
      lc[node] = alloc.call if lc[node] == 0
      stk << [lc[node], l, mid]
    end
    if qr > mid
      rc[node] = alloc.call if rc[node] == 0
      stk << [rc[node], mid + 1, r]
    end
  end
end

query = lambda do |x|
  node = 1
  l = X_MIN
  r = X_MAX
  ans = INF
  while node != 0
    if lb[node] != INF
      cand = lm[node] * x + lb[node]
      ans = cand if cand < ans
    end
    break if l == r
    mid = (l + r) >> 1
    if x <= mid
      node = lc[node]; r = mid
    else
      node = rc[node]; l = mid + 1
    end
  end
  ans
end

n.times do
  l = tokens[idx].to_i; r = tokens[idx + 1].to_i; a = tokens[idx + 2].to_i; b = tokens[idx + 3].to_i; idx += 4
  add_seg.call(l, r, a, b)
end

out = []
q.times do
  t = tokens[idx].to_i; idx += 1
  if t == 0
    l = tokens[idx].to_i; r = tokens[idx + 1].to_i; a = tokens[idx + 2].to_i; b = tokens[idx + 3].to_i; idx += 4
    add_seg.call(l, r, a, b)
  else
    x = tokens[idx].to_i; idx += 1
    res = query.call(x)
    out << (res == INF ? "INF" : res.to_s)
  end
end
puts out.join("\\n")`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'CSES',
      title: 'Monster Game I & Monster Game II (Subtask CHT vs Li Chao)',
      difficulty: 'Hard',
      url: 'https://cses.fi/problemset/task/2084',
      patternNote: 'Monster Game I tests O(N) monotonic deque CHT; Monster Game II drops monotonicity requiring Li Chao Tree!',
    },
    {
      platform: 'Codeforces',
      title: 'Kalila and Dimna in the Logging Industry (CF 319C)',
      difficulty: '1900',
      url: 'https://codeforces.com/problemset/problem/319/C',
      patternNote: 'Classic Convex Hull Trick DP optimization eliminating O(N^2) inner loop.',
    },
    {
      platform: 'AtCoder',
      title: 'Educational DP Z - Frog 3 (Convex Hull Trick / Li Chao)',
      difficulty: '2000',
      url: 'https://atcoder.jp/contests/dp/tasks/dp_z',
      patternNote: 'Expand `(h_i - h_j)^2 + C` into `-2 h_j * h_i + (dp[j] + h_j^2)` linear envelope form.',
    },
    {
      platform: 'CodeChef',
      title: 'CYCLRACE / Dynamic Linear Functions',
      difficulty: 'Hard',
      url: 'https://www.codechef.com/problems/CYCLRACE',
      patternNote: 'Online line insertions and max-distance queries over time.',
    },
    {
      platform: 'HackerRank',
      title: 'Guardians of the Lunatics (DP Divide & Conquer vs CHT)',
      difficulty: 'Hard',
      url: 'https://www.hackerrank.com/contests/ioi-2014-practice-contest-2/challenges/guardians-lunatics-ioi14',
      patternNote: 'Compare linear CHT envelopes against D&C DP optimization.',
    },
    {
      platform: 'NeetCode 150',
      title: 'Best Time to Buy and Sell Stock / Partition Array DP',
      difficulty: 'Hard Extension',
      url: 'https://neetcode.io/roadmap',
      patternNote: 'Quadratic-cost DP recurrences `dp[i] = min(dp[j] + f(j)*g(i))` reduce via CHT / Li Chao.',
    },
  ],
  interviewNotes: [
    'Know the **3-tier selection rule**: (1) Both slopes `m` AND queries `x` are monotonic -> `O(N)` Deque CHT; (2) Only slopes OR only queries are arbitrary -> `O(N log C)` **Li Chao Tree**; (3) Functions only exist on intervals `[l, r]` or on tree paths (HLD + Rollback) -> **Segment-Restricted / Persistent Li Chao Tree**!',
    'Explain why Li Chao Tree guarantees correctness without storing the full convex hull: two distinct lines cross at most once, so whichever line loses at `mid` can beat the winner on at most ONE half—making a single recursive descent sufficient.',
    'Always remember the negative-coordinate `mid` bug (`(-1 + 0) / 2 == 0` in C++/Java/Rust vs `>> 1 == -1`) when writing Sparse Li Chao Trees over negative domains.',
  ],
  projectBlueprint: {
    title: 'Dynamic Cloud Compute Pricing & Optimal Tier Selector',
    tagline:
      'Real-time cloud instance cost optimizer: each pricing tier or reservation contract is a linear cost function `Cost(cpu_hours) = hourlyRate * x + upfrontFee` active over `[minHours, maxHours]`—query the cheapest plan in `O(log C)`.',
    stackSummary: 'C++20 Segment-Restricted Sparse Li Chao Engine, Envelope Cost Evaluator',
    asciiDiagram: `Compute Contract Tiers:
  On-Demand:  y = 12*x + 0       [0 .. 1e9]
  1-Yr Spot:  y =  7*x + 500     [50 .. 1e9]
  3-Yr Dedic: y =  4*x + 2500    [400 .. 1e9]

Li Chao Query(x = 120 hrs) -> min(1440, 1340, out-of-range) = $1,340 (1-Yr Spot)!`,
    milestones: [
      {
        id: 'm1',
        title: '1. Sparse Dynamic Node Arena',
        detail: 'Support `[-10^9, 10^9]` domains with arithmetic shift midpoint `l + ((r - l) >> 1)`.',
      },
      {
        id: 'm2',
        title: '2. Range-Restricted Contract Segments',
        detail: 'Decompose `[minHours, maxHours]` into canonical Li Chao subtrees.',
      },
      {
        id: 'm3',
        title: '3. Plan ID Tracking & Query Auditor',
        detail: 'Attach `tierId` alongside `(m, b)` to return both optimal price AND winning tier name.',
      },
    ],
    starterCode: `#include <bits/stdc++.h>
using namespace std;

// Dynamic Cloud Compute Pricing & Optimal Tier Selector (Segment Li Chao Tree)
struct PlanLine {
    long long rate = 0, upfront = LLONG_MAX / 4;
    string name = "NONE";
    long long eval(long long hrs) const {
        return upfront >= LLONG_MAX / 8 ? LLONG_MAX / 4 : rate * hrs + upfront;
    }
};

class CloudPricingEngine {
    static constexpr long long H_MIN = 0, H_MAX = 1'000'000'000LL;
    struct Node { PlanLine best; int lc = 0, rc = 0; };
    vector<Node> tree;

    int newNode() { tree.push_back(Node{}); return (int)tree.size() - 1; }

    void insertInto(int node, long long l, long long r, PlanLine nw) {
        while (true) {
            if (tree[node].best.name == "NONE") { tree[node].best = nw; return; }
            long long mid = l + ((r - l) >> 1);
            bool leftB = nw.eval(l) < tree[node].best.eval(l);
            bool midB  = nw.eval(mid) < tree[node].best.eval(mid);
            if (midB) swap(tree[node].best, nw);
            if (l == r) return;
            if (leftB != midB) {
                if (!tree[node].lc) { int c = newNode(); tree[node].lc = c; }
                node = tree[node].lc; r = mid;
            } else {
                if (!tree[node].rc) { int c = newNode(); tree[node].rc = c; }
                node = tree[node].rc; l = mid + 1;
            }
        }
    }

    void addSeg(int node, long long l, long long r, long long ql, long long qr, const PlanLine& nw) {
        if (ql > r || qr < l) return;
        if (ql <= l && r <= qr) { insertInto(node, l, r, nw); return; }
        long long mid = l + ((r - l) >> 1);
        if (ql <= mid) {
            if (!tree[node].lc) { int c = newNode(); tree[node].lc = c; }
            addSeg(tree[node].lc, l, mid, ql, qr, nw);
        }
        if (qr > mid) {
            if (!tree[node].rc) { int c = newNode(); tree[node].rc = c; }
            addSeg(tree[node].rc, mid + 1, r, ql, qr, nw);
        }
    }

public:
    CloudPricingEngine() { tree.resize(2); }

    void registerTier(const string& name, long long minHrs, long long maxHrs, long long hourlyRate, long long upfront) {
        addSeg(1, H_MIN, H_MAX, minHrs, maxHrs, PlanLine{hourlyRate, upfront, name});
    }

    pair<long long, string> bestPlanFor(long long hrs) const {
        int node = 1;
        long long l = H_MIN, r = H_MAX, bestCost = LLONG_MAX / 4;
        string bestName = "NONE";
        while (node) {
            long long c = tree[node].best.eval(hrs);
            if (c < bestCost) { bestCost = c; bestName = tree[node].best.name; }
            if (l == r) break;
            long long mid = l + ((r - l) >> 1);
            if (hrs <= mid) { node = tree[node].lc; r = mid; }
            else { node = tree[node].rc; l = mid + 1; }
        }
        return {bestCost, bestName};
    }
};

int main() {
    CloudPricingEngine engine;
    engine.registerTier("On-Demand", 0, 1000000, 12, 0);
    engine.registerTier("1-Yr Reserved", 50, 1000000, 7, 500);
    engine.registerTier("3-Yr Dedicated", 400, 1000000, 4, 2500);

    for (long long hrs : {30LL, 120LL, 800LL}) {
        auto [cost, tier] = engine.bestPlanFor(hrs);
        cout << hrs << " CPU-hrs -> Optimal Plan: " << tier << " ($" << cost << ")\\n";
    }
    return 0;
}`,
  },
};
