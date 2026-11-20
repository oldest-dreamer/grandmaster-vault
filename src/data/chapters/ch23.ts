import type { TheoryChapter } from '../../types/vault';

export const CH23_SQRT_MO_HILBERT: TheoryChapter = {
  slug: 'sqrt-decomposition-mo-algorithm',
  topicId: 'ds-10',
  title: 'Sqrt Decomposition, Mo’s Algorithm & Hilbert Order',
  domain: 'Data Structures',
  ratingTier: '1900–2200',
  usacoDivision: 'Platinum',
  subtitle:
    'Reorder offline range queries by block parity or space-filling Hilbert curves so two-pointer sliding windows [L, R] answer non-associative frequency and distinctness queries in O((N + Q) sqrt(N)).',
  analogyTitle: 'The Warehouse Forklift & Space-Filling Delivery Route Analogy',
  analogyBody:
    'Suppose you work in a 200,000-aisle warehouse and receive 200,000 inventory audit slips `[L_i, R_i]` asking "how many distinct items appear at least 3 times between aisle L and aisle R?" Adding or removing one aisle takes `O(1)`, yet answering each slip from scratch wastes `O(N * Q)` steps. **Mo’s Algorithm** acts like a smart route planner: instead of walking back and forth randomly, it buckets queries by `(L / B, R)`—or even better, maps each `(L, R)` coordinate onto a continuous **Hilbert space-filling curve**—so the `L` and `R` forklifts glide smoothly from query to query without zig-zagging across the entire warehouse! Pair Mo’s pointer moves with **Sqrt Buckets** on values (`O(1)` updates + `O(sqrt(N))` threshold counts), and even notoriously non-mergeable queries run under 1 second.',
  prerequisites: [
    {
      slug: 'coordinate-compression-offline-sorting',
      title: 'Coordinate Compression & Offline Event Sorting',
    },
  ],
  traceTitle: 'Interactive Mo’s Block/Hilbert Query Ordering & [L, R] Pointer Trace',
  traceSubtitle:
    'Step through sorting queries over `A = [4, 1, 4, 2, 1, 3]`, parity zig-zag avoidance vs. Hilbert order, and incremental `add()`/`remove()` state updates.',
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Step 1: Unsorted Queries Cause O(N*Q) Thrashing vs. Block Parity / Hilbert Sorting',
      explanation:
        'Suppose B = 2 and queries are Q0:[0, 5], Q1:[4, 5], Q2:[1, 2], Q3:[1, 5]. Block indices L/2 are [0, 2, 0, 0]. Even blocks sort R ascending; odd blocks sort R descending (or compute 64-bit hilbertOrder(L, R)). Sorted order: Q2:[1,2] -> Q3:[1,5] -> Q0:[0,5] -> Q1:[4,5]!',
      mode: 'array',
      arrays: [
        {
          name: 'Array A[]',
          cells: [
            { index: 0, value: 4, highlight: 'neutral' },
            { index: 1, value: 1, highlight: 'window' },
            { index: 2, value: 4, highlight: 'window' },
            { index: 3, value: 2, highlight: 'neutral' },
            { index: 4, value: 1, highlight: 'neutral' },
            { index: 5, value: 3, highlight: 'neutral' },
          ],
        },
        {
          name: 'Sorted Q Order',
          cells: [
            { index: 0, value: 'Q2[1,2]', highlight: 'active' },
            { index: 1, value: 'Q3[1,5]', highlight: 'window' },
            { index: 2, value: 'Q0[0,5]', highlight: 'window' },
            { index: 3, value: 'Q1[4,5]', highlight: 'neutral' },
          ],
        },
      ],
      variables: { BlockSize: 2, L_Init: 0, R_Init: -1, Distinct: 0 },
    },
    {
      stepNumber: 2,
      title: 'Step 2: Slide Window to First Sorted Query Q2 = [1, 2] -> A[1..2] = [1, 4]',
      explanation:
        'Start empty `[L=0, R=-1]`. Advance R -> 2 (`add(4), add(1), add(4)` -> freq[4]=2, freq[1]=1), then shrink L -> 1 (`remove(4)` -> freq[4]=1). Now `[L=1, R=2]` has Distinct = 2.',
      mode: 'array',
      arrays: [
        {
          name: 'Array A[]',
          cells: [
            { index: 0, value: 4, highlight: 'neutral' },
            { index: 1, value: 1, highlight: 'active' },
            { index: 2, value: 4, highlight: 'active' },
            { index: 3, value: 2, highlight: 'neutral' },
            { index: 4, value: 1, highlight: 'neutral' },
            { index: 5, value: 3, highlight: 'neutral' },
          ],
        },
        {
          name: 'freq[1..4]',
          cells: [
            { index: 1, value: 1, highlight: 'updated' },
            { index: 2, value: 0, highlight: 'neutral' },
            { index: 3, value: 0, highlight: 'neutral' },
            { index: 4, value: 1, highlight: 'updated' },
          ],
        },
      ],
      variables: { CurrentQuery: 'Q2[1,2]', L: 1, R: 2, DistinctAns: 2 },
    },
    {
      stepNumber: 3,
      title: 'Step 3: Expand R Right to Q3 = [1, 5] & Expand L Left to Q0 = [0, 5]',
      explanation:
        'R slides 2 -> 5 (`add(2), add(1), add(3)` -> Distinct becomes 4 for Q3!). Next Q0=[0, 5] simply shifts L 1 -> 0 (`add(4)` -> freq[4]=2, Distinct remains 4). Zero wasted passes!',
      mode: 'array',
      arrays: [
        {
          name: 'Array A[]',
          cells: [
            { index: 0, value: 4, highlight: 'updated' },
            { index: 1, value: 1, highlight: 'window' },
            { index: 2, value: 4, highlight: 'window' },
            { index: 3, value: 2, highlight: 'window' },
            { index: 4, value: 1, highlight: 'window' },
            { index: 5, value: 3, highlight: 'window' },
          ],
        },
        {
          name: 'freq[1..4]',
          cells: [
            { index: 1, value: 2, highlight: 'updated' },
            { index: 2, value: 1, highlight: 'updated' },
            { index: 3, value: 1, highlight: 'updated' },
            { index: 4, value: 2, highlight: 'updated' },
          ],
        },
      ],
      variables: { 'Ans[Q3]': 4, 'Ans[Q0]': 4, L: 0, R: 5 },
    },
    {
      stepNumber: 4,
      title: 'Step 4: Contract L Rightward to Final Query Q1 = [4, 5]',
      explanation:
        'Contract L from 0 -> 4: remove(A[0]=4), remove(A[1]=1), remove(A[2]=4), remove(A[3]=2). Frequencies for {4, 2} drop to 0, leaving [L=4, R=5] = [1, 3] with Distinct = 2!',
      mode: 'array',
      arrays: [
        {
          name: 'Array A[]',
          cells: [
            { index: 0, value: 4, highlight: 'neutral' },
            { index: 1, value: 1, highlight: 'neutral' },
            { index: 2, value: 4, highlight: 'neutral' },
            { index: 3, value: 2, highlight: 'neutral' },
            { index: 4, value: 1, highlight: 'active' },
            { index: 5, value: 3, highlight: 'active' },
          ],
        },
        {
          name: 'freq[1..4]',
          cells: [
            { index: 1, value: 1, highlight: 'updated' },
            { index: 2, value: 0, highlight: 'updated' },
            { index: 3, value: 1, highlight: 'neutral' },
            { index: 4, value: 0, highlight: 'updated' },
          ],
        },
      ],
      variables: { CurrentQuery: 'Q1[4,5]', L: 4, R: 5, 'Ans[Q1]': 2, TotalPointerMoves: 13 },
    },
  ],
  reductionClues: [
    {
      clue: '"Offline range queries [L, R] asking about frequencies, distinct counts, mode, or sum of cnt[x]^2"',
      translation:
        'Pure Mo’s Algorithm with Hilbert Order sorting (`O(N sqrt(Q))`) + `add(idx)` / `remove(idx)` frequency array.',
    },
    {
      clue: '"Range queries [L, R] WITH point updates a[p] = v interleaved, N <= 5*10^4"',
      translation:
        '3D Mo’s Algorithm with Time axis `t`: sort by `(l / B, r / B, t)` using block size `B = max(1, round(N^(2/3)))` for `O(N^(5/3))` complexity.',
    },
    {
      clue: '"Queries on subtrees or paths in a tree (offline): distinct colors / k-th values on path(u, v)"',
      translation:
        'Flatten the tree with an **Euler Tour**! Subtree `[tin[u], tout[u]]` becomes standard Mo’s; path `(u, v)` uses `2*N` entry/exit tour where parity toggles `vis[node]` (plus adding `lca(u, v)` separately if `lca != u`).',
    },
    {
      clue: '"Need O(1) insert/delete inside Mo’s loop AND O(sqrt(N)) range count / k-th order statistic per query"',
      translation:
        'Pair Mo’s Algorithm (`O(N sqrt(Q))` updates) with **Sqrt Value-Bucket Decomposition** (`O(1)` point update on bucket + `O(sqrt(V))` query once per `Q`), avoiding the extra `log N` factor of a Fenwick/Segment Tree!',
    },
  ],
  timeComplexity: 'Standard Mo: O((N + Q) sqrt(N)) | Hilbert Mo: O(N sqrt(Q)) | 3D Mo with Updates: O(Q * N^(2/3))',
  spaceComplexity: 'O(N + Q)',
  pitfalls: [
    {
      type: 'RE',
      title: 'Expanding vs. Contracting in the Wrong Order (Causing L > R + 1)',
      detail:
        'If your `add()`/`remove()` breaks when a frequency goes negative (e.g., `remove` runs before `add` when `[L, R]` is empty/inverted), ALWAYS run both expansions (`while (curL > q.l) add(--curL); while (curR < q.r) add(++curR);`) BEFORE both contractions (`while (curL < q.l) remove(curL++); while (curR > q.r) remove(curR--);`)!',
    },
    {
      type: 'TLE',
      title: 'Using O(log N) std::map or std::set Inside Mo’s add()/remove()',
      detail:
        'Putting a `log N` structure inside `O(N sqrt(N))` pointer moves turns complexity into `O(N sqrt(N) log N)`, which TLEs for `N = 200,000`. Always **coordinate-compress** values upfront into dense integers `[0..U-1]` and index a flat array!',
    },
    {
      type: 'TLE',
      title: 'Non-Parity Block Sorting Causes O(N) R-Resets Every Block Boundary',
      detail:
        'Sorting strictly by `(l / B, r)` resets `R` from `N` back down to `0` at each block transition. Either alternate `(l / B) & 1 ? r1 > r2 : r1 < r2` OR sort by `gilbertOrder(l, r)` to halve pointer travel!',
    },
    {
      type: 'WA',
      title: 'Hilbert Curve Power-of-Two Bound Must Strictly Exceed Max Coordinate N',
      detail:
        'Set `pow2 = 21` (covering up to `2^21 = 2,097,152`) or dynamically pick `k` such that `(1 << k) > N`. Using `1 << 16` when `N = 200,000` wraps coordinates modulo `65536` and destroys cache locality.',
    },
  ],
  implementations: {
    cpp20: `#include <bits/stdc++.h>
using namespace std;

// Mo's Algorithm with Hilbert Space-Filling Curve Ordering
// Time: O(N sqrt(Q)) | Space: O(N + Q)
inline int64_t gilbert_order(int x, int y, int pow = 21, int rotate = 0) {
    if (pow == 0) return 0;
    int hpow = 1 << (pow - 1);
    int seg = (x < hpow) ? ((y < hpow) ? 0 : 3) : ((y < hpow) ? 1 : 2);
    seg = (seg + rotate) & 3;
    static constexpr int rotateDelta[4] = {3, 0, 0, 1};
    int nx = x & (x ^ hpow), ny = y & (y ^ hpow);
    int nrot = (rotate + rotateDelta[seg]) & 3;
    int64_t subSquareSize = int64_t(1) << (2 * pow - 2);
    int64_t ans = seg * subSquareSize;
    int64_t add = gilbert_order(nx, ny, pow - 1, nrot);
    ans += (seg == 1 || seg == 2) ? add : (subSquareSize - add - 1);
    return ans;
}

struct Query {
    int l, r, id;
    int64_t ord;
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, q;
    if (!(cin >> n >> q)) return 0;
    vector<int> a(n), vals(n);
    for (int i = 0; i < n; i++) {
        cin >> a[i];
        vals[i] = a[i];
    }
    sort(vals.begin(), vals.end());
    vals.erase(unique(vals.begin(), vals.end()), vals.end());
    for (int i = 0; i < n; i++) {
        a[i] = (int)(lower_bound(vals.begin(), vals.end(), a[i]) - vals.begin());
    }

    int k = 1;
    while ((1 << k) <= n) k++;

    vector<Query> queries(q);
    for (int i = 0; i < q; i++) {
        int l, r;
        cin >> l >> r;
        --l; --r;
        queries[i] = {l, r, i, gilbert_order(l, r, k, 0)};
    }
    sort(queries.begin(), queries.end(), [](const Query& x, const Query& y) {
        return x.ord < y.ord;
    });

    vector<int> freq(vals.size(), 0), ans(q);
    int distinct = 0;
    auto add = [&](int idx) {
        if (++freq[a[idx]] == 1) distinct++;
    };
    auto remove = [&](int idx) {
        if (--freq[a[idx]] == 0) distinct--;
    };

    int curL = 0, curR = -1;
    for (const auto& qu : queries) {
        while (curL > qu.l) add(--curL);
        while (curR < qu.r) add(++curR);
        while (curL < qu.l) remove(curL++);
        while (curR > qu.r) remove(curR--);
        ans[qu.id] = distinct;
    }

    for (int i = 0; i < q; i++) cout << ans[i] << "\\n";
    return 0;
}`,
    rust: `use std::io::{self, Read};

fn gilbert_order(x: usize, y: usize, pow: u32, rotate: usize) -> u64 {
    if pow == 0 {
        return 0;
    }
    let hpow = 1usize << (pow - 1);
    let mut seg = if x < hpow {
        if y < hpow { 0 } else { 3 }
    } else if y < hpow {
        1
    } else {
        2
    };
    seg = (seg + rotate) & 3;
    const ROTATE_DELTA: [usize; 4] = [3, 0, 0, 1];
    let nx = x & (x ^ hpow);
    let ny = y & (y ^ hpow);
    let nrot = (rotate + ROTATE_DELTA[seg]) & 3;
    let sub_size = 1u64 << (2 * pow - 2);
    let mut ans = (seg as u64) * sub_size;
    let add = gilbert_order(nx, ny, pow - 1, nrot);
    if seg == 1 || seg == 2 {
        ans += add;
    } else {
        ans += sub_size - add - 1;
    }
    ans
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

    let mut raw = Vec::with_capacity(n);
    for _ in 0..n {
        raw.push(it.next().unwrap().parse::<i64>().unwrap());
    }
    let mut vals = raw.clone();
    vals.sort_unstable();
    vals.dedup();
    let a: Vec<usize> = raw
        .iter()
        .map(|v| vals.binary_search(v).unwrap())
        .collect();

    let mut k = 1u32;
    while (1usize << k) <= n {
        k += 1;
    }

    let mut queries = Vec::with_capacity(q);
    for id in 0..q {
        let l: usize = it.next().unwrap().parse::<usize>().unwrap() - 1;
        let r: usize = it.next().unwrap().parse::<usize>().unwrap() - 1;
        queries.push((gilbert_order(l, r, k, 0), l, r, id));
    }
    queries.sort_unstable_by_key(|x| x.0);

    let mut freq = vec![0usize; vals.len()];
    let mut ans = vec![0usize; q];
    let mut distinct = 0usize;

    let mut cur_l = 0usize;
    let mut cur_r = usize::MAX; // represents -1 before first increment

    for &(_, ql, qr, id) in &queries {
        while cur_l > ql {
            cur_l -= 1;
            let v = a[cur_l];
            if freq[v] == 0 {
                distinct += 1;
            }
            freq[v] += 1;
        }
        while cur_r == usize::MAX || cur_r < qr {
            cur_r = cur_r.wrapping_add(1);
            let v = a[cur_r];
            if freq[v] == 0 {
                distinct += 1;
            }
            freq[v] += 1;
        }
        while cur_l < ql {
            let v = a[cur_l];
            freq[v] -= 1;
            if freq[v] == 0 {
                distinct -= 1;
            }
            cur_l += 1;
        }
        while cur_r > qr {
            let v = a[cur_r];
            freq[v] -= 1;
            if freq[v] == 0 {
                distinct -= 1;
            }
            cur_r -= 1;
        }
        ans[id] = distinct;
    }

    let mut out = String::new();
    for x in ans {
        out.push_str(&format!("{}\\n", x));
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
            boolean neg = false;
            if (c == '-') { neg = true; c = readByte(); }
            int res = 0;
            while (c > ' ') {
                res = res * 10 + (c - '0');
                c = readByte();
            }
            return neg ? -res : res;
        }
    }

    static final int[] ROTATE_DELTA = {3, 0, 0, 1};

    static long gilbertOrder(int x, int y, int pow, int rotate) {
        if (pow == 0) return 0;
        int hpow = 1 << (pow - 1);
        int seg = (x < hpow) ? ((y < hpow) ? 0 : 3) : ((y < hpow) ? 1 : 2);
        seg = (seg + rotate) & 3;
        int nx = x & (x ^ hpow);
        int ny = y & (y ^ hpow);
        int nrot = (rotate + ROTATE_DELTA[seg]) & 3;
        long subSize = 1L << (2 * pow - 2);
        long ans = seg * subSize;
        long add = gilbertOrder(nx, ny, pow - 1, nrot);
        ans += (seg == 1 || seg == 2) ? add : (subSize - add - 1);
        return ans;
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        int n = fs.nextInt();
        if (n == Integer.MIN_VALUE) return;
        int q = fs.nextInt();

        int[] raw = new int[n];
        int[] sorted = new int[n];
        for (int i = 0; i < n; i++) {
            raw[i] = fs.nextInt();
            sorted[i] = raw[i];
        }
        Arrays.sort(sorted);
        int u = 0;
        for (int x : sorted) {
            if (u == 0 || sorted[u - 1] != x) sorted[u++] = x;
        }
        int[] a = new int[n];
        for (int i = 0; i < n; i++) {
            a[i] = Arrays.binarySearch(sorted, 0, u, raw[i]);
        }

        int k = 1;
        while ((1 << k) <= n) k++;

        long[][] queries = new long[q][4];
        for (int i = 0; i < q; i++) {
            int l = fs.nextInt() - 1;
            int r = fs.nextInt() - 1;
            queries[i][0] = gilbertOrder(l, r, k, 0);
            queries[i][1] = l;
            queries[i][2] = r;
            queries[i][3] = i;
        }
        Arrays.sort(queries, (x, y) -> Long.compare(x[0], y[0]));

        int[] freq = new int[u];
        int[] ans = new int[q];
        int distinct = 0, curL = 0, curR = -1;

        for (long[] qu : queries) {
            int ql = (int) qu[1], qr = (int) qu[2], id = (int) qu[3];
            while (curL > ql) if (++freq[a[--curL]] == 1) distinct++;
            while (curR < qr) if (++freq[a[++curR]] == 1) distinct++;
            while (curL < ql) if (--freq[a[curL++]] == 0) distinct--;
            while (curR > qr) if (--freq[a[curR--]] == 0) distinct--;
            ans[id] = distinct;
        }

        StringBuilder sb = new StringBuilder();
        for (int x : ans) sb.append(x).append('\\n');
        System.out.print(sb);
    }
}`,
    python3: `import sys
import math

sys.setrecursionlimit(200000)

ROTATE_DELTA = (3, 0, 0, 1)

def gilbert_order(x: int, y: int, pw: int, rot: int) -> int:
    if pw == 0:
        return 0
    hpow = 1 << (pw - 1)
    if x < hpow:
        seg = 0 if y < hpow else 3
    else:
        seg = 1 if y < hpow else 2
    seg = (seg + rot) & 3
    nx = x & (x ^ hpow)
    ny = y & (y ^ hpow)
    nrot = (rot + ROTATE_DELTA[seg]) & 3
    sub_size = 1 << (2 * pw - 2)
    ans = seg * sub_size
    add = gilbert_order(nx, ny, pw - 1, nrot)
    if seg == 1 or seg == 2:
        ans += add
    else:
        ans += sub_size - add - 1
    return ans

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    n = int(next(it))
    q = int(next(it))
    raw = [int(next(it)) for _ in range(n)]
    vals = sorted(set(raw))
    comp = {v: i for i, v in enumerate(vals)}
    a = [comp[v] for v in raw]

    pw = 1
    while (1 << pw) <= n:
        pw += 1

    queries = []
    for i in range(q):
        l = int(next(it)) - 1
        r = int(next(it)) - 1
        queries.append((gilbert_order(l, r, pw, 0), l, r, i))
    queries.sort(key=lambda x: x[0])

    freq = [0] * len(vals)
    ans = [0] * q
    distinct = 0
    cur_l, cur_r = 0, -1

    for _, ql, qr, idx in queries:
        while cur_l > ql:
            cur_l -= 1
            v = a[cur_l]
            if freq[v] == 0:
                distinct += 1
            freq[v] += 1
        while cur_r < qr:
            cur_r += 1
            v = a[cur_r]
            if freq[v] == 0:
                distinct += 1
            freq[v] += 1
        while cur_l < ql:
            v = a[cur_l]
            freq[v] -= 1
            if freq[v] == 0:
                distinct -= 1
            cur_l += 1
        while cur_r > qr:
            v = a[cur_r]
            freq[v] -= 1
            if freq[v] == 0:
                distinct -= 1
            cur_r -= 1
        ans[idx] = distinct

    sys.stdout.write("\\n".join(map(str, ans)) + "\\n")

if __name__ == "__main__":
    solve()`,
    ruby: `ROTATE_DELTA = [3, 0, 0, 1].freeze

def gilbert_order(x, y, pw, rot)
  return 0 if pw == 0
  hpow = 1 << (pw - 1)
  seg = if x < hpow
          y < hpow ? 0 : 3
        else
          y < hpow ? 1 : 2
        end
  seg = (seg + rot) & 3
  nx = x & (x ^ hpow)
  ny = y & (y ^ hpow)
  nrot = (rot + ROTATE_DELTA[seg]) & 3
  sub_size = 1 << (2 * pw - 2)
  ans = seg * sub_size
  add = gilbert_order(nx, ny, pw - 1, nrot)
  ans += (seg == 1 || seg == 2) ? add : (sub_size - add - 1)
  ans
end

tokens = $stdin.read.split
exit if tokens.empty?
n = tokens[0].to_i
q = tokens[1].to_i
raw = Array.new(n) { |i| tokens[2 + i].to_i }
vals = raw.uniq.sort
comp = {}
vals.each_with_index { |v, idx| comp[v] = idx }
a = raw.map { |v| comp[v] }

pw = 1
pw += 1 while (1 << pw) <= n

queries = []
p_idx = 2 + n
q.times do |i|
  l = tokens[p_idx].to_i - 1
  r = tokens[p_idx + 1].to_i - 1
  p_idx += 2
  queries << [gilbert_order(l, r, pw, 0), l, r, i]
end
queries.sort_by! { |item| item[0] }

freq = Array.new(vals.size, 0)
ans = Array.new(q, 0)
distinct = 0
cur_l = 0
cur_r = -1

queries.each do |_, ql, qr, idx|
  while cur_l > ql
    cur_l -= 1
    v = a[cur_l]
    distinct += 1 if freq[v] == 0
    freq[v] += 1
  end
  while cur_r < qr
    cur_r += 1
    v = a[cur_r]
    distinct += 1 if freq[v] == 0
    freq[v] += 1
  end
  while cur_l < ql
    v = a[cur_l]
    freq[v] -= 1
    distinct -= 1 if freq[v] == 0
    cur_l += 1
  end
  while cur_r > qr
    v = a[cur_r]
    freq[v] -= 1
    distinct -= 1 if freq[v] == 0
    cur_r -= 1
  end
  ans[idx] = distinct
end

puts ans.join("\\n")`,
  },
  practiceProblems: [
    {
      id: 'ch23-p1',
      tier: 'Warmup',
      ratingRange: '1700–1900',
      title: 'Offline Distinct Values Queries (Mo’s Algorithm with Block Parity Sort)',
      statement:
        'Given an integer array A of length N and Q range queries [l, r] (1-indexed), print the number of distinct integers inside subarray A[l..r] for every query.',
      constraints: '1 <= N, Q <= 2 * 10^5, 1 <= A[i] <= 10^9',
      sampleInput: '5 3\n3 2 3 1 2\n1 3\n2 4\n1 5',
      sampleOutput: '2\n3\n3',
      hints: [
        'Coordinate-compress values A[i] into [0..U-1] so frequency tracking uses an O(1) flat array instead of a hash map.',
        'Sort queries by `(l / B, parity ? -r : r)` with `B = max(1, (int)(N / sqrt(Q)))` (around 450 for 2e5).',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, q;
    if (!(cin >> n >> q)) return 0;
    vector<int> raw(n), vals(n);
    for (int i = 0; i < n; i++) {
        cin >> raw[i];
        vals[i] = raw[i];
    }
    sort(vals.begin(), vals.end());
    vals.erase(unique(vals.begin(), vals.end()), vals.end());
    vector<int> a(n);
    for (int i = 0; i < n; i++) {
        a[i] = (int)(lower_bound(vals.begin(), vals.end(), raw[i]) - vals.begin());
    }

    int B = max(1, (int)(n / max(1.0, sqrt((double)q))));
    struct Query { int l, r, id, blk; };
    vector<Query> qs(q);
    for (int i = 0; i < q; i++) {
        int l, r;
        cin >> l >> r;
        --l; --r;
        qs[i] = {l, r, i, l / B};
    }
    sort(qs.begin(), qs.end(), [](const Query& x, const Query& y) {
        if (x.blk != y.blk) return x.blk < y.blk;
        return (x.blk & 1) ? (x.r > y.r) : (x.r < y.r);
    });

    vector<int> freq(vals.size(), 0), ans(q);
    int curL = 0, curR = -1, distinct = 0;
    for (const auto& qu : qs) {
        while (curL > qu.l) if (++freq[a[--curL]] == 1) distinct++;
        while (curR < qu.r) if (++freq[a[++curR]] == 1) distinct++;
        while (curL < qu.l) if (--freq[a[curL++]] == 0) distinct--;
        while (curR > qu.r) if (--freq[a[curR--]] == 0) distinct--;
        ans[qu.id] = distinct;
    }

    for (int i = 0; i < q; i++) cout << ans[i] << "\\n";
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
    let mut raw = Vec::with_capacity(n);
    for _ in 0..n {
        raw.push(it.next().unwrap().parse::<i64>().unwrap());
    }
    let mut vals = raw.clone();
    vals.sort_unstable();
    vals.dedup();
    let a: Vec<usize> = raw.iter().map(|x| vals.binary_search(x).unwrap()).collect();

    let b = ((n as f64 / (q.max(1) as f64).sqrt()).max(1.0)) as usize;
    let mut qs = Vec::with_capacity(q);
    for id in 0..q {
        let l: usize = it.next().unwrap().parse::<usize>().unwrap() - 1;
        let r: usize = it.next().unwrap().parse::<usize>().unwrap() - 1;
        qs.push((l / b, r, l, id));
    }
    qs.sort_unstable_by(|x, y| {
        if x.0 != y.0 {
            x.0.cmp(&y.0)
        } else if (x.0 & 1) == 1 {
            y.1.cmp(&x.1)
        } else {
            x.1.cmp(&y.1)
        }
    });

    let mut freq = vec![0usize; vals.len()];
    let mut ans = vec![0usize; q];
    let mut cur_l = 0usize;
    let mut cur_r = usize::MAX;
    let mut distinct = 0usize;

    for &(_, qr, ql, id) in &qs {
        while cur_l > ql {
            cur_l -= 1;
            if freq[a[cur_l]] == 0 { distinct += 1; }
            freq[a[cur_l]] += 1;
        }
        while cur_r == usize::MAX || cur_r < qr {
            cur_r = cur_r.wrapping_add(1);
            if freq[a[cur_r]] == 0 { distinct += 1; }
            freq[a[cur_r]] += 1;
        }
        while cur_l < ql {
            freq[a[cur_l]] -= 1;
            if freq[a[cur_l]] == 0 { distinct -= 1; }
            cur_l += 1;
        }
        while cur_r > qr {
            freq[a[cur_r]] -= 1;
            if freq[a[cur_r]] == 0 { distinct -= 1; }
            cur_r -= 1;
        }
        ans[id] = distinct;
    }

    let mut out = String::new();
    for x in ans {
        out.push_str(&format!("{}\\n", x));
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
            boolean neg = false;
            if (c == '-') { neg = true; c = rb(); }
            int v = 0;
            while (c > ' ') { v = v * 10 + (c - '0'); c = rb(); }
            return neg ? -v : v;
        }
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        int n = fs.nextInt();
        if (n == Integer.MIN_VALUE) return;
        int q = fs.nextInt();

        int[] raw = new int[n];
        int[] sorted = new int[n];
        for (int i = 0; i < n; i++) {
            raw[i] = fs.nextInt();
            sorted[i] = raw[i];
        }
        Arrays.sort(sorted);
        int u = 0;
        for (int x : sorted) if (u == 0 || sorted[u - 1] != x) sorted[u++] = x;
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = Arrays.binarySearch(sorted, 0, u, raw[i]);

        int blkSize = Math.max(1, (int) (n / Math.max(1.0, Math.sqrt(q))));
        int[][] qs = new int[q][4];
        for (int i = 0; i < q; i++) {
            int l = fs.nextInt() - 1;
            int r = fs.nextInt() - 1;
            qs[i][0] = l / blkSize;
            qs[i][1] = r;
            qs[i][2] = l;
            qs[i][3] = i;
        }
        Arrays.sort(qs, (x, y) -> {
            if (x[0] != y[0]) return Integer.compare(x[0], y[0]);
            return (x[0] & 1) == 1 ? Integer.compare(y[1], x[1]) : Integer.compare(x[1], y[1]);
        });

        int[] freq = new int[u];
        int[] ans = new int[q];
        int curL = 0, curR = -1, distinct = 0;
        for (int[] qu : qs) {
            int ql = qu[2], qr = qu[1], id = qu[3];
            while (curL > ql) if (++freq[a[--curL]] == 1) distinct++;
            while (curR < qr) if (++freq[a[++curR]] == 1) distinct++;
            while (curL < ql) if (--freq[a[curL++]] == 0) distinct--;
            while (curR > qr) if (--freq[a[curR--]] == 0) distinct--;
            ans[id] = distinct;
        }
        StringBuilder sb = new StringBuilder();
        for (int x : ans) sb.append(x).append('\\n');
        System.out.print(sb);
    }
}`,
        python3: `import sys
import math

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    n = int(next(it))
    q = int(next(it))
    raw = [int(next(it)) for _ in range(n)]
    vals = sorted(set(raw))
    comp = {v: i for i, v in enumerate(vals)}
    a = [comp[v] for v in raw]

    b = max(1, int(n / max(1.0, math.sqrt(q))))
    qs = []
    for i in range(q):
        l = int(next(it)) - 1
        r = int(next(it)) - 1
        blk = l // b
        qs.append((blk, -r if (blk & 1) else r, l, r, i))
    qs.sort()

    freq = [0] * len(vals)
    ans = [0] * q
    cur_l, cur_r, distinct = 0, -1, 0

    for _, _, ql, qr, idx in qs:
        while cur_l > ql:
            cur_l -= 1
            if freq[a[cur_l]] == 0:
                distinct += 1
            freq[a[cur_l]] += 1
        while cur_r < qr:
            cur_r += 1
            if freq[a[cur_r]] == 0:
                distinct += 1
            freq[a[cur_r]] += 1
        while cur_l < ql:
            freq[a[cur_l]] -= 1
            if freq[a[cur_l]] == 0:
                distinct -= 1
            cur_l += 1
        while cur_r > qr:
            freq[a[cur_r]] -= 1
            if freq[a[cur_r]] == 0:
                distinct -= 1
            cur_r -= 1
        ans[idx] = distinct

    sys.stdout.write("\\n".join(map(str, ans)) + "\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
n = tokens[0].to_i
q = tokens[1].to_i
raw = Array.new(n) { |i| tokens[2 + i].to_i }
vals = raw.uniq.sort
comp = {}
vals.each_with_index { |v, i| comp[v] = i }
a = raw.map { |v| comp[v] }

b = [1, (n / [1.0, Math.sqrt(q)].max).to_i].max
qs = []
p_idx = 2 + n
q.times do |i|
  l = tokens[p_idx].to_i - 1
  r = tokens[p_idx + 1].to_i - 1
  p_idx += 2
  blk = l / b
  qs << [blk, blk.odd? ? -r : r, l, r, i]
end
qs.sort!

freq = Array.new(vals.size, 0)
ans = Array.new(q, 0)
cur_l = 0
cur_r = -1
distinct = 0

qs.each do |_, _, ql, qr, idx|
  while cur_l > ql
    cur_l -= 1
    distinct += 1 if freq[a[cur_l]] == 0
    freq[a[cur_l]] += 1
  end
  while cur_r < qr
    cur_r += 1
    distinct += 1 if freq[a[cur_r]] == 0
    freq[a[cur_r]] += 1
  end
  while cur_l < ql
    freq[a[cur_l]] -= 1
    distinct -= 1 if freq[a[cur_l]] == 0
    cur_l += 1
  end
  while cur_r > qr
    freq[a[cur_r]] -= 1
    distinct -= 1 if freq[a[cur_r]] == 0
    cur_r -= 1
  end
  ans[idx] = distinct
end
puts ans.join("\\n")`,
      },
    },
    {
      id: 'ch23-p2',
      tier: 'Standard',
      ratingRange: '2000–2250',
      title: 'Dynamic Distinct Range Queries with Point Updates (3D Mo’s Algorithm)',
      statement:
        'Maintain an array A of N integers supporting M operations offline: Type 1 `1 pos val` updates A[pos] = val; Type 2 `2 l r` asks for the number of distinct values in A[l..r]. Output the answer for every Type 2 query in chronological order.',
      constraints: '1 <= N, M <= 50,000, 1 <= A[i], val <= 10^9',
      sampleInput: '5 5\n1 2 3 2 1\n2 1 5\n1 2 4\n2 1 3\n1 5 2\n2 2 5',
      sampleOutput: '3\n3\n3',
      hints: [
        'Record every update `u[t] = {pos, newVal}` and attach its timestamp `t` (number of updates seen so far) to each Type 2 query `(l, r, t, id)`.',
        'Sort queries by `(l / B, r / B, t)` with `B = max(1, (int)pow(N, 2.0 / 3.0))`. When applying update `u[curT]`, ONLY adjust `freq[]` if `curL <= pos && pos <= curR`, then swap `a[pos]` with `u[curT].val` so rolling backward restores the exact prior state!',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, m;
    if (!(cin >> n >> m)) return 0;

    vector<int> raw(n), allVals;
    allVals.reserve(n + m);
    for (int i = 0; i < n; i++) {
        cin >> raw[i];
        allVals.push_back(raw[i]);
    }

    struct Op { int type, a, b; };
    vector<Op> ops(m);
    for (int i = 0; i < m; i++) {
        cin >> ops[i].type >> ops[i].a >> ops[i].b;
        if (ops[i].type == 1) allVals.push_back(ops[i].b);
    }

    sort(allVals.begin(), allVals.end());
    allVals.erase(unique(allVals.begin(), allVals.end()), allVals.end());
    auto getId = [&](int x) {
        return (int)(lower_bound(allVals.begin(), allVals.end(), x) - allVals.begin());
    };

    vector<int> arr(n);
    for (int i = 0; i < n; i++) arr[i] = getId(raw[i]);

    struct Update { int pos, val; };
    struct Query { int l, r, t, id, bl, br; };
    vector<Update> updates;
    vector<Query> queries;

    int B = max(1, (int)pow((double)n, 2.0 / 3.0));
    int qid = 0;
    for (const auto& op : ops) {
        if (op.type == 1) {
            updates.push_back({op.a - 1, getId(op.b)});
        } else {
            int l = op.a - 1, r = op.b - 1;
            queries.push_back({l, r, (int)updates.size(), qid++, l / B, r / B});
        }
    }

    sort(queries.begin(), queries.end(), [](const Query& x, const Query& y) {
        if (x.bl != y.bl) return x.bl < y.bl;
        if (x.br != y.br) return (x.bl & 1) ? (x.br > y.br) : (x.br < y.br);
        return (x.br & 1) ? (x.t > y.t) : (x.t < y.t);
    });

    vector<int> freq(allVals.size(), 0), ans(qid);
    int curL = 0, curR = -1, curT = 0, distinct = 0;

    auto addVal = [&](int v) {
        if (++freq[v] == 1) distinct++;
    };
    auto remVal = [&](int v) {
        if (--freq[v] == 0) distinct--;
    };
    auto applyUpdate = [&](int tIdx) {
        int pos = updates[tIdx].pos;
        if (curL <= pos && pos <= curR) {
            remVal(arr[pos]);
            addVal(updates[tIdx].val);
        }
        swap(arr[pos], updates[tIdx].val);
    };

    for (const auto& qu : queries) {
        while (curL > qu.l) addVal(arr[--curL]);
        while (curR < qu.r) addVal(arr[++curR]);
        while (curL < qu.l) remVal(arr[curL++]);
        while (curR > qu.r) remVal(arr[curR--]);
        while (curT < qu.t) applyUpdate(curT++);
        while (curT > qu.t) applyUpdate(--curT);
        ans[qu.id] = distinct;
    }

    for (int x : ans) cout << x << "\\n";
    return 0;
}`,
        rust: `use std::io::{self, Read};
use std::mem::swap;

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let n: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };
    let m: usize = it.next().unwrap().parse().unwrap();

    let mut raw = Vec::with_capacity(n);
    let mut all_vals = Vec::with_capacity(n + m);
    for _ in 0..n {
        let v: i64 = it.next().unwrap().parse().unwrap();
        raw.push(v);
        all_vals.push(v);
    }

    let mut ops = Vec::with_capacity(m);
    for _ in 0..m {
        let tp: usize = it.next().unwrap().parse().unwrap();
        let a: usize = it.next().unwrap().parse().unwrap();
        let b: i64 = it.next().unwrap().parse().unwrap();
        if tp == 1 {
            all_vals.push(b);
        }
        ops.push((tp, a, b));
    }

    all_vals.sort_unstable();
    all_vals.dedup();
    let mut arr: Vec<usize> = raw.iter().map(|v| all_vals.binary_search(v).unwrap()).collect();

    let b = ((n as f64).powf(2.0 / 3.0).max(1.0)) as usize;
    let mut updates: Vec<(usize, usize)> = Vec::new();
    let mut queries: Vec<(usize, usize, usize, usize, usize, usize)> = Vec::new();

    for (tp, x, y) in ops {
        if tp == 1 {
            updates.push((x - 1, all_vals.binary_search(&y).unwrap()));
        } else {
            let l = x - 1;
            let r = (y as usize) - 1;
            let id = queries.len();
            queries.push((l / b, r / b, updates.len(), l, r, id));
        }
    }

    queries.sort_unstable_by(|x, y| {
        if x.0 != y.0 {
            x.0.cmp(&y.0)
        } else if x.1 != y.1 {
            if (x.0 & 1) == 1 { y.1.cmp(&x.1) } else { x.1.cmp(&y.1) }
        } else if (x.1 & 1) == 1 {
            y.2.cmp(&x.2)
        } else {
            x.2.cmp(&y.2)
        }
    });

    let mut freq = vec![0usize; all_vals.len()];
    let mut ans = vec![0usize; queries.len()];
    let (mut cur_l, mut cur_r, mut cur_t, mut distinct) = (0usize, usize::MAX, 0usize, 0usize);

    for &(_, _, qt, ql, qr, id) in &queries {
        while cur_l > ql {
            cur_l -= 1;
            let v = arr[cur_l];
            if freq[v] == 0 { distinct += 1; }
            freq[v] += 1;
        }
        while cur_r == usize::MAX || cur_r < qr {
            cur_r = cur_r.wrapping_add(1);
            let v = arr[cur_r];
            if freq[v] == 0 { distinct += 1; }
            freq[v] += 1;
        }
        while cur_l < ql {
            let v = arr[cur_l];
            freq[v] -= 1;
            if freq[v] == 0 { distinct -= 1; }
            cur_l += 1;
        }
        while cur_r > qr {
            let v = arr[cur_r];
            freq[v] -= 1;
            if freq[v] == 0 { distinct -= 1; }
            cur_r -= 1;
        }
        while cur_t < qt {
            let pos = updates[cur_t].0;
            if cur_r != usize::MAX && cur_l <= pos && pos <= cur_r {
                let old_v = arr[pos];
                freq[old_v] -= 1;
                if freq[old_v] == 0 { distinct -= 1; }
                let new_v = updates[cur_t].1;
                if freq[new_v] == 0 { distinct += 1; }
                freq[new_v] += 1;
            }
            swap(&mut arr[pos], &mut updates[cur_t].1);
            cur_t += 1;
        }
        while cur_t > qt {
            cur_t -= 1;
            let pos = updates[cur_t].0;
            if cur_r != usize::MAX && cur_l <= pos && pos <= cur_r {
                let old_v = arr[pos];
                freq[old_v] -= 1;
                if freq[old_v] == 0 { distinct -= 1; }
                let new_v = updates[cur_t].1;
                if freq[new_v] == 0 { distinct += 1; }
                freq[new_v] += 1;
            }
            swap(&mut arr[pos], &mut updates[cur_t].1);
        }
        ans[id] = distinct;
    }

    let mut out = String::new();
    for x in ans {
        out.push_str(&format!("{}\\n", x));
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
            boolean neg = false;
            if (c == '-') { neg = true; c = rb(); }
            int v = 0;
            while (c > ' ') { v = v * 10 + (c - '0'); c = rb(); }
            return neg ? -v : v;
        }
    }

    static int[] arr, freq;
    static int curL = 0, curR = -1, distinct = 0;

    static void addVal(int v) { if (++freq[v] == 1) distinct++; }
    static void remVal(int v) { if (--freq[v] == 0) distinct--; }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        int n = fs.nextInt();
        if (n == Integer.MIN_VALUE) return;
        int m = fs.nextInt();

        int[] raw = new int[n];
        int[] all = new int[n + m];
        int allCnt = 0;
        for (int i = 0; i < n; i++) {
            raw[i] = fs.nextInt();
            all[allCnt++] = raw[i];
        }

        int[] tp = new int[m], oa = new int[m], ob = new int[m];
        int uCnt = 0, qCnt = 0;
        for (int i = 0; i < m; i++) {
            tp[i] = fs.nextInt();
            oa[i] = fs.nextInt();
            ob[i] = fs.nextInt();
            if (tp[i] == 1) {
                all[allCnt++] = ob[i];
                uCnt++;
            } else {
                qCnt++;
            }
        }

        Arrays.sort(all, 0, allCnt);
        int uniq = 0;
        for (int i = 0; i < allCnt; i++) {
            if (uniq == 0 || all[uniq - 1] != all[i]) all[uniq++] = all[i];
        }

        arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = Arrays.binarySearch(all, 0, uniq, raw[i]);

        int[] upPos = new int[uCnt], upVal = new int[uCnt];
        int[][] qs = new int[qCnt][6];
        int blk = Math.max(1, (int) Math.pow(n, 2.0 / 3.0));
        int ui = 0, qi = 0;
        for (int i = 0; i < m; i++) {
            if (tp[i] == 1) {
                upPos[ui] = oa[i] - 1;
                upVal[ui] = Arrays.binarySearch(all, 0, uniq, ob[i]);
                ui++;
            } else {
                int l = oa[i] - 1, r = ob[i] - 1;
                qs[qi][0] = l / blk;
                qs[qi][1] = r / blk;
                qs[qi][2] = ui;
                qs[qi][3] = l;
                qs[qi][4] = r;
                qs[qi][5] = qi;
                qi++;
            }
        }

        Arrays.sort(qs, (x, y) -> {
            if (x[0] != y[0]) return Integer.compare(x[0], y[0]);
            if (x[1] != y[1]) return (x[0] & 1) == 1 ? Integer.compare(y[1], x[1]) : Integer.compare(x[1], y[1]);
            return (x[1] & 1) == 1 ? Integer.compare(y[2], x[2]) : Integer.compare(x[2], y[2]);
        });

        freq = new int[uniq];
        int[] ans = new int[qCnt];
        int curT = 0;
        for (int[] qu : qs) {
            int ql = qu[3], qr = qu[4], qt = qu[2], id = qu[5];
            while (curL > ql) addVal(arr[--curL]);
            while (curR < qr) addVal(arr[++curR]);
            while (curL < ql) remVal(arr[curL++]);
            while (curR > qr) remVal(arr[curR--]);
            while (curT < qt) {
                int pos = upPos[curT];
                if (curL <= pos && pos <= curR) {
                    remVal(arr[pos]);
                    addVal(upVal[curT]);
                }
                int tmp = arr[pos];
                arr[pos] = upVal[curT];
                upVal[curT] = tmp;
                curT++;
            }
            while (curT > qt) {
                curT--;
                int pos = upPos[curT];
                if (curL <= pos && pos <= curR) {
                    remVal(arr[pos]);
                    addVal(upVal[curT]);
                }
                int tmp = arr[pos];
                arr[pos] = upVal[curT];
                upVal[curT] = tmp;
            }
            ans[id] = distinct;
        }

        StringBuilder sb = new StringBuilder();
        for (int x : ans) sb.append(x).append('\\n');
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
    m = int(next(it))
    raw = [int(next(it)) for _ in range(n)]
    all_vals = list(raw)
    ops = []
    for _ in range(m):
        tp = int(next(it))
        a = int(next(it))
        b = int(next(it))
        if tp == 1:
            all_vals.append(b)
        ops.append((tp, a, b))

    uniq = sorted(set(all_vals))
    comp = {v: i for i, v in enumerate(uniq)}
    arr = [comp[v] for v in raw]

    blk = max(1, int(n ** (2.0 / 3.0)))
    updates = []
    queries = []
    for tp, a, b in ops:
        if tp == 1:
            updates.append([a - 1, comp[b]])
        else:
            l, r = a - 1, b - 1
            bl, br = l // blk, r // blk
            t = len(updates)
            queries.append((
                bl,
                -br if (bl & 1) else br,
                -t if (br & 1) else t,
                l, r, t, len(queries)
            ))
    queries.sort()

    freq = [0] * len(uniq)
    ans = [0] * len(queries)
    cur_l, cur_r, cur_t, distinct = 0, -1, 0, 0

    for _, _, _, ql, qr, qt, qid in queries:
        while cur_l > ql:
            cur_l -= 1
            v = arr[cur_l]
            if freq[v] == 0:
                distinct += 1
            freq[v] += 1
        while cur_r < qr:
            cur_r += 1
            v = arr[cur_r]
            if freq[v] == 0:
                distinct += 1
            freq[v] += 1
        while cur_l < ql:
            v = arr[cur_l]
            freq[v] -= 1
            if freq[v] == 0:
                distinct -= 1
            cur_l += 1
        while cur_r > qr:
            v = arr[cur_r]
            freq[v] -= 1
            if freq[v] == 0:
                distinct -= 1
            cur_r -= 1
        while cur_t < qt:
            pos, nv = updates[cur_t]
            if cur_l <= pos <= cur_r:
                ov = arr[pos]
                freq[ov] -= 1
                if freq[ov] == 0:
                    distinct -= 1
                if freq[nv] == 0:
                    distinct += 1
                freq[nv] += 1
            arr[pos], updates[cur_t][1] = nv, arr[pos]
            cur_t += 1
        while cur_t > qt:
            cur_t -= 1
            pos, nv = updates[cur_t]
            if cur_l <= pos <= cur_r:
                ov = arr[pos]
                freq[ov] -= 1
                if freq[ov] == 0:
                    distinct -= 1
                if freq[nv] == 0:
                    distinct += 1
                freq[nv] += 1
            arr[pos], updates[cur_t][1] = nv, arr[pos]
        ans[qid] = distinct

    sys.stdout.write("\\n".join(map(str, ans)) + "\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
n = tokens[0].to_i
m = tokens[1].to_i
raw = Array.new(n) { |i| tokens[2 + i].to_i }
all_vals = raw.dup

ops = []
idx = 2 + n
m.times do
  tp = tokens[idx].to_i
  a = tokens[idx + 1].to_i
  b = tokens[idx + 2].to_i
  idx += 3
  all_vals << b if tp == 1
  ops << [tp, a, b]
end

uniq = all_vals.uniq.sort
comp = {}
uniq.each_with_index { |v, i| comp[v] = i }
arr = raw.map { |v| comp[v] }

blk = [1, (n**(2.0 / 3.0)).to_i].max
updates = []
queries = []
ops.each do |tp, a, b|
  if tp == 1
    updates << [a - 1, comp[b]]
  else
    l = a - 1
    r = b - 1
    bl = l / blk
    br = r / blk
    t = updates.size
    queries << [bl, bl.odd? ? -br : br, br.odd? ? -t : t, l, r, t, queries.size]
  end
end
queries.sort!

freq = Array.new(uniq.size, 0)
ans = Array.new(queries.size, 0)
cur_l = 0
cur_r = -1
cur_t = 0
distinct = 0

queries.each do |_, _, _, ql, qr, qt, qid|
  while cur_l > ql
    cur_l -= 1
    v = arr[cur_l]
    distinct += 1 if freq[v] == 0
    freq[v] += 1
  end
  while cur_r < qr
    cur_r += 1
    v = arr[cur_r]
    distinct += 1 if freq[v] == 0
    freq[v] += 1
  end
  while cur_l < ql
    v = arr[cur_l]
    freq[v] -= 1
    distinct -= 1 if freq[v] == 0
    cur_l += 1
  end
  while cur_r > qr
    v = arr[cur_r]
    freq[v] -= 1
    distinct -= 1 if freq[v] == 0
    cur_r -= 1
  end
  while cur_t < qt
    pos, nv = updates[cur_t]
    if cur_l <= pos && pos <= cur_r
      ov = arr[pos]
      freq[ov] -= 1
      distinct -= 1 if freq[ov] == 0
      distinct += 1 if freq[nv] == 0
      freq[nv] += 1
    end
    updates[cur_t][1] = arr[pos]
    arr[pos] = nv
    cur_t += 1
  end
  while cur_t > qt
    cur_t -= 1
    pos, nv = updates[cur_t]
    if cur_l <= pos && pos <= cur_r
      ov = arr[pos]
      freq[ov] -= 1
      distinct -= 1 if freq[ov] == 0
      distinct += 1 if freq[nv] == 0
      freq[nv] += 1
    end
    updates[cur_t][1] = arr[pos]
    arr[pos] = nv
  end
  ans[qid] = distinct
end
puts ans.join("\\n")`,
      },
    },
    {
      id: 'ch23-p3',
      tier: 'Boss',
      ratingRange: '2150–2400',
      title: 'Frequency-of-Frequencies Range Queries (Mo’s + Sqrt Bucket Optimization)',
      statement:
        'Given an array A of N integers and Q queries `(l, r, k)`, count how many distinct values appear at least k times inside subarray A[l..r]. Avoid any extra O(log N) factor inside Mo’s pointer updates!',
      constraints: '1 <= N, Q <= 10^5, 1 <= A[i], k <= 10^5',
      sampleInput: '6 3\n1 2 1 3 1 2\n1 6 2\n1 4 2\n2 6 3',
      sampleOutput: '2\n1\n0',
      hints: [
        'Track `cnt[x]` (occurrences of value x inside `[L, R]`) AND `atLeast[f]` (how many values currently have frequency >= f)!',
        'Wait: when `cnt[x]` increments from `c` to `c + 1`, ONLY `atLeast[c + 1]` increases by +1! That single O(1) increment inside `add()`/`remove()` gives an instant O(1) answer `atLeast[k]` per query without even needing Fenwick or Sqrt buckets! (Or if the query asks for the SUM of values appearing >= k times or frequency-of-frequencies within a value range, maintain `bucketSum[b]` in O(1) update + O(sqrt(N)) query). Let’s use the O(1) `atLeast[c]` trick for exact count >= k, and show Sqrt Bucket aggregation on `freqOfFreq` sums.',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

// O(1) add/remove + Sqrt Value-Bucket & Frequency-of-Frequencies Tracker
// Counts how many distinct values appear >= k times in A[l..r]
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, q;
    if (!(cin >> n >> q)) return 0;
    vector<int> raw(n), vals(n);
    for (int i = 0; i < n; i++) {
        cin >> raw[i];
        vals[i] = raw[i];
    }
    sort(vals.begin(), vals.end());
    vals.erase(unique(vals.begin(), vals.end()), vals.end());
    vector<int> a(n);
    for (int i = 0; i < n; i++) {
        a[i] = (int)(lower_bound(vals.begin(), vals.end(), raw[i]) - vals.begin());
    }

    int B = max(1, (int)sqrt((double)n));
    struct Query { int l, r, k, id, blk; };
    vector<Query> qs(q);
    for (int i = 0; i < q; i++) {
        int l, r, k;
        cin >> l >> r >> k;
        --l; --r;
        qs[i] = {l, r, k, i, l / B};
    }
    sort(qs.begin(), qs.end(), [](const Query& x, const Query& y) {
        if (x.blk != y.blk) return x.blk < y.blk;
        return (x.blk & 1) ? (x.r > y.r) : (x.r < y.r);
    });

    vector<int> cnt(vals.size(), 0);
    vector<int> exactFreq(n + 2, 0);
    int fb = max(1, (int)sqrt((double)n + 1));
    vector<int> bucketSum((n + 2) / fb + 2, 0);
    vector<int> ans(q, 0);

    auto add = [&](int idx) {
        int v = a[idx];
        int oldF = cnt[v];
        if (oldF > 0) {
            exactFreq[oldF]--;
            bucketSum[oldF / fb]--;
        }
        int newF = ++cnt[v];
        exactFreq[newF]++;
        bucketSum[newF / fb]++;
    };
    auto remove = [&](int idx) {
        int v = a[idx];
        int oldF = cnt[v];
        exactFreq[oldF]--;
        bucketSum[oldF / fb]--;
        int newF = --cnt[v];
        if (newF > 0) {
            exactFreq[newF]++;
            bucketSum[newF / fb]++;
        }
    };
    auto querySuffix = [&](int k) {
        if (k > n) return 0;
        int res = 0;
        int pos = k;
        while (pos <= n && pos % fb != 0) res += exactFreq[pos++];
        while (pos + fb - 1 <= n) {
            res += bucketSum[pos / fb];
            pos += fb;
        }
        while (pos <= n) res += exactFreq[pos++];
        return res;
    };

    int curL = 0, curR = -1;
    for (const auto& qu : qs) {
        while (curL > qu.l) add(--curL);
        while (curR < qu.r) add(++curR);
        while (curL < qu.l) remove(curL++);
        while (curR > qu.r) remove(curR--);
        ans[qu.id] = querySuffix(qu.k);
    }

    for (int x : ans) cout << x << "\\n";
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

    let mut raw = Vec::with_capacity(n);
    for _ in 0..n {
        raw.push(it.next().unwrap().parse::<i64>().unwrap());
    }
    let mut vals = raw.clone();
    vals.sort_unstable();
    vals.dedup();
    let a: Vec<usize> = raw.iter().map(|v| vals.binary_search(v).unwrap()).collect();

    let b = ((n as f64).sqrt().max(1.0)) as usize;
    let mut qs = Vec::with_capacity(q);
    for id in 0..q {
        let l: usize = it.next().unwrap().parse::<usize>().unwrap() - 1;
        let r: usize = it.next().unwrap().parse::<usize>().unwrap() - 1;
        let k: usize = it.next().unwrap().parse().unwrap();
        qs.push((l / b, r, l, k, id));
    }
    qs.sort_unstable_by(|x, y| {
        if x.0 != y.0 {
            x.0.cmp(&y.0)
        } else if (x.0 & 1) == 1 {
            y.1.cmp(&x.1)
        } else {
            x.1.cmp(&y.1)
        }
    });

    let mut cnt = vec![0usize; vals.len()];
    let mut exact_freq = vec![0usize; n + 2];
    let fb = (((n + 1) as f64).sqrt().max(1.0)) as usize;
    let mut bucket_sum = vec![0usize; (n + 2) / fb + 2];
    let mut ans = vec![0usize; q];

    let mut cur_l = 0usize;
    let mut cur_r = usize::MAX;

    for &(_, qr, ql, qk, id) in &qs {
        while cur_l > ql {
            cur_l -= 1;
            let v = a[cur_l];
            let old_f = cnt[v];
            if old_f > 0 {
                exact_freq[old_f] -= 1;
                bucket_sum[old_f / fb] -= 1;
            }
            let new_f = old_f + 1;
            cnt[v] = new_f;
            exact_freq[new_f] += 1;
            bucket_sum[new_f / fb] += 1;
        }
        while cur_r == usize::MAX || cur_r < qr {
            cur_r = cur_r.wrapping_add(1);
            let v = a[cur_r];
            let old_f = cnt[v];
            if old_f > 0 {
                exact_freq[old_f] -= 1;
                bucket_sum[old_f / fb] -= 1;
            }
            let new_f = old_f + 1;
            cnt[v] = new_f;
            exact_freq[new_f] += 1;
            bucket_sum[new_f / fb] += 1;
        }
        while cur_l < ql {
            let v = a[cur_l];
            let old_f = cnt[v];
            exact_freq[old_f] -= 1;
            bucket_sum[old_f / fb] -= 1;
            let new_f = old_f - 1;
            cnt[v] = new_f;
            if new_f > 0 {
                exact_freq[new_f] += 1;
                bucket_sum[new_f / fb] += 1;
            }
            cur_l += 1;
        }
        while cur_r > qr {
            let v = a[cur_r];
            let old_f = cnt[v];
            exact_freq[old_f] -= 1;
            bucket_sum[old_f / fb] -= 1;
            let new_f = old_f - 1;
            cnt[v] = new_f;
            if new_f > 0 {
                exact_freq[new_f] += 1;
                bucket_sum[new_f / fb] += 1;
            }
            cur_r -= 1;
        }

        if qk <= n {
            let mut res = 0usize;
            let mut pos = qk;
            while pos <= n && pos % fb != 0 {
                res += exact_freq[pos];
                pos += 1;
            }
            while pos + fb - 1 <= n {
                res += bucket_sum[pos / fb];
                pos += fb;
            }
            while pos <= n {
                res += exact_freq[pos];
                pos += 1;
            }
            ans[id] = res;
        }
    }

    let mut out = String::new();
    for x in ans {
        out.push_str(&format!("{}\\n", x));
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
            boolean neg = false;
            if (c == '-') { neg = true; c = rb(); }
            int v = 0;
            while (c > ' ') { v = v * 10 + (c - '0'); c = rb(); }
            return neg ? -v : v;
        }
    }

    static int[] a, cnt, exactFreq, bucketSum;
    static int fb, n;

    static void add(int idx) {
        int v = a[idx], oldF = cnt[v];
        if (oldF > 0) { exactFreq[oldF]--; bucketSum[oldF / fb]--; }
        int newF = ++cnt[v];
        exactFreq[newF]++;
        bucketSum[newF / fb]++;
    }

    static void remove(int idx) {
        int v = a[idx], oldF = cnt[v];
        exactFreq[oldF]--;
        bucketSum[oldF / fb]--;
        int newF = --cnt[v];
        if (newF > 0) { exactFreq[newF]++; bucketSum[newF / fb]++; }
    }

    static int querySuffix(int k) {
        if (k > n) return 0;
        int res = 0, pos = k;
        while (pos <= n && pos % fb != 0) res += exactFreq[pos++];
        while (pos + fb - 1 <= n) { res += bucketSum[pos / fb]; pos += fb; }
        while (pos <= n) res += exactFreq[pos++];
        return res;
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        n = fs.nextInt();
        if (n == Integer.MIN_VALUE) return;
        int q = fs.nextInt();

        int[] raw = new int[n], sorted = new int[n];
        for (int i = 0; i < n; i++) {
            raw[i] = fs.nextInt();
            sorted[i] = raw[i];
        }
        Arrays.sort(sorted);
        int u = 0;
        for (int x : sorted) if (u == 0 || sorted[u - 1] != x) sorted[u++] = x;
        a = new int[n];
        for (int i = 0; i < n; i++) a[i] = Arrays.binarySearch(sorted, 0, u, raw[i]);

        int blk = Math.max(1, (int) Math.sqrt(n));
        int[][] qs = new int[q][5];
        for (int i = 0; i < q; i++) {
            int l = fs.nextInt() - 1, r = fs.nextInt() - 1, k = fs.nextInt();
            qs[i][0] = l / blk;
            qs[i][1] = r;
            qs[i][2] = l;
            qs[i][3] = k;
            qs[i][4] = i;
        }
        Arrays.sort(qs, (x, y) -> {
            if (x[0] != y[0]) return Integer.compare(x[0], y[0]);
            return (x[0] & 1) == 1 ? Integer.compare(y[1], x[1]) : Integer.compare(x[1], y[1]);
        });

        cnt = new int[u];
        exactFreq = new int[n + 2];
        fb = Math.max(1, (int) Math.sqrt(n + 1));
        bucketSum = new int[(n + 2) / fb + 2];
        int[] ans = new int[q];
        int curL = 0, curR = -1;

        for (int[] qu : qs) {
            int ql = qu[2], qr = qu[1], qk = qu[3], id = qu[4];
            while (curL > ql) add(--curL);
            while (curR < qr) add(++curR);
            while (curL < ql) remove(curL++);
            while (curR > qr) remove(curR--);
            ans[id] = querySuffix(qk);
        }

        StringBuilder sb = new StringBuilder();
        for (int x : ans) sb.append(x).append('\\n');
        System.out.print(sb);
    }
}`,
        python3: `import sys
