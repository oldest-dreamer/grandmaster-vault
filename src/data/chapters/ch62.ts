import type { TheoryChapter } from '../../types/vault';

export const CH62_LAGRANGE_BERLEKAMP_MASSEY: TheoryChapter = {
  slug: 'lagrange-interpolation-berlekamp-massey',
  topicId: 'ma-57',
  title: 'Lagrange Interpolation & Berlekamp-Massey',
  domain: 'Math, Number Theory & Algebra',
  ratingTier: '2200–2600',
  usacoDivision: 'Platinum',
  subtitle: 'O(D) consecutive-point polynomial extrapolation and automated minimal linear recurrence discovery with Bostan-Mori',
  analogyTitle: 'Reverse-Engineering a Locked Machine from Its First Few Outputs',
  analogyBody:
    'Suppose a black-box counting DP has an astronomical parameter N = 10^18, making direct tabulation hopeless—yet you suspect the answer behaves either like a low-degree polynomial P(N) or satisfies a compact linear recurrence s_n = sum c_j s_{n-j}.\n\nIf it is a degree-D polynomial, evaluating just D + 1 consecutive small cases y_0, y_1, ..., y_D uniquely locks the entire curve. Consecutive-x Lagrange interpolation bypasses O(D^3) Gaussian elimination and evaluates P(N) directly in O(D) time using prefix products, suffix products, and inverse factorials.\n\nWhen the black box is instead a linear recurrence of unknown order L (such as grid DP with small constant width, or tree/automaton paths), Berlekamp-Massey acts like an automated algebraic sleuth: feed it the first ~2L terms, and in O(L^2) time it extracts the exact shortest recurrence. Pairing that with Bostan-Mori ([x^N] P(x)/Q(x)) jumps straight to term 10^18 in O(L^2 log N) time.',
  prerequisites: [
    { slug: 'matrix-exponentiation-linear-recurrence', title: 'Matrix Exponentiation & Kitamasa Linear Recurrence' },
  ],
  traceTitle: 'Berlekamp-Massey Minimal Recurrence Discovery',
  traceSubtitle: 'Tracking candidate recurrence cur and failure pivot best over prefix [1, 1, 2, 3, 5, 8]',
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Step i = 0 (s[0] = 1): Initial Non-Zero Witness',
      explanation: 'At i = 0, current recurrence is empty so predicted value is 0 and discrepancy delta = 1 - 0 = 1. Initialize cur = [0] (order 1) and record bestPos = 0, bestDelta = 1.',
      mode: 'array',
      arrays: [
        {
          name: 'Sequence s[0..5]',
          cells: [
            { index: 0, value: 1, label: 's[0] (curr)', highlight: 'active' },
            { index: 1, value: 1, label: 's[1]', highlight: 'neutral' },
            { index: 2, value: 2, label: 's[2]', highlight: 'neutral' },
            { index: 3, value: 3, label: 's[3]', highlight: 'neutral' },
            { index: 4, value: 5, label: 's[4]', highlight: 'neutral' },
            { index: 5, value: 8, label: 's[5]', highlight: 'neutral' },
          ],
        },
      ],
      variables: { delta: 1, cur: '[0]', best: '[]', bestPos: 0, bestDelta: 1 },
    },
    {
      stepNumber: 2,
      title: 'Step i = 1 (s[1] = 1): First Order Update',
      explanation: 'Predicted eval = 0 * s[0] = 0, so delta = 1. Shift delta/bestDelta = 1 by (i - bestPos - 1) = 0 zeros to form cand = [1]. Adding cand sets cur = [1] without increasing order.',
      mode: 'array',
      arrays: [
        {
          name: 'Sequence s[0..5]',
          cells: [
            { index: 0, value: 1, label: 's[0]', highlight: 'neutral' },
            { index: 1, value: 1, label: 's[1] (curr)', highlight: 'active' },
            { index: 2, value: 2, label: 's[2]', highlight: 'neutral' },
            { index: 3, value: 3, label: 's[3]', highlight: 'neutral' },
            { index: 4, value: 5, label: 's[4]', highlight: 'neutral' },
            { index: 5, value: 8, label: 's[5]', highlight: 'neutral' },
          ],
        },
      ],
      variables: { eval: 0, delta: 1, cand: '[1]', cur: '[1]', bestPos: 0 },
    },
    {
      stepNumber: 3,
      title: 'Step i = 2 (s[2] = 2): Order Jumps from 1 to 2',
      explanation: 'Predicted eval = 1 * s[1] = 1, leaving delta = 2 - 1 = 1. Shift by (2 - 0 - 1) = 1 zero: cand = [0, 1]. Because len(cand) > len(cur), snapshot old cur into best = [1], set bestPos = 2, and update cur = [1, 1].',
      mode: 'array',
      arrays: [
        {
          name: 'Discovered Recurrence cur',
          cells: [
            { index: 0, value: 1, label: 'c[0]', highlight: 'updated' },
            { index: 1, value: 1, label: 'c[1]', highlight: 'updated' },
          ],
        },
      ],
      variables: { eval: 1, delta: 1, cur: '[1, 1]', best: '[1]', bestPos: 2 },
    },
    {
      stepNumber: 4,
      title: 'Steps i = 3, 4, 5: Zero Discrepancies Confirm Recurrence',
      explanation: 'Evaluating cur = [1, 1] predicts s[3] = 2+1 = 3 (delta 0), s[4] = 3+2 = 5 (delta 0), and s[5] = 5+3 = 8 (delta 0). The minimal recurrence s[n] = s[n-1] + s[n-2] is locked.',
      mode: 'array',
      arrays: [
        {
          name: 'Verified Terms [3..5]',
          cells: [
            { index: 3, value: 3, label: 'delta=0', highlight: 'window' },
            { index: 4, value: 5, label: 'delta=0', highlight: 'window' },
            { index: 5, value: 8, label: 'delta=0', highlight: 'window' },
          ],
        },
      ],
      variables: { orderL: 2, recurrence: 's[n] = 1*s[n-1] + 1*s[n-2]' },
    },
  ],
  reductionClues: [
    {
      clue: 'Answer is a degree-D polynomial P(N) for huge N <= 10^9..10^18 where y_0..y_D can be simulated cleanly',
      translation: 'Use O(D) consecutive-point Lagrange interpolation with prefix/suffix (N - i) products and inverse factorials.',
    },
    {
      clue: 'Sum of K-th powers sum_{i=1..N} i^K with K <= 10^6 and N <= 10^18',
      translation: 'Prefix sums of degree-K polynomials form a degree-(K+1) polynomial; evaluate K+2 points via linear sieve + O(K) Lagrange.',
    },
    {
      clue: 'DP state transitions depend on fixed small width or bounded depth, yielding a linear recurrence whose transition matrix is tedious to derive by hand',
      translation: 'Compute the first ~2L + 10 terms with brute-force DP, pass them to Berlekamp-Massey, and extrapolate to N with Bostan-Mori.',
    },
    {
      clue: 'Need [x^N] P(x)/Q(x) for N <= 10^18 without FFT or complex Kitamasa shifts',
      translation: 'Bostan-Mori splits P(x)Q(-x) and Q(x)Q(-x) by parity and halves N each step in O(d^2 log N) with ~25 lines of code.',
    },
  ],
  timeComplexity: 'O(D + log MOD) for consecutive Lagrange; O(M^2) for Berlekamp-Massey + O(d^2 log N) for Bostan-Mori',
  spaceComplexity: 'O(D) for Lagrange precomputation; O(M) for Berlekamp-Massey and Bostan-Mori',
  pitfalls: [
    {
      type: 'WA',
      title: 'Feeding Fewer Than 2L Terms into Berlekamp-Massey',
      detail: 'If the minimal recurrence has order L, Berlekamp-Massey theoretically requires at least 2L terms to guarantee uniqueness. Supplying too few terms causes BM to hallucinate an overfitted shorter recurrence that diverges on term 2L.',
    },
    {
      type: 'WA',
      title: 'Forgetting Sign Alternation (-1)^(D - i) in Consecutive Lagrange',
      detail: 'The denominator of the i-th Lagrange basis polynomial over {0, 1, ..., D} is prod_{j != i} (i - j) = i! * (D - i)! * (-1)^(D - i). Omitting (-1)^(D - i) corrupts every odd-distance term.',
    },
    {
      type: 'RE',
      title: 'Division by Zero When Evaluating Lagrange at X <= D',
      detail: 'Prefix and suffix products cancel out (X - X) only if you return y[X] early whenever 0 <= X <= D. Trying to compute prefix * suffix / (X - i) directly when X matches a node fails.',
    },
    {
      type: 'WA',
      title: 'Zero Sequence or Leading Zeros in Bostan-Mori',
      detail: 'When all sample terms are 0, Berlekamp-Massey returns an empty recurrence d = 0. Handle d = 0 by outputting 0 immediately, and confirm Q(0) = 1 so Q(0)^-1 never divides by zero.',
    },
  ],
  implementations: {
    cpp20: `#include <iostream>
#include <vector>
using namespace std;

// O(K) Lagrange Interpolation on consecutive points x = 0, 1, ..., K
static constexpr long long MOD = 1000000007LL;

long long modPow(long long base, long long exp) {
    long long res = 1;
    base %= MOD;
    if (base < 0) base += MOD;
    while (exp > 0) {
        if (exp & 1LL) res = (res * base) % MOD;
        base = (base * base) % MOD;
        exp >>= 1LL;
    }
    return res;
}

long long lagrangeEvalConsecutive(const vector<long long>& y, long long X) {
    int k = static_cast<int>(y.size()) - 1;
    if (X >= 0 && X <= k) return (y[X] % MOD + MOD) % MOD;

    long long xMod = (X % MOD + MOD) % MOD;
    vector<long long> pref(k + 2, 1), suff(k + 2, 1);
    for (int i = 0; i <= k; ++i) {
        long long factor = (xMod - i + MOD) % MOD;
        pref[i + 1] = (pref[i] * factor) % MOD;
    }
    for (int i = k; i >= 0; --i) {
        long long factor = (xMod - i + MOD) % MOD;
        suff[i] = (suff[i + 1] * factor) % MOD;
    }

    vector<long long> fact(k + 1, 1), invFact(k + 1, 1);
    for (int i = 1; i <= k; ++i) fact[i] = (fact[i - 1] * i) % MOD;
    invFact[k] = modPow(fact[k], MOD - 2);
    for (int i = k - 1; i >= 0; --i) invFact[i] = (invFact[i + 1] * (i + 1)) % MOD;

    long long ans = 0;
    for (int i = 0; i <= k; ++i) {
        long long num = (pref[i] * suff[i + 1]) % MOD;
        long long denomInv = (invFact[i] * invFact[k - i]) % MOD;
        long long term = (((y[i] % MOD + MOD) % MOD) * num) % MOD;
        term = (term * denomInv) % MOD;
        if ((k - i) & 1) {
            ans = (ans - term + MOD) % MOD;
        } else {
            ans = (ans + term) % MOD;
        }
    }
    return ans;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int k;
    long long X;
    if (!(cin >> k >> X)) return 0;
    vector<long long> y(k + 1);
    for (int i = 0; i <= k; ++i) cin >> y[i];

    cout << lagrangeEvalConsecutive(y, X) << "\n";
    return 0;
}
`,
    rust: `use std::io::{self, Read};

const MOD: i64 = 1_000_000_007;

fn mod_pow(mut base: i64, mut exp: i64) -> i64 {
    let mut res = 1i64;
    base = ((base % MOD) + MOD) % MOD;
    while exp > 0 {
        if (exp & 1) != 0 {
            res = (res * base) % MOD;
        }
        base = (base * base) % MOD;
        exp >>= 1;
    }
    res
}

fn lagrange_eval_consecutive(y: &[i64], x: i64) -> i64 {
    let k = y.len() - 1;
    if x >= 0 && x <= k as i64 {
        return ((y[x as usize] % MOD) + MOD) % MOD;
    }

    let x_mod = ((x % MOD) + MOD) % MOD;
    let mut pref = vec![1i64; k + 2];
    let mut suff = vec![1i64; k + 2];
    for i in 0..=k {
        let factor = (x_mod - i as i64 + MOD) % MOD;
        pref[i + 1] = (pref[i] * factor) % MOD;
    }
    for i in (0..=k).rev() {
        let factor = (x_mod - i as i64 + MOD) % MOD;
        suff[i] = (suff[i + 1] * factor) % MOD;
    }

    let mut fact = vec![1i64; k + 1];
    let mut inv_fact = vec![1i64; k + 1];
    for i in 1..=k {
        fact[i] = (fact[i - 1] * i as i64) % MOD;
    }
    inv_fact[k] = mod_pow(fact[k], MOD - 2);
    for i in (0..k).rev() {
        inv_fact[i] = (inv_fact[i + 1] * (i + 1) as i64) % MOD;
    }

    let mut ans = 0i64;
    for i in 0..=k {
        let num = (pref[i] * suff[i + 1]) % MOD;
        let denom_inv = (inv_fact[i] * inv_fact[k - i]) % MOD;
        let yi = ((y[i] % MOD) + MOD) % MOD;
        let term = ((yi * num) % MOD * denom_inv) % MOD;
        if ((k - i) & 1) != 0 {
            ans = (ans - term + MOD) % MOD;
        } else {
            ans = (ans + term) % MOD;
        }
    }
    ans
}

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let k: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };
    let x: i64 = it.next().unwrap().parse().unwrap();
    let mut y = Vec::with_capacity(k + 1);
    for _ in 0..=k {
        y.push(it.next().unwrap().parse().unwrap());
    }
    println!("{}", lagrange_eval_consecutive(&y, x));
}
`,
    java21: `import java.io.BufferedInputStream;
import java.io.IOException;

public class Main {
    static final long MOD = 1_000_000_007L;

    static class FastScanner {
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;
        private final BufferedInputStream in = new BufferedInputStream(System.in);

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
            long res = 0;
            while (c > ' ') {
                res = res * 10 + (c - '0');
                c = readByte();
            }
            return res * sign;
        }
    }

    static long modPow(long base, long exp) {
        long res = 1;
        base = ((base % MOD) + MOD) % MOD;
        while (exp > 0) {
            if ((exp & 1L) != 0) res = (res * base) % MOD;
            base = (base * base) % MOD;
            exp >>= 1;
        }
        return res;
    }

    static long lagrangeEvalConsecutive(long[] y, long X) {
        int k = y.length - 1;
        if (X >= 0 && X <= k) return ((y[(int) X] % MOD) + MOD) % MOD;

        long xMod = ((X % MOD) + MOD) % MOD;
        long[] pref = new long[k + 2];
        long[] suff = new long[k + 2];
        pref[0] = 1;
        suff[k + 1] = 1;
        for (int i = 0; i <= k; i++) {
            long factor = (xMod - i + MOD) % MOD;
            pref[i + 1] = (pref[i] * factor) % MOD;
        }
        for (int i = k; i >= 0; i--) {
            long factor = (xMod - i + MOD) % MOD;
            suff[i] = (suff[i + 1] * factor) % MOD;
        }

        long[] fact = new long[k + 1];
        long[] invFact = new long[k + 1];
        fact[0] = 1;
        for (int i = 1; i <= k; i++) fact[i] = (fact[i - 1] * i) % MOD;
        invFact[k] = modPow(fact[k], MOD - 2);
        for (int i = k - 1; i >= 0; i--) invFact[i] = (invFact[i + 1] * (i + 1)) % MOD;

        long ans = 0;
        for (int i = 0; i <= k; i++) {
            long num = (pref[i] * suff[i + 1]) % MOD;
            long denomInv = (invFact[i] * invFact[k - i]) % MOD;
            long yi = ((y[i] % MOD) + MOD) % MOD;
            long term = ((yi * num) % MOD * denomInv) % MOD;
            if (((k - i) & 1) != 0) ans = (ans - term + MOD) % MOD;
            else ans = (ans + term) % MOD;
        }
        return ans;
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        long kLong = fs.nextLong();
        if (kLong == Long.MIN_VALUE) return;
        int k = (int) kLong;
        long X = fs.nextLong();
        long[] y = new long[k + 1];
        for (int i = 0; i <= k; i++) y[i] = fs.nextLong();
        System.out.println(lagrangeEvalConsecutive(y, X));
    }
}
`,
    python3: `import sys

sys.setrecursionlimit(200000)
MOD = 1_000_000_007


def lagrange_eval_consecutive(y: list[int], x: int) -> int:
    k = len(y) - 1
    if 0 <= x <= k:
        return y[x] % MOD

    x_mod = x % MOD
    pref = [1] * (k + 2)
    suff = [1] * (k + 2)
    for i in range(k + 1):
        pref[i + 1] = pref[i] * ((x_mod - i) % MOD) % MOD
    for i in range(k, -1, -1):
        suff[i] = suff[i + 1] * ((x_mod - i) % MOD) % MOD

    fact = [1] * (k + 1)
    for i in range(1, k + 1):
        fact[i] = fact[i - 1] * i % MOD
    inv_fact = [1] * (k + 1)
    inv_fact[k] = pow(fact[k], MOD - 2, MOD)
    for i in range(k - 1, -1, -1):
        inv_fact[i] = inv_fact[i + 1] * (i + 1) % MOD

    ans = 0
    for i in range(k + 1):
        num = pref[i] * suff[i + 1] % MOD
        denom_inv = inv_fact[i] * inv_fact[k - i] % MOD
        term = (y[i] % MOD) * num % MOD * denom_inv % MOD
        if (k - i) & 1:
            ans = (ans - term) % MOD
        else:
            ans = (ans + term) % MOD
    return ans


def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    k = int(data[0])
    x = int(data[1])
    y = [int(v) for v in data[2 : 2 + k + 1]]
    print(lagrange_eval_consecutive(y, x))


if __name__ == "__main__":
    solve()
`,
    ruby: `MOD = 1_000_000_007

def mod_pow(base, exp)
  res = 1
  base %= MOD
  while exp > 0
    res = (res * base) % MOD if (exp & 1) != 0
    base = (base * base) % MOD
    exp >>= 1
  end
  res
end

def lagrange_eval_consecutive(y, x)
  k = y.length - 1
  return y[x] % MOD if x >= 0 && x <= k

  x_mod = x % MOD
  pref = Array.new(k + 2, 1)
  suff = Array.new(k + 2, 1)
  (0..k).each do |i|
    pref[i + 1] = (pref[i] * ((x_mod - i) % MOD)) % MOD
  end
  k.downto(0) do |i|
    suff[i] = (suff[i + 1] * ((x_mod - i) % MOD)) % MOD
  end

  fact = Array.new(k + 1, 1)
  (1..k).each { |i| fact[i] = (fact[i - 1] * i) % MOD }
  inv_fact = Array.new(k + 1, 1)
  inv_fact[k] = mod_pow(fact[k], MOD - 2)
  (k - 1).downto(0) do |i|
    inv_fact[i] = (inv_fact[i + 1] * (i + 1)) % MOD
  end

  ans = 0
  (0..k).each do |i|
    num = (pref[i] * suff[i + 1]) % MOD
    denom_inv = (inv_fact[i] * inv_fact[k - i]) % MOD
    term = ((y[i] % MOD) * num % MOD * denom_inv) % MOD
    if ((k - i) & 1) != 0
      ans = (ans - term) % MOD
    else
      ans = (ans + term) % MOD
    end
  end
  ans
end

data = $stdin.read.split
exit if data.empty?
k = data[0].to_i
x = data[1].to_i
y = data[2, k + 1].map(&:to_i)
puts lagrange_eval_consecutive(y, x)
`,
  },
  practiceProblems: [
    {
      id: 'ch62-p1',
      tier: 'Warmup',
      ratingRange: '2000–2200',
      title: 'Sum of K-th Powers in O(K)',
      statement:
        'Given positive integers N and non-negative integer K, compute sum_{i=1}^{N} i^K modulo 10^9 + 7.',
      constraints: '1 <= N <= 10^18, 0 <= K <= 10^5',
      sampleInput: '10 2',
      sampleOutput: '385',
      hints: [
        'S(x) = sum_{i=1..x} i^K is a polynomial of degree D = K + 1 (with S(0) = 0).',
        'Precompute y[m] = S(m) for m = 0, 1, ..., K + 1 using fast modular exponentiation (or linear sieve for i^K).',
        'Evaluate S(N) in O(K) time via consecutive-point Lagrange interpolation on y[0..K+1].',
      ],
      solutions: {
        cpp20: `#include <iostream>
#include <vector>
using namespace std;

static constexpr long long MOD = 1000000007LL;

long long modPow(long long base, long long exp) {
    long long res = 1;
    base %= MOD;
    while (exp > 0) {
        if (exp & 1LL) res = (res * base) % MOD;
        base = (base * base) % MOD;
        exp >>= 1LL;
    }
    return res;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    long long n;
    int k;
    if (!(cin >> n >> k)) return 0;

    int deg = k + 1;
    vector<long long> y(deg + 1, 0);
    for (int i = 1; i <= deg; ++i) {
        y[i] = (y[i - 1] + modPow(i, k)) % MOD;
    }

    if (n <= deg) {
        cout << y[n] << "\n";
        return 0;
    }

    long long nMod = n % MOD;
    vector<long long> pref(deg + 2, 1), suff(deg + 2, 1);
    for (int i = 0; i <= deg; ++i) {
        pref[i + 1] = (pref[i] * ((nMod - i + MOD) % MOD)) % MOD;
    }
    for (int i = deg; i >= 0; --i) {
        suff[i] = (suff[i + 1] * ((nMod - i + MOD) % MOD)) % MOD;
    }

    vector<long long> fact(deg + 1, 1), invFact(deg + 1, 1);
    for (int i = 1; i <= deg; ++i) fact[i] = (fact[i - 1] * i) % MOD;
    invFact[deg] = modPow(fact[deg], MOD - 2);
    for (int i = deg - 1; i >= 0; --i) invFact[i] = (invFact[i + 1] * (i + 1)) % MOD;

    long long ans = 0;
    for (int i = 0; i <= deg; ++i) {
        long long num = (pref[i] * suff[i + 1]) % MOD;
        long long denomInv = (invFact[i] * invFact[deg - i]) % MOD;
        long long term = (y[i] * num % MOD) * denomInv % MOD;
        if ((deg - i) & 1) ans = (ans - term + MOD) % MOD;
        else ans = (ans + term) % MOD;
    }

    cout << ans << "\n";
    return 0;
}
`,
        rust: `use std::io::{self, Read};

const MOD: i64 = 1_000_000_007;

fn mod_pow(mut base: i64, mut exp: i64) -> i64 {
    let mut res = 1i64;
    base %= MOD;
    while exp > 0 {
        if (exp & 1) != 0 {
            res = (res * base) % MOD;
        }
        base = (base * base) % MOD;
        exp >>= 1;
    }
    res
}

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let n: i64 = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };
    let k: usize = it.next().unwrap().parse().unwrap();

    let deg = k + 1;
    let mut y = vec![0i64; deg + 1];
    for i in 1..=deg {
        y[i] = (y[i - 1] + mod_pow(i as i64, k as i64)) % MOD;
    }

    if n <= deg as i64 {
        println!("{}", y[n as usize]);
        return;
    }

    let n_mod = n % MOD;
    let mut pref = vec![1i64; deg + 2];
    let mut suff = vec![1i64; deg + 2];
    for i in 0..=deg {
        pref[i + 1] = (pref[i] * ((n_mod - i as i64 + MOD) % MOD)) % MOD;
    }
    for i in (0..=deg).rev() {
        suff[i] = (suff[i + 1] * ((n_mod - i as i64 + MOD) % MOD)) % MOD;
    }

    let mut fact = vec![1i64; deg + 1];
    let mut inv_fact = vec![1i64; deg + 1];
    for i in 1..=deg {
        fact[i] = (fact[i - 1] * i as i64) % MOD;
    }
    inv_fact[deg] = mod_pow(fact[deg], MOD - 2);
    for i in (0..deg).rev() {
        inv_fact[i] = (inv_fact[i + 1] * (i + 1) as i64) % MOD;
    }

    let mut ans = 0i64;
    for i in 0..=deg {
        let num = (pref[i] * suff[i + 1]) % MOD;
        let denom_inv = (inv_fact[i] * inv_fact[deg - i]) % MOD;
        let term = ((y[i] * num) % MOD * denom_inv) % MOD;
        if ((deg - i) & 1) != 0 {
            ans = (ans - term + MOD) % MOD;
        } else {
            ans = (ans + term) % MOD;
        }
    }

    println!("{}", ans);
}
`,
        java21: `import java.io.BufferedInputStream;
import java.io.IOException;

public class Main {
    static final long MOD = 1_000_000_007L;

    static class FastScanner {
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;
        private final BufferedInputStream in = new BufferedInputStream(System.in);

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
                if (c == -1) return -1;
            } while (c <= ' ');
            long res = 0;
            while (c > ' ') {
                res = res * 10 + (c - '0');
                c = readByte();
            }
            return res;
        }
    }

    static long modPow(long base, long exp) {
        long res = 1;
        base %= MOD;
        while (exp > 0) {
            if ((exp & 1L) != 0) res = (res * base) % MOD;
            base = (base * base) % MOD;
            exp >>= 1;
        }
        return res;
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        long n = fs.nextLong();
        if (n == -1) return;
        int k = (int) fs.nextLong();

        int deg = k + 1;
        long[] y = new long[deg + 1];
        for (int i = 1; i <= deg; i++) {
            y[i] = (y[i - 1] + modPow(i, k)) % MOD;
        }

        if (n <= deg) {
            System.out.println(y[(int) n]);
            return;
        }

        long nMod = n % MOD;
        long[] pref = new long[deg + 2];
        long[] suff = new long[deg + 2];
        pref[0] = 1;
        suff[deg + 1] = 1;
        for (int i = 0; i <= deg; i++) {
            pref[i + 1] = (pref[i] * ((nMod - i + MOD) % MOD)) % MOD;
        }
        for (int i = deg; i >= 0; i--) {
            suff[i] = (suff[i + 1] * ((nMod - i + MOD) % MOD)) % MOD;
        }

        long[] fact = new long[deg + 1];
        long[] invFact = new long[deg + 1];
        fact[0] = 1;
        for (int i = 1; i <= deg; i++) fact[i] = (fact[i - 1] * i) % MOD;
        invFact[deg] = modPow(fact[deg], MOD - 2);
        for (int i = deg - 1; i >= 0; i--) invFact[i] = (invFact[i + 1] * (i + 1)) % MOD;

        long ans = 0;
        for (int i = 0; i <= deg; i++) {
            long num = (pref[i] * suff[i + 1]) % MOD;
            long denomInv = (invFact[i] * invFact[deg - i]) % MOD;
            long term = ((y[i] * num) % MOD * denomInv) % MOD;
            if (((deg - i) & 1) != 0) ans = (ans - term + MOD) % MOD;
            else ans = (ans + term) % MOD;
        }
        System.out.println(ans);
    }
}
`,
        python3: `import sys

sys.setrecursionlimit(200000)
MOD = 1_000_000_007


def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    k = int(data[1])

    deg = k + 1
    y = [0] * (deg + 1)
    for i in range(1, deg + 1):
        y[i] = (y[i - 1] + pow(i, k, MOD)) % MOD

    if n <= deg:
        print(y[n])
        return

    n_mod = n % MOD
    pref = [1] * (deg + 2)
    suff = [1] * (deg + 2)
    for i in range(deg + 1):
        pref[i + 1] = pref[i] * ((n_mod - i) % MOD) % MOD
    for i in range(deg, -1, -1):
        suff[i] = suff[i + 1] * ((n_mod - i) % MOD) % MOD

    fact = [1] * (deg + 1)
    for i in range(1, deg + 1):
        fact[i] = fact[i - 1] * i % MOD
    inv_fact = [1] * (deg + 1)
    inv_fact[deg] = pow(fact[deg], MOD - 2, MOD)
    for i in range(deg - 1, -1, -1):
        inv_fact[i] = inv_fact[i + 1] * (i + 1) % MOD

    ans = 0
    for i in range(deg + 1):
        num = pref[i] * suff[i + 1] % MOD
        denom_inv = inv_fact[i] * inv_fact[deg - i] % MOD
        term = y[i] * num % MOD * denom_inv % MOD
        if (deg - i) & 1:
            ans = (ans - term) % MOD
        else:
            ans = (ans + term) % MOD
    print(ans)


if __name__ == "__main__":
    solve()
`,
        ruby: `MOD = 1_000_000_007

def mod_pow(base, exp)
  res = 1
  base %= MOD
  while exp > 0
    res = (res * base) % MOD if (exp & 1) != 0
    base = (base * base) % MOD
    exp >>= 1
  end
  res
end

data = $stdin.read.split
exit if data.empty?
n = data[0].to_i
k = data[1].to_i

deg = k + 1
y = Array.new(deg + 1, 0)
(1..deg).each do |i|
  y[i] = (y[i - 1] + mod_pow(i, k)) % MOD
end

if n <= deg
  puts y[n]
  exit
end

n_mod = n % MOD
pref = Array.new(deg + 2, 1)
suff = Array.new(deg + 2, 1)
(0..deg).each do |i|
  pref[i + 1] = (pref[i] * ((n_mod - i) % MOD)) % MOD
end
deg.downto(0) do |i|
  suff[i] = (suff[i + 1] * ((n_mod - i) % MOD)) % MOD
end

fact = Array.new(deg + 1, 1)
(1..deg).each { |i| fact[i] = (fact[i - 1] * i) % MOD }
inv_fact = Array.new(deg + 1, 1)
inv_fact[deg] = mod_pow(fact[deg], MOD - 2)
(deg - 1).downto(0) do |i|
  inv_fact[i] = (inv_fact[i + 1] * (i + 1)) % MOD
end

ans = 0
(0..deg).each do |i|
  num = (pref[i] * suff[i + 1]) % MOD
  denom_inv = (inv_fact[i] * inv_fact[deg - i]) % MOD
  term = (y[i] * num % MOD * denom_inv) % MOD
  if ((deg - i) & 1) != 0
    ans = (ans - term) % MOD
  else
    ans = (ans + term) % MOD
  end
end

puts ans
`,
      },
    },
    {
      id: 'ch62-p2',
      tier: 'Standard',
      ratingRange: '2200–2400',
      title: 'Minimal Linear Recurrence via Berlekamp-Massey',
      statement:
        'Given a sequence s[0..M-1] modulo 998244353, find the shortest linear recurrence c[0..d-1] of minimum length d such that s[n] = sum_{j=0}^{d-1} c[j] * s[n - 1 - j] (mod 998244353) for all d <= n < M. Output d on the first line, and the d coefficients c[0..d-1] on the second line.',
      constraints: '1 <= M <= 5000, 0 <= s[i] < 998244353',
      sampleInput: '6\n1 1 2 3 5 8',
      sampleOutput: '2\n1 1',
      hints: [
        'Maintain the current candidate recurrence cur and the previous recurrence best at the most recent index bestPos where cur increased in order (with discrepancy bestDelta).',
        'Whenever a new discrepancy delta != 0 occurs at index i, construct cand = [0]*(i - bestPos - 1) + [delta / bestDelta] + [-delta/bestDelta * b for b in best].',
        'Notice that adding cand cancels the discrepancy at index i while preserving zero discrepancy at all indices j < i where best succeeded.',
      ],
      solutions: {
        cpp20: `#include <iostream>
#include <vector>
using namespace std;

static constexpr long long MOD = 998244353LL;

long long modPow(long long base, long long exp) {
    long long res = 1;
    base %= MOD;
    while (exp > 0) {
        if (exp & 1LL) res = (res * base) % MOD;
        base = (base * base) % MOD;
        exp >>= 1LL;
    }
    return res;
}

vector<long long> berlekampMassey(const vector<long long>& s) {
    vector<long long> cur, best;
    int bestPos = -1;
    long long bestDelta = 1;

    for (int i = 0; i < static_cast<int>(s.size()); ++i) {
        long long eval = 0;
        for (int j = 0; j < static_cast<int>(cur.size()); ++j) {
            eval = (eval + cur[j] * s[i - 1 - j]) % MOD;
        }
        long long delta = (s[i] - eval + MOD) % MOD;
        if (delta == 0) continue;

        if (bestPos == -1) {
            cur.assign(i + 1, 0);
            bestPos = i;
            bestDelta = delta;
            continue;
        }

        long long mul = (delta * modPow(bestDelta, MOD - 2)) % MOD;
        vector<long long> cand(i - bestPos - 1, 0);
        cand.push_back(mul);
        for (long long x : best) {
            cand.push_back((MOD - (mul * x) % MOD) % MOD);
        }

        if (cand.size() < cur.size()) cand.resize(cur.size(), 0);
        bool grew = (cand.size() > cur.size());
        vector<long long> prevCur = cur;
        if (cur.size() < cand.size()) cur.resize(cand.size(), 0);
        for (int j = 0; j < static_cast<int>(cand.size()); ++j) {
            cur[j] = (cur[j] + cand[j]) % MOD;
        }

        if (grew) {
            best = move(prevCur);
            bestPos = i;
            bestDelta = delta;
        }
    }
    return cur;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int m;
    if (!(cin >> m)) return 0;
    vector<long long> s(m);
    for (int i = 0; i < m; ++i) {
        cin >> s[i];
        s[i] = ((s[i] % MOD) + MOD) % MOD;
    }

    vector<long long> rec = berlekampMassey(s);
    cout << rec.size() << "\n";
    for (int i = 0; i < static_cast<int>(rec.size()); ++i) {
        if (i) cout << ' ';
        cout << rec[i];
    }
    cout << "\n";
    return 0;
}
`,
        rust: `use std::io::{self, Read};

const MOD: i64 = 998_244_353;

fn mod_pow(mut base: i64, mut exp: i64) -> i64 {
    let mut res = 1i64;
    base %= MOD;
    while exp > 0 {
        if (exp & 1) != 0 {
            res = (res * base) % MOD;
        }
        base = (base * base) % MOD;
        exp >>= 1;
    }
    res
}

fn berlekamp_massey(s: &[i64]) -> Vec<i64> {
    let mut cur: Vec<i64> = Vec::new();
    let mut best: Vec<i64> = Vec::new();
    let mut best_pos: isize = -1;
    let mut best_delta: i64 = 1;

    for i in 0..s.len() {
        let mut eval = 0i64;
        for j in 0..cur.len() {
            eval = (eval + cur[j] * s[i - 1 - j]) % MOD;
        }
        let delta = (s[i] - eval + MOD) % MOD;
        if delta == 0 {
            continue;
        }

        if best_pos == -1 {
            cur = vec![0; i + 1];
            best_pos = i as isize;
            best_delta = delta;
            continue;
        }

        let mul = (delta * mod_pow(best_delta, MOD - 2)) % MOD;
        let zeros = (i as isize - best_pos - 1) as usize;
        let mut cand = vec![0i64; zeros];
        cand.push(mul);
        for &x in &best {
            cand.push((MOD - (mul * x) % MOD) % MOD);
        }

        let grew = cand.len() > cur.len();
        let prev_cur = cur.clone();
        if cur.len() < cand.len() {
            cur.resize(cand.len(), 0);
        }
        for j in 0..cand.len() {
            cur[j] = (cur[j] + cand[j]) % MOD;
        }

        if grew {
            best = prev_cur;
            best_pos = i as isize;
            best_delta = delta;
        }
    }
    cur
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let m: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };
    let mut s = Vec::with_capacity(m);
    for _ in 0..m {
        let v: i64 = it.next().unwrap().parse().unwrap();
        s.push(((v % MOD) + MOD) % MOD);
    }

    let rec = berlekamp_massey(&s);
    println!("{}", rec.len());
    for (idx, val) in rec.iter().enumerate() {
        if idx > 0 {
            print!(" ");
        }
        print!("{}", val);
    }
    println!();
}
`,
        java21: `import java.io.BufferedInputStream;
import java.io.IOException;
import java.util.Arrays;

public class Main {
    static final long MOD = 998_244_353L;

    static class FastScanner {
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;
        private final BufferedInputStream in = new BufferedInputStream(System.in);

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
            long res = 0;
            while (c > ' ') {
                res = res * 10 + (c - '0');
                c = readByte();
            }
            return res * sign;
        }
    }

    static long modPow(long base, long exp) {
        long res = 1;
        base %= MOD;
        while (exp > 0) {
            if ((exp & 1L) != 0) res = (res * base) % MOD;
            base = (base * base) % MOD;
            exp >>= 1;
        }
        return res;
    }

    static long[] berlekampMassey(long[] s) {
        long[] cur = new long[0];
        long[] best = new long[0];
        int bestPos = -1;
        long bestDelta = 1;

        for (int i = 0; i < s.length; i++) {
            long eval = 0;
            for (int j = 0; j < cur.length; j++) {
                eval = (eval + cur[j] * s[i - 1 - j]) % MOD;
            }
            long delta = (s[i] - eval + MOD) % MOD;
            if (delta == 0) continue;

            if (bestPos == -1) {
                cur = new long[i + 1];
                bestPos = i;
                bestDelta = delta;
                continue;
            }

            long mul = (delta * modPow(bestDelta, MOD - 2)) % MOD;
            int zeros = i - bestPos - 1;
            long[] cand = new long[zeros + 1 + best.length];
            cand[zeros] = mul;
            for (int j = 0; j < best.length; j++) {
                cand[zeros + 1 + j] = (MOD - (mul * best[j]) % MOD) % MOD;
            }

            boolean grew = cand.length > cur.length;
            long[] prevCur = cur;
            long[] nextCur = Arrays.copyOf(cur, Math.max(cur.length, cand.length));
            for (int j = 0; j < cand.length; j++) {
                nextCur[j] = (nextCur[j] + cand[j]) % MOD;
            }
            cur = nextCur;

            if (grew) {
                best = prevCur;
                bestPos = i;
                bestDelta = delta;
            }
        }
        return cur;
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        long mLong = fs.nextLong();
        if (mLong == Long.MIN_VALUE) return;
        int m = (int) mLong;
        long[] s = new long[m];
        for (int i = 0; i < m; i++) {
            s[i] = ((fs.nextLong() % MOD) + MOD) % MOD;
        }

        long[] rec = berlekampMassey(s);
        StringBuilder sb = new StringBuilder();
        sb.append(rec.length).append('\n');
        for (int i = 0; i < rec.length; i++) {
            if (i > 0) sb.append(' ');
            sb.append(rec[i]);
        }
        System.out.println(sb.toString());
    }
}
`,
        python3: `import sys

sys.setrecursionlimit(200000)
MOD = 998_244_353


def berlekamp_massey(s: list[int]) -> list[int]:
    cur: list[int] = []
    best: list[int] = []
    best_pos = -1
    best_delta = 1

    for i, val in enumerate(s):
        eval_v = 0
        for j, cj in enumerate(cur):
            eval_v = (eval_v + cj * s[i - 1 - j]) % MOD
        delta = (val - eval_v) % MOD
        if delta == 0:
            continue

        if best_pos == -1:
            cur = [0] * (i + 1)
            best_pos = i
            best_delta = delta
            continue

        mul = delta * pow(best_delta, MOD - 2, MOD) % MOD
        cand = [0] * (i - best_pos - 1) + [mul] + [(-mul * x) % MOD for x in best]
        grew = len(cand) > len(cur)
        prev_cur = cur[:]
        if len(cur) < len(cand):
            cur.extend([0] * (len(cand) - len(cur)))
        for j, cj in enumerate(cand):
            cur[j] = (cur[j] + cj) % MOD

        if grew:
            best = prev_cur
            best_pos = i
            best_delta = delta

    return cur


def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    m = int(data[0])
    s = [int(v) % MOD for v in data[1 : 1 + m]]
    rec = berlekamp_massey(s)
    print(len(rec))
    print(" ".join(map(str, rec)))


if __name__ == "__main__":
    solve()
`,
        ruby: `MOD = 998_244_353

def mod_pow(base, exp)
  res = 1
  base %= MOD
  while exp > 0
    res = (res * base) % MOD if (exp & 1) != 0
    base = (base * base) % MOD
    exp >>= 1
  end
  res
end

def berlekamp_massey(s)
  cur = []
  best = []
  best_pos = -1
  best_delta = 1

  s.each_with_index do |val, i|
    eval_v = 0
    cur.each_with_index do |cj, j|
      eval_v = (eval_v + cj * s[i - 1 - j]) % MOD
    end
    delta = (val - eval_v) % MOD
    next if delta == 0

    if best_pos == -1
      cur = Array.new(i + 1, 0)
      best_pos = i
      best_delta = delta
      next
    end

    mul = (delta * mod_pow(best_delta, MOD - 2)) % MOD
    cand = Array.new(i - best_pos - 1, 0) + [mul] + best.map { |x| (-mul * x) % MOD }
    grew = cand.length > cur.length
    prev_cur = cur.dup
    cur.fill(0, cur.length...cand.length) if cur.length < cand.length
    cand.each_with_index { |cj, j| cur[j] = (cur[j] + cj) % MOD }

    if grew
      best = prev_cur
      best_pos = i
      best_delta = delta
    end
  end
  cur
end

data = $stdin.read.split
exit if data.empty?
m = data[0].to_i
s = data[1, m].map { |v| v.to_i % MOD }
rec = berlekamp_massey(s)
puts rec.length
puts rec.join(' ')
`,
      },
    },
    {
      id: 'ch62-p3',
      tier: 'Boss',
      ratingRange: '2400–2600',
      title: 'Black-Box N-th Term Extrapolator (Berlekamp-Massey + Bostan-Mori)',
      statement:
        'You are given the first M terms s[0..M-1] of a linear-recurrent sequence (guaranteed to have recurrence order d with 2d <= M) and a target index N <= 10^18. Recover the minimal recurrence using Berlekamp-Massey and compute s[N] modulo 998244353.',
      constraints: '1 <= M <= 4000, 0 <= N <= 10^18, 0 <= s[i] < 998244353',
      sampleInput: '6 10\n1 1 2 3 5 8',
      sampleOutput: '89',
      hints: [
        'Run Berlekamp-Massey on s[0..M-1] to obtain coefficients c[0..d-1]. If d == 0, every term is 0 so output 0 immediately.',
        'Form denominator polynomial Q(x) = 1 - sum_{j=0}^{d-1} c[j] * x^{j+1} and numerator P(x) = (sum_{i=0}^{d-1} s[i] x^i) * Q(x) mod x^d.',
        'Evaluate [x^N] P(x) / Q(x) using Bostan-Mori: multiply P(x) and Q(x) by Q(-x), keep odd or even indices of U = P(x)Q(-x) matching (N & 1), keep even indices of V = Q(x)Q(-x), and halve N.',
      ],
      solutions: {
        cpp20: `#include <iostream>
#include <vector>
using namespace std;

static constexpr long long MOD = 998244353LL;

long long modPow(long long base, long long exp) {
    long long res = 1;
    base %= MOD;
    while (exp > 0) {
        if (exp & 1LL) res = (res * base) % MOD;
        base = (base * base) % MOD;
        exp >>= 1LL;
    }
    return res;
}

vector<long long> berlekampMassey(const vector<long long>& s) {
    vector<long long> cur, best;
    int bestPos = -1;
    long long bestDelta = 1;
    for (int i = 0; i < static_cast<int>(s.size()); ++i) {
        long long eval = 0;
        for (int j = 0; j < static_cast<int>(cur.size()); ++j) {
            eval = (eval + cur[j] * s[i - 1 - j]) % MOD;
        }
        long long delta = (s[i] - eval + MOD) % MOD;
        if (delta == 0) continue;
        if (bestPos == -1) {
            cur.assign(i + 1, 0);
            bestPos = i;
            bestDelta = delta;
            continue;
        }
        long long mul = (delta * modPow(bestDelta, MOD - 2)) % MOD;
        vector<long long> cand(i - bestPos - 1, 0);
        cand.push_back(mul);
        for (long long x : best) cand.push_back((MOD - (mul * x) % MOD) % MOD);
        bool grew = (cand.size() > cur.size());
        vector<long long> prevCur = cur;
        if (cur.size() < cand.size()) cur.resize(cand.size(), 0);
        for (int j = 0; j < static_cast<int>(cand.size()); ++j) {
            cur[j] = (cur[j] + cand[j]) % MOD;
        }
        if (grew) {
            best = move(prevCur);
            bestPos = i;
            bestDelta = delta;
        }
    }
    return cur;
}

vector<long long> polyMul(const vector<long long>& a, const vector<long long>& b) {
    vector<long long> c(a.size() + b.size() - 1, 0);
    for (int i = 0; i < static_cast<int>(a.size()); ++i) {
        if (a[i] == 0) continue;
        for (int j = 0; j < static_cast<int>(b.size()); ++j) {
            c[i + j] = (c[i + j] + a[i] * b[j]) % MOD;
        }
    }
    return c;
}

long long bostanMori(vector<long long> p, vector<long long> q, long long n) {
    while (n > 0) {
        vector<long long> qNeg = q;
        for (int i = 1; i < static_cast<int>(qNeg.size()); i += 2) {
            if (qNeg[i] != 0) qNeg[i] = MOD - qNeg[i];
        }
        vector<long long> u = polyMul(p, qNeg);
        vector<long long> v = polyMul(q, qNeg);

        vector<long long> np, nq;
        int parity = static_cast<int>(n & 1LL);
        for (int i = parity; i < static_cast<int>(u.size()); i += 2) np.push_back(u[i]);
        for (int i = 0; i < static_cast<int>(v.size()); i += 2) nq.push_back(v[i]);
        if (np.empty()) np.push_back(0);

        p.swap(np);
        q.swap(nq);
        n >>= 1LL;
    }
    return (p[0] * modPow(q[0], MOD - 2)) % MOD;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int m;
    long long n;
    if (!(cin >> m >> n)) return 0;
    vector<long long> s(m);
    for (int i = 0; i < m; ++i) {
        cin >> s[i];
        s[i] = ((s[i] % MOD) + MOD) % MOD;
    }
    if (n < m) {
        cout << s[n] << "\n";
        return 0;
    }

    vector<long long> rec = berlekampMassey(s);
    int d = static_cast<int>(rec.size());
    if (d == 0) {
        cout << 0 << "\n";
        return 0;
    }

    vector<long long> q(d + 1, 0);
    q[0] = 1;
    for (int i = 0; i < d; ++i) q[i + 1] = (MOD - rec[i]) % MOD;

    vector<long long> sPref(s.begin(), s.begin() + d);
    vector<long long> prod = polyMul(sPref, q);
    prod.resize(d);

    cout << bostanMori(prod, q, n) << "\n";
    return 0;
}
`,
        rust: `use std::io::{self, Read};

const MOD: i64 = 998_244_353;

fn mod_pow(mut base: i64, mut exp: i64) -> i64 {
    let mut res = 1i64;
    base %= MOD;
    while exp > 0 {
        if (exp & 1) != 0 {
            res = (res * base) % MOD;
        }
        base = (base * base) % MOD;
        exp >>= 1;
    }
    res
}

fn berlekamp_massey(s: &[i64]) -> Vec<i64> {
    let mut cur: Vec<i64> = Vec::new();
    let mut best: Vec<i64> = Vec::new();
    let mut best_pos: isize = -1;
    let mut best_delta: i64 = 1;

    for i in 0..s.len() {
        let mut eval = 0i64;
        for j in 0..cur.len() {
            eval = (eval + cur[j] * s[i - 1 - j]) % MOD;
        }
        let delta = (s[i] - eval + MOD) % MOD;
        if delta == 0 {
            continue;
        }
        if best_pos == -1 {
            cur = vec![0; i + 1];
            best_pos = i as isize;
            best_delta = delta;
            continue;
        }
        let mul = (delta * mod_pow(best_delta, MOD - 2)) % MOD;
        let mut cand = vec![0i64; (i as isize - best_pos - 1) as usize];
        cand.push(mul);
        for &x in &best {
            cand.push((MOD - (mul * x) % MOD) % MOD);
        }
        let grew = cand.len() > cur.len();
        let prev_cur = cur.clone();
        if cur.len() < cand.len() {
            cur.resize(cand.len(), 0);
        }
        for j in 0..cand.len() {
            cur[j] = (cur[j] + cand[j]) % MOD;
        }
        if grew {
            best = prev_cur;
            best_pos = i as isize;
            best_delta = delta;
        }
    }
    cur
}

fn poly_mul(a: &[i64], b: &[i64]) -> Vec<i64> {
    let mut c = vec![0i64; a.len() + b.len() - 1];
    for (i, &ai) in a.iter().enumerate() {
        if ai == 0 {
            continue;
        }
        for (j, &bj) in b.iter().enumerate() {
            c[i + j] = (c[i + j] + ai * bj) % MOD;
        }
    }
    c
}

fn bostan_mori(mut p: Vec<i64>, mut q: Vec<i64>, mut n: i64) -> i64 {
    while n > 0 {
        let mut q_neg = q.clone();
        let mut i = 1;
        while i < q_neg.len() {
            if q_neg[i] != 0 {
                q_neg[i] = MOD - q_neg[i];
            }
            i += 2;
        }
        let u = poly_mul(&p, &q_neg);
        let v = poly_mul(&q, &q_neg);
        let mut np = Vec::new();
        let mut idx = (n & 1) as usize;
        while idx < u.len() {
            np.push(u[idx]);
            idx += 2;
        }
        if np.is_empty() {
            np.push(0);
        }
        let mut nq = Vec::new();
        idx = 0;
        while idx < v.len() {
            nq.push(v[idx]);
            idx += 2;
        }
        p = np;
        q = nq;
        n >>= 1;
    }
    (p[0] * mod_pow(q[0], MOD - 2)) % MOD
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let m: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };
    let n: i64 = it.next().unwrap().parse().unwrap();
    let mut s = Vec::with_capacity(m);
    for _ in 0..m {
        let v: i64 = it.next().unwrap().parse().unwrap();
        s.push(((v % MOD) + MOD) % MOD);
    }
    if n < m as i64 {
        println!("{}", s[n as usize]);
        return;
    }
    let rec = berlekamp_massey(&s);
    let d = rec.len();
    if d == 0 {
        println!("0");
        return;
    }
    let mut q = vec![0i64; d + 1];
    q[0] = 1;
    for i in 0..d {
        q[i + 1] = (MOD - rec[i]) % MOD;
    }
    let mut prod = poly_mul(&s[..d], &q);
    prod.truncate(d);
    println!("{}", bostan_mori(prod, q, n));
}
`,
        java21: `import java.io.BufferedInputStream;
import java.io.IOException;
import java.util.Arrays;

public class Main {
    static final long MOD = 998_244_353L;

    static class FastScanner {
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;
        private final BufferedInputStream in = new BufferedInputStream(System.in);

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
            long res = 0;
            while (c > ' ') {
                res = res * 10 + (c - '0');
                c = readByte();
            }
            return res * sign;
        }
    }

    static long modPow(long base, long exp) {
        long res = 1;
        base %= MOD;
        while (exp > 0) {
            if ((exp & 1L) != 0) res = (res * base) % MOD;
            base = (base * base) % MOD;
            exp >>= 1;
        }
        return res;
    }

    static long[] berlekampMassey(long[] s) {
        long[] cur = new long[0];
        long[] best = new long[0];
        int bestPos = -1;
        long bestDelta = 1;

        for (int i = 0; i < s.length; i++) {
            long eval = 0;
            for (int j = 0; j < cur.length; j++) {
                eval = (eval + cur[j] * s[i - 1 - j]) % MOD;
            }
            long delta = (s[i] - eval + MOD) % MOD;
            if (delta == 0) continue;

            if (bestPos == -1) {
                cur = new long[i + 1];
                bestPos = i;
                bestDelta = delta;
                continue;
            }

            long mul = (delta * modPow(bestDelta, MOD - 2)) % MOD;
            int zeros = i - bestPos - 1;
            long[] cand = new long[zeros + 1 + best.length];
            cand[zeros] = mul;
            for (int j = 0; j < best.length; j++) {
                cand[zeros + 1 + j] = (MOD - (mul * best[j]) % MOD) % MOD;
            }

            boolean grew = cand.length > cur.length;
            long[] prevCur = cur;
            long[] nextCur = Arrays.copyOf(cur, Math.max(cur.length, cand.length));
            for (int j = 0; j < cand.length; j++) {
                nextCur[j] = (nextCur[j] + cand[j]) % MOD;
            }
            cur = nextCur;

            if (grew) {
                best = prevCur;
                bestPos = i;
                bestDelta = delta;
            }
        }
        return cur;
    }

    static long[] polyMul(long[] a, long[] b) {
        long[] c = new long[a.length + b.length - 1];
        for (int i = 0; i < a.length; i++) {
            if (a[i] == 0) continue;
            for (int j = 0; j < b.length; j++) {
                c[i + j] = (c[i + j] + a[i] * b[j]) % MOD;
            }
        }
        return c;
    }

    static long bostanMori(long[] p, long[] q, long n) {
        while (n > 0) {
            long[] qNeg = q.clone();
            for (int i = 1; i < qNeg.length; i += 2) {
                if (qNeg[i] != 0) qNeg[i] = MOD - qNeg[i];
            }
            long[] u = polyMul(p, qNeg);
            long[] v = polyMul(q, qNeg);

            int parity = (int) (n & 1L);
            int npLen = (u.length - parity + 1) / 2;
            long[] np = npLen > 0 ? new long[npLen] : new long[]{0};
            for (int i = parity, k = 0; i < u.length; i += 2, k++) np[k] = u[i];

            int nqLen = (v.length + 1) / 2;
            long[] nq = new long[nqLen];
            for (int i = 0, k = 0; i < v.length; i += 2, k++) nq[k] = v[i];

            p = np;
            q = nq;
            n >>>= 1;
        }
        return (p[0] * modPow(q[0], MOD - 2)) % MOD;
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        long mLong = fs.nextLong();
        if (mLong == Long.MIN_VALUE) return;
        int m = (int) mLong;
        long n = fs.nextLong();
        long[] s = new long[m];
        for (int i = 0; i < m; i++) s[i] = ((fs.nextLong() % MOD) + MOD) % MOD;

        if (n < m) {
            System.out.println(s[(int) n]);
            return;
        }
        long[] rec = berlekampMassey(s);
        int d = rec.length;
        if (d == 0) {
            System.out.println(0);
            return;
        }
        long[] q = new long[d + 1];
        q[0] = 1;
        for (int i = 0; i < d; i++) q[i + 1] = (MOD - rec[i]) % MOD;

        long[] prod = Arrays.copyOf(polyMul(Arrays.copyOf(s, d), q), d);
        System.out.println(bostanMori(prod, q, n));
    }
}
`,
        python3: `import sys

sys.setrecursionlimit(200000)
MOD = 998_244_353


def berlekamp_massey(s: list[int]) -> list[int]:
    cur: list[int] = []
    best: list[int] = []
    best_pos = -1
    best_delta = 1
    for i, val in enumerate(s):
        eval_v = 0
        for j, cj in enumerate(cur):
            eval_v = (eval_v + cj * s[i - 1 - j]) % MOD
        delta = (val - eval_v) % MOD
        if delta == 0:
            continue
        if best_pos == -1:
            cur = [0] * (i + 1)
            best_pos = i
            best_delta = delta
            continue
        mul = delta * pow(best_delta, MOD - 2, MOD) % MOD
        cand = [0] * (i - best_pos - 1) + [mul] + [(-mul * x) % MOD for x in best]
        grew = len(cand) > len(cur)
        prev_cur = cur[:]
        if len(cur) < len(cand):
            cur.extend([0] * (len(cand) - len(cur)))
        for j, cj in enumerate(cand):
            cur[j] = (cur[j] + cj) % MOD
        if grew:
            best = prev_cur
            best_pos = i
            best_delta = delta
    return cur


def poly_mul(a: list[int], b: list[int]) -> list[int]:
    c = [0] * (len(a) + len(b) - 1)
    for i, ai in enumerate(a):
        if ai == 0:
            continue
        for j, bj in enumerate(b):
            c[i + j] = (c[i + j] + ai * bj) % MOD
    return c


def bostan_mori(p: list[int], q: list[int], n: int) -> int:
    while n > 0:
        q_neg = [(-v % MOD if (i & 1) else v) for i, v in enumerate(q)]
        u = poly_mul(p, q_neg)
        v = poly_mul(q, q_neg)
        p = u[n & 1 :: 2] or [0]
        q = v[0::2]
        n >>= 1
    return p[0] * pow(q[0], MOD - 2, MOD) % MOD


def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    m = int(data[0])
    n = int(data[1])
    s = [int(v) % MOD for v in data[2 : 2 + m]]
    if n < m:
        print(s[n])
        return
    rec = berlekamp_massey(s)
    d = len(rec)
    if d == 0:
        print(0)
        return
    q = [1] + [(-c) % MOD for c in rec]
    p = poly_mul(s[:d], q)[:d]
    print(bostan_mori(p, q, n))


if __name__ == "__main__":
    solve()
`,
        ruby: `MOD = 998_244_353

def mod_pow(base, exp)
  res = 1
  base %= MOD
  while exp > 0
    res = (res * base) % MOD if (exp & 1) != 0
    base = (base * base) % MOD
    exp >>= 1
  end
  res
end

def berlekamp_massey(s)
  cur = []
  best = []
  best_pos = -1
  best_delta = 1
  s.each_with_index do |val, i|
    eval_v = 0
    cur.each_with_index { |cj, j| eval_v = (eval_v + cj * s[i - 1 - j]) % MOD }
    delta = (val - eval_v) % MOD
    next if delta == 0

    if best_pos == -1
      cur = Array.new(i + 1, 0)
      best_pos = i
      best_delta = delta
      next
    end

    mul = (delta * mod_pow(best_delta, MOD - 2)) % MOD
    cand = Array.new(i - best_pos - 1, 0) + [mul] + best.map { |x| (-mul * x) % MOD }
    grew = cand.length > cur.length
    prev_cur = cur.dup
    cur.fill(0, cur.length...cand.length) if cur.length < cand.length
    cand.each_with_index { |cj, j| cur[j] = (cur[j] + cj) % MOD }
    if grew
      best = prev_cur
      best_pos = i
      best_delta = delta
    end
  end
  cur
end

def poly_mul(a, b)
  c = Array.new(a.length + b.length - 1, 0)
  a.each_with_index do |ai, i|
    next if ai == 0
    b.each_with_index do |bj, j|
      c[i + j] = (c[i + j] + ai * bj) % MOD
    end
  end
  c
end

def bostan_mori(p, q, n)
  while n > 0
    q_neg = q.each_with_index.map { |v, i| i.odd? ? (-v % MOD) : v }
    u = poly_mul(p, q_neg)
    v = poly_mul(q, q_neg)
    np = []
    i = n & 1
    while i < u.length
      np << u[i]
      i += 2
    end
    np << 0 if np.empty?
    nq = []
    j = 0
    while j < v.length
      nq << v[j]
      j += 2
    end
    p = np
    q = nq
    n >>= 1
  end
  (p[0] * mod_pow(q[0], MOD - 2)) % MOD
end

data = $stdin.read.split
exit if data.empty?
m = data[0].to_i
n = data[1].to_i
s = data[2, m].map { |v| v.to_i % MOD }

if n < m
  puts s[n]
  exit
end
rec = berlekamp_massey(s)
d = rec.length
if d == 0
  puts 0
  exit
end
q = [1] + rec.map { |c| (-c) % MOD }
p = poly_mul(s[0, d], q)[0, d]
puts bostan_mori(p, q, n)
`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'Codeforces',
      title: '622F — The Sum of the k-th Powers',
      difficulty: '2200',
      url: 'https://codeforces.com/problemset/problem/622/F',
      patternNote: 'Direct O(K) consecutive-point Lagrange interpolation over y[0..K+1].',
    },
    {
      platform: 'Codeforces',
      title: '506E — Mr. Kitayuta’s Gift / Recurrence Extraction Classics',
      difficulty: '2600',
      url: 'https://codeforces.com/problemset?tags=math,matrices',
      patternNote: 'Compute small-N DP values then extract minimal recurrence via Berlekamp-Massey + Bostan-Mori.',
    },
    {
      platform: 'AtCoder',
      title: 'ABC299Ex / ACL Linear Recurrence Tasks',
      difficulty: '2200–2500',
      url: 'https://atcoder.jp/contests/abc299',
      patternNote: 'Polynomial extrapolation and [x^N] P(x)/Q(x) evaluation modulo 998244353.',
    },
  ],
  interviewNotes: [
    'Explain why Lagrange interpolation drops from O(D^2) to O(D) when evaluation nodes are consecutive integers x = 0, 1, ..., D: denominators collapse into (-1)^(D-i) * i! * (D-i)! and numerators share prefix/suffix products.',
    'Articulate Berlekamp-Massey’s intuition: every time the current minimal LFSR fails at index i, you subtract a scaled, shifted copy of the best previous failing LFSR whose shift aligns its old failure with index i.',
    'Highlight why Bostan-Mori is often preferred over matrix exponentiation in 2200+ contests: O(d^2 log N) polynomial squaring beats O(d^3 log N) matrix multiplication by an order of magnitude.',
  ],
  projectBlueprint: {
    title: 'Automated Recurrence Discovery & Polynomial Extrapolation Engine',
    tagline: 'Black-box sequence analyzer that infers closed-form polynomials or minimal recurrences from finite trace prefixes',
    stackSummary: 'TypeScript Modular Algebra Core + Step-by-Step BM Discrepancy Log',
    asciiDiagram: [
      '+---------------------------------------------------------------+',
      '|  Sample Sequence s[0..M-1]                                    |',
      '|    +---> [Constant/Poly Difference Check] ---> O(D) Lagrange  |',
      '|    +---> [Berlekamp-Massey O(M^2)] ----> Q(x) + Bostan-Mori   |',
      '|                                               |               |',
      '|                                        s[10^18] mod P         |',
      '+---------------------------------------------------------------+',
    ].join('\n'),
    milestones: [
      {
        id: 'm1',
        title: 'O(D) Consecutive-Node Interpolator',
        detail: 'Implement prefix/suffix products and precomputed inverse factorials mod P.',
      },
      {
        id: 'm2',
        title: 'Berlekamp-Massey Recurrence Extractor',
        detail: 'Emit order L and feedback vector whenever 2L <= M terms are supplied.',
      },
      {
        id: 'm3',
        title: 'Bostan-Mori Parity Decimator',
        detail: 'Compute [x^N] P(x)/Q(x) for arbitrary 64-bit N via Q(-x) even/odd filtering.',
      },
    ],
    starterCode: `export function modPow(base: bigint, exp: bigint, mod: bigint): bigint {
  let res = 1n;
  let b = ((base % mod) + mod) % mod;
  let e = exp;
  while (e > 0n) {
    if ((e & 1n) === 1n) res = (res * b) % mod;
    b = (b * b) % mod;
    e >>= 1n;
  }
  return res;
}`,
  },
};
