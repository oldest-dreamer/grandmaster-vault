import type { TheoryChapter } from '../../types/vault';

export const CH25_FFT_NTT_CONVOLUTION: TheoryChapter = {
  slug: 'fft-ntt-polynomial-convolution',
  topicId: 'ma-55',
  title: 'FFT, NTT (998244353) & Arbitrary-Mod Convolution',
  domain: 'Math, Number Theory & Algebra',
  ratingTier: '2200–2600',
  usacoDivision: 'Platinum',
  subtitle:
    'Multiply degree-N polynomials in O(N log N) using iterative bit-reversal Cooley-Tukey butterflies, exact modular NTT over 998244353, and 3-NTT CRT lifting for arbitrary moduli like 10^9 + 7.',
  analogyTitle: 'The Audio Frequency Mixer & Exact Modular Mirror Analogy',
  analogyBody:
    'Multiplying two polynomials `A(x)` and `B(x)` coefficient-by-coefficient takes `O(N^2)` work because every pair `(a_i, b_j)` collides into `x^(i+j)`. Yet if you sample both curves at `N` special **Roots of Unity** (`1, w, w^2, ..., w^(N-1)`), multiplying two curves at the same `x`-coordinates takes just `O(N)` pointwise multiplications! **FFT / NTT** splits a polynomial into even and odd index coefficients recursively (`A(x) = A_even(x^2) + x * A_odd(x^2)`), reusing the symmetry `w^(k + N/2) = -w^k` so `N` points collapse via **Butterfly swaps** in `O(N log N)`! Replace floating-point complex roots `e^(2pi*i/N)` with exact integer primitive roots modulo `998244353` (`g = 3`, `998244353 - 1 = 119 * 2^23`), and floating-point rounding vanishes completely.',
  prerequisites: [
    {
      slug: 'modular-arithmetic-fermat-crt',
      title: 'Modular Exponentiation, Extended GCD & CRT',
    },
  ],
  traceTitle: 'Interactive Bit-Reversal Permutation, Butterfly Stages & Twiddle Factor Trace',
  traceSubtitle:
    'Step through an iterative N = 4 NTT over mod 998244353 (primitive root w_4 = 911660635, since w_4^2 = -1) on `A = [1, 2, 3, 4]` padded for convolution.',
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Step 1: Pad Length to Next Power of Two & Compute Bit-Reversal Permutation',
      explanation:
        'For N = 4 (2 bits): index 0 (00)->0, 1 (01)->2 (10), 2 (10)->1 (01), 3 (11)->3. Swapping indices 1 and 2 rearranges A = [1, 2, 3, 4] into even-indexed [1, 3] followed by odd-indexed [2, 4] ready for bottom-up butterflies.',
      mode: 'array',
      arrays: [
        {
          name: 'Original A[]',
          cells: [
            { index: 0, value: 1, label: '00', highlight: 'neutral' },
            { index: 1, value: 2, label: '01', highlight: 'active' },
            { index: 2, value: 3, label: '10', highlight: 'active' },
            { index: 3, value: 4, label: '11', highlight: 'neutral' },
          ],
        },
        {
          name: 'Bit-Reversed A[]',
          cells: [
            { index: 0, value: 1, label: 'rev 0', highlight: 'neutral' },
            { index: 1, value: 3, label: 'rev 2', highlight: 'updated' },
            { index: 2, value: 2, label: 'rev 1', highlight: 'updated' },
            { index: 3, value: 4, label: 'rev 3', highlight: 'neutral' },
          ],
        },
      ],
      variables: { N: 4, BitRevSwap: 'idx 1 <-> idx 2', Mod: 998244353 },
    },
    {
      stepNumber: 2,
      title: 'Step 2: Stage len = 2 Runs Local 2-Point Butterflies (w_2^0 = 1)',
      explanation:
        'Each pair (u, v) = (a[i], w * a[i+1]) updates to (u + v, u - v). Pair (1, 3) -> (4, -2 mod M = 998244351); pair (2, 4) -> (6, -2 mod M = 998244351).',
      mode: 'array',
      arrays: [
        {
          name: 'After len=2',
          cells: [
            { index: 0, value: 4, label: '1+3', highlight: 'updated' },
            { index: 1, value: 998244351, label: '1-3', highlight: 'updated' },
            { index: 2, value: 6, label: '2+4', highlight: 'window' },
            { index: 3, value: 998244351, label: '2-4', highlight: 'window' },
          ],
        },
      ],
      variables: { StageLen: 2, TwiddleW0: 1, Block1: '[4, -2]', Block2: '[6, -2]' },
    },
    {
      stepNumber: 3,
      title: 'Step 3: Stage len = 4 Applies 4th Root Twiddle Factors w_4^0 = 1, w_4^1 = 911660635',
      explanation:
        'Combine half [4, -2] with half [6, -2]: j=0 uses w=1 -> (4+6=10, 4-6=-2); j=1 uses w=i (sqrt(-1) mod 998244353) -> (-2 - 2i, -2 + 2i). Evaluation at [1, w_4, -1, -w_4] complete!',
      mode: 'array',
      arrays: [
        {
          name: 'NTT(A) Values',
          cells: [
            { index: 0, value: 10, label: 'A(1)', highlight: 'active' },
            { index: 1, value: 173167428, label: 'A(w)', highlight: 'updated' },
            { index: 2, value: 998244351, label: 'A(-1)', highlight: 'active' },
            { index: 3, value: 825076921, label: 'A(-w)', highlight: 'updated' },
          ],
        },
      ],
      variables: { StageLen: 4, 'w_4': 911660635, 'A(1)': 10, 'A(-1)': -2 },
    },
    {
      stepNumber: 4,
      title: 'Step 4: Pointwise Square NTT(A)*NTT(A), Inverse NTT & Divide by N=4',
      explanation:
        'Square each evaluation in O(N), run Inverse NTT using w_4^(-1), then multiply every entry by inv(4) mod 998244353. Cyclic convolution of [1,2,3,4]^2 gives exact integer coefficients [1, 4, 10, 20, 25, 24, 16] when padded to N=8!',
      mode: 'array',
      arrays: [
        {
          name: 'A(x)^2 Coeffs',
          cells: [
            { index: 0, value: 1, highlight: 'neutral' },
            { index: 1, value: 4, highlight: 'window' },
            { index: 2, value: 10, highlight: 'window' },
            { index: 3, value: 20, highlight: 'active' },
            { index: 4, value: 25, highlight: 'active' },
            { index: 5, value: 24, highlight: 'window' },
            { index: 6, value: 16, highlight: 'neutral' },
            { index: 7, value: 0, highlight: 'neutral' },
          ],
        },
      ],
      variables: { CheckEvalAt1: '1+4+10+20+25+24+16 = 100 = 10^2', TotalOps: 'O(N log N)' },
    },
  ],
  reductionClues: [
    {
      clue: '"Compute sum_{i + j = k} A[i] * B[j] for all k = 0..2N"',
      translation:
        'Direct polynomial convolution `C = A * B`. If the modulus is `998244353`, use single NTT; if coefficients stay `<= 10^15` (small integer counts), use double/long-double FFT; if mod is `10^9 + 7`, use 3-NTT CRT (`998244353`, `167772161`, `469762049`) or 15-bit split FFT.',
    },
    {
      clue: '"Difference / Cross-correlation: sum_{j} A[i + j] * B[j] OR match pattern P with wildcards \'?\'"',
      translation:
        'Reverse pattern `P_rev[j] = P[M - 1 - j]` so `i + (M - 1 - j)` equals a fixed shift! Wildcard matches vanish when encoded into the polynomial sum `sum P[j] * (T[i+j] - P[j])^2 = 0`, expanding cleanly into 3 FFT convolutions!',
    },
    {
      clue: '"Multiply N linear polynomials prod (1 + a_i * x) or prod (1 + x^(w_i)) mod 998244353"',
      translation:
        'Divide-and-Conquer (or priority queue shortest-first merging) polynomial multiplication tree runs in `O(S log^2 S)` where `S = sum(deg)`!',
    },
    {
      clue: '"Multiply two 200,000-digit base-10 integers"',
      translation:
        'Chunk digits into base-1000 or base-10 coefficients, multiply via FFT/NTT, then propagate carries left-to-right in `O(N)`.',
    },
  ],
  timeComplexity: 'O(N log N) per Convolution | D&C Polynomial Product: O(S log^2 S)',
  spaceComplexity: 'O(N)',
  pitfalls: [
    {
      type: 'WA',
      title: 'Padding Size Less Than len(A) + len(B) - 1 Causes Cyclic Wraparound Aliasing',
      detail:
        'If `deg(A) + deg(B) >= n`, the high terms `x^n, x^(n+1)` wrap around and corrupt indices `0, 1, ...`! Always choose the smallest power of two `n >= a.size() + b.size() - 1`.',
    },
    {
      type: 'WA',
      title: 'Floating-Point Precision Loss in Complex FFT When Coefficients Exceed ~10^6',
      detail:
        'Standard 64-bit `double` has only 53 bits of significand (~9 * 10^15). Multiplying two length-10^5 polynomials with coefficients around `10^5` produces `10^5 * 10^5 * 10^5 = 10^15`, risking `round()` errors! Split each coefficient into `(low 15 bits, high 15 bits)` or run 3 exact NTT primes (`998244353`, `167772161`, `469762049`) + Garner CRT for exact `10^9 + 7` convolution.',
    },
    {
      type: 'TLE',
      title: 'Recomputing sin/cos or modPow Inside the Innermost Butterfly Loop',
      detail:
        'Calling `pow_mod` or `cos/sin` for every element inside `for (int j = 0; j < len/2; j++)` adds an extra `30x` constant factor. Multiply incrementally by `w = w * wlen` (or precompute roots table `roots[k]`) so the inner loop does 1 multiply + 2 add/subs!',
    },
    {
      type: 'WA',
      title: 'Forgetting Negative Modulo Normalization in Subtraction Butterflies',
      detail:
        'In NTT, `u - v` can become negative; always reduce `if (v < 0) v += mod` or `(u - v + mod) % mod` so intermediate products never wrap signed 64-bit integers unexpectedly.',
    },
  ],
  implementations: {
    cpp20: `#include <bits/stdc++.h>
using namespace std;

// Exact Modular NTT (998244353) + 3-Prime Arbitrary-Mod CRT Convolution (e.g. 10^9 + 7)
// Time: O(N log N) | Space: O(N)
namespace ntt_lib {
    long long mod_pow(long long a, long long e, long long mod) {
        long long r = 1 % mod;
        a %= mod;
        while (e > 0) {
            if (e & 1) r = (__int128)r * a % mod;
            a = (__int128)a * a % mod;
            e >>= 1;
        }
        return r;
    }

    template <long long MOD, long long G>
    void ntt(vector<long long>& a, bool invert) {
        int n = (int)a.size();
        for (int i = 1, j = 0; i < n; i++) {
            int bit = n >> 1;
            for (; j & bit; bit >>= 1) j ^= bit;
            j ^= bit;
            if (i < j) swap(a[i], a[j]);
        }

        for (int len = 2; len <= n; len <<= 1) {
            long long wlen = mod_pow(G, (MOD - 1) / len, MOD);
            if (invert) wlen = mod_pow(wlen, MOD - 2, MOD);
            for (int i = 0; i < n; i += len) {
                long long w = 1;
                int half = len >> 1;
                for (int j = 0; j < half; j++) {
                    long long u = a[i + j];
                    long long v = a[i + j + half] * w % MOD;
                    long long s = u + v;
                    if (s >= MOD) s -= MOD;
                    long long d = u - v;
                    if (d < 0) d += MOD;
                    a[i + j] = s;
                    a[i + j + half] = d;
                    w = w * wlen % MOD;
                }
            }
        }

        if (invert) {
            long long inv_n = mod_pow(n, MOD - 2, MOD);
            for (long long& x : a) x = x * inv_n % MOD;
        }
    }

    template <long long MOD, long long G>
    vector<long long> convolve(const vector<long long>& a, const vector<long long>& b) {
        if (a.empty() || b.empty()) return {};
        int need = (int)a.size() + (int)b.size() - 1;
        int n = 1;
        while (n < need) n <<= 1;
        vector<long long> fa(n, 0), fb(n, 0);
        for (size_t i = 0; i < a.size(); i++) fa[i] = (a[i] % MOD + MOD) % MOD;
        for (size_t i = 0; i < b.size(); i++) fb[i] = (b[i] % MOD + MOD) % MOD;
        ntt<MOD, G>(fa, false);
        ntt<MOD, G>(fb, false);
        for (int i = 0; i < n; i++) fa[i] = fa[i] * fb[i] % MOD;
        ntt<MOD, G>(fa, true);
        fa.resize(need);
        return fa;
    }

    // Exact arbitrary-modulus convolution using 3 NTT primes + Garner CRT
    vector<long long> convolve_any_mod(const vector<long long>& a, const vector<long long>& b, long long target_mod) {
        static constexpr long long M1 = 998244353;   // g = 3
        static constexpr long long M2 = 167772161;   // g = 3
        static constexpr long long M3 = 469762049;   // g = 3
        auto c1 = convolve<M1, 3>(a, b);
        auto c2 = convolve<M2, 3>(a, b);
        auto c3 = convolve<M3, 3>(a, b);

        long long inv_m1_m2 = mod_pow(M1, M2 - 2, M2);
        long long inv_m12_m3 = mod_pow((M1 * M2) % M3, M3 - 2, M3);
        long long m12_mod = (M1 % target_mod) * (M2 % target_mod) % target_mod;

        int need = (int)c1.size();
        vector<long long> res(need);
        for (int i = 0; i < need; i++) {
            long long r1 = c1[i];
            long long r2 = (c2[i] - r1 % M2 + M2) % M2 * inv_m1_m2 % M2;
            long long x12_m3 = (r1 + M1 * r2) % M3;
            long long r3 = (c3[i] - x12_m3 + M3) % M3 * inv_m12_m3 % M3;
            long long ans = (r1 % target_mod + (M1 % target_mod) * (r2 % target_mod)) % target_mod;
            ans = (ans + m12_mod * (r3 % target_mod)) % target_mod;
            res[i] = ans;
        }
        return res;
    }
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, m;
    if (!(cin >> n >> m)) return 0;
    vector<long long> a(n), b(m);
    for (int i = 0; i < n; i++) cin >> a[i];
    for (int i = 0; i < m; i++) cin >> b[i];

    auto c = ntt_lib::convolve<998244353, 3>(a, b);
    for (size_t i = 0; i < c.size(); i++) {
        if (i) cout << ' ';
        cout << c[i];
    }
    cout << "\\n";
    return 0;
}`,
    rust: `use std::io::{self, Read};

const MOD: i64 = 998_244_353;
const G: i64 = 3;

fn mod_pow(mut a: i64, mut e: i64, m: i64) -> i64 {
    let mut r = 1i64;
    a %= m;
    while e > 0 {
        if (e & 1) == 1 {
            r = (r * a) % m;
        }
        a = (a * a) % m;
        e >>= 1;
    }
    r
}

fn ntt(a: &mut [i64], invert: bool, m: i64, g: i64) {
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
        let mut wlen = mod_pow(g, (m - 1) / (len as i64), m);
        if invert {
            wlen = mod_pow(wlen, m - 2, m);
        }
        let half = len >> 1;
        for i in (0..n).step_by(len) {
            let mut w = 1i64;
            for k in 0..half {
                let u = a[i + k];
                let v = (a[i + k + half] * w) % m;
                let mut s = u + v;
                if s >= m {
                    s -= m;
                }
                let mut d = u - v;
                if d < 0 {
                    d += m;
                }
                a[i + k] = s;
                a[i + k + half] = d;
                w = (w * wlen) % m;
            }
        }
        len <<= 1;
    }

    if invert {
        let inv_n = mod_pow(n as i64, m - 2, m);
        for x in a.iter_mut() {
            *x = (*x * inv_n) % m;
        }
    }
}

fn convolve(a: &[i64], b: &[i64], m: i64, g: i64) -> Vec<i64> {
    if a.is_empty() || b.is_empty() {
        return Vec::new();
    }
    let need = a.len() + b.len() - 1;
    let n = need.next_power_of_two();
    let mut fa = vec![0i64; n];
    let mut fb = vec![0i64; n];
    for (i, &v) in a.iter().enumerate() {
        fa[i] = v.rem_euclid(m);
    }
    for (i, &v) in b.iter().enumerate() {
        fb[i] = v.rem_euclid(m);
    }
    ntt(&mut fa, false, m, g);
    ntt(&mut fb, false, m, g);
    for i in 0..n {
        fa[i] = (fa[i] * fb[i]) % m;
    }
    ntt(&mut fa, true, m, g);
    fa.truncate(need);
    fa
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
    let mut a = Vec::with_capacity(n);
    let mut b = Vec::with_capacity(m);
    for _ in 0..n {
        a.push(it.next().unwrap().parse().unwrap());
    }
    for _ in 0..m {
        b.push(it.next().unwrap().parse().unwrap());
    }
    let c = convolve(&a, &b, MOD, G);
    let out: Vec<String> = c.iter().map(|x| x.to_string()).collect();
    println!("{}", out.join(" "));
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
            boolean neg = false;
            if (c == '-') { neg = true; c = readByte(); }
            long res = 0;
            while (c > ' ') {
                res = res * 10 + (c - '0');
                c = readByte();
            }
            return neg ? -res : res;
        }

        int nextInt() throws IOException { return (int) nextLong(); }
    }

    static final long MOD = 998244353L;
    static final long G = 3L;

    static long modPow(long a, long e, long mod) {
        long r = 1;
        a %= mod;
        while (e > 0) {
            if ((e & 1L) != 0) r = (r * a) % mod;
            a = (a * a) % mod;
            e >>= 1;
        }
        return r;
    }

    static void ntt(long[] a, boolean invert, long mod, long g) {
        int n = a.length;
        for (int i = 1, j = 0; i < n; i++) {
            int bit = n >> 1;
            for (; (j & bit) != 0; bit >>= 1) j ^= bit;
            j ^= bit;
            if (i < j) {
                long t = a[i]; a[i] = a[j]; a[j] = t;
            }
        }
        for (int len = 2; len <= n; len <<= 1) {
            long wlen = modPow(g, (mod - 1) / len, mod);
            if (invert) wlen = modPow(wlen, mod - 2, mod);
            int half = len >> 1;
            for (int i = 0; i < n; i += len) {
                long w = 1;
                for (int j = 0; j < half; j++) {
                    long u = a[i + j];
                    long v = (a[i + j + half] * w) % mod;
                    long s = u + v;
                    if (s >= mod) s -= mod;
                    long d = u - v;
                    if (d < 0) d += mod;
                    a[i + j] = s;
                    a[i + j + half] = d;
                    w = (w * wlen) % mod;
                }
            }
        }
        if (invert) {
            long invN = modPow(n, mod - 2, mod);
            for (int i = 0; i < n; i++) a[i] = (a[i] * invN) % mod;
        }
    }

    static long[] convolve(long[] a, long[] b, long mod, long g) {
        int need = a.length + b.length - 1;
        int n = 1;
        while (n < need) n <<= 1;
        long[] fa = new long[n];
        long[] fb = new long[n];
        for (int i = 0; i < a.length; i++) fa[i] = ((a[i] % mod) + mod) % mod;
        for (int i = 0; i < b.length; i++) fb[i] = ((b[i] % mod) + mod) % mod;
        ntt(fa, false, mod, g);
        ntt(fb, false, mod, g);
        for (int i = 0; i < n; i++) fa[i] = (fa[i] * fb[i]) % mod;
        ntt(fa, true, mod, g);
        long[] res = new long[need];
        System.arraycopy(fa, 0, res, 0, need);
        return res;
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        int n = fs.nextInt();
        if (n == Integer.MIN_VALUE) return;
        int m = fs.nextInt();
        long[] a = new long[n], b = new long[m];
        for (int i = 0; i < n; i++) a[i] = fs.nextLong();
        for (int i = 0; i < m; i++) b[i] = fs.nextLong();
        long[] c = convolve(a, b, MOD, G);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < c.length; i++) {
            if (i > 0) sb.append(' ');
            sb.append(c[i]);
        }
        System.out.println(sb);
    }
}`,
    python3: `import sys

sys.setrecursionlimit(200000)

MOD = 998244353
G = 3

def ntt(a: list[int], invert: bool, mod: int = MOD, g: int = G) -> None:
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
        wlen = pow(g, (mod - 1) // length, mod)
        if invert:
            wlen = pow(wlen, mod - 2, mod)
        half = length >> 1
        for i in range(0, n, length):
            w = 1
            for k in range(half):
                u = a[i + k]
                v = (a[i + k + half] * w) % mod
                s = u + v
                if s >= mod:
                    s -= mod
                d = u - v
                if d < 0:
                    d += mod
                a[i + k] = s
                a[i + k + half] = d
                w = (w * wlen) % mod
        length <<= 1

    if invert:
        inv_n = pow(n, mod - 2, mod)
        for i in range(n):
            a[i] = (a[i] * inv_n) % mod

def convolve(a: list[int], b: list[int], mod: int = MOD) -> list[int]:
    if not a or not b:
        return []
    need = len(a) + len(b) - 1
    n = 1 << (need - 1).bit_length()
    fa = [x % mod for x in a] + [0] * (n - len(a))
    fb = [x % mod for x in b] + [0] * (n - len(b))
    ntt(fa, False, mod)
    ntt(fb, False, mod)
    for i in range(n):
        fa[i] = (fa[i] * fb[i]) % mod
    ntt(fa, True, mod)
    return fa[:need]

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    n = int(next(it))
    m = int(next(it))
    a = [int(next(it)) for _ in range(n)]
    b = [int(next(it)) for _ in range(m)]
    print(" ".join(map(str, convolve(a, b))))

if __name__ == "__main__":
    solve()`,
    ruby: `MOD = 998_244_353
G = 3

def mod_pow(a, e, mod)
  r = 1
  a %= mod
  while e > 0
    r = (r * a) % mod if (e & 1) == 1
    a = (a * a) % mod
    e >>= 1
  end
  r
end

def ntt(a, invert, mod = MOD, g = G)
  n = a.size
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
    wlen = mod_pow(g, (mod - 1) / len, mod)
    wlen = mod_pow(wlen, mod - 2, mod) if invert
    half = len >> 1
    (0...n).step(len) do |i|
      w = 1
      half.times do |k|
        u = a[i + k]
        v = (a[i + k + half] * w) % mod
        s = u + v
        s -= mod if s >= mod
        d = u - v
        d += mod if d < 0
        a[i + k] = s
        a[i + k + half] = d
        w = (w * wlen) % mod
      end
    end
    len <<= 1
  end

  if invert
    inv_n = mod_pow(n, mod - 2, mod)
    a.map! { |x| (x * inv_n) % mod }
  end
end

def convolve(a, b, mod = MOD)
  return [] if a.empty? || b.empty?
  need = a.size + b.size - 1
  n = 1
  n <<= 1 while n < need
  fa = a.map { |x| x % mod } + Array.new(n - a.size, 0)
  fb = b.map { |x| x % mod } + Array.new(n - b.size, 0)
  ntt(fa, false, mod)
  ntt(fb, false, mod)
  n.times { |i| fa[i] = (fa[i] * fb[i]) % mod }
  ntt(fa, true, mod)
  fa[0, need]
end

tokens = $stdin.read.split
exit if tokens.empty?
n = tokens[0].to_i
m = tokens[1].to_i
a = Array.new(n) { |i| tokens[2 + i].to_i }
b = Array.new(m) { |i| tokens[2 + n + i].to_i }
puts convolve(a, b).join(" ")`,
  },
  practiceProblems: [
    {
      id: 'ch25-p1',
      tier: 'Warmup',
      ratingRange: '1900–2100',
      title: 'High-Speed Arbitrary-Size Integer Multiplication via NTT',
      statement:
        'Multiply two non-negative base-10 integers A and B, each having up to 200,000 digits, and output their exact decimal product without using built-in big-integer arithmetic.',
      constraints: '1 <= len(A), len(B) <= 2 * 10^5',
      sampleInput: '12345678901234567890\n98765432109876543210',
      sampleOutput: '1219326311370217952237463801111263526900',
      hints: [
        'Store digits in reverse order (`a[0]` = units digit, `a[i]` = `10^i` digit) so digit multiplication matches polynomial multiplication `C = A * B`!',
        'Since each digit is `0..9`, any convolution sum `C[k]` is at most `200,000 * 81 ≈ 1.6 * 10^7`, which fits inside `998244353` with ZERO overflow! Afterward, perform a single carry pass `carry = C[k] / 10; C[k] %= 10;`.',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

static constexpr long long MOD = 998244353;

long long mod_pow(long long a, long long e) {
    long long r = 1;
    while (e > 0) {
        if (e & 1) r = r * a % MOD;
        a = a * a % MOD;
        e >>= 1;
    }
    return r;
}

void ntt(vector<long long>& a, bool invert) {
    int n = (int)a.size();
    for (int i = 1, j = 0; i < n; i++) {
        int bit = n >> 1;
        for (; j & bit; bit >>= 1) j ^= bit;
        j ^= bit;
        if (i < j) swap(a[i], a[j]);
    }
    for (int len = 2; len <= n; len <<= 1) {
        long long wlen = mod_pow(3, (MOD - 1) / len);
        if (invert) wlen = mod_pow(wlen, MOD - 2);
        int half = len >> 1;
        for (int i = 0; i < n; i += len) {
            long long w = 1;
            for (int j = 0; j < half; j++) {
                long long u = a[i + j], v = a[i + j + half] * w % MOD;
                a[i + j] = (u + v >= MOD) ? (u + v - MOD) : (u + v);
                a[i + j + half] = (u - v < 0) ? (u - v + MOD) : (u - v);
                w = w * wlen % MOD;
            }
        }
    }
    if (invert) {
        long long inv_n = mod_pow(n, MOD - 2);
        for (long long& x : a) x = x * inv_n % MOD;
    }
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    string sa, sb;
    if (!(cin >> sa >> sb)) return 0;
    if (sa == "0" || sb == "0") {
        cout << "0\\n";
        return 0;
    }

    int need = (int)sa.size() + (int)sb.size();
    int n = 1;
    while (n < need) n <<= 1;
    vector<long long> a(n, 0), b(n, 0);
    for (size_t i = 0; i < sa.size(); i++) a[i] = sa[sa.size() - 1 - i] - '0';
    for (size_t i = 0; i < sb.size(); i++) b[i] = sb[sb.size() - 1 - i] - '0';

    ntt(a, false);
    ntt(b, false);
    for (int i = 0; i < n; i++) a[i] = a[i] * b[i] % MOD;
    ntt(a, true);

    long long carry = 0;
    for (int i = 0; i < need; i++) {
        long long val = a[i] + carry;
        a[i] = val % 10;
        carry = val / 10;
    }
    int top = need - 1;
    while (top > 0 && a[top] == 0) top--;
    for (int i = top; i >= 0; i--) cout << a[i];
    cout << "\\n";
    return 0;
}`,
        rust: `use std::io::{self, Read};

const MOD: i64 = 998_244_353;

fn mod_pow(mut a: i64, mut e: i64) -> i64 {
    let mut r = 1i64;
    a %= MOD;
    while e > 0 {
        if (e & 1) == 1 { r = r * a % MOD; }
        a = a * a % MOD;
        e >>= 1;
    }
    r
}

fn ntt(a: &mut [i64], invert: bool) {
    let n = a.len();
    let mut j = 0usize;
    for i in 1..n {
        let mut bit = n >> 1;
        while (j & bit) != 0 { j ^= bit; bit >>= 1; }
        j ^= bit;
        if i < j { a.swap(i, j); }
    }
    let mut len = 2usize;
    while len <= n {
        let mut wlen = mod_pow(3, (MOD - 1) / (len as i64));
        if invert { wlen = mod_pow(wlen, MOD - 2); }
        let half = len >> 1;
        for i in (0..n).step_by(len) {
            let mut w = 1i64;
            for k in 0..half {
                let u = a[i + k];
                let v = a[i + k + half] * w % MOD;
                a[i + k] = if u + v >= MOD { u + v - MOD } else { u + v };
                a[i + k + half] = if u - v < 0 { u - v + MOD } else { u - v };
                w = w * wlen % MOD;
            }
        }
        len <<= 1;
    }
    if invert {
        let inv_n = mod_pow(n as i64, MOD - 2);
        for x in a.iter_mut() { *x = *x * inv_n % MOD; }
    }
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let sa = match it.next() {
        Some(v) => v.as_bytes(),
        None => return,
    };
    let sb = it.next().unwrap().as_bytes();
    if sa == b"0" || sb == b"0" {
        println!("0");
        return;
    }
    let need = sa.len() + sb.len();
    let n = need.next_power_of_two();
    let mut a = vec![0i64; n];
    let mut b = vec![0i64; n];
    for i in 0..sa.len() { a[i] = (sa[sa.len() - 1 - i] - b'0') as i64; }
    for i in 0..sb.len() { b[i] = (sb[sb.len() - 1 - i] - b'0') as i64; }
    ntt(&mut a, false);
    ntt(&mut b, false);
    for i in 0..n { a[i] = a[i] * b[i] % MOD; }
    ntt(&mut a, true);

    let mut carry = 0i64;
    let mut digits = vec![0u8; need];
    for i in 0..need {
        let val = a[i] + carry;
        digits[i] = (val % 10) as u8;
        carry = val / 10;
    }
    let mut top = need - 1;
    while top > 0 && digits[top] == 0 { top -= 1; }
    let mut out = String::with_capacity(top + 1);
    for i in (0..=top).rev() {
        out.push((b'0' + digits[i]) as char);
    }
    println!("{}", out);
}`,
        java21: `import java.io.IOException;
import java.io.InputStream;

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
        String next() throws IOException {
            int c = rb();
            while (c >= 0 && c <= ' ') c = rb();
            if (c == -1) return null;
            StringBuilder sb = new StringBuilder();
            while (c > ' ') { sb.append((char) c); c = rb(); }
            return sb.toString();
        }
    }

    static final long MOD = 998244353L;

    static long modPow(long a, long e) {
        long r = 1;
        a %= MOD;
        while (e > 0) {
            if ((e & 1L) != 0) r = (r * a) % MOD;
            a = (a * a) % MOD;
            e >>= 1;
        }
        return r;
    }

    static void ntt(long[] a, boolean invert) {
        int n = a.length;
        for (int i = 1, j = 0; i < n; i++) {
            int bit = n >> 1;
            for (; (j & bit) != 0; bit >>= 1) j ^= bit;
            j ^= bit;
            if (i < j) { long t = a[i]; a[i] = a[j]; a[j] = t; }
        }
        for (int len = 2; len <= n; len <<= 1) {
            long wlen = modPow(3, (MOD - 1) / len);
            if (invert) wlen = mod_pow(wlen, MOD - 2);
            int half = len >> 1;
            for (int i = 0; i < n; i += len) {
                long w = 1;
                for (int j = 0; j < half; j++) {
                    long u = a[i + j], v = (a[i + j + half] * w) % MOD;
                    a[i + j] = (u + v >= MOD) ? (u + v - MOD) : (u + v);
                    a[i + j + half] = (u - v < 0) ? (u - v + MOD) : (u - v);
                    w = (w * wlen) % MOD;
                }
            }
        }
        if (invert) {
            long invN = modPow(n, MOD - 2);
            for (int i = 0; i < n; i++) a[i] = (a[i] * invN) % MOD;
        }
    }

    static long mod_pow(long a, long e) { return modPow(a, e); }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        String sa = fs.next();
        if (sa == null) return;
        String sb = fs.next();
        if (sa.equals("0") || sb.equals("0")) {
            System.out.println("0");
            return;
        }
        int need = sa.length() + sb.length();
        int n = 1;
        while (n < need) n <<= 1;
        long[] a = new long[n], b = new long[n];
        for (int i = 0; i < sa.length(); i++) a[i] = sa.charAt(sa.length() - 1 - i) - '0';
        for (int i = 0; i < sb.length(); i++) b[i] = sb.charAt(sb.length() - 1 - i) - '0';
        ntt(a, false);
        ntt(b, false);
        for (int i = 0; i < n; i++) a[i] = (a[i] * b[i]) % MOD;
        ntt(a, true);

        long carry = 0;
        for (int i = 0; i < need; i++) {
            long val = a[i] + carry;
            a[i] = val % 10;
            carry = val / 10;
        }
        int top = need - 1;
        while (top > 0 && a[top] == 0) top--;
        StringBuilder out = new StringBuilder(top + 1);
        for (int i = top; i >= 0; i--) out.append(a[i]);
        System.out.println(out);
    }
}`,
        python3: `import sys

