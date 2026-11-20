import type { TheoryChapter } from '../../types/vault';

export const CH08_BLOSSOM: TheoryChapter = {
  slug: 'general-graph-matching-blossom',
  topicId: 'gr-42',
  title: "General Graph Matching & Edmonds' Blossom Algorithm",
  domain: 'Graph & Tree Theory',
  ratingTier: '2600–3300+',
  usacoDivision: 'Advanced',
  subtitle:
    'Find maximum cardinality matchings in arbitrary non-bipartite graphs by contracting odd alternating cycles into virtual blossom supernodes.',
  analogyTitle: 'The Round-Table Team Rotation Analogy',
  analogyBody:
    'In a bipartite graph (say mentors on the left, students on the right), searching for an augmenting path with BFS works cleanly because every cycle has even length—nodes never change parity. Once you allow anyone to pair with anyone, three or five people can form an odd triangle where the same person looks "ready to accept a new partner" via one route and "already committed" via another. Instead of abandoning the search, Edmonds noticed that any odd cycle of length 2k+1 already has k internal pairs and 1 floating vertex: you can shrink the entire odd ring into a single virtual supernode ("blossom"), finish finding an augmenting path, and unfold the ring afterward to flip the exact internal edges.',
  prerequisites: [
    {
      slug: 'bipartite-matching-hopcroft-karp',
      title: 'Bipartite Matching & Augmenting Paths',
    },
    {
      slug: 'lca-binary-lifting-euler-tour',
      title: 'Lowest Common Ancestor (LCA)',
    },
  ],
  traceTitle: 'Interactive Edmonds Blossom Contraction & Augmentation Visualizer',
  traceSubtitle:
    'Step through odd-cycle detection, LCA blossom shrinking on a 5-cycle {1,2,3,4,5}, and augmenting path expansion—or add live nodes/edges without resetting state.',
  allowDynamicGraphEdit: true,
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Initial Partial Matching & Unmatched Root (Node 0)',
      explanation:
        'Edges (1, 2) and (3, 4) are currently matched. Node 0 and Node 5 are unmatched. Start alternating-tree BFS from root 0 (marked EVEN).',
      mode: 'graph',
      graph: {
        calloutMetric: 'Matching Size: 2 | Root: 0 (EVEN)',
        nodes: [
          { id: '0', label: '0', x: 90, y: 150, state: 'even', matchWith: null },
          { id: '1', label: '1', x: 210, y: 150, state: 'unmatched', matchWith: '2' },
          { id: '2', label: '2', x: 320, y: 75, state: 'matched', matchWith: '1' },
          { id: '3', label: '3', x: 450, y: 110, state: 'matched', matchWith: '4' },
          { id: '4', label: '4', x: 450, y: 215, state: 'matched', matchWith: '3' },
          { id: '5', label: '5', x: 320, y: 235, state: 'unmatched', matchWith: null },
        ],
        edges: [
          { id: 'e01', from: '0', to: '1', state: 'default' },
          { id: 'e12', from: '1', to: '2', state: 'matched' },
          { id: 'e23', from: '2', to: '3', state: 'default' },
          { id: 'e34', from: '3', to: '4', state: 'matched' },
          { id: 'e41', from: '4', to: '1', state: 'default' },
          { id: 'e35', from: '3', to: '5', state: 'default' },
        ],
      },
      variables: { Root: 0, Queue: '[0]', MatchedEdges: '(1,2), (3,4)' },
    },
    {
      stepNumber: 2,
      title: 'Expand Alternating Tree Across Matched Edges',
      explanation:
        'From 0 (EVEN), traverse unmatched edge (0,1) -> label 1 ODD, jump across matched edge (1,2) -> label 2 EVEN. From 2 (EVEN), traverse (2,3) -> label 3 ODD, jump (3,4) -> label 4 EVEN.',
      mode: 'graph',
      graph: {
        calloutMetric: 'Tree: 0(E) - 1(O) = 2(E) - 3(O) = 4(E)',
        nodes: [
          { id: '0', label: '0', x: 90, y: 150, state: 'even', matchWith: null },
          { id: '1', label: '1', x: 210, y: 150, state: 'odd', matchWith: '2' },
          { id: '2', label: '2', x: 320, y: 75, state: 'even', matchWith: '1' },
          { id: '3', label: '3', x: 450, y: 110, state: 'odd', matchWith: '4' },
          { id: '4', label: '4', x: 450, y: 215, state: 'even', matchWith: '3' },
          { id: '5', label: '5', x: 320, y: 235, state: 'unmatched', matchWith: null },
        ],
        edges: [
          { id: 'e01', from: '0', to: '1', state: 'augmenting' },
          { id: 'e12', from: '1', to: '2', state: 'matched' },
          { id: 'e23', from: '2', to: '3', state: 'augmenting' },
          { id: 'e34', from: '3', to: '4', state: 'matched' },
          { id: 'e41', from: '4', to: '1', state: 'default' },
          { id: 'e35', from: '3', to: '5', state: 'default' },
        ],
      },
      variables: { EVEN: '{0, 2, 4}', ODD: '{1, 3}', Unvisited: '{5}' },
    },
    {
      stepNumber: 3,
      title: 'EVEN-to-EVEN Collision? Wait—Check Blossom Cycle {1,2,3,4}',
      explanation:
        'Suppose edge (4, 2) or an odd-cycle chord (4, 1) bridges two alternating parities; when 4 (EVEN) explores (4, 2) or (2, 4) in a 5-cycle with (1,2,3,4,x), Edmonds walks upward from both endpoints to find their LCA base and contracts every ODD vertex inside the ring into EVEN.',
      mode: 'graph',
      graph: {
        calloutMetric: 'Blossom Base = 1 · Nodes {1, 2, 3, 4} Re-labeled EVEN',
        blossomRing: ['1', '2', '3', '4'],
        nodes: [
          { id: '0', label: '0', x: 90, y: 150, state: 'even', matchWith: null },
          { id: '1', label: '1', x: 210, y: 150, state: 'blossom', matchWith: '2' },
          { id: '2', label: '2', x: 320, y: 75, state: 'blossom', matchWith: '1' },
          { id: '3', label: '3', x: 450, y: 110, state: 'blossom', matchWith: '4' },
          { id: '4', label: '4', x: 450, y: 215, state: 'blossom', matchWith: '3' },
          { id: '5', label: '5', x: 320, y: 235, state: 'unmatched', matchWith: null },
        ],
        edges: [
          { id: 'e01', from: '0', to: '1', state: 'augmenting' },
          { id: 'e12', from: '1', to: '2', state: 'blossom-cycle' },
          { id: 'e23', from: '2', to: '3', state: 'blossom-cycle' },
          { id: 'e34', from: '3', to: '4', state: 'blossom-cycle' },
          { id: 'e41', from: '4', to: '1', state: 'blossom-cycle' },
          { id: 'e35', from: '3', to: '5', state: 'default' },
        ],
      },
      variables: { BaseLCA: 1, Contracted: '{1,2,3,4}', NewQueuePush: '3 (now EVEN)' },
    },
    {
      stepNumber: 4,
      title: 'Expose Augmenting Path to Unmatched Node 5 & Flip Parity',
      explanation:
        'Now that node 3 is inside the contracted EVEN blossom, edge (3, 5) reaches unmatched vertex 5! Unrolling the parent pointers yields augmenting path 0 - 1 = 4 - 3 - 5 (or 0-1=2-3-5 depending on chord), flipping matched edges to boost Matching Size from 2 to 3.',
      mode: 'graph',
      graph: {
        calloutMetric: 'Augmentation Complete · Matching Size: 3 (Perfect)',
        nodes: [
          { id: '0', label: '0', x: 90, y: 150, state: 'matched', matchWith: '1' },
          { id: '1', label: '1', x: 210, y: 150, state: 'matched', matchWith: '0' },
          { id: '2', label: '2', x: 320, y: 75, state: 'matched', matchWith: '3' },
          { id: '3', label: '3', x: 450, y: 110, state: 'matched', matchWith: '2' },
          { id: '4', label: '4', x: 450, y: 215, state: 'matched', matchWith: '5' },
          { id: '5', label: '5', x: 320, y: 235, state: 'matched', matchWith: '4' },
        ],
        edges: [
          { id: 'e01', from: '0', to: '1', state: 'matched' },
          { id: 'e12', from: '1', to: '2', state: 'default' },
          { id: 'e23', from: '2', to: '3', state: 'matched' },
          { id: 'e34', from: '3', to: '4', state: 'default' },
          { id: 'e41', from: '4', to: '1', state: 'default' },
          { id: 'e35', from: '3', to: '5', state: 'augmenting' },
        ],
      },
      variables: { MatchedPairs: '(0,1), (2,3), (4,5)', Size: 3, Status: 'Optimal' },
    },
  ],
  reductionClues: [
    {
      clue: '"Pair items/people from a single pool where compatibility is arbitrary (non-bipartite)"',
      translation:
        'Cannot 2-color the graph -> Bipartite Hopcroft-Karp fails; use Edmonds Blossom in O(V^3).',
    },
    {
      clue: '"Minimize / maximize cost over N <= 500 general-graph pairs or 2-degree subgraphs"',
      translation:
        'Graph gadget expansion (splitting vertices into degree-capacity copies) + Maximum Weight General Matching.',
    },
    {
      clue: '"Shortest simple path of even length / odd cycle constraints with N <= 400"',
      translation:
        'Clone graph G into G_1 and G_2 with zero-weight inter-copy edges; a shortest even simple path corresponds to an augmenting matching difference.',
    },
  ],
  timeComplexity: 'O(V^3) worst-case (O(V * E) practical with lazy greedy init)',
  spaceComplexity: 'O(V + E)',
  pitfalls: [
    {
      type: 'WA',
      title: 'Corrupting parent[] Pointers During Bidirectional Blossom Contraction',
      detail:
        'When shrinking an odd cycle between u and v with base b = LCA(u, v), you must walk BOTH paths u -> b and v -> b carefully, reversing parent pointers only for vertices strictly below b and pushing newly-EVEN ODD vertices into the BFS queue.',
    },
    {
      type: 'TLE',
      title: 'Running Full BFS From Scratch Without Greedy Pre-Matching',
      detail:
        'For N = 1000, pure Blossom from 0 edges can hit constant-factor limits. Adding a single O(E) greedy matching pass before the main loop typically matches >85% of edges instantly.',
    },
    {
      type: 'WA',
      title: 'Forgetting to Reset base[i] = i and state[i] = -1 Between Roots',
      detail:
        'Every unmatched root needs clean alternating tree state arrays (state, parent, base), while keeping match[] intact.',
    },
  ],
  implementations: {
    cpp20: `#include <bits/stdc++.h>
using namespace std;

struct Blossom {
    int n;
    vector<vector<int>> adj;
    vector<int> match, p, base, state;
    vector<bool> in_blossom;
    queue<int> q;

    explicit Blossom(int n)
        : n(n), adj(n), match(n, -1), p(n, -1), base(n), state(n, -1), in_blossom(n, false) {}

    void add_edge(int u, int v) {
        adj[u].push_back(v);
        adj[v].push_back(u);
    }

    int lca(int a, int b) {
        vector<bool> used(n, false);
        while (true) {
            a = base[a];
            used[a] = true;
            if (match[a] == -1) break;
            a = p[match[a]];
        }
        while (true) {
            b = base[b];
            if (used[b]) return b;
            b = p[match[b]];
        }
    }

    void mark_path(int v, int b, int children) {
        while (base[v] != b) {
            in_blossom[base[v]] = in_blossom[base[match[v]]] = true;
            p[v] = children;
            children = match[v];
            v = p[match[v]];
        }
    }

    int find_augmenting_path(int root) {
        fill(state.begin(), state.end(), -1);
        fill(p.begin(), p.end(), -1);
        iota(base.begin(), base.end(), 0);
        while (!q.empty()) q.pop();

        state[root] = 0; // 0 = EVEN, 1 = ODD
        q.push(root);

        while (!q.empty()) {
            int v = q.front();
            q.pop();
            for (int to : adj[v]) {
                if (base[v] == base[to] || match[v] == to) continue;
                if (to == root || (match[to] != -1 && p[match[to]] != -1)) {
                    int cur_base = lca(v, to);
                    fill(in_blossom.begin(), in_blossom.end(), false);
                    mark_path(v, cur_base, to);
                    mark_path(to, cur_base, v);
                    for (int i = 0; i < n; ++i) {
                        if (in_blossom[base[i]]) {
                            base[i] = cur_base;
                            if (state[i] != 0) {
                                state[i] = 0;
                                q.push(i);
                            }
                        }
                    }
                } else if (p[to] == -1) {
                    p[to] = v;
                    if (match[to] == -1) return to;
                    int nxt = match[to];
                    state[to] = 1;
                    state[nxt] = 0;
                    q.push(nxt);
                }
            }
        }
        return -1;
    }

    int max_matching() {
        int ans = 0;
        for (int u = 0; u < n; ++u) {
            if (match[u] == -1) {
                for (int v : adj[u]) {
                    if (match[v] == -1) {
                        match[u] = v; match[v] = u;
                        ++ans;
                        break;
                    }
                }
            }
        }
        for (int i = 0; i < n; ++i) {
            if (match[i] == -1) {
                int v = find_augmenting_path(i);
                if (v != -1) {
                    ++ans;
                    while (v != -1) {
                        int pv = p[v], ppv = match[pv];
                        match[v] = pv; match[pv] = v;
                        v = ppv;
                    }
                }
            }
        }
        return ans;
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    if (!(cin >> n >> m)) return 0;
    Blossom bl(n);
    for (int i = 0; i < m; ++i) {
        int u, v; cin >> u >> v;
        bl.add_edge(u, v);
    }
    cout << bl.max_matching() << '\\n';
    for (int i = 0; i < n; ++i) {
        if (i < bl.match[i]) cout << i << ' ' << bl.match[i] << '\\n';
    }
    return 0;
}`,
    rust: `use std::collections::VecDeque;
use std::io::{self, Read};

struct Blossom {
    n: usize,
    adj: Vec<Vec<usize>>,
    match_v: Vec<Option<usize>>,
    p: Vec<Option<usize>>,
    base: Vec<usize>,
    used: Vec<bool>,
}

impl Blossom {
    fn new(n: usize) -> Self {
        Self {
            n,
            adj: vec![Vec::new(); n],
            match_v: vec![None; n],
            p: vec![None; n],
            base: (0..n).collect(),
            used: vec![false; n],
        }
    }

    fn add_edge(&mut self, u: usize, v: usize) {
        self.adj[u].push(v);
        self.adj[v].push(u);
    }

    fn lca(&self, mut a: usize, mut b: usize) -> usize {
        let mut seen = vec![false; self.n];
        loop {
            a = self.base[a];
            seen[a] = true;
            if let Some(m) = self.match_v[a] {
                a = self.p[m].unwrap();
            } else {
                break;
            }
        }
        loop {
            b = self.base[b];
            if seen[b] {
                return b;
            }
            b = self.p[self.match_v[b].unwrap()].unwrap();
        }
    }

    fn mark_path(&mut self, mut v: usize, b: usize, mut children: usize, in_blossom: &mut [bool]) {
        while self.base[v] != b {
            let mv = self.match_v[v].unwrap();
            in_blossom[self.base[v]] = true;
            in_blossom[self.base[mv]] = true;
            self.p[v] = Some(children);
            children = mv;
            v = self.p[mv].unwrap();
        }
    }

    fn find_path(&mut self, root: usize) -> Option<usize> {
        self.used.fill(false);
        self.p.fill(None);
        for i in 0..self.n { self.base[i] = i; }
        let mut q = VecDeque::new();
        self.used[root] = true;
        q.push_back(root);

        while let Some(v) = q.pop_front() {
            let neighbors = self.adj[v].clone();
            for to in neighbors {
                if self.base[v] == self.base[to] || self.match_v[v] == Some(to) {
                    continue;
                }
                if to == root || (self.match_v[to].is_some() && self.p[self.match_v[to].unwrap()].is_some()) {
                    let cur_base = self.lca(v, to);
                    let mut in_blossom = vec![false; self.n];
                    self.mark_path(v, cur_base, to, &mut in_blossom);
                    self.mark_path(to, cur_base, v, &mut in_blossom);
                    for i in 0..self.n {
                        if in_blossom[self.base[i]] {
                            self.base[i] = cur_base;
                            if !self.used[i] {
                                self.used[i] = true;
                                q.push_back(i);
                            }
                        }
                    }
                } else if self.p[to].is_none() {
                    self.p[to] = Some(v);
                    if self.match_v[to].is_none() {
                        return Some(to);
                    }
                    let nxt = self.match_v[to].unwrap();
                    self.used[nxt] = true;
                    q.push_back(nxt);
                }
            }
        }
        None
    }

    fn max_matching(&mut self) -> usize {
        let mut ans = 0;
        for i in 0..self.n {
            if self.match_v[i].is_none() {
                if let Some(mut v) = self.find_path(i) {
                    ans += 1;
                    loop {
                        let pv = self.p[v].unwrap();
                        let ppv = self.match_v[pv];
                        self.match_v[v] = Some(pv);
                        self.match_v[pv] = Some(v);
                        match ppv {
                            Some(nxt) => v = nxt,
                            None => break,
                        }
                    }
                }
            }
        }
        ans
    }
}

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let Some(n_str) = it.next() else { return; };
    let n: usize = n_str.parse().unwrap();
    let m: usize = it.next().unwrap().parse().unwrap();
    let mut bl = Blossom::new(n);
    for _ in 0..m {
        let u: usize = it.next().unwrap().parse().unwrap();
        let v: usize = it.next().unwrap().parse().unwrap();
        bl.add_edge(u, v);
    }
    println!("{}", bl.max_matching());
}`,
    java21: `import java.io.*;
import java.util.*;

public class Main {
    static int n;
    static List<Integer>[] adj;
    static int[] match, p, base;
    static boolean[] used, blossom;

    static int lca(int a, int b) {
        boolean[] seen = new boolean[n];
        while (true) {
            a = base[a];
            seen[a] = true;
            if (match[a] == -1) break;
            a = p[match[a]];
        }
        while (true) {
            b = base[b];
            if (seen[b]) return b;
            b = p[match[b]];
        }
    }

    static void markPath(int v, int b, int children) {
        while (base[v] != b) {
            blossom[base[v]] = blossom[base[match[v]]] = true;
            p[v] = children;
            children = match[v];
            v = p[match[v]];
        }
    }

    static int findPath(int root) {
        Arrays.fill(used, false);
        Arrays.fill(p, -1);
        for (int i = 0; i < n; i++) base[i] = i;
        ArrayDeque<Integer> q = new ArrayDeque<>();
        used[root] = true;
        q.add(root);

        while (!q.isEmpty()) {
            int v = q.poll();
            for (int to : adj[v]) {
                if (base[v] == base[to] || match[v] == to) continue;
                if (to == root || (match[to] != -1 && p[match[to]] != -1)) {
                    int curBase = lca(v, to);
                    Arrays.fill(blossom, false);
                    markPath(v, curBase, to);
                    markPath(to, curBase, v);
                    for (int i = 0; i < n; i++) {
                        if (blossom[base[i]]) {
                            base[i] = curBase;
                            if (!used[i]) {
                                used[i] = true;
                                q.add(i);
                            }
                        }
                    }
                } else if (p[to] == -1) {
                    p[to] = v;
                    if (match[to] == -1) return to;
                    int nxt = match[to];
                    used[nxt] = true;
                    q.add(nxt);
                }
            }
        }
        return -1;
    }

    @SuppressWarnings("unchecked")
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(br.readLine());
        n = Integer.parseInt(st.nextToken());
        int m = Integer.parseInt(st.nextToken());
        adj = new List[n];
        for (int i = 0; i < n; i++) adj[i] = new ArrayList<>();
        for (int i = 0; i < m; i++) {
            st = new StringTokenizer(br.readLine());
            int u = Integer.parseInt(st.nextToken());
            int v = Integer.parseInt(st.nextToken());
            adj[u].add(v);
            adj[v].add(u);
        }
        match = new int[n]; Arrays.fill(match, -1);
        p = new int[n]; base = new int[n];
        used = new boolean[n]; blossom = new boolean[n];

        int ans = 0;
        for (int i = 0; i < n; i++) {
            if (match[i] == -1) {
                int v = findPath(i);
                if (v != -1) {
                    ans++;
                    while (v != -1) {
                        int pv = p[v], ppv = match[pv];
                        match[v] = pv; match[pv] = v;
                        v = ppv;
                    }
                }
            }
        }
        System.out.println(ans);
    }
}`,
    python3: `import sys
from collections import deque

def edmonds_blossom(n: int, adj: list[list[int]]) -> list[int]:
    match = [-1] * n
    p = [-1] * n
    base = list(range(n))
    used = [False] * n
    blossom = [False] * n

    def lca(a: int, b: int) -> int:
        seen = [False] * n
        while True:
            a = base[a]
            seen[a] = True
            if match[a] == -1:
                break
            a = p[match[a]]
        while True:
            b = base[b]
            if seen[b]:
                return b
            b = p[match[b]]

    def mark_path(v: int, b: int, children: int) -> None:
        while base[v] != b:
            blossom[base[v]] = blossom[base[match[v]]] = True
            p[v] = children
            children = match[v]
            v = p[match[v]]

    def find_path(root: int) -> int:
        for i in range(n):
            used[i] = False
            p[i] = -1
            base[i] = i
        q = deque([root])
        used[root] = True
        while q:
            v = q.popleft()
            for to in adj[v]:
                if base[v] == base[to] or match[v] == to:
                    continue
                if to == root or (match[to] != -1 and p[match[to]] != -1):
                    cur_base = lca(v, to)
                    for i in range(n):
                        blossom[i] = False
                    mark_path(v, cur_base, to)
                    mark_path(to, cur_base, v)
                    for i in range(n):
                        if blossom[base[i]]:
                            base[i] = cur_base
                            if not used[i]:
                                used[i] = True
                                q.append(i)
                elif p[to] == -1:
                    p[to] = v
                    if match[to] == -1:
                        return to
                    nxt = match[to]
                    used[nxt] = True
                    q.append(nxt)
        return -1

    for i in range(n):
        if match[i] == -1:
            v = find_path(i)
            while v != -1:
                pv = p[v]
                ppv = match[pv]
                match[v], match[pv] = pv, v
                v = ppv
    return match

def solve() -> None:
    data = list(map(int, sys.stdin.buffer.read().split()))
    if not data:
        return
    n, m = data[0], data[1]
    adj = [[] for _ in range(n)]
    for i in range(2, 2 + 2 * m, 2):
        u, v = data[i], data[i + 1]
        adj[u].append(v)
        adj[v].append(u)
    match = edmonds_blossom(n, adj)
    print(sum(1 for i, m_i in enumerate(match) if i < m_i))

if __name__ == "__main__":
    solve()`,
    ruby: `data = STDIN.read.split.map(&:to_i)
exit if data.empty?
n, m = data[0], data[1]
adj = Array.new(n) { [] }
(0...m).each do |i|
  u = data[2 + 2 * i]; v = data[3 + 2 * i]
  adj[u] << v; adj[v] << u
end

match = Array.new(n, -1)
p = Array.new(n, -1)
base = (0...n).to_a
used = Array.new(n, false)
blossom = Array.new(n, false)

lca = lambda do |a, b|
  seen = Array.new(n, false)
  loop do
    a = base[a]; seen[a] = true
    break if match[a] == -1
    a = p[match[a]]
  end
  loop do
    b = base[b]
    return b if seen[b]
    b = p[match[b]]
  end
end

mark_path = lambda do |v, b, children|
  while base[v] != b
    blossom[base[v]] = blossom[base[match[v]]] = true
    p[v] = children
    children = match[v]
    v = p[match[v]]
  end
end

find_path = lambda do |root|
  n.times { |i| used[i] = false; p[i] = -1; base[i] = i }
  q = [root]
  used[root] = true
  until q.empty?
    v = q.shift
    adj[v].each do |to|
      next if base[v] == base[to] || match[v] == to
      if to == root || (match[to] != -1 && p[match[to]] != -1)
        cur_base = lca.call(v, to)
        blossom.fill(false)
        mark_path.call(v, cur_base, to)
        mark_path.call(to, cur_base, v)
        n.times do |i|
          if blossom[base[i]]
            base[i] = cur_base
            unless used[i]
              used[i] = true
              q << i
            end
          end
        end
      elsif p[to] == -1
        p[to] = v
        return to if match[to] == -1
        nxt = match[to]
        used[nxt] = true
        q << nxt
      end
    end
  end
  -1
end

ans = 0
n.times do |i|
  next unless match[i] == -1
  v = find_path.call(i)
  if v != -1
    ans += 1
    while v != -1
      pv = p[v]; ppv = match[pv]
      match[v] = pv; match[pv] = v
      v = ppv
    end
  end
end
puts ans`,
  },
  practiceProblems: [
    {
      id: 'ch08-warmup',
      tier: 'Warmup',
      ratingRange: '1800–2100',
      title: 'Odd-Cycle Detection & Maximum Non-Bipartite Matching',
      statement:
        'Given an arbitrary undirected graph with N vertices and M edges, output the maximum number of disjoint vertex pairs that can be matched simultaneously.',
      constraints: '1 <= N <= 400, 0 <= M <= N*(N-1)/2, Time Limit: 1.0s',
      sampleInput: '5 5\n0 1\n1 2\n2 0\n2 3\n3 4',
      sampleOutput: '2',
      hints: [
        'Vertices {0, 1, 2} form a triangle (odd cycle). Bipartite matching fails because there is no 2-coloring.',
        'Run Edmonds Blossom directly on the adjacency list.',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;
// Same Blossom core as Chapter template; reads N, M and prints max matching size.
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, m; cin >> n >> m;
    vector<vector<int>> g(n);
    for (int i = 0; i < m; ++i) { int u, v; cin >> u >> v; g[u].push_back(v); g[v].push_back(u); }
    vector<int> match(n, -1), p(n), base(n), used(n), bl(n);
    auto lca = [&](int a, int b) {
        vector<int> s(n, 0);
        while (true) { a = base[a]; s[a] = 1; if (match[a] == -1) break; a = p[match[a]]; }
        while (true) { b = base[b]; if (s[b]) return b; b = p[match[b]]; }
    };
    auto mark = [&](int v, int b, int c) {
        while (base[v] != b) { bl[base[v]] = bl[base[match[v]]] = 1; p[v] = c; c = match[v]; v = p[match[v]]; }
    };
    auto bfs = [&](int r) {
        fill(used.begin(), used.end(), 0); fill(p.begin(), p.end(), -1); iota(base.begin(), base.end(), 0);
        queue<int> q; q.push(r); used[r] = 1;
        while (!q.empty()) {
            int v = q.front(); q.pop();
            for (int to : g[v]) {
                if (base[v] == base[to] || match[v] == to) continue;
                if (to == r || (match[to] != -1 && p[match[to]] != -1)) {
                    int cb = lca(v, to); fill(bl.begin(), bl.end(), 0);
                    mark(v, cb, to); mark(to, cb, v);
                    for (int i = 0; i < n; ++i) if (bl[base[i]]) { base[i] = cb; if (!used[i]) { used[i] = 1; q.push(i); } }
                } else if (p[to] == -1) {
                    p[to] = v; if (match[to] == -1) return to;
                    used[match[to]] = 1; q.push(match[to]);
                }
            }
        }
        return -1;
    };
    int ans = 0;
    for (int i = 0; i < n; ++i) if (match[i] == -1) {
        int v = bfs(i); if (v != -1) { ++ans; while (v != -1) { int pv = p[v], ppv = match[pv]; match[v] = pv; match[pv] = v; v = ppv; } }
    }
    cout << ans << '\\n';
}`,
        rust: `use std::collections::VecDeque;
use std::io::{self, Read};

struct Blossom {
    n: usize,
    adj: Vec<Vec<usize>>,
    match_to: Vec<isize>,
    p: Vec<isize>,
    base: Vec<usize>,
    used: Vec<bool>,
    blossom: Vec<bool>,
}

impl Blossom {
    fn new(n: usize) -> Self {
        Self {
            n,
            adj: vec![Vec::new(); n],
            match_to: vec![-1; n],
            p: vec![-1; n],
            base: (0..n).collect(),
            used: vec![false; n],
            blossom: vec![false; n],
        }
    }
    fn add_edge(&mut self, u: usize, v: usize) {
        self.adj[u].push(v);
        self.adj[v].push(u);
    }
    fn lca(&self, mut a: usize, mut b: usize) -> usize {
        let mut seen = vec![false; self.n];
        loop {
            a = self.base[a];
            seen[a] = true;
            if self.match_to[a] == -1 { break; }
            a = self.p[self.match_to[a] as usize] as usize;
        }
        loop {
            b = self.base[b];
            if seen[b] { return b; }
            b = self.p[self.match_to[b] as usize] as usize;
        }
    }
    fn mark_path(&mut self, mut v: usize, b: usize, mut children: isize) {
        while self.base[v] != b {
            let mv = self.match_to[v] as usize;
            self.blossom[self.base[v]] = true;
            self.blossom[self.base[mv]] = true;
            self.p[v] = children;
            children = mv as isize;
            v = self.p[mv] as usize;
        }
    }
    fn find_path(&mut self, root: usize) -> isize {
        self.used.fill(false);
        self.p.fill(-1);
        for i in 0..self.n { self.base[i] = i; }
        let mut q = VecDeque::new();
        q.push_back(root);
        self.used[root] = true;
        while let Some(v) = q.pop_front() {
            for idx in 0..self.adj[v].len() {
                let to = self.adj[v][idx];
                if self.base[v] == self.base[to] || self.match_to[v] == to as isize { continue; }
                if to == root || (self.match_to[to] != -1 && self.p[self.match_to[to] as usize] != -1) {
                    let cur_base = self.lca(v, to);
                    self.blossom.fill(false);
                    self.mark_path(v, cur_base, to as isize);
                    self.mark_path(to, cur_base, v as isize);
                    for i in 0..self.n {
                        if self.blossom[self.base[i]] {
                            self.base[i] = cur_base;
                            if !self.used[i] { self.used[i] = true; q.push_back(i); }
                        }
                    }
                } else if self.p[to] == -1 {
                    self.p[to] = v as isize;
                    if self.match_to[to] == -1 { return to as isize; }
                    let nxt = self.match_to[to] as usize;
                    self.used[nxt] = true;
                    q.push_back(nxt);
                }
            }
        }
        -1
    }
    fn max_matching(&mut self) -> usize {
        let mut ans = 0;
        for i in 0..self.n {
            if self.match_to[i] == -1 {
                let mut v = self.find_path(i);
                if v != -1 {
                    ans += 1;
                    while v != -1 {
                        let pv = self.p[v as usize];
                        let ppv = self.match_to[pv as usize];
                        self.match_to[v as usize] = pv;
                        self.match_to[pv as usize] = v;
                        v = ppv;
                    }
                }
            }
        }
        ans
    }
}

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace().map(|x| x.parse::<usize>().unwrap());
    let Some(n) = it.next() else { return; };
    let m = it.next().unwrap();
    let mut bl = Blossom::new(n);
    for _ in 0..m { bl.add_edge(it.next().unwrap(), it.next().unwrap()); }
    println!("{}", bl.max_matching());
}`,
        java21: `import java.io.*;
import java.util.*;

public class Main {
    static int n;
    static List<Integer>[] adj;
    static int[] match, p, base;
    static boolean[] used, blossom;

    static int lca(int a, int b) {
        boolean[] seen = new boolean[n];
        while (true) {
            a = base[a]; seen[a] = true;
            if (match[a] == -1) break;
            a = p[match[a]];
        }
        while (true) {
            b = base[b];
            if (seen[b]) return b;
            b = p[match[b]];
        }
    }

    static void markPath(int v, int b, int children) {
        while (base[v] != b) {
            blossom[base[v]] = blossom[base[match[v]]] = true;
            p[v] = children; children = match[v]; v = p[match[v]];
        }
    }

    static int findPath(int root) {
        Arrays.fill(used, false); Arrays.fill(p, -1);
        for (int i = 0; i < n; i++) base[i] = i;
        ArrayDeque<Integer> q = new ArrayDeque<>();
        q.add(root); used[root] = true;
        while (!q.isEmpty()) {
            int v = q.poll();
            for (int to : adj[v]) {
                if (base[v] == base[to] || match[v] == to) continue;
                if (to == root || (match[to] != -1 && p[match[to]] != -1)) {
                    int cb = lca(v, to);
                    Arrays.fill(blossom, false);
                    markPath(v, cb, to); markPath(to, cb, v);
                    for (int i = 0; i < n; i++) if (blossom[base[i]]) {
                        base[i] = cb;
                        if (!used[i]) { used[i] = true; q.add(i); }
                    }
                } else if (p[to] == -1) {
                    p[to] = v;
                    if (match[to] == -1) return to;
                    used[match[to]] = true; q.add(match[to]);
                }
            }
        }
        return -1;
    }

    @SuppressWarnings("unchecked")
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String line = br.readLine(); if (line == null) return;
        StringTokenizer st = new StringTokenizer(line);
        n = Integer.parseInt(st.nextToken());
        int m = Integer.parseInt(st.nextToken());
        adj = new ArrayList[n];
        for (int i = 0; i < n; i++) adj[i] = new ArrayList<>();
        for (int i = 0; i < m; i++) {
            st = new StringTokenizer(br.readLine());
            int u = Integer.parseInt(st.nextToken()), v = Integer.parseInt(st.nextToken());
            adj[u].add(v); adj[v].add(u);
        }
        match = new int[n]; Arrays.fill(match, -1);
        p = new int[n]; base = new int[n]; used = new boolean[n]; blossom = new boolean[n];
        int ans = 0;
        for (int i = 0; i < n; i++) if (match[i] == -1) {
            int v = findPath(i);
            if (v != -1) {
                ans++;
                while (v != -1) { int pv = p[v], ppv = match[pv]; match[v] = pv; match[pv] = v; v = ppv; }
            }
        }
        System.out.println(ans);
    }
}`,
        python3: `from collections import deque
