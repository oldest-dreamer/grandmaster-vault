import type { TheoryChapter } from '../../types/vault';

export const CH21_DINIC_FLOW: TheoryChapter = {
  slug: 'max-flow-dinic-min-cut',
  topicId: 'gr-40',
  title: "Max Flow, Min Cut & Project Selection Modeling (Dinic's Algorithm)",
  domain: 'Graph & Tree Theory',
  ratingTier: '2200–2600',
  usacoDivision: 'Platinum',
  subtitle:
    'Route maximum throughput through layered residual networks with Dinic’s O(V^2 E) / O(E sqrt(V)) blocking flows, extract S-T minimum cuts, and solve maximum-weight closure project selection problems.',
  analogyTitle: 'The Multi-Lane Toll Highway & Bottleneck Bridge Analogy',
  analogyBody:
    'Imagine shipping cargo trucks from Factory S to Port T through a city road network where every street has a strict truck capacity. Whenever you push trucks forward along a road, you also create an imaginary "refund lane" going backward so future routes can cancel or reroute earlier greedy mistakes without losing optimality. Dinic’s algorithm accelerates this by first running a BFS from S to label every intersection by its shortest hop distance (`level[v]`), forming a strict downhill DAG. Then multiple DFS expeditions push as much flow as possible simultaneously down all shortest-hop routes (a Blocking Flow), skipping dead-end streets permanently via a current-arc pointer (`ptr[u]`) until no downhill path to T exists. By the Max-Flow Min-Cut Theorem, the final saturated bottleneck bridges separating S-reachable cities from T-unreachable cities equal the exact maximum flow.',
  prerequisites: [
    {
      slug: 'bfs-dfs-01bfs-toposort',
      title: 'BFS, 0-1 BFS & State-Space Graph Modeling (dist[u][state])',
    },
    {
      slug: 'bipartite-matching-hopcroft-karp',
      title: 'Bipartite Matching, Konig Theorem & Hopcroft-Karp',
    },
  ],
  traceTitle: 'Interactive Dinic Level Graph, Blocking Flow & Residual Cut Trace',
  traceSubtitle:
    'Step through a 6-node network (S=1 -> 2,3 -> 4,5 -> T=6): BFS layering, blocking DFS pushes, reverse residual edges, and final S-T cut extraction—or edit the graph live.',
  allowDynamicGraphEdit: true,
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Step 1: Phase 1 BFS Builds Level Graph From Source S=1 to Sink T=6',
      explanation:
        'Run BFS over edges with residual cap > 0: level[1]=0, level[2]=1, level[3]=1, level[4]=2, level[5]=2, level[6]=3. Only edges where level[v] == level[u] + 1 are admissible in Phase 1.',
      mode: 'graph',
      graph: {
        calloutMetric: 'Phase 1 Levels: L0={1} | L1={2,3} | L2={4,5} | L3={6} | Total Flow = 0',
        nodes: [
          { id: '1', label: 'S (1) L0', x: 65, y: 175, state: 'active', matchWith: null },
          { id: '2', label: '2 L1', x: 185, y: 90, state: 'even', matchWith: null },
          { id: '3', label: '3 L1', x: 185, y: 260, state: 'even', matchWith: null },
          { id: '4', label: '4 L2', x: 325, y: 90, state: 'odd', matchWith: null },
          { id: '5', label: '5 L2', x: 325, y: 260, state: 'odd', matchWith: null },
          { id: '6', label: 'T (6) L3', x: 445, y: 175, state: 'active', matchWith: null },
        ],
        edges: [
          { id: 'e12', from: '1', to: '2', weight: 10, state: 'default' },
          { id: 'e13', from: '1', to: '3', weight: 10, state: 'default' },
          { id: 'e24', from: '2', to: '4', weight: 4, state: 'default' },
          { id: 'e25', from: '2', to: '5', weight: 8, state: 'default' },
          { id: 'e35', from: '3', to: '5', weight: 9, state: 'default' },
          { id: 'e46', from: '4', to: '6', weight: 10, state: 'default' },
          { id: 'e54', from: '5', to: '4', weight: 6, state: 'default' },
          { id: 'e56', from: '5', to: '6', weight: 10, state: 'default' },
        ],
      },
      variables: { Phase: 1, Source: 1, Sink: 6, Edge5to4Ignored: 'same level (L2->L2)', TotalFlow: 0 },
    },
    {
      stepNumber: 2,
      title: 'Step 2: Blocking Flow DFS Pushes Along 1->2->4->6 (Bottleneck 4) & 1->2->5->6 (Bottleneck 6)',
      explanation:
        'DFS #1 takes 1->2(10)->4(4)->6(10), pushing +4 flow and saturating edge 2->4 (residual=0, reverse 4->2 becomes 4). DFS #2 takes 1->2(6)->5(8)->6(10), pushing +6 and saturating 1->2!',
      mode: 'graph',
      graph: {
        calloutMetric: 'Pushed 4 + 6 = 10 via Node 2 | Saturated: 1->2 (10/10) & 2->4 (4/4)',
        nodes: [
          { id: '1', label: 'S (1) L0', x: 65, y: 175, state: 'matched', matchWith: null },
          { id: '2', label: '2 L1 [sat]', x: 185, y: 90, state: 'matched', matchWith: null },
          { id: '3', label: '3 L1', x: 185, y: 260, state: 'even', matchWith: null },
          { id: '4', label: '4 L2', x: 325, y: 90, state: 'matched', matchWith: null },
          { id: '5', label: '5 L2', x: 325, y: 260, state: 'matched', matchWith: null },
          { id: '6', label: 'T (6) L3', x: 445, y: 175, state: 'matched', matchWith: null },
        ],
        edges: [
          { id: 'e12', from: '1', to: '2', weight: 0, state: 'matched' },
          { id: 'e13', from: '1', to: '3', weight: 10, state: 'default' },
          { id: 'e24', from: '2', to: '4', weight: 0, state: 'matched' },
          { id: 'e25', from: '2', to: '5', weight: 2, state: 'augmenting' },
          { id: 'e35', from: '3', to: '5', weight: 9, state: 'default' },
          { id: 'e46', from: '4', to: '6', weight: 6, state: 'augmenting' },
          { id: 'e54', from: '5', to: '4', weight: 6, state: 'default' },
          { id: 'e56', from: '5', to: '6', weight: 4, state: 'augmenting' },
        ],
      },
      variables: { PushedOnPath1: 4, PushedOnPath2: 6, Remaining5to6: 4, TotalFlow: 10 },
    },
    {
      stepNumber: 3,
      title: 'Step 3: Blocking DFS Finishes Phase 1 via 1->3->5->6 (+4) Then Phase 2 BFS Unlocks 5->4->6!',
      explanation:
        'DFS #3 sends +4 along 1->3->5->6, saturating 5->6! Phase 1 ends (flow=14). Phase 2 BFS restarts: edge 1->2 is full, so path reaches 1->3->5(L2)->4(L3)->6(L4), unlocking cross-edge 5->4!',
      mode: 'graph',
      graph: {
        calloutMetric: 'Phase 2 Unlocks 1->3->5->4->6 (Bottleneck: min(6, 5, 6, 6) = 5)!',
        nodes: [
          { id: '1', label: 'S (1) L0', x: 65, y: 175, state: 'active', matchWith: null },
          { id: '2', label: '2 [unreach]', x: 185, y: 90, state: 'unmatched', matchWith: null },
          { id: '3', label: '3 L1', x: 185, y: 260, state: 'even', matchWith: null },
          { id: '4', label: '4 L3', x: 325, y: 90, state: 'odd', matchWith: null },
          { id: '5', label: '5 L2', x: 325, y: 260, state: 'odd', matchWith: null },
          { id: '6', label: 'T (6) L4', x: 445, y: 175, state: 'active', matchWith: null },
        ],
        edges: [
          { id: 'e12', from: '1', to: '2', weight: 0, state: 'matched' },
          { id: 'e13', from: '1', to: '3', weight: 6, state: 'augmenting' },
          { id: 'e24', from: '2', to: '4', weight: 0, state: 'matched' },
          { id: 'e25', from: '2', to: '5', weight: 2, state: 'default' },
          { id: 'e35', from: '3', to: '5', weight: 5, state: 'augmenting' },
          { id: 'e46', from: '4', to: '6', weight: 6, state: 'augmenting' },
          { id: 'e54', from: '5', to: '4', weight: 6, state: 'augmenting' },
          { id: 'e56', from: '5', to: '6', weight: 0, state: 'matched' },
        ],
      },
      variables: { Phase: 2, Level4: 3, Level6: 4, AugmentingCap: 5, TotalFlowBeforePush: 14 },
    },
    {
      stepNumber: 4,
      title: 'Step 4: Final Phase 3 BFS Fails to Reach T=6 -> Max Flow = 19 & Min Cut Extracted!',
      explanation:
        'After pushing +5 along 1->3->5->4->6, edge 3->5 hits 0 residual capacity. Final BFS from S=1 reaches S-side={1, 3} only; edges crossing S-side -> T-side are (1->2 cap 10) + (3->5 cap 9) = 19 Min Cut!',
      mode: 'graph',
      graph: {
        calloutMetric: 'Max Flow = 19 | S-Cut = {1, 3} | T-Cut = {2, 4, 5, 6} | Cut Edges: 1->2 (10) + 3->5 (9)',
        nodes: [
          { id: '1', label: 'S (1) [S-Side]', x: 65, y: 175, state: 'even', matchWith: null },
          { id: '2', label: '2 [T-Side]', x: 185, y: 90, state: 'odd', matchWith: null },
          { id: '3', label: '3 [S-Side]', x: 185, y: 260, state: 'even', matchWith: null },
          { id: '4', label: '4 [T-Side]', x: 325, y: 90, state: 'odd', matchWith: null },
          { id: '5', label: '5 [T-Side]', x: 325, y: 260, state: 'odd', matchWith: null },
          { id: '6', label: 'T (6) [T-Side]', x: 445, y: 175, state: 'odd', matchWith: null },
        ],
        edges: [
          { id: 'e12', from: '1', to: '2', weight: 0, state: 'blossom-cycle' },
          { id: 'e13', from: '1', to: '3', weight: 1, state: 'default' },
          { id: 'e24', from: '2', to: '4', weight: 0, state: 'matched' },
          { id: 'e25', from: '2', to: '5', weight: 2, state: 'default' },
          { id: 'e35', from: '3', to: '5', weight: 0, state: 'blossom-cycle' },
          { id: 'e46', from: '4', to: '6', weight: 1, state: 'default' },
          { id: 'e54', from: '5', to: '4', weight: 1, state: 'default' },
          { id: 'e56', from: '5', to: '6', weight: 0, state: 'matched' },
        ],
      },
      variables: { MaxFlow: 19, MinCutCapacity: '10 + 9 = 19', S_Reachable: '{1, 3}' },
    },
  ],
  reductionClues: [
    {
      clue: '"Split vertices / each node can only be used once / edge-disjoint or vertex-disjoint paths"',
      translation:
        'Split every vertex `v` into `v_in -> v_out` with capacity `1` (or node weight), routing all incoming edges to `v_in` and outgoing edges from `v_out`.',
    },
    {
      clue: '"Pick projects with profits (+w) or costs (-w), where picking project u requires picking prerequisite v"',
      translation:
        'Maximum-Weight Closure via S-T Min Cut: link `S -> u` (cap `+w` if profit > 0), `u -> T` (cap `-w` if cost < 0), and `u -> v` (cap `INF` for dependencies). Answer = `sum(positive profits) - MaxFlow`!',
    },
    {
      clue: '"Partition items into Team A / Team B with individual preference weights and pairwise disagreement penalties"',
      translation:
        'Quadratic Binary Optimization / S-T Min Cut: edge `S -> i` is cost of putting `i` in B; `i -> T` is cost of putting `i` in A; `i <-> j` (cap `penalty`) charges whenever `i` and `j` fall on opposite sides.',
    },
    {
      clue: '"Find minimum number of edges/cells to block so S cannot reach T"',
      translation:
        'Run Dinic Max Flow, then run one final BFS from `S` over residual `cap > 0` edges. Every original forward edge `(u -> v)` where `vis[u] && !vis[v]` belongs to the Minimum Cut.',
    },
  ],
  timeComplexity: 'General: O(V^2 E) | Unit Capacities / Bipartite: O(E sqrt(V)) | Small Planar/Unit: O(E V^(2/3))',
  spaceComplexity: 'O(V + E)',
  pitfalls: [
    {
      type: 'TLE',
      title: 'Forgetting the Current-Arc Optimization Pointer (ptr[u])',
      detail:
        'Without `for (int &cid = ptr[u]; cid < adj[u].size(); cid++)` advancing past dead-end edges during a phase, Dinic degrades from `O(V^2 E)` to exponential/Edmonds-Karp `O(V E^2)` on layered graphs with zero-return branches!',
    },
    {
      type: 'WA',
      title: 'Overestimating INF or Underestimating Flow Total Overflow (32-bit int)',
      detail:
        'Capacities up to `10^9` summed across `1000` edges overflow `int32` quickly. Always store capacities and accumulated flow in 64-bit integers (`long long` / `i64` / `long`), and pick `INF >= 10^18` for prerequisite closure arcs without overflowing `INF + flow`.',
    },
    {
      type: 'WA',
      title: 'Adding Bidirectional Undirected Edges Wrong for Min Cut vs. Directed Flow',
      detail:
        'For an undirected edge `(u, v)` with capacity `c`, add `u -> v (cap c)` paired with reverse `v -> u (cap c)` in one pair—or two separate directed pairs—and remember when extracting Min Cut edges to inspect ONLY original forward edges whose residual `cap` hit `0` AND cross from `vis[u]` to `!vis[v]`.',
    },
    {
      type: 'RE',
      title: 'Not Returning 0 Immediately When pushed == 0 or When u == sink',
      detail:
        'If `dfs(u, pushed)` reaches a dead end (`tr == 0`), keep advancing `ptr[u]`. Only decrement `ptr[u]`? Never! When `tr > 0` and you STILL have leftover incoming `pushed`? Wait: standard single-path Dinic returns immediately once `tr > 0`, OR multi-path Dinic loops while `pushed > 0`. In single-path Dinic (`return tr`), ONLY advance `ptr[u]` when `tr == 0`—NEVER advance `ptr[u]` before returning `tr > 0`, because edge `id` might still have leftover capacity!',
    },
  ],
  implementations: {
    cpp20: `#include <bits/stdc++.h>
using namespace std;

// Dinic's Maximum Flow & S-T Min Cut Extractor
// Time: O(V^2 E) general, O(E sqrt(V)) unit networks | Space: O(V + E)
struct FlowEdge {
    int v, u;
    long long cap, flow = 0;
};

struct Dinic {
    static constexpr long long FLOW_INF = 4e18;
    int n, s, t;
    vector<FlowEdge> edges;
    vector<vector<int>> adj;
    vector<int> level, ptr;
    queue<int> q;

    Dinic(int n, int s, int t) : n(n), s(s), t(t), adj(n), level(n), ptr(n) {}

    void add_edge(int v, int u, long long cap, bool directed = true) {
        adj[v].push_back((int)edges.size());
        edges.push_back({v, u, cap, 0});
        adj[u].push_back((int)edges.size());
        edges.push_back({u, v, directed ? 0 : cap, 0});
    }

    bool bfs() {
        fill(level.begin(), level.end(), -1);
        level[s] = 0;
        while (!q.empty()) q.pop();
        q.push(s);
        while (!q.empty()) {
            int v = q.front();
            q.pop();
            for (int id : adj[v]) {
                if (edges[id].cap - edges[id].flow <= 0) continue;
                int u = edges[id].u;
                if (level[u] != -1) continue;
                level[u] = level[v] + 1;
                q.push(u);
            }
        }
        return level[t] != -1;
    }

    long long dfs(int v, long long pushed) {
        if (pushed == 0) return 0;
        if (v == t) return pushed;
        for (int& cid = ptr[v]; cid < (int)adj[v].size(); cid++) {
            int id = adj[v][cid];
            int u = edges[id].u;
            if (level[v] + 1 != level[u]) continue;
            long long rem = edges[id].cap - edges[id].flow;
            if (rem <= 0) continue;
            long long tr = dfs(u, min(pushed, rem));
            if (tr == 0) continue;
            edges[id].flow += tr;
            edges[id ^ 1].flow -= tr;
            return tr;
        }
        return 0;
    }

    long long max_flow() {
        long long total = 0;
        while (bfs()) {
            fill(ptr.begin(), ptr.end(), 0);
            while (long long pushed = dfs(s, FLOW_INF)) {
                total += pushed;
            }
        }
        return total;
    }

    // Returns indices of original edges (even ids) in S-T Min Cut
    vector<pair<int, int>> min_cut_edges() {
        bfs(); // level[u] != -1 iff u is reachable from s in residual graph
        vector<pair<int, int>> cut;
        for (size_t i = 0; i < edges.size(); i += 2) {
            if (level[edges[i].v] != -1 && level[edges[i].u] == -1 && edges[i].cap > 0) {
                cut.push_back({edges[i].v, edges[i].u});
            }
        }
        return cut;
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, m;
    if (!(cin >> n >> m)) return 0;
    Dinic dinic(n + 1, 1, n);
    for (int i = 0; i < m; i++) {
        int u, v;
        long long c;
        cin >> u >> v >> c;
        dinic.add_edge(u, v, c, true);
    }

    cout << dinic.max_flow() << "\\n";
    return 0;
}`,
    rust: `use std::collections::VecDeque;
use std::io::{self, Read};

#[derive(Clone)]
struct Edge {
    to: usize,
    rev: usize,
    cap: i64,
    is_orig: bool,
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
            adj: vec![Vec::new(); n],
            level: vec![-1; n],
            ptr: vec![0; n],
        }
    }

    fn add_edge(&mut self, u: usize, v: usize, cap: i64, directed: bool) {
        let u_idx = self.adj[u].len();
        let v_idx = self.adj[v].len();
        self.adj[u].push(Edge { to: v, rev: v_idx, cap, is_orig: true });
        self.adj[v].push(Edge {
            to: u,
            rev: u_idx,
            cap: if directed { 0 } else { cap },
            is_orig: !directed,
        });
    }

    fn bfs(&mut self, s: usize, t: usize) -> bool {
        self.level.fill(-1);
        let mut q = VecDeque::new();
        self.level[s] = 0;
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
            let (to, rev, cap) = {
                let e = &self.adj[u][cid];
                (e.to, e.rev, e.cap)
            };
            if cap > 0 && self.level[to] == self.level[u] + 1 {
                let tr = self.dfs(to, t, pushed.min(cap));
                if tr > 0 {
                    self.adj[u][cid].cap -= tr;
                    self.adj[to][rev].cap += tr;
                    return tr;
                }
            }
            self.ptr[u] += 1;
        }
        0
    }

    fn max_flow(&mut self, s: usize, t: usize) -> i64 {
        let mut total = 0i64;
        const INF: i64 = 4_000_000_000_000_000_000;
        while self.bfs(s, t) {
            self.ptr.fill(0);
            loop {
                let pushed = self.dfs(s, t, INF);
                if pushed == 0 {
                    break;
                }
                total += pushed;
            }
        }
        total
    }

    fn min_cut_edges(&mut self, s: usize, t: usize) -> Vec<(usize, usize)> {
        self.bfs(s, t);
        let mut cut = Vec::new();
        for u in 0..self.n {
            if self.level[u] == -1 {
                continue;
            }
            for e in &self.adj[u] {
                if e.is_orig && self.level[e.to] == -1 {
                    cut.push((u, e.to));
                }
            }
        }
        cut
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
    let mut dinic = Dinic::new(n + 1);
    for _ in 0..m {
        let u: usize = it.next().unwrap().parse().unwrap();
        let v: usize = it.next().unwrap().parse().unwrap();
        let c: i64 = it.next().unwrap().parse().unwrap();
        dinic.add_edge(u, v, c, true);
    }
    println!("{}", dinic.max_flow(1, n));
}`,
    java21: `import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

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
            boolean neg = false;
            if (c == '-') { neg = true; c = readByte(); }
            long res = 0;
            while (c > ' ') {
                res = res * 10 + (c - '0');
                c = readByte();
            }
            return neg ? -res : res;
        }

        int nextInt() throws IOException { return (int) nextLong(); }
    }

    static final class Dinic {
        static final long INF = 4_000_000_000_000_000_000L;
        final int n, s, t;
        final List<Integer>[] adj;
        final List<Integer> to = new ArrayList<>();
        final List<Long> cap = new ArrayList<>();
        final int[] level, ptr;
        final ArrayDeque<Integer> q = new ArrayDeque<>();

        @SuppressWarnings("unchecked")
        Dinic(int n, int s, int t) {
            this.n = n;
            this.s = s;
            this.t = t;
            adj = new List[n];
            for (int i = 0; i < n; i++) adj[i] = new ArrayList<>();
            level = new int[n];
            ptr = new int[n];
        }

        void addEdge(int u, int v, long c, boolean directed) {
            adj[u].add(to.size());
            to.add(v);
            cap.add(c);
            adj[v].add(to.size());
            to.add(u);
            cap.add(directed ? 0L : c);
        }

        boolean bfs() {
            Arrays.fill(level, -1);
            level[s] = 0;
            q.clear();
            q.add(s);
            while (!q.isEmpty()) {
                int u = q.poll();
                for (int id : adj[u]) {
                    if (cap.get(id) <= 0) continue;
                    int v = to.get(id);
                    if (level[v] != -1) continue;
                    level[v] = level[u] + 1;
                    q.add(v);
                }
            }
            return level[t] != -1;
        }

        long dfs(int u, long pushed) {
            if (pushed == 0 || u == t) return pushed;
            for (; ptr[u] < adj[u].size(); ptr[u]++) {
                int id = adj[u].get(ptr[u]);
                int v = to.get(id);
                long rem = cap.get(id);
                if (rem <= 0 || level[v] != level[u] + 1) continue;
                long tr = dfs(v, Math.min(pushed, rem));
                if (tr == 0) continue;
                cap.set(id, rem - tr);
                cap.set(id ^ 1, cap.get(id ^ 1) + tr);
                return tr;
            }
            return 0;
        }

        long maxFlow() {
            long total = 0;
            while (bfs()) {
                Arrays.fill(ptr, 0);
                while (true) {
                    long pushed = dfs(s, INF);
                    if (pushed == 0) break;
                    total += pushed;
                }
            }
            return total;
        }
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        int n = fs.nextInt();
        if (n == Integer.MIN_VALUE) return;
        int m = fs.nextInt();
        Dinic dinic = new Dinic(n + 1, 1, n);
        for (int i = 0; i < m; i++) {
            int u = fs.nextInt();
            int v = fs.nextInt();
            long c = fs.nextLong();
            dinic.addEdge(u, v, c, true);
        }
        System.out.println(dinic.maxFlow());
    }
}`,
    python3: `import sys
from collections import deque

sys.setrecursionlimit(200000)

class Dinic:
    INF = 4 * 10**18

    def __init__(self, n: int, s: int, t: int):
        self.n = n
        self.s = s
        self.t = t
        self.adj = [[] for _ in range(n)]
        self.to = []
        self.cap = []
        self.level = [-1] * n
        self.ptr = [0] * n

    def add_edge(self, u: int, v: int, c: int, directed: bool = True) -> None:
        self.adj[u].append(len(self.to))
        self.to.append(v)
        self.cap.append(c)
        self.adj[v].append(len(self.to))
        self.to.append(u)
        self.cap.append(0 if directed else c)

    def bfs(self) -> bool:
        self.level = [-1] * self.n
        self.level[self.s] = 0
        q = deque([self.s])
        while q:
            u = q.popleft()
            for idx in self.adj[u]:
                if self.cap[idx] > 0:
                    v = self.to[idx]
                    if self.level[v] == -1:
                        self.level[v] = self.level[u] + 1
                        q.append(v)
        return self.level[self.t] != -1

    def dfs(self, u: int, pushed: int) -> int:
        if pushed == 0 or u == self.t:
            return pushed
        adj_u = self.adj[u]
        while self.ptr[u] < len(adj_u):
            idx = adj_u[self.ptr[u]]
            v = self.to[idx]
            rem = self.cap[idx]
            if rem > 0 and self.level[v] == self.level[u] + 1:
                tr = self.dfs(v, pushed if pushed < rem else rem)
                if tr > 0:
                    self.cap[idx] -= tr
                    self.cap[idx ^ 1] += tr
                    return tr
            self.ptr[u] += 1
        return 0

    def max_flow(self) -> int:
        total = 0
        while self.bfs():
            self.ptr = [0] * self.n
            while True:
                pushed = self.dfs(self.s, self.INF)
                if pushed == 0:
                    break
                total += pushed
        return total

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    n = int(next(it))
    m = int(next(it))
    dinic = Dinic(n + 1, 1, n)
    for _ in range(m):
        u = int(next(it))
        v = int(next(it))
        c = int(next(it))
        dinic.add_edge(u, v, c, True)
    print(dinic.max_flow())

if __name__ == "__main__":
    solve()`,
    ruby: `class Dinic
  INF = 4_000_000_000_000_000_000

  def initialize(n, s, t)
    @n = n
    @s = s
    @t = t
    @adj = Array.new(n) { [] }
    @to = []
    @cap = []
    @level = Array.new(n, -1)
    @ptr = Array.new(n, 0)
  end

  def add_edge(u, v, c, directed = true)
    @adj[u] << @to.size
    @to << v
    @cap << c
    @adj[v] << @to.size
    @to << u
    @cap << (directed ? 0 : c)
  end

  def bfs
    @level.fill(-1)
    @level[@s] = 0
    queue = [@s]
    head = 0
    while head < queue.size
      u = queue[head]
      head += 1
      @adj[u].each do |id|
        next if @cap[id] <= 0
        v = @to[id]
        next if @level[v] != -1
        @level[v] = @level[u] + 1
        queue << v
      end
    end
    @level[@t] != -1
  end

  def dfs(u, pushed)
    return pushed if pushed == 0 || u == @t
    edges_u = @adj[u]
    while @ptr[u] < edges_u.size
      id = edges_u[@ptr[u]]
      v = @to[id]
      rem = @cap[id]
      if rem > 0 && @level[v] == @level[u] + 1
        tr = dfs(v, pushed < rem ? pushed : rem)
        if tr > 0
          @cap[id] -= tr
          @cap[id ^ 1] += tr
          return tr
        end
      end
      @ptr[u] += 1
    end
    0
  end

  def max_flow
    total = 0
    while bfs
      @ptr.fill(0)
      loop do
        pushed = dfs(@s, INF)
        break if pushed == 0
        total += pushed
      end
    end
    total
  end
end

tokens = $stdin.read.split
exit if tokens.empty?
n = tokens[0].to_i
m = tokens[1].to_i
dinic = Dinic.new(n + 1, 1, n)
idx = 2
m.times do
  u = tokens[idx].to_i
  v = tokens[idx + 1].to_i
  c = tokens[idx + 2].to_i
  idx += 3
  dinic.add_edge(u, v, c, true)
end
puts dinic.max_flow`,
  },
  practiceProblems: [
    {
      id: 'ch21-p1',
      tier: 'Warmup',
      ratingRange: '1800–2000',
      title: 'Download Speed (Directed Maximum Flow with Multi-Edges)',
      statement:
        'A network contains N computers (1..N) and M directed fiber links, where link i carries at most c_i gigabits/sec from u_i to v_i. Multiple parallel links may exist between the same pair of computers. Compute the maximum total bandwidth from Server 1 to Client N.',
      constraints: '2 <= N <= 500, 1 <= M <= 1000, 1 <= c_i <= 10^9',
      sampleInput: '4 5\n1 2 3\n2 4 2\n1 3 4\n3 4 5\n4 1 3',
      sampleOutput: '6',
      hints: [
        'Use Dinic directly with 64-bit capacities so parallel links simply push additional edges into the adjacency list.',
        'Self-loops or reverse links back to source are handled cleanly by the level graph without special-casing.',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

struct Dinic {
    struct Edge { int v, rev; long long cap; };
    int n, s, t;
    vector<vector<Edge>> adj;
    vector<int> level, ptr;

    Dinic(int n, int s, int t) : n(n), s(s), t(t), adj(n), level(n), ptr(n) {}

    void add_edge(int u, int v, long long cap) {
        adj[u].push_back({v, (int)adj[v].size(), cap});
        adj[v].push_back({u, (int)adj[u].size() - 1, 0});
    }

    bool bfs() {
        fill(level.begin(), level.end(), -1);
        queue<int> q;
        level[s] = 0;
        q.push(s);
        while (!q.empty()) {
            int u = q.front();
            q.pop();
            for (const auto& e : adj[u]) {
                if (e.cap > 0 && level[e.v] == -1) {
                    level[e.v] = level[u] + 1;
                    q.push(e.v);
                }
            }
        }
        return level[t] != -1;
    }

    long long dfs(int u, long long pushed) {
        if (pushed == 0 || u == t) return pushed;
        for (int& cid = ptr[u]; cid < (int)adj[u].size(); cid++) {
            auto& e = adj[u][cid];
            if (e.cap > 0 && level[e.v] == level[u] + 1) {
                long long tr = dfs(e.v, min(pushed, e.cap));
                if (tr > 0) {
                    e.cap -= tr;
                    adj[e.v][e.rev].cap += tr;
                    return tr;
                }
            }
        }
        return 0;
    }

    long long max_flow() {
        long long total = 0;
        while (bfs()) {
            fill(ptr.begin(), ptr.end(), 0);
            while (long long pushed = dfs(s, (long long)4e18)) {
                total += pushed;
            }
        }
        return total;
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    if (!(cin >> n >> m)) return 0;
    Dinic d(n + 1, 1, n);
    for (int i = 0; i < m; i++) {
        int u, v;
        long long c;
        cin >> u >> v >> c;
        if (u != v) d.add_edge(u, v, c);
    }
    cout << d.max_flow() << "\\n";
    return 0;
}`,
        rust: `use std::collections::VecDeque;
use std::io::{self, Read};

#[derive(Clone)]
struct Edge {
    to: usize,
    rev: usize,
    cap: i64,
}

struct Dinic {
    adj: Vec<Vec<Edge>>,
    level: Vec<i32>,
    ptr: Vec<usize>,
}

impl Dinic {
    fn new(n: usize) -> Self {
        Self { adj: vec![Vec::new(); n], level: vec![-1; n], ptr: vec![0; n] }
    }
    fn add_edge(&mut self, u: usize, v: usize, cap: i64) {
        let ui = self.adj[u].len();
        let vi = self.adj[v].len();
        self.adj[u].push(Edge { to: v, rev: vi, cap });
        self.adj[v].push(Edge { to: u, rev: ui, cap: 0 });
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
            let (to, rev, cap) = (self.adj[u][i].to, self.adj[u][i].rev, self.adj[u][i].cap);
            if cap > 0 && self.level[to] == self.level[u] + 1 {
                let tr = self.dfs(to, t, pushed.min(cap));
                if tr > 0 {
                    self.adj[u][i].cap -= tr;
                    self.adj[to][rev].cap += tr;
                    return tr;
                }
            }
            self.ptr[u] += 1;
        }
        0
    }
    fn max_flow(&mut self, s: usize, t: usize) -> i64 {
        let mut ans = 0i64;
        while self.bfs(s, t) {
            self.ptr.fill(0);
            loop {
                let p = self.dfs(s, t, 4_000_000_000_000_000_000);
                if p == 0 {
                    break;
                }
                ans += p;
            }
        }
        ans
    }
}

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let n: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };
    let m: usize = it.next().unwrap().parse().unwrap();
    let mut d = Dinic::new(n + 1);
    for _ in 0..m {
        let u: usize = it.next().unwrap().parse().unwrap();
        let v: usize = it.next().unwrap().parse().unwrap();
        let c: i64 = it.next().unwrap().parse().unwrap();
        if u != v {
            d.add_edge(u, v, c);
        }
    }
    println!("{}", d.max_flow(1, n));
}`,
        java21: `import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class Main {
    static final class FastScanner {
        private final InputStream in;
        private final byte[] buf = new byte[1 << 16];
        private int p = 0, l = 0;
        FastScanner(InputStream in) { this.in = in; }
        private int rb() throws IOException {
            if (p >= l) { p = 0; l = in.read(buf); if (l <= 0) return -1; }
            return buf[p++];
        }
        long nextLong() throws IOException {
            int c = rb();
            while (c >= 0 && c <= ' ') c = rb();
            if (c == -1) return Long.MIN_VALUE;
            boolean neg = false;
            if (c == '-') { neg = true; c = rb(); }
            long v = 0;
            while (c > ' ') { v = v * 10 + (c - '0'); c = rb(); }
            return neg ? -v : v;
        }
        int nextInt() throws IOException { return (int) nextLong(); }
    }

    static final class Edge {
        int to, rev;
        long cap;
        Edge(int to, int rev, long cap) { this.to = to; this.rev = rev; this.cap = cap; }
    }

    static List<Edge>[] adj;
    static int[] level, ptr;
    static int sink;

    static void addEdge(int u, int v, long cap) {
        adj[u].add(new Edge(v, adj[v].size(), cap));
        adj[v].add(new Edge(u, adj[u].size() - 1, 0L));
    }

    static boolean bfs(int s) {
        Arrays.fill(level, -1);
        level[s] = 0;
        ArrayDeque<Integer> q = new ArrayDeque<>();
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
        return level[sink] != -1;
    }

    static long dfs(int u, long pushed) {
        if (pushed == 0 || u == sink) return pushed;
        for (; ptr[u] < adj[u].size(); ptr[u]++) {
            Edge e = adj[u].get(ptr[u]);
            if (e.cap > 0 && level[e.to] == level[u] + 1) {
                long tr = dfs(e.to, Math.min(pushed, e.cap));
                if (tr > 0) {
                    e.cap -= tr;
                    adj[e.to].get(e.rev).cap += tr;
                    return tr;
                }
            }
        }
        return 0;
    }

    @SuppressWarnings("unchecked")
    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        int n = fs.nextInt();
        if (n == Integer.MIN_VALUE) return;
        int m = fs.nextInt();
        adj = new List[n + 1];
        for (int i = 0; i <= n; i++) adj[i] = new ArrayList<>();
        level = new int[n + 1];
        ptr = new int[n + 1];
        sink = n;
        for (int i = 0; i < m; i++) {
            int u = fs.nextInt(), v = fs.nextInt();
            long c = fs.nextLong();
            if (u != v) addEdge(u, v, c);
        }
        long flow = 0;
        while (bfs(1)) {
            Arrays.fill(ptr, 0);
            while (true) {
                long p = dfs(1, 4_000_000_000_000_000_000L);
                if (p == 0) break;
                flow += p;
            }
        }
        System.out.println(flow);
    }
}`,
        python3: `import sys
