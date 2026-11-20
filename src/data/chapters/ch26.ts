import type { TheoryChapter } from '../../types/vault';

export const CH26_MATRIX_KITAMASA: TheoryChapter = {
  slug: 'matrix-exponentiation-linear-recurrence',
  topicId: 'ma-50',
  title: 'Matrix Exponentiation & Kitamasa Linear Recurrence',
  domain: 'Math, Number Theory & Algebra',
  ratingTier: '1600–1900',
  usacoDivision: 'Gold',
  subtitle:
    'Collapse O(N) DP transitions, K-step graph walks, and arbitrary order-K linear recurrences up to N = 10^18 down to O(K^3 log N) matrix powers and O(K^2 log N) Kitamasa polynomial remaindering.',
  analogyTitle: 'The Time-Warp Gear Ratio & Polynomial Shortcut Analogy',
  analogyBody:
    'Imagine an automaton whose tomorrow state depends linearly on today’s `K` variables—for example, `F(n) = F(n-1) + F(n-2)`. Stepping forward 1 day at a time takes `10^18` days—impossible in 1 second! Yet because the update rule is **the same linear matrix `T` every day**, advancing 2 days is `T^2`, 4 days is `T^4`, and 1,000,000,000,000,000,000 days takes only **60 binary squaring jumps**! Better yet, when `K` is 200 to 2,000 (where `K^3 log N` is too slow), **Kitamasa’s Algorithm** observes that computing `a_N` is equivalent to finding `x^N mod C(x)` (where `C(x)` is the recurrence’s characteristic polynomial) and dotting its `K` remainder coefficients with `[a_0, ..., a_{K-1}]`—slashing runtime from `O(K^3 log N)` to `O(K^2 log N)`!',
  prerequisites: [
    {
      slug: 'modular-arithmetic-fermat-crt',
      title: 'Modular Exponentiation, Extended GCD & CRT',
    },
  ],
  traceTitle: 'Interactive 2x2 Matrix Binary Exponentiation Jump Table & Kitamasa Trace',
  traceSubtitle:
    'Compute `F(13)` (`13 = 1101_2 = 8 + 4 + 1`) by squaring Fibonacci transition matrix `M = [[1, 1], [1, 0]]` across bits 0..3.',
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Step 1: Encode F(n) = F(n-1) + F(n-2) as Transition Matrix M & Target Bitmask 13 = 1101_2',
      explanation:
        'State vector [F(n), F(n-1)]^T updates via M = [[1, 1], [1, 0]]. Initialize result matrix Res = Identity [[1, 0], [0, 1]]. Binary decomposition of N = 13 is bit0=1, bit1=0, bit2=1, bit3=1.',
      mode: 'array',
      arrays: [
        {
          name: 'Matrix Res (Row-Major)',
          cells: [
            { index: 0, value: 1, label: 'R[0][0]', highlight: 'neutral' },
            { index: 1, value: 0, label: 'R[0][1]', highlight: 'neutral' },
            { index: 2, value: 0, label: 'R[1][0]', highlight: 'neutral' },
            { index: 3, value: 1, label: 'R[1][1]', highlight: 'neutral' },
          ],
        },
        {
          name: 'Base M^1 (Row-Major)',
          cells: [
            { index: 0, value: 1, label: 'M[0][0]', highlight: 'window' },
            { index: 1, value: 1, label: 'M[0][1]', highlight: 'window' },
            { index: 2, value: 1, label: 'M[1][0]', highlight: 'window' },
            { index: 3, value: 0, label: 'M[1][1]', highlight: 'window' },
          ],
        },
      ],
      variables: { RemainingN: 13, Binary: '1101', CurrentPower: 'M^1', 'ResExp': 0 },
    },
    {
      stepNumber: 2,
      title: 'Step 2: Bit 0 Is Set (13 & 1 == 1) -> Res *= M^1, Square M -> M^2',
      explanation:
        'Since bit 0 of 13 is 1, multiply Res = Res * M^1 = [[1, 1], [1, 0]]. Then square M = M * M = [[2, 1], [1, 1]] (representing M^2). Shift N >>= 1 -> 6.',
      mode: 'array',
      arrays: [
        {
          name: 'Res = M^1',
          cells: [
            { index: 0, value: 1, label: 'F2', highlight: 'updated' },
            { index: 1, value: 1, label: 'F1', highlight: 'updated' },
            { index: 2, value: 1, label: 'F1', highlight: 'updated' },
            { index: 3, value: 0, label: 'F0', highlight: 'updated' },
          ],
        },
        {
          name: 'M^2 = [[2,1],[1,1]]',
          cells: [
            { index: 0, value: 2, label: 'M2[0][0]', highlight: 'active' },
            { index: 1, value: 1, label: 'M2[0][1]', highlight: 'active' },
            { index: 2, value: 1, label: 'M2[1][0]', highlight: 'active' },
            { index: 3, value: 1, label: 'M2[1][1]', highlight: 'active' },
          ],
        },
      ],
      variables: { RemainingN: 6, BitUsed: '1 (applied)', ResExp: 1, NextMExp: 2 },
    },
    {
      stepNumber: 3,
      title: 'Step 3: Bit 1 Is 0 (Skip Res), Square M^2 -> M^4; Bit 2 Is 1 -> Res *= M^4 = M^5',
      explanation:
        'At N=6 (even), skip multiplying Res and square M^2 -> M^4 = [[5, 3], [3, 2]], N=3. Now N=3 is odd: Res = M^1 * M^4 = M^5 = [[8, 5], [5, 3]], then square M^4 -> M^8 = [[34, 21], [21, 13]]!',
      mode: 'array',
      arrays: [
        {
          name: 'Res = M^5',
          cells: [
            { index: 0, value: 8, label: 'F6', highlight: 'updated' },
            { index: 1, value: 5, label: 'F5', highlight: 'updated' },
            { index: 2, value: 5, label: 'F5', highlight: 'updated' },
            { index: 3, value: 3, label: 'F4', highlight: 'updated' },
          ],
        },
        {
          name: 'M^8',
          cells: [
            { index: 0, value: 34, label: 'F9', highlight: 'window' },
            { index: 1, value: 21, label: 'F8', highlight: 'window' },
            { index: 2, value: 21, label: 'F8', highlight: 'window' },
            { index: 3, value: 13, label: 'F7', highlight: 'window' },
          ],
        },
      ],
      variables: { RemainingN: 1, ResExp: '1 + 4 = 5', 'M^8_TopLeft': 34 },
    },
    {
      stepNumber: 4,
      title: 'Step 4: Final Bit 3 (N=1) -> Res = M^5 * M^8 = M^13 -> F(13) = Res[0][1] = 233!',
      explanation:
        'Multiply M^5 * M^8 = [[377, 233], [233, 144]]. Reading M^13[0][1] yields F(13) = 233 (and M^13[0][0] = F(14) = 377) in only 4 squarings and 3 multiplications!',
      mode: 'array',
      arrays: [
        {
          name: 'Final M^13',
          cells: [
            { index: 0, value: 377, label: 'F(14)', highlight: 'window' },
            { index: 1, value: 233, label: 'F(13)', highlight: 'active' },
            { index: 2, value: 233, label: 'F(13)', highlight: 'active' },
            { index: 3, value: 144, label: 'F(12)', highlight: 'neutral' },
          ],
        },
      ],
      variables: { RemainingN: 0, TotalMatrixMul: 6, 'F(13)': 233, 'F(12)': 144 },
    },
  ],
  reductionClues: [
    {
      clue: '"Compute DP[N] where N <= 10^18 and state size K <= 100 depends only on previous fixed window"',
      translation:
        'Express the linear transition `v_{t+1} = T * v_t` as a `K x K` matrix `T` and compute `T^N * v_0` in `O(K^3 log N)` time!',
    },
    {
      clue: '"Count number of paths of EXACT length L (L <= 10^18) between vertices u and v in directed graph"',
      translation:
        'Every entry `(A^L)[u][v]` of the `L`-th power of the adjacency matrix equals the exact number of walks of length `L` from `u` to `v`! (Swap `(+, *)` for `(min, +)` tropical semiring to compute exact-L-edge shortest paths!)',
    },
    {
      clue: '"Order-K linear recurrence a_n = sum_{i=1}^K c_i * a_{n-i}, where K <= 2000 and N <= 10^18"',
      translation:
        '`K = 2000` makes `O(K^3 log N)` TLE (`8 * 10^9 * 60`). Switch to **Kitamasa’s Algorithm** (`O(K^2 log N)`): compute `x^N mod (x^K - sum c_i x^{K-i})` via polynomial squaring and remaindering!',
    },
    {
      clue: '"Precompute 2^0, 2^1, ..., 2^59 matrix powers once, then answer Q = 10^5 vector queries v * M^(n_i)"',
      translation:
        'Multiplying a `1 x K` row vector by a precomputed `K x K` matrix costs only `O(K^2)` instead of `O(K^3)`—so 60 vector-matrix multiplies answer each query in `O(K^2 log N)`!',
    },
  ],
  timeComplexity: 'Matrix Exponentiation: O(K^3 log N) | Vector-Matrix Jump Table: O(K^3 log N + Q K^2 log N) | Kitamasa: O(K^2 log N)',
  spaceComplexity: 'Matrix: O(K^2) | Kitamasa: O(K)',
  pitfalls: [
    {
      type: 'TLE',
      title: 'Using Modulo Inside the Innermost Matrix-Multiply Loop Too Often',
      detail:
        'For `MOD = 10^9 + 7`, `MOD^2 ≈ 10^18 < 9.22 * 10^18` (unsigned/signed 64-bit max? Actually `8 * 10^18 < 2^63 - 1`, or safer: `MOD^2 < 1.000000014 * 10^18`, so 9 additions fit inside `int64`, or use `unsigned long long` / `__int128`!). Deferring `% MOD` or subtracting `if (sum >= 8ULL * MOD * MOD) sum -= 8ULL * MOD * MOD` runs 5x faster! Also iterate `i, k, j` order (not `i, j, k`) for contiguous L1 cache reads.',
    },
    {
      type: 'WA',
      title: 'Non-Commutativity Order (T^N * v_0 vs. v_0 * T^N) and Off-by-One Exponents',
      detail:
        'Matrix multiplication is NOT commutative! Always test `N = 0, 1, 2` by hand on paper before submitting. If `F(0) = 0, F(1) = 1`, `M^n` gives `F(n)` directly at `M^n[0][1]`, whereas `M^(n-1)` shifts indices by 1.',
    },
    {
      type: 'WA',
      title: 'Incorrect Tropical Identity in Min-Plus Shortest-Path Matrix Powers',
      detail:
        'For regular `(+, *)` matrix powers, the identity matrix has `1` on the diagonal and `0` elsewhere. For `(min, +)` shortest-walk matrix powers, the identity matrix has `0` on the diagonal and `+INF` everywhere else—forgetting that turns all 0-cost non-diagonal entries into 0-length shortcuts!',
    },
    {
      type: 'WA',
      title: 'Handling N < K Base Cases in Kitamasa Linear Recurrence',
      detail:
        'In Kitamasa, if queried `N < K`, return `init[N] % MOD` directly before building polynomial remainder `x^N mod C(x)`—otherwise modulo reduction assumes `N >= 0` with `init` padded cleanly.',
    },
  ],
  implementations: {
    cpp20: `#include <bits/stdc++.h>
using namespace std;

// Matrix Exponentiation (K^3 log N) + Kitamasa Linear Recurrence (K^2 log N)
// Time: O(K^2 log N) for Kitamasa | Space: O(K^2) / O(K)
static constexpr long long MOD = 1000000007LL;

struct Matrix {
    int n;
    vector<long long> m;
    Matrix(int n, bool ident = false) : n(n), m(n * n, 0) {
        if (ident) {
            for (int i = 0; i < n; i++) m[i * n + i] = 1;
        }
    }
    long long* operator[](int r) { return &m[r * n]; }
    const long long* operator[](int r) const { return &m[r * n]; }
};

Matrix mat_mul(const Matrix& A, const Matrix& B) {
    int n = A.n;
    Matrix C(n);
    for (int i = 0; i < n; i++) {
        for (int k = 0; k < n; k++) {
            long long aik = A[i][k];
            if (aik == 0) continue;
            for (int j = 0; j < n; j++) {
                C[i][j] = (C[i][j] + aik * B[k][j]) % MOD;
            }
        }
    }
    return C;
}

Matrix mat_pow(Matrix base, unsigned long long exp) {
    Matrix res(base.n, true);
    while (exp > 0) {
        if (exp & 1ULL) res = mat_mul(res, base);
        base = mat_mul(base, base);
        exp >>= 1;
    }
    return res;
}

// Kitamasa: given a[i] = sum_{j=1..k} c[j-1] * a[i-j] for i >= k, and init[0..k-1]
// Computes a[n] mod MOD in O(k^2 log n)
long long kitamasa(const vector<long long>& c, const vector<long long>& init, unsigned long long n) {
    int k = (int)c.size();
    if (n < (unsigned long long)k) return (init[n] % MOD + MOD) % MOD;

    auto poly_mul = [&](const vector<long long>& p, const vector<long long>& q) {
        vector<long long> t(2 * k, 0);
        for (int i = 0; i < k; i++) {
            if (p[i] == 0) continue;
            for (int j = 0; j < k; j++) {
                t[i + j] = (t[i + j] + p[i] * q[j]) % MOD;
            }
        }
        for (int i = 2 * k - 2; i >= k; i--) {
            if (t[i] == 0) continue;
            long long coeff = t[i];
            t[i] = 0;
            for (int j = 1; j <= k; j++) {
                t[i - j] = (t[i - j] + coeff * c[j - 1]) % MOD;
            }
        }
        t.resize(k);
        return t;
    };

    vector<long long> res(k, 0), base(k, 0);
    res[0] = 1;
    if (k > 1) {
        base[1] = 1;
    } else {
        base[0] = (c[0] % MOD + MOD) % MOD;
    }

    unsigned long long exp = n;
    while (exp > 0) {
        if (exp & 1ULL) res = poly_mul(res, base);
        base = poly_mul(base, base);
        exp >>= 1;
    }

    long long ans = 0;
    for (int i = 0; i < k; i++) {
        ans = (ans + res[i] * ((init[i] % MOD + MOD) % MOD)) % MOD;
    }
    return ans;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int k;
    unsigned long long n;
    if (!(cin >> k >> n)) return 0;
    vector<long long> init(k), c(k);
    for (int i = 0; i < k; i++) cin >> init[i];
    for (int i = 0; i < k; i++) cin >> c[i];

    cout << kitamasa(c, init, n) << "\\n";
    return 0;
}`,
    rust: `use std::io::{self, Read};

const MOD: i64 = 1_000_000_007;

fn kitamasa(c: &[i64], init: &[i64], mut n: u64) -> i64 {
    let k = c.len();
    if n < k as u64 {
        return init[n as usize].rem_euclid(MOD);
    }

    let poly_mul = |p: &[i64], q: &[i64]| -> Vec<i64> {
        let mut t = vec![0i64; 2 * k];
        for i in 0..k {
            if p[i] == 0 { continue; }
            for j in 0..k {
                t[i + j] = (t[i + j] + p[i] * q[j]) % MOD;
            }
        }
        for i in (k..=2 * k - 2).rev() {
            let coeff = t[i];
            if coeff == 0 { continue; }
            t[i] = 0;
            for j in 1..=k {
                t[i - j] = (t[i - j] + coeff * c[j - 1]) % MOD;
            }
        }
        t.truncate(k);
        t
    };

    let mut res = vec![0i64; k];
    let mut base = vec![0i64; k];
    res[0] = 1;
    if k > 1 {
        base[1] = 1;
    } else {
        base[0] = c[0].rem_euclid(MOD);
    }

    while n > 0 {
        if (n & 1) == 1 {
            res = poly_mul(&res, &base);
        }
        base = poly_mul(&base, &base);
        n >>= 1;
    }

    let mut ans = 0i64;
    for i in 0..k {
        ans = (ans + res[i] * init[i].rem_euclid(MOD)) % MOD;
    }
    ans
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
    let mut init = Vec::with_capacity(k);
    let mut c = Vec::with_capacity(k);
    for _ in 0..k { init.push(it.next().unwrap().parse().unwrap()); }
    for _ in 0..k { c.push(it.next().unwrap().parse::<i64>().unwrap().rem_euclid(MOD)); }
    println!("{}", kitamasa(&c, &init, n));
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
            while (c > ' ') { res = res * 10 + (c - '0'); c = readByte(); }
            return neg ? -res : res;
        }
        int nextInt() throws IOException { return (int) nextLong(); }
    }

    static final long MOD = 1_000_000_007L;

    static long[] polyMul(long[] p, long[] q, long[] c) {
        int k = c.length;
        long[] t = new long[2 * k];
        for (int i = 0; i < k; i++) {
            if (p[i] == 0) continue;
            for (int j = 0; j < k; j++) {
                t[i + j] = (t[i + j] + p[i] * q[j]) % MOD;
            }
        }
        for (int i = 2 * k - 2; i >= k; i--) {
            long coeff = t[i];
            if (coeff == 0) continue;
            t[i] = 0;
            for (int j = 1; j <= k; j++) {
                t[i - j] = (t[i - j] + coeff * c[j - 1]) % MOD;
            }
        }
        long[] res = new long[k];
        System.arraycopy(t, 0, res, 0, k);
        return res;
    }

    static long kitamasa(long[] c, long[] init, long n) {
        int k = c.length;
        if (n >= 0 && n < k) return ((init[(int) n] % MOD) + MOD) % MOD;
        long[] res = new long[k], base = new long[k];
        res[0] = 1;
        if (k > 1) base[1] = 1;
        else base[0] = c[0];

        long exp = n;
        while (exp != 0) {
            if ((exp & 1L) != 0) res = polyMul(res, base, c);
            base = polyMul(base, base, c);
            exp >>>= 1;
        }
        long ans = 0;
        for (int i = 0; i < k; i++) {
            ans = (ans + res[i] * (((init[i] % MOD) + MOD) % MOD)) % MOD;
        }
        return ans;
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        int k = fs.nextInt();
        if (k == Integer.MIN_VALUE) return;
        long n = fs.nextLong();
        long[] init = new long[k], c = new long[k];
        for (int i = 0; i < k; i++) init[i] = fs.nextLong();
        for (int i = 0; i < k; i++) c[i] = ((fs.nextLong() % MOD) + MOD) % MOD;
        System.out.println(kitamasa(c, init, n));
    }
}`,
    python3: `import sys

sys.setrecursionlimit(200000)

MOD = 1_000_000_007

def kitamasa(c: list[int], init: list[int], n: int) -> int:
    k = len(c)
    if n < k:
        return init[n] % MOD

    def poly_mul(p: list[int], q: list[int]) -> list[int]:
        t = [0] * (2 * k)
        for i in range(k):
            pi = p[i]
            if pi == 0:
                continue
            for j in range(k):
                t[i + j] = (t[i + j] + pi * q[j]) % MOD
        for i in range(2 * k - 2, k - 1, -1):
            coeff = t[i]
            if coeff == 0:
                continue
            t[i] = 0
            for j in range(1, k + 1):
                t[i - j] = (t[i - j] + coeff * c[j - 1]) % MOD
        return t[:k]

    res = [0] * k
    base = [0] * k
    res[0] = 1
    if k > 1:
        base[1] = 1
    else:
        base[0] = c[0] % MOD

    exp = n
    while exp > 0:
        if exp & 1:
            res = poly_mul(res, base)
        base = poly_mul(base, base)
        exp >>= 1

    return sum(res[i] * (init[i] % MOD) for i in range(k)) % MOD

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    k = int(next(it))
    n = int(next(it))
    init = [int(next(it)) for _ in range(k)]
    c = [int(next(it)) % MOD for _ in range(k)]
    print(kitamasa(c, init, n))

if __name__ == "__main__":
    solve()`,
    ruby: `MOD = 1_000_000_007

def poly_mul(p, q, c, k)
  t = Array.new(2 * k, 0)
  k.times do |i|
    pi = p[i]
    next if pi == 0
    k.times do |j|
      t[i + j] = (t[i + j] + pi * q[j]) % MOD
    end
  end
  (2 * k - 2).downto(k) do |i|
    coeff = t[i]
    next if coeff == 0
    t[i] = 0
    (1..k).each do |j|
      t[i - j] = (t[i - j] + coeff * c[j - 1]) % MOD
    end
  end
  t[0, k]
end

def kitamasa(c, init, n)
  k = c.size
  return init[n] % MOD if n < k
  res = Array.new(k, 0)
  base = Array.new(k, 0)
  res[0] = 1
  if k > 1
    base[1] = 1
  else
    base[0] = c[0] % MOD
  end
  exp = n
  while exp > 0
    res = poly_mul(res, base, c, k) if (exp & 1) == 1
    base = poly_mul(base, base, c, k)
    exp >>= 1
  end
  ans = 0
  k.times { |i| ans = (ans + res[i] * (init[i] % MOD)) % MOD }
  ans
end

tokens = $stdin.read.split
exit if tokens.empty?
k = tokens[0].to_i
n = tokens[1].to_i
init = Array.new(k) { |i| tokens[2 + i].to_i }
c = Array.new(k) { |i| tokens[2 + k + i].to_i % MOD }
puts kitamasa(c, init, n)`,
  },
  practiceProblems: [
    {
      id: 'ch26-p1',
      tier: 'Warmup',
      ratingRange: '1400–1650',
      title: 'N-th Fibonacci Number Modulo 10^9 + 7 in O(log N)',
      statement:
        'Given an integer N up to 10^18, compute the N-th Fibonacci number F(N) modulo 10^9 + 7, where F(0) = 0, F(1) = 1, and F(n) = F(n - 1) + F(n - 2).',
      constraints: '0 <= N <= 10^18',
      sampleInput: '10',
      sampleOutput: '55',
      hints: [
        'Raise the 2x2 matrix `[[1, 1], [1, 0]]` to power `N` via binary exponentiation (or use fast-doubling identities `F(2k) = F(k)*(2*F(k+1) - F(k))`).',
        'Notice `M^N[0][1]` directly equals `F(N)` even when `N = 0` (`Identity[0][1] = 0`).',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

static constexpr long long MOD = 1000000007LL;

struct Mat2 {
    long long a[2][2];
};

Mat2 mul(const Mat2& x, const Mat2& y) {
    Mat2 z{{{0, 0}, {0, 0}}};
    for (int i = 0; i < 2; i++) {
        for (int k = 0; k < 2; k++) {
            for (int j = 0; j < 2; j++) {
                z.a[i][j] = (z.a[i][j] + x.a[i][k] * y.a[k][j]) % MOD;
            }
        }
    }
    return z;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    unsigned long long n;
    if (!(cin >> n)) return 0;

    Mat2 res{{{1, 0}, {0, 1}}};
    Mat2 base{{{1, 1}, {1, 0}}};
    while (n > 0) {
        if (n & 1ULL) res = mul(res, base);
        base = mul(base, base);
        n >>= 1;
    }
    cout << res.a[0][1] << "\\n";
    return 0;
}`,
        rust: `use std::io::{self, Read};

const MOD: i64 = 1_000_000_007;

fn mul(a: [[i64; 2]; 2], b: [[i64; 2]; 2]) -> [[i64; 2]; 2] {
    let mut c = [[0i64; 2]; 2];
    for i in 0..2 {
        for k in 0..2 {
            for j in 0..2 {
                c[i][j] = (c[i][j] + a[i][k] * b[k][j]) % MOD;
            }
        }
    }
    c
}

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut n: u64 = match s.split_whitespace().next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };
    let mut res = [[1, 0], [0, 1]];
    let mut base = [[1, 1], [1, 0]];
    while n > 0 {
        if (n & 1) == 1 {
            res = mul(res, base);
        }
        base = mul(base, base);
        n >>= 1;
    }
    println!("{}", res[0][1]);
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
        long nextLong() throws IOException {
            int c = rb();
            while (c >= 0 && c <= ' ') c = rb();
            if (c == -1) return Long.MIN_VALUE;
            long v = 0;
            while (c > ' ') { v = v * 10 + (c - '0'); c = rb(); }
            return v;
        }
    }

    static final long MOD = 1_000_000_007L;

    static long[][] mul(long[][] x, long[][] y) {
        long[][] z = new long[2][2];
        for (int i = 0; i < 2; i++) {
            for (int k = 0; k < 2; k++) {
                for (int j = 0; j < 2; j++) {
                    z[i][j] = (z[i][j] + x[i][k] * y[k][j]) % MOD;
                }
            }
        }
        return z;
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        long n = fs.nextLong();
        if (n == Long.MIN_VALUE) return;
        long[][] res = {{1, 0}, {0, 1}};
        long[][] base = {{1, 1}, {1, 0}};
        while (n > 0) {
            if ((n & 1L) != 0) res = mul(res, base);
            base = mul(base, base);
            n >>>= 1;
        }
        System.out.println(res[0][1]);
    }
}`,
        python3: `import sys