import sys

def edmonds_blossom(n: int, adj: list[list[int]]) -> int:
    match = [-1] * n
    p = [-1] * n
    base = list(range(n))
    used = [False] * n
    blossom = [False] * n

    def lca(a: int, b: int) -> int:
        seen = [False] * n
        while True:
            a = base[a]; seen[a] = True
            if match[a] == -1: break
            a = p[match[a]]
        while True:
            b = base[b]
            if seen[b]: return b
            b = p[match[b]]

    def mark_path(v: int, b: int, children: int):
        while base[v] != b:
            blossom[base[v]] = blossom[base[match[v]]] = True
            p[v] = children; children = match[v]; v = p[match[v]]

    def find_path(root: int) -> int:
        for i in range(n):
            used[i] = False; p[i] = -1; base[i] = i
        q = deque([root]); used[root] = True
        while q:
            v = q.popleft()
            for to in adj[v]:
                if base[v] == base[to] or match[v] == to: continue
                if to == root or (match[to] != -1 and p[match[to]] != -1):
                    cb = lca(v, to)
                    for i in range(n): blossom[i] = False
                    mark_path(v, cb, to); mark_path(to, cb, v)
                    for i in range(n):
                        if blossom[base[i]]:
                            base[i] = cb
                            if not used[i]: used[i] = True; q.append(i)
                elif p[to] == -1:
                    p[to] = v
                    if match[to] == -1: return to
                    nxt = match[to]; used[nxt] = True; q.append(nxt)
        return -1

    ans = 0
    for i in range(n):
        if match[i] == -1:
            v = find_path(i)
            if v != -1:
                ans += 1
                while v != -1:
                    pv = p[v]; ppv = match[pv]
                    match[v] = pv; match[pv] = v; v = ppv
    return ans

