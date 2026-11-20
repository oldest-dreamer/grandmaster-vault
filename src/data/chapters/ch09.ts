import type { TheoryChapter } from '../../types/vault';

export const CH09_DSU_ROLLBACK: TheoryChapter = {
  slug: 'disjoint-set-union-rollback',
  topicId: 'ds-04',
  title: 'Disjoint Set Union (DSU) & DSU with Rollback',
  domain: 'Data Structures',
  ratingTier: '1400–1600',
  usacoDivision: 'Gold',
  subtitle:
    'Maintain dynamic connected components in near-O(1) inverse-Ackermann time, or omit path compression to support O(log N) undoable merges via a history stack.',
  analogyTitle: 'The Club Leader & Undo Ledger Analogy',
  analogyBody:
    'Imagine merging student clubs whenever two students shake hands. Every club picks one captain (root), and students point upward toward their captain. To check if Alice and Bob are in the same club, you follow their arrows to the top captain. In standard DSU, once you find Alice’s captain, you immediately point Alice directly to the captain (Path Compression) and always attach smaller clubs under larger ones (Union by Size), making queries practically O(1). Now suppose someone asks for an "Undo" button: "Revert the last handshake!" Path Compression destroys the original arrow history, so you turn Path Compression OFF and keep ONLY Union by Size (tree height stays <= log2 N). Whenever a small club attaches to a larger captain, you write one tiny note on an Undo Stack: (child, old_root_size). Popping that note restores the exact previous forest in O(1)!',
  prerequisites: [
    {
      slug: 'coordinate-compression-offline-sorting',
      title: 'Coordinate Compression & Offline Sorting',
    },
  ],
  traceTitle: 'Interactive DSU Union-by-Size & Rollback Stack Visualizer',
  traceSubtitle:
    'Step through small-to-large merges, connected-component tracking, and stack-based rollback—or add custom nodes/edges live.',
  allowDynamicGraphEdit: true,
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Step 1: Initial 6 Isolated Components ({0}..{5})',
      explanation:
        'Each vertex starts as its own root with negative size -1 in parent[], component count = 6, max component size = 1, and an empty rollback stack.',
      mode: 'graph',
      graph: {
        calloutMetric: 'Components = 6 | Max Size = 1 | Rollback Stack = []',
        nodes: [
          { id: '0', label: '0 (sz=1)', x: 85, y: 95, state: 'unmatched', matchWith: null },
          { id: '1', label: '1 (sz=1)', x: 245, y: 95, state: 'unmatched', matchWith: null },
          { id: '2', label: '2 (sz=1)', x: 430, y: 95, state: 'unmatched', matchWith: null },
          { id: '3', label: '3 (sz=1)', x: 85, y: 215, state: 'unmatched', matchWith: null },
          { id: '4', label: '4 (sz=1)', x: 245, y: 215, state: 'unmatched', matchWith: null },
          { id: '5', label: '5 (sz=1)', x: 430, y: 215, state: 'unmatched', matchWith: null },
        ],
        edges: [],
      },
      variables: { Components: 6, MaxSize: 1, StackDepth: 0 },
    },
    {
      stepNumber: 2,
      title: 'Step 2: Merge (0, 1) and Merge (2, 4)',
      explanation:
        'Unite(0, 1): root 0 absorbs 1 (sz[0]=2, push undo (1, -1)). Unite(2, 4): root 2 absorbs 4 (sz[2]=2, push undo (4, -1)). Components drops from 6 to 4.',
      mode: 'graph',
      graph: {
        calloutMetric: 'Components = 4 | Max Size = 2 | Stack = [(1,-1), (4,-1)]',
        nodes: [
          { id: '0', label: '0* (sz=2)', x: 85, y: 95, state: 'even', matchWith: null },
          { id: '1', label: '1 -> 0', x: 245, y: 95, state: 'matched', matchWith: '0' },
          { id: '2', label: '2* (sz=2)', x: 430, y: 95, state: 'even', matchWith: null },
          { id: '3', label: '3 (sz=1)', x: 85, y: 215, state: 'unmatched', matchWith: null },
          { id: '4', label: '4 -> 2', x: 245, y: 215, state: 'matched', matchWith: '2' },
          { id: '5', label: '5 (sz=1)', x: 430, y: 215, state: 'unmatched', matchWith: null },
        ],
        edges: [
          { id: 'e01', from: '0', to: '1', state: 'matched' },
          { id: 'e24', from: '2', to: '4', state: 'matched' },
        ],
      },
      variables: { Components: 4, MaxSize: 2, StackDepth: 2 },
    },
    {
      stepNumber: 3,
      title: 'Step 3: Unite(3, 0) & Unite(0, 2) via Small-to-Large',
      explanation:
        'Unite(3, 0): sz[3]=1 < sz[0]=2, so 3 attaches under 0 (sz[0]=3). Then Unite(0, 2): sz[2]=2 < sz[0]=3, so 2 attaches under 0 (sz[0]=5, tree depth <= 2!).',
      mode: 'graph',
      graph: {
        calloutMetric: 'Components = 2 | Max Size = 5 | Stack Depth = 4',
        nodes: [
          { id: '0', label: '0* (sz=5)', x: 85, y: 95, state: 'active', matchWith: null },
          { id: '1', label: '1 -> 0', x: 245, y: 95, state: 'matched', matchWith: '0' },
          { id: '2', label: '2 -> 0', x: 430, y: 95, state: 'matched', matchWith: '0' },
          { id: '3', label: '3 -> 0', x: 85, y: 215, state: 'matched', matchWith: '0' },
          { id: '4', label: '4 -> 2', x: 245, y: 215, state: 'matched', matchWith: '2' },
          { id: '5', label: '5 (sz=1)', x: 430, y: 215, state: 'unmatched', matchWith: null },
        ],
        edges: [
          { id: 'e01', from: '0', to: '1', state: 'matched' },
          { id: 'e24', from: '2', to: '4', state: 'matched' },
          { id: 'e30', from: '3', to: '0', state: 'augmenting' },
          { id: 'e02', from: '0', to: '2', state: 'augmenting' },
        ],
      },
      variables: { Components: 2, MaxSize: 5, StackDepth: 4 },
    },
    {
      stepNumber: 4,
      title: 'Step 4: Rollback Last Merge (0, 2) in O(1)',
      explanation:
        'Popping (2, old_sz=-2) from the rollback stack restores parent[2] = -2, parent[0] = -3, and components = 3—without ever rebuilding the forest!',
      mode: 'graph',
      graph: {
        calloutMetric: 'Rolled Back (0, 2) -> Components = 3 | Max Size = 3',
        nodes: [
          { id: '0', label: '0* (sz=3)', x: 85, y: 95, state: 'even', matchWith: null },
          { id: '1', label: '1 -> 0', x: 245, y: 95, state: 'matched', matchWith: '0' },
          { id: '2', label: '2* (sz=2)', x: 430, y: 95, state: 'even', matchWith: null },
          { id: '3', label: '3 -> 0', x: 85, y: 215, state: 'matched', matchWith: '0' },
          { id: '4', label: '4 -> 2', x: 245, y: 215, state: 'matched', matchWith: '2' },
          { id: '5', label: '5 (sz=1)', x: 430, y: 215, state: 'unmatched', matchWith: null },
        ],
        edges: [
          { id: 'e01', from: '0', to: '1', state: 'matched' },
          { id: 'e24', from: '2', to: '4', state: 'matched' },
          { id: 'e30', from: '3', to: '0', state: 'matched' },
          { id: 'e02', from: '0', to: '2', state: 'contracted' },
        ],
      },
      variables: { Components: 3, MaxSize: 3, StackDepth: 3 },
    },
  ],
  reductionClues: [
    {
      clue: '"Add edges dynamically and query connected components, component size, or cycle existence"',
      translation:
        'Standard DSU with Path Compression + Union by Size gives O(alpha(N)) amortized per operation.',
    },
    {
      clue: '"Edges are BOTH added AND deleted offline over Q <= 2 * 10^5 time steps"',
      translation:
        'Segment Tree Over Time (Divide & Conquer on Queries) + DSU with Rollback! Each edge lives in O(log Q) time-tree nodes -> O(Q log^2 N) total.',
    },
    {
      clue: '"Maintain bipartiteness dynamically as edges are added (or rolled back)"',
      translation:
        'Parity DSU storing xor-distance parity[u] to parent[u]! Check if two endpoints in the same component have identical root parity (odd cycle found).',
    },
  ],
  timeComplexity: 'O(alpha(N)) per op (Standard DSU) | O(log N) per op (Rollback DSU)',
  spaceComplexity: 'O(N) (or O(N + Q) with rollback history stack)',
  pitfalls: [
    {
      type: 'WA',
      title: 'Mixing Path Compression With DSU Rollback',
      detail:
        'If find(x) flattens parent[x] = find(parent[x]) during Rollback DSU, popping a union record will leave stale compressed pointers intact and corrupt future queries. In Rollback DSU, find() MUST be pure read-only: while (parent[x] >= 0) x = parent[x].',
    },
    {
      type: 'WA',
      title: 'Pushing a Self-Loop Merge (u == v) Onto Rollback Without Recording No-Op',
      detail:
        'If unite(u, v) returns early when find(u) == find(v) without pushing a dummy marker—or if your rollback loop unconditionally pops once per edge—you will accidentally undo an earlier unrelated union! Always snapshot stack.size() before a block and rollback while (stack.size() > checkpoint).',
    },
    {
      type: 'RE',
      title: 'Recursive find() Stack Overflow Without Compression on Skewed Chains',
      detail:
        'Even with Union by Size keeping height <= 20, iterative while (p[x] >= 0) x = p[x] is faster and immune to recursion overhead in Python, Java, and Ruby.',
    },
    {
      type: 'WA',
      title: 'Forgetting to Update Parity in Bipartite DSU After Swapping Small-to-Large',
      detail:
        'When attaching root ru under rv, the edge weight connecting ru -> rv must satisfy par[u] ^ par[v] ^ 1 = 0, so parity[ru] = d_u ^ d_v ^ 1 (XOR of both paths to their old roots plus 1).',
    },
  ],
  implementations: {
    cpp20: `#include <bits/stdc++.h>
using namespace std;

// Complete DSU with Union by Size + Stack-Based Rollback + Standard Road Construction Driver
struct RollbackDSU {
    vector<int> p;
    int comps, max_sz;
    struct Change {
        int child, old_child_p, root, old_root_p, old_max;
    };
    vector<Change> history;

    RollbackDSU(int n) : p(n, -1), comps(n), max_sz(n > 0 ? 1 : 0) {}

    int find(int x) const {
        while (p[x] >= 0) x = p[x];
        return x;
    }

    int snapshot() const { return (int)history.size(); }

    bool unite(int u, int v) {
        u = find(u);
        v = find(v);
        if (u == v) return false;
        if (-p[u] < -p[v]) swap(u, v);
        history.push_back({v, p[v], u, p[u], max_sz});
        p[u] += p[v];
        p[v] = u;
        --comps;
        max_sz = max(max_sz, -p[u]);
        return true;
    }

    void rollback(int target_sz) {
        while ((int)history.size() > target_sz) {
            auto ch = history.back();
            history.pop_back();
            p[ch.root] = ch.old_root_p;
            p[ch.child] = ch.old_child_p;
            max_sz = ch.old_max;
            ++comps;
        }
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    if (!(cin >> n >> m)) return 0;
    RollbackDSU dsu(n);
    for (int i = 0; i < m; ++i) {
        int u, v;
        cin >> u >> v;
        dsu.unite(u - 1, v - 1);
        cout << dsu.comps << ' ' << dsu.max_sz << '\\n';
    }
    return 0;
}`,
    rust: `use std::io::{self, BufWriter, Read, Write};

struct Change {
    child: usize,
    old_child_p: i32,
    root: usize,
    old_root_p: i32,
    old_max: i32,
}

struct RollbackDsu {
    p: Vec<i32>,
    comps: usize,
    max_sz: i32,
    history: Vec<Change>,
}

impl RollbackDsu {
    fn new(n: usize) -> Self {
        Self {
            p: vec![-1; n],
            comps: n,
            max_sz: if n > 0 { 1 } else { 0 },
            history: Vec::new(),
        }
    }

    fn find(&self, mut x: usize) -> usize {
        while self.p[x] >= 0 {
            x = self.p[x] as usize;
        }
        x
    }

    fn snapshot(&self) -> usize {
        self.history.len()
    }

    fn unite(&mut self, u: usize, v: usize) -> bool {
        let mut a = self.find(u);
        let mut b = self.find(v);
        if a == b {
            return false;
        }
        if -self.p[a] < -self.p[b] {
            std::mem::swap(&mut a, &mut b);
        }
        self.history.push(Change {
            child: b,
            old_child_p: self.p[b],
            root: a,
            old_root_p: self.p[a],
            old_max: self.max_sz,
        });
        self.p[a] += self.p[b];
        self.p[b] = a as i32;
        self.comps -= 1;
        self.max_sz = self.max_sz.max(-self.p[a]);
        true
    }

    fn rollback(&mut self, target: usize) {
        while self.history.len() > target {
            let ch = self.history.pop().unwrap();
            self.p[ch.root] = ch.old_root_p;
            self.p[ch.child] = ch.old_child_p;
            self.max_sz = ch.old_max;
            self.comps += 1;
        }
    }
}

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let Some(ns) = it.next() else { return; };
    let n: usize = ns.parse().unwrap();
    let m: usize = it.next().unwrap().parse().unwrap();
    let mut dsu = RollbackDsu::new(n);
    let _ = dsu.snapshot();
    let mut out = BufWriter::new(io::stdout().lock());
    for _ in 0..m {
        let u = it.next().unwrap().parse::<usize>().unwrap() - 1;
        let v = it.next().unwrap().parse::<usize>().unwrap() - 1;
        dsu.unite(u, v);
        writeln!(out, "{} {}", dsu.comps, dsu.max_sz).unwrap();
    }
    let _ = || dsu.rollback(0);
}`,
    java21: `import java.io.*;
import java.util.*;

public class Main {
    static final class FastScanner {
        private final InputStream in = System.in;
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;
        int readByte() throws IOException {
            if (ptr >= len) { len = in.read(buf); ptr = 0; if (len <= 0) return -1; }
            return buf[ptr++];
        }
        int nextInt() throws IOException {
            int c; do { c = readByte(); } while (c <= 32 && c != -1);
            if (c == -1) return Integer.MIN_VALUE;
            int sgn = 1; if (c == '-') { sgn = -1; c = readByte(); }
            int res = 0;
            while (c > 32) { res = res * 10 + (c - '0'); c = readByte(); }
            return res * sgn;
        }
    }

    static final class RollbackDSU {
        int[] p, hChild, hOldChildP, hRoot, hOldRootP, hOldMax;
        int comps, maxSz, top = 0;

        RollbackDSU(int n, int maxOps) {
            p = new int[n];
            Arrays.fill(p, -1);
            comps = n;
            maxSz = n > 0 ? 1 : 0;
            int cap = Math.max(16, maxOps + 5);
            hChild = new int[cap]; hOldChildP = new int[cap];
            hRoot = new int[cap]; hOldRootP = new int[cap];
            hOldMax = new int[cap];
        }

        int find(int x) {
            while (p[x] >= 0) x = p[x];
            return x;
        }

        int snapshot() { return top; }

        boolean unite(int u, int v) {
            u = find(u); v = find(v);
            if (u == v) return false;
            if (-p[u] < -p[v]) { int t = u; u = v; v = t; }
            hChild[top] = v; hOldChildP[top] = p[v];
            hRoot[top] = u; hOldRootP[top] = p[u];
            hOldMax[top] = maxSz;
            top++;
            p[u] += p[v];
            p[v] = u;
            comps--;
            if (-p[u] > maxSz) maxSz = -p[u];
            return true;
        }

        void rollback(int target) {
            while (top > target) {
                top--;
                p[hRoot[top]] = hOldRootP[top];
                p[hChild[top]] = hOldChildP[top];
                maxSz = hOldMax[top];
                comps++;
            }
        }
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        int n = fs.nextInt();
        if (n == Integer.MIN_VALUE) return;
        int m = fs.nextInt();
        RollbackDSU dsu = new RollbackDSU(n, m);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < m; i++) {
            int u = fs.nextInt() - 1, v = fs.nextInt() - 1;
            dsu.unite(u, v);
            sb.append(dsu.comps).append(' ').append(dsu.maxSz).append('\\n');
        }
        System.out.print(sb);
    }
}`,
    python3: `import sys

class RollbackDSU:
    def __init__(self, n: int):
        self.p = [-1] * n
        self.comps = n
        self.max_sz = 1 if n > 0 else 0
        self.history = []

    def find(self, x: int) -> int:
        p = self.p
        while p[x] >= 0:
            x = p[x]
        return x

    def snapshot(self) -> int:
        return len(self.history)

    def unite(self, u: int, v: int) -> bool:
        u = self.find(u)
        v = self.find(v)
        if u == v:
            return False
        if -self.p[u] < -self.p[v]:
            u, v = v, u
        self.history.append((v, self.p[v], u, self.p[u], self.max_sz))
        self.p[u] += self.p[v]
        self.p[v] = u
        self.comps -= 1
        if -self.p[u] > self.max_sz:
            self.max_sz = -self.p[u]
        return True

    def rollback(self, target: int):
        while len(self.history) > target:
            v, pv, u, pu, old_max = self.history.pop()
            self.p[u] = pu
            self.p[v] = pv
            self.max_sz = old_max
            self.comps += 1

def solve():
    data = list(map(int, sys.stdin.buffer.read().split()))
    if not data:
        return
    it = iter(data)
    n, m = next(it), next(it)
    dsu = RollbackDSU(n)
    out = []
    for _ in range(m):
        u, v = next(it) - 1, next(it) - 1
        dsu.unite(u, v)
        out.append(f"{dsu.comps} {dsu.max_sz}")
    sys.stdout.write("\\n".join(out) + "\\n")

if __name__ == "__main__":
    solve()`,
    ruby: `class RollbackDSU
  attr_reader :comps, :max_sz

  def initialize(n)
    @p = Array.new(n, -1)
    @comps = n
    @max_sz = n > 0 ? 1 : 0
    @history = []
  end

  def find(x)
    x = @p[x] while @p[x] >= 0
    x
  end

  def snapshot
    @history.size
  end

  def unite(u, v)
    u = find(u); v = find(v)
    return false if u == v
    u, v = v, u if -@p[u] < -@p[v]
    @history << [v, @p[v], u, @p[u], @max_sz]
    @p[u] += @p[v]
    @p[v] = u
    @comps -= 1
    @max_sz = -@p[u] if -@p[u] > @max_sz
    true
  end

  def rollback(target)
    while @history.size > target
      v, pv, u, pu, old_max = @history.pop
      @p[u] = pu; @p[v] = pv; @max_sz = old_max; @comps += 1
    end
  end
end

data = STDIN.read.split.map(&:to_i)
exit if data.empty?
n, m = data[0], data[1]
dsu = RollbackDSU.new(n)
out = []
m.times do |i|
  u = data[2 + 2 * i] - 1
  v = data[3 + 2 * i] - 1
  dsu.unite(u, v)
  out << "#{dsu.comps} #{dsu.max_sz}"
end
puts out.join("\\n")`,
  },
  practiceProblems: [
    {
      id: 'ch09-warmup',
      tier: 'Warmup',
      ratingRange: '1000–1300',
      title: 'Road Construction (CSES Components & Max Component Size)',
      statement:
        'There are N cities and initially 0 roads. M roads are built sequentially between pairs (u, v). After each new road, print two integers: the current number of connected components and the size of the largest component.',
      constraints: '1 <= N <= 10^5, 1 <= M <= 2 * 10^5, Time Limit: 1.0s',
      sampleInput: '5 3\n1 2\n1 3\n4 5',
      sampleOutput: '4 2\n3 3\n2 3',
      hints: [
        'Track negative component sizes directly inside parent[root] = -size.',
        'Whenever unite(u, v) merges two distinct roots, decrement components by 1 and update max_sz = max(max_sz, -parent[new_root]).',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    if (!(cin >> n >> m)) return 0;
    vector<int> p(n, -1);
    auto find = [&](int x) {
        int r = x;
        while (p[r] >= 0) r = p[r];
        while (p[x] >= 0) { int nxt = p[x]; p[x] = r; x = nxt; }
        return r;
    };
    int comps = n, best = 1;
    while (m--) {
        int u, v; cin >> u >> v; --u; --v;
        u = find(u); v = find(v);
        if (u != v) {
            if (-p[u] < -p[v]) swap(u, v);
            p[u] += p[v]; p[v] = u;
            comps--; best = max(best, -p[u]);
        }
        cout << comps << ' ' << best << '\\n';
    }
}`,
        rust: `use std::io::{self, BufWriter, Read, Write};
fn find(p: &mut [i32], mut x: usize) -> usize {
    let mut r = x;
    while p[r] >= 0 { r = p[r] as usize; }
    while p[x] >= 0 { let nxt = p[x] as usize; p[x] = r as i32; x = nxt; }
    r
}
fn main() {
    let mut s = String::new(); io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace().map(|x| x.parse::<usize>().unwrap());
    let Some(n) = it.next() else { return; };
    let m = it.next().unwrap();
    let mut p = vec![-1i32; n];
    let (mut comps, mut best) = (n, 1i32);
    let mut out = BufWriter::new(io::stdout().lock());
    for _ in 0..m {
        let mut u = find(&mut p, it.next().unwrap() - 1);
        let mut v = find(&mut p, it.next().unwrap() - 1);
        if u != v {
            if -p[u] < -p[v] { std::mem::swap(&mut u, &mut v); }
            p[u] += p[v]; p[v] = u as i32;
            comps -= 1; best = best.max(-p[u]);
        }
        writeln!(out, "{} {}", comps, best).unwrap();
    }
}`,
        java21: `import java.io.*;
import java.util.*;
public class Main {
    static int find(int[] p, int x) {
        int r = x;
        while (p[r] >= 0) r = p[r];
        while (p[x] >= 0) { int nxt = p[x]; p[x] = r; x = nxt; }
        return r;
    }
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String line = br.readLine(); if (line == null) return;
        StringTokenizer st = new StringTokenizer(line);
        int n = Integer.parseInt(st.nextToken()), m = Integer.parseInt(st.nextToken());
        int[] p = new int[n]; Arrays.fill(p, -1);
        int comps = n, best = 1;
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < m; i++) {
            st = new StringTokenizer(br.readLine());
            int u = find(p, Integer.parseInt(st.nextToken()) - 1);
            int v = find(p, Integer.parseInt(st.nextToken()) - 1);
            if (u != v) {
                if (-p[u] < -p[v]) { int t = u; u = v; v = t; }
                p[u] += p[v]; p[v] = u;
                comps--; best = Math.max(best, -p[u]);
            }
            sb.append(comps).append(' ').append(best).append('\\n');
        }
        System.out.print(sb);
    }
}`,
        python3: `import sys