sys.setrecursionlimit(200000)

MOD = 1_000_000_007

def mul(a: list[list[int]], b: list[list[int]]) -> list[list[int]]:
    return [
        [
            (a[0][0] * b[0][0] + a[0][1] * b[1][0]) % MOD,
            (a[0][0] * b[0][1] + a[0][1] * b[1][1]) % MOD,
        ],
        [
            (a[1][0] * b[0][0] + a[1][1] * b[1][0]) % MOD,
            (a[1][0] * b[0][1] + a[1][1] * b[1][1]) % MOD,
        ],
    ]

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    res = [[1, 0], [0, 1]]
    base = [[1, 1], [1, 0]]
    while n > 0:
        if n & 1:
            res = mul(res, base)
        base = mul(base, base)
        n >>= 1
    print(res[0][1])

if __name__ == "__main__":
    solve()`,
        ruby: `MOD = 1_000_000_007

def mul(a, b)
  [
    [
      (a[0][0] * b[0][0] + a[0][1] * b[1][0]) % MOD,
      (a[0][0] * b[0][1] + a[0][1] * b[1][1]) % MOD
    ],
    [
      (a[1][0] * b[0][0] + a[1][1] * b[1][0]) % MOD,
      (a[1][0] * b[0][1] + a[1][1] * b[1][1]) % MOD
    ]
  ]