def solve():
    data = list(map(int, sys.stdin.buffer.read().split()))
    if not data: return
    n, m = data[0], data[1]
    adj = [[] for _ in range(n)]
    for i in range(2, 2 + 2 * m, 2):
        u, v = data[i], data[i + 1]
        adj[u].append(v); adj[v].append(u)
    print(edmonds_blossom(n, adj))

if __name__ == "__main__":
    solve()`,
        ruby: `data = STDIN.read.split.map(&:to_i)
exit if data.empty?
n, m = data[0], data[1]
adj = Array.new(n) { [] }
m.times do |i|
  u, v = data[2 + 2 * i], data[3 + 2 * i]
  adj[u] << v; adj[v] << u
end
match = Array.new(n, -1); p = Array.new(n, -1); base = (0...n).to_a
used = Array.new(n, false); blossom = Array.new(n, false)

lca = lambda do |a, b|
  seen = Array.new(n, false)
  loop { a = base[a]; seen[a] = true; break if match[a] == -1; a = p[match[a]] }
  loop { b = base[b]; return b if seen[b]; b = p[match[b]] }
end

mark_path = lambda do |v, b, children|
  while base[v] != b
    blossom[base[v]] = blossom[base[match[v]]] = true
    p[v] = children; children = match[v]; v = p[match[v]]
  end