def solve():
    data = list(map(int, sys.stdin.buffer.read().split()))
    if not data: return
    it = iter(data)
    n, m = next(it), next(it)
    p = [-1] * n
    def find(x):
        r = x
        while p[r] >= 0: r = p[r]
        while p[x] >= 0:
            nxt = p[x]; p[x] = r; x = nxt
        return r
    comps, best = n, 1
    out = []
    for _ in range(m):
        u, v = find(next(it) - 1), find(next(it) - 1)
        if u != v:
            if -p[u] < -p[v]: u, v = v, u
            p[u] += p[v]; p[v] = u
            comps -= 1
            if -p[u] > best: best = -p[u]
        out.append(f"{comps} {best}")
    sys.stdout.write("\\n".join(out) + "\\n")
if __name__ == "__main__":
    solve()`,
        ruby: `data = STDIN.read.split.map(&:to_i)
exit if data.empty?
n, m = data[0], data[1]
p = Array.new(n, -1)
find = ->(x) do
  r = x
  r = p[r] while p[r] >= 0
  while p[x] >= 0; nxt = p[x]; p[x] = r; x = nxt; end
  r
end
comps = n; best = 1; out = []
m.times do |i|
  u = find.call(data[2 + 2 * i] - 1)
  v = find.call(data[3 + 2 * i] - 1)
  if u != v
    u, v = v, u if -p[u] < -p[v]
    p[u] += p[v]; p[v] = u
    comps -= 1; best = -p[u] if -p[u] > best
  end
  out << "#{comps} #{best}"
