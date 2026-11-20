import type { TheoryChapter } from '../../types/vault';

export const CH20_HLD_EULER: TheoryChapter = {
  slug: 'heavy-light-decomposition',
  topicId: 'gr-37',
  title: 'Heavy-Light Decomposition (HLD) & Euler Tour',
  domain: 'Graph & Tree Theory',
  ratingTier: '1900–2200',
  usacoDivision: 'Platinum',
  subtitle:
    'Decompose any rooted tree into contiguous heavy chains along an Euler Tour array so both path(u, v) and subtree(u) updates/queries run in O(log^2 N) or O(log N) on one Segment Tree.',
  analogyTitle: 'The Express Heavy-Rail vs. Local Light-Bridge Analogy',
  analogyBody:
    'Picture a mountain kingdom shaped like a tree. At every junction, pick the single widest branch carrying the most towns (the Heavy Child with maximum `sz[v]`) and connect it onto a straight continuous express highway. All other smaller branches act as local side-bridges (Light Edges). Whenever you ride from town `u` to town `v`, every time you hop across a light bridge onto a new highway, your remaining subtree size at least DOUBLES—meaning you cross at most `log2(N)` light bridges! By numbering nodes along each heavy highway first during DFS2 (`pos[u]` contiguous), BOTH every heavy highway segment AND every entire subtree `[pos[u], pos[u] + sz[u] - 1]` become contiguous intervals on one Segment Tree!',
  prerequisites: [
    {
      slug: 'lca-binary-lifting-euler-tour',
      title: 'Euler Tour Flattening & LCA (Binary Lifting / O(1))',
    },
    {
      slug: 'lazy-propagation-segment-tree',
      title: 'Segment Tree with Lazy Propagation',
    },
  ],
  traceTitle: 'Interactive HLD Heavy-Child Sizing, Chain Heads & Path Mapping Trace',
  traceSubtitle:
    'Step through DFS1 subtree sizing, DFS2 heavy-first numbering into pos[], and path(4, 6) decomposition—or edit nodes/edges live.',
  allowDynamicGraphEdit: true,
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Step 1: DFS1 Computes Subtree Sizes & Picks Heavy Child Per Node',
      explanation:
        'Root at 1 (edges 1-2, 1-3, 2-4, 2-5, 5-6). Subtree sizes: sz[1]=6, sz[2]=4 (heavy!), sz[3]=1, sz[4]=1, sz[5]=2 (heavy!), sz[6]=1. Heavy chains: 1-2-5-6, {4}, {3}.',
      mode: 'graph',
      graph: {
        calloutMetric: 'Heavy Children: 1->2 (sz=4), 2->5 (sz=2), 5->6 (sz=1)',
        nodes: [
          { id: '1', label: '1 (sz=6)', x: 260, y: 55, state: 'active', matchWith: null },
          { id: '2', label: '2* (sz=4)', x: 165, y: 135, state: 'even', matchWith: null },
          { id: '3', label: '3 (sz=1)', x: 385, y: 135, state: 'unmatched', matchWith: null },
          { id: '4', label: '4 (sz=1)', x: 85, y: 220, state: 'unmatched', matchWith: null },
          { id: '5', label: '5* (sz=2)', x: 245, y: 220, state: 'even', matchWith: null },
          { id: '6', label: '6* (sz=1)', x: 245, y: 295, state: 'even', matchWith: null },
        ],
        edges: [
          { id: 'e12', from: '1', to: '2', state: 'matched' },
          { id: 'e13', from: '1', to: '3', state: 'default' },
          { id: 'e24', from: '2', to: '4', state: 'default' },
          { id: 'e25', from: '2', to: '5', state: 'matched' },
          { id: 'e56', from: '5', to: '6', state: 'matched' },
        ],
      },
      variables: { HeavyEdge1: '1->2', HeavyEdge2: '2->5', HeavyEdge3: '5->6' },
    },
    {
      stepNumber: 2,
      title: 'Step 2: DFS2 Assigns Heavy-First pos[] & Chain heads[]',
      explanation:
        'Visit heavy child FIRST so heavy chain 1-2-5-6 gets contiguous indices pos = [0, 1, 2, 3]! Light children 4 and 3 start new heads at pos=4 and pos=5.',
      mode: 'graph',
      graph: {
        calloutMetric: 'SegTree Array Order: [1, 2, 5, 6 | 4 | 3] | Subtrees ALSO Contiguous!',
        nodes: [
          { id: '1', label: '1 p=0 h=1', x: 260, y: 55, state: 'matched', matchWith: null },
          { id: '2', label: '2 p=1 h=1', x: 165, y: 135, state: 'matched', matchWith: null },
          { id: '3', label: '3 p=5 h=3', x: 385, y: 135, state: 'odd', matchWith: null },
          { id: '4', label: '4 p=4 h=4', x: 85, y: 220, state: 'odd', matchWith: null },
          { id: '5', label: '5 p=2 h=1', x: 245, y: 220, state: 'matched', matchWith: null },
          { id: '6', label: '6 p=3 h=1', x: 245, y: 295, state: 'matched', matchWith: null },
        ],
        edges: [
          { id: 'e12', from: '1', to: '2', state: 'matched' },
          { id: 'e13', from: '1', to: '3', state: 'default' },
          { id: 'e24', from: '2', to: '4', state: 'default' },
          { id: 'e25', from: '2', to: '5', state: 'matched' },
          { id: 'e56', from: '5', to: '6', state: 'matched' },
        ],
      },
      variables: { MainChain: '[1,2,5,6] -> pos[0..3]', 'Subtree(2)': 'pos[1..4]' },
    },
    {
      stepNumber: 3,
      title: 'Step 3: Query Path(4, 6) Climbs Deeper Head First (head[4]=4 vs head[6]=1)',
      explanation:
        'head[4]=4 has depth 2 > head[6]=1 depth 0. Query SegTree range [pos[4], pos[4]] = [4..4], then jump u = parent[4] = 2!',
      mode: 'graph',
      graph: {
        calloutMetric: 'Climb Light Edge 4->2: Query Seg[4..4], Move u to 2 (head[2]=1)',
        nodes: [
          { id: '1', label: '1 p=0 h=1', x: 260, y: 55, state: 'matched', matchWith: null },
          { id: '2', label: '2 (u now)', x: 165, y: 135, state: 'active', matchWith: null },
          { id: '3', label: '3 p=5 h=3', x: 385, y: 135, state: 'unmatched', matchWith: null },
          { id: '4', label: '4 [pos 4]', x: 85, y: 220, state: 'even', matchWith: null },
          { id: '5', label: '5 p=2 h=1', x: 245, y: 220, state: 'matched', matchWith: null },
          { id: '6', label: '6 (v)', x: 245, y: 295, state: 'active', matchWith: null },
        ],
        edges: [
          { id: 'e12', from: '1', to: '2', state: 'matched' },
          { id: 'e13', from: '1', to: '3', state: 'default' },
          { id: 'e24', from: '2', to: '4', state: 'augmenting' },
          { id: 'e25', from: '2', to: '5', state: 'matched' },
          { id: 'e56', from: '5', to: '6', state: 'matched' },
        ],
      },
      variables: { QuerySoFar: 'Seg[4..4]', NextPair: '(u=2, v=6)', SameHead: 'true (head=1)' },
    },
    {
      stepNumber: 4,
      title: 'Step 4: Same Chain [u=2, v=6] -> Final Contiguous Query Seg[pos[2]..pos[6]] = [1..3]',
      explanation:
        'Now head[2] == head[6] == 1! Query [pos[2]..pos[6]] = [1..3] (nodes 2, 5, 6). Total path(4, 6) = Seg[4..4] (+) Seg[1..3] in 2 SegTree calls!',
      mode: 'graph',
      graph: {
        calloutMetric: 'Path(4, 6) = Seg[4..4] + Seg[1..3] (Subtree(2) = Seg[1..4])',
        nodes: [
          { id: '1', label: '1 p=0', x: 260, y: 55, state: 'unmatched', matchWith: null },
          { id: '2', label: '2* LCA', x: 165, y: 135, state: 'active', matchWith: null },
          { id: '3', label: '3 p=5', x: 385, y: 135, state: 'unmatched', matchWith: null },
          { id: '4', label: '4* p=4', x: 85, y: 220, state: 'matched', matchWith: null },
          { id: '5', label: '5* p=2', x: 245, y: 220, state: 'matched', matchWith: null },
          { id: '6', label: '6* p=3', x: 245, y: 295, state: 'matched', matchWith: null },
        ],
        edges: [
          { id: 'e12', from: '1', to: '2', state: 'default' },
          { id: 'e13', from: '1', to: '3', state: 'default' },
          { id: 'e24', from: '2', to: '4', state: 'augmenting' },
          { id: 'e25', from: '2', to: '5', state: 'augmenting' },
          { id: 'e56', from: '5', to: '6', state: 'augmenting' },
        ],
      },
      variables: { PathRanges: '[4..4], [1..3]', Subtree2Range: '[1..4]', TotalOps: 2 },
    },
  ],
  reductionClues: [
    {
      clue: '"Update node/edge weights OR add +v along path(u, v), AND query path max/sum"',
      translation: 'Heavy-Light Decomposition decomposes path(u, v) into <= 2*log2(N) contiguous ranges on a Segment Tree.',
    },
    {
      clue: '"Edge-weighted tree: update weight of edge i, query max/sum along path(u, v)"',
      translation: 'Push each edge weight down onto its deeper endpoint (`val[child] = w`), and in the final same-chain step exclude the LCA node itself (`pos[u] + 1 .. pos[v]`)!',
    },
    {
      clue: '"Mix BOTH subtree(u) updates/queries AND path(u, v) updates/queries"',
      translation: 'Because DFS2 enters heavy child first then all light children, every subtree(u) ALSO maps cleanly to `[pos[u], pos[u] + sz[u] - 1]`!',
    },
    {
      clue: '"Non-commutative path operations (matrix multiplication / directed string concat u -> v)"',
      translation: 'Store BOTH left-to-right and right-to-left monoids inside each SegTree node, tracking `u -> lca` separately from `lca -> v` before combining.',
    },
  ],
  timeComplexity: 'Precompute: O(N) | Path Query / Update: O(log^2 N) | Subtree Query: O(log N)',
  spaceComplexity: 'O(N)',
  pitfalls: [
    {
      type: 'WA',
      title: 'Including the LCA Node on Edge-Weighted Tree Queries',
      detail:
        'When mapping edges onto their child vertex, the LCA vertex stores the edge ABOVE the LCA (`parent[lca] -- lca`), which is NOT on `path(u, v)`! On the final same-chain segment `pos[u] <= pos[v]`, query `[pos[u] + 1 .. pos[v]]` (skipping if `u == v`).',
    },
    {
      type: 'TLE',
      title: 'Using Recursive Segment Tree Inside HLD Loops Instead of Fast Iterative SegTree',
      detail:
        'An HLD path query executes up to ~35 SegTree queries per operation; with Q = 2*10^5 that is 7 million calls! An iterative `2N` Segment Tree runs 3-5x faster and prevents TLE on tight judges.',
    },
    {
      type: 'RE',
      title: 'Deep Chain Stack Overflow in DFS1 / DFS2 at N = 2*10^5',
      detail:
        'A single path of 2*10^5 nodes overflows Python/Java/default-Windows C++ stacks. Always build iterative BFS/DFS order for DFS1 sizing and iterative stack for DFS2 HLD numbering.',
    },
    {
      type: 'WA',
      title: 'Comparing `depth[u]` Instead of `depth[head[u]]` During HLD Climbing',
      detail:
        'Always advance whichever endpoint has the DEEPER CHAIN HEAD (`depth[head[u]] < depth[head[v]]`), NOT `depth[u] < depth[v]`. Swapping on `depth[u]` can overshoot the LCA!',
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
    vector<long long> initVal(n + 1);
    for (int i = 1; i <= n; ++i) cin >> initVal[i];

    vector<vector<int>> adj(n + 1);
    for (int i = 0; i < n - 1; ++i) {
        int u, v;
        cin >> u >> v;
        adj[u].push_back(v);
        adj[v].push_back(u);
    }

    // Iterative DFS1: parent, depth, subtree size, heavy child
    vector<int> parent(n + 1, 0), depth(n + 1, 0), sz(n + 1, 1), heavy(n + 1, 0), order;
    order.reserve(n);
    order.push_back(1);
    for (size_t i = 0; i < order.size(); ++i) {
        int u = order[i];
        for (int v : adj[u]) {
            if (v != parent[u]) {
                parent[v] = u;
                depth[v] = depth[u] + 1;
                order.push_back(v);
            }
        }
    }
    for (int i = n - 1; i >= 0; --i) {
        int u = order[i];
        int maxSz = 0;
        for (int v : adj[u]) {
            if (v != parent[u]) {
                sz[u] += sz[v];
                if (sz[v] > maxSz) {
                    maxSz = sz[v];
                    heavy[u] = v;
                }
            }
        }
    }

    // Iterative DFS2: assign heavy-first positions pos[] & chain head[]
    vector<int> head(n + 1, 1), pos(n + 1, 0);
    int curPos = 0;
    vector<pair<int, int>> st = {{1, 1}};
    while (!st.empty()) {
        auto [u, h] = st.back();
        st.pop_back();
        head[u] = h;
        pos[u] = curPos++;
        for (int v : adj[u]) {
            if (v != parent[u] && v != heavy[u]) st.push_back({v, v});
        }
        if (heavy[u] != 0) st.push_back({heavy[u], h});
    }

    // Iterative Max Segment Tree (size 2 * n)
    vector<long long> seg(2 * n, 0);
    for (int i = 1; i <= n; ++i) seg[n + pos[i]] = initVal[i];
    for (int i = n - 1; i >= 1; --i) seg[i] = max(seg[i << 1], seg[i << 1 | 1]);

    auto segUpdate = [&](int p, long long val) {
        seg[p += n] = val;
        for (p >>= 1; p > 0; p >>= 1) seg[p] = max(seg[p << 1], seg[p << 1 | 1]);
    };

    auto segQuery = [&](int l, int r) {
        long long res = LLONG_MIN;
        for (l += n, r += n; l <= r; l >>= 1, r >>= 1) {
            if (l & 1) res = max(res, seg[l++]);
            if (!(r & 1)) res = max(res, seg[r--]);
        }
        return res;
    };

    auto pathMax = [&](int u, int v) {
        long long res = LLONG_MIN;
        while (head[u] != head[v]) {
            if (depth[head[u]] < depth[head[v]]) swap(u, v);
            res = max(res, segQuery(pos[head[u]], pos[u]));
            u = parent[head[u]];
        }
        if (depth[u] > depth[v]) swap(u, v);
        res = max(res, segQuery(pos[u], pos[v]));
        return res;
    };

    while (q--) {
        int tp;
        cin >> tp;
        if (tp == 1) {
            int s; long long x;
            cin >> s >> x;
            segUpdate(pos[s], x);
        } else {
            int a, b;
            cin >> a >> b;
            cout << pathMax(a, b) << '\\n';
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
    let q: usize = it.next().unwrap().parse().unwrap();
    let mut init_val = vec![0i64; n + 1];
    for i in 1..=n {
        init_val[i] = it.next().unwrap().parse().unwrap();
    }

    let mut adj = vec![Vec::<usize>::new(); n + 1];
    for _ in 0..n - 1 {
        let u: usize = it.next().unwrap().parse().unwrap();
        let v: usize = it.next().unwrap().parse().unwrap();
        adj[u].push(v);
        adj[v].push(u);
    }

    let mut parent = vec![0usize; n + 1];
    let mut depth = vec![0usize; n + 1];
    let mut sz = vec![1usize; n + 1];
    let mut heavy = vec![0usize; n + 1];
    let mut order = Vec::with_capacity(n);
    order.push(1);
    for idx in 0..n {
        let u = order[idx];
        for &v in &adj[u] {
            if v != parent[u] {
                parent[v] = u;
                depth[v] = depth[u] + 1;
                order.push(v);
            }
        }
    }
    for &u in order.iter().rev() {
        let mut mx = 0;
        for &v in &adj[u] {
            if v != parent[u] {
                sz[u] += sz[v];
                if sz[v] > mx {
                    mx = sz[v];
                    heavy[u] = v;
                }
            }
        }
    }

    let mut head = vec![1usize; n + 1];
    let mut pos = vec![0usize; n + 1];
    let mut cur_pos = 0usize;
    let mut st = vec![(1usize, 1usize)];
    while let Some((u, h)) = st.pop() {
        head[u] = h;
        pos[u] = cur_pos;
        cur_pos += 1;
        for &v in &adj[u] {
            if v != parent[u] && v != heavy[u] {
                st.push((v, v));
            }
        }
        if heavy[u] != 0 {
            st.push((heavy[u], h));
        }
    }

    let mut seg = vec![i64::MIN; 2 * n];
    for i in 1..=n {
        seg[n + pos[i]] = init_val[i];
    }
    for i in (1..n).rev() {
        seg[i] = seg[i << 1].max(seg[i << 1 | 1]);
    }

    let mut out = String::new();
    for _ in 0..q {
        let tp: usize = it.next().unwrap().parse().unwrap();
        if tp == 1 {
            let s: usize = it.next().unwrap().parse().unwrap();
            let x: i64 = it.next().unwrap().parse().unwrap();
            let mut p = n + pos[s];
            seg[p] = x;
            p >>= 1;
            while p > 0 {
                seg[p] = seg[p << 1].max(seg[p << 1 | 1]);
                p >>= 1;
            }
        } else {
            let mut u: usize = it.next().unwrap().parse().unwrap();
            let mut v: usize = it.next().unwrap().parse().unwrap();
            let mut res = i64::MIN;
            while head[u] != head[v] {
                if depth[head[u]] < depth[head[v]] {
                    std::mem::swap(&mut u, &mut v);
                }
                let mut l = n + pos[head[u]];
                let mut r = n + pos[u];
                while l <= r {
                    if l & 1 == 1 { res = res.max(seg[l]); l += 1; }
                    if r & 1 == 0 { res = res.max(seg[r]); r -= 1; }
                    l >>= 1; r >>= 1;
                }
                u = parent[head[u]];
            }
            if depth[u] > depth[v] {
                std::mem::swap(&mut u, &mut v);
            }
            let mut l = n + pos[u];
            let mut r = n + pos[v];
            while l <= r {
                if l & 1 == 1 { res = res.max(seg[l]); l += 1; }
                if r & 1 == 0 { res = res.max(seg[r]); r -= 1; }
                l >>= 1; r >>= 1;
            }
            out.push_str(&format!("{}\\n", res));
        }
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

    static long[] seg;
    static int N;

    static void segUpdate(int p, long v) {
        seg[p += N] = v;
        for (p >>= 1; p > 0; p >>= 1) seg[p] = Math.max(seg[p << 1], seg[p << 1 | 1]);
    }

    static long segQuery(int l, int r) {
        long res = Long.MIN_VALUE;
        for (l += N, r += N; l <= r; l >>= 1, r >>= 1) {
            if ((l & 1) == 1) res = Math.max(res, seg[l++]);
            if ((r & 1) == 0) res = Math.max(res, seg[r--]);
        }
        return res;
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        long f = fs.nextLong();
        if (f == Long.MIN_VALUE) return;
        N = (int) f;
        int q = fs.nextInt();
        long[] initVal = new long[N + 1];
        for (int i = 1; i <= N; i++) initVal[i] = fs.nextLong();

        int[] headAdj = new int[N + 1];
        Arrays.fill(headAdj, -1);
        int[] to = new int[2 * N], next = new int[2 * N];
        int ptr = 0;
        for (int i = 0; i < N - 1; i++) {
            int u = fs.nextInt(), v = fs.nextInt();
            to[ptr] = v; next[ptr] = headAdj[u]; headAdj[u] = ptr++;
            to[ptr] = u; next[ptr] = headAdj[v]; headAdj[v] = ptr++;
        }

        int[] parent = new int[N + 1], depth = new int[N + 1], sz = new int[N + 1], heavy = new int[N + 1], order = new int[N];
        Arrays.fill(sz, 1);
        int ordTail = 0;
        order[ordTail++] = 1;
        for (int i = 0; i < N; i++) {
            int u = order[i];
            for (int e = headAdj[u]; e != -1; e = next[e]) {
                int v = to[e];
                if (v != parent[u]) {
                    parent[v] = u;
                    depth[v] = depth[u] + 1;
                    order[ordTail++] = v;
                }
            }
        }
        for (int i = N - 1; i >= 0; i--) {
            int u = order[i], mx = 0;
            for (int e = headAdj[u]; e != -1; e = next[e]) {
                int v = to[e];
                if (v != parent[u]) {
                    sz[u] += sz[v];
                    if (sz[v] > mx) { mx = sz[v]; heavy[u] = v; }
                }
            }
        }

        int[] chainHead = new int[N + 1], pos = new int[N + 1];
        int[] stU = new int[N + 1], stH = new int[N + 1];
        int top = 0, curPos = 0;
        stU[top] = 1; stH[top] = 1; top++;
        while (top > 0) {
            top--;
            int u = stU[top], h = stH[top];
            chainHead[u] = h;
            pos[u] = curPos++;
            for (int e = headAdj[u]; e != -1; e = next[e]) {
                int v = to[e];
                if (v != parent[u] && v != heavy[u]) {
                    stU[top] = v; stH[top] = v; top++;
                }
            }
            if (heavy[u] != 0) {
                stU[top] = heavy[u]; stH[top] = h; top++;
            }
        }

        seg = new long[2 * N];
        for (int i = 1; i <= N; i++) seg[N + pos[i]] = initVal[i];
        for (int i = N - 1; i >= 1; i--) seg[i] = Math.max(seg[i << 1], seg[i << 1 | 1]);

        StringBuilder sb = new StringBuilder();
        while (q-- > 0) {
            int tp = fs.nextInt();
            if (tp == 1) {
                int s = fs.nextInt();
                segUpdate(pos[s], fs.nextLong());
            } else {
                int u = fs.nextInt(), v = fs.nextInt();
                long res = Long.MIN_VALUE;
                while (chainHead[u] != chainHead[v]) {
                    if (depth[chainHead[u]] < depth[chainHead[v]]) { int t = u; u = v; v = t; }
                    res = Math.max(res, segQuery(pos[chainHead[u]], pos[u]));
                    u = parent[chainHead[u]];
                }
                if (depth[u] > depth[v]) { int t = u; u = v; v = t; }
                res = Math.max(res, segQuery(pos[u], pos[v]));
                sb.append(res).append('\\n');
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
    init_val = [0] + [int(next(it)) for _ in range(n)]

    adj = [[] for _ in range(n + 1)]
    for _ in range(n - 1):
        u = int(next(it))
        v = int(next(it))
        adj[u].append(v)
        adj[v].append(u)

    parent = [0] * (n + 1)
    depth = [0] * (n + 1)
    sz = [1] * (n + 1)
    heavy = [0] * (n + 1)
    order = [1]
    for u in order:
        pu = parent[u]
        for v in adj[u]:
            if v != pu:
                parent[v] = u
                depth[v] = depth[u] + 1
                order.append(v)

    for u in reversed(order):
        mx = 0
        pu = parent[u]
        for v in adj[u]:
            if v != pu:
                sz[u] += sz[v]
                if sz[v] > mx:
                    mx = sz[v]
                    heavy[u] = v

    head = [1] * (n + 1)
    pos = [0] * (n + 1)
    cur_pos = 0
    st = [(1, 1)]
    while st:
        u, h = st.pop()
        head[u] = h
        pos[u] = cur_pos
        cur_pos += 1
        pu = parent[u]
        hu = heavy[u]
        for v in adj[u]:
            if v != pu and v != hu:
                st.append((v, v))
        if hu != 0:
            st.append((hu, h))

    NEG_INF = -10**18
    seg = [NEG_INF] * (2 * n)
    for i in range(1, n + 1):
        seg[n + pos[i]] = init_val[i]
    for i in range(n - 1, 0, -1):
        a, b = seg[i << 1], seg[i << 1 | 1]
        seg[i] = a if a > b else b

    out = []
    for _ in range(q):
        tp = int(next(it))
        if tp == 1:
            s = int(next(it))
            x = int(next(it))
            p = n + pos[s]
            seg[p] = x
            p >>= 1
            while p:
                a, b = seg[p << 1], seg[p << 1 | 1]
                seg[p] = a if a > b else b
                p >>= 1
        else:
            u = int(next(it))
            v = int(next(it))
            res = NEG_INF
            while head[u] != head[v]:
                if depth[head[u]] < depth[head[v]]:
                    u, v = v, u
                l = n + pos[head[u]]
                r = n + pos[u]
                while l <= r:
                    if l & 1:
                        if seg[l] > res: res = seg[l]
                        l += 1
                    if not (r & 1):
                        if seg[r] > res: res = seg[r]
                        r -= 1
                    l >>= 1
                    r >>= 1
                u = parent[head[u]]
            if depth[u] > depth[v]:
                u, v = v, u
            l = n + pos[u]
            r = n + pos[v]
            while l <= r:
                if l & 1:
                    if seg[l] > res: res = seg[l]
                    l += 1
                if not (r & 1):
                    if seg[r] > res: res = seg[r]
                    r -= 1
                l >>= 1
                r >>= 1
            out.append(str(res))

    sys.stdout.write("\\n".join(out) + "\\n")

if __name__ == "__main__":
    solve()`,
    ruby: `data = STDIN.read.split.map(&:to_i)
exit if data.empty?
idx = 0
n = data[idx]; q = data[idx + 1]; idx += 2
init_val = [0] + data[idx, n]; idx += n

adj = Array.new(n + 1) { [] }
(n - 1).times do
  u = data[idx]; v = data[idx + 1]; idx += 2
  adj[u] << v; adj[v] << u
end

parent = Array.new(n + 1, 0)
depth = Array.new(n + 1, 0)
sz = Array.new(n + 1, 1)
heavy = Array.new(n + 1, 0)
order = [1]; hd = 0
while hd < order.size
  u = order[hd]; hd += 1
  adj[u].each do |v|
    next if v == parent[u]
    parent[v] = u; depth[v] = depth[u] + 1; order << v
  end
end
order.reverse_each do |u|
  mx = 0
  adj[u].each do |v|
    next if v == parent[u]
    sz[u] += sz[v]
    if sz[v] > mx; mx = sz[v]; heavy[u] = v; end
  end
end

head = Array.new(n + 1, 1)
pos = Array.new(n + 1, 0)
cur_pos = 0
st = [[1, 1]]
until st.empty?
  u, h = st.pop
  head[u] = h
  pos[u] = cur_pos
  cur_pos += 1
  adj[u].each { |v| st << [v, v] if v != parent[u] && v != heavy[u] }
  st << [heavy[u], h] if heavy[u] != 0
end

neg_inf = -10**18
seg = Array.new(2 * n, neg_inf)
(1..n).each { |i| seg[n + pos[i]] = init_val[i] }
(n - 1).downto(1) { |i| a = seg[i << 1]; b = seg[i << 1 | 1]; seg[i] = a > b ? a : b }

out = []
q.times do
  tp = data[idx]; idx += 1
  if tp == 1
    s = data[idx]; x = data[idx + 1]; idx += 2
    p = n + pos[s]; seg[p] = x; p >>= 1
    while p > 0
      a = seg[p << 1]; b = seg[p << 1 | 1]; seg[p] = a > b ? a : b; p >>= 1
    end
  else
    u = data[idx]; v = data[idx + 1]; idx += 2
    res = neg_inf
    while head[u] != head[v]
      u, v = v, u if depth[head[u]] < depth[head[v]]
      l = n + pos[head[u]]; r = n + pos[u]
      while l <= r
        if (l & 1) == 1; res = seg[l] if seg[l] > res; l += 1; end
        if (r & 1) == 0; res = seg[r] if seg[r] > res; r -= 1; end
        l >>= 1; r >>= 1
      end
      u = parent[head[u]]
    end
    u, v = v, u if depth[u] > depth[v]
    l = n + pos[u]; r = n + pos[v]
    while l <= r
      if (l & 1) == 1; res = seg[l] if seg[l] > res; l += 1; end
      if (r & 1) == 0; res = seg[r] if seg[r] > res; r -= 1; end
      l >>= 1; r >>= 1
    end
    out << res
  end
end
puts out.join("\\n")`,
  },
  practiceProblems: [
    {
      id: 'gr37-p1',
      tier: 'Warmup',
      ratingRange: '1650–1850',
      title: 'HLD Unified Subtree Sums & Node Value Updates',
      statement:
        'Using the HLD Euler ordering `[pos[u], pos[u] + sz[u] - 1]`, support Q operations on a tree rooted at 1: (1 s x) set node s value to x; (2 s) query the sum of all node values in the subtree of s.',
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
        'Because HLD DFS2 assigns positions in pre-order (visiting heavy child first, then light children), EVERY subtree of `u` occupies the contiguous interval `[pos[u] .. pos[u] + sz[u] - 1]`!',
        'Build an iterative sum Segment Tree over `pos[]` so `subtreeSum(s)` is a single O(log N) query `[pos[s], pos[s] + sz[s] - 1]`.',
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
    vector<int> parent(n + 1, 0), sz(n + 1, 1), heavy(n + 1, 0), order = {1};
    for (size_t i = 0; i < order.size(); ++i) {
        int u = order[i];
        for (int v : adj[u]) if (v != parent[u]) { parent[v] = u; order.push_back(v); }
    }
    for (int i = n - 1; i >= 0; --i) {
        int u = order[i], mx = 0;
        for (int v : adj[u]) if (v != parent[u]) {
            sz[u] += sz[v];
            if (sz[v] > mx) { mx = sz[v]; heavy[u] = v; }
        }
    }
    vector<int> pos(n + 1, 0); int cur = 0;
    vector<int> st = {1};
    while (!st.empty()) {
        int u = st.back(); st.pop_back();
        pos[u] = cur++;
        for (int v : adj[u]) if (v != parent[u] && v != heavy[u]) st.push_back(v);
        if (heavy[u]) st.push_back(heavy[u]);
    }
    vector<long long> seg(2 * n, 0);
    for (int i = 1; i <= n; ++i) seg[n + pos[i]] = val[i];
    for (int i = n - 1; i >= 1; --i) seg[i] = seg[i << 1] + seg[i << 1 | 1];
    while (q--) {
        int tp, s; cin >> tp >> s;
        if (tp == 1) {
            long long x; cin >> x;
            int p = n + pos[s]; seg[p] = x;
            for (p >>= 1; p > 0; p >>= 1) seg[p] = seg[p << 1] + seg[p << 1 | 1];
        } else {
            long long res = 0;
            for (int l = n + pos[s], r = n + pos[s] + sz[s] - 1; l <= r; l >>= 1, r >>= 1) {
                if (l & 1) res += seg[l++];
                if (!(r & 1)) res += seg[r--];
            }
            cout << res << '\\n';
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
    let mut val = vec![0i64; n + 1];
    for i in 1..=n { val[i] = it.next().unwrap().parse().unwrap(); }
    let mut adj = vec![Vec::<usize>::new(); n + 1];
    for _ in 0..n - 1 {
        let u: usize = it.next().unwrap().parse().unwrap();
        let v: usize = it.next().unwrap().parse().unwrap();
        adj[u].push(v); adj[v].push(u);
    }
    let mut parent = vec![0usize; n + 1];
    let mut sz = vec![1usize; n + 1];
    let mut heavy = vec![0usize; n + 1];
    let mut order = Vec::with_capacity(n); order.push(1);
    for i in 0..n {
        let u = order[i];
        for &v in &adj[u] { if v != parent[u] { parent[v] = u; order.push(v); } }
    }
    for &u in order.iter().rev() {
        let mut mx = 0;
        for &v in &adj[u] { if v != parent[u] { sz[u] += sz[v]; if sz[v] > mx { mx = sz[v]; heavy[u] = v; } } }
    }
    let mut pos = vec![0usize; n + 1]; let mut cur = 0usize;
    let mut st = vec![1usize];
    while let Some(u) = st.pop() {
        pos[u] = cur; cur += 1;
        for &v in &adj[u] { if v != parent[u] && v != heavy[u] { st.push(v); } }
        if heavy[u] != 0 { st.push(heavy[u]); }
    }
    let mut seg = vec![0i64; 2 * n];
    for i in 1..=n { seg[n + pos[i]] = val[i]; }
    for i in (1..n).rev() { seg[i] = seg[i << 1] + seg[i << 1 | 1]; }
    let mut out = String::new();
    for _ in 0..q {
        let tp: usize = it.next().unwrap().parse().unwrap();
        let node: usize = it.next().unwrap().parse().unwrap();
        if tp == 1 {
            let x: i64 = it.next().unwrap().parse().unwrap();
            let mut p = n + pos[node]; seg[p] = x; p >>= 1;
            while p > 0 { seg[p] = seg[p << 1] + seg[p << 1 | 1]; p >>= 1; }
        } else {
            let (mut l, mut r) = (n + pos[node], n + pos[node] + sz[node] - 1);
            let mut res = 0i64;
            while l <= r {
                if l & 1 == 1 { res += seg[l]; l += 1; }
                if r & 1 == 0 { res += seg[r]; r -= 1; }
                l >>= 1; r >>= 1;
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

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        long f = fs.nextLong(); if (f == Long.MIN_VALUE) return;
        int n = (int) f, q = fs.nextInt();
        long[] val = new long[n + 1];
        for (int i = 1; i <= n; i++) val[i] = fs.nextLong();
        int[] head = new int[n + 1]; Arrays.fill(head, -1);
        int[] to = new int[2 * n], next = new int[2 * n]; int ptr = 0;
        for (int i = 0; i < n - 1; i++) {
            int u = fs.nextInt(), v = fs.nextInt();
            to[ptr] = v; next[ptr] = head[u]; head[u] = ptr++;
            to[ptr] = u; next[ptr] = head[v]; head[v] = ptr++;
        }
        int[] parent = new int[n + 1], sz = new int[n + 1], heavy = new int[n + 1], order = new int[n];
        Arrays.fill(sz, 1); int tl = 0; order[tl++] = 1;
        for (int i = 0; i < n; i++) {
            int u = order[i];
            for (int e = head[u]; e != -1; e = next[e]) if (to[e] != parent[u]) { parent[to[e]] = u; order[tl++] = to[e]; }
        }
        for (int i = n - 1; i >= 0; i--) {
            int u = order[i], mx = 0;
            for (int e = head[u]; e != -1; e = next[e]) {
                int v = to[e];
                if (v != parent[u]) { sz[u] += sz[v]; if (sz[v] > mx) { mx = sz[v]; heavy[u] = v; } }
            }
        }
        int[] pos = new int[n + 1], st = new int[n + 1]; int top = 0, cur = 0; st[top++] = 1;
        while (top > 0) {
            int u = st[--top]; pos[u] = cur++;
            for (int e = head[u]; e != -1; e = next[e]) {
                int v = to[e]; if (v != parent[u] && v != heavy[u]) st[top++] = v;
            }
            if (heavy[u] != 0) st[top++] = heavy[u];
        }
        long[] seg = new long[2 * n];
        for (int i = 1; i <= n; i++) seg[n + pos[i]] = val[i];
        for (int i = n - 1; i >= 1; i--) seg[i] = seg[i << 1] + seg[i << 1 | 1];
        StringBuilder sb = new StringBuilder();
        while (q-- > 0) {
            int tp = fs.nextInt(), s = fs.nextInt();
            if (tp == 1) {
                int p = n + pos[s]; seg[p] = fs.nextLong();
                for (p >>= 1; p > 0; p >>= 1) seg[p] = seg[p << 1] + seg[p << 1 | 1];
            } else {
                long res = 0;
                for (int l = n + pos[s], r = n + pos[s] + sz[s] - 1; l <= r; l >>= 1, r >>= 1) {
                    if ((l & 1) == 1) res += seg[l++];
                    if ((r & 1) == 0) res += seg[r--];
                }
                sb.append(res).append('\\n');
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
    parent = [0] * (n + 1); sz = [1] * (n + 1); heavy = [0] * (n + 1); order = [1]
    for u in order:
        pu = parent[u]
        for v in adj[u]:
            if v != pu: parent[v] = u; order.append(v)
    for u in reversed(order):
        mx = 0; pu = parent[u]
        for v in adj[u]:
            if v != pu:
                sz[u] += sz[v]
                if sz[v] > mx: mx = sz[v]; heavy[u] = v
    pos = [0] * (n + 1); cur = 0; st = [1]
    while st:
        u = st.pop(); pos[u] = cur; cur += 1
        pu, hu = parent[u], heavy[u]
        for v in adj[u]:
            if v != pu and v != hu: st.append(v)
        if hu: st.append(hu)
    seg = [0] * (2 * n)
    for i in range(1, n + 1): seg[n + pos[i]] = val[i]
    for i in range(n - 1, 0, -1): seg[i] = seg[i << 1] + seg[i << 1 | 1]
    out = []
    for _ in range(q):
        tp, s = int(next(it)), int(next(it))
        if tp == 1:
            p = n + pos[s]; seg[p] = int(next(it)); p >>= 1
            while p: seg[p] = seg[p << 1] + seg[p << 1 | 1]; p >>= 1
        else:
            l, r = n + pos[s], n + pos[s] + sz[s] - 1; res = 0
            while l <= r:
                if l & 1: res += seg[l]; l += 1
                if not (r & 1): res += seg[r]; r -= 1
                l >>= 1; r >>= 1
            out.append(str(res))
    sys.stdout.write("\\n".join(out) + "\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `data = STDIN.read.split.map(&:to_i)
exit if data.empty?
idx = 0; n = data[idx]; q = data[idx + 1]; idx += 2
val = [0] + data[idx, n]; idx += n
adj = Array.new(n + 1) { [] }
(n - 1).times { u = data[idx]; v = data[idx + 1]; idx += 2; adj[u] << v; adj[v] << u }
parent = Array.new(n + 1, 0); sz = Array.new(n + 1, 1); heavy = Array.new(n + 1, 0)
order = [1]; hd = 0
while hd < order.size; u = order[hd]; hd += 1; adj[u].each { |v| if v != parent[u]; parent[v] = u; order << v; end }; end
order.reverse_each do |u|
  mx = 0; adj[u].each { |v| if v != parent[u]; sz[u] += sz[v]; if sz[v] > mx; mx = sz[v]; heavy[u] = v; end; end }
end
pos = Array.new(n + 1, 0); cur = 0; st = [1]
until st.empty?
  u = st.pop; pos[u] = cur; cur += 1
  adj[u].each { |v| st << v if v != parent[u] && v != heavy[u] }
  st << heavy[u] if heavy[u] != 0
end
seg = Array.new(2 * n, 0)
(1..n).each { |i| seg[n + pos[i]] = val[i] }
(n - 1).downto(1) { |i| seg[i] = seg[i << 1] + seg[i << 1 | 1] }
out = []
q.times do
  tp = data[idx]; s = data[idx + 1]; idx += 2
  if tp == 1
    p = n + pos[s]; seg[p] = data[idx]; idx += 1; p >>= 1
    while p > 0; seg[p] = seg[p << 1] + seg[p << 1 | 1]; p >>= 1; end
  else
    l = n + pos[s]; r = n + pos[s] + sz[s] - 1; res = 0
    while l <= r
      if (l & 1) == 1; res += seg[l]; l += 1; end
      if (r & 1) == 0; res += seg[r]; r -= 1; end
      l >>= 1; r >>= 1
    end
    out << res
  end
end
puts out.join("\\n")`,
      },
    },
    {
      id: 'gr37-p2',
      tier: 'Standard',
      ratingRange: '1850–2050',
      title: 'Path Max & Path Sum Queries on Weighted Trees',
      statement:
        'Given an edge-weighted tree of N vertices (edges 1..N-1 with weights W_i), process Q queries: (1 idx newW) update edge idx’s weight to newW; (2 u v) print two integers: the maximum edge weight and the sum of edge weights along the unique simple path between u and v.',
      constraints: '2 <= N <= 10^5, 1 <= Q <= 10^5, 1 <= W_i, newW <= 10^9.',
      sampleInput: `5 4
1 2 4
1 3 2
2 4 7
2 5 3
2 4 5
2 3 4
1 3 10
2 4 5`,
      sampleOutput: `7 10
7 13
10 13`,
      hints: [
        'Push every edge `(u, v, w)` down onto its deeper endpoint (`child = depth[u] > depth[v] ? u : v`), setting `nodeEdgeIdx[edgeId] = child`.',
        'Store `(sum, max)` pairs in the iterative HLD Segment Tree; in the final step when `head[u] == head[v]`, query `[pos[u] + 1 .. pos[v]]` (ONLY if `u != v`) so the edge above the LCA is excluded!',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, q;
    if (!(cin >> n >> q)) return 0;
    struct Edge { int u, v; long long w; };
    vector<Edge> edges(n);
    vector<vector<int>> adj(n + 1);
    for (int i = 1; i < n; ++i) {
        cin >> edges[i].u >> edges[i].v >> edges[i].w;
        adj[edges[i].u].push_back(edges[i].v);
        adj[edges[i].v].push_back(edges[i].u);
    }
    vector<int> parent(n + 1, 0), depth(n + 1, 0), sz(n + 1, 1), heavy(n + 1, 0), order = {1};
    for (size_t i = 0; i < order.size(); ++i) {
        int u = order[i];
        for (int v : adj[u]) if (v != parent[u]) { parent[v] = u; depth[v] = depth[u] + 1; order.push_back(v); }
    }
    for (int i = n - 1; i >= 0; --i) {
        int u = order[i], mx = 0;
        for (int v : adj[u]) if (v != parent[u]) {
            sz[u] += sz[v]; if (sz[v] > mx) { mx = sz[v]; heavy[u] = v; }
        }
    }
    vector<int> head(n + 1, 1), pos(n + 1, 0); int cur = 0;
    vector<pair<int, int>> st = {{1, 1}};
    while (!st.empty()) {
        auto [u, h] = st.back(); st.pop_back();
        head[u] = h; pos[u] = cur++;
        for (int v : adj[u]) if (v != parent[u] && v != heavy[u]) st.push_back({v, v});
        if (heavy[u]) st.push_back({heavy[u], h});
    }
    vector<int> edgeNode(n);
    vector<long long> sTree(2 * n, 0), mTree(2 * n, 0);
    for (int i = 1; i < n; ++i) {
        int child = (depth[edges[i].u] > depth[edges[i].v]) ? edges[i].u : edges[i].v;
        edgeNode[i] = child;
        sTree[n + pos[child]] = edges[i].w;
        mTree[n + pos[child]] = edges[i].w;
    }
    for (int i = n - 1; i >= 1; --i) {
        sTree[i] = sTree[i << 1] + sTree[i << 1 | 1];
        mTree[i] = max(mTree[i << 1], mTree[i << 1 | 1]);
    }
    auto upd = [&](int p, long long w) {
        p += n; sTree[p] = w; mTree[p] = w;
        for (p >>= 1; p > 0; p >>= 1) {
            sTree[p] = sTree[p << 1] + sTree[p << 1 | 1];
            mTree[p] = max(mTree[p << 1], mTree[p << 1 | 1]);
        }
    };
    auto qryRange = [&](int l, int r, long long& sumOut, long long& maxOut) {
        for (l += n, r += n; l <= r; l >>= 1, r >>= 1) {
            if (l & 1) { sumOut += sTree[l]; maxOut = max(maxOut, mTree[l]); l++; }
            if (!(r & 1)) { sumOut += sTree[r]; maxOut = max(maxOut, mTree[r]); r--; }
        }
    };
    while (q--) {
        int tp; cin >> tp;
        if (tp == 1) {
            int id; long long w; cin >> id >> w;
            upd(pos[edgeNode[id]], w);
        } else {
            int u, v; cin >> u >> v;
            long long sumAns = 0, maxAns = 0;
            while (head[u] != head[v]) {
                if (depth[head[u]] < depth[head[v]]) swap(u, v);
                qryRange(pos[head[u]], pos[u], sumAns, maxAns);
                u = parent[head[u]];
            }
            if (depth[u] > depth[v]) swap(u, v);
            if (u != v) qryRange(pos[u] + 1, pos[v], sumAns, maxAns);
            cout << maxAns << ' ' << sumAns << '\\n';
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
    let mut edges = vec![(0usize, 0usize, 0i64); n];
    let mut adj = vec![Vec::<usize>::new(); n + 1];
    for i in 1..n {
        let u: usize = it.next().unwrap().parse().unwrap();
        let v: usize = it.next().unwrap().parse().unwrap();
        let w: i64 = it.next().unwrap().parse().unwrap();
        edges[i] = (u, v, w);
        adj[u].push(v); adj[v].push(u);
    }
    let mut parent = vec![0usize; n + 1];
    let mut depth = vec![0usize; n + 1];
    let mut sz = vec![1usize; n + 1];
    let mut heavy = vec![0usize; n + 1];
    let mut order = Vec::with_capacity(n); order.push(1);
    for i in 0..n {
        let u = order[i];
        for &v in &adj[u] { if v != parent[u] { parent[v] = u; depth[v] = depth[u] + 1; order.push(v); } }
    }
    for &u in order.iter().rev() {
        let mut mx = 0;
        for &v in &adj[u] { if v != parent[u] { sz[u] += sz[v]; if sz[v] > mx { mx = sz[v]; heavy[u] = v; } } }
    }
    let mut head = vec![1usize; n + 1];
    let mut pos = vec![0usize; n + 1];
    let mut cur = 0usize;
    let mut st = vec![(1usize, 1usize)];
    while let Some((u, h)) = st.pop() {
        head[u] = h; pos[u] = cur; cur += 1;
        for &v in &adj[u] { if v != parent[u] && v != heavy[u] { st.push((v, v)); } }
        if heavy[u] != 0 { st.push((heavy[u], h)); }
    }
    let mut edge_node = vec![0usize; n];
    let mut stree = vec![0i64; 2 * n];
    let mut mtree = vec![0i64; 2 * n];
    for i in 1..n {
        let child = if depth[edges[i].0] > depth[edges[i].1] { edges[i].0 } else { edges[i].1 };
        edge_node[i] = child;
        stree[n + pos[child]] = edges[i].2;
        mtree[n + pos[child]] = edges[i].2;
    }
    for i in (1..n).rev() {
        stree[i] = stree[i << 1] + stree[i << 1 | 1];
        mtree[i] = mtree[i << 1].max(mtree[i << 1 | 1]);
    }
    let mut out = String::new();
    for _ in 0..q {
        let tp: usize = it.next().unwrap().parse().unwrap();
        if tp == 1 {
            let id: usize = it.next().unwrap().parse().unwrap();
            let w: i64 = it.next().unwrap().parse().unwrap();
            let mut p = n + pos[edge_node[id]];
            stree[p] = w; mtree[p] = w; p >>= 1;
            while p > 0 {
                stree[p] = stree[p << 1] + stree[p << 1 | 1];
                mtree[p] = mtree[p << 1].max(mtree[p << 1 | 1]);
                p >>= 1;
            }
        } else {
            let mut u: usize = it.next().unwrap().parse().unwrap();
            let mut v: usize = it.next().unwrap().parse().unwrap();
            let (mut s_ans, mut m_ans) = (0i64, 0i64);
            while head[u] != head[v] {
                if depth[head[u]] < depth[head[v]] { std::mem::swap(&mut u, &mut v); }
                let (mut l, mut r) = (n + pos[head[u]], n + pos[u]);
                while l <= r {
                    if l & 1 == 1 { s_ans += stree[l]; m_ans = m_ans.max(mtree[l]); l += 1; }
                    if r & 1 == 0 { s_ans += stree[r]; m_ans = m_ans.max(mtree[r]); r -= 1; }
                    l >>= 1; r >>= 1;
                }
                u = parent[head[u]];
            }
            if depth[u] > depth[v] { std::mem::swap(&mut u, &mut v); }
            if u != v {
                let (mut l, mut r) = (n + pos[u] + 1, n + pos[v]);
                while l <= r {
                    if l & 1 == 1 { s_ans += stree[l]; m_ans = m_ans.max(mtree[l]); l += 1; }
                    if r & 1 == 0 { s_ans += stree[r]; m_ans = m_ans.max(mtree[r]); r -= 1; }
                    l >>= 1; r >>= 1;
                }
            }
            out.push_str(&format!("{} {}\\n", m_ans, s_ans));
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

    static long[] sTree, mTree;
    static int N;
    static long sumAns, maxAns;

    static void qryRange(int l, int r) {
        for (l += N, r += N; l <= r; l >>= 1, r >>= 1) {
            if ((l & 1) == 1) { sumAns += sTree[l]; maxAns = Math.max(maxAns, mTree[l]); l++; }
            if ((r & 1) == 0) { sumAns += sTree[r]; maxAns = Math.max(maxAns, mTree[r]); r--; }
        }
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        long f = fs.nextLong(); if (f == Long.MIN_VALUE) return;
        N = (int) f; int q = fs.nextInt();
        int[] eu = new int[N], ev = new int[N]; long[] ew = new long[N];
        int[] headAdj = new int[N + 1]; Arrays.fill(headAdj, -1);
        int[] to = new int[2 * N], next = new int[2 * N]; int ptr = 0;
        for (int i = 1; i < N; i++) {
            eu[i] = fs.nextInt(); ev[i] = fs.nextInt(); ew[i] = fs.nextLong();
            to[ptr] = ev[i]; next[ptr] = headAdj[eu[i]]; headAdj[eu[i]] = ptr++;
            to[ptr] = eu[i]; next[ptr] = headAdj[ev[i]]; headAdj[ev[i]] = ptr++;
        }
        int[] parent = new int[N + 1], depth = new int[N + 1], sz = new int[N + 1], heavy = new int[N + 1], order = new int[N];
        Arrays.fill(sz, 1); int tl = 0; order[tl++] = 1;
        for (int i = 0; i < N; i++) {
            int u = order[i];
            for (int e = headAdj[u]; e != -1; e = next[e]) if (to[e] != parent[u]) {
                parent[to[e]] = u; depth[to[e]] = depth[u] + 1; order[tl++] = to[e];
            }
        }
        for (int i = N - 1; i >= 0; i--) {
            int u = order[i], mx = 0;
            for (int e = headAdj[u]; e != -1; e = next[e]) {
                int v = to[e]; if (v != parent[u]) { sz[u] += sz[v]; if (sz[v] > mx) { mx = sz[v]; heavy[u] = v; } }
            }
        }
        int[] chainHead = new int[N + 1], pos = new int[N + 1], stU = new int[N + 1], stH = new int[N + 1];
        int top = 0, cur = 0; stU[top] = 1; stH[top] = 1; top++;
        while (top > 0) {
            top--; int u = stU[top], h = stH[top];
            chainHead[u] = h; pos[u] = cur++;
            for (int e = headAdj[u]; e != -1; e = next[e]) if (to[e] != parent[u] && to[e] != heavy[u]) { stU[top] = to[e]; stH[top] = to[e]; top++; }
            if (heavy[u] != 0) { stU[top] = heavy[u]; stH[top] = h; top++; }
        }
        int[] edgeNode = new int[N]; sTree = new long[2 * N]; mTree = new long[2 * N];
        for (int i = 1; i < N; i++) {
            int ch = depth[eu[i]] > depth[ev[i]] ? eu[i] : ev[i];
            edgeNode[i] = ch; sTree[N + pos[ch]] = ew[i]; mTree[N + pos[ch]] = ew[i];
        }
        for (int i = N - 1; i >= 1; i--) {
            sTree[i] = sTree[i << 1] + sTree[i << 1 | 1];
            mTree[i] = Math.max(mTree[i << 1], mTree[i << 1 | 1]);
        }
        StringBuilder sb = new StringBuilder();
        while (q-- > 0) {
            int tp = fs.nextInt();
            if (tp == 1) {
                int id = fs.nextInt(); long w = fs.nextLong();
                int p = N + pos[edgeNode[id]]; sTree[p] = w; mTree[p] = w;
                for (p >>= 1; p > 0; p >>= 1) {
                    sTree[p] = sTree[p << 1] + sTree[p << 1 | 1];
                    mTree[p] = Math.max(mTree[p << 1], mTree[p << 1 | 1]);
                }
            } else {
                int u = fs.nextInt(), v = fs.nextInt();
                sumAns = 0; maxAns = 0;
                while (chainHead[u] != chainHead[v]) {
                    if (depth[chainHead[u]] < depth[chainHead[v]]) { int t = u; u = v; v = t; }
                    qryRange(pos[chainHead[u]], pos[u]); u = parent[chainHead[u]];
                }
                if (depth[u] > depth[v]) { int t = u; u = v; v = t; }
                if (u != v) qryRange(pos[u] + 1, pos[v]);
                sb.append(maxAns).append(' ').append(sumAns).append('\\n');
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
    edges = [None] * n
    adj = [[] for _ in range(n + 1)]
    for i in range(1, n):
        u, v, w = int(next(it)), int(next(it)), int(next(it))
        edges[i] = (u, v, w)
        adj[u].append(v); adj[v].append(u)
    parent = [0] * (n + 1); depth = [0] * (n + 1); sz = [1] * (n + 1); heavy = [0] * (n + 1); order = [1]
    for u in order:
        pu = parent[u]
        for v in adj[u]:
            if v != pu: parent[v] = u; depth[v] = depth[u] + 1; order.append(v)
    for u in reversed(order):
        mx = 0; pu = parent[u]
        for v in adj[u]:
            if v != pu:
                sz[u] += sz[v]
                if sz[v] > mx: mx = sz[v]; heavy[u] = v
    head = [1] * (n + 1); pos = [0] * (n + 1); cur = 0; st = [(1, 1)]
    while st:
        u, h = st.pop(); head[u] = h; pos[u] = cur; cur += 1
        pu, hu = parent[u], heavy[u]
        for v in adj[u]:
            if v != pu and v != hu: st.append((v, v))
        if hu: st.append((hu, h))
    edge_node = [0] * n; s_tr = [0] * (2 * n); m_tr = [0] * (2 * n)
    for i in range(1, n):
        u, v, w = edges[i]
        ch = u if depth[u] > depth[v] else v
        edge_node[i] = ch; s_tr[n + pos[ch]] = w; m_tr[n + pos[ch]] = w
    for i in range(n - 1, 0, -1):
        s_tr[i] = s_tr[i << 1] + s_tr[i << 1 | 1]
        a, b = m_tr[i << 1], m_tr[i << 1 | 1]
        m_tr[i] = a if a > b else b
    out = []
    for _ in range(q):
        tp = int(next(it))
        if tp == 1:
            eid, w = int(next(it)), int(next(it))
            p = n + pos[edge_node[eid]]; s_tr[p] = w; m_tr[p] = w; p >>= 1
            while p:
                s_tr[p] = s_tr[p << 1] + s_tr[p << 1 | 1]
                a, b = m_tr[p << 1], m_tr[p << 1 | 1]
                m_tr[p] = a if a > b else b
                p >>= 1
        else:
            u, v = int(next(it)), int(next(it))
            s_ans = m_ans = 0
            while head[u] != head[v]:
                if depth[head[u]] < depth[head[v]]: u, v = v, u
                l, r = n + pos[head[u]], n + pos[u]
                while l <= r:
                    if l & 1: s_ans += s_tr[l]; m_ans = m_ans if m_ans > m_tr[l] else m_tr[l]; l += 1
                    if not (r & 1): s_ans += s_tr[r]; m_ans = m_ans if m_ans > m_tr[r] else m_tr[r]; r -= 1
                    l >>= 1; r >>= 1
                u = parent[head[u]]
            if depth[u] > depth[v]: u, v = v, u
            if u != v:
                l, r = n + pos[u] + 1, n + pos[v]
                while l <= r:
                    if l & 1: s_ans += s_tr[l]; m_ans = m_ans if m_ans > m_tr[l] else m_tr[l]; l += 1
                    if not (r & 1): s_ans += s_tr[r]; m_ans = m_ans if m_ans > m_tr[r] else m_tr[r]; r -= 1
                    l >>= 1; r >>= 1
            out.append(f"{m_ans} {s_ans}")
    sys.stdout.write("\\n".join(out) + "\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `data = STDIN.read.split.map(&:to_i)
exit if data.empty?
idx = 0; n = data[idx]; q = data[idx + 1]; idx += 2
edges = Array.new(n)
adj = Array.new(n + 1) { [] }
(1...n).each do |i|
  u = data[idx]; v = data[idx + 1]; w = data[idx + 2]; idx += 3
  edges[i] = [u, v, w]; adj[u] << v; adj[v] << u
end
parent = Array.new(n + 1, 0); depth = Array.new(n + 1, 0); sz = Array.new(n + 1, 1); heavy = Array.new(n + 1, 0)
order = [1]; hd = 0
while hd < order.size; u = order[hd]; hd += 1; adj[u].each { |v| if v != parent[u]; parent[v] = u; depth[v] = depth[u] + 1; order << v; end }; end
order.reverse_each do |u|
  mx = 0; adj[u].each { |v| if v != parent[u]; sz[u] += sz[v]; if sz[v] > mx; mx = sz[v]; heavy[u] = v; end; end }
end
head = Array.new(n + 1, 1); pos = Array.new(n + 1, 0); cur = 0; st = [[1, 1]]
until st.empty?
  u, h = st.pop; head[u] = h; pos[u] = cur; cur += 1
  adj[u].each { |v| st << [v, v] if v != parent[u] && v != heavy[u] }
  st << [heavy[u], h] if heavy[u] != 0
end
edge_node = Array.new(n, 0); s_tr = Array.new(2 * n, 0); m_tr = Array.new(2 * n, 0)
(1...n).each do |i|
  u, v, w = edges[i]; ch = depth[u] > depth[v] ? u : v
  edge_node[i] = ch; s_tr[n + pos[ch]] = w; m_tr[n + pos[ch]] = w
end
(n - 1).downto(1) do |i|
  s_tr[i] = s_tr[i << 1] + s_tr[i << 1 | 1]
  a = m_tr[i << 1]; b = m_tr[i << 1 | 1]; m_tr[i] = a > b ? a : b
end
out = []
q.times do
  tp = data[idx]; idx += 1
  if tp == 1
    eid = data[idx]; w = data[idx + 1]; idx += 2
    p = n + pos[edge_node[eid]]; s_tr[p] = w; m_tr[p] = w; p >>= 1
    while p > 0
      s_tr[p] = s_tr[p << 1] + s_tr[p << 1 | 1]
      a = m_tr[p << 1]; b = m_tr[p << 1 | 1]; m_tr[p] = a > b ? a : b; p >>= 1
    end
  else
    u = data[idx]; v = data[idx + 1]; idx += 2; s_ans = 0; m_ans = 0
    while head[u] != head[v]
      u, v = v, u if depth[head[u]] < depth[head[v]]
      l = n + pos[head[u]]; r = n + pos[u]
      while l <= r
        if (l & 1) == 1; s_ans += s_tr[l]; m_ans = m_tr[l] if m_tr[l] > m_ans; l += 1; end
        if (r & 1) == 0; s_ans += s_tr[r]; m_ans = m_tr[r] if m_tr[r] > m_ans; r -= 1; end
        l >>= 1; r >>= 1
      end
      u = parent[head[u]]
    end
    u, v = v, u if depth[u] > depth[v]
    if u != v
      l = n + pos[u] + 1; r = n + pos[v]
      while l <= r
        if (l & 1) == 1; s_ans += s_tr[l]; m_ans = m_tr[l] if m_tr[l] > m_ans; l += 1; end
        if (r & 1) == 0; s_ans += s_tr[r]; m_ans = m_tr[r] if m_tr[r] > m_ans; r -= 1; end
        l >>= 1; r >>= 1
      end
    end
    out << "#{m_ans} #{s_ans}"
  end
end
puts out.join("\\n")`,
      },
    },
    {
      id: 'gr37-p3',
      tier: 'Boss',
      ratingRange: '2100–2300',
      title: 'HLD + Lazy Propagation: Dynamic Path & Subtree Range Add + Root Rerooting',
      statement:
        'Maintain a tree of N vertices (initial values V[i]) supporting Q operations: (1 r) change the active root to node r; (2 u v x) add +x to every vertex along path(u, v); (3 u) output the sum of vertex values in the subtree of u under the CURRENT root r.',
      constraints: '1 <= N, Q <= 10^5, |V[i]|, |x| <= 10^9.',
      sampleInput: `5 4
1 2 3 4 5
1 2
1 3
2 4
2 5
2 4 5 10
3 2
1 4
3 2`,
      sampleOutput: `31
28`,
      hints: [
        'Build HLD + Lazy Sum Segment Tree ONCE rooted at node 1! Path updates (operation 2) are invariant to which node is currently the root—just call `pathAdd(u, v, x)` as usual.',
        'For operation 3 (`subtreeSum(u)` under current root `r`): if `r == u`, query whole tree `[0..n-1]`; if `r` is NOT strictly inside `u`’s fixed-root-1 subtree, query `[pos[u], pos[u] + sz[u] - 1]`; if `r` IS inside `u`’s subtree, let `c` be the child of `u` containing `r` (found via binary lifting!) -> answer is `wholeTree - query(pos[c], pos[c] + sz[c] - 1)`!',
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

    const int LOG = 18;
    vector<vector<int>> up(LOG, vector<int>(n + 1, 1));
    vector<int> parent(n + 1, 0), depth(n + 1, 0), sz(n + 1, 1), heavy(n + 1, 0), order = {1};
    for (size_t i = 0; i < order.size(); ++i) {
        int u = order[i];
        up[0][u] = (parent[u] == 0 ? 1 : parent[u]);
        for (int v : adj[u]) if (v != parent[u]) {
            parent[v] = u; depth[v] = depth[u] + 1; order.push_back(v);
        }
    }
    for (int k = 1; k < LOG; ++k)
        for (int v = 1; v <= n; ++v) up[k][v] = up[k - 1][up[k - 1][v]];
    for (int i = n - 1; i >= 0; --i) {
        int u = order[i], mx = 0;
        for (int v : adj[u]) if (v != parent[u]) {
            sz[u] += sz[v]; if (sz[v] > mx) { mx = sz[v]; heavy[u] = v; }
        }
    }
    vector<int> head(n + 1, 1), pos(n + 1, 0); int cur = 0;
    vector<pair<int, int>> st = {{1, 1}};
    while (!st.empty()) {
        auto [u, h] = st.back(); st.pop_back();
        head[u] = h; pos[u] = cur++;
        for (int v : adj[u]) if (v != parent[u] && v != heavy[u]) st.push_back({v, v});
        if (heavy[u]) st.push_back({heavy[u], h});
    }

    vector<long long> tr(4 * n + 4, 0), lz(4 * n + 4, 0), base(n);
    for (int i = 1; i <= n; ++i) base[pos[i]] = val[i];
    auto build = [&](auto&& self, int u, int l, int r) -> void {
        if (l == r) { tr[u] = base[l]; return; }
        int m = (l + r) >> 1;
        self(self, u << 1, l, m); self(self, u << 1 | 1, m + 1, r);
        tr[u] = tr[u << 1] + tr[u << 1 | 1];
    };
    auto apply = [&](int u, int l, int r, long long v) { tr[u] += v * (r - l + 1); lz[u] += v; };
    auto push = [&](int u, int l, int r) {
        if (lz[u] && l < r) {
            int m = (l + r) >> 1;
            apply(u << 1, l, m, lz[u]); apply(u << 1 | 1, m + 1, r, lz[u]); lz[u] = 0;
        }
    };
    auto upd = [&](auto&& self, int u, int l, int r, int ql, int qr, long long v) -> void {
        if (ql <= l && r <= qr) { apply(u, l, r, v); return; }
        push(u, l, r); int m = (l + r) >> 1;
        if (ql <= m) self(self, u << 1, l, m, ql, qr, v);
        if (qr > m) self(self, u << 1 | 1, m + 1, r, ql, qr, v);
        tr[u] = tr[u << 1] + tr[u << 1 | 1];
    };
    auto qry = [&](auto&& self, int u, int l, int r, int ql, int qr) -> long long {
        if (ql <= l && r <= qr) return tr[u];
        push(u, l, r); int m = (l + r) >> 1; long long res = 0;
        if (ql <= m) res += self(self, u << 1, l, m, ql, qr);
        if (qr > m) res += self(self, u << 1 | 1, m + 1, r, ql, qr);
        return res;
    };
    build(build, 1, 0, n - 1);

    auto lift = [&](int u, int steps) {
        for (int k = 0; k < LOG; ++k) if ((steps >> k) & 1) u = up[k][u];
        return u;
    };

    int root = 1;
    while (q--) {
        int tp; cin >> tp;
        if (tp == 1) {
            cin >> root;
        } else if (tp == 2) {
            int u, v; long long x; cin >> u >> v >> x;
            while (head[u] != head[v]) {
                if (depth[head[u]] < depth[head[v]]) swap(u, v);
                upd(upd, 1, 0, n - 1, pos[head[u]], pos[u], x);
                u = parent[head[u]];
            }
            if (depth[u] > depth[v]) swap(u, v);
            upd(upd, 1, 0, n - 1, pos[u], pos[v], x);
        } else {
            int u; cin >> u;
            if (u == root) {
                cout << tr[1] << '\\n';
            } else if (pos[u] <= pos[root] && pos[root] < pos[u] + sz[u]) {
                int c = lift(root, depth[root] - depth[u] - 1);
                cout << tr[1] - qry(qry, 1, 0, n - 1, pos[c], pos[c] + sz[c] - 1) << '\\n';
            } else {
                cout << qry(qry, 1, 0, n - 1, pos[u], pos[u] + sz[u] - 1) << '\\n';
            }
        }
    }
    return 0;
}`,
        rust: `use std::io::{self, Read};

struct LazySeg { tr: Vec<i64>, lz: Vec<i64> }
impl LazySeg {
    fn new(a: &[i64]) -> Self {
        let n = a.len();
        let mut s = Self { tr: vec![0; 4 * n + 4], lz: vec![0; 4 * n + 4] };
        s.build(1, 0, n - 1, a);
        s
    }
    fn build(&mut self, u: usize, l: usize, r: usize, a: &[i64]) {
        if l == r { self.tr[u] = a[l]; return; }
        let m = (l + r) >> 1;
        self.build(u << 1, l, m, a); self.build(u << 1 | 1, m + 1, r, a);
        self.tr[u] = self.tr[u << 1] + self.tr[u << 1 | 1];
    }
    fn apply(&mut self, u: usize, l: usize, r: usize, v: i64) {
        self.tr[u] += v * (r - l + 1) as i64; self.lz[u] += v;
    }
    fn push(&mut self, u: usize, l: usize, r: usize) {
        if self.lz[u] != 0 && l < r {
            let v = self.lz[u]; let m = (l + r) >> 1;
            self.apply(u << 1, l, m, v); self.apply(u << 1 | 1, m + 1, r, v); self.lz[u] = 0;
        }
    }
    fn upd(&mut self, u: usize, l: usize, r: usize, ql: usize, qr: usize, v: i64) {
        if ql <= l && r <= qr { self.apply(u, l, r, v); return; }
        self.push(u, l, r); let m = (l + r) >> 1;
        if ql <= m { self.upd(u << 1, l, m, ql, qr, v); }
        if qr > m { self.upd(u << 1 | 1, m + 1, r, ql, qr, v); }
        self.tr[u] = self.tr[u << 1] + self.tr[u << 1 | 1];
    }
    fn qry(&mut self, u: usize, l: usize, r: usize, ql: usize, qr: usize) -> i64 {
        if ql <= l && r <= qr { return self.tr[u]; }
        self.push(u, l, r); let m = (l + r) >> 1; let mut s = 0;
        if ql <= m { s += self.qry(u << 1, l, m, ql, qr); }
        if qr > m { s += self.qry(u << 1 | 1, m + 1, r, ql, qr); }
        s
    }
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
    const LOG: usize = 18;
    let mut up = vec![vec![1usize; n + 1]; LOG];
    let mut parent = vec![0usize; n + 1];
    let mut depth = vec![0usize; n + 1];
    let mut sz = vec![1usize; n + 1];
    let mut heavy = vec![0usize; n + 1];
    let mut order = Vec::with_capacity(n); order.push(1);
    for i in 0..n {
        let u = order[i];
        up[0][u] = if parent[u] == 0 { 1 } else { parent[u] };
        for &v in &adj[u] {
            if v != parent[u] { parent[v] = u; depth[v] = depth[u] + 1; order.push(v); }
        }
    }
    for k in 1..LOG { for v in 1..=n { up[k][v] = up[k - 1][up[k - 1][v]]; } }
    for &u in order.iter().rev() {
        let mut mx = 0;
        for &v in &adj[u] { if v != parent[u] { sz[u] += sz[v]; if sz[v] > mx { mx = sz[v]; heavy[u] = v; } } }
    }
    let mut head = vec![1usize; n + 1];
    let mut pos = vec![0usize; n + 1];
    let mut cur = 0usize;
    let mut st = vec![(1usize, 1usize)];
    while let Some((u, h)) = st.pop() {
        head[u] = h; pos[u] = cur; cur += 1;
        for &v in &adj[u] { if v != parent[u] && v != heavy[u] { st.push((v, v)); } }
        if heavy[u] != 0 { st.push((heavy[u], h)); }
    }
    let mut base = vec![0i64; n];
    for i in 1..=n { base[pos[i]] = val[i]; }
    let mut seg = LazySeg::new(&base);
    let mut root = 1usize;
    let mut out = String::new();
    for _ in 0..q {
        let tp: usize = it.next().unwrap().parse().unwrap();
        if tp == 1 {
            root = it.next().unwrap().parse().unwrap();
        } else if tp == 2 {
            let mut u: usize = it.next().unwrap().parse().unwrap();
            let mut v: usize = it.next().unwrap().parse().unwrap();
            let x: i64 = it.next().unwrap().parse().unwrap();
            while head[u] != head[v] {
                if depth[head[u]] < depth[head[v]] { std::mem::swap(&mut u, &mut v); }
                seg.upd(1, 0, n - 1, pos[head[u]], pos[u], x);
                u = parent[head[u]];
            }
            if depth[u] > depth[v] { std::mem::swap(&mut u, &mut v); }
            seg.upd(1, 0, n - 1, pos[u], pos[v], x);
        } else {
            let u: usize = it.next().unwrap().parse().unwrap();
            let ans = if u == root {
                seg.tr[1]
            } else if pos[u] <= pos[root] && pos[root] < pos[u] + sz[u] {
                let mut c = root;
                let steps = depth[root] - depth[u] - 1;
                for k in 0..LOG { if (steps >> k) & 1 == 1 { c = up[k][c]; } }
                seg.tr[1] - seg.qry(1, 0, n - 1, pos[c], pos[c] + sz[c] - 1)
            } else {
                seg.qry(1, 0, n - 1, pos[u], pos[u] + sz[u] - 1)
            };
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

    static long[] tr, lz, base;
    static void build(int u, int l, int r) {
        if (l == r) { tr[u] = base[l]; return; }
        int m = (l + r) >>> 1; build(u << 1, l, m); build(u << 1 | 1, m + 1, r);
        tr[u] = tr[u << 1] + tr[u << 1 | 1];
    }
    static void apply(int u, int l, int r, long v) { tr[u] += v * (r - l + 1L); lz[u] += v; }
    static void push(int u, int l, int r) {
        if (lz[u] != 0 && l < r) {
            int m = (l + r) >>> 1;
            apply(u << 1, l, m, lz[u]); apply(u << 1 | 1, m + 1, r, lz[u]); lz[u] = 0;
        }
    }
    static void upd(int u, int l, int r, int ql, int qr, long v) {
        if (ql <= l && r <= qr) { apply(u, l, r, v); return; }
        push(u, l, r); int m = (l + r) >>> 1;
        if (ql <= m) upd(u << 1, l, m, ql, qr, v);
        if (qr > m) upd(u << 1 | 1, m + 1, r, ql, qr, v);
        tr[u] = tr[u << 1] + tr[u << 1 | 1];
    }
    static long qry(int u, int l, int r, int ql, int qr) {
        if (ql <= l && r <= qr) return tr[u];
        push(u, l, r); int m = (l + r) >>> 1; long s = 0;
        if (ql <= m) s += qry(u << 1, l, m, ql, qr);
        if (qr > m) s += qry(u << 1 | 1, m + 1, r, ql, qr);
        return s;
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        long f = fs.nextLong(); if (f == Long.MIN_VALUE) return;
        int n = (int) f, q = fs.nextInt();
        long[] val = new long[n + 1]; for (int i = 1; i <= n; i++) val[i] = fs.nextLong();
        int[] headAdj = new int[n + 1]; Arrays.fill(headAdj, -1);
        int[] to = new int[2 * n], next = new int[2 * n]; int ptr = 0;
        for (int i = 0; i < n - 1; i++) {
            int u = fs.nextInt(), v = fs.nextInt();
            to[ptr] = v; next[ptr] = headAdj[u]; headAdj[u] = ptr++;
            to[ptr] = u; next[ptr] = headAdj[v]; headAdj[v] = ptr++;
        }
        final int LOG = 18;
        int[][] up = new int[LOG][n + 1];
        int[] parent = new int[n + 1], depth = new int[n + 1], sz = new int[n + 1], heavy = new int[n + 1], order = new int[n];
        Arrays.fill(sz, 1); int tl = 0; order[tl++] = 1;
        for (int i = 0; i < n; i++) {
            int u = order[i]; up[0][u] = parent[u] == 0 ? 1 : parent[u];
            for (int e = headAdj[u]; e != -1; e = next[e]) if (to[e] != parent[u]) {
                parent[to[e]] = u; depth[to[e]] = depth[u] + 1; order[tl++] = to[e];
            }
        }
        for (int k = 1; k < LOG; k++) for (int v = 1; v <= n; v++) up[k][v] = up[k - 1][up[k - 1][v]];
        for (int i = n - 1; i >= 0; i--) {
            int u = order[i], mx = 0;
            for (int e = headAdj[u]; e != -1; e = next[e]) {
                int v = to[e]; if (v != parent[u]) { sz[u] += sz[v]; if (sz[v] > mx) { mx = sz[v]; heavy[u] = v; } }
            }
        }
        int[] chainHead = new int[n + 1], pos = new int[n + 1], stU = new int[n + 1], stH = new int[n + 1];
        int top = 0, cur = 0; stU[top] = 1; stH[top] = 1; top++;
        while (top > 0) {
            top--; int u = stU[top], h = stH[top]; chainHead[u] = h; pos[u] = cur++;
            for (int e = headAdj[u]; e != -1; e = next[e]) if (to[e] != parent[u] && to[e] != heavy[u]) { stU[top] = to[e]; stH[top] = to[e]; top++; }
            if (heavy[u] != 0) { stU[top] = heavy[u]; stH[top] = h; top++; }
        }
        base = new long[n]; for (int i = 1; i <= n; i++) base[pos[i]] = val[i];
        tr = new long[4 * n + 4]; lz = new long[4 * n + 4]; build(1, 0, n - 1);
        int root = 1;
        StringBuilder sb = new StringBuilder();
        while (q-- > 0) {
            int tp = fs.nextInt();
            if (tp == 1) { root = fs.nextInt(); }
            else if (tp == 2) {
                int u = fs.nextInt(), v = fs.nextInt(); long x = fs.nextLong();
                while (chainHead[u] != chainHead[v]) {
                    if (depth[chainHead[u]] < depth[chainHead[v]]) { int t = u; u = v; v = t; }
                    upd(1, 0, n - 1, pos[chainHead[u]], pos[u], x); u = parent[chainHead[u]];
                }
                if (depth[u] > depth[v]) { int t = u; u = v; v = t; }
                upd(1, 0, n - 1, pos[u], pos[v], x);
            } else {
                int u = fs.nextInt();
                if (u == root) sb.append(tr[1]).append('\\n');
                else if (pos[u] <= pos[root] && pos[root] < pos[u] + sz[u]) {
                    int c = root, steps = depth[root] - depth[u] - 1;
                    for (int k = 0; k < LOG; k++) if (((steps >> k) & 1) == 1) c = up[k][c];
                    sb.append(tr[1] - qry(1, 0, n - 1, pos[c], pos[c] + sz[c] - 1)).append('\\n');
                } else sb.append(qry(1, 0, n - 1, pos[u], pos[u] + sz[u] - 1)).append('\\n');
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
    LOG = 18
    up = [[1] * (n + 1) for _ in range(LOG)]
    parent = [0] * (n + 1); depth = [0] * (n + 1); sz = [1] * (n + 1); heavy = [0] * (n + 1); order = [1]
    for u in order:
        up[0][u] = parent[u] if parent[u] else 1
        pu = parent[u]
        for v in adj[u]:
            if v != pu: parent[v] = u; depth[v] = depth[u] + 1; order.append(v)
    for k in range(1, LOG):
        pr, cr = up[k - 1], up[k]
        for v in range(1, n + 1): cr[v] = pr[pr[v]]
    for u in reversed(order):
        mx = 0; pu = parent[u]
        for v in adj[u]:
            if v != pu:
                sz[u] += sz[v]
                if sz[v] > mx: mx = sz[v]; heavy[u] = v
    head = [1] * (n + 1); pos = [0] * (n + 1); cur = 0; st = [(1, 1)]
    while st:
        u, h = st.pop(); head[u] = h; pos[u] = cur; cur += 1
        pu, hu = parent[u], heavy[u]
        for v in adj[u]:
            if v != pu and v != hu: st.append((v, v))
        if hu: st.append((hu, h))
    base = [0] * n
    for i in range(1, n + 1): base[pos[i]] = val[i]
    tr = [0] * (4 * n + 4); lz = [0] * (4 * n + 4)

    def build(u, l, r):
        if l == r: tr[u] = base[l]; return
        m = (l + r) >> 1; build(u << 1, l, m); build(u << 1 | 1, m + 1, r)
        tr[u] = tr[u << 1] + tr[u << 1 | 1]
    def apply(u, l, r, v): tr[u] += v * (r - l + 1); lz[u] += v
    def push(u, l, r):
        if lz[u] and l < r:
            m = (l + r) >> 1; apply(u << 1, l, m, lz[u]); apply(u << 1 | 1, m + 1, r, lz[u]); lz[u] = 0
    def upd(u, l, r, ql, qr, v):
        if ql <= l and r <= qr: apply(u, l, r, v); return
        push(u, l, r); m = (l + r) >> 1
        if ql <= m: upd(u << 1, l, m, ql, qr, v)
        if qr > m: upd(u << 1 | 1, m + 1, r, ql, qr, v)
        tr[u] = tr[u << 1] + tr[u << 1 | 1]
    def qry(u, l, r, ql, qr):
        if ql <= l and r <= qr: return tr[u]
        push(u, l, r); m = (l + r) >> 1; res = 0
        if ql <= m: res += qry(u << 1, l, m, ql, qr)
        if qr > m: res += qry(u << 1 | 1, m + 1, r, ql, qr)
        return res

    build(1, 0, n - 1); root = 1; out = []
    for _ in range(q):
        tp = int(next(it))
        if tp == 1: root = int(next(it))
        elif tp == 2:
            u, v, x = int(next(it)), int(next(it)), int(next(it))
            while head[u] != head[v]:
                if depth[head[u]] < depth[head[v]]: u, v = v, u
                upd(1, 0, n - 1, pos[head[u]], pos[u], x); u = parent[head[u]]
            if depth[u] > depth[v]: u, v = v, u
            upd(1, 0, n - 1, pos[u], pos[v], x)
        else:
            u = int(next(it))
            if u == root: out.append(str(tr[1]))
            elif pos[u] <= pos[root] < pos[u] + sz[u]:
                c = root; steps = depth[root] - depth[u] - 1
                for k in range(LOG):
                    if (steps >> k) & 1: c = up[k][c]
                out.append(str(tr[1] - qry(1, 0, n - 1, pos[c], pos[c] + sz[c] - 1)))
            else:
                out.append(str(qry(1, 0, n - 1, pos[u], pos[u] + sz[u] - 1)))
    sys.stdout.write("\\n".join(out) + "\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `data = STDIN.read.split.map(&:to_i)
exit if data.empty?
idx = 0; n = data[idx]; q = data[idx + 1]; idx += 2
val = [0] + data[idx, n]; idx += n
adj = Array.new(n + 1) { [] }
(n - 1).times { u = data[idx]; v = data[idx + 1]; idx += 2; adj[u] << v; adj[v] << u }
log = 18
up = Array.new(log) { Array.new(n + 1, 1) }
parent = Array.new(n + 1, 0); depth = Array.new(n + 1, 0); sz = Array.new(n + 1, 1); heavy = Array.new(n + 1, 0)
order = [1]; hd = 0
while hd < order.size
  u = order[hd]; hd += 1; up[0][u] = parent[u] == 0 ? 1 : parent[u]
  adj[u].each { |v| if v != parent[u]; parent[v] = u; depth[v] = depth[u] + 1; order << v; end }
end
(1...log).each { |k| (1..n).each { |v| up[k][v] = up[k - 1][up[k - 1][v]] } }
order.reverse_each do |u|
  mx = 0; adj[u].each { |v| if v != parent[u]; sz[u] += sz[v]; if sz[v] > mx; mx = sz[v]; heavy[u] = v; end; end }
end
head = Array.new(n + 1, 1); pos = Array.new(n + 1, 0); cur = 0; st = [[1, 1]]
until st.empty?
  u, h = st.pop; head[u] = h; pos[u] = cur; cur += 1
  adj[u].each { |v| st << [v, v] if v != parent[u] && v != heavy[u] }
  st << [heavy[u], h] if heavy[u] != 0
end
base = Array.new(n, 0); (1..n).each { |i| base[pos[i]] = val[i] }
tr = Array.new(4 * n + 4, 0); lz = Array.new(4 * n + 4, 0)
build = nil
build = ->(u, l, r) { if l == r; tr[u] = base[l]; return; end; m = (l + r) >> 1; build.call(u << 1, l, m); build.call(u << 1 | 1, m + 1, r); tr[u] = tr[u << 1] + tr[u << 1 | 1] }
apply_t = ->(u, l, r, v) { tr[u] += v * (r - l + 1); lz[u] += v }
push = ->(u, l, r) { if lz[u] != 0 && l < r; m = (l + r) >> 1; apply_t.call(u << 1, l, m, lz[u]); apply_t.call(u << 1 | 1, m + 1, r, lz[u]); lz[u] = 0; end }
upd = nil
upd = ->(u, l, r, ql, qr, v) { if ql <= l && r <= qr; apply_t.call(u, l, r, v); return; end; push.call(u, l, r); m = (l + r) >> 1; upd.call(u << 1, l, m, ql, qr, v) if ql <= m; upd.call(u << 1 | 1, m + 1, r, ql, qr, v) if qr > m; tr[u] = tr[u << 1] + tr[u << 1 | 1] }
qry = nil
qry = ->(u, l, r, ql, qr) { return tr[u] if ql <= l && r <= qr; push.call(u, l, r); m = (l + r) >> 1; res = 0; res += qry.call(u << 1, l, m, ql, qr) if ql <= m; res += qry.call(u << 1 | 1, m + 1, r, ql, qr) if qr > m; res }
build.call(1, 0, n - 1); root = 1; out = []
q.times do
  tp = data[idx]; idx += 1
  if tp == 1; root = data[idx]; idx += 1
  elsif tp == 2
    u = data[idx]; v = data[idx + 1]; x = data[idx + 2]; idx += 3
    while head[u] != head[v]
      u, v = v, u if depth[head[u]] < depth[head[v]]
      upd.call(1, 0, n - 1, pos[head[u]], pos[u], x); u = parent[head[u]]
    end
    u, v = v, u if depth[u] > depth[v]
    upd.call(1, 0, n - 1, pos[u], pos[v], x)
  else
    u = data[idx]; idx += 1
    if u == root; out << tr[1]
    elsif pos[u] <= pos[root] && pos[root] < pos[u] + sz[u]
      c = root; steps = depth[root] - depth[u] - 1
      log.times { |k| c = up[k][c] if ((steps >> k) & 1) == 1 }
      out << (tr[1] - qry.call(1, 0, n - 1, pos[c], pos[c] + sz[c] - 1))
    else
      out << qry.call(1, 0, n - 1, pos[u], pos[u] + sz[u] - 1)
    end
  end
end
puts out.join("\\n")`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'CSES',
      title: 'Path Queries II & Subtree Queries',
      difficulty: 'USACO Platinum (1850–2100)',
      url: 'https://cses.fi/problemset/task/2134',
      patternNote: 'Path Queries II specifically demands iterative SegTree + HLD to pass tight 1.0s limits.',
    },
    {
      platform: 'AtCoder',
      title: 'ABC294 G (Distance Queries on a Tree) & ABC269 Ex',
      difficulty: 'AtCoder Blue (~1750)',
      url: 'https://atcoder.jp/contests/abc294/tasks/abc294_g',
      patternNote: 'Edge-weighted HLD path sums with live weight updates.',
    },
    {
      platform: 'Codeforces',
      title: 'CF 916E Jamie and Tree & CF 343D Water Tree',
      difficulty: 'CF 2100–2400',
      url: 'https://codeforces.com/problemset/problem/916/E',
      patternNote: '916E combines HLD / Euler tour with dynamic root rerooting via child-lifting.',
    },
    {
      platform: 'CodeChef',
      title: 'QTREE / GERALD2 (HLD + Lazy Path/Subtree)',
      difficulty: 'CodeChef 5★–6★',
      url: 'https://www.codechef.com/tags/problems/heavy-light-decomposition',
      patternNote: 'Canonical edge-update + path-max benchmarks.',
    },
    {
      platform: 'HackerRank',
      title: 'Subtrees And Paths',
      difficulty: 'Hard',
      url: 'https://www.hackerrank.com/challenges/subtrees-and-paths',
      patternNote: 'Mixes subtree additions and path maximum queries on one unified HLD segment tree.',
    },
    {
      platform: 'NeetCode 150',
      title: 'Tree Ancestor / Path Sum Queries (Scale-Up Benchmark)',
      difficulty: 'FAANG Hard',
      url: 'https://leetcode.com/problems/kth-ancestor-of-a-tree-node/',
      patternNote: 'HLD generalizes Binary Lifting to arbitrary dynamic path & subtree monoid updates.',
    },
  ],
  interviewNotes: [
    'Always prove the O(log^2 N) bound: climbing from a child onto a heavy chain’s head crosses a light edge, which at least doubles the subtree size—capping chain transitions at log2(N).',
    'Know the O(log N) rerooting trick: you NEVER need to rebuild HLD when the tree root moves to `r`—just check whether `r` sits inside `[pos[u], pos[u] + sz[u] - 1]` and subtract the child branch containing `r`!',
  ],
  projectBlueprint: {
    title: 'Organizational Hierarchy & File-System Permission Analyzer',
    tagline:
      'Audit inheritance conflicts along deep corporate org-charts or POSIX directory paths in O(log^2 N) and propagate recursive ACL overrides across entire subtrees in O(log N).',
    stackSummary: 'TypeScript + Heavy-Light Decomposition + Lazy ACL Bitmask SegTree',
    asciiDiagram:
      'Directory / Org Tree ──▶ [HLD Heavy-Chain Flatten] ──▶ Lazy Bitmask SegTree\n' +
      '                                                          │\n' +
      '  Effective Path Permissions + Recursive Subtree ACLs ◀───┘',
    milestones: [
      {
        id: 'ch20-m1',
        title: 'Milestone 1: Stack-Safe DFS1 + DFS2 Chain Builder',
        detail: 'Compute subtree sizes, heavy children, chain heads, and contiguous pos[] ranges iteratively.',
      },
      {
        id: 'ch20-m2',
        title: 'Milestone 2: O(log^2 N) Path Bitmask Aggregator',
        detail: 'Compute bitwise OR/AND effective permissions along any user-to-root or folder-to-folder path.',
      },
      {
        id: 'ch20-m3',
        title: 'Milestone 3: Unified Subtree Bulk ACL Propagation',
        detail: 'Push recursive permission grants/revocations over [pos[u], pos[u] + sz[u] - 1] with lazy tags.',
      },
    ],
    starterCode: `export class HierarchyHldEngine {
  private readonly n: number;
  private readonly parent: Int32Array;
  private readonly depth: Int32Array;
  private readonly sz: Int32Array;
  private readonly head: Int32Array;
  private readonly pos: Int32Array;
  private readonly segMax: Int32Array;

  constructor(n: number, edges: Array<[number, number]>, weights: number[]) {
    this.n = n;
    const adj: number[][] = Array.from({ length: n + 1 }, () => []);
    for (const [u, v] of edges) {
      adj[u].push(v);
      adj[v].push(u);
    }

    this.parent = new Int32Array(n + 1);
    this.depth = new Int32Array(n + 1);
    this.sz = new Int32Array(n + 1).fill(1);
    const heavy = new Int32Array(n + 1);
    const order = [1];
    for (let i = 0; i < order.length; i++) {
      const u = order[i];
      for (const v of adj[u]) {
        if (v !== this.parent[u]) {
          this.parent[v] = u;
          this.depth[v] = this.depth[u] + 1;
          order.push(v);
        }
      }
    }
    for (let i = order.length - 1; i >= 0; i--) {
      const u = order[i];
      let best = 0;
      for (const v of adj[u]) {
        if (v !== this.parent[u]) {
          this.sz[u] += this.sz[v];
          if (this.sz[v] > best) {
            best = this.sz[v];
            heavy[u] = v;
          }
        }
      }
    }

    this.head = new Int32Array(n + 1).fill(1);
    this.pos = new Int32Array(n + 1);
    let cur = 0;
    const stack: Array<[number, number]> = [[1, 1]];
    while (stack.length > 0) {
      const [u, h] = stack.pop()!;
      this.head[u] = h;
      this.pos[u] = cur++;
      for (const v of adj[u]) {
        if (v !== this.parent[u] && v !== heavy[u]) stack.push([v, v]);
      }
      if (heavy[u] !== 0) stack.push([heavy[u], h]);
    }

    this.segMax = new Int32Array(2 * n);
    for (let i = 1; i <= n; i++) this.segMax[n + this.pos[i]] = weights[i] ?? 0;
    for (let i = n - 1; i >= 1; i--) {
      this.segMax[i] = Math.max(this.segMax[i << 1], this.segMax[(i << 1) | 1]);
    }
  }

  private queryRangeMax(lIdx: number, rIdx: number): number {
    let l = lIdx + this.n;
    let r = rIdx + this.n;
    let ans = 0;
    while (l <= r) {
      if ((l & 1) === 1) ans = Math.max(ans, this.segMax[l++]);
      if ((r & 1) === 0) ans = Math.max(ans, this.segMax[r--]);
      l >>= 1;
      r >>= 1;
    }
    return ans;
  }

  queryPathMax(uStart: number, vStart: number): number {
    let u = uStart;
    let v = vStart;
    let ans = 0;
    while (this.head[u] !== this.head[v]) {
      if (this.depth[this.head[u]] < this.depth[this.head[v]]) [u, v] = [v, u];
      ans = Math.max(ans, this.queryRangeMax(this.pos[this.head[u]], this.pos[u]));
      u = this.parent[this.head[u]];
    }
    if (this.depth[u] > this.depth[v]) [u, v] = [v, u];
    return Math.max(ans, this.queryRangeMax(this.pos[u], this.pos[v]));
  }
}`,
  },
};
