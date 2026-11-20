import type { TheoryChapter } from '../../types/vault';

export const CH45_MCMF_HUNGARIAN: TheoryChapter = {
  slug: 'min-cost-max-flow-hungarian',
  topicId: 'gr-41',
  title: 'Min-Cost Max-Flow & Hungarian Algorithm (O(N^3))',
  domain: 'Graph & Tree Theory',
  ratingTier: '2200–2600',
  usacoDivision: 'Platinum',
  subtitle:
    'Route maximum (or target K) units of flow at minimum total cost using Dijkstra with Johnson vertex potentials p[v] += dist[v], solve square assignment matrices in O(N^3) via the Hungarian slack loop, and balance edge lower bounds + negative costs.',
  analogyTitle: 'The Re-Leveled Terrain & Dual-Price Bidding Analogy',
  analogyBody:
    'In **Min-Cost Max-Flow (MCMF)**, every edge carries both a capacity AND a shipping cost (plus reverse residual edges with **negative cost `-cost`** so you can refund and reroute earlier suboptimal flow!). Running SPFA every step risks `O(F * V * E)` TLE, while standard Dijkstra crashes on negative residual edges. **Johnson’s Trick** fixes this brilliantly: store a **potential `pot[v]`** at every vertex and re-price every edge `(u -> v)` to **`reducedCost = cost(u,v) + pot[u] - pot[v]`**. Along any shortest-path tree, triangle inequality guarantees `reducedCost >= 0` for EVERY active edge (and `== 0` along edges already used in the shortest path, keeping their reverse edges `>= 0` too!). Updating `pot[v] += dist[v]` after each Dijkstra step keeps all reduced costs non-negative forever! Meanwhile, when the graph is simply a complete `N x M` bipartite assignment table, **Hungarian Algorithm** executes that exact primal-dual potential maintenance natively in **`O(N^3)`** without building a single flow graph!',
  prerequisites: [
    {
      slug: 'max-flow-dinic-min-cut',
      title: "Max Flow, Min Cut & Project Selection Modeling (Dinic's Algorithm)",
    },
    {
      slug: 'dijkstra-bellman-floyd',
      title: 'Shortest Paths: Dijkstra, Bellman-Ford, SPFA & Floyd-Warshall',
    },
  ],
  traceTitle: 'Interactive Johnson Potential Re-Pricing & Hungarian Dual-Slack Trace',
  traceSubtitle:
    'Trace 2 augmenting iterations of MCMF with potentials `pot[]` on a diamond network, and watch Hungarian dual updates `(u[i], v[j], minv[j])` solve a 3x3 assignment matrix.',
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Step 1: Initial Potentials pot = [0, 0, 0, 0] & First Dijkstra Shortest Path (S -> A -> T)',
      explanation:
        'Network: S->A (cap 1, cost 2), S->B (cap 1, cost 5), A->B (cap 1, cost 1), A->T (cap 1, cost 6), B->T (cap 1, cost 2). Initial Dijkstra finds dist = [0, 2, 3, 5] via S -> A -> B -> T (cost = 2 + 1 + 2 = 5)!',
      mode: 'graph',
      graph: {
        calloutMetric: 'Path 1: S -> A -> B -> T (flow=1, cost=5). Next: update pot[v] += dist[v]',
        nodes: [
          { id: 'S', label: 'S (d=0)', x: 65, y: 120, state: 'active' },
          { id: 'A', label: 'A (d=2)', x: 215, y: 50, state: 'even' },
          { id: 'B', label: 'B (d=3)', x: 215, y: 195, state: 'even' },
          { id: 'T', label: 'T (d=5)', x: 375, y: 120, state: 'matched' },
        ],
        edges: [
          { id: 'SA', from: 'S', to: 'A', weight: 2, state: 'augmenting' },
          { id: 'SB', from: 'S', to: 'B', weight: 5, state: 'default' },
          { id: 'AB', from: 'A', to: 'B', weight: 1, state: 'augmenting' },
          { id: 'AT', from: 'A', to: 'T', weight: 6, state: 'default' },
          { id: 'BT', from: 'B', to: 'T', weight: 2, state: 'augmenting' },
        ],
      },
      variables: { FlowSent: 1, TotalCost: 5, DistT: 5 },
    },
    {
      stepNumber: 2,
      title: 'Step 2: Update pot = [0, 2, 3, 5] — Reverse Edges Have Reduced Cost ZERO!',
      explanation:
        'After pot[v] += dist[v], check reverse edge B -> A (raw cost -1): reduced = -1 + pot[B](3) - pot[A](2) = 0 >= 0! Every residual edge stays >= 0 so Dijkstra works cleanly again. The second Dijkstra finds S -> B (reduced 5+0-3=2) -> B -> A (reduced 0) -> A -> T (reduced 6+2-5=3) for reduced distance 5. Since pot[T] becomes 5 + 5 = 10, the second unit adds raw cost 10 (rerouting A->B!), giving total cost 5 + 10 = 15!',
      mode: 'array',
      arrays: [
        {
          name: 'Johnson Potentials & Reverse Reduced Costs',
          cells: [
            { index: 0, value: 'pot[S]=0', highlight: 'neutral' },
            { index: 1, value: 'pot[A]=2', highlight: 'window' },
            { index: 2, value: 'pot[B]=3', highlight: 'window' },
            { index: 3, value: 'pot[T]=5', highlight: 'active' },
            { index: 4, value: 'rev(B->A)=0', highlight: 'updated' },
          ],
        },
      ],
      variables: { Path2: 'S->B->A->T (rerouted A->B!)', TotalFlow: 2, TotalCost: 15 },
    },
    {
      stepNumber: 3,
      title: 'Step 3: Hungarian O(N^3) Dual-Slack Loop on 3x3 Cost Matrix [[8,4,7],[5,2,3],[9,4,8]]',
      explanation:
        'Row 1 picks cheapest col 2 (cost 4): u[1]=4, v[2]=0 (match col 2 -> row 1). Row 2 enters at col 0: minv=[5,2,3], best unused col is col 2 again (cost 2, currently held by row 1)! The dual-slack shift finds delta = min(5-0, 3-0) vs alternating via col 2, shifting row 1 to col 3 (cost 7) or col 1 (cost 8) to unlock the global optimum!',
      mode: 'array',
      arrays: [
        {
          name: 'Cost Matrix (Row 1..3 x Col 1..3)',
          cells: [
            { index: 1, value: '[8, 4, 7]', label: 'Worker 1 -> Task 3 (7)', highlight: 'window' },
            { index: 2, value: '[5, 2, 3]', label: 'Worker 2 -> Task 2 (2)', highlight: 'active' },
            { index: 3, value: '[9, 4, 8]', label: 'Worker 3 -> Task 1 (9)?', highlight: 'updated' },
          ],
        },
      ],
      variables: { Row1Pick: 'Col 3 (cost 7)', Row2Pick: 'Col 2 (cost 2)', OptimalCheck: 'Next Step' },
    },
    {
      stepNumber: 4,
      title: 'Step 4: Final Hungarian Assignment & Dual Feasibility Check (sum u + sum v)',
      explanation:
        'Among all 6 permutations of [[8,4,7],[5,2,3],[9,4,8]], the assignment (1->1:8, 2->3:3, 3->2:4) achieves 8 + 3 + 4 = 15 (beating 1->3, 2->1, 3->2 = 16 and 1->2, 2->3, 3->1 = 16). Hungarian discovers (1->1, 2->3, 3->2) = 15 automatically via its slack delta shifts in exact O(N^3)!',
      mode: 'array',
      arrays: [
        {
          name: 'Optimal Matching (Total Min Cost = 15)',
          cells: [
            { index: 1, value: 'Task 1 (cost 8)', label: 'Worker 1', highlight: 'active' },
            { index: 2, value: 'Task 3 (cost 3)', label: 'Worker 2', highlight: 'active' },
            { index: 3, value: 'Task 2 (cost 4)', label: 'Worker 3', highlight: 'active' },
          ],
        },
      ],
      variables: { OptimalCost: 15, Complexity: 'O(N^3)' },
    },
  ],
  reductionClues: [
    {
      clue: '"Assign N workers to M tasks (N <= 500, N <= M) minimizing total cost matrix C[i][j]"',
      translation:
        '**Hungarian Algorithm (`O(N^2 M)`)**! Faster and 5x simpler than building an `N^2`-edge flow network; the 35-line 1-indexed `u[], v[], p[], way[]` slack-array loop handles negative costs natively with zero modifications!',
    },
    {
      clue: '"Route K units of flow from Source to Sink at minimum total cost (each edge has capacity & cost)"',
      translation:
        '**Successive Shortest Path MCMF with Johnson Potentials + Dijkstra**! Stop early the instant `totalFlow == K` (and cap pushed flow on the final path at `K - totalFlow`!).',
    },
    {
      clue: '"Graph has initial NEGATIVE-cost edges (e.g. from DAG profit/reward modeling) in MCMF"',
      translation:
        'Run **SPFA / Bellman-Ford ONCE** from `S` before the Dijkstra loop to initialize `pot[v] = dist[v]`! Afterward, ALL residual edges have `cost + pot[u] - pot[v] >= 0`, so every subsequent iteration uses fast `O(E log V)` Dijkstra!',
    },
    {
      clue: '"Edges have lower-bound capacity L <= flow <= R (and/or negative cycles in circulation)"',
      translation:
        'Pre-push `L` flow on every edge (`balance[u] -= L; balance[v] += L; addEdge(u, v, R - L, cost)`), AND for negative-cost edges inside unconstrained circulations, pre-saturate `R - L` flow along negative edges (`cost < 0`) so only positive-cost residual edges remain—then connect super-source `SS -> v` (`balance[v] > 0`) and `u -> TT` (`balance[u] < 0`) and run MCMF!',
    },
  ],
  timeComplexity: 'MCMF (Johnson + Dijkstra): O(min(F, V*E) * E log V) | Hungarian: O(N^2 M)',
  spaceComplexity: 'MCMF: O(V + E) | Hungarian: O(N * M)',
  pitfalls: [
    {
      type: 'WA',
      title: 'Computing Cost Contribution as dist[T] Instead of pot[T] + dist[T] After Potential Shift',
      detail:
        'Because Dijkstra runs on **reduced costs** `c + pot[u] - pot[v]`, the true shortest-path raw cost from `S` to `T` is NOT `dist[T]`—by telescoping sum along the path `S -> ... -> T`, the true raw unit-flow cost equals **`pot[T]` AFTER updating `pot[v] += dist[v]`** (assuming `pot[S] == 0`)!',
    },
    {
      type: 'TLE',
      title: 'Not Filtering Unreachable Vertices When Updating pot[v] += dist[v]',
      detail:
        'If vertex `v` was unreachable (`dist[v] == INF`), executing `pot[v] += dist[v]` overflows `pot[v]` to `INF` or negative wrap-around! Only execute `if (dist[v] < INF) pot[v] += dist[v];` for reachable vertices.',
    },
    {
      type: 'WA',
      title: 'Hungarian Algorithm Indexed at 0 Without Sentinel Column 0 (`j0 = 0`)',
      detail:
        'The classic `O(N^3)` Hungarian implementation uses **1-indexed** rows `1..N` and columns `1..M`, reserving column `0` (`p[0] = i`) as a dummy starting vertex so `while (p[j0] != 0)` terminates cleanly. Zero-indexing column `0` overwrites real task `0`!',
    },
    {
      type: 'WA',
      title: 'Forgetting to Cap Augmenting Flow at Remaining Demand (K - flow) in Parcel Delivery',
      detail:
        'When asked for the minimum cost to send **exactly `K`** units of flow (not max possible flow!), always clamp `d = min(d, K - totalFlow)` before updating `totalCost += d * pot[T]`!',
    },
  ],
  implementations: {
    cpp20: `#include <bits/stdc++.h>
using namespace std;

// Min-Cost Max-Flow (Johnson Potentials + Dijkstra, with initial SPFA for negative edges)
struct MCMF {
    struct Edge {
        int to, rev;
        long long cap, cost;
    };

    int n;
    vector<vector<Edge>> adj;
    vector<long long> pot, dist;
    vector<int> pv, pe;

    MCMF(int n) : n(n), adj(n), pot(n, 0), dist(n), pv(n), pe(n) {}

    void addEdge(int u, int v, long long cap, long long cost) {
        adj[u].push_back({v, (int)adj[v].size(), cap, cost});
        adj[v].push_back({u, (int)adj[u].size() - 1, 0, -cost});
    }

    // Optional SPFA initialization if graph starts with negative edge costs
    void initPotentials(int s) {
        const long long INF = 4e18;
        fill(pot.begin(), pot.end(), INF);
        vector<bool> inq(n, false);
        queue<int> q;
        pot[s] = 0;
        q.push(s);
        inq[s] = true;
        while (!q.empty()) {
            int u = q.front();
            q.pop();
            inq[u] = false;
            for (const auto& e : adj[u]) {
                if (e.cap > 0 && pot[u] + e.cost < pot[e.to]) {
                    pot[e.to] = pot[u] + e.cost;
                    if (!inq[e.to]) {
                        q.push(e.to);
                        inq[e.to] = true;
                    }
                }
            }
        }
        for (int i = 0; i < n; i++) if (pot[i] == INF) pot[i] = 0;
    }

    pair<long long, long long> minCostFlow(int s, int t, long long maxF = 4e18, bool hasNeg = false) {
        const long long INF = 4e18;
        if (hasNeg) initPotentials(s);
        long long flow = 0, cost = 0;

        while (flow < maxF) {
            fill(dist.begin(), dist.end(), INF);
            dist[s] = 0;
            priority_queue<pair<long long, int>, vector<pair<long long, int>>, greater<>> pq;
            pq.push({0, s});

            while (!pq.empty()) {
                auto [d, u] = pq.top();
                pq.pop();
                if (d != dist[u]) continue;
                for (int i = 0; i < (int)adj[u].size(); i++) {
                    const auto& e = adj[u][i];
                    if (e.cap > 0) {
                        long long nd = d + e.cost + pot[u] - pot[e.to];
                        if (nd < dist[e.to]) {
                            dist[e.to] = nd;
                            pv[e.to] = u;
                            pe[e.to] = i;
                            pq.push({nd, e.to});
                        }
                    }
                }
            }
            if (dist[t] == INF) break;
            for (int i = 0; i < n; i++) {
                if (dist[i] < INF) pot[i] += dist[i];
            }
            long long push = maxF - flow;
            for (int v = t; v != s; v = pv[v]) {
                push = min(push, adj[pv[v]][pe[v]].cap);
            }
            flow += push;
            cost += push * pot[t];
            for (int v = t; v != s; v = pv[v]) {
                auto& e = adj[pv[v]][pe[v]];
                e.cap -= push;
                adj[v][e.rev].cap += push;
            }
        }
        return {flow, cost};
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, m;
    long long k;
    if (!(cin >> n >> m >> k)) return 0;
    MCMF mcmf(n + 1);
    for (int i = 0; i < m; i++) {
        int u, v;
        long long cap, c;
        cin >> u >> v >> cap >> c;
        mcmf.addEdge(u, v, cap, c);
    }
    auto [flow, cost] = mcmf.minCostFlow(1, n, k, false);
    if (flow < k) cout << -1 << "\\n";
    else cout << cost << "\\n";
    return 0;
}`,
    rust: `use std::cmp::Reverse;
use std::collections::{BinaryHeap, VecDeque};
use std::io::{self, Read};

#[derive(Clone)]
struct Edge {
    to: usize,
    rev: usize,
    cap: i64,
    cost: i64,
}

struct Mcmf {
    adj: Vec<Vec<Edge>>,
    pot: Vec<i64>,
}

impl Mcmf {
    fn new(n: usize) -> Self {
        Self {
            adj: vec![Vec::new(); n],
            pot: vec![0; n],
        }
    }

    fn add_edge(&mut self, u: usize, v: usize, cap: i64, cost: i64) {
        let rev_u = self.adj[v].len();
        let rev_v = self.adj[u].len();
        self.adj[u].push(Edge { to: v, rev: rev_u, cap, cost });
        self.adj[v].push(Edge { to: u, rev: rev_v, cap: 0, cost: -cost });
    }

    fn init_potentials(&mut self, s: usize) {
        let n = self.adj.len();
        let inf = i64::MAX / 4;
        self.pot.fill(inf);
        let mut inq = vec![false; n];
        let mut q = VecDeque::new();
        self.pot[s] = 0;
        q.push_back(s);
        inq[s] = true;
        while let Some(u) = q.pop_front() {
            inq[u] = false;
            for e in &self.adj[u] {
                if e.cap > 0 && self.pot[u] + e.cost < self.pot[e.to] {
                    self.pot[e.to] = self.pot[u] + e.cost;
                    if !inq[e.to] {
                        q.push_back(e.to);
                        inq[e.to] = true;
                    }
                }
            }
        }
        for p in &mut self.pot {
            if *p == inf {
                *p = 0;
            }
        }
    }

    fn min_cost_flow(&mut self, s: usize, t: usize, max_f: i64, has_neg: bool) -> (i64, i64) {
        if has_neg {
            self.init_potentials(s);
        }
        let n = self.adj.len();
        let inf = i64::MAX / 4;
        let mut flow = 0i64;
        let mut cost = 0i64;
        let mut dist = vec![inf; n];
        let mut pv = vec![0usize; n];
        let mut pe = vec![0usize; n];

        while flow < max_f {
            dist.fill(inf);
            dist[s] = 0;
            let mut pq = BinaryHeap::new();
            pq.push(Reverse((0i64, s)));

            while let Some(Reverse((d, u))) = pq.pop() {
                if d != dist[u] {
                    continue;
                }
                for (i, e) in self.adj[u].iter().enumerate() {
                    if e.cap > 0 {
                        let nd = d + e.cost + self.pot[u] - self.pot[e.to];
                        if nd < dist[e.to] {
                            dist[e.to] = nd;
                            pv[e.to] = u;
                            pe[e.to] = i;
                            pq.push(Reverse((nd, e.to)));
                        }
                    }
                }
            }

            if dist[t] == inf {
                break;
            }
            for i in 0..n {
                if dist[i] < inf {
                    self.pot[i] += dist[i];
                }
            }

            let mut push = max_f - flow;
            let mut v = t;
            while v != s {
                push = push.min(self.adj[pv[v]][pe[v]].cap);
                v = pv[v];
            }
            flow += push;
            cost += push * self.pot[t];
            v = t;
            while v != s {
                let u = pv[v];
                let idx = pe[v];
                let rev = self.adj[u][idx].rev;
                self.adj[u][idx].cap -= push;
                self.adj[v][rev].cap += push;
                v = u;
            }
        }
        (flow, cost)
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
    let k: i64 = it.next().unwrap().parse().unwrap();

    let mut mcmf = Mcmf::new(n + 1);
    for _ in 0..m {
        let u: usize = it.next().unwrap().parse().unwrap();
        let v: usize = it.next().unwrap().parse().unwrap();
        let cap: i64 = it.next().unwrap().parse().unwrap();
        let c: i64 = it.next().unwrap().parse().unwrap();
        mcmf.add_edge(u, v, cap, c);
    }
    let (flow, cost) = mcmf.min_cost_flow(1, n, k, false);
    if flow < k {
        println!("-1");
    } else {
        println!("{}", cost);
    }
}`,
    java21: `import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.PriorityQueue;

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

    static final class Edge {
        int to, rev;
        long cap, cost;
        Edge(int to, int rev, long cap, long cost) {
            this.to = to; this.rev = rev; this.cap = cap; this.cost = cost;
        }
    }

    @SuppressWarnings("unchecked")
    static long[] minCostFlow(int n, List<Edge>[] adj, int s, int t, long maxF) {
        final long INF = Long.MAX_VALUE / 4;
        long[] pot = new long[n], dist = new long[n];
        int[] pv = new int[n], pe = new int[n];
        long flow = 0, cost = 0;

        while (flow < maxF) {
            Arrays.fill(dist, INF);
            dist[s] = 0;
            PriorityQueue<long[]> pq = new PriorityQueue<>(Comparator.comparingLong(a -> a[0]));
            pq.add(new long[]{0L, s});

            while (!pq.isEmpty()) {
                long[] cur = pq.poll();
                long d = cur[0];
                int u = (int) cur[1];
                if (d != dist[u]) continue;
                List<Edge> list = adj[u];
                for (int i = 0; i < list.size(); i++) {
                    Edge e = list.get(i);
                    if (e.cap > 0) {
                        long nd = d + e.cost + pot[u] - pot[e.to];
                        if (nd < dist[e.to]) {
                            dist[e.to] = nd;
                            pv[e.to] = u;
                            pe[e.to] = i;
                            pq.add(new long[]{nd, e.to});
                        }
                    }
                }
            }
            if (dist[t] == INF) break;
            for (int i = 0; i < n; i++) if (dist[i] < INF) pot[i] += dist[i];

            long push = maxF - flow;
            for (int v = t; v != s; v = pv[v]) {
                push = Math.min(push, adj[pv[v]].get(pe[v]).cap);
            }
            flow += push;
            cost += push * pot[t];
            for (int v = t; v != s; v = pv[v]) {
                Edge e = adj[pv[v]].get(pe[v]);
                e.cap -= push;
                adj[v].get(e.rev).cap += push;
            }
        }
        return new long[]{flow, cost};
    }

    @SuppressWarnings("unchecked")
    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        long nIn = fs.nextLong();
        if (nIn == Long.MIN_VALUE) return;
        int n = (int) nIn, m = (int) fs.nextLong();
        long k = fs.nextLong();

        List<Edge>[] adj = new ArrayList[n + 1];
        for (int i = 0; i <= n; i++) adj[i] = new ArrayList<>();
        for (int i = 0; i < m; i++) {
            int u = (int) fs.nextLong(), v = (int) fs.nextLong();
            long cap = fs.nextLong(), cost = fs.nextLong();
            adj[u].add(new Edge(v, adj[v].size(), cap, cost));
            adj[v].add(new Edge(u, adj[u].size() - 1, 0, -cost));
        }

        long[] res = minCostFlow(n + 1, adj, 1, n, k);
        System.out.println(res[0] < k ? -1 : res[1]);
    }
}`,
    python3: `import heapq
import sys

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    n = int(next(it))
    m = int(next(it))
    k = int(next(it))

    adj = [[] for _ in range(n + 1)]
    for _ in range(m):
        u = int(next(it))
        v = int(next(it))
        cap = int(next(it))
        cost = int(next(it))
        adj[u].append([v, len(adj[v]), cap, cost])
        adj[v].append([u, len(adj[u]) - 1, 0, -cost])

    INF = 10**18
    pot = [0] * (n + 1)
    flow = 0
    total_cost = 0

    while flow < k:
        dist = [INF] * (n + 1)
        pv = [0] * (n + 1)
        pe = [0] * (n + 1)
        dist[1] = 0
        pq = [(0, 1)]

        while pq:
            d, u = heapq.heappop(pq)
            if d != dist[u]:
                continue
            pu = pot[u]
            for i, (v, _, cap, c) in enumerate(adj[u]):
                if cap > 0:
                    nd = d + c + pu - pot[v]
                    if nd < dist[v]:
                        dist[v] = nd
                        pv[v] = u
                        pe[v] = i
                        heapq.heappush(pq, (nd, v))

        if dist[n] == INF:
            break
        for i in range(1, n + 1):
            if dist[i] < INF:
                pot[i] += dist[i]

        push = k - flow
        v = n
        while v != 1:
            push = min(push, adj[pv[v]][pe[v]][2])
            v = pv[v]

        flow += push
        total_cost += push * pot[n]
        v = n
        while v != 1:
            e = adj[pv[v]][pe[v]]
            e[2] -= push
            adj[v][e[1]][2] += push
            v = pv[v]

    sys.stdout.write(f"{-1 if flow < k else total_cost}\\n")

if __name__ == "__main__":
    solve()`,
    ruby: `tokens = $stdin.read.split
exit if tokens.empty?
idx = 0
n = tokens[idx].to_i; idx += 1
m = tokens[idx].to_i; idx += 1
k = tokens[idx].to_i; idx += 1

adj = Array.new(n + 1) { [] }
m.times do
  u = tokens[idx].to_i; v = tokens[idx + 1].to_i
  cap = tokens[idx + 2].to_i; cost = tokens[idx + 3].to_i
  idx += 4
  adj[u] << [v, adj[v].length, cap, cost]
  adj[v] << [u, adj[u].length - 1, 0, -cost]
end

class MinHeap
  def initialize
    @a = []
  end
  def empty?; @a.empty?; end
  def push(item)
    @a << item
    i = @a.length - 1
    while i > 0
      p = (i - 1) >> 1
      break if @a[p][0] <= @a[i][0]
      @a[p], @a[i] = @a[i], @a[p]
      i = p
    end
  end
  def pop
    top = @a[0]
    last = @a.pop
    unless @a.empty?
      @a[0] = last
      i = 0
      len = @a.length
      loop do
        l = (i << 1) + 1
        break if l >= len
        r = l + 1
        best = (r < len && @a[r][0] < @a[l][0]) ? r : l
        break if @a[i][0] <= @a[best][0]
        @a[i], @a[best] = @a[best], @a[i]
        i = best
      end
    end
    top
  end
end

INF = 10**18
pot = Array.new(n + 1, 0)
flow = 0
total_cost = 0

while flow < k
  dist = Array.new(n + 1, INF)
  pv = Array.new(n + 1, 0)
  pe = Array.new(n + 1, 0)
  dist[1] = 0
  pq = MinHeap.new
  pq.push([0, 1])

  until pq.empty?
    d, u = pq.pop
    next if d != dist[u]
    pu = pot[u]
    adj[u].each_with_index do |(v, _, cap, c), i|
      next if cap <= 0
      nd = d + c + pu - pot[v]
      if nd < dist[v]
        dist[v] = nd
        pv[v] = u
        pe[v] = i
        pq.push([nd, v])
      end
    end
  end

  break if dist[n] == INF
  (1..n).each { |i| pot[i] += dist[i] if dist[i] < INF }

  push = k - flow
  v = n
  while v != 1
    c = adj[pv[v]][pe[v]][2]
    push = c if c < push
    v = pv[v]
  end

  flow += push
  total_cost += push * pot[n]
  v = n
  while v != 1
    e = adj[pv[v]][pe[v]]
    e[2] -= push
    adj[v][e[1]][2] += push
    v = pv[v]
  end
end

puts(flow < k ? -1 : total_cost)`,
  },
  practiceProblems: [
    {
      id: 'ch45-p1',
      tier: 'Warmup',
      ratingRange: '1900–2150',
      title: 'Task Assignment — Exact O(N^3) Hungarian Assignment With Reconstruction',
      statement:
        'A company has `N` employees and `N` tasks. Employee `i` costs `C[i][j]` to perform task `j`. Assign each employee to a distinct task minimizing the total cost. Output the minimum total cost on line 1, followed by `N` lines `i task_for_i` showing the optimal assignment.',
      constraints: '1 <= N <= 300, 0 <= C[i][j] <= 10^9',
      sampleInput: '3\n8 4 7\n5 2 3\n9 4 8',
      sampleOutput: '15\n1 1\n2 3\n3 2',
      hints: [
        'Use the standard **1-indexed Hungarian Algorithm** (`u[0..N], v[0..N], p[0..N], way[0..N]`): for each row `i = 1..N`, set `p[0] = i`, `j0 = 0`, `minv = INF`, and run the dual slack loop updating `u[p[j]] += delta`, `v[j] -= delta` until an unmatched column `j0` (`p[j0] == 0`) is found!',
        'Unwind the augmenting alternating path using `j1 = way[j0]; p[j0] = p[j1]; j0 = j1` until `j0 == 0`. Finally `ans[p[j]] = j` gives the exact task assigned to employee `p[j]`, and `-v[0]` equals the exact minimum cost!',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

// O(N^3) Hungarian Algorithm (1-indexed with sentinel column 0)
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    if (!(cin >> n)) return 0;
    vector<vector<long long>> a(n + 1, vector<long long>(n + 1, 0));
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= n; j++) cin >> a[i][j];
    }

    const long long INF = 4e18;
    vector<long long> u(n + 1, 0), v(n + 1, 0);
    vector<int> p(n + 1, 0), way(n + 1, 0);

    for (int i = 1; i <= n; i++) {
        p[0] = i;
        int j0 = 0;
        vector<long long> minv(n + 1, INF);
        vector<bool> used(n + 1, false);
        do {
            used[j0] = true;
            int i0 = p[j0], j1 = 0;
            long long delta = INF;
            for (int j = 1; j <= n; j++) {
                if (!used[j]) {
                    long long cur = a[i0][j] - u[i0] - v[j];
                    if (cur < minv[j]) { minv[j] = cur; way[j] = j0; }
                    if (minv[j] < delta) { delta = minv[j]; j1 = j; }
                }
            }
            for (int j = 0; j <= n; j++) {
                if (used[j]) { u[p[j]] += delta; v[j] -= delta; }
                else minv[j] -= delta;
            }
            j0 = j1;
        } while (p[j0] != 0);

        do {
            int j1 = way[j0];
            p[j0] = p[j1];
            j0 = j1;
        } while (j0);
    }

    vector<int> assignTask(n + 1);
    for (int j = 1; j <= n; j++) assignTask[p[j]] = j;

    cout << -v[0] << "\\n";
    for (int i = 1; i <= n; i++) cout << i << " " << assignTask[i] << "\\n";
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

    let mut a = vec![vec![0i64; n + 1]; n + 1];
    for i in 1..=n {
        for j in 1..=n {
            a[i][j] = it.next().unwrap().parse().unwrap();
        }
    }

    let inf = i64::MAX / 4;
    let mut u = vec![0i64; n + 1];
    let mut v = vec![0i64; n + 1];
    let mut p = vec![0usize; n + 1];
    let mut way = vec![0usize; n + 1];

    for i in 1..=n {
        p[0] = i;
        let mut j0 = 0usize;
        let mut minv = vec![inf; n + 1];
        let mut used = vec![false; n + 1];
        loop {
            used[j0] = true;
            let i0 = p[j0];
            let mut delta = inf;
            let mut j1 = 0usize;
            for j in 1..=n {
                if !used[j] {
                    let cur = a[i0][j] - u[i0] - v[j];
                    if cur < minv[j] {
                        minv[j] = cur;
                        way[j] = j0;
                    }
                    if minv[j] < delta {
                        delta = minv[j];
                        j1 = j;
                    }
                }
            }
            for j in 0..=n {
                if used[j] {
                    u[p[j]] += delta;
                    v[j] -= delta;
                } else {
                    minv[j] -= delta;
                }
            }
            j0 = j1;
            if p[j0] == 0 {
                break;
            }
        }
        loop {
            let j1 = way[j0];
            p[j0] = p[j1];
            j0 = j1;
            if j0 == 0 {
                break;
            }
        }
    }

    let mut assign_task = vec![0usize; n + 1];
    for j in 1..=n {
        assign_task[p[j]] = j;
    }

    let mut out = format!("{}\\n", -v[0]);
    for i in 1..=n {
        out.push_str(&format!("{} {}\\n", i, assign_task[i]));
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

        long[][] a = new long[n + 1][n + 1];
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= n; j++) a[i][j] = fs.nextLong();
        }

        final long INF = Long.MAX_VALUE / 4;
        long[] u = new long[n + 1], v = new long[n + 1];
        int[] p = new int[n + 1], way = new int[n + 1];

        for (int i = 1; i <= n; i++) {
            p[0] = i;
            int j0 = 0;
            long[] minv = new long[n + 1];
            Arrays.fill(minv, INF);
            boolean[] used = new boolean[n + 1];
            do {
                used[j0] = true;
                int i0 = p[j0], j1 = 0;
                long delta = INF;
                for (int j = 1; j <= n; j++) {
                    if (!used[j]) {
                        long cur = a[i0][j] - u[i0] - v[j];
                        if (cur < minv[j]) { minv[j] = cur; way[j] = j0; }
                        if (minv[j] < delta) { delta = minv[j]; j1 = j; }
                    }
                }
                for (int j = 0; j <= n; j++) {
                    if (used[j]) { u[p[j]] += delta; v[j] -= delta; }
                    else minv[j] -= delta;
                }
                j0 = j1;
            } while (p[j0] != 0);

            do {
                int j1 = way[j0];
                p[j0] = p[j1];
                j0 = j1;
            } while (j0 != 0);
        }

        int[] assign = new int[n + 1];
        for (int j = 1; j <= n; j++) assign[p[j]] = j;

        StringBuilder sb = new StringBuilder();
        sb.append(-v[0]).append('\\n');
        for (int i = 1; i <= n; i++) sb.append(i).append(' ').append(assign[i]).append('\\n');
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
    a = [[0] * (n + 1)]
    for _ in range(n):
        a.append([0] + [int(next(it)) for _ in range(n)])

    INF = 10**18
    u = [0] * (n + 1)
    v = [0] * (n + 1)
    p = [0] * (n + 1)
    way = [0] * (n + 1)

    for i in range(1, n + 1):
        p[0] = i
        j0 = 0
        minv = [INF] * (n + 1)
        used = [False] * (n + 1)
        while True:
            used[j0] = True
            i0 = p[j0]
            delta = INF
            j1 = 0
            row = a[i0]
            ui0 = u[i0]
            for j in range(1, n + 1):
                if not used[j]:
                    cur = row[j] - ui0 - v[j]
                    if cur < minv[j]:
                        minv[j] = cur
                        way[j] = j0
                    if minv[j] < delta:
                        delta = minv[j]
                        j1 = j
            for j in range(n + 1):
                if used[j]:
                    u[p[j]] += delta
                    v[j] -= delta
                else:
                    minv[j] -= delta
            j0 = j1
            if p[j0] == 0:
                break

        while True:
            j1 = way[j0]
            p[j0] = p[j1]
            j0 = j1
            if j0 == 0:
                break

    assign = [0] * (n + 1)
    for j in range(1, n + 1):
        assign[p[j]] = j

    out = [str(-v[0])] + [f"{i} {assign[i]}" for i in range(1, n + 1)]
    sys.stdout.write("\\n".join(out) + "\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
idx = 0
n = tokens[idx].to_i; idx += 1
a = [Array.new(n + 1, 0)]
n.times do
  row = [0]
  n.times { row << tokens[idx].to_i; idx += 1 }
  a << row
end

INF = 10**18
u = Array.new(n + 1, 0)
v = Array.new(n + 1, 0)
p = Array.new(n + 1, 0)
way = Array.new(n + 1, 0)

(1..n).each do |i|
  p[0] = i
  j0 = 0
  minv = Array.new(n + 1, INF)
  used = Array.new(n + 1, false)
  loop do
    used[j0] = true
    i0 = p[j0]
    delta = INF
    j1 = 0
    (1..n).each do |j|
      next if used[j]
      cur = a[i0][j] - u[i0] - v[j]
      if cur < minv[j]
        minv[j] = cur
        way[j] = j0
      end
      if minv[j] < delta
        delta = minv[j]
        j1 = j
      end
    end
    (0..n).each do |j|
      if used[j]
        u[p[j]] += delta
        v[j] -= delta
      else
        minv[j] -= delta
      end
    end
    j0 = j1
    break if p[j0] == 0
  end

  loop do
    j1 = way[j0]
    p[j0] = p[j1]
    j0 = j1
    break if j0 == 0
  end
end

assign = Array.new(n + 1, 0)
(1..n).each { |j| assign[p[j]] = j }

out = [(-v[0]).to_s] + (1..n).map { |i| "#{i} #{assign[i]}" }
puts out.join("\\n")`,
      },
    },
    {
      id: 'ch45-p2',
      tier: 'Standard',
      ratingRange: '2050–2300',
      title: 'Parcel Delivery — Target K-Flow Min-Cost Routing With Parallel Multi-Edges',
      statement:
        'A shipping network has `N` warehouses and `M` directed routes `(a, b, r, c)`, where route `(a, b)` can carry up to `r` parcels at cost `c` per parcel. Multiple routes may connect the same pair `(a, b)` with different capacities and costs. Find the **minimum total cost** to deliver **exactly `K` parcels** from warehouse `1` to warehouse `N`, or print `-1` if impossible.',
      constraints: '1 <= N <= 500, 1 <= M <= 1000, 1 <= K <= 1000, 1 <= r, c <= 10^4',
      sampleInput: '4 5 3\n1 2 2 2\n1 3 2 5\n2 3 1 1\n2 4 1 6\n3 4 2 2',
      sampleOutput: '20',
      hints: [
        'Use Successive Shortest Paths with Johnson Potentials (`pot[v] += dist[v]` after each Dijkstra step). Note that `M` routes are stored directly in adjacency lists `adj[u]`, so parallel edges work automatically!',
        'Verify the sample manually: Path 1 sends `1` unit via `1->2->3->4` (cost `2+1+2=5`); Path 2 sends `1` unit via `1->2->4` (cost `2+6=8`); Path 3 sends `1` unit via `1->3->4` (cost `5+2=7`). Total flow = `3` parcels and minimum cost = `5 + 8 + 7 = 20`!',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, m;
    long long K;
    if (!(cin >> n >> m >> K)) return 0;

    struct Edge { int to, rev; long long cap, cost; };
    vector<vector<Edge>> adj(n + 1);
    for (int i = 0; i < m; i++) {
        int u, v;
        long long cap, c;
        cin >> u >> v >> cap >> c;
        adj[u].push_back({v, (int)adj[v].size(), cap, c});
        adj[v].push_back({u, (int)adj[u].size() - 1, 0, -c});
    }

    const long long INF = 4e18;
    vector<long long> pot(n + 1, 0), dist(n + 1);
    vector<int> pv(n + 1), pe(n + 1);
    long long flow = 0, totalCost = 0;

    while (flow < K) {
        fill(dist.begin(), dist.end(), INF);
        dist[1] = 0;
        priority_queue<pair<long long, int>, vector<pair<long long, int>>, greater<>> pq;
        pq.push({0, 1});
        while (!pq.empty()) {
            auto [d, u] = pq.top();
            pq.pop();
            if (d != dist[u]) continue;
            for (int i = 0; i < (int)adj[u].size(); i++) {
                const auto& e = adj[u][i];
                if (e.cap > 0) {
                    long long nd = d + e.cost + pot[u] - pot[e.to];
                    if (nd < dist[e.to]) {
                        dist[e.to] = nd;
                        pv[e.to] = u;
                        pe[e.to] = i;
                        pq.push({nd, e.to});
                    }
                }
            }
        }
        if (dist[n] == INF) break;
        for (int i = 1; i <= n; i++) if (dist[i] < INF) pot[i] += dist[i];

        long long push = K - flow;
        for (int v = n; v != 1; v = pv[v]) push = min(push, adj[pv[v]][pe[v]].cap);
        flow += push;
        totalCost += push * pot[n];
        for (int v = n; v != 1; v = pv[v]) {
            auto& e = adj[pv[v]][pe[v]];
            e.cap -= push;
            adj[v][e.rev].cap += push;
        }
    }
    cout << (flow < K ? -1 : totalCost) << "\\n";
    return 0;
}`,
        rust: `use std::cmp::Reverse;
use std::collections::BinaryHeap;
use std::io::{self, Read};

#[derive(Clone)]
struct Edge {
    to: usize,
    rev: usize,
    cap: i64,
    cost: i64,
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
    let k: i64 = it.next().unwrap().parse().unwrap();

    let mut adj = vec![Vec::new(); n + 1];
    for _ in 0..m {
        let u: usize = it.next().unwrap().parse().unwrap();
        let v: usize = it.next().unwrap().parse().unwrap();
        let cap: i64 = it.next().unwrap().parse().unwrap();
        let c: i64 = it.next().unwrap().parse().unwrap();
        let ru = adj[v].len();
        let rv = adj[u].len();
        adj[u].push(Edge { to: v, rev: ru, cap, cost: c });
        adj[v].push(Edge { to: u, rev: rv, cap: 0, cost: -c });
    }

    let inf = i64::MAX / 4;
    let mut pot = vec![0i64; n + 1];
    let mut dist = vec![inf; n + 1];
    let mut pv = vec![0usize; n + 1];
    let mut pe = vec![0usize; n + 1];
    let mut flow = 0i64;
    let mut total_cost = 0i64;

    while flow < k {
        dist.fill(inf);
        dist[1] = 0;
        let mut pq = BinaryHeap::new();
        pq.push(Reverse((0i64, 1usize)));

        while let Some(Reverse((d, u))) = pq.pop() {
            if d != dist[u] {
                continue;
            }
            for (i, e) in adj[u].iter().enumerate() {
                if e.cap > 0 {
                    let nd = d + e.cost + pot[u] - pot[e.to];
                    if nd < dist[e.to] {
                        dist[e.to] = nd;
                        pv[e.to] = u;
                        pe[e.to] = i;
                        pq.push(Reverse((nd, e.to)));
                    }
                }
            }
        }
        if dist[n] == inf {
            break;
        }
        for i in 1..=n {
            if dist[i] < inf {
                pot[i] += dist[i];
            }
        }

        let mut push = k - flow;
        let mut v = n;
        while v != 1 {
            push = push.min(adj[pv[v]][pe[v]].cap);
            v = pv[v];
        }
        flow += push;
        total_cost += push * pot[n];
        v = n;
        while v != 1 {
            let u = pv[v];
            let idx = pe[v];
            let rev = adj[u][idx].rev;
            adj[u][idx].cap -= push;
            adj[v][rev].cap += push;
            v = u;
        }
    }
    println!("{}", if flow < k { -1 } else { total_cost });
}`,
        java21: `import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.PriorityQueue;

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

    static final class Edge {
        int to, rev;
        long cap, cost;
        Edge(int to, int rev, long cap, long cost) { this.to = to; this.rev = rev; this.cap = cap; this.cost = cost; }
    }

    @SuppressWarnings("unchecked")
    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        long nIn = fs.nextLong();
        if (nIn == Long.MIN_VALUE) return;
        int n = (int) nIn, m = (int) fs.nextLong();
        long K = fs.nextLong();

        List<Edge>[] adj = new ArrayList[n + 1];
        for (int i = 1; i <= n; i++) adj[i] = new ArrayList<>();
        for (int i = 0; i < m; i++) {
            int u = (int) fs.nextLong(), v = (int) fs.nextLong();
            long cap = fs.nextLong(), c = fs.nextLong();
            adj[u].add(new Edge(v, adj[v].size(), cap, c));
            adj[v].add(new Edge(u, adj[u].size() - 1, 0, -c));
        }

        final long INF = Long.MAX_VALUE / 4;
        long[] pot = new long[n + 1], dist = new long[n + 1];
        int[] pv = new int[n + 1], pe = new int[n + 1];
        long flow = 0, totalCost = 0;

        while (flow < K) {
            Arrays.fill(dist, INF);
            dist[1] = 0;
            PriorityQueue<long[]> pq = new PriorityQueue<>(Comparator.comparingLong(a -> a[0]));
            pq.add(new long[]{0L, 1});
            while (!pq.isEmpty()) {
                long[] cur = pq.poll();
                long d = cur[0];
                int u = (int) cur[1];
                if (d != dist[u]) continue;
                for (int i = 0; i < adj[u].size(); i++) {
                    Edge e = adj[u].get(i);
                    if (e.cap > 0) {
                        long nd = d + e.cost + pot[u] - pot[e.to];
                        if (nd < dist[e.to]) {
                            dist[e.to] = nd;
                            pv[e.to] = u;
                            pe[e.to] = i;
                            pq.add(new long[]{nd, e.to});
                        }
                    }
                }
            }
            if (dist[n] == INF) break;
            for (int i = 1; i <= n; i++) if (dist[i] < INF) pot[i] += dist[i];

            long push = K - flow;
            for (int v = n; v != 1; v = pv[v]) push = Math.min(push, adj[pv[v]].get(pe[v]).cap);
            flow += push;
            totalCost += push * pot[n];
            for (int v = n; v != 1; v = pv[v]) {
                Edge e = adj[pv[v]].get(pe[v]);
                e.cap -= push;
                adj[v].get(e.rev).cap += push;
            }
        }
        System.out.println(flow < K ? -1 : totalCost);
    }
}`,
        python3: `import heapq
import sys

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    n = int(next(it))
    m = int(next(it))
    k = int(next(it))

    adj = [[] for _ in range(n + 1)]
    for _ in range(m):
        u = int(next(it))
        v = int(next(it))
        cap = int(next(it))
        cost = int(next(it))
        adj[u].append([v, len(adj[v]), cap, cost])
        adj[v].append([u, len(adj[u]) - 1, 0, -cost])

    INF = 10**18
    pot = [0] * (n + 1)
    flow = 0
    total_cost = 0

    while flow < k:
        dist = [INF] * (n + 1)
        pv = [0] * (n + 1)
        pe = [0] * (n + 1)
        dist[1] = 0
        pq = [(0, 1)]
        while pq:
            d, u = heapq.heappop(pq)
            if d != dist[u]:
                continue
            pu = pot[u]
            for i, (v, _, cap, c) in enumerate(adj[u]):
                if cap > 0:
                    nd = d + c + pu - pot[v]
                    if nd < dist[v]:
                        dist[v] = nd
                        pv[v] = u
                        pe[v] = i
                        heapq.heappush(pq, (nd, v))
        if dist[n] == INF:
            break
        for i in range(1, n + 1):
            if dist[i] < INF:
                pot[i] += dist[i]

        push = k - flow
        v = n
        while v != 1:
            push = min(push, adj[pv[v]][pe[v]][2])
            v = pv[v]
        flow += push
        total_cost += push * pot[n]
        v = n
        while v != 1:
            e = adj[pv[v]][pe[v]]
            e[2] -= push
            adj[v][e[1]][2] += push
            v = pv[v]

    sys.stdout.write(f"{-1 if flow < k else total_cost}\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
idx = 0
n = tokens[idx].to_i; m = tokens[idx + 1].to_i; k = tokens[idx + 2].to_i; idx += 3

adj = Array.new(n + 1) { [] }
m.times do
  u = tokens[idx].to_i; v = tokens[idx + 1].to_i
  cap = tokens[idx + 2].to_i; c = tokens[idx + 3].to_i; idx += 4
  adj[u] << [v, adj[v].length, cap, c]
  adj[v] << [u, adj[u].length - 1, 0, -c]
end

INF = 10**18
pot = Array.new(n + 1, 0)
flow = 0
total_cost = 0

class PriorityQ
  def initialize; @a = []; end
  def empty?; @a.empty?; end
  def push(x)
    @a << x
    i = @a.length - 1
    while i > 0
      p = (i - 1) >> 1
      break if @a[p][0] <= @a[i][0]
      @a[p], @a[i] = @a[i], @a[p]
      i = p
    end
  end
  def pop
    top = @a[0]
    last = @a.pop
    unless @a.empty?
      @a[0] = last
      i = 0; len = @a.length
      loop do
        l = (i << 1) + 1
        break if l >= len
        r = l + 1
        best = (r < len && @a[r][0] < @a[l][0]) ? r : l
        break if @a[i][0] <= @a[best][0]
        @a[i], @a[best] = @a[best], @a[i]
        i = best
      end
    end
    top
  end
end

while flow < k
  dist = Array.new(n + 1, INF)
  pv = Array.new(n + 1, 0)
  pe = Array.new(n + 1, 0)
  dist[1] = 0
  pq = PriorityQ.new
  pq.push([0, 1])

  until pq.empty?
    d, u = pq.pop
    next if d != dist[u]
    pu = pot[u]
    adj[u].each_with_index do |(v, _, cap, c), i|
      next if cap <= 0
      nd = d + c + pu - pot[v]
      if nd < dist[v]
        dist[v] = nd; pv[v] = u; pe[v] = i
        pq.push([nd, v])
      end
    end
  end

  break if dist[n] == INF
  (1..n).each { |i| pot[i] += dist[i] if dist[i] < INF }

  push = k - flow
  v = n
  while v != 1
    c = adj[pv[v]][pe[v]][2]
    push = c if c < push
    v = pv[v]
  end
  flow += push
  total_cost += push * pot[n]
  v = n
  while v != 1
    e = adj[pv[v]][pe[v]]
    e[2] -= push
    adj[v][e[1]][2] += push
    v = pv[v]
  end
end

puts(flow < k ? -1 : total_cost)`,
      },
    },
    {
      id: 'ch45-p3',
      tier: 'Boss',
      ratingRange: '2350–2600',
      title: 'Minimum-Cost Feasible Circulation With Lower Bounds & Negative Costs',
      statement:
        'Given a directed graph of `N` vertices and `M` edges `(u, v, low, high, cost)`, find a feasible circulation (`sum_in(v) == sum_out(v)` for all vertices) satisfying `low <= f(e) <= high` that **minimizes total cost** `sum(f(e) * cost(e))`. Note: edge `cost(e)` MAY BE NEGATIVE (even creating negative cycles—meaning full negative-cost saturation `f = high` must be pushed first and refunded via reversed positive-cost edges!). Output the minimum circulation cost, or `IMPOSSIBLE` if no valid circulation exists.',
      constraints: '1 <= N <= 250, 1 <= M <= 1500, 0 <= low <= high <= 10^4, |cost| <= 10^4',
      sampleInput: '3 3\n1 2 1 3 -5\n2 3 1 3 2\n3 1 1 3 1',
      sampleOutput: '-6',
      hints: [
        'For every edge `(u, v, low, high, cost)`: first force `low` units (`baseCost += low * cost; bal[u] -= low; bal[v] += low`), leaving remaining capacity `rem = high - low`.',
        'If `cost < 0`, **pre-saturate** the entire `rem` flow (`baseCost += rem * cost; bal[u] -= rem; bal[v] += rem`), and instead add the **reverse residual edge `(v -> u, cap = rem, cost = -cost > 0)`**! Now EVERY edge in the residual network has `cost >= 0`! Finally connect super-source `SS` to all `bal[i] > 0` (`cap = bal[i], cost = 0`) and all `bal[i] < 0` to `TT` (`cap = -bal[i], cost = 0`), run MCMF(`SS -> TT`), and check `flow == sum(positive bal)`!',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

// Min-Cost Circulation with Edge Lower Bounds & Negative Costs via Pre-Saturation + SS/TT
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, m;
    if (!(cin >> n >> m)) return 0;

    int SS = 0, TT = n + 1, V = n + 2;
    struct Edge { int to, rev; long long cap, cost; };
    vector<vector<Edge>> adj(V);
    auto addEdge = [&](int u, int v, long long cap, long long cost) {
        adj[u].push_back({v, (int)adj[v].size(), cap, cost});
        adj[v].push_back({u, (int)adj[u].size() - 1, 0, -cost});
    };

    vector<long long> bal(n + 1, 0);
    long long baseCost = 0;
    for (int i = 0; i < m; i++) {
        int u, v;
        long long low, high, cost;
        cin >> u >> v >> low >> high >> cost;
        if (low > high) {
            cout << "IMPOSSIBLE\\n";
            return 0;
        }
        baseCost += low * cost;
        bal[u] -= low;
        bal[v] += low;
        long long rem = high - low;
        if (rem > 0) {
            if (cost >= 0) {
                addEdge(u, v, rem, cost);
            } else {
                // Pre-saturate negative-cost capacity so all initial network costs stay >= 0!
                baseCost += rem * cost;
                bal[u] -= rem;
                bal[v] += rem;
                addEdge(v, u, rem, -cost);
            }
        }
    }

    long long need = 0;
    for (int i = 1; i <= n; i++) {
        if (bal[i] > 0) { addEdge(SS, i, bal[i], 0); need += bal[i]; }
        else if (bal[i] < 0) addEdge(i, TT, -bal[i], 0);
    }

    const long long INF = 4e18;
    vector<long long> pot(V, 0), dist(V);
    vector<int> pv(V), pe(V);
    long long flow = 0, extraCost = 0;

    while (flow < need) {
        fill(dist.begin(), dist.end(), INF);
        dist[SS] = 0;
        priority_queue<pair<long long, int>, vector<pair<long long, int>>, greater<>> pq;
        pq.push({0, SS});
        while (!pq.empty()) {
            auto [d, u] = pq.top();
            pq.pop();
            if (d != dist[u]) continue;
            for (int i = 0; i < (int)adj[u].size(); i++) {
                const auto& e = adj[u][i];
                if (e.cap > 0) {
                    long long nd = d + e.cost + pot[u] - pot[e.to];
                    if (nd < dist[e.to]) {
                        dist[e.to] = nd;
                        pv[e.to] = u;
                        pe[e.to] = i;
                        pq.push({nd, e.to});
                    }
                }
            }
        }
        if (dist[TT] == INF) break;
        for (int i = 0; i < V; i++) if (dist[i] < INF) pot[i] += dist[i];
        long long push = need - flow;
        for (int v = TT; v != SS; v = pv[v]) push = min(push, adj[pv[v]][pe[v]].cap);
        flow += push;
        extraCost += push * pot[TT];
        for (int v = TT; v != SS; v = pv[v]) {
            auto& e = adj[pv[v]][pe[v]];
            e.cap -= push;
            adj[v][e.rev].cap += push;
        }
    }

    if (flow < need) cout << "IMPOSSIBLE\\n";
    else cout << (baseCost + extraCost) << "\\n";
    return 0;
}`,
        rust: `use std::cmp::Reverse;
use std::collections::BinaryHeap;
use std::io::{self, Read};

#[derive(Clone)]
struct Edge {
    to: usize,
    rev: usize,
    cap: i64,
    cost: i64,
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

    let ss = 0usize;
    let tt = n + 1;
    let v_cnt = n + 2;
    let mut adj = vec![Vec::new(); v_cnt];
    let add_edge = |u: usize, v: usize, cap: i64, cost: i64, adj: &mut Vec<Vec<Edge>>| {
        let ru = adj[v].len();
        let rv = adj[u].len();
        adj[u].push(Edge { to: v, rev: ru, cap, cost });
        adj[v].push(Edge { to: u, rev: rv, cap: 0, cost: -cost });
    };

    let mut bal = vec![0i64; n + 1];
    let mut base_cost = 0i64;
    for _ in 0..m {
        let u: usize = it.next().unwrap().parse().unwrap();
        let v: usize = it.next().unwrap().parse().unwrap();
        let low: i64 = it.next().unwrap().parse().unwrap();
        let high: i64 = it.next().unwrap().parse().unwrap();
        let cost: i64 = it.next().unwrap().parse().unwrap();
        if low > high {
            println!("IMPOSSIBLE");
            return;
        }
        base_cost += low * cost;
        bal[u] -= low;
        bal[v] += low;
        let rem = high - low;
        if rem > 0 {
            if cost >= 0 {
                add_edge(u, v, rem, cost, &mut adj);
            } else {
                base_cost += rem * cost;
                bal[u] -= rem;
                bal[v] += rem;
                add_edge(v, u, rem, -cost, &mut adj);
            }
        }
    }

    let mut need = 0i64;
    for i in 1..=n {
        if bal[i] > 0 {
            add_edge(ss, i, bal[i], 0, &mut adj);
            need += bal[i];
        } else if bal[i] < 0 {
            add_edge(i, tt, -bal[i], 0, &mut adj);
        }
    }

    let inf = i64::MAX / 4;
    let mut pot = vec![0i64; v_cnt];
    let mut dist = vec![inf; v_cnt];
    let mut pv = vec![0usize; v_cnt];
    let mut pe = vec![0usize; v_cnt];
    let mut flow = 0i64;
    let mut extra_cost = 0i64;

    while flow < need {
        dist.fill(inf);
        dist[ss] = 0;
        let mut pq = BinaryHeap::new();
        pq.push(Reverse((0i64, ss)));
        while let Some(Reverse((d, u))) = pq.pop() {
            if d != dist[u] {
                continue;
            }
            for (i, e) in adj[u].iter().enumerate() {
                if e.cap > 0 {
                    let nd = d + e.cost + pot[u] - pot[e.to];
                    if nd < dist[e.to] {
                        dist[e.to] = nd;
                        pv[e.to] = u;
                        pe[e.to] = i;
                        pq.push(Reverse((nd, e.to)));
                    }
                }
            }
        }
        if dist[tt] == inf {
            break;
        }
        for i in 0..v_cnt {
            if dist[i] < inf {
                pot[i] += dist[i];
            }
        }
        let mut push = need - flow;
        let mut cur = tt;
        while cur != ss {
            push = push.min(adj[pv[cur]][pe[cur]].cap);
            cur = pv[cur];
        }
        flow += push;
        extra_cost += push * pot[tt];
        cur = tt;
        while cur != ss {
            let u = pv[cur];
            let idx = pe[cur];
            let rev = adj[u][idx].rev;
            adj[u][idx].cap -= push;
            adj[cur][rev].cap += push;
            cur = u;
        }
    }

    if flow < need {
        println!("IMPOSSIBLE");
    } else {
        println!("{}", base_cost + extra_cost);
    }
}`,
        java21: `import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.PriorityQueue;

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

    static final class Edge {
        int to, rev;
        long cap, cost;
        Edge(int to, int rev, long cap, long cost) { this.to = to; this.rev = rev; this.cap = cap; this.cost = cost; }
    }

    static void addEdge(List<Edge>[] adj, int u, int v, long cap, long cost) {
        adj[u].add(new Edge(v, adj[v].size(), cap, cost));
        adj[v].add(new Edge(u, adj[u].size() - 1, 0, -cost));
    }

    @SuppressWarnings("unchecked")
    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        long nIn = fs.nextLong();
        if (nIn == Long.MIN_VALUE) return;
        int n = (int) nIn, m = (int) fs.nextLong();
        int SS = 0, TT = n + 1, V = n + 2;

        List<Edge>[] adj = new ArrayList[V];
        for (int i = 0; i < V; i++) adj[i] = new ArrayList<>();

        long[] bal = new long[n + 1];
        long baseCost = 0;
        for (int i = 0; i < m; i++) {
            int u = (int) fs.nextLong(), v = (int) fs.nextLong();
            long low = fs.nextLong(), high = fs.nextLong(), cost = fs.nextLong();
            if (low > high) { System.out.println("IMPOSSIBLE"); return; }
            baseCost += low * cost;
            bal[u] -= low;
            bal[v] += low;
            long rem = high - low;
            if (rem > 0) {
                if (cost >= 0) addEdge(adj, u, v, rem, cost);
                else {
                    baseCost += rem * cost;
                    bal[u] -= rem;
                    bal[v] += rem;
                    addEdge(adj, v, u, rem, -cost);
                }
            }
        }

        long need = 0;
        for (int i = 1; i <= n; i++) {
            if (bal[i] > 0) { addEdge(adj, SS, i, bal[i], 0); need += bal[i]; }
            else if (bal[i] < 0) addEdge(adj, i, TT, -bal[i], 0);
        }

        final long INF = Long.MAX_VALUE / 4;
        long[] pot = new long[V], dist = new long[V];
        int[] pv = new int[V], pe = new int[V];
        long flow = 0, extraCost = 0;

        while (flow < need) {
            Arrays.fill(dist, INF);
            dist[SS] = 0;
            PriorityQueue<long[]> pq = new PriorityQueue<>(Comparator.comparingLong(a -> a[0]));
            pq.add(new long[]{0L, SS});
            while (!pq.isEmpty()) {
                long[] cur = pq.poll();
                long d = cur[0]; int u = (int) cur[1];
                if (d != dist[u]) continue;
                for (int i = 0; i < adj[u].size(); i++) {
                    Edge e = adj[u].get(i);
                    if (e.cap > 0) {
                        long nd = d + e.cost + pot[u] - pot[e.to];
                        if (nd < dist[e.to]) {
                            dist[e.to] = nd; pv[e.to] = u; pe[e.to] = i;
                            pq.add(new long[]{nd, e.to});
                        }
                    }
                }
            }
            if (dist[TT] == INF) break;
            for (int i = 0; i < V; i++) if (dist[i] < INF) pot[i] += dist[i];
            long push = need - flow;
            for (int v = TT; v != SS; v = pv[v]) push = Math.min(push, adj[pv[v]].get(pe[v]).cap);
            flow += push;
            extraCost += push * pot[TT];
            for (int v = TT; v != SS; v = pv[v]) {
                Edge e = adj[pv[v]].get(pe[v]);
                e.cap -= push;
                adj[v].get(e.rev).cap += push;
            }
        }
        System.out.println(flow < need ? "IMPOSSIBLE" : (baseCost + extraCost));
    }
}`,
        python3: `import heapq
