import type { TheoryChapter } from '../../types/vault';

export const CH18_COMBINATORICS_LUCAS: TheoryChapter = {
  slug: 'combinatorics-lucas-catalan',
  topicId: 'ma-48',
  title: 'Combinatorics, Stars & Bars, Catalan & Lucas Theorem',
  domain: 'Math, Number Theory & Algebra',
  ratingTier: '1400–1600',
  usacoDivision: 'Gold',
  subtitle:
    'Answer O(1) binomial coefficient queries via linear inverse-factorial precomputation, count valid nested structures via Catalan numbers, and evaluate C(N, K) mod P for huge N <= 10^18 using Lucas Theorem & CRT.',
  analogyTitle: 'The Divider-Bar Cookie Jar & Recursive Base-P Digit Mirror Analogy',
  analogyBody:
    'Suppose you want to distribute K identical cookies among N kids (`x_1 + x_2 + ... + x_N = K`). Line up all K cookies plus `N - 1` wooden divider bars in a row (`K + N - 1` total slots)—picking which `N - 1` slots hold divider bars uniquely determines every kid’s share in `C(K + N - 1, N - 1)` ways (Stars & Bars!). To evaluate `C(n, r) mod P` quickly without dividing by `r!` every time, precompute `fact[i]` forward and `invFact[N] = fact[N]^(P-2) mod P`, then sweep backward `invFact[i-1] = invFact[i] * i mod P` in ONE single modular exponentiation! And if `N` is gigantic (`10^18`) while prime `P` is small (`10^5`), Lucas Theorem splits `N` and `K` into base-`P` digits and multiplies `C(n_i, k_i) mod P` digit-by-digit!',
  prerequisites: [
    {
      slug: 'modular-arithmetic-fermat-crt',
      title: 'Modular Exponentiation, Extended GCD & CRT',
    },
  ],
  traceTitle: 'Interactive Pascal DP Matrix & Linear Inverse-Factorial Table Trace (P = 10^9+7)',
  traceSubtitle:
    'Step through Pascal’s additive table for C(n, r) and watch backward linear inverse precomputation compute invFact[0..5] with just ONE pow().',
  allowDynamicGraphEdit: false,
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Step 1: Forward Factorial Precomputation fact[0..5]',
      explanation:
        'Compute fact[0]=1, fact[i] = fact[i-1] * i mod P. This O(N) sweep covers all numerators up to N.',
      mode: 'array',
      arrays: [
        {
          name: 'fact[0..5] (mod 10^9+7)',
          cells: [
            { index: 0, value: 1, label: '0!', highlight: 'neutral' },
            { index: 1, value: 1, label: '1!', highlight: 'updated' },
            { index: 2, value: 2, label: '2!', highlight: 'updated' },
            { index: 3, value: 6, label: '3!', highlight: 'updated' },
            { index: 4, value: 24, label: '4!', highlight: 'updated' },
            { index: 5, value: 120, label: '5!', highlight: 'active' },
          ],
        },
      ],
      variables: { P: 1000000007, 'fact[5]': 120, ModExpCalls: 0 },
    },
    {
      stepNumber: 2,
      title: 'Step 2: Single Fermat Inverse invFact[5] = 120^(P-2) & Backward Sweep',
      explanation:
        'Call modPow(120, P - 2) ONCE to get invFact[5] = 808333339. Then sweep down: invFact[4] = invFact[5] * 5 mod P = 41666667, ..., invFact[0] = 1!',
      mode: 'array',
      arrays: [
        {
          name: 'invFact[0..5] (mod 10^9+7)',
          cells: [
            { index: 0, value: 1, label: '1/0!', highlight: 'updated' },
            { index: 1, value: 1, label: '1/1!', highlight: 'updated' },
            { index: 2, value: 500000004, label: '1/2!', highlight: 'updated' },
            { index: 3, value: 166666668, label: '1/3!', highlight: 'updated' },
            { index: 4, value: 41666667, label: '1/4!', highlight: 'updated' },
            { index: 5, value: 808333339, label: '1/5!', highlight: 'active' },
          ],
        },
      ],
      variables: { ModExpCalls: 1, 'C(5, 2)': '120 * inv[2] * inv[3] = 10' },
    },
    {
      stepNumber: 3,
      title: 'Step 3: Pascal Row 5 & Catalan Sequence Cat[0..4]',
      explanation:
        'Row 5 of Pascal’s Triangle gives [1, 5, 10, 10, 5, 1] via dp[i][j] = dp[i-1][j-1] + dp[i-1][j]. Catalan numbers C_n = C(2n, n) / (n + 1) yield [1, 1, 2, 5, 14].',
      mode: 'array',
      arrays: [
        {
          name: 'Pascal Row n = 5 (C(5, r))',
          cells: [
            { index: 0, value: 1, highlight: 'neutral' },
            { index: 1, value: 5, highlight: 'neutral' },
            { index: 2, value: 10, label: 'C(5,2)', highlight: 'active' },
            { index: 3, value: 10, highlight: 'neutral' },
            { index: 4, value: 5, highlight: 'neutral' },
            { index: 5, value: 1, highlight: 'neutral' },
          ],
        },
        {
          name: 'Catalan Numbers Cat[0..4]',
          cells: [
            { index: 0, value: 1, label: 'C_0', highlight: 'neutral' },
            { index: 1, value: 1, label: 'C_1', highlight: 'neutral' },
            { index: 2, value: 2, label: 'C_2', highlight: 'window' },
            { index: 3, value: 5, label: 'C_3', highlight: 'window' },
            { index: 4, value: 14, label: 'C_4', highlight: 'updated' },
          ],
        },
      ],
      variables: { 'C(5, 2)': 10, 'Catalan(4)': 14, 'Formula': 'C(2n,n) - C(2n,n-1)' },
    },
    {
      stepNumber: 4,
      title: 'Step 4: Lucas Base-P Decomposition (Example: C(13, 5) mod 3)',
      explanation:
        'Expand 13 = (111)_3 and 5 = (012)_3 in base 3. Lucas Theorem computes C(1,0)*C(1,1)*C(1,2) mod 3 = 1 * 1 * 0 = 0 in O(log_p N) steps!',
      mode: 'array',
      arrays: [
        {
          name: 'Base-3 Digits of N=13 vs K=5',
          cells: [
            { index: 2, value: 'C(1, 0)=1', label: '3^2', highlight: 'updated' },
            { index: 1, value: 'C(1, 1)=1', label: '3^1', highlight: 'updated' },
            { index: 0, value: 'C(1, 2)=0', label: '3^0', highlight: 'active' },
          ],
        },
      ],
      variables: { N_base3: '111', K_base3: '012', PrimeP: 3, 'C(13,5)%3': 0 },
    },
  ],
  reductionClues: [
    {
      clue: '"Count non-negative solutions to x_1 + x_2 + ... + x_n = m (or N apples into M baskets)"',
      translation: 'Stars & Bars: C(n + m - 1, n - 1). If positive integers x_i >= 1, subtract 1 from each first -> C(m - 1, n - 1).',
    },
    {
      clue: '"Count balanced bracket sequences of length 2N / full binary trees with N+1 leaves / monotonic grid paths never crossing y = x"',
      translation: 'Catalan Number Cat(N) = C(2N, N) / (N + 1) = (C(2N, N) - C(2N, N - 1)) mod P.',
    },
    {
      clue: '"Compute C(N, R) mod P where N, R <= 10^18 and P is small prime (or square-free product of small primes)"',
      translation: 'Lucas Theorem recursively multiplies C(N % P, R % P) * lucas(N / P, R / P) % P (plus CRT if P = p1 * p2 * ...).',
    },
    {
      clue: '"Precompute 10^6 binomial queries mod 10^9 + 7 under 0.1 seconds"',
      translation: 'Compute fact[MAXN] forward, invFact[MAXN] = modPow(fact[MAXN], P - 2) ONCE, then sweep invFact[i - 1] = invFact[i] * i % P backward in O(N).',
    },
  ],
  timeComplexity: 'Precompute: O(N + log P) | nCr Query: O(1) | Lucas Theorem: O(P + log_P N)',
  spaceComplexity: 'O(N) for fact/invFact (or O(P) for Lucas)',
  pitfalls: [
    {
      type: 'WA',
      title: 'Computing `C(2n, n) / (n + 1)` Using Integer Division After Modulo',
      detail:
        'Never divide a modded value directly by `(n + 1)`! Use modular inverse `(C(2n, n) * inv(n + 1)) % MOD`, OR the subtraction identity `(C(2n, n) - C(2n, n - 1) + MOD) % MOD`.',
    },
    {
      type: 'WA',
      title: 'Wrong Bounds Check `if (k < 0 || k > n) return 0` Omitted',
      detail:
        'In Stars & Bars or Catalan reflection formulas (`C(2n, n - 1)` when `n == 0`), negative or `k > n` queries crash array lookups or return garbage unless guarded with `return 0`.',
    },
    {
      type: 'TLE',
      title: 'Calling `modPow(fact[k], P - 2)` Inside Every Query Instead of Linear `invFact[]`',
      detail:
        'Calling `modPow` twice per query adds ~60 multiplications per query; with Q = 10^6 that TLEs in Java/Python. Precomputing `invFact[]` linearly reduces each `nCr` query to 2 multiplications.',
    },
    {
      type: 'WA',
      title: 'Applying Standard Lucas Theorem When Modulus M Is Composite or Has Prime Powers',
      detail:
        'Lucas Theorem requires prime modulus `p`. For square-free composite `M = p1 * p2`, run Lucas for each `p_i` and merge via CRT; for `p^e`, generalized Kummer/Lucas or Legendre exponents are needed.',
    },
  ],
  implementations: {
    cpp20: `#include <bits/stdc++.h>
using namespace std;

static constexpr long long MOD = 1'000'000'007LL;

long long modPow(long long base, long long exp, long long mod = MOD) {
    long long res = 1;
    base %= mod;
    while (exp > 0) {
        if (exp & 1LL) res = res * base % mod;
        base = base * base % mod;
        exp >>= 1;
    }
    return res;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    const int MAXN = 1'000'000;
    vector<long long> fact(MAXN + 1, 1), invFact(MAXN + 1, 1);
    for (int i = 1; i <= MAXN; ++i) fact[i] = fact[i - 1] * i % MOD;
    invFact[MAXN] = modPow(fact[MAXN], MOD - 2);
    for (int i = MAXN; i >= 1; --i) invFact[i - 1] = invFact[i] * i % MOD;

    auto nCr = [&](int n, int r) -> long long {
        if (r < 0 || r > n) return 0;
        return fact[n] * invFact[r] % MOD * invFact[n - r] % MOD;
    };

    int q;
    if (!(cin >> q)) return 0;
    while (q--) {
        int a, b;
        cin >> a >> b;
        cout << nCr(a, b) << '\\n';
    }
    return 0;
}`,
    rust: `use std::io::{self, Read};

const MOD: u64 = 1_000_000_007;

fn mod_pow(mut base: u64, mut exp: u64, m: u64) -> u64 {
    let mut res = 1u64;
    base %= m;
    while exp > 0 {
        if exp & 1 == 1 {
            res = res * base % m;
        }
        base = base * base % m;
        exp >>= 1;
    }
    res
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
    let mut fact = vec![1u64; MAXN + 1];
    let mut inv_fact = vec![1u64; MAXN + 1];
    for i in 1..=MAXN {
        fact[i] = fact[i - 1] * (i as u64) % MOD;
    }
    inv_fact[MAXN] = mod_pow(fact[MAXN], MOD - 2, MOD);
    for i in (1..=MAXN).rev() {
        inv_fact[i - 1] = inv_fact[i] * (i as u64) % MOD;
    }

    let mut out = String::new();
    for _ in 0..q {
        let n: usize = it.next().unwrap().parse().unwrap();
        let r: usize = it.next().unwrap().parse().unwrap();
        let ans = if r > n {
            0
        } else {
            fact[n] * inv_fact[r] % MOD * inv_fact[n - r] % MOD
        };
        out.push_str(&format!("{}\\n", ans));
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

    static final long MOD = 1_000_000_007L;

    static long modPow(long base, long exp) {
        long res = 1;
        base %= MOD;
        while (exp > 0) {
            if ((exp & 1L) == 1L) res = res * base % MOD;
            base = base * base % MOD;
            exp >>= 1;
        }
        return res;
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        int q = fs.nextInt();
        if (q == Integer.MIN_VALUE) return;

        final int MAXN = 1_000_000;
        long[] fact = new long[MAXN + 1];
        long[] invFact = new long[MAXN + 1];
        fact[0] = 1;
        for (int i = 1; i <= MAXN; i++) fact[i] = fact[i - 1] * i % MOD;
        invFact[MAXN] = modPow(fact[MAXN], MOD - 2);
        for (int i = MAXN; i >= 1; i--) invFact[i - 1] = invFact[i] * i % MOD;

        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < q; i++) {
            int n = fs.nextInt(), r = fs.nextInt();
            if (r < 0 || r > n) sb.append(0).append('\\n');
            else sb.append(fact[n] * invFact[r] % MOD * invFact[n - r] % MOD).append('\\n');
        }
        System.out.print(sb);
    }
}`,
    python3: `import sys

sys.setrecursionlimit(200000)

MOD = 1_000_000_007

def solve() -> None:
    data = sys.stdin.buffer.read().split()
    if not data:
        return
    it = iter(data)
    q = int(next(it))

    MAXN = 1_000_000
    fact = [1] * (MAXN + 1)
    for i in range(1, MAXN + 1):
        fact[i] = fact[i - 1] * i % MOD
    inv_fact = [1] * (MAXN + 1)
    inv_fact[MAXN] = pow(fact[MAXN], MOD - 2, MOD)
    for i in range(MAXN, 0, -1):
        inv_fact[i - 1] = inv_fact[i] * i % MOD

    out = []
    for _ in range(q):
        n = int(next(it))
        r = int(next(it))
        if r < 0 or r > n:
            out.append("0")
        else:
            out.append(str(fact[n] * inv_fact[r] % MOD * inv_fact[n - r] % MOD))
    sys.stdout.write("\\n".join(out) + "\\n")

if __name__ == "__main__":
    solve()`,
    ruby: `MOD = 1_000_000_007

def mod_pow(base, exp)
  res = 1
  base %= MOD
  while exp > 0
    res = (res * base) % MOD if (exp & 1) == 1
    base = (base * base) % MOD
    exp >>= 1
  end
  res
end

data = STDIN.read.split.map(&:to_i)
exit if data.empty?
q = data[0]

maxn = 1_000_000
fact = Array.new(maxn + 1, 1)
(1..maxn).each { |i| fact[i] = (fact[i - 1] * i) % MOD }
inv_fact = Array.new(maxn + 1, 1)
inv_fact[maxn] = mod_pow(fact[maxn], MOD - 2)
maxn.downto(1) { |i| inv_fact[i - 1] = (inv_fact[i] * i) % MOD }

idx = 1
out = []
q.times do
  n = data[idx]; r = data[idx + 1]; idx += 2
  if r < 0 || r > n
    out << 0
  else
    out << ((fact[n] * inv_fact[r] % MOD) * inv_fact[n - r] % MOD)
  end
end
puts out.join("\\n")`,
  },
  practiceProblems: [
    {
      id: 'ma48-p1',
      tier: 'Warmup',
      ratingRange: '1200–1400',
      title: 'Binomial Coefficients Modulo 10^9 + 7 (CSES)',
      statement:
        'Given N queries each consisting of two integers a and b, calculate the binomial coefficient C(a, b) modulo 10^9 + 7 in O(1) per query after linear precomputation.',
      constraints: '1 <= N <= 10^5, 0 <= b <= a <= 10^6.',
      sampleInput: `3
5 3
8 1
9 5`,
      sampleOutput: `10
8
126`,
      hints: [
        'Precompute `fact[0..10^6]` forward and `invFact[10^6] = pow(fact[10^6], MOD - 2)` once.',
        'Fill `invFact[i - 1] = invFact[i] * i % MOD` downward so each query takes 2 modular multiplications.',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

static constexpr long long MOD = 1'000'000'007LL;

long long modPow(long long b, long long e) {
    long long r = 1; b %= MOD;
    while (e > 0) { if (e & 1) r = r * b % MOD; b = b * b % MOD; e >>= 1; }
    return r;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    const int MAXN = 1'000'000;
    vector<long long> fact(MAXN + 1, 1), inv(MAXN + 1, 1);
    for (int i = 1; i <= MAXN; ++i) fact[i] = fact[i - 1] * i % MOD;
    inv[MAXN] = modPow(fact[MAXN], MOD - 2);
    for (int i = MAXN; i >= 1; --i) inv[i - 1] = inv[i] * i % MOD;
    int n;
    if (!(cin >> n)) return 0;
    while (n--) {
        int a, b; cin >> a >> b;
        if (b < 0 || b > a) cout << 0 << '\\n';
        else cout << fact[a] * inv[b] % MOD * inv[a - b] % MOD << '\\n';
    }
    return 0;
}`,
        rust: `use std::io::{self, Read};

const MOD: u64 = 1_000_000_007;

fn mod_pow(mut b: u64, mut e: u64) -> u64 {
    let mut r = 1u64;
    b %= MOD;
    while e > 0 { if e & 1 == 1 { r = r * b % MOD; } b = b * b % MOD; e >>= 1; }
    r
}

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let q: usize = match it.next() { Some(x) => x.parse().unwrap(), None => return };
    const MAXN: usize = 1_000_000;
    let mut fact = vec![1u64; MAXN + 1];
    let mut inv = vec![1u64; MAXN + 1];
    for i in 1..=MAXN { fact[i] = fact[i - 1] * i as u64 % MOD; }
    inv[MAXN] = mod_pow(fact[MAXN], MOD - 2);
    for i in (1..=MAXN).rev() { inv[i - 1] = inv[i] * i as u64 % MOD; }
    let mut out = String::new();
    for _ in 0..q {
        let a: usize = it.next().unwrap().parse().unwrap();
        let b: usize = it.next().unwrap().parse().unwrap();
        let ans = if b > a { 0 } else { fact[a] * inv[b] % MOD * inv[a - b] % MOD };
        out.push_str(&format!("{}\\n", ans));
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

    static final long MOD = 1_000_000_007L;
    static long modPow(long b, long e) {
        long r = 1; b %= MOD;
        while (e > 0) { if ((e & 1L) == 1L) r = r * b % MOD; b = b * b % MOD; e >>= 1; }
        return r;
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        int q = fs.nextInt(); if (q == Integer.MIN_VALUE) return;
        final int MAXN = 1_000_000;
        long[] fact = new long[MAXN + 1], inv = new long[MAXN + 1];
        fact[0] = 1;
        for (int i = 1; i <= MAXN; i++) fact[i] = fact[i - 1] * i % MOD;
        inv[MAXN] = modPow(fact[MAXN], MOD - 2);
        for (int i = MAXN; i >= 1; i--) inv[i - 1] = inv[i] * i % MOD;
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < q; i++) {
            int a = fs.nextInt(), b = fs.nextInt();
            sb.append(b < 0 || b > a ? 0L : fact[a] * inv[b] % MOD * inv[a - b] % MOD).append('\\n');
        }
        System.out.print(sb);
    }
}`,
        python3: `import sys
sys.setrecursionlimit(200000)
MOD = 1_000_000_007

def solve():
    data = sys.stdin.buffer.read().split()
    if not data: return
    it = iter(data)
    q = int(next(it))
    MAXN = 1_000_000
    fact = [1] * (MAXN + 1)
    for i in range(1, MAXN + 1): fact[i] = fact[i - 1] * i % MOD
    inv = [1] * (MAXN + 1)
    inv[MAXN] = pow(fact[MAXN], MOD - 2, MOD)
    for i in range(MAXN, 0, -1): inv[i - 1] = inv[i] * i % MOD
    out = []
    for _ in range(q):
        a, b = int(next(it)), int(next(it))
        out.append("0" if b < 0 or b > a else str(fact[a] * inv[b] % MOD * inv[a - b] % MOD))
    sys.stdout.write("\\n".join(out) + "\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `MOD = 1_000_000_007
def mod_pow(b, e)
  r = 1; b %= MOD
  while e > 0; r = r * b % MOD if (e & 1) == 1; b = b * b % MOD; e >>= 1; end
  r
end
data = STDIN.read.split.map(&:to_i)
exit if data.empty?
q = data[0]; maxn = 1_000_000
fact = Array.new(maxn + 1, 1)
(1..maxn).each { |i| fact[i] = fact[i - 1] * i % MOD }
inv = Array.new(maxn + 1, 1)
inv[maxn] = mod_pow(fact[maxn], MOD - 2)
maxn.downto(1) { |i| inv[i - 1] = inv[i] * i % MOD }
idx = 1; out = []
q.times do
  a = data[idx]; b = data[idx + 1]; idx += 2
  out << (b < 0 || b > a ? 0 : fact[a] * inv[b] % MOD * inv[a - b] % MOD)
end
puts out.join("\\n")`,
      },
    },
    {
      id: 'ma48-p2',
      tier: 'Standard',
      ratingRange: '1450–1600',
      title: 'Bracket Sequences II (Catalan Reflection Principle With Prefix)',
      statement:
        'You are given a target balanced bracket length N and a fixed prefix string S consisting of `(` and `)`. Count how many valid balanced bracket strings of total length N start with S, modulo 10^9 + 7.',
      constraints: '1 <= |S| <= N <= 10^6.',
      sampleInput: `6
(()`,
      sampleOutput: `2`,
      hints: [
        'First scan S: if the running balance `bal` (`(` is +1, `)` is -1) ever drops below 0, or if N is odd, or if remaining length `rem = N - |S|` is less than `bal`, output 0.',
        'Otherwise we need `rem` more brackets ending at balance 0 without dropping below 0. Let `k = (rem - bal) / 2` be remaining `(` brackets (`rem - k` are `)`). By the Catalan Reflection Principle, valid paths equal `C(rem, k) - C(rem, k - 1)` mod 10^9 + 7!',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

static constexpr long long MOD = 1'000'000'007LL;

long long modPow(long long b, long long e) {
    long long r = 1; b %= MOD;
    while (e > 0) { if (e & 1) r = r * b % MOD; b = b * b % MOD; e >>= 1; }
    return r;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n; string s;
    if (!(cin >> n >> s)) return 0;
    if (n % 2 != 0) { cout << 0 << '\\n'; return 0; }
    int bal = 0;
    for (char c : s) {
        bal += (c == '(' ? 1 : -1);
        if (bal < 0) { cout << 0 << '\\n'; return 0; }
    }
    int rem = n - (int)s.size();
    if (rem < bal || (rem - bal) % 2 != 0) { cout << 0 << '\\n'; return 0; }
    int k = (rem - bal) / 2;

    vector<long long> fact(rem + 1, 1), inv(rem + 1, 1);
    for (int i = 1; i <= rem; ++i) fact[i] = fact[i - 1] * i % MOD;
    inv[rem] = modPow(fact[rem], MOD - 2);
    for (int i = rem; i >= 1; --i) inv[i - 1] = inv[i] * i % MOD;
    auto nCr = [&](int a, int b) -> long long {
        if (b < 0 || b > a) return 0;
        return fact[a] * inv[b] % MOD * inv[a - b] % MOD;
    };
    long long ans = (nCr(rem, k) - nCr(rem, k - 1) + MOD) % MOD;
    cout << ans << '\\n';
    return 0;
}`,
        rust: `use std::io::{self, Read};

const MOD: u64 = 1_000_000_007;

fn mod_pow(mut b: u64, mut e: u64) -> u64 {
    let mut r = 1u64;
    b %= MOD;
    while e > 0 { if e & 1 == 1 { r = r * b % MOD; } b = b * b % MOD; e >>= 1; }
    r
}

fn main() {
    let mut s_in = String::new();
    io::stdin().read_to_string(&mut s_in).unwrap();
    let mut it = s_in.split_whitespace();
    let n: usize = match it.next() { Some(x) => x.parse().unwrap(), None => return };
    let pref = it.next().unwrap_or("");
    if n % 2 != 0 { println!("0"); return; }
    let mut bal: i32 = 0;
    for &b in pref.as_bytes() {
        bal += if b == b'(' { 1 } else { -1 };
        if bal < 0 { println!("0"); return; }
    }
    let rem_i = n as i32 - pref.len() as i32;
    if rem_i < bal || (rem_i - bal) % 2 != 0 { println!("0"); return; }
    let rem = rem_i as usize;
    let k = ((rem_i - bal) / 2) as usize;
    let mut fact = vec![1u64; rem + 1];
    let mut inv = vec![1u64; rem + 1];
    for i in 1..=rem { fact[i] = fact[i - 1] * i as u64 % MOD; }
    inv[rem] = mod_pow(fact[rem], MOD - 2);
    for i in (1..=rem).rev() { inv[i - 1] = inv[i] * i as u64 % MOD; }
    let c1 = fact[rem] * inv[k] % MOD * inv[rem - k] % MOD;
    let c2 = if k == 0 { 0 } else { fact[rem] * inv[k - 1] % MOD * inv[rem - (k - 1)] % MOD };
    println!("{}", (c1 + MOD - c2) % MOD);
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
        String nextToken() throws IOException {
            int c; while ((c = read()) <= 32) if (c == -1) return null;
            StringBuilder sb = new StringBuilder();
            while (c > 32) { sb.append((char) c); c = read(); }
            return sb.toString();
        }
    }

    static final long MOD = 1_000_000_007L;
    static long modPow(long b, long e) {
        long r = 1; b %= MOD;
        while (e > 0) { if ((e & 1L) == 1L) r = r * b % MOD; b = b * b % MOD; e >>= 1; }
        return r;
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        String first = fs.nextToken(); if (first == null) return;
        int n = Integer.parseInt(first);
        String s = fs.nextToken();
        if (s == null) s = "";
        if (n % 2 != 0) { System.out.println(0); return; }
        int bal = 0;
        for (int i = 0; i < s.length(); i++) {
            bal += s.charAt(i) == '(' ? 1 : -1;
            if (bal < 0) { System.out.println(0); return; }
        }
        int rem = n - s.length();
        if (rem < bal || (rem - bal) % 2 != 0) { System.out.println(0); return; }
        int k = (rem - bal) / 2;
        long[] fact = new long[rem + 1], inv = new long[rem + 1];
        fact[0] = 1;
        for (int i = 1; i <= rem; i++) fact[i] = fact[i - 1] * i % MOD;
        inv[rem] = modPow(fact[rem], MOD - 2);
        for (int i = rem; i >= 1; i--) inv[i - 1] = inv[i] * i % MOD;
        long c1 = fact[rem] * inv[k] % MOD * inv[rem - k] % MOD;
        long c2 = k == 0 ? 0 : fact[rem] * inv[k - 1] % MOD * inv[rem - (k - 1)] % MOD;
        System.out.println((c1 - c2 + MOD) % MOD);
    }
}`,
        python3: `import sys
sys.setrecursionlimit(200000)
MOD = 1_000_000_007

def solve():
    data = sys.stdin.read().split()
    if not data: return
    n = int(data[0])
    s = data[1] if len(data) > 1 else ""
    if n % 2 != 0: print(0); return
    bal = 0
    for ch in s:
        bal += 1 if ch == "(" else -1
        if bal < 0: print(0); return
    rem = n - len(s)
    if rem < bal or (rem - bal) % 2 != 0: print(0); return
    k = (rem - bal) // 2
    fact = [1] * (rem + 1)
    for i in range(1, rem + 1): fact[i] = fact[i - 1] * i % MOD
    inv = [1] * (rem + 1)
    inv[rem] = pow(fact[rem], MOD - 2, MOD)
    for i in range(rem, 0, -1): inv[i - 1] = inv[i] * i % MOD
    c1 = fact[rem] * inv[k] % MOD * inv[rem - k] % MOD
    c2 = 0 if k == 0 else fact[rem] * inv[k - 1] % MOD * inv[rem - (k - 1)] % MOD
    print((c1 - c2) % MOD)

if __name__ == "__main__":
    solve()`,
        ruby: `MOD = 1_000_000_007
def mod_pow(b, e)
  r = 1; b %= MOD
  while e > 0; r = r * b % MOD if (e & 1) == 1; b = b * b % MOD; e >>= 1; end
  r
end
toks = STDIN.read.split
exit if toks.empty?
n = toks[0].to_i; s = toks[1] || ""
if n.odd?; puts 0; exit; end
bal = 0
s.each_char do |c|
  bal += (c == "(" ? 1 : -1)
  if bal < 0; puts 0; exit; end
end
rem = n - s.length
if rem < bal || (rem - bal).odd?; puts 0; exit; end
k = (rem - bal) / 2
fact = Array.new(rem + 1, 1)
(1..rem).each { |i| fact[i] = fact[i - 1] * i % MOD }
inv = Array.new(rem + 1, 1)
inv[rem] = mod_pow(fact[rem], MOD - 2)
rem.downto(1) { |i| inv[i - 1] = inv[i] * i % MOD }
c1 = fact[rem] * inv[k] % MOD * inv[rem - k] % MOD
c2 = k == 0 ? 0 : fact[rem] * inv[k - 1] % MOD * inv[rem - (k - 1)] % MOD
puts (c1 - c2) % MOD`,
      },
    },
    {
      id: 'ma48-p3',
      tier: 'Boss',
      ratingRange: '1750–1950',
      title: 'Giant Combinations C(N, K) Mod Square-Free M via Lucas + CRT',
      statement:
        'Given T test cases with N, K (0 <= K <= N <= 10^18) and a square-free modulus M (2 <= M <= 10^6, product of distinct primes p_i <= 10^5), compute C(N, K) mod M using prime factorization + Lucas Theorem + Chinese Remainder Theorem.',
      constraints: '1 <= T <= 100, 0 <= K <= N <= 10^18, M is square-free and <= 10^6.',
      sampleInput: `3
1000000000000000000 10 142857
13 5 30
10 3 210`,
      sampleOutput: `0
27
120`,
      hints: [
        'Factorize M into its distinct prime factors p_1, p_2, ..., p_r (since M is square-free and <= 10^6, trial division takes O(sqrt(M))).',
        'For each prime factor p, evaluate `rem_p = Lucas(N, K, p)` using `O(p)` factorial tables. Then merge all `(rem_p, p)` congruences cleanly using CRT (or Garner / Extended GCD)!',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

long long modPow(long long b, long long e, long long m) {
    long long r = 1; b %= m;
    while (e > 0) { if (e & 1) r = (__int128)r * b % m; b = (__int128)b * b % m; e >>= 1; }
    return r;
}

long long extGcd(long long a, long long b, long long& x, long long& y) {
    if (b == 0) { x = 1; y = 0; return a; }
    long long x1, y1;
    long long g = extGcd(b, a % b, x1, y1);
    x = y1;
    y = x1 - (a / b) * y1;
    return g;
}

long long nCrSmall(long long n, long long r, long long p, const vector<long long>& fact, const vector<long long>& inv) {
    if (r > n) return 0;
    return fact[n] * inv[r] % p * inv[n - r] % p;
}

long long lucas(long long n, long long k, long long p) {
    vector<long long> fact(p, 1), inv(p, 1);
    for (int i = 1; i < p; ++i) fact[i] = fact[i - 1] * i % p;
    inv[p - 1] = modPow(fact[p - 1], p - 2, p);
    for (int i = p - 1; i >= 1; --i) inv[i - 1] = inv[i] * i % p;
    long long res = 1;
    while (n > 0 || k > 0) {
        res = res * nCrSmall(n % p, k % p, p, fact, inv) % p;
        n /= p; k /= p;
    }
    return res;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int T;
    if (!(cin >> T)) return 0;
    while (T--) {
        long long n, k, m;
        cin >> n >> k >> m;
        if (k > n) { cout << 0 << '\\n'; continue; }
        if (m == 1) { cout << 0 << '\\n'; continue; }
        long long tmp = m;
        vector<long long> primes;
        for (long long d = 2; d * d <= tmp; ++d) {
            if (tmp % d == 0) {
                primes.push_back(d);
                while (tmp % d == 0) tmp /= d;
            }
        }
        if (tmp > 1) primes.push_back(tmp);

        long long curRem = 0, curMod = 1;
        for (long long p : primes) {
            long long r = lucas(n, k, p);
            long long x, y;
            extGcd(curMod, p, x, y);
            long long diff = ((r - curRem) % p + p) % p;
            long long step = (__int128)diff * ((x % p + p) % p) % p;
            curRem += curMod * step;
            curMod *= p;
        }
        cout << (curRem % m) << '\\n';
    }
    return 0;
}`,
        rust: `use std::io::{self, Read};

fn mod_pow(mut b: u128, mut e: u128, m: u128) -> u128 {
    let mut r = 1u128;
    b %= m;
    while e > 0 { if e & 1 == 1 { r = r * b % m; } b = b * b % m; e >>= 1; }
    r
}

fn ext_gcd(a: i128, b: i128) -> (i128, i128, i128) {
    if b == 0 { return (a, 1, 0); }
    let (g, x1, y1) = ext_gcd(b, a % b);
    (g, y1, x1 - (a / b) * y1)
}

fn lucas(mut n: u64, mut k: u64, p: u64) -> u64 {
    let pu = p as usize;
    let mut fact = vec![1u64; pu];
    let mut inv = vec![1u64; pu];
    for i in 1..pu { fact[i] = fact[i - 1] * i as u64 % p; }
    inv[pu - 1] = mod_pow(fact[pu - 1] as u128, (p - 2) as u128, p as u128) as u64;
    for i in (1..pu).rev() { inv[i - 1] = inv[i] * i as u64 % p; }
    let mut res = 1u64;
    while n > 0 || k > 0 {
        let ni = (n % p) as usize;
        let ki = (k % p) as usize;
        if ki > ni { return 0; }
        let c = fact[ni] * inv[ki] % p * inv[ni - ki] % p;
        res = res * c % p;
        n /= p; k /= p;
    }
    res
}

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let t: usize = match it.next() { Some(x) => x.parse().unwrap(), None => return };
    for _ in 0..t {
        let n: u64 = it.next().unwrap().parse().unwrap();
        let k: u64 = it.next().unwrap().parse().unwrap();
        let m: u64 = it.next().unwrap().parse().unwrap();
        if k > n || m == 1 { println!("0"); continue; }
        let mut tmp = m;
        let mut primes = Vec::new();
        let mut d = 2u64;
        while d * d <= tmp {
            if tmp % d == 0 {
                primes.push(d);
                while tmp % d == 0 { tmp /= d; }
            }
            d += 1;
        }
        if tmp > 1 { primes.push(tmp); }
        let (mut cur_rem, mut cur_mod) = (0i128, 1i128);
        for p in primes {
            let r = lucas(n, k, p) as i128;
            let pi = p as i128;
            let (_, x, _) = ext_gcd(cur_mod, pi);
            let diff = ((r - cur_rem) % pi + pi) % pi;
            let step = (diff * ((x % pi + pi) % pi)) % pi;
            cur_rem += cur_mod * step;
            cur_mod *= pi;
        }
        println!("{}", cur_rem % (m as i128));
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
        int nextInt() throws IOException { return (int) nextLong(); }
    }

    static long modPow(long b, long e, long m) {
        long r = 1; b %= m;
        while (e > 0) { if ((e & 1L) == 1L) r = (r * b) % m; b = (b * b) % m; e >>= 1; }
        return r;
    }

    static long[] extGcd(long a, long b) {
        if (b == 0) return new long[]{a, 1, 0};
        long[] g = extGcd(b, a % b);
        return new long[]{g[0], g[2], g[1] - (a / b) * g[2]};
    }

    static long lucas(long n, long k, int p) {
        long[] fact = new long[p], inv = new long[p];
        fact[0] = 1;
        for (int i = 1; i < p; i++) fact[i] = fact[i - 1] * i % p;
        inv[p - 1] = modPow(fact[p - 1], p - 2, p);
        for (int i = p - 1; i >= 1; i--) inv[i - 1] = inv[i] * i % p;
        long res = 1;
        while (n > 0 || k > 0) {
            int ni = (int) (n % p), ki = (int) (k % p);
            if (ki > ni) return 0;
            res = res * fact[ni] % p * inv[ki] % p * inv[ni - ki] % p;
            n /= p; k /= p;
        }
        return res;
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        long f = fs.nextLong(); if (f == Long.MIN_VALUE) return;
        int T = (int) f;
        StringBuilder sb = new StringBuilder();
        while (T-- > 0) {
            long n = fs.nextLong(), k = fs.nextLong(), m = fs.nextLong();
            if (k > n || m == 1) { sb.append(0).append('\\n'); continue; }
            long tmp = m;
            ArrayList<Integer> primes = new ArrayList<>();
            for (long d = 2; d * d <= tmp; d++) {
                if (tmp % d == 0) {
                    primes.add((int) d);
                    while (tmp % d == 0) tmp /= d;
                }
            }
            if (tmp > 1) primes.add((int) tmp);
            long curRem = 0, curMod = 1;
            for (int p : primes) {
                long r = lucas(n, k, p);
                long x = extGcd(curMod, p)[1];
                long diff = ((r - curRem) % p + p) % p;
                long step = diff * ((x % p + p) % p) % p;
                curRem += curMod * step;
                curMod *= p;
            }
            sb.append(curRem % m).append('\\n');
        }
        System.out.print(sb);
    }
}`,
        python3: `import sys
sys.setrecursionlimit(200000)

def lucas(n: int, k: int, p: int) -> int:
    fact = [1] * p
    for i in range(1, p): fact[i] = fact[i - 1] * i % p
    inv = [1] * p
    inv[p - 1] = pow(fact[p - 1], p - 2, p)
    for i in range(p - 1, 0, -1): inv[i - 1] = inv[i] * i % p
    res = 1
    while n > 0 or k > 0:
        ni, ki = n % p, k % p
        if ki > ni: return 0
        res = res * fact[ni] % p * inv[ki] % p * inv[ni - ki] % p
        n //= p; k //= p
    return res

def solve():
    data = sys.stdin.buffer.read().split()
    if not data: return
    it = iter(data)
    T = int(next(it))
    out = []
    for _ in range(T):
        n, k, m = int(next(it)), int(next(it)), int(next(it))
        if k > n or m == 1: out.append("0"); continue
        tmp = m
        primes = []
        d = 2
        while d * d <= tmp:
            if tmp % d == 0:
                primes.append(d)
                while tmp % d == 0: tmp //= d
            d += 1
        if tmp > 1: primes.append(tmp)
        cur_rem, cur_mod = 0, 1
        for p in primes:
            r = lucas(n, k, p)
            inv_m = pow(cur_mod, -1, p)
            step = ((r - cur_rem) % p) * inv_m % p
            cur_rem += cur_mod * step
            cur_mod *= p
        out.append(str(cur_rem % m))
    sys.stdout.write("\\n".join(out) + "\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `def mod_pow(b, e, m)
  r = 1; b %= m
  while e > 0; r = r * b % m if (e & 1) == 1; b = b * b % m; e >>= 1; end
  r
end

def ext_gcd(a, b)
  return [a, 1, 0] if b == 0
  g, x1, y1 = ext_gcd(b, a % b)
  [g, y1, x1 - (a / b) * y1]
end

def lucas(n, k, p)
  fact = Array.new(p, 1)
  (1...p).each { |i| fact[i] = fact[i - 1] * i % p }
  inv = Array.new(p, 1)
  inv[p - 1] = mod_pow(fact[p - 1], p - 2, p)
  (p - 1).downto(1) { |i| inv[i - 1] = inv[i] * i % p }
  res = 1
  while n > 0 || k > 0
    ni = n % p; ki = k % p
    return 0 if ki > ni
    res = res * fact[ni] % p * inv[ki] % p * inv[ni - ki] % p
    n /= p; k /= p
  end
  res
end

data = STDIN.read.split.map(&:to_i)
exit if data.empty?
t = data[0]; idx = 1; out = []
t.times do
  n = data[idx]; k = data[idx + 1]; m = data[idx + 2]; idx += 3
  if k > n || m == 1; out << 0; next; end
  tmp = m; primes = []; d = 2
  while d * d <= tmp
    if tmp % d == 0
      primes << d
      tmp /= d while tmp % d == 0
    end
    d += 1
  end
  primes << tmp if tmp > 1
  cur_rem = 0; cur_mod = 1
  primes.each do |p|
    r = lucas(n, k, p)
    _, x, = ext_gcd(cur_mod, p)
    step = ((r - cur_rem) % p) * (x % p) % p
    cur_rem += cur_mod * step
    cur_mod *= p
  end
  out << (cur_rem % m)
end
puts out.join("\\n")`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'CSES',
      title: 'Binomial Coefficients, Distributing Apples & Bracket Sequences II',
      difficulty: 'USACO Gold (1300–1650)',
      url: 'https://cses.fi/problemset/task/1079',
      patternNote: 'Covers the exact canonical trio: linear invFact, Stars & Bars, and Catalan Reflection.',
    },
    {
      platform: 'AtCoder',
      title: 'ABC156 D Bouquet & ABC205 E White and Black Balls',
      difficulty: 'AtCoder Cyan (~1450)',
      url: 'https://atcoder.jp/contests/abc205/tasks/abc205_e',
      patternNote: 'Direct Catalan ballot-reflection geometry on 2D lattice paths.',
    },
    {
      platform: 'Codeforces',
      title: 'CF 1312D Count the Arrays & CF 559C Gerald and Giant Chess',
      difficulty: 'CF 1700–1900',
      url: 'https://codeforces.com/problemset/problem/559/C',
      patternNote: '559C combines grid Stars & Bars with obstacle inclusion-exclusion DP.',
    },
    {
      platform: 'CodeChef',
      title: 'SANDWICH / LUCKY10 (Lucas Theorem + CRT)',
      difficulty: 'CodeChef 4★–5★',
      url: 'https://www.codechef.com/tags/problems/lucas-theorem',
      patternNote: 'Standard large-N small-prime Lucas Theorem + CRT merging tasks.',
    },
    {
      platform: 'HackerRank',
      title: 'nCr Table & Cheese and Random Toppings',
      difficulty: 'Medium / Hard',
      url: 'https://www.hackerrank.com/challenges/cheese-and-random-toppings',
      patternNote: 'Cheese and Random Toppings literally asks for C(N, R) mod M (square-free) via Lucas + CRT.',
    },
    {
      platform: 'NeetCode 150',
      title: 'Unique Paths & Unique Binary Search Trees (Catalan)',
      difficulty: 'FAANG Medium',
      url: 'https://leetcode.com/problems/unique-binary-search-trees/',
      patternNote: 'Lattice paths = Stars & Bars C(m+n-2, n-1); Unique BSTs = Catalan number C_n.',
    },
  ],
  interviewNotes: [
    'Never forget the linear O(N) backward inverse-factorial sweep (`invFact[i-1] = invFact[i] * i % MOD`), cutting O(N log P) down to ONE single `modPow`.',
    'Know the Catalan Reflection Principle proof: every invalid lattice path touching `y = -1` reflects 1-to-1 onto a path ending at `(2n, -2)`, proving `Valid = C(2n, n) - C(2n, n-1)`.',
  ],
  projectBlueprint: {
    title: 'Probability & Valid Syntax Tree Enumeration Library',
    tagline:
      'Enumerate exact AST branching shapes via Catalan combinatorics, partition discrete workloads with Stars & Bars, and evaluate exact prime-modular nCr queries via Lucas + CRT.',
    stackSummary: 'TypeScript + BigInt Inverse-Factorial Table + Lucas/CRT Combinatorial Engine',
    asciiDiagram:
      '(n, k, mod) ──▶ [n <= 10^6 & prime?] ──YES──▶ O(1) fact[n]*invFact[k]*invFact[n-k]\n' +
      '                        └──NO (N <= 10^18)──▶ Lucas Base-P + CRT Merger',
    milestones: [
      {
        id: 'ch18-m1',
        title: 'Milestone 1: BigInt Linear Inverse-Factorial Precompute',
        detail: 'Build overflow-free mod 10^9+7 factorial and inverse factorial arrays up to 10^6.',
      },
      {
        id: 'ch18-m2',
        title: 'Milestone 2: Catalan AST & Dyck-Word Enumerator',
        detail: 'Compute valid binary tree counts and prefix-constrained bracket completions in O(1).',
      },
      {
        id: 'ch18-m3',
        title: 'Milestone 3: Large-Scale Lucas + CRT Combinatorial Solver',
        detail: 'Support 64-bit binomial queries under arbitrary square-free composite moduli.',
      },
    ],
    starterCode: `export class CombinatoricsEngine {
  private readonly mod: bigint;
  private readonly fact: BigInt64Array;
  private readonly invFact: BigInt64Array;

  constructor(maxN = 100_000, mod = 1_000_000_007n) {
    this.mod = mod;
    this.fact = new BigInt64Array(maxN + 1);
    this.invFact = new BigInt64Array(maxN + 1);
    this.fact[0] = 1n;
    for (let i = 1; i <= maxN; i++) {
      this.fact[i] = (this.fact[i - 1] * BigInt(i)) % mod;
    }
    this.invFact[maxN] = CombinatoricsEngine.modPow(this.fact[maxN], mod - 2n, mod);
    for (let i = maxN; i >= 1; i--) {
      this.invFact[i - 1] = (this.invFact[i] * BigInt(i)) % mod;
    }
  }

  static modPow(base: bigint, exp: bigint, mod: bigint): bigint {
    let res = 1n;
    let b = ((base % mod) + mod) % mod;
    let e = exp;
    while (e > 0n) {
      if ((e & 1n) === 1n) res = (res * b) % mod;
      b = (b * b) % mod;
      e >>= 1n;
    }
    return res;
  }

  nCr(n: number, r: number): bigint {
    if (r < 0 || r > n) return 0n;
    return (((this.fact[n] * this.invFact[r]) % this.mod) * this.invFact[n - r]) % this.mod;
  }

  catalan(n: number): bigint {
    if (n === 0) return 1n;
    return (this.nCr(2 * n, n) - this.nCr(2 * n, n - 1) + this.mod) % this.mod;
  }

  starsAndBars(items: number, bins: number): bigint {
    if (bins <= 0 || items < 0) return 0n;
    return this.nCr(items + bins - 1, bins - 1);
  }
}`,
  },
};
