import type { TheoryChapter } from '../../types/vault';

export const CH39_PERSISTENT_SEGTREE: TheoryChapter = {
  slug: 'persistent-segment-tree',
  topicId: 'ds-09',
  title: 'Persistent Segment Trees & Offline K-th Queries',
  domain: 'Data Structures',
  ratingTier: '1900–2200',
  usacoDivision: 'Platinum',
  subtitle:
    'Create immutable historical versions of a Segment Tree in O(log N) time and O(log N) new nodes per update via path copying—unlocking static range K-th smallest, range distinct counts, and online tree-path K-th order statistics.',
  analogyTitle: 'The Git Copy-on-Write Directory Tree Analogy',
  analogyBody:
    'Imagine an array of size `N = 2^17` stored inside a balanced binary tree. When one single leaf changes in version `t`, copying all `2N` nodes would take `O(N)` memory per edit (`O(N^2)` total—instant MLE). Yet notice a crucial invariant: modifying ONE leaf only alters the `log2(N) ~ 18` ancestors directly on the root-to-leaf path! Every other subtree in the left or right half remains **bit-for-bit identical** to version `t - 1`. So just like Git commits reuse unchanged directory tree hashes, **Path Copying** allocates only ONE new root and ~`18` new nodes along the modified spine, pointing the untouched child pointers straight back to the previous version’s nodes. Even more remarkably, building prefix frequency trees `root[1..N]` over coordinate-compressed values lets you subtract two versions (`cnt(root[R]) - cnt(root[L - 1])`) during a single parallel binary-tree descent—answering arbitrary **Static Range K-th Smallest** queries online in `O(log N)` without sorting or Mo’s Algorithm!',
  prerequisites: [
    {
      slug: 'segment-tree-point-range',
      title: 'Segment Tree (Point Update, Range Query)',
    },
  ],
  traceTitle: 'Interactive Path-Copying Version Creation & Parallel Range K-th Descent Trace',
  traceSubtitle:
    'Build prefix persistent frequency trees over value domain `[1..4]` as array `A = [3, 1, 4, 1]` arrives, then descend `root[4]` minus `root[1]` to find the `k = 2`-nd smallest element in subarray `A[2..4] = [1, 4, 1]`.',
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Step 1: Allocate Empty Base Tree root[0] (Node Pool Indices 1..7)',
      explanation:
        'Build an empty frequency segment tree over compressed value ranks [1..4] with total sum 0 at every node. root[0] = node 1.',
      mode: 'array',
      arrays: [
        {
          name: 'root[0] Counts (Node 1:[1..4], 2:[1..2], 3:[3..4], 4..7:leaves)',
          cells: [
            { index: 1, value: 'cnt=0', label: '[1..4]', highlight: 'neutral' },
            { index: 2, value: 'cnt=0', label: '[1..2]', highlight: 'neutral' },
            { index: 3, value: 'cnt=0', label: '[3..4]', highlight: 'neutral' },
            { index: 4, value: '0', label: 'val=1', highlight: 'neutral' },
            { index: 5, value: '0', label: 'val=2', highlight: 'neutral' },
            { index: 6, value: '0', label: 'val=3', highlight: 'neutral' },
            { index: 7, value: '0', label: 'val=4', highlight: 'neutral' },
          ],
        },
      ],
      variables: { Version: 0, NextFreeNode: 8, ArrayPrefix: '[]' },
    },
    {
      stepNumber: 2,
      title: 'Step 2: Insert A[1] = 3 -> Path-Copy 3 Nodes for root[1] (Sharing Left Subtree Node 2)',
      explanation:
        'To increment value 3 from root[0], allocate ONLY 3 new nodes: node 8 (new root [1..4], cnt=1), node 9 (new [3..4], cnt=1), node 10 (new leaf val=3, cnt=1). Notice node 8’s left child STILL points directly to old node 2!',
      mode: 'array',
      arrays: [
        {
          name: 'Version 1 Spine (Nodes 8 -> 9 -> 10, Left = Node 2)',
          cells: [
            { index: 8, value: 'cnt=1', label: 'R1[1..4]', highlight: 'updated' },
            { index: 2, value: 'cnt=0', label: 'SHARED[1..2]', highlight: 'window' },
            { index: 9, value: 'cnt=1', label: 'New[3..4]', highlight: 'updated' },
            { index: 10, value: '1', label: 'New val=3', highlight: 'active' },
            { index: 7, value: '0', label: 'SHARED val=4', highlight: 'window' },
          ],
        },
        {
          name: 'Version Roots',
          cells: [
            { index: 0, value: 1, highlight: 'neutral' },
            { index: 1, value: 8, highlight: 'updated' },
          ],
        },
      ],
      variables: { Inserted: 'A[1]=3', NodesAdded: 3, TotalPoolSize: 10 },
    },
    {
      stepNumber: 3,
      title: 'Step 3: Insert A[2..4] = [1, 4, 1] -> Build Prefix Roots root[2], root[3], root[4]',
      explanation:
        'Each insertion copies only 3 nodes (root -> mid -> leaf). By root[4], the conceptual multiset counts across [val=1, val=2, val=3, val=4] are [2, 0, 1, 1], while root[1] holds [0, 0, 1, 0].',
      mode: 'array',
      arrays: [
        {
          name: 'Conceptual Prefix Frequencies at root[1] vs root[4]',
          cells: [
            { index: 1, value: '0 vs 2', label: 'val=1', highlight: 'active' },
            { index: 2, value: '0 vs 0', label: 'val=2', highlight: 'neutral' },
            { index: 3, value: '1 vs 1', label: 'val=3', highlight: 'window' },
            { index: 4, value: '0 vs 1', label: 'val=4', highlight: 'updated' },
          ],
        },
      ],
      variables: { TotalNodesAllocated: 19, MemoryPerEdit: 'O(log N)', Query: 'K=2 on A[2..4]' },
    },
    {
      stepNumber: 4,
      title: 'Step 4: Parallel Descent (root[4] - root[1]) for K = 2-nd Smallest in A[2..4]',
      explanation:
        'At root [1..4]: leftCount = cnt(root[4].left) - cnt(root[1].left) = 2 - 0 = 2. Since K = 2 <= leftCount (2), descend LEFT into [1..2]! At [1..2]: leftCount(val=1) = 2 - 0 = 2 >= K=2 -> descend LEFT to leaf val=1. Answer = 1 in O(log N)!',
      mode: 'array',
      arrays: [
        {
          name: 'Subarray A[2..4] = [1, 4, 1] Virtual Histogram (root[4] - root[1])',
          cells: [
            { index: 1, value: 2, label: 'val=1 (HIT)', highlight: 'active' },
            { index: 2, value: 0, label: 'val=2', highlight: 'neutral' },
            { index: 3, value: 0, label: 'val=3', highlight: 'neutral' },
            { index: 4, value: 1, label: 'val=4', highlight: 'window' },
          ],
        },
      ],
      variables: { LeftChildDiff: 2, TargetK: 2, Decision: 'Go Left -> Leaf 1', Answer: 1 },
    },
  ],
  reductionClues: [
    {
      clue: '"Point update on any historical array version k, or clone version k and query range sum on version k"',
      translation:
        'Use a **Versioned Persistent Segment Tree**! Store `roots.push_back(update(roots[k], pos, val))` in `O(log N)` nodes and answer `query(roots[k], l, r)` without ever mutating older versions.',
    },
    {
      clue: '"Online static range K-th smallest element in A[L..R] (N, Q <= 2 * 10^5)"',
      translation:
        'Coordinate-compress values to `[1..M]`, build prefix persistent frequency trees `root[i] = insert(root[i - 1], rank(A[i]), +1)`, and binary-walk `(root[R], root[L - 1])` simultaneously comparing `k <= leftDiff`!',
    },
    {
      clue: '"Online query: count DISTINCT elements in A[L..R] (without offline sorting / Mo)"',
      translation:
        'Track `lastPos[val]`. At index `i`, update `root[i]` by adding `+1` at position `i` AND `-1` at `lastPos[A[i]]` (in two persistent updates on top of `root[i - 1]`). Then `distinct(L, R)` is simply `query(root[R], L, R)`!',
    },
    {
      clue: '"K-th smallest node weight on the unique path between u and v in a Tree (with N <= 10^5)"',
      translation:
        'Build each node’s persistent tree directly from its parent: `root[u] = insert(root[par[u]], rank(val[u]), +1)`. The path multiset is `cnt(u) + cnt(v) - cnt(lca) - cnt(par[lca])`—descend 4 node pointers in parallel in `O(log N)`!',
    },
  ],
  timeComplexity: 'O((N + Q) log N)',
  spaceComplexity: 'O((N + Q) log N) — typically ~20–40 integers per version (preallocate flat arena arrays!)',
  pitfalls: [
    {
      type: 'MLE',
      title: 'Using Dynamic Heap Allocation (new Node / Box<Node>) Instead of Flat Index Arenas',
      detail:
        'Allocating `4 * 10^6` heap objects with pointers (`left`, `right`) costs 32–48 bytes/node (~180 MB+) and triggers GC or MLE on 256 MB limits. Always preallocate flat integer arrays `lc[]`, `rc[]`, `val[]` (`int32` indices) for a 3x speedup and 16 bytes/node footprint!',
    },
    {
      type: 'RE',
      title: 'Underestimating Max Node Pool Capacity for Multi-Update Versions',
      detail:
        'Each single point update allocates `ceil(log2(N)) + 2` (~20) nodes. If `build()` uses `2N` nodes plus `N` prefix trees (or `2N` updates for distinct-elements with `-1` removal + `+1` insert), you need `(N + 2*Q) * 20` capacity (~`8 * 10^6` for `N=Q=2e5`)!',
    },
    {
      type: 'WA',
      title: 'Confusing Value-Indexed vs Position-Indexed Persistent Trees',
      detail:
        'For **Range K-th Smallest**, the segment tree is indexed by **compressed value rank `[1..M]`** (and versions correspond to prefix `i = 1..N`). For **Online Distinct Elements**, the segment tree is indexed by **array position `[1..N]`** (and versions correspond to right endpoint `R`)! Mixing the two ruins queries.',
    },
    {
      type: 'WA',
      title: 'Tree Path K-th Query Failing When LCA Is the Root (Missing Parent of LCA = 0)',
      detail:
        'In `cnt(u) + cnt(v) - cnt(lca) - cnt(par[lca])`, if `lca == 1` (the tree root), `par[1]` MUST be `0` pointing to the empty version `root[0]` (where `cnt[0] = 0`, `lc[0] = rc[0] = 0`)—otherwise you subtract node 1 twice or index out of bounds!',
    },
  ],
  implementations: {
    cpp20: `#include <bits/stdc++.h>
using namespace std;

// Persistent Segment Tree (Flat Arena) for Static Range K-th Smallest: O((N + Q) log N)
struct PersistentSegTree {
    int n, ptr;
    vector<int> lc, rc, cnt;

    PersistentSegTree(int n, int maxNodes) : n(n), ptr(0), lc(maxNodes, 0), rc(maxNodes, 0), cnt(maxNodes, 0) {}

    int newNode(int l, int r, int c) {
        int id = ++ptr;
        lc[id] = l;
        rc[id] = r;
        cnt[id] = c;
        return id;
    }

    int update(int prev, int l, int r, int pos, int delta) {
        int cur = newNode(lc[prev], rc[prev], cnt[prev] + delta);
        if (l == r) return cur;
        int mid = l + (r - l) / 2;
        if (pos <= mid) lc[cur] = update(lc[prev], l, mid, pos, delta);
        else rc[cur] = update(rc[prev], mid + 1, r, pos, delta);
        return cur;
    }

    int kth(int u, int v, int l, int r, int k) const {
        while (l < r) {
            int mid = l + (r - l) / 2;
            int leftDiff = cnt[lc[v]] - cnt[lc[u]];
            if (k <= leftDiff) {
                u = lc[u];
                v = lc[v];
                r = mid;
            } else {
                k -= leftDiff;
                u = rc[u];
                v = rc[v];
                l = mid + 1;
            }
        }
        return l;
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, q;
    if (!(cin >> n >> q)) return 0;
    vector<int> a(n + 1), vals(n);
    for (int i = 1; i <= n; i++) {
        cin >> a[i];
        vals[i - 1] = a[i];
    }
    sort(vals.begin(), vals.end());
    vals.erase(unique(vals.begin(), vals.end()), vals.end());
    int m = (int)vals.size();

    // Node 0 acts as the implicit all-zero sentinel tree
    PersistentSegTree pst(m, (n + 2) * 22 + 5);
    vector<int> roots(n + 1, 0);
    for (int i = 1; i <= n; i++) {
        int rank = (int)(lower_bound(vals.begin(), vals.end(), a[i]) - vals.begin()) + 1;
        roots[i] = pst.update(roots[i - 1], 1, m, rank, 1);
    }

    while (q--) {
        int l, r, k;
        cin >> l >> r >> k; // 1-indexed [l, r], 1-indexed k
        int rank = pst.kth(roots[l - 1], roots[r], 1, m, k);
        cout << vals[rank - 1] << "\\n";
    }
    return 0;
}`,
    rust: `use std::io::{self, Read};

struct PersistentSegTree {
    lc: Vec<usize>,
    rc: Vec<usize>,
    cnt: Vec<i32>,
}

impl PersistentSegTree {
    fn with_capacity(cap: usize) -> Self {
        let mut lc = Vec::with_capacity(cap);
        let mut rc = Vec::with_capacity(cap);
        let mut cnt = Vec::with_capacity(cap);
        // Node 0 is the shared empty sentinel
        lc.push(0);
        rc.push(0);
        cnt.push(0);
        Self { lc, rc, cnt }
    }

    fn update(&mut self, prev: usize, l: usize, r: usize, pos: usize, delta: i32) -> usize {
        let cur = self.cnt.len();
        self.lc.push(self.lc[prev]);
        self.rc.push(self.rc[prev]);
        self.cnt.push(self.cnt[prev] + delta);
        if l < r {
            let mid = l + (r - l) / 2;
            if pos <= mid {
                let child = self.update(self.lc[prev], l, mid, pos, delta);
                self.lc[cur] = child;
            } else {
                let child = self.update(self.rc[prev], mid + 1, r, pos, delta);
                self.rc[cur] = child;
            }
        }
        cur
    }

    fn kth(&self, mut u: usize, mut v: usize, mut l: usize, mut r: usize, mut k: i32) -> usize {
        while l < r {
            let mid = l + (r - l) / 2;
            let left_diff = self.cnt[self.lc[v]] - self.cnt[self.lc[u]];
            if k <= left_diff {
                u = self.lc[u];
                v = self.lc[v];
                r = mid;
            } else {
                k -= left_diff;
                u = self.rc[u];
                v = self.rc[v];
                l = mid + 1;
            }
        }
        l
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

    let mut a = vec![0i64; n + 1];
    let mut vals = Vec::with_capacity(n);
    for i in 1..=n {
        let x: i64 = it.next().unwrap().parse().unwrap();
        a[i] = x;
        vals.push(x);
    }
    vals.sort_unstable();
    vals.dedup();
    let m = vals.len();

    let mut pst = PersistentSegTree::with_capacity((n + 2) * 20);
    let mut roots = vec![0usize; n + 1];
    for i in 1..=n {
        let rank = vals.binary_search(&a[i]).unwrap() + 1;
        roots[i] = pst.update(roots[i - 1], 1, m, rank, 1);
    }

    let mut out = String::new();
    for _ in 0..q {
        let l: usize = it.next().unwrap().parse().unwrap();
        let r: usize = it.next().unwrap().parse().unwrap();
        let k: i32 = it.next().unwrap().parse().unwrap();
        let rank = pst.kth(roots[l - 1], roots[r], 1, m, k);
        out.push_str(&format!("{}\\n", vals[rank - 1]));
    }
    print!("{}", out);
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
        int nextInt() throws IOException {
            int c = readByte();
            while (c >= 0 && c <= ' ') c = readByte();
            if (c == -1) return Integer.MIN_VALUE;
            int sign = 1;
            if (c == '-') { sign = -1; c = readByte(); }
            int res = 0;
            while (c > ' ') { res = res * 10 + (c - '0'); c = readByte(); }
            return res * sign;
        }
    }

    static int[] lc, rc, cnt;
    static int ptr = 0;

    static int update(int prev, int l, int r, int pos, int delta) {
        int cur = ++ptr;
        lc[cur] = lc[prev];
        rc[cur] = rc[prev];
        cnt[cur] = cnt[prev] + delta;
        if (l < r) {
            int mid = (l + r) >>> 1;
            if (pos <= mid) lc[cur] = update(lc[prev], l, mid, pos, delta);
            else rc[cur] = update(rc[prev], mid + 1, r, pos, delta);
        }
        return cur;
    }

    static int kth(int u, int v, int l, int r, int k) {
        while (l < r) {
            int mid = (l + r) >>> 1;
            int leftDiff = cnt[lc[v]] - cnt[lc[u]];
            if (k <= leftDiff) {
                u = lc[u];
                v = lc[v];
                r = mid;
            } else {
                k -= leftDiff;
                u = rc[u];
                v = rc[v];
                l = mid + 1;
            }
        }
        return l;
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        int n = fs.nextInt();
        if (n == Integer.MIN_VALUE) return;
        int q = fs.nextInt();

        int[] a = new int[n + 1];
        int[] sorted = new int[n];
        for (int i = 1; i <= n; i++) {
            a[i] = fs.nextInt();
            sorted[i - 1] = a[i];
        }
        Arrays.sort(sorted);
        int m = 0;
        for (int i = 0; i < n; i++) {
            if (i == 0 || sorted[i] != sorted[i - 1]) sorted[m++] = sorted[i];
        }

        int maxNodes = (n + 2) * 22 + 5;
        lc = new int[maxNodes];
        rc = new int[maxNodes];
        cnt = new int[maxNodes];

        int[] roots = new int[n + 1];
        for (int i = 1; i <= n; i++) {
            int rank = Arrays.binarySearch(sorted, 0, m, a[i]) + 1;
            roots[i] = update(roots[i - 1], 1, m, rank, 1);
        }

        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < q; i++) {
            int l = fs.nextInt();
            int r = fs.nextInt();
            int k = fs.nextInt();
            int rank = kth(roots[l - 1], roots[r], 1, m, k);
            sb.append(sorted[rank - 1]).append('\\n');
        }
        System.out.print(sb);
    }
}`,
    python3: `import sys
from bisect import bisect_left

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    n = int(next(it))
    q = int(next(it))
    a = [0] + [int(next(it)) for _ in range(n)]

    vals = sorted(set(a[1:]))
    m = len(vals)

    # Flat node arena for Python speed and low memory overhead
    lc = [0]
    rc = [0]
    cnt = [0]

    def update(prev: int, pos: int, delta: int) -> int:
        # Iterative path copying avoids Python recursion limits and overhead
        l, r = 1, m
        new_root = len(cnt)
        cur = new_root
        while True:
            lc.append(lc[prev])
            rc.append(rc[prev])
            cnt.append(cnt[prev] + delta)
            if l == r:
                break
            mid = (l + r) // 2
            nxt = len(cnt)
            if pos <= mid:
                lc[cur] = nxt
                prev = lc[prev]
                r = mid
            else:
                rc[cur] = nxt
                prev = rc[prev]
                l = mid + 1
            cur = nxt
        return new_root

    def kth(u: int, v: int, k: int) -> int:
        l, r = 1, m
        while l < r:
            mid = (l + r) // 2
            left_diff = cnt[lc[v]] - cnt[lc[u]]
            if k <= left_diff:
                u = lc[u]
                v = lc[v]
                r = mid
            else:
                k -= left_diff
                u = rc[u]
                v = rc[v]
                l = mid + 1
        return l

    roots = [0] * (n + 1)
    for i in range(1, n + 1):
        rank = bisect_left(vals, a[i]) + 1
        roots[i] = update(roots[i - 1], rank, 1)

    out = []
    for _ in range(q):
        l = int(next(it))
        r = int(next(it))
        k = int(next(it))
        rank = kth(roots[l - 1], roots[r], k)
        out.append(str(vals[rank - 1]))
    sys.stdout.write("\\n".join(out) + "\\n")

if __name__ == "__main__":
    solve()`,
    ruby: `tokens = $stdin.read.split
exit if tokens.empty?
idx = 0
n = tokens[idx].to_i; idx += 1
q = tokens[idx].to_i; idx += 1
a = [0]
n.times do
  a << tokens[idx].to_i
  idx += 1
end

vals = a[1..].uniq.sort
m = vals.length
rank_of = {}
vals.each_with_index { |v, i| rank_of[v] = i + 1 }

lc = [0]
rc = [0]
cnt = [0]

update = lambda do |prev, pos, delta|
  l = 1
  r = m
  new_root = cnt.length
  cur = new_root
  loop do
    lc << lc[prev]
    rc << rc[prev]
    cnt << cnt[prev] + delta
    break if l == r
    mid = (l + r) / 2
    nxt = cnt.length
    if pos <= mid
      lc[cur] = nxt
      prev = lc[prev]
      r = mid
    else
      rc[cur] = nxt
      prev = rc[prev]
      l = mid + 1
    end
    cur = nxt
  end
  new_root
end

kth = lambda do |u, v, k|
  l = 1
  r = m
  while l < r
    mid = (l + r) / 2
    left_diff = cnt[lc[v]] - cnt[lc[u]]
    if k <= left_diff
      u = lc[u]
      v = lc[v]
      r = mid
    else
      k -= left_diff
      u = rc[u]
      v = rc[v]
      l = mid + 1
    end
  end
  l
end

roots = Array.new(n + 1, 0)
(1..n).each do |i|
  roots[i] = update.call(roots[i - 1], rank_of[a[i]], 1)
end

out = []
q.times do
  l = tokens[idx].to_i; idx += 1
  r = tokens[idx].to_i; idx += 1
  k = tokens[idx].to_i; idx += 1
  rank = kth.call(roots[l - 1], roots[r], k)
  out << vals[rank - 1].to_s
end
puts out.join("\\n")`,
  },
  practiceProblems: [
    {
      id: 'ch39-p1',
      tier: 'Warmup',
      ratingRange: '1700–1900',
      title: 'Range Queries and Copies (Versioned Point Set & Range Sum)',
      statement:
        'Maintain a list of integer arrays initially containing only Version 1 (given 1-indexed array A of length N). Process Q queries of 3 types: `1 k a x` (set index `a` to `x` inside version `k`—creating an updated state for version `k` without altering other versions), `2 k a b` (print the sum of `A[a..b]` in version `k`), and `3 k` (create a brand-new array version at the next sequential ID `2, 3, ...` as an exact copy of version `k`).',
      constraints: '1 <= N, Q <= 2 * 10^5, 1 <= x <= 10^9',
      sampleInput: '5 6\n2 3 1 2 5\n3 1\n2 1 1 5\n2 2 1 5\n1 2 2 5\n2 1 1 5\n2 2 1 5',
      sampleOutput: '13\n13\n13\n15',
      hints: [
        'Keep a vector `versionRoot` mapping each version ID `k` to its current root node index in the persistent arena!',
        'Type `3 k` simply executes `versionRoot.push_back(versionRoot[k])` in `O(1)` time and `O(1)` memory—Type `1 k a x` replaces `versionRoot[k] = update(versionRoot[k], 1, n, a, x)` in `O(log N)` without disturbing any cloned sibling!',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

struct PersistentSumTree {
    vector<int> lc, rc;
    vector<long long> sum;

    PersistentSumTree(int maxNodes) {
        lc.reserve(maxNodes);
        rc.reserve(maxNodes);
        sum.reserve(maxNodes);
        lc.push_back(0);
        rc.push_back(0);
        sum.push_back(0);
    }

    int newNode(int l, int r, long long s) {
        int id = (int)sum.size();
        lc.push_back(l);
        rc.push_back(r);
        sum.push_back(s);
        return id;
    }

    int build(int l, int r, const vector<long long>& a) {
        if (l == r) return newNode(0, 0, a[l]);
        int mid = l + (r - l) / 2;
        int L = build(l, mid, a);
        int R = build(mid + 1, r, a);
        return newNode(L, R, sum[L] + sum[R]);
    }

    int update(int prev, int l, int r, int pos, long long val) {
        if (l == r) return newNode(0, 0, val);
        int mid = l + (r - l) / 2;
        int L = lc[prev], R = rc[prev];
        if (pos <= mid) L = update(L, l, mid, pos, val);
        else R = update(R, mid + 1, r, pos, val);
        return newNode(L, R, sum[L] + sum[R]);
    }

    long long query(int node, int l, int r, int ql, int qr) const {
        if (!node || ql > r || qr < l) return 0;
        if (ql <= l && r <= qr) return sum[node];
        int mid = l + (r - l) / 2;
        return query(lc[node], l, mid, ql, qr) + query(rc[node], mid + 1, r, ql, qr);
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, q;
    if (!(cin >> n >> q)) return 0;
    vector<long long> a(n + 1);
    for (int i = 1; i <= n; i++) cin >> a[i];

    PersistentSumTree pst(2 * n + q * 22 + 10);
    vector<int> ver(2);
    ver[1] = pst.build(1, n, a);

    while (q--) {
        int type, k;
        cin >> type >> k;
        if (type == 1) {
            int pos;
            long long x;
            cin >> pos >> x;
            ver[k] = pst.update(ver[k], 1, n, pos, x);
        } else if (type == 2) {
            int l, r;
            cin >> l >> r;
            cout << pst.query(ver[k], 1, n, l, r) << "\\n";
        } else {
            ver.push_back(ver[k]);
        }
    }
    return 0;
}`,
        rust: `use std::io::{self, Read};

struct PersistentSumTree {
    lc: Vec<usize>,
    rc: Vec<usize>,
    sum: Vec<i64>,
}

impl PersistentSumTree {
    fn new(cap: usize) -> Self {
        let mut lc = Vec::with_capacity(cap);
        let mut rc = Vec::with_capacity(cap);
        let mut sum = Vec::with_capacity(cap);
        lc.push(0);
        rc.push(0);
        sum.push(0);
        Self { lc, rc, sum }
    }

    fn alloc(&mut self, l: usize, r: usize, s: i64) -> usize {
        let id = self.sum.len();
        self.lc.push(l);
        self.rc.push(r);
        self.sum.push(s);
        id
    }

    fn build(&mut self, l: usize, r: usize, a: &[i64]) -> usize {
        if l == r {
            return self.alloc(0, 0, a[l]);
        }
        let mid = l + (r - l) / 2;
        let left = self.build(l, mid, a);
        let right = self.build(mid + 1, r, a);
        let s = self.sum[left] + self.sum[right];
        self.alloc(left, right, s)
    }

    fn update(&mut self, prev: usize, l: usize, r: usize, pos: usize, val: i64) -> usize {
        if l == r {
            return self.alloc(0, 0, val);
        }
        let mid = l + (r - l) / 2;
        let mut left = self.lc[prev];
        let mut right = self.rc[prev];
        if pos <= mid {
            left = self.update(left, l, mid, pos, val);
        } else {
            right = self.update(right, mid + 1, r, pos, val);
        }
        let s = self.sum[left] + self.sum[right];
        self.alloc(left, right, s)
    }

    fn query(&self, node: usize, l: usize, r: usize, ql: usize, qr: usize) -> i64 {
        if node == 0 || ql > r || qr < l {
            return 0;
        }
        if ql <= l && r <= qr {
            return self.sum[node];
        }
        let mid = l + (r - l) / 2;
        self.query(self.lc[node], l, mid, ql, qr) + self.query(self.rc[node], mid + 1, r, ql, qr)
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

    let mut a = vec![0i64; n + 1];
    for i in 1..=n {
        a[i] = it.next().unwrap().parse().unwrap();
    }

    let mut pst = PersistentSumTree::new(2 * n + q * 22 + 10);
    let mut ver = vec![0usize, 0usize];
    ver[1] = pst.build(1, n, &a);

    let mut out = String::new();
    for _ in 0..q {
        let typ: i32 = it.next().unwrap().parse().unwrap();
        let k: usize = it.next().unwrap().parse().unwrap();
        if typ == 1 {
            let pos: usize = it.next().unwrap().parse().unwrap();
            let x: i64 = it.next().unwrap().parse().unwrap();
            ver[k] = pst.update(ver[k], 1, n, pos, x);
        } else if typ == 2 {
            let l: usize = it.next().unwrap().parse().unwrap();
            let r: usize = it.next().unwrap().parse().unwrap();
            out.push_str(&format!("{}\\n", pst.query(ver[k], 1, n, l, r)));
        } else {
            ver.push(ver[k]);
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
            long sign = 1;
            if (c == '-') { sign = -1; c = readByte(); }
            long res = 0;
            while (c > ' ') { res = res * 10 + (c - '0'); c = readByte(); }
            return res * sign;
        }
    }

    static int[] lc, rc;
    static long[] sum;
    static int ptr = 0;

    static int alloc(int l, int r, long s) {
        int id = ++ptr;
        lc[id] = l;
        rc[id] = r;
        sum[id] = s;
        return id;
    }

    static int build(int l, int r, long[] a) {
        if (l == r) return alloc(0, 0, a[l]);
        int mid = (l + r) >>> 1;
        int left = build(l, mid, a);
        int right = build(mid + 1, r, a);
        return alloc(left, right, sum[left] + sum[right]);
    }

    static int update(int prev, int l, int r, int pos, long val) {
        if (l == r) return alloc(0, 0, val);
        int mid = (l + r) >>> 1;
        int left = lc[prev], right = rc[prev];
        if (pos <= mid) left = update(left, l, mid, pos, val);
        else right = update(right, mid + 1, r, pos, val);
        return alloc(left, right, sum[left] + sum[right]);
    }

    static long query(int node, int l, int r, int ql, int qr) {
        if (node == 0 || ql > r || qr < l) return 0;
        if (ql <= l && r <= qr) return sum[node];
        int mid = (l + r) >>> 1;
        return query(lc[node], l, mid, ql, qr) + query(rc[node], mid + 1, r, ql, qr);
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        long nIn = fs.nextLong();
        if (nIn == Long.MIN_VALUE) return;
        int n = (int) nIn;
        int q = (int) fs.nextLong();

        long[] a = new long[n + 1];
        for (int i = 1; i <= n; i++) a[i] = fs.nextLong();

        int maxNodes = 2 * n + q * 22 + 10;
        lc = new int[maxNodes];
        rc = new int[maxNodes];
        sum = new long[maxNodes];

        List<Integer> ver = new ArrayList<>();
        ver.add(0);
        ver.add(build(1, n, a));

        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < q; i++) {
            int type = (int) fs.nextLong();
            int k = (int) fs.nextLong();
            if (type == 1) {
                int pos = (int) fs.nextLong();
                long x = fs.nextLong();
                ver.set(k, update(ver.get(k), 1, n, pos, x));
            } else if (type == 2) {
                int l = (int) fs.nextLong();
                int r = (int) fs.nextLong();
                sb.append(query(ver.get(k), 1, n, l, r)).append('\\n');
            } else {
                ver.add(ver.get(k));
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
    a = [0] + [int(next(it)) for _ in range(n)]

    lc = [0]
    rc = [0]
    tree_sum = [0]

    def build(l: int, r: int) -> int:
        if l == r:
            idx = len(tree_sum)
            lc.append(0)
            rc.append(0)
            tree_sum.append(a[l])
            return idx
        mid = (l + r) // 2
        left = build(l, mid)
        right = build(mid + 1, r)
        idx = len(tree_sum)
        lc.append(left)
        rc.append(right)
        tree_sum.append(tree_sum[left] + tree_sum[right])
        return idx

    def update(prev: int, l: int, r: int, pos: int, val: int) -> int:
        if l == r:
            idx = len(tree_sum)
            lc.append(0)
            rc.append(0)
            tree_sum.append(val)
            return idx
        mid = (l + r) // 2
        left, right = lc[prev], rc[prev]
        if pos <= mid:
            left = update(left, l, mid, pos, val)
        else:
            right = update(right, mid + 1, r, pos, val)
        idx = len(tree_sum)
        lc.append(left)
        rc.append(right)
        tree_sum.append(tree_sum[left] + tree_sum[right])
        return idx

    def query(node: int, ql: int, qr: int) -> int:
        total = 0
        stack = [(node, 1, n)]
        while stack:
            cur, l, r = stack.pop()
            if cur == 0 or ql > r or qr < l:
                continue
            if ql <= l and r <= qr:
                total += tree_sum[cur]
                continue
            mid = (l + r) // 2
            stack.append((lc[cur], l, mid))
            stack.append((rc[cur], mid + 1, r))
        return total

    ver = [0, build(1, n)]
    out = []
    for _ in range(q):
        typ = int(next(it))
        k = int(next(it))
        if typ == 1:
            pos = int(next(it))
            x = int(next(it))
            ver[k] = update(ver[k], 1, n, pos, x)
        elif typ == 2:
            l = int(next(it))
            r = int(next(it))
            out.append(str(query(ver[k], l, r)))
        else:
            ver.append(ver[k])
    sys.stdout.write("\\n".join(out) + "\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
idx = 0
n = tokens[idx].to_i; idx += 1
q = tokens[idx].to_i; idx += 1
a = [0]
n.times do
  a << tokens[idx].to_i
  idx += 1
end

lc = [0]
rc = [0]
tree_sum = [0]

build = lambda do |l, r|
  if l == r
    id = tree_sum.length
    lc << 0
    rc << 0
    tree_sum << a[l]
    return id
  end
  mid = (l + r) / 2
  left = build.call(l, mid)
  right = build.call(mid + 1, r)
  id = tree_sum.length
  lc << left
  rc << right
  tree_sum << (tree_sum[left] + tree_sum[right])
  id
end

update = lambda do |prev, l, r, pos, val|
  if l == r
    id = tree_sum.length
    lc << 0
    rc << 0
    tree_sum << val
    return id
  end
  mid = (l + r) / 2
  left = lc[prev]
  right = rc[prev]
  if pos <= mid
    left = update.call(left, l, mid, pos, val)
  else
    right = update.call(right, mid + 1, r, pos, val)
  end
  id = tree_sum.length
  lc << left
  rc << right
  tree_sum << (tree_sum[left] + tree_sum[right])
  id
end

query = lambda do |node, ql, qr|
  total = 0
  stack = [[node, 1, n]]
  until stack.empty?
    cur, l, r = stack.pop
    next if cur == 0 || ql > r || qr < l
    if ql <= l && r <= qr
      total += tree_sum[cur]
      next
    end
    mid = (l + r) / 2
    stack << [lc[cur], l, mid]
    stack << [rc[cur], mid + 1, r]
  end
  total
end

ver = [0, build.call(1, n)]
out = []
q.times do
  typ = tokens[idx].to_i; idx += 1
  k = tokens[idx].to_i; idx += 1
  if typ == 1
    pos = tokens[idx].to_i; idx += 1
    x = tokens[idx].to_i; idx += 1
    ver[k] = update.call(ver[k], 1, n, pos, x)
  elsif typ == 2
    l = tokens[idx].to_i; idx += 1
    r = tokens[idx].to_i; idx += 1
    out << query.call(ver[k], l, r).to_s
  else
    ver << ver[k]
  end
end
puts out.join("\\n")`,
      },
    },
    {
      id: 'ch39-p2',
      tier: 'Standard',
      ratingRange: '1900–2100',
      title: 'Static Range K-th Smallest Element (MKTHNUM) — Online Subarray Order Statistics',
      statement:
        'Given an array A of N integers and Q online queries `(L, R, K)` (where each query can depend on the previous answer via `XOR lastAns`, or standard 1-indexed `[L, R]`): find the K-th smallest number in the sorted multiset of subarray `A[L..R]`. We implement the fully online encrypted-query version (`L, R, K` XORed by `lastAns`, initialized at `0`, or pass raw `0`-XOR if unencrypted—here let us solve the standard `L R K` unencrypted static input so all sample test cases run out of the box while maintaining true online Persistent Segment Tree query execution!).',
      constraints: '1 <= N, Q <= 10^5, -10^9 <= A[i] <= 10^9, 1 <= L <= R <= N, 1 <= K <= R - L + 1',
      sampleInput: '7 3\n1 5 2 6 3 7 4\n2 5 3\n4 4 1\n1 7 3',
      sampleOutput: '5\n6\n3',
      hints: [
        'Coordinate-compress `A[1..N]` into sorted unique ranks `1..M`. Build prefix trees `root[i] = insert(root[i - 1], rank(A[i]), +1)`.',
        'Answer `(L, R, K)` online in `O(log M)` by descending `(u = root[L - 1], v = root[R])` in parallel and inspecting `leftDiff = cnt[lc[v]] - cnt[lc[u]]`!',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

struct PersistentFreqTree {
    vector<int> lc, rc, cnt;
    int ptr = 0;

    PersistentFreqTree(int maxNodes) : lc(maxNodes, 0), rc(maxNodes, 0), cnt(maxNodes, 0) {}

    int update(int prev, int l, int r, int pos) {
        int cur = ++ptr;
        lc[cur] = lc[prev];
        rc[cur] = rc[prev];
        cnt[cur] = cnt[prev] + 1;
        if (l < r) {
            int mid = l + (r - l) / 2;
            if (pos <= mid) lc[cur] = update(lc[prev], l, mid, pos);
            else rc[cur] = update(rc[prev], mid + 1, r, pos);
        }
        return cur;
    }

    int kth(int u, int v, int l, int r, int k) const {
        while (l < r) {
            int mid = l + (r - l) / 2;
            int leftDiff = cnt[lc[v]] - cnt[lc[u]];
            if (k <= leftDiff) {
                u = lc[u];
                v = lc[v];
                r = mid;
            } else {
                k -= leftDiff;
                u = rc[u];
                v = rc[v];
                l = mid + 1;
            }
        }
        return l;
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, q;
    if (!(cin >> n >> q)) return 0;
    vector<int> a(n + 1), vals(n);
    for (int i = 1; i <= n; i++) {
        cin >> a[i];
        vals[i - 1] = a[i];
    }
    sort(vals.begin(), vals.end());
    vals.erase(unique(vals.begin(), vals.end()), vals.end());
    int m = (int)vals.size();

    PersistentFreqTree pst((n + 2) * 20 + 5);
    vector<int> root(n + 1, 0);
    for (int i = 1; i <= n; i++) {
        int r = (int)(lower_bound(vals.begin(), vals.end(), a[i]) - vals.begin()) + 1;
        root[i] = pst.update(root[i - 1], 1, m, r);
    }

    while (q--) {
        int l, r, k;
        cin >> l >> r >> k;
        int rank = pst.kth(root[l - 1], root[r], 1, m, k);
        cout << vals[rank - 1] << "\\n";
    }
    return 0;
}`,
        rust: `use std::io::{self, Read};

struct Pst {
    lc: Vec<usize>,
    rc: Vec<usize>,
    cnt: Vec<i32>,
}

impl Pst {
    fn new(cap: usize) -> Self {
        let mut lc = Vec::with_capacity(cap);
        let mut rc = Vec::with_capacity(cap);
        let mut cnt = Vec::with_capacity(cap);
        lc.push(0);
        rc.push(0);
        cnt.push(0);
        Self { lc, rc, cnt }
    }

    fn update(&mut self, mut prev: usize, mut l: usize, mut r: usize, pos: usize) -> usize {
        let new_root = self.cnt.len();
        let mut cur = new_root;
        loop {
            self.lc.push(self.lc[prev]);
            self.rc.push(self.rc[prev]);
            self.cnt.push(self.cnt[prev] + 1);
            if l == r {
                break;
            }
            let mid = l + (r - l) / 2;
            let nxt = self.cnt.len();
            if pos <= mid {
                self.lc[cur] = nxt;
                prev = self.lc[prev];
                r = mid;
            } else {
                self.rc[cur] = nxt;
                prev = self.rc[prev];
                l = mid + 1;
            }
            cur = nxt;
        }
        new_root
    }

    fn kth(&self, mut u: usize, mut v: usize, mut l: usize, mut r: usize, mut k: i32) -> usize {
        while l < r {
            let mid = l + (r - l) / 2;
            let left_diff = self.cnt[self.lc[v]] - self.cnt[self.lc[u]];
            if k <= left_diff {
                u = self.lc[u];
                v = self.lc[v];
                r = mid;
            } else {
                k -= left_diff;
                u = self.rc[u];
                v = self.rc[v];
                l = mid + 1;
            }
        }
        l
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

    let mut a = vec![0i64; n + 1];
    let mut vals = Vec::with_capacity(n);
    for i in 1..=n {
        let x: i64 = it.next().unwrap().parse().unwrap();
        a[i] = x;
        vals.push(x);
    }
    vals.sort_unstable();
    vals.dedup();
    let m = vals.len();

    let mut pst = Pst::new((n + 2) * 20);
    let mut roots = vec![0usize; n + 1];
    for i in 1..=n {
        let rank = vals.binary_search(&a[i]).unwrap() + 1;
        roots[i] = pst.update(roots[i - 1], 1, m, rank);
    }

    let mut out = String::new();
    for _ in 0..q {
        let l: usize = it.next().unwrap().parse().unwrap();
        let r: usize = it.next().unwrap().parse().unwrap();
        let k: i32 = it.next().unwrap().parse().unwrap();
        let rank = pst.kth(roots[l - 1], roots[r], 1, m, k);
        out.push_str(&format!("{}\\n", vals[rank - 1]));
    }
    print!("{}", out);
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
        int nextInt() throws IOException {
            int c = readByte();
            while (c >= 0 && c <= ' ') c = readByte();
            if (c == -1) return Integer.MIN_VALUE;
            int sign = 1;
            if (c == '-') { sign = -1; c = readByte(); }
            int res = 0;
            while (c > ' ') { res = res * 10 + (c - '0'); c = readByte(); }
            return res * sign;
        }
    }

    static int[] lc, rc, cnt;
    static int ptr = 0;

    static int update(int prev, int l, int r, int pos) {
        int newRoot = ++ptr;
        int cur = newRoot;
        while (true) {
            lc[cur] = lc[prev];
            rc[cur] = rc[prev];
            cnt[cur] = cnt[prev] + 1;
            if (l == r) break;
            int mid = (l + r) >>> 1;
            int nxt = ++ptr;
            if (pos <= mid) {
                lc[cur] = nxt;
                prev = lc[prev];
                r = mid;
            } else {
                rc[cur] = nxt;
                prev = rc[prev];
                l = mid + 1;
            }
            cur = nxt;
        }
        return newRoot;
    }

    static int kth(int u, int v, int l, int r, int k) {
        while (l < r) {
            int mid = (l + r) >>> 1;
            int leftDiff = cnt[lc[v]] - cnt[lc[u]];
            if (k <= leftDiff) {
                u = lc[u];
                v = lc[v];
                r = mid;
            } else {
                k -= leftDiff;
                u = rc[u];
                v = rc[v];
                l = mid + 1;
            }
        }
        return l;
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        int n = fs.nextInt();
        if (n == Integer.MIN_VALUE) return;
        int q = fs.nextInt();

        int[] a = new int[n + 1];
        int[] sorted = new int[n];
        for (int i = 1; i <= n; i++) {
            a[i] = fs.nextInt();
            sorted[i - 1] = a[i];
        }
        Arrays.sort(sorted);
        int m = 0;
        for (int i = 0; i < n; i++) {
            if (i == 0 || sorted[i] != sorted[i - 1]) sorted[m++] = sorted[i];
        }

        int cap = (n + 2) * 20 + 5;
        lc = new int[cap];
        rc = new int[cap];
        cnt = new int[cap];

        int[] roots = new int[n + 1];
        for (int i = 1; i <= n; i++) {
            int rank = Arrays.binarySearch(sorted, 0, m, a[i]) + 1;
            roots[i] = update(roots[i - 1], 1, m, rank);
        }

        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < q; i++) {
            int l = fs.nextInt(), r = fs.nextInt(), k = fs.nextInt();
            int rank = kth(roots[l - 1], roots[r], 1, m, k);
            sb.append(sorted[rank - 1]).append('\\n');
        }
        System.out.print(sb);
    }
}`,
        python3: `import sys
from bisect import bisect_left

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    n = int(next(it))
    q = int(next(it))
    a = [0] + [int(next(it)) for _ in range(n)]

    vals = sorted(set(a[1:]))
    m = len(vals)
    lc, rc, cnt = [0], [0], [0]

    def update(prev: int, pos: int) -> int:
        l, r = 1, m
        new_root = len(cnt)
        cur = new_root
        while True:
            lc.append(lc[prev])
            rc.append(rc[prev])
            cnt.append(cnt[prev] + 1)
            if l == r:
                break
            mid = (l + r) // 2
            nxt = len(cnt)
            if pos <= mid:
                lc[cur] = nxt
                prev = lc[prev]
                r = mid
            else:
                rc[cur] = nxt
                prev = rc[prev]
                l = mid + 1
            cur = nxt
        return new_root

    def kth(u: int, v: int, k: int) -> int:
        l, r = 1, m
        while l < r:
            mid = (l + r) // 2
            left_diff = cnt[lc[v]] - cnt[lc[u]]
            if k <= left_diff:
                u = lc[u]
                v = lc[v]
                r = mid
            else:
                k -= left_diff
                u = rc[u]
                v = rc[v]
                l = mid + 1
        return l

    roots = [0] * (n + 1)
    for i in range(1, n + 1):
        rank = bisect_left(vals, a[i]) + 1
        roots[i] = update(roots[i - 1], rank)

    out = []
    for _ in range(q):
        l = int(next(it))
        r = int(next(it))
        k = int(next(it))
        rank = kth(roots[l - 1], roots[r], k)
        out.append(str(vals[rank - 1]))
    sys.stdout.write("\\n".join(out) + "\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
idx = 0
n = tokens[idx].to_i; idx += 1
q = tokens[idx].to_i; idx += 1
a = [0]
n.times do
  a << tokens[idx].to_i
  idx += 1
end

vals = a[1..].uniq.sort
m = vals.length
rank_of = {}
vals.each_with_index { |v, i| rank_of[v] = i + 1 }

lc = [0]
rc = [0]
cnt = [0]

update = lambda do |prev, pos|
  l = 1
  r = m
  new_root = cnt.length
  cur = new_root
  loop do
    lc << lc[prev]
    rc << rc[prev]
    cnt << (cnt[prev] + 1)
    break if l == r
    mid = (l + r) / 2
    nxt = cnt.length
    if pos <= mid
      lc[cur] = nxt
      prev = lc[prev]
      r = mid
    else
      rc[cur] = nxt
      prev = rc[prev]
      l = mid + 1
    end
    cur = nxt
  end
  new_root
end

kth = lambda do |u, v, k|
  l = 1
  r = m
  while l < r
    mid = (l + r) / 2
    left_diff = cnt[lc[v]] - cnt[lc[u]]
    if k <= left_diff
      u = lc[u]
      v = lc[v]
      r = mid
    else
      k -= left_diff
      u = rc[u]
      v = rc[v]
      l = mid + 1
    end
  end
  l
end

roots = Array.new(n + 1, 0)
(1..n).each { |i| roots[i] = update.call(roots[i - 1], rank_of[a[i]]) }

out = []
q.times do
  l = tokens[idx].to_i; idx += 1
  r = tokens[idx].to_i; idx += 1
  k = tokens[idx].to_i; idx += 1
  out << vals[kth.call(roots[l - 1], roots[r], k) - 1].to_s
end
puts out.join("\\n")`,
      },
    },
    {
      id: 'ch39-p3',
      tier: 'Boss',
      ratingRange: '2100–2400',
      title: 'Online Tree-Path K-th Smallest Weight (COT) via Persistent SegTree + LCA',
      statement:
        'Given a tree with N vertices where each vertex i has integer weight W[i], answer Q online queries `(u, v, k)`: find the k-th smallest vertex weight along the unique simple path between `u` and `v` (inclusive). Additionally, understand how replacing parent-prefix frequency trees with last-occurrence position trees solves online Range Distinct Elements!',
      constraints: '1 <= N, Q <= 10^5, -10^9 <= W[i] <= 10^9, 1 <= k <= path_length(u, v)',
      sampleInput: '8 5\n105 2 9 3 8 5 7 7\n1 2\n1 3\n1 4\n3 5\n3 6\n3 7\n4 8\n2 5 1\n2 5 2\n2 5 3\n2 5 4\n7 8 2',
      sampleOutput: '2\n8\n9\n105\n7',
      hints: [
        'Run a BFS/iterative DFS from root `1`: set `root[u] = update(root[par[u]], rank(W[u]))` and precompute binary-lifting table `up[j][u]` and `depth[u]`.',
        'For query `(u, v, k)`, let `w = lca(u, v)` and `pw = up[0][w]`. Notice `root[pw]` is `0` when `w == 1`! Descend 4 pointers `(uPtr, vPtr, wPtr, pwPtr)` simultaneously using `leftDiff = cnt[lc[uPtr]] + cnt[lc[vPtr]] - cnt[lc[wPtr]] - cnt[lc[pwPtr]]`!',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

// SPOJ COT: Online K-th Smallest on Tree Path via Persistent SegTree + Binary Lifting LCA
struct PstArena {
    vector<int> lc, rc, cnt;
    int ptr = 0;

    PstArena(int maxNodes) : lc(maxNodes, 0), rc(maxNodes, 0), cnt(maxNodes, 0) {}

    int update(int prev, int l, int r, int pos) {
        int cur = ++ptr;
        lc[cur] = lc[prev];
        rc[cur] = rc[prev];
        cnt[cur] = cnt[prev] + 1;
        if (l < r) {
            int mid = l + (r - l) / 2;
            if (pos <= mid) lc[cur] = update(lc[prev], l, mid, pos);
            else rc[cur] = update(rc[prev], mid + 1, r, pos);
        }
        return cur;
    }

    int kthPath(int u, int v, int w, int pw, int l, int r, int k) const {
        while (l < r) {
            int mid = l + (r - l) / 2;
            int leftDiff = cnt[lc[u]] + cnt[lc[v]] - cnt[lc[w]] - cnt[lc[pw]];
            if (k <= leftDiff) {
                u = lc[u];
                v = lc[v];
                w = lc[w];
                pw = lc[pw];
                r = mid;
            } else {
                k -= leftDiff;
                u = rc[u];
                v = rc[v];
                w = rc[w];
                pw = rc[pw];
                l = mid + 1;
            }
        }
        return l;
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, q;
    if (!(cin >> n >> q)) return 0;
    vector<int> w(n + 1), vals(n);
    for (int i = 1; i <= n; i++) {
        cin >> w[i];
        vals[i - 1] = w[i];
    }
    sort(vals.begin(), vals.end());
    vals.erase(unique(vals.begin(), vals.end()), vals.end());
    int m = (int)vals.size();

    vector<vector<int>> adj(n + 1);
    for (int i = 0; i < n - 1; i++) {
        int u, v;
        cin >> u >> v;
        adj[u].push_back(v);
        adj[v].push_back(u);
    }

    const int LOG = 18;
    vector<vector<int>> up(LOG, vector<int>(n + 1, 0));
    vector<int> depth(n + 1, 0), root(n + 1, 0);
    PstArena pst((n + 2) * 20 + 5);

    // Iterative BFS builds parent links & persistent segment trees safely in topological order
    vector<int> que = {1};
    up[0][1] = 0;
    depth[1] = 1;
    for (size_t head = 0; head < que.size(); head++) {
        int u = que[head];
        int p = up[0][u];
        int rank = (int)(lower_bound(vals.begin(), vals.end(), w[u]) - vals.begin()) + 1;
        root[u] = pst.update(root[p], 1, m, rank);
        for (int j = 1; j < LOG; j++) up[j][u] = up[j - 1][up[j - 1][u]];
        for (int v : adj[u]) {
            if (v != p) {
                up[0][v] = u;
                depth[v] = depth[u] + 1;
                que.push_back(v);
            }
        }
    }

    auto lca = [&](int u, int v) {
        if (depth[u] < depth[v]) swap(u, v);
        int diff = depth[u] - depth[v];
        for (int j = 0; j < LOG; j++) {
            if ((diff >> j) & 1) u = up[j][u];
        }
        if (u == v) return u;
        for (int j = LOG - 1; j >= 0; j--) {
            if (up[j][u] != up[j][v]) {
                u = up[j][u];
                v = up[j][v];
            }
        }
        return up[0][u];
    };

    while (q--) {
        int u, v, k;
        cin >> u >> v >> k;
        int anc = lca(u, v);
        int panc = up[0][anc];
        int rank = pst.kthPath(root[u], root[v], root[anc], root[panc], 1, m, k);
        cout << vals[rank - 1] << "\\n";
    }
    return 0;
}`,
        rust: `use std::collections::VecDeque;
use std::io::{self, Read};

struct PstArena {
    lc: Vec<usize>,
    rc: Vec<usize>,
    cnt: Vec<i32>,
}

impl PstArena {
    fn new(cap: usize) -> Self {
        let mut lc = Vec::with_capacity(cap);
        let mut rc = Vec::with_capacity(cap);
        let mut cnt = Vec::with_capacity(cap);
        lc.push(0);
        rc.push(0);
        cnt.push(0);
        Self { lc, rc, cnt }
    }

    fn update(&mut self, mut prev: usize, mut l: usize, mut r: usize, pos: usize) -> usize {
        let new_root = self.cnt.len();
        let mut cur = new_root;
        loop {
            self.lc.push(self.lc[prev]);
            self.rc.push(self.rc[prev]);
            self.cnt.push(self.cnt[prev] + 1);
            if l == r {
                break;
            }
            let mid = l + (r - l) / 2;
            let nxt = self.cnt.len();
            if pos <= mid {
                self.lc[cur] = nxt;
                prev = self.lc[prev];
                r = mid;
            } else {
                self.rc[cur] = nxt;
                prev = self.rc[prev];
                l = mid + 1;
            }
            cur = nxt;
        }
        new_root
    }

    fn kth_path(
        &self,
        mut u: usize,
        mut v: usize,
        mut w: usize,
        mut pw: usize,
        mut l: usize,
        mut r: usize,
        mut k: i32,
    ) -> usize {
        while l < r {
            let mid = l + (r - l) / 2;
            let left_diff =
                self.cnt[self.lc[u]] + self.cnt[self.lc[v]] - self.cnt[self.lc[w]] - self.cnt[self.lc[pw]];
            if k <= left_diff {
                u = self.lc[u];
                v = self.lc[v];
                w = self.lc[w];
                pw = self.lc[pw];
                r = mid;
            } else {
                k -= left_diff;
                u = self.rc[u];
                v = self.rc[v];
                w = self.rc[w];
                pw = self.rc[pw];
                l = mid + 1;
            }
        }
        l
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

    let mut w = vec![0i64; n + 1];
    let mut vals = Vec::with_capacity(n);
    for i in 1..=n {
        let x: i64 = it.next().unwrap().parse().unwrap();
        w[i] = x;
        vals.push(x);
    }
    vals.sort_unstable();
    vals.dedup();
    let m = vals.len();

    let mut adj = vec![Vec::new(); n + 1];
    for _ in 0..n - 1 {
        let u: usize = it.next().unwrap().parse().unwrap();
        let v: usize = it.next().unwrap().parse().unwrap();
        adj[u].push(v);
        adj[v].push(u);
    }

    const LOG: usize = 18;
    let mut up = vec![vec![0usize; n + 1]; LOG];
    let mut depth = vec![0usize; n + 1];
    let mut root = vec![0usize; n + 1];
    let mut pst = PstArena::new((n + 2) * 20);

    let mut que = VecDeque::new();
    depth[1] = 1;
    que.push_back(1usize);
    while let Some(u) = que.pop_front() {
        let p = up[0][u];
        let rank = vals.binary_search(&w[u]).unwrap() + 1;
        root[u] = pst.update(root[p], 1, m, rank);
        for j in 1..LOG {
            up[j][u] = up[j - 1][up[j - 1][u]];
        }
        for &v in &adj[u] {
            if v != p {
                up[0][v] = u;
                depth[v] = depth[u] + 1;
                que.push_back(v);
            }
        }
    }

    let lca = |mut u: usize, mut v: usize| -> usize {
        if depth[u] < depth[v] {
            std::mem::swap(&mut u, &mut v);
        }
        let diff = depth[u] - depth[v];
        for j in 0..LOG {
            if (diff >> j) & 1 == 1 {
                u = up[j][u];
            }
        }
        if u == v {
            return u;
        }
        for j in (0..LOG).rev() {
            if up[j][u] != up[j][v] {
                u = up[j][u];
                v = up[j][v];
            }
        }
        up[0][u]
    };

    let mut out = String::new();
    for _ in 0..q {
        let u: usize = it.next().unwrap().parse().unwrap();
        let v: usize = it.next().unwrap().parse().unwrap();
        let k: i32 = it.next().unwrap().parse().unwrap();
        let anc = lca(u, v);
        let panc = up[0][anc];
        let rank = pst.kth_path(root[u], root[v], root[anc], root[panc], 1, m, k);
        out.push_str(&format!("{}\\n", vals[rank - 1]));
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
            int sign = 1;
            if (c == '-') { sign = -1; c = readByte(); }
            int res = 0;
            while (c > ' ') { res = res * 10 + (c - '0'); c = readByte(); }
            return res * sign;
        }
    }

    static int[] lc, rc, cnt;
    static int ptr = 0;

    static int update(int prev, int l, int r, int pos) {
        int newRoot = ++ptr;
        int cur = newRoot;
        while (true) {
            lc[cur] = lc[prev];
            rc[cur] = rc[prev];
            cnt[cur] = cnt[prev] + 1;
            if (l == r) break;
            int mid = (l + r) >>> 1;
            int nxt = ++ptr;
            if (pos <= mid) {
                lc[cur] = nxt;
                prev = lc[prev];
                r = mid;
            } else {
                rc[cur] = nxt;
                prev = rc[prev];
                l = mid + 1;
            }
            cur = nxt;
        }
        return newRoot;
    }

    static int kthPath(int u, int v, int w, int pw, int l, int r, int k) {
        while (l < r) {
            int mid = (l + r) >>> 1;
            int leftDiff = cnt[lc[u]] + cnt[lc[v]] - cnt[lc[w]] - cnt[lc[pw]];
            if (k <= leftDiff) {
                u = lc[u]; v = lc[v]; w = lc[w]; pw = lc[pw];
                r = mid;
            } else {
                k -= leftDiff;
                u = rc[u]; v = rc[v]; w = rc[w]; pw = rc[pw];
                l = mid + 1;
            }
        }
        return l;
    }

    static final int LOG = 18;
    static int[][] up;
    static int[] depth;

    static int lca(int u, int v) {
        if (depth[u] < depth[v]) { int t = u; u = v; v = t; }
        int diff = depth[u] - depth[v];
        for (int j = 0; j < LOG; j++) if (((diff >> j) & 1) == 1) u = up[j][u];
        if (u == v) return u;
        for (int j = LOG - 1; j >= 0; j--) {
            if (up[j][u] != up[j][v]) {
                u = up[j][u];
                v = up[j][v];
            }
        }
        return up[0][u];
    }

    @SuppressWarnings("unchecked")
    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        int n = fs.nextInt();
        if (n == Integer.MIN_VALUE) return;
        int q = fs.nextInt();

        int[] w = new int[n + 1];
        int[] sorted = new int[n];
        for (int i = 1; i <= n; i++) {
            w[i] = fs.nextInt();
            sorted[i - 1] = w[i];
        }
        Arrays.sort(sorted);
        int m = 0;
        for (int i = 0; i < n; i++) {
            if (i == 0 || sorted[i] != sorted[i - 1]) sorted[m++] = sorted[i];
        }

        List<Integer>[] adj = new ArrayList[n + 1];
        for (int i = 1; i <= n; i++) adj[i] = new ArrayList<>();
        for (int i = 0; i < n - 1; i++) {
            int u = fs.nextInt(), v = fs.nextInt();
            adj[u].add(v);
            adj[v].add(u);
        }

        int cap = (n + 2) * 20 + 5;
        lc = new int[cap];
        rc = new int[cap];
        cnt = new int[cap];
        up = new int[LOG][n + 1];
        depth = new int[n + 1];
        int[] root = new int[n + 1];

        int[] que = new int[n];
        int qh = 0, qt = 0;
        que[qt++] = 1;
        depth[1] = 1;
        while (qh < qt) {
            int u = que[qh++];
            int p = up[0][u];
            int rank = Arrays.binarySearch(sorted, 0, m, w[u]) + 1;
            root[u] = update(root[p], 1, m, rank);
            for (int j = 1; j < LOG; j++) up[j][u] = up[j - 1][up[j - 1][u]];
            for (int v : adj[u]) {
                if (v != p) {
                    up[0][v] = u;
                    depth[v] = depth[u] + 1;
                    que[qt++] = v;
                }
            }
        }

        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < q; i++) {
            int u = fs.nextInt(), v = fs.nextInt(), k = fs.nextInt();
            int anc = lca(u, v);
            int panc = up[0][anc];
            int rank = kthPath(root[u], root[v], root[anc], root[panc], 1, m, k);
            sb.append(sorted[rank - 1]).append('\\n');
        }
        System.out.print(sb);
    }
}`,
        python3: `import sys
from bisect import bisect_left
from collections import deque

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    n = int(next(it))
    q = int(next(it))
    w = [0] + [int(next(it)) for _ in range(n)]

    vals = sorted(set(w[1:]))
    m = len(vals)

    adj = [[] for _ in range(n + 1)]
    for _ in range(n - 1):
        u = int(next(it))
        v = int(next(it))
        adj[u].append(v)
        adj[v].append(u)

    lc, rc, cnt = [0], [0], [0]

    def update(prev: int, pos: int) -> int:
        l, r = 1, m
        new_root = len(cnt)
        cur = new_root
        while True:
            lc.append(lc[prev])
            rc.append(rc[prev])
            cnt.append(cnt[prev] + 1)
            if l == r:
                break
            mid = (l + r) // 2
            nxt = len(cnt)
            if pos <= mid:
                lc[cur] = nxt
                prev = lc[prev]
                r = mid
            else:
                rc[cur] = nxt
                prev = rc[prev]
                l = mid + 1
            cur = nxt
        return new_root

    LOG = 18
    up = [[0] * (n + 1) for _ in range(LOG)]
    depth = [0] * (n + 1)
    root = [0] * (n + 1)

    que = deque([1])
    depth[1] = 1
    while que:
        u = que.popleft()
        p = up[0][u]
        rank = bisect_left(vals, w[u]) + 1
        root[u] = update(root[p], rank)
        for j in range(1, LOG):
            up[j][u] = up[j - 1][up[j - 1][u]]
        for v in adj[u]:
            if v != p:
                up[0][v] = u
                depth[v] = depth[u] + 1
                que.append(v)

    def lca(u: int, v: int) -> int:
        if depth[u] < depth[v]:
            u, v = v, u
        diff = depth[u] - depth[v]
        for j in range(LOG):
            if (diff >> j) & 1:
                u = up[j][u]
        if u == v:
            return u
        for j in range(LOG - 1, -1, -1):
            if up[j][u] != up[j][v]:
                u = up[j][u]
                v = up[j][v]
        return up[0][u]

    def kth_path(u_ptr: int, v_ptr: int, w_ptr: int, pw_ptr: int, k: int) -> int:
        l, r = 1, m
        while l < r:
            mid = (l + r) // 2
            left_diff = cnt[lc[u_ptr]] + cnt[lc[v_ptr]] - cnt[lc[w_ptr]] - cnt[lc[pw_ptr]]
            if k <= left_diff:
                u_ptr = lc[u_ptr]
                v_ptr = lc[v_ptr]
                w_ptr = lc[w_ptr]
                pw_ptr = lc[pw_ptr]
                r = mid
            else:
                k -= left_diff
                u_ptr = rc[u_ptr]
                v_ptr = rc[v_ptr]
                w_ptr = rc[w_ptr]
                pw_ptr = rc[pw_ptr]
                l = mid + 1
        return l

    out = []
    for _ in range(q):
        u = int(next(it))
        v = int(next(it))
        k = int(next(it))
        anc = lca(u, v)
        panc = up[0][anc]
        rank = kth_path(root[u], root[v], root[anc], root[panc], k)
        out.append(str(vals[rank - 1]))
    sys.stdout.write("\\n".join(out) + "\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
idx = 0
n = tokens[idx].to_i; idx += 1
q = tokens[idx].to_i; idx += 1
w = [0]
n.times do
  w << tokens[idx].to_i
  idx += 1
end

vals = w[1..].uniq.sort
m = vals.length
rank_of = {}
vals.each_with_index { |v, i| rank_of[v] = i + 1 }

adj = Array.new(n + 1) { [] }
(n - 1).times do
  u = tokens[idx].to_i; idx += 1
  v = tokens[idx].to_i; idx += 1
  adj[u] << v
  adj[v] << u
end

lc = [0]
rc = [0]
cnt = [0]

update = lambda do |prev, pos|
  l = 1
  r = m
  new_root = cnt.length
  cur = new_root
  loop do
    lc << lc[prev]
    rc << rc[prev]
    cnt << (cnt[prev] + 1)
    break if l == r
    mid = (l + r) / 2
    nxt = cnt.length
    if pos <= mid
      lc[cur] = nxt
      prev = lc[prev]
      r = mid
    else
      rc[cur] = nxt
      prev = rc[prev]
      l = mid + 1
    end
    cur = nxt
  end
  new_root
end

LOG = 18
up = Array.new(LOG) { Array.new(n + 1, 0) }
depth = Array.new(n + 1, 0)
root = Array.new(n + 1, 0)

que = [1]
depth[1] = 1
head = 0
while head < que.length
  u = que[head]; head += 1
  p = up[0][u]
  root[u] = update.call(root[p], rank_of[w[u]])
  (1...LOG).each { |j| up[j][u] = up[j - 1][up[j - 1][u]] }
  adj[u].each do |v|
    next if v == p
    up[0][v] = u
    depth[v] = depth[u] + 1
    que << v
  end
end

lca = lambda do |u, v|
  u, v = v, u if depth[u] < depth[v]
  diff = depth[u] - depth[v]
  LOG.times { |j| u = up[j][u] if ((diff >> j) & 1) == 1 }
  return u if u == v
  (LOG - 1).downto(0) do |j|
    if up[j][u] != up[j][v]
      u = up[j][u]
      v = up[j][v]
    end
  end
  up[0][u]
end

kth_path = lambda do |u_p, v_p, w_p, pw_p, k|
  l = 1
  r = m
  while l < r
    mid = (l + r) / 2
    left_diff = cnt[lc[u_p]] + cnt[lc[v_p]] - cnt[lc[w_p]] - cnt[lc[pw_p]]
    if k <= left_diff
      u_p = lc[u_p]; v_p = lc[v_p]; w_p = lc[w_p]; pw_p = lc[pw_p]
      r = mid
    else
      k -= left_diff
      u_p = rc[u_p]; v_p = rc[v_p]; w_p = rc[w_p]; pw_p = rc[pw_p]
      l = mid + 1
    end
  end
  l
end

out = []
q.times do
  u = tokens[idx].to_i; idx += 1
  v = tokens[idx].to_i; idx += 1
  k = tokens[idx].to_i; idx += 1
  anc = lca.call(u, v)
  panc = up[0][anc]
  rank = kth_path.call(root[u], root[v], root[anc], root[panc], k)
  out << vals[rank - 1].to_s
end
puts out.join("\\n")`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'CSES',
      title: 'Range Queries and Copies',
      difficulty: 'Hard',
      url: 'https://cses.fi/problemset/task/1737',
      patternNote: 'Direct persistent segment tree version cloning & point-update / range-sum benchmark.',
    },
    {
      platform: 'Codeforces',
      title: 'Army Creation (CF 813E)',
      difficulty: '2200',
      url: 'https://codeforces.com/problemset/problem/813/E',
      patternNote: 'Online K-limited distinct element query via persistent segment tree over k-th previous positions.',
    },
    {
      platform: 'AtCoder',
      title: 'ABC 253 F - Operations on a Matrix (or Persistent K-th)',
      difficulty: '2000',
      url: 'https://atcoder.jp/contests/abc253/tasks/abc253_f',
      patternNote: 'Historical snapshot / time-travel query reduction.',
    },
    {
      platform: 'CodeChef',
      title: 'QUERY - Tree Persistent Queries',
      difficulty: 'Hard',
      url: 'https://www.codechef.com/problems/QUERY',
      patternNote: 'Persistent segment trees layered over Heavy-Light Decomposition for online rollback & path sums.',
    },
    {
      platform: 'HackerRank',
      title: 'Subtrees And Paths / Persistent Order Statistics',
      difficulty: 'Hard',
      url: 'https://www.hackerrank.com/domains/data-structures',
      patternNote: 'Parallel pointer descent across difference of persistent prefix trees.',
    },
    {
      platform: 'NeetCode 150',
      title: 'Time Based Key-Value Store (Snapshot Extension)',
      difficulty: 'Medium / System',
      url: 'https://neetcode.io/problems/time-based-key-value-store',
      patternNote: 'Copy-on-write persistent segment trees generalize single-key timestamp logs to full range aggregates!',
    },
  ],
  interviewNotes: [
    'Explain clearly why Path Copying achieves `O(log N)` space per edit: a binary tree of height `H = ceil(log2 N)` only modifies nodes along one root-to-leaf path, leaving `N - 1` sibling subtrees structurally shared and immutable.',
    'Highlight that persistent trees allow lock-free snapshot isolation in databases (MVCC / LMDB / B-tree copy-on-write): readers hold an older `root[t]` pointer and never block writers creating `root[t + 1]`.',
    'Know when to swap Persistent Segment Trees for a Wavelet Tree (`O(N log V)` memory with tiny constant factor) vs when persistence is strictly mandatory (nonlinear version DAGs, branching timelines, or dynamic point edits per version).',
  ],
  projectBlueprint: {
    title: 'Immutable Time-Travel Financial Ledger & Snapshot Query Engine',
    tagline:
      'Build a zero-copy versioned account-balance store supporting instant transaction commits, arbitrary rollback snapshots, range balance audits, and K-th percentile account queries at any past commit ID.',
    stackSummary: 'C++20 Flat-Arena Persistent SegTree Engine, Transaction Commit Log, Binary-Walk Percentile Auditor',
    asciiDiagram: `Commit t=0: [Root_0] -> {Acct1: 100, Acct2: 250, Acct3: 500, Acct4: 900}
               \\ (Edit Acct3 += 150 -> copies ONLY 3 nodes!)
Commit t=1: [Root_1] --> shares Left Subtree of Root_0 (Acct1, Acct2 zero-copy!)
                     \\-> new Right Subtree -> new Leaf Acct3 = 650

Audit Query(t=0, range=[1..4]): O(log N) -> 1750 (exact pre-edit snapshot!)
Audit Query(t=1, range=[1..4]): O(log N) -> 1900 (lock-free, zero mutexes!)`,
    milestones: [
      {
        id: 'm1',
        title: '1. Flat-Arena Copy-on-Write Node Allocator',
        detail: 'Implement cache-friendly integer-indexed `lc[]`, `rc[]`, `sum[]` pools with zero heap fragmentation.',
      },
      {
        id: 'm2',
        title: '2. Atomic Commit & Branch Snapshot API',
        detail: 'Expose `commitEdit(baseVersion, accountId, delta)` and `forkBranch(version)` in `O(1)` / `O(log N)`.',
      },
      {
        id: 'm3',
        title: '3. Parallel-Descent Historical Auditor',
        detail: 'Verify invariant conservation across commits and support `O(log N)` delta queries between any two snapshots.',
      },
    ],
    starterCode: `#include <bits/stdc++.h>
using namespace std;

// Immutable Time-Travel Financial Ledger Engine (Copy-on-Write Persistent SegTree)
class TimeTravelLedger {
    int n;
    vector<int> lc, rc, versions;
    vector<long long> totalBalance;

    int alloc(int l, int r, long long bal) {
        int id = (int)totalBalance.size();
        lc.push_back(l);
        rc.push_back(r);
        totalBalance.push_back(bal);
        return id;
    }

    int build(int l, int r, const vector<long long>& init) {
        if (l == r) return alloc(0, 0, init[l]);
        int mid = (l + r) / 2;
        int L = build(l, mid, init), R = build(mid + 1, r, init);
        return alloc(L, R, totalBalance[L] + totalBalance[R]);
    }

    int updateNode(int prev, int l, int r, int acct, long long delta) {
        if (l == r) return alloc(0, 0, totalBalance[prev] + delta);
        int mid = (l + r) / 2;
        int L = lc[prev], R = rc[prev];
        if (acct <= mid) L = updateNode(L, l, mid, acct, delta);
        else R = updateNode(R, mid + 1, r, acct, delta);
        return alloc(L, R, totalBalance[L] + totalBalance[R]);
    }

    long long queryNode(int node, int l, int r, int ql, int qr) const {
        if (!node || ql > r || qr < l) return 0;
        if (ql <= l && r <= qr) return totalBalance[node];
        int mid = (l + r) / 2;
        return queryNode(lc[node], l, mid, ql, qr) + queryNode(rc[node], mid + 1, r, ql, qr);
    }

public:
    TimeTravelLedger(const vector<long long>& initialBalances) : n((int)initialBalances.size() - 1) {
        lc.push_back(0); rc.push_back(0); totalBalance.push_back(0);
        versions.push_back(build(1, n, initialBalances));
    }

    int commitDelta(int baseVersion, int acct, long long delta) {
        int newRoot = updateNode(versions[baseVersion], 1, n, acct, delta);
        versions.push_back(newRoot);
        return (int)versions.size() - 1;
    }

    long long auditRange(int version, int l, int r) const {
        return queryNode(versions[version], 1, n, l, r);
    }

    size_t nodeCount() const { return totalBalance.size() - 1; }
};

int main() {
    TimeTravelLedger ledger({0, 1000, 2500, 5000, 9000}); // Accounts 1..4
    int v1 = ledger.commitDelta(0, 2, +750);  // Acct 2: 2500 -> 3250
    int v2 = ledger.commitDelta(v1, 4, -1200); // Acct 4: 9000 -> 7800
    int vBranch = ledger.commitDelta(0, 1, +500); // Fork from v0!

    cout << "v0 Total [1..4]: " << ledger.auditRange(0, 1, 4) << "\\n";
    cout << "v2 Total [1..4]: " << ledger.auditRange(v2, 1, 4) << "\\n";
    cout << "Branch from v0 [1..2]: " << ledger.auditRange(vBranch, 1, 2) << "\\n";
    cout << "Total Nodes Allocated Across 4 Versions: " << ledger.nodeCount() << "\\n";
    return 0;
}`,
  },
};
