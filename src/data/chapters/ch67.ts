import type { TheoryChapter } from '../../types/vault';

export const CH67_BURNSIDE_POLYA_COUNTING: TheoryChapter = {
  slug: 'burnside-polya-counting',
  topicId: 'ma-58',
  title: 'Burnside Lemma & Polya Enumeration Theorem',
  domain: 'Math, Number Theory & Algebra',
  ratingTier: '2200–2600',
  usacoDivision: 'Platinum',
  subtitle: 'Orbit counting via permutation cycle decompositions, Euler totient divisor sums, and integer partition cycle indices',
  analogyTitle: 'Averaging the Still Photographs That Look Unchanged After Spinning the Kaleidoscope',
  analogyBody:
    'Trying to count "distinct necklaces" or "non-isomorphic graphs" directly fails because orbits under rotation, reflection, or vertex relabeling vary wildly in size: an all-blue necklace has symmetry orbit size 1, while an asymmetric pattern has orbit size 2N.\n\nBurnside’s Lemma flips the perspective cleanly: instead of summing 1 / |Orbit(x)| over exponentially many colorings x, sum the count of FIXED colorings |Fix(g)| over every symmetry group operation g in G, and divide by |G|. A coloring is fixed by permutation g if and only if every element inside each disjoint cycle of g receives the exact same color—immediately yielding |Fix(g)| = M^{c(g)}, where c(g) is the cycle count of g (Polya’s Enumeration Theorem).\n\nFor cyclic rotations, grouping all N rotations by their cycle length collapses |G| terms into an O(sqrt(N) log N) divisor sum over Euler’s totient phi(N / d). For unlabeled graphs on N vertices, iterating the integer partitions of N lets us compute the exact cycle index over unordered vertex pairs.',
  prerequisites: [
    { slug: 'combinatorics-lucas-catalan', title: 'Combinatorics, Stars & Bars, Catalan & Lucas Theorem' },
  ],
  traceTitle: 'Dihedral Group D_4 Burnside Fixed-Point Enumeration',
  traceSubtitle: 'Counting distinct 4-bead bracelets with M = 3 colors under all 8 symmetries of D_4',
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Identity Rotation r^0 (0 Degrees)',
      explanation: 'Every bead maps to itself: 4 disjoint 1-cycles -> c(g) = 4. Fixed colorings = 3^4 = 81.',
      mode: 'array',
      arrays: [
        {
          name: 'Cycle Decomposition (1)(2)(3)(4)',
          cells: [
            { index: 1, value: 'C1', label: 'bead 1', highlight: 'active' },
            { index: 2, value: 'C2', label: 'bead 2', highlight: 'updated' },
            { index: 3, value: 'C3', label: 'bead 3', highlight: 'window' },
            { index: 4, value: 'C4', label: 'bead 4', highlight: 'neutral' },
          ],
        },
      ],
      variables: { symmetry: 'r^0', cycles: 4, fixedCount: 81 },
    },
    {
      stepNumber: 2,
      title: '90-Degree & 270-Degree Rotations (r^1, r^3)',
      explanation: 'Shifting by 1 or 3 mod 4 visits all beads in one cycle: (1 2 3 4). Cycle count c(g) = gcd(4, 1) = 1. Each contributes 3^1 = 3 fixed colorings (sum = 6).',
      mode: 'array',
      arrays: [
        {
          name: 'Single 4-Cycle (1 2 3 4)',
          cells: [
            { index: 1, value: 'C1', label: 'bead 1', highlight: 'active' },
            { index: 2, value: 'C1', label: 'bead 2', highlight: 'active' },
            { index: 3, value: 'C1', label: 'bead 3', highlight: 'active' },
            { index: 4, value: 'C1', label: 'bead 4', highlight: 'active' },
          ],
        },
      ],
      variables: { symmetries: 'r^1, r^3', cyclesEach: 1, combinedFixed: 6 },
    },
    {
      stepNumber: 3,
      title: '180-Degree Rotation r^2',
      explanation: 'Swaps opposite pairs (1 3)(2 4): c(g) = gcd(4, 2) = 2 disjoint 2-cycles -> 3^2 = 9 fixed colorings.',
      mode: 'array',
      arrays: [
        {
          name: 'Pair Cycles (1 3)(2 4)',
          cells: [
            { index: 1, value: 'C1', label: 'bead 1', highlight: 'active' },
            { index: 2, value: 'C2', label: 'bead 2', highlight: 'updated' },
            { index: 3, value: 'C1', label: 'bead 3', highlight: 'active' },
            { index: 4, value: 'C2', label: 'bead 4', highlight: 'updated' },
          ],
        },
      ],
      variables: { symmetry: 'r^2', cycles: 2, fixedCount: 9 },
    },
    {
      stepNumber: 4,
      title: 'Two Diagonal & Two Edge-Bisecting Reflections',
      explanation: 'Two axes pierce opposite beads giving 3 cycles (1)(3)(2 4) -> 2 * 3^3 = 54. Two bisecting axes swap pairs (1 2)(3 4) giving 2 cycles -> 2 * 3^2 = 18.',
      mode: 'array',
      arrays: [
        {
          name: 'D_4 Sum Before Division by |G| = 8',
          cells: [
            { index: 0, value: 81, label: 'r^0', highlight: 'neutral' },
            { index: 1, value: 6, label: 'r^1,r^3', highlight: 'neutral' },
            { index: 2, value: 9, label: 'r^2', highlight: 'neutral' },
            { index: 3, value: 72, label: '4 flips', highlight: 'updated' },
          ],
        },
      ],
      variables: { totalSum: 168, groupSize: 8, distinctBracelets: 21 },
    },
  ],
  reductionClues: [
    {
      clue: 'Count cyclic necklaces of N beads with M colors up to rotation only (N <= 10^9)',
      translation: 'Apply Burnside with cyclic group C_N: factor N in O(sqrt(N)), sum phi(N / d) * M^d over divisors d | N, divide by N.',
    },
    {
      clue: 'Count bracelets (rotations AND flips) or N x N grids under 90-degree symmetry',
      translation: 'Enumerate exact cycle structures of reflections (checking N odd vs. even) or the 4 quarter-turn symmetries and divide by |G|.',
    },
    {
      clue: 'Count non-isomorphic unlabeled graphs or hypergraphs on N <= 25 vertices',
      translation: 'Instead of summing over N! permutations, group by integer partitions lambda of N and compute induced edge-pair cycles in O(P(N)).',
    },
    {
      clue: 'Group size |G| divides a prime modulus 10^9 + 7',
      translation: 'Invert |G| using Fermat modular inverse pow(|G|, MOD - 2, MOD) ONLY when gcd(|G|, MOD) == 1 (verify edge cases where N is a multiple of MOD!).',
    },
  ],
  timeComplexity: 'O(sqrt(N) log N) for necklaces/bracelets; O(P(N) * L^2) over integer partitions for unlabeled graphs',
  spaceComplexity: 'O(P(N)) / O(N) auxiliary storage',
  pitfalls: [
    {
      type: 'WA',
      title: 'Exponent Reduction Modulo MOD Instead of MOD - 1',
      detail: 'In Symmetric Grid Coloring (N <= 10^9), the cycle count exponent reaches N^2 <= 10^18. When N^2 exceeds MOD, reducing N^2 mod MOD gives the wrong power! Always reduce exponents modulo (MOD - 1) via Fermat’s Little Theorem (or pass 64-bit N^2 directly with unsigned/int64 safe care, note: since N <= 10^9, N^2 <= 10^18 fits directly in signed 64-bit long long!).',
    },
    {
      type: 'WA',
      title: 'Confusing Necklace (Rotations Only) vs. Bracelet (Dihedral Rotations + Flips)',
      detail: 'Counting Necklaces uses group C_N (|G| = N), while bracelets allow mirror flips via dihedral group D_N (|G| = 2N). Verify parity of N carefully for reflection axes: even N splits flips evenly into (N/2 + 1)-cycle vertex axes and (N/2)-cycle edge-bisecting axes.',
    },
    {
      type: 'WA',
      title: 'Double-Counting Distinct Vertex Pairs Within One Cycle in Unlabeled Graph Polya',
      detail: 'For a single vertex cycle of length L, unordered pairs inside the cycle form floor(L / 2) edge orbits (because when L is even, the antipodal distance L/2 pair maps onto itself after L/2 steps, creating a half-length orbit of size L/2—still 1 orbit per distance d in 1..floor(L/2)!). Between cycles of length L1 and L2, there are gcd(L1, L2) edge orbits.',
    },
    {
      type: 'RE',
      title: 'Computing Multiplicative Inverse When Group Size Divides MOD',
      detail: 'If |G| is divisible by MOD (e.g., N = 10^9 + 7), inv(|G|) mod MOD does not exist! Compute either exact BigInt or multiply modulo (|G| * MOD) if needed (standard contests guarantee N < MOD).',
    },
  ],
  implementations: {
    cpp20: `#include <iostream>
#include <vector>
using namespace std;

// Dihedral Group D_N Polya Enumeration: Distinct Necklaces & Bracelets in O(sqrt(N) log N)
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

long long eulerPhi(long long x) {
    long long res = x;
    for (long long p = 2; p * p <= x; ++p) {
        if (x % p == 0) {
            while (x % p == 0) x /= p;
            res -= res / p;
        }
    }
    if (x > 1) res -= res / x;
    return res;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    long long n, m;
    if (!(cin >> n >> m)) return 0;

    long long rotSum = 0;
    for (long long d = 1; d * d <= n; ++d) {
        if (n % d == 0) {
            rotSum = (rotSum + (eulerPhi(n / d) % MOD) * modPow(m, d)) % MOD;
            if (d * d != n) {
                long long d2 = n / d;
                rotSum = (rotSum + (eulerPhi(n / d2) % MOD) * modPow(m, d2)) % MOD;
            }
        }
    }

    long long reflSum = 0;
    if (n % 2 == 1) {
        reflSum = (n % MOD) * modPow(m, (n + 1) / 2) % MOD;
    } else {
        long long half = (n / 2) % MOD;
        reflSum = half * ((modPow(m, n / 2 + 1) + modPow(m, n / 2)) % MOD) % MOD;
    }

    long long bracelets = ((rotSum + reflSum) % MOD) * modPow((2 * n) % MOD, MOD - 2) % MOD;
    cout << bracelets << "\\n";
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

fn euler_phi(mut x: i64) -> i64 {
    let mut res = x;
    let mut p = 2i64;
    while p * p <= x {
        if x % p == 0 {
            while x % p == 0 {
                x /= p;
            }
            res -= res / p;
        }
        p += 1;
    }
    if x > 1 {
        res -= res / x;
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
    let m: i64 = it.next().unwrap().parse().unwrap();

    let mut rot_sum = 0i64;
    let mut d = 1i64;
    while d * d <= n {
        if n % d == 0 {
            rot_sum = (rot_sum + (euler_phi(n / d) % MOD) * mod_pow(m, d)) % MOD;
            if d * d != n {
                let d2 = n / d;
                rot_sum = (rot_sum + (euler_phi(n / d2) % MOD) * mod_pow(m, d2)) % MOD;
            }
        }
        d += 1;
    }

    let refl_sum = if n % 2 == 1 {
        (n % MOD) * mod_pow(m, (n + 1) / 2) % MOD
    } else {
        let half = (n / 2) % MOD;
        half * ((mod_pow(m, n / 2 + 1) + mod_pow(m, n / 2)) % MOD) % MOD
    };

    let bracelets = ((rot_sum + refl_sum) % MOD) * mod_pow((2 * n) % MOD, MOD - 2) % MOD;
    println!("{}", bracelets);
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

    static long eulerPhi(long x) {
        long res = x;
        for (long p = 2; p * p <= x; p++) {
            if (x % p == 0) {
                while (x % p == 0) x /= p;
                res -= res / p;
            }
        }
        if (x > 1) res -= res / x;
        return res;
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        long n = fs.nextLong();
        if (n == -1) return;
        long m = fs.nextLong();

        long rotSum = 0;
        for (long d = 1; d * d <= n; d++) {
            if (n % d == 0) {
                rotSum = (rotSum + (eulerPhi(n / d) % MOD) * modPow(m, d)) % MOD;
                if (d * d != n) {
                    long d2 = n / d;
                    rotSum = (rotSum + (eulerPhi(n / d2) % MOD) * modPow(m, d2)) % MOD;
                }
            }
        }

        long reflSum;
        if (n % 2 == 1) {
            reflSum = (n % MOD) * modPow(m, (n + 1) / 2) % MOD;
        } else {
            long half = (n / 2) % MOD;
            reflSum = half * ((modPow(m, n / 2 + 1) + modPow(m, n / 2)) % MOD) % MOD;
        }

        long bracelets = ((rotSum + reflSum) % MOD) * modPow((2 * n) % MOD, MOD - 2) % MOD;
        System.out.println(bracelets);
    }
}
`,
    python3: `import sys

sys.setrecursionlimit(200000)
MOD = 1_000_000_007


def euler_phi(x: int) -> int:
    res = x
    p = 2
    while p * p <= x:
        if x % p == 0:
            while x % p == 0:
                x //= p
            res -= res // p
        p += 1
    if x > 1:
        res -= res // x
    return res


def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    m = int(data[1])

    rot_sum = 0
    d = 1
    while d * d <= n:
        if n % d == 0:
            rot_sum = (rot_sum + euler_phi(n // d) * pow(m, d, MOD)) % MOD
            if d * d != n:
                d2 = n // d
                rot_sum = (rot_sum + euler_phi(n // d2) * pow(m, d2, MOD)) % MOD
        d += 1

    if n % 2 == 1:
        refl_sum = (n % MOD) * pow(m, (n + 1) // 2, MOD) % MOD
    else:
        half = (n // 2) % MOD
        refl_sum = half * ((pow(m, n // 2 + 1, MOD) + pow(m, n // 2, MOD)) % MOD) % MOD

    bracelets = (rot_sum + refl_sum) % MOD * pow((2 * n) % MOD, MOD - 2, MOD) % MOD
    print(bracelets)


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

def euler_phi(x)
  res = x
  p = 2
  while p * p <= x
    if x % p == 0
      x /= p while x % p == 0
      res -= res / p
    end
    p += 1
  end
  res -= res / x if x > 1
  res
end

data = $stdin.read.split
exit if data.empty?
n = data[0].to_i
m = data[1].to_i

rot_sum = 0
d = 1
while d * d <= n
  if n % d == 0
    rot_sum = (rot_sum + (euler_phi(n / d) % MOD) * mod_pow(m, d)) % MOD
    if d * d != n
      d2 = n / d
      rot_sum = (rot_sum + (euler_phi(n / d2) % MOD) * mod_pow(m, d2)) % MOD
    end
  end
  d += 1
end

refl_sum =
  if n.odd?
    (n % MOD) * mod_pow(m, (n + 1) / 2) % MOD
  else
    half = (n / 2) % MOD
    half * ((mod_pow(m, n / 2 + 1) + mod_pow(m, n / 2)) % MOD) % MOD
  end

puts ((rot_sum + refl_sum) % MOD) * mod_pow((2 * n) % MOD, MOD - 2) % MOD
`,
  },
  practiceProblems: [
    {
      id: 'ch67-p1',
      tier: 'Warmup',
      ratingRange: '2000–2250',
      title: 'Counting Necklaces (Cyclic Rotation Equivalence)',
      statement:
        'Your task is to count the number of different necklaces that consist of N pearls where each pearl has M possible colors. Two necklaces are considered the same if it is possible to rotate one to get the other. Output the count modulo 10^9 + 7.',
      constraints: '1 <= N, M <= 10^9',
      sampleInput: '4 3',
      sampleOutput: '24',
      hints: [
        'Rotation by k positions (0 <= k < N) decomposes N beads into exactly gcd(k, N) cycles.',
        'For each divisor d | N, count how many shifts k have gcd(k, N) = d: that equals eulerPhi(N / d).',
        'Sum eulerPhi(N / d) * M^d mod (10^9 + 7) across all divisors d of N, then multiply by pow(N, MOD - 2).',
      ],
      solutions: {
        cpp20: `#include <iostream>
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

long long eulerPhi(long long x) {
    long long res = x;
    for (long long p = 2; p * p <= x; ++p) {
        if (x % p == 0) {
            while (x % p == 0) x /= p;
            res -= res / p;
        }
    }
    if (x > 1) res -= res / x;
    return res;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    long long n, m;
    if (!(cin >> n >> m)) return 0;

    long long ans = 0;
    for (long long d = 1; d * d <= n; ++d) {
        if (n % d == 0) {
            ans = (ans + (eulerPhi(n / d) % MOD) * modPow(m, d)) % MOD;
            if (d * d != n) {
                long long d2 = n / d;
                ans = (ans + (eulerPhi(n / d2) % MOD) * modPow(m, d2)) % MOD;
            }
        }
    }

    ans = (ans * modPow(n % MOD, MOD - 2)) % MOD;
    cout << ans << "\\n";
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

fn euler_phi(mut x: i64) -> i64 {
    let mut res = x;
    let mut p = 2i64;
    while p * p <= x {
        if x % p == 0 {
            while x % p == 0 {
                x /= p;
            }
            res -= res / p;
        }
        p += 1;
    }
    if x > 1 {
        res -= res / x;
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
    let m: i64 = it.next().unwrap().parse().unwrap();

    let mut ans = 0i64;
    let mut d = 1i64;
    while d * d <= n {
        if n % d == 0 {
            ans = (ans + (euler_phi(n / d) % MOD) * mod_pow(m, d)) % MOD;
            if d * d != n {
                let d2 = n / d;
                ans = (ans + (euler_phi(n / d2) % MOD) * mod_pow(m, d2)) % MOD;
            }
        }
        d += 1;
    }

    println!("{}", (ans * mod_pow(n % MOD, MOD - 2)) % MOD);
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

    static long eulerPhi(long x) {
        long res = x;
        for (long p = 2; p * p <= x; p++) {
            if (x % p == 0) {
                while (x % p == 0) x /= p;
                res -= res / p;
            }
        }
        if (x > 1) res -= res / x;
        return res;
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        long n = fs.nextLong();
        if (n == -1) return;
        long m = fs.nextLong();

        long ans = 0;
        for (long d = 1; d * d <= n; d++) {
            if (n % d == 0) {
                ans = (ans + (eulerPhi(n / d) % MOD) * modPow(m, d)) % MOD;
                if (d * d != n) {
                    long d2 = n / d;
                    ans = (ans + (eulerPhi(n / d2) % MOD) * modPow(m, d2)) % MOD;
                }
            }
        }
        System.out.println((ans * modPow(n % MOD, MOD - 2)) % MOD);
    }
}
`,
        python3: `import sys

sys.setrecursionlimit(200000)
MOD = 1_000_000_007


def euler_phi(x: int) -> int:
    res = x
    p = 2
    while p * p <= x:
        if x % p == 0:
            while x % p == 0:
                x //= p
            res -= res // p
        p += 1
    if x > 1:
        res -= res // x
    return res


def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    m = int(data[1])

    ans = 0
    d = 1
    while d * d <= n:
        if n % d == 0:
            ans = (ans + euler_phi(n // d) * pow(m, d, MOD)) % MOD
            if d * d != n:
                d2 = n // d
                ans = (ans + euler_phi(n // d2) * pow(m, d2, MOD)) % MOD
        d += 1

    print(ans * pow(n % MOD, MOD - 2, MOD) % MOD)


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

def euler_phi(x)
  res = x
  p = 2
  while p * p <= x
    if x % p == 0
      x /= p while x % p == 0
      res -= res / p
    end
    p += 1
  end
  res -= res / x if x > 1
  res
end

data = $stdin.read.split
exit if data.empty?
n = data[0].to_i
m = data[1].to_i

ans = 0
d = 1
while d * d <= n
  if n % d == 0
    ans = (ans + (euler_phi(n / d) % MOD) * mod_pow(m, d)) % MOD
    if d * d != n
      d2 = n / d
      ans = (ans + (euler_phi(n / d2) % MOD) * mod_pow(m, d2)) % MOD
    end
  end
  d += 1
end

puts (ans * mod_pow(n % MOD, MOD - 2)) % MOD
`,
      },
    },
    {
      id: 'ch67-p2',
      tier: 'Standard',
      ratingRange: '2150–2350',
      title: 'Counting Rotation-Invariant N x N Square Grids',
      statement:
        'Count the number of different N x N grids where each cell has one of M colors. Two grids are considered identical if one can be rotated 0, 90, 180, or 270 degrees into the other. Output the count modulo 10^9 + 7.',
      constraints: '1 <= N <= 10^9, 1 <= M <= 10^9',
      sampleInput: '4 2',
      sampleOutput: '16456',
      hints: [
        'The symmetry group C_4 has 4 elements: 0, 90, 180, and 270 degrees.',
        'At 90 and 270 degrees, every cell orbits in a 4-cycle EXCEPT the single center cell when N is odd: c(90) = c(270) = floor(N^2 / 4) + (N % 2).',
        'At 180 degrees, cells pair into 2-cycles plus the center cell when N is odd: c(180) = floor(N^2 / 2) + (N % 2). Keep exponents in 64-bit integers and do NOT reduce N^2 modulo MOD!',
      ],
      solutions: {
        cpp20: `#include <iostream>
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

    long long n, m;
    if (!(cin >> n >> m)) return 0;

    long long n2 = n * n;
    long long odd = n % 2;

    long long c0 = n2;
    long long c90 = n2 / 4 + odd;
    long long c180 = n2 / 2 + odd;

    long long total = (modPow(m, c0) + 2LL * modPow(m, c90) + modPow(m, c180)) % MOD;
    long long ans = (total * modPow(4, MOD - 2)) % MOD;
    cout << ans << "\\n";
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
    let m: i64 = it.next().unwrap().parse().unwrap();

    let n2 = n * n;
    let odd = n % 2;
    let total = (mod_pow(m, n2) + 2 * mod_pow(m, n2 / 4 + odd) + mod_pow(m, n2 / 2 + odd)) % MOD;
    println!("{}", (total * mod_pow(4, MOD - 2)) % MOD);
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
        long m = fs.nextLong();

        long n2 = n * n;
        long odd = n % 2;
        long total = (modPow(m, n2) + 2L * modPow(m, n2 / 4 + odd) + modPow(m, n2 / 2 + odd)) % MOD;
        System.out.println((total * modPow(4, MOD - 2)) % MOD);
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
    m = int(data[1])

    n2 = n * n
    odd = n % 2
    total = (
        pow(m, n2, MOD)
        + 2 * pow(m, n2 // 4 + odd, MOD)
        + pow(m, n2 // 2 + odd, MOD)
    ) % MOD
    print(total * pow(4, MOD - 2, MOD) % MOD)


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
m = data[1].to_i

n2 = n * n
odd = n % 2
total = (mod_pow(m, n2) + 2 * mod_pow(m, n2 / 4 + odd) + mod_pow(m, n2 / 2 + odd)) % MOD
puts (total * mod_pow(4, MOD - 2)) % MOD
`,
      },
    },
    {
      id: 'ch67-p3',
      tier: 'Boss',
      ratingRange: '2400–2700',
      title: 'Non-Isomorphic Unlabeled Simple Graphs via Partition Cycle Index',
      statement:
        'Count the number of pairwise non-isomorphic simple undirected graphs on N unlabeled vertices (where two graphs are isomorphic if one can be turned into the other by permuting vertex labels). Output the answer modulo 10^9 + 7.',
      constraints: '1 <= N <= 40',
      sampleInput: '4',
      sampleOutput: '11',
      hints: [
        'Two graphs are isomorphic iff they lie in the same orbit under the symmetric group S_N acting on unordered vertex pairs {u, v}.',
        'Instead of summing over all N! permutations, generate every integer partition lambda = (l_1, l_2, ...) of N. A permutation of cycle type lambda induces floor(l_i / 2) edge cycles within cycle i plus gcd(l_i, l_j) edge cycles between cycles i < j.',
        'The number of permutations with cycle type lambda is N! / prod (i^{c_i} * c_i!). Dividing by |S_N| = N! cancels N! completely!',
      ],
      solutions: {
        cpp20: `#include <iostream>
#include <vector>
#include <numeric>
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

    int n;
    if (!(cin >> n)) return 0;

    vector<long long> fact(n + 1, 1), invFact(n + 1, 1), invNum(n + 1, 1);
    for (int i = 1; i <= n; ++i) {
        fact[i] = (fact[i - 1] * i) % MOD;
        invNum[i] = modPow(i, MOD - 2);
    }
    invFact[n] = modPow(fact[n], MOD - 2);
    for (int i = n - 1; i >= 0; --i) invFact[i] = (invFact[i + 1] * (i + 1)) % MOD;

    vector<int> cur;
    long long ans = 0;

    auto dfs = [&](auto&& self, int rem, int maxLen) -> void {
        if (rem == 0) {
            long long edgeCycles = 0;
            for (size_t i = 0; i < cur.size(); ++i) {
                edgeCycles += cur[i] / 2;
                for (size_t j = i + 1; j < cur.size(); ++j) {
                    edgeCycles += std::gcd(cur[i], cur[j]);
                }
            }
            long long weight = 1;
            for (size_t i = 0; i < cur.size();) {
                size_t j = i;
                while (j < cur.size() && cur[j] == cur[i]) ++j;
                int len = cur[i];
                int cnt = static_cast<int>(j - i);
                weight = (weight * modPow(invNum[len], cnt)) % MOD;
                weight = (weight * invFact[cnt]) % MOD;
                i = j;
            }
            ans = (ans + weight * modPow(2, edgeCycles)) % MOD;
            return;
        }
        for (int len = min(rem, maxLen); len >= 1; --len) {
            cur.push_back(len);
            self(self, rem - len, len);
            cur.pop_back();
        }
    };

    dfs(dfs, n, n);
    cout << ans << "\\n";
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

fn gcd(mut a: i64, mut b: i64) -> i64 {
    while b != 0 {
        let t = a % b;
        a = b;
        b = t;
    }
    a
}

fn dfs(
    rem: usize,
    max_len: usize,
    cur: &mut Vec<usize>,
    inv_num: &[i64],
    inv_fact: &[i64],
    ans: &mut i64,
) {
    if rem == 0 {
        let mut edge_cycles = 0i64;
        for i in 0..cur.len() {
            edge_cycles += (cur[i] / 2) as i64;
            for j in (i + 1)..cur.len() {
                edge_cycles += gcd(cur[i] as i64, cur[j] as i64);
            }
        }
        let mut weight = 1i64;
        let mut i = 0usize;
        while i < cur.len() {
            let mut j = i;
            while j < cur.len() && cur[j] == cur[i] {
                j += 1;
            }
            let len = cur[i];
            let cnt = j - i;
            weight = (weight * mod_pow(inv_num[len], cnt as i64)) % MOD;
            weight = (weight * inv_fact[cnt]) % MOD;
            i = j;
        }
        *ans = (*ans + weight * mod_pow(2, edge_cycles)) % MOD;
        return;
    }
    for len in (1..=rem.min(max_len)).rev() {
        cur.push(len);
        dfs(rem - len, len, cur, inv_num, inv_fact, ans);
        cur.pop();
    }
}

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let n: usize = match s.split_whitespace().next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };

    let mut fact = vec![1i64; n + 1];
    let mut inv_fact = vec![1i64; n + 1];
    let mut inv_num = vec![1i64; n + 1];
    for i in 1..=n {
        fact[i] = (fact[i - 1] * i as i64) % MOD;
        inv_num[i] = mod_pow(i as i64, MOD - 2);
    }
    inv_fact[n] = mod_pow(fact[n], MOD - 2);
    for i in (0..n).rev() {
        inv_fact[i] = (inv_fact[i + 1] * (i + 1) as i64) % MOD;
    }

    let mut cur = Vec::new();
    let mut ans = 0i64;
    dfs(n, n, &mut cur, &inv_num, &inv_fact, &mut ans);
    println!("{}", ans);
}
`,
        java21: `import java.io.BufferedInputStream;
import java.io.IOException;
import java.util.ArrayList;

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

        int nextInt() throws IOException {
            int c;
            do {
                c = readByte();
                if (c == -1) return -1;
            } while (c <= ' ');
            int res = 0;
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

    static int gcd(int a, int b) {
        while (b != 0) {
            int t = a % b;
            a = b;
            b = t;
        }
        return a;
    }

    static long[] invNum, invFact;
    static long ans = 0;
    static ArrayList<Integer> cur = new ArrayList<>();

    static void dfs(int rem, int maxLen) {
        if (rem == 0) {
            long edgeCycles = 0;
            for (int i = 0; i < cur.size(); i++) {
                edgeCycles += cur.get(i) / 2;
                for (int j = i + 1; j < cur.size(); j++) {
                    edgeCycles += gcd(cur.get(i), cur.get(j));
                }
            }
            long weight = 1;
            for (int i = 0; i < cur.size(); ) {
                int j = i;
                while (j < cur.size() && cur.get(j).equals(cur.get(i))) j++;
                int len = cur.get(i);
                int cnt = j - i;
                weight = (weight * modPow(invNum[len], cnt)) % MOD;
                weight = (weight * invFact[cnt]) % MOD;
                i = j;
            }
            ans = (ans + weight * modPow(2, edgeCycles)) % MOD;
            return;
        }
        for (int len = Math.min(rem, maxLen); len >= 1; len--) {
            cur.add(len);
            dfs(rem - len, len);
            cur.remove(cur.size() - 1);
        }
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        int n = fs.nextInt();
        if (n == -1) return;

        long[] fact = new long[n + 1];
        invNum = new long[n + 1];
        invFact = new long[n + 1];
        fact[0] = 1;
        invNum[0] = 1;
        for (int i = 1; i <= n; i++) {
            fact[i] = (fact[i - 1] * i) % MOD;
            invNum[i] = modPow(i, MOD - 2);
        }
        invFact[n] = modPow(fact[n], MOD - 2);
        for (int i = n - 1; i >= 0; i--) invFact[i] = (invFact[i + 1] * (i + 1)) % MOD;

        dfs(n, n);
        System.out.println(ans);
    }
}
`,
        python3: `import math
import sys

sys.setrecursionlimit(200000)
MOD = 1_000_000_007


def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])

    fact = [1] * (n + 1)
    inv_num = [1] * (n + 1)
    for i in range(1, n + 1):
        fact[i] = fact[i - 1] * i % MOD
        inv_num[i] = pow(i, MOD - 2, MOD)
    inv_fact = [1] * (n + 1)
    inv_fact[n] = pow(fact[n], MOD - 2, MOD)
    for i in range(n - 1, -1, -1):
        inv_fact[i] = inv_fact[i + 1] * (i + 1) % MOD

    cur: list[int] = []
    ans = 0

    def dfs(rem: int, max_len: int) -> None:
        nonlocal ans
        if rem == 0:
            edge_cycles = 0
            for i in range(len(cur)):
                edge_cycles += cur[i] // 2
                for j in range(i + 1, len(cur)):
                    edge_cycles += math.gcd(cur[i], cur[j])
            weight = 1
            i = 0
            while i < len(cur):
                j = i
                while j < len(cur) and cur[j] == cur[i]:
                    j += 1
                length = cur[i]
                cnt = j - i
                weight = weight * pow(inv_num[length], cnt, MOD) % MOD * inv_fact[cnt] % MOD
                i = j
            ans = (ans + weight * pow(2, edge_cycles, MOD)) % MOD
            return
        for length in range(min(rem, max_len), 0, -1):
            cur.append(length)
            dfs(rem - length, length)
            cur.pop()

    dfs(n, n)
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

fact = Array.new(n + 1, 1)
inv_num = Array.new(n + 1, 1)
(1..n).each do |i|
  fact[i] = (fact[i - 1] * i) % MOD
  inv_num[i] = mod_pow(i, MOD - 2)
end
inv_fact = Array.new(n + 1, 1)
inv_fact[n] = mod_pow(fact[n], MOD - 2)
(n - 1).downto(0) { |i| inv_fact[i] = (inv_fact[i + 1] * (i + 1)) % MOD }

cur = []
ans = 0

dfs = lambda do |rem, max_len|
  if rem == 0
    edge_cycles = 0
    cur.length.times do |i|
      edge_cycles += cur[i] / 2
      ((i + 1)...cur.length).each do |j|
        edge_cycles += cur[i].gcd(cur[j])
      end
    end
    weight = 1
    i = 0
    while i < cur.length
      j = i
      j += 1 while j < cur.length && cur[j] == cur[i]
      len = cur[i]
      cnt = j - i
      weight = (weight * mod_pow(inv_num[len], cnt) % MOD * inv_fact[cnt]) % MOD
      i = j
    end
    ans = (ans + weight * mod_pow(2, edge_cycles)) % MOD
    return
  end
  [rem, max_len].min.downto(1) do |len|
    cur << len
    dfs.call(rem - len, len)
    cur.pop
  end
end

dfs.call(n, n)
puts ans
`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'CSES',
      title: 'Counting Necklaces (2209) & Counting Grids (2210)',
      difficulty: 'Medium–Hard',
      url: 'https://cses.fi/problemset/task/2209',
      patternNote: 'Canonical Polya enumeration problems over cyclic group C_N and 4-rotation square group C_4.',
    },
    {
      platform: 'Codeforces',
      title: '805F / 633F / Polya Necklace & Bracelet Classics',
      difficulty: '2200–2500',
      url: 'https://codeforces.com/problemset?tags=combinatorics',
      patternNote: 'Burnside fixed-point counting combined with divisor totient sums or DP inside fixed cycles.',
    },
    {
      platform: 'AtCoder',
      title: 'ABC284 / Polya Partition Isomorphism Counting',
      difficulty: '2300–2600',
      url: 'https://atcoder.jp/',
      patternNote: 'Integer-partition cycle index evaluation avoids N! enumeration when counting unlabeled structures.',
    },
  ],
  interviewNotes: [
    'Prove Burnside’s Lemma cleanly by double-counting pairs (g, x) with g(x) = x: summing over colorings gives sum_{x} |Stab(x)| = sum_orbits |O| * (|G|/|O|) = #Orbits * |G|.',
    'Explain why grouping rotations by divisor d = gcd(k, N) converts an O(N) sum over all group elements into O(sqrt(N) log N) via Euler’s totient phi(N / d).',
    'Walk through how integer partitions compress S_N from N! group operations down to P(N) cycle types (where P(25) = 1958, P(40) = 37338), letting us count non-isomorphic graphs in milliseconds.',
  ],
  projectBlueprint: {
    title: 'Molecular Isomer & Symmetric Tile-Pattern Enumeration Engine',
    tagline: 'Group-theoretic combinatorial counter for symmetry-deduplicated chemical rings, lattices, and graph topologies',
    stackSummary: 'TypeScript Modular Algebra Core + Partition Cycle-Index Generator',
    asciiDiagram: [
      '+---------------------------------------------------------------+',
      '|  Symmetry Group G  (Cyclic C_N | Dihedral D_N | Symmetric S_N)|',
      '|        |                                                      |',
      '|        +--> Decompose g into disjoint cycles c(g)             |',
      '|        +--> |Fix(g)| = M^{c(g)}  (Polya Enumeration)          |',
      '|        v                                                      |',
      '|  Distinct Orbits = (1 / |G|) * sum |Fix(g)| mod P             |',
      '+---------------------------------------------------------------+',
    ].join('\n'),
    milestones: [
      {
        id: 'm1',
        title: 'Divisor-Totient Cyclic Group Evaluator',
        detail: 'Compute exact orbit counts for rings up to N = 10^9 in sub-millisecond time.',
      },
      {
        id: 'm2',
        title: 'Dihedral & 2D Lattice Axis Analyzer',
        detail: 'Handle parity-split reflection cycles and 90-degree matrix rotational symmetries.',
      },
      {
        id: 'm3',
        title: 'Integer Partition Cycle-Index Engine',
        detail: 'Enumerate vertex cycle partitions to count non-isomorphic graphs without adjacency-matrix hashing.',
      },
    ],
    starterCode: `export function eulerPhi(x: number): number {
  let res = x, n = x;
  for (let p = 2; p * p <= n; p++) {
    if (n % p === 0) {
      while (n % p === 0) n = Math.floor(n / p);
      res -= Math.floor(res / p);
    }
  }
  if (n > 1) res -= Math.floor(res / n);
  return res;
}`,
  },
};
