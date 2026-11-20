import type { TheoryChapter } from '../../types/vault';

export const CH60_CDQ_DYNAMIC_CONNECTIVITY: TheoryChapter = {
  slug: 'cdq-divide-conquer-offline',
  topicId: 'ds-14',
  title: 'CDQ Divide & Conquer and Dynamic Connectivity',
  domain: 'Data Structures',
  ratingTier: '2200–2600',
  usacoDivision: 'Platinum',
  subtitle:
    'Eliminate a full spatial or temporal dimension in 3D partial-order queries using CDQ Divide & Conquer in O(N log^2 N), and support arbitrary edge additions and deletions on graphs via Segment Tree Over Time paired with Rollback DSU.',
  analogyTitle: 'The Half-Split Time Capsule & Edge Lifespan Timeline Analogy',
  analogyBody:
    'How do you answer 3D dominance (`a_j <= a_i, b_j <= b_i, c_j <= c_i`) without heavy 2D Fenwick-of-Segment-Trees, or handle graph edge DELETIONS when standard DSU only knows how to merge? **CDQ Divide & Conquer** sorts points by `a`, splits `[l, r]` at `mid`, solves `[l, mid]` and `[mid+1, r]`, and then **ONLY computes cross-contributions from Left `<= mid` to Right `> mid`**! Because every Left point already satisfies `a_L <= a_R`, the `a`-dimension vanishes completely—leaving only a two-pointer merge on `b` and a `1D` Fenwick Tree on `c`! By the exact same timeline duality, **Dynamic Graph Connectivity Offline** maps each edge’s active duration `[t_add, t_del - 1]` onto `O(log Q)` canonical nodes of a **Segment Tree over Time**. Walking DFS down the timeline tree merges edges on entry and **rolls back DSU state via a stack on exit**, answering connectivity and bipartiteness across arbitrary deletions without a single dynamic tree!',
  prerequisites: [
    {
      slug: 'disjoint-set-union-rollback',
      title: 'Disjoint Set Union (DSU) & DSU with Rollback',
    },
    {
      slug: 'fenwick-tree-binary-lifting',
      title: 'Fenwick Tree (BIT) & Binary Lifting on BIT',
    },
  ],
  traceTitle: 'Interactive CDQ 3D Partial Order & Timeline Segment-Tree Trace',
  traceSubtitle:
    'First watch CDQ split `(a, b, c)` across `mid` eliminating `a` via BIT(`c`), then trace Dynamic Connectivity edge lifespans `(1,2):[0,2], (2,3):[0,1], (4,5):[0,3], (3,4):[1,3]` over `[0..3]`.',
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Step 1: Sort & Compress Unique Triples by (a, b, c) Before CDQ Split',
      explanation:
        'Duplicate triples `[(2,2,2), (2,2,2)]` collapse into `{ (2,2,2), cnt: 2 }` so strict ordering holds across all unique representatives. Internal duplicate pairs contribute `cnt * (cnt - 1) = 2`.',
      mode: 'array',
      arrays: [
        {
          name: 'Deduplicated Triples Sorted by (a, b, c)',
          cells: [
            { index: 0, value: '(1,1,1) cnt=1', label: 'Left', highlight: 'window' },
            { index: 1, value: '(2,2,2) cnt=2', label: 'Right', highlight: 'active' },
            { index: 2, value: '(3,1,2) cnt=1', label: 'Right', highlight: 'updated' },
          ],
        },
      ],
      variables: { TotalRawPoints: 4, UniqueTriples: 3, InternalPairs: 2 },
    },
    {
      stepNumber: 2,
      title: 'Step 2: Two-Pointer Merge on b + Fenwick Tree on c Across Midpoint',
      explanation:
        'Every point in Left has `a <= a_Right`. Sweep `j` through Right sorted by `b`: while `b_i <= b_j`, insert `c_i` (+cnt_i) into BIT; query `BIT.sum(c_j)` to count all Left points dominating `j` across ALL 3 dimensions simultaneously, then undo BIT!',
      mode: 'array',
      arrays: [
        {
          name: 'Cross-Contribution BIT(c) During Merge [0..2]',
          cells: [
            { index: 0, value: 'R=(3,1,2): add (1,1,1)->BIT[1]+=1', highlight: 'window' },
            { index: 1, value: 'Query BIT(c=2) -> +1', highlight: 'updated' },
            { index: 2, value: 'R=(2,2,2): Query BIT(c=2) -> +1*2', highlight: 'active' },
          ],
        },
      ],
      variables: { CrossPairs: 3, TotalOrderedPairs: 5, Complexity: 'O(N log^2 N)' },
    },
    {
      stepNumber: 3,
      title: 'Step 3: Segment Tree Over Time [0..3] with Stack-Based Rollback DSU',
      explanation:
        'Walk DFS top-down on the timeline Segment Tree: push edge `(4,5)` at root `[0,3]`; push `(3,4)` on `[1,3]` (`[1,1]` & `[2,3]`); push `(1,2)` on `[0,2]` (`[0,1]` & `[2,2]`). At leaves `t=0,1,2,3`, record active DSU component count `[2, 1, 2, 3]` and pop DSU stack on unwind!',
      mode: 'array',
      arrays: [
        {
          name: 'Component Counts at Timeline Leaves t = 0..3',
          cells: [
            { index: 0, value: 't=0: 2 comps', label: '{1,2,3},{4,5}', highlight: 'window' },
            { index: 1, value: 't=1: 1 comp', label: '+edge (3,4)', highlight: 'active' },
            { index: 2, value: 't=2: 2 comps', label: '-edge (2,3)', highlight: 'updated' },
            { index: 3, value: 't=3: 3 comps', label: '-edge (1,2)', highlight: 'neutral' },
          ],
        },
      ],
      variables: { EdgesTracked: 4, RollbackDSUMerge: 'Size-Only (NO Path Comp)', Time: 'O((M+K) log K log N)' },
    },
  ],
  reductionClues: [
    {
      clue: '"Count pairs (j, i) satisfying a_j <= a_i, b_j <= b_i, c_j <= c_i (3D partial order) or 2D offline dynamic range sums"',
      translation:
        '**CDQ Divide & Conquer (`O(N log^2 N)`)**: sort by `a` (or time), recurse on `[l, mid]` & `[mid+1, r]`, then sort/merge both halves by `b` while counting `c` via a 1D Fenwick Tree!',
    },
    {
      clue: '"Graph connectivity / component count / max clique / bipartiteness queries mixed with edge ADDITIONS and DELETIONS"',
      translation:
        '**Segment Tree Over Time + Rollback DSU**: pair each edge’s active window `[t_add, t_del - 1]`, insert into `O(log Q)` Segment Tree nodes, DFS down merging DSU and pop rollback checkpoints on backtrack!',
    },
    {
      clue: '"Why did my Rollback DSU TLE or corrupt state during Timeline DFS?"',
      translation:
        '**NEVER use Path Compression** inside a Rollback DSU! Path compression flattens `O(alpha)` trees mutating dozens of nodes per `find()`, making `O(1)` undo impossible. Union-by-Size ONLY guarantees `O(log N)` tree depth AND 1-entry stack rollbacks!',
    },
    {
      clue: '"Duplicate `(a, b, c)` triples cause asymmetric self-counting inside CDQ split"',
      translation:
        'ALWAYS compress identical `(a, b, c)` triples into `(a, b, c, cnt)` groups BEFORE running CDQ! That guarantees strict inequality between any Left and Right representative and computes duplicate internal counts as `cnt * (cnt - 1)`.',
    },
  ],
  timeComplexity: 'CDQ: O(N log^2 N) | Timeline DSU: O((M + Q) log Q log N)',
  spaceComplexity: 'O(N + Q log Q)',
  pitfalls: [
    {
      type: 'WA',
      title: 'Using Path Compression in Rollback DSU',
      detail:
        '`parent[x] = find(parent[x])` destroys the ability to undo a single `unite(u, v)` cleanly! In Rollback DSU, write `while (x != p[x]) x = p[x];` with **Union-by-Size / Rank ONLY**, storing `(childRoot, parentRoot, prevSize)` on a stack!',
    },
    {
      type: 'TLE',
      title: 'Calling `memset(bit, 0)` Across the Entire Range `[1..U]` After Every CDQ Node',
      detail:
        'Clearing the full Fenwick array of size `U` at every CDQ call explodes complexity to **`O(N^2 log N)` TLE**! Instead, ONLY subtract `bit.add(c, -cnt)` for the specific Left elements that were actually inserted during that `[l, r]` merge!',
    },
    {
      type: 'WA',
      title: 'Splitting Duplicate Triples `(a, b, c)` Across CDQ Midpoint',
      detail:
        'If two identical triples `(2, 2, 2)` sit on opposite sides of `mid`, Left updates Right once, NOT symmetrically from Right to Left! Collapsing identical triples into `cnt` BEFORE CDQ makes all elements unique and completely eliminates cross-midpoint symmetry bugs.',
    },
    {
      type: 'WA',
      title: 'Wrong Edge Pairing When the Same Edge `(u, v)` Is Added, Deleted, and Re-Added',
      detail:
        'If edge `(u, v)` toggles multiple times (`+1` at t=1, `-1` at t=3, `+1` at t=5), collect all events `(u, v, t, delta)` sorted by `(u, v, t)` so adjacent pairs cleanly match each active interval `[t_start, t_end - 1]` without overwriting earlier appearances!',
    },
  ],
  implementations: {
    cpp20: `#include <bits/stdc++.h>
using namespace std;

// Dynamic Graph Connectivity Offline: Segment Tree over Time + Union-by-Size Rollback DSU
struct RollbackDSU {
    vector<int> p, sz;
    vector<pair<int, int>> history;
    int comps;

    RollbackDSU(int n) : p(n + 1), sz(n + 1, 1), comps(n) {
        iota(p.begin(), p.end(), 0);
    }

    int find(int x) const {
        while (x != p[x]) x = p[x];
        return x;
    }

    void unite(int u, int v) {
        u = find(u);
        v = find(v);
        if (u == v) {
            history.push_back({-1, -1});
            return;
        }
        if (sz[u] > sz[v]) swap(u, v);
        history.push_back({u, v});
        p[u] = v;
        sz[v] += sz[u];
        comps--;
    }

    int snapshot() const { return (int)history.size(); }

    void rollback(int snap) {
        while ((int)history.size() > snap) {
            auto [u, v] = history.back();
            history.pop_back();
            if (u != -1) {
                p[u] = u;
                sz[v] -= sz[u];
                comps++;
            }
        }
    }
};

struct EdgeEvent {
    int u, v, t, delta;
    bool operator<(const EdgeEvent& o) const {
        if (u != o.u) return u < o.u;
        if (v != o.v) return v < o.v;
        if (t != o.t) return t < o.t;
        return delta > o.delta;
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, m, k;
    if (!(cin >> n >> m >> k)) return 0;

    vector<EdgeEvent> raw;
    raw.reserve(m + k);
    for (int i = 0; i < m; i++) {
        int u, v;
        cin >> u >> v;
        if (u > v) swap(u, v);
        raw.push_back({u, v, 0, 1});
    }
    for (int t = 1; t <= k; t++) {
        int typ, u, v;
        cin >> typ >> u >> v;
        if (u > v) swap(u, v);
        raw.push_back({u, v, t, typ == 1 ? 1 : -1});
    }
    sort(raw.begin(), raw.end());

    vector<vector<pair<int, int>>> tree(4 * (k + 1));
    auto addInterval = [&](auto& self, int node, int l, int r, int ql, int qr, int u, int v) -> void {
        if (ql > r || qr < l) return;
        if (ql <= l && r <= qr) {
            tree[node].push_back({u, v});
            return;
        }
        int mid = (l + r) >> 1;
        self(self, node * 2, l, mid, ql, qr, u, v);
        self(self, node * 2 + 1, mid + 1, r, ql, qr, u, v);
    };

    for (int i = 0; i < (int)raw.size(); ) {
        int u = raw[i].u, v = raw[i].v;
        int depth = 0, startT = -1;
        while (i < (int)raw.size() && raw[i].u == u && raw[i].v == v) {
            if (raw[i].delta == 1) {
                if (depth == 0) startT = raw[i].t;
                depth++;
            } else {
                depth--;
                if (depth == 0 && startT != -1 && startT <= raw[i].t - 1) {
                    addInterval(addInterval, 1, 0, k, startT, raw[i].t - 1, u, v);
                }
            }
            i++;
        }
        if (depth > 0 && startT != -1) {
            addInterval(addInterval, 1, 0, k, startT, k, u, v);
        }
    }

    RollbackDSU dsu(n);
    vector<int> ans(k + 1, 0);
    auto dfs = [&](auto& self, int node, int l, int r) -> void {
        int snap = dsu.snapshot();
        for (auto [u, v] : tree[node]) dsu.unite(u, v);
        if (l == r) {
            ans[l] = dsu.comps;
        } else {
            int mid = (l + r) >> 1;
            self(self, node * 2, l, mid);
            self(self, node * 2 + 1, mid + 1, r);
        }
        dsu.rollback(snap);
    };
    dfs(dfs, 1, 0, k);

    for (int t = 0; t <= k; t++) {
        cout << ans[t] << (t == k ? '\\n' : ' ');
    }
    return 0;
}`,
    rust: `use std::io::{self, Read};

struct RollbackDSU {
    p: Vec<usize>,
    sz: Vec<usize>,
    history: Vec<(usize, usize)>,
    comps: usize,
}

impl RollbackDSU {
    fn new(n: usize) -> Self {
        Self {
            p: (0..=n).collect(),
            sz: vec![1; n + 1],
            history: Vec::new(),
            comps: n,
        }
    }

    fn find(&self, mut x: usize) -> usize {
        while x != self.p[x] {
            x = self.p[x];
        }
        x
    }

    fn unite(&mut self, mut u: usize, mut v: usize) {
        u = self.find(u);
        v = self.find(v);
        if u == v {
            self.history.push((0, 0));
            return;
        }
        if self.sz[u] > self.sz[v] {
            std::mem::swap(&mut u, &mut v);
        }
        self.history.push((u, v));
        self.p[u] = v;
        self.sz[v] += self.sz[u];
        self.comps -= 1;
    }

    fn snapshot(&self) -> usize { self.history.len() }

    fn rollback(&mut self, snap: usize) {
        while self.history.len() > snap {
            let (u, v) = self.history.pop().unwrap();
            if u != 0 {
                self.p[u] = u;
                self.sz[v] -= self.sz[u];
                self.comps += 1;
            }
        }
    }
}

fn add_interval(
    tree: &mut [Vec<(usize, usize)>],
    node: usize, l: usize, r: usize, ql: usize, qr: usize, u: usize, v: usize
) {
    if ql <= l && r <= qr {
        tree[node].push((u, v));
        return;
    }
    let mid = (l + r) >> 1;
    if ql <= mid { add_interval(tree, node * 2, l, mid, ql, qr, u, v); }
    if qr > mid { add_interval(tree, node * 2 + 1, mid + 1, r, ql, qr, u, v); }
}

fn dfs(
    tree: &[Vec<(usize, usize)>],
    dsu: &mut RollbackDSU,
    ans: &mut [usize],
    node: usize, l: usize, r: usize
) {
    let snap = dsu.snapshot();
    for &(u, v) in &tree[node] {
        dsu.unite(u, v);
    }
    if l == r {
        ans[l] = dsu.comps;
    } else {
        let mid = (l + r) >> 1;
        dfs(tree, dsu, ans, node * 2, l, mid);
        dfs(tree, dsu, ans, node * 2 + 1, mid + 1, r);
    }
    dsu.rollback(snap);
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

    let mut raw = Vec::with_capacity(m + k);
    for _ in 0..m {
        let mut u: usize = it.next().unwrap().parse().unwrap();
        let mut v: usize = it.next().unwrap().parse().unwrap();
        if u > v { std::mem::swap(&mut u, &mut v); }
        raw.push((u, v, 0usize, 1i32));
    }
    for t in 1..=k {
        let typ: usize = it.next().unwrap().parse().unwrap();
        let mut u: usize = it.next().unwrap().parse().unwrap();
        let mut v: usize = it.next().unwrap().parse().unwrap();
        if u > v { std::mem::swap(&mut u, &mut v); }
        raw.push((u, v, t, if typ == 1 { 1 } else { -1 }));
    }
    raw.sort_unstable_by(|a, b| {
        a.0.cmp(&b.0).then(a.1.cmp(&b.1)).then(a.2.cmp(&b.2)).then(b.3.cmp(&a.3))
    });

    let mut tree = vec![Vec::new(); 4 * (k + 1)];
    let mut i = 0;
    while i < raw.len() {
        let (u, v) = (raw[i].0, raw[i].1);
        let mut depth = 0i32;
        let mut start_t = 0usize;
        let mut active = false;
        while i < raw.len() && raw[i].0 == u && raw[i].1 == v {
            if raw[i].3 == 1 {
                if depth == 0 { start_t = raw[i].2; active = true; }
                depth += 1;
            } else {
                depth -= 1;
                if depth == 0 && active && start_t < raw[i].2 {
                    add_interval(&mut tree, 1, 0, k, start_t, raw[i].2 - 1, u, v);
                    active = false;
                }
            }
            i += 1;
        }
        if depth > 0 && active {
            add_interval(&mut tree, 1, 0, k, start_t, k, u, v);
        }
    }

    let mut dsu = RollbackDSU::new(n);
    let mut ans = vec![0usize; k + 1];
    dfs(&tree, &mut dsu, &mut ans, 1, 0, k);

    let out: Vec<String> = ans.iter().map(|c| c.to_string()).collect();
    println!("{}", out.join(" "));
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

    static int[] p, sz, hu, hv, ans;
    static int hTop = 0, comps;
    static List<int[]>[] tree;

    static int find(int x) {
        while (x != p[x]) x = p[x];
        return x;
    }

    static void unite(int u, int v) {
        u = find(u); v = find(v);
        if (u == v) {
            hu[hTop] = -1; hv[hTop] = -1; hTop++;
            return;
        }
        if (sz[u] > sz[v]) { int t = u; u = v; v = t; }
        hu[hTop] = u; hv[hTop] = v; hTop++;
        p[u] = v;
        sz[v] += sz[u];
        comps--;
    }

    static void rollback(int snap) {
        while (hTop > snap) {
            hTop--;
            int u = hu[hTop], v = hv[hTop];
            if (u != -1) {
                p[u] = u;
                sz[v] -= sz[u];
                comps++;
            }
        }
    }

    static void addInterval(int node, int l, int r, int ql, int qr, int u, int v) {
        if (ql <= l && r <= qr) {
            tree[node].add(new int[]{u, v});
            return;
        }
        int mid = (l + r) >>> 1;
        if (ql <= mid) addInterval(node * 2, l, mid, ql, qr, u, v);
        if (qr > mid) addInterval(node * 2 + 1, mid + 1, r, ql, qr, u, v);
    }

    static void dfs(int node, int l, int r) {
        int snap = hTop;
        for (int[] e : tree[node]) unite(e[0], e[1]);
        if (l == r) {
            ans[l] = comps;
        } else {
            int mid = (l + r) >>> 1;
            dfs(node * 2, l, mid);
            dfs(node * 2 + 1, mid + 1, r);
        }
        rollback(snap);
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        long nLong = fs.nextLong();
        if (nLong == Long.MIN_VALUE) return;
        int n = (int) nLong, m = (int) fs.nextLong(), k = (int) fs.nextLong();

        int[][] raw = new int[m + k][4];
        for (int i = 0; i < m; i++) {
            int u = (int) fs.nextLong(), v = (int) fs.nextLong();
            if (u > v) { int t = u; u = v; v = t; }
            raw[i] = new int[]{u, v, 0, 1};
        }
        for (int t = 1; t <= k; t++) {
            int typ = (int) fs.nextLong(), u = (int) fs.nextLong(), v = (int) fs.nextLong();
            if (u > v) { int tmp = u; u = v; v = tmp; }
            raw[m + t - 1] = new int[]{u, v, t, typ == 1 ? 1 : -1};
        }

        Arrays.sort(raw, (a, b) -> {
            if (a[0] != b[0]) return Integer.compare(a[0], b[0]);
            if (a[1] != b[1]) return Integer.compare(a[1], b[1]);
            if (a[2] != b[2]) return Integer.compare(a[2], b[2]);
            return Integer.compare(b[3], a[3]);
        });

        tree = new ArrayList[4 * (k + 1)];
        for (int i = 0; i < tree.length; i++) tree[i] = new ArrayList<>();

        for (int i = 0; i < raw.length; ) {
            int u = raw[i][0], v = raw[i][1];
            int depth = 0, startT = -1;
            while (i < raw.length && raw[i][0] == u && raw[i][1] == v) {
                if (raw[i][3] == 1) {
                    if (depth == 0) startT = raw[i][2];
                    depth++;
                } else {
                    depth--;
                    if (depth == 0 && startT != -1 && startT < raw[i][2]) {
                        addInterval(1, 0, k, startT, raw[i][2] - 1, u, v);
                        startT = -1;
                    }
                }
                i++;
            }
            if (depth > 0 && startT != -1) addInterval(1, 0, k, startT, k, u, v);
        }

        p = new int[n + 1]; sz = new int[n + 1];
        for (int i = 1; i <= n; i++) { p[i] = i; sz[i] = 1; }
        comps = n;
        int cap = (m + k + 5) * 20;
        hu = new int[cap]; hv = new int[cap];
        ans = new int[k + 1];
        dfs(1, 0, k);

        StringBuilder sb = new StringBuilder();
        for (int t = 0; t <= k; t++) {
            if (t > 0) sb.append(' ');
            sb.append(ans[t]);
        }
        System.out.println(sb.toString());
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
    k = int(data[2])

    raw = []
    idx = 3
    for _ in range(m):
        u = int(data[idx]); v = int(data[idx + 1])
        idx += 2
        if u > v:
            u, v = v, u
        raw.append((u, v, 0, -1, 1))
    for t in range(1, k + 1):
        typ = int(data[idx]); u = int(data[idx + 1]); v = int(data[idx + 2])
        idx += 3
        if u > v:
            u, v = v, u
        delta = 1 if typ == 1 else -1
        raw.append((u, v, t, -delta, delta))
    raw.sort()

    tree = [[] for _ in range(4 * (k + 1))]
    def add_interval(node: int, l: int, r: int, ql: int, qr: int, u: int, v: int) -> None:
        if ql <= l and r <= qr:
            tree[node].append((u, v))
            return
        mid = (l + r) >> 1
        if ql <= mid:
            add_interval(node * 2, l, mid, ql, qr, u, v)
        if qr > mid:
            add_interval(node * 2 + 1, mid + 1, r, ql, qr, u, v)

    i = 0
    total_ev = len(raw)
    while i < total_ev:
        u, v = raw[i][0], raw[i][1]
        depth = 0
        start_t = -1
        while i < total_ev and raw[i][0] == u and raw[i][1] == v:
            _, _, t, _, delta = raw[i]
            if delta == 1:
                if depth == 0:
                    start_t = t
                depth += 1
            else:
                depth -= 1
                if depth == 0 and start_t != -1 and start_t < t:
                    add_interval(1, 0, k, start_t, t - 1, u, v)
                    start_t = -1
            i += 1
        if depth > 0 and start_t != -1:
            add_interval(1, 0, k, start_t, k, u, v)

    p = list(range(n + 1))
    sz = [1] * (n + 1)
    history = []
    comps = n
    ans = [0] * (k + 1)

    def find(x: int) -> int:
        while x != p[x]:
            x = p[x]
        return x

    def dfs(node: int, l: int, r: int) -> None:
        nonlocal comps
        snap = len(history)
        for u, v in tree[node]:
            ru = find(u)
            rv = find(v)
            if ru == rv:
                history.append((-1, -1))
            else:
                if sz[ru] > sz[rv]:
                    ru, rv = rv, ru
                history.append((ru, rv))
                p[ru] = rv
                sz[rv] += sz[ru]
                comps -= 1
        if l == r:
            ans[l] = comps
        else:
            mid = (l + r) >> 1
            dfs(node * 2, l, mid)
            dfs(node * 2 + 1, mid + 1, r)
        while len(history) > snap:
            ru, rv = history.pop()
            if ru != -1:
                p[ru] = ru
                sz[rv] -= sz[ru]
                comps += 1

    dfs(1, 0, k)
    sys.stdout.write(" ".join(map(str, ans)) + "\\n")

if __name__ == "__main__":
    solve()`,
    ruby: `tokens = $stdin.read.split
exit if tokens.empty?
n = tokens[0].to_i
m = tokens[1].to_i
k = tokens[2].to_i

raw = []
idx = 3
m.times do
  u = tokens[idx].to_i; v = tokens[idx + 1].to_i
  idx += 2
  u, v = v, u if u > v
  raw << [u, v, 0, -1, 1]
end
(1..k).each do |t|
  typ = tokens[idx].to_i; u = tokens[idx + 1].to_i; v = tokens[idx + 2].to_i
  idx += 3
  u, v = v, u if u > v
  d = typ == 1 ? 1 : -1
  raw << [u, v, t, -d, d]
end
raw.sort!

tree = Array.new(4 * (k + 1)) { [] }
add_interval = nil
add_interval = lambda do |node, l, r, ql, qr, u, v|
  if ql <= l && r <= qr
    tree[node] << [u, v]
    return
  end
  mid = (l + r) >> 1
  add_interval.call(node * 2, l, mid, ql, qr, u, v) if ql <= mid
  add_interval.call(node * 2 + 1, mid + 1, r, ql, qr, u, v) if qr > mid
end

i = 0
while i < raw.length
  u = raw[i][0]; v = raw[i][1]
  depth = 0; start_t = -1
  while i < raw.length && raw[i][0] == u && raw[i][1] == v
    t = raw[i][2]; d = raw[i][4]
    if d == 1
      start_t = t if depth == 0
      depth += 1
    else
      depth -= 1
      if depth == 0 && start_t != -1 && start_t < t
        add_interval.call(1, 0, k, start_t, t - 1, u, v)
        start_t = -1
      end
    end
    i += 1
  end
  add_interval.call(1, 0, k, start_t, k, u, v) if depth > 0 && start_t != -1
end

p = (0..n).to_a
sz = Array.new(n + 1, 1)
history = []
comps = n
ans = Array.new(k + 1, 0)

find = lambda do |x|
  x = p[x] while x != p[x]
  x
end

dfs = nil
dfs = lambda do |node, l, r|
  snap = history.length
  tree[node].each do |u, v|
    ru = find.call(u); rv = find.call(v)
    if ru == rv
      history << [-1, -1]
    else
      ru, rv = rv, ru if sz[ru] > sz[rv]
      history << [ru, rv]
      p[ru] = rv; sz[rv] += sz[ru]; comps -= 1
    end
  end
  if l == r
    ans[l] = comps
  else
    mid = (l + r) >> 1
    dfs.call(node * 2, l, mid)
    dfs.call(node * 2 + 1, mid + 1, r)
  end
  while history.length > snap
    ru, rv = history.pop
    if ru != -1
      p[ru] = ru; sz[rv] -= sz[ru]; comps += 1
    end
  end
end

dfs.call(1, 0, k)
puts ans.join(" ")`,
  },
  practiceProblems: [
    {
      id: 'ch60-p1',
      tier: 'Warmup',
      ratingRange: '2000–2200',
      title: '3D Partial Order Counting via CDQ Divide & Conquer',
      statement:
        'Given `N` points in 3D space `(a_i, b_i, c_i)` (`1 <= N <= 10^5`, coordinates `-10^9 <= a_i, b_i, c_i <= 10^9`), count the total number of ordered pairs `(j, i)` with `j != i` such that `a_j <= a_i`, `b_j <= b_i`, and `c_j <= c_i`. Solve in `O(N log^2 N)` time.',
      constraints: '1 <= N <= 10^5, -10^9 <= a_i, b_i, c_i <= 10^9',
      sampleInput: `4
1 1 1
2 2 2
2 2 2
3 1 2`,
      sampleOutput: `5`,
      hints: [
        'Coordinate-compress `c_i` into `1..U`, then sort all points by `(a, b, c)` and collapse identical triples into unique elements carrying multiplicity `cnt`.',
        'Run `cdq(l, r)`: recursively solve `[l, mid]` and `[mid+1, r]`, both emerging sorted by `b`.',
        'Merge `[l, mid]` and `[mid+1, r]` by `b`: left items add `+cnt` to `BIT(c)`, right items query `BIT.sum(c)` into `ans`, then rollback ONLY touched BIT indices before finishing the `b`-sorted merge!',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

struct Triple {
    long long a, b;
    int c;
    long long cnt, ans;
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    if (!(cin >> n)) return 0;
    vector<long long> rawA(n), rawB(n), rawC(n), cs(n);
    for (int i = 0; i < n; i++) {
        cin >> rawA[i] >> rawB[i] >> rawC[i];
        cs[i] = rawC[i];
    }
    sort(cs.begin(), cs.end());
    cs.erase(unique(cs.begin(), cs.end()), cs.end());
    int U = (int)cs.size();

    vector<Triple> pts(n);
    for (int i = 0; i < n; i++) {
        int cid = (int)(lower_bound(cs.begin(), cs.end(), rawC[i]) - cs.begin()) + 1;
        pts[i] = {rawA[i], rawB[i], cid, 1, 0};
    }
    sort(pts.begin(), pts.end(), [](const Triple& x, const Triple& y) {
        if (x.a != y.a) return x.a < y.a;
        if (x.b != y.b) return x.b < y.b;
        return x.c < y.c;
    });

    vector<Triple> uniq;
    for (const auto& pt : pts) {
        if (!uniq.empty() && uniq.back().a == pt.a && uniq.back().b == pt.b && uniq.back().c == pt.c) {
            uniq.back().cnt++;
        } else {
            uniq.push_back(pt);
        }
    }

    int m = (int)uniq.size();
    vector<long long> bit(U + 1, 0);
    auto bitAdd = [&](int idx, long long val) {
        for (; idx <= U; idx += idx & -idx) bit[idx] += val;
    };
    auto bitQuery = [&](int idx) {
        long long s = 0;
        for (; idx > 0; idx -= idx & -idx) s += bit[idx];
        return s;
    };

    vector<Triple> tmp(m);
    auto cdq = [&](auto& self, int l, int r) -> void {
        if (l >= r) return;
        int mid = (l + r) >> 1;
        self(self, l, mid);
        self(self, mid + 1, r);

        int i = l, j = mid + 1, k = 0;
        vector<int> touched;
        while (i <= mid && j <= r) {
            if (uniq[i].b <= uniq[j].b) {
                bitAdd(uniq[i].c, uniq[i].cnt);
                touched.push_back(i);
                tmp[k++] = uniq[i++];
            } else {
                uniq[j].ans += bitQuery(uniq[j].c);
                tmp[k++] = uniq[j++];
            }
        }
        while (i <= mid) tmp[k++] = uniq[i++];
        while (j <= r) {
            uniq[j].ans += bitQuery(uniq[j].c);
            tmp[k++] = uniq[j++];
        }
        for (int pos : touched) bitAdd(uniq[pos].c, -uniq[pos].cnt);
        copy(tmp.begin(), tmp.begin() + k, uniq.begin() + l);
    };

    cdq(cdq, 0, m - 1);

    long long totalPairs = 0;
    for (const auto& t : uniq) {
        totalPairs += t.cnt * (t.ans + t.cnt - 1);
    }
    cout << totalPairs << "\\n";
    return 0;
}`,
        rust: `use std::io::{self, Read};

#[derive(Clone, Copy)]
struct Triple {
    a: i64,
    b: i64,
    c: usize,
    cnt: i64,
    ans: i64,
}

fn bit_add(bit: &mut [i64], mut idx: usize, val: i64) {
    while idx < bit.len() {
        bit[idx] += val;
        idx += idx & idx.wrapping_neg();
    }
}

fn bit_query(bit: &[i64], mut idx: usize) -> i64 {
    let mut s = 0;
    while idx > 0 {
        s += bit[idx];
        idx -= idx & idx.wrapping_neg();
    }
    s
}

fn cdq(pts: &mut [Triple], tmp: &mut [Triple], bit: &mut [i64]) {
    let n = pts.len();
    if n <= 1 { return; }
    let mid = n >> 1;
    cdq(&mut pts[..mid], &mut tmp[..mid], bit);
    cdq(&mut pts[mid..], &mut tmp[mid..], bit);

    let (mut i, mut j, mut k) = (0, mid, 0);
    let mut touched = Vec::with_capacity(mid);
    while i < mid && j < n {
        if pts[i].b <= pts[j].b {
            bit_add(bit, pts[i].c, pts[i].cnt);
            touched.push((pts[i].c, pts[i].cnt));
            tmp[k] = pts[i];
            i += 1;
        } else {
            pts[j].ans += bit_query(bit, pts[j].c);
            tmp[k] = pts[j];
            j += 1;
        }
        k += 1;
    }
    while i < mid { tmp[k] = pts[i]; i += 1; k += 1; }
    while j < n {
        pts[j].ans += bit_query(bit, pts[j].c);
        tmp[k] = pts[j];
        j += 1;
        k += 1;
    }
    for (c, cnt) in touched {
        bit_add(bit, c, -cnt);
    }
    pts.copy_from_slice(&tmp[..n]);
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let n: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };

    let mut raw = Vec::with_capacity(n);
    let mut cs = Vec::with_capacity(n);
    for _ in 0..n {
        let a: i64 = it.next().unwrap().parse().unwrap();
        let b: i64 = it.next().unwrap().parse().unwrap();
        let c: i64 = it.next().unwrap().parse().unwrap();
        raw.push((a, b, c));
        cs.push(c);
    }
    cs.sort_unstable();
    cs.dedup();
    let u = cs.len();

    let mut pts: Vec<Triple> = raw.into_iter().map(|(a, b, c)| Triple {
        a, b, c: cs.binary_search(&c).unwrap() + 1, cnt: 1, ans: 0
    }).collect();
    pts.sort_unstable_by(|x, y| x.a.cmp(&y.a).then(x.b.cmp(&y.b)).then(x.c.cmp(&y.c)));

    let mut uniq: Vec<Triple> = Vec::with_capacity(n);
    for pt in pts {
        if let Some(last) = uniq.last_mut() {
            if last.a == pt.a && last.b == pt.b && last.c == pt.c {
                last.cnt += 1;
                continue;
            }
        }
        uniq.push(pt);
    }

    let m = uniq.len();
    let mut tmp = vec![Triple { a: 0, b: 0, c: 0, cnt: 0, ans: 0 }; m];
    let mut bit = vec![0i64; u + 1];
    cdq(&mut uniq, &mut tmp, &mut bit);

    let total: i64 = uniq.iter().map(|t| t.cnt * (t.ans + t.cnt - 1)).sum();
    println!("{}", total);
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

    static long[] ua, ub, ucnt, uans, ta, tb, tcnt, tans, bit;
    static int[] uc, tc, touched;
    static int U;

    static void bitAdd(int idx, long val) {
        for (; idx <= U; idx += idx & -idx) bit[idx] += val;
    }

    static long bitQuery(int idx) {
        long s = 0;
        for (; idx > 0; idx -= idx & -idx) s += bit[idx];
        return s;
    }

    static void cdq(int l, int r) {
        if (l >= r) return;
        int mid = (l + r) >>> 1;
        cdq(l, mid);
        cdq(mid + 1, r);

        int i = l, j = mid + 1, k = 0, tTop = 0;
        while (i <= mid && j <= r) {
            if (ub[i] <= ub[j]) {
                bitAdd(uc[i], ucnt[i]);
                touched[tTop++] = i;
                ta[k] = ua[i]; tb[k] = ub[i]; tc[k] = uc[i]; tcnt[k] = ucnt[i]; tans[k] = uans[i];
                i++; k++;
            } else {
                uans[j] += bitQuery(uc[j]);
                ta[k] = ua[j]; tb[k] = ub[j]; tc[k] = uc[j]; tcnt[k] = ucnt[j]; tans[k] = uans[j];
                j++; k++;
            }
        }
        while (i <= mid) {
            ta[k] = ua[i]; tb[k] = ub[i]; tc[k] = uc[i]; tcnt[k] = ucnt[i]; tans[k] = uans[i];
            i++; k++;
        }
        while (j <= r) {
            uans[j] += bitQuery(uc[j]);
            ta[k] = ua[j]; tb[k] = ub[j]; tc[k] = uc[j]; tcnt[k] = ucnt[j]; tans[k] = uans[j];
            j++; k++;
        }
        for (int p = 0; p < tTop; p++) bitAdd(uc[touched[p]], -ucnt[touched[p]]);
        for (int p = 0; p < k; p++) {
            ua[l + p] = ta[p]; ub[l + p] = tb[p]; uc[l + p] = tc[p]; ucnt[l + p] = tcnt[p]; uans[l + p] = tans[p];
        }
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        long nLong = fs.nextLong();
        if (nLong == Long.MIN_VALUE) return;
        int n = (int) nLong;

        long[][] raw = new long[n][3];
        long[] cs = new long[n];
        for (int i = 0; i < n; i++) {
            raw[i][0] = fs.nextLong();
            raw[i][1] = fs.nextLong();
            raw[i][2] = fs.nextLong();
            cs[i] = raw[i][2];
        }
        Arrays.sort(cs);
        U = 0;
        for (int i = 0; i < n; i++) if (i == 0 || cs[i] != cs[i - 1]) cs[U++] = cs[i];

        for (int i = 0; i < n; i++) raw[i][2] = Arrays.binarySearch(cs, 0, U, raw[i][2]) + 1;
        Arrays.sort(raw, (x, y) -> x[0] != y[0] ? Long.compare(x[0], y[0])
                : (x[1] != y[1] ? Long.compare(x[1], y[1]) : Long.compare(x[2], y[2])));

        ua = new long[n]; ub = new long[n]; ucnt = new long[n]; uans = new long[n]; uc = new int[n];
        int m = 0;
        for (int i = 0; i < n; i++) {
            if (m > 0 && ua[m - 1] == raw[i][0] && ub[m - 1] == raw[i][1] && uc[m - 1] == (int) raw[i][2]) {
                ucnt[m - 1]++;
            } else {
                ua[m] = raw[i][0]; ub[m] = raw[i][1]; uc[m] = (int) raw[i][2]; ucnt[m] = 1;
                m++;
            }
        }

        ta = new long[m]; tb = new long[m]; tcnt = new long[m]; tans = new long[m]; tc = new int[m];
        touched = new int[m]; bit = new long[U + 1];
        cdq(0, m - 1);

        long total = 0;
        for (int i = 0; i < m; i++) total += ucnt[i] * (uans[i] + ucnt[i] - 1);
        System.out.println(total);
    }
}`,
        python3: `import sys
from bisect import bisect_left

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    raw = []
    cs = []
    idx = 1
    for _ in range(n):
        a = int(data[idx]); b = int(data[idx + 1]); c = int(data[idx + 2])
        idx += 3
        raw.append((a, b, c))
        cs.append(c)

    cs = sorted(set(cs))
    U = len(cs)
    pts = sorted((a, b, bisect_left(cs, c) + 1) for a, b, c in raw)

    # [a, b, c, cnt, ans]
    uniq = []
    for a, b, c in pts:
        if uniq and uniq[-1][0] == a and uniq[-1][1] == b and uniq[-1][2] == c:
            uniq[-1][3] += 1
        else:
            uniq.append([a, b, c, 1, 0])

    bit = [0] * (U + 1)
    def bit_add(p: int, v: int) -> None:
        while p <= U:
            bit[p] += v
            p += p & -p

    def bit_query(p: int) -> int:
        s = 0
        while p > 0:
            s += bit[p]
            p -= p & -p
        return s

    def cdq(l: int, r: int) -> None:
        if l >= r:
            return
        mid = (l + r) >> 1
        cdq(l, mid)
        cdq(mid + 1, r)

        i, j = l, mid + 1
        merged = []
        touched = []
        while i <= mid and j <= r:
            if uniq[i][1] <= uniq[j][1]:
                bit_add(uniq[i][2], uniq[i][3])
                touched.append((uniq[i][2], uniq[i][3]))
                merged.append(uniq[i])
                i += 1
            else:
                uniq[j][4] += bit_query(uniq[j][2])
                merged.append(uniq[j])
                j += 1
        while i <= mid:
            merged.append(uniq[i]); i += 1
        while j <= r:
            uniq[j][4] += bit_query(uniq[j][2])
            merged.append(uniq[j]); j += 1
        for c_idx, c_val in touched:
            bit_add(c_idx, -c_val)
        uniq[l:r + 1] = merged

    cdq(0, len(uniq) - 1)
    total = sum(t[3] * (t[4] + t[3] - 1) for t in uniq)
    sys.stdout.write(f"{total}\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
n = tokens[0].to_i

raw = []
cs = []
idx = 1
n.times do
  a = tokens[idx].to_i; b = tokens[idx + 1].to_i; c = tokens[idx + 2].to_i
  idx += 3
  raw << [a, b, c]
  cs << c
end

cs = cs.uniq.sort
u = cs.length
pts = raw.map { |a, b, c| [a, b, cs.bsearch_index { |v| v >= c } + 1] }.sort

uniq = []
pts.each do |a, b, c|
  if !uniq.empty? && uniq[-1][0] == a && uniq[-1][1] == b && uniq[-1][2] == c
    uniq[-1][3] += 1
  else
    uniq << [a, b, c, 1, 0]
  end
end

bit = Array.new(u + 1, 0)
bit_add = lambda do |p, v|
  while p <= u
    bit[p] += v
    p += p & -p
  end
end
bit_query = lambda do |p|
  s = 0
  while p > 0
    s += bit[p]
    p -= p & -p
  end
  s
end

cdq = nil
cdq = lambda do |l, r|
  return if l >= r
  mid = (l + r) >> 1
  cdq.call(l, mid)
  cdq.call(mid + 1, r)

  i = l; j = mid + 1
  merged = []
  touched = []
  while i <= mid && j <= r
    if uniq[i][1] <= uniq[j][1]
      bit_add.call(uniq[i][2], uniq[i][3])
      touched << [uniq[i][2], uniq[i][3]]
      merged << uniq[i]; i += 1
    else
      uniq[j][4] += bit_query.call(uniq[j][2])
      merged << uniq[j]; j += 1
    end
  end
  while i <= mid; merged << uniq[i]; i += 1; end
  while j <= r
    uniq[j][4] += bit_query.call(uniq[j][2])
    merged << uniq[j]; j += 1
  end
  touched.each { |c_idx, c_val| bit_add.call(c_idx, -c_val) }
  uniq[l..r] = merged
end

cdq.call(0, uniq.length - 1)
puts uniq.sum { |t| t[3] * (t[4] + t[3] - 1) }`,
      },
    },
    {
      id: 'ch60-p2',
      tier: 'Standard',
      ratingRange: '2200–2400',
      title: 'Dynamic Graph Connectivity Offline (Segment Tree Over Time)',
      statement:
        'An undirected graph starts with `N` vertices (`1 <= N <= 10^5`) and `M` initial edges (`0 <= M <= 10^5`). Process `K` events (`1 <= K <= 10^5`): `1 u v` adds edge `(u, v)`, `2 u v` removes edge `(u, v)`. Print `K + 1` integers denoting the number of connected components initially (`t = 0`) and after each event (`t = 1..K`).',
      constraints: '1 <= N <= 10^5, 0 <= M, K <= 10^5',
      sampleInput: `5 3 3
1 2
2 3
4 5
1 3 4
2 2 3
2 1 2`,
      sampleOutput: `2 1 2 3`,
      hints: [
        'Collect every edge creation (`t = 0..K`) and deletion (`t = 1..K`), normalize `u < v`, and sort by `(u, v, t)` to emit disjoint active intervals `[t_start, t_end - 1]`.',
        'Insert each edge interval into `O(log K)` nodes of a Segment Tree spanning `[0, K]`.',
        'DFS the Segment Tree top-down using an Undoable Union-by-Size DSU (NO path compression!), recording `dsu.comps` at every leaf and popping merges on exit.',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, m, k;
    if (!(cin >> n >> m >> k)) return 0;

    struct Ev { int u, v, t, d; };
    vector<Ev> evs;
    evs.reserve(m + k);
    for (int i = 0; i < m; i++) {
        int u, v;
        cin >> u >> v;
        if (u > v) swap(u, v);
        evs.push_back({u, v, 0, 1});
    }
    for (int t = 1; t <= k; t++) {
        int typ, u, v;
        cin >> typ >> u >> v;
        if (u > v) swap(u, v);
        evs.push_back({u, v, t, typ == 1 ? 1 : -1});
    }
    sort(evs.begin(), evs.end(), [](const Ev& a, const Ev& b) {
        if (a.u != b.u) return a.u < b.u;
        if (a.v != b.v) return a.v < b.v;
        if (a.t != b.t) return a.t < b.t;
        return a.d > b.d;
    });

    vector<vector<pair<int, int>>> tree(4 * (k + 1));
    auto insertEdge = [&](auto& self, int node, int l, int r, int ql, int qr, int u, int v) -> void {
        if (ql <= l && r <= qr) { tree[node].push_back({u, v}); return; }
        int mid = (l + r) >> 1;
        if (ql <= mid) self(self, node * 2, l, mid, ql, qr, u, v);
        if (qr > mid) self(self, node * 2 + 1, mid + 1, r, ql, qr, u, v);
    };

    for (int i = 0; i < (int)evs.size(); ) {
        int u = evs[i].u, v = evs[i].v, dep = 0, st = -1;
        while (i < (int)evs.size() && evs[i].u == u && evs[i].v == v) {
            if (evs[i].d == 1) { if (dep++ == 0) st = evs[i].t; }
            else if (--dep == 0 && st != -1 && st < evs[i].t) {
                insertEdge(insertEdge, 1, 0, k, st, evs[i].t - 1, u, v);
                st = -1;
            }
            i++;
        }
        if (dep > 0 && st != -1) insertEdge(insertEdge, 1, 0, k, st, k, u, v);
    }

    vector<int> p(n + 1), sz(n + 1, 1), ans(k + 1);
    iota(p.begin(), p.end(), 0);
    int comps = n;
    vector<pair<int, int>> hist;

    auto findRoot = [&](int x) { while (x != p[x]) x = p[x]; return x; };
    auto dfs = [&](auto& self, int node, int l, int r) -> void {
        size_t snap = hist.size();
        for (auto [u, v] : tree[node]) {
            int ru = findRoot(u), rv = findRoot(v);
            if (ru == rv) hist.push_back({-1, -1});
            else {
                if (sz[ru] > sz[rv]) swap(ru, rv);
                hist.push_back({ru, rv});
                p[ru] = rv; sz[rv] += sz[ru]; comps--;
            }
        }
        if (l == r) ans[l] = comps;
        else {
            int mid = (l + r) >> 1;
            self(self, node * 2, l, mid);
            self(self, node * 2 + 1, mid + 1, r);
        }
        while (hist.size() > snap) {
            auto [ru, rv] = hist.back(); hist.pop_back();
            if (ru != -1) { p[ru] = ru; sz[rv] -= sz[ru]; comps++; }
        }
    };
    dfs(dfs, 1, 0, k);
    for (int t = 0; t <= k; t++) cout << ans[t] << (t == k ? '\\n' : ' ');
    return 0;
}`,
        rust: `use std::io::{self, Read};

fn add_edge(tree: &mut [Vec<(usize, usize)>], node: usize, l: usize, r: usize, ql: usize, qr: usize, u: usize, v: usize) {
    if ql <= l && r <= qr { tree[node].push((u, v)); return; }
    let mid = (l + r) >> 1;
    if ql <= mid { add_edge(tree, node * 2, l, mid, ql, qr, u, v); }
    if qr > mid { add_edge(tree, node * 2 + 1, mid + 1, r, ql, qr, u, v); }
}

fn find(p: &[usize], mut x: usize) -> usize {
    while x != p[x] { x = p[x]; }
    x
}

fn dfs(
    tree: &[Vec<(usize, usize)>], p: &mut [usize], sz: &mut [usize],
    hist: &mut Vec<(usize, usize)>, comps: &mut usize, ans: &mut [usize],
    node: usize, l: usize, r: usize
) {
    let snap = hist.len();
    for &(u, v) in &tree[node] {
        let mut ru = find(p, u);
        let mut rv = find(p, v);
        if ru == rv { hist.push((0, 0)); }
        else {
            if sz[ru] > sz[rv] { std::mem::swap(&mut ru, &mut rv); }
            hist.push((ru, rv));
            p[ru] = rv; sz[rv] += sz[ru]; *comps -= 1;
        }
    }
    if l == r { ans[l] = *comps; }
    else {
        let mid = (l + r) >> 1;
        dfs(tree, p, sz, hist, comps, ans, node * 2, l, mid);
        dfs(tree, p, sz, hist, comps, ans, node * 2 + 1, mid + 1, r);
    }
    while hist.len() > snap {
        let (ru, rv) = hist.pop().unwrap();
        if ru != 0 { p[ru] = ru; sz[rv] -= sz[ru]; *comps += 1; }
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

    let mut evs = Vec::with_capacity(m + k);
    for _ in 0..m {
        let (mut u, mut v): (usize, usize) = (it.next().unwrap().parse().unwrap(), it.next().unwrap().parse().unwrap());
        if u > v { std::mem::swap(&mut u, &mut v); }
        evs.push((u, v, 0usize, 1i32));
    }
    for t in 1..=k {
        let typ: usize = it.next().unwrap().parse().unwrap();
        let (mut u, mut v): (usize, usize) = (it.next().unwrap().parse().unwrap(), it.next().unwrap().parse().unwrap());
        if u > v { std::mem::swap(&mut u, &mut v); }
        evs.push((u, v, t, if typ == 1 { 1 } else { -1 }));
    }
    evs.sort_unstable_by(|a, b| a.0.cmp(&b.0).then(a.1.cmp(&b.1)).then(a.2.cmp(&b.2)).then(b.3.cmp(&a.3)));

    let mut tree = vec![Vec::new(); 4 * (k + 1)];
    let mut i = 0;
    while i < evs.len() {
        let (u, v) = (evs[i].0, evs[i].1);
        let (mut dep, mut st, mut active) = (0i32, 0usize, false);
        while i < evs.len() && evs[i].0 == u && evs[i].1 == v {
            if evs[i].3 == 1 {
                if dep == 0 { st = evs[i].2; active = true; }
                dep += 1;
            } else {
                dep -= 1;
                if dep == 0 && active && st < evs[i].2 {
                    add_edge(&mut tree, 1, 0, k, st, evs[i].2 - 1, u, v);
                    active = false;
                }
            }
            i += 1;
        }
        if dep > 0 && active { add_edge(&mut tree, 1, 0, k, st, k, u, v); }
    }

    let mut p: Vec<usize> = (0..=n).collect();
    let mut sz = vec![1usize; n + 1];
    let mut hist = Vec::new();
    let mut comps = n;
    let mut ans = vec![0usize; k + 1];
    dfs(&tree, &mut p, &mut sz, &mut hist, &mut comps, &mut ans, 1, 0, k);
    let out: Vec<String> = ans.iter().map(|c| c.to_string()).collect();
    println!("{}", out.join(" "));
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

    static int[] p, sz, hu, hv, ans;
    static int hTop = 0, comps;
    static List<int[]>[] tree;

    static int find(int x) { while (x != p[x]) x = p[x]; return x; }

    static void addEdge(int node, int l, int r, int ql, int qr, int u, int v) {
        if (ql <= l && r <= qr) { tree[node].add(new int[]{u, v}); return; }
        int mid = (l + r) >>> 1;
        if (ql <= mid) addEdge(node * 2, l, mid, ql, qr, u, v);
        if (qr > mid) addEdge(node * 2 + 1, mid + 1, r, ql, qr, u, v);
    }

    static void dfs(int node, int l, int r) {
        int snap = hTop;
        for (int[] e : tree[node]) {
            int ru = find(e[0]), rv = find(e[1]);
            if (ru == rv) { hu[hTop] = -1; hv[hTop] = -1; hTop++; }
            else {
                if (sz[ru] > sz[rv]) { int t = ru; ru = rv; rv = t; }
                hu[hTop] = ru; hv[hTop] = rv; hTop++;
                p[ru] = rv; sz[rv] += sz[ru]; comps--;
            }
        }
        if (l == r) ans[l] = comps;
        else {
            int mid = (l + r) >>> 1;
            dfs(node * 2, l, mid);
            dfs(node * 2 + 1, mid + 1, r);
        }
        while (hTop > snap) {
            hTop--;
            if (hu[hTop] != -1) {
                p[hu[hTop]] = hu[hTop];
                sz[hv[hTop]] -= sz[hu[hTop]];
                comps++;
            }
        }
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        long nLong = fs.nextLong();
        if (nLong == Long.MIN_VALUE) return;
        int n = (int) nLong, m = (int) fs.nextLong(), k = (int) fs.nextLong();

        int[][] evs = new int[m + k][4];
        for (int i = 0; i < m; i++) {
            int u = (int) fs.nextLong(), v = (int) fs.nextLong();
            if (u > v) { int t = u; u = v; v = t; }
            evs[i] = new int[]{u, v, 0, 1};
        }
        for (int t = 1; t <= k; t++) {
            int typ = (int) fs.nextLong(), u = (int) fs.nextLong(), v = (int) fs.nextLong();
            if (u > v) { int tmp = u; u = v; v = tmp; }
            evs[m + t - 1] = new int[]{u, v, t, typ == 1 ? 1 : -1};
        }
        Arrays.sort(evs, (a, b) -> a[0] != b[0] ? Integer.compare(a[0], b[0])
                : (a[1] != b[1] ? Integer.compare(a[1], b[1])
                : (a[2] != b[2] ? Integer.compare(a[2], b[2]) : Integer.compare(b[3], a[3]))));

        tree = new ArrayList[4 * (k + 1)];
        for (int i = 0; i < tree.length; i++) tree[i] = new ArrayList<>();
        for (int i = 0; i < evs.length; ) {
            int u = evs[i][0], v = evs[i][1], dep = 0, st = -1;
            while (i < evs.length && evs[i][0] == u && evs[i][1] == v) {
                if (evs[i][3] == 1) { if (dep++ == 0) st = evs[i][2]; }
                else if (--dep == 0 && st != -1 && st < evs[i][2]) {
                    addEdge(1, 0, k, st, evs[i][2] - 1, u, v);
                    st = -1;
                }
                i++;
            }
            if (dep > 0 && st != -1) addEdge(1, 0, k, st, k, u, v);
        }

        p = new int[n + 1]; sz = new int[n + 1];
        for (int i = 1; i <= n; i++) { p[i] = i; sz[i] = 1; }
        comps = n;
        hu = new int[(m + k + 5) * 20]; hv = new int[(m + k + 5) * 20];
        ans = new int[k + 1];
        dfs(1, 0, k);

        StringBuilder sb = new StringBuilder();
        for (int t = 0; t <= k; t++) {
            if (t > 0) sb.append(' ');
            sb.append(ans[t]);
        }
        System.out.println(sb.toString());
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
    k = int(data[2])
    evs = []
    idx = 3
    for _ in range(m):
        u = int(data[idx]); v = int(data[idx + 1])
        idx += 2
        if u > v: u, v = v, u
        evs.append((u, v, 0, -1, 1))
    for t in range(1, k + 1):
        typ = int(data[idx]); u = int(data[idx + 1]); v = int(data[idx + 2])
        idx += 3
        if u > v: u, v = v, u
        d = 1 if typ == 1 else -1
        evs.append((u, v, t, -d, d))
    evs.sort()

    tree = [[] for _ in range(4 * (k + 1))]
    def add_edge(node: int, l: int, r: int, ql: int, qr: int, u: int, v: int) -> None:
        if ql <= l and r <= qr:
            tree[node].append((u, v))
            return
        mid = (l + r) >> 1
        if ql <= mid: add_edge(node * 2, l, mid, ql, qr, u, v)
        if qr > mid: add_edge(node * 2 + 1, mid + 1, r, ql, qr, u, v)

    i = 0
    while i < len(evs):
        u, v = evs[i][0], evs[i][1]
        dep = 0; st = -1
        while i < len(evs) and evs[i][0] == u and evs[i][1] == v:
            _, _, t, _, d = evs[i]
            if d == 1:
                if dep == 0: st = t
                dep += 1
            else:
                dep -= 1
                if dep == 0 and st != -1 and st < t:
                    add_edge(1, 0, k, st, t - 1, u, v)
                    st = -1
            i += 1
        if dep > 0 and st != -1:
            add_edge(1, 0, k, st, k, u, v)

    p = list(range(n + 1))
    sz = [1] * (n + 1)
    hist = []
    comps = n
    ans = [0] * (k + 1)

    def find(x: int) -> int:
        while x != p[x]: x = p[x]
        return x

    def dfs(node: int, l: int, r: int) -> None:
        nonlocal comps
        snap = len(hist)
        for u, v in tree[node]:
            ru, rv = find(u), find(v)
            if ru == rv:
                hist.append((-1, -1))
            else:
                if sz[ru] > sz[rv]: ru, rv = rv, ru
                hist.append((ru, rv))
                p[ru] = rv; sz[rv] += sz[ru]; comps -= 1
        if l == r:
            ans[l] = comps
        else:
            mid = (l + r) >> 1
            dfs(node * 2, l, mid)
            dfs(node * 2 + 1, mid + 1, r)
        while len(hist) > snap:
            ru, rv = hist.pop()
            if ru != -1:
                p[ru] = ru; sz[rv] -= sz[ru]; comps += 1

    dfs(1, 0, k)
    sys.stdout.write(" ".join(map(str, ans)) + "\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
n = tokens[0].to_i; m = tokens[1].to_i; k = tokens[2].to_i
evs = []; idx = 3
m.times do
  u = tokens[idx].to_i; v = tokens[idx + 1].to_i; idx += 2
  u, v = v, u if u > v
  evs << [u, v, 0, -1, 1]
end
(1..k).each do |t|
  typ = tokens[idx].to_i; u = tokens[idx + 1].to_i; v = tokens[idx + 2].to_i; idx += 3
  u, v = v, u if u > v
  d = typ == 1 ? 1 : -1
  evs << [u, v, t, -d, d]
end
evs.sort!

tree = Array.new(4 * (k + 1)) { [] }
add_edge = nil
add_edge = lambda do |node, l, r, ql, qr, u, v|
  if ql <= l && r <= qr; tree[node] << [u, v]; return; end
  mid = (l + r) >> 1
  add_edge.call(node * 2, l, mid, ql, qr, u, v) if ql <= mid
  add_edge.call(node * 2 + 1, mid + 1, r, ql, qr, u, v) if qr > mid
end

i = 0
while i < evs.length
  u = evs[i][0]; v = evs[i][1]; dep = 0; st = -1
  while i < evs.length && evs[i][0] == u && evs[i][1] == v
    t = evs[i][2]; d = evs[i][4]
    if d == 1; st = t if dep == 0; dep += 1
    else
      dep -= 1
      if dep == 0 && st != -1 && st < t; add_edge.call(1, 0, k, st, t - 1, u, v); st = -1; end
    end
    i += 1
  end
  add_edge.call(1, 0, k, st, k, u, v) if dep > 0 && st != -1
end

p = (0..n).to_a; sz = Array.new(n + 1, 1); hist = []; comps = n; ans = Array.new(k + 1, 0)
find = lambda { |x| x = p[x] while x != p[x]; x }
dfs = nil
dfs = lambda do |node, l, r|
  snap = hist.length
  tree[node].each do |u, v|
    ru = find.call(u); rv = find.call(v)
    if ru == rv; hist << [-1, -1]
    else
      ru, rv = rv, ru if sz[ru] > sz[rv]
      hist << [ru, rv]; p[ru] = rv; sz[rv] += sz[ru]; comps -= 1
    end
  end
  if l == r; ans[l] = comps
  else
    mid = (l + r) >> 1; dfs.call(node * 2, l, mid); dfs.call(node * 2 + 1, mid + 1, r)
  end
  while hist.length > snap
    ru, rv = hist.pop
    if ru != -1; p[ru] = ru; sz[rv] -= sz[ru]; comps += 1; end
  end
end
dfs.call(1, 0, k)
puts ans.join(" ")`,
      },
    },
    {
      id: 'ch60-p3',
      tier: 'Boss',
      ratingRange: '2400–2600',
      title: 'Dynamic Bipartiteness Check with Edge Deletions (Parity Rollback DSU)',
      statement:
        'Start with an empty graph on `N` vertices (`1 <= N <= 10^5`). Process `Q` sequential operations (`1 <= Q <= 10^5`): `1 u v` adds edge `(u, v)`; `2 u v` deletes an active edge `(u, v)`. After EVERY operation `1..Q`, output `YES` if the current graph is bipartite (2-colorable) and `NO` otherwise.',
      constraints: '1 <= N, Q <= 10^5, 1 <= u, v <= N',
      sampleInput: `4 5
1 1 2
1 2 3
1 1 3
2 1 2
1 3 4`,
      sampleOutput: `YES
YES
NO
YES
YES`,
      hints: [
        'Track edge lifespans over `[1, Q]` inside a Segment Tree over Time just like offline connectivity.',
        'Upgrade Rollback DSU with a `parity[x]` array storing XOR distance from `x` to `parent[x]` (`0` = same color, `1` = opposite color).',
        'On `unite(u, v)`: walk up without path compression accumulating `pu`, `pv`. If `ru == rv` and `pu == pv`, increment `oddCycles` (contradiction!); otherwise attach smaller `ru` under `rv` with `parity[ru] = pu ^ pv ^ 1`. Output `YES` iff `oddCycles == 0`.',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, q;
    if (!(cin >> n >> q)) return 0;

    struct Ev { int u, v, t, d; };
    vector<Ev> evs;
    evs.reserve(q);
    for (int t = 1; t <= q; t++) {
        int typ, u, v;
        cin >> typ >> u >> v;
        if (u > v) swap(u, v);
        evs.push_back({u, v, t, typ == 1 ? 1 : -1});
    }
    sort(evs.begin(), evs.end(), [](const Ev& a, const Ev& b) {
        if (a.u != b.u) return a.u < b.u;
        if (a.v != b.v) return a.v < b.v;
        if (a.t != b.t) return a.t < b.t;
        return a.d > b.d;
    });

    vector<vector<pair<int, int>>> tree(4 * (q + 1));
    auto insertEdge = [&](auto& self, int node, int l, int r, int ql, int qr, int u, int v) -> void {
        if (ql <= l && r <= qr) { tree[node].push_back({u, v}); return; }
        int mid = (l + r) >> 1;
        if (ql <= mid) self(self, node * 2, l, mid, ql, qr, u, v);
        if (qr > mid) self(self, node * 2 + 1, mid + 1, r, ql, qr, u, v);
    };

    for (int i = 0; i < (int)evs.size(); ) {
        int u = evs[i].u, v = evs[i].v, dep = 0, st = -1;
        while (i < (int)evs.size() && evs[i].u == u && evs[i].v == v) {
            if (evs[i].d == 1) { if (dep++ == 0) st = evs[i].t; }
            else if (--dep == 0 && st != -1 && st < evs[i].t) {
                insertEdge(insertEdge, 1, 1, q, st, evs[i].t - 1, u, v);
                st = -1;
            }
            i++;
        }
        if (dep > 0 && st != -1) insertEdge(insertEdge, 1, 1, q, st, q, u, v);
    }

    vector<int> p(n + 1), sz(n + 1, 1), par(n + 1, 0);
    iota(p.begin(), p.end(), 0);
    struct Roll { int ru, rv, prevOdd; };
    vector<Roll> hist;
    int oddCycles = 0;

    auto findPar = [&](int x) -> pair<int, int> {
        int c = 0;
        while (x != p[x]) {
            c ^= par[x];
            x = p[x];
        }
        return {x, c};
    };

    vector<bool> ans(q + 1, true);
    auto dfs = [&](auto& self, int node, int l, int r) -> void {
        size_t snap = hist.size();
        for (auto [u, v] : tree[node]) {
            auto [ru, pu] = findPar(u);
            auto [rv, pv] = findPar(v);
            if (ru == rv) {
                hist.push_back({-1, -1, oddCycles});
                if (pu == pv) oddCycles++;
            } else {
                if (sz[ru] > sz[rv]) { swap(ru, rv); swap(pu, pv); }
                hist.push_back({ru, rv, oddCycles});
                p[ru] = rv;
                par[ru] = pu ^ pv ^ 1;
                sz[rv] += sz[ru];
            }
        }
        if (l == r) {
            ans[l] = (oddCycles == 0);
        } else {
            int mid = (l + r) >> 1;
            self(self, node * 2, l, mid);
            self(self, node * 2 + 1, mid + 1, r);
        }
        while (hist.size() > snap) {
            auto rb = hist.back(); hist.pop_back();
            oddCycles = rb.prevOdd;
            if (rb.ru != -1) {
                p[rb.ru] = rb.ru;
                par[rb.ru] = 0;
                sz[rb.rv] -= sz[rb.ru];
            }
        }
    };
    dfs(dfs, 1, 1, q);

    for (int t = 1; t <= q; t++) cout << (ans[t] ? "YES\\n" : "NO\\n");
    return 0;
}`,
        rust: `use std::io::{self, Read};

fn add_edge(tree: &mut [Vec<(usize, usize)>], node: usize, l: usize, r: usize, ql: usize, qr: usize, u: usize, v: usize) {
    if ql <= l && r <= qr { tree[node].push((u, v)); return; }
    let mid = (l + r) >> 1;
    if ql <= mid { add_edge(tree, node * 2, l, mid, ql, qr, u, v); }
    if qr > mid { add_edge(tree, node * 2 + 1, mid + 1, r, ql, qr, u, v); }
}

fn find_par(p: &[usize], par: &[u8], mut x: usize) -> (usize, u8) {
    let mut c = 0u8;
    while x != p[x] {
        c ^= par[x];
        x = p[x];
    }
    (x, c)
}

fn dfs(
    tree: &[Vec<(usize, usize)>], p: &mut [usize], sz: &mut [usize], par: &mut [u8],
    hist: &mut Vec<(usize, usize, usize)>, odd: &mut usize, ans: &mut [bool],
    node: usize, l: usize, r: usize
) {
    let snap = hist.len();
    for &(u, v) in &tree[node] {
        let (mut ru, pu) = find_par(p, par, u);
        let (mut rv, pv) = find_par(p, par, v);
        if ru == rv {
            hist.push((0, 0, *odd));
            if pu == pv { *odd += 1; }
        } else {
            if sz[ru] > sz[rv] { std::mem::swap(&mut ru, &mut rv); }
            hist.push((ru, rv, *odd));
            p[ru] = rv;
            par[ru] = pu ^ pv ^ 1;
            sz[rv] += sz[ru];
        }
    }
    if l == r {
        ans[l] = *odd == 0;
    } else {
        let mid = (l + r) >> 1;
        dfs(tree, p, sz, par, hist, odd, ans, node * 2, l, mid);
        dfs(tree, p, sz, par, hist, odd, ans, node * 2 + 1, mid + 1, r);
    }
    while hist.len() > snap {
        let (ru, rv, prev_odd) = hist.pop().unwrap();
        *odd = prev_odd;
        if ru != 0 {
            p[ru] = ru;
            par[ru] = 0;
            sz[rv] -= sz[ru];
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
    let q: usize = it.next().unwrap().parse().unwrap();

    let mut evs = Vec::with_capacity(q);
    for t in 1..=q {
        let typ: usize = it.next().unwrap().parse().unwrap();
        let (mut u, mut v): (usize, usize) = (it.next().unwrap().parse().unwrap(), it.next().unwrap().parse().unwrap());
        if u > v { std::mem::swap(&mut u, &mut v); }
        evs.push((u, v, t, if typ == 1 { 1i32 } else { -1i32 }));
    }
    evs.sort_unstable_by(|a, b| a.0.cmp(&b.0).then(a.1.cmp(&b.1)).then(a.2.cmp(&b.2)).then(b.3.cmp(&a.3)));

    let mut tree = vec![Vec::new(); 4 * (q + 1)];
    let mut i = 0;
    while i < evs.len() {
        let (u, v) = (evs[i].0, evs[i].1);
        let (mut dep, mut st, mut active) = (0i32, 0usize, false);
        while i < evs.len() && evs[i].0 == u && evs[i].1 == v {
            if evs[i].3 == 1 {
                if dep == 0 { st = evs[i].2; active = true; }
                dep += 1;
            } else {
                dep -= 1;
                if dep == 0 && active && st < evs[i].2 {
                    add_edge(&mut tree, 1, 1, q, st, evs[i].2 - 1, u, v);
                    active = false;
                }
            }
            i += 1;
        }
        if dep > 0 && active { add_edge(&mut tree, 1, 1, q, st, q, u, v); }
    }

    let mut p: Vec<usize> = (0..=n).collect();
    let mut sz = vec![1usize; n + 1];
    let mut par = vec![0u8; n + 1];
    let mut hist = Vec::new();
    let mut odd = 0usize;
    let mut ans = vec![true; q + 1];
    dfs(&tree, &mut p, &mut sz, &mut par, &mut hist, &mut odd, &mut ans, 1, 1, q);

    let mut out = String::new();
    for t in 1..=q {
        out.push_str(if ans[t] { "YES\n" } else { "NO\n" });
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

    static int[] p, sz, par, hRu, hRv, hOdd;
    static int hTop = 0, oddCycles = 0;
    static boolean[] ans;
    static List<int[]>[] tree;

    static void addEdge(int node, int l, int r, int ql, int qr, int u, int v) {
        if (ql <= l && r <= qr) { tree[node].add(new int[]{u, v}); return; }
        int mid = (l + r) >>> 1;
        if (ql <= mid) addEdge(node * 2, l, mid, ql, qr, u, v);
        if (qr > mid) addEdge(node * 2 + 1, mid + 1, r, ql, qr, u, v);
    }

    static void dfs(int node, int l, int r) {
        int snap = hTop;
        for (int[] e : tree[node]) {
            int u = e[0], v = e[1];
            int pu = 0, pv = 0;
            while (u != p[u]) { pu ^= par[u]; u = p[u]; }
            while (v != p[v]) { pv ^= par[v]; v = p[v]; }
            if (u == v) {
                hRu[hTop] = -1; hRv[hTop] = -1; hOdd[hTop] = oddCycles; hTop++;
                if (pu == pv) oddCycles++;
            } else {
                if (sz[u] > sz[v]) { int t = u; u = v; v = t; }
                hRu[hTop] = u; hRv[hTop] = v; hOdd[hTop] = oddCycles; hTop++;
                p[u] = v; par[u] = pu ^ pv ^ 1; sz[v] += sz[u];
            }
        }
        if (l == r) ans[l] = (oddCycles == 0);
        else {
            int mid = (l + r) >>> 1;
            dfs(node * 2, l, mid);
            dfs(node * 2 + 1, mid + 1, r);
        }
        while (hTop > snap) {
            hTop--;
            oddCycles = hOdd[hTop];
            if (hRu[hTop] != -1) {
                p[hRu[hTop]] = hRu[hTop];
                par[hRu[hTop]] = 0;
                sz[hRv[hTop]] -= sz[hRu[hTop]];
            }
        }
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        long nLong = fs.nextLong();
        if (nLong == Long.MIN_VALUE) return;
        int n = (int) nLong, q = (int) fs.nextLong();

        int[][] evs = new int[q][4];
        for (int t = 1; t <= q; t++) {
            int typ = (int) fs.nextLong(), u = (int) fs.nextLong(), v = (int) fs.nextLong();
            if (u > v) { int tmp = u; u = v; v = tmp; }
            evs[t - 1] = new int[]{u, v, t, typ == 1 ? 1 : -1};
        }
        Arrays.sort(evs, (a, b) -> a[0] != b[0] ? Integer.compare(a[0], b[0])
                : (a[1] != b[1] ? Integer.compare(a[1], b[1])
                : (a[2] != b[2] ? Integer.compare(a[2], b[2]) : Integer.compare(b[3], a[3]))));

        tree = new ArrayList[4 * (q + 1)];
        for (int i = 0; i < tree.length; i++) tree[i] = new ArrayList<>();
        for (int i = 0; i < q; ) {
            int u = evs[i][0], v = evs[i][1], dep = 0, st = -1;
            while (i < q && evs[i][0] == u && evs[i][1] == v) {
                if (evs[i][3] == 1) { if (dep++ == 0) st = evs[i][2]; }
                else if (--dep == 0 && st != -1 && st < evs[i][2]) {
                    addEdge(1, 1, q, st, evs[i][2] - 1, u, v);
                    st = -1;
                }
                i++;
            }
            if (dep > 0 && st != -1) addEdge(1, 1, q, st, q, u, v);
        }

        p = new int[n + 1]; sz = new int[n + 1]; par = new int[n + 1];
        for (int i = 1; i <= n; i++) { p[i] = i; sz[i] = 1; }
        int cap = (q + 5) * 20;
        hRu = new int[cap]; hRv = new int[cap]; hOdd = new int[cap];
        ans = new boolean[q + 1];
        dfs(1, 1, q);

        StringBuilder sb = new StringBuilder();
        for (int t = 1; t <= q; t++) sb.append(ans[t] ? "YES\\n" : "NO\\n");
        System.out.print(sb.toString());
    }
}`,
        python3: `import sys

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    q = int(data[1])
    evs = []
    idx = 2
    for t in range(1, q + 1):
        typ = int(data[idx]); u = int(data[idx + 1]); v = int(data[idx + 2])
        idx += 3
        if u > v: u, v = v, u
        d = 1 if typ == 1 else -1
        evs.append((u, v, t, -d, d))
    evs.sort()

    tree = [[] for _ in range(4 * (q + 1))]
    def add_edge(node: int, l: int, r: int, ql: int, qr: int, u: int, v: int) -> None:
        if ql <= l and r <= qr:
            tree[node].append((u, v))
            return
        mid = (l + r) >> 1
        if ql <= mid: add_edge(node * 2, l, mid, ql, qr, u, v)
        if qr > mid: add_edge(node * 2 + 1, mid + 1, r, ql, qr, u, v)

    i = 0
    while i < q:
        u, v = evs[i][0], evs[i][1]
        dep = 0; st = -1
        while i < q and evs[i][0] == u and evs[i][1] == v:
            _, _, t, _, d = evs[i]
            if d == 1:
                if dep == 0: st = t
                dep += 1
            else:
                dep -= 1
                if dep == 0 and st != -1 and st < t:
                    add_edge(1, 1, q, st, t - 1, u, v)
                    st = -1
            i += 1
        if dep > 0 and st != -1:
            add_edge(1, 1, q, st, q, u, v)

    p = list(range(n + 1))
    sz = [1] * (n + 1)
    par = [0] * (n + 1)
    hist = []
    odd = 0
    ans = [True] * (q + 1)

    def find_par(x: int) -> tuple:
        c = 0
        while x != p[x]:
            c ^= par[x]
            x = p[x]
        return x, c

    def dfs(node: int, l: int, r: int) -> None:
        nonlocal odd
        snap = len(hist)
        for u, v in tree[node]:
            ru, pu = find_par(u)
            rv, pv = find_par(v)
            if ru == rv:
                hist.append((-1, -1, odd))
                if pu == pv:
                    odd += 1
            else:
                if sz[ru] > sz[rv]:
                    ru, rv = rv, ru
                hist.append((ru, rv, odd))
                p[ru] = rv
                par[ru] = pu ^ pv ^ 1
                sz[rv] += sz[ru]
        if l == r:
            ans[l] = (odd == 0)
        else:
            mid = (l + r) >> 1
            dfs(node * 2, l, mid)
            dfs(node * 2 + 1, mid + 1, r)
        while len(hist) > snap:
            ru, rv, prev_odd = hist.pop()
            odd = prev_odd
            if ru != -1:
                p[ru] = ru
                par[ru] = 0
                sz[rv] -= sz[ru]

    dfs(1, 1, q)
    sys.stdout.write("\\n".join("YES" if ans[t] else "NO" for t in range(1, q + 1)) + "\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
n = tokens[0].to_i; q = tokens[1].to_i
evs = []; idx = 2
(1..q).each do |t|
  typ = tokens[idx].to_i; u = tokens[idx + 1].to_i; v = tokens[idx + 2].to_i; idx += 3
  u, v = v, u if u > v
  d = typ == 1 ? 1 : -1
  evs << [u, v, t, -d, d]
end
evs.sort!

tree = Array.new(4 * (q + 1)) { [] }
add_edge = nil
add_edge = lambda do |node, l, r, ql, qr, u, v|
  if ql <= l && r <= qr; tree[node] << [u, v]; return; end
  mid = (l + r) >> 1
  add_edge.call(node * 2, l, mid, ql, qr, u, v) if ql <= mid
  add_edge.call(node * 2 + 1, mid + 1, r, ql, qr, u, v) if qr > mid
end

i = 0
while i < q
  u = evs[i][0]; v = evs[i][1]; dep = 0; st = -1
  while i < q && evs[i][0] == u && evs[i][1] == v
    t = evs[i][2]; d = evs[i][4]
    if d == 1; st = t if dep == 0; dep += 1
    else
      dep -= 1
      if dep == 0 && st != -1 && st < t; add_edge.call(1, 1, q, st, t - 1, u, v); st = -1; end
    end
    i += 1
  end
  add_edge.call(1, 1, q, st, q, u, v) if dep > 0 && st != -1
end

p = (0..n).to_a; sz = Array.new(n + 1, 1); par = Array.new(n + 1, 0)
hist = []; odd = 0; ans = Array.new(q + 1, true)
find_par = lambda do |x|
  c = 0
  while x != p[x]; c ^= par[x]; x = p[x]; end
  [x, c]
end

dfs = nil
dfs = lambda do |node, l, r|
  snap = hist.length
  tree[node].each do |u, v|
    ru, pu = find_par.call(u); rv, pv = find_par.call(v)
    if ru == rv
      hist << [-1, -1, odd]
      odd += 1 if pu == pv
    else
      ru, rv = rv, ru if sz[ru] > sz[rv]
      hist << [ru, rv, odd]
      p[ru] = rv; par[ru] = pu ^ pv ^ 1; sz[rv] += sz[ru]
    end
  end
  if l == r; ans[l] = (odd == 0)
  else
    mid = (l + r) >> 1; dfs.call(node * 2, l, mid); dfs.call(node * 2 + 1, mid + 1, r)
  end
  while hist.length > snap
    ru, rv, prev_odd = hist.pop
    odd = prev_odd
    if ru != -1; p[ru] = ru; par[ru] = 0; sz[rv] -= sz[ru]; end
  end
end

dfs.call(1, 1, q)
puts (1..q).map { |t| ans[t] ? "YES" : "NO" }.join("\\n")`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'CSES',
      title: 'Dynamic Connectivity (2133)',
      difficulty: 'Platinum',
      url: 'https://cses.fi/problemset/task/2133',
      patternNote: 'Direct benchmark for Segment Tree over Time + Union-by-Size Rollback DSU.',
    },
    {
      platform: 'Codeforces',
      title: 'Bipartite Checking (813F) & Connect and Disconnect',
      difficulty: '2500',
      url: 'https://codeforces.com/problemset/problem/813/F',
      patternNote: 'Offline timeline edge toggles paired with parity-weighted Rollback DSU.',
    },
    {
      platform: 'AtCoder',
      title: 'ABC / ARC — Partial Order & Offline Queries',
      difficulty: '2300',
      url: 'https://atcoder.jp',
      patternNote: 'Eliminate one spatial or time coordinate via CDQ D&C before Fenwick sweeping.',
    },
    {
      platform: 'CodeChef',
      title: 'Three Dimensional Partial Order / Bipartite Queries',
      difficulty: '2250',
      url: 'https://www.codechef.com',
      patternNote: 'Avoid O(N^2) BIT resets in CDQ by undoing only touched left-half points.',
    },
    {
      platform: 'HackerRank',
      title: 'Dynamic Connectivity & Offline Dominance',
      difficulty: 'Expert',
      url: 'https://www.hackerrank.com/challenges',
      patternNote: 'Convert arbitrary edge removals into static Segment Tree lifespan intervals.',
    },
    {
      platform: 'NeetCode 150',
      title: 'Count of Smaller Numbers After Self (315) Scaled to 3D',
      difficulty: 'Hard -> Plat',
      url: 'https://leetcode.com/problems/count-of-smaller-numbers-after-self/',
      patternNote: 'Extend 2D merge-sort inversion counting cleanly into 3D CDQ Divide & Conquer.',
    },
  ],
  interviewNotes: [
    'Why does CDQ Divide & Conquer reduce 3D partial order (`<= a, <= b, <= c`) from 2D range trees down to a single 1D Fenwick Tree? Because splitting `[l, mid]` vs `[mid+1, r]` after sorting by `a` ensures `a_L <= a_R` identically for every cross pair, eliminating `a` completely!',
    'Why must Rollback DSU forbid path compression? Path compression mutates `O(log N)` parent pointers per `find()`, preventing `O(1)` edge undo; Union-by-Size alone keeps depth `<= log2 N` while letting every `unite()` push a single invertible checkpoint.',
    'Always deduplicate identical `(a, b, c)` triples before running CDQ, otherwise equal triples split across `mid` only count Left -> Right rather than both directions.',
  ],
  projectBlueprint: {
    title: 'Temporal Network Topology & Historical Graph Reachability Analyzer',
    tagline:
      'Time-travel network telemetry engine replaying link-up/link-down fault timelines via Segment-Tree DSU rollbacks to audit historical partition recovery.',
    stackSummary: 'TypeScript Timeline Segment Tree & Rollback DSU Engine',
    asciiDiagram: `[Link Flap Events: (u, v, t_start, t_end)]
         |
         +--> [Insert Edge Intervals onto Timeline SegTree [0..T]]
         |
         +--> [Pre-order DFS: unite(u,v) --> Emit Partition Metrics --> Pop Undo Stack]`,
    milestones: [
      {
        id: 'm1',
        title: 'Lifespan Interval Pairing Engine',
        detail: 'Convert raw connect/disconnect event logs into disjoint [t_start, t_end - 1] lifespans.',
      },
      {
        id: 'm2',
        title: 'Stack-Based Union-by-Size Rollback DSU',
        detail: 'Maintain invertible parent/parity changes across arbitrary DFS backtracking depths.',
      },
      {
        id: 'm3',
        title: 'Snapshot Reachability & Bipartite Fault Reporter',
        detail: 'Emit connected component counts and odd-cycle conflict alerts at every time point.',
      },
    ],
    starterCode: `export class TimelineRollbackDSU {
  private p: Int32Array;
  private sz: Int32Array;
  private history: [number, number][] = [];
  public comps: number;

  constructor(n: number) {
    this.p = Int32Array.from({ length: n + 1 }, (_, i) => i);
    this.sz = new Int32Array(n + 1).fill(1);
    this.comps = n;
  }

  find(x: number): number {
    while (x !== this.p[x]) x = this.p[x];
    return x;
  }

  unite(u: number, v: number): void {
    let ru = this.find(u);
    let rv = this.find(v);
    if (ru === rv) {
      this.history.push([-1, -1]);
      return;
    }
    if (this.sz[ru] > this.sz[rv]) [ru, rv] = [rv, ru];
    this.history.push([ru, rv]);
    this.p[ru] = rv;
    this.sz[rv] += this.sz[ru];
    this.comps--;
  }

  snapshot(): number { return this.history.length; }

  rollback(snap: number): void {
    while (this.history.length > snap) {
      const [ru, rv] = this.history.pop()!;
      if (ru !== -1) {
        this.p[ru] = ru;
        this.sz[rv] -= this.sz[ru];
        this.comps++;
      }
    }
  }
}

const dsu = new TimelineRollbackDSU(4);
const s1 = dsu.snapshot();
dsu.unite(1, 2);
dsu.unite(3, 4);
console.log('Comps merged:', dsu.comps);
dsu.rollback(s1);
console.log('Comps after rollback:', dsu.comps);`,
  },
};
