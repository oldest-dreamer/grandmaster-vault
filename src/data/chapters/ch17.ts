import type { TheoryChapter } from '../../types/vault';

export const CH17_EULER_LCA: TheoryChapter = {
  slug: 'lca-binary-lifting-euler-tour',
  topicId: 'gr-33',
  title: 'Euler Tour Flattening & LCA (Binary Lifting / O(1))',
  domain: 'Graph & Tree Theory',
  ratingTier: '1600–1900',
  usacoDivision: 'Gold',
  subtitle:
    'Flatten rooted trees into contiguous [tin[u], tout[u]] array intervals via Euler Tour for O(log N) subtree & path Fenwick queries, and compute Lowest Common Ancestors in O(log N) via binary power jumps.',
  analogyTitle: 'The Family Tree Chronometer & Powers-of-Two Elevator Analogy',
  analogyBody:
    'Imagine recording an audio tour of a museum tree: every time you step into a room `u`, you press a stopwatch (`tin[u] = ++timer`), walk through all its sub-exhibits, and stamp your exit time (`tout[u] = timer`) right before leaving. Suddenly, EVERY room inside `u`’s entire subtree sits contiguously in `[tin[u] .. tout[u]]` on a flat 1D array—turning tricky subtree sums into simple Fenwick/Segment Tree range sums! Meanwhile, to find the Lowest Common Ancestor (LCA) of any two distant rooms `(u, v)` without climbing parent-by-parent in O(N), every room installs an express elevator with floors jumping 1, 2, 4, 8, ..., 2^K levels up (`up[k][u] = up[k-1][up[k-1][u]]`). First lift the deeper room up to match depths, then take the biggest powers-of-two jumps that keep `u` and `v` DIFFERENT—leaving both one step right below their LCA!',
  prerequisites: [
    {
      slug: 'sparse-table-rmq',
      title: 'Sparse Table & Disjoint Sparse Table (O(1) RMQ)',
    },
    {
      slug: 'bfs-dfs-01bfs-toposort',
      title: 'BFS, 0-1 BFS & State-Space Graph Modeling (dist[u][state])',
    },
  ],
  traceTitle: 'Interactive Euler Tour [tin, tout] Flattening & Binary Lifting Matrix Trace',
  traceSubtitle:
    'Step through DFS entry/exit timestamps on a 6-node rooted tree, map subtrees to contiguous ranges, and inspect `up[k][v]` ancestor jumps.',
  allowDynamicGraphEdit: true,
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Step 1: Rooted Tree at Node 1 (Edges: 1-2, 1-3, 2-4, 2-5, 4-6)',
      explanation:
        'Start DFS at root 1 (depth=0). Precompute binary lifting table `up[0..2][1..6]` alongside DFS enter/exit clocks `tin[]` and `tout[]`.',
      mode: 'graph',
      graph: {
        calloutMetric: 'Root = 1 | Max Depth = 3 | Timer = 0',
        nodes: [
          { id: '1', label: '1 (d=0)', x: 270, y: 55, state: 'active', matchWith: null },
          { id: '2', label: '2 (d=1)', x: 155, y: 135, state: 'unmatched', matchWith: null },
          { id: '3', label: '3 (d=1)', x: 400, y: 135, state: 'unmatched', matchWith: null },
          { id: '4', label: '4 (d=2)', x: 95, y: 215, state: 'unmatched', matchWith: null },
          { id: '5', label: '5 (d=2)', x: 225, y: 215, state: 'unmatched', matchWith: null },
          { id: '6', label: '6 (d=3)', x: 95, y: 285, state: 'unmatched', matchWith: null },
        ],
        edges: [
          { id: 'e12', from: '1', to: '2', state: 'default' },
          { id: 'e13', from: '1', to: '3', state: 'default' },
          { id: 'e24', from: '2', to: '4', state: 'default' },
          { id: 'e25', from: '2', to: '5', state: 'default' },
          { id: 'e46', from: '4', to: '6', state: 'default' },
        ],
      },
      variables: { Root: 1, Timer: 0, LogLimit: 2 },
    },
    {
      stepNumber: 2,
      title: 'Step 2: DFS Descends Left Branch 1 -> 2 -> 4 -> 6',
      explanation:
        'Enter 1 (tin=1), 2 (tin=2), 4 (tin=3), 6 (tin=4, leaf -> tout=4). Unwind 4 (tout=4), visit 5 (tin=5, tout=5), unwind 2 (tout=5). Notice subtree(2) is contiguous [2..5]!',
      mode: 'graph',
      graph: {
        calloutMetric: 'Subtree(2) = [tin=2 .. tout=5] -> Contiguous Nodes {2,4,6,5}!',
        nodes: [
          { id: '1', label: '1 [1..]', x: 270, y: 55, state: 'even', matchWith: null },
          { id: '2', label: '2 [2..5]', x: 155, y: 135, state: 'matched', matchWith: null },
          { id: '3', label: '3', x: 400, y: 135, state: 'unmatched', matchWith: null },
          { id: '4', label: '4 [3..4]', x: 95, y: 215, state: 'matched', matchWith: null },
          { id: '5', label: '5 [5..5]', x: 225, y: 215, state: 'matched', matchWith: null },
          { id: '6', label: '6 [4..4]', x: 95, y: 285, state: 'matched', matchWith: null },
        ],
        edges: [
          { id: 'e12', from: '1', to: '2', state: 'matched' },
          { id: 'e13', from: '1', to: '3', state: 'default' },
          { id: 'e24', from: '2', to: '4', state: 'matched' },
          { id: 'e25', from: '2', to: '5', state: 'matched' },
          { id: 'e46', from: '4', to: '6', state: 'matched' },
        ],
      },
      variables: { Subtree2Range: '[2, 5]', TourOrder: '[1, 2, 4, 6, 5]' },
    },
    {
      stepNumber: 3,
      title: 'Step 3: Finish DFS at Node 3 & Build Binary Lifting Jump Matrix',
      explanation:
        'Node 3 gets [6..6], Root 1 closes [1..6]. Binary lifting table up[k][v]: up[0][6]=4, up[1][6]=2, up[2][6]=1; up[0][5]=2, up[1][5]=1.',
      mode: 'graph',
      graph: {
        calloutMetric: 'up[0][6]=4, up[1][6]=2, up[2][6]=1 | Full Euler Tour [1..6]',
        nodes: [
          { id: '1', label: '1 [1..6]', x: 270, y: 55, state: 'matched', matchWith: null },
          { id: '2', label: '2 [2..5]', x: 155, y: 135, state: 'matched', matchWith: null },
          { id: '3', label: '3 [6..6]', x: 400, y: 135, state: 'matched', matchWith: null },
          { id: '4', label: '4 [3..4]', x: 95, y: 215, state: 'matched', matchWith: null },
          { id: '5', label: '5 [5..5]', x: 225, y: 215, state: 'matched', matchWith: null },
          { id: '6', label: '6 [4..4]', x: 95, y: 285, state: 'matched', matchWith: null },
        ],
        edges: [
          { id: 'e12', from: '1', to: '2', state: 'matched' },
          { id: 'e13', from: '1', to: '3', state: 'matched' },
          { id: 'e24', from: '2', to: '4', state: 'matched' },
          { id: 'e25', from: '2', to: '5', state: 'matched' },
          { id: 'e46', from: '4', to: '6', state: 'matched' },
        ],
      },
      variables: { 'up[0][6]': 4, 'up[1][6]': 2, 'up[2][6]': 1, 'isAnc(2,6)': '2<=4 && 4<=5 (true)' },
    },
    {
      stepNumber: 4,
      title: 'Step 4: Query LCA(6, 5) -> Lift 6 to Depth 2, Return up[0][4] = 2',
      explanation:
        'depth[6]=3 vs depth[5]=2 -> diff=1 -> jump 6 by 2^0 to up[0][6] = 4. Now depth[4] == depth[5] == 2 and 4 != 5. Check k=1..0: up[0][4] = 2 == up[0][5] = 2 -> LCA is 2!',
      mode: 'graph',
      graph: {
        calloutMetric: 'LCA(6, 5) = 2 | dist(6, 5) = depth[6] + depth[5] - 2*depth[2] = 3',
        nodes: [
          { id: '1', label: '1 [1..6]', x: 270, y: 55, state: 'matched', matchWith: null },
          { id: '2', label: '2* LCA', x: 155, y: 135, state: 'active', matchWith: null },
          { id: '3', label: '3 [6..6]', x: 400, y: 135, state: 'matched', matchWith: null },
          { id: '4', label: '4 (lifted)', x: 95, y: 215, state: 'even', matchWith: null },
          { id: '5', label: '5 (qry)', x: 225, y: 215, state: 'even', matchWith: null },
          { id: '6', label: '6 (qry)', x: 95, y: 285, state: 'odd', matchWith: null },
        ],
        edges: [
          { id: 'e12', from: '1', to: '2', state: 'matched' },
          { id: 'e13', from: '1', to: '3', state: 'matched' },
          { id: 'e24', from: '2', to: '4', state: 'augmenting' },
          { id: 'e25', from: '2', to: '5', state: 'augmenting' },
          { id: 'e46', from: '4', to: '6', state: 'augmenting' },
        ],
      },
      variables: { Query: 'LCA(6, 5)', EqualDepthNode: '4 & 5', LCA: 2, PathLength: 3 },
    },
  ],
  reductionClues: [
    {
      clue: '"Rooted tree, Q queries: find Lowest Common Ancestor or distance between nodes u and v"',
      translation: 'Binary Lifting O(N log N) build, O(log N) LCA; dist(u, v) = depth[u] + depth[v] - 2 * depth[lca(u, v)].',
    },
    {
      clue: '"Update value of node x; query sum/XOR/min over the entire subtree of node u"',
      translation: 'Euler Tour flattening [tin[u], tout[u]] maps every subtree to a contiguous range on a Fenwick or Segment Tree.',
    },
    {
      clue: '"Add +v to all nodes in subtree of u (or add +v to node u), query path sum from root to v"',
      translation: 'Inverse Euler Tour trick: place +v at tin[u] and -v at tout[u] + 1 in a Fenwick tree; prefixSum(tin[v]) equals the exact root-to-v path sum!',
    },
    {
      clue: '"Add +v to ALL nodes along path(u, v), query single node value or subtree sum"',
      translation: 'Tree Difference Array on LCA: add(tin[u], +v), add(tin[v], +v), add(tin[lca], -v), add(tin[parent[lca]], -v), then query subtree sum of node x over [tin[x]..tout[x]]!',
    },
  ],
  timeComplexity: 'Precompute: O(N log N) | LCA / Subtree / Path Query: O(log N) (or O(1) via RMQ)',
  spaceComplexity: 'O(N log N) for binary lifting table (O(N) for Euler tour)',
  pitfalls: [
    {
      type: 'WA',
      title: 'Setting Root’s `up[0][1] = 0` Instead of `up[0][1] = 1` (or Out-of-Bounds 0)',
      detail:
        'Using `up[0][1] = 1` makes jumping past the root loop safely at node 1 without ever hitting dummy node `0` (unless `0` is explicitly initialized with `tin[0] = -1, tout[0] = INF` for `isAncestor(0, v) = true`).',
    },
    {
      type: 'RE',
      title: 'Stack Overflow on Chain Tree of Length 2*10^5',
      detail:
        'A path graph of 2e5 nodes overflows default recursion stacks in Python/Java/some judges. Use an explicit iterative DFS stack to record `tin[]`, `tout[]`, `depth[]`, and `up[0][]` safely!',
    },
    {
      type: 'WA',
      title: 'Mixing Up 2N Euler Tour Indexing vs N-Length Tin/Tout Indexing',
      detail:
        'For subtree sums, each node needs ONLY ONE slot at `tin[u]` (`1..N`), NOT `2N`, because `tout[u]` equals the max `tin` inside u’s subtree. Wait: for path-to-root queries (+v at `tin[u]`, -v at `tout[u]`), allocate size `2N` or place `-v` at `tout[u] + 1` in size `N + 1`!',
    },
    {
      type: 'WA',
      title: 'Off-by-One BIT Indexing When `tin` Starts at 0',
      detail:
        'Fenwick Trees require 1-based indexing (`timer` starting at 1 so `tin[u] >= 1`). Starting `timer` at 0 causes infinite loop `while (i > 0)` or `i += i & -i` on `i = 0`!',
    },
  ],
  implementations: {
    cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, q;
    if (!(cin >> n >> q)) return 0;
    vector<vector<int>> adj(n + 1);
    for (int i = 0; i < n - 1; ++i) {
        int u, v;
        cin >> u >> v;
        adj[u].push_back(v);
        adj[v].push_back(u);
    }

    const int LOG = 19;
    vector<vector<int>> up(LOG, vector<int>(n + 1, 1));
    vector<int> depth(n + 1, 0), tin(n + 1, 0), tout(n + 1, 0);
    int timer = 0;

    // Iterative Euler Tour + parent capture (zero recursion limit risk)
    vector<pair<int, int>> st = {{1, 0}};
    vector<int> parent(n + 1, 0);
    while (!st.empty()) {
        auto &[u, idx] = st.back();
        if (idx == 0) {
            tin[u] = ++timer;
            up[0][u] = (parent[u] == 0 ? 1 : parent[u]);
        }
        if (idx < (int)adj[u].size()) {
            int v = adj[u][idx++];
            if (v != parent[u]) {
                parent[v] = u;
                depth[v] = depth[u] + 1;
                st.push_back({v, 0});
            }
        } else {
            tout[u] = timer;
            st.pop_back();
        }
    }

    for (int k = 1; k < LOG; ++k) {
        for (int v = 1; v <= n; ++v) {
            up[k][v] = up[k - 1][up[k - 1][v]];
        }
    }

    auto isAnc = [&](int u, int v) {
        return tin[u] <= tin[v] && tout[v] <= tout[u];
    };

    auto lca = [&](int u, int v) {
        if (isAnc(u, v)) return u;
        if (isAnc(v, u)) return v;
        for (int k = LOG - 1; k >= 0; --k) {
            if (!isAnc(up[k][u], v)) u = up[k][u];
        }
        return up[0][u];
    };

    while (q--) {
        int u, v;
        cin >> u >> v;
        cout << lca(u, v) << '\\n';
    }
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
    let q: usize = it.next().unwrap().parse().unwrap();

    let mut adj = vec![Vec::<usize>::new(); n + 1];
    for _ in 0..n - 1 {
        let u: usize = it.next().unwrap().parse().unwrap();
        let v: usize = it.next().unwrap().parse().unwrap();
        adj[u].push(v);
        adj[v].push(u);
    }

    const LOG: usize = 19;
    let mut up = vec![vec![1usize; n + 1]; LOG];
    let mut tin = vec![0usize; n + 1];
    let mut tout = vec![0usize; n + 1];
    let mut parent = vec![0usize; n + 1];
    let mut timer = 0usize;

    let mut st: Vec<(usize, usize)> = Vec::with_capacity(n);
    st.push((1, 0));
    while let Some((u, idx)) = st.pop() {
        if idx == 0 {
            timer += 1;
            tin[u] = timer;
            up[0][u] = if parent[u] == 0 { 1 } else { parent[u] };
        }
        if idx < adj[u].len() {
            st.push((u, idx + 1));
            let v = adj[u][idx];
            if v != parent[u] {
                parent[v] = u;
                st.push((v, 0));
            }
        } else {
            tout[u] = timer;
        }
    }

    for k in 1..LOG {
        for v in 1..=n {
            up[k][v] = up[k - 1][up[k - 1][v]];
        }
    }

    let is_anc = |u: usize, v: usize| tin[u] <= tin[v] && tout[v] <= tout[u];
    let mut out = String::new();
    for _ in 0..q {
        let mut u: usize = it.next().unwrap().parse().unwrap();
        let v: usize = it.next().unwrap().parse().unwrap();
        let ans = if is_anc(u, v) {
            u
        } else if is_anc(v, u) {
            v
        } else {
            for k in (0..LOG).rev() {
                if !is_anc(up[k][u], v) {
                    u = up[k][u];
                }
            }
            up[0][u]
        };
        out.push_str(&format!("{}\\n", ans));
    }
    print!("{}", out);
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

        int nextInt() throws IOException {
            int c;
            while ((c = readByte()) <= 32) {
                if (c == -1) return Integer.MIN_VALUE;
            }
            int sign = 1;
            if (c == '-') { sign = -1; c = readByte(); }
            int res = 0;
            while (c > 32) {
                res = res * 10 + (c - '0');
                c = readByte();
            }
            return res * sign;
        }
    }

    static int[] tin, tout;

    static boolean isAnc(int u, int v) {
        return tin[u] <= tin[v] && tout[v] <= tout[u];
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        int n = fs.nextInt();
        if (n == Integer.MIN_VALUE) return;
        int q = fs.nextInt();

        int[] head = new int[n + 1];
        Arrays.fill(head, -1);
        int[] to = new int[2 * n];
        int[] next = new int[2 * n];
        int ptr = 0;
        for (int i = 0; i < n - 1; i++) {
            int u = fs.nextInt(), v = fs.nextInt();
            to[ptr] = v; next[ptr] = head[u]; head[u] = ptr++;
            to[ptr] = u; next[ptr] = head[v]; head[v] = ptr++;
        }

        final int LOG = 19;
        int[][] up = new int[LOG][n + 1];
        tin = new int[n + 1];
        tout = new int[n + 1];
        int[] parent = new int[n + 1];
        int[] stU = new int[n + 1];
        int[] stE = new int[n + 1];
        int top = 0, timer = 0;

        stU[top] = 1; stE[top] = head[1]; top++;
        tin[1] = ++timer;
        up[0][1] = 1;

        while (top > 0) {
            int idx = top - 1;
            int u = stU[idx];
            int e = stE[idx];
            if (e != -1) {
                stE[idx] = next[e];
                int v = to[e];
                if (v != parent[u]) {
                    parent[v] = u;
                    tin[v] = ++timer;
                    up[0][v] = u;
                    stU[top] = v; stE[top] = head[v]; top++;
                }
            } else {
                tout[u] = timer;
                top--;
            }
        }

        for (int k = 1; k < LOG; k++) {
            for (int v = 1; v <= n; v++) {
                up[k][v] = up[k - 1][up[k - 1][v]];
            }
        }

        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < q; i++) {
            int u = fs.nextInt(), v = fs.nextInt();
            if (isAnc(u, v)) sb.append(u).append('\\n');
            else if (isAnc(v, u)) sb.append(v).append('\\n');
            else {
                for (int k = LOG - 1; k >= 0; k--) {
                    if (!isAnc(up[k][u], v)) u = up[k][u];
                }
                sb.append(up[0][u]).append('\\n');
            }
        }
        System.out.print(sb);
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
    q = int(next(it))

    adj = [[] for _ in range(n + 1)]
    for _ in range(n - 1):
        u = int(next(it))
        v = int(next(it))
        adj[u].append(v)
        adj[v].append(u)

    LOG = 19
    up = [[1] * (n + 1) for _ in range(LOG)]
    tin = [0] * (n + 1)
    tout = [0] * (n + 1)
    parent = [0] * (n + 1)
    timer = 0

    st = [[1, 0]]
    while st:
        u, idx = st[-1]
        if idx == 0:
            timer += 1
            tin[u] = timer
            up[0][u] = parent[u] if parent[u] != 0 else 1
        if idx < len(adj[u]):
            st[-1][1] = idx + 1
            v = adj[u][idx]
            if v != parent[u]:
                parent[v] = u
                st.append([v, 0])
        else:
            tout[u] = timer
            st.pop()

    for k in range(1, LOG):
        prev_row, cur_row = up[k - 1], up[k]
        for v in range(1, n + 1):
            cur_row[v] = prev_row[prev_row[v]]

    out = []
    for _ in range(q):
        u = int(next(it))
        v = int(next(it))
        if tin[u] <= tin[v] and tout[v] <= tout[u]:
            out.append(str(u))
        elif tin[v] <= tin[u] and tout[u] <= tout[v]:
            out.append(str(v))
        else:
            for k in range(LOG - 1, -1, -1):
                cand = up[k][u]
                if not (tin[cand] <= tin[v] and tout[v] <= tout[cand]):
                    u = cand
            out.append(str(up[0][u]))

    sys.stdout.write("\\n".join(out) + "\\n")

