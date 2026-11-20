import type { TheoryChapter } from '../../types/vault';

export const CH66_DOMINATOR_TREE_LENGAUER_TARJAN: TheoryChapter = {
  slug: 'dominator-tree-lengauer-tarjan',
  topicId: 'gr-43',
  title: 'Dominator Trees (Lengauer-Tarjan)',
  domain: 'Graph & Tree Theory',
  ratingTier: '2600–3300+',
  usacoDivision: 'Advanced',
  subtitle: 'Near-linear O(E alpha(V)) immediate dominator tree construction via semidominators and path-compressed DSU',
  analogyTitle: 'Chokepoint Gatekeepers Along Every Possible Route from Root S',
  analogyBody:
    'In an undirected graph, finding mandatory chokepoints reduces cleanly to articulation points and a Block-Cut Tree. The moment edges become DIRECTED, back-edges, forward-edges, and cross-edges shatter undirected biconnectedness: you might bypass a node along a detour forward arc, yet remain forced through a downstream hub.\n\nVertex d dominates vertex u (from source s) if every s-to-u path passes through d. Because domination is transitive and has no cycles, every reachable vertex u != s has a unique closest strict dominator idom[u], assembling all dominator relationships into a rooted tree called the Dominator Tree.\n\nLengauer and Tarjan discovered how to build this entire tree in O(E alpha(V)) time using DFS preorder numbers: process nodes in reverse DFS order, jump backward via any predecessor v using a DSU tracking the minimum semidominator sdom along active DFS-tree paths, and resolve the final immediate dominator idom in one forward pass.',
  prerequisites: [
    { slug: 'tarjan-scc-2sat-bridges', title: 'Tarjan SCC, Bridges, Articulation Points & 2-SAT' },
  ],
  traceTitle: 'Lengauer-Tarjan Semidominator & Immediate Dominator Sweep',
  traceSubtitle: 'Constructing the Dominator Tree on a 7-node directed CFG with forward and cross bypasses',
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Step 1: DFS Preorder Numbering from Source s = 1',
      explanation: 'Run DFS from node 1 along edges 1->2->4->6->7, 1->3->5->6, 4->5, 7->4 to assign DFS preorder indices dfn[u] in 1..7 and record tree parents fa[w].',
      mode: 'graph',
      graph: {
        nodes: [
          { id: '1', label: '1 (dfn=1)', x: 260, y: 36, state: 'active' },
          { id: '2', label: '2 (dfn=2)', x: 140, y: 110, state: 'even' },
          { id: '3', label: '3 (dfn=6)', x: 380, y: 110, state: 'even' },
          { id: '4', label: '4 (dfn=3)', x: 140, y: 190, state: 'even' },
          { id: '5', label: '5 (dfn=7)', x: 380, y: 190, state: 'even' },
          { id: '6', label: '6 (dfn=4)', x: 260, y: 265, state: 'even' },
          { id: '7', label: '7 (dfn=5)', x: 260, y: 340, state: 'even' },
        ],
        edges: [
          { id: 'e12', from: '1', to: '2', state: 'matched' },
          { id: 'e24', from: '2', to: '4', state: 'matched' },
          { id: 'e46', from: '4', to: '6', state: 'matched' },
          { id: 'e67', from: '6', to: '7', state: 'matched' },
          { id: 'e13', from: '1', to: '3', state: 'matched' },
          { id: 'e35', from: '3', to: '5', state: 'matched' },
          { id: 'e45', from: '4', to: '5', state: 'default' },
          { id: 'e56', from: '5', to: '6', state: 'augmenting' },
          { id: 'e74', from: '7', to: '4', state: 'blossom-cycle' },
        ],
        calloutMetric: 'DFS Order: [1, 2, 4, 6, 7, 3, 5]',
      },
      variables: { root: 1, timer: 7 },
    },
    {
      stepNumber: 2,
      title: 'Step 2: Cross Edge 5->6 Pulls sdom[6] Up to Root 1',
      explanation: 'At dfn=7 (node 5, predecessors 3,4): neither links above node 1 yet; when evaluating dfn=4 (node 6, predecessors 4 and cross-edge 5): path-compressed DSU over 5->3->1 gives sdom[6] = dfn(1) = 1 because 1->3->5->6 bypasses nodes 2 and 4.',
      mode: 'graph',
      graph: {
        nodes: [
          { id: '1', label: '1 (sdom=1)', x: 260, y: 36, state: 'active' },
          { id: '2', label: '2 (sdom=1)', x: 140, y: 110, state: 'even' },
          { id: '3', label: '3 (sdom=1)', x: 380, y: 110, state: 'even' },
          { id: '4', label: '4 (sdom=2)', x: 140, y: 190, state: 'odd' },
          { id: '5', label: '5 (sdom=1)', x: 380, y: 190, state: 'matched' },
          { id: '6', label: '6 (sdom=1)', x: 260, y: 265, state: 'matched' },
          { id: '7', label: '7 (sdom=4)', x: 260, y: 340, state: 'even' },
        ],
        edges: [
          { id: 'e13', from: '1', to: '3', state: 'augmenting' },
          { id: 'e35', from: '3', to: '5', state: 'augmenting' },
          { id: 'e56', from: '5', to: '6', state: 'augmenting' },
          { id: 'e67', from: '6', to: '7', state: 'matched' },
          { id: 'e74', from: '7', to: '4', state: 'blossom-cycle' },
        ],
        calloutMetric: 'sdom[node 6] = node 1',
      },
      variables: { node6_preds: '4, 5', bypassPath: '1 -> 3 -> 5 -> 6', sdom6: 1 },
    },
    {
      stepNumber: 3,
      title: 'Step 3: Back Edge 7->4 Fails to Lower sdom[4] Past 1, Wait: 7->4 Routes Through 6',
      explanation: 'At dfn=3 (node 4, predecessors 2 and back-edge 7): DSU evaluates ancestor chain 7 -> 6 -> sdom[6]=1, pulling sdom[4] all the way to root 1 via 1->3->5->6->7->4!',
      mode: 'graph',
      graph: {
        nodes: [
          { id: '1', label: '1 (idom=root)', x: 260, y: 36, state: 'matched' },
          { id: '2', label: '2 (idom=1)', x: 140, y: 110, state: 'matched' },
          { id: '3', label: '3 (idom=1)', x: 380, y: 110, state: 'matched' },
          { id: '4', label: '4 (idom=1)', x: 140, y: 190, state: 'matched' },
          { id: '5', label: '5 (idom=1)', x: 380, y: 190, state: 'matched' },
          { id: '6', label: '6 (idom=1)', x: 260, y: 265, state: 'matched' },
          { id: '7', label: '7 (idom=6)', x: 260, y: 340, state: 'matched' },
        ],
        edges: [
          { id: 'd12', from: '1', to: '2', state: 'matched' },
          { id: 'd13', from: '1', to: '3', state: 'matched' },
          { id: 'd14', from: '1', to: '4', state: 'matched' },
          { id: 'd15', from: '1', to: '5', state: 'matched' },
          { id: 'd16', from: '1', to: '6', state: 'matched' },
          { id: 'd67', from: '6', to: '7', state: 'matched' },
        ],
        calloutMetric: 'Node 6 is sole strict dominator of 7',
      },
      variables: { idom4: 1, idom6: 1, idom7: 6, criticalTo7: '1 -> 6 -> 7' },
    },
  ],
  reductionClues: [
    {
      clue: 'Find all vertices lying on EVERY directed path from S to T (mandatory checkpoints / critical cities)',
      translation: 'Build the Lengauer-Tarjan Dominator Tree rooted at S and walk idom[u] upward from T to S.',
    },
    {
      clue: 'For each vertex u, compute how many nodes become unreachable from root S if u is deleted',
      translation: 'Any node v becomes unreachable iff u dominates v; compute subtree sizes inside the Dominator Tree in O(N).',
    },
    {
      clue: 'Find vertices or edges present in EVERY shortest path between S and T in a weighted digraph',
      translation: 'Keep edges satisfying distS[u] + w + distT[v] == distS[T] to build the Shortest-Path DAG, then run Dominator Tree from S.',
    },
    {
      clue: 'General directed graph up to N, M <= 2*10^5 (not necessarily a DAG!)',
      translation: 'Topological sort fails on cycles; use full Lengauer-Tarjan with DSU semi-dominator compression rather than DAG LCA.',
    },
  ],
  timeComplexity: 'O((V + E) alpha(V)) with path compression + bucket resolution (O((V + E) log V) without rank)',
  spaceComplexity: 'O(V + E) for forward/reverse adjacency lists, DFS numbering, and DSU arrays',
  pitfalls: [
    {
      type: 'WA',
      title: 'Including Unreachable Predecessor Edges Inside revG',
      detail: 'If node v is unreachable from root S (dfn[v] == 0) yet has an edge v -> u into a reachable node u, processing dfn[v] = 0 corrupts sdom[u] to 0. Only insert reverse edges whose BOTH endpoints have dfn > 0.',
    },
    {
      type: 'RE',
      title: 'Recursive DFS / Path-Compressed DSU Stack Overflow on Path Graphs',
      detail: 'A directed chain of length 2 * 10^5 causes stack overflow in Java/Python/Rust during DFS or deep DSU path compression. Use an iterative DFS stack and iterative two-pass path compression in evalDSU.',
    },
    {
      type: 'WA',
      title: 'Omitting the Final Forward Pass idom[w] = idom[idom[w]]',
      detail: 'During the backward bucket pass, whenever sdom[y] < sdom[w], we set idom[w] = y as a temporary proxy pointer rather than the resolved dominator. Failing to resolve idom[w] = idom[idom[w]] in forward DFS order leaves wrong non-root dominators.',
    },
    {
      type: 'WA',
      title: 'Checking Reachability of Target T Before Climbing idom',
      detail: 'If target T is unreachable from S (dfn[T] == 0), climbing idom pointers infinite-loops at 0. Always check dfn[T] == 0 first.',
    },
  ],
  implementations: {
    cpp20: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

// Iterative Lengauer-Tarjan Dominator Tree in O((V + E) log V) / alpha(V)
struct DominatorTree {
    int n, root, timer = 0;
    vector<vector<int>> adj, revG, bucket;
    vector<int> dfn, rev, fa, sdom, idom, anc, best, dsuStk;

    DominatorTree(int n, int root)
        : n(n), root(root), adj(n + 1), revG(n + 1), bucket(n + 1),
          dfn(n + 1, 0), rev(n + 1, 0), fa(n + 1, 0), sdom(n + 1, 0),
          idom(n + 1, 0), anc(n + 1, 0), best(n + 1, 0) {}

    void addEdge(int u, int v) {
        adj[u].push_back(v);
    }

    int evalDSU(int x) {
        if (anc[x] == x) return best[x];
        dsuStk.clear();
        int r = x;
        while (anc[r] != r) {
            dsuStk.push_back(r);
            r = anc[r];
        }
        for (int i = static_cast<int>(dsuStk.size()) - 1; i >= 0; --i) {
            int cur = dsuStk[i];
            int p = anc[cur];
            if (sdom[best[p]] < sdom[best[cur]]) {
                best[cur] = best[p];
            }
            anc[cur] = r;
        }
        return best[x];
    }

    vector<int> build() {
        // Iterative DFS to compute preorder numbers dfn[u]
        vector<int> edgeIdx(n + 1, 0);
        vector<int> st = {root};
        dfn[root] = ++timer;
        rev[timer] = root;

        while (!st.empty()) {
            int u = st.back();
            if (edgeIdx[u] < static_cast<int>(adj[u].size())) {
                int v = adj[u][edgeIdx[u]++];
                if (!dfn[v]) {
                    dfn[v] = ++timer;
                    rev[timer] = v;
                    fa[timer] = dfn[u];
                    st.push_back(v);
                }
            } else {
                st.pop_back();
            }
        }

        for (int w = 1; w <= timer; ++w) {
            sdom[w] = anc[w] = best[w] = w;
            int u = rev[w];
            for (int v : adj[u]) {
                if (dfn[v]) revG[dfn[v]].push_back(w);
            }
        }

        for (int w = timer; w >= 2; --w) {
            for (int v : revG[w]) {
                int u = evalDSU(v);
                sdom[w] = min(sdom[w], sdom[u]);
            }
            bucket[sdom[w]].push_back(w);
            int p = fa[w];
            anc[w] = p;
            for (int x : bucket[p]) {
                int u = evalDSU(x);
                idom[x] = (sdom[u] < sdom[x]) ? u : p;
            }
            bucket[p].clear();
        }

        for (int w = 2; w <= timer; ++w) {
            if (idom[w] != sdom[w]) {
                idom[w] = idom[idom[w]];
            }
        }

        vector<int> origIdom(n + 1, 0);
        for (int w = 2; w <= timer; ++w) {
            origIdom[rev[w]] = rev[idom[w]];
        }
        return origIdom;
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, m;
    if (!(cin >> n >> m)) return 0;
    DominatorTree dt(n, 1);
    for (int i = 0; i < m; ++i) {
        int u, v;
        cin >> u >> v;
        dt.addEdge(u, v);
    }

    vector<int> origIdom = dt.build();
    vector<int> crit;
    if (dt.dfn[n]) {
        for (int cur = n; cur != 0; cur = origIdom[cur]) {
            crit.push_back(cur);
            if (cur == 1) break;
        }
    }
    sort(crit.begin(), crit.end());
    cout << crit.size() << "\\n";
    for (size_t i = 0; i < crit.size(); ++i) {
        if (i) cout << ' ';
        cout << crit[i];
    }
    cout << "\\n";
    return 0;
}
`,
    rust: `use std::io::{self, Read};

struct DominatorTree {
    n: usize,
    root: usize,
    timer: usize,
    adj: Vec<Vec<usize>>,
    dfn: Vec<usize>,
    rev: Vec<usize>,
    fa: Vec<usize>,
    sdom: Vec<usize>,
    idom: Vec<usize>,
    anc: Vec<usize>,
    best: Vec<usize>,
    dsu_stk: Vec<usize>,
}

impl DominatorTree {
    fn new(n: usize, root: usize) -> Self {
        DominatorTree {
            n,
            root,
            timer: 0,
            adj: vec![Vec::new(); n + 1],
            dfn: vec![0; n + 1],
            rev: vec![0; n + 1],
            fa: vec![0; n + 1],
            sdom: vec![0; n + 1],
            idom: vec![0; n + 1],
            anc: vec![0; n + 1],
            best: vec![0; n + 1],
            dsu_stk: Vec::new(),
        }
    }

    fn add_edge(&mut self, u: usize, v: usize) {
        self.adj[u].push(v);
    }

    fn eval_dsu(&mut self, x: usize) -> usize {
        if self.anc[x] == x {
            return self.best[x];
        }
        self.dsu_stk.clear();
        let mut r = x;
        while self.anc[r] != r {
            self.dsu_stk.push(r);
            r = self.anc[r];
        }
        for i in (0..self.dsu_stk.len()).rev() {
            let cur = self.dsu_stk[i];
            let p = self.anc[cur];
            if self.sdom[self.best[p]] < self.sdom[self.best[cur]] {
                self.best[cur] = self.best[p];
            }
            self.anc[cur] = r;
        }
        self.best[x]
    }

    fn build(&mut self) -> Vec<usize> {
        let mut edge_idx = vec![0usize; self.n + 1];
        let mut st = vec![self.root];
        self.timer = 1;
        self.dfn[self.root] = 1;
        self.rev[1] = self.root;

        while let Some(&u) = st.last() {
            if edge_idx[u] < self.adj[u].len() {
                let v = self.adj[u][edge_idx[u]];
                edge_idx[u] += 1;
                if self.dfn[v] == 0 {
                    self.timer += 1;
                    self.dfn[v] = self.timer;
                    self.rev[self.timer] = v;
                    self.fa[self.timer] = self.dfn[u];
                    st.push(v);
                }
            } else {
                st.pop();
            }
        }

        let mut rev_g = vec![Vec::new(); self.timer + 1];
        let mut bucket = vec![Vec::new(); self.timer + 1];
        for w in 1..=self.timer {
            self.sdom[w] = w;
            self.anc[w] = w;
            self.best[w] = w;
            let u = self.rev[w];
            for &v in &self.adj[u] {
                if self.dfn[v] != 0 {
                    rev_g[self.dfn[v]].push(w);
                }
            }
        }

        for w in (2..=self.timer).rev() {
            for &v in &rev_g[w] {
                let u = self.eval_dsu(v);
                if self.sdom[u] < self.sdom[w] {
                    self.sdom[w] = self.sdom[u];
                }
            }
            bucket[self.sdom[w]].push(w);
            let p = self.fa[w];
            self.anc[w] = p;
            let items = std::mem::take(&mut bucket[p]);
            for x in items {
                let u = self.eval_dsu(x);
                self.idom[x] = if self.sdom[u] < self.sdom[x] { u } else { p };
            }
        }

        for w in 2..=self.timer {
            if self.idom[w] != self.sdom[w] {
                self.idom[w] = self.idom[self.idom[w]];
            }
        }

        let mut orig_idom = vec![0usize; self.n + 1];
        for w in 2..=self.timer {
            orig_idom[self.rev[w]] = self.rev[self.idom[w]];
        }
        orig_idom
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
    let m: usize = it.next().unwrap().parse().unwrap();
    let mut dt = DominatorTree::new(n, 1);
    for _ in 0..m {
        let u: usize = it.next().unwrap().parse().unwrap();
        let v: usize = it.next().unwrap().parse().unwrap();
        dt.add_edge(u, v);
    }

    let orig_idom = dt.build();
    let mut crit = Vec::new();
    if dt.dfn[n] != 0 {
        let mut cur = n;
        while cur != 0 {
            crit.push(cur);
            if cur == 1 {
                break;
            }
            cur = orig_idom[cur];
        }
    }
    crit.sort_unstable();
    println!("{}", crit.len());
    for (i, &v) in crit.iter().enumerate() {
        if i > 0 {
            print!(" ");
        }
        print!("{}", v);
    }
    println!();
}
`,
    java21: `import java.io.BufferedInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;

public class Main {
    static class FastScanner {
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;
        private final BufferedInputStream in = new BufferedInputStream(System.in);

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
            do {
                c = readByte();
                if (c == -1) return -1;
            } while (c <= ' ');
            int res = 0;
            while (c > ' ') {
                res = res * 10 + (c - '0');
                c = readByte();
            }
            return res;
        }
    }

    static int[] dfn, rev, fa, sdom, idom, anc, best, dsuStk;
    static int timer = 0;

    static int evalDSU(int x) {
        if (anc[x] == x) return best[x];
        int top = 0;
        int r = x;
        while (anc[r] != r) {
            dsuStk[top++] = r;
            r = anc[r];
        }
        for (int i = top - 1; i >= 0; i--) {
            int cur = dsuStk[i];
            int p = anc[cur];
            if (sdom[best[p]] < sdom[best[cur]]) {
                best[cur] = best[p];
            }
            anc[cur] = r;
        }
        return best[x];
    }

    @SuppressWarnings("unchecked")
    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        int n = fs.nextInt();
        if (n == -1) return;
        int m = fs.nextInt();

        ArrayList<Integer>[] adj = new ArrayList[n + 1];
        for (int i = 1; i <= n; i++) adj[i] = new ArrayList<>();
        for (int i = 0; i < m; i++) {
            adj[fs.nextInt()].add(fs.nextInt());
        }

        dfn = new int[n + 1];
        rev = new int[n + 1];
        fa = new int[n + 1];
        sdom = new int[n + 1];
        idom = new int[n + 1];
        anc = new int[n + 1];
        best = new int[n + 1];
        dsuStk = new int[n + 1];

        int[] st = new int[n + 1];
        int[] edgeIdx = new int[n + 1];
        int sp = 0;
        st[sp++] = 1;
        dfn[1] = ++timer;
        rev[timer] = 1;

        while (sp > 0) {
            int u = st[sp - 1];
            if (edgeIdx[u] < adj[u].size()) {
                int v = adj[u].get(edgeIdx[u]++);
                if (dfn[v] == 0) {
                    dfn[v] = ++timer;
                    rev[timer] = v;
                    fa[timer] = dfn[u];
                    st[sp++] = v;
                }
            } else {
                sp--;
            }
        }

        ArrayList<Integer>[] revG = new ArrayList[timer + 1];
        ArrayList<Integer>[] bucket = new ArrayList[timer + 1];
        for (int w = 1; w <= timer; w++) {
            revG[w] = new ArrayList<>();
            bucket[w] = new ArrayList<>();
            sdom[w] = anc[w] = best[w] = w;
        }
        for (int w = 1; w <= timer; w++) {
            int u = rev[w];
            for (int v : adj[u]) {
                if (dfn[v] != 0) revG[dfn[v]].add(w);
            }
        }

        for (int w = timer; w >= 2; w--) {
            for (int v : revG[w]) {
                int u = evalDSU(v);
                if (sdom[u] < sdom[w]) sdom[w] = sdom[u];
            }
            bucket[sdom[w]].add(w);
            int p = fa[w];
            anc[w] = p;
            for (int x : bucket[p]) {
                int u = evalDSU(x);
                idom[x] = (sdom[u] < sdom[x]) ? u : p;
            }
            bucket[p].clear();
        }

        for (int w = 2; w <= timer; w++) {
            if (idom[w] != sdom[w]) idom[w] = idom[idom[w]];
        }

        int[] origIdom = new int[n + 1];
        for (int w = 2; w <= timer; w++) origIdom[rev[w]] = rev[idom[w]];

        ArrayList<Integer> crit = new ArrayList<>();
        if (dfn[n] != 0) {
            for (int cur = n; cur != 0; cur = origIdom[cur]) {
                crit.add(cur);
                if (cur == 1) break;
            }
        }
        Collections.sort(crit);
        StringBuilder sb = new StringBuilder();
        sb.append(crit.size()).append('\\n');
        for (int i = 0; i < crit.size(); i++) {
            if (i > 0) sb.append(' ');
            sb.append(crit.get(i));
        }
        System.out.println(sb.toString());
    }
}
`,
    python3: `import sys

sys.setrecursionlimit(200000)


def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    m = int(data[1])
    adj: list[list[int]] = [[] for _ in range(n + 1)]
    idx = 2
    for _ in range(m):
        u = int(data[idx])
        v = int(data[idx + 1])
        idx += 2
        adj[u].append(v)

    dfn = [0] * (n + 1)
    rev = [0] * (n + 1)
    fa = [0] * (n + 1)
    edge_idx = [0] * (n + 1)
    timer = 1
    dfn[1] = 1
    rev[1] = 1
    st = [1]

    while st:
        u = st[-1]
        if edge_idx[u] < len(adj[u]):
            v = adj[u][edge_idx[u]]
            edge_idx[u] += 1
            if dfn[v] == 0:
                timer += 1
                dfn[v] = timer
                rev[timer] = v
                fa[timer] = dfn[u]
                st.append(v)
        else:
            st.pop()

    rev_g: list[list[int]] = [[] for _ in range(timer + 1)]
    bucket: list[list[int]] = [[] for _ in range(timer + 1)]
    sdom = list(range(timer + 1))
    anc = list(range(timer + 1))
    best = list(range(timer + 1))
    idom = [0] * (timer + 1)

    for w in range(1, timer + 1):
        u = rev[w]
        for v in adj[u]:
            if dfn[v]:
                rev_g[dfn[v]].append(w)

    def eval_dsu(x: int) -> int:
        if anc[x] == x:
            return best[x]
        path: list[int] = []
        r = x
        while anc[r] != r:
            path.append(r)
            r = anc[r]
        for cur in reversed(path):
            p = anc[cur]
            if sdom[best[p]] < sdom[best[cur]]:
                best[cur] = best[p]
            anc[cur] = r
        return best[x]

    for w in range(timer, 1, -1):
        for v in rev_g[w]:
            u = eval_dsu(v)
            if sdom[u] < sdom[w]:
                sdom[w] = sdom[u]
        bucket[sdom[w]].append(w)
        p = fa[w]
        anc[w] = p
        for x in bucket[p]:
            u = eval_dsu(x)
            idom[x] = u if sdom[u] < sdom[x] else p
        bucket[p].clear()

    for w in range(2, timer + 1):
        if idom[w] != sdom[w]:
            idom[w] = idom[idom[w]]

    orig_idom = [0] * (n + 1)
    for w in range(2, timer + 1):
        orig_idom[rev[w]] = rev[idom[w]]

    crit: list[int] = []
    if dfn[n]:
        cur = n
        while cur:
            crit.append(cur)
            if cur == 1:
                break
            cur = orig_idom[cur]
    crit.sort()
    sys.stdout.write(f"{len(crit)}\\n{' '.join(map(str, crit))}\\n")


if __name__ == "__main__":
    solve()
`,
    ruby: `data = $stdin.read.split
exit if data.empty?
n = data[0].to_i
m = data[1].to_i
adj = Array.new(n + 1) { [] }
idx = 2
m.times do
  u = data[idx].to_i
  v = data[idx + 1].to_i
  idx += 2
  adj[u] << v
end

dfn = Array.new(n + 1, 0)
rev = Array.new(n + 1, 0)
fa = Array.new(n + 1, 0)
edge_idx = Array.new(n + 1, 0)
timer = 1
dfn[1] = 1
rev[1] = 1
st = [1]

until st.empty?
  u = st[-1]
  if edge_idx[u] < adj[u].length
    v = adj[u][edge_idx[u]]
    edge_idx[u] += 1
    if dfn[v] == 0
      timer += 1
      dfn[v] = timer
      rev[timer] = v
      fa[timer] = dfn[u]
      st << v
    end
  else
    st.pop
  end
end

rev_g = Array.new(timer + 1) { [] }
bucket = Array.new(timer + 1) { [] }
sdom = (0..timer).to_a
anc = (0..timer).to_a
best = (0..timer).to_a
idom = Array.new(timer + 1, 0)

(1..timer).each do |w|
  u = rev[w]
  adj[u].each { |v| rev_g[dfn[v]] << w if dfn[v] != 0 }
end

eval_dsu = lambda do |x|
  return best[x] if anc[x] == x
  path = []
  r = x
  while anc[r] != r
    path << r
    r = anc[r]
  end
  path.reverse_each do |cur|
    p = anc[cur]
    best[cur] = best[p] if sdom[best[p]] < sdom[best[cur]]
    anc[cur] = r
  end
  best[x]
end

timer.downto(2) do |w|
  rev_g[w].each do |v|
    u = eval_dsu.call(v)
    sdom[w] = sdom[u] if sdom[u] < sdom[w]
  end
  bucket[sdom[w]] << w
  p = fa[w]
  anc[w] = p
  bucket[p].each do |x|
    u = eval_dsu.call(x)
    idom[x] = sdom[u] < sdom[x] ? u : p
  end
  bucket[p].clear
end

(2..timer).each do |w|
  idom[w] = idom[idom[w]] if idom[w] != sdom[w]
end

orig_idom = Array.new(n + 1, 0)
(2..timer).each { |w| orig_idom[rev[w]] = rev[idom[w]] }

crit = []
if dfn[n] != 0
  cur = n
  while cur != 0
    crit << cur
    break if cur == 1
    cur = orig_idom[cur]
  end
end
crit.sort!
puts crit.length
puts crit.join(' ')
`,
  },
  practiceProblems: [
    {
      id: 'ch66-p1',
      tier: 'Warmup',
      ratingRange: '2400–2700',
      title: 'Critical Cities (Mandatory Vertices on All 1 -> N Paths)',
      statement:
        'There are N cities and M one-way flight routes. Find every critical city through which ANY route from city 1 to city N must pass. Print the number of critical cities on the first line, followed by their indices in ascending order.',
      constraints: '2 <= N <= 10^5, 1 <= M <= 2 * 10^5, at least one path from 1 to N exists',
      sampleInput: '5 6\n1 2\n1 3\n2 4\n3 4\n4 5\n5 2',
      sampleOutput: '3\n1 4 5',
      hints: [
        'A city u lies on every path from 1 to N if and only if u dominates N in the directed graph rooted at 1.',
        'Construct the Dominator Tree using Lengauer-Tarjan in O((N + M) alpha(N)) starting at vertex 1.',
        'Collect N, idom[N], idom[idom[N]], ..., 1 by walking up immediate dominator links, then sort ascending.',
      ],
      solutions: {
        cpp20: `#include <iostream>
#include <vector>
#include <algorithm>
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

    vector<int> dfn(n + 1, 0), rev(n + 1, 0), fa(n + 1, 0), edgeIdx(n + 1, 0);
    vector<int> st = {1};
    int timer = 1;
    dfn[1] = 1;
    rev[1] = 1;
    while (!st.empty()) {
        int u = st.back();
        if (edgeIdx[u] < static_cast<int>(adj[u].size())) {
            int v = adj[u][edgeIdx[u]++];
            if (!dfn[v]) {
                dfn[v] = ++timer;
                rev[timer] = v;
                fa[timer] = dfn[u];
                st.push_back(v);
            }
        } else {
            st.pop_back();
        }
    }

    vector<vector<int>> revG(timer + 1), bucket(timer + 1);
    vector<int> sdom(timer + 1), anc(timer + 1), best(timer + 1), idom(timer + 1, 0), dsuStk;
    for (int w = 1; w <= timer; ++w) {
        sdom[w] = anc[w] = best[w] = w;
        for (int v : adj[rev[w]]) {
            if (dfn[v]) revG[dfn[v]].push_back(w);
        }
    }

    auto evalDSU = [&](int x) {
        if (anc[x] == x) return best[x];
        dsuStk.clear();
        int r = x;
        while (anc[r] != r) {
            dsuStk.push_back(r);
            r = anc[r];
        }
        for (int i = static_cast<int>(dsuStk.size()) - 1; i >= 0; --i) {
            int cur = dsuStk[i];
            int p = anc[cur];
            if (sdom[best[p]] < sdom[best[cur]]) best[cur] = best[p];
            anc[cur] = r;
        }
        return best[x];
    };

    for (int w = timer; w >= 2; --w) {
        for (int v : revG[w]) sdom[w] = min(sdom[w], sdom[evalDSU(v)]);
        bucket[sdom[w]].push_back(w);
        int p = fa[w];
        anc[w] = p;
        for (int x : bucket[p]) {
            int u = evalDSU(x);
            idom[x] = (sdom[u] < sdom[x]) ? u : p;
        }
        bucket[p].clear();
    }
    for (int w = 2; w <= timer; ++w) {
        if (idom[w] != sdom[w]) idom[w] = idom[idom[w]];
    }

    vector<int> crit;
    for (int w = dfn[n]; w != 0; w = idom[w]) {
        crit.push_back(rev[w]);
        if (w == 1) break;
    }
    sort(crit.begin(), crit.end());
    cout << crit.size() << "\\n";
    for (size_t i = 0; i < crit.size(); ++i) {
        if (i) cout << ' ';
        cout << crit[i];
    }
    cout << "\\n";
    return 0;
}
`,
        rust: `use std::io::{self, Read};

