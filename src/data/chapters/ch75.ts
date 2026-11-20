import type { TheoryChapter } from '../../types/vault';

export const CH75_CHU_LIU_EDMONDS: TheoryChapter = {
  slug: 'directed-mst-chu-liu-edmonds',
  topicId: 'gr-45',
  title: 'Directed Minimum Spanning Arborescence (Chu-Liu/Edmonds)',
  domain: 'Graph & Tree Theory',
  ratingTier: '2600–3300+',
  usacoDivision: 'Advanced',
  subtitle: 'Cycle contraction, reduced-cost reweighting, O(V E) iterative Edmonds, O(E log V) skew-heap merging with lazy additive tags, and contraction-tree edge reconstruction',
  analogyTitle: 'Paying off Cycle Tolls Until Every Non-Root Has a Zero-Cost Backdoor',
  analogyBody:
    'In an undirected graph, Kruskal greedily picks cheapest edges safely because cycles are symmetric. In a directed graph, every non-root vertex v != R must have in-degree exactly 1—meaning we must pay at least min_in[v] just to enter v.\n\nChu-Liu / Edmonds’ theorem begins by paying min_in[v] upfront for every non-root vertex v != R, picking each vertex’s cheapest incoming edge, and reweighting every incoming edge (u -> v, w) to its reduced cost w\' = w - min_in[v] >= 0. If the chosen incoming edges contain no directed cycles, they already form an optimal spanning arborescence of cost sum(min_in).\n\nIf a directed cycle C forms, ALL cycle edges now have reduced weight 0, meaning entering ANY vertex of C pays the remaining reduced cost w\' while allowing us to open the cycle by deleting the redundant cycle edge entering that same vertex. Contracting C into a supernode and repeating iteratively solves Directed MST in O(V E), while storing incoming edges per component in mergeable Skew Heaps with lazy negative shifts compresses the entire algorithm to O(E log V). For unrooted Directed MST, adding a virtual super-root with edges of weight BIG = sum(max(0, w)) + 1 forces exactly one real root.',
  prerequisites: [
    { slug: 'mst-kruskal-boruvka', title: 'Minimum Spanning Trees (Kruskal, Prim & Boruvka)' },
  ],
  traceTitle: 'Edmonds Cycle Contraction on a 5-Node Graph Rooted at 1',
  traceSubtitle: 'Tracking min incoming edge selection, reduced-cost reweighting, and cycle contraction',
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Step 1: Select Minimum Incoming Edge per Non-Root Vertex',
      explanation: 'From root 1, pick cheapest incoming edge for vertices 2..5: (4->2, 1), (2->3, 2), (3->4, 4), (4->5, 8). Sum = 15. Vertices {2, 3, 4} form a directed cycle of reduced cost 0.',
      mode: 'graph',
      graph: {
        nodes: [
          { id: '1', label: '1 (R)', x: 80, y: 120, state: 'active' },
          { id: '2', label: '2', x: 210, y: 60, state: 'blossom' },
          { id: '3', label: '3', x: 340, y: 60, state: 'blossom' },
          { id: '4', label: '4', x: 275, y: 175, state: 'blossom' },
          { id: '5', label: '5', x: 430, y: 175, state: 'matched' },
        ],
        edges: [
          { id: 'e12', from: '1', to: '2', weight: 5, state: 'default' },
          { id: 'e13', from: '1', to: '3', weight: 10, state: 'default' },
          { id: 'e42', from: '4', to: '2', weight: 1, state: 'blossom-cycle' },
          { id: 'e23', from: '2', to: '3', weight: 2, state: 'blossom-cycle' },
          { id: 'e34', from: '3', to: '4', weight: 4, state: 'blossom-cycle' },
          { id: 'e45', from: '4', to: '5', weight: 8, state: 'matched' },
          { id: 'e35', from: '3', to: '5', weight: 9, state: 'default' },
        ],
        calloutMetric: 'Round 1 Sum = 15 | Cycle {2,3,4}',
      },
      variables: { upfrontSum: 15, cycleDetected: '{2, 3, 4}', minIn: '[R, 1, 2, 4, 8]' },
    },
    {
      stepNumber: 2,
      title: 'Step 2: Shift Incoming Weights & Contract Cycle {2,3,4} -> Supernode C',
      explanation: 'Subtract min_in[v] from all edges into cycle vertices: 1->2 drops from 5 to 4; 1->3 drops from 10 to 8. Contract {2, 3, 4} into supernode C.',
      mode: 'graph',
      graph: {
        nodes: [
          { id: '1', label: '1 (R)', x: 90, y: 120, state: 'active' },
          { id: 'C', label: 'C{2,3,4}', x: 265, y: 120, state: 'matched' },
          { id: '5', label: '5', x: 425, y: 120, state: 'matched' },
        ],
        edges: [
          { id: 'ec1', from: '1', to: 'C', weight: 4, state: 'augmenting' },
          { id: 'ec2', from: '1', to: 'C', weight: 8, state: 'default' },
          { id: 'ec3', from: 'C', to: '5', weight: 0, state: 'matched' },
        ],
        calloutMetric: 'Reduced Cost into C: min(4, 8) = 4',
      },
      variables: { reduced1_to_2: 4, reduced1_to_3: 8, totalCost: '15 + 4 = 19' },
    },
    {
      stepNumber: 3,
      title: 'Step 3: Expand Supernode C -> Break Cycle Edge 4->2',
      explanation: 'Since edge 1->2 enters C at original vertex 2, delete cycle edge 4->2 while keeping 2->3 and 3->4. Final Arborescence: 1->2 (5), 2->3 (2), 3->4 (4), 4->5 (8) with total weight 19.',
      mode: 'graph',
      graph: {
        nodes: [
          { id: '1', label: '1 (R)', x: 80, y: 120, state: 'active' },
          { id: '2', label: '2', x: 210, y: 60, state: 'matched' },
          { id: '3', label: '3', x: 340, y: 60, state: 'matched' },
          { id: '4', label: '4', x: 275, y: 175, state: 'matched' },
          { id: '5', label: '5', x: 430, y: 175, state: 'matched' },
        ],
        edges: [
          { id: 'f12', from: '1', to: '2', weight: 5, state: 'matched' },
          { id: 'f23', from: '2', to: '3', weight: 2, state: 'matched' },
          { id: 'f34', from: '3', to: '4', weight: 4, state: 'matched' },
          { id: 'f45', from: '4', to: '5', weight: 8, state: 'matched' },
        ],
        calloutMetric: 'Optimal Directed MST = 19',
      },
      variables: { totalWeight: 19, brokenEdge: '4 -> 2', finalEdges: '1-2, 2-3, 3-4, 4-5' },
    },
  ],
  reductionClues: [
    {
      clue: 'Minimum-cost directed spanning tree (arborescence) reaching all vertices from a fixed root R',
      translation: 'Direct Chu-Liu / Edmonds algorithm: O(V E) iterative cycle contraction or O(E log V) Skew-Heap + DSU.',
    },
    {
      clue: 'Unrooted minimum directed spanning tree (choose best root)',
      translation: 'Add virtual root S with directed edge S -> v of cost BIG = sum(|w_e|) + 1; optimal arborescence uses two or more root edges iff original graph has no valid spanning arborescence.',
    },
    {
      clue: 'Sparse or large directed graphs with E <= 2 * 10^5 requiring fast cycle merging and edge recovery',
      translation: 'Attach a mergeable Skew Heap with lazy additive tag to each component and walk contraction parent pointers top-down or bottom-up.',
    },
    {
      clue: 'Every non-root node needs in-degree 1 with cycles contracted lazily',
      translation: 'Subtract popped edge weight from merged heap lazy tag whenever contracting a directed cycle.',
    },
  ],
  timeComplexity: 'O(E log V) with Skew Heap + DSU; O(V E) for iterative contraction',
  spaceComplexity: 'O(V + E)',
  pitfalls: [
    {
      type: 'WA',
      title: 'Threshold Mismatch in Virtual Super-Root Rejection Check',
      detail: 'If virtual root S adds edges S -> v of weight BIG = sum(|w|) + 1, a valid single-root arborescence has total <= BIG + sum(pos_w). Reject whenever total > BIG + sum(pos_w), NOT total >= 2 * BIG when negative edges exist!',
    },
    {
      type: 'TLE',
      title: 'Forgetting Lazy Push-Down Before Comparing Skew Heap Children',
      detail: 'Always propagate node.add down to left and right children before merging or inspecting child keys so shifted weights stay consistent across nested contractions.',
    },
    {
      type: 'WA',
      title: 'Leaving Self-Loops Active Inside Skew Heaps After Contraction',
      detail: 'When popping min incoming edge (u -> v) for component c, skip and discard it while find(u) == c before accepting it as an external incoming edge.',
    },
    {
      type: 'RE',
      title: 'Zero-Cost Cycle Infinite Loop Without Proper Seen Tracking',
      detail: 'Mark visited state along the active DSU chain (0 = unvisited, 1 = on stack/path, 2 = done) and mark root R as 2 upfront.',
    },
  ],
  implementations: {
    cpp20: `#include <algorithm>
#include <iostream>
#include <numeric>
#include <vector>

using namespace std;

struct HeapNode {
    int u, v;
    long long w, add;
    int l, r;
};

int push_down(vector<HeapNode>& pool, int h) {
    if (h != -1 && pool[h].add != 0) {
        long long d = pool[h].add;
        if (pool[h].l != -1) {
            pool[pool[h].l].w += d;
            pool[pool[h].l].add += d;
        }
        if (pool[h].r != -1) {
            pool[pool[h].r].w += d;
            pool[pool[h].r].add += d;
        }
        pool[h].add = 0;
    }
    return h;
}

int merge_heap(vector<HeapNode>& pool, int a, int b) {
    if (a == -1) return b;
    if (b == -1) return a;
    if (pool[a].w > pool[b].w) swap(a, b);
    push_down(pool, a);
    pool[a].r = merge_heap(pool, pool[a].r, b);
    swap(pool[a].l, pool[a].r);
    return a;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, m, root;
    if (!(cin >> n >> m >> root)) return 0;
    --root;

    vector<HeapNode> pool;
    pool.reserve(m);
    vector<int> heap(n, -1);
    for (int i = 0; i < m; ++i) {
        int u, v;
        long long w;
        cin >> u >> v >> w;
        --u;
        --v;
        if (u == v || v == root) continue;
        int id = static_cast<int>(pool.size());
        pool.push_back({u, v, w, 0, -1, -1});
        heap[v] = merge_heap(pool, heap[v], id);
    }

    vector<int> parent(n);
    iota(parent.begin(), parent.end(), 0);
    auto find = [&](int x) {
        while (parent[x] != x) {
            parent[x] = parent[parent[x]];
            x = parent[x];
        }
        return x;
    };

    vector<int> vis(n, 0);
    vis[root] = 2;
    long long total = 0;
    for (int i = 0; i < n; ++i) {
        if (vis[find(i)] != 0) continue;
        vector<int> chain;
        vector<long long> edge_w;
        int cur = find(i);
        while (vis[cur] == 0) {
            vis[cur] = 1;
            chain.push_back(cur);
            while (heap[cur] != -1 && find(pool[heap[cur]].u) == cur) {
                push_down(pool, heap[cur]);
                heap[cur] = merge_heap(pool, pool[heap[cur]].l, pool[heap[cur]].r);
            }
            if (heap[cur] == -1) {
                cout << -1 << "\\n";
                return 0;
            }
            int h = heap[cur];
            push_down(pool, h);
            long long w = pool[h].w;
            int u = find(pool[h].u);
            total += w;
            edge_w.push_back(w);
            if (vis[u] == 1) {
                int rep = cur;
                int idx = static_cast<int>(chain.size()) - 1;
                int merged = -1;
                while (true) {
                    int x = chain[idx];
                    long long shift = -edge_w[idx];
                    push_down(pool, heap[x]);
                    int sub_h = merge_heap(pool, pool[heap[x]].l, pool[heap[x]].r);
                    if (sub_h != -1) {
                        pool[sub_h].w += shift;
                        pool[sub_h].add += shift;
                    }
                    merged = merge_heap(pool, merged, sub_h);
                    parent[x] = rep;
                    chain.pop_back();
                    edge_w.pop_back();
                    if (x == u) break;
                    --idx;
                }
                heap[rep] = merged;
                vis[rep] = 0;
                cur = rep;
            } else {
                cur = u;
            }
        }
        for (int x : chain) vis[x] = 2;
    }
    cout << total << "\\n";
    return 0;
}`,
    rust: `use std::io::{self, Read};

#[derive(Clone, Copy)]
struct HeapNode {
    u: usize,
    w: i64,
    add: i64,
    l: isize,
    r: isize,
}

fn push_down(pool: &mut [HeapNode], h: isize) {
    if h != -1 {
        let hi = h as usize;
        let d = pool[hi].add;
        if d != 0 {
            let l = pool[hi].l;
            let r = pool[hi].r;
            if l != -1 {
                pool[l as usize].w += d;
                pool[l as usize].add += d;
            }
            if r != -1 {
                pool[r as usize].w += d;
                pool[r as usize].add += d;
            }
            pool[hi].add = 0;
        }
    }
}

fn merge_heap(pool: &mut [HeapNode], mut a: isize, mut b: isize) -> isize {
    if a == -1 { return b; }
    if b == -1 { return a; }
    if pool[a as usize].w > pool[b as usize].w {
        std::mem::swap(&mut a, &mut b);
    }
    push_down(pool, a);
    let r = pool[a as usize].r;
    let nr = merge_heap(pool, r, b);
    pool[a as usize].r = nr;
    let ai = a as usize;
    let tmp = pool[ai].l;
    pool[ai].l = pool[ai].r;
    pool[ai].r = tmp;
    a
}

fn find(parent: &mut [usize], mut x: usize) -> usize {
    while parent[x] != x {
        parent[x] = parent[parent[x]];
        x = parent[x];
    }
    x
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let n: usize = match it.next() { Some(v) => v.parse().unwrap(), None => return };
    let m: usize = it.next().unwrap().parse().unwrap();
    let root = it.next().unwrap().parse::<usize>().unwrap() - 1;

    let mut pool = Vec::with_capacity(m);
    let mut heap = vec![-1isize; n];
    for _ in 0..m {
        let u = it.next().unwrap().parse::<usize>().unwrap() - 1;
        let v = it.next().unwrap().parse::<usize>().unwrap() - 1;
        let w: i64 = it.next().unwrap().parse().unwrap();
        if u == v || v == root { continue; }
        let id = pool.len() as isize;
        pool.push(HeapNode { u, w, add: 0, l: -1, r: -1 });
        heap[v] = merge_heap(&mut pool, heap[v], id);
    }

    let mut parent: Vec<usize> = (0..n).collect();
    let mut vis = vec![0u8; n];
    vis[root] = 2;
    let mut total = 0i64;
    for i in 0..n {
        if vis[find(&mut parent, i)] != 0 { continue; }
        let mut chain = Vec::new();
        let mut edge_w = Vec::new();
        let mut cur = find(&mut parent, i);
        while vis[cur] == 0 {
            vis[cur] = 1;
            chain.push(cur);
            while heap[cur] != -1 {
                let hi = heap[cur] as usize;
                if find(&mut parent, pool[hi].u) != cur { break; }
                push_down(&mut pool, heap[cur]);
                heap[cur] = merge_heap(&mut pool, pool[hi].l, pool[hi].r);
            }
            if heap[cur] == -1 {
                println!("-1");
                return;
            }
            let h = heap[cur];
            push_down(&mut pool, h);
            let w = pool[h as usize].w;
            let u = find(&mut parent, pool[h as usize].u);
            total += w;
            edge_w.push(w);
            if vis[u] == 1 {
                let rep = cur;
                let mut merged = -1isize;
                loop {
                    let x = chain.pop().unwrap();
                    let ew = edge_w.pop().unwrap();
                    push_down(&mut pool, heap[x]);
                    let hi = heap[x] as usize;
                    let sub_h = merge_heap(&mut pool, pool[hi].l, pool[hi].r);
                    if sub_h != -1 {
                        pool[sub_h as usize].w -= ew;
                        pool[sub_h as usize].add -= ew;
                    }
                    merged = merge_heap(&mut pool, merged, sub_h);
                    parent[x] = rep;
                    if x == u { break; }
                }
                heap[rep] = merged;
                vis[rep] = 0;
                cur = rep;
            } else {
                cur = u;
            }
        }
        for x in chain { vis[x] = 2; }
    }
    println!("{}", total);
}`,
    java21: `import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;

public class Main {
    static class FastScanner {
        private final InputStream in = System.in;
        private final byte[] buffer = new byte[1 << 16];
        private int ptr = 0, len = 0;

        private int readByte() throws IOException {
            if (ptr >= len) {
                len = in.read(buffer);
                ptr = 0;
                if (len <= 0) return -1;
            }
            return buffer[ptr++];
        }

        long nextLong() throws IOException {
            int c;
            do {
                c = readByte();
                if (c == -1) return Long.MIN_VALUE;
            } while (c <= ' ');
            long sign = 1;
            if (c == '-') { sign = -1; c = readByte(); }
            long val = 0;
            while (c > ' ') { val = val * 10 + (c - '0'); c = readByte(); }
            return val * sign;
        }
    }

    static int[] hu, hl, hr;
    static long[] hw, hadd;

    static void pushDown(int h) {
        if (h != -1 && hadd[h] != 0) {
            long d = hadd[h];
            if (hl[h] != -1) { hw[hl[h]] += d; hadd[hl[h]] += d; }
            if (hr[h] != -1) { hw[hr[h]] += d; hadd[hr[h]] += d; }
            hadd[h] = 0;
        }
    }

    static int mergeHeap(int a, int b) {
        if (a == -1) return b;
        if (b == -1) return a;
        if (hw[a] > hw[b]) { int t = a; a = b; b = t; }
        pushDown(a);
        hr[a] = mergeHeap(hr[a], b);
        int t = hl[a]; hl[a] = hr[a]; hr[a] = t;
        return a;
    }

    static int find(int[] p, int x) {
        while (p[x] != x) { p[x] = p[p[x]]; x = p[x]; }
        return x;
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        long nVal = fs.nextLong();
        if (nVal == Long.MIN_VALUE) return;
        int n = (int) nVal, m = (int) fs.nextLong(), root = (int) fs.nextLong() - 1;
        hu = new int[m]; hl = new int[m]; hr = new int[m];
        hw = new long[m]; hadd = new long[m];
        int[] heap = new int[n];
        Arrays.fill(heap, -1);
        int sz = 0;
        for (int i = 0; i < m; i++) {
            int u = (int) fs.nextLong() - 1, v = (int) fs.nextLong() - 1;
            long w = fs.nextLong();
            if (u == v || v == root) continue;
            hu[sz] = u; hw[sz] = w; hadd[sz] = 0; hl[sz] = -1; hr[sz] = -1;
            heap[v] = mergeHeap(heap[v], sz);
            sz++;
        }

        int[] parent = new int[n], vis = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;
        vis[root] = 2;
        int[] chain = new int[n + 5];
        long[] edgeW = new long[n + 5];
        long total = 0;

        for (int i = 0; i < n; i++) {
            if (vis[find(parent, i)] != 0) continue;
            int top = 0, cur = find(parent, i);
            while (vis[cur] == 0) {
                vis[cur] = 1;
                chain[top] = cur;
                while (heap[cur] != -1 && find(parent, hu[heap[cur]]) == cur) {
                    pushDown(heap[cur]);
                    heap[cur] = mergeHeap(hl[heap[cur]], hr[heap[cur]]);
                }
                if (heap[cur] == -1) { System.out.println(-1); return; }
                int h = heap[cur];
                pushDown(h);
                long w = hw[h];
                int u = find(parent, hu[h]);
                total += w;
                edgeW[top++] = w;
                if (vis[u] == 1) {
                    int rep = cur, merged = -1;
                    while (true) {
                        int x = chain[--top];
                        long ew = edgeW[top];
                        pushDown(heap[x]);
                        int subH = mergeHeap(hl[heap[x]], hr[heap[x]]);
                        if (subH != -1) { hw[subH] -= ew; hadd[subH] -= ew; }
                        merged = mergeHeap(merged, subH);
                        parent[x] = rep;
                        if (x == u) break;
                    }
                    heap[rep] = merged;
                    vis[rep] = 0;
                    cur = rep;
                } else {
                    cur = u;
                }
            }
            for (int k = 0; k < top; k++) vis[chain[k]] = 2;
        }
        System.out.println(total);
    }
}`,
    python3: `import sys

sys.setrecursionlimit(200000)


def main() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    m = int(data[1])
    root = int(data[2]) - 1
    hu: list[int] = []
    hw: list[int] = []
    hadd: list[int] = []
    hl: list[int] = []
    hr: list[int] = []

    def push_down(h: int) -> None:
        if h != -1 and hadd[h] != 0:
            d = hadd[h]
            l, r = hl[h], hr[h]
            if l != -1:
                hw[l] += d
                hadd[l] += d
            if r != -1:
                hw[r] += d
                hadd[r] += d
            hadd[h] = 0

    def merge_heap(a: int, b: int) -> int:
        if a == -1:
            return b
        if b == -1:
            return a
        if hw[a] > hw[b]:
            a, b = b, a
        push_down(a)
        hr[a] = merge_heap(hr[a], b)
        hl[a], hr[a] = hr[a], hl[a]
        return a

    heap = [-1] * n
    idx = 3
    for _ in range(m):
        u = int(data[idx]) - 1
        v = int(data[idx + 1]) - 1
        w = int(data[idx + 2])
        idx += 3
        if u == v or v == root:
            continue
        eid = len(hu)
        hu.append(u)
        hw.append(w)
        hadd.append(0)
        hl.append(-1)
        hr.append(-1)
        heap[v] = merge_heap(heap[v], eid)

    parent = list(range(n))

    def find(x: int) -> int:
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    vis = [0] * n
    vis[root] = 2
    total = 0
    for i in range(n):
        if vis[find(i)] != 0:
            continue
        chain = []
        edge_w = []
        cur = find(i)
        while vis[cur] == 0:
            vis[cur] = 1
            chain.append(cur)
            while heap[cur] != -1 and find(hu[heap[cur]]) == cur:
                push_down(heap[cur])
                heap[cur] = merge_heap(hl[heap[cur]], hr[heap[cur]])
            if heap[cur] == -1:
                print(-1)
                return
            h = heap[cur]
            push_down(h)
            w = hw[h]
            u = find(hu[h])
            total += w
            edge_w.append(w)
            if vis[u] == 1:
                rep = cur
                merged = -1
                while True:
                    x = chain.pop()
                    ew = edge_w.pop()
                    push_down(heap[x])
                    sub_h = merge_heap(hl[heap[x]], hr[heap[x]])
                    if sub_h != -1:
                        hw[sub_h] -= ew
                        hadd[sub_h] -= ew
                    merged = merge_heap(merged, sub_h)
                    parent[x] = rep
                    if x == u:
                        break
                heap[rep] = merged
                vis[rep] = 0
                cur = rep
            else:
                cur = u
        for x in chain:
            vis[x] = 2
    print(total)


if __name__ == "__main__":
    main()`,
    ruby: `tokens = STDIN.read.split
return if tokens.empty?
n = tokens[0].to_i
m = tokens[1].to_i
root = tokens[2].to_i - 1

hu = []
hw = []
hadd = []
hl = []
hr = []

push_down = lambda do |h|
  if h != -1 && hadd[h] != 0
    d = hadd[h]
    l = hl[h]
    r = hr[h]
    if l != -1
      hw[l] += d
      hadd[l] += d
    end
    if r != -1
      hw[r] += d
      hadd[r] += d
    end
    hadd[h] = 0
  end
end

merge_heap = nil
merge_heap = lambda do |a, b|
  return b if a == -1
  return a if b == -1
  a, b = b, a if hw[a] > hw[b]
  push_down.call(a)
  hr[a] = merge_heap.call(hr[a], b)
  hl[a], hr[a] = hr[a], hl[a]
  a
end

heap = Array.new(n, -1)
idx = 3
m.times do
  u = tokens[idx].to_i - 1
  v = tokens[idx + 1].to_i - 1
  w = tokens[idx + 2].to_i
  idx += 3
  next if u == v || v == root
  eid = hu.length
  hu << u
  hw << w
  hadd << 0
  hl << -1
  hr << -1
  heap[v] = merge_heap.call(heap[v], eid)
end

parent = (0...n).to_a
find = lambda do |x|
  while parent[x] != x
    parent[x] = parent[parent[x]]
    x = parent[x]
  end
  x
end

vis = Array.new(n, 0)
vis[root] = 2
total = 0
(0...n).each do |i|
  next if vis[find.call(i)] != 0
  chain = []
  edge_w = []
  cur = find.call(i)
  while vis[cur] == 0
    vis[cur] = 1
    chain << cur
    while heap[cur] != -1 && find.call(hu[heap[cur]]) == cur
      push_down.call(heap[cur])
      heap[cur] = merge_heap.call(hl[heap[cur]], hr[heap[cur]])
    end
    if heap[cur] == -1
      puts(-1)
      exit 0
    end
    h = heap[cur]
    push_down.call(h)
    w = hw[h]
    u = find.call(hu[h])
    total += w
    edge_w << w
    if vis[u] == 1
      rep = cur
      merged = -1
      loop do
        x = chain.pop
        ew = edge_w.pop
        push_down.call(heap[x])
        sub_h = merge_heap.call(hl[heap[x]], hr[heap[x]])
        if sub_h != -1
          hw[sub_h] -= ew
          hadd[sub_h] -= ew
        end
        merged = merge_heap.call(merged, sub_h)
        parent[x] = rep
        break if x == u
      end
      heap[rep] = merged
      vis[rep] = 0
      cur = rep
    else
      cur = u
    end
  end
  chain.each { |x| vis[x] = 2 }
end
puts total`,
  },
  practiceProblems: [
    {
      id: 'ch75-p1',
      tier: 'Warmup',
      ratingRange: '2500–2800',
      title: 'Minimum Directed Spanning Arborescence via Iterative Edmonds O(V E)',
      statement:
        'Given a weighted directed graph with N vertices (1 <= N <= 1000), M directed edges (u -> v, w), and a fixed root R (1 <= R <= N), compute the minimum total weight of a directed spanning arborescence rooted at R, or -1 if some vertex is unreachable from R.',
      constraints: '1 <= N <= 1000, 0 <= M <= 10^4, -10^9 <= w <= 10^9',
      sampleInput: `5 7 1\n1 2 5\n1 3 10\n4 2 1\n2 3 2\n3 4 4\n4 5 8\n3 5 9`,
      sampleOutput: `19`,
      hints: [
        'In each round, pick the minimum incoming edge in_w[v], pre[v] for every v != root. If any v != root has no incoming edge, return -1.',
        'Trace backward along pre[] to label directed cycles; if none exist, return total + sum(in_w). Otherwise contract cycles into supernodes, shift edge weights by -in_w[v], and repeat.',
      ],
      solutions: {
        cpp20: `#include <algorithm>
#include <iostream>
#include <limits>
#include <vector>

using namespace std;

struct Edge {
    int u, v;
    long long w;
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, m, root;
    if (!(cin >> n >> m >> root)) return 0;
    --root;
    vector<Edge> edges(m);
    for (int i = 0; i < m; ++i) {
        cin >> edges[i].u >> edges[i].v >> edges[i].w;
        --edges[i].u;
        --edges[i].v;
    }

    const long long INF = numeric_limits<long long>::max() / 4;
    long long ans = 0;
    int cur_n = n;
    int cur_root = root;

    while (true) {
        vector<long long> in_w(cur_n, INF);
        vector<int> pre(cur_n, -1);
        for (const auto& e : edges) {
            if (e.u != e.v && e.w < in_w[e.v]) {
                in_w[e.v] = e.w;
                pre[e.v] = e.u;
            }
        }
        in_w[cur_root] = 0;
        pre[cur_root] = cur_root;
        for (int i = 0; i < cur_n; ++i) {
            if (i != cur_root && pre[i] == -1) {
                cout << -1 << "\\n";
                return 0;
            }
        }

        int cnt_comp = 0;
        vector<int> id(cur_n, -1), vis(cur_n, -1);
        for (int i = 0; i < cur_n; ++i) {
            ans += in_w[i];
            int v = i;
            while (vis[v] != i && id[v] == -1 && v != cur_root) {
                vis[v] = i;
                v = pre[v];
            }
            if (v != cur_root && id[v] == -1) {
                for (int u = pre[v]; u != v; u = pre[u]) id[u] = cnt_comp;
                id[v] = cnt_comp++;
            }
        }
        if (cnt_comp == 0) break;
        for (int i = 0; i < cur_n; ++i) {
            if (id[i] == -1) id[i] = cnt_comp++;
        }
        for (auto& e : edges) {
            int old_v = e.v;
            e.u = id[e.u];
            e.v = id[e.v];
            if (e.u != e.v) e.w -= in_w[old_v];
        }
        cur_n = cnt_comp;
        cur_root = id[cur_root];
    }

    cout << ans << "\\n";
    return 0;
}`,
        rust: `use std::io::{self, Read};

#[derive(Clone, Copy)]
struct Edge {
    u: usize,
    v: usize,
    w: i64,
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let mut cur_n: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };
    let m: usize = it.next().unwrap().parse().unwrap();
    let mut cur_root = it.next().unwrap().parse::<usize>().unwrap() - 1;
    let mut edges = Vec::with_capacity(m);
    for _ in 0..m {
        let u = it.next().unwrap().parse::<usize>().unwrap() - 1;
        let v = it.next().unwrap().parse::<usize>().unwrap() - 1;
        let w: i64 = it.next().unwrap().parse().unwrap();
        edges.push(Edge { u, v, w });
    }

    const INF: i64 = i64::MAX / 4;
    let mut ans = 0i64;
    loop {
        let mut in_w = vec![INF; cur_n];
        let mut pre = vec![usize::MAX; cur_n];
        for &e in &edges {
            if e.u != e.v && e.w < in_w[e.v] {
                in_w[e.v] = e.w;
                pre[e.v] = e.u;
            }
        }
        in_w[cur_root] = 0;
        pre[cur_root] = cur_root;
        for i in 0..cur_n {
            if i != cur_root && pre[i] == usize::MAX {
                println!("-1");
                return;
            }
        }
        let mut cnt_comp = 0usize;
        let mut id = vec![usize::MAX; cur_n];
        let mut vis = vec![usize::MAX; cur_n];
        for i in 0..cur_n {
            ans += in_w[i];
            let mut v = i;
            while vis[v] != i && id[v] == usize::MAX && v != cur_root {
                vis[v] = i;
                v = pre[v];
            }
            if v != cur_root && id[v] == usize::MAX {
                let mut u = pre[v];
                while u != v {
                    id[u] = cnt_comp;
                    u = pre[u];
                }
                id[v] = cnt_comp;
                cnt_comp += 1;
            }
        }
        if cnt_comp == 0 {
            break;
        }
        for i in 0..cur_n {
            if id[i] == usize::MAX {
                id[i] = cnt_comp;
                cnt_comp += 1;
            }
        }
        for e in &mut edges {
            let old_v = e.v;
            e.u = id[e.u];
            e.v = id[e.v];
            if e.u != e.v {
                e.w -= in_w[old_v];
            }
        }
        cur_n = cnt_comp;
        cur_root = id[cur_root];
    }
    println!("{}", ans);
}`,
        java21: `import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;

public class Main {
    static class FastScanner {
        private final InputStream in = System.in;
        private final byte[] buffer = new byte[1 << 16];
        private int ptr = 0, len = 0;

        private int readByte() throws IOException {
            if (ptr >= len) {
                len = in.read(buffer);
                ptr = 0;
                if (len <= 0) return -1;
            }
            return buffer[ptr++];
        }

        long nextLong() throws IOException {
            int c;
            do {
                c = readByte();
                if (c == -1) return Long.MIN_VALUE;
            } while (c <= ' ');
            long sign = 1;
            if (c == '-') { sign = -1; c = readByte(); }
            long val = 0;
            while (c > ' ') { val = val * 10 + (c - '0'); c = readByte(); }
            return val * sign;
        }
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        long nVal = fs.nextLong();
        if (nVal == Long.MIN_VALUE) return;
        int curN = (int) nVal, m = (int) fs.nextLong(), curRoot = (int) fs.nextLong() - 1;
        int[] eu = new int[m], ev = new int[m];
        long[] ew = new long[m];
        for (int i = 0; i < m; i++) {
            eu[i] = (int) fs.nextLong() - 1;
            ev[i] = (int) fs.nextLong() - 1;
            ew[i] = fs.nextLong();
        }
        final long INF = Long.MAX_VALUE / 4;
        long ans = 0;
        while (true) {
            long[] inW = new long[curN];
            int[] pre = new int[curN];
            Arrays.fill(inW, INF);
            Arrays.fill(pre, -1);
            for (int i = 0; i < m; i++) {
                if (eu[i] != ev[i] && ew[i] < inW[ev[i]]) {
                    inW[ev[i]] = ew[i];
                    pre[ev[i]] = eu[i];
                }
            }
            inW[curRoot] = 0;
            pre[curRoot] = curRoot;
            for (int i = 0; i < curN; i++) {
                if (i != curRoot && pre[i] == -1) {
                    System.out.println(-1);
                    return;
                }
            }
            int cnt = 0;
            int[] id = new int[curN], vis = new int[curN];
            Arrays.fill(id, -1);
            Arrays.fill(vis, -1);
            for (int i = 0; i < curN; i++) {
                ans += inW[i];
                int v = i;
                while (vis[v] != i && id[v] == -1 && v != curRoot) {
                    vis[v] = i;
                    v = pre[v];
                }
                if (v != curRoot && id[v] == -1) {
                    for (int u = pre[v]; u != v; u = pre[u]) id[u] = cnt;
                    id[v] = cnt++;
                }
            }
            if (cnt == 0) break;
            for (int i = 0; i < curN; i++) if (id[i] == -1) id[i] = cnt++;
            for (int i = 0; i < m; i++) {
                int oldV = ev[i];
                eu[i] = id[eu[i]];
                ev[i] = id[ev[i]];
                if (eu[i] != ev[i]) ew[i] -= inW[oldV];
            }
            curN = cnt;
            curRoot = id[curRoot];
        }
        System.out.println(ans);
    }
}`,
        python3: `import sys

sys.setrecursionlimit(200000)


def main() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    cur_n = int(data[0])
    m = int(data[1])
    cur_root = int(data[2]) - 1
    edges = []
    idx = 3
    for _ in range(m):
        edges.append([int(data[idx]) - 1, int(data[idx + 1]) - 1, int(data[idx + 2])])
        idx += 3

    inf = 10**30
    ans = 0
    while True:
        in_w = [inf] * cur_n
        pre = [-1] * cur_n
        for u, v, w in edges:
            if u != v and w < in_w[v]:
                in_w[v] = w
                pre[v] = u
        in_w[cur_root] = 0
        pre[cur_root] = cur_root
        for i in range(cur_n):
            if i != cur_root and pre[i] == -1:
                print(-1)
                return

        cnt = 0
        cid = [-1] * cur_n
        vis = [-1] * cur_n
        for i in range(cur_n):
            ans += in_w[i]
            v = i
            while vis[v] != i and cid[v] == -1 and v != cur_root:
                vis[v] = i
                v = pre[v]
            if v != cur_root and cid[v] == -1:
                u = pre[v]
                while u != v:
                    cid[u] = cnt
                    u = pre[u]
                cid[v] = cnt
                cnt += 1
        if cnt == 0:
            break
        for i in range(cur_n):
            if cid[i] == -1:
                cid[i] = cnt
                cnt += 1
        for e in edges:
            old_v = e[1]
            e[0] = cid[e[0]]
            e[1] = cid[e[1]]
            if e[0] != e[1]:
                e[2] -= in_w[old_v]
        cur_n = cnt
        cur_root = cid[cur_root]
    print(ans)


if __name__ == "__main__":
    main()`,
        ruby: `tokens = STDIN.read.split
return if tokens.empty?
cur_n = tokens[0].to_i
m = tokens[1].to_i
cur_root = tokens[2].to_i - 1
edges = Array.new(m) { |i| [tokens[3 + 3 * i].to_i - 1, tokens[4 + 3 * i].to_i - 1, tokens[5 + 3 * i].to_i] }

inf = 10**30
ans = 0
loop do
  in_w = Array.new(cur_n, inf)
  pre = Array.new(cur_n, -1)
  edges.each do |u, v, w|
    if u != v && w < in_w[v]
      in_w[v] = w
      pre[v] = u
    end
  end
  in_w[cur_root] = 0
  pre[cur_root] = cur_root
  (0...cur_n).each do |i|
    if i != cur_root && pre[i] == -1
      puts(-1)
      exit 0
    end
  end

  cnt = 0
  cid = Array.new(cur_n, -1)
  vis = Array.new(cur_n, -1)
  (0...cur_n).each do |i|
    ans += in_w[i]
    v = i
    while vis[v] != i && cid[v] == -1 && v != cur_root
      vis[v] = i
      v = pre[v]
    end
    if v != cur_root && cid[v] == -1
      u = pre[v]
      while u != v
        cid[u] = cnt
        u = pre[u]
      end
      cid[v] = cnt
      cnt += 1
    end
  end
  break if cnt == 0
  (0...cur_n).each do |i|
    if cid[i] == -1
      cid[i] = cnt
      cnt += 1
    end
  end
  edges.each do |e|
    old_v = e[1]
    e[0] = cid[e[0]]
    e[1] = cid[e[1]]
    e[2] -= in_w[old_v] if e[0] != e[1]
  end
  cur_n = cnt
  cur_root = cid[cur_root]
end
puts ans`,
      },
    },
    {
      id: 'ch75-p2',
      tier: 'Standard',
      ratingRange: '2700–3000',
      title: 'Sparse Directed MST in O(E log V) via Skew-Heap Contraction',
      statement:
        'Given a large sparse directed graph with N vertices (1 <= N <= 2 * 10^5), M directed edges (u -> v, w), and fixed root R (1 <= R <= N), find the minimum weight of a spanning arborescence rooted at R in O(E log V) time using mergeable Skew Heaps with lazy additive shifts and DSU.',
      constraints: '1 <= N <= 2 * 10^5, 0 <= M <= 2 * 10^5, -10^9 <= w <= 10^9',
      sampleInput: `6 9 1\n1 2 10\n1 4 10\n2 3 1\n3 2 2\n4 5 1\n5 4 2\n3 4 3\n5 6 4\n6 3 1`,
      sampleOutput: `18`,
      hints: [
        'Each component maintains a min-skew-heap of incoming edges storing (u, w) with a lazy additive delta field.',
        'When tracing backward along the chain finds a cycle back into vis[u] == 1, subtract each cycle vertex’s chosen incoming edge weight from its heap’s lazy tag before merging all cycle heaps under DSU.',
      ],
      solutions: {
        cpp20: `#include <algorithm>
#include <iostream>
#include <numeric>
#include <vector>

using namespace std;

struct HeapNode {
    int u, l, r;
    long long w, add;
};

void push_down(vector<HeapNode>& pool, int h) {
    if (h != -1 && pool[h].add != 0) {
        long long d = pool[h].add;
        if (pool[h].l != -1) { pool[pool[h].l].w += d; pool[pool[h].l].add += d; }
        if (pool[h].r != -1) { pool[pool[h].r].w += d; pool[pool[h].r].add += d; }
        pool[h].add = 0;
    }
}

int merge_heap(vector<HeapNode>& pool, int a, int b) {
    if (a == -1) return b;
    if (b == -1) return a;
    if (pool[a].w > pool[b].w) swap(a, b);
    push_down(pool, a);
    pool[a].r = merge_heap(pool, pool[a].r, b);
    swap(pool[a].l, pool[a].r);
    return a;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, m, root;
    if (!(cin >> n >> m >> root)) return 0;
    --root;
    vector<HeapNode> pool;
    pool.reserve(m);
    vector<int> heap(n, -1);
    for (int i = 0; i < m; ++i) {
        int u, v;
        long long w;
        cin >> u >> v >> w;
        --u;
        --v;
        if (u == v || v == root) continue;
        int id = static_cast<int>(pool.size());
        pool.push_back({u, -1, -1, w, 0});
        heap[v] = merge_heap(pool, heap[v], id);
    }

    vector<int> parent(n), vis(n, 0);
    iota(parent.begin(), parent.end(), 0);
    auto find = [&](int x) {
        while (parent[x] != x) {
            parent[x] = parent[parent[x]];
            x = parent[x];
        }
        return x;
    };

    vis[root] = 2;
    long long total = 0;
    for (int i = 0; i < n; ++i) {
        if (vis[find(i)] != 0) continue;
        vector<int> chain;
        vector<long long> edge_w;
        int cur = find(i);
        while (vis[cur] == 0) {
            vis[cur] = 1;
            chain.push_back(cur);
            while (heap[cur] != -1 && find(pool[heap[cur]].u) == cur) {
                push_down(pool, heap[cur]);
                heap[cur] = merge_heap(pool, pool[heap[cur]].l, pool[heap[cur]].r);
            }
            if (heap[cur] == -1) { cout << -1 << "\\n"; return 0; }
            int h = heap[cur];
            push_down(pool, h);
            long long w = pool[h].w;
            int u = find(pool[h].u);
            total += w;
            edge_w.push_back(w);
            if (vis[u] == 1) {
                int rep = cur, merged = -1;
                while (true) {
                    int x = chain.back();
                    long long ew = edge_w.back();
                    chain.pop_back();
                    edge_w.pop_back();
                    push_down(pool, heap[x]);
                    int sub_h = merge_heap(pool, pool[heap[x]].l, pool[heap[x]].r);
                    if (sub_h != -1) { pool[sub_h].w -= ew; pool[sub_h].add -= ew; }
                    merged = merge_heap(pool, merged, sub_h);
                    parent[x] = rep;
                    if (x == u) break;
                }
                heap[rep] = merged;
                vis[rep] = 0;
                cur = rep;
            } else {
                cur = u;
            }
        }
        for (int x : chain) vis[x] = 2;
    }
    cout << total << "\\n";
    return 0;
}`,
        rust: `use std::io::{self, Read};

#[derive(Clone, Copy)]
struct HeapNode { u: usize, l: isize, r: isize, w: i64, add: i64 }

fn push_down(pool: &mut [HeapNode], h: isize) {
    if h != -1 {
        let hi = h as usize;
        let d = pool[hi].add;
        if d != 0 {
            let (l, r) = (pool[hi].l, pool[hi].r);
            if l != -1 { pool[l as usize].w += d; pool[l as usize].add += d; }
            if r != -1 { pool[r as usize].w += d; pool[r as usize].add += d; }
            pool[hi].add = 0;
        }
    }
}

fn merge_heap(pool: &mut [HeapNode], mut a: isize, mut b: isize) -> isize {
    if a == -1 { return b; }
    if b == -1 { return a; }
    if pool[a as usize].w > pool[b as usize].w { std::mem::swap(&mut a, &mut b); }
    push_down(pool, a);
    let nr = merge_heap(pool, pool[a as usize].r, b);
    let ai = a as usize;
    pool[ai].r = pool[ai].l;
    pool[ai].l = nr;
    a
}

fn find(parent: &mut [usize], mut x: usize) -> usize {
    while parent[x] != x { parent[x] = parent[parent[x]]; x = parent[x]; }
    x
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let n: usize = match it.next() { Some(v) => v.parse().unwrap(), None => return };
    let m: usize = it.next().unwrap().parse().unwrap();
    let root = it.next().unwrap().parse::<usize>().unwrap() - 1;
    let mut pool = Vec::with_capacity(m);
    let mut heap = vec![-1isize; n];
    for _ in 0..m {
        let u = it.next().unwrap().parse::<usize>().unwrap() - 1;
        let v = it.next().unwrap().parse::<usize>().unwrap() - 1;
        let w: i64 = it.next().unwrap().parse().unwrap();
        if u == v || v == root { continue; }
        let id = pool.len() as isize;
        pool.push(HeapNode { u, l: -1, r: -1, w, add: 0 });
        heap[v] = merge_heap(&mut pool, heap[v], id);
    }

    let mut parent: Vec<usize> = (0..n).collect();
    let mut vis = vec![0u8; n];
    vis[root] = 2;
    let mut total = 0i64;
    for i in 0..n {
        if vis[find(&mut parent, i)] != 0 { continue; }
        let (mut chain, mut edge_w) = (Vec::new(), Vec::new());
        let mut cur = find(&mut parent, i);
        while vis[cur] == 0 {
            vis[cur] = 1;
            chain.push(cur);
            while heap[cur] != -1 && find(&mut parent, pool[heap[cur] as usize].u) == cur {
                push_down(&mut pool, heap[cur]);
                let hi = heap[cur] as usize;
                heap[cur] = merge_heap(&mut pool, pool[hi].l, pool[hi].r);
            }
            if heap[cur] == -1 { println!("-1"); return; }
            let h = heap[cur];
            push_down(&mut pool, h);
            let w = pool[h as usize].w;
            let u = find(&mut parent, pool[h as usize].u);
            total += w;
            edge_w.push(w);
            if vis[u] == 1 {
                let rep = cur;
                let mut merged = -1isize;
                loop {
                    let x = chain.pop().unwrap();
                    let ew = edge_w.pop().unwrap();
                    push_down(&mut pool, heap[x]);
                    let hi = heap[x] as usize;
                    let sub_h = merge_heap(&mut pool, pool[hi].l, pool[hi].r);
                    if sub_h != -1 {
                        pool[sub_h as usize].w -= ew;
                        pool[sub_h as usize].add -= ew;
                    }
                    merged = merge_heap(&mut pool, merged, sub_h);
                    parent[x] = rep;
                    if x == u { break; }
                }
                heap[rep] = merged;
                vis[rep] = 0;
                cur = rep;
            } else {
                cur = u;
            }
        }
        for x in chain { vis[x] = 2; }
    }
    println!("{}", total);
}`,
        java21: `import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;

public class Main {
    static class FastScanner {
        private final InputStream in = System.in;
        private final byte[] buffer = new byte[1 << 16];
        private int ptr = 0, len = 0;

        private int readByte() throws IOException {
            if (ptr >= len) {
                len = in.read(buffer);
                ptr = 0;
                if (len <= 0) return -1;
            }
            return buffer[ptr++];
        }

        long nextLong() throws IOException {
            int c;
            do {
                c = readByte();
                if (c == -1) return Long.MIN_VALUE;
            } while (c <= ' ');
            long sign = 1;
            if (c == '-') { sign = -1; c = readByte(); }
            long val = 0;
            while (c > ' ') { val = val * 10 + (c - '0'); c = readByte(); }
            return val * sign;
        }
    }

    static int[] hu, hl, hr;
    static long[] hw, hadd;

    static void pushDown(int h) {
        if (h != -1 && hadd[h] != 0) {
            long d = hadd[h];
            if (hl[h] != -1) { hw[hl[h]] += d; hadd[hl[h]] += d; }
            if (hr[h] != -1) { hw[hr[h]] += d; hadd[hr[h]] += d; }
            hadd[h] = 0;
        }
    }

    static int mergeHeap(int a, int b) {
        if (a == -1) return b;
        if (b == -1) return a;
        if (hw[a] > hw[b]) { int t = a; a = b; b = t; }
        pushDown(a);
        hr[a] = mergeHeap(hr[a], b);
        int t = hl[a]; hl[a] = hr[a]; hr[a] = t;
        return a;
    }

    static int find(int[] p, int x) {
        while (p[x] != x) { p[x] = p[p[x]]; x = p[x]; }
        return x;
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        long nVal = fs.nextLong();
        if (nVal == Long.MIN_VALUE) return;
        int n = (int) nVal, m = (int) fs.nextLong(), root = (int) fs.nextLong() - 1;
        hu = new int[m]; hl = new int[m]; hr = new int[m];
        hw = new long[m]; hadd = new long[m];
        int[] heap = new int[n];
        Arrays.fill(heap, -1);
        int sz = 0;
        for (int i = 0; i < m; i++) {
            int u = (int) fs.nextLong() - 1, v = (int) fs.nextLong() - 1;
            long w = fs.nextLong();
            if (u == v || v == root) continue;
            hu[sz] = u; hw[sz] = w; hadd[sz] = 0; hl[sz] = -1; hr[sz] = -1;
            heap[v] = mergeHeap(heap[v], sz);
            sz++;
        }

        int[] parent = new int[n], vis = new int[n], chain = new int[n + 5];
        long[] edgeW = new long[n + 5];
        for (int i = 0; i < n; i++) parent[i] = i;
        vis[root] = 2;
        long total = 0;
        for (int i = 0; i < n; i++) {
            if (vis[find(parent, i)] != 0) continue;
            int top = 0, cur = find(parent, i);
            while (vis[cur] == 0) {
                vis[cur] = 1;
                chain[top] = cur;
                while (heap[cur] != -1 && find(parent, hu[heap[cur]]) == cur) {
                    pushDown(heap[cur]);
                    heap[cur] = mergeHeap(hl[heap[cur]], hr[heap[cur]]);
                }
                if (heap[cur] == -1) { System.out.println(-1); return; }
                int h = heap[cur];
                pushDown(h);
                long w = hw[h];
                int u = find(parent, hu[h]);
                total += w;
                edgeW[top++] = w;
                if (vis[u] == 1) {
                    int rep = cur, merged = -1;
                    while (true) {
                        int x = chain[--top];
                        long ew = edgeW[top];
                        pushDown(heap[x]);
                        int subH = mergeHeap(hl[heap[x]], hr[heap[x]]);
                        if (subH != -1) { hw[subH] -= ew; hadd[subH] -= ew; }
                        merged = mergeHeap(merged, subH);
                        parent[x] = rep;
                        if (x == u) break;
                    }
                    heap[rep] = merged;
                    vis[rep] = 0;
                    cur = rep;
                } else {
                    cur = u;
                }
            }
            for (int k = 0; k < top; k++) vis[chain[k]] = 2;
        }
        System.out.println(total);
    }
}`,
        python3: `import sys

sys.setrecursionlimit(200000)


def main() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    m = int(data[1])
    root = int(data[2]) - 1
    hu, hw, hadd, hl, hr = [], [], [], [], []

    def push_down(h: int) -> None:
        if h != -1 and hadd[h] != 0:
            d = hadd[h]
            l, r = hl[h], hr[h]
            if l != -1:
                hw[l] += d
                hadd[l] += d
            if r != -1:
                hw[r] += d
                hadd[r] += d
            hadd[h] = 0

    def merge_heap(a: int, b: int) -> int:
        if a == -1:
            return b
        if b == -1:
            return a
        if hw[a] > hw[b]:
            a, b = b, a
        push_down(a)
        hr[a] = merge_heap(hr[a], b)
        hl[a], hr[a] = hr[a], hl[a]
        return a

    heap = [-1] * n
    idx = 3
    for _ in range(m):
        u = int(data[idx]) - 1
        v = int(data[idx + 1]) - 1
        w = int(data[idx + 2])
        idx += 3
        if u == v or v == root:
            continue
        eid = len(hu)
        hu.append(u)
        hw.append(w)
        hadd.append(0)
        hl.append(-1)
        hr.append(-1)
        heap[v] = merge_heap(heap[v], eid)

    parent = list(range(n))

    def find(x: int) -> int:
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    vis = [0] * n
    vis[root] = 2
    total = 0
    for i in range(n):
        if vis[find(i)] != 0:
            continue
        chain = []
        edge_w = []
        cur = find(i)
        while vis[cur] == 0:
            vis[cur] = 1
            chain.append(cur)
            while heap[cur] != -1 and find(hu[heap[cur]]) == cur:
                push_down(heap[cur])
                heap[cur] = merge_heap(hl[heap[cur]], hr[heap[cur]])
            if heap[cur] == -1:
                print(-1)
                return
            h = heap[cur]
            push_down(h)
            w = hw[h]
            u = find(hu[h])
            total += w
            edge_w.append(w)
            if vis[u] == 1:
                rep = cur
                merged = -1
                while True:
                    x = chain.pop()
                    ew = edge_w.pop()
                    push_down(heap[x])
                    sub_h = merge_heap(hl[heap[x]], hr[heap[x]])
                    if sub_h != -1:
                        hw[sub_h] -= ew
                        hadd[sub_h] -= ew
                    merged = merge_heap(merged, sub_h)
                    parent[x] = rep
                    if x == u:
                        break
                heap[rep] = merged
                vis[rep] = 0
                cur = rep
            else:
                cur = u
        for x in chain:
            vis[x] = 2
    print(total)


if __name__ == "__main__":
    main()`,
        ruby: `tokens = STDIN.read.split
return if tokens.empty?
n = tokens[0].to_i
m = tokens[1].to_i
root = tokens[2].to_i - 1
hu = []
hw = []
hadd = []
hl = []
hr = []

push_down = lambda do |h|
  if h != -1 && hadd[h] != 0
    d = hadd[h]
    l = hl[h]
    r = hr[h]
    if l != -1
      hw[l] += d
      hadd[l] += d
    end
    if r != -1
      hw[r] += d
      hadd[r] += d
    end
    hadd[h] = 0
  end
end

merge_heap = nil
merge_heap = lambda do |a, b|
  return b if a == -1
  return a if b == -1
  a, b = b, a if hw[a] > hw[b]
  push_down.call(a)
  hr[a] = merge_heap.call(hr[a], b)
  hl[a], hr[a] = hr[a], hl[a]
  a
end

heap = Array.new(n, -1)
idx = 3
m.times do
  u = tokens[idx].to_i - 1
  v = tokens[idx + 1].to_i - 1
  w = tokens[idx + 2].to_i
  idx += 3
  next if u == v || v == root
  eid = hu.length
  hu << u
  hw << w
  hadd << 0
  hl << -1
  hr << -1
  heap[v] = merge_heap.call(heap[v], eid)
end

parent = (0...n).to_a
find = lambda do |x|
  while parent[x] != x
    parent[x] = parent[parent[x]]
    x = parent[x]
  end
  x
end

vis = Array.new(n, 0)
vis[root] = 2
total = 0
(0...n).each do |i|
  next if vis[find.call(i)] != 0
  chain = []
  edge_w = []
  cur = find.call(i)
  while vis[cur] == 0
    vis[cur] = 1
    chain << cur
    while heap[cur] != -1 && find.call(hu[heap[cur]]) == cur
      push_down.call(heap[cur])
      heap[cur] = merge_heap.call(hl[heap[cur]], hr[heap[cur]])
    end
    if heap[cur] == -1
      puts(-1)
      exit 0
    end
    h = heap[cur]
    push_down.call(h)
    w = hw[h]
    u = find.call(hu[h])
    total += w
    edge_w << w
    if vis[u] == 1
      rep = cur
      merged = -1
      loop do
        x = chain.pop
        ew = edge_w.pop
        push_down.call(heap[x])
        sub_h = merge_heap.call(hl[heap[x]], hr[heap[x]])
        if sub_h != -1
          hw[sub_h] -= ew
          hadd[sub_h] -= ew
        end
        merged = merge_heap.call(merged, sub_h)
        parent[x] = rep
        break if x == u
      end
      heap[rep] = merged
      vis[rep] = 0
      cur = rep
    else
      cur = u
    end
  end
  chain.each { |x| vis[x] = 2 }
end
puts total`,
      },
    },
    {
      id: 'ch75-p3',
      tier: 'Boss',
      ratingRange: '2900–3300+',
      title: 'Unrooted Directed MST & Exact Arborescence Reconstruction',
      statement:
        'Given a weighted directed graph with N vertices (1 <= N <= 2 * 10^5) and M directed edges (u -> v, w), choose a root R in [1..N] and a spanning out-arborescence rooted at R minimizing total edge weight. Output the minimum weight on line 1 and the parent array P[1..N] (with P[R] = 0) on line 2, or -1 if no vertex can reach all others.',
      constraints: '1 <= N <= 2 * 10^5, 0 <= M <= 2 * 10^5, -10^9 <= w <= 10^9',
      sampleInput: `4 5\n1 2 3\n2 1 1\n2 3 4\n3 4 5\n4 2 2`,
      sampleOutput: `7\n2 4 2 0`,
      hints: [
        'Add virtual super-root 0 with directed edges 0 -> v of weight BIG = sum(|w|) + 1. A valid single-root spanning arborescence exists iff total <= BIG + sum(max(0, w)).',
        'Assign a fresh contraction-tree ID whenever a cycle contracts, record each node’s chosen incoming edge id, and traverse contraction nodes in reverse topological order: whenever an unused node’s edge is accepted, walk its original target vertex up tree_par[] marking broken supernodes resolved in O(V) total time.',
      ],
      solutions: {
        cpp20: `#include <algorithm>
#include <cstdlib>
#include <iostream>
#include <vector>

using namespace std;

struct HeapNode {
    int orig_u, orig_v;
    long long w, add;
    int l, r;
};

void push_down(vector<HeapNode>& pool, int h) {
    if (h != -1 && pool[h].add != 0) {
        long long d = pool[h].add;
        if (pool[h].l != -1) { pool[pool[h].l].w += d; pool[pool[h].l].add += d; }
        if (pool[h].r != -1) { pool[pool[h].r].w += d; pool[pool[h].r].add += d; }
        pool[h].add = 0;
    }
}

int merge_heap(vector<HeapNode>& pool, int a, int b) {
    if (a == -1) return b;
    if (b == -1) return a;
    if (pool[a].w > pool[b].w) swap(a, b);
    push_down(pool, a);
    pool[a].r = merge_heap(pool, pool[a].r, b);
    swap(pool[a].l, pool[a].r);
    return a;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, m;
    if (!(cin >> n >> m)) return 0;
    vector<HeapNode> pool;
    pool.reserve(m + n);
    vector<int> heap(2 * n + 2, -1);

    long long sum_abs = 0, sum_pos = 0;
    for (int i = 0; i < m; ++i) {
        int u, v;
        long long w;
        cin >> u >> v >> w;
        --u;
        --v;
        sum_abs += llabs(w);
        if (w > 0) sum_pos += w;
        if (u == v) continue;
        int id = static_cast<int>(pool.size());
        pool.push_back({u, v, w, 0, -1, -1});
        heap[v] = merge_heap(pool, heap[v], id);
    }

    const long long BIG = sum_abs + 1;
    const int super_root = n;
    for (int v = 0; v < n; ++v) {
        int id = static_cast<int>(pool.size());
        pool.push_back({super_root, v, BIG, 0, -1, -1});
        heap[v] = merge_heap(pool, heap[v], id);
    }

    int total_nodes = n + 1;
    int max_nodes = 2 * total_nodes + 2;
    vector<int> dsu(max_nodes), vis(max_nodes, 0), tree_par(max_nodes, -1), in_edge(max_nodes, -1);
    for (int i = 0; i < max_nodes; ++i) dsu[i] = i;
    auto find = [&](int x) {
        while (dsu[x] != x) {
            dsu[x] = dsu[dsu[x]];
            x = dsu[x];
        }
        return x;
    };

    vis[super_root] = 2;
    long long total = 0;
    int next_id = total_nodes;

    for (int i = 0; i < n; ++i) {
        if (vis[find(i)] != 0) continue;
        vector<int> chain;
        int cur = find(i);
        while (vis[cur] == 0) {
            vis[cur] = 1;
            chain.push_back(cur);
            while (heap[cur] != -1 && find(pool[heap[cur]].orig_u) == cur) {
                push_down(pool, heap[cur]);
                heap[cur] = merge_heap(pool, pool[heap[cur]].l, pool[heap[cur]].r);
            }
            if (heap[cur] == -1) {
                cout << -1 << "\\n";
                return 0;
            }
            int h = heap[cur];
            push_down(pool, h);
            long long w = pool[h].w;
            in_edge[cur] = h;
            total += w;
            int u = find(pool[h].orig_u);
            if (vis[u] == 1) {
                int rep = next_id++;
                int merged = -1;
                while (true) {
                    int x = chain.back();
                    chain.pop_back();
                    int hx = in_edge[x];
                    long long ew = pool[hx].w;
                    push_down(pool, heap[x]);
                    int sub_h = merge_heap(pool, pool[heap[x]].l, pool[heap[x]].r);
                    if (sub_h != -1) {
                        pool[sub_h].w -= ew;
                        pool[sub_h].add -= ew;
                    }
                    merged = merge_heap(pool, merged, sub_h);
                    tree_par[x] = rep;
                    dsu[x] = rep;
                    if (x == u) break;
                }
                heap[rep] = merged;
                vis[rep] = 0;
                cur = rep;
            } else {
                cur = u;
            }
        }
        for (int x : chain) vis[x] = 2;
    }

    if (total > BIG + sum_pos) {
        cout << -1 << "\\n";
        return 0;
    }

    vector<bool> resolved(next_id, false);
    resolved[super_root] = true;
    vector<int> ans_par(n, 0);
    for (int node = next_id - 1; node >= 0; --node) {
        if (resolved[node] || in_edge[node] == -1) continue;
        int e = in_edge[node];
        int u = pool[e].orig_u;
        int v = pool[e].orig_v;
        ans_par[v] = (u == super_root) ? 0 : (u + 1);
        int cur = v;
        while (cur != -1 && !resolved[cur]) {
            resolved[cur] = true;
            cur = tree_par[cur];
        }
    }

    cout << (total - BIG) << "\\n";
    for (int i = 0; i < n; ++i) {
        cout << ans_par[i] << (i + 1 == n ? '\\n' : ' ');
    }
    return 0;
}`,
        rust: `use std::io::{self, Read};

#[derive(Clone, Copy)]
struct HeapNode {
    orig_u: usize,
    orig_v: usize,
    w: i128,
    add: i128,
    l: isize,
    r: isize,
}

fn push_down(pool: &mut [HeapNode], h: isize) {
    if h != -1 {
        let hi = h as usize;
        let d = pool[hi].add;
        if d != 0 {
            let (l, r) = (pool[hi].l, pool[hi].r);
            if l != -1 {
                pool[l as usize].w += d;
                pool[l as usize].add += d;
            }
            if r != -1 {
                pool[r as usize].w += d;
                pool[r as usize].add += d;
            }
            pool[hi].add = 0;
        }
    }
}

fn merge_heap(pool: &mut [HeapNode], mut a: isize, mut b: isize) -> isize {
    if a == -1 { return b; }
    if b == -1 { return a; }
    if pool[a as usize].w > pool[b as usize].w {
        std::mem::swap(&mut a, &mut b);
    }
    push_down(pool, a);
    let nr = merge_heap(pool, pool[a as usize].r, b);
    let ai = a as usize;
    pool[ai].r = pool[ai].l;
    pool[ai].l = nr;
    a
}

fn find(dsu: &mut [usize], mut x: usize) -> usize {
    while dsu[x] != x {
        dsu[x] = dsu[dsu[x]];
        x = dsu[x];
    }
    x
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

    let mut pool = Vec::with_capacity(m + n);
    let max_nodes = 2 * (n + 1) + 2;
    let mut heap = vec![-1isize; max_nodes];
    let mut sum_abs: i128 = 0;
    let mut sum_pos: i128 = 0;
    for _ in 0..m {
        let u = it.next().unwrap().parse::<usize>().unwrap() - 1;
        let v = it.next().unwrap().parse::<usize>().unwrap() - 1;
        let w: i128 = it.next().unwrap().parse().unwrap();
        sum_abs += w.abs();
        if w > 0 { sum_pos += w; }
        if u == v { continue; }
        let id = pool.len() as isize;
        pool.push(HeapNode { orig_u: u, orig_v: v, w, add: 0, l: -1, r: -1 });
        heap[v] = merge_heap(&mut pool, heap[v], id);
    }

    let big = sum_abs + 1;
    let super_root = n;
    for v in 0..n {
        let id = pool.len() as isize;
        pool.push(HeapNode { orig_u: super_root, orig_v: v, w: big, add: 0, l: -1, r: -1 });
        heap[v] = merge_heap(&mut pool, heap[v], id);
    }

    let mut dsu: Vec<usize> = (0..max_nodes).collect();
    let mut vis = vec![0u8; max_nodes];
    let mut tree_par = vec![-1isize; max_nodes];
    let mut in_edge = vec![-1isize; max_nodes];
    vis[super_root] = 2;
    let mut total: i128 = 0;
    let mut next_id = n + 1;

    for i in 0..n {
        if vis[find(&mut dsu, i)] != 0 { continue; }
        let mut chain = Vec::new();
        let mut cur = find(&mut dsu, i);
        while vis[cur] == 0 {
            vis[cur] = 1;
            chain.push(cur);
            while heap[cur] != -1 && find(&mut dsu, pool[heap[cur] as usize].orig_u) == cur {
                push_down(&mut pool, heap[cur]);
                let hi = heap[cur] as usize;
                heap[cur] = merge_heap(&mut pool, pool[hi].l, pool[hi].r);
            }
            if heap[cur] == -1 {
                println!("-1");
                return;
            }
            let h = heap[cur];
            push_down(&mut pool, h);
            let w = pool[h as usize].w;
            in_edge[cur] = h;
            total += w;
            let u = find(&mut dsu, pool[h as usize].orig_u);
            if vis[u] == 1 {
                let rep = next_id;
                next_id += 1;
                let mut merged = -1isize;
                loop {
                    let x = chain.pop().unwrap();
                    let hx = in_edge[x] as usize;
                    let ew = pool[hx].w;
                    push_down(&mut pool, heap[x]);
                    let hxi = heap[x] as usize;
                    let sub_h = merge_heap(&mut pool, pool[hxi].l, pool[hxi].r);
                    if sub_h != -1 {
                        pool[sub_h as usize].w -= ew;
                        pool[sub_h as usize].add -= ew;
                    }
                    merged = merge_heap(&mut pool, merged, sub_h);
                    tree_par[x] = rep as isize;
                    dsu[x] = rep;
                    if x == u { break; }
                }
                heap[rep] = merged;
                vis[rep] = 0;
                cur = rep;
            } else {
                cur = u;
            }
        }
        for x in chain { vis[x] = 2; }
    }

    if total > big + sum_pos {
        println!("-1");
        return;
    }

    let mut resolved = vec![false; next_id];
    resolved[super_root] = true;
    let mut ans_par = vec![0usize; n];
    for node in (0..next_id).rev() {
        if resolved[node] || in_edge[node] == -1 { continue; }
        let e = in_edge[node] as usize;
        let u = pool[e].orig_u;
        let v = pool[e].orig_v;
        ans_par[v] = if u == super_root { 0 } else { u + 1 };
        let mut cur = v as isize;
        while cur != -1 && !resolved[cur as usize] {
            resolved[cur as usize] = true;
            cur = tree_par[cur as usize];
        }
    }

    println!("{}", total - big);
    let out: Vec<String> = ans_par.iter().map(|x| x.to_string()).collect();
    println!("{}", out.join(" "));
}`,
        java21: `import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;

public class Main {
    static class FastScanner {
        private final InputStream in = System.in;
        private final byte[] buffer = new byte[1 << 16];
        private int ptr = 0, len = 0;

        private int readByte() throws IOException {
            if (ptr >= len) {
                len = in.read(buffer);
                ptr = 0;
                if (len <= 0) return -1;
            }
            return buffer[ptr++];
        }

        long nextLong() throws IOException {
            int c;
            do {
                c = readByte();
                if (c == -1) return Long.MIN_VALUE;
            } while (c <= ' ');
            long sign = 1;
            if (c == '-') { sign = -1; c = readByte(); }
            long val = 0;
            while (c > ' ') { val = val * 10 + (c - '0'); c = readByte(); }
            return val * sign;
        }
    }

    static int[] ou, ov, hl, hr;
    static long[] hw, hadd;

    static void pushDown(int h) {
        if (h != -1 && hadd[h] != 0) {
            long d = hadd[h];
            if (hl[h] != -1) { hw[hl[h]] += d; hadd[hl[h]] += d; }
            if (hr[h] != -1) { hw[hr[h]] += d; hadd[hr[h]] += d; }
            hadd[h] = 0;
        }
    }

    static int mergeHeap(int a, int b) {
        if (a == -1) return b;
        if (b == -1) return a;
        if (hw[a] > hw[b]) { int t = a; a = b; b = t; }
        pushDown(a);
        hr[a] = mergeHeap(hr[a], b);
        int t = hl[a]; hl[a] = hr[a]; hr[a] = t;
        return a;
    }

    static int find(int[] p, int x) {
        while (p[x] != x) { p[x] = p[p[x]]; x = p[x]; }
        return x;
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        long nVal = fs.nextLong();
        if (nVal == Long.MIN_VALUE) return;
        int n = (int) nVal, m = (int) fs.nextLong();
        int cap = m + n + 5;
        ou = new int[cap]; ov = new int[cap]; hl = new int[cap]; hr = new int[cap];
        hw = new long[cap]; hadd = new long[cap];

        int maxNodes = 2 * (n + 1) + 5;
        int[] heap = new int[maxNodes];
        Arrays.fill(heap, -1);

        int sz = 0;
        long sumAbs = 0, sumPos = 0;
        for (int i = 0; i < m; i++) {
            int u = (int) fs.nextLong() - 1, v = (int) fs.nextLong() - 1;
            long w = fs.nextLong();
            sumAbs += Math.abs(w);
            if (w > 0) sumPos += w;
            if (u == v) continue;
            ou[sz] = u; ov[sz] = v; hw[sz] = w; hadd[sz] = 0; hl[sz] = -1; hr[sz] = -1;
            heap[v] = mergeHeap(heap[v], sz++);
        }

        final long BIG = sumAbs + 1;
        final int superRoot = n;
        for (int v = 0; v < n; v++) {
            ou[sz] = superRoot; ov[sz] = v; hw[sz] = BIG; hadd[sz] = 0; hl[sz] = -1; hr[sz] = -1;
            heap[v] = mergeHeap(heap[v], sz++);
        }

        int[] dsu = new int[maxNodes], vis = new int[maxNodes], treePar = new int[maxNodes], inEdge = new int[maxNodes], chain = new int[maxNodes];
        for (int i = 0; i < maxNodes; i++) dsu[i] = i;
        Arrays.fill(treePar, -1);
        Arrays.fill(inEdge, -1);
        vis[superRoot] = 2;
        long total = 0;
        int nextId = n + 1;

        for (int i = 0; i < n; i++) {
            if (vis[find(dsu, i)] != 0) continue;
            int top = 0, cur = find(dsu, i);
            while (vis[cur] == 0) {
                vis[cur] = 1;
                chain[top++] = cur;
                while (heap[cur] != -1 && find(dsu, ou[heap[cur]]) == cur) {
                    pushDown(heap[cur]);
                    heap[cur] = mergeHeap(hl[heap[cur]], hr[heap[cur]]);
                }
                if (heap[cur] == -1) { System.out.println(-1); return; }
                int h = heap[cur];
                pushDown(h);
                long w = hw[h];
                inEdge[cur] = h;
                total += w;
                int u = find(dsu, ou[h]);
                if (vis[u] == 1) {
                    int rep = nextId++, merged = -1;
                    while (true) {
                        int x = chain[--top];
                        long ew = hw[inEdge[x]];
                        pushDown(heap[x]);
                        int subH = mergeHeap(hl[heap[x]], hr[heap[x]]);
                        if (subH != -1) { hw[subH] -= ew; hadd[subH] -= ew; }
                        merged = mergeHeap(merged, subH);
                        treePar[x] = rep;
                        dsu[x] = rep;
                        if (x == u) break;
                    }
                    heap[rep] = merged;
                    vis[rep] = 0;
                    cur = rep;
                } else {
                    cur = u;
                }
            }
            for (int k = 0; k < top; k++) vis[chain[k]] = 2;
        }

        if (total > BIG + sumPos) { System.out.println(-1); return; }

        boolean[] resolved = new boolean[nextId];
        resolved[superRoot] = true;
        int[] ansPar = new int[n];
        for (int node = nextId - 1; node >= 0; node--) {
            if (resolved[node] || inEdge[node] == -1) continue;
            int e = inEdge[node], u = ou[e], v = ov[e];
            ansPar[v] = (u == superRoot) ? 0 : (u + 1);
            int cur = v;
            while (cur != -1 && !resolved[cur]) {
                resolved[cur] = true;
                cur = treePar[cur];
            }
        }
        StringBuilder sb = new StringBuilder();
        sb.append(total - BIG).append('\\n');
        for (int i = 0; i < n; i++) {
            if (i > 0) sb.append(' ');
            sb.append(ansPar[i]);
        }
        System.out.println(sb);
    }
}`,
        python3: `import sys

sys.setrecursionlimit(200000)


def main() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    m = int(data[1])
    ou, ov, hw, hadd, hl, hr = [], [], [], [], [], []

    def push_down(h: int) -> None:
        if h != -1 and hadd[h] != 0:
            d = hadd[h]
            l, r = hl[h], hr[h]
            if l != -1:
                hw[l] += d
                hadd[l] += d
            if r != -1:
                hw[r] += d
                hadd[r] += d
            hadd[h] = 0

    def merge_heap(a: int, b: int) -> int:
        if a == -1:
            return b
        if b == -1:
            return a
        if hw[a] > hw[b]:
            a, b = b, a
        push_down(a)
        hr[a] = merge_heap(hr[a], b)
        hl[a], hr[a] = hr[a], hl[a]
        return a

    max_nodes = 2 * (n + 1) + 5
    heap = [-1] * max_nodes
    sum_abs = 0
    sum_pos = 0
    idx = 2
    for _ in range(m):
        u = int(data[idx]) - 1
        v = int(data[idx + 1]) - 1
        w = int(data[idx + 2])
        idx += 3
        sum_abs += abs(w)
        if w > 0:
            sum_pos += w
        if u == v:
            continue
        eid = len(ou)
        ou.append(u)
        ov.append(v)
        hw.append(w)
        hadd.append(0)
        hl.append(-1)
        hr.append(-1)
        heap[v] = merge_heap(heap[v], eid)

    big = sum_abs + 1
    super_root = n
    for v in range(n):
        eid = len(ou)
        ou.append(super_root)
        ov.append(v)
        hw.append(big)
        hadd.append(0)
        hl.append(-1)
        hr.append(-1)
        heap[v] = merge_heap(heap[v], eid)

    dsu = list(range(max_nodes))
    vis = [0] * max_nodes
    tree_par = [-1] * max_nodes
    in_edge = [-1] * max_nodes

    def find(x: int) -> int:
        while dsu[x] != x:
            dsu[x] = dsu[dsu[x]]
            x = dsu[x]
        return x

    vis[super_root] = 2
    total = 0
    next_id = n + 1
    for i in range(n):
        if vis[find(i)] != 0:
            continue
        chain = []
        cur = find(i)
        while vis[cur] == 0:
            vis[cur] = 1
            chain.append(cur)
            while heap[cur] != -1 and find(ou[heap[cur]]) == cur:
                push_down(heap[cur])
                heap[cur] = merge_heap(hl[heap[cur]], hr[heap[cur]])
            if heap[cur] == -1:
                print(-1)
                return
            h = heap[cur]
            push_down(h)
            w = hw[h]
            in_edge[cur] = h
            total += w
            u = find(ou[h])
            if vis[u] == 1:
                rep = next_id
                next_id += 1
                merged = -1
                while True:
                    x = chain.pop()
                    ew = hw[in_edge[x]]
                    push_down(heap[x])
                    sub_h = merge_heap(hl[heap[x]], hr[heap[x]])
                    if sub_h != -1:
                        hw[sub_h] -= ew
                        hadd[sub_h] -= ew
                    merged = merge_heap(merged, sub_h)
                    tree_par[x] = rep
                    dsu[x] = rep
                    if x == u:
                        break
                heap[rep] = merged
                vis[rep] = 0
                cur = rep
            else:
                cur = u
        for x in chain:
            vis[x] = 2

    if total > big + sum_pos:
        print(-1)
        return

    resolved = [False] * next_id
    resolved[super_root] = True
    ans_par = [0] * n
    for node in range(next_id - 1, -1, -1):
        if resolved[node] or in_edge[node] == -1:
            continue
        e = in_edge[node]
        u = ou[e]
        v = ov[e]
        ans_par[v] = 0 if u == super_root else (u + 1)
        cur = v
        while cur != -1 and not resolved[cur]:
            resolved[cur] = True
            cur = tree_par[cur]

    print(total - big)
    print(" ".join(map(str, ans_par)))


if __name__ == "__main__":
    main()`,
        ruby: `tokens = STDIN.read.split
return if tokens.empty?
n = tokens[0].to_i
m = tokens[1].to_i
ou = []
ov = []
hw = []
hadd = []
hl = []
hr = []

push_down = lambda do |h|
  if h != -1 && hadd[h] != 0
    d = hadd[h]
    l = hl[h]
    r = hr[h]
    if l != -1
      hw[l] += d
      hadd[l] += d
    end
    if r != -1
      hw[r] += d
      hadd[r] += d
    end
    hadd[h] = 0
  end
end

merge_heap = nil
merge_heap = lambda do |a, b|
  return b if a == -1
  return a if b == -1
  a, b = b, a if hw[a] > hw[b]
  push_down.call(a)
  hr[a] = merge_heap.call(hr[a], b)
  hl[a], hr[a] = hr[a], hl[a]
  a
end

max_nodes = 2 * (n + 1) + 5
heap = Array.new(max_nodes, -1)
sum_abs = 0
sum_pos = 0
idx = 2
m.times do
  u = tokens[idx].to_i - 1
  v = tokens[idx + 1].to_i - 1
  w = tokens[idx + 2].to_i
  idx += 3
  sum_abs += w.abs
  sum_pos += w if w > 0
  next if u == v
  eid = ou.length
  ou << u
  ov << v
  hw << w
  hadd << 0
  hl << -1
  hr << -1
  heap[v] = merge_heap.call(heap[v], eid)
end

big = sum_abs + 1
super_root = n
(0...n).each do |v|
  eid = ou.length
  ou << super_root
  ov << v
  hw << big
  hadd << 0
  hl << -1
  hr << -1
  heap[v] = merge_heap.call(heap[v], eid)
end

dsu = (0...max_nodes).to_a
vis = Array.new(max_nodes, 0)
tree_par = Array.new(max_nodes, -1)
in_edge = Array.new(max_nodes, -1)

find = lambda do |x|
  while dsu[x] != x
    dsu[x] = dsu[dsu[x]]
    x = dsu[x]
  end
  x
end

vis[super_root] = 2
total = 0
next_id = n + 1
(0...n).each do |i|
  next if vis[find.call(i)] != 0
  chain = []
  cur = find.call(i)
  while vis[cur] == 0
    vis[cur] = 1
    chain << cur
    while heap[cur] != -1 && find.call(ou[heap[cur]]) == cur
      push_down.call(heap[cur])
      heap[cur] = merge_heap.call(hl[heap[cur]], hr[heap[cur]])
    end
    if heap[cur] == -1
      puts(-1)
      exit 0
    end
    h = heap[cur]
    push_down.call(h)
    w = hw[h]
    in_edge[cur] = h
    total += w
    u = find.call(ou[h])
    if vis[u] == 1
      rep = next_id
      next_id += 1
      merged = -1
      loop do
        x = chain.pop
        ew = hw[in_edge[x]]
        push_down.call(heap[x])
        sub_h = merge_heap.call(hl[heap[x]], hr[heap[x]])
        if sub_h != -1
          hw[sub_h] -= ew
          hadd[sub_h] -= ew
        end
        merged = merge_heap.call(merged, sub_h)
        tree_par[x] = rep
        dsu[x] = rep
        break if x == u
      end
      heap[rep] = merged
      vis[rep] = 0
      cur = rep
    else
      cur = u
    end
  end
  chain.each { |x| vis[x] = 2 }
end

if total > big + sum_pos
  puts(-1)
  exit 0
end

resolved = Array.new(next_id, false)
resolved[super_root] = true
ans_par = Array.new(n, 0)
(next_id - 1).downto(0) do |node|
  next if resolved[node] || in_edge[node] == -1
  e = in_edge[node]
  u = ou[e]
  v = ov[e]
  ans_par[v] = u == super_root ? 0 : (u + 1)
  cur = v
  while cur != -1 && !resolved[cur]
    resolved[cur] = true
    cur = tree_par[cur]
  end
end

puts(total - big)
puts ans_par.join(" ")`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'AtCoder',
      title: 'Library Checker - Directed MST',
      difficulty: 'Grandmaster',
      url: 'https://judge.yosupo.jp/problem/directedmst',
      patternNote: 'Skew-Heap Edmonds in O(E log V) paired with contraction-tree parent reconstruction.',
    },
    {
      platform: 'Codeforces',
      title: 'Codeforces 240F / Luogu P4716 Directed Minimum Spanning Tree',
      difficulty: '2600',
      url: 'https://www.luogu.com.cn/problem/P4716',
      patternNote: 'Fixed-root cycle contraction via iterative Edmonds or lazy Skew Heap.',
    },
    {
      platform: 'Codeforces',
      title: 'Unrooted Minimum Arborescence (Virtual Super-Root Trick)',
      difficulty: '2600',
      url: 'https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=2124',
      patternNote: 'Add super-root S -> v of weight BIG = sum(|w|) + 1 and reject when total > BIG + sum_pos.',
    },
  ],
  interviewNotes: [
    'Edmonds’ theorem relies on subtracting min_in[v] upfront for every non-root v; every edge entering a zero-weight cycle C then pays its remaining reduced cost while deleting exactly one cycle edge.',
    'Lazy skew heaps shrink cycle contraction from O(V E) to O(E log V) by subtracting edge_w[v] from the heap root delta rather than re-scanning every incoming edge.',
    'Unrooted Directed MST adds a single virtual root S -> v with weight BIG > sum(pos_w); if a valid single-root arborescence exists, S will be forced to buy only one edge out of S.',
  ],
  projectBlueprint: {
    title: 'Directed Arborescence & Contraction-Tree Edge Recovery Engine',
    tagline: 'Lazy-heap O(E log V) Chu-Liu/Edmonds solver supporting fixed roots, unrooted graphs, and full parent reconstruction',
    stackSummary: 'C++20 / Rust Skew-Heap Arena + DSU + Contraction-Tree Top-Down Unpacker',
    asciiDiagram:
`[Digraph G] ---> [Skew Heap / Node] ---> [Cycle Visited -> Shift & Merge] ---> [O(E log V) Cost]
                     |
                     +---> [Contraction Tree] ---> [Resolve Broken Cycle Edges] ---> Parent Array`,
    milestones: [
      { id: 'm1', title: 'Iterative O(V E) Baseline', detail: 'Contract cycles greedily with zero-shift reweighting for dense graphs.' },
      { id: 'm2', title: 'Lazy Skew-Heap Merger', detail: 'Compress heap merges and negative cycle shifts to O(E log V).' },
      { id: 'm3', title: 'Unrooted Super-Root & Unpacker', detail: 'Recover exact parent[1..N] across nested cycle contractions.' },
    ],
    starterCode: `// Unrooted DMST threshold:
// Set BIG = sum(|w|) + 1 for super_root -> v edges; valid single root iff total <= BIG + sum(max(0, w)).`,
  },
};