if __name__ == "__main__":
    solve()`,
    ruby: `data = STDIN.read.split.map(&:to_i)
exit if data.empty?
idx = 0
n = data[idx]; q = data[idx + 1]; idx += 2

adj = Array.new(n + 1) { [] }
(n - 1).times do
  u = data[idx]; v = data[idx + 1]; idx += 2
  adj[u] << v; adj[v] << u
end

log = 19
up = Array.new(log) { Array.new(n + 1, 1) }
tin = Array.new(n + 1, 0)
tout = Array.new(n + 1, 0)
parent = Array.new(n + 1, 0)
timer = 0

st = [[1, 0]]
until st.empty?
  top = st[-1]
  u = top[0]; i = top[1]
  if i == 0
    timer += 1
    tin[u] = timer
    up[0][u] = parent[u] == 0 ? 1 : parent[u]
  end
  if i < adj[u].size
    top[1] = i + 1
    v = adj[u][i]
    if v != parent[u]
      parent[v] = u
      st << [v, 0]
    end
  else
    tout[u] = timer
    st.pop
  end
end

(1...log).each do |k|
  (1..n).each { |v| up[k][v] = up[k - 1][up[k - 1][v]] }
end

is_anc = ->(u, v) { tin[u] <= tin[v] && tout[v] <= tout[u] }
out = []
q.times do
  u = data[idx]; v = data[idx + 1]; idx += 2
  if is_anc.call(u, v)
    out << u
  elsif is_anc.call(v, u)
    out << v
  else
    (log - 1).downto(0) do |k|
      cand = up[k][u]
      u = cand unless is_anc.call(cand, v)
    end
    out << up[0][u]
  end
