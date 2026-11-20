import type { TheoryChapter } from '../../types/vault';

export const CH52_MILLER_RABIN_POLLARD_RHO: TheoryChapter = {
  slug: 'miller-rabin-pollard-rho',
  topicId: 'ma-54',
  title: 'Miller-Rabin Primality & Pollard Rho Factorization',
  domain: 'Math, Number Theory & Algebra',
  ratingTier: '2200–2600',
  usacoDivision: 'Platinum',
  subtitle:
    'Test 64-bit integers up to 2^64 - 1 deterministically in O(7 * log^3 N) using Miller-Rabin witness bases {2, 325, 9375, 28178, 450775, 9780504, 1795265022}, and factorize arbitrary 10^18 composites in O(N^(1/4)) via Brent’s Pollard Rho with batched GCD.',
  analogyTitle: 'The 7-Key Deterministic Lock & Birthday-Paradox Modular Walker Analogy',
  analogyBody:
    'Trial division up to `sqrt(N)` explodes at `N = 10^{18}` (`10^9` steps = TLE!). **Miller-Rabin** inspects `N - 1 = d * 2^s` using Fermat’s Little Theorem plus a crucial extra rule: along the repeated-squaring ladder `a^d, a^{2d}, ..., a^{2^s d} (mod N)`, if any step lands on `1`, the previous value MUST be either `1` or `N - 1` (since `1` has only two square roots `+/- 1` modulo a prime!). Remarkably, checking just **7 specific witness bases `{2, 325, 9375, 28178, 450775, 9780504, 1795265022}`** is mathematically **100% deterministic** for EVERY 64-bit unsigned integer! Once composite `N` is flagged, **Pollard’s Rho (with Brent’s cycle optimization)** walks pseudo-randomly via `f(x) = (x^2 + c) mod N`: by the Birthday Paradox, two iterates collide modulo a hidden factor `p | N` after roughly **`sqrt(p) <= N^{1/4}`** steps (`~30,000` steps for `N = 10^{18}`!). Multiplying 128 differences `prod = (prod * |x - y|) mod N` and taking a single `gcd(prod, N)` batch-amortizes the `log N` GCD cost into near-instant speed!',
  prerequisites: [
    {
      slug: 'modular-arithmetic-fermat-crt',
      title: 'Modular Exponentiation, Extended GCD & CRT',
    },
  ],
  traceTitle: 'Interactive Deterministic Miller-Rabin Witness & Brent Pollard-Rho Trace',
  traceSubtitle:
    'Decompose `n = 561` (a Carmichael number!) to see witness `a = 2` catch its non-trivial square root of 1, and watch Brent’s Rho split `n = 8051` (`83 * 97`) in 5 steps.',
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Step 1: Catch Carmichael Number n = 561 via Miller-Rabin Witness a = 2',
      explanation:
        'Note 561 = 3 * 11 * 17 passes naive Fermat (2^560 == 1 mod 561)! Write 560 = 35 * 2^4 (d = 35, s = 4). Compute x = 2^35 mod 561 = 263. Square s - 1 times: 263^2 mod 561 = 166; 166^2 mod 561 = 67; 67^2 mod 561 = 1! Because 67 != 560 (-1 mod 561), 67 is a non-trivial square root of 1 -> 561 is COMPOSITE!',
      mode: 'array',
      arrays: [
        {
          name: 'Miller-Rabin Squaring Ladder on n = 561, a = 2 (d=35, s=4)',
          cells: [
            { index: 0, value: '2^35 = 263', label: 'r = 0', highlight: 'window' },
            { index: 1, value: '263^2 = 166', label: 'r = 1', highlight: 'window' },
            { index: 2, value: '166^2 = 67', label: 'r = 2', highlight: 'updated' },
            { index: 3, value: '67^2 = 1 (!= n-1)', label: 'CAUGHT!', highlight: 'active' },
          ],
        },
      ],
      variables: { N: 561, d: 35, s: 4, Verdict: 'COMPOSITE (witness a=2)' },
    },
    {
      stepNumber: 2,
      title: 'Step 2: 7 Deterministic Bases Certify Every 64-Bit Integer (< 2^64)',
      explanation:
        'Using 128-bit modular multiplication ((__int128)a * b % n), testing the 7 fixed bases {2, 325, 9375, 28178, 450775, 9780504, 1795265022} has ZERO false positives across all integers 1 <= N < 2^64!',
      mode: 'array',
      arrays: [
        {
          name: '7-Base Deterministic Set for 64-Bit Unsigned Integers',
          cells: [
            { index: 0, value: '2', highlight: 'active' },
            { index: 1, value: '325', highlight: 'active' },
            { index: 2, value: '9375', highlight: 'active' },
            { index: 3, value: '28178', highlight: 'active' },
            { index: 4, value: '450775', highlight: 'active' },
            { index: 5, value: '9780504', highlight: 'active' },
            { index: 6, value: '1795265022', highlight: 'active' },
          ],
        },
      ],
      variables: { GuaranteedDomain: '[2, 2^64 - 1]', ModMulType: '__int128 / u128' },
    },
    {
      stepNumber: 3,
      title: 'Step 3: Brent’s Pollard Rho Splits n = 8051 Using f(x) = (x^2 + 1) mod 8051',
      explanation:
        'Start x = 2, y = 2, q = 1. Iterates: 2 -> 5 -> 26 -> 677 -> 7474. Comparing differences against anchored power-of-2 checkpoint y accumulates gcd(|x - y|, 8051) = 97 -> splits 8051 = 83 * 97 in O(N^(1/4))!',
      mode: 'array',
      arrays: [
        {
          name: 'Pollard Rho Trajectory on n = 8051',
          cells: [
            { index: 0, value: 'x=2', label: 'start', highlight: 'neutral' },
            { index: 1, value: 'x=5', label: 'step 1', highlight: 'window' },
            { index: 2, value: 'x=26', label: 'step 2', highlight: 'window' },
            { index: 3, value: 'x=677', label: 'step 3', highlight: 'updated' },
            { index: 4, value: 'gcd -> 97', label: '8051 = 83*97', highlight: 'active' },
          ],
        },
      ],
      variables: { DiscoveredFactor: 97, Quotient: 83, Complexity: 'O(N^(1/4))' },
    },
  ],
  reductionClues: [
    {
      clue: '"Check primality of Q <= 10^5 numbers up to 10^{18}"',
      translation:
        '**Deterministic 7-Base Miller-Rabin** with `__int128` (`u128` / `BigInteger`) modular multiplication runs in ~`30` microseconds per query!',
    },
    {
      clue: '"Factorize integers up to 10^{18} (or compute phi(N), tau(N), sigma(N), radical, primitive root)"',
      translation:
        '**Recursive Pollard’s Rho + Miller-Rabin**: if `n <= 1` stop; if `isPrime(n)` push `n`; else extract factor `d = pollardRho(n)` and recurse on `d` and `n / d`!',
    },
    {
      clue: '"Enumerate all divisors of N <= 10^{18} fast without sqrt(N) TLE"',
      translation:
        'Factorize `N` via Pollard’s Rho into `[(p_i, e_i)]` in `O(N^{1/4})`, then run a tiny DFS over prime exponents to generate every divisor in `O(tau(N))` (`<= 10^5` divisors even at `10^{18}`)!',
    },
    {
      clue: '"Pollard Rho loops forever on tiny composites like n = 4 or when f(x) hits a dead cycle"',
      translation:
        'Handle `n % 2 == 0` explicitly (`return 2`), check `n == 4` / small primes upfront, and wrap `pollardRho(n)` in a loop that tries increasing constant `c = 1, 2, 3, ...` if `gcd == n`!',
    },
  ],
  timeComplexity: 'Miller-Rabin: O(7 * log^3 N) | Pollard Rho: O(N^(1/4)) expected',
  spaceComplexity: 'O(log N) recursion stack',
  pitfalls: [
    {
      type: 'WA',
      title: '64-Bit Overflow Inside Modular Multiplication (a * b) % mod When mod ~ 10^18',
      detail:
        'Computing `(a * b) % n` in standard 64-bit `unsigned long long` overflows IMMEDIATELY when `a, b ~ 10^{18}` (`10^{36} >> 2^{64}`)! In C++20 ALWAYS cast `(__uint128_t)a * b % n`; in Rust cast `(a as u128 * b as u128 % n as u128) as u64`; in Java 21 use `BigInteger.valueOf(a).multiply(BigInteger.valueOf(b)).mod(...)` or unsigned `modMul`!',
    },
    {
      type: 'WA',
      title: 'Skipping Base Check `a % n == 0` in Fixed-Base Miller-Rabin',
      detail:
        'If `n` divides one of the 7 witness bases (for instance `n = 1795265022` or prime factors of `325` like `5` or `13`), `a % n == 0` makes `powMod(a, d, n) == 0`, falsely flagging `n` as composite unless you add **`if (a % n == 0) continue;`** at the top of the base loop!',
    },
    {
      type: 'TLE',
      title: 'Calling __gcd(abs(x - y), n) on Every Single Step of Pollard Rho',
      detail:
        'Computing `gcd` on every step adds an `O(log N)` factor to every hop. **Brent’s batched GCD** multiplies `128` differences `q = mulMod(q, diff, n)` and takes `gcd(q, n)` only once per `128` steps (stopping early if `q == 0`!), cutting runtime by 5–10x!',
    },
    {
      type: 'TLE',
      title: 'Running Pollard Rho Without Factoring Out `n % 2 == 0` First',
      detail:
        'On `n = 4`, standard `f(x) = x^2 + 1` with `x0 = 2` can stall or return `d == n` repeatedly! Checking `if (n % 2 == 0) return 2;` before entering Pollard Rho eliminates even composites and guarantees `n` is odd and `>= 9`.',
    },
  ],
  implementations: {
    cpp20: `#include <bits/stdc++.h>
using namespace std;

// Deterministic 64-bit Miller-Rabin + Brent's Pollard Rho Factorization in O(N^(1/4))
using u64 = uint64_t;
using u128 = __uint128_t;

u64 mulMod(u64 a, u64 b, u64 m) {
    return (u64)((u128)a * b % m);
}

u64 powMod(u64 base, u64 exp, u64 m) {
    u64 res = 1;
    base %= m;
    while (exp > 0) {
        if (exp & 1) res = mulMod(res, base, m);
        base = mulMod(base, base, m);
        exp >>= 1;
    }
    return res;
}

bool isPrime(u64 n) {
    if (n < 2) return false;
    static const u64 bases[] = {2, 325, 9375, 28178, 450775, 9780504, 1795265022};
    u64 d = n - 1;
    int s = countr_zero(d);
    d >>= s;
    for (u64 a : bases) {
        if (a % n == 0) continue;
        u64 x = powMod(a, d, n);
        if (x == 1 || x == n - 1) continue;
        bool composite = true;
        for (int r = 1; r < s; r++) {
            x = mulMod(x, x, n);
            if (x == n - 1) {
                composite = false;
                break;
            }
        }
        if (composite) return false;
    }
    return true;
}

u64 pollardBrent(u64 n) {
    if ((n & 1ULL) == 0) return 2;
    static mt19937_64 rng(chrono::steady_clock::now().time_since_epoch().count());
    while (true) {
        u64 c = rng() % (n - 1) + 1;
        u64 y = rng() % (n - 1) + 1;
        u64 m = 128, g = 1, r = 1, q = 1;
        u64 x = 0, ys = 0;
        auto f = [&](u64 v) { return (mulMod(v, v, n) + c) % n; };

        while (g == 1) {
            x = y;
            for (u64 i = 0; i < r; i++) y = f(y);
            u64 k = 0;
            while (k < r && g == 1) {
                ys = y;
                u64 lim = min(m, r - k);
                for (u64 i = 0; i < lim; i++) {
                    y = f(y);
                    u64 diff = x > y ? x - y : y - x;
                    q = mulMod(q, diff, n);
                }
                g = std::gcd(q, n);
                k += m;
            }
            r <<= 1;
        }
        if (g == n) {
            do {
                ys = f(ys);
                u64 diff = x > ys ? x - ys : ys - x;
                g = std::gcd(diff, n);
            } while (g == 1);
        }
        if (g != n) return g;
    }
}

void factorize(u64 n, vector<u64>& out) {
    if (n <= 1) return;
    if (isPrime(n)) {
        out.push_back(n);
        return;
    }
    u64 d = pollardBrent(n);
    factorize(d, out);
    factorize(n / d, out);
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int q;
    if (!(cin >> q)) return 0;
    while (q--) {
        u64 n;
        cin >> n;
        vector<u64> fac;
        factorize(n, fac);
        sort(fac.begin(), fac.end());
        cout << fac.size();
        for (u64 p : fac) cout << " " << p;
        cout << "\\n";
    }
    return 0;
}`,
    rust: `use std::io::{self, Read};

fn gcd(mut a: u64, mut b: u64) -> u64 {
    while b != 0 {
        let t = a % b;
        a = b;
        b = t;
    }
    a
}

fn mul_mod(a: u64, b: u64, m: u64) -> u64 {
    ((a as u128 * b as u128) % m as u128) as u64
}

fn pow_mod(mut base: u64, mut exp: u64, m: u64) -> u64 {
    let mut res = 1u64;
    base %= m;
    while exp > 0 {
        if (exp & 1) == 1 {
            res = mul_mod(res, base, m);
        }
        base = mul_mod(base, base, m);
        exp >>= 1;
    }
    res
}

fn is_prime(n: u64) -> bool {
    if n < 2 {
        return false;
    }
    const BASES: [u64; 7] = [2, 325, 9375, 28178, 450775, 9780504, 1795265022];
    let s = (n - 1).trailing_zeros();
    let d = (n - 1) >> s;
    for &a in &BASES {
        if a % n == 0 {
            continue;
        }
        let mut x = pow_mod(a, d, n);
        if x == 1 || x == n - 1 {
            continue;
        }
        let mut composite = true;
        for _ in 1..s {
            x = mul_mod(x, x, n);
            if x == n - 1 {
                composite = false;
                break;
            }
        }
        if composite {
            return false;
        }
    }
    true
}

fn pollard_brent(n: u64, rng: &mut u64) -> u64 {
    if n % 2 == 0 {
        return 2;
    }
    loop {
        *rng ^= *rng << 13;
        *rng ^= *rng >> 7;
        *rng ^= *rng << 17;
        let c = *rng % (n - 1) + 1;
        *rng ^= *rng << 13;
        *rng ^= *rng >> 7;
        *rng ^= *rng << 17;
        let mut y = *rng % (n - 1) + 1;

        let mut g = 1u64;
        let mut r = 1u64;
        let mut q = 1u64;
        let mut x = 0u64;
        let mut ys = 0u64;
        let f = |v: u64| -> u64 {
            let sq = mul_mod(v, v, n);
            let res = sq as u128 + c as u128;
            (res % n as u128) as u64
        };

        while g == 1 {
            x = y;
            for _ in 0..r {
                y = f(y);
            }
            let mut k = 0u64;
            while k < r && g == 1 {
                ys = y;
                let lim = 128.min(r - k);
                for _ in 0..lim {
                    y = f(y);
                    let diff = if x > y { x - y } else { y - x };
                    q = mul_mod(q, diff, n);
                }
                g = gcd(q, n);
                k += 128;
            }
            r <<= 1;
        }
        if g == n {
            loop {
                ys = f(ys);
                let diff = if x > ys { x - ys } else { ys - x };
                g = gcd(diff, n);
                if g > 1 {
                    break;
                }
            }
        }
        if g != n {
            return g;
        }
    }
}

fn factorize(n: u64, rng: &mut u64, out: &mut Vec<u64>) {
    if n <= 1 {
        return;
    }
    if is_prime(n) {
        out.push(n);
        return;
    }
    let d = pollard_brent(n, rng);
    factorize(d, rng, out);
    factorize(n / d, rng, out);
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let q: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };

    let mut rng = 0x9e3779b97f4a7c15u64;
    let mut out = String::new();
    for _ in 0..q {
        let n: u64 = it.next().unwrap().parse().unwrap();
        let mut fac = Vec::new();
        factorize(n, &mut rng, &mut fac);
        fac.sort_unstable();
        out.push_str(&format!("{}", fac.len()));
        for p in fac {
            out.push_str(&format!(" {}", p));
        }
        out.push('\\n');
    }
    print!("{}", out);
}`,
    java21: `import java.io.IOException;
import java.io.InputStream;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.SplittableRandom;

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

    static long mulMod(long a, long b, long m) {
        return BigInteger.valueOf(a).multiply(BigInteger.valueOf(b)).mod(BigInteger.valueOf(m)).longValue();
    }

    static long powMod(long base, long exp, long m) {
        long res = 1;
        base %= m;
        while (exp > 0) {
            if ((exp & 1L) == 1L) res = mulMod(res, base, m);
            base = mulMod(base, base, m);
            exp >>>= 1;
        }
        return res;
    }

    static boolean isPrime(long n) {
        if (n < 2) return false;
        long[] bases = {2L, 325L, 9375L, 28178L, 450775L, 9780504L, 1795265022L};
        int s = Long.numberOfTrailingZeros(n - 1);
        long d = (n - 1) >>> s;
        for (long a : bases) {
            if (a % n == 0) continue;
            long x = powMod(a, d, n);
            if (x == 1 || x == n - 1) continue;
            boolean comp = true;
            for (int r = 1; r < s; r++) {
                x = mulMod(x, x, n);
                if (x == n - 1) { comp = false; break; }
            }
            if (comp) return false;
        }
        return true;
    }

    static long gcd(long a, long b) {
        while (b != 0) { long t = a % b; a = b; b = t; }
        return a;
    }

    static final SplittableRandom rng = new SplittableRandom(42);

    static long pollardBrent(long n) {
        if ((n & 1L) == 0) return 2;
        while (true) {
            long c = rng.nextLong(1, n);
            long y = rng.nextLong(1, n);
            long g = 1, r = 1, q = 1, x = 0, ys = 0;
            while (g == 1) {
                x = y;
                for (long i = 0; i < r; i++) y = (mulMod(y, y, n) + c) % n;
                long k = 0;
                while (k < r && g == 1) {
                    ys = y;
                    long lim = Math.min(128L, r - k);
                    for (long i = 0; i < lim; i++) {
                        y = (mulMod(y, y, n) + c) % n;
                        q = mulMod(q, Math.abs(x - y), n);
                    }
                    g = gcd(q, n);
                    k += 128;
                }
                r <<= 1;
            }
            if (g == n) {
                do {
                    ys = (mulMod(ys, ys, n) + c) % n;
                    g = gcd(Math.abs(x - ys), n);
                } while (g == 1);
            }
            if (g != n) return g;
        }
    }

    static void factorize(long n, List<Long> out) {
        if (n <= 1) return;
        if (isPrime(n)) { out.add(n); return; }
        long d = pollardBrent(n);
        factorize(d, out);
        factorize(n / d, out);
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        long qIn = fs.nextLong();
        if (qIn == Long.MIN_VALUE) return;
        int q = (int) qIn;

        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < q; i++) {
            long n = fs.nextLong();
            List<Long> fac = new ArrayList<>();
            factorize(n, fac);
            Collections.sort(fac);
            sb.append(fac.size());
            for (long p : fac) sb.append(' ').append(p);
            sb.append('\\n');
        }
        System.out.print(sb);
    }
}`,
    python3: `import math
import random
import sys

sys.setrecursionlimit(200000)

BASES = (2, 325, 9375, 28178, 450775, 9780504, 1795265022)

def is_prime(n: int) -> bool:
    if n < 2:
        return False
    d = n - 1
    s = (d & -d).bit_length() - 1
    d >>= s
    for a in BASES:
        if a % n == 0:
            continue
        x = pow(a, d, n)
        if x == 1 or x == n - 1:
            continue
        for _ in range(s - 1):
            x = (x * x) % n
            if x == n - 1:
                break
        else:
            return False
    return True

def pollard_brent(n: int) -> int:
    if n % 2 == 0:
        return 2
    while True:
        y = random.randrange(1, n)
        c = random.randrange(1, n)
        m = 128
        g = r = q = 1
        x = ys = 0
        while g == 1:
            x = y
            for _ in range(r):
                y = (y * y + c) % n
            k = 0
            while k < r and g == 1:
                ys = y
                for _ in range(min(m, r - k)):
                    y = (y * y + c) % n
                    q = (q * abs(x - y)) % n
                g = math.gcd(q, n)
                k += m
            r <<= 1
        if g == n:
            while True:
                ys = (ys * ys + c) % n
                g = math.gcd(abs(x - ys), n)
                if g > 1:
                    break
        if g != n:
            return g

def factorize(n: int, out: list) -> None:
    if n <= 1:
        return
    if is_prime(n):
        out.append(n)
        return
    d = pollard_brent(n)
    factorize(d, out)
    factorize(n // d, out)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    q = int(data[0])
    out = []
    for i in range(1, q + 1):
        n = int(data[i])
        fac = []
        factorize(n, fac)
        fac.sort()
        out.append(" ".join([str(len(fac))] + list(map(str, fac))))
    sys.stdout.write("\\n".join(out) + "\\n")

if __name__ == "__main__":
    solve()`,
    ruby: `BASES = [2, 325, 9375, 28178, 450775, 9780504, 1795265022].freeze

def prime64?(n)
  return false if n < 2
  d = n - 1
  s = 0
  while d.even?
    d >>= 1
    s += 1
  end
  BASES.each do |a|
    next if (a % n) == 0
    x = a.pow(d, n)
    next if x == 1 || x == n - 1
    comp = true
    (s - 1).times do
      x = (x * x) % n
      if x == n - 1
        comp = false
        break
      end
    end
    return false if comp
  end
  true
end

def pollard_brent(n)
  return 2 if n.even?
  loop do
    y = rand(1...n)
    c = rand(1...n)
    m = 128
    g = 1; r = 1; q = 1
    x = 0; ys = 0
    while g == 1
      x = y
      r.times { y = (y * y + c) % n }
      k = 0
      while k < r && g == 1
        ys = y
        [m, r - k].min.times do
          y = (y * y + c) % n
          q = (q * (x - y).abs) % n
        end
        g = q.gcd(n)
        k += m
      end
      r <<= 1
    end
    if g == n
      loop do
        ys = (ys * ys + c) % n
        g = (x - ys).abs.gcd(n)
        break if g > 1
      end
    end
    return g if g != n
  end
end

def factorize(n, out)
  return if n <= 1
  if prime64?(n)
    out << n
    return
  end
  d = pollard_brent(n)
  factorize(d, out)
  factorize(n / d, out)
end

tokens = $stdin.read.split
exit if tokens.empty?
q = tokens[0].to_i
out = []
(1..q).each do |i|
  n = tokens[i].to_i
  fac = []
  factorize(n, fac)
  fac.sort!
  out << ([fac.length] + fac).join(' ')
end
puts out.join("\\n")`,
  },
  practiceProblems: [
    {
      id: 'ch52-p1',
      tier: 'Warmup',
      ratingRange: '2000–2200',
      title: 'Deterministic 64-Bit Primality Testing for Q <= 10^5 Queries',
      statement:
        'Given `Q` integers (`1 <= N <= 10^18`), output `Yes` if `N` is prime and `No` otherwise, guaranteeing zero false positives across all 64-bit integers.',
      constraints: '1 <= Q <= 10^5, 1 <= N <= 10^18',
      sampleInput: '4\n2\n15\n998244353\n999999999999999989',
      sampleOutput: 'Yes\nNo\nYes\nYes',
      hints: [
        'Use the 7 deterministic witness bases `{2, 325, 9375, 28178, 450775, 9780504, 1795265022}` with 128-bit modular multiplication.',
        'Don’t forget `if (a % n == 0) continue;` so small primes like `2` or `5` (dividing `325`) are never falsely rejected!',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

using u64 = uint64_t;
using u128 = __uint128_t;

u64 mulMod(u64 a, u64 b, u64 m) { return (u64)((u128)a * b % m); }

u64 powMod(u64 a, u64 e, u64 m) {
    u64 r = 1;
    a %= m;
    while (e > 0) {
        if (e & 1) r = mulMod(r, a, m);
        a = mulMod(a, a, m);
        e >>= 1;
    }
    return r;
}

bool isPrime(u64 n) {
    if (n < 2) return false;
    static const u64 bases[] = {2, 325, 9375, 28178, 450775, 9780504, 1795265022};
    u64 d = n - 1;
    int s = countr_zero(d);
    d >>= s;
    for (u64 a : bases) {
        if (a % n == 0) continue;
        u64 x = powMod(a, d, n);
        if (x == 1 || x == n - 1) continue;
        bool ok = false;
        for (int r = 1; r < s; r++) {
            x = mulMod(x, x, n);
            if (x == n - 1) { ok = true; break; }
        }
        if (!ok) return false;
    }
    return true;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int q;
    if (!(cin >> q)) return 0;
    while (q--) {
        u64 n;
        cin >> n;
        cout << (isPrime(n) ? "Yes" : "No") << "\\n";
    }
    return 0;
}`,
        rust: `use std::io::{self, Read};

fn mul_mod(a: u64, b: u64, m: u64) -> u64 {
    ((a as u128 * b as u128) % m as u128) as u64
}

fn pow_mod(mut a: u64, mut e: u64, m: u64) -> u64 {
    let mut r = 1u64;
    a %= m;
    while e > 0 {
        if (e & 1) == 1 { r = mul_mod(r, a, m); }
        a = mul_mod(a, a, m);
        e >>= 1;
    }
    r
}

fn is_prime(n: u64) -> bool {
    if n < 2 { return false; }
    const BASES: [u64; 7] = [2, 325, 9375, 28178, 450775, 9780504, 1795265022];
    let s = (n - 1).trailing_zeros();
    let d = (n - 1) >> s;
    for &a in &BASES {
        if a % n == 0 { continue; }
        let mut x = pow_mod(a, d, n);
        if x == 1 || x == n - 1 { continue; }
        let mut ok = false;
        for _ in 1..s {
            x = mul_mod(x, x, n);
            if x == n - 1 { ok = true; break; }
        }
        if !ok { return false; }
    }
    true
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let q: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };
    let mut out = String::new();
    for _ in 0..q {
        let n: u64 = it.next().unwrap().parse().unwrap();
        out.push_str(if is_prime(n) { "Yes\\n" } else { "No\\n" });
    }
    print!("{}", out);
}`,
        java21: `import java.io.IOException;
import java.io.InputStream;
import java.math.BigInteger;

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

    static long mulMod(long a, long b, long m) {
        return BigInteger.valueOf(a).multiply(BigInteger.valueOf(b)).mod(BigInteger.valueOf(m)).longValue();
    }

    static long powMod(long a, long e, long m) {
        long r = 1;
        a %= m;
        while (e > 0) {
            if ((e & 1L) == 1L) r = mulMod(r, a, m);
            a = mulMod(a, a, m);
            e >>>= 1;
        }
        return r;
    }

    static boolean isPrime(long n) {
        if (n < 2) return false;
        long[] bases = {2L, 325L, 9375L, 28178L, 450775L, 9780504L, 1795265022L};
        int s = Long.numberOfTrailingZeros(n - 1);
        long d = (n - 1) >>> s;
        for (long a : bases) {
            if (a % n == 0) continue;
            long x = powMod(a, d, n);
            if (x == 1 || x == n - 1) continue;
            boolean ok = false;
            for (int r = 1; r < s; r++) {
                x = mulMod(x, x, n);
                if (x == n - 1) { ok = true; break; }
            }
            if (!ok) return false;
        }
        return true;
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        long qIn = fs.nextLong();
        if (qIn == Long.MIN_VALUE) return;
        int q = (int) qIn;
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < q; i++) {
            sb.append(isPrime(fs.nextLong()) ? "Yes\\n" : "No\\n");
        }
        System.out.print(sb);
    }
}`,
        python3: `import sys

