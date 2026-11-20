import type { TheoryChapter } from '../../types/vault';

export const CH14_GCD_SIEVE_SPF: TheoryChapter = {
  slug: 'euclidean-gcd-sieve-factorization',
  topicId: 'ma-46',
  title: 'Euclidean GCD, Sieve of Eratosthenes & SPF Factorization',
  domain: 'Math, Number Theory & Algebra',
  ratingTier: '800–1100',
  usacoDivision: 'Bronze',
  subtitle:
    'Compute greatest common divisors in O(log min(A, B)), precompute primes up to N in O(N log log N), and factorize millions of queries in O(log X) using Smallest Prime Factor (SPF) tables.',
  analogyTitle: 'The Folding Ribbon & Prime Stamp Factory Analogy',
  analogyBody:
    'Suppose you have two wooden sticks of lengths 48 and 18 and want the largest ruler tick that evenly measures both. Euclid realized that any tick dividing 48 and 18 also divides the leftover piece after snapping off 18s (48 % 18 = 12), then 18 % 12 = 6, then 12 % 6 = 0—leaving tick size 6 in only a handful of modulo steps! Now imagine you run a factory stamping serial numbers 2..N with their smallest prime ingredient. Instead of checking divisibility up to sqrt(X) for every single incoming number X, a Linear/Sieve SPF table stamps each composite number once with its smallest prime factor `spf[x]`. Later, to factorize X = 360 in O(log X), you simply divide `X /= spf[X]` repeatedly: 360 -> 180 -> 90 -> 45 -> 15 -> 5 -> 1, reading off every prime factor in sorted order!',
  prerequisites: [],
  traceTitle: 'Interactive Sieve Marking & SPF Factorization Trace (N = 50, Query X = 36)',
  traceSubtitle:
    'Step through Sieve of Eratosthenes composite crossings up to 50 and watch spf[] decompose X = 36 into prime powers in O(log X).',
  allowDynamicGraphEdit: false,
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Step 1: Initialize spf[i] = i & Prime Flags up to N = 50',
      explanation:
        'Every integer i in [2..50] starts unmarked with smallest prime factor spf[i] = i. Here we inspect key slots [2..16] alongside 36 and 49.',
      mode: 'array',
      arrays: [
        {
          name: 'Sample spf[] Table Slots',
          cells: [
            { index: 2, value: 2, label: 'prime', highlight: 'neutral' },
            { index: 3, value: 3, label: 'prime', highlight: 'neutral' },
            { index: 4, value: 4, highlight: 'neutral' },
            { index: 6, value: 6, highlight: 'neutral' },
            { index: 9, value: 9, highlight: 'neutral' },
            { index: 12, value: 12, highlight: 'neutral' },
            { index: 15, value: 15, highlight: 'neutral' },
            { index: 18, value: 18, highlight: 'neutral' },
            { index: 36, value: 36, highlight: 'neutral' },
            { index: 49, value: 49, highlight: 'neutral' },
          ],
        },
      ],
      variables: { LimitN: 50, OuterLimit: 'sqrt(50) = 7', Phase: 'Init' },
    },
    {
      stepNumber: 2,
      title: 'Step 2: Sieve p = 2 Marks Even Multiples (4, 6, 12, 18, 36 -> spf = 2)',
      explanation:
        'Since spf[2] == 2 (prime), sweep j = 4, 6, 8, ..., 50. Whenever spf[j] == j, assign spf[j] = 2 so the SMALLEST prime factor is preserved.',
      mode: 'array',
      arrays: [
        {
          name: 'Sample spf[] After p = 2',
          cells: [
            { index: 2, value: 2, label: 'PRIME', highlight: 'active' },
            { index: 3, value: 3, highlight: 'neutral' },
            { index: 4, value: 2, label: '2*2', highlight: 'updated' },
            { index: 6, value: 2, label: '2*3', highlight: 'updated' },
            { index: 9, value: 9, highlight: 'neutral' },
            { index: 12, value: 2, label: '2*6', highlight: 'updated' },
            { index: 15, value: 15, highlight: 'neutral' },
            { index: 18, value: 2, label: '2*9', highlight: 'updated' },
            { index: 36, value: 2, label: '2*18', highlight: 'updated' },
            { index: 49, value: 49, highlight: 'neutral' },
          ],
        },
      ],
      variables: { CurrentPrime: 2, MarkedCount: 24, NextPrime: 3 },
    },
    {
      stepNumber: 3,
      title: 'Step 3: Sieve p = 3, 5, 7 Finish Marking All Composites <= 50',
      explanation:
        'p = 3 stamps spf[9]=3 and spf[15]=3 (leaving spf[6]=2, spf[12]=2 intact!). p = 5 stamps 25, 35; p = 7 stamps spf[49]=7. Every composite <= 50 now holds its true SPF.',
      mode: 'array',
      arrays: [
        {
          name: 'Final spf[] Table (N = 50)',
          cells: [
            { index: 2, value: 2, label: 'prime', highlight: 'neutral' },
            { index: 3, value: 3, label: 'prime', highlight: 'neutral' },
            { index: 4, value: 2, highlight: 'neutral' },
            { index: 6, value: 2, highlight: 'neutral' },
            { index: 9, value: 3, label: '3*3', highlight: 'updated' },
            { index: 12, value: 2, highlight: 'neutral' },
            { index: 15, value: 3, label: '3*5', highlight: 'updated' },
            { index: 18, value: 2, highlight: 'neutral' },
            { index: 36, value: 2, highlight: 'neutral' },
            { index: 49, value: 7, label: '7*7', highlight: 'updated' },
          ],
        },
      ],
      variables: { TotalPrimesUpTo50: 15, TableReady: 'true' },
    },
    {
      stepNumber: 4,
      title: 'Step 4: Factorize Query X = 36 via Chain X /= spf[X]',
      explanation:
        '36 -> spf[36]=2 (x=18) -> spf[18]=2 (x=9) -> spf[9]=3 (x=3) -> spf[3]=3 (x=1). Yields 2^2 * 3^2 -> (2+1)*(2+1) = 9 divisors in 4 steps!',
      mode: 'array',
      arrays: [
        {
          name: 'Factorization Chain for X = 36',
          cells: [
            { index: 1, value: 36, label: 'spf=2', highlight: 'active' },
            { index: 2, value: 18, label: 'spf=2', highlight: 'active' },
            { index: 3, value: 9, label: 'spf=3', highlight: 'window' },
            { index: 4, value: 3, label: 'spf=3', highlight: 'window' },
            { index: 5, value: 1, label: 'done', highlight: 'updated' },
          ],
        },
      ],
      variables: { QueryX: 36, PrimeFactors: '2^2 * 3^2', DivisorCount: 9, Steps: 4 },
    },
  ],
  reductionClues: [
    {
      clue: '"Given Q <= 10^6 queries, count divisors / prime factors / Euler totient phi(x) for x <= 10^6"',
      translation: 'Precompute SPF sieve up to MAXN = 10^6 once in O(N log log N), then factorize every query in O(log X).',
    },
    {
      clue: '"Check if a subset has GCD = 1, or compute range GCD over subarrays"',
      translation: 'GCD is associative & idempotent: build Sparse Table O(N log N) or Segment Tree O(log N) over std::gcd.',
    },
    {
      clue: '"Find all primes in [L, R] where 1 <= L <= R <= 10^12 and R - L <= 10^6"',
      translation: 'Segmented Sieve: run normal sieve up to sqrt(R) <= 10^6, then mark multiples in shifted boolean array of size R - L + 1.',
    },
    {
      clue: '"Partition array elements by shared prime factors (connected if gcd(a[i], a[j]) > 1)"',
      translation: 'Factorize each a[i] using SPF and DSU-union index i with its prime-factor buckets in O(N log MAXA).',
    },
  ],
  timeComplexity: 'GCD: O(log min(A, B)) | Sieve: O(N log log N) | SPF Query: O(log X)',
  spaceComplexity: 'Sieve / SPF: O(N) | Segmented Sieve: O(sqrt(R) + (R - L + 1))',
  pitfalls: [
    {
      type: 'WA',
      title: 'Segmented Sieve Corner Case When L = 1',
      detail:
        'When shifting primes onto [L..R], `1` is never composite in the base prime loop `p >= 2` unless explicitly cleared! Always mark `isPrime[0] = false` when `L == 1`.',
    },
    {
      type: 'WA',
      title: 'Starting Segmented Sieve Multiple Below p * p',
      detail:
        'Using `max(p * p, ((L + p - 1) / p) * p)` ensures you never accidentally unmark `p` itself when `L <= p`! Also compute `p * p` in 64-bit (`long long`) since `p <= 10^6` means `p * p <= 10^12`.',
    },
    {
      type: 'MLE',
      title: 'Allocating 64-Bit Vectors for Sieve Up to 10^7',
      detail:
        'Using `vector<long long> spf(1e7)` consumes 80 MB, whereas `vector<int> spf(1e7)` uses 40 MB and `vector<uint8_t>` for boolean primes uses just 10 MB.',
    },
    {
      type: 'WA',
      title: 'GCD of Negative Numbers or Zero Edge Cases',
      detail:
        'In custom recursive `gcd(a, b)`, `gcd(0, 0)` is 0 and negative inputs can yield negative GCDs if you do not apply `abs()`. C++ `std::gcd` handles signs automatically in 64-bit.',
    },
  ],
  implementations: {
    cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    const int MAXN = 1'000'000;
    vector<int> spf(MAXN + 1);
    iota(spf.begin(), spf.end(), 0);
    for (int i = 2; 1LL * i * i <= MAXN; ++i) {
        if (spf[i] == i) {
            for (int j = i * i; j <= MAXN; j += i) {
                if (spf[j] == j) spf[j] = i;
            }
        }
    }

    int q;
    if (!(cin >> q)) return 0;
    while (q--) {
        int x;
        cin >> x;
        if (x <= 1) {
            cout << "1\\n";
            continue;
        }
        long long divisors = 1;
        int cur = x;
        while (cur > 1) {
            int p = spf[cur];
            int cnt = 0;
            while (cur % p == 0) {
                cur /= p;
                cnt++;
            }
            divisors *= (cnt + 1);
        }
        cout << divisors << '\\n';
    }
    return 0;
}`,
    rust: `use std::io::{self, Read};