end
puts out.join("\\n")`,
  },
  practiceProblems: [
    {
      id: 'gr33-p1',
      tier: 'Warmup',
      ratingRange: '1400–1600',
      title: 'Company Queries II (Fast LCA in Rooted Trees)',
      statement:
        'A company has N employees (boss 1 is CEO). For each employee 2..N, you are given their direct boss e_i. Answer Q queries asking for the lowest common boss of employees a and b.',
      constraints: '1 <= N, Q <= 2*10^5, 1 <= e_i <= N.',
      sampleInput: `5 3
1 1 3 3
4 5
2 5
1 4`,
      sampleOutput: `3
1
1`,
      hints: [
        'Run an iterative Euler tour DFS from root 1 to capture `[tin[u], tout[u]]` and populate `up[0..18][1..N]`.',
        'Check `isAnc(a, b)` via `tin[a] <= tin[b] && tout[b] <= tout[a]`—then lift `a` down from `k = 18` to `0` whenever `!isAnc(up[k][a], b)`.',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, q;
    if (!(cin >> n >> q)) return 0;
    vector<vector<int>> adj(n + 1);
    const int LOG = 19;
    vector<vector<int>> up(LOG, vector<int>(n + 1, 1));
    for (int i = 2; i <= n; ++i) {
        int p; cin >> p;
        up[0][i] = p;
        adj[p].push_back(i);
    }
    vector<int> tin(n + 1), tout(n + 1);
    int timer = 0;
    vector<pair<int, int>> st = {{1, 0}};
    while (!st.empty()) {
        auto &[u, idx] = st.back();
        if (idx == 0) tin[u] = ++timer;
        if (idx < (int)adj[u].size()) {
            st.push_back({adj[u][idx++], 0});
        } else {
            tout[u] = timer;
            st.pop_back();
        }
    }
    for (int k = 1; k < LOG; ++k)
        for (int v = 1; v <= n; ++v) up[k][v] = up[k - 1][up[k - 1][v]];
    auto isAnc = [&](int u, int v) { return tin[u] <= tin[v] && tout[v] <= tout[u]; };
    while (q--) {
        int a, b; cin >> a >> b;
        if (isAnc(a, b)) cout << a << '\\n';
        else if (isAnc(b, a)) cout << b << '\\n';
        else {
            for (int k = LOG - 1; k >= 0; --k) if (!isAnc(up[k][a], b)) a = up[k][a];
            cout << up[0][a] << '\\n';
        }
    }
    return 0;
}`,
        rust: `use std::io::{self, Read};

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let n: usize = match it.next() { Some(x) => x.parse().unwrap(), None => return };
    let q: usize = it.next().unwrap().parse().unwrap();
    const LOG: usize = 19;
    let mut up = vec![vec![1usize; n + 1]; LOG];
    let mut adj = vec![Vec::<usize>::new(); n + 1];
    for i in 2..=n {
        let p: usize = it.next().unwrap().parse().unwrap();
        up[0][i] = p;
        adj[p].push(i);
    }
    let mut tin = vec![0usize; n + 1];
    let mut tout = vec![0usize; n + 1];
    let mut timer = 0usize;
    let mut st = vec![(1usize, 0usize)];
    while let Some((u, idx)) = st.pop() {
        if idx == 0 { timer += 1; tin[u] = timer; }
        if idx < adj[u].len() {
            st.push((u, idx + 1));
            st.push((adj[u][idx], 0));
        } else {
            tout[u] = timer;
        }
    }
    for k in 1..LOG {
        for v in 1..=n { up[k][v] = up[k - 1][up[k - 1][v]]; }
    }
    let is_anc = |u: usize, v: usize| tin[u] <= tin[v] && tout[v] <= tout[u];
    let mut out = String::new();
    for _ in 0..q {
        let mut a: usize = it.next().unwrap().parse().unwrap();
        let b: usize = it.next().unwrap().parse().unwrap();
        let ans = if is_anc(a, b) { a }
        else if is_anc(b, a) { b }
        else {
            for k in (0..LOG).rev() { if !is_anc(up[k][a], b) { a = up[k][a]; } }
            up[0][a]
        };
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
        int nextInt() throws IOException {
            int c; while ((c = read()) <= 32) if (c == -1) return Integer.MIN_VALUE;
            int s = 1; if (c == '-') { s = -1; c = read(); }
            int v = 0; while (c > 32) { v = v * 10 + (c - '0'); c = read(); }
            return v * s;
        }
    }

    static int[] tin, tout;
    static boolean isAnc(int u, int v) { return tin[u] <= tin[v] && tout[v] <= tout[u]; }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        int n = fs.nextInt(); if (n == Integer.MIN_VALUE) return;
        int q = fs.nextInt();
        final int LOG = 19;
        int[][] up = new int[LOG][n + 1]; up[0][1] = 1;
        int[] head = new int[n + 1]; Arrays.fill(head, -1);
        int[] to = new int[n + 1], next = new int[n + 1];
        for (int i = 2; i <= n; i++) {
            int p = fs.nextInt();
            up[0][i] = p; to[i] = i; next[i] = head[p]; head[p] = i;
        }
        tin = new int[n + 1]; tout = new int[n + 1];
        int[] stU = new int[n + 1], stE = new int[n + 1];
        int top = 0, timer = 0;
        stU[top] = 1; stE[top] = head[1]; tin[1] = ++timer; top++;
        while (top > 0) {
            int idx = top - 1, u = stU[idx], e = stE[idx];
            if (e != -1) {
                stE[idx] = next[e]; int v = to[e];
                tin[v] = ++timer; stU[top] = v; stE[top] = head[v]; top++;
            } else {
                tout[u] = timer; top--;
            }
        }
        for (int k = 1; k < LOG; k++)
            for (int v = 1; v <= n; v++) up[k][v] = up[k - 1][up[k - 1][v]];
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < q; i++) {
            int a = fs.nextInt(), b = fs.nextInt();
            if (isAnc(a, b)) sb.append(a).append('\\n');
            else if (isAnc(b, a)) sb.append(b).append('\\n');
            else {
                for (int k = LOG - 1; k >= 0; k--) if (!isAnc(up[k][a], b)) a = up[k][a];
                sb.append(up[0][a]).append('\\n');
            }
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
    n, q = int(next(it)), int(next(it))
    LOG = 19
    up = [[1] * (n + 1) for _ in range(LOG)]
    adj = [[] for _ in range(n + 1)]
    for i in range(2, n + 1):
        p = int(next(it))
        up[0][i] = p; adj[p].append(i)
    tin = [0] * (n + 1); tout = [0] * (n + 1); timer = 0
    st = [[1, 0]]
    while st:
        u, idx = st[-1]
        if idx == 0: timer += 1; tin[u] = timer
        if idx < len(adj[u]):
            st[-1][1] = idx + 1; st.append([adj[u][idx], 0])
        else:
            tout[u] = timer; st.pop()
    for k in range(1, LOG):
        pr, cr = up[k - 1], up[k]
        for v in range(1, n + 1): cr[v] = pr[pr[v]]
    out = []
    for _ in range(q):
        a, b = int(next(it)), int(next(it))
        if tin[a] <= tin[b] and tout[b] <= tout[a]: out.append(str(a))
        elif tin[b] <= tin[a] and tout[a] <= tout[b]: out.append(str(b))
        else:
            for k in range(LOG - 1, -1, -1):
                c = up[k][a]
                if not (tin[c] <= tin[b] and tout[b] <= tout[c]): a = c
            out.append(str(up[0][a]))
    sys.stdout.write("\\n".join(out) + "\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `data = STDIN.read.split.map(&:to_i)
