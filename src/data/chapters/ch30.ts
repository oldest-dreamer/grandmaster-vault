import type { TheoryChapter } from '../../types/vault';

export const CH30_EULERIAN_HIERHOLZER: TheoryChapter = {
  slug: 'eulerian-path-hierholzer',
  topicId: 'gr-35',
  title: 'Eulerian Circuits, Hierholzer & De Bruijn Graphs',
  domain: 'Graph & Tree Theory',
  ratingTier: '1900–2200',
  usacoDivision: 'Gold',
  subtitle:
    'Traverse every edge of a graph exactly once in strict O(V + E) time using current-arc pointer deletion and post-order stack backtracking, powering De Bruijn k-mer assembly and parity-constrained tour optimization.',
  analogyTitle: 'The One-Way Street Snowplow & Ribbon-Splicing Analogy',
  analogyBody:
    'A snowplow driver must clear EVERY street edge in a city exactly once without picking up the plow blade. If you just drive greedily until stuck, you might return to the garage early while an entire downtown loop still sits buried in snow! **Hierholzer’s Algorithm** solves this effortlessly with a stack and a **current-arc pointer** (`head[u]`): walk forward deleting edges as you go until a vertex runs out of outgoing roads; ONLY THEN pop that vertex onto your final reverse-route list (`circuit.push_back(u)`) and step back to the previous intersection. Whenever backtracking hits an intersection with unplowed side streets, the plow dives into that side loop and splices it seamlessly into the exact middle of the main route—never re-scanning a deleted edge thanks to `head[u]`!',
  prerequisites: [
    {
      slug: 'bfs-dfs-01bfs-toposort',
      title: 'BFS, DFS, 0-1 BFS & Topological Sort',
    },
  ],
  traceTitle: 'Interactive Hierholzer Current-Arc Pointer, Edge Deletion & Backtrack Stack Trace',
  traceSubtitle:
    'Trace directed Eulerian circuit reconstruction on 4 nodes (`1->2, 2->3, 3->1, 2->4, 4->2`) showing `head[u]` pointers, active DFS stack, and post-order `circuit[]` output.',
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Step 1: Verify Balanced In/Out Degrees & Walk Main Loop 1 -> 2 -> 3 -> 1',
      explanation:
        'All nodes satisfy inDeg[v] == outDeg[v] (1:1, 2:2, 3:1, 4:1). Start DFS stack at [1]. Consume arc ptr[1]=0 (1->2), then ptr[2]=0 (2->3), then ptr[3]=0 (3->1). Stack = [1, 2, 3, 1].',
      mode: 'graph',
      graph: {
        calloutMetric: 'Stack: [1, 2, 3, 1] | ptr[1]=1, ptr[2]=1, ptr[3]=1 | Side loop 2->4->2 untouched!',
        nodes: [
          { id: '1', label: '1 (ptr=1)', x: 95, y: 165, state: 'active', matchWith: null },
          { id: '2', label: '2 (ptr=1)', x: 235, y: 85, state: 'even', matchWith: null },
          { id: '3', label: '3 (ptr=1)', x: 235, y: 245, state: 'even', matchWith: null },
          { id: '4', label: '4 (ptr=0)', x: 405, y: 85, state: 'unmatched', matchWith: null },
        ],
        edges: [
          { id: 'e12', from: '1', to: '2', state: 'matched' },
          { id: 'e23', from: '2', to: '3', state: 'matched' },
          { id: 'e31', from: '3', to: '1', state: 'matched' },
          { id: 'e24', from: '2', to: '4', state: 'default' },
          { id: 'e42', from: '4', to: '2', state: 'default' },
        ],
      },
      variables: { Stack: '[1, 2, 3, 1]', CircuitRev: '[]', RemainingEdges: 2 },
    },
    {
      stepNumber: 2,
      title: 'Step 2: Node 1 Has No Unused Edges -> Pop 1 & 3, Pause at Node 2!',
      explanation:
        'Node 1 has ptr[1] == deg[1]: pop 1 into circuitRev=[1]. Back at node 3: ptr[3] == deg[3]: pop 3 into circuitRev=[1, 3]. Back at node 2: ptr[2]=1 < deg[2]=2! Edge 2->4 is STILL waiting!',
      mode: 'graph',
      graph: {
        calloutMetric: 'Popped Dead-Ends: [1, 3] | Resumed at Node 2 via Unused Edge 2->4',
        nodes: [
          { id: '1', label: '1 [POPPED]', x: 95, y: 165, state: 'matched', matchWith: null },
          { id: '2', label: '2* (ptr=1->2)', x: 235, y: 85, state: 'active', matchWith: null },
          { id: '3', label: '3 [POPPED]', x: 235, y: 245, state: 'matched', matchWith: null },
          { id: '4', label: '4 (ptr=0)', x: 405, y: 85, state: 'odd', matchWith: null },
        ],
        edges: [
          { id: 'e12', from: '1', to: '2', state: 'contracted' },
          { id: 'e23', from: '2', to: '3', state: 'contracted' },
          { id: 'e31', from: '3', to: '1', state: 'contracted' },
          { id: 'e24', from: '2', to: '4', state: 'augmenting' },
          { id: 'e42', from: '4', to: '2', state: 'default' },
        ],
      },
      variables: { Stack: '[1, 2]', CircuitRev: '[1, 3]', NextArcFrom2: '2 -> 4' },
    },
    {
      stepNumber: 3,
      title: 'Step 3: Traverse Detour Loop 2 -> 4 -> 2 Using Current-Arc Pointers',
      explanation:
        'Advance ptr[2] to 2 (consume 2->4), push 4. Advance ptr[4] to 1 (consume 4->2), push 2. Stack = [1, 2, 4, 2]. All 5 edges in the entire graph are now consumed!',
      mode: 'graph',
      graph: {
        calloutMetric: 'Detour Consumed: 2->4->2 | All 5 Edges Exhausted in Strict O(V + E)',
        nodes: [
          { id: '1', label: '1 [DONE]', x: 95, y: 165, state: 'matched', matchWith: null },
          { id: '2', label: '2 (ptr=2)', x: 235, y: 85, state: 'active', matchWith: null },
          { id: '3', label: '3 [DONE]', x: 235, y: 245, state: 'matched', matchWith: null },
          { id: '4', label: '4 (ptr=1)', x: 405, y: 85, state: 'even', matchWith: null },
        ],
        edges: [
          { id: 'e12', from: '1', to: '2', state: 'contracted' },
          { id: 'e23', from: '2', to: '3', state: 'contracted' },
          { id: 'e31', from: '3', to: '1', state: 'contracted' },
          { id: 'e24', from: '2', to: '4', state: 'matched' },
          { id: 'e42', from: '4', to: '2', state: 'matched' },
        ],
      },
      variables: { Stack: '[1, 2, 4, 2]', CircuitRev: '[1, 3]', RemainingEdges: 0 },
    },
    {
      stepNumber: 4,
      title: 'Step 4: Unwind Stack & Reverse CircuitRev -> [1, 2, 4, 2, 3, 1]',
      explanation:
        'Pop remaining stack [2, 4, 2, 1] -> circuitRev = [1, 3, 2, 4, 2, 1]. Reversing produces the spliced Eulerian Circuit: 1 -> 2 -> 4 -> 2 -> 3 -> 1, visiting all 5 edges once!',
      mode: 'graph',
      graph: {
        calloutMetric: 'Final Reversed Circuit: 1 -> 2 -> 4 -> 2 -> 3 -> 1 (Length E+1 = 6)',
        nodes: [
          { id: '1', label: '1 (Start/End)', x: 95, y: 165, state: 'matched', matchWith: null },
          { id: '2', label: '2 (Splice Hub)', x: 235, y: 85, state: 'matched', matchWith: null },
          { id: '3', label: '3', x: 235, y: 245, state: 'matched', matchWith: null },
          { id: '4', label: '4', x: 405, y: 85, state: 'matched', matchWith: null },
        ],
        edges: [
          { id: 'e12', from: '1', to: '2', state: 'matched' },
          { id: 'e24', from: '2', to: '4', state: 'matched' },
          { id: 'e42', from: '4', to: '2', state: 'matched' },
          { id: 'e23', from: '2', to: '3', state: 'matched' },
          { id: 'e31', from: '3', to: '1', state: 'matched' },
        ],
      },
      variables: { CircuitRev: '[1, 3, 2, 4, 2, 1]', EulerCircuit: '1 -> 2 -> 4 -> 2 -> 3 -> 1', Time: 'O(V + E)' },
    },
  ],
  reductionClues: [
    {
      clue: '"Reconstruct a string/sequence from all length-K substrings (k-mers) or pairs of consecutive characters"',
      translation:
        'Build a **De Bruijn Graph**! Every `(K-1)`-length prefix/suffix is a vertex, and every `K`-mer `s[0..K-1]` is a directed edge from `s[0..K-2]` to `s[1..K-1]`. Finding the original string is literally a Directed Eulerian Path!',
    },
    {
      clue: '"Generate the shortest circular/linear string containing EVERY K-ary length-N password"',
      translation:
        'De Bruijn Sequence `B(k, n)`! Vertices are all `k^(n-1)` strings of length `n-1`; each vertex has `k` outgoing edges (append digit `0..k-1`). Run Hierholzer’s Eulerian Circuit starting from `"00..0"` in `O(k^n)`!',
    },
    {
      clue: '"Check whether an Eulerian Path/Circuit exists across a graph that might be disconnected"',
      translation:
        'NEVER check degree parity alone! Even if `deg[v]` is even everywhere, an isolated second cycle makes `circuit.size() < E + 1`. Always verify BOTH degree rules AND `circuit.size() == E + 1` after Hierholzer!',
    },
    {
      clue: '"Visit every street/edge AT LEAST once and return to start minimizing total duplicated distance (Chinese Postman)"',
      translation:
        'Every vertex with odd degree violates Eulerian parity. Pair up the `M <= 16` odd-degree vertices via minimum-weight matching (Shortest Paths + Bitmask DP `O(2^M * M)`), duplicate those shortest paths, then extract the Eulerian circuit!',
    },
  ],
  timeComplexity: 'O(V + E) with Current-Arc Pointer Deletion (Iterative Stack avoids Recursion Overflow)',
  spaceComplexity: 'O(V + E)',
  pitfalls: [
    {
      type: 'TLE',
      title: 'Deleting Edges From Front/Middle of Vector Without Current-Arc Pointer Causes O(E^2)',
      detail:
        'Calling `adj[u].erase(adj[u].begin())` or scanning already-used edges on every revisit degrades a star-like multi-graph to `O(E^2)`! Maintain an index `ptr[u]` (or pop from the back of `adj[u]` in `O(1)`).',
    },
    {
      type: 'WA',
      title: 'Forgetting to Mark Both Directions Used in Undirected Graphs (or Ignoring Self-Loops)',
      detail:
        'In undirected graphs, every edge `(u, v)` gets a unique `edgeId`. Maintain `used[edgeId] = true` so when `u -> v` is traversed, `v -> u` is skipped immediately—especially crucial when parallel edges or self-loops exist!',
    },
    {
      type: 'WA',
      title: 'Checking Only Degree Parity and Missing Disconnected Edge Components',
      detail:
        'Suppose edges form two disjoint triangles `1-2-3` and `4-5-6`: every node has even degree `2`, yet no single Eulerian tour visits all 6 edges! Always check `tour.size() == E + 1` (and start from a vertex with `deg > 0`).',
    },
    {
      type: 'RE',
      title: 'Recursive Hierholzer Crashing Stack When E = 200,000',
      detail:
        'A single long Eulerian tour can recurse `E = 200,000` frames deep! Use an explicit iterative `vector<int> st` stack so depth is strictly heap-allocated with zero call-stack overflow.',
    },
  ],
  implementations: {
    cpp20: `#include <bits/stdc++.h>
using namespace std;

// Iterative Hierholzer Algorithm for Directed & Undirected Eulerian Circuit
// Below demonstrates Undirected Eulerian Circuit (start = 1, return = 1) using O(V + E) current-arc pointers
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, m;
    if (!(cin >> n >> m)) return 0;
    vector<vector<pair<int, int>>> adj(n + 1);
    vector<int> deg(n + 1, 0);

    for (int i = 0; i < m; i++) {
        int u, v;
        cin >> u >> v;
        adj[u].push_back({v, i});
        adj[v].push_back({u, i});
        deg[u]++;
        deg[v]++;
    }

    for (int i = 1; i <= n; i++) {
        if (deg[i] & 1) {
            cout << "IMPOSSIBLE\\n";
            return 0;
        }
    }

    vector<int> ptr(n + 1, 0);
    vector<bool> used(m, false);
    vector<int> st = {1}, circuit;
    circuit.reserve(m + 1);

    while (!st.empty()) {
        int u = st.back();
        while (ptr[u] < (int)adj[u].size() && used[adj[u][ptr[u]].second]) {
            ptr[u]++;
        }
        if (ptr[u] < (int)adj[u].size()) {
            auto [v, id] = adj[u][ptr[u]++];
            used[id] = true;
            st.push_back(v);
        } else {
            circuit.push_back(u);
            st.pop_back();
        }
    }

    if ((int)circuit.size() != m + 1) {
        cout << "IMPOSSIBLE\\n";
        return 0;
    }

    reverse(circuit.begin(), circuit.end());
    for (int i = 0; i < (int)circuit.size(); i++) {
        cout << circuit[i] << (i + 1 == (int)circuit.size() ? '\\n' : ' ');
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

    let mut adj = vec![Vec::new(); n + 1];
    let mut deg = vec![0usize; n + 1];
    for id in 0..m {
        let u: usize = it.next().unwrap().parse().unwrap();
        let v: usize = it.next().unwrap().parse().unwrap();
        adj[u].push((v, id));
        adj[v].push((u, id));
        deg[u] += 1;
        deg[v] += 1;
    }

    for i in 1..=n {
        if (deg[i] & 1) == 1 {
            println!("IMPOSSIBLE");
            return;
        }
    }

    let mut ptr = vec![0usize; n + 1];
    let mut used = vec![false; m];
    let mut st = vec![1usize];
    let mut circuit = Vec::with_capacity(m + 1);

    while let Some(&u) = st.last() {
        while ptr[u] < adj[u].len() && used[adj[u][ptr[u]].1] {
            ptr[u] += 1;
        }
        if ptr[u] < adj[u].len() {
            let (v, id) = adj[u][ptr[u]];
            ptr[u] += 1;
            used[id] = true;
            st.push(v);
        } else {
            circuit.push(u);
            st.pop();
        }
    }

    if circuit.len() != m + 1 {
        println!("IMPOSSIBLE");
        return;
    }
    circuit.reverse();
    let out: Vec<String> = circuit.iter().map(|x| x.to_string()).collect();
    println!("{}", out.join(" "));
}`,
    java21: `import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

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

    @SuppressWarnings("unchecked")
    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        int n = fs.nextInt();
        if (n == Integer.MIN_VALUE) return;
        int m = fs.nextInt();

        List<int[]>[] adj = new List[n + 1];
        for (int i = 0; i <= n; i++) adj[i] = new ArrayList<>();
        int[] deg = new int[n + 1];

        for (int id = 0; id < m; id++) {
            int u = fs.nextInt(), v = fs.nextInt();
            adj[u].add(new int[]{v, id});
            adj[v].add(new int[]{u, id});
            deg[u]++;
            deg[v]++;
        }

        for (int i = 1; i <= n; i++) {
            if ((deg[i] & 1) == 1) {
                System.out.println("IMPOSSIBLE");
                return;
            }
        }

        int[] ptr = new int[n + 1];
        boolean[] used = new boolean[m];
        int[] st = new int[m + 5];
        int top = 0;
        st[top++] = 1;
        int[] circuit = new int[m + 1];
        int cLen = 0;

        while (top > 0) {
            int u = st[top - 1];
            List<int[]> edges = adj[u];
            while (ptr[u] < edges.size() && used[edges.get(ptr[u])[1]]) {
                ptr[u]++;
            }
            if (ptr[u] < edges.size()) {
                int[] e = edges.get(ptr[u]++);
                used[e[1]] = true;
                st[top++] = e[0];
            } else {
                circuit[cLen++] = u;
                top--;
            }
        }

        if (cLen != m + 1) {
            System.out.println("IMPOSSIBLE");
            return;
        }

        StringBuilder sb = new StringBuilder();
        for (int i = cLen - 1; i >= 0; i--) {
            sb.append(circuit[i]).append(i == 0 ? '\\n' : ' ');
        }
        System.out.print(sb);
    }
}`,
    python3: `import sys

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    n = int(next(it))
    m = int(next(it))
    adj = [[] for _ in range(n + 1)]
    deg = [0] * (n + 1)
    for eid in range(m):
        u = int(next(it))
        v = int(next(it))
        adj[u].append((v, eid))
        adj[v].append((u, eid))
        deg[u] += 1
        deg[v] += 1

    for i in range(1, n + 1):
        if deg[i] & 1:
            print("IMPOSSIBLE")
            return

    ptr = [0] * (n + 1)
    used = [False] * m
    st = [1]
    circuit = []

    while st:
        u = st[-1]
        edges = adj[u]
        while ptr[u] < len(edges) and used[edges[ptr[u]][1]]:
            ptr[u] += 1
        if ptr[u] < len(edges):
            v, eid = edges[ptr[u]]
            ptr[u] += 1
            used[eid] = True
            st.append(v)
        else:
            circuit.append(u)
            st.pop()

    if len(circuit) != m + 1:
        print("IMPOSSIBLE")
        return

    circuit.reverse()
    print(" ".join(map(str, circuit)))

if __name__ == "__main__":
    solve()`,
    ruby: `tokens = $stdin.read.split
exit if tokens.empty?
idx = 0
n = tokens[idx].to_i
m = tokens[idx + 1].to_i
idx += 2

adj = Array.new(n + 1) { [] }
deg = Array.new(n + 1, 0)
m.times do |eid|
  u = tokens[idx].to_i
  v = tokens[idx + 1].to_i
  idx += 2
  adj[u] << [v, eid]
  adj[v] << [u, eid]
  deg[u] += 1
  deg[v] += 1
end

if (1..n).any? { |i| (deg[i] & 1) == 1 }
  puts "IMPOSSIBLE"
  exit
end

ptr = Array.new(n + 1, 0)
used = Array.new(m, false)
st = [1]
circuit = []

until st.empty?
  u = st[-1]
  edges = adj[u]
  ptr[u] += 1 while ptr[u] < edges.length && used[edges[ptr[u]][1]]
  if ptr[u] < edges.length
    v, eid = edges[ptr[u]]
    ptr[u] += 1
    used[eid] = true
    st << v
  else
    circuit << u
    st.pop
  end
end

if circuit.length != m + 1
  puts "IMPOSSIBLE"
else
  puts circuit.reverse.join(" ")
end`,
  },
  practiceProblems: [
    {
      id: 'ch30-p1',
      tier: 'Warmup',
      ratingRange: '1800–2000',
      title: 'Directed Eulerian Path From Node 1 to Node N (Teleporters Path)',
      statement:
        'Given a directed graph with N vertices (1..N) and M edges, find an Eulerian path that starts at vertex 1, ends at vertex N, and traverses EVERY edge exactly once, or output IMPOSSIBLE.',
      constraints: '2 <= N <= 10^5, 1 <= M <= 2 * 10^5',
      sampleInput: '5 6\n1 2\n1 3\n2 4\n2 5\n3 2\n4 2',
      sampleOutput: '1 2 4 2 5',
      hints: [
        'For a directed Eulerian path strictly from `1` to `N`: require `outDeg[1] - inDeg[1] == 1`, `inDeg[N] - outDeg[N] == 1`, and for all other vertices `inDeg[v] == outDeg[v]`.',
        'Run iterative Hierholzer starting at `1` popping from `adj[u]`. Verify `path.size() == M + 1` (ensures no disconnected edges!) and `path.front() == 1 && path.back() == N` after reversing.',
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
    vector<int> indeg(n + 1, 0), outdeg(n + 1, 0);

    for (int i = 0; i < m; i++) {
        int u, v;
        cin >> u >> v;
        adj[u].push_back(v);
        outdeg[u]++;
        indeg[v]++;
    }

    if (outdeg[1] != indeg[1] + 1 || indeg[n] != outdeg[n] + 1) {
        cout << "IMPOSSIBLE\\n";
        return 0;
    }
    for (int i = 2; i < n; i++) {
        if (indeg[i] != outdeg[i]) {
            cout << "IMPOSSIBLE\\n";
            return 0;
        }
    }

    vector<int> st = {1}, path;
    path.reserve(m + 1);
    while (!st.empty()) {
        int u = st.back();
        if (!adj[u].empty()) {
            int v = adj[u].back();
            adj[u].pop_back();
            st.push_back(v);
        } else {
            path.push_back(u);
            st.pop_back();
        }
    }

    if ((int)path.size() != m + 1) {
        cout << "IMPOSSIBLE\\n";
        return 0;
    }
    reverse(path.begin(), path.end());
    for (int i = 0; i < (int)path.size(); i++) {
        cout << path[i] << (i + 1 == (int)path.size() ? '\\n' : ' ');
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

    let mut adj = vec![Vec::new(); n + 1];
    let mut indeg = vec![0i32; n + 1];
    let mut outdeg = vec![0i32; n + 1];
    for _ in 0..m {
        let u: usize = it.next().unwrap().parse().unwrap();
        let v: usize = it.next().unwrap().parse().unwrap();
        adj[u].push(v);
        outdeg[u] += 1;
        indeg[v] += 1;
    }

    if outdeg[1] != indeg[1] + 1 || indeg[n] != outdeg[n] + 1 {
        println!("IMPOSSIBLE");
        return;
    }
    for i in 2..n {
        if indeg[i] != outdeg[i] {
            println!("IMPOSSIBLE");
            return;
        }
    }

    let mut st = vec![1usize];
    let mut path = Vec::with_capacity(m + 1);
    while let Some(&u) = st.last() {
        if let Some(v) = adj[u].pop() {
            st.push(v);
        } else {
            path.push(u);
            st.pop();
        }
    }

    if path.len() != m + 1 {
        println!("IMPOSSIBLE");
        return;
    }
    path.reverse();
    let out: Vec<String> = path.iter().map(|x| x.to_string()).collect();
    println!("{}", out.join(" "));
}`,
        java21: `import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

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

    @SuppressWarnings("unchecked")
    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        int n = fs.nextInt();
        if (n == Integer.MIN_VALUE) return;
        int m = fs.nextInt();

        List<Integer>[] adj = new List[n + 1];
        for (int i = 0; i <= n; i++) adj[i] = new ArrayList<>();
        int[] indeg = new int[n + 1], outdeg = new int[n + 1];

        for (int i = 0; i < m; i++) {
            int u = fs.nextInt(), v = fs.nextInt();
            adj[u].add(v);
            outdeg[u]++;
            indeg[v]++;
        }

        if (outdeg[1] != indeg[1] + 1 || indeg[n] != outdeg[n] + 1) {
            System.out.println("IMPOSSIBLE");
            return;
        }
        for (int i = 2; i < n; i++) {
            if (indeg[i] != outdeg[i]) {
                System.out.println("IMPOSSIBLE");
                return;
            }
        }

        int[] ptr = new int[n + 1];
        int[] st = new int[m + 5];
        int top = 0;
        st[top++] = 1;
        int[] path = new int[m + 1];
        int pLen = 0;

        while (top > 0) {
            int u = st[top - 1];
            if (ptr[u] < adj[u].size()) {
                st[top++] = adj[u].get(ptr[u]++);
            } else {
                path[pLen++] = u;
                top--;
            }
        }

        if (pLen != m + 1) {
            System.out.println("IMPOSSIBLE");
            return;
        }
        StringBuilder sb = new StringBuilder();
        for (int i = pLen - 1; i >= 0; i--) {
            sb.append(path[i]).append(i == 0 ? '\\n' : ' ');
        }
        System.out.print(sb);
    }
}`,
        python3: `import sys

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    n = int(next(it))
    m = int(next(it))
    adj = [[] for _ in range(n + 1)]
    indeg = [0] * (n + 1)
    outdeg = [0] * (n + 1)
    for _ in range(m):
        u = int(next(it))
        v = int(next(it))
        adj[u].append(v)
        outdeg[u] += 1
        indeg[v] += 1

    if outdeg[1] != indeg[1] + 1 or indeg[n] != outdeg[n] + 1:
        print("IMPOSSIBLE")
        return
    for i in range(2, n):
        if indeg[i] != outdeg[i]:
            print("IMPOSSIBLE")
            return

    st = [1]
    path = []
    while st:
        u = st[-1]
        if adj[u]:
            st.append(adj[u].pop())
        else:
            path.append(u)
            st.pop()

    if len(path) != m + 1:
        print("IMPOSSIBLE")
        return
    path.reverse()
    print(" ".join(map(str, path)))

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
idx = 0
n = tokens[idx].to_i
m = tokens[idx + 1].to_i
idx += 2

adj = Array.new(n + 1) { [] }
indeg = Array.new(n + 1, 0)
outdeg = Array.new(n + 1, 0)
m.times do
  u = tokens[idx].to_i
  v = tokens[idx + 1].to_i
  idx += 2
  adj[u] << v
  outdeg[u] += 1
  indeg[v] += 1
end

if outdeg[1] != indeg[1] + 1 || indeg[n] != outdeg[n] + 1 || (2...n).any? { |i| indeg[i] != outdeg[i] }
  puts "IMPOSSIBLE"
  exit
end

st = [1]
path = []
until st.empty?
  u = st[-1]
  if !adj[u].empty?
    st << adj[u].pop
  else
    path << u
    st.pop
  end
end

if path.length != m + 1
  puts "IMPOSSIBLE"
else
  puts path.reverse.join(" ")
end`,
      },
    },
    {
      id: 'ch30-p2',
      tier: 'Standard',
      ratingRange: '1900–2100',
      title: 'Universal Binary String via De Bruijn Graph & Hierholzer',
      statement:
        'Given an integer N (1 <= N <= 15), construct a minimum-length binary string containing EVERY possible N-bit binary string ("00...0" through "11...1") as a contiguous substring.',
      constraints: '1 <= N <= 15 (minimum length is 2^N + N - 1)',
      sampleInput: '2',
      sampleOutput: '00110',
      hints: [
        'For `N = 1`, directly output `"01"`. For `N >= 2`, create a De Bruijn graph with `2^(N-1)` vertices (each representing a `(N-1)`-bit suffix `0 .. 2^(N-1)-1`).',
        'Each vertex `u` has two directed outgoing edges: append `0` -> `((u << 1) & mask)` and append `1` -> `(((u << 1) | 1) & mask)`. Run iterative Hierholzer starting at `0`, prepend `N - 1` leading zeros, and append the sequence of traversed edge bits!',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    if (!(cin >> n)) return 0;
    if (n == 1) {
        cout << "01\\n";
        return 0;
    }

    int numV = 1 << (n - 1);
    int mask = numV - 1;
    // ptr[u] tracks how many outgoing bits (0 or 1) have been consumed from state u
    vector<int> ptr(numV, 0);
    vector<pair<int, int>> st = {{0, -1}}; // (vertex, incoming_bit)
    string revBits;
    revBits.reserve(1 << n);

    while (!st.empty()) {
        int u = st.back().first;
        if (ptr[u] < 2) {
            int bit = ptr[u]++;
            int v = ((u << 1) | bit) & mask;
            st.push_back({v, bit});
        } else {
            int bit = st.back().second;
            st.pop_back();
            if (bit != -1) revBits.push_back(char('0' + bit));
        }
    }

    reverse(revBits.begin(), revBits.end());
    string prefix(n - 1, '0');
    cout << prefix << revBits << "\\n";
    return 0;
}`,
        rust: `use std::io::{self, Read};

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let n: usize = match input.split_whitespace().next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };

    if n == 1 {
        println!("01");
        return;
    }

    let num_v = 1usize << (n - 1);
    let mask = num_v - 1;
    let mut ptr = vec![0usize; num_v];
    let mut st: Vec<(usize, i32)> = vec![(0, -1)];
    let mut rev_bits = Vec::with_capacity(1 << n);

    while let Some(&(u, _)) = st.last() {
        if ptr[u] < 2 {
            let bit = ptr[u];
            ptr[u] += 1;
            let v = ((u << 1) | bit) & mask;
            st.push((v, bit as i32));
        } else {
            let (_, bit) = st.pop().unwrap();
            if bit != -1 {
                rev_bits.push((b'0' + bit as u8) as char);
            }
        }
    }

    rev_bits.reverse();
    let prefix = "0".repeat(n - 1);
    let suffix: String = rev_bits.into_iter().collect();
    println!("{}{}", prefix, suffix);
}`,
        java21: `import java.io.IOException;
import java.io.InputStream;

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

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        int n = fs.nextInt();
        if (n == Integer.MIN_VALUE) return;
        if (n == 1) {
            System.out.println("01");
            return;
        }

        int numV = 1 << (n - 1);
        int mask = numV - 1;
        int totalEdges = 1 << n;
        int[] ptr = new int[numV];
        int[] stNode = new int[totalEdges + 5];
        int[] stBit = new int[totalEdges + 5];
        int top = 0;
        stNode[top] = 0;
        stBit[top] = -1;
        top++;

        char[] rev = new char[totalEdges];
        int rLen = 0;

        while (top > 0) {
            int u = stNode[top - 1];
            if (ptr[u] < 2) {
                int bit = ptr[u]++;
                int v = ((u << 1) | bit) & mask;
                stNode[top] = v;
                stBit[top] = bit;
                top++;
            } else {
                int bit = stBit[top - 1];
                top--;
                if (bit != -1) rev[rLen++] = (char) ('0' + bit);
            }
        }

        StringBuilder sb = new StringBuilder(totalEdges + n);
        for (int i = 0; i < n - 1; i++) sb.append('0');
        for (int i = rLen - 1; i >= 0; i--) sb.append(rev[i]);
        System.out.println(sb);
    }
}`,
        python3: `import sys

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    if n == 1:
        print("01")
        return

    num_v = 1 << (n - 1)
    mask = num_v - 1
    ptr = [0] * num_v
    st = [(0, -1)]
    rev_bits = []

    while st:
        u, _ = st[-1]
        if ptr[u] < 2:
            bit = ptr[u]
            ptr[u] += 1
            v = ((u << 1) | bit) & mask
            st.append((v, bit))
        else:
            _, bit = st.pop()
            if bit != -1:
                rev_bits.append(str(bit))

    rev_bits.reverse()
    print("0" * (n - 1) + "".join(rev_bits))

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
n = tokens[0].to_i
if n == 1
  puts "01"
  exit
end

num_v = 1 << (n - 1)
mask = num_v - 1
ptr = Array.new(num_v, 0)
st = [[0, -1]]
rev_bits = []

until st.empty?
  u, _ = st[-1]
  if ptr[u] < 2
    bit = ptr[u]
    ptr[u] += 1
    v = ((u << 1) | bit) & mask
    st << [v, bit]
  else
    _, bit = st.pop
    rev_bits << bit.to_s if bit != -1
  end
end

puts ("0" * (n - 1)) + rev_bits.reverse.join`,
      },
    },
    {
      id: 'ch30-p3',
      tier: 'Boss',
      ratingRange: '2100–2350',
      title: 'Minimum-Weight Tour Optimization With Multi-Edge Parity Constraints (Chinese Postman)',
      statement:
        'Given a connected weighted undirected graph of N vertices (N <= 15) and M edges (u, v, w), find the minimum total length of a closed tour starting and ending at vertex 1 that traverses EVERY edge at least once.',
      constraints: '2 <= N <= 15, N - 1 <= M <= 1000, 1 <= w <= 10^6',
      sampleInput: '4 5\n1 2 3\n2 3 4\n3 4 5\n4 1 6\n1 3 2',
      sampleOutput: '22',
      hints: [
        'Every edge must be walked at least once, giving baseline cost `sum(w)`. If all vertices have even degree, `sum(w)` IS the answer!',
        'Otherwise, let `odd[]` be the vertices with odd degree (`|odd|` is ALWAYS even, at most `N <= 15`). Compute All-Pairs Shortest Paths `dist[u][v]` via Floyd-Warshall, then run Bitmask DP over `odd[]` (`dp[mask]`) to pair every odd vertex at minimum total added path weight!',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, m;
    if (!(cin >> n >> m)) return 0;
    const long long INF = 4e18;
    vector<vector<long long>> dist(n, vector<long long>(n, INF));
    for (int i = 0; i < n; i++) dist[i][i] = 0;
    vector<int> deg(n, 0);
    long long baseSum = 0;

    for (int i = 0; i < m; i++) {
        int u, v;
        long long w;
        cin >> u >> v >> w;
        u--; v--;
        baseSum += w;
        deg[u]++;
        deg[v]++;
        dist[u][v] = min(dist[u][v], w);
        dist[v][u] = min(dist[v][u], w);
    }

    for (int k = 0; k < n; k++) {
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (dist[i][k] < INF && dist[k][j] < INF) {
                    dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]);
                }
            }
        }
    }

    vector<int> odd;
    for (int i = 0; i < n; i++) {
        if (deg[i] & 1) odd.push_back(i);
    }

    int k = odd.size();
    int full = 1 << k;
    vector<long long> dp(full, INF);
    dp[0] = 0;

    for (int mask = 1; mask < full; mask++) {
        if (__builtin_popcount(mask) & 1) continue;
        int first = __builtin_ctz(mask);
        for (int second = first + 1; second < k; second++) {
            if (mask & (1 << second)) {
                int prev = mask ^ (1 << first) ^ (1 << second);
                dp[mask] = min(dp[mask], dp[prev] + dist[odd[first]][odd[second]]);
            }
        }
    }

    cout << baseSum + dp[full - 1] << "\\n";
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

    let inf = 4_000_000_000_000_000_000i64;
    let mut dist = vec![vec![inf; n]; n];
    for i in 0..n {
        dist[i][i] = 0;
    }
    let mut deg = vec![0usize; n];
    let mut base_sum = 0i64;

    for _ in 0..m {
        let u: usize = it.next().unwrap().parse::<usize>().unwrap() - 1;
        let v: usize = it.next().unwrap().parse::<usize>().unwrap() - 1;
        let w: i64 = it.next().unwrap().parse().unwrap();
        base_sum += w;
        deg[u] += 1;
        deg[v] += 1;
        if w < dist[u][v] {
            dist[u][v] = w;
            dist[v][u] = w;
        }
    }

    for k in 0..n {
        for i in 0..n {
            for j in 0..n {
                if dist[i][k] < inf && dist[k][j] < inf {
                    let cand = dist[i][k] + dist[k][j];
                    if cand < dist[i][j] {
                        dist[i][j] = cand;
                    }
                }
            }
        }
    }

    let odd: Vec<usize> = (0..n).filter(|&i| (deg[i] & 1) == 1).collect();
    let k = odd.len();
    let full = 1usize << k;
    let mut dp = vec![inf; full];
    dp[0] = 0;

    for mask in 1..full {
        if (mask.count_ones() & 1) == 1 {
            continue;
        }
        let first = mask.trailing_zeros() as usize;
        for second in (first + 1)..k {
            if (mask & (1 << second)) != 0 {
                let prev = mask ^ (1 << first) ^ (1 << second);
                let cand = dp[prev] + dist[odd[first]][odd[second]];
                if cand < dp[mask] {
                    dp[mask] = cand;
                }
            }
        }
    }

    println!("{}", base_sum + dp[full - 1]);
}`,
        java21: `import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;

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
        long nextLong() throws IOException {
            int c = readByte();
            while (c >= 0 && c <= ' ') c = readByte();
            if (c == -1) return Long.MIN_VALUE;
            long res = 0;
            while (c > ' ') { res = res * 10 + (c - '0'); c = readByte(); }
            return res;
        }
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        long firstIn = fs.nextLong();
        if (firstIn == Long.MIN_VALUE) return;
        int n = (int) firstIn;
        int m = (int) fs.nextLong();

        final long INF = Long.MAX_VALUE / 4;
        long[][] dist = new long[n][n];
        for (int i = 0; i < n; i++) {
            Arrays.fill(dist[i], INF);
            dist[i][i] = 0;
        }
        int[] deg = new int[n];
        long baseSum = 0;

        for (int i = 0; i < m; i++) {
            int u = (int) fs.nextLong() - 1;
            int v = (int) fs.nextLong() - 1;
            long w = fs.nextLong();
            baseSum += w;
            deg[u]++;
            deg[v]++;
            if (w < dist[u][v]) {
                dist[u][v] = w;
                dist[v][u] = w;
            }
        }

        for (int k = 0; k < n; k++) {
            for (int i = 0; i < n; i++) {
                for (int j = 0; j < n; j++) {
                    if (dist[i][k] < INF && dist[k][j] < INF) {
                        dist[i][j] = Math.min(dist[i][j], dist[i][k] + dist[k][j]);
                    }
                }
            }
        }

        int[] odd = new int[n];
        int k = 0;
        for (int i = 0; i < n; i++) {
            if ((deg[i] & 1) == 1) odd[k++] = i;
        }

        int full = 1 << k;
        long[] dp = new long[full];
        Arrays.fill(dp, INF);
        dp[0] = 0;

        for (int mask = 1; mask < full; mask++) {
            if ((Integer.bitCount(mask) & 1) == 1) continue;
            int first = Integer.numberOfTrailingZeros(mask);
            for (int second = first + 1; second < k; second++) {
                if ((mask & (1 << second)) != 0) {
                    int prev = mask ^ (1 << first) ^ (1 << second);
                    dp[mask] = Math.min(dp[mask], dp[prev] + dist[odd[first]][odd[second]]);
                }
            }
        }
        System.out.println(baseSum + dp[full - 1]);
    }
}`,
        python3: `import sys

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    n = int(next(it))
    m = int(next(it))
    INF = 10**18
    dist = [[INF] * n for _ in range(n)]
    for i in range(n):
        dist[i][i] = 0
    deg = [0] * n
    base_sum = 0

    for _ in range(m):
        u = int(next(it)) - 1
        v = int(next(it)) - 1
        w = int(next(it))
        base_sum += w
        deg[u] += 1
        deg[v] += 1
        if w < dist[u][v]:
            dist[u][v] = w
            dist[v][u] = w

    for k in range(n):
        dk = dist[k]
        for i in range(n):
            di = dist[i]
            dik = di[k]
            if dik >= INF:
                continue
            for j in range(n):
                if dik + dk[j] < di[j]:
                    di[j] = dik + dk[j]

    odd = [i for i in range(n) if deg[i] & 1]
    k = len(odd)
    full = 1 << k
    dp = [INF] * full
    dp[0] = 0

    for mask in range(1, full):
        if mask.bit_count() & 1:
            continue
        lsb = mask & -mask
        first = lsb.bit_length() - 1
        best = INF
        for second in range(first + 1, k):
            if mask & (1 << second):
                prev = mask ^ lsb ^ (1 << second)
                cand = dp[prev] + dist[odd[first]][odd[second]]
                if cand < best:
                    best = cand
        dp[mask] = best

    print(base_sum + dp[full - 1])

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
idx = 0
n = tokens[idx].to_i
m = tokens[idx + 1].to_i
idx += 2