fn gcd(mut a: i64, mut b: i64) -> i64 {
    a = a.abs();
    b = b.abs();
    while b != 0 {
        let t = a % b;
        a = b;
        b = t;
    }
    a
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let q: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };

    const MAXN: usize = 1_000_000;
    let mut spf: Vec<usize> = (0..=MAXN).collect();
    let mut i = 2usize;
    while i * i <= MAXN {
        if spf[i] == i {
            let mut j = i * i;
            while j <= MAXN {
                if spf[j] == j {
                    spf[j] = i;
                }
                j += i;
            }
        }
        i += 1;
    }

    let _sanity = gcd(48, 18);
    let mut out = String::new();
    for _ in 0..q {
        let mut x: usize = it.next().unwrap().parse().unwrap();
        let mut divisors: u64 = 1;
        while x > 1 {
            let p = spf[x];
            let mut cnt = 0u64;
            while x % p == 0 {
                x /= p;
                cnt += 1;
            }
            divisors *= cnt + 1;
        }
        out.push_str(&format!("{}\\n", divisors));
    }
    print!("{}", out);
}`,
    java21: `import java.io.IOException;
import java.io.InputStream;

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

        int nextInt() throws IOException {
            int c;
            while ((c = readByte()) <= 32) {
                if (c == -1) return Integer.MIN_VALUE;
            }
            int sign = 1;
            if (c == '-') { sign = -1; c = readByte(); }
            int res = 0;
            while (c > 32) {
                res = res * 10 + (c - '0');
                c = readByte();
            }
            return res * sign;
        }
    }

    static long gcd(long a, long b) {
        a = Math.abs(a);
        b = Math.abs(b);
        while (b != 0) {
            long t = a % b;
            a = b;
            b = t;
        }
        return a;
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        int q = fs.nextInt();
        if (q == Integer.MIN_VALUE) return;

        final int MAXN = 1_000_000;
        int[] spf = new int[MAXN + 1];
        for (int i = 0; i <= MAXN; i++) spf[i] = i;
        for (int i = 2; (long) i * i <= MAXN; i++) {
            if (spf[i] == i) {
                for (int j = i * i; j <= MAXN; j += i) {
                    if (spf[j] == j) spf[j] = i;
                }
            }
        }

        StringBuilder sb = new StringBuilder();
        for (int qi = 0; qi < q; qi++) {
            int x = fs.nextInt();
            long divisors = 1;
            while (x > 1) {
                int p = spf[x];
                int cnt = 0;
                while (x % p == 0) {
                    x /= p;
                    cnt++;
                }
                divisors *= (cnt + 1);
            }
            sb.append(divisors).append('\\n');
        }
        System.out.print(sb);
    }
}`,
    python3: `import math