end
puts out.join("\\n")`,
      },
    },
    {
      id: 'ch09-standard',
      tier: 'Standard',
      ratingRange: '1600–1850',
      title: 'Bipartite Parity DSU (Detect First Non-Bipartite Edge)',
      statement:
        'Given N vertices and M undirected edges arriving one by one, identify the 1-indexed number of the FIRST edge whose addition destroys bipartiteness (creates an odd-length cycle), or print -1 if the final graph remains bipartite.',
      constraints: '1 <= N <= 2 * 10^5, 1 <= M <= 2 * 10^5, Time Limit: 1.0s',
      sampleInput: '4 4\n1 2\n2 3\n3 4\n4 2',
      sampleOutput: '4',
      hints: [
        'Each node u stores parent[u] AND parity[u] in {0, 1} (XOR color difference between u and parent[u]).',
        'When compressing find(x), XOR par[x] ^= par[parent[x]] before re-attaching directly to the root. On union(u, v), if root(u) == root(v) and par[u] == par[v], an odd cycle just closed!',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    if (!(cin >> n >> m)) return 0;
    vector<int> p(n), par(n, 0), sz(n, 1);
    iota(p.begin(), p.end(), 0);
    auto find = [&](auto&& self, int x) -> pair<int, int> {
        if (p[x] == x) return {x, 0};
        auto [r, d] = self(self, p[x]);
        p[x] = r;
        par[x] ^= d;
        return {p[x], par[x]};
    };
    for (int i = 1; i <= m; ++i) {
        int u, v; cin >> u >> v; --u; --v;
        auto [ru, du] = find(find, u);
        auto [rv, dv] = find(find, v);
        if (ru == rv) {
            if (du == dv) { cout << i << '\\n'; return 0; }
        } else {
            if (sz[ru] < sz[rv]) swap(ru, rv);
            p[rv] = ru;
            par[rv] = du ^ dv ^ 1;
            sz[ru] += sz[rv];
        }
    }
    cout << -1 << '\\n';
}`,
        rust: `use std::io::{self, Read};
fn find(p: &mut [usize], par: &mut [u8], x: usize) -> (usize, u8) {
    if p[x] == x { return (x, 0); }
    let (r, d) = find(p, par, p[x]);
    p[x] = r; par[x] ^= d;
    (r, par[x])
}
fn main() {
    let mut s = String::new(); io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace().map(|x| x.parse::<usize>().unwrap());
    let Some(n) = it.next() else { return; };
    let m = it.next().unwrap();
    let mut p: Vec<usize> = (0..n).collect();
    let mut par = vec![0u8; n];
    let mut sz = vec![1usize; n];
    for i in 1..=m {
        let u = it.next().unwrap() - 1;
        let v = it.next().unwrap() - 1;
        let (mut ru, du) = find(&mut p, &mut par, u);
        let (mut rv, dv) = find(&mut p, &mut par, v);
        if ru == rv {
            if du == dv { println!("{}", i); return; }
        } else {
            if sz[ru] < sz[rv] { std::mem::swap(&mut ru, &mut rv); }
            p[rv] = ru; par[rv] = du ^ dv ^ 1; sz[ru] += sz[rv];
        }
    }
    println!("-1");
}`,
        java21: `import java.io.*;
import java.util.*;
public class Main {
    static int[] p, par, sz;
    static int find(int x) {
        if (p[x] == x) return x;
        int orig = p[x], r = find(orig);
        par[x] ^= par[orig];
        return p[x] = r;
    }
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String line = br.readLine(); if (line == null) return;
        StringTokenizer st = new StringTokenizer(line);
        int n = Integer.parseInt(st.nextToken()), m = Integer.parseInt(st.nextToken());
        p = new int[n]; par = new int[n]; sz = new int[n];
        for (int i = 0; i < n; i++) { p[i] = i; sz[i] = 1; }
        for (int i = 1; i <= m; i++) {
            st = new StringTokenizer(br.readLine());
            int u = Integer.parseInt(st.nextToken()) - 1, v = Integer.parseInt(st.nextToken()) - 1;
            int ru = find(u), rv = find(v);
            if (ru == rv) {
                if (par[u] == par[v]) { System.out.println(i); return; }
            } else {
                if (sz[ru] < sz[rv]) { int t = ru; ru = rv; rv = t; }
                p[rv] = ru; par[rv] = par[u] ^ par[v] ^ 1; sz[ru] += sz[rv];
            }
        }
        System.out.println(-1);
    }
}`,
        python3: `import sys
def solve():
    sys.setrecursionlimit(300000)
    data = list(map(int, sys.stdin.buffer.read().split()))
    if not data: return
    it = iter(data)
    n, m = next(it), next(it)
    p = list(range(n))
    par = [0] * n
    sz = [1] * n
    def find(x):
        path = []
        while p[x] != x:
            path.append(x)
            x = p[x]
        acc = 0
        for node in reversed(path):
            acc ^= par[node]
            par[node] = acc
            p[node] = x
        return x
    for i in range(1, m + 1):
        u, v = next(it) - 1, next(it) - 1
        ru, rv = find(u), find(v)
        if ru == rv:
            if par[u] == par[v]:
                print(i); return
        else:
            if sz[ru] < sz[rv]: ru, rv = rv, ru
            p[rv] = ru
            par[rv] = par[u] ^ par[v] ^ 1
            sz[ru] += sz[rv]
    print(-1)
if __name__ == "__main__":
    solve()`,
        ruby: `data = STDIN.read.split.map(&:to_i)
exit if data.empty?
n, m = data[0], data[1]
p = (0...n).to_a; par = Array.new(n, 0); sz = Array.new(n, 1)
find = ->(x) do
  path = []
  while p[x] != x; path << x; x = p[x]; end
  acc = 0
  path.reverse_each { |node| acc ^= par[node]; par[node] = acc; p[node] = x }
  x
end
(1..m).each do |i|
  u = data[2 * i] - 1; v = data[2 * i + 1] - 1
  ru = find.call(u); rv = find.call(v)
  if ru == rv
    if par[u] == par[v]; puts i; exit; end
  else
    ru, rv = rv, ru if sz[ru] < sz[rv]
    p[rv] = ru; par[rv] = par[u] ^ par[v] ^ 1; sz[ru] += sz[rv]
  end
end
puts -1`,
      },
    },
    {
      id: 'ch09-boss',
      tier: 'Boss',
      ratingRange: '2200–2500',
      title: 'Offline Dynamic Connectivity (Segment Tree Over Time + Rollback DSU)',
      statement:
        'Start with N isolated vertices at time 0 and process Q events at times t = 0..Q-1: (1 u v) add edge (u, v), (2 u v) remove an existing edge (u, v), or (3) query the current number of connected components (CSES Dynamic Connectivity).',
      constraints: '1 <= N <= 10^5, 1 <= Q <= 10^5, Time Limit: 2.0s',
      sampleInput: '5 5\n1 1 2\n1 2 3\n3\n2 1 2\n3',
      sampleOutput: '3\n4',
      hints: [
        'Every edge (u, v) exists during a half-open or closed time interval [L, R]. Insert each edge into a Segment Tree over query times [0..Q-1] using O(log Q) nodes.',
        'Run a single DFS over the Segment Tree: push all edges stored at the node into RollbackDSU, recurse left & right, output dsu.comps at leaves, and rollback on exit!',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;
struct RollbackDSU {
    vector<int> p; int comps;
    vector<tuple<int, int, int, int>> st;
    RollbackDSU(int n) : p(n, -1), comps(n) {}
    int find(int x) const { while (p[x] >= 0) x = p[x]; return x; }
    int snap() const { return (int)st.size(); }
    void unite(int u, int v) {
        u = find(u); v = find(v);
        if (u == v) return;
        if (-p[u] < -p[v]) swap(u, v);
        st.emplace_back(v, p[v], u, p[u]);
        p[u] += p[v]; p[v] = u; --comps;
    }
    void rollback(int t) {
        while ((int)st.size() > t) {
            auto [v, pv, u, pu] = st.back(); st.pop_back();
            p[u] = pu; p[v] = pv; ++comps;
        }
    }
};
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, q;
    if (!(cin >> n >> q)) return 0;
    map<pair<int, int>, int> active;
    vector<vector<pair<int, int>>> tree(4 * max(1, q));
    auto add_seg = [&](auto&& self, int node, int l, int r, int ql, int qr, pair<int, int> e) -> void {
        if (ql <= l && r <= qr) { tree[node].push_back(e); return; }
        int m = (l + r) >> 1;
        if (ql <= m) self(self, node << 1, l, m, ql, qr, e);
        if (qr > m) self(self, node << 1 | 1, m + 1, r, ql, qr, e);
    };
    vector<bool> is_query(q, false);
    for (int t = 0; t < q; ++t) {
        int type; cin >> type;
        if (type == 3) { is_query[t] = true; continue; }
        int u, v; cin >> u >> v; --u; --v;
        if (u > v) swap(u, v);
        if (type == 1) active[{u, v}] = t;
        else {
            auto it = active.find({u, v});
            if (it != active.end()) {
                add_seg(add_seg, 1, 0, q - 1, it->second, t, {u, v});
                active.erase(it);
            }
        }
    }
    for (auto& [e, start] : active) add_seg(add_seg, 1, 0, q - 1, start, q - 1, e);
    RollbackDSU dsu(n);
    auto dfs = [&](auto&& self, int node, int l, int r) -> void {
        int sp = dsu.snap();
        for (auto [u, v] : tree[node]) dsu.unite(u, v);
        if (l == r) {
            if (is_query[l]) cout << dsu.comps << '\\n';
        } else {
            int m = (l + r) >> 1;
            self(self, node << 1, l, m);
            self(self, node << 1 | 1, m + 1, r);
        }
        dsu.rollback(sp);
    };
    dfs(dfs, 1, 0, q - 1);
}`,
        rust: `use std::collections::HashMap;
use std::io::{self, BufWriter, Read, Write};

struct Dsu { p: Vec<i32>, comps: usize, st: Vec<(usize, i32, usize, i32)> }
impl Dsu {
    fn new(n: usize) -> Self { Self { p: vec![-1; n], comps: n, st: Vec::new() } }
    fn find(&self, mut x: usize) -> usize { while self.p[x] >= 0 { x = self.p[x] as usize; } x }
    fn unite(&mut self, u: usize, v: usize) {
        let (mut a, mut b) = (self.find(u), self.find(v));
        if a == b { return; }
        if -self.p[a] < -self.p[b] { std::mem::swap(&mut a, &mut b); }
        self.st.push((b, self.p[b], a, self.p[a]));
        self.p[a] += self.p[b]; self.p[b] = a as i32; self.comps -= 1;
    }
    fn rollback(&mut self, t: usize) {
        while self.st.len() > t {
            let (v, pv, u, pu) = self.st.pop().unwrap();
            self.p[u] = pu; self.p[v] = pv; self.comps += 1;
        }
    }
}

fn add_seg(tree: &mut Vec<Vec<(usize, usize)>>, node: usize, l: usize, r: usize, ql: usize, qr: usize, e: (usize, usize)) {
    if ql <= l && r <= qr { tree[node].push(e); return; }
    let m = (l + r) >> 1;
    if ql <= m { add_seg(tree, node << 1, l, m, ql, qr, e); }
    if qr > m { add_seg(tree, node << 1 | 1, m + 1, r, ql, qr, e); }
}

fn dfs(tree: &Vec<Vec<(usize, usize)>>, dsu: &mut Dsu, is_q: &[bool], out: &mut BufWriter<io::StdoutLock<'_>>, node: usize, l: usize, r: usize) {
    let sp = dsu.st.len();
    for &(u, v) in &tree[node] { dsu.unite(u, v); }
    if l == r { if is_q[l] { writeln!(out, "{}", dsu.comps).unwrap(); } }
    else { let m = (l + r) >> 1; dfs(tree, dsu, is_q, out, node << 1, l, m); dfs(tree, dsu, is_q, out, node << 1 | 1, m + 1, r); }
    dsu.rollback(sp);
}

fn main() {
    let mut s = String::new(); io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace().map(|x| x.parse::<usize>().unwrap());
    let Some(n) = it.next() else { return; };
    let q = it.next().unwrap();
    let mut active: HashMap<(usize, usize), usize> = HashMap::new();
    let mut tree = vec![Vec::new(); 4 * q.max(1)];
    let mut is_q = vec![false; q];
    for t in 0..q {
        let tp = it.next().unwrap();
        if tp == 3 { is_q[t] = true; continue; }
        let mut u = it.next().unwrap() - 1; let mut v = it.next().unwrap() - 1;
        if u > v { std::mem::swap(&mut u, &mut v); }
        if tp == 1 { active.insert((u, v), t); }
        else if let Some(st_t) = active.remove(&(u, v)) { add_seg(&mut tree, 1, 0, q - 1, st_t, t, (u, v)); }
    }
    for (e, st_t) in active { add_seg(&mut tree, 1, 0, q - 1, st_t, q - 1, e); }
    let mut dsu = Dsu::new(n);
    let mut out = BufWriter::new(io::stdout().lock());
    dfs(&tree, &mut dsu, &is_q, &mut out, 1, 0, q - 1);
}`,
        java21: `import java.io.*;
import java.util.*;
public class Main {
    static int[] p, hV, hPV, hU, hPU;
    static int comps, top = 0;
    static List<int[]>[] tree;
    static boolean[] isQ;
    static StringBuilder out = new StringBuilder();
    static int find(int x) { while (p[x] >= 0) x = p[x]; return x; }
    static void unite(int u, int v) {
        u = find(u); v = find(v); if (u == v) return;
        if (-p[u] < -p[v]) { int t = u; u = v; v = t; }
        hV[top] = v; hPV[top] = p[v]; hU[top] = u; hPU[top] = p[u]; top++;
        p[u] += p[v]; p[v] = u; comps--;
    }
    static void rollback(int t) { while (top > t) { top--; p[hU[top]] = hPU[top]; p[hV[top]] = hPV[top]; comps++; } }
    static void addSeg(int node, int l, int r, int ql, int qr, int[] e) {
        if (ql <= l && r <= qr) { tree[node].add(e); return; }
        int m = (l + r) >> 1;
        if (ql <= m) addSeg(node << 1, l, m, ql, qr, e);
        if (qr > m) addSeg(node << 1 | 1, m + 1, r, ql, qr, e);
    }
    static void dfs(int node, int l, int r) {
        int sp = top;
        for (int[] e : tree[node]) unite(e[0], e[1]);
        if (l == r) { if (isQ[l]) out.append(comps).append('\\n'); }
        else { int m = (l + r) >> 1; dfs(node << 1, l, m); dfs(node << 1 | 1, m + 1, r); }
        rollback(sp);
    }
    @SuppressWarnings("unchecked")
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String line = br.readLine(); if (line == null) return;
        StringTokenizer st = new StringTokenizer(line);
        int n = Integer.parseInt(st.nextToken()), q = Integer.parseInt(st.nextToken());
        p = new int[n]; Arrays.fill(p, -1); comps = n;
        int cap = Math.max(16, q * 20);
        hV = new int[cap]; hPV = new int[cap]; hU = new int[cap]; hPU = new int[cap];
        tree = new ArrayList[4 * Math.max(1, q)];
        for (int i = 0; i < tree.length; i++) tree[i] = new ArrayList<>();
        isQ = new boolean[q];
        Map<Long, Integer> active = new HashMap<>();
        for (int t = 0; t < q; t++) {
            st = new StringTokenizer(br.readLine());
            int tp = Integer.parseInt(st.nextToken());
            if (tp == 3) { isQ[t] = true; continue; }
            int u = Integer.parseInt(st.nextToken()) - 1, v = Integer.parseInt(st.nextToken()) - 1;
            if (u > v) { int tmp = u; u = v; v = tmp; }
            long key = ((long) u << 32) | v;
            if (tp == 1) active.put(key, t);
            else {
                Integer stT = active.remove(key);
                if (stT != null) addSeg(1, 0, q - 1, stT, t, new int[]{u, v});
            }
        }
        for (var en : active.entrySet()) {
            long k = en.getKey();
            addSeg(1, 0, q - 1, en.getValue(), q - 1, new int[]{(int) (k >>> 32), (int) k});
        }
        dfs(1, 0, q - 1);
        System.out.print(out);
    }
}`,
        python3: `import sys
