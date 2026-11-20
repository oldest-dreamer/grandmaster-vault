import type { TheoryChapter } from '../../types/vault';

export const CH46_INCLUSION_EXCLUSION_MOBIUS: TheoryChapter = {
  slug: 'inclusion-exclusion-mobius',
  topicId: 'ma-49',
  title: 'Inclusion-Exclusion & Mobius Inversion',
  domain: 'Math, Number Theory & Algebra',
  ratingTier: '1600–1900',
  usacoDivision: 'Gold',
  subtitle:
    'Collapse intractable divisibility conditions via the Mobius identity [g = 1] = sum_{d|g} mu(d), precompute mu(n) and phi(n) in O(N) using a Linear Sieve, and evaluate O(N * M) GCD lattice sums in O(sqrt(N)) per query via harmonic floor blocking.',
  analogyTitle: 'The Venn-Diagram Overlapping Stencils & Anti-Double-Count Weights Analogy',
  analogyBody:
    'When counting pairs or numbers satisfying **"avoid ALL bad primes"** (i.e. `gcd(x, y) == 1`), direct inclusion-exclusion over prime subsets `2^omega(g)` explodes when numbers reach `10^6`. **Mobius Inversion** precomputes the exact inclusion-exclusion weight `mu(d)` for every divisor `d` once in a Linear Sieve: `mu(1) = 1`, `mu(d) = (-1)^k` if `d` is a product of `k` distinct primes, and `mu(d) = 0` if `d` has ANY squared prime factor (`p^2 | d`). Because **`sum_{d | g} mu(d) == 1` ONLY when `g == 1`, and `0` for every `g > 1`**, counting coprime pairs collapses into a single loop: swap the summation order to group by divisor `d`, count elements divisible by `d` (`cnt[d]`), and sum `mu[d] * C(cnt[d], 2)` in `O(M log M)`! Even better, for `sum_{i=1..N} sum_{j=1..M} gcd(i, j)`, pairing Mobius or Euler’s Totient identity `g = sum_{d|g} phi(d)` with **harmonic floor blocking** (stepping `r = min(N / (N / l), M / (M / l))`) drops each query to **`O(sqrt(min(N, M)))`**!',
  prerequisites: [
    {
      slug: 'combinatorics-lucas-catalan',
      title: 'Combinatorics, Stars & Bars, Catalan & Lucas Theorem',
    },
  ],
  traceTitle: 'Interactive Linear Sieve of mu(n) & Coprime Pair Collapsing Trace',
  traceSubtitle:
    'Watch the Linear Sieve assign `mu[1..8]` in O(N) and evaluate `sum_{d} mu[d] * C(cnt[d], 2)` on array `[2, 3, 4, 6]` to count coprime pairs.',
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Step 1: Linear Sieve Computes mu[1..8] Using Smallest Prime Factor Only',
      explanation:
        'Initialize mu[1] = 1. For each i = 2..8: if i is prime, mu[i] = -1. Multiply i by primes p <= spf[i]: if p | i, then p^2 | (i*p) so mu[i*p] = 0 and BREAK immediately (each composite is touched ONCE!); otherwise mu[i*p] = -mu[i].',
      mode: 'array',
      arrays: [
        {
          name: 'Mobius Function mu[1..8]',
          cells: [
            { index: 1, value: '+1', label: 'd=1', highlight: 'active' },
            { index: 2, value: '-1', label: 'p=2', highlight: 'window' },
            { index: 3, value: '-1', label: 'p=3', highlight: 'window' },
            { index: 4, value: '0', label: '2^2', highlight: 'neutral' },
            { index: 5, value: '-1', label: 'p=5', highlight: 'window' },
            { index: 6, value: '+1', label: '2*3', highlight: 'updated' },
            { index: 7, value: '-1', label: 'p=7', highlight: 'window' },
            { index: 8, value: '0', label: '2^3', highlight: 'neutral' },
          ],
        },
      ],
      variables: { SquareFreeCount: 6, SquaredZeroes: '4, 8' },
    },
    {
      stepNumber: 2,
      title: 'Step 2: Count Multiples cnt[d] in Array A = [2, 3, 4, 6]',
      explanation:
        'For each divisor d = 1..6, count how many elements of A = [2, 3, 4, 6] are divisible by d: cnt[1]=4, cnt[2]=3 (2,4,6), cnt[3]=2 (3,6), cnt[4]=1 (4), cnt[5]=0, cnt[6]=1 (6).',
      mode: 'array',
      arrays: [
        {
          name: 'Multiple Counts cnt[d] & Pairs C(cnt[d], 2)',
          cells: [
            { index: 1, value: '4 -> 6 pairs', label: 'd=1 (mu=+1)', highlight: 'active' },
            { index: 2, value: '3 -> 3 pairs', label: 'd=2 (mu=-1)', highlight: 'updated' },
            { index: 3, value: '2 -> 1 pair', label: 'd=3 (mu=-1)', highlight: 'updated' },
            { index: 4, value: '1 -> 0 pairs', label: 'd=4 (mu=0)', highlight: 'neutral' },
            { index: 6, value: '1 -> 0 pairs', label: 'd=6 (mu=+1)', highlight: 'neutral' },
          ],
        },
      ],
      variables: { TotalPairs: 6, DivisibleBy2: 3, DivisibleBy3: 1 },
    },
    {
      stepNumber: 3,
      title: 'Step 3: Sum mu[d] * C(cnt[d], 2) -> Exact Coprime Pairs = 2!',
      explanation:
        'Compute (+1)*6 + (-1)*3 + (-1)*1 + (0)*0 + (+1)*0 = 6 - 3 - 1 = 2! Verify directly on [2, 3, 4, 6]: only (2, 3) and (3, 4) have gcd == 1 — exact match in O(M log M)!',
      mode: 'array',
      arrays: [
        {
          name: 'Mobius Terms mu[d] * C(cnt[d], 2)',
          cells: [
            { index: 1, value: '+6', label: 'd=1', highlight: 'active' },
            { index: 2, value: '-3', label: 'd=2', highlight: 'window' },
            { index: 3, value: '-1', label: 'd=3', highlight: 'window' },
            { index: 6, value: '+0', label: 'd=6', highlight: 'neutral' },
            { index: 7, value: 'Ans = 2', label: '(2,3),(3,4)', highlight: 'active' },
          ],
        },
      ],
      variables: { CoprimePairs: 2, VerifiedPairs: '(2,3), (3,4)' },
    },
  ],
  reductionClues: [
    {
      clue: '"Count pairs (i, j) with gcd(a[i], a[j]) == 1 (or == G) over N <= 10^5, max(a[i]) <= 10^6"',
      translation:
        '**Mobius Inversion over multiples** (`O(M log M)`): count frequency `freq[x]`, aggregate `cnt[d] = sum_{d|x} freq[x]`, and sum `mu[d] * C(cnt[d], 2)` (for `gcd == G`, divide all inputs by `G` first and count `gcd == 1`!).',
    },
    {
      clue: '"Count numbers in [1, N] divisible by AT LEAST ONE (or NONE) of K <= 20 given primes"',
      translation:
        '**`2^K` Bitmask Inclusion-Exclusion**: iterate subsets `mask = 1..(1<<K)-1`, compute `prod` while checking `if (prod > N / p)` to avoid 64-bit overflow, and add `(+/-) floor(N / prod)` based on `__builtin_popcount(mask)` parity!',
    },
    {
      clue: '"Evaluate sum_{i=1..N} sum_{j=1..M} gcd(i, j) or [gcd(i, j) == 1] across Q <= 5*10^4 queries"',
      translation:
        '**Harmonic Blocking (Dirichlet Hyperbola Step) + Prefix Sums of `phi` or `mu`**: using `n = sum_{d|n} phi(d)` gives `sum_{g=1..min(N,M)} phi(g) * floor(N/g) * floor(M/g)`. Group contiguous `g` intervals `[l..r]` where both `N/g` and `M/g` stay constant using `r = min(N/(N/l), M/(M/l))` in **`O(sqrt(min(N, M)))`** per query!',
    },
    {
      clue: '"Count permutations of N items where no item stays in place (or exact K fixed points)"',
      translation:
        '**Derangements `D[n]` & Inclusion-Exclusion**: `D[n] = (n - 1) * (D[n - 1] + D[n - 2])` (`D[0]=1, D[1]=0`), or `n! * sum_{k=0..n} (-1)^k / k!`. Exactly `k` fixed points is `C(n, k) * D[n - k]`.',
    },
  ],
  timeComplexity: 'Linear Sieve: O(M) | Multiple Aggregation: O(M log M) | Harmonic Blocking Query: O(sqrt(N))',
  spaceComplexity: 'O(M) for mu[], phi[], pref[]',
  pitfalls: [
    {
      type: 'WA',
      title: '64-Bit Overflow When Multiplying Primes in 2^K Bitmask Inclusion-Exclusion',
      detail:
        'If `K = 20` primes include values around `10^5`, multiplying them together yields `10^{100}`, instantly overflowing `long long` (`9 * 10^{18}`)! Always guard BEFORE multiplying: `if (prod > N / p) { ok = false; break; }` — since `floor(N / prod) == 0` anyway whenever `prod > N`!',
    },
    {
      type: 'TLE',
      title: 'Looping Up to M Without Harmonic Blocking Across Q = 50,000 Queries',
      detail:
        'A naive `O(min(N, M))` loop per query takes `5 * 10^4 * 10^6 = 5 * 10^{10}` operations (TLE). Harmonic blocking (`r = min(N / (N / l), M / (M / l))`) visits at most `2 * sqrt(N) + 2 * sqrt(M)` intervals (`<= 4000` steps even at `10^6`!).',
    },
    {
      type: 'WA',
      title: 'Including Pairs (i, i) Where gcd(1, 1) == 1 in Distinct-Index Coprime Counting',
      detail:
        'Using `C(cnt[d], 2) = cnt[d] * (cnt[d] - 1) / 2` over `i < j` naturally excludes `(i, i)` self-pairs (so `1` paired with `1` counts only when at least two `1`s exist in the array). If using `cnt[d]^2` for ordered pairs `(i, j)`, remember to subtract `1`s if `i != j` is required!',
    },
    {
      type: 'WA',
      title: 'Integer Overflow in `C(cnt[d], 2)` or Pairwise GCD Sums',
      detail:
        'With `N = 10^5`, `C(10^5, 2) = 5 * 10^9`, which overflows 32-bit `int`! Always accumulate Mobius sums and Totient prefix sums in 64-bit signed integers (`long long`, `i64`, `long`).',
    },
  ],
  implementations: {
    cpp20: `#include <bits/stdc++.h>
using namespace std;

// Linear Sieve for mu[n], phi[n], prefix sums, and O(sqrt(N)) Harmonic-Blocked Coprime Pairs
struct MobiusToolkit {
    int limit;
    vector<int> mu, phi, primes;
    vector<long long> prefMu, prefPhi;
    vector<bool> comp;

    MobiusToolkit(int limit)
        : limit(limit), mu(limit + 1), phi(limit + 1), prefMu(limit + 1), prefPhi(limit + 1), comp(limit + 1) {
        mu[1] = 1;
        phi[1] = 1;
        for (int i = 2; i <= limit; i++) {
            if (!comp[i]) {
                primes.push_back(i);
                mu[i] = -1;
                phi[i] = i - 1;
            }
            for (int p : primes) {
                if (1LL * i * p > limit) break;
                comp[i * p] = true;
                if (i % p == 0) {
                    mu[i * p] = 0;
                    phi[i * p] = phi[i] * p;
                    break;
                } else {
                    mu[i * p] = -mu[i];
                    phi[i * p] = phi[i] * (p - 1);
                }
            }
        }
        for (int i = 1; i <= limit; i++) {
            prefMu[i] = prefMu[i - 1] + mu[i];
            prefPhi[i] = prefPhi[i - 1] + phi[i];
        }
    }

    // Count pairs (1 <= x <= n, 1 <= y <= m) with gcd(x, y) == 1 in O(sqrt(min(n, m)))
    long long countCoprimeGrid(long long n, long long m) const {
        long long lim = min(n, m), ans = 0;
        for (long long l = 1, r; l <= lim; l = r + 1) {
            r = min(n / (n / l), m / (m / l));
            ans += (prefMu[r] - prefMu[l - 1]) * (n / l) * (m / l);
        }
        return ans;
    }

    // Sum_{1<=x<=n, 1<=y<=m} gcd(x, y) in O(sqrt(min(n, m)))
    long long sumGcdGrid(long long n, long long m) const {
        long long lim = min(n, m), ans = 0;
        for (long long l = 1, r; l <= lim; l = r + 1) {
            r = min(n / (n / l), m / (m / l));
            ans += (prefPhi[r] - prefPhi[l - 1]) * (n / l) * (m / l);
        }
        return ans;
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int q;
    if (!(cin >> q)) return 0;
    vector<pair<int, int>> queries(q);
    int maxV = 1;
    for (int i = 0; i < q; i++) {
        cin >> queries[i].first >> queries[i].second;
        maxV = max({maxV, queries[i].first, queries[i].second});
    }

    MobiusToolkit mt(maxV);
    for (auto [n, m] : queries) {
        cout << mt.countCoprimeGrid(n, m) << " " << mt.sumGcdGrid(n, m) << "\\n";
    }
    return 0;
}`,
    rust: `use std::io::{self, Read};

struct MobiusToolkit {
    pref_mu: Vec<i64>,
    pref_phi: Vec<i64>,
}

impl MobiusToolkit {
    fn new(limit: usize) -> Self {
        let mut mu = vec![0i32; limit + 1];
        let mut phi = vec![0i64; limit + 1];
        let mut comp = vec![false; limit + 1];
        let mut primes = Vec::new();
        mu[1] = 1;
        phi[1] = 1;

        for i in 2..=limit {
            if !comp[i] {
                primes.push(i);
                mu[i] = -1;
                phi[i] = (i - 1) as i64;
            }
            for &p in &primes {
                if i * p > limit {
                    break;
                }
                comp[i * p] = true;
                if i % p == 0 {
                    mu[i * p] = 0;
                    phi[i * p] = phi[i] * p as i64;
                    break;
                } else {
                    mu[i * p] = -mu[i];
                    phi[i * p] = phi[i] * (p - 1) as i64;
                }
            }
        }

        let mut pref_mu = vec![0i64; limit + 1];
        let mut pref_phi = vec![0i64; limit + 1];
        for i in 1..=limit {
            pref_mu[i] = pref_mu[i - 1] + mu[i] as i64;
            pref_phi[i] = pref_phi[i - 1] + phi[i];
        }
        Self { pref_mu, pref_phi }
    }

    fn count_coprime_grid(&self, n: usize, m: usize) -> i64 {
        let lim = n.min(m);
        let mut l = 1usize;
        let mut ans = 0i64;
        while l <= lim {
            let r = (n / (n / l)).min(m / (m / l));
            ans += (self.pref_mu[r] - self.pref_mu[l - 1]) * (n / l) as i64 * (m / l) as i64;
            l = r + 1;
        }
        ans
    }

    fn sum_gcd_grid(&self, n: usize, m: usize) -> i64 {
        let lim = n.min(m);
        let mut l = 1usize;
        let mut ans = 0i64;
        while l <= lim {
            let r = (n / (n / l)).min(m / (m / l));
            ans += (self.pref_phi[r] - self.pref_phi[l - 1]) * (n / l) as i64 * (m / l) as i64;
            l = r + 1;
        }
        ans
    }
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let q: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };

    let mut queries = Vec::with_capacity(q);
    let mut max_v = 1usize;
    for _ in 0..q {
        let n: usize = it.next().unwrap().parse().unwrap();
        let m: usize = it.next().unwrap().parse().unwrap();
        max_v = max_v.max(n).max(m);
        queries.push((n, m));
    }

    let mt = MobiusToolkit::new(max_v);
    let mut out = String::new();
    for (n, m) in queries {
        out.push_str(&format!("{} {}\\n", mt.count_coprime_grid(n, m), mt.sum_gcd_grid(n, m)));
    }
    print!("{}", out);
}`,
    java21: `import java.io.IOException;
import java.io.InputStream;

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
            if (c == -1) return -1;
            int res = 0;
            while (c > ' ') { res = res * 10 + (c - '0'); c = readByte(); }
            return res;
        }
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        int q = fs.nextInt();
        if (q == -1) return;

        int[] qn = new int[q], qm = new int[q];
        int maxV = 1;
        for (int i = 0; i < q; i++) {
            qn[i] = fs.nextInt();
            qm[i] = fs.nextInt();
            if (qn[i] > maxV) maxV = qn[i];
            if (qm[i] > maxV) maxV = qm[i];
        }

        int[] mu = new int[maxV + 1];
        long[] phi = new long[maxV + 1];
        boolean[] comp = new boolean[maxV + 1];
        int[] primes = new int[maxV + 1];
        int pc = 0;
        mu[1] = 1;
        phi[1] = 1;

        for (int i = 2; i <= maxV; i++) {
            if (!comp[i]) {
                primes[pc++] = i;
                mu[i] = -1;
                phi[i] = i - 1;
            }
            for (int j = 0; j < pc; j++) {
                int p = primes[j];
                if (1L * i * p > maxV) break;
                comp[i * p] = true;
                if (i % p == 0) {
                    mu[i * p] = 0;
                    phi[i * p] = phi[i] * p;
                    break;
                } else {
                    mu[i * p] = -mu[i];
                    phi[i * p] = phi[i] * (p - 1);
                }
            }
        }

        long[] prefMu = new long[maxV + 1];
        long[] prefPhi = new long[maxV + 1];
        for (int i = 1; i <= maxV; i++) {
            prefMu[i] = prefMu[i - 1] + mu[i];
            prefPhi[i] = prefPhi[i - 1] + phi[i];
        }

        StringBuilder sb = new StringBuilder();
        for (int idx = 0; idx < q; idx++) {
            int n = qn[idx], m = qm[idx], lim = Math.min(n, m);
            long coprime = 0, gcdSum = 0;
            for (int l = 1, r; l <= lim; l = r + 1) {
                r = Math.min(n / (n / l), m / (m / l));
                long pairs = 1L * (n / l) * (m / l);
                coprime += (prefMu[r] - prefMu[l - 1]) * pairs;
                gcdSum += (prefPhi[r] - prefPhi[l - 1]) * pairs;
            }
            sb.append(coprime).append(' ').append(gcdSum).append('\\n');
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
    q = int(next(it))
    queries = []
    max_v = 1
    for _ in range(q):
        n = int(next(it))
        m = int(next(it))
        if n > max_v:
            max_v = n
        if m > max_v:
            max_v = m
        queries.append((n, m))

    mu = [0] * (max_v + 1)
    phi = [0] * (max_v + 1)
    comp = bytearray(max_v + 1)
    primes = []
    mu[1] = 1
    phi[1] = 1

    for i in range(2, max_v + 1):
        if not comp[i]:
            primes.append(i)
            mu[i] = -1
            phi[i] = i - 1
        for p in primes:
            ip = i * p
            if ip > max_v:
                break
            comp[ip] = 1
            if i % p == 0:
                mu[ip] = 0
                phi[ip] = phi[i] * p
                break
            mu[ip] = -mu[i]
            phi[ip] = phi[i] * (p - 1)

    pref_mu = [0] * (max_v + 1)
    pref_phi = [0] * (max_v + 1)
    for i in range(1, max_v + 1):
        pref_mu[i] = pref_mu[i - 1] + mu[i]
        pref_phi[i] = pref_phi[i - 1] + phi[i]

    out = []
    for n, m in queries:
        lim = n if n < m else m
        l = 1
        coprime = 0
        gcd_sum = 0
        while l <= lim:
            dn = n // l
            dm = m // l
            rn = n // dn
            rm = m // dm
            r = rn if rn < rm else rm
            pairs = dn * dm
            coprime += (pref_mu[r] - pref_mu[l - 1]) * pairs
            gcd_sum += (pref_phi[r] - pref_phi[l - 1]) * pairs
            l = r + 1
        out.append(f"{coprime} {gcd_sum}")
    sys.stdout.write("\\n".join(out) + "\\n")

if __name__ == "__main__":
    solve()`,
    ruby: `tokens = $stdin.read.split
exit if tokens.empty?
idx = 0
q = tokens[idx].to_i; idx += 1
queries = []
max_v = 1
q.times do
  n = tokens[idx].to_i; m = tokens[idx + 1].to_i; idx += 2
  max_v = n if n > max_v
  max_v = m if m > max_v
  queries << [n, m]
end

mu = Array.new(max_v + 1, 0)
phi = Array.new(max_v + 1, 0)
comp = Array.new(max_v + 1, false)
primes = []
mu[1] = 1
phi[1] = 1

(2..max_v).each do |i|
  unless comp[i]
    primes << i
    mu[i] = -1
    phi[i] = i - 1
  end
  primes.each do |p|
    ip = i * p
    break if ip > max_v
    comp[ip] = true
    if i % p == 0
      mu[ip] = 0
      phi[ip] = phi[i] * p
      break
    else
      mu[ip] = -mu[i]
      phi[ip] = phi[i] * (p - 1)
    end
  end
end

pref_mu = Array.new(max_v + 1, 0)
pref_phi = Array.new(max_v + 1, 0)
(1..max_v).each do |i|
  pref_mu[i] = pref_mu[i - 1] + mu[i]
  pref_phi[i] = pref_phi[i - 1] + phi[i]
end

out = queries.map do |n, m|
  lim = n < m ? n : m
  l = 1
  coprime = 0
  gcd_sum = 0
  while l <= lim
    dn = n / l
    dm = m / l
    rn = n / dn
    rm = m / dm
    r = rn < rm ? rn : rm
    pairs = dn * dm
    coprime += (pref_mu[r] - pref_mu[l - 1]) * pairs
    gcd_sum += (pref_phi[r] - pref_phi[l - 1]) * pairs
    l = r + 1
  end
  "#{coprime} #{gcd_sum}"
end
puts out.join("\\n")`,
  },
  practiceProblems: [
    {
      id: 'ch46-p1',
      tier: 'Warmup',
      ratingRange: '1550–1750',
      title: 'Counting Coprime Pairs — Mobius Divisor Aggregation in O(M log M)',
      statement:
        'Given a list of `N` positive integers `x_1, x_2, ..., x_N`, count the number of pairs `(i, j)` with `1 <= i < j <= N` such that `gcd(x_i, x_j) = 1`.',
      constraints: '1 <= N <= 10^5, 1 <= x_i <= 10^6',
      sampleInput: '4\n5 4 20 1',
      sampleOutput: '4',
      hints: [
        'Build a frequency array `freq[v]` for `1 <= v <= M` (`M = max(x_i)`). For every `d = 1..M`, compute `cnt[d] = sum_{m = d, 2d, ... <= M} freq[m]` in total time `O(M log M)`.',
        'Precompute `mu[1..M]` via Linear Sieve and return `sum_{d=1..M} mu[d] * cnt[d] * (cnt[d] - 1) / 2` using 64-bit integers!',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    if (!(cin >> n)) return 0;
    vector<int> a(n);
    int maxV = 1;
    for (int i = 0; i < n; i++) {
        cin >> a[i];
        maxV = max(maxV, a[i]);
    }

    vector<int> freq(maxV + 1, 0);
    for (int x : a) freq[x]++;

    vector<int> mu(maxV + 1, 0), primes;
    vector<bool> comp(maxV + 1, false);
    mu[1] = 1;
    for (int i = 2; i <= maxV; i++) {
        if (!comp[i]) {
            primes.push_back(i);
            mu[i] = -1;
        }
        for (int p : primes) {
            if (1LL * i * p > maxV) break;
            comp[i * p] = true;
            if (i % p == 0) { mu[i * p] = 0; break; }
            mu[i * p] = -mu[i];
        }
    }

    long long ans = 0;
    for (int d = 1; d <= maxV; d++) {
        if (mu[d] == 0) continue;
        long long cnt = 0;
        for (int m = d; m <= maxV; m += d) cnt += freq[m];
        ans += mu[d] * (cnt * (cnt - 1) / 2);
    }
    cout << ans << "\\n";
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

    let mut a = Vec::with_capacity(n);
    let mut max_v = 1usize;
    for _ in 0..n {
        let v: usize = it.next().unwrap().parse().unwrap();
        max_v = max_v.max(v);
        a.push(v);
    }

    let mut freq = vec![0i64; max_v + 1];
    for x in a {
        freq[x] += 1;
    }

    let mut mu = vec![0i64; max_v + 1];
    let mut comp = vec![false; max_v + 1];
    let mut primes = Vec::new();
    mu[1] = 1;
    for i in 2..=max_v {
        if !comp[i] {
            primes.push(i);
            mu[i] = -1;
        }
        for &p in &primes {
            if i * p > max_v {
                break;
            }
            comp[i * p] = true;
            if i % p == 0 {
                mu[i * p] = 0;
                break;
            }
            mu[i * p] = -mu[i];
        }
    }

    let mut ans = 0i64;
    for d in 1..=max_v {
        if mu[d] == 0 {
            continue;
        }
        let mut cnt = 0i64;
        let mut m = d;
        while m <= max_v {
            cnt += freq[m];
            m += d;
        }
        ans += mu[d] * (cnt * (cnt - 1) / 2);
    }
    println!("{}", ans);
}`,
        java21: `import java.io.IOException;
import java.io.InputStream;

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
            if (c == -1) return -1;
            int res = 0;
            while (c > ' ') { res = res * 10 + (c - '0'); c = readByte(); }
            return res;
        }
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        int n = fs.nextInt();
        if (n == -1) return;

        int[] a = new int[n];
        int maxV = 1;
        for (int i = 0; i < n; i++) {
            a[i] = fs.nextInt();
            if (a[i] > maxV) maxV = a[i];
        }

        int[] freq = new int[maxV + 1];
        for (int x : a) freq[x]++;

        int[] mu = new int[maxV + 1];
        boolean[] comp = new boolean[maxV + 1];
        int[] primes = new int[maxV + 1];
        int pc = 0;
        mu[1] = 1;
        for (int i = 2; i <= maxV; i++) {
            if (!comp[i]) {
                primes[pc++] = i;
                mu[i] = -1;
            }
            for (int j = 0; j < pc; j++) {
                int p = primes[j];
                if (1L * i * p > maxV) break;
                comp[i * p] = true;
                if (i % p == 0) { mu[i * p] = 0; break; }
                mu[i * p] = -mu[i];
            }
        }

        long ans = 0;
        for (int d = 1; d <= maxV; d++) {
            if (mu[d] == 0) continue;
            long cnt = 0;
            for (int m = d; m <= maxV; m += d) cnt += freq[m];
            ans += mu[d] * (cnt * (cnt - 1) / 2);
        }
        System.out.println(ans);
    }
}`,
        python3: `import sys

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    arr = [int(x) for x in data[1:1 + n]]
    max_v = max(arr) if arr else 1

    freq = [0] * (max_v + 1)
    for x in arr:
        freq[x] += 1

    mu = [0] * (max_v + 1)
    comp = bytearray(max_v + 1)
    primes = []
    mu[1] = 1
    for i in range(2, max_v + 1):
        if not comp[i]:
            primes.append(i)
            mu[i] = -1
        for p in primes:
            ip = i * p
            if ip > max_v:
                break
            comp[ip] = 1
            if i % p == 0:
                mu[ip] = 0
                break
            mu[ip] = -mu[i]

    ans = 0
    for d in range(1, max_v + 1):
        md = mu[d]
        if md == 0:
            continue
        cnt = sum(freq[d::d])
        ans += md * (cnt * (cnt - 1) // 2)
    sys.stdout.write(f"{ans}\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
n = tokens[0].to_i
arr = tokens[1, n].map(&:to_i)
max_v = arr.empty? ? 1 : arr.max

freq = Array.new(max_v + 1, 0)
arr.each { |x| freq[x] += 1 }

mu = Array.new(max_v + 1, 0)
comp = Array.new(max_v + 1, false)
primes = []
mu[1] = 1
(2..max_v).each do |i|
  unless comp[i]
    primes << i
    mu[i] = -1
  end
  primes.each do |p|
    ip = i * p
    break if ip > max_v
    comp[ip] = true
    if i % p == 0
      mu[ip] = 0
      break
    else
      mu[ip] = -mu[i]
    end
  end
end

ans = 0
(1..max_v).each do |d|
  md = mu[d]
  next if md == 0
  cnt = 0
  m = d
  while m <= max_v
    cnt += freq[m]
    m += d
  end
  ans += md * (cnt * (cnt - 1) / 2)
end
puts ans`,
      },
    },
    {
      id: 'ch46-p2',
      tier: 'Standard',
      ratingRange: '1700–1900',
      title: 'Prime Multiples — Overflow-Safe 2^K Bitmask Inclusion-Exclusion',
      statement:
        'Given an integer `N` and `K` distinct prime numbers `a_1, a_2, ..., a_K`, count how many integers in `{1, 2, ..., N}` are divisible by **at least one** of the `K` primes.',
      constraints: '1 <= N <= 10^18, 1 <= K <= 20, 2 <= a_i <= N (all primes distinct)',
      sampleInput: '20 2\n2 5',
      sampleOutput: '12',
      hints: [
        'Enumerate every non-empty subset `mask` from `1` to `(1 << K) - 1`. If `mask` has an odd number of set bits, add `N / product`; if even, subtract `N / product`.',
        'To prevent 64-bit multiplication overflow when multiplying primes, check `if (prod > N / a[i])` BEFORE multiplying—if exceeded, the product exceeds `N` so `N / prod == 0` anyway!',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    long long n;
    int k;
    if (!(cin >> n >> k)) return 0;
    vector<long long> a(k);
    for (int i = 0; i < k; i++) cin >> a[i];

    long long ans = 0;
    for (int mask = 1; mask < (1 << k); mask++) {
        long long prod = 1;
        bool ok = true;
        int bits = 0;
        for (int i = 0; i < k; i++) {
            if (mask & (1 << i)) {
                bits++;
                if (prod > n / a[i]) {
                    ok = false;
                    break;
                }
                prod *= a[i];
            }
        }
        if (!ok) continue;
        if (bits & 1) ans += n / prod;
        else ans -= n / prod;
    }
    cout << ans << "\\n";
    return 0;
}`,
        rust: `use std::io::{self, Read};

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let n: i64 = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };
    let k: usize = it.next().unwrap().parse().unwrap();
    let mut a = Vec::with_capacity(k);
    for _ in 0..k {
        a.push(it.next().unwrap().parse::<i64>().unwrap());
    }

    let mut ans = 0i64;
    for mask in 1usize..(1usize << k) {
        let mut prod = 1i64;
        let mut ok = true;
        for i in 0..k {
            if (mask & (1 << i)) != 0 {
                if prod > n / a[i] {
                    ok = false;
                    break;
                }
                prod *= a[i];
            }
        }
        if !ok {
            continue;
        }
        if mask.count_ones() % 2 == 1 {
            ans += n / prod;
        } else {
            ans -= n / prod;
        }
    }
    println!("{}", ans);
}`,
        java21: `import java.io.IOException;
import java.io.InputStream;

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
            long res = 0;
            while (c > ' ') { res = res * 10 + (c - '0'); c = readByte(); }
            return res;
        }
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        long n = fs.nextLong();
        if (n == Long.MIN_VALUE) return;
        int k = (int) fs.nextLong();
        long[] a = new long[k];
        for (int i = 0; i < k; i++) a[i] = fs.nextLong();

        long ans = 0;
        int lim = 1 << k;
        for (int mask = 1; mask < lim; mask++) {
            long prod = 1;
            boolean ok = true;
            for (int i = 0; i < k; i++) {
                if ((mask & (1 << i)) != 0) {
                    if (prod > n / a[i]) { ok = false; break; }
                    prod *= a[i];
                }
            }
            if (!ok) continue;
            if ((Integer.bitCount(mask) & 1) == 1) ans += n / prod;
            else ans -= n / prod;
        }
        System.out.println(ans);
    }
}`,
        python3: `import sys

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    k = int(data[1])
    a = [int(x) for x in data[2:2 + k]]

    ans = 0
    for mask in range(1, 1 << k):
        prod = 1
        bits = 0
        ok = True
        for i in range(k):
            if (mask >> i) & 1:
                bits += 1
                prod *= a[i]
                if prod > n:
                    ok = False
                    break
        if ok:
            if bits & 1:
                ans += n // prod
            else:
                ans -= n // prod
    sys.stdout.write(f"{ans}\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
n = tokens[0].to_i
k = tokens[1].to_i
a = tokens[2, k].map(&:to_i)

ans = 0
(1...(1 << k)).each do |mask|
  prod = 1
  bits = 0
  ok = true
  k.times do |i|
    if ((mask >> i) & 1) == 1
      bits += 1
      prod *= a[i]
      if prod > n
        ok = false
        break
      end
    end
  end
  next unless ok
  ans += bits.odd? ? (n / prod) : -(n / prod)
end
puts ans`,
      },
    },
    {
      id: 'ch46-p3',
      tier: 'Boss',
      ratingRange: '1950–2250',
      title: 'Sum of GCD Pairs — Harmonic Floor Blocking + Mobius/Totient Prefix Sums',
      statement:
        'You are given `Q` independent queries `(N, M)`. For each query, compute the exact sum `sum_{i=1..N} sum_{j=1..M} gcd(i, j)`. With `Q <= 50,000` and `N, M <= 10^6`, solve each query in `O(sqrt(min(N, M)))` time.',
      constraints: '1 <= Q <= 50,000, 1 <= N, M <= 10^6',
      sampleInput: '2\n3 3\n4 5',
      sampleOutput: '12\n28',
      hints: [
        'Use Euler’s Totient identity `x = sum_{g | x} phi(g)` applied to `x = gcd(i, j)`: since `g | gcd(i, j)` iff `g | i` and `g | j`, swapping the summations gives `sum_{g=1..min(N,M)} phi(g) * floor(N / g) * floor(M / g)`!',
        'Precompute `prefPhi[g] = sum_{k=1..g} phi[k]` via Linear Sieve, and evaluate each query in `O(sqrt(min(N, M)))` using harmonic floor-blocking: `r = min(N / (N / l), M / (M / l))`.',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int q;
    if (!(cin >> q)) return 0;
    vector<pair<int, int>> qs(q);
    int maxV = 1;
    for (int i = 0; i < q; i++) {
        cin >> qs[i].first >> qs[i].second;
        maxV = max({maxV, qs[i].first, qs[i].second});
    }

    vector<int> primes;
    vector<bool> comp(maxV + 1, false);
    vector<long long> phi(maxV + 1, 0), prefPhi(maxV + 1, 0);
    phi[1] = 1;
    for (int i = 2; i <= maxV; i++) {
        if (!comp[i]) {
            primes.push_back(i);
            phi[i] = i - 1;
        }
        for (int p : primes) {
            if (1LL * i * p > maxV) break;
            comp[i * p] = true;
            if (i % p == 0) { phi[i * p] = phi[i] * p; break; }
            phi[i * p] = phi[i] * (p - 1);
        }
    }
    for (int i = 1; i <= maxV; i++) prefPhi[i] = prefPhi[i - 1] + phi[i];

    for (auto [n, m] : qs) {
        int lim = min(n, m);
        long long ans = 0;
        for (int l = 1, r; l <= lim; l = r + 1) {
            r = min(n / (n / l), m / (m / l));
            ans += (prefPhi[r] - prefPhi[l - 1]) * (n / l) * (m / l);
        }
        cout << ans << "\\n";
    }
    return 0;
}`,
        rust: `use std::io::{self, Read};

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let q: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };

    let mut qs = Vec::with_capacity(q);
    let mut max_v = 1usize;
    for _ in 0..q {
        let n: usize = it.next().unwrap().parse().unwrap();
        let m: usize = it.next().unwrap().parse().unwrap();
        max_v = max_v.max(n).max(m);
        qs.push((n, m));
    }

    let mut phi = vec![0i64; max_v + 1];
    let mut comp = vec![false; max_v + 1];
    let mut primes = Vec::new();
    phi[1] = 1;
    for i in 2..=max_v {
        if !comp[i] {
            primes.push(i);
            phi[i] = (i - 1) as i64;
        }
        for &p in &primes {
            if i * p > max_v {
                break;
            }
            comp[i * p] = true;
            if i % p == 0 {
                phi[i * p] = phi[i] * p as i64;
                break;
            }
            phi[i * p] = phi[i] * (p - 1) as i64;
        }
    }

    let mut pref_phi = vec![0i64; max_v + 1];
    for i in 1..=max_v {
        pref_phi[i] = pref_phi[i - 1] + phi[i];
    }

    let mut out = String::new();
    for (n, m) in qs {
        let lim = n.min(m);
        let mut l = 1usize;
        let mut ans = 0i64;
        while l <= lim {
            let r = (n / (n / l)).min(m / (m / l));
            ans += (pref_phi[r] - pref_phi[l - 1]) * (n / l) as i64 * (m / l) as i64;
            l = r + 1;
        }
        out.push_str(&format!("{}\\n", ans));
    }
    print!("{}", out);
}`,
        java21: `import java.io.IOException;