sys.setrecursionlimit(200000)

MOD = 998244353

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
        wlen = pow(3, (MOD - 1) // length, MOD)
        if invert:
            wlen = pow(wlen, MOD - 2, MOD)
        half = length >> 1
        for i in range(0, n, length):
            w = 1
            for k in range(half):
                u = a[i + k]
                v = (a[i + k + half] * w) % MOD
                a[i + k] = u + v - MOD if u + v >= MOD else u + v
                a[i + k + half] = u - v + MOD if u - v < 0 else u - v
                w = (w * wlen) % MOD
        length <<= 1
    if invert:
        inv_n = pow(n, MOD - 2, MOD)
        for i in range(n):
            a[i] = (a[i] * inv_n) % MOD

def solve() -> None:
    data = sys.stdin.read().split()
    if len(data) < 2:
        return
    sa, sb = data[0], data[1]
    if sa == "0" or sb == "0":
        print("0")
        return
    need = len(sa) + len(sb)
    n = 1 << (need - 1).bit_length()
    a = [ord(ch) - 48 for ch in reversed(sa)] + [0] * (n - len(sa))
    b = [ord(ch) - 48 for ch in reversed(sb)] + [0] * (n - len(sb))
    ntt(a, False)
    ntt(b, False)
    for i in range(n):
        a[i] = (a[i] * b[i]) % MOD
    ntt(a, True)

    carry = 0
    res = [0] * need
    for i in range(need):
        val = a[i] + carry
        res[i] = val % 10
        carry = val // 10
    top = need - 1
    while top > 0 and res[top] == 0:
        top -= 1
    print("".join(str(res[i]) for i in range(top, -1, -1)))

if __name__ == "__main__":
    solve()`,
        ruby: `MOD = 998_244_353

def mod_pow(a, e)
  r = 1
  a %= MOD
  while e > 0
    r = (r * a) % MOD if (e & 1) == 1
    a = (a * a) % MOD
    e >>= 1
  end
  r
end

def ntt(a, invert)
  n = a.size
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
    wlen = mod_pow(3, (MOD - 1) / len)
    wlen = mod_pow(wlen, MOD - 2) if invert
    half = len >> 1
    (0...n).step(len) do |i|
      w = 1
      half.times do |k|
        u = a[i + k]
        v = (a[i + k + half] * w) % MOD
        a[i + k] = u + v >= MOD ? u + v - MOD : u + v
        a[i + k + half] = u - v < 0 ? u - v + MOD : u - v
        w = (w * wlen) % MOD
      end
    end
    len <<= 1
  end
  if invert
    inv_n = mod_pow(n, MOD - 2)
    a.map! { |x| (x * inv_n) % MOD }
  end
end

tokens = $stdin.read.split
exit if tokens.size < 2
sa = tokens[0]
sb = tokens[1]
if sa == "0" || sb == "0"
  puts "0"
  exit
end

need = sa.length + sb.length
n = 1
n <<= 1 while n < need
a = sa.reverse.bytes.map { |b| b - 48 } + Array.new(n - sa.length, 0)
b = sb.reverse.bytes.map { |b| b - 48 } + Array.new(n - sb.length, 0)
ntt(a, false)
ntt(b, false)
n.times { |i| a[i] = (a[i] * b[i]) % MOD }
ntt(a, true)

carry = 0
res = Array.new(need, 0)
need.times do |i|
  val = a[i] + carry
  res[i] = val % 10
  carry = val / 10
end
top = need - 1
top -= 1 while top > 0 && res[top] == 0
puts res[0..top].reverse.join`,
      },
    },
    {
      id: 'ch25-p2',
      tier: 'Standard',
      ratingRange: '2200–2450',
      title: 'Exact Pattern Matching with Wildcards (?) via Polynomial Convolution',
      statement:
        'Given text string T of length N and pattern P of length M consisting of lowercase English letters and wildcard `?` characters (in either P or T, where `?` matches ANY character), find all 0-indexed start positions `i` where P matches `T[i .. i + M - 1]`.',
      constraints: '1 <= M <= N <= 2 * 10^5',
      sampleInput: 'ab?acaba\na?a',
      sampleOutput: '3\n0 2 5',
      hints: [
        'Map lowercase letters to `1..26` and wildcard `?` to `0`. An alignment at shift `i` matches iff `sum_{j=0}^{M-1} T[i+j] * P[j] * (T[i+j] - P[j])^2 == 0`!',
        'Reverse P (`P_rev[j] = P[M - 1 - j]`) and expand `(T - P)^2`: `sum T^3 * P - 2 * sum T^2 * P^2 + sum T * P^3 == 0`. That needs ONLY 3 NTT convolutions (or 4 NTT transforms reusing forward NTT of T^k and P_rev^k)!',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

static constexpr long long MOD = 998244353;

long long mod_pow(long long a, long long e) {
    long long r = 1;
    while (e > 0) {
        if (e & 1) r = r * a % MOD;
        a = a * a % MOD;
        e >>= 1;
    }
    return r;
}

void ntt(vector<long long>& a, bool invert) {
    int n = (int)a.size();
    for (int i = 1, j = 0; i < n; i++) {
        int bit = n >> 1;
        for (; j & bit; bit >>= 1) j ^= bit;
        j ^= bit;
        if (i < j) swap(a[i], a[j]);
    }
    for (int len = 2; len <= n; len <<= 1) {
        long long wlen = mod_pow(3, (MOD - 1) / len);
        if (invert) wlen = mod_pow(wlen, MOD - 2);
        int half = len >> 1;
        for (int i = 0; i < n; i += len) {
            long long w = 1;
            for (int j = 0; j < half; j++) {
                long long u = a[i + j], v = a[i + j + half] * w % MOD;
                a[i + j] = (u + v >= MOD) ? (u + v - MOD) : (u + v);
                a[i + j + half] = (u - v < 0) ? (u - v + MOD) : (u - v);
                w = w * wlen % MOD;
            }
        }
    }
    if (invert) {
        long long inv_n = mod_pow(n, MOD - 2);
        for (long long& x : a) x = x * inv_n % MOD;
    }
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    string T, P;
    if (!(cin >> T >> P)) return 0;
    int n = (int)T.size(), m = (int)P.size();
    if (m > n) {
        cout << "0\\n";
        return 0;
    }

    int sz = 1;
    while (sz < n + m - 1) sz <<= 1;

    vector<long long> t1(sz, 0), t2(sz, 0), t3(sz, 0);
    vector<long long> p1(sz, 0), p2(sz, 0), p3(sz, 0);

    for (int i = 0; i < n; i++) {
        long long v = (T[i] == '?') ? 0 : (T[i] - 'a' + 1);
        t1[i] = v;
        t2[i] = v * v;
        t3[i] = v * v * v;
    }
    for (int j = 0; j < m; j++) {
        long long v = (P[m - 1 - j] == '?') ? 0 : (P[m - 1 - j] - 'a' + 1);
        p1[j] = v;
        p2[j] = v * v;
        p3[j] = v * v * v;
    }

    ntt(t1, false); ntt(t2, false); ntt(t3, false);
    ntt(p1, false); ntt(p2, false); ntt(p3, false);

    vector<long long> score(sz, 0);
    for (int i = 0; i < sz; i++) {
        long long v = (t3[i] * p1[i] - 2LL * t2[i] * p2[i] + t1[i] * p3[i]) % MOD;
        if (v < 0) v += MOD;
        score[i] = v;
    }
    ntt(score, true);

    vector<int> matches;
    for (int i = 0; i <= n - m; i++) {
        if (score[m - 1 + i] == 0) matches.push_back(i);
    }

    cout << matches.size() << "\\n";
    for (size_t i = 0; i < matches.size(); i++) {
        if (i) cout << ' ';
        cout << matches[i];
    }
    cout << "\\n";
    return 0;
}`,
        rust: `use std::io::{self, Read};

const MOD: i64 = 998_244_353;

fn mod_pow(mut a: i64, mut e: i64) -> i64 {
    let mut r = 1i64;
    a = a.rem_euclid(MOD);
    while e > 0 {
        if (e & 1) == 1 { r = r * a % MOD; }
        a = a * a % MOD;
        e >>= 1;
    }
    r
}

fn ntt(a: &mut [i64], invert: bool) {
    let n = a.len();
    let mut j = 0usize;
    for i in 1..n {
        let mut bit = n >> 1;
        while (j & bit) != 0 { j ^= bit; bit >>= 1; }
        j ^= bit;
        if i < j { a.swap(i, j); }
    }
    let mut len = 2usize;
    while len <= n {
        let mut wlen = mod_pow(3, (MOD - 1) / (len as i64));
        if invert { wlen = mod_pow(wlen, MOD - 2); }
        let half = len >> 1;
        for i in (0..n).step_by(len) {
            let mut w = 1i64;
            for k in 0..half {
                let u = a[i + k];
                let v = a[i + k + half] * w % MOD;
                a[i + k] = if u + v >= MOD { u + v - MOD } else { u + v };
                a[i + k + half] = if u - v < 0 { u - v + MOD } else { u - v };
                w = w * wlen % MOD;
            }
        }
        len <<= 1;
    }
    if invert {
        let inv_n = mod_pow(n as i64, MOD - 2);
        for x in a.iter_mut() { *x = *x * inv_n % MOD; }
    }
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let t = match it.next() {
        Some(v) => v.as_bytes(),
        None => return,
    };
    let p = it.next().unwrap().as_bytes();
    let n = t.len();
    let m = p.len();
    if m > n {
        println!("0");
        return;
    }
    let sz = (n + m - 1).next_power_of_two();
    let mut t1 = vec![0i64; sz];
    let mut t2 = vec![0i64; sz];
    let mut t3 = vec![0i64; sz];
    let mut p1 = vec![0i64; sz];
    let mut p2 = vec![0i64; sz];
    let mut p3 = vec![0i64; sz];

    for i in 0..n {
        let v = if t[i] == b'?' { 0 } else { (t[i] - b'a' + 1) as i64 };
        t1[i] = v; t2[i] = v * v; t3[i] = v * v * v;
    }
    for j in 0..m {
        let ch = p[m - 1 - j];
        let v = if ch == b'?' { 0 } else { (ch - b'a' + 1) as i64 };
        p1[j] = v; p2[j] = v * v; p3[j] = v * v * v;
    }

    ntt(&mut t1, false); ntt(&mut t2, false); ntt(&mut t3, false);
    ntt(&mut p1, false); ntt(&mut p2, false); ntt(&mut p3, false);

    let mut score = vec![0i64; sz];
    for i in 0..sz {
        score[i] = (t3[i] * p1[i] - 2 * t2[i] * p2[i] + t1[i] * p3[i]).rem_euclid(MOD);
    }
    ntt(&mut score, true);

    let matches: Vec<String> = (0..=n - m)
        .filter(|&i| score[m - 1 + i] == 0)
        .map(|i| i.to_string())
        .collect();
    println!("{}", matches.len());
    println!("{}", matches.join(" "));
}`,
        java21: `import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

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
        String next() throws IOException {
            int c = rb();
            while (c >= 0 && c <= ' ') c = rb();
            if (c == -1) return null;
            StringBuilder sb = new StringBuilder();
            while (c > ' ') { sb.append((char) c); c = rb(); }
            return sb.toString();
        }
    }

    static final long MOD = 998244353L;

    static long modPow(long a, long e) {
        long r = 1;
        a %= MOD;
        while (e > 0) {
            if ((e & 1L) != 0) r = (r * a) % MOD;
            a = (a * a) % MOD;
            e >>= 1;
        }
        return r;
    }

    static void ntt(long[] a, boolean invert) {
        int n = a.length;
        for (int i = 1, j = 0; i < n; i++) {
            int bit = n >> 1;
            for (; (j & bit) != 0; bit >>= 1) j ^= bit;
            j ^= bit;
            if (i < j) { long t = a[i]; a[i] = a[j]; a[j] = t; }
        }
        for (int len = 2; len <= n; len <<= 1) {
            long wlen = modPow(3, (MOD - 1) / len);
            if (invert) wlen = modPow(wlen, MOD - 2);
            int half = len >> 1;
            for (int i = 0; i < n; i += len) {
                long w = 1;
                for (int j = 0; j < half; j++) {
                    long u = a[i + j], v = (a[i + j + half] * w) % MOD;
                    a[i + j] = (u + v >= MOD) ? (u + v - MOD) : (u + v);
                    a[i + j + half] = (u - v < 0) ? (u - v + MOD) : (u - v);
                    w = (w * wlen) % MOD;
                }
            }
        }
        if (invert) {
            long invN = modPow(n, MOD - 2);
            for (int i = 0; i < n; i++) a[i] = (a[i] * invN) % MOD;
        }
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        String T = fs.next();
        if (T == null) return;
        String P = fs.next();
        int n = T.length(), m = P.length();
        if (m > n) {
            System.out.println("0\\n");
            return;
        }
        int sz = 1;
        while (sz < n + m - 1) sz <<= 1;

        long[] t1 = new long[sz], t2 = new long[sz], t3 = new long[sz];
        long[] p1 = new long[sz], p2 = new long[sz], p3 = new long[sz];
        for (int i = 0; i < n; i++) {
            long v = (T.charAt(i) == '?') ? 0 : (T.charAt(i) - 'a' + 1);
            t1[i] = v; t2[i] = v * v; t3[i] = v * v * v;
        }
        for (int j = 0; j < m; j++) {
            char ch = P.charAt(m - 1 - j);
            long v = (ch == '?') ? 0 : (ch - 'a' + 1);
            p1[j] = v; p2[j] = v * v; p3[j] = v * v * v;
        }
        ntt(t1, false); ntt(t2, false); ntt(t3, false);
        ntt(p1, false); ntt(p2, false); ntt(p3, false);

        long[] score = new long[sz];
        for (int i = 0; i < sz; i++) {
            long v = (t3[i] * p1[i] - 2L * t2[i] * p2[i] + t1[i] * p3[i]) % MOD;
            if (v < 0) v += MOD;
            score[i] = v;
        }
        ntt(score, true);

        List<Integer> matches = new ArrayList<>();
        for (int i = 0; i <= n - m; i++) {
            if (score[m - 1 + i] == 0) matches.add(i);
        }
        StringBuilder sb = new StringBuilder();
        sb.append(matches.size()).append('\\n');
        for (int i = 0; i < matches.size(); i++) {
            if (i > 0) sb.append(' ');
            sb.append(matches.get(i));
        }
        sb.append('\\n');
        System.out.print(sb);
    }
}`,
        python3: `import sys

sys.setrecursionlimit(200000)

MOD = 998244353

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
        wlen = pow(3, (MOD - 1) // length, MOD)
        if invert:
            wlen = pow(wlen, MOD - 2, MOD)
        half = length >> 1
        for i in range(0, n, length):
            w = 1
            for k in range(half):
                u = a[i + k]
                v = (a[i + k + half] * w) % MOD
                a[i + k] = u + v - MOD if u + v >= MOD else u + v
                a[i + k + half] = u - v + MOD if u - v < 0 else u - v
                w = (w * wlen) % MOD
        length <<= 1
    if invert:
        inv_n = pow(n, MOD - 2, MOD)
        for i in range(n):
            a[i] = (a[i] * inv_n) % MOD

def solve() -> None:
    data = sys.stdin.read().split()
    if len(data) < 2:
        return
    T, P = data[0], data[1]
    n, m = len(T), len(P)
    if m > n:
        print("0\\n")
        return
    sz = 1 << (n + m - 2).bit_length()
    t1 = [0] * sz
    t2 = [0] * sz
    t3 = [0] * sz
    p1 = [0] * sz
    p2 = [0] * sz
    p3 = [0] * sz
    for i, ch in enumerate(T):
        v = 0 if ch == "?" else (ord(ch) - 96)
        t1[i], t2[i], t3[i] = v, v * v, v * v * v
    for j in range(m):
        ch = P[m - 1 - j]
        v = 0 if ch == "?" else (ord(ch) - 96)
        p1[j], p2[j], p3[j] = v, v * v, v * v * v

    for arr in (t1, t2, t3, p1, p2, p3):
        ntt(arr, False)

    score = [(t3[i] * p1[i] - 2 * t2[i] * p2[i] + t1[i] * p3[i]) % MOD for i in range(sz)]
    ntt(score, True)
    matches = [str(i) for i in range(n - m + 1) if score[m - 1 + i] == 0]
    print(len(matches))
    print(" ".join(matches))

if __name__ == "__main__":
    solve()`,
        ruby: `MOD = 998_244_353

def mod_pow(a, e)
  r = 1
  a %= MOD
  while e > 0
    r = (r * a) % MOD if (e & 1) == 1
    a = (a * a) % MOD
    e >>= 1
  end
  r
end

def ntt(a, invert)
  n = a.size
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
    wlen = mod_pow(3, (MOD - 1) / len)
    wlen = mod_pow(wlen, MOD - 2) if invert
    half = len >> 1
    (0...n).step(len) do |i|
      w = 1
      half.times do |k|
        u = a[i + k]
        v = (a[i + k + half] * w) % MOD
        a[i + k] = u + v >= MOD ? u + v - MOD : u + v
        a[i + k + half] = u - v < 0 ? u - v + MOD : u - v
        w = (w * wlen) % MOD
      end
    end
    len <<= 1
  end
  if invert
    inv_n = mod_pow(n, MOD - 2)
    a.map! { |x| (x * inv_n) % MOD }
  end
end

tokens = $stdin.read.split
exit if tokens.size < 2
t_str = tokens[0]
p_str = tokens[1]
n = t_str.length
m = p_str.length
if m > n
  puts "0\n"
  exit
end

sz = 1
sz <<= 1 while sz < n + m - 1
t1 = Array.new(sz, 0)
t2 = Array.new(sz, 0)
t3 = Array.new(sz, 0)
p1 = Array.new(sz, 0)
p2 = Array.new(sz, 0)
p3 = Array.new(sz, 0)

t_bytes = t_str.bytes
p_bytes = p_str.bytes
n.times do |i|
  v = t_bytes[i] == 63 ? 0 : (t_bytes[i] - 96)
  t1[i] = v
  t2[i] = v * v
  t3[i] = v * v * v
end
m.times do |j|
  b = p_bytes[m - 1 - j]
  v = b == 63 ? 0 : (b - 96)
  p1[j] = v
  p2[j] = v * v
  p3[j] = v * v * v
end

[t1, t2, t3, p1, p2, p3].each { |arr| ntt(arr, false) }
score = Array.new(sz) { |i| (t3[i] * p1[i] - 2 * t2[i] * p2[i] + t1[i] * p3[i]) % MOD }
ntt(score, true)
matches = (0..(n - m)).select { |i| score[m - 1 + i] == 0 }
puts matches.size
puts matches.join(" ")`,
      },
    },
    {
      id: 'ch25-p3',
      tier: 'Boss',
      ratingRange: '2350–2650',
      title: 'Subset Sum Count Distribution Modulo 998244353 (D&C NTT)',
      statement:
        'Given N positive integers a_1, ..., a_N whose total sum S = sum(a_i) <= 2 * 10^5, compute for every target sum s = 0..S the exact number of subsets whose elements sum to s, modulo 998244353.',
      constraints: '1 <= N <= 2 * 10^5, 1 <= a_i, sum(a_i) <= 2 * 10^5',
      sampleInput: '4\n1 2 1 3',
      sampleOutput: '1 2 2 2 2 1 1 1',
      hints: [
        'Each item `a_i` corresponds to the generating polynomial `P_i(x) = 1 + x^(a_i)`. The subset-sum distribution is simply the product `prod_{i=1}^N (1 + x^(a_i))`!',
        'Instead of multiplying sequentially in `O(N * S)`, build a binary divide-and-conquer product tree (or min-heap of polynomials by degree) with NTT! Total sum of degrees across all `O(log N)` levels is bounded by `O(S log S)`, yielding `O(S log^2 S)` total (or `O(S log S)` via exp/ln FPS).',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

static constexpr long long MOD = 998244353;

long long mod_pow(long long a, long long e) {
    long long r = 1;
    while (e > 0) {
        if (e & 1) r = r * a % MOD;
        a = a * a % MOD;
        e >>= 1;
    }
    return r;
}

void ntt(vector<long long>& a, bool invert) {
    int n = (int)a.size();
    for (int i = 1, j = 0; i < n; i++) {
        int bit = n >> 1;
        for (; j & bit; bit >>= 1) j ^= bit;
        j ^= bit;
        if (i < j) swap(a[i], a[j]);
    }
    for (int len = 2; len <= n; len <<= 1) {
        long long wlen = mod_pow(3, (MOD - 1) / len);
        if (invert) wlen = mod_pow(wlen, MOD - 2);
        int half = len >> 1;
        for (int i = 0; i < n; i += len) {
            long long w = 1;
            for (int j = 0; j < half; j++) {
                long long u = a[i + j], v = a[i + j + half] * w % MOD;
                a[i + j] = (u + v >= MOD) ? (u + v - MOD) : (u + v);
                a[i + j + half] = (u - v < 0) ? (u - v + MOD) : (u - v);
                w = w * wlen % MOD;
            }
        }
    }
    if (invert) {
        long long inv_n = mod_pow(n, MOD - 2);
        for (long long& x : a) x = x * inv_n % MOD;
    }
}

vector<long long> multiply(vector<long long> a, vector<long long> b) {
    int need = (int)a.size() + (int)b.size() - 1;
    if (min(a.size(), b.size()) <= 32) {
        vector<long long> res(need, 0);
        for (size_t i = 0; i < a.size(); i++) {
            for (size_t j = 0; j < b.size(); j++) {
                res[i + j] = (res[i + j] + a[i] * b[j]) % MOD;
            }
        }
        return res;
    }
    int n = 1;
    while (n < need) n <<= 1;
    a.resize(n, 0);
    b.resize(n, 0);
    ntt(a, false);
    ntt(b, false);
    for (int i = 0; i < n; i++) a[i] = a[i] * b[i] % MOD;
    ntt(a, true);
    a.resize(need);
    return a;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    if (!(cin >> n)) return 0;

    auto cmp = [](const vector<long long>& x, const vector<long long>& y) {
        return x.size() > y.size();
    };
    priority_queue<vector<long long>, vector<vector<long long>>, decltype(cmp)> pq(cmp);

    for (int i = 0; i < n; i++) {
        int a;
        cin >> a;
        vector<long long> poly(a + 1, 0);
        poly[0] = 1;
        poly[a] += 1;
        pq.push(move(poly));
    }

    while (pq.size() > 1) {
        auto p1 = move(const_cast<vector<long long>&>(pq.top()));
        pq.pop();
        auto p2 = move(const_cast<vector<long long>&>(pq.top()));
        pq.pop();
        pq.push(multiply(move(p1), move(p2)));
    }

    const auto& ans = pq.top();
    for (size_t i = 0; i < ans.size(); i++) {
        if (i) cout << ' ';
        cout << ans[i];
    }
    cout << "\\n";
    return 0;
}`,
        rust: `use std::cmp::Reverse;
use std::collections::BinaryHeap;
use std::io::{self, Read};

const MOD: i64 = 998_244_353;

fn mod_pow(mut a: i64, mut e: i64) -> i64 {
    let mut r = 1i64;
    a %= MOD;
    while e > 0 {
        if (e & 1) == 1 { r = r * a % MOD; }
        a = a * a % MOD;
        e >>= 1;
    }
    r
}

fn ntt(a: &mut [i64], invert: bool) {
    let n = a.len();
    let mut j = 0usize;
    for i in 1..n {
        let mut bit = n >> 1;
        while (j & bit) != 0 { j ^= bit; bit >>= 1; }
        j ^= bit;
        if i < j { a.swap(i, j); }
    }
    let mut len = 2usize;
    while len <= n {
        let mut wlen = mod_pow(3, (MOD - 1) / (len as i64));
        if invert { wlen = mod_pow(wlen, MOD - 2); }
        let half = len >> 1;
        for i in (0..n).step_by(len) {
            let mut w = 1i64;
            for k in 0..half {
                let u = a[i + k];
                let v = a[i + k + half] * w % MOD;
                a[i + k] = if u + v >= MOD { u + v - MOD } else { u + v };
                a[i + k + half] = if u - v < 0 { u - v + MOD } else { u - v };
                w = w * wlen % MOD;
            }
        }
        len <<= 1;
    }
    if invert {
        let inv_n = mod_pow(n as i64, MOD - 2);
        for x in a.iter_mut() { *x = *x * inv_n % MOD; }
    }
}

fn multiply(mut a: Vec<i64>, mut b: Vec<i64>) -> Vec<i64> {
    let need = a.len() + b.len() - 1;
    if a.len().min(b.len()) <= 32 {
        let mut res = vec![0i64; need];
        for (i, &x) in a.iter().enumerate() {
            for (j, &y) in b.iter().enumerate() {
                res[i + j] = (res[i + j] + x * y) % MOD;
            }
        }
        return res;
    }
    let n = need.next_power_of_two();
    a.resize(n, 0);
    b.resize(n, 0);
    ntt(&mut a, false);
    ntt(&mut b, false);
    for i in 0..n { a[i] = a[i] * b[i] % MOD; }
    ntt(&mut a, true);
    a.truncate(need);
    a
}

#[derive(Eq, PartialEq)]
struct PolyItem(Vec<i64>);
impl Ord for PolyItem {
    fn cmp(&self, other: &Self) -> std::cmp::Ordering {
        self.0.len().cmp(&other.0.len())
    }
}
impl PartialOrd for PolyItem {
    fn partial_cmp(&self, other: &Self) -> Option<std::cmp::Ordering> {
        Some(self.cmp(other))
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

    let mut pq = BinaryHeap::new();
    for _ in 0..n {
        let a: usize = it.next().unwrap().parse().unwrap();
        let mut poly = vec![0i64; a + 1];
        poly[0] = 1;
        poly[a] += 1;
        pq.push(Reverse(PolyItem(poly)));
    }

    while pq.len() > 1 {
        let Reverse(PolyItem(p1)) = pq.pop().unwrap();
        let Reverse(PolyItem(p2)) = pq.pop().unwrap();
        pq.push(Reverse(PolyItem(multiply(p1, p2))));
    }

    let ans = pq.pop().unwrap().0 .0;
    let out: Vec<String> = ans.iter().map(|x| x.to_string()).collect();
    println!("{}", out.join(" "));
}`,
        java21: `import java.io.IOException;
import java.io.InputStream;
import java.util.Comparator;
import java.util.PriorityQueue;

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
            int v = 0;
            while (c > ' ') { v = v * 10 + (c - '0'); c = rb(); }
            return v;
        }
    }

    static final long MOD = 998244353L;

    static long modPow(long a, long e) {
        long r = 1;
        a %= MOD;
        while (e > 0) {
            if ((e & 1L) != 0) r = (r * a) % MOD;
            a = (a * a) % MOD;
            e >>= 1;
        }
        return r;
    }

    static void ntt(long[] a, boolean invert) {
        int n = a.length;
        for (int i = 1, j = 0; i < n; i++) {
            int bit = n >> 1;
            for (; (j & bit) != 0; bit >>= 1) j ^= bit;
            j ^= bit;
            if (i < j) { long t = a[i]; a[i] = a[j]; a[j] = t; }
        }
        for (int len = 2; len <= n; len <<= 1) {
            long wlen = modPow(3, (MOD - 1) / len);
            if (invert) wlen = modPow(wlen, MOD - 2);
            int half = len >> 1;
            for (int i = 0; i < n; i += len) {
                long w = 1;
                for (int j = 0; j < half; j++) {
                    long u = a[i + j], v = (a[i + j + half] * w) % MOD;
                    a[i + j] = (u + v >= MOD) ? (u + v - MOD) : (u + v);
                    a[i + j + half] = (u - v < 0) ? (u - v + MOD) : (u - v);
                    w = (w * wlen) % MOD;
                }
            }
        }
        if (invert) {
            long invN = modPow(n, MOD - 2);
            for (int i = 0; i < n; i++) a[i] = (a[i] * invN) % MOD;
        }
    }

    static long[] multiply(long[] a, long[] b) {
        int need = a.length + b.length - 1;
        if (Math.min(a.length, b.length) <= 32) {
            long[] res = new long[need];
            for (int i = 0; i < a.length; i++) {
                for (int j = 0; j < b.length; j++) {
                    res[i + j] = (res[i + j] + a[i] * b[j]) % MOD;
                }
            }
            return res;
        }
        int n = 1;
        while (n < need) n <<= 1;
        long[] fa = new long[n], fb = new long[n];
        System.arraycopy(a, 0, fa, 0, a.length);
        System.arraycopy(b, 0, fb, 0, b.length);
        ntt(fa, false);
        ntt(fb, false);
        for (int i = 0; i < n; i++) fa[i] = (fa[i] * fb[i]) % MOD;
        ntt(fa, true);
        long[] res = new long[need];
        System.arraycopy(fa, 0, res, 0, need);
        return res;
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        int n = fs.nextInt();
        if (n == Integer.MIN_VALUE) return;
        PriorityQueue<long[]> pq = new PriorityQueue<>(Comparator.comparingInt(arr -> arr.length));
        for (int i = 0; i < n; i++) {
            int a = fs.nextInt();
            long[] poly = new long[a + 1];
            poly[0] = 1;
            poly[a] += 1;
            pq.add(poly);
        }
        while (pq.size() > 1) {
            pq.add(multiply(pq.poll(), pq.poll()));
        }
        long[] ans = pq.poll();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < ans.length; i++) {
            if (i > 0) sb.append(' ');
            sb.append(ans[i]);
        }
        System.out.println(sb);
    }
}`,
        python3: `import sys