def solve():
    sys.setrecursionlimit(300000)
    data = list(map(int, sys.stdin.buffer.read().split()))
    if not data: return
    it = iter(data)
    n, q = next(it), next(it)
    active = {}
    tree = [[] for _ in range(4 * max(1, q))]
    is_q = [False] * q
    def add_seg(node, l, r, ql, qr, e):
        if ql <= l and r <= qr: tree[node].append(e); return
        m = (l + r) >> 1
        if ql <= m: add_seg(node << 1, l, m, ql, qr, e)
        if qr > m: add_seg(node << 1 | 1, m + 1, r, ql, qr, e)
    for t in range(q):
        tp = next(it)
        if tp == 3: is_q[t] = True; continue
        u, v = next(it) - 1, next(it) - 1
        if u > v: u, v = v, u
        if tp == 1: active[(u, v)] = t
        else:
            st_t = active.pop((u, v), None)
            if st_t is not None: add_seg(1, 0, q - 1, st_t, t, (u, v))
    for e, st_t in active.items(): add_seg(1, 0, q - 1, st_t, q - 1, e)
    p = [-1] * n; comps = n; st = []; out = []
    def find(x):
        while p[x] >= 0: x = p[x]
        return x
    def dfs(node, l, r):
        nonlocal comps
        sp = len(st)
        for u, v in tree[node]:
            u, v = find(u), find(v)
            if u != v:
                if -p[u] < -p[v]: u, v = v, u
                st.append((v, p[v], u, p[u]))
                p[u] += p[v]; p[v] = u; comps -= 1
        if l == r:
            if is_q[l]: out.append(str(comps))
        else:
            m = (l + r) >> 1
            dfs(node << 1, l, m); dfs(node << 1 | 1, m + 1, r)
        while len(st) > sp:
            v, pv, u, pu = st.pop()
            p[u] = pu; p[v] = pv; comps += 1
    dfs(1, 0, q - 1)
    sys.stdout.write("\\n".join(out) + "\\n")
