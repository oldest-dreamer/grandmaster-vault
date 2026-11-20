import type { TheoryChapter } from '../../types/vault';

export const CH58_HEAVY_LIGHT_THRESHOLD: TheoryChapter = {
  slug: 'heavy-light-sqrt-threshold-splitting',
  topicId: 'th-74',
  title: 'Heavy-Light Threshold Splitting (Degree > sqrt(E))',
  domain: 'Theoretical & Randomized',
  ratingTier: '1900–2200',
  usacoDivision: 'Platinum',
  subtitle:
    'Break O(N^2) worst-case bottlenecks on high-degree vertices, large sets, and long strings by splitting objects at threshold B = sqrt(M): push updates eagerly from Light items (<= B) and pull lazily across <= 2M / B Heavy items to guarantee strict O(M sqrt(M)) worst-case runtime.',
  analogyTitle: 'The Celebrity Influencer Push-vs-Pull Feed Routing Analogy',
  analogyBody:
    'Imagine updating a social network feed whenever a user posts or queries neighbor activity. If a celebrity has `deg = 100,000` followers, looping through all `100,000` friends on every celebrity update explodes to `O(Q * N)` TLE; yet if every user pulls from ALL neighbors on every query, a celebrity reading their own feed also takes `O(Q * N)`! **Heavy-Light Threshold Splitting** draws a clean threshold line at **`B = sqrt(2M)`** (`~450` for `M = 10^5`): **Light nodes (`deg <= B`)** push changes eagerly to their `<= B` neighbors in `O(B)` time, while **Heavy nodes (`deg > B`)** push NOTHING at update time! Because the sum of all degrees equals `2M`, there can exist **at most `2M / B = sqrt(2M)` Heavy nodes in the entire graph**! So any node answering a query simply reads its pre-pushed Light sum and checks at most `sqrt(2M)` Heavy neighbors—crushing worst-case runtime to **`O((N + Q) sqrt(M))`**!',
  prerequisites: [
    {
      slug: 'sqrt-decomposition-mo-algorithm',
      title: 'Sqrt Decomposition, Mo’s Algorithm & Hilbert Order',
    },
  ],
  traceTitle: 'Interactive Degree-Oriented DAG & Push/Pull Threshold Trace',
  traceSubtitle:
    'Trace triangle counting on edges `{1-2, 2-3, 1-3, 3-4, 2-4}` (`M = 5`) by orienting every edge from lower `(deg, id)` to higher `(deg, id)`, guaranteeing every vertex out-degree <= `sqrt(2M)`.',
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Step 1: Compute Vertex Degrees and Orient Edges Low -> High',
      explanation:
        'Degrees are deg[1]=2, deg[2]=3, deg[3]=3, deg[4]=2. Direct every edge `(u, v)` from lower `(deg, id)` to higher `(deg, id)`. Wait: why? Any vertex `u` with out-degree `d_out` must connect to `d_out` neighbors each having degree `>= deg[u] >= d_out`, so `d_out^2 <= 2M` -> `d_out <= sqrt(2M)` ALWAYS!',
      mode: 'graph',
      graph: {
        nodes: [
          { id: '1', label: '1 (d=2)', x: 80, y: 120, state: 'active' },
          { id: '2', label: '2 (d=3)', x: 240, y: 60, state: 'matched' },
          { id: '3', label: '3 (d=3)', x: 240, y: 180, state: 'matched' },
          { id: '4', label: '4 (d=2)', x: 400, y: 120, state: 'even' },
        ],
        edges: [
          { id: 'e1', from: '1', to: '2', state: 'augmenting' },
          { id: 'e2', from: '1', to: '3', state: 'augmenting' },
          { id: 'e3', from: '2', to: '3', state: 'matched' },
          { id: 'e4', from: '4', to: '2', state: 'default' },
          { id: 'e5', from: '4', to: '3', state: 'default' },
        ],
        calloutMetric: 'Max out-degree <= sqrt(2M)',
      },
      variables: { TotalEdges: 5, OutEdges_1: '->2, ->3', OutEdges_4: '->2, ->3', OutEdges_2: '->3' },
    },
    {
      stepNumber: 2,
      title: 'Step 2: Enumerate Triangles in Strictly O(M sqrt(M)) Across Directed Out-Edges',
      explanation:
        'For vertex `1`, mark `vis[2] = 1, vis[3] = 1`. Traverse out-neighbor `w = 2` and its out-neighbor `z = 3`: `vis[3] == 1` -> Triangle `(1, 2, 3)` counted ONCE! Similarly vertex `4` (`vis[2] = vis[3] = 4`) catches `(4, 2, 3)` cleanly with zero double counting!',
      mode: 'array',
      arrays: [
        {
          name: 'Triangle Scan Out-Adjacency Walks',
          cells: [
            { index: 0, value: 'u=1: mark {2,3}', label: 'out[2]={3}', highlight: 'active' },
            { index: 1, value: 'hit (1,2,3)', label: 'count=1', highlight: 'updated' },
            { index: 2, value: 'u=4: mark {2,3}', label: 'out[2]={3}', highlight: 'active' },
            { index: 3, value: 'hit (4,2,3)', label: 'count=2', highlight: 'updated' },
          ],
        },
      ],
      variables: { TrianglesFound: 2, WorkBound: 'sum deg_out(v) <= M sqrt(2M)' },
    },
    {
      stepNumber: 3,
      title: 'Step 3: Push/Pull Split on Dynamic Neighbor Sum (B = sqrt(2M))',
      explanation:
        'On `Add(u, x)`: if `deg[u] <= B` (Light), push `ans[v] += x` to all neighbors `v`; if `deg[u] > B` (Heavy), skip pushing! On `Query(u)`: read `ans[u]` (already contains all Light neighbor contributions) + sum `val[h]` across `heavyNbrs[u]` (<= `sqrt(2M)` Heavy nodes).',
      mode: 'array',
      arrays: [
        {
          name: 'Adaptive Routing Cost Matrix (Threshold B = sqrt(2M))',
          cells: [
            { index: 0, value: 'Light Update: O(B)', highlight: 'window' },
            { index: 1, value: 'Heavy Update: O(1)', highlight: 'active' },
            { index: 2, value: 'Any Query: O(2M / B)', highlight: 'updated' },
          ],
        },
      ],
      variables: { BalancedCost: 'O(sqrt(2M)) per op', MaxHeavyNodes: '<= sqrt(2M)' },
    },
  ],
  reductionClues: [
    {
      clue: '"Count triangles / 4-cycles in a general sparse graph with N, M <= 2 * 10^5"',
      translation:
        '**Degree-Oriented DAG (`(deg[u], u) < (deg[v], v)`)**: orient every edge from lower to higher degree. Each vertex now has out-degree `<= sqrt(2M)`, bounding `sum_{(u,w) in E} deg_out(w) <= M sqrt(2M)`!',
    },
    {
      clue: '"Dynamic graph neighbor sum / toggle / edge queries where hubs have huge degree"',
      translation:
        '**Heavy-Light Push/Pull Split at `B = sqrt(2M)`**: Light vertices (`deg <= B`) update neighbors eagerly; Heavy vertices (`deg > B`, at most `2M / B`) store lazy state pulled at query time!',
    },
    {
      clue: '"Collection of sets `S_1..S_M` or strings `W_1..W_M` with `sum |S_i| <= 10^5` supporting subset adds/queries or substring matches"',
      translation:
        '**Size Threshold Splitting (`B = sqrt(sum |S_i|)`)**: sets/strings larger than `B` exist at most `<= sum|S_i| / B` times—precompute pairwise intersections `|S_h ∩ S_k|` (or Aho-Corasick / Hashing) for Heavy objects, and iterate directly over elements for Light objects!',
    },
    {
      clue: '"Two distinct brute-force solutions exist: one fast when count is small (O(K)), one fast when size is small (O(|S|))"',
      translation:
        'Whenever `sum |S_i| = N` bounds both parameters (`count * size <= N`), setting **`B = sqrt(N)`** turns worst-case `O(N^2)` into exact `O(N sqrt(N))`!',
    },
  ],
  timeComplexity: 'O((N + M + Q) sqrt(M))',
  spaceComplexity: 'O(N + M) or O(M sqrt(M) / B)',
  pitfalls: [
    {
      type: 'TLE',
      title: 'Setting Threshold `B` to `sqrt(N)` Instead of `sqrt(2M)` on Graphs with `M >> N`',
      detail:
        'In a dense graph with `N = 1000` and `M = 200,000`, `sqrt(N) = 31` leaves up to `1000` Heavy nodes (too slow at `O(Q * N)`!). The true degree invariant relies on `sum deg = 2M`, so ALWAYS balance `B ~ sqrt(2M)` (or slightly tuned constant ~`350–500` based on cache speed)!',
    },
    {
      type: 'WA',
      title: 'Forgetting Vertex ID Tie-Breaker `(deg[u], u) < (deg[v], v)` During Graph Orientation',
      detail:
        'If two adjacent vertices have the **exact same degree** (`deg[u] == deg[v]`) and you orient using only `deg[u] < deg[v]`, the edge disappears completely or forms cycles! ALWAYS break degree ties consistently using `(deg[u] != deg[v] ? deg[u] < deg[v] : u < v)` so the oriented graph is a strict DAG!',
    },
    {
      type: 'WA',
      title: 'Double-Counting Heavy Neighbor Contributions During Light Updates',
      detail:
        'In Push/Pull neighbor sum: Light vertices `u` push to **ALL** neighbors `w` (both Light and Heavy!). Queries read `ans[u]` (which holds ALL Light neighbor sums) PLUS `val[h]` ONLY over **`heavyNbrs[u]`** (`deg[h] > B`)—so Light neighbors are counted once via push and Heavy neighbors once via pull!',
    },
    {
      type: 'MLE',
      title: 'Allocating Full `M x M` Intersection Matrices for Set Threshold Splitting',
      detail:
        'Only **Heavy** sets (`|S_k| > B`, at most `<= 300` sets!) get rows in `inter[h][k]`. Never allocate `M x M` when `M = 10^5`; `H x M` uses only `~100 MB` in typed arrays or far less with sparse non-zero `(h, count)` pairs!',
    },
  ],
  implementations: {
    cpp20: `#include <bits/stdc++.h>
using namespace std;

// Dynamic Neighbor Value Sum via Heavy-Light Push/Pull Threshold Splitting in O(Q sqrt(M))
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, m, q;
    if (!(cin >> n >> m >> q)) return 0;

    vector<vector<int>> adj(n + 1);
    for (int i = 0; i < m; i++) {
        int u, v;
        cin >> u >> v;
        adj[u].push_back(v);
        adj[v].push_back(u);
    }

    int B = max(1, (int)sqrt(2.0 * m));
    vector<bool> isHeavy(n + 1, false);
    for (int u = 1; u <= n; u++) {
        if ((int)adj[u].size() > B) isHeavy[u] = true;
    }

    vector<vector<int>> heavyNbrs(n + 1);
    for (int u = 1; u <= n; u++) {
        for (int v : adj[u]) {
            if (isHeavy[v]) heavyNbrs[u].push_back(v);
        }
    }

    vector<long long> val(n + 1, 0);
    vector<long long> lightAns(n + 1, 0);

    while (q--) {
        int typ;
        cin >> typ;
        if (typ == 1) {
            int u;
            long long x;
            cin >> u >> x;
            val[u] += x;
            if (!isHeavy[u]) {
                // Light vertex pushes eagerly to all <= B neighbors
                for (int v : adj[u]) lightAns[v] += x;
            }
        } else {
            int u;
            cin >> u;
            // Pull all Heavy neighbors lazily (at most 2M / B = O(sqrt(M)))
            long long res = lightAns[u];
            for (int h : heavyNbrs[u]) res += val[h];
            cout << res << "\\n";
        }
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
    let q: usize = it.next().unwrap().parse().unwrap();

    let mut adj = vec![Vec::new(); n + 1];
    for _ in 0..m {
        let u: usize = it.next().unwrap().parse().unwrap();
        let v: usize = it.next().unwrap().parse().unwrap();
        adj[u].push(v);
        adj[v].push(u);
    }

    let b = ((2 * m) as f64).sqrt().max(1.0) as usize;
    let is_heavy: Vec<bool> = (0..=n).map(|u| adj[u].len() > b).collect();
    let mut heavy_nbrs = vec![Vec::new(); n + 1];
    for u in 1..=n {
        for &v in &adj[u] {
            if is_heavy[v] {
                heavy_nbrs[u].push(v);
            }
        }
    }

    let mut val = vec![0i64; n + 1];
    let mut light_ans = vec![0i64; n + 1];
    let mut out = String::new();

    for _ in 0..q {
        let typ: usize = it.next().unwrap().parse().unwrap();
        if typ == 1 {
            let u: usize = it.next().unwrap().parse().unwrap();
            let x: i64 = it.next().unwrap().parse().unwrap();
            val[u] += x;
            if !is_heavy[u] {
                for &v in &adj[u] {
                    light_ans[v] += x;
                }
            }
        } else {
            let u: usize = it.next().unwrap().parse().unwrap();
            let mut res = light_ans[u];
            for &h in &heavy_nbrs[u] {
                res += val[h];
            }
            out.push_str(&format!("{}\\n", res));
        }
    }
    print!("{}", out);
}`,
    java21: `import java.io.*;
import java.util.*;

public class Main {
    static class FastScanner {
        private final InputStream in;
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;

        FastScanner(InputStream is) { this.in = is; }

        private int readByte() throws IOException {
            if (ptr >= len) {
                ptr = 0;
                len = in.read(buf);
                if (len <= 0) return -1;
            }
            return buf[ptr++];
        }

        long nextLong() throws IOException {
            int c;
            do {
                c = readByte();
                if (c == -1) return Long.MIN_VALUE;
            } while (c <= ' ');
            long sign = 1;
            if (c == '-') { sign = -1; c = readByte(); }
            long res = 0;
            while (c > ' ') {
                res = res * 10 + (c - '0');
                c = readByte();
            }
            return res * sign;
        }
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        long nLong = fs.nextLong();
        if (nLong == Long.MIN_VALUE) return;
        int n = (int) nLong, m = (int) fs.nextLong(), q = (int) fs.nextLong();

        List<List<Integer>> adj = new ArrayList<>(n + 1);
        for (int i = 0; i <= n; i++) adj.add(new ArrayList<>());
        for (int i = 0; i < m; i++) {
            int u = (int) fs.nextLong(), v = (int) fs.nextLong();
            adj.get(u).add(v);
            adj.get(v).add(u);
        }

        int B = Math.max(1, (int) Math.sqrt(2.0 * m));
        boolean[] isHeavy = new boolean[n + 1];
        for (int u = 1; u <= n; u++) {
            if (adj.get(u).size() > B) isHeavy[u] = true;
        }

        List<List<Integer>> heavyNbrs = new ArrayList<>(n + 1);
        for (int i = 0; i <= n; i++) heavyNbrs.add(new ArrayList<>());
        for (int u = 1; u <= n; u++) {
            for (int v : adj.get(u)) {
                if (isHeavy[v]) heavyNbrs.get(u).add(v);
            }
        }

        long[] val = new long[n + 1];
        long[] lightAns = new long[n + 1];
        StringBuilder sb = new StringBuilder();

        for (int i = 0; i < q; i++) {
            int typ = (int) fs.nextLong();
            if (typ == 1) {
                int u = (int) fs.nextLong();
                long x = fs.nextLong();
                val[u] += x;
                if (!isHeavy[u]) {
                    for (int v : adj.get(u)) lightAns[v] += x;
                }
            } else {
                int u = (int) fs.nextLong();
                long res = lightAns[u];
                for (int h : heavyNbrs.get(u)) res += val[h];
                sb.append(res).append('\\n');
            }
        }
        System.out.print(sb.toString());
    }
}`,
    python3: `import math
import sys

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    m = int(data[1])
    q = int(data[2])

    adj = [[] for _ in range(n + 1)]
    idx = 3
    for _ in range(m):
        u = int(data[idx]); v = int(data[idx + 1])
        idx += 2
        adj[u].append(v)
        adj[v].append(u)

    B = max(1, math.isqrt(2 * m))
    is_heavy = [len(adj[u]) > B for u in range(n + 1)]
    heavy_nbrs = [[] for _ in range(n + 1)]
    for u in range(1, n + 1):
        for v in adj[u]:
            if is_heavy[v]:
                heavy_nbrs[u].append(v)

    val = [0] * (n + 1)
    light_ans = [0] * (n + 1)
    out = []
    for _ in range(q):
        typ = int(data[idx])
        if typ == 1:
            u = int(data[idx + 1]); x = int(data[idx + 2])
            idx += 3
            val[u] += x
            if not is_heavy[u]:
                for v in adj[u]:
                    light_ans[v] += x
        else:
            u = int(data[idx + 1])
            idx += 2
            res = light_ans[u]
            for h in heavy_nbrs[u]:
                res += val[h]
            out.append(str(res))
    sys.stdout.write("\\n".join(out) + "\\n")

if __name__ == "__main__":
    solve()`,
    ruby: `tokens = $stdin.read.split
exit if tokens.empty?
n = tokens[0].to_i
m = tokens[1].to_i
q = tokens[2].to_i

adj = Array.new(n + 1) { [] }
idx = 3
m.times do
  u = tokens[idx].to_i; v = tokens[idx + 1].to_i
  idx += 2
  adj[u] << v
  adj[v] << u
end

b = [1, Math.sqrt(2.0 * m).to_i].max
is_heavy = Array.new(n + 1) { |u| adj[u].length > b }
heavy_nbrs = Array.new(n + 1) { [] }
(1..n).each do |u|
  adj[u].each { |v| heavy_nbrs[u] << v if is_heavy[v] }
end

val = Array.new(n + 1, 0)
light_ans = Array.new(n + 1, 0)
out = []
q.times do
  typ = tokens[idx].to_i
  if typ == 1
    u = tokens[idx + 1].to_i; x = tokens[idx + 2].to_i
    idx += 3
    val[u] += x
    unless is_heavy[u]
      adj[u].each { |v| light_ans[v] += x }
    end
  else
    u = tokens[idx + 1].to_i
    idx += 2
    res = light_ans[u]
    heavy_nbrs[u].each { |h| res += val[h] }
    out << res.to_s
  end
end
puts out.join("\\n")`,
  },
  practiceProblems: [
    {
      id: 'ch58-p1',
      tier: 'Warmup',
      ratingRange: '1800–2000',
      title: 'Count Triangles in a Sparse Graph in O(M sqrt(M))',
      statement:
        'Given an undirected simple graph with `N` vertices (`1 <= N <= 2 * 10^5`) and `M` edges (`0 <= M <= 2 * 10^5`), count the total number of unordered vertex triples `{u, v, w}` forming a triangle (`(u,v), (v,w), (u,w) in E`) in `O(M sqrt(M))` time.',
      constraints: '1 <= N <= 2 * 10^5, 0 <= M <= 2 * 10^5',
      sampleInput: `4 5
1 2
2 3
1 3
3 4
2 4`,
      sampleOutput: `2`,
      hints: [
        'Compute degree `deg[u]` for every vertex first.',
        'Orient each edge `(u, v)` from lower `(deg[u], u)` to higher `(deg[v], v)` into a directed out-adjacency list `out[]` (converting the graph into a DAG where every vertex has `out.size() <= sqrt(2M)`!).',
        'For each `u`, stamp `vis[w] = u` over `w in out[u]`, then iterate `w in out[u]` and `z in out[w]` incrementing `ans` whenever `vis[z] == u`.',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, m;
    if (!(cin >> n >> m)) return 0;
    vector<pair<int, int>> edges(m);
    vector<int> deg(n + 1, 0);
    for (int i = 0; i < m; i++) {
        cin >> edges[i].first >> edges[i].second;
        deg[edges[i].first]++;
        deg[edges[i].second]++;
    }

    vector<vector<int>> out(n + 1);
    for (auto [u, v] : edges) {
        if (tie(deg[u], u) < tie(deg[v], v)) out[u].push_back(v);
        else out[v].push_back(u);
    }

    vector<int> vis(n + 1, 0);
    long long triangles = 0;
    for (int u = 1; u <= n; u++) {
        for (int w : out[u]) vis[w] = u;
        for (int w : out[u]) {
            for (int z : out[w]) {
                if (vis[z] == u) triangles++;
            }
        }
    }
    cout << triangles << "\\n";
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

    let mut edges = Vec::with_capacity(m);
    let mut deg = vec![0usize; n + 1];
    for _ in 0..m {
        let u: usize = it.next().unwrap().parse().unwrap();
        let v: usize = it.next().unwrap().parse().unwrap();
        edges.push((u, v));
        deg[u] += 1;
        deg[v] += 1;
    }

    let mut out = vec![Vec::new(); n + 1];
    for &(u, v) in &edges {
        if (deg[u], u) < (deg[v], v) {
            out[u].push(v);
        } else {
            out[v].push(u);
        }
    }

    let mut vis = vec![0usize; n + 1];
    let mut triangles: i64 = 0;
    for u in 1..=n {
        for &w in &out[u] { vis[w] = u; }
        for &w in &out[u] {
            for &z in &out[w] {
                if vis[z] == u {
                    triangles += 1;
                }
            }
        }
    }
    println!("{}", triangles);
}`,
        java21: `import java.io.*;
import java.util.*;

public class Main {
    static class FastScanner {
        private final InputStream in;
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;

        FastScanner(InputStream is) { this.in = is; }

        private int readByte() throws IOException {
            if (ptr >= len) {
                ptr = 0;
                len = in.read(buf);
                if (len <= 0) return -1;
            }
            return buf[ptr++];
        }

        long nextLong() throws IOException {
            int c;
            do {
                c = readByte();
                if (c == -1) return Long.MIN_VALUE;
            } while (c <= ' ');
            long sign = 1;
            if (c == '-') { sign = -1; c = readByte(); }
            long res = 0;
            while (c > ' ') {
                res = res * 10 + (c - '0');
                c = readByte();
            }
            return res * sign;
        }
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        long nLong = fs.nextLong();
        if (nLong == Long.MIN_VALUE) return;
        int n = (int) nLong, m = (int) fs.nextLong();

        int[] eu = new int[m], ev = new int[m], deg = new int[n + 1];
        for (int i = 0; i < m; i++) {
            eu[i] = (int) fs.nextLong();
            ev[i] = (int) fs.nextLong();
            deg[eu[i]]++;
            deg[ev[i]]++;
        }

        List<List<Integer>> out = new ArrayList<>(n + 1);
        for (int i = 0; i <= n; i++) out.add(new ArrayList<>());
        for (int i = 0; i < m; i++) {
            int u = eu[i], v = ev[i];
            if (deg[u] < deg[v] || (deg[u] == deg[v] && u < v)) out.get(u).add(v);
            else out.get(v).add(u);
        }

        int[] vis = new int[n + 1];
        long triangles = 0;
        for (int u = 1; u <= n; u++) {
            for (int w : out.get(u)) vis[w] = u;
            for (int w : out.get(u)) {
                for (int z : out.get(w)) {
                    if (vis[z] == u) triangles++;
                }
            }
        }
        System.out.println(triangles);
    }
}`,
        python3: `import sys

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    m = int(data[1])
    edges = []
    deg = [0] * (n + 1)
    idx = 2
    for _ in range(m):
        u = int(data[idx]); v = int(data[idx + 1])
        idx += 2
        edges.append((u, v))
        deg[u] += 1
        deg[v] += 1

    out = [[] for _ in range(n + 1)]
    for u, v in edges:
        if (deg[u], u) < (deg[v], v):
            out[u].append(v)
        else:
            out[v].append(u)

    vis = [0] * (n + 1)
    triangles = 0
    for u in range(1, n + 1):
        for w in out[u]:
            vis[w] = u
        for w in out[u]:
            for z in out[w]:
                if vis[z] == u:
                    triangles += 1
    sys.stdout.write(f"{triangles}\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
n = tokens[0].to_i
m = tokens[1].to_i

edges = []
deg = Array.new(n + 1, 0)
idx = 2
m.times do
  u = tokens[idx].to_i; v = tokens[idx + 1].to_i
  idx += 2
  edges << [u, v]
  deg[u] += 1; deg[v] += 1
end

out = Array.new(n + 1) { [] }
edges.each do |u, v|
  if deg[u] < deg[v] || (deg[u] == deg[v] && u < v)
    out[u] << v
  else
    out[v] << u
  end
end

vis = Array.new(n + 1, 0)
triangles = 0
(1..n).each do |u|
  out[u].each { |w| vis[w] = u }
  out[u].each do |w|
    out[w].each { |z| triangles += 1 if vis[z] == u }
  end
end
puts triangles`,
      },
    },
    {
      id: 'ch58-p2',
      tier: 'Standard',
      ratingRange: '1900–2100',
      title: 'Dynamic Neighbor Color / Value Sum Queries (Push-Pull)',
      statement:
        'Given an undirected graph (`1 <= N <= 10^5`, `0 <= M <= 10^5`) where every vertex initially holds value `0`, process `Q` queries (`1 <= Q <= 10^5`): `1 u x` adds `x` to `val[u]`; `2 u` outputs the sum of `val[v]` over all neighbors `v` adjacent to `u`.',
      constraints: '1 <= N, M, Q <= 10^5, -10^9 <= x <= 10^9',
      sampleInput: `4 4 4
1 2
2 3
3 4
1 4
1 1 5
2 2
1 3 10
2 2`,
      sampleOutput: `5
15`,
      hints: [
        'Classify vertices as Heavy (`deg[u] > sqrt(2M)`) vs Light (`deg[u] <= sqrt(2M)`).',
        'Precompute `heavyNbrs[u]` containing only Heavy neighbors of `u` (at most `2M / B = O(sqrt(M))` total heavy vertices exist!).',
        'On update `1 u x`: update `val[u] += x`, and ONLY if `u` is Light push `lightAns[v] += x` across `adj[u]`. On query `2 u`: return `lightAns[u] + sum_{h in heavyNbrs[u]} val[h]`.',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, m, q;
    if (!(cin >> n >> m >> q)) return 0;

    vector<vector<int>> adj(n + 1);
    for (int i = 0; i < m; i++) {
        int u, v;
        cin >> u >> v;
        adj[u].push_back(v);
        adj[v].push_back(u);
    }

    int B = max(1, (int)sqrt(2.0 * m));
    vector<bool> heavy(n + 1, false);
    for (int u = 1; u <= n; u++) heavy[u] = ((int)adj[u].size() > B);

    vector<vector<int>> heavyNbrs(n + 1);
    for (int u = 1; u <= n; u++) {
        for (int v : adj[u]) {
            if (heavy[v]) heavyNbrs[u].push_back(v);
        }
    }

    vector<long long> val(n + 1, 0), lightSum(n + 1, 0);
    while (q--) {
        int typ;
        cin >> typ;
        if (typ == 1) {
            int u;
            long long x;
            cin >> u >> x;
            val[u] += x;
            if (!heavy[u]) {
                for (int v : adj[u]) lightSum[v] += x;
            }
        } else {
            int u;
            cin >> u;
            long long ans = lightSum[u];
            for (int h : heavyNbrs[u]) ans += val[h];
            cout << ans << "\\n";
        }
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
    let q: usize = it.next().unwrap().parse().unwrap();

    let mut adj = vec![Vec::new(); n + 1];
    for _ in 0..m {
        let u: usize = it.next().unwrap().parse().unwrap();
        let v: usize = it.next().unwrap().parse().unwrap();
        adj[u].push(v);
        adj[v].push(u);
    }

    let b = ((2 * m) as f64).sqrt().max(1.0) as usize;
    let heavy: Vec<bool> = (0..=n).map(|u| adj[u].len() > b).collect();
    let mut heavy_nbrs = vec![Vec::new(); n + 1];
    for u in 1..=n {
        for &v in &adj[u] {
            if heavy[v] { heavy_nbrs[u].push(v); }
        }
    }

    let mut val = vec![0i64; n + 1];
    let mut light_sum = vec![0i64; n + 1];
    let mut out = String::new();
    for _ in 0..q {
        let typ: usize = it.next().unwrap().parse().unwrap();
        if typ == 1 {
            let u: usize = it.next().unwrap().parse().unwrap();
            let x: i64 = it.next().unwrap().parse().unwrap();
            val[u] += x;
            if !heavy[u] {
                for &v in &adj[u] { light_sum[v] += x; }
            }
        } else {
            let u: usize = it.next().unwrap().parse().unwrap();
            let mut ans = light_sum[u];
            for &h in &heavy_nbrs[u] { ans += val[h]; }
            out.push_str(&format!("{}\\n", ans));
        }
    }
    print!("{}", out);
}`,
        java21: `import java.io.*;
import java.util.*;

public class Main {
    static class FastScanner {
        private final InputStream in;
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;

        FastScanner(InputStream is) { this.in = is; }

        private int readByte() throws IOException {
            if (ptr >= len) {
                ptr = 0;
                len = in.read(buf);
                if (len <= 0) return -1;
            }
            return buf[ptr++];
        }

        long nextLong() throws IOException {
            int c;
            do {
                c = readByte();
                if (c == -1) return Long.MIN_VALUE;
            } while (c <= ' ');
            long sign = 1;
            if (c == '-') { sign = -1; c = readByte(); }
            long res = 0;
            while (c > ' ') {
                res = res * 10 + (c - '0');
                c = readByte();
            }
            return res * sign;
        }
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        long nLong = fs.nextLong();
        if (nLong == Long.MIN_VALUE) return;
        int n = (int) nLong, m = (int) fs.nextLong(), q = (int) fs.nextLong();

        List<List<Integer>> adj = new ArrayList<>(n + 1);
        for (int i = 0; i <= n; i++) adj.add(new ArrayList<>());
        for (int i = 0; i < m; i++) {
            int u = (int) fs.nextLong(), v = (int) fs.nextLong();
            adj.get(u).add(v);
            adj.get(v).add(u);
        }

        int B = Math.max(1, (int) Math.sqrt(2.0 * m));
        boolean[] heavy = new boolean[n + 1];
        for (int u = 1; u <= n; u++) heavy[u] = adj.get(u).size() > B;

        List<List<Integer>> heavyNbrs = new ArrayList<>(n + 1);
        for (int i = 0; i <= n; i++) heavyNbrs.add(new ArrayList<>());
        for (int u = 1; u <= n; u++) {
            for (int v : adj.get(u)) {
                if (heavy[v]) heavyNbrs.get(u).add(v);
            }
        }

        long[] val = new long[n + 1], lightSum = new long[n + 1];
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < q; i++) {
            int typ = (int) fs.nextLong();
            if (typ == 1) {
                int u = (int) fs.nextLong();
                long x = fs.nextLong();
                val[u] += x;
                if (!heavy[u]) {
                    for (int v : adj.get(u)) lightSum[v] += x;
                }
            } else {
                int u = (int) fs.nextLong();
                long ans = lightSum[u];
                for (int h : heavyNbrs.get(u)) ans += val[h];
                sb.append(ans).append('\\n');
            }
        }
        System.out.print(sb.toString());
    }
}`,
        python3: `import math
import sys

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    m = int(data[1])
    q = int(data[2])
    adj = [[] for _ in range(n + 1)]
    idx = 3
    for _ in range(m):
        u = int(data[idx]); v = int(data[idx + 1])
        idx += 2
        adj[u].append(v)
        adj[v].append(u)

    B = max(1, math.isqrt(2 * m))
    heavy = [len(adj[u]) > B for u in range(n + 1)]
    heavy_nbrs = [[] for _ in range(n + 1)]
    for u in range(1, n + 1):
        for v in adj[u]:
            if heavy[v]:
                heavy_nbrs[u].append(v)

    val = [0] * (n + 1)
    light_sum = [0] * (n + 1)
    out = []
    for _ in range(q):
        typ = int(data[idx])
        if typ == 1:
            u = int(data[idx + 1]); x = int(data[idx + 2])
            idx += 3
            val[u] += x
            if not heavy[u]:
                for v in adj[u]:
                    light_sum[v] += x
        else:
            u = int(data[idx + 1])
            idx += 2
            ans = light_sum[u]
            for h in heavy_nbrs[u]:
                ans += val[h]
            out.append(str(ans))
    sys.stdout.write("\\n".join(out) + "\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
n = tokens[0].to_i
m = tokens[1].to_i
q = tokens[2].to_i

adj = Array.new(n + 1) { [] }
idx = 3
m.times do
  u = tokens[idx].to_i; v = tokens[idx + 1].to_i
  idx += 2
  adj[u] << v
  adj[v] << u
end

b = [1, Math.sqrt(2.0 * m).to_i].max
heavy = Array.new(n + 1) { |u| adj[u].length > b }
heavy_nbrs = Array.new(n + 1) { [] }
(1..n).each do |u|
  adj[u].each { |v| heavy_nbrs[u] << v if heavy[v] }
end

val = Array.new(n + 1, 0)
light_sum = Array.new(n + 1, 0)
out = []
q.times do
  typ = tokens[idx].to_i
  if typ == 1
    u = tokens[idx + 1].to_i; x = tokens[idx + 2].to_i
    idx += 3
    val[u] += x
    unless heavy[u]
      adj[u].each { |v| light_sum[v] += x }
    end
  else
    u = tokens[idx + 1].to_i
    idx += 2
    ans = light_sum[u]
    heavy_nbrs[u].each { |h| ans += val[h] }
    out << ans.to_s
  end
end
puts out.join("\\n")`,
      },
    },
    {
      id: 'ch58-p3',
      tier: 'Boss',
      ratingRange: '2200–2500',
      title: 'Subset Sum Updates & Queries via Heavy-Light Splitting',
      statement:
        'You have an array `a[1..N]` (`1 <= N <= 10^5`) and `M` index subsets `S_1..S_M` (`sum |S_k| <= 10^5`). Process `Q` operations (`1 <= Q <= 10^5`): `1 k x` adds `x` to every element `a[i]` for `i in S_k`; `2 k` prints the current sum of `a[i]` over all `i in S_k`.',
      constraints: '1 <= N, M, Q <= 10^5, sum |S_k| <= 10^5, |a_i|, |x| <= 10^8',
      sampleInput: `5 3 5
5 -5 5 1 -4
2 1 2
4 2 1 4 5
2 2 5
2 2
1 3 4
2 1
1 2 1
2 2`,
      sampleOutput: `-3
4
9`,
      hints: [
        'Choose threshold `B = 350`. Mark any subset `S_k` with `|S_k| > B` as Heavy (at most `10^5 / 350 <= 285` Heavy sets exist!).',
        'For every Heavy set `h`, mark its members in `O(N)` and compute `overlap[k]` storing pairs `(h, |S_h ∩ S_k|)` in `O(H * sum |S_k|)` total precomputation time.',
        'Maintain `lightVal[1..N]`, `heavyAdd[h]`, and `heavySum[h]`: Heavy updates touch ONLY `heavyAdd[h] += x`; Light updates update `lightVal[i]` and propagate `x * inter` to `heavySum[h]`; queries sum `lightVal` (for Light) or `heavySum` (for Heavy) plus `heavyAdd[h] * inter` over `overlap[k]`!',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, m, q;
    if (!(cin >> n >> m >> q)) return 0;

    vector<long long> lightVal(n + 1);
    for (int i = 1; i <= n; i++) cin >> lightVal[i];

    vector<vector<int>> sets(m + 1);
    long long totalLen = 0;
    for (int k = 1; k <= m; k++) {
        int sz;
        cin >> sz;
        sets[k].resize(sz);
        for (int j = 0; j < sz; j++) cin >> sets[k][j];
        totalLen += sz;
    }

    int B = max(1, (int)sqrt((double)totalLen));
    vector<int> heavySets;
    vector<int> heavyId(m + 1, -1);
    for (int k = 1; k <= m; k++) {
        if ((int)sets[k].size() > B) {
            heavyId[k] = (int)heavySets.size();
            heavySets.push_back(k);
        }
    }

    int H = (int)heavySets.size();
    vector<long long> heavySum(H, 0), heavyAdd(H, 0);
    // overlap[k] stores (hIdx, |S_k ∩ S_{heavySets[hIdx]}|)
    vector<vector<pair<int, int>>> overlap(m + 1);
    vector<char> mark(n + 1, 0);

    for (int h = 0; h < H; h++) {
        int hk = heavySets[h];
        for (int elem : sets[hk]) {
            mark[elem] = 1;
            heavySum[h] += lightVal[elem];
        }
        for (int k = 1; k <= m; k++) {
            int cnt = 0;
            for (int elem : sets[k]) {
                if (mark[elem]) cnt++;
            }
            if (cnt > 0) overlap[k].push_back({h, cnt});
        }
        for (int elem : sets[hk]) mark[elem] = 0;
    }

    while (q--) {
        int typ, k;
        cin >> typ >> k;
        if (typ == 1) {
            long long x;
            cin >> x;
            if (heavyId[k] != -1) {
                heavyAdd[heavyId[k]] += x;
            } else {
                for (int elem : sets[k]) lightVal[elem] += x;
                for (auto [h, cnt] : overlap[k]) heavySum[h] += x * cnt;
            }
        } else {
            long long ans = 0;
            if (heavyId[k] != -1) {
                ans = heavySum[heavyId[k]];
            } else {
                for (int elem : sets[k]) ans += lightVal[elem];
            }
            for (auto [h, cnt] : overlap[k]) ans += heavyAdd[h] * cnt;
            cout << ans << "\\n";
        }
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
    let q: usize = it.next().unwrap().parse().unwrap();

    let mut light_val = vec![0i64; n + 1];
    for i in 1..=n {
        light_val[i] = it.next().unwrap().parse().unwrap();
    }

    let mut sets = vec![Vec::new(); m + 1];
    let mut total_len = 0usize;
    for k in 1..=m {
        let sz: usize = it.next().unwrap().parse().unwrap();
        total_len += sz;
        sets[k].reserve(sz);
        for _ in 0..sz {
            sets[k].push(it.next().unwrap().parse::<usize>().unwrap());
        }
    }

    let b = ((total_len as f64).sqrt() as usize).max(1);
    let mut heavy_sets = Vec::new();
    let mut heavy_id = vec![usize::MAX; m + 1];
    for k in 1..=m {
        if sets[k].len() > b {
            heavy_id[k] = heavy_sets.len();
            heavy_sets.push(k);
        }
    }

    let h_cnt = heavy_sets.len();
    let mut heavy_sum = vec![0i64; h_cnt];
    let mut heavy_add = vec![0i64; h_cnt];
    let mut overlap = vec![Vec::new(); m + 1];
    let mut mark = vec![false; n + 1];

    for (h, &hk) in heavy_sets.iter().enumerate() {
        for &elem in &sets[hk] {
            mark[elem] = true;
            heavy_sum[h] += light_val[elem];
        }
        for k in 1..=m {
            let mut cnt = 0i64;
            for &elem in &sets[k] {
                if mark[elem] { cnt += 1; }
            }
            if cnt > 0 { overlap[k].push((h, cnt)); }
        }
        for &elem in &sets[hk] { mark[elem] = false; }
    }

    let mut out = String::new();
    for _ in 0..q {
        let typ: usize = it.next().unwrap().parse().unwrap();
        let k: usize = it.next().unwrap().parse().unwrap();
        if typ == 1 {
            let x: i64 = it.next().unwrap().parse().unwrap();
            if heavy_id[k] != usize::MAX {
                heavy_add[heavy_id[k]] += x;
            } else {
                for &elem in &sets[k] { light_val[elem] += x; }
                for &(h, cnt) in &overlap[k] { heavy_sum[h] += x * cnt; }
            }
        } else {
            let mut ans = if heavy_id[k] != usize::MAX {
                heavy_sum[heavy_id[k]]
            } else {
                sets[k].iter().map(|&elem| light_val[elem]).sum()
            };
            for &(h, cnt) in &overlap[k] { ans += heavy_add[h] * cnt; }
            out.push_str(&format!("{}\\n", ans));
        }
    }
    print!("{}", out);
}`,
        java21: `import java.io.*;
import java.util.*;

public class Main {
    static class FastScanner {
        private final InputStream in;
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;

        FastScanner(InputStream is) { this.in = is; }

        private int readByte() throws IOException {
            if (ptr >= len) {
                ptr = 0;
                len = in.read(buf);
                if (len <= 0) return -1;
            }
            return buf[ptr++];
        }

        long nextLong() throws IOException {
            int c;
            do {
                c = readByte();
                if (c == -1) return Long.MIN_VALUE;
            } while (c <= ' ');
            long sign = 1;
            if (c == '-') { sign = -1; c = readByte(); }
            long res = 0;
            while (c > ' ') {
                res = res * 10 + (c - '0');
                c = readByte();
            }
            return res * sign;
        }
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        long nLong = fs.nextLong();
        if (nLong == Long.MIN_VALUE) return;
        int n = (int) nLong, m = (int) fs.nextLong(), q = (int) fs.nextLong();

        long[] lightVal = new long[n + 1];
        for (int i = 1; i <= n; i++) lightVal[i] = fs.nextLong();

        int[][] sets = new int[m + 1][];
        long totalLen = 0;
        for (int k = 1; k <= m; k++) {
            int sz = (int) fs.nextLong();
            sets[k] = new int[sz];
            for (int j = 0; j < sz; j++) sets[k][j] = (int) fs.nextLong();
            totalLen += sz;
        }

        int B = Math.max(1, (int) Math.sqrt(totalLen));
        int[] heavyId = new int[m + 1];
        Arrays.fill(heavyId, -1);
        List<Integer> heavySets = new ArrayList<>();
        for (int k = 1; k <= m; k++) {
            if (sets[k].length > B) {
                heavyId[k] = heavySets.size();
                heavySets.add(k);
            }
        }

        int H = heavySets.size();
        long[] heavySum = new long[H], heavyAdd = new long[H];
        List<int[]>[] overlapH = new ArrayList[m + 1];
        for (int k = 1; k <= m; k++) overlapH[k] = new ArrayList<>();
        boolean[] mark = new boolean[n + 1];

        for (int h = 0; h < H; h++) {
            int hk = heavySets.get(h);
            for (int elem : sets[hk]) {
                mark[elem] = true;
                heavySum[h] += lightVal[elem];
            }
            for (int k = 1; k <= m; k++) {
                int cnt = 0;
                for (int elem : sets[k]) if (mark[elem]) cnt++;
                if (cnt > 0) overlapH[k].add(new int[]{h, cnt});
            }
            for (int elem : sets[hk]) mark[elem] = false;
        }

        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < q; i++) {
            int typ = (int) fs.nextLong(), k = (int) fs.nextLong();
            if (typ == 1) {
                long x = fs.nextLong();
                if (heavyId[k] != -1) {
                    heavyAdd[heavyId[k]] += x;
                } else {
                    for (int elem : sets[k]) lightVal[elem] += x;
                    for (int[] pair : overlapH[k]) heavySum[pair[0]] += x * pair[1];
                }
            } else {
                long ans = 0;
                if (heavyId[k] != -1) {
                    ans = heavySum[heavyId[k]];
                } else {
                    for (int elem : sets[k]) ans += lightVal[elem];
                }
                for (int[] pair : overlapH[k]) ans += heavyAdd[pair[0]] * pair[1];
                sb.append(ans).append('\\n');
            }
        }
        System.out.print(sb.toString());
    }
}`,
        python3: `import math
import sys

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    m = int(data[1])
    q = int(data[2])
    light_val = [0] + [int(data[3 + i]) for i in range(n)]

    idx = 3 + n
    sets = [[]]
    total_len = 0
    for _ in range(m):
        sz = int(data[idx])
        idx += 1
        sets.append([int(data[idx + j]) for j in range(sz)])
        idx += sz
        total_len += sz

    B = max(1, math.isqrt(total_len))
    heavy_sets = []
    heavy_id = [-1] * (m + 1)
    for k in range(1, m + 1):
        if len(sets[k]) > B:
            heavy_id[k] = len(heavy_sets)
            heavy_sets.append(k)

    H = len(heavy_sets)
    heavy_sum = [0] * H
    heavy_add = [0] * H
    overlap = [[] for _ in range(m + 1)]
    mark = [False] * (n + 1)

    for h, hk in enumerate(heavy_sets):
        s_val = 0
        for elem in sets[hk]:
            mark[elem] = True
            s_val += light_val[elem]
        heavy_sum[h] = s_val
        for k in range(1, m + 1):
            cnt = 0
            for elem in sets[k]:
                if mark[elem]:
                    cnt += 1
            if cnt > 0:
                overlap[k].append((h, cnt))
        for elem in sets[hk]:
            mark[elem] = False

    out = []
    for _ in range(q):
        typ = int(data[idx]); k = int(data[idx + 1])
        idx += 2
        if typ == 1:
            x = int(data[idx])
            idx += 1
            if heavy_id[k] != -1:
                heavy_add[heavy_id[k]] += x
            else:
                for elem in sets[k]:
                    light_val[elem] += x
                for h, cnt in overlap[k]:
                    heavy_sum[h] += x * cnt
        else:
            if heavy_id[k] != -1:
                ans = heavy_sum[heavy_id[k]]
            else:
                ans = sum(light_val[elem] for elem in sets[k])
            for h, cnt in overlap[k]:
                ans += heavy_add[h] * cnt
            out.append(str(ans))
    sys.stdout.write("\\n".join(out) + "\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
n = tokens[0].to_i
m = tokens[1].to_i
q = tokens[2].to_i

light_val = [0] + Array.new(n) { |i| tokens[3 + i].to_i }
idx = 3 + n
sets = [[]]
total_len = 0
m.times do
  sz = tokens[idx].to_i
  idx += 1
  sets << Array.new(sz) { |j| tokens[idx + j].to_i }
  idx += sz
  total_len += sz
end

b = [1, Math.sqrt(total_len.to_f).to_i].max
heavy_sets = []
heavy_id = Array.new(m + 1, -1)
(1..m).each do |k|
  if sets[k].length > b
    heavy_id[k] = heavy_sets.length
    heavy_sets << k
  end
end

h_cnt = heavy_sets.length
heavy_sum = Array.new(h_cnt, 0)
heavy_add = Array.new(h_cnt, 0)
overlap = Array.new(m + 1) { [] }
mark = Array.new(n + 1, false)

heavy_sets.each_with_index do |hk, h|
  s_val = 0
  sets[hk].each do |elem|
    mark[elem] = true
    s_val += light_val[elem]
  end
  heavy_sum[h] = s_val
  (1..m).each do |k|
    cnt = 0
    sets[k].each { |elem| cnt += 1 if mark[elem] }
    overlap[k] << [h, cnt] if cnt > 0
  end
  sets[hk].each { |elem| mark[elem] = false }
end

out = []
q.times do
  typ = tokens[idx].to_i; k = tokens[idx + 1].to_i
  idx += 2
  if typ == 1
    x = tokens[idx].to_i
    idx += 1
    if heavy_id[k] != -1
      heavy_add[heavy_id[k]] += x
    else
      sets[k].each { |elem| light_val[elem] += x }
      overlap[k].each { |h, cnt| heavy_sum[h] += x * cnt }
    end
  else
    ans = heavy_id[k] != -1 ? heavy_sum[heavy_id[k]] : sets[k].sum { |elem| light_val[elem] }
    overlap[k].each { |h, cnt| ans += heavy_add[h] * cnt }
    out << ans.to_s
  end
end
puts out.join("\\n")`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'Codeforces',
      title: 'Subset Sums (348C) & Graph Online Queries',
      difficulty: '2000–2200',
      url: 'https://codeforces.com/problemset/problem/348/C',
      patternNote: 'Benchmark for Heavy-Light set threshold splitting with precomputed intersections.',
    },
    {
      platform: 'AtCoder',
      title: 'ABC / ARC — Triangle Counting & Push/Pull Celebrity Graphs',
      difficulty: '1850',
      url: 'https://atcoder.jp',
      patternNote: 'Degree-oriented DAG out-degree bound <= sqrt(2M) and hybrid node update routing.',
    },
    {
      platform: 'CSES',
      title: 'Counting Triangles / Dynamic High-Degree Queries',
      difficulty: 'Platinum',
      url: 'https://cses.fi/problemset',
      patternNote: 'Avoid O(N^2) on star graphs using sqrt(2M) degree threshold separation.',
    },
    {
      platform: 'CodeChef',
      title: 'CHEFGRAPH / Dynamic Friends Feed',
      difficulty: '2100',
      url: 'https://www.codechef.com',
      patternNote: 'Light nodes push eagerly; Heavy nodes pull lazily across heavy-neighbor adjacency lists.',
    },
    {
      platform: 'HackerRank',
      title: 'String Set Threshold Matching & Triangle Enumeration',
      difficulty: 'Hard',
      url: 'https://www.hackerrank.com/challenges',
      patternNote: 'Balance two complementary algorithms at B = sqrt(total size) to cap worst-case ops.',
    },
    {
      platform: 'NeetCode 150',
      title: 'Design Twitter (355) Scaled to Celebrity Fan-Out',
      difficulty: 'Medium -> System',
      url: 'https://leetcode.com/problems/design-twitter/',
      patternNote: 'Production push/pull architecture separating light users from high-follower celebrities.',
    },
  ],
  interviewNotes: [
    'Why does orienting undirected edges `(deg[u], u) < (deg[v], v)` guarantee every vertex has out-degree `<= sqrt(2M)`? Because every out-neighbor `w` of `u` has total degree `>= deg[u] >= out_deg[u]`, forcing `out_deg[u]^2 <= sum_{w in out[u]} deg[w] <= 2M`.',
    'How does Push-vs-Pull splitting turn worst-case star-graph `O(Q * N)` into `O(Q * sqrt(2M))`? Light vertices (`deg <= sqrt(2M)`) push to `<= sqrt(2M)` neighbors, and Heavy vertices (`deg > sqrt(2M)`) can occur at most `2M / sqrt(2M) = sqrt(2M)` times in the entire graph!',
    'In set-sum splitting, always adjust threshold `B` based on `sum |S_k|` (typically `sqrt(totalLen)` or ~350–500 in C++), and tie-break graph degree comparisons with vertex ID to keep the oriented graph acyclic.',
  ],
  projectBlueprint: {
    title: 'Social Graph Celebrity Fan-Out & Hybrid Push/Pull Feed Router',
    tagline:
      'Adaptive notification engine mimicking large-scale social timelines by pushing fan-out updates eagerly for standard users while routing celebrity feeds via lazy query pulls.',
    stackSummary: 'TypeScript Heavy-Light Push/Pull Feed Dispatcher',
    asciiDiagram: `[Post Event by Author u]
        |
        +---(followers <= B: Light)---> [Push directly to follower inboxes: O(B)]
        |
        +---(followers > B: Celebrity)---> [Store in Author inbox; readers pull <= sqrt(2M) stars]`,
    milestones: [
      {
        id: 'm1',
        title: 'Dynamic Follower-Degree Classifier',
        detail: 'Partition nodes at threshold B = sqrt(2 * Edges) and maintain each user’s heavy-following list.',
      },
      {
        id: 'm2',
        title: 'Push-Only Light Fan-Out Writer',
        detail: 'Broadcast posts/score updates immediately into follower caches when degree <= B.',
      },
      {
        id: 'm3',
        title: 'Hybrid Query Timeline Merger',
        detail: 'Combine pre-pushed Light counters with lazy reads from the user’s Heavy-celebrity list.',
      },
    ],
    starterCode: `export class HybridPushPullRouter {
  private adj: number[][];
  private isHeavy: boolean[];
  private heavyNbrs: number[][];
  private val: number[];
  private lightInbox: number[];

  constructor(n: number, edges: [number, number][]) {
    this.adj = Array.from({ length: n + 1 }, () => []);
    for (const [u, v] of edges) {
      this.adj[u].push(v);
      this.adj[v].push(u);
    }
    const B = Math.max(1, Math.floor(Math.sqrt(2 * edges.length)));
    this.isHeavy = Array.from({ length: n + 1 }, (_, u) => this.adj[u].length > B);
    this.heavyNbrs = Array.from({ length: n + 1 }, () => []);
    for (let u = 1; u <= n; u++) {
      for (const v of this.adj[u]) {
        if (this.isHeavy[v]) this.heavyNbrs[u].push(v);
      }
    }
    this.val = new Array(n + 1).fill(0);
    this.lightInbox = new Array(n + 1).fill(0);
  }

  publishDelta(u: number, delta: number): void {
    this.val[u] += delta;
    if (!this.isHeavy[u]) {
      for (const v of this.adj[u]) this.lightInbox[v] += delta;
    }
  }

  queryFeedSum(u: number): number {
    let total = this.lightInbox[u];
    for (const h of this.heavyNbrs[u]) total += this.val[h];
    return total;
  }
}

const router = new HybridPushPullRouter(4, [[1, 2], [2, 3], [3, 4], [1, 4]]);
router.publishDelta(1, 5);
router.publishDelta(3, 10);
console.log('Node 2 feed sum:', router.queryFeedSum(2));`,
  },
};