sys.setrecursionlimit(200000)

BASES = (2, 325, 9375, 28178, 450775, 9780504, 1795265022)

def is_prime(n: int) -> bool:
    if n < 2:
        return False
    d = n - 1
    s = (d & -d).bit_length() - 1
    d >>= s
    for a in BASES:
        if a % n == 0:
            continue
        x = pow(a, d, n)
        if x == 1 or x == n - 1:
            continue
        for _ in range(s - 1):
            x = (x * x) % n
            if x == n - 1:
                break
        else:
            return False
    return True

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    q = int(data[0])
    out = ["Yes" if is_prime(int(data[i])) else "No" for i in range(1, q + 1)]
    sys.stdout.write("\\n".join(out) + "\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `BASES = [2, 325, 9375, 28178, 450775, 9780504, 1795265022].freeze

def prime64?(n)
  return false if n < 2
  d = n - 1
  s = 0
  while d.even?
    d >>= 1
    s += 1
  end
  BASES.each do |a|
    next if (a % n) == 0
    x = a.pow(d, n)
    next if x == 1 || x == n - 1
    ok = false
    (s - 1).times do
      x = (x * x) % n
      if x == n - 1
        ok = true
        break
      end
    end
    return false unless ok
  end
  true
end

tokens = $stdin.read.split
exit if tokens.empty?
q = tokens[0].to_i
puts (1..q).map { |i| prime64?(tokens[i].to_i) ? "Yes" : "No" }.join("\\n")`,
      },
    },
    {
      id: 'ch52-p2',
      tier: 'Standard',
      ratingRange: '2150–2400',
      title: 'Full Prime Factorization of 64-Bit Integers via Pollard Rho',
      statement:
        'Given `Q` positive integers (`1 <= N <= 10^18`), output the sorted prime factorization of each `N` in `O(N^(1/4))` time per query: print the total number of prime factors (with multiplicity) followed by the primes in non-decreasing order.',
      constraints: '1 <= Q <= 100, 1 <= N <= 10^18',
      sampleInput: '2\n60\n97',
      sampleOutput: '4 2 2 3 5\n1 97',
      hints: [
        'Handle `n <= 1` and `isPrime(n)` as recursion base cases; otherwise split `n` into `d` and `n / d` using Brent’s batched Pollard Rho.',
        'Sort the resulting prime list before printing so repeated prime factors appear adjacent and ascending!',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

using u64 = uint64_t;
using u128 = __uint128_t;

u64 mulMod(u64 a, u64 b, u64 m) { return (u64)((u128)a * b % m); }
u64 powMod(u64 a, u64 e, u64 m) {
    u64 r = 1; a %= m;
    while (e) { if (e & 1) r = mulMod(r, a, m); a = mulMod(a, a, m); e >>= 1; }
    return r;
}

bool isPrime(u64 n) {
    if (n < 2) return false;
    static const u64 bases[] = {2, 325, 9375, 28178, 450775, 9780504, 1795265022};
    u64 d = n - 1; int s = countr_zero(d); d >>= s;
    for (u64 a : bases) {
        if (a % n == 0) continue;
        u64 x = powMod(a, d, n);
        if (x == 1 || x == n - 1) continue;
        bool ok = false;
        for (int r = 1; r < s; r++) {
            x = mulMod(x, x, n);
            if (x == n - 1) { ok = true; break; }
        }
        if (!ok) return false;
    }
    return true;
}

u64 rho(u64 n) {
    if (!(n & 1ULL)) return 2;
    static mt19937_64 rng(1337);
    while (true) {
        u64 c = rng() % (n - 1) + 1, y = rng() % (n - 1) + 1;
        u64 g = 1, r = 1, q = 1, x = 0, ys = 0;
        auto f = [&](u64 v) { return (mulMod(v, v, n) + c) % n; };
        while (g == 1) {
            x = y;
            for (u64 i = 0; i < r; i++) y = f(y);
            u64 k = 0;
            while (k < r && g == 1) {
                ys = y;
                for (u64 i = 0; i < min<u64>(128, r - k); i++) {
                    y = f(y);
                    q = mulMod(q, x > y ? x - y : y - x, n);
                }
                g = std::gcd(q, n);
                k += 128;
            }
            r <<= 1;
        }
        if (g == n) {
            do {
                ys = f(ys);
                g = std::gcd(x > ys ? x - ys : ys - x, n);
            } while (g == 1);
        }
        if (g != n) return g;
    }
}

void factor(u64 n, vector<u64>& out) {
    if (n <= 1) return;
    if (isPrime(n)) { out.push_back(n); return; }
    u64 d = rho(n);
    factor(d, out);
    factor(n / d, out);
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int q;
    if (!(cin >> q)) return 0;
    while (q--) {
        u64 n;
        cin >> n;
        vector<u64> fac;
        factor(n, fac);
        sort(fac.begin(), fac.end());
        cout << fac.size();
        for (u64 p : fac) cout << " " << p;
        cout << "\\n";
    }
    return 0;
}`,
        rust: `use std::io::{self, Read};

fn gcd(mut a: u64, mut b: u64) -> u64 {
    while b != 0 { let t = a % b; a = b; b = t; }
    a
}
fn mul_mod(a: u64, b: u64, m: u64) -> u64 { ((a as u128 * b as u128) % m as u128) as u64 }
fn pow_mod(mut a: u64, mut e: u64, m: u64) -> u64 {
    let mut r = 1; a %= m;
    while e > 0 { if (e & 1) == 1 { r = mul_mod(r, a, m); } a = mul_mod(a, a, m); e >>= 1; }
    r
}
fn is_prime(n: u64) -> bool {
    if n < 2 { return false; }
    const BASES: [u64; 7] = [2, 325, 9375, 28178, 450775, 9780504, 1795265022];
    let s = (n - 1).trailing_zeros();
    let d = (n - 1) >> s;
    for &a in &BASES {
        if a % n == 0 { continue; }
        let mut x = pow_mod(a, d, n);
        if x == 1 || x == n - 1 { continue; }
        let mut ok = false;
        for _ in 1..s { x = mul_mod(x, x, n); if x == n - 1 { ok = true; break; } }
        if !ok { return false; }
    }
    true
}
fn rho(n: u64, rng: &mut u64) -> u64 {
    if n % 2 == 0 { return 2; }
    loop {
        *rng = rng.wrapping_mul(6364136223846793005).wrapping_add(1442695040888963407);
        let c = *rng % (n - 1) + 1;
        *rng = rng.wrapping_mul(6364136223846793005).wrapping_add(1442695040888963407);
        let mut y = *rng % (n - 1) + 1;
        let (mut g, mut r, mut q, mut x, mut ys) = (1, 1, 1, 0, 0);
        let f = |v: u64| (((v as u128 * v as u128 + c as u128) % n as u128) as u64);
        while g == 1 {
            x = y;
            for _ in 0..r { y = f(y); }
            let mut k = 0;
            while k < r && g == 1 {
                ys = y;
                for _ in 0..128.min(r - k) {
                    y = f(y);
                    q = mul_mod(q, x.abs_diff(y), n);
                }
                g = gcd(q, n);
                k += 128;
            }
            r <<= 1;
        }
        if g == n {
            loop { ys = f(ys); g = gcd(x.abs_diff(ys), n); if g > 1 { break; } }
        }
        if g != n { return g; }
    }
}
fn factor(n: u64, rng: &mut u64, out: &mut Vec<u64>) {
    if n <= 1 { return; }
    if is_prime(n) { out.push(n); return; }
    let d = rho(n, rng);
    factor(d, rng, out);
    factor(n / d, rng, out);
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let q: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };
    let mut rng = 1337u64;
    let mut out = String::new();
    for _ in 0..q {
        let n: u64 = it.next().unwrap().parse().unwrap();
        let mut fac = Vec::new();
        factor(n, &mut rng, &mut fac);
        fac.sort_unstable();
        out.push_str(&format!("{}", fac.len()));
        for p in fac { out.push_str(&format!(" {}", p)); }
        out.push('\\n');
    }
    print!("{}", out);
}`,
        java21: `import java.io.IOException;
import java.io.InputStream;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.SplittableRandom;

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

    static long mulMod(long a, long b, long m) {
        return BigInteger.valueOf(a).multiply(BigInteger.valueOf(b)).mod(BigInteger.valueOf(m)).longValue();
    }
    static long powMod(long a, long e, long m) {
        long r = 1; a %= m;
        while (e > 0) { if ((e & 1L) == 1L) r = mulMod(r, a, m); a = mulMod(a, a, m); e >>>= 1; }
        return r;
    }
    static boolean isPrime(long n) {
        if (n < 2) return false;
        long[] bases = {2L, 325L, 9375L, 28178L, 450775L, 9780504L, 1795265022L};
        int s = Long.numberOfTrailingZeros(n - 1);
        long d = (n - 1) >>> s;
        for (long a : bases) {
            if (a % n == 0) continue;
            long x = powMod(a, d, n);
            if (x == 1 || x == n - 1) continue;
            boolean ok = false;
            for (int r = 1; r < s; r++) { x = mulMod(x, x, n); if (x == n - 1) { ok = true; break; } }
            if (!ok) return false;
        }
        return true;
    }
    static long gcd(long a, long b) { while (b != 0) { long t = a % b; a = b; b = t; } return a; }
    static final SplittableRandom rng = new SplittableRandom(1337);

    static long rho(long n) {
        if ((n & 1L) == 0) return 2;
        while (true) {
            long c = rng.nextLong(1, n), y = rng.nextLong(1, n);
            long g = 1, r = 1, q = 1, x = 0, ys = 0;
            while (g == 1) {
                x = y;
                for (long i = 0; i < r; i++) y = (mulMod(y, y, n) + c) % n;
                long k = 0;
                while (k < r && g == 1) {
                    ys = y;
                    for (long i = 0; i < Math.min(128L, r - k); i++) {
                        y = (mulMod(y, y, n) + c) % n;
                        q = mulMod(q, Math.abs(x - y), n);
                    }
                    g = gcd(q, n);
                    k += 128;
                }
                r <<= 1;
            }
            if (g == n) {
                do { ys = (mulMod(ys, ys, n) + c) % n; g = gcd(Math.abs(x - ys), n); } while (g == 1);
            }
            if (g != n) return g;
        }
    }

    static void factor(long n, List<Long> out) {
        if (n <= 1) return;
        if (isPrime(n)) { out.add(n); return; }
        long d = rho(n);
        factor(d, out);
        factor(n / d, out);
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        long qIn = fs.nextLong();
        if (qIn == Long.MIN_VALUE) return;
        int q = (int) qIn;
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < q; i++) {
            List<Long> fac = new ArrayList<>();
            factor(fs.nextLong(), fac);
            Collections.sort(fac);
            sb.append(fac.size());
            for (long p : fac) sb.append(' ').append(p);
            sb.append('\\n');
        }
        System.out.print(sb);
    }
}`,
        python3: `import math
import random
import sys

sys.setrecursionlimit(200000)

BASES = (2, 325, 9375, 28178, 450775, 9780504, 1795265022)

def is_prime(n: int) -> bool:
    if n < 2:
        return False
    d = n - 1
    s = (d & -d).bit_length() - 1
    d >>= s
    for a in BASES:
        if a % n == 0:
            continue
        x = pow(a, d, n)
        if x == 1 or x == n - 1:
            continue
        for _ in range(s - 1):
            x = (x * x) % n
            if x == n - 1:
                break
        else:
            return False
    return True

def rho(n: int) -> int:
    if n % 2 == 0:
        return 2
    while True:
        y = random.randrange(1, n)
        c = random.randrange(1, n)
        g = r = q = 1
        x = ys = 0
        while g == 1:
            x = y
            for _ in range(r):
                y = (y * y + c) % n
            k = 0
            while k < r and g == 1:
                ys = y
                for _ in range(min(128, r - k)):
                    y = (y * y + c) % n
                    q = (q * abs(x - y)) % n
                g = math.gcd(q, n)
                k += 128
            r <<= 1
        if g == n:
            while True:
                ys = (ys * ys + c) % n
                g = math.gcd(abs(x - ys), n)
                if g > 1:
                    break
        if g != n:
            return g

def factor(n: int, out: list) -> None:
    if n <= 1:
        return
    if is_prime(n):
        out.append(n)
        return
    d = rho(n)
    factor(d, out)
    factor(n // d, out)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    q = int(data[0])
    out = []
    for i in range(1, q + 1):
        fac = []
        factor(int(data[i]), fac)
        fac.sort()
        out.append(" ".join([str(len(fac))] + list(map(str, fac))))
    sys.stdout.write("\\n".join(out) + "\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `BASES = [2, 325, 9375, 28178, 450775, 9780504, 1795265022].freeze

def prime64?(n)
  return false if n < 2
  d = n - 1
  s = 0
  while d.even?
    d >>= 1
    s += 1
  end
  BASES.each do |a|
    next if (a % n) == 0
    x = a.pow(d, n)
    next if x == 1 || x == n - 1
    ok = false
    (s - 1).times do
      x = (x * x) % n
      if x == n - 1; ok = true; break; end
    end
    return false unless ok
  end
  true
end

def rho(n)
  return 2 if n.even?
  loop do
    y = rand(1...n); c = rand(1...n)
    g = 1; r = 1; q = 1; x = 0; ys = 0
    while g == 1
      x = y
      r.times { y = (y * y + c) % n }
      k = 0
      while k < r && g == 1
        ys = y
        [128, r - k].min.times do
          y = (y * y + c) % n
          q = (q * (x - y).abs) % n
        end
        g = q.gcd(n)
        k += 128
      end
      r <<= 1
    end
    if g == n
      loop do
        ys = (ys * ys + c) % n
        g = (x - ys).abs.gcd(n)
        break if g > 1
      end
    end
    return g if g != n
  end
end

def factor(n, out)
  return if n <= 1
  if prime64?(n); out << n; return; end
  d = rho(n)
  factor(d, out)
  factor(n / d, out)
end

tokens = $stdin.read.split
exit if tokens.empty?
q = tokens[0].to_i
puts (1..q).map { |i| fac = []; factor(tokens[i].to_i, fac); fac.sort!; ([fac.length] + fac).join(' ') }.join("\\n")`,
      },
    },
    {
      id: 'ch52-p3',
      tier: 'Boss',
      ratingRange: '2250–2550',
      title: 'Fast Divisor Count tau(N) & Euler Totient phi(N) for N <= 10^18',
      statement:
        'Given `Q` integers up to `10^18`, for each `N` compute in `O(N^(1/4))` time: (1) `tau(N)` — the exact number of positive divisors of `N`, and (2) `phi(N)` — Euler’s Totient function (count of integers in `[1..N]` coprime to `N`).',
      constraints: '1 <= Q <= 100, 1 <= N <= 10^18',
      sampleInput: '2\n12\n36',
      sampleOutput: '6 4\n9 12',
      hints: [
        'Factorize `N` via Pollard’s Rho + Miller-Rabin, sort the prime factors, and group identical primes into pairs `(p, e)`.',
        'Multiply `(e + 1)` across all groups to get `tau(N)`, and compute `phi(N) = phi(N) / p * (p - 1)` for each distinct prime `p` dividing `N`!',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

using u64 = uint64_t;
using u128 = __uint128_t;

u64 mulMod(u64 a, u64 b, u64 m) { return (u64)((u128)a * b % m); }
u64 powMod(u64 a, u64 e, u64 m) {
    u64 r = 1; a %= m;
    while (e) { if (e & 1) r = mulMod(r, a, m); a = mulMod(a, a, m); e >>= 1; }
    return r;
}

bool isPrime(u64 n) {
    if (n < 2) return false;
    static const u64 bases[] = {2, 325, 9375, 28178, 450775, 9780504, 1795265022};
    u64 d = n - 1; int s = countr_zero(d); d >>= s;
    for (u64 a : bases) {
        if (a % n == 0) continue;
        u64 x = powMod(a, d, n);
        if (x == 1 || x == n - 1) continue;
        bool ok = false;
        for (int r = 1; r < s; r++) {
            x = mulMod(x, x, n);
            if (x == n - 1) { ok = true; break; }
        }
        if (!ok) return false;
    }
    return true;
}

u64 rho(u64 n) {
    if (!(n & 1ULL)) return 2;
    static mt19937_64 rng(777);
    while (true) {
        u64 c = rng() % (n - 1) + 1, y = rng() % (n - 1) + 1;
        u64 g = 1, r = 1, q = 1, x = 0, ys = 0;
        auto f = [&](u64 v) { return (mulMod(v, v, n) + c) % n; };
        while (g == 1) {
            x = y;
            for (u64 i = 0; i < r; i++) y = f(y);
            u64 k = 0;
            while (k < r && g == 1) {
                ys = y;
                for (u64 i = 0; i < min<u64>(128, r - k); i++) {
                    y = f(y);
                    q = mulMod(q, x > y ? x - y : y - x, n);
                }
                g = std::gcd(q, n);
                k += 128;
            }
            r <<= 1;
        }
        if (g == n) {
            do {
                ys = f(ys);
                g = std::gcd(x > ys ? x - ys : ys - x, n);
            } while (g == 1);
        }
        if (g != n) return g;
    }
}

void factor(u64 n, vector<u64>& out) {
    if (n <= 1) return;
    if (isPrime(n)) { out.push_back(n); return; }
    u64 d = rho(n);
    factor(d, out);
    factor(n / d, out);
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int q;
    if (!(cin >> q)) return 0;
    while (q--) {
        u64 n;
        cin >> n;
        vector<u64> fac;
        factor(n, fac);
        sort(fac.begin(), fac.end());
        u64 tau = 1, phi = n;
        for (size_t i = 0; i < fac.size();) {
            size_t j = i;
            while (j < fac.size() && fac[j] == fac[i]) j++;
            tau *= (j - i + 1);
            phi = (phi / fac[i]) * (fac[i] - 1);
            i = j;
        }
        cout << tau << " " << phi << "\\n";
    }
    return 0;
}`,
        rust: `use std::io::{self, Read};

fn gcd(mut a: u64, mut b: u64) -> u64 {
    while b != 0 { let t = a % b; a = b; b = t; }
    a
}
fn mul_mod(a: u64, b: u64, m: u64) -> u64 { ((a as u128 * b as u128) % m as u128) as u64 }
fn pow_mod(mut a: u64, mut e: u64, m: u64) -> u64 {
    let mut r = 1; a %= m;
    while e > 0 { if (e & 1) == 1 { r = mul_mod(r, a, m); } a = mul_mod(a, a, m); e >>= 1; }
    r
}
fn is_prime(n: u64) -> bool {
    if n < 2 { return false; }
    const BASES: [u64; 7] = [2, 325, 9375, 28178, 450775, 9780504, 1795265022];
    let s = (n - 1).trailing_zeros();
    let d = (n - 1) >> s;
    for &a in &BASES {
        if a % n == 0 { continue; }
        let mut x = pow_mod(a, d, n);
        if x == 1 || x == n - 1 { continue; }
        let mut ok = false;
        for _ in 1..s { x = mul_mod(x, x, n); if x == n - 1 { ok = true; break; } }
        if !ok { return false; }
    }
    true
}
fn rho(n: u64, rng: &mut u64) -> u64 {
    if n % 2 == 0 { return 2; }
    loop {
        *rng = rng.wrapping_mul(6364136223846793005).wrapping_add(1442695040888963407);
        let c = *rng % (n - 1) + 1;
        *rng = rng.wrapping_mul(6364136223846793005).wrapping_add(1442695040888963407);
        let mut y = *rng % (n - 1) + 1;
        let (mut g, mut r, mut q, mut x, mut ys) = (1, 1, 1, 0, 0);
        let f = |v: u64| (((v as u128 * v as u128 + c as u128) % n as u128) as u64);
        while g == 1 {
            x = y;
            for _ in 0..r { y = f(y); }
            let mut k = 0;
            while k < r && g == 1 {
                ys = y;
                for _ in 0..128.min(r - k) { y = f(y); q = mul_mod(q, x.abs_diff(y), n); }
                g = gcd(q, n);
                k += 128;
            }
            r <<= 1;
        }
        if g == n {
            loop { ys = f(ys); g = gcd(x.abs_diff(ys), n); if g > 1 { break; } }
        }
        if g != n { return g; }
    }
}
fn factor(n: u64, rng: &mut u64, out: &mut Vec<u64>) {
    if n <= 1 { return; }
    if is_prime(n) { out.push(n); return; }
    let d = rho(n, rng);
    factor(d, rng, out);
    factor(n / d, rng, out);
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let q: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };
    let mut rng = 777u64;
    let mut out = String::new();
    for _ in 0..q {
        let n: u64 = it.next().unwrap().parse().unwrap();
        let mut fac = Vec::new();
        factor(n, &mut rng, &mut fac);
        fac.sort_unstable();
        let mut tau = 1u64;
        let mut phi = n;
        let mut i = 0;
        while i < fac.len() {
            let mut j = i;
            while j < fac.len() && fac[j] == fac[i] { j += 1; }
            tau *= (j - i + 1) as u64;
            phi = (phi / fac[i]) * (fac[i] - 1);
            i = j;
        }
        out.push_str(&format!("{} {}\\n", tau, phi));
    }
    print!("{}", out);
}`,
        java21: `import java.io.IOException;
import java.io.InputStream;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.SplittableRandom;

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

    static long mulMod(long a, long b, long m) {
        return BigInteger.valueOf(a).multiply(BigInteger.valueOf(b)).mod(BigInteger.valueOf(m)).longValue();
    }
    static long powMod(long a, long e, long m) {
        long r = 1; a %= m;
        while (e > 0) { if ((e & 1L) == 1L) r = mulMod(r, a, m); a = mulMod(a, a, m); e >>>= 1; }
        return r;
    }
    static boolean isPrime(long n) {
        if (n < 2) return false;
        long[] bases = {2L, 325L, 9375L, 28178L, 450775L, 9780504L, 1795265022L};
        int s = Long.numberOfTrailingZeros(n - 1);
        long d = (n - 1) >>> s;
        for (long a : bases) {
            if (a % n == 0) continue;
            long x = powMod(a, d, n);
            if (x == 1 || x == n - 1) continue;
            boolean ok = false;
            for (int r = 1; r < s; r++) { x = mulMod(x, x, n); if (x == n - 1) { ok = true; break; } }
            if (!ok) return false;
        }
        return true;
    }
    static long gcd(long a, long b) { while (b != 0) { long t = a % b; a = b; b = t; } return a; }
    static final SplittableRandom rng = new SplittableRandom(777);

    static long rho(long n) {
        if ((n & 1L) == 0) return 2;
        while (true) {
            long c = rng.nextLong(1, n), y = rng.nextLong(1, n);
            long g = 1, r = 1, q = 1, x = 0, ys = 0;
            while (g == 1) {
                x = y;
                for (long i = 0; i < r; i++) y = (mulMod(y, y, n) + c) % n;
                long k = 0;
                while (k < r && g == 1) {
                    ys = y;
                    for (long i = 0; i < Math.min(128L, r - k); i++) {
                        y = (mulMod(y, y, n) + c) % n;
                        q = mulMod(q, Math.abs(x - y), n);
                    }
                    g = gcd(q, n);
                    k += 128;
                }
                r <<= 1;
            }
            if (g == n) {
                do { ys = (mulMod(ys, ys, n) + c) % n; g = gcd(Math.abs(x - ys), n); } while (g == 1);
            }
            if (g != n) return g;
        }
    }

    static void factor(long n, List<Long> out) {
        if (n <= 1) return;
        if (isPrime(n)) { out.add(n); return; }
        long d = rho(n);
        factor(d, out);
        factor(n / d, out);
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        long qIn = fs.nextLong();
        if (qIn == Long.MIN_VALUE) return;
        int q = (int) qIn;
        StringBuilder sb = new StringBuilder();
        for (int qi = 0; qi < q; qi++) {
            long n = fs.nextLong();
            List<Long> fac = new ArrayList<>();
            factor(n, fac);
            Collections.sort(fac);
            long tau = 1, phi = n;
            for (int i = 0; i < fac.size();) {
                int j = i;
                while (j < fac.size() && fac.get(j).equals(fac.get(i))) j++;
                tau *= (j - i + 1);
                phi = (phi / fac.get(i)) * (fac.get(i) - 1);
                i = j;
            }
            sb.append(tau).append(' ').append(phi).append('\\n');
        }
        System.out.print(sb);
    }
}`,
        python3: `import math
import random
import sys

sys.setrecursionlimit(200000)

BASES = (2, 325, 9375, 28178, 450775, 9780504, 1795265022)

def is_prime(n: int) -> bool:
    if n < 2:
        return False
    d = n - 1
    s = (d & -d).bit_length() - 1
    d >>= s
    for a in BASES:
        if a % n == 0:
            continue
        x = pow(a, d, n)
        if x == 1 or x == n - 1:
            continue
        for _ in range(s - 1):
            x = (x * x) % n
            if x == n - 1:
                break
        else:
            return False
    return True

def rho(n: int) -> int:
    if n % 2 == 0:
        return 2
    while True:
        y = random.randrange(1, n)
        c = random.randrange(1, n)
        g = r = q = 1
        x = ys = 0
        while g == 1:
            x = y
            for _ in range(r):
                y = (y * y + c) % n
            k = 0
            while k < r and g == 1:
                ys = y
                for _ in range(min(128, r - k)):
                    y = (y * y + c) % n
                    q = (q * abs(x - y)) % n
                g = math.gcd(q, n)
                k += 128
            r <<= 1
        if g == n:
            while True:
                ys = (ys * ys + c) % n
                g = math.gcd(abs(x - ys), n)
                if g > 1:
                    break
        if g != n:
            return g

def factor(n: int, out: list) -> None:
    if n <= 1:
        return
    if is_prime(n):
        out.append(n)
        return
    d = rho(n)
    factor(d, out)
    factor(n // d, out)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    q = int(data[0])
    out = []
    for qi in range(1, q + 1):
        n = int(data[qi])
        fac = []
        factor(n, fac)
        fac.sort()
        tau = 1
        phi = n
        i = 0
        while i < len(fac):
            j = i
            while j < len(fac) and fac[j] == fac[i]:
                j += 1
            tau *= (j - i + 1)
            phi = (phi // fac[i]) * (fac[i] - 1)
            i = j
        out.append(f"{tau} {phi}")
    sys.stdout.write("\\n".join(out) + "\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `BASES = [2, 325, 9375, 28178, 450775, 9780504, 1795265022].freeze

def prime64?(n)
  return false if n < 2
  d = n - 1; s = 0
  while d.even?; d >>= 1; s += 1; end
  BASES.each do |a|
    next if (a % n) == 0
    x = a.pow(d, n)
    next if x == 1 || x == n - 1
    ok = false
    (s - 1).times do
      x = (x * x) % n
      if x == n - 1; ok = true; break; end
    end
    return false unless ok
  end
  true
end

def rho(n)
  return 2 if n.even?
  loop do
    y = rand(1...n); c = rand(1...n)
    g = 1; r = 1; q = 1; x = 0; ys = 0
    while g == 1
      x = y
      r.times { y = (y * y + c) % n }
      k = 0
      while k < r && g == 1
        ys = y
        [128, r - k].min.times do
          y = (y * y + c) % n
          q = (q * (x - y).abs) % n
        end
        g = q.gcd(n)
        k += 128
      end
      r <<= 1
    end
    if g == n
      loop do
        ys = (ys * ys + c) % n
        g = (x - ys).abs.gcd(n)
        break if g > 1
      end
    end
    return g if g != n
  end
end

def factor(n, out)
  return if n <= 1
  if prime64?(n); out << n; return; end
  d = rho(n)
  factor(d, out)
  factor(n / d, out)
end

tokens = $stdin.read.split
exit if tokens.empty?
q = tokens[0].to_i
out = []
(1..q).each do |qi|
  n = tokens[qi].to_i
  fac = []
  factor(n, fac)
  fac.sort!
  tau = 1
  phi = n
  i = 0
  while i < fac.length
    j = i
    j += 1 while j < fac.length && fac[j] == fac[i]
    tau *= (j - i + 1)
    phi = (phi / fac[i]) * (fac[i] - 1)
    i = j
  end
  out << "#{tau} #{phi}"
end
puts out.join("\\n")`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'AtCoder',
      title: 'Library Checker — Primality Test / Factorize',
      difficulty: '2200',
      url: 'https://judge.yosupo.jp/problem/factorize',
      patternNote: 'Standard 100 x 10^18 integer factorization benchmark for Brent Pollard Rho.',
    },
    {
      platform: 'Codeforces',
      title: 'Gcd and Lcm / Divisors (1033D)',
      difficulty: '2000',
      url: 'https://codeforces.com/problemset/problem/1033/D',
      patternNote: 'Combine 64-bit Miller-Rabin / Pollard Rho or exact root extraction with GCD splitting.',
    },
    {
      platform: 'CSES',
      title: 'Divisor Analysis / Exponentiation II',
      difficulty: 'Gold–Platinum',
      url: 'https://cses.fi/problemset/task/2182',
      patternNote: 'Compute tau(N), sigma(N), and phi(N) directly from prime power decompositions.',
    },
    {
      platform: 'CodeChef',
      title: 'Prime Generator / Pollard Factorization',
      difficulty: '2150',
      url: 'https://www.codechef.com/problems/FACTORIZ',
      patternNote: 'Factor huge integers quickly using trial division for small primes + Brent Rho.',
    },
    {
      platform: 'HackerRank',
      title: 'Project Euler #216 / Huge Prime Checks',
      difficulty: 'Hard',
      url: 'https://www.hackerrank.com/challenges',
      patternNote: 'Run deterministic 7-base Miller-Rabin over 10^5+ candidates in milliseconds.',
    },
    {
      platform: 'NeetCode 150',
      title: 'Count Primes (64-Bit Scaling)',
      difficulty: 'Medium -> Plat',
      url: 'https://neetcode.io/practice',
      patternNote: 'Scale beyond O(N log log N) sieves to 10^18 individual primality tests.',
    },
  ],
  interviewNotes: [
    'Why do `{2, 325, 9375, 28178, 450775, 9780504, 1795265022}` guarantee zero errors up to `2^64 - 1`? Exhaustive computational verification proved no 64-bit strong pseudoprime survives all 7 witnesses simultaneously.',
    'Always guard `if (a % n == 0) continue;` before running Miller-Rabin exponentiation; otherwise prime factors of `325` (`5, 13`) evaluate `a^d == 0 (mod n)` instead of `1` or `n - 1`.',
    'In C++/Rust, `__uint128_t` / `u128` is essential inside `mulMod(a, b, n)` because `n <= 2^64` causes `a * b` to reach `2^{128}` before `% n`.',
  ],
  projectBlueprint: {
    title: 'Cryptographic Key-Strength Auditor & Semi-Prime Factorizer',
    tagline:
      'High-speed BigInt primality and modulus factoring scanner certifying 64-bit primes deterministically and detecting weak composite RSA moduli via Brent’s Pollard Rho.',
    stackSummary: 'TypeScript / Node.js with Native BigInt Miller-Rabin & Brent Batched Rho',
    asciiDiagram: `[Input Modulus N <= 2^64] -> [7-Base Miller-Rabin] --(Prime)--> [Certify Prime]
                                      |
                                 (Composite)
                                      v
                        [Brent Pollard Rho O(N^1/4)] -> [Sorted Prime Factors & phi(N)]`,
    milestones: [
      {
        id: 'm1',
        title: 'Deterministic 64-Bit Miller-Rabin Engine',
        detail: 'Implement modular exponentiation over BigInt with the 7 deterministic witness bases.',
      },
      {
        id: 'm2',
        title: 'Brent Batched Pollard Rho Factorizer',
        detail: 'Amortize GCD overhead every 128 iterations to split 64-bit composites in <2ms.',
      },
      {
        id: 'm3',
        title: 'Key-Strength Totient & Divisor Report',
        detail: 'Output full prime factorization, tau(N), and Euler Totient phi(N) for every audited modulus.',
      },
    ],
    starterCode: `const BASES = [2n, 325n, 9375n, 28178n, 450775n, 9780504n, 1795265022n];

function powMod(base: bigint, exp: bigint, mod: bigint): bigint {
  let res = 1n;
  base %= mod;
  while (exp > 0n) {
    if (exp & 1n) res = (res * base) % mod;
    base = (base * base) % mod;
    exp >>= 1n;
  }
  return res;
}

export function isPrime64(n: bigint): boolean {
  if (n < 2n) return false;
  let d = n - 1n;
  let s = 0;
  while ((d & 1n) === 0n) {
    d >>= 1n;
    s++;
  }
  for (const a of BASES) {
    if (a % n === 0n) continue;
    let x = powMod(a, d, n);
    if (x === 1n || x === n - 1n) continue;
    let ok = false;
    for (let r = 1; r < s; r++) {
      x = (x * x) % n;
      if (x === n - 1n) { ok = true; break; }
    }
    if (!ok) return false;
  }
  return true;
}

console.log('999999999999999989 prime?', isPrime64(999999999999999989n));`,
  },
};