inf = 10**18
dist = Array.new(n) { |i| Array.new(n) { |j| i == j ? 0 : inf } }
deg = Array.new(n, 0)
base_sum = 0

m.times do
  u = tokens[idx].to_i - 1
  v = tokens[idx + 1].to_i - 1
  w = tokens[idx + 2].to_i
  idx += 3
  base_sum += w
  deg[u] += 1
  deg[v] += 1
  if w < dist[u][v]
    dist[u][v] = w
    dist[v][u] = w
  end
end

n.times do |k|
  n.times do |i|
    n.times do |j|
      cand = dist[i][k] + dist[k][j]
      dist[i][j] = cand if cand < dist[i][j]
    end
  end
end

odd = (0...n).select { |i| (deg[i] & 1) == 1 }
k = odd.length
full = 1 << k
dp = Array.new(full, inf)
dp[0] = 0

(1...full).each do |mask|
  bits = 0
  tmp = mask
  while tmp != 0
    bits += 1
    tmp &= tmp - 1
  end
  next if (bits & 1) == 1

  first = 0
  first += 1 while (mask & (1 << first)) == 0
  ((first + 1)...k).each do |second|
    if (mask & (1 << second)) != 0
      prev = mask ^ (1 << first) ^ (1 << second)
      cand = dp[prev] + dist[odd[first]][odd[second]]
      dp[mask] = cand if cand < dp[mask]
    end
  end
