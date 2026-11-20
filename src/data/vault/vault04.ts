import type { VaultBreakdown } from '../../types/vault';

export const VAULT04_PROJECT_CLOSURE: VaultBreakdown = {
  slug: 'max-profit-project-selection-closure',
  title: 'Maximum-Profit Project Selection with Dependencies -> Minimum S-T Cut (Closure)',
  rating: 2400,
  ratingTier: '2200–2600',
  usacoDivision: 'Platinum',
  domain: 'Graph & Tree Theory',
  sourceTag: '2400-Rated Flow Reduction Vault (CF 1082G / ARC085E Closure Pattern)',
  reductionHeadline:
    'Convert arbitrary prerequisite implication graphs ("picking project u forces picking v") with positive revenues and negative costs into a pure S-T Minimum Cut.',
  stage1Statement: {
    statement:
      'A research lab has N candidate projects and M prerequisite rules. Project i yields net payoff w_i (w_i > 0 is revenue; w_i < 0 is a required cost). Each rule (u, v) states that if you select project u, you MUST also select project v (dependencies can form arbitrary directed graphs including cycles!). Output the maximum achievable total payoff and the chosen project IDs.',
    constraints: [
      '1 <= N <= 1000',
      '0 <= M <= 5000',
      '-10^9 <= w_i <= 10^9',
      'Time Limit: 2.0 seconds',
    ],
    sampleInput: '4 3\n10 -6 8 -5\n1 2\n3 2\n3 4',
    sampleOutput: '7\n1 2 3 4',
    sampleExplanation:
      'Wait: picking {1, 2} gives 10 - 6 = 4. Picking {3, 2, 4} gives 8 - 6 - 5 = -3 (worse). Picking {1, 2, 3, 4} gives 10 - 6 + 8 - 5 = 7! Why? Because project 2 (-6) is shared by both 1 and 3, Wait: if we pick {1, 2} ONLY -> payoff 4! If we pick {1, 2, 3, 4} -> 10 + 8 - 6 - 5 = 7! What if w = [10, -6, 4, -5]? Then {1, 2} = 4 while {1, 2, 3, 4} = 3. In our sample [10, -6, 8, -5], MaxFlow = 6 + 5 = 11 -> total_pos (18) - 11 = 7, selecting {1, 2, 3, 4}.',
  },
  stage2NaiveFailure: {
    naiveApproaches: [
      {
        approach: 'Topological DP or Tree DP on Dependency Graph',
        complexity: 'Undefined on DAGs with shared sinks / cycles',
        verdict: 'WA',
        reason:
          'When two profitable nodes (1 and 3) share the same costly dependency (2), naive subtree DP double-counts cost w_2 = -6! And if dependencies have cycles, topological DP crashes completely.',
      },
      {
        approach: 'Greedy Filtering ("Pick every project whose transitive closure has positive sum")',
        complexity: 'O(N * (N + M))',
        verdict: 'WA',
        reason:
          'Two projects might individually look unprofitable (-2 each when paying a shared -6 prerequisite) yet together earn +4 +4 -6 = +2! Greedy fails whenever shared costs create synergy.',
      },
      {
        approach: 'Bitmask Enumeration Over All 2^N Subsets',
        complexity: 'O(2^N * M)',
        verdict: 'TLE',
        reason:
          'N reaches 1000, making 2^1000 impossible even with branch-and-bound pruning.',
      },
    ],
    constraintWhispers: [
      'Shared dependencies behave like binary cuts: paying a prerequisite cost once unlocks every project pointing to it.',
      'Maximizing sum(selected) = Sum(all positive w_i) - [Sum(rejected positive w_i) + Sum(selected negative |w_j|)].',
      'Minimizing (rejected positives + selected negatives) subject to "never pick u without v" is literally an S-T Minimum Cut!',
    ],
  },
  stage3AhaReduction: {
    coreInsight:
      'Build flow network G_cut with Source S and Sink T. Partition vertices into Accepted (S-side) vs Rejected (T-side): every cut edge represents either forfeiting a profit (S -> i) or paying a cost (j -> T), while INF edges (u -> v) forbid leaving u in S and v in T.',
    steps: [
      {
        title: '1. Encode Profits & Costs as Finite Cut Capacities',
        proofNote:
          'Sum up P_total = sum_{w_i > 0} w_i as our optimistic baseline. If w_i > 0, add directed edge S -> i with cap w_i (if i ends on T-side, this edge is cut, costing w_i forfeited revenue). If w_i < 0, add directed edge i -> T with cap -w_i (if i ends on S-side, this edge is cut, costing |w_i| expense).',
      },
      {
        title: '2. Encode "u Requires v" as an Unbreakable INF Pipe',
        proofNote:
          'For every prerequisite (u, v), add directed edge u -> v with capacity INF = 10^15. Because a minimum cut has finite cost <= P_total, no INF edge can cross from S-side to T-side. Therefore u in S_side IMMEDIATELY forces v in S_side!',
      },
      {
        title: '3. Extract Both Optimal Payoff & Exact Selected Subset',
        proofNote:
          'Run Dinic Max-Flow from S to T. Maximum Profit = P_total - MaxFlow. Run one BFS from S in the final residual graph (cap > 0): every vertex i reachable from S forms the exact optimal accepted project set!',
      },
    ],
  },
  stage4DryRun: {
    intro:
      'Trace the 4-project sample: w = [10, -6, 8, -5] with dependencies 1->2, 3->2, 3->4. Watch how S-T Min-Cut handles the shared prerequisite node 2 without double-counting.',
    traceSteps: [
      {
        stepNumber: 1,
        title: 'Build Closure Flow Network (P_total = 10 + 8 = 18)',
        explanation:
          'Add S->1 (10), S->3 (8), 2->T (6), 4->T (5), plus INF bridges 1->2, 3->2, 3->4. Optimistic baseline revenue = 18.',
        mode: 'graph',
        graph: {
          calloutMetric: 'Baseline Profit P_total = 18 | Edges: S->1(10), S->3(8), 2->T(6), 4->T(5)',
          nodes: [
            { id: 'S', label: 'S', x: 75, y: 150, state: 'active', matchWith: null },
            { id: '1', label: '1 (+10)', x: 220, y: 75, state: 'even', matchWith: null },
            { id: '3', label: '3 (+8)', x: 220, y: 225, state: 'even', matchWith: null },
            { id: '2', label: '2 (-6)', x: 390, y: 75, state: 'odd', matchWith: null },
            { id: '4', label: '4 (-5)', x: 390, y: 225, state: 'odd', matchWith: null },
            { id: 'T', label: 'T', x: 525, y: 150, state: 'active', matchWith: null },
          ],
          edges: [
            { id: 's1', from: 'S', to: '1', weight: 10, state: 'default' },
            { id: 's3', from: 'S', to: '3', weight: 8, state: 'default' },
            { id: 'd12', from: '1', to: '2', weight: 999, state: 'contracted' },
            { id: 'd32', from: '3', to: '2', weight: 999, state: 'contracted' },
            { id: 'd34', from: '3', to: '4', weight: 999, state: 'contracted' },
            { id: 't2', from: '2', to: 'T', weight: 6, state: 'default' },
            { id: 't4', from: '4', to: 'T', weight: 5, state: 'default' },
          ],
        },
        variables: { P_total: 18, Flow: 0, INF_Deps: '1->2, 3->2, 3->4' },
      },
      {
        stepNumber: 2,
        title: 'Push Blocking Flows Through Shared Prerequisite 2 and 4',
        explanation:
          'Dinic pushes 6 units along S -> 1 -> 2 -> T (saturating 2->T, residual S->1 = 4) and 5 units along S -> 3 -> 4 -> T (saturating 4->T, residual S->3 = 3). Total MaxFlow = 11.',
        mode: 'graph',
        graph: {
          calloutMetric: 'Max Flow = 11 (2->T and 4->T Saturated) · Remaining S-Links: S->1(4), S->3(3)',
          nodes: [
            { id: 'S', label: 'S', x: 75, y: 150, state: 'even', matchWith: null },
            { id: '1', label: '1 (res=4)', x: 220, y: 75, state: 'even', matchWith: null },
            { id: '3', label: '3 (res=3)', x: 220, y: 225, state: 'even', matchWith: null },
            { id: '2', label: '2 (via INF)', x: 390, y: 75, state: 'even', matchWith: null },
            { id: '4', label: '4 (via INF)', x: 390, y: 225, state: 'even', matchWith: null },
            { id: 'T', label: 'T', x: 525, y: 150, state: 'odd', matchWith: null },
          ],
          edges: [
            { id: 's1', from: 'S', to: '1', weight: 4, state: 'augmenting' },
            { id: 's3', from: 'S', to: '3', weight: 3, state: 'augmenting' },
            { id: 'd12', from: '1', to: '2', weight: 993, state: 'augmenting' },
            { id: 'd32', from: '3', to: '2', weight: 999, state: 'augmenting' },
            { id: 'd34', from: '3', to: '4', weight: 994, state: 'augmenting' },
            { id: 't2', from: '2', to: 'T', weight: 0, state: 'blossom-cycle' },
            { id: 't4', from: '4', to: 'T', weight: 0, state: 'blossom-cycle' },
          ],
        },
        variables: { MaxFlow: 11, OptimalProfit: '18 - 11 = 7', CutEdges: '2->T (6), 4->T (5)' },
      },
      {
        stepNumber: 3,
        title: 'Residual BFS Extracts Optimal Subset {1, 2, 3, 4} (Profit = 7)',
        explanation:
          'From S in the residual graph: S->1 (cap 4 > 0) reaches 1; 1->2 (cap > 0) reaches 2; S->3 (cap 3 > 0) reaches 3; 3->4 (cap > 0) reaches 4. Neither 2->T nor 4->T has positive capacity, so S-side = {1, 2, 3, 4} -> net profit 10 - 6 + 8 - 5 = 7!',
        mode: 'graph',
        graph: {
          calloutMetric: 'Accepted Set (S-Side) = {1, 2, 3, 4} · Maximum Payoff = 7',
          nodes: [
            { id: 'S', label: 'S (Cut-S)', x: 75, y: 150, state: 'matched', matchWith: null },
            { id: '1', label: '1 (PICK)', x: 220, y: 75, state: 'matched', matchWith: null },
            { id: '3', label: '3 (PICK)', x: 220, y: 225, state: 'matched', matchWith: null },
            { id: '2', label: '2 (PICK)', x: 390, y: 75, state: 'matched', matchWith: null },
            { id: '4', label: '4 (PICK)', x: 390, y: 225, state: 'matched', matchWith: null },
            { id: 'T', label: 'T (Cut-T)', x: 525, y: 150, state: 'odd', matchWith: null },
          ],
          edges: [
            { id: 's1', from: 'S', to: '1', weight: 4, state: 'matched' },
            { id: 's3', from: 'S', to: '3', weight: 3, state: 'matched' },
            { id: 'd12', from: '1', to: '2', weight: 993, state: 'matched' },
            { id: 'd32', from: '3', to: '2', weight: 999, state: 'matched' },
            { id: 'd34', from: '3', to: '4', weight: 994, state: 'matched' },
            { id: 't2', from: '2', to: 'T', weight: 0, state: 'blossom-cycle' },
            { id: 't4', from: '4', to: 'T', weight: 0, state: 'blossom-cycle' },
          ],
        },
        variables: { SelectedProjects: '{1, 2, 3, 4}', Payoff: 7, Status: 'Optimal' },
      },
    ],
  },
  stage5Solutions: {
    timeComplexity: 'O(V^2 E) Dinic worst-case (sub-millisecond for N <= 1000)',
    spaceComplexity: 'O(V + E)',
    implementations: {
      cpp20: `#include <bits/stdc++.h>
using namespace std;

struct Dinic {
    struct Edge { int to, rev; long long cap; };
    int n, s, t;
    vector<vector<Edge>> adj;
    vector<int> lvl, ptr;
    Dinic(int n, int s, int t) : n(n), s(s), t(t), adj(n), lvl(n), ptr(n) {}

    void add_edge(int u, int v, long long cap) {
        adj[u].push_back({v, (int)adj[v].size(), cap});
        adj[v].push_back({u, (int)adj[u].size() - 1, 0});
    }

    bool bfs() {
        fill(lvl.begin(), lvl.end(), -1);
        lvl[s] = 0;
        queue<int> q;
        q.push(s);
        while (!q.empty()) {
            int u = q.front(); q.pop();
            for (const auto& e : adj[u]) {
                if (e.cap > 0 && lvl[e.to] == -1) {
                    lvl[e.to] = lvl[u] + 1;
                    q.push(e.to);
                }
            }
        }
        return lvl[t] != -1;
    }

    long long dfs(int u, long long pushed) {
        if (pushed == 0 || u == t) return pushed;
        for (int& cid = ptr[u]; cid < (int)adj[u].size(); ++cid) {
            auto& e = adj[u][cid];
            if (e.cap > 0 && lvl[e.to] == lvl[u] + 1) {
                long long tr = dfs(e.to, min(pushed, e.cap));
                if (tr > 0) {
                    e.cap -= tr;
                    adj[e.to][e.rev].cap += tr;
                    return tr;
                }
            }
        }
        return 0;
    }

    long long max_flow() {
        long long flow = 0, INF = (1LL << 58);
        while (bfs()) {
            fill(ptr.begin(), ptr.end(), 0);
            while (long long pushed = dfs(s, INF)) flow += pushed;
        }
        return flow;
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    if (!(cin >> n >> m)) return 0;
    int S = 0, T = n + 1;
    Dinic dinic(T + 1, S, T);
    long long total_pos = 0;
    const long long INF = (1LL << 54);
    for (int i = 1; i <= n; ++i) {
        long long w;
        cin >> w;
        if (w > 0) { total_pos += w; dinic.add_edge(S, i, w); }
        else if (w < 0) { dinic.add_edge(i, T, -w); }
    }
    for (int i = 0; i < m; ++i) {
        int u, v;
        cin >> u >> v;
        dinic.add_edge(u, v, INF);
    }
    long long best_profit = total_pos - dinic.max_flow();
    cout << best_profit << '\\n';

    vector<bool> vis(T + 1, false);
    queue<int> q;
    vis[S] = true; q.push(S);
    while (!q.empty()) {
        int u = q.front(); q.pop();
        for (const auto& e : dinic.adj[u]) {
            if (e.cap > 0 && !vis[e.to]) { vis[e.to] = true; q.push(e.to); }
        }
    }
    vector<int> chosen;
    for (int i = 1; i <= n; ++i) if (vis[i]) chosen.push_back(i);
    for (int i = 0; i < (int)chosen.size(); ++i) {
        if (i) cout << ' ';
        cout << chosen[i];
    }
    cout << '\\n';
    return 0;
}`,
      rust: `use std::collections::VecDeque;
use std::io::{self, Read};

#[derive(Clone)]
struct Edge { to: usize, rev: usize, cap: i64 }

struct Dinic { n: usize, s: usize, t: usize, adj: Vec<Vec<Edge>>, lvl: Vec<i32>, ptr: Vec<usize> }
impl Dinic {
    fn new(n: usize, s: usize, t: usize) -> Self {
        Self { n, s, t, adj: vec![Vec::new(); n], lvl: vec![-1; n], ptr: vec![0; n] }
    }
    fn add_edge(&mut self, u: usize, v: usize, cap: i64) {
        let ru = self.adj[v].len(); let rv = self.adj[u].len();
        self.adj[u].push(Edge { to: v, rev: ru, cap });
        self.adj[v].push(Edge { to: u, rev: rv, cap: 0 });
    }
    fn bfs(&mut self) -> bool {
        self.lvl.fill(-1); self.lvl[self.s] = 0;
        let mut q = VecDeque::from([self.s]);
        while let Some(u) = q.pop_front() {
            for e in &self.adj[u] {
                if e.cap > 0 && self.lvl[e.to] == -1 {
                    self.lvl[e.to] = self.lvl[u] + 1;
                    q.push_back(e.to);
                }
            }
        }
        self.lvl[self.t] != -1
    }
    fn dfs(&mut self, u: usize, pushed: i64) -> i64 {
        if pushed == 0 || u == self.t { return pushed; }
        while self.ptr[u] < self.adj[u].len() {
            let cid = self.ptr[u];
            let (to, rev, cap) = (self.adj[u][cid].to, self.adj[u][cid].rev, self.adj[u][cid].cap);
            if cap > 0 && self.lvl[to] == self.lvl[u] + 1 {
                let tr = self.dfs(to, pushed.min(cap));
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
    fn max_flow(&mut self) -> i64 {
        let mut flow = 0; let inf = 1i64 << 58;
        while self.bfs() {
            self.ptr.fill(0);
            loop { let p = self.dfs(self.s, inf); if p == 0 { break; } flow += p; }
        }
        flow
    }
}

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let Some(ns) = it.next() else { return; };
    let n: usize = ns.parse().unwrap();
    let m: usize = it.next().unwrap().parse().unwrap();
    let (src, snk) = (0usize, n + 1);
    let mut dinic = Dinic::new(snk + 1, src, snk);
    let mut total_pos = 0i64;
    let inf = 1i64 << 54;
    for i in 1..=n {
        let w: i64 = it.next().unwrap().parse().unwrap();
        if w > 0 { total_pos += w; dinic.add_edge(src, i, w); }
        else if w < 0 { dinic.add_edge(i, snk, -w); }
    }
    for _ in 0..m {
        let u: usize = it.next().unwrap().parse().unwrap();
        let v: usize = it.next().unwrap().parse().unwrap();
        dinic.add_edge(u, v, inf);
    }
    println!("{}", total_pos - dinic.max_flow());
    let mut vis = vec![false; dinic.n];
    vis[src] = true;
    let mut q = VecDeque::from([src]);
    while let Some(u) = q.pop_front() {
        for e in &dinic.adj[u] {
            if e.cap > 0 && !vis[e.to] { vis[e.to] = true; q.push_back(e.to); }
        }
    }
    let chosen: Vec<String> = (1..=n).filter(|&i| vis[i]).map(|i| i.to_string()).collect();
    println!("{}", chosen.join(" "));
}`,
      java21: `import java.io.*;
import java.util.*;

public class Main {
    static int S, T, cnt = 0;
    static int[] head, to, nxt, lvl, ptr, q;
    static long[] cap;

    static void addEdge(int u, int v, long c) {
        to[cnt] = v; cap[cnt] = c; nxt[cnt] = head[u]; head[u] = cnt++;
        to[cnt] = u; cap[cnt] = 0; nxt[cnt] = head[v]; head[v] = cnt++;
    }

    static boolean bfs() {
        Arrays.fill(lvl, -1); lvl[S] = 0;
        int qh = 0, qt = 0; q[qt++] = S;
        while (qh < qt) {
            int u = q[qh++];
            for (int e = head[u]; e != -1; e = nxt[e])
                if (cap[e] > 0 && lvl[to[e]] == -1) { lvl[to[e]] = lvl[u] + 1; q[qt++] = to[e]; }
        }
        return lvl[T] != -1;
    }

    static long dfs(int u, long pushed) {
        if (pushed == 0 || u == T) return pushed;
        for (; ptr[u] != -1; ptr[u] = nxt[ptr[u]]) {
            int e = ptr[u];
            if (cap[e] > 0 && lvl[to[e]] == lvl[u] + 1) {
                long tr = dfs(to[e], Math.min(pushed, cap[e]));
                if (tr > 0) { cap[e] -= tr; cap[e ^ 1] += tr; return tr; }
            }
        }
        return 0;
    }

    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String line = br.readLine(); if (line == null) return;
        StringTokenizer st = new StringTokenizer(line);
        int n = Integer.parseInt(st.nextToken()), m = Integer.parseInt(st.nextToken());
        S = 0; T = n + 1; int V = T + 1, E = n + m + 5;
        head = new int[V]; Arrays.fill(head, -1);
        to = new int[2 * E]; nxt = new int[2 * E]; cap = new long[2 * E];
        lvl = new int[V]; ptr = new int[V]; q = new int[V];
        long totalPos = 0, INF = 1L << 54;
        st = new StringTokenizer(br.readLine());
        for (int i = 1; i <= n; i++) {
            long w = Long.parseLong(st.nextToken());
            if (w > 0) { totalPos += w; addEdge(S, i, w); }
            else if (w < 0) addEdge(i, T, -w);
        }
        for (int i = 0; i < m; i++) {
            st = new StringTokenizer(br.readLine());
            addEdge(Integer.parseInt(st.nextToken()), Integer.parseInt(st.nextToken()), INF);
        }
        long flow = 0;
        while (bfs()) { System.arraycopy(head, 0, ptr, 0, V); long p; while ((p = dfs(S, INF)) > 0) flow += p; }
        System.out.println(totalPos - flow);
        boolean[] vis = new boolean[V]; vis[S] = true; int qh = 0, qt = 0; q[qt++] = S;
        while (qh < qt) {
            int u = q[qh++];
            for (int e = head[u]; e != -1; e = nxt[e]) if (cap[e] > 0 && !vis[to[e]]) { vis[to[e]] = true; q[qt++] = to[e]; }
        }
        StringBuilder sb = new StringBuilder();
        for (int i = 1; i <= n; i++) if (vis[i]) { if (sb.length() > 0) sb.append(' '); sb.append(i); }
        System.out.println(sb);
    }
}`,
      python3: `from collections import deque
import sys

def solve():
    data = list(map(int, sys.stdin.buffer.read().split()))
    if not data:
        return
    it = iter(data)
    n, m = next(it), next(it)
    S, T = 0, n + 1
    g = [[] for _ in range(T + 1)]
    def add_edge(u, v, c):
        g[u].append([v, len(g[v]), c])
        g[v].append([u, len(g[u]) - 1, 0])

    total_pos = 0
    INF = 10**16
    for i in range(1, n + 1):
        w = next(it)
        if w > 0:
            total_pos += w
            add_edge(S, i, w)
        elif w < 0:
            add_edge(i, T, -w)
    for _ in range(m):
        add_edge(next(it), next(it), INF)

    lvl = [-1] * (T + 1)
    def bfs():
        for i in range(T + 1):
            lvl[i] = -1
        lvl[S] = 0
        q = deque([S])
        while q:
            u = q.popleft()
            for v, _, c in g[u]:
                if c > 0 and lvl[v] == -1:
                    lvl[v] = lvl[u] + 1
                    q.append(v)
        return lvl[T] != -1

    ptr = [0] * (T + 1)
    def dfs(u, pushed):
        if pushed == 0 or u == T:
            return pushed
        while ptr[u] < len(g[u]):
            v, rev, c = g[u][ptr[u]]
            if c > 0 and lvl[v] == lvl[u] + 1:
                tr = dfs(v, pushed if pushed < c else c)
                if tr > 0:
                    g[u][ptr[u]][2] -= tr
                    g[v][rev][2] += tr
                    return tr
            ptr[u] += 1
        return 0

    flow = 0
    while bfs():
        ptr = [0] * (T + 1)
        while True:
            p = dfs(S, INF)
            if p == 0:
                break
            flow += p

    print(total_pos - flow)
    vis = [False] * (T + 1)
    vis[S] = True
    q = deque([S])
    while q:
        u = q.popleft()
        for v, _, c in g[u]:
            if c > 0 and not vis[v]:
                vis[v] = True
                q.append(v)
    print(" ".join(str(i) for i in range(1, n + 1) if vis[i]))

if __name__ == "__main__":
    solve()`,
      ruby: `data = STDIN.read.split.map(&:to_i)
exit if data.empty?
n, m = data[0], data[1]; idx = 2
S = 0; T = n + 1; INF = 1 << 54
g = Array.new(T + 1) { [] }
add_edge = ->(u, v, c) { g[u] << [v, g[v].size, c]; g[v] << [u, g[u].size - 1, 0] }
total_pos = 0
(1..n).each do |i|
  w = data[idx]; idx += 1
  if w > 0; total_pos += w; add_edge.call(S, i, w)
  elsif w < 0; add_edge.call(i, T, -w)
  end
end
m.times { add_edge.call(data[idx], data[idx + 1], INF); idx += 2 }

lvl = Array.new(T + 1, -1)
bfs = -> do
  lvl.fill(-1); lvl[S] = 0; q = [S]; h = 0
  while h < q.size
    u = q[h]; h += 1
    g[u].each { |v, _, c| if c > 0 && lvl[v] == -1; lvl[v] = lvl[u] + 1; q << v; end }
  end
  lvl[T] != -1
end

ptr = Array.new(T + 1, 0); dfs = nil
dfs = ->(u, pushed) do
  return pushed if pushed == 0 || u == T
  while ptr[u] < g[u].size
    v, rev, c = g[u][ptr[u]]
    if c > 0 && lvl[v] == lvl[u] + 1
      tr = dfs.call(v, pushed < c ? pushed : c)
      if tr > 0; g[u][ptr[u]][2] -= tr; g[v][rev][2] += tr; return tr; end
    end
    ptr[u] += 1
  end
  0
end

flow = 0
while bfs.call
  ptr.fill(0)
  while (p = dfs.call(S, INF)) > 0; flow += p; end
end
puts total_pos - flow

vis = Array.new(T + 1, false); vis[S] = true; q = [S]; h = 0
while h < q.size
  u = q[h]; h += 1
  g[u].each { |v, _, c| if c > 0 && !vis[v]; vis[v] = true; q << v; end }
end
puts (1..n).select { |i| vis[i] }.join(' ')`,
    },
  },
};