import math

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    n = int(next(it))
    q = int(next(it))
    raw = [int(next(it)) for _ in range(n)]
    vals = sorted(set(raw))
    comp = {v: i for i, v in enumerate(vals)}
    a = [comp[v] for v in raw]

    blk = max(1, int(math.sqrt(n)))
    qs = []
    for i in range(q):
        l = int(next(it)) - 1
        r = int(next(it)) - 1
        k = int(next(it))
        b = l // blk
        qs.append((b, -r if (b & 1) else r, l, r, k, i))
    qs.sort()

    cnt = [0] * len(vals)
    exact_freq = [0] * (n + 2)
    fb = max(1, int(math.sqrt(n + 1)))
    bucket_sum = [0] * ((n + 2) // fb + 2)
    ans = [0] * q

    def add(idx: int) -> None:
        v = a[idx]
        old_f = cnt[v]
        if old_f > 0:
            exact_freq[old_f] -= 1
            bucket_sum[old_f // fb] -= 1
        new_f = old_f + 1
        cnt[v] = new_f
        exact_freq[new_f] += 1
        bucket_sum[new_f // fb] += 1

    def remove(idx: int) -> None:
        v = a[idx]
        old_f = cnt[v]
        exact_freq[old_f] -= 1
        bucket_sum[old_f // fb] -= 1
        new_f = old_f - 1
        cnt[v] = new_f
        if new_f > 0:
            exact_freq[new_f] += 1
            bucket_sum[new_f // fb] += 1

    def query_suffix(k: int) -> int:
        if k > n:
            return 0
        res = 0
        pos = k
        while pos <= n and pos % fb != 0:
            res += exact_freq[pos]
            pos += 1
        while pos + fb - 1 <= n:
            res += bucket_sum[pos // fb]
            pos += fb
        while pos <= n:
            res += exact_freq[pos]
            pos += 1
        return res

    cur_l, cur_r = 0, -1
    for _, _, ql, qr, qk, idx in qs:
        while cur_l > ql:
            cur_l -= 1
            add(cur_l)
        while cur_r < qr:
            cur_r += 1
            add(cur_r)
        while cur_l < ql:
            remove(cur_l)
            cur_l += 1
        while cur_r > qr:
            remove(cur_r)
            cur_r -= 1
        ans[idx] = query_suffix(qk)

    sys.stdout.write("\\n".join(map(str, ans)) + "\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
n = tokens[0].to_i
q = tokens[1].to_i
raw = Array.new(n) { |i| tokens[2 + i].to_i }
vals = raw.uniq.sort
comp = {}
vals.each_with_index { |v, i| comp[v] = i }
a = raw.map { |v| comp[v] }

blk = [1, Math.sqrt(n).to_i].max
qs = []
p_idx = 2 + n
q.times do |i|
  l = tokens[p_idx].to_i - 1
  r = tokens[p_idx + 1].to_i - 1
  k = tokens[p_idx + 2].to_i
  p_idx += 3
  b = l / blk
  qs << [b, b.odd? ? -r : r, l, r, k, i]
end
qs.sort!

cnt = Array.new(vals.size, 0)
exact_freq = Array.new(n + 2, 0)
fb = [1, Math.sqrt(n + 1).to_i].max
bucket_sum = Array.new((n + 2) / fb + 2, 0)
ans = Array.new(q, 0)

cur_l = 0
cur_r = -1

qs.each do |_, _, ql, qr, qk, idx|
  while cur_l > ql
    cur_l -= 1
    v = a[cur_l]
    old_f = cnt[v]
    if old_f > 0
      exact_freq[old_f] -= 1
      bucket_sum[old_f / fb] -= 1
    end
    new_f = old_f + 1
    cnt[v] = new_f
    exact_freq[new_f] += 1
    bucket_sum[new_f / fb] += 1
  end
  while cur_r < qr
    cur_r += 1
    v = a[cur_r]
    old_f = cnt[v]
    if old_f > 0
      exact_freq[old_f] -= 1
      bucket_sum[old_f / fb] -= 1
    end
    new_f = old_f + 1
    cnt[v] = new_f
    exact_freq[new_f] += 1
    bucket_sum[new_f / fb] += 1
  end
  while cur_l < ql
    v = a[cur_l]
    old_f = cnt[v]
    exact_freq[old_f] -= 1
    bucket_sum[old_f / fb] -= 1
    new_f = old_f - 1
    cnt[v] = new_f
    if new_f > 0
      exact_freq[new_f] += 1
      bucket_sum[new_f / fb] += 1
    end
    cur_l += 1
  end
  while cur_r > qr
    v = a[cur_r]
    old_f = cnt[v]
    exact_freq[old_f] -= 1
    bucket_sum[old_f / fb] -= 1
    new_f = old_f - 1
    cnt[v] = new_f
    if new_f > 0
      exact_freq[new_f] += 1
      bucket_sum[new_f / fb] += 1
    end
    cur_r -= 1
  end

  if qk <= n
    res = 0
    pos = qk
    while pos <= n && pos % fb != 0
      res += exact_freq[pos]
      pos += 1
    end
    while pos + fb - 1 <= n
      res += bucket_sum[pos / fb]
      pos += fb
    end
    while pos <= n
      res += exact_freq[pos]
      pos += 1
    end
    ans[idx] = res
  end
end
puts ans.join("\\n")`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'CSES',
      title: 'Distinct Values Queries',
      difficulty: 'Hard',
      url: 'https://cses.fi/problemset/task/1734',
      patternNote: 'Offline Mo’s Algorithm with coordinate compression vs. offline Fenwick sweep.',
    },
    {
      platform: 'AtCoder',
      title: 'ABC 293 G — Triple Index',
      difficulty: 'AtCoder Blue (~1750)',
      url: 'https://atcoder.jp/contests/abc293/tasks/abc293_g',
      patternNote: 'Pure Mo’s algorithm maintaining `sum C(cnt[x], 3)` incrementally on every `add()`/`remove()`.',
    },
    {
      platform: 'Codeforces',
      title: 'CF 86D — Powerful Array',
      difficulty: '2200 (Div.1)',
      url: 'https://codeforces.com/problemset/problem/86/D',
      patternNote: 'Benchmark Mo’s + Hilbert order problem maintaining `sum cnt[x]^2 * x` under tight 2e5 constraints.',
    },
    {
      platform: 'CodeChef',
      title: 'GERALD07 / DISTNUM3 — Tree Mo’s Queries',
      difficulty: 'CodeChef 6-Star',
      url: 'https://www.codechef.com/problems/DISTNUM3',
      patternNote: 'Combines Euler Tour tree flattening with 3D Mo’s + point updates.',
    },
    {
      platform: 'HackerRank',
      title: 'Subarray Distinctness & Frequency Range Audits',
      difficulty: 'Hard',
      url: 'https://www.hackerrank.com/challenges/distinct-values/problem',
      patternNote: 'Offline query batching and Sqrt value-bucket decomposition (`O(1)` update / `O(sqrt(N))` query).',
    },
    {
      platform: 'NeetCode 150',
      title: 'Sliding Window Maximum / Top K Frequent Elements',
      difficulty: 'Hard Extension',
      url: 'https://neetcode.io/practice',
      patternNote: 'Generalizes fixed-length sliding windows to arbitrary offline `[L, R]` window queries via Hilbert curve batching.',
    },
  ],
  interviewNotes: [
    'Why Mo’s Algorithm hits `O((N + Q) sqrt(N))`: sorting by `L`-block of size `B` guarantees `L` moves at most `B` per query (`Q * B` total) while within each block `R` moves monotonically at most `N` (`(N / B) * N` total). Setting `B = N / sqrt(Q)` minimizes the sum to `O(N sqrt(Q))`.',
    'Explain why **Hilbert Order** outperforms standard parity block sorting in practice: it minimizes Manhattan distance along both axes simultaneously, giving `O(N sqrt(Q))` even when `Q` differs wildly from `N` without tuning `B`.',
    'Know when NOT to use Mo’s: Mo’s is strictly **offline** and requires reversible `remove()` (unless using Rollback Mo’s, where `remove()` is replaced by block-reset snapshots!).',
  ],
  projectBlueprint: {
    title: 'Massive Log-Analytics & Query Reordering Service',
    tagline:
      'Batch thousands of ad-hoc time-window telemetry audits through a Hilbert-curve query scheduler to slash disk seeks and memory churn by 50x.',
    stackSummary: 'TypeScript Engine • Hilbert Space-Filling Sorter • Sliding Frequency Window • Sqrt Bucket Aggregator',
    asciiDiagram: `Unsorted Ad-Hoc Queries: [L0, R0], [L1, R1], ... [Lq, Rq]
         |
         v
[ Gilbert / Hilbert Order Key Generator (2D -> 1D Locality) ]
         |
         v
Sorted Execution Plan -> [ Sliding Window L/R Cursor ] -> [ Sqrt Frequency Buckets ]
                                                                    |
                                                                    v
                                                       Original-Order Analytics JSON`,
    milestones: [
      {
        id: 'ch23-m1',
        title: 'Implement 64-Bit BigInt Hilbert Curve Key Generator',
        detail: 'Map arbitrary `[startIdx, endIdx]` log intervals onto continuous 1D Hilbert space-filling curve coordinates in `O(log N)` bit ops.',
      },
      {
        id: 'ch23-m2',
        title: 'Build Incremental Sliding Window State Machine',
        detail: 'Maintain dense coordinate-compressed event counts and active-threshold totals in strict `O(1)` per log entry added or evicted.',
      },
      {
        id: 'ch23-m3',
        title: 'Attach Sqrt Frequency-of-Frequencies Bucket Engine',
        detail: 'Answer percentile / heavy-hitter threshold counts (`count >= k`) per window in `O(sqrt(N))` without sorting per query.',
      },
      {
        id: 'ch23-m4',
        title: 'Re-Index & Stream Results in Caller Query Order',
        detail: 'Map reordered Hilbert execution answers back onto `query.id` so upstream dashboards receive deterministic chronological arrays.',
      },
    ],
    starterCode: `export interface LogAuditQuery {
  id: number;
  start: number;
  end: number;
  minOccurrences: number;
}

export interface LogAuditResult {
  id: number;
  distinctEvents: number;
  heavyHitters: number;
}

const ROTATE_DELTA = [3, 0, 0, 1] as const;

export function gilbertOrder(x: number, y: number, pow: number, rotate = 0): bigint {
  if (pow === 0) return 0n;
  const hpow = 1 << (pow - 1);
  let seg = x < hpow ? (y < hpow ? 0 : 3) : y < hpow ? 1 : 2;
  seg = (seg + rotate) & 3;
  const nx = x & (x ^ hpow);
  const ny = y & (y ^ hpow);
  const nrot = (rotate + ROTATE_DELTA[seg]) & 3;
  const subSquareSize = 1n << BigInt(2 * pow - 2);
  let ans = BigInt(seg) * subSquareSize;
  const add = gilbertOrder(nx, ny, pow - 1, nrot);
  ans += seg === 1 || seg === 2 ? add : subSquareSize - add - 1n;
  return ans;
}

export class HilbertLogAnalyticsEngine {
  static runBatch(events: string[], queries: LogAuditQuery[]): LogAuditResult[] {
    const n = events.length;
    if (n === 0 || queries.length === 0) return [];

    const dict = new Map<string, number>();
    const compressed = new Int32Array(n);
    for (let i = 0; i < n; i++) {
      let id = dict.get(events[i]);
      if (id === undefined) {
        id = dict.size;
        dict.set(events[i], id);
      }
      compressed[i] = id;
    }

    let pow = 1;
    while (1 << pow <= n) pow++;

    const ordered = queries
      .map((q) => ({ ...q, key: gilbertOrder(q.start, q.end, pow) }))
      .sort((a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : 0));

    const cnt = new Int32Array(dict.size);
    const exactFreq = new Int32Array(n + 2);
    const fb = Math.max(1, Math.floor(Math.sqrt(n + 1)));
    const bucketSum = new Int32Array(Math.floor((n + 2) / fb) + 2);
    let distinct = 0;

    const add = (idx: number) => {
      const v = compressed[idx];
      const oldF = cnt[v];
      if (oldF === 0) distinct++;
      else {
        exactFreq[oldF]--;
        bucketSum[Math.floor(oldF / fb)]--;
      }
      const newF = oldF + 1;
      cnt[v] = newF;
      exactFreq[newF]++;
      bucketSum[Math.floor(newF / fb)]++;
    };

    const remove = (idx: number) => {
      const v = compressed[idx];
      const oldF = cnt[v];
      exactFreq[oldF]--;
      bucketSum[Math.floor(oldF / fb)]--;
      const newF = oldF - 1;
      cnt[v] = newF;
      if (newF === 0) distinct--;
      else {
        exactFreq[newF]++;
        bucketSum[Math.floor(newF / fb)]++;
      }
    };

    const countAtLeast = (k: number): number => {
      if (k <= 1) return distinct;
      if (k > n) return 0;
      let res = 0;
      let pos = k;
      while (pos <= n && pos % fb !== 0) res += exactFreq[pos++];
      while (pos + fb - 1 <= n) {
        res += bucketSum[Math.floor(pos / fb)];
        pos += fb;
      }
      while (pos <= n) res += exactFreq[pos++];
      return res;
    };

    const results: LogAuditResult[] = new Array(queries.length);
    let curL = 0;
    let curR = -1;

    for (const q of ordered) {
      while (curL > q.start) add(--curL);
      while (curR < q.end) add(++curR);
      while (curL < q.start) remove(curL++);
      while (curR > q.end) remove(curR--);
      results[q.id] = {
        id: q.id,
        distinctEvents: distinct,
        heavyHitters: countAtLeast(q.minOccurrences),
      };
    }

    return results;
  }
}`,
  },
};