from collections import deque

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    n = int(next(it))
    m = int(next(it))
    adj = [[] for _ in range(n + 1)]
    to = []
    cap = []

    def add_edge(u: int, v: int, c: int) -> None:
        adj[u].append(len(to))
        to.append(v)
        cap.append(c)
        adj[v].append(len(to))
        to.append(u)
        cap.append(0)

    for _ in range(m):
        u = int(next(it))
        v = int(next(it))
        c = int(next(it))
        if u != v:
            add_edge(u, v, c)

    level = [-1] * (n + 1)
    ptr = [0] * (n + 1)

    def bfs() -> bool:
        for i in range(n + 1):
            level[i] = -1
        level[1] = 0
        q = deque([1])
        while q:
            u = q.popleft()
            for idx in adj[u]:
                if cap[idx] > 0:
                    v = to[idx]
                    if level[v] == -1:
                        level[v] = level[u] + 1
                        q.append(v)
        return level[n] != -1

    def dfs(u: int, pushed: int) -> int:
        if pushed == 0 or u == n:
            return pushed
        au = adj[u]
        while ptr[u] < len(au):
            idx = au[ptr[u]]
            v = to[idx]
            rem = cap[idx]
            if rem > 0 and level[v] == level[u] + 1:
                tr = dfs(v, pushed if pushed < rem else rem)
                if tr > 0:
                    cap[idx] -= tr
                    cap[idx ^ 1] += tr
                    return tr
            ptr[u] += 1
        return 0

    total = 0
    INF = 4 * 10**18
    while bfs():
        for i in range(n + 1):
            ptr[i] = 0
        while True:
            p = dfs(1, INF)
            if p == 0:
                break
            total += p
    print(total)

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
n = tokens[0].to_i
m = tokens[1].to_i