end

tokens = $stdin.read.split
exit if tokens.empty?
n = tokens[0].to_i
res = [[1, 0], [0, 1]]
base = [[1, 1], [1, 0]]
while n > 0
  res = mul(res, base) if (n & 1) == 1
  base = mul(base, base)
  n >>= 1
end
puts res[0][1]`,
      },
    },
    {
      id: 'ch26-p2',
      tier: 'Standard',
      ratingRange: '1650–1850',
      title: 'Count Fixed-Length Directed Graph Walks (CSES Graph Paths I)',
      statement:
        'Given a directed graph with N vertices and M edges (multiple parallel edges allowed), count the number of paths from vertex 1 to vertex N consisting of EXACTLY K edges, modulo 10^9 + 7.',
      constraints: '1 <= N <= 100, 1 <= M <= N*(N-1), 1 <= K <= 10^9',
      sampleInput: '3 4 8\n1 2\n2 3\n3 1\n3 2',
      sampleOutput: '2',
      hints: [
        'Construct the `N x N` adjacency matrix `A` where `A[u][v]` counts the directed edges from `u` to `v` (note `+= 1`, NOT `= 1`, in case parallel edges exist).',
        'Raising `A` to power `K` gives `(A^K)[0][N - 1]`, the exact number of walks of length `K` from vertex `1` to `N` in `O(N^3 log K)` time.',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

static constexpr long long MOD = 1000000007LL;

struct Matrix {
    int n;
    vector<long long> a;
    Matrix(int n, bool ident = false) : n(n), a(n * n, 0) {
        if (ident) for (int i = 0; i < n; i++) a[i * n + i] = 1;
    }
};

Matrix mul(const Matrix& x, const Matrix& y) {
    int n = x.n;
    Matrix z(n);
    for (int i = 0; i < n; i++) {
        for (int k = 0; k < n; k++) {
            long long xik = x.a[i * n + k];
            if (!xik) continue;
            for (int j = 0; j < n; j++) {
                z.a[i * n + j] = (z.a[i * n + j] + xik * y.a[k * n + j]) % MOD;
            }
        }
    }
    return z;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, m;
    long long k;
    if (!(cin >> n >> m >> k)) return 0;

    Matrix adj(n), res(n, true);
    for (int i = 0; i < m; i++) {
        int u, v;
        cin >> u >> v;
        adj.a[(u - 1) * n + (v - 1)] += 1;
    }

    while (k > 0) {
        if (k & 1) res = mul(res, adj);
        adj = mul(adj, adj);
        k >>= 1;
    }
    cout << res.a[0 * n + (n - 1)] % MOD << "\\n";
    return 0;
}`,
        rust: `use std::io::{self, Read};

const MOD: i64 = 1_000_000_007;

fn mul(n: usize, a: &[i64], b: &[i64]) -> Vec<i64> {
    let mut c = vec![0i64; n * n];
    for i in 0..n {
        for k in 0..n {
            let aik = a[i * n + k];
            if aik == 0 { continue; }
            for j in 0..n {
                c[i * n + j] = (c[i * n + j] + aik * b[k * n + j]) % MOD;
            }
        }
    }
    c
}

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let n: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };
    let m: usize = it.next().unwrap().parse().unwrap();
    let mut k: u64 = it.next().unwrap().parse().unwrap();

    let mut adj = vec![0i64; n * n];
    for _ in 0..m {
        let u: usize = it.next().unwrap().parse::<usize>().unwrap() - 1;
        let v: usize = it.next().unwrap().parse::<usize>().unwrap() - 1;
        adj[u * n + v] += 1;
    }

    let mut res = vec![0i64; n * n];
    for i in 0..n { res[i * n + i] = 1; }

    while k > 0 {
        if (k & 1) == 1 { res = mul(n, &res, &adj); }
        adj = mul(n, &adj, &adj);
        k >>= 1;
    }
    println!("{}", res[n - 1] % MOD);
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
        long nextLong() throws IOException {
            int c = rb();
            while (c >= 0 && c <= ' ') c = rb();
            if (c == -1) return Long.MIN_VALUE;
            long v = 0;
            while (c > ' ') { v = v * 10 + (c - '0'); c = rb(); }
            return v;
        }
        int nextInt() throws IOException { return (int) nextLong(); }
    }

    static final long MOD = 1_000_000_007L;

    static long[] mul(int n, long[] a, long[] b) {
        long[] c = new long[n * n];
        for (int i = 0; i < n; i++) {
            for (int k = 0; k < n; k++) {
                long aik = a[i * n + k];
                if (aik == 0) continue;
                for (int j = 0; j < n; j++) {
                    c[i * n + j] = (c[i * n + j] + aik * b[k * n + j]) % MOD;
                }
            }
        }
        return c;
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        int n = fs.nextInt();
        if (n == Integer.MIN_VALUE) return;
        int m = fs.nextInt();
        long k = fs.nextLong();

        long[] adj = new long[n * n], res = new long[n * n];
        for (int i = 0; i < n; i++) res[i * n + i] = 1;
        for (int i = 0; i < m; i++) {
            int u = fs.nextInt() - 1, v = fs.nextInt() - 1;
            adj[u * n + v] += 1;
        }
        while (k > 0) {
            if ((k & 1L) != 0) res = mul(n, res, adj);
            adj = mul(n, adj, adj);
            k >>>= 1;
        }
        System.out.println(res[n - 1] % MOD);
    }
}`,
        python3: `import sys

sys.setrecursionlimit(200000)

MOD = 1_000_000_007

def mul(n: int, a: list[list[int]], b: list[list[int]]) -> list[list[int]]:
    c = [[0] * n for _ in range(n)]
    for i in range(n):
        ai = a[i]
        ci = c[i]
        for k in range(n):
            aik = ai[k]
            if aik:
                bk = b[k]
                for j in range(n):
                    ci[j] = (ci[j] + aik * bk[j]) % MOD
    return c

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    n = int(next(it))
    m = int(next(it))
    k = int(next(it))

    adj = [[0] * n for _ in range(n)]
    for _ in range(m):
        u = int(next(it)) - 1
        v = int(next(it)) - 1
        adj[u][v] += 1

    res = [[1 if i == j else 0 for j in range(n)] for i in range(n)]
    while k > 0:
        if k & 1:
            res = mul(n, res, adj)
        adj = mul(n, adj, adj)
        k >>= 1
    print(res[0][n - 1] % MOD)

if __name__ == "__main__":
    solve()`,
        ruby: `MOD = 1_000_000_007

def mul(n, a, b)
  c = Array.new(n) { Array.new(n, 0) }
  n.times do |i|
    n.times do |k|
      aik = a[i][k]
      next if aik == 0
      n.times do |j|
        c[i][j] = (c[i][j] + aik * b[k][j]) % MOD
      end
    end
  end
  c
end

tokens = $stdin.read.split
exit if tokens.empty?
n = tokens[0].to_i
m = tokens[1].to_i
k = tokens[2].to_i

adj = Array.new(n) { Array.new(n, 0) }
idx = 3
m.times do
  u = tokens[idx].to_i - 1
  v = tokens[idx + 1].to_i - 1
  idx += 2
  adj[u][v] += 1
end

res = Array.new(n) { |i| Array.new(n) { |j| i == j ? 1 : 0 } }
while k > 0
  res = mul(n, res, adj) if (k & 1) == 1
  adj = mul(n, adj, adj)
  k >>= 1
end
puts res[0][n - 1] % MOD`,
      },
    },
    {
      id: 'ch26-p3',
      tier: 'Boss',
      ratingRange: '1900–2250',
      title: 'Order-K Linear Recurrence Up to N = 10^18 via Kitamasa (O(K^2 log N))',
      statement:
        'A sequence a_0, a_1, ... of order K <= 1000 satisfies a_n = c_1 * a_{n-1} + c_2 * a_{n-2} + ... + c_K * a_{n-K} (mod 10^9 + 7) for all n >= K. Given initial terms a_0..a_{K-1}, coefficients c_1..c_K, and N <= 10^18, compute a_N mod (10^9 + 7) faster than O(K^3 log N).',
      constraints: '1 <= K <= 1000, 0 <= N <= 10^18, 0 <= a_i, c_i < 10^9 + 7',
      sampleInput: '3 6\n1 1 2\n1 0 1',
      sampleOutput: '9',
      hints: [
        'For K = 1000, `K^3 log N ≈ 6 * 10^10` times out, whereas Kitamasa takes `K^2 log N ≈ 6 * 10^7` operations and passes effortlessly!',
        'Write `poly_mul(P, Q)` computing `(P * Q) mod (x^K - sum_{j=1}^K c_j x^{K-j})`: multiply into a `2K` array, then sweep `i` from `2K - 2` down to `K` eliminating degree-`i` terms via `t[i - j] += t[i] * c[j - 1]`.',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

static constexpr long long MOD = 1000000007LL;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int k;
    unsigned long long n;
    if (!(cin >> k >> n)) return 0;

    vector<long long> init(k), c(k);
    for (int i = 0; i < k; i++) {
        cin >> init[i];
        init[i] = (init[i] % MOD + MOD) % MOD;
    }
    for (int i = 0; i < k; i++) {
        cin >> c[i];
        c[i] = (c[i] % MOD + MOD) % MOD;
    }

    if (n < (unsigned long long)k) {
        cout << init[n] << "\\n";
        return 0;
    }

    auto poly_mul = [&](const vector<long long>& p, const vector<long long>& q) {
        vector<long long> t(2 * k, 0);
        for (int i = 0; i < k; i++) {
            if (!p[i]) continue;
            for (int j = 0; j < k; j++) {
                t[i + j] = (t[i + j] + p[i] * q[j]) % MOD;
            }
        }
        for (int i = 2 * k - 2; i >= k; i--) {
            long long coeff = t[i];
            if (!coeff) continue;
            t[i] = 0;
            for (int j = 1; j <= k; j++) {
                t[i - j] = (t[i - j] + coeff * c[j - 1]) % MOD;
            }
        }
        t.resize(k);
        return t;
    };

    vector<long long> res(k, 0), base(k, 0);
    res[0] = 1;
    if (k > 1) base[1] = 1;
    else base[0] = c[0];

    while (n > 0) {
        if (n & 1ULL) res = poly_mul(res, base);
        base = poly_mul(base, base);
        n >>= 1;
    }

    long long ans = 0;
    for (int i = 0; i < k; i++) {
        ans = (ans + res[i] * init[i]) % MOD;
    }
    cout << ans << "\\n";
    return 0;
}`,
        rust: `use std::io::{self, Read};

const MOD: i64 = 1_000_000_007;

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let k: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };
    let mut n: u64 = it.next().unwrap().parse().unwrap();
    let mut init = Vec::with_capacity(k);
    let mut c = Vec::with_capacity(k);
    for _ in 0..k { init.push(it.next().unwrap().parse::<i64>().unwrap().rem_euclid(MOD)); }
    for _ in 0..k { c.push(it.next().unwrap().parse::<i64>().unwrap().rem_euclid(MOD)); }

    if n < k as u64 {
        println!("{}", init[n as usize]);
        return;
    }

    let poly_mul = |p: &[i64], q: &[i64]| -> Vec<i64> {
        let mut t = vec![0i64; 2 * k];
        for i in 0..k {
            if p[i] == 0 { continue; }
            for j in 0..k {
                t[i + j] = (t[i + j] + p[i] * q[j]) % MOD;
            }
        }
        for i in (k..=2 * k - 2).rev() {
            let coeff = t[i];
            if coeff == 0 { continue; }
            t[i] = 0;
            for j in 1..=k {
                t[i - j] = (t[i - j] + coeff * c[j - 1]) % MOD;
            }
        }
        t.truncate(k);
        t
    };

    let mut res = vec![0i64; k];
    let mut base = vec![0i64; k];
    res[0] = 1;
    if k > 1 { base[1] = 1; } else { base[0] = c[0]; }

    while n > 0 {
        if (n & 1) == 1 { res = poly_mul(&res, &base); }
        base = poly_mul(&base, &base);
        n >>= 1;
    }

    let mut ans = 0i64;
    for i in 0..k { ans = (ans + res[i] * init[i]) % MOD; }
    println!("{}", ans);
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
        long nextLong() throws IOException {
            int c = rb();
            while (c >= 0 && c <= ' ') c = rb();
            if (c == -1) return Long.MIN_VALUE;
            boolean neg = false;
            if (c == '-') { neg = true; c = rb(); }
            long v = 0;
            while (c > ' ') { v = v * 10 + (c - '0'); c = rb(); }
            return neg ? -v : v;
        }
        int nextInt() throws IOException { return (int) nextLong(); }
    }

    static final long MOD = 1_000_000_007L;

    static long[] polyMul(long[] p, long[] q, long[] c, int k) {
        long[] t = new long[2 * k];
        for (int i = 0; i < k; i++) {
            if (p[i] == 0) continue;
            for (int j = 0; j < k; j++) t[i + j] = (t[i + j] + p[i] * q[j]) % MOD;
        }
        for (int i = 2 * k - 2; i >= k; i--) {
            long coeff = t[i];
            if (coeff == 0) continue;
            t[i] = 0;
            for (int j = 1; j <= k; j++) t[i - j] = (t[i - j] + coeff * c[j - 1]) % MOD;
        }
        long[] res = new long[k];
        System.arraycopy(t, 0, res, 0, k);
        return res;
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        int k = fs.nextInt();
        if (k == Integer.MIN_VALUE) return;
        long n = fs.nextLong();
        long[] init = new long[k], c = new long[k];
        for (int i = 0; i < k; i++) init[i] = ((fs.nextLong() % MOD) + MOD) % MOD;
        for (int i = 0; i < k; i++) c[i] = ((fs.nextLong() % MOD) + MOD) % MOD;
        if (n < k) {
            System.out.println(init[(int) n]);
            return;
        }
        long[] res = new long[k], base = new long[k];
        res[0] = 1;
        if (k > 1) base[1] = 1; else base[0] = c[0];
        while (n > 0) {
            if ((n & 1L) != 0) res = polyMul(res, base, c, k);
            base = polyMul(base, base, c, k);
            n >>>= 1;
        }
        long ans = 0;
        for (int i = 0; i < k; i++) ans = (ans + res[i] * init[i]) % MOD;
        System.out.println(ans);
    }
}`,
        python3: `import sys

