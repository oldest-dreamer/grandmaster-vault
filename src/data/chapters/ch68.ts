import type { TheoryChapter } from '../../types/vault';

export const CH68_HALL_DILWORTH_PLANAR_DUALITY: TheoryChapter = {
  slug: 'hall-marriage-dilworth-combinatorial',
  topicId: 'th-79',
  title: 'Hall’s Marriage, Dilworth’s Theorem & Planar Duality',
  domain: 'Theoretical & Randomized',
  ratingTier: '2200–2600',
  usacoDivision: 'Platinum',
  subtitle: 'Interval-compressed Hall conditions via lazy segment trees, poset chain duality, and planar s-t min-cuts via dual Dijkstra',
  analogyTitle: 'Certifying Feasibility Without Flow & Walking Across Walls Instead of Along Roads',
  analogyBody:
    'Many 2200–2600 problems look like network flow or matching problems on 2 x 10^5 vertices—far too large for O(E sqrt(V)) Dinic or Hopcroft-Karp. Three classical duality theorems let you bypass explicit flow construction entirely:\n\n1. Hall’s Marriage Theorem states that a bipartite assignment exists if and only if every subset S satisfies |N(S)| >= |S|. When every left vertex connects to a contiguous interval [l_i, r_i] of right slots, only contiguous target ranges [A, B] can ever be the tightest bottleneck, collapsing 2^N subset checks into a single O((N + M) log M) sweep with a lazy segment tree.\n\n2. Dilworth’s Theorem states that in any finite partially ordered set (poset), the minimum number of chains needed to partition all elements equals the maximum size of an antichain (pairwise incomparable elements). For 2D dominance (x_a <= x_b and y_a <= y_b), this reduces multi-chain scheduling to a single O(N log N) Longest Strictly Decreasing Subsequence.\n\n3. Planar Graph Duality transforms every s-t minimum cut inside a planar graph into a shortest path between two outer faces S* and T* in the dual graph—replacing O(V^2 E) max-flow on a 500 x 500 grid with a standard O(RC log(RC)) Dijkstra.',
  prerequisites: [
    { slug: 'bipartite-matching-hopcroft-karp', title: 'Bipartite Matching, Konig Theorem & Hopcroft-Karp' },
  ],
  traceTitle: 'Sweeping Hall’s Contiguous Bottleneck Condition',
  traceSubtitle: 'Testing whether 3 interval tasks can fit into 3 slots with capacities c = [1, 1, 2]',
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Initialize Sweep at B = 1',
      explanation: 'At right endpoint B = 1, subtract c[1] = 1 from prefix [1..1]. No task has r_i == 1. Max deficit over A in [1..1] is -1 <= 0.',
      mode: 'array',
      arrays: [
        {
          name: 'D(A, B) = demand([A,B]) - cap([A,B])',
          cells: [
            { index: 1, value: -1, label: 'A=1', highlight: 'active' },
            { index: 2, value: 0, label: 'unused', highlight: 'neutral' },
            { index: 3, value: 0, label: 'unused', highlight: 'neutral' },
          ],
        },
      ],
      variables: { B: 1, slotCap: 1, maxDeficit: -1, hallStatus: 'OK' },
    },
    {
      stepNumber: 2,
      title: 'Advance to B = 2 & Insert Task [1, 2] (w = 1)',
      explanation: 'Subtract c[2] = 1 across [1..2], yielding [-2, -1]. Task [1, 2] ends at B = 2 and lies inside [A, 2] iff A <= 1, so add +1 on [1..1]. Max deficit over [1..2] is -1 <= 0.',
      mode: 'array',
      arrays: [
        {
          name: 'D(A, B) for B = 2',
          cells: [
            { index: 1, value: -1, label: 'A=1', highlight: 'updated' },
            { index: 2, value: -1, label: 'A=2', highlight: 'active' },
            { index: 3, value: 0, label: 'unused', highlight: 'neutral' },
          ],
        },
      ],
      variables: { B: 2, addedTask: '[1,2]:w=1', maxDeficit: -1, hallStatus: 'OK' },
    },
    {
      stepNumber: 3,
      title: 'Advance to B = 3 & Insert Tasks [1, 3] and [2, 3]',
      explanation: 'Subtract c[3] = 2 on [1..3] -> [-3, -3, -2]. Add +1 to [1..1] for [1, 3], then +1 to [1..2] for [2, 3] -> [-1, -2, -2]. Global max deficit stays <= 0 -> YES.',
      mode: 'array',
      arrays: [
        {
          name: 'D(A, B) for B = 3',
          cells: [
            { index: 1, value: -1, label: 'A=1', highlight: 'updated' },
            { index: 2, value: -2, label: 'A=2', highlight: 'updated' },
            { index: 3, value: -2, label: 'A=3', highlight: 'active' },
          ],
        },
      ],
      variables: { B: 3, maxDeficit: -1, hallStatus: 'YES' },
    },
    {
      stepNumber: 4,
      title: 'Counterexample Tight Bottleneck (c=[1,1,2], demand [1,2]:2, [2,2]:1)',
      explanation: 'When tasks inside [1, 2] total w = 3 while c[1] + c[2] = 2, D(1, 2) spikes to +1 > 0 at B = 2, proving a Hall violation immediately.',
      mode: 'array',
      arrays: [
        {
          name: 'Violated D(A, 2)',
          cells: [
            { index: 1, value: 1, label: 'A=1 (>0!)', highlight: 'active' },
            { index: 2, value: 0, label: 'A=2', highlight: 'neutral' },
            { index: 3, value: 0, label: 'unused', highlight: 'neutral' },
          ],
        },
      ],
      variables: { B: 2, maxDeficit: 1, hallStatus: 'NO (Hall Violated)' },
    },
  ],
  reductionClues: [
    {
      clue: 'Assign up to 2 * 10^5 tasks each with interval [l_i, r_i] into slots having capacities c[1..M]',
      translation: 'Hall’s Theorem reduces matching existence to checking max_{A <= B} (sum_{[l_i, r_i] <= [A, B]} w_i - sum_{j=A..B} c[j]) <= 0 via lazy segment tree sweep.',
    },
    {
      clue: 'Partition N objects with partial order (a <= b iff f(a) <= f(b) and g(a) <= g(b)) into minimum chains',
      translation: 'Apply Dilworth’s Theorem: sort by first key ascending and compute the Longest Strictly Decreasing Subsequence of the second key in O(N log N).',
    },
    {
      clue: 'Find s-t maximum flow or minimum cut in an R x C grid graph (R, C <= 500)',
      translation: 'Never run Dinic on 250,000 vertices; build the planar dual with S* (top-right exterior) and T* (left-bottom exterior) and run Dijkstra in O(RC log(RC)).',
    },
    {
      clue: 'Check if every subset S of bitmask classes or interval demands can be covered',
      translation: 'Enumerate exact Hall bottleneck checks: SOS DP for small bitmask neighborhoods, or segment tree prefix sweeps for contiguous intervals.',
    },
  ],
  timeComplexity: 'O((N + M) log M) for interval Hall check; O(N log N) for 2D Dilworth; O(RC log(RC)) for planar dual min-cut',
  spaceComplexity: 'O(N + M) or O(RC)',
  pitfalls: [
    {
      type: 'WA',
      title: 'Checking Only Global Prefix Instead of All Subintervals [A, B]',
      detail: 'For Hall’s condition on intervals, checking sum(w) <= sum(c) on [1, M] is insufficient because a crowded middle window [A, B] can overflow even when outer slots are empty. Sweeping B = 1..M while maintaining D(A, B) for every left endpoint A <= B checks all M(M+1)/2 windows simultaneously.',
    },
    {
      type: 'WA',
      title: 'Tie-Breaking Order in 2D Dilworth Dominance',
      detail: 'If (x_a <= x_b and y_a <= y_b) allows chains with equal x, you MUST sort ties by y ASCENDING before running Longest Strictly Decreasing Subsequence on y. Sorting ties by y descending falsely makes (1, 5) and (1, 2) look like an antichain of size 2 even though (1, 2) <= (1, 5).',
    },
    {
      type: 'WA',
      title: 'Splitting the Outer Face Wrong in Planar Dual s-t Min-Cut',
      detail: 'For s = (0, 0) and t = (R, C), S* must border the entire Top edge row (i = 0) and Right edge column (j = C), while T* must border the entire Left edge column (j = 0) and Bottom edge row (i = R). Reversing one boundary edge creates a shortcut cycle around s or t.',
    },
    {
      type: 'TLE',
      title: 'Running General Dinic Max Flow on a 500 x 500 Planar Grid',
      detail: 'Although Dinic often runs fast on unit grids, adversarial large capacities up to 10^9 force Dinic toward O(V E), causing TLE. Planar dual Dijkstra always runs in deterministic O(RC log(RC)) regardless of edge capacity magnitude.',
    },
  ],
  implementations: {
    cpp20: `#include <algorithm>
#include <iostream>
#include <vector>

using namespace std;

// Interval Hall's Marriage Condition Checker in O((N + M) log M).
struct LazySegTree {
    int n;
    vector<long long> mx, lazy;

    explicit LazySegTree(int n) : n(n), mx(4 * n + 4, 0), lazy(4 * n + 4, 0) {}

    void push(int node) {
        if (lazy[node] != 0) {
            long long v = lazy[node];
            mx[2 * node] += v;
            lazy[2 * node] += v;
            mx[2 * node + 1] += v;
            lazy[2 * node + 1] += v;
            lazy[node] = 0;
        }
    }

    void add(int node, int l, int r, int ql, int qr, long long val) {
        if (ql > r || qr < l) return;
        if (ql <= l && r <= qr) {
            mx[node] += val;
            lazy[node] += val;
            return;
        }
        push(node);
        int mid = (l + r) / 2;
        add(2 * node, l, mid, ql, qr, val);
        add(2 * node + 1, mid + 1, r, ql, qr, val);
        mx[node] = max(mx[2 * node], mx[2 * node + 1]);
    }

    long long queryMax(int node, int l, int r, int ql, int qr) {
        if (ql > r || qr < l) return -(1LL << 60);
        if (ql <= l && r <= qr) return mx[node];
        push(node);
        int mid = (l + r) / 2;
        return max(queryMax(2 * node, l, mid, ql, qr),
                   queryMax(2 * node + 1, mid + 1, r, ql, qr));
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, m;
    if (!(cin >> n >> m)) return 0;

    vector<long long> cap(m + 1);
    for (int j = 1; j <= m; ++j) cin >> cap[j];

    vector<vector<pair<int, long long>>> byR(m + 1);
    for (int i = 0; i < n; ++i) {
        int l, r;
        long long w;
        cin >> l >> r >> w;
        byR[r].push_back({l, w});
    }

    LazySegTree seg(m);
    bool ok = true;
    for (int b = 1; b <= m; ++b) {
        seg.add(1, 1, m, 1, b, -cap[b]);
        for (const auto& [l, w] : byR[b]) {
            seg.add(1, 1, m, 1, l, w);
        }
        if (seg.queryMax(1, 1, m, 1, b) > 0) {
            ok = false;
            break;
        }
    }

    cout << (ok ? "YES" : "NO") << '\\n';
    return 0;
}
`,
    rust: `use std::io::{self, Read};

struct LazySegTree {
    mx: Vec<i64>,
    lazy: Vec<i64>,
}

impl LazySegTree {
    fn new(n: usize) -> Self {
        Self {
            mx: vec![0; 4 * n + 4],
            lazy: vec![0; 4 * n + 4],
        }
    }

    fn push(&mut self, node: usize) {
        let v = self.lazy[node];
        if v != 0 {
            self.mx[2 * node] += v;
            self.lazy[2 * node] += v;
            self.mx[2 * node + 1] += v;
            self.lazy[2 * node + 1] += v;
            self.lazy[node] = 0;
        }
    }

    fn add(&mut self, node: usize, l: usize, r: usize, ql: usize, qr: usize, val: i64) {
        if ql > r || qr < l {
            return;
        }
        if ql <= l && r <= qr {
            self.mx[node] += val;
            self.lazy[node] += val;
            return;
        }
        self.push(node);
        let mid = (l + r) / 2;
        if ql <= mid {
            self.add(2 * node, l, mid, ql, qr, val);
        }
        if qr > mid {
            self.add(2 * node + 1, mid + 1, r, ql, qr, val);
        }
        self.mx[node] = self.mx[2 * node].max(self.mx[2 * node + 1]);
    }

    fn query_max(&mut self, node: usize, l: usize, r: usize, ql: usize, qr: usize) -> i64 {
        if ql > r || qr < l {
            return i64::MIN / 4;
        }
        if ql <= l && r <= qr {
            return self.mx[node];
        }
        self.push(node);
        let mid = (l + r) / 2;
        let left_max = if ql <= mid {
            self.query_max(2 * node, l, mid, ql, qr)
        } else {
            i64::MIN / 4
        };
        let right_max = if qr > mid {
            self.query_max(2 * node + 1, mid + 1, r, ql, qr)
        } else {
            i64::MIN / 4
        };
        left_max.max(right_max)
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

    let mut cap = vec![0i64; m + 1];
    for j in 1..=m {
        cap[j] = it.next().unwrap().parse().unwrap();
    }

    let mut by_r: Vec<Vec<(usize, i64)>> = vec![Vec::new(); m + 1];
    for _ in 0..n {
        let l: usize = it.next().unwrap().parse().unwrap();
        let r: usize = it.next().unwrap().parse().unwrap();
        let w: i64 = it.next().unwrap().parse().unwrap();
        by_r[r].push((l, w));
    }

    let mut seg = LazySegTree::new(m);
    let mut ok = true;
    for b in 1..=m {
        seg.add(1, 1, m, 1, b, -cap[b]);
        for &(l, w) in &by_r[b] {
            seg.add(1, 1, m, 1, l, w);
        }
        if seg.query_max(1, 1, m, 1, b) > 0 {
            ok = false;
            break;
        }
    }

    println!("{}", if ok { "YES" } else { "NO" });
}
`,
    java21: `import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

public class Main {
    static class FastScanner {
        private final InputStream in;
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;

        FastScanner(InputStream in) {
            this.in = in;
        }

        private int readByte() throws IOException {
            if (ptr >= len) {
                len = in.read(buf);
                ptr = 0;
                if (len <= 0) return -1;
            }
            return buf[ptr++];
        }

        long nextLong() throws IOException {
            int c = readByte();
            while (c != -1 && c <= ' ') c = readByte();
            if (c == -1) return Long.MIN_VALUE;
            long sign = 1;
            if (c == '-') {
                sign = -1;
                c = readByte();
            }
            long res = 0;
            while (c > ' ') {
                res = res * 10 + (c - '0');
                c = readByte();
            }
            return res * sign;
        }

        int nextInt() throws IOException {
            return (int) nextLong();
        }
    }

    static class LazySegTree {
        final long[] mx;
        final long[] lazy;

        LazySegTree(int n) {
            mx = new long[4 * n + 4];
            lazy = new long[4 * n + 4];
        }

        void push(int node) {
            long v = lazy[node];
            if (v != 0) {
                mx[2 * node] += v;
                lazy[2 * node] += v;
                mx[2 * node + 1] += v;
                lazy[2 * node + 1] += v;
                lazy[node] = 0;
            }
        }

        void add(int node, int l, int r, int ql, int qr, long val) {
            if (ql > r || qr < l) return;
            if (ql <= l && r <= qr) {
                mx[node] += val;
                lazy[node] += val;
                return;
            }
            push(node);
            int mid = (l + r) >>> 1;
            add(2 * node, l, mid, ql, qr, val);
            add(2 * node + 1, mid + 1, r, ql, qr, val);
            mx[node] = Math.max(mx[2 * node], mx[2 * node + 1]);
        }

        long queryMax(int node, int l, int r, int ql, int qr) {
            if (ql > r || qr < l) return Long.MIN_VALUE / 4;
            if (ql <= l && r <= qr) return mx[node];
            push(node);
            int mid = (l + r) >>> 1;
            return Math.max(
                queryMax(2 * node, l, mid, ql, qr),
                queryMax(2 * node + 1, mid + 1, r, ql, qr)
            );
        }
    }

    public static void main(String[] args) throws IOException {
        FastScanner fs = new FastScanner(System.in);
        long first = fs.nextLong();
        if (first == Long.MIN_VALUE) return;
        int n = (int) first;
        int m = fs.nextInt();

        long[] cap = new long[m + 1];
        for (int j = 1; j <= m; j++) cap[j] = fs.nextLong();

        @SuppressWarnings("unchecked")
        List<long[]>[] byR = new ArrayList[m + 1];
        for (int j = 0; j <= m; j++) byR[j] = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            int l = fs.nextInt();
            int r = fs.nextInt();
            long w = fs.nextLong();
            byR[r].add(new long[]{l, w});
        }

        LazySegTree seg = new LazySegTree(m);
        boolean ok = true;
        for (int b = 1; b <= m; b++) {
            seg.add(1, 1, m, 1, b, -cap[b]);
            for (long[] item : byR[b]) {
                seg.add(1, 1, m, 1, (int) item[0], item[1]);
            }
            if (seg.queryMax(1, 1, m, 1, b) > 0) {
                ok = false;
                break;
            }
        }
        System.out.println(ok ? "YES" : "NO");
    }
}
`,
    python3: `import sys

sys.setrecursionlimit(200000)


class LazySegTree:
    def __init__(self, n: int) -> None:
        self.n = n
        self.mx = [0] * (4 * n + 4)
        self.lazy = [0] * (4 * n + 4)

    def _push(self, node: int) -> None:
        v = self.lazy[node]
        if v != 0:
            left = 2 * node
            right = left + 1
            self.mx[left] += v
            self.lazy[left] += v
            self.mx[right] += v
            self.lazy[right] += v
            self.lazy[node] = 0

    def add(self, node: int, l: int, r: int, ql: int, qr: int, val: int) -> None:
        if ql > r or qr < l:
            return
        if ql <= l and r <= qr:
            self.mx[node] += val
            self.lazy[node] += val
            return
        self._push(node)
        mid = (l + r) >> 1
        if ql <= mid:
            self.add(2 * node, l, mid, ql, qr, val)
        if qr > mid:
            self.add(2 * node + 1, mid + 1, r, ql, qr, val)
        self.mx[node] = max(self.mx[2 * node], self.mx[2 * node + 1])

    def query_max(self, node: int, l: int, r: int, ql: int, qr: int) -> int:
        if ql > r or qr < l:
            return -(1 << 60)
        if ql <= l and r <= qr:
            return self.mx[node]
        self._push(node)
        mid = (l + r) >> 1
        res = -(1 << 60)
        if ql <= mid:
            res = max(res, self.query_max(2 * node, l, mid, ql, qr))
        if qr > mid:
            res = max(res, self.query_max(2 * node + 1, mid + 1, r, ql, qr))
        return res


def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    n = int(next(it))
    m = int(next(it))
    cap = [0] * (m + 1)
    for j in range(1, m + 1):
        cap[j] = int(next(it))

    by_r: list[list[tuple[int, int]]] = [[] for _ in range(m + 1)]
    for _ in range(n):
        l = int(next(it))
        r = int(next(it))
        w = int(next(it))
        by_r[r].append((l, w))

    seg = LazySegTree(m)
    ok = True
    for b in range(1, m + 1):
        seg.add(1, 1, m, 1, b, -cap[b])
        for l, w in by_r[b]:
            seg.add(1, 1, m, 1, l, w)
        if seg.query_max(1, 1, m, 1, b) > 0:
            ok = False
            break

    print("YES" if ok else "NO")


if __name__ == "__main__":
    solve()
`,
    ruby: `class LazySegTree
  def initialize(n)
    @n = n
    @mx = Array.new(4 * n + 4, 0)
    @lazy = Array.new(4 * n + 4, 0)
  end

  def push(node)
    v = @lazy[node]
    return if v == 0

    left = 2 * node
    right = left + 1
    @mx[left] += v
    @lazy[left] += v
    @mx[right] += v
    @lazy[right] += v
    @lazy[node] = 0
  end

  def add(node, l, r, ql, qr, val)
    return if ql > r || qr < l

    if ql <= l && r <= qr
      @mx[node] += val
      @lazy[node] += val
      return
    end
    push(node)
    mid = (l + r) >> 1
    add(2 * node, l, mid, ql, qr, val) if ql <= mid
    add(2 * node + 1, mid + 1, r, ql, qr, val) if qr > mid
    a = @mx[2 * node]
    b = @mx[2 * node + 1]
    @mx[node] = a > b ? a : b
  end

  def query_max(node, l, r, ql, qr)
    return -4_000_000_000_000_000_000 if ql > r || qr < l
    return @mx[node] if ql <= l && r <= qr

    push(node)
    mid = (l + r) >> 1
    res = -4_000_000_000_000_000_000
    if ql <= mid
      v = query_max(2 * node, l, mid, ql, qr)
      res = v if v > res
    end
    if qr > mid
      v = query_max(2 * node + 1, mid + 1, r, ql, qr)
      res = v if v > res
    end
    res
  end
end

data = $stdin.read.split
exit if data.empty?
idx = 0
n = data[idx].to_i; idx += 1
m = data[idx].to_i; idx += 1

cap = Array.new(m + 1, 0)
(1..m).each do |j|
  cap[j] = data[idx].to_i
  idx += 1
end

by_r = Array.new(m + 1) { [] }
n.times do
  l = data[idx].to_i; idx += 1
  r = data[idx].to_i; idx += 1
  w = data[idx].to_i; idx += 1
  by_r[r] << [l, w]
end

seg = LazySegTree.new(m)
ok = true
(1..m).each do |b|
  seg.add(1, 1, m, 1, b, -cap[b])
  by_r[b].each do |l, w|
    seg.add(1, 1, m, 1, l, w)
  end
  if seg.query_max(1, 1, m, 1, b) > 0
    ok = false
    break
  end
end

puts(ok ? "YES" : "NO")
`,
  },
  practiceProblems: [
    {
      id: 'ch68-p1',
      tier: 'Warmup',
      ratingRange: '1900–2100',
      title: 'Minimum Chain Cover of 2D Points (Dilworth’s Theorem)',
      statement:
        'You are given N distinct points (x_i, y_i) in the 2D plane. Point A dominates point B (so B can follow A in a non-decreasing chain) if x_A <= x_B and y_A <= y_B. Partition all N points into the minimum possible number of chains. Output that minimum number of chains.',
      constraints: '1 <= N <= 2 * 10^5; -10^9 <= x_i, y_i <= 10^9',
      sampleInput: `4
1 2
1 5
2 3
3 1`,
      sampleOutput: `3`,
      hints: [
        'By Dilworth’s Theorem, the minimum number of chains equals the size of the largest pairwise incomparable subset (antichain).',
        'Two points are incomparable when one has strictly smaller x and strictly larger y. Sort by x ascending, breaking ties by y ascending.',
        'After sorting, an antichain corresponds directly to a Longest Strictly Decreasing Subsequence of y, computed in O(N log N) via lower_bound on (-y).',
      ],
      solutions: {
        cpp20: `#include <algorithm>
#include <iostream>
#include <vector>

using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    if (!(cin >> n)) return 0;

    vector<pair<long long, long long>> pts(n);
    for (int i = 0; i < n; ++i) {
        cin >> pts[i].first >> pts[i].second;
    }

    // Sort by (x asc, y asc) so equal-x points are non-decreasing in y and share a chain.
    sort(pts.begin(), pts.end());

    // Longest strictly decreasing subsequence of y == LIS on (-y).
    vector<long long> tails;
    for (const auto& p : pts) {
        long long v = -p.second;
        auto it = lower_bound(tails.begin(), tails.end(), v);
        if (it == tails.end()) {
            tails.push_back(v);
        } else {
            *it = v;
        }
    }

    cout << tails.size() << '\\n';
    return 0;
}
`,
        rust: `use std::io::{self, Read};

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let n: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };

    let mut pts = Vec::with_capacity(n);
    for _ in 0..n {
        let x: i64 = it.next().unwrap().parse().unwrap();
        let y: i64 = it.next().unwrap().parse().unwrap();
        pts.push((x, y));
    }
    pts.sort_unstable();

    let mut tails: Vec<i64> = Vec::new();
    for &(_, y) in &pts {
        let v = -y;
        let idx = tails.partition_point(|&t| t < v);
        if idx == tails.len() {
            tails.push(v);
        } else {
            tails[idx] = v;
        }
    }

    println!("{}", tails.len());
}
`,
        java21: `import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;

public class Main {
    static class FastScanner {
        private final InputStream in;
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;

        FastScanner(InputStream in) {
            this.in = in;
        }

        private int readByte() throws IOException {
            if (ptr >= len) {
                len = in.read(buf);
                ptr = 0;
                if (len <= 0) return -1;
            }
            return buf[ptr++];
        }

        long nextLong() throws IOException {
            int c = readByte();
            while (c != -1 && c <= ' ') c = readByte();
            if (c == -1) return Long.MIN_VALUE;
            long sign = 1;
            if (c == '-') {
                sign = -1;
                c = readByte();
            }
            long res = 0;
            while (c > ' ') {
                res = res * 10 + (c - '0');
                c = readByte();
            }
            return res * sign;
        }
    }

    public static void main(String[] args) throws IOException {
        FastScanner fs = new FastScanner(System.in);
        long nLong = fs.nextLong();
        if (nLong == Long.MIN_VALUE) return;
        int n = (int) nLong;

        long[][] pts = new long[n][2];
        for (int i = 0; i < n; i++) {
            pts[i][0] = fs.nextLong();
            pts[i][1] = fs.nextLong();
        }

        Arrays.sort(pts, (a, b) -> {
            if (a[0] != b[0]) return Long.compare(a[0], b[0]);
            return Long.compare(a[1], b[1]);
        });

        long[] tails = new long[n];
        int len = 0;
        for (int i = 0; i < n; i++) {
            long v = -pts[i][1];
            int lo = 0, hi = len;
            while (lo < hi) {
                int mid = (lo + hi) >>> 1;
                if (tails[mid] < v) lo = mid + 1;
                else hi = mid;
            }
            tails[lo] = v;
            if (lo == len) len++;
        }

        System.out.println(len);
    }
}
`,
        python3: `import bisect
import sys


def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    n = int(next(it))
    pts = [(int(next(it)), int(next(it))) for _ in range(n)]
    pts.sort()

    tails: list[int] = []
    for _, y in pts:
        v = -y
        idx = bisect.bisect_left(tails, v)
        if idx == len(tails):
            tails.append(v)
        else:
            tails[idx] = v

    print(len(tails))


if __name__ == "__main__":
    solve()
`,
        ruby: `data = $stdin.read.split
exit if data.empty?
n = data[0].to_i
pts = Array.new(n)
idx = 1
n.times do |i|
  x = data[idx].to_i
  y = data[idx + 1].to_i
  idx += 2
  pts[i] = [x, y]
end
pts.sort!

tails = []
pts.each do |_, y|
  v = -y
  pos = tails.bsearch_index { |t| t >= v }
  if pos.nil?
    tails << v
  else
    tails[pos] = v
  end
end

puts tails.length
`,
      },
    },
    {
      id: 'ch68-p2',
      tier: 'Standard',
      ratingRange: '2200–2450',
      title: 'Hall’s Marriage Theorem Interval Matching',
      statement:
        'Given T test cases. In each test case there are N task groups and M time slots numbered 1..M. Slot j has capacity c_j >= 0. Task group i has demand w_i >= 0 that must be distributed arbitrarily (in integer units) among slots inside the interval [l_i, r_i]. Determine whether all task groups can be simultaneously satisfied.',
      constraints: '1 <= T <= 10^4; sum of N, M <= 2 * 10^5; 1 <= l_i <= r_i <= M; 0 <= c_j, w_i <= 10^9',
      sampleInput: `2
3 3
1 1 2
1 2 1
1 3 1
2 3 1
3 3
1 1 2
1 2 2
2 2 1
2 3 1`,
      sampleOutput: `YES
NO`,
      hints: [
        'Each task connects to a contiguous interval [l_i, r_i], so by convexity any Hall-violating subset induces at least one contiguous violating window [A, B].',
        'Maintain D(A, B) = (sum of w_i with A <= l_i and r_i <= B) - (sum of c_j for A <= j <= B) in a lazy segment tree indexed by A as B sweeps from 1 to M.',
        'At step B, add -c_B to [1, B] and +w_i to [1, l_i] for every task with r_i == B, then verify max_{1 <= A <= B} D(A, B) <= 0.',
      ],
      solutions: {
        cpp20: `#include <algorithm>
#include <iostream>
#include <vector>

using namespace std;

struct LazySegTree {
    int n;
    vector<long long> mx, lazy;

    explicit LazySegTree(int n) : n(n), mx(4 * n + 4, 0), lazy(4 * n + 4, 0) {}

    void push(int node) {
        if (lazy[node] != 0) {
            long long v = lazy[node];
            mx[2 * node] += v;
            lazy[2 * node] += v;
            mx[2 * node + 1] += v;
            lazy[2 * node + 1] += v;
            lazy[node] = 0;
        }
    }

    void add(int node, int l, int r, int ql, int qr, long long val) {
        if (ql > r || qr < l) return;
        if (ql <= l && r <= qr) {
            mx[node] += val;
            lazy[node] += val;
            return;
        }
        push(node);
        int mid = (l + r) / 2;
        add(2 * node, l, mid, ql, qr, val);
        add(2 * node + 1, mid + 1, r, ql, qr, val);
        mx[node] = max(mx[2 * node], mx[2 * node + 1]);
    }

    long long queryMax(int node, int l, int r, int ql, int qr) {
        if (ql > r || qr < l) return -(1LL << 60);
        if (ql <= l && r <= qr) return mx[node];
        push(node);
        int mid = (l + r) / 2;
        return max(queryMax(2 * node, l, mid, ql, qr),
                   queryMax(2 * node + 1, mid + 1, r, ql, qr));
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int t;
    if (!(cin >> t)) return 0;

    while (t--) {
        int n, m;
        cin >> n >> m;
        vector<long long> cap(m + 1);
        for (int j = 1; j <= m; ++j) cin >> cap[j];

        vector<vector<pair<int, long long>>> byR(m + 1);
        for (int i = 0; i < n; ++i) {
            int l, r;
            long long w;
            cin >> l >> r >> w;
            byR[r].push_back({l, w});
        }

        LazySegTree seg(m);
        bool ok = true;
        for (int b = 1; b <= m; ++b) {
            seg.add(1, 1, m, 1, b, -cap[b]);
            for (const auto& [l, w] : byR[b]) {
                seg.add(1, 1, m, 1, l, w);
            }
            if (seg.queryMax(1, 1, m, 1, b) > 0) {
                ok = false;
                break;
            }
        }
        cout << (ok ? "YES" : "NO") << '\\n';
    }
    return 0;
}
`,
        rust: `use std::io::{self, Read};

struct LazySegTree {
    mx: Vec<i64>,
    lazy: Vec<i64>,
}

impl LazySegTree {
    fn new(n: usize) -> Self {
        Self {
            mx: vec![0; 4 * n + 4],
            lazy: vec![0; 4 * n + 4],
        }
    }

    fn push(&mut self, node: usize) {
        let v = self.lazy[node];
        if v != 0 {
            self.mx[2 * node] += v;
            self.lazy[2 * node] += v;
            self.mx[2 * node + 1] += v;
            self.lazy[2 * node + 1] += v;
            self.lazy[node] = 0;
        }
    }

    fn add(&mut self, node: usize, l: usize, r: usize, ql: usize, qr: usize, val: i64) {
        if ql > r || qr < l {
            return;
        }
        if ql <= l && r <= qr {
            self.mx[node] += val;
            self.lazy[node] += val;
            return;
        }
        self.push(node);
        let mid = (l + r) / 2;
        if ql <= mid {
            self.add(2 * node, l, mid, ql, qr, val);
        }
        if qr > mid {
            self.add(2 * node + 1, mid + 1, r, ql, qr, val);
        }
        self.mx[node] = self.mx[2 * node].max(self.mx[2 * node + 1]);
    }

    fn query_max(&mut self, node: usize, l: usize, r: usize, ql: usize, qr: usize) -> i64 {
        if ql > r || qr < l {
            return i64::MIN / 4;
        }
        if ql <= l && r <= qr {
            return self.mx[node];
        }
        self.push(node);
        let mid = (l + r) / 2;
        let a = if ql <= mid {
            self.query_max(2 * node, l, mid, ql, qr)
        } else {
            i64::MIN / 4
        };
        let b = if qr > mid {
            self.query_max(2 * node + 1, mid + 1, r, ql, qr)
        } else {
            i64::MIN / 4
        };
        a.max(b)
    }
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let t: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };

    let mut out = String::new();
    for _ in 0..t {
        let n: usize = it.next().unwrap().parse().unwrap();
        let m: usize = it.next().unwrap().parse().unwrap();
        let mut cap = vec![0i64; m + 1];
        for j in 1..=m {
            cap[j] = it.next().unwrap().parse().unwrap();
        }
        let mut by_r: Vec<Vec<(usize, i64)>> = vec![Vec::new(); m + 1];
        for _ in 0..n {
            let l: usize = it.next().unwrap().parse().unwrap();
            let r: usize = it.next().unwrap().parse().unwrap();
            let w: i64 = it.next().unwrap().parse().unwrap();
            by_r[r].push((l, w));
        }

        let mut seg = LazySegTree::new(m);
        let mut ok = true;
        for b in 1..=m {
            seg.add(1, 1, m, 1, b, -cap[b]);
            for &(l, w) in &by_r[b] {
                seg.add(1, 1, m, 1, l, w);
            }
            if seg.query_max(1, 1, m, 1, b) > 0 {
                ok = false;
                break;
            }
        }
        out.push_str(if ok { "YES\\n" } else { "NO\\n" });
    }
    print!("{out}");
}
`,
        java21: `import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

public class Main {
    static class FastScanner {
        private final InputStream in;
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;

        FastScanner(InputStream in) {
            this.in = in;
        }

        private int readByte() throws IOException {
            if (ptr >= len) {
                len = in.read(buf);
                ptr = 0;
                if (len <= 0) return -1;
            }
            return buf[ptr++];
        }

        long nextLong() throws IOException {
            int c = readByte();
            while (c != -1 && c <= ' ') c = readByte();
            if (c == -1) return Long.MIN_VALUE;
            long sign = 1;
            if (c == '-') {
                sign = -1;
                c = readByte();
            }
            long res = 0;
            while (c > ' ') {
                res = res * 10 + (c - '0');
                c = readByte();
            }
            return res * sign;
        }

        int nextInt() throws IOException {
            return (int) nextLong();
        }
    }

    static class LazySegTree {
        final long[] mx;
        final long[] lazy;

        LazySegTree(int n) {
            mx = new long[4 * n + 4];
            lazy = new long[4 * n + 4];
        }

        void push(int node) {
            long v = lazy[node];
            if (v != 0) {
                mx[2 * node] += v;
                lazy[2 * node] += v;
                mx[2 * node + 1] += v;
                lazy[2 * node + 1] += v;
                lazy[node] = 0;
            }
        }

        void add(int node, int l, int r, int ql, int qr, long val) {
            if (ql > r || qr < l) return;
            if (ql <= l && r <= qr) {
                mx[node] += val;
                lazy[node] += val;
                return;
            }
            push(node);
            int mid = (l + r) >>> 1;
            add(2 * node, l, mid, ql, qr, val);
            add(2 * node + 1, mid + 1, r, ql, qr, val);
            mx[node] = Math.max(mx[2 * node], mx[2 * node + 1]);
        }

        long queryMax(int node, int l, int r, int ql, int qr) {
            if (ql > r || qr < l) return Long.MIN_VALUE / 4;
            if (ql <= l && r <= qr) return mx[node];
            push(node);
            int mid = (l + r) >>> 1;
            return Math.max(
                queryMax(2 * node, l, mid, ql, qr),
                queryMax(2 * node + 1, mid + 1, r, ql, qr)
            );
        }
    }

    public static void main(String[] args) throws IOException {
        FastScanner fs = new FastScanner(System.in);
        long tLong = fs.nextLong();
        if (tLong == Long.MIN_VALUE) return;
        int t = (int) tLong;

        StringBuilder sb = new StringBuilder();
        while (t-- > 0) {
            int n = fs.nextInt();
            int m = fs.nextInt();
            long[] cap = new long[m + 1];
            for (int j = 1; j <= m; j++) cap[j] = fs.nextLong();

            @SuppressWarnings("unchecked")
            List<long[]>[] byR = new ArrayList[m + 1];
            for (int j = 0; j <= m; j++) byR[j] = new ArrayList<>();
            for (int i = 0; i < n; i++) {
                int l = fs.nextInt();
                int r = fs.nextInt();
                long w = fs.nextLong();
                byR[r].add(new long[]{l, w});
            }

            LazySegTree seg = new LazySegTree(m);
            boolean ok = true;
            for (int b = 1; b <= m; b++) {
                seg.add(1, 1, m, 1, b, -cap[b]);
                for (long[] item : byR[b]) {
                    seg.add(1, 1, m, 1, (int) item[0], item[1]);
                }
                if (seg.queryMax(1, 1, m, 1, b) > 0) {
                    ok = false;
                    break;
                }
            }
            sb.append(ok ? "YES\\n" : "NO\\n");
        }
        System.out.print(sb);
    }
}
`,
        python3: `import sys

sys.setrecursionlimit(200000)


class LazySegTree:
    def __init__(self, n: int) -> None:
        self.mx = [0] * (4 * n + 4)
        self.lazy = [0] * (4 * n + 4)

    def _push(self, node: int) -> None:
        v = self.lazy[node]
        if v != 0:
            left = 2 * node
            right = left + 1
            self.mx[left] += v
            self.lazy[left] += v
            self.mx[right] += v
            self.lazy[right] += v
            self.lazy[node] = 0

    def add(self, node: int, l: int, r: int, ql: int, qr: int, val: int) -> None:
        if ql > r or qr < l:
            return
        if ql <= l and r <= qr:
            self.mx[node] += val
            self.lazy[node] += val
            return
        self._push(node)
        mid = (l + r) >> 1
        if ql <= mid:
            self.add(2 * node, l, mid, ql, qr, val)
        if qr > mid:
            self.add(2 * node + 1, mid + 1, r, ql, qr, val)
        self.mx[node] = max(self.mx[2 * node], self.mx[2 * node + 1])

    def query_max(self, node: int, l: int, r: int, ql: int, qr: int) -> int:
        if ql > r or qr < l:
            return -(1 << 60)
        if ql <= l and r <= qr:
            return self.mx[node]
        self._push(node)
        mid = (l + r) >> 1
        res = -(1 << 60)
        if ql <= mid:
            res = max(res, self.query_max(2 * node, l, mid, ql, qr))
        if qr > mid:
            res = max(res, self.query_max(2 * node + 1, mid + 1, r, ql, qr))
        return res


def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    t = int(next(it))
    out: list[str] = []

    for _ in range(t):
        n = int(next(it))
        m = int(next(it))
        cap = [0] * (m + 1)
        for j in range(1, m + 1):
            cap[j] = int(next(it))

        by_r: list[list[tuple[int, int]]] = [[] for _ in range(m + 1)]
        for _ in range(n):
            l = int(next(it))
            r = int(next(it))
            w = int(next(it))
            by_r[r].append((l, w))

        seg = LazySegTree(m)
        ok = True
        for b in range(1, m + 1):
            seg.add(1, 1, m, 1, b, -cap[b])
            for l, w in by_r[b]:
                seg.add(1, 1, m, 1, l, w)
            if seg.query_max(1, 1, m, 1, b) > 0:
                ok = False
                break
        out.append("YES" if ok else "NO")

    print("\\n".join(out))


if __name__ == "__main__":
    solve()
`,
        ruby: `class LazySegTree
  def initialize(n)
    @mx = Array.new(4 * n + 4, 0)
    @lazy = Array.new(4 * n + 4, 0)
  end

  def push(node)
    v = @lazy[node]
    return if v == 0

    left = 2 * node
    right = left + 1
    @mx[left] += v
    @lazy[left] += v
    @mx[right] += v
    @lazy[right] += v
    @lazy[node] = 0
  end

  def add(node, l, r, ql, qr, val)
    return if ql > r || qr < l

    if ql <= l && r <= qr
      @mx[node] += val
      @lazy[node] += val
      return
    end
    push(node)
    mid = (l + r) >> 1
    add(2 * node, l, mid, ql, qr, val) if ql <= mid
    add(2 * node + 1, mid + 1, r, ql, qr, val) if qr > mid
    a = @mx[2 * node]
    b = @mx[2 * node + 1]
    @mx[node] = a > b ? a : b
  end

  def query_max(node, l, r, ql, qr)
    return -4_000_000_000_000_000_000 if ql > r || qr < l
    return @mx[node] if ql <= l && r <= qr

    push(node)
    mid = (l + r) >> 1
    res = -4_000_000_000_000_000_000
    if ql <= mid
      v = query_max(2 * node, l, mid, ql, qr)
      res = v if v > res
    end
    if qr > mid
      v = query_max(2 * node + 1, mid + 1, r, ql, qr)
      res = v if v > res
    end
    res
  end
end

data = $stdin.read.split
exit if data.empty?
idx = 0
t = data[idx].to_i; idx += 1
out = []

t.times do
  n = data[idx].to_i; idx += 1
  m = data[idx].to_i; idx += 1
  cap = Array.new(m + 1, 0)
  (1..m).each do |j|
    cap[j] = data[idx].to_i
    idx += 1
  end

  by_r = Array.new(m + 1) { [] }
  n.times do
    l = data[idx].to_i; idx += 1
    r = data[idx].to_i; idx += 1
    w = data[idx].to_i; idx += 1
    by_r[r] << [l, w]
  end

  seg = LazySegTree.new(m)
  ok = true
  (1..m).each do |b|
    seg.add(1, 1, m, 1, b, -cap[b])
    by_r[b].each { |l, w| seg.add(1, 1, m, 1, l, w) }
    if seg.query_max(1, 1, m, 1, b) > 0
      ok = false
      break
    end
  end
  out << (ok ? "YES" : "NO")
end

puts out.join("\\n")
`,
      },
    },
    {
      id: 'ch68-p3',
      tier: 'Boss',
      ratingRange: '2400–2700',
      title: 'Planar s-t Minimum Cut via Dual Dijkstra',
      statement:
        'An undirected planar grid graph has R rows and C columns of cells, so its vertices are grid intersections (i, j) for 0 <= i <= R and 0 <= j <= C. First you are given R + 1 rows of C capacities H[i][j] between (i, j) and (i, j + 1). Next you are given R rows of C + 1 capacities V[i][j] between (i, j) and (i + 1, j). Find the minimum s-t cut capacity separating s = (0, 0) from t = (R, C).',
      constraints: '1 <= R, C <= 500; 0 <= H[i][j], V[i][j] <= 10^9',
      sampleInput: `2 2
3 5
2 4
1 6
7 1 3
2 8 4`,
      sampleOutput: `6`,
      hints: [
        'Each cell (i, j) for 0 <= i < R, 0 <= j < C is a dual vertex. Create two exterior dual nodes: S* bordering Top (i = 0) and Right (j = C) edges, and T* bordering Left (j = 0) and Bottom (i = R) edges.',
        'Every primal horizontal or vertical edge crosses between two adjacent dual faces with weight equal to its primal capacity.',
        'By planar s-t duality, the minimum cut separating (0, 0) and (R, C) equals the shortest path from S* to T* computed with Dijkstra in O(RC log(RC)).',
      ],
      solutions: {
        cpp20: `#include <iostream>
#include <queue>
#include <vector>

using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int r, c;
    if (!(cin >> r >> c)) return 0;

    int sDual = r * c;
    int tDual = r * c + 1;
    vector<vector<pair<int, long long>>> adj(r * c + 2);

    auto addEdge = [&](int u, int v, long long w) {
        adj[u].push_back({v, w});
        adj[v].push_back({u, w});
    };

    // Horizontal primal edges: (i, j) -- (i, j + 1).
    for (int i = 0; i <= r; ++i) {
        for (int j = 0; j < c; ++j) {
            long long w;
            cin >> w;
            int u = (i == 0) ? sDual : (i - 1) * c + j;
            int v = (i == r) ? tDual : i * c + j;
            addEdge(u, v, w);
        }
    }

    // Vertical primal edges: (i, j) -- (i + 1, j).
    for (int i = 0; i < r; ++i) {
        for (int j = 0; j <= c; ++j) {
            long long w;
            cin >> w;
            int u = (j == 0) ? tDual : i * c + (j - 1);
            int v = (j == c) ? sDual : i * c + j;
            addEdge(u, v, w);
        }
    }

    const long long INF = (1LL << 60);
    vector<long long> dist(r * c + 2, INF);
    priority_queue<pair<long long, int>, vector<pair<long long, int>>, greater<>> pq;
    dist[sDual] = 0;
    pq.push({0, sDual});

    while (!pq.empty()) {
        auto [d, u] = pq.top();
        pq.pop();
        if (d > dist[u]) continue;
        if (u == tDual) break;
        for (const auto& [v, w] : adj[u]) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.push({dist[v], v});
            }
        }
    }

    cout << dist[tDual] << '\\n';
    return 0;
}
`,
        rust: `use std::cmp::Reverse;
use std::collections::BinaryHeap;
use std::io::{self, Read};

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let r: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };
    let c: usize = it.next().unwrap().parse().unwrap();

    let s_dual = r * c;
    let t_dual = r * c + 1;
    let mut adj = vec![Vec::<(usize, i64)>::new(); r * c + 2];

    for i in 0..=r {
        for j in 0..c {
            let w: i64 = it.next().unwrap().parse().unwrap();
            let u = if i == 0 { s_dual } else { (i - 1) * c + j };
            let v = if i == r { t_dual } else { i * c + j };
            adj[u].push((v, w));
            adj[v].push((u, w));
        }
    }

    for i in 0..r {
        for j in 0..=c {
            let w: i64 = it.next().unwrap().parse().unwrap();
            let u = if j == 0 { t_dual } else { i * c + (j - 1) };
            let v = if j == c { s_dual } else { i * c + j };
            adj[u].push((v, w));
            adj[v].push((u, w));
        }
    }

    let inf = i64::MAX / 4;
    let mut dist = vec![inf; r * c + 2];
    let mut pq = BinaryHeap::new();
    dist[s_dual] = 0;
    pq.push(Reverse((0i64, s_dual)));

    while let Some(Reverse((d, u))) = pq.pop() {
        if d > dist[u] {
            continue;
        }
        if u == t_dual {
            break;
        }
        for &(v, w) in &adj[u] {
            if d + w < dist[v] {
                dist[v] = d + w;
                pq.push(Reverse((dist[v], v)));
            }
        }
    }

    println!("{}", dist[t_dual]);
}
`,
        java21: `import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.PriorityQueue;

public class Main {
    static class FastScanner {
        private final InputStream in;
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;

        FastScanner(InputStream in) {
            this.in = in;
        }

        private int readByte() throws IOException {
            if (ptr >= len) {
                len = in.read(buf);
                ptr = 0;
                if (len <= 0) return -1;
            }
            return buf[ptr++];
        }

        long nextLong() throws IOException {
            int c = readByte();
            while (c != -1 && c <= ' ') c = readByte();
            if (c == -1) return Long.MIN_VALUE;
            long res = 0;
            while (c > ' ') {
                res = res * 10 + (c - '0');
                c = readByte();
            }
            return res;
        }

        int nextInt() throws IOException {
            return (int) nextLong();
        }
    }

    public static void main(String[] args) throws IOException {
        FastScanner fs = new FastScanner(System.in);
        long rLong = fs.nextLong();
        if (rLong == Long.MIN_VALUE) return;
        int r = (int) rLong;
        int c = fs.nextInt();

        int sDual = r * c;
        int tDual = r * c + 1;
        @SuppressWarnings("unchecked")
        List<long[]>[] adj = new ArrayList[r * c + 2];
        for (int i = 0; i < r * c + 2; i++) adj[i] = new ArrayList<>();

        for (int i = 0; i <= r; i++) {
            for (int j = 0; j < c; j++) {
                long w = fs.nextLong();
                int u = (i == 0) ? sDual : (i - 1) * c + j;
                int v = (i == r) ? tDual : i * c + j;
                adj[u].add(new long[]{v, w});
                adj[v].add(new long[]{u, w});
            }
        }

        for (int i = 0; i < r; i++) {
            for (int j = 0; j <= c; j++) {
                long w = fs.nextLong();
                int u = (j == 0) ? tDual : i * c + (j - 1);
                int v = (j == c) ? sDual : i * c + j;
                adj[u].add(new long[]{v, w});
                adj[v].add(new long[]{u, w});
            }
        }

        long[] dist = new long[r * c + 2];
        Arrays.fill(dist, Long.MAX_VALUE / 4);
        dist[sDual] = 0;
        PriorityQueue<long[]> pq = new PriorityQueue<>(Comparator.comparingLong(a -> a[0]));
        pq.add(new long[]{0L, sDual});

        while (!pq.isEmpty()) {
            long[] cur = pq.poll();
            long d = cur[0];
            int u = (int) cur[1];
            if (d > dist[u]) continue;
            if (u == tDual) break;
            for (long[] edge : adj[u]) {
                int v = (int) edge[0];
                long w = edge[1];
                if (d + w < dist[v]) {
                    dist[v] = d + w;
                    pq.add(new long[]{dist[v], v});
                }
            }
        }

        System.out.println(dist[tDual]);
    }
}
`,
        python3: `import heapq
import sys


def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    r = int(next(it))
    c = int(next(it))

    s_dual = r * c
    t_dual = r * c + 1
    adj: list[list[tuple[int, int]]] = [[] for _ in range(r * c + 2)]

    for i in range(r + 1):
        for j in range(c):
            w = int(next(it))
            u = s_dual if i == 0 else (i - 1) * c + j
            v = t_dual if i == r else i * c + j
            adj[u].append((v, w))
            adj[v].append((u, w))

    for i in range(r):
        for j in range(c + 1):
            w = int(next(it))
            u = t_dual if j == 0 else i * c + (j - 1)
            v = s_dual if j == c else i * c + j
            adj[u].append((v, w))
            adj[v].append((u, w))

    inf = 1 << 60
    dist = [inf] * (r * c + 2)
    dist[s_dual] = 0
    pq: list[tuple[int, int]] = [(0, s_dual)]

    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]:
            continue
        if u == t_dual:
            break
        for v, w in adj[u]:
            nd = d + w
            if nd < dist[v]:
                dist[v] = nd
                heapq.heappush(pq, (nd, v))

    print(dist[t_dual])


if __name__ == "__main__":
    solve()
`,
        ruby: `class MinHeap
  def initialize
    @heap = []
  end

  def empty?
    @heap.empty?
  end

  def push(d, u)
    @heap << [d, u]
    i = @heap.length - 1
    while i > 0
      p = (i - 1) >> 1
      break if @heap[p][0] <= @heap[i][0]

      @heap[p], @heap[i] = @heap[i], @heap[p]
      i = p
    end
  end

  def pop
    top = @heap[0]
    last = @heap.pop
    if !@heap.empty?
      @heap[0] = last
      i = 0
      n = @heap.length
      loop do
        left = 2 * i + 1
        right = left + 1
        best = i
        best = left if left < n && @heap[left][0] < @heap[best][0]
        best = right if right < n && @heap[right][0] < @heap[best][0]
        break if best == i

        @heap[i], @heap[best] = @heap[best], @heap[i]
        i = best
      end
    end
    top
  end
end

data = $stdin.read.split
exit if data.empty?
idx = 0
r = data[idx].to_i; idx += 1
c = data[idx].to_i; idx += 1

s_dual = r * c
t_dual = r * c + 1
adj = Array.new(r * c + 2) { [] }

(0..r).each do |i|
  (0...c).each do |j|
    w = data[idx].to_i; idx += 1
    u = i == 0 ? s_dual : (i - 1) * c + j
    v = i == r ? t_dual : i * c + j
    adj[u] << [v, w]
    adj[v] << [u, w]
  end
end

(0...r).each do |i|
  (0..c).each do |j|
    w = data[idx].to_i; idx += 1
    u = j == 0 ? t_dual : i * c + (j - 1)
    v = j == c ? s_dual : i * c + j
    adj[u] << [v, w]
    adj[v] << [u, w]
  end
end

inf = 1 << 60
dist = Array.new(r * c + 2, inf)
dist[s_dual] = 0
pq = MinHeap.new
pq.push(0, s_dual)

until pq.empty?
  d, u = pq.pop
  next if d > dist[u]
  break if u == t_dual

  adj[u].each do |v, w|
    nd = d + w
    if nd < dist[v]
      dist[v] = nd
      pq.push(nd, v)
    end
  end
end

puts dist[t_dual]
`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'Codeforces',
      title: 'Hall Interval Matching & Scheduling Duality Classics',
      difficulty: '2200–2500',
      url: 'https://codeforces.com/problemset?tags=flows,data+structures',
      patternNote: 'Lazy segment tree prefix/interval sweeps turn bipartite interval flows into O((N + M) log M) queries.',
    },
    {
      platform: 'AtCoder',
      title: 'ABC / ARC Planar Grid Min-Cut & Dilworth Chain Cover',
      difficulty: '2100–2450',
      url: 'https://atcoder.jp/',
      patternNote: 'Dual Dijkstra computes grid s-t min-cut in O(RC log(RC)); Dilworth pairs with LIS/LDS.',
    },
    {
      platform: 'CSES',
      title: 'Towers / Increasing Subsequence II & Planar Cut Duals',
      difficulty: 'Medium–Hard',
      url: 'https://cses.fi/problemset/',
      patternNote: 'Poset chain decomposition and planar shortest-path min-cut reductions.',
    },
  ],
  interviewNotes: [
    'Prove why checking Hall’s condition on a union of disconnected intervals reduces to checking each connected component individually, letting a single contiguous [A, B] sweep suffice.',
    'Explain Dilworth’s Theorem on 2D points and why equal-x tie-breaking direction (y ascending vs. descending) determines whether points sharing an x-coordinate can share a chain.',
    'Walk through how S* (top + right exterior) and T* (left + bottom exterior) split the outer face of an R x C grid so every s-t cut curve maps one-to-one onto an S*-to-T* path in the planar dual.',
  ],
  projectBlueprint: {
    title: 'VLSI Planar Routing Cut-Analyzer & Parallel Task-Dependency Chain Scheduler',
    tagline: 'High-throughput bipartite feasibility verifier, poset parallel-worker planner, and planar chip min-cut solver',
    stackSummary: 'TypeScript Lazy Segtree Hall Engine + Dilworth Poset Scheduler + Dual Dijkstra Router',
    asciiDiagram: [
      '+------------------------------------------------------------------+',
      '|  Input Mode: Interval Hall | 2D Poset Dilworth | Planar Grid Cut |',
      '|        |                                                         |',
      '|        +--> Sweep B=1..M, track max_{A<=B} D(A,B) <= 0           |',
      '|        +--> Sort (x asc, y asc) -> LDS(y) gives min chains       |',
      '|        +--> Dual Graph S*(Top/Right) -> T*(Left/Bottom) Dijkstra |',
      '+------------------------------------------------------------------+',
    ].join('\n'),
    milestones: [
      {
        id: 'm1',
        title: 'Contiguous-Window Hall Verifier',
        detail: 'Detect tight capacity bottlenecks across hundreds of thousands of interval jobs without building flow graphs.',
      },
      {
        id: 'm2',
        title: 'Poset Chain Partitioner',
        detail: 'Compute both the exact minimum worker chain count and maximal antichain witness via O(N log N) patience sorting.',
      },
      {
        id: 'm3',
        title: 'Planar Dual Routing Min-Cut Engine',
        detail: 'Convert 500 x 500 chip wiring grids into dual graphs and solve arbitrary-capacity min-cuts in sub-second time.',
      },
    ],
    starterCode: `export function minChains2D(points: Array<[number, number]>): number {
  const sorted = [...points].sort((a, b) => (a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1]));
  const tails: number[] = [];
  for (const [, y] of sorted) {
    const v = -y;
    let lo = 0, hi = tails.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (tails[mid] < v) lo = mid + 1;
      else hi = mid;
    }
    tails[lo] = v;
  }
  return tails.length;
}`,
  },
};