exit if data.empty?
idx = 0; n = data[idx]; q = data[idx + 1]; idx += 2
log = 19
up = Array.new(log) { Array.new(n + 1, 1) }
adj = Array.new(n + 1) { [] }
(2..n).each { |i| p = data[idx]; idx += 1; up[0][i] = p; adj[p] << i }
tin = Array.new(n + 1, 0); tout = Array.new(n + 1, 0); timer = 0
st = [[1, 0]]
until st.empty?
  top = st[-1]; u = top[0]; i = top[1]
  if i == 0; timer += 1; tin[u] = timer; end
  if i < adj[u].size; top[1] = i + 1; st << [adj[u][i], 0]
  else tout[u] = timer; st.pop
  end
end
(1...log).each { |k| (1..n).each { |v| up[k][v] = up[k - 1][up[k - 1][v]] } }
is_anc = ->(u, v) { tin[u] <= tin[v] && tout[v] <= tout[u] }
out = []
q.times do
  a = data[idx]; b = data[idx + 1]; idx += 2
  if is_anc.call(a, b); out << a
  elsif is_anc.call(b, a); out << b
  else
    (log - 1).downto(0) { |k| c = up[k][a]; a = c unless is_anc.call(c, b) }
    out << up[0][a]
  end
end
puts out.join("\\n")`,
      },
    },
    {
      id: 'gr33-p2',
      tier: 'Standard',
      ratingRange: '1600–1750',
      title: 'Subtree Queries via Euler Tour & Fenwick Tree',
      statement:
        'You have a rooted tree at node 1 with N vertices, where each vertex initially holds value V[i]. Process Q queries: (1 s x) change V[s] to x; (2 s) calculate the sum of values in the subtree of node s.',
      constraints: '1 <= N, Q <= 2*10^5, 1 <= V[i], x <= 10^9.',
      sampleInput: `5 3