end

find_path = lambda do |root|
  used.fill(false); p.fill(-1); n.times { |i| base[i] = i }
  q = [root]; head = 0; used[root] = true
  while head < q.size
    v = q[head]; head += 1
    adj[v].each do |to|
      next if base[v] == base[to] || match[v] == to
      if to == root || (match[to] != -1 && p[match[to]] != -1)
        cb = lca.call(v, to); blossom.fill(false)
        mark_path.call(v, cb, to); mark_path.call(to, cb, v)
        n.times { |i| if blossom[base[i]]; base[i] = cb; unless used[i]; used[i] = true; q << i; end; end }
      elsif p[to] == -1
        p[to] = v; return to if match[to] == -1
        nxt = match[to]; used[nxt] = true; q << nxt
      end
    end
  end
  -1
end

ans = 0
n.times do |i|
  next if match[i] != -1
  v = find_path.call(i)
  next if v == -1
  ans += 1
  while v != -1; pv = p[v]; ppv = match[pv]; match[v] = pv; match[pv] = v; v = ppv; end
end
puts ans`,
      },
    },
    {
      id: 'ch08-standard',
      tier: 'Standard',
      ratingRange: '2400–2700',
      title: 'Perfect Matching Existence via Randomized Tutte Matrix Rank',
      statement:
        'Given a dense general graph of N <= 300 vertices, decide in O(N^3) time using linear algebra over a prime field whether a perfect matching exists.',
      constraints: '2 <= N <= 300 (even), Time Limit: 1.5s',
      sampleInput: '4 4\n0 1\n1 2\n2 3\n3 0',
      sampleOutput: 'YES',
      hints: [
        'Construct the skew-symmetric Tutte matrix T where T[u][v] = r_{uv} and T[v][u] = -r_{uv} mod 10^9+7.',
        'By Schwartz-Zippel, G has a perfect matching iff rank(T) == N with error probability <= N / P.',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;
static const long long MOD = 1000000007LL;
long long modpow(long long a, long long e) {
    long long r = 1;
    while (e) { if (e & 1) r = r * a % MOD; a = a * a % MOD; e >>= 1; }
    return r;
}
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, m; cin >> n >> m;
    mt19937_64 rng(712367123ULL);
    vector<vector<long long>> a(n, vector<long long>(n, 0));
    for (int i = 0; i < m; ++i) {
        int u, v; cin >> u >> v;
        long long r = rng() % (MOD - 1) + 1;
        a[u][v] = r;
        a[v][u] = (MOD - r) % MOD;
    }
    int rank = 0;
    for (int col = 0; col < n; ++col) {
        int piv = -1;
        for (int row = rank; row < n; ++row) if (a[row][col]) { piv = row; break; }
        if (piv == -1) continue;
        swap(a[rank], a[piv]);
        long long inv = modpow(a[rank][col], MOD - 2);
        for (int row = rank + 1; row < n; ++row) if (a[row][col]) {
            long long f = a[row][col] * inv % MOD;
            for (int c = col; c < n; ++c) a[row][c] = (a[row][c] - f * a[rank][c] % MOD + MOD) % MOD;
        }
        rank++;
    }
    cout << (rank == n ? "YES\\n" : "NO\\n");
}`,
        rust: `use std::io::{self, Read};
const MOD: i64 = 1_000_000_007;
fn modpow(mut a: i64, mut e: i64) -> i64 {
    let mut r = 1;
    while e > 0 { if e & 1 == 1 { r = r * a % MOD; } a = a * a % MOD; e >>= 1; }
    r
}
fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace().map(|x| x.parse::<usize>().unwrap());
    let n = it.next().unwrap(); let m = it.next().unwrap();
    let mut seed = 88172645463325252u64;
    let mut a = vec![vec![0i64; n]; n];
    for _ in 0..m {
        let u = it.next().unwrap(); let v = it.next().unwrap();
        seed ^= seed << 13; seed ^= seed >> 7; seed ^= seed << 17;
        let r = (seed % ((MOD - 1) as u64) + 1) as i64;
        a[u][v] = r; a[v][u] = (MOD - r) % MOD;
    }
    let mut rank = 0;
    for col in 0..n {
        if let Some(piv) = (rank..n).find(|&r| a[r][col] != 0) {
            a.swap(rank, piv);
            let inv = modpow(a[rank][col], MOD - 2);
            for row in (rank + 1)..n {
                if a[row][col] != 0 {
                    let f = a[row][col] * inv % MOD;
                    for c in col..n { a[row][c] = (a[row][c] - f * a[rank][c] % MOD + MOD) % MOD; }
                }
            }
            rank += 1;
        }
    }
    println!("{}", if rank == n { "YES" } else { "NO" });
}`,
        java21: `import java.util.*;
public class Main {
    static final long MOD = 1_000_000_007L;
    static long modpow(long a, long e) {
        long r = 1; while (e > 0) { if ((e & 1) == 1) r = r * a % MOD; a = a * a % MOD; e >>= 1; } return r;
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(), m = sc.nextInt();
        long[][] a = new long[n][n];
        Random rng = new Random(42);
        for (int i = 0; i < m; i++) {
            int u = sc.nextInt(), v = sc.nextInt();
            long r = 1 + rng.nextInt(1_000_000_000);
            a[u][v] = r; a[v][u] = (MOD - r) % MOD;
        }
        int rank = 0;
        for (int col = 0; col < n; col++) {
            int piv = -1;
            for (int r = rank; r < n; r++) if (a[r][col] != 0) { piv = r; break; }
            if (piv == -1) continue;
            long[] tmp = a[rank]; a[rank] = a[piv]; a[piv] = tmp;
            long inv = modpow(a[rank][col], MOD - 2);
            for (int r = rank + 1; r < n; r++) if (a[r][col] != 0) {
                long f = a[r][col] * inv % MOD;
                for (int c = col; c < n; c++) a[r][c] = (a[r][c] - f * a[rank][c] % MOD + MOD) % MOD;
            }
            rank++;
        }
        System.out.println(rank == n ? "YES" : "NO");
    }
}`,
        python3: `import random, sys
MOD = 10**9 + 7
data = list(map(int, sys.stdin.buffer.read().split()))
n, m = data[0], data[1]
a = [[0] * n for _ in range(n)]
rng = random.Random(42)
for i in range(2, 2 + 2 * m, 2):
    u, v = data[i], data[i + 1]
    r = rng.randint(1, MOD - 1)
    a[u][v], a[v][u] = r, MOD - r
rank = 0
for col in range(n):
    piv = next((r for r in range(rank, n) if a[r][col]), -1)
    if piv == -1: continue
    a[rank], a[piv] = a[piv], a[rank]
    inv = pow(a[rank][col], MOD - 2, MOD)
    for r in range(rank + 1, n):
        if a[r][col]:
            f = a[r][col] * inv % MOD
            for c in range(col, n):
                a[r][c] = (a[r][c] - f * a[rank][c]) % MOD
    rank += 1
print("YES" if rank == n else "NO")`,
        ruby: `MOD = 1_000_000_007
def modpow(a, e)
  r = 1
  while e > 0
    r = (r * a) % MOD if (e & 1) == 1
    a = (a * a) % MOD
    e >>= 1
  end
  r
end
data = STDIN.read.split.map(&:to_i)
n, m = data[0], data[1]
a = Array.new(n) { Array.new(n, 0) }
rng = Random.new(42)
m.times do |i|
  u, v = data[2 + 2 * i], data[3 + 2 * i]
  r = rng.rand(1...(MOD - 1))
  a[u][v] = r; a[v][u] = MOD - r
end
rank = 0
(0...n).each do |col|
  piv = (rank...n).find { |r| a[r][col] != 0 }
  next unless piv
  a[rank], a[piv] = a[piv], a[rank]
  inv = modpow(a[rank][col], MOD - 2)
  ((rank + 1)...n).each do |r|
    next if a[r][col] == 0
    f = (a[r][col] * inv) % MOD
    (col...n).each { |c| a[r][c] = (a[r][c] - f * a[rank][c]) % MOD }
  end
  rank += 1
end
puts(rank == n ? "YES" : "NO")`,
      },
    },
    {
      id: 'ch08-boss',
      tier: 'Boss',
      ratingRange: '2800–3300+',
      title: 'Maximum General-Graph Degree-2 Packing via Vertex-Split Blossom',
      statement:
        'Each vertex u in an undirected graph has capacity cap[u] in {1, 2}. Choose a subset of edges maximizing total chosen edges such that vertex u is incident to at most cap[u] chosen edges.',
      constraints: '1 <= N <= 250, 0 <= M <= 2000, Time Limit: 2.0s',
      sampleInput: '4 4\n1 2 1 1\n0 1\n1 2\n2 3\n1 3',
      sampleOutput: '3',
      hints: [
        'For each vertex u with cap[u] = 2, split u into two vertices u_a and u_b; for each original edge (u, v), add a 2-edge gadget or split edge e into two endpoints connected by a dummy edge.',
        'More cleanly: replace every edge e=(u,v) with vertices (e_u, e_v) joined together, and connect e_u to all cap[u] copies of u. Max matching size minus M equals maximum edge packing!',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;
// Gadget reduction: each vertex u gets cap[u] copies; each edge e=(u,v) becomes 2 nodes (eu, ev) linked to each other and to all copies of u/v.
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, m; if (!(cin >> n >> m)) return 0;
    vector<int> cap(n);
    int total_v = 0;
    vector<vector<int>> copies(n);
    for (int i = 0; i < n; ++i) {
        cin >> cap[i];
        for (int c = 0; c < cap[i]; ++c) copies[i].push_back(total_v++);
    }
    int edge_base = total_v;
    total_v += 2 * m;
    vector<vector<int>> g(total_v);
    auto add_e = [&](int a, int b) { g[a].push_back(b); g[b].push_back(a); };
    for (int i = 0; i < m; ++i) {
        int u, v; cin >> u >> v;
        int eu = edge_base + 2 * i, ev = edge_base + 2 * i + 1;
        add_e(eu, ev);
        for (int cu : copies[u]) add_e(eu, cu);
        for (int cv : copies[v]) add_e(ev, cv);
    }
    vector<int> match(total_v, -1), p(total_v), base(total_v), used(total_v), bl(total_v);
    auto lca = [&](int a, int b) {
        vector<int> s(total_v, 0);
        while (true) { a = base[a]; s[a] = 1; if (match[a] == -1) break; a = p[match[a]]; }
        while (true) { b = base[b]; if (s[b]) return b; b = p[match[b]]; }
    };
    auto mark = [&](int v, int b, int c) {
        while (base[v] != b) { bl[base[v]] = bl[base[match[v]]] = 1; p[v] = c; c = match[v]; v = p[match[v]]; }
    };
    auto bfs = [&](int r) {
        fill(used.begin(), used.end(), 0); fill(p.begin(), p.end(), -1); iota(base.begin(), base.end(), 0);
        queue<int> q; q.push(r); used[r] = 1;
        while (!q.empty()) {
            int v = q.front(); q.pop();
            for (int to : g[v]) {
                if (base[v] == base[to] || match[v] == to) continue;
                if (to == r || (match[to] != -1 && p[match[to]] != -1)) {
                    int cb = lca(v, to); fill(bl.begin(), bl.end(), 0);
                    mark(v, cb, to); mark(to, cb, v);
                    for (int i = 0; i < total_v; ++i) if (bl[base[i]]) { base[i] = cb; if (!used[i]) { used[i] = 1; q.push(i); } }
                } else if (p[to] == -1) {
                    p[to] = v; if (match[to] == -1) return to;
                    used[match[to]] = 1; q.push(match[to]);
                }
            }
        }
        return -1;
    };
    int ans = 0;
    for (int i = 0; i < total_v; ++i) if (match[i] == -1) {
        int v = bfs(i); if (v != -1) { ++ans; while (v != -1) { int pv = p[v], ppv = match[pv]; match[v] = pv; match[pv] = v; v = ppv; } }
    }
    cout << (ans - m) << '\\n';
}`,
        rust: `use std::collections::VecDeque;
use std::io::{self, Read};

fn edmonds_blossom(n: usize, adj: &[Vec<usize>]) -> usize {
    let mut match_to = vec![-1isize; n];
    let mut p = vec![-1isize; n];
    let mut base: Vec<usize> = (0..n).collect();
    let mut used = vec![false; n];
    let mut blossom = vec![false; n];

    let lca = |mut a: usize, mut b: usize, base: &[usize], match_to: &[isize], p: &[isize]| -> usize {
        let mut seen = vec![false; n];
        loop {
            a = base[a]; seen[a] = true;
            if match_to[a] == -1 { break; }
            a = p[match_to[a] as usize] as usize;
        }
        loop {
            b = base[b];
            if seen[b] { return b; }
            b = p[match_to[b] as usize] as usize;
        }
    };

    let mut ans = 0usize;
    for root in 0..n {
        if match_to[root] != -1 { continue; }
        used.fill(false); p.fill(-1);
        for i in 0..n { base[i] = i; }
        let mut q = VecDeque::from([root]);
        used[root] = true;
        let mut aug = -1isize;
        'bfs: while let Some(v) = q.pop_front() {
            for &to in &adj[v] {
                if base[v] == base[to] || match_to[v] == to as isize { continue; }
                if to == root || (match_to[to] != -1 && p[match_to[to] as usize] != -1) {
                    let cb = lca(v, to, &base, &match_to, &p);
                    blossom.fill(false);
                    for &(start, mut ch) in &[(v, to as isize), (to, v as isize)] {
                        let mut cur = start;
                        while base[cur] != cb {
                            let mc = match_to[cur] as usize;
                            blossom[base[cur]] = true; blossom[base[mc]] = true;
                            p[cur] = ch; ch = mc as isize; cur = p[mc] as usize;
                        }
                    }
                    for i in 0..n {
                        if blossom[base[i]] {
                            base[i] = cb;
                            if !used[i] { used[i] = true; q.push_back(i); }
                        }
                    }
                } else if p[to] == -1 {
                    p[to] = v as isize;
                    if match_to[to] == -1 { aug = to as isize; break 'bfs; }
                    let nxt = match_to[to] as usize;
                    used[nxt] = true; q.push_back(nxt);
                }
            }
        }
        if aug != -1 {
            ans += 1;
            let mut v = aug;
            while v != -1 {
                let pv = p[v as usize];
                let ppv = match_to[pv as usize];
                match_to[v as usize] = pv;
                match_to[pv as usize] = v;
                v = ppv;
            }
        }
    }
    ans
}

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace().map(|x| x.parse::<usize>().unwrap());
    let Some(n) = it.next() else { return; };
    let m = it.next().unwrap();
    let mut total_v = 0usize;
    let mut copies = vec![Vec::new(); n];
    for i in 0..n {
        let cap = it.next().unwrap();
        for _ in 0..cap { copies[i].push(total_v); total_v += 1; }
    }
    let edge_base = total_v;
    total_v += 2 * m;
    let mut adj = vec![Vec::new(); total_v];
    for i in 0..m {
        let u = it.next().unwrap();
        let v = it.next().unwrap();
        let eu = edge_base + 2 * i;
        let ev = edge_base + 2 * i + 1;
        adj[eu].push(ev); adj[ev].push(eu);
        for &cu in &copies[u] { adj[eu].push(cu); adj[cu].push(eu); }
        for &cv in &copies[v] { adj[ev].push(cv); adj[cv].push(ev); }
    }
    println!("{}", edmonds_blossom(total_v, &adj) - m);
}`,
        java21: `import java.io.*;