adj = Array.new(n + 1) { [] }
to = []
cap = []
idx_ptr = 2

m.times do
  u = tokens[idx_ptr].to_i
  v = tokens[idx_ptr + 1].to_i
  c = tokens[idx_ptr + 2].to_i
  idx_ptr += 3
  next if u == v
  adj[u] << to.size
  to << v
  cap << c
  adj[v] << to.size
  to << u
  cap << 0
end

level = Array.new(n + 1, -1)
ptr = Array.new(n + 1, 0)

bfs = lambda do
  level.fill(-1)
  level[1] = 0
  q = [1]
  head = 0
  while head < q.size
    u = q[head]
    head += 1
    adj[u].each do |eid|
      next if cap[eid] <= 0
      v = to[eid]
      next if level[v] != -1
      level[v] = level[u] + 1
      q << v
    end
  end
  level[n] != -1
end

dfs = nil
dfs = lambda do |u, pushed|
  return pushed if pushed == 0 || u == n
  au = adj[u]
  while ptr[u] < au.size
    eid = au[ptr[u]]
    v = to[eid]
    rem = cap[eid]
    if rem > 0 && level[v] == level[u] + 1
      tr = dfs.call(v, pushed < rem ? pushed : rem)
      if tr > 0
        cap[eid] -= tr
        cap[eid ^ 1] += tr
        return tr
      end
    end
    ptr[u] += 1
  end
  0
