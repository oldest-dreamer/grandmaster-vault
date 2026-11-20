import type { TheoryChapter } from '../../types/vault';

export const CH12_TARJAN_2SAT: TheoryChapter = {
  slug: 'tarjan-scc-2sat-bridges',
  topicId: 'gr-34',
  title: 'Tarjan SCC, Bridges, Articulation Points & 2-SAT',
  domain: 'Graph & Tree Theory',
  ratingTier: '1600–1900',
  usacoDivision: 'Gold',
  subtitle:
    'Collapse cyclic directed graphs into clean topological DAGs in O(V + E), find critical bridges in undirected networks, and solve boolean 2-SAT clauses via implication SCC ordering.',
  analogyTitle: 'The One-Way Street Whirlpool & Boolean Dominoes Analogy',
  analogyBody:
    'Imagine driving through a city of one-way streets. Whenever a cluster of intersections forms a mutual loop where every spot can reach every other spot, that entire neighborhood acts like a single giant roundabout—a Strongly Connected Component (SCC). Tarjan’s DFS maintains two clocks for each intersection: `tin[u]` (when you first arrived) and `low[u]` (the earliest active intersection still on your DFS stack you can sneak back into). When `low[u] == tin[u]`, u is the top gatekeeper of a complete whirlpool, so popping the stack down to u labels one whole SCC in reverse topological order! Even better: any 2-variable boolean rule `(A OR B)` becomes two domino implications `(!A -> B)` and `(!B -> A)`. If `x` and `!x` ever sit inside the same whirlpool, the puzzle is impossible; otherwise, picking whichever of `x` or `!x` appears LATER in topological order (smaller Tarjan SCC ID!) satisfies every single clause!',
  prerequisites: [
    {
      slug: 'bfs-dfs-01bfs-toposort',
      title: 'BFS, 0-1 BFS & State-Space Graph Modeling (dist[u][state])',
    },
  ],
  traceTitle: 'Interactive Tarjan SCC Discovery Clock (tin/low) & Stack Visualizer',
  traceSubtitle:
    'Step through DFS timestamps, back-edge low-link updates, and SCC stack popping—or test your own custom graph.',
  allowDynamicGraphEdit: true,
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Step 1: Enter DFS 0 -> 1 -> 2 (Building Active Stack)',
      explanation:
        'Graph: 0->1, 1->2, 2->0 (cycle!), 2->3, 3->4, 4->3 (cycle!). DFS visits 0 (tin=0,low=0), 1 (1,1), 2 (2,2). Stack = [0, 1, 2].',
      mode: 'graph',
      graph: {
        calloutMetric: 'Stack = [0, 1, 2] | onStack = {0,1,2} | SCCs = 0',
        nodes: [
          { id: '0', label: '0 (0/0)', x: 85, y: 150, state: 'even', matchWith: null },
          { id: '1', label: '1 (1/1)', x: 215, y: 70, state: 'even', matchWith: null },
          { id: '2', label: '2 (2/2)', x: 215, y: 230, state: 'active', matchWith: null },
          { id: '3', label: '3 (-/-)', x: 380, y: 150, state: 'unmatched', matchWith: null },
          { id: '4', label: '4 (-/-)', x: 520, y: 150, state: 'unmatched', matchWith: null },
        ],
        edges: [
          { id: 'e01', from: '0', to: '1', state: 'matched' },
          { id: 'e12', from: '1', to: '2', state: 'matched' },
          { id: 'e20', from: '2', to: '0', state: 'default' },
          { id: 'e23', from: '2', to: '3', state: 'default' },
          { id: 'e34', from: '3', to: '4', state: 'default' },
          { id: 'e43', from: '4', to: '3', state: 'default' },
        ],
      },
      variables: { Node: 2, Stack: '[0, 1, 2]', tin2: 2, low2: 2 },
    },
    {
      stepNumber: 2,
      title: 'Step 2: Cross Into 3 -> 4, Back-Edge 4->3 Closes SCC #0 {3, 4}',
      explanation:
        'From 2, DFS goes 2->3 (tin=3,low=3) -> 4 (tin=4,low=4). Edge 4->3 sees 3 is onStack, pulling low[4]=min(4, tin[3])=3. Returning to 3: low[3]==tin[3]==3 -> pop {4, 3} as SCC #0 (a sink in DAG)!',
      mode: 'graph',
      graph: {
        calloutMetric: 'Popped SCC #0 = {3, 4} | Remaining Stack = [0, 1, 2]',
        nodes: [
          { id: '0', label: '0 (0/0)', x: 85, y: 150, state: 'even', matchWith: null },
          { id: '1', label: '1 (1/1)', x: 215, y: 70, state: 'even', matchWith: null },
          { id: '2', label: '2 (2/2)', x: 215, y: 230, state: 'active', matchWith: null },
          { id: '3', label: '3* SCC#0', x: 380, y: 150, state: 'matched', matchWith: null },
          { id: '4', label: '4* SCC#0', x: 520, y: 150, state: 'matched', matchWith: null },
        ],
        edges: [
          { id: 'e01', from: '0', to: '1', state: 'matched' },
          { id: 'e12', from: '1', to: '2', state: 'matched' },
          { id: 'e20', from: '2', to: '0', state: 'default' },
          { id: 'e23', from: '2', to: '3', state: 'augmenting' },
          { id: 'e34', from: '3', to: '4', state: 'blossom-cycle' },
          { id: 'e43', from: '4', to: '3', state: 'blossom-cycle' },
        ],
      },
      variables: { SCC_0: '{3, 4}', Stack: '[0, 1, 2]', CrossEdge: '2->3 ignored (3 off stack)' },
    },
    {
      stepNumber: 3,
      title: 'Step 3: Back-Edge 2->0 Propagates low = 0 Up to 1 and 0',
      explanation:
        'Node 2 inspects edge 2->0: 0 is onStack with tin[0]=0, so low[2]=0. Unwinding 2->1 updates low[1]=min(1, low[2])=0; unwinding 1->0 leaves low[0]=0.',
      mode: 'graph',
      graph: {
        calloutMetric: 'low[2]=0, low[1]=0, low[0]=0 | Cycle {0,1,2} linked!',
        nodes: [
          { id: '0', label: '0 (0/0)', x: 85, y: 150, state: 'active', matchWith: null },
          { id: '1', label: '1 (1/0)', x: 215, y: 70, state: 'odd', matchWith: null },
          { id: '2', label: '2 (2/0)', x: 215, y: 230, state: 'odd', matchWith: null },
          { id: '3', label: '3* SCC#0', x: 380, y: 150, state: 'matched', matchWith: null },
          { id: '4', label: '4* SCC#0', x: 520, y: 150, state: 'matched', matchWith: null },
        ],
        edges: [
          { id: 'e01', from: '0', to: '1', state: 'blossom-cycle' },
          { id: 'e12', from: '1', to: '2', state: 'blossom-cycle' },
          { id: 'e20', from: '2', to: '0', state: 'augmenting' },
          { id: 'e23', from: '2', to: '3', state: 'contracted' },
          { id: 'e34', from: '3', to: '4', state: 'matched' },
          { id: 'e43', from: '4', to: '3', state: 'matched' },
        ],
      },
      variables: { BackEdge: '2 -> 0', low2: 0, low1: 0, low0: 0 },
    },
    {
      stepNumber: 4,
      title: 'Step 4: Pop SCC #1 {0, 1, 2} — Reverse Topo Order Guaranteed',
      explanation:
        'Since low[0] == tin[0] == 0, pop [2, 1, 0] into SCC #1. Notice SCC #1 (source) has ID 1 > SCC #0 (sink) ID 0, so in 2-SAT `comp[x] < comp[!x]` picks true sinks!',
      mode: 'graph',
      graph: {
        calloutMetric: 'Condensation DAG: SCC#1 {0,1,2} ──▶ SCC#0 {3,4}',
        nodes: [
          { id: '0', label: '0* SCC#1', x: 85, y: 150, state: 'matched', matchWith: null },
          { id: '1', label: '1* SCC#1', x: 215, y: 70, state: 'matched', matchWith: null },
          { id: '2', label: '2* SCC#1', x: 215, y: 230, state: 'matched', matchWith: null },
          { id: '3', label: '3* SCC#0', x: 380, y: 150, state: 'matched', matchWith: null },
          { id: '4', label: '4* SCC#0', x: 520, y: 150, state: 'matched', matchWith: null },
        ],
        edges: [
          { id: 'e01', from: '0', to: '1', state: 'matched' },
          { id: 'e12', from: '1', to: '2', state: 'matched' },
          { id: 'e20', from: '2', to: '0', state: 'matched' },
          { id: 'e23', from: '2', to: '3', state: 'augmenting' },
          { id: 'e34', from: '3', to: '4', state: 'matched' },
          { id: 'e43', from: '4', to: '3', state: 'matched' },
        ],
      },
      variables: { TotalSCCs: 2, DagEdge: 'SCC#1 -> SCC#0', Stack: '[]' },
    },
  ],
  reductionClues: [
    {
      clue: '"Directed graph with cycles; maximize coins/paths when visiting each vertex arbitrarily many times"',
      translation: 'Condense SCCs with Tarjan into a DAG; sum vertex weights inside each SCC and run DAG DP.',
    },
    {
      clue: '"Each item/switch is either + or -; N conditions of the form (at least one of A or B holds)"',
      translation: '2-SAT: build implication graph of 2N literals (!A -> B and !B -> A), check comp[2x] != comp[2x+1], assign comp[2x] < comp[2x+1].',
    },
    {
      clue: '"Remove a single edge / single node to disconnect the network (critical links)"',
      translation: 'Undirected Tarjan Bridges (low[v] > tin[u]) and Articulation Points (low[v] >= tin[u] + root child count >= 2).',
    },
    {
      clue: '"Minimum directed edges to add so the entire graph becomes 1 strongly connected component"',
      translation: 'Condense SCCs into DAG. If scc_cnt == 1 answer 0; else max(count(in_deg == 0), count(out_deg == 0)).',
    },
  ],
  timeComplexity: 'O(V + E) single DFS pass (or 2 passes for Kosaraju)',
  spaceComplexity: 'O(V + E)',
  pitfalls: [
    {
      type: 'WA',
      title: 'Omitting the `onStack[v]` Check in Directed Tarjan',
      detail:
        'In a directed graph, a cross-edge to a vertex `v` from an ALREADY popped SCC still has smaller `tin[v]`. Without `if (onStack[v]) low[u] = min(low[u], tin[v])`, two unrelated SCCs illegally merge!',
    },
    {
      type: 'WA',
      title: 'Forgetting Parallel Edges When Finding Undirected Bridges',
      detail:
        'Passing `parent_vertex` breaks when two parallel edges connect (u, v): neither edge is a bridge! Always pass `parent_edge_id` (not parent vertex) in undirected bridge/BCC DFS.',
    },
    {
      type: 'RE',
      title: 'Recursion Stack Overflow at N = 2*10^5 in Python/Java',
      detail:
        'A long chain of 2e5 vertices crashes recursive DFS in Python or default-stack Java. Use iterative Tarjan or large stack (`sys.setrecursionlimit` + thread stack in Java/Python).',
    },
    {
      type: 'WA',
      title: 'Reversed 2-SAT Inequality Direction Between Tarjan & Kosaraju',
      detail:
        'Tarjan assigns SMALLER IDs to SINK SCCs (reverse topo order), so pick literal `i` true iff `comp[i] < comp[i^1]`. Kosaraju assigns LARGER IDs to sinks, flipping the inequality!',
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
    vector<vector<int>> adj(n + 1);
    for (int i = 0; i < m; ++i) {
        int u, v;
        cin >> u >> v;
        adj[u].push_back(v);
    }

    vector<int> tin(n + 1, -1), low(n + 1, 0), comp(n + 1, -1), st;
    vector<char> on_st(n + 1, 0);
    int timer = 0, scc_cnt = 0;

    auto dfs = [&](auto&& self, int u) -> void {
        tin[u] = low[u] = timer++;
        st.push_back(u);
        on_st[u] = 1;
        for (int v : adj[u]) {
            if (tin[v] == -1) {
                self(self, v);
                low[u] = min(low[u], low[v]);
            } else if (on_st[v]) {
                low[u] = min(low[u], tin[v]);
            }
        }
        if (low[u] == tin[u]) {
            while (true) {
                int x = st.back();
                st.pop_back();
                on_st[x] = 0;
                comp[x] = scc_cnt;
                if (x == u) break;
            }
            scc_cnt++;
        }
    };

    for (int i = 1; i <= n; ++i) {
        if (tin[i] == -1) dfs(dfs, i);
    }

    cout << scc_cnt << '\\n';
    for (int i = 1; i <= n; ++i) {
        // Re-index to 1..scc_cnt in topological order (sources first)
        cout << (scc_cnt - comp[i]) << (i == n ? '\\n' : ' ');
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
    let m: usize = it.next().unwrap().parse().unwrap();

    let mut adj = vec![Vec::<usize>::new(); n + 1];
    for _ in 0..m {
        let u: usize = it.next().unwrap().parse().unwrap();
        let v: usize = it.next().unwrap().parse().unwrap();
        adj[u].push(v);
    }

    // Iterative Tarjan SCC to guarantee zero stack overflow at N = 2e5
    let mut tin = vec![usize::MAX; n + 1];
    let mut low = vec![0usize; n + 1];
    let mut comp = vec![0usize; n + 1];
    let mut on_st = vec![false; n + 1];
    let mut tarjan_st = Vec::with_capacity(n);
    let mut dfs_st: Vec<(usize, usize)> = Vec::with_capacity(n);
    let mut timer = 0usize;
    let mut scc_cnt = 0usize;

    for start in 1..=n {
        if tin[start] != usize::MAX {
            continue;
        }
        tin[start] = timer;
        low[start] = timer;
        timer += 1;
        tarjan_st.push(start);
        on_st[start] = true;
        dfs_st.push((start, 0));

        while let Some((u, idx)) = dfs_st.pop() {
            if idx < adj[u].len() {
                dfs_st.push((u, idx + 1));
                let v = adj[u][idx];
                if tin[v] == usize::MAX {
                    tin[v] = timer;
                    low[v] = timer;
                    timer += 1;
                    tarjan_st.push(v);
                    on_st[v] = true;
                    dfs_st.push((v, 0));
                } else if on_st[v] && tin[v] < low[u] {
                    low[u] = tin[v];
                }
            } else {
                if let Some(&(p, _)) = dfs_st.last() {
                    if low[u] < low[p] {
                        low[p] = low[u];
                    }
                }
                if low[u] == tin[u] {
                    while let Some(x) = tarjan_st.pop() {
                        on_st[x] = false;
                        comp[x] = scc_cnt;
                        if x == u {
                            break;
                        }
                    }
                    scc_cnt += 1;
                }
            }
        }
    }

    println!("{}", scc_cnt);
    let out: Vec<String> = (1..=n).map(|i| (scc_cnt - comp[i]).to_string()).collect();
    println!("{}", out.join(" "));
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

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        int n = fs.nextInt();
        if (n == Integer.MIN_VALUE) return;
        int m = fs.nextInt();

        int[] head = new int[n + 1];
        Arrays.fill(head, -1);
        int[] to = new int[m];
        int[] next = new int[m];
        for (int i = 0; i < m; i++) {
            int u = fs.nextInt();
            int v = fs.nextInt();
            to[i] = v;
            next[i] = head[u];
            head[u] = i;
        }

        int[] tin = new int[n + 1];
        Arrays.fill(tin, -1);
        int[] low = new int[n + 1];
        int[] comp = new int[n + 1];
        boolean[] onSt = new boolean[n + 1];

        int[] tarjanSt = new int[n + 1];
        int tTop = 0;

        int[] dfsU = new int[n + 1];
        int[] dfsE = new int[n + 1];
        int[] dfsParent = new int[n + 1];
        int dTop = 0;

        int timer = 0, sccCnt = 0;

        for (int start = 1; start <= n; start++) {
            if (tin[start] != -1) continue;
            tin[start] = low[start] = timer++;
            tarjanSt[tTop++] = start;
            onSt[start] = true;

            dfsU[dTop] = start;
            dfsE[dTop] = head[start];
            dfsParent[dTop] = -1;
            dTop++;

            while (dTop > 0) {
                int idx = dTop - 1;
                int u = dfsU[idx];
                int e = dfsE[idx];
                if (e != -1) {
                    dfsE[idx] = next[e];
                    int v = to[e];
                    if (tin[v] == -1) {
                        tin[v] = low[v] = timer++;
                        tarjanSt[tTop++] = v;
                        onSt[v] = true;
                        dfsU[dTop] = v;
                        dfsE[dTop] = head[v];
                        dfsParent[dTop] = u;
                        dTop++;
                    } else if (onSt[v] && tin[v] < low[u]) {
                        low[u] = tin[v];
                    }
                } else {
                    int p = dfsParent[idx];
                    dTop--;
                    if (p != -1 && low[u] < low[p]) {
                        low[p] = low[u];
                    }
                    if (low[u] == tin[u]) {
                        while (true) {
                            int x = tarjanSt[--tTop];
                            onSt[x] = false;
                            comp[x] = sccCnt;
                            if (x == u) break;
                        }
                        sccCnt++;
                    }
                }
            }
        }

        StringBuilder sb = new StringBuilder();
        sb.append(sccCnt).append('\\n');
        for (int i = 1; i <= n; i++) {
            if (i > 1) sb.append(' ');
            sb.append(sccCnt - comp[i]);
        }
        System.out.println(sb);
    }
}`,
    python3: `import sys

def solve() -> None:
    data = sys.stdin.buffer.read().split()
    if not data:
        return
    it = iter(data)
    n = int(next(it))
    m = int(next(it))

    adj = [[] for _ in range(n + 1)]
    for _ in range(m):
        adj[int(next(it))].append(int(next(it)))

    tin = [-1] * (n + 1)
    low = [0] * (n + 1)
    comp = [0] * (n + 1)
    on_st = [False] * (n + 1)
    tarjan_st = []
    dfs_st = []
    timer = 0
    scc_cnt = 0

    for start in range(1, n + 1):
        if tin[start] != -1:
            continue
        tin[start] = low[start] = timer
        timer += 1
        tarjan_st.append(start)
        on_st[start] = True
        dfs_st.append([start, 0])

        while dfs_st:
            u, idx = dfs_st[-1]
            if idx < len(adj[u]):
                dfs_st[-1][1] = idx + 1
                v = adj[u][idx]
                if tin[v] == -1:
                    tin[v] = low[v] = timer
                    timer += 1
                    tarjan_st.append(v)
                    on_st[v] = True
                    dfs_st.append([v, 0])
                elif on_st[v] and tin[v] < low[u]:
                    low[u] = tin[v]
            else:
                dfs_st.pop()
                if dfs_st:
                    p = dfs_st[-1][0]
                    if low[u] < low[p]:
                        low[p] = low[u]
                if low[u] == tin[u]:
                    while True:
                        x = tarjan_st.pop()
                        on_st[x] = False
                        comp[x] = scc_cnt
                        if x == u:
                            break
                    scc_cnt += 1

    sys.stdout.write(f"{scc_cnt}\\n")
    sys.stdout.write(" ".join(str(scc_cnt - comp[i]) for i in range(1, n + 1)) + "\\n")

if __name__ == "__main__":
    solve()`,
    ruby: `data = STDIN.read.split.map(&:to_i)
exit if data.empty?
idx = 0
n = data[idx]; m = data[idx + 1]; idx += 2

adj = Array.new(n + 1) { [] }
m.times do
  adj[data[idx]] << data[idx + 1]
  idx += 2
end

tin = Array.new(n + 1, -1)
low = Array.new(n + 1, 0)
comp = Array.new(n + 1, 0)
on_st = Array.new(n + 1, false)
tarjan_st = []
dfs_st = []
timer = 0
scc_cnt = 0

(1..n).each do |start|
  next if tin[start] != -1
  tin[start] = low[start] = timer
  timer += 1
  tarjan_st << start
  on_st[start] = true
  dfs_st << [start, 0]

  until dfs_st.empty?
    top = dfs_st[-1]
    u = top[0]; i = top[1]
    if i < adj[u].size
      top[1] = i + 1
      v = adj[u][i]
      if tin[v] == -1
        tin[v] = low[v] = timer
        timer += 1
        tarjan_st << v
        on_st[v] = true
        dfs_st << [v, 0]
      elsif on_st[v] && tin[v] < low[u]
        low[u] = tin[v]
      end
    else
      dfs_st.pop
      unless dfs_st.empty?
        p = dfs_st[-1][0]
        low[p] = low[u] if low[u] < low[p]
      end
      if low[u] == tin[u]
        loop do
          x = tarjan_st.pop
          on_st[x] = false
          comp[x] = scc_cnt
          break if x == u
        end
        scc_cnt += 1
      end
    end
  end
end

puts scc_cnt
puts (1..n).map { |i| scc_cnt - comp[i] }.join(" ")`,
  },
  practiceProblems: [
    {
      id: 'gr34-p1',
      tier: 'Warmup',
      ratingRange: '1500–1650',
      title: 'Critical Bridges in an Undirected Network',
      statement:
        'Given an undirected graph with N vertices and M edges (possibly with parallel edges), find all bridges—edges whose removal increases the number of connected components. Output the number of bridges followed by their 1-based edge indices.',
      constraints: '1 <= N <= 10^5, 0 <= M <= 2*10^5.',
      sampleInput: `5 5
1 2
2 3
3 1
3 4
4 5`,
      sampleOutput: `2
4 5`,
      hints: [
        'Track edge IDs instead of parent vertex IDs so parallel edges are NEVER falsely skipped as the tree parent edge.',
        'Tree edge (u -> v) with ID e is a bridge iff low[v] > tin[u].',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    if (!(cin >> n >> m)) return 0;
    vector<vector<pair<int, int>>> adj(n + 1);
    for (int i = 1; i <= m; ++i) {
        int u, v; cin >> u >> v;
        adj[u].push_back({v, i});
        adj[v].push_back({u, i});
    }
    vector<int> tin(n + 1, -1), low(n + 1, 0), bridges;
    int timer = 0;
    auto dfs = [&](auto&& self, int u, int pe) -> void {
        tin[u] = low[u] = timer++;
        for (auto [v, id] : adj[u]) {
            if (id == pe) continue;
            if (tin[v] != -1) {
                low[u] = min(low[u], tin[v]);
            } else {
                self(self, v, id);
                low[u] = min(low[u], low[v]);
                if (low[v] > tin[u]) bridges.push_back(id);
            }
        }
    };
    for (int i = 1; i <= n; ++i) if (tin[i] == -1) dfs(dfs, i, -1);
    sort(bridges.begin(), bridges.end());
    cout << bridges.size() << '\\n';
    for (size_t i = 0; i < bridges.size(); ++i)
        cout << bridges[i] << (i + 1 == bridges.size() ? "" : " ");
    cout << '\\n';
    return 0;
}`,
        rust: `use std::io::{self, Read};

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let n: usize = match it.next() { Some(x) => x.parse().unwrap(), None => return };
    let m: usize = it.next().unwrap().parse().unwrap();
    let mut adj = vec![Vec::<(usize, usize)>::new(); n + 1];
    for id in 1..=m {
        let u: usize = it.next().unwrap().parse().unwrap();
        let v: usize = it.next().unwrap().parse().unwrap();
        adj[u].push((v, id));
        adj[v].push((u, id));
    }
    let mut tin = vec![usize::MAX; n + 1];
    let mut low = vec![0usize; n + 1];
    let mut bridges = Vec::new();
    let mut st: Vec<(usize, usize, usize)> = Vec::new(); // (u, pe, edge_idx)
    let mut timer = 0usize;

    for root in 1..=n {
        if tin[root] != usize::MAX { continue; }
        tin[root] = timer; low[root] = timer; timer += 1;
        st.push((root, 0, 0));
        while let Some((u, pe, idx)) = st.pop() {
            if idx < adj[u].len() {
                st.push((u, pe, idx + 1));
                let (v, id) = adj[u][idx];
                if id == pe { continue; }
                if tin[v] != usize::MAX {
                    if tin[v] < low[u] { low[u] = tin[v]; }
                } else {
                    tin[v] = timer; low[v] = timer; timer += 1;
                    st.push((v, id, 0));
                }
            } else if let Some(&(p, _, _)) = st.last() {
                if low[u] < low[p] { low[p] = low[u]; }
                if low[u] > tin[p] { bridges.push(pe); }
            }
        }
    }
    bridges.sort_unstable();
    println!("{}", bridges.len());
    let ans: Vec<String> = bridges.iter().map(|x| x.to_string()).collect();
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
        int nextInt() throws IOException {
            int c; while ((c = read()) <= 32) if (c == -1) return Integer.MIN_VALUE;
            int s = 1; if (c == '-') { s = -1; c = read(); }
            int v = 0; while (c > 32) { v = v * 10 + (c - '0'); c = read(); }
            return v * s;
        }
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        int n = fs.nextInt(); if (n == Integer.MIN_VALUE) return;
        int m = fs.nextInt();
        int[] head = new int[n + 1]; Arrays.fill(head, -1);
        int[] to = new int[2 * m], eid = new int[2 * m], next = new int[2 * m];
        int ptr = 0;
        for (int i = 1; i <= m; i++) {
            int u = fs.nextInt(), v = fs.nextInt();
            to[ptr] = v; eid[ptr] = i; next[ptr] = head[u]; head[u] = ptr++;
            to[ptr] = u; eid[ptr] = i; next[ptr] = head[v]; head[v] = ptr++;
        }
        int[] tin = new int[n + 1]; Arrays.fill(tin, -1);
        int[] low = new int[n + 1], stU = new int[n + 1], stE = new int[n + 1], stPe = new int[n + 1], stP = new int[n + 1];
        ArrayList<Integer> bridges = new ArrayList<>();
        int timer = 0;
        for (int r = 1; r <= n; r++) {
            if (tin[r] != -1) continue;
            int top = 0;
            tin[r] = low[r] = timer++;
            stU[top] = r; stE[top] = head[r]; stPe[top] = 0; stP[top] = -1; top++;
            while (top > 0) {
                int idx = top - 1, u = stU[idx], e = stE[idx];
                if (e != -1) {
                    stE[idx] = next[e];
                    int v = to[e], id = eid[e];
                    if (id == stPe[idx]) continue;
                    if (tin[v] != -1) {
                        if (tin[v] < low[u]) low[u] = tin[v];
                    } else {
                        tin[v] = low[v] = timer++;
                        stU[top] = v; stE[top] = head[v]; stPe[top] = id; stP[top] = u; top++;
                    }
                } else {
                    int p = stP[idx], pe = stPe[idx];
                    top--;
                    if (p != -1) {
                        if (low[u] < low[p]) low[p] = low[u];
                        if (low[u] > tin[p]) bridges.add(pe);
                    }
                }
            }
        }
        Collections.sort(bridges);
        StringBuilder sb = new StringBuilder();
        sb.append(bridges.size()).append('\\n');
        for (int i = 0; i < bridges.size(); i++) {
            if (i > 0) sb.append(' ');
            sb.append(bridges.get(i));
        }
        System.out.println(sb);
    }
}`,
        python3: `import sys
def solve():
    data = sys.stdin.buffer.read().split()
    if not data: return
    it = iter(data)
    n, m = int(next(it)), int(next(it))
    adj = [[] for _ in range(n + 1)]
    for eid in range(1, m + 1):
        u, v = int(next(it)), int(next(it))
        adj[u].append((v, eid))
        adj[v].append((u, eid))
    tin = [-1] * (n + 1)
    low = [0] * (n + 1)
    bridges = []
    timer = 0
    for root in range(1, n + 1):
        if tin[root] != -1: continue
        tin[root] = low[root] = timer; timer += 1
        st = [[root, 0, 0]]
        while st:
            u, pe, idx = st[-1]
            if idx < len(adj[u]):
                st[-1][2] = idx + 1
                v, eid = adj[u][idx]
                if eid == pe: continue
                if tin[v] != -1:
                    if tin[v] < low[u]: low[u] = tin[v]
                else:
                    tin[v] = low[v] = timer; timer += 1
                    st.append([v, eid, 0])
            else:
                st.pop()
                if st:
                    p = st[-1][0]
                    if low[u] < low[p]: low[p] = low[u]
                    if low[u] > tin[p]: bridges.append(pe)
    bridges.sort()
    sys.stdout.write(f"{len(bridges)}\\n")
    sys.stdout.write(" ".join(map(str, bridges)) + "\\n")
if __name__ == "__main__":
    solve()`,
        ruby: `data = STDIN.read.split.map(&:to_i)
exit if data.empty?
idx = 0; n = data[idx]; m = data[idx + 1]; idx += 2
adj = Array.new(n + 1) { [] }
(1..m).each do |eid|
  u = data[idx]; v = data[idx + 1]; idx += 2
  adj[u] << [v, eid]; adj[v] << [u, eid]
end
tin = Array.new(n + 1, -1); low = Array.new(n + 1, 0); bridges = []; timer = 0
(1..n).each do |root|
  next if tin[root] != -1
  tin[root] = low[root] = timer; timer += 1
  st = [[root, 0, 0]]
  until st.empty?
    top = st[-1]; u = top[0]; pe = top[1]; i = top[2]
    if i < adj[u].size
      top[2] = i + 1; v, eid = adj[u][i]
      next if eid == pe
      if tin[v] != -1
        low[u] = tin[v] if tin[v] < low[u]
      else
        tin[v] = low[v] = timer; timer += 1
        st << [v, eid, 0]
      end
    else
      st.pop
      unless st.empty?
        p = st[-1][0]
        low[p] = low[u] if low[u] < low[p]
        bridges << pe if low[u] > tin[p]
      end
    end
  end
end
bridges.sort!
puts bridges.size
puts bridges.join(" ")`,
      },
    },
    {
      id: 'gr34-p2',
      tier: 'Standard',
      ratingRange: '1650–1800',
      title: 'Planets and Kingdoms (SCC Condensation)',
      statement:
        'A game has N planets and M teleporters. Two planets belong to the same kingdom if each can reach the other via teleporters. Output the total number of kingdoms K, and assign each planet a kingdom label 1..K.',
      constraints: '1 <= N <= 10^5, 1 <= M <= 2*10^5.',
      sampleInput: `5 6
1 2
2 3
3 1
3 4
4 5
5 4`,
      sampleOutput: `2
1 1 1 2 2`,
      hints: [
        'Each kingdom is literally one Strongly Connected Component in the directed teleporter graph.',
        'Running Tarjan SCC gives `comp[u]` in reverse topological order; mapping `scc_cnt - comp[u]` assigns 1..K cleanly in topological order.',
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
    for (int i = 0; i < m; ++i) {
        int u, v; cin >> u >> v;
        adj[u].push_back(v);
    }
    vector<int> tin(n + 1, -1), low(n + 1), comp(n + 1), st;
    vector<char> on(n + 1, 0);
    int timer = 0, k = 0;
    auto dfs = [&](auto&& self, int u) -> void {
        tin[u] = low[u] = timer++;
        st.push_back(u); on[u] = 1;
        for (int v : adj[u]) {
            if (tin[v] == -1) { self(self, v); low[u] = min(low[u], low[v]); }
            else if (on[v]) low[u] = min(low[u], tin[v]);
        }
        if (low[u] == tin[u]) {
            while (true) {
                int x = st.back(); st.pop_back(); on[x] = 0; comp[x] = k;
                if (x == u) break;
            }
            k++;
        }
    };
    for (int i = 1; i <= n; ++i) if (tin[i] == -1) dfs(dfs, i);
    cout << k << '\\n';
    for (int i = 1; i <= n; ++i) cout << (k - comp[i]) << (i == n ? '\\n' : ' ');
    return 0;
}`,
        rust: `use std::io::{self, Read};

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let n: usize = match it.next() { Some(x) => x.parse().unwrap(), None => return };
    let m: usize = it.next().unwrap().parse().unwrap();
    let mut adj = vec![Vec::<usize>::new(); n + 1];
    for _ in 0..m {
        let u: usize = it.next().unwrap().parse().unwrap();
        let v: usize = it.next().unwrap().parse().unwrap();
        adj[u].push(v);
    }
    let mut tin = vec![usize::MAX; n + 1];
    let mut low = vec![0usize; n + 1];
    let mut comp = vec![0usize; n + 1];
    let mut on = vec![false; n + 1];
    let mut ts = Vec::new();
    let mut ds: Vec<(usize, usize)> = Vec::new();
    let (mut timer, mut k) = (0usize, 0usize);
    for root in 1..=n {
        if tin[root] != usize::MAX { continue; }
        tin[root] = timer; low[root] = timer; timer += 1;
        ts.push(root); on[root] = true; ds.push((root, 0));
        while let Some((u, idx)) = ds.pop() {
            if idx < adj[u].len() {
                ds.push((u, idx + 1));
                let v = adj[u][idx];
                if tin[v] == usize::MAX {
                    tin[v] = timer; low[v] = timer; timer += 1;
                    ts.push(v); on[v] = true; ds.push((v, 0));
                } else if on[v] && tin[v] < low[u] { low[u] = tin[v]; }
            } else {
                if let Some(&(p, _)) = ds.last() { if low[u] < low[p] { low[p] = low[u]; } }
                if low[u] == tin[u] {
                    while let Some(x) = ts.pop() {
                        on[x] = false; comp[x] = k; if x == u { break; }
                    }
                    k += 1;
                }
            }
        }
    }
    println!("{}", k);
    let out: Vec<String> = (1..=n).map(|i| (k - comp[i]).to_string()).collect();
    println!("{}", out.join(" "));
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

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        int n = fs.nextInt(); if (n == Integer.MIN_VALUE) return;
        int m = fs.nextInt();
        int[] head = new int[n + 1]; Arrays.fill(head, -1);
        int[] to = new int[m], next = new int[m];
        for (int i = 0; i < m; i++) {
            int u = fs.nextInt(), v = fs.nextInt();
            to[i] = v; next[i] = head[u]; head[u] = i;
        }
        int[] tin = new int[n + 1]; Arrays.fill(tin, -1);
        int[] low = new int[n + 1], comp = new int[n + 1], ts = new int[n + 1];
        int[] du = new int[n + 1], de = new int[n + 1], dp = new int[n + 1];
        boolean[] on = new boolean[n + 1];
        int timer = 0, k = 0, tTop = 0, dTop = 0;
        for (int r = 1; r <= n; r++) {
            if (tin[r] != -1) continue;
            tin[r] = low[r] = timer++; ts[tTop++] = r; on[r] = true;
            du[dTop] = r; de[dTop] = head[r]; dp[dTop] = -1; dTop++;
            while (dTop > 0) {
                int idx = dTop - 1, u = du[idx], e = de[idx];
                if (e != -1) {
                    de[idx] = next[e]; int v = to[e];
                    if (tin[v] == -1) {
                        tin[v] = low[v] = timer++; ts[tTop++] = v; on[v] = true;
                        du[dTop] = v; de[dTop] = head[v]; dp[dTop] = u; dTop++;
                    } else if (on[v] && tin[v] < low[u]) low[u] = tin[v];
                } else {
                    int p = dp[idx]; dTop--;
                    if (p != -1 && low[u] < low[p]) low[p] = low[u];
                    if (low[u] == tin[u]) {
                        while (true) { int x = ts[--tTop]; on[x] = false; comp[x] = k; if (x == u) break; }
                        k++;
                    }
                }
            }
        }
        StringBuilder sb = new StringBuilder();
        sb.append(k).append('\\n');
        for (int i = 1; i <= n; i++) {
            if (i > 1) sb.append(' ');
            sb.append(k - comp[i]);
        }
        System.out.println(sb);
    }
}`,
        python3: `import sys