end

puts base_sum + dp[full - 1]`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'CSES',
      title: 'Mail Delivery & De Bruijn Sequence',
      difficulty: 'Classic Graph',
      url: 'https://cses.fi/problemset/task/1691',
      patternNote: 'Direct applications of undirected Hierholzer (Mail Delivery) and De Bruijn Eulerian cycles (Task 1692).',
    },
    {
      platform: 'AtCoder',
      title: 'ABC286 G - Unique Walk',
      difficulty: '2000',
      url: 'https://atcoder.jp/contests/abc286/tasks/abc286_g',
      patternNote: 'Contract non-essential edge components via DSU, leaving an undirected Eulerian path parity check.',
    },
    {
      platform: 'Codeforces',
      title: 'Tanya and Password (CF 508D)',
      difficulty: '2200',
      url: 'https://codeforces.com/problemset/problem/508/D',
      patternNote: 'Construct a string from all 3-character substrings using a directed De Bruijn Eulerian path.',
    },
    {
      platform: 'CodeChef',
      title: 'Tourists in Mancunia',
      difficulty: 'Div1 Medium',
      url: 'https://www.codechef.com/problems/TOURISTS',
      patternNote: 'Orient an undirected graph by extracting an Eulerian circuit and directing edges along traversal order.',
    },
    {
      platform: 'HackerRank',
      title: 'String Reconstruction / Eulerian Path',
      difficulty: 'Hard',
      url: 'https://www.hackerrank.com/challenges/johnland/problem',
      patternNote: 'Apply Eulerian path parity and degree checks for sequence assembly and parity-constrained routes.',
    },
    {
      platform: 'NeetCode 150',
      title: 'Reconstruct Itinerary',
      difficulty: 'Hard (LeetCode 332)',
      url: 'https://leetcode.com/problems/reconstruct-itinerary/',
      patternNote: 'Lexicographically smallest directed Eulerian path via Hierholzer + sorted adjacency min-heaps.',
    },
  ],
  interviewNotes: [
    'LeetCode 332 (Reconstruct Itinerary) is the single most famous Hierholzer interview problem—remember to sort/min-heap neighbor destinations and append to `route` ONLY when backtracking from a dead end!',
    'Always clearly distinguish Hamilton Path (visit every VERTEX once — NP-complete / Bitmask DP) from Eulerian Path (visit every EDGE once — linear `O(V + E)` via Hierholzer).',
    'When building De Bruijn graphs for k-mers of length `K`, vertices are `(K-1)`-mers and edges are `K`-mers—saving an order of magnitude of memory over string overlap graphs.',
  ],
  projectBlueprint: {
    title: 'DNA De Bruijn Graph Genome Assembler',
    tagline: 'Reconstruct contiguous chromosomal contigs from noisy short DNA k-mer reads via iterative Hierholzer Eulerian path extraction.',
    stackSummary: 'C++20 Sequence Engine, (K-1)-mer Hash Indexing, Iterative Hierholzer Contig Splicer',
    asciiDiagram: `