end

total = 0
INF = 4_000_000_000_000_000_000
while bfs.call
  ptr.fill(0)
  loop do
    p = dfs.call(1, INF)
    break if p == 0
    total += p
  end
end
puts total`,
      },
    },
    {
      id: 'ch21-p2',
      tier: 'Standard',
      ratingRange: '2000–2250',
      title: 'Police Chase (Undirected Minimum S-T Cut Edge Extraction)',
      statement:
        'A city has N intersections (1..N) and M bidirectional streets. A robber starts at intersection 1 and wants to escape to harbor N. Find the minimum number of streets the police must blockade to guarantee the robber cannot reach N, and output those exact street pairs.',
      constraints: '2 <= N <= 500, 1 <= M <= 1000',
      sampleInput: '4 5\n1 2\n1 3\n2 3\n3 4\n1 4',
      sampleOutput: '2\n1 4\n3 4',
      hints: [
        'Model each undirected street (u, v) with capacity 1 in BOTH directions (or two opposite directed unit edges).',
        'After Dinic finishes, run BFS from node 1 over residual cap > 0 edges to mark the reachable set S. Any original street (u, v) where reachable[u] != reachable[v] is part of the minimum cut.',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

struct Dinic {
    struct Edge { int v, rev; int cap; };
    int n, s, t;
    vector<vector<Edge>> adj;
    vector<int> level, ptr;

    Dinic(int n, int s, int t) : n(n), s(s), t(t), adj(n), level(n), ptr(n) {}

    void add_undirected(int u, int v) {
        adj[u].push_back({v, (int)adj[v].size(), 1});
        adj[v].push_back({u, (int)adj[u].size() - 1, 1});
    }

    bool bfs() {
        fill(level.begin(), level.end(), -1);
        queue<int> q;
        level[s] = 0;
        q.push(s);
        while (!q.empty()) {
            int u = q.front();
            q.pop();
            for (const auto& e : adj[u]) {
                if (e.cap > 0 && level[e.v] == -1) {
                    level[e.v] = level[u] + 1;
                    q.push(e.v);
                }
            }
        }
        return level[t] != -1;
    }

    int dfs(int u, int pushed) {
        if (pushed == 0 || u == t) return pushed;
        for (int& cid = ptr[u]; cid < (int)adj[u].size(); cid++) {
            auto& e = adj[u][cid];
            if (e.cap > 0 && level[e.v] == level[u] + 1) {
                int tr = dfs(e.v, min(pushed, e.cap));
                if (tr > 0) {
                    e.cap -= tr;
                    adj[e.v][e.rev].cap += tr;
                    return tr;
                }
            }
        }
        return 0;
    }

    int max_flow() {
        int total = 0;
        while (bfs()) {
            fill(ptr.begin(), ptr.end(), 0);
            while (int pushed = dfs(s, 1e9)) total += pushed;
        }
        return total;
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, m;
    if (!(cin >> n >> m)) return 0;
    Dinic d(n + 1, 1, n);
    vector<pair<int, int>> roads;
    roads.reserve(m);
    for (int i = 0; i < m; i++) {
        int u, v;
        cin >> u >> v;
        roads.push_back({u, v});
        d.add_undirected(u, v);
    }

    int k = d.max_flow();
    d.bfs(); // level[u] != -1 iff u is in S-side of residual graph

    cout << k << "\\n";
    for (auto [u, v] : roads) {
        bool inS_u = d.level[u] != -1;
        bool inS_v = d.level[v] != -1;
        if (inS_u != inS_v) {
            cout << u << " " << v << "\\n";
        }
    }
    return 0;
}`,
        rust: `use std::collections::VecDeque;
use std::io::{self, Read};

#[derive(Clone)]
struct Edge {
    to: usize,
    rev: usize,
    cap: i32,
}

struct Dinic {
    adj: Vec<Vec<Edge>>,
    level: Vec<i32>,
    ptr: Vec<usize>,
}

impl Dinic {
    fn new(n: usize) -> Self {
        Self { adj: vec![Vec::new(); n], level: vec![-1; n], ptr: vec![0; n] }
    }
    fn add_undirected(&mut self, u: usize, v: usize) {
        let ui = self.adj[u].len();
        let vi = self.adj[v].len();
        self.adj[u].push(Edge { to: v, rev: vi, cap: 1 });
        self.adj[v].push(Edge { to: u, rev: ui, cap: 1 });
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
    fn dfs(&mut self, u: usize, t: usize, pushed: i32) -> i32 {
        if pushed == 0 || u == t {
            return pushed;
        }
        while self.ptr[u] < self.adj[u].len() {
            let i = self.ptr[u];
            let (to, rev, cap) = (self.adj[u][i].to, self.adj[u][i].rev, self.adj[u][i].cap);
            if cap > 0 && self.level[to] == self.level[u] + 1 {
                let tr = self.dfs(to, t, pushed.min(cap));
                if tr > 0 {
                    self.adj[u][i].cap -= tr;
                    self.adj[to][rev].cap += tr;
                    return tr;
                }
            }
            self.ptr[u] += 1;
        }
        0
    }
    fn max_flow(&mut self, s: usize, t: usize) -> i32 {
        let mut ans = 0;
        while self.bfs(s, t) {
            self.ptr.fill(0);
            loop {
                let p = self.dfs(s, t, 1_000_000_000);
                if p == 0 {
                    break;
                }
                ans += p;
            }
        }
        ans
    }
}

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let n: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };
    let m: usize = it.next().unwrap().parse().unwrap();
    let mut d = Dinic::new(n + 1);
    let mut roads = Vec::with_capacity(m);
    for _ in 0..m {
        let u: usize = it.next().unwrap().parse().unwrap();
        let v: usize = it.next().unwrap().parse().unwrap();
        roads.push((u, v));
        d.add_undirected(u, v);
    }
    let k = d.max_flow(1, n);
    d.bfs(1, n);
    let mut out = format!("{}\\n", k);
    for (u, v) in roads {
        if (d.level[u] != -1) != (d.level[v] != -1) {
            out.push_str(&format!("{} {}\\n", u, v));
        }
    }
    print!("{}", out);
}`,
        java21: `import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class Main {
    static final class FastScanner {
        private final InputStream in;
        private final byte[] buf = new byte[1 << 16];
        private int p = 0, l = 0;
        FastScanner(InputStream in) { this.in = in; }
        private int rb() throws IOException {
            if (p >= l) { p = 0; l = in.read(buf); if (l <= 0) return -1; }
            return buf[p++];
        }
        int nextInt() throws IOException {
            int c = rb();
            while (c >= 0 && c <= ' ') c = rb();
            if (c == -1) return Integer.MIN_VALUE;
            int v = 0;
            while (c > ' ') { v = v * 10 + (c - '0'); c = rb(); }
            return v;
        }
    }

    static final class Edge {
        int to, rev, cap;
        Edge(int to, int rev, int cap) { this.to = to; this.rev = rev; this.cap = cap; }
    }

    static List<Edge>[] adj;
    static int[] level, ptr;
    static int sink;

    static void addUndirected(int u, int v) {
        adj[u].add(new Edge(v, adj[v].size(), 1));
        adj[v].add(new Edge(u, adj[u].size() - 1, 1));
    }

    static boolean bfs(int s) {
        Arrays.fill(level, -1);
        level[s] = 0;
        ArrayDeque<Integer> q = new ArrayDeque<>();
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
        return level[sink] != -1;
    }

    static int dfs(int u, int pushed) {
        if (pushed == 0 || u == sink) return pushed;
        for (; ptr[u] < adj[u].size(); ptr[u]++) {
            Edge e = adj[u].get(ptr[u]);
            if (e.cap > 0 && level[e.to] == level[u] + 1) {
                int tr = dfs(e.to, Math.min(pushed, e.cap));
                if (tr > 0) {
                    e.cap -= tr;
                    adj[e.to].get(e.rev).cap += tr;
                    return tr;
                }
            }
        }
        return 0;
    }

    @SuppressWarnings("unchecked")
    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        int n = fs.nextInt();
        if (n == Integer.MIN_VALUE) return;
        int m = fs.nextInt();
        adj = new List[n + 1];
        for (int i = 0; i <= n; i++) adj[i] = new ArrayList<>();
        level = new int[n + 1];
        ptr = new int[n + 1];
        sink = n;

        int[] eu = new int[m], ev = new int[m];
        for (int i = 0; i < m; i++) {
            eu[i] = fs.nextInt();
            ev[i] = fs.nextInt();
            addUndirected(eu[i], ev[i]);
        }

        int k = 0;
        while (bfs(1)) {
            Arrays.fill(ptr, 0);
            while (true) {
                int p = dfs(1, 1_000_000_000);
                if (p == 0) break;
                k += p;
            }
        }

        bfs(1);
        StringBuilder sb = new StringBuilder();
        sb.append(k).append('\\n');
        for (int i = 0; i < m; i++) {
            if ((level[eu[i]] != -1) != (level[ev[i]] != -1)) {
                sb.append(eu[i]).append(' ').append(ev[i]).append('\\n');
            }
        }
        System.out.print(sb);
    }
}`,
        python3: `import sys
from collections import deque

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    n = int(next(it))
    m = int(next(it))
    adj = [[] for _ in range(n + 1)]
    to = []
    cap = []
    roads = []

    for _ in range(m):
        u = int(next(it))
        v = int(next(it))
        roads.append((u, v))
        adj[u].append(len(to))
        to.append(v)
        cap.append(1)
        adj[v].append(len(to))
        to.append(u)
        cap.append(1)

    level = [-1] * (n + 1)
    ptr = [0] * (n + 1)

    def bfs() -> bool:
        for i in range(n + 1):
            level[i] = -1
        level[1] = 0
        q = deque([1])
        while q:
            u = q.popleft()
            for idx in adj[u]:
                if cap[idx] > 0:
                    v = to[idx]
                    if level[v] == -1:
                        level[v] = level[u] + 1
                        q.append(v)
        return level[n] != -1

    def dfs(u: int, pushed: int) -> int:
        if pushed == 0 or u == n:
            return pushed
        au = adj[u]
        while ptr[u] < len(au):
            idx = au[ptr[u]]
            v = to[idx]
            rem = cap[idx]
            if rem > 0 and level[v] == level[u] + 1:
                tr = dfs(v, pushed if pushed < rem else rem)
                if tr > 0:
                    cap[idx] -= tr
                    cap[idx ^ 1] += tr
                    return tr
            ptr[u] += 1
        return 0

    k = 0
    while bfs():
        for i in range(n + 1):
            ptr[i] = 0
        while True:
            p = dfs(1, 10**9)
            if p == 0:
                break
            k += p

    bfs()
    out = [str(k)]
    for u, v in roads:
        if (level[u] != -1) != (level[v] != -1):
            out.append(f"{u} {v}")
    sys.stdout.write("\\n".join(out) + "\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
n = tokens[0].to_i
m = tokens[1].to_i

adj = Array.new(n + 1) { [] }
to = []
cap = []
roads = []
idx_ptr = 2

m.times do
  u = tokens[idx_ptr].to_i
  v = tokens[idx_ptr + 1].to_i
  idx_ptr += 2
  roads << [u, v]
  adj[u] << to.size
  to << v
  cap << 1
  adj[v] << to.size
  to << u
  cap << 1
end

level = Array.new(n + 1, -1)
ptr = Array.new(n + 1, 0)

bfs = lambda do
  level.fill(-1)
  level[1] = 0
  q = [1]
  head = 0
  while head < q.size
    u = q[head]
    head += 1
    adj[u].each do |eid|
      next if cap[eid] <= 0
      v = to[eid]
      next if level[v] != -1
      level[v] = level[u] + 1
      q << v
    end
  end
  level[n] != -1
end

dfs = nil
dfs = lambda do |u, pushed|
  return pushed if pushed == 0 || u == n
  au = adj[u]
  while ptr[u] < au.size
    eid = au[ptr[u]]
    v = to[eid]
    rem = cap[eid]
    if rem > 0 && level[v] == level[u] + 1
      tr = dfs.call(v, pushed < rem ? pushed : rem)
      if tr > 0
        cap[eid] -= tr
        cap[eid ^ 1] += tr
        return tr
      end
    end
    ptr[u] += 1
  end
  0
end

k = 0
while bfs.call
  ptr.fill(0)
  loop do
    p = dfs.call(1, 1_000_000_000)
    break if p == 0
    k += p
  end
end

bfs.call
lines = [k.to_s]
roads.each do |u, v|
  lines << "#{u} #{v}" if (level[u] != -1) != (level[v] != -1)
end
puts lines.join("\\n")`,
      },
    },
    {
      id: 'ch21-p3',
      tier: 'Boss',
      ratingRange: '2300–2600',
      title: 'Maximum-Profit Project Selection with Prerequisite Dependencies (Max-Weight Closure)',
      statement:
        'A studio evaluates N projects (1..N). Completing project i yields net reward a_i (positive if profitable, negative if it costs money). Furthermore, M dependency rules state that selecting project u forces you to also complete prerequisite v. Choose a closed subset of projects maximizing total reward, and print both the optimal total reward and the selected project IDs.',
      constraints: '1 <= N <= 500, 0 <= M <= 5000, -10^9 <= a_i <= 10^9',
      sampleInput: '4 3\n10 -3 -8 7\n1 2\n1 3\n4 2',
      sampleOutput: '4\n2 4',
      hints: [
        'Construct an S-T network: if a_i > 0 add edge S -> i with capacity a_i and accumulate sumPos += a_i; if a_i < 0 add edge i -> T with capacity -a_i.',
        'For every prerequisite (u requires v), add edge u -> v with capacity INF. In any finite S-T cut, if u stays on S-side (selected), v MUST stay on S-side too! Answer = sumPos - MaxFlow, and selected projects are those reachable from S in the residual graph.',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

struct Dinic {
    static constexpr long long INF = 1e15;
    struct Edge { int v, rev; long long cap; };
    int n, s, t;
    vector<vector<Edge>> adj;
    vector<int> level, ptr;

    Dinic(int n, int s, int t) : n(n), s(s), t(t), adj(n), level(n), ptr(n) {}

    void add_edge(int u, int v, long long cap) {
        adj[u].push_back({v, (int)adj[v].size(), cap});
        adj[v].push_back({u, (int)adj[u].size() - 1, 0});
    }

    bool bfs() {
        fill(level.begin(), level.end(), -1);
        queue<int> q;
        level[s] = 0;
        q.push(s);
        while (!q.empty()) {
            int u = q.front();
            q.pop();
            for (const auto& e : adj[u]) {
                if (e.cap > 0 && level[e.v] == -1) {
                    level[e.v] = level[u] + 1;
                    q.push(e.v);
                }
            }
        }
        return level[t] != -1;
    }

    long long dfs(int u, long long pushed) {
        if (pushed == 0 || u == t) return pushed;
        for (int& cid = ptr[u]; cid < (int)adj[u].size(); cid++) {
            auto& e = adj[u][cid];
            if (e.cap > 0 && level[e.v] == level[u] + 1) {
                long long tr = dfs(e.v, min(pushed, e.cap));
                if (tr > 0) {
                    e.cap -= tr;
                    adj[e.v][e.rev].cap += tr;
                    return tr;
                }
            }
        }
        return 0;
    }

    long long max_flow() {
        long long total = 0;
        while (bfs()) {
            fill(ptr.begin(), ptr.end(), 0);
            while (long long pushed = dfs(s, INF)) total += pushed;
        }
        return total;
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, m;
    if (!(cin >> n >> m)) return 0;
    int S = 0, T = n + 1;
    Dinic d(n + 2, S, T);
    long long sumPos = 0;

    for (int i = 1; i <= n; i++) {
        long long a;
        cin >> a;
        if (a > 0) {
            sumPos += a;
            d.add_edge(S, i, a);
        } else if (a < 0) {
            d.add_edge(i, T, -a);
        }
    }

    for (int i = 0; i < m; i++) {
        int u, v;
        cin >> u >> v; // u requires v
        d.add_edge(u, v, Dinic::INF);
    }

    long long minCut = d.max_flow();
    d.bfs(); // Nodes reachable from S belong to chosen closure

    cout << (sumPos - minCut) << "\\n";
    vector<int> chosen;
    for (int i = 1; i <= n; i++) {
        if (d.level[i] != -1) chosen.push_back(i);
    }
    for (size_t i = 0; i < chosen.size(); i++) {
        if (i) cout << ' ';
        cout << chosen[i];
    }
    cout << "\\n";
    return 0;
}`,
        rust: `use std::collections::VecDeque;
use std::io::{self, Read};

const INF: i64 = 1_000_000_000_000_000;

#[derive(Clone)]
struct Edge {
    to: usize,
    rev: usize,
    cap: i64,
}

struct Dinic {
    adj: Vec<Vec<Edge>>,
    level: Vec<i32>,
    ptr: Vec<usize>,
}

impl Dinic {
    fn new(n: usize) -> Self {
        Self { adj: vec![Vec::new(); n], level: vec![-1; n], ptr: vec![0; n] }
    }
    fn add_edge(&mut self, u: usize, v: usize, cap: i64) {
        let ui = self.adj[u].len();
        let vi = self.adj[v].len();
        self.adj[u].push(Edge { to: v, rev: vi, cap });
        self.adj[v].push(Edge { to: u, rev: ui, cap: 0 });
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
            let (to, rev, cap) = (self.adj[u][i].to, self.adj[u][i].rev, self.adj[u][i].cap);
            if cap > 0 && self.level[to] == self.level[u] + 1 {
                let tr = self.dfs(to, t, pushed.min(cap));
                if tr > 0 {
                    self.adj[u][i].cap -= tr;
                    self.adj[to][rev].cap += tr;
                    return tr;
                }
            }
            self.ptr[u] += 1;
        }
        0
    }
    fn max_flow(&mut self, s: usize, t: usize) -> i64 {
        let mut ans = 0i64;
        while self.bfs(s, t) {
            self.ptr.fill(0);
            loop {
                let p = self.dfs(s, t, INF);
                if p == 0 {
                    break;
                }
                ans += p;
            }
        }
        ans
    }
}

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let n: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };
    let m: usize = it.next().unwrap().parse().unwrap();
    let src = 0usize;
    let snk = n + 1;
    let mut d = Dinic::new(n + 2);
    let mut sum_pos = 0i64;

    for i in 1..=n {
        let a: i64 = it.next().unwrap().parse().unwrap();
        if a > 0 {
            sum_pos += a;
            d.add_edge(src, i, a);
        } else if a < 0 {
            d.add_edge(i, snk, -a);
        }
    }
    for _ in 0..m {
        let u: usize = it.next().unwrap().parse().unwrap();
        let v: usize = it.next().unwrap().parse().unwrap();
        d.add_edge(u, v, INF);
    }

    let min_cut = d.max_flow(src, snk);
    d.bfs(src, snk);

    println!("{}", sum_pos - min_cut);
    let chosen: Vec<String> = (1..=n)
        .filter(|&i| d.level[i] != -1)
        .map(|i| i.to_string())
        .collect();
    println!("{}", chosen.join(" "));
}`,
        java21: `import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class Main {
    static final class FastScanner {
        private final InputStream in;
        private final byte[] buf = new byte[1 << 16];
        private int p = 0, l = 0;
        FastScanner(InputStream in) { this.in = in; }
        private int rb() throws IOException {
            if (p >= l) { p = 0; l = in.read(buf); if (l <= 0) return -1; }
            return buf[p++];
        }
        long nextLong() throws IOException {
            int c = rb();
            while (c >= 0 && c <= ' ') c = rb();
            if (c == -1) return Long.MIN_VALUE;
            boolean neg = false;
            if (c == '-') { neg = true; c = rb(); }
            long v = 0;
            while (c > ' ') { v = v * 10 + (c - '0'); c = rb(); }
            return neg ? -v : v;
        }
        int nextInt() throws IOException { return (int) nextLong(); }
    }

    static final long INF = 1_000_000_000_000_000L;
    static final class Edge {
        int to, rev;
        long cap;
        Edge(int to, int rev, long cap) { this.to = to; this.rev = rev; this.cap = cap; }
    }

    static List<Edge>[] adj;
    static int[] level, ptr;
    static int src, snk;

    static void addEdge(int u, int v, long cap) {
        adj[u].add(new Edge(v, adj[v].size(), cap));
        adj[v].add(new Edge(u, adj[u].size() - 1, 0L));
    }

    static boolean bfs() {
        Arrays.fill(level, -1);
        level[src] = 0;
        ArrayDeque<Integer> q = new ArrayDeque<>();
        q.add(src);
        while (!q.isEmpty()) {
            int u = q.poll();
            for (Edge e : adj[u]) {
                if (e.cap > 0 && level[e.to] == -1) {
                    level[e.to] = level[u] + 1;
                    q.add(e.to);
                }
            }
        }
        return level[snk] != -1;
    }

    static long dfs(int u, long pushed) {
        if (pushed == 0 || u == snk) return pushed;
        for (; ptr[u] < adj[u].size(); ptr[u]++) {
            Edge e = adj[u].get(ptr[u]);
            if (e.cap > 0 && level[e.to] == level[u] + 1) {
                long tr = dfs(e.to, Math.min(pushed, e.cap));
                if (tr > 0) {
                    e.cap -= tr;
                    adj[e.to].get(e.rev).cap += tr;
                    return tr;
                }
            }
        }
        return 0;
    }

    @SuppressWarnings("unchecked")
    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        int n = fs.nextInt();
        if (n == Integer.MIN_VALUE) return;
        int m = fs.nextInt();
        src = 0;
        snk = n + 1;
        adj = new List[n + 2];
        for (int i = 0; i <= n + 1; i++) adj[i] = new ArrayList<>();
        level = new int[n + 2];
        ptr = new int[n + 2];

        long sumPos = 0;
        for (int i = 1; i <= n; i++) {
            long a = fs.nextLong();
            if (a > 0) {
                sumPos += a;
                addEdge(src, i, a);
            } else if (a < 0) {
                addEdge(i, snk, -a);
            }
        }
        for (int i = 0; i < m; i++) {
            int u = fs.nextInt(), v = fs.nextInt();
            addEdge(u, v, INF);
        }

        long minCut = 0;
        while (bfs()) {
            Arrays.fill(ptr, 0);
            while (true) {
                long p = dfs(src, INF);
                if (p == 0) break;
                minCut += p;
            }
        }

        bfs();
        StringBuilder sb = new StringBuilder();
        sb.append(sumPos - minCut).append('\\n');
        boolean first = true;
        for (int i = 1; i <= n; i++) {
            if (level[i] != -1) {
                if (!first) sb.append(' ');
                sb.append(i);
                first = false;
            }
        }
        sb.append('\\n');
        System.out.print(sb);
    }
}`,
        python3: `import sys