fn eval_dsu(x: usize, anc: &mut [usize], best: &mut [usize], sdom: &[usize], stk: &mut Vec<usize>) -> usize {
    if anc[x] == x {
        return best[x];
    }
    stk.clear();
    let mut r = x;
    while anc[r] != r {
        stk.push(r);
        r = anc[r];
    }
    for i in (0..stk.len()).rev() {
        let cur = stk[i];
        let p = anc[cur];
        if sdom[best[p]] < sdom[best[cur]] {
            best[cur] = best[p];
        }
        anc[cur] = r;
    }
    best[x]
}

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let n: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };
    let m: usize = it.next().unwrap().parse().unwrap();
    let mut adj = vec![Vec::new(); n + 1];
    for _ in 0..m {
        let u: usize = it.next().unwrap().parse().unwrap();
        let v: usize = it.next().unwrap().parse().unwrap();
        adj[u].push(v);
    }

    let mut dfn = vec![0usize; n + 1];
    let mut rev = vec![0usize; n + 1];
    let mut fa = vec![0usize; n + 1];
    let mut edge_idx = vec![0usize; n + 1];
    let mut timer = 1usize;
    dfn[1] = 1;
    rev[1] = 1;
    let mut st = vec![1usize];
    while let Some(&u) = st.last() {
        if edge_idx[u] < adj[u].len() {
            let v = adj[u][edge_idx[u]];
            edge_idx[u] += 1;
            if dfn[v] == 0 {
                timer += 1;
                dfn[v] = timer;
                rev[timer] = v;
                fa[timer] = dfn[u];
                st.push(v);
            }
        } else {
            st.pop();
        }
    }

    let mut rev_g = vec![Vec::new(); timer + 1];
    let mut bucket = vec![Vec::new(); timer + 1];
    let mut sdom: Vec<usize> = (0..=timer).collect();
    let mut anc: Vec<usize> = (0..=timer).collect();
    let mut best: Vec<usize> = (0..=timer).collect();
    let mut idom = vec![0usize; timer + 1];
    let mut stk = Vec::new();

    for w in 1..=timer {
        for &v in &adj[rev[w]] {
            if dfn[v] != 0 {
                rev_g[dfn[v]].push(w);
            }
        }
    }

    for w in (2..=timer).rev() {
        for &v in &rev_g[w] {
            let u = eval_dsu(v, &mut anc, &mut best, &sdom, &mut stk);
            sdom[w] = sdom[w].min(sdom[u]);
        }
        bucket[sdom[w]].push(w);
        let p = fa[w];
        anc[w] = p;
        for x in std::mem::take(&mut bucket[p]) {
            let u = eval_dsu(x, &mut anc, &mut best, &sdom, &mut stk);
            idom[x] = if sdom[u] < sdom[x] { u } else { p };
        }
    }
    for w in 2..=timer {
        if idom[w] != sdom[w] {
            idom[w] = idom[idom[w]];
        }
    }

    let mut crit = Vec::new();
    let mut w = dfn[n];
    while w != 0 {
        crit.push(rev[w]);
        if w == 1 {
            break;
        }
        w = idom[w];
    }
    crit.sort_unstable();
    println!("{}", crit.len());
    for (i, &c) in crit.iter().enumerate() {
        if i > 0 {
            print!(" ");
        }
        print!("{}", c);
    }
    println!();
}
`,
        java21: `import java.io.BufferedInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;

