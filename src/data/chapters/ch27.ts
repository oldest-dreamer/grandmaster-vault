import type { TheoryChapter } from '../../types/vault';

export const CH27_CENTROID_DECOMP: TheoryChapter = {
  slug: 'centroid-decomposition',
  topicId: 'gr-38',
  title: 'Centroid Decomposition & Distance Queries',
  domain: 'Graph & Tree Theory',
  ratingTier: '2200–2600',
  usacoDivision: 'Platinum',
  subtitle:
    'Recursively split any tree at its balanced centroid (every branch <= N/2) to build a virtual Centroid Tree of height <= log2(N), powering O(N log N) path-length counting and O(log^2 N) dynamic distance queries.',
  analogyTitle: 'The Highway Toll-Plaza Divide & Conquer Analogy',
  analogyBody:
    'Suppose a country’s road map is a huge line or star-shaped tree of 200,000 towns, and commuters constantly open new depots (`update(v)`) or ask "how far is town `u` from the nearest open depot?" Walking every branch in the original tree could take `200,000` hops if the tree is a long caterpillar! Instead, **Centroid Decomposition** finds the single most balanced hub town (the **Centroid**, whose removal leaves every remaining province at most half the size `<= N/2`), builds a federal control tower there, and recursively repeats inside each detached province. Because component sizes halve at every level, every town has at most `log2(N) <= 18` centroid bosses above it! Better yet, ANY path `(u, v)` in the original tree passes through at least one common centroid boss `c` (`lca_centroid(u, v)`), cleanly splitting `dist(u, v) = dist(u, c) + dist(c, v)`!',
  prerequisites: [
    {
      slug: 'lca-binary-lifting-euler-tour',
      title: 'Euler Tour Flattening & LCA (Binary Lifting / O(1))',
    },
  ],
  traceTitle: 'Interactive Subtree Sizing, Centroid Extraction & Centroid Tree Hierarchy Trace',
  traceSubtitle:
    'Step through decomposing a 7-node tree (`1-2-3-4-5`, `3-6`, `6-7`): subtree sizes `sz[]`, centroid pick, removal, and virtual `cParent[]` hierarchy—or edit edges live.',
  allowDynamicGraphEdit: true,
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Step 1: Compute Subtree Sizes on Full 7-Node Component (Limit N/2 = 3)',
      explanation:
        'Root arbitrarily at 1: sz[7]=1, sz[6]=2, sz[5]=1, sz[4]=2, sz[3]=5, sz[2]=6, sz[1]=7. Check node 1: child 2 has sz=6 > 3 (not centroid). Move down to heavy child 2: child 3 has sz=5 > 3. Move down to 3!',
      mode: 'graph',
      graph: {
        calloutMetric: 'N = 7, Half = 3 | Walk Down Heavy Child: 1 (sz=7) -> 2 (sz=6) -> 3 (sz=5)',
        nodes: [
          { id: '1', label: '1 (sz=7)', x: 60, y: 170, state: 'unmatched', matchWith: null },
          { id: '2', label: '2 (sz=6)', x: 150, y: 170, state: 'unmatched', matchWith: null },
          { id: '3', label: '3* CENTROID', x: 255, y: 170, state: 'active', matchWith: null },
          { id: '4', label: '4 (sz=2)', x: 365, y: 105, state: 'even', matchWith: null },
          { id: '5', label: '5 (sz=1)', x: 465, y: 105, state: 'even', matchWith: null },
          { id: '6', label: '6 (sz=2)', x: 365, y: 235, state: 'odd', matchWith: null },
          { id: '7', label: '7 (sz=1)', x: 465, y: 235, state: 'odd', matchWith: null },
        ],
        edges: [
          { id: 'e12', from: '1', to: '2', state: 'default' },
          { id: 'e23', from: '2', to: '3', state: 'default' },
          { id: 'e34', from: '3', to: '4', state: 'default' },
          { id: 'e45', from: '4', to: '5', state: 'default' },
          { id: 'e36', from: '3', to: '6', state: 'default' },
          { id: 'e67', from: '6', to: '7', state: 'default' },
        ],
      },
      variables: { TotalN: 7, Threshold: 3, RootCentroid: 3, BranchSizes: '{1-2: 2, 4-5: 2, 6-7: 2}' },
    },
    {
      stepNumber: 2,
      title: 'Step 2: Lock Centroid 3 (Root of Centroid Tree) & Mark removed[3] = true',
      explanation:
        'At node 3, branches {1,2}, {4,5}, {6,7} ALL have size 2 <= 3! Mark removed[3] = true, set cParent[3] = -1, and process all paths passing through 3 across its three detached subtrees.',
      mode: 'graph',
      graph: {
        calloutMetric: 'Root Centroid = 3 | Detached Provinces: {1,2}, {4,5}, {6,7} (each size 2)',
        nodes: [
          { id: '1', label: '1 [P1]', x: 60, y: 170, state: 'even', matchWith: null },
          { id: '2', label: '2 [P1]', x: 150, y: 170, state: 'even', matchWith: null },
          { id: '3', label: '3 [DONE]', x: 255, y: 170, state: 'matched', matchWith: null },
          { id: '4', label: '4 [P2]', x: 365, y: 105, state: 'odd', matchWith: null },
          { id: '5', label: '5 [P2]', x: 465, y: 105, state: 'odd', matchWith: null },
          { id: '6', label: '6 [P3]', x: 365, y: 235, state: 'blossom', matchWith: null },
          { id: '7', label: '7 [P3]', x: 465, y: 235, state: 'blossom', matchWith: null },
        ],
        edges: [
          { id: 'e12', from: '1', to: '2', state: 'matched' },
          { id: 'e23', from: '2', to: '3', state: 'contracted' },
          { id: 'e34', from: '3', to: '4', state: 'contracted' },
          { id: 'e45', from: '4', to: '5', state: 'matched' },
          { id: 'e36', from: '3', to: '6', state: 'contracted' },
          { id: 'e67', from: '6', to: '7', state: 'matched' },
        ],
      },
      variables: { 'cParent[3]': 'None (Root)', SubtreesRemaining: 3, MaxSubtreeSize: 2 },
    },
    {
      stepNumber: 3,
      title: 'Step 3: Recurse on Each Size-2 Province -> Extract Centroids 2, 4, and 6',
      explanation:
        'Each detached province has N = 2 (limit N/2 = 1): pick centroid 2 for {1,2} (cParent[2]=3), centroid 4 for {4,5} (cParent[4]=3), and centroid 6 for {6,7} (cParent[6]=3).',
      mode: 'graph',
      graph: {
        calloutMetric: 'Level 1 Centroids Attached to Root 3: {2, 4, 6} -> Leaves {1, 5, 7}',
        nodes: [
          { id: '1', label: '1 (leaf)', x: 60, y: 170, state: 'unmatched', matchWith: null },
          { id: '2', label: '2* (C)', x: 150, y: 170, state: 'active', matchWith: null },
          { id: '3', label: '3 [ROOT]', x: 255, y: 170, state: 'matched', matchWith: null },
          { id: '4', label: '4* (C)', x: 365, y: 105, state: 'active', matchWith: null },
          { id: '5', label: '5 (leaf)', x: 465, y: 105, state: 'unmatched', matchWith: null },
          { id: '6', label: '6* (C)', x: 365, y: 235, state: 'active', matchWith: null },
          { id: '7', label: '7 (leaf)', x: 465, y: 235, state: 'unmatched', matchWith: null },
        ],
        edges: [
          { id: 'e12', from: '1', to: '2', state: 'augmenting' },
          { id: 'e23', from: '2', to: '3', state: 'matched' },
          { id: 'e34', from: '3', to: '4', state: 'matched' },
          { id: 'e45', from: '4', to: '5', state: 'augmenting' },
          { id: 'e36', from: '3', to: '6', state: 'matched' },
          { id: 'e67', from: '6', to: '7', state: 'augmenting' },
        ],
      },
      variables: { 'cParent[2,4,6]': 3, 'cParent[1]': 2, 'cParent[5]': 4, 'cParent[7]': 6 },
    },
    {
      stepNumber: 4,
      title: 'Step 4: Completed Centroid Tree Height = 2 (Always <= log2 N)!',
      explanation:
        'Virtual Centroid Tree has root 3 -> {2 -> 1, 4 -> 5, 6 -> 7}. Any update(v) or query(u) walks at most 3 centroid ancestors up to root 3, precomputing dist(ancestor_c, u) at construction time for O(1) lookup!',
      mode: 'graph',
      graph: {
        calloutMetric: 'Centroid Tree Depth = 2 | Max Ancestors Per Node <= log2(7) = 3',
        nodes: [
          { id: '3', label: '3 (Depth 0)', x: 260, y: 55, state: 'matched', matchWith: null },
          { id: '2', label: '2 (Depth 1)', x: 115, y: 155, state: 'even', matchWith: null },
          { id: '4', label: '4 (Depth 1)', x: 260, y: 155, state: 'even', matchWith: null },
          { id: '6', label: '6 (Depth 1)', x: 405, y: 155, state: 'even', matchWith: null },
          { id: '1', label: '1 (Depth 2)', x: 115, y: 255, state: 'odd', matchWith: null },
          { id: '5', label: '5 (Depth 2)', x: 260, y: 255, state: 'odd', matchWith: null },
          { id: '7', label: '7 (Depth 2)', x: 405, y: 255, state: 'odd', matchWith: null },
        ],
        edges: [
          { id: 'c32', from: '3', to: '2', state: 'augmenting' },
          { id: 'c34', from: '3', to: '4', state: 'augmenting' },
          { id: 'c36', from: '3', to: '6', state: 'augmenting' },
          { id: 'c21', from: '2', to: '1', state: 'matched' },
          { id: 'c45', from: '4', to: '5', state: 'matched' },
          { id: 'c67', from: '6', to: '7', state: 'matched' },
        ],
      },
      variables: { Height: 2, BuildComplexity: 'O(N log N)', QueryAncestors: 'Depth <= 18 for N=2e5' },
    },
  ],
  reductionClues: [
    {
      clue: '"Count pairs (u, v) in a tree with dist(u, v) == K (or L <= dist(u, v) <= R)"',
      translation:
        'Static Centroid Decomposition: at centroid `c`, iterate child branches one by one—first query `cnt[K - depth]` against previously processed branches, then insert current branch depths into `cnt[]`, then reset ONLY touched depths!',
    },
    {
      clue: '"Toggle/paint nodes red AND repeatedly query dist(u, closest red node)"',
      translation:
        'Centroid Tree Ancestor Walk: store `best[c] = min_{red r in c-subtree} dist(c, r)`. On `paintRed(v)`, walk all `<= 18` centroid ancestors `c` of `v` updating `best[c] = min(best[c], dist(c, v))`; on `query(u)`, take `min_c (best[c] + dist(c, u))`!',
    },
    {
      clue: '"Toggle nodes active/inactive AND query sum_{active v} dist(u, v)"',
      translation:
        'Inclusion-Exclusion on Centroid Tree! Maintain at each centroid `c`: `sumDist[c]`, `cntActive[c]`, AND `childSubSum[c][branch]` + `childCnt[c][branch]`. When querying `u` at ancestor `c` coming from branch `b`, add `(sumDist[c] - childSubSum[c][b]) + (cntActive[c] - childCnt[c][b]) * dist(u, c)`!',
    },
    {
      clue: '"Need O(log N) per query without extra LCA overhead inside Centroid Ancestor loops"',
      translation:
        'Store a compact vector `ancestors[u] = {(centroid_c, dist(u, c), child_branch_id)}` during Centroid Decomposition itself—zero Binary Lifting or RMQ calls needed during updates/queries!',
    },
  ],
  timeComplexity: 'Centroid Tree Build: O(N log N) | Static K-Length Paths: O(N log N) | Dynamic Query: O(log N) to O(log^2 N)',
  spaceComplexity: 'O(N log N) (with ancestor distance cache) or O(N) (static)',
  pitfalls: [
    {
      type: 'TLE',
      title: 'Clearing the Entire cnt[0..N] Array at Every Centroid Level Causes O(N^2)',
      detail:
        'During static path-length counting, if `cnt` has size `N` and you do `fill(cnt.begin(), cnt.end(), 0)` inside every centroid `c`, total runtime becomes `O(N^2)` on stars or small subtrees! Keep track of `maxDepth` or a `touched` list and reset ONLY `cnt[0..maxDepth]` or popped elements in `O(subtree_size)`.',
    },
    {
      type: 'WA',
      title: 'Double-Counting Subtree Self-Contributions in Dynamic Sum-of-Distances Queries',
      detail:
        'If node `u` queries its centroid ancestor `c`, vertices inside the SAME branch `child_b` of `c` as `u` do NOT pass through `c` to reach `u`—their path stays inside `child_b` and gets handled deeper when walking down to `child_b`! Always subtract `subSumFromChild[c][child_b]` and `subCntFromChild[c][child_b]` (except at `c == u` where you take the full `sumDist[u]`).',
    },
    {
      type: 'WA',
      title: 'Forgetting removed[v] Check When Walking Neighbor Branches',
      detail:
        'Once a centroid `c` is extracted, mark `removed[c] = true` permanently and skip `removed[nxt]` in EVERY subsequent `calc_sz`, `find_centroid`, and `collect_dist` DFS—missing one `if (removed[v])` leaks into parent components and breaks the `O(N log N)` bound.',
    },
    {
      type: 'RE',
      title: 'Deep Caterpillar Recursion Overflowing Default Call Stack in Python / Java',
      detail:
        'Before Centroid Decomposition splits the tree, the very first `calc_sz` runs on the original unsplit tree, which can be a single path of depth `200,000`! Always call `sys.setrecursionlimit(200000)` in Python (or write iterative BFS/stack sizing) and avoid gigantic stack-frame locals.',
    },
  ],
  implementations: {
    cpp20: `#include <bits/stdc++.h>
using namespace std;

// Centroid Decomposition with Cached Ancestor Distances (O(N log N) build, O(log N) query)
// Supports dynamic closest-active-node distance queries on any tree
struct CentroidDecomp {
    int n;
    vector<vector<int>> adj;
    vector<int> sz, c_parent, best;
    vector<bool> removed;
    vector<vector<pair<int, int>>> ancestors; // (centroid, dist(u, centroid))

    explicit CentroidDecomp(int n)
        : n(n), adj(n), sz(n, 0), c_parent(n, -1), best(n, 1e9), removed(n, false), ancestors(n) {}

    void add_edge(int u, int v) {
        adj[u].push_back(v);
        adj[v].push_back(u);
    }

    int calc_sz(int u, int p) {
        sz[u] = 1;
        for (int v : adj[u]) {
            if (v != p && !removed[v]) sz[u] += calc_sz(v, u);
        }
        return sz[u];
    }

    int find_centroid(int u, int p, int total) {
        for (int v : adj[u]) {
            if (v != p && !removed[v] && sz[v] * 2 > total) {
                return find_centroid(v, u, total);
            }
        }
        return u;
    }

    void record_dists(int u, int p, int c, int d) {
        ancestors[u].push_back({c, d});
        for (int v : adj[u]) {
            if (v != p && !removed[v]) record_dists(v, u, c, d + 1);
        }
    }

    void build(int entry, int p_centroid) {
        int total = calc_sz(entry, -1);
        int c = find_centroid(entry, -1, total);
        c_parent[c] = p_centroid;
        record_dists(c, -1, c, 0);
        removed[c] = true;
        for (int v : adj[c]) {
            if (!removed[v]) build(v, c);
        }
    }

    void activate(int u) {
        for (auto [c, d] : ancestors[u]) {
            best[c] = min(best[c], d);
        }
    }

    int query_closest(int u) {
        int ans = 1e9;
        for (auto [c, d] : ancestors[u]) {
            ans = min(ans, best[c] + d);
        }
        return ans;
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, q;
    if (!(cin >> n >> q)) return 0;
    CentroidDecomp cd(n + 1);
    for (int i = 0; i < n - 1; i++) {
        int u, v;
        cin >> u >> v;
        cd.add_edge(u, v);
    }
    cd.build(1, -1);
    cd.activate(1); // Node 1 starts active

    while (q--) {
        int tp, v;
        cin >> tp >> v;
        if (tp == 1) cd.activate(v);
        else cout << cd.query_closest(v) << "\\n";
    }
    return 0;
}`,
    rust: `use std::io::{self, Read};

struct CentroidDecomp {
    adj: Vec<Vec<usize>>,
    sz: Vec<usize>,
    removed: Vec<bool>,
    best: Vec<i32>,
    ancestors: Vec<Vec<(usize, i32)>>,
}

impl CentroidDecomp {
    fn new(n: usize) -> Self {
        Self {
            adj: vec![Vec::new(); n],
            sz: vec![0; n],
            removed: vec![false; n],
            best: vec![1_000_000_000; n],
            ancestors: vec![Vec::new(); n],
        }
    }

    fn add_edge(&mut self, u: usize, v: usize) {
        self.adj[u].push(v);
        self.adj[v].push(u);
    }

    fn calc_sz(&mut self, u: usize, p: usize) -> usize {
        self.sz[u] = 1;
        let len = self.adj[u].len();
        for i in 0..len {
            let v = self.adj[u][i];
            if v != p && !self.removed[v] {
                self.sz[u] += self.calc_sz(v, u);
            }
        }
        self.sz[u]
    }

    fn find_centroid(&self, u: usize, p: usize, total: usize) -> usize {
        for &v in &self.adj[u] {
            if v != p && !self.removed[v] && self.sz[v] * 2 > total {
                return self.find_centroid(v, u, total);
            }
        }
        u
    }

    fn record_dists(&mut self, u: usize, p: usize, c: usize, d: i32) {
        self.ancestors[u].push((c, d));
        let len = self.adj[u].len();
        for i in 0..len {
            let v = self.adj[u][i];
            if v != p && !self.removed[v] {
                self.record_dists(v, u, c, d + 1);
            }
        }
    }

    fn build(&mut self, entry: usize) {
        let total = self.calc_sz(entry, 0);
        let c = self.find_centroid(entry, 0, total);
        self.record_dists(c, 0, c, 0);
        self.removed[c] = true;
        let len = self.adj[c].len();
        for i in 0..len {
            let v = self.adj[c][i];
            if !self.removed[v] {
                self.build(v);
            }
        }
    }

    fn activate(&mut self, u: usize) {
        for &(c, d) in &self.ancestors[u] {
            self.best[c] = self.best[c].min(d);
        }
    }

    fn query(&self, u: usize) -> i32 {
        let mut ans = 1_000_000_000;
        for &(c, d) in &self.ancestors[u] {
            ans = ans.min(self.best[c] + d);
        }
        ans
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
    let q: usize = it.next().unwrap().parse().unwrap();
    let mut cd = CentroidDecomp::new(n + 1);
    for _ in 0..n - 1 {
        let u: usize = it.next().unwrap().parse().unwrap();
        let v: usize = it.next().unwrap().parse().unwrap();
        cd.add_edge(u, v);
    }
    cd.build(1);
    cd.activate(1);
    let mut out = String::new();
    for _ in 0..q {
        let tp: usize = it.next().unwrap().parse().unwrap();
        let v: usize = it.next().unwrap().parse().unwrap();
        if tp == 1 {
            cd.activate(v);
        } else {
            out.push_str(&format!("{}\\n", cd.query(v)));
        }
    }
    print!("{}", out);
}`,
    java21: `import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Arrays;
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

    static List<Integer>[] adj;
    static int[] sz, best;
    static boolean[] removed;
    static List<int[]>[] ancestors;

    static int calcSz(int u, int p) {
        sz[u] = 1;
        for (int v : adj[u]) {
            if (v != p && !removed[v]) sz[u] += calcSz(v, u);
        }
        return sz[u];
    }

    static int findCentroid(int u, int p, int total) {
        for (int v : adj[u]) {
            if (v != p && !removed[v] && sz[v] * 2 > total) {
                return findCentroid(v, u, total);
            }
        }
        return u;
    }

    static void recordDists(int u, int p, int c, int d) {
        ancestors[u].add(new int[]{c, d});
        for (int v : adj[u]) {
            if (v != p && !removed[v]) recordDists(v, u, c, d + 1);
        }
    }

    static void build(int entry) {
        int total = calcSz(entry, -1);
        int c = findCentroid(entry, -1, total);
        recordDists(c, -1, c, 0);
        removed[c] = true;
        for (int v : adj[c]) {
            if (!removed[v]) build(v);
        }
    }

    @SuppressWarnings("unchecked")
    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        int n = fs.nextInt();
        if (n == Integer.MIN_VALUE) return;
        int q = fs.nextInt();

        adj = new List[n + 1];
        ancestors = new List[n + 1];
        for (int i = 0; i <= n; i++) {
            adj[i] = new ArrayList<>();
            ancestors[i] = new ArrayList<>();
        }
        sz = new int[n + 1];
        best = new int[n + 1];
        Arrays.fill(best, 1_000_000_000);
        removed = new boolean[n + 1];

        for (int i = 0; i < n - 1; i++) {
            int u = fs.nextInt(), v = fs.nextInt();
            adj[u].add(v);
            adj[v].add(u);
        }
        build(1);
        for (int[] a : ancestors[1]) best[a[0]] = Math.min(best[a[0]], a[1]);

        StringBuilder sb = new StringBuilder();
        while (q-- > 0) {
            int tp = fs.nextInt(), v = fs.nextInt();
            if (tp == 1) {
                for (int[] a : ancestors[v]) best[a[0]] = Math.min(best[a[0]], a[1]);
            } else {
                int ans = 1_000_000_000;
                for (int[] a : ancestors[v]) ans = Math.min(ans, best[a[0]] + a[1]);
                sb.append(ans).append('\\n');
            }
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
    q = int(next(it))
    adj = [[] for _ in range(n + 1)]
    for _ in range(n - 1):
        u = int(next(it))
        v = int(next(it))
        adj[u].append(v)
        adj[v].append(u)

    sz = [0] * (n + 1)
    removed = [False] * (n + 1)
    best = [10**9] * (n + 1)
    ancestors = [[] for _ in range(n + 1)]

    def calc_sz(u: int, p: int) -> int:
        s = 1
        for v in adj[u]:
            if v != p and not removed[v]:
                s += calc_sz(v, u)
        sz[u] = s
        return s

    def find_centroid(u: int, p: int, total: int) -> int:
        for v in adj[u]:
            if v != p and not removed[v] and sz[v] * 2 > total:
                return find_centroid(v, u, total)
        return u

    def record_dists(u: int, p: int, c: int, d: int) -> None:
        ancestors[u].append((c, d))
        for v in adj[u]:
            if v != p and not removed[v]:
                record_dists(v, u, c, d + 1)

    def build(entry: int) -> None:
        total = calc_sz(entry, 0)
        c = find_centroid(entry, 0, total)
        record_dists(c, 0, c, 0)
        removed[c] = True
        for v in adj[c]:
            if not removed[v]:
                build(v)

    build(1)
    for c, d in ancestors[1]:
        if d < best[c]:
            best[c] = d

    out = []
    for _ in range(q):
        tp = int(next(it))
        v = int(next(it))
        if tp == 1:
            for c, d in ancestors[v]:
                if d < best[c]:
                    best[c] = d
        else:
            ans = 10**9
            for c, d in ancestors[v]:
                cand = best[c] + d
                if cand < ans:
                    ans = cand
            out.append(str(ans))
    sys.stdout.write("\\n".join(out) + "\\n")

if __name__ == "__main__":
    solve()`,
    ruby: `tokens = $stdin.read.split
exit if tokens.empty?
n = tokens[0].to_i
q = tokens[1].to_i
adj = Array.new(n + 1) { [] }
idx = 2
(n - 1).times do
  u = tokens[idx].to_i
  v = tokens[idx + 1].to_i
  idx += 2
  adj[u] << v
  adj[v] << u
end

sz = Array.new(n + 1, 0)
removed = Array.new(n + 1, false)
best = Array.new(n + 1, 1_000_000_000)
ancestors = Array.new(n + 1) { [] }

calc_sz = nil
calc_sz = lambda do |u, p|
  s = 1
  adj[u].each do |v|
    s += calc_sz.call(v, u) if v != p && !removed[v]
  end
  sz[u] = s
end

find_centroid = nil
find_centroid = lambda do |u, p, total|
  adj[u].each do |v|
    return find_centroid.call(v, u, total) if v != p && !removed[v] && sz[v] * 2 > total
  end
  u
end

record_dists = nil
record_dists = lambda do |u, p, c, d|
  ancestors[u] << [c, d]
  adj[u].each do |v|
    record_dists.call(v, u, c, d + 1) if v != p && !removed[v]
  end
end

build = nil
build = lambda do |entry|
  total = calc_sz.call(entry, 0)
  c = find_centroid.call(entry, 0, total)
  record_dists.call(c, 0, c, 0)
  removed[c] = true
  adj[c].each { |v| build.call(v) unless removed[v] }
end

build.call(1)
ancestors[1].each { |c, d| best[c] = d if d < best[c] }

out = []
q.times do
  tp = tokens[idx].to_i
  v = tokens[idx + 1].to_i
  idx += 2
  if tp == 1
    ancestors[v].each { |c, d| best[c] = d if d < best[c] }
  else
    ans = 1_000_000_000
    ancestors[v].each do |c, d|
      cand = best[c] + d
      ans = cand if cand < ans
    end
    out << ans
  end
end
puts out.join("\\n")`,
  },
  practiceProblems: [
    {
      id: 'ch27-p1',
      tier: 'Warmup',
      ratingRange: '2050–2250',
      title: 'Fixed-Length Paths I (Count Paths of Exact Length K in a Tree)',
      statement:
        'Given a tree with N vertices (1..N) and an integer K, count the number of unordered paths {u, v} consisting of EXACTLY K edges.',
      constraints: '1 <= K <= N <= 2 * 10^5',
      sampleInput: '5 2\n1 2\n2 3\n3 4\n3 5',
      sampleOutput: '4',
      hints: [
        'At centroid `c`, set `cnt[0] = 1`. Process each non-removed child `v` in two passes: first collect all depths `d <= K` in `v`’s subtree and add `cnt[K - d]` to the answer; second add those depths into `cnt[d]`.',
        'Crucial performance check: track `maxD` seen in `c`’s component and zero out ONLY `cnt[0..maxD]` before moving to the next centroid—this guarantees strict `O(N log N)` total time!',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, K;
    if (!(cin >> n >> K)) return 0;
    vector<vector<int>> adj(n + 1);
    for (int i = 0; i < n - 1; i++) {
        int u, v;
        cin >> u >> v;
        adj[u].push_back(v);
        adj[v].push_back(u);
    }

    vector<int> sz(n + 1, 0), cnt(K + 1, 0);
    vector<bool> removed(n + 1, false);
    cnt[0] = 1;
    long long ans = 0;

    auto calc_sz = [&](auto& self, int u, int p) -> int {
        sz[u] = 1;
        for (int v : adj[u]) {
            if (v != p && !removed[v]) sz[u] += self(self, v, u);
        }
        return sz[u];
    };

    auto find_centroid = [&](auto& self, int u, int p, int total) -> int {
        for (int v : adj[u]) {
            if (v != p && !removed[v] && sz[v] * 2 > total) {
                return self(self, v, u, total);
            }
        }
        return u;
    };

    int maxDepthSeen = 0;
    auto dfs_paths = [&](auto& self, int u, int p, int d, bool fillMode) -> void {
        if (d > K) return;
        maxDepthSeen = max(maxDepthSeen, d);
        if (fillMode) cnt[d]++;
        else ans += cnt[K - d];
        for (int v : adj[u]) {
            if (v != p && !removed[v]) self(self, v, u, d + 1, fillMode);
        }
    };

    auto decompose = [&](auto& self, int entry) -> void {
        int total = calc_sz(calc_sz, entry, -1);
        int c = find_centroid(find_centroid, entry, -1, total);
        removed[c] = true;
        maxDepthSeen = 0;

        for (int v : adj[c]) {
            if (!removed[v]) {
                dfs_paths(dfs_paths, v, c, 1, false);
                dfs_paths(dfs_paths, v, c, 1, true);
            }
        }
        fill(cnt.begin() + 1, cnt.begin() + maxDepthSeen + 1, 0);

        for (int v : adj[c]) {
            if (!removed[v]) self(self, v);
        }
    };

    decompose(decompose, 1);
    cout << ans << "\\n";
    return 0;
}`,
        rust: `use std::io::{self, Read};

struct Solver {
    k: usize,
    adj: Vec<Vec<usize>>,
    sz: Vec<usize>,
    removed: Vec<bool>,
    cnt: Vec<u64>,
    ans: u64,
    max_d: usize,
}

impl Solver {
    fn calc_sz(&mut self, u: usize, p: usize) -> usize {
        self.sz[u] = 1;
        let len = self.adj[u].len();
        for i in 0..len {
            let v = self.adj[u][i];
            if v != p && !self.removed[v] {
                self.sz[u] += self.calc_sz(v, u);
            }
        }
        self.sz[u]
    }

    fn find_centroid(&self, u: usize, p: usize, total: usize) -> usize {
        for &v in &self.adj[u] {
            if v != p && !self.removed[v] && self.sz[v] * 2 > total {
                return self.find_centroid(v, u, total);
            }
        }
        u
    }

    fn dfs_paths(&mut self, u: usize, p: usize, d: usize, fill: bool) {
        if d > self.k {
            return;
        }
        if d > self.max_d {
            self.max_d = d;
        }
        if fill {
            self.cnt[d] += 1;
        } else {
            self.ans += self.cnt[self.k - d];
        }
        let len = self.adj[u].len();
        for i in 0..len {
            let v = self.adj[u][i];
            if v != p && !self.removed[v] {
                self.dfs_paths(v, u, d + 1, fill);
            }
        }
    }

    fn decompose(&mut self, entry: usize) {
        let total = self.calc_sz(entry, 0);
        let c = self.find_centroid(entry, 0, total);
        self.removed[c] = true;
        self.max_d = 0;

        let len = self.adj[c].len();
        for i in 0..len {
            let v = self.adj[c][i];
            if !self.removed[v] {
                self.dfs_paths(v, c, 1, false);
                self.dfs_paths(v, c, 1, true);
            }
        }
        for d in 1..=self.max_d {
            self.cnt[d] = 0;
        }
        for i in 0..len {
            let v = self.adj[c][i];
            if !self.removed[v] {
                self.decompose(v);
            }
        }
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
    let k: usize = it.next().unwrap().parse().unwrap();
    let mut adj = vec![Vec::new(); n + 1];
    for _ in 0..n - 1 {
        let u: usize = it.next().unwrap().parse().unwrap();
        let v: usize = it.next().unwrap().parse().unwrap();
        adj[u].push(v);
        adj[v].push(u);
    }
    let mut cnt = vec![0u64; k + 1];
    cnt[0] = 1;
    let mut solver = Solver {
        k,
        adj,
        sz: vec![0; n + 1],
        removed: vec![false; n + 1],
        cnt,
        ans: 0,
        max_d: 0,
    };
    solver.decompose(1);
    println!("{}", solver.ans);
}`,
        java21: `import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

public class Main {
    static final class FastScanner {
        private final InputStream in;
        private final byte[] buf = new byte[1 << 16];
        private int p = 0, l = 0;
        FastScanner(InputStream in) { this.in = in; }
        private int rb() throws IOException {
            if (p >= l) { p = 0; l = in.read(buf); if (l <= 0) return -1; }
            return buf[p++];
        }
        int nextInt() throws IOException {
            int c = rb();
            while (c >= 0 && c <= ' ') c = rb();
            if (c == -1) return Integer.MIN_VALUE;
            int v = 0;
            while (c > ' ') { v = v * 10 + (c - '0'); c = rb(); }
            return v;
        }
    }

    static List<Integer>[] adj;
    static int[] sz;
    static long[] cnt;
    static boolean[] removed;
    static int K, maxD;
    static long ans = 0;

    static int calcSz(int u, int p) {
        sz[u] = 1;
        for (int v : adj[u]) if (v != p && !removed[v]) sz[u] += calcSz(v, u);
        return sz[u];
    }

    static int findCentroid(int u, int p, int total) {
        for (int v : adj[u]) if (v != p && !removed[v] && sz[v] * 2 > total) return findCentroid(v, u, total);
        return u;
    }

    static void dfsPaths(int u, int p, int d, boolean fill) {
        if (d > K) return;
        if (d > maxD) maxD = d;
        if (fill) cnt[d]++;
        else ans += cnt[K - d];
        for (int v : adj[u]) if (v != p && !removed[v]) dfsPaths(v, u, d + 1, fill);
    }

    static void decompose(int entry) {
        int total = calcSz(entry, -1);
        int c = findCentroid(entry, -1, total);
        removed[c] = true;
        maxD = 0;
        for (int v : adj[c]) {
            if (!removed[v]) {
                dfsPaths(v, c, 1, false);
                dfsPaths(v, c, 1, true);
            }
        }
        for (int d = 1; d <= maxD; d++) cnt[d] = 0;
        for (int v : adj[c]) if (!removed[v]) decompose(v);
    }

    @SuppressWarnings("unchecked")
    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        int n = fs.nextInt();
        if (n == Integer.MIN_VALUE) return;
        K = fs.nextInt();
        adj = new List[n + 1];
        for (int i = 0; i <= n; i++) adj[i] = new ArrayList<>();
        for (int i = 0; i < n - 1; i++) {
            int u = fs.nextInt(), v = fs.nextInt();
            adj[u].add(v);
            adj[v].add(u);
        }
        sz = new int[n + 1];
        removed = new boolean[n + 1];
        cnt = new long[K + 1];
        cnt[0] = 1;
        decompose(1);
        System.out.println(ans);
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
    K = int(next(it))
    adj = [[] for _ in range(n + 1)]
    for _ in range(n - 1):
        u = int(next(it))
        v = int(next(it))
        adj[u].append(v)
        adj[v].append(u)

    sz = [0] * (n + 1)
    removed = [False] * (n + 1)
    cnt = [0] * (K + 1)
    cnt[0] = 1
    ans = 0
    max_d = 0

    def calc_sz(u: int, p: int) -> int:
        s = 1
        for v in adj[u]:
            if v != p and not removed[v]:
                s += calc_sz(v, u)
        sz[u] = s
        return s

    def find_centroid(u: int, p: int, total: int) -> int:
        for v in adj[u]:
            if v != p and not removed[v] and sz[v] * 2 > total:
                return find_centroid(v, u, total)
        return u

    def dfs_paths(u: int, p: int, d: int, fill_mode: bool) -> None:
        nonlocal ans, max_d
        if d > K:
            return
        if d > max_d:
            max_d = d
        if fill_mode:
            cnt[d] += 1
        else:
            ans += cnt[K - d]
        for v in adj[u]:
            if v != p and not removed[v]:
                dfs_paths(v, u, d + 1, fill_mode)

    def decompose(entry: int) -> None:
        nonlocal max_d
        total = calc_sz(entry, 0)
        c = find_centroid(entry, 0, total)
        removed[c] = True
        max_d = 0
        for v in adj[c]:
            if not removed[v]:
                dfs_paths(v, c, 1, False)
                dfs_paths(v, c, 1, True)
        for d in range(1, max_d + 1):
            cnt[d] = 0
        for v in adj[c]:
            if not removed[v]:
                decompose(v)

    decompose(1)
    print(ans)

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
n = tokens[0].to_i
k_target = tokens[1].to_i
adj = Array.new(n + 1) { [] }
idx = 2
(n - 1).times do
  u = tokens[idx].to_i
  v = tokens[idx + 1].to_i
  idx += 2
  adj[u] << v
  adj[v] << u
end

sz = Array.new(n + 1, 0)
removed = Array.new(n + 1, false)
cnt = Array.new(k_target + 1, 0)
cnt[0] = 1
ans = 0
max_d = 0

calc_sz = nil
calc_sz = lambda do |u, p|
  s = 1
  adj[u].each { |v| s += calc_sz.call(v, u) if v != p && !removed[v] }
  sz[u] = s
end

find_centroid = nil
find_centroid = lambda do |u, p, total|
  adj[u].each { |v| return find_centroid.call(v, u, total) if v != p && !removed[v] && sz[v] * 2 > total }
  u
end

dfs_paths = nil
dfs_paths = lambda do |u, p, d, fill_mode|
  return if d > k_target
  max_d = d if d > max_d
  if fill_mode
    cnt[d] += 1
  else
    ans += cnt[k_target - d]
  end
  adj[u].each { |v| dfs_paths.call(v, u, d + 1, fill_mode) if v != p && !removed[v] }
end

decompose = nil
decompose = lambda do |entry|
  total = calc_sz.call(entry, 0)
  c = find_centroid.call(entry, 0, total)
  removed[c] = true
  max_d = 0
  adj[c].each do |v|
    unless removed[v]
      dfs_paths.call(v, c, 1, false)
      dfs_paths.call(v, c, 1, true)
    end
  end
  (1..max_d).each { |d| cnt[d] = 0 }
  adj[c].each { |v| decompose.call(v) unless removed[v] }
end

decompose.call(1)
puts ans`,
      },
    },
    {
      id: 'ch27-p2',
      tier: 'Standard',
      ratingRange: '2150–2350',
      title: 'Dynamic Tree Point Updates & Sum-of-Distances Queries (Inclusion-Exclusion)',
      statement:
        'A weighted tree has N vertices (1..N), initially all inactive (value = 0). Process Q queries online: `1 v` toggles vertex v active/inactive (`0 <-> 1`), and `2 u` outputs the sum of edge distances from `u` to ALL currently active vertices.',
      constraints: '1 <= N, Q <= 10^5, 1 <= w <= 10^6',
      sampleInput: '4 4\n1 2 5\n2 3 3\n2 4 4\n1 1\n1 4\n2 3\n2 2',
      sampleOutput: '15\n9',
      hints: [
        'During Centroid Decomposition, for each ancestor centroid `c` of `u`, store `(centroid c, dist(u, c), branchIndex)` where `branchIndex` identifies which child subtree of `c` contains `u` (`-1` if `c == u`).',
        'At each centroid `c`, maintain `totalDistSum[c]`, `totalActiveCnt[c]`, and per-child `branchDistSum[c][b]` & `branchActiveCnt[c][b]`. Toggling `v` updates its `<= 18` ancestors in `O(log N)`; querying `u` sums `(totalDistSum[c] - branchDistSum[c][b]) + (totalActiveCnt[c] - branchActiveCnt[c][b]) * dist(u, c)`!',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

struct AncInfo {
    int c;
    int branch; // -1 if u == c
    long long dist;
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, q;
    if (!(cin >> n >> q)) return 0;
    vector<vector<pair<int, long long>>> adj(n + 1);
    for (int i = 0; i < n - 1; i++) {
        int u, v;
        long long w;
        cin >> u >> v >> w;
        adj[u].push_back({v, w});
        adj[v].push_back({u, w});
    }

    vector<int> sz(n + 1, 0);
    vector<bool> removed(n + 1, false);
    vector<vector<AncInfo>> anc(n + 1);
    vector<long long> sumDist(n + 1, 0), cntAct(n + 1, 0);
    vector<vector<long long>> subSum(n + 1), subCnt(n + 1);

    auto calc_sz = [&](auto& self, int u, int p) -> int {
        sz[u] = 1;
        for (auto [v, w] : adj[u]) {
            if (v != p && !removed[v]) sz[u] += self(self, v, u);
        }
        return sz[u];
    };

    auto find_centroid = [&](auto& self, int u, int p, int total) -> int {
        for (auto [v, w] : adj[u]) {
            if (v != p && !removed[v] && sz[v] * 2 > total) {
                return self(self, v, u, total);
            }
        }
        return u;
    };

    auto record = [&](auto& self, int u, int p, int c, int b, long long d) -> void {
        anc[u].push_back({c, b, d});
        for (auto [v, w] : adj[u]) {
            if (v != p && !removed[v]) self(self, v, u, c, b, d + w);
        }
    };

    auto build = [&](auto& self, int entry) -> void {
        int total = calc_sz(calc_sz, entry, -1);
        int c = find_centroid(find_centroid, entry, -1, total);
        anc[c].push_back({c, -1, 0});
        int bIdx = 0;
        for (auto [v, w] : adj[c]) {
            if (!removed[v]) {
                record(record, v, c, c, bIdx, w);
                bIdx++;
            }
        }
        subSum[c].assign(bIdx, 0);
        subCnt[c].assign(bIdx, 0);
        removed[c] = true;
        for (auto [v, w] : adj[c]) {
            if (!removed[v]) self(self, v);
        }
    };

    build(build, 1);
    vector<int> active(n + 1, 0);

    while (q--) {
        int tp, u;
        cin >> tp >> u;
        if (tp == 1) {
            int delta = active[u] ? -1 : 1;
            active[u] ^= 1;
            for (const auto& info : anc[u]) {
                sumDist[info.c] += delta * info.dist;
                cntAct[info.c] += delta;
                if (info.branch != -1) {
                    subSum[info.c][info.branch] += delta * info.dist;
                    subCnt[info.c][info.branch] += delta;
                }
            }
        } else {
            long long ans = 0;
            for (const auto& info : anc[u]) {
                long long s = sumDist[info.c];
                long long k = cntAct[info.c];
                if (info.branch != -1) {
                    s -= subSum[info.c][info.branch];
                    k -= subCnt[info.c][info.branch];
                }
                ans += s + k * info.dist;
            }
            cout << ans << "\\n";
        }
    }
    return 0;
}`,
        rust: `use std::io::{self, Read};

#[derive(Clone, Copy)]
struct AncInfo {
    c: usize,
    branch: i32,
    dist: i64,
}

struct CentroidSum {
    adj: Vec<Vec<(usize, i64)>>,
    sz: Vec<usize>,
    removed: Vec<bool>,
    anc: Vec<Vec<AncInfo>>,
    sum_dist: Vec<i64>,
    cnt_act: Vec<i64>,
    sub_sum: Vec<Vec<i64>>,
    sub_cnt: Vec<Vec<i64>>,
}

impl CentroidSum {
    fn new(n: usize) -> Self {
        Self {
            adj: vec![Vec::new(); n],
            sz: vec![0; n],
            removed: vec![false; n],
            anc: vec![Vec::new(); n],
            sum_dist: vec![0; n],
            cnt_act: vec![0; n],
            sub_sum: vec![Vec::new(); n],
            sub_cnt: vec![Vec::new(); n],
        }
    }

    fn calc_sz(&mut self, u: usize, p: usize) -> usize {
        self.sz[u] = 1;
        let len = self.adj[u].len();
        for i in 0..len {
            let v = self.adj[u][i].0;
            if v != p && !self.removed[v] {
                self.sz[u] += self.calc_sz(v, u);
            }
        }
        self.sz[u]
    }

    fn find_centroid(&self, u: usize, p: usize, total: usize) -> usize {
        for &(v, _) in &self.adj[u] {
            if v != p && !self.removed[v] && self.sz[v] * 2 > total {
                return self.find_centroid(v, u, total);
            }
        }
        u
    }

    fn record(&mut self, u: usize, p: usize, c: usize, branch: i32, d: i64) {
        self.anc[u].push(AncInfo { c, branch, dist: d });
        let len = self.adj[u].len();
        for i in 0..len {
            let (v, w) = self.adj[u][i];
            if v != p && !self.removed[v] {
                self.record(v, u, c, branch, d + w);
            }
        }
    }

    fn build(&mut self, entry: usize) {
        let total = self.calc_sz(entry, 0);
        let c = self.find_centroid(entry, 0, total);
        self.anc[c].push(AncInfo { c, branch: -1, dist: 0 });
        let mut b_idx = 0i32;
        let len = self.adj[c].len();
        for i in 0..len {
            let (v, w) = self.adj[c][i];
            if !self.removed[v] {
                self.record(v, c, c, b_idx, w);
                b_idx += 1;
            }
        }
        self.sub_sum[c] = vec![0; b_idx as usize];
        self.sub_cnt[c] = vec![0; b_idx as usize];
        self.removed[c] = true;
        for i in 0..len {
            let v = self.adj[c][i].0;
            if !self.removed[v] {
                self.build(v);
            }
        }
    }
}

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let n: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };
    let q: usize = it.next().unwrap().parse().unwrap();
    let mut cs = CentroidSum::new(n + 1);
    for _ in 0..n - 1 {
        let u: usize = it.next().unwrap().parse().unwrap();
        let v: usize = it.next().unwrap().parse().unwrap();
        let w: i64 = it.next().unwrap().parse().unwrap();
        cs.adj[u].push((v, w));
        cs.adj[v].push((u, w));
    }
    cs.build(1);
    let mut active = vec![false; n + 1];
    let mut out = String::new();

    for _ in 0..q {
        let tp: usize = it.next().unwrap().parse().unwrap();
        let u: usize = it.next().unwrap().parse().unwrap();
        if tp == 1 {
            let delta = if active[u] { -1i64 } else { 1i64 };
            active[u] = !active[u];
            for info in &cs.anc[u] {
                cs.sum_dist[info.c] += delta * info.dist;
                cs.cnt_act[info.c] += delta;
                if info.branch >= 0 {
                    let b = info.branch as usize;
                    cs.sub_sum[info.c][b] += delta * info.dist;
                    cs.sub_cnt[info.c][b] += delta;
                }
            }
        } else {
            let mut ans = 0i64;
            for info in &cs.anc[u] {
                let mut sd = cs.sum_dist[info.c];
                let mut k = cs.cnt_act[info.c];
                if info.branch >= 0 {
                    let b = info.branch as usize;
                    sd -= cs.sub_sum[info.c][b];
                    k -= cs.sub_cnt[info.c][b];
                }
                ans += sd + k * info.dist;
            }
            out.push_str(&format!("{}\\n", ans));
        }
    }
    print!("{}", out);
}`,
        java21: `import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

public class Main {
    static final class FastScanner {
        private final InputStream in;
        private final byte[] buf = new byte[1 << 16];
        private int p = 0, l = 0;
        FastScanner(InputStream in) { this.in = in; }
        private int rb() throws IOException {
            if (p >= l) { p = 0; l = in.read(buf); if (l <= 0) return -1; }
            return buf[p++];
        }
        long nextLong() throws IOException {
            int c = rb();
            while (c >= 0 && c <= ' ') c = rb();
            if (c == -1) return Long.MIN_VALUE;
            long v = 0;
            while (c > ' ') { v = v * 10 + (c - '0'); c = rb(); }
            return v;
        }
        int nextInt() throws IOException { return (int) nextLong(); }
    }

    static List<long[]>[] adj;
    static List<long[]>[] anc;
    static int[] sz;
    static boolean[] removed;
    static long[] sumDist, cntAct;
    static long[][] subSum, subCnt;

    static int calcSz(int u, int p) {
        sz[u] = 1;
        for (long[] e : adj[u]) {
            int v = (int) e[0];
            if (v != p && !removed[v]) sz[u] += calcSz(v, u);
        }
        return sz[u];
    }

    static int findCentroid(int u, int p, int total) {
        for (long[] e : adj[u]) {
            int v = (int) e[0];
            if (v != p && !removed[v] && sz[v] * 2 > total) return findCentroid(v, u, total);
        }
        return u;
    }

    static void record(int u, int p, int c, int branch, long d) {
        anc[u].add(new long[]{c, branch, d});
        for (long[] e : adj[u]) {
            int v = (int) e[0];
            if (v != p && !removed[v]) record(v, u, c, branch, d + e[1]);
        }
    }

    static void build(int entry) {
        int total = calcSz(entry, -1);
        int c = findCentroid(entry, -1, total);
        anc[c].add(new long[]{c, -1, 0});
        int bIdx = 0;
        for (long[] e : adj[c]) {
            int v = (int) e[0];
            if (!removed[v]) {
                record(v, c, c, bIdx, e[1]);
                bIdx++;
            }
        }
        subSum[c] = new long[bIdx];
        subCnt[c] = new long[bIdx];
        removed[c] = true;
        for (long[] e : adj[c]) {
            int v = (int) e[0];
            if (!removed[v]) build(v);
        }
    }

    @SuppressWarnings("unchecked")
    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        int n = fs.nextInt();
        if (n == Integer.MIN_VALUE) return;
        int q = fs.nextInt();

        adj = new List[n + 1];
        anc = new List[n + 1];
        for (int i = 0; i <= n; i++) {
            adj[i] = new ArrayList<>();
            anc[i] = new ArrayList<>();
        }
        for (int i = 0; i < n - 1; i++) {
            int u = fs.nextInt(), v = fs.nextInt();
            long w = fs.nextLong();
            adj[u].add(new long[]{v, w});
            adj[v].add(new long[]{u, w});
        }

        sz = new int[n + 1];
        removed = new boolean[n + 1];
        sumDist = new long[n + 1];
        cntAct = new long[n + 1];
        subSum = new long[n + 1][];
        subCnt = new long[n + 1][];
        build(1);

        boolean[] active = new boolean[n + 1];
        StringBuilder sb = new StringBuilder();
        while (q-- > 0) {
            int tp = fs.nextInt(), u = fs.nextInt();
            if (tp == 1) {
                long delta = active[u] ? -1 : 1;
                active[u] = !active[u];
                for (long[] info : anc[u]) {
                    int c = (int) info[0], b = (int) info[1];
                    long d = info[2];
                    sumDist[c] += delta * d;
                    cntAct[c] += delta;
                    if (b >= 0) {
                        subSum[c][b] += delta * d;
                        subCnt[c][b] += delta;
                    }
                }
            } else {
                long ans = 0;
                for (long[] info : anc[u]) {
                    int c = (int) info[0], b = (int) info[1];
                    long d = info[2];
                    long s = sumDist[c], k = cntAct[c];
                    if (b >= 0) {
                        s -= subSum[c][b];
                        k -= subCnt[c][b];
                    }
                    ans += s + k * d;
                }
                sb.append(ans).append('\\n');
            }
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
    q = int(next(it))
    adj = [[] for _ in range(n + 1)]
    for _ in range(n - 1):
        u = int(next(it))
        v = int(next(it))
        w = int(next(it))
        adj[u].append((v, w))
        adj[v].append((u, w))

    sz = [0] * (n + 1)
    removed = [False] * (n + 1)
    anc = [[] for _ in range(n + 1)]
    sum_dist = [0] * (n + 1)
    cnt_act = [0] * (n + 1)
    sub_sum = [[] for _ in range(n + 1)]
    sub_cnt = [[] for _ in range(n + 1)]

    def calc_sz(u: int, p: int) -> int:
        s = 1
        for v, _ in adj[u]:
            if v != p and not removed[v]:
                s += calc_sz(v, u)
        sz[u] = s
        return s

    def find_centroid(u: int, p: int, total: int) -> int:
        for v, _ in adj[u]:
            if v != p and not removed[v] and sz[v] * 2 > total:
                return find_centroid(v, u, total)
        return u

    def record(u: int, p: int, c: int, b: int, d: int) -> None:
        anc[u].append((c, b, d))
        for v, w in adj[u]:
            if v != p and not removed[v]:
                record(v, u, c, b, d + w)

    def build(entry: int) -> None:
        total = calc_sz(entry, 0)
        c = find_centroid(entry, 0, total)
        anc[c].append((c, -1, 0))
        b_idx = 0
        for v, w in adj[c]:
            if not removed[v]:
                record(v, c, c, b_idx, w)
                b_idx += 1
        sub_sum[c] = [0] * b_idx
        sub_cnt[c] = [0] * b_idx
        removed[c] = True
        for v, _ in adj[c]:
            if not removed[v]:
                build(v)

    build(1)
    active = [False] * (n + 1)
    out = []
    for _ in range(q):
        tp = int(next(it))
        u = int(next(it))
        if tp == 1:
            delta = -1 if active[u] else 1
            active[u] = not active[u]
            for c, b, d in anc[u]:
                sum_dist[c] += delta * d
                cnt_act[c] += delta
                if b >= 0:
                    sub_sum[c][b] += delta * d
                    sub_cnt[c][b] += delta
        else:
            ans = 0
            for c, b, d in anc[u]:
                s = sum_dist[c]
                k = cnt_act[c]
                if b >= 0:
                    s -= sub_sum[c][b]
                    k -= sub_cnt[c][b]
                ans += s + k * d
            out.append(str(ans))
    sys.stdout.write("\\n".join(out) + "\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
n = tokens[0].to_i
q = tokens[1].to_i
adj = Array.new(n + 1) { [] }
idx = 2
(n - 1).times do
  u = tokens[idx].to_i
  v = tokens[idx + 1].to_i
  w = tokens[idx + 2].to_i
  idx += 3
  adj[u] << [v, w]
  adj[v] << [u, w]
end

sz = Array.new(n + 1, 0)
removed = Array.new(n + 1, false)
anc = Array.new(n + 1) { [] }
sum_dist = Array.new(n + 1, 0)
cnt_act = Array.new(n + 1, 0)
sub_sum = Array.new(n + 1) { [] }
sub_cnt = Array.new(n + 1) { [] }

calc_sz = nil
calc_sz = lambda do |u, p|
  s = 1
  adj[u].each { |v, _w| s += calc_sz.call(v, u) if v != p && !removed[v] }
  sz[u] = s
end

find_centroid = nil
find_centroid = lambda do |u, p, total|
  adj[u].each { |v, _w| return find_centroid.call(v, u, total) if v != p && !removed[v] && sz[v] * 2 > total }
  u
end

record = nil
record = lambda do |u, p, c, b, d|
  anc[u] << [c, b, d]
  adj[u].each { |v, w| record.call(v, u, c, b, d + w) if v != p && !removed[v] }
end

build = nil
build = lambda do |entry|
  total = calc_sz.call(entry, 0)
  c = find_centroid.call(entry, 0, total)
  anc[c] << [c, -1, 0]
  b_idx = 0
  adj[c].each do |v, w|
    unless removed[v]
      record.call(v, c, c, b_idx, w)
      b_idx += 1
    end
  end
  sub_sum[c] = Array.new(b_idx, 0)
  sub_cnt[c] = Array.new(b_idx, 0)
  removed[c] = true
  adj[c].each { |v, _w| build.call(v) unless removed[v] }
end

build.call(1)
active = Array.new(n + 1, false)
out = []
q.times do
  tp = tokens[idx].to_i
  u = tokens[idx + 1].to_i
  idx += 2
  if tp == 1
    delta = active[u] ? -1 : 1
    active[u] = !active[u]
    anc[u].each do |c, b, d|
      sum_dist[c] += delta * d
      cnt_act[c] += delta
      if b >= 0
        sub_sum[c][b] += delta * d
        sub_cnt[c][b] += delta
      end
    end
  else
    ans = 0
    anc[u].each do |c, b, d|
      s = sum_dist[c]
      k = cnt_act[c]
      if b >= 0
        s -= sub_sum[c][b]
        k -= sub_cnt[c][b]
      end
      ans += s + k * d
    end
    out << ans
  end
end
puts out.join("\\n")`,
      },
    },
    {
      id: 'ch27-p3',
      tier: 'Boss',
      ratingRange: '2400–2700',
      title: 'Offline Centroid Bucket Aggregation (Weighted Radius / Age-Range Distance Sum)',
      statement:
        'Each vertex v in an N-node weighted tree has an attribute score `val[v]`. Process Q offline queries `(u, L, R)`: compute `sum_{v : L <= val[v] <= R} dist(u, v)` without updating vertices online.',
      constraints: '1 <= N, Q <= 10^5, 1 <= w, val[v] <= 10^9',
      sampleInput: '4 2\n1 2 3\n2 3 4\n2 4 5\n10 20 30 40\n1 15 35\n4 5 25',
      sampleOutput: '10\n13',
      hints: [
        'At each centroid `c`, sort all vertices inside `c`’s subtree (and inside each branch `b`) by `val[v]` and store prefix sums of `(count, dist(c, v))`—requiring only `O(N log N)` total memory!',
        'For each query `(u, L, R)` attached to its `<= 18` ancestor centroids `(c, branch, d_uc)`: binary search `[L, R]` inside `c`’s sorted bucket AND subtract the `[L, R]` binary search inside `c`’s `branch` bucket in `O(log^2 N)` total!',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

struct BucketEntry {
    int val;
    long long prefCnt;
    long long prefDist;
};

struct AncInfo {
    int c, branch;
    long long dist;
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, q;
    if (!(cin >> n >> q)) return 0;
    vector<vector<pair<int, long long>>> adj(n + 1);
    for (int i = 0; i < n - 1; i++) {
        int u, v;
        long long w;
        cin >> u >> v >> w;
        adj[u].push_back({v, w});
        adj[v].push_back({u, w});
    }
    vector<int> val(n + 1);
    for (int i = 1; i <= n; i++) cin >> val[i];

    vector<int> sz(n + 1, 0);
    vector<bool> removed(n + 1, false);
    vector<vector<AncInfo>> anc(n + 1);
    vector<vector<BucketEntry>> cBucket(n + 1);
    vector<vector<vector<BucketEntry>>> bBucket(n + 1);

    auto calc_sz = [&](auto& self, int u, int p) -> int {
        sz[u] = 1;
        for (auto [v, w] : adj[u]) {
            if (v != p && !removed[v]) sz[u] += self(self, v, u);
        }
        return sz[u];
    };

    auto find_centroid = [&](auto& self, int u, int p, int total) -> int {
        for (auto [v, w] : adj[u]) {
            if (v != p && !removed[v] && sz[v] * 2 > total) {
                return self(self, v, u, total);
            }
        }
        return u;
    };

    auto finalize_bucket = [](vector<pair<int, long long>>& raw) {
        sort(raw.begin(), raw.end(), [](const auto& a, const auto& b) {
            return a.first < b.first;
        });
        vector<BucketEntry> res;
        res.reserve(raw.size());
        long long sc = 0, sd = 0;
        for (auto [v, d] : raw) {
            sc += 1;
            sd += d;
            res.push_back({v, sc, sd});
        }
        return res;
    };

    auto collect = [&](auto& self, int u, int p, int c, int b, long long d,
                       vector<pair<int, long long>>& cRaw,
                       vector<pair<int, long long>>& bRaw) -> void {
        anc[u].push_back({c, b, d});
        cRaw.push_back({val[u], d});
        bRaw.push_back({val[u], d});
        for (auto [v, w] : adj[u]) {
            if (v != p && !removed[v]) self(self, v, u, c, b, d + w, cRaw, bRaw);
        }
    };

    auto build = [&](auto& self, int entry) -> void {
        int total = calc_sz(calc_sz, entry, -1);
        int c = find_centroid(find_centroid, entry, -1, total);
        anc[c].push_back({c, -1, 0});
        vector<pair<int, long long>> cRaw;
        cRaw.push_back({val[c], 0});

        int bIdx = 0;
        for (auto [v, w] : adj[c]) {
            if (!removed[v]) {
                vector<pair<int, long long>> bRaw;
                collect(collect, v, c, c, bIdx, w, cRaw, bRaw);
                bBucket[c].push_back(finalize_bucket(bRaw));
                bIdx++;
            }
        }
        cBucket[c] = finalize_bucket(cRaw);
        removed[c] = true;
        for (auto [v, w] : adj[c]) {
            if (!removed[v]) self(self, v);
        }
    };

    build(build, 1);

    auto query_bucket = [](const vector<BucketEntry>& vec, int L, int R) -> pair<long long, long long> {
        auto itR = upper_bound(vec.begin(), vec.end(), R, [](int key, const BucketEntry& e) {
            return key < e.val;
        });
        if (itR == vec.begin()) return {0, 0};
        auto itL = lower_bound(vec.begin(), vec.end(), L, [](const BucketEntry& e, int key) {
            return e.val < key;
        });
        long long cnt = prev(itR)->prefCnt - (itL == vec.begin() ? 0 : prev(itL)->prefCnt);
        long long sum = prev(itR)->prefDist - (itL == vec.begin() ? 0 : prev(itL)->prefDist);
        return {cnt, sum};
    };

    while (q--) {
        int u, L, R;
        cin >> u >> L >> R;
        long long ans = 0;
        for (const auto& info : anc[u]) {
            auto [cnt, sumD] = query_bucket(cBucket[info.c], L, R);
            if (info.branch != -1) {
                auto [bc, bs] = query_bucket(bBucket[info.c][info.branch], L, R);
                cnt -= bc;
                sumD -= bs;
            }
            ans += sumD + cnt * info.dist;
        }
        cout << ans << "\\n";
    }
    return 0;
}`,
        rust: `use std::io::{self, Read};

#[derive(Clone, Copy)]
struct BucketEntry {
    val: i32,
    pref_cnt: i64,
    pref_dist: i64,
}

#[derive(Clone, Copy)]
struct AncInfo {
    c: usize,
    branch: i32,
    dist: i64,
}

struct Solver {
    adj: Vec<Vec<(usize, i64)>>,
    val: Vec<i32>,
    sz: Vec<usize>,
    removed: Vec<bool>,
    anc: Vec<Vec<AncInfo>>,
    c_bucket: Vec<Vec<BucketEntry>>,
    b_bucket: Vec<Vec<Vec<BucketEntry>>>,
}

impl Solver {
    fn calc_sz(&mut self, u: usize, p: usize) -> usize {
        self.sz[u] = 1;
        let len = self.adj[u].len();
        for i in 0..len {
            let v = self.adj[u][i].0;
            if v != p && !self.removed[v] {
                self.sz[u] += self.calc_sz(v, u);
            }
        }
        self.sz[u]
    }

    fn find_centroid(&self, u: usize, p: usize, total: usize) -> usize {
        for &(v, _) in &self.adj[u] {
            if v != p && !self.removed[v] && self.sz[v] * 2 > total {
                return self.find_centroid(v, u, total);
            }
        }
        u
    }

    fn finalize(mut raw: Vec<(i32, i64)>) -> Vec<BucketEntry> {
        raw.sort_unstable_by_key(|x| x.0);
        let mut res = Vec::with_capacity(raw.len());
        let (mut sc, mut sd) = (0i64, 0i64);
        for (v, d) in raw {
            sc += 1;
            sd += d;
            res.push(BucketEntry { val: v, pref_cnt: sc, pref_dist: sd });
        }
        res
    }

    fn collect(
        &mut self,
        u: usize,
        p: usize,
        c: usize,
        b: i32,
        d: i64,
        c_raw: &mut Vec<(i32, i64)>,
        b_raw: &mut Vec<(i32, i64)>,
    ) {
        self.anc[u].push(AncInfo { c, branch: b, dist: d });
        c_raw.push((self.val[u], d));
        b_raw.push((self.val[u], d));
        let len = self.adj[u].len();
        for i in 0..len {
            let (v, w) = self.adj[u][i];
            if v != p && !self.removed[v] {
                self.collect(v, u, c, b, d + w, c_raw, b_raw);
            }
        }
    }

    fn build(&mut self, entry: usize) {
        let total = self.calc_sz(entry, 0);
        let c = self.find_centroid(entry, 0, total);
        self.anc[c].push(AncInfo { c, branch: -1, dist: 0 });
        let mut c_raw = vec![(self.val[c], 0i64)];
        let mut b_idx = 0i32;
        let len = self.adj[c].len();
        for i in 0..len {
            let (v, w) = self.adj[c][i];
            if !self.removed[v] {
                let mut b_raw = Vec::new();
                self.collect(v, c, c, b_idx, w, &mut c_raw, &mut b_raw);
                self.b_bucket[c].push(Self::finalize(b_raw));
                b_idx += 1;
            }
        }
        self.c_bucket[c] = Self::finalize(c_raw);
        self.removed[c] = true;
        for i in 0..len {
            let v = self.adj[c][i].0;
            if !self.removed[v] {
                self.build(v);
            }
        }
    }

    fn query_bucket(vec: &[BucketEntry], l: i32, r: i32) -> (i64, i64) {
        let right = vec.partition_point(|e| e.val <= r);
        if right == 0 {
            return (0, 0);
        }
        let left = vec.partition_point(|e| e.val < l);
        if left >= right {
            return (0, 0);
        }
        let cnt = vec[right - 1].pref_cnt - if left == 0 { 0 } else { vec[left - 1].pref_cnt };
        let sum = vec[right - 1].pref_dist - if left == 0 { 0 } else { vec[left - 1].pref_dist };
        (cnt, sum)
    }
}

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let n: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };
    let q: usize = it.next().unwrap().parse().unwrap();
    let mut adj = vec![Vec::new(); n + 1];
    for _ in 0..n - 1 {
        let u: usize = it.next().unwrap().parse().unwrap();
        let v: usize = it.next().unwrap().parse().unwrap();
        let w: i64 = it.next().unwrap().parse().unwrap();
        adj[u].push((v, w));
        adj[v].push((u, w));
    }
    let mut val = vec![0i32; n + 1];
    for i in 1..=n {
        val[i] = it.next().unwrap().parse().unwrap();
    }

    let mut solver = Solver {
        adj,
        val,
        sz: vec![0; n + 1],
        removed: vec![false; n + 1],
        anc: vec![Vec::new(); n + 1],
        c_bucket: vec![Vec::new(); n + 1],
        b_bucket: vec![Vec::new(); n + 1],
    };
    solver.build(1);

    let mut out = String::new();
    for _ in 0..q {
        let u: usize = it.next().unwrap().parse().unwrap();
        let l: i32 = it.next().unwrap().parse().unwrap();
        let r: i32 = it.next().unwrap().parse().unwrap();
        let mut ans = 0i64;
        for info in &solver.anc[u] {
            let (mut cnt, mut sum_d) = Solver::query_bucket(&solver.c_bucket[info.c], l, r);
            if info.branch >= 0 {
                let (bc, bs) = Solver::query_bucket(&solver.b_bucket[info.c][info.branch as usize], l, r);
                cnt -= bc;
                sum_d -= bs;
            }
            ans += sum_d + cnt * info.dist;
        }
        out.push_str(&format!("{}\\n", ans));
    }
    print!("{}", out);
}`,
        java21: `import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

public class Main {
    static final class FastScanner {
        private final InputStream in;
        private final byte[] buf = new byte[1 << 16];
        private int p = 0, l = 0;
        FastScanner(InputStream in) { this.in = in; }
        private int rb() throws IOException {
            if (p >= l) { p = 0; l = in.read(buf); if (l <= 0) return -1; }
            return buf[p++];
        }
        long nextLong() throws IOException {
            int c = rb();
            while (c >= 0 && c <= ' ') c = rb();
            if (c == -1) return Long.MIN_VALUE;
            long v = 0;
            while (c > ' ') { v = v * 10 + (c - '0'); c = rb(); }
            return v;
        }
        int nextInt() throws IOException { return (int) nextLong(); }
    }

    static final class Bucket {
        int[] vals;
        long[] prefCnt, prefDist;
        Bucket(List<long[]> raw) {
            raw.sort(Comparator.comparingLong(x -> x[0]));
            int m = raw.size();
            vals = new int[m];
            prefCnt = new long[m];
            prefDist = new long[m];
            long sc = 0, sd = 0;
            for (int i = 0; i < m; i++) {
                vals[i] = (int) raw.get(i)[0];
                sc++;
                sd += raw.get(i)[1];
                prefCnt[i] = sc;
                prefDist[i] = sd;
            }
        }
        long[] query(int L, int R) {
            int lo = 0, hi = vals.length;
            while (lo < hi) {
                int mid = (lo + hi) >>> 1;
                if (vals[mid] <= R) lo = mid + 1; else hi = mid;
            }
            int right = lo;
            if (right == 0) return new long[]{0, 0};
            lo = 0; hi = vals.length;
            while (lo < hi) {
                int mid = (lo + hi) >>> 1;
                if (vals[mid] < L) lo = mid + 1; else hi = mid;
            }
            int left = lo;
            if (left >= right) return new long[]{0, 0};
            long cnt = prefCnt[right - 1] - (left == 0 ? 0 : prefCnt[left - 1]);
            long sum = prefDist[right - 1] - (left == 0 ? 0 : prefDist[left - 1]);
            return new long[]{cnt, sum};
        }
    }

    static List<long[]>[] adj, anc;
    static int[] val, sz;
    static boolean[] removed;
    static Bucket[] cBucket;
    static List<Bucket>[] bBucket;

    static int calcSz(int u, int p) {
        sz[u] = 1;
        for (long[] e : adj[u]) {
            int v = (int) e[0];
            if (v != p && !removed[v]) sz[u] += calcSz(v, u);
        }
        return sz[u];
    }

    static int findCentroid(int u, int p, int total) {
        for (long[] e : adj[u]) {
            int v = (int) e[0];
            if (v != p && !removed[v] && sz[v] * 2 > total) return findCentroid(v, u, total);
        }
        return u;
    }

    static void collect(int u, int p, int c, int b, long d, List<long[]> cRaw, List<long[]> bRaw) {
        anc[u].add(new long[]{c, b, d});
        cRaw.add(new long[]{val[u], d});
        bRaw.add(new long[]{val[u], d});
        for (long[] e : adj[u]) {
            int v = (int) e[0];
            if (v != p && !removed[v]) collect(v, u, c, b, d + e[1], cRaw, bRaw);
        }
    }

    static void build(int entry) {
        int total = calcSz(entry, -1);
        int c = findCentroid(entry, -1, total);
        anc[c].add(new long[]{c, -1, 0});
        List<long[]> cRaw = new ArrayList<>();
        cRaw.add(new long[]{val[c], 0});
        int bIdx = 0;
        for (long[] e : adj[c]) {
            int v = (int) e[0];
            if (!removed[v]) {
                List<long[]> bRaw = new ArrayList<>();
                collect(v, c, c, bIdx, e[1], cRaw, bRaw);
                bBucket[c].add(new Bucket(bRaw));
                bIdx++;
            }
        }
        cBucket[c] = new Bucket(cRaw);
        removed[c] = true;
        for (long[] e : adj[c]) {
            int v = (int) e[0];
            if (!removed[v]) build(v);
        }
    }

    @SuppressWarnings("unchecked")
    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        int n = fs.nextInt();
        if (n == Integer.MIN_VALUE) return;
        int q = fs.nextInt();
        adj = new List[n + 1];
        anc = new List[n + 1];
        bBucket = new List[n + 1];
        for (int i = 0; i <= n; i++) {
            adj[i] = new ArrayList<>();
            anc[i] = new ArrayList<>();
            bBucket[i] = new ArrayList<>();
        }
        for (int i = 0; i < n - 1; i++) {
            int u = fs.nextInt(), v = fs.nextInt();
            long w = fs.nextLong();
            adj[u].add(new long[]{v, w});
            adj[v].add(new long[]{u, w});
        }
        val = new int[n + 1];
        for (int i = 1; i <= n; i++) val[i] = fs.nextInt();
        sz = new int[n + 1];
        removed = new boolean[n + 1];
        cBucket = new Bucket[n + 1];
        build(1);

        StringBuilder sb = new StringBuilder();
        while (q-- > 0) {
            int u = fs.nextInt(), L = fs.nextInt(), R = fs.nextInt();
            long ans = 0;
            for (long[] info : anc[u]) {
                int c = (int) info[0], b = (int) info[1];
                long d = info[2];
                long[] cur = cBucket[c].query(L, R);
                long cnt = cur[0], sumD = cur[1];
                if (b >= 0) {
                    long[] sub = bBucket[c].get(b).query(L, R);
                    cnt -= sub[0];
                    sumD -= sub[1];
                }
                ans += sumD + cnt * d;
            }
            sb.append(ans).append('\\n');
        }
        System.out.print(sb);
    }
}`,
        python3: `import sys
from bisect import bisect_left, bisect_right

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    n = int(next(it))
    q = int(next(it))
    adj = [[] for _ in range(n + 1)]
    for _ in range(n - 1):
        u = int(next(it))
        v = int(next(it))
        w = int(next(it))
        adj[u].append((v, w))
        adj[v].append((u, w))
    val = [0] + [int(next(it)) for _ in range(n)]

    sz = [0] * (n + 1)
    removed = [False] * (n + 1)
    anc = [[] for _ in range(n + 1)]
    c_bucket = [None] * (n + 1)
    b_bucket = [[] for _ in range(n + 1)]

    def make_bucket(raw: list[tuple[int, int]]) -> tuple[list[int], list[int], list[int]]:
        raw.sort(key=lambda x: x[0])
        vals = []
        pc = [0]
        pd = [0]
        for v, d in raw:
            vals.append(v)
            pc.append(pc[-1] + 1)
            pd.append(pd[-1] + d)
        return vals, pc, pd

    def query_bucket(bucket: tuple[list[int], list[int], list[int]], L: int, R: int) -> tuple[int, int]:
        vals, pc, pd = bucket
        left = bisect_left(vals, L)
        right = bisect_right(vals, R)
        return pc[right] - pc[left], pd[right] - pd[left]

    def calc_sz(u: int, p: int) -> int:
        s = 1
        for v, _ in adj[u]:
            if v != p and not removed[v]:
                s += calc_sz(v, u)
        sz[u] = s
        return s

    def find_centroid(u: int, p: int, total: int) -> int:
        for v, _ in adj[u]:
            if v != p and not removed[v] and sz[v] * 2 > total:
                return find_centroid(v, u, total)
        return u

    def collect(u: int, p: int, c: int, b: int, d: int, c_raw: list, b_raw: list) -> None:
        anc[u].append((c, b, d))
        c_raw.append((val[u], d))
        b_raw.append((val[u], d))
        for v, w in adj[u]:
            if v != p and not removed[v]:
                collect(v, u, c, b, d + w, c_raw, b_raw)

    def build(entry: int) -> None:
        total = calc_sz(entry, 0)
        c = find_centroid(entry, 0, total)
        anc[c].append((c, -1, 0))
        c_raw = [(val[c], 0)]
        b_idx = 0
        for v, w in adj[c]:
            if not removed[v]:
                b_raw = []
                collect(v, c, c, b_idx, w, c_raw, b_raw)
                b_bucket[c].append(make_bucket(b_raw))
                b_idx += 1
        c_bucket[c] = make_bucket(c_raw)
        removed[c] = True
        for v, _ in adj[c]:
            if not removed[v]:
                build(v)

    build(1)
    out = []
    for _ in range(q):
        u = int(next(it))
        L = int(next(it))
        R = int(next(it))
        ans = 0
        for c, b, d in anc[u]:
            cnt, sum_d = query_bucket(c_bucket[c], L, R)
            if b >= 0:
                bc, bs = query_bucket(b_bucket[c][b], L, R)
                cnt -= bc
                sum_d -= bs
            ans += sum_d + cnt * d
        out.append(str(ans))
    sys.stdout.write("\\n".join(out) + "\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
n = tokens[0].to_i
q = tokens[1].to_i
adj = Array.new(n + 1) { [] }
idx = 2
(n - 1).times do
  u = tokens[idx].to_i
  v = tokens[idx + 1].to_i
  w = tokens[idx + 2].to_i
  idx += 3
  adj[u] << [v, w]
  adj[v] << [u, w]
end
val = [0] + Array.new(n) { |i| tokens[idx + i].to_i }
idx += n

sz = Array.new(n + 1, 0)
removed = Array.new(n + 1, false)
anc = Array.new(n + 1) { [] }
c_bucket = Array.new(n + 1)
b_bucket = Array.new(n + 1) { [] }

make_bucket = lambda do |raw|
  raw.sort_by! { |x| x[0] }
  vals = []
  pc = [0]
  pd = [0]
  raw.each do |v, d|
    vals << v
    pc << (pc[-1] + 1)
    pd << (pd[-1] + d)
  end
  [vals, pc, pd]
end

query_bucket = lambda do |bucket, l, r|
  vals, pc, pd = bucket
  left = vals.bsearch_index { |x| x >= l } || vals.size
  right = vals.bsearch_index { |x| x > r } || vals.size
  [pc[right] - pc[left], pd[right] - pd[left]]
end

calc_sz = nil
calc_sz = lambda do |u, p|
  s = 1
  adj[u].each { |v, _w| s += calc_sz.call(v, u) if v != p && !removed[v] }
  sz[u] = s
end

find_centroid = nil
find_centroid = lambda do |u, p, total|
  adj[u].each { |v, _w| return find_centroid.call(v, u, total) if v != p && !removed[v] && sz[v] * 2 > total }
  u
end

collect = nil
collect = lambda do |u, p, c, b, d, c_raw, b_raw|
  anc[u] << [c, b, d]
  c_raw << [val[u], d]
  b_raw << [val[u], d]
  adj[u].each { |v, w| collect.call(v, u, c, b, d + w, c_raw, b_raw) if v != p && !removed[v] }
end

build = nil
build = lambda do |entry|
  total = calc_sz.call(entry, 0)
  c = find_centroid.call(entry, 0, total)
  anc[c] << [c, -1, 0]
  c_raw = [[val[c], 0]]
  b_idx = 0
  adj[c].each do |v, w|
    unless removed[v]
      b_raw = []
      collect.call(v, c, c, b_idx, w, c_raw, b_raw)
      b_bucket[c] << make_bucket.call(b_raw)
      b_idx += 1
    end
  end
  c_bucket[c] = make_bucket.call(c_raw)
  removed[c] = true
  adj[c].each { |v, _w| build.call(v) unless removed[v] }
end

build.call(1)
out = []
q.times do
  u = tokens[idx].to_i
  l = tokens[idx + 1].to_i
  r = tokens[idx + 2].to_i
  idx += 3
  ans = 0
  anc[u].each do |c, b, d|
    cnt, sum_d = query_bucket.call(c_bucket[c], l, r)
    if b >= 0
      bc, bs = query_bucket.call(b_bucket[c][b], l, r)
      cnt -= bc
      sum_d -= bs
    end
    ans += sum_d + cnt * d
  end
  out << ans
end
puts out.join("\\n")`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'CSES',
      title: 'Finding a Centroid, Fixed-Length Paths I & Fixed-Length Paths II',
      difficulty: 'Hard',
      url: 'https://cses.fi/problemset/task/2080',
      patternNote: 'Direct Centroid Decomposition path-counting benchmark (`N <= 200,000`).',
    },
    {
      platform: 'AtCoder',
      title: 'ABC 291 Ex — Balanced Tree / Yahoo Procon C',
      difficulty: 'AtCoder Yellow (~2000)',
      url: 'https://atcoder.jp/contests/abc291/tasks/abc291_h',
      patternNote: 'Builds and outputs the exact parent array `cParent[]` of a balanced Centroid Tree.',
    },
    {
      platform: 'Codeforces',
      title: 'CF 342E — Xenia and Tree',
      difficulty: '2000 (Div.2)',
      url: 'https://codeforces.com/problemset/problem/342/E',
      patternNote: 'The textbook dynamic paint-red / closest-red-node Centroid Tree ancestor walk.',
    },
    {
      platform: 'CodeChef',
      title: 'QTREE5 / PRIMEDST — Prime Distance on Tree',
      difficulty: 'CodeChef 6-Star',
      url: 'https://www.codechef.com/problems/PRIMEDST',
      patternNote: 'Pairs Centroid Decomposition subtree depth counts with NTT convolution to count prime-length paths!',
    },
    {
      platform: 'HackerRank',
      title: 'Tree Pruning / Distance Queries on Dynamic Trees',
      difficulty: 'Hard',
      url: 'https://www.hackerrank.com/challenges/tree-pruning/problem',
      patternNote: 'Inclusion-exclusion across centroid branches for dynamic distance sums.',
    },
    {
      platform: 'NeetCode 150',
      title: 'Binary Tree Maximum Path Sum / Diameter Extensions',
      difficulty: 'Platinum Extension',
      url: 'https://neetcode.io/practice',
      patternNote: 'Generalizes static tree path-aggregation interviews to online `O(log N)` node toggles and distance queries.',
    },
  ],
  interviewNotes: [
    'Why Centroid Decomposition guarantees `O(log N)` depth: every tree has a vertex whose removal leaves every connected component with size `<= N/2` (found simply by walking down the unique child with `sz[v] > N/2`). Halving size every recursion bounds depth strictly to `floor(log2(N))`.',
    'How does Centroid Decomposition differ from HLD? HLD turns paths into contiguous Segment Tree ranges (ideal for path max/add/assign); Centroid Decomposition preserves ALL cross-branch distances around `<= 18` hubs (ideal for non-path queries like "closest active node" or "sum of distances to all active nodes").',
    'Crucial memory/speed trick: caching `{(centroid, branch, dist(u, centroid))}` inside `ancestors[u]` during build uses `O(N log N)` memory and completely eliminates LCA lookups during updates/queries.',
  ],
  projectBlueprint: {
    title: 'Global Telecommunication Hub & Latency Optimization Router',
    tagline:
      'Construct a balanced hierarchical fiber backbone over regional PoPs so CDN server activations and closest-PoP latency queries run in O(log N) hops.',
    stackSummary: 'TypeScript Engine • Balanced Centroid Tree Builder • Cached Ancestor Latencies • Dynamic PoP Router',
    asciiDiagram: `Physical Fiber Tree (up to 10^5 PoPs, arbitrary skew)
         |
         v
[ Recursive Centroid Extractor (max branch <= N/2) ]
         |
         v
Virtual Centroid Backbone (Height <= 17)
   ancestors[pop] = [(hub_c, latency(pop, hub_c)), ...]
         |
         +--> activateEdgeCache(pop)  ---> O(log N) hub updates
         +--> nearestCacheLatency(u)  ---> O(log N) exact min latency`,
    milestones: [
      {
        id: 'ch27-m1',
        title: 'Build Recursive Weighted-Tree Centroid Backbone Decomposer',
        detail: 'Compute component sizes, locate balanced hub centroids (`2 * sz[v] <= total`), and build the virtual centroid hierarchy.',
      },
      {
        id: 'ch27-m2',
        title: 'Cache Per-Node Ancestor Fiber Latencies',
        detail: 'Record exact `(centroidHub, branchId, latencyMs)` tuples on every PoP so runtime routing requires zero LCA traversals.',
      },
      {
        id: 'ch27-m3',
        title: 'Add Dynamic Edge-PoP Activation & Nearest-Replica Query',
        detail: 'Maintain best downstream active latency per hub for `O(log N)` failover routing when edge PoPs spin up.',
      },
      {
        id: 'ch27-m4',
        title: 'Add Inclusion-Exclusion Global Latency Sum Auditor',
        detail: 'Track active counts and latency sums excluding same-branch double counts to evaluate total network RTT from any node.',
      },
    ],
    starterCode: `export interface BackboneEdge {
  u: number;
  v: number;
  latencyMs: number;
}

interface AncestorHub {
  centroid: number;
  branch: number;
  dist: number;
}

export class TelecomCentroidRouter {
  private adj: { to: number; w: number }[][];
  private sz: Int32Array;
  private removed: Uint8Array;
  private ancestors: AncestorHub[][];
  private bestLatency: Float64Array;
  private sumDist: Float64Array;
  private activeCount: Int32Array;
  private branchSum: number[][];
  private branchCnt: number[][];
  private active: Uint8Array;

  constructor(private readonly n: number, edges: BackboneEdge[]) {
    this.adj = Array.from({ length: n + 1 }, () => []);
    for (const e of edges) {
      this.adj[e.u].push({ to: e.v, w: e.latencyMs });
      this.adj[e.v].push({ to: e.u, w: e.latencyMs });
    }
    this.sz = new Int32Array(n + 1);
    this.removed = new Uint8Array(n + 1);
    this.ancestors = Array.from({ length: n + 1 }, () => []);
    this.bestLatency = new Float64Array(n + 1).fill(Infinity);
    this.sumDist = new Float64Array(n + 1);
    this.activeCount = new Int32Array(n + 1);
    this.branchSum = Array.from({ length: n + 1 }, () => []);
    this.branchCnt = Array.from({ length: n + 1 }, () => []);
    this.active = new Uint8Array(n + 1);
    if (n >= 1) this.build(1);
  }

  private calcSz(u: number, p: number): number {
    let s = 1;
    for (const e of this.adj[u]) {
      if (e.to !== p && !this.removed[e.to]) s += this.calcSz(e.to, u);
    }
    this.sz[u] = s;
    return s;
  }

  private findCentroid(u: number, p: number, total: number): number {
    for (const e of this.adj[u]) {
      if (e.to !== p && !this.removed[e.to] && this.sz[e.to] * 2 > total) {
        return this.findCentroid(e.to, u, total);
      }
    }
    return u;
  }

  private record(u: number, p: number, c: number, branch: number, d: number): void {
    this.ancestors[u].push({ centroid: c, branch, dist: d });
    for (const e of this.adj[u]) {
      if (e.to !== p && !this.removed[e.to]) {
        this.record(e.to, u, c, branch, d + e.w);
      }
    }
  }

  private build(entry: number): void {
    const total = this.calcSz(entry, -1);
    const c = this.findCentroid(entry, -1, total);
    this.ancestors[c].push({ centroid: c, branch: -1, dist: 0 });
    let bIdx = 0;
    for (const e of this.adj[c]) {
      if (!this.removed[e.to]) {
        this.record(e.to, c, c, bIdx, e.w);
        bIdx++;
      }
    }
    this.branchSum[c] = new Array(bIdx).fill(0);
    this.branchCnt[c] = new Array(bIdx).fill(0);
    this.removed[c] = 1;
    for (const e of this.adj[c]) {
      if (!this.removed[e.to]) this.build(e.to);
    }
  }

  activatePop(pop: number): void {
    if (this.active[pop]) return;
    this.active[pop] = 1;
    for (const info of this.ancestors[pop]) {
      this.bestLatency[info.centroid] = Math.min(this.bestLatency[info.centroid], info.dist);
      this.sumDist[info.centroid] += info.dist;
      this.activeCount[info.centroid] += 1;
      if (info.branch >= 0) {
        this.branchSum[info.centroid][info.branch] += info.dist;
        this.branchCnt[info.centroid][info.branch] += 1;
      }
    }
  }

  queryNearestPopLatency(pop: number): number {
    let ans = Infinity;
    for (const info of this.ancestors[pop]) {
      ans = Math.min(ans, this.bestLatency[info.centroid] + info.dist);
    }
    return ans;
  }

  queryTotalActiveLatency(pop: number): number {
    let ans = 0;
    for (const info of this.ancestors[pop]) {
      let s = this.sumDist[info.centroid];
      let k = this.activeCount[info.centroid];
      if (info.branch >= 0) {
        s -= this.branchSum[info.centroid][info.branch];
        k -= this.branchCnt[info.centroid][info.branch];
      }
      ans += s + k * info.dist;
    }
    return ans;
  }
}`,
  },
};
