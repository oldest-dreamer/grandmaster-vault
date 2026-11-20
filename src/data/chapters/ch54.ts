import type { TheoryChapter } from '../../types/vault';

export const CH54_ITERATIVE_RECURSIVE_SEGTREE: TheoryChapter = {
  slug: 'segment-tree-point-range',
  topicId: 'ds-07',
  title: 'Iterative & Recursive Segment Trees',
  domain: 'Data Structures',
  ratingTier: '1600–1900',
  usacoDivision: 'Gold',
  subtitle:
    'Achieve 4x faster cache-local range queries in 2N array space using Al.Cash’s bottom-up iterative Segment Tree (`p >>= 1`), perform O(log N) binary walks on recursive trees, and merge non-commutative 4-field monoids for dynamic maximum subarray sum queries.',
  analogyTitle: 'The 2N Bottom-Up Escalator & Associative Monoid Box Analogy',
  analogyBody:
    'While a recursive Segment Tree allocates `4N` nodes and dives top-down with function-call overhead, an **iterative bottom-up Segment Tree** places all `N` leaves side-by-side at indices `N .. 2N - 1` inside a flat `2N` array! Updating index `p` climbs straight up (`p >>= 1`) like taking a vertical escalator without recursion, and querying `[l, r)` starts two pointers at `l += N` and `r += N`: whenever `l` is odd (a right child), we collect `tree[l++]`; whenever `r` is odd (meaning `r - 1` is a left child), we collect `tree[--r]`; then halve both (`l >>= 1; r >>= 1`) until `l == r`! Even for **non-commutative monoids** (like Maximum Subarray Sum `{sum, pref, suff, ans}` or matrix multiplication), maintaining two separate accumulators `resL = merge(resL, tree[l++])` and `resR = merge(tree[--r], resR)` preserves exact left-to-right order in 15 lines of zero-recursion code!',
  prerequisites: [
    {
      slug: 'fenwick-tree-binary-lifting',
      title: 'Fenwick Tree (BIT) & Binary Lifting on BIT',
    },
  ],
  traceTitle: 'Interactive Bottom-Up 2N Iterative Segment Tree & Monoid Merge Trace',
  traceSubtitle:
    'Build a 2N iterative Min-Segment Tree on `[3, 2, 4, 5, 1, 1, 5, 3]` (`N = 8`), climb `p >>= 1` on `a[1] = 3 -> 1`, and trace `[l, r) = [1, 6)` accumulation.',
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Step 1: Place N = 8 Leaves at Indices [8..15] and Build Parents [7..1]',
      explanation:
        'Leaves live at `tree[8..15]`. Iterating `i = 7` down to `1`, `tree[i] = min(tree[2*i], tree[2*i + 1])` fills all internal nodes bottom-up in strictly linear O(N) time and exactly `2N = 16` array slots.',
      mode: 'array',
      arrays: [
        {
          name: '2N Iterative Min-Segment Tree Array (Indices 1..15)',
          cells: [
            { index: 1, value: 1, label: 'root', highlight: 'active' },
            { index: 2, value: 2, label: '[0,4)', highlight: 'window' },
            { index: 3, value: 1, label: '[4,8)', highlight: 'window' },
            { index: 4, value: 2, label: '[0,2)', highlight: 'neutral' },
            { index: 5, value: 4, label: '[2,4)', highlight: 'neutral' },
            { index: 6, value: 1, label: '[4,6)', highlight: 'neutral' },
            { index: 7, value: 3, label: '[6,8)', highlight: 'neutral' },
            { index: 8, value: 'leaves:[3,2,4,5,1,1,5,3]', label: '8..15', highlight: 'neutral' },
          ],
        },
      ],
      variables: { N: 8, ArraySize: 16, RootMin: 1 },
    },
    {
      stepNumber: 2,
      title: 'Step 2: Point Update a[1] = 3 -> Reclimb Ancestors via p >>= 1',
      explanation:
        'Set `p = 1 + 8 = 9`, assign `tree[9] = 3`. Loop `while (p > 1)`: `p >>= 1` updates `tree[4] = min(tree[8], tree[9]) = min(3, 3) = 3`; then `p = 2` updates `tree[2] = min(3, 4) = 3`; then `p = 1` updates `tree[1] = min(3, 1) = 1`. Zero recursion!',
      mode: 'array',
      arrays: [
        {
          name: 'Bottom-Up Escalator Path p = 9 -> 4 -> 2 -> 1',
          cells: [
            { index: 9, value: 3, label: 'a[1]=3', highlight: 'updated' },
            { index: 4, value: 3, label: 'min(3,3)', highlight: 'updated' },
            { index: 2, value: 3, label: 'min(3,4)', highlight: 'updated' },
            { index: 1, value: 1, label: 'min(3,1)', highlight: 'active' },
          ],
        },
      ],
      variables: { UpdatedIndex: 1, NewValue: 3, AncestorsTouched: 3 },
    },
    {
      stepNumber: 3,
      title: 'Step 3: Query Half-Open [l, r) = [1, 6) Using Boundary Parity Rules',
      explanation:
        'Start `l = 9, r = 14`. (1) `l=9` odd -> take `tree[9]=3`, `l=10`; `r=14` even -> `l=5, r=7`. (2) `l=5` odd -> take `tree[5]=4`, `l=6`; `r=7` odd -> take `tree[6]=1`, `r=6`. Now `l == r == 6`, STOP! Merged answer = `min(3, 4, 1) = 1`!',
      mode: 'array',
      arrays: [
        {
          name: 'Disjoint Canonical Nodes Collected for [1, 6)',
          cells: [
            { index: 0, value: 'tree[9]=3', label: 'idx 1', highlight: 'window' },
            { index: 1, value: 'tree[5]=4', label: 'idx [2,4)', highlight: 'window' },
            { index: 2, value: 'tree[6]=1', label: 'idx [4,6)', highlight: 'active' },
          ],
        },
      ],
      variables: { QueryRange: '[1, 6)', NodesMerged: 3, ResultMin: 1 },
    },
  ],
  reductionClues: [
    {
      clue: '"Point update + range associative query (min, max, gcd, XOR, matrix, max subarray sum) with tight TL"',
      translation:
        '**Iterative Bottom-Up `2N` Segment Tree**: half the memory of `4N`, zero recursion stack frames, 3–4x faster than recursive implementations, and handles non-commutative monoids via `resL` / `resR`!',
    },
    {
      clue: '"Find the smallest index `i >= L` where `a[i] >= X` (or first prefix whose sum >= K)"',
      translation:
        '**Segment Tree Binary Walk (`O(log N)`)**: NOT `binary search + query` (`O(log^2 N)`)! Descend directly at each internal node checking `if (tree[2*node] >= X) goLeft else goRight` in a single `O(log N)` pass!',
    },
    {
      clue: '"Maintain dynamic maximum contiguous subarray sum under point updates"',
      translation:
        '**4-Field Monoid `(sum, pref, suff, ans)`**: combine left and right segments via `pref = max(L.pref, L.sum + R.pref)`, `suff = max(R.suff, R.sum + L.suff)`, `ans = max(L.ans, R.ans, L.suff + R.pref)`!',
    },
    {
      clue: '"Point update is non-invertible (unlike Fenwick sum/XOR)"',
      translation:
        'Fenwick Trees cannot easily support `min`/`max` range queries with arbitrary overwrites (`a[i] = u`). Switch immediately to a **Segment Tree**!',
    },
  ],
  timeComplexity: 'O(N) build, O(log N) per point update, query, or binary walk',
  spaceComplexity: 'O(2N) iterative / O(4N) recursive',
  pitfalls: [
    {
      type: 'WA',
      title: 'Merging `resL` and `resR` in Wrong Order for Non-Commutative Monoids',
      detail:
        'In an iterative Segment Tree `[l, r)`, elements from `l++` belong to the LEFT boundary and elements from `--r` belong to the RIGHT boundary (from right to left!). You MUST write **`resL = merge(resL, tree[l++])`** and **`resR = merge(tree[--r], resR)`**, then return `merge(resL, resR)`—never combine `--r` on the right of `resR`!',
    },
    {
      type: 'WA',
      title: 'Forgetting Identity / Neutral Element in `[l, r)` Query Loops',
      detail:
        'Initialize `resL` and `resR` with the exact **monoid identity** (`+INF` for min, `{0, 0, 0, 0}` for non-negative max subarray, identity matrix for matrix monoids). On invalid/empty ranges `l >= r`, returning `merge(resL, resR)` cleanly returns identity!',
    },
    {
      type: 'RE',
      title: 'Using `2 * N` Array Size for Recursive Top-Down Segment Trees',
      detail:
        'Iterative bottom-up trees fit in **exactly `2 * N`** slots (`1..2N-1`). Recursive top-down trees require **`4 * N`** slots because non-power-of-two `N` can address up to `~3.8 * N` indices!',
    },
    {
      type: 'TLE',
      title: 'Writing `O(log^2 N)` Binary Search Outside Segment Tree Query',
      detail:
        'When searching for the leftmost index `>= X`, running `while (lo < hi) query(1, lo, mid)` costs `O(log^2 N)` and TLEs at `N = 2 * 10^5` with strict limits! Walk down a recursive Segment Tree (`if (tree[2*node] >= x) walk(2*node) else walk(2*node+1)`) in a single **`O(log N)`** descent.',
    },
  ],
  implementations: {
    cpp20: `#include <bits/stdc++.h>
using namespace std;

// Non-commutative 2N Iterative Segment Tree supporting arbitrary associative Monoids
struct Node {
    long long sum, pref, suff, ans;
};

static const Node ID = {0, 0, 0, 0};

Node makeLeaf(long long v) {
    long long pos = max(0LL, v);
    return {v, pos, pos, pos};
}

Node mergeNode(const Node& L, const Node& R) {
    return {
        L.sum + R.sum,
        max(L.pref, L.sum + R.pref),
        max(R.suff, R.sum + L.suff),
        max({L.ans, R.ans, L.suff + R.pref})
    };
}

struct IterSegTree {
    int n;
    vector<Node> tree;

    IterSegTree(const vector<long long>& a) : n((int)a.size()), tree(2 * a.size(), ID) {
        for (int i = 0; i < n; i++) tree[n + i] = makeLeaf(a[i]);
        for (int i = n - 1; i >= 1; i--) {
            tree[i] = mergeNode(tree[i << 1], tree[(i << 1) | 1]);
        }
    }

    void setVal(int p, long long v) {
        p += n;
        tree[p] = makeLeaf(v);
        for (p >>= 1; p >= 1; p >>= 1) {
            tree[p] = mergeNode(tree[p << 1], tree[(p << 1) | 1]);
        }
    }

    // Half-open [l, r) preserving strict left-to-right non-commutative monoid order
    Node query(int l, int r) const {
        Node resL = ID, resR = ID;
        for (l += n, r += n; l < r; l >>= 1, r >>= 1) {
            if (l & 1) resL = mergeNode(resL, tree[l++]);
            if (r & 1) resR = mergeNode(tree[--r], resR);
        }
        return mergeNode(resL, resR);
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, q;
    if (!(cin >> n >> q)) return 0;
    vector<long long> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];

    IterSegTree seg(a);
    while (q--) {
        int type;
        cin >> type;
        if (type == 1) {
            int k;
            long long u;
            cin >> k >> u;
            seg.setVal(k - 1, u);
        } else {
            int l, r;
            cin >> l >> r;
            cout << seg.query(l - 1, r).ans << "\\n";
        }
    }
    return 0;
}`,
    rust: `use std::io::{self, Read};

#[derive(Clone, Copy)]
struct Node {
    sum: i64,
    pref: i64,
    suff: i64,
    ans: i64,
}

const ID: Node = Node { sum: 0, pref: 0, suff: 0, ans: 0 };

#[inline]
fn make_leaf(v: i64) -> Node {
    let p = v.max(0);
    Node { sum: v, pref: p, suff: p, ans: p }
}

#[inline]
fn merge_node(l: Node, r: Node) -> Node {
    Node {
        sum: l.sum + r.sum,
        pref: l.pref.max(l.sum + r.pref),
        suff: r.suff.max(r.sum + l.suff),
        ans: l.ans.max(r.ans).max(l.suff + r.pref),
    }
}

struct IterSegTree {
    n: usize,
    tree: Vec<Node>,
}

impl IterSegTree {
    fn new(a: &[i64]) -> Self {
        let n = a.len();
        let mut tree = vec![ID; 2 * n];
        for i in 0..n {
            tree[n + i] = make_leaf(a[i]);
        }
        for i in (1..n).rev() {
            tree[i] = merge_node(tree[i << 1], tree[(i << 1) | 1]);
        }
        Self { n, tree }
    }

    fn set_val(&mut self, mut p: usize, v: i64) {
        p += self.n;
        self.tree[p] = make_leaf(v);
        p >>= 1;
        while p >= 1 {
            self.tree[p] = merge_node(self.tree[p << 1], self.tree[(p << 1) | 1]);
            p >>= 1;
        }
    }

    fn query(&self, mut l: usize, mut r: usize) -> Node {
        let mut res_l = ID;
        let mut res_r = ID;
        l += self.n;
        r += self.n;
        while l < r {
            if (l & 1) == 1 {
                res_l = merge_node(res_l, self.tree[l]);
                l += 1;
            }
            if (r & 1) == 1 {
                r -= 1;
                res_r = merge_node(self.tree[r], res_r);
            }
            l >>= 1;
            r >>= 1;
        }
        merge_node(res_l, res_r)
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

    let mut seg = IterSegTree::new(&a);
    let mut out = String::new();
    for _ in 0..q {
        let typ: usize = it.next().unwrap().parse().unwrap();
        if typ == 1 {
            let k: usize = it.next().unwrap().parse().unwrap();
            let u: i64 = it.next().unwrap().parse().unwrap();
            seg.set_val(k - 1, u);
        } else {
            let l: usize = it.next().unwrap().parse().unwrap();
            let r: usize = it.next().unwrap().parse().unwrap();
            out.push_str(&format!("{}\\n", seg.query(l - 1, r).ans));
        }
    }
    print!("{}", out);
}`,
    java21: `import java.io.*;

public class Main {
    static class FastScanner {
        private final InputStream in;
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;

        FastScanner(InputStream is) { this.in = is; }

        private int readByte() throws IOException {
            if (ptr >= len) {
                ptr = 0;
                len = in.read(buf);
                if (len <= 0) return -1;
            }
            return buf[ptr++];
        }

        long nextLong() throws IOException {
            int c;
            do {
                c = readByte();
                if (c == -1) return Long.MIN_VALUE;
            } while (c <= ' ');
            long sign = 1;
            if (c == '-') { sign = -1; c = readByte(); }
            long res = 0;
            while (c > ' ') {
                res = res * 10 + (c - '0');
                c = readByte();
            }
            return res * sign;
        }
    }

    static long[] sum, pref, suff, ans;
    static int n;

    static void pull(int p) {
        int lc = p << 1, rc = lc | 1;
        sum[p] = sum[lc] + sum[rc];
        pref[p] = Math.max(pref[lc], sum[lc] + pref[rc]);
        suff[p] = Math.max(suff[rc], sum[rc] + suff[lc]);
        ans[p] = Math.max(Math.max(ans[lc], ans[rc]), suff[lc] + pref[rc]);
    }

    static void setVal(int p, long v) {
        p += n;
        long pos = Math.max(0L, v);
        sum[p] = v; pref[p] = pos; suff[p] = pos; ans[p] = pos;
        for (p >>= 1; p >= 1; p >>= 1) pull(p);
    }

    static long query(int l, int r) {
        long lSum = 0, lPref = 0, lSuff = 0, lAns = 0;
        long rSum = 0, rPref = 0, rSuff = 0, rAns = 0;
        for (l += n, r += n; l < r; l >>= 1, r >>= 1) {
            if ((l & 1) == 1) {
                long nAns = Math.max(Math.max(lAns, ans[l]), lSuff + pref[l]);
                long nPref = Math.max(lPref, lSum + pref[l]);
                long nSuff = Math.max(suff[l], sum[l] + lSuff);
                lSum += sum[l]; lPref = nPref; lSuff = nSuff; lAns = nAns;
                l++;
            }
            if ((r & 1) == 1) {
                --r;
                long nAns = Math.max(Math.max(ans[r], rAns), suff[r] + rPref);
                long nPref = Math.max(pref[r], sum[r] + rPref);
                long nSuff = Math.max(rSuff, rSum + suff[r]);
                rSum = sum[r] + rSum; rPref = nPref; rSuff = nSuff; rAns = nAns;
            }
        }
        return Math.max(Math.max(lAns, rAns), lSuff + rPref);
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        long nLong = fs.nextLong();
        if (nLong == Long.MIN_VALUE) return;
        n = (int) nLong;
        int q = (int) fs.nextLong();

        sum = new long[2 * n];
        pref = new long[2 * n];
        suff = new long[2 * n];
        ans = new long[2 * n];

        for (int i = 0; i < n; i++) {
            long v = fs.nextLong();
            long pos = Math.max(0L, v);
            sum[n + i] = v; pref[n + i] = pos; suff[n + i] = pos; ans[n + i] = pos;
        }
        for (int i = n - 1; i >= 1; i--) pull(i);

        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < q; i++) {
            int typ = (int) fs.nextLong();
            if (typ == 1) {
                int k = (int) fs.nextLong();
                long u = fs.nextLong();
                setVal(k - 1, u);
            } else {
                int l = (int) fs.nextLong();
                int r = (int) fs.nextLong();
                sb.append(query(l - 1, r)).append('\\n');
            }
        }
        System.out.print(sb.toString());
    }
}`,
    python3: `import sys

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    q = int(data[1])
    t_sum = [0] * (2 * n)
    t_pref = [0] * (2 * n)
    t_suff = [0] * (2 * n)
    t_ans = [0] * (2 * n)

    for i in range(n):
        v = int(data[2 + i])
        pos = v if v > 0 else 0
        t_sum[n + i] = v
        t_pref[n + i] = pos
        t_suff[n + i] = pos
        t_ans[n + i] = pos

    for i in range(n - 1, 0, -1):
        lc = i << 1
        rc = lc | 1
        t_sum[i] = t_sum[lc] + t_sum[rc]
        p_cand = t_sum[lc] + t_pref[rc]
        t_pref[i] = t_pref[lc] if t_pref[lc] >= p_cand else p_cand
        s_cand = t_sum[rc] + t_suff[lc]
        t_suff[i] = t_suff[rc] if t_suff[rc] >= s_cand else s_cand
        best = t_ans[lc] if t_ans[lc] >= t_ans[rc] else t_ans[rc]
        mid = t_suff[lc] + t_pref[rc]
        t_ans[i] = best if best >= mid else mid

    def set_val(k: int, v: int) -> None:
        p = n + k
        pos = v if v > 0 else 0
        t_sum[p] = v
        t_pref[p] = pos
        t_suff[p] = pos
        t_ans[p] = pos
        p >>= 1
        while p >= 1:
            lc = p << 1
            rc = lc | 1
            t_sum[p] = t_sum[lc] + t_sum[rc]
            p_cand = t_sum[lc] + t_pref[rc]
            t_pref[p] = t_pref[lc] if t_pref[lc] >= p_cand else p_cand
            s_cand = t_sum[rc] + t_suff[lc]
            t_suff[p] = t_suff[rc] if t_suff[rc] >= s_cand else s_cand
            best = t_ans[lc] if t_ans[lc] >= t_ans[rc] else t_ans[rc]
            mid = t_suff[lc] + t_pref[rc]
            t_ans[p] = best if best >= mid else mid
            p >>= 1

    def query(l: int, r: int) -> int:
        ls = lp = lf = la = 0
        rs = rp = rf = ra = 0
        l += n
        r += n
        while l < r:
            if l & 1:
                la = max(la, t_ans[l], lf + t_pref[l])
                lp = max(lp, ls + t_pref[l])
                lf = max(t_suff[l], t_sum[l] + lf)
                ls += t_sum[l]
                l += 1
            if r & 1:
                r -= 1
                ra = max(t_ans[r], ra, t_suff[r] + rp)
                rp = max(t_pref[r], t_sum[r] + rp)
                rf = max(rf, rs + t_suff[r])
                rs = t_sum[r] + rs
            l >>= 1
            r >>= 1
        return max(la, ra, lf + rp)

    out = []
    idx = 2 + n
    for _ in range(q):
        typ = int(data[idx])
        if typ == 1:
            k = int(data[idx + 1]) - 1
            u = int(data[idx + 2])
            set_val(k, u)
        else:
            l = int(data[idx + 1]) - 1
            r = int(data[idx + 2])
            out.append(str(query(l, r)))
        idx += 3
    sys.stdout.write("\\n".join(out) + "\\n")

if __name__ == "__main__":
    solve()`,
    ruby: `tokens = $stdin.read.split
exit if tokens.empty?
n = tokens[0].to_i
q = tokens[1].to_i

t_sum = Array.new(2 * n, 0)
t_pref = Array.new(2 * n, 0)
t_suff = Array.new(2 * n, 0)
t_ans = Array.new(2 * n, 0)

n.times do |i|
  v = tokens[2 + i].to_i
  pos = v > 0 ? v : 0
  t_sum[n + i] = v
  t_pref[n + i] = pos
  t_suff[n + i] = pos
  t_ans[n + i] = pos
end

pull = lambda do |p|
  lc = p << 1
  rc = lc | 1
  t_sum[p] = t_sum[lc] + t_sum[rc]
  pc = t_sum[lc] + t_pref[rc]
  t_pref[p] = t_pref[lc] >= pc ? t_pref[lc] : pc
  sc = t_sum[rc] + t_suff[lc]
  t_suff[p] = t_suff[rc] >= sc ? t_suff[rc] : sc
  best = t_ans[lc] >= t_ans[rc] ? t_ans[lc] : t_ans[rc]
  mid = t_suff[lc] + t_pref[rc]
  t_ans[p] = best >= mid ? best : mid
end

(n - 1).downto(1) { |i| pull.call(i) }

out = []
idx = 2 + n
q.times do
  typ = tokens[idx].to_i
  if typ == 1
    p = n + tokens[idx + 1].to_i - 1
    v = tokens[idx + 2].to_i
    pos = v > 0 ? v : 0
    t_sum[p] = v; t_pref[p] = pos; t_suff[p] = pos; t_ans[p] = pos
    p >>= 1
    while p >= 1
      pull.call(p)
      p >>= 1
    end
  else
    l = n + tokens[idx + 1].to_i - 1
    r = n + tokens[idx + 2].to_i
    ls = lp = lf = la = 0
    rs = rp = rf = ra = 0
    while l < r
      if (l & 1) == 1
        la = [la, t_ans[l], lf + t_pref[l]].max
        lp = [lp, ls + t_pref[l]].max
        lf = [t_suff[l], t_sum[l] + lf].max
        ls += t_sum[l]
        l += 1
      end
      if (r & 1) == 1
        r -= 1
        ra = [t_ans[r], ra, t_suff[r] + rp].max
        rp = [t_pref[r], t_sum[r] + rp].max
        rf = [rf, rs + t_suff[r]].max
        rs = t_sum[r] + rs
      end
      l >>= 1
      r >>= 1
    end
    out << [la, ra, lf + rp].max.to_s
  end
  idx += 3
end
puts out.join("\\n")`,
  },
  practiceProblems: [
    {
      id: 'ch54-p1',
      tier: 'Warmup',
      ratingRange: '1400–1600',
      title: 'Dynamic Range Minimum Queries (Iterative 2N Tree)',
      statement:
        'Given an array of N integers (`1 <= N <= 2 * 10^5`) and Q queries (`1 <= Q <= 2 * 10^5`), process two query types: `1 k u` updates the value at 1-based position `k` to `u`; `2 a b` prints the minimum value in the inclusive range `[a, b]`.',
      constraints: '1 <= N, Q <= 2 * 10^5, 1 <= x_i, u <= 10^9, 1 <= a <= b <= N',
      sampleInput: `8 4
3 2 4 5 1 1 5 3
2 1 4
2 5 6
1 2 3
2 1 4`,
      sampleOutput: `2
1
3`,
      hints: [
        'Store leaves at indices `N .. 2N - 1` and compute internal minima bottom-up with `tree[i] = min(tree[2*i], tree[2*i + 1])`.',
        'On `1 k u`, overwrite `tree[n + k - 1] = u` and climb ancestors via `p >>= 1`.',
        'On `2 a b`, query the half-open range `[a - 1, b)` starting with `res = +INF`.',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, q;
    if (!(cin >> n >> q)) return 0;
    const long long INF = 4e18;
    vector<long long> tree(2 * n, INF);
    for (int i = 0; i < n; i++) cin >> tree[n + i];
    for (int i = n - 1; i >= 1; i--) tree[i] = min(tree[i << 1], tree[(i << 1) | 1]);

    while (q--) {
        int typ;
        cin >> typ;
        if (typ == 1) {
            int k;
            long long u;
            cin >> k >> u;
            int p = n + k - 1;
            tree[p] = u;
            for (p >>= 1; p >= 1; p >>= 1) {
                tree[p] = min(tree[p << 1], tree[(p << 1) | 1]);
            }
        } else {
            int l, r;
            cin >> l >> r;
            long long ans = INF;
            for (l += n - 1, r += n; l < r; l >>= 1, r >>= 1) {
                if (l & 1) ans = min(ans, tree[l++]);
                if (r & 1) ans = min(ans, tree[--r]);
            }
            cout << ans << "\\n";
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
    let q: usize = it.next().unwrap().parse().unwrap();

    const INF: i64 = i64::MAX / 4;
    let mut tree = vec![INF; 2 * n];
    for i in 0..n {
        tree[n + i] = it.next().unwrap().parse().unwrap();
    }
    for i in (1..n).rev() {
        tree[i] = tree[i << 1].min(tree[(i << 1) | 1]);
    }

    let mut out = String::new();
    for _ in 0..q {
        let typ: usize = it.next().unwrap().parse().unwrap();
        if typ == 1 {
            let k: usize = it.next().unwrap().parse().unwrap();
            let u: i64 = it.next().unwrap().parse().unwrap();
            let mut p = n + k - 1;
            tree[p] = u;
            p >>= 1;
            while p >= 1 {
                tree[p] = tree[p << 1].min(tree[(p << 1) | 1]);
                p >>= 1;
            }
        } else {
            let mut l = n + it.next().unwrap().parse::<usize>().unwrap() - 1;
            let mut r = n + it.next().unwrap().parse::<usize>().unwrap();
            let mut ans = INF;
            while l < r {
                if (l & 1) == 1 {
                    ans = ans.min(tree[l]);
                    l += 1;
                }
                if (r & 1) == 1 {
                    r -= 1;
                    ans = ans.min(tree[r]);
                }
                l >>= 1;
                r >>= 1;
            }
            out.push_str(&format!("{}\\n", ans));
        }
    }
    print!("{}", out);
}`,
        java21: `import java.io.*;

public class Main {
    static class FastScanner {
        private final InputStream in;
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;

        FastScanner(InputStream is) { this.in = is; }

        private int readByte() throws IOException {
            if (ptr >= len) {
                ptr = 0;
                len = in.read(buf);
                if (len <= 0) return -1;
            }
            return buf[ptr++];
        }

        long nextLong() throws IOException {
            int c;
            do {
                c = readByte();
                if (c == -1) return Long.MIN_VALUE;
            } while (c <= ' ');
            long sign = 1;
            if (c == '-') { sign = -1; c = readByte(); }
            long res = 0;
            while (c > ' ') {
                res = res * 10 + (c - '0');
                c = readByte();
            }
            return res * sign;
        }
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        long nLong = fs.nextLong();
        if (nLong == Long.MIN_VALUE) return;
        int n = (int) nLong;
        int q = (int) fs.nextLong();

        long[] tree = new long[2 * n];
        for (int i = 0; i < n; i++) tree[n + i] = fs.nextLong();
        for (int i = n - 1; i >= 1; i--) tree[i] = Math.min(tree[i << 1], tree[(i << 1) | 1]);

        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < q; i++) {
            int typ = (int) fs.nextLong();
            if (typ == 1) {
                int p = n + (int) fs.nextLong() - 1;
                tree[p] = fs.nextLong();
                for (p >>= 1; p >= 1; p >>= 1) {
                    tree[p] = Math.min(tree[p << 1], tree[(p << 1) | 1]);
                }
            } else {
                int l = n + (int) fs.nextLong() - 1;
                int r = n + (int) fs.nextLong();
                long ans = Long.MAX_VALUE;
                while (l < r) {
                    if ((l & 1) == 1) ans = Math.min(ans, tree[l++]);
                    if ((r & 1) == 1) ans = Math.min(ans, tree[--r]);
                    l >>= 1;
                    r >>= 1;
                }
                sb.append(ans).append('\\n');
            }
        }
        System.out.print(sb.toString());
    }
}`,
        python3: `import sys

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    q = int(data[1])
    INF = 10**18
    tree = [INF] * (2 * n)
    for i in range(n):
        tree[n + i] = int(data[2 + i])
    for i in range(n - 1, 0, -1):
        lc = tree[i << 1]
        rc = tree[(i << 1) | 1]
        tree[i] = lc if lc <= rc else rc

    out = []
    idx = 2 + n
    for _ in range(q):
        typ = int(data[idx])
        if typ == 1:
            p = n + int(data[idx + 1]) - 1
            tree[p] = int(data[idx + 2])
            p >>= 1
            while p >= 1:
                lc = tree[p << 1]
                rc = tree[(p << 1) | 1]
                tree[p] = lc if lc <= rc else rc
                p >>= 1
        else:
            l = n + int(data[idx + 1]) - 1
            r = n + int(data[idx + 2])
            ans = INF
            while l < r:
                if l & 1:
                    if tree[l] < ans:
                        ans = tree[l]
                    l += 1
                if r & 1:
                    r -= 1
                    if tree[r] < ans:
                        ans = tree[r]
                l >>= 1
                r >>= 1
            out.append(str(ans))
        idx += 3
    sys.stdout.write("\\n".join(out) + "\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
n = tokens[0].to_i
q = tokens[1].to_i

INF = 10**18
tree = Array.new(2 * n, INF)
n.times { |i| tree[n + i] = tokens[2 + i].to_i }
(n - 1).downto(1) do |i|
  lc = tree[i << 1]; rc = tree[(i << 1) | 1]
  tree[i] = lc <= rc ? lc : rc
end

out = []
idx = 2 + n
q.times do
  typ = tokens[idx].to_i
  if typ == 1
    p = n + tokens[idx + 1].to_i - 1
    tree[p] = tokens[idx + 2].to_i
    p >>= 1
    while p >= 1
      lc = tree[p << 1]; rc = tree[(p << 1) | 1]
      tree[p] = lc <= rc ? lc : rc
      p >>= 1
    end
  else
    l = n + tokens[idx + 1].to_i - 1
    r = n + tokens[idx + 2].to_i
    ans = INF
    while l < r
      if (l & 1) == 1
        ans = tree[l] if tree[l] < ans
        l += 1
      end
      if (r & 1) == 1
        r -= 1
        ans = tree[r] if tree[r] < ans
      end
      l >>= 1
      r >>= 1
    end
    out << ans.to_s
  end
  idx += 3
end
puts out.join("\\n")`,
      },
    },
    {
      id: 'ch54-p2',
      tier: 'Standard',
      ratingRange: '1600–1800',
      title: 'Hotel Queries (First Index >= X via Segment Tree Walk)',
      statement:
        'There are N hotels on a street (`1 <= N <= 2 * 10^5`), where hotel `i` has `h_i` free rooms. Process M tourist groups (`1 <= M <= 2 * 10^5`) arriving sequentially: group `j` requires `r_j` rooms and is assigned to the FIRST hotel (smallest 1-based index) with at least `r_j` available rooms, reducing its rooms by `r_j`. Print `0` if no such hotel exists.',
      constraints: '1 <= N, M <= 2 * 10^5, 1 <= h_i, r_j <= 10^9',
      sampleInput: `8 5
3 2 4 1 5 5 2 6
4 4 7 1 1`,
      sampleOutput: `3 5 0 1 1`,
      hints: [
        'Build a recursive Max Segment Tree `tree` over `h_1..h_N`.',
        'If `tree[1] < req`, immediately print `0` in O(1).',
        'Otherwise walk down in a single O(log N) pass: at internal node `node`, if `tree[2*node] >= req` descend left (`2*node`), else descend right (`2*node + 1`), decrement leaf `tree[node] -= req`, and pull parents on unwind.',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, m;
    if (!(cin >> n >> m)) return 0;
    vector<long long> h(n);
    for (int i = 0; i < n; i++) cin >> h[i];

    vector<long long> tree(4 * n, 0);
    auto build = [&](auto& self, int node, int l, int r) -> void {
        if (l == r) {
            tree[node] = h[l];
            return;
        }
        int mid = (l + r) >> 1;
        self(self, node * 2, l, mid);
        self(self, node * 2 + 1, mid + 1, r);
        tree[node] = max(tree[node * 2], tree[node * 2 + 1]);
    };
    build(build, 1, 0, n - 1);

    auto walkAndDeduct = [&](auto& self, int node, int l, int r, long long req) -> int {
        if (l == r) {
            tree[node] -= req;
            return l + 1;
        }
        int mid = (l + r) >> 1;
        int res;
        if (tree[node * 2] >= req) res = self(self, node * 2, l, mid, req);
        else res = self(self, node * 2 + 1, mid + 1, r, req);
        tree[node] = max(tree[node * 2], tree[node * 2 + 1]);
        return res;
    };

    for (int j = 0; j < m; j++) {
        long long req;
        cin >> req;
        if (tree[1] < req) {
            cout << 0 << (j + 1 == m ? '\\n' : ' ');
        } else {
            cout << walkAndDeduct(walkAndDeduct, 1, 0, n - 1, req) << (j + 1 == m ? '\\n' : ' ');
        }
    }
    return 0;
}`,
        rust: `use std::io::{self, Read};

struct MaxSegTree {
    tree: Vec<i64>,
}

impl MaxSegTree {
    fn build_rec(tree: &mut [i64], a: &[i64], node: usize, l: usize, r: usize) {
        if l == r {
            tree[node] = a[l];
            return;
        }
        let mid = (l + r) >> 1;
        Self::build_rec(tree, a, node * 2, l, mid);
        Self::build_rec(tree, a, node * 2 + 1, mid + 1, r);
        tree[node] = tree[node * 2].max(tree[node * 2 + 1]);
    }

    fn new(a: &[i64]) -> Self {
        let n = a.len();
        let mut tree = vec![0; 4 * n];
        Self::build_rec(&mut tree, a, 1, 0, n - 1);
        Self { tree }
    }

    fn walk_deduct(&mut self, node: usize, l: usize, r: usize, req: i64) -> usize {
        if l == r {
            self.tree[node] -= req;
            return l + 1;
        }
        let mid = (l + r) >> 1;
        let res = if self.tree[node * 2] >= req {
            self.walk_deduct(node * 2, l, mid, req)
        } else {
            self.walk_deduct(node * 2 + 1, mid + 1, r, req)
        };
        self.tree[node] = self.tree[node * 2].max(self.tree[node * 2 + 1]);
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
    let m: usize = it.next().unwrap().parse().unwrap();
    let mut a = Vec::with_capacity(n);
    for _ in 0..n {
        a.push(it.next().unwrap().parse().unwrap());
    }

    let mut seg = MaxSegTree::new(&a);
    let mut out = Vec::with_capacity(m);
    for _ in 0..m {
        let req: i64 = it.next().unwrap().parse().unwrap();
        if seg.tree[1] < req {
            out.push("0".to_string());
        } else {
            out.push(seg.walk_deduct(1, 0, n - 1, req).to_string());
        }
    }
    println!("{}", out.join(" "));
}`,
        java21: `import java.io.*;

public class Main {
    static class FastScanner {
        private final InputStream in;
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;

        FastScanner(InputStream is) { this.in = is; }

        private int readByte() throws IOException {
            if (ptr >= len) {
                ptr = 0;
                len = in.read(buf);
                if (len <= 0) return -1;
            }
            return buf[ptr++];
        }

        long nextLong() throws IOException {
            int c;
            do {
                c = readByte();
                if (c == -1) return Long.MIN_VALUE;
            } while (c <= ' ');
            long sign = 1;
            if (c == '-') { sign = -1; c = readByte(); }
            long res = 0;
            while (c > ' ') {
                res = res * 10 + (c - '0');
                c = readByte();
            }
            return res * sign;
        }
    }

    static long[] tree, h;

    static void build(int node, int l, int r) {
        if (l == r) {
            tree[node] = h[l];
            return;
        }
        int mid = (l + r) >>> 1;
        build(node * 2, l, mid);
        build(node * 2 + 1, mid + 1, r);
        tree[node] = Math.max(tree[node * 2], tree[node * 2 + 1]);
    }

    static int walkDeduct(int node, int l, int r, long req) {
        if (l == r) {
            tree[node] -= req;
            return l + 1;
        }
        int mid = (l + r) >>> 1;
        int res = tree[node * 2] >= req
                ? walkDeduct(node * 2, l, mid, req)
                : walkDeduct(node * 2 + 1, mid + 1, r, req);
        tree[node] = Math.max(tree[node * 2], tree[node * 2 + 1]);
        return res;
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        long nLong = fs.nextLong();
        if (nLong == Long.MIN_VALUE) return;
        int n = (int) nLong;
        int m = (int) fs.nextLong();

        h = new long[n];
        for (int i = 0; i < n; i++) h[i] = fs.nextLong();
        tree = new long[4 * n];
        build(1, 0, n - 1);

        StringBuilder sb = new StringBuilder();
        for (int j = 0; j < m; j++) {
            long req = fs.nextLong();
            int ans = tree[1] < req ? 0 : walkDeduct(1, 0, n - 1, req);
            if (j > 0) sb.append(' ');
            sb.append(ans);
        }
        System.out.println(sb.toString());
    }
}`,
        python3: `import sys

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    m = int(data[1])
    h = [int(data[2 + i]) for i in range(n)]

    # Iterative power-of-2 padded max segment tree for ultra-fast O(log N) descent in Python
    sz = 1
    while sz < n:
        sz <<= 1
    tree = [0] * (2 * sz)
    for i in range(n):
        tree[sz + i] = h[i]
    for i in range(sz - 1, 0, -1):
        lc = tree[i << 1]
        rc = tree[(i << 1) | 1]
        tree[i] = lc if lc >= rc else rc

    out = []
    base = 2 + n
    for j in range(m):
        req = int(data[base + j])
        if tree[1] < req:
            out.append("0")
            continue
        node = 1
        while node < sz:
            lc = node << 1
            node = lc if tree[lc] >= req else lc | 1
        idx = node - sz + 1
        tree[node] -= req
        node >>= 1
        while node >= 1:
            lc = tree[node << 1]
            rc = tree[(node << 1) | 1]
            tree[node] = lc if lc >= rc else rc
            node >>= 1
        out.append(str(idx))

    sys.stdout.write(" ".join(out) + "\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
n = tokens[0].to_i
m = tokens[1].to_i

sz = 1
sz <<= 1 while sz < n
tree = Array.new(2 * sz, 0)
n.times { |i| tree[sz + i] = tokens[2 + i].to_i }
(sz - 1).downto(1) do |i|
  lc = tree[i << 1]; rc = tree[(i << 1) | 1]
  tree[i] = lc >= rc ? lc : rc
end

out = []
base = 2 + n
m.times do |j|
  req = tokens[base + j].to_i
  if tree[1] < req
    out << "0"
    next
  end
  node = 1
  while node < sz
    lc = node << 1
    node = tree[lc] >= req ? lc : (lc | 1)
  end
  idx = node - sz + 1
  tree[node] -= req
  node >>= 1
  while node >= 1
    lc = tree[node << 1]; rc = tree[(node << 1) | 1]
    tree[node] = lc >= rc ? lc : rc
    node >>= 1
  end
  out << idx.to_s
end
puts out.join(" ")`,
      },
    },
    {
      id: 'ch54-p3',
      tier: 'Boss',
      ratingRange: '1800–2000',
      title: 'Subarray Sum Queries (4-Field Associative Monoid)',
      statement:
        'Given an array of N integers (`1 <= N <= 2 * 10^5`, `-10^9 <= x_i <= 10^9`) and M point updates (`1 <= M <= 2 * 10^5`), each setting `a[k] = x`, output the maximum contiguous subarray sum of the entire array (empty subarray allowed with sum 0) after every single update.',
      constraints: '1 <= N, M <= 2 * 10^5, -10^9 <= a_i, x <= 10^9',
      sampleInput: `5 3
1 2 -3 5 -1
2 6
3 1
2 -2`,
      sampleOutput: `9
13
6`,
      hints: [
        'Each Segment Tree node stores four fields: `{sum, pref, suff, ans}`.',
        'Leaf `v` initializes `{sum: v, pref: max(0, v), suff: max(0, v), ans: max(0, v)}`.',
        'Merge children `L` and `R`: `sum = L.sum + R.sum`, `pref = max(L.pref, L.sum + R.pref)`, `suff = max(R.suff, R.sum + L.suff)`, `ans = max(L.ans, R.ans, L.suff + R.pref)`. Global max is simply `tree[1].ans`!',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

struct Node {
    long long sum, pref, suff, ans;
};

Node makeLeaf(long long v) {
    long long p = max(0LL, v);
    return {v, p, p, p};
}

Node mergeNode(const Node& L, const Node& R) {
    return {
        L.sum + R.sum,
        max(L.pref, L.sum + R.pref),
        max(R.suff, R.sum + L.suff),
        max({L.ans, R.ans, L.suff + R.pref})
    };
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, m;
    if (!(cin >> n >> m)) return 0;
    vector<Node> tree(2 * n);
    for (int i = 0; i < n; i++) {
        long long v;
        cin >> v;
        tree[n + i] = makeLeaf(v);
    }
    for (int i = n - 1; i >= 1; i--) {
        tree[i] = mergeNode(tree[i << 1], tree[(i << 1) | 1]);
    }

    while (m--) {
        int k;
        long long x;
        cin >> k >> x;
        int p = n + k - 1;
        tree[p] = makeLeaf(x);
        for (p >>= 1; p >= 1; p >>= 1) {
            tree[p] = mergeNode(tree[p << 1], tree[(p << 1) | 1]);
        }
        // Note: For arbitrary non-power-of-two N, root tree[1] contains all N elements ONLY if N is power of 2 or we query [0, n)!
        // For general N in a 2N iterative tree, tree[1] merges pairs up from leaves cleanly ONLY when queries call query(0, n).
        // Let's query [0, n) so non-power-of-two N (like N = 5) stays 100% order-exact!
        Node resL = {0, 0, 0, 0}, resR = {0, 0, 0, 0};
        for (int l = n, r = 2 * n; l < r; l >>= 1, r >>= 1) {
            if (l & 1) resL = mergeNode(resL, tree[l++]);
            if (r & 1) resR = mergeNode(tree[--r], resR);
        }
        cout << mergeNode(resL, resR).ans << "\\n";
    }
    return 0;
}`,
        rust: `use std::io::{self, Read};

#[derive(Clone, Copy)]
struct Node {
    sum: i64,
    pref: i64,
    suff: i64,
    ans: i64,
}

#[inline]
fn make_leaf(v: i64) -> Node {
    let p = v.max(0);
    Node { sum: v, pref: p, suff: p, ans: p }
}

#[inline]
fn merge_node(l: Node, r: Node) -> Node {
    Node {
        sum: l.sum + r.sum,
        pref: l.pref.max(l.sum + r.pref),
        suff: r.suff.max(r.sum + l.suff),
        ans: l.ans.max(r.ans).max(l.suff + r.pref),
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
    let m: usize = it.next().unwrap().parse().unwrap();

    let mut tree = vec![Node { sum: 0, pref: 0, suff: 0, ans: 0 }; 2 * n];
    for i in 0..n {
        let v: i64 = it.next().unwrap().parse().unwrap();
        tree[n + i] = make_leaf(v);
    }
    for i in (1..n).rev() {
        tree[i] = merge_node(tree[i << 1], tree[(i << 1) | 1]);
    }

    let mut out = String::new();
    for _ in 0..m {
        let k: usize = it.next().unwrap().parse().unwrap();
        let x: i64 = it.next().unwrap().parse().unwrap();
        let mut p = n + k - 1;
        tree[p] = make_leaf(x);
        p >>= 1;
        while p >= 1 {
            tree[p] = merge_node(tree[p << 1], tree[(p << 1) | 1]);
            p >>= 1;
        }
        let (mut l, mut r) = (n, 2 * n);
        let mut res_l = Node { sum: 0, pref: 0, suff: 0, ans: 0 };
        let mut res_r = Node { sum: 0, pref: 0, suff: 0, ans: 0 };
        while l < r {
            if (l & 1) == 1 { res_l = merge_node(res_l, tree[l]); l += 1; }
            if (r & 1) == 1 { r -= 1; res_r = merge_node(tree[r], res_r); }
            l >>= 1;
            r >>= 1;
        }
        out.push_str(&format!("{}\\n", merge_node(res_l, res_r).ans));
    }
    print!("{}", out);
}`,
        java21: `import java.io.*;

public class Main {
    static class FastScanner {
        private final InputStream in;
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;

        FastScanner(InputStream is) { this.in = is; }

        private int readByte() throws IOException {
            if (ptr >= len) {
                ptr = 0;
                len = in.read(buf);
                if (len <= 0) return -1;
            }
            return buf[ptr++];
        }

        long nextLong() throws IOException {
            int c;
            do {
                c = readByte();
                if (c == -1) return Long.MIN_VALUE;
            } while (c <= ' ');
            long sign = 1;
            if (c == '-') { sign = -1; c = readByte(); }
            long res = 0;
            while (c > ' ') {
                res = res * 10 + (c - '0');
                c = readByte();
            }
            return res * sign;
        }
    }

    static long[] sum, pref, suff, ans;

    static void pull(int p) {
        int lc = p << 1, rc = lc | 1;
        sum[p] = sum[lc] + sum[rc];
        pref[p] = Math.max(pref[lc], sum[lc] + pref[rc]);
        suff[p] = Math.max(suff[rc], sum[rc] + suff[lc]);
        ans[p] = Math.max(Math.max(ans[lc], ans[rc]), suff[lc] + pref[rc]);
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        long nLong = fs.nextLong();
        if (nLong == Long.MIN_VALUE) return;
        int n = (int) nLong;
        int m = (int) fs.nextLong();

        // Pad to power of 2 so tree[1] directly holds ordered full-array maximum subarray
        int sz = 1;
        while (sz < n) sz <<= 1;

        sum = new long[2 * sz];
        pref = new long[2 * sz];
        suff = new long[2 * sz];
        ans = new long[2 * sz];

        for (int i = 0; i < n; i++) {
            long v = fs.nextLong();
            long pos = Math.max(0L, v);
            sum[sz + i] = v; pref[sz + i] = pos; suff[sz + i] = pos; ans[sz + i] = pos;
        }
        for (int i = sz - 1; i >= 1; i--) pull(i);

        StringBuilder sb = new StringBuilder();
        for (int j = 0; j < m; j++) {
            int p = sz + (int) fs.nextLong() - 1;
            long x = fs.nextLong();
            long pos = Math.max(0L, x);
            sum[p] = x; pref[p] = pos; suff[p] = pos; ans[p] = pos;
            for (p >>= 1; p >= 1; p >>= 1) pull(p);
            sb.append(ans[1]).append('\\n');
        }
        System.out.print(sb.toString());
    }
}`,
        python3: `import sys

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    m = int(data[1])

    sz = 1
    while sz < n:
        sz <<= 1
    t_sum = [0] * (2 * sz)
    t_pref = [0] * (2 * sz)
    t_suff = [0] * (2 * sz)
    t_ans = [0] * (2 * sz)

    for i in range(n):
        v = int(data[2 + i])
        pos = v if v > 0 else 0
        t_sum[sz + i] = v
        t_pref[sz + i] = pos
        t_suff[sz + i] = pos
        t_ans[sz + i] = pos

    for i in range(sz - 1, 0, -1):
        lc = i << 1
        rc = lc | 1
        t_sum[i] = t_sum[lc] + t_sum[rc]
        pc = t_sum[lc] + t_pref[rc]
        t_pref[i] = t_pref[lc] if t_pref[lc] >= pc else pc
        sc = t_sum[rc] + t_suff[lc]
        t_suff[i] = t_suff[rc] if t_suff[rc] >= sc else sc
        best = t_ans[lc] if t_ans[lc] >= t_ans[rc] else t_ans[rc]
        mid = t_suff[lc] + t_pref[rc]
        t_ans[i] = best if best >= mid else mid

    out = []
    idx = 2 + n
    for _ in range(m):
        p = sz + int(data[idx]) - 1
        x = int(data[idx + 1])
        idx += 2
        pos = x if x > 0 else 0
        t_sum[p] = x
        t_pref[p] = pos
        t_suff[p] = pos
        t_ans[p] = pos
        p >>= 1
        while p >= 1:
            lc = p << 1
            rc = lc | 1
            t_sum[p] = t_sum[lc] + t_sum[rc]
            pc = t_sum[lc] + t_pref[rc]
            t_pref[p] = t_pref[lc] if t_pref[lc] >= pc else pc
            sc = t_sum[rc] + t_suff[lc]
            t_suff[p] = t_suff[rc] if t_suff[rc] >= sc else sc
            best = t_ans[lc] if t_ans[lc] >= t_ans[rc] else t_ans[rc]
            mid = t_suff[lc] + t_pref[rc]
            t_ans[p] = best if best >= mid else mid
            p >>= 1
        out.append(str(t_ans[1]))

    sys.stdout.write("\\n".join(out) + "\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
n = tokens[0].to_i
m = tokens[1].to_i

sz = 1
sz <<= 1 while sz < n
t_sum = Array.new(2 * sz, 0)
t_pref = Array.new(2 * sz, 0)
t_suff = Array.new(2 * sz, 0)
t_ans = Array.new(2 * sz, 0)

n.times do |i|
  v = tokens[2 + i].to_i
  pos = v > 0 ? v : 0
  t_sum[sz + i] = v; t_pref[sz + i] = pos; t_suff[sz + i] = pos; t_ans[sz + i] = pos
end

pull = lambda do |p|
  lc = p << 1; rc = lc | 1
  t_sum[p] = t_sum[lc] + t_sum[rc]
  pc = t_sum[lc] + t_pref[rc]
  t_pref[p] = t_pref[lc] >= pc ? t_pref[lc] : pc
  sc = t_sum[rc] + t_suff[lc]
  t_suff[p] = t_suff[rc] >= sc ? t_suff[rc] : sc
  best = t_ans[lc] >= t_ans[rc] ? t_ans[lc] : t_ans[rc]
  mid = t_suff[lc] + t_pref[rc]
  t_ans[p] = best >= mid ? best : mid
end

(sz - 1).downto(1) { |i| pull.call(i) }

out = []
idx = 2 + n
m.times do
  p = sz + tokens[idx].to_i - 1
  x = tokens[idx + 1].to_i
  idx += 2
  pos = x > 0 ? x : 0
  t_sum[p] = x; t_pref[p] = pos; t_suff[p] = pos; t_ans[p] = pos
  p >>= 1
  while p >= 1
    pull.call(p)
    p >>= 1
  end
  out << t_ans[1].to_s
end
puts out.join("\\n")`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'CSES',
      title: 'Dynamic Range Minimum / Hotel / Subarray Sum Queries',
      difficulty: 'Gold',
      url: 'https://cses.fi/problemset/task/1649',
      patternNote: 'Canonical benchmarks for 2N iterative trees, binary walks, and 4-field monoids.',
    },
    {
      platform: 'Codeforces',
      title: 'Xenia and Bit Operations / Sereja and Brackets (380C)',
      difficulty: '1700–2000',
      url: 'https://codeforces.com/problemset/problem/380/C',
      patternNote: 'Non-commutative bracket-matching monoid {matched, open, close} over `[l, r)` queries.',
    },
    {
      platform: 'AtCoder',
      title: 'ACL Practice J — Segment Tree (Binary Walk)',
      difficulty: '1500',
      url: 'https://atcoder.jp/contests/practice2/tasks/practice2_j',
      patternNote: 'Official AtCoder Library `max_right` segment tree binary walk problem.',
    },
    {
      platform: 'CodeChef',
      title: 'Range Minimum & GSS1/GSS3 Subarray Monoids',
      difficulty: '1750',
      url: 'https://www.codechef.com',
      patternNote: 'Merge prefix/suffix/total/best fields without handling empty-subarray overflow.',
    },
    {
      platform: 'HackerRank',
      title: 'Direct Connections / Array Queries',
      difficulty: 'Medium–Hard',
      url: 'https://www.hackerrank.com/challenges',
      patternNote: 'Cache-friendly iterative 2N queries outperform top-down recursion by 3x on tight time limits.',
    },
    {
      platform: 'NeetCode 150',
      title: 'Range Sum Query Mutable (307) & Falling Squares (699)',
      difficulty: 'Medium–Hard',
      url: 'https://leetcode.com/problems/range-sum-query-mutable/',
      patternNote: 'Upgrade mutable point-range queries to generalized iterative monoids.',
    },
  ],
  interviewNotes: [
    'Why must a `2N` iterative Segment Tree maintain both `resL` and `resR` separately when `merge()` is non-commutative? Because `l++` traverses intervals left-to-right while `--r` traverses right-to-left; merging `resL = merge(resL, tree[l++])` and `resR = merge(tree[--r], resR)` guarantees exact `[l, r)` order.',
    'Note the power-of-2 padding subtlety: when querying the whole array via `tree[1]` alone (like `ans[1]`), pad `sz` to the next power of 2 so `tree[1]` represents `[0..sz-1]` in strict left-to-right order! In an unpadded `2N` tree (e.g. `N = 5`), `tree[1]` wraps around midpoints unless you call `query(0, N)`.',
    'How does a Segment Tree Binary Walk drop complexity from `O(log^2 N)` to `O(log N)`? By checking the left child aggregate at each level during a single top-down descent instead of executing binary search around `O(log N)` separate `query()` calls.',
  ],
  projectBlueprint: {
    title: 'Low-Latency Order-Book & Sliding-Window Financial Aggregator',
    tagline:
      'Flat-array `2N` monoid aggregation engine computing real-time max drawdown, net cumulative tick profit, and liquidity depth queries in sub-microsecond iterative loops.',
    stackSummary: 'TypeScript Float64/Int64 Monoid Segment Tree Engine',
    asciiDiagram: `[Price Tick Delta Updates] ---> [Bottom-Up 2N Array: p >>= 1]
                                         |
[Order-Book Range Query [L, R)] --> [resL = merge(resL, l++) | resR = merge(--r, resR)]`,
    milestones: [
      {
        id: 'm1',
        title: 'Flat 2N Buffer Allocator',
        detail: 'Pack leaf records at offset N and initialize parent monoids in a single reverse loop.',
      },
      {
        id: 'm2',
        title: 'Non-Commutative Max-Subarray Monoid',
        detail: 'Track net volume, max prefix, max suffix, and max contiguous rally across arbitrary `[l, r)` windows.',
      },
      {
        id: 'm3',
        title: 'Liquidity Threshold Binary Walk',
        detail: 'Locate the earliest price bucket meeting minimum lot depth in a single O(log N) tree descent.',
      },
    ],
    starterCode: `export interface SubarrayNode {
  sum: number;
  pref: number;
  suff: number;
  ans: number;
}

const mergeNode = (L: SubarrayNode, R: SubarrayNode): SubarrayNode => ({
  sum: L.sum + R.sum,
  pref: Math.max(L.pref, L.sum + R.pref),
  suff: Math.max(R.suff, R.sum + L.suff),
  ans: Math.max(L.ans, R.ans, L.suff + R.pref),
});

export class OrderBookMonoidTree {
  private n: number;
  private tree: SubarrayNode[];

  constructor(values: number[]) {
    this.n = values.length;
    this.tree = Array.from({ length: 2 * this.n }, () => ({ sum: 0, pref: 0, suff: 0, ans: 0 }));
    for (let i = 0; i < this.n; i++) {
      const v = values[i];
      const pos = Math.max(0, v);
      this.tree[this.n + i] = { sum: v, pref: pos, suff: pos, ans: pos };
    }
    for (let i = this.n - 1; i >= 1; i--) {
      this.tree[i] = mergeNode(this.tree[i << 1], this.tree[(i << 1) | 1]);
    }
  }

  update(idx: number, v: number): void {
    let p = this.n + idx;
    const pos = Math.max(0, v);
    this.tree[p] = { sum: v, pref: pos, suff: pos, ans: pos };
    for (p >>= 1; p >= 1; p >>= 1) {
      this.tree[p] = mergeNode(this.tree[p << 1], this.tree[(p << 1) | 1]);
    }
  }

  queryMaxRally(l: number, r: number): number {
    let resL: SubarrayNode = { sum: 0, pref: 0, suff: 0, ans: 0 };
    let resR: SubarrayNode = { sum: 0, pref: 0, suff: 0, ans: 0 };
    for (l += this.n, r += this.n; l < r; l >>= 1, r >>= 1) {
      if (l & 1) resL = mergeNode(resL, this.tree[l++]);
      if (r & 1) resR = mergeNode(this.tree[--r], resR);
    }
    return mergeNode(resL, resR).ans;
  }
}

const book = new OrderBookMonoidTree([1, 6, -3, 5, -1]);
console.log('Max rally [0, 5):', book.queryMaxRally(0, 5));`,
  },
};