sys.setrecursionlimit(200000)

MOD = 1_000_000_007

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    k = int(next(it))
    n = int(next(it))
    init = [int(next(it)) % MOD for _ in range(k)]
    c = [int(next(it)) % MOD for _ in range(k)]

    if n < k:
        print(init[n])
        return

    def poly_mul(p: list[int], q: list[int]) -> list[int]:
        t = [0] * (2 * k)
        for i in range(k):
            pi = p[i]
            if pi == 0:
                continue
            for j in range(k):
                t[i + j] = (t[i + j] + pi * q[j]) % MOD
        for i in range(2 * k - 2, k - 1, -1):
            coeff = t[i]
            if coeff == 0:
                continue
            t[i] = 0
            for j in range(1, k + 1):
                t[i - j] = (t[i - j] + coeff * c[j - 1]) % MOD
        return t[:k]

    res = [0] * k
    base = [0] * k
    res[0] = 1
    if k > 1:
        base[1] = 1
    else:
        base[0] = c[0]

    while n > 0:
        if n & 1:
            res = poly_mul(res, base)
        base = poly_mul(base, base)
        n >>= 1

    print(sum(res[i] * init[i] for i in range(k)) % MOD)

if __name__ == "__main__":
    solve()`,
        ruby: `MOD = 1_000_000_007

