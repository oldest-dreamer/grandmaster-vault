import type { TheoryChapter } from '../../types/vault';

export const CH03_BFS_STATE_GRAPH: TheoryChapter = {
  slug: 'bfs-dfs-01bfs-toposort',
  topicId: 'gr-30',
  title: 'BFS, 0-1 BFS & State-Space Graph Modeling (dist[u][state])',
  domain: 'Graph & Tree Theory',
  ratingTier: '1400–1600',
  usacoDivision: 'Silver',
  subtitle:
    'Solve shortest-path problems with binary edge costs, keys, coupons, or parity flags by cloning graph vertices into explicit state tuples (u, state).',
  analogyTitle: 'The Subway Transfer & Discount Pass Analogy',
  analogyBody:
    'Suppose a city transit map lets you ride any train for its normal ticket price, OR burn a single 50%-off coupon once during your trip. Being at Central Station WITH your coupon unused is fundamentally a different situation from being at Central Station AFTER spending your coupon. If you only store dist[station], a cheap early path that burned the coupon would overwrite a path that saved the coupon for a $100 express leg later. Instead, split every station into two floors: (station, coupon_unused) and (station, coupon_used). Now standard BFS, 0-1 BFS, or Dijkstra runs completely untouched on this expanded state graph!',
  prerequisites: [
    {
      slug: 'prefix-sums-difference-arrays',
      title: 'Prefix Sums, Difference Arrays & Invariants',
    },
  ],
  traceTitle: 'Interactive Trace: 0-1 BFS & Coupon State-Space Graph (dist[u][0/1])',
  traceSubtitle:
    'Traverse a 4-node directed graph using a Deque (0-weight edges push_front, 1-weight edges push_back) or inspect state transitions.',
  allowDynamicGraphEdit: true,
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Start at Source Node 0 (dist[0] = 0, Deque = [0])',
      explanation:
        'Initialize dist = [0, INF, INF, INF]. Push source 0 onto the double-ended queue. Edges: (0->1, w=1), (0->2, w=0), (2->1, w=0), (1->3, w=1), (2->3, w=5).',
      mode: 'graph',
      graph: {
        calloutMetric: 'Deque: [0] · dist = [0, INF, INF, INF]',
        nodes: [
          { id: '0', label: '0', x: 95, y: 150, state: 'even' },
          { id: '1', label: '1', x: 270, y: 75, state: 'unmatched' },
          { id: '2', label: '2', x: 270, y: 225, state: 'unmatched' },
          { id: '3', label: '3', x: 465, y: 150, state: 'unmatched' },
        ],
        edges: [
          { id: 'e01', from: '0', to: '1', weight: 1, state: 'default' },
          { id: 'e02', from: '0', to: '2', weight: 0, state: 'default' },
          { id: 'e21', from: '2', to: '1', weight: 0, state: 'default' },
          { id: 'e13', from: '1', to: '3', weight: 1, state: 'default' },
          { id: 'e23', from: '2', to: '3', weight: 5, state: 'default' },
        ],
      },
      variables: { Deque: '[0]', 'dist[0..3]': '[0, INF, INF, INF]' },
    },
    {
      stepNumber: 2,
      title: 'Pop 0 -> Relax (0->2, w=0) Front & (0->1, w=1) Back',
      explanation:
        'Edge (0->2) has weight 0, so push_front(2) with dist[2]=0. Edge (0->1) has weight 1, so push_back(1) with dist[1]=1. Deque becomes [2, 1].',
      mode: 'graph',
      graph: {
        calloutMetric: 'Deque: [2, 1] · 0-weight edge jumps to front!',
        nodes: [
          { id: '0', label: '0', x: 95, y: 150, state: 'matched' },
          { id: '1', label: '1', x: 270, y: 75, state: 'odd' },
          { id: '2', label: '2', x: 270, y: 225, state: 'even' },
          { id: '3', label: '3', x: 465, y: 150, state: 'unmatched' },
        ],
        edges: [
          { id: 'e01', from: '0', to: '1', weight: 1, state: 'default' },
          { id: 'e02', from: '0', to: '2', weight: 0, state: 'augmenting' },
          { id: 'e21', from: '2', to: '1', weight: 0, state: 'default' },
          { id: 'e13', from: '1', to: '3', weight: 1, state: 'default' },
          { id: 'e23', from: '2', to: '3', weight: 5, state: 'default' },
        ],
      },
      variables: { Popped: 0, Deque: '[2, 1]', 'dist[0..3]': '[0, 1, 0, INF]' },
    },
    {
      stepNumber: 3,
      title: 'Pop 2 -> Free 0-Weight Shortcut (2->1) Cuts dist[1] to 0!',
      explanation:
        'Pop front 2 (dist=0). Edge (2->1, w=0) improves dist[1] from 1 down to 0 and pushes 1 to front of deque! Edge (2->3, w=5) sets dist[3]=5.',
      mode: 'graph',
      graph: {
        calloutMetric: 'Shortcut Found: dist[1] = 0 via 0 -> 2 -> 1',
        nodes: [
          { id: '0', label: '0', x: 95, y: 150, state: 'matched' },
          { id: '1', label: '1', x: 270, y: 75, state: 'even' },
          { id: '2', label: '2', x: 270, y: 225, state: 'matched' },
          { id: '3', label: '3', x: 465, y: 150, state: 'odd' },
        ],
        edges: [
          { id: 'e01', from: '0', to: '1', weight: 1, state: 'default' },
          { id: 'e02', from: '0', to: '2', weight: 0, state: 'matched' },
          { id: 'e21', from: '2', to: '1', weight: 0, state: 'augmenting' },
          { id: 'e13', from: '1', to: '3', weight: 1, state: 'default' },
          { id: 'e23', from: '2', to: '3', weight: 5, state: 'default' },
        ],
      },
      variables: { Popped: 2, Deque: '[1, 3, 1(stale)]', 'dist[0..3]': '[0, 0, 0, 5]' },
    },
    {
      stepNumber: 4,
      title: 'Pop 1 -> Relax (1->3, w=1) -> Optimal dist[3] = 1',
      explanation:
        'Pop front 1 (dist=0). Edge (1->3, w=1) improves dist[3] from 5 to 1. Stale copy of 1 in the deque is skipped in O(1) via d > dist[u].',
      mode: 'graph',
      graph: {
        calloutMetric: 'Optimal Shortest Path 0 -> 2 -> 1 -> 3 = Cost 1',
        nodes: [
          { id: '0', label: '0', x: 95, y: 150, state: 'matched' },
          { id: '1', label: '1', x: 270, y: 75, state: 'matched' },
          { id: '2', label: '2', x: 270, y: 225, state: 'matched' },
          { id: '3', label: '3', x: 465, y: 150, state: 'matched' },
        ],
        edges: [
          { id: 'e01', from: '0', to: '1', weight: 1, state: 'default' },
          { id: 'e02', from: '0', to: '2', weight: 0, state: 'matched' },
          { id: 'e21', from: '2', to: '1', weight: 0, state: 'matched' },
          { id: 'e13', from: '1', to: '3', weight: 1, state: 'augmenting' },
          { id: 'e23', from: '2', to: '3', weight: 5, state: 'default' },
        ],
      },
      variables: { OptimalCost: 1, 'dist[0..3]': '[0, 0, 0, 1]', Complexity: 'O(V + E)' },
    },
  ],
  reductionClues: [
    {
      clue: '"Edge costs are strictly 0 or 1 (e.g. turn vs straight, free vs paid cell)"',
      translation:
        'Replace Dijkstra O(E log V) with 0-1 BFS using a std::deque in strict O(V + E).',
    },
    {
      clue: '"You may skip / halve / invert at most K edges (or collect <= 10 keys)"',
      translation:
        'State-space graph: expand vertex u into (u, used_k) or (u, key_bitmask) and run BFS / Dijkstra on dist[u][state].',
    },
    {
      clue: '"Monsters move simultaneously while player tries to escape a grid"',
      translation:
        'Multi-source BFS from all monsters first to compute monster_dist[r][c], then player BFS requiring player_dist < monster_dist.',
    },
    {
      clue: '"Direction-dependent cost or cooldown between steps"',
      translation:
        'Encode direction or cooldown inside state: dist[r][c][dir] rather than dist[r][c].',
    },
  ],
  timeComplexity: 'O(S * (V + E)) for BFS / 0-1 BFS, O(S * E log(S * V)) for State Dijkstra',
  spaceComplexity: 'O(S * V + E) where S is the number of auxiliary states per node',
  pitfalls: [
    {
      type: 'TLE',
      title: 'Missing Stale-State Check in 0-1 BFS / Dijkstra',
      detail:
        'Because a node can be pushed twice (once from a 1-edge to back, later from a 0-edge to front), always check if (d > dist[u]) continue; right after popping.',
    },
    {
      type: 'WA',
      title: 'Using Visited Boolean Instead of Distance Relaxation in 0-1 BFS',
      detail:
        'Marking visited[v] = true on push breaks when a 1-weight push is later beaten by a 0-weight edge! Always relax on dist[v] > dist[u] + w.',
    },
    {
      type: 'MLE',
      title: 'Forgetting Multi-Source Initialization Order',
      detail:
        'Push ALL starting sources into the BFS queue with dist[src] = 0 BEFORE starting the while(!q.empty()) loop.',
    },
  ],
  implementations: {
    cpp20: `#include <bits/stdc++.h>
using namespace std;

// State-Space Dijkstra (e.g., CSES Flight Discount: 1 half-price coupon)
// Plus 0-1 BFS deque pattern support.
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, m;
    if (!(cin >> n >> m)) return 0;

    vector<vector<pair<int, long long>>> adj(n);
    for (int i = 0; i < m; ++i) {
        int u, v;
        long long w;
        cin >> u >> v >> w;
        --u; --v; // 1-indexed input
        adj[u].push_back({v, w});
    }

    const long long INF = (1LL << 60);
    // dist[u][0] = min cost to reach u with coupon unused
    // dist[u][1] = min cost to reach u with coupon already used
    vector<array<long long, 2>> dist(n, {INF, INF});
    using State = tuple<long long, int, int>;
    priority_queue<State, vector<State>, greater<State>> pq;

    dist[0][0] = 0;
    pq.push({0, 0, 0});

    while (!pq.empty()) {
        auto [d, u, used] = pq.top();
        pq.pop();
        if (d > dist[u][used]) continue;

        for (auto [v, w] : adj[u]) {
            if (d + w < dist[v][used]) {
                dist[v][used] = d + w;
                pq.push({dist[v][used], v, used});
            }
            if (used == 0 && d + (w / 2) < dist[v][1]) {
                dist[v][1] = d + (w / 2);
                pq.push({dist[v][1], v, 1});
            }
        }
    }

    cout << min(dist[n - 1][0], dist[n - 1][1]) << '\\n';
    return 0;
}`,
    rust: `use std::cmp::Reverse;
use std::collections::BinaryHeap;
use std::io::{self, Read};

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let Some(n_str) = it.next() else { return; };
    let n: usize = n_str.parse().unwrap();
    let m: usize = it.next().unwrap().parse().unwrap();

    let mut adj = vec![Vec::new(); n];
    for _ in 0..m {
        let u: usize = it.next().unwrap().parse::<usize>().unwrap() - 1;
        let v: usize = it.next().unwrap().parse::<usize>().unwrap() - 1;
        let w: i64 = it.next().unwrap().parse().unwrap();
        adj[u].push((v, w));
    }

    const INF: i64 = 1 << 60;
    let mut dist = vec![[INF; 2]; n];
    let mut pq = BinaryHeap::new();
    dist[0][0] = 0;
    pq.push(Reverse((0i64, 0usize, 0usize)));

    while let Some(Reverse((d, u, used))) = pq.pop() {
        if d > dist[u][used] {
            continue;
        }
        for &(v, w) in &adj[u] {
            if d + w < dist[v][used] {
                dist[v][used] = d + w;
                pq.push(Reverse((dist[v][used], v, used)));
            }
            if used == 0 && d + w / 2 < dist[v][1] {
                dist[v][1] = d + w / 2;
                pq.push(Reverse((dist[v][1], v, 1)));
            }
        }
    }
    println!("{}", dist[n - 1][0].min(dist[n - 1][1]));
}`,
    java21: `import java.io.*;
import java.util.*;

public class Main {
    static final class FastScanner {
        private final InputStream in;
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;
        FastScanner(InputStream is) { this.in = is; }
        private int readByte() throws IOException {
            if (ptr >= len) { len = in.read(buf); ptr = 0; if (len <= 0) return -1; }
            return buf[ptr++];
        }
        long nextLong() throws IOException {
            int c; while ((c = readByte()) <= ' ') if (c == -1) return 0;
            long sign = 1; if (c == '-') { sign = -1; c = readByte(); }
            long r = 0; while (c > ' ') { r = r * 10 + (c - '0'); c = readByte(); }
            return r * sign;
        }
        int nextInt() throws IOException { return (int) nextLong(); }
    }

    static record Edge(int to, long w) {}
    static record Node(long d, int u, int used) implements Comparable<Node> {
        public int compareTo(Node o) { return Long.compare(d, o.d); }
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        int n = fs.nextInt(), m = fs.nextInt();
        List<Edge>[] adj = new List[n];
        for (int i = 0; i < n; i++) adj[i] = new ArrayList<>();
        for (int i = 0; i < m; i++) {
            adj[fs.nextInt() - 1].add(new Edge(fs.nextInt() - 1, fs.nextLong()));
        }
        long INF = 1L << 60;
        long[][] dist = new long[n][2];
        for (long[] row : dist) Arrays.fill(row, INF);
        PriorityQueue<Node> pq = new PriorityQueue<>();
        dist[0][0] = 0;
        pq.add(new Node(0, 0, 0));
        while (!pq.isEmpty()) {
            Node cur = pq.poll();
            if (cur.d > dist[cur.u][cur.used]) continue;
            for (Edge e : adj[cur.u]) {
                if (cur.d + e.w < dist[e.to][cur.used]) {
                    dist[e.to][cur.used] = cur.d + e.w;
                    pq.add(new Node(dist[e.to][cur.used], e.to, cur.used));
                }
                if (cur.used == 0 && cur.d + e.w / 2 < dist[e.to][1]) {
                    dist[e.to][1] = cur.d + e.w / 2;
                    pq.add(new Node(dist[e.to][1], e.to, 1));
                }
            }
        }
        System.out.println(Math.min(dist[n - 1][0], dist[n - 1][1]));
    }
}`,
    python3: `import heapq
import sys

def solve() -> None:
    data = list(map(int, sys.stdin.buffer.read().split()))
    if not data:
        return
    n, m = data[0], data[1]
    adj = [[] for _ in range(n)]
    idx = 2
    for _ in range(m):
        u, v, w = data[idx] - 1, data[idx + 1] - 1, data[idx + 2]
        idx += 3
        adj[u].append((v, w))

    INF = 1 << 60
    dist = [[INF, INF] for _ in range(n)]
    dist[0][0] = 0
    pq = [(0, 0, 0)]
    while pq:
        d, u, used = heapq.heappop(pq)
        if d > dist[u][used]:
            continue
        for v, w in adj[u]:
            if d + w < dist[v][used]:
                dist[v][used] = d + w
                heapq.heappush(pq, (dist[v][used], v, used))
            if used == 0 and d + (w // 2) < dist[v][1]:
                dist[v][1] = d + (w // 2)
                heapq.heappush(pq, (dist[v][1], v, 1))

    print(min(dist[n - 1]))

if __name__ == "__main__":
    solve()`,
    ruby: `data = STDIN.read.split.map(&:to_i)
exit if data.empty?
n, m = data[0], data[1]
adj = Array.new(n) { [] }
idx = 2
m.times do
  u, v, w = data[idx] - 1, data[idx + 1] - 1, data[idx + 2]
  idx += 3
  adj[u] << [v, w]
end

inf = 1 << 60
dist = Array.new(n) { [inf, inf] }
dist[0][0] = 0
heap = [[0, 0, 0]]

push = lambda do |item|
  heap << item
  i = heap.size - 1
  while i > 0
    p = (i - 1) >> 1
    break if heap[p][0] <= heap[i][0]
    heap[p], heap[i] = heap[i], heap[p]
    i = p
  end
end

pop = lambda do
  top = heap[0]
  last = heap.pop
  unless heap.empty?
    heap[0] = last
    i = 0; len = heap.size
    loop do
      l = (i << 1) + 1; r = l + 1; b = i
      b = l if l < len && heap[l][0] < heap[b][0]
      b = r if r < len && heap[r][0] < heap[b][0]
      break if b == i
      heap[i], heap[b] = heap[b], heap[i]; i = b
    end
  end
  top
end

until heap.empty?
  d, u, used = pop.call
  next if d > dist[u][used]
  adj[u].each do |v, w|
    if d + w < dist[v][used]
      dist[v][used] = d + w
      push.call([dist[v][used], v, used])
    end
    if used == 0 && d + (w / 2) < dist[v][1]
      dist[v][1] = d + (w / 2)
      push.call([dist[v][1], v, 1])
    end
  end
end
puts dist[n - 1].min`,
  },
  practiceProblems: [
    {
      id: 'ch03-warmup',
      tier: 'Warmup',
      ratingRange: '1100–1300',
      title: 'Grid Shortest Path & Parent Reconstruction (Labyrinth)',
      statement:
        'Given an N x M grid with walls (#), open cells (.), start A, and exit B, output YES and the shortest path length from A to B (or NO if unreachable).',
      constraints: '1 <= N, M <= 1000, Time Limit: 1.0s',
      sampleInput: '5 8\n########\n#.A#...#\n#.##.#B#\n#......#\n########',
      sampleOutput: 'YES\n9',
      hints: [
        'Run standard BFS from A storing dist[r][c] and parent direction.',
        'Mark visited immediately when pushing into the queue so each cell is enqueued at most once.',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, m; cin >> n >> m;
    vector<string> g(n);
    pair<int, int> st, ed;
    for (int i = 0; i < n; ++i) {
        cin >> g[i];
        for (int j = 0; j < m; ++j) {
            if (g[i][j] == 'A') st = {i, j};
            if (g[i][j] == 'B') ed = {i, j};
        }
    }
    vector<vector<int>> dist(n, vector<int>(m, -1));
    queue<pair<int, int>> q;
    dist[st.first][st.second] = 0;
    q.push(st);
    int dr[4] = {-1, 1, 0, 0}, dc[4] = {0, 0, -1, 1};
    while (!q.empty()) {
        auto [r, c] = q.front(); q.pop();
        for (int d = 0; d < 4; ++d) {
            int nr = r + dr[d], nc = c + dc[d];
            if (nr >= 0 && nr < n && nc >= 0 && nc < m && g[nr][nc] != '#' && dist[nr][nc] == -1) {
                dist[nr][nc] = dist[r][c] + 1;
                q.push({nr, nc});
            }
        }
    }
    int ans = dist[ed.first][ed.second];
    if (ans == -1) cout << "NO\\n"; else cout << "YES\\n" << ans << '\\n';
}`,
        rust: `use std::collections::VecDeque;
use std::io::{self, Read};
fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let n: usize = it.next().unwrap().parse().unwrap();
    let m: usize = it.next().unwrap().parse().unwrap();
    let g: Vec<Vec<u8>> = (0..n).map(|_| it.next().unwrap().as_bytes().to_vec()).collect();
    let (mut st, mut ed) = ((0, 0), (0, 0));
    for r in 0..n { for c in 0..m { if g[r][c] == b'A' { st = (r, c); } if g[r][c] == b'B' { ed = (r, c); } } }
    let mut dist = vec![vec![-1i32; m]; n];
    let mut q = VecDeque::new();
    dist[st.0][st.1] = 0; q.push_back(st);
    let dirs = [(-1isize, 0), (1, 0), (0, -1), (0, 1)];
    while let Some((r, c)) = q.pop_front() {
        for (dr, dc) in dirs {
            let (nr, nc) = (r as isize + dr, c as isize + dc);
            if nr >= 0 && nr < n as isize && nc >= 0 && nc < m as isize {
                let (ur, uc) = (nr as usize, nc as usize);
                if g[ur][uc] != b'#' && dist[ur][uc] == -1 {
                    dist[ur][uc] = dist[r][c] + 1; q.push_back((ur, uc));
                }
            }
        }
    }
    if dist[ed.0][ed.1] == -1 { println!("NO"); } else { println!("YES\\n{}", dist[ed.0][ed.1]); }
}`,
        java21: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(), m = sc.nextInt();
        char[][] g = new char[n][];
        int sr = 0, sc0 = 0, er = 0, ec = 0;
        for (int i = 0; i < n; i++) {
            g[i] = sc.next().toCharArray();
            for (int j = 0; j < m; j++) {
                if (g[i][j] == 'A') { sr = i; sc0 = j; }
                if (g[i][j] == 'B') { er = i; ec = j; }
            }
        }
        int[][] dist = new int[n][m];
        for (int[] row : dist) Arrays.fill(row, -1);
        ArrayDeque<int[]> q = new ArrayDeque<>();
        dist[sr][sc0] = 0; q.add(new int[]{sr, sc0});
        int[] dr = {-1, 1, 0, 0}, dc = {0, 0, -1, 1};
        while (!q.isEmpty()) {
            int[] cur = q.poll();
            for (int d = 0; d < 4; d++) {
                int nr = cur[0] + dr[d], nc = cur[1] + dc[d];
                if (nr >= 0 && nr < n && nc >= 0 && nc < m && g[nr][nc] != '#' && dist[nr][nc] == -1) {
                    dist[nr][nc] = dist[cur[0]][cur[1]] + 1;
                    q.add(new int[]{nr, nc});
                }
            }
        }
        if (dist[er][ec] == -1) System.out.println("NO");
        else System.out.println("YES\\n" + dist[er][ec]);
    }
}`,
        python3: `from collections import deque
import sys
lines = sys.stdin.read().splitlines()
n, m = map(int, lines[0].split())
g = lines[1:1 + n]
st = ed = (0, 0)
for r in range(n):
    for c in range(m):
        if g[r][c] == 'A': st = (r, c)
        if g[r][c] == 'B': ed = (r, c)
dist = [[-1] * m for _ in range(n)]
dist[st[0]][st[1]] = 0
q = deque([st])
while q:
    r, c = q.popleft()
    for dr, dc in ((-1,0),(1,0),(0,-1),(0,1)):
        nr, nc = r + dr, c + dc
        if 0 <= nr < n and 0 <= nc < m and g[nr][nc] != '#' and dist[nr][nc] == -1:
            dist[nr][nc] = dist[r][c] + 1
            q.append((nr, nc))
print("NO" if dist[ed[0]][ed[1]] == -1 else f"YES\\n{dist[ed[0]][ed[1]]}")`,
        ruby: `lines = STDIN.read.split("\\n")
n, m = lines[0].split.map(&:to_i)
g = lines[1, n]
st = ed = [0, 0]
n.times { |r| m.times { |c| st = [r, c] if g[r][c] == 'A'; ed = [r, c] if g[r][c] == 'B' } }
dist = Array.new(n) { Array.new(m, -1) }
dist[st[0]][st[1]] = 0
q = [st]; head = 0
while head < q.size
  r, c = q[head]; head += 1
  [[-1,0],[1,0],[0,-1],[0,1]].each do |dr, dc|
    nr = r + dr; nc = c + dc
    if nr >= 0 && nr < n && nc >= 0 && nc < m && g[nr][nc] != '#' && dist[nr][nc] == -1
      dist[nr][nc] = dist[r][c] + 1
      q << [nr, nc]
    end
  end
end
ans = dist[ed[0]][ed[1]]
puts(ans == -1 ? "NO" : "YES\\n#{ans}")`,
      },
    },
    {
      id: 'ch03-standard',
      tier: 'Standard',
      ratingRange: '1400–1700',
      title: '0-1 BFS Directional Switch Grid (Minimum Cost to Valid Path)',
      statement:
        'An N x M grid has arrows L, R, U, D in each cell. Moving in the cell’s arrow direction costs 0; changing the cell’s arrow to any other direction costs 1. Find the minimum cost to travel from (0, 0) to (N-1, M-1).',
      constraints: '1 <= N, M <= 500, Time Limit: 1.0s',
      sampleInput: '2 3\nR R D\nL L R',
      sampleOutput: '0',
      hints: [
        'Each cell (r, c) has 4 outgoing edges: weight 0 along its own arrow, weight 1 along the other 3 directions.',
        'Use a deque: push_front for weight 0, push_back for weight 1 -> O(N * M).',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, m; cin >> n >> m;
    vector<vector<char>> g(n, vector<char>(m));
    for (int i = 0; i < n; ++i) for (int j = 0; j < m; ++j) cin >> g[i][j];
    const string dirs = "UDLR";
    int dr[4] = {-1, 1, 0, 0}, dc[4] = {0, 0, -1, 1};
    vector<vector<int>> dist(n, vector<int>(m, 1e9));
    deque<pair<int, int>> dq;
    dist[0][0] = 0; dq.push_front({0, 0});
    while (!dq.empty()) {
        auto [r, c] = dq.front(); dq.pop_front();
        for (int d = 0; d < 4; ++d) {
            int nr = r + dr[d], nc = c + dc[d];
            if (nr < 0 || nr >= n || nc < 0 || nc >= m) continue;
            int w = (g[r][c] == dirs[d]) ? 0 : 1;
            if (dist[r][c] + w < dist[nr][nc]) {
                dist[nr][nc] = dist[r][c] + w;
                if (w == 0) dq.push_front({nr, nc});
                else dq.push_back({nr, nc});
            }
        }
    }
    cout << dist[n - 1][m - 1] << '\\n';
}`,
        rust: `use std::collections::VecDeque;
use std::io::{self, Read};
fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let n: usize = it.next().unwrap().parse().unwrap();
    let m: usize = it.next().unwrap().parse().unwrap();
    let mut g = vec![vec!['R'; m]; n];
    for r in 0..n { for c in 0..m { g[r][c] = it.next().unwrap().chars().next().unwrap(); } }
    let dirs = [('U', -1isize, 0isize), ('D', 1, 0), ('L', 0, -1), ('R', 0, 1)];
    let mut dist = vec![vec![i32::MAX / 2; m]; n];
    let mut dq = VecDeque::new();
    dist[0][0] = 0; dq.push_front((0usize, 0usize));
    while let Some((r, c)) = dq.pop_front() {
        for &(ch, dr, dc) in &dirs {
            let (nr, nc) = (r as isize + dr, c as isize + dc);
            if nr >= 0 && nr < n as isize && nc >= 0 && nc < m as isize {
                let (ur, uc) = (nr as usize, nc as usize);
                let w = if g[r][c] == ch { 0 } else { 1 };
                if dist[r][c] + w < dist[ur][uc] {
                    dist[ur][uc] = dist[r][c] + w;
                    if w == 0 { dq.push_front((ur, uc)); } else { dq.push_back((ur, uc)); }
                }
            }
        }
    }
    println!("{}", dist[n - 1][m - 1]);
}`,
        java21: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(), m = sc.nextInt();
        char[][] g = new char[n][m];
        for (int i = 0; i < n; i++) for (int j = 0; j < m; j++) g[i][j] = sc.next().charAt(0);
        String dirs = "UDLR"; int[] dr = {-1, 1, 0, 0}, dc = {0, 0, -1, 1};
        int[][] dist = new int[n][m];
        for (int[] row : dist) Arrays.fill(row, 1_000_000_000);
        ArrayDeque<int[]> dq = new ArrayDeque<>();
        dist[0][0] = 0; dq.addFirst(new int[]{0, 0});
        while (!dq.isEmpty()) {
            int[] cur = dq.pollFirst(); int r = cur[0], c = cur[1];
            for (int d = 0; d < 4; d++) {
                int nr = r + dr[d], nc = c + dc[d];
                if (nr < 0 || nr >= n || nc < 0 || nc >= m) continue;
                int w = (g[r][c] == dirs.charAt(d)) ? 0 : 1;
                if (dist[r][c] + w < dist[nr][nc]) {
                    dist[nr][nc] = dist[r][c] + w;
                    if (w == 0) dq.addFirst(new int[]{nr, nc});
                    else dq.addLast(new int[]{nr, nc});
                }
            }
        }
        System.out.println(dist[n - 1][m - 1]);
    }
}`,
        python3: `from collections import deque
import sys
tok = sys.stdin.read().split()
n, m = int(tok[0]), int(tok[1])
g = [tok[2 + i * m : 2 + (i + 1) * m] for i in range(n)]
dist = [[10**9] * m for _ in range(n)]
dist[0][0] = 0
dq = deque([(0, 0)])
dirs = [('U', -1, 0), ('D', 1, 0), ('L', 0, -1), ('R', 0, 1)]
while dq:
    r, c = dq.popleft()
    for ch, dr, dc in dirs:
        nr, nc = r + dr, c + dc
        if 0 <= nr < n and 0 <= nc < m:
            w = 0 if g[r][c] == ch else 1
            if dist[r][c] + w < dist[nr][nc]:
                dist[nr][nc] = dist[r][c] + w
                if w == 0: dq.appendleft((nr, nc))
                else: dq.append((nr, nc))
print(dist[n - 1][m - 1])`,
        ruby: `tok = STDIN.read.split
n, m = tok[0].to_i, tok[1].to_i
g = Array.new(n) { |i| tok[2 + i * m, m] }
dist = Array.new(n) { Array.new(m, 10**9) }
dist[0][0] = 0
dq = [[0, 0]]
dirs = [['U', -1, 0], ['D', 1, 0], ['L', 0, -1], ['R', 0, 1]]
until dq.empty?
  r, c = dq.shift
  dirs.each do |ch, dr, dc|
    nr = r + dr; nc = c + dc
    next if nr < 0 || nr >= n || nc < 0 || nc >= m
    w = g[r][c] == ch ? 0 : 1
    if dist[r][c] + w < dist[nr][nc]
      dist[nr][nc] = dist[r][c] + w
      w == 0 ? dq.unshift([nr, nc]) : dq.push([nr, nc])
    end
  end
end
puts dist[n - 1][m - 1]`,
      },
    },
    {
      id: 'ch03-boss',
      tier: 'Boss',
      ratingRange: '2000–2400',
      title: 'Multi-Source Monster Escape + Boundary Exit BFS (Monsters)',
      statement:
        'In an N x M grid with walls (#), multiple monsters (M), and one player (A), monsters and the player move 1 step simultaneously each turn. Find the minimum steps for A to reach any boundary cell without ever sharing a cell with a monster at the same or earlier time, or -1.',
      constraints: '1 <= N, M <= 1000, Time Limit: 1.0s',
      sampleInput: '5 8\n########\n#M..A..#\n#.#.M#.#\n#M#..#..\n#.######',
      sampleOutput: '5',
      hints: [
        'Run a multi-source BFS seeded with ALL monster positions M first to record m_dist[r][c].',
        'Run player BFS from A allowing entry into (nr, nc) only if p_dist[r][c] + 1 < m_dist[nr][nc].',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, m; cin >> n >> m;
    vector<string> g(n);
    const int INF = 1e9;
    vector<vector<int>> md(n, vector<int>(m, INF)), pd(n, vector<int>(m, -1));
    queue<pair<int, int>> mq, pq;
    pair<int, int> st;
    for (int i = 0; i < n; ++i) {
        cin >> g[i];
        for (int j = 0; j < m; ++j) {
            if (g[i][j] == 'M') { md[i][j] = 0; mq.push({i, j}); }
            if (g[i][j] == 'A') { st = {i, j}; }
        }
    }
    int dr[4] = {-1, 1, 0, 0}, dc[4] = {0, 0, -1, 1};
    while (!mq.empty()) {
        auto [r, c] = mq.front(); mq.pop();
        for (int d = 0; d < 4; ++d) {
            int nr = r + dr[d], nc = c + dc[d];
            if (nr >= 0 && nr < n && nc >= 0 && nc < m && g[nr][nc] != '#' && md[nr][nc] == INF) {
                md[nr][nc] = md[r][c] + 1; mq.push({nr, nc});
            }
        }
    }
    pd[st.first][st.second] = 0; pq.push(st);
    while (!pq.empty()) {
        auto [r, c] = pq.front(); pq.pop();
        if (r == 0 || r == n - 1 || c == 0 || c == m - 1) {
            cout << pd[r][c] << '\\n'; return 0;
        }
        for (int d = 0; d < 4; ++d) {
            int nr = r + dr[d], nc = c + dc[d];
            if (nr >= 0 && nr < n && nc >= 0 && nc < m && g[nr][nc] != '#' && pd[nr][nc] == -1 && pd[r][c] + 1 < md[nr][nc]) {
                pd[nr][nc] = pd[r][c] + 1; pq.push({nr, nc});
            }
        }
    }
    cout << -1 << '\\n';
}`,
        rust: `use std::collections::VecDeque;
use std::io::{self, Read};
fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let n: usize = it.next().unwrap().parse().unwrap();
    let m: usize = it.next().unwrap().parse().unwrap();
    let g: Vec<Vec<u8>> = (0..n).map(|_| it.next().unwrap().as_bytes().to_vec()).collect();
    let inf = 1_000_000_000i32;
    let mut md = vec![vec![inf; m]; n];
    let mut pd = vec![vec![-1i32; m]; n];
    let (mut mq, mut pq) = (VecDeque::new(), VecDeque::new());
    let mut st = (0, 0);
    for r in 0..n { for c in 0..m {
        if g[r][c] == b'M' { md[r][c] = 0; mq.push_back((r, c)); }
        if g[r][c] == b'A' { st = (r, c); }
    }}
    let dirs = [(-1isize, 0), (1, 0), (0, -1), (0, 1)];
    while let Some((r, c)) = mq.pop_front() {
        for (dr, dc) in dirs {
            let (nr, nc) = (r as isize + dr, c as isize + dc);
            if nr >= 0 && nr < n as isize && nc >= 0 && nc < m as isize {
                let (ur, uc) = (nr as usize, nc as usize);
                if g[ur][uc] != b'#' && md[ur][uc] == inf { md[ur][uc] = md[r][c] + 1; mq.push_back((ur, uc)); }
            }
        }
    }
    pd[st.0][st.1] = 0; pq.push_back(st);
    while let Some((r, c)) = pq.pop_front() {
        if r == 0 || r == n - 1 || c == 0 || c == m - 1 { println!("{}", pd[r][c]); return; }
        for (dr, dc) in dirs {
            let (nr, nc) = (r as isize + dr, c as isize + dc);
            if nr >= 0 && nr < n as isize && nc >= 0 && nc < m as isize {
                let (ur, uc) = (nr as usize, nc as usize);
                if g[ur][uc] != b'#' && pd[ur][uc] == -1 && pd[r][c] + 1 < md[ur][uc] {
                    pd[ur][uc] = pd[r][c] + 1; pq.push_back((ur, uc));
                }
            }
        }
    }
    println!("-1");
}`,
        java21: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(), m = sc.nextInt();
        char[][] g = new char[n][];
        int[][] md = new int[n][m], pd = new int[n][m];
        ArrayDeque<int[]> mq = new ArrayDeque<>(), pq = new ArrayDeque<>();
        int sr = 0, sc0 = 0;
        for (int i = 0; i < n; i++) {
            g[i] = sc.next().toCharArray();
            Arrays.fill(md[i], 1_000_000_000); Arrays.fill(pd[i], -1);
            for (int j = 0; j < m; j++) {
                if (g[i][j] == 'M') { md[i][j] = 0; mq.add(new int[]{i, j}); }
                if (g[i][j] == 'A') { sr = i; sc0 = j; }
            }
        }
        int[] dr = {-1, 1, 0, 0}, dc = {0, 0, -1, 1};
        while (!mq.isEmpty()) {
            int[] u = mq.poll();
            for (int d = 0; d < 4; d++) {
                int nr = u[0] + dr[d], nc = u[1] + dc[d];
                if (nr >= 0 && nr < n && nc >= 0 && nc < m && g[nr][nc] != '#' && md[nr][nc] > md[u[0]][u[1]] + 1) {
                    md[nr][nc] = md[u[0]][u[1]] + 1; mq.add(new int[]{nr, nc});
                }
            }
        }
        pd[sr][sc0] = 0; pq.add(new int[]{sr, sc0});
        while (!pq.isEmpty()) {
            int[] u = pq.poll();
            if (u[0] == 0 || u[0] == n - 1 || u[1] == 0 || u[1] == m - 1) { System.out.println(pd[u[0]][u[1]]); return; }
            for (int d = 0; d < 4; d++) {
                int nr = u[0] + dr[d], nc = u[1] + dc[d];
                if (nr >= 0 && nr < n && nc >= 0 && nc < m && g[nr][nc] != '#' && pd[nr][nc] == -1 && pd[u[0]][u[1]] + 1 < md[nr][nc]) {
                    pd[nr][nc] = pd[u[0]][u[1]] + 1; pq.add(new int[]{nr, nc});
                }
            }
        }
        System.out.println(-1);
    }
}`,
        python3: `from collections import deque
import sys
lines = sys.stdin.read().splitlines()
n, m = map(int, lines[0].split())
g = lines[1:1 + n]
INF = 10**9
md = [[INF] * m for _ in range(n)]
pd = [[-1] * m for _ in range(n)]
mq, pq = deque(), deque()
st = (0, 0)
for r in range(n):
    for c in range(m):
        if g[r][c] == 'M': md[r][c] = 0; mq.append((r, c))
        elif g[r][c] == 'A': st = (r, c)
while mq:
    r, c = mq.popleft()
    for dr, dc in ((-1,0),(1,0),(0,-1),(0,1)):
        nr, nc = r + dr, c + dc
        if 0 <= nr < n and 0 <= nc < m and g[nr][nc] != '#' and md[nr][nc] == INF:
            md[nr][nc] = md[r][c] + 1; mq.append((nr, nc))
pd[st[0]][st[1]] = 0; pq.append(st)
while pq:
    r, c = pq.popleft()
    if r in (0, n - 1) or c in (0, m - 1):
        print(pd[r][c]); sys.exit(0)
    for dr, dc in ((-1,0),(1,0),(0,-1),(0,1)):
        nr, nc = r + dr, c + dc
        if 0 <= nr < n and 0 <= nc < m and g[nr][nc] != '#' and pd[nr][nc] == -1 and pd[r][c] + 1 < md[nr][nc]:
            pd[nr][nc] = pd[r][c] + 1; pq.append((nr, nc))
print(-1)`,
        ruby: `lines = STDIN.read.split("\\n")
n, m = lines[0].split.map(&:to_i)
g = lines[1, n]
inf = 10**9
md = Array.new(n) { Array.new(m, inf) }
pd = Array.new(n) { Array.new(m, -1) }
mq = []; pq = []; st = [0, 0]
n.times { |r| m.times { |c| if g[r][c] == 'M' then md[r][c] = 0; mq << [r, c] elsif g[r][c] == 'A' then st = [r, c] end } }
mh = 0
while mh < mq.size
  r, c = mq[mh]; mh += 1
  [[-1,0],[1,0],[0,-1],[0,1]].each do |dr, dc|
    nr = r + dr; nc = c + dc
    if nr >= 0 && nr < n && nc >= 0 && nc < m && g[nr][nc] != '#' && md[nr][nc] == inf
      md[nr][nc] = md[r][c] + 1; mq << [nr, nc]
    end
  end
end
pd[st[0]][st[1]] = 0; pq << st; ph = 0
while ph < pq.size
  r, c = pq[ph]; ph += 1
  if r == 0 || r == n - 1 || c == 0 || c == m - 1 then puts pd[r][c]; exit end
  [[-1,0],[1,0],[0,-1],[0,1]].each do |dr, dc|
    nr = r + dr; nc = c + dc
    if nr >= 0 && nr < n && nc >= 0 && nc < m && g[nr][nc] != '#' && pd[nr][nc] == -1 && pd[r][c] + 1 < md[nr][nc]
      pd[nr][nc] = pd[r][c] + 1; pq << [nr, nc]
    end
  end
end
puts(-1)`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'CSES',
      title: 'Labyrinth, Monsters & Flight Discount',
      difficulty: 'Graph Algorithms',
      url: 'https://cses.fi/problemset/task/1195',
      patternNote: 'Parent grid reconstruction, multi-source BFS, and dist[u][coupon_used].',
    },
    {
      platform: 'AtCoder',
      title: 'ABC 176 D - Wizard in Maze & ABC 213 E',
      difficulty: 'AtCoder 1200–1600',
      url: 'https://atcoder.jp/contests/abc176/tasks/abc176_d',
      patternNote: 'Classic 0-1 BFS with 0-cost walk vs 1-cost 5x5 teleport.',
    },
    {
      platform: 'Codeforces',
      title: 'Chamber of Secrets (173B) & Labyrinth (1063B)',
      difficulty: 'CF 1500–1700',
      url: 'https://codeforces.com/problemset?tags=shortest+paths,graphs',
      patternNote: '0-1 BFS with direction states and constrained left/right move budgets.',
    },
    {
      platform: 'CodeChef',
      title: 'REVERSE - Chef and Reversing',
      difficulty: 'CodeChef 3★',
      url: 'https://www.codechef.com/practice',
      patternNote: 'Direct edge weight 0, reversed edge weight 1 solved with 0-1 BFS.',
    },
    {
      platform: 'HackerRank',
      title: 'Shortest Reach & Matrix / Roads in HackerLand',
      difficulty: 'Medium / Hard',
      url: 'https://www.hackerrank.com/domains/algorithms?filters%5Bsubdomains%5D%5B%5D=graph-theory',
      patternNote: 'Layered graph traversal and BFS level tracking.',
    },
    {
      platform: 'NeetCode 150',
      title: 'Rotting Oranges & Cheapest Flights Within K Stops',
      difficulty: 'FAANG Medium',
      url: 'https://leetcode.com/problemset/?search=Cheapest+Flights+Within+K+Stops',
      patternNote: 'Multi-source BFS and state-layered shortest path.',
    },
  ],
  interviewNotes: [
    'Multi-source BFS ("Rotting Oranges", "Walls and Gates") is one of the highest-frequency interview graph patterns—always enqueue all sources simultaneously at depth 0.',
    'Whenever a graph problem restricts stops, keys, or obstacles broken ("Shortest Path in a Grid with Obstacles Elimination"), expand the node state to (r, c, remaining_k).',
  ],
  projectBlueprint: {
    title: 'Multi-Modal Metro & Bus Fare Route Finder',
    tagline:
      'Transit routing engine computing cheapest multi-leg commutes across bus/rail transfers with free-transfer grace windows and commuter pass states.',
    stackSummary: 'TypeScript Routing Engine + Deque 0-1 BFS / State-Layered Dijkstra',
    asciiDiagram: `┌────────────────────┐     ┌─────────────────────────┐     ┌─────────────────────────┐
│ Transit Edges      │────►│ Layered State Graph     │────►│ 0-1 BFS / State Dijkstra│
│ (bus, rail, walk)  │     │ (station, pass_active)  │     │ dist[u][state] relax    │
└────────────────────┘     └─────────────────────────┘     └────────────┬────────────┘
                                                                        │
                                                                        ▼
                                                           ┌─────────────────────────┐
                                                           │ Cheapest Multi-Modal    │
                                                           │ Itinerary + Legs        │
                                                           └─────────────────────────┘`,
    milestones: [
      {
        id: 'ch03-m1',
        title: 'Milestone 1: Multi-Modal Transit Graph Loader',
        detail:
          'Model rail, bus, and walking transfer edges with explicit base fares and free-transfer flags.',
      },
      {
        id: 'ch03-m2',
        title: 'Milestone 2: State-Space Expansion (station, transferState)',
        detail:
          'Split stations into layered state nodes tracking whether a free transfer or day-pass discount is active.',
      },
      {
        id: 'ch03-m3',
        title: 'Milestone 3: 0-1 BFS Fast Path for Transfer Counting',
        detail:
          'Implement a ring-buffer deque calculating minimum fare-zone crossings in linear O(V + E) time.',
      },
      {
        id: 'ch03-m4',
        title: 'Milestone 4: Parent-Pointer Itinerary Reconstruction',
        detail:
          'Backtrack parent state pointers from destination back to origin to emit step-by-step transit instructions.',
      },
    ],
    starterCode: `export interface TransitEdge {
  to: number;
  fareCents: number;
  mode: 'rail' | 'bus' | 'walk';
}

export function findCheapestRouteWithOneDiscount(
  n: number,
  adj: TransitEdge[][],
  start: number,
  end: number,
): { cost: number; usedDiscount: boolean } {
  const INF = Number.MAX_SAFE_INTEGER;
  const dist: [number, number][] = Array.from({ length: n }, () => [INF, INF]);
  dist[start][0] = 0;

  // Simple array-backed priority queue for demonstration
  const pq: Array<[number, number, 0 | 1]> = [[0, start, 0]];
  while (pq.length > 0) {
    pq.sort((a, b) => a[0] - b[0]);
    const [d, u, used] = pq.shift()!;
    if (d > dist[u][used]) continue;

    for (const e of adj[u]) {
      if (d + e.fareCents < dist[e.to][used]) {
        dist[e.to][used] = d + e.fareCents;
        pq.push([dist[e.to][used], e.to, used]);
      }
      if (used === 0 && d + Math.floor(e.fareCents / 2) < dist[e.to][1]) {
        dist[e.to][1] = d + Math.floor(e.fareCents / 2);
        pq.push([dist[e.to][1], e.to, 1]);
      }
    }
  }
  const best = Math.min(dist[end][0], dist[end][1]);
  return { cost: best === INF ? -1 : best, usedDiscount: dist[end][1] < dist[end][0] };
}`,
  },
};