import java.util.*;

public class Main {
    static int V;
    static List<Integer>[] adj;
    static int[] match, p, base;
    static boolean[] used, blossom;

    static int lca(int a, int b) {
        boolean[] seen = new boolean[V];
        while (true) { a = base[a]; seen[a] = true; if (match[a] == -1) break; a = p[match[a]]; }
        while (true) { b = base[b]; if (seen[b]) return b; b = p[match[b]]; }
    }

    static void markPath(int v, int b, int children) {
        while (base[v] != b) {
            blossom[base[v]] = blossom[base[match[v]]] = true;
            p[v] = children; children = match[v]; v = p[match[v]];
        }
    }

    static int findPath(int root) {
        Arrays.fill(used, false); Arrays.fill(p, -1);
        for (int i = 0; i < V; i++) base[i] = i;
        ArrayDeque<Integer> q = new ArrayDeque<>();
        q.add(root); used[root] = true;
        while (!q.isEmpty()) {
            int v = q.poll();
            for (int to : adj[v]) {
                if (base[v] == base[to] || match[v] == to) continue;
                if (to == root || (match[to] != -1 && p[match[to]] != -1)) {
                    int cb = lca(v, to);
                    Arrays.fill(blossom, false);
                    markPath(v, cb, to); markPath(to, cb, v);
                    for (int i = 0; i < V; i++) if (blossom[base[i]]) {
                        base[i] = cb;
                        if (!used[i]) { used[i] = true; q.add(i); }
                    }
                } else if (p[to] == -1) {
                    p[to] = v;
                    if (match[to] == -1) return to;
                    used[match[to]] = true; q.add(match[to]);
                }
            }
        }
        return -1;
    }