tokens = $stdin.read.split
exit if tokens.empty?
k = tokens[0].to_i
n = tokens[1].to_i
init = Array.new(k) { |i| tokens[2 + i].to_i % MOD }
c = Array.new(k) { |i| tokens[2 + k + i].to_i % MOD }

if n < k
  puts init[n]
  exit
end

poly_mul = lambda do |p, q|
  t = Array.new(2 * k, 0)
  k.times do |i|
    pi = p[i]
    next if pi == 0
    k.times { |j| t[i + j] = (t[i + j] + pi * q[j]) % MOD }
  end
  (2 * k - 2).downto(k) do |i|
    coeff = t[i]
    next if coeff == 0
    t[i] = 0
    (1..k).each { |j| t[i - j] = (t[i - j] + coeff * c[j - 1]) % MOD }
  end
  t[0, k]
end

res = Array.new(k, 0)
base = Array.new(k, 0)
res[0] = 1
if k > 1
  base[1] = 1
else
  base[0] = c[0]
end

while n > 0
  res = poly_mul.call(res, base) if (n & 1) == 1
  base = poly_mul.call(base, base)
  n >>= 1
end

ans = 0
k.times { |i| ans = (ans + res[i] * init[i]) % MOD }
puts ans`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'CSES',
      title: 'Fibonacci Numbers, Graph Paths I & Graph Paths II',
      difficulty: 'Medium / Hard',
      url: 'https://cses.fi/problemset/task/1723',
      patternNote: 'Matrix binary exponentiation for `(+, *)` path counting AND `(min, +)` tropical shortest paths.',
    },
    {
      platform: 'AtCoder',
      title: 'EDPC R — Walk / ABC 236 G — Good Vertices',
      difficulty: 'AtCoder Blue (~1600)',
      url: 'https://atcoder.jp/contests/dp/tasks/dp_r',
      patternNote: 'Total length-K walks across all pairs via `A^K` in `O(N^3 log K)`.',
    },
    {
      platform: 'Codeforces',
      title: 'CF 1117D — Magic Gems / CF 718C — Sasha and Array',
      difficulty: '1900–2200 (Div.1)',
      url: 'https://codeforces.com/problemset/problem/1117/D',
      patternNote: 'Order-M linear recurrence up to `10^18` solved via `O(M^3 log N)` or Kitamasa `O(M^2 log N)`.',
    },
    {
      platform: 'CodeChef',
      title: 'RNG — Random Number Generator',
      difficulty: 'CodeChef 6-Star',
      url: 'https://www.codechef.com/problems/RNG',
      patternNote: 'Flagship Kitamasa / Bostan-Mori benchmark (`K <= 30,000, N <= 10^18`).',
    },
    {
      platform: 'HackerRank',
      title: 'Matrix Power Series / Linear Algebra Foundations',
      difficulty: 'Medium / Hard',
      url: 'https://www.hackerrank.com/challenges/matrix-power-series/problem',
      patternNote: 'Block-augmented transition matrices `[A, 0; I, I]` for prefix sums of matrix powers `A + A^2 + ... + A^K`.',
    },
    {
      platform: 'NeetCode 150',
      title: 'Climbing Stairs / House Robber / Knight Dialer',
      difficulty: 'Medium -> O(log N) Upgrade',
      url: 'https://neetcode.io/practice',
      patternNote: 'Turns standard `O(N)` 1D DP interviews into `O(log N)` closed-form transition matrix powers.',
    },
  ],
  interviewNotes: [
    'How to encode constant shifts inside a matrix (e.g., `dp[i] = 2*dp[i-1] + 5`): append a dummy `1` entry to the state vector `[dp[i], 1]^T`, expanding the transition matrix by just +1 row and column.',
    'Explain why Kitamasa beats Matrix Exponentiation for large `K`: `T^N` computes ALL `K^2` entries of the operator, whereas Kitamasa reduces the univariate polynomial `x^N mod C(x)` directly, dropping `K^3` to `K^2` (and `K log K` with NTT!).',
    'Always mention the `(min, +)` tropical semiring generalization: because `min` distributes over `+`, adjacency matrix powers over `(min, +)` yield exact K-edge shortest paths without changing the binary exponentiation loop.',
  ],
  projectBlueprint: {
    title: 'Markov Chain Simulation & Transition Probability Analyzer',
    tagline:
      'Forecast long-horizon state distributions, absorbing hitting probabilities, and multi-step steady-state convergence in O(S^3 log T) without Monte Carlo noise.',
    stackSummary: 'TypeScript Engine • Stochastic Transition Matrix • Binary Exponentiator • Steady-State Convergence Checker',
    asciiDiagram: `State Space [S_0, S_1, ..., S_{K-1}] + Transition Matrix P (rows sum to 1)
         |
         v
