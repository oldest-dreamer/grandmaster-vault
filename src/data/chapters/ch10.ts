import type { TheoryChapter } from '../../types/vault';

export const CH10_FENWICK_BIT: TheoryChapter = {
  slug: 'fenwick-tree-binary-lifting',
  topicId: 'ds-06',
  title: 'Fenwick Tree (BIT) & Binary Lifting on BIT',
  domain: 'Data Structures',
  ratingTier: '1400–1600',
  usacoDivision: 'Gold',
  subtitle:
    'Answer point updates and prefix sums in 4 lines of O(log N) bit manipulation, and walk powers of two directly inside the BIT to find the K-th order statistic in O(log N).',
  analogyTitle: 'The Binary Ruler & Jump-Step Tape Measure Analogy',
  analogyBody:
    'Imagine measuring a 16-meter hallway using pre-recorded ruler bars of lengths 1, 2, 4, and 8. Every position i stores the sum of a specific suffix ending at i whose length equals the lowest set bit of i (i & -i): index 12 (binary 1100, lowest bit 4) covers [9..12], index 8 (binary 1000) covers [1..8]. To find PrefixSum(12), you add bit[12] and strip its lowest bit (12 - 4 = 8), then add bit[8] -> just 2 additions! Even cooler: to find the first prefix whose total hits >= K (like finding the K-th smallest player score), you walk downward from the largest power of 2 (8, 4, 2, 1), greedily taking any jump that keeps your accumulated sum strictly below K—zero binary search wrapper needed, cutting O(log^2 N) down to true O(log N)!',
  prerequisites: [
    {
      slug: 'prefix-sums-difference-arrays',
      title: 'Prefix Sums, Difference Arrays & Invariants',
    },
  ],
  traceTitle: 'Interactive Fenwick Tree Update, Prefix Sum & Binary Lifting Trace',
  traceSubtitle:
    'Watch 1-indexed BIT cells store power-of-two suffix buckets, add +5 to index 3, query sum(1..7), and binary-lift for K-th element.',
  allowDynamicGraphEdit: false,
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Step 1: Initial 1-Indexed Array A[1..8] & BIT Buckets',
      explanation:
        'A = [2, 1, 4, 3, 2, 5, 1, 6]. Each bit[i] stores sum over (i - (i & -i) + 1 .. i): bit[4] covers [1..4]=10, bit[6] covers [5..6]=7, bit[8] covers [1..8]=24.',
      mode: 'array',
      arrays: [
        {
          name: 'Original A[1..8]',
          cells: [
            { index: 1, value: 2, highlight: 'neutral' },
            { index: 2, value: 1, highlight: 'neutral' },
            { index: 3, value: 4, highlight: 'neutral' },
            { index: 4, value: 3, highlight: 'neutral' },
            { index: 5, value: 2, highlight: 'neutral' },
            { index: 6, value: 5, highlight: 'neutral' },
            { index: 7, value: 1, highlight: 'neutral' },
            { index: 8, value: 6, highlight: 'neutral' },
          ],
        },
        {
          name: 'Fenwick bit[1..8]',
          cells: [
            { index: 1, value: 2, label: '[1]', highlight: 'neutral' },
            { index: 2, value: 3, label: '[1..2]', highlight: 'neutral' },
            { index: 3, value: 4, label: '[3]', highlight: 'neutral' },
            { index: 4, value: 10, label: '[1..4]', highlight: 'neutral' },
            { index: 5, value: 2, label: '[5]', highlight: 'neutral' },
            { index: 6, value: 7, label: '[5..6]', highlight: 'neutral' },
            { index: 7, value: 1, label: '[7]', highlight: 'neutral' },
            { index: 8, value: 24, label: '[1..8]', highlight: 'neutral' },
          ],
        },
      ],
      variables: { Operation: 'Build', TotalSum: 24, MaxPow2: 8 },
    },
    {
      stepNumber: 2,
      title: 'Step 2: Point Update add(idx=3, +5) Touches 3 -> 4 -> 8',
      explanation:
        'Start at i = 3 (binary 011): bit[3] += 5 (=9). Add i & -i (+1) -> i = 4 (100): bit[4] += 5 (=15). Add i & -i (+4) -> i = 8 (1000): bit[8] += 5 (=29). Only 3 cells modified!',
      mode: 'array',
      arrays: [
        {
          name: 'Original A[1..8]',
          cells: [
            { index: 1, value: 2, highlight: 'neutral' },
            { index: 2, value: 1, highlight: 'neutral' },
            { index: 3, value: 9, label: '4+5', highlight: 'updated' },
            { index: 4, value: 3, highlight: 'neutral' },
            { index: 5, value: 2, highlight: 'neutral' },
            { index: 6, value: 5, highlight: 'neutral' },
            { index: 7, value: 1, highlight: 'neutral' },
            { index: 8, value: 6, highlight: 'neutral' },
          ],
        },
        {
          name: 'Fenwick bit[1..8]',
          cells: [
            { index: 1, value: 2, highlight: 'neutral' },
            { index: 2, value: 3, highlight: 'neutral' },
            { index: 3, value: 9, label: '+5', highlight: 'updated' },
            { index: 4, value: 15, label: '+5', highlight: 'updated' },
            { index: 5, value: 2, highlight: 'neutral' },
            { index: 6, value: 7, highlight: 'neutral' },
            { index: 7, value: 1, highlight: 'neutral' },
            { index: 8, value: 29, label: '+5', highlight: 'updated' },
          ],
        },
      ],
      variables: { 'add(3, +5)': '3 -> 4 -> 8', 'bit[8]': 29 },
    },
    {
      stepNumber: 3,
      title: 'Step 3: Prefix Sum Query(1..7) Walks 7 -> 6 -> 4',
      explanation:
        'Start at i = 7 (111): add bit[7]=1, subtract 7&-7 -> i=6 (110): add bit[6]=7, subtract 6&-6 -> i=4 (100): add bit[4]=15, subtract 4&-4 -> 0. Result = 1 + 7 + 15 = 23.',
      mode: 'array',
      arrays: [
        {
          name: 'Fenwick bit[1..8]',
          cells: [
            { index: 1, value: 2, highlight: 'neutral' },
            { index: 2, value: 3, highlight: 'neutral' },
            { index: 3, value: 9, highlight: 'neutral' },
            { index: 4, value: 15, label: 'pick #3', highlight: 'active' },
            { index: 5, value: 2, highlight: 'neutral' },
            { index: 6, value: 7, label: 'pick #2', highlight: 'active' },
            { index: 7, value: 1, label: 'pick #1', highlight: 'active' },
            { index: 8, value: 29, highlight: 'neutral' },
          ],
        },
      ],
      variables: { Query: 'pref(7)', Visited: '7, 6, 4', Sum: 23 },
    },
    {
      stepNumber: 4,
      title: 'Step 4: BIT Binary Lifting for K-th Element (k = 17)',
      explanation:
        'Test step 8: bit[8]=29 >= 17 (skip). Test step 4: pos=4, bit[4]=15 < 17 -> accept pos=4, acc=15! Test step 2: bit[4+2]=7, 15+7=22 >= 17 (skip). Test step 1: bit[4+1]=2, 15+2=17 >= 17 (skip). Answer = pos + 1 = 5!',
      mode: 'array',
      arrays: [
        {
          name: 'Fenwick bit[1..8]',
          cells: [
            { index: 1, value: 2, highlight: 'neutral' },
            { index: 2, value: 3, highlight: 'neutral' },
            { index: 3, value: 9, highlight: 'neutral' },
            { index: 4, value: 15, label: 'acc=15<17', highlight: 'updated' },
            { index: 5, value: 2, label: 'pos+1=5!', highlight: 'active' },
            { index: 6, value: 7, highlight: 'neutral' },
            { index: 7, value: 1, highlight: 'neutral' },
            { index: 8, value: 29, label: '29>=17 skip', highlight: 'neutral' },
          ],
        },
      ],
      variables: { TargetK: 17, AcceptedAcc: 15, AnswerIndex: 'pos + 1 = 5' },
    },
  ],
  reductionClues: [
    {
      clue: '"Point updates + range sum queries (or inversion count / offline sweep line) with N <= 2 * 10^5"',
      translation:
        '1-indexed Fenwick Tree uses 1 array of size N+1, 4x less memory and ~3x faster constant factor than a recursive Segment Tree.',
    },
    {
      clue: '"Maintain a dynamic multiset supporting insert(x), erase(x), and find_kth(k) over coordinates up to 10^9"',
      translation:
        'Coordinate-compress all values into [1..M], maintain frequencies in a BIT, and use BIT Binary Lifting in O(log M) for find_kth(k)!',
    },
    {
      clue: '"Range add + Range sum queries without a full Segment Tree"',
      translation:
        'Dual-BIT identity: sum[1..x] = x * pref(B1, x) - pref(B2, x) using two Fenwick trees of size N+2.',
    },
  ],
  timeComplexity: 'O(N) build, O(log N) update / prefix sum / k-th order statistic',
  spaceComplexity: 'O(N)',
  pitfalls: [
    {
      type: 'RE',
      title: 'Passing 0-Indexed idx = 0 Into update(idx, val)',
      detail:
        'Since 0 & -0 == 0, calling while (i <= n) i += i & -i with i = 0 causes an immediate infinite loop (TLE)! Always convert 0-based indices via idx + 1 before calling BIT methods.',
    },
    {
      type: 'WA',
      title: 'Binary Lifting on BIT With Negative Frequencies or Non-Power-of-Two Bound Bug',
      detail:
        'BIT binary lifting requires all frequency weights >= 0 (monotonic prefix sums), and the jump loop MUST check if (pos + step <= n && acc + bit[pos + step] < k) strictly less than k!',
    },
    {
      type: 'WA',
      title: '32-Bit Integer Overflow in Inversion Count & Dynamic Range Sums',
      detail:
        'N = 2e5 elements up to 10^9 give range sums up to 2e14, and inversion counts reach N*(N-1)/2 ~ 2e10. Always store BIT totals in 64-bit integers (long long / i64 / long).',
    },
    {
      type: 'TLE',
      title: 'Using std::map Instead of Coordinate Compression + BIT on Salary Queries',
      detail:
        'Reading all queries offline, sorting unique values into a compressed array, and running binary search + BIT beats heavy balanced BSTs by 5-10x.',
    },
  ],
  implementations: {
    cpp20: `#include <bits/stdc++.h>
using namespace std;

// Complete 1-indexed Fenwick Tree with O(N) build, Point Update, Range Sum, and O(log N) K-th Lifting
struct Fenwick {
    int n, max_pow;
    vector<long long> bit;

    Fenwick(int n) : n(n), bit(n + 1, 0) {
        max_pow = 1;
        while ((max_pow << 1) <= n) max_pow <<= 1;
    }

    Fenwick(const vector<long long>& a) : Fenwick((int)a.size()) {
        for (int i = 1; i <= n; ++i) {
            bit[i] += a[i - 1];
            int j = i + (i & -i);
            if (j <= n) bit[j] += bit[i];
        }
    }

    void add(int idx1, long long delta) {
        for (int i = idx1; i <= n; i += i & -i) bit[i] += delta;
    }

    long long pref(int idx1) const {
        long long res = 0;
        for (int i = idx1; i > 0; i -= i & -i) res += bit[i];
        return res;
    }

    long long range_sum(int l1, int r1) const {
        return pref(r1) - pref(l1 - 1);
    }

    // Smallest 1-based index i such that pref(i) >= k (requires all values >= 0)
    int kth(long long k) const {
        int pos = 0;
        long long acc = 0;
        for (int step = max_pow; step > 0; step >>= 1) {
            if (pos + step <= n && acc + bit[pos + step] < k) {
                pos += step;
                acc += bit[pos];
            }
        }
        return pos + 1;
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, q;
    if (!(cin >> n >> q)) return 0;
    vector<long long> a(n);
    for (int i = 0; i < n; ++i) cin >> a[i];
    Fenwick ft(a);
    while (q--) {
        int t;
        cin >> t;
        if (t == 1) {
            int k; long long u;
            cin >> k >> u;
            ft.add(k, u - a[k - 1]);
            a[k - 1] = u;
        } else {
            int l, r;
            cin >> l >> r;
            cout << ft.range_sum(l, r) << '\\n';
        }
    }
    return 0;
}`,
    rust: `use std::io::{self, BufWriter, Read, Write};

struct Fenwick {
    n: usize,
    max_pow: usize,
    bit: Vec<i64>,
}

impl Fenwick {
    fn from_slice(a: &[i64]) -> Self {
        let n = a.len();
        let mut max_pow = 1;
        while (max_pow << 1) <= n { max_pow <<= 1; }
        let mut bit = vec![0i64; n + 1];
        for i in 1..=n {
            bit[i] += a[i - 1];
            let j = i + (i & i.wrapping_neg());
            if j <= n { bit[j] += bit[i]; }
        }
        Self { n, max_pow, bit }
    }

    fn add(&mut self, mut i: usize, delta: i64) {
        while i <= self.n {
            self.bit[i] += delta;
            i += i & i.wrapping_neg();
        }
    }

    fn pref(&self, mut i: usize) -> i64 {
        let mut res = 0;
        while i > 0 {
            res += self.bit[i];
            i -= i & i.wrapping_neg();
        }
        res
    }

    fn range_sum(&self, l: usize, r: usize) -> i64 {
        self.pref(r) - self.pref(l - 1)
    }

    fn kth(&self, k: i64) -> usize {
        let mut pos = 0usize;
        let mut acc = 0i64;
        let mut step = self.max_pow;
        while step > 0 {
            if pos + step <= self.n && acc + self.bit[pos + step] < k {
                pos += step;
                acc += self.bit[pos];
            }
            step >>= 1;
        }
        pos + 1
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
    let mut ft = Fenwick::from_slice(&a);
    let _ = || ft.kth(1);
    let mut out = BufWriter::new(io::stdout().lock());
    for _ in 0..q {
        let t: usize = it.next().unwrap().parse().unwrap();
        if t == 1 {
            let k: usize = it.next().unwrap().parse().unwrap();
            let u: i64 = it.next().unwrap().parse().unwrap();
            ft.add(k, u - a[k - 1]);
            a[k - 1] = u;
        } else {
            let l: usize = it.next().unwrap().parse().unwrap();
            let r: usize = it.next().unwrap().parse().unwrap();
            writeln!(out, "{}", ft.range_sum(l, r)).unwrap();
        }
    }
}`,
    java21: `import java.io.*;

public class Main {
    static final class FastScanner {
        private final InputStream in = System.in;
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;
        int readByte() throws IOException {
            if (ptr >= len) { len = in.read(buf); ptr = 0; if (len <= 0) return -1; }
            return buf[ptr++];
        }
        long nextLong() throws IOException {
            int c; do { c = readByte(); } while (c <= 32 && c != -1);
            if (c == -1) return Long.MIN_VALUE;
            long sgn = 1; if (c == '-') { sgn = -1; c = readByte(); }
            long res = 0;
            while (c > 32) { res = res * 10 + (c - '0'); c = readByte(); }
            return res * sgn;
        }
    }

    static final class Fenwick {
        final int n, maxPow;
        final long[] bit;

        Fenwick(long[] a) {
            this.n = a.length;
            int p = 1;
            while ((p << 1) <= n) p <<= 1;
            this.maxPow = p;
            this.bit = new long[n + 1];
            for (int i = 1; i <= n; i++) {
                bit[i] += a[i - 1];
                int j = i + (i & -i);
                if (j <= n) bit[j] += bit[i];
            }
        }

        void add(int i, long delta) {
            for (; i <= n; i += i & -i) bit[i] += delta;
        }

        long pref(int i) {
            long res = 0;
            for (; i > 0; i -= i & -i) res += bit[i];
            return res;
        }

        long rangeSum(int l, int r) { return pref(r) - pref(l - 1); }

        int kth(long k) {
            int pos = 0;
            long acc = 0;
            for (int step = maxPow; step > 0; step >>= 1) {
                if (pos + step <= n && acc + bit[pos + step] < k) {
                    pos += step;
                    acc += bit[pos];
                }
            }
            return pos + 1;
        }
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        long nl = fs.nextLong();
        if (nl == Long.MIN_VALUE) return;
        int n = (int) nl, q = (int) fs.nextLong();
        long[] a = new long[n];
        for (int i = 0; i < n; i++) a[i] = fs.nextLong();
        Fenwick ft = new Fenwick(a);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < q; i++) {
            int t = (int) fs.nextLong();
            if (t == 1) {
                int k = (int) fs.nextLong();
                long u = fs.nextLong();
                ft.add(k, u - a[k - 1]);
                a[k - 1] = u;
            } else {
                int l = (int) fs.nextLong(), r = (int) fs.nextLong();
                sb.append(ft.rangeSum(l, r)).append('\\n');
            }
        }
        System.out.print(sb);
    }
}`,
    python3: `import sys

class Fenwick:
    def __init__(self, a: list[int]):
        self.n = len(a)
        self.max_pow = 1
        while (self.max_pow << 1) <= self.n:
            self.max_pow <<= 1
        self.bit = [0] * (self.n + 1)
        for i in range(1, self.n + 1):
            self.bit[i] += a[i - 1]
            j = i + (i & -i)
            if j <= self.n:
                self.bit[j] += self.bit[i]

    def add(self, i: int, delta: int):
        n, bit = self.n, self.bit
        while i <= n:
            bit[i] += delta
            i += i & -i

    def pref(self, i: int) -> int:
        res, bit = 0, self.bit
        while i > 0:
            res += bit[i]
            i -= i & -i
        return res

    def range_sum(self, l: int, r: int) -> int:
        return self.pref(r) - self.pref(l - 1)

    def kth(self, k: int) -> int:
        pos, acc, step = 0, 0, self.max_pow
        while step > 0:
            if pos + step <= self.n and acc + self.bit[pos + step] < k:
                pos += step
                acc += self.bit[pos]
            step >>= 1
        return pos + 1

def solve():
    data = list(map(int, sys.stdin.buffer.read().split()))
    if not data:
        return
    it = iter(data)
    n, q = next(it), next(it)
    a = [next(it) for _ in range(n)]
    ft = Fenwick(a)
    out = []
    for _ in range(q):
        t = next(it)
        if t == 1:
            k, u = next(it), next(it)
            ft.add(k, u - a[k - 1])
            a[k - 1] = u
        else:
            l, r = next(it), next(it)
            out.append(str(ft.range_sum(l, r)))
    sys.stdout.write("\\n".join(out) + "\\n")

if __name__ == "__main__":
    solve()`,
    ruby: `class Fenwick
  def initialize(a)
    @n = a.size
    @max_pow = 1
    @max_pow <<= 1 while (@max_pow << 1) <= @n
    @bit = Array.new(@n + 1, 0)
    (1..@n).each do |i|
      @bit[i] += a[i - 1]
      j = i + (i & -i)
      @bit[j] += @bit[i] if j <= @n
    end
  end

  def add(i, delta)
    while i <= @n
      @bit[i] += delta
      i += i & -i
    end
  end

  def pref(i)
    res = 0
    while i > 0
      res += @bit[i]
      i -= i & -i
    end
    res
  end

  def range_sum(l, r)
    pref(r) - pref(l - 1)
  end

  def kth(k)
    pos = 0; acc = 0; step = @max_pow
    while step > 0
      if pos + step <= @n && acc + @bit[pos + step] < k
        pos += step
        acc += @bit[pos]
      end
      step >>= 1
    end
    pos + 1
  end
end

data = STDIN.read.split.map(&:to_i)
exit if data.empty?
n, q = data[0], data[1]
a = data[2, n]
ft = Fenwick.new(a)
idx = 2 + n
out = []
q.times do
  t = data[idx]
  if t == 1
    k = data[idx + 1]; u = data[idx + 2]; idx += 3
    ft.add(k, u - a[k - 1]); a[k - 1] = u
  else
    l = data[idx + 1]; r = data[idx + 2]; idx += 3
    out << ft.range_sum(l, r)
  end
end
puts out.join("\\n")`,
  },
  practiceProblems: [
    {
      id: 'ch10-warmup',
      tier: 'Warmup',
      ratingRange: '1100–1300',
      title: 'Count Array Inversions via Fenwick Tree',
      statement:
        'Given an integer array A of length N (1 <= A[i] <= 10^9), count the number of pairs (i, j) with i < j and A[i] > A[j].',
      constraints: '1 <= N <= 2 * 10^5, Time Limit: 1.0s',
      sampleInput: '5\n2 4 1 3 5',
      sampleOutput: '3',
      hints: [
        'Coordinate-compress A[i] into ranks 1..U.',
        'Scan i from left to right: add (pref(U) - pref(rank[i])) to the inversion count, then update add(rank[i], +1).',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n; if (!(cin >> n)) return 0;
    vector<long long> a(n), vals;
    for (int i = 0; i < n; ++i) cin >> a[i];
    vals = a; sort(vals.begin(), vals.end());
    vals.erase(unique(vals.begin(), vals.end()), vals.end());
    int u = (int)vals.size();
    vector<long long> bit(u + 1, 0);
    auto add = [&](int i) { for (; i <= u; i += i & -i) bit[i]++; };
    auto pref = [&](int i) { long long r = 0; for (; i > 0; i -= i & -i) r += bit[i]; return r; };
    long long inv = 0;
    for (int i = 0; i < n; ++i) {
        int rk = (int)(lower_bound(vals.begin(), vals.end(), a[i]) - vals.begin()) + 1;
        inv += i - pref(rk);
        add(rk);
    }
    cout << inv << '\\n';
}`,
        rust: `use std::io::{self, Read};
fn main() {
    let mut s = String::new(); io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace().map(|x| x.parse::<i64>().unwrap());
    let Some(n) = it.next() else { return; };
    let n = n as usize;
    let a: Vec<i64> = it.take(n).collect();
    let mut vals = a.clone(); vals.sort_unstable(); vals.dedup();
    let u = vals.len();
    let mut bit = vec![0i64; u + 1];
    let mut inv = 0i64;
    for (idx, &x) in a.iter().enumerate() {
        let rk = vals.binary_search(&x).unwrap() + 1;
        let mut p = 0i64; let mut j = rk;
        while j > 0 { p += bit[j]; j -= j & j.wrapping_neg(); }
        inv += (idx as i64) - p;
        let mut i = rk;
        while i <= u { bit[i] += 1; i += i & i.wrapping_neg(); }
    }
    println!("{}", inv);
}`,
        java21: `import java.io.*;
import java.util.*;
public class Main {
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String line = br.readLine(); if (line == null) return;
        int n = Integer.parseInt(line.trim());
        long[] a = new long[n], vals = new long[n];
        StringTokenizer st = new StringTokenizer(br.readLine());
        for (int i = 0; i < n; i++) a[i] = vals[i] = Long.parseLong(st.nextToken());
        Arrays.sort(vals);
        int u = 0;
        for (int i = 0; i < n; i++) if (i == 0 || vals[i] != vals[i - 1]) vals[u++] = vals[i];
        long[] bit = new long[u + 1];
        long inv = 0;
        for (int i = 0; i < n; i++) {
            int rk = Arrays.binarySearch(vals, 0, u, a[i]) + 1;
            long p = 0; for (int j = rk; j > 0; j -= j & -j) p += bit[j];
            inv += i - p;
            for (int j = rk; j <= u; j += j & -j) bit[j]++;
        }
        System.out.println(inv);
    }
}`,
        python3: `from bisect import bisect_left
import sys
def solve():
    data = list(map(int, sys.stdin.buffer.read().split()))
    if not data: return
    n, a = data[0], data[1:]
    vals = sorted(set(a))
    u = len(vals)
    bit = [0] * (u + 1)
    inv = 0
    for idx, x in enumerate(a):
        rk = bisect_left(vals, x) + 1
        p = 0; j = rk
        while j > 0: p += bit[j]; j -= j & -j
        inv += idx - p
        while rk <= u: bit[rk] += 1; rk += rk & -rk
    print(inv)
if __name__ == "__main__":
    solve()`,
        ruby: `data = STDIN.read.split.map(&:to_i)
exit if data.empty?
n = data[0]; a = data[1, n]
vals = a.uniq.sort
u = vals.size
bit = Array.new(u + 1, 0)
inv = 0
a.each_with_index do |x, idx|
  rk = vals.bsearch_index { |v| v >= x } + 1
  p = 0; j = rk
  while j > 0; p += bit[j]; j -= j & -j; end
  inv += idx - p
  while rk <= u; bit[rk] += 1; rk += rk & -rk; end
end
puts inv`,
      },
    },
    {
      id: 'ch10-standard',
      tier: 'Standard',
      ratingRange: '1500–1750',
      title: 'Dynamic Order-Statistic Multiset (Insert, Erase, Find K-th)',
      statement:
        'Maintain a multiset of integers (initially empty) supporting Q queries: (+ x) insert x, (- x) erase one occurrence of x if present, or (? k) output the k-th smallest integer currently in the multiset (1-indexed) or -1 if size < k.',
      constraints: '1 <= Q <= 2 * 10^5, 1 <= x <= 10^9, Time Limit: 1.5s',
      sampleInput: '7\n+ 30\n+ 10\n+ 20\n? 2\n- 20\n? 2\n? 5',
      sampleOutput: '20\n30\n-1',
      hints: [
        'Offline-collect all values x appearing in + / - queries, sort and deduplicate them into vals[0..M-1].',
        'Maintain frequencies in a BIT of size M and answer (? k) in O(log M) via Binary Lifting on BIT!',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int q; if (!(cin >> q)) return 0;
    vector<pair<char, long long>> qs(q);
    vector<long long> vals;
    for (int i = 0; i < q; ++i) {
        cin >> qs[i].first >> qs[i].second;
        if (qs[i].first != '?') vals.push_back(qs[i].second);
    }
    sort(vals.begin(), vals.end());
    vals.erase(unique(vals.begin(), vals.end()), vals.end());
    int m = max(1, (int)vals.size()), max_p = 1;
    while ((max_p << 1) <= m) max_p <<= 1;
    vector<int> bit(m + 1, 0), cnt(m + 1, 0);
    int total = 0;
    auto add = [&](int i, int d) { for (; i <= m; i += i & -i) bit[i] += d; };
    for (auto [op, x] : qs) {
        if (op == '?') {
            if (x > total) { cout << -1 << '\\n'; continue; }
            int pos = 0, acc = 0;
            for (int step = max_p; step > 0; step >>= 1) {
                if (pos + step <= m && acc + bit[pos + step] < x) {
                    pos += step; acc += bit[pos];
                }
            }
            cout << vals[pos] << '\\n';
        } else {
            int rk = (int)(lower_bound(vals.begin(), vals.end(), x) - vals.begin()) + 1;
            if (op == '+') { cnt[rk]++; total++; add(rk, 1); }
            else if (cnt[rk] > 0) { cnt[rk]--; total--; add(rk, -1); }
        }
    }
}`,
        rust: `use std::io::{self, BufWriter, Read, Write};
fn main() {
    let mut s = String::new(); io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let Some(qs_str) = it.next() else { return; };
    let q: usize = qs_str.parse().unwrap();
    let mut qs = Vec::with_capacity(q);
    let mut vals = Vec::new();
    for _ in 0..q {
        let op = it.next().unwrap().chars().next().unwrap();
        let x: i64 = it.next().unwrap().parse().unwrap();
        qs.push((op, x));
        if op != '?' { vals.push(x); }
    }
    vals.sort_unstable(); vals.dedup();
    let m = vals.len().max(1);
    let mut max_p = 1usize; while (max_p << 1) <= m { max_p <<= 1; }
    let mut bit = vec![0i64; m + 1]; let mut cnt = vec![0i64; m + 1]; let mut total = 0i64;
    let mut out = BufWriter::new(io::stdout().lock());
    for (op, x) in qs {
        if op == '?' {
            if x > total { writeln!(out, "-1").unwrap(); continue; }
            let (mut pos, mut acc, mut step) = (0usize, 0i64, max_p);
            while step > 0 {
                if pos + step <= m && acc + bit[pos + step] < x { pos += step; acc += bit[pos]; }
                step >>= 1;
            }
            writeln!(out, "{}", vals[pos]).unwrap();
        } else {
            let rk = vals.binary_search(&x).unwrap() + 1;
            let mut d = 0i64;
            if op == '+' { cnt[rk] += 1; total += 1; d = 1; }
            else if cnt[rk] > 0 { cnt[rk] -= 1; total -= 1; d = -1; }
            if d != 0 { let mut i = rk; while i <= m { bit[i] += d; i += i & i.wrapping_neg(); } }
        }
    }
}`,
        java21: `import java.io.*;
import java.util.*;
public class Main {
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String line = br.readLine(); if (line == null) return;
        int q = Integer.parseInt(line.trim());
        char[] ops = new char[q]; long[] xs = new long[q], raw = new long[q]; int rc = 0;
        for (int i = 0; i < q; i++) {
            StringTokenizer st = new StringTokenizer(br.readLine());
            ops[i] = st.nextToken().charAt(0); xs[i] = Long.parseLong(st.nextToken());
            if (ops[i] != '?') raw[rc++] = xs[i];
        }
        Arrays.sort(raw, 0, rc);
        long[] vals = new long[Math.max(1, rc)]; int m = 0;
        for (int i = 0; i < rc; i++) if (i == 0 || raw[i] != raw[i - 1]) vals[m++] = raw[i];
        m = Math.max(1, m);
        int maxP = 1; while ((maxP << 1) <= m) maxP <<= 1;
        int[] bit = new int[m + 1], cnt = new int[m + 1]; int total = 0;
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < q; i++) {
            if (ops[i] == '?') {
                if (xs[i] > total) { sb.append("-1\\n"); continue; }
                int pos = 0, acc = 0;
                for (int step = maxP; step > 0; step >>= 1)
                    if (pos + step <= m && acc + bit[pos + step] < xs[i]) { pos += step; acc += bit[pos]; }
                sb.append(vals[pos]).append('\\n');
            } else {
                int rk = Arrays.binarySearch(vals, 0, m, xs[i]) + 1, d = 0;
                if (ops[i] == '+') { cnt[rk]++; total++; d = 1; }
                else if (cnt[rk] > 0) { cnt[rk]--; total--; d = -1; }
                if (d != 0) for (int j = rk; j <= m; j += j & -j) bit[j] += d;
            }
        }
        System.out.print(sb);
    }
}`,
        python3: `from bisect import bisect_left
import sys
def solve():
    toks = sys.stdin.buffer.read().decode().split()
    if not toks: return
    q = int(toks[0])
    qs = []; vals = []
    for i in range(q):
        op = toks[1 + 2 * i]; x = int(toks[2 + 2 * i])
        qs.append((op, x))
        if op != '?': vals.append(x)
    vals = sorted(set(vals))
    m = max(1, len(vals))
    max_p = 1
    while (max_p << 1) <= m: max_p <<= 1
    bit = [0] * (m + 1); cnt = [0] * (m + 1); total = 0; out = []
    for op, x in qs:
        if op == '?':
            if x > total: out.append("-1"); continue
            pos = acc = 0; step = max_p
            while step:
                if pos + step <= m and acc + bit[pos + step] < x:
                    pos += step; acc += bit[pos]
                step >>= 1
            out.append(str(vals[pos]))
        else:
            rk = bisect_left(vals, x) + 1; d = 0
            if op == '+': cnt[rk] += 1; total += 1; d = 1
            elif cnt[rk] > 0: cnt[rk] -= 1; total -= 1; d = -1
            if d:
                i = rk
                while i <= m: bit[i] += d; i += i & -i
    sys.stdout.write("\\n".join(out) + "\\n")
if __name__ == "__main__":
    solve()`,
        ruby: `toks = STDIN.read.split
exit if toks.empty?
q = toks[0].to_i
qs = []; vals = []
q.times do |i|
  op = toks[1 + 2 * i]; x = toks[2 + 2 * i].to_i
  qs << [op, x]; vals << x if op != '?'
end
vals = vals.uniq.sort
m = [1, vals.size].max
max_p = 1; max_p <<= 1 while (max_p << 1) <= m
bit = Array.new(m + 1, 0); cnt = Array.new(m + 1, 0); total = 0; out = []
qs.each do |op, x|
  if op == '?'
    if x > total; out << -1; next; end
    pos = 0; acc = 0; step = max_p
    while step > 0
      if pos + step <= m && acc + bit[pos + step] < x
        pos += step; acc += bit[pos]
      end
      step >>= 1
    end
    out << vals[pos]
  else
    rk = vals.bsearch_index { |v| v >= x } + 1; d = 0
    if op == '+'; cnt[rk] += 1; total += 1; d = 1
    elsif cnt[rk] > 0; cnt[rk] -= 1; total -= 1; d = -1
    end
    if d != 0; i = rk; while i <= m; bit[i] += d; i += i & -i; end; end
  end
end
puts out.join("\\n")`,
      },
    },
    {
      id: 'ch10-boss',
      tier: 'Boss',
      ratingRange: '2000–2300',
      title: 'Range Add & Range Sum via Dual Fenwick Trees (No Segment Tree)',
      statement:
        'Given an array of N zeros, process Q queries: (1 l r x) add x to every element in [l..r] (1-indexed), or (2 l r) print the sum of A[l..r].',
      constraints: '1 <= N, Q <= 2 * 10^5, |x| <= 10^9, Time Limit: 1.0s',
      sampleInput: '5 4\n1 1 3 5\n1 2 5 2\n2 1 3\n2 2 5',
      sampleOutput: '19\n18',
      hints: [
        'Using difference array D[i] (so A[k] = sum_{i<=k} D[i]), prefix_sum(x) = sum_{k=1}^x sum_{i=1}^k D[i] = (x + 1) * sum(D[1..x]) - sum(i * D[i]).',
        'Maintain B1[i] = D[i] and B2[i] = i * D[i] in two tiny Fenwick Trees!',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, q; if (!(cin >> n >> q)) return 0;
    vector<long long> b1(n + 2, 0), b2(n + 2, 0);
    auto add = [&](vector<long long>& b, int i, long long v) {
        for (; i <= n + 1; i += i & -i) b[i] += v;
    };
    auto qry = [&](const vector<long long>& b, int i) {
        long long r = 0; for (; i > 0; i -= i & -i) r += b[i]; return r;
    };
    auto range_add = [&](int l, int r, long long x) {
        add(b1, l, x); add(b1, r + 1, -x);
        add(b2, l, x * l); add(b2, r + 1, -x * (r + 1));
    };
    auto pref_sum = [&](int x) { return (x + 1) * qry(b1, x) - qry(b2, x); };
    while (q--) {
        int t, l, r; cin >> t >> l >> r;
        if (t == 1) { long long x; cin >> x; range_add(l, r, x); }
        else cout << pref_sum(r) - pref_sum(l - 1) << '\\n';
    }
}`,
        rust: `use std::io::{self, BufWriter, Read, Write};
fn add(b: &mut [i64], mut i: usize, v: i64) { while i < b.len() { b[i] += v; i += i & i.wrapping_neg(); } }
fn qry(b: &[i64], mut i: usize) -> i64 { let mut r = 0; while i > 0 { r += b[i]; i -= i & i.wrapping_neg(); } r }
fn main() {
    let mut s = String::new(); io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace().map(|x| x.parse::<i64>().unwrap());
    let Some(n) = it.next() else { return; };
    let (n, q) = (n as usize, it.next().unwrap() as usize);
    let (mut b1, mut b2) = (vec![0i64; n + 2], vec![0i64; n + 2]);
    let mut out = BufWriter::new(io::stdout().lock());
    for _ in 0..q {
        let t = it.next().unwrap(); let l = it.next().unwrap() as usize; let r = it.next().unwrap() as usize;
        if t == 1 {
            let x = it.next().unwrap();
            add(&mut b1, l, x); add(&mut b1, r + 1, -x);
            add(&mut b2, l, x * l as i64); add(&mut b2, r + 1, -x * (r + 1) as i64);
        } else {
            let pr = (r as i64 + 1) * qry(&b1, r) - qry(&b2, r);
            let pl = (l as i64) * qry(&b1, l - 1) - qry(&b2, l - 1);
            writeln!(out, "{}", pr - pl).unwrap();
        }
    }
}`,
        java21: `import java.io.*;
import java.util.*;
public class Main {
    static int n; static long[] b1, b2;
    static void add(long[] b, int i, long v) { for (; i <= n + 1; i += i & -i) b[i] += v; }
    static long qry(long[] b, int i) { long r = 0; for (; i > 0; i -= i & -i) r += b[i]; return r; }
    static long pref(int x) { return (x + 1L) * qry(b1, x) - qry(b2, x); }
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String line = br.readLine(); if (line == null) return;
        StringTokenizer st = new StringTokenizer(line);
        n = Integer.parseInt(st.nextToken()); int q = Integer.parseInt(st.nextToken());
        b1 = new long[n + 2]; b2 = new long[n + 2];
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < q; i++) {
            st = new StringTokenizer(br.readLine());
            int t = Integer.parseInt(st.nextToken()), l = Integer.parseInt(st.nextToken()), r = Integer.parseInt(st.nextToken());
            if (t == 1) {
                long x = Long.parseLong(st.nextToken());
                add(b1, l, x); add(b1, r + 1, -x);
                add(b2, l, x * l); add(b2, r + 1, -x * (r + 1));
            } else sb.append(pref(r) - pref(l - 1)).append('\\n');
        }
        System.out.print(sb);
    }
}`,
        python3: `import sys