public class Main {
    static class FastScanner {
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;
        private final BufferedInputStream in = new BufferedInputStream(System.in);

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
            do {
                c = readByte();
                if (c == -1) return -1;
            } while (c <= ' ');
            int res = 0;
            while (c > ' ') {
                res = res * 10 + (c - '0');
                c = readByte();
            }
            return res;
        }
    }

    static int[] anc, best, sdom, stk;

    static int evalDSU(int x) {
        if (anc[x] == x) return best[x];
        int top = 0, r = x;
        while (anc[r] != r) {
            stk[top++] = r;
            r = anc[r];
        }
        for (int i = top - 1; i >= 0; i--) {
            int cur = stk[i], p = anc[cur];
            if (sdom[best[p]] < sdom[best[cur]]) best[cur] = best[p];
            anc[cur] = r;
        }
        return best[x];
    }

    @SuppressWarnings("unchecked")
    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        int n = fs.nextInt();
        if (n == -1) return;
        int m = fs.nextInt();
        ArrayList<Integer>[] adj = new ArrayList[n + 1];
        for (int i = 1; i <= n; i++) adj[i] = new ArrayList<>();
        for (int i = 0; i < m; i++) adj[fs.nextInt()].add(fs.nextInt());

        int[] dfn = new int[n + 1], rev = new int[n + 1], fa = new int[n + 1];
        int[] edgeIdx = new int[n + 1], st = new int[n + 1];
        int timer = 1, sp = 0;
        st[sp++] = 1;
        dfn[1] = 1;
        rev[1] = 1;
        while (sp > 0) {
            int u = st[sp - 1];
            if (edgeIdx[u] < adj[u].size()) {
                int v = adj[u].get(edgeIdx[u]++);
                if (dfn[v] == 0) {
                    dfn[v] = ++timer;
                    rev[timer] = v;
                    fa[timer] = dfn[u];
                    st[sp++] = v;
                }
            } else sp--;
        }

        ArrayList<Integer>[] revG = new ArrayList[timer + 1];
        ArrayList<Integer>[] bucket = new ArrayList[timer + 1];
        sdom = new int[timer + 1];
        anc = new int[timer + 1];
        best = new int[timer + 1];
        stk = new int[timer + 1];
        int[] idom = new int[timer + 1];
        for (int w = 1; w <= timer; w++) {
            revG[w] = new ArrayList<>();
            bucket[w] = new ArrayList<>();
            sdom[w] = anc[w] = best[w] = w;
        }
        for (int w = 1; w <= timer; w++) {
            for (int v : adj[rev[w]]) if (dfn[v] != 0) revG[dfn[v]].add(w);
        }

        for (int w = timer; w >= 2; w--) {
            for (int v : revG[w]) sdom[w] = Math.min(sdom[w], sdom[evalDSU(v)]);
            bucket[sdom[w]].add(w);
            int p = fa[w];
            anc[w] = p;
            for (int x : bucket[p]) {
                int u = evalDSU(x);
                idom[x] = (sdom[u] < sdom[x]) ? u : p;
            }
            bucket[p].clear();
        }
        for (int w = 2; w <= timer; w++) if (idom[w] != sdom[w]) idom[w] = idom[idom[w]];

        ArrayList<Integer> crit = new ArrayList<>();
        for (int w = dfn[n]; w != 0; w = idom[w]) {
            crit.add(rev[w]);
            if (w == 1) break;
        }
        Collections.sort(crit);
        StringBuilder sb = new StringBuilder();
        sb.append(crit.size()).append('\\n');
        for (int i = 0; i < crit.size(); i++) {
            if (i > 0) sb.append(' ');
            sb.append(crit.get(i));
        }
        System.out.println(sb.toString());
    }
}
`,
        python3: `import sys