import heapq

sys.setrecursionlimit(200000)

MOD = 998244353

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
        wlen = pow(3, (MOD - 1) // length, MOD)
        if invert:
            wlen = pow(wlen, MOD - 2, MOD)
        half = length >> 1
        for i in range(0, n, length):
            w = 1
            for k in range(half):
                u = a[i + k]
                v = (a[i + k + half] * w) % MOD
                a[i + k] = u + v - MOD if u + v >= MOD else u + v
                a[i + k + half] = u - v + MOD if u - v < 0 else u - v
                w = (w * wlen) % MOD
        length <<= 1
    if invert:
        inv_n = pow(n, MOD - 2, MOD)
        for i in range(n):
            a[i] = (a[i] * inv_n) % MOD

def multiply(a: list[int], b: list[int]) -> list[int]:
    need = len(a) + len(b) - 1
    if min(len(a), len(b)) <= 32:
        res = [0] * need
        for i, x in enumerate(a):
            if x:
                for j, y in enumerate(b):
                    res[i + j] = (res[i + j] + x * y) % MOD
        return res
    n = 1 << (need - 1).bit_length()
    fa = a + [0] * (n - len(a))
    fb = b + [0] * (n - len(b))
    ntt(fa, False)
    ntt(fb, False)
    for i in range(n):
        fa[i] = (fa[i] * fb[i]) % MOD
    ntt(fa, True)
    return fa[:need]

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    pq = []
    for i in range(n):
        a = int(data[1 + i])
        poly = [0] * (a + 1)
        poly[0] = 1
        poly[a] += 1
        heapq.heappush(pq, (len(poly), i, poly))

    uid = n
    while len(pq) > 1:
        _, _, p1 = heapq.heappop(pq)
        _, _, p2 = heapq.heappop(pq)
        prod = multiply(p1, p2)
        uid += 1
        heapq.heappush(pq, (len(prod), uid, prod))

    print(" ".join(map(str, pq[0][2])))

if __name__ == "__main__":
    solve()`,
        ruby: `MOD = 998_244_353

def mod_pow(a, e)
  r = 1
  a %= MOD
  while e > 0
    r = (r * a) % MOD if (e & 1) == 1
    a = (a * a) % MOD
    e >>= 1
  end
  r
end

def ntt(a, invert)
  n = a.size
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
    wlen = mod_pow(3, (MOD - 1) / len)
    wlen = mod_pow(wlen, MOD - 2) if invert
    half = len >> 1
    (0...n).step(len) do |i|
      w = 1
      half.times do |k|
        u = a[i + k]
        v = (a[i + k + half] * w) % MOD
        a[i + k] = u + v >= MOD ? u + v - MOD : u + v
        a[i + k + half] = u - v < 0 ? u - v + MOD : u - v
        w = (w * wlen) % MOD
      end
    end
    len <<= 1
  end
  if invert
    inv_n = mod_pow(n, MOD - 2)
    a.map! { |x| (x * inv_n) % MOD }
  end
end

def multiply(a, b)
  need = a.size + b.size - 1
  if [a.size, b.size].min <= 32
    res = Array.new(need, 0)
    a.each_with_index do |x, i|
      next if x == 0
      b.each_with_index { |y, j| res[i + j] = (res[i + j] + x * y) % MOD }
    end
    return res
  end
  n = 1
  n <<= 1 while n < need
  fa = a + Array.new(n - a.size, 0)
  fb = b + Array.new(n - b.size, 0)
  ntt(fa, false)
  ntt(fb, false)
  n.times { |i| fa[i] = (fa[i] * fb[i]) % MOD }
  ntt(fa, true)
  fa[0, need]
end

tokens = $stdin.read.split
exit if tokens.empty?
n = tokens[0].to_i
polys = Array.new(n) do |i|
  a = tokens[1 + i].to_i
  p = Array.new(a + 1, 0)
  p[0] = 1
  p[a] += 1
  p
end

dc_mul = nil
dc_mul = lambda do |l, r|
  return polys[l] if l == r
  mid = (l + r) >> 1
  multiply(dc_mul.call(l, mid), dc_mul.call(mid + 1, r))
end

puts dc_mul.call(0, n - 1).join(" ")`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'CSES',
      title: 'Apples and Bananas / Signal Processing',
      difficulty: 'Hard',
      url: 'https://cses.fi/problemset/task/2111',
      patternNote: 'Direct convolution (`A * B`) and reversed cross-correlation via FFT/NTT.',
    },
    {
      platform: 'AtCoder',
      title: 'ACL Practice F — Convolution (Mod 998244353)',
      difficulty: 'AtCoder Cyan / Blue (~1600)',
      url: 'https://atcoder.jp/contests/practice2/tasks/practice2_f',
      patternNote: 'Canonical 998244353 NTT speed and correctness benchmark (`N, M <= 524,288`).',
    },
    {
      platform: 'Codeforces',
      title: 'CF 954I — Yet Another String Matching / CF 1096G — Lucky Tickets',
      difficulty: '2200–2400 (Div.1)',
      url: 'https://codeforces.com/problemset/problem/1096/G',
      patternNote: 'Polynomial exponentiation via NTT and wildcard/alphabet mismatch convolutions.',
    },
    {
      platform: 'CodeChef',
      title: 'POLMUL / RNG — Polynomial Convolution & Subset Sums',
      difficulty: 'CodeChef 6-Star',
      url: 'https://www.codechef.com/problems/POLMUL',
      patternNote: 'Generating function products via divide-and-conquer NTT.',
    },
    {
      platform: 'HackerRank',
      title: 'Polynomial Multiplication / Arbitrary Mod Convolution',
      difficulty: 'Hard',
      url: 'https://www.hackerrank.com/challenges/fft-convolution/problem',
      patternNote: '3-prime NTT + Garner CRT reconstruction for arbitrary moduli.',
    },
    {
      platform: 'NeetCode 150',
      title: 'Multiply Strings / Coin Change Combinations',
      difficulty: 'Hard Scaling Extension',
      url: 'https://neetcode.io/practice',
      patternNote: 'Upgrades O(N^2) string multiplication and O(N*S) knapsack counts to O(N log N) FFT/NTT.',
    },
  ],
  interviewNotes: [
    'Why 998244353 appears everywhere in competitive programming: `998244353 = 119 * 2^23 + 1`, meaning its multiplicative group contains exact `2^k`-th roots of unity all the way up to `N = 8,388,608` with primitive root `g = 3` and zero floating-point drift.',
    'Explain bit-reversal Cooley-Tukey intuitively: splitting even/odd indices recursively across `log2(N)` levels places each element at the bit-reversed binary index of its original position, enabling an in-place, cache-friendly bottom-up butterfly loop.',
    'For arbitrary moduli like `10^9 + 7`, never trust naive 64-bit `double` FFT (`53` bits of precision); use 3 NTT primes (`998244353`, `167772161`, `469762049`, product `> 7 * 10^25`) combined via Garner’s CRT.',
  ],
  projectBlueprint: {
    title: 'High-Precision Symbolic Algebra & Polynomial Engine',
    tagline:
      'Multiply high-degree sparse/dense polynomials, compute exact big-integer products, and evaluate generating functions modulo 998244353 in O(N log N).',
    stackSummary: 'TypeScript Engine • Exact BigInt NTT (998244353) • 3-Prime Garner CRT • BigInt Adder/Multiplier',
    asciiDiagram: `Input Polynomials A(x), B(x) / BigInts
        |
        v
[ Power-of-2 Padding & Bit-Reversal Permutation ]
        |
        v
[ Iterative Butterfly Stages (w = g^((M-1)/len)) ]
        |
        v
Pointwise NTT(A) * NTT(B) ---> Inverse NTT (* N^(-1)) ---> Exact Coefficients / Carries`,
    milestones: [
      {
        id: 'ch25-m1',
        title: 'Build Exact BigInt Modular Arithmetic & NTT Transform Core',
        detail: 'Implement overflow-free `BigInt` modPow, bit-reversal swaps, and iterative butterfly stages over `MOD = 998244353n`.',
      },
      {
        id: 'ch25-m2',
        title: 'Add 3-Prime Garner CRT Lifting for Arbitrary Moduli',
        detail: 'Run parallel NTTs over `998244353`, `167772161`, and `469762049` to recover exact convolution coefficients up to `10^25` modulo any `M`.',
      },
      {
        id: 'ch25-m3',
        title: 'Implement Arbitrary-Precision Decimal Integer Multiplier',
        detail: 'Convolve base-10^4 digit chunks via NTT and normalize carries for instant 100,000-digit arithmetic.',
      },
      {
        id: 'ch25-m4',
        title: 'Add Divide-and-Conquer Generating Function Product Builder',
        detail: 'Multiply lists of sparse binomials `prod(1 + c_i x^(w_i))` in `O(S log^2 S)` for exact combinatorial distributions.',
      },
    ],
    starterCode: `const NTT_MOD = 998244353n;
const PRIMITIVE_ROOT = 3n;

function modPow(base: bigint, exp: bigint, mod: bigint): bigint {
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

export class SymbolicPolynomialEngine {
  static ntt(a: bigint[], invert: boolean, mod = NTT_MOD, g = PRIMITIVE_ROOT): void {
    const n = a.length;
    let j = 0;
    for (let i = 1; i < n; i++) {
      let bit = n >> 1;
      for (; (j & bit) !== 0; bit >>= 1) j ^= bit;
      j ^= bit;
      if (i < j) {
        const tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
      }
    }

    for (let len = 2; len <= n; len <<= 1) {
      let wlen = modPow(g, (mod - 1n) / BigInt(len), mod);
      if (invert) wlen = modPow(wlen, mod - 2n, mod);
      const half = len >> 1;
      for (let i = 0; i < n; i += len) {
        let w = 1n;
        for (let k = 0; k < half; k++) {
          const u = a[i + k];
          const v = (a[i + k + half] * w) % mod;
          let sum = u + v;
          if (sum >= mod) sum -= mod;
          let diff = u - v;
          if (diff < 0n) diff += mod;
          a[i + k] = sum;
          a[i + k + half] = diff;
          w = (w * wlen) % mod;
        }
      }
    }

    if (invert) {
      const invN = modPow(BigInt(n), mod - 2n, mod);
      for (let i = 0; i < n; i++) a[i] = (a[i] * invN) % mod;
    }
  }

  static multiplyMod(a: bigint[], b: bigint[], mod = NTT_MOD): bigint[] {
    if (a.length === 0 || b.length === 0) return [];
    const need = a.length + b.length - 1;
    let n = 1;
    while (n < need) n <<= 1;
    const fa = new Array<bigint>(n).fill(0n);
    const fb = new Array<bigint>(n).fill(0n);
    for (let i = 0; i < a.length; i++) fa[i] = ((a[i] % mod) + mod) % mod;
    for (let i = 0; i < b.length; i++) fb[i] = ((b[i] % mod) + mod) % mod;
    this.ntt(fa, false, mod);
    this.ntt(fb, false, mod);
    for (let i = 0; i < n; i++) fa[i] = (fa[i] * fb[i]) % mod;
    this.ntt(fa, true, mod);
    return fa.slice(0, need);
  }

  static multiplyBigIntegers(numA: string, numB: string): string {
    if (numA === '0' || numB === '0') return '0';
    const a = Array.from(numA).reverse().map((c) => BigInt(c));
    const b = Array.from(numB).reverse().map((c) => BigInt(c));
    const conv = this.multiplyMod(a, b);
    const digits: bigint[] = new Array(conv.length + 2).fill(0n);
    let carry = 0n;
    for (let i = 0; i < conv.length; i++) {
      const val = conv[i] + carry;
      digits[i] = val % 10n;
      carry = val / 10n;
    }
    let idx = conv.length;
    while (carry > 0n) {
      digits[idx++] = carry % 10n;
      carry /= 10n;
    }
    while (idx > 1 && digits[idx - 1] === 0n) idx--;
    return digits.slice(0, idx).reverse().join('');
  }
}`,
  },
};