4 2 5 2 1
1 2
1 3
3 4
3 5
2 3
1 5 3
2 3`,
      sampleOutput: `8
10`,
      hints: [
        'Flatten the tree with Euler Tour `[tin[u], tout[u]]` starting at `timer = 1`.',
        'Store `V[u]` at index `tin[u]` in a Fenwick Tree. Querying subtree `s` is simply `bit.sum(tout[s]) - bit.sum(tin[s] - 1)`, and updating `V[s] = x` adds `(x - V[s])` at `tin[s]`.',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, q;
    if (!(cin >> n >> q)) return 0;
    vector<long long> val(n + 1);
    for (int i = 1; i <= n; ++i) cin >> val[i];
    vector<vector<int>> adj(n + 1);
    for (int i = 0; i < n - 1; ++i) {
        int u, v; cin >> u >> v;
        adj[u].push_back(v); adj[v].push_back(u);
    }
    vector<int> tin(n + 1), tout(n + 1), parent(n + 1, 0);
    int timer = 0;
    vector<pair<int, int>> st = {{1, 0}};
    while (!st.empty()) {
        auto &[u, idx] = st.back();
        if (idx == 0) tin[u] = ++timer;
        if (idx < (int)adj[u].size()) {
            int v = adj[u][idx++];
            if (v != parent[u]) { parent[v] = u; st.push_back({v, 0}); }
        } else {
            tout[u] = timer; st.pop_back();
        }
    }
    vector<long long> bit(n + 2, 0);
    auto add = [&](int i, long long d) { for (; i <= n; i += i & -i) bit[i] += d; };
    auto sum = [&](int i) { long long s = 0; for (; i > 0; i -= i & -i) s += bit[i]; return s; };
    for (int i = 1; i <= n; ++i) add(tin[i], val[i]);
    while (q--) {
        int tp, s; cin >> tp >> s;
        if (tp == 1) {
            long long x; cin >> x;
            add(tin[s], x - val[s]);
            val[s] = x;
        } else {
            cout << sum(tout[s]) - sum(tin[s] - 1) << '\\n';
        }
    }
    return 0;
}`,
        rust: `use std::io::{self, Read};

fn bit_add(bit: &mut [i64], mut i: usize, d: i64) {
    let n = bit.len() - 1;
    while i <= n { bit[i] += d; i += i & i.wrapping_neg(); }
}

fn bit_sum(bit: &[i64], mut i: usize) -> i64 {
    let mut s = 0;
    while i > 0 { s += bit[i]; i -= i & i.wrapping_neg(); }
    s
}

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let n: usize = match it.next() { Some(x) => x.parse().unwrap(), None => return };
    let q: usize = it.next().unwrap().parse().unwrap();
    let mut val = vec![0i64; n + 1];
    for i in 1..=n { val[i] = it.next().unwrap().parse().unwrap(); }
    let mut adj = vec![Vec::<usize>::new(); n + 1];
    for _ in 0..n - 1 {
        let u: usize = it.next().unwrap().parse().unwrap();
        let v: usize = it.next().unwrap().parse().unwrap();
        adj[u].push(v); adj[v].push(u);
    }
    let mut tin = vec![0usize; n + 1];
    let mut tout = vec![0usize; n + 1];
    let mut parent = vec![0usize; n + 1];
    let mut timer = 0usize;
    let mut st = vec![(1usize, 0usize)];
    while let Some((u, idx)) = st.pop() {
        if idx == 0 { timer += 1; tin[u] = timer; }
        if idx < adj[u].len() {
            st.push((u, idx + 1));
            let v = adj[u][idx];
            if v != parent[u] { parent[v] = u; st.push((v, 0)); }
        } else {
            tout[u] = timer;
        }
    }
    let mut bit = vec![0i64; n + 2];
    for i in 1..=n { bit_add(&mut bit, tin[i], val[i]); }
    let mut out = String::new();
    for _ in 0..q {
        let tp: usize = it.next().unwrap().parse().unwrap();
        let node: usize = it.next().unwrap().parse().unwrap();
        if tp == 1 {
            let x: i64 = it.next().unwrap().parse().unwrap();
            bit_add(&mut bit, tin[node], x - val[node]);
            val[node] = x;
        } else {
            let ans = bit_sum(&bit, tout[node]) - bit_sum(&bit, tin[node] - 1);
            out.push_str(&format!("{}\\n", ans));
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

    static long[] bit;
    static int N;
    static void add(int i, long d) { for (; i <= N; i += i & -i) bit[i] += d; }
    static long sum(int i) { long s = 0; for (; i > 0; i -= i & -i) s += bit[i]; return s; }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        long f = fs.nextLong(); if (f == Long.MIN_VALUE) return;
        N = (int) f; int q = fs.nextInt();
        long[] val = new long[N + 1];
        for (int i = 1; i <= N; i++) val[i] = fs.nextLong();
        int[] head = new int[N + 1]; Arrays.fill(head, -1);
        int[] to = new int[2 * N], next = new int[2 * N];
        int ptr = 0;
        for (int i = 0; i < N - 1; i++) {
            int u = fs.nextInt(), v = fs.nextInt();
            to[ptr] = v; next[ptr] = head[u]; head[u] = ptr++;
            to[ptr] = u; next[ptr] = head[v]; head[v] = ptr++;
        }
        int[] tin = new int[N + 1], tout = new int[N + 1], parent = new int[N + 1];
        int[] stU = new int[N + 1], stE = new int[N + 1];
        int top = 0, timer = 0;
        stU[top] = 1; stE[top] = head[1]; tin[1] = ++timer; top++;
        while (top > 0) {
            int idx = top - 1, u = stU[idx], e = stE[idx];
            if (e != -1) {
                stE[idx] = next[e]; int v = to[e];
                if (v != parent[u]) {
                    parent[v] = u; tin[v] = ++timer;
                    stU[top] = v; stE[top] = head[v]; top++;
                }
            } else {
                tout[u] = timer; top--;
            }
        }
        bit = new long[N + 2];
        for (int i = 1; i <= N; i++) add(tin[i], val[i]);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < q; i++) {
            int tp = fs.nextInt(), s = fs.nextInt();
            if (tp == 1) {
                long x = fs.nextLong();
                add(tin[s], x - val[s]); val[s] = x;
            } else {
                sb.append(sum(tout[s]) - sum(tin[s] - 1)).append('\\n');
            }
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
    n, q = int(next(it)), int(next(it))
    val = [0] + [int(next(it)) for _ in range(n)]
    adj = [[] for _ in range(n + 1)]
    for _ in range(n - 1):
        u, v = int(next(it)), int(next(it))
        adj[u].append(v); adj[v].append(u)
    tin = [0] * (n + 1); tout = [0] * (n + 1); parent = [0] * (n + 1)
    timer = 0; st = [[1, 0]]
    while st:
        u, idx = st[-1]
        if idx == 0: timer += 1; tin[u] = timer
        if idx < len(adj[u]):
            st[-1][1] = idx + 1; v = adj[u][idx]
            if v != parent[u]: parent[v] = u; st.append([v, 0])
        else:
            tout[u] = timer; st.pop()
    bit = [0] * (n + 2)
    def add(i, d):
        while i <= n: bit[i] += d; i += i & -i
    def psum(i):
        s = 0
        while i > 0: s += bit[i]; i -= i & -i
        return s
    for i in range(1, n + 1): add(tin[i], val[i])
    out = []
    for _ in range(q):
        tp, s = int(next(it)), int(next(it))
        if tp == 1:
            x = int(next(it))
            add(tin[s], x - val[s]); val[s] = x
        else:
            out.append(str(psum(tout[s]) - psum(tin[s] - 1)))
    sys.stdout.write("\\n".join(out) + "\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `data = STDIN.read.split.map(&:to_i)
