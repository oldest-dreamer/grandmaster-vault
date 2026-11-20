import type { TheoryChapter } from '../../types/vault';

export const CH16_MST_KRUSKAL: TheoryChapter = {
  slug: 'mst-kruskal-boruvka',
  topicId: 'gr-32',
  title: 'Minimum Spanning Trees (Kruskal, Prim & Boruvka)',
  domain: 'Graph & Tree Theory',
  ratingTier: '1400–1600',
  usacoDivision: 'Gold',
  subtitle:
    'Connect all N vertices with minimal total edge cost via Kruskal’s edge-sorting + DSU greedy cycle check, Prim’s dense O(V^2) growth, and Boruvka’s parallel component contractions.',
  analogyTitle: 'The Cheapest Bridge Inspector & Cycle Rejection Analogy',
  analogyBody:
    'Imagine an archipelago of N islands needing bridges so every island can reach every other island as cheaply as possible. Kruskal’s Inspector writes all candidate bridges on index cards sorted strictly from cheapest to most expensive. Walking down the deck one card at a time, if a bridge joins two disconnected island clusters (checked via DSU in O(1)), she builds it; if both endpoints ALREADY belong to the same cluster, building it creates a redundant loop, so she shreds the card! Because of the Cut Property, the lightest bridge crossing any cut between two clusters is ALWAYS safe to take. When edges aren’t listed explicitly—like complete graphs where edge weight is `a[u] XOR a[v]`—Boruvka’s parallel variant simply lets every existing island cluster pick its single cheapest neighbor simultaneously, halving the cluster count every round (at most log2 N rounds!).',
  prerequisites: [
    {
      slug: 'disjoint-set-union-rollback',
      title: 'Disjoint Set Union (DSU) & DSU with Rollback',
    },
  ],
  traceTitle: 'Interactive Kruskal Edge-Sorting & DSU Component Merging Visualizer',
  traceSubtitle:
    'Step through sorted edges `(u, v, w)`, accept bridges that merge separate DSU roots, reject cycle-forming edges, or edit the graph live.',
  allowDynamicGraphEdit: true,
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Step 1: Sort 6 Candidate Edges by Weight Ascending',
      explanation:
        'Sorted edge list: (1,3,w=1), (2,3,w=2), (1,2,w=3), (3,4,w=4), (2,4,w=5), (4,5,w=6). All 5 vertices start in separate DSU components.',
      mode: 'graph',
      graph: {
        calloutMetric: 'Sorted Edges: (1,3,1), (2,3,2), (1,2,3), (3,4,4), (2,4,5), (4,5,6)',
        nodes: [
          { id: '1', label: '1', x: 85, y: 90, state: 'unmatched', matchWith: null },
          { id: '2', label: '2', x: 245, y: 70, state: 'unmatched', matchWith: null },
          { id: '3', label: '3', x: 245, y: 220, state: 'unmatched', matchWith: null },
          { id: '4', label: '4', x: 400, y: 150, state: 'unmatched', matchWith: null },
          { id: '5', label: '5', x: 525, y: 150, state: 'unmatched', matchWith: null },
        ],
        edges: [
          { id: 'e13', from: '1', to: '3', weight: 1, state: 'default' },
          { id: 'e23', from: '2', to: '3', weight: 2, state: 'default' },
          { id: 'e12', from: '1', to: '2', weight: 3, state: 'default' },
          { id: 'e34', from: '3', to: '4', weight: 4, state: 'default' },
          { id: 'e24', from: '2', to: '4', weight: 5, state: 'default' },
          { id: 'e45', from: '4', to: '5', weight: 6, state: 'default' },
        ],
      },
      variables: { TotalCost: 0, TreeEdges: 0, Components: 5 },
    },
    {
      stepNumber: 2,
      title: 'Step 2: Accept (1,3,w=1) and (2,3,w=2) -> Merge {1,2,3}',
      explanation:
        'Edge (1,3,1): find(1) != find(3) -> ACCEPT (cost=1). Edge (2,3,2): find(2) != find(3) -> ACCEPT (cost=3). Cluster {1,2,3} forms.',
      mode: 'graph',
      graph: {
        calloutMetric: 'Accepted (1,3) & (2,3) | Cost = 3 | Components = 3',
        nodes: [
          { id: '1', label: '1 (G1)', x: 85, y: 90, state: 'even', matchWith: null },
          { id: '2', label: '2 (G1)', x: 245, y: 70, state: 'even', matchWith: null },
          { id: '3', label: '3 (G1)', x: 245, y: 220, state: 'active', matchWith: null },
          { id: '4', label: '4', x: 400, y: 150, state: 'unmatched', matchWith: null },
          { id: '5', label: '5', x: 525, y: 150, state: 'unmatched', matchWith: null },
        ],
        edges: [
          { id: 'e13', from: '1', to: '3', weight: 1, state: 'matched' },
          { id: 'e23', from: '2', to: '3', weight: 2, state: 'matched' },
          { id: 'e12', from: '1', to: '2', weight: 3, state: 'default' },
          { id: 'e34', from: '3', to: '4', weight: 4, state: 'default' },
          { id: 'e24', from: '2', to: '4', weight: 5, state: 'default' },
          { id: 'e45', from: '4', to: '5', weight: 6, state: 'default' },
        ],
      },
      variables: { TotalCost: 3, TreeEdges: 2, Components: 3 },
    },
    {
      stepNumber: 3,
      title: 'Step 3: REJECT Cycle Edge (1,2,w=3) & Accept (3,4,w=4)',
      explanation:
        'Next edge (1,2,3): find(1) == find(2) -> CYCLE REJECTED! Next edge (3,4,4): connects {1,2,3} to {4} -> ACCEPTED (cost=7).',
      mode: 'graph',
      graph: {
        calloutMetric: 'Skipped (1,2,3) cycle | Accepted (3,4,4) | Cost = 7',
        nodes: [
          { id: '1', label: '1 (G1)', x: 85, y: 90, state: 'matched', matchWith: null },
          { id: '2', label: '2 (G1)', x: 245, y: 70, state: 'matched', matchWith: null },
          { id: '3', label: '3 (G1)', x: 245, y: 220, state: 'matched', matchWith: null },
          { id: '4', label: '4 (G1)', x: 400, y: 150, state: 'active', matchWith: null },
          { id: '5', label: '5', x: 525, y: 150, state: 'unmatched', matchWith: null },
        ],
        edges: [
          { id: 'e13', from: '1', to: '3', weight: 1, state: 'matched' },
          { id: 'e23', from: '2', to: '3', weight: 2, state: 'matched' },
          { id: 'e12', from: '1', to: '2', weight: 3, state: 'contracted' },
          { id: 'e34', from: '3', to: '4', weight: 4, state: 'matched' },
          { id: 'e24', from: '2', to: '4', weight: 5, state: 'default' },
          { id: 'e45', from: '4', to: '5', weight: 6, state: 'default' },
        ],
      },
      variables: { TotalCost: 7, TreeEdges: 3, Rejected: '(1,2,3)' },
    },
    {
      stepNumber: 4,
      title: 'Step 4: Reject (2,4,5) & Accept (4,5,6) -> Complete MST (Cost = 13)',
      explanation:
        '(2,4,5) forms a cycle in {1,2,3,4} -> skipped. (4,5,6) connects vertex 5 -> 4 tree edges chosen (N - 1), total MST weight = 1 + 2 + 4 + 6 = 13.',
      mode: 'graph',
      graph: {
        calloutMetric: 'MST Complete: 4 Edges = N - 1 | Optimal Cost = 13',
        nodes: [
          { id: '1', label: '1*', x: 85, y: 90, state: 'matched', matchWith: null },
          { id: '2', label: '2*', x: 245, y: 70, state: 'matched', matchWith: null },
          { id: '3', label: '3*', x: 245, y: 220, state: 'matched', matchWith: null },
          { id: '4', label: '4*', x: 400, y: 150, state: 'matched', matchWith: null },
          { id: '5', label: '5*', x: 525, y: 150, state: 'matched', matchWith: null },
        ],
        edges: [
          { id: 'e13', from: '1', to: '3', weight: 1, state: 'matched' },
          { id: 'e23', from: '2', to: '3', weight: 2, state: 'matched' },
          { id: 'e12', from: '1', to: '2', weight: 3, state: 'contracted' },
          { id: 'e34', from: '3', to: '4', weight: 4, state: 'matched' },
          { id: 'e24', from: '2', to: '4', weight: 5, state: 'contracted' },
          { id: 'e45', from: '4', to: '5', weight: 6, state: 'matched' },
        ],
      },
      variables: { TotalCost: 13, TreeEdges: '4 / 4', Disconnected: 'false' },
    },
  ],
  reductionClues: [
    {
      clue: '"Connect all N cities with minimum total road/cable cost, or print IMPOSSIBLE"',
      translation: 'Kruskal MST: sort edges ascending, unite with DSU, check `edgesTaken == N - 1` at the end.',
    },
    {
      clue: '"Minimize the MAXIMUM edge weight on a path between u and v (Minimax Path / Bottleneck)"',
      translation: 'Every minimax path between ANY two nodes lies directly on the Minimum Spanning Tree! Build MST + Binary Lifting max-edge.',
    },
    {
      clue: '"Minimum Spanning Tree forcing edge e_i to be included / Second Best MST"',
      translation: 'Adding non-MST edge (u, v, w) forces removing the heaviest edge on the MST path(u, v) -> delta = w - maxEdgeOnPath(u, v).',
    },
    {
      clue: '"Complete graph on N <= 2000 Euclidean points (x, y) without storing N^2 edges in memory"',
      translation: 'Dense Prim’s algorithm in O(N^2) time and O(N) memory—avoids creating 2*10^6 edges!',
    },
    {
      clue: '"Complete graph where edge weight(u, v) = A[u] XOR A[v]"',
      translation: 'Boruvka’s algorithm + Binary Trie: only O(log N) rounds of finding closest out-component partner per node.',
    },
  ],
  timeComplexity: 'Kruskal: O(E log E) | Dense Prim: O(V^2) | Boruvka: O(E log V)',
  spaceComplexity: 'Kruskal: O(V + E) | Dense Prim: O(V)',
  pitfalls: [
    {
      type: 'WA',
      title: 'Forgetting to Check If the Graph Is Actually Connected (`edgesUsed < N - 1`)',
      detail:
        'If the input graph has multiple disconnected components, Kruskal finishes early with fewer than N - 1 edges. Always verify `edgesUsed == n - 1` before printing the sum!',
    },
    {
      type: 'WA',
      title: '32-Bit Integer Overflow When Summing MST Cost',
      detail:
        'With N = 10^5 and weights up to 10^9, the MST total reaches 10^14. Always accumulate MST weight in 64-bit (`long long` / `i64` / `long`).',
    },
    {
      type: 'MLE',
      title: 'Running Kruskal on a Complete Geometric Graph of N = 5000 Nodes',
      detail:
        'Creating and sorting 12.5 million explicit edge structs blows memory and time limits. Use Dense Prim in O(N^2) with O(N) `minDist[]` instead.',
    },
    {
      type: 'WA',
      title: 'Second Best MST Equal-Weight Edge Trap',
      detail:
        'For a STRICT second-best MST (weight strictly greater than MST), replacing `maxEdge == w` yields zero change—you must also track the SECOND largest distinct edge weight along every binary-lifting jump!',
    },
  ],
  implementations: {
    cpp20: `#include <bits/stdc++.h>
using namespace std;

struct DSU {
    vector<int> p;
    explicit DSU(int n) : p(n + 1, -1) {}
    int find(int x) { return p[x] < 0 ? x : p[x] = find(p[x]); }
    bool unite(int a, int b) {
        a = find(a); b = find(b);
        if (a == b) return false;
        if (-p[a] < -p[b]) swap(a, b);
        p[a] += p[b];
        p[b] = a;
        return true;
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, m;
    if (!(cin >> n >> m)) return 0;
    struct Edge { int u, v; long long w; };
    vector<Edge> edges(m);
    for (int i = 0; i < m; ++i) cin >> edges[i].u >> edges[i].v >> edges[i].w;

    sort(edges.begin(), edges.end(), [](const Edge& a, const Edge& b) {
        return a.w < b.w;
    });

    DSU dsu(n);
    long long totalCost = 0;
    int taken = 0;
    for (const auto& e : edges) {
        if (dsu.unite(e.u, e.v)) {
            totalCost += e.w;
            taken++;
        }
    }

    if (taken == n - 1) cout << totalCost << '\\n';
    else cout << "IMPOSSIBLE\\n";
    return 0;
}`,
    rust: `use std::io::{self, Read};

struct Dsu {
    p: Vec<i32>,
}

impl Dsu {
    fn new(n: usize) -> Self {
        Self { p: vec![-1; n + 1] }
    }
    fn find(&mut self, mut x: usize) -> usize {
        let mut r = x;
        while self.p[r] >= 0 {
            r = self.p[r] as usize;
        }
        while x != r {
            let nxt = self.p[x] as usize;
            self.p[x] = r as i32;
            x = nxt;
        }
        r
    }
    fn unite(&mut self, a: usize, b: usize) -> bool {
        let mut ra = self.find(a);
        let mut rb = self.find(b);
        if ra == rb {
            return false;
        }
        if -self.p[ra] < -self.p[rb] {
            std::mem::swap(&mut ra, &mut rb);
        }
        self.p[ra] += self.p[rb];
        self.p[rb] = ra as i32;
        true
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

    let mut edges = Vec::with_capacity(m);
    for _ in 0..m {
        let u: usize = it.next().unwrap().parse().unwrap();
        let v: usize = it.next().unwrap().parse().unwrap();
        let w: i64 = it.next().unwrap().parse().unwrap();
        edges.push((w, u, v));
    }
    edges.sort_unstable_by_key(|e| e.0);

    let mut dsu = Dsu::new(n);
    let mut total_cost = 0i64;
    let mut taken = 0usize;
    for (w, u, v) in edges {
        if dsu.unite(u, v) {
            total_cost += w;
            taken += 1;
        }
    }

    if taken == n - 1 {
        println!("{}", total_cost);
    } else {
        println!("IMPOSSIBLE");
    }
}`,
    java21: `import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;

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

    static int find(int[] p, int x) {
        int r = x;
        while (p[r] >= 0) r = p[r];
        while (x != r) {
            int nxt = p[x];
            p[x] = r;
            x = nxt;
        }
        return r;
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        long first = fs.nextLong();
        if (first == Long.MIN_VALUE) return;
        int n = (int) first;
        int m = fs.nextInt();

        long[] edges = new long[m];
        int[] eu = new int[m];
        int[] ev = new int[m];
        long[] ew = new long[m];
        Integer[] order = new Integer[m];

        for (int i = 0; i < m; i++) {
            eu[i] = fs.nextInt();
            ev[i] = fs.nextInt();
            ew[i] = fs.nextLong();
            order[i] = i;
        }
        Arrays.sort(order, (a, b) -> Long.compare(ew[a], ew[b]));

        int[] p = new int[n + 1];
        Arrays.fill(p, -1);
        long totalCost = 0;
        int taken = 0;

        for (int idx : order) {
            int a = find(p, eu[idx]);
            int b = find(p, ev[idx]);
            if (a != b) {
                if (-p[a] < -p[b]) { int t = a; a = b; b = t; }
                p[a] += p[b];
                p[b] = a;
                totalCost += ew[idx];
                taken++;
            }
        }
        System.out.println(taken == n - 1 ? totalCost : "IMPOSSIBLE");
    }
}`,
    python3: `import sys

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.buffer.read().split()
    if not data:
        return
    it = iter(data)
    n = int(next(it))
    m = int(next(it))

    edges = []
    for _ in range(m):
        u = int(next(it))
        v = int(next(it))
        w = int(next(it))
        edges.append((w, u, v))

    edges.sort(key=lambda e: e[0])
    p = [-1] * (n + 1)

    def find(x: int) -> int:
        r = x
        while p[r] >= 0:
            r = p[r]
        while x != r:
            p[x], x = r, p[x]
        return r

    total_cost = 0
    taken = 0
    for w, u, v in edges:
        a = find(u)
        b = find(v)
        if a != b:
            if -p[a] < -p[b]:
                a, b = b, a
            p[a] += p[b]
            p[b] = a
            total_cost += w
            taken += 1

    print(total_cost if taken == n - 1 else "IMPOSSIBLE")

if __name__ == "__main__":
    solve()`,
    ruby: `data = STDIN.read.split.map(&:to_i)
exit if data.empty?
idx = 0
n = data[idx]; m = data[idx + 1]; idx += 2

edges = Array.new(m) do
  u = data[idx]; v = data[idx + 1]; w = data[idx + 2]; idx += 3
  [w, u, v]
end
edges.sort_by! { |e| e[0] }

p = Array.new(n + 1, -1)
find = ->(x) do
  r = x
  r = p[r] while p[r] >= 0
  while x != r
    nxt = p[x]
    p[x] = r
    x = nxt
  end
  r
end

total_cost = 0
taken = 0
edges.each do |w, u, v|
  a = find.call(u)
  b = find.call(v)
  next if a == b
  a, b = b, a if -p[a] < -p[b]
  p[a] += p[b]
  p[b] = a
  total_cost += w
  taken += 1
end

puts(taken == n - 1 ? total_cost : "IMPOSSIBLE")`,
  },
  practiceProblems: [
    {
      id: 'gr32-p1',
      tier: 'Warmup',
      ratingRange: '1300–1450',
      title: 'Road Reparation (Minimum Spanning Tree Total Cost)',
      statement:
        'There are N cities and M bidirectional candidate roads, each with reparation cost C. Find the minimum total cost to make every city reachable from every other city, or output `IMPOSSIBLE`.',
      constraints: '1 <= N <= 10^5, 1 <= M <= 2*10^5, 1 <= C <= 10^9.',
      sampleInput: `5 6
1 2 3
2 3 5
2 4 2
3 4 8
5 1 7
5 4 4`,
      sampleOutput: `14`,
      hints: [
        'Sort all M roads in ascending order of cost C and greedily merge endpoints using DSU.',
        'Keep a counter of accepted edges; if it does not equal N - 1 after processing all edges, print `IMPOSSIBLE`.',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    if (!(cin >> n >> m)) return 0;
    struct E { int u, v; long long w; };
    vector<E> e(m);
    for (int i = 0; i < m; ++i) cin >> e[i].u >> e[i].v >> e[i].w;
    sort(e.begin(), e.end(), [](const E& a, const E& b) { return a.w < b.w; });
    vector<int> p(n + 1, -1);
    auto find = [&](int x) {
        int r = x; while (p[r] >= 0) r = p[r];
        while (x != r) { int nx = p[x]; p[x] = r; x = nx; }
        return r;
    };
    long long cost = 0; int taken = 0;
    for (auto& ed : e) {
        int a = find(ed.u), b = find(ed.v);
        if (a != b) {
            if (-p[a] < -p[b]) swap(a, b);
            p[a] += p[b]; p[b] = a;
            cost += ed.w; taken++;
        }
    }
    if (taken == n - 1) cout << cost << '\\n';
    else cout << "IMPOSSIBLE\\n";
    return 0;
}`,
        rust: `use std::io::{self, Read};

fn find(p: &mut [i32], mut x: usize) -> usize {
    let mut r = x;
    while p[r] >= 0 { r = p[r] as usize; }
    while x != r {
        let nx = p[x] as usize;
        p[x] = r as i32;
        x = nx;
    }
    r
}

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let n: usize = match it.next() { Some(x) => x.parse().unwrap(), None => return };
    let m: usize = it.next().unwrap().parse().unwrap();
    let mut edges = Vec::with_capacity(m);
    for _ in 0..m {
        let u: usize = it.next().unwrap().parse().unwrap();
        let v: usize = it.next().unwrap().parse().unwrap();
        let w: i64 = it.next().unwrap().parse().unwrap();
        edges.push((w, u, v));
    }
    edges.sort_unstable_by_key(|x| x.0);
    let mut p = vec![-1i32; n + 1];
    let (mut cost, mut taken) = (0i64, 0usize);
    for (w, u, v) in edges {
        let mut a = find(&mut p, u);
        let mut b = find(&mut p, v);
        if a != b {
            if -p[a] < -p[b] { std::mem::swap(&mut a, &mut b); }
            p[a] += p[b]; p[b] = a as i32;
            cost += w; taken += 1;
        }
    }
    if taken == n - 1 { println!("{}", cost); } else { println!("IMPOSSIBLE"); }
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

    static int find(int[] p, int x) {
        int r = x; while (p[r] >= 0) r = p[r];
        while (x != r) { int nx = p[x]; p[x] = r; x = nx; }
        return r;
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        long f = fs.nextLong(); if (f == Long.MIN_VALUE) return;
        int n = (int) f, m = fs.nextInt();
        int[] u = new int[m], v = new int[m]; long[] w = new long[m]; Integer[] ord = new Integer[m];
        for (int i = 0; i < m; i++) { u[i] = fs.nextInt(); v[i] = fs.nextInt(); w[i] = fs.nextLong(); ord[i] = i; }
        Arrays.sort(ord, Comparator.comparingLong(i -> w[i]));
        int[] p = new int[n + 1]; Arrays.fill(p, -1);
        long cost = 0; int taken = 0;
        for (int i : ord) {
            int a = find(p, u[i]), b = find(p, v[i]);
            if (a != b) {
                if (-p[a] < -p[b]) { int t = a; a = b; b = t; }
                p[a] += p[b]; p[b] = a; cost += w[i]; taken++;
            }
        }
        System.out.println(taken == n - 1 ? cost : "IMPOSSIBLE");
    }
}`,
        python3: `import sys
sys.setrecursionlimit(200000)

def solve():
    data = sys.stdin.buffer.read().split()
    if not data: return
    it = iter(data)
    n, m = int(next(it)), int(next(it))
    edges = [(int(next(it)), int(next(it)), int(next(it))) for _ in range(m)]
    edges.sort(key=lambda e: e[2])
    p = [-1] * (n + 1)
    def find(x):
        r = x
        while p[r] >= 0: r = p[r]
        while x != r: p[x], x = r, p[x]
        return r
    cost = taken = 0
    for u, v, w in edges:
        a, b = find(u), find(v)
        if a != b:
            if -p[a] < -p[b]: a, b = b, a
            p[a] += p[b]; p[b] = a
            cost += w; taken += 1
    print(cost if taken == n - 1 else "IMPOSSIBLE")

if __name__ == "__main__":
    solve()`,
        ruby: `data = STDIN.read.split.map(&:to_i)
exit if data.empty?
idx = 0; n = data[idx]; m = data[idx + 1]; idx += 2
edges = Array.new(m) { u = data[idx]; v = data[idx + 1]; w = data[idx + 2]; idx += 3; [w, u, v] }
edges.sort_by! { |e| e[0] }
p = Array.new(n + 1, -1)
find = ->(x) { r = x; r = p[r] while p[r] >= 0; while x != r; nx = p[x]; p[x] = r; x = nx; end; r }
cost = 0; taken = 0
edges.each do |w, u, v|
  a = find.call(u); b = find.call(v)
  next if a == b
  a, b = b, a if -p[a] < -p[b]
  p[a] += p[b]; p[b] = a; cost += w; taken += 1
end
puts(taken == n - 1 ? cost : "IMPOSSIBLE")`,
      },
    },
    {
      id: 'gr32-p2',
      tier: 'Standard',
      ratingRange: '1600–1750',
      title: 'Minimum Spanning Tree for Each Mandatory Edge (CF 609E)',
      statement:
        'Given a connected weighted undirected graph with N vertices and M edges, output M lines: for the i-th edge (1..M), determine the minimum possible weight of a spanning tree forced to include edge i.',
      constraints: '2 <= N <= 2*10^5, N - 1 <= M <= 2*10^5, 1 <= w_i <= 10^9.',
      sampleInput: `5 7
1 2 3
1 3 1
1 4 5
2 3 2
2 5 3
3 4 2
4 5 4`,
      sampleOutput: `9
8
11
8
8
8
9`,
      hints: [
        'Build ONE global MST of total weight `mstCost`. If edge i is already in this MST, its answer is simply `mstCost`.',
        'If edge i = (u, v, w) is NOT in the MST, forcing it into the tree creates a unique cycle with the MST path from u to v. Removing the single heaviest edge on that MST path gives `mstCost + w - maxEdgeOnPath(u, v)`, computed in O(log N) via Binary Lifting!',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    if (!(cin >> n >> m)) return 0;
    struct E { int u, v, id; long long w; };
    vector<E> edges(m);
    for (int i = 0; i < m; ++i) {
        cin >> edges[i].u >> edges[i].v >> edges[i].w;
        edges[i].id = i;
    }
    vector<E> sorted = edges;
    sort(sorted.begin(), sorted.end(), [](const E& a, const E& b) { return a.w < b.w; });
    vector<int> p(n + 1, -1);
    auto find = [&](int x) {
        int r = x; while (p[r] >= 0) r = p[r];
        while (x != r) { int nx = p[x]; p[x] = r; x = nx; }
        return r;
    };
    vector<char> inMst(m, 0);
    vector<vector<pair<int, long long>>> tree(n + 1);
    long long mstCost = 0;
    for (const auto& ed : sorted) {
        int a = find(ed.u), b = find(ed.v);
        if (a != b) {
            if (-p[a] < -p[b]) swap(a, b);
            p[a] += p[b]; p[b] = a;
            inMst[ed.id] = 1;
            mstCost += ed.w;
            tree[ed.u].push_back({ed.v, ed.w});
            tree[ed.v].push_back({ed.u, ed.w});
        }
    }

    const int LOG = 19;
    vector<vector<int>> up(LOG, vector<int>(n + 1, 1));
    vector<vector<long long>> mx(LOG, vector<long long>(n + 1, 0));
    vector<int> depth(n + 1, 0), order;
    order.reserve(n);
    vector<int> parent(n + 1, 0);
    order.push_back(1);
    for (size_t idx = 0; idx < order.size(); ++idx) {
        int u = order[idx];
        for (auto [v, w] : tree[u]) {
            if (v == parent[u]) continue;
            parent[v] = u;
            depth[v] = depth[u] + 1;
            up[0][v] = u;
            mx[0][v] = w;
            order.push_back(v);
        }
    }
    for (int k = 1; k < LOG; ++k) {
        for (int v = 1; v <= n; ++v) {
            int mid = up[k - 1][v];
            up[k][v] = up[k - 1][mid];
            mx[k][v] = max(mx[k - 1][v], mx[k - 1][mid]);
        }
    }

    auto maxPath = [&](int u, int v) {
        long long res = 0;
        if (depth[u] < depth[v]) swap(u, v);
        int diff = depth[u] - depth[v];
        for (int k = 0; k < LOG; ++k) {
            if ((diff >> k) & 1) { res = max(res, mx[k][u]); u = up[k][u]; }
        }
        if (u == v) return res;
        for (int k = LOG - 1; k >= 0; --k) {
            if (up[k][u] != up[k][v]) {
                res = max({res, mx[k][u], mx[k][v]});
                u = up[k][u]; v = up[k][v];
            }
        }
        return max({res, mx[0][u], mx[0][v]});
    };

    for (int i = 0; i < m; ++i) {
        if (inMst[i]) cout << mstCost << '\\n';
        else cout << mstCost + edges[i].w - maxPath(edges[i].u, edges[i].v) << '\\n';
    }
    return 0;
}`,
        rust: `use std::io::{self, Read};

fn find(p: &mut [i32], mut x: usize) -> usize {
    let mut r = x;
    while p[r] >= 0 { r = p[r] as usize; }
    while x != r { let nx = p[x] as usize; p[x] = r as i32; x = nx; }
    r
}

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let n: usize = match it.next() { Some(x) => x.parse().unwrap(), None => return };
    let m: usize = it.next().unwrap().parse().unwrap();
    let mut edges = Vec::with_capacity(m);
    for id in 0..m {
        let u: usize = it.next().unwrap().parse().unwrap();
        let v: usize = it.next().unwrap().parse().unwrap();
        let w: i64 = it.next().unwrap().parse().unwrap();
        edges.push((w, u, v, id));
    }
    let mut sorted = edges.clone();
    sorted.sort_unstable_by_key(|e| e.0);
    let mut p = vec![-1i32; n + 1];
    let mut in_mst = vec![false; m];
    let mut tree = vec![Vec::<(usize, i64)>::new(); n + 1];
    let mut mst_cost = 0i64;
    for &(w, u, v, id) in &sorted {
        let mut a = find(&mut p, u);
        let mut b = find(&mut p, v);
        if a != b {
            if -p[a] < -p[b] { std::mem::swap(&mut a, &mut b); }
            p[a] += p[b]; p[b] = a as i32;
            in_mst[id] = true; mst_cost += w;
            tree[u].push((v, w)); tree[v].push((u, w));
        }
    }
    const LOG: usize = 19;
    let mut up = vec![vec![1usize; n + 1]; LOG];
    let mut mx = vec![vec![0i64; n + 1]; LOG];
    let mut depth = vec![0usize; n + 1];
    let mut parent = vec![0usize; n + 1];
    let mut order = Vec::with_capacity(n);
    order.push(1);
    for idx in 0..n {
        let u = order[idx];
        for &(v, w) in &tree[u] {
            if v == parent[u] { continue; }
            parent[v] = u; depth[v] = depth[u] + 1;
            up[0][v] = u; mx[0][v] = w;
            order.push(v);
        }
    }
    for k in 1..LOG {
        for v in 1..=n {
            let mid = up[k - 1][v];
            up[k][v] = up[k - 1][mid];
            mx[k][v] = mx[k - 1][v].max(mx[k - 1][mid]);
        }
    }
    let mut out = String::new();
    for &(w, mut u, mut v, id) in &edges {
        if in_mst[id] {
            out.push_str(&format!("{}\\n", mst_cost));
        } else {
            let mut res = 0i64;
            if depth[u] < depth[v] { std::mem::swap(&mut u, &mut v); }
            let diff = depth[u] - depth[v];
            for k in 0..LOG {
                if ((diff >> k) & 1) == 1 { res = res.max(mx[k][u]); u = up[k][u]; }
            }
            if u != v {
                for k in (0..LOG).rev() {
                    if up[k][u] != up[k][v] {
                        res = res.max(mx[k][u]).max(mx[k][v]);
                        u = up[k][u]; v = up[k][v];
                    }
                }
                res = res.max(mx[0][u]).max(mx[0][v]);
            }
            out.push_str(&format!("{}\\n", mst_cost + w - res));
        }
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

    static int find(int[] p, int x) {
        int r = x; while (p[r] >= 0) r = p[r];
        while (x != r) { int nx = p[x]; p[x] = r; x = nx; }
        return r;
    }

    @SuppressWarnings("unchecked")
    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        long f = fs.nextLong(); if (f == Long.MIN_VALUE) return;
        int n = (int) f, m = fs.nextInt();
        int[] eu = new int[m], ev = new int[m]; long[] ew = new long[m]; Integer[] ord = new Integer[m];
        for (int i = 0; i < m; i++) { eu[i] = fs.nextInt(); ev[i] = fs.nextInt(); ew[i] = fs.nextLong(); ord[i] = i; }
        Arrays.sort(ord, Comparator.comparingLong(i -> ew[i]));
        int[] p = new int[n + 1]; Arrays.fill(p, -1);
        boolean[] inMst = new boolean[m];
        ArrayList<long[]>[] tree = new ArrayList[n + 1];
        for (int i = 1; i <= n; i++) tree[i] = new ArrayList<>();
        long mstCost = 0;
        for (int id : ord) {
            int a = find(p, eu[id]), b = find(p, ev[id]);
            if (a != b) {
                if (-p[a] < -p[b]) { int t = a; a = b; b = t; }
                p[a] += p[b]; p[b] = a; inMst[id] = true; mstCost += ew[id];
                tree[eu[id]].add(new long[]{ev[id], ew[id]});
                tree[ev[id]].add(new long[]{eu[id], ew[id]});
            }
        }
        final int LOG = 19;
        int[][] up = new int[LOG][n + 1];
        long[][] mx = new long[LOG][n + 1];
        int[] depth = new int[n + 1], parent = new int[n + 1], order = new int[n];
        int head = 0, tail = 0; order[tail++] = 1; up[0][1] = 1;
        while (head < tail) {
            int u = order[head++];
            for (long[] ed : tree[u]) {
                int v = (int) ed[0]; long w = ed[1];
                if (v == parent[u]) continue;
                parent[v] = u; depth[v] = depth[u] + 1; up[0][v] = u; mx[0][v] = w;
                order[tail++] = v;
            }
        }
        for (int k = 1; k < LOG; k++)
            for (int v = 1; v <= n; v++) {
                int mid = up[k - 1][v];
                up[k][v] = up[k - 1][mid];
                mx[k][v] = Math.max(mx[k - 1][v], mx[k - 1][mid]);
            }
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < m; i++) {
            if (inMst[i]) { sb.append(mstCost).append('\\n'); continue; }
            int u = eu[i], v = ev[i]; long res = 0;
            if (depth[u] < depth[v]) { int t = u; u = v; v = t; }
            int diff = depth[u] - depth[v];
            for (int k = 0; k < LOG; k++) if (((diff >> k) & 1) == 1) { res = Math.max(res, mx[k][u]); u = up[k][u]; }
            if (u != v) {
                for (int k = LOG - 1; k >= 0; k--)
                    if (up[k][u] != up[k][v]) {
                        res = Math.max(res, Math.max(mx[k][u], mx[k][v]));
                        u = up[k][u]; v = up[k][v];
                    }
                res = Math.max(res, Math.max(mx[0][u], mx[0][v]));
            }
            sb.append(mstCost + ew[i] - res).append('\\n');
        }
        System.out.print(sb);
    }
}`,
        python3: `import sys
sys.setrecursionlimit(200000)

def solve():
    data = sys.stdin.buffer.read().split()
    if not data: return
    it = iter(data)
    n, m = int(next(it)), int(next(it))
    edges = [(int(next(it)), int(next(it)), int(next(it)), i) for i in range(m)]
    sorted_e = sorted(edges, key=lambda e: e[2])
    p = [-1] * (n + 1)
    def find(x):
        r = x
        while p[r] >= 0: r = p[r]
        while x != r: p[x], x = r, p[x]
        return r
    in_mst = [False] * m
    tree = [[] for _ in range(n + 1)]
    mst_cost = 0
    for u, v, w, idx in sorted_e:
        a, b = find(u), find(v)
        if a != b:
            if -p[a] < -p[b]: a, b = b, a
            p[a] += p[b]; p[b] = a
            in_mst[idx] = True; mst_cost += w
            tree[u].append((v, w)); tree[v].append((u, w))
    LOG = 19
    up = [[1] * (n + 1) for _ in range(LOG)]
    mx = [[0] * (n + 1) for _ in range(LOG)]
    depth = [0] * (n + 1); parent = [0] * (n + 1)
    order = [1]
    for u in order:
        for v, w in tree[u]:
            if v == parent[u]: continue
            parent[v] = u; depth[v] = depth[u] + 1
            up[0][v] = u; mx[0][v] = w; order.append(v)
    for k in range(1, LOG):
        up_prev, up_cur = up[k - 1], up[k]
        mx_prev, mx_cur = mx[k - 1], mx[k]
        for v in range(1, n + 1):
            mid = up_prev[v]
            up_cur[v] = up_prev[mid]
            a, b = mx_prev[v], mx_prev[mid]
            mx_cur[v] = a if a > b else b
    out = []
    for u, v, w, idx in edges:
        if in_mst[idx]:
            out.append(str(mst_cost))
            continue
        res = 0
        if depth[u] < depth[v]: u, v = v, u
        diff = depth[u] - depth[v]
        for k in range(LOG):
            if (diff >> k) & 1:
                if mx[k][u] > res: res = mx[k][u]
                u = up[k][u]
        if u != v:
            for k in range(LOG - 1, -1, -1):
                if up[k][u] != up[k][v]:
                    if mx[k][u] > res: res = mx[k][u]
                    if mx[k][v] > res: res = mx[k][v]
                    u = up[k][u]; v = up[k][v]
            if mx[0][u] > res: res = mx[0][u]
            if mx[0][v] > res: res = mx[0][v]
        out.append(str(mst_cost + w - res))
    sys.stdout.write("\\n".join(out) + "\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `data = STDIN.read.split.map(&:to_i)
exit if data.empty?
idx = 0; n = data[idx]; m = data[idx + 1]; idx += 2
edges = Array.new(m) do |id|
  u = data[idx]; v = data[idx + 1]; w = data[idx + 2]; idx += 3
  [u, v, w, id]
end
sorted_e = edges.sort_by { |e| e[2] }
p = Array.new(n + 1, -1)
find = ->(x) { r = x; r = p[r] while p[r] >= 0; while x != r; nx = p[x]; p[x] = r; x = nx; end; r }
in_mst = Array.new(m, false)
tree = Array.new(n + 1) { [] }
mst_cost = 0
sorted_e.each do |u, v, w, id|
  a = find.call(u); b = find.call(v)
  next if a == b
  a, b = b, a if -p[a] < -p[b]
  p[a] += p[b]; p[b] = a; in_mst[id] = true; mst_cost += w
  tree[u] << [v, w]; tree[v] << [u, w]
end
log = 19
up = Array.new(log) { Array.new(n + 1, 1) }
mx = Array.new(log) { Array.new(n + 1, 0) }
depth = Array.new(n + 1, 0); parent = Array.new(n + 1, 0)
order = [1]; head = 0
while head < order.size
  u = order[head]; head += 1
  tree[u].each do |v, w|
    next if v == parent[u]
    parent[v] = u; depth[v] = depth[u] + 1; up[0][v] = u; mx[0][v] = w; order << v
  end
end
(1...log).each do |k|
  (1..n).each do |v|
    mid = up[k - 1][v]
    up[k][v] = up[k - 1][mid]
    a = mx[k - 1][v]; b = mx[k - 1][mid]
    mx[k][v] = a > b ? a : b
  end
end
out = edges.map do |u, v, w, id|
  if in_mst[id]
    mst_cost
  else
    res = 0
    u, v = v, u if depth[u] < depth[v]
    diff = depth[u] - depth[v]
    log.times { |k| if ((diff >> k) & 1) == 1; res = mx[k][u] if mx[k][u] > res; u = up[k][u]; end }
    if u != v
      (log - 1).downto(0) do |k|
        if up[k][u] != up[k][v]
          res = mx[k][u] if mx[k][u] > res
          res = mx[k][v] if mx[k][v] > res
          u = up[k][u]; v = up[k][v]
        end
      end
      res = mx[0][u] if mx[0][u] > res
      res = mx[0][v] if mx[0][v] > res
    end
    mst_cost + w - res
  end
end
puts out.join("\\n")`,
      },
    },
    {
      id: 'gr32-p3',
      tier: 'Boss',
      ratingRange: '1850–2050',
      title: 'Strictly Second Best Minimum Spanning Tree (Dual-Max Binary Lifting)',
      statement:
        'Given a connected weighted undirected graph with N vertices and M edges, find the weight of the STRICTLY second-best spanning tree (minimum spanning tree weight strictly greater than the global MST weight), or output -1 if none exists.',
      constraints: '2 <= N <= 10^5, N - 1 <= M <= 3*10^5, 1 <= w_i <= 10^9.',
      sampleInput: `4 5
1 2 1
2 3 2
3 4 3
1 3 2
2 4 4`,
      sampleOutput: `7`,
      hints: [
        'For every non-MST edge (u, v, w), swapping it with the largest edge on the MST path (u, v) leaves the tree weight unchanged if `max1 == w`!',
        'Track BOTH `(max1, max2)`—the largest and strictly second-largest edge weights—on every binary lifting jump! If `max1 < w`, candidate is `mstCost + w - max1`; else if `max2 != -1`, candidate is `mstCost + w - max2`.',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

static pair<long long, long long> mergeTop2(pair<long long, long long> a, pair<long long, long long> b) {
    long long vals[4] = {a.first, a.second, b.first, b.second};
    long long m1 = -1, m2 = -1;
    for (long long v : vals) {
        if (v > m1) { m2 = m1; m1 = v; }
        else if (v < m1 && v > m2) { m2 = v; }
    }
    return {m1, m2};
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    if (!(cin >> n >> m)) return 0;
    struct E { int u, v; long long w; char used; };
    vector<E> edges(m);
    for (int i = 0; i < m; ++i) {
        cin >> edges[i].u >> edges[i].v >> edges[i].w;
        edges[i].used = 0;
    }
    sort(edges.begin(), edges.end(), [](const E& a, const E& b) { return a.w < b.w; });

    vector<int> p(n + 1, -1);
    auto find = [&](int x) {
        int r = x; while (p[r] >= 0) r = p[r];
        while (x != r) { int nx = p[x]; p[x] = r; x = nx; }
        return r;
    };
    vector<vector<pair<int, long long>>> tree(n + 1);
    long long mstCost = 0;
    int taken = 0;
    for (auto& e : edges) {
        int a = find(e.u), b = find(e.v);
        if (a != b) {
            if (-p[a] < -p[b]) swap(a, b);
            p[a] += p[b]; p[b] = a;
            e.used = 1; mstCost += e.w; taken++;
            tree[e.u].push_back({e.v, e.w});
            tree[e.v].push_back({e.u, e.w});
        }
    }
    if (taken < n - 1) { cout << -1 << '\\n'; return 0; }

    const int LOG = 18;
    vector<vector<int>> up(LOG, vector<int>(n + 1, 1));
    vector<vector<pair<long long, long long>>> top2(LOG, vector<pair<long long, long long>>(n + 1, {-1, -1}));
    vector<int> depth(n + 1, 0), parent(n + 1, 0), order = {1};
    for (size_t i = 0; i < order.size(); ++i) {
        int u = order[i];
        for (auto [v, w] : tree[u]) {
            if (v == parent[u]) continue;
            parent[v] = u; depth[v] = depth[u] + 1;
            up[0][v] = u; top2[0][v] = {w, -1};
            order.push_back(v);
        }
    }
    for (int k = 1; k < LOG; ++k) {
        for (int v = 1; v <= n; ++v) {
            int mid = up[k - 1][v];
            up[k][v] = up[k - 1][mid];
            top2[k][v] = mergeTop2(top2[k - 1][v], top2[k - 1][mid]);
        }
    }

    const long long INF = 4'000'000'000'000'000'000LL;
    long long ans = INF;
    for (const auto& e : edges) {
        if (e.used) continue;
        int u = e.u, v = e.v;
        pair<long long, long long> path = {-1, -1};
        if (depth[u] < depth[v]) swap(u, v);
        int diff = depth[u] - depth[v];
        for (int k = 0; k < LOG; ++k) {
            if ((diff >> k) & 1) { path = mergeTop2(path, top2[k][u]); u = up[k][u]; }
        }
        if (u != v) {
            for (int k = LOG - 1; k >= 0; --k) {
                if (up[k][u] != up[k][v]) {
                    path = mergeTop2(path, mergeTop2(top2[k][u], top2[k][v]));
                    u = up[k][u]; v = up[k][v];
                }
            }
            path = mergeTop2(path, mergeTop2(top2[0][u], top2[0][v]));
        }
        if (path.first != -1 && path.first < e.w) ans = min(ans, mstCost + e.w - path.first);
        else if (path.second != -1 && path.second < e.w) ans = min(ans, mstCost + e.w - path.second);
    }
    cout << (ans == INF ? -1 : ans) << '\\n';
    return 0;
}`,
        rust: `use std::io::{self, Read};

fn find(p: &mut [i32], mut x: usize) -> usize {
    let mut r = x;
    while p[r] >= 0 { r = p[r] as usize; }
    while x != r { let nx = p[x] as usize; p[x] = r as i32; x = nx; }
    r
}

fn merge_top2(a: (i64, i64), b: (i64, i64)) -> (i64, i64) {
    let vals = [a.0, a.1, b.0, b.1];
    let (mut m1, mut m2) = (-1i64, -1i64);
    for v in vals {
        if v > m1 { m2 = m1; m1 = v; }
        else if v < m1 && v > m2 { m2 = v; }
    }
    (m1, m2)
}

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let n: usize = match it.next() { Some(x) => x.parse().unwrap(), None => return };
    let m: usize = it.next().unwrap().parse().unwrap();
    let mut edges = Vec::with_capacity(m);
    for _ in 0..m {
        let u: usize = it.next().unwrap().parse().unwrap();
        let v: usize = it.next().unwrap().parse().unwrap();
        let w: i64 = it.next().unwrap().parse().unwrap();
        edges.push((w, u, v, false));
    }
    edges.sort_unstable_by_key(|e| e.0);
    let mut p = vec![-1i32; n + 1];
    let mut tree = vec![Vec::<(usize, i64)>::new(); n + 1];
    let (mut mst_cost, mut taken) = (0i64, 0usize);
    for e in &mut edges {
        let mut a = find(&mut p, e.1);
        let mut b = find(&mut p, e.2);
        if a != b {
            if -p[a] < -p[b] { std::mem::swap(&mut a, &mut b); }
            p[a] += p[b]; p[b] = a as i32;
            e.3 = true; mst_cost += e.0; taken += 1;
            tree[e.1].push((e.2, e.0)); tree[e.2].push((e.1, e.0));
        }
    }
    if taken < n - 1 { println!("-1"); return; }
    const LOG: usize = 18;
    let mut up = vec![vec![1usize; n + 1]; LOG];
    let mut top2 = vec![vec![(-1i64, -1i64); n + 1]; LOG];
    let mut depth = vec![0usize; n + 1];
    let mut parent = vec![0usize; n + 1];
    let mut order = Vec::with_capacity(n);
    order.push(1);
    for idx in 0..n {
        let u = order[idx];
        for &(v, w) in &tree[u] {
            if v == parent[u] { continue; }
            parent[v] = u; depth[v] = depth[u] + 1;
            up[0][v] = u; top2[0][v] = (w, -1); order.push(v);
        }
    }
    for k in 1..LOG {
        for v in 1..=n {
            let mid = up[k - 1][v];
            up[k][v] = up[k - 1][mid];
            top2[k][v] = merge_top2(top2[k - 1][v], top2[k - 1][mid]);
        }
    }
    const INF: i64 = 4_000_000_000_000_000_000;
    let mut ans = INF;
    for &(w, mut u, mut v, used) in &edges {
        if used { continue; }
        let mut path = (-1i64, -1i64);
        if depth[u] < depth[v] { std::mem::swap(&mut u, &mut v); }
        let diff = depth[u] - depth[v];
        for k in 0..LOG {
            if ((diff >> k) & 1) == 1 { path = merge_top2(path, top2[k][u]); u = up[k][u]; }
        }
        if u != v {
            for k in (0..LOG).rev() {
                if up[k][u] != up[k][v] {
                    path = merge_top2(path, merge_top2(top2[k][u], top2[k][v]));
                    u = up[k][u]; v = up[k][v];
                }
            }
            path = merge_top2(path, merge_top2(top2[0][u], top2[0][v]));
        }
        if path.0 != -1 && path.0 < w { ans = ans.min(mst_cost + w - path.0); }
        else if path.1 != -1 && path.1 < w { ans = ans.min(mst_cost + w - path.1); }
    }
    println!("{}", if ans == INF { -1 } else { ans });
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

    static int find(int[] p, int x) {
        int r = x; while (p[r] >= 0) r = p[r];
        while (x != r) { int nx = p[x]; p[x] = r; x = nx; }
        return r;
    }

    static long[] mergeTop2(long a1, long a2, long b1, long b2) {
        long[] vals = {a1, a2, b1, b2};
        long m1 = -1, m2 = -1;
        for (long v : vals) {
            if (v > m1) { m2 = m1; m1 = v; }
            else if (v < m1 && v > m2) { m2 = v; }
        }
        return new long[]{m1, m2};
    }

    @SuppressWarnings("unchecked")
    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        long f = fs.nextLong(); if (f == Long.MIN_VALUE) return;
        int n = (int) f, m = fs.nextInt();
        int[] eu = new int[m], ev = new int[m]; long[] ew = new long[m]; Integer[] ord = new Integer[m];
        for (int i = 0; i < m; i++) { eu[i] = fs.nextInt(); ev[i] = fs.nextInt(); ew[i] = fs.nextLong(); ord[i] = i; }
        Arrays.sort(ord, Comparator.comparingLong(i -> ew[i]));
        int[] p = new int[n + 1]; Arrays.fill(p, -1);
        boolean[] used = new boolean[m];
        ArrayList<long[]>[] tree = new ArrayList[n + 1];
        for (int i = 1; i <= n; i++) tree[i] = new ArrayList<>();
        long mstCost = 0; int taken = 0;
        for (int id : ord) {
            int a = find(p, eu[id]), b = find(p, ev[id]);
            if (a != b) {
                if (-p[a] < -p[b]) { int t = a; a = b; b = t; }
                p[a] += p[b]; p[b] = a; used[id] = true; mstCost += ew[id]; taken++;
                tree[eu[id]].add(new long[]{ev[id], ew[id]});
                tree[ev[id]].add(new long[]{eu[id], ew[id]});
            }
        }
        if (taken < n - 1) { System.out.println(-1); return; }
        final int LOG = 18;
        int[][] up = new int[LOG][n + 1];
        long[][] mx1 = new long[LOG][n + 1], mx2 = new long[LOG][n + 1];
        for (int k = 0; k < LOG; k++) { Arrays.fill(mx1[k], -1); Arrays.fill(mx2[k], -1); }
        int[] depth = new int[n + 1], parent = new int[n + 1], order = new int[n];
        int hd = 0, tl = 0; order[tl++] = 1; up[0][1] = 1;
        while (hd < tl) {
            int u = order[hd++];
            for (long[] ed : tree[u]) {
                int v = (int) ed[0]; long w = ed[1];
                if (v == parent[u]) continue;
                parent[v] = u; depth[v] = depth[u] + 1; up[0][v] = u; mx1[0][v] = w;
                order[tl++] = v;
            }
        }
        for (int k = 1; k < LOG; k++)
            for (int v = 1; v <= n; v++) {
                int mid = up[k - 1][v];
                up[k][v] = up[k - 1][mid];
                long[] mg = mergeTop2(mx1[k - 1][v], mx2[k - 1][v], mx1[k - 1][mid], mx2[k - 1][mid]);
                mx1[k][v] = mg[0]; mx2[k][v] = mg[1];
            }
        final long INF = 4_000_000_000_000_000_000L;
        long ans = INF;
        for (int id = 0; id < m; id++) {
            if (used[id]) continue;
            int u = eu[id], v = ev[id]; long w = ew[id];
            long p1 = -1, p2 = -1;
            if (depth[u] < depth[v]) { int t = u; u = v; v = t; }
            int diff = depth[u] - depth[v];
            for (int k = 0; k < LOG; k++) if (((diff >> k) & 1) == 1) {
                long[] mg = mergeTop2(p1, p2, mx1[k][u], mx2[k][u]);
                p1 = mg[0]; p2 = mg[1]; u = up[k][u];
            }
            if (u != v) {
                for (int k = LOG - 1; k >= 0; k--) if (up[k][u] != up[k][v]) {
                    long[] mA = mergeTop2(mx1[k][u], mx2[k][u], mx1[k][v], mx2[k][v]);
                    long[] mg = mergeTop2(p1, p2, mA[0], mA[1]);
                    p1 = mg[0]; p2 = mg[1]; u = up[k][u]; v = up[k][v];
                }
                long[] mA = mergeTop2(mx1[0][u], mx2[0][u], mx1[0][v], mx2[0][v]);
                long[] mg = mergeTop2(p1, p2, mA[0], mA[1]);
                p1 = mg[0]; p2 = mg[1];
            }
            if (p1 != -1 && p1 < w) ans = Math.min(ans, mstCost + w - p1);
            else if (p2 != -1 && p2 < w) ans = Math.min(ans, mstCost + w - p2);
        }
        System.out.println(ans == INF ? -1 : ans);
    }
}`,
        python3: `import sys
sys.setrecursionlimit(200000)

def merge_top2(a1, a2, b1, b2):
    m1 = m2 = -1
    for v in (a1, a2, b1, b2):
        if v > m1: m2, m1 = m1, v
        elif v < m1 and v > m2: m2 = v
    return m1, m2

def solve():
    data = sys.stdin.buffer.read().split()
    if not data: return
    it = iter(data)
    n, m = int(next(it)), int(next(it))
    edges = [(int(next(it)), int(next(it)), int(next(it))) for _ in range(m)]
    edges.sort(key=lambda e: e[2])
    p = [-1] * (n + 1)
    def find(x):
        r = x
        while p[r] >= 0: r = p[r]
        while x != r: p[x], x = r, p[x]
        return r
    used = [False] * m
    tree = [[] for _ in range(n + 1)]
    mst_cost = taken = 0
    for idx, (u, v, w) in enumerate(edges):
        a, b = find(u), find(v)
        if a != b:
            if -p[a] < -p[b]: a, b = b, a
            p[a] += p[b]; p[b] = a
            used[idx] = True; mst_cost += w; taken += 1
            tree[u].append((v, w)); tree[v].append((u, w))
    if taken < n - 1: print(-1); return
    LOG = 18
    up = [[1] * (n + 1) for _ in range(LOG)]
    mx1 = [[-1] * (n + 1) for _ in range(LOG)]
    mx2 = [[-1] * (n + 1) for _ in range(LOG)]
    depth = [0] * (n + 1); parent = [0] * (n + 1)
    order = [1]
    for u in order:
        for v, w in tree[u]:
            if v == parent[u]: continue
            parent[v] = u; depth[v] = depth[u] + 1
            up[0][v] = u; mx1[0][v] = w; order.append(v)
    for k in range(1, LOG):
        for v in range(1, n + 1):
            mid = up[k - 1][v]
            up[k][v] = up[k - 1][mid]
            mx1[k][v], mx2[k][v] = merge_top2(mx1[k - 1][v], mx2[k - 1][v], mx1[k - 1][mid], mx2[k - 1][mid])
    INF = 4 * 10**18
    ans = INF
    for idx, (u, v, w) in enumerate(edges):
        if used[idx]: continue
        p1 = p2 = -1
        if depth[u] < depth[v]: u, v = v, u
        diff = depth[u] - depth[v]
        for k in range(LOG):
            if (diff >> k) & 1:
                p1, p2 = merge_top2(p1, p2, mx1[k][u], mx2[k][u])
                u = up[k][u]
        if u != v:
            for k in range(LOG - 1, -1, -1):
                if up[k][u] != up[k][v]:
                    m1, m2 = merge_top2(mx1[k][u], mx2[k][u], mx1[k][v], mx2[k][v])
                    p1, p2 = merge_top2(p1, p2, m1, m2)
                    u, v = up[k][u], up[k][v]
            m1, m2 = merge_top2(mx1[0][u], mx2[0][u], mx1[0][v], mx2[0][v])
            p1, p2 = merge_top2(p1, p2, m1, m2)
        if p1 != -1 and p1 < w: ans = min(ans, mst_cost + w - p1)
        elif p2 != -1 and p2 < w: ans = min(ans, mst_cost + w - p2)
    print(-1 if ans == INF else ans)

if __name__ == "__main__":
    solve()`,
        ruby: `def merge_top2(a1, a2, b1, b2)
  m1 = -1; m2 = -1
  [a1, a2, b1, b2].each do |v|
    if v > m1; m2 = m1; m1 = v
    elsif v < m1 && v > m2; m2 = v
    end
  end
  [m1, m2]
end

data = STDIN.read.split.map(&:to_i)
exit if data.empty?
idx = 0; n = data[idx]; m = data[idx + 1]; idx += 2
edges = Array.new(m) { u = data[idx]; v = data[idx + 1]; w = data[idx + 2]; idx += 3; [u, v, w] }
edges.sort_by! { |e| e[2] }
p = Array.new(n + 1, -1)
find = ->(x) { r = x; r = p[r] while p[r] >= 0; while x != r; nx = p[x]; p[x] = r; x = nx; end; r }
used = Array.new(m, false)
tree = Array.new(n + 1) { [] }
mst_cost = 0; taken = 0
edges.each_with_index do |(u, v, w), i|
  a = find.call(u); b = find.call(v)
  next if a == b
  a, b = b, a if -p[a] < -p[b]
  p[a] += p[b]; p[b] = a; used[i] = true; mst_cost += w; taken += 1
  tree[u] << [v, w]; tree[v] << [u, w]
end
if taken < n - 1; puts(-1); exit; end
log = 18
up = Array.new(log) { Array.new(n + 1, 1) }
mx1 = Array.new(log) { Array.new(n + 1, -1) }
mx2 = Array.new(log) { Array.new(n + 1, -1) }
depth = Array.new(n + 1, 0); parent = Array.new(n + 1, 0)
order = [1]; head = 0
while head < order.size
  u = order[head]; head += 1
  tree[u].each do |v, w|
    next if v == parent[u]
    parent[v] = u; depth[v] = depth[u] + 1; up[0][v] = u; mx1[0][v] = w; order << v
  end
end
(1...log).each do |k|
  (1..n).each do |v|
    mid = up[k - 1][v]
    up[k][v] = up[k - 1][mid]
    mx1[k][v], mx2[k][v] = merge_top2(mx1[k - 1][v], mx2[k - 1][v], mx1[k - 1][mid], mx2[k - 1][mid])
  end
end
inf = 4 * 10**18; ans = inf
edges.each_with_index do |(u, v, w), i|
  next if used[i]
  p1 = -1; p2 = -1
  u, v = v, u if depth[u] < depth[v]
  diff = depth[u] - depth[v]
  log.times { |k| if ((diff >> k) & 1) == 1; p1, p2 = merge_top2(p1, p2, mx1[k][u], mx2[k][u]); u = up[k][u]; end }
  if u != v
    (log - 1).downto(0) do |k|
      if up[k][u] != up[k][v]
        m1, m2 = merge_top2(mx1[k][u], mx2[k][u], mx1[k][v], mx2[k][v])
        p1, p2 = merge_top2(p1, p2, m1, m2)
        u = up[k][u]; v = up[k][v]
      end
    end
    m1, m2 = merge_top2(mx1[0][u], mx2[0][u], mx1[0][v], mx2[0][v])
    p1, p2 = merge_top2(p1, p2, m1, m2)
  end
  if p1 != -1 && p1 < w; cand = mst_cost + w - p1; ans = cand if cand < ans
  elsif p2 != -1 && p2 < w; cand = mst_cost + w - p2; ans = cand if cand < ans
  end
end
puts(ans == inf ? -1 : ans)`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'CSES',
      title: 'Road Reparation & New Roads Queries',
      difficulty: 'USACO Gold / Platinum (1400–1900)',
      url: 'https://cses.fi/problemset/task/1675',
      patternNote: 'Road Reparation is pure Kruskal; New Roads Queries uses Kruskal Reconstruction Tree / Binary Lifting.',
    },
    {
      platform: 'AtCoder',
      title: 'ABC218 E (Destruction) & ABC235 E (MST + 1)',
      difficulty: 'AtCoder Cyan (~1400)',
      url: 'https://atcoder.jp/contests/abc235/tasks/abc235_e',
      patternNote: 'Offline Kruskal check answering whether query edges belong to the MST.',
    },
    {
      platform: 'Codeforces',
      title: 'CF 609E Minimum Spanning Tree for Each Edge & CF 888G Xor-MST',
      difficulty: 'CF 1600 / 2300',
      url: 'https://codeforces.com/problemset/problem/609/E',
      patternNote: '609E teaches MST + Binary Lifting path max; 888G demonstrates Boruvka + Binary Trie.',
    },
    {
      platform: 'CodeChef',
      title: 'MSTRINGS / GALACTIK (MST With Virtual Hub Vertex)',
      difficulty: 'CodeChef 3★–4★',
      url: 'https://www.codechef.com/tags/problems/mst',
      patternNote: 'Connecting vertices via power-station costs reduces cleanly to adding virtual node 0.',
    },
    {
      platform: 'HackerRank',
      title: 'Kruskal (MST): Really Special Subtree & Prim’s Special Subtree',
      difficulty: 'Medium',
      url: 'https://www.hackerrank.com/challenges/kruskalmstrsub',
      patternNote: 'Standard Kruskal tie-breaking and Prim O(E log V) priority queue validation.',
    },
    {
      platform: 'NeetCode 150',
      title: 'Min Cost to Connect All Points (LeetCode 1584)',
      difficulty: 'FAANG Medium',
      url: 'https://leetcode.com/problems/min-cost-to-connect-all-points/',
      patternNote: 'Complete Manhattan-distance graph—Dense Prim O(N^2) beats Kruskal O(N^2 log N).',
    },
  ],
  interviewNotes: [
    'Know when to swap Kruskal for Dense Prim: when E is Theta(V^2) (e.g., 2D Euclidean/Manhattan point sets), Prim runs in O(V^2) time and O(V) memory without building N^2 edges.',
    'Explain the Cut Property cleanly and show how Kruskal Reconstruction Trees / Binary Lifting answer minimax bottleneck path queries in O(log N).',
  ],
  projectBlueprint: {
    title: 'Fiber-Optic City Network & Power Grid Cost Optimizer',
    tagline:
      'Compute minimum-cost backbone wiring plans across municipal districts using Kruskal DSU, simulate mandatory corridor overrides, and run dense Prim layout optimization.',
    stackSummary: 'TypeScript + Kruskal DSU Engine + Dense Prim Spatial Planner',
    asciiDiagram:
      'City Junctions (x, y) + Candidate Trenches ──▶ [Kruskal / Dense Prim Core]\n' +
      '                                                       │\n' +
      '  Optimal Backbone Edges + Redundancy Upgrade Delta ◀──┘',
    milestones: [
      {
        id: 'ch16-m1',
        title: 'Milestone 1: Kruskal Edge Pipeline & DSU Cycle Guard',
        detail: 'Sort candidate fiber links by trenching cost and return connected MST components + disconnected alerts.',
      },
      {
        id: 'ch16-m2',
        title: 'Milestone 2: O(V^2) Dense Prim Spatial Mesh',
        detail: 'Compute optimal Euclidean/Manhattan backbone meshes over thousands of nodes without storing E = N^2 edges.',
      },
      {
        id: 'ch16-m3',
        title: 'Milestone 3: Mandatory Link Override Delta Estimator',
        detail: 'Use path-max binary lifting over the MST to calculate exact budget impact of forcing a redundant link.',
      },
    ],
    starterCode: `export interface TrenchCandidate {
  id: string;
  u: number;
  v: number;
  cost: number;
}

export function buildMinimumBackbone(
  nodeCount: number,
  candidates: TrenchCandidate[],
): { totalCost: number; selected: TrenchCandidate[]; connected: boolean } {
  const sorted = [...candidates].sort((a, b) => a.cost - b.cost);
  const parent = new Int32Array(nodeCount).fill(-1);

  const find = (x: number): number => {
    let r = x;
    while (parent[r] >= 0) r = parent[r];
    let cur = x;
    while (cur !== r) {
      const nxt = parent[cur];
      parent[cur] = r;
      cur = nxt;
    }
    return r;
  };

  let totalCost = 0;
  const selected: TrenchCandidate[] = [];

  for (const edge of sorted) {
    let ra = find(edge.u);
    let rb = find(edge.v);
    if (ra === rb) continue;
    if (-parent[ra] < -parent[rb]) [ra, rb] = [rb, ra];
    parent[ra] += parent[rb];
    parent[rb] = ra;
    totalCost += edge.cost;
    selected.push(edge);
  }

  return {
    totalCost,
    selected,
    connected: selected.length === Math.max(0, nodeCount - 1),
  };
}`,
  },
};