sys.setrecursionlimit(200000)


def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    m = int(data[1])
    adj: list[list[int]] = [[] for _ in range(n + 1)]
    idx = 2
    for _ in range(m):
        adj[int(data[idx])].append(int(data[idx + 1]))
        idx += 2

    dfn = [0] * (n + 1)
    rev = [0] * (n + 1)
    fa = [0] * (n + 1)
    edge_idx = [0] * (n + 1)
    timer = 1
    dfn[1] = 1
    rev[1] = 1
    st = [1]
    while st:
        u = st[-1]
        if edge_idx[u] < len(adj[u]):
            v = adj[u][edge_idx[u]]
            edge_idx[u] += 1
            if dfn[v] == 0:
                timer += 1
                dfn[v] = timer
                rev[timer] = v
                fa[timer] = dfn[u]
                st.append(v)
        else:
            st.pop()

    rev_g: list[list[int]] = [[] for _ in range(timer + 1)]
    bucket: list[list[int]] = [[] for _ in range(timer + 1)]
    sdom = list(range(timer + 1))
    anc = list(range(timer + 1))
    best = list(range(timer + 1))
    idom = [0] * (timer + 1)

    for w in range(1, timer + 1):
        for v in adj[rev[w]]:
            if dfn[v]:
                rev_g[dfn[v]].append(w)

    def eval_dsu(x: int) -> int:
        if anc[x] == x:
            return best[x]
        path: list[int] = []
        r = x
        while anc[r] != r:
            path.append(r)
            r = anc[r]
        for cur in reversed(path):
            p = anc[cur]
            if sdom[best[p]] < sdom[best[cur]]:
                best[cur] = best[p]
            anc[cur] = r
        return best[x]

    for w in range(timer, 1, -1):
        for v in rev_g[w]:
            u = eval_dsu(v)
            if sdom[u] < sdom[w]:
                sdom[w] = sdom[u]
        bucket[sdom[w]].append(w)
        p = fa[w]
        anc[w] = p
        for x in bucket[p]:
            u = eval_dsu(x)
            idom[x] = u if sdom[u] < sdom[x] else p
        bucket[p].clear()

    for w in range(2, timer + 1):
        if idom[w] != sdom[w]:
            idom[w] = idom[idom[w]]

    crit: list[int] = []
    w = dfn[n]
    while w:
        crit.append(rev[w])
        if w == 1:
            break
        w = idom[w]
    crit.sort()
    sys.stdout.write(f"{len(crit)}\\n{' '.join(map(str, crit))}\\n")


if __name__ == "__main__":
    solve()
`,
        ruby: `data = $stdin.read.split
exit if data.empty?
n = data[0].to_i
m = data[1].to_i
adj = Array.new(n + 1) { [] }
idx = 2
m.times do
  adj[data[idx].to_i] << data[idx + 1].to_i
  idx += 2
end

dfn = Array.new(n + 1, 0)
rev = Array.new(n + 1, 0)
fa = Array.new(n + 1, 0)
edge_idx = Array.new(n + 1, 0)
timer = 1
dfn[1] = 1
rev[1] = 1
st = [1]

until st.empty?
  u = st[-1]
  if edge_idx[u] < adj[u].length
    v = adj[u][edge_idx[u]]
    edge_idx[u] += 1
    if dfn[v] == 0
      timer += 1
      dfn[v] = timer
      rev[timer] = v
      fa[timer] = dfn[u]
      st << v
    end
  else
    st.pop
  end
end

rev_g = Array.new(timer + 1) { [] }
bucket = Array.new(timer + 1) { [] }
sdom = (0..timer).to_a
anc = (0..timer).to_a
best = (0..timer).to_a
idom = Array.new(timer + 1, 0)

(1..timer).each do |w|
  adj[rev[w]].each { |v| rev_g[dfn[v]] << w if dfn[v] != 0 }
end

eval_dsu = lambda do |x|
  return best[x] if anc[x] == x
  path = []
  r = x
  while anc[r] != r
    path << r
    r = anc[r]
  end
  path.reverse_each do |cur|
    p = anc[cur]
    best[cur] = best[p] if sdom[best[p]] < sdom[best[cur]]
    anc[cur] = r
  end
  best[x]
end

timer.downto(2) do |w|
  rev_g[w].each do |v|
    u = eval_dsu.call(v)
    sdom[w] = sdom[u] if sdom[u] < sdom[w]
  end
  bucket[sdom[w]] << w
  p = fa[w]
  anc[w] = p
  bucket[p].each do |x|
    u = eval_dsu.call(x)
    idom[x] = sdom[u] < sdom[x] ? u : p
  end
  bucket[p].clear
end

(2..timer).each { |w| idom[w] = idom[idom[w]] if idom[w] != sdom[w] }

crit = []
w = dfn[n]
while w != 0
  crit << rev[w]
  break if w == 1
  w = idom[w]