exit if data.empty?
idx = 0; n = data[idx]; q = data[idx + 1]; idx += 2
val = [0] + data[idx, n]; idx += n
adj = Array.new(n + 1) { [] }
(n - 1).times { u = data[idx]; v = data[idx + 1]; idx += 2; adj[u] << v; adj[v] << u }
tin = Array.new(n + 1, 0); tout = Array.new(n + 1, 0); parent = Array.new(n + 1, 0)
timer = 0; st = [[1, 0]]
until st.empty?
  top = st[-1]; u = top[0]; i = top[1]
  if i == 0; timer += 1; tin[u] = timer; end
  if i < adj[u].size
    top[1] = i + 1; v = adj[u][i]
    if v != parent[u]; parent[v] = u; st << [v, 0]; end
  else
    tout[u] = timer; st.pop
  end
end
bit = Array.new(n + 2, 0)
add = ->(i, d) { while i <= n; bit[i] += d; i += i & -i; end }
psum = ->(i) { s = 0; while i > 0; s += bit[i]; i -= i & -i; end; s }
(1..n).each { |i| add.call(tin[i], val[i]) }
out = []
q.times do
  tp = data[idx]; s = data[idx + 1]; idx += 2
  if tp == 1
    x = data[idx]; idx += 1
    add.call(tin[s], x - val[s]); val[s] = x
  else
    out << (psum.call(tout[s]) - psum.call(tin[s] - 1))
  end
end
puts out.join("\\n")`,
      },
    },
    {
      id: 'gr33-p3',
      tier: 'Boss',
      ratingRange: '1750–1950',
      title: 'Dynamic Tree Path Queries via Euler Tour Range Updates (CSES Path Queries)',
      statement:
        'You are given a rooted tree at node 1 with N vertices, each holding initial value V[i]. Support Q operations: (1 s x) change vertex s’s value to x; (2 s) calculate the sum of values on the path from root 1 down to vertex s.',
      constraints: '1 <= N, Q <= 2*10^5, 1 <= V[i], x <= 10^9.',
      sampleInput: `5 3
4 2 5 2 1
1 2
1 3
3 4
3 5
2 4
1 3 2
2 4`,
      sampleOutput: `11
