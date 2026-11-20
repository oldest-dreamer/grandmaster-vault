import type { TheoryChapter } from '../../types/vault';

export const CH19_LAZY_SEGTREE: TheoryChapter = {
  slug: 'lazy-propagation-segment-tree',
  topicId: 'ds-08',
  title: 'Segment Tree with Lazy Propagation',
  domain: 'Data Structures',
  ratingTier: '1600–1900',
  usacoDivision: 'Platinum',
  subtitle:
    'Execute range additions, range assignments, affine transforms, and polynomial updates alongside range aggregate queries in O(log N) by deferring subtree pushes in lazy tags.',
  analogyTitle: 'The Apartment Wing Bulletin Board Sticky-Note Analogy',
  analogyBody:
    'Imagine managing an 8-room apartment corridor divided recursively into wings of size 8, 4, 2, and 1. When someone asks to grant every resident in rooms [0..5] a +5 bonus, walking into every individual room would take O(N). Instead, whenever a wing lies COMPLETELY inside [0..5] (like wing [0..3] and sub-wing [4..5]), you slap ONE sticky note "+5 for everyone inside" on that wing’s bulletin board and immediately add `5 * wingSize` to its cached total! You only peel that sticky note off and copy "+5" down to its left and right sub-wings (`push()`) later when a split query or update actually opens that wing!',
  prerequisites: [
    {
      slug: 'segment-tree-point-range',
      title: 'Iterative & Recursive Segment Trees',
    },
  ],
  traceTitle: 'Interactive 8-Element Lazy Segment Tree Update & Pushdown Trace',
  traceSubtitle:
    'Step through an 8-element tree A[0..7], apply rangeAdd(0, 5, +3), and watch node [0..3] lazily defer pushes until querySum(2, 5) splits it.',
  allowDynamicGraphEdit: false,
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Step 1: Build 8-Element Segment Tree (Zero Lazy Tags)',
      explanation:
        'Base leaves A[0..7] = [2, 1, 4, 3, 5, 2, 6, 1] (total sum = 24). Internal nodes: [0..3]=10, [4..7]=14, [0..1]=3, [2..3]=7, [4..5]=7, [6..7]=7.',
      mode: 'array',
      arrays: [
        {
          name: 'Leaves A[0..7]',
          cells: [
            { index: 0, value: 2, highlight: 'neutral' },
            { index: 1, value: 1, highlight: 'neutral' },
            { index: 2, value: 4, highlight: 'neutral' },
            { index: 3, value: 3, highlight: 'neutral' },
            { index: 4, value: 5, highlight: 'neutral' },
            { index: 5, value: 2, highlight: 'neutral' },
            { index: 6, value: 6, highlight: 'neutral' },
            { index: 7, value: 1, highlight: 'neutral' },
          ],
        },
        {
          name: 'Key Tree Nodes (sum / lazy)',
          cells: [
            { index: 1, value: '24 (lz=0)', label: '[0..7]', highlight: 'neutral' },
            { index: 2, value: '10 (lz=0)', label: '[0..3]', highlight: 'neutral' },
            { index: 3, value: '14 (lz=0)', label: '[4..7]', highlight: 'neutral' },
            { index: 4, value: '3 (lz=0)', label: '[0..1]', highlight: 'neutral' },
            { index: 5, value: '7 (lz=0)', label: '[2..3]', highlight: 'neutral' },
            { index: 6, value: '7 (lz=0)', label: '[4..5]', highlight: 'neutral' },
            { index: 7, value: '7 (lz=0)', label: '[6..7]', highlight: 'neutral' },
          ],
        },
      ],
      variables: { Operation: 'Build(8)', RootSum: 24, PendingLazyTags: 0 },
    },
    {
      stepNumber: 2,
      title: 'Step 2: Range Update add(0, 5, +3) Lands Lazily on [0..3] & [4..5]',
      explanation:
        'Root [0..7] splits into [0..3] (completely inside -> sum += 4*3 = 22, lazy=+3, STOP!) and [4..7] -> splits to [4..5] (sum += 2*3 = 13, lazy=+3, STOP!). Root pulls up 22 + 14? Wait: [4..7] pulls 13 + 7 = 20, Root pulls 22 + 20 = 42.',
      mode: 'array',
      arrays: [
        {
          name: 'Tree Nodes After rangeAdd(0, 5, +3)',
          cells: [
            { index: 1, value: '42 (lz=0)', label: '[0..7]', highlight: 'updated' },
            { index: 2, value: '22 (lz=+3)', label: '[0..3]', highlight: 'active' },
            { index: 3, value: '20 (lz=0)', label: '[4..7]', highlight: 'updated' },
            { index: 4, value: '3 (stale)', label: '[0..1]', highlight: 'neutral' },
            { index: 5, value: '7 (stale)', label: '[2..3]', highlight: 'neutral' },
            { index: 6, value: '13 (lz=+3)', label: '[4..5]', highlight: 'active' },
            { index: 7, value: '7 (lz=0)', label: '[6..7]', highlight: 'neutral' },
          ],
        },
      ],
      variables: { Update: '[0..5] += 3', NodesTouched: 5, LeavesVisited: 0 },
    },
    {
      stepNumber: 3,
      title: 'Step 3: Query Sum [2..5] Forces Pushdown From [0..3] to Children',
      explanation:
        'Query [2..5] overlaps [0..3] partially! Before recursing into [0..1] and [2..3], node 2 peels off lz=+3: [0..1] becomes 3+2*3=9 (lz=+3), [2..3] becomes 7+2*3=13 (lz=+3), node 2 resets lz=0.',
      mode: 'array',
      arrays: [
        {
          name: 'Tree Nodes During Pushdown at [0..3]',
          cells: [
            { index: 1, value: '42 (lz=0)', label: '[0..7]', highlight: 'neutral' },
            { index: 2, value: '22 (lz=0)', label: 'pushed!', highlight: 'updated' },
            { index: 3, value: '20 (lz=0)', label: '[4..7]', highlight: 'neutral' },
            { index: 4, value: '9 (lz=+3)', label: '[0..1]', highlight: 'window' },
            { index: 5, value: '13 (lz=+3)', label: '[2..3]', highlight: 'active' },
            { index: 6, value: '13 (lz=+3)', label: '[4..5]', highlight: 'active' },
            { index: 7, value: '7 (lz=0)', label: '[6..7]', highlight: 'neutral' },
          ],
        },
      ],
      variables: { PushedNode: '[0..3]', 'LeftChild[0..1]': '9 (lz=+3)', 'RightChild[2..3]': '13 (lz=+3)' },
    },
    {
      stepNumber: 4,
      title: 'Step 4: Accumulate Exact Covered Wings [2..3] + [4..5] = 26',
      explanation:
        'Query [2..5] finds [2..3] (sum=13) and [4..5] (sum=13) completely inside [2..5] without even descending to individual leaves! Total = 13 + 13 = 26.',
      mode: 'array',
      arrays: [
        {
          name: 'Effective Leaves A[0..7] (Virtual)',
          cells: [
            { index: 0, value: 5, highlight: 'neutral' },
            { index: 1, value: 1, label: 'cached', highlight: 'neutral' },
            { index: 2, value: 7, label: 'in [2..3]', highlight: 'window' },
            { index: 3, value: 6, label: 'in [2..3]', highlight: 'window' },
            { index: 4, value: 8, label: 'in [4..5]', highlight: 'window' },
            { index: 5, value: 5, label: 'in [4..5]', highlight: 'window' },
            { index: 6, value: 6, highlight: 'neutral' },
            { index: 7, value: 1, highlight: 'neutral' },
          ],
        },
      ],
      variables: { Query: 'sum(2, 5)', CoveredNodes: '[2..3] + [4..5]', Result: 26 },
    },
  ],
  reductionClues: [
    {
      clue: '"Support Range Add [L..R] += v AND Range Sum / Range Min / Range Max in O(log N)"',
      translation: 'Standard Lazy Segment Tree storing `(sum, addTag)` or `(maxVal, addTag)`.',
    },
    {
      clue: '"Combine BOTH Range Set (A[i] = x) AND Range Add (A[i] += y) OR Range Multiply (A[i] *= m)"',
      translation: 'Unify into ONE Affine Lazy Tag `(mul, add)` acting as `x -> mul * x + add`: Range Set = `(0, x)`, Range Add = `(1, y)`, composition `(m2, a2) o (m1, a1) = (m2*m1, m2*a1 + a2)`.',
    },
    {
      clue: '"Add an arithmetic progression a + d*(i - L) (or quadratic polynomial) across [L..R]"',
      translation: 'Decompose into linear basis tags `(c0, c1, c2)` multiplying precomputed power sums `sum i^0, sum i^1, sum i^2` over `[l..r]`, which combine additively!',
    },
    {
      clue: '"Beat-style / Cyclic interval updates across [L..R] where L > R wraps around N"',
      translation: 'Split wrap-around query `[L..R]` (`L > R`) into TWO linear operations `[L..N-1]` and `[0..R]` cleanly.',
    },
  ],
  timeComplexity: 'O(N) build, O(log N) per range update and range query',
  spaceComplexity: 'O(4N)',
  pitfalls: [
    {
      type: 'WA',
      title: 'Wrong Composition Order When Combining Range Set & Range Add Tags',
      detail:
        'If a node has a pending `setTag` AND receives `add(v)`, `setTag` absorbs `add(v)` (`setVal += v`). Conversely, receiving `set(x)` OVERWRITES and clears any pending `addTag = 0`! Better yet, use unified affine `(mul, add)` tags.',
    },
    {
      type: 'RE',
      title: 'Calling `push(node)` on a Leaf Node Without Checking `l == r`',
      detail:
        'Accessing `node * 2` and `node * 2 + 1` at a leaf exceeds or corrupts `4 * N` bounds if `l == r` is not guarded. Always return early or only call `push` when `l < r`.',
    },
    {
      type: 'WA',
      title: 'Forgetting to Pull Up (`tr[node] = tr[2*node] + tr[2*node+1]`) After Recursion',
      detail:
        'Updating child ranges mutates child sums/mins; forgetting to recompute the parent right after `update()` leaves internal nodes stale!',
    },
    {
      type: 'WA',
      title: '64-Bit Overflow in `lazy * len` When Range Sums Reach 10^14',
      detail:
        'Always type `tr[]`, `lazy[]`, and `len` multiplication using 64-bit (`long long` / `i64` / `long`) when values are up to 10^9.',
    },
  ],
  implementations: {
    cpp20: `#include <bits/stdc++.h>
using namespace std;

struct LazySegTree {
    int n;
    vector<long long> tr, lz;

    explicit LazySegTree(const vector<long long>& a) : n((int)a.size()), tr(4 * n + 4, 0), lz(4 * n + 4, 0) {
        build(1, 0, n - 1, a);
    }

    void build(int u, int l, int r, const vector<long long>& a) {
        if (l == r) { tr[u] = a[l]; return; }
        int m = (l + r) >> 1;
        build(u << 1, l, m, a);
        build(u << 1 | 1, m + 1, r, a);
        tr[u] = tr[u << 1] + tr[u << 1 | 1];
    }

    void apply(int u, int l, int r, long long v) {
        tr[u] += v * (r - l + 1);
        lz[u] += v;
    }

    void push(int u, int l, int r) {
        if (lz[u] != 0 && l < r) {
            int m = (l + r) >> 1;
            apply(u << 1, l, m, lz[u]);
            apply(u << 1 | 1, m + 1, r, lz[u]);
            lz[u] = 0;
        }
    }

    void update(int u, int l, int r, int ql, int qr, long long v) {
        if (ql <= l && r <= qr) { apply(u, l, r, v); return; }
        push(u, l, r);
        int m = (l + r) >> 1;
        if (ql <= m) update(u << 1, l, m, ql, qr, v);
        if (qr > m) update(u << 1 | 1, m + 1, r, ql, qr, v);
        tr[u] = tr[u << 1] + tr[u << 1 | 1];
    }

    long long query(int u, int l, int r, int ql, int qr) {
        if (ql <= l && r <= qr) return tr[u];
        push(u, l, r);
        int m = (l + r) >> 1;
        long long res = 0;
        if (ql <= m) res += query(u << 1, l, m, ql, qr);
        if (qr > m) res += query(u << 1 | 1, m + 1, r, ql, qr);
        return res;
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, q;
    if (!(cin >> n >> q)) return 0;
    vector<long long> a(n);
    for (int i = 0; i < n; ++i) cin >> a[i];

    LazySegTree seg(a);
    while (q--) {
        int tp, l, r;
        cin >> tp >> l >> r;
        if (tp == 1) {
            long long v; cin >> v;
            seg.update(1, 0, n - 1, l - 1, r - 1, v);
        } else {
            cout << seg.query(1, 0, n - 1, l - 1, r - 1) << '\\n';
        }
    }
    return 0;
}`,
    rust: `use std::io::{self, Read};

struct LazySegTree {
    n: usize,
    tr: Vec<i64>,
    lz: Vec<i64>,
}

impl LazySegTree {
    fn new(a: &[i64]) -> Self {
        let n = a.len();
        let mut st = Self { n, tr: vec![0; 4 * n + 4], lz: vec![0; 4 * n + 4] };
        if n > 0 {
            st.build(1, 0, n - 1, a);
        }
        st
    }

    fn build(&mut self, u: usize, l: usize, r: usize, a: &[i64]) {
        if l == r {
            self.tr[u] = a[l];
            return;
        }
        let m = (l + r) >> 1;
        self.build(u << 1, l, m, a);
        self.build(u << 1 | 1, m + 1, r, a);
        self.tr[u] = self.tr[u << 1] + self.tr[u << 1 | 1];
    }

    fn apply(&mut self, u: usize, l: usize, r: usize, v: i64) {
        self.tr[u] += v * (r - l + 1) as i64;
        self.lz[u] += v;
    }

    fn push(&mut self, u: usize, l: usize, r: usize) {
        if self.lz[u] != 0 && l < r {
            let v = self.lz[u];
            let m = (l + r) >> 1;
            self.apply(u << 1, l, m, v);
            self.apply(u << 1 | 1, m + 1, r, v);
            self.lz[u] = 0;
        }
    }

    fn update(&mut self, u: usize, l: usize, r: usize, ql: usize, qr: usize, v: i64) {
        if ql <= l && r <= qr {
            self.apply(u, l, r, v);
            return;
        }
        self.push(u, l, r);
        let m = (l + r) >> 1;
        if ql <= m { self.update(u << 1, l, m, ql, qr, v); }
        if qr > m { self.update(u << 1 | 1, m + 1, r, ql, qr, v); }
        self.tr[u] = self.tr[u << 1] + self.tr[u << 1 | 1];
    }

    fn query(&mut self, u: usize, l: usize, r: usize, ql: usize, qr: usize) -> i64 {
        if ql <= l && r <= qr {
            return self.tr[u];
        }
        self.push(u, l, r);
        let m = (l + r) >> 1;
        let mut res = 0;
        if ql <= m { res += self.query(u << 1, l, m, ql, qr); }
        if qr > m { res += self.query(u << 1 | 1, m + 1, r, ql, qr); }
        res
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
    let a: Vec<i64> = (0..n).map(|_| it.next().unwrap().parse().unwrap()).collect();

    let mut seg = LazySegTree::new(&a);
    let mut out = String::new();
    for _ in 0..q {
        let tp: usize = it.next().unwrap().parse().unwrap();
        let l: usize = it.next().unwrap().parse().unwrap();
        let r: usize = it.next().unwrap().parse().unwrap();
        if tp == 1 {
            let v: i64 = it.next().unwrap().parse().unwrap();
            seg.update(1, 0, n - 1, l - 1, r - 1, v);
        } else {
            out.push_str(&format!("{}\\n", seg.query(1, 0, n - 1, l - 1, r - 1)));
        }
    }
    print!("{}", out);
}`,
    java21: `import java.io.IOException;
import java.io.InputStream;

public class Main {
    static class FastScanner {
        private final InputStream in = System.in;
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;

        private int readByte() throws IOException {
            if (ptr >= len) {
                len = in.read(buf);
                ptr = 0;
                if (len <= 0) return -1;
            }
            return buf[ptr++];
        }

        long nextLong() throws IOException {
            int c;
            while ((c = readByte()) <= 32) {
                if (c == -1) return Long.MIN_VALUE;
            }
            long sign = 1;
            if (c == '-') { sign = -1; c = readByte(); }
            long res = 0;
            while (c > 32) {
                res = res * 10 + (c - '0');
                c = readByte();
            }
            return res * sign;
        }

        int nextInt() throws IOException { return (int) nextLong(); }
    }

    static long[] tr, lz, arr;

    static void build(int u, int l, int r) {
        if (l == r) { tr[u] = arr[l]; return; }
        int m = (l + r) >>> 1;
        build(u << 1, l, m);
        build(u << 1 | 1, m + 1, r);
        tr[u] = tr[u << 1] + tr[u << 1 | 1];
    }

    static void apply(int u, int l, int r, long v) {
        tr[u] += v * (r - l + 1L);
        lz[u] += v;
    }

    static void push(int u, int l, int r) {
        if (lz[u] != 0 && l < r) {
            int m = (l + r) >>> 1;
            apply(u << 1, l, m, lz[u]);
            apply(u << 1 | 1, m + 1, r, lz[u]);
            lz[u] = 0;
        }
    }

    static void update(int u, int l, int r, int ql, int qr, long v) {
        if (ql <= l && r <= qr) { apply(u, l, r, v); return; }
        push(u, l, r);
        int m = (l + r) >>> 1;
        if (ql <= m) update(u << 1, l, m, ql, qr, v);
        if (qr > m) update(u << 1 | 1, m + 1, r, ql, qr, v);
        tr[u] = tr[u << 1] + tr[u << 1 | 1];
    }

    static long query(int u, int l, int r, int ql, int qr) {
        if (ql <= l && r <= qr) return tr[u];
        push(u, l, r);
        int m = (l + r) >>> 1;
        long res = 0;
        if (ql <= m) res += query(u << 1, l, m, ql, qr);
        if (qr > m) res += query(u << 1 | 1, m + 1, r, ql, qr);
        return res;
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        long f = fs.nextLong();
        if (f == Long.MIN_VALUE) return;
        int n = (int) f, q = fs.nextInt();
        arr = new long[n];
        for (int i = 0; i < n; i++) arr[i] = fs.nextLong();
        tr = new long[4 * n + 4];
        lz = new long[4 * n + 4];
        build(1, 0, n - 1);

        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < q; i++) {
            int tp = fs.nextInt(), l = fs.nextInt() - 1, r = fs.nextInt() - 1;
            if (tp == 1) update(1, 0, n - 1, l, r, fs.nextLong());
            else sb.append(query(1, 0, n - 1, l, r)).append('\\n');
        }
        System.out.print(sb);
    }
}`,
    python3: `import sys

sys.setrecursionlimit(200000)

class LazySegTree:
    def __init__(self, a):
        self.n = len(a)
        self.tr = [0] * (4 * self.n + 4)
        self.lz = [0] * (4 * self.n + 4)
        if self.n:
            self._build(1, 0, self.n - 1, a)

    def _build(self, u, l, r, a):
        if l == r:
            self.tr[u] = a[l]
            return
        m = (l + r) >> 1
        self._build(u << 1, l, m, a)
        self._build(u << 1 | 1, m + 1, r, a)
        self.tr[u] = self.tr[u << 1] + self.tr[u << 1 | 1]

    def _apply(self, u, l, r, v):
        self.tr[u] += v * (r - l + 1)
        self.lz[u] += v

    def _push(self, u, l, r):
        if self.lz[u] != 0 and l < r:
            m = (l + r) >> 1
            self._apply(u << 1, l, m, self.lz[u])
            self._apply(u << 1 | 1, m + 1, r, self.lz[u])
            self.lz[u] = 0

    def update(self, u, l, r, ql, qr, v):
        if ql <= l and r <= qr:
            self._apply(u, l, r, v)
            return
        self._push(u, l, r)
        m = (l + r) >> 1
        if ql <= m:
            self.update(u << 1, l, m, ql, qr, v)
        if qr > m:
            self.update(u << 1 | 1, m + 1, r, ql, qr, v)
        self.tr[u] = self.tr[u << 1] + self.tr[u << 1 | 1]

    def query(self, u, l, r, ql, qr):
        if ql <= l and r <= qr:
            return self.tr[u]
        self._push(u, l, r)
        m = (l + r) >> 1
        res = 0
        if ql <= m:
            res += self.query(u << 1, l, m, ql, qr)
        if qr > m:
            res += self.query(u << 1 | 1, m + 1, r, ql, qr)
        return res

def solve() -> None:
    data = sys.stdin.buffer.read().split()
    if not data:
        return
    it = iter(data)
    n = int(next(it))
    q = int(next(it))
    a = [int(next(it)) for _ in range(n)]
    seg = LazySegTree(a)
    out = []
    for _ in range(q):
        tp = int(next(it))
        l = int(next(it)) - 1
        r = int(next(it)) - 1
        if tp == 1:
            seg.update(1, 0, n - 1, l, r, int(next(it)))
        else:
            out.append(str(seg.query(1, 0, n - 1, l, r)))
    sys.stdout.write("\\n".join(out) + "\\n")

if __name__ == "__main__":
    solve()`,
    ruby: `class LazySegTree
  def initialize(a)
    @n = a.size
    @tr = Array.new(4 * @n + 4, 0)
    @lz = Array.new(4 * @n + 4, 0)
    build(1, 0, @n - 1, a) if @n > 0
  end

  def build(u, l, r, a)
    if l == r
      @tr[u] = a[l]
      return
    end
    m = (l + r) >> 1
    build(u << 1, l, m, a)
    build(u << 1 | 1, m + 1, r, a)
    @tr[u] = @tr[u << 1] + @tr[u << 1 | 1]
  end

  def apply_tag(u, l, r, v)
    @tr[u] += v * (r - l + 1)
    @lz[u] += v
  end

  def push(u, l, r)
    if @lz[u] != 0 && l < r
      m = (l + r) >> 1
      apply_tag(u << 1, l, m, @lz[u])
      apply_tag(u << 1 | 1, m + 1, r, @lz[u])
      @lz[u] = 0
    end
  end

  def update(ql, qr, v, u = 1, l = 0, r = @n - 1)
    if ql <= l && r <= qr
      apply_tag(u, l, r, v)
      return
    end
    push(u, l, r)
    m = (l + r) >> 1
    update(ql, qr, v, u << 1, l, m) if ql <= m
    update(ql, qr, v, u << 1 | 1, m + 1, r) if qr > m
    @tr[u] = @tr[u << 1] + @tr[u << 1 | 1]
  end

  def query(ql, qr, u = 1, l = 0, r = @n - 1)
    return @tr[u] if ql <= l && r <= qr
    push(u, l, r)
    m = (l + r) >> 1
    res = 0
    res += query(ql, qr, u << 1, l, m) if ql <= m
    res += query(ql, qr, u << 1 | 1, m + 1, r) if qr > m
    res
  end
end

data = STDIN.read.split.map(&:to_i)
exit if data.empty?
idx = 0; n = data[idx]; q = data[idx + 1]; idx += 2
a = data[idx, n]; idx += n
seg = LazySegTree.new(a)
out = []
q.times do
  tp = data[idx]; l = data[idx + 1] - 1; r = data[idx + 2] - 1; idx += 3
  if tp == 1
    v = data[idx]; idx += 1
    seg.update(l, r, v)
  else
    out << seg.query(l, r)
  end
end
puts out.join("\\n")`,
  },
  practiceProblems: [
    {
      id: 'ds08-p1',
      tier: 'Warmup',
      ratingRange: '1500–1650',
      title: 'Range Add & Range Sum Queries',
      statement:
        'Given an array A[1..N] and Q operations: (1 L R V) add V to all elements in [L, R]; (2 L R) print the sum of elements in [L, R].',
      constraints: '1 <= N, Q <= 2*10^5, |A[i]|, |V| <= 10^9.',
      sampleInput: `5 3
1 2 3 4 5
2 2 4
1 1 3 10
2 2 4`,
      sampleOutput: `9
29`,
      hints: [
        'Use a Lazy Segment Tree with `tr[node]` storing interval sum and `lz[node]` storing pending per-element addition.',
        'When applying `v` to `[l, r]`, add `v * (r - l + 1)` to `tr[node]` and `v` to `lz[node]`.',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, q;
    if (!(cin >> n >> q)) return 0;
    vector<long long> a(n);
    for (int i = 0; i < n; ++i) cin >> a[i];
    vector<long long> tr(4 * n + 4, 0), lz(4 * n + 4, 0);
    auto build = [&](auto&& self, int u, int l, int r) -> void {
        if (l == r) { tr[u] = a[l]; return; }
        int m = (l + r) >> 1;
        self(self, u << 1, l, m);
        self(self, u << 1 | 1, m + 1, r);
        tr[u] = tr[u << 1] + tr[u << 1 | 1];
    };
    auto apply = [&](int u, int l, int r, long long v) {
        tr[u] += v * (r - l + 1);
        lz[u] += v;
    };
    auto push = [&](int u, int l, int r) {
        if (lz[u] != 0 && l < r) {
            int m = (l + r) >> 1;
            apply(u << 1, l, m, lz[u]);
            apply(u << 1 | 1, m + 1, r, lz[u]);
            lz[u] = 0;
        }
    };
    auto upd = [&](auto&& self, int u, int l, int r, int ql, int qr, long long v) -> void {
        if (ql <= l && r <= qr) { apply(u, l, r, v); return; }
        push(u, l, r);
        int m = (l + r) >> 1;
        if (ql <= m) self(self, u << 1, l, m, ql, qr, v);
        if (qr > m) self(self, u << 1 | 1, m + 1, r, ql, qr, v);
        tr[u] = tr[u << 1] + tr[u << 1 | 1];
    };
    auto qry = [&](auto&& self, int u, int l, int r, int ql, int qr) -> long long {
        if (ql <= l && r <= qr) return tr[u];
        push(u, l, r);
        int m = (l + r) >> 1;
        long long res = 0;
        if (ql <= m) res += self(self, u << 1, l, m, ql, qr);
        if (qr > m) res += self(self, u << 1 | 1, m + 1, r, ql, qr);
        return res;
    };
    build(build, 1, 0, n - 1);
    while (q--) {
        int tp, l, r; cin >> tp >> l >> r;
        if (tp == 1) { long long v; cin >> v; upd(upd, 1, 0, n - 1, l - 1, r - 1, v); }
        else cout << qry(qry, 1, 0, n - 1, l - 1, r - 1) << '\\n';
    }
    return 0;
}`,
        rust: `use std::io::{self, Read};

struct Seg { n: usize, tr: Vec<i64>, lz: Vec<i64> }
impl Seg {
    fn new(a: &[i64]) -> Self {
        let n = a.len();
        let mut s = Self { n, tr: vec![0; 4 * n + 4], lz: vec![0; 4 * n + 4] };
        s.build(1, 0, n - 1, a);
        s
    }
    fn build(&mut self, u: usize, l: usize, r: usize, a: &[i64]) {
        if l == r { self.tr[u] = a[l]; return; }
        let m = (l + r) >> 1;
        self.build(u << 1, l, m, a); self.build(u << 1 | 1, m + 1, r, a);
        self.tr[u] = self.tr[u << 1] + self.tr[u << 1 | 1];
    }
    fn apply(&mut self, u: usize, l: usize, r: usize, v: i64) {
        self.tr[u] += v * (r - l + 1) as i64; self.lz[u] += v;
    }
    fn push(&mut self, u: usize, l: usize, r: usize) {
        if self.lz[u] != 0 && l < r {
            let v = self.lz[u]; let m = (l + r) >> 1;
            self.apply(u << 1, l, m, v); self.apply(u << 1 | 1, m + 1, r, v);
            self.lz[u] = 0;
        }
    }
    fn upd(&mut self, u: usize, l: usize, r: usize, ql: usize, qr: usize, v: i64) {
        if ql <= l && r <= qr { self.apply(u, l, r, v); return; }
        self.push(u, l, r);
        let m = (l + r) >> 1;
        if ql <= m { self.upd(u << 1, l, m, ql, qr, v); }
        if qr > m { self.upd(u << 1 | 1, m + 1, r, ql, qr, v); }
        self.tr[u] = self.tr[u << 1] + self.tr[u << 1 | 1];
    }
    fn qry(&mut self, u: usize, l: usize, r: usize, ql: usize, qr: usize) -> i64 {
        if ql <= l && r <= qr { return self.tr[u]; }
        self.push(u, l, r);
        let m = (l + r) >> 1;
        let mut s = 0;
        if ql <= m { s += self.qry(u << 1, l, m, ql, qr); }
        if qr > m { s += self.qry(u << 1 | 1, m + 1, r, ql, qr); }
        s
    }
}

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let n: usize = match it.next() { Some(x) => x.parse().unwrap(), None => return };
    let q: usize = it.next().unwrap().parse().unwrap();
    let a: Vec<i64> = (0..n).map(|_| it.next().unwrap().parse().unwrap()).collect();
    let mut seg = Seg::new(&a);
    let mut out = String::new();
    for _ in 0..q {
        let tp: usize = it.next().unwrap().parse().unwrap();
        let l: usize = it.next().unwrap().parse::<usize>().unwrap() - 1;
        let r: usize = it.next().unwrap().parse::<usize>().unwrap() - 1;
        if tp == 1 { let v: i64 = it.next().unwrap().parse().unwrap(); seg.upd(1, 0, n - 1, l, r, v); }
        else { out.push_str(&format!("{}\\n", seg.qry(1, 0, n - 1, l, r))); }
    }
    print!("{}", out);
}`,
        java21: `import java.io.*;

public class Main {
    static class FastScanner {
        private final InputStream in = System.in;
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;
        int read() throws IOException {
            if (ptr >= len) { len = in.read(buf); ptr = 0; if (len <= 0) return -1; }
            return buf[ptr++];
        }
        long nextLong() throws IOException {
            int c; while ((c = read()) <= 32) if (c == -1) return Long.MIN_VALUE;
            long s = 1; if (c == '-') { s = -1; c = read(); }
            long v = 0; while (c > 32) { v = v * 10 + (c - '0'); c = read(); }
            return v * s;
        }
        int nextInt() throws IOException { return (int) nextLong(); }
    }

    static long[] tr, lz, a;
    static void build(int u, int l, int r) {
        if (l == r) { tr[u] = a[l]; return; }
        int m = (l + r) >>> 1;
        build(u << 1, l, m); build(u << 1 | 1, m + 1, r);
        tr[u] = tr[u << 1] + tr[u << 1 | 1];
    }
    static void apply(int u, int l, int r, long v) { tr[u] += v * (r - l + 1L); lz[u] += v; }
    static void push(int u, int l, int r) {
        if (lz[u] != 0 && l < r) {
            int m = (l + r) >>> 1;
            apply(u << 1, l, m, lz[u]); apply(u << 1 | 1, m + 1, r, lz[u]); lz[u] = 0;
        }
    }
    static void upd(int u, int l, int r, int ql, int qr, long v) {
        if (ql <= l && r <= qr) { apply(u, l, r, v); return; }
        push(u, l, r); int m = (l + r) >>> 1;
        if (ql <= m) upd(u << 1, l, m, ql, qr, v);
        if (qr > m) upd(u << 1 | 1, m + 1, r, ql, qr, v);
        tr[u] = tr[u << 1] + tr[u << 1 | 1];
    }
    static long qry(int u, int l, int r, int ql, int qr) {
        if (ql <= l && r <= qr) return tr[u];
        push(u, l, r); int m = (l + r) >>> 1; long s = 0;
        if (ql <= m) s += qry(u << 1, l, m, ql, qr);
        if (qr > m) s += qry(u << 1 | 1, m + 1, r, ql, qr);
        return s;
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        long f = fs.nextLong(); if (f == Long.MIN_VALUE) return;
        int n = (int) f, q = fs.nextInt();
        a = new long[n]; for (int i = 0; i < n; i++) a[i] = fs.nextLong();
        tr = new long[4 * n + 4]; lz = new long[4 * n + 4]; build(1, 0, n - 1);
        StringBuilder sb = new StringBuilder();
        while (q-- > 0) {
            int tp = fs.nextInt(), l = fs.nextInt() - 1, r = fs.nextInt() - 1;
            if (tp == 1) upd(1, 0, n - 1, l, r, fs.nextLong());
            else sb.append(qry(1, 0, n - 1, l, r)).append('\\n');
        }
        System.out.print(sb);
    }
}`,
        python3: `import sys
sys.setrecursionlimit(200000)

def solve():
    data = sys.stdin.buffer.read().split()
    if not data: return
    it = iter(data)
    n, q = int(next(it)), int(next(it))
    a = [int(next(it)) for _ in range(n)]
    tr = [0] * (4 * n + 4); lz = [0] * (4 * n + 4)

    def build(u, l, r):
        if l == r: tr[u] = a[l]; return
        m = (l + r) >> 1
        build(u << 1, l, m); build(u << 1 | 1, m + 1, r)
        tr[u] = tr[u << 1] + tr[u << 1 | 1]

    def apply(u, l, r, v):
        tr[u] += v * (r - l + 1); lz[u] += v

    def push(u, l, r):
        if lz[u] != 0 and l < r:
            m = (l + r) >> 1
            apply(u << 1, l, m, lz[u]); apply(u << 1 | 1, m + 1, r, lz[u]); lz[u] = 0

    def upd(u, l, r, ql, qr, v):
        if ql <= l and r <= qr: apply(u, l, r, v); return
        push(u, l, r); m = (l + r) >> 1
        if ql <= m: upd(u << 1, l, m, ql, qr, v)
        if qr > m: upd(u << 1 | 1, m + 1, r, ql, qr, v)
        tr[u] = tr[u << 1] + tr[u << 1 | 1]

    def qry(u, l, r, ql, qr):
        if ql <= l and r <= qr: return tr[u]
        push(u, l, r); m = (l + r) >> 1; res = 0
        if ql <= m: res += qry(u << 1, l, m, ql, qr)
        if qr > m: res += qry(u << 1 | 1, m + 1, r, ql, qr)
        return res

    build(1, 0, n - 1)
    out = []
    for _ in range(q):
        tp, l, r = int(next(it)), int(next(it)) - 1, int(next(it)) - 1
        if tp == 1: upd(1, 0, n - 1, l, r, int(next(it)))
        else: out.append(str(qry(1, 0, n - 1, l, r)))
    sys.stdout.write("\\n".join(out) + "\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `data = STDIN.read.split.map(&:to_i)
exit if data.empty?
idx = 0; n = data[idx]; q = data[idx + 1]; idx += 2
a = data[idx, n]; idx += n
tr = Array.new(4 * n + 4, 0); lz = Array.new(4 * n + 4, 0)
build = nil
build = ->(u, l, r) do
  if l == r; tr[u] = a[l]; return; end
  m = (l + r) >> 1; build.call(u << 1, l, m); build.call(u << 1 | 1, m + 1, r)
  tr[u] = tr[u << 1] + tr[u << 1 | 1]
end
apply_t = ->(u, l, r, v) { tr[u] += v * (r - l + 1); lz[u] += v }
push = ->(u, l, r) { if lz[u] != 0 && l < r; m = (l + r) >> 1; apply_t.call(u << 1, l, m, lz[u]); apply_t.call(u << 1 | 1, m + 1, r, lz[u]); lz[u] = 0; end }
upd = nil
upd = ->(u, l, r, ql, qr, v) do
  if ql <= l && r <= qr; apply_t.call(u, l, r, v); return; end
  push.call(u, l, r); m = (l + r) >> 1
  upd.call(u << 1, l, m, ql, qr, v) if ql <= m
  upd.call(u << 1 | 1, m + 1, r, ql, qr, v) if qr > m
  tr[u] = tr[u << 1] + tr[u << 1 | 1]
end
qry = nil
qry = ->(u, l, r, ql, qr) do
  return tr[u] if ql <= l && r <= qr
  push.call(u, l, r); m = (l + r) >> 1; res = 0
  res += qry.call(u << 1, l, m, ql, qr) if ql <= m
  res += qry.call(u << 1 | 1, m + 1, r, ql, qr) if qr > m
  res
end
build.call(1, 0, n - 1); out = []
q.times do
  tp = data[idx]; l = data[idx + 1] - 1; r = data[idx + 2] - 1; idx += 3
  if tp == 1; v = data[idx]; idx += 1; upd.call(1, 0, n - 1, l, r, v)
  else out << qry.call(1, 0, n - 1, l, r)
  end
end
puts out.join("\\n")`,
      },
    },
    {
      id: 'ds08-p2',
      tier: 'Standard',
      ratingRange: '1700–1850',
      title: 'Range Affine (Set, Multiply, Add) & Range Sum Modulo 998244353',
      statement:
        'Maintain array A[0..N-1] modulo 998244353 under Q queries: (1 L R b c) set A[i] = (b * A[i] + c) mod 998244353 for L <= i < R (covers Range Set via b=0,c=x and Range Add via b=1,c=y); (2 L R) output sum_{i=L}^{R-1} A[i] mod 998244353.',
      constraints: '1 <= N, Q <= 2*10^5, 0 <= A[i], b, c < 998244353.',
      sampleInput: `5 5
1 2 3 4 5
2 0 5
1 1 4 0 10
2 0 5
1 0 3 2 1
2 0 5`,
      sampleOutput: `15
36
63`,
      hints: [
        'Represent every node’s pending lazy transform as an affine pair `(mul, add)` initialized to `(1, 0)`.',
        'Composing outer `(b, c)` onto existing `(m, a)` gives `(b * m % MOD, (b * a + c) % MOD)`. Applying `(b, c)` to a range of length `len` updates `sum = (b * sum + c * len) % MOD`!',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

static constexpr long long MOD = 998'244'353LL;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, q;
    if (!(cin >> n >> q)) return 0;
    vector<long long> a(n);
    for (int i = 0; i < n; ++i) cin >> a[i];

    vector<long long> tr(4 * n + 4, 0), mul(4 * n + 4, 1), add(4 * n + 4, 0);
    auto build = [&](auto&& self, int u, int l, int r) -> void {
        if (l == r) { tr[u] = a[l] % MOD; return; }
        int m = (l + r) >> 1;
        self(self, u << 1, l, m);
        self(self, u << 1 | 1, m + 1, r);
        tr[u] = (tr[u << 1] + tr[u << 1 | 1]) % MOD;
    };
    auto apply = [&](int u, int l, int r, long long b, long long c) {
        tr[u] = (tr[u] * b + c * (r - l + 1)) % MOD;
        mul[u] = mul[u] * b % MOD;
        add[u] = (add[u] * b + c) % MOD;
    };
    auto push = [&](int u, int l, int r) {
        if ((mul[u] != 1 || add[u] != 0) && l < r) {
            int m = (l + r) >> 1;
            apply(u << 1, l, m, mul[u], add[u]);
            apply(u << 1 | 1, m + 1, r, mul[u], add[u]);
            mul[u] = 1; add[u] = 0;
        }
    };
    auto upd = [&](auto&& self, int u, int l, int r, int ql, int qr, long long b, long long c) -> void {
        if (ql <= l && r <= qr) { apply(u, l, r, b, c); return; }
        push(u, l, r);
        int m = (l + r) >> 1;
        if (ql <= m) self(self, u << 1, l, m, ql, qr, b, c);
        if (qr > m) self(self, u << 1 | 1, m + 1, r, ql, qr, b, c);
        tr[u] = (tr[u << 1] + tr[u << 1 | 1]) % MOD;
    };
    auto qry = [&](auto&& self, int u, int l, int r, int ql, int qr) -> long long {
        if (ql <= l && r <= qr) return tr[u];
        push(u, l, r);
        int m = (l + r) >> 1;
        long long res = 0;
        if (ql <= m) res = (res + self(self, u << 1, l, m, ql, qr)) % MOD;
        if (qr > m) res = (res + self(self, u << 1 | 1, m + 1, r, ql, qr)) % MOD;
        return res;
    };
    build(build, 1, 0, n - 1);
    while (q--) {
        int tp, l, r; cin >> tp >> l >> r;
        if (tp == 1) {
            long long b, c; cin >> b >> c;
            upd(upd, 1, 0, n - 1, l, r - 1, b, c);
        } else {
            cout << qry(qry, 1, 0, n - 1, l, r - 1) << '\\n';
        }
    }
    return 0;
}`,
        rust: `use std::io::{self, Read};

const MOD: u64 = 998_244_353;

struct AffineSeg {
    tr: Vec<u64>,
    mul: Vec<u64>,
    add: Vec<u64>,
}

impl AffineSeg {
    fn new(a: &[u64]) -> Self {
        let n = a.len();
        let mut s = Self { tr: vec![0; 4 * n + 4], mul: vec![1; 4 * n + 4], add: vec![0; 4 * n + 4] };
        s.build(1, 0, n - 1, a);
        s
    }
    fn build(&mut self, u: usize, l: usize, r: usize, a: &[u64]) {
        if l == r { self.tr[u] = a[l] % MOD; return; }
        let m = (l + r) >> 1;
        self.build(u << 1, l, m, a); self.build(u << 1 | 1, m + 1, r, a);
        self.tr[u] = (self.tr[u << 1] + self.tr[u << 1 | 1]) % MOD;
    }
    fn apply(&mut self, u: usize, l: usize, r: usize, b: u64, c: u64) {
        self.tr[u] = (self.tr[u] * b + c * (r - l + 1) as u64) % MOD;
        self.mul[u] = self.mul[u] * b % MOD;
        self.add[u] = (self.add[u] * b + c) % MOD;
    }
    fn push(&mut self, u: usize, l: usize, r: usize) {
        if (self.mul[u] != 1 || self.add[u] != 0) && l < r {
            let (b, c) = (self.mul[u], self.add[u]);
            let m = (l + r) >> 1;
            self.apply(u << 1, l, m, b, c);
            self.apply(u << 1 | 1, m + 1, r, b, c);
            self.mul[u] = 1; self.add[u] = 0;
        }
    }
    fn upd(&mut self, u: usize, l: usize, r: usize, ql: usize, qr: usize, b: u64, c: u64) {
        if ql <= l && r <= qr { self.apply(u, l, r, b, c); return; }
        self.push(u, l, r);
        let m = (l + r) >> 1;
        if ql <= m { self.upd(u << 1, l, m, ql, qr, b, c); }
        if qr > m { self.upd(u << 1 | 1, m + 1, r, ql, qr, b, c); }
        self.tr[u] = (self.tr[u << 1] + self.tr[u << 1 | 1]) % MOD;
    }
    fn qry(&mut self, u: usize, l: usize, r: usize, ql: usize, qr: usize) -> u64 {
        if ql <= l && r <= qr { return self.tr[u]; }
        self.push(u, l, r);
        let m = (l + r) >> 1;
        let mut s = 0;
        if ql <= m { s = (s + self.qry(u << 1, l, m, ql, qr)) % MOD; }
        if qr > m { s = (s + self.qry(u << 1 | 1, m + 1, r, ql, qr)) % MOD; }
        s
    }
}

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let n: usize = match it.next() { Some(x) => x.parse().unwrap(), None => return };
    let q: usize = it.next().unwrap().parse().unwrap();
    let a: Vec<u64> = (0..n).map(|_| it.next().unwrap().parse().unwrap()).collect();
    let mut seg = AffineSeg::new(&a);
    let mut out = String::new();
    for _ in 0..q {
        let tp: usize = it.next().unwrap().parse().unwrap();
        let l: usize = it.next().unwrap().parse().unwrap();
        let r: usize = it.next().unwrap().parse::<usize>().unwrap() - 1;
        if tp == 1 {
            let b: u64 = it.next().unwrap().parse().unwrap();
            let c: u64 = it.next().unwrap().parse().unwrap();
            seg.upd(1, 0, n - 1, l, r, b, c);
        } else {
            out.push_str(&format!("{}\\n", seg.qry(1, 0, n - 1, l, r)));
        }
    }
    print!("{}", out);
}`,
        java21: `import java.io.*;
import java.util.*;

public class Main {
    static class FastScanner {
        private final InputStream in = System.in;
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;
        int read() throws IOException {
            if (ptr >= len) { len = in.read(buf); ptr = 0; if (len <= 0) return -1; }
            return buf[ptr++];
        }
        long nextLong() throws IOException {
            int c; while ((c = read()) <= 32) if (c == -1) return Long.MIN_VALUE;
            long s = 1; if (c == '-') { s = -1; c = read(); }
            long v = 0; while (c > 32) { v = v * 10 + (c - '0'); c = read(); }
            return v * s;
        }
        int nextInt() throws IOException { return (int) nextLong(); }
    }

    static final long MOD = 998_244_353L;
    static long[] tr, mul, add, a;
    static void build(int u, int l, int r) {
        if (l == r) { tr[u] = a[l] % MOD; return; }
        int m = (l + r) >>> 1;
        build(u << 1, l, m); build(u << 1 | 1, m + 1, r);
        tr[u] = (tr[u << 1] + tr[u << 1 | 1]) % MOD;
    }
    static void apply(int u, int l, int r, long b, long c) {
        tr[u] = (tr[u] * b + c * (r - l + 1L)) % MOD;
        mul[u] = mul[u] * b % MOD;
        add[u] = (add[u] * b + c) % MOD;
    }
    static void push(int u, int l, int r) {
        if ((mul[u] != 1 || add[u] != 0) && l < r) {
            int m = (l + r) >>> 1;
            apply(u << 1, l, m, mul[u], add[u]); apply(u << 1 | 1, m + 1, r, mul[u], add[u]);
            mul[u] = 1; add[u] = 0;
        }
    }
    static void upd(int u, int l, int r, int ql, int qr, long b, long c) {
        if (ql <= l && r <= qr) { apply(u, l, r, b, c); return; }
        push(u, l, r); int m = (l + r) >>> 1;
        if (ql <= m) upd(u << 1, l, m, ql, qr, b, c);
        if (qr > m) upd(u << 1 | 1, m + 1, r, ql, qr, b, c);
        tr[u] = (tr[u << 1] + tr[u << 1 | 1]) % MOD;
    }
    static long qry(int u, int l, int r, int ql, int qr) {
        if (ql <= l && r <= qr) return tr[u];
        push(u, l, r); int m = (l + r) >>> 1; long s = 0;
        if (ql <= m) s = (s + qry(u << 1, l, m, ql, qr)) % MOD;
        if (qr > m) s = (s + qry(u << 1 | 1, m + 1, r, ql, qr)) % MOD;
        return s;
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        long f = fs.nextLong(); if (f == Long.MIN_VALUE) return;
        int n = (int) f, q = fs.nextInt();
        a = new long[n]; for (int i = 0; i < n; i++) a[i] = fs.nextLong();
        tr = new long[4 * n + 4]; mul = new long[4 * n + 4]; add = new long[4 * n + 4];
        Arrays.fill(mul, 1L); build(1, 0, n - 1);
        StringBuilder sb = new StringBuilder();
        while (q-- > 0) {
            int tp = fs.nextInt(), l = fs.nextInt(), r = fs.nextInt() - 1;
            if (tp == 1) upd(1, 0, n - 1, l, r, fs.nextLong(), fs.nextLong());
            else sb.append(qry(1, 0, n - 1, l, r)).append('\\n');
        }
        System.out.print(sb);
    }
}`,
        python3: `import sys
sys.setrecursionlimit(200000)
MOD = 998_244_353

def solve():
    data = sys.stdin.buffer.read().split()
    if not data: return
    it = iter(data)
    n, q = int(next(it)), int(next(it))
    a = [int(next(it)) % MOD for _ in range(n)]
    tr = [0] * (4 * n + 4); mul = [1] * (4 * n + 4); add = [0] * (4 * n + 4)

    def build(u, l, r):
        if l == r: tr[u] = a[l]; return
        m = (l + r) >> 1
        build(u << 1, l, m); build(u << 1 | 1, m + 1, r)
        tr[u] = (tr[u << 1] + tr[u << 1 | 1]) % MOD

    def apply(u, l, r, b, c):
        tr[u] = (tr[u] * b + c * (r - l + 1)) % MOD
        mul[u] = mul[u] * b % MOD
        add[u] = (add[u] * b + c) % MOD

    def push(u, l, r):
        if (mul[u] != 1 or add[u] != 0) and l < r:
            m = (l + r) >> 1
            apply(u << 1, l, m, mul[u], add[u]); apply(u << 1 | 1, m + 1, r, mul[u], add[u])
            mul[u] = 1; add[u] = 0

    def upd(u, l, r, ql, qr, b, c):
        if ql <= l and r <= qr: apply(u, l, r, b, c); return
        push(u, l, r); m = (l + r) >> 1
        if ql <= m: upd(u << 1, l, m, ql, qr, b, c)
        if qr > m: upd(u << 1 | 1, m + 1, r, ql, qr, b, c)
        tr[u] = (tr[u << 1] + tr[u << 1 | 1]) % MOD

    def qry(u, l, r, ql, qr):
        if ql <= l and r <= qr: return tr[u]
        push(u, l, r); m = (l + r) >> 1; res = 0
        if ql <= m: res = (res + qry(u << 1, l, m, ql, qr)) % MOD
        if qr > m: res = (res + qry(u << 1 | 1, m + 1, r, ql, qr)) % MOD
        return res

    build(1, 0, n - 1); out = []
    for _ in range(q):
        tp, l, r = int(next(it)), int(next(it)), int(next(it)) - 1
        if tp == 1: upd(1, 0, n - 1, l, r, int(next(it)), int(next(it)))
        else: out.append(str(qry(1, 0, n - 1, l, r)))
    sys.stdout.write("\\n".join(out) + "\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `MOD = 998_244_353
data = STDIN.read.split.map(&:to_i)
exit if data.empty?
idx = 0; n = data[idx]; q = data[idx + 1]; idx += 2
a = data[idx, n].map { |x| x % MOD }; idx += n
tr = Array.new(4 * n + 4, 0); mul = Array.new(4 * n + 4, 1); add = Array.new(4 * n + 4, 0)
build = nil
build = ->(u, l, r) do
  if l == r; tr[u] = a[l]; return; end
  m = (l + r) >> 1; build.call(u << 1, l, m); build.call(u << 1 | 1, m + 1, r)
  tr[u] = (tr[u << 1] + tr[u << 1 | 1]) % MOD
end
apply_t = ->(u, l, r, b, c) do
  tr[u] = (tr[u] * b + c * (r - l + 1)) % MOD
  mul[u] = mul[u] * b % MOD
  add[u] = (add[u] * b + c) % MOD
end
push = ->(u, l, r) do
  if (mul[u] != 1 || add[u] != 0) && l < r
    m = (l + r) >> 1
    apply_t.call(u << 1, l, m, mul[u], add[u]); apply_t.call(u << 1 | 1, m + 1, r, mul[u], add[u])
    mul[u] = 1; add[u] = 0
  end
end
upd = nil
upd = ->(u, l, r, ql, qr, b, c) do
  if ql <= l && r <= qr; apply_t.call(u, l, r, b, c); return; end
  push.call(u, l, r); m = (l + r) >> 1
  upd.call(u << 1, l, m, ql, qr, b, c) if ql <= m
  upd.call(u << 1 | 1, m + 1, r, ql, qr, b, c) if qr > m
  tr[u] = (tr[u << 1] + tr[u << 1 | 1]) % MOD
end
qry = nil
qry = ->(u, l, r, ql, qr) do
  return tr[u] if ql <= l && r <= qr
  push.call(u, l, r); m = (l + r) >> 1; res = 0
  res = (res + qry.call(u << 1, l, m, ql, qr)) % MOD if ql <= m
  res = (res + qry.call(u << 1 | 1, m + 1, r, ql, qr)) % MOD if qr > m
  res
end
build.call(1, 0, n - 1); out = []
q.times do
  tp = data[idx]; l = data[idx + 1]; r = data[idx + 2] - 1; idx += 3
  if tp == 1; b = data[idx]; c = data[idx + 1]; idx += 2; upd.call(1, 0, n - 1, l, r, b, c)
  else out << qry.call(1, 0, n - 1, l, r)
  end
end
puts out.join("\\n")`,
      },
    },
    {
      id: 'ds08-p3',
      tier: 'Boss',
      ratingRange: '2000–2250',
      title: 'Cyclic Polynomial Updates (CSES Polynomial Queries on Cyclic Intervals)',
      statement:
        'Maintain a circular 0-indexed array A[0..N-1]. Support Q operations (mod 10^9 + 7): (1 L R c0 c1 c2) traversing indices i in cyclic order from L to R (wrapping around N-1 -> 0 if L > R) with step k = 1, 2, ..., add `c0 + c1*k + c2*k^2` to A[i]; (2 L R) output the cyclic range sum from L to R.',
      constraints: '1 <= N, Q <= 10^5, 0 <= L, R < N, 0 <= c0, c1, c2 <= 10^6.',
      sampleInput: `5 3
1 2 3 4 5
1 3 1 1 2 1
2 3 1
2 0 4`,
      sampleOutput: `44
47`,
      hints: [
        'For any contiguous non-wrapping piece `[ql..qr]` starting at offset `offset` (so element `j` has `k = j - ql + 1 + offset`), express `c0 + c1*k + c2*k^2` in global index `j` as `A + B*j + C*j^2`!',
        'Since `A + B*j + C*j^2` depends ONLY on global index `j`, EVERY node stores fixed precomputed `sum0 = len`, `sum1 = sum_{j=l}^r j`, `sum2 = sum_{j=l}^r j^2`, and lazy tags `(A, B, C)` add linearly! Cyclic `[L..R]` (`L > R`) simply splits into `[L..N-1]` (offset=0) and `[0..R]` (offset=N-L).',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

static constexpr long long MOD = 1'000'000'007LL;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, q;
    if (!(cin >> n >> q)) return 0;
    vector<long long> a(n);
    for (int i = 0; i < n; ++i) cin >> a[i];

    vector<long long> sum0(4 * n + 4), sum1(4 * n + 4), sum2(4 * n + 4), tr(4 * n + 4);
    vector<long long> lzA(4 * n + 4, 0), lzB(4 * n + 4, 0), lzC(4 * n + 4, 0);

    auto build = [&](auto&& self, int u, int l, int r) -> void {
        if (l == r) {
            long long j = l;
            sum0[u] = 1; sum1[u] = j % MOD; sum2[u] = j * j % MOD;
            tr[u] = a[l] % MOD;
            return;
        }
        int m = (l + r) >> 1;
        self(self, u << 1, l, m);
        self(self, u << 1 | 1, m + 1, r);
        sum0[u] = (sum0[u << 1] + sum0[u << 1 | 1]) % MOD;
        sum1[u] = (sum1[u << 1] + sum1[u << 1 | 1]) % MOD;
        sum2[u] = (sum2[u << 1] + sum2[u << 1 | 1]) % MOD;
        tr[u] = (tr[u << 1] + tr[u << 1 | 1]) % MOD;
    };
    auto apply = [&](int u, long long A, long long B, long long C) {
        tr[u] = (tr[u] + A * sum0[u] + B * sum1[u] + C * sum2[u]) % MOD;
        lzA[u] = (lzA[u] + A) % MOD;
        lzB[u] = (lzB[u] + B) % MOD;
        lzC[u] = (lzC[u] + C) % MOD;
    };
    auto push = [&](int u, int l, int r) {
        if ((lzA[u] || lzB[u] || lzC[u]) && l < r) {
            apply(u << 1, lzA[u], lzB[u], lzC[u]);
            apply(u << 1 | 1, lzA[u], lzB[u], lzC[u]);
            lzA[u] = lzB[u] = lzC[u] = 0;
        }
    };
    auto upd = [&](auto&& self, int u, int l, int r, int ql, int qr, long long A, long long B, long long C) -> void {
        if (ql <= l && r <= qr) { apply(u, A, B, C); return; }
        push(u, l, r);
        int m = (l + r) >> 1;
        if (ql <= m) self(self, u << 1, l, m, ql, qr, A, B, C);
        if (qr > m) self(self, u << 1 | 1, m + 1, r, ql, qr, A, B, C);
        tr[u] = (tr[u << 1] + tr[u << 1 | 1]) % MOD;
    };
    auto qry = [&](auto&& self, int u, int l, int r, int ql, int qr) -> long long {
        if (ql <= l && r <= qr) return tr[u];
        push(u, l, r);
        int m = (l + r) >> 1;
        long long res = 0;
        if (ql <= m) res = (res + self(self, u << 1, l, m, ql, qr)) % MOD;
        if (qr > m) res = (res + self(self, u << 1 | 1, m + 1, r, ql, qr)) % MOD;
        return res;
    };
    auto addPiece = [&](int ql, int qr, long long baseShift, long long c0, long long c1, long long c2) {
        // k = j + baseShift -> c0 + c1*(j + s) + c2*(j + s)^2 = A + B*j + C*j^2
        long long s = (baseShift % MOD + MOD) % MOD;
        long long A = (c0 + c1 * s % MOD + c2 * (s * s % MOD)) % MOD;
        long long B = (c1 + 2 * c2 % MOD * s) % MOD;
        long long C = c2 % MOD;
        upd(upd, 1, 0, n - 1, ql, qr, A, B, C);
    };

    build(build, 1, 0, n - 1);
    while (q--) {
        int tp, l, r; cin >> tp >> l >> r;
        if (tp == 1) {
            long long c0, c1, c2; cin >> c0 >> c1 >> c2;
            if (l <= r) {
                addPiece(l, r, 1 - l, c0, c1, c2);
            } else {
                addPiece(l, n - 1, 1 - l, c0, c1, c2);
                addPiece(0, r, 1 + (n - l), c0, c1, c2);
            }
        } else {
            if (l <= r) cout << qry(qry, 1, 0, n - 1, l, r) << '\\n';
            else cout << (qry(qry, 1, 0, n - 1, l, n - 1) + qry(qry, 1, 0, n - 1, 0, r)) % MOD << '\\n';
        }
    }
    return 0;
}`,
        rust: `use std::io::{self, Read};

const MOD: u64 = 1_000_000_007;

struct PolySeg {
    sum0: Vec<u64>, sum1: Vec<u64>, sum2: Vec<u64>, tr: Vec<u64>,
    lza: Vec<u64>, lzb: Vec<u64>, lzc: Vec<u64>,
}

impl PolySeg {
    fn new(a: &[u64]) -> Self {
        let n = a.len();
        let mut s = Self {
            sum0: vec![0; 4 * n + 4], sum1: vec![0; 4 * n + 4], sum2: vec![0; 4 * n + 4], tr: vec![0; 4 * n + 4],
            lza: vec![0; 4 * n + 4], lzb: vec![0; 4 * n + 4], lzc: vec![0; 4 * n + 4],
        };
        s.build(1, 0, n - 1, a);
        s
    }
    fn build(&mut self, u: usize, l: usize, r: usize, a: &[u64]) {
        if l == r {
            let j = l as u64 % MOD;
            self.sum0[u] = 1; self.sum1[u] = j; self.sum2[u] = j * j % MOD;
            self.tr[u] = a[l] % MOD;
            return;
        }
        let m = (l + r) >> 1;
        self.build(u << 1, l, m, a); self.build(u << 1 | 1, m + 1, r, a);
        self.sum0[u] = (self.sum0[u << 1] + self.sum0[u << 1 | 1]) % MOD;
        self.sum1[u] = (self.sum1[u << 1] + self.sum1[u << 1 | 1]) % MOD;
        self.sum2[u] = (self.sum2[u << 1] + self.sum2[u << 1 | 1]) % MOD;
        self.tr[u] = (self.tr[u << 1] + self.tr[u << 1 | 1]) % MOD;
    }
    fn apply(&mut self, u: usize, a: u64, b: u64, c: u64) {
        self.tr[u] = (self.tr[u] + a * self.sum0[u] + b * self.sum1[u] + c * self.sum2[u]) % MOD;
        self.lza[u] = (self.lza[u] + a) % MOD;
        self.lzb[u] = (self.lzb[u] + b) % MOD;
        self.lzc[u] = (self.lzc[u] + c) % MOD;
    }
    fn push(&mut self, u: usize, l: usize, r: usize) {
        if (self.lza[u] != 0 || self.lzb[u] != 0 || self.lzc[u] != 0) && l < r {
            let (a, b, c) = (self.lza[u], self.lzb[u], self.lzc[u]);
            self.apply(u << 1, a, b, c);
            self.apply(u << 1 | 1, a, b, c);
            self.lza[u] = 0; self.lzb[u] = 0; self.lzc[u] = 0;
        }
    }
    fn upd(&mut self, u: usize, l: usize, r: usize, ql: usize, qr: usize, a: u64, b: u64, c: u64) {
        if ql <= l && r <= qr { self.apply(u, a, b, c); return; }
        self.push(u, l, r);
        let m = (l + r) >> 1;
        if ql <= m { self.upd(u << 1, l, m, ql, qr, a, b, c); }
        if qr > m { self.upd(u << 1 | 1, m + 1, r, ql, qr, a, b, c); }
        self.tr[u] = (self.tr[u << 1] + self.tr[u << 1 | 1]) % MOD;
    }
    fn qry(&mut self, u: usize, l: usize, r: usize, ql: usize, qr: usize) -> u64 {
        if ql <= l && r <= qr { return self.tr[u]; }
        self.push(u, l, r);
        let m = (l + r) >> 1;
        let mut res = 0;
        if ql <= m { res = (res + self.qry(u << 1, l, m, ql, qr)) % MOD; }
        if qr > m { res = (res + self.qry(u << 1 | 1, m + 1, r, ql, qr)) % MOD; }
        res
    }
    fn add_piece(&mut self, ql: usize, qr: usize, shift: i64, c0: u64, c1: u64, c2: u64) {
        let m_i = MOD as i64;
        let s = ((shift % m_i) + m_i) as u64 % MOD;
        let a = (c0 + c1 * s % MOD + c2 * (s * s % MOD)) % MOD;
        let b = (c1 + 2 * c2 % MOD * s) % MOD;
        let c = c2 % MOD;
        self.upd(1, 0, self.n(), ql, qr, a, b, c);
    }
    fn n(&self) -> usize { (self.tr.len() - 4) / 4 - 1 }
}

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let n: usize = match it.next() { Some(x) => x.parse().unwrap(), None => return };
    let q: usize = it.next().unwrap().parse().unwrap();
    let a: Vec<u64> = (0..n).map(|_| it.next().unwrap().parse().unwrap()).collect();
    let mut seg = PolySeg::new(&a);
    let mut out = String::new();
    for _ in 0..q {
        let tp: usize = it.next().unwrap().parse().unwrap();
        let l: usize = it.next().unwrap().parse().unwrap();
        let r: usize = it.next().unwrap().parse().unwrap();
        if tp == 1 {
            let c0: u64 = it.next().unwrap().parse().unwrap();
            let c1: u64 = it.next().unwrap().parse().unwrap();
            let c2: u64 = it.next().unwrap().parse().unwrap();
            if l <= r { seg.add_piece(l, r, 1 - l as i64, c0, c1, c2); }
            else {
                seg.add_piece(l, n - 1, 1 - l as i64, c0, c1, c2);
                seg.add_piece(0, r, 1 + (n - l) as i64, c0, c1, c2);
            }
        } else {
            let ans = if l <= r { seg.qry(1, 0, n - 1, l, r) }
            else { (seg.qry(1, 0, n - 1, l, n - 1) + seg.qry(1, 0, n - 1, 0, r)) % MOD };
            out.push_str(&format!("{}\\n", ans));
        }
    }
    print!("{}", out);
}`,
        java21: `import java.io.*;

public class Main {
    static class FastScanner {
        private final InputStream in = System.in;
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;
        int read() throws IOException {
            if (ptr >= len) { len = in.read(buf); ptr = 0; if (len <= 0) return -1; }
            return buf[ptr++];
        }
        long nextLong() throws IOException {
            int c; while ((c = read()) <= 32) if (c == -1) return Long.MIN_VALUE;
            long s = 1; if (c == '-') { s = -1; c = read(); }
            long v = 0; while (c > 32) { v = v * 10 + (c - '0'); c = read(); }
            return v * s;
        }
        int nextInt() throws IOException { return (int) nextLong(); }
    }

    static final long MOD = 1_000_000_007L;
    static long[] sum0, sum1, sum2, tr, lzA, lzB, lzC, a;
    static int N;

    static void build(int u, int l, int r) {
        if (l == r) {
            long j = l;
            sum0[u] = 1; sum1[u] = j % MOD; sum2[u] = j * j % MOD;
            tr[u] = a[l] % MOD; return;
        }
        int m = (l + r) >>> 1;
        build(u << 1, l, m); build(u << 1 | 1, m + 1, r);
        sum0[u] = (sum0[u << 1] + sum0[u << 1 | 1]) % MOD;
        sum1[u] = (sum1[u << 1] + sum1[u << 1 | 1]) % MOD;
        sum2[u] = (sum2[u << 1] + sum2[u << 1 | 1]) % MOD;
        tr[u] = (tr[u << 1] + tr[u << 1 | 1]) % MOD;
    }

    static void apply(int u, long A, long B, long C) {
        tr[u] = (tr[u] + A * sum0[u] + B * sum1[u] + C * sum2[u]) % MOD;
        lzA[u] = (lzA[u] + A) % MOD; lzB[u] = (lzB[u] + B) % MOD; lzC[u] = (lzC[u] + C) % MOD;
    }

    static void push(int u, int l, int r) {
        if ((lzA[u] != 0 || lzB[u] != 0 || lzC[u] != 0) && l < r) {
            apply(u << 1, lzA[u], lzB[u], lzC[u]);
            apply(u << 1 | 1, lzA[u], lzB[u], lzC[u]);
            lzA[u] = lzB[u] = lzC[u] = 0;
        }
    }

    static void upd(int u, int l, int r, int ql, int qr, long A, long B, long C) {
        if (ql <= l && r <= qr) { apply(u, A, B, C); return; }
        push(u, l, r); int m = (l + r) >>> 1;
        if (ql <= m) upd(u << 1, l, m, ql, qr, A, B, C);
        if (qr > m) upd(u << 1 | 1, m + 1, r, ql, qr, A, B, C);
        tr[u] = (tr[u << 1] + tr[u << 1 | 1]) % MOD;
    }

    static long qry(int u, int l, int r, int ql, int qr) {
        if (ql <= l && r <= qr) return tr[u];
        push(u, l, r); int m = (l + r) >>> 1; long s = 0;
        if (ql <= m) s = (s + qry(u << 1, l, m, ql, qr)) % MOD;
        if (qr > m) s = (s + qry(u << 1 | 1, m + 1, r, ql, qr)) % MOD;
        return s;
    }

    static void addPiece(int ql, int qr, long shift, long c0, long c1, long c2) {
        long s = ((shift % MOD) + MOD) % MOD;
        long A = (c0 + c1 * s % MOD + c2 * (s * s % MOD)) % MOD;
        long B = (c1 + 2 * c2 % MOD * s) % MOD;
        upd(1, 0, N - 1, ql, qr, A, B, c2 % MOD);
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        long f = fs.nextLong(); if (f == Long.MIN_VALUE) return;
        N = (int) f; int q = fs.nextInt();
        a = new long[N]; for (int i = 0; i < N; i++) a[i] = fs.nextLong();
        sum0 = new long[4 * N + 4]; sum1 = new long[4 * N + 4]; sum2 = new long[4 * N + 4];
        tr = new long[4 * N + 4]; lzA = new long[4 * N + 4]; lzB = new long[4 * N + 4]; lzC = new long[4 * N + 4];
        build(1, 0, N - 1);
        StringBuilder sb = new StringBuilder();
        while (q-- > 0) {
            int tp = fs.nextInt(), l = fs.nextInt(), r = fs.nextInt();
            if (tp == 1) {
                long c0 = fs.nextLong(), c1 = fs.nextLong(), c2 = fs.nextLong();
                if (l <= r) addPiece(l, r, 1L - l, c0, c1, c2);
                else { addPiece(l, N - 1, 1L - l, c0, c1, c2); addPiece(0, r, 1L + (N - l), c0, c1, c2); }
            } else {
                long ans = l <= r ? qry(1, 0, N - 1, l, r) : (qry(1, 0, N - 1, l, N - 1) + qry(1, 0, N - 1, 0, r)) % MOD;
                sb.append(ans).append('\\n');
            }
        }
        System.out.print(sb);
    }
}`,
        python3: `import sys
sys.setrecursionlimit(200000)
MOD = 1_000_000_007

def solve():
    data = sys.stdin.buffer.read().split()
    if not data: return
    it = iter(data)
    n, q = int(next(it)), int(next(it))
    a = [int(next(it)) % MOD for _ in range(n)]
    sz = 4 * n + 4
    s0 = [0] * sz; s1 = [0] * sz; s2 = [0] * sz; tr = [0] * sz
    lzA = [0] * sz; lzB = [0] * sz; lzC = [0] * sz

    def build(u, l, r):
        if l == r:
            s0[u] = 1; s1[u] = l % MOD; s2[u] = (l * l) % MOD; tr[u] = a[l]; return
        m = (l + r) >> 1
        build(u << 1, l, m); build(u << 1 | 1, m + 1, r)
        s0[u] = (s0[u << 1] + s0[u << 1 | 1]) % MOD
        s1[u] = (s1[u << 1] + s1[u << 1 | 1]) % MOD
        s2[u] = (s2[u << 1] + s2[u << 1 | 1]) % MOD
        tr[u] = (tr[u << 1] + tr[u << 1 | 1]) % MOD

    def apply(u, A, B, C):
        tr[u] = (tr[u] + A * s0[u] + B * s1[u] + C * s2[u]) % MOD
        lzA[u] = (lzA[u] + A) % MOD; lzB[u] = (lzB[u] + B) % MOD; lzC[u] = (lzC[u] + C) % MOD

    def push(u, l, r):
        if (lzA[u] or lzB[u] or lzC[u]) and l < r:
            apply(u << 1, lzA[u], lzB[u], lzC[u]); apply(u << 1 | 1, lzA[u], lzB[u], lzC[u])
            lzA[u] = lzB[u] = lzC[u] = 0

    def upd(u, l, r, ql, qr, A, B, C):
        if ql <= l and r <= qr: apply(u, A, B, C); return
        push(u, l, r); m = (l + r) >> 1
        if ql <= m: upd(u << 1, l, m, ql, qr, A, B, C)
        if qr > m: upd(u << 1 | 1, m + 1, r, ql, qr, A, B, C)
        tr[u] = (tr[u << 1] + tr[u << 1 | 1]) % MOD

    def qry(u, l, r, ql, qr):
        if ql <= l and r <= qr: return tr[u]
        push(u, l, r); m = (l + r) >> 1; res = 0
        if ql <= m: res = (res + qry(u << 1, l, m, ql, qr)) % MOD
        if qr > m: res = (res + qry(u << 1 | 1, m + 1, r, ql, qr)) % MOD
        return res

    def add_piece(ql, qr, shift, c0, c1, c2):
        s = shift % MOD
        A = (c0 + c1 * s + c2 * s * s) % MOD
        B = (c1 + 2 * c2 * s) % MOD
        upd(1, 0, n - 1, ql, qr, A, B, c2 % MOD)

    build(1, 0, n - 1); out = []
    for _ in range(q):
        tp, l, r = int(next(it)), int(next(it)), int(next(it))
        if tp == 1:
            c0, c1, c2 = int(next(it)), int(next(it)), int(next(it))
            if l <= r: add_piece(l, r, 1 - l, c0, c1, c2)
            else: add_piece(l, n - 1, 1 - l, c0, c1, c2); add_piece(0, r, 1 + n - l, c0, c1, c2)
        else:
            ans = qry(1, 0, n - 1, l, r) if l <= r else (qry(1, 0, n - 1, l, n - 1) + qry(1, 0, n - 1, 0, r)) % MOD
            out.append(str(ans))
    sys.stdout.write("\\n".join(out) + "\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `MOD = 1_000_000_007
data = STDIN.read.split.map(&:to_i)
exit if data.empty?
idx = 0; n = data[idx]; q = data[idx + 1]; idx += 2
a = data[idx, n].map { |x| x % MOD }; idx += n
sz = 4 * n + 4
s0 = Array.new(sz, 0); s1 = Array.new(sz, 0); s2 = Array.new(sz, 0); tr = Array.new(sz, 0)
lza = Array.new(sz, 0); lzb = Array.new(sz, 0); lzc = Array.new(sz, 0)
build = nil
build = ->(u, l, r) do
  if l == r; s0[u] = 1; s1[u] = l % MOD; s2[u] = l * l % MOD; tr[u] = a[l]; return; end
  m = (l + r) >> 1; build.call(u << 1, l, m); build.call(u << 1 | 1, m + 1, r)
  s0[u] = (s0[u << 1] + s0[u << 1 | 1]) % MOD
  s1[u] = (s1[u << 1] + s1[u << 1 | 1]) % MOD
  s2[u] = (s2[u << 1] + s2[u << 1 | 1]) % MOD
  tr[u] = (tr[u << 1] + tr[u << 1 | 1]) % MOD
end
apply_t = ->(u, aa, bb, cc) do
  tr[u] = (tr[u] + aa * s0[u] + bb * s1[u] + cc * s2[u]) % MOD
  lza[u] = (lza[u] + aa) % MOD; lzb[u] = (lzb[u] + bb) % MOD; lzc[u] = (lzc[u] + cc) % MOD
end
push = ->(u, l, r) do
  if (lza[u] != 0 || lzb[u] != 0 || lzc[u] != 0) && l < r
    apply_t.call(u << 1, lza[u], lzb[u], lzc[u]); apply_t.call(u << 1 | 1, lza[u], lzb[u], lzc[u])
    lza[u] = lzb[u] = lzc[u] = 0
  end
end
upd = nil
upd = ->(u, l, r, ql, qr, aa, bb, cc) do
  if ql <= l && r <= qr; apply_t.call(u, aa, bb, cc); return; end
  push.call(u, l, r); m = (l + r) >> 1
  upd.call(u << 1, l, m, ql, qr, aa, bb, cc) if ql <= m
  upd.call(u << 1 | 1, m + 1, r, ql, qr, aa, bb, cc) if qr > m
  tr[u] = (tr[u << 1] + tr[u << 1 | 1]) % MOD
end
qry = nil
qry = ->(u, l, r, ql, qr) do
  return tr[u] if ql <= l && r <= qr
  push.call(u, l, r); m = (l + r) >> 1; res = 0
  res = (res + qry.call(u << 1, l, m, ql, qr)) % MOD if ql <= m
  res = (res + qry.call(u << 1 | 1, m + 1, r, ql, qr)) % MOD if qr > m
  res
end
add_piece = ->(ql, qr, shift, c0, c1, c2) do
  s = shift % MOD
  aa = (c0 + c1 * s + c2 * s * s) % MOD
  bb = (c1 + 2 * c2 * s) % MOD
  upd.call(1, 0, n - 1, ql, qr, aa, bb, c2 % MOD)
end
build.call(1, 0, n - 1); out = []
q.times do
  tp = data[idx]; l = data[idx + 1]; r = data[idx + 2]; idx += 3
  if tp == 1
    c0 = data[idx]; c1 = data[idx + 1]; c2 = data[idx + 2]; idx += 3
    if l <= r; add_piece.call(l, r, 1 - l, c0, c1, c2)
    else add_piece.call(l, n - 1, 1 - l, c0, c1, c2); add_piece.call(0, r, 1 + n - l, c0, c1, c2)
    end
  else
    out << (l <= r ? qry.call(1, 0, n - 1, l, r) : (qry.call(1, 0, n - 1, l, n - 1) + qry.call(1, 0, n - 1, 0, r)) % MOD)
  end
end
puts out.join("\\n")`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'CSES',
      title: 'Range Updates and Sums & Polynomial Queries',
      difficulty: 'USACO Platinum (1700–2000)',
      url: 'https://cses.fi/problemset/task/1735',
      patternNote: 'Canonical progression from composite add/set lazy tags to quadratic/arithmetic polynomial tags.',
    },
    {
      platform: 'AtCoder',
      title: 'ACL Practice K (Range Affine Range Sum)',
      difficulty: 'AtCoder Blue (~1700)',
      url: 'https://atcoder.jp/contests/practice2/tasks/practice2_k',
      patternNote: 'Direct benchmark for affine `(mul, add)` lazy composition modulo 998244353.',
    },
    {
      platform: 'Codeforces',
      title: 'CF 242E XOR on Segment & CF 438D The Child and Sequence',
      difficulty: 'CF 2000–2300',
      url: 'https://codeforces.com/problemset/problem/242/E',
      patternNote: 'Bitwise lazy flip tags per bit and Segment Tree Beats modulo pruning.',
    },
    {
      platform: 'CodeChef',
      title: 'FLIPCOIN / ADDMUL (Lazy Add-Mul-Set)',
      difficulty: 'CodeChef 4★–5★',
      url: 'https://www.codechef.com/problems/ADDMUL',
      patternNote: 'Standardize all 3 update types into one `(mul, add)` affine tag tuple.',
    },
    {
      platform: 'HackerRank',
      title: 'Polynomial & Functional Queries on Segments',
      difficulty: 'Hard',
      url: 'https://www.hackerrank.com/domains/data-structures/advanced',
      patternNote: 'Benchmarks lazy push ordering and 64-bit interval length multiplication.',
    },
    {
      platform: 'NeetCode 150',
      title: 'Range Module & Falling Squares (Segment Tree Intervals)',
      difficulty: 'FAANG Hard',
      url: 'https://leetcode.com/problems/range-module/',
      patternNote: 'Dynamic interval coverage + overwrite lazy propagation.',
    },
  ],
  interviewNotes: [
    'Whenever a problem mixes Range Set and Range Add/Multiply, collapse them into ONE unified affine operator `x -> mul * x + add` rather than fragile boolean flags.',
    'Explain how polynomial range updates work in O(log N): rewrite `P(j - l + 1)` in global index `j` so every tree node only tracks static power-sum constants `sum(j^0), sum(j^1), sum(j^2)`.',
  ],
  projectBlueprint: {
    title: 'Real-Time Stock & Telemetry Range Query Engine',
    tagline:
      'Execute sub-millisecond bulk calibrations (additive offsets, affine scaling, and polynomial trend adjustments) and interval rollups across streaming time-series buckets.',
    stackSummary: 'TypeScript + Unified Affine Lazy Segment Tree + TypedArray Cache',
    asciiDiagram:
      'Telemetry Stream + Bulk Calibration [L..R] ──▶ [Affine (mul, add) Lazy SegTree]\n' +
      '                                                           │\n' +
      '   Sub-ms Window Sum / Min / Drift Rollups ◀───────────────┘',
    milestones: [
      {
        id: 'ch19-m1',
        title: 'Milestone 1: Zero-Allocation 4N Typed Segment Tree',
        detail: 'Back sums, mins, and lazy tags with Float64Array buffers for cache-friendly updates.',
      },
      {
        id: 'ch19-m2',
        title: 'Milestone 2: Composable Affine Calibration Tags',
        detail: 'Support simultaneous gain scaling (mul) and baseline offset (add) in a single O(log N) pass.',
      },
      {
        id: 'ch19-m3',
        title: 'Milestone 3: Cyclic Ring-Buffer Interval Wrapper',
        detail: 'Automatically split wrap-around time windows [L > R] into two contiguous segment queries.',
      },
    ],
    starterCode: `export class TelemetryLazySegTree {
  private readonly n: number;
  private readonly sum: Float64Array;
  private readonly mul: Float64Array;
  private readonly add: Float64Array;

  constructor(initial: number[]) {
    this.n = initial.length;
    this.sum = new Float64Array(4 * this.n + 4);
    this.mul = new Float64Array(4 * this.n + 4).fill(1);
    this.add = new Float64Array(4 * this.n + 4);
    if (this.n > 0) this.build(1, 0, this.n - 1, initial);
  }

  private build(u: number, l: number, r: number, a: number[]): void {
    if (l === r) {
      this.sum[u] = a[l];
      return;
    }
    const m = (l + r) >> 1;
    this.build(u << 1, l, m, a);
    this.build((u << 1) | 1, m + 1, r, a);
    this.sum[u] = this.sum[u << 1] + this.sum[(u << 1) | 1];
  }

  private applyTag(u: number, l: number, r: number, b: number, c: number): void {
    this.sum[u] = this.sum[u] * b + c * (r - l + 1);
    this.mul[u] *= b;
    this.add[u] = this.add[u] * b + c;
  }

  private push(u: number, l: number, r: number): void {
    if ((this.mul[u] !== 1 || this.add[u] !== 0) && l < r) {
      const m = (l + r) >> 1;
      this.applyTag(u << 1, l, m, this.mul[u], this.add[u]);
      this.applyTag((u << 1) | 1, m + 1, r, this.mul[u], this.add[u]);
      this.mul[u] = 1;
      this.add[u] = 0;
    }
  }

  rangeAffine(ql: number, qr: number, mulVal: number, addVal: number, u = 1, l = 0, r = this.n - 1): void {
    if (ql <= l && r <= qr) {
      this.applyTag(u, l, r, mulVal, addVal);
      return;
    }
    this.push(u, l, r);
    const m = (l + r) >> 1;
    if (ql <= m) this.rangeAffine(ql, qr, mulVal, addVal, u << 1, l, m);
    if (qr > m) this.rangeAffine(ql, qr, mulVal, addVal, (u << 1) | 1, m + 1, r);
    this.sum[u] = this.sum[u << 1] + this.sum[(u << 1) | 1];
  }

  querySum(ql: number, qr: number, u = 1, l = 0, r = this.n - 1): number {
    if (ql <= l && r <= qr) return this.sum[u];
    this.push(u, l, r);
    const m = (l + r) >> 1;
    let total = 0;
    if (ql <= m) total += this.querySum(ql, qr, u << 1, l, m);
    if (qr > m) total += this.querySum(ql, qr, (u << 1) | 1, m + 1, r);
    return total;
  }
}`,
  },
};
