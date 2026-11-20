import type { TheoryChapter } from '../../types/vault';

export const CH80_MATROID_INTERSECTION: TheoryChapter = {
  slug: 'matroid-intersection',
  topicId: 'th-76',
  title: 'Matroid Intersection & Partitioning',
  domain: 'Theoretical & Randomized',
  ratingTier: '2600–3300+',
  usacoDivision: 'Advanced',
  subtitle: 'Edmonds’ matroid intersection theorem, bipartite exchange-graph BFS/SPFA shortest augmenting paths, rainbow spanning forests, and linear + graphic matroid oracles',
  analogyTitle: 'Trading Elements Across Two Independence referees Without Breaking Either Rule',
  analogyBody:
    'A single matroid M = (E, I) lets greedy algorithms find a maximum-weight independent set because the exchange property holds globally. When a subset of ground elements I subset E must be simultaneously independent in TWO matroids M_1 = (E, I_1) and M_2 = (E, I_2)—such as picking edges that form an acyclic forest (Graphic Matroid M_1) while using at most one edge of each color (Partition Matroid M_2), or being linearly independent over GF(2) (Linear Matroid M_2)—simple greedy fails.\n\nEdmonds’ Matroid Intersection Algorithm augments I one element at a time using a directed bipartite Exchange Graph D(I) between current elements y in I and outside elements x in E \\ I:\n- Source set X_1 = {x in E \\ I : I + {x} in I_1}, Sink set X_2 = {x in E \\ I : I + {x} in I_2}.\n- Directed edge y -> x (y in I, x in E \\ I) whenever (I - {y}) + {x} in I_1 (y lies on the fundamental M_1-circuit of x).\n- Directed edge x -> y (x in E \\ I, y in I) whenever (I - {y}) + {x} in I_2 (y lies on the fundamental M_2-circuit of x).\n\nCrucially, by the Strong Circuit Elimination Axiom, only a SHORTEST (chordless) path P from X_1 to X_2 in D(I) is guaranteed to keep the symmetric difference I\' = I Delta V(P) independent in BOTH matroids! Finding shortest paths by BFS solves unweighted intersection in O(R^2 |E|) oracle calls, while Bellman-Ford / SPFA using vertex weights (-w(y) for y in I, +w(x) for x in E \\ I) with tie-breaking by fewest edges solves Weighted Matroid Intersection.',
  prerequisites: [
    { slug: 'exchange-arguments-greedy', title: 'Greedy Exchange Arguments, Matroids & Activity Scheduling' },
    { slug: 'max-flow-dinic-min-cut', title: "Max Flow, Min Cut & Project Selection Modeling (Dinic's Algorithm)" },
  ],
  traceTitle: 'Matroid Intersection Exchange-Graph Augmentation for Rainbow Forest',
  traceSubtitle: 'Building X_1, X_2, fundamental circuit edges y -> x (Graphic M_1) and x -> y (Color M_2), and flipping I Delta P',
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Step 1: Greedy Seed & Identify Source Set X_1 / Sink Set X_2',
      explanation: 'Suppose E has 4 edges: e0=(1-2, col 1), e1=(2-3, col 1), e2=(2-3, col 2), e3=(3-4, col 2). After adding e0 and e2, I = {e0, e2}. Outside edges are e1 (col 1) and e3 (col 2). Adding e3 creates no cycle in M_1 (so e3 in X_1), and adding e1 uses color 1 (occupied by e0) while forming cycle {e0, e1, e2} with e2? Wait: e1=(2-3, col 1) is parallel to e2=(2-3, col 2), so e1 + I forms a cycle with e2 in M_1 and conflicts with e0 in M_2.',
      mode: 'graph',
      graph: {
        nodes: [
          { id: 'e3', label: 'e3 (X1, out)', x: 80, y: 120, state: 'active' },
          { id: 'e2', label: 'e2 (in I)', x: 240, y: 120, state: 'matched' },
          { id: 'e1', label: 'e1 (X2?, out)', x: 400, y: 120, state: 'even' },
        ],
        edges: [
          { id: 'x12', from: 'e3', to: 'e2', state: 'augmenting' },
          { id: 'y21', from: 'e2', to: 'e1', state: 'augmenting' },
        ],
        calloutMetric: '|I| = 2 | X1 = {e3}',
      },
      variables: { currentI: '{e0, e2}', X1_graphic: '{e3}', exchangeRule: 'y->x in M1, x->y in M2' },
    },
    {
      stepNumber: 2,
      title: 'Step 2: Build Exchange Graph D(I) & Run Shortest-Path BFS',
      explanation: 'In M_2 (color partition), e3 (col 2) can replace e2 (col 2), giving directed edge e3 -> e2. In M_1 (graphic), e2 (on 2-3) can be replaced by e1 (on 2-3, col 3 if free in M_2), giving e2 -> e1 in X_2. BFS discovers shortest chordless path P = [e3 -> e2 -> e1].',
      mode: 'array',
      arrays: [
        {
          name: 'BFS Shortest Augmenting Path P from X_1 to X_2',
          cells: [
            { index: 0, value: 'e3 (out, X1)', label: 'add', highlight: 'active' },
            { index: 1, value: 'e2 (in I)', label: 'remove', highlight: 'updated' },
            { index: 2, value: 'e1 (out, X2)', label: 'add', highlight: 'active' },
          ],
        },
      ],
      variables: { pathLength: 3, chordlessInvariant: 'BFS shortest hops', deltaSize: '+1' },
    },
    {
      stepNumber: 3,
      title: 'Step 3: Symmetric Difference I <- I Delta V(P)',
      explanation: 'Flip membership along P: remove e2 from I and insert e3 and e1, growing |I| from 2 to 3 while preserving both acyclicity (M_1) and distinct colors (M_2).',
      mode: 'array',
      arrays: [
        {
          name: 'Updated Common Independent Set I (Size 3)',
          cells: [
            { index: 0, value: 'e0 (1-2, c1)', label: 'kept', highlight: 'neutral' },
            { index: 1, value: 'e1 (2-3, c3)', label: 'added', highlight: 'updated' },
            { index: 2, value: 'e3 (3-4, c2)', label: 'added', highlight: 'updated' },
          ],
        },
      ],
      variables: { newSize: 3, M1_valid: 'Forest (3 edges)', M2_valid: 'Colors {1, 2, 3}' },
    },
  ],
  reductionClues: [
    {
      clue: 'Find a spanning tree (or maximum forest) using at most B[c] edges of each color c (Rainbow Spanning Tree)',
      translation: 'Intersect Graphic Matroid M_1 (forests via DSU) with Partition Matroid M_2 (color capacities) in O(R^2 M).',
    },
    {
      clue: 'Find the minimum-cost or maximum-weight Rainbow Spanning Tree',
      translation: 'Weighted Matroid Intersection: run SPFA / Bellman-Ford on D(I) minimizing path weight with secondary tie-breaker on fewest hops.',
    },
    {
      clue: 'Find the largest spanning forest whose edge 64-bit XOR labels are linearly independent over GF(2)',
      translation: 'Intersect Graphic Matroid M_1 with Linear XOR-Basis Matroid M_2 (60-bit Gaussian elimination oracle).',
    },
    {
      clue: 'Partition edges into K edge-disjoint spanning trees or check if G contains K disjoint forests',
      translation: 'Matroid Partitioning / Union of K Graphic Matroids via single-element exchange BFS.',
    },
  ],
  timeComplexity: 'O(R^2 * |E| * (T_oracle1 + T_oracle2)) for unweighted; O(R^3 * |E|) for weighted SPFA augmentation',
  spaceComplexity: 'O(|E| + |V|)',
  pitfalls: [
    {
      type: 'WA',
      title: 'Using DFS Instead of Shortest-Path BFS on the Exchange Graph',
      detail: 'If an augmenting path P in D(I) has a shortcut chord, flipping I Delta V(P) can create cycles or color violations! You MUST use BFS (unweighted) or lexicographical shortest-weight-then-fewest-edges SPFA (weighted) so P is chordless.',
    },
    {
      type: 'WA',
      title: 'Swapping Edge Directions Between M_1 (y -> x) and M_2 (x -> y)',
      detail: 'From source X_1 (valid in M_1), the first step must go to some y in I via M_2 (so x -> y means I - y + x in I_2), and from y in I to x\' via M_1 (y -> x\' means I - y + x\' in I_1). Reversing either direction breaks the alternating invariant.',
    },
    {
      type: 'WA',
      title: 'Omitting Secondary Hop-Count Tie-Breaker in Weighted Matroid Intersection',
      detail: 'When zero-weight cycles or equal-weight shortcuts exist in D(I), picking a longer path with the same total weight introduces chords and violates independence. Always compare pair (dist, hops).',
    },
    {
      type: 'TLE',
      title: 'Rebuilding the Whole DSU or XOR Basis From Scratch for Every Pair (y, x)',
      detail: 'For each y in I, prebuild the DSU or XOR basis of I \\ {y} once in O(R), then test all outside x in E \\ I against that prebuilt oracle in O(1) or O(alpha(N)) each.',
    },
  ],
  implementations: {
    cpp20: `#include <algorithm>
#include <iostream>
#include <numeric>
#include <queue>
#include <vector>

using namespace std;

struct Edge {
    int u, v, col;
};

struct DSU {
    vector<int> p;
    explicit DSU(int n) : p(n) { iota(p.begin(), p.end(), 0); }
    int find(int x) { return p[x] == x ? x : p[x] = find(p[x]); }
    bool unite(int a, int b) {
        a = find(a);
        b = find(b);
        if (a == b) return false;
        p[b] = a;
        return true;
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    if (!(cin >> n >> m)) return 0;
    vector<Edge> edges(m);
    int max_c = 0;
    for (int i = 0; i < m; ++i) {
        cin >> edges[i].u >> edges[i].v >> edges[i].col;
        --edges[i].u;
        --edges[i].v;
        max_c = max(max_c, edges[i].col);
    }

    vector<bool> in_set(m, false);
    while (true) {
        vector<int> in_idx, out_idx;
        vector<int> col_owner(max_c + 1, -1);
        DSU full_dsu(n);
        for (int i = 0; i < m; ++i) {
            if (in_set[i]) {
                in_idx.push_back(i);
                col_owner[edges[i].col] = i;
                full_dsu.unite(edges[i].u, edges[i].v);
            } else {
                out_idx.push_back(i);
            }
        }

        vector<bool> x1(m, false), x2(m, false);
        for (int x : out_idx) {
            if (full_dsu.find(edges[x].u) != full_dsu.find(edges[x].v)) x1[x] = true;
            if (col_owner[edges[x].col] == -1) x2[x] = true;
        }

        int target = -1;
        for (int x : out_idx) {
            if (x1[x] && x2[x]) {
                target = x;
                break;
            }
        }
        if (target != -1) {
            in_set[target] = true;
            continue;
        }

        // Build adjacency of exchange graph D(I)
        vector<vector<int>> adj(m);
        for (int y : in_idx) {
            DSU dsu_without_y(n);
            for (int z : in_idx) {
                if (z != y) dsu_without_y.unite(edges[z].u, edges[z].v);
            }
            for (int x : out_idx) {
                // y -> x if I - y + x is a forest (M1)
                if (dsu_without_y.find(edges[x].u) != dsu_without_y.find(edges[x].v)) {
                    adj[y].push_back(x);
                }
            }
        }
        for (int x : out_idx) {
            // x -> y if I - y + x has distinct colors (M2)
            int owner = col_owner[edges[x].col];
            if (owner == -1) {
                for (int y : in_idx) adj[x].push_back(y);
            } else {
                adj[x].push_back(owner);
            }
        }

        vector<int> dist(m, -1), par(m, -1);
        queue<int> q;
        for (int x : out_idx) {
            if (x1[x]) {
                dist[x] = 0;
                q.push(x);
            }
        }
        int end_node = -1;
        while (!q.empty()) {
            int u = q.front();
            q.pop();
            if (x2[u]) {
                end_node = u;
                break;
            }
            for (int v : adj[u]) {
                if (dist[v] == -1) {
                    dist[v] = dist[u] + 1;
                    par[v] = u;
                    q.push(v);
                }
            }
        }
        if (end_node == -1) break;
        for (int cur = end_node; cur != -1; cur = par[cur]) {
            in_set[cur] = !in_set[cur];
        }
    }

    int ans = 0;
    for (int i = 0; i < m; ++i) if (in_set[i]) ++ans;
    cout << ans << '\\n';
    return 0;
}`,
    rust: `use std::collections::VecDeque;
use std::io::{self, Read};

#[derive(Clone, Copy)]
struct Edge {
    u: usize,
    v: usize,
    col: usize,
}

struct Dsu {
    p: Vec<usize>,
}

impl Dsu {
    fn new(n: usize) -> Self {
        Self { p: (0..n).collect() }
    }
    fn find(&mut self, x: usize) -> usize {
        if self.p[x] == x { x } else {
            let r = self.find(self.p[x]);
            self.p[x] = r;
            r
        }
    }
    fn unite(&mut self, a: usize, b: usize) -> bool {
        let ra = self.find(a);
        let rb = self.find(b);
        if ra == rb { false } else { self.p[rb] = ra; true }
    }
}

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let n: usize = match it.next() { Some(v) => v.parse().unwrap(), None => return };
    let m: usize = it.next().unwrap().parse().unwrap();
    let mut edges = Vec::with_capacity(m);
    let mut max_c = 0usize;
    for _ in 0..m {
        let u: usize = it.next().unwrap().parse::<usize>().unwrap() - 1;
        let v: usize = it.next().unwrap().parse::<usize>().unwrap() - 1;
        let col: usize = it.next().unwrap().parse().unwrap();
        max_c = max_c.max(col);
        edges.push(Edge { u, v, col });
    }

    let mut in_set = vec![false; m];
    loop {
        let mut in_idx = Vec::new();
        let mut out_idx = Vec::new();
        let mut col_owner = vec![None; max_c + 1];
        let mut full_dsu = Dsu::new(n);
        for i in 0..m {
            if in_set[i] {
                in_idx.push(i);
                col_owner[edges[i].col] = Some(i);
                full_dsu.unite(edges[i].u, edges[i].v);
            } else {
                out_idx.push(i);
            }
        }

        let mut x1 = vec![false; m];
        let mut x2 = vec![false; m];
        for &x in &out_idx {
            if full_dsu.find(edges[x].u) != full_dsu.find(edges[x].v) { x1[x] = true; }
            if col_owner[edges[x].col].is_none() { x2[x] = true; }
        }

        if let Some(&t) = out_idx.iter().find(|&&x| x1[x] && x2[x]) {
            in_set[t] = true;
            continue;
        }

        let mut adj = vec![Vec::<usize>::new(); m];
        for &y in &in_idx {
            let mut dsu_y = Dsu::new(n);
            for &z in &in_idx {
                if z != y { dsu_y.unite(edges[z].u, edges[z].v); }
            }
            for &x in &out_idx {
                if dsu_y.find(edges[x].u) != dsu_y.find(edges[x].v) {
                    adj[y].push(x);
                }
            }
        }
        for &x in &out_idx {
            if let Some(owner) = col_owner[edges[x].col] {
                adj[x].push(owner);
            } else {
                for &y in &in_idx { adj[x].push(y); }
            }
        }

        let mut dist = vec![-1i32; m];
        let mut par = vec![None; m];
        let mut q = VecDeque::new();
        for &x in &out_idx {
            if x1[x] {
                dist[x] = 0;
                q.push_back(x);
            }
        }
        let mut end_node = None;
        while let Some(u) = q.pop_front() {
            if x2[u] {
                end_node = Some(u);
                break;
            }
            for &v in &adj[u] {
                if dist[v] == -1 {
                    dist[v] = dist[u] + 1;
                    par[v] = Some(u);
                    q.push_back(v);
                }
            }
        }
        let mut cur = match end_node { Some(v) => v, None => break };
        loop {
            in_set[cur] = !in_set[cur];
            match par[cur] {
                Some(p) => cur = p,
                None => break,
            }
        }
    }

    println!("{}", in_set.iter().filter(|&&b| b).count());
}`,
    java21: `import java.io.BufferedInputStream;
import java.io.IOException;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Arrays;

public class Main {
    static class FastScanner {
        private final BufferedInputStream in = new BufferedInputStream(System.in);
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;

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
            while (c >= 0 && c <= 32) c = readByte();
            if (c < 0) return 0;
            int res = 0;
            while (c > 32) { res = res * 10 + (c - '0'); c = readByte(); }
            return res;
        }
    }

    static class DSU {
        int[] p;
        DSU(int n) {
            p = new int[n];
            for (int i = 0; i < n; i++) p[i] = i;
        }
        int find(int x) { return p[x] == x ? x : (p[x] = find(p[x])); }
        void unite(int a, int b) {
            a = find(a); b = find(b);
            if (a != b) p[b] = a;
        }
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        int n = fs.nextInt();
        if (n == 0) return;
        int m = fs.nextInt();
        int[] eu = new int[m], ev = new int[m], ec = new int[m];
        int maxC = 0;
        for (int i = 0; i < m; i++) {
            eu[i] = fs.nextInt() - 1;
            ev[i] = fs.nextInt() - 1;
            ec[i] = fs.nextInt();
            if (ec[i] > maxC) maxC = ec[i];
        }

        boolean[] inSet = new boolean[m];
        while (true) {
            ArrayList<Integer> inIdx = new ArrayList<>(), outIdx = new ArrayList<>();
            int[] colOwner = new int[maxC + 1];
            Arrays.fill(colOwner, -1);
            DSU fullDsu = new DSU(n);
            for (int i = 0; i < m; i++) {
                if (inSet[i]) {
                    inIdx.add(i);
                    colOwner[ec[i]] = i;
                    fullDsu.unite(eu[i], ev[i]);
                } else {
                    outIdx.add(i);
                }
            }

            boolean[] x1 = new boolean[m], x2 = new boolean[m];
            int target = -1;
            for (int x : outIdx) {
                if (fullDsu.find(eu[x]) != fullDsu.find(ev[x])) x1[x] = true;
                if (colOwner[ec[x]] == -1) x2[x] = true;
                if (x1[x] && x2[x] && target == -1) target = x;
            }
            if (target != -1) {
                inSet[target] = true;
                continue;
            }

            @SuppressWarnings("unchecked")
            ArrayList<Integer>[] adj = new ArrayList[m];
            for (int i = 0; i < m; i++) adj[i] = new ArrayList<>();

            for (int y : inIdx) {
                DSU dsuY = new DSU(n);
                for (int z : inIdx) if (z != y) dsuY.unite(eu[z], ev[z]);
                for (int x : outIdx) {
                    if (dsuY.find(eu[x]) != dsuY.find(ev[x])) adj[y].add(x);
                }
            }
            for (int x : outIdx) {
                int owner = colOwner[ec[x]];
                if (owner == -1) {
                    for (int y : inIdx) adj[x].add(y);
                } else {
                    adj[x].add(owner);
                }
            }

            int[] dist = new int[m], par = new int[m];
            Arrays.fill(dist, -1);
            Arrays.fill(par, -1);
            ArrayDeque<Integer> q = new ArrayDeque<>();
            for (int x : outIdx) {
                if (x1[x]) { dist[x] = 0; q.add(x); }
            }
            int endNode = -1;
            while (!q.isEmpty()) {
                int u = q.poll();
                if (x2[u]) { endNode = u; break; }
                for (int v : adj[u]) {
                    if (dist[v] == -1) {
                        dist[v] = dist[u] + 1;
                        par[v] = u;
                        q.add(v);
                    }
                }
            }
            if (endNode == -1) break;
            for (int cur = endNode; cur != -1; cur = par[cur]) inSet[cur] = !inSet[cur];
        }
        int ans = 0;
        for (boolean b : inSet) if (b) ans++;
        System.out.println(ans);
    }
}`,
    python3: `from collections import deque
import sys

sys.setrecursionlimit(200000)


class DSU:
    def __init__(self, n: int) -> None:
        self.p = list(range(n))

    def find(self, x: int) -> int:
        while self.p[x] != x:
            self.p[x] = self.p[self.p[x]]
            x = self.p[x]
        return x

    def unite(self, a: int, b: int) -> None:
        ra, rb = self.find(a), self.find(b)
        if ra != rb:
            self.p[rb] = ra


def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n, m = int(data[0]), int(data[1])
    edges = []
    max_c = 0
    idx = 2
    for _ in range(m):
        u, v, c = int(data[idx]) - 1, int(data[idx + 1]) - 1, int(data[idx + 2])
        idx += 3
        if c > max_c:
            max_c = c
        edges.append((u, v, c))

    in_set = [False] * m
    while True:
        in_idx = []
        out_idx = []
        col_owner = [-1] * (max_c + 1)
        full_dsu = DSU(n)
        for i, (u, v, c) in enumerate(edges):
            if in_set[i]:
                in_idx.append(i)
                col_owner[c] = i
                full_dsu.unite(u, v)
            else:
                out_idx.append(i)

        x1 = [False] * m
        x2 = [False] * m
        target = -1
        for x in out_idx:
            u, v, c = edges[x]
            if full_dsu.find(u) != full_dsu.find(v):
                x1[x] = True
            if col_owner[c] == -1:
                x2[x] = True
            if x1[x] and x2[x] and target == -1:
                target = x
        if target != -1:
            in_set[target] = True
            continue

        adj = [[] for _ in range(m)]
        for y in in_idx:
            dsu_y = DSU(n)
            for z in in_idx:
                if z != y:
                    dsu_y.unite(edges[z][0], edges[z][1])
            for x in out_idx:
                if dsu_y.find(edges[x][0]) != dsu_y.find(edges[x][1]):
                    adj[y].append(x)

        for x in out_idx:
            owner = col_owner[edges[x][2]]
            if owner == -1:
                adj[x].extend(in_idx)
            else:
                adj[x].append(owner)

        dist = [-1] * m
        par = [-1] * m
        q = deque()
        for x in out_idx:
            if x1[x]:
                dist[x] = 0
                q.append(x)
        end_node = -1
        while q:
            u = q.popleft()
            if x2[u]:
                end_node = u
                break
            for v in adj[u]:
                if dist[v] == -1:
                    dist[v] = dist[u] + 1
                    par[v] = u
                    q.append(v)
        if end_node == -1:
            break
        cur = end_node
        while cur != -1:
            in_set[cur] = not in_set[cur]
            cur = par[cur]

    sys.stdout.write(f"{sum(in_set)}\\n")


if __name__ == "__main__":
    solve()`,
    ruby: `class DSU
  def initialize(n)
    @p = (0...n).to_a
  end

  def find(x)
    while @p[x] != x
      @p[x] = @p[@p[x]]
      x = @p[x]
    end
    x
  end

  def unite(a, b)
    ra = find(a)
    rb = find(b)
    @p[rb] = ra if ra != rb
  end
end

data = STDIN.read.split
exit if data.empty?
n = data[0].to_i
m = data[1].to_i
edges = []
max_c = 0
idx = 2
m.times do
  u = data[idx].to_i - 1
  v = data[idx + 1].to_i - 1
  c = data[idx + 2].to_i
  idx += 3
  max_c = c if c > max_c
  edges << [u, v, c]
end

in_set = Array.new(m, false)
loop do
  in_idx = []
  out_idx = []
  col_owner = Array.new(max_c + 1, -1)
  full_dsu = DSU.new(n)
  edges.each_with_index do |(u, v, c), i|
    if in_set[i]
      in_idx << i
      col_owner[c] = i
      full_dsu.unite(u, v)
    else
      out_idx << i
    end
  end

  x1 = Array.new(m, false)
  x2 = Array.new(m, false)
  target = -1
  out_idx.each do |x|
    u, v, c = edges[x]
    x1[x] = true if full_dsu.find(u) != full_dsu.find(v)
    x2[x] = true if col_owner[c] == -1
    target = x if x1[x] && x2[x] && target == -1
  end
  if target != -1
    in_set[target] = true
    next
  end

  adj = Array.new(m) { [] }
  in_idx.each do |y|
    dsu_y = DSU.new(n)
    in_idx.each { |z| dsu_y.unite(edges[z][0], edges[z][1]) if z != y }
    out_idx.each do |x|
      adj[y] << x if dsu_y.find(edges[x][0]) != dsu_y.find(edges[x][1])
    end
  end
  out_idx.each do |x|
    owner = col_owner[edges[x][2]]
    if owner == -1
      adj[x].concat(in_idx)
    else
      adj[x] << owner
    end
  end

  dist = Array.new(m, -1)
  par = Array.new(m, -1)
  q = []
  out_idx.each do |x|
    if x1[x]
      dist[x] = 0
      q << x
    end
  end
  head = 0
  end_node = -1
  while head < q.length
    u = q[head]
    head += 1
    if x2[u]
      end_node = u
      break
    end
    adj[u].each do |v|
      if dist[v] == -1
        dist[v] = dist[u] + 1
        par[v] = u
        q << v
      end
    end
  end
  break if end_node == -1

  cur = end_node
  while cur != -1
    in_set[cur] = !in_set[cur]
    cur = par[cur]
  end
end

puts in_set.count(true)`,
  },
  practiceProblems: [
    {
      id: 'ch80-p1',
      tier: 'Warmup',
      ratingRange: '2600–2800',
      title: 'Maximum Rainbow Forest (Graphic + Partition Matroid Intersection)',
      statement:
        'Given an undirected multigraph with N vertices (1 <= N <= 100) and M colored edges (1 <= M <= 300), where each edge i connects (u_i, v_i) and has color c_i (1 <= c_i <= M), find the maximum number of edges in a subset I that forms an acyclic forest and contains at most one edge of each color.',
      constraints: '1 <= N <= 100; 1 <= M <= 300; 1 <= c_i <= M; Time Limit: 1.5s',
      sampleInput: '4 4\n1 2 1\n2 3 1\n2 3 2\n3 4 2',
      sampleOutput: '2',
      hints: [
        'Define M_1 as the Graphic Matroid (forests) and M_2 as the Partition Matroid (at most one edge per color).',
        'In each augmentation round, build D(I) with y -> x if (I - {y}) + {x} is acyclic and x -> y if (I - {y}) + {x} has distinct colors, then run BFS from X_1 to X_2.',
      ],
      solutions: {
        cpp20: `#include <algorithm>
#include <iostream>
#include <numeric>
#include <queue>
#include <vector>

using namespace std;

struct Edge { int u, v, col; };

struct DSU {
    vector<int> p;
    explicit DSU(int n) : p(n) { iota(p.begin(), p.end(), 0); }
    int find(int x) { return p[x] == x ? x : p[x] = find(p[x]); }
    void unite(int a, int b) {
        a = find(a); b = find(b);
        if (a != b) p[b] = a;
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    if (!(cin >> n >> m)) return 0;
    vector<Edge> edges(m);
    int max_c = 0;
    for (int i = 0; i < m; ++i) {
        cin >> edges[i].u >> edges[i].v >> edges[i].col;
        --edges[i].u; --edges[i].v;
        max_c = max(max_c, edges[i].col);
    }
    vector<bool> in_set(m, false);
    while (true) {
        vector<int> in_idx, out_idx, col_owner(max_c + 1, -1);
        DSU full(n);
        for (int i = 0; i < m; ++i) {
            if (in_set[i]) {
                in_idx.push_back(i);
                col_owner[edges[i].col] = i;
                full.unite(edges[i].u, edges[i].v);
            } else {
                out_idx.push_back(i);
            }
        }
        vector<bool> x1(m, false), x2(m, false);
        int direct = -1;
        for (int x : out_idx) {
            if (full.find(edges[x].u) != full.find(edges[x].v)) x1[x] = true;
            if (col_owner[edges[x].col] == -1) x2[x] = true;
            if (x1[x] && x2[x] && direct == -1) direct = x;
        }
        if (direct != -1) { in_set[direct] = true; continue; }

        vector<vector<int>> adj(m);
        for (int y : in_idx) {
            DSU dsu_y(n);
            for (int z : in_idx) if (z != y) dsu_y.unite(edges[z].u, edges[z].v);
            for (int x : out_idx) {
                if (dsu_y.find(edges[x].u) != dsu_y.find(edges[x].v)) adj[y].push_back(x);
            }
        }
        for (int x : out_idx) {
            int ow = col_owner[edges[x].col];
            if (ow == -1) { for (int y : in_idx) adj[x].push_back(y); }
            else adj[x].push_back(ow);
        }
        vector<int> dist(m, -1), par(m, -1);
        queue<int> q;
        for (int x : out_idx) if (x1[x]) { dist[x] = 0; q.push(x); }
        int end_node = -1;
        while (!q.empty()) {
            int u = q.front(); q.pop();
            if (x2[u]) { end_node = u; break; }
            for (int v : adj[u]) {
                if (dist[v] == -1) { dist[v] = dist[u] + 1; par[v] = u; q.push(v); }
            }
        }
        if (end_node == -1) break;
        for (int cur = end_node; cur != -1; cur = par[cur]) in_set[cur] = !in_set[cur];
    }
    int ans = 0;
    for (bool b : in_set) if (b) ++ans;
    cout << ans << '\\n';
    return 0;
}`,
        rust: `use std::collections::VecDeque;
use std::io::{self, Read};

#[derive(Clone, Copy)]
struct Edge { u: usize, v: usize, col: usize }

struct Dsu { p: Vec<usize> }
impl Dsu {
    fn new(n: usize) -> Self { Self { p: (0..n).collect() } }
    fn find(&mut self, x: usize) -> usize {
        if self.p[x] == x { x } else { let r = self.find(self.p[x]); self.p[x] = r; r }
    }
    fn unite(&mut self, a: usize, b: usize) {
        let ra = self.find(a); let rb = self.find(b);
        if ra != rb { self.p[rb] = ra; }
    }
}

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let n: usize = match it.next() { Some(v) => v.parse().unwrap(), None => return };
    let m: usize = it.next().unwrap().parse().unwrap();
    let mut edges = Vec::with_capacity(m);
    let mut max_c = 0usize;
    for _ in 0..m {
        let u: usize = it.next().unwrap().parse::<usize>().unwrap() - 1;
        let v: usize = it.next().unwrap().parse::<usize>().unwrap() - 1;
        let col: usize = it.next().unwrap().parse().unwrap();
        max_c = max_c.max(col);
        edges.push(Edge { u, v, col });
    }
    let mut in_set = vec![false; m];
    loop {
        let mut in_idx = Vec::new();
        let mut out_idx = Vec::new();
        let mut col_owner = vec![None; max_c + 1];
        let mut full = Dsu::new(n);
        for i in 0..m {
            if in_set[i] {
                in_idx.push(i);
                col_owner[edges[i].col] = Some(i);
                full.unite(edges[i].u, edges[i].v);
            } else { out_idx.push(i); }
        }
        let mut x1 = vec![false; m];
        let mut x2 = vec![false; m];
        for &x in &out_idx {
            if full.find(edges[x].u) != full.find(edges[x].v) { x1[x] = true; }
            if col_owner[edges[x].col].is_none() { x2[x] = true; }
        }
        if let Some(&d) = out_idx.iter().find(|&&x| x1[x] && x2[x]) {
            in_set[d] = true;
            continue;
        }
        let mut adj = vec![Vec::<usize>::new(); m];
        for &y in &in_idx {
            let mut dy = Dsu::new(n);
            for &z in &in_idx { if z != y { dy.unite(edges[z].u, edges[z].v); } }
            for &x in &out_idx {
                if dy.find(edges[x].u) != dy.find(edges[x].v) { adj[y].push(x); }
            }
        }
        for &x in &out_idx {
            if let Some(ow) = col_owner[edges[x].col] { adj[x].push(ow); }
            else { for &y in &in_idx { adj[x].push(y); } }
        }
        let mut dist = vec![-1i32; m];
        let mut par = vec![None; m];
        let mut q = VecDeque::new();
        for &x in &out_idx { if x1[x] { dist[x] = 0; q.push_back(x); } }
        let mut end = None;
        while let Some(u) = q.pop_front() {
            if x2[u] { end = Some(u); break; }
            for &v in &adj[u] {
                if dist[v] == -1 { dist[v] = dist[u] + 1; par[v] = Some(u); q.push_back(v); }
            }
        }
        let mut cur = match end { Some(v) => v, None => break };
        loop {
            in_set[cur] = !in_set[cur];
            match par[cur] { Some(p) => cur = p, None => break }
        }
    }
    println!("{}", in_set.iter().filter(|&&b| b).count());
}`,
        java21: `import java.io.BufferedInputStream;
import java.io.IOException;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Arrays;

public class Main {
    static class FastScanner {
        private final BufferedInputStream in = new BufferedInputStream(System.in);
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;

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
            while (c >= 0 && c <= 32) c = readByte();
            if (c < 0) return 0;
            int res = 0;
            while (c > 32) { res = res * 10 + (c - '0'); c = readByte(); }
            return res;
        }
    }

    static class DSU {
        int[] p;
        DSU(int n) { p = new int[n]; for (int i = 0; i < n; i++) p[i] = i; }
        int find(int x) { return p[x] == x ? x : (p[x] = find(p[x])); }
        void unite(int a, int b) { a = find(a); b = find(b); if (a != b) p[b] = a; }
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        int n = fs.nextInt();
        if (n == 0) return;
        int m = fs.nextInt();
        int[] eu = new int[m], ev = new int[m], ec = new int[m];
        int maxC = 0;
        for (int i = 0; i < m; i++) {
            eu[i] = fs.nextInt() - 1; ev[i] = fs.nextInt() - 1; ec[i] = fs.nextInt();
            if (ec[i] > maxC) maxC = ec[i];
        }
        boolean[] inSet = new boolean[m];
        while (true) {
            ArrayList<Integer> inIdx = new ArrayList<>(), outIdx = new ArrayList<>();
            int[] colOwner = new int[maxC + 1]; Arrays.fill(colOwner, -1);
            DSU full = new DSU(n);
            for (int i = 0; i < m; i++) {
                if (inSet[i]) { inIdx.add(i); colOwner[ec[i]] = i; full.unite(eu[i], ev[i]); }
                else outIdx.add(i);
            }
            boolean[] x1 = new boolean[m], x2 = new boolean[m];
            int direct = -1;
            for (int x : outIdx) {
                if (full.find(eu[x]) != full.find(ev[x])) x1[x] = true;
                if (colOwner[ec[x]] == -1) x2[x] = true;
                if (x1[x] && x2[x] && direct == -1) direct = x;
            }
            if (direct != -1) { inSet[direct] = true; continue; }

            @SuppressWarnings("unchecked")
            ArrayList<Integer>[] adj = new ArrayList[m];
            for (int i = 0; i < m; i++) adj[i] = new ArrayList<>();
            for (int y : inIdx) {
                DSU dy = new DSU(n);
                for (int z : inIdx) if (z != y) dy.unite(eu[z], ev[z]);
                for (int x : outIdx) if (dy.find(eu[x]) != dy.find(ev[x])) adj[y].add(x);
            }
            for (int x : outIdx) {
                int ow = colOwner[ec[x]];
                if (ow == -1) { for (int y : inIdx) adj[x].add(y); }
                else adj[x].add(ow);
            }
            int[] dist = new int[m], par = new int[m];
            Arrays.fill(dist, -1); Arrays.fill(par, -1);
            ArrayDeque<Integer> q = new ArrayDeque<>();
            for (int x : outIdx) if (x1[x]) { dist[x] = 0; q.add(x); }
            int end = -1;
            while (!q.isEmpty()) {
                int u = q.poll();
                if (x2[u]) { end = u; break; }
                for (int v : adj[u]) {
                    if (dist[v] == -1) { dist[v] = dist[u] + 1; par[v] = u; q.add(v); }
                }
            }
            if (end == -1) break;
            for (int cur = end; cur != -1; cur = par[cur]) inSet[cur] = !inSet[cur];
        }
        int ans = 0;
        for (boolean b : inSet) if (b) ans++;
        System.out.println(ans);
    }
}`,
        python3: `from collections import deque
import sys

sys.setrecursionlimit(200000)


class DSU:
    def __init__(self, n: int) -> None:
        self.p = list(range(n))

    def find(self, x: int) -> int:
        while self.p[x] != x:
            self.p[x] = self.p[self.p[x]]
            x = self.p[x]
        return x

    def unite(self, a: int, b: int) -> None:
        ra, rb = self.find(a), self.find(b)
        if ra != rb:
            self.p[rb] = ra


def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n, m = int(data[0]), int(data[1])
    edges = []
    max_c = 0
    idx = 2
    for _ in range(m):
        u, v, c = int(data[idx]) - 1, int(data[idx + 1]) - 1, int(data[idx + 2])
        idx += 3
        max_c = max(max_c, c)
        edges.append((u, v, c))

    in_set = [False] * m
    while True:
        in_idx, out_idx = [], []
        col_owner = [-1] * (max_c + 1)
        full = DSU(n)
        for i, (u, v, c) in enumerate(edges):
            if in_set[i]:
                in_idx.append(i)
                col_owner[c] = i
                full.unite(u, v)
            else:
                out_idx.append(i)
        x1 = [False] * m
        x2 = [False] * m
        direct = -1
        for x in out_idx:
            u, v, c = edges[x]
            if full.find(u) != full.find(v):
                x1[x] = True
            if col_owner[c] == -1:
                x2[x] = True
            if x1[x] and x2[x] and direct == -1:
                direct = x
        if direct != -1:
            in_set[direct] = True
            continue
        adj = [[] for _ in range(m)]
        for y in in_idx:
            dy = DSU(n)
            for z in in_idx:
                if z != y:
                    dy.unite(edges[z][0], edges[z][1])
            for x in out_idx:
                if dy.find(edges[x][0]) != dy.find(edges[x][1]):
                    adj[y].append(x)
        for x in out_idx:
            ow = col_owner[edges[x][2]]
            if ow == -1:
                adj[x].extend(in_idx)
            else:
                adj[x].append(ow)
        dist = [-1] * m
        par = [-1] * m
        q = deque(x for x in out_idx if x1[x])
        for x in q:
            dist[x] = 0
        end = -1
        while q:
            u = q.popleft()
            if x2[u]:
                end = u
                break
            for v in adj[u]:
                if dist[v] == -1:
                    dist[v] = dist[u] + 1
                    par[v] = u
                    q.append(v)
        if end == -1:
            break
        cur = end
        while cur != -1:
            in_set[cur] = not in_set[cur]
            cur = par[cur]
    sys.stdout.write(f"{sum(in_set)}\\n")


if __name__ == "__main__":
    solve()`,
        ruby: `class DSU
  def initialize(n); @p = (0...n).to_a; end
  def find(x); while @p[x] != x; @p[x] = @p[@p[x]]; x = @p[x]; end; x; end
  def unite(a, b); ra = find(a); rb = find(b); @p[rb] = ra if ra != rb; end
end

data = STDIN.read.split
exit if data.empty?
n = data[0].to_i; m = data[1].to_i
edges = []; max_c = 0; idx = 2
m.times do
  u = data[idx].to_i - 1; v = data[idx + 1].to_i - 1; c = data[idx + 2].to_i
  idx += 3; max_c = c if c > max_c
  edges << [u, v, c]
end

in_set = Array.new(m, false)
loop do
  in_idx = []; out_idx = []; col_owner = Array.new(max_c + 1, -1)
  full = DSU.new(n)
  edges.each_with_index do |(u, v, c), i|
    if in_set[i]
      in_idx << i; col_owner[c] = i; full.unite(u, v)
    else
      out_idx << i
    end
  end
  x1 = Array.new(m, false); x2 = Array.new(m, false); direct = -1
  out_idx.each do |x|
    u, v, c = edges[x]
    x1[x] = true if full.find(u) != full.find(v)
    x2[x] = true if col_owner[c] == -1
    direct = x if x1[x] && x2[x] && direct == -1
  end
  if direct != -1
    in_set[direct] = true
    next
  end
  adj = Array.new(m) { [] }
  in_idx.each do |y|
    dy = DSU.new(n)
    in_idx.each { |z| dy.unite(edges[z][0], edges[z][1]) if z != y }
    out_idx.each { |x| adj[y] << x if dy.find(edges[x][0]) != dy.find(edges[x][1]) }
  end
  out_idx.each do |x|
    ow = col_owner[edges[x][2]]
    ow == -1 ? adj[x].concat(in_idx) : adj[x] << ow
  end
  dist = Array.new(m, -1); par = Array.new(m, -1); q = []
  out_idx.each { |x| if x1[x]; dist[x] = 0; q << x; end }
  head = 0; end_node = -1
  while head < q.length
    u = q[head]; head += 1
    if x2[u]; end_node = u; break; end
    adj[u].each do |v|
      if dist[v] == -1; dist[v] = dist[u] + 1; par[v] = u; q << v; end
    end
  end
  break if end_node == -1
  cur = end_node
  while cur != -1; in_set[cur] = !in_set[cur]; cur = par[cur]; end
end
puts in_set.count(true)`,
      },
    },
    {
      id: 'ch80-p2',
      tier: 'Standard',
      ratingRange: '2800–3100',
      title: 'Minimum-Weight Rainbow Spanning Tree via Weighted Matroid Intersection',
      statement:
        'Given an undirected graph with N vertices (1 <= N <= 60) and M weighted, colored edges (1 <= M <= 200), where edge i has endpoints (u_i, v_i), weight w_i, and color c_i, find the minimum total weight of a spanning tree of N - 1 edges in which all N - 1 edges have pairwise distinct colors, or output -1 if no rainbow spanning tree exists.',
      constraints: '1 <= N <= 60; 1 <= M <= 200; 1 <= w_i <= 10^6; 1 <= c_i <= M; Time Limit: 2.0s',
      sampleInput: '4 5\n1 2 10 1\n1 2 2 2\n2 3 3 2\n2 3 4 3\n3 4 5 1',
      sampleOutput: '11',
      hints: [
        'Assign each vertex in the exchange graph D(I) a node cost: cost(x) = +w_x for x in E \\ I and cost(y) = -w_y for y in I.',
        'In each augmentation step, run SPFA / Bellman-Ford from X_1 to X_2 minimizing (total_path_cost, hop_count) so ties always prefer chordless paths with fewest edges.',
      ],
      solutions: {
        cpp20: `#include <algorithm>
#include <iostream>
#include <numeric>
#include <queue>
#include <vector>

using namespace std;

static constexpr long long INF = (1LL << 58);

struct Edge { int u, v; long long w; int col; };

struct DSU {
    vector<int> p;
    explicit DSU(int n) : p(n) { iota(p.begin(), p.end(), 0); }
    int find(int x) { return p[x] == x ? x : p[x] = find(p[x]); }
    void unite(int a, int b) {
        a = find(a); b = find(b);
        if (a != b) p[b] = a;
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    if (!(cin >> n >> m)) return 0;
    vector<Edge> edges(m);
    int max_c = 0;
    for (int i = 0; i < m; ++i) {
        cin >> edges[i].u >> edges[i].v >> edges[i].w >> edges[i].col;
        --edges[i].u; --edges[i].v;
        max_c = max(max_c, edges[i].col);
    }
    if (n == 1) { cout << 0 << '\\n'; return 0; }

    vector<bool> in_set(m, false);
    int cur_sz = 0;
    while (cur_sz < n - 1) {
        vector<int> in_idx, out_idx, col_owner(max_c + 1, -1);
        DSU full(n);
        for (int i = 0; i < m; ++i) {
            if (in_set[i]) {
                in_idx.push_back(i);
                col_owner[edges[i].col] = i;
                full.unite(edges[i].u, edges[i].v);
            } else {
                out_idx.push_back(i);
            }
        }
        vector<bool> x1(m, false), x2(m, false);
        for (int x : out_idx) {
            if (full.find(edges[x].u) != full.find(edges[x].v)) x1[x] = true;
            if (col_owner[edges[x].col] == -1) x2[x] = true;
        }

        vector<vector<int>> adj(m);
        for (int y : in_idx) {
            DSU dy(n);
            for (int z : in_idx) if (z != y) dy.unite(edges[z].u, edges[z].v);
            for (int x : out_idx) {
                if (dy.find(edges[x].u) != dy.find(edges[x].v)) adj[y].push_back(x);
            }
        }
        for (int x : out_idx) {
            int ow = col_owner[edges[x].col];
            if (ow == -1) { for (int y : in_idx) adj[x].push_back(y); }
            else adj[x].push_back(ow);
        }

        auto node_cost = [&](int i) -> long long {
            return in_set[i] ? -edges[i].w : edges[i].w;
        };

        vector<long long> dist(m, INF);
        vector<int> hops(m, 1e9), par(m, -1);
        vector<bool> in_q(m, false);
        queue<int> q;
        for (int x : out_idx) {
            if (x1[x]) {
                dist[x] = node_cost(x);
                hops[x] = 0;
                q.push(x);
                in_q[x] = true;
            }
        }
        while (!q.empty()) {
            int u = q.front(); q.pop();
            in_q[u] = false;
            for (int v : adj[u]) {
                long long nd = dist[u] + node_cost(v);
                int nh = hops[u] + 1;
                if (nd < dist[v] || (nd == dist[v] && nh < hops[v])) {
                    dist[v] = nd;
                    hops[v] = nh;
                    par[v] = u;
                    if (!in_q[v]) { in_q[v] = true; q.push(v); }
                }
            }
        }

        int best_end = -1;
        for (int x : out_idx) {
            if (!x2[x] || dist[x] >= INF / 2) continue;
            if (best_end == -1 || dist[x] < dist[best_end] || (dist[x] == dist[best_end] && hops[x] < hops[best_end])) {
                best_end = x;
            }
        }
        if (best_end == -1) break;
        for (int cur = best_end; cur != -1; cur = par[cur]) in_set[cur] = !in_set[cur];
        ++cur_sz;
    }

    if (cur_sz < n - 1) {
        cout << -1 << '\\n';
    } else {
        long long total = 0;
        for (int i = 0; i < m; ++i) if (in_set[i]) total += edges[i].w;
        cout << total << '\\n';
    }
    return 0;
}`,
        rust: `use std::collections::VecDeque;
use std::io::{self, Read};

const INF: i64 = 1_i64 << 58;

#[derive(Clone, Copy)]
struct Edge { u: usize, v: usize, w: i64, col: usize }

struct Dsu { p: Vec<usize> }
impl Dsu {
    fn new(n: usize) -> Self { Self { p: (0..n).collect() } }
    fn find(&mut self, x: usize) -> usize {
        if self.p[x] == x { x } else { let r = self.find(self.p[x]); self.p[x] = r; r }
    }
    fn unite(&mut self, a: usize, b: usize) {
        let ra = self.find(a); let rb = self.find(b);
        if ra != rb { self.p[rb] = ra; }
    }
}

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let n: usize = match it.next() { Some(v) => v.parse().unwrap(), None => return };
    let m: usize = it.next().unwrap().parse().unwrap();
    let mut edges = Vec::with_capacity(m);
    let mut max_c = 0usize;
    for _ in 0..m {
        let u: usize = it.next().unwrap().parse::<usize>().unwrap() - 1;
        let v: usize = it.next().unwrap().parse::<usize>().unwrap() - 1;
        let w: i64 = it.next().unwrap().parse().unwrap();
        let col: usize = it.next().unwrap().parse().unwrap();
        max_c = max_c.max(col);
        edges.push(Edge { u, v, w, col });
    }
    if n == 1 { println!("0"); return; }

    let mut in_set = vec![false; m];
    let mut cur_sz = 0usize;
    while cur_sz < n - 1 {
        let mut in_idx = Vec::new();
        let mut out_idx = Vec::new();
        let mut col_owner = vec![None; max_c + 1];
        let mut full = Dsu::new(n);
        for i in 0..m {
            if in_set[i] {
                in_idx.push(i);
                col_owner[edges[i].col] = Some(i);
                full.unite(edges[i].u, edges[i].v);
            } else { out_idx.push(i); }
        }
        let mut x1 = vec![false; m];
        let mut x2 = vec![false; m];
        for &x in &out_idx {
            if full.find(edges[x].u) != full.find(edges[x].v) { x1[x] = true; }
            if col_owner[edges[x].col].is_none() { x2[x] = true; }
        }

        let mut adj = vec![Vec::<usize>::new(); m];
        for &y in &in_idx {
            let mut dy = Dsu::new(n);
            for &z in &in_idx { if z != y { dy.unite(edges[z].u, edges[z].v); } }
            for &x in &out_idx {
                if dy.find(edges[x].u) != dy.find(edges[x].v) { adj[y].push(x); }
            }
        }
        for &x in &out_idx {
            if let Some(ow) = col_owner[edges[x].col] { adj[x].push(ow); }
            else { for &y in &in_idx { adj[x].push(y); } }
        }

        let mut dist = vec![INF; m];
        let mut hops = vec![usize::MAX / 2; m];
        let mut par = vec![None; m];
        let mut in_q = vec![false; m];
        let mut q = VecDeque::new();
        for &x in &out_idx {
            if x1[x] {
                dist[x] = edges[x].w;
                hops[x] = 0;
                in_q[x] = true;
                q.push_back(x);
            }
        }
        while let Some(u) = q.pop_front() {
            in_q[u] = false;
            for &v in &adj[u] {
                let vc = if in_set[v] { -edges[v].w } else { edges[v].w };
                let nd = dist[u] + vc;
                let nh = hops[u] + 1;
                if (nd, nh) < (dist[v], hops[v]) {
                    dist[v] = nd;
                    hops[v] = nh;
                    par[v] = Some(u);
                    if !in_q[v] { in_q[v] = true; q.push_back(v); }
                }
            }
        }

        let mut best_end = None;
        for &x in &out_idx {
            if !x2[x] || dist[x] >= INF / 2 { continue; }
            match best_end {
                None => best_end = Some(x),
                Some(b) => if (dist[x], hops[x]) < (dist[b], hops[b]) { best_end = Some(x); }
            }
        }
        let mut cur = match best_end { Some(v) => v, None => break };
        loop {
            in_set[cur] = !in_set[cur];
            match par[cur] { Some(p) => cur = p, None => break }
        }
        cur_sz += 1;
    }

    if cur_sz < n - 1 {
        println!("-1");
    } else {
        let total: i64 = (0..m).filter(|&i| in_set[i]).map(|i| edges[i].w).sum();
        println!("{}", total);
    }
}`,
        java21: `import java.io.BufferedInputStream;
import java.io.IOException;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Arrays;

public class Main {
    static final long INF = 1L << 58;

    static class FastScanner {
        private final BufferedInputStream in = new BufferedInputStream(System.in);
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;

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
            while (c >= 0 && c <= 32) c = readByte();
            if (c < 0) return 0;
            long res = 0;
            while (c > 32) { res = res * 10 + (c - '0'); c = readByte(); }
            return res;
        }
    }

    static class DSU {
        int[] p;
        DSU(int n) { p = new int[n]; for (int i = 0; i < n; i++) p[i] = i; }
        int find(int x) { return p[x] == x ? x : (p[x] = find(p[x])); }
        void unite(int a, int b) { a = find(a); b = find(b); if (a != b) p[b] = a; }
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        int n = (int) fs.nextLong();
        if (n == 0) return;
        int m = (int) fs.nextLong();
        int[] eu = new int[m], ev = new int[m], ec = new int[m];
        long[] ew = new long[m];
        int maxC = 0;
        for (int i = 0; i < m; i++) {
            eu[i] = (int) fs.nextLong() - 1;
            ev[i] = (int) fs.nextLong() - 1;
            ew[i] = fs.nextLong();
            ec[i] = (int) fs.nextLong();
            if (ec[i] > maxC) maxC = ec[i];
        }
        if (n == 1) { System.out.println(0); return; }

        boolean[] inSet = new boolean[m];
        int curSz = 0;
        while (curSz < n - 1) {
            ArrayList<Integer> inIdx = new ArrayList<>(), outIdx = new ArrayList<>();
            int[] colOwner = new int[maxC + 1]; Arrays.fill(colOwner, -1);
            DSU full = new DSU(n);
            for (int i = 0; i < m; i++) {
                if (inSet[i]) { inIdx.add(i); colOwner[ec[i]] = i; full.unite(eu[i], ev[i]); }
                else outIdx.add(i);
            }
            boolean[] x1 = new boolean[m], x2 = new boolean[m];
            for (int x : outIdx) {
                if (full.find(eu[x]) != full.find(ev[x])) x1[x] = true;
                if (colOwner[ec[x]] == -1) x2[x] = true;
            }

            @SuppressWarnings("unchecked")
            ArrayList<Integer>[] adj = new ArrayList[m];
            for (int i = 0; i < m; i++) adj[i] = new ArrayList<>();
            for (int y : inIdx) {
                DSU dy = new DSU(n);
                for (int z : inIdx) if (z != y) dy.unite(eu[z], ev[z]);
                for (int x : outIdx) if (dy.find(eu[x]) != dy.find(ev[x])) adj[y].add(x);
            }
            for (int x : outIdx) {
                int ow = colOwner[ec[x]];
                if (ow == -1) { for (int y : inIdx) adj[x].add(y); }
                else adj[x].add(ow);
            }

            long[] dist = new long[m]; Arrays.fill(dist, INF);
            int[] hops = new int[m], par = new int[m];
            Arrays.fill(hops, 1_000_000_000); Arrays.fill(par, -1);
            boolean[] inQ = new boolean[m];
            ArrayDeque<Integer> q = new ArrayDeque<>();
            for (int x : outIdx) {
                if (x1[x]) {
                    dist[x] = ew[x]; hops[x] = 0; inQ[x] = true; q.add(x);
                }
            }
            while (!q.isEmpty()) {
                int u = q.poll();
                inQ[u] = false;
                for (int v : adj[u]) {
                    long vc = inSet[v] ? -ew[v] : ew[v];
                    long nd = dist[u] + vc;
                    int nh = hops[u] + 1;
                    if (nd < dist[v] || (nd == dist[v] && nh < hops[v])) {
                        dist[v] = nd; hops[v] = nh; par[v] = u;
                        if (!inQ[v]) { inQ[v] = true; q.add(v); }
                    }
                }
            }
            int bestEnd = -1;
            for (int x : outIdx) {
                if (!x2[x] || dist[x] >= INF / 2) continue;
                if (bestEnd == -1 || dist[x] < dist[bestEnd] || (dist[x] == dist[bestEnd] && hops[x] < hops[bestEnd])) {
                    bestEnd = x;
                }
            }
            if (bestEnd == -1) break;
            for (int cur = bestEnd; cur != -1; cur = par[cur]) inSet[cur] = !inSet[cur];
            curSz++;
        }
        if (curSz < n - 1) {
            System.out.println(-1);
        } else {
            long total = 0;
            for (int i = 0; i < m; i++) if (inSet[i]) total += ew[i];
            System.out.println(total);
        }
    }
}`,
        python3: `from collections import deque
import sys

sys.setrecursionlimit(200000)
INF = 1 << 58


class DSU:
    def __init__(self, n: int) -> None:
        self.p = list(range(n))

    def find(self, x: int) -> int:
        while self.p[x] != x:
            self.p[x] = self.p[self.p[x]]
            x = self.p[x]
        return x

    def unite(self, a: int, b: int) -> None:
        ra, rb = self.find(a), self.find(b)
        if ra != rb:
            self.p[rb] = ra


def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n, m = int(data[0]), int(data[1])
    edges = []
    max_c = 0
    idx = 2
    for _ in range(m):
        u, v, w, c = int(data[idx]) - 1, int(data[idx + 1]) - 1, int(data[idx + 2]), int(data[idx + 3])
        idx += 4
        max_c = max(max_c, c)
        edges.append((u, v, w, c))
    if n == 1:
        sys.stdout.write("0\\n")
        return

    in_set = [False] * m
    cur_sz = 0
    while cur_sz < n - 1:
        in_idx, out_idx = [], []
        col_owner = [-1] * (max_c + 1)
        full = DSU(n)
        for i, (u, v, w, c) in enumerate(edges):
            if in_set[i]:
                in_idx.append(i)
                col_owner[c] = i
                full.unite(u, v)
            else:
                out_idx.append(i)
        x1 = [False] * m
        x2 = [False] * m
        for x in out_idx:
            u, v, w, c = edges[x]
            if full.find(u) != full.find(v):
                x1[x] = True
            if col_owner[c] == -1:
                x2[x] = True

        adj = [[] for _ in range(m)]
        for y in in_idx:
            dy = DSU(n)
            for z in in_idx:
                if z != y:
                    dy.unite(edges[z][0], edges[z][1])
            for x in out_idx:
                if dy.find(edges[x][0]) != dy.find(edges[x][1]):
                    adj[y].append(x)
        for x in out_idx:
            ow = col_owner[edges[x][3]]
            if ow == -1:
                adj[x].extend(in_idx)
            else:
                adj[x].append(ow)

        dist = [INF] * m
        hops = [10**9] * m
        par = [-1] * m
        in_q = [False] * m
        q = deque()
        for x in out_idx:
            if x1[x]:
                dist[x] = edges[x][2]
                hops[x] = 0
                in_q[x] = True
                q.append(x)
        while q:
            u = q.popleft()
            in_q[u] = False
            for v in adj[u]:
                vc = -edges[v][2] if in_set[v] else edges[v][2]
                nd = dist[u] + vc
                nh = hops[u] + 1
                if nd < dist[v] or (nd == dist[v] and nh < hops[v]):
                    dist[v] = nd
                    hops[v] = nh
                    par[v] = u
                    if not in_q[v]:
                        in_q[v] = True
                        q.append(v)

        best_end = -1
        for x in out_idx:
            if not x2[x] or dist[x] >= INF // 2:
                continue
            if best_end == -1 or (dist[x], hops[x]) < (dist[best_end], hops[best_end]):
                best_end = x
        if best_end == -1:
            break
        cur = best_end
        while cur != -1:
            in_set[cur] = not in_set[cur]
            cur = par[cur]
        cur_sz += 1

    if cur_sz < n - 1:
        sys.stdout.write("-1\\n")
    else:
        sys.stdout.write(f"{sum(edges[i][2] for i in range(m) if in_set[i])}\\n")


if __name__ == "__main__":
    solve()`,
        ruby: `INF = 1 << 58

class DSU
  def initialize(n); @p = (0...n).to_a; end
  def find(x); while @p[x] != x; @p[x] = @p[@p[x]]; x = @p[x]; end; x; end
  def unite(a, b); ra = find(a); rb = find(b); @p[rb] = ra if ra != rb; end
end

data = STDIN.read.split
exit if data.empty?
n = data[0].to_i; m = data[1].to_i
edges = []; max_c = 0; idx = 2
m.times do
  u = data[idx].to_i - 1; v = data[idx + 1].to_i - 1; w = data[idx + 2].to_i; c = data[idx + 3].to_i
  idx += 4; max_c = c if c > max_c
  edges << [u, v, w, c]
end
if n == 1
  puts 0
  exit
end

in_set = Array.new(m, false)
cur_sz = 0
while cur_sz < n - 1
  in_idx = []; out_idx = []; col_owner = Array.new(max_c + 1, -1)
  full = DSU.new(n)
  edges.each_with_index do |(u, v, _w, c), i|
    if in_set[i]
      in_idx << i; col_owner[c] = i; full.unite(u, v)
    else
      out_idx << i
    end
  end
  x1 = Array.new(m, false); x2 = Array.new(m, false)
  out_idx.each do |x|
    u, v, _w, c = edges[x]
    x1[x] = true if full.find(u) != full.find(v)
    x2[x] = true if col_owner[c] == -1
  end

  adj = Array.new(m) { [] }
  in_idx.each do |y|
    dy = DSU.new(n)
    in_idx.each { |z| dy.unite(edges[z][0], edges[z][1]) if z != y }
    out_idx.each { |x| adj[y] << x if dy.find(edges[x][0]) != dy.find(edges[x][1]) }
  end
  out_idx.each do |x|
    ow = col_owner[edges[x][3]]
    ow == -1 ? adj[x].concat(in_idx) : adj[x] << ow
  end

  dist = Array.new(m, INF)
  hops = Array.new(m, 1_000_000_000)
  par = Array.new(m, -1)
  in_q = Array.new(m, false)
  q = []
  out_idx.each do |x|
    if x1[x]
      dist[x] = edges[x][2]; hops[x] = 0; in_q[x] = true; q << x
    end
  end
  head = 0
  while head < q.length
    u = q[head]; head += 1; in_q[u] = false
    adj[u].each do |v|
      vc = in_set[v] ? -edges[v][2] : edges[v][2]
      nd = dist[u] + vc
      nh = hops[u] + 1
      if nd < dist[v] || (nd == dist[v] && nh < hops[v])
        dist[v] = nd; hops[v] = nh; par[v] = u
        unless in_q[v]; in_q[v] = true; q << v; end
      end
    end
  end

  best_end = -1
  out_idx.each do |x|
    next if !x2[x] || dist[x] >= INF / 2
    if best_end == -1 || dist[x] < dist[best_end] || (dist[x] == dist[best_end] && hops[x] < hops[best_end])
      best_end = x
    end
  end
  break if best_end == -1
  cur = best_end
  while cur != -1; in_set[cur] = !in_set[cur]; cur = par[cur]; end
  cur_sz += 1
end

if cur_sz < n - 1
  puts(-1)
else
  total = 0
  m.times { |i| total += edges[i][2] if in_set[i] }
  puts total
end`,
      },
    },
    {
      id: 'ch80-p3',
      tier: 'Boss',
      ratingRange: '3000–3300+',
      title: 'Maximum GF(2) Linearly-Independent Spanning Forest (Linear + Graphic Matroid)',
      statement:
        'Given an undirected graph with N vertices (1 <= N <= 65) and M edges (1 <= M <= 200), where each edge i connects (u_i, v_i) and carries a 60-bit unsigned integer label val_i (0 <= val_i < 2^60), find the maximum number of edges in a subset I that forms an acyclic forest in the graph AND whose edge labels {val_i : i in I} are linearly independent over GF(2) (no non-empty subset XORs to 0).',
      constraints: '1 <= N <= 65; 1 <= M <= 200; 0 <= val_i < 2^60; Time Limit: 2.0s',
      sampleInput: '4 4\n1 2 1\n2 3 2\n2 3 4\n3 4 3',
      sampleOutput: '3',
      hints: [
        'M_1 is the Graphic Matroid (DSU forest check) and M_2 is the Linear Matroid over GF(2) (60-bit XOR Gaussian basis).',
        'For each y in I, prebuild the 60-bit XOR basis of I \\ {y} once; an outside edge x has a directed edge x -> y in D(I) iff val_x cannot be reduced to 0 by the basis of I \\ {y}.',
      ],
      solutions: {
        cpp20: `#include <algorithm>
#include <cstdint>
#include <iostream>
#include <numeric>
#include <queue>
#include <vector>

using namespace std;

struct Edge {
    int u, v;
    unsigned long long val;
};

struct DSU {
    vector<int> p;
    explicit DSU(int n) : p(n) { iota(p.begin(), p.end(), 0); }
    int find(int x) { return p[x] == x ? x : p[x] = find(p[x]); }
    void unite(int a, int b) {
        a = find(a); b = find(b);
        if (a != b) p[b] = a;
    }
};

struct XorBasis {
    unsigned long long b[62]{};
    bool can_insert(unsigned long long x) const {
        for (int i = 60; i >= 0; --i) {
            if ((x >> i) & 1ULL) {
                if (!b[i]) return true;
                x ^= b[i];
            }
        }
        return false;
    }
    void insert(unsigned long long x) {
        for (int i = 60; i >= 0; --i) {
            if ((x >> i) & 1ULL) {
                if (!b[i]) { b[i] = x; return; }
                x ^= b[i];
            }
        }
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    if (!(cin >> n >> m)) return 0;
    vector<Edge> edges(m);
    for (int i = 0; i < m; ++i) {
        cin >> edges[i].u >> edges[i].v >> edges[i].val;
        --edges[i].u; --edges[i].v;
    }

    vector<bool> in_set(m, false);
    while (true) {
        vector<int> in_idx, out_idx;
        DSU full_dsu(n);
        XorBasis full_basis;
        for (int i = 0; i < m; ++i) {
            if (in_set[i]) {
                in_idx.push_back(i);
                full_dsu.unite(edges[i].u, edges[i].v);
                full_basis.insert(edges[i].val);
            } else {
                out_idx.push_back(i);
            }
        }

        vector<bool> x1(m, false), x2(m, false);
        int direct = -1;
        for (int x : out_idx) {
            if (full_dsu.find(edges[x].u) != full_dsu.find(edges[x].v)) x1[x] = true;
            if (full_basis.can_insert(edges[x].val)) x2[x] = true;
            if (x1[x] && x2[x] && direct == -1) direct = x;
        }
        if (direct != -1) { in_set[direct] = true; continue; }

        vector<vector<int>> adj(m);
        for (int y : in_idx) {
            DSU dsu_y(n);
            XorBasis basis_y;
            for (int z : in_idx) {
                if (z != y) {
                    dsu_y.unite(edges[z].u, edges[z].v);
                    basis_y.insert(edges[z].val);
                }
            }
            for (int x : out_idx) {
                if (dsu_y.find(edges[x].u) != dsu_y.find(edges[x].v)) adj[y].push_back(x);
                if (basis_y.can_insert(edges[x].val)) adj[x].push_back(y);
            }
        }

        vector<int> dist(m, -1), par(m, -1);
        queue<int> q;
        for (int x : out_idx) if (x1[x]) { dist[x] = 0; q.push(x); }
        int end_node = -1;
        while (!q.empty()) {
            int u = q.front(); q.pop();
            if (x2[u]) { end_node = u; break; }
            for (int v : adj[u]) {
                if (dist[v] == -1) { dist[v] = dist[u] + 1; par[v] = u; q.push(v); }
            }
        }
        if (end_node == -1) break;
        for (int cur = end_node; cur != -1; cur = par[cur]) in_set[cur] = !in_set[cur];
    }

    int ans = 0;
    for (bool b : in_set) if (b) ++ans;
    cout << ans << '\\n';
    return 0;
}`,
        rust: `use std::collections::VecDeque;
use std::io::{self, Read};

#[derive(Clone, Copy)]
struct Edge { u: usize, v: usize, val: u64 }

struct Dsu { p: Vec<usize> }
impl Dsu {
    fn new(n: usize) -> Self { Self { p: (0..n).collect() } }
    fn find(&mut self, x: usize) -> usize {
        if self.p[x] == x { x } else { let r = self.find(self.p[x]); self.p[x] = r; r }
    }
    fn unite(&mut self, a: usize, b: usize) {
        let ra = self.find(a); let rb = self.find(b);
        if ra != rb { self.p[rb] = ra; }
    }
}

#[derive(Clone, Copy)]
struct XorBasis { b: [u64; 61] }
impl XorBasis {
    fn new() -> Self { Self { b: [0; 61] } }
    fn can_insert(&self, mut x: u64) -> bool {
        for i in (0..=60).rev() {
            if ((x >> i) & 1) == 1 {
                if self.b[i] == 0 { return true; }
                x ^= self.b[i];
            }
        }
        false
    }
    fn insert(&mut self, mut x: u64) {
        for i in (0..=60).rev() {
            if ((x >> i) & 1) == 1 {
                if self.b[i] == 0 { self.b[i] = x; return; }
                x ^= self.b[i];
            }
        }
    }
}

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let n: usize = match it.next() { Some(v) => v.parse().unwrap(), None => return };
    let m: usize = it.next().unwrap().parse().unwrap();
    let mut edges = Vec::with_capacity(m);
    for _ in 0..m {
        let u: usize = it.next().unwrap().parse::<usize>().unwrap() - 1;
        let v: usize = it.next().unwrap().parse::<usize>().unwrap() - 1;
        let val: u64 = it.next().unwrap().parse().unwrap();
        edges.push(Edge { u, v, val });
    }
    let mut in_set = vec![false; m];
    loop {
        let mut in_idx = Vec::new();
        let mut out_idx = Vec::new();
        let mut full_dsu = Dsu::new(n);
        let mut full_basis = XorBasis::new();
        for i in 0..m {
            if in_set[i] {
                in_idx.push(i);
                full_dsu.unite(edges[i].u, edges[i].v);
                full_basis.insert(edges[i].val);
            } else { out_idx.push(i); }
        }
        let mut x1 = vec![false; m];
        let mut x2 = vec![false; m];
        for &x in &out_idx {
            if full_dsu.find(edges[x].u) != full_dsu.find(edges[x].v) { x1[x] = true; }
            if full_basis.can_insert(edges[x].val) { x2[x] = true; }
        }
        if let Some(&d) = out_idx.iter().find(|&&x| x1[x] && x2[x]) {
            in_set[d] = true;
            continue;
        }
        let mut adj = vec![Vec::<usize>::new(); m];
        for &y in &in_idx {
            let mut dy = Dsu::new(n);
            let mut by = XorBasis::new();
            for &z in &in_idx {
                if z != y {
                    dy.unite(edges[z].u, edges[z].v);
                    by.insert(edges[z].val);
                }
            }
            for &x in &out_idx {
                if dy.find(edges[x].u) != dy.find(edges[x].v) { adj[y].push(x); }
                if by.can_insert(edges[x].val) { adj[x].push(y); }
            }
        }
        let mut dist = vec![-1i32; m];
        let mut par = vec![None; m];
        let mut q = VecDeque::new();
        for &x in &out_idx { if x1[x] { dist[x] = 0; q.push_back(x); } }
        let mut end = None;
        while let Some(u) = q.pop_front() {
            if x2[u] { end = Some(u); break; }
            for &v in &adj[u] {
                if dist[v] == -1 { dist[v] = dist[u] + 1; par[v] = Some(u); q.push_back(v); }
            }
        }
        let mut cur = match end { Some(v) => v, None => break };
        loop {
            in_set[cur] = !in_set[cur];
            match par[cur] { Some(p) => cur = p, None => break }
        }
    }
    println!("{}", in_set.iter().filter(|&&b| b).count());
}`,
        java21: `import java.io.BufferedInputStream;
import java.io.IOException;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Arrays;

public class Main {
    static class FastScanner {
        private final BufferedInputStream in = new BufferedInputStream(System.in);
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;

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
            while (c >= 0 && c <= 32) c = readByte();
            if (c < 0) return 0;
            long res = 0;
            while (c > 32) { res = res * 10 + (c - '0'); c = readByte(); }
            return res;
        }
    }

    static class DSU {
        int[] p;
        DSU(int n) { p = new int[n]; for (int i = 0; i < n; i++) p[i] = i; }
        int find(int x) { return p[x] == x ? x : (p[x] = find(p[x])); }
        void unite(int a, int b) { a = find(a); b = find(b); if (a != b) p[b] = a; }
    }

    static class XorBasis {
        long[] b = new long[61];
        boolean canInsert(long x) {
            for (int i = 60; i >= 0; i--) {
                if (((x >>> i) & 1L) != 0) {
                    if (b[i] == 0) return true;
                    x ^= b[i];
                }
            }
            return false;
        }
        void insert(long x) {
            for (int i = 60; i >= 0; i--) {
                if (((x >>> i) & 1L) != 0) {
                    if (b[i] == 0) { b[i] = x; return; }
                    x ^= b[i];
                }
            }
        }
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        int n = (int) fs.nextLong();
        if (n == 0) return;
        int m = (int) fs.nextLong();
        int[] eu = new int[m], ev = new int[m];
        long[] eval = new long[m];
        for (int i = 0; i < m; i++) {
            eu[i] = (int) fs.nextLong() - 1;
            ev[i] = (int) fs.nextLong() - 1;
            eval[i] = fs.nextLong();
        }
        boolean[] inSet = new boolean[m];
        while (true) {
            ArrayList<Integer> inIdx = new ArrayList<>(), outIdx = new ArrayList<>();
            DSU fullDsu = new DSU(n);
            XorBasis fullBasis = new XorBasis();
            for (int i = 0; i < m; i++) {
                if (inSet[i]) {
                    inIdx.add(i); fullDsu.unite(eu[i], ev[i]); fullBasis.insert(eval[i]);
                } else outIdx.add(i);
            }
            boolean[] x1 = new boolean[m], x2 = new boolean[m];
            int direct = -1;
            for (int x : outIdx) {
                if (fullDsu.find(eu[x]) != fullDsu.find(ev[x])) x1[x] = true;
                if (fullBasis.canInsert(eval[x])) x2[x] = true;
                if (x1[x] && x2[x] && direct == -1) direct = x;
            }
            if (direct != -1) { inSet[direct] = true; continue; }

            @SuppressWarnings("unchecked")
            ArrayList<Integer>[] adj = new ArrayList[m];
            for (int i = 0; i < m; i++) adj[i] = new ArrayList<>();
            for (int y : inIdx) {
                DSU dy = new DSU(n);
                XorBasis by = new XorBasis();
                for (int z : inIdx) if (z != y) { dy.unite(eu[z], ev[z]); by.insert(eval[z]); }
                for (int x : outIdx) {
                    if (dy.find(eu[x]) != dy.find(ev[x])) adj[y].add(x);
                    if (by.canInsert(eval[x])) adj[x].add(y);
                }
            }
            int[] dist = new int[m], par = new int[m];
            Arrays.fill(dist, -1); Arrays.fill(par, -1);
            ArrayDeque<Integer> q = new ArrayDeque<>();
            for (int x : outIdx) if (x1[x]) { dist[x] = 0; q.add(x); }
            int end = -1;
            while (!q.isEmpty()) {
                int u = q.poll();
                if (x2[u]) { end = u; break; }
                for (int v : adj[u]) {
                    if (dist[v] == -1) { dist[v] = dist[u] + 1; par[v] = u; q.add(v); }
                }
            }
            if (end == -1) break;
            for (int cur = end; cur != -1; cur = par[cur]) inSet[cur] = !inSet[cur];
        }
        int ans = 0;
        for (boolean b : inSet) if (b) ans++;
        System.out.println(ans);
    }
}`,
        python3: `from collections import deque
import sys

sys.setrecursionlimit(200000)


class DSU:
    def __init__(self, n: int) -> None:
        self.p = list(range(n))

    def find(self, x: int) -> int:
        while self.p[x] != x:
            self.p[x] = self.p[self.p[x]]
            x = self.p[x]
        return x

    def unite(self, a: int, b: int) -> None:
        ra, rb = self.find(a), self.find(b)
        if ra != rb:
            self.p[rb] = ra


class XorBasis:
    def __init__(self) -> None:
        self.b = [0] * 61

    def can_insert(self, x: int) -> bool:
        for i in range(60, -1, -1):
            if (x >> i) & 1:
                if self.b[i] == 0:
                    return True
                x ^= self.b[i]
        return False

    def insert(self, x: int) -> None:
        for i in range(60, -1, -1):
            if (x >> i) & 1:
                if self.b[i] == 0:
                    self.b[i] = x
                    return
                x ^= self.b[i]


def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n, m = int(data[0]), int(data[1])
    edges = []
    idx = 2
    for _ in range(m):
        u, v, val = int(data[idx]) - 1, int(data[idx + 1]) - 1, int(data[idx + 2])
        idx += 3
        edges.append((u, v, val))

    in_set = [False] * m
    while True:
        in_idx, out_idx = [], []
        full_dsu = DSU(n)
        full_basis = XorBasis()
        for i, (u, v, val) in enumerate(edges):
            if in_set[i]:
                in_idx.append(i)
                full_dsu.unite(u, v)
                full_basis.insert(val)
            else:
                out_idx.append(i)
        x1 = [False] * m
        x2 = [False] * m
        direct = -1
        for x in out_idx:
            u, v, val = edges[x]
            if full_dsu.find(u) != full_dsu.find(v):
                x1[x] = True
            if full_basis.can_insert(val):
                x2[x] = True
            if x1[x] and x2[x] and direct == -1:
                direct = x
        if direct != -1:
            in_set[direct] = True
            continue

        adj = [[] for _ in range(m)]
        for y in in_idx:
            dy = DSU(n)
            by = XorBasis()
            for z in in_idx:
                if z != y:
                    dy.unite(edges[z][0], edges[z][1])
                    by.insert(edges[z][2])
            for x in out_idx:
                if dy.find(edges[x][0]) != dy.find(edges[x][1]):
                    adj[y].append(x)
                if by.can_insert(edges[x][2]):
                    adj[x].append(y)

        dist = [-1] * m
        par = [-1] * m
        q = deque(x for x in out_idx if x1[x])
        for x in q:
            dist[x] = 0
        end = -1
        while q:
            u = q.popleft()
            if x2[u]:
                end = u
                break
            for v in adj[u]:
                if dist[v] == -1:
                    dist[v] = dist[u] + 1
                    par[v] = u
                    q.append(v)
        if end == -1:
            break
        cur = end
        while cur != -1:
            in_set[cur] = not in_set[cur]
            cur = par[cur]

    sys.stdout.write(f"{sum(in_set)}\\n")


if __name__ == "__main__":
    solve()`,
        ruby: `class DSU
  def initialize(n); @p = (0...n).to_a; end
  def find(x); while @p[x] != x; @p[x] = @p[@p[x]]; x = @p[x]; end; x; end
  def unite(a, b); ra = find(a); rb = find(b); @p[rb] = ra if ra != rb; end
end

class XorBasis
  def initialize; @b = Array.new(61, 0); end
  def can_insert?(x)
    60.downto(0) do |i|
      if ((x >> i) & 1) == 1
        return true if @b[i] == 0
        x ^= @b[i]
      end
    end
    false
  end
  def insert(x)
    60.downto(0) do |i|
      if ((x >> i) & 1) == 1
        if @b[i] == 0
          @b[i] = x
          return
        end
        x ^= @b[i]
      end
    end
  end
end

data = STDIN.read.split
exit if data.empty?
n = data[0].to_i; m = data[1].to_i
edges = []; idx = 2
m.times do
  u = data[idx].to_i - 1; v = data[idx + 1].to_i - 1; val = data[idx + 2].to_i
  idx += 3
  edges << [u, v, val]
end

in_set = Array.new(m, false)
loop do
  in_idx = []; out_idx = []
  full_dsu = DSU.new(n); full_basis = XorBasis.new
  edges.each_with_index do |(u, v, val), i|
    if in_set[i]
      in_idx << i; full_dsu.unite(u, v); full_basis.insert(val)
    else
      out_idx << i
    end
  end
  x1 = Array.new(m, false); x2 = Array.new(m, false); direct = -1
  out_idx.each do |x|
    u, v, val = edges[x]
    x1[x] = true if full_dsu.find(u) != full_dsu.find(v)
    x2[x] = true if full_basis.can_insert?(val)
    direct = x if x1[x] && x2[x] && direct == -1
  end
  if direct != -1
    in_set[direct] = true
    next
  end
  adj = Array.new(m) { [] }
  in_idx.each do |y|
    dy = DSU.new(n); by = XorBasis.new
    in_idx.each do |z|
      if z != y
        dy.unite(edges[z][0], edges[z][1])
        by.insert(edges[z][2])
      end
    end
    out_idx.each do |x|
      adj[y] << x if dy.find(edges[x][0]) != dy.find(edges[x][1])
      adj[x] << y if by.can_insert?(edges[x][2])
    end
  end
  dist = Array.new(m, -1); par = Array.new(m, -1); q = []
  out_idx.each { |x| if x1[x]; dist[x] = 0; q << x; end }
  head = 0; end_node = -1
  while head < q.length
    u = q[head]; head += 1
    if x2[u]; end_node = u; break; end
    adj[u].each do |v|
      if dist[v] == -1; dist[v] = dist[u] + 1; par[v] = u; q << v; end
    end
  end
  break if end_node == -1
  cur = end_node
  while cur != -1; in_set[cur] = !in_set[cur]; cur = par[cur]; end
end
puts in_set.count(true)`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'Codeforces',
      title: 'Pick Your Own Nim / Rainbow Spanning Tree (CF 1284G / 1556H)',
      difficulty: '3100',
      url: 'https://codeforces.com/problemset/problem/1556/H',
      patternNote: 'Weighted or unweighted intersection of Graphic Matroid and Partition / XOR Linear Matroid.',
    },
    {
      platform: 'AtCoder',
      title: 'AGC Matroid Intersection & Spanning Forest Partitioning',
      difficulty: 'Grandmaster',
      url: 'https://atcoder.jp/contests',
      patternNote: 'Construct bipartite exchange graph D(I) and augment along shortest BFS/SPFA paths.',
    },
    {
      platform: 'CodeChef',
      title: 'Colorful Arborescence & Dual Matroid Augmentation',
      difficulty: '3000',
      url: 'https://www.codechef.com/problems',
      patternNote: 'Prebuild I \\ {y} oracles once per y in I to keep each augmentation round O(R * M).',
    },
  ],
  interviewNotes: [
    'Edmonds’ Matroid Intersection Min-Max Theorem states max |I| = min_{U subset E} (r_1(U) + r_2(E \\ U)), generalizing König’s theorem and Menger’s theorem.',
    'Always use BFS (or SPFA with fewest-hops tie-breaking) on the exchange graph D(I): augmenting along a non-shortest path with chords can violate independence.',
    'Intersecting three matroids is NP-hard (it generalizes Hamiltonian Path on directed graphs).',
  ],
  projectBlueprint: {
    title: 'Multi-Constraint Network Redundancy & Diverse Resource Allocation Solver',
    tagline: 'Exact dual-independence optimization engine pairing Graphic, Partition, and Linear GF(2) matroid oracles',
    stackSummary: 'C++20 / Rust Exchange-Graph Engine + DSU Graphic Oracle + 60-Bit GF(2) Linear Oracle',
    asciiDiagram:
`[Current Set I] ---> [Prebuild I \\ {y} Oracles (M1, M2)] ---> [Exchange Graph D(I)]
       ^                                                                |
       +------------- [Flip I <- I Delta V(P)] <--- [BFS / SPFA X1->X2] +`,
    milestones: [
      { id: 'm1', title: 'Pluggable Matroid Oracle Interface', detail: 'Support O(R) rebuilds of I \\ {y} for DSU, Color Partition, and GF(2) XOR Basis.' },
      { id: 'm2', title: 'Chordless Exchange-Graph BFS', detail: 'Discover shortest unweighted augmenting paths from X_1 to X_2 in O(R * |E|).' },
      { id: 'm3', title: 'Lexicographical SPFA Weighted Augmenter', detail: 'Minimize (path_cost, hop_count) for minimum-weight rainbow spanning trees.' },
    ],
    starterCode: `// Exchange graph directions:
// y in I -> x in E\\I if (I - {y}) + {x} in I_1;  x in E\\I -> y in I if (I - {y}) + {x} in I_2;`,
  },
};