from collections import deque

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    n = int(next(it))
    m = int(next(it))
    S = 0
    T = n + 1
    INF = 10**15

    adj = [[] for _ in range(n + 2)]
    to = []
    cap = []

    def add_edge(u: int, v: int, c: int) -> None:
        adj[u].append(len(to))
        to.append(v)
        cap.append(c)
        adj[v].append(len(to))
        to.append(u)
        cap.append(0)

    sum_pos = 0
    for i in range(1, n + 1):
        a = int(next(it))
        if a > 0:
            sum_pos += a
            add_edge(S, i, a)
        elif a < 0:
            add_edge(i, T, -a)

    for _ in range(m):
        u = int(next(it))
        v = int(next(it))
        add_edge(u, v, INF)

    level = [-1] * (n + 2)
    ptr = [0] * (n + 2)

    def bfs() -> bool:
        for i in range(n + 2):
            level[i] = -1
        level[S] = 0
        q = deque([S])
        while q:
            u = q.popleft()
            for idx in adj[u]:
                if cap[idx] > 0:
                    v = to[idx]
                    if level[v] == -1:
                        level[v] = level[u] + 1
                        q.append(v)
        return level[T] != -1

    def dfs(u: int, pushed: int) -> int:
        if pushed == 0 or u == T:
            return pushed
        au = adj[u]
        while ptr[u] < len(au):
            idx = au[ptr[u]]
            v = to[idx]
            rem = cap[idx]
            if rem > 0 and level[v] == level[u] + 1:
                tr = dfs(v, pushed if pushed < rem else rem)
                if tr > 0:
                    cap[idx] -= tr
                    cap[idx ^ 1] += tr
                    return tr
            ptr[u] += 1
        return 0

    min_cut = 0
    while bfs():
        for i in range(n + 2):
            ptr[i] = 0
        while True:
            p = dfs(S, INF)
            if p == 0:
                break
            min_cut += p

    bfs()
    chosen = [str(i) for i in range(1, n + 1) if level[i] != -1]
    print(sum_pos - min_cut)
    print(" ".join(chosen))

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
n = tokens[0].to_i
m = tokens[1].to_i