    @SuppressWarnings("unchecked")
    public static void main(String[] args) throws Exception {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt(), m = sc.nextInt();
        List<Integer>[] copies = new ArrayList[n];
        V = 0;
        for (int i = 0; i < n; i++) {
            int cap = sc.nextInt();
            copies[i] = new ArrayList<>();
            for (int c = 0; c < cap; c++) copies[i].add(V++);
        }
        int edgeBase = V;
        V += 2 * m;
        adj = new ArrayList[V];
        for (int i = 0; i < V; i++) adj[i] = new ArrayList<>();
        for (int i = 0; i < m; i++) {
            int u = sc.nextInt(), v = sc.nextInt();
            int eu = edgeBase + 2 * i, ev = edgeBase + 2 * i + 1;
            adj[eu].add(ev); adj[ev].add(eu);
            for (int cu : copies[u]) { adj[eu].add(cu); adj[cu].add(eu); }
            for (int cv : copies[v]) { adj[ev].add(cv); adj[cv].add(ev); }
        }
        match = new int[V]; Arrays.fill(match, -1);
        p = new int[V]; base = new int[V]; used = new boolean[V]; blossom = new boolean[V];
        int ans = 0;
        for (int i = 0; i < V; i++) if (match[i] == -1) {
            int v = findPath(i);
            if (v != -1) {
                ans++;
                while (v != -1) { int pv = p[v], ppv = match[pv]; match[v] = pv; match[pv] = v; v = ppv; }
            }
        }
        System.out.println(ans - m);
    }
}`,
        python3: `from collections import deque