import java.io.InputStream;

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
            if (c == -1) return -1;
            int res = 0;
            while (c > ' ') { res = res * 10 + (c - '0'); c = readByte(); }
            return res;
        }
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        int q = fs.nextInt();
        if (q == -1) return;

        int[] qn = new int[q], qm = new int[q];
        int maxV = 1;
        for (int i = 0; i < q; i++) {
            qn[i] = fs.nextInt();
            qm[i] = fs.nextInt();
            if (qn[i] > maxV) maxV = qn[i];
            if (qm[i] > maxV) maxV = qm[i];
        }

        long[] phi = new long[maxV + 1];
        boolean[] comp = new boolean[maxV + 1];
        int[] primes = new int[maxV + 1];
        int pc = 0;
        phi[1] = 1;
        for (int i = 2; i <= maxV; i++) {
            if (!comp[i]) { primes[pc++] = i; phi[i] = i - 1; }
            for (int j = 0; j < pc; j++) {
                int p = primes[j];
                if (1L * i * p > maxV) break;
                comp[i * p] = true;
                if (i % p == 0) { phi[i * p] = phi[i] * p; break; }
                phi[i * p] = phi[i] * (p - 1);
            }
        }

        long[] prefPhi = new long[maxV + 1];
        for (int i = 1; i <= maxV; i++) prefPhi[i] = prefPhi[i - 1] + phi[i];

        StringBuilder sb = new StringBuilder();
        for (int idx = 0; idx < q; idx++) {
            int n = qn[idx], m = qm[idx], lim = Math.min(n, m);
            long ans = 0;
            for (int l = 1, r; l <= lim; l = r + 1) {
                r = Math.min(n / (n / l), m / (m / l));
                ans += (prefPhi[r] - prefPhi[l - 1]) * (n / l) * (m / l);
            }
            sb.append(ans).append('\\n');
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
    q = int(next(it))
    qs = []
    max_v = 1
    for _ in range(q):
        n = int(next(it))
        m = int(next(it))
        if n > max_v:
            max_v = n
        if m > max_v:
            max_v = m
        qs.append((n, m))

    phi = [0] * (max_v + 1)
    comp = bytearray(max_v + 1)
    primes = []
    phi[1] = 1
    for i in range(2, max_v + 1):
        if not comp[i]:
            primes.append(i)
            phi[i] = i - 1
        for p in primes:
            ip = i * p
            if ip > max_v:
                break
            comp[ip] = 1
            if i % p == 0:
                phi[ip] = phi[i] * p
                break
            phi[ip] = phi[i] * (p - 1)

    pref_phi = [0] * (max_v + 1)
    for i in range(1, max_v + 1):
        pref_phi[i] = pref_phi[i - 1] + phi[i]

    out = []
    for n, m in qs:
        lim = n if n < m else m
        l = 1
        ans = 0
        while l <= lim:
            dn = n // l
            dm = m // l
            rn = n // dn
            rm = m // dm
            r = rn if rn < rm else rm
            ans += (pref_phi[r] - pref_phi[l - 1]) * dn * dm
            l = r + 1
        out.append(str(ans))
    sys.stdout.write("\\n".join(out) + "\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
idx = 0
q = tokens[idx].to_i; idx += 1
qs = []
max_v = 1
q.times do
  n = tokens[idx].to_i; m = tokens[idx + 1].to_i; idx += 2
  max_v = n if n > max_v
  max_v = m if m > max_v
  qs << [n, m]
end

phi = Array.new(max_v + 1, 0)
comp = Array.new(max_v + 1, false)
primes = []
phi[1] = 1
(2..max_v).each do |i|
  unless comp[i]
    primes << i
    phi[i] = i - 1
  end
  primes.each do |p|
    ip = i * p
    break if ip > max_v
    comp[ip] = true
    if i % p == 0
      phi[ip] = phi[i] * p
      break
    else
      phi[ip] = phi[i] * (p - 1)
    end
  end
end

pref_phi = Array.new(max_v + 1, 0)
(1..max_v).each { |i| pref_phi[i] = pref_phi[i - 1] + phi[i] }

out = qs.map do |n, m|
  lim = n < m ? n : m
  l = 1
  ans = 0
  while l <= lim
    dn = n / l
    dm = m / l
    rn = n / dn
    rm = m / dm
    r = rn < rm ? rn : rm
    ans += (pref_phi[r] - pref_phi[l - 1]) * dn * dm
    l = r + 1
  end
  ans.to_s
end
puts out.join("\\n")`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'CSES',
      title: 'Counting Coprime Pairs',
      difficulty: 'Gold (1700)',
      url: 'https://cses.fi/problemset/task/2417',
      patternNote: 'Direct Mobius multiple aggregation: sum_{d} mu[d] * C(cnt[d], 2) in O(M log M).',
    },
    {
      platform: 'AtCoder',
      title: 'ABC206 E — Divide Both',
      difficulty: '1650',
      url: 'https://atcoder.jp/contests/abc206/tasks/abc206_e',
      patternNote: 'Count pairs (x, y) in [L, R] with gcd(x, y) > 1 and neither dividing the other via Mobius/GCD DP.',
    },
    {
      platform: 'Codeforces',
      title: 'Coprime Subsequences (803F)',
      difficulty: '2000',
      url: 'https://codeforces.com/problemset/problem/803/F',
      patternNote: 'Non-empty subsequences with overall GCD == 1: sum_{d} mu[d] * (2^{cnt[d]} - 1) mod 10^9+7.',
    },
    {
      platform: 'CodeChef',
      title: 'Coprime Triples (COPRIME3)',
      difficulty: '1850',
      url: 'https://www.codechef.com/problems/COPRIME3',
      patternNote: 'Count triples (i < j < k) with gcd(a[i], a[j], a[k]) == 1 via sum_{d} mu[d] * C(cnt[d], 3).',
    },
    {
      platform: 'HackerRank',
      title: 'Hyperrectangle GCD / Number List',
      difficulty: 'Hard',
      url: 'https://www.hackerrank.com/challenges/hyperrectangle-gcd',
      patternNote: 'Multi-dimensional Mobius inversion generalizing sum_{d} phi(d) * prod_k floor(N_k / d).',
    },
    {
      platform: 'NeetCode 150',
      title: 'Count Primes & Combinatorial Sieve Foundations',
      difficulty: 'Medium',
      url: 'https://neetcode.io/practice',
      patternNote: 'Master linear-time prime sieving before upgrading to multiplicative Mobius/Totient prefix sums.',
    },
  ],
  interviewNotes: [
    'Whenever a counting prompt asks for `gcd == 1` over pairs, triples, or grids, immediately test the Mobius identity `[gcd(x) = 1] = sum_{d|x} mu[d]`—it reverses the condition from a joint prime-intersection check into independent single-divisor counts `cnt[d]`.',
    'Linear Sieve outperforms `O(N log log N)` Sieve of Eratosthenes because every composite is marked by its SMALLEST prime factor (`if (i % p == 0) break;`), making any multiplicative function (`mu`, `phi`, `sigma`, `tau`) exact and fast up to `10^7`.',
    'Know the Dirichlet convolution equivalence `sum_{d|n} mu(d) * (n / d) = phi(n)`: that is why summing `gcd(i, j)` via `mu` simplifies directly to summing `phi(g) * floor(N/g) * floor(M/g)` with a single prefix sum array.',
  ],
  projectBlueprint: {
    title: 'Cryptographic Coprime Key-Space & Lattice Density Analyzer',
    tagline:
      'CLI number-theory engine computing coprime RSA key-pair density, Totient grid sums, and prime-exclusion bounds up to 10^7 using Linear Sieve + harmonic blocking.',
    stackSummary: 'TypeScript / Node.js with Int32Array Linear Sieve & BigInt Harmonic Blocker',
    asciiDiagram: `[Limit M] -> [Linear Sieve O(M)] -> mu[1..M], phi[1..M], prefPhi[]
                                            |
        +-----------------------------------+-----------------------------------+
        v                                                                       v
[RSA Pair Density (gcd=1)]                                          [Harmonic Blocker O(sqrt N)]
  sum_{d} mu[d] * floor(N/d)*floor(M/d)                             r = min(N/(N/l), M/(M/l))`,
    milestones: [
      {
        id: 'm1',
        title: 'Linear Sieve Precomputation',
        detail: 'Precompute mu[], phi[], and prefix arrays up to maxN in O(N) using typed arrays.',
      },
      {
        id: 'm2',
        title: 'Harmonic-Blocked Grid Evaluator',
        detail: 'Evaluate O(sqrt(N)) coprime pair density and average GCD across asymmetric [N x M] key rectangles.',
      },
      {
        id: 'm3',
        title: 'Overflow-Free Bitmask Prime Filter',
        detail: 'Support prime-exclusion bitmask checks up to 10^18 using BigInt division guards.',
      },
    ],
    starterCode: `export class LatticeDensityAnalyzer {
  private mu: Int8Array;
  private prefMu: Float64Array;
  private prefPhi: Float64Array;

  constructor(private readonly limit: number) {
    this.mu = new Int8Array(limit + 1);
    const phi = new Int32Array(limit + 1);
    const comp = new Uint8Array(limit + 1);
    const primes: number[] = [];
    this.mu[1] = 1;
    phi[1] = 1;

    for (let i = 2; i <= limit; i++) {
      if (!comp[i]) {
        primes.push(i);
        this.mu[i] = -1;
        phi[i] = i - 1;
      }
      for (let j = 0; j < primes.length; j++) {
        const p = primes[j];
        const ip = i * p;
        if (ip > limit) break;
        comp[ip] = 1;
        if (i % p === 0) {
          this.mu[ip] = 0;
          phi[ip] = phi[i] * p;
          break;
        }
        this.mu[ip] = -this.mu[i];
        phi[ip] = phi[i] * (p - 1);
      }
    }

    this.prefMu = new Float64Array(limit + 1);
    this.prefPhi = new Float64Array(limit + 1);
    for (let i = 1; i <= limit; i++) {
      this.prefMu[i] = this.prefMu[i - 1] + this.mu[i];
      this.prefPhi[i] = this.prefPhi[i - 1] + phi[i];
    }
  }

  public coprimeDensity(n: number, m: number): { coprimePairs: bigint; gcdSum: bigint; ratio: number } {
    const lim = Math.min(n, m);
    let coprime = 0n;
    let gcdSum = 0n;
    for (let l = 1, r = 0; l <= lim; l = r + 1) {
      const dn = Math.floor(n / l);
      const dm = Math.floor(m / l);
      r = Math.min(Math.floor(n / dn), Math.floor(m / dm));
      const pairs = BigInt(dn) * BigInt(dm);
      coprime += BigInt(this.prefMu[r] - this.prefMu[l - 1]) * pairs;
      gcdSum += BigInt(this.prefPhi[r] - this.prefPhi[l - 1]) * pairs;
    }
    const ratio = Number(coprime) / (n * m);
    return { coprimePairs: coprime, gcdSum, ratio };
  }
}

const analyzer = new LatticeDensityAnalyzer(100000);
console.log(analyzer.coprimeDensity(1000, 1000));`,
  },
};
