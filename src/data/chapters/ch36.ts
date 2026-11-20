import type { TheoryChapter } from '../../types/vault';

export const CH36_HOPCROFT_KARP_KONIG: TheoryChapter = {
  slug: 'bipartite-matching-hopcroft-karp',
  topicId: 'gr-39',
  title: 'Bipartite Matching, Konig Theorem & Hopcroft-Karp',
  domain: 'Graph & Tree Theory',
  ratingTier: '1900–2200',
  usacoDivision: 'Platinum',
  subtitle:
    'Pair bipartite graphs in O(E sqrt(V)) using simultaneous multi-source BFS layering and vertex-disjoint DFS augmentation—and extract Minimum Vertex Covers, Maximum Independent Sets, and DAG Minimum Path Covers via Konig’s Theorem.',
  analogyTitle: 'The Multi-Lane Speed-Dating & Security Camera Analogy',
  analogyBody:
    'In basic Kuhn’s algorithm, you match left-side applicants `1..N` one lonely augmenting path at a time, taking `O(V * E)`—which times out when `N = 100,000`. **Hopcroft-Karp** turbocharges matching the exact same way Dinic accelerates Max Flow: launch a **simultaneous multi-source BFS** from ALL unmatched left vertices at once to build shortest augmenting-path layers (`dist[u]`), then run DFS to lock in an entire batch of **vertex-disjoint shortest augmenting paths** in a single `O(E)` sweep! Because shortest augmenting path length strictly increases each phase, at most `2 * sqrt(V)` phases ever happen (`O(E sqrt(V))`). Once matched, **Konig’s Theorem** lets you place the minimum security cameras (**Vertex Cover**) along hallway edges in one alternating reachability walk!',
  prerequisites: [
    {
      slug: 'bfs-dfs-01bfs-toposort',
      title: 'BFS, DFS, 0-1 BFS & Topological Sort',
    },
  ],
  traceTitle: 'Interactive Hopcroft-Karp Multi-Source BFS Layering & Disjoint DFS Trace',
  traceSubtitle:
    'Trace a 6-node bipartite graph (`L = {L1, L2, L3}`, `R = {R1, R2, R3}`) with existing partial matching `(L1-R1)` as Hopcroft-Karp finds shortest augmenting path `L2 -> R1 -> L1 -> R2` + `L3 -> R3`.',
  allowDynamicGraphEdit: true,
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Step 1: Initial Partial Match (L1-R1) & Unmatched Free Left Sources {L2, L3}',
      explanation:
        'Suppose L1 is matched to R1. Unmatched left nodes {L2, L3} enter the multi-source BFS queue with dist[L2] = dist[L3] = 0; matched L1 has dist[L1] = INF.',
      mode: 'graph',
      graph: {
        calloutMetric: 'Phase 1 BFS Queue: [L2 (d=0), L3 (d=0)] | Free Right Targets: {R2, R3}',
        nodes: [
          { id: 'L1', label: 'L1 (d=INF)', x: 110, y: 65, state: 'matched', matchWith: 'R1' },
          { id: 'L2', label: 'L2 (d=0)', x: 110, y: 165, state: 'active', matchWith: null },
          { id: 'L3', label: 'L3 (d=0)', x: 110, y: 265, state: 'active', matchWith: null },
          { id: 'R1', label: 'R1 [M:L1]', x: 390, y: 65, state: 'matched', matchWith: 'L1' },
          { id: 'R2', label: 'R2 [FREE]', x: 390, y: 165, state: 'unmatched', matchWith: null },
          { id: 'R3', label: 'R3 [FREE]', x: 390, y: 265, state: 'unmatched', matchWith: null },
        ],
        edges: [
          { id: 'e11', from: 'L1', to: 'R1', state: 'matched' },
          { id: 'e12', from: 'L1', to: 'R2', state: 'default' },
          { id: 'e21', from: 'L2', to: 'R1', state: 'default' },
          { id: 'e33', from: 'L3', to: 'R3', state: 'default' },
        ],
      },
      variables: { MatchingSize: 1, Phase: 'BFS Init', Queue: '[L2, L3]' },
    },
    {
      stepNumber: 2,
      title: 'Step 2: BFS Wave Expands Level 0 -> R3 (FREE, len=1) & R1 -> L1 (d=1)',
      explanation:
        'From L3: edge L3->R3 hits FREE vertex R3 (records shortest augmenting length = 1!). From L2: edge L2->R1 hits matched R1, jumping across matching edge R1->L1 to set dist[L1] = dist[L2] + 1 = 1!',
      mode: 'graph',
      graph: {
        calloutMetric: 'BFS Layers: dist[L2]=0, dist[L3]=0, dist[L1]=1 -> R2 FREE at d=2!',
        nodes: [
          { id: 'L1', label: 'L1 (d=1)', x: 110, y: 65, state: 'even', matchWith: 'R1' },
          { id: 'L2', label: 'L2 (d=0)', x: 110, y: 165, state: 'active', matchWith: null },
          { id: 'L3', label: 'L3 (d=0)', x: 110, y: 265, state: 'active', matchWith: null },
          { id: 'R1', label: 'R1 (via L2)', x: 390, y: 65, state: 'odd', matchWith: 'L1' },
          { id: 'R2', label: 'R2 (via L1)', x: 390, y: 165, state: 'odd', matchWith: null },
          { id: 'R3', label: 'R3 (via L3)', x: 390, y: 265, state: 'odd', matchWith: null },
        ],
        edges: [
          { id: 'e11', from: 'L1', to: 'R1', state: 'matched' },
          { id: 'e12', from: 'L1', to: 'R2', state: 'augmenting' },
          { id: 'e21', from: 'L2', to: 'R1', state: 'augmenting' },
          { id: 'e33', from: 'L3', to: 'R3', state: 'augmenting' },
        ],
      },
      variables: { 'dist[L2,L3]': 0, 'dist[L1]': 1, FoundAugmenting: 'YES' },
    },
    {
      stepNumber: 3,
      title: 'Step 3: Disjoint DFS Sweep Augments L2->R1->L1->R2 AND L3->R3 Simultaneously!',
      explanation:
        'DFS from L2 follows dist[L1] == dist[L2] + 1 along L2->R1->L1->R2, flipping (L1-R1) into (L2-R1) + (L1-R2). Meanwhile DFS from L3 flips (L3-R3). Both paths are vertex-disjoint—matching jumps from 1 to 3 in ONE phase!',
      mode: 'graph',
      graph: {
        calloutMetric: '2 Disjoint Paths Flipped in One DFS Sweep: Matching = 3 (Perfect!)',
        nodes: [
          { id: 'L1', label: 'L1 [M:R2]', x: 110, y: 65, state: 'matched', matchWith: 'R2' },
          { id: 'L2', label: 'L2 [M:R1]', x: 110, y: 165, state: 'matched', matchWith: 'R1' },
          { id: 'L3', label: 'L3 [M:R3]', x: 110, y: 265, state: 'matched', matchWith: 'R3' },
          { id: 'R1', label: 'R1 [M:L2]', x: 390, y: 65, state: 'matched', matchWith: 'L2' },
          { id: 'R2', label: 'R2 [M:L1]', x: 390, y: 165, state: 'matched', matchWith: 'L1' },
          { id: 'R3', label: 'R3 [M:L3]', x: 390, y: 265, state: 'matched', matchWith: 'L3' },
        ],
        edges: [
          { id: 'e11', from: 'L1', to: 'R1', state: 'contracted' },
          { id: 'e12', from: 'L1', to: 'R2', state: 'matched' },
          { id: 'e21', from: 'L2', to: 'R1', state: 'matched' },
          { id: 'e33', from: 'L3', to: 'R3', state: 'matched' },
        ],
      },
      variables: { MatchingSize: 3, PhaseRuntime: 'O(E)', MaxPhases: 'O(sqrt(V))' },
    },
    {
      stepNumber: 4,
      title: 'Step 4: Konig Minimum Vertex Cover & DAG Minimum Path Cover Duality',
      explanation:
        'Next BFS sees zero unmatched left nodes and terminates! By Konig’s Theorem, |Min Vertex Cover| == |Max Matching| = 3 (e.g. {R1, R2, R3}), and |Max Independent Set| = 6 - 3 = 3!',
      mode: 'graph',
      graph: {
        calloutMetric: 'Konig Duality: |MaxMatch| = |MinVertexCover| = 3 | |MaxIndepSet| = 3',
        nodes: [
          { id: 'L1', label: 'L1 (MIS)', x: 110, y: 65, state: 'even', matchWith: 'R2' },
          { id: 'L2', label: 'L2 (MIS)', x: 110, y: 165, state: 'even', matchWith: 'R1' },
          { id: 'L3', label: 'L3 (MIS)', x: 110, y: 265, state: 'even', matchWith: 'R3' },
          { id: 'R1', label: 'R1 (MVC)', x: 390, y: 65, state: 'blossom', matchWith: 'L2' },
          { id: 'R2', label: 'R2 (MVC)', x: 390, y: 165, state: 'blossom', matchWith: 'L1' },
          { id: 'R3', label: 'R3 (MVC)', x: 390, y: 265, state: 'blossom', matchWith: 'L3' },
        ],
        edges: [
          { id: 'e12', from: 'L1', to: 'R2', state: 'matched' },
          { id: 'e21', from: 'L2', to: 'R1', state: 'matched' },
          { id: 'e33', from: 'L3', to: 'R3', state: 'matched' },
        ],
      },
      variables: { MaxMatching: 3, MinVertexCover: 3, MaxIndependentSet: 3 },
    },
  ],
  reductionClues: [
    {
      clue: '"Pair up to N = 10^5 workers and tasks (or grid black/white cells) with 0/1 compatibility"',
      translation:
        'Bipartite graph with `V = 2 * 10^5`! Kuhn’s `O(V * E)` TLEs here; run **Hopcroft-Karp** in `O(E sqrt(V))` (often faster than Dinic on pure bipartite graphs due to zero reverse-edge structs!).',
    },
    {
      clue: '"Cover all edges/2D grid targets using minimum rows + columns (Minimum Vertex Cover)"',
      translation:
        'Rows = Left `U`, Columns = Right `V`, each target `(r, c)` = edge `(r, c)`. By **Konig’s Theorem**, `|MVC| = |MaxMatching|`! To actually reconstruct the MVC vertices: run alternating DFS from unmatched `U` nodes (`u -> v` non-matching, `v -> pairR[v]` matching); pick `(U \\ visL) U (visR)`!',
    },
    {
      clue: '"Select the largest set of pairwise non-conflicting elements on a bipartite conflict graph (Max Independent Set)"',
      translation:
        'Complement of Minimum Vertex Cover! Run Hopcroft-Karp + Konig alternating DFS, and output `visL U (V \\ visR)` of size `|U| + |V| - |MaxMatching|`.',
    },
    {
      clue: '"Cover all N vertices of a DAG using the minimum number of vertex-disjoint directed paths"',
      translation:
        '**DAG Minimum Path Cover**: split every vertex `v` into `v_out` (Left) and `v_in` (Right), add edge `(u_out, v_in)` for every DAG edge `u -> v`. Then `MinPathCover = N - MaxMatching`!',
    },
  ],
  timeComplexity: 'O(E * sqrt(V)) Worst-Case (Often Near-Linear in Practice)',
  spaceComplexity: 'O(V + E)',
  pitfalls: [
    {
      type: 'TLE',
      title: 'Running Naive Kuhn O(VE) When N >= 5,000 or Missing dist[0] Sentinel Reset',
      detail:
        'Kuhn’s `O(V * E)` passes `N <= 1,000`, then TLEs hard on dense/adversarial `N = 50,000` graphs. Always use Hopcroft-Karp with sentinel vertex `0` (`dist[0] = INF`) and prune failed DFS nodes by setting `dist[u] = INF` on dead ends!',
    },
    {
      type: 'WA',
      title: 'Mixing Up Unmatched Left vs Matched Right Directions During Konig Reconstruction',
      detail:
        'In Konig’s MVC construction, start alternating traversal ONLY from **unmatched Left vertices** (`matchL[u] == 0`), step across **unmatched edges** from Left -> Right, and step across **matched edges** from Right -> Left (`matchR[v]`). Finally pick **UNVISITED Left** + **VISITED Right**!',
    },
    {
      type: 'WA',
      title: 'Using Vertex-Disjoint Path Cover Reduction When Paths Are Allowed to Share Vertices',
      detail:
        'Watch the wording! Vertex-disjoint DAG path cover connects `(u_out, v_in)` on the original DAG edges. **Non-disjoint** (general) path cover (Dilworth’s Theorem / Maximum Antichain) requires taking the **transitive closure** `u ~> v` first before matching!',
    },
    {
      type: 'WA',
      title: '1-Indexing Sentinel Collision With Vertex 0',
      detail:
        'Hopcroft-Karp uses `0` as the dummy NIL matched node (`pairU[u] = 0`, `dist[0] = INF`). Ensure input vertices `1..N` and `1..M` stay 1-indexed so vertex `0` never collides with real data!',
    },
  ],
  implementations: {
    cpp20: `#include <bits/stdc++.h>
using namespace std;

// Hopcroft-Karp Maximum Bipartite Matching in O(E sqrt(V))
// Uses 1-based indexing for L (1..nL) and R (1..nR); 0 is NIL sentinel
struct HopcroftKarp {
    int nL, nR;
    vector<vector<int>> adj;
    vector<int> pairL, pairR, dist;
    static constexpr int INF = 1e9;

    HopcroftKarp(int nL, int nR)
        : nL(nL), nR(nR), adj(nL + 1), pairL(nL + 1, 0), pairR(nR + 1, 0), dist(nL + 1, INF) {}

    void add_edge(int u, int v) {
        adj[u].push_back(v);
    }

    bool bfs() {
        queue<int> q;
        for (int u = 1; u <= nL; u++) {
            if (pairL[u] == 0) {
                dist[u] = 0;
                q.push(u);
            } else {
                dist[u] = INF;
            }
        }
        dist[0] = INF;

        while (!q.empty()) {
            int u = q.front();
            q.pop();
            if (dist[u] < dist[0]) {
                for (int v : adj[u]) {
                    if (dist[pairR[v]] == INF) {
                        dist[pairR[v]] = dist[u] + 1;
                        q.push(pairR[v]);
                    }
                }
            }
        }
        return dist[0] != INF;
    }

    bool dfs(int u) {
        if (u == 0) return true;
        for (int v : adj[u]) {
            if (dist[pairR[v]] == dist[u] + 1 && dfs(pairR[v])) {
                pairR[v] = u;
                pairL[u] = v;
                return true;
            }
        }
        dist[u] = INF; // Dead-end pruning preserves O(E sqrt(V))
        return false;
    }

    int max_matching() {
        int matching = 0;
        while (bfs()) {
            for (int u = 1; u <= nL; u++) {
                if (pairL[u] == 0 && dfs(u)) matching++;
            }
        }
        return matching;
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, m, k;
    if (!(cin >> n >> m >> k)) return 0;
    HopcroftKarp hk(n, m);
    for (int i = 0; i < k; i++) {
        int u, v;
        cin >> u >> v;
        hk.add_edge(u, v);
    }

    cout << hk.max_matching() << "\\n";
    for (int u = 1; u <= n; u++) {
        if (hk.pairL[u] != 0) cout << u << " " << hk.pairL[u] << "\\n";
    }
    return 0;
}`,
    rust: `use std::collections::VecDeque;
use std::io::{self, Read};

const INF: i32 = 1_000_000_000;

struct HopcroftKarp {
    n_l: usize,
    adj: Vec<Vec<usize>>,
    pair_l: Vec<usize>,
    pair_r: Vec<usize>,
    dist: Vec<i32>,
}

impl HopcroftKarp {
    fn new(n_l: usize, n_r: usize) -> Self {
        Self {
            n_l,
            adj: vec![Vec::new(); n_l + 1],
            pair_l: vec![0; n_l + 1],
            pair_r: vec![0; n_r + 1],
            dist: vec![INF; n_l + 1],
        }
    }

    fn bfs(&mut self) -> bool {
        let mut q = VecDeque::new();
        for u in 1..=self.n_l {
            if self.pair_l[u] == 0 {
                self.dist[u] = 0;
                q.push_back(u);
            } else {
                self.dist[u] = INF;
            }
        }
        self.dist[0] = INF;

        while let Some(u) = q.pop_front() {
            if self.dist[u] < self.dist[0] {
                for &v in &self.adj[u] {
                    let nxt = self.pair_r[v];
                    if self.dist[nxt] == INF {
                        self.dist[nxt] = self.dist[u] + 1;
                        q.push_back(nxt);
                    }
                }
            }
        }
        self.dist[0] != INF
    }

    fn dfs(&mut self, u: usize) -> bool {
        if u == 0 {
            return true;
        }
        let len = self.adj[u].len();
        for i in 0..len {
            let v = self.adj[u][i];
            let nxt = self.pair_r[v];
            if self.dist[nxt] == self.dist[u] + 1 && self.dfs(nxt) {
                self.pair_r[v] = u;
                self.pair_l[u] = v;
                return true;
            }
        }
        self.dist[u] = INF;
        false
    }

    fn max_matching(&mut self) -> usize {
        let mut res = 0;
        while self.bfs() {
            for u in 1..=self.n_l {
                if self.pair_l[u] == 0 && self.dfs(u) {
                    res += 1;
                }
            }
        }
        res
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
    let k: usize = it.next().unwrap().parse().unwrap();

    let mut hk = HopcroftKarp::new(n, m);
    for _ in 0..k {
        let u: usize = it.next().unwrap().parse().unwrap();
        let v: usize = it.next().unwrap().parse().unwrap();
        hk.adj[u].push(v);
    }

    let ans = hk.max_matching();
    let mut out = format!("{}\\n", ans);
    for u in 1..=n {
        if hk.pair_l[u] != 0 {
            out.push_str(&format!("{} {}\\n", u, hk.pair_l[u]));
        }
    }
    print!("{}", out);
}`,
    java21: `import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.List;
import java.util.Queue;

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
        int nextInt() throws IOException {
            int c = readByte();
            while (c >= 0 && c <= ' ') c = readByte();
            if (c == -1) return Integer.MIN_VALUE;
            int res = 0;
            while (c > ' ') { res = res * 10 + (c - '0'); c = readByte(); }
            return res;
        }
    }

    static final int INF = 1_000_000_000;
    static int n, m;
    static List<Integer>[] adj;
    static int[] pairL, pairR, dist;

    static boolean bfs() {
        Queue<Integer> q = new ArrayDeque<>();
        for (int u = 1; u <= n; u++) {
            if (pairL[u] == 0) {
                dist[u] = 0;
                q.add(u);
            } else {
                dist[u] = INF;
            }
        }
        dist[0] = INF;
        while (!q.isEmpty()) {
            int u = q.poll();
            if (dist[u] < dist[0]) {
                for (int v : adj[u]) {
                    int nxt = pairR[v];
                    if (dist[nxt] == INF) {
                        dist[nxt] = dist[u] + 1;
                        q.add(nxt);
                    }
                }
            }
        }
        return dist[0] != INF;
    }

    static boolean dfs(int u) {
        if (u == 0) return true;
        for (int v : adj[u]) {
            int nxt = pairR[v];
            if (dist[nxt] == dist[u] + 1 && dfs(nxt)) {
                pairR[v] = u;
                pairL[u] = v;
                return true;
            }
        }
        dist[u] = INF;
        return false;
    }

    @SuppressWarnings("unchecked")
    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        n = fs.nextInt();
        if (n == Integer.MIN_VALUE) return;
        m = fs.nextInt();
        int k = fs.nextInt();

        adj = new List[n + 1];
        for (int i = 0; i <= n; i++) adj[i] = new ArrayList<>();
        for (int i = 0; i < k; i++) {
            int u = fs.nextInt(), v = fs.nextInt();
            adj[u].add(v);
        }

        pairL = new int[n + 1];
        pairR = new int[m + 1];
        dist = new int[n + 1];

        int matching = 0;
        while (bfs()) {
            for (int u = 1; u <= n; u++) {
                if (pairL[u] == 0 && dfs(u)) matching++;
            }
        }

        StringBuilder sb = new StringBuilder();
        sb.append(matching).append('\\n');
        for (int u = 1; u <= n; u++) {
            if (pairL[u] != 0) sb.append(u).append(' ').append(pairL[u]).append('\\n');
        }
        System.out.print(sb);
    }
}`,
    python3: `from collections import deque
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
    for _ in range(k):
        u = int(next(it))
        v = int(next(it))
        adj[u].append(v)

    INF = 10**9
    pair_l = [0] * (n + 1)
    pair_r = [0] * (m + 1)
    dist = [INF] * (n + 1)

    def bfs() -> bool:
        q = deque()
        for u in range(1, n + 1):
            if pair_l[u] == 0:
                dist[u] = 0
                q.append(u)
            else:
                dist[u] = INF
        dist[0] = INF
        while q:
            u = q.popleft()
            if dist[u] < dist[0]:
                du = dist[u] + 1
                for v in adj[u]:
                    nxt = pair_r[v]
                    if dist[nxt] == INF:
                        dist[nxt] = du
                        q.append(nxt)
        return dist[0] != INF

    def dfs(u: int) -> bool:
        if u == 0:
            return True
        du = dist[u] + 1
        for v in adj[u]:
            nxt = pair_r[v]
            if dist[nxt] == du and dfs(nxt):
                pair_r[v] = u
                pair_l[u] = v
                return True
        dist[u] = INF
        return False

    matching = 0
    while bfs():
        for u in range(1, n + 1):
            if pair_l[u] == 0 and dfs(u):
                matching += 1

    out = [str(matching)]
    for u in range(1, n + 1):
        if pair_l[u] != 0:
            out.append(f"{u} {pair_l[u]}")
    sys.stdout.write("\\n".join(out) + "\\n")

if __name__ == "__main__":
    solve()`,
    ruby: `tokens = $stdin.read.split
exit if tokens.empty?
idx = 0
n = tokens[idx].to_i
m = tokens[idx + 1].to_i
k = tokens[idx + 2].to_i
idx += 3

adj = Array.new(n + 1) { [] }
k.times do
  u = tokens[idx].to_i
  v = tokens[idx + 1].to_i
  idx += 2
  adj[u] << v
end

inf = 1_000_000_000
pair_l = Array.new(n + 1, 0)
pair_r = Array.new(m + 1, 0)
dist = Array.new(n + 1, inf)

bfs = lambda do
  q = []
  (1..n).each do |u|
    if pair_l[u] == 0
      dist[u] = 0
      q << u
    else
      dist[u] = inf
    end
  end
  dist[0] = inf
  head = 0
  while head < q.length
    u = q[head]
    head += 1
    if dist[u] < dist[0]
      adj[u].each do |v|
        nxt = pair_r[v]
        if dist[nxt] == inf
          dist[nxt] = dist[u] + 1
          q << nxt
        end
      end
    end
  end
  dist[0] != inf
end

dfs = nil
dfs = lambda do |u|
  return true if u == 0
  adj[u].each do |v|
    nxt = pair_r[v]
    if dist[nxt] == dist[u] + 1 && dfs.call(nxt)
      pair_r[v] = u
      pair_l[u] = v
      return true
    end
  end
  dist[u] = inf
  false
end

matching = 0
while bfs.call
  (1..n).each do |u|
    matching += 1 if pair_l[u] == 0 && dfs.call(u)
  end
end

out = [matching.to_s]
(1..n).each { |u| out << "#{u} #{pair_l[u]}" if pair_l[u] != 0 }
puts out.join("\\n")`,
  },
  practiceProblems: [
    {
      id: 'ch36-p1',
      tier: 'Warmup',
      ratingRange: '1750–1950',
      title: 'Maximum Bipartite Matching (School Dance) in O(E sqrt(V))',
      statement:
        'There are N boys (1..N) and M girls (1..M), and K potential dancing pairs (u, v). Find the maximum number of disjoint pairs that can dance simultaneously and output the pairs.',
      constraints: '1 <= N, M <= 5 * 10^4, 1 <= K <= 2 * 10^5',
      sampleInput: '3 4 4\n1 1\n1 2\n2 1\n3 4',
      sampleOutput: '3\n1 2\n2 1\n3 4',
      hints: [
        'Use Hopcroft-Karp instead of naive Kuhn so dense `N = 5 * 10^4` inputs run cleanly under 0.1s!',
        'Run alternating multi-source BFS from unmatched boys (`pairL[u] == 0`), followed by dead-end-pruned DFS across layer edges `dist[pairR[v]] == dist[u] + 1`.',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, m, k;
    if (!(cin >> n >> m >> k)) return 0;
    vector<vector<int>> adj(n + 1);
    for (int i = 0; i < k; i++) {
        int u, v;
        cin >> u >> v;
        adj[u].push_back(v);
    }

    const int INF = 1e9;
    vector<int> pairL(n + 1, 0), pairR(m + 1, 0), dist(n + 1, INF);

    auto bfs = [&]() -> bool {
        queue<int> q;
        for (int u = 1; u <= n; u++) {
            if (pairL[u] == 0) {
                dist[u] = 0;
                q.push(u);
            } else {
                dist[u] = INF;
            }
        }
        dist[0] = INF;
        while (!q.empty()) {
            int u = q.front();
            q.pop();
            if (dist[u] < dist[0]) {
                for (int v : adj[u]) {
                    if (dist[pairR[v]] == INF) {
                        dist[pairR[v]] = dist[u] + 1;
                        q.push(pairR[v]);
                    }
                }
            }
        }
        return dist[0] != INF;
    };

    auto dfs = [&](auto& self, int u) -> bool {
        if (u == 0) return true;
        for (int v : adj[u]) {
            if (dist[pairR[v]] == dist[u] + 1 && self(self, pairR[v])) {
                pairR[v] = u;
                pairL[u] = v;
                return true;
            }
        }
        dist[u] = INF;
        return false;
    };

    int matching = 0;
    while (bfs()) {
        for (int u = 1; u <= n; u++) {
            if (pairL[u] == 0 && dfs(dfs, u)) matching++;
        }
    }

    cout << matching << "\\n";
    for (int u = 1; u <= n; u++) {
        if (pairL[u] != 0) cout << u << " " << pairL[u] << "\\n";
    }
    return 0;
}`,
        rust: `use std::collections::VecDeque;
use std::io::{self, Read};

const INF: i32 = 1_000_000_000;

fn bfs(n: usize, adj: &[Vec<usize>], pair_l: &[usize], pair_r: &[usize], dist: &mut [i32]) -> bool {
    let mut q = VecDeque::new();
    for u in 1..=n {
        if pair_l[u] == 0 {
            dist[u] = 0;
            q.push_back(u);
        } else {
            dist[u] = INF;
        }
    }
    dist[0] = INF;
    while let Some(u) = q.pop_front() {
        if dist[u] < dist[0] {
            for &v in &adj[u] {
                let nxt = pair_r[v];
                if dist[nxt] == INF {
                    dist[nxt] = dist[u] + 1;
                    q.push_back(nxt);
                }
            }
        }
    }
    dist[0] != INF
}

fn dfs(
    u: usize,
    adj: &[Vec<usize>],
    pair_l: &mut [usize],
    pair_r: &mut [usize],
    dist: &mut [i32],
) -> bool {
    if u == 0 {
        return true;
    }
    for &v in &adj[u] {
        let nxt = pair_r[v];
        if dist[nxt] == dist[u] + 1 && dfs(nxt, adj, pair_l, pair_r, dist) {
            pair_r[v] = u;
            pair_l[u] = v;
            return true;
        }
    }
    dist[u] = INF;
    false
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
    let k: usize = it.next().unwrap().parse().unwrap();

    let mut adj = vec![Vec::new(); n + 1];
    for _ in 0..k {
        let u: usize = it.next().unwrap().parse().unwrap();
        let v: usize = it.next().unwrap().parse().unwrap();
        adj[u].push(v);
    }

    let mut pair_l = vec![0usize; n + 1];
    let mut pair_r = vec![0usize; m + 1];
    let mut dist = vec![INF; n + 1];
    let mut matching = 0usize;

    while bfs(n, &adj, &pair_l, &pair_r, &mut dist) {
        for u in 1..=n {
            if pair_l[u] == 0 && dfs(u, &adj, &mut pair_l, &mut pair_r, &mut dist) {
                matching += 1;
            }
        }
    }

    let mut out = format!("{}\\n", matching);
    for u in 1..=n {
        if pair_l[u] != 0 {
            out.push_str(&format!("{} {}\\n", u, pair_l[u]));
        }
    }
    print!("{}", out);
}`,
        java21: `import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.List;
import java.util.Queue;

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
        int nextInt() throws IOException {
            int c = readByte();
            while (c >= 0 && c <= ' ') c = readByte();
            if (c == -1) return Integer.MIN_VALUE;
            int res = 0;
            while (c > ' ') { res = res * 10 + (c - '0'); c = readByte(); }
            return res;
        }
    }

    static final int INF = 1_000_000_000;
    static int n, m;
    static List<Integer>[] adj;
    static int[] pairL, pairR, dist;

    static boolean bfs() {
        Queue<Integer> q = new ArrayDeque<>();
        for (int u = 1; u <= n; u++) {
            if (pairL[u] == 0) { dist[u] = 0; q.add(u); }
            else dist[u] = INF;
        }
        dist[0] = INF;
        while (!q.isEmpty()) {
            int u = q.poll();
            if (dist[u] < dist[0]) {
                for (int v : adj[u]) {
                    int nxt = pairR[v];
                    if (dist[nxt] == INF) {
                        dist[nxt] = dist[u] + 1;
                        q.add(nxt);
                    }
                }
            }
        }
        return dist[0] != INF;
    }

    static boolean dfs(int u) {
        if (u == 0) return true;
        for (int v : adj[u]) {
            int nxt = pairR[v];
            if (dist[nxt] == dist[u] + 1 && dfs(nxt)) {
                pairR[v] = u;
                pairL[u] = v;
                return true;
            }
        }
        dist[u] = INF;
        return false;
    }

    @SuppressWarnings("unchecked")
    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        n = fs.nextInt();
        if (n == Integer.MIN_VALUE) return;
        m = fs.nextInt();
        int k = fs.nextInt();

        adj = new List[n + 1];
        for (int i = 0; i <= n; i++) adj[i] = new ArrayList<>();
        for (int i = 0; i < k; i++) adj[fs.nextInt()].add(fs.nextInt());

        pairL = new int[n + 1];
        pairR = new int[m + 1];
        dist = new int[n + 1];
        int matching = 0;
        while (bfs()) {
            for (int u = 1; u <= n; u++) {
                if (pairL[u] == 0 && dfs(u)) matching++;
            }
        }
        StringBuilder sb = new StringBuilder();
        sb.append(matching).append('\\n');
        for (int u = 1; u <= n; u++) {
            if (pairL[u] != 0) sb.append(u).append(' ').append(pairL[u]).append('\\n');
        }
        System.out.print(sb);
    }
}`,
        python3: `from collections import deque
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
    for _ in range(k):
        u = int(next(it))
        v = int(next(it))
        adj[u].append(v)

    INF = 10**9
    pair_l = [0] * (n + 1)
    pair_r = [0] * (m + 1)
    dist = [INF] * (n + 1)

    def bfs() -> bool:
        q = deque()
        for u in range(1, n + 1):
            if pair_l[u] == 0:
                dist[u] = 0
                q.append(u)
            else:
                dist[u] = INF
        dist[0] = INF
        while q:
            u = q.popleft()
            if dist[u] < dist[0]:
                du = dist[u] + 1
                for v in adj[u]:
                    nxt = pair_r[v]
                    if dist[nxt] == INF:
                        dist[nxt] = du
                        q.append(nxt)
        return dist[0] != INF

    def dfs(u: int) -> bool:
        if u == 0:
            return True
        du = dist[u] + 1
        for v in adj[u]:
            nxt = pair_r[v]
            if dist[nxt] == du and dfs(nxt):
                pair_r[v] = u
                pair_l[u] = v
                return True
        dist[u] = INF
        return False

    matching = 0
    while bfs():
        for u in range(1, n + 1):
            if pair_l[u] == 0 and dfs(u):
                matching += 1

    out = [str(matching)]
    for u in range(1, n + 1):
        if pair_l[u]:
            out.append(f"{u} {pair_l[u]}")
    sys.stdout.write("\\n".join(out) + "\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
idx = 0
n = tokens[idx].to_i
m = tokens[idx + 1].to_i
k = tokens[idx + 2].to_i
idx += 3

adj = Array.new(n + 1) { [] }
k.times do
  u = tokens[idx].to_i
  v = tokens[idx + 1].to_i
  idx += 2
  adj[u] << v
end

inf = 1_000_000_000
pair_l = Array.new(n + 1, 0)
pair_r = Array.new(m + 1, 0)
dist = Array.new(n + 1, inf)

bfs = lambda do
  q = []
  (1..n).each do |u|
    if pair_l[u] == 0
      dist[u] = 0
      q << u
    else
      dist[u] = inf
    end
  end
  dist[0] = inf
  head = 0
  while head < q.length
    u = q[head]
    head += 1
    if dist[u] < dist[0]
      adj[u].each do |v|
        nxt = pair_r[v]
        if dist[nxt] == inf
          dist[nxt] = dist[u] + 1
          q << nxt
        end
      end
    end
  end
  dist[0] != inf
end

dfs = nil
dfs = lambda do |u|
  return true if u == 0
  adj[u].each do |v|
    nxt = pair_r[v]
    if dist[nxt] == dist[u] + 1 && dfs.call(nxt)
      pair_r[v] = u
      pair_l[u] = v
      return true
    end
  end
  dist[u] = inf
  false
end

matching = 0
while bfs.call
  (1..n).each { |u| matching += 1 if pair_l[u] == 0 && dfs.call(u) }
end

out = [matching.to_s]
(1..n).each { |u| out << "#{u} #{pair_l[u]}" if pair_l[u] != 0 }
puts out.join("\\n")`,
      },
    },
    {
      id: 'ch36-p2',
      tier: 'Standard',
      ratingRange: '1900–2150',
      title: 'Minimum Vertex Cover & Maximum Independent Set Reconstruction (Konig Theorem)',
      statement:
        'Given an N x M bipartite graph with K edges, compute its Maximum Bipartite Matching, then reconstruct an explicit Minimum Vertex Cover (MVC) AND Maximum Independent Set (MIS) using Konig’s Theorem. Output |MVC|, the left vertices in MVC, the right vertices in MVC, and |MIS|.',
      constraints: '1 <= N, M <= 5 * 10^4, 0 <= K <= 2 * 10^5',
      sampleInput: '3 3 3\n1 1\n1 2\n2 1',
      sampleOutput: '2\nL: 1\nR: 1\nMIS: 4',
      hints: [
        'Run Hopcroft-Karp first. Then run an alternating BFS/DFS starting from ALL unmatched Left vertices (`pairL[u] == 0`): mark `visL[u] = true`, traverse every non-matching edge `u -> v` to mark `visR[v] = true`, and immediately follow the matching edge back `v -> pairR[v]` to mark `visL[pairR[v]] = true`!',
        'By Konig’s Theorem, **Minimum Vertex Cover** = `{u in L : !visL[u]} U {v in R : visR[v]}` (no edge can have both `visL[u] == true` and `visR[v] == false`!), and **Maximum Independent Set** = `{u in L : visL[u]} U {v in R : !visR[v]}` of size `N + M - |MVC|`!',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, m, k;
    if (!(cin >> n >> m >> k)) return 0;
    vector<vector<int>> adj(n + 1);
    for (int i = 0; i < k; i++) {
        int u, v;
        cin >> u >> v;
        adj[u].push_back(v);
    }

    const int INF = 1e9;
    vector<int> pairL(n + 1, 0), pairR(m + 1, 0), dist(n + 1, INF);

    auto bfs = [&]() -> bool {
        queue<int> q;
        for (int u = 1; u <= n; u++) {
            if (pairL[u] == 0) { dist[u] = 0; q.push(u); }
            else dist[u] = INF;
        }
        dist[0] = INF;
        while (!q.empty()) {
            int u = q.front(); q.pop();
            if (dist[u] < dist[0]) {
                for (int v : adj[u]) {
                    if (dist[pairR[v]] == INF) {
                        dist[pairR[v]] = dist[u] + 1;
                        q.push(pairR[v]);
                    }
                }
            }
        }
        return dist[0] != INF;
    };

    auto dfs = [&](auto& self, int u) -> bool {
        if (u == 0) return true;
        for (int v : adj[u]) {
            if (dist[pairR[v]] == dist[u] + 1 && self(self, pairR[v])) {
                pairR[v] = u;
                pairL[u] = v;
                return true;
            }
        }
        dist[u] = INF;
        return false;
    };

    int matching = 0;
    while (bfs()) {
        for (int u = 1; u <= n; u++) {
            if (pairL[u] == 0 && dfs(dfs, u)) matching++;
        }
    }

    // Konig alternating reachability from unmatched Left nodes
    vector<bool> visL(n + 1, false), visR(m + 1, false);
    queue<int> q;
    for (int u = 1; u <= n; u++) {
        if (pairL[u] == 0) {
            visL[u] = true;
            q.push(u);
        }
    }
    while (!q.empty()) {
        int u = q.front();
        q.pop();
        for (int v : adj[u]) {
            if (v != pairL[u] && !visR[v]) {
                visR[v] = true;
                if (pairR[v] != 0 && !visL[pairR[v]]) {
                    visL[pairR[v]] = true;
                    q.push(pairR[v]);
                }
            }
        }
    }

    vector<int> mvcL, mvcR;
    for (int u = 1; u <= n; u++) if (!visL[u]) mvcL.push_back(u);
    for (int v = 1; v <= m; v++) if (visR[v]) mvcR.push_back(v);

    cout << (mvcL.size() + mvcR.size()) << "\\n";
    cout << "L:";
    for (int u : mvcL) cout << " " << u;
    cout << "\\nR:";
    for (int v : mvcR) cout << " " << v;
    cout << "\\nMIS: " << (n + m - (int)mvcL.size() - (int)mvcR.size()) << "\\n";
    return 0;
}`,
        rust: `use std::collections::VecDeque;
use std::io::{self, Read};

const INF: i32 = 1_000_000_000;

fn bfs(n: usize, adj: &[Vec<usize>], pair_l: &[usize], pair_r: &[usize], dist: &mut [i32]) -> bool {
    let mut q = VecDeque::new();
    for u in 1..=n {
        if pair_l[u] == 0 {
            dist[u] = 0;
            q.push_back(u);
        } else {
            dist[u] = INF;
        }
    }
    dist[0] = INF;
    while let Some(u) = q.pop_front() {
        if dist[u] < dist[0] {
            for &v in &adj[u] {
                let nxt = pair_r[v];
                if dist[nxt] == INF {
                    dist[nxt] = dist[u] + 1;
                    q.push_back(nxt);
                }
            }
        }
    }
    dist[0] != INF
}

fn dfs(u: usize, adj: &[Vec<usize>], pair_l: &mut [usize], pair_r: &mut [usize], dist: &mut [i32]) -> bool {
    if u == 0 {
        return true;
    }
    for &v in &adj[u] {
        let nxt = pair_r[v];
        if dist[nxt] == dist[u] + 1 && dfs(nxt, adj, pair_l, pair_r, dist) {
            pair_r[v] = u;
            pair_l[u] = v;
            return true;
        }
    }
    dist[u] = INF;
    false
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
    let k: usize = it.next().unwrap().parse().unwrap();

    let mut adj = vec![Vec::new(); n + 1];
    for _ in 0..k {
        let u: usize = it.next().unwrap().parse().unwrap();
        let v: usize = it.next().unwrap().parse().unwrap();
        adj[u].push(v);
    }

    let mut pair_l = vec![0usize; n + 1];
    let mut pair_r = vec![0usize; m + 1];
    let mut dist = vec![INF; n + 1];
    while bfs(n, &adj, &pair_l, &pair_r, &mut dist) {
        for u in 1..=n {
            if pair_l[u] == 0 {
                dfs(u, &adj, &mut pair_l, &mut pair_r, &mut dist);
            }
        }
    }

    let mut vis_l = vec![false; n + 1];
    let mut vis_r = vec![false; m + 1];
    let mut q = VecDeque::new();
    for u in 1..=n {
        if pair_l[u] == 0 {
            vis_l[u] = true;
            q.push_back(u);
        }
    }
    while let Some(u) = q.pop_front() {
        for &v in &adj[u] {
            if v != pair_l[u] && !vis_r[v] {
                vis_r[v] = true;
                if pair_r[v] != 0 && !vis_l[pair_r[v]] {
                    vis_l[pair_r[v]] = true;
                    q.push_back(pair_r[v]);
                }
            }
        }
    }

    let mvc_l: Vec<usize> = (1..=n).filter(|&u| !vis_l[u]).collect();
    let mvc_r: Vec<usize> = (1..=m).filter(|&v| vis_r[v]).collect();
    println!("{}", mvc_l.len() + mvc_r.len());
    print!("L:");
    for u in &mvc_l { print!(" {}", u); }
    println!();
    print!("R:");
    for v in &mvc_r { print!(" {}", v); }
    println!();
    println!("MIS: {}", n + m - mvc_l.len() - mvc_r.len());
}`,
        java21: `import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.List;
import java.util.Queue;

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
        int nextInt() throws IOException {
            int c = readByte();
            while (c >= 0 && c <= ' ') c = readByte();
            if (c == -1) return Integer.MIN_VALUE;
            int res = 0;
            while (c > ' ') { res = res * 10 + (c - '0'); c = readByte(); }
            return res;
        }
    }

    static final int INF = 1_000_000_000;
    static int n, m;
    static List<Integer>[] adj;
    static int[] pairL, pairR, dist;

    static boolean bfs() {
        Queue<Integer> q = new ArrayDeque<>();
        for (int u = 1; u <= n; u++) {
            if (pairL[u] == 0) { dist[u] = 0; q.add(u); }
            else dist[u] = INF;
        }
        dist[0] = INF;
        while (!q.isEmpty()) {
            int u = q.poll();
            if (dist[u] < dist[0]) {
                for (int v : adj[u]) {
                    int nxt = pairR[v];
                    if (dist[nxt] == INF) { dist[nxt] = dist[u] + 1; q.add(nxt); }
                }
            }
        }
        return dist[0] != INF;
    }

    static boolean dfs(int u) {
        if (u == 0) return true;
        for (int v : adj[u]) {
            int nxt = pairR[v];
            if (dist[nxt] == dist[u] + 1 && dfs(nxt)) {
                pairR[v] = u;
                pairL[u] = v;
                return true;
            }
        }
        dist[u] = INF;
        return false;
    }

    @SuppressWarnings("unchecked")
    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        n = fs.nextInt();
        if (n == Integer.MIN_VALUE) return;
        m = fs.nextInt();
        int k = fs.nextInt();

        adj = new List[n + 1];
        for (int i = 0; i <= n; i++) adj[i] = new ArrayList<>();
        for (int i = 0; i < k; i++) adj[fs.nextInt()].add(fs.nextInt());

        pairL = new int[n + 1];
        pairR = new int[m + 1];
        dist = new int[n + 1];
        while (bfs()) {
            for (int u = 1; u <= n; u++) if (pairL[u] == 0) dfs(u);
        }

        boolean[] visL = new boolean[n + 1];
        boolean[] visR = new boolean[m + 1];
        Queue<Integer> q = new ArrayDeque<>();
        for (int u = 1; u <= n; u++) {
            if (pairL[u] == 0) { visL[u] = true; q.add(u); }
        }
        while (!q.isEmpty()) {
            int u = q.poll();
            for (int v : adj[u]) {
                if (v != pairL[u] && !visR[v]) {
                    visR[v] = true;
                    if (pairR[v] != 0 && !visL[pairR[v]]) {
                        visL[pairR[v]] = true;
                        q.add(pairR[v]);
                    }
                }
            }
        }

        List<Integer> mvcL = new ArrayList<>();
        List<Integer> mvcR = new ArrayList<>();
        for (int u = 1; u <= n; u++) if (!visL[u]) mvcL.add(u);
        for (int v = 1; v <= m; v++) if (visR[v]) mvcR.add(v);

        StringBuilder sb = new StringBuilder();
        sb.append(mvcL.size() + mvcR.size()).append("\\nL:");
        for (int u : mvcL) sb.append(' ').append(u);
        sb.append("\\nR:");
        for (int v : mvcR) sb.append(' ').append(v);
        sb.append("\\nMIS: ").append(n + m - mvcL.size() - mvcR.size()).append('\\n');
        System.out.print(sb);
    }
}`,
        python3: `from collections import deque
import sys

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    n, m, k = int(next(it)), int(next(it)), int(next(it))
    adj = [[] for _ in range(n + 1)]
    for _ in range(k):
        adj[int(next(it))].append(int(next(it)))

    INF = 10**9
    pair_l = [0] * (n + 1)
    pair_r = [0] * (m + 1)
    dist = [INF] * (n + 1)

    def bfs() -> bool:
        q = deque()
        for u in range(1, n + 1):
            if pair_l[u] == 0:
                dist[u] = 0
                q.append(u)
            else:
                dist[u] = INF
        dist[0] = INF
        while q:
            u = q.popleft()
            if dist[u] < dist[0]:
                du = dist[u] + 1
                for v in adj[u]:
                    nxt = pair_r[v]
                    if dist[nxt] == INF:
                        dist[nxt] = du
                        q.append(nxt)
        return dist[0] != INF

    def dfs(u: int) -> bool:
        if u == 0:
            return True
        du = dist[u] + 1
        for v in adj[u]:
            nxt = pair_r[v]
            if dist[nxt] == du and dfs(nxt):
                pair_r[v] = u
                pair_l[u] = v
                return True
        dist[u] = INF
        return False

    while bfs():
        for u in range(1, n + 1):
            if pair_l[u] == 0:
                dfs(u)

    vis_l = [False] * (n + 1)
    vis_r = [False] * (m + 1)
    q = deque()
    for u in range(1, n + 1):
        if pair_l[u] == 0:
            vis_l[u] = True
            q.append(u)
    while q:
        u = q.popleft()
        for v in adj[u]:
            if v != pair_l[u] and not vis_r[v]:
                vis_r[v] = True
                if pair_r[v] and not vis_l[pair_r[v]]:
                    vis_l[pair_r[v]] = True
                    q.append(pair_r[v])

    mvc_l = [u for u in range(1, n + 1) if not vis_l[u]]
    mvc_r = [v for v in range(1, m + 1) if vis_r[v]]
    print(len(mvc_l) + len(mvc_r))
    print("L:" + "".join(f" {u}" for u in mvc_l))
    print("R:" + "".join(f" {v}" for v in mvc_r))
    print(f"MIS: {n + m - len(mvc_l) - len(mvc_r)}")

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
idx = 0
n = tokens[idx].to_i
m = tokens[idx + 1].to_i
k = tokens[idx + 2].to_i
idx += 3

adj = Array.new(n + 1) { [] }
k.times do
  adj[tokens[idx].to_i] << tokens[idx + 1].to_i
  idx += 2
end

inf = 1_000_000_000
pair_l = Array.new(n + 1, 0)
pair_r = Array.new(m + 1, 0)
dist = Array.new(n + 1, inf)

bfs = lambda do
  q = []
  (1..n).each do |u|
    if pair_l[u] == 0
      dist[u] = 0
      q << u
    else
      dist[u] = inf
    end
  end
  dist[0] = inf
  head = 0
  while head < q.length
    u = q[head]
    head += 1
    if dist[u] < dist[0]
      adj[u].each do |v|
        nxt = pair_r[v]
        if dist[nxt] == inf
          dist[nxt] = dist[u] + 1
          q << nxt
        end
      end
    end
  end
  dist[0] != inf
end

dfs = nil
dfs = lambda do |u|
  return true if u == 0
  adj[u].each do |v|
    nxt = pair_r[v]
    if dist[nxt] == dist[u] + 1 && dfs.call(nxt)
      pair_r[v] = u
      pair_l[u] = v
      return true
    end
  end
  dist[u] = inf
  false
end

while bfs.call
  (1..n).each { |u| dfs.call(u) if pair_l[u] == 0 }
end

vis_l = Array.new(n + 1, false)
vis_r = Array.new(m + 1, false)
q = []
(1..n).each do |u|
  if pair_l[u] == 0
    vis_l[u] = true
    q << u
  end
end
head = 0
while head < q.length
  u = q[head]
  head += 1
  adj[u].each do |v|
    if v != pair_l[u] && !vis_r[v]
      vis_r[v] = true
      if pair_r[v] != 0 && !vis_l[pair_r[v]]
        vis_l[pair_r[v]] = true
        q << pair_r[v]
      end
    end
  end
end

mvc_l = (1..n).reject { |u| vis_l[u] }
mvc_r = (1..m).select { |v| vis_r[v] }
puts mvc_l.length + mvc_r.length
puts "L:" + mvc_l.map { |u| " #{u}" }.join
puts "R:" + mvc_r.map { |v| " #{v}" }.join
puts "MIS: #{n + m - mvc_l.length - mvc_r.length}"`,
      },
    },
    {
      id: 'ch36-p3',
      tier: 'Boss',
      ratingRange: '2050–2300',
      title: 'Minimum Disjoint Path Cover in a Directed Acyclic Graph (DAG)',
      statement:
        'Given a Directed Acyclic Graph (DAG) with N vertices (1..N) and M directed edges (u -> v), find the minimum number of vertex-disjoint directed paths needed so that every vertex belongs to exactly one path, and print each reconstructed path.',
      constraints: '1 <= N <= 5 * 10^4, 0 <= M <= 2 * 10^5',
      sampleInput: '4 3\n1 2\n2 3\n2 4',
      sampleOutput: '2\n1 2 3\n4',
      hints: [
        'Start with `N` trivial single-vertex paths. Every directed matching edge `(u_out -> v_in)` merges the path ending at `u` with the path starting at `v`, reducing the total path count by 1!',
        'Run Hopcroft-Karp on bipartite graph `(1..N) x (1..N)` where each DAG edge `u -> v` connects `u` on Left to `v` on Right. Then `minPaths = N - maxMatching`, path starts are nodes with `pairR[v] == 0`, and you simply follow `v -> pairL[v]` until `0`!',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, m;
    if (!(cin >> n >> m)) return 0;
    vector<vector<int>> adj(n + 1);
    for (int i = 0; i < m; i++) {
        int u, v;
        cin >> u >> v;
        adj[u].push_back(v);
    }

    const int INF = 1e9;
    vector<int> pairL(n + 1, 0), pairR(n + 1, 0), dist(n + 1, INF);

    auto bfs = [&]() -> bool {
        queue<int> q;
        for (int u = 1; u <= n; u++) {
            if (pairL[u] == 0) { dist[u] = 0; q.push(u); }
            else dist[u] = INF;
        }
        dist[0] = INF;
        while (!q.empty()) {
            int u = q.front(); q.pop();
            if (dist[u] < dist[0]) {
                for (int v : adj[u]) {
                    if (dist[pairR[v]] == INF) {
                        dist[pairR[v]] = dist[u] + 1;
                        q.push(pairR[v]);
                    }
                }
            }
        }
        return dist[0] != INF;
    };

    auto dfs = [&](auto& self, int u) -> bool {
        if (u == 0) return true;
        for (int v : adj[u]) {
            if (dist[pairR[v]] == dist[u] + 1 && self(self, pairR[v])) {
                pairR[v] = u;
                pairL[u] = v;
                return true;
            }
        }
        dist[u] = INF;
        return false;
    };

    int matching = 0;
    while (bfs()) {
        for (int u = 1; u <= n; u++) {
            if (pairL[u] == 0 && dfs(dfs, u)) matching++;
        }
    }

    cout << (n - matching) << "\\n";
    for (int v = 1; v <= n; v++) {
        if (pairR[v] == 0) { // Start of a disjoint path
            int cur = v;
            while (cur != 0) {
                cout << cur << (pairL[cur] == 0 ? '\\n' : ' ');
                cur = pairL[cur];
            }
        }
    }
    return 0;
}`,
        rust: `use std::collections::VecDeque;
use std::io::{self, Read};

const INF: i32 = 1_000_000_000;

fn bfs(n: usize, adj: &[Vec<usize>], pair_l: &[usize], pair_r: &[usize], dist: &mut [i32]) -> bool {
    let mut q = VecDeque::new();
    for u in 1..=n {
        if pair_l[u] == 0 {
            dist[u] = 0;
            q.push_back(u);
        } else {
            dist[u] = INF;
        }
    }
    dist[0] = INF;
    while let Some(u) = q.pop_front() {
        if dist[u] < dist[0] {
            for &v in &adj[u] {
                let nxt = pair_r[v];
                if dist[nxt] == INF {
                    dist[nxt] = dist[u] + 1;
                    q.push_back(nxt);
                }
            }
        }
    }
    dist[0] != INF
}

fn dfs(u: usize, adj: &[Vec<usize>], pair_l: &mut [usize], pair_r: &mut [usize], dist: &mut [i32]) -> bool {
    if u == 0 {
        return true;
    }
    for &v in &adj[u] {
        let nxt = pair_r[v];
        if dist[nxt] == dist[u] + 1 && dfs(nxt, adj, pair_l, pair_r, dist) {
            pair_r[v] = u;
            pair_l[u] = v;
            return true;
        }
    }
    dist[u] = INF;
    false
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

    let mut adj = vec![Vec::new(); n + 1];
    for _ in 0..m {
        let u: usize = it.next().unwrap().parse().unwrap();
        let v: usize = it.next().unwrap().parse().unwrap();
        adj[u].push(v);
    }

    let mut pair_l = vec![0usize; n + 1];
    let mut pair_r = vec![0usize; n + 1];
    let mut dist = vec![INF; n + 1];
    let mut matching = 0usize;

    while bfs(n, &adj, &pair_l, &pair_r, &mut dist) {
        for u in 1..=n {
            if pair_l[u] == 0 && dfs(u, &adj, &mut pair_l, &mut pair_r, &mut dist) {
                matching += 1;
            }
        }
    }

    let mut out = format!("{}\\n", n - matching);
    for v in 1..=n {
        if pair_r[v] == 0 {
            let mut path = Vec::new();
            let mut cur = v;
            while cur != 0 {
                path.push(cur.to_string());
                cur = pair_l[cur];
            }
            out.push_str(&path.join(" "));
            out.push('\\n');
        }
    }
    print!("{}", out);
}`,
        java21: `import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.List;
import java.util.Queue;

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
        int nextInt() throws IOException {
            int c = readByte();
            while (c >= 0 && c <= ' ') c = readByte();
            if (c == -1) return Integer.MIN_VALUE;
            int res = 0;
            while (c > ' ') { res = res * 10 + (c - '0'); c = readByte(); }
            return res;
        }
    }

    static final int INF = 1_000_000_000;
    static int n;
    static List<Integer>[] adj;
    static int[] pairL, pairR, dist;

    static boolean bfs() {
        Queue<Integer> q = new ArrayDeque<>();
        for (int u = 1; u <= n; u++) {
            if (pairL[u] == 0) { dist[u] = 0; q.add(u); }
            else dist[u] = INF;
        }
        dist[0] = INF;
        while (!q.isEmpty()) {
            int u = q.poll();
            if (dist[u] < dist[0]) {
                for (int v : adj[u]) {
                    int nxt = pairR[v];
                    if (dist[nxt] == INF) { dist[nxt] = dist[u] + 1; q.add(nxt); }
                }
            }
        }
        return dist[0] != INF;
    }

    static boolean dfs(int u) {
        if (u == 0) return true;
        for (int v : adj[u]) {
            int nxt = pairR[v];
            if (dist[nxt] == dist[u] + 1 && dfs(nxt)) {
                pairR[v] = u;
                pairL[u] = v;
                return true;
            }
        }
        dist[u] = INF;
        return false;
    }

    @SuppressWarnings("unchecked")
    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        n = fs.nextInt();
        if (n == Integer.MIN_VALUE) return;
        int m = fs.nextInt();

        adj = new List[n + 1];
        for (int i = 0; i <= n; i++) adj[i] = new ArrayList<>();
        for (int i = 0; i < m; i++) adj[fs.nextInt()].add(fs.nextInt());

        pairL = new int[n + 1];
        pairR = new int[n + 1];
        dist = new int[n + 1];

        int matching = 0;
        while (bfs()) {
            for (int u = 1; u <= n; u++) if (pairL[u] == 0 && dfs(u)) matching++;
        }

        StringBuilder sb = new StringBuilder();
        sb.append(n - matching).append('\\n');
        for (int v = 1; v <= n; v++) {
            if (pairR[v] == 0) {
                int cur = v;
                while (cur != 0) {
                    sb.append(cur).append(pairL[cur] == 0 ? '\\n' : ' ');
                    cur = pairL[cur];
                }
            }
        }
        System.out.print(sb);
    }
}`,
        python3: `from collections import deque