import sys

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.buffer.read().split()
    if not data:
        return
    it = iter(data)
    q = int(next(it))

    MAXN = 1_000_000
    spf = list(range(MAXN + 1))
    limit = math.isqrt(MAXN)
    for i in range(2, limit + 1):
        if spf[i] == i:
            for j in range(i * i, MAXN + 1, i):
                if spf[j] == j:
                    spf[j] = i

    out = []
    for _ in range(q):
        x = int(next(it))
        divisors = 1
        while x > 1:
            p = spf[x]
            cnt = 0
            while x % p == 0:
                x //= p
                cnt += 1
            divisors *= cnt + 1
        out.append(str(divisors))
    sys.stdout.write("\\n".join(out) + "\\n")

if __name__ == "__main__":
    solve()`,
    ruby: `def gcd(a, b)
  a = a.abs
  b = b.abs
  while b != 0
    a, b = b, a % b
  end
  a
end

data = STDIN.read.split.map(&:to_i)
exit if data.empty?
q = data[0]

maxn = 1_000_000
spf = Array.new(maxn + 1) { |i| i }
i = 2
while i * i <= maxn
  if spf[i] == i
    j = i * i
    while j <= maxn
      spf[j] = i if spf[j] == j
      j += i
    end
  end
  i += 1
end

out = []
(1..q).each do |idx|
  x = data[idx]
  divisors = 1
  while x > 1
    p = spf[x]
    cnt = 0
    while x % p == 0
      x /= p
      cnt += 1
    end
    divisors *= (cnt + 1)
  end
  out << divisors
end
puts out.join("\\n")`,
  },
  practiceProblems: [
    {
      id: 'ma46-p1',
      tier: 'Warmup',
      ratingRange: '900–1100',
      title: 'Batch Divisor & Distinct Prime Factor Counter',
      statement:
        'Given Q integers x_1..x_Q (1 <= x_i <= 10^6), print for each query two space-separated integers: the total number of positive divisors and the number of distinct prime factors of x_i.',
      constraints: '1 <= Q <= 2*10^5, 1 <= x_i <= 10^6.',
      sampleInput: `3
12
16
17`,
      sampleOutput: `6 2