end
crit.sort!
puts crit.length
puts crit.join(' ')
`,
      },
    },
    {
      id: 'ch66-p2',
      tier: 'Standard',
      ratingRange: '2550–2800',
      title: 'Dominator Tree Subtree Sizes (Blast Radius Analysis)',
      statement:
        'Given a directed graph of N vertices and M directed edges with designated entry source vertex 1, compute for every vertex u in 1..N how many vertices (including u itself) become unreachable from vertex 1 if vertex u is deleted (output 0 if u is already unreachable from 1).',
      constraints: '1 <= N <= 2 * 10^5, 0 <= M <= 3 * 10^5',
      sampleInput: '5 6\n1 2\n1 3\n2 4\n3 4\n4 5\n5 2',
      sampleOutput: '5 1 1 2 1',
      hints: [
        'A reachable vertex v loses reachability from 1 upon removing u if and only if u dominates v (i.e., v lies inside u’s subtree in the Dominator Tree).',
        'Observe that DFS preorder order w = 1..timer is already a valid topological ordering of the Dominator Tree (idom[w] < w strictly for every w >= 2).',
        'Initialize sub[w] = 1 for all w = 1..timer and accumulate sub[idom[w]] += sub[w] backward from w = timer down to 2.',
      ],
      solutions: {
        cpp20: `#include <iostream>
#include <vector>
#include <algorithm>
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

    vector<int> dfn(n + 1, 0), rev(n + 1, 0), fa(n + 1, 0), edgeIdx(n + 1, 0);
    vector<int> st = {1};
    int timer = 1;
    dfn[1] = 1;
    rev[1] = 1;
    while (!st.empty()) {
        int u = st.back();
        if (edgeIdx[u] < static_cast<int>(adj[u].size())) {
            int v = adj[u][edgeIdx[u]++];
            if (!dfn[v]) {
                dfn[v] = ++timer;
                rev[timer] = v;
                fa[timer] = dfn[u];
                st.push_back(v);
            }
        } else {
            st.pop_back();
        }
    }

    vector<vector<int>> revG(timer + 1), bucket(timer + 1);
    vector<int> sdom(timer + 1), anc(timer + 1), best(timer + 1), idom(timer + 1, 0), dsuStk;
    for (int w = 1; w <= timer; ++w) {
        sdom[w] = anc[w] = best[w] = w;
        for (int v : adj[rev[w]]) {
            if (dfn[v]) revG[dfn[v]].push_back(w);
        }
    }

    auto evalDSU = [&](int x) {
        if (anc[x] == x) return best[x];
        dsuStk.clear();
        int r = x;
        while (anc[r] != r) {
            dsuStk.push_back(r);
            r = anc[r];
        }
        for (int i = static_cast<int>(dsuStk.size()) - 1; i >= 0; --i) {
            int cur = dsuStk[i];
            int p = anc[cur];
            if (sdom[best[p]] < sdom[best[cur]]) best[cur] = best[p];
            anc[cur] = r;
        }
        return best[x];
    };

    for (int w = timer; w >= 2; --w) {
        for (int v : revG[w]) sdom[w] = min(sdom[w], sdom[evalDSU(v)]);
        bucket[sdom[w]].push_back(w);
        int p = fa[w];
        anc[w] = p;
        for (int x : bucket[p]) {
            int u = evalDSU(x);
            idom[x] = (sdom[u] < sdom[x]) ? u : p;
        }
        bucket[p].clear();
    }
    for (int w = 2; w <= timer; ++w) {
        if (idom[w] != sdom[w]) idom[w] = idom[idom[w]];
    }

    vector<int> sub(timer + 1, 1);
    for (int w = timer; w >= 2; --w) {
        sub[idom[w]] += sub[w];
    }

    for (int u = 1; u <= n; ++u) {
        if (u > 1) cout << ' ';
        cout << (dfn[u] ? sub[dfn[u]] : 0);
    }
    cout << "\\n";
    return 0;
}
`,
        rust: `use std::io::{self, Read};

fn eval_dsu(x: usize, anc: &mut [usize], best: &mut [usize], sdom: &[usize], stk: &mut Vec<usize>) -> usize {
    if anc[x] == x {
        return best[x];
    }
    stk.clear();
    let mut r = x;
    while anc[r] != r {
        stk.push(r);
        r = anc[r];
    }
    for i in (0..stk.len()).rev() {
        let cur = stk[i];
        let p = anc[cur];
        if sdom[best[p]] < sdom[best[cur]] {
            best[cur] = best[p];
        }
        anc[cur] = r;
    }
    best[x]
}

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let n: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };
    let m: usize = it.next().unwrap().parse().unwrap();
    let mut adj = vec![Vec::new(); n + 1];
    for _ in 0..m {
        let u: usize = it.next().unwrap().parse().unwrap();
        let v: usize = it.next().unwrap().parse().unwrap();
        adj[u].push(v);
    }

    let mut dfn = vec![0usize; n + 1];
    let mut rev = vec![0usize; n + 1];
    let mut fa = vec![0usize; n + 1];
    let mut edge_idx = vec![0usize; n + 1];
    let mut timer = 1usize;
    dfn[1] = 1;
    rev[1] = 1;
    let mut st = vec![1usize];
    while let Some(&u) = st.last() {
        if edge_idx[u] < adj[u].len() {
            let v = adj[u][edge_idx[u]];
            edge_idx[u] += 1;
            if dfn[v] == 0 {
                timer += 1;
                dfn[v] = timer;
                rev[timer] = v;
                fa[timer] = dfn[u];
                st.push(v);
            }
        } else {
            st.pop();
        }
    }

    let mut rev_g = vec![Vec::new(); timer + 1];
    let mut bucket = vec![Vec::new(); timer + 1];
    let mut sdom: Vec<usize> = (0..=timer).collect();
    let mut anc: Vec<usize> = (0..=timer).collect();
    let mut best: Vec<usize> = (0..=timer).collect();
    let mut idom = vec![0usize; timer + 1];
    let mut stk = Vec::new();

    for w in 1..=timer {
        for &v in &adj[rev[w]] {
            if dfn[v] != 0 {
                rev_g[dfn[v]].push(w);
            }
        }
    }

    for w in (2..=timer).rev() {
        for &v in &rev_g[w] {
            let u = eval_dsu(v, &mut anc, &mut best, &sdom, &mut stk);
            sdom[w] = sdom[w].min(sdom[u]);
        }
        bucket[sdom[w]].push(w);
        let p = fa[w];
        anc[w] = p;
        for x in std::mem::take(&mut bucket[p]) {
            let u = eval_dsu(x, &mut anc, &mut best, &sdom, &mut stk);
            idom[x] = if sdom[u] < sdom[x] { u } else { p };
        }
    }
    for w in 2..=timer {
        if idom[w] != sdom[w] {
            idom[w] = idom[idom[w]];
        }
    }

    let mut sub = vec![1usize; timer + 1];
    for w in (2..=timer).rev() {
        sub[idom[w]] += sub[w];
    }

    for u in 1..=n {
        if u > 1 {
            print!(" ");
        }
        print!("{}", if dfn[u] != 0 { sub[dfn[u]] } else { 0 });
    }
    println!();
}
`,
        java21: `import java.io.BufferedInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;

public class Main {
    static class FastScanner {
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;
        private final BufferedInputStream in = new BufferedInputStream(System.in);

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
            do {
                c = readByte();
                if (c == -1) return -1;
            } while (c <= ' ');
            int res = 0;
            while (c > ' ') {
                res = res * 10 + (c - '0');
                c = readByte();
            }
            return res;
        }
    }

    static int[] anc, best, sdom, stk;

    static int evalDSU(int x) {
        if (anc[x] == x) return best[x];
        int top = 0, r = x;
        while (anc[r] != r) {
            stk[top++] = r;
            r = anc[r];
        }
        for (int i = top - 1; i >= 0; i--) {
            int cur = stk[i], p = anc[cur];
            if (sdom[best[p]] < sdom[best[cur]]) best[cur] = best[p];
            anc[cur] = r;
        }
        return best[x];
    }

    @SuppressWarnings("unchecked")
    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        int n = fs.nextInt();
        if (n == -1) return;
        int m = fs.nextInt();
        ArrayList<Integer>[] adj = new ArrayList[n + 1];
        for (int i = 1; i <= n; i++) adj[i] = new ArrayList<>();
        for (int i = 0; i < m; i++) adj[fs.nextInt()].add(fs.nextInt());

        int[] dfn = new int[n + 1], rev = new int[n + 1], fa = new int[n + 1];
        int[] edgeIdx = new int[n + 1], st = new int[n + 1];
        int timer = 1, sp = 0;
        st[sp++] = 1;
        dfn[1] = 1;
        rev[1] = 1;
        while (sp > 0) {
            int u = st[sp - 1];
            if (edgeIdx[u] < adj[u].size()) {
                int v = adj[u].get(edgeIdx[u]++);
                if (dfn[v] == 0) {
                    dfn[v] = ++timer;
                    rev[timer] = v;
                    fa[timer] = dfn[u];
                    st[sp++] = v;
                }
            } else sp--;
        }

        ArrayList<Integer>[] revG = new ArrayList[timer + 1];
        ArrayList<Integer>[] bucket = new ArrayList[timer + 1];
        sdom = new int[timer + 1];
        anc = new int[timer + 1];
        best = new int[timer + 1];
        stk = new int[timer + 1];
        int[] idom = new int[timer + 1];
        for (int w = 1; w <= timer; w++) {
            revG[w] = new ArrayList<>();
            bucket[w] = new ArrayList<>();
            sdom[w] = anc[w] = best[w] = w;
        }
        for (int w = 1; w <= timer; w++) {
            for (int v : adj[rev[w]]) if (dfn[v] != 0) revG[dfn[v]].add(w);
        }

        for (int w = timer; w >= 2; w--) {
            for (int v : revG[w]) sdom[w] = Math.min(sdom[w], sdom[evalDSU(v)]);
            bucket[sdom[w]].add(w);
            int p = fa[w];
            anc[w] = p;
            for (int x : bucket[p]) {
                int u = evalDSU(x);
                idom[x] = (sdom[u] < sdom[x]) ? u : p;
            }
            bucket[p].clear();
        }
        for (int w = 2; w <= timer; w++) if (idom[w] != sdom[w]) idom[w] = idom[idom[w]];

        int[] sub = new int[timer + 1];
        Arrays.fill(sub, 1);
        for (int w = timer; w >= 2; w--) sub[idom[w]] += sub[w];

        StringBuilder sb = new StringBuilder();
        for (int u = 1; u <= n; u++) {
            if (u > 1) sb.append(' ');
            sb.append(dfn[u] != 0 ? sub[dfn[u]] : 0);
        }
        System.out.println(sb.toString());
    }
}
`,
        python3: `import sys

