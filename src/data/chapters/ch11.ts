import type { TheoryChapter } from '../../types/vault';

export const CH11_SHORTEST_PATHS: TheoryChapter = {
  slug: 'dijkstra-bellman-floyd',
  topicId: 'gr-31',
  title: 'Dijkstra, SPFA/Bellman-Ford & Floyd-Warshall',
  domain: 'Graph & Tree Theory',
  ratingTier: '1400–1600',
  usacoDivision: 'Gold',
  subtitle:
    'Master single-source non-negative shortest paths via lazy-deletion priority queues, negative-cycle / difference-constraint detection via Bellman-Ford, and O(V^3) all-pairs DP via Floyd-Warshall.',
  analogyTitle: 'The Expanding Toll-Road Wavefront & Currency Loop Detector Analogy',
  analogyBody:
    'Imagine cities linked by one-way toll highways. If every toll is >= 0 (Dijkstra), starting from City 1 creates an expanding wavefront of confirmed cheapest arrival times: whichever unvisited city currently sits at the top of your cheapest-ticket heap CANNOT possibly be beaten later by detouring through a farther city, because extra roads only add >= 0 cost! The moment a road offers a cashback rebate (negative edge weight), that greedy guarantee breaks—so Bellman-Ford stops trusting order and instead runs V - 1 rounds of "try relaxing every single edge." If round V still lowers someone’s cost, you’ve uncovered an infinite money-printing loop (negative cycle). Finally, when you have <= 500 airports and need every (i, j) pair distance at once, Floyd-Warshall loops k = 1..N on the outside and asks: "Is i -> k -> j cheaper than our current i -> j route?"',
  prerequisites: [
    {
      slug: 'bfs-dfs-01bfs-toposort',
      title: 'BFS, 0-1 BFS & State-Space Graph Modeling (dist[u][state])',
    },
  ],
  traceTitle: 'Interactive Dijkstra Min-Heap Relaxation & Stale-Entry Skip Visualizer',
  traceSubtitle:
    'Watch Dijkstra pop the minimum-distance vertex, relax outgoing edges, discard stale heap duplicates, or edit graph vertices/edges live.',
  allowDynamicGraphEdit: true,
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Step 1: Initialize dist[1] = 0, All Others = INF',
      explanation:
        'Push (0, node 1) into the min-heap. Directed weighted edges: 1->2(4), 1->3(1), 3->2(2), 2->4(1), 3->4(5), 4->5(3).',
      mode: 'graph',
      graph: {
        calloutMetric: 'PQ = [(0, 1)] | Settled = {}',
        nodes: [
          { id: '1', label: '1 (d=0)', x: 80, y: 150, state: 'active', matchWith: null },
          { id: '2', label: '2 (INF)', x: 240, y: 75, state: 'unmatched', matchWith: null },
          { id: '3', label: '3 (INF)', x: 240, y: 225, state: 'unmatched', matchWith: null },
          { id: '4', label: '4 (INF)', x: 400, y: 150, state: 'unmatched', matchWith: null },
          { id: '5', label: '5 (INF)', x: 530, y: 150, state: 'unmatched', matchWith: null },
        ],
        edges: [
          { id: 'e12', from: '1', to: '2', weight: 4, state: 'default' },
          { id: 'e13', from: '1', to: '3', weight: 1, state: 'default' },
          { id: 'e32', from: '3', to: '2', weight: 2, state: 'default' },
          { id: 'e24', from: '2', to: '4', weight: 1, state: 'default' },
          { id: 'e34', from: '3', to: '4', weight: 5, state: 'default' },
          { id: 'e45', from: '4', to: '5', weight: 3, state: 'default' },
        ],
      },
      variables: { Popped: 'Init', Dist2: 'INF', Dist3: 'INF', Dist4: 'INF', Dist5: 'INF' },
    },
    {
      stepNumber: 2,
      title: 'Step 2: Pop (0, 1) -> Relax Node 2 (=4) & Node 3 (=1)',
      explanation:
        'Node 1 settles at d=0. Relaxing 1->2 updates dist[2]=4 and pushes (4,2); relaxing 1->3 updates dist[3]=1 and pushes (1,3).',
      mode: 'graph',
      graph: {
        calloutMetric: 'PQ = [(1, 3), (4, 2)] | Settled = {1}',
        nodes: [
          { id: '1', label: '1* (d=0)', x: 80, y: 150, state: 'matched', matchWith: null },
          { id: '2', label: '2 (d=4)', x: 240, y: 75, state: 'even', matchWith: null },
          { id: '3', label: '3 (d=1)', x: 240, y: 225, state: 'active', matchWith: null },
          { id: '4', label: '4 (INF)', x: 400, y: 150, state: 'unmatched', matchWith: null },
          { id: '5', label: '5 (INF)', x: 530, y: 150, state: 'unmatched', matchWith: null },
        ],
        edges: [
          { id: 'e12', from: '1', to: '2', weight: 4, state: 'augmenting' },
          { id: 'e13', from: '1', to: '3', weight: 1, state: 'matched' },
          { id: 'e32', from: '3', to: '2', weight: 2, state: 'default' },
          { id: 'e24', from: '2', to: '4', weight: 1, state: 'default' },
          { id: 'e34', from: '3', to: '4', weight: 5, state: 'default' },
          { id: 'e45', from: '4', to: '5', weight: 3, state: 'default' },
        ],
      },
      variables: { Popped: '(0, 1)', Dist2: 4, Dist3: 1, Dist4: 'INF', Dist5: 'INF' },
    },
    {
      stepNumber: 3,
      title: 'Step 3: Pop (1, 3) -> Shortcut Node 2 to d=3 & Relax Node 4 (=6)',
      explanation:
        'Node 3 settles at d=1. Edge 3->2 (cost 1+2=3 < 4!) improves dist[2]=3 and pushes (3,2); old (4,2) remains in heap as stale. Also dist[4]=6.',
      mode: 'graph',
      graph: {
        calloutMetric: 'PQ = [(3, 2), (4, 2) stale, (6, 4)] | Settled = {1, 3}',
        nodes: [
          { id: '1', label: '1* (d=0)', x: 80, y: 150, state: 'matched', matchWith: null },
          { id: '2', label: '2 (d=3!)', x: 240, y: 75, state: 'active', matchWith: null },
          { id: '3', label: '3* (d=1)', x: 240, y: 225, state: 'matched', matchWith: null },
          { id: '4', label: '4 (d=6)', x: 400, y: 150, state: 'even', matchWith: null },
          { id: '5', label: '5 (INF)', x: 530, y: 150, state: 'unmatched', matchWith: null },
        ],
        edges: [
          { id: 'e12', from: '1', to: '2', weight: 4, state: 'default' },
          { id: 'e13', from: '1', to: '3', weight: 1, state: 'matched' },
          { id: 'e32', from: '3', to: '2', weight: 2, state: 'matched' },
          { id: 'e24', from: '2', to: '4', weight: 1, state: 'default' },
          { id: 'e34', from: '3', to: '4', weight: 5, state: 'augmenting' },
          { id: 'e45', from: '4', to: '5', weight: 3, state: 'default' },
        ],
      },
      variables: { Popped: '(1, 3)', Dist2: 3, Dist3: 1, Dist4: 6, StaleEntry: '(4, 2)' },
    },
    {
      stepNumber: 4,
      title: 'Step 4: Pop (3, 2) -> Improve Node 4 (=4), Skip Stale (4, 2), Settle Node 5 (=7)',
      explanation:
        'Node 2 settles at d=3 and lowers dist[4] from 6 to 4. When stale (4, 2) pops, 4 != dist[2] (3) immediately skips it! Finally 4 settles at 4 and sets dist[5]=7.',
      mode: 'graph',
      graph: {
        calloutMetric: 'Final dist[] = [0, 3, 1, 4, 7] | Stale pops skipped in O(1)',
        nodes: [
          { id: '1', label: '1* (d=0)', x: 80, y: 150, state: 'matched', matchWith: null },
          { id: '2', label: '2* (d=3)', x: 240, y: 75, state: 'matched', matchWith: null },
          { id: '3', label: '3* (d=1)', x: 240, y: 225, state: 'matched', matchWith: null },
          { id: '4', label: '4* (d=4)', x: 400, y: 150, state: 'matched', matchWith: null },
          { id: '5', label: '5* (d=7)', x: 530, y: 150, state: 'matched', matchWith: null },
        ],
        edges: [
          { id: 'e12', from: '1', to: '2', weight: 4, state: 'default' },
          { id: 'e13', from: '1', to: '3', weight: 1, state: 'matched' },
          { id: 'e32', from: '3', to: '2', weight: 2, state: 'matched' },
          { id: 'e24', from: '2', to: '4', weight: 1, state: 'matched' },
          { id: 'e34', from: '3', to: '4', weight: 5, state: 'default' },
          { id: 'e45', from: '4', to: '5', weight: 3, state: 'matched' },
        ],
      },
      variables: { Popped: '2 -> skip(4,2) -> 4 -> 5', Dist4: 4, Dist5: 7 },
    },
  ],
  reductionClues: [
    {
      clue: '"Minimum cost/time from node 1 to every node, weights >= 0, N, M <= 2e5"',
      translation: 'Standard Dijkstra with min-heap + stale-entry guard if (d != dist[u]) continue.',
    },
    {
      clue: '"You can use up to K free discount coupons / fly once at half price / flip edge parity"',
      translation: 'State-Space Dijkstra on vertex (u, used_coupons) with dist[u][k] of size N * (K + 1).',
    },
    {
      clue: '"Negative weights exist, detect arbitrage / infinite score / negative cycle"',
      translation: 'Bellman-Ford V-1 passes + V-th pass cycle markers propagated with BFS to reach target N.',
    },
    {
      clue: '"System of difference constraints: x_v - x_u <= w_i"',
      translation: 'Directed edge u -> v with weight w_i from super-source 0; shortest paths give valid x[], negative cycle means infeasible.',
    },
    {
      clue: '"N <= 500, Q <= 1e5 static pairwise shortest paths or adding new bidirectional roads incrementally"',
      translation: 'Floyd-Warshall O(N^3) upfront, or O(N^2) single-edge relaxation pass per added road.',
    },
  ],
  timeComplexity: 'Dijkstra: O((V + E) log V) | Bellman-Ford: O(VE) | Floyd-Warshall: O(V^3)',
  spaceComplexity: 'Dijkstra / Bellman-Ford: O(V + E) | Floyd-Warshall: O(V^2)',
  pitfalls: [
    {
      type: 'TLE',
      title: 'Forgetting Stale-Entry Guard in Lazy Dijkstra',
      detail:
        'Without `if (d != dist[u]) continue;` right after popping from the priority queue, every outdated entry re-iterates u’s adjacency list, turning dense or multi-relaxed graphs into O(E^2) TLE.',
    },
    {
      type: 'WA',
      title: 'Using INT_MAX / 1e9 Sentinel Instead of 1e18 (64-bit)',
      detail:
        'With N <= 10^5 and edge weights up to 10^9, shortest paths reach 10^14. Always use `long long` / `i64` / `long` with INF = 4e18 (avoiding overflow when doing INF + w).',
    },
    {
      type: 'WA',
      title: 'Looping Floyd-Warshall in (i, j, k) Order Instead of (k, i, j)',
      detail:
        'Intermediate vertex `k` MUST be the outermost loop so dist[i][j] transitions properly through vertices {1..k}. Placing k innermost misses multi-hop paths.',
    },
    {
      type: 'WA',
      title: 'SPFA Hacks & Reachability Bugs in Bellman-Ford',
      detail:
        'Codeforces tests often build grid-like anti-SPFA graphs that force SPFA to O(VE); use Dijkstra whenever weights >= 0. In Bellman-Ford, also skip edges whose source still has dist[u] == INF unless finding any global cycle.',
    },
  ],
  implementations: {
    cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, m;
    if (!(cin >> n >> m)) return 0;

    vector<vector<pair<int, long long>>> adj(n + 1);
    for (int i = 0; i < m; ++i) {
        int u, v;
        long long w;
        cin >> u >> v >> w;
        adj[u].push_back({v, w});
    }

    const long long INF = 4'000'000'000'000'000'000LL;
    vector<long long> dist(n + 1, INF);
    using State = pair<long long, int>;
    priority_queue<State, vector<State>, greater<State>> pq;

    dist[1] = 0;
    pq.push({0, 1});

    while (!pq.empty()) {
        auto [d, u] = pq.top();
        pq.pop();
        if (d != dist[u]) continue; // Skip stale heap entry
        for (auto [v, w] : adj[u]) {
            if (d + w < dist[v]) {
                dist[v] = d + w;
                pq.push({dist[v], v});
            }
        }
    }

    for (int i = 1; i <= n; ++i) {
        cout << (dist[i] >= INF / 2 ? -1 : dist[i]) << (i == n ? '\\n' : ' ');
    }
    return 0;
}`,
    rust: `use std::cmp::Reverse;