+-------------------------+      +------------------------------------+
| Raw DNA Reads (k-mers)  | ---> | De Bruijn Directed Multi-Graph     |
| ["ATG","TGC","GCA",...] |      | Node: (k-1)-mer | Edge: k-mer      |
+-------------------------+      +------------------------------------+
                                                   |
          +----------------------------------------+
          v
+-----------------------------------+     +----------------------------+
| Start Node Picker (out - in == 1) | --> | Iterative Hierholzer Walk  |
| & Degree Balance Audit            |     | -> Reconstructed Contig    |
+-----------------------------------+     +----------------------------+`,
    milestones: [
      {
        id: 'm1',
        title: '1. K-mer Splitting & (K-1)-mer Graph Builder',
        detail: 'Slice DNA reads into directed edges `kmer[0..K-2] -> kmer[1..K-1]` and record in-degree and out-degree counts.',
      },
      {
        id: 'm2',
        title: '2. Eulerian Start Node Selection & Parity Check',
        detail: 'Locate the unique source `(outDeg - inDeg == 1)` for linear genomes, or any active vertex for circular bacterial plasmids.',
      },
      {
        id: 'm3',
        title: '3. Iterative Hierholzer Assembly & Edge Verification',
        detail: 'Pop edges in `O(1)` using an explicit stack, reverse the vertex walk, and concatenate trailing bases into the full contig.',
      },
    ],
    starterCode: `// DNA De Bruijn Graph Genome Assembler (Runnable C++20 Prototype)