[ Binary Squaring Power P^T  (60 steps reach T = 10^18) ]
         |
         v
Vector Distribution v_T = v_0 * P^T  ---> Absorption Probabilities & Entropy Drift`,
    milestones: [
      {
        id: 'ch26-m1',
        title: 'Build Cache-Friendly Float64 Matrix Squaring Core',
        detail: 'Implement `i-k-j` matrix multiplication and binary exponentiation over stochastic matrices with row-sum normalization.',
      },
      {
        id: 'ch26-m2',
        title: 'Add Exact Modular Walk & Recurrence Evaluator',
        detail: 'Support discrete integer counting (`BigInt` mod `10^9+7`) alongside continuous probability distributions for combinatorial Markov chains.',
      },
      {
        id: 'ch26-m3',
        title: 'Implement O(K^2 log T) Vector Jump Table for Interactive Horizons',
        detail: 'Precompute `[P^1, P^2, P^4, ...]` once so querying any forecast step `t` runs in `O(K^2 log t)` vector-matrix products.',
      },
      {
        id: 'ch26-m4',
        title: 'Detect Steady-State Equilibrium & Absorbing States',
        detail: 'Measure L1 norm delta between successive powers `P^(2^k)` and `P^(2^(k+1))` to report exact mixing time.',
      },
    ],
    starterCode: `export interface MarkovForecast {
  horizonSteps: number;
  distribution: number[];
  maxStateDrift: number;
  dominantStateIndex: number;
}

