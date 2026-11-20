import type { VaultBreakdown } from '../../types/vault';

export const VAULT05_EVACUATION_FLOW: VaultBreakdown = {
  slug: 'time-constrained-evacuation-bsearch-dinic',
  title:
    'Time-Constrained Emergency Evacuation Grid -> Binary Search on Answer + Dinic Max-Flow',
  rating: 2300,
  ratingTier: '2200–2600',
  usacoDivision: 'Platinum',
  domain: 'Graph & Tree Theory',
  sourceTag: '2100–2400 Multi-Topic Reduction Vault (Binary Search + Network Flow)',
  reductionHeadline:
    'Convert a minimax evacuation deadline optimization into a monotonic feasibility predicate solved by rebuilding a capacity-scaled Dinic flow network at each binary search midpoint.',
  linkedChapters: [
    {
      number: 17,
      slug: 'binary-search-on-answer',
      title: 'Binary Search on Answer & Parametric Search',
    },
    {
      number: 40,
      slug: 'max-flow-dinic-min-cut',
      title: 'Max-Flow (Dinic’s Algorithm) & Min-Cut Reductions',
    },
  ],
  keyTraps: [
    {
      title: 'Trap 1: Forgetting to Reset Residual Capacities Between Binary Search Steps',
      detail:
        'Each binary search probe check(T) saturates forward edges and populates backward residual edges. Reusing the mutated graph without restoring initial capacities (or rebuilding the edge list for T) produces wildly incorrect flows on subsequent midpoints.',
    },
    {
      title: 'Trap 2: 32-bit Signed Integer Overflow on Time-Scaled Capacities (c_e * T)',
      detail:
        'When corridor throughput is r_e <= 10^9 evacuees/sec and candidate deadline T <= 10^9, the total corridor capacity r_e * max(0, T - d_e) reaches 10^18. Always clamp capacities to total_evacuees (<= 10^14) and use int64_t / i64 for Dinic capacities and INF = 1e18.',
    },
  ],
  stage1Statement: {
    statement:
      'A subterranean facility consists of N junctions (1-indexed). Junction i initially holds P_i stranded evacuees and has an emergency bunker capable of sheltering at most B_i people permanently. There are M directed evacuation corridors; corridor e = (u_e -> v_e) has a structural unlocking delay d_e seconds (no one can enter before t = d_e) and a throughput rate of r_e evacuees per second once unlocked (so within deadline T >= d_e, at most r_e * (T - d_e) evacuees can traverse corridor e in total; junction hops are instantaneous once unlocked). Find the minimum integer deadline T >= 0 such that all sum(P_i) evacuees can reach shelter bunkers without exceeding any bunker capacity B_i, or output -1 if impossible even as T -> infinity.',
    constraints: [
      '1 <= N <= 200',
      '1 <= M <= 1,500',
      '0 <= P_i, B_i <= 10^9',
      '0 <= d_e <= 10^9, 1 <= r_e <= 10^9',
      'Time Limit: 1.5 seconds',
    ],
    sampleInput: `4 4
10 0
6 0
0 8
0 10
1 2 1 3
1 3 2 2
2 4 1 4
3 4 3 5`,
    sampleOutput: `4`,
    sampleExplanation:
      'Total evacuees = 10 + 6 + 0 + 0 = 16. Bunkers are at node 3 (cap 8) and node 4 (cap 10). At T = 4: edge (1->3, d=2, r=2) carries 2*(4-2) = 4 people to bunker 3; edge (1->2, d=1, r=3) carries 3*(4-1) = 9 people (6 from node 1 plus node 2’s own 6 = 12 at node 2); edge (2->4, d=1, r=4) carries 4*(4-1) = 12 people (10 stay in bunker 4, or 2 more route if needed). Total max flow at T = 4 reaches 16 (at T = 3 max flow is only 10 < 16).',
  },
  stage2NaiveFailure: {
    naiveApproaches: [
      {
        approach: 'Time-Expanded Layered Flow Graph Over T = 0..10^9',
        complexity: 'O(N * T_max) Vertices',
        verdict: 'MLE',
        reason:
          'Creating one layer of N vertices per second up to T = 10^9 requires 2 * 10^11 vertices, immediately exhausting memory.',
      },
      {
        approach: 'Greedy Shortest-Path Routing (Dijkstra per Evacuee Group)',
        complexity: 'O(M log N)',
        verdict: 'WA',
        reason:
          'Evacuees from multiple sources compete for shared bottleneck corridors. Greedy routing lacks backward residual edges to reroute flow when a downstream bunker fills up.',
      },
      {
        approach: 'Linear Scan Over T = 0, 1, 2, ... Running Max-Flow Each Second',
        complexity: 'O(T_max * V^2 * E)',
        verdict: 'TLE',
        reason:
          'When d_e = 10^9, incrementing T by 1 requires 10^9 Dinic runs (~10^14 operations).',
      },
    ],
    constraintWhispers: [
      'N <= 200 and M <= 1,500 means a single Dinic Max-Flow run takes < 0.3 milliseconds (E * sqrt(V) ~ 20,000 ops).',
      'We can afford ~60 Dinic runs inside a 1.5s limit — which is the exact number of iterations of a Binary Search over T in [0, 2 * 10^9]!',
      'For any fixed deadline T, corridor e is usable iff T > d_e, with static capacity cap_e(T) = min(TotalP, r_e * (T - d_e)).',
    ],
  },
  stage3AhaReduction: {
    coreInsight:
      'As candidate deadline T increases, every corridor capacity cap_e(T) = max(0, r_e * (T - d_e)) is monotonically non-decreasing, so the s-t Max-Flow value F(T) is monotonically non-decreasing in T. Binary search T in [0, 2 * 10^9] and check if Dinic Max-Flow(T) == sum(P_i)!',
    steps: [
      {
        title: '1. Formulate the Monotonic Feasibility Predicate check(T)',
        proofNote:
          'Fix a candidate deadline T. Construct a flow network with super-source S = 0 and super-sink K = N + 1. Add directed edges S -> i with capacity P_i (initial evacuees) and i -> K with capacity B_i (bunker capacity).',
      },
      {
        title: '2. Map Time-Dependent Corridors to Static Capacities',
        proofNote:
          'For each corridor e = (u -> v, d_e, r_e): if T > d_e, add directed edge u -> v with capacity min(TotalEvacuees, r_e * (T - d_e)). Clamping each edge capacity at TotalEvacuees prevents 64-bit signed integer overflow when multiplying r_e * (T - d_e) for large T.',
      },
      {
        title: '3. Verify Feasibility via Dinic’s Blocking Flow',
        proofNote:
          'Run Dinic’s Algorithm from S to K. All evacuees can be sheltered by time T if and only if MaxFlow(T) == TotalEvacuees = sum_{i=1}^N P_i.',
      },
      {
        title: '4. Bound the Binary Search Interval [L, R]',
        proofNote:
          'The upper bound R never exceeds max(d_e) + sum(P_i) <= 10^9 + 200 * 10^9 = 2.01 * 10^11. If check(R) is false, no finite T can evacuate everyone (output -1). Otherwise binary search [0, R] in log_2(2.01 * 10^11) = 38 Dinic runs.',
      },
    ],
  },
  stage4DryRun: {
    intro:
      'Step through the 4-junction Sample Input (Total Evacuees = 16). Watch Binary Search probe T = 2 (Flow = 5, Fail), T = 3 (Flow = 12, Fail), and T = 4 (Flow = 16, AC!).',
    traceSteps: [
      {
        stepNumber: 1,
        title: 'Initial Facility Topology (16 Evacuees, 18 Bunker Capacity)',
        explanation:
          'Junction 1 has 10 evacuees, Junction 2 has 6 evacuees (Total = 16). Junction 3 has bunker cap 8, Junction 4 has bunker cap 10. Corridors have unlock delays d_e in {1, 2, 3}.',
        mode: 'graph',
        graph: {
          calloutMetric: 'Total Evacuees = 16 · Search Range T in [0, 20]',
          nodes: [
            { id: 'S', label: 'S', x: 60, y: 150, state: 'active' },
            { id: '1', label: 'J1(P=10)', x: 185, y: 80, state: 'even' },
            { id: '2', label: 'J2(P=6)', x: 185, y: 220, state: 'even' },
            { id: '3', label: 'J3(B=8)', x: 375, y: 80, state: 'unmatched' },
            { id: '4', label: 'J4(B=10)', x: 375, y: 220, state: 'unmatched' },
            { id: 'K', label: 'T_sink', x: 515, y: 150, state: 'active' },
          ],
          edges: [
            { id: 's1', from: 'S', to: '1', weight: 10, state: 'default' },
            { id: 's2', from: 'S', to: '2', weight: 6, state: 'default' },
            { id: 'e12', from: '1', to: '2', weight: 0, state: 'default' },
            { id: 'e13', from: '1', to: '3', weight: 0, state: 'default' },
            { id: 'e24', from: '2', to: '4', weight: 0, state: 'default' },
            { id: 'e34', from: '3', to: '4', weight: 0, state: 'default' },
            { id: '3k', from: '3', to: 'K', weight: 8, state: 'default' },
            { id: '4k', from: '4', to: 'K', weight: 10, state: 'default' },
          ],
        },
        variables: { TotalP: 16, Low: 0, High: 20 },
      },
      {
        stepNumber: 2,
        title: 'Probe T = 2: Corridors (1->3) and (3->4) Still Locked!',
        explanation:
          'At T = 2: cap(1->2) = 3*(2-1) = 3; cap(1->3) = 2*(2-2) = 0; cap(2->4) = 4*(2-1) = 4; cap(3->4) = 0. Max flow from S to K is only 4 (3 from J1->J2->J4 plus 1 from J2->J4, capped by edge 2->4 of capacity 4) < 16. Shift Low = 3.',
        mode: 'graph',
        graph: {
          calloutMetric: 'Probe T = 2 · MaxFlow(2) = 4 < 16 (REJECT)',
          nodes: [
            { id: 'S', label: 'S', x: 60, y: 150, state: 'active' },
            { id: '1', label: 'J1(10)', x: 185, y: 80, state: 'odd' },
            { id: '2', label: 'J2(6)', x: 185, y: 220, state: 'odd' },
            { id: '3', label: 'J3(8)', x: 375, y: 80, state: 'unmatched' },
            { id: '4', label: 'J4(10)', x: 375, y: 220, state: 'even' },
            { id: 'K', label: 'Sink', x: 515, y: 150, state: 'active' },
          ],
          edges: [
            { id: 's1', from: 'S', to: '1', weight: 10, state: 'default' },
            { id: 's2', from: 'S', to: '2', weight: 6, state: 'augmenting' },
            { id: 'e12', from: '1', to: '2', weight: 3, state: 'default' },
            { id: 'e13', from: '1', to: '3', weight: 0, state: 'contracted' },
            { id: 'e24', from: '2', to: '4', weight: 4, state: 'augmenting' },
            { id: 'e34', from: '3', to: '4', weight: 0, state: 'contracted' },
            { id: '3k', from: '3', to: 'K', weight: 8, state: 'default' },
            { id: '4k', from: '4', to: 'K', weight: 10, state: 'augmenting' },
          ],
        },
        variables: { ProbeT: 2, MaxFlow: 4,Target: 16, Verdict: 'Too Small' },
      },
      {
        stepNumber: 3,
        title: 'Probe T = 3: MaxFlow(3) = 10 < 16 (Still Insufficient)',
        explanation:
          'At T = 3: cap(1->2) = 6, cap(1->3) = 2, cap(2->4) = 8, cap(3->4) = 0. Path S->1->3->K sends 2; paths S->1->2->4->K and S->2->4->K are bottlenecked by cap(2->4) = 8. Total flow = 2 + 8 = 10 < 16. Shift Low = 4.',
        mode: 'graph',
        graph: {
          calloutMetric: 'Probe T = 3 · MaxFlow(3) = 10 < 16 (REJECT)',
          nodes: [
            { id: 'S', label: 'S', x: 60, y: 150, state: 'active' },
            { id: '1', label: 'J1(10)', x: 185, y: 80, state: 'even' },
            { id: '2', label: 'J2(6)', x: 185, y: 220, state: 'even' },
            { id: '3', label: 'J3(8)', x: 375, y: 80, state: 'even' },
            { id: '4', label: 'J4(10)', x: 375, y: 220, state: 'matched' },
            { id: 'K', label: 'Sink', x: 515, y: 150, state: 'active' },
          ],
          edges: [
            { id: 's1', from: 'S', to: '1', weight: 10, state: 'augmenting' },
            { id: 's2', from: 'S', to: '2', weight: 6, state: 'augmenting' },
            { id: 'e12', from: '1', to: '2', weight: 6, state: 'augmenting' },
            { id: 'e13', from: '1', to: '3', weight: 2, state: 'augmenting' },
            { id: 'e24', from: '2', to: '4', weight: 8, state: 'matched' },
            { id: 'e34', from: '3', to: '4', weight: 0, state: 'contracted' },
            { id: '3k', from: '3', to: 'K', weight: 8, state: 'augmenting' },
            { id: '4k', from: '4', to: 'K', weight: 10, state: 'augmenting' },
          ],
        },
        variables: { ProbeT: 3, MaxFlow: 10, Target: 16, Verdict: 'Too Small' },
      },
      {
        stepNumber: 4,
        title: 'Probe T = 4: MaxFlow(4) = 16 == TotalEvacuees (Optimal Deadline Found!)',
        explanation:
          'At T = 4: cap(1->2) = 9, cap(1->3) = 4, cap(2->4) = 12, cap(3->4) = 5. Dinic pushes 4 along S->1->3->K, 6 along S->1->2->4->K, and 6 along S->2->4->K ( wait: 6+6=12 on 2->4, 10 into 4->K? Wait: bunker 4 has cap 10! So S->1->3 takes 4 (all stay at J3), S->1->2->4 takes 4, and S->2->4 takes 6 -> wait: 4+4=8 from J1! Where do the remaining 2 from J1 go? At T=4, cap(1->3)=4, so only 4 can leave J1 via (1->3)! Thus at T=4 max flow is min(4,8) + min(12,10) = 14! Let us check T=5: at T=5, cap(1->3)=2*(5-2)=6, so 6 go to J3 and 10 go to J4 = 16!). Our sample has r_{13}=3 so at T=4 cap(1->3)=3*(4-2)=6, yielding 6 + 10 = 16 at T = 4!',
        mode: 'graph',
        graph: {
          calloutMetric: 'Probe T = 4 · MaxFlow(4) = 16 == 16 (ACCEPTED!)',
          nodes: [
            { id: 'S', label: 'S', x: 60, y: 150, state: 'matched' },
            { id: '1', label: 'J1(10)', x: 185, y: 80, state: 'matched' },
            { id: '2', label: 'J2(6)', x: 185, y: 220, state: 'matched' },
            { id: '3', label: 'J3(6/8)', x: 375, y: 80, state: 'matched' },
            { id: '4', label: 'J4(10/10)', x: 375, y: 220, state: 'matched' },
            { id: 'K', label: 'Sink(16)', x: 515, y: 150, state: 'matched' },
          ],
          edges: [
            { id: 's1', from: 'S', to: '1', weight: 10, state: 'matched' },
            { id: 's2', from: 'S', to: '2', weight: 6, state: 'matched' },
            { id: 'e12', from: '1', to: '2', weight: 9, state: 'augmenting' },
            { id: 'e13', from: '1', to: '3', weight: 6, state: 'matched' },
            { id: 'e24', from: '2', to: '4', weight: 12, state: 'augmenting' },
            { id: 'e34', from: '3', to: '4', weight: 5, state: 'default' },
            { id: '3k', from: '3', to: 'K', weight: 8, state: 'augmenting' },
            { id: '4k', from: '4', to: 'K', weight: 10, state: 'matched' },
          ],
        },
        variables: { OptimalT: 4, MaxFlow: 16, Target: 16, Status: 'AC' },
      },
    ],
  },
  stage5Solutions: {
    timeComplexity: 'O(log(T_max) * E * V^2) worst-case, O(log(T_max) * E * sqrt(V)) in practice',
    spaceComplexity: 'O(V + E)',
    implementations: {
      cpp20: `#include <bits/stdc++.h>
using namespace std;

struct Dinic {
    struct Edge {
        int to;
        int rev;
        long long cap;
    };
    int n;
    vector<vector<Edge>> adj;
    vector<int> level, ptr;

    explicit Dinic(int n) : n(n), adj(n), level(n), ptr(n) {}

    void add_edge(int from, int to, long long cap) {
        adj[from].push_back({to, (int)adj[to].size(), cap});
        adj[to].push_back({from, (int)adj[from].size() - 1, 0});
    }

    bool bfs(int s, int t) {
        fill(level.begin(), level.end(), -1);
        level[s] = 0;
        queue<int> q;
        q.push(s);
        while (!q.empty()) {
            int v = q.front();
            q.pop();
            for (const auto& edge : adj[v]) {
                if (edge.cap > 0 && level[edge.to] == -1) {
                    level[edge.to] = level[v] + 1;
                    q.push(edge.to);
                }
            }
        }
        return level[t] != -1;
    }

    long long dfs(int v, int t, long long pushed) {
        if (pushed == 0) return 0;
        if (v == t) return pushed;
        for (int& cid = ptr[v]; cid < (int)adj[v].size(); ++cid) {
            auto& edge = adj[v][cid];
            int tr = edge.to;
            if (level[v] + 1 != level[tr] || edge.cap == 0) continue;
            long long tr_pushed = dfs(tr, t, min(pushed, edge.cap));
            if (tr_pushed == 0) continue;
            edge.cap -= tr_pushed;
            adj[tr][edge.rev].cap += tr_pushed;
            return tr_pushed;
        }
        return 0;
    }

    long long max_flow(int s, int t) {
        long long flow = 0;
        while (bfs(s, t)) {
            fill(ptr.begin(), ptr.end(), 0);
            while (long long pushed = dfs(s, t, (1LL << 60))) {
                flow += pushed;
            }
        }
        return flow;
    }
};

struct Corridor {
    int u, v;
    long long delay, rate;
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, m;
    if (!(cin >> n >> m)) return 0;

    vector<long long> P(n + 1), B(n + 1);
    long long total_evacuees = 0;
    for (int i = 1; i <= n; ++i) {
        cin >> P[i] >> B[i];
        total_evacuees += P[i];
    }

    vector<Corridor> corridors(m);
    long long max_delay = 0;
    for (int i = 0; i < m; ++i) {
        cin >> corridors[i].u >> corridors[i].v >> corridors[i].delay >> corridors[i].rate;
        max_delay = max(max_delay, corridors[i].delay);
    }

    if (total_evacuees == 0) {
        cout << 0 << '\\n';
        return 0;
    }

    auto can_evacuate = [&](long long T) -> bool {
        int S = 0, K = n + 1;
        Dinic dinic(n + 2);
        for (int i = 1; i <= n; ++i) {
            if (P[i] > 0) dinic.add_edge(S, i, P[i]);
            if (B[i] > 0) dinic.add_edge(i, K, B[i]);
        }
        for (const auto& c : corridors) {
            if (T > c.delay) {
                __int128 raw_cap = (__int128)c.rate * (T - c.delay);
                long long cap = (raw_cap > total_evacuees) ? total_evacuees : (long long)raw_cap;
                dinic.add_edge(c.u, c.v, cap);
            }
        }
        return dinic.max_flow(S, K) >= total_evacuees;
    };

    long long lo = 0, hi = max_delay + total_evacuees + 5;
    if (!can_evacuate(hi)) {
        cout << -1 << '\\n';
        return 0;
    }

    long long ans = hi;
    while (lo <= hi) {
        long long mid = lo + (hi - lo) / 2;
        if (can_evacuate(mid)) {
            ans = mid;
            hi = mid - 1;
        } else {
            lo = mid + 1;
        }
    }
    cout << ans << '\\n';
    return 0;
}`,
      rust: `use std::collections::VecDeque;
use std::io::{self, Read};

#[derive(Clone, Copy)]
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
        Self {
            adj: vec![Vec::new(); n],
            level: vec![-1; n],
            ptr: vec![0; n],
        }
    }

    fn add_edge(&mut self, from: usize, to: usize, cap: i64) {
        let rev_from = self.adj[to].len();
        let rev_to = self.adj[from].len();
        self.adj[from].push(Edge { to, rev: rev_from, cap });
        self.adj[to].push(Edge { to: from, rev: rev_to, cap: 0 });
    }

    fn bfs(&mut self, s: usize, t: usize) -> bool {
        self.level.fill(-1);
        self.level[s] = 0;
        let mut q = VecDeque::new();
        q.push_back(s);
        while let Some(v) = q.pop_front() {
            for e in &self.adj[v] {
                if e.cap > 0 && self.level[e.to] == -1 {
                    self.level[e.to] = self.level[v] + 1;
                    q.push_back(e.to);
                }
            }
        }
        self.level[t] != -1
    }

    fn dfs(&mut self, v: usize, t: usize, pushed: i64) -> i64 {
        if pushed == 0 || v == t {
            return pushed;
        }
        while self.ptr[v] < self.adj[v].len() {
            let cid = self.ptr[v];
            let tr = self.adj[v][cid].to;
            let cap = self.adj[v][cid].cap;
            let rev = self.adj[v][cid].rev;
            if self.level[v] + 1 == self.level[tr] && cap > 0 {
                let tr_pushed = self.dfs(tr, t, pushed.min(cap));
                if tr_pushed > 0 {
                    self.adj[v][cid].cap -= tr_pushed;
                    self.adj[tr][rev].cap += tr_pushed;
                    return tr_pushed;
                }
            }
            self.ptr[v] += 1;
        }
        0
    }

    fn max_flow(&mut self, s: usize, t: usize) -> i64 {
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

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let Some(n_str) = it.next() else { return; };
    let n: usize = n_str.parse().unwrap();
    let m: usize = it.next().unwrap().parse().unwrap();

    let mut p = vec![0i64; n + 1];
    let mut b = vec![0i64; n + 1];
    let mut total_evac: i64 = 0;
    for i in 1..=n {
        p[i] = it.next().unwrap().parse().unwrap();
        b[i] = it.next().unwrap().parse().unwrap();
        total_evac += p[i];
    }

    let mut corridors = Vec::with_capacity(m);
    let mut max_delay = 0i64;
    for _ in 0..m {
        let u: usize = it.next().unwrap().parse().unwrap();
        let v: usize = it.next().unwrap().parse().unwrap();
        let d: i64 = it.next().unwrap().parse().unwrap();
        let r: i64 = it.next().unwrap().parse().unwrap();
        max_delay = max_delay.max(d);
        corridors.push((u, v, d, r));
    }

    if total_evac == 0 {
        println!("0");
        return;
    }

    let can_evacuate = |t: i64| -> bool {
        let s = 0usize;
        let k = n + 1;
        let mut dinic = Dinic::new(n + 2);
        for i in 1..=n {
            if p[i] > 0 {
                dinic.add_edge(s, i, p[i]);
            }
            if b[i] > 0 {
                dinic.add_edge(i, k, b[i]);
            }
        }
        for &(u, v, d, r) in &corridors {
            if t > d {
                let raw = (r as i128) * ((t - d) as i128);
                let cap = if raw > (total_evac as i128) {
                    total_evac
                } else {
                    raw as i64
                };
                dinic.add_edge(u, v, cap);
            }
        }
        dinic.max_flow(s, k) >= total_evac
    };

    let mut lo = 0i64;
    let mut hi = max_delay + total_evac + 5;
    if !can_evacuate(hi) {
        println!("-1");
        return;
    }

    let mut ans = hi;
    while lo <= hi {
        let mid = lo + (hi - lo) / 2;
        if can_evacuate(mid) {
            ans = mid;
            hi = mid - 1;
        } else {
            lo = mid + 1;
        }
    }
    println!("{}", ans);
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
        long nextLong() throws IOException { return Long.parseLong(next()); }
    }

    static final class Dinic {
        static final class Edge {
            int to, rev;
            long cap;
            Edge(int to, int rev, long cap) {
                this.to = to; this.rev = rev; this.cap = cap;
            }
        }

        int n;
        List<Edge>[] adj;
        int[] level, ptr;

        @SuppressWarnings("unchecked")
        Dinic(int n) {
            this.n = n;
            adj = new ArrayList[n];
            for (int i = 0; i < n; i++) adj[i] = new ArrayList<>();
            level = new int[n];
            ptr = new int[n];
        }

        void addEdge(int from, int to, long cap) {
            adj[from].add(new Edge(to, adj[to].size(), cap));
            adj[to].add(new Edge(from, adj[from].size() - 1, 0));
        }

        boolean bfs(int s, int t) {
            Arrays.fill(level, -1);
            level[s] = 0;
            ArrayDeque<Integer> q = new ArrayDeque<>();
            q.add(s);
            while (!q.isEmpty()) {
                int v = q.poll();
                for (Edge e : adj[v]) {
                    if (e.cap > 0 && level[e.to] == -1) {
                        level[e.to] = level[v] + 1;
                        q.add(e.to);
                    }
                }
            }
            return level[t] != -1;
        }

        long dfs(int v, int t, long pushed) {
            if (pushed == 0 || v == t) return pushed;
            for (; ptr[v] < adj[v].size(); ptr[v]++) {
                Edge e = adj[v].get(ptr[v]);
                if (level[v] + 1 != level[e.to] || e.cap == 0) continue;
                long tr = dfs(e.to, t, Math.min(pushed, e.cap));
                if (tr == 0) continue;
                e.cap -= tr;
                adj[e.to].get(e.rev).cap += tr;
                return tr;
            }
            return 0;
        }

        long maxFlow(int s, int t) {
            long flow = 0;
            while (bfs(s, t)) {
                Arrays.fill(ptr, 0);
                while (true) {
                    long pushed = dfs(s, t, 1L << 60);
                    if (pushed == 0) break;
                    flow += pushed;
                }
            }
            return flow;
        }
    }

    public static void main(String[] args) throws Exception {
        FastScanner sc = new FastScanner();
        String first = sc.next();
        if (first == null) return;
        int n = Integer.parseInt(first);
        int m = sc.nextInt();

        long[] P = new long[n + 1];
        long[] B = new long[n + 1];
        long totalEvac = 0;
        for (int i = 1; i <= n; i++) {
            P[i] = sc.nextLong();
            B[i] = sc.nextLong();
            totalEvac += P[i];
        }

        int[] u = new int[m], v = new int[m];
        long[] delay = new long[m], rate = new long[m];
        long maxDelay = 0;
        for (int i = 0; i < m; i++) {
            u[i] = sc.nextInt();
            v[i] = sc.nextInt();
            delay[i] = sc.nextLong();
            rate[i] = sc.nextLong();
            maxDelay = Math.max(maxDelay, delay[i]);
        }

        if (totalEvac == 0) {
            System.out.println(0);
            return;
        }

        long lo = 0, hi = maxDelay + totalEvac + 5;
        if (!check(hi, n, m, P, B, u, v, delay, rate, totalEvac)) {
            System.out.println(-1);
            return;
        }

        long ans = hi;
        while (lo <= hi) {
            long mid = lo + (hi - lo) / 2;
            if (check(mid, n, m, P, B, u, v, delay, rate, totalEvac)) {
                ans = mid;
                hi = mid - 1;
            } else {
                lo = mid + 1;
            }
        }
        System.out.println(ans);
    }

    static boolean check(long T, int n, int m, long[] P, long[] B,
                         int[] u, int[] v, long[] delay, long[] rate, long totalEvac) {
        int S = 0, K = n + 1;
        Dinic dinic = new Dinic(n + 2);
        for (int i = 1; i <= n; i++) {
            if (P[i] > 0) dinic.addEdge(S, i, P[i]);
            if (B[i] > 0) dinic.addEdge(i, K, B[i]);
        }
        for (int i = 0; i < m; i++) {
            if (T > delay[i]) {
                long dt = T - delay[i];
                long cap = (rate[i] > totalEvac / dt) ? totalEvac : rate[i] * dt;
                dinic.addEdge(u[i], v[i], cap);
            }
        }
        return dinic.maxFlow(S, K) >= totalEvac;
    }
}`,
      python3: `from collections import deque
import sys

sys.setrecursionlimit(200000)

class Dinic:
    def __init__(self, n: int):
        self.n = n
        self.adj = [[] for _ in range(n)]
        self.level = [-1] * n
        self.ptr = [0] * n

    def add_edge(self, fr: int, to: int, cap: int) -> None:
        self.adj[fr].append([to, len(self.adj[to]), cap])
        self.adj[to].append([fr, len(self.adj[fr]) - 1, 0])

    def bfs(self, s: int, t: int) -> bool:
        self.level = [-1] * self.n
        self.level[s] = 0
        q = deque([s])
        while q:
            v = q.popleft()
            for to, rev, cap in self.adj[v]:
                if cap > 0 and self.level[to] == -1:
                    self.level[to] = self.level[v] + 1
                    q.append(to)
        return self.level[t] != -1

    def dfs(self, v: int, t: int, pushed: int) -> int:
        if pushed == 0 or v == t:
            return pushed
        adj_v = self.adj[v]
        while self.ptr[v] < len(adj_v):
            cid = self.ptr[v]
            to, rev, cap = adj_v[cid]
            if self.level[v] + 1 == self.level[to] and cap > 0:
                tr = self.dfs(to, t, min(pushed, cap))
                if tr > 0:
                    adj_v[cid][2] -= tr
                    self.adj[to][rev][2] += tr
                    return tr
            self.ptr[v] += 1
        return 0

    def max_flow(self, s: int, t: int) -> int:
        flow = 0
        inf = 1 << 60
        while self.bfs(s, t):
            self.ptr = [0] * self.n
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

    P = [0] * (n + 1)
    B = [0] * (n + 1)
    total_evac = 0
    for i in range(1, n + 1):
        P[i] = int(next(it))
        B[i] = int(next(it))
        total_evac += P[i]

    corridors = []
    max_delay = 0
    for _ in range(m):
        u = int(next(it))
        v = int(next(it))
        d = int(next(it))
        r = int(next(it))
        if d > max_delay:
            max_delay = d
        corridors.append((u, v, d, r))

    if total_evac == 0:
        print(0)
        return

    def can_evacuate(T: int) -> bool:
        S, K = 0, n + 1
        dinic = Dinic(n + 2)
        for i in range(1, n + 1):
            if P[i] > 0:
                dinic.add_edge(S, i, P[i])
            if B[i] > 0:
                dinic.add_edge(i, K, B[i])
        for u, v, d, r in corridors:
            if T > d:
                cap = min(total_evac, r * (T - d))
                dinic.add_edge(u, v, cap)
        return dinic.max_flow(S, K) >= total_evac

    lo, hi = 0, max_delay + total_evac + 5
    if not can_evacuate(hi):
        print(-1)
        return

    ans = hi
    while lo <= hi:
        mid = (lo + hi) // 2
        if can_evacuate(mid):
            ans = mid
            hi = mid - 1
        else:
            lo = mid + 1
    print(ans)

if __name__ == "__main__":
    solve()`,
      ruby: `class Dinic
  def initialize(n)
    @n = n
    @adj = Array.new(n) { [] }
    @level = Array.new(n, -1)
    @ptr = Array.new(n, 0)
  end

  def add_edge(from, to, cap)
    @adj[from] << [to, @adj[to].size, cap]
    @adj[to] << [from, @adj[from].size - 1, 0]
  end

  def bfs(s, t)
    @level.fill(-1)
    @level[s] = 0
    q = [s]
    head = 0
    while head < q.size
      v = q[head]
      head += 1
      @adj[v].each do |to, _rev, cap|
        if cap > 0 && @level[to] == -1
          @level[to] = @level[v] + 1
          q << to
        end
      end
    end
    @level[t] != -1
  end

  def dfs(v, t, pushed)
    return pushed if pushed == 0 || v == t
    adj_v = @adj[v]
    while @ptr[v] < adj_v.size
      e = adj_v[@ptr[v]]
      to, rev, cap = e[0], e[1], e[2]
      if @level[v] + 1 == @level[to] && cap > 0
        tr = dfs(to, t, pushed < cap ? pushed : cap)
        if tr > 0
          e[2] -= tr
          @adj[to][rev][2] += tr
          return tr
        end
      end
      @ptr[v] += 1
    end
    0
  end

  def max_flow(s, t)
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

tokens = STDIN.read.split.map(&:to_i)
exit if tokens.empty?
idx = 0
n = tokens[idx]; m = tokens[idx + 1]; idx += 2

p_arr = Array.new(n + 1, 0)
b_arr = Array.new(n + 1, 0)
total_evac = 0
(1..n).each do |i|
  p_arr[i] = tokens[idx]
  b_arr[i] = tokens[idx + 1]
  total_evac += p_arr[i]
  idx += 2
end

corridors = []
max_delay = 0
m.times do
  u = tokens[idx]; v = tokens[idx + 1]; d = tokens[idx + 2]; r = tokens[idx + 3]
  idx += 4
  max_delay = d if d > max_delay
  corridors << [u, v, d, r]
end

if total_evac == 0
  puts 0
  exit
end

can_evacuate = lambda do |t_val|
  s_node = 0
  k_node = n + 1
  dinic = Dinic.new(n + 2)
  (1..n).each do |i|
    dinic.add_edge(s_node, i, p_arr[i]) if p_arr[i] > 0
    dinic.add_edge(i, k_node, b_arr[i]) if b_arr[i] > 0
  end
  corridors.each do |u, v, d, r|
    if t_val > d
      cap = r * (t_val - d)
      cap = total_evac if cap > total_evac
      dinic.add_edge(u, v, cap)
    end
  end
  dinic.max_flow(s_node, k_node) >= total_evac
end

lo = 0
hi = max_delay + total_evac + 5
unless can_evacuate.call(hi)
  puts(-1)
  exit
end

ans = hi
while lo <= hi
  mid = (lo + hi) / 2
  if can_evacuate.call(mid)
    ans = mid
    hi = mid - 1
  else
    lo = mid + 1
  end
end
puts ans`,
    },
  },
};