#include <bits/stdc++.h>
using namespace std;

int main() {
    vector<string> kmers = {"AAAT", "AATG", "ATGC", "TGCA", "GCAT", "CATG", "ATGG", "TGGC", "GGCC"};
    unordered_map<string, vector<string>> adj;
    unordered_map<string, int> indeg, outdeg;

    for (const string& km : kmers) {
        string u = km.substr(0, km.size() - 1);
        string v = km.substr(1);
        adj[u].push_back(v);
        outdeg[u]++;
        indeg[v]++;
    }

    string start = kmers[0].substr(0, kmers[0].size() - 1);
    for (const auto& [node, out] : outdeg) {
        if (out - indeg[node] == 1) {
            start = node;
            break;
        }
    }

    vector<string> st = {start}, walk;
    while (!st.empty()) {
        string u = st.back();
        if (!adj[u].empty()) {
            string v = adj[u].back();
            adj[u].pop_back();
            st.push_back(v);
        } else {
            walk.push_back(u);
            st.pop_back();
        }
    }
    reverse(walk.begin(), walk.end());

    string genome = walk[0];
    for (size_t i = 1; i < walk.size(); i++) {
        genome.push_back(walk[i].back());
    }
    cout << "Assembled Genome (" << walk.size() - 1 << " k-mers): " << genome << "\\n";
    return 0;
}`,
  },
};
