import type { TheoryChapter } from '../../types/vault';

export const CH70_DYNAMIC_DP_MATRIX_SEGTREE: TheoryChapter = {
  slug: 'dynamic-dp-matrix-segtree',
  topicId: 'dp-28',
  title: 'Dynamic DP (Matrix Monoids on HLD / Segtree)',
  domain: 'Search, Greedy & DP',
  ratingTier: '2600–3300+',
  usacoDivision: 'Advanced',
  subtitle: 'Linearizing tree and sequence recurrences into associative (max, +) matrix products on Heavy-Light chains for O(Q log^2 N) updates',
  analogyTitle: 'Replacing Re-Computed Subtree Loops with Associative Matrix Snap-Ins',
  analogyBody:
    'Standard Tree DP computes f[u] bottom-up in O(N), so changing a single vertex weight w[u] forces recomputing the entire root-to-u path in O(N) time—or O(N Q) across Q updates.\n\nDynamic DP exploits the fact that Heavy-Light Decomposition turns every root-to-u path into O(log N) contiguous heavy chains connected by light edges. By pulling out all light-child sums into auxiliary values g[u], every transition from heavy child h to parent u becomes an associative 2x2 or 3x3 matrix multiplication in the (max, +) tropical semiring: [f[u][0], f[u][1]]^T = M[u] * [f[h][0], f[h][1]]^T.\n\nSince matrix multiplication is associative, storing M[v] in a Segment Tree along HLD Euler order lets a point update to w[u] recalculate the entire heavy chain’s DP matrix in O(log N), adjust light-child totals at the chain parent p, and bubble up at most O(log N) chains—giving O(Q log^2 N) dynamic updates.',
  prerequisites: [
    { slug: 'segment-tree-point-range', title: 'Iterative & Recursive Segment Trees' },
  ],
  traceTitle: 'Propagating a Tree MWIS Weight Update up HLD Chains',
  traceSubtitle: 'Converting node weights into 2x2 (max, +) matrices and updating node 4 from 40 to 200',
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Heavy-Light Decomposition & Initial Static Tree DP',
      explanation: 'On tree 1-2, 1-3, 2-4 with w=[10, 20, 30, 40]: heavy chain C1=[1, 2, 4] (dfn 1..3), light chain C2=[3] (dfn 4). Node 3 is a light child of 1, so g[1] absorbs f[3]=[0, 30].',
      mode: 'array',
      arrays: [
        {
          name: 'HLD Euler Order & Light Sums g[u][0/1]',
          cells: [
            { index: 1, value: '30 / 10', label: 'n1(top)', highlight: 'active' },
            { index: 2, value: '0 / 20', label: 'n2', highlight: 'neutral' },
            { index: 3, value: '0 / 40', label: 'n4(tail)', highlight: 'neutral' },
            { index: 4, value: '0 / 30', label: 'n3(light)', highlight: 'neutral' },
          ],
        },
      ],
      variables: { globalMWIS: 70, heavyChains: 2, activeRootMatrix: '[30, 10]' },
    },
    {
      stepNumber: 2,
      title: 'Encode Node Transition as 2x2 (max, +) Matrix M[u]',
      explanation: 'Define M[u] = [[g[u][0], g[u][0]], [g[u][1], -INF]]. Multiplying M[head] * ... * M[tail] along a chain gives f[head][0] = max(P[0][0], P[0][1]) and f[head][1] = max(P[1][0], P[1][1]).',
      mode: 'array',
      arrays: [
        {
          name: 'Flattened Matrix M[1] = [[30, 30], [10, -INF]]',
          cells: [
            { index: 0, value: 30, label: 'M[0][0]', highlight: 'active' },
            { index: 1, value: 30, label: 'M[0][1]', highlight: 'active' },
            { index: 2, value: 10, label: 'M[1][0]', highlight: 'updated' },
            { index: 3, value: '-INF', label: 'M[1][1]', highlight: 'neutral' },
          ],
        },
      ],
      variables: { semiring: '(max, +)', f_root_0: 70, f_root_1: 50 },
    },
    {
      stepNumber: 3,
      title: 'Point Update: w[4] Changes from 40 to 200',
      explanation: 'Adjust M[4][1][0] by +(200 - 40) = +160. Query old chain C1 matrix, update segtree at dfn[4]=3, then re-query chain C1 to propagate upward if top[4] has a parent.',
      mode: 'array',
      arrays: [
        {
          name: 'Updated Heavy Chain C1=[1, 2, 4] Product P',
          cells: [
            { index: 0, value: 230, label: 'f[1][0]=max(P[0])', highlight: 'updated' },
            { index: 1, value: 210, label: 'f[1][1]=max(P[1])', highlight: 'active' },
          ],
        },
      ],
      variables: { updatedNode: 4, delta: '+160', newGlobalMWIS: 230 },
    },
    {
      stepNumber: 4,
      title: 'Bubble Light-Child Delta Across Chain Jumps',
      explanation: 'When updating node 3 (whose chain top is 3 with parent 1), compute delta0 = max(newF) - max(oldF) and delta1 = newF[0] - oldF[0], patch g[1], update dfn[1], and stop at root.',
      mode: 'array',
      arrays: [
        {
          name: 'Root Chain Product After Bubbling',
          cells: [
            { index: 0, value: 230, label: 'ans=max(f[1])', highlight: 'updated' },
            { index: 1, value: 'O(log^2 N)', label: 'work', highlight: 'active' },
          ],
        },
      ],
      variables: { segtreeUpdates: 1, totalChainJumps: 1, verdict: 'Exact' },
    },
  ],
  reductionClues: [
    {
      clue: 'Point updates on an array asking for maximum subarray sum, house-robber DP, or state-machine counts on [L, R]',
      translation: 'Represent one array element as a 2x2 or 3x3 (max, +) / (+, *) matrix and maintain range matrix products in a Segment Tree in O(log N) per query.',
    },
    {
      clue: 'Tree DP (Maximum Weight Independent Set, Vertex Cover) with online point weight modifications',
      translation: 'Apply HLD; pack light-child contributions into g[u] and heavy-child transitions into 2x2 (max, +) matrices stored on the Euler-tour Segment Tree.',
    },
    {
      clue: 'Light-child aggregation uses max (Dynamic Tree Diameter) or mod-P product (coloring counts) that cannot simply subtract',
      translation: 'Maintain each node’s light-child contributions in a lazy-deletion max-heap (for max) or (nonZero, zeroCount) pairs (for mod-P product).',
    },
  ],
  timeComplexity: 'O(K^3 log N) per array update/query; O(K^3 log^2 N) per tree update via HLD (K = matrix dimension <= 3)',
  spaceComplexity: 'O(K^2 N) segment tree storage + O(N log N) if auxiliary heaps are kept',
  pitfalls: [
    {
      type: 'WA',
      title: 'Multiplying Segment Tree Matrices in Commuted Order',
      detail: '(max, +) matrix multiplication is associative but NOT commutative. If your HLD Euler order puts shallower vertices (closer to root) at smaller indices, tree[node] MUST combine as mul(tree[2*node], tree[2*node+1]) so chain products evaluate top-to-bottom M[head] * ... * M[tail].',
    },
    {
      type: 'WA',
      title: 'Arithmetic Overflow When Adding Weights to -INF',
      detail: 'If -INF is set to LLONG_MIN, adding a negative weight underflows to +9e18! Always use a large safe negative sentinel like -(1LL << 55) (and check a <= -INF/2 before adding in tropical multiply).',
    },
    {
      type: 'WA',
      title: 'Corrupting Light Aggregates During Bubbling When Update Hits Chain Tail vs Top',
      detail: 'When climbing HLD chains, ALWAYS query the old DP vector [oldF0, oldF1] at top[u] BEFORE calling seg.update(dfn[u], M[u]), then query new DP vector AFTER updating, so the exact delta propagated to parent[top[u]] matches old vs. new.',
    },
    {
      type: 'TLE',
      title: 'Using std::vector<vector<long long>> Inside Tight Matrix Multiplications',
      detail: 'Heap-allocating 2x2 or 3x3 vectors per segment tree node multiplies constant factor by 20x. Always use fixed stack-allocated structs / flat primitive arrays (e.g., long m00, m01, m10, m11).',
    },
  ],
  implementations: {
    cpp20: `#include <algorithm>
#include <iostream>
#include <vector>

using namespace std;

static constexpr long long NEG_INF = -(1LL << 55);

// 2x2 (max, +) Matrix for Dynamic Tree MWIS via HLD + Segtree.
struct Mat2 {
    long long m[2][2];
};

Mat2 mul(const Mat2& a, const Mat2& b) {
    Mat2 c;
    for (int i = 0; i < 2; ++i) {
        for (int j = 0; j < 2; ++j) {
            long long best = NEG_INF;
            for (int k = 0; k < 2; ++k) {
                if (a.m[i][k] > NEG_INF / 2 && b.m[k][j] > NEG_INF / 2) {
                    best = max(best, a.m[i][k] + b.m[k][j]);
                }
            }
            c.m[i][j] = best;
        }
    }
    return c;
}

struct SegTree {
    int n;
    vector<Mat2> tree;

    explicit SegTree(int n) : n(n), tree(4 * n + 4) {}

    void build(int node, int l, int r, const vector<Mat2>& base) {
        if (l == r) {
            tree[node] = base[l];
            return;
        }
        int mid = (l + r) / 2;
        build(2 * node, l, mid, base);
        build(2 * node + 1, mid + 1, r, base);
        tree[node] = mul(tree[2 * node], tree[2 * node + 1]);
    }

    void update(int node, int l, int r, int pos, const Mat2& val) {
        if (l == r) {
            tree[node] = val;
            return;
        }
        int mid = (l + r) / 2;
        if (pos <= mid) update(2 * node, l, mid, pos, val);
        else update(2 * node + 1, mid + 1, r, pos, val);
        tree[node] = mul(tree[2 * node], tree[2 * node + 1]);
    }

    Mat2 query(int node, int l, int r, int ql, int qr) const {
        if (ql <= l && r <= qr) return tree[node];
        int mid = (l + r) / 2;
        if (qr <= mid) return query(2 * node, l, mid, ql, qr);
        if (ql > mid) return query(2 * node + 1, mid + 1, r, ql, qr);
        return mul(query(2 * node, l, mid, ql, qr),
                   query(2 * node + 1, mid + 1, r, ql, qr));
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, q;
    if (!(cin >> n >> q)) return 0;

    vector<long long> w(n + 1);
    for (int i = 1; i <= n; ++i) cin >> w[i];

    vector<vector<int>> adj(n + 1);
    for (int i = 0; i < n - 1; ++i) {
        int u, v;
        cin >> u >> v;
        adj[u].push_back(v);
        adj[v].push_back(u);
    }

    vector<int> fa(n + 1, 0), sz(n + 1, 0), heavy(n + 1, 0);
    auto dfs1 = [&](auto& self, int u, int p) -> void {
        fa[u] = p;
        sz[u] = 1;
        for (int v : adj[u]) {
            if (v == p) continue;
            self(self, v, u);
            sz[u] += sz[v];
            if (sz[v] > sz[heavy[u]]) heavy[u] = v;
        }
    };
    dfs1(dfs1, 1, 0);

    vector<int> top(n + 1, 0), dfn(n + 1, 0), tail(n + 1, 0);
    vector<long long> g0(n + 1, 0), g1(n + 1, 0), f0(n + 1, 0), f1(n + 1, 0);
    int timer = 0;

    auto dfs2 = [&](auto& self, int u, int tp) -> void {
        top[u] = tp;
        dfn[u] = ++timer;
        tail[tp] = dfn[u];
        g1[u] = w[u];
        if (heavy[u]) {
            self(self, heavy[u], tp);
        }
        for (int v : adj[u]) {
            if (v == fa[u] || v == heavy[u]) continue;
            self(self, v, v);
            g0[u] += max(f0[v], f1[v]);
            g1[u] += f0[v];
        }
        f0[u] = g0[u] + max(f0[heavy[u]], f1[heavy[u]]);
        f1[u] = g1[u] + f0[heavy[u]];
    };
    dfs2(dfs2, 1, 1);

    vector<Mat2> base(n + 1);
    for (int u = 1; u <= n; ++u) {
        base[dfn[u]] = {{{g0[u], g0[u]}, {g1[u], NEG_INF}}};
    }

    SegTree seg(n);
    seg.build(1, 1, n, base);

    auto getF = [&](const Mat2& p) -> pair<long long, long long> {
        return {max(p.m[0][0], p.m[0][1]), max(p.m[1][0], p.m[1][1])};
    };

    while (q--) {
        int u;
        long long nw;
        cin >> u >> nw;
        g1[u] += nw - w[u];
        w[u] = nw;

        int cur = u;
        while (cur) {
            int tp = top[cur];
            auto oldF = getF(seg.query(1, 1, n, dfn[tp], tail[tp]));
            Mat2 m = {{{g0[cur], g0[cur]}, {g1[cur], NEG_INF}}};
            seg.update(1, 1, n, dfn[cur], m);
            auto newF = getF(seg.query(1, 1, n, dfn[tp], tail[tp]));

            int p = fa[tp];
            if (!p) break;
            g0[p] += max(newF.first, newF.second) - max(oldF.first, oldF.second);
            g1[p] += newF.first - oldF.first;
            cur = p;
        }

        auto rootF = getF(seg.query(1, 1, n, dfn[1], tail[1]));
        cout << max(rootF.first, rootF.second) << "\\n";
    }
    return 0;
}
`,
    rust: `use std::io::{self, Read};

const NEG_INF: i64 = -(1i64 << 55);

#[derive(Clone, Copy)]
struct Mat2 {
    m: [[i64; 2]; 2],
}

fn mul(a: Mat2, b: Mat2) -> Mat2 {
    let mut c = [[NEG_INF; 2]; 2];
    for i in 0..2 {
        for j in 0..2 {
            let mut best = NEG_INF;
            for k in 0..2 {
                if a.m[i][k] > NEG_INF / 2 && b.m[k][j] > NEG_INF / 2 {
                    best = best.max(a.m[i][k] + b.m[k][j]);
                }
            }
            c[i][j] = best;
        }
    }
    Mat2 { m: c }
}

struct SegTree {
    tree: Vec<Mat2>,
}

impl SegTree {
    fn new(n: usize) -> Self {
        Self {
            tree: vec![Mat2 { m: [[NEG_INF; 2]; 2] }; 4 * n + 4],
        }
    }

    fn build(&mut self, node: usize, l: usize, r: usize, base: &[Mat2]) {
        if l == r {
            self.tree[node] = base[l];
            return;
        }
        let mid = (l + r) / 2;
        self.build(2 * node, l, mid, base);
        self.build(2 * node + 1, mid + 1, r, base);
        self.tree[node] = mul(self.tree[2 * node], self.tree[2 * node + 1]);
    }

    fn update(&mut self, node: usize, l: usize, r: usize, pos: usize, val: Mat2) {
        if l == r {
            self.tree[node] = val;
            return;
        }
        let mid = (l + r) / 2;
        if pos <= mid {
            self.update(2 * node, l, mid, pos, val);
        } else {
            self.update(2 * node + 1, mid + 1, r, pos, val);
        }
        self.tree[node] = mul(self.tree[2 * node], self.tree[2 * node + 1]);
    }

    fn query(&self, node: usize, l: usize, r: usize, ql: usize, qr: usize) -> Mat2 {
        if ql <= l && r <= qr {
            return self.tree[node];
        }
        let mid = (l + r) / 2;
        if qr <= mid {
            self.query(2 * node, l, mid, ql, qr)
        } else if ql > mid {
            self.query(2 * node + 1, mid + 1, r, ql, qr)
        } else {
            mul(
                self.query(2 * node, l, mid, ql, qr),
                self.query(2 * node + 1, mid + 1, r, ql, qr),
            )
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

    let mut w = vec![0i64; n + 1];
    for i in 1..=n {
        w[i] = it.next().unwrap().parse().unwrap();
    }
    let mut adj = vec![Vec::new(); n + 1];
    for _ in 0..n - 1 {
        let u: usize = it.next().unwrap().parse().unwrap();
        let v: usize = it.next().unwrap().parse().unwrap();
        adj[u].push(v);
        adj[v].push(u);
    }

    // Iterative DFS1 for sizes & heavy child
    let mut fa = vec![0usize; n + 1];
    let mut order = Vec::with_capacity(n);
    let mut stk = vec![1usize];
    while let Some(u) = stk.pop() {
        order.push(u);
        for &v in &adj[u] {
            if v != fa[u] {
                fa[v] = u;
                stk.push(v);
            }
        }
    }
    let mut sz = vec![1usize; n + 1];
    let mut heavy = vec![0usize; n + 1];
    for &u in order.iter().rev() {
        for &v in &adj[u] {
            if v != fa[u] {
                sz[u] += sz[v];
                if sz[v] > sz[heavy[u]] {
                    heavy[u] = v;
                }
            }
        }
    }

    let mut top = vec![0usize; n + 1];
    let mut dfn = vec![0usize; n + 1];
    let mut tail = vec![0usize; n + 1];
    let mut dfn_order = Vec::with_capacity(n);
    let mut hld_stk = vec![(1usize, 1usize)];
    let mut timer = 0usize;
    while let Some((u, tp)) = hld_stk.pop() {
        timer += 1;
        top[u] = tp;
        dfn[u] = timer;
        tail[tp] = timer;
        dfn_order.push(u);
        for &v in &adj[u] {
            if v != fa[u] && v != heavy[u] {
                hld_stk.push((v, v));
            }
        }
        if heavy[u] != 0 {
            hld_stk.push((heavy[u], tp));
        }
    }

    let mut g0 = vec![0i64; n + 1];
    let mut g1 = vec![0i64; n + 1];
    let mut f0 = vec![0i64; n + 1];
    let mut f1 = vec![0i64; n + 1];
    for &u in dfn_order.iter().rev() {
        g1[u] = w[u];
        for &v in &adj[u] {
            if v != fa[u] && v != heavy[u] {
                g0[u] += f0[v].max(f1[v]);
                g1[u] += f0[v];
            }
        }
        let h = heavy[u];
        f0[u] = g0[u] + if h != 0 { f0[h].max(f1[h]) } else { 0 };
        f1[u] = g1[u] + if h != 0 { f0[h] } else { 0 };
    }

    let mut base = vec![Mat2 { m: [[NEG_INF; 2]; 2] }; n + 1];
    for u in 1..=n {
        base[dfn[u]] = Mat2 {
            m: [[g0[u], g0[u]], [g1[u], NEG_INF]],
        };
    }

    let mut seg = SegTree::new(n);
    seg.build(1, 1, n, &base);
    let get_f = |p: Mat2| -> (i64, i64) { (p.m[0][0].max(p.m[0][1]), p.m[1][0].max(p.m[1][1])) };

    let mut out = String::new();
    for _ in 0..q {
        let u: usize = it.next().unwrap().parse().unwrap();
        let nw: i64 = it.next().unwrap().parse().unwrap();
        g1[u] += nw - w[u];
        w[u] = nw;

        let mut cur = u;
        while cur != 0 {
            let tp = top[cur];
            let old_f = get_f(seg.query(1, 1, n, dfn[tp], tail[tp]));
            let m = Mat2 {
                m: [[g0[cur], g0[cur]], [g1[cur], NEG_INF]],
            };
            seg.update(1, 1, n, dfn[cur], m);
            let new_f = get_f(seg.query(1, 1, n, dfn[tp], tail[tp]));
            let p = fa[tp];
            if p == 0 {
                break;
            }
            g0[p] += new_f.0.max(new_f.1) - old_f.0.max(old_f.1);
            g1[p] += new_f.0 - old_f.0;
            cur = p;
        }
        let root_f = get_f(seg.query(1, 1, n, dfn[1], tail[1]));
        out.push_str(&format!("{}\\n", root_f.0.max(root_f.1)));
    }
    print!("{out}");
}
`,
        java21: `import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

public class Main {
    static final long NEG_INF = -(1L << 55);

    static class FastScanner {
        private final InputStream in;
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;

        FastScanner(InputStream in) {
            this.in = in;
        }

        private int readByte() throws IOException {
            if (ptr >= len) {
                len = in.read(buf);
                ptr = 0;
                if (len <= 0) return -1;
            }
            return buf[ptr++];
        }

        long nextLong() throws IOException {
            int c = readByte();
            while (c != -1 && c <= ' ') c = readByte();
            if (c == -1) return Long.MIN_VALUE;
            long sign = 1;
            if (c == '-') {
                sign = -1;
                c = readByte();
            }
            long res = 0;
            while (c > ' ') {
                res = res * 10 + (c - '0');
                c = readByte();
            }
            return res * sign;
        }

        int nextInt() throws IOException {
            return (int) nextLong();
        }
    }

    static class Mat2 {
        long m00, m01, m10, m11;

        Mat2(long m00, long m01, long m10, long m11) {
            this.m00 = m00;
            this.m01 = m01;
            this.m10 = m10;
            this.m11 = m11;
        }
    }

    static Mat2 mul(Mat2 a, Mat2 b) {
        long c00 = Math.max(a.m00 + b.m00, a.m01 + b.m10);
        long c01 = Math.max(a.m00 + b.m01, a.m01 + b.m11);
        long c10 = Math.max(a.m10 + b.m00, a.m11 + b.m10);
        long c11 = Math.max(a.m10 + b.m01, a.m11 + b.m11);
        return new Mat2(Math.max(c00, NEG_INF), Math.max(c01, NEG_INF), Math.max(c10, NEG_INF), Math.max(c11, NEG_INF));
    }

    static class SegTree {
        final Mat2[] tree;

        SegTree(int n) {
            tree = new Mat2[4 * n + 4];
        }

        void build(int node, int l, int r, Mat2[] base) {
            if (l == r) {
                tree[node] = base[l];
                return;
            }
            int mid = (l + r) >>> 1;
            build(2 * node, l, mid, base);
            build(2 * node + 1, mid + 1, r, base);
            tree[node] = mul(tree[2 * node], tree[2 * node + 1]);
        }

        void update(int node, int l, int r, int pos, Mat2 val) {
            if (l == r) {
                tree[node] = val;
                return;
            }
            int mid = (l + r) >>> 1;
            if (pos <= mid) update(2 * node, l, mid, pos, val);
            else update(2 * node + 1, mid + 1, r, pos, val);
            tree[node] = mul(tree[2 * node], tree[2 * node + 1]);
        }

        Mat2 query(int node, int l, int r, int ql, int qr) {
            if (ql <= l && r <= qr) return tree[node];
            int mid = (l + r) >>> 1;
            if (qr <= mid) return query(2 * node, l, mid, ql, qr);
            if (ql > mid) return query(2 * node + 1, mid + 1, r, ql, qr);
            return mul(query(2 * node, l, mid, ql, qr), query(2 * node + 1, mid + 1, r, ql, qr));
        }
    }

    @SuppressWarnings("unchecked")
    public static void main(String[] args) throws IOException {
        FastScanner fs = new FastScanner(System.in);
        long nLong = fs.nextLong();
        if (nLong == Long.MIN_VALUE) return;
        int n = (int) nLong;
        int q = fs.nextInt();

        long[] w = new long[n + 1];
        for (int i = 1; i <= n; i++) w[i] = fs.nextLong();

        List<Integer>[] adj = new ArrayList[n + 1];
        for (int i = 1; i <= n; i++) adj[i] = new ArrayList<>();
        for (int i = 0; i < n - 1; i++) {
            int u = fs.nextInt(), v = fs.nextInt();
            adj[u].add(v);
            adj[v].add(u);
        }

        int[] fa = new int[n + 1];
        int[] order = new int[n];
        int ptr = 0;
        int[] stk = new int[n];
        int topStk = 0;
        stk[topStk++] = 1;
        while (topStk > 0) {
            int u = stk[--topStk];
            order[ptr++] = u;
            for (int v : adj[u]) {
                if (v != fa[u]) {
                    fa[v] = u;
                    stk[topStk++] = v;
                }
            }
        }

        int[] sz = new int[n + 1];
        int[] heavy = new int[n + 1];
        for (int i = n - 1; i >= 0; i--) {
            int u = order[i];
            sz[u] = 1;
            for (int v : adj[u]) {
                if (v != fa[u]) {
                    sz[u] += sz[v];
                    if (sz[v] > sz[heavy[u]]) heavy[u] = v;
                }
            }
        }

        int[] top = new int[n + 1];
        int[] dfn = new int[n + 1];
        int[] tail = new int[n + 1];
        int[] dfnOrder = new int[n];
        int[] hNode = new int[n];
        int[] hTop = new int[n];
        int sp = 0, timer = 0;
        hNode[sp] = 1;
        hTop[sp] = 1;
        sp++;
        while (sp > 0) {
            sp--;
            int u = hNode[sp], tp = hTop[sp];
            dfn[u] = ++timer;
            top[u] = tp;
            tail[tp] = timer;
            dfnOrder[timer - 1] = u;
            for (int v : adj[u]) {
                if (v != fa[u] && v != heavy[u]) {
                    hNode[sp] = v;
                    hTop[sp] = v;
                    sp++;
                }
            }
            if (heavy[u] != 0) {
                hNode[sp] = heavy[u];
                hTop[sp] = tp;
                sp++;
            }
        }

        long[] g0 = new long[n + 1];
        long[] g1 = new long[n + 1];
        long[] f0 = new long[n + 1];
        long[] f1 = new long[n + 1];
        for (int i = n - 1; i >= 0; i--) {
            int u = dfnOrder[i];
            g1[u] = w[u];
            for (int v : adj[u]) {
                if (v != fa[u] && v != heavy[u]) {
                    g0[u] += Math.max(f0[v], f1[v]);
                    g1[u] += f0[v];
                }
            }
            int h = heavy[u];
            f0[u] = g0[u] + (h != 0 ? Math.max(f0[h], f1[h]) : 0);
            f1[u] = g1[u] + (h != 0 ? f0[h] : 0);
        }

        Mat2[] base = new Mat2[n + 1];
        for (int u = 1; u <= n; u++) {
            base[dfn[u]] = new Mat2(g0[u], g0[u], g1[u], NEG_INF);
        }

        SegTree seg = new SegTree(n);
        seg.build(1, 1, n, base);
        StringBuilder sb = new StringBuilder();

        while (q-- > 0) {
            int u = fs.nextInt();
            long nw = fs.nextLong();
            g1[u] += nw - w[u];
            w[u] = nw;

            int cur = u;
            while (cur != 0) {
                int tp = top[cur];
                Mat2 oldP = seg.query(1, 1, n, dfn[tp], tail[tp]);
                long oldF0 = Math.max(oldP.m00, oldP.m01);
                long oldF1 = Math.max(oldP.m10, oldP.m11);

                seg.update(1, 1, n, dfn[cur], new Mat2(g0[cur], g0[cur], g1[cur], NEG_INF));
                Mat2 newP = seg.query(1, 1, n, dfn[tp], tail[tp]);
                long newF0 = Math.max(newP.m00, newP.m01);
                long newF1 = Math.max(newP.m10, newP.m11);

                int p = fa[tp];
                if (p == 0) break;
                g0[p] += Math.max(newF0, newF1) - Math.max(oldF0, oldF1);
                g1[p] += newF0 - oldF0;
                cur = p;
            }
            Mat2 rootP = seg.query(1, 1, n, dfn[1], tail[1]);
            long r0 = Math.max(rootP.m00, rootP.m01);
            long r1 = Math.max(rootP.m10, rootP.m11);
            sb.append(Math.max(r0, r1)).append('\\n');
        }
        System.out.print(sb);
    }
}
`,
    python3: `import sys

sys.setrecursionlimit(200000)

NEG_INF = -(1 << 55)


def mul(a: tuple[int, int, int, int], b: tuple[int, int, int, int]) -> tuple[int, int, int, int]:
    a00, a01, a10, a11 = a
    b00, b01, b10, b11 = b
    c00 = max(a00 + b00, a01 + b10)
    c01 = max(a00 + b01, a01 + b11)
    c10 = max(a10 + b00, a11 + b10)
    c11 = max(a10 + b01, a11 + b11)
    return (
        c00 if c00 > NEG_INF else NEG_INF,
        c01 if c01 > NEG_INF else NEG_INF,
        c10 if c10 > NEG_INF else NEG_INF,
        c11 if c11 > NEG_INF else NEG_INF,
    )


def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    n = int(next(it))
    q = int(next(it))
    w = [0] + [int(next(it)) for _ in range(n)]
    adj: list[list[int]] = [[] for _ in range(n + 1)]
    for _ in range(n - 1):
        u = int(next(it))
        v = int(next(it))
        adj[u].append(v)
        adj[v].append(u)

    fa = [0] * (n + 1)
    order: list[int] = []
    stk = [1]
    while stk:
        u = stk.pop()
        order.append(u)
        for v in adj[u]:
            if v != fa[u]:
                fa[v] = u
                stk.append(v)

    sz = [1] * (n + 1)
    heavy = [0] * (n + 1)
    for u in reversed(order):
        for v in adj[u]:
            if v != fa[u]:
                sz[u] += sz[v]
                if sz[v] > sz[heavy[u]]:
                    heavy[u] = v

    top = [0] * (n + 1)
    dfn = [0] * (n + 1)
    tail = [0] * (n + 1)
    dfn_order: list[int] = []
    hstk = [(1, 1)]
    timer = 0
    while hstk:
        u, tp = hstk.pop()
        timer += 1
        top[u] = tp
        dfn[u] = timer
        tail[tp] = timer
        dfn_order.append(u)
        for v in adj[u]:
            if v != fa[u] and v != heavy[u]:
                hstk.append((v, v))
        if heavy[u]:
            hstk.append((heavy[u], tp))

    g0 = [0] * (n + 1)
    g1 = [0] * (n + 1)
    f0 = [0] * (n + 1)
    f1 = [0] * (n + 1)
    for u in reversed(dfn_order):
        g1[u] = w[u]
        for v in adj[u]:
            if v != fa[u] and v != heavy[u]:
                g0[u] += max(f0[v], f1[v])
                g1[u] += f0[v]
        h = heavy[u]
        f0[u] = g0[u] + (max(f0[h], f1[h]) if h else 0)
        f1[u] = g1[u] + (f0[h] if h else 0)

    size = 1
    while size < n:
        size <<= 1
    ident = (0, NEG_INF, NEG_INF, 0)
    tree = [ident] * (2 * size)
    for u in range(1, n + 1):
        tree[size + dfn[u] - 1] = (g0[u], g0[u], g1[u], NEG_INF)
    for i in range(size - 1, 0, -1):
        tree[i] = mul(tree[2 * i], tree[2 * i + 1])

    def update(pos: int, val: tuple[int, int, int, int]) -> None:
        i = size + pos - 1
        tree[i] = val
        i >>= 1
        while i:
            tree[i] = mul(tree[2 * i], tree[2 * i + 1])
            i >>= 1

    def query(l: int, r: int) -> tuple[int, int, int, int]:
        l += size - 1
        r += size - 1
        res_l = ident
        res_r = ident
        while l <= r:
            if l & 1:
                res_l = mul(res_l, tree[l])
                l += 1
            if not (r & 1):
                res_r = mul(tree[r], res_r)
                r -= 1
            l >>= 1
            r >>= 1
        return mul(res_l, res_r)

    out: list[str] = []
    for _ in range(q):
        u = int(next(it))
        nw = int(next(it))
        g1[u] += nw - w[u]
        w[u] = nw

        cur = u
        while cur:
            tp = top[cur]
            old_p = query(dfn[tp], tail[tp])
            old_f0 = max(old_p[0], old_p[1])
            old_f1 = max(old_p[2], old_p[3])
            update(dfn[cur], (g0[cur], g0[cur], g1[cur], NEG_INF))
            new_p = query(dfn[tp], tail[tp])
            new_f0 = max(new_p[0], new_p[1])
            new_f1 = max(new_p[2], new_p[3])
            p = fa[tp]
            if not p:
                break
            g0[p] += max(new_f0, new_f1) - max(old_f0, old_f1)
            g1[p] += new_f0 - old_f0
            cur = p

        rp = query(dfn[1], tail[1])
        out.append(str(max(rp[0], rp[1], rp[2], rp[3])))

    sys.stdout.write("\\n".join(out) + ("\\n" if out else ""))


if __name__ == "__main__":
    solve()
`,
    ruby: `NEG_INF = -(1 << 55)

def mul(a, b)
  c00 = [a[0] + b[0], a[1] + b[2]].max
  c01 = [a[0] + b[1], a[1] + b[3]].max
  c10 = [a[2] + b[0], a[3] + b[2]].max
  c11 = [a[2] + b[1], a[3] + b[3]].max
  [
    c00 > NEG_INF ? c00 : NEG_INF,
    c01 > NEG_INF ? c01 : NEG_INF,
    c10 > NEG_INF ? c10 : NEG_INF,
    c11 > NEG_INF ? c11 : NEG_INF,
  ]
end

data = $stdin.read.split
exit if data.empty?
idx = 0
n = data[idx].to_i; idx += 1
q = data[idx].to_i; idx += 1

w = Array.new(n + 1, 0)
(1..n).each { |i| w[i] = data[idx].to_i; idx += 1 }
adj = Array.new(n + 1) { [] }
(n - 1).times do
  u = data[idx].to_i; idx += 1
  v = data[idx].to_i; idx += 1
  adj[u] << v
  adj[v] << u
end

fa = Array.new(n + 1, 0)
order = []
stk = [1]
until stk.empty?
  u = stk.pop
  order << u
  adj[u].each do |v|
    next if v == fa[u]

    fa[v] = u
    stk << v
  end
end

sz = Array.new(n + 1, 1)
heavy = Array.new(n + 1, 0)
order.reverse_each do |u|
  adj[u].each do |v|
    next if v == fa[u]

    sz[u] += sz[v]
    heavy[u] = v if sz[v] > sz[heavy[u]]
  end
end

top = Array.new(n + 1, 0)
dfn = Array.new(n + 1, 0)
tail = Array.new(n + 1, 0)
dfn_order = []
hstk = [[1, 1]]
timer = 0
until hstk.empty?
  u, tp = hstk.pop
  timer += 1
  top[u] = tp
  dfn[u] = timer
  tail[tp] = timer
  dfn_order << u
  adj[u].each do |v|
    next if v == fa[u] || v == heavy[u]

    hstk << [v, v]
  end
  hstk << [heavy[u], tp] if heavy[u] != 0
end

g0 = Array.new(n + 1, 0)
g1 = Array.new(n + 1, 0)
f0 = Array.new(n + 1, 0)
f1 = Array.new(n + 1, 0)
dfn_order.reverse_each do |u|
  g1[u] = w[u]
  adj[u].each do |v|
    next if v == fa[u] || v == heavy[u]

    g0[u] += [f0[v], f1[v]].max
    g1[u] += f0[v]
  end
  h = heavy[u]
  f0[u] = g0[u] + (h != 0 ? [f0[h], f1[h]].max : 0)
  f1[u] = g1[u] + (h != 0 ? f0[h] : 0)
end

size = 1
size <<= 1 while size < n
ident = [0, NEG_INF, NEG_INF, 0]
tree = Array.new(2 * size, ident)
(1..n).each { |u| tree[size + dfn[u] - 1] = [g0[u], g0[u], g1[u], NEG_INF] }
(size - 1).downto(1) { |i| tree[i] = mul(tree[2 * i], tree[2 * i + 1]) }

update = lambda do |pos, val|
  i = size + pos - 1
  tree[i] = val
  i >>= 1
  while i > 0
    tree[i] = mul(tree[2 * i], tree[2 * i + 1])
    i >>= 1
  end
end

query = lambda do |l, r|
  l += size - 1
  r += size - 1
  res_l = ident
  res_r = ident
  while l <= r
    if (l & 1) == 1
      res_l = mul(res_l, tree[l])
      l += 1
    end
    if (r & 1) == 0
      res_r = mul(tree[r], res_r)
      r -= 1
    end
    l >>= 1
    r >>= 1
  end
  mul(res_l, res_r)
end

out = []
q.times do
  u = data[idx].to_i; idx += 1
  nw = data[idx].to_i; idx += 1
  g1[u] += nw - w[u]
  w[u] = nw

  cur = u
  while cur != 0
    tp = top[cur]
    old_p = query.call(dfn[tp], tail[tp])
    old_f0 = [old_p[0], old_p[1]].max
    old_f1 = [old_p[2], old_p[3]].max
    update.call(dfn[cur], [g0[cur], g0[cur], g1[cur], NEG_INF])
    new_p = query.call(dfn[tp], tail[tp])
    new_f0 = [new_p[0], new_p[1]].max
    new_f1 = [new_p[2], new_p[3]].max
    p = fa[tp]
    break if p == 0

    g0[p] += [new_f0, new_f1].max - [old_f0, old_f1].max
    g1[p] += new_f0 - old_f0
    cur = p
  end

  rp = query.call(dfn[1], tail[1])
  out << rp.max.to_s
end

puts out.join("\\n") unless out.empty?
`,
  },
  practiceProblems: [
    {
      id: 'ch70-p1',
      tier: 'Warmup',
      ratingRange: '2200–2450',
      title: 'Dynamic Maximum Subarray Sum via 3x3 Matrix Segment Tree',
      statement:
        'Given an integer array A[1..N] (which may contain negative integers) and Q operations: (1 pos val) update A[pos] = val; (2 l r) output the maximum non-empty contiguous subarray sum inside A[l..r].',
      constraints: '1 <= N, Q <= 2 * 10^5; -10^9 <= A[i], val <= 10^9; 1 <= l <= r <= N',
      sampleInput: `6 4
-2 1 -3 4 -1 2
2 1 6
2 2 5
1 3 5
2 1 6`,
      sampleOutput: `5
4
11`,
      hints: [
        'Represent Kadane DP row vector [cur_sum, best_sum, 0] right-multiplied by a 3x3 (max, +) transition matrix M(x).',
        'M(x) = [[x, x, -INF], [-INF, 0, -INF], [x, x, 0]] satisfies [cur, best, 0] * M(x) = [max(cur + x, x), max(best, cur + x, x), 0].',
        'Because matrix multiplication is associative, merging left and right child segments computes L * R, and [-INF, -INF, 0] * P simply reads P[2][1].',
      ],
      solutions: {
        cpp20: `#include <algorithm>
#include <iostream>
#include <vector>

using namespace std;

static constexpr long long NEG_INF = -(1LL << 55);

struct Mat3 {
    long long m[3][3];
};

Mat3 makeMat(long long x) {
    return {{
        {x, x, NEG_INF},
        {NEG_INF, 0, NEG_INF},
        {x, x, 0},
    }};
}

Mat3 mul(const Mat3& a, const Mat3& b) {
    Mat3 c;
    for (int i = 0; i < 3; ++i) {
        for (int j = 0; j < 3; ++j) {
            long long best = NEG_INF;
            for (int k = 0; k < 3; ++k) {
                if (a.m[i][k] > NEG_INF / 2 && b.m[k][j] > NEG_INF / 2) {
                    best = max(best, a.m[i][k] + b.m[k][j]);
                }
            }
            c.m[i][j] = best;
        }
    }
    return c;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, q;
    if (!(cin >> n >> q)) return 0;

    int size = 1;
    while (size < n) size <<= 1;
    Mat3 ident = {{{0, NEG_INF, NEG_INF}, {NEG_INF, 0, NEG_INF}, {NEG_INF, NEG_INF, 0}}};
    vector<Mat3> tree(2 * size, ident);

    for (int i = 0; i < n; ++i) {
        long long x;
        cin >> x;
        tree[size + i] = makeMat(x);
    }
    for (int i = size - 1; i >= 1; --i) {
        tree[i] = mul(tree[2 * i], tree[2 * i + 1]);
    }

    auto update = [&](int pos, long long val) {
        int i = size + pos - 1;
        tree[i] = makeMat(val);
        for (i >>= 1; i >= 1; i >>= 1) {
            tree[i] = mul(tree[2 * i], tree[2 * i + 1]);
        }
    };

    auto query = [&](int l, int r) -> long long {
        l += size - 1;
        r += size - 1;
        Mat3 resL = ident, resR = ident;
        while (l <= r) {
            if (l & 1) resL = mul(resL, tree[l++]);
            if (!(r & 1)) resR = mul(tree[r--], resR);
            l >>= 1;
            r >>= 1;
        }
        return mul(resL, resR).m[2][1];
    };

    while (q--) {
        int t;
        cin >> t;
        if (t == 1) {
            int pos;
            long long val;
            cin >> pos >> val;
            update(pos, val);
        } else {
            int l, r;
            cin >> l >> r;
            cout << query(l, r) << "\\n";
        }
    }
    return 0;
}
`,
        rust: `use std::io::{self, Read};

const NEG_INF: i64 = -(1i64 << 55);

#[derive(Clone, Copy)]
struct Mat3 {
    m: [[i64; 3]; 3],
}

fn make_mat(x: i64) -> Mat3 {
    Mat3 {
        m: [[x, x, NEG_INF], [NEG_INF, 0, NEG_INF], [x, x, 0]],
    }
}

fn mul(a: Mat3, b: Mat3) -> Mat3 {
    let mut c = [[NEG_INF; 3]; 3];
    for i in 0..3 {
        for j in 0..3 {
            let mut best = NEG_INF;
            for k in 0..3 {
                if a.m[i][k] > NEG_INF / 2 && b.m[k][j] > NEG_INF / 2 {
                    best = best.max(a.m[i][k] + b.m[k][j]);
                }
            }
            c[i][j] = best;
        }
    }
    Mat3 { m: c }
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

    let mut size = 1usize;
    while size < n {
        size <<= 1;
    }
    let ident = Mat3 {
        m: [[0, NEG_INF, NEG_INF], [NEG_INF, 0, NEG_INF], [NEG_INF, NEG_INF, 0]],
    };
    let mut tree = vec![ident; 2 * size];
    for i in 0..n {
        let x: i64 = it.next().unwrap().parse().unwrap();
        tree[size + i] = make_mat(x);
    }
    for i in (1..size).rev() {
        tree[i] = mul(tree[2 * i], tree[2 * i + 1]);
    }

    let mut out = String::new();
    for _ in 0..q {
        let t: usize = it.next().unwrap().parse().unwrap();
        if t == 1 {
            let pos: usize = it.next().unwrap().parse().unwrap();
            let val: i64 = it.next().unwrap().parse().unwrap();
            let mut i = size + pos - 1;
            tree[i] = make_mat(val);
            i >>= 1;
            while i > 0 {
                tree[i] = mul(tree[2 * i], tree[2 * i + 1]);
                i >>= 1;
            }
        } else {
            let mut l: usize = it.next().unwrap().parse::<usize>().unwrap() + size - 1;
            let mut r: usize = it.next().unwrap().parse::<usize>().unwrap() + size - 1;
            let mut res_l = ident;
            let mut res_r = ident;
            while l <= r {
                if (l & 1) == 1 {
                    res_l = mul(res_l, tree[l]);
                    l += 1;
                }
                if (r & 1) == 0 {
                    res_r = mul(tree[r], res_r);
                    r -= 1;
                }
                l >>= 1;
                r >>= 1;
            }
            out.push_str(&format!("{}\\n", mul(res_l, res_r).m[2][1]));
        }
    }
    print!("{out}");
}
`,
        java21: `import java.io.IOException;
import java.io.InputStream;

public class Main {
    static final long NEG_INF = -(1L << 55);

    static class FastScanner {
        private final InputStream in;
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;

        FastScanner(InputStream in) {
            this.in = in;
        }

        private int readByte() throws IOException {
            if (ptr >= len) {
                len = in.read(buf);
                ptr = 0;
                if (len <= 0) return -1;
            }
            return buf[ptr++];
        }

        long nextLong() throws IOException {
            int c = readByte();
            while (c != -1 && c <= ' ') c = readByte();
            if (c == -1) return Long.MIN_VALUE;
            long sign = 1;
            if (c == '-') {
                sign = -1;
                c = readByte();
            }
            long res = 0;
            while (c > ' ') {
                res = res * 10 + (c - '0');
                c = readByte();
            }
            return res * sign;
        }

        int nextInt() throws IOException {
            return (int) nextLong();
        }
    }

    static long[] makeMat(long x) {
        return new long[]{x, x, NEG_INF, NEG_INF, 0, NEG_INF, x, x, 0};
    }

    static long[] mul(long[] a, long[] b) {
        long[] c = new long[9];
        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                long best = NEG_INF;
                for (int k = 0; k < 3; k++) {
                    long av = a[i * 3 + k], bv = b[k * 3 + j];
                    if (av > NEG_INF / 2 && bv > NEG_INF / 2) {
                        best = Math.max(best, av + bv);
                    }
                }
                c[i * 3 + j] = best;
            }
        }
        return c;
    }

    public static void main(String[] args) throws IOException {
        FastScanner fs = new FastScanner(System.in);
        long nLong = fs.nextLong();
        if (nLong == Long.MIN_VALUE) return;
        int n = (int) nLong;
        int q = fs.nextInt();

        int size = 1;
        while (size < n) size <<= 1;
        long[] ident = new long[]{0, NEG_INF, NEG_INF, NEG_INF, 0, NEG_INF, NEG_INF, NEG_INF, 0};
        long[][] tree = new long[2 * size][];
        for (int i = 0; i < 2 * size; i++) tree[i] = ident;
        for (int i = 0; i < n; i++) tree[size + i] = makeMat(fs.nextLong());
        for (int i = size - 1; i >= 1; i--) tree[i] = mul(tree[2 * i], tree[2 * i + 1]);

        StringBuilder sb = new StringBuilder();
        while (q-- > 0) {
            int t = fs.nextInt();
            if (t == 1) {
                int pos = fs.nextInt();
                long val = fs.nextLong();
                int i = size + pos - 1;
                tree[i] = makeMat(val);
                for (i >>= 1; i >= 1; i >>= 1) tree[i] = mul(tree[2 * i], tree[2 * i + 1]);
            } else {
                int l = fs.nextInt() + size - 1;
                int r = fs.nextInt() + size - 1;
                long[] resL = ident, resR = ident;
                while (l <= r) {
                    if ((l & 1) == 1) resL = mul(resL, tree[l++]);
                    if ((r & 1) == 0) resR = mul(tree[r--], resR);
                    l >>= 1;
                    r >>= 1;
                }
                sb.append(mul(resL, resR)[2 * 3 + 1]).append('\\n');
            }
        }
        System.out.print(sb);
    }
}
`,
        python3: `import sys

NEG_INF = -(1 << 55)


def make_mat(x: int) -> tuple[int, ...]:
    return (x, x, NEG_INF, NEG_INF, 0, NEG_INF, x, x, 0)


def mul(a: tuple[int, ...], b: tuple[int, ...]) -> tuple[int, ...]:
    c = [NEG_INF] * 9
    for i in range(3):
        r3 = i * 3
        a0, a1, a2 = a[r3], a[r3 + 1], a[r3 + 2]
        for j in range(3):
            best = max(a0 + b[j], a1 + b[3 + j], a2 + b[6 + j])
            c[r3 + j] = best if best > NEG_INF else NEG_INF
    return tuple(c)


def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    n = int(next(it))
    q = int(next(it))
    size = 1
    while size < n:
        size <<= 1
    ident = (0, NEG_INF, NEG_INF, NEG_INF, 0, NEG_INF, NEG_INF, NEG_INF, 0)
    tree = [ident] * (2 * size)
    for i in range(n):
        tree[size + i] = make_mat(int(next(it)))
    for i in range(size - 1, 0, -1):
        tree[i] = mul(tree[2 * i], tree[2 * i + 1])

    out: list[str] = []
    for _ in range(q):
        t = int(next(it))
        if t == 1:
            pos = int(next(it))
            val = int(next(it))
            i = size + pos - 1
            tree[i] = make_mat(val)
            i >>= 1
            while i:
                tree[i] = mul(tree[2 * i], tree[2 * i + 1])
                i >>= 1
        else:
            l = int(next(it)) + size - 1
            r = int(next(it)) + size - 1
            res_l = ident
            res_r = ident
            while l <= r:
                if l & 1:
                    res_l = mul(res_l, tree[l])
                    l += 1
                if not (r & 1):
                    res_r = mul(tree[r], res_r)
                    r -= 1
                l >>= 1
                r >>= 1
            out.append(str(mul(res_l, res_r)[7]))
    sys.stdout.write("\\n".join(out) + ("\\n" if out else ""))


if __name__ == "__main__":
    solve()
`,
        ruby: `NEG_INF = -(1 << 55)

def make_mat(x)
  [x, x, NEG_INF, NEG_INF, 0, NEG_INF, x, x, 0]
end

def mul(a, b)
  c = Array.new(9, NEG_INF)
  3.times do |i|
    r3 = i * 3
    a0 = a[r3]; a1 = a[r3 + 1]; a2 = a[r3 + 2]
    3.times do |j|
      best = [a0 + b[j], a1 + b[3 + j], a2 + b[6 + j]].max
      c[r3 + j] = best > NEG_INF ? best : NEG_INF
    end
  end
  c
end

data = $stdin.read.split
exit if data.empty?
idx = 0
n = data[idx].to_i; idx += 1
q = data[idx].to_i; idx += 1

size = 1
size <<= 1 while size < n
ident = [0, NEG_INF, NEG_INF, NEG_INF, 0, NEG_INF, NEG_INF, NEG_INF, 0]
tree = Array.new(2 * size, ident)
n.times do |i|
  tree[size + i] = make_mat(data[idx].to_i)
  idx += 1
end
(size - 1).downto(1) { |i| tree[i] = mul(tree[2 * i], tree[2 * i + 1]) }

out = []
q.times do
  t = data[idx].to_i; idx += 1
  if t == 1
    pos = data[idx].to_i; idx += 1
    val = data[idx].to_i; idx += 1
    i = size + pos - 1
    tree[i] = make_mat(val)
    i >>= 1
    while i > 0
      tree[i] = mul(tree[2 * i], tree[2 * i + 1])
      i >>= 1
    end
  else
    l = data[idx].to_i + size - 1; idx += 1
    r = data[idx].to_i + size - 1; idx += 1
    res_l = ident
    res_r = ident
    while l <= r
      if (l & 1) == 1
        res_l = mul(res_l, tree[l])
        l += 1
      end
      if (r & 1) == 0
        res_r = mul(tree[r], res_r)
        r -= 1
      end
      l >>= 1
      r >>= 1
    end
    out << mul(res_l, res_r)[7].to_s
  end
end

puts out.join("\\n") unless out.empty?
`,
      },
    },
    {
      id: 'ch70-p2',
      tier: 'Standard',
      ratingRange: '2500–2750',
      title: 'Dynamic Maximum Weight Independent Set on a Tree',
      statement:
        'You are given a tree of N vertices (1..N) with initial integer weights w_1..w_N (which may be negative). Process Q updates: given (u nw), change w_u = nw and output the maximum total weight of an independent set (no two chosen vertices share an edge, empty set allowed with weight 0).',
      constraints: '1 <= N, Q <= 10^5; -10^9 <= w_i, nw <= 10^9',
      sampleInput: `4 3
10 20 30 40
1 2
1 3
2 4
2 100
4 200
1 500`,
      sampleOutput: `130
230
700`,
      hints: [
        'Root the tree at vertex 1 and compute HLD chains. For each u, fold all light children into g[u][0] = sum max(f[v][0], f[v][1]) and g[u][1] = w[u] + sum f[v][0].',
        'Express the heavy-child transition as M[u] = [[g[u][0], g[u][0]], [g[u][1], -INF]] in (max, +) multiplication.',
        'When updating node u, climb heavy chains upward to root 1: query old chain DP at top[cur], update segtree at dfn[cur], query new chain DP, and add the exact delta to fa[top[cur]]’s g0 and g1.',
      ],
      solutions: {
        cpp20: `#include <algorithm>
#include <iostream>
#include <vector>

using namespace std;

static constexpr long long NEG_INF = -(1LL << 55);

struct Mat2 {
    long long m[2][2];
};

Mat2 mul(const Mat2& a, const Mat2& b) {
    Mat2 c;
    for (int i = 0; i < 2; ++i) {
        for (int j = 0; j < 2; ++j) {
            long long best = NEG_INF;
            for (int k = 0; k < 2; ++k) {
                if (a.m[i][k] > NEG_INF / 2 && b.m[k][j] > NEG_INF / 2) {
                    best = max(best, a.m[i][k] + b.m[k][j]);
                }
            }
            c.m[i][j] = best;
        }
    }
    return c;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, q;
    if (!(cin >> n >> q)) return 0;
    vector<long long> w(n + 1);
    for (int i = 1; i <= n; ++i) cin >> w[i];

    vector<vector<int>> adj(n + 1);
    for (int i = 0; i < n - 1; ++i) {
        int u, v;
        cin >> u >> v;
        adj[u].push_back(v);
        adj[v].push_back(u);
    }

    vector<int> fa(n + 1, 0), sz(n + 1, 0), heavy(n + 1, 0), top(n + 1, 0), dfn(n + 1, 0), tail(n + 1, 0);
    vector<long long> g0(n + 1, 0), g1(n + 1, 0), f0(n + 1, 0), f1(n + 1, 0);

    auto dfs1 = [&](auto& self, int u, int p) -> void {
        fa[u] = p;
        sz[u] = 1;
        for (int v : adj[u]) {
            if (v == p) continue;
            self(self, v, u);
            sz[u] += sz[v];
            if (sz[v] > sz[heavy[u]]) heavy[u] = v;
        }
    };
    dfs1(dfs1, 1, 0);

    int timer = 0;
    auto dfs2 = [&](auto& self, int u, int tp) -> void {
        top[u] = tp;
        dfn[u] = ++timer;
        tail[tp] = dfn[u];
        g1[u] = w[u];
        if (heavy[u]) self(self, heavy[u], tp);
        for (int v : adj[u]) {
            if (v == fa[u] || v == heavy[u]) continue;
            self(self, v, v);
            g0[u] += max(f0[v], f1[v]);
            g1[u] += f0[v];
        }
        f0[u] = g0[u] + max(f0[heavy[u]], f1[heavy[u]]);
        f1[u] = g1[u] + f0[heavy[u]];
    };
    dfs2(dfs2, 1, 1);

    int size = 1;
    while (size < n) size <<= 1;
    Mat2 ident = {{{0, NEG_INF}, {NEG_INF, 0}}};
    vector<Mat2> tree(2 * size, ident);
    for (int u = 1; u <= n; ++u) {
        tree[size + dfn[u] - 1] = {{{g0[u], g0[u]}, {g1[u], NEG_INF}}};
    }
    for (int i = size - 1; i >= 1; --i) {
        tree[i] = mul(tree[2 * i], tree[2 * i + 1]);
    }

    auto update = [&](int pos, const Mat2& val) {
        int i = size + pos - 1;
        tree[i] = val;
        for (i >>= 1; i >= 1; i >>= 1) tree[i] = mul(tree[2 * i], tree[2 * i + 1]);
    };

    auto query = [&](int l, int r) -> Mat2 {
        l += size - 1;
        r += size - 1;
        Mat2 resL = ident, resR = ident;
        while (l <= r) {
            if (l & 1) resL = mul(resL, tree[l++]);
            if (!(r & 1)) resR = mul(tree[r--], resR);
            l >>= 1;
            r >>= 1;
        }
        return mul(resL, resR);
    };

    while (q--) {
        int u;
        long long nw;
        cin >> u >> nw;
        g1[u] += nw - w[u];
        w[u] = nw;

        int cur = u;
        while (cur) {
            int tp = top[cur];
            Mat2 oldP = query(dfn[tp], tail[tp]);
            long long oldF0 = max(oldP.m[0][0], oldP.m[0][1]);
            long long oldF1 = max(oldP.m[1][0], oldP.m[1][1]);
            update(dfn[cur], {{{g0[cur], g0[cur]}, {g1[cur], NEG_INF}}});
            Mat2 newP = query(dfn[tp], tail[tp]);
            long long newF0 = max(newP.m[0][0], newP.m[0][1]);
            long long newF1 = max(newP.m[1][0], newP.m[1][1]);
            int p = fa[tp];
            if (!p) break;
            g0[p] += max(newF0, newF1) - max(oldF0, oldF1);
            g1[p] += newF0 - oldF0;
            cur = p;
        }

        Mat2 rp = query(dfn[1], tail[1]);
        long long ans = max({rp.m[0][0], rp.m[0][1], rp.m[1][0], rp.m[1][1]});
        cout << ans << "\\n";
    }
    return 0;
}
`,
        rust: `use std::io::{self, Read};

const NEG_INF: i64 = -(1i64 << 55);

#[derive(Clone, Copy)]
struct Mat2 {
    m: [[i64; 2]; 2],
}

fn mul(a: Mat2, b: Mat2) -> Mat2 {
    let mut c = [[NEG_INF; 2]; 2];
    for i in 0..2 {
        for j in 0..2 {
            let mut best = NEG_INF;
            for k in 0..2 {
                if a.m[i][k] > NEG_INF / 2 && b.m[k][j] > NEG_INF / 2 {
                    best = best.max(a.m[i][k] + b.m[k][j]);
                }
            }
            c[i][j] = best;
        }
    }
    Mat2 { m: c }
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

    let mut w = vec![0i64; n + 1];
    for i in 1..=n {
        w[i] = it.next().unwrap().parse().unwrap();
    }
    let mut adj = vec![Vec::new(); n + 1];
    for _ in 0..n - 1 {
        let u: usize = it.next().unwrap().parse().unwrap();
        let v: usize = it.next().unwrap().parse().unwrap();
        adj[u].push(v);
        adj[v].push(u);
    }

    let mut fa = vec![0usize; n + 1];
    let mut order = Vec::with_capacity(n);
    let mut stk = vec![1usize];
    while let Some(u) = stk.pop() {
        order.push(u);
        for &v in &adj[u] {
            if v != fa[u] {
                fa[v] = u;
                stk.push(v);
            }
        }
    }
    let mut sz = vec![1usize; n + 1];
    let mut heavy = vec![0usize; n + 1];
    for &u in order.iter().rev() {
        for &v in &adj[u] {
            if v != fa[u] {
                sz[u] += sz[v];
                if sz[v] > sz[heavy[u]] {
                    heavy[u] = v;
                }
            }
        }
    }

    let mut top = vec![0usize; n + 1];
    let mut dfn = vec![0usize; n + 1];
    let mut tail = vec![0usize; n + 1];
    let mut dfn_order = Vec::with_capacity(n);
    let mut hstk = vec![(1usize, 1usize)];
    let mut timer = 0usize;
    while let Some((u, tp)) = hstk.pop() {
        timer += 1;
        top[u] = tp;
        dfn[u] = timer;
        tail[tp] = timer;
        dfn_order.push(u);
        for &v in &adj[u] {
            if v != fa[u] && v != heavy[u] {
                hstk.push((v, v));
            }
        }
        if heavy[u] != 0 {
            hstk.push((heavy[u], tp));
        }
    }

    let mut g0 = vec![0i64; n + 1];
    let mut g1 = vec![0i64; n + 1];
    let mut f0 = vec![0i64; n + 1];
    let mut f1 = vec![0i64; n + 1];
    for &u in dfn_order.iter().rev() {
        g1[u] = w[u];
        for &v in &adj[u] {
            if v != fa[u] && v != heavy[u] {
                g0[u] += f0[v].max(f1[v]);
                g1[u] += f0[v];
            }
        }
        let h = heavy[u];
        f0[u] = g0[u] + if h != 0 { f0[h].max(f1[h]) } else { 0 };
        f1[u] = g1[u] + if h != 0 { f0[h] } else { 0 };
    }

    let mut size = 1usize;
    while size < n {
        size <<= 1;
    }
    let ident = Mat2 {
        m: [[0, NEG_INF], [NEG_INF, 0]],
    };
    let mut tree = vec![ident; 2 * size];
    for u in 1..=n {
        tree[size + dfn[u] - 1] = Mat2 {
            m: [[g0[u], g0[u]], [g1[u], NEG_INF]],
        };
    }
    for i in (1..size).rev() {
        tree[i] = mul(tree[2 * i], tree[2 * i + 1]);
    }

    let query = |tree: &[Mat2], mut l: usize, mut r: usize| -> Mat2 {
        l += size - 1;
        r += size - 1;
        let mut res_l = ident;
        let mut res_r = ident;
        while l <= r {
            if (l & 1) == 1 {
                res_l = mul(res_l, tree[l]);
                l += 1;
            }
            if (r & 1) == 0 {
                res_r = mul(tree[r], res_r);
                r -= 1;
            }
            l >>= 1;
            r >>= 1;
        }
        mul(res_l, res_r)
    };

    let mut out = String::new();
    for _ in 0..q {
        let u: usize = it.next().unwrap().parse().unwrap();
        let nw: i64 = it.next().unwrap().parse().unwrap();
        g1[u] += nw - w[u];
        w[u] = nw;

        let mut cur = u;
        while cur != 0 {
            let tp = top[cur];
            let old_p = query(&tree, dfn[tp], tail[tp]);
            let old_f0 = old_p.m[0][0].max(old_p.m[0][1]);
            let old_f1 = old_p.m[1][0].max(old_p.m[1][1]);
            let mut i = size + dfn[cur] - 1;
            tree[i] = Mat2 {
                m: [[g0[cur], g0[cur]], [g1[cur], NEG_INF]],
            };
            i >>= 1;
            while i > 0 {
                tree[i] = mul(tree[2 * i], tree[2 * i + 1]);
                i >>= 1;
            }
            let new_p = query(&tree, dfn[tp], tail[tp]);
            let new_f0 = new_p.m[0][0].max(new_p.m[0][1]);
            let new_f1 = new_p.m[1][0].max(new_p.m[1][1]);
            let p = fa[tp];
            if p == 0 {
                break;
            }
            g0[p] += new_f0.max(new_f1) - old_f0.max(old_f1);
            g1[p] += new_f0 - old_f0;
            cur = p;
        }
        let rp = query(&tree, dfn[1], tail[1]);
        let ans = rp.m[0][0].max(rp.m[0][1]).max(rp.m[1][0]).max(rp.m[1][1]);
        out.push_str(&format!("{ans}\\n"));
    }
    print!("{out}");
}
`,
        java21: `import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

public class Main {
    static final long NEG_INF = -(1L << 55);

    static class FastScanner {
        private final InputStream in;
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;

        FastScanner(InputStream in) {
            this.in = in;
        }

        private int readByte() throws IOException {
            if (ptr >= len) {
                len = in.read(buf);
                ptr = 0;
                if (len <= 0) return -1;
            }
            return buf[ptr++];
        }

        long nextLong() throws IOException {
            int c = readByte();
            while (c != -1 && c <= ' ') c = readByte();
            if (c == -1) return Long.MIN_VALUE;
            long sign = 1;
            if (c == '-') {
                sign = -1;
                c = readByte();
            }
            long res = 0;
            while (c > ' ') {
                res = res * 10 + (c - '0');
                c = readByte();
            }
            return res * sign;
        }

        int nextInt() throws IOException {
            return (int) nextLong();
        }
    }

    static long[] mul(long[] a, long[] b) {
        long c00 = Math.max(a[0] + b[0], a[1] + b[2]);
        long c01 = Math.max(a[0] + b[1], a[1] + b[3]);
        long c10 = Math.max(a[2] + b[0], a[3] + b[2]);
        long c11 = Math.max(a[2] + b[1], a[3] + b[3]);
        return new long[]{
            Math.max(c00, NEG_INF), Math.max(c01, NEG_INF),
            Math.max(c10, NEG_INF), Math.max(c11, NEG_INF)
        };
    }

    @SuppressWarnings("unchecked")
    public static void main(String[] args) throws IOException {
        FastScanner fs = new FastScanner(System.in);
        long nLong = fs.nextLong();
        if (nLong == Long.MIN_VALUE) return;
        int n = (int) nLong;
        int q = fs.nextInt();

        long[] w = new long[n + 1];
        for (int i = 1; i <= n; i++) w[i] = fs.nextLong();
        List<Integer>[] adj = new ArrayList[n + 1];
        for (int i = 1; i <= n; i++) adj[i] = new ArrayList<>();
        for (int i = 0; i < n - 1; i++) {
            int u = fs.nextInt(), v = fs.nextInt();
            adj[u].add(v);
            adj[v].add(u);
        }

        int[] fa = new int[n + 1], order = new int[n], stk = new int[n];
        int ptr = 0, topS = 0;
        stk[topS++] = 1;
        while (topS > 0) {
            int u = stk[--topS];
            order[ptr++] = u;
            for (int v : adj[u]) {
                if (v != fa[u]) {
                    fa[v] = u;
                    stk[topS++] = v;
                }
            }
        }
        int[] sz = new int[n + 1], heavy = new int[n + 1];
        for (int i = n - 1; i >= 0; i--) {
            int u = order[i];
            sz[u] = 1;
            for (int v : adj[u]) {
                if (v != fa[u]) {
                    sz[u] += sz[v];
                    if (sz[v] > sz[heavy[u]]) heavy[u] = v;
                }
            }
        }

        int[] top = new int[n + 1], dfn = new int[n + 1], tail = new int[n + 1], dfnOrd = new int[n];
        int[] hn = new int[n], ht = new int[n];
        int sp = 0, timer = 0;
        hn[sp] = 1;
        ht[sp] = 1;
        sp++;
        while (sp > 0) {
            sp--;
            int u = hn[sp], tp = ht[sp];
            dfn[u] = ++timer;
            top[u] = tp;
            tail[tp] = timer;
            dfnOrd[timer - 1] = u;
            for (int v : adj[u]) {
                if (v != fa[u] && v != heavy[u]) {
                    hn[sp] = v;
                    ht[sp] = v;
                    sp++;
                }
            }
            if (heavy[u] != 0) {
                hn[sp] = heavy[u];
                ht[sp] = tp;
                sp++;
            }
        }

        long[] g0 = new long[n + 1], g1 = new long[n + 1], f0 = new long[n + 1], f1 = new long[n + 1];
        for (int i = n - 1; i >= 0; i--) {
            int u = dfnOrd[i];
            g1[u] = w[u];
            for (int v : adj[u]) {
                if (v != fa[u] && v != heavy[u]) {
                    g0[u] += Math.max(f0[v], f1[v]);
                    g1[u] += f0[v];
                }
            }
            int h = heavy[u];
            f0[u] = g0[u] + (h != 0 ? Math.max(f0[h], f1[h]) : 0);
            f1[u] = g1[u] + (h != 0 ? f0[h] : 0);
        }

        int size = 1;
        while (size < n) size <<= 1;
        long[] ident = new long[]{0, NEG_INF, NEG_INF, 0};
        long[][] tree = new long[2 * size][];
        for (int i = 0; i < 2 * size; i++) tree[i] = ident;
        for (int u = 1; u <= n; u++) {
            tree[size + dfn[u] - 1] = new long[]{g0[u], g0[u], g1[u], NEG_INF};
        }
        for (int i = size - 1; i >= 1; i--) tree[i] = mul(tree[2 * i], tree[2 * i + 1]);

        StringBuilder sb = new StringBuilder();
        while (q-- > 0) {
            int u = fs.nextInt();
            long nw = fs.nextLong();
            g1[u] += nw - w[u];
            w[u] = nw;

            int cur = u;
            while (cur != 0) {
                int tp = top[cur];
                long[] oldP = queryRange(tree, ident, size, dfn[tp], tail[tp]);
                long oldF0 = Math.max(oldP[0], oldP[1]), oldF1 = Math.max(oldP[2], oldP[3]);

                int idxPos = size + dfn[cur] - 1;
                tree[idxPos] = new long[]{g0[cur], g0[cur], g1[cur], NEG_INF};
                for (idxPos >>= 1; idxPos >= 1; idxPos >>= 1) {
                    tree[idxPos] = mul(tree[2 * idxPos], tree[2 * idxPos + 1]);
                }

                long[] newP = queryRange(tree, ident, size, dfn[tp], tail[tp]);
                long newF0 = Math.max(newP[0], newP[1]), newF1 = Math.max(newP[2], newP[3]);
                int p = fa[tp];
                if (p == 0) break;
                g0[p] += Math.max(newF0, newF1) - Math.max(oldF0, oldF1);
                g1[p] += newF0 - oldF0;
                cur = p;
            }
            long[] rp = queryRange(tree, ident, size, dfn[1], tail[1]);
            long ans = Math.max(Math.max(rp[0], rp[1]), Math.max(rp[2], rp[3]));
            sb.append(ans).append('\\n');
        }
        System.out.print(sb);
    }

    static long[] queryRange(long[][] tree, long[] ident, int size, int l, int r) {
        l += size - 1;
        r += size - 1;
        long[] resL = ident, resR = ident;
        while (l <= r) {
            if ((l & 1) == 1) resL = mul(resL, tree[l++]);
            if ((r & 1) == 0) resR = mul(tree[r--], resR);
            l >>= 1;
            r >>= 1;
        }
        return mul(resL, resR);
    }
}
`,
        python3: `import sys

sys.setrecursionlimit(200000)
NEG_INF = -(1 << 55)


def mul(a: tuple[int, int, int, int], b: tuple[int, int, int, int]) -> tuple[int, int, int, int]:
    c00 = max(a[0] + b[0], a[1] + b[2])
    c01 = max(a[0] + b[1], a[1] + b[3])
    c10 = max(a[2] + b[0], a[3] + b[2])
    c11 = max(a[2] + b[1], a[3] + b[3])
    return (
        c00 if c00 > NEG_INF else NEG_INF,
        c01 if c01 > NEG_INF else NEG_INF,
        c10 if c10 > NEG_INF else NEG_INF,
        c11 if c11 > NEG_INF else NEG_INF,
    )


def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    n = int(next(it))
    q = int(next(it))
    w = [0] + [int(next(it)) for _ in range(n)]
    adj: list[list[int]] = [[] for _ in range(n + 1)]
    for _ in range(n - 1):
        u = int(next(it))
        v = int(next(it))
        adj[u].append(v)
        adj[v].append(u)

    fa = [0] * (n + 1)
    order: list[int] = []
    stk = [1]
    while stk:
        u = stk.pop()
        order.append(u)
        for v in adj[u]:
            if v != fa[u]:
                fa[v] = u
                stk.append(v)

    sz = [1] * (n + 1)
    heavy = [0] * (n + 1)
    for u in reversed(order):
        for v in adj[u]:
            if v != fa[u]:
                sz[u] += sz[v]
                if sz[v] > sz[heavy[u]]:
                    heavy[u] = v

    top = [0] * (n + 1)
    dfn = [0] * (n + 1)
    tail = [0] * (n + 1)
    dfn_ord: list[int] = []
    hstk = [(1, 1)]
    timer = 0
    while hstk:
        u, tp = hstk.pop()
        timer += 1
        top[u] = tp
        dfn[u] = timer
        tail[tp] = timer
        dfn_ord.append(u)
        for v in adj[u]:
            if v != fa[u] and v != heavy[u]:
                hstk.append((v, v))
        if heavy[u]:
            hstk.append((heavy[u], tp))

    g0 = [0] * (n + 1)
    g1 = [0] * (n + 1)
    f0 = [0] * (n + 1)
    f1 = [0] * (n + 1)
    for u in reversed(dfn_ord):
        g1[u] = w[u]
        for v in adj[u]:
            if v != fa[u] and v != heavy[u]:
                g0[u] += max(f0[v], f1[v])
                g1[u] += f0[v]
        h = heavy[u]
        f0[u] = g0[u] + (max(f0[h], f1[h]) if h else 0)
        f1[u] = g1[u] + (f0[h] if h else 0)

    size = 1
    while size < n:
        size <<= 1
    ident = (0, NEG_INF, NEG_INF, 0)
    tree = [ident] * (2 * size)
    for u in range(1, n + 1):
        tree[size + dfn[u] - 1] = (g0[u], g0[u], g1[u], NEG_INF)
    for i in range(size - 1, 0, -1):
        tree[i] = mul(tree[2 * i], tree[2 * i + 1])

    def query(l: int, r: int) -> tuple[int, int, int, int]:
        l += size - 1
        r += size - 1
        rl = ident
        rr = ident
        while l <= r:
            if l & 1:
                rl = mul(rl, tree[l])
                l += 1
            if not (r & 1):
                rr = mul(tree[r], rr)
                r -= 1
            l >>= 1
            r >>= 1
        return mul(rl, rr)

    out: list[str] = []
    for _ in range(q):
        u = int(next(it))
        nw = int(next(it))
        g1[u] += nw - w[u]
        w[u] = nw

        cur = u
        while cur:
            tp = top[cur]
            old_p = query(dfn[tp], tail[tp])
            old_f0 = max(old_p[0], old_p[1])
            old_f1 = max(old_p[2], old_p[3])
            idx_pos = size + dfn[cur] - 1
            tree[idx_pos] = (g0[cur], g0[cur], g1[cur], NEG_INF)
            idx_pos >>= 1
            while idx_pos:
                tree[idx_pos] = mul(tree[2 * idx_pos], tree[2 * idx_pos + 1])
                idx_pos >>= 1
            new_p = query(dfn[tp], tail[tp])
            new_f0 = max(new_p[0], new_p[1])
            new_f1 = max(new_p[2], new_p[3])
            p = fa[tp]
            if not p:
                break
            g0[p] += max(new_f0, new_f1) - max(old_f0, old_f1)
            g1[p] += new_f0 - old_f0
            cur = p

        rp = query(dfn[1], tail[1])
        out.append(str(max(rp[0], rp[1], rp[2], rp[3])))
    sys.stdout.write("\\n".join(out) + ("\\n" if out else ""))


if __name__ == "__main__":
    solve()
`,
        ruby: `NEG_INF = -(1 << 55)

def mul(a, b)
  c00 = [a[0] + b[0], a[1] + b[2]].max
  c01 = [a[0] + b[1], a[1] + b[3]].max
  c10 = [a[2] + b[0], a[3] + b[2]].max
  c11 = [a[2] + b[1], a[3] + b[3]].max
  [
    c00 > NEG_INF ? c00 : NEG_INF,
    c01 > NEG_INF ? c01 : NEG_INF,
    c10 > NEG_INF ? c10 : NEG_INF,
    c11 > NEG_INF ? c11 : NEG_INF,
  ]
end

data = $stdin.read.split
exit if data.empty?
idx = 0
n = data[idx].to_i; idx += 1
q = data[idx].to_i; idx += 1
w = Array.new(n + 1, 0)
(1..n).each { |i| w[i] = data[idx].to_i; idx += 1 }
adj = Array.new(n + 1) { [] }
(n - 1).times do
  u = data[idx].to_i; idx += 1
  v = data[idx].to_i; idx += 1
  adj[u] << v
  adj[v] << u
end

fa = Array.new(n + 1, 0)
order = []
stk = [1]
until stk.empty?
  u = stk.pop
  order << u
  adj[u].each do |v|
    next if v == fa[u]

    fa[v] = u
    stk << v
  end
end
sz = Array.new(n + 1, 1)
heavy = Array.new(n + 1, 0)
order.reverse_each do |u|
  adj[u].each do |v|
    next if v == fa[u]

    sz[u] += sz[v]
    heavy[u] = v if sz[v] > sz[heavy[u]]
  end
end

top = Array.new(n + 1, 0)
dfn = Array.new(n + 1, 0)
tail = Array.new(n + 1, 0)
dfn_ord = []
hstk = [[1, 1]]
timer = 0
until hstk.empty?
  u, tp = hstk.pop
  timer += 1
  top[u] = tp
  dfn[u] = timer
  tail[tp] = timer
  dfn_ord << u
  adj[u].each do |v|
    next if v == fa[u] || v == heavy[u]

    hstk << [v, v]
  end
  hstk << [heavy[u], tp] if heavy[u] != 0
end

g0 = Array.new(n + 1, 0)
g1 = Array.new(n + 1, 0)
f0 = Array.new(n + 1, 0)
f1 = Array.new(n + 1, 0)
dfn_ord.reverse_each do |u|
  g1[u] = w[u]
  adj[u].each do |v|
    next if v == fa[u] || v == heavy[u]

    g0[u] += [f0[v], f1[v]].max
    g1[u] += f0[v]
  end
  h = heavy[u]
  f0[u] = g0[u] + (h != 0 ? [f0[h], f1[h]].max : 0)
  f1[u] = g1[u] + (h != 0 ? f0[h] : 0)
end

size = 1
size <<= 1 while size < n
ident = [0, NEG_INF, NEG_INF, 0]
tree = Array.new(2 * size, ident)
(1..n).each { |u| tree[size + dfn[u] - 1] = [g0[u], g0[u], g1[u], NEG_INF] }
(size - 1).downto(1) { |i| tree[i] = mul(tree[2 * i], tree[2 * i + 1]) }

query = lambda do |l, r|
  l += size - 1
  r += size - 1
  rl = ident
  rr = ident
  while l <= r
    if (l & 1) == 1
      rl = mul(rl, tree[l])
      l += 1
    end
    if (r & 1) == 0
      rr = mul(tree[r], rr)
      r -= 1
    end
    l >>= 1
    r >>= 1
  end
  mul(rl, rr)
end

out = []
q.times do
  u = data[idx].to_i; idx += 1
  nw = data[idx].to_i; idx += 1
  g1[u] += nw - w[u]
  w[u] = nw

  cur = u
  while cur != 0
    tp = top[cur]
    old_p = query.call(dfn[tp], tail[tp])
    old_f0 = [old_p[0], old_p[1]].max
    old_f1 = [old_p[2], old_p[3]].max
    i = size + dfn[cur] - 1
    tree[i] = [g0[cur], g0[cur], g1[cur], NEG_INF]
    i >>= 1
    while i > 0
      tree[i] = mul(tree[2 * i], tree[2 * i + 1])
      i >>= 1
    end
    new_p = query.call(dfn[tp], tail[tp])
    new_f0 = [new_p[0], new_p[1]].max
    new_f1 = [new_p[2], new_p[3]].max
    p = fa[tp]
    break if p == 0

    g0[p] += [new_f0, new_f1].max - [old_f0, old_f1].max
    g1[p] += new_f0 - old_f0
    cur = p
  end
  rp = query.call(dfn[1], tail[1])
  out << rp.max.to_s
end

puts out.join("\\n") unless out.empty?
`,
      },
    },
    {
      id: 'ch70-p3',
      tier: 'Boss',
      ratingRange: '2800–3200',
      title: 'Dynamic Weighted Tree Diameter via Lazy-Deletion Multisets',
      statement:
        'You are given a tree of N vertices (1..N) with initial non-negative integer vertex weights w_1..w_N. Process Q updates: given (u nw), change w_u = nw and output the maximum total weight of any simple path in the tree.',
      constraints: '1 <= N, Q <= 10^5; 0 <= w_i, nw <= 10^9',
      sampleInput: `5 3
1 2 3 4 5
1 2
1 3
2 4
2 5
3 10
2 0
4 20`,
      sampleOutput: `18
16
31`,
      hints: [
        'For each vertex u, maintain two lazy-deletion max-heaps (addHeap, delHeap) for light children: one tracking downward max paths down[v], and one tracking whole-subtree diameters best[v].',
        'Let d1, d2 be the top two values of light_down[u] (0 if absent), and b_light be the top of light_best[u] (0 if absent).',
        'Encode [down[u], best[u], 0]^T = M[u] * [down[heavy[u]], best[heavy[u]], 0]^T using a 3x3 (max, +) matrix where M[u] has rows [w[u], -INF, w[u]+d1], [w[u]+d1, 0, max(b_light, w[u]+d1+d2)], [-INF, -INF, 0].',
      ],
      solutions: {
        cpp20: `#include <algorithm>
#include <iostream>
#include <queue>
#include <vector>

using namespace std;

static constexpr long long NEG_INF = -(1LL << 55);

struct LazyMaxHeap {
    priority_queue<long long> addQ, delQ;

    void clean() {
        while (!delQ.empty() && !addQ.empty() && addQ.top() == delQ.top()) {
            addQ.pop();
            delQ.pop();
        }
    }

    void insert(long long x) { addQ.push(x); }
    void erase(long long x) { delQ.push(x); }

    long long top1() {
        clean();
        return addQ.empty() ? 0LL : addQ.top();
    }

    pair<long long, long long> top2() {
        clean();
        if (addQ.empty()) return {0LL, 0LL};
        long long first = addQ.top();
        addQ.pop();
        clean();
        long long second = addQ.empty() ? 0LL : addQ.top();
        addQ.push(first);
        return {first, second};
    }
};

struct Mat3 {
    long long m[3][3];
};

Mat3 mul(const Mat3& a, const Mat3& b) {
    Mat3 c;
    for (int i = 0; i < 3; ++i) {
        for (int j = 0; j < 3; ++j) {
            long long best = NEG_INF;
            for (int k = 0; k < 3; ++k) {
                if (a.m[i][k] > NEG_INF / 2 && b.m[k][j] > NEG_INF / 2) {
                    best = max(best, a.m[i][k] + b.m[k][j]);
                }
            }
            c.m[i][j] = best;
        }
    }
    return c;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, q;
    if (!(cin >> n >> q)) return 0;
    vector<long long> w(n + 1);
    for (int i = 1; i <= n; ++i) cin >> w[i];

    vector<vector<int>> adj(n + 1);
    for (int i = 0; i < n - 1; ++i) {
        int u, v;
        cin >> u >> v;
        adj[u].push_back(v);
        adj[v].push_back(u);
    }

    vector<int> fa(n + 1, 0), sz(n + 1, 0), heavy(n + 1, 0), top(n + 1, 0), dfn(n + 1, 0), tail(n + 1, 0);
    auto dfs1 = [&](auto& self, int u, int p) -> void {
        fa[u] = p;
        sz[u] = 1;
        for (int v : adj[u]) {
            if (v == p) continue;
            self(self, v, u);
            sz[u] += sz[v];
            if (sz[v] > sz[heavy[u]]) heavy[u] = v;
        }
    };
    dfs1(dfs1, 1, 0);

    vector<LazyMaxHeap> lightDown(n + 1), lightBest(n + 1);
    vector<long long> downDP(n + 1, 0), bestDP(n + 1, 0);
    int timer = 0;

    auto makeNodeMat = [&](int u) -> Mat3 {
        auto [d1, d2] = lightDown[u].top2();
        long long bl = lightBest[u].top1();
        long long midPath = max(bl, w[u] + d1 + d2);
        return {{
            {w[u], NEG_INF, w[u] + d1},
            {w[u] + d1, 0, midPath},
            {NEG_INF, NEG_INF, 0},
        }};
    };

    auto dfs2 = [&](auto& self, int u, int tp) -> void {
        top[u] = tp;
        dfn[u] = ++timer;
        tail[tp] = dfn[u];
        if (heavy[u]) self(self, heavy[u], tp);
        for (int v : adj[u]) {
            if (v == fa[u] || v == heavy[u]) continue;
            self(self, v, v);
            lightDown[u].insert(downDP[v]);
            lightBest[u].insert(bestDP[v]);
        }
        auto [d1, d2] = lightDown[u].top2();
        long long bl = lightBest[u].top1();
        int h = heavy[u];
        downDP[u] = w[u] + max(d1, downDP[h]);
        bestDP[u] = max({bestDP[h], bl, w[u] + d1 + max(d2, downDP[h])});
    };
    dfs2(dfs2, 1, 1);

    int size = 1;
    while (size < n) size <<= 1;
    Mat3 ident = {{{0, NEG_INF, NEG_INF}, {NEG_INF, 0, NEG_INF}, {NEG_INF, NEG_INF, 0}}};
    vector<Mat3> tree(2 * size, ident);
    for (int u = 1; u <= n; ++u) tree[size + dfn[u] - 1] = makeNodeMat(u);
    for (int i = size - 1; i >= 1; --i) tree[i] = mul(tree[2 * i], tree[2 * i + 1]);

    auto updateSeg = [&](int pos, const Mat3& val) {
        int i = size + pos - 1;
        tree[i] = val;
        for (i >>= 1; i >= 1; i >>= 1) tree[i] = mul(tree[2 * i], tree[2 * i + 1]);
    };

    auto querySeg = [&](int l, int r) -> Mat3 {
        l += size - 1;
        r += size - 1;
        Mat3 rl = ident, rr = ident;
        while (l <= r) {
            if (l & 1) rl = mul(rl, tree[l++]);
            if (!(r & 1)) rr = mul(tree[r--], rr);
            l >>= 1;
            r >>= 1;
        }
        return mul(rl, rr);
    };

    while (q--) {
        int u;
        long long nw;
        cin >> u >> nw;
        w[u] = nw;

        int cur = u;
        while (cur) {
            int tp = top[cur];
            Mat3 oldP = querySeg(dfn[tp], tail[tp]);
            long long oldDown = oldP.m[0][2], oldBest = oldP.m[1][2];

            updateSeg(dfn[cur], makeNodeMat(cur));

            Mat3 newP = querySeg(dfn[tp], tail[tp]);
            long long newDown = newP.m[0][2], newBest = newP.m[1][2];

            int p = fa[tp];
            if (!p) break;
            lightDown[p].erase(oldDown);
            lightDown[p].insert(newDown);
            lightBest[p].erase(oldBest);
            lightBest[p].insert(newBest);
            cur = p;
        }

        cout << querySeg(dfn[1], tail[1]).m[1][2] << "\\n";
    }
    return 0;
}
`,
        rust: `use std::collections::BinaryHeap;
use std::io::{self, Read};

const NEG_INF: i64 = -(1i64 << 55);

#[derive(Default)]
struct LazyMaxHeap {
    add_q: BinaryHeap<i64>,
    del_q: BinaryHeap<i64>,
}

impl LazyMaxHeap {
    fn clean(&mut self) {
        while let (Some(&a), Some(&d)) = (self.add_q.peek(), self.del_q.peek()) {
            if a == d {
                self.add_q.pop();
                self.del_q.pop();
            } else {
                break;
            }
        }
    }

    fn insert(&mut self, x: i64) {
        self.add_q.push(x);
    }

    fn erase(&mut self, x: i64) {
        self.del_q.push(x);
    }

    fn top1(&mut self) -> i64 {
        self.clean();
        *self.add_q.peek().unwrap_or(&0)
    }

    fn top2(&mut self) -> (i64, i64) {
        self.clean();
        let Some(first) = self.add_q.pop() else {
            return (0, 0);
        };
        self.clean();
        let second = *self.add_q.peek().unwrap_or(&0);
        self.add_q.push(first);
        (first, second)
    }
}

#[derive(Clone, Copy)]
struct Mat3 {
    m: [[i64; 3]; 3],
}

fn mul(a: Mat3, b: Mat3) -> Mat3 {
    let mut c = [[NEG_INF; 3]; 3];
    for i in 0..3 {
        for j in 0..3 {
            let mut best = NEG_INF;
            for k in 0..3 {
                if a.m[i][k] > NEG_INF / 2 && b.m[k][j] > NEG_INF / 2 {
                    best = best.max(a.m[i][k] + b.m[k][j]);
                }
            }
            c[i][j] = best;
        }
    }
    Mat3 { m: c }
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

    let mut w = vec![0i64; n + 1];
    for i in 1..=n {
        w[i] = it.next().unwrap().parse().unwrap();
    }
    let mut adj = vec![Vec::new(); n + 1];
    for _ in 0..n - 1 {
        let u: usize = it.next().unwrap().parse().unwrap();
        let v: usize = it.next().unwrap().parse().unwrap();
        adj[u].push(v);
        adj[v].push(u);
    }

    let mut fa = vec![0usize; n + 1];
    let mut order = Vec::with_capacity(n);
    let mut stk = vec![1usize];
    while let Some(u) = stk.pop() {
        order.push(u);
        for &v in &adj[u] {
            if v != fa[u] {
                fa[v] = u;
                stk.push(v);
            }
        }
    }
    let mut sz = vec![1usize; n + 1];
    let mut heavy = vec![0usize; n + 1];
    for &u in order.iter().rev() {
        for &v in &adj[u] {
            if v != fa[u] {
                sz[u] += sz[v];
                if sz[v] > sz[heavy[u]] {
                    heavy[u] = v;
                }
            }
        }
    }

    let mut top = vec![0usize; n + 1];
    let mut dfn = vec![0usize; n + 1];
    let mut tail = vec![0usize; n + 1];
    let mut dfn_ord = Vec::with_capacity(n);
    let mut hstk = vec![(1usize, 1usize)];
    let mut timer = 0usize;
    while let Some((u, tp)) = hstk.pop() {
        timer += 1;
        top[u] = tp;
        dfn[u] = timer;
        tail[tp] = timer;
        dfn_ord.push(u);
        for &v in &adj[u] {
            if v != fa[u] && v != heavy[u] {
                hstk.push((v, v));
            }
        }
        if heavy[u] != 0 {
            hstk.push((heavy[u], tp));
        }
    }

    let mut light_down: Vec<LazyMaxHeap> = (0..=n).map(|_| LazyMaxHeap::default()).collect();
    let mut light_best: Vec<LazyMaxHeap> = (0..=n).map(|_| LazyMaxHeap::default()).collect();
    let mut down_dp = vec![0i64; n + 1];
    let mut best_dp = vec![0i64; n + 1];
    for &u in dfn_ord.iter().rev() {
        for &v in &adj[u] {
            if v != fa[u] && v != heavy[u] {
                light_down[u].insert(down_dp[v]);
                light_best[u].insert(best_dp[v]);
            }
        }
        let (d1, d2) = light_down[u].top2();
        let bl = light_best[u].top1();
        let h = heavy[u];
        down_dp[u] = w[u] + d1.max(down_dp[h]);
        best_dp[u] = best_dp[h].max(bl).max(w[u] + d1 + d2.max(down_dp[h]));
    }

    let make_mat = |u: usize, w: &[i64], ld: &mut [LazyMaxHeap], lb: &mut [LazyMaxHeap]| -> Mat3 {
        let (d1, d2) = ld[u].top2();
        let bl = lb[u].top1();
        Mat3 {
            m: [
                [w[u], NEG_INF, w[u] + d1],
                [w[u] + d1, 0, bl.max(w[u] + d1 + d2)],
                [NEG_INF, NEG_INF, 0],
            ],
        }
    };

    let mut size = 1usize;
    while size < n {
        size <<= 1;
    }
    let ident = Mat3 {
        m: [[0, NEG_INF, NEG_INF], [NEG_INF, 0, NEG_INF], [NEG_INF, NEG_INF, 0]],
    };
    let mut tree = vec![ident; 2 * size];
    for u in 1..=n {
        tree[size + dfn[u] - 1] = make_mat(u, &w, &mut light_down, &mut light_best);
    }
    for i in (1..size).rev() {
        tree[i] = mul(tree[2 * i], tree[2 * i + 1]);
    }

    let query = |tree: &[Mat3], mut l: usize, mut r: usize| -> Mat3 {
        l += size - 1;
        r += size - 1;
        let mut rl = ident;
        let mut rr = ident;
        while l <= r {
            if (l & 1) == 1 {
                rl = mul(rl, tree[l]);
                l += 1;
            }
            if (r & 1) == 0 {
                rr = mul(tree[r], rr);
                r -= 1;
            }
            l >>= 1;
            r >>= 1;
        }
        mul(rl, rr)
    };

    let mut out = String::new();
    for _ in 0..q {
        let u: usize = it.next().unwrap().parse().unwrap();
        let nw: i64 = it.next().unwrap().parse().unwrap();
        w[u] = nw;

        let mut cur = u;
        while cur != 0 {
            let tp = top[cur];
            let old_p = query(&tree, dfn[tp], tail[tp]);
            let (old_down, old_best) = (old_p.m[0][2], old_p.m[1][2]);
            let mut i = size + dfn[cur] - 1;
            tree[i] = make_mat(cur, &w, &mut light_down, &mut light_best);
            i >>= 1;
            while i > 0 {
                tree[i] = mul(tree[2 * i], tree[2 * i + 1]);
                i >>= 1;
            }
            let new_p = query(&tree, dfn[tp], tail[tp]);
            let (new_down, new_best) = (new_p.m[0][2], new_p.m[1][2]);
            let p = fa[tp];
            if p == 0 {
                break;
            }
            light_down[p].erase(old_down);
            light_down[p].insert(new_down);
            light_best[p].erase(old_best);
            light_best[p].insert(new_best);
            cur = p;
        }

        out.push_str(&format!("{}\\n", query(&tree, dfn[1], tail[1]).m[1][2]));
    }
    print!("{out}");
}
`,
        java21: `import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.PriorityQueue;

public class Main {
    static final long NEG_INF = -(1L << 55);

    static class FastScanner {
        private final InputStream in;
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;

        FastScanner(InputStream in) {
            this.in = in;
        }

        private int readByte() throws IOException {
            if (ptr >= len) {
                len = in.read(buf);
                ptr = 0;
                if (len <= 0) return -1;
            }
            return buf[ptr++];
        }

        long nextLong() throws IOException {
            int c = readByte();
            while (c != -1 && c <= ' ') c = readByte();
            if (c == -1) return Long.MIN_VALUE;
            long res = 0;
            while (c > ' ') {
                res = res * 10 + (c - '0');
                c = readByte();
            }
            return res;
        }

        int nextInt() throws IOException {
            return (int) nextLong();
        }
    }

    static class LazyMaxHeap {
        final PriorityQueue<Long> addQ = new PriorityQueue<>(Collections.reverseOrder());
        final PriorityQueue<Long> delQ = new PriorityQueue<>(Collections.reverseOrder());

        void clean() {
            while (!delQ.isEmpty() && !addQ.isEmpty() && addQ.peek().equals(delQ.peek())) {
                addQ.poll();
                delQ.poll();
            }
        }

        void insert(long x) { addQ.add(x); }
        void erase(long x) { delQ.add(x); }

        long top1() {
            clean();
            return addQ.isEmpty() ? 0L : addQ.peek();
        }

        long[] top2() {
            clean();
            if (addQ.isEmpty()) return new long[]{0L, 0L};
            long first = addQ.poll();
            clean();
            long second = addQ.isEmpty() ? 0L : addQ.peek();
            addQ.add(first);
            return new long[]{first, second};
        }
    }

    static long[] mul(long[] a, long[] b) {
        long[] c = new long[9];
        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                long best = NEG_INF;
                for (int k = 0; k < 3; k++) {
                    long av = a[i * 3 + k], bv = b[k * 3 + j];
                    if (av > NEG_INF / 2 && bv > NEG_INF / 2) {
                        best = Math.max(best, av + bv);
                    }
                }
                c[i * 3 + j] = best;
            }
        }
        return c;
    }

    static long[] makeMat(int u, long[] w, LazyMaxHeap[] ld, LazyMaxHeap[] lb) {
        long[] t2 = ld[u].top2();
        long d1 = t2[0], d2 = t2[1];
        long bl = lb[u].top1();
        return new long[]{
            w[u], NEG_INF, w[u] + d1,
            w[u] + d1, 0, Math.max(bl, w[u] + d1 + d2),
            NEG_INF, NEG_INF, 0
        };
    }

    static long[] queryRange(long[][] tree, long[] ident, int size, int l, int r) {
        l += size - 1;
        r += size - 1;
        long[] rl = ident, rr = ident;
        while (l <= r) {
            if ((l & 1) == 1) rl = mul(rl, tree[l++]);
            if ((r & 1) == 0) rr = mul(tree[r--], rr);
            l >>= 1;
            r >>= 1;
        }
        return mul(rl, rr);
    }

    @SuppressWarnings("unchecked")
    public static void main(String[] args) throws IOException {
        FastScanner fs = new FastScanner(System.in);
        long nLong = fs.nextLong();
        if (nLong == Long.MIN_VALUE) return;
        int n = (int) nLong;
        int q = fs.nextInt();

        long[] w = new long[n + 1];
        for (int i = 1; i <= n; i++) w[i] = fs.nextLong();
        List<Integer>[] adj = new ArrayList[n + 1];
        for (int i = 1; i <= n; i++) adj[i] = new ArrayList<>();
        for (int i = 0; i < n - 1; i++) {
            int u = fs.nextInt(), v = fs.nextInt();
            adj[u].add(v);
            adj[v].add(u);
        }

        int[] fa = new int[n + 1], order = new int[n], stk = new int[n];
        int ptr = 0, topS = 0;
        stk[topS++] = 1;
        while (topS > 0) {
            int u = stk[--topS];
            order[ptr++] = u;
            for (int v : adj[u]) {
                if (v != fa[u]) {
                    fa[v] = u;
                    stk[topS++] = v;
                }
            }
        }
        int[] sz = new int[n + 1], heavy = new int[n + 1];
        for (int i = n - 1; i >= 0; i--) {
            int u = order[i];
            sz[u] = 1;
            for (int v : adj[u]) {
                if (v != fa[u]) {
                    sz[u] += sz[v];
                    if (sz[v] > sz[heavy[u]]) heavy[u] = v;
                }
            }
        }

        int[] top = new int[n + 1], dfn = new int[n + 1], tail = new int[n + 1], dfnOrd = new int[n];
        int[] hn = new int[n], ht = new int[n];
        int sp = 0, timer = 0;
        hn[sp] = 1;
        ht[sp] = 1;
        sp++;
        while (sp > 0) {
            sp--;
            int u = hn[sp], tp = ht[sp];
            dfn[u] = ++timer;
            top[u] = tp;
            tail[tp] = timer;
            dfnOrd[timer - 1] = u;
            for (int v : adj[u]) {
                if (v != fa[u] && v != heavy[u]) {
                    hn[sp] = v;
                    ht[sp] = v;
                    sp++;
                }
            }
            if (heavy[u] != 0) {
                hn[sp] = heavy[u];
                ht[sp] = tp;
                sp++;
            }
        }

        LazyMaxHeap[] ld = new LazyMaxHeap[n + 1];
        LazyMaxHeap[] lb = new LazyMaxHeap[n + 1];
        for (int i = 0; i <= n; i++) {
            ld[i] = new LazyMaxHeap();
            lb[i] = new LazyMaxHeap();
        }
        long[] downDP = new long[n + 1], bestDP = new long[n + 1];
        for (int i = n - 1; i >= 0; i--) {
            int u = dfnOrd[i];
            for (int v : adj[u]) {
                if (v != fa[u] && v != heavy[u]) {
                    ld[u].insert(downDP[v]);
                    lb[u].insert(bestDP[v]);
                }
            }
            long[] t2 = ld[u].top2();
            long bl = lb[u].top1();
            int h = heavy[u];
            downDP[u] = w[u] + Math.max(t2[0], downDP[h]);
            bestDP[u] = Math.max(Math.max(bestDP[h], bl), w[u] + t2[0] + Math.max(t2[1], downDP[h]));
        }

        int size = 1;
        while (size < n) size <<= 1;
        long[] ident = new long[]{0, NEG_INF, NEG_INF, NEG_INF, 0, NEG_INF, NEG_INF, NEG_INF, 0};
        long[][] tree = new long[2 * size][];
        for (int i = 0; i < 2 * size; i++) tree[i] = ident;
        for (int u = 1; u <= n; u++) tree[size + dfn[u] - 1] = makeMat(u, w, ld, lb);
        for (int i = size - 1; i >= 1; i--) tree[i] = mul(tree[2 * i], tree[2 * i + 1]);

        StringBuilder sb = new StringBuilder();
        while (q-- > 0) {
            int u = fs.nextInt();
            w[u] = fs.nextLong();
            int cur = u;
            while (cur != 0) {
                int tp = top[cur];
                long[] oldP = queryRange(tree, ident, size, dfn[tp], tail[tp]);
                long oldDown = oldP[2], oldBest = oldP[5];

                int pos = size + dfn[cur] - 1;
                tree[pos] = makeMat(cur, w, ld, lb);
                for (pos >>= 1; pos >= 1; pos >>= 1) tree[pos] = mul(tree[2 * pos], tree[2 * pos + 1]);

                long[] newP = queryRange(tree, ident, size, dfn[tp], tail[tp]);
                long newDown = newP[2], newBest = newP[5];
                int p = fa[tp];
                if (p == 0) break;
                ld[p].erase(oldDown);
                ld[p].insert(newDown);
                lb[p].erase(oldBest);
                lb[p].insert(newBest);
                cur = p;
            }
            sb.append(queryRange(tree, ident, size, dfn[1], tail[1])[5]).append('\\n');
        }
        System.out.print(sb);
    }
}
`,
        python3: `import heapq
import sys

sys.setrecursionlimit(200000)
NEG_INF = -(1 << 55)


class LazyMaxHeap:
    def __init__(self) -> None:
        self.add_q: list[int] = []
        self.del_q: list[int] = []

    def _clean(self) -> None:
        while self.del_q and self.add_q and self.add_q[0] == self.del_q[0]:
            heapq.heappop(self.add_q)
            heapq.heappop(self.del_q)

    def insert(self, x: int) -> None:
        heapq.heappush(self.add_q, -x)

    def erase(self, x: int) -> None:
        heapq.heappush(self.del_q, -x)

    def top1(self) -> int:
        self._clean()
        return -self.add_q[0] if self.add_q else 0

    def top2(self) -> tuple[int, int]:
        self._clean()
        if not self.add_q:
            return 0, 0
        first = -heapq.heappop(self.add_q)
        self._clean()
        second = -self.add_q[0] if self.add_q else 0
        heapq.heappush(self.add_q, -first)
        return first, second


def mul(a: tuple[int, ...], b: tuple[int, ...]) -> tuple[int, ...]:
    c = [NEG_INF] * 9
    for i in range(3):
        r3 = i * 3
        a0, a1, a2 = a[r3], a[r3 + 1], a[r3 + 2]
        for j in range(3):
            best = max(a0 + b[j], a1 + b[3 + j], a2 + b[6 + j])
            c[r3 + j] = best if best > NEG_INF else NEG_INF
    return tuple(c)


def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    n = int(next(it))
    q = int(next(it))
    w = [0] + [int(next(it)) for _ in range(n)]
    adj: list[list[int]] = [[] for _ in range(n + 1)]
    for _ in range(n - 1):
        u = int(next(it))
        v = int(next(it))
        adj[u].append(v)
        adj[v].append(u)

    fa = [0] * (n + 1)
    order: list[int] = []
    stk = [1]
    while stk:
        u = stk.pop()
        order.append(u)
        for v in adj[u]:
            if v != fa[u]:
                fa[v] = u
                stk.append(v)

    sz = [1] * (n + 1)
    heavy = [0] * (n + 1)
    for u in reversed(order):
        for v in adj[u]:
            if v != fa[u]:
                sz[u] += sz[v]
                if sz[v] > sz[heavy[u]]:
                    heavy[u] = v

    top = [0] * (n + 1)
    dfn = [0] * (n + 1)
    tail = [0] * (n + 1)
    dfn_ord: list[int] = []
    hstk = [(1, 1)]
    timer = 0
    while hstk:
        u, tp = hstk.pop()
        timer += 1
        top[u] = tp
        dfn[u] = timer
        tail[tp] = timer
        dfn_ord.append(u)
        for v in adj[u]:
            if v != fa[u] and v != heavy[u]:
                hstk.append((v, v))
        if heavy[u]:
            hstk.append((heavy[u], tp))

    ld = [LazyMaxHeap() for _ in range(n + 1)]
    lb = [LazyMaxHeap() for _ in range(n + 1)]
    down_dp = [0] * (n + 1)
    best_dp = [0] * (n + 1)
    for u in reversed(dfn_ord):
        for v in adj[u]:
            if v != fa[u] and v != heavy[u]:
                ld[u].insert(down_dp[v])
                lb[u].insert(best_dp[v])
        d1, d2 = ld[u].top2()
        bl = lb[u].top1()
        h = heavy[u]
        down_dp[u] = w[u] + max(d1, down_dp[h])
        best_dp[u] = max(best_dp[h], bl, w[u] + d1 + max(d2, down_dp[h]))

    def make_mat(u: int) -> tuple[int, ...]:
        d1, d2 = ld[u].top2()
        bl = lb[u].top1()
        return (w[u], NEG_INF, w[u] + d1, w[u] + d1, 0, max(bl, w[u] + d1 + d2), NEG_INF, NEG_INF, 0)

    size = 1
    while size < n:
        size <<= 1
    ident = (0, NEG_INF, NEG_INF, NEG_INF, 0, NEG_INF, NEG_INF, NEG_INF, 0)
    tree = [ident] * (2 * size)
    for u in range(1, n + 1):
        tree[size + dfn[u] - 1] = make_mat(u)
    for i in range(size - 1, 0, -1):
        tree[i] = mul(tree[2 * i], tree[2 * i + 1])

    def query(l: int, r: int) -> tuple[int, ...]:
        l += size - 1
        r += size - 1
        rl = ident
        rr = ident
        while l <= r:
            if l & 1:
                rl = mul(rl, tree[l])
                l += 1
            if not (r & 1):
                rr = mul(tree[r], rr)
                r -= 1
            l >>= 1
            r >>= 1
        return mul(rl, rr)

    out: list[str] = []
    for _ in range(q):
        u = int(next(it))
        w[u] = int(next(it))
        cur = u
        while cur:
            tp = top[cur]
            old_p = query(dfn[tp], tail[tp])
            old_down, old_best = old_p[2], old_p[5]
            pos = size + dfn[cur] - 1
            tree[pos] = make_mat(cur)
            pos >>= 1
            while pos:
                tree[pos] = mul(tree[2 * pos], tree[2 * pos + 1])
                pos >>= 1
            new_p = query(dfn[tp], tail[tp])
            new_down, new_best = new_p[2], new_p[5]
            p = fa[tp]
            if not p:
                break
            ld[p].erase(old_down)
            ld[p].insert(new_down)
            lb[p].erase(old_best)
            lb[p].insert(new_best)
            cur = p
        out.append(str(query(dfn[1], tail[1])[5]))

    sys.stdout.write("\\n".join(out) + ("\\n" if out else ""))


if __name__ == "__main__":
    solve()
`,
        ruby: `NEG_INF = -(1 << 55)

class MaxHeap
  def initialize
    @h = []
  end

  def empty?
    @h.empty?
  end

  def peek
    @h[0]
  end

  def push(x)
    @h << x
    i = @h.length - 1
    while i > 0
      p = (i - 1) >> 1
      break if @h[p] >= @h[i]

      @h[p], @h[i] = @h[i], @h[p]
      i = p
    end
  end

  def pop
    top = @h[0]
    last = @h.pop
    unless @h.empty?
      @h[0] = last
      i = 0
      n = @h.length
      loop do
        l = (i << 1) + 1
        r = l + 1
        best = i
        best = l if l < n && @h[l] > @h[best]
        best = r if r < n && @h[r] > @h[best]
        break if best == i

        @h[i], @h[best] = @h[best], @h[i]
        i = best
      end
    end
    top
  end
end

class LazyMaxHeap
  def initialize
    @add_q = MaxHeap.new
    @del_q = MaxHeap.new
  end

  def clean
    while !@del_q.empty? && !@add_q.empty? && @add_q.peek == @del_q.peek
      @add_q.pop
      @del_q.pop
    end
  end

  def insert(x)
    @add_q.push(x)
  end

  def erase(x)
    @del_q.push(x)
  end

  def top1
    clean
    @add_q.empty? ? 0 : @add_q.peek
  end

  def top2
    clean
    return [0, 0] if @add_q.empty?

    first = @add_q.pop
    clean
    second = @add_q.empty? ? 0 : @add_q.peek
    @add_q.push(first)
    [first, second]
  end
end

def mul(a, b)
  c = Array.new(9, NEG_INF)
  3.times do |i|
    r3 = i * 3
    a0 = a[r3]; a1 = a[r3 + 1]; a2 = a[r3 + 2]
    3.times do |j|
      best = [a0 + b[j], a1 + b[3 + j], a2 + b[6 + j]].max
      c[r3 + j] = best > NEG_INF ? best : NEG_INF
    end
  end
  c
end

data = $stdin.read.split
exit if data.empty?
idx = 0
n = data[idx].to_i; idx += 1
q = data[idx].to_i; idx += 1
w = Array.new(n + 1, 0)
(1..n).each { |i| w[i] = data[idx].to_i; idx += 1 }
adj = Array.new(n + 1) { [] }
(n - 1).times do
  u = data[idx].to_i; idx += 1
  v = data[idx].to_i; idx += 1
  adj[u] << v
  adj[v] << u
end

fa = Array.new(n + 1, 0)
order = []
stk = [1]
until stk.empty?
  u = stk.pop
  order << u
  adj[u].each do |v|
    next if v == fa[u]

    fa[v] = u
    stk << v
  end
end
sz = Array.new(n + 1, 1)
heavy = Array.new(n + 1, 0)
order.reverse_each do |u|
  adj[u].each do |v|
    next if v == fa[u]

    sz[u] += sz[v]
    heavy[u] = v if sz[v] > sz[heavy[u]]
  end
end

top = Array.new(n + 1, 0)
dfn = Array.new(n + 1, 0)
tail = Array.new(n + 1, 0)
dfn_ord = []
hstk = [[1, 1]]
timer = 0
until hstk.empty?
  u, tp = hstk.pop
  timer += 1
  top[u] = tp
  dfn[u] = timer
  tail[tp] = timer
  dfn_ord << u
  adj[u].each do |v|
    next if v == fa[u] || v == heavy[u]

    hstk << [v, v]
  end
  hstk << [heavy[u], tp] if heavy[u] != 0
end

ld = Array.new(n + 1) { LazyMaxHeap.new }
lb = Array.new(n + 1) { LazyMaxHeap.new }
down_dp = Array.new(n + 1, 0)
best_dp = Array.new(n + 1, 0)
dfn_ord.reverse_each do |u|
  adj[u].each do |v|
    next if v == fa[u] || v == heavy[u]

    ld[u].insert(down_dp[v])
    lb[u].insert(best_dp[v])
  end
  d1, d2 = ld[u].top2
  bl = lb[u].top1
  h = heavy[u]
  down_dp[u] = w[u] + [d1, down_dp[h]].max
  best_dp[u] = [best_dp[h], bl, w[u] + d1 + [d2, down_dp[h]].max].max
end

make_mat = lambda do |u|
  d1, d2 = ld[u].top2
  bl = lb[u].top1
  [w[u], NEG_INF, w[u] + d1, w[u] + d1, 0, [bl, w[u] + d1 + d2].max, NEG_INF, NEG_INF, 0]
end

size = 1
size <<= 1 while size < n
ident = [0, NEG_INF, NEG_INF, NEG_INF, 0, NEG_INF, NEG_INF, NEG_INF, 0]
tree = Array.new(2 * size, ident)
(1..n).each { |u| tree[size + dfn[u] - 1] = make_mat.call(u) }
(size - 1).downto(1) { |i| tree[i] = mul(tree[2 * i], tree[2 * i + 1]) }

query = lambda do |l, r|
  l += size - 1
  r += size - 1
  rl = ident
  rr = ident
  while l <= r
    if (l & 1) == 1
      rl = mul(rl, tree[l])
      l += 1
    end
    if (r & 1) == 0
      rr = mul(tree[r], rr)
      r -= 1
    end
    l >>= 1
    r >>= 1
  end
  mul(rl, rr)
end

out = []
q.times do
  u = data[idx].to_i; idx += 1
  w[u] = data[idx].to_i; idx += 1
  cur = u
  while cur != 0
    tp = top[cur]
    old_p = query.call(dfn[tp], tail[tp])
    old_down = old_p[2]
    old_best = old_p[5]
    pos = size + dfn[cur] - 1
    tree[pos] = make_mat.call(cur)
    pos >>= 1
    while pos > 0
      tree[pos] = mul(tree[2 * pos], tree[2 * pos + 1])
      pos >>= 1
    end
    new_p = query.call(dfn[tp], tail[tp])
    new_down = new_p[2]
    new_best = new_p[5]
    p = fa[tp]
    break if p == 0

    ld[p].erase(old_down)
    ld[p].insert(new_down)
    lb[p].erase(old_best)
    lb[p].insert(new_best)
    cur = p
  end
  out << query.call(dfn[1], tail[1])[5].to_s
end

puts out.join("\\n") unless out.empty?
`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'Codeforces',
      title: 'Dynamic DP on Trees (P4719 / CF750E / Matrix HLD)',
      difficulty: '2500–2800',
      url: 'https://codeforces.com/problemset?tags=dp,trees,matrices',
      patternNote: 'Canonical 2x2 and 3x3 (max, +) matrix monoids folded onto HLD heavy chains.',
    },
    {
      platform: 'AtCoder',
      title: 'ABC246 / AGC Dynamic Subtree Matrix Segtree',
      difficulty: '2400–2700',
      url: 'https://atcoder.jp/',
      patternNote: 'Non-invertible light-child merges solved cleanly with lazy-deletion heaps or zero-counters.',
    },
    {
      platform: 'CSES',
      title: 'Subarray Sum Queries & Dynamic Tree Path DP',
      difficulty: 'Medium–Hard',
      url: 'https://cses.fi/problemset/task/1190',
      patternNote: '3x3 tropical matrix Kadane formulation generalizes cleanly to path-constrained DP.',
    },
  ],
  interviewNotes: [
    'Prove why (max, +) matrix multiplication is associative (a + (b + c) = (a + b) + c and max distributes over +) so segment trees can combine subsegments in any tree shape.',
    'Explain how HLD limits the number of light-edge transitions from any updated leaf u up to root 1 to O(log N), yielding O(log^2 N) total matrix segment tree updates.',
    'Discuss how to handle non-invertible light-child aggregates (like max in dynamic diameter or multiplication modulo 998244353 when factors can hit 0) using lazy-deletion heaps or zero-counters.',
  ],
  projectBlueprint: {
    title: 'Incremental Dependency-Graph Workflow & Live Pricing Re-Evaluator',
    tagline: 'Sub-millisecond hierarchical recalculation engine updating critical paths and budget constraints on tree-structured BOMs',
    stackSummary: 'TypeScript Tropical Matrix Semiring + HLD Segment Tree Propagator',
    asciiDiagram: [
      '+---------------------------------------------------------------+',
      '|  Point Price/Latency Update at Leaf Node u                    |',
      '|        |                                                      |',
      '|        +--> Update leaf matrix M[u] in Segment Tree O(log N)  |',
      '|        +--> Diff light-child heap / sums at fa[top[u]]        |',
      '|        +--> Jump <= log2(N) heavy chains up to Root 1         |',
      '|        v                                                      |',
      '|  Exact Global Optimal Schedule / Cost in O(K^3 log^2 N)       |',
      '+---------------------------------------------------------------+',
    ].join('\n'),
    milestones: [
      {
        id: 'm1',
        title: 'Tropical (max, +) Matrix Kernel',
        detail: 'Implement overflow-safe 2x2 and 3x3 associative matrix multiplication and iterative segment tree.',
      },
      {
        id: 'm2',
        title: 'Heavy-Light Chain Decomposition & Light Accumulator',
        detail: 'Partition dependency trees into heavy paths and maintain light-child deltas accurately.',
      },
      {
        id: 'm3',
        title: 'Non-Invertible Max/Zero-Safe Aggregator',
        detail: 'Attach lazy-deletion priority queues per node to support online diameter and bottleneck queries.',
      },
    ],
    starterCode: `export function mulMaxPlus2(a: number[], b: number[]): number[] {
  return [
    Math.max(a[0] + b[0], a[1] + b[2]),
    Math.max(a[0] + b[1], a[1] + b[3]),
    Math.max(a[2] + b[0], a[3] + b[2]),
    Math.max(a[2] + b[1], a[3] + b[3]),
  ];
}`,
  },
};