import sys

def edmonds_blossom(n: int, adj: list[list[int]]) -> int:
    match = [-1] * n
    p = [-1] * n
    base = list(range(n))
    used = [False] * n
    blossom = [False] * n

    def lca(a: int, b: int) -> int:
        seen = [False] * n
        while True:
            a = base[a]; seen[a] = True
            if match[a] == -1: break
            a = p[match[a]]
        while True:
            b = base[b]
            if seen[b]: return b
            b = p[match[b]]

    def mark_path(v: int, b: int, children: int):
        while base[v] != b:
            blossom[base[v]] = blossom[base[match[v]]] = True
            p[v] = children; children = match[v]; v = p[match[v]]

    def find_path(root: int) -> int:
        for i in range(n):
            used[i] = False; p[i] = -1; base[i] = i
        q = deque([root]); used[root] = True
        while q:
            v = q.popleft()
            for to in adj[v]:
                if base[v] == base[to] or match[v] == to: continue
                if to == root or (match[to] != -1 and p[match[to]] != -1):
                    cb = lca(v, to)
                    for i in range(n): blossom[i] = False
                    mark_path(v, cb, to); mark_path(to, cb, v)
                    for i in range(n):
                        if blossom[base[i]]:
                            base[i] = cb
                            if not used[i]: used[i] = True; q.append(i)
                elif p[to] == -1:
                    p[to] = v
                    if match[to] == -1: return to
                    nxt = match[to]; used[nxt] = True; q.append(nxt)
        return -1

    ans = 0
    for i in range(n):
        if match[i] == -1:
            v = find_path(i)
            if v != -1:
                ans += 1
                while v != -1:
                    pv = p[v]; ppv = match[pv]
                    match[v] = pv; match[pv] = v; v = ppv
    return ans

def solve():
    data = list(map(int, sys.stdin.buffer.read().split()))
    if not data: return
    it = iter(data)
    n, m = next(it), next(it)
    total_v = 0
    copies = [[] for _ in range(n)]
    for i in range(n):
        cap = next(it)
        for _ in range(cap):
            copies[i].append(total_v)
            total_v += 1
    edge_base = total_v
    total_v += 2 * m
    adj = [[] for _ in range(total_v)]
    for i in range(m):
        u, v = next(it), next(it)
        eu, ev = edge_base + 2 * i, edge_base + 2 * i + 1
        adj[eu].append(ev); adj[ev].append(eu)
        for cu in copies[u]: adj[eu].append(cu); adj[cu].append(eu)
        for cv in copies[v]: adj[ev].append(cv); adj[cv].append(ev)
    print(edmonds_blossom(total_v, adj) - m)

if __name__ == "__main__":
    solve()`,
        ruby: `data = STDIN.read.split.map(&:to_i)
exit if data.empty?
idx = 0
n = data[idx]; m = data[idx + 1]; idx += 2
total_v = 0
copies = Array.new(n) { [] }
n.times do |i|
  cap = data[idx]; idx += 1
  cap.times { copies[i] << total_v; total_v += 1 }
end
edge_base = total_v
total_v += 2 * m
adj = Array.new(total_v) { [] }
m.times do |i|
  u = data[idx]; v = data[idx + 1]; idx += 2
  eu = edge_base + 2 * i; ev = edge_base + 2 * i + 1
  adj[eu] << ev; adj[ev] << eu
  copies[u].each { |cu| adj[eu] << cu; adj[cu] << eu }
  copies[v].each { |cv| adj[ev] << cv; adj[cv] << ev }
end

match = Array.new(total_v, -1); p = Array.new(total_v, -1); base = (0...total_v).to_a
used = Array.new(total_v, false); blossom = Array.new(total_v, false)

lca = lambda do |a, b|
  seen = Array.new(total_v, false)
  loop { a = base[a]; seen[a] = true; break if match[a] == -1; a = p[match[a]] }
  loop { b = base[b]; return b if seen[b]; b = p[match[b]] }
end