if __name__ == "__main__":
    solve()`,
        ruby: `data = STDIN.read.split.map(&:to_i)
exit if data.empty?
idx = 0; n = data[idx]; q = data[idx + 1]; idx += 2
active = {}
tree = Array.new(4 * [1, q].max) { [] }
is_q = Array.new(q, false)
add_seg = nil
add_seg = ->(node, l, r, ql, qr, e) do
  if ql <= l && r <= qr; tree[node] << e; return; end
  m = (l + r) >> 1
  add_seg.call(node << 1, l, m, ql, qr, e) if ql <= m
  add_seg.call(node << 1 | 1, m + 1, r, ql, qr, e) if qr > m
end
q.times do |t|
  tp = data[idx]; idx += 1
  if tp == 3; is_q[t] = true; next; end
  u = data[idx] - 1; v = data[idx + 1] - 1; idx += 2
  u, v = v, u if u > v
  if tp == 1; active[[u, v]] = t
  else
    st_t = active.delete([u, v])
    add_seg.call(1, 0, q - 1, st_t, t, [u, v]) if st_t
  end
end
active.each { |e, st_t| add_seg.call(1, 0, q - 1, st_t, q - 1, e) }
p = Array.new(n, -1); comps = n; st = []; out = []
find = ->(x) { x = p[x] while p[x] >= 0; x }
dfs = nil
dfs = ->(node, l, r) do
  sp = st.size
  tree[node].each do |u, v|
    a = find.call(u); b = find.call(v)
    next if a == b
    a, b = b, a if -p[a] < -p[b]
    st << [b, p[b], a, p[a]]; p[a] += p[b]; p[b] = a; comps -= 1
  end
  if l == r
    out << comps if is_q[l]
  else
    m = (l + r) >> 1; dfs.call(node << 1, l, m); dfs.call(node << 1 | 1, m + 1, r)
  end
  while st.size > sp; b, pb, a, pa = st.pop; p[a] = pa; p[b] = pb; comps += 1; end