import sys

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    n, m = int(next(it)), int(next(it))
    adj = [[] for _ in range(n + 1)]
    for _ in range(m):
        adj[int(next(it))].append(int(next(it)))

    INF = 10**9
    pair_l = [0] * (n + 1)
    pair_r = [0] * (n + 1)
    dist = [INF] * (n + 1)

    def bfs() -> bool:
        q = deque()
        for u in range(1, n + 1):
            if pair_l[u] == 0:
                dist[u] = 0
                q.append(u)
            else:
                dist[u] = INF
        dist[0] = INF
        while q:
            u = q.popleft()
            if dist[u] < dist[0]:
                du = dist[u] + 1
                for v in adj[u]:
                    nxt = pair_r[v]
                    if dist[nxt] == INF:
                        dist[nxt] = du
                        q.append(nxt)
        return dist[0] != INF

    def dfs(u: int) -> bool:
        if u == 0:
            return True
        du = dist[u] + 1
        for v in adj[u]:
            nxt = pair_r[v]
            if dist[nxt] == du and dfs(nxt):
                pair_r[v] = u
                pair_l[u] = v
                return True
        dist[u] = INF
        return False

    matching = 0
    while bfs():
        for u in range(1, n + 1):
            if pair_l[u] == 0 and dfs(u):
                matching += 1

    out = [str(n - matching)]
    for v in range(1, n + 1):
        if pair_r[v] == 0:
            path = []
            cur = v
            while cur:
                path.append(str(cur))
                cur = pair_l[cur]
            out.append(" ".join(path))
    sys.stdout.write("\\n".join(out) + "\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
idx = 0
n = tokens[idx].to_i
m = tokens[idx + 1].to_i
idx += 2

adj = Array.new(n + 1) { [] }
m.times do
  adj[tokens[idx].to_i] << tokens[idx + 1].to_i
  idx += 2
end

inf = 1_000_000_000
pair_l = Array.new(n + 1, 0)
pair_r = Array.new(n + 1, 0)
dist = Array.new(n + 1, inf)

bfs = lambda do
  q = []
  (1..n).each do |u|
    if pair_l[u] == 0
      dist[u] = 0
      q << u
    else
      dist[u] = inf
    end
  end
  dist[0] = inf
  head = 0
  while head < q.length
    u = q[head]
    head += 1
    if dist[u] < dist[0]
      adj[u].each do |v|
        nxt = pair_r[v]
        if dist[nxt] == inf
          dist[nxt] = dist[u] + 1
          q << nxt
        end
      end
    end
  end
  dist[0] != inf
end

dfs = nil
dfs = lambda do |u|
  return true if u == 0
  adj[u].each do |v|
    nxt = pair_r[v]
    if dist[nxt] == dist[u] + 1 && dfs.call(nxt)
      pair_r[v] = u
      pair_l[u] = v
      return true
    end
  end
  dist[u] = inf
  false
end

matching = 0
while bfs.call
  (1..n).each { |u| matching += 1 if pair_l[u] == 0 && dfs.call(u) }
end

out = [(n - matching).to_s]
(1..n).each do |v|
  next unless pair_r[v] == 0
  path = []
  cur = v
  while cur != 0
    path << cur
    cur = pair_l[cur]
  end
  out << path.join(" ")
end
puts out.join("\\n")`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'CSES',
      title: 'School Dance',
      difficulty: 'Medium / Flow & Matching',
      url: 'https://cses.fi/problemset/task/1696',
      patternNote: 'Direct Hopcroft-Karp maximum bipartite matching with explicit matched pair output.',
    },
    {
      platform: 'AtCoder',
      title: 'ALPC / ABC274 G - Security Camera 3',
      difficulty: '1800–2100',
      url: 'https://atcoder.jp/contests/abc274/tasks/abc274_g',
      patternNote: 'Break grid rows/columns into maximal contiguous open segments and solve Konig Minimum Vertex Cover.',
    },
    {
      platform: 'Codeforces',
      title: 'Easter Eggs / Rook Covering (CF 1404E / 628F)',
      difficulty: '2000–2400',
      url: 'https://codeforces.com/problemset/problem/1404/E',
      patternNote: 'Reduce 2D tile merging conflicts into Konig Maximum Independent Set via Hopcroft-Karp.',
    },
    {
      platform: 'CodeChef',
      title: 'DAG Path Cover & Bipartite Matching',
      difficulty: 'Hard',
      url: 'https://www.codechef.com/problems/CHEFMATCH',
      patternNote: 'Convert minimum disjoint path cover into `N - MaxMatching` over split DAG vertices.',
    },
    {
      platform: 'HackerRank',
      title: 'Real Estate Broker / Matching Problems',
      difficulty: 'Medium–Hard',
      url: 'https://www.hackerrank.com/challenges/real-estate-broker/problem',
      patternNote: 'Model client-house eligibility constraints as bipartite edges and maximize assignments.',
    },
    {
      platform: 'NeetCode 150',
      title: 'Maximum Compatibility Score Sum / Bipartite Assignment',
      difficulty: 'Medium–Hard (LeetCode 1947 / 1820)',
      url: 'https://leetcode.com/problems/maximum-accepted-invitations/',
      patternNote: 'Direct LeetCode unweighted bipartite matching solved cleanly with Hopcroft-Karp.',
    },
  ],
  interviewNotes: [
    'Know how to spot hidden bipartite graphs: 2D chessboard parity `(r + c) % 2`, row-vs-column grid constraints, and split DAG `out -> in` graphs.',
    'Explain **Konig’s Theorem** clearly (`|Max Matching| == |Min Vertex Cover|` holds ONLY for bipartite graphs, NOT general graphs where MVC is NP-hard).',
    'Hopcroft-Karp improves Kuhn’s `O(VE)` to `O(E sqrt(V))` by discovering ALL shortest augmenting paths per BFS phase rather than one DFS at a time.',
  ],
  projectBlueprint: {
    title: 'Ride-Sharing Driver-to-Passenger Dispatch Matcher',
    tagline: 'Maximize real-time driver-passenger pairings within pickup ETA windows using Hopcroft-Karp and Konig bottleneck diagnostics.',
    stackSummary: 'C++20 Hopcroft-Karp Dispatch Engine, Geo-Radius Bipartite Builder, Bottleneck Cover Auditor',
    asciiDiagram: `
+-------------------------+      +------------------------------------+
| Eligible Driver-Rider   | ---> | Multi-Source BFS Layering O(E)     |
| Pairs Within ETA Radius |      | Finds Shortest Augmenting Horizons |
+-------------------------+      +------------------------------------+
                                                   |
          +----------------------------------------+
          v
+-----------------------------------+     +----------------------------+
| Vertex-Disjoint DFS Augmentation  | --> | Optimal Dispatch Batch     |
| -> O(E sqrt(V)) Maximum Pairs     |     | + Konig Bottleneck Report  |
+-----------------------------------+     +----------------------------+`,
    milestones: [
      {
        id: 'm1',
        title: '1. Spatial Eligibility Graph Constructor',
        detail: 'Filter driver-passenger edges meeting Manhattan/Haversine ETA thresholds into compact adjacency lists.',
      },
      {
        id: 'm2',
        title: '2. O(E sqrt(V)) Hopcroft-Karp Batch Pairing Solver',
        detail: 'Run multi-source BFS layering + disjoint DFS sweeps to assign maximum concurrent trips under 5ms.',
      },
      {
        id: 'm3',
        title: '3. Konig Minimum Vertex Cover Surge Bottleneck Detector',
        detail: 'Identify the minimal bottleneck subset of zones/drivers saturating all unmet trip requests.',
      },
    ],
    starterCode: `// Ride-Sharing Driver-to-Passenger Dispatch Matcher (Runnable C++20 Prototype)
#include <bits/stdc++.h>
using namespace std;

int main() {
    int drivers = 4, riders = 4;
    vector<vector<int>> adj(drivers + 1);
    adj[1] = {1, 2};
    adj[2] = {1};
    adj[3] = {2, 3};
    adj[4] = {3, 4};

    const int INF = 1e9;
    vector<int> pairL(drivers + 1, 0), pairR(riders + 1, 0), dist(drivers + 1, INF);

    auto bfs = [&]() {
        queue<int> q;
        for (int u = 1; u <= drivers; u++) {
            if (!pairL[u]) { dist[u] = 0; q.push(u); }
            else dist[u] = INF;
        }
        dist[0] = INF;
        while (!q.empty()) {
            int u = q.front(); q.pop();
            if (dist[u] < dist[0]) {
                for (int v : adj[u]) if (dist[pairR[v]] == INF) {
                    dist[pairR[v]] = dist[u] + 1;
                    q.push(pairR[v]);
                }
            }
        }
        return dist[0] != INF;
    };

    auto dfs = [&](auto& self, int u) -> bool {
        if (!u) return true;
        for (int v : adj[u]) {
            if (dist[pairR[v]] == dist[u] + 1 && self(self, pairR[v])) {
                pairR[v] = u; pairL[u] = v; return true;
            }
        }
        dist[u] = INF;
        return false;
    };

    int matched = 0;
    while (bfs()) for (int u = 1; u <= drivers; u++) if (!pairL[u] && dfs(dfs, u)) matched++;
    cout << "Dispatched Trips: " << matched << "\\n";
    for (int d = 1; d <= drivers; d++) {
        if (pairL[d]) cout << "Driver " << d << " -> Rider " << pairL[d] << "\\n";
    }
    return 0;
}`,
  },
};