sys.setrecursionlimit(200000)


def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    m = int(data[1])
    adj: list[list[int]] = [[] for _ in range(n + 1)]
    idx = 2
    for _ in range(m):
        adj[int(data[idx])].append(int(data[idx + 1]))
        idx += 2

    dfn = [0] * (n + 1)
    rev = [0] * (n + 1)
    fa = [0] * (n + 1)
    edge_idx = [0] * (n + 1)
    timer = 1
    dfn[1] = 1
    rev[1] = 1
    st = [1]
    while st:
        u = st[-1]
        if edge_idx[u] < len(adj[u]):
            v = adj[u][edge_idx[u]]
            edge_idx[u] += 1
            if dfn[v] == 0:
                timer += 1
                dfn[v] = timer
                rev[timer] = v
                fa[timer] = dfn[u]
                st.append(v)
        else:
            st.pop()

    rev_g: list[list[int]] = [[] for _ in range(timer + 1)]
    bucket: list[list[int]] = [[] for _ in range(timer + 1)]
    sdom = list(range(timer + 1))
    anc = list(range(timer + 1))
    best = list(range(timer + 1))
    idom = [0] * (timer + 1)

    for w in range(1, timer + 1):
        for v in adj[rev[w]]:
            if dfn[v]:
                rev_g[dfn[v]].append(w)

    def eval_dsu(x: int) -> int:
        if anc[x] == x:
            return best[x]
        path: list[int] = []
        r = x
        while anc[r] != r:
            path.append(r)
            r = anc[r]
        for cur in reversed(path):
            p = anc[cur]
            if sdom[best[p]] < sdom[best[cur]]:
                best[cur] = best[p]
            anc[cur] = r
        return best[x]

    for w in range(timer, 1, -1):
        for v in rev_g[w]:
            u = eval_dsu(v)
            if sdom[u] < sdom[w]:
                sdom[w] = sdom[u]
        bucket[sdom[w]].append(w)
        p = fa[w]
        anc[w] = p
        for x in bucket[p]:
            u = eval_dsu(x)
            idom[x] = u if sdom[u] < sdom[x] else p
        bucket[p].clear()

    for w in range(2, timer + 1):
        if idom[w] != sdom[w]:
            idom[w] = idom[idom[w]]

    sub = [1] * (timer + 1)
    for w in range(timer, 1, -1):
        sub[idom[w]] += sub[w]

    ans = [str(sub[dfn[u]] if dfn[u] else 0) for u in range(1, n + 1)]
    sys.stdout.write(" ".join(ans) + "\\n")


if __name__ == "__main__":
    solve()
`,
        ruby: `data = $stdin.read.split
exit if data.empty?
n = data[0].to_i
m = data[1].to_i
adj = Array.new(n + 1) { [] }
idx = 2
m.times do
  adj[data[idx].to_i] << data[idx + 1].to_i
  idx += 2
end

dfn = Array.new(n + 1, 0)
rev = Array.new(n + 1, 0)
fa = Array.new(n + 1, 0)
edge_idx = Array.new(n + 1, 0)
timer = 1
dfn[1] = 1
rev[1] = 1
st = [1]

until st.empty?
  u = st[-1]
  if edge_idx[u] < adj[u].length
    v = adj[u][edge_idx[u]]
    edge_idx[u] += 1
    if dfn[v] == 0
      timer += 1
      dfn[v] = timer
      rev[timer] = v
      fa[timer] = dfn[u]
      st << v
    end
  else
    st.pop
  end
end

rev_g = Array.new(timer + 1) { [] }
bucket = Array.new(timer + 1) { [] }
sdom = (0..timer).to_a
anc = (0..timer).to_a
best = (0..timer).to_a
idom = Array.new(timer + 1, 0)

(1..timer).each do |w|
  adj[rev[w]].each { |v| rev_g[dfn[v]] << w if dfn[v] != 0 }
end

eval_dsu = lambda do |x|
  return best[x] if anc[x] == x
  path = []
  r = x
  while anc[r] != r
    path << r
    r = anc[r]
  end
  path.reverse_each do |cur|
    p = anc[cur]
    best[cur] = best[p] if sdom[best[p]] < sdom[best[cur]]
    anc[cur] = r
  end
  best[x]
end

timer.downto(2) do |w|
  rev_g[w].each do |v|
    u = eval_dsu.call(v)
    sdom[w] = sdom[u] if sdom[u] < sdom[w]
  end
  bucket[sdom[w]] << w
  p = fa[w]
  anc[w] = p
  bucket[p].each do |x|
    u = eval_dsu.call(x)
    idom[x] = sdom[u] < sdom[x] ? u : p
  end
  bucket[p].clear
end

(2..timer).each { |w| idom[w] = idom[idom[w]] if idom[w] != sdom[w] }

sub = Array.new(timer + 1, 1)
timer.downto(2) { |w| sub[idom[w]] += sub[w] }
puts (1..n).map { |u| dfn[u] != 0 ? sub[dfn[u]] : 0 }.join(' ')
`,
      },
    },
    {
      id: 'ch66-p3',
      tier: 'Boss',
      ratingRange: '2600–3000',
      title: 'Mandatory Bottlenecks on the Shortest-Path DAG',
      statement:
        'Given a positively weighted directed graph with N vertices, M edges, and endpoints S and T, identify all vertices that lie on EVERY shortest path from S to T. Output the count K on the first line and the K sorted vertex indices on the second line (or 0 if T is unreachable from S).',
      constraints: '2 <= N <= 10^5, 1 <= M <= 2 * 10^5, 1 <= w <= 10^9',
      sampleInput: '6 7 1 6\n1 2 2\n1 3 2\n2 4 3\n3 4 3\n4 5 1\n4 6 4\n5 6 3',
      sampleOutput: '3\n1 4 6',
      hints: [
        'Run Dijkstra from S on the forward graph to compute distS[u], and run Dijkstra from T on the reversed graph to compute distT[v].',
        'A directed edge (u -> v, w) belongs to at least one shortest S-to-T path if and only if distS[u] + w + distT[v] == distS[T].',
        'Build the Shortest-Path DAG using only those tight edges, compute its Lengauer-Tarjan Dominator Tree rooted at S, and trace idom from T back to S.',
      ],
      solutions: {
        cpp20: `#include <iostream>
#include <vector>
#include <queue>
#include <tuple>
#include <algorithm>
using namespace std;

static constexpr long long INF = 4000000000000000000LL;

vector<long long> dijkstra(int n, int src, const vector<vector<pair<int, long long>>>& g) {
    vector<long long> dist(n + 1, INF);
    priority_queue<pair<long long, int>, vector<pair<long long, int>>, greater<>> pq;
    dist[src] = 0;
    pq.push({0, src});
    while (!pq.empty()) {
        auto [d, u] = pq.top();
        pq.pop();
        if (d != dist[u]) continue;
        for (auto [v, w] : g[u]) {
            if (d + w < dist[v]) {
                dist[v] = d + w;
                pq.push({dist[v], v});
            }
        }
    }
    return dist;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, m, s, t;
    if (!(cin >> n >> m >> s >> t)) return 0;

    vector<vector<pair<int, long long>>> g(n + 1), rg(n + 1);
    vector<tuple<int, int, long long>> edges;
    edges.reserve(m);
    for (int i = 0; i < m; ++i) {
        int u, v;
        long long w;
        cin >> u >> v >> w;
        g[u].push_back({v, w});
        rg[v].push_back({u, w});
        edges.emplace_back(u, v, w);
    }

    vector<long long> distS = dijkstra(n, s, g);
    if (distS[t] >= INF) {
        cout << "0\\n";
        return 0;
    }
    vector<long long> distT = dijkstra(n, t, rg);

    vector<vector<int>> dag(n + 1);
    for (auto [u, v, w] : edges) {
        if (distS[u] < INF && distT[v] < INF && distS[u] + w + distT[v] == distS[t]) {
            dag[u].push_back(v);
        }
    }

    vector<int> dfn(n + 1, 0), rev(n + 1, 0), fa(n + 1, 0), edgeIdx(n + 1, 0);
    vector<int> st = {s};
    int timer = 1;
    dfn[s] = 1;
    rev[1] = s;
    while (!st.empty()) {
        int u = st.back();
        if (edgeIdx[u] < static_cast<int>(dag[u].size())) {
            int v = dag[u][edgeIdx[u]++];
            if (!dfn[v]) {
                dfn[v] = ++timer;
                rev[timer] = v;
                fa[timer] = dfn[u];
                st.push_back(v);
            }
        } else {
            st.pop_back();
        }
    }

    vector<vector<int>> revG(timer + 1), bucket(timer + 1);
    vector<int> sdom(timer + 1), anc(timer + 1), best(timer + 1), idom(timer + 1, 0), dsuStk;
    for (int w = 1; w <= timer; ++w) {
        sdom[w] = anc[w] = best[w] = w;
        for (int v : dag[rev[w]]) {
            if (dfn[v]) revG[dfn[v]].push_back(w);
        }
    }

    auto evalDSU = [&](int x) {
        if (anc[x] == x) return best[x];
        dsuStk.clear();
        int r = x;
        while (anc[r] != r) {
            dsuStk.push_back(r);
            r = anc[r];
        }
        for (int i = static_cast<int>(dsuStk.size()) - 1; i >= 0; --i) {
            int cur = dsuStk[i];
            int p = anc[cur];
            if (sdom[best[p]] < sdom[best[cur]]) best[cur] = best[p];
            anc[cur] = r;
        }
        return best[x];
    };

    for (int w = timer; w >= 2; --w) {
        for (int v : revG[w]) sdom[w] = min(sdom[w], sdom[evalDSU(v)]);
        bucket[sdom[w]].push_back(w);
        int p = fa[w];
        anc[w] = p;
        for (int x : bucket[p]) {
            int u = evalDSU(x);
            idom[x] = (sdom[u] < sdom[x]) ? u : p;
        }
        bucket[p].clear();
    }
    for (int w = 2; w <= timer; ++w) {
        if (idom[w] != sdom[w]) idom[w] = idom[idom[w]];
    }

    vector<int> ans;
    for (int w = dfn[t]; w != 0; w = idom[w]) {
        ans.push_back(rev[w]);
        if (w == 1) break;
    }
    sort(ans.begin(), ans.end());
    cout << ans.size() << "\\n";
    for (size_t i = 0; i < ans.size(); ++i) {
        if (i) cout << ' ';
        cout << ans[i];
    }
    cout << "\\n";
    return 0;
}
`,
        rust: `use std::cmp::Reverse;
use std::collections::BinaryHeap;
use std::io::{self, Read};

const INF: i64 = 4_000_000_000_000_000_000;

