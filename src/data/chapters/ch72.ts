import type { TheoryChapter } from '../../types/vault';

export const CH72_FORMAL_POWER_SERIES: TheoryChapter = {
  slug: 'formal-power-series-generating-functions',
  topicId: 'ma-56',
  title: 'Formal Power Series (FPS): Inv, Ln, Exp & Sqrt',
  domain: 'Math, Number Theory & Algebra',
  ratingTier: '2600–3300+',
  usacoDivision: 'Advanced',
  subtitle: 'Newton-Raphson polynomial doubling over NTT (mod 998244353) for O(N log N) inverse, logarithm, exponential, square root, and Bostan-Mori linear recurrences',
  analogyTitle: 'Hensel Lifting Power Series Precision Twofold Every Iteration',
  analogyBody:
    'Formal Power Series treat infinite sequences a_0, a_1, a_2, ... as algebraic objects A(x) = sum a_k x^k modulo x^N without worrying about analytic convergence. Just as Newton-Raphson doubles the number of accurate decimal digits of 1/c or sqrt(c) at every step, Newton iteration over the ring F_p[[x]] doubles the modulus from x^m to x^{2m} per step.\n\nIf B(x) satisfies F(B) = 0 mod x^m, then B_next = B - F(B)/F\'(B) mod x^{2m} automatically agrees with the exact root up to x^{2m - 1} because (B - B_exact)^2 is divisible by x^{2m}. Since each doubling step costs a small constant number of NTT convolutions of length 2m, geometric series sum_{k} O(2^k k) collapses the total cost of Inv, Sqrt, Exp, and Power to O(N log N) rather than O(N log^2 N).\n\nBeyond inverse and exponential generating functions (which turn unlabeled integer partitions and labeled connected graphs into clean O(N log N) polynomial operations), pairing FPS rational fractions P(x)/Q(x) with the Bostan-Mori odd-even reflection Q(x)Q(-x) collapses [x^N] P(x)/Q(x) for N <= 10^18 down to O(K log K log N).',
  prerequisites: [
    { slug: 'fft-ntt-polynomial-convolution', title: 'FFT, NTT (998244353) & Arbitrary-Mod Convolution' },
  ],
  traceTitle: 'Newton Doubling for B(x) = A(x)^{-1} mod x^4',
  traceSubtitle: 'Tracking B_{2m} = B_m * (2 - A * B_m) mod x^{2m} on A(x) = 1 + 2x + 3x^2 + 4x^3 (mod 998244353)',
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Base Case Mod x^1: B_1 = A[0]^{-1}',
      explanation: 'Since A[0] = 1, B_1(x) = [1] is exact modulo x^1. Double modulus to x^2 next.',
      mode: 'array',
      arrays: [
        {
          name: 'B_1 mod x^1',
          cells: [
            { index: 0, value: 1, label: 'x^0', highlight: 'active' },
            { index: 1, value: 0, label: 'x^1', highlight: 'neutral' },
            { index: 2, value: 0, label: 'x^2', highlight: 'neutral' },
            { index: 3, value: 0, label: 'x^3', highlight: 'neutral' },
          ],
        },
      ],
      variables: { m: 1, targetMod: 'x^2', A0_inv: 1 },
    },
    {
      stepNumber: 2,
      title: 'Step m=1 -> 2: Compute B_2 = B_1(2 - A * B_1) mod x^2',
      explanation: 'Truncate A to x^2: 1 + 2x. Then (2 - (1 + 2x)*1) = 1 - 2x, so B_2 = [1, -2] mod 998244353 = [1, 998244351]. Check: (1+2x)(1-2x) = 1 - 4x^2 == 1 mod x^2.',
      mode: 'array',
      arrays: [
        {
          name: 'B_2 mod x^2',
          cells: [
            { index: 0, value: 1, label: '1', highlight: 'neutral' },
            { index: 1, value: 998244351, label: '-2', highlight: 'updated' },
            { index: 2, value: 0, label: 'x^2', highlight: 'neutral' },
            { index: 3, value: 0, label: 'x^3', highlight: 'neutral' },
          ],
        },
      ],
      variables: { m: 2, targetMod: 'x^4', checkModX2: '1 + 0x' },
    },
    {
      stepNumber: 3,
      title: 'Step m=2 -> 4: Compute B_4 = B_2(2 - A * B_2) mod x^4',
      explanation: 'Multiply A_4 * B_2 = (1 + 2x + 3x^2 + 4x^3)(1 - 2x) = 1 - x^2 - 2x^3 mod x^4. Subtract from 2: 1 + x^2 + 2x^3. Multiply by B_2: (1 - 2x)(1 + x^2 + 2x^3) = 1 - 2x + x^2 + 0x^3 mod x^4.',
      mode: 'array',
      arrays: [
        {
          name: 'B_4 = 1 / (1 + 2x + 3x^2 + 4x^3) mod x^4',
          cells: [
            { index: 0, value: 1, label: '1', highlight: 'neutral' },
            { index: 1, value: 998244351, label: '-2', highlight: 'neutral' },
            { index: 2, value: 1, label: '+1', highlight: 'updated' },
            { index: 3, value: 0, label: '0', highlight: 'updated' },
          ],
        },
      ],
      variables: { m: 4, checkModX4: '(1+2x+3x^2+4x^3)(1-2x+x^2) = 1 mod x^4', ops: '2 NTT passes' },
    },
  ],
  reductionClues: [
    {
      clue: 'Count integer partitions, DAGs, connected labeled graphs, or unlabeled trees up to N <= 2e5 mod 998244353',
      translation: 'Formulate the Generating Function (OGF or EGF) differential/exponential identity, then apply polyLn / polyExp / polySqrt in O(N log N).',
    },
    {
      clue: 'Compute [x^N] P(x) / Q(x) for N <= 10^18 and deg Q <= 10^5 (linear recurrence k-th term beyond matrix expo)',
      translation: 'Use Bostan-Mori: multiply top and bottom by Q(-x), keep even/odd terms of P(x)Q(-x) according to N & 1, halve N, repeating O(log N) times.',
    },
    {
      clue: 'Compute A(x)^K mod x^N for huge K (including negative or fractional exponents mod 998244353)',
      translation: 'Strip trailing zeros (x^v), normalize constant term c = A[v], compute exp(K * ln(A / c)) and multiply by c^K, handling K mod P appropriately.',
    },
    {
      clue: 'Evaluate product_{i=1..M} (1 + a_i x) or sum_{i=1..M} w_i / (1 - a_i x) quickly',
      translation: 'Divide-and-conquer product tree in O(M log^2 M), OR take ln(...) = sum ln(1 + a_i x), group identical values or use polyExp after summing O(N log N).',
    },
  ],
  timeComplexity: 'O(N log N) for Inv, Ln, Exp, Sqrt, Pow; O(K log K log N) for Bostan-Mori',
  spaceComplexity: 'O(N) scratch buffers rounded to next power of two >= 2N',
  pitfalls: [
    {
      type: 'WA',
      title: 'Missing Constant-Term Preconditions for Ln, Exp, and Inv',
      detail: 'polyInv requires A[0] != 0; polyLn requires A[0] == 1; polyExp requires A[0] == 0. For polyPow(A, k), if A[0] == 0 you must shift by the smallest nonzero index t: k * t >= N immediately yields the zero polynomial!',
    },
    {
      type: 'WA',
      title: 'Truncating A(x) to m Instead of 2m Inside Newton Iteration',
      detail: 'Inside polyInv and polySqrt doubling from m to 2m, you MUST feed coefficients A[0 .. 2m - 1] (not 0 .. m - 1!) into the product mod x^{2m}; otherwise higher-order terms of A vanish and lift incorrectly.',
    },
    {
      type: 'TLE',
      title: 'Running Length-2N NTT Instead of Length-4m Inside Newton Doubling',
      detail: 'A naive polyExp that calls full length-2N convolutions at every doubling step runs in O(N log^2 N). Always shrink the NTT transform size L = 4m at iteration m so total work sums to O(N log N).',
    },
    {
      type: 'RE',
      title: 'Zero Constant Term or Non-Quadratic-Residue in polySqrt',
      detail: 'If A(x) = x^v * B(x) with v odd or v > 0 while B[0] is not a quadratic residue mod 998244353, no square root exists. When v is even, compute sqrt(B) mod x^{N - v/2} via Tonelli-Shanks on B[0] and shift by v/2.',
    },
  ],
  implementations: {
    cpp20: `#include <algorithm>
#include <iostream>
#include <vector>

using namespace std;

static constexpr long long MOD = 998244353;
static constexpr long long G = 3;

long long modPow(long long base, long long exp) {
    long long res = 1;
    base %= MOD;
    if (base < 0) base += MOD;
    while (exp > 0) {
        if (exp & 1LL) res = res * base % MOD;
        base = base * base % MOD;
        exp >>= 1LL;
    }
    return res;
}

void ntt(vector<long long>& a, bool invert) {
    int n = (int)a.size();
    for (int i = 1, j = 0; i < n; ++i) {
        int bit = n >> 1;
        for (; j & bit; bit >>= 1) j ^= bit;
        j ^= bit;
        if (i < j) swap(a[i], a[j]);
    }
    for (int len = 2; len <= n; len <<= 1) {
        long long wlen = modPow(G, (MOD - 1) / len);
        if (invert) wlen = modPow(wlen, MOD - 2);
        for (int i = 0; i < n; i += len) {
            long long w = 1;
            int half = len >> 1;
            for (int j = 0; j < half; ++j) {
                long long u = a[i + j];
                long long v = a[i + j + half] * w % MOD;
                a[i + j] = (u + v < MOD) ? (u + v) : (u + v - MOD);
                a[i + j + half] = (u - v >= 0) ? (u - v) : (u - v + MOD);
                w = w * wlen % MOD;
            }
        }
    }
    if (invert) {
        long long inv_n = modPow(n, MOD - 2);
        for (long long& x : a) x = x * inv_n % MOD;
    }
}

vector<long long> polyMul(vector<long long> a, vector<long long> b, int limit = -1) {
    if (a.empty() || b.empty()) return {};
    int need = (int)a.size() + (int)b.size() - 1;
    int sz = 1;
    while (sz < need) sz <<= 1;
    a.resize(sz);
    b.resize(sz);
    ntt(a, false);
    ntt(b, false);
    for (int i = 0; i < sz; ++i) a[i] = a[i] * b[i] % MOD;
    ntt(a, true);
    if (limit != -1 && need > limit) need = limit;
    a.resize(need);
    return a;
}

vector<long long> polyInv(const vector<long long>& a, int n) {
    vector<long long> b(1, modPow(a[0], MOD - 2));
    for (int m = 1; m < n; m <<= 1) {
        int lim = min(n, m << 1);
        vector<long long> f(lim, 0);
        for (int i = 0; i < lim && i < (int)a.size(); ++i) f[i] = a[i];
        int sz = 1;
        while (sz < (m << 2)) sz <<= 1;
        f.resize(sz);
        vector<long long> g = b;
        g.resize(sz);
        ntt(f, false);
        ntt(g, false);
        for (int i = 0; i < sz; ++i) {
            long long val = (2 - f[i] * g[i]) % MOD;
            if (val < 0) val += MOD;
            g[i] = g[i] * val % MOD;
        }
        ntt(g, true);
        g.resize(lim);
        b.swap(g);
    }
    b.resize(n);
    return b;
}

vector<long long> polyDeriv(const vector<long long>& a) {
    if ((int)a.size() <= 1) return {};
    vector<long long> d(a.size() - 1);
    for (size_t i = 1; i < a.size(); ++i) d[i - 1] = a[i] * (long long)i % MOD;
    return d;
}

vector<long long> polyInteg(const vector<long long>& a) {
    vector<long long> res(a.size() + 1, 0);
    vector<long long> invs(a.size() + 1, 1);
    for (size_t i = 2; i <= a.size(); ++i) {
        invs[i] = (MOD - MOD / (long long)i) * invs[MOD % i] % MOD;
    }
    for (size_t i = 0; i < a.size(); ++i) res[i + 1] = a[i] * invs[i + 1] % MOD;
    return res;
}

vector<long long> polyLn(const vector<long long>& a, int n) {
    vector<long long> a_lim(n, 0);
    for (int i = 0; i < n && i < (int)a.size(); ++i) a_lim[i] = a[i];
    vector<long long> d = polyDeriv(a_lim);
    vector<long long> inv_a = polyInv(a_lim, n);
    vector<long long> q = polyMul(d, inv_a, n - 1);
    vector<long long> res = polyInteg(q);
    res.resize(n, 0);
    return res;
}

vector<long long> polyExp(const vector<long long>& a, int n) {
    vector<long long> b(1, 1);
    for (int m = 1; m < n; m <<= 1) {
        int lim = min(n, m << 1);
        vector<long long> ln_b = polyLn(b, lim);
        vector<long long> diff(lim, 0);
        for (int i = 0; i < lim; ++i) {
            long long ai = (i < (int)a.size()) ? a[i] : 0;
            diff[i] = (ai - ln_b[i] + MOD) % MOD;
        }
        diff[0] = (diff[0] + 1) % MOD;
        b = polyMul(b, diff, lim);
    }
    b.resize(n);
    return b;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, mode;
    if (!(cin >> n >> mode)) return 0;
    vector<long long> a(n);
    for (int i = 0; i < n; ++i) cin >> a[i];

    // mode 0: Inv(A) mod x^n; mode 1: Ln(A) mod x^n; mode 2: Exp(A) mod x^n
    vector<long long> ans;
    if (mode == 0) ans = polyInv(a, n);
    else if (mode == 1) ans = polyLn(a, n);
    else ans = polyExp(a, n);

    for (int i = 0; i < n; ++i) {
        if (i) cout << ' ';
        cout << ans[i];
    }
    cout << '\\n';
    return 0;
}`,
    rust: `use std::io::{self, Read};

const MOD: i64 = 998_244_353;
const G: i64 = 3;

fn mod_pow(mut base: i64, mut exp: i64) -> i64 {
    let mut res = 1i64;
    base = base.rem_euclid(MOD);
    while exp > 0 {
        if (exp & 1) == 1 {
            res = (res * base) % MOD;
        }
        base = (base * base) % MOD;
        exp >>= 1;
    }
    res
}

fn ntt(a: &mut Vec<i64>, invert: bool) {
    let n = a.len();
    let mut j = 0usize;
    for i in 1..n {
        let mut bit = n >> 1;
        while (j & bit) != 0 {
            j ^= bit;
            bit >>= 1;
        }
        j ^= bit;
        if i < j {
            a.swap(i, j);
        }
    }
    let mut len = 2usize;
    while len <= n {
        let mut wlen = mod_pow(G, (MOD - 1) / (len as i64));
        if invert {
            wlen = mod_pow(wlen, MOD - 2);
        }
        let half = len >> 1;
        for i in (0..n).step_by(len) {
            let mut w = 1i64;
            for k in 0..half {
                let u = a[i + k];
                let v = (a[i + k + half] * w) % MOD;
                let sum = u + v;
                a[i + k] = if sum >= MOD { sum - MOD } else { sum };
                let diff = u - v;
                a[i + k + half] = if diff < 0 { diff + MOD } else { diff };
                w = (w * wlen) % MOD;
            }
        }
        len <<= 1;
    }
    if invert {
        let inv_n = mod_pow(n as i64, MOD - 2);
        for x in a.iter_mut() {
            *x = (*x * inv_n) % MOD;
        }
    }
}

fn poly_mul(mut a: Vec<i64>, mut b: Vec<i64>, limit: usize) -> Vec<i64> {
    if a.is_empty() || b.is_empty() || limit == 0 {
        return Vec::new();
    }
    let need = a.len() + b.len() - 1;
    let mut sz = 1usize;
    while sz < need {
        sz <<= 1;
    }
    a.resize(sz, 0);
    b.resize(sz, 0);
    ntt(&mut a, false);
    ntt(&mut b, false);
    for i in 0..sz {
        a[i] = (a[i] * b[i]) % MOD;
    }
    ntt(&mut a, true);
    a.truncate(need.min(limit));
    a
}

fn poly_inv(a: &[i64], n: usize) -> Vec<i64> {
    let mut b = vec![mod_pow(a[0], MOD - 2)];
    let mut m = 1usize;
    while m < n {
        let lim = n.min(m << 1);
        let mut sz = 1usize;
        while sz < (m << 2) {
            sz <<= 1;
        }
        let mut f = vec![0i64; sz];
        for i in 0..lim.min(a.len()) {
            f[i] = a[i];
        }
        let mut g = b.clone();
        g.resize(sz, 0);
        ntt(&mut f, false);
        ntt(&mut g, false);
        for i in 0..sz {
            let val = (2 - (f[i] * g[i]) % MOD + MOD) % MOD;
            g[i] = (g[i] * val) % MOD;
        }
        ntt(&mut g, true);
        g.truncate(lim);
        b = g;
        m <<= 1;
    }
    b.resize(n, 0);
    b
}

fn poly_ln(a: &[i64], n: usize) -> Vec<i64> {
    if n <= 1 {
        return vec![0; n];
    }
    let mut d = vec![0i64; n - 1];
    for i in 1..n.min(a.len()) {
        d[i - 1] = (a[i] * (i as i64)) % MOD;
    }
    let inv_a = poly_inv(a, n);
    let q = poly_mul(d, inv_a, n - 1);
    let mut invs = vec![1i64; n];
    for i in 2..n {
        invs[i] = (MOD - MOD / (i as i64)) * invs[(MOD as usize) % i] % MOD;
    }
    let mut res = vec![0i64; n];
    for i in 0..q.len() {
        res[i + 1] = (q[i] * invs[i + 1]) % MOD;
    }
    res
}

fn poly_exp(a: &[i64], n: usize) -> Vec<i64> {
    let mut b = vec![1i64];
    let mut m = 1usize;
    while m < n {
        let lim = n.min(m << 1);
        let ln_b = poly_ln(&b, lim);
        let mut diff = vec![0i64; lim];
        for i in 0..lim {
            let ai = if i < a.len() { a[i] } else { 0 };
            diff[i] = (ai - ln_b[i] + MOD) % MOD;
        }
        diff[0] = (diff[0] + 1) % MOD;
        b = poly_mul(b, diff, lim);
        m <<= 1;
    }
    b.resize(n, 0);
    b
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let n: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };
    let mode: usize = it.next().unwrap().parse().unwrap();
    let mut a = vec![0i64; n];
    for x in a.iter_mut() {
        *x = it.next().unwrap().parse().unwrap();
    }
    let ans = match mode {
        0 => poly_inv(&a, n),
        1 => poly_ln(&a, n),
        _ => poly_exp(&a, n),
    };
    let out: Vec<String> = ans.iter().map(|v| v.to_string()).collect();
    println!("{}", out.join(" "));
}`,
    java21: `import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;

public class Main {
    static final long MOD = 998244353L;
    static final long G = 3L;

    static final class FastScanner {
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
            int c;
            do {
                c = readByte();
                if (c == -1) return Long.MIN_VALUE;
            } while (c <= ' ');
            long sign = 1;
            if (c == '-') {
                sign = -1;
                c = readByte();
            }
            long val = 0;
            while (c > ' ') {
                val = val * 10 + (c - '0');
                c = readByte();
            }
            return val * sign;
        }

        int nextInt() throws IOException {
            return (int) nextLong();
        }
    }

    static long modPow(long base, long exp) {
        long res = 1L;
        base = ((base % MOD) + MOD) % MOD;
        while (exp > 0) {
            if ((exp & 1L) != 0) res = (res * base) % MOD;
            base = (base * base) % MOD;
            exp >>= 1;
        }
        return res;
    }

    static void ntt(long[] a, boolean invert) {
        int n = a.length;
        for (int i = 1, j = 0; i < n; i++) {
            int bit = n >> 1;
            for (; (j & bit) != 0; bit >>= 1) j ^= bit;
            j ^= bit;
            if (i < j) {
                long t = a[i];
                a[i] = a[j];
                a[j] = t;
            }
        }
        for (int len = 2; len <= n; len <<= 1) {
            long wlen = modPow(G, (MOD - 1) / len);
            if (invert) wlen = modPow(wlen, MOD - 2);
            int half = len >> 1;
            for (int i = 0; i < n; i += len) {
                long w = 1L;
                for (int j = 0; j < half; j++) {
                    long u = a[i + j];
                    long v = (a[i + j + half] * w) % MOD;
                    long sum = u + v;
                    a[i + j] = sum >= MOD ? sum - MOD : sum;
                    long diff = u - v;
                    a[i + j + half] = diff < 0 ? diff + MOD : diff;
                    w = (w * wlen) % MOD;
                }
            }
        }
        if (invert) {
            long invN = modPow(n, MOD - 2);
            for (int i = 0; i < n; i++) a[i] = (a[i] * invN) % MOD;
        }
    }

    static long[] polyMul(long[] a, long[] b, int limit) {
        if (a.length == 0 || b.length == 0 || limit == 0) return new long[0];
        int need = a.length + b.length - 1;
        int sz = 1;
        while (sz < need) sz <<= 1;
        long[] fa = Arrays.copyOf(a, sz);
        long[] fb = Arrays.copyOf(b, sz);
        ntt(fa, false);
        ntt(fb, false);
        for (int i = 0; i < sz; i++) fa[i] = (fa[i] * fb[i]) % MOD;
        ntt(fa, true);
        return Arrays.copyOf(fa, Math.min(need, limit));
    }

    static long[] polyInv(long[] a, int n) {
        long[] b = new long[]{modPow(a[0], MOD - 2)};
        for (int m = 1; m < n; m <<= 1) {
            int lim = Math.min(n, m << 1);
            int sz = 1;
            while (sz < (m << 2)) sz <<= 1;
            long[] f = new long[sz];
            for (int i = 0; i < lim && i < a.length; i++) f[i] = a[i];
            long[] g = Arrays.copyOf(b, sz);
            ntt(f, false);
            ntt(g, false);
            for (int i = 0; i < sz; i++) {
                long val = (2L - (f[i] * g[i]) % MOD + MOD) % MOD;
                g[i] = (g[i] * val) % MOD;
            }
            ntt(g, true);
            b = Arrays.copyOf(g, lim);
        }
        return Arrays.copyOf(b, n);
    }

    static long[] polyLn(long[] a, int n) {
        if (n <= 1) return new long[n];
        long[] d = new long[n - 1];
        for (int i = 1; i < n && i < a.length; i++) d[i - 1] = (a[i] * i) % MOD;
        long[] invA = polyInv(a, n);
        long[] q = polyMul(d, invA, n - 1);
        long[] invs = new long[n];
        invs[1] = 1;
        for (int i = 2; i < n; i++) invs[i] = (MOD - MOD / i) * invs[(int) (MOD % i)] % MOD;
        long[] res = new long[n];
        for (int i = 0; i < q.length; i++) res[i + 1] = (q[i] * invs[i + 1]) % MOD;
        return res;
    }

    static long[] polyExp(long[] a, int n) {
        long[] b = new long[]{1L};
        for (int m = 1; m < n; m <<= 1) {
            int lim = Math.min(n, m << 1);
            long[] lnB = polyLn(b, lim);
            long[] diff = new long[lim];
            for (int i = 0; i < lim; i++) {
                long ai = i < a.length ? a[i] : 0;
                diff[i] = (ai - lnB[i] + MOD) % MOD;
            }
            diff[0] = (diff[0] + 1) % MOD;
            b = polyMul(b, diff, lim);
        }
        return Arrays.copyOf(b, n);
    }

    public static void main(String[] args) throws Exception {
        FastScanner sc = new FastScanner(System.in);
        int n = sc.nextInt();
        if (n == Integer.MIN_VALUE) return;
        int mode = sc.nextInt();
        long[] a = new long[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextLong();
        long[] ans = mode == 0 ? polyInv(a, n) : (mode == 1 ? polyLn(a, n) : polyExp(a, n));
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) {
            if (i > 0) sb.append(' ');
            sb.append(ans[i]);
        }
        System.out.println(sb.toString());
    }
}`,
    python3: `import sys

MOD = 998244353
G = 3


def ntt(a: list[int], invert: bool) -> None:
    n = len(a)
    j = 0
    for i in range(1, n):
        bit = n >> 1
        while j & bit:
            j ^= bit
            bit >>= 1
        j ^= bit
        if i < j:
            a[i], a[j] = a[j], a[i]

    length = 2
    while length <= n:
        wlen = pow(G, (MOD - 1) // length, MOD)
        if invert:
            wlen = pow(wlen, MOD - 2, MOD)
        half = length >> 1
        for i in range(0, n, length):
            w = 1
            for k in range(half):
                u = a[i + k]
                v = a[i + k + half] * w % MOD
                a[i + k] = (u + v) % MOD
                a[i + k + half] = (u - v) % MOD
                w = w * wlen % MOD
        length <<= 1

    if invert:
        inv_n = pow(n, MOD - 2, MOD)
        for i in range(n):
            a[i] = a[i] * inv_n % MOD


def poly_mul(a: list[int], b: list[int], limit: int) -> list[int]:
    if not a or not b or limit <= 0:
        return []
    need = len(a) + len(b) - 1
    sz = 1
    while sz < need:
        sz <<= 1
    fa = a + [0] * (sz - len(a))
    fb = b + [0] * (sz - len(b))
    ntt(fa, False)
    ntt(fb, False)
    for i in range(sz):
        fa[i] = fa[i] * fb[i] % MOD
    ntt(fa, True)
    return fa[:min(need, limit)]


def poly_inv(a: list[int], n: int) -> list[int]:
    b = [pow(a[0], MOD - 2, MOD)]
    m = 1
    while m < n:
        lim = min(n, m << 1)
        sz = 1
        while sz < (m << 2):
            sz <<= 1
        f = [a[i] if i < len(a) and i < lim else 0 for i in range(sz)]
        g = b + [0] * (sz - len(b))
        ntt(f, False)
        ntt(g, False)
        for i in range(sz):
            g[i] = g[i] * ((2 - f[i] * g[i]) % MOD) % MOD
        ntt(g, True)
        b = g[:lim]
        m <<= 1
    return (b + [0] * n)[:n]


def poly_ln(a: list[int], n: int) -> list[int]:
    if n <= 1:
        return [0] * n
    d = [a[i] * i % MOD for i in range(1, min(n, len(a)))]
    inv_a = poly_inv(a, n)
    q = poly_mul(d, inv_a, n - 1)
    invs = [1] * n
    for i in range(2, n):
        invs[i] = (MOD - MOD // i) * invs[MOD % i] % MOD
    res = [0] * n
    for i, val in enumerate(q):
        res[i + 1] = val * invs[i + 1] % MOD
    return res


def poly_exp(a: list[int], n: int) -> list[int]:
    b = [1]
    m = 1
    while m < n:
        lim = min(n, m << 1)
        ln_b = poly_ln(b, lim)
        diff = [((a[i] if i < len(a) else 0) - ln_b[i]) % MOD for i in range(lim)]
        diff[0] = (diff[0] + 1) % MOD
        b = poly_mul(b, diff, lim)
        m <<= 1
    return (b + [0] * n)[:n]


def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    mode = int(data[1])
    a = [int(x) for x in data[2 : 2 + n]]
    if mode == 0:
        ans = poly_inv(a, n)
    elif mode == 1:
        ans = poly_ln(a, n)
    else:
        ans = poly_exp(a, n)
    sys.stdout.write(" ".join(map(str, ans)) + "\\n")


if __name__ == "__main__":
    solve()`,
    ruby: `MOD = 998_244_353
G = 3

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

def ntt(a, invert)
  n = a.length
  j = 0
  (1...n).each do |i|
    bit = n >> 1
    while (j & bit) != 0
      j ^= bit
      bit >>= 1
    end
    j ^= bit
    a[i], a[j] = a[j], a[i] if i < j
  end
  len = 2
  while len <= n
    wlen = mod_pow(G, (MOD - 1) / len)
    wlen = mod_pow(wlen, MOD - 2) if invert
    half = len >> 1
    i = 0
    while i < n
      w = 1
      k = 0
      while k < half
        u = a[i + k]
        v = (a[i + k + half] * w) % MOD
        a[i + k] = (u + v) % MOD
        a[i + k + half] = (u - v) % MOD
        w = (w * wlen) % MOD
        k += 1
      end
      i += len
    end
    len <<= 1
  end
  if invert
    inv_n = mod_pow(n, MOD - 2)
    a.map! { |x| (x * inv_n) % MOD }
  end
end

def poly_mul(a, b, limit)
  return [] if a.empty? || b.empty? || limit <= 0
  need = a.length + b.length - 1
  sz = 1
  sz <<= 1 while sz < need
  fa = a + Array.new(sz - a.length, 0)
  fb = b + Array.new(sz - b.length, 0)
  ntt(fa, false)
  ntt(fb, false)
  sz.times { |i| fa[i] = (fa[i] * fb[i]) % MOD }
  ntt(fa, true)
  fa[0...[need, limit].min]
end

def poly_inv(a, n)
  b = [mod_pow(a[0], MOD - 2)]
  m = 1
  while m < n
    lim = [n, m << 1].min
    sz = 1
    sz <<= 1 while sz < (m << 2)
    f = Array.new(sz, 0)
    lim.times { |i| f[i] = a[i] if i < a.length }
    g = b + Array.new(sz - b.length, 0)
    ntt(f, false)
    ntt(g, false)
    sz.times do |i|
      g[i] = (g[i] * ((2 - f[i] * g[i]) % MOD)) % MOD
    end
    ntt(g, true)
    b = g[0...lim]
    m <<= 1
  end
  (b + Array.new(n, 0))[0...n]
end

def poly_ln(a, n)
  return Array.new(n, 0) if n <= 1
  d = []
  (1...[n, a.length].min).each { |i| d << (a[i] * i) % MOD }
  inv_a = poly_inv(a, n)
  q = poly_mul(d, inv_a, n - 1)
  invs = Array.new(n, 1)
  (2...n).each { |i| invs[i] = ((MOD - MOD / i) * invs[MOD % i]) % MOD }
  res = Array.new(n, 0)
  q.each_with_index { |val, i| res[i + 1] = (val * invs[i + 1]) % MOD }
  res
end

def poly_exp(a, n)
  b = [1]
  m = 1
  while m < n
    lim = [n, m << 1].min
    ln_b = poly_ln(b, lim)
    diff = Array.new(lim, 0)
    lim.times do |i|
      ai = i < a.length ? a[i] : 0
      diff[i] = (ai - ln_b[i]) % MOD
    end
    diff[0] = (diff[0] + 1) % MOD
    b = poly_mul(b, diff, lim)
    m <<= 1
  end
  (b + Array.new(n, 0))[0...n]
end

tokens = STDIN.read.split
return if tokens.empty?
n = tokens[0].to_i
mode = tokens[1].to_i
a = tokens[2, n].map(&:to_i)
ans = if mode == 0
        poly_inv(a, n)
      elsif mode == 1
        poly_ln(a, n)
      else
        poly_exp(a, n)
      end
puts ans.join(' ')`,
  },
  practiceProblems: [
    {
      id: 'ch72-p1',
      tier: 'Warmup',
      ratingRange: '2400–2700',
      title: 'Polynomial Inverse & Canonical Square Root Modulo x^N',
      statement:
        'Given a polynomial A(x) of degree < N with A[0] != 0 such that A[0] is a quadratic residue modulo 998244353, compute the first N coefficients of both A(x)^{-1} mod x^N and the canonical square root B(x) satisfying B(x)^2 == A(x) mod x^N (choose the smaller square root B[0] < 998244353 - B[0]).',
      constraints: '1 <= N <= 10^5, 0 <= A[i] < 998244353, A[0] is a nonzero quadratic residue mod 998244353',
      sampleInput: `4
1 2 1 0`,
      sampleOutput: `1 998244351 3 998244349
1 1 0 0`,
      hints: [
        'Use Tonelli-Shanks to solve r^2 == A[0] mod P, and set B_1[0] = min(r, P - r).',
        'At doubling step m -> 2m, compute B_{2m} = (B_m + A_{2m} * B_m^{-1}) * inv(2) mod x^{2m}.',
      ],
      solutions: {
        cpp20: `#include <algorithm>
#include <iostream>
#include <vector>

using namespace std;

static constexpr long long MOD = 998244353;
static constexpr long long G = 3;
static constexpr long long INV2 = (MOD + 1) / 2;

long long modPow(long long base, long long exp) {
    long long res = 1;
    base %= MOD;
    if (base < 0) base += MOD;
    while (exp > 0) {
        if (exp & 1LL) res = res * base % MOD;
        base = base * base % MOD;
        exp >>= 1LL;
    }
    return res;
}

long long tonelliShanks(long long n) {
    n %= MOD;
    if (n <= 1) return n;
    long long q = MOD - 1;
    int s = 0;
    while ((q & 1LL) == 0) {
        q >>= 1;
        ++s;
    }
    long long z = 2;
    while (modPow(z, (MOD - 1) / 2) != MOD - 1) ++z;
    long long m = s;
    long long c = modPow(z, q);
    long long t = modPow(n, q);
    long long r = modPow(n, (q + 1) / 2);
    while (t != 1) {
        int i = 1;
        long long tt = t * t % MOD;
        while (tt != 1) {
            tt = tt * tt % MOD;
            ++i;
        }
        long long b = modPow(c, 1LL << (m - i - 1));
        m = i;
        c = b * b % MOD;
        t = t * c % MOD;
        r = r * b % MOD;
    }
    return min(r, MOD - r);
}

void ntt(vector<long long>& a, bool invert) {
    int n = (int)a.size();
    for (int i = 1, j = 0; i < n; ++i) {
        int bit = n >> 1;
        for (; j & bit; bit >>= 1) j ^= bit;
        j ^= bit;
        if (i < j) swap(a[i], a[j]);
    }
    for (int len = 2; len <= n; len <<= 1) {
        long long wlen = modPow(G, (MOD - 1) / len);
        if (invert) wlen = modPow(wlen, MOD - 2);
        int half = len >> 1;
        for (int i = 0; i < n; i += len) {
            long long w = 1;
            for (int j = 0; j < half; ++j) {
                long long u = a[i + j];
                long long v = a[i + j + half] * w % MOD;
                a[i + j] = (u + v < MOD) ? (u + v) : (u + v - MOD);
                a[i + j + half] = (u - v >= 0) ? (u - v) : (u - v + MOD);
                w = w * wlen % MOD;
            }
        }
    }
    if (invert) {
        long long inv_n = modPow(n, MOD - 2);
        for (long long& x : a) x = x * inv_n % MOD;
    }
}

vector<long long> polyMul(vector<long long> a, vector<long long> b, int limit) {
    if (a.empty() || b.empty() || limit <= 0) return {};
    int need = (int)a.size() + (int)b.size() - 1;
    int sz = 1;
    while (sz < need) sz <<= 1;
    a.resize(sz);
    b.resize(sz);
    ntt(a, false);
    ntt(b, false);
    for (int i = 0; i < sz; ++i) a[i] = a[i] * b[i] % MOD;
    ntt(a, true);
    a.resize(min(need, limit));
    return a;
}

vector<long long> polyInv(const vector<long long>& a, int n) {
    vector<long long> b(1, modPow(a[0], MOD - 2));
    for (int m = 1; m < n; m <<= 1) {
        int lim = min(n, m << 1);
        int sz = 1;
        while (sz < (m << 2)) sz <<= 1;
        vector<long long> f(sz, 0);
        for (int i = 0; i < lim && i < (int)a.size(); ++i) f[i] = a[i];
        vector<long long> g = b;
        g.resize(sz, 0);
        ntt(f, false);
        ntt(g, false);
        for (int i = 0; i < sz; ++i) {
            long long val = (2 - f[i] * g[i]) % MOD;
            if (val < 0) val += MOD;
            g[i] = g[i] * val % MOD;
        }
        ntt(g, true);
        g.resize(lim);
        b.swap(g);
    }
    b.resize(n);
    return b;
}

vector<long long> polySqrt(const vector<long long>& a, int n) {
    vector<long long> b(1, tonelliShanks(a[0]));
    for (int m = 1; m < n; m <<= 1) {
        int lim = min(n, m << 1);
        vector<long long> inv_b = polyInv(b, lim);
        vector<long long> a_lim(lim, 0);
        for (int i = 0; i < lim && i < (int)a.size(); ++i) a_lim[i] = a[i];
        vector<long long> q = polyMul(a_lim, inv_b, lim);
        q.resize(lim, 0);
        b.resize(lim, 0);
        for (int i = 0; i < lim; ++i) {
            b[i] = (b[i] + q[i]) % MOD * INV2 % MOD;
        }
    }
    b.resize(n);
    return b;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    if (!(cin >> n)) return 0;
    vector<long long> a(n);
    for (int i = 0; i < n; ++i) cin >> a[i];

    vector<long long> inv = polyInv(a, n);
    vector<long long> sq = polySqrt(a, n);
    for (int i = 0; i < n; ++i) cout << inv[i] << (i + 1 == n ? '\\n' : ' ');
    for (int i = 0; i < n; ++i) cout << sq[i] << (i + 1 == n ? '\\n' : ' ');
    return 0;
}`,
        rust: `use std::io::{self, Read};

const MOD: i64 = 998_244_353;
const G: i64 = 3;
const INV2: i64 = (MOD + 1) / 2;

fn mod_pow(mut base: i64, mut exp: i64) -> i64 {
    let mut res = 1i64;
    base = base.rem_euclid(MOD);
    while exp > 0 {
        if (exp & 1) == 1 {
            res = (res * base) % MOD;
        }
        base = (base * base) % MOD;
        exp >>= 1;
    }
    res
}

fn tonelli_shanks(n: i64) -> i64 {
    let n = n % MOD;
    if n <= 1 {
        return n;
    }
    let mut q = MOD - 1;
    let mut s = 0u32;
    while (q & 1) == 0 {
        q >>= 1;
        s += 1;
    }
    let mut z = 2i64;
    while mod_pow(z, (MOD - 1) / 2) != MOD - 1 {
        z += 1;
    }
    let mut m = s;
    let mut c = mod_pow(z, q);
    let mut t = mod_pow(n, q);
    let mut r = mod_pow(n, (q + 1) / 2);
    while t != 1 {
        let mut i = 1u32;
        let mut tt = (t * t) % MOD;
        while tt != 1 {
            tt = (tt * tt) % MOD;
            i += 1;
        }
        let b = mod_pow(c, 1i64 << (m - i - 1));
        m = i;
        c = (b * b) % MOD;
        t = (t * c) % MOD;
        r = (r * b) % MOD;
    }
    r.min(MOD - r)
}

fn ntt(a: &mut Vec<i64>, invert: bool) {
    let n = a.len();
    let mut j = 0usize;
    for i in 1..n {
        let mut bit = n >> 1;
        while (j & bit) != 0 {
            j ^= bit;
            bit >>= 1;
        }
        j ^= bit;
        if i < j {
            a.swap(i, j);
        }
    }
    let mut len = 2usize;
    while len <= n {
        let mut wlen = mod_pow(G, (MOD - 1) / (len as i64));
        if invert {
            wlen = mod_pow(wlen, MOD - 2);
        }
        let half = len >> 1;
        for i in (0..n).step_by(len) {
            let mut w = 1i64;
            for k in 0..half {
                let u = a[i + k];
                let v = (a[i + k + half] * w) % MOD;
                a[i + k] = (u + v) % MOD;
                a[i + k + half] = (u - v + MOD) % MOD;
                w = (w * wlen) % MOD;
            }
        }
        len <<= 1;
    }
    if invert {
        let inv_n = mod_pow(n as i64, MOD - 2);
        for x in a.iter_mut() {
            *x = (*x * inv_n) % MOD;
        }
    }
}

fn poly_mul(mut a: Vec<i64>, mut b: Vec<i64>, limit: usize) -> Vec<i64> {
    if a.is_empty() || b.is_empty() || limit == 0 {
        return Vec::new();
    }
    let need = a.len() + b.len() - 1;
    let mut sz = 1usize;
    while sz < need {
        sz <<= 1;
    }
    a.resize(sz, 0);
    b.resize(sz, 0);
    ntt(&mut a, false);
    ntt(&mut b, false);
    for i in 0..sz {
        a[i] = (a[i] * b[i]) % MOD;
    }
    ntt(&mut a, true);
    a.truncate(need.min(limit));
    a
}

fn poly_inv(a: &[i64], n: usize) -> Vec<i64> {
    let mut b = vec![mod_pow(a[0], MOD - 2)];
    let mut m = 1usize;
    while m < n {
        let lim = n.min(m << 1);
        let mut sz = 1usize;
        while sz < (m << 2) {
            sz <<= 1;
        }
        let mut f = vec![0i64; sz];
        for i in 0..lim.min(a.len()) {
            f[i] = a[i];
        }
        let mut g = b.clone();
        g.resize(sz, 0);
        ntt(&mut f, false);
        ntt(&mut g, false);
        for i in 0..sz {
            let val = (2 - (f[i] * g[i]) % MOD + MOD) % MOD;
            g[i] = (g[i] * val) % MOD;
        }
        ntt(&mut g, true);
        g.truncate(lim);
        b = g;
        m <<= 1;
    }
    b.resize(n, 0);
    b
}

fn poly_sqrt(a: &[i64], n: usize) -> Vec<i64> {
    let mut b = vec![tonelli_shanks(a[0])];
    let mut m = 1usize;
    while m < n {
        let lim = n.min(m << 1);
        let inv_b = poly_inv(&b, lim);
        let a_lim: Vec<i64> = (0..lim).map(|i| if i < a.len() { a[i] } else { 0 }).collect();
        let mut q = poly_mul(a_lim, inv_b, lim);
        q.resize(lim, 0);
        b.resize(lim, 0);
        for i in 0..lim {
            b[i] = ((b[i] + q[i]) % MOD * INV2) % MOD;
        }
        m <<= 1;
    }
    b.resize(n, 0);
    b
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let n: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };
    let mut a = vec![0i64; n];
    for x in a.iter_mut() {
        *x = it.next().unwrap().parse().unwrap();
    }
    let inv = poly_inv(&a, n);
    let sq = poly_sqrt(&a, n);
    println!("{}", inv.iter().map(|v| v.to_string()).collect::<Vec<_>>().join(" "));
    println!("{}", sq.iter().map(|v| v.to_string()).collect::<Vec<_>>().join(" "));
}`,
        java21: `import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;

public class Main {
    static final long MOD = 998244353L;
    static final long G = 3L;
    static final long INV2 = (MOD + 1) / 2;

    static final class FastScanner {
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
            int c;
            do {
                c = readByte();
                if (c == -1) return Long.MIN_VALUE;
            } while (c <= ' ');
            long val = 0;
            while (c > ' ') {
                val = val * 10 + (c - '0');
                c = readByte();
            }
            return val;
        }

        int nextInt() throws IOException {
            return (int) nextLong();
        }
    }

    static long modPow(long base, long exp) {
        long res = 1L;
        base = ((base % MOD) + MOD) % MOD;
        while (exp > 0) {
            if ((exp & 1L) != 0) res = (res * base) % MOD;
            base = (base * base) % MOD;
            exp >>= 1;
        }
        return res;
    }

    static long tonelliShanks(long n) {
        n %= MOD;
        if (n <= 1) return n;
        long q = MOD - 1;
        int s = 0;
        while ((q & 1L) == 0) {
            q >>= 1;
            s++;
        }
        long z = 2;
        while (modPow(z, (MOD - 1) / 2) != MOD - 1) z++;
        int m = s;
        long c = modPow(z, q);
        long t = modPow(n, q);
        long r = modPow(n, (q + 1) / 2);
        while (t != 1) {
            int i = 1;
            long tt = (t * t) % MOD;
            while (tt != 1) {
                tt = (tt * tt) % MOD;
                i++;
            }
            long b = modPow(c, 1L << (m - i - 1));
            m = i;
            c = (b * b) % MOD;
            t = (t * c) % MOD;
            r = (r * b) % MOD;
        }
        return Math.min(r, MOD - r);
    }

    static void ntt(long[] a, boolean invert) {
        int n = a.length;
        for (int i = 1, j = 0; i < n; i++) {
            int bit = n >> 1;
            for (; (j & bit) != 0; bit >>= 1) j ^= bit;
            j ^= bit;
            if (i < j) {
                long t = a[i];
                a[i] = a[j];
                a[j] = t;
            }
        }
        for (int len = 2; len <= n; len <<= 1) {
            long wlen = modPow(G, (MOD - 1) / len);
            if (invert) wlen = modPow(wlen, MOD - 2);
            int half = len >> 1;
            for (int i = 0; i < n; i += len) {
                long w = 1L;
                for (int j = 0; j < half; j++) {
                    long u = a[i + j];
                    long v = (a[i + j + half] * w) % MOD;
                    a[i + j] = (u + v) % MOD;
                    a[i + j + half] = (u - v + MOD) % MOD;
                    w = (w * wlen) % MOD;
                }
            }
        }
        if (invert) {
            long invN = modPow(n, MOD - 2);
            for (int i = 0; i < n; i++) a[i] = (a[i] * invN) % MOD;
        }
    }

    static long[] polyMul(long[] a, long[] b, int limit) {
        if (a.length == 0 || b.length == 0 || limit == 0) return new long[0];
        int need = a.length + b.length - 1;
        int sz = 1;
        while (sz < need) sz <<= 1;
        long[] fa = Arrays.copyOf(a, sz);
        long[] fb = Arrays.copyOf(b, sz);
        ntt(fa, false);
        ntt(fb, false);
        for (int i = 0; i < sz; i++) fa[i] = (fa[i] * fb[i]) % MOD;
        ntt(fa, true);
        return Arrays.copyOf(fa, Math.min(need, limit));
    }

    static long[] polyInv(long[] a, int n) {
        long[] b = new long[]{modPow(a[0], MOD - 2)};
        for (int m = 1; m < n; m <<= 1) {
            int lim = Math.min(n, m << 1);
            int sz = 1;
            while (sz < (m << 2)) sz <<= 1;
            long[] f = new long[sz];
            for (int i = 0; i < lim && i < a.length; i++) f[i] = a[i];
            long[] g = Arrays.copyOf(b, sz);
            ntt(f, false);
            ntt(g, false);
            for (int i = 0; i < sz; i++) {
                long val = (2L - (f[i] * g[i]) % MOD + MOD) % MOD;
                g[i] = (g[i] * val) % MOD;
            }
            ntt(g, true);
            b = Arrays.copyOf(g, lim);
        }
        return Arrays.copyOf(b, n);
    }

    static long[] polySqrt(long[] a, int n) {
        long[] b = new long[]{tonelliShanks(a[0])};
        for (int m = 1; m < n; m <<= 1) {
            int lim = Math.min(n, m << 1);
            long[] invB = polyInv(b, lim);
            long[] aLim = Arrays.copyOf(a, lim);
            long[] q = polyMul(aLim, invB, lim);
            long[] next = new long[lim];
            for (int i = 0; i < lim; i++) {
                long bi = i < b.length ? b[i] : 0;
                long qi = i < q.length ? q[i] : 0;
                next[i] = ((bi + qi) % MOD * INV2) % MOD;
            }
            b = next;
        }
        return Arrays.copyOf(b, n);
    }

    public static void main(String[] args) throws Exception {
        FastScanner sc = new FastScanner(System.in);
        int n = sc.nextInt();
        if (n == Integer.MIN_VALUE) return;
        long[] a = new long[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextLong();
        long[] inv = polyInv(a, n);
        long[] sq = polySqrt(a, n);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) sb.append(inv[i]).append(i + 1 == n ? '\\n' : ' ');
        for (int i = 0; i < n; i++) sb.append(sq[i]).append(i + 1 == n ? '\\n' : ' ');
        System.out.print(sb.toString());
    }
}`,
        python3: `import sys

MOD = 998244353
G = 3
INV2 = (MOD + 1) // 2


def tonelli_shanks(n: int) -> int:
    n %= MOD
    if n <= 1:
        return n
    q = MOD - 1
    s = 0
    while (q & 1) == 0:
        q >>= 1
        s += 1
    z = 2
    while pow(z, (MOD - 1) // 2, MOD) != MOD - 1:
        z += 1
    m = s
    c = pow(z, q, MOD)
    t = pow(n, q, MOD)
    r = pow(n, (q + 1) // 2, MOD)
    while t != 1:
        i = 1
        tt = t * t % MOD
        while tt != 1:
            tt = tt * tt % MOD
            i += 1
        b = pow(c, 1 << (m - i - 1), MOD)
        m = i
        c = b * b % MOD
        t = t * c % MOD
        r = r * b % MOD
    return min(r, MOD - r)


def ntt(a: list[int], invert: bool) -> None:
    n = len(a)
    j = 0
    for i in range(1, n):
        bit = n >> 1
        while j & bit:
            j ^= bit
            bit >>= 1
        j ^= bit
        if i < j:
            a[i], a[j] = a[j], a[i]
    length = 2
    while length <= n:
        wlen = pow(G, (MOD - 1) // length, MOD)
        if invert:
            wlen = pow(wlen, MOD - 2, MOD)
        half = length >> 1
        for i in range(0, n, length):
            w = 1
            for k in range(half):
                u = a[i + k]
                v = a[i + k + half] * w % MOD
                a[i + k] = (u + v) % MOD
                a[i + k + half] = (u - v) % MOD
                w = w * wlen % MOD
        length <<= 1
    if invert:
        inv_n = pow(n, MOD - 2, MOD)
        for i in range(n):
            a[i] = a[i] * inv_n % MOD


def poly_mul(a: list[int], b: list[int], limit: int) -> list[int]:
    if not a or not b or limit <= 0:
        return []
    need = len(a) + len(b) - 1
    sz = 1
    while sz < need:
        sz <<= 1
    fa = a + [0] * (sz - len(a))
    fb = b + [0] * (sz - len(b))
    ntt(fa, False)
    ntt(fb, False)
    for i in range(sz):
        fa[i] = fa[i] * fb[i] % MOD
    ntt(fa, True)
    return fa[:min(need, limit)]


def poly_inv(a: list[int], n: int) -> list[int]:
    b = [pow(a[0], MOD - 2, MOD)]
    m = 1
    while m < n:
        lim = min(n, m << 1)
        sz = 1
        while sz < (m << 2):
            sz <<= 1
        f = [a[i] if i < len(a) and i < lim else 0 for i in range(sz)]
        g = b + [0] * (sz - len(b))
        ntt(f, False)
        ntt(g, False)
        for i in range(sz):
            g[i] = g[i] * ((2 - f[i] * g[i]) % MOD) % MOD
        ntt(g, True)
        b = g[:lim]
        m <<= 1
    return (b + [0] * n)[:n]


def poly_sqrt(a: list[int], n: int) -> list[int]:
    b = [tonelli_shanks(a[0])]
    m = 1
    while m < n:
        lim = min(n, m << 1)
        inv_b = poly_inv(b, lim)
        a_lim = [a[i] if i < len(a) else 0 for i in range(lim)]
        q = poly_mul(a_lim, inv_b, lim)
        b_pad = b + [0] * (lim - len(b))
        q_pad = q + [0] * (lim - len(q))
        b = [(b_pad[i] + q_pad[i]) * INV2 % MOD for i in range(lim)]
        m <<= 1
    return (b + [0] * n)[:n]


def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    a = [int(x) for x in data[1 : 1 + n]]
    inv = poly_inv(a, n)
    sq = poly_sqrt(a, n)
    sys.stdout.write(" ".join(map(str, inv)) + "\\n")
    sys.stdout.write(" ".join(map(str, sq)) + "\\n")


if __name__ == "__main__":
    solve()`,
        ruby: `MOD = 998_244_353
G = 3
INV2 = (MOD + 1) / 2

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

def tonelli_shanks(n)
  n %= MOD
  return n if n <= 1
  q = MOD - 1
  s = 0
  while (q & 1) == 0
    q >>= 1
    s += 1
  end
  z = 2
  z += 1 while mod_pow(z, (MOD - 1) / 2) != MOD - 1
  m = s
  c = mod_pow(z, q)
  t = mod_pow(n, q)
  r = mod_pow(n, (q + 1) / 2)
  while t != 1
    i = 1
    tt = (t * t) % MOD
    while tt != 1
      tt = (tt * tt) % MOD
      i += 1
    end
    b = mod_pow(c, 1 << (m - i - 1))
    m = i
    c = (b * b) % MOD
    t = (t * c) % MOD
    r = (r * b) % MOD
  end
  [r, MOD - r].min
end

def ntt(a, invert)
  n = a.length
  j = 0
  (1...n).each do |i|
    bit = n >> 1
    while (j & bit) != 0
      j ^= bit
      bit >>= 1
    end
    j ^= bit
    a[i], a[j] = a[j], a[i] if i < j
  end
  len = 2
  while len <= n
    wlen = mod_pow(G, (MOD - 1) / len)
    wlen = mod_pow(wlen, MOD - 2) if invert
    half = len >> 1
    i = 0
    while i < n
      w = 1
      k = 0
      while k < half
        u = a[i + k]
        v = (a[i + k + half] * w) % MOD
        a[i + k] = (u + v) % MOD
        a[i + k + half] = (u - v) % MOD
        w = (w * wlen) % MOD
        k += 1
      end
      i += len
    end
    len <<= 1
  end
  if invert
    inv_n = mod_pow(n, MOD - 2)
    a.map! { |x| (x * inv_n) % MOD }
  end
end

def poly_mul(a, b, limit)
  return [] if a.empty? || b.empty? || limit <= 0
  need = a.length + b.length - 1
  sz = 1
  sz <<= 1 while sz < need
  fa = a + Array.new(sz - a.length, 0)
  fb = b + Array.new(sz - b.length, 0)
  ntt(fa, false)
  ntt(fb, false)
  sz.times { |i| fa[i] = (fa[i] * fb[i]) % MOD }
  ntt(fa, true)
  fa[0...[need, limit].min]
end

def poly_inv(a, n)
  b = [mod_pow(a[0], MOD - 2)]
  m = 1
  while m < n
    lim = [n, m << 1].min
    sz = 1
    sz <<= 1 while sz < (m << 2)
    f = Array.new(sz, 0)
    lim.times { |i| f[i] = a[i] if i < a.length }
    g = b + Array.new(sz - b.length, 0)
    ntt(f, false)
    ntt(g, false)
    sz.times { |i| g[i] = (g[i] * ((2 - f[i] * g[i]) % MOD)) % MOD }
    ntt(g, true)
    b = g[0...lim]
    m <<= 1
  end
  (b + Array.new(n, 0))[0...n]
end

def poly_sqrt(a, n)
  b = [tonelli_shanks(a[0])]
  m = 1
  while m < n
    lim = [n, m << 1].min
    inv_b = poly_inv(b, lim)
    a_lim = Array.new(lim) { |i| i < a.length ? a[i] : 0 }
    q = poly_mul(a_lim, inv_b, lim)
    b = Array.new(lim) { |i| (((i < b.length ? b[i] : 0) + (i < q.length ? q[i] : 0)) * INV2) % MOD }
    m <<= 1
  end
  (b + Array.new(n, 0))[0...n]
end

tokens = STDIN.read.split
return if tokens.empty?
n = tokens[0].to_i
a = tokens[1, n].map(&:to_i)
puts poly_inv(a, n).join(' ')
puts poly_sqrt(a, n).join(' ')`,
      },
    },
    {
      id: 'ch72-p2',
      tier: 'Standard',
      ratingRange: '2600–2900',
      title: 'Partition Function p(1..N) via Logarithmic Derivative & FPS Exp',
      statement:
        'Compute the integer partition counts p(1), p(2), ..., p(N) modulo 998244353 in O(N log N) time, where p(k) is the number of ways to write k as an unordered sum of positive integers.',
      constraints: '1 <= N <= 10^5',
      sampleInput: `6`,
      sampleOutput: `1 2 3 5 7 11`,
      hints: [
        'Use Euler\'s OGF: sum p(k) x^k = prod_{j >= 1} 1 / (1 - x^j).',
        'Take ln of the infinite product: S(x) = sum_{j >= 1} sum_{t >= 1} (1 / t) x^{j*t}, built in O(N log N) via harmonic multiples, then compute exp(S(x)) mod x^{N+1}.',
      ],
      solutions: {
        cpp20: `#include <algorithm>
#include <iostream>
#include <vector>

using namespace std;

static constexpr long long MOD = 998244353;
static constexpr long long G = 3;

long long modPow(long long base, long long exp) {
    long long res = 1;
    base %= MOD;
    while (exp > 0) {
        if (exp & 1LL) res = res * base % MOD;
        base = base * base % MOD;
        exp >>= 1LL;
    }
    return res;
}

void ntt(vector<long long>& a, bool invert) {
    int n = (int)a.size();
    for (int i = 1, j = 0; i < n; ++i) {
        int bit = n >> 1;
        for (; j & bit; bit >>= 1) j ^= bit;
        j ^= bit;
        if (i < j) swap(a[i], a[j]);
    }
    for (int len = 2; len <= n; len <<= 1) {
        long long wlen = modPow(G, (MOD - 1) / len);
        if (invert) wlen = modPow(wlen, MOD - 2);
        int half = len >> 1;
        for (int i = 0; i < n; i += len) {
            long long w = 1;
            for (int j = 0; j < half; ++j) {
                long long u = a[i + j];
                long long v = a[i + j + half] * w % MOD;
                a[i + j] = (u + v < MOD) ? (u + v) : (u + v - MOD);
                a[i + j + half] = (u - v >= 0) ? (u - v) : (u - v + MOD);
                w = w * wlen % MOD;
            }
        }
    }
    if (invert) {
        long long inv_n = modPow(n, MOD - 2);
        for (long long& x : a) x = x * inv_n % MOD;
    }
}

vector<long long> polyMul(vector<long long> a, vector<long long> b, int limit) {
    if (a.empty() || b.empty() || limit <= 0) return {};
    int need = (int)a.size() + (int)b.size() - 1;
    int sz = 1;
    while (sz < need) sz <<= 1;
    a.resize(sz);
    b.resize(sz);
    ntt(a, false);
    ntt(b, false);
    for (int i = 0; i < sz; ++i) a[i] = a[i] * b[i] % MOD;
    ntt(a, true);
    a.resize(min(need, limit));
    return a;
}

vector<long long> polyInv(const vector<long long>& a, int n) {
    vector<long long> b(1, modPow(a[0], MOD - 2));
    for (int m = 1; m < n; m <<= 1) {
        int lim = min(n, m << 1);
        int sz = 1;
        while (sz < (m << 2)) sz <<= 1;
        vector<long long> f(sz, 0);
        for (int i = 0; i < lim && i < (int)a.size(); ++i) f[i] = a[i];
        vector<long long> g = b;
        g.resize(sz, 0);
        ntt(f, false);
        ntt(g, false);
        for (int i = 0; i < sz; ++i) {
            long long val = (2 - f[i] * g[i]) % MOD;
            if (val < 0) val += MOD;
            g[i] = g[i] * val % MOD;
        }
        ntt(g, true);
        g.resize(lim);
        b.swap(g);
    }
    b.resize(n);
    return b;
}

vector<long long> polyLn(const vector<long long>& a, int n, const vector<long long>& invs) {
    if (n <= 1) return vector<long long>(n, 0);
    vector<long long> d(n - 1, 0);
    for (int i = 1; i < n && i < (int)a.size(); ++i) d[i - 1] = a[i] * i % MOD;
    vector<long long> inv_a = polyInv(a, n);
    vector<long long> q = polyMul(d, inv_a, n - 1);
    vector<long long> res(n, 0);
    for (size_t i = 0; i < q.size(); ++i) res[i + 1] = q[i] * invs[i + 1] % MOD;
    return res;
}

vector<long long> polyExp(const vector<long long>& a, int n, const vector<long long>& invs) {
    vector<long long> b(1, 1);
    for (int m = 1; m < n; m <<= 1) {
        int lim = min(n, m << 1);
        vector<long long> ln_b = polyLn(b, lim, invs);
        vector<long long> diff(lim, 0);
        for (int i = 0; i < lim; ++i) {
            long long ai = (i < (int)a.size()) ? a[i] : 0;
            diff[i] = (ai - ln_b[i] + MOD) % MOD;
        }
        diff[0] = (diff[0] + 1) % MOD;
        b = polyMul(b, diff, lim);
    }
    b.resize(n);
    return b;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    if (!(cin >> n)) return 0;
    int sz = n + 1;
    vector<long long> invs(max(2, sz), 1);
    for (int i = 2; i < sz; ++i) invs[i] = (MOD - MOD / i) * invs[MOD % i] % MOD;

    vector<long long> s(sz, 0);
    for (int t = 1; t <= n; ++t) {
        for (int m = t; m <= n; m += t) {
            s[m] = (s[m] + invs[t]) % MOD;
        }
    }

    vector<long long> p = polyExp(s, sz, invs);
    for (int i = 1; i <= n; ++i) {
        cout << p[i] << (i == n ? '\\n' : ' ');
    }
    return 0;
}`,
        rust: `use std::io::{self, Read};

const MOD: i64 = 998_244_353;
const G: i64 = 3;

fn mod_pow(mut base: i64, mut exp: i64) -> i64 {
    let mut res = 1i64;
    base %= MOD;
    while exp > 0 {
        if (exp & 1) == 1 {
            res = (res * base) % MOD;
        }
        base = (base * base) % MOD;
        exp >>= 1;
    }
    res
}

fn ntt(a: &mut Vec<i64>, invert: bool) {
    let n = a.len();
    let mut j = 0usize;
    for i in 1..n {
        let mut bit = n >> 1;
        while (j & bit) != 0 {
            j ^= bit;
            bit >>= 1;
        }
        j ^= bit;
        if i < j {
            a.swap(i, j);
        }
    }
    let mut len = 2usize;
    while len <= n {
        let mut wlen = mod_pow(G, (MOD - 1) / (len as i64));
        if invert {
            wlen = mod_pow(wlen, MOD - 2);
        }
        let half = len >> 1;
        for i in (0..n).step_by(len) {
            let mut w = 1i64;
            for k in 0..half {
                let u = a[i + k];
                let v = (a[i + k + half] * w) % MOD;
                a[i + k] = (u + v) % MOD;
                a[i + k + half] = (u - v + MOD) % MOD;
                w = (w * wlen) % MOD;
            }
        }
        len <<= 1;
    }
    if invert {
        let inv_n = mod_pow(n as i64, MOD - 2);
        for x in a.iter_mut() {
            *x = (*x * inv_n) % MOD;
        }
    }
}

fn poly_mul(mut a: Vec<i64>, mut b: Vec<i64>, limit: usize) -> Vec<i64> {
    if a.is_empty() || b.is_empty() || limit == 0 {
        return Vec::new();
    }
    let need = a.len() + b.len() - 1;
    let mut sz = 1usize;
    while sz < need {
        sz <<= 1;
    }
    a.resize(sz, 0);
    b.resize(sz, 0);
    ntt(&mut a, false);
    ntt(&mut b, false);
    for i in 0..sz {
        a[i] = (a[i] * b[i]) % MOD;
    }
    ntt(&mut a, true);
    a.truncate(need.min(limit));
    a
}

fn poly_inv(a: &[i64], n: usize) -> Vec<i64> {
    let mut b = vec![mod_pow(a[0], MOD - 2)];
    let mut m = 1usize;
    while m < n {
        let lim = n.min(m << 1);
        let mut sz = 1usize;
        while sz < (m << 2) {
            sz <<= 1;
        }
        let mut f = vec![0i64; sz];
        for i in 0..lim.min(a.len()) {
            f[i] = a[i];
        }
        let mut g = b.clone();
        g.resize(sz, 0);
        ntt(&mut f, false);
        ntt(&mut g, false);
        for i in 0..sz {
            let val = (2 - (f[i] * g[i]) % MOD + MOD) % MOD;
            g[i] = (g[i] * val) % MOD;
        }
        ntt(&mut g, true);
        g.truncate(lim);
        b = g;
        m <<= 1;
    }
    b.resize(n, 0);
    b
}

fn poly_ln(a: &[i64], n: usize, invs: &[i64]) -> Vec<i64> {
    if n <= 1 {
        return vec![0; n];
    }
    let mut d = vec![0i64; n - 1];
    for i in 1..n.min(a.len()) {
        d[i - 1] = (a[i] * (i as i64)) % MOD;
    }
    let inv_a = poly_inv(a, n);
    let q = poly_mul(d, inv_a, n - 1);
    let mut res = vec![0i64; n];
    for i in 0..q.len() {
        res[i + 1] = (q[i] * invs[i + 1]) % MOD;
    }
    res
}

fn poly_exp(a: &[i64], n: usize, invs: &[i64]) -> Vec<i64> {
    let mut b = vec![1i64];
    let mut m = 1usize;
    while m < n {
        let lim = n.min(m << 1);
        let ln_b = poly_ln(&b, lim, invs);
        let mut diff = vec![0i64; lim];
        for i in 0..lim {
            let ai = if i < a.len() { a[i] } else { 0 };
            diff[i] = (ai - ln_b[i] + MOD) % MOD;
        }
        diff[0] = (diff[0] + 1) % MOD;
        b = poly_mul(b, diff, lim);
        m <<= 1;
    }
    b.resize(n, 0);
    b
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let n: usize = match input.split_whitespace().next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };
    let sz = n + 1;
    let mut invs = vec![1i64; sz.max(2)];
    for i in 2..sz {
        invs[i] = (MOD - MOD / (i as i64)) * invs[(MOD as usize) % i] % MOD;
    }
    let mut s = vec![0i64; sz];
    for t in 1..=n {
        for m in (t..=n).step_by(t) {
            s[m] = (s[m] + invs[t]) % MOD;
        }
    }
    let p = poly_exp(&s, sz, &invs);
    let out: Vec<String> = p[1..=n].iter().map(|v| v.to_string()).collect();
    println!("{}", out.join(" "));
}`,
        java21: `import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;

public class Main {
    static final long MOD = 998244353L;
    static final long G = 3L;

    static final class FastScanner {
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

        int nextInt() throws IOException {
            int c;
            do {
                c = readByte();
                if (c == -1) return Integer.MIN_VALUE;
            } while (c <= ' ');
            int val = 0;
            while (c > ' ') {
                val = val * 10 + (c - '0');
                c = readByte();
            }
            return val;
        }
    }

    static long modPow(long base, long exp) {
        long res = 1L;
        base %= MOD;
        while (exp > 0) {
            if ((exp & 1L) != 0) res = (res * base) % MOD;
            base = (base * base) % MOD;
            exp >>= 1;
        }
        return res;
    }

    static void ntt(long[] a, boolean invert) {
        int n = a.length;
        for (int i = 1, j = 0; i < n; i++) {
            int bit = n >> 1;
            for (; (j & bit) != 0; bit >>= 1) j ^= bit;
            j ^= bit;
            if (i < j) {
                long t = a[i];
                a[i] = a[j];
                a[j] = t;
            }
        }
        for (int len = 2; len <= n; len <<= 1) {
            long wlen = modPow(G, (MOD - 1) / len);
            if (invert) wlen = modPow(wlen, MOD - 2);
            int half = len >> 1;
            for (int i = 0; i < n; i += len) {
                long w = 1L;
                for (int j = 0; j < half; j++) {
                    long u = a[i + j];
                    long v = (a[i + j + half] * w) % MOD;
                    a[i + j] = (u + v) % MOD;
                    a[i + j + half] = (u - v + MOD) % MOD;
                    w = (w * wlen) % MOD;
                }
            }
        }
        if (invert) {
            long invN = modPow(n, MOD - 2);
            for (int i = 0; i < n; i++) a[i] = (a[i] * invN) % MOD;
        }
    }

    static long[] polyMul(long[] a, long[] b, int limit) {
        if (a.length == 0 || b.length == 0 || limit == 0) return new long[0];
        int need = a.length + b.length - 1;
        int sz = 1;
        while (sz < need) sz <<= 1;
        long[] fa = Arrays.copyOf(a, sz);
        long[] fb = Arrays.copyOf(b, sz);
        ntt(fa, false);
        ntt(fb, false);
        for (int i = 0; i < sz; i++) fa[i] = (fa[i] * fb[i]) % MOD;
        ntt(fa, true);
        return Arrays.copyOf(fa, Math.min(need, limit));
    }

    static long[] polyInv(long[] a, int n) {
        long[] b = new long[]{modPow(a[0], MOD - 2)};
        for (int m = 1; m < n; m <<= 1) {
            int lim = Math.min(n, m << 1);
            int sz = 1;
            while (sz < (m << 2)) sz <<= 1;
            long[] f = new long[sz];
            for (int i = 0; i < lim && i < a.length; i++) f[i] = a[i];
            long[] g = Arrays.copyOf(b, sz);
            ntt(f, false);
            ntt(g, false);
            for (int i = 0; i < sz; i++) {
                long val = (2L - (f[i] * g[i]) % MOD + MOD) % MOD;
                g[i] = (g[i] * val) % MOD;
            }
            ntt(g, true);
            b = Arrays.copyOf(g, lim);
        }
        return Arrays.copyOf(b, n);
    }

    static long[] polyLn(long[] a, int n, long[] invs) {
        if (n <= 1) return new long[n];
        long[] d = new long[n - 1];
        for (int i = 1; i < n && i < a.length; i++) d[i - 1] = (a[i] * i) % MOD;
        long[] invA = polyInv(a, n);
        long[] q = polyMul(d, invA, n - 1);
        long[] res = new long[n];
        for (int i = 0; i < q.length; i++) res[i + 1] = (q[i] * invs[i + 1]) % MOD;
        return res;
    }

    static long[] polyExp(long[] a, int n, long[] invs) {
        long[] b = new long[]{1L};
        for (int m = 1; m < n; m <<= 1) {
            int lim = Math.min(n, m << 1);
            long[] lnB = polyLn(b, lim, invs);
            long[] diff = new long[lim];
            for (int i = 0; i < lim; i++) {
                long ai = i < a.length ? a[i] : 0;
                diff[i] = (ai - lnB[i] + MOD) % MOD;
            }
            diff[0] = (diff[0] + 1) % MOD;
            b = polyMul(b, diff, lim);
        }
        return Arrays.copyOf(b, n);
    }

    public static void main(String[] args) throws Exception {
        FastScanner sc = new FastScanner(System.in);
        int n = sc.nextInt();
        if (n == Integer.MIN_VALUE) return;
        int sz = n + 1;
        long[] invs = new long[Math.max(2, sz)];
        invs[1] = 1;
        for (int i = 2; i < sz; i++) invs[i] = (MOD - MOD / i) * invs[(int) (MOD % i)] % MOD;
        long[] s = new long[sz];
        for (int t = 1; t <= n; t++) {
            for (int m = t; m <= n; m += t) {
                s[m] = (s[m] + invs[t]) % MOD;
            }
        }
        long[] p = polyExp(s, sz, invs);
        StringBuilder sb = new StringBuilder();
        for (int i = 1; i <= n; i++) {
            if (i > 1) sb.append(' ');
            sb.append(p[i]);
        }
        System.out.println(sb.toString());
    }
}`,
        python3: `import sys

MOD = 998244353
G = 3


def ntt(a: list[int], invert: bool) -> None:
    n = len(a)
    j = 0
    for i in range(1, n):
        bit = n >> 1
        while j & bit:
            j ^= bit
            bit >>= 1
        j ^= bit
        if i < j:
            a[i], a[j] = a[j], a[i]
    length = 2
    while length <= n:
        wlen = pow(G, (MOD - 1) // length, MOD)
        if invert:
            wlen = pow(wlen, MOD - 2, MOD)
        half = length >> 1
        for i in range(0, n, length):
            w = 1
            for k in range(half):
                u = a[i + k]
                v = a[i + k + half] * w % MOD
                a[i + k] = (u + v) % MOD
                a[i + k + half] = (u - v) % MOD
                w = w * wlen % MOD
        length <<= 1
    if invert:
        inv_n = pow(n, MOD - 2, MOD)
        for i in range(n):
            a[i] = a[i] * inv_n % MOD


def poly_mul(a: list[int], b: list[int], limit: int) -> list[int]:
    if not a or not b or limit <= 0:
        return []
    need = len(a) + len(b) - 1
    sz = 1
    while sz < need:
        sz <<= 1
    fa = a + [0] * (sz - len(a))
    fb = b + [0] * (sz - len(b))
    ntt(fa, False)
    ntt(fb, False)
    for i in range(sz):
        fa[i] = fa[i] * fb[i] % MOD
    ntt(fa, True)
    return fa[:min(need, limit)]


def poly_inv(a: list[int], n: int) -> list[int]:
    b = [pow(a[0], MOD - 2, MOD)]
    m = 1
    while m < n:
        lim = min(n, m << 1)
        sz = 1
        while sz < (m << 2):
            sz <<= 1
        f = [a[i] if i < len(a) and i < lim else 0 for i in range(sz)]
        g = b + [0] * (sz - len(b))
        ntt(f, False)
        ntt(g, False)
        for i in range(sz):
            g[i] = g[i] * ((2 - f[i] * g[i]) % MOD) % MOD
        ntt(g, True)
        b = g[:lim]
        m <<= 1
    return (b + [0] * n)[:n]


def poly_ln(a: list[int], n: int, invs: list[int]) -> list[int]:
    if n <= 1:
        return [0] * n
    d = [a[i] * i % MOD for i in range(1, min(n, len(a)))]
    inv_a = poly_inv(a, n)
    q = poly_mul(d, inv_a, n - 1)
    res = [0] * n
    for i, val in enumerate(q):
        res[i + 1] = val * invs[i + 1] % MOD
    return res


def poly_exp(a: list[int], n: int, invs: list[int]) -> list[int]:
    b = [1]
    m = 1
    while m < n:
        lim = min(n, m << 1)
        ln_b = poly_ln(b, lim, invs)
        diff = [((a[i] if i < len(a) else 0) - ln_b[i]) % MOD for i in range(lim)]
        diff[0] = (diff[0] + 1) % MOD
        b = poly_mul(b, diff, lim)
        m <<= 1
    return (b + [0] * n)[:n]


def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    sz = n + 1
    invs = [1] * max(2, sz)
    for i in range(2, sz):
        invs[i] = (MOD - MOD // i) * invs[MOD % i] % MOD
    s = [0] * sz
    for t in range(1, n + 1):
        val = invs[t]
        for m in range(t, n + 1, t):
            s[m] = (s[m] + val) % MOD
    p = poly_exp(s, sz, invs)
    sys.stdout.write(" ".join(map(str, p[1 : n + 1])) + "\\n")


if __name__ == "__main__":
    solve()`,
        ruby: `MOD = 998_244_353
G = 3

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

def ntt(a, invert)
  n = a.length
  j = 0
  (1...n).each do |i|
    bit = n >> 1
    while (j & bit) != 0
      j ^= bit
      bit >>= 1
    end
    j ^= bit
    a[i], a[j] = a[j], a[i] if i < j
  end
  len = 2
  while len <= n
    wlen = mod_pow(G, (MOD - 1) / len)
    wlen = mod_pow(wlen, MOD - 2) if invert
    half = len >> 1
    i = 0
    while i < n
      w = 1
      k = 0
      while k < half
        u = a[i + k]
        v = (a[i + k + half] * w) % MOD
        a[i + k] = (u + v) % MOD
        a[i + k + half] = (u - v) % MOD
        w = (w * wlen) % MOD
        k += 1
      end
      i += len
    end
    len <<= 1
  end
  if invert
    inv_n = mod_pow(n, MOD - 2)
    a.map! { |x| (x * inv_n) % MOD }
  end
end

def poly_mul(a, b, limit)
  return [] if a.empty? || b.empty? || limit <= 0
  need = a.length + b.length - 1
  sz = 1
  sz <<= 1 while sz < need
  fa = a + Array.new(sz - a.length, 0)
  fb = b + Array.new(sz - b.length, 0)
  ntt(fa, false)
  ntt(fb, false)
  sz.times { |i| fa[i] = (fa[i] * fb[i]) % MOD }
  ntt(fa, true)
  fa[0...[need, limit].min]
end

def poly_inv(a, n)
  b = [mod_pow(a[0], MOD - 2)]
  m = 1
  while m < n
    lim = [n, m << 1].min
    sz = 1
    sz <<= 1 while sz < (m << 2)
    f = Array.new(sz, 0)
    lim.times { |i| f[i] = a[i] if i < a.length }
    g = b + Array.new(sz - b.length, 0)
    ntt(f, false)
    ntt(g, false)
    sz.times { |i| g[i] = (g[i] * ((2 - f[i] * g[i]) % MOD)) % MOD }
    ntt(g, true)
    b = g[0...lim]
    m <<= 1
  end
  (b + Array.new(n, 0))[0...n]
end

def poly_ln(a, n, invs)
  return Array.new(n, 0) if n <= 1
  d = []
  (1...[n, a.length].min).each { |i| d << (a[i] * i) % MOD }
  inv_a = poly_inv(a, n)
  q = poly_mul(d, inv_a, n - 1)
  res = Array.new(n, 0)
  q.each_with_index { |val, i| res[i + 1] = (val * invs[i + 1]) % MOD }
  res
end

def poly_exp(a, n, invs)
  b = [1]
  m = 1
  while m < n
    lim = [n, m << 1].min
    ln_b = poly_ln(b, lim, invs)
    diff = Array.new(lim, 0)
    lim.times do |i|
      ai = i < a.length ? a[i] : 0
      diff[i] = (ai - ln_b[i]) % MOD
    end
    diff[0] = (diff[0] + 1) % MOD
    b = poly_mul(b, diff, lim)
    m <<= 1
  end
  (b + Array.new(n, 0))[0...n]
end

tokens = STDIN.read.split
return if tokens.empty?
n = tokens[0].to_i
sz = n + 1
invs = Array.new([2, sz].max, 1)
(2...sz).each { |i| invs[i] = ((MOD - MOD / i) * invs[MOD % i]) % MOD }
s = Array.new(sz, 0)
(1..n).each do |t|
  val = invs[t]
  m = t
  while m <= n
    s[m] = (s[m] + val) % MOD
    m += t
  end
end
p_arr = poly_exp(s, sz, invs)
puts p_arr[1..n].join(' ')`,
      },
    },
    {
      id: 'ch72-p3',
      tier: 'Boss',
      ratingRange: '2800–3300+',
      title: 'Bostan-Mori Rational Generating Function Coefficient [x^N] P(x) / Q(x)',
      statement:
        'Given integer K, target exponent N (0 <= N <= 10^18), numerator polynomial P(x) of degree < K (K coefficients), and denominator polynomial Q(x) of degree <= K (K + 1 coefficients with Q[0] != 0), compute the exact coefficient [x^N] (P(x) / Q(x)) modulo 998244353 in O(K log K log N) time.',
      constraints: '1 <= K <= 50000, 0 <= N <= 10^18, 0 <= P[i], Q[i] < 998244353, Q[0] != 0',
      sampleInput: `2 10
0 1
1 998244352 998244352`,
      sampleOutput: `55`,
      hints: [
        'Rewrite P(x) / Q(x) = (P(x) * Q(-x)) / (Q(x) * Q(-x)). Notice Q(x) * Q(-x) contains only even powers of x, say R(x^2).',
        'Keep only the indices of P(x) * Q(-x) matching the parity of N (N & 1), extract V(x) of half length, replace N by N >> 1, and repeat until N == 0.',
      ],
      solutions: {
        cpp20: `#include <algorithm>
#include <iostream>
#include <vector>

using namespace std;

static constexpr long long MOD = 998244353;
static constexpr long long G = 3;

long long modPow(long long base, long long exp) {
    long long res = 1;
    base %= MOD;
    if (base < 0) base += MOD;
    while (exp > 0) {
        if (exp & 1LL) res = res * base % MOD;
        base = base * base % MOD;
        exp >>= 1LL;
    }
    return res;
}

void ntt(vector<long long>& a, bool invert) {
    int n = (int)a.size();
    for (int i = 1, j = 0; i < n; ++i) {
        int bit = n >> 1;
        for (; j & bit; bit >>= 1) j ^= bit;
        j ^= bit;
        if (i < j) swap(a[i], a[j]);
    }
    for (int len = 2; len <= n; len <<= 1) {
        long long wlen = modPow(G, (MOD - 1) / len);
        if (invert) wlen = modPow(wlen, MOD - 2);
        int half = len >> 1;
        for (int i = 0; i < n; i += len) {
            long long w = 1;
            for (int j = 0; j < half; ++j) {
                long long u = a[i + j];
                long long v = a[i + j + half] * w % MOD;
                a[i + j] = (u + v < MOD) ? (u + v) : (u + v - MOD);
                a[i + j + half] = (u - v >= 0) ? (u - v) : (u - v + MOD);
                w = w * wlen % MOD;
            }
        }
    }
    if (invert) {
        long long inv_n = modPow(n, MOD - 2);
        for (long long& x : a) x = x * inv_n % MOD;
    }
}

vector<long long> polyMul(vector<long long> a, vector<long long> b) {
    if (a.empty() || b.empty()) return {};
    int need = (int)a.size() + (int)b.size() - 1;
    int sz = 1;
    while (sz < need) sz <<= 1;
    a.resize(sz);
    b.resize(sz);
    ntt(a, false);
    ntt(b, false);
    for (int i = 0; i < sz; ++i) a[i] = a[i] * b[i] % MOD;
    ntt(a, true);
    a.resize(need);
    return a;
}

long long bostanMori(vector<long long> p, vector<long long> q, long long n) {
    while (n > 0 && !p.empty()) {
        vector<long long> q_neg = q;
        for (size_t i = 1; i < q_neg.size(); i += 2) {
            if (q_neg[i] != 0) q_neg[i] = MOD - q_neg[i];
        }
        vector<long long> u = polyMul(p, q_neg);
        vector<long long> v = polyMul(q, q_neg);
        vector<long long> next_p, next_q;
        int parity = (int)(n & 1LL);
        for (size_t i = parity; i < u.size(); i += 2) next_p.push_back(u[i]);
        for (size_t i = 0; i < v.size(); i += 2) next_q.push_back(v[i]);
        p.swap(next_p);
        q.swap(next_q);
        n >>= 1;
    }
    if (p.empty()) return 0;
    return p[0] * modPow(q[0], MOD - 2) % MOD;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int k;
    long long n;
    if (!(cin >> k >> n)) return 0;
    vector<long long> p(k), q(k + 1);
    for (int i = 0; i < k; ++i) cin >> p[i];
    for (int i = 0; i <= k; ++i) cin >> q[i];

    cout << bostanMori(p, q, n) << '\\n';
    return 0;
}`,
        rust: `use std::io::{self, Read};

const MOD: i64 = 998_244_353;
const G: i64 = 3;

fn mod_pow(mut base: i64, mut exp: i64) -> i64 {
    let mut res = 1i64;
    base = base.rem_euclid(MOD);
    while exp > 0 {
        if (exp & 1) == 1 {
            res = (res * base) % MOD;
        }
        base = (base * base) % MOD;
        exp >>= 1;
    }
    res
}

fn ntt(a: &mut Vec<i64>, invert: bool) {
    let n = a.len();
    let mut j = 0usize;
    for i in 1..n {
        let mut bit = n >> 1;
        while (j & bit) != 0 {
            j ^= bit;
            bit >>= 1;
        }
        j ^= bit;
        if i < j {
            a.swap(i, j);
        }
    }
    let mut len = 2usize;
    while len <= n {
        let mut wlen = mod_pow(G, (MOD - 1) / (len as i64));
        if invert {
            wlen = mod_pow(wlen, MOD - 2);
        }
        let half = len >> 1;
        for i in (0..n).step_by(len) {
            let mut w = 1i64;
            for k in 0..half {
                let u = a[i + k];
                let v = (a[i + k + half] * w) % MOD;
                a[i + k] = (u + v) % MOD;
                a[i + k + half] = (u - v + MOD) % MOD;
                w = (w * wlen) % MOD;
            }
        }
        len <<= 1;
    }
    if invert {
        let inv_n = mod_pow(n as i64, MOD - 2);
        for x in a.iter_mut() {
            *x = (*x * inv_n) % MOD;
        }
    }
}

fn poly_mul(mut a: Vec<i64>, mut b: Vec<i64>) -> Vec<i64> {
    if a.is_empty() || b.is_empty() {
        return Vec::new();
    }
    let need = a.len() + b.len() - 1;
    let mut sz = 1usize;
    while sz < need {
        sz <<= 1;
    }
    a.resize(sz, 0);
    b.resize(sz, 0);
    ntt(&mut a, false);
    ntt(&mut b, false);
    for i in 0..sz {
        a[i] = (a[i] * b[i]) % MOD;
    }
    ntt(&mut a, true);
    a.truncate(need);
    a
}

fn bostan_mori(mut p: Vec<i64>, mut q: Vec<i64>, mut n: u64) -> i64 {
    while n > 0 && !p.is_empty() {
        let mut q_neg = q.clone();
        for i in (1..q_neg.len()).step_by(2) {
            if q_neg[i] != 0 {
                q_neg[i] = MOD - q_neg[i];
            }
        }
        let u = poly_mul(p, q_neg.clone());
        let v = poly_mul(q, q_neg);
        let parity = (n & 1) as usize;
        p = u.into_iter().skip(parity).step_by(2).collect();
        q = v.into_iter().step_by(2).collect();
        n >>= 1;
    }
    if p.is_empty() {
        0
    } else {
        (p[0] * mod_pow(q[0], MOD - 2)) % MOD
    }
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let k: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };
    let n: u64 = it.next().unwrap().parse().unwrap();
    let mut p = vec![0i64; k];
    for x in p.iter_mut() {
        *x = it.next().unwrap().parse().unwrap();
    }
    let mut q = vec![0i64; k + 1];
    for x in q.iter_mut() {
        *x = it.next().unwrap().parse().unwrap();
    }
    println!("{}", bostan_mori(p, q, n));
}`,
        java21: `import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;

public class Main {
    static final long MOD = 998244353L;
    static final long G = 3L;

    static final class FastScanner {
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
            int c;
            do {
                c = readByte();
                if (c == -1) return Long.MIN_VALUE;
            } while (c <= ' ');
            long val = 0;
            while (c > ' ') {
                val = val * 10 + (c - '0');
                c = readByte();
            }
            return val;
        }

        int nextInt() throws IOException {
            return (int) nextLong();
        }
    }

    static long modPow(long base, long exp) {
        long res = 1L;
        base = ((base % MOD) + MOD) % MOD;
        while (exp > 0) {
            if ((exp & 1L) != 0) res = (res * base) % MOD;
            base = (base * base) % MOD;
            exp >>= 1;
        }
        return res;
    }

    static void ntt(long[] a, boolean invert) {
        int n = a.length;
        for (int i = 1, j = 0; i < n; i++) {
            int bit = n >> 1;
            for (; (j & bit) != 0; bit >>= 1) j ^= bit;
            j ^= bit;
            if (i < j) {
                long t = a[i];
                a[i] = a[j];
                a[j] = t;
            }
        }
        for (int len = 2; len <= n; len <<= 1) {
            long wlen = modPow(G, (MOD - 1) / len);
            if (invert) wlen = modPow(wlen, MOD - 2);
            int half = len >> 1;
            for (int i = 0; i < n; i += len) {
                long w = 1L;
                for (int j = 0; j < half; j++) {
                    long u = a[i + j];
                    long v = (a[i + j + half] * w) % MOD;
                    a[i + j] = (u + v) % MOD;
                    a[i + j + half] = (u - v + MOD) % MOD;
                    w = (w * wlen) % MOD;
                }
            }
        }
        if (invert) {
            long invN = modPow(n, MOD - 2);
            for (int i = 0; i < n; i++) a[i] = (a[i] * invN) % MOD;
        }
    }

    static long[] polyMul(long[] a, long[] b) {
        if (a.length == 0 || b.length == 0) return new long[0];
        int need = a.length + b.length - 1;
        int sz = 1;
        while (sz < need) sz <<= 1;
        long[] fa = Arrays.copyOf(a, sz);
        long[] fb = Arrays.copyOf(b, sz);
        ntt(fa, false);
        ntt(fb, false);
        for (int i = 0; i < sz; i++) fa[i] = (fa[i] * fb[i]) % MOD;
        ntt(fa, true);
        return Arrays.copyOf(fa, need);
    }

    static long bostanMori(long[] p, long[] q, long n) {
        while (n > 0 && p.length > 0) {
            long[] qNeg = q.clone();
            for (int i = 1; i < qNeg.length; i += 2) {
                if (qNeg[i] != 0) qNeg[i] = MOD - qNeg[i];
            }
            long[] u = polyMul(p, qNeg);
            long[] v = polyMul(q, qNeg);
            int parity = (int) (n & 1L);
            int pLen = u.length > parity ? (u.length - 1 - parity) / 2 + 1 : 0;
            int qLen = (v.length - 1) / 2 + 1;
            long[] nextP = new long[pLen];
            for (int i = parity, idx = 0; i < u.length; i += 2) nextP[idx++] = u[i];
            long[] nextQ = new long[qLen];
            for (int i = 0, idx = 0; i < v.length; i += 2) nextQ[idx++] = v[i];
            p = nextP;
            q = nextQ;
            n >>= 1;
        }
        if (p.length == 0) return 0;
        return (p[0] * modPow(q[0], MOD - 2)) % MOD;
    }

    public static void main(String[] args) throws Exception {
        FastScanner sc = new FastScanner(System.in);
        int k = sc.nextInt();
        if (k == Integer.MIN_VALUE) return;
        long n = sc.nextLong();
        long[] p = new long[k];
        for (int i = 0; i < k; i++) p[i] = sc.nextLong();
        long[] q = new long[k + 1];
        for (int i = 0; i <= k; i++) q[i] = sc.nextLong();
        System.out.println(bostanMori(p, q, n));
    }
}`,
        python3: `import sys

MOD = 998244353
G = 3


def ntt(a: list[int], invert: bool) -> None:
    n = len(a)
    j = 0
    for i in range(1, n):
        bit = n >> 1
        while j & bit:
            j ^= bit
            bit >>= 1
        j ^= bit
        if i < j:
            a[i], a[j] = a[j], a[i]
    length = 2
    while length <= n:
        wlen = pow(G, (MOD - 1) // length, MOD)
        if invert:
            wlen = pow(wlen, MOD - 2, MOD)
        half = length >> 1
        for i in range(0, n, length):
            w = 1
            for k in range(half):
                u = a[i + k]
                v = a[i + k + half] * w % MOD
                a[i + k] = (u + v) % MOD
                a[i + k + half] = (u - v) % MOD
                w = w * wlen % MOD
        length <<= 1
    if invert:
        inv_n = pow(n, MOD - 2, MOD)
        for i in range(n):
            a[i] = a[i] * inv_n % MOD


def poly_mul(a: list[int], b: list[int]) -> list[int]:
    if not a or not b:
        return []
    need = len(a) + len(b) - 1
    sz = 1
    while sz < need:
        sz <<= 1
    fa = a + [0] * (sz - len(a))
    fb = b + [0] * (sz - len(b))
    ntt(fa, False)
    ntt(fb, False)
    for i in range(sz):
        fa[i] = fa[i] * fb[i] % MOD
    ntt(fa, True)
    return fa[:need]


def bostan_mori(p: list[int], q: list[int], n: int) -> int:
    while n > 0 and p:
        q_neg = [MOD - x if (i & 1) and x else x for i, x in enumerate(q)]
        u = poly_mul(p, q_neg)
        v = poly_mul(q, q_neg)
        p = u[n & 1 :: 2]
        q = v[0::2]
        n >>= 1
    if not p:
        return 0
    return p[0] * pow(q[0], MOD - 2, MOD) % MOD


def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    k = int(data[0])
    n = int(data[1])
    p = [int(x) for x in data[2 : 2 + k]]
    q = [int(x) for x in data[2 + k : 2 + 2 * k + 1]]
    sys.stdout.write(str(bostan_mori(p, q, n)) + "\\n")


if __name__ == "__main__":
    solve()`,
        ruby: `MOD = 998_244_353
G = 3

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

def ntt(a, invert)
  n = a.length
  j = 0
  (1...n).each do |i|
    bit = n >> 1
    while (j & bit) != 0
      j ^= bit
      bit >>= 1
    end
    j ^= bit
    a[i], a[j] = a[j], a[i] if i < j
  end
  len = 2
  while len <= n
    wlen = mod_pow(G, (MOD - 1) / len)
    wlen = mod_pow(wlen, MOD - 2) if invert
    half = len >> 1
    i = 0
    while i < n
      w = 1
      k = 0
      while k < half
        u = a[i + k]
        v = (a[i + k + half] * w) % MOD
        a[i + k] = (u + v) % MOD
        a[i + k + half] = (u - v) % MOD
        w = (w * wlen) % MOD
        k += 1
      end
      i += len
    end
    len <<= 1
  end
  if invert
    inv_n = mod_pow(n, MOD - 2)
    a.map! { |x| (x * inv_n) % MOD }
  end
end

def poly_mul(a, b)
  return [] if a.empty? || b.empty?
  need = a.length + b.length - 1
  sz = 1
  sz <<= 1 while sz < need
  fa = a + Array.new(sz - a.length, 0)
  fb = b + Array.new(sz - b.length, 0)
  ntt(fa, false)
  ntt(fb, false)
  sz.times { |i| fa[i] = (fa[i] * fb[i]) % MOD }
  ntt(fa, true)
  fa[0...need]
end

def bostan_mori(p, q, n)
  while n > 0 && !p.empty?
    q_neg = q.each_with_index.map { |x, i| (i.odd? && x != 0) ? MOD - x : x }
    u = poly_mul(p, q_neg)
    v = poly_mul(q, q_neg)
    np = []
    i = n & 1
    while i < u.length
      np << u[i]
      i += 2
    end
    nq = []
    i = 0
    while i < v.length
      nq << v[i]
      i += 2
    end
    p = np
    q = nq
    n >>= 1
  end
  return 0 if p.empty?
  (p[0] * mod_pow(q[0], MOD - 2)) % MOD
end

tokens = STDIN.read.split
return if tokens.empty?
k = tokens[0].to_i
n = tokens[1].to_i
p_arr = tokens[2, k].map(&:to_i)
q_arr = tokens[2 + k, k + 1].map(&:to_i)
puts bostan_mori(p_arr, q_arr, n)`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'AtCoder',
      title: 'Library Checker - Inv of Formal Power Series',
      difficulty: 'Grandmaster',
      url: 'https://judge.yosupo.jp/problem/inv_of_formal_power_series',
      patternNote: 'Direct O(N log N) Newton doubling with NTT transform size 4m.',
    },
    {
      platform: 'AtCoder',
      title: 'Library Checker - Exp / Log / Sqrt of Formal Power Series',
      difficulty: 'Grandmaster',
      url: 'https://judge.yosupo.jp/problem/exp_of_formal_power_series',
      patternNote: 'Standard FPS toolbox verification modulo 998244353.',
    },
    {
      platform: 'Codeforces',
      title: 'The Child and Binary Tree (CF 438E)',
      difficulty: '3100',
      url: 'https://codeforces.com/problemset/problem/438/E',
      patternNote: 'Solve G = 1 + C G^2 via quadratic formula 2 / (1 + sqrt(1 - 4 C)) using polySqrt + polyInv.',
    },
  ],
  interviewNotes: [
    'Wait—why does Newton iteration double precision? If B - B* is divisible by x^m, Taylor expanding F(B*) = F(B) + F\'(B)(B* - B) + O((B* - B)^2) shows that updating B_{2m} = B - F(B)/F\'(B) annihilates all terms below x^{2m}.',
    'In polyExp, solving ln(B) - A = 0 gives B_{2m} = B_m * (1 - ln(B_m) + A) mod x^{2m}, requiring only one polyLn (which itself uses one polyInv + two NTTs) and one polyMul per doubling step.',
    'For Bostan-Mori, multiplying numerator and denominator by Q(-x) turns Q(x)Q(-x) into an even polynomial R(x^2), so computing [x^N] P(x)/Q(x) discards half the coefficients of P(x)Q(-x) at every step and halves N in O(K log K log N).',
  ],
  projectBlueprint: {
    title: 'Sparse-Dense FPS Algebra Kernel',
    tagline: 'Modular 998244353 formal power series engine supporting O(N log N) transcendental lifts and Bostan-Mori linear recurrence extraction',
    stackSummary: 'C++20 / Rust NTT + Newton Doubling (Inv, Ln, Exp, Sqrt) + Bostan-Mori',
    asciiDiagram:
`[A(x)] --(A[0]^-1)--> [B_1] --(B*(2 - A*B) mod x^{2m})--> [polyInv]
                                                               |
                     [polyExp] <---(B*(1 + A - ln B))--- [polyLn]
                         |
           [P(x)/Q(x) -> (P*Q(-x)) / (Q*Q(-x))] ---> [Bostan-Mori [x^N]]`,
    milestones: [
      { id: 'm1', title: 'Butterfly NTT Engine', detail: 'Bit-reversal in-place iterative NTT over MOD = 998244353 (g = 3).' },
      { id: 'm2', title: 'Newton Inv / Sqrt / Ln / Exp', detail: 'Shrink transform length to 4m per doubling round to guarantee O(N log N).' },
      { id: 'm3', title: 'Bostan-Mori Halver', detail: 'Extract arbitrary 10^18-th terms of degree-K rational generating functions.' },
    ],
    starterCode: `// Given C(x) with C[0] = 0, count labeled/weighted binary trees:
// T(x) = 2 * inv(1 + sqrt(1 - 4 * C(x))) mod x^N`,
  },
};
