import type { TheoryChapter } from '../../types/vault';

export const CH71_GOMORY_HU_STOER_WAGNER: TheoryChapter = {
  slug: 'gomory-hu-stoer-wagner',
  topicId: 'gr-44',
  title: 'Gomory-Hu Cut Trees & Stoer-Wagner Global Min-Cut',
  domain: 'Graph & Tree Theory',
  ratingTier: '2600–3300+',
  usacoDivision: 'Advanced',
  subtitle: 'Compressing all N(N-1)/2 min-cuts into an N-vertex tree via Gusfield’s N-1 max-flow runs and finding unrooted global min-cuts via Stoer-Wagner',
  analogyTitle: 'Finding the Weakest Seam in the Entire Fabric & Compressing Every Bottleneck Into One Tree',
  analogyBody:
    'Computing all-pairs minimum cuts on an N-vertex undirected graph naively requires N(N-1)/2 separate max-flow calls. Similarly, finding the global minimum cut without fixed source or sink appears to require testing every pair (s, t).\n\nTwo remarkable structural theorems slash this cost dramatically:\n\n1. Gomory-Hu Cut Tree (Gusfield’s Algorithm): Because minimum cuts in undirected graphs satisfy submodular non-crossing properties, all N(N-1)/2 pairwise min-cut values are faithfully encoded as path bottlenecks on a single N-vertex weighted tree! Gusfield’s simplified construction maintains parent array p[2..N] initialized to 1 and performs only N - 1 Dinic max-flow runs between i and p[i], reassigning p[j] = i for any j > i that lands on i’s source side of the cut and shared p[j] == p[i].\n\n2. Stoer-Wagner Global Min-Cut: Without needing any max-flow calls at all, repeatedly growing a Maximum Adjacency ordering until the last two vertices (s, t) isolates a guaranteed minimum s-t cut on the very last vertex t. Recording cut(t) and contracting s and t into one super-node N - 1 times finds the global minimum cut in O(V^3) time.',
  prerequisites: [
    { slug: 'max-flow-dinic-min-cut', title: "Max Flow, Min Cut & Project Selection Modeling (Dinic's Algorithm)" },
  ],
  traceTitle: 'Gusfield’s N - 1 Cut-Tree Splitting Steps',
  traceSubtitle: 'Splitting equivalence classes p[2..4] into a Gomory-Hu tree on 4 vertices',
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Initialize Equivalence Classes p[2..4] = 1',
      explanation: 'Every vertex 2..4 starts attached to representative p[i] = 1. We iterate i = 2, 3, 4 running one Dinic max-flow from s = i to t = p[i] on the original graph.',
      mode: 'array',
      arrays: [
        {
          name: 'Parent Representative Array p[1..4]',
          cells: [
            { index: 1, value: 0, label: 'root', highlight: 'neutral' },
            { index: 2, value: 1, label: 'p[2]', highlight: 'active' },
            { index: 3, value: 1, label: 'p[3]', highlight: 'neutral' },
            { index: 4, value: 1, label: 'p[4]', highlight: 'neutral' },
          ],
        },
      ],
      variables: { step: 'init', treeEdges: 0, globalNodes: 4 },
    },
    {
      stepNumber: 2,
      title: 'Iteration i = 2: Dinic(s = 2, t = p[2] = 1)',
      explanation: 'Max flow f(2, 1) = 5. Source side of residual cut is S = {2, 4}. Vertex j = 4 > 2 satisfies j in S and p[4] == p[2] == 1, so p[4] updates to 2! Add tree edge (2, 1, w=5).',
      mode: 'array',
      arrays: [
        {
          name: 'Parent Array After i = 2 (S = {2, 4})',
          cells: [
            { index: 1, value: 0, label: 'root', highlight: 'neutral' },
            { index: 2, value: 1, label: 'w=5', highlight: 'active' },
            { index: 3, value: 1, label: 'in T', highlight: 'neutral' },
            { index: 4, value: 2, label: 'moved->2', highlight: 'updated' },
          ],
        },
      ],
      variables: { flow_2_1: 5, sourceSide: '{2, 4}', relinked: 'p[4]=2' },
    },
    {
      stepNumber: 3,
      title: 'Iteration i = 3: Dinic(s = 3, t = p[3] = 1)',
      explanation: 'Max flow f(3, 1) = 5. Cut isolates S = {3}. No j > 3 has p[j] == 1, so no re-parenting occurs. Add tree edge (3, 1, w=5).',
      mode: 'array',
      arrays: [
        {
          name: 'Parent Array After i = 3',
          cells: [
            { index: 1, value: 0, label: 'root', highlight: 'neutral' },
            { index: 2, value: 1, label: 'w=5', highlight: 'neutral' },
            { index: 3, value: 1, label: 'w=5', highlight: 'active' },
            { index: 4, value: 2, label: 'pending', highlight: 'neutral' },
          ],
        },
      ],
      variables: { flow_3_1: 5, treeEdges: 2, remaining: 'i=4' },
    },
    {
      stepNumber: 4,
      title: 'Iteration i = 4: Dinic(s = 4, t = p[4] = 2)',
      explanation: 'Max flow f(4, 2) = 6. Add tree edge (4, 2, w=6). Tree bottleneck between any (u, v) equals min-edge on tree path (sum of all 6 pairs = 5+5+5+5+6+5 = 31).',
      mode: 'array',
      arrays: [
        {
          name: 'Final Gomory-Hu Tree Edge Weights',
          cells: [
            { index: 2, value: '1 (w=5)', label: 'e(2,1)', highlight: 'active' },
            { index: 3, value: '1 (w=5)', label: 'e(3,1)', highlight: 'active' },
            { index: 4, value: '2 (w=6)', label: 'e(4,2)', highlight: 'updated' },
          ],
        },
      ],
      variables: { flow_4_2: 6, allPairsSum: 31, dinicRuns: 3 },
    },
  ],
  reductionClues: [
    {
      clue: 'Find the minimum cut splitting an undirected weighted graph into two non-empty parts (N <= 500, no fixed s/t)',
      translation: 'Run Stoer-Wagner Maximum Adjacency Search with vertex contractions in O(V^3) time—zero max-flow routines needed.',
    },
    {
      clue: 'Answer many (u, v) min-cut queries, sum all-pairs min-cuts, or compute max-pair min-cuts',
      translation: 'Build the Gomory-Hu tree via Gusfield’s N - 1 Dinic runs; answer path minimums with binary lifting or sum all pairs via descending DSU edge merges.',
    },
    {
      clue: 'Count K-edge-connected components or find equivalence classes where mincut(u, v) >= K',
      translation: 'Because mincut satisfies the Gomory-Hu ultrametric inequality, K-edge-connected components are simply connected components of the Gomory-Hu tree keeping edges >= K.',
    },
  ],
  timeComplexity: 'O(V^3) for Stoer-Wagner; O(V * MaxFlow) for Gusfield Gomory-Hu Cut Tree',
  spaceComplexity: 'O(V^2) adjacency matrix for Stoer-Wagner; O(V + E) for Dinic + Gomory-Hu Tree',
  pitfalls: [
    {
      type: 'WA',
      title: 'Mutating Residual Capacities Across Consecutive Gusfield Max-Flow Runs',
      detail: 'Gusfield’s algorithm MUST run each Dinic max_flow(i, p[i]) on the ORIGINAL undirected graph (resetting all residual edge flows to 0), NOT on a contracted graph or leftover flow state.',
    },
    {
      type: 'WA',
      title: 'Forgetting Reverse Edge Initial Capacity in Undirected Dinic',
      detail: 'In a directed flow graph, the reverse residual edge starts with capacity 0. In an UNDIRECTED graph with edge (u, v, cap), BOTH u->v and its twin v->u start with capacity cap (so adding u->v with cap and v->u with cap requires checking both residual directions correctly!).',
    },
    {
      type: 'WA',
      title: 'Self-Loops or Multiple Edges Not Merged in Stoer-Wagner Contractions',
      detail: 'When merging vertices s and t in Stoer-Wagner, accumulate weights into adj[s][k] += adj[t][k] for k != s, t only—ignoring self-loops k == s so w[s] never pollutes cut weights.',
    },
    {
      type: 'TLE',
      title: 'Using O(V^2) Adjacency Scan Dinic Instead of Current-Arc Pointer cur[u]',
      detail: 'Always include the current-arc optimization cur[u] in Dinic DFS; without cur[u], Dinic degrades to O(V^2 E^2) and Gusfield’s V - 1 calls will TLE on N = 500.',
    },
  ],
  implementations: {
    cpp20: `#include <algorithm>
#include <iostream>
#include <queue>
#include <vector>

using namespace std;

// Gusfield's Gomory-Hu Tree using Dinic Max Flow + DSU All-Pairs Min-Cut Sum.
struct Dinic {
    struct Edge {
        int to, rev;
        long long cap, orig;
    };

    int n;
    vector<vector<Edge>> adj;
    vector<int> level, ptr;

    explicit Dinic(int n) : n(n), adj(n + 1), level(n + 1), ptr(n + 1) {}

    void addUndirectedEdge(int u, int v, long long cap) {
        Edge a{v, static_cast<int>(adj[v].size()), cap, cap};
        Edge b{u, static_cast<int>(adj[u].size()), cap, cap};
        adj[u].push_back(a);
        adj[v].push_back(b);
    }

    void reset() {
        for (int u = 1; u <= n; ++u) {
            for (auto& e : adj[u]) e.cap = e.orig;
        }
    }

    bool bfs(int s, int t) {
        fill(level.begin(), level.end(), -1);
        level[s] = 0;
        queue<int> q;
        q.push(s);
        while (!q.empty()) {
            int u = q.front();
            q.pop();
            for (const auto& e : adj[u]) {
                if (e.cap > 0 && level[e.to] == -1) {
                    level[e.to] = level[u] + 1;
                    q.push(e.to);
                }
            }
        }
        return level[t] != -1;
    }

    long long dfs(int u, int t, long long pushed) {
        if (pushed == 0 || u == t) return pushed;
        for (int& cid = ptr[u]; cid < static_cast<int>(adj[u].size()); ++cid) {
            auto& e = adj[u][cid];
            if (e.cap == 0 || level[e.to] != level[u] + 1) continue;
            long long tr = dfs(e.to, t, min(pushed, e.cap));
            if (tr == 0) continue;
            e.cap -= tr;
            adj[e.to][e.rev].cap += tr;
            return tr;
        }
        return 0;
    }

    long long maxFlow(int s, int t) {
        reset();
        long long flow = 0;
        const long long INF = (1LL << 60);
        while (bfs(s, t)) {
            fill(ptr.begin(), ptr.end(), 0);
            while (long long pushed = dfs(s, t, INF)) {
                flow += pushed;
            }
        }
        return flow;
    }
};

struct TreeEdge {
    int u, v;
    long long w;
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, m;
    if (!(cin >> n >> m)) return 0;

    Dinic dinic(n);
    for (int i = 0; i < m; ++i) {
        int u, v;
        long long w;
        cin >> u >> v >> w;
        if (u != v && w > 0) dinic.addUndirectedEdge(u, v, w);
    }

    vector<int> p(n + 1, 1);
    vector<TreeEdge> edges;
    for (int i = 2; i <= n; ++i) {
        long long cutVal = dinic.maxFlow(i, p[i]);
        edges.push_back({i, p[i], cutVal});
        for (int j = i + 1; j <= n; ++j) {
            if (dinic.level[j] != -1 && p[j] == p[i]) {
                p[j] = i;
            }
        }
    }

    sort(edges.begin(), edges.end(), [](const TreeEdge& a, const TreeEdge& b) {
        return a.w > b.w;
    });

    vector<int> dsu(n + 1), sz(n + 1, 1);
    for (int i = 1; i <= n; ++i) dsu[i] = i;
    auto find = [&](auto& self, int x) -> int {
        return dsu[x] == x ? x : dsu[x] = self(self, dsu[x]);
    };

    long long totalAllPairs = 0;
    for (const auto& e : edges) {
        int a = find(find, e.u);
        int b = find(find, e.v);
        totalAllPairs += e.w * sz[a] * sz[b];
        dsu[b] = a;
        sz[a] += sz[b];
    }

    cout << totalAllPairs << "\\n";
    return 0;
}
`,
    rust: `use std::collections::VecDeque;
use std::io::{self, Read};

#[derive(Clone)]
struct Edge {
    to: usize,
    rev: usize,
    cap: i64,
    orig: i64,
}

struct Dinic {
    n: usize,
    adj: Vec<Vec<Edge>>,
    level: Vec<i32>,
    ptr: Vec<usize>,
}

impl Dinic {
    fn new(n: usize) -> Self {
        Self {
            n,
            adj: vec![Vec::new(); n + 1],
            level: vec![-1; n + 1],
            ptr: vec![0; n + 1],
        }
    }

    fn add_undirected_edge(&mut self, u: usize, v: usize, cap: i64) {
        let rev_u = self.adj[v].len();
        let rev_v = self.adj[u].len();
        self.adj[u].push(Edge { to: v, rev: rev_u, cap, orig: cap });
        self.adj[v].push(Edge { to: u, rev: rev_v, cap, orig: cap });
    }

    fn reset(&mut self) {
        for u in 1..=self.n {
            for e in &mut self.adj[u] {
                e.cap = e.orig;
            }
        }
    }

    fn bfs(&mut self, s: usize, t: usize) -> bool {
        self.level.fill(-1);
        self.level[s] = 0;
        let mut q = VecDeque::new();
        q.push_back(s);
        while let Some(u) = q.pop_front() {
            for e in &self.adj[u] {
                if e.cap > 0 && self.level[e.to] == -1 {
                    self.level[e.to] = self.level[u] + 1;
                    q.push_back(e.to);
                }
            }
        }
        self.level[t] != -1
    }

    fn dfs(&mut self, u: usize, t: usize, pushed: i64) -> i64 {
        if pushed == 0 || u == t {
            return pushed;
        }
        while self.ptr[u] < self.adj[u].len() {
            let cid = self.ptr[u];
            self.ptr[u] += 1;
            let to = self.adj[u][cid].to;
            let cap = self.adj[u][cid].cap;
            if cap == 0 || self.level[to] != self.level[u] + 1 {
                continue;
            }
            let tr = self.dfs(to, t, pushed.min(cap));
            if tr == 0 {
                continue;
            }
            self.adj[u][cid].cap -= tr;
            let rev = self.adj[u][cid].rev;
            self.adj[to][rev].cap += tr;
            return tr;
        }
        0
    }

    fn max_flow(&mut self, s: usize, t: usize) -> i64 {
        self.reset();
        let mut flow = 0;
        let inf = 1i64 << 60;
        while self.bfs(s, t) {
            self.ptr.fill(0);
            loop {
                let pushed = self.dfs(s, t, inf);
                if pushed == 0 {
                    break;
                }
                flow += pushed;
            }
        }
        flow
    }
}

fn find(dsu: &mut [usize], mut x: usize) -> usize {
    while dsu[x] != x {
        dsu[x] = dsu[dsu[x]];
        x = dsu[x];
    }
    x
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

    let mut dinic = Dinic::new(n);
    for _ in 0..m {
        let u: usize = it.next().unwrap().parse().unwrap();
        let v: usize = it.next().unwrap().parse().unwrap();
        let w: i64 = it.next().unwrap().parse().unwrap();
        if u != v && w > 0 {
            dinic.add_undirected_edge(u, v, w);
        }
    }

    let mut p = vec![1usize; n + 1];
    let mut edges: Vec<(i64, usize, usize)> = Vec::with_capacity(n);
    for i in 2..=n {
        let f = dinic.max_flow(i, p[i]);
        edges.push((f, i, p[i]));
        for j in (i + 1)..=n {
            if dinic.level[j] != -1 && p[j] == p[i] {
                p[j] = i;
            }
        }
    }

    edges.sort_unstable_by(|a, b| b.0.cmp(&a.0));
    let mut dsu: Vec<usize> = (0..=n).collect();
    let mut sz = vec![1i64; n + 1];
    let mut total = 0i64;
    for &(w, u, v) in &edges {
        let a = find(&mut dsu, u);
        let b = find(&mut dsu, v);
        total += w * sz[a] * sz[b];
        dsu[b] = a;
        sz[a] += sz[b];
    }

    println!("{total}");
}
`,
    java21: `import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class Main {
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

    static class Edge {
        int to, rev;
        long cap, orig;

        Edge(int to, int rev, long cap) {
            this.to = to;
            this.rev = rev;
            this.cap = cap;
            this.orig = cap;
        }
    }

    static class Dinic {
        final int n;
        final List<Edge>[] adj;
        final int[] level, ptr;
        final ArrayDeque<Integer> q = new ArrayDeque<>();

        @SuppressWarnings("unchecked")
        Dinic(int n) {
            this.n = n;
            adj = new ArrayList[n + 1];
            for (int i = 1; i <= n; i++) adj[i] = new ArrayList<>();
            level = new int[n + 1];
            ptr = new int[n + 1];
        }

        void addUndirectedEdge(int u, int v, long cap) {
            Edge a = new Edge(v, adj[v].size(), cap);
            Edge b = new Edge(u, adj[u].size(), cap);
            adj[u].add(a);
            adj[v].add(b);
        }

        void reset() {
            for (int u = 1; u <= n; u++) {
                for (Edge e : adj[u]) e.cap = e.orig;
            }
        }

        boolean bfs(int s, int t) {
            Arrays.fill(level, -1);
            level[s] = 0;
            q.clear();
            q.add(s);
            while (!q.isEmpty()) {
                int u = q.poll();
                for (Edge e : adj[u]) {
                    if (e.cap > 0 && level[e.to] == -1) {
                        level[e.to] = level[u] + 1;
                        q.add(e.to);
                    }
                }
            }
            return level[t] != -1;
        }

        long dfs(int u, int t, long pushed) {
            if (pushed == 0 || u == t) return pushed;
            for (; ptr[u] < adj[u].size(); ptr[u]++) {
                Edge e = adj[u].get(ptr[u]);
                if (e.cap == 0 || level[e.to] != level[u] + 1) continue;
                long tr = dfs(e.to, t, Math.min(pushed, e.cap));
                if (tr == 0) continue;
                e.cap -= tr;
                adj[e.to].get(e.rev).cap += tr;
                return tr;
            }
            return 0;
        }

        long maxFlow(int s, int t) {
            reset();
            long flow = 0;
            while (bfs(s, t)) {
                Arrays.fill(ptr, 0);
                long pushed;
                while ((pushed = dfs(s, t, 1L << 60)) > 0) flow += pushed;
            }
            return flow;
        }
    }

    static int find(int[] dsu, int x) {
        return dsu[x] == x ? x : (dsu[x] = find(dsu, dsu[x]));
    }

    public static void main(String[] args) throws IOException {
        FastScanner fs = new FastScanner(System.in);
        long nLong = fs.nextLong();
        if (nLong == Long.MIN_VALUE) return;
        int n = (int) nLong;
        int m = fs.nextInt();

        Dinic dinic = new Dinic(n);
        for (int i = 0; i < m; i++) {
            int u = fs.nextInt(), v = fs.nextInt();
            long w = fs.nextLong();
            if (u != v && w > 0) dinic.addUndirectedEdge(u, v, w);
        }

        int[] p = new int[n + 1];
        Arrays.fill(p, 1);
        long[][] edges = new long[Math.max(0, n - 1)][3];
        for (int i = 2; i <= n; i++) {
            long cutVal = dinic.maxFlow(i, p[i]);
            edges[i - 2] = new long[]{cutVal, i, p[i]};
            for (int j = i + 1; j <= n; j++) {
                if (dinic.level[j] != -1 && p[j] == p[i]) p[j] = i;
            }
        }

        Arrays.sort(edges, (a, b) -> Long.compare(b[0], a[0]));
        int[] dsu = new int[n + 1];
        long[] sz = new long[n + 1];
        for (int i = 1; i <= n; i++) {
            dsu[i] = i;
            sz[i] = 1;
        }
        long total = 0;
        for (long[] e : edges) {
            int a = find(dsu, (int) e[1]);
            int b = find(dsu, (int) e[2]);
            total += e[0] * sz[a] * sz[b];
            dsu[b] = a;
            sz[a] += sz[b];
        }
        System.out.println(total);
    }
}
`,
    python3: `from collections import deque
import sys

sys.setrecursionlimit(200000)


class Dinic:
    def __init__(self, n: int) -> None:
        self.n = n
        self.adj: list[list[list[int]]] = [[] for _ in range(n + 1)]
        self.level = [-1] * (n + 1)
        self.ptr = [0] * (n + 1)

    def add_undirected_edge(self, u: int, v: int, cap: int) -> None:
        a = [v, len(self.adj[v]), cap, cap]
        b = [u, len(self.adj[u]), cap, cap]
        self.adj[u].append(a)
        self.adj[v].append(b)

    def reset(self) -> None:
        for u in range(1, self.n + 1):
            for e in self.adj[u]:
                e[2] = e[3]

    def bfs(self, s: int, t: int) -> bool:
        self.level = [-1] * (self.n + 1)
        self.level[s] = 0
        q = deque([s])
        while q:
            u = q.popleft()
            for to, _, cap, _ in self.adj[u]:
                if cap > 0 and self.level[to] == -1:
                    self.level[to] = self.level[u] + 1
                    q.append(to)
        return self.level[t] != -1

    def dfs(self, u: int, t: int, pushed: int) -> int:
        if pushed == 0 or u == t:
            return pushed
        edges = self.adj[u]
        while self.ptr[u] < len(edges):
            e = edges[self.ptr[u]]
            self.ptr[u] += 1
            to, rev, cap, _ = e
            if cap == 0 or self.level[to] != self.level[u] + 1:
                continue
            tr = self.dfs(to, t, min(pushed, cap))
            if tr == 0:
                continue
            e[2] -= tr
            self.adj[to][rev][2] += tr
            return tr
        return 0

    def max_flow(self, s: int, t: int) -> int:
        self.reset()
        flow = 0
        inf = 1 << 60
        while self.bfs(s, t):
            self.ptr = [0] * (self.n + 1)
            while True:
                pushed = self.dfs(s, t, inf)
                if pushed == 0:
                    break
                flow += pushed
        return flow


def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    n = int(next(it))
    m = int(next(it))
    dinic = Dinic(n)
    for _ in range(m):
        u = int(next(it))
        v = int(next(it))
        w = int(next(it))
        if u != v and w > 0:
            dinic.add_undirected_edge(u, v, w)

    p = [1] * (n + 1)
    edges: list[tuple[int, int, int]] = []
    for i in range(2, n + 1):
        cut_val = dinic.max_flow(i, p[i])
        edges.append((cut_val, i, p[i]))
        for j in range(i + 1, n + 1):
            if dinic.level[j] != -1 and p[j] == p[i]:
                p[j] = i

    edges.sort(reverse=True)
    dsu = list(range(n + 1))
    sz = [1] * (n + 1)

    def find(x: int) -> int:
        while dsu[x] != x:
            dsu[x] = dsu[dsu[x]]
            x = dsu[x]
        return x

    total = 0
    for w, u, v in edges:
        a = find(u)
        b = find(v)
        total += w * sz[a] * sz[b]
        dsu[b] = a
        sz[a] += sz[b]

    print(total)


if __name__ == "__main__":
    solve()
`,
    ruby: `class Dinic
  attr_reader :level

  def initialize(n)
    @n = n
    @adj = Array.new(n + 1) { [] }
    @level = Array.new(n + 1, -1)
    @ptr = Array.new(n + 1, 0)
  end

  def add_undirected_edge(u, v, cap)
    a = [v, @adj[v].length, cap, cap]
    b = [u, @adj[u].length, cap, cap]
    @adj[u] << a
    @adj[v] << b
  end

  def reset
    (1..@n).each do |u|
      @adj[u].each { |e| e[2] = e[3] }
    end
  end

  def bfs(s, t)
    @level.fill(-1)
    @level[s] = 0
    q = [s]
    head = 0
    while head < q.length
      u = q[head]
      head += 1
      @adj[u].each do |to, _, cap, _|
        if cap > 0 && @level[to] == -1
          @level[to] = @level[u] + 1
          q << to
        end
      end
    end
    @level[t] != -1
  end

  def dfs(u, t, pushed)
    return pushed if pushed == 0 || u == t

    edges = @adj[u]
    while @ptr[u] < edges.length
      e = edges[@ptr[u]]
      @ptr[u] += 1
      to, rev, cap, = e
      next if cap == 0 || @level[to] != @level[u] + 1

      tr = dfs(to, t, [pushed, cap].min)
      next if tr == 0

      e[2] -= tr
      @adj[to][rev][2] += tr
      return tr
    end
    0
  end

  def max_flow(s, t)
    reset
    flow = 0
    inf = 1 << 60
    while bfs(s, t)
      @ptr.fill(0)
      loop do
        pushed = dfs(s, t, inf)
        break if pushed == 0

        flow += pushed
      end
    end
    flow
  end
end

data = $stdin.read.split
exit if data.empty?
idx = 0
n = data[idx].to_i; idx += 1
m = data[idx].to_i; idx += 1

dinic = Dinic.new(n)
m.times do
  u = data[idx].to_i; idx += 1
  v = data[idx].to_i; idx += 1
  w = data[idx].to_i; idx += 1
  dinic.add_undirected_edge(u, v, w) if u != v && w > 0
end

p_arr = Array.new(n + 1, 1)
edges = []
(2..n).each do |i|
  cut_val = dinic.max_flow(i, p_arr[i])
  edges << [cut_val, i, p_arr[i]]
  ((i + 1)..n).each do |j|
    p_arr[j] = i if dinic.level[j] != -1 && p_arr[j] == p_arr[i]
  end
end

edges.sort! { |a, b| b[0] <=> a[0] }
dsu = (0..n).to_a
sz = Array.new(n + 1, 1)

find = lambda do |x|
  while dsu[x] != x
    dsu[x] = dsu[dsu[x]]
    x = dsu[x]
  end
  x
end

total = 0
edges.each do |w, u, v|
  a = find.call(u)
  b = find.call(v)
  total += w * sz[a] * sz[b]
  dsu[b] = a
  sz[a] += sz[b]
end

puts total
`,
  },
  practiceProblems: [
    {
      id: 'ch71-p1',
      tier: 'Warmup',
      ratingRange: '2400–2650',
      title: 'Global Minimum Cut via Stoer-Wagner Algorithm',
      statement:
        'Given an undirected weighted graph with N vertices (1..N) and M edges (parallel edges possible), find the minimum total capacity of edges whose removal disconnects the graph into two non-empty components.',
      constraints: '2 <= N <= 500; 0 <= M <= N * (N - 1); 1 <= w <= 10^9',
      sampleInput: `4 5
1 2 2
1 3 3
2 3 1
2 4 4
3 4 2`,
      sampleOutput: `5`,
      hints: [
        'Stoer-Wagner runs N - 1 Maximum Adjacency Search (MAS) phases on an adjacency matrix.',
        'In each phase, greedily add the vertex maximizing total edge weight to the already-picked set; the very last vertex t added defines a valid s-t min-cut of capacity w[t] separating {t} from the rest of the contracted graph.',
        'Record min(ans, w[t]), merge vertex t into the second-to-last vertex s (summing edge weights to all other active nodes), and remove t.',
      ],
      solutions: {
        cpp20: `#include <algorithm>
#include <iostream>
#include <vector>

using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, m;
    if (!(cin >> n >> m)) return 0;

    vector<vector<long long>> adj(n, vector<long long>(n, 0));
    for (int i = 0; i < m; ++i) {
        int u, v;
        long long w;
        cin >> u >> v >> w;
        --u;
        --v;
        if (u != v) {
            adj[u][v] += w;
            adj[v][u] += w;
        }
    }

    vector<int> nodes(n);
    for (int i = 0; i < n; ++i) nodes[i] = i;

    long long best = (1LL << 60);
    while (nodes.size() > 1) {
        int k = static_cast<int>(nodes.size());
        vector<long long> w(k, 0);
        vector<bool> used(k, false);
        int prev = -1, last = -1;

        for (int step = 0; step < k; ++step) {
            int sel = -1;
            for (int i = 0; i < k; ++i) {
                if (!used[i] && (sel == -1 || w[i] > w[sel])) sel = i;
            }
            used[sel] = true;
            prev = last;
            last = sel;
            for (int i = 0; i < k; ++i) {
                if (!used[i]) w[i] += adj[nodes[sel]][nodes[i]];
            }
        }

        best = min(best, w[last]);
        int s = nodes[prev], t = nodes[last];
        for (int i = 0; i < k; ++i) {
            if (i != last && i != prev) {
                int v = nodes[i];
                adj[s][v] += adj[t][v];
                adj[v][s] = adj[s][v];
            }
        }
        nodes.erase(nodes.begin() + last);
    }

    cout << best << "\\n";
    return 0;
}
`,
        rust: `use std::io::{self, Read};

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let n: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };
    let m: usize = it.next().unwrap().parse().unwrap();

    let mut adj = vec![vec![0i64; n]; n];
    for _ in 0..m {
        let u = it.next().unwrap().parse::<usize>().unwrap() - 1;
        let v = it.next().unwrap().parse::<usize>().unwrap() - 1;
        let w: i64 = it.next().unwrap().parse().unwrap();
        if u != v {
            adj[u][v] += w;
            adj[v][u] += w;
        }
    }

    let mut nodes: Vec<usize> = (0..n).collect();
    let mut best = 1i64 << 60;
    while nodes.len() > 1 {
        let k = nodes.len();
        let mut w = vec![0i64; k];
        let mut used = vec![false; k];
        let mut prev = 0usize;
        let mut last = 0usize;

        for _ in 0..k {
            let mut sel = usize::MAX;
            for i in 0..k {
                if !used[i] && (sel == usize::MAX || w[i] > w[sel]) {
                    sel = i;
                }
            }
            used[sel] = true;
            prev = last;
            last = sel;
            for i in 0..k {
                if !used[i] {
                    w[i] += adj[nodes[sel]][nodes[i]];
                }
            }
        }

        best = best.min(w[last]);
        let s = nodes[prev];
        let t = nodes[last];
        for i in 0..k {
            if i != last && i != prev {
                let v = nodes[i];
                adj[s][v] += adj[t][v];
                adj[v][s] = adj[s][v];
            }
        }
        nodes.remove(last);
    }

    println!("{best}");
}
`,
        java21: `import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

public class Main {
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

    public static void main(String[] args) throws IOException {
        FastScanner fs = new FastScanner(System.in);
        long nLong = fs.nextLong();
        if (nLong == Long.MIN_VALUE) return;
        int n = (int) nLong;
        int m = fs.nextInt();

        long[][] adj = new long[n][n];
        for (int i = 0; i < m; i++) {
            int u = fs.nextInt() - 1, v = fs.nextInt() - 1;
            long w = fs.nextLong();
            if (u != v) {
                adj[u][v] += w;
                adj[v][u] += w;
            }
        }

        List<Integer> nodes = new ArrayList<>();
        for (int i = 0; i < n; i++) nodes.add(i);

        long best = 1L << 60;
        while (nodes.size() > 1) {
            int k = nodes.size();
            long[] w = new long[k];
            boolean[] used = new boolean[k];
            int prev = -1, last = -1;

            for (int step = 0; step < k; step++) {
                int sel = -1;
                for (int i = 0; i < k; i++) {
                    if (!used[i] && (sel == -1 || w[i] > w[sel])) sel = i;
                }
                used[sel] = true;
                prev = last;
                last = sel;
                for (int i = 0; i < k; i++) {
                    if (!used[i]) w[i] += adj[nodes.get(sel)][nodes.get(i)];
                }
            }

            best = Math.min(best, w[last]);
            int s = nodes.get(prev), t = nodes.get(last);
            for (int i = 0; i < k; i++) {
                if (i != last && i != prev) {
                    int v = nodes.get(i);
                    adj[s][v] += adj[t][v];
                    adj[v][s] = adj[s][v];
                }
            }
            nodes.remove(last);
        }

        System.out.println(best);
    }
}
`,
        python3: `import sys


def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    n = int(next(it))
    m = int(next(it))
    adj = [[0] * n for _ in range(n)]
    for _ in range(m):
        u = int(next(it)) - 1
        v = int(next(it)) - 1
        w = int(next(it))
        if u != v:
            adj[u][v] += w
            adj[v][u] += w

    nodes = list(range(n))
    best = 1 << 60
    while len(nodes) > 1:
        k = len(nodes)
        w = [0] * k
        used = [False] * k
        prev = -1
        last = -1
        for _ in range(k):
            sel = -1
            for i in range(k):
                if not used[i] and (sel == -1 or w[i] > w[sel]):
                    sel = i
            used[sel] = True
            prev = last
            last = sel
            row = adj[nodes[sel]]
            for i in range(k):
                if not used[i]:
                    w[i] += row[nodes[i]]

        if w[last] < best:
            best = w[last]
        s = nodes[prev]
        t = nodes[last]
        for i in range(k):
            if i != last and i != prev:
                v = nodes[i]
                adj[s][v] += adj[t][v]
                adj[v][s] = adj[s][v]
        nodes.pop(last)

    print(best)


if __name__ == "__main__":
    solve()
`,
        ruby: `data = $stdin.read.split
exit if data.empty?
idx = 0
n = data[idx].to_i; idx += 1
m = data[idx].to_i; idx += 1

adj = Array.new(n) { Array.new(n, 0) }
m.times do
  u = data[idx].to_i - 1; idx += 1
  v = data[idx].to_i - 1; idx += 1
  w = data[idx].to_i; idx += 1
  if u != v
    adj[u][v] += w
    adj[v][u] += w
  end
end

nodes = (0...n).to_a
best = 1 << 60
while nodes.length > 1
  k = nodes.length
  w = Array.new(k, 0)
  used = Array.new(k, false)
  prev = -1
  last = -1
  k.times do
    sel = -1
    k.times do |i|
      sel = i if !used[i] && (sel == -1 || w[i] > w[sel])
    end
    used[sel] = true
    prev = last
    last = sel
    row = adj[nodes[sel]]
    k.times do |i|
      w[i] += row[nodes[i]] unless used[i]
    end
  end

  best = w[last] if w[last] < best
  s = nodes[prev]
  t = nodes[last]
  k.times do |i|
    next if i == last || i == prev

    v = nodes[i]
    adj[s][v] += adj[t][v]
    adj[v][s] = adj[s][v]
  end
  nodes.delete_at(last)
end

puts best
`,
      },
    },
    {
      id: 'ch71-p2',
      tier: 'Standard',
      ratingRange: '2500–2750',
      title: 'Sum of All-Pairs Minimum Cuts via Gusfield’s Gomory-Hu Tree',
      statement:
        'Given an undirected weighted graph with N vertices (1..N) and M edges, compute the sum of mincut(u, v) over all unordered pairs 1 <= u < v <= N.',
      constraints: '2 <= N <= 500; 0 <= M <= 3000; 1 <= w <= 10^6',
      sampleInput: `4 5
1 2 2
1 3 3
2 3 1
2 4 4
3 4 2`,
      sampleOutput: `31`,
      hints: [
        'Run Gusfield’s algorithm: initialize p[2..N] = 1, and for i = 2..N compute Dinic max-flow between i and p[i] on a fresh copy of the original graph.',
        'Add tree edge (i, p[i], flow), then update p[j] = i for every j > i that is reachable from i in the final residual graph and had p[j] == p[i].',
        'Sort the N - 1 Gomory-Hu tree edges in descending order of weight and merge components with DSU; each merge adds w * size(A) * size(B) to the all-pairs sum.',
      ],
      solutions: {
        cpp20: `#include <algorithm>
#include <iostream>
#include <queue>
#include <vector>

using namespace std;

struct Dinic {
    struct Edge {
        int to, rev;
        long long cap, orig;
    };
    int n;
    vector<vector<Edge>> adj;
    vector<int> level, ptr;

    explicit Dinic(int n) : n(n), adj(n + 1), level(n + 1), ptr(n + 1) {}

    void addUndirectedEdge(int u, int v, long long cap) {
        adj[u].push_back({v, static_cast<int>(adj[v].size()), cap, cap});
        adj[v].push_back({u, static_cast<int>(adj[u].size()) - 1, cap, cap});
    }

    void reset() {
        for (int u = 1; u <= n; ++u)
            for (auto& e : adj[u]) e.cap = e.orig;
    }

    bool bfs(int s, int t) {
        fill(level.begin(), level.end(), -1);
        level[s] = 0;
        queue<int> q;
        q.push(s);
        while (!q.empty()) {
            int u = q.front();
            q.pop();
            for (const auto& e : adj[u]) {
                if (e.cap > 0 && level[e.to] == -1) {
                    level[e.to] = level[u] + 1;
                    q.push(e.to);
                }
            }
        }
        return level[t] != -1;
    }

    long long dfs(int u, int t, long long pushed) {
        if (pushed == 0 || u == t) return pushed;
        for (int& cid = ptr[u]; cid < static_cast<int>(adj[u].size()); ++cid) {
            auto& e = adj[u][cid];
            if (e.cap == 0 || level[e.to] != level[u] + 1) continue;
            long long tr = dfs(e.to, t, min(pushed, e.cap));
            if (tr == 0) continue;
            e.cap -= tr;
            adj[e.to][e.rev].cap += tr;
            return tr;
        }
        return 0;
    }

    long long maxFlow(int s, int t) {
        reset();
        long long flow = 0;
        while (bfs(s, t)) {
            fill(ptr.begin(), ptr.end(), 0);
            while (long long pushed = dfs(s, t, 1LL << 60)) flow += pushed;
        }
        return flow;
    }
};

struct TreeEdge {
    int u, v;
    long long w;
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, m;
    if (!(cin >> n >> m)) return 0;

    Dinic dinic(n);
    for (int i = 0; i < m; ++i) {
        int u, v;
        long long w;
        cin >> u >> v >> w;
        if (u != v && w > 0) dinic.addUndirectedEdge(u, v, w);
    }

    vector<int> p(n + 1, 1);
    vector<TreeEdge> edges;
    for (int i = 2; i <= n; ++i) {
        long long f = dinic.maxFlow(i, p[i]);
        edges.push_back({i, p[i], f});
        for (int j = i + 1; j <= n; ++j) {
            if (dinic.level[j] != -1 && p[j] == p[i]) p[j] = i;
        }
    }

    sort(edges.begin(), edges.end(), [](const TreeEdge& a, const TreeEdge& b) {
        return a.w > b.w;
    });

    vector<int> dsu(n + 1);
    vector<long long> sz(n + 1, 1);
    for (int i = 1; i <= n; ++i) dsu[i] = i;
    auto find = [&](auto& self, int x) -> int {
        return dsu[x] == x ? x : dsu[x] = self(self, dsu[x]);
    };

    long long ans = 0;
    for (const auto& e : edges) {
        int a = find(find, e.u), b = find(find, e.v);
        ans += e.w * sz[a] * sz[b];
        dsu[b] = a;
        sz[a] += sz[b];
    }

    cout << ans << "\\n";
    return 0;
}
`,
        rust: `use std::collections::VecDeque;
use std::io::{self, Read};

#[derive(Clone)]
struct Edge {
    to: usize,
    rev: usize,
    cap: i64,
    orig: i64,
}

struct Dinic {
    n: usize,
    adj: Vec<Vec<Edge>>,
    level: Vec<i32>,
    ptr: Vec<usize>,
}

impl Dinic {
    fn new(n: usize) -> Self {
        Self {
            n,
            adj: vec![Vec::new(); n + 1],
            level: vec![-1; n + 1],
            ptr: vec![0; n + 1],
        }
    }

    fn add_undirected(&mut self, u: usize, v: usize, cap: i64) {
        let ru = self.adj[v].len();
        let rv = self.adj[u].len();
        self.adj[u].push(Edge { to: v, rev: ru, cap, orig: cap });
        self.adj[v].push(Edge { to: u, rev: rv, cap, orig: cap });
    }

    fn reset(&mut self) {
        for u in 1..=self.n {
            for e in &mut self.adj[u] {
                e.cap = e.orig;
            }
        }
    }

    fn bfs(&mut self, s: usize, t: usize) -> bool {
        self.level.fill(-1);
        self.level[s] = 0;
        let mut q = VecDeque::new();
        q.push_back(s);
        while let Some(u) = q.pop_front() {
            for e in &self.adj[u] {
                if e.cap > 0 && self.level[e.to] == -1 {
                    self.level[e.to] = self.level[u] + 1;
                    q.push_back(e.to);
                }
            }
        }
        self.level[t] != -1
    }

    fn dfs(&mut self, u: usize, t: usize, pushed: i64) -> i64 {
        if pushed == 0 || u == t {
            return pushed;
        }
        while self.ptr[u] < self.adj[u].len() {
            let i = self.ptr[u];
            self.ptr[u] += 1;
            let to = self.adj[u][i].to;
            let cap = self.adj[u][i].cap;
            if cap == 0 || self.level[to] != self.level[u] + 1 {
                continue;
            }
            let tr = self.dfs(to, t, pushed.min(cap));
            if tr == 0 {
                continue;
            }
            self.adj[u][i].cap -= tr;
            let rev = self.adj[u][i].rev;
            self.adj[to][rev].cap += tr;
            return tr;
        }
        0
    }

    fn max_flow(&mut self, s: usize, t: usize) -> i64 {
        self.reset();
        let mut flow = 0;
        while self.bfs(s, t) {
            self.ptr.fill(0);
            loop {
                let p = self.dfs(s, t, 1i64 << 60);
                if p == 0 {
                    break;
                }
                flow += p;
            }
        }
        flow
    }
}

fn find(dsu: &mut [usize], mut x: usize) -> usize {
    while dsu[x] != x {
        dsu[x] = dsu[dsu[x]];
        x = dsu[x];
    }
    x
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

    let mut dinic = Dinic::new(n);
    for _ in 0..m {
        let u: usize = it.next().unwrap().parse().unwrap();
        let v: usize = it.next().unwrap().parse().unwrap();
        let w: i64 = it.next().unwrap().parse().unwrap();
        if u != v && w > 0 {
            dinic.add_undirected(u, v, w);
        }
    }

    let mut p = vec![1usize; n + 1];
    let mut edges = Vec::with_capacity(n);
    for i in 2..=n {
        let f = dinic.max_flow(i, p[i]);
        edges.push((f, i, p[i]));
        for j in (i + 1)..=n {
            if dinic.level[j] != -1 && p[j] == p[i] {
                p[j] = i;
            }
        }
    }

    edges.sort_unstable_by(|a, b| b.0.cmp(&a.0));
    let mut dsu: Vec<usize> = (0..=n).collect();
    let mut sz = vec![1i64; n + 1];
    let mut ans = 0i64;
    for &(w, u, v) in &edges {
        let a = find(&mut dsu, u);
        let b = find(&mut dsu, v);
        ans += w * sz[a] * sz[b];
        dsu[b] = a;
        sz[a] += sz[b];
    }
    println!("{ans}");
}
`,
        java21: `import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class Main {
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

    static class Edge {
        int to, rev;
        long cap, orig;

        Edge(int to, int rev, long cap) {
            this.to = to;
            this.rev = rev;
            this.cap = cap;
            this.orig = cap;
        }
    }

    static class Dinic {
        final int n;
        final List<Edge>[] adj;
        final int[] level, ptr;
        final ArrayDeque<Integer> q = new ArrayDeque<>();

        @SuppressWarnings("unchecked")
        Dinic(int n) {
            this.n = n;
            adj = new ArrayList[n + 1];
            for (int i = 1; i <= n; i++) adj[i] = new ArrayList<>();
            level = new int[n + 1];
            ptr = new int[n + 1];
        }

        void addUndirected(int u, int v, long cap) {
            adj[u].add(new Edge(v, adj[v].size(), cap));
            adj[v].add(new Edge(u, adj[u].size() - 1, cap));
        }

        void reset() {
            for (int u = 1; u <= n; u++) for (Edge e : adj[u]) e.cap = e.orig;
        }

        boolean bfs(int s, int t) {
            Arrays.fill(level, -1);
            level[s] = 0;
            q.clear();
            q.add(s);
            while (!q.isEmpty()) {
                int u = q.poll();
                for (Edge e : adj[u]) {
                    if (e.cap > 0 && level[e.to] == -1) {
                        level[e.to] = level[u] + 1;
                        q.add(e.to);
                    }
                }
            }
            return level[t] != -1;
        }

        long dfs(int u, int t, long pushed) {
            if (pushed == 0 || u == t) return pushed;
            for (; ptr[u] < adj[u].size(); ptr[u]++) {
                Edge e = adj[u].get(ptr[u]);
                if (e.cap == 0 || level[e.to] != level[u] + 1) continue;
                long tr = dfs(e.to, t, Math.min(pushed, e.cap));
                if (tr == 0) continue;
                e.cap -= tr;
                adj[e.to].get(e.rev).cap += tr;
                return tr;
            }
            return 0;
        }

        long maxFlow(int s, int t) {
            reset();
            long flow = 0;
            while (bfs(s, t)) {
                Arrays.fill(ptr, 0);
                long tr;
                while ((tr = dfs(s, t, 1L << 60)) > 0) flow += tr;
            }
            return flow;
        }
    }

    static int find(int[] dsu, int x) {
        return dsu[x] == x ? x : (dsu[x] = find(dsu, dsu[x]));
    }

    public static void main(String[] args) throws IOException {
        FastScanner fs = new FastScanner(System.in);
        long nLong = fs.nextLong();
        if (nLong == Long.MIN_VALUE) return;
        int n = (int) nLong, m = fs.nextInt();

        Dinic dinic = new Dinic(n);
        for (int i = 0; i < m; i++) {
            int u = fs.nextInt(), v = fs.nextInt();
            long w = fs.nextLong();
            if (u != v && w > 0) dinic.addUndirected(u, v, w);
        }

        int[] p = new int[n + 1];
        Arrays.fill(p, 1);
        long[][] edges = new long[Math.max(0, n - 1)][3];
        for (int i = 2; i <= n; i++) {
            long f = dinic.maxFlow(i, p[i]);
            edges[i - 2] = new long[]{f, i, p[i]};
            for (int j = i + 1; j <= n; j++) {
                if (dinic.level[j] != -1 && p[j] == p[i]) p[j] = i;
            }
        }

        Arrays.sort(edges, (a, b) -> Long.compare(b[0], a[0]));
        int[] dsu = new int[n + 1];
        long[] sz = new long[n + 1];
        for (int i = 1; i <= n; i++) {
            dsu[i] = i;
            sz[i] = 1;
        }
        long ans = 0;
        for (long[] e : edges) {
            int a = find(dsu, (int) e[1]), b = find(dsu, (int) e[2]);
            ans += e[0] * sz[a] * sz[b];
            dsu[b] = a;
            sz[a] += sz[b];
        }
        System.out.println(ans);
    }
}
`,
        python3: `from collections import deque
import sys

sys.setrecursionlimit(200000)


class Dinic:
    def __init__(self, n: int) -> None:
        self.n = n
        self.adj: list[list[list[int]]] = [[] for _ in range(n + 1)]
        self.level = [-1] * (n + 1)
        self.ptr = [0] * (n + 1)

    def add_undirected(self, u: int, v: int, cap: int) -> None:
        self.adj[u].append([v, len(self.adj[v]), cap, cap])
        self.adj[v].append([u, len(self.adj[u]) - 1, cap, cap])

    def reset(self) -> None:
        for u in range(1, self.n + 1):
            for e in self.adj[u]:
                e[2] = e[3]

    def bfs(self, s: int, t: int) -> bool:
        self.level = [-1] * (self.n + 1)
        self.level[s] = 0
        q = deque([s])
        while q:
            u = q.popleft()
            for to, _, cap, _ in self.adj[u]:
                if cap > 0 and self.level[to] == -1:
                    self.level[to] = self.level[u] + 1
                    q.append(to)
        return self.level[t] != -1

    def dfs(self, u: int, t: int, pushed: int) -> int:
        if pushed == 0 or u == t:
            return pushed
        edges = self.adj[u]
        while self.ptr[u] < len(edges):
            e = edges[self.ptr[u]]
            self.ptr[u] += 1
            to, rev, cap, _ = e
            if cap == 0 or self.level[to] != self.level[u] + 1:
                continue
            tr = self.dfs(to, t, min(pushed, cap))
            if tr == 0:
                continue
            e[2] -= tr
            self.adj[to][rev][2] += tr
            return tr
        return 0

    def max_flow(self, s: int, t: int) -> int:
        self.reset()
        flow = 0
        inf = 1 << 60
        while self.bfs(s, t):
            self.ptr = [0] * (self.n + 1)
            while True:
                tr = self.dfs(s, t, inf)
                if tr == 0:
                    break
                flow += tr
        return flow


def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    n = int(next(it))
    m = int(next(it))
    dinic = Dinic(n)
    for _ in range(m):
        u = int(next(it))
        v = int(next(it))
        w = int(next(it))
        if u != v and w > 0:
            dinic.add_undirected(u, v, w)

    p = [1] * (n + 1)
    edges: list[tuple[int, int, int]] = []
    for i in range(2, n + 1):
        f = dinic.max_flow(i, p[i])
        edges.append((f, i, p[i]))
        for j in range(i + 1, n + 1):
            if dinic.level[j] != -1 and p[j] == p[i]:
                p[j] = i

    edges.sort(reverse=True)
    dsu = list(range(n + 1))
    sz = [1] * (n + 1)

    def find(x: int) -> int:
        while dsu[x] != x:
            dsu[x] = dsu[dsu[x]]
            x = dsu[x]
        return x

    ans = 0
    for w, u, v in edges:
        a = find(u)
        b = find(v)
        ans += w * sz[a] * sz[b]
        dsu[b] = a
        sz[a] += sz[b]
    print(ans)


if __name__ == "__main__":
    solve()
`,
        ruby: `class Dinic
  attr_reader :level

  def initialize(n)
    @n = n
    @adj = Array.new(n + 1) { [] }
    @level = Array.new(n + 1, -1)
    @ptr = Array.new(n + 1, 0)
  end

  def add_undirected(u, v, cap)
    @adj[u] << [v, @adj[v].length, cap, cap]
    @adj[v] << [u, @adj[u].length - 1, cap, cap]
  end

  def reset
    (1..@n).each { |u| @adj[u].each { |e| e[2] = e[3] } }
  end

  def bfs(s, t)
    @level.fill(-1)
    @level[s] = 0
    q = [s]
    head = 0
    while head < q.length
      u = q[head]; head += 1
      @adj[u].each do |to, _, cap, _|
        if cap > 0 && @level[to] == -1
          @level[to] = @level[u] + 1
          q << to
        end
      end
    end
    @level[t] != -1
  end

  def dfs(u, t, pushed)
    return pushed if pushed == 0 || u == t

    edges = @adj[u]
    while @ptr[u] < edges.length
      e = edges[@ptr[u]]
      @ptr[u] += 1
      to, rev, cap, = e
      next if cap == 0 || @level[to] != @level[u] + 1

      tr = dfs(to, t, [pushed, cap].min)
      next if tr == 0

      e[2] -= tr
      @adj[to][rev][2] += tr
      return tr
    end
    0
  end

  def max_flow(s, t)
    reset
    flow = 0
    inf = 1 << 60
    while bfs(s, t)
      @ptr.fill(0)
      loop do
        tr = dfs(s, t, inf)
        break if tr == 0

        flow += tr
      end
    end
    flow
  end
end

data = $stdin.read.split
exit if data.empty?
idx = 0
n = data[idx].to_i; idx += 1
m = data[idx].to_i; idx += 1

dinic = Dinic.new(n)
m.times do
  u = data[idx].to_i; idx += 1
  v = data[idx].to_i; idx += 1
  w = data[idx].to_i; idx += 1
  dinic.add_undirected(u, v, w) if u != v && w > 0
end

p_arr = Array.new(n + 1, 1)
edges = []
(2..n).each do |i|
  f = dinic.max_flow(i, p_arr[i])
  edges << [f, i, p_arr[i]]
  ((i + 1)..n).each do |j|
    p_arr[j] = i if dinic.level[j] != -1 && p_arr[j] == p_arr[i]
  end
end

edges.sort! { |a, b| b[0] <=> a[0] }
dsu = (0..n).to_a
sz = Array.new(n + 1, 1)

find = lambda do |x|
  while dsu[x] != x
    dsu[x] = dsu[dsu[x]]
    x = dsu[x]
  end
  x
end

ans = 0
edges.each do |w, u, v|
  a = find.call(u)
  b = find.call(v)
  ans += w * sz[a] * sz[b]
  dsu[b] = a
  sz[a] += sz[b]
end

puts ans
`,
      },
    },
    {
      id: 'ch71-p3',
      tier: 'Boss',
      ratingRange: '2700–3050',
      title: 'Gomory-Hu Path Min-Cut & K-Edge-Connected Component Queries',
      statement:
        'Given an undirected weighted graph with N vertices (1..N) and M edges, answer Q queries of two types: (1 u v) output the exact minimum s-t cut separating distinct vertices u and v; (2 K) output the number of K-edge-connected components (connected components of vertices whose pairwise min-cut is at least K).',
      constraints: '2 <= N <= 400; 0 <= M <= 2500; 1 <= Q <= 2 * 10^5; 1 <= w, K <= 10^9',
      sampleInput: `4 5 5
1 2 2
1 3 3
2 3 1
2 4 4
3 4 2
1 2 4
1 1 3
2 5
2 6
2 7`,
      sampleOutput: `6
5
1
3
4`,
      hints: [
        'Construct the Gomory-Hu cut tree ONCE using Gusfield’s N - 1 Dinic runs.',
        'For Type 1 (u, v) queries, preprocess binary lifting (up[u][k] and minEdge[u][k]) on the Gomory-Hu tree so each path bottleneck query answers in O(log N).',
        'For Type 2 (K) queries, two vertices share a K-edge-connected component iff their Gomory-Hu path bottleneck >= K! Thus the component count is simply N minus the count of Gomory-Hu tree edges with weight >= K (found via binary search in O(log N)).',
      ],
      solutions: {
        cpp20: `#include <algorithm>
#include <iostream>
#include <queue>
#include <vector>

using namespace std;

struct Dinic {
    struct Edge {
        int to, rev;
        long long cap, orig;
    };
    int n;
    vector<vector<Edge>> adj;
    vector<int> level, ptr;

    explicit Dinic(int n) : n(n), adj(n + 1), level(n + 1), ptr(n + 1) {}

    void addUndirected(int u, int v, long long cap) {
        adj[u].push_back({v, static_cast<int>(adj[v].size()), cap, cap});
        adj[v].push_back({u, static_cast<int>(adj[u].size()) - 1, cap, cap});
    }

    void reset() {
        for (int u = 1; u <= n; ++u)
            for (auto& e : adj[u]) e.cap = e.orig;
    }

    bool bfs(int s, int t) {
        fill(level.begin(), level.end(), -1);
        level[s] = 0;
        queue<int> q;
        q.push(s);
        while (!q.empty()) {
            int u = q.front();
            q.pop();
            for (const auto& e : adj[u]) {
                if (e.cap > 0 && level[e.to] == -1) {
                    level[e.to] = level[u] + 1;
                    q.push(e.to);
                }
            }
        }
        return level[t] != -1;
    }

    long long dfs(int u, int t, long long pushed) {
        if (pushed == 0 || u == t) return pushed;
        for (int& cid = ptr[u]; cid < static_cast<int>(adj[u].size()); ++cid) {
            auto& e = adj[u][cid];
            if (e.cap == 0 || level[e.to] != level[u] + 1) continue;
            long long tr = dfs(e.to, t, min(pushed, e.cap));
            if (tr == 0) continue;
            e.cap -= tr;
            adj[e.to][e.rev].cap += tr;
            return tr;
        }
        return 0;
    }

    long long maxFlow(int s, int t) {
        reset();
        long long flow = 0;
        while (bfs(s, t)) {
            fill(ptr.begin(), ptr.end(), 0);
            while (long long tr = dfs(s, t, 1LL << 60)) flow += tr;
        }
        return flow;
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, m, q;
    if (!(cin >> n >> m >> q)) return 0;

    Dinic dinic(n);
    for (int i = 0; i < m; ++i) {
        int u, v;
        long long w;
        cin >> u >> v >> w;
        if (u != v && w > 0) dinic.addUndirected(u, v, w);
    }

    vector<int> p(n + 1, 1);
    vector<vector<pair<int, long long>>> tree(n + 1);
    vector<long long> edgeWeights;
    for (int i = 2; i <= n; ++i) {
        long long f = dinic.maxFlow(i, p[i]);
        tree[i].push_back({p[i], f});
        tree[p[i]].push_back({i, f});
        edgeWeights.push_back(f);
        for (int j = i + 1; j <= n; ++j) {
            if (dinic.level[j] != -1 && p[j] == p[i]) p[j] = i;
        }
    }
    sort(edgeWeights.begin(), edgeWeights.end());

    const int LOG = 10;
    vector<vector<int>> up(LOG, vector<int>(n + 1, 0));
    vector<vector<long long>> mn(LOG, vector<long long>(n + 1, 1LL << 60));
    vector<int> depth(n + 1, 0);

    auto dfsTree = [&](auto& self, int u, int par, long long pw) -> void {
        up[0][u] = par;
        mn[0][u] = pw;
        for (auto [v, w] : tree[u]) {
            if (v == par) continue;
            depth[v] = depth[u] + 1;
            self(self, v, u, w);
        }
    };
    dfsTree(dfsTree, 1, 0, 1LL << 60);

    for (int k = 1; k < LOG; ++k) {
        for (int u = 1; u <= n; ++u) {
            int mid = up[k - 1][u];
            up[k][u] = up[k - 1][mid];
            mn[k][u] = min(mn[k - 1][u], mn[k - 1][mid]);
        }
    }

    auto queryPath = [&](int u, int v) -> long long {
        long long res = (1LL << 60);
        if (depth[u] < depth[v]) swap(u, v);
        int diff = depth[u] - depth[v];
        for (int k = 0; k < LOG; ++k) {
            if ((diff >> k) & 1) {
                res = min(res, mn[k][u]);
                u = up[k][u];
            }
        }
        if (u == v) return res;
        for (int k = LOG - 1; k >= 0; --k) {
            if (up[k][u] != up[k][v]) {
                res = min({res, mn[k][u], mn[k][v]});
                u = up[k][u];
                v = up[k][v];
            }
        }
        return min({res, mn[0][u], mn[0][v]});
    };

    while (q--) {
        int type;
        cin >> type;
        if (type == 1) {
            int u, v;
            cin >> u >> v;
            cout << queryPath(u, v) << "\\n";
        } else {
            long long kVal;
            cin >> kVal;
            auto cntGe = edgeWeights.end() - lower_bound(edgeWeights.begin(), edgeWeights.end(), kVal);
            cout << (n - static_cast<int>(cntGe)) << "\\n";
        }
    }
    return 0;
}
`,
        rust: `use std::collections::VecDeque;
use std::io::{self, Read};

#[derive(Clone)]
struct Edge {
    to: usize,
    rev: usize,
    cap: i64,
    orig: i64,
}

struct Dinic {
    n: usize,
    adj: Vec<Vec<Edge>>,
    level: Vec<i32>,
    ptr: Vec<usize>,
}

impl Dinic {
    fn new(n: usize) -> Self {
        Self {
            n,
            adj: vec![Vec::new(); n + 1],
            level: vec![-1; n + 1],
            ptr: vec![0; n + 1],
        }
    }

    fn add_undirected(&mut self, u: usize, v: usize, cap: i64) {
        let ru = self.adj[v].len();
        let rv = self.adj[u].len();
        self.adj[u].push(Edge { to: v, rev: ru, cap, orig: cap });
        self.adj[v].push(Edge { to: u, rev: rv, cap, orig: cap });
    }

    fn reset(&mut self) {
        for u in 1..=self.n {
            for e in &mut self.adj[u] {
                e.cap = e.orig;
            }
        }
    }

    fn bfs(&mut self, s: usize, t: usize) -> bool {
        self.level.fill(-1);
        self.level[s] = 0;
        let mut q = VecDeque::new();
        q.push_back(s);
        while let Some(u) = q.pop_front() {
            for e in &self.adj[u] {
                if e.cap > 0 && self.level[e.to] == -1 {
                    self.level[e.to] = self.level[u] + 1;
                    q.push_back(e.to);
                }
            }
        }
        self.level[t] != -1
    }

    fn dfs(&mut self, u: usize, t: usize, pushed: i64) -> i64 {
        if pushed == 0 || u == t {
            return pushed;
        }
        while self.ptr[u] < self.adj[u].len() {
            let i = self.ptr[u];
            self.ptr[u] += 1;
            let to = self.adj[u][i].to;
            let cap = self.adj[u][i].cap;
            if cap == 0 || self.level[to] != self.level[u] + 1 {
                continue;
            }
            let tr = self.dfs(to, t, pushed.min(cap));
            if tr == 0 {
                continue;
            }
            self.adj[u][i].cap -= tr;
            let rev = self.adj[u][i].rev;
            self.adj[to][rev].cap += tr;
            return tr;
        }
        0
    }

    fn max_flow(&mut self, s: usize, t: usize) -> i64 {
        self.reset();
        let mut flow = 0;
        while self.bfs(s, t) {
            self.ptr.fill(0);
            loop {
                let tr = self.dfs(s, t, 1i64 << 60);
                if tr == 0 {
                    break;
                }
                flow += tr;
            }
        }
        flow
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
    let q: usize = it.next().unwrap().parse().unwrap();

    let mut dinic = Dinic::new(n);
    for _ in 0..m {
        let u: usize = it.next().unwrap().parse().unwrap();
        let v: usize = it.next().unwrap().parse().unwrap();
        let w: i64 = it.next().unwrap().parse().unwrap();
        if u != v && w > 0 {
            dinic.add_undirected(u, v, w);
        }
    }

    let mut p = vec![1usize; n + 1];
    let mut tree = vec![Vec::<(usize, i64)>::new(); n + 1];
    let mut weights = Vec::with_capacity(n);
    for i in 2..=n {
        let f = dinic.max_flow(i, p[i]);
        tree[i].push((p[i], f));
        tree[p[i]].push((i, f));
        weights.push(f);
        for j in (i + 1)..=n {
            if dinic.level[j] != -1 && p[j] == p[i] {
                p[j] = i;
            }
        }
    }
    weights.sort_unstable();

    const LOG: usize = 10;
    let inf = 1i64 << 60;
    let mut up = vec![vec![0usize; n + 1]; LOG];
    let mut mn = vec![vec![inf; n + 1]; LOG];
    let mut depth = vec![0usize; n + 1];
    let mut stk = vec![(1usize, 0usize, inf)];
    while let Some((u, par, pw)) = stk.pop() {
        up[0][u] = par;
        mn[0][u] = pw;
        for &(v, w) in &tree[u] {
            if v != par {
                depth[v] = depth[u] + 1;
                stk.push((v, u, w));
            }
        }
    }

    for k in 1..LOG {
        for u in 1..=n {
            let mid = up[k - 1][u];
            up[k][u] = up[k - 1][mid];
            mn[k][u] = mn[k - 1][u].min(mn[k - 1][mid]);
        }
    }

    let query_path = |mut u: usize, mut v: usize| -> i64 {
        let mut res = inf;
        if depth[u] < depth[v] {
            std::mem::swap(&mut u, &mut v);
        }
        let diff = depth[u] - depth[v];
        for k in 0..LOG {
            if ((diff >> k) & 1) == 1 {
                res = res.min(mn[k][u]);
                u = up[k][u];
            }
        }
        if u == v {
            return res;
        }
        for k in (0..LOG).rev() {
            if up[k][u] != up[k][v] {
                res = res.min(mn[k][u]).min(mn[k][v]);
                u = up[k][u];
                v = up[k][v];
            }
        }
        res.min(mn[0][u]).min(mn[0][v])
    };

    let mut out = String::new();
    for _ in 0..q {
        let t: usize = it.next().unwrap().parse().unwrap();
        if t == 1 {
            let u: usize = it.next().unwrap().parse().unwrap();
            let v: usize = it.next().unwrap().parse().unwrap();
            out.push_str(&format!("{}\\n", query_path(u, v)));
        } else {
            let k_val: i64 = it.next().unwrap().parse().unwrap();
            let idx = weights.partition_point(|&w| w < k_val);
            let cnt_ge = weights.len() - idx;
            out.push_str(&format!("{}\\n", n - cnt_ge));
        }
    }
    print!("{out}");
}
`,
        java21: `import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class Main {
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

    static class Edge {
        int to, rev;
        long cap, orig;

        Edge(int to, int rev, long cap) {
            this.to = to;
            this.rev = rev;
            this.cap = cap;
            this.orig = cap;
        }
    }

    static class Dinic {
        final int n;
        final List<Edge>[] adj;
        final int[] level, ptr;
        final ArrayDeque<Integer> q = new ArrayDeque<>();

        @SuppressWarnings("unchecked")
        Dinic(int n) {
            this.n = n;
            adj = new ArrayList[n + 1];
            for (int i = 1; i <= n; i++) adj[i] = new ArrayList<>();
            level = new int[n + 1];
            ptr = new int[n + 1];
        }

        void addUndirected(int u, int v, long cap) {
            adj[u].add(new Edge(v, adj[v].size(), cap));
            adj[v].add(new Edge(u, adj[u].size() - 1, cap));
        }

        void reset() {
            for (int u = 1; u <= n; u++) for (Edge e : adj[u]) e.cap = e.orig;
        }

        boolean bfs(int s, int t) {
            Arrays.fill(level, -1);
            level[s] = 0;
            q.clear();
            q.add(s);
            while (!q.isEmpty()) {
                int u = q.poll();
                for (Edge e : adj[u]) {
                    if (e.cap > 0 && level[e.to] == -1) {
                        level[e.to] = level[u] + 1;
                        q.add(e.to);
                    }
                }
            }
            return level[t] != -1;
        }

        long dfs(int u, int t, long pushed) {
            if (pushed == 0 || u == t) return pushed;
            for (; ptr[u] < adj[u].size(); ptr[u]++) {
                Edge e = adj[u].get(ptr[u]);
                if (e.cap == 0 || level[e.to] != level[u] + 1) continue;
                long tr = dfs(e.to, t, Math.min(pushed, e.cap));
                if (tr == 0) continue;
                e.cap -= tr;
                adj[e.to].get(e.rev).cap += tr;
                return tr;
            }
            return 0;
        }

        long maxFlow(int s, int t) {
            reset();
            long flow = 0;
            while (bfs(s, t)) {
                Arrays.fill(ptr, 0);
                long tr;
                while ((tr = dfs(s, t, 1L << 60)) > 0) flow += tr;
            }
            return flow;
        }
    }

    @SuppressWarnings("unchecked")
    public static void main(String[] args) throws IOException {
        FastScanner fs = new FastScanner(System.in);
        long nLong = fs.nextLong();
        if (nLong == Long.MIN_VALUE) return;
        int n = (int) nLong, m = fs.nextInt(), q = fs.nextInt();

        Dinic dinic = new Dinic(n);
        for (int i = 0; i < m; i++) {
            int u = fs.nextInt(), v = fs.nextInt();
            long w = fs.nextLong();
            if (u != v && w > 0) dinic.addUndirected(u, v, w);
        }

        int[] p = new int[n + 1];
        Arrays.fill(p, 1);
        List<long[]>[] tree = new ArrayList[n + 1];
        for (int i = 1; i <= n; i++) tree[i] = new ArrayList<>();
        long[] weights = new long[n - 1];
        for (int i = 2; i <= n; i++) {
            long f = dinic.maxFlow(i, p[i]);
            tree[i].add(new long[]{p[i], f});
            tree[p[i]].add(new long[]{i, f});
            weights[i - 2] = f;
            for (int j = i + 1; j <= n; j++) {
                if (dinic.level[j] != -1 && p[j] == p[i]) p[j] = i;
            }
        }
        Arrays.sort(weights);

        final int LOG = 10;
        final long INF = 1L << 60;
        int[][] up = new int[LOG][n + 1];
        long[][] mn = new long[LOG][n + 1];
        for (long[] row : mn) Arrays.fill(row, INF);
        int[] depth = new int[n + 1];

        int[] stk = new int[n], parArr = new int[n];
        long[] pwArr = new long[n];
        int sp = 0;
        stk[sp] = 1; parArr[sp] = 0; pwArr[sp] = INF; sp++;
        while (sp > 0) {
            sp--;
            int u = stk[sp], par = parArr[sp];
            long pw = pwArr[sp];
            up[0][u] = par;
            mn[0][u] = pw;
            for (long[] e : tree[u]) {
                int v = (int) e[0];
                if (v != par) {
                    depth[v] = depth[u] + 1;
                    stk[sp] = v; parArr[sp] = u; pwArr[sp] = e[1]; sp++;
                }
            }
        }

        for (int k = 1; k < LOG; k++) {
            for (int u = 1; u <= n; u++) {
                int mid = up[k - 1][u];
                up[k][u] = up[k - 1][mid];
                mn[k][u] = Math.min(mn[k - 1][u], mn[k - 1][mid]);
            }
        }

        StringBuilder sb = new StringBuilder();
        while (q-- > 0) {
            int type = fs.nextInt();
            if (type == 1) {
                int u = fs.nextInt(), v = fs.nextInt();
                long res = INF;
                if (depth[u] < depth[v]) {
                    int t = u; u = v; v = t;
                }
                int diff = depth[u] - depth[v];
                for (int k = 0; k < LOG; k++) {
                    if (((diff >> k) & 1) == 1) {
                        res = Math.min(res, mn[k][u]);
                        u = up[k][u];
                    }
                }
                if (u != v) {
                    for (int k = LOG - 1; k >= 0; k--) {
                        if (up[k][u] != up[k][v]) {
                            res = Math.min(res, Math.min(mn[k][u], mn[k][v]));
                            u = up[k][u];
                            v = up[k][v];
                        }
                    }
                    res = Math.min(res, Math.min(mn[0][u], mn[0][v]));
                }
                sb.append(res).append('\\n');
            } else {
                long kVal = fs.nextLong();
                int lo = 0, hi = weights.length;
                while (lo < hi) {
                    int mid = (lo + hi) >>> 1;
                    if (weights[mid] < kVal) lo = mid + 1;
                    else hi = mid;
                }
                sb.append(n - (weights.length - lo)).append('\\n');
            }
        }
        System.out.print(sb);
    }
}
`,
        python3: `import bisect
from collections import deque
import sys

sys.setrecursionlimit(200000)


class Dinic:
    def __init__(self, n: int) -> None:
        self.n = n
        self.adj: list[list[list[int]]] = [[] for _ in range(n + 1)]
        self.level = [-1] * (n + 1)
        self.ptr = [0] * (n + 1)

    def add_undirected(self, u: int, v: int, cap: int) -> None:
        self.adj[u].append([v, len(self.adj[v]), cap, cap])
        self.adj[v].append([u, len(self.adj[u]) - 1, cap, cap])

    def reset(self) -> None:
        for u in range(1, self.n + 1):
            for e in self.adj[u]:
                e[2] = e[3]

    def bfs(self, s: int, t: int) -> bool:
        self.level = [-1] * (self.n + 1)
        self.level[s] = 0
        q = deque([s])
        while q:
            u = q.popleft()
            for to, _, cap, _ in self.adj[u]:
                if cap > 0 and self.level[to] == -1:
                    self.level[to] = self.level[u] + 1
                    q.append(to)
        return self.level[t] != -1

    def dfs(self, u: int, t: int, pushed: int) -> int:
        if pushed == 0 or u == t:
            return pushed
        edges = self.adj[u]
        while self.ptr[u] < len(edges):
            e = edges[self.ptr[u]]
            self.ptr[u] += 1
            to, rev, cap, _ = e
            if cap == 0 or self.level[to] != self.level[u] + 1:
                continue
            tr = self.dfs(to, t, min(pushed, cap))
            if tr == 0:
                continue
            e[2] -= tr
            self.adj[to][rev][2] += tr
            return tr
        return 0

    def max_flow(self, s: int, t: int) -> int:
        self.reset()
        flow = 0
        inf = 1 << 60
        while self.bfs(s, t):
            self.ptr = [0] * (self.n + 1)
            while True:
                tr = self.dfs(s, t, inf)
                if tr == 0:
                    break
                flow += tr
        return flow


def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    n = int(next(it))
    m = int(next(it))
    q = int(next(it))

    dinic = Dinic(n)
    for _ in range(m):
        u = int(next(it))
        v = int(next(it))
        w = int(next(it))
        if u != v and w > 0:
            dinic.add_undirected(u, v, w)

    p = [1] * (n + 1)
    tree: list[list[tuple[int, int]]] = [[] for _ in range(n + 1)]
    weights: list[int] = []
    for i in range(2, n + 1):
        f = dinic.max_flow(i, p[i])
        tree[i].append((p[i], f))
        tree[p[i]].append((i, f))
        weights.append(f)
        for j in range(i + 1, n + 1):
            if dinic.level[j] != -1 and p[j] == p[i]:
                p[j] = i
    weights.sort()

    LOG = 10
    INF = 1 << 60
    up = [[0] * (n + 1) for _ in range(LOG)]
    mn = [[INF] * (n + 1) for _ in range(LOG)]
    depth = [0] * (n + 1)
    stk = [(1, 0, INF)]
    while stk:
        u, par, pw = stk.pop()
        up[0][u] = par
        mn[0][u] = pw
        for v, w in tree[u]:
            if v != par:
                depth[v] = depth[u] + 1
                stk.append((v, u, w))

    for k in range(1, LOG):
        for u in range(1, n + 1):
            mid = up[k - 1][u]
            up[k][u] = up[k - 1][mid]
            mn[k][u] = min(mn[k - 1][u], mn[k - 1][mid])

    def query_path(u: int, v: int) -> int:
        res = INF
        if depth[u] < depth[v]:
            u, v = v, u
        diff = depth[u] - depth[v]
        for k in range(LOG):
            if (diff >> k) & 1:
                res = min(res, mn[k][u])
                u = up[k][u]
        if u == v:
            return res
        for k in range(LOG - 1, -1, -1):
            if up[k][u] != up[k][v]:
                res = min(res, mn[k][u], mn[k][v])
                u = up[k][u]
                v = up[k][v]
        return min(res, mn[0][u], mn[0][v])

    out: list[str] = []
    for _ in range(q):
        t = int(next(it))
        if t == 1:
            u = int(next(it))
            v = int(next(it))
            out.append(str(query_path(u, v)))
        else:
            k_val = int(next(it))
            idx = bisect.bisect_left(weights, k_val)
            out.append(str(n - (len(weights) - idx)))
    sys.stdout.write("\\n".join(out) + ("\\n" if out else ""))


if __name__ == "__main__":
    solve()
`,
        ruby: `class Dinic
  attr_reader :level

  def initialize(n)
    @n = n
    @adj = Array.new(n + 1) { [] }
    @level = Array.new(n + 1, -1)
    @ptr = Array.new(n + 1, 0)
  end

  def add_undirected(u, v, cap)
    @adj[u] << [v, @adj[v].length, cap, cap]
    @adj[v] << [u, @adj[u].length - 1, cap, cap]
  end

  def reset
    (1..@n).each { |u| @adj[u].each { |e| e[2] = e[3] } }
  end

  def bfs(s, t)
    @level.fill(-1)
    @level[s] = 0
    q = [s]
    head = 0
    while head < q.length
      u = q[head]; head += 1
      @adj[u].each do |to, _, cap, _|
        if cap > 0 && @level[to] == -1
          @level[to] = @level[u] + 1
          q << to
        end
      end
    end
    @level[t] != -1
  end

  def dfs(u, t, pushed)
    return pushed if pushed == 0 || u == t

    edges = @adj[u]
    while @ptr[u] < edges.length
      e = edges[@ptr[u]]
      @ptr[u] += 1
      to, rev, cap, = e
      next if cap == 0 || @level[to] != @level[u] + 1

      tr = dfs(to, t, [pushed, cap].min)
      next if tr == 0

      e[2] -= tr
      @adj[to][rev][2] += tr
      return tr
    end
    0
  end

  def max_flow(s, t)
    reset
    flow = 0
    inf = 1 << 60
    while bfs(s, t)
      @ptr.fill(0)
      loop do
        tr = dfs(s, t, inf)
        break if tr == 0

        flow += tr
      end
    end
    flow
  end
end

data = $stdin.read.split
exit if data.empty?
idx = 0
n = data[idx].to_i; idx += 1
m = data[idx].to_i; idx += 1
q = data[idx].to_i; idx += 1

dinic = Dinic.new(n)
m.times do
  u = data[idx].to_i; idx += 1
  v = data[idx].to_i; idx += 1
  w = data[idx].to_i; idx += 1
  dinic.add_undirected(u, v, w) if u != v && w > 0
end

p_arr = Array.new(n + 1, 1)
tree = Array.new(n + 1) { [] }
weights = []
(2..n).each do |i|
  f = dinic.max_flow(i, p_arr[i])
  tree[i] << [p_arr[i], f]
  tree[p_arr[i]] << [i, f]
  weights << f
  ((i + 1)..n).each do |j|
    p_arr[j] = i if dinic.level[j] != -1 && p_arr[j] == p_arr[i]
  end
end
weights.sort!

LOG = 10
INF = 1 << 60
up = Array.new(LOG) { Array.new(n + 1, 0) }
mn = Array.new(LOG) { Array.new(n + 1, INF) }
depth = Array.new(n + 1, 0)
stk = [[1, 0, INF]]
until stk.empty?
  u, par, pw = stk.pop
  up[0][u] = par
  mn[0][u] = pw
  tree[u].each do |v, w|
    next if v == par

    depth[v] = depth[u] + 1
    stk << [v, u, w]
  end
end

(1...LOG).each do |k|
  (1..n).each do |u|
    mid = up[k - 1][u]
    up[k][u] = up[k - 1][mid]
    mn[k][u] = [mn[k - 1][u], mn[k - 1][mid]].min
  end
end

out = []
q.times do
  t = data[idx].to_i; idx += 1
  if t == 1
    u = data[idx].to_i; idx += 1
    v = data[idx].to_i; idx += 1
    res = INF
    u, v = v, u if depth[u] < depth[v]
    diff = depth[u] - depth[v]
    LOG.times do |k|
      if ((diff >> k) & 1) == 1
        res = [res, mn[k][u]].min
        u = up[k][u]
      end
    end
    if u != v
      (LOG - 1).downto(0) do |k|
        if up[k][u] != up[k][v]
          res = [res, mn[k][u], mn[k][v]].min
          u = up[k][u]
          v = up[k][v]
        end
      end
      res = [res, mn[0][u], mn[0][v]].min
    end
    out << res.to_s
  else
    k_val = data[idx].to_i; idx += 1
    pos = weights.bsearch_index { |w| w >= k_val } || weights.length
    out << (n - (weights.length - pos)).to_s
  end
end

puts out.join("\\n") unless out.empty?
`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'Codeforces',
      title: '343E — Pumping Stations (Gomory-Hu Tree Path Sum & Reconstruction)',
      difficulty: '2600',
      url: 'https://codeforces.com/problemset/problem/343/E',
      patternNote: 'Greedy recursive cutting along the minimum-weight Gomory-Hu tree edge maximizes Hamiltonian path cut sum.',
    },
    {
      platform: 'CSES',
      title: 'Minimum Cut & K-Edge Connected Components',
      difficulty: 'Hard',
      url: 'https://cses.fi/problemset/',
      patternNote: 'Gusfield’s N - 1 cut tree compresses all-pairs connectivity resilience.',
    },
    {
      platform: 'AtCoder',
      title: 'ABC / ARC Stoer-Wagner Global Min-Cut',
      difficulty: '2400–2700',
      url: 'https://atcoder.jp/',
      patternNote: 'O(V^3) Maximum Adjacency contractions find global min-cut without selecting source/sink.',
    },
  ],
  interviewNotes: [
    'Explain why an N-vertex weighted tree can represent all N(N-1)/2 pairwise min-cuts: undirected cuts are non-crossing and satisfy mincut(u, v) >= min(mincut(u, x), mincut(x, v)).',
    'Prove why the last vertex t added in a Stoer-Wagner Maximum Adjacency phase always achieves mincut(s, t) == deg_phase(t), justifying contracting s and t.',
    'Show how K-edge-connected components immediately follow from thresholding edges >= K on the Gomory-Hu tree.',
  ],
  projectBlueprint: {
    title: 'Datacenter Backbone Redundancy & Multi-Region Partition Resilience Auditor',
    tagline: 'All-pairs network bottleneck analyzer computing single-point failures, global min-cuts, and K-resilient clusters',
    stackSummary: 'TypeScript Dinic Engine + Gusfield Cut-Tree Builder + Stoer-Wagner Global Auditor',
    asciiDiagram: [
      '+---------------------------------------------------------------+',
      '|  Undirected Weighted Topology G(V, E, cap)                    |',
      '|        |                                                      |',
      '|        +--> Stoer-Wagner MAS Phases -> Global Weakest Cut     |',
      '|        +--> Gusfield N - 1 Dinic    -> Gomory-Hu Cut Tree     |',
      '|        v                                                      |',
      '|  O(log N) Bottleneck Queries & K-Edge-Resilient Partition Map |',
      '+---------------------------------------------------------------+',
    ].join('\n'),
    milestones: [
      {
        id: 'm1',
        title: 'Undirected Dinic Flow Core with Fast Reset',
        detail: 'Maintain symmetric initial capacities across reverse arcs for rapid repeated min-cut splits.',
      },
      {
        id: 'm2',
        title: 'Gusfield Equivalence-Tree Constructor',
        detail: 'Compress all N(N-1)/2 fiber-cut capacities into an N-vertex tree with binary-lifting queries.',
      },
      {
        id: 'm3',
        title: 'Stoer-Wagner Global Vulnerability Scanner',
        detail: 'Identify the lowest-cost partition splitting the entire datacenter into two disconnected zones.',
      },
    ],
    starterCode: `export function globalMinCutStoerWagner(n: number, capMatrix: number[][]): number {
  const adj = capMatrix.map((row) => [...row]);
  const nodes = Array.from({ length: n }, (_, i) => i);
  let best = Infinity;
  while (nodes.length > 1) {
    const k = nodes.length;
    const w = new Array(k).fill(0);
    const used = new Array(k).fill(false);
    let prev = -1, last = -1;
    for (let step = 0; step < k; step++) {
      let sel = -1;
      for (let i = 0; i < k; i++) if (!used[i] && (sel === -1 || w[i] > w[sel])) sel = i;
      used[sel] = true; prev = last; last = sel;
      for (let i = 0; i < k; i++) if (!used[i]) w[i] += adj[nodes[sel]][nodes[i]];
    }
    best = Math.min(best, w[last]);
    const s = nodes[prev], t = nodes[last];
    for (let i = 0; i < k; i++) if (i !== last && i !== prev) {
      adj[s][nodes[i]] += adj[t][nodes[i]];
      adj[nodes[i]][s] = adj[s][nodes[i]];
    }
    nodes.splice(last, 1);
  }
  return best;
}`,
  },
};