fn dijkstra(n: usize, src: usize, g: &[Vec<(usize, i64)>]) -> Vec<i64> {
    let mut dist = vec![INF; n + 1];
    let mut pq = BinaryHeap::new();
    dist[src] = 0;
    pq.push(Reverse((0i64, src)));
    while let Some(Reverse((d, u))) = pq.pop() {
        if d != dist[u] {
            continue;
        }
        for &(v, w) in &g[u] {
            if d + w < dist[v] {
                dist[v] = d + w;
                pq.push(Reverse((dist[v], v)));
            }
        }
    }
    dist
}

fn eval_dsu(x: usize, anc: &mut [usize], best: &mut [usize], sdom: &[usize], stk: &mut Vec<usize>) -> usize {
    if anc[x] == x {
        return best[x];
    }
    stk.clear();
    let mut r = x;
    while anc[r] != r {
        stk.push(r);
        r = anc[r];
    }
    for i in (0..stk.len()).rev() {
        let cur = stk[i];
        let p = anc[cur];
        if sdom[best[p]] < sdom[best[cur]] {
            best[cur] = best[p];
        }
        anc[cur] = r;
    }
    best[x]
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
    let s: usize = it.next().unwrap().parse().unwrap();
    let t: usize = it.next().unwrap().parse().unwrap();

    let mut g = vec![Vec::new(); n + 1];
    let mut rg = vec![Vec::new(); n + 1];
    let mut edges = Vec::with_capacity(m);
    for _ in 0..m {
        let u: usize = it.next().unwrap().parse().unwrap();
        let v: usize = it.next().unwrap().parse().unwrap();
        let w: i64 = it.next().unwrap().parse().unwrap();
        g[u].push((v, w));
        rg[v].push((u, w));
        edges.push((u, v, w));
    }

    let dist_s = dijkstra(n, s, &g);
    if dist_s[t] >= INF {
        println!("0");
        return;
    }
    let dist_t = dijkstra(n, t, &rg);

    let mut dag = vec![Vec::new(); n + 1];
    for (u, v, w) in edges {
        if dist_s[u] < INF && dist_t[v] < INF && dist_s[u] + w + dist_t[v] == dist_s[t] {
            dag[u].push(v);
        }
    }

    let mut dfn = vec![0usize; n + 1];
    let mut rev = vec![0usize; n + 1];
    let mut fa = vec![0usize; n + 1];
    let mut edge_idx = vec![0usize; n + 1];
    let mut timer = 1usize;
    dfn[s] = 1;
    rev[1] = s;
    let mut st = vec![s];
    while let Some(&u) = st.last() {
        if edge_idx[u] < dag[u].len() {
            let v = dag[u][edge_idx[u]];
            edge_idx[u] += 1;
            if dfn[v] == 0 {
                timer += 1;
                dfn[v] = timer;
                rev[timer] = v;
                fa[timer] = dfn[u];
                st.push(v);
            }
        } else {
            st.pop();
        }
    }

    let mut rev_g = vec![Vec::new(); timer + 1];
    let mut bucket = vec![Vec::new(); timer + 1];
    let mut sdom: Vec<usize> = (0..=timer).collect();
    let mut anc: Vec<usize> = (0..=timer).collect();
    let mut best: Vec<usize> = (0..=timer).collect();
    let mut idom = vec![0usize; timer + 1];
    let mut stk = Vec::new();

    for w in 1..=timer {
        for &v in &dag[rev[w]] {
            if dfn[v] != 0 {
                rev_g[dfn[v]].push(w);
            }
        }
    }

    for w in (2..=timer).rev() {
        for &v in &rev_g[w] {
            let u = eval_dsu(v, &mut anc, &mut best, &sdom, &mut stk);
            sdom[w] = sdom[w].min(sdom[u]);
        }
        bucket[sdom[w]].push(w);
        let p = fa[w];
        anc[w] = p;
        for x in std::mem::take(&mut bucket[p]) {
            let u = eval_dsu(x, &mut anc, &mut best, &sdom, &mut stk);
            idom[x] = if sdom[u] < sdom[x] { u } else { p };
        }
    }
    for w in 2..=timer {
        if idom[w] != sdom[w] {
            idom[w] = idom[idom[w]];
        }
    }

    let mut ans = Vec::new();
    let mut w = dfn[t];
    while w != 0 {
        ans.push(rev[w]);
        if w == 1 {
            break;
        }
        w = idom[w];
    }
    ans.sort_unstable();
    println!("{}", ans.len());
    for (i, &c) in ans.iter().enumerate() {
        if i > 0 {
            print!(" ");
        }
        print!("{}", c);
    }
    println!();
}
`,
        java21: `import java.io.BufferedInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.PriorityQueue;

public class Main {
    static final long INF = 4_000_000_000_000_000_000L;

    static class FastScanner {
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;
        private final BufferedInputStream in = new BufferedInputStream(System.in);

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
            do {
                c = readByte();
                if (c == -1) return -1;
            } while (c <= ' ');
            long res = 0;
            while (c > ' ') {
                res = res * 10 + (c - '0');
                c = readByte();
            }
            return res;
        }
    }

    static long[] dijkstra(int n, int src, ArrayList<long[]>[] g) {
        long[] dist = new long[n + 1];
        Arrays.fill(dist, INF);
        PriorityQueue<long[]> pq = new PriorityQueue<>(Comparator.comparingLong(a -> a[0]));
        dist[src] = 0;
        pq.add(new long[]{0, src});
        while (!pq.isEmpty()) {
            long[] top = pq.poll();
            long d = top[0];
            int u = (int) top[1];
            if (d != dist[u]) continue;
            for (long[] e : g[u]) {
                int v = (int) e[0];
                long w = e[1];
                if (d + w < dist[v]) {
                    dist[v] = d + w;
                    pq.add(new long[]{dist[v], v});
                }
            }
        }
        return dist;
    }

    static int[] anc, best, sdom, stk;

    static int evalDSU(int x) {
        if (anc[x] == x) return best[x];
        int top = 0, r = x;
        while (anc[r] != r) {
            stk[top++] = r;
            r = anc[r];
        }
        for (int i = top - 1; i >= 0; i--) {
            int cur = stk[i], p = anc[cur];
            if (sdom[best[p]] < sdom[best[cur]]) best[cur] = best[p];
            anc[cur] = r;
        }
        return best[x];
    }

    @SuppressWarnings("unchecked")
    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        long nLong = fs.nextLong();
        if (nLong == -1) return;
        int n = (int) nLong;
        int m = (int) fs.nextLong();
        int s = (int) fs.nextLong();
        int t = (int) fs.nextLong();

        ArrayList<long[]>[] g = new ArrayList[n + 1];
        ArrayList<long[]>[] rg = new ArrayList[n + 1];
        for (int i = 1; i <= n; i++) {
            g[i] = new ArrayList<>();
            rg[i] = new ArrayList<>();
        }
        int[] eu = new int[m], ev = new int[m];
        long[] ew = new long[m];
        for (int i = 0; i < m; i++) {
            eu[i] = (int) fs.nextLong();
            ev[i] = (int) fs.nextLong();
            ew[i] = fs.nextLong();
            g[eu[i]].add(new long[]{ev[i], ew[i]});
            rg[ev[i]].add(new long[]{eu[i], ew[i]});
        }

        long[] distS = dijkstra(n, s, g);
        if (distS[t] >= INF) {
            System.out.println(0);
            return;
        }
        long[] distT = dijkstra(n, t, rg);

        ArrayList<Integer>[] dag = new ArrayList[n + 1];
        for (int i = 1; i <= n; i++) dag[i] = new ArrayList<>();
        for (int i = 0; i < m; i++) {
            int u = eu[i], v = ev[i];
            if (distS[u] < INF && distT[v] < INF && distS[u] + ew[i] + distT[v] == distS[t]) {
                dag[u].add(v);
            }
        }

        int[] dfn = new int[n + 1], rev = new int[n + 1], fa = new int[n + 1];
        int[] edgeIdx = new int[n + 1], st = new int[n + 1];
        int timer = 1, sp = 0;
        st[sp++] = s;
        dfn[s] = 1;
        rev[1] = s;
        while (sp > 0) {
            int u = st[sp - 1];
            if (edgeIdx[u] < dag[u].size()) {
                int v = dag[u].get(edgeIdx[u]++);
                if (dfn[v] == 0) {
                    dfn[v] = ++timer;
                    rev[timer] = v;
                    fa[timer] = dfn[u];
                    st[sp++] = v;
                }
            } else sp--;
        }

        ArrayList<Integer>[] revG = new ArrayList[timer + 1];
        ArrayList<Integer>[] bucket = new ArrayList[timer + 1];
        sdom = new int[timer + 1];
        anc = new int[timer + 1];
        best = new int[timer + 1];
        stk = new int[timer + 1];
        int[] idom = new int[timer + 1];
        for (int w = 1; w <= timer; w++) {
            revG[w] = new ArrayList<>();
            bucket[w] = new ArrayList<>();
            sdom[w] = anc[w] = best[w] = w;
        }
        for (int w = 1; w <= timer; w++) {
            for (int v : dag[rev[w]]) if (dfn[v] != 0) revG[dfn[v]].add(w);
        }

        for (int w = timer; w >= 2; w--) {
            for (int v : revG[w]) sdom[w] = Math.min(sdom[w], sdom[evalDSU(v)]);
            bucket[sdom[w]].add(w);
            int p = fa[w];
            anc[w] = p;
            for (int x : bucket[p]) {
                int u = evalDSU(x);
                idom[x] = (sdom[u] < sdom[x]) ? u : p;
            }
            bucket[p].clear();
        }
        for (int w = 2; w <= timer; w++) if (idom[w] != sdom[w]) idom[w] = idom[idom[w]];

        ArrayList<Integer> ans = new ArrayList<>();
        for (int w = dfn[t]; w != 0; w = idom[w]) {
            ans.add(rev[w]);
            if (w == 1) break;
        }
        Collections.sort(ans);
        StringBuilder sb = new StringBuilder();
        sb.append(ans.size()).append('\\n');
        for (int i = 0; i < ans.size(); i++) {
            if (i > 0) sb.append(' ');
            sb.append(ans.get(i));
        }
        System.out.println(sb.toString());
    }
}
`,
        python3: `import heapq
import sys

sys.setrecursionlimit(200000)
INF = 4_000_000_000_000_000_000


def dijkstra(n: int, src: int, g: list[list[tuple[int, int]]]) -> list[int]:
    dist = [INF] * (n + 1)
    dist[src] = 0
    pq = [(0, src)]
    while pq:
        d, u = heapq.heappop(pq)
        if d != dist[u]:
            continue
        for v, w in g[u]:
            nd = d + w
            if nd < dist[v]:
                dist[v] = nd
                heapq.heappush(pq, (nd, v))
    return dist