def solve():
    data = list(map(int, sys.stdin.buffer.read().split()))
    if not data: return
    it = iter(data)
    n, q = next(it), next(it)
    b1, b2 = [0]*(n+2), [0]*(n+2)
    def add(b, i, v):
        while i <= n + 1: b[i] += v; i += i & -i
    def qry(b, i):
        r = 0
        while i > 0: r += b[i]; i -= i & -i
        return r
    def pref(x): return (x + 1) * qry(b1, x) - qry(b2, x)
    out = []
    for _ in range(q):
        t, l, r = next(it), next(it), next(it)
        if t == 1:
            x = next(it)
            add(b1, l, x); add(b1, r + 1, -x)
            add(b2, l, x * l); add(b2, r + 1, -x * (r + 1))
        else: out.append(str(pref(r) - pref(l - 1)))
    sys.stdout.write("\\n".join(out) + "\\n")
if __name__ == "__main__":
    solve()`,
        ruby: `data = STDIN.read.split.map(&:to_i)
exit if data.empty?
idx = 0; n = data[idx]; q = data[idx + 1]; idx += 2
b1 = Array.new(n + 2, 0); b2 = Array.new(n + 2, 0)
add = ->(b, i, v) { while i <= n + 1; b[i] += v; i += i & -i; end }
qry = ->(b, i) { r = 0; while i > 0; r += b[i]; i -= i & -i; end; r }
pref = ->(x) { (x + 1) * qry.call(b1, x) - qry.call(b2, x) }
out = []
q.times do
  t = data[idx]; l = data[idx + 1]; r = data[idx + 2]; idx += 3
  if t == 1
    x = data[idx]; idx += 1
    add.call(b1, l, x); add.call(b1, r + 1, -x)
    add.call(b2, l, x * l); add.call(b2, r + 1, -x * (r + 1))
  else out << (pref.call(r) - pref.call(l - 1))
  end