import sys

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    n = int(next(it))
    m = int(next(it))
    SS, TT, V = 0, n + 1, n + 2
    adj = [[] for _ in range(V)]

    def add_edge(u: int, v: int, cap: int, cost: int) -> None:
        adj[u].append([v, len(adj[v]), cap, cost])
        adj[v].append([u, len(adj[u]) - 1, 0, -cost])

    bal = [0] * (n + 1)
    base_cost = 0
    for _ in range(m):
        u = int(next(it))
        v = int(next(it))
        low = int(next(it))
        high = int(next(it))
        cost = int(next(it))
        if low > high:
            sys.stdout.write("IMPOSSIBLE\\n")
            return
        base_cost += low * cost
        bal[u] -= low
        bal[v] += low
        rem = high - low
        if rem > 0:
            if cost >= 0:
                add_edge(u, v, rem, cost)
            else:
                base_cost += rem * cost
                bal[u] -= rem
                bal[v] += rem
                add_edge(v, u, rem, -cost)

    need = 0
    for i in range(1, n + 1):
        if bal[i] > 0:
            add_edge(SS, i, bal[i], 0)
            need += bal[i]
        elif bal[i] < 0:
            add_edge(i, TT, -bal[i], 0)

    INF = 10**18
    pot = [0] * V
    flow = 0
    extra_cost = 0

    while flow < need:
        dist = [INF] * V
        pv = [0] * V
        pe = [0] * V
        dist[SS] = 0
        pq = [(0, SS)]
        while pq:
            d, u = heapq.heappop(pq)
            if d != dist[u]:
                continue
            pu = pot[u]
            for i, (v, _, cap, c) in enumerate(adj[u]):
                if cap > 0:
                    nd = d + c + pu - pot[v]
                    if nd < dist[v]:
                        dist[v] = nd
                        pv[v] = u
                        pe[v] = i
                        heapq.heappush(pq, (nd, v))
        if dist[TT] == INF:
            break
        for i in range(V):
            if dist[i] < INF:
                pot[i] += dist[i]
        push = need - flow
        v = TT
        while v != SS:
            push = min(push, adj[pv[v]][pe[v]][2])
            v = pv[v]
        flow += push
        extra_cost += push * pot[TT]
        v = TT
        while v != SS:
            e = adj[pv[v]][pe[v]]
            e[2] -= push
            adj[v][e[1]][2] += push
            v = pv[v]

    sys.stdout.write("IMPOSSIBLE\\n" if flow < need else f"{base_cost + extra_cost}\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
idx = 0
n = tokens[idx].to_i; m = tokens[idx + 1].to_i; idx += 2
SS = 0
TT = n + 1
V = n + 2
adj = Array.new(V) { [] }

add_edge = lambda do |u, v, cap, cost|
  adj[u] << [v, adj[v].length, cap, cost]
  adj[v] << [u, adj[u].length - 1, 0, -cost]
end

bal = Array.new(n + 1, 0)
base_cost = 0
m.times do
  u = tokens[idx].to_i; v = tokens[idx + 1].to_i
  low = tokens[idx + 2].to_i; high = tokens[idx + 3].to_i; cost = tokens[idx + 4].to_i
  idx += 5
  if low > high
    puts "IMPOSSIBLE"
    exit
  end
  base_cost += low * cost
  bal[u] -= low
  bal[v] += low
  rem = high - low
  if rem > 0
    if cost >= 0
      add_edge.call(u, v, rem, cost)
    else
      base_cost += rem * cost
      bal[u] -= rem
      bal[v] += rem
      add_edge.call(v, u, rem, -cost)
    end
  end
end

need = 0
(1..n).each do |i|
  if bal[i] > 0
    add_edge.call(SS, i, bal[i], 0)
    need += bal[i]
  elsif bal[i] < 0
    add_edge.call(i, TT, -bal[i], 0)
  end
end

class MinPQ
  def initialize; @a = []; end
  def empty?; @a.empty?; end
  def push(x)
    @a << x; i = @a.length - 1
    while i > 0
      p = (i - 1) >> 1
      break if @a[p][0] <= @a[i][0]
      @a[p], @a[i] = @a[i], @a[p]; i = p
    end
  end
  def pop
    top = @a[0]; last = @a.pop
    unless @a.empty?
      @a[0] = last; i = 0; len = @a.length
      loop do
        l = (i << 1) + 1; break if l >= len
        r = l + 1; best = (r < len && @a[r][0] < @a[l][0]) ? r : l
        break if @a[i][0] <= @a[best][0]
        @a[i], @a[best] = @a[best], @a[i]; i = best
      end
    end
    top
  end
end

INF = 10**18
pot = Array.new(V, 0)
flow = 0
extra_cost = 0

while flow < need
  dist = Array.new(V, INF)
  pv = Array.new(V, 0)
  pe = Array.new(V, 0)
  dist[SS] = 0
  pq = MinPQ.new
  pq.push([0, SS])
  until pq.empty?
    d, u = pq.pop
    next if d != dist[u]
    pu = pot[u]
    adj[u].each_with_index do |(v, _, cap, c), i|
      next if cap <= 0
      nd = d + c + pu - pot[v]
      if nd < dist[v]
        dist[v] = nd; pv[v] = u; pe[v] = i; pq.push([nd, v])
      end
    end
  end
  break if dist[TT] == INF
  V.times { |i| pot[i] += dist[i] if dist[i] < INF }

  push = need - flow
  v = TT
  while v != SS
    c = adj[pv[v]][pe[v]][2]
    push = c if c < push
    v = pv[v]
  end
  flow += push
  extra_cost += push * pot[TT]
  v = TT
  while v != SS
    e = adj[pv[v]][pe[v]]
    e[2] -= push
    adj[v][e[1]][2] += push
    v = pv[v]
  end
end

puts(flow < need ? "IMPOSSIBLE" : (base_cost + extra_cost))`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'CSES',
      title: 'Task Assignment & Parcel Delivery',
      difficulty: 'Hard',
      url: 'https://cses.fi/problemset/task/2129',
      patternNote: 'Direct CSES benchmarks for O(N^3) Hungarian Assignment and Johnson-Potential MCMF.',
    },
    {
      platform: 'AtCoder',
      title: 'ACL Practice E - MinCostFlow',
      difficulty: '2000',
      url: 'https://atcoder.jp/contests/practice2/tasks/practice2_e',
      patternNote: 'Grid row/column constrained selection solved via Johnson-potential MCMF.',
    },
    {
      platform: 'Codeforces',
      title: 'Almost Permutation (CF 863F) & Dual Matching',
      difficulty: '2100',
      url: 'https://codeforces.com/problemset/problem/863/F',
      patternNote: 'Convert quadratic penalty `sum(cnt[v]^2)` into `2k - 1` parallel unit-capacity edges in MCMF!',
    },
    {
      platform: 'CodeChef',
      title: 'TRIPS / Lower-Bound Min-Cost Circulation',
      difficulty: 'Hard',
      url: 'https://www.codechef.com/problems/CHEFCOMP',
      patternNote: 'Demand-balanced SS/TT flow reduction for constrained schedules.',
    },
    {
      platform: 'HackerRank',
      title: 'Minimum Cost Flow / Matrix Assignment',
      difficulty: 'Hard',
      url: 'https://www.hackerrank.com/domains/algorithms',
      patternNote: 'Primal-dual Hungarian vs SPFA/Dijkstra residual networks.',
    },
    {
      platform: 'NeetCode 150',
      title: 'Maximum Compatibility Score Sum / Minimum Cost to Hire K Workers',
      difficulty: 'Hard Extension',
      url: 'https://leetcode.com/problems/maximum-compatibility-score-sum/',
      patternNote: 'Scales up from N=8 bitmask DP to N=500 O(N^3) Hungarian Algorithm.',
    },
  ],
  interviewNotes: [
    'Explain **Johnson Potentials** concisely: `reducedCost(u, v) = cost(u, v) + pot[u] - pot[v]` acts like an elevation map—subtracting `pot[v]` flattens negative reverse edges to `0` along shortest paths while telescoping to a pure constant `pot[T] - pot[S]` on every `S -> T` path!',
    'Know when to pick **Hungarian `O(N^3)`** vs **MCMF**: for `1`-to-`1` bipartite matching (`N <= 500`), Hungarian avoids building `N^2` residual edge structs and runs in `~10 ms`. For multi-unit capacities, convex costs (`1, 3, 5, ...` parallel edges), or intermediate nodes, build MCMF.',
    'Explain the **Lower-Bound + Negative-Cost Circulation** trick: pre-forcing `low` and pre-saturating negative-cost residual capacities converts ANY constrained negative-cost circulation into a pure non-negative `SS -> TT` MCMF problem.',
  ],
  projectBlueprint: {
    title: 'Global Supply-Chain Freight Routing & Warehouse Assignment Optimizer',
    tagline:
      'Dual logistics engine: routes multi-tier container shipments under lane capacities & costs via Johnson-Potential MCMF, and assigns regional hubs to depots in O(N^3) via Hungarian.',
    stackSummary: 'C++20 Johnson-Dijkstra MCMF Engine, O(N^3) Hungarian Dispatcher',
    asciiDiagram: `Supply Network:
  Factory_1 --(cap 4, $3/unit)--> Hub_A --(cap 5, $2/unit)--> Port_T
      \\-----(cap 3, $7/unit)-----> Hub_B --(cap 2, $1/unit)---/
  Johnson MCMF routes 6 containers at minimum cost while keeping all reduced costs >= 0!`,
    milestones: [
      {
        id: 'm1',
        title: '1. Potential-Stabilized Dijkstra Augmenter',
        detail: 'Route exact target container demand `K` with automatic SPFA negative-cost initialization.',
      },
      {
        id: 'm2',
        title: '2. Lower-Bound SLA Feasibility Checker',
        detail: 'Balance minimum shipment contracts `[low, high]` via `SS/TT` demand edges.',
      },
      {
        id: 'm3',
        title: '3. O(N^3) Driver-to-Depot Matrix Matcher',
        detail: 'Compute optimal global cost assignment and exact pairing manifest.',
      },
    ],
    starterCode: `#include <bits/stdc++.h>
using namespace std;

// Global Supply-Chain Freight Routing & Warehouse Assignment Optimizer
class FreightRouter {
    struct Edge { int to, rev; long long cap, cost; };
    int n;
    vector<vector<Edge>> adj;
public:
    FreightRouter(int n) : n(n), adj(n) {}

    void addLane(int u, int v, long long cap, long long costPerUnit) {
        adj[u].push_back({v, (int)adj[v].size(), cap, costPerUnit});
        adj[v].push_back({u, (int)adj[u].size() - 1, 0, -costPerUnit});
    }

    pair<long long, long long> routeDemand(int src, int dst, long long targetUnits) {
        const long long INF = 4e18;
        vector<long long> pot(n, 0), dist(n);
        vector<int> pv(n), pe(n);
        long long flow = 0, cost = 0;

        while (flow < targetUnits) {
            fill(dist.begin(), dist.end(), INF);
            dist[src] = 0;
            priority_queue<pair<long long, int>, vector<pair<long long, int>>, greater<>> pq;
            pq.push({0, src});
            while (!pq.empty()) {
                auto [d, u] = pq.top(); pq.pop();
                if (d != dist[u]) continue;
                for (int i = 0; i < (int)adj[u].size(); i++) {
                    const auto& e = adj[u][i];
                    if (e.cap > 0) {
                        long long nd = d + e.cost + pot[u] - pot[e.to];
                        if (nd < dist[e.to]) { dist[e.to] = nd; pv[e.to] = u; pe[e.to] = i; pq.push({nd, e.to}); }
                    }
                }
            }
            if (dist[dst] == INF) break;
            for (int i = 0; i < n; i++) if (dist[i] < INF) pot[i] += dist[i];
            long long push = targetUnits - flow;
            for (int v = dst; v != src; v = pv[v]) push = min(push, adj[pv[v]][pe[v]].cap);
            flow += push;
            cost += push * pot[dst];
            for (int v = dst; v != src; v = pv[v]) {
                auto& e = adj[pv[v]][pe[v]];
                e.cap -= push;
                adj[v][e.rev].cap += push;
            }
        }
        return {flow, cost};
    }
};

int main() {
    FreightRouter router(5); // 0=Port, 1..3=Hubs, 4=Warehouse
    router.addLane(0, 1, 4, 3);
    router.addLane(0, 2, 3, 7);
    router.addLane(1, 2, 2, 1);
    router.addLane(1, 4, 2, 6);
    router.addLane(2, 4, 4, 2);

    auto [routed, cost] = router.routeDemand(0, 4, 5);
    cout << "Containers Routed: " << routed << " | Total Shipping Cost: $" << cost << "\\n";
    return 0;
}`,
  },
};
