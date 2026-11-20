import type { VaultBreakdown } from '../../types/vault';

export const VAULT03_DYNAMIC_HLD: VaultBreakdown = {
  slug: 'dynamic-path-max-subtree-update',
  title: 'Dynamic Path Maximum & Subtree Update Queries -> Heavy-First Euler Tour HLD',
  rating: 2150,
  ratingTier: '1900–2200',
  usacoDivision: 'Platinum',
  domain: 'Graph & Tree Theory',
  sourceTag: '2150-Rated Tree Reduction Vault (USACO Platinum / CF Div.1 Style)',
  reductionHeadline:
    'Unify subtree-wide batch mutations and arbitrary u-v path maximum queries inside a single Lazy Segment Tree by ordering DFS2 heavy-child-first.',
  stage1Statement: {
    statement:
      'You are given a rooted tree with N nodes (root 1), each with initial weight w_i. Process Q operations: (1 u x) add integer x to every vertex in the subtree of u; (2 u v) report the maximum weight of any vertex on the simple path between u and v.',
    constraints: [
      '1 <= N, Q <= 10^5',
      '|w_i|, |x| <= 10^9',
      '1 <= u, v <= N',
      'Time Limit: 2.0 seconds',
    ],
    sampleInput: '6 4\n1 2 3 4 5 6\n1 2\n1 3\n2 4\n2 5\n3 6\n2 4 6\n1 2 10\n2 4 6\n2 5 3',
    sampleOutput: '6\n14\n15',
    sampleExplanation:
      'Initially path(4, 6) = [4, 2, 1, 3, 6] has max 6. Updating subtree(2) by +10 turns nodes {2, 4, 5} into {12, 14, 15}. Now path(4, 6) = [14, 12, 1, 3, 6] -> max 14, and path(5, 3) = [15, 12, 1, 3] -> max 15.',
  },
  stage2NaiveFailure: {
    naiveApproaches: [
      {
        approach: 'Walk Up From u and v to LCA for Every Operation',
        complexity: 'O(N * Q)',
        verdict: 'TLE',
        reason:
          'On a bamboo/line tree of 10^5 nodes, subtree(1) touches N nodes and path(1, N) traverses N steps, hitting 10^10 operations.',
      },
      {
        approach: 'Separate Euler Tour SegTree + Binary Lifting Max Table',
        complexity: 'O(N log N) build, broken updates',
        verdict: 'TLE',
        reason:
          'Binary lifting jump tables are static! Adding +x to an arbitrary subtree forces rebuilding O(N log N) jump entries.',
      },
      {
        approach: 'Two Disjoint Coordinate Arrays (Euler for Subtree, HLD for Path)',
        complexity: 'O(Q log^2 N) with 2x sync bug risk',
        verdict: 'WA',
        reason:
          'A subtree update in Euler order does NOT know which disjoint HLD chain segments live inside it unless both mappings share identical array indices!',
      },
    ],
    constraintWhispers: [
      'N, Q <= 10^5 with BOTH subtree batch updates AND path max queries requires O(log^2 N) per query.',
      'Why does visiting heavy[u] BEFORE light children in DFS2 make BOTH subtrees AND heavy chains contiguous?',
      'Adding +x uniformly to a range increases the range maximum by exactly +x -> Lazy Range-Add + Range-Max Segment Tree works in one tree!',
    ],
  },
  stage3AhaReduction: {
    coreInsight:
      'In HLD DFS2, recurse on heavy[u] first and light children second, assigning a single array index tin[u]. Now EVERY heavy chain [pos[head[v]]..pos[v]] AND EVERY subtree [tin[u]..tout[u]] are contiguous slices of the exact same Segment Tree!',
    steps: [
      {
        title: '1. Heavy-First Euler Invariant Proof',
        proofNote:
          'During DFS2, we increment timer once upon entering u (tin[u] = timer++), visit all descendants of heavy[u], then visit all light children, and finally record tout[u] = timer - 1. Because all descendants of u are visited strictly between entering and exiting u, subtree(u) is contiguous [tin[u], tout[u]]. Simultaneously, heavy[u] is entered IMMEDIATELY after u, so tin[heavy[u]] = tin[u] + 1!',
      },
      {
        title: '2. Lazy Range-Add + Range-Max Monoid',
        proofNote:
          'For max(S + x) = max(S) + x, adding a uniform delta x to every leaf in a segment shifts the node maximum by +x directly: tree[node] += x; lazy[node] += x. Pushdown takes O(1) per visited node.',
      },
      {
        title: '3. Climb Heavy Chains by Higher Chain-Head Depth',
        proofNote:
          'To query max on path(u, v), while head[u] != head[v], pick whichever node has deeper chain head (say v), query seg.max(tin[head[v]], tin[v]), and jump v = parent[head[v]]. Each jump halves or more than halves remaining subtree size -> at most log2(N) SegTree calls.',
      },
    ],
  },
  stage4DryRun: {
    intro:
      'Step through the 6-node sample tree: edges (1-2), (1-3), (2-4), (2-5), (3-6), initial weights [1, 2, 3, 4, 5, 6]. Watch heavy-first DFS2 assign contiguous indices and execute (1 2 +10) followed by path max(4, 6).',
    traceSteps: [
      {
        stepNumber: 1,
        title: 'DFS1 Computes Subtree Sizes & Picks Heavy Children',
        explanation:
          'Subtree sizes: sz[4]=1, sz[5]=1, sz[2]=3, sz[6]=1, sz[3]=2, sz[1]=6. Heavy children: heavy[1]=2 (3 > 2), heavy[2]=4 (tie-break 1==1), heavy[3]=6.',
        mode: 'graph',
        graph: {
          calloutMetric: 'Heavy Chains: {1-2-4}, {5}, {3-6}',
          nodes: [
            { id: '1', label: '1 (w=1)', x: 300, y: 50, state: 'even', matchWith: null },
            { id: '2', label: '2 (w=2)', x: 185, y: 125, state: 'even', matchWith: null },
            { id: '3', label: '3 (w=3)', x: 425, y: 125, state: 'odd', matchWith: null },
            { id: '4', label: '4 (w=4)', x: 115, y: 215, state: 'even', matchWith: null },
            { id: '5', label: '5 (w=5)', x: 255, y: 215, state: 'blossom', matchWith: null },
            { id: '6', label: '6 (w=6)', x: 425, y: 215, state: 'odd', matchWith: null },
          ],
          edges: [
            { id: 'e12', from: '1', to: '2', state: 'matched' },
            { id: 'e13', from: '1', to: '3', state: 'default' },
            { id: 'e24', from: '2', to: '4', state: 'matched' },
            { id: 'e25', from: '2', to: '5', state: 'default' },
            { id: 'e36', from: '3', to: '6', state: 'matched' },
          ],
        },
        variables: { Root: 1, 'heavy[1]': 2, 'heavy[2]': 4, 'heavy[3]': 6 },
      },
      {
        stepNumber: 2,
        title: 'Heavy-First DFS2 Order: [1, 2, 4, 5, 3, 6]',
        explanation:
          'DFS2 visits 1 -> heavy 2 -> heavy 4 -> light 5 -> light 3 -> heavy 6. Subtree(2) occupies contiguous range [tin[2]..tout[2]] = [1..3] (covering nodes 2, 4, 5), and Chain(1-2-4) occupies [0..2]!',
        mode: 'graph',
        graph: {
          calloutMetric: 'Flat Array tin Order = [1, 2, 4, 5, 3, 6] · Subtree(2) = [1..3]',
          nodes: [
            { id: '1', label: '1 tin=0', x: 300, y: 50, state: 'even', matchWith: null },
            { id: '2', label: '2 tin=1', x: 185, y: 125, state: 'even', matchWith: null },
            { id: '3', label: '3 tin=4', x: 425, y: 125, state: 'odd', matchWith: null },
            { id: '4', label: '4 tin=2', x: 115, y: 215, state: 'even', matchWith: null },
            { id: '5', label: '5 tin=3', x: 255, y: 215, state: 'blossom', matchWith: null },
            { id: '6', label: '6 tin=5', x: 425, y: 215, state: 'odd', matchWith: null },
          ],
          edges: [
            { id: 'e12', from: '1', to: '2', state: 'matched' },
            { id: 'e13', from: '1', to: '3', state: 'default' },
            { id: 'e24', from: '2', to: '4', state: 'matched' },
            { id: 'e25', from: '2', to: '5', state: 'default' },
            { id: 'e36', from: '3', to: '6', state: 'matched' },
          ],
        },
        variables: { 'Subtree(2)': '[1..3]', 'Chain{1,2,4}': '[0..2]', 'Chain{3,6}': '[4..5]' },
      },
      {
        stepNumber: 3,
        title: 'Lazy Update Subtree(2) += 10 & Query Path Max(4, 6)',
        explanation:
          'seg.add(1, 3, +10) updates {2, 4, 5} to {12, 14, 15} in O(log N). Then pathMax(4, 6) queries Chain{3,6} = [4..5] (max=6), jumps 3->1, then queries [0..2] (max(1, 12, 14)=14). Result = max(6, 14) = 14!',
        mode: 'graph',
        graph: {
          calloutMetric: 'Subtree(2) += 10 -> PathMax(4, 6) = max([4..5]=6, [0..2]=14) = 14',
          nodes: [
            { id: '1', label: '1 (w=1)', x: 300, y: 50, state: 'matched', matchWith: null },
            { id: '2', label: '2 (w=12)', x: 185, y: 125, state: 'matched', matchWith: null },
            { id: '3', label: '3 (w=3)', x: 425, y: 125, state: 'matched', matchWith: null },
            { id: '4', label: '4 (w=14)', x: 115, y: 215, state: 'active', matchWith: null },
            { id: '5', label: '5 (w=15)', x: 255, y: 215, state: 'blossom', matchWith: null },
            { id: '6', label: '6 (w=6)', x: 425, y: 215, state: 'active', matchWith: null },
          ],
          edges: [
            { id: 'e12', from: '1', to: '2', state: 'augmenting' },
            { id: 'e13', from: '1', to: '3', state: 'augmenting' },
            { id: 'e24', from: '2', to: '4', state: 'augmenting' },
            { id: 'e25', from: '2', to: '5', state: 'default' },
            { id: 'e36', from: '3', to: '6', state: 'augmenting' },
          ],
        },
        variables: { 'PathMax(4,6)': 14, 'PathMax(5,3)': 15, Complexity: 'O(log^2 N)' },
      },
    ],
  },
  stage5Solutions: {
    timeComplexity: 'O(N + Q log^2 N)',
    spaceComplexity: 'O(N)',
    implementations: {
      cpp20: `#include <bits/stdc++.h>
using namespace std;

struct LazyMaxSeg {
    int n;
    vector<long long> mx, lazy;
    LazyMaxSeg(const vector<long long>& base) : n((int)base.size()), mx(4 * n), lazy(4 * n, 0) {
        build(1, 0, n - 1, base);
    }
    void build(int node, int l, int r, const vector<long long>& base) {
        if (l == r) { mx[node] = base[l]; return; }
        int m = (l + r) >> 1;
        build(node << 1, l, m, base);
        build(node << 1 | 1, m + 1, r, base);
        mx[node] = max(mx[node << 1], mx[node << 1 | 1]);
    }
    void push(int node) {
        if (lazy[node] == 0) return;
        for (int ch : {node << 1, node << 1 | 1}) {
            mx[ch] += lazy[node];
            lazy[ch] += lazy[node];
        }
        lazy[node] = 0;
    }
    void add(int node, int l, int r, int ql, int qr, long long v) {
        if (ql <= l && r <= qr) { mx[node] += v; lazy[node] += v; return; }
        push(node);
        int m = (l + r) >> 1;
        if (ql <= m) add(node << 1, l, m, ql, qr, v);
        if (qr > m) add(node << 1 | 1, m + 1, r, ql, qr, v);
        mx[node] = max(mx[node << 1], mx[node << 1 | 1]);
    }
    long long qry(int node, int l, int r, int ql, int qr) {
        if (ql <= l && r <= qr) return mx[node];
        push(node);
        int m = (l + r) >> 1;
        long long res = LLONG_MIN;
        if (ql <= m) res = max(res, qry(node << 1, l, m, ql, qr));
        if (qr > m) res = max(res, qry(node << 1 | 1, m + 1, r, ql, qr));
        return res;
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, q;
    if (!(cin >> n >> q)) return 0;
    vector<long long> w(n);
    for (int i = 0; i < n; ++i) cin >> w[i];
    vector<vector<int>> adj(n);
    for (int i = 0; i < n - 1; ++i) {
        int u, v; cin >> u >> v; --u; --v;
        adj[u].push_back(v); adj[v].push_back(u);
    }
    vector<int> par(n, -1), dep(n, 0), sz(n, 1), heavy(n, -1), head(n), tin(n), tout(n);
    auto dfs1 = [&](auto&& self, int u, int p) -> int {
        par[u] = p; int best = 0;
        for (int v : adj[u]) if (v != p) {
            dep[v] = dep[u] + 1;
            int c = self(self, v, u); sz[u] += c;
            if (c > best) { best = c; heavy[u] = v; }
        }
        return sz[u];
    };
    int timer = 0;
    auto dfs2 = [&](auto&& self, int u, int h) -> void {
        head[u] = h; tin[u] = timer++;
        if (heavy[u] != -1) self(self, heavy[u], h);
        for (int v : adj[u]) if (v != par[u] && v != heavy[u]) self(self, v, v);
        tout[u] = timer - 1;
    };
    dfs1(dfs1, 0, -1);
    dfs2(dfs2, 0, 0);
    vector<long long> base(n);
    for (int i = 0; i < n; ++i) base[tin[i]] = w[i];
    LazyMaxSeg seg(base);
    while (q--) {
        int t; cin >> t;
        if (t == 1) {
            int u; long long x; cin >> u >> x; --u;
            seg.add(1, 0, n - 1, tin[u], tout[u], x);
        } else {
            int u, v; cin >> u >> v; --u; --v;
            long long ans = LLONG_MIN;
            while (head[u] != head[v]) {
                if (dep[head[u]] > dep[head[v]]) swap(u, v);
                ans = max(ans, seg.qry(1, 0, n - 1, tin[head[v]], tin[v]));
                v = par[head[v]];
            }
            if (dep[u] > dep[v]) swap(u, v);
            ans = max(ans, seg.qry(1, 0, n - 1, tin[u], tin[v]));
            cout << ans << '\\n';
        }
    }
    return 0;
}`,
      rust: `use std::io::{self, BufWriter, Read, Write};

struct LazyMaxSeg {
    mx: Vec<i64>,
    lazy: Vec<i64>,
}

impl LazyMaxSeg {
    fn new(base: &[i64]) -> Self {
        let n = base.len();
        let mut st = Self { mx: vec![i64::MIN; 4 * n], lazy: vec![0; 4 * n] };
        st.build(1, 0, n - 1, base);
        st
    }
    fn build(&mut self, node: usize, l: usize, r: usize, base: &[i64]) {
        if l == r { self.mx[node] = base[l]; return; }
        let m = (l + r) >> 1;
        self.build(node << 1, l, m, base);
        self.build(node << 1 | 1, m + 1, r, base);
        self.mx[node] = self.mx[node << 1].max(self.mx[node << 1 | 1]);
    }
    fn push(&mut self, node: usize) {
        let lz = self.lazy[node];
        if lz == 0 { return; }
        self.mx[node << 1] += lz; self.lazy[node << 1] += lz;
        self.mx[node << 1 | 1] += lz; self.lazy[node << 1 | 1] += lz;
        self.lazy[node] = 0;
    }
    fn add(&mut self, node: usize, l: usize, r: usize, ql: usize, qr: usize, v: i64) {
        if ql <= l && r <= qr { self.mx[node] += v; self.lazy[node] += v; return; }
        self.push(node);
        let m = (l + r) >> 1;
        if ql <= m { self.add(node << 1, l, m, ql, qr, v); }
        if qr > m { self.add(node << 1 | 1, m + 1, r, ql, qr, v); }
        self.mx[node] = self.mx[node << 1].max(self.mx[node << 1 | 1]);
    }
    fn qry(&mut self, node: usize, l: usize, r: usize, ql: usize, qr: usize) -> i64 {
        if ql <= l && r <= qr { return self.mx[node]; }
        self.push(node);
        let m = (l + r) >> 1;
        let mut res = i64::MIN;
        if ql <= m { res = res.max(self.qry(node << 1, l, m, ql, qr)); }
        if qr > m { res = res.max(self.qry(node << 1 | 1, m + 1, r, ql, qr)); }
        res
    }
}

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let Some(ns) = it.next() else { return; };
    let n: usize = ns.parse().unwrap();
    let q: usize = it.next().unwrap().parse().unwrap();
    let mut w = vec![0i64; n];
    for i in 0..n { w[i] = it.next().unwrap().parse().unwrap(); }
    let mut adj = vec![Vec::new(); n];
    for _ in 0..(n - 1) {
        let u = it.next().unwrap().parse::<usize>().unwrap() - 1;
        let v = it.next().unwrap().parse::<usize>().unwrap() - 1;
        adj[u].push(v); adj[v].push(u);
    }
    let mut par = vec![usize::MAX; n];
    let mut dep = vec![0usize; n];
    let mut sz = vec![1usize; n];
    let mut heavy = vec![usize::MAX; n];
    let mut order = Vec::with_capacity(n);
    let mut st = vec![0usize];
    while let Some(u) = st.pop() {
        order.push(u);
        for &v in &adj[u] { if v != par[u] { par[v] = u; dep[v] = dep[u] + 1; st.push(v); } }
    }
    for &u in order.iter().rev() {
        let mut best = 0;
        for &v in &adj[u] { if v != par[u] { sz[u] += sz[v]; if sz[v] > best { best = sz[v]; heavy[u] = v; } } }
    }
    let mut head = vec![0usize; n];
    let mut tin = vec![0usize; n];
    let mut tout = vec![0usize; n];
    let mut timer = 0usize;
    let mut st2 = vec![(0usize, 0usize, false)];
    while let Some((u, h, ex)) = st2.pop() {
        if ex { tout[u] = timer - 1; }
        else {
            head[u] = h; tin[u] = timer; timer += 1;
            st2.push((u, h, true));
            for &v in &adj[u] { if v != par[u] && v != heavy[u] { st2.push((v, v, false)); } }
            if heavy[u] != usize::MAX { st2.push((heavy[u], h, false)); }
        }
    }
    let mut base = vec![0i64; n];
    for i in 0..n { base[tin[i]] = w[i]; }
    let mut seg = LazyMaxSeg::new(&base);
    let mut out = BufWriter::new(io::stdout().lock());
    for _ in 0..q {
        let t: usize = it.next().unwrap().parse().unwrap();
        if t == 1 {
            let u = it.next().unwrap().parse::<usize>().unwrap() - 1;
            let x: i64 = it.next().unwrap().parse().unwrap();
            seg.add(1, 0, n - 1, tin[u], tout[u], x);
        } else {
            let mut u = it.next().unwrap().parse::<usize>().unwrap() - 1;
            let mut v = it.next().unwrap().parse::<usize>().unwrap() - 1;
            let mut ans = i64::MIN;
            while head[u] != head[v] {
                if dep[head[u]] > dep[head[v]] { std::mem::swap(&mut u, &mut v); }
                ans = ans.max(seg.qry(1, 0, n - 1, tin[head[v]], tin[v]));
                v = par[head[v]];
            }
            if dep[u] > dep[v] { std::mem::swap(&mut u, &mut v); }
            ans = ans.max(seg.qry(1, 0, n - 1, tin[u], tin[v]));
            writeln!(out, "{}", ans).unwrap();
        }
    }
}`,
      java21: `import java.io.*;
import java.util.*;

public class Main {
    static long[] mx, lazy;

    static void build(int node, int l, int r, long[] base) {
        if (l == r) { mx[node] = base[l]; return; }
        int m = (l + r) >> 1;
        build(node << 1, l, m, base);
        build(node << 1 | 1, m + 1, r, base);
        mx[node] = Math.max(mx[node << 1], mx[node << 1 | 1]);
    }
    static void push(int node) {
        if (lazy[node] == 0) return;
        mx[node << 1] += lazy[node]; lazy[node << 1] += lazy[node];
        mx[node << 1 | 1] += lazy[node]; lazy[node << 1 | 1] += lazy[node];
        lazy[node] = 0;
    }
    static void add(int node, int l, int r, int ql, int qr, long v) {
        if (ql <= l && r <= qr) { mx[node] += v; lazy[node] += v; return; }
        push(node);
        int m = (l + r) >> 1;
        if (ql <= m) add(node << 1, l, m, ql, qr, v);
        if (qr > m) add(node << 1 | 1, m + 1, r, ql, qr, v);
        mx[node] = Math.max(mx[node << 1], mx[node << 1 | 1]);
    }
    static long qry(int node, int l, int r, int ql, int qr) {
        if (ql <= l && r <= qr) return mx[node];
        push(node);
        int m = (l + r) >> 1;
        long res = Long.MIN_VALUE;
        if (ql <= m) res = Math.max(res, qry(node << 1, l, m, ql, qr));
        if (qr > m) res = Math.max(res, qry(node << 1 | 1, m + 1, r, ql, qr));
        return res;
    }

    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String first = br.readLine(); if (first == null) return;
        StringTokenizer st = new StringTokenizer(first);
        int n = Integer.parseInt(st.nextToken()), q = Integer.parseInt(st.nextToken());
        long[] w = new long[n];
        st = new StringTokenizer(br.readLine());
        for (int i = 0; i < n; i++) w[i] = Long.parseLong(st.nextToken());
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (int i = 0; i < n - 1; i++) {
            st = new StringTokenizer(br.readLine());
            int u = Integer.parseInt(st.nextToken()) - 1, v = Integer.parseInt(st.nextToken()) - 1;
            adj.get(u).add(v); adj.get(v).add(u);
        }
        int[] par = new int[n], dep = new int[n], sz = new int[n], heavy = new int[n], head = new int[n], tin = new int[n], tout = new int[n];
        Arrays.fill(par, -1); Arrays.fill(heavy, -1); Arrays.fill(sz, 1);
        int[] order = new int[n], stk = new int[2 * n + 5]; int top = 0, op = 0; stk[top++] = 0;
        while (top > 0) {
            int u = stk[--top]; order[op++] = u;
            for (int v : adj.get(u)) if (v != par[u]) { par[v] = u; dep[v] = dep[u] + 1; stk[top++] = v; }
        }
        for (int i = n - 1; i >= 0; i--) {
            int u = order[i], best = 0;
            for (int v : adj.get(u)) if (v != par[u]) { sz[u] += sz[v]; if (sz[v] > best) { best = sz[v]; heavy[u] = v; } }
        }
        int timer = 0; top = 0; int[] sh = new int[2 * n + 5]; boolean[] sx = new boolean[2 * n + 5];
        stk[top] = 0; sh[top] = 0; sx[top++] = false;
        while (top > 0) {
            int u = stk[--top], h = sh[top]; boolean ex = sx[top];
            if (ex) tout[u] = timer - 1;
            else {
                head[u] = h; tin[u] = timer++;
                stk[top] = u; sh[top] = h; sx[top++] = true;
                for (int v : adj.get(u)) if (v != par[u] && v != heavy[u]) { stk[top] = v; sh[top] = v; sx[top++] = false; }
                if (heavy[u] != -1) { stk[top] = heavy[u]; sh[top] = h; sx[top++] = false; }
            }
        }
        long[] base = new long[n];
        for (int i = 0; i < n; i++) base[tin[i]] = w[i];
        mx = new long[4 * n]; lazy = new long[4 * n];
        build(1, 0, n - 1, base);
        StringBuilder out = new StringBuilder();
        for (int i = 0; i < q; i++) {
            st = new StringTokenizer(br.readLine());
            int t = Integer.parseInt(st.nextToken());
            if (t == 1) {
                int u = Integer.parseInt(st.nextToken()) - 1; long x = Long.parseLong(st.nextToken());
                add(1, 0, n - 1, tin[u], tout[u], x);
            } else {
                int u = Integer.parseInt(st.nextToken()) - 1, v = Integer.parseInt(st.nextToken()) - 1;
                long ans = Long.MIN_VALUE;
                while (head[u] != head[v]) {
                    if (dep[head[u]] > dep[head[v]]) { int tmp = u; u = v; v = tmp; }
                    ans = Math.max(ans, qry(1, 0, n - 1, tin[head[v]], tin[v]));
                    v = par[head[v]];
                }
                if (dep[u] > dep[v]) { int tmp = u; u = v; v = tmp; }
                ans = Math.max(ans, qry(1, 0, n - 1, tin[u], tin[v]));
                out.append(ans).append('\\n');
            }
        }
        System.out.print(out);
    }
}`,
      python3: `import sys

def solve():
    data = list(map(int, sys.stdin.buffer.read().split()))
    if not data:
        return
    it = iter(data)
    n, q = next(it), next(it)
    w = [next(it) for _ in range(n)]
    adj = [[] for _ in range(n)]
    for _ in range(n - 1):
        u, v = next(it) - 1, next(it) - 1
        adj[u].append(v); adj[v].append(u)

    par, dep, sz, heavy = [-1]*n, [0]*n, [1]*n, [-1]*n
    order, st = [], [0]
    while st:
        u = st.pop(); order.append(u)
        for v in adj[u]:
            if v != par[u]:
                par[v] = u; dep[v] = dep[u] + 1; st.append(v)
    for u in reversed(order):
        best = 0
        for v in adj[u]:
            if v != par[u]:
                sz[u] += sz[v]
                if sz[v] > best: best = sz[v]; heavy[u] = v

    head, tin, tout, timer = [0]*n, [0]*n, [0]*n, 0
    st2 = [(0, 0, False)]
    while st2:
        u, h, ex = st2.pop()
        if ex: tout[u] = timer - 1
        else:
            head[u] = h; tin[u] = timer; timer += 1
            st2.append((u, h, True))
            for v in adj[u]:
                if v != par[u] and v != heavy[u]: st2.append((v, v, False))
            if heavy[u] != -1: st2.append((heavy[u], h, False))

    NEG = -10**18
    mx, lazy = [NEG]*(4*n), [0]*(4*n)
    base = [0]*n
    for i in range(n): base[tin[i]] = w[i]

    def build(node, l, r):
        if l == r: mx[node] = base[l]; return
        m = (l + r) >> 1
        build(node<<1, l, m); build(node<<1|1, m+1, r)
        mx[node] = max(mx[node<<1], mx[node<<1|1])
    build(1, 0, n - 1)

    def push(node):
        lz = lazy[node]
        if lz:
            mx[node<<1] += lz; lazy[node<<1] += lz
            mx[node<<1|1] += lz; lazy[node<<1|1] += lz
            lazy[node] = 0

    def add(node, l, r, ql, qr, v):
        if ql <= l and r <= qr: mx[node] += v; lazy[node] += v; return
        push(node); m = (l + r) >> 1
        if ql <= m: add(node<<1, l, m, ql, qr, v)
        if qr > m: add(node<<1|1, m+1, r, ql, qr, v)
        mx[node] = max(mx[node<<1], mx[node<<1|1])

    def qry(node, l, r, ql, qr):
        if ql <= l and r <= qr: return mx[node]
        push(node); m = (l + r) >> 1; res = NEG
        if ql <= m: res = max(res, qry(node<<1, l, m, ql, qr))
        if qr > m: res = max(res, qry(node<<1|1, m+1, r, ql, qr))
        return res

    out = []
    for _ in range(q):
        t = next(it)
        if t == 1:
            u, x = next(it) - 1, next(it)
            add(1, 0, n - 1, tin[u], tout[u], x)
        else:
            u, v = next(it) - 1, next(it) - 1; ans = NEG
            while head[u] != head[v]:
                if dep[head[u]] > dep[head[v]]: u, v = v, u
                ans = max(ans, qry(1, 0, n - 1, tin[head[v]], tin[v]))
                v = par[head[v]]
            if dep[u] > dep[v]: u, v = v, u
            ans = max(ans, qry(1, 0, n - 1, tin[u], tin[v]))
            out.append(str(ans))
    sys.stdout.write("\\n".join(out) + "\\n")

if __name__ == "__main__":
    solve()`,
      ruby: `data = STDIN.read.split.map(&:to_i)
exit if data.empty?
idx = 0
n = data[idx]; q = data[idx + 1]; idx += 2
w = data[idx, n]; idx += n
adj = Array.new(n) { [] }
(n - 1).times { u = data[idx] - 1; v = data[idx + 1] - 1; idx += 2; adj[u] << v; adj[v] << u }

par = Array.new(n, -1); dep = Array.new(n, 0); sz = Array.new(n, 1); heavy = Array.new(n, -1)
order = []; st = [0]
until st.empty?
  u = st.pop; order << u
  adj[u].each { |v| next if v == par[u]; par[v] = u; dep[v] = dep[u] + 1; st << v }
end
order.reverse_each do |u|
  best = 0
  adj[u].each { |v| next if v == par[u]; sz[u] += sz[v]; if sz[v] > best; best = sz[v]; heavy[u] = v; end }
end
head = Array.new(n, 0); tin = Array.new(n, 0); tout = Array.new(n, 0); timer = 0
st2 = [[0, 0, false]]
until st2.empty?
  u, h, ex = st2.pop
  if ex then tout[u] = timer - 1
  else
    head[u] = h; tin[u] = timer; timer += 1; st2 << [u, h, true]
    adj[u].each { |v| st2 << [v, v, false] if v != par[u] && v != heavy[u] }
    st2 << [heavy[u], h, false] if heavy[u] != -1
  end
end
neg = -10**18
base = Array.new(n, 0); n.times { |i| base[tin[i]] = w[i] }
mx = Array.new(4 * n, neg); lazy = Array.new(4 * n, 0)
build = nil
build = ->(node, l, r) do
  if l == r; mx[node] = base[l]; return; end
  m = (l + r) >> 1; build.call(node << 1, l, m); build.call(node << 1 | 1, m + 1, r)
  mx[node] = [mx[node << 1], mx[node << 1 | 1]].max
end
build.call(1, 0, n - 1)
push = ->(node) do
  lz = lazy[node]; return if lz == 0
  mx[node << 1] += lz; lazy[node << 1] += lz
  mx[node << 1 | 1] += lz; lazy[node << 1 | 1] += lz
  lazy[node] = 0
end
add = nil
add = ->(node, l, r, ql, qr, v) do
  if ql <= l && r <= qr; mx[node] += v; lazy[node] += v; return; end
  push.call(node); m = (l + r) >> 1
  add.call(node << 1, l, m, ql, qr, v) if ql <= m
  add.call(node << 1 | 1, m + 1, r, ql, qr, v) if qr > m
  mx[node] = [mx[node << 1], mx[node << 1 | 1]].max
end
qry = nil
qry = ->(node, l, r, ql, qr) do
  return mx[node] if ql <= l && r <= qr
  push.call(node); m = (l + r) >> 1; res = neg
  res = [res, qry.call(node << 1, l, m, ql, qr)].max if ql <= m
  res = [res, qry.call(node << 1 | 1, m + 1, r, ql, qr)].max if qr > m
  res
end
out = []
q.times do
  t = data[idx]
  if t == 1
    u = data[idx + 1] - 1; x = data[idx + 2]; idx += 3
    add.call(1, 0, n - 1, tin[u], tout[u], x)
  else
    u = data[idx + 1] - 1; v = data[idx + 2] - 1; idx += 3; ans = neg
    while head[u] != head[v]
      u, v = v, u if dep[head[u]] > dep[head[v]]
      ans = [ans, qry.call(1, 0, n - 1, tin[head[v]], tin[v])].max
      v = par[head[v]]
    end
    u, v = v, u if dep[u] > dep[v]
    ans = [ans, qry.call(1, 0, n - 1, tin[u], tin[v])].max
    out << ans
  end
end
puts out.join("\\n")`,
    },
  },
};
