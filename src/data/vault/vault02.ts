import type { VaultBreakdown } from '../../types/vault';

export const VAULT02_RANGE_AFFINE: VaultBreakdown = {
  slug: 'range-affine-update-sum-query',
  title: 'Range Affine Update (a_i = b * a_i + c) & Range Sum Query -> Monoid Lazy Composition',
  rating: 1900,
  ratingTier: '1900–2200',
  usacoDivision: 'Platinum',
  domain: 'Data Structures',
  sourceTag: '1900-Rated Data Structure Reduction Vault (AtCoder Library / CF Classic)',
  reductionHeadline:
    'Compose non-commutative affine transforms (mul, add) inside a single Lazy Segment Tree mod 998244353 without losing O(log N) speed.',
  stage1Statement: {
    statement:
      'You are given an array A of length N (0-indexed). Process Q queries of two types modulo 998244353: (0 l r b c) update every a_i for i in [l, r) to (b * a_i + c) mod 998244353; (1 l r) output sum_{i=l}^{r-1} a_i mod 998244353.',
    constraints: [
      '1 <= N, Q <= 5 * 10^5',
      '0 <= a_i, b, c < 998244353',
      '0 <= l < r <= N',
      'Time Limit: 2.0 seconds',
    ],
    sampleInput: '5 5\n1 2 3 4 5\n1 0 5\n0 2 4 100 101\n1 0 3\n0 1 3 102 103\n1 2 5',
    sampleOutput: '15\n404\n41511',
    sampleExplanation:
      'Initially A = [1, 2, 3, 4, 5], sum[0..5) = 15. After (0 2 4 100 101), A becomes [1, 2, 401, 501, 5], so sum[0..3) = 1 + 2 + 401 = 404. After (0 1 3 102 103), A becomes [1, 307, 41005, 501, 5], so sum[2..5) = 41005 + 501 + 5 = 41511.',
  },
  stage2NaiveFailure: {
    naiveApproaches: [
      {
        approach: 'Direct Loop Over [l, r) for Every Query',
        complexity: 'O(N * Q)',
        verdict: 'TLE',
        reason:
          '5 * 10^5 * 5 * 10^5 = 2.5 * 10^11 operations, exceeding the 10^8 ops/sec budget by 2500x.',
      },
      {
        approach: 'Separate Naive Lazy Flags (add first, then mul)',
        complexity: 'O(N log N)',
        verdict: 'WA',
        reason:
          'Affine maps f(x) = bx + c are NOT commutative! Applying (+c1) then (*b2) gives b2*x + b2*c1, NOT b2*x + c1. Storing separate add/mul without strict composition order produces Wrong Answer on the very second overlapping update.',
      },
      {
        approach: 'Sqrt Decomposition with Per-Block Rebuild',
        complexity: 'O(Q sqrt(N))',
        verdict: 'TLE',
        reason:
          'With N, Q = 5 * 10^5 and 64-bit modulo arithmetic inside every block scan, sqrt(5e5) ~ 700 -> ~3.5 * 10^8 modulo ops, dangerously slow under strict time limits.',
      },
    ],
    constraintWhispers: [
      'N, Q <= 5 * 10^5 demands true O(log N) per query with minimal constant factor.',
      'The modulo 998244353 fits cleanly in 32-bit unsigned int, while products fit inside 64-bit integer before taking % 998244353.',
      'Composition of two affine functions is still a single affine function: g(f(x)) = b2(b1*x + c1) + c2 = (b2*b1)x + (b2*c1 + c2).',
    ],
  },
  stage3AhaReduction: {
    coreInsight:
      'Represent every pending lazy update as an ordered pair (mul, add) meaning x -> (mul * x + add) % MOD, with identity tag (1, 0). Composing a new outer tag (b, c) onto an existing pending tag (m, a) is associative: new_mul = (b * m) % MOD and new_add = (b * a + c) % MOD!',
    steps: [
      {
        title: '1. Node Aggregate & Length Awareness',
        proofNote:
          'Suppose a segment tree node covers len = r - l elements whose current sum is S = sum_{i} a_i. After applying x -> m*x + a to every element, the new sum is S_new = (m * S + a * len) % MOD. No individual elements are needed!',
      },
      {
        title: '2. Exact Tag Composition Formula (Outer ∘ Inner)',
        proofNote:
          'If a child already has pending transform T_old(x) = m_old * x + a_old, and the parent pushes down T_new(y) = m_new * y + a_new, the combined transform on x is T_new(T_old(x)) = (m_new * m_old) * x + (m_new * a_old + a_new). Multiply the existing add tag by m_new BEFORE adding a_new!',
      },
      {
        title: '3. Unify Range-Set and Range-Add Under One Abstraction',
        proofNote:
          'Notice that Range Add (+c) is simply affine tag (1, c), Range Multiply (*b) is (b, 0), and Range Set (=v) is (0, v)! One single Lazy Affine Segment Tree solves all three simultaneously.',
      },
    ],
  },
  stage4DryRun: {
    intro:
      'Trace the Sample Input on a 5-element array A = [1, 2, 3, 4, 5] through two overlapping affine updates, watching node sums and (mul, add) tags compose cleanly.',
    traceSteps: [
      {
        stepNumber: 1,
        title: 'Initial Built Array A = [1, 2, 3, 4, 5]',
        explanation:
          'All lazy tags are initialized to the identity transform (mul=1, add=0). Total root sum over [0, 5) is 15.',
        mode: 'array',
        arrays: [
          {
            name: 'Array Values A[0..4]',
            cells: [
              { index: 0, value: 1, label: 'a[0]', highlight: 'neutral' },
              { index: 1, value: 2, label: 'a[1]', highlight: 'neutral' },
              { index: 2, value: 3, label: 'a[2]', highlight: 'neutral' },
              { index: 3, value: 4, label: 'a[3]', highlight: 'neutral' },
              { index: 4, value: 5, label: 'a[4]', highlight: 'neutral' },
            ],
          },
          {
            name: 'Pending Lazy Tag per Element (mul, add)',
            cells: [
              { index: 0, value: '(1,0)', highlight: 'neutral' },
              { index: 1, value: '(1,0)', highlight: 'neutral' },
              { index: 2, value: '(1,0)', highlight: 'neutral' },
              { index: 3, value: '(1,0)', highlight: 'neutral' },
              { index: 4, value: '(1,0)', highlight: 'neutral' },
            ],
          },
        ],
        variables: { Query: '1 0 5', Sum: 15, IdentityTag: '(1, 0)' },
      },
      {
        stepNumber: 2,
        title: 'Apply Affine Update (0 2 4 100 101) on [2, 4)',
        explanation:
          'Indices 2 and 3 get x -> 100*x + 101. Segment node covering [2, 4) (sum=7, len=2) updates to (100*7 + 101*2) = 902, storing lazy tag (100, 101). Now sum[0, 3) = 1 + 2 + 401 = 404.',
        mode: 'array',
        arrays: [
          {
            name: 'Effective Values A[0..4]',
            cells: [
              { index: 0, value: 1, label: 'a[0]', highlight: 'neutral' },
              { index: 1, value: 2, label: 'a[1]', highlight: 'neutral' },
              { index: 2, value: 401, label: '100*3+101', highlight: 'updated' },
              { index: 3, value: 501, label: '100*4+101', highlight: 'updated' },
              { index: 4, value: 5, label: 'a[4]', highlight: 'neutral' },
            ],
          },
          {
            name: 'Lazy Transform Snapshot',
            cells: [
              { index: 0, value: '(1,0)', highlight: 'neutral' },
              { index: 1, value: '(1,0)', highlight: 'neutral' },
              { index: 2, value: '(100,101)', highlight: 'updated' },
              { index: 3, value: '(100,101)', highlight: 'updated' },
              { index: 4, value: '(1,0)', highlight: 'neutral' },
            ],
          },
        ],
        variables: { Update: '[2,4) *100 +101', 'Query[0,3)': 404 },
      },
      {
        stepNumber: 3,
        title: 'Overlapping Affine Update (0 1 3 102 103) Forces Push + Compose',
        explanation:
          'Node [2, 4) partially overlaps [1, 3), so pushdown sends (100, 101) to leaves 2 and 3. Then leaf 2 composes outer (102, 103) onto (100, 101): mul = 102*100 = 10200, add = 102*101 + 103 = 10405! Value at index 2 becomes 102*401 + 103 = 41005.',
        mode: 'array',
        arrays: [
          {
            name: 'Effective Values A[0..4]',
            cells: [
              { index: 0, value: 1, label: 'a[0]', highlight: 'neutral' },
              { index: 1, value: 307, label: '102*2+103', highlight: 'updated' },
              { index: 2, value: 41005, label: 'composed!', highlight: 'active' },
              { index: 3, value: 501, label: 'a[3]', highlight: 'neutral' },
              { index: 4, value: 5, label: 'a[4]', highlight: 'neutral' },
            ],
          },
          {
            name: 'Composed Equivalent Tag From Initial A',
            cells: [
              { index: 0, value: '(1,0)', highlight: 'neutral' },
              { index: 1, value: '(102,103)', highlight: 'updated' },
              { index: 2, value: '(10200,10405)', highlight: 'active' },
              { index: 3, value: '(100,101)', highlight: 'neutral' },
              { index: 4, value: '(1,0)', highlight: 'neutral' },
            ],
          },
        ],
        variables: { NewMul: '102*100 = 10200', NewAdd: '102*101+103 = 10405', 'Query[2,5)': 41511 },
      },
    ],
  },
  stage5Solutions: {
    timeComplexity: 'O((N + Q) log N)',
    spaceComplexity: 'O(N)',
    implementations: {
      cpp20: `#include <bits/stdc++.h>
using namespace std;

static constexpr long long MOD = 998244353LL;

struct AffineSegTree {
    int n;
    vector<long long> sum, mul, add;

    AffineSegTree(const vector<long long>& a) : n((int)a.size()), sum(4 * n, 0), mul(4 * n, 1), add(4 * n, 0) {
        build(1, 0, n, a);
    }

    void build(int node, int l, int r, const vector<long long>& a) {
        if (r - l == 1) {
            sum[node] = a[l] % MOD;
            return;
        }
        int m = (l + r) >> 1;
        build(node << 1, l, m, a);
        build(node << 1 | 1, m, r, a);
        sum[node] = (sum[node << 1] + sum[node << 1 | 1]) % MOD;
    }

    void apply(int node, int len, long long b, long long c) {
        sum[node] = (sum[node] * b + c * len) % MOD;
        mul[node] = (mul[node] * b) % MOD;
        add[node] = (add[node] * b + c) % MOD;
    }

    void push(int node, int l, int r) {
        if (mul[node] == 1 && add[node] == 0) return;
        int m = (l + r) >> 1;
        apply(node << 1, m - l, mul[node], add[node]);
        apply(node << 1 | 1, r - m, mul[node], add[node]);
        mul[node] = 1;
        add[node] = 0;
    }

    void update(int node, int l, int r, int ql, int qr, long long b, long long c) {
        if (ql <= l && r <= qr) {
            apply(node, r - l, b, c);
            return;
        }
        push(node, l, r);
        int m = (l + r) >> 1;
        if (ql < m) update(node << 1, l, m, ql, qr, b, c);
        if (qr > m) update(node << 1 | 1, m, r, ql, qr, b, c);
        sum[node] = (sum[node << 1] + sum[node << 1 | 1]) % MOD;
    }

    long long query(int node, int l, int r, int ql, int qr) {
        if (ql <= l && r <= qr) return sum[node];
        push(node, l, r);
        int m = (l + r) >> 1;
        long long res = 0;
        if (ql < m) res += query(node << 1, l, m, ql, qr);
        if (qr > m) res += query(node << 1 | 1, m, r, ql, qr);
        return res % MOD;
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, q;
    if (!(cin >> n >> q)) return 0;
    vector<long long> a(n);
    for (int i = 0; i < n; ++i) cin >> a[i];
    AffineSegTree seg(a);
    while (q--) {
        int t;
        cin >> t;
        if (t == 0) {
            int l, r;
            long long b, c;
            cin >> l >> r >> b >> c;
            seg.update(1, 0, n, l, r, b, c);
        } else {
            int l, r;
            cin >> l >> r;
            cout << seg.query(1, 0, n, l, r) << '\\n';
        }
    }
    return 0;
}`,
      rust: `use std::io::{self, BufWriter, Read, Write};

const MOD: i64 = 998_244_353;

struct AffineSegTree {
    sum: Vec<i64>,
    mul: Vec<i64>,
    add: Vec<i64>,
}

impl AffineSegTree {
    fn new(a: &[i64]) -> Self {
        let n = a.len();
        let mut st = Self {
            sum: vec![0; 4 * n],
            mul: vec![1; 4 * n],
            add: vec![0; 4 * n],
        };
        st.build(1, 0, n, a);
        st
    }

    fn build(&mut self, node: usize, l: usize, r: usize, a: &[i64]) {
        if r - l == 1 {
            self.sum[node] = a[l] % MOD;
            return;
        }
        let m = (l + r) >> 1;
        self.build(node << 1, l, m, a);
        self.build(node << 1 | 1, m, r, a);
        self.sum[node] = (self.sum[node << 1] + self.sum[node << 1 | 1]) % MOD;
    }

    fn apply(&mut self, node: usize, len: i64, b: i64, c: i64) {
        self.sum[node] = (self.sum[node] * b + c * len) % MOD;
        self.mul[node] = (self.mul[node] * b) % MOD;
        self.add[node] = (self.add[node] * b + c) % MOD;
    }

    fn push(&mut self, node: usize, l: usize, r: usize) {
        if self.mul[node] == 1 && self.add[node] == 0 {
            return;
        }
        let m = (l + r) >> 1;
        let (b, c) = (self.mul[node], self.add[node]);
        self.apply(node << 1, (m - l) as i64, b, c);
        self.apply(node << 1 | 1, (r - m) as i64, b, c);
        self.mul[node] = 1;
        self.add[node] = 0;
    }

    fn update(&mut self, node: usize, l: usize, r: usize, ql: usize, qr: usize, b: i64, c: i64) {
        if ql <= l && r <= qr {
            self.apply(node, (r - l) as i64, b, c);
            return;
        }
        self.push(node, l, r);
        let m = (l + r) >> 1;
        if ql < m { self.update(node << 1, l, m, ql, qr, b, c); }
        if qr > m { self.update(node << 1 | 1, m, r, ql, qr, b, c); }
        self.sum[node] = (self.sum[node << 1] + self.sum[node << 1 | 1]) % MOD;
    }

    fn query(&mut self, node: usize, l: usize, r: usize, ql: usize, qr: usize) -> i64 {
        if ql <= l && r <= qr {
            return self.sum[node];
        }
        self.push(node, l, r);
        let m = (l + r) >> 1;
        let mut res = 0;
        if ql < m { res += self.query(node << 1, l, m, ql, qr); }
        if qr > m { res += self.query(node << 1 | 1, m, r, ql, qr); }
        res % MOD
    }
}

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let Some(ns) = it.next() else { return; };
    let n: usize = ns.parse().unwrap();
    let q: usize = it.next().unwrap().parse().unwrap();
    let mut a = vec![0i64; n];
    for i in 0..n { a[i] = it.next().unwrap().parse().unwrap(); }
    let mut seg = AffineSegTree::new(&a);
    let mut out = BufWriter::new(io::stdout().lock());
    for _ in 0..q {
        let t: usize = it.next().unwrap().parse().unwrap();
        if t == 0 {
            let l: usize = it.next().unwrap().parse().unwrap();
            let r: usize = it.next().unwrap().parse().unwrap();
            let b: i64 = it.next().unwrap().parse().unwrap();
            let c: i64 = it.next().unwrap().parse().unwrap();
            seg.update(1, 0, n, l, r, b, c);
        } else {
            let l: usize = it.next().unwrap().parse().unwrap();
            let r: usize = it.next().unwrap().parse().unwrap();
            writeln!(out, "{}", seg.query(1, 0, n, l, r)).unwrap();
        }
    }
}`,
      java21: `import java.io.*;
import java.util.*;

public class Main {
    static final long MOD = 998_244_353L;
    static long[] sum, mul, add;

    static void build(int node, int l, int r, long[] a) {
        mul[node] = 1;
        if (r - l == 1) { sum[node] = a[l] % MOD; return; }
        int m = (l + r) >> 1;
        build(node << 1, l, m, a);
        build(node << 1 | 1, m, r, a);
        sum[node] = (sum[node << 1] + sum[node << 1 | 1]) % MOD;
    }

    static void apply(int node, int len, long b, long c) {
        sum[node] = (sum[node] * b + c * len) % MOD;
        mul[node] = (mul[node] * b) % MOD;
        add[node] = (add[node] * b + c) % MOD;
    }

    static void push(int node, int l, int r) {
        if (mul[node] == 1 && add[node] == 0) return;
        int m = (l + r) >> 1;
        apply(node << 1, m - l, mul[node], add[node]);
        apply(node << 1 | 1, r - m, mul[node], add[node]);
        mul[node] = 1;
        add[node] = 0;
    }

    static void update(int node, int l, int r, int ql, int qr, long b, long c) {
        if (ql <= l && r <= qr) { apply(node, r - l, b, c); return; }
        push(node, l, r);
        int m = (l + r) >> 1;
        if (ql < m) update(node << 1, l, m, ql, qr, b, c);
        if (qr > m) update(node << 1 | 1, m, r, ql, qr, b, c);
        sum[node] = (sum[node << 1] + sum[node << 1 | 1]) % MOD;
    }

    static long query(int node, int l, int r, int ql, int qr) {
        if (ql <= l && r <= qr) return sum[node];
        push(node, l, r);
        int m = (l + r) >> 1;
        long res = 0;
        if (ql < m) res += query(node << 1, l, m, ql, qr);
        if (qr > m) res += query(node << 1 | 1, m, r, ql, qr);
        return res % MOD;
    }

    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String line = br.readLine(); if (line == null) return;
        StringTokenizer st = new StringTokenizer(line);
        int n = Integer.parseInt(st.nextToken()), q = Integer.parseInt(st.nextToken());
        long[] a = new long[n];
        st = new StringTokenizer(br.readLine());
        for (int i = 0; i < n; i++) a[i] = Long.parseLong(st.nextToken());
        sum = new long[4 * n]; mul = new long[4 * n]; add = new long[4 * n];
        build(1, 0, n, a);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < q; i++) {
            st = new StringTokenizer(br.readLine());
            int t = Integer.parseInt(st.nextToken());
            if (t == 0) {
                int l = Integer.parseInt(st.nextToken()), r = Integer.parseInt(st.nextToken());
                long b = Long.parseLong(st.nextToken()), c = Long.parseLong(st.nextToken());
                update(1, 0, n, l, r, b, c);
            } else {
                int l = Integer.parseInt(st.nextToken()), r = Integer.parseInt(st.nextToken());
                sb.append(query(1, 0, n, l, r)).append('\\n');
            }
        }
        System.out.print(sb);
    }
}`,
      python3: `import sys

MOD = 998244353

def solve():
    data = list(map(int, sys.stdin.buffer.read().split()))
    if not data:
        return
    it = iter(data)
    n, q = next(it), next(it)
    a = [next(it) % MOD for _ in range(n)]

    size = 1
    while size < n:
        size <<= 1
    s = [0] * (2 * size)
    ln = [0] * (2 * size)
    mul = [1] * (2 * size)
    add = [0] * (2 * size)
    for i in range(n):
        s[size + i] = a[i]
        ln[size + i] = 1
    for i in range(size - 1, 0, -1):
        s[i] = (s[i << 1] + s[i << 1 | 1]) % MOD
        ln[i] = ln[i << 1] + ln[i << 1 | 1]

    def apply(idx: int, b: int, c: int):
        s[idx] = (s[idx] * b + c * ln[idx]) % MOD
        mul[idx] = (mul[idx] * b) % MOD
        add[idx] = (add[idx] * b + c) % MOD

    def push_path(p: int):
        for shift in range(p.bit_length() - 1, 0, -1):
            node = p >> shift
            if mul[node] != 1 or add[node] != 0:
                b, c = mul[node], add[node]
                apply(node << 1, b, c)
                apply(node << 1 | 1, b, c)
                mul[node], add[node] = 1, 0

    def pull_path(p: int):
        while p > 1:
            p >>= 1
            s[p] = (s[p << 1] + s[p << 1 | 1]) % MOD
            if mul[p] != 1 or add[p] != 0:
                s[p] = (s[p] * mul[p] + add[p] * ln[p]) % MOD

    out = []
    for _ in range(q):
        t = next(it)
        if t == 0:
            l, r, b, c = next(it), next(it), next(it), next(it)
            l0, r0 = l + size, r + size
            push_path(l0)
            push_path(r0 - 1)
            ll, rr = l0, r0
            while ll < rr:
                if ll & 1:
                    apply(ll, b, c)
                    ll += 1
                if rr & 1:
                    rr -= 1
                    apply(rr, b, c)
                ll >>= 1
                rr >>= 1
            pull_path(l0)
            pull_path(r0 - 1)
        else:
            l, r = next(it) + size, next(it) + size
            push_path(l)
            push_path(r - 1)
            ans = 0
            while l < r:
                if l & 1:
                    ans = (ans + s[l]) % MOD
                    l += 1
                if r & 1:
                    r -= 1
                    ans = (ans + s[r]) % MOD
                l >>= 1
                r >>= 1
            out.append(str(ans))
    sys.stdout.write("\\n".join(out) + "\\n")

if __name__ == "__main__":
    solve()`,
      ruby: `MOD = 998_244_353
data = STDIN.read.split.map(&:to_i)
exit if data.empty?
idx = 0
n = data[idx]; q = data[idx + 1]; idx += 2
a = data[idx, n]; idx += n

sum = Array.new(4 * n, 0)
mul = Array.new(4 * n, 1)
add = Array.new(4 * n, 0)

build = nil
build = ->(node, l, r) do
  if r - l == 1
    sum[node] = a[l] % MOD
    return
  end
  m = (l + r) >> 1
  build.call(node << 1, l, m)
  build.call(node << 1 | 1, m, r)
  sum[node] = (sum[node << 1] + sum[node << 1 | 1]) % MOD
end
build.call(1, 0, n)

apply_node = ->(node, len, b, c) do
  sum[node] = (sum[node] * b + c * len) % MOD
  mul[node] = (mul[node] * b) % MOD
  add[node] = (add[node] * b + c) % MOD
end

push = ->(node, l, r) do
  return if mul[node] == 1 && add[node] == 0
  m = (l + r) >> 1
  apply_node.call(node << 1, m - l, mul[node], add[node])
  apply_node.call(node << 1 | 1, r - m, mul[node], add[node])
  mul[node] = 1; add[node] = 0
end

update = nil
update = ->(node, l, r, ql, qr, b, c) do
  if ql <= l && r <= qr
    apply_node.call(node, r - l, b, c)
    return
  end
  push.call(node, l, r)
  m = (l + r) >> 1
  update.call(node << 1, l, m, ql, qr, b, c) if ql < m
  update.call(node << 1 | 1, m, r, ql, qr, b, c) if qr > m
  sum[node] = (sum[node << 1] + sum[node << 1 | 1]) % MOD
end

query = nil
query = ->(node, l, r, ql, qr) do
  return sum[node] if ql <= l && r <= qr
  push.call(node, l, r)
  m = (l + r) >> 1
  res = 0
  res += query.call(node << 1, l, m, ql, qr) if ql < m
  res += query.call(node << 1 | 1, m, r, ql, qr) if qr > m
  res % MOD
end

out = []
q.times do
  t = data[idx]
  if t == 0
    l, r, b, c = data[idx + 1, 4]; idx += 5
    update.call(1, 0, n, l, r, b, c)
  else
    l, r = data[idx + 1, 2]; idx += 3
    out << query.call(1, 0, n, l, r)
  end
end
puts out.join("\\n")`,
    },
  },
};