mark_path = lambda do |v, b, children|
  while base[v] != b
    blossom[base[v]] = blossom[base[match[v]]] = true
    p[v] = children; children = match[v]; v = p[match[v]]
  end
end

find_path = lambda do |root|
  used.fill(false); p.fill(-1); total_v.times { |i| base[i] = i }
  q = [root]; head = 0; used[root] = true
  while head < q.size
    v = q[head]; head += 1
    adj[v].each do |to|
      next if base[v] == base[to] || match[v] == to
      if to == root || (match[to] != -1 && p[match[to]] != -1)
        cb = lca.call(v, to); blossom.fill(false)
        mark_path.call(v, cb, to); mark_path.call(to, cb, v)
        total_v.times { |i| if blossom[base[i]]; base[i] = cb; unless used[i]; used[i] = true; q << i; end; end }
      elsif p[to] == -1
        p[to] = v; return to if match[to] == -1
        nxt = match[to]; used[nxt] = true; q << nxt
      end
    end
  end
  -1
end

ans = 0
total_v.times do |i|
  next if match[i] != -1
  v = find_path.call(i)
  next if v == -1
  ans += 1
  while v != -1; pv = p[v]; ppv = match[pv]; match[v] = pv; match[pv] = v; v = ppv; end
end
puts ans - m`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'CSES',
      title: 'General Graph Matching (Library Checker / CSES Advanced)',
      difficulty: 'Grandmaster',
      url: 'https://judge.yosupo.jp/problem/general_matching',
      patternNote: 'Standard 500-node Edmonds Blossom benchmark.',
    },
    {
      platform: 'Codeforces',
      title: 'Codeforces 1089B / 1198F / General Matching Tag',
      difficulty: 'CF 2700–3300',
      url: 'https://codeforces.com/problemset?tags=graph+matchings',
      patternNote: 'Non-bipartite matching and Tutte matrix reductions.',
    },
    {
      platform: 'AtCoder',
      title: 'AtCoder AGC / ABC Graph Matching & Odd-Length Paths',
      difficulty: 'AGC 2600+',
      url: 'https://atcoder.jp/search?f.Task=matching',
      patternNote: 'Blossom parity arguments and Tutte-Berge formula bounds.',
    },
    {
      platform: 'CodeChef',
      title: 'SEAGM / General Graph Pairing Variants',
      difficulty: 'Long Challenge Hard',
      url: 'https://www.codechef.com/practice',
      patternNote: 'Game-theory parity reduction onto maximum matching.',
    },
    {
      platform: 'HackerRank',
      title: 'Maximum Matching in Non-Bipartite Graphs',
      difficulty: 'Expert',
      url: 'https://www.hackerrank.com/domains/algorithms?filters%5Bsubdomains%5D%5B%5D=graph-theory',
      patternNote: 'Alternating tree expansion and cycle shrinking.',
    },
    {
      platform: 'NeetCode 150',
      title: 'Graph Valid Tree / Is Graph Bipartite? (Foundation)',
      difficulty: 'Staff / Principal',
      url: 'https://leetcode.com/problemset/?search=Is+Graph+Bipartite',
      patternNote: 'Interviews test bipartite 2-coloring and greedy pairing heuristics rather than full Blossom.',
    },
  ],
  interviewNotes: [
    'In Staff/Principal system design interviews, General Graph Matching arises in ride-share carpooling (matching two riders in a single pool) and peer-to-peer gaming lobbies.',
    'Explain why bipartite matching breaks on odd cycles before proposing either Blossom O(V^3) or randomized greedy / local-search approximations at web scale.',
  ],
  projectBlueprint: {
    title: 'Peer-to-Peer Mentorship & Tournament Pairing Matcher',
    tagline:
      'Production matchmaking service pairing peers across arbitrary compatibility graphs with real-time odd-cycle resolution and audit trails.',
    stackSummary: 'Rust / C++ WebAssembly Solver + TypeScript API + Compatibility Graph Visualizer',
    asciiDiagram: `┌────────────────────────┐     ┌──────────────────────────┐     ┌─────────────────────────┐
│ Peer Profile Pool      │────►│ Compatibility Edge Graph │────►│ Edmonds Blossom Engine  │
│ (timezone, skill, elo) │     │ (non-bipartite constraints)│     │ (max cardinality pairs) │
└────────────────────────┘     └──────────────────────────┘     └────────────┬────────────┘
                                                                             │
                                                                             ▼
                                                                ┌─────────────────────────┐
                                                                │ Confirmed Match Roster  │
                                                                │ & Unpaired Waitlist     │
                                                                └─────────────────────────┘`,
    milestones: [
      {
        id: 'ch08-m1',
        title: 'Milestone 1: Compatibility Matrix & Constraint Graph Builder',
        detail:
          'Convert mutual availability, Elo distance bounds, and blocked-pair rules into a clean 0-indexed undirected adjacency list.',
      },
      {
        id: 'ch08-m2',
        title: 'Milestone 2: Greedy Seed Pass + Blossom Augmentation Core',
        detail:
          'Implement greedy initial pairing followed by LCA odd-cycle contraction to guarantee mathematically optimal match count.',
      },
      {
        id: 'ch08-m3',
        title: 'Milestone 3: Pairing Explanation & Odd-Ring Diagnostics',
        detail:
          'Record which odd cycles were contracted during solving so organizers understand why non-obvious swaps improved total pairs.',
      },
      {
        id: 'ch08-m4',
        title: 'Milestone 4: Priority-Weighted Tie-Breaking',
        detail:
          'Add edge-weight sorting or dual-variable Blossom weights to break ties in favor of closest Elo or longest-waiting participants.',
      },
    ],
    starterCode: `export interface PeerNode {
  id: string;
  elo: number;
  compatibleWith: string[];
}

export function runGreedySeedAndBlossom(peers: PeerNode[]): Array<[string, string]> {
  const n = peers.length;
  const idxMap = new Map(peers.map((p, i) => [p.id, i]));
  const adj: number[][] = Array.from({ length: n }, () => []);

  for (let u = 0; u < n; u++) {
    for (const targetId of peers[u].compatibleWith) {
      const v = idxMap.get(targetId);
      if (v !== undefined && v !== u && !adj[u].includes(v)) {
        adj[u].push(v);
        adj[v].push(u);
      }
    }
  }

  const match = new Array<number>(n).fill(-1);
  const p = new Array<number>(n).fill(-1);
  const base = Array.from({ length: n }, (_, i) => i);
  const used = new Array<boolean>(n).fill(false);
  const blossom = new Array<boolean>(n).fill(false);

  const lca = (a: number, b: number): number => {
    const seen = new Array<boolean>(n).fill(false);
    let x = a;
    while (true) {
      x = base[x];
      seen[x] = true;
      if (match[x] === -1) break;
      x = p[match[x]];
    }
    let y = b;
    while (true) {
      y = base[y];
      if (seen[y]) return y;
      y = p[match[y]];
    }
  };

  const markPath = (v: number, b: number, children: number) => {
    let cur = v;
    let ch = children;
    while (base[cur] !== b) {
      blossom[base[cur]] = true;
      blossom[base[match[cur]]] = true;
      p[cur] = ch;
      ch = match[cur];
      cur = p[match[cur]];
    }
  };

  const findPath = (root: number): number => {
    used.fill(false);
    p.fill(-1);
    for (let i = 0; i < n; i++) base[i] = i;
    const queue: number[] = [root];
    used[root] = true;

    for (let head = 0; head < queue.length; head++) {
      const v = queue[head];
      for (const to of adj[v]) {
        if (base[v] === base[to] || match[v] === to) continue;
        if (to === root || (match[to] !== -1 && p[match[to]] !== -1)) {
          const curBase = lca(v, to);
          blossom.fill(false);
          markPath(v, curBase, to);
          markPath(to, curBase, v);
          for (let i = 0; i < n; i++) {
            if (blossom[base[i]]) {
              base[i] = curBase;
              if (!used[i]) {
                used[i] = true;
                queue.push(i);
              }
            }
          }
        } else if (p[to] === -1) {
          p[to] = v;
          if (match[to] === -1) return to;
          const nxt = match[to];
          used[nxt] = true;
          queue.push(nxt);
        }
      }
    }
    return -1;
  };

  for (let i = 0; i < n; i++) {
    if (match[i] === -1) {
      let v = findPath(i);
      while (v !== -1) {
        const pv = p[v];
        const ppv = match[pv];
        match[v] = pv;
        match[pv] = v;
        v = ppv;
      }
    }
  }

  const pairs: Array<[string, string]> = [];
  for (let i = 0; i < n; i++) {
    if (i < match[i]) pairs.push([peers[i].id, peers[match[i]].id]);
  }
  return pairs;
}`,
  },
};