8`,
      hints: [
        'When vertex `s` gains `+delta`, EVERY vertex in `s`’s subtree `[tin[s] .. tout[s]]` sees its root-to-node path sum increase by `+delta`!',
        'Instead of HLD, represent range add `[tin[s] .. tout[s]]` on a 1D Fenwick Tree via difference updates: `bit.add(tin[s], +delta)` and `bit.add(tout[s] + 1, -delta)`. Then `bit.sum(tin[s])` returns the exact root-to-s path sum in O(log N)!',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, q;
    if (!(cin >> n >> q)) return 0;
    vector<long long> val(n + 1);
    for (int i = 1; i <= n; ++i) cin >> val[i];
    vector<vector<int>> adj(n + 1);
    for (int i = 0; i < n - 1; ++i) {
        int u, v; cin >> u >> v;
        adj[u].push_back(v); adj[v].push_back(u);
    }
    vector<int> tin(n + 1), tout(n + 1), parent(n + 1, 0);
    int timer = 0;
    vector<pair<int, int>> st = {{1, 0}};
    while (!st.empty()) {
        auto &[u, idx] = st.back();
        if (idx == 0) tin[u] = ++timer;
        if (idx < (int)adj[u].size()) {
            int v = adj[u][idx++];
            if (v != parent[u]) { parent[v] = u; st.push_back({v, 0}); }
        } else {
            tout[u] = timer; st.pop_back();
        }
    }
    vector<long long> bit(n + 3, 0);
    auto add = [&](int i, long long d) { for (; i <= n + 1; i += i & -i) bit[i] += d; };
    auto sum = [&](int i) { long long s = 0; for (; i > 0; i -= i & -i) s += bit[i]; return s; };
    auto addSubtree = [&](int u, long long d) { add(tin[u], d); add(tout[u] + 1, -d); };
    for (int i = 1; i <= n; ++i) addSubtree(i, val[i]);
    while (q--) {
        int tp, s; cin >> tp >> s;
        if (tp == 1) {
            long long x; cin >> x;
            addSubtree(s, x - val[s]);
            val[s] = x;
        } else {
            cout << sum(tin[s]) << '\\n';
        }
    }
    return 0;
}`,
        rust: `use std::io::{self, Read};

fn bit_add(bit: &mut [i64], mut i: usize, d: i64) {
    let lim = bit.len();
    while i < lim { bit[i] += d; i += i & i.wrapping_neg(); }
}

fn bit_sum(bit: &[i64], mut i: usize) -> i64 {
    let mut s = 0;
    while i > 0 { s += bit[i]; i -= i & i.wrapping_neg(); }
    s
}

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let n: usize = match it.next() { Some(x) => x.parse().unwrap(), None => return };
    let q: usize = it.next().unwrap().parse().unwrap();
    let mut val = vec![0i64; n + 1];
    for i in 1..=n { val[i] = it.next().unwrap().parse().unwrap(); }
    let mut adj = vec![Vec::<usize>::new(); n + 1];
    for _ in 0..n - 1 {
        let u: usize = it.next().unwrap().parse().unwrap();
        let v: usize = it.next().unwrap().parse().unwrap();
        adj[u].push(v); adj[v].push(u);
    }
    let mut tin = vec![0usize; n + 1];
    let mut tout = vec![0usize; n + 1];
    let mut parent = vec![0usize; n + 1];
    let mut timer = 0usize;
    let mut st = vec![(1usize, 0usize)];
    while let Some((u, idx)) = st.pop() {
        if idx == 0 { timer += 1; tin[u] = timer; }
        if idx < adj[u].len() {
            st.push((u, idx + 1));
            let v = adj[u][idx];
            if v != parent[u] { parent[v] = u; st.push((v, 0)); }
        } else {
            tout[u] = timer;
        }
    }
    let mut bit = vec![0i64; n + 3];
    for i in 1..=n {
        bit_add(&mut bit, tin[i], val[i]);
        bit_add(&mut bit, tout[i] + 1, -val[i]);
    }
    let mut out = String::new();
    for _ in 0..q {
        let tp: usize = it.next().unwrap().parse().unwrap();
        let node: usize = it.next().unwrap().parse().unwrap();
        if tp == 1 {
            let x: i64 = it.next().unwrap().parse().unwrap();
            let d = x - val[node];
            bit_add(&mut bit, tin[node], d);
            bit_add(&mut bit, tout[node] + 1, -d);
            val[node] = x;
        } else {
            out.push_str(&format!("{}\\n", bit_sum(&bit, tin[node])));
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

    static long[] bit;
    static void add(int i, long d) { for (; i < bit.length; i += i & -i) bit[i] += d; }
    static long sum(int i) { long s = 0; for (; i > 0; i -= i & -i) s += bit[i]; return s; }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        long f = fs.nextLong(); if (f == Long.MIN_VALUE) return;
        int n = (int) f, q = fs.nextInt();
        long[] val = new long[n + 1];
        for (int i = 1; i <= n; i++) val[i] = fs.nextLong();
        int[] head = new int[n + 1]; Arrays.fill(head, -1);
        int[] to = new int[2 * n], next = new int[2 * n];
        int ptr = 0;
        for (int i = 0; i < n - 1; i++) {
            int u = fs.nextInt(), v = fs.nextInt();
            to[ptr] = v; next[ptr] = head[u]; head[u] = ptr++;
            to[ptr] = u; next[ptr] = head[v]; head[v] = ptr++;
        }
        int[] tin = new int[n + 1], tout = new int[n + 1], parent = new int[n + 1];
        int[] stU = new int[n + 1], stE = new int[n + 1];
        int top = 0, timer = 0;
        stU[top] = 1; stE[top] = head[1]; tin[1] = ++timer; top++;
        while (top > 0) {
            int idx = top - 1, u = stU[idx], e = stE[idx];
            if (e != -1) {
                stE[idx] = next[e]; int v = to[e];
                if (v != parent[u]) {
                    parent[v] = u; tin[v] = ++timer;
                    stU[top] = v; stE[top] = head[v]; top++;
                }
            } else {
                tout[u] = timer; top--;
            }
        }
        bit = new long[n + 3];
        for (int i = 1; i <= n; i++) { add(tin[i], val[i]); add(tout[i] + 1, -val[i]); }
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < q; i++) {
            int tp = fs.nextInt(), s = fs.nextInt();
            if (tp == 1) {
                long x = fs.nextLong(), d = x - val[s];
                add(tin[s], d); add(tout[s] + 1, -d); val[s] = x;
            } else {
                sb.append(sum(tin[s])).append('\\n');
            }
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
    n, q = int(next(it)), int(next(it))
    val = [0] + [int(next(it)) for _ in range(n)]
    adj = [[] for _ in range(n + 1)]
    for _ in range(n - 1):
        u, v = int(next(it)), int(next(it))
        adj[u].append(v); adj[v].append(u)
    tin = [0] * (n + 1); tout = [0] * (n + 1); parent = [0] * (n + 1)
    timer = 0; st = [[1, 0]]
    while st:
        u, idx = st[-1]
        if idx == 0: timer += 1; tin[u] = timer
        if idx < len(adj[u]):
            st[-1][1] = idx + 1; v = adj[u][idx]
            if v != parent[u]: parent[v] = u; st.append([v, 0])
        else:
            tout[u] = timer; st.pop()
    bit = [0] * (n + 3)
    def add(i, d):
        while i <= n + 1: bit[i] += d; i += i & -i
    def psum(i):
        s = 0
        while i > 0: s += bit[i]; i -= i & -i
        return s
    for i in range(1, n + 1):
        add(tin[i], val[i]); add(tout[i] + 1, -val[i])
    out = []
    for _ in range(q):
        tp, s = int(next(it)), int(next(it))
        if tp == 1:
            x = int(next(it)); d = x - val[s]
            add(tin[s], d); add(tout[s] + 1, -d); val[s] = x
        else:
            out.append(str(psum(tin[s])))
    sys.stdout.write("\\n".join(out) + "\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `data = STDIN.read.split.map(&:to_i)
exit if data.empty?
idx = 0; n = data[idx]; q = data[idx + 1]; idx += 2
val = [0] + data[idx, n]; idx += n
adj = Array.new(n + 1) { [] }
(n - 1).times { u = data[idx]; v = data[idx + 1]; idx += 2; adj[u] << v; adj[v] << u }
tin = Array.new(n + 1, 0); tout = Array.new(n + 1, 0); parent = Array.new(n + 1, 0)
timer = 0; st = [[1, 0]]
until st.empty?
  top = st[-1]; u = top[0]; i = top[1]
  if i == 0; timer += 1; tin[u] = timer; end
  if i < adj[u].size
    top[1] = i + 1; v = adj[u][i]
    if v != parent[u]; parent[v] = u; st << [v, 0]; end
  else
    tout[u] = timer; st.pop
  end