export class MarkovTransitionAnalyzer {
  static multiplyStochastic(a: Float64Array, b: Float64Array, n: number): Float64Array {
    const c = new Float64Array(n * n);
    for (let i = 0; i < n; i++) {
      for (let k = 0; k < n; k++) {
        const aik = a[i * n + k];
        if (aik === 0) continue;
        for (let j = 0; j < n; j++) {
          c[i * n + j] += aik * b[k * n + j];
        }
      }
    }
    return c;
  }

  static forecastDistribution(
    initialDist: number[],
    transitionMatrix: number[][],
    steps: number
  ): MarkovForecast {
    const n = initialDist.length;
    let res = new Float64Array(n * n);
    for (let i = 0; i < n; i++) res[i * n + i] = 1.0;

    let base = new Float64Array(n * n);
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) base[i * n + j] = transitionMatrix[i][j];
    }

    let rem = Math.floor(steps);
    while (rem > 0) {
      if ((rem & 1) === 1) res = this.multiplyStochastic(res, base, n);
      base = this.multiplyStochastic(base, base, n);
      rem = Math.floor(rem / 2);
    }

    const out = new Array<number>(n).fill(0);
    for (let i = 0; i < n; i++) {
      if (initialDist[i] === 0) continue;
      for (let j = 0; j < n; j++) out[j] += initialDist[i] * res[i * n + j];
    }

    let maxDrift = 0;
    for (let j = 0; j < n; j++) {
      let nextStepProb = 0;
      for (let i = 0; i < n; i++) nextStepProb += out[i] * transitionMatrix[i][j];
      maxDrift = Math.max(maxDrift, Math.abs(nextStepProb - out[j]));
    }

    let dominantStateIndex = 0;
    for (let i = 1; i < n; i++) {
      if (out[i] > out[dominantStateIndex]) dominantStateIndex = i;
    }

    return {
      horizonSteps: steps,
      distribution: out,
      maxStateDrift: maxDrift,
      dominantStateIndex,
    };
  }
}`,
  },
};