def solve():
    data = sys.stdin.buffer.read().split()
    if not data: return
    it = iter(data)
    n, m = int(next(it)), int(next(it))
    adj = [[] for _ in range(n + 1)]
    for _ in range(m): adj[int(next(it))].append(int(next(it)))
    tin = [-1] * (n + 1); low = [0] * (n + 1); comp = [0] * (n + 1)
    on = [False] * (n + 1); ts = []; ds = []; timer = 0; k = 0
    for r in range(1, n + 1):
        if tin[r] != -1: continue
        tin[r] = low[r] = timer; timer += 1; ts.append(r); on[r] = True; ds.append([r, 0])
        while ds:
            u, idx = ds[-1]
            if idx < len(adj[u]):
                ds[-1][1] = idx + 1; v = adj[u][idx]
                if tin[v] == -1:
                    tin[v] = low[v] = timer; timer += 1; ts.append(v); on[v] = True; ds.append([v, 0])
                elif on[v] and tin[v] < low[u]: low[u] = tin[v]
            else:
                ds.pop()
                if ds and low[u] < low[ds[-1][0]]: low[ds[-1][0]] = low[u]
                if low[u] == tin[u]:
                    while True:
                        x = ts.pop(); on[x] = False; comp[x] = k
                        if x == u: break
                    k += 1
    sys.stdout.write(f"{k}\\n")
    sys.stdout.write(" ".join(str(k - comp[i]) for i in range(1, n + 1)) + "\\n")