src = 0
snk = n + 1
INF = 1_000_000_000_000_000

adj = Array.new(n + 2) { [] }
to = []
cap = []

add_edge = lambda do |u, v, c|
  adj[u] << to.size
  to << v
  cap << c
  adj[v] << to.size
  to << u
  cap << 0
end

idx = 2
sum_pos = 0
(1..n).each do |i|
  a = tokens[idx].to_i
  idx += 1
  if a > 0
    sum_pos += a
    add_edge.call(src, i, a)
  elsif a < 0
    add_edge.call(i, snk, -a)
  end
end

m.times do
  u = tokens[idx].to_i
  v = tokens[idx + 1].to_i
  idx += 2
  add_edge.call(u, v, INF)
end

level = Array.new(n + 2, -1)
ptr = Array.new(n + 2, 0)

bfs = lambda do
  level.fill(-1)
  level[src] = 0
  q = [src]
  head = 0
  while head < q.size
    u = q[head]
    head += 1
    adj[u].each do |eid|
      next if cap[eid] <= 0
      v = to[eid]
      next if level[v] != -1
      level[v] = level[u] + 1
      q << v
    end
  end
  level[snk] != -1
end

dfs = nil
dfs = lambda do |u, pushed|
  return pushed if pushed == 0 || u == snk
  au = adj[u]
  while ptr[u] < au.size
    eid = au[ptr[u]]
    v = to[eid]
    rem = cap[eid]
    if rem > 0 && level[v] == level[u] + 1
      tr = dfs.call(v, pushed < rem ? pushed : rem)
      if tr > 0
        cap[eid] -= tr
        cap[eid ^ 1] += tr
        return tr
      end
    end
    ptr[u] += 1
  end
  0