end
puts out.join("\\n")`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'CSES',
      title: 'Dynamic Range Sum Queries & Salary Queries',
      difficulty: 'Range Queries (1400–1700)',
      url: 'https://cses.fi/problemset/task/1144',
      patternNote: 'Direct benchmark for BIT speed and Coordinate Compression + BIT order statistics.',
    },
    {
      platform: 'AtCoder',
      title: 'ACL Practice B - Fenwick Tree & ABC221 E',
      difficulty: 'AtCoder Green/Cyan (~1200–1500)',
      url: 'https://atcoder.jp/contests/practice2/tasks/practice2_b',
      patternNote: 'Modular prefix DP over sorted values powered by Fenwick Tree.',
    },
    {
      platform: 'Codeforces',
      title: 'CF 61E - Enemy is weak & CF 1354D (Multiset)',
      difficulty: 'CF 1900',
      url: 'https://codeforces.com/problemset/problem/1354/D',
      patternNote: 'Tight 28 MB memory limit specifically forces BIT Binary Lifting over a Segment Tree!',
    },
    {
      platform: 'CodeChef',
      title: 'SPREAD / BIT2A / DYNAINV',
      difficulty: 'CodeChef 3★–4★',
      url: 'https://www.codechef.com/tags/problems/fenwick-tree',
      patternNote: 'Dynamic inversion counting and dual-BIT range updates.',
    },
    {
      platform: 'HackerRank',
      title: 'Insertion Sort Advanced Analysis',
      difficulty: 'Advanced Sorting / BIT',
      url: 'https://www.hackerrank.com/challenges/insertion-sort',
      patternNote: 'Classic BIT inversion counting across multi-test cases.',
    },
    {
      platform: 'NeetCode 150',
      title: 'Count of Smaller Numbers After Self',
      difficulty: 'FAANG Hard',
      url: 'https://leetcode.com/problemset/?search=Count+of+Smaller+Numbers+After+Self',
      patternNote: 'Right-to-left coordinate-compressed BIT cleanly solves online rank counting in 15 lines.',
    },
  ],
  interviewNotes: [
    'Whenever memory is tight (e.g., 28 MB for N = 10^6) and you only need invertible point-add / prefix-sum / k-th order queries, choose a Fenwick Tree over a 4N Segment Tree.',
    'Explain BIT Binary Lifting clearly: walking down powers of two avoids an O(log^2 N) binary-search-plus-query loop.',
  ],
  projectBlueprint: {
    title: 'Live Leaderboard & Order-Book Rank Tracker',
    tagline:
      'Sub-millisecond gaming leaderboard & exchange depth tracker supporting real-time score adjustments, top-K percentile lookups, and rank queries in O(log N).',
    stackSummary: 'TypeScript + Coordinate-Compressed Fenwick Tree + Binary Lifting',
    asciiDiagram:
      'Score / Price Tick (+delta) ──▶ Rank Indexer ──▶ Fenwick bit[1..N]\n' +
      '                                                       │\n' +
      '   getPlayerRank(score) / getKthRank(k) ◀──────────────┘ (O(log N) BIT Lift)',
    milestones: [
      {
        id: 'ch10-m1',
        title: 'Milestone 1: O(N) Fenwick Array & Point Delta API',
        detail: 'Build a Float64/BigInt-safe 1-indexed Fenwick array with instant score delta updates.',
      },
      {
        id: 'ch10-m2',
        title: 'Milestone 2: O(log N) K-th Percentile Binary Lifter',
        detail: 'Implement kthOrder(k) without calling prefixSum inside a binary search.',
      },
      {
        id: 'ch10-m3',
        title: 'Milestone 3: Order-Book Cumulative Volume Window',
        detail: 'Expose rangeVolume(minTick, maxTick) for real-time liquidity band monitoring.',
      },
    ],
    starterCode: `export class OrderBookLeaderboardBIT {
  private n: number;
  private maxPow: number;
  private bit: Int32Array;

  constructor(bucketCount: number) {
    this.n = bucketCount;
    let p = 1;
    while ((p << 1) <= this.n) p <<= 1;
    this.maxPow = p;
    this.bit = new Int32Array(this.n + 1);
  }

  addCount(bucket1Indexed: number, delta: number): void {
    for (let i = bucket1Indexed; i <= this.n; i += i & -i) {
      this.bit[i] += delta;
    }
  }

  prefixCount(bucket1Indexed: number): number {
    let sum = 0;
    for (let i = bucket1Indexed; i > 0; i -= i & -i) {
      sum += this.bit[i];
    }
    return sum;
  }

  rangeCount(left1: number, right1: number): number {
    if (left1 > right1) return 0;
    return this.prefixCount(right1) - this.prefixCount(left1 - 1);
  }

  kthBucket(k1Indexed: number): number {
    let pos = 0;
    let acc = 0;
    for (let step = this.maxPow; step > 0; step >>= 1) {
      if (pos + step <= this.n && acc + this.bit[pos + step] < k1Indexed) {
        pos += step;
        acc += this.bit[pos];
      }
    }
    return pos + 1;
  }
}`,
  },
};