5 1
2 1`,
      hints: [
        'Precompute spf[1..10^6] once before reading queries.',
        'While x > 1, strip off all copies of `p = spf[x]` inside an inner loop: increment `distinctPrimes` once per prime `p`, and multiply `totalDivisors *= (exponent + 1)`.',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    const int MAXN = 1'000'000;
    vector<int> spf(MAXN + 1);
    iota(spf.begin(), spf.end(), 0);
    for (int i = 2; 1LL * i * i <= MAXN; ++i) {
        if (spf[i] == i) {
            for (int j = i * i; j <= MAXN; j += i) {
                if (spf[j] == j) spf[j] = i;
            }
        }
    }
    int q;
    if (!(cin >> q)) return 0;
    while (q--) {
        int x;
        cin >> x;
        long long divs = 1;
        int distinct = 0;
        while (x > 1) {
            int p = spf[x];
            int exp = 0;
            while (x % p == 0) {
                x /= p;
                exp++;
            }
            distinct++;
            divs *= (exp + 1);
        }
        cout << divs << ' ' << distinct << '\\n';
    }
    return 0;
}`,
        rust: `use std::io::{self, Read};

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let q: usize = match it.next() { Some(x) => x.parse().unwrap(), None => return };
    const MAXN: usize = 1_000_000;
    let mut spf: Vec<usize> = (0..=MAXN).collect();
    let mut i = 2usize;
    while i * i <= MAXN {
        if spf[i] == i {
            let mut j = i * i;
            while j <= MAXN {
                if spf[j] == j { spf[j] = i; }
                j += i;
            }
        }
        i += 1;
    }
    let mut out = String::new();
    for _ in 0..q {
        let mut x: usize = it.next().unwrap().parse().unwrap();
        let (mut divs, mut distinct) = (1u64, 0u64);
        while x > 1 {
            let p = spf[x];
            let mut exp = 0u64;
            while x % p == 0 {
                x /= p;
                exp += 1;
            }
            distinct += 1;
            divs *= exp + 1;
        }
        out.push_str(&format!("{} {}\\n", divs, distinct));
    }
    print!("{}", out);
}`,
        java21: `import java.io.*;

public class Main {
    static class FastScanner {
        private final InputStream in = System.in;
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;
        int read() throws IOException {
            if (ptr >= len) { len = in.read(buf); ptr = 0; if (len <= 0) return -1; }
            return buf[ptr++];
        }
        int nextInt() throws IOException {
            int c; while ((c = read()) <= 32) if (c == -1) return Integer.MIN_VALUE;
            int s = 1; if (c == '-') { s = -1; c = read(); }
            int v = 0; while (c > 32) { v = v * 10 + (c - '0'); c = read(); }
            return v * s;
        }
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        int q = fs.nextInt(); if (q == Integer.MIN_VALUE) return;
        final int MAXN = 1_000_000;
        int[] spf = new int[MAXN + 1];
        for (int i = 0; i <= MAXN; i++) spf[i] = i;
        for (int i = 2; (long) i * i <= MAXN; i++) {
            if (spf[i] == i) {
                for (int j = i * i; j <= MAXN; j += i) {
                    if (spf[j] == j) spf[j] = i;
                }
            }
        }
        StringBuilder sb = new StringBuilder();
        for (int qi = 0; qi < q; qi++) {
            int x = fs.nextInt();
            long divs = 1;
            int distinct = 0;
            while (x > 1) {
                int p = spf[x], exp = 0;
                while (x % p == 0) { x /= p; exp++; }
                distinct++;
                divs *= (exp + 1);
            }
            sb.append(divs).append(' ').append(distinct).append('\\n');
        }
        System.out.print(sb);
    }
}`,
        python3: `import math, sys
sys.setrecursionlimit(200000)
def solve():
    data = sys.stdin.buffer.read().split()
    if not data: return
    it = iter(data)
    q = int(next(it))
    MAXN = 1_000_000
    spf = list(range(MAXN + 1))
    for i in range(2, math.isqrt(MAXN) + 1):
        if spf[i] == i:
            for j in range(i * i, MAXN + 1, i):
                if spf[j] == j: spf[j] = i
    out = []
    for _ in range(q):
        x = int(next(it))
        divs = 1
        distinct = 0
        while x > 1:
            p = spf[x]
            exp = 0
            while x % p == 0:
                x //= p
                exp += 1
            distinct += 1
            divs *= exp + 1
        out.append(f"{divs} {distinct}")
    sys.stdout.write("\\n".join(out) + "\\n")
if __name__ == "__main__":
    solve()`,
        ruby: `data = STDIN.read.split.map(&:to_i)
exit if data.empty?
q = data[0]
maxn = 1_000_000
spf = Array.new(maxn + 1) { |i| i }
i = 2
while i * i <= maxn
  if spf[i] == i
    j = i * i
    while j <= maxn
      spf[j] = i if spf[j] == j
      j += i
    end
  end
  i += 1
end
out = []
(1..q).each do |idx|
  x = data[idx]
  divs = 1
  distinct = 0
  while x > 1
    p = spf[x]
    exp = 0
    while x % p == 0
      x /= p
      exp += 1
    end
    distinct += 1
    divs *= (exp + 1)
  end
  out << "#{divs} #{distinct}"
end
puts out.join("\\n")`,
      },
    },
    {
      id: 'ma46-p2',
      tier: 'Standard',
      ratingRange: '1250–1450',
      title: 'Range-Add GCD Queries via Difference Array & GCD Segment Tree',
      statement:
        'Maintain an array A[1..N]. Process Q operations of two types: (1 l r v) add v to every A[i] for l <= i <= r; (2 l r) output gcd(A[l], A[l+1], ..., A[r]). Notice that gcd(a_l, a_{l+1}, ..., a_r) = gcd(a_l, gcd(d_{l+1}, ..., d_r)) where d_i = A[i] - A[i-1]!',
      constraints: '1 <= N, Q <= 10^5, |A[i]|, |v| <= 10^9.',
      sampleInput: `4 4
4 8 12 16
2 1 4
1 2 3 4
2 2 4
2 1 4`,
      sampleOutput: `4
4
4`,
      hints: [
        'By Euclid’s identity gcd(a, b) = gcd(a, b - a), the GCD of a whole range [L..R] equals gcd(A[L], d[L+1], d[L+2], ..., d[R]) where d[i] = A[i] - A[i-1].',
        'A range add [L..R] + v only makes TWO point updates on the difference array: d[L] += v and d[R + 1] -= v, plus a Fenwick tree to fetch A[L]!',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

struct SegGCD {
    int n;
    vector<long long> tr;
    explicit SegGCD(int n) : n(n), tr(4 * n + 4, 0) {}
    void update(int node, int l, int r, int idx, long long delta) {
        if (l == r) { tr[node] += delta; return; }
        int m = (l + r) >> 1;
        if (idx <= m) update(node << 1, l, m, idx, delta);
        else update(node << 1 | 1, m + 1, r, idx, delta);
        tr[node] = std::gcd(abs(tr[node << 1]), abs(tr[node << 1 | 1]));
    }
    long long query(int node, int l, int r, int ql, int qr) const {
        if (ql > qr || qr < l || r < ql) return 0;
        if (ql <= l && r <= qr) return abs(tr[node]);
        int m = (l + r) >> 1;
        return std::gcd(query(node << 1, l, m, ql, qr),
                        query(node << 1 | 1, m + 1, r, ql, qr));
    }
};

struct Fenwick {
    int n;
    vector<long long> bit;
    explicit Fenwick(int n) : n(n), bit(n + 2, 0) {}
    void add(int i, long long v) { for (; i <= n; i += i & -i) bit[i] += v; }
    long long sum(int i) const { long long s = 0; for (; i > 0; i -= i & -i) s += bit[i]; return s; }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, q;
    if (!(cin >> n >> q)) return 0;
    vector<long long> a(n + 1, 0);
    for (int i = 1; i <= n; ++i) cin >> a[i];
    SegGCD seg(n);
    Fenwick fw(n);
    for (int i = 1; i <= n; ++i) {
        long long d = a[i] - a[i - 1];
        seg.update(1, 1, n, i, d);
        fw.add(i, d);
    }
    while (q--) {
        int tp, l, r;
        cin >> tp >> l >> r;
        if (tp == 1) {
            long long v; cin >> v;
            seg.update(1, 1, n, l, v);
            fw.add(l, v);
            if (r + 1 <= n) {
                seg.update(1, 1, n, r + 1, -v);
                fw.add(r + 1, -v);
            }
        } else {
            long long firstVal = abs(fw.sum(l));
            long long diffGcd = (l < r) ? seg.query(1, 1, n, l + 1, r) : 0;
            cout << std::gcd(firstVal, diffGcd) << '\\n';
        }
    }
    return 0;
}`,
        rust: `use std::io::{self, Read};

fn gcd(mut a: i64, mut b: i64) -> i64 {
    a = a.abs();
    b = b.abs();
    while b != 0 {
        let t = a % b;
        a = b;
        b = t;
    }
    a
}

struct SegGcd {
    n: usize,
    tr: Vec<i64>,
}

impl SegGcd {
    fn new(n: usize) -> Self {
        Self { n, tr: vec![0; 4 * n + 4] }
    }
    fn update(&mut self, node: usize, l: usize, r: usize, idx: usize, delta: i64) {
        if l == r {
            self.tr[node] += delta;
            return;
        }
        let m = (l + r) >> 1;
        if idx <= m { self.update(node << 1, l, m, idx, delta); }
        else { self.update(node << 1 | 1, m + 1, r, idx, delta); }
        self.tr[node] = gcd(self.tr[node << 1], self.tr[node << 1 | 1]);
    }
    fn query(&self, node: usize, l: usize, r: usize, ql: usize, qr: usize) -> i64 {
        if ql > qr || qr < l || r < ql { return 0; }
        if ql <= l && r <= qr { return self.tr[node].abs(); }
        let m = (l + r) >> 1;
        gcd(
            self.query(node << 1, l, m, ql, qr),
            self.query(node << 1 | 1, m + 1, r, ql, qr),
        )
    }
}

struct Fenwick {
    n: usize,
    bit: Vec<i64>,
}

impl Fenwick {
    fn new(n: usize) -> Self { Self { n, bit: vec![0; n + 2] } }
    fn add(&mut self, mut i: usize, v: i64) {
        while i <= self.n { self.bit[i] += v; i += i & i.wrapping_neg(); }
    }
    fn sum(&self, mut i: usize) -> i64 {
        let mut s = 0;
        while i > 0 { s += self.bit[i]; i -= i & i.wrapping_neg(); }
        s
    }
}

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let n: usize = match it.next() { Some(x) => x.parse().unwrap(), None => return };
    let q: usize = it.next().unwrap().parse().unwrap();
    let mut a = vec![0i64; n + 1];
    for i in 1..=n { a[i] = it.next().unwrap().parse().unwrap(); }
    let mut seg = SegGcd::new(n);
    let mut fw = Fenwick::new(n);
    for i in 1..=n {
        let d = a[i] - a[i - 1];
        seg.update(1, 1, n, i, d);
        fw.add(i, d);
    }
    let mut out = String::new();
    for _ in 0..q {
        let tp: usize = it.next().unwrap().parse().unwrap();
        let l: usize = it.next().unwrap().parse().unwrap();
        let r: usize = it.next().unwrap().parse().unwrap();
        if tp == 1 {
            let v: i64 = it.next().unwrap().parse().unwrap();
            seg.update(1, 1, n, l, v);
            fw.add(l, v);
            if r + 1 <= n {
                seg.update(1, 1, n, r + 1, -v);
                fw.add(r + 1, -v);
            }
        } else {
            let first_val = fw.sum(l);
            let diff_gcd = if l < r { seg.query(1, 1, n, l + 1, r) } else { 0 };
            out.push_str(&format!("{}\\n", gcd(first_val, diff_gcd)));
        }
    }
    print!("{}", out);
}`,
        java21: `import java.io.*;

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

    static long gcd(long a, long b) {
        a = Math.abs(a); b = Math.abs(b);
        while (b != 0) { long t = a % b; a = b; b = t; }
        return a;
    }

    static long[] tr, bit;
    static int N;

    static void segUpd(int node, int l, int r, int idx, long d) {
        if (l == r) { tr[node] += d; return; }
        int m = (l + r) >>> 1;
        if (idx <= m) segUpd(node << 1, l, m, idx, d);
        else segUpd(node << 1 | 1, m + 1, r, idx, d);
        tr[node] = gcd(tr[node << 1], tr[node << 1 | 1]);
    }

    static long segQry(int node, int l, int r, int ql, int qr) {
        if (ql > qr || qr < l || r < ql) return 0;
        if (ql <= l && r <= qr) return Math.abs(tr[node]);
        int m = (l + r) >>> 1;
        return gcd(segQry(node << 1, l, m, ql, qr), segQry(node << 1 | 1, m + 1, r, ql, qr));
    }

    static void bitAdd(int i, long v) { for (; i <= N; i += i & -i) bit[i] += v; }
    static long bitSum(int i) { long s = 0; for (; i > 0; i -= i & -i) s += bit[i]; return s; }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        long f = fs.nextLong(); if (f == Long.MIN_VALUE) return;
        N = (int) f; int q = fs.nextInt();
        tr = new long[4 * N + 4]; bit = new long[N + 2];
        long prev = 0;
        for (int i = 1; i <= N; i++) {
            long cur = fs.nextLong();
            long d = cur - prev; prev = cur;
            segUpd(1, 1, N, i, d); bitAdd(i, d);
        }
        StringBuilder sb = new StringBuilder();
        for (int qi = 0; qi < q; qi++) {
            int tp = fs.nextInt(), l = fs.nextInt(), r = fs.nextInt();
            if (tp == 1) {
                long v = fs.nextLong();
                segUpd(1, 1, N, l, v); bitAdd(l, v);
                if (r + 1 <= N) { segUpd(1, 1, N, r + 1, -v); bitAdd(r + 1, -v); }
            } else {
                long firstVal = bitSum(l);
                long diffGcd = l < r ? segQry(1, 1, N, l + 1, r) : 0;
                sb.append(gcd(firstVal, diffGcd)).append('\\n');
            }
        }
        System.out.print(sb);
    }
}`,
        python3: `import math, sys