end

min_cut = 0
while bfs.call
  ptr.fill(0)
  loop do
    p = dfs.call(src, INF)
    break if p == 0
    min_cut += p
  end
end

bfs.call
chosen = (1..n).select { |i| level[i] != -1 }
puts(sum_pos - min_cut)
puts chosen.join(" ")`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'CSES',
      title: 'Download Speed & Police Chase',
      difficulty: 'Medium / Hard',
      url: 'https://cses.fi/problemset/task/1694',
      patternNote: 'Direct Dinic template verification plus residual S-T minimum cut edge recovery.',
    },
    {
      platform: 'AtCoder',
      title: 'ABC 326 G — Unlock Achievement',
      difficulty: 'AtCoder Cyan / Blue (~1900)',
      url: 'https://atcoder.jp/contests/abc326/tasks/abc326_g',
      patternNote: 'Project Selection (Max-Weight Closure) turning skill-level thresholds into a chain of INF edges.',
    },
    {
      platform: 'Codeforces',
      title: 'CF 311E — Biologist',
      difficulty: '2300 (Div.1)',
      url: 'https://codeforces.com/problemset/problem/311/E',
      patternNote: 'Classic Project Selection + binary state partitioning via S-T min cut.',
    },
    {
      platform: 'CodeChef',
      title: 'MSTRINGS / Flow Network Allocation',
      difficulty: 'CodeChef 5-Star',
      url: 'https://www.codechef.com/problems/CHEFGM',
      patternNote: 'Vertex-splitting capacity bottlenecks combined with max-flow feasibility bounds.',
    },
    {
      platform: 'HackerRank',
      title: 'Maximum Flow / Matrix Tracing Cut',
      difficulty: 'Hard',
      url: 'https://www.hackerrank.com/challenges/matrix/problem',
      patternNote: 'Minimum vertex/edge separator modeling and cut optimality.',
    },
    {
      platform: 'NeetCode 150',
      title: 'Network Delay / Graph Connectivity Bridges',
      difficulty: 'Hard Equivalent',
      url: 'https://neetcode.io/practice',
      patternNote: 'Translating residual reachability, augmenting paths, and bottleneck cuts to backend capacity routing.',
    },
  ],
  interviewNotes: [
    'Why Dinic beats Edmonds-Karp: instead of pushing one shortest augmenting path per O(E) BFS (O(V E^2)), Dinic pushes ALL shortest paths of equal hop length in one phase using a current-arc pointer so dead-end edges are inspected only once per phase.',
    'Explain Max-Flow Min-Cut clearly: at termination, no residual augmenting path exists from S to T, so the S-reachable set forms a cut whose crossing edges are 100% saturated—proving flow == cut.',
    'Project Selection trick in systems interviews: choosing subsets with prerequisite DAG rules and mixed profit/penalty utilities reduces cleanly to minimum cut without exponential backtracking.',
  ],
  projectBlueprint: {
    title: 'Automated University Exam & Room Timetabling Scheduler',
    tagline:
      'Allocate courses, proctors, time slots, and auditorium capacities using Dinic max-flow with min-cut bottleneck diagnostics.',
    stackSummary: 'TypeScript Engine • Layered Flow Network • Bottleneck Cut Inspector • Feasibility Solver',
    asciiDiagram: `+------------------+     cap: 1      +------------------+     cap: seats    +------------------+