use std::collections::BinaryHeap;
use std::io::{self, Read};

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let n: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };
    let m: usize = it.next().unwrap().parse().unwrap();

    let mut adj = vec![Vec::<(usize, i64)>::new(); n + 1];
    for _ in 0..m {
        let u: usize = it.next().unwrap().parse().unwrap();
        let v: usize = it.next().unwrap().parse().unwrap();
        let w: i64 = it.next().unwrap().parse().unwrap();
        adj[u].push((v, w));
    }

    const INF: i64 = 4_000_000_000_000_000_000;
    let mut dist = vec![INF; n + 1];
    let mut pq = BinaryHeap::new();
    dist[1] = 0;
    pq.push(Reverse((0i64, 1usize)));

    while let Some(Reverse((d, u))) = pq.pop() {
        if d != dist[u] {
            continue;
        }
        for &(v, w) in &adj[u] {
            if d + w < dist[v] {
                dist[v] = d + w;
                pq.push(Reverse((dist[v], v)));
            }
        }
    }

    let out: Vec<String> = (1..=n)
        .map(|i| if dist[i] >= INF / 2 { "-1".to_string() } else { dist[i].to_string() })
        .collect();
    println!("{}", out.join(" "));
}`,
    java21: `import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.PriorityQueue;

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

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        long first = fs.nextLong();
        if (first == Long.MIN_VALUE) return;
        int n = (int) first;
        int m = fs.nextInt();

        int[] head = new int[n + 1];
        Arrays.fill(head, -1);
        int[] to = new int[m];
        int[] next = new int[m];
        long[] wt = new long[m];

        for (int i = 0; i < m; i++) {
            int u = fs.nextInt();
            int v = fs.nextInt();
            long w = fs.nextLong();
            to[i] = v;
            wt[i] = w;
            next[i] = head[u];
            head[u] = i;
        }

        final long INF = 4_000_000_000_000_000_000L;
        long[] dist = new long[n + 1];
        Arrays.fill(dist, INF);
        dist[1] = 0;

        PriorityQueue<long[]> pq = new PriorityQueue<>(Comparator.comparingLong(a -> a[0]));
        pq.add(new long[]{0L, 1L});

        while (!pq.isEmpty()) {
            long[] cur = pq.poll();
            long d = cur[0];
            int u = (int) cur[1];
            if (d != dist[u]) continue;
            for (int e = head[u]; e != -1; e = next[e]) {
                int v = to[e];
                long nd = d + wt[e];
                if (nd < dist[v]) {
                    dist[v] = nd;
                    pq.add(new long[]{nd, v});
                }
            }
        }

        StringBuilder sb = new StringBuilder();
        for (int i = 1; i <= n; i++) {
            if (i > 1) sb.append(' ');
            sb.append(dist[i] >= INF / 2 ? -1L : dist[i]);
        }
        System.out.println(sb);
    }
}`,
    python3: `import heapq