if __name__ == "__main__":
    solve()`,
        ruby: `data = STDIN.read.split.map(&:to_i)
exit if data.empty?
idx = 0; n = data[idx]; m = data[idx + 1]; idx += 2
adj = Array.new(n + 1) { [] }
m.times { adj[data[idx]] << data[idx + 1]; idx += 2 }
tin = Array.new(n + 1, -1); low = Array.new(n + 1, 0); comp = Array.new(n + 1, 0)
on = Array.new(n + 1, false); ts = []; ds = []; timer = 0; k = 0
(1..n).each do |r|
  next if tin[r] != -1
  tin[r] = low[r] = timer; timer += 1; ts << r; on[r] = true; ds << [r, 0]
  until ds.empty?
    top = ds[-1]; u = top[0]; i = top[1]
    if i < adj[u].size
      top[1] = i + 1; v = adj[u][i]
      if tin[v] == -1
        tin[v] = low[v] = timer; timer += 1; ts << v; on[v] = true; ds << [v, 0]
      elsif on[v] && tin[v] < low[u]
        low[u] = tin[v]
      end
    else
      ds.pop
      low[ds[-1][0]] = low[u] if !ds.empty? && low[u] < low[ds[-1][0]]
      if low[u] == tin[u]
        loop { x = ts.pop; on[x] = false; comp[x] = k; break if x == u }
        k += 1
      end
    end
  end