sys.setrecursionlimit(200000)

def solve():
    data = sys.stdin.buffer.read().split()
    if not data: return
    it = iter(data)
    n, q = int(next(it)), int(next(it))
    size = 1
    while size < n: size <<= 1
    tr = [0] * (2 * size)
    bit = [0] * (n + 2)

    def bit_add(i, v):
        while i <= n:
            bit[i] += v; i += i & -i

    def bit_sum(i):
        s = 0
        while i > 0:
            s += bit[i]; i -= i & -i
        return s

    def seg_upd(idx, delta):
        pos = size + idx - 1
        tr[pos] += delta
        pos >>= 1
        while pos:
            tr[pos] = math.gcd(abs(tr[pos << 1]), abs(tr[pos << 1 | 1]))
            pos >>= 1

    def seg_qry(l, r):
        if l > r: return 0
        l += size - 1; r += size - 1
        g = 0
        while l <= r:
            if l & 1: g = math.gcd(g, abs(tr[l])); l += 1
            if not (r & 1): g = math.gcd(g, abs(tr[r])); r -= 1
            l >>= 1; r >>= 1
        return g

    prev = 0
    for i in range(1, n + 1):
        cur = int(next(it))
        d = cur - prev; prev = cur
        seg_upd(i, d); bit_add(i, d)

    out = []
    for _ in range(q):
        tp, l, r = int(next(it)), int(next(it)), int(next(it))
        if tp == 1:
            v = int(next(it))
            seg_upd(l, v); bit_add(l, v)
            if r + 1 <= n:
                seg_upd(r + 1, -v); bit_add(r + 1, -v)
        else:
            out.append(str(math.gcd(abs(bit_sum(l)), seg_qry(l + 1, r))))
    sys.stdout.write("\\n".join(out) + "\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `def gcd(a, b)
  a = a.abs; b = b.abs
  while b != 0
    a, b = b, a % b
  end
  a
end

data = STDIN.read.split.map(&:to_i)
exit if data.empty?
idx = 0; n = data[idx]; q = data[idx + 1]; idx += 2
size = 1
size <<= 1 while size < n
tr = Array.new(2 * size, 0)
bit = Array.new(n + 2, 0)

bit_add = ->(i, v) { while i <= n; bit[i] += v; i += i & -i; end }
bit_sum = ->(i) { s = 0; while i > 0; s += bit[i]; i -= i & -i; end; s }
seg_upd = ->(pos_i, delta) do
  p = size + pos_i - 1
  tr[p] += delta
  p >>= 1
  while p > 0
    tr[p] = gcd(tr[p << 1], tr[p << 1 | 1])
    p >>= 1
  end
end
seg_qry = ->(l, r) do
  return 0 if l > r
  l += size - 1; r += size - 1; g = 0
  while l <= r
    if (l & 1) == 1; g = gcd(g, tr[l]); l += 1; end
    if (r & 1) == 0; g = gcd(g, tr[r]); r -= 1; end
    l >>= 1; r >>= 1
  end
  g
end

prev = 0
(1..n).each do |i|
  cur = data[idx]; idx += 1
  d = cur - prev; prev = cur
  seg_upd.call(i, d); bit_add.call(i, d)
end

out = []
q.times do
  tp = data[idx]; l = data[idx + 1]; r = data[idx + 2]; idx += 3
  if tp == 1
    v = data[idx]; idx += 1
    seg_upd.call(l, v); bit_add.call(l, v)
    if r + 1 <= n
      seg_upd.call(r + 1, -v); bit_add.call(r + 1, -v)
    end
  else
    out << gcd(bit_sum.call(l), seg_qry.call(l + 1, r))
  end
end
puts out.join("\\n")`,
      },
    },
    {
      id: 'ma46-p3',
      tier: 'Boss',
      ratingRange: '1400–1600',
      title: 'Segmented Sieve Over Large Intervals [L, R] <= 10^12',
      statement:
        'Given two 64-bit integers L and R (1 <= L <= R <= 10^12, R - L <= 10^6), count and print all prime numbers in the closed range [L, R] within strict O(sqrt(R) + (R - L + 1)) memory.',
      constraints: '1 <= L <= R <= 10^12, R - L <= 10^6.',
      sampleInput: `999990 1000010`,
      sampleOutput: `2
999991
1000003`,
      hints: [
        'Run a classic sieve only up to floor(sqrt(R)) <= 10^6 to collect all small base primes.',
        'Allocate a boolean slice `isPrime` of size `R - L + 1` initialized to true, then for each base prime `p`, start marking at `max(p * p, ((L + p - 1) / p) * p)` and explicitly unmark index 0 if `L == 1`.',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    long long L, R;
    if (!(cin >> L >> R)) return 0;

    long long lim = sqrt((double)R) + 1;
    vector<char> base(lim + 1, 1);
    base[0] = base[1] = 0;
    vector<long long> primes;
    for (long long i = 2; i <= lim; ++i) {
        if (base[i]) {
            primes.push_back(i);
            for (long long j = i * i; j <= lim; j += i) base[j] = 0;
        }
    }

    int len = (int)(R - L + 1);
    vector<char> seg(len, 1);
    if (L == 1) seg[0] = 0;
    for (long long p : primes) {
        long long start = max(p * p, ((L + p - 1) / p) * p);
        for (long long j = start; j <= R; j += p) {
            seg[(int)(j - L)] = 0;
        }
    }

    vector<long long> ans;
    for (int i = 0; i < len; ++i) {
        if (seg[i]) ans.push_back(L + i);
    }
    cout << ans.size() << '\\n';
    for (long long x : ans) cout << x << '\\n';
    return 0;
}`,
        rust: `use std::io::{self, Read};

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let l: u64 = match it.next() { Some(x) => x.parse().unwrap(), None => return };
    let r: u64 = it.next().unwrap().parse().unwrap();

    let lim = ((r as f64).sqrt() as usize) + 1;
    let mut base = vec![true; lim + 1];
    base[0] = false;
    if lim >= 1 { base[1] = false; }
    let mut primes = Vec::new();
    for i in 2..=lim {
        if base[i] {
            primes.push(i as u64);
            let mut j = i * i;
            while j <= lim {
                base[j] = false;
                j += i;
            }
        }
    }

    let len = (r - l + 1) as usize;
    let mut seg = vec![true; len];
    if l == 1 { seg[0] = false; }
    for &p in &primes {
        let mut start = ((l + p - 1) / p) * p;
        if start < p * p { start = p * p; }
        let mut j = start;
        while j <= r {
            seg[(j - l) as usize] = false;
            j += p;
        }
    }

    let mut out_nums = Vec::new();
    for i in 0..len {
        if seg[i] { out_nums.push((l + i as u64).to_string()); }
    }
    println!("{}", out_nums.len());
    if !out_nums.is_empty() {
        println!("{}", out_nums.join("\\n"));
    }
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
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        long L = fs.nextLong(); if (L == Long.MIN_VALUE) return;
        long R = fs.nextLong();

        int lim = (int) Math.sqrt(R) + 1;
        boolean[] base = new boolean[lim + 1];
        Arrays.fill(base, true);
        base[0] = base[1] = false;
        ArrayList<Long> primes = new ArrayList<>();
        for (int i = 2; i <= lim; i++) {
            if (base[i]) {
                primes.add((long) i);
                for (long j = (long) i * i; j <= lim; j += i) base[(int) j] = false;
            }
        }

        int len = (int) (R - L + 1);
        boolean[] seg = new boolean[len];
        Arrays.fill(seg, true);
        if (L == 1) seg[0] = false;
        for (long p : primes) {
            long start = Math.max(p * p, ((L + p - 1) / p) * p);
            for (long j = start; j <= R; j += p) {
                seg[(int) (j - L)] = false;
            }
        }

        StringBuilder sb = new StringBuilder();
        int cnt = 0;
        for (int i = 0; i < len; i++) {
            if (seg[i]) { cnt++; sb.append(L + i).append('\\n'); }
        }
        System.out.println(cnt);
        System.out.print(sb);
    }
}`,
        python3: `import math, sys
sys.setrecursionlimit(200000)

def solve():
    data = sys.stdin.buffer.read().split()
    if not data: return
    L, R = int(data[0]), int(data[1])
    lim = math.isqrt(R)
    base = bytearray([1]) * (lim + 1)
    base[0:2] = b"\\x00\\x00"
    primes = []
    for i in range(2, lim + 1):
        if base[i]:
            primes.append(i)
            for j in range(i * i, lim + 1, i):
                base[j] = 0

    length = R - L + 1
    seg = bytearray([1]) * length
    if L == 1:
        seg[0] = 0
    for p in primes:
        start = max(p * p, ((L + p - 1) // p) * p)
        if start <= R:
            count = (R - start) // p + 1
            seg[start - L::p] = bytearray(count)

    ans = [str(L + i) for i, ok in enumerate(seg) if ok]
    sys.stdout.write(f"{len(ans)}\\n")
    if ans:
        sys.stdout.write("\\n".join(ans) + "\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `data = STDIN.read.split.map(&:to_i)
exit if data.empty?
l = data[0]; r = data[1]
lim = Integer.sqrt(r)
base = Array.new(lim + 1, true)
base[0] = false; base[1] = false if lim >= 1
primes = []
(2..lim).each do |i|
  next unless base[i]
  primes << i
  j = i * i
  while j <= lim
    base[j] = false; j += i
  end
end

len = r - l + 1
seg = Array.new(len, true)
seg[0] = false if l == 1
primes.each do |p|
  start = ((l + p - 1) / p) * p
  start = p * p if start < p * p
  j = start
  while j <= r
    seg[j - l] = false
    j += p
  end
end

ans = []
seg.each_with_index { |ok, idx| ans << (l + idx) if ok }
puts ans.size
puts ans.join("\\n") unless ans.empty?`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'CSES',
      title: 'Counting Divisors & Common Divisors',
      difficulty: 'USACO Bronze / Silver (900–1300)',
      url: 'https://cses.fi/problemset/task/1713',
      patternNote: 'Direct SPF sieve + frequency-harmonic multiple sweep for max pair GCD.',
    },
    {
      platform: 'AtCoder',
      title: 'ABC177 E Coprime & ABC215 D Coprime 2',
      difficulty: 'AtCoder Green (~1000)',
      url: 'https://atcoder.jp/contests/abc177/tasks/abc177_e',
      patternNote: 'Canonical SPF factorization checks pairwise vs setwise coprimality in O(N log MAXA).',
    },
    {
      platform: 'Codeforces',
      title: 'CF 1458A Row GCD & CF 1366D Two Divisors',
      difficulty: 'CF 1600–1700',
      url: 'https://codeforces.com/problemset/problem/1458/A',
      patternNote: '1458A uses gcd(a_1+b_j, gcd(a_2-a_1,...)); 1366D relies directly on SPF prime power decomposition.',
    },
    {
      platform: 'CodeChef',
      title: 'PRIME1 (Prime Generator) & GCDQ',
      difficulty: 'CodeChef 2★–3★',
      url: 'https://www.codechef.com/problems/PRIME1',
      patternNote: 'Classic segmented sieve interval benchmark + prefix/suffix GCD queries.',
    },
    {
      platform: 'HackerRank',
      title: 'Sherlock and GCD & Number Theory Sieve Tasks',
      difficulty: 'Easy / Medium',
      url: 'https://www.hackerrank.com/challenges/sherlock-and-gcd',
      patternNote: 'Subset GCD existence reduces to full-array GCD == 1.',
    },
    {
      platform: 'NeetCode 150',
      title: 'Count Primes & Greatest Common Divisor of Strings',
      difficulty: 'FAANG Easy / Medium',
      url: 'https://leetcode.com/problems/count-primes/',
      patternNote: 'Standard Sieve of Eratosthenes & Euclidean reduction interview staples.',
    },
  ],
  interviewNotes: [
    'Always mention why starting composite cancellation at `i * i` (not `2 * i`) keeps Sieve of Eratosthenes at O(N log log N) and why Segmented Sieve shrinks memory from O(R) down to O(sqrt(R) + (R - L)).',
    'Know Euclid’s difference invariant `gcd(a, b) = gcd(a, b - a)`—it turns range-add + range-GCD into point updates on a difference array.',
  ],
  projectBlueprint: {
    title: 'Cryptographic Prime & Fast Factorization Service',
    tagline:
      'Generate candidate primes over arbitrary 64-bit windows with Segmented Sieve and expose sub-millisecond SPF batch factorization for cryptographic key validation.',
    stackSummary: 'TypeScript + Int32Array SPF Sieve + Segmented Range Prime Generator',
    asciiDiagram:
      'Key-Check Batch (x_1..x_k) ──▶ [Int32Array SPF Table] ──▶ O(log x) Prime Factor List\n' +
      'Large Interval [L, R]       ──▶ [Segmented Sieve]     ──▶ Candidate RSA Primes',
    milestones: [
      {
        id: 'ch14-m1',
        title: 'Milestone 1: Int32Array Linear/Eratosthenes SPF Core',
        detail: 'Precompute smallest prime factors up to 10^6 inside a typed array for zero-GC factorization.',
      },
      {
        id: 'ch14-m2',
        title: 'Milestone 2: BigInt-Safe Segmented Sieve Window',
        detail: 'Sieve windows [L, R] up to 10^12 in Uint8Array chunks using sqrt(R) base primes.',
      },
      {
        id: 'ch14-m3',
        title: 'Milestone 3: Euclidean Coprimality & Totient Diagnostics',
        detail: 'Compute gcd(e, phi(N)) and Euler totient factorization metrics for key-pair validation.',
      },
    ],
    starterCode: `export class PrimeFactorService {
  private readonly spf: Int32Array;
  private readonly maxN: number;

  constructor(maxN = 1_000_000) {
    this.maxN = maxN;
    this.spf = new Int32Array(maxN + 1);
    for (let i = 0; i <= maxN; i++) this.spf[i] = i;
    for (let i = 2; i * i <= maxN; i++) {
      if (this.spf[i] === i) {
        for (let j = i * i; j <= maxN; j += i) {
          if (this.spf[j] === j) this.spf[j] = i;
        }
      }
    }
  }

  factorize(x: number): Array<{ prime: number; power: number }> {
    if (x < 2 || x > this.maxN) throw new RangeError('Input exceeds precomputed SPF bound');
    const factors: Array<{ prime: number; power: number }> = [];
    let cur = x;
    while (cur > 1) {
      const p = this.spf[cur];
      let power = 0;
      while (cur % p === 0) {
        cur = (cur / p) | 0;
        power++;
      }
      factors.push({ prime: p, power });
    }
    return factors;
  }

  static gcd(a: bigint, b: bigint): bigint {
    let x = a < 0n ? -a : a;
    let y = b < 0n ? -b : b;
    while (y !== 0n) {
      const t = x % y;
      x = y;
      y = t;
    }
    return x;
  }
}`,
  },
};