end
dfs.call(1, 0, q - 1)
puts out.join("\\n")`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'CSES',
      title: 'Road Construction & Dynamic Connectivity',
      difficulty: 'USACO Gold / Platinum (1400–2200)',
      url: 'https://cses.fi/problemset/task/1676',
      patternNote: 'Canonical progression from standard size-tracking DSU to offline time-segment rollback DSU.',
    },
    {
      platform: 'AtCoder',
      title: 'ABC214 D / ACL Practice A (Disjoint Set Union)',
      difficulty: 'AtCoder Cyan (~1300)',
      url: 'https://atcoder.jp/contests/practice2/tasks/practice2_a',
      patternNote: 'Offline Kruskal-order DSU counting edge-maximum path pairs in O(N alpha(N)).',
    },
    {
      platform: 'Codeforces',
      title: 'CF 891C / Connect and Disconnect (EDU DSU Step 3)',
      difficulty: 'CF 1700–2300',
      url: 'https://codeforces.com/edu/course/2/lesson/7/3',
      patternNote: 'Codeforces EDU DSU Step 3 specifically trains Rollback DSU and Segment Tree Over Time.',
    },
    {
      platform: 'CodeChef',
      title: 'DISHOWN / FIRESC (DSU Cluster Tracking)',
      difficulty: 'CodeChef 3★–4★',
      url: 'https://www.codechef.com/tags/problems/dsu',
      patternNote: 'Maintaining cluster leaders, multiplicities, and cycle detection on dynamic merges.',
    },
    {
      platform: 'HackerRank',
      title: 'Merging Communities & Components in a Graph',
      difficulty: 'Medium / Hard',
      url: 'https://www.hackerrank.com/challenges/merging-communities',
      patternNote: 'Direct size-tracking DSU benchmark for union-by-size queries.',
    },
    {
      platform: 'NeetCode 150',
      title: 'Redundant Connection & Number of Connected Components',
      difficulty: 'FAANG Medium',
      url: 'https://leetcode.com/problemset/?search=Redundant+Connection',
      patternNote: 'Union-Find is the standard O(1) amortized solution for cycle detection and graph clustering.',
    },
  ],
  interviewNotes: [
    'Know when Path Compression is allowed (permanent merges, O(alpha(N))) vs forbidden (rollback / persistent undo, O(log N) Union-by-Size only).',
    'In system design interviews (social circle detection, fraud ring clustering, Accounts Merge), mention how DSU merges billions of account tokens in near-linear time.',
  ],
  projectBlueprint: {
    title: 'Dynamic Social Network & Cluster Connectivity Engine',
    tagline:
      'Analyze real-time friendship graphs, cluster sizes, and "what-if" friendship rollback snapshots without recomputing BFS traversals.',
    stackSummary: 'TypeScript + Union-by-Size Rollback DSU + Temporal Edge Ledger',
    asciiDiagram:
      'Friend Events (+edge / -undo) ──▶ [Snapshot Checkpoints] ──▶ RollbackDSU(parent, size)\n' +
      '                                                                   │\n' +
      '   Cluster Count / Largest Community / Same-Circle Query ◀─────────┘',
    milestones: [
      {
        id: 'ch09-m1',
        title: 'Milestone 1: Union-by-Size Core & Fast Find',
        detail: 'Implement iterative root lookup with negative size encoding in a flat Int32Array.',
      },
      {
        id: 'ch09-m2',
        title: 'Milestone 2: Checkpointed Rollback Transaction Log',
        detail: 'Add beginTransaction() / rollbackTo(checkpoint) to simulate temporary community merges cleanly.',
      },
      {
        id: 'ch09-m3',
        title: 'Milestone 3: Bipartite Conflict & Moderation Tagging',
        detail: 'Extend root lookup with XOR parity flags to detect adversarial/odd-cycle conflict groups.',
      },
    ],
    starterCode: `export class ClusterConnectivityEngine {
  private parent: Int32Array;
  private history: Array<[number, number, number, number, number]> = [];
  public componentCount: number;
  public maxClusterSize: number;

  constructor(userCount: number) {
    this.parent = new Int32Array(userCount).fill(-1);
    this.componentCount = userCount;
    this.maxClusterSize = userCount > 0 ? 1 : 0;
  }

  findRoot(userId: number): number {
    let cur = userId;
    while (this.parent[cur] >= 0) cur = this.parent[cur];
    return cur;
  }

  checkpoint(): number {
    return this.history.length;
  }

  connectUsers(u: number, v: number): boolean {
    let ru = this.findRoot(u);
    let rv = this.findRoot(v);
    if (ru === rv) return false;
    if (-this.parent[ru] < -this.parent[rv]) [ru, rv] = [rv, ru];
    this.history.push([rv, this.parent[rv], ru, this.parent[ru], this.maxClusterSize]);
    this.parent[ru] += this.parent[rv];
    this.parent[rv] = ru;
    this.componentCount--;
    this.maxClusterSize = Math.max(this.maxClusterSize, -this.parent[ru]);
    return true;
  }

  rollbackTo(targetCheckpoint: number): void {
    while (this.history.length > targetCheckpoint) {
      const [child, oldChildP, root, oldRootP, oldMax] = this.history.pop()!;
      this.parent[root] = oldRootP;
      this.parent[child] = oldChildP;
      this.maxClusterSize = oldMax;
      this.componentCount++;
    }
  }
}`,
  },
};
