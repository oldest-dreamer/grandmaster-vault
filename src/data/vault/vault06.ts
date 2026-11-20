import type { VaultBreakdown } from '../../types/vault';

export const VAULT06_HLD_AFFINE_SUBTREE: VaultBreakdown = {
  slug: 'hld-affine-path-subtree-second-moment',
  title:
    'Affine Path Updates & Subtree Variance Queries -> Heavy-Light Decomposition + Lazy Monoid SegTree',
  rating: 2450,
  ratingTier: '2200–2600',
  usacoDivision: 'Platinum',
  domain: 'Data Structures',
  sourceTag: '2200–2500 Multi-Topic Reduction Vault (HLD + Lazy Affine SegTree)',
  reductionHeadline:
    'Unify O(log^2 N) tree-path updates and O(log N) full-subtree queries on a single HLD-ordered array while maintaining first and second power sums (∑x, ∑x²) under affine lazy tags (x -> a·x + b).',
  linkedChapters: [
    {
      number: 37,
      slug: 'heavy-light-decomposition',
      title: 'Heavy-Light Decomposition (HLD)',
    },
    {
      number: 8,
      slug: 'lazy-propagation-segment-tree',
      title: 'Segment Tree with Lazy Propagation & Segment Beats',
    },
  ],
  keyTraps: [
    {
      title: 'Trap 1: Mutating sum1 Before Computing New sum2 During Affine Push',
      detail:
        'When applying x -> a*x + b to a node of length L, the new sum of squares is sum2_new = a^2 * sum2_old + 2*a*b * sum1_old + L * b^2 (mod 998244353). If you overwrite sum1_old with sum1_new = a * sum1_old + L * b first, sum2_new uses the corrupted sum1 and fails immediately!',
    },
    {
      title: 'Trap 2: Wrong Composition Order When Stacking Nested Affine Lazy Tags',
      detail:
        'Applying outer affine tag (a_2, b_2) onto an existing inner child tag (a_1, b_1) produces a_new = (a_2 * a_1) % MOD and b_new = (a_2 * b_1 + b_2) % MOD. Never add b_2 without first scaling b_1 by a_2.',
    },
  ],
  stage1Statement: {
    statement:
      'You are given a rooted tree with N vertices (rooted at vertex 1) where vertex i initially holds value A_i. Process Q online queries modulo P = 998,244,353 of two types: (1 u v a b) for every vertex w on the simple path between u and v, update A_w <- (a * A_w + b) mod P; (2 u) for the subtree rooted at u of size S_u, output the unnormalized variance numerator V(u) = (S_u * sum_{w in Subtree(u)} A_w^2 - (sum_{w in Subtree(u)} A_w)^2) mod P.',
    constraints: [
      '1 <= N, Q <= 1.5 * 10^5',
      '0 <= A_i, a, b < 998,244,353',
      'Time Limit: 2.0 seconds',
    ],
    sampleInput: `5 4
1 2 3 4 5
1 2
1 3
2 4
2 5
2 2
1 4 3 2 1
2 2
2 1`,
    sampleOutput: `14
32
104`,
    sampleExplanation:
      'Subtree(2) contains vertices {2, 4, 5} with initial values {2, 4, 5}, size S_2 = 3. Initially sum1 = 11, sum2 = 4 + 16 + 25 = 45, so V(2) = 3 * 45 - 11^2 = 135 - 121 = 14. Query (1 4 3 2 1) updates path 4-2-1-3 by x -> 2x + 1: values at {1,2,3,4,5} become {3, 5, 7, 9, 5}. Now Subtree(2) has values {5, 9, 5}: sum1 = 19, sum2 = 25 + 81 + 25 = 131, so V(2) = 3 * 131 - 19^2 = 393 - 361 = 32. For root 1 ({3,5,7,9,5}): S_1 = 5, sum1 = 29, sum2 = 9+25+49+81+25 = 189, so V(1) = 5 * 189 - 29^2 = 945 - 841 = 104.',
  },
  stage2NaiveFailure: {
    naiveApproaches: [
      {
        approach: 'Euler Tour Only (Without Heavy-Light Decomposition)',
        complexity: 'O(N) per Path Update',
        verdict: 'TLE',
        reason:
          'A standard DFS Euler Tour maps subtrees to contiguous intervals, but a path between u and v can fragmented into O(N) disconnected DFS segments.',
      },
      {
        approach: 'HLD + Separate Lazy Flags Without Second-Moment Algebra',
        complexity: 'O(N) per Subtree Variance Query',
        verdict: 'TLE',
        reason:
          'If you only maintain sum1 in the segment tree and iterate over all vertices in Subtree(u) to compute sum(A_w^2), star/caterpillar trees take O(Q * N) time.',
      },
      {
        approach: 'Floating-Point Mean Subtraction E[(X - mu)^2] per Element',
        complexity: 'Precision Loss & O(N) Rebuild',
        verdict: 'WA',
        reason:
          'Shifts in the subtree mean mu invalidate cached (x_i - mu)^2 values across the entire subtree; algebraically expanding S_u * sum(x^2) - (sum x)^2 avoids mean-recentering altogether.',
      },
    ],
    constraintWhispers: [
      'A single Heavy-Light Decomposition DFS order visiting the heavy child FIRST simultaneously makes every heavy chain contiguous AND every subtree Subtree(u) a single contiguous range [tin[u], tin[u] + sz[u] - 1]!',
      'Variance identity: S * sum(x_i^2) - (sum x_i)^2 depends ONLY on the 3-tuple (len, sum1, sum2) = (∑ 1, ∑ x_i, ∑ x_i^2).',
      'Under an affine map x -> a*x + b, the new moments are linear combinations of the old moments: sum2_new = a^2 * sum2 + 2ab * sum1 + len * b^2.',
    ],
  },
  stage3AhaReduction: {
    coreInsight:
      'Order the tree via HLD (heavy child visited first in DFS). Then any u-v path decomposes into <= 2 log_2 N contiguous intervals, AND any subtree Subtree(u) is a single contiguous interval [tin[u], tin[u] + sz[u] - 1]. Maintain the moment vector (len, sum1, sum2) in one Lazy Affine Segment Tree!',
    steps: [
      {
        title: '1. Dual Property of Heavy-First Euler Tour',
        proofNote:
          'In HLD DFS2, we assign tin[u] = timer++ and immediately recurse on heavy[u] before light children. Because heavy[u] is visited consecutively, heavy chains form contiguous slices [tin[head], tin[u]]. Simultaneously, because it is still a valid DFS post-order subtree traversal, Subtree(u) occupies [tin[u], tin[u] + sz[u] - 1]!',
      },
      {
        title: '2. Closed-Form Moment Transition Under x -> a*x + b',
        proofNote:
          'For any segment tree node holding (len, S1, S2): applying affine tag (a, b) transforms each x_i to a*x_i + b. Summing over the interval yields: S2_new = (a^2 * S2 + 2*a*b * S1 + len * b^2) mod P, and S1_new = (a * S1 + len * b) mod P.',
      },
      {
        title: '3. O(log^2 N) Path Update & O(log N) Subtree Variance Query',
        proofNote:
          'To update path(u, v) with (a, b), climb heavy chains while head[u] != head[v], applying range_affine(tin[head[u]], tin[u], a, b) in O(log N) per chain. To query V(u), query range [tin[u], tin[u] + sz[u] - 1] in a single O(log N) Segment Tree call and return (len * S2 - S1^2) mod P.',
      },
    ],
  },
  stage4DryRun: {
    intro:
      'Trace the 5-node tree from the Sample Input. Watch HLD flatten heavy chains and subtrees into one array, and trace how path update (4 <-> 3, x -> 2x + 1) updates (sum1, sum2) moments.',
    traceSteps: [
      {
        stepNumber: 1,
        title: 'HLD Flattening: Heavy Chains & Subtrees in One Contiguous Array',
        explanation:
          'Tree edges: (1-2), (1-3), (2-4), (2-5). Subtree sizes: sz[1]=5, sz[2]=3 (heavy child of 1), sz[4]=1 (heavy child of 2). HLD DFS order visits [1, 2, 4, 5, 3] at tin = [0, 1, 2, 3, 4]. Notice Subtree(2) is contiguous [1..3] = {2, 4, 5}!',
        mode: 'array',
        arrays: [
          {
            name: 'HLD Flattened Vertex Order (tin = 0..4)',
            cells: [
              { index: 0, value: 'v1 (A=1)', label: 'tin=0', highlight: 'active' },
              { index: 1, value: 'v2 (A=2)', label: 'tin=1', highlight: 'window' },
              { index: 2, value: 'v4 (A=4)', label: 'tin=2', highlight: 'window' },
              { index: 3, value: 'v5 (A=5)', label: 'tin=3', highlight: 'window' },
              { index: 4, value: 'v3 (A=3)', label: 'tin=4', highlight: 'neutral' },
            ],
          },
        ],
        variables: { HeavyChain1: '1 -> 2 -> 4 (tin 0..2)', Subtree2Range: 'tin [1..3]' },
      },
      {
        stepNumber: 2,
        title: 'Query 1: Subtree(2) Variance on Contiguous Range [1..3]',
        explanation:
          'Subtree(2) = tin[1..3] holds values [2, 4, 5]. Segment tree range query on [1..3] returns len = 3, sum1 = 2+4+5 = 11, sum2 = 4+16+25 = 45. Variance numerator V(2) = 3 * 45 - 11^2 = 135 - 121 = 14.',
        mode: 'array',
        arrays: [
          {
            name: 'Subtree(2) Slice tin[1..3]',
            cells: [
              { index: 0, value: 1, label: 'v1', highlight: 'neutral' },
              { index: 1, value: 2, label: 'v2 (x²=4)', highlight: 'active' },
              { index: 2, value: 4, label: 'v4 (x²=16)', highlight: 'active' },
              { index: 3, value: 5, label: 'v5 (x²=25)', highlight: 'active' },
              { index: 4, value: 3, label: 'v3', highlight: 'neutral' },
            ],
          },
        ],
        variables: { len: 3, sum1: 11, sum2: 45, VarianceNum: '3*45 - 121 = 14' },
      },
      {
        stepNumber: 3,
        title: 'Query 2: Affine Path Update (v4 <-> v3, x -> 2x + 1)',
        explanation:
          'HLD decomposes path(4, 3) into two contiguous intervals: heavy chain segment [tin[1]..tin[4]] = [0..2] (vertices 1, 2, 4) and light chain segment [tin[3]..tin[3]] = [4..4] (vertex 3). Vertex 5 at tin=3 is untouched!',
        mode: 'array',
        arrays: [
          {
            name: 'After Path Update (4 <-> 3, x -> 2x + 1)',
            cells: [
              { index: 0, value: 3, label: 'v1: 2(1)+1', highlight: 'updated' },
              { index: 1, value: 5, label: 'v2: 2(2)+1', highlight: 'updated' },
              { index: 2, value: 9, label: 'v4: 2(4)+1', highlight: 'updated' },
              { index: 3, value: 5, label: 'v5: untouched', highlight: 'neutral' },
              { index: 4, value: 7, label: 'v3: 2(3)+1', highlight: 'updated' },
            ],
          },
        ],
        variables: { UpdatedIntervals: '[0..2] and [4..4]', AffineTag: '(a=2, b=1)' },
      },
      {
        stepNumber: 4,
        title: 'Queries 3 & 4: Subtree(2) and Subtree(1) Variance Numerators',
        explanation:
          'Subtree(2) = tin[1..3] now has values [5, 9, 5]: len=3, sum1=19, sum2=131 -> V(2) = 3*131 - 19^2 = 32. Subtree(1) = tin[0..4] has [3, 5, 9, 5, 7]: len=5, sum1=29, sum2=189 -> V(1) = 5*189 - 29^2 = 104.',
        mode: 'array',
        arrays: [
          {
            name: 'Final Moments on HLD Array',
            cells: [
              { index: 0, value: '3 (9)', label: 'v1', highlight: 'window' },
              { index: 1, value: '5 (25)', label: 'v2', highlight: 'active' },
              { index: 2, value: '9 (81)', label: 'v4', highlight: 'active' },
              { index: 3, value: '5 (25)', label: 'v5', highlight: 'active' },
              { index: 4, value: '7 (49)', label: 'v3', highlight: 'window' },
            ],
          },
        ],
        variables: { V_Subtree2: 32, V_Subtree1: 104 },
      },
    ],
  },
  stage5Solutions: {
    timeComplexity: 'O(N + Q log^2 N) for path updates, O(log N) per subtree variance query',
    spaceComplexity: 'O(N)',
    implementations: {
      cpp20: `#include <bits/stdc++.h>
using namespace std;

static constexpr long long MOD = 998244353;

struct Node {
    long long len = 0;
    long long s1 = 0;
    long long s2 = 0;
    long long lz_a = 1;
    long long lz_b = 0;
};

struct LazySegTree {
    int n;
    vector<Node> tree;

    explicit LazySegTree(const vector<long long>& init) {
        n = (int)init.size();
        tree.resize(4 * n);
        build(1, 0, n - 1, init);
    }

    void pull(int p) {
        tree[p].len = tree[p << 1].len + tree[p << 1 | 1].len;
        tree[p].s1 = (tree[p << 1].s1 + tree[p << 1 | 1].s1) % MOD;
        tree[p].s2 = (tree[p << 1].s2 + tree[p << 1 | 1].s2) % MOD;
    }

    void apply(int p, long long a, long long b) {
        long long old_s1 = tree[p].s1;
        long long old_s2 = tree[p].s2;
        long long L = tree[p].len;
        long long a2 = (a * a) % MOD;
        long long b2 = (b * b) % MOD;
        long long two_ab = (2 * a % MOD) * b % MOD;

        // CRITICAL: update s2 using old_s1 BEFORE mutating s1
        tree[p].s2 = (a2 * old_s2 % MOD + two_ab * old_s1 % MOD + L * b2 % MOD) % MOD;
        tree[p].s1 = (a * old_s1 % MOD + L * b % MOD) % MOD;

        tree[p].lz_a = (tree[p].lz_a * a) % MOD;
        tree[p].lz_b = (tree[p].lz_b * a + b) % MOD;
    }

    void push(int p) {
        if (tree[p].lz_a != 1 || tree[p].lz_b != 0) {
            apply(p << 1, tree[p].lz_a, tree[p].lz_b);
            apply(p << 1 | 1, tree[p].lz_a, tree[p].lz_b);
            tree[p].lz_a = 1;
            tree[p].lz_b = 0;
        }
    }

    void build(int p, int l, int r, const vector<long long>& init) {
        if (l == r) {
            long long v = (init[l] % MOD + MOD) % MOD;
            tree[p] = {1, v, (v * v) % MOD, 1, 0};
            return;
        }
        int mid = (l + r) >> 1;
        build(p << 1, l, mid, init);
        build(p << 1 | 1, mid + 1, r, init);
        pull(p);
    }

    void update(int p, int l, int r, int ql, int qr, long long a, long long b) {
        if (ql <= l && r <= qr) {
            apply(p, a, b);
            return;
        }
        push(p);
        int mid = (l + r) >> 1;
        if (ql <= mid) update(p << 1, l, mid, ql, qr, a, b);
        if (qr > mid) update(p << 1 | 1, mid + 1, r, ql, qr, a, b);
        pull(p);
    }

    pair<long long, long long> query(int p, int l, int r, int ql, int qr) {
        if (ql <= l && r <= qr) return {tree[p].s1, tree[p].s2};
        push(p);
        int mid = (l + r) >> 1;
        long long s1 = 0, s2 = 0;
        if (ql <= mid) {
            auto [a1, a2] = query(p << 1, l, mid, ql, qr);
            s1 = (s1 + a1) % MOD;
            s2 = (s2 + a2) % MOD;
        }
        if (qr > mid) {
            auto [b1, b2] = query(p << 1 | 1, mid + 1, r, ql, qr);
            s1 = (s1 + b1) % MOD;
            s2 = (s2 + b2) % MOD;
        }
        return {s1, s2};
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, q;
    if (!(cin >> n >> q)) return 0;

    vector<long long> a(n + 1);
    for (int i = 1; i <= n; ++i) cin >> a[i];

    vector<vector<int>> adj(n + 1);
    for (int i = 0; i < n - 1; ++i) {
        int u, v;
        cin >> u >> v;
        adj[u].push_back(v);
        adj[v].push_back(u);
    }

    vector<int> parent(n + 1, 0), depth(n + 1, 0), sz(n + 1, 0), heavy(n + 1, -1);
    auto dfs1 = [&](auto& self, int u, int p) -> void {
        parent[u] = p;
        sz[u] = 1;
        int max_sz = 0;
        for (int v : adj[u]) {
            if (v == p) continue;
            depth[v] = depth[u] + 1;
            self(self, v, u);
            sz[u] += sz[v];
            if (sz[v] > max_sz) {
                max_sz = sz[v];
                heavy[u] = v;
            }
        }
    };
    dfs1(dfs1, 1, 0);

    vector<int> head(n + 1, 0), tin(n + 1, 0);
    vector<long long> flat(n);
    int timer = 0;
    auto dfs2 = [&](auto& self, int u, int h) -> void {
        head[u] = h;
        tin[u] = timer++;
        flat[tin[u]] = a[u];
        if (heavy[u] != -1) self(self, heavy[u], h);
        for (int v : adj[u]) {
            if (v != parent[u] && v != heavy[u]) {
                self(self, v, v);
            }
        }
    };
    dfs2(dfs2, 1, 1);

    LazySegTree seg(flat);

    auto path_update = [&](int u, int v, long long mul, long long add) {
        while (head[u] != head[v]) {
            if (depth[head[u]] < depth[head[v]]) swap(u, v);
            seg.update(1, 0, n - 1, tin[head[u]], tin[u], mul, add);
            u = parent[head[u]];
        }
        if (depth[u] > depth[v]) swap(u, v);
        seg.update(1, 0, n - 1, tin[u], tin[v], mul, add);
    };

    while (q--) {
        int type;
        cin >> type;
        if (type == 1) {
            int u, v;
            long long mul, add;
            cin >> u >> v >> mul >> add;
            path_update(u, v, mul % MOD, add % MOD);
        } else {
            int u;
            cin >> u;
            auto [s1, s2] = seg.query(1, 0, n - 1, tin[u], tin[u] + sz[u] - 1);
            long long L = sz[u] % MOD;
            long long ans = (L * s2 % MOD - s1 * s1 % MOD + MOD) % MOD;
            cout << ans << '\\n';
        }
    }
    return 0;
}`,
      rust: `use std::io::{self, Read};

const MOD: i64 = 998_244_353;

#[derive(Clone, Copy, Default)]
struct Node {
    len: i64,
    s1: i64,
    s2: i64,
    lz_a: i64,
    lz_b: i64,
}

struct LazySegTree {
    tree: Vec<Node>,
}

impl LazySegTree {
    fn new(init: &[i64]) -> Self {
        let n = init.len();
        let mut st = Self {
            tree: vec![Node::default(); 4 * n],
        };
        st.build(1, 0, n - 1, init);
        st
    }

    fn pull(&mut self, p: usize) {
        self.tree[p].len = self.tree[p << 1].len + self.tree[p << 1 | 1].len;
        self.tree[p].s1 = (self.tree[p << 1].s1 + self.tree[p << 1 | 1].s1) % MOD;
        self.tree[p].s2 = (self.tree[p << 1].s2 + self.tree[p << 1 | 1].s2) % MOD;
    }

    fn apply(&mut self, p: usize, a: i64, b: i64) {
        let old_s1 = self.tree[p].s1;
        let old_s2 = self.tree[p].s2;
        let l = self.tree[p].len;
        let a2 = (a * a) % MOD;
        let b2 = (b * b) % MOD;
        let two_ab = (2 * a % MOD) * b % MOD;

        self.tree[p].s2 = (a2 * old_s2 % MOD + two_ab * old_s1 % MOD + l * b2 % MOD) % MOD;
        self.tree[p].s1 = (a * old_s1 % MOD + l * b % MOD) % MOD;
        self.tree[p].lz_a = (self.tree[p].lz_a * a) % MOD;
        self.tree[p].lz_b = (self.tree[p].lz_b * a + b) % MOD;
    }

    fn push(&mut self, p: usize) {
        let a = self.tree[p].lz_a;
        let b = self.tree[p].lz_b;
        if a != 1 || b != 0 {
            self.apply(p << 1, a, b);
            self.apply(p << 1 | 1, a, b);
            self.tree[p].lz_a = 1;
            self.tree[p].lz_b = 0;
        }
    }

    fn build(&mut self, p: usize, l: usize, r: usize, init: &[i64]) {
        if l == r {
            let v = init[l].rem_euclid(MOD);
            self.tree[p] = Node {
                len: 1,
                s1: v,
                s2: (v * v) % MOD,
                lz_a: 1,
                lz_b: 0,
            };
            return;
        }
        let mid = (l + r) >> 1;
        self.build(p << 1, l, mid, init);
        self.build(p << 1 | 1, mid + 1, r, init);
        self.pull(p);
    }

    fn update(&mut self, p: usize, l: usize, r: usize, ql: usize, qr: usize, a: i64, b: i64) {
        if ql <= l && r <= qr {
            self.apply(p, a, b);
            return;
        }
        self.push(p);
        let mid = (l + r) >> 1;
        if ql <= mid {
            self.update(p << 1, l, mid, ql, qr, a, b);
        }
        if qr > mid {
            self.update(p << 1 | 1, mid + 1, r, ql, qr, a, b);
        }
        self.pull(p);
    }

    fn query(&mut self, p: usize, l: usize, r: usize, ql: usize, qr: usize) -> (i64, i64) {
        if ql <= l && r <= qr {
            return (self.tree[p].s1, self.tree[p].s2);
        }
        self.push(p);
        let mid = (l + r) >> 1;
        let mut s1 = 0;
        let mut s2 = 0;
        if ql <= mid {
            let (a1, a2) = self.query(p << 1, l, mid, ql, qr);
            s1 = (s1 + a1) % MOD;
            s2 = (s2 + a2) % MOD;
        }
        if qr > mid {
            let (b1, b2) = self.query(p << 1 | 1, mid + 1, r, ql, qr);
            s1 = (s1 + b1) % MOD;
            s2 = (s2 + b2) % MOD;
        }
        (s1, s2)
    }
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let Some(n_str) = it.next() else { return; };
    let n: usize = n_str.parse().unwrap();
    let q: usize = it.next().unwrap().parse().unwrap();

    let mut a = vec![0i64; n + 1];
    for i in 1..=n {
        a[i] = it.next().unwrap().parse().unwrap();
    }

    let mut adj = vec![Vec::new(); n + 1];
    for _ in 0..(n - 1) {
        let u: usize = it.next().unwrap().parse().unwrap();
        let v: usize = it.next().unwrap().parse().unwrap();
        adj[u].push(v);
        adj[v].push(u);
    }

    let mut parent = vec![0usize; n + 1];
    let mut depth = vec![0usize; n + 1];
    let mut order = Vec::with_capacity(n);
    let mut stack = vec![1usize];
    while let Some(u) = stack.pop() {
        order.push(u);
        for &v in &adj[u] {
            if v != parent[u] {
                parent[v] = u;
                depth[v] = depth[u] + 1;
                stack.push(v);
            }
        }
    }

    let mut sz = vec![1usize; n + 1];
    let mut heavy = vec![0usize; n + 1];
    for &u in order.iter().rev() {
        let mut max_s = 0;
        for &v in &adj[u] {
            if v != parent[u] {
                sz[u] += sz[v];
                if sz[v] > max_s {
                    max_s = sz[v];
                    heavy[u] = v;
                }
            }
        }
    }

    let mut head = vec![0usize; n + 1];
    let mut tin = vec![0usize; n + 1];
    let mut flat = vec![0i64; n];
    let mut timer = 0usize;
    let mut h_stack = vec![(1usize, 1usize)];
    while let Some((u, h)) = h_stack.pop() {
        let mut cur = u;
        let mut cur_h = h;
        while cur != 0 {
            head[cur] = cur_h;
            tin[cur] = timer;
            flat[timer] = a[cur];
            timer += 1;
            for &v in &adj[cur] {
                if v != parent[cur] && v != heavy[cur] {
                    h_stack.push((v, v));
                }
            }
            cur = heavy[cur];
        }
    }

    let mut seg = LazySegTree::new(&flat);
    let mut out = String::new();

    for _ in 0..q {
        let t: i32 = it.next().unwrap().parse().unwrap();
        if t == 1 {
            let mut u: usize = it.next().unwrap().parse().unwrap();
            let mut v: usize = it.next().unwrap().parse().unwrap();
            let mul: i64 = it.next().unwrap().parse::<i64>().unwrap().rem_euclid(MOD);
            let add: i64 = it.next().unwrap().parse::<i64>().unwrap().rem_euclid(MOD);
            while head[u] != head[v] {
                if depth[head[u]] < depth[head[v]] {
                    std::mem::swap(&mut u, &mut v);
                }
                seg.update(1, 0, n - 1, tin[head[u]], tin[u], mul, add);
                u = parent[head[u]];
            }
            if depth[u] > depth[v] {
                std::mem::swap(&mut u, &mut v);
            }
            seg.update(1, 0, n - 1, tin[u], tin[v], mul, add);
        } else {
            let u: usize = it.next().unwrap().parse().unwrap();
            let (s1, s2) = seg.query(1, 0, n - 1, tin[u], tin[u] + sz[u] - 1);
            let l = (sz[u] as i64) % MOD;
            let ans = (l * s2 % MOD - s1 * s1 % MOD + MOD) % MOD;
            out.push_str(&format!("{}\\n", ans));
        }
    }
    print!("{}", out);
}`,
      java21: `import java.io.*;
import java.util.*;

public class Main {
    static final long MOD = 998_244_353L;

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

    static int n, q;
    static long[] len, s1, s2, lzA, lzB;

    static void pull(int p) {
        len[p] = len[p << 1] + len[p << 1 | 1];
        s1[p] = (s1[p << 1] + s1[p << 1 | 1]) % MOD;
        s2[p] = (s2[p << 1] + s2[p << 1 | 1]) % MOD;
    }

    static void apply(int p, long a, long b) {
        long old1 = s1[p], old2 = s2[p], L = len[p];
        long a2 = (a * a) % MOD, b2 = (b * b) % MOD;
        long twoAb = (2 * a % MOD) * b % MOD;
        s2[p] = (a2 * old2 % MOD + twoAb * old1 % MOD + L * b2 % MOD) % MOD;
        s1[p] = (a * old1 % MOD + L * b % MOD) % MOD;
        lzA[p] = (lzA[p] * a) % MOD;
        lzB[p] = (lzB[p] * a + b) % MOD;
    }

    static void push(int p) {
        if (lzA[p] != 1 || lzB[p] != 0) {
            apply(p << 1, lzA[p], lzB[p]);
            apply(p << 1 | 1, lzA[p], lzB[p]);
            lzA[p] = 1;
            lzB[p] = 0;
        }
    }

    static void build(int p, int l, int r, long[] flat) {
        lzA[p] = 1;
        lzB[p] = 0;
        if (l == r) {
            long v = ((flat[l] % MOD) + MOD) % MOD;
            len[p] = 1;
            s1[p] = v;
            s2[p] = (v * v) % MOD;
            return;
        }
        int mid = (l + r) >> 1;
        build(p << 1, l, mid, flat);
        build(p << 1 | 1, mid + 1, r, flat);
        pull(p);
    }

    static void update(int p, int l, int r, int ql, int qr, long a, long b) {
        if (ql <= l && r <= qr) {
            apply(p, a, b);
            return;
        }
        push(p);
        int mid = (l + r) >> 1;
        if (ql <= mid) update(p << 1, l, mid, ql, qr, a, b);
        if (qr > mid) update(p << 1 | 1, mid + 1, r, ql, qr, a, b);
        pull(p);
    }

    static long[] query(int p, int l, int r, int ql, int qr) {
        if (ql <= l && r <= qr) return new long[]{s1[p], s2[p]};
        push(p);
        int mid = (l + r) >> 1;
        long r1 = 0, r2 = 0;
        if (ql <= mid) {
            long[] left = query(p << 1, l, mid, ql, qr);
            r1 = (r1 + left[0]) % MOD;
            r2 = (r2 + left[1]) % MOD;
        }
        if (qr > mid) {
            long[] right = query(p << 1 | 1, mid + 1, r, ql, qr);
            r1 = (r1 + right[0]) % MOD;
            r2 = (r2 + right[1]) % MOD;
        }
        return new long[]{r1, r2};
    }

    public static void main(String[] args) throws Exception {
        FastScanner sc = new FastScanner();
        String first = sc.next();
        if (first == null) return;
        n = Integer.parseInt(first);
        q = sc.nextInt();

        long[] a = new long[n + 1];
        for (int i = 1; i <= n; i++) a[i] = sc.nextLong();

        @SuppressWarnings("unchecked")
        List<Integer>[] adj = new ArrayList[n + 1];
        for (int i = 1; i <= n; i++) adj[i] = new ArrayList<>();
        for (int i = 0; i < n - 1; i++) {
            int u = sc.nextInt(), v = sc.nextInt();
            adj[u].add(v);
            adj[v].add(u);
        }

        int[] parent = new int[n + 1], depth = new int[n + 1], sz = new int[n + 1], heavy = new int[n + 1];
        int[] order = new int[n];
        int ordSz = 0;
        ArrayDeque<Integer> st = new ArrayDeque<>();
        st.push(1);
        while (!st.isEmpty()) {
            int u = st.pop();
            order[ordSz++] = u;
            for (int v : adj[u]) {
                if (v != parent[u]) {
                    parent[v] = u;
                    depth[v] = depth[u] + 1;
                    st.push(v);
                }
            }
        }

        Arrays.fill(sz, 1);
        for (int i = n - 1; i >= 0; i--) {
            int u = order[i], maxS = 0;
            for (int v : adj[u]) {
                if (v != parent[u]) {
                    sz[u] += sz[v];
                    if (sz[v] > maxS) {
                        maxS = sz[v];
                        heavy[u] = v;
                    }
                }
            }
        }

        int[] head = new int[n + 1], tin = new int[n + 1];
        long[] flat = new long[n];
        int timer = 0;
        ArrayDeque<int[]> hst = new ArrayDeque<>();
        hst.push(new int[]{1, 1});
        while (!hst.isEmpty()) {
            int[] top = hst.pop();
            int cur = top[0], h = top[1];
            while (cur != 0) {
                head[cur] = h;
                tin[cur] = timer;
                flat[timer++] = a[cur];
                for (int v : adj[cur]) {
                    if (v != parent[cur] && v != heavy[cur]) {
                        hst.push(new int[]{v, v});
                    }
                }
                cur = heavy[cur];
            }
        }

        len = new long[4 * n];
        s1 = new long[4 * n];
        s2 = new long[4 * n];
        lzA = new long[4 * n];
        lzB = new long[4 * n];
        build(1, 0, n - 1, flat);

        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < q; i++) {
            int type = sc.nextInt();
            if (type == 1) {
                int u = sc.nextInt(), v = sc.nextInt();
                long mul = ((sc.nextLong() % MOD) + MOD) % MOD;
                long add = ((sc.nextLong() % MOD) + MOD) % MOD;
                while (head[u] != head[v]) {
                    if (depth[head[u]] < depth[head[v]]) { int tmp = u; u = v; v = tmp; }
                    update(1, 0, n - 1, tin[head[u]], tin[u], mul, add);
                    u = parent[head[u]];
                }
                if (depth[u] > depth[v]) { int tmp = u; u = v; v = tmp; }
                update(1, 0, n - 1, tin[u], tin[v], mul, add);
            } else {
                int u = sc.nextInt();
                long[] res = query(1, 0, n - 1, tin[u], tin[u] + sz[u] - 1);
                long L = sz[u] % MOD;
                long ans = (L * res[1] % MOD - res[0] * res[0] % MOD + MOD) % MOD;
                sb.append(ans).append('\\n');
            }
        }
        System.out.print(sb);
    }
}`,
      python3: `import sys

sys.setrecursionlimit(300000)
MOD = 998244353

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    n = int(next(it))
    q = int(next(it))

    a = [0] * (n + 1)
    for i in range(1, n + 1):
        a[i] = int(next(it)) % MOD

    adj = [[] for _ in range(n + 1)]
    for _ in range(n - 1):
        u = int(next(it))
        v = int(next(it))
        adj[u].append(v)
        adj[v].append(u)

    parent = [0] * (n + 1)
    depth = [0] * (n + 1)
    order = []
    stack = [1]
    while stack:
        u = stack.pop()
        order.append(u)
        for v in adj[u]:
            if v != parent[u]:
                parent[v] = u
                depth[v] = depth[u] + 1
                stack.append(v)

    sz = [1] * (n + 1)
    heavy = [0] * (n + 1)
    for u in reversed(order):
        max_s = 0
        for v in adj[u]:
            if v != parent[u]:
                sz[u] += sz[v]
                if sz[v] > max_s:
                    max_s = sz[v]
                    heavy[u] = v

    head = [0] * (n + 1)
    tin = [0] * (n + 1)
    flat = [0] * n
    timer = 0
    hst = [(1, 1)]
    while hst:
        cur, h = hst.pop()
        while cur != 0:
            head[cur] = h
            tin[cur] = timer
            flat[timer] = a[cur]
            timer += 1
            for v in adj[cur]:
                if v != parent[cur] and v != heavy[cur]:
                    hst.append((v, v))
            cur = heavy[cur]

    seg_len = [0] * (4 * n)
    s1 = [0] * (4 * n)
    s2 = [0] * (4 * n)
    lz_a = [1] * (4 * n)
    lz_b = [0] * (4 * n)

    def pull(p: int) -> None:
        seg_len[p] = seg_len[p << 1] + seg_len[p << 1 | 1]
        s1[p] = (s1[p << 1] + s1[p << 1 | 1]) % MOD
        s2[p] = (s2[p << 1] + s2[p << 1 | 1]) % MOD

    def apply(p: int, mul: int, add: int) -> None:
        old1, old2, L = s1[p], s2[p], seg_len[p]
        s2[p] = (mul * mul % MOD * old2 + 2 * mul * add % MOD * old1 + L * add % MOD * add) % MOD
        s1[p] = (mul * old1 + L * add) % MOD
        lz_a[p] = lz_a[p] * mul % MOD
        lz_b[p] = (lz_b[p] * mul + add) % MOD

    def push(p: int) -> None:
        if lz_a[p] != 1 or lz_b[p] != 0:
            apply(p << 1, lz_a[p], lz_b[p])
            apply(p << 1 | 1, lz_a[p], lz_b[p])
            lz_a[p] = 1
            lz_b[p] = 0

    def build(p: int, l: int, r: int) -> None:
        if l == r:
            v = flat[l] % MOD
            seg_len[p] = 1
            s1[p] = v
            s2[p] = v * v % MOD
            return
        mid = (l + r) >> 1
        build(p << 1, l, mid)
        build(p << 1 | 1, mid + 1, r)
        pull(p)

    def update(p: int, l: int, r: int, ql: int, qr: int, mul: int, add: int) -> None:
        if ql <= l and r <= qr:
            apply(p, mul, add)
            return
        push(p)
        mid = (l + r) >> 1
        if ql <= mid:
            update(p << 1, l, mid, ql, qr, mul, add)
        if qr > mid:
            update(p << 1 | 1, mid + 1, r, ql, qr, mul, add)
        pull(p)

    def query(p: int, l: int, r: int, ql: int, qr: int):
        if ql <= l and r <= qr:
            return s1[p], s2[p]
        push(p)
        mid = (l + r) >> 1
        r1 = r2 = 0
        if ql <= mid:
            a1, a2 = query(p << 1, l, mid, ql, qr)
            r1 = (r1 + a1) % MOD
            r2 = (r2 + a2) % MOD
        if qr > mid:
            b1, b2 = query(p << 1 | 1, mid + 1, r, ql, qr)
            r1 = (r1 + b1) % MOD
            r2 = (r2 + b2) % MOD
        return r1, r2

    build(1, 0, n - 1)
    out = []
    for _ in range(q):
        t = int(next(it))
        if t == 1:
            u = int(next(it))
            v = int(next(it))
            mul = int(next(it)) % MOD
            add = int(next(it)) % MOD
            while head[u] != head[v]:
                if depth[head[u]] < depth[head[v]]:
                    u, v = v, u
                update(1, 0, n - 1, tin[head[u]], tin[u], mul, add)
                u = parent[head[u]]
            if depth[u] > depth[v]:
                u, v = v, u
            update(1, 0, n - 1, tin[u], tin[v], mul, add)
        else:
            u = int(next(it))
            q1, q2 = query(1, 0, n - 1, tin[u], tin[u] + sz[u] - 1)
            ans = (sz[u] * q2 - q1 * q1) % MOD
            out.append(str(ans))
    sys.stdout.write("\\n".join(out) + "\\n")

if __name__ == "__main__":
    solve()`,
      ruby: `MOD = 998_244_353

tokens = STDIN.read.split.map(&:to_i)
exit if tokens.empty?
idx = 0
n = tokens[idx]; q = tokens[idx + 1]; idx += 2

a = Array.new(n + 1, 0)
(1..n).each { |i| a[i] = tokens[idx] % MOD; idx += 1 }

adj = Array.new(n + 1) { [] }
(n - 1).times do
  u = tokens[idx]; v = tokens[idx + 1]; idx += 2
  adj[u] << v
  adj[v] << u
end

parent = Array.new(n + 1, 0)
depth = Array.new(n + 1, 0)
order = []
stack = [1]
until stack.empty?
  u = stack.pop
  order << u
  adj[u].each do |v|
    if v != parent[u]
      parent[v] = u
      depth[v] = depth[u] + 1
      stack << v
    end
  end
end

sz = Array.new(n + 1, 1)
heavy = Array.new(n + 1, 0)
order.reverse_each do |u|
  max_s = 0
  adj[u].each do |v|
    if v != parent[u]
      sz[u] += sz[v]
      if sz[v] > max_s
        max_s = sz[v]
        heavy[u] = v
      end
    end
  end
end

head = Array.new(n + 1, 0)
tin = Array.new(n + 1, 0)
flat = Array.new(n, 0)
timer = 0
hst = [[1, 1]]
until hst.empty?
  cur, h = hst.pop
  while cur != 0
    head[cur] = h
    tin[cur] = timer
    flat[timer] = a[cur]
    timer += 1
    adj[cur].each do |v|
      hst << [v, v] if v != parent[cur] && v != heavy[cur]
    end
    cur = heavy[cur]
  end
end

$len = Array.new(4 * n, 0)
$s1 = Array.new(4 * n, 0)
$s2 = Array.new(4 * n, 0)
$lza = Array.new(4 * n, 1)
$lzb = Array.new(4 * n, 0)

def pull(p)
  $len[p] = $len[p << 1] + $len[p << 1 | 1]
  $s1[p] = ($s1[p << 1] + $s1[p << 1 | 1]) % MOD
  $s2[p] = ($s2[p << 1] + $s2[p << 1 | 1]) % MOD
end

def apply_tag(p, mul, add)
  old1 = $s1[p]; old2 = $s2[p]; l_val = $len[p]
  $s2[p] = (mul * mul % MOD * old2 + 2 * mul * add % MOD * old1 + l_val * add % MOD * add) % MOD
  $s1[p] = (mul * old1 + l_val * add) % MOD
  $lza[p] = $lza[p] * mul % MOD
  $lzb[p] = ($lzb[p] * mul + add) % MOD
end

def push(p)
  if $lza[p] != 1 || $lzb[p] != 0
    apply_tag(p << 1, $lza[p], $lzb[p])
    apply_tag(p << 1 | 1, $lza[p], $lzb[p])
    $lza[p] = 1
    $lzb[p] = 0
  end
end

def build(p, l, r, flat)
  if l == r
    v = flat[l] % MOD
    $len[p] = 1; $s1[p] = v; $s2[p] = v * v % MOD
    return
  end
  mid = (l + r) >> 1
  build(p << 1, l, mid, flat)
  build(p << 1 | 1, mid + 1, r, flat)
  pull(p)
end

def update(p, l, r, ql, qr, mul, add)
  if ql <= l && r <= qr
    apply_tag(p, mul, add)
    return
  end
  push(p)
  mid = (l + r) >> 1
  update(p << 1, l, mid, ql, qr, mul, add) if ql <= mid
  update(p << 1 | 1, mid + 1, r, ql, qr, mul, add) if qr > mid
  pull(p)
end

def query(p, l, r, ql, qr)
  return [$s1[p], $s2[p]] if ql <= l && r <= qr
  push(p)
  mid = (l + r) >> 1
  r1 = 0; r2 = 0
  if ql <= mid
    a1, a2 = query(p << 1, l, mid, ql, qr)
    r1 = (r1 + a1) % MOD; r2 = (r2 + a2) % MOD
  end
  if qr > mid
    b1, b2 = query(p << 1 | 1, mid + 1, r, ql, qr)
    r1 = (r1 + b1) % MOD; r2 = (r2 + b2) % MOD
  end
  [r1, r2]
end

build(1, 0, n - 1, flat)
out = []
q.times do
  t = tokens[idx]; idx += 1
  if t == 1
    u = tokens[idx]; v = tokens[idx + 1]
    mul = tokens[idx + 2] % MOD; add = tokens[idx + 3] % MOD
    idx += 4
    while head[u] != head[v]
      u, v = v, u if depth[head[u]] < depth[head[v]]
      update(1, 0, n - 1, tin[head[u]], tin[u], mul, add)
      u = parent[head[u]]
    end
    u, v = v, u if depth[u] > depth[v]
    update(1, 0, n - 1, tin[u], tin[v], mul, add)
  else
    u = tokens[idx]; idx += 1
    q1, q2 = query(1, 0, n - 1, tin[u], tin[u] + sz[u] - 1)
    out << ((sz[u] * q2 - q1 * q1) % MOD)
  end
end
puts out.join("\\n")`,
    },
  },
};