import sys

def solve() -> None:
    data = sys.stdin.buffer.read().split()
    if not data:
        return
    it = iter(data)
    n = int(next(it))
    m = int(next(it))

    adj = [[] for _ in range(n + 1)]
    for _ in range(m):
        u = int(next(it))
        v = int(next(it))
        w = int(next(it))
        adj[u].append((v, w))

    INF = 4 * 10**18
    dist = [INF] * (n + 1)
    dist[1] = 0
    pq = [(0, 1)]

    while pq:
        d, u = heapq.heappop(pq)
        if d != dist[u]:
            continue
        for v, w in adj[u]:
            nd = d + w
            if nd < dist[v]:
                dist[v] = nd
                heapq.heappush(pq, (nd, v))

    out = [str(-1 if dist[i] >= INF // 2 else dist[i]) for i in range(1, n + 1)]
    sys.stdout.write(" ".join(out) + "\\n")

if __name__ == "__main__":
    solve()`,
    ruby: `class MinHeap
  def initialize
    @a = []
  end

  def empty?
    @a.empty?
  end

  def push(d, u)
    @a << [d, u]
    i = @a.size - 1
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
      n = @a.size
      loop do
        l = (i << 1) + 1
        r = l + 1
        best = i
        best = l if l < n && @a[l][0] < @a[best][0]
        best = r if r < n && @a[r][0] < @a[best][0]
        break if best == i
        @a[i], @a[best] = @a[best], @a[i]
        i = best
      end
    end
    top
  end
end

data = STDIN.read.split.map(&:to_i)
exit if data.empty?
idx = 0
n = data[idx]; m = data[idx + 1]; idx += 2

adj = Array.new(n + 1) { [] }
m.times do
  u = data[idx]; v = data[idx + 1]; w = data[idx + 2]; idx += 3
  adj[u] << [v, w]
end

inf = 4 * 10**18
dist = Array.new(n + 1, inf)
dist[1] = 0
pq = MinHeap.new
pq.push(0, 1)

until pq.empty?
  d, u = pq.pop
  next if d != dist[u]
  adj[u].each do |v, w|
    nd = d + w
    if nd < dist[v]
      dist[v] = nd
      pq.push(nd, v)
    end
  end
end

puts (1..n).map { |i| dist[i] >= inf / 2 ? -1 : dist[i] }.join(" ")`,
  },
  practiceProblems: [
    {
      id: 'gr31-p1',
      tier: 'Warmup',
      ratingRange: '1300–1450',
      title: 'Shortest Routes I (Directed Flight Network)',
      statement:
        'There are N cities and M directed flight connections. Each flight starts at city A, ends at city B, and has a ticket length C >= 1. Determine the shortest route length from city 1 to every city 1..N.',
      constraints: '1 <= N <= 10^5, 1 <= M <= 2*10^5, 1 <= C <= 10^9.',
      sampleInput: `3 4
1 2 6
1 3 2
3 2 3
1 3 4`,
      sampleOutput: `0 5 2`,
      hints: [
        'Use 64-bit integers since sums along a path of length 10^5 can reach 10^14.',
        'Ignore multiple parallel edges cleanly by keeping all edges and letting stale-entry skip in Dijkstra pick the smallest one.',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    if (!(cin >> n >> m)) return 0;
    vector<vector<pair<int, long long>>> adj(n + 1);
    for (int i = 0; i < m; ++i) {
        int a, b; long long c;
        cin >> a >> b >> c;
        adj[a].push_back({b, c});
    }
    const long long INF = 4'000'000'000'000'000'000LL;
    vector<long long> dist(n + 1, INF);
    priority_queue<pair<long long, int>, vector<pair<long long, int>>, greater<>> pq;
    dist[1] = 0;
    pq.push({0, 1});
    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (d != dist[u]) continue;
        for (auto [v, w] : adj[u]) {
            if (d + w < dist[v]) {
                dist[v] = d + w;
                pq.push({dist[v], v});
            }
        }
    }
    for (int i = 1; i <= n; ++i) cout << dist[i] << (i == n ? '\\n' : ' ');
    return 0;
}`,
        rust: `use std::cmp::Reverse;
use std::collections::BinaryHeap;
use std::io::{self, Read};

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let n: usize = match it.next() { Some(x) => x.parse().unwrap(), None => return };
    let m: usize = it.next().unwrap().parse().unwrap();
    let mut adj = vec![Vec::<(usize, i64)>::new(); n + 1];
    for _ in 0..m {
        let a: usize = it.next().unwrap().parse().unwrap();
        let b: usize = it.next().unwrap().parse().unwrap();
        let c: i64 = it.next().unwrap().parse().unwrap();
        adj[a].push((b, c));
    }
    let mut dist = vec![i64::MAX / 4; n + 1];
    let mut pq = BinaryHeap::new();
    dist[1] = 0;
    pq.push(Reverse((0i64, 1usize)));
    while let Some(Reverse((d, u))) = pq.pop() {
        if d != dist[u] { continue; }
        for &(v, w) in &adj[u] {
            if d + w < dist[v] {
                dist[v] = d + w;
                pq.push(Reverse((dist[v], v)));
            }
        }
    }
    let ans: Vec<String> = (1..=n).map(|i| dist[i].to_string()).collect();
    println!("{}", ans.join(" "));
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
            long sgn = 1; if (c == '-') { sgn = -1; c = read(); }
            long v = 0; while (c > 32) { v = v * 10 + (c - '0'); c = read(); }
            return v * sgn;
        }
        int nextInt() throws IOException { return (int) nextLong(); }
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        long f = fs.nextLong();
        if (f == Long.MIN_VALUE) return;
        int n = (int) f, m = fs.nextInt();
        int[] head = new int[n + 1]; Arrays.fill(head, -1);
        int[] to = new int[m], next = new int[m]; long[] wt = new long[m];
        for (int i = 0; i < m; i++) {
            int a = fs.nextInt(), b = fs.nextInt(); long c = fs.nextLong();
            to[i] = b; wt[i] = c; next[i] = head[a]; head[a] = i;
        }
        long[] dist = new long[n + 1];
        Arrays.fill(dist, Long.MAX_VALUE / 4);
        dist[1] = 0;
        PriorityQueue<long[]> pq = new PriorityQueue<>(Comparator.comparingLong(x -> x[0]));
        pq.add(new long[]{0L, 1L});
        while (!pq.isEmpty()) {
            long[] cur = pq.poll();
            long d = cur[0]; int u = (int) cur[1];
            if (d != dist[u]) continue;
            for (int e = head[u]; e != -1; e = next[e]) {
                int v = to[e]; long nd = d + wt[e];
                if (nd < dist[v]) { dist[v] = nd; pq.add(new long[]{nd, v}); }
            }
        }
        StringBuilder sb = new StringBuilder();
        for (int i = 1; i <= n; i++) {
            if (i > 1) sb.append(' ');
            sb.append(dist[i]);
        }
        System.out.println(sb);
    }
}`,
        python3: `import heapq, sys
def solve():
    data = sys.stdin.buffer.read().split()
    if not data: return
    it = iter(data)
    n, m = int(next(it)), int(next(it))
    adj = [[] for _ in range(n + 1)]
    for _ in range(m):
        adj[int(next(it))].append((int(next(it)), int(next(it))))
    dist = [10**18] * (n + 1)
    dist[1] = 0
    pq = [(0, 1)]
    while pq:
        d, u = heapq.heappop(pq)
        if d != dist[u]: continue
        for v, w in adj[u]:
            if d + w < dist[v]:
                dist[v] = d + w
                heapq.heappush(pq, (dist[v], v))
    sys.stdout.write(" ".join(map(str, dist[1:])) + "\\n")
if __name__ == "__main__":
    solve()`,
        ruby: `class MinHeap
  def initialize; @a = []; end
  def empty?; @a.empty?; end
  def push(d, u)
    @a << [d, u]; i = @a.size - 1
    while i > 0
      p = (i - 1) >> 1; break if @a[p][0] <= @a[i][0]
      @a[p], @a[i] = @a[i], @a[p]; i = p
    end
  end
  def pop
    top = @a[0]; last = @a.pop
    unless @a.empty?
      @a[0] = last; i = 0; n = @a.size
      loop do
        l = (i << 1) + 1; r = l + 1; b = i
        b = l if l < n && @a[l][0] < @a[b][0]
        b = r if r < n && @a[r][0] < @a[b][0]
        break if b == i; @a[i], @a[b] = @a[b], @a[i]; i = b
      end
    end
    top
  end
end
data = STDIN.read.split.map(&:to_i)
exit if data.empty?
idx = 0; n = data[idx]; m = data[idx + 1]; idx += 2
adj = Array.new(n + 1) { [] }
m.times { adj[data[idx]] << [data[idx + 1], data[idx + 2]]; idx += 3 }
dist = Array.new(n + 1, 10**18); dist[1] = 0
pq = MinHeap.new; pq.push(0, 1)
until pq.empty?
  d, u = pq.pop; next if d != dist[u]
  adj[u].each { |v, w| if d + w < dist[v]; dist[v] = d + w; pq.push(dist[v], v); end }
end
puts dist[1..n].join(" ")`,
      },
    },
    {
      id: 'gr31-p2',
      tier: 'Standard',
      ratingRange: '1450–1600',
      title: 'Shortest Routes II (All-Pairs Floyd-Warshall)',
      statement:
        'Given N cities, M bidirectional weighted roads, and Q queries asking for the shortest path length between (a, b) (or -1 if unreachable).',
      constraints: '1 <= N <= 500, 1 <= M <= N^2, 1 <= Q <= 10^5, 1 <= C <= 10^9.',
      sampleInput: `4 3 5
1 2 5
1 3 9
2 3 3
1 2
2 1
1 3
1 4
3 2`,
      sampleOutput: `5
5
8
-1
3`,
      hints: [
        'Initialize dist[i][i] = 0 and use min(dist[a][b], c) when reading roads (there may be multiple roads between the same pair!).',
        'Run Floyd-Warshall with k outermost from 1 to N, answering each query in O(1).',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m, q;
    if (!(cin >> n >> m >> q)) return 0;
    const long long INF = 4'000'000'000'000'000'000LL;
    vector<vector<long long>> d(n + 1, vector<long long>(n + 1, INF));
    for (int i = 1; i <= n; ++i) d[i][i] = 0;
    for (int i = 0; i < m; ++i) {
        int a, b; long long c;
        cin >> a >> b >> c;
        d[a][b] = min(d[a][b], c);
        d[b][a] = min(d[b][a], c);
    }
    for (int k = 1; k <= n; ++k)
        for (int i = 1; i <= n; ++i) {
            if (d[i][k] == INF) continue;
            for (int j = 1; j <= n; ++j)
                if (d[k][j] < INF) d[i][j] = min(d[i][j], d[i][k] + d[k][j]);
        }
    while (q--) {
        int a, b; cin >> a >> b;
        cout << (d[a][b] >= INF / 2 ? -1 : d[a][b]) << '\\n';
    }
    return 0;
}`,
        rust: `use std::io::{self, Read};

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let n: usize = match it.next() { Some(x) => x.parse().unwrap(), None => return };
    let m: usize = it.next().unwrap().parse().unwrap();
    let q: usize = it.next().unwrap().parse().unwrap();
    const INF: i64 = 4_000_000_000_000_000_000;
    let mut d = vec![vec![INF; n + 1]; n + 1];
    for i in 1..=n { d[i][i] = 0; }
    for _ in 0..m {
        let a: usize = it.next().unwrap().parse().unwrap();
        let b: usize = it.next().unwrap().parse().unwrap();
        let c: i64 = it.next().unwrap().parse().unwrap();
        if c < d[a][b] { d[a][b] = c; d[b][a] = c; }
    }
    for k in 1..=n {
        for i in 1..=n {
            if d[i][k] == INF { continue; }
            for j in 1..=n {
                if d[k][j] < INF && d[i][k] + d[k][j] < d[i][j] {
                    d[i][j] = d[i][k] + d[k][j];
                }
            }
        }
    }
    let mut out = String::new();
    for _ in 0..q {
        let a: usize = it.next().unwrap().parse().unwrap();
        let b: usize = it.next().unwrap().parse().unwrap();
        let ans = if d[a][b] >= INF / 2 { -1 } else { d[a][b] };
        out.push_str(&format!("{}\\n", ans));
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

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        long f = fs.nextLong();
        if (f == Long.MIN_VALUE) return;
        int n = (int) f, m = fs.nextInt(), q = fs.nextInt();
        final long INF = 4_000_000_000_000_000_000L;
        long[][] d = new long[n + 1][n + 1];
        for (int i = 1; i <= n; i++) { Arrays.fill(d[i], INF); d[i][i] = 0; }
        for (int i = 0; i < m; i++) {
            int a = fs.nextInt(), b = fs.nextInt(); long c = fs.nextLong();
            if (c < d[a][b]) { d[a][b] = c; d[b][a] = c; }
        }
        for (int k = 1; k <= n; k++)
            for (int i = 1; i <= n; i++) {
                if (d[i][k] == INF) continue;
                for (int j = 1; j <= n; j++)
                    if (d[k][j] < INF && d[i][k] + d[k][j] < d[i][j])
                        d[i][j] = d[i][k] + d[k][j];
            }
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < q; i++) {
            long ans = d[fs.nextInt()][fs.nextInt()];
            sb.append(ans >= INF / 2 ? -1L : ans).append('\\n');
        }
        System.out.print(sb);
    }
}`,
        python3: `import sys
