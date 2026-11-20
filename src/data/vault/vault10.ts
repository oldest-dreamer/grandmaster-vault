import type { VaultBreakdown } from '../../types/vault';

export const VAULT10_TIMELINE_XOR_BASIS_DSU: VaultBreakdown = {
  slug: 'dynamic-min-xor-path-segtree-time-rollback-dsu-basis',
  title:
    'Dynamic Minimum XOR Path Queries with Edge Deletions -> Segment Tree over Time + Rollback DSU + GF(2) XOR Basis',
  rating: 3100,
  ratingTier: '2600–3300+',
  usacoDivision: 'Advanced',
  domain: 'Theoretical & Randomized',
  sourceTag: '2700–3200+ Multi-Topic Reduction Vault (CF 938G Shortest Path Queries)',
  reductionHeadline:
    'Decompose dynamic edge lifespans [t_add, t_del] over a Segment Tree of Time, maintaining a parity-weighted Rollback DSU for spanning-tree paths and a value-copied 30-bit GF(2) Linear Basis for fundamental cycles.',
  linkedChapters: [
    {
      number: 14,
      slug: 'cdq-divide-conquer-offline',
      title: 'CDQ Divide & Conquer & Segment Tree over Time',
    },
    {
      number: 4,
      slug: 'disjoint-set-union-rollback',
      title: 'Disjoint Set Union (DSU) & DSU with Rollback',
    },
    {
      number: 51,
      slug: 'xor-basis-gaussian-elimination',
      title: 'Linear Algebra, Gaussian Elimination & GF(2) XOR Basis',
    },
  ],
  keyTraps: [
    {
      title: 'Trap 1: Using Path Compression Inside Rollback DSU',
      detail:
        'Path compression overwrites O(log N) ancestor pointers and potential weights xor_to_parent[u], making O(1) stack rollback impossible and corrupting cycle XOR calculations! You MUST use Union-by-Size/Rank ONLY (no path compression) and compute xor_to_root(u) by walking parent pointers to the root in O(log N).',
    },
    {
      title: 'Trap 2: Mutating a Global GF(2) XOR Basis Without Restoring on Backtrack',
      detail:
        'When an edge (u, v, w) connects two vertices already in the same DSU component, it forms a fundamental cycle of value w ^ xor_to_root(u) ^ xor_to_root(v) that is inserted into the 30-bit XOR basis. Instead of building a rollback log for the basis, pass the 30-integer basis struct (120 bytes) BY VALUE down the Segment Tree over Time recursion so backtracking restores it automatically!',
    },
  ],
  stage1Statement: {
    statement:
      'You are given an initially connected undirected weighted graph with N vertices and M edges, where each edge (u, v) carries a 30-bit non-negative weight d. Process Q events across time t = 1..Q of three types: (1 x y d) add a new undirected edge between x and y with weight d; (2 x y) delete the existing edge between x and y; (3 x y) find the minimum possible bitwise XOR sum of edge weights along ANY walk (vertices and edges may repeat) between x and y in the current graph.',
    constraints: [
      '1 <= N, M, Q <= 2 * 10^5',
      '0 <= d < 2^{30}',
      'The graph is guaranteed to remain connected at all times',
      'Time Limit: 2.5 seconds',
    ],
    sampleInput: `4 4 4
1 2 3
2 3 5
3 4 6
1 3 1
3 1 4
1 2 4 7
3 1 4
2 1 3`,
    sampleOutput: `0
0`,
    sampleExplanation:
      'Initially edges (1,2)=3, (2,3)=5, (3,4)=6 form a spanning tree (path 1->2->3->4 has XOR 3 ^ 5 ^ 6 = 0), and edge (1,3)=1 creates cycle 1-2-3-1 of XOR 3 ^ 5 ^ 1 = 7. At the first query (3 1 4), path XOR is 0, reduced by basis {7} -> min(0, 0^7) = 0. Adding (2,4)=7 creates cycle 2-3-4-2 of XOR 5 ^ 6 ^ 7 = 4; basis becomes {7, 4} -> RREF {4, 3}, and query (3 1 4) remains 0.',
  },
  stage2NaiveFailure: {
    naiveApproaches: [
      {
        approach: 'Modified Dijkstra / BFS Searching for Minimum XOR Path',
        complexity: 'Exponential State Space O(V * 2^30)',
        verdict: 'TLE',
        reason:
          'Unlike addition, bitwise XOR is not monotonic (a larger prefix XOR can cancel high bits later). Dijkstra greedy relaxation fails completely on XOR paths.',
      },
      {
        approach: 'Rebuild Spanning Tree & Cycle XOR Basis on Every Query',
        complexity: 'O(Q * (N + M))',
        verdict: 'TLE',
        reason:
          'With N, M, Q = 2 * 10^5, running DFS from scratch per query takes 8 * 10^10 operations.',
      },
      {
        approach: 'Online Link-Cut Tree Maintaining Fundamental Cycle Basis',
        complexity: 'Non-Tree Edge Replacement Bottleneck',
        verdict: 'WA',
        reason:
          'Deleting a non-tree cycle edge removes a vector from the GF(2) XOR basis, and deleting a tree edge requires finding a replacement non-tree edge; neither supports simple online basis deletion without offline lifespan decomposition.',
      },
    ],
    constraintWhispers: [
      'Any x-to-y walk can be decomposed into ONE fixed spanning-tree path P(x, y) XORed with a linear combination of fundamental cycle XORs (because traversing the connecting path to a cycle and back cancels out via w ^ w = 0)!',
      'Offline edge additions and deletions define a contiguous active time interval [L_e, R_e] for every edge e across the Q query timestamps.',
      'Inserting each edge interval [L_e, R_e] into O(log Q) nodes of a Segment Tree over Time converts dynamic deletions into pure stack-based additions + LIFO rollbacks!',
    ],
  },
  stage3AhaReduction: {
    coreInsight:
      'Map every edge’s active lifespan [t_start, t_end] onto a Segment Tree over the Q query timestamps. Traverse the segment tree via DFS while maintaining: (1) a parity-weighted Rollback DSU (tracking xor_to_root(u) along spanning-tree edges), and (2) a 30-bit GF(2) Linear XOR Basis (passed by value) storing fundamental cycle XORs!',
    steps: [
      {
        title: '1. Walk = Tree Path ⊕ Fundamental Cycles Invariant',
        proofNote:
          'Fix any spanning forest of the active graph. If an active edge e = (u, v, w) connects two disconnected components, union their roots in the Rollback DSU with relative weight w ^ xor_to_root(u) ^ xor_to_root(v). If u and v are ALREADY connected, e closes a fundamental cycle of XOR weight C_e = w ^ xor_to_root(u) ^ xor_to_root(v); insert C_e into the 30-bit GF(2) XOR Basis!',
      },
      {
        title: '2. Segment Tree over Time Interval Decomposition',
        proofNote:
          'Pair each Type-1 edge insertion with its matching Type-2 deletion (or the end of time Q if never deleted). Each edge’s active query interval [ql, qr] is split into <= 2 log_2 Q canonical nodes of the timeline Segment Tree.',
      },
      {
        title: '3. Pass-by-Value 30-Bit Basis + Rollback DSU Snapshot',
        proofNote:
          'At timeline node p, record DSU stack checkpoint snap = dsu.snapshot() and copy the parent’s 30-integer XORBasis (only 120 bytes!). Process all edges stored at node p: tree edges push onto the DSU undo stack, and cycle edges insert into the local basis copy. Recurse on left and right children, then call dsu.rollback(snap) upon exiting node p!',
      },
      {
        title: '4. Answering Query (x, y) at Timeline Leaf t',
        proofNote:
          'At leaf t corresponding to query (3, x_t, y_t), compute the unique spanning-tree path XOR path_val = dsu.xor_to_root(x_t) ^ dsu.xor_to_root(y_t). Greedily reduce path_val from bit 29 down to 0 using the active leaf’s XORBasis: path_val = min(path_val, path_val ^ basis[b]).',
      },
    ],
  },
  stage4DryRun: {
    intro:
      'Trace the Sample Input on 4 vertices across 2 query timestamps. Watch the timeline Segment Tree push spanning-tree edges into the Rollback DSU, absorb back-edges into the 30-bit GF(2) Cycle Basis, and reduce path XORs at the leaves.',
    traceSteps: [
      {
        stepNumber: 1,
        title: 'Map Edge Lifespans onto Timeline [0..1] (2 Query Timestamps)',
        explanation:
          'There are 2 Type-3 queries (t = 0 and t = 1). Tree edges (1,2,3), (2,3,5), (3,4,6) and cycle edge (1,3,1) are active on [0..1] (Root of Timeline SegTree). Edge (2,4,7) is added after query 0, so it is active only on [1..1] (Right Leaf).',
        mode: 'array',
        arrays: [
          {
            name: 'Timeline Segment Tree Edge Buckets',
            cells: [
              {
                index: 0,
                value: '(1,2,3),(2,3,5),(3,4,6),(1,3,1)',
                label: 'Root [0..1]',
                highlight: 'active',
              },
              {
                index: 1,
                value: '(empty)',
                label: 'Left Leaf [0..0]',
                highlight: 'neutral',
              },
              {
                index: 2,
                value: '(2,4,7)',
                label: 'Right Leaf [1..1]',
                highlight: 'window',
              },
            ],
          },
        ],
        variables: { Queries: 2, RootEdges: 4, RightLeafEdges: 1 },
      },
      {
        stepNumber: 2,
        title: 'Enter Root [0..1]: Build DSU Tree & Extract Cycle Basis {7}',
        explanation:
          'Unions (1,2,3), (2,3,5), (3,4,6) connect {1,2,3,4} with xor_to_root: d(1)=0, d(2)=3, d(3)=3^5=6, d(4)=6^6=0. Next, edge (1,3,1) connects already-connected 1 and 3! Fundamental cycle XOR = d(1) ^ d(3) ^ 1 = 0 ^ 6 ^ 1 = 7 -> inserted into GF(2) Basis at bit 2.',
        mode: 'array',
        arrays: [
          {
            name: 'Rollback DSU xor_to_root(v) at Root [0..1]',
            cells: [
              { index: 1, value: 0, label: 'v1 (root)', highlight: 'active' },
              { index: 2, value: 3, label: 'v2 (0^3)', highlight: 'window' },
              { index: 3, value: 6, label: 'v3 (3^5)', highlight: 'window' },
              { index: 4, value: 0, label: 'v4 (6^6)', highlight: 'active' },
            ],
          },
          {
            name: 'GF(2) Cycle Basis at Root [0..1]',
            cells: [
              { index: 2, value: 7, label: 'basis[2] = 7 (111₂)', highlight: 'updated' },
            ],
          },
        ],
        variables: { 'PathXOR(1,4)': '0 ^ 0 = 0', CycleBasis: '{7}' },
      },
      {
        stepNumber: 3,
        title: 'Visit Left Leaf [t = 0]: Answer First Query (3, 1, 4) = 0',
        explanation:
          'At leaf t = 0: path_xor(1, 4) = d(1) ^ d(4) = 0 ^ 0 = 0. Reducing 0 with basis {7} gives min(0, 0 ^ 7) = 0.',
        mode: 'array',
        arrays: [
          {
            name: 'Query t = 0 Evaluation',
            cells: [
              { index: 0, value: 0, label: 'Tree Path XOR(1,4)', highlight: 'active' },
              { index: 1, value: 0, label: 'Min XOR after Basis {7}', highlight: 'updated' },
            ],
          },
        ],
        variables: { QueryTime: 0, PathXOR: 0, Answer0: 0 },
      },
      {
        stepNumber: 4,
        title: 'Visit Right Leaf [t = 1]: Add Edge (2,4,7) -> Cycle 4 -> Answer = 0',
        explanation:
          'At leaf t = 1: edge (2,4,7) connects connected vertices 2 and 4, creating cycle XOR = d(2) ^ d(4) ^ 7 = 3 ^ 0 ^ 7 = 4 -> Basis becomes {7, 4} (spans {0, 3, 4, 7}). Query (3, 1, 4) again reduces path_xor = 0 to 0, then backtracks and rolls back cleanly!',
        mode: 'array',
        arrays: [
          {
            name: 'GF(2) Cycle Basis at Right Leaf [t = 1]',
            cells: [
              { index: 2, value: 7, label: 'basis[2] = 7', highlight: 'window' },
              { index: 1, value: 3, label: 'basis[1] = 4^7 = 3', highlight: 'updated' },
            ],
          },
        ],
        variables: { QueryTime: 1, NewCycle: '3 ^ 0 ^ 7 = 4', Basis: '{7, 3}', Answer1: 0 },
      },
    ],
  },
  stage5Solutions: {
    timeComplexity: 'O((M + Q) log Q * (log N + 30))',
    spaceComplexity: 'O((N + M + Q) log Q)',
    implementations: {
      cpp20: `#include <bits/stdc++.h>
using namespace std;

struct XORBasis {
    int b[30];
    XORBasis() { memset(b, 0, sizeof(b)); }

    void insert(int x) {
        for (int i = 29; i >= 0; --i) {
            if ((x >> i) & 1) {
                if (!b[i]) {
                    b[i] = x;
                    return;
                }
                x ^= b[i];
            }
        }
    }

    int query_min(int x) const {
        for (int i = 29; i >= 0; --i) {
            x = min(x, x ^ b[i]);
        }
        return x;
    }
};

struct Edge {
    int u, v, w;
};

struct RollbackDSU {
    vector<int> parent, sz, weight_to_p;
    vector<pair<int, int>> history;

    explicit RollbackDSU(int n) : parent(n + 1), sz(n + 1, 1), weight_to_p(n + 1, 0) {
        iota(parent.begin(), parent.end(), 0);
    }

    pair<int, int> find_with_xor(int u) const {
        int x = 0;
        while (parent[u] != u) {
            x ^= weight_to_p[u];
            u = parent[u];
        }
        return {u, x};
    }

    bool unite(int u, int v, int w, XORBasis& basis) {
        auto [ru, xu] = find_with_xor(u);
        auto [rv, xv] = find_with_xor(v);
        if (ru == rv) {
            basis.insert(xu ^ xv ^ w);
            return false;
        }
        if (sz[ru] < sz[rv]) {
            swap(ru, rv);
            swap(xu, xv);
        }
        history.push_back({rv, ru});
        parent[rv] = ru;
        weight_to_p[rv] = xu ^ xv ^ w;
        sz[ru] += sz[rv];
        return true;
    }

    int snapshot() const { return (int)history.size(); }

    void rollback(int snap) {
        while ((int)history.size() > snap) {
            auto [rv, ru] = history.back();
            history.pop_back();
            sz[ru] -= sz[rv];
            parent[rv] = rv;
            weight_to_p[rv] = 0;
        }
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, m, q;
    if (!(cin >> n >> m >> q)) return 0;

    map<pair<int, int>, pair<int, int>> active_edges; // (u, v) -> (weight, start_query_idx)
    struct LifespanEdge {
        int l, r;
        Edge e;
    };
    vector<LifespanEdge> lifespans;

    for (int i = 0; i < m; ++i) {
        int u, v, d;
        cin >> u >> v >> d;
        if (u > v) swap(u, v);
        active_edges[{u, v}] = {d, 0};
    }

    vector<pair<int, int>> queries;
    for (int i = 0; i < q; ++i) {
        int type;
        cin >> type;
        if (type == 1) {
            int u, v, d;
            cin >> u >> v >> d;
            if (u > v) swap(u, v);
            active_edges[{u, v}] = {d, (int)queries.size()};
        } else if (type == 2) {
            int u, v;
            cin >> u >> v;
            if (u > v) swap(u, v);
            auto it = active_edges.find({u, v});
            if (it != active_edges.end()) {
                int l = it->second.second;
                int r = (int)queries.size() - 1;
                if (l <= r) lifespans.push_back({l, r, {u, v, it->second.first}});
                active_edges.erase(it);
            }
        } else {
            int u, v;
            cin >> u >> v;
            queries.push_back({u, v});
        }
    }

    int K = (int)queries.size();
    if (K == 0) return 0;

    for (const auto& [uv, info] : active_edges) {
        int l = info.second;
        int r = K - 1;
        if (l <= r) lifespans.push_back({l, r, {uv.first, uv.second, info.first}});
    }

    vector<vector<Edge>> seg(4 * K);
    auto add_to_seg = [&](auto& self, int p, int l, int r, int ql, int qr, const Edge& e) -> void {
        if (ql <= l && r <= qr) {
            seg[p].push_back(e);
            return;
        }
        int mid = (l + r) >> 1;
        if (ql <= mid) self(self, p << 1, l, mid, ql, qr, e);
        if (qr > mid) self(self, p << 1 | 1, mid + 1, r, ql, qr, e);
    };

    for (const auto& item : lifespans) {
        add_to_seg(add_to_seg, 1, 0, K - 1, item.l, item.r, item.e);
    }

    RollbackDSU dsu(n);
    vector<int> ans(K, 0);

    auto dfs = [&](auto& self, int p, int l, int r, XORBasis basis) -> void {
        int snap = dsu.snapshot();
        for (const auto& e : seg[p]) {
            dsu.unite(e.u, e.v, e.w, basis);
        }
        if (l == r) {
            auto [u, v] = queries[l];
            int path_xor = dsu.find_with_xor(u).second ^ dsu.find_with_xor(v).second;
            ans[l] = basis.query_min(path_xor);
        } else {
            int mid = (l + r) >> 1;
            self(self, p << 1, l, mid, basis);
            self(self, p << 1 | 1, mid + 1, r, basis);
        }
        dsu.rollback(snap);
    };

    dfs(dfs, 1, 0, K - 1, XORBasis{});
    for (int i = 0; i < K; ++i) {
        cout << ans[i] << '\\n';
    }
    return 0;
}`,
      rust: `use std::collections::HashMap;
use std::io::{self, Read};

#[derive(Clone, Copy, Default)]
struct XORBasis {
    b: [i32; 30],
}

impl XORBasis {
    fn insert(&mut self, mut x: i32) {
        for i in (0..30).rev() {
            if (x >> i) & 1 == 1 {
                if self.b[i] == 0 {
                    self.b[i] = x;
                    return;
                }
                x ^= self.b[i];
            }
        }
    }

    fn query_min(&self, mut x: i32) -> i32 {
        for i in (0..30).rev() {
            x = x.min(x ^ self.b[i]);
        }
        x
    }
}

#[derive(Clone, Copy)]
struct Edge {
    u: usize,
    v: usize,
    w: i32,
}

struct RollbackDSU {
    parent: Vec<usize>,
    sz: Vec<usize>,
    weight: Vec<i32>,
    history: Vec<(usize, usize)>,
}

impl RollbackDSU {
    fn new(n: usize) -> Self {
        Self {
            parent: (0..=n).collect(),
            sz: vec![1; n + 1],
            weight: vec![0; n + 1],
            history: Vec::new(),
        }
    }

    fn find_with_xor(&self, mut u: usize) -> (usize, i32) {
        let mut x = 0;
        while self.parent[u] != u {
            x ^= self.weight[u];
            u = self.parent[u];
        }
        (u, x)
    }

    fn unite(&mut self, u: usize, v: usize, w: i32, basis: &mut XORBasis) {
        let (mut ru, mut xu) = self.find_with_xor(u);
        let (mut rv, mut xv) = self.find_with_xor(v);
        if ru == rv {
            basis.insert(xu ^ xv ^ w);
            return;
        }
        if self.sz[ru] < self.sz[rv] {
            std::mem::swap(&mut ru, &mut rv);
            std::mem::swap(&mut xu, &mut xv);
        }
        self.history.push((rv, ru));
        self.parent[rv] = ru;
        self.weight[rv] = xu ^ xv ^ w;
        self.sz[ru] += self.sz[rv];
    }

    fn snapshot(&self) -> usize {
        self.history.len()
    }

    fn rollback(&mut self, snap: usize) {
        while self.history.len() > snap {
            let (rv, ru) = self.history.pop().unwrap();
            self.sz[ru] -= self.sz[rv];
            self.parent[rv] = rv;
            self.weight[rv] = 0;
        }
    }
}

fn add_seg(seg: &mut [Vec<Edge>], p: usize, l: usize, r: usize, ql: usize, qr: usize, e: Edge) {
    if ql <= l && r <= qr {
        seg[p].push(e);
        return;
    }
    let mid = (l + r) >> 1;
    if ql <= mid {
        add_seg(seg, p << 1, l, mid, ql, qr, e);
    }
    if qr > mid {
        add_seg(seg, p << 1 | 1, mid + 1, r, ql, qr, e);
    }
}

fn dfs(
    seg: &[Vec<Edge>],
    dsu: &mut RollbackDSU,
    queries: &[(usize, usize)],
    ans: &mut [i32],
    p: usize,
    l: usize,
    r: usize,
    mut basis: XORBasis,
) {
    let snap = dsu.snapshot();
    for &e in &seg[p] {
        dsu.unite(e.u, e.v, e.w, &mut basis);
    }
    if l == r {
        let (u, v) = queries[l];
        let path_xor = dsu.find_with_xor(u).1 ^ dsu.find_with_xor(v).1;
        ans[l] = basis.query_min(path_xor);
    } else {
        let mid = (l + r) >> 1;
        dfs(seg, dsu, queries, ans, p << 1, l, mid, basis);
        dfs(seg, dsu, queries, ans, p << 1 | 1, mid + 1, r, basis);
    }
    dsu.rollback(snap);
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let Some(n_str) = it.next() else { return; };
    let n: usize = n_str.parse().unwrap();
    let m: usize = it.next().unwrap().parse().unwrap();
    let q: usize = it.next().unwrap().parse().unwrap();

    let mut active: HashMap<(usize, usize), (i32, usize)> = HashMap::new();
    let mut lifespans: Vec<(usize, usize, Edge)> = Vec::new();

    for _ in 0..m {
        let mut u: usize = it.next().unwrap().parse().unwrap();
        let mut v: usize = it.next().unwrap().parse().unwrap();
        let d: i32 = it.next().unwrap().parse().unwrap();
        if u > v {
            std::mem::swap(&mut u, &mut v);
        }
        active.insert((u, v), (d, 0));
    }

    let mut queries: Vec<(usize, usize)> = Vec::new();
    for _ in 0..q {
        let t: i32 = it.next().unwrap().parse().unwrap();
        if t == 1 {
            let mut u: usize = it.next().unwrap().parse().unwrap();
            let mut v: usize = it.next().unwrap().parse().unwrap();
            let d: i32 = it.next().unwrap().parse().unwrap();
            if u > v {
                std::mem::swap(&mut u, &mut v);
            }
            active.insert((u, v), (d, queries.len()));
        } else if t == 2 {
            let mut u: usize = it.next().unwrap().parse().unwrap();
            let mut v: usize = it.next().unwrap().parse().unwrap();
            if u > v {
                std::mem::swap(&mut u, &mut v);
            }
            if let Some((w, start)) = active.remove(&(u, v)) {
                if start < queries.len() {
                    lifespans.push((start, queries.len() - 1, Edge { u, v, w }));
                }
            }
        } else {
            let u: usize = it.next().unwrap().parse().unwrap();
            let v: usize = it.next().unwrap().parse().unwrap();
            queries.push((u, v));
        }
    }

    let k = queries.len();
    if k == 0 {
        return;
    }
    for ((u, v), (w, start)) in active {
        if start < k {
            lifespans.push((start, k - 1, Edge { u, v, w }));
        }
    }

    let mut seg = vec![Vec::new(); 4 * k];
    for (ql, qr, e) in lifespans {
        add_seg(&mut seg, 1, 0, k - 1, ql, qr, e);
    }

    let mut dsu = RollbackDSU::new(n);
    let mut ans = vec![0i32; k];
    dfs(&seg, &mut dsu, &queries, &mut ans, 1, 0, k - 1, XORBasis::default());

    let mut out = String::new();
    for x in ans {
        out.push_str(&format!("{}\\n", x));
    }
    print!("{}", out);
}`,
      java21: `import java.io.*;
import java.util.*;

public class Main {
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
    }

    static final class Edge {
        int u, v, w;
        Edge(int u, int v, int w) { this.u = u; this.v = v; this.w = w; }
    }

    static void insertBasis(int[] b, int x) {
        for (int i = 29; i >= 0; i--) {
            if (((x >> i) & 1) == 1) {
                if (b[i] == 0) { b[i] = x; return; }
                x ^= b[i];
            }
        }
    }

    static int queryMin(int[] b, int x) {
        for (int i = 29; i >= 0; i--) x = Math.min(x, x ^ b[i]);
        return x;
    }

    static int[] parent, sz, weight, histRv, histRu;
    static int histSz = 0;

    static int findRoot(int u) {
        while (parent[u] != u) u = parent[u];
        return u;
    }

    static int findXor(int u) {
        int x = 0;
        while (parent[u] != u) {
            x ^= weight[u];
            u = parent[u];
        }
        return x;
    }

    static void unite(int u, int v, int w, int[] basis) {
        int ru = findRoot(u), xu = findXor(u);
        int rv = findRoot(v), xv = findXor(v);
        if (ru == rv) {
            insertBasis(basis, xu ^ xv ^ w);
            return;
        }
        if (sz[ru] < sz[rv]) {
            int t = ru; ru = rv; rv = t;
            t = xu; xu = xv; xv = t;
        }
        histRv[histSz] = rv;
        histRu[histSz] = ru;
        histSz++;
        parent[rv] = ru;
        weight[rv] = xu ^ xv ^ w;
        sz[ru] += sz[rv];
    }

    static void rollback(int snap) {
        while (histSz > snap) {
            histSz--;
            int rv = histRv[histSz], ru = histRu[histSz];
            sz[ru] -= sz[rv];
            parent[rv] = rv;
            weight[rv] = 0;
        }
    }

    static List<Edge>[] seg;
    static int[] qU, qV, ans;

    static void addSeg(int p, int l, int r, int ql, int qr, Edge e) {
        if (ql <= l && r <= qr) { seg[p].add(e); return; }
        int mid = (l + r) >> 1;
        if (ql <= mid) addSeg(p << 1, l, mid, ql, qr, e);
        if (qr > mid) addSeg(p << 1 | 1, mid + 1, r, ql, qr, e);
    }

    static void dfs(int p, int l, int r, int[] parentBasis) {
        int snap = histSz;
        int[] basis = Arrays.copyOf(parentBasis, 30);
        for (Edge e : seg[p]) unite(e.u, e.v, e.w, basis);
        if (l == r) {
            int pathXor = findXor(qU[l]) ^ findXor(qV[l]);
            ans[l] = queryMin(basis, pathXor);
        } else {
            int mid = (l + r) >> 1;
            dfs(p << 1, l, mid, basis);
            dfs(p << 1 | 1, mid + 1, r, basis);
        }
        rollback(snap);
    }

    @SuppressWarnings("unchecked")
    public static void main(String[] args) throws Exception {
        FastScanner sc = new FastScanner();
        String first = sc.next();
        if (first == null) return;
        int n = Integer.parseInt(first), m = sc.nextInt(), q = sc.nextInt();

        Map<Long, int[]> active = new HashMap<>();
        List<int[]> lifespans = new ArrayList<>();

        for (int i = 0; i < m; i++) {
            int u = sc.nextInt(), v = sc.nextInt(), d = sc.nextInt();
            if (u > v) { int t = u; u = v; v = t; }
            long key = (((long) u) << 32) | (v & 0xffffffffL);
            active.put(key, new int[]{d, 0});
        }

        qU = new int[q];
        qV = new int[q];
        int k = 0;
        for (int i = 0; i < q; i++) {
            int type = sc.nextInt();
            if (type == 1) {
                int u = sc.nextInt(), v = sc.nextInt(), d = sc.nextInt();
                if (u > v) { int t = u; u = v; v = t; }
                long key = (((long) u) << 32) | (v & 0xffffffffL);
                active.put(key, new int[]{d, k});
            } else if (type == 2) {
                int u = sc.nextInt(), v = sc.nextInt();
                if (u > v) { int t = u; u = v; v = t; }
                long key = (((long) u) << 32) | (v & 0xffffffffL);
                int[] info = active.remove(key);
                if (info != null && info[1] < k) {
                    lifespans.add(new int[]{info[1], k - 1, u, v, info[0]});
                }
            } else {
                qU[k] = sc.nextInt();
                qV[k] = sc.nextInt();
                k++;
            }
        }
        if (k == 0) return;

        for (Map.Entry<Long, int[]> entry : active.entrySet()) {
            long key = entry.getKey();
            int u = (int) (key >>> 32), v = (int) key;
            int[] info = entry.getValue();
            if (info[1] < k) lifespans.add(new int[]{info[1], k - 1, u, v, info[0]});
        }

        seg = new ArrayList[4 * k];
        for (int i = 0; i < 4 * k; i++) seg[i] = new ArrayList<>();
        for (int[] ls : lifespans) {
            addSeg(1, 0, k - 1, ls[0], ls[1], new Edge(ls[2], ls[3], ls[4]));
        }

        parent = new int[n + 1];
        sz = new int[n + 1];
        weight = new int[n + 1];
        for (int i = 1; i <= n; i++) { parent[i] = i; sz[i] = 1; }
        histRv = new int[m + q + 5];
        histRu = new int[m + q + 5];
        ans = new int[k];

        dfs(1, 0, k - 1, new int[30]);

        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < k; i++) sb.append(ans[i]).append('\\n');
        System.out.print(sb);
    }
}`,
      python3: `import sys

sys.setrecursionlimit(200000)

def insert_basis(b: list[int], x: int) -> None:
    for i in range(29, -1, -1):
        if (x >> i) & 1:
            if b[i] == 0:
                b[i] = x
                return
            x ^= b[i]

def query_min(b: list[int], x: int) -> int:
    for i in range(29, -1, -1):
        if (x ^ b[i]) < x:
            x ^= b[i]
    return x

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    n = int(next(it))
    m = int(next(it))
    q = int(next(it))

    active = {}
    lifespans = []
    for _ in range(m):
        u = int(next(it))
        v = int(next(it))
        d = int(next(it))
        if u > v:
            u, v = v, u
        active[(u, v)] = (d, 0)

    queries = []
    for _ in range(q):
        t = int(next(it))
        if t == 1:
            u = int(next(it))
            v = int(next(it))
            d = int(next(it))
            if u > v:
                u, v = v, u
            active[(u, v)] = (d, len(queries))
        elif t == 2:
            u = int(next(it))
            v = int(next(it))
            if u > v:
                u, v = v, u
            info = active.pop((u, v), None)
            if info and info[1] < len(queries):
                lifespans.append((info[1], len(queries) - 1, u, v, info[0]))
        else:
            u = int(next(it))
            v = int(next(it))
            queries.append((u, v))

    k = len(queries)
    if k == 0:
        return
    for (u, v), (d, start) in active.items():
        if start < k:
            lifespans.append((start, k - 1, u, v, d))

    seg = [[] for _ in range(4 * k)]
    def add_seg(p: int, l: int, r: int, ql: int, qr: int, edge) -> None:
        if ql <= l and r <= qr:
            seg[p].append(edge)
            return
        mid = (l + r) >> 1
        if ql <= mid:
            add_seg(p << 1, l, mid, ql, qr, edge)
        if qr > mid:
            add_seg(p << 1 | 1, mid + 1, r, ql, qr, edge)

    for ql, qr, u, v, d in lifespans:
        add_seg(1, 0, k - 1, ql, qr, (u, v, d))

    parent = list(range(n + 1))
    sz = [1] * (n + 1)
    weight = [0] * (n + 1)
    history = []

    def find_with_xor(u: int):
        x = 0
        while parent[u] != u:
            x ^= weight[u]
            u = parent[u]
        return u, x

    def unite(u: int, v: int, w: int, basis: list[int]) -> None:
        ru, xu = find_with_xor(u)
        rv, xv = find_with_xor(v)
        if ru == rv:
            insert_basis(basis, xu ^ xv ^ w)
            return
        if sz[ru] < sz[rv]:
            ru, rv = rv, ru
            xu, xv = xv, xu
        history.append((rv, ru))
        parent[rv] = ru
        weight[rv] = xu ^ xv ^ w
        sz[ru] += sz[rv]

    ans = [0] * k
    def dfs(p: int, l: int, r: int, parent_basis: list[int]) -> None:
        snap = len(history)
        basis = parent_basis[:]
        for u, v, w in seg[p]:
            unite(u, v, w, basis)
        if l == r:
            u, v = queries[l]
            path_xor = find_with_xor(u)[1] ^ find_with_xor(v)[1]
            ans[l] = query_min(basis, path_xor)
        else:
            mid = (l + r) >> 1
            dfs(p << 1, l, mid, basis)
            dfs(p << 1 | 1, mid + 1, r, basis)
        while len(history) > snap:
            rv, ru = history.pop()
            sz[ru] -= sz[rv]
            parent[rv] = rv
            weight[rv] = 0

    dfs(1, 0, k - 1, [0] * 30)
    sys.stdout.write("\\n".join(map(str, ans)) + "\\n")

if __name__ == "__main__":
    solve()`,
      ruby: `def insert_basis(b, x)
  29.downto(0) do |i|
    if ((x >> i) & 1) == 1
      if b[i] == 0
        b[i] = x
        return
      end
      x ^= b[i]
    end
  end
end

def query_min(b, x)
  29.downto(0) do |i|
    x ^= b[i] if (x ^ b[i]) < x
  end
  x
end

tokens = STDIN.read.split.map(&:to_i)
exit if tokens.empty?
idx = 0
n = tokens[idx]; m = tokens[idx + 1]; q = tokens[idx + 2]; idx += 3

active = {}
lifespans = []
m.times do
  u = tokens[idx]; v = tokens[idx + 1]; d = tokens[idx + 2]; idx += 3
  u, v = v, u if u > v
  active[[u, v]] = [d, 0]
end

queries = []
q.times do
  t = tokens[idx]; idx += 1
  if t == 1
    u = tokens[idx]; v = tokens[idx + 1]; d = tokens[idx + 2]; idx += 3
    u, v = v, u if u > v
    active[[u, v]] = [d, queries.size]
  elsif t == 2
    u = tokens[idx]; v = tokens[idx + 1]; idx += 2
    u, v = v, u if u > v
    info = active.delete([u, v])
    lifespans << [info[1], queries.size - 1, u, v, info[0]] if info && info[1] < queries.size
  else
    u = tokens[idx]; v = tokens[idx + 1]; idx += 2
    queries << [u, v]
  end
end

k = queries.size
exit if k == 0
active.each do |(u, v), (d, start)|
  lifespans << [start, k - 1, u, v, d] if start < k
end

$seg = Array.new(4 * k) { [] }
def add_seg(p, l, r, ql, qr, edge)
  if ql <= l && r <= qr
    $seg[p] << edge
    return
  end
  mid = (l + r) >> 1
  add_seg(p << 1, l, mid, ql, qr, edge) if ql <= mid
  add_seg(p << 1 | 1, mid + 1, r, ql, qr, edge) if qr > mid
end

lifespans.each { |ql, qr, u, v, d| add_seg(1, 0, k - 1, ql, qr, [u, v, d]) }

$parent = (0..n).to_a
$sz = Array.new(n + 1, 1)
$weight = Array.new(n + 1, 0)
$history = []
$queries = queries
$ans = Array.new(k, 0)

def find_with_xor(u)
  x = 0
  while $parent[u] != u
    x ^= $weight[u]
    u = $parent[u]
  end
  [u, x]
end

def unite(u, v, w, basis)
  ru, xu = find_with_xor(u)
  rv, xv = find_with_xor(v)
  if ru == rv
    insert_basis(basis, xu ^ xv ^ w)
    return
  end
  if $sz[ru] < $sz[rv]
    ru, rv = rv, ru
    xu, xv = xv, xu
  end
  $history << [rv, ru]
  $parent[rv] = ru
  $weight[rv] = xu ^ xv ^ w
  $sz[ru] += $sz[rv]
end

def dfs(p, l, r, parent_basis)
  snap = $history.size
  basis = parent_basis.dup
  $seg[p].each { |u, v, w| unite(u, v, w, basis) }
  if l == r
    u, v = $queries[l]
    path_xor = find_with_xor(u)[1] ^ find_with_xor(v)[1]
    $ans[l] = query_min(basis, path_xor)
  else
    mid = (l + r) >> 1
    dfs(p << 1, l, mid, basis)
    dfs(p << 1 | 1, mid + 1, r, basis)
  end
  while $history.size > snap
    rv, ru = $history.pop
    $sz[ru] -= $sz[rv]
    $parent[rv] = rv
    $weight[rv] = 0
  end
end

dfs(1, 0, k - 1, Array.new(30, 0))
puts $ans.join("\\n")`,
    },
  },
};