|  Source (S)      | --------------> |  Exam / Course   | ------------------> | Room @ Timeslot  |
+------------------+                 +------------------+                     +------------------+
         |                                    |                                        |
         | INF (proctor/prereq closure)       | conflict-free bipartite slots          | cap: maxRooms
         v                                    v                                        v
+------------------+                 +------------------+                     +------------------+
| Unassigned / Cut | <-------------- | Residual BFS     | <------------------ |     Sink (T)     |
+------------------+   min-cut diag  +------------------+                     +------------------+`,
    milestones: [
      {
        id: 'ch21-m1',
        title: 'Build Layered Dinic Solver Engine with Current-Arc Optimization',
        detail: 'Implement 64-bit residual edge storage (`u -> v` and `v -> u` paired via XOR) with reusable `reset()` and `bfs()` level builder.',
      },
      {
        id: 'ch21-m2',
        title: 'Encode Course-to-Slot-to-Room Capacity Graph',
        detail: 'Route `S -> Exam` (student enrollment demand), `Exam -> RoomSlot` (eligible timeslots where no registered student conflicts), and `RoomSlot -> T` (seat capacity).',
      },
      {
        id: 'ch21-m3',
        title: 'Support Co-Requisite & Shared Proctor Constraints',
        detail: 'Enforce strict room-tier limits per department and multi-exam block prerequisites using auxiliary bottleneck nodes.',
      },
      {
        id: 'ch21-m4',
        title: 'Extract Exact Unscheduled Conflict Reasons via Residual Min-Cut',
        detail: 'When `maxFlow < totalDemand`, run a residual BFS from `S` to highlight the exact saturated rooms/timeslots causing scheduling bottlenecks.',
      },
    ],
    starterCode: `export interface ExamRequest {
  id: string;
  students: number;
  allowedRoomSlots: string[];
}

export interface RoomSlot {
  id: string;
  capacity: number;
}

export class TimetableDinicScheduler {
  private adj: number[][] = [];
  private to: number[] = [];
  private cap: number[] = [];
  private origCap: number[] = [];
  private level: number[] = [];
  private ptr: number[] = [];

  constructor(private readonly n: number) {
    this.adj = Array.from({ length: n }, () => []);
    this.level = new Array(n).fill(-1);
    this.ptr = new Array(n).fill(0);
  }

  addEdge(u: number, v: number, c: number): number {
    const eid = this.to.length;
    this.adj[u].push(eid);
    this.to.push(v);
    this.cap.push(c);
    this.origCap.push(c);

    this.adj[v].push(eid + 1);
    this.to.push(u);
    this.cap.push(0);
    this.origCap.push(0);
    return eid;
  }

  private bfs(s: number, t: number): boolean {
    this.level.fill(-1);
    this.level[s] = 0;
    const q: number[] = [s];
    for (let head = 0; head < q.length; head++) {
      const u = q[head];
      for (const eid of this.adj[u]) {
        if (this.cap[eid] > 0) {
          const v = this.to[eid];
          if (this.level[v] === -1) {
            this.level[v] = this.level[u] + 1;
            q.push(v);
          }
        }
      }
    }
    return this.level[t] !== -1;
  }

  private dfs(u: number, t: number, pushed: number): number {
    if (pushed === 0 || u === t) return pushed;
    const edges = this.adj[u];
    while (this.ptr[u] < edges.length) {
      const eid = edges[this.ptr[u]];
      const v = this.to[eid];
      const rem = this.cap[eid];
      if (rem > 0 && this.level[v] === this.level[u] + 1) {
        const tr = this.dfs(v, t, Math.min(pushed, rem));
        if (tr > 0) {
          this.cap[eid] -= tr;
          this.cap[eid ^ 1] += tr;
          return tr;
        }
      }
      this.ptr[u]++;
    }
    return 0;
  }

  solveSchedule(exams: ExamRequest[], slots: RoomSlot[]) {
    const S = 0;
    const T = 1 + exams.length + slots.length;
    const slotMap = new Map<string, number>();
    slots.forEach((sl, idx) => slotMap.set(sl.id, 1 + exams.length + idx));

    const examEdgeStart: { examId: string; slotId: string; eid: number }[] = [];
    let totalRequired = 0;

    exams.forEach((ex, i) => {
      const exNode = 1 + i;
      totalRequired += ex.students;
      this.addEdge(S, exNode, ex.students);
      for (const slotId of ex.allowedRoomSlots) {
        const slNode = slotMap.get(slotId);
        if (slNode !== undefined) {
          const eid = this.addEdge(exNode, slNode, ex.students);
          examEdgeStart.push({ examId: ex.id, slotId, eid });
        }
      }
    });

    const roomSinks: { slotId: string; eid: number }[] = [];
    slots.forEach((sl, idx) => {
      const slNode = 1 + exams.length + idx;
      const eid = this.addEdge(slNode, T, sl.capacity);
      roomSinks.push({ slotId: sl.id, eid });
    });

    let maxFlow = 0;
    while (this.bfs(S, T)) {
      this.ptr.fill(0);
      while (true) {
        const pushed = this.dfs(S, T, 1e12);
        if (pushed === 0) break;
        maxFlow += pushed;
      }
    }

    this.bfs(S, T);
    const bottleneckSlots = roomSinks
      .filter((r) => this.level[this.to[r.eid ^ 1]] !== -1 && this.level[T] === -1)
      .map((r) => r.slotId);

    const assignments = examEdgeStart
      .map((e) => ({
        examId: e.examId,
        slotId: e.slotId,
        assignedStudents: this.origCap[e.eid] - this.cap[e.eid],
      }))
      .filter((a) => a.assignedStudents > 0);

    return {
      feasible: maxFlow === totalRequired,
      assignedSeats: maxFlow,
      totalRequired,
      assignments,
      bottleneckSlots,
    };
  }
}`,
  },
};