def solve():
    data = sys.stdin.buffer.read().split()
    if not data: return
    it = iter(data)
    n, m, q = int(next(it)), int(next(it)), int(next(it))
    INF = 4 * 10**18
    d = [[INF] * (n + 1) for _ in range(n + 1)]
    for i in range(1, n + 1): d[i][i] = 0
    for _ in range(m):
        a, b, c = int(next(it)), int(next(it)), int(next(it))
        if c < d[a][b]: d[a][b] = d[b][a] = c
    for k in range(1, n + 1):
        dk = d[k]
        for i in range(1, n + 1):
            dik = d[i][k]
            if dik == INF: continue
            di = d[i]
            for j in range(1, n + 1):
                nd = dik + dk[j]
                if nd < di[j]: di[j] = nd
    out = []
    for _ in range(q):
        ans = d[int(next(it))][int(next(it))]
        out.append("-1" if ans >= INF // 2 else str(ans))
    sys.stdout.write("\\n".join(out) + "\\n")
if __name__ == "__main__":
    solve()`,
        ruby: `data = STDIN.read.split.map(&:to_i)
exit if data.empty?
idx = 0; n = data[idx]; m = data[idx + 1]; q = data[idx + 2]; idx += 3
inf = 4 * 10**18
d = Array.new(n + 1) { Array.new(n + 1, inf) }
(1..n).each { |i| d[i][i] = 0 }
m.times do
  a = data[idx]; b = data[idx + 1]; c = data[idx + 2]; idx += 3
  if c < d[a][b]; d[a][b] = c; d[b][a] = c; end
end
(1..n).each do |k|
  dk = d[k]
  (1..n).each do |i|
    dik = d[i][k]; next if dik == inf
    di = d[i]
    (1..n).each { |j| nd = dik + dk[j]; di[j] = nd if nd < di[j] }
  end
end
out = []
q.times do
  ans = d[data[idx]][data[idx + 1]]; idx += 2
  out << (ans >= inf / 2 ? -1 : ans)
end
puts out.join("\\n")`,
      },
    },
    {
      id: 'gr31-p3',
      tier: 'Boss',
      ratingRange: '1600–1750',
      title: 'High Score (Bellman-Ford & Reachable Positive Cycle)',
      statement:
        'You traverse N rooms connected by M one-way tunnels from room 1 to room N. Each tunnel adds x_i (possibly negative) to your score. Find the maximum possible score reaching room N, or output -1 if you can obtain arbitrarily large scores along a 1 -> N walk.',
      constraints: '1 <= N <= 2500, 1 <= M <= 5000, -10^9 <= x_i <= 10^9.',
      sampleInput: `4 5
1 2 3
2 4 -1
1 3 -2
3 4 7
1 4 4`,
      sampleOutput: `5`,
      hints: [
        'Negate edge weights (w = -x) so maximizing score becomes minimizing distance, and a positive cycle becomes a negative cycle!',
        'A negative cycle only produces -1 if it is BOTH reachable from 1 AND can reach N. Run Bellman-Ford for N rounds, then propagate cycle-touched nodes along forward edges (or intersect reachFrom1 & canReachN).',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    if (!(cin >> n >> m)) return 0;
    struct Edge { int u, v; long long w; };
    vector<Edge> edges(m);
    vector<vector<int>> adj(n + 1), radj(n + 1);
    for (int i = 0; i < m; ++i) {
        long long x;
        cin >> edges[i].u >> edges[i].v >> x;
        edges[i].w = -x;
        adj[edges[i].u].push_back(edges[i].v);
        radj[edges[i].v].push_back(edges[i].u);
    }

    auto bfs = [&](int s, const vector<vector<int>>& g) {
        vector<char> vis(n + 1, 0);
        queue<int> q; q.push(s); vis[s] = 1;
        while (!q.empty()) {
            int u = q.front(); q.pop();
            for (int v : g[u]) if (!vis[v]) { vis[v] = 1; q.push(v); }
        }
        return vis;
    };
    auto from1 = bfs(1, adj);
    auto toN = bfs(n, radj);

    const long long INF = 4'000'000'000'000'000'000LL;
    vector<long long> dist(n + 1, INF);
    dist[1] = 0;
    for (int iter = 1; iter <= n; ++iter) {
        for (const auto& e : edges) {
            if (dist[e.u] == INF) continue;
            if (dist[e.u] + e.w < dist[e.v]) {
                dist[e.v] = dist[e.u] + e.w;
                if (iter == n && from1[e.v] && toN[e.v]) {
                    cout << -1 << '\\n';
                    return 0;
                }
            }
        }
    }
    cout << -dist[n] << '\\n';
    return 0;
}`,
        rust: `use std::collections::VecDeque;
use std::io::{self, Read};

fn bfs(start: usize, g: &[Vec<usize>]) -> Vec<bool> {
    let mut vis = vec![false; g.len()];
    let mut q = VecDeque::new();
    vis[start] = true;
    q.push_back(start);
    while let Some(u) = q.pop_front() {
        for &v in &g[u] {
            if !vis[v] { vis[v] = true; q.push_back(v); }
        }
    }
    vis
}

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let n: usize = match it.next() { Some(x) => x.parse().unwrap(), None => return };
    let m: usize = it.next().unwrap().parse().unwrap();
    let mut edges = Vec::with_capacity(m);
    let mut adj = vec![Vec::new(); n + 1];
    let mut radj = vec![Vec::new(); n + 1];
    for _ in 0..m {
        let u: usize = it.next().unwrap().parse().unwrap();
        let v: usize = it.next().unwrap().parse().unwrap();
        let x: i64 = it.next().unwrap().parse().unwrap();
        edges.push((u, v, -x));
        adj[u].push(v);
        radj[v].push(u);
    }
    let from1 = bfs(1, &adj);
    let to_n = bfs(n, &radj);
    const INF: i64 = 4_000_000_000_000_000_000;
    let mut dist = vec![INF; n + 1];
    dist[1] = 0;
    for iter in 1..=n {
        for &(u, v, w) in &edges {
            if dist[u] == INF { continue; }
            if dist[u] + w < dist[v] {
                dist[v] = dist[u] + w;
                if iter == n && from1[v] && to_n[v] {
                    println!("-1");
                    return;
                }
            }
        }
    }
    println!("{}", -dist[n]);
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

    static boolean[] bfs(int start, ArrayList<Integer>[] g, int n) {
        boolean[] vis = new boolean[n + 1];
        ArrayDeque<Integer> q = new ArrayDeque<>();
        vis[start] = true; q.add(start);
        while (!q.isEmpty()) {
            int u = q.poll();
            for (int v : g[u]) if (!vis[v]) { vis[v] = true; q.add(v); }
        }
        return vis;
    }

    @SuppressWarnings("unchecked")
    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        long f = fs.nextLong();
        if (f == Long.MIN_VALUE) return;
        int n = (int) f, m = fs.nextInt();
        int[] eu = new int[m], ev = new int[m]; long[] ew = new long[m];
        ArrayList<Integer>[] adj = new ArrayList[n + 1], radj = new ArrayList[n + 1];
        for (int i = 1; i <= n; i++) { adj[i] = new ArrayList<>(); radj[i] = new ArrayList<>(); }
        for (int i = 0; i < m; i++) {
            eu[i] = fs.nextInt(); ev[i] = fs.nextInt(); ew[i] = -fs.nextLong();
            adj[eu[i]].add(ev[i]); radj[ev[i]].add(eu[i]);
        }
        boolean[] from1 = bfs(1, adj, n), toN = bfs(n, radj, n);
        final long INF = 4_000_000_000_000_000_000L;
        long[] dist = new long[n + 1]; Arrays.fill(dist, INF); dist[1] = 0;
        for (int iter = 1; iter <= n; iter++) {
            for (int i = 0; i < m; i++) {
                int u = eu[i], v = ev[i]; long w = ew[i];
                if (dist[u] == INF) continue;
                if (dist[u] + w < dist[v]) {
                    dist[v] = dist[u] + w;
                    if (iter == n && from1[v] && toN[v]) { System.out.println(-1); return; }
                }
            }
        }
        System.out.println(-dist[n]);
    }
}`,
        python3: `from collections import deque
import sys

def bfs(s, g, n):
    vis = [False] * (n + 1)
    vis[s] = True
    q = deque([s])
    while q:
        u = q.popleft()
        for v in g[u]:
            if not vis[v]:
                vis[v] = True
                q.append(v)
    return vis

def solve():
    data = sys.stdin.buffer.read().split()
    if not data: return
    it = iter(data)
    n, m = int(next(it)), int(next(it))
    edges = []
    adj = [[] for _ in range(n + 1)]
    radj = [[] for _ in range(n + 1)]
    for _ in range(m):
        u, v, x = int(next(it)), int(next(it)), int(next(it))
        edges.append((u, v, -x))
        adj[u].append(v); radj[v].append(u)
    from1 = bfs(1, adj, n)
    to_n = bfs(n, radj, n)
    INF = 4 * 10**18
    dist = [INF] * (n + 1)
    dist[1] = 0
    for it_no in range(1, n + 1):
        for u, v, w in edges:
            if dist[u] != INF and dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                if it_no == n and from1[v] and to_n[v]:
                    print(-1)
                    return
    print(-dist[n])

if __name__ == "__main__":
    solve()`,
        ruby: `data = STDIN.read.split.map(&:to_i)
exit if data.empty?
idx = 0; n = data[idx]; m = data[idx + 1]; idx += 2
edges = []
adj = Array.new(n + 1) { [] }
radj = Array.new(n + 1) { [] }
m.times do
  u = data[idx]; v = data[idx + 1]; x = data[idx + 2]; idx += 3
  edges << [u, v, -x]
  adj[u] << v; radj[v] << u
end
bfs = ->(s, g) do
  vis = Array.new(n + 1, false); vis[s] = true; q = [s]; head = 0
  while head < q.size
    u = q[head]; head += 1
    g[u].each { |v| unless vis[v]; vis[v] = true; q << v; end }
  end
  vis
end
from1 = bfs.call(1, adj); to_n = bfs.call(n, radj)
inf = 4 * 10**18
dist = Array.new(n + 1, inf); dist[1] = 0
(1..n).each do |it|
  edges.each do |u, v, w|
    next if dist[u] == inf
    if dist[u] + w < dist[v]
      dist[v] = dist[u] + w
      if it == n && from1[v] && to_n[v]; puts -1; exit; end
    end
  end
end
puts(-dist[n])`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'CSES',
      title: 'Shortest Routes I, Shortest Routes II & High Score',
      difficulty: 'USACO Gold (1400–1700)',
      url: 'https://cses.fi/problemset/task/1671',
      patternNote: 'Covers the exact classic trio: Dijkstra, Floyd-Warshall, and Bellman-Ford cycle detection.',
    },
    {
      platform: 'AtCoder',
      title: 'ABC191 E / ABC252 E (Road Reduction / Dijkstra Tree)',
      difficulty: 'AtCoder Cyan (~1350)',
      url: 'https://atcoder.jp/contests/abc252/tasks/abc252_e',
      patternNote: 'Shortest-path tree edges extracted directly from Dijkstra parent pointers.',
    },
    {
      platform: 'Codeforces',
      title: 'CF 20C Dijkstra? & CF 1473E Minimum Path',
      difficulty: 'CF 1900 / 2400',
      url: 'https://codeforces.com/problemset/problem/20/C',
      patternNote: '20C tests standard Dijkstra path reconstruction; 1473E tests 4-state Dijkstra (skip max, double min).',
    },
    {
      platform: 'CodeChef',
      title: 'DIGJUMP / SNGRAPH (Multi-Source & State Dijkstra)',
      difficulty: 'CodeChef 3★–4★',
      url: 'https://www.codechef.com/tags/problems/dijkstra',
      patternNote: 'Multi-source seeding and zero-edge hub compression to beat dense O(N^2) graphs.',
    },
    {
      platform: 'HackerRank',
      title: 'Dijkstra: Shortest Reach 2 & Floyd: City of Blinding Lights',
      difficulty: 'Medium / Hard',
      url: 'https://www.hackerrank.com/challenges/dijkstrashortreach',
      patternNote: 'Benchmarks fast I/O + duplicate multi-edge handling in Dijkstra and Floyd-Warshall.',
    },
    {
      platform: 'NeetCode 150',
      title: 'Network Delay Time & Cheapest Flights Within K Stops',
      difficulty: 'FAANG Medium',
      url: 'https://leetcode.com/problemset/?search=Network+Delay+Time',
      patternNote: 'Network Delay Time is textbook Dijkstra; K-Stops tests layered Bellman-Ford / constrained relaxation.',
    },
  ],
  interviewNotes: [
    'Always explain why Dijkstra fails on negative weights (greedy settlement invariant breaks) and how lazy deletion (`if d != dist[u]: continue`) replaces decrease-key cleanly.',
    'Know when to clone vertices `(u, state)` inside Dijkstra (e.g., max K stops, 1 free edge discount, fuel tank capacity).',
  ],
  projectBlueprint: {
    title: 'Flight Network & Currency Arbitrage Detector',
    tagline:
      'Compute lowest-fare multi-hop itineraries with coupon states via Dijkstra and detect real-time negative-cycle FX arbitrage via Bellman-Ford.',
    stackSummary: 'TypeScript + Binary Min-Heap Dijkstra + Bellman-Ford Cycle Tracer',
    asciiDiagram:
      'Quote Feed (FX / Flights) ──▶ [Weighted Directed Graph]\n' +
      '                                 ├── weights >= 0 ──▶ Dijkstra Min-Heap Itinerary\n' +
      '                                 └── -log(rate)   ──▶ Bellman-Ford Arbitrage Loop',
    milestones: [
      {
        id: 'ch11-m1',
        title: 'Milestone 1: Zero-Allocation Binary Min-Heap',
        detail: 'Build a typed MinHeap with O(log E) push/pop and parent reconstruction for cheapest routes.',
      },
      {
        id: 'ch11-m2',
        title: 'Milestone 2: Bellman-Ford Arbitrage Scanner',
        detail: 'Transform exchange rates via -Math.log(rate) and trace back N steps to recover the exact profitable FX cycle.',
      },
      {
        id: 'ch11-m3',
        title: 'Milestone 3: All-Pairs Distance Matrix Cache',
        detail: 'Precompute Floyd-Warshall hub distances for instant O(1) latency estimation across core airports.',
      },
    ],
    starterCode: `export interface DirectedEdge {
  to: number;
  weight: number;
}

export function dijkstraShortestPaths(
  n: number,
  source: number,
  adj: DirectedEdge[][],
): { dist: Float64Array; parent: Int32Array } {
  const dist = new Float64Array(n).fill(Number.POSITIVE_INFINITY);
  const parent = new Int32Array(n).fill(-1);
  const heap: Array<[number, number]> = [[0, source]];
  dist[source] = 0;

  while (heap.length > 0) {
    // Swap min element out of binary heap
    const [d, u] = heap[0];
    const last = heap.pop()!;
    if (heap.length > 0) {
      heap[0] = last;
      let i = 0;
      while (true) {
        const l = i * 2 + 1;
        const r = l + 1;
        let smallest = i;
        if (l < heap.length && heap[l][0] < heap[smallest][0]) smallest = l;
        if (r < heap.length && heap[r][0] < heap[smallest][0]) smallest = r;
        if (smallest === i) break;
        [heap[i], heap[smallest]] = [heap[smallest], heap[i]];
        i = smallest;
      }
    }
    if (d !== dist[u]) continue;
    for (const edge of adj[u]) {
      const nd = d + edge.weight;
      if (nd < dist[edge.to]) {
        dist[edge.to] = nd;
        parent[edge.to] = u;
        heap.push([nd, edge.to]);
        let idx = heap.length - 1;
        while (idx > 0) {
          const p = (idx - 1) >> 1;
          if (heap[p][0] <= heap[idx][0]) break;
          [heap[p], heap[idx]] = [heap[idx], heap[p]];
          idx = p;
        }
      }
    }
  }
  return { dist, parent };
}`,
  },
};