end
puts k
puts (1..n).map { |i| k - comp[i] }.join(" ")`,
      },
    },
    {
      id: 'gr34-p3',
      tier: 'Boss',
      ratingRange: '1850–2050',
      title: 'Giant Pizza (2-SAT Implication Graph Solver)',
      statement:
        'M pizza toppings exist and N family members each state two preferences in the form `(+/- a) (+/- b)` (meaning at least one of those two choices must be satisfied on the pizza, e.g., `+ 1 - 2` means topping 1 included OR topping 2 excluded). Print M characters `+` or `-` satisfying everyone, or `IMPOSSIBLE`.',
      constraints: '1 <= N, M <= 10^5.',
      sampleInput: `3 5
+ 1 + 2
- 1 + 3
+ 4 - 2`,
      sampleOutput: `- + + + -`,
      hints: [
        'Represent topping i (0-indexed) as two literals: `2*i` (false/-) and `2*i + 1` (true/+), so negation is `lit ^ 1`.',
        'A clause `(A OR B)` adds directed implications `(A^1 -> B)` and `(B^1 -> A)`. After Tarjan SCC, if any variable has `comp[2*i] == comp[2*i + 1]`, output `IMPOSSIBLE`. Otherwise set `+` if `comp[2*i + 1] < comp[2*i]`.',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    if (!(cin >> n >> m)) return 0;
    int V = 2 * m;
    vector<vector<int>> adj(V);
    auto lit = [](char c, int idx) { return 2 * (idx - 1) + (c == '+' ? 1 : 0); };
    for (int i = 0; i < n; ++i) {
        char c1, c2; int x1, x2;
        cin >> c1 >> x1 >> c2 >> x2;
        int a = lit(c1, x1), b = lit(c2, x2);
        adj[a ^ 1].push_back(b);
        adj[b ^ 1].push_back(a);
    }
    vector<int> tin(V, -1), low(V), comp(V), st;
    vector<char> on(V, 0);
    int timer = 0, scc = 0;
    auto dfs = [&](auto&& self, int u) -> void {
        tin[u] = low[u] = timer++;
        st.push_back(u); on[u] = 1;
        for (int v : adj[u]) {
            if (tin[v] == -1) { self(self, v); low[u] = min(low[u], low[v]); }
            else if (on[v]) low[u] = min(low[u], tin[v]);
        }
        if (low[u] == tin[u]) {
            while (true) {
                int x = st.back(); st.pop_back(); on[x] = 0; comp[x] = scc;
                if (x == u) break;
            }
            scc++;
        }
    };
    for (int i = 0; i < V; ++i) if (tin[i] == -1) dfs(dfs, i);
    string ans(m, '+');
    for (int i = 0; i < m; ++i) {
        if (comp[2 * i] == comp[2 * i + 1]) {
            cout << "IMPOSSIBLE\\n";
            return 0;
        }
        ans[i] = (comp[2 * i + 1] < comp[2 * i]) ? '+' : '-';
    }
    for (int i = 0; i < m; ++i) cout << ans[i] << (i + 1 == m ? '\\n' : ' ');
    return 0;
}`,
        rust: `use std::io::{self, Read};

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let n: usize = match it.next() { Some(x) => x.parse().unwrap(), None => return };
    let m: usize = it.next().unwrap().parse().unwrap();
    let v_cnt = 2 * m;
    let mut adj = vec![Vec::<usize>::new(); v_cnt];
    let parse_lit = |c: &str, idx: usize| -> usize {
        2 * (idx - 1) + if c == "+" { 1 } else { 0 }
    };
    for _ in 0..n {
        let c1 = it.next().unwrap();
        let x1: usize = it.next().unwrap().parse().unwrap();
        let c2 = it.next().unwrap();
        let x2: usize = it.next().unwrap().parse().unwrap();
        let a = parse_lit(c1, x1);
        let b = parse_lit(c2, x2);
        adj[a ^ 1].push(b);
        adj[b ^ 1].push(a);
    }
    let mut tin = vec![usize::MAX; v_cnt];
    let mut low = vec![0usize; v_cnt];
    let mut comp = vec![0usize; v_cnt];
    let mut on = vec![false; v_cnt];
    let mut ts = Vec::new();
    let mut ds: Vec<(usize, usize)> = Vec::new();
    let (mut timer, mut scc) = (0usize, 0usize);
    for r in 0..v_cnt {
        if tin[r] != usize::MAX { continue; }
        tin[r] = timer; low[r] = timer; timer += 1;
        ts.push(r); on[r] = true; ds.push((r, 0));
        while let Some((u, idx)) = ds.pop() {
            if idx < adj[u].len() {
                ds.push((u, idx + 1));
                let v = adj[u][idx];
                if tin[v] == usize::MAX {
                    tin[v] = timer; low[v] = timer; timer += 1;
                    ts.push(v); on[v] = true; ds.push((v, 0));
                } else if on[v] && tin[v] < low[u] { low[u] = tin[v]; }
            } else {
                if let Some(&(p, _)) = ds.last() { if low[u] < low[p] { low[p] = low[u]; } }
                if low[u] == tin[u] {
                    while let Some(x) = ts.pop() {
                        on[x] = false; comp[x] = scc; if x == u { break; }
                    }
                    scc += 1;
                }
            }
        }
    }
    let mut out = Vec::with_capacity(m);
    for i in 0..m {
        if comp[2 * i] == comp[2 * i + 1] {
            println!("IMPOSSIBLE");
            return;
        }
        out.push(if comp[2 * i + 1] < comp[2 * i] { "+" } else { "-" });
    }
    println!("{}", out.join(" "));
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
        String nextToken() throws IOException {
            int c; while ((c = read()) <= 32) if (c == -1) return null;
            StringBuilder sb = new StringBuilder();
            while (c > 32) { sb.append((char) c); c = read(); }
            return sb.toString();
        }
        int nextInt() throws IOException { return Integer.parseInt(nextToken()); }
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        String first = fs.nextToken(); if (first == null) return;
        int n = Integer.parseInt(first), m = fs.nextInt();
        int V = 2 * m;
        int[] head = new int[V]; Arrays.fill(head, -1);
        int[] to = new int[2 * n], next = new int[2 * n];
        int ptr = 0;
        for (int i = 0; i < n; i++) {
            boolean p1 = fs.nextToken().equals("+"); int x1 = fs.nextInt() - 1;
            boolean p2 = fs.nextToken().equals("+"); int x2 = fs.nextInt() - 1;
            int a = 2 * x1 + (p1 ? 1 : 0), b = 2 * x2 + (p2 ? 1 : 0);
            to[ptr] = b; next[ptr] = head[a ^ 1]; head[a ^ 1] = ptr++;
            to[ptr] = a; next[ptr] = head[b ^ 1]; head[b ^ 1] = ptr++;
        }
        int[] tin = new int[V]; Arrays.fill(tin, -1);
        int[] low = new int[V], comp = new int[V], ts = new int[V];
        int[] du = new int[V], de = new int[V], dp = new int[V];
        boolean[] on = new boolean[V];
        int timer = 0, scc = 0, tTop = 0, dTop = 0;
        for (int r = 0; r < V; r++) {
            if (tin[r] != -1) continue;
            tin[r] = low[r] = timer++; ts[tTop++] = r; on[r] = true;
            du[dTop] = r; de[dTop] = head[r]; dp[dTop] = -1; dTop++;
            while (dTop > 0) {
                int idx = dTop - 1, u = du[idx], e = de[idx];
                if (e != -1) {
                    de[idx] = next[e]; int v = to[e];
                    if (tin[v] == -1) {
                        tin[v] = low[v] = timer++; ts[tTop++] = v; on[v] = true;
                        du[dTop] = v; de[dTop] = head[v]; dp[dTop] = u; dTop++;
                    } else if (on[v] && tin[v] < low[u]) low[u] = tin[v];
                } else {
                    int p = dp[idx]; dTop--;
                    if (p != -1 && low[u] < low[p]) low[p] = low[u];
                    if (low[u] == tin[u]) {
                        while (true) { int x = ts[--tTop]; on[x] = false; comp[x] = scc; if (x == u) break; }
                        scc++;
                    }
                }
            }
        }
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < m; i++) {
            if (comp[2 * i] == comp[2 * i + 1]) { System.out.println("IMPOSSIBLE"); return; }
            if (i > 0) sb.append(' ');
            sb.append(comp[2 * i + 1] < comp[2 * i] ? '+' : '-');
        }
        System.out.println(sb);
    }
}`,
        python3: `import sys
def solve():
    data = sys.stdin.buffer.read().split()
    if not data: return
    it = iter(data)
    n, m = int(next(it)), int(next(it))
    V = 2 * m
    adj = [[] for _ in range(V)]
    for _ in range(n):
        c1, x1 = next(it), int(next(it)) - 1
        c2, x2 = next(it), int(next(it)) - 1
        a = 2 * x1 + (1 if c1 == b"+" else 0)
        b = 2 * x2 + (1 if c2 == b"+" else 0)
        adj[a ^ 1].append(b); adj[b ^ 1].append(a)
    tin = [-1] * V; low = [0] * V; comp = [0] * V; on = [False] * V
    ts = []; ds = []; timer = 0; scc = 0
    for r in range(V):
        if tin[r] != -1: continue
        tin[r] = low[r] = timer; timer += 1; ts.append(r); on[r] = True; ds.append([r, 0])
        while ds:
            u, idx = ds[-1]
            if idx < len(adj[u]):
                ds[-1][1] = idx + 1; v = adj[u][idx]
                if tin[v] == -1:
                    tin[v] = low[v] = timer; timer += 1; ts.append(v); on[v] = True; ds.append([v, 0])
                elif on[v] and tin[v] < low[u]: low[u] = tin[v]
            else:
                ds.pop()
                if ds and low[u] < low[ds[-1][0]]: low[ds[-1][0]] = low[u]
                if low[u] == tin[u]:
                    while True:
                        x = ts.pop(); on[x] = False; comp[x] = scc
                        if x == u: break
                    scc += 1
    out = []
    for i in range(m):
        if comp[2 * i] == comp[2 * i + 1]:
            print("IMPOSSIBLE"); return
        out.append("+" if comp[2 * i + 1] < comp[2 * i] else "-")
    sys.stdout.write(" ".join(out) + "\\n")
if __name__ == "__main__":
    solve()`,
        ruby: `toks = STDIN.read.split
exit if toks.empty?
idx = 0; n = toks[idx].to_i; m = toks[idx + 1].to_i; idx += 2
v_cnt = 2 * m
adj = Array.new(v_cnt) { [] }
n.times do
  c1 = toks[idx]; x1 = toks[idx + 1].to_i - 1
  c2 = toks[idx + 2]; x2 = toks[idx + 3].to_i - 1
  idx += 4
  a = 2 * x1 + (c1 == "+" ? 1 : 0)
  b = 2 * x2 + (c2 == "+" ? 1 : 0)
  adj[a ^ 1] << b; adj[b ^ 1] << a
end
tin = Array.new(v_cnt, -1); low = Array.new(v_cnt, 0); comp = Array.new(v_cnt, 0)
on = Array.new(v_cnt, false); ts = []; ds = []; timer = 0; scc = 0
v_cnt.times do |r|
  next if tin[r] != -1
  tin[r] = low[r] = timer; timer += 1; ts << r; on[r] = true; ds << [r, 0]
  until ds.empty?
    top = ds[-1]; u = top[0]; i = top[1]
    if i < adj[u].size
      top[1] = i + 1; v = adj[u][i]
      if tin[v] == -1
        tin[v] = low[v] = timer; timer += 1; ts << v; on[v] = true; ds << [v, 0]
      elsif on[v] && tin[v] < low[u]
        low[u] = tin[v]
      end
    else
      ds.pop
      low[ds[-1][0]] = low[u] if !ds.empty? && low[u] < low[ds[-1][0]]
      if low[u] == tin[u]
        loop { x = ts.pop; on[x] = false; comp[x] = scc; break if x == u }
        scc += 1
      end
    end
  end
end
out = []
m.times do |i|
  if comp[2 * i] == comp[2 * i + 1]; puts "IMPOSSIBLE"; exit; end
  out << (comp[2 * i + 1] < comp[2 * i] ? "+" : "-")
end
puts out.join(" ")`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'CSES',
      title: 'Planets and Kingdoms, Giant Pizza & Coin Collector',
      difficulty: 'USACO Gold (1650–2000)',
      url: 'https://cses.fi/problemset/task/1683',
      patternNote: 'Canonical progression: SCC detection -> 2-SAT implication graph -> SCC DAG DP.',
    },
    {
      platform: 'AtCoder',
      title: 'ACL Practice G (SCC) & ACL Practice H (2-SAT)',
      difficulty: 'AtCoder Cyan / Blue (~1600)',
      url: 'https://atcoder.jp/contests/practice2/tasks/practice2_h',
      patternNote: 'Direct reference benchmarks for iterative SCC condensation and geometric 2-SAT.',
    },
    {
      platform: 'Codeforces',
      title: 'CF 427C Checkposts & CF 1986F Non-academic Problem',
      difficulty: 'CF 1700–1900',
      url: 'https://codeforces.com/problemset/problem/427/C',
      patternNote: '427C asks for minimum SCC cost + product of min-node counts; 1986F removes 1 bridge to minimize reachable pairs.',
    },
    {
      platform: 'CodeChef',
      title: 'MCO16405 / CHN16G (SCC Condensation & Bridges)',
      difficulty: 'CodeChef 4★–5★',
      url: 'https://www.codechef.com/tags/problems/tarjan',
      patternNote: 'Condensing cyclic teleportation networks into longest-path DAGs.',
    },
    {
      platform: 'HackerRank',
      title: 'Strongly Connected Components & Critical Edges',
      difficulty: 'Hard',
      url: 'https://www.hackerrank.com/domains/algorithms/graph-theory',
      patternNote: 'Low-link DFS on directed SCCs and undirected bridge/articulation cuts.',
    },
    {
      platform: 'NeetCode 150',
      title: 'Critical Connections in a Network (LeetCode 1192)',
      difficulty: 'FAANG Hard',
      url: 'https://leetcode.com/problems/critical-connections-in-a-network/',
      patternNote: 'Verbatim Tarjan Bridges interview classic—compute tin[] and low[] in one DFS pass.',
    },
  ],
  interviewNotes: [
    'In FAANG interviews, Tarjan Bridges (Critical Connections) is the go-to O(V + E) single-pass algorithm for identifying single points of failure in distributed networks.',
    'Explain clearly why undirected low-link uses `tin[v]` for back edges and `low[v]` for tree edges, and why `onStack[v]` is mandatory in directed SCCs.',
  ],
  projectBlueprint: {
    title: 'Microservice Dependency & Boolean Config Constraint Solver',
    tagline:
      'Detect circular service deadlocks via Tarjan SCC condensation, flag single-point-of-failure network bridges, and resolve feature-flag conflicts with 2-SAT.',
    stackSummary: 'TypeScript + Iterative Tarjan SCC + 2-SAT Implication Engine',
    asciiDiagram:
      'Feature Flag Rules (A or !B) ──▶ [2N Implication Graph] ──▶ Iterative Tarjan SCC\n' +
      '                                                                   │\n' +
      '  Deadlock Cycles + Bridge Alerts + Valid Flag Assignment ◀────────┘',
    milestones: [
      {
        id: 'ch12-m1',
        title: 'Milestone 1: Iterative Tarjan SCC Core',
        detail: 'Implement stack-safe Tarjan SCC detection returning topologically ordered service clusters.',
      },
      {
        id: 'ch12-m2',
        title: 'Milestone 2: 2-SAT Feature-Flag Validator',
        detail: 'Compile boolean OR/XOR/IMP config constraints into 2N implications and synthesize valid boolean assignments.',
      },
      {
        id: 'ch12-m3',
        title: 'Milestone 3: Network Bridge Single-Point-of-Failure Detector',
        detail: 'Run undirected edge-ID low-link DFS to highlight cables whose outage partitions the cluster.',
      },
    ],
    starterCode: `export class TwoSatConfigSolver {
  private readonly vars: number;
  private readonly adj: number[][];

  constructor(numFlags: number) {
    this.vars = numFlags;
    this.adj = Array.from({ length: 2 * numFlags }, () => []);
  }

  private lit(flagIdx: number, isTrue: boolean): number {
    return 2 * flagIdx + (isTrue ? 1 : 0);
  }

  // Enforces (flagA == valA) OR (flagB == valB)
  addClause(flagA: number, valA: boolean, flagB: number, valB: boolean): void {
    const a = this.lit(flagA, valA);
    const b = this.lit(flagB, valB);
    this.adj[a ^ 1].push(b);
    this.adj[b ^ 1].push(a);
  }

  solve(): boolean[] | null {
    const V = 2 * this.vars;
    const tin = new Int32Array(V).fill(-1);
    const low = new Int32Array(V);
    const comp = new Int32Array(V);
    const onSt = new Uint8Array(V);
    const tarjanSt: number[] = [];
    const dfsSt: Array<[number, number]> = [];
    let timer = 0;
    let scc = 0;

    for (let r = 0; r < V; r++) {
      if (tin[r] !== -1) continue;
      tin[r] = low[r] = timer++;
      tarjanSt.push(r);
      onSt[r] = 1;
      dfsSt.push([r, 0]);

      while (dfsSt.length > 0) {
        const top = dfsSt[dfsSt.length - 1];
        const u = top[0];
        if (top[1] < this.adj[u].length) {
          const v = this.adj[u][top[1]++];
          if (tin[v] === -1) {
            tin[v] = low[v] = timer++;
            tarjanSt.push(v);
            onSt[v] = 1;
            dfsSt.push([v, 0]);
          } else if (onSt[v] && tin[v] < low[u]) {
            low[u] = tin[v];
          }
        } else {
          dfsSt.pop();
          if (dfsSt.length > 0) {
            const p = dfsSt[dfsSt.length - 1][0];
            if (low[u] < low[p]) low[p] = low[u];
          }
          if (low[u] === tin[u]) {
            while (true) {
              const x = tarjanSt.pop()!;
              onSt[x] = 0;
              comp[x] = scc;
              if (x === u) break;
            }
            scc++;
          }
        }
      }
    }

    const assignment = new Array<boolean>(this.vars);
    for (let i = 0; i < this.vars; i++) {
      if (comp[2 * i] === comp[2 * i + 1]) return null;
      assignment[i] = comp[2 * i + 1] < comp[2 * i];
    }
    return assignment;
  }
}`,
  },
};