end
bit = Array.new(n + 3, 0)
add = ->(i, d) { while i <= n + 1; bit[i] += d; i += i & -i; end }
psum = ->(i) { s = 0; while i > 0; s += bit[i]; i -= i & -i; end; s }
(1..n).each { |i| add.call(tin[i], val[i]); add.call(tout[i] + 1, -val[i]) }
out = []
q.times do
  tp = data[idx]; s = data[idx + 1]; idx += 2
  if tp == 1
    x = data[idx]; idx += 1; d = x - val[s]
    add.call(tin[s], d); add.call(tout[s] + 1, -d); val[s] = x
  else
    out << psum.call(tin[s])
  end
end
puts out.join("\\n")`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'CSES',
      title: 'Company Queries II, Subtree Queries & Path Queries',
      difficulty: 'USACO Gold (1550–1850)',
      url: 'https://cses.fi/problemset/task/1688',
      patternNote: 'Covers the core trio: Binary Lifting LCA, Subtree Range Fenwick, and Root-Path Difference Fenwick.',
    },
    {
      platform: 'AtCoder',
      title: 'ABC294 G / ABC202 E (Count Descendants via Tin/Tout)',
      difficulty: 'AtCoder Blue (~1700)',
      url: 'https://atcoder.jp/contests/abc202/tasks/abc202_e',
      patternNote: 'Group `tin[v]` by depth and binary-search inside `[tin[u], tout[u]]` in O(log N)!',
    },
    {
      platform: 'Codeforces',
      title: 'CF 1328E Tree Queries & CF 1304E 1-Trees and Queries',
      difficulty: 'CF 1700–2000',
      url: 'https://codeforces.com/problemset/problem/1328/E',
      patternNote: '1328E checks if vertices lie near one root-to-leaf spine using `tin/tout` ancestor checks.',
    },
    {
      platform: 'CodeChef',
      title: 'TALCA / TREEQUERY (Rooted & Rerooted LCA)',
      difficulty: 'CodeChef 4★',
      url: 'https://www.codechef.com/problems/TALCA',
      patternNote: 'Rerooted LCA(u, v) relative to arbitrary root R = majority of {LCA(u,v), LCA(u,R), LCA(v,R)}.',
    },
    {
      platform: 'HackerRank',
      title: 'Kundu and Tree / Lowest Common Ancestor & Subtree Sum',
      difficulty: 'Medium / Hard',
      url: 'https://www.hackerrank.com/domains/data-structures/trees',
      patternNote: 'Ancestor containment and distance-on-tree query benchmarks.',
    },
    {
      platform: 'NeetCode 150',
      title: 'Lowest Common Ancestor of a Binary Tree (LeetCode 236)',
      difficulty: 'FAANG Medium',
      url: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/',
      patternNote: 'FAANG top-20 classic; Binary Lifting scales it from O(N) per query down to O(log N) for Q = 10^5.',
    },
  ],
  interviewNotes: [
    'Explain how Euler Tour intervals `[tin[u], tout[u]]` unlock TWO orthogonal superpowers: subtree range queries (`[tin[u], tout[u]]`) AND root-to-node path queries (`+x` at `tin[u]`, `-x` at `tout[u]+1`).',
    'Know the O(1) Rerooted LCA identity: with arbitrary dynamic root R, `LCA_R(u, v)` is simply `LCA(u, v) ^ LCA(u, R) ^ LCA(v, R)` when picking the deepest of the three pairs!',
  ],
  projectBlueprint: {
    title: 'Git Commit Ancestry & Taxonomy Tree Query Engine',
    tagline:
      'Compute merge-base ancestors in O(log N) via Binary Lifting and answer hierarchical subtree aggregation queries in O(1)/O(log N) via Euler Tour flattening.',
    stackSummary: 'TypeScript + Binary Lifting Merge-Base Table + Euler Tour Interval Index',
    asciiDiagram:
      'Commit / Taxonomy DAG Tree ──▶ [Iterative Euler Tour + up[k][v]]\n' +
      '                                 ├── LCA(branchA, branchB) ──▶ O(log N) Merge-Base\n' +
      '                                 └── [tin[u], tout[u]]     ──▶ O(1) Descendant Check',
    milestones: [
      {
        id: 'ch17-m1',
        title: 'Milestone 1: Stack-Safe Euler Tour Indexer',
        detail: 'Compute 1-based [tin, tout] timestamps iteratively across trees of 200,000+ nodes.',
      },
      {
        id: 'ch17-m2',
        title: 'Milestone 2: Binary Lifting Merge-Base Lookup',
        detail: 'Build up[k][v] power-of-two ancestor tables to resolve LCA and commit distance in O(log N).',
      },
      {
        id: 'ch17-m3',
        title: 'Milestone 3: Subtree Diff & Path Metric Fenwick Layer',
        detail: 'Attach a typed Fenwick Tree over tin[] for instant O(log N) hierarchical rollup metrics.',
      },
    ],
    starterCode: `export class TreeAncestryEngine {
  private readonly log: number;
  private readonly up: Int32Array[];
  private readonly tin: Int32Array;
  private readonly tout: Int32Array;
  private readonly depth: Int32Array;

  constructor(n: number, root: number, children: number[][]) {
    this.log = Math.max(1, Math.ceil(Math.log2(n + 1)) + 1);
    this.up = Array.from({ length: this.log }, () => new Int32Array(n + 1).fill(root));
    this.tin = new Int32Array(n + 1);
    this.tout = new Int32Array(n + 1);
    this.depth = new Int32Array(n + 1);

    let timer = 0;
    const stack: Array<[number, number]> = [[root, 0]];
    const parent = new Int32Array(n + 1);

    while (stack.length > 0) {
      const top = stack[stack.length - 1];
      const u = top[0];
      if (top[1] === 0) {
        this.tin[u] = ++timer;
        this.up[0][u] = parent[u] === 0 ? root : parent[u];
      }
      if (top[1] < children[u].length) {
        const v = children[u][top[1]++];
        if (v !== parent[u]) {
          parent[v] = u;
          this.depth[v] = this.depth[u] + 1;
          stack.push([v, 0]);
        }
      } else {
        this.tout[u] = timer;
        stack.pop();
      }
    }

    for (let k = 1; k < this.log; k++) {
      for (let v = 1; v <= n; v++) {
        this.up[k][v] = this.up[k - 1][this.up[k - 1][v]];
      }
    }
  }

  isAncestor(u: number, v: number): boolean {
    return this.tin[u] <= this.tin[v] && this.tout[v] <= this.tout[u];
  }

  lca(u: number, v: number): number {
    if (this.isAncestor(u, v)) return u;
    if (this.isAncestor(v, u)) return v;
    let cur = u;
    for (let k = this.log - 1; k >= 0; k--) {
      if (!this.isAncestor(this.up[k][cur], v)) cur = this.up[k][cur];
    }
    return this.up[0][cur];
  }

  distance(u: number, v: number): number {
    const ancestor = this.lca(u, v);
    return this.depth[u] + this.depth[v] - 2 * this.depth[ancestor];
  }
}`,
  },
};