def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    m = int(data[1])
    s = int(data[2])
    t = int(data[3])

    g: list[list[tuple[int, int]]] = [[] for _ in range(n + 1)]
    rg: list[list[tuple[int, int]]] = [[] for _ in range(n + 1)]
    edges: list[tuple[int, int, int]] = []
    idx = 4
    for _ in range(m):
        u = int(data[idx])
        v = int(data[idx + 1])
        w = int(data[idx + 2])
        idx += 3
        g[u].append((v, w))
        rg[v].append((u, w))
        edges.append((u, v, w))

    dist_s = dijkstra(n, s, g)
    if dist_s[t] >= INF:
        print(0)
        return
    dist_t = dijkstra(n, t, rg)

    dag: list[list[int]] = [[] for _ in range(n + 1)]
    for u, v, w in edges:
        if dist_s[u] < INF and dist_t[v] < INF and dist_s[u] + w + dist_t[v] == dist_s[t]:
            dag[u].append(v)

    dfn = [0] * (n + 1)
    rev = [0] * (n + 1)
    fa = [0] * (n + 1)
    edge_idx = [0] * (n + 1)
    timer = 1
    dfn[s] = 1
    rev[1] = s
    st = [s]
    while st:
        u = st[-1]
        if edge_idx[u] < len(dag[u]):
            v = dag[u][edge_idx[u]]
            edge_idx[u] += 1
            if dfn[v] == 0:
                timer += 1
                dfn[v] = timer
                rev[timer] = v
                fa[timer] = dfn[u]
                st.append(v)
        else:
            st.pop()

    rev_g: list[list[int]] = [[] for _ in range(timer + 1)]
    bucket: list[list[int]] = [[] for _ in range(timer + 1)]
    sdom = list(range(timer + 1))
    anc = list(range(timer + 1))
    best = list(range(timer + 1))
    idom = [0] * (timer + 1)

    for w in range(1, timer + 1):
        for v in dag[rev[w]]:
            if dfn[v]:
                rev_g[dfn[v]].append(w)

    def eval_dsu(x: int) -> int:
        if anc[x] == x:
            return best[x]
        path: list[int] = []
        r = x
        while anc[r] != r:
            path.append(r)
            r = anc[r]
        for cur in reversed(path):
            p = anc[cur]
            if sdom[best[p]] < sdom[best[cur]]:
                best[cur] = best[p]
            anc[cur] = r
        return best[x]

    for w in range(timer, 1, -1):
        for v in rev_g[w]:
            u = eval_dsu(v)
            if sdom[u] < sdom[w]:
                sdom[w] = sdom[u]
        bucket[sdom[w]].append(w)
        p = fa[w]
        anc[w] = p
        for x in bucket[p]:
            u = eval_dsu(x)
            idom[x] = u if sdom[u] < sdom[x] else p
        bucket[p].clear()

    for w in range(2, timer + 1):
        if idom[w] != sdom[w]:
            idom[w] = idom[idom[w]]

    ans: list[int] = []
    w = dfn[t]
    while w:
        ans.append(rev[w])
        if w == 1:
            break
        w = idom[w]
    ans.sort()
    sys.stdout.write(f"{len(ans)}\\n{' '.join(map(str, ans))}\\n")


if __name__ == "__main__":
    solve()
`,
        ruby: `INF = 4_000_000_000_000_000_000

def dijkstra(n, src, g)
  dist = Array.new(n + 1, INF)
  dist[src] = 0
  heap = [[0, src]]
  push_heap = lambda do |item|
    heap << item
    i = heap.length - 1
    while i > 0
      p = (i - 1) >> 1
      break if heap[p][0] <= heap[i][0]
      heap[p], heap[i] = heap[i], heap[p]
      i = p
    end
  end
  pop_heap = lambda do
    res = heap[0]
    last = heap.pop
    unless heap.empty?
      heap[0] = last
      i = 0
      len = heap.length
      loop do
        l = (i << 1) + 1
        r = l + 1
        b = i
        b = l if l < len && heap[l][0] < heap[b][0]
        b = r if r < len && heap[r][0] < heap[b][0]
        break if b == i
        heap[i], heap[b] = heap[b], heap[i]
        i = b
      end
    end
    res
  end

  until heap.empty?
    d, u = pop_heap.call
    next if d != dist[u]
    g[u].each do |v, w|
      nd = d + w
      if nd < dist[v]
        dist[v] = nd
        push_heap.call([nd, v])
      end
    end
  end
  dist
end

data = $stdin.read.split
exit if data.empty?
n = data[0].to_i
m = data[1].to_i
s = data[2].to_i
t = data[3].to_i

g = Array.new(n + 1) { [] }
rg = Array.new(n + 1) { [] }
edges = []
idx = 4
m.times do
  u = data[idx].to_i
  v = data[idx + 1].to_i
  w = data[idx + 2].to_i
  idx += 3
  g[u] << [v, w]
  rg[v] << [u, w]
  edges << [u, v, w]
end

dist_s = dijkstra(n, s, g)
if dist_s[t] >= INF
  puts 0
  exit
end
dist_t = dijkstra(n, t, rg)

dag = Array.new(n + 1) { [] }
edges.each do |u, v, w|
  dag[u] << v if dist_s[u] < INF && dist_t[v] < INF && dist_s[u] + w + dist_t[v] == dist_s[t]
end

dfn = Array.new(n + 1, 0)
rev = Array.new(n + 1, 0)
fa = Array.new(n + 1, 0)
edge_idx = Array.new(n + 1, 0)
timer = 1
dfn[s] = 1
rev[1] = s
st = [s]

until st.empty?
  u = st[-1]
  if edge_idx[u] < dag[u].length
    v = dag[u][edge_idx[u]]
    edge_idx[u] += 1
    if dfn[v] == 0
      timer += 1
      dfn[v] = timer
      rev[timer] = v
      fa[timer] = dfn[u]
      st << v
    end
  else
    st.pop
  end
end

rev_g = Array.new(timer + 1) { [] }
bucket = Array.new(timer + 1) { [] }
sdom = (0..timer).to_a
anc = (0..timer).to_a
best = (0..timer).to_a
idom = Array.new(timer + 1, 0)

(1..timer).each do |w|
  dag[rev[w]].each { |v| rev_g[dfn[v]] << w if dfn[v] != 0 }
end

eval_dsu = lambda do |x|
  return best[x] if anc[x] == x
  path = []
  r = x
  while anc[r] != r
    path << r
    r = anc[r]
  end
  path.reverse_each do |cur|
    p = anc[cur]
    best[cur] = best[p] if sdom[best[p]] < sdom[best[cur]]
    anc[cur] = r
  end
  best[x]
end

timer.downto(2) do |w|
  rev_g[w].each do |v|
    u = eval_dsu.call(v)
    sdom[w] = sdom[u] if sdom[u] < sdom[w]
  end
  bucket[sdom[w]] << w
  p = fa[w]
  anc[w] = p
  bucket[p].each do |x|
    u = eval_dsu.call(x)
    idom[x] = sdom[u] < sdom[x] ? u : p
  end
  bucket[p].clear
end

(2..timer).each { |w| idom[w] = idom[idom[w]] if idom[w] != sdom[w] }

ans = []
w = dfn[t]
while w != 0
  ans << rev[w]
  break if w == 1
  w = idom[w]
end
ans.sort!
puts ans.length
puts ans.join(' ')
`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'CSES',
      title: 'Critical Cities (Task 1703)',
      difficulty: 'Hard',
      url: 'https://cses.fi/problemset/task/1703',
      patternNote: 'Direct Lengauer-Tarjan application: print all ancestors of N in the Dominator Tree rooted at 1.',
    },
    {
      platform: 'Codeforces',
      title: '757F — Team Rocket Rises Again',
      difficulty: '2800',
      url: 'https://codeforces.com/problemset/problem/757/F',
      patternNote: 'Build Shortest-Path DAG via Dijkstra, then find max dominator-tree subtree size excluding source.',
    },
    {
      platform: 'AtCoder',
      title: 'ABC288G / Directed Chokepoints',
      difficulty: '2500+',
      url: 'https://atcoder.jp/',
      patternNote: 'Dominator tree converts arbitrary directed reachability bottlenecks into O(1) tree ancestor checks.',
    },
  ],
  interviewNotes: [
    'Explain why articulation points and bridges cannot solve directed mandatory-vertex queries: back-edges and cross-edges allow detours around cycle chords without crossing the DFS parent.',
    'Define semidominator sdom[u] cleanly: the earliest DFS ancestor capable of reaching u via a path whose internal vertices all have dfn > dfn[u], which is computed via reverse DFS processing + DSU.',
    'Note how DAG dominators simplify to binary-lifting LCA over incoming DAG parents in topological order—whereas general cyclic directed graphs require full Lengauer-Tarjan.',
  ],
  projectBlueprint: {
    title: 'Compiler SSA Control-Flow Graph Analyzer & Cloud SPOF Detector',
    tagline: 'Near-linear static CFG dominance frontier engine for LLVM phi-node placement and service failure blast-radius mapping',
    stackSummary: 'TypeScript Iterative Lengauer-Tarjan Core + Interactive Directed CFG Stepper',
    asciiDiagram: [
      '+---------------------------------------------------------------+',
      '|  Directed CFG / Service Graph (Root S)                        |',
      '|        |                                                      |',
      '|        +--> [1] Iterative DFS Preorder Numbering (dfn[u])     |',
      '|        +--> [2] Reverse Sweep + DSU Semidominators (sdom[w])  |',
      '|        +--> [3] Forward Pass idom[w] & Subtree Blast Radius   |',
      '+---------------------------------------------------------------+',
    ].join('\n'),
    milestones: [
      {
        id: 'm1',
        title: 'Iterative DFS & Reverse-Edge Filter',
        detail: 'Filter out unreachable source edges before building inverse graph.',
      },
      {
        id: 'm2',
        title: 'Semidominator DSU Engine',
        detail: 'Implement two-pass iterative path compression tracking minimum sdom along ancestor links.',
      },
      {
        id: 'm3',
        title: 'Dominator Subtree Blast-Radius Counter',
        detail: 'Roll up subtree sizes in reverse preorder to quantify single-point-of-failure impact.',
      },
    ],
    starterCode: `export function buildDominators(n: number, root: number, adj: number[][]): number[] {
  const dfn = new Int32Array(n + 1), rev = new Int32Array(n + 1), fa = new Int32Array(n + 1);
  const edgeIdx = new Int32Array(n + 1), st = [root];
  let timer = 1;
  dfn[root] = 1; rev[1] = root;
  while (st.length) {
    const u = st[st.length - 1];
    if (edgeIdx[u] < adj[u].length) {
      const v = adj[u][edgeIdx[u]++];
      if (!dfn[v]) { dfn[v] = ++timer; rev[timer] = v; fa[timer] = dfn[u]; st.push(v); }
    } else st.pop();
  }
  return Array.from(dfn);
}`,
  },
};
