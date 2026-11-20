import type { TheoryChapter } from '../../types/vault';

export const CH31_MOD_EXP_EXTGCD_CRT: TheoryChapter = {
  slug: 'modular-arithmetic-fermat-crt',
  topicId: 'ma-47',
  title: 'Modular Exponentiation, Extended GCD & CRT',
  domain: 'Math, Number Theory & Algebra',
  ratingTier: '1200–1400',
  usacoDivision: 'Silver',
  subtitle:
    'Compute A^B mod M in O(log B), invert any coprime modulus via Extended Euclidean Bezout coefficients (ax + by = g), and merge arbitrary congruence systems with the Chinese Remainder Theorem.',
  analogyTitle: 'The Synchronized Gear-Wheel & Clockwork Remainder Analogy',
  analogyBody:
    'Suppose two clock gears spin around a 35-tooth wheel and a 12-tooth wheel. Pressing the `35`-tooth gear forward (`+35`) and the `12`-tooth gear backward (`-12`) can nudge their alignment by **1 exact tooth** (`35*(-1) + 12*(3) = 1`). **Extended GCD** discovers those exact nudge counts `(x, y)` automatically as it unwinds Euclid’s remainder divisions! Even better, suppose a secret timestamp leaves remainder `2` on a 3-hour clock and remainder `3` on a 5-hour clock: the **Chinese Remainder Theorem (CRT)** stitches those independent clocks together into a single combined `15`-hour super-clock (`t ≡ 8 mod 15`), generalizing cleanly even when clock sizes share common factors!',
  prerequisites: [
    {
      slug: 'euclidean-gcd-sieve-factorization',
      title: 'Euclidean GCD, Sieve of Eratosthenes & SPF Factorization',
    },
  ],
  traceTitle: 'Interactive Extended Euclidean Algorithm (ax + by = gcd(a, b)) Trace',
  traceSubtitle:
    'Step through finding Bezout coefficients `(x, y)` for `35x + 12y = gcd(35, 12) = 1`, revealing `12^-1 mod 35 = 3` and `35^-1 mod 12 = 11`.',
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Step 1: Forward Euclidean Division Chain on (35, 12)',
      explanation:
        'Unroll standard remainders: 35 = 2*12 + 11 (q=2), then 12 = 1*11 + 1 (q=1), then 11 = 11*1 + 0 (q=11). We hit base case (a, b) = (1, 0) where gcd = 1 and trivial solution is x = 1, y = 0!',
      mode: 'array',
      arrays: [
        {
          name: 'Call Stack (a, b, q=a/b)',
          cells: [
            { index: 0, value: '(35, 12) q=2', highlight: 'window' },
            { index: 1, value: '(12, 11) q=1', highlight: 'window' },
            { index: 2, value: '(11, 1) q=11', highlight: 'window' },
            { index: 3, value: '(1, 0) BASE', highlight: 'active' },
          ],
        },
        {
          name: 'Current Bezout (x, y)',
          cells: [
            { index: 0, value: 'x = 1', highlight: 'updated' },
            { index: 1, value: 'y = 0', highlight: 'updated' },
          ],
        },
      ],
      variables: { BaseCase: '1*(1) + 0*(0) = 1', Depth: 3, GCD: 1 },
    },
    {
      stepNumber: 2,
      title: 'Step 2: Unwind Frame (11, 1) Using x = y1, y = x1 - (a/b)*y1',
      explanation:
        'From child (x1=1, y1=0) on (11, 1) with q = 11/1 = 11: new x = y1 = 0, new y = x1 - 11*y1 = 1 - 0 = 1. Check: 11*(0) + 1*(1) = 1!',
      mode: 'array',
      arrays: [
        {
          name: 'Call Stack (Active Frame)',
          cells: [
            { index: 0, value: '(35, 12) q=2', highlight: 'neutral' },
            { index: 1, value: '(12, 11) q=1', highlight: 'neutral' },
            { index: 2, value: '(11, 1) q=11', highlight: 'active' },
            { index: 3, value: '(1, 0) DONE', highlight: 'neutral' },
          ],
        },
        {
          name: 'Returned (x, y)',
          cells: [
            { index: 0, value: 'x = 0', highlight: 'updated' },
            { index: 1, value: 'y = 1', highlight: 'updated' },
          ],
        },
      ],
      variables: { Formula: '11*(0) + 1*(1) = 1', x1: 1, y1: 0, Quotient: 11 },
    },
    {
      stepNumber: 3,
      title: 'Step 3: Unwind Frame (12, 11) With q = 12/11 = 1',
      explanation:
        'From child (x1=0, y1=1) with q = 1: new x = y1 = 1, new y = x1 - 1*y1 = 0 - 1 = -1. Check: 12*(1) + 11*(-1) = 1!',
      mode: 'array',
      arrays: [
        {
          name: 'Call Stack (Active Frame)',
          cells: [
            { index: 0, value: '(35, 12) q=2', highlight: 'neutral' },
            { index: 1, value: '(12, 11) q=1', highlight: 'active' },
            { index: 2, value: '(11, 1) DONE', highlight: 'neutral' },
            { index: 3, value: '(1, 0) DONE', highlight: 'neutral' },
          ],
        },
        {
          name: 'Returned (x, y)',
          cells: [
            { index: 0, value: 'x = 1', highlight: 'updated' },
            { index: 1, value: 'y = -1', highlight: 'updated' },
          ],
        },
      ],
      variables: { Formula: '12*(1) + 11*(-1) = 1', x1: 0, y1: 1, Quotient: 1 },
    },
    {
      stepNumber: 4,
      title: 'Step 4: Unwind Root Frame (35, 12) -> 35*(-1) + 12*(3) = 1!',
      explanation:
        'From child (x1=1, y1=-1) with q = 35/12 = 2: new x = -1, new y = 1 - 2*(-1) = 3. Verification: 35*(-1) + 12*(3) = -35 + 36 = 1! Hence 35^-1 mod 12 = (-1 mod 12) = 11, and 12^-1 mod 35 = 3!',
      mode: 'array',
      arrays: [
        {
          name: 'Call Stack (Root Resolved)',
          cells: [
            { index: 0, value: '(35, 12) DONE', highlight: 'active' },
            { index: 1, value: '(12, 11) DONE', highlight: 'neutral' },
            { index: 2, value: '(11, 1) DONE', highlight: 'neutral' },
            { index: 3, value: '(1, 0) DONE', highlight: 'neutral' },
          ],
        },
        {
          name: 'Final Bezout & Mod Inverses',
          cells: [
            { index: 0, value: 'x = -1', highlight: 'updated' },
            { index: 1, value: 'y = 3', highlight: 'updated' },
            { index: 2, value: '35^-1%12 = 11', highlight: 'window' },
            { index: 3, value: '12^-1%35 = 3', highlight: 'window' },
          ],
        },
      ],
      variables: { Identity: '35*(-1) + 12*(3) = 1', Inv35Mod12: 11, Inv12Mod35: 3 },
    },
  ],
  reductionClues: [
    {
      clue: '"Compute (A / B) mod M where M is prime (e.g. 10^9 + 7 or 998244353)"',
      translation:
        'Fermat’s Little Theorem: `B^-1 mod M = modPow(B, M - 2, M)` in `O(log M)`! Remember to verify `B % M != 0` when dividing in modular arithmetic.',
    },
    {
      clue: '"Compute A^-1 mod M where M is COMPOSITE (e.g. 10^9, 2^32, or unknown factorization)"',
      translation:
        'Fermat’s Little Theorem FAILS on composite `M`! Use **Extended GCD** `extgcd(A, M)`: an inverse exists if and only if `gcd(A, M) == 1`, and equals `((x % M) + M) % M`!',
    },
    {
      clue: '"Find integer solutions (x, y) to ax + by = c (or count solutions in [L, R])"',
      translation:
        'Linear Diophantine Equation! Solutions exist iff `c % gcd(a, b) == 0`. Scale Bezout `(x0, y0)` by `c / g`, then shift along the family `x = x0 + k*(b/g), y = y0 - k*(a/g)`.',
    },
    {
      clue: '"Find smallest x satisfying x ≡ r_i (mod m_i) across K congruences (coprime or non-coprime)"',
      translation:
        'Iterative CRT Merge! Combine `(r1, m1)` and `(r2, m2)` two at a time: solve `m1 * t ≡ (r2 - r1) (mod m2)` using `extgcd(m1, m2)`. If `(r2 - r1) % g != 0`, return NO SOLUTION; otherwise new modulus is `lcm(m1, m2) = m1 / g * m2`!',
    },
  ],
  timeComplexity: 'Binary Exponentiation: O(log E) | Extended GCD: O(log min(A, B)) | K-Equation CRT: O(K log LCM)',
  spaceComplexity: 'O(1) Iterative / O(log min(A, B)) Recursive Stack',
  pitfalls: [
    {
      type: 'WA',
      title: 'Using Negative C++/Java Remainders Without Normalizing ((x % M) + M) % M',
      detail:
        'Extended GCD regularly returns negative `x` (such as `x = -1` for `35^-1 mod 12`), and `(a - b) % M` in C++/Rust/Java stays negative! Always wrap modular subtractions and inverses in `((val % M) + M) % M`.',
    },
    {
      type: 'WA',
      title: '64-Bit Overflow When Computing t * m1 in CRT Merging',
      detail:
        'Even when `m1` and `m2` fit in signed 64-bit `long long` (`10^9` each, `LCM ~ 10^18`), multiplying `(diff / g * x) % (m2 / g)` or `t * m1` before taking modulo overflows `64-bit`! Use `__int128` in C++, `i128` in Rust, or `BigInteger` in Java.',
    },
    {
      type: 'WA',
      title: 'Applying Fermat a^(M-2) mod M When M Is Composite',
      detail:
        'If `M = 1000000000` (`10^9`, composite!) or `M = 1`, `modPow(a, M - 2, M)` gives garbage! Always ask whether `M` is guaranteed prime; if not, use `extgcd(a, M)` and check `g == 1`.',
    },
    {
      type: 'WA',
      title: 'Multiplying Exponents Modulo M Instead of Modulo M - 1 (Euler Totient)',
      detail:
        'When computing `a^(b^c) mod P` (tower exponentiation for prime `P`), by Fermat’s Little Theorem you MUST reduce `b^c` modulo `P - 1` (not `P`!) and watch out for the edge case `a % P == 0`!',
    },
  ],
  implementations: {
    cpp20: `#include <bits/stdc++.h>
using namespace std;

// Complete Modular Arithmetic, Extended GCD & Generalized CRT Toolkit
long long mod_pow(long long base, long long exp, long long mod) {
    long long res = 1 % mod;
    base %= mod;
    if (base < 0) base += mod;
    while (exp > 0) {
        if (exp & 1) res = (long long)((__int128)res * base % mod);
        base = (long long)((__int128)base * base % mod);
        exp >>= 1;
    }
    return res;
}

long long extgcd(long long a, long long b, long long& x, long long& y) {
    if (b == 0) {
        x = 1;
        y = 0;
        return a;
    }
    long long x1 = 0, y1 = 0;
    long long g = extgcd(b, a % b, x1, y1);
    x = y1;
    y = x1 - (a / b) * y1;
    return g;
}

// Returns inverse of a mod m, or -1 if gcd(a, m) != 1
long long mod_inv(long long a, long long m) {
    long long x = 0, y = 0;
    long long g = extgcd((a % m + m) % m, m, x, y);
    if (g != 1) return -1;
    return (x % m + m) % m;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    // Reads triples (a, e, m) and prints (a^e mod m) and (a^-1 mod m)
    int q;
    if (!(cin >> q)) return 0;
    while (q--) {
        long long a, e, m;
        cin >> a >> e >> m;
        cout << mod_pow(a, e, m) << " " << mod_inv(a, m) << "\\n";
    }
    return 0;
}`,
    rust: `use std::io::{self, Read};

fn mod_pow(mut base: i64, mut exp: i64, m: i64) -> i64 {
    let mut res = 1i128 % m as i128;
    let mut b = ((base as i128 % m as i128) + m as i128) % m as i128;
    let m128 = m as i128;
    while exp > 0 {
        if (exp & 1) == 1 {
            res = (res * b) % m128;
        }
        b = (b * b) % m128;
        exp >>= 1;
    }
    res as i64
}

fn extgcd(a: i64, b: i64) -> (i64, i64, i64) {
    if b == 0 {
        return (a, 1, 0);
    }
    let (g, x1, y1) = extgcd(b, a % b);
    (g, y1, x1 - (a / b) * y1)
}

fn mod_inv(a: i64, m: i64) -> i64 {
    let a_norm = ((a % m) + m) % m;
    let (g, x, _) = extgcd(a_norm, m);
    if g != 1 {
        return -1;
    }
    ((x % m) + m) % m
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
        let a: i64 = it.next().unwrap().parse().unwrap();
        let e: i64 = it.next().unwrap().parse().unwrap();
        let m: i64 = it.next().unwrap().parse().unwrap();
        out.push_str(&format!("{} {}\\n", mod_pow(a, e, m), mod_inv(a, m)));
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
            long sign = 1;
            if (c == '-') { sign = -1; c = readByte(); }
            long res = 0;
            while (c > ' ') { res = res * 10 + (c - '0'); c = readByte(); }
            return res * sign;
        }
    }

    static long[] extgcd(long a, long b) {
        if (b == 0) return new long[]{a, 1, 0};
        long[] sub = extgcd(b, a % b);
        return new long[]{sub[0], sub[2], sub[1] - (a / b) * sub[2]};
    }

    static long modPow(long base, long exp, long mod) {
        BigInteger b = BigInteger.valueOf(base).mod(BigInteger.valueOf(mod));
        return b.modPow(BigInteger.valueOf(exp), BigInteger.valueOf(mod)).longValue();
    }

    static long modInv(long a, long m) {
        long norm = ((a % m) + m) % m;
        long[] gxy = extgcd(norm, m);
        if (gxy[0] != 1) return -1;
        return ((gxy[1] % m) + m) % m;
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        long qIn = fs.nextLong();
        if (qIn == Long.MIN_VALUE) return;
        int q = (int) qIn;
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < q; i++) {
            long a = fs.nextLong(), e = fs.nextLong(), m = fs.nextLong();
            sb.append(modPow(a, e, m)).append(' ').append(modInv(a, m)).append('\\n');
        }
        System.out.print(sb);
    }
}`,
    python3: `import sys

sys.setrecursionlimit(200000)

def extgcd(a: int, b: int):
    if b == 0:
        return a, 1, 0
    g, x1, y1 = extgcd(b, a % b)
    return g, y1, x1 - (a // b) * y1

def mod_inv(a: int, m: int) -> int:
    g, x, _ = extgcd(a % m, m)
    return -1 if g != 1 else x % m

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    q = int(next(it))
    out = []
    for _ in range(q):
        a = int(next(it))
        e = int(next(it))
        m = int(next(it))
        out.append(f"{pow(a, e, m)} {mod_inv(a, m)}")
    sys.stdout.write("\\n".join(out) + "\\n")

if __name__ == "__main__":
    solve()`,
    ruby: `def mod_pow(base, exp, mod)
  res = 1 % mod
  b = base % mod
  while exp > 0
    res = (res * b) % mod if (exp & 1) == 1
    b = (b * b) % mod
    exp >>= 1
  end
  res
end

def extgcd(a, b)
  return [a, 1, 0] if b == 0
  g, x1, y1 = extgcd(b, a % b)
  [g, y1, x1 - (a / b) * y1]
end

def mod_inv(a, m)
  g, x, _ = extgcd(a % m, m)
  g == 1 ? (x % m) : -1
end

tokens = $stdin.read.split
exit if tokens.empty?
q = tokens[0].to_i
idx = 1
out = []
q.times do
  a = tokens[idx].to_i
  e = tokens[idx + 1].to_i
  m = tokens[idx + 2].to_i
  idx += 3
  out << "#{mod_pow(a, e, m)} #{mod_inv(a, m)}"
end
puts out.join("\\n")`,
  },
  practiceProblems: [
    {
      id: 'ch31-p1',
      tier: 'Warmup',
      ratingRange: '1200–1400',
      title: 'Linear Diophantine Equation ax + by = c (Minimum Non-Negative x)',
      statement:
        'Given positive integers a, b, and integer c, determine whether integers (x, y) exist satisfying a*x + b*y = c. If yes, find the solution with the smallest non-negative integer x >= 0 and print "x y"; otherwise print "NO".',
      constraints: '1 <= a, b <= 10^9, -10^18 <= c <= 10^18',
      sampleInput: '12 18 42',
      sampleOutput: '2 1',
      hints: [
        'Run `extgcd(a, b)` to get `g = gcd(a, b)` and `(x0, y0)` satisfying `a*x0 + b*y0 = g`. If `c % g != 0`, output `"NO"`.',
        'Otherwise set `stepX = b / g`. Compute `x = ((x0 % stepX) * ((c / g) % stepX) % stepX + stepX) % stepX` so `x` is the smallest non-negative integer (`0 <= x < b / g`) without overflowing 64 bits, then recover `y = (c - a * x) / b`.',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

long long extgcd(long long a, long long b, long long& x, long long& y) {
    if (b == 0) { x = 1; y = 0; return a; }
    long long x1, y1;
    long long g = extgcd(b, a % b, x1, y1);
    x = y1;
    y = x1 - (a / b) * y1;
    return g;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    long long a, b, c;
    if (!(cin >> a >> b >> c)) return 0;

    long long x0 = 0, y0 = 0;
    long long g = extgcd(a, b, x0, y0);
    if (c % g != 0) {
        cout << "NO\\n";
        return 0;
    }

    long long stepX = b / g;
    __int128 k = c / g;
    __int128 x = ((__int128)x0 * (k % stepX)) % stepX;
    if (x < 0) x += stepX;
    __int128 y = (c - (__int128)a * x) / b;

    cout << (long long)x << " " << (long long)y << "\\n";
    return 0;
}`,
        rust: `use std::io::{self, Read};

fn extgcd(a: i128, b: i128) -> (i128, i128, i128) {
    if b == 0 {
        return (a, 1, 0);
    }
    let (g, x1, y1) = extgcd(b, a % b);
    (g, y1, x1 - (a / b) * y1)
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let a: i128 = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };
    let b: i128 = it.next().unwrap().parse().unwrap();
    let c: i128 = it.next().unwrap().parse().unwrap();

    let (g, x0, _) = extgcd(a, b);
    if c % g != 0 {
        println!("NO");
        return;
    }
    let step_x = b / g;
    let x = ((x0 * (c / g)) % step_x + step_x) % step_x;
    let y = (c - a * x) / b;
    println!("{} {}", x, y);
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
            long sign = 1;
            if (c == '-') { sign = -1; c = readByte(); }
            long res = 0;
            while (c > ' ') { res = res * 10 + (c - '0'); c = readByte(); }
            return res * sign;
        }
    }

    static long[] extgcd(long a, long b) {
        if (b == 0) return new long[]{a, 1, 0};
        long[] sub = extgcd(b, a % b);
        return new long[]{sub[0], sub[2], sub[1] - (a / b) * sub[2]};
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        long a = fs.nextLong();
        if (a == Long.MIN_VALUE) return;
        long b = fs.nextLong(), c = fs.nextLong();

        long[] gxy = extgcd(a, b);
        long g = gxy[0];
        if (c % g != 0) {
            System.out.println("NO");
            return;
        }

        BigInteger A = BigInteger.valueOf(a);
        BigInteger B = BigInteger.valueOf(b);
        BigInteger C = BigInteger.valueOf(c);
        BigInteger G = BigInteger.valueOf(g);
        BigInteger stepX = B.divide(G);
        BigInteger x = BigInteger.valueOf(gxy[1]).multiply(C.divide(G)).mod(stepX);
        BigInteger y = C.subtract(A.multiply(x)).divide(B);
        System.out.println(x + " " + y);
    }
}`,
        python3: `import sys

sys.setrecursionlimit(200000)

def extgcd(a: int, b: int):
    if b == 0:
        return a, 1, 0
    g, x1, y1 = extgcd(b, a % b)
    return g, y1, x1 - (a // b) * y1

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    a, b, c = int(data[0]), int(data[1]), int(data[2])
    g, x0, _ = extgcd(a, b)
    if c % g != 0:
        print("NO")
        return
    step_x = b // g
    x = (x0 * (c // g)) % step_x
    y = (c - a * x) // b
    print(f"{x} {y}")

if __name__ == "__main__":
    solve()`,
        ruby: `def extgcd(a, b)
  return [a, 1, 0] if b == 0
  g, x1, y1 = extgcd(b, a % b)
  [g, y1, x1 - (a / b) * y1]
end

tokens = $stdin.read.split
exit if tokens.empty?
a = tokens[0].to_i
b = tokens[1].to_i
c = tokens[2].to_i

g, x0, _ = extgcd(a, b)
if c % g != 0
  puts "NO"
else
  step_x = b / g
  x = (x0 * (c / g)) % step_x
  y = (c - a * x) / b
  puts "#{x} #{y}"
end`,
      },
    },
    {
      id: 'ch31-p2',
      tier: 'Standard',
      ratingRange: '1400–1600',
      title: 'Chinese Remainder Theorem (Coprime Congruence System)',
      statement:
        'Given K congruences x ≡ r_i (mod m_i) where the moduli m_1, m_2, ..., m_K are pairwise coprime, compute the unique smallest non-negative integer x in [0, M - 1], where M = m_1 * m_2 * ... * m_K.',
      constraints: '1 <= K <= 20, 1 <= m_i, 0 <= r_i < m_i, prod(m_i) <= 10^18',
      sampleInput: '3\n2 3\n3 5\n2 7',
      sampleOutput: '23',
      hints: [
        'Compute `M = prod(m_i)`. For each equation `i`, let `M_i = M / m_i` and find `inv_i = (M_i)^-1 mod m_i` via Extended GCD (since `gcd(M_i, m_i) == 1`).',
        'Accumulate `x = (x + r_i * M_i * inv_i) mod M` using `__int128` / `BigInteger` so intermediate products of `10^18 * 10^9` never overflow!',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

long long extgcd(long long a, long long b, long long& x, long long& y) {
    if (b == 0) { x = 1; y = 0; return a; }
    long long x1, y1;
    long long g = extgcd(b, a % b, x1, y1);
    x = y1;
    y = x1 - (a / b) * y1;
    return g;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int k;
    if (!(cin >> k)) return 0;
    vector<long long> r(k), m(k);
    __int128 M = 1;
    for (int i = 0; i < k; i++) {
        cin >> r[i] >> m[i];
        M *= m[i];
    }

    __int128 ans = 0;
    for (int i = 0; i < k; i++) {
        __int128 Mi = M / m[i];
        long long x = 0, y = 0;
        extgcd((long long)(Mi % m[i]), m[i], x, y);
        long long inv = (x % m[i] + m[i]) % m[i];
        __int128 term = ((__int128)r[i] * Mi) % M;
        term = (term * inv) % M;
        ans = (ans + term) % M;
    }

    cout << (long long)ans << "\\n";
    return 0;
}`,
        rust: `use std::io::{self, Read};

fn extgcd(a: i128, b: i128) -> (i128, i128, i128) {
    if b == 0 {
        return (a, 1, 0);
    }
    let (g, x1, y1) = extgcd(b, a % b);
    (g, y1, x1 - (a / b) * y1)
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let k: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };

    let mut r = Vec::with_capacity(k);
    let mut m = Vec::with_capacity(k);
    let mut prod: i128 = 1;
    for _ in 0..k {
        let ri: i128 = it.next().unwrap().parse().unwrap();
        let mi: i128 = it.next().unwrap().parse().unwrap();
        r.push(ri);
        m.push(mi);
        prod *= mi;
    }

    let mut ans: i128 = 0;
    for i in 0..k {
        let mi = prod / m[i];
        let (_, x, _) = extgcd(mi % m[i], m[i]);
        let inv = ((x % m[i]) + m[i]) % m[i];
        let term = (((r[i] * mi) % prod) * inv) % prod;
        ans = (ans + term) % prod;
    }
    println!("{}", ans);
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

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        long kIn = fs.nextLong();
        if (kIn == Long.MIN_VALUE) return;
        int k = (int) kIn;
        BigInteger[] r = new BigInteger[k];
        BigInteger[] m = new BigInteger[k];
        BigInteger M = BigInteger.ONE;
        for (int i = 0; i < k; i++) {
            r[i] = BigInteger.valueOf(fs.nextLong());
            m[i] = BigInteger.valueOf(fs.nextLong());
            M = M.multiply(m[i]);
        }

        BigInteger ans = BigInteger.ZERO;
        for (int i = 0; i < k; i++) {
            BigInteger Mi = M.divide(m[i]);
            BigInteger inv = Mi.modInverse(m[i]);
            ans = ans.add(r[i].multiply(Mi).multiply(inv)).mod(M);
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
    it = iter(data)
    k = int(next(it))
    eqs = [(int(next(it)), int(next(it))) for _ in range(k)]

    M = 1
    for _, mi in eqs:
        M *= mi

    ans = 0
    for ri, mi in eqs:
        Mi = M // mi
        inv = pow(Mi, -1, mi)
        ans = (ans + ri * Mi * inv) % M
    print(ans)

if __name__ == "__main__":
    solve()`,
        ruby: `def extgcd(a, b)
  return [a, 1, 0] if b == 0
  g, x1, y1 = extgcd(b, a % b)
  [g, y1, x1 - (a / b) * y1]
end

tokens = $stdin.read.split
exit if tokens.empty?
k = tokens[0].to_i
idx = 1
eqs = []
total_m = 1
k.times do
  r = tokens[idx].to_i
  m = tokens[idx + 1].to_i
  idx += 2
  eqs << [r, m]
  total_m *= m
end

ans = 0
eqs.each do |r, m|
  mi = total_m / m
  _, x, _ = extgcd(mi % m, m)
  inv = x % m
  ans = (ans + r * mi * inv) % total_m
end
puts ans`,
      },
    },
    {
      id: 'ch31-p3',
      tier: 'Boss',
      ratingRange: '1700–1950',
      title: 'Generalized CRT for Combined Non-Coprime Modular Systems',
      statement:
        'Given K congruences x ≡ r_i (mod m_i) where the moduli m_i are NOT necessarily pairwise coprime, find the unique solution (R, M) with 0 <= R < M = lcm(m_1, ..., m_K) satisfying all equations, or output -1 if inconsistent.',
      constraints: '1 <= K <= 10^5, 1 <= m_i <= 10^9, lcm(m_i) <= 10^18',
      sampleInput: '3\n2 6\n5 9\n8 12',
      sampleOutput: '32 36',
      hints: [
        'Merge congruences sequentially starting with `(R, M) = (0, 1)`. To merge `(R, M)` with `(r2, m2)`, we need integer `k` such that `R + k*M ≡ r2 (mod m2)`, i.e., `M*k + m2*y = r2 - R`.',
        'Run `extgcd(M, m2)` to get `g = gcd(M, m2)`. If `(r2 - R) % g != 0`, return `-1`! Otherwise `m2_reduced = m2 / g`, `k = (((r2 - R) / g) * x) % m2_reduced`, new `M_new = M * m2_reduced`, and `R_new = ((R + k * M) % M_new + M_new) % M_new`.',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

long long extgcd(long long a, long long b, long long& x, long long& y) {
    if (b == 0) { x = 1; y = 0; return a; }
    long long x1, y1;
    long long g = extgcd(b, a % b, x1, y1);
    x = y1;
    y = x1 - (a / b) * y1;
    return g;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int k;
    if (!(cin >> k)) return 0;

    long long R = 0, M = 1;
    bool ok = true;

    for (int i = 0; i < k; i++) {
        long long r2, m2;
        cin >> r2 >> m2;
        if (!ok) continue;

        r2 = (r2 % m2 + m2) % m2;
        long long x = 0, y = 0;
        long long g = extgcd(M, m2, x, y);
        long long diff = r2 - R;
        if (diff % g != 0) {
            ok = false;
            continue;
        }

        long long mod_k = m2 / g;
        __int128 step = ((__int128)(diff / g) * x) % mod_k;
        if (step < 0) step += mod_k;

        __int128 newM = (__int128)M * mod_k;
        __int128 newR = (R + step * M) % newM;
        if (newR < 0) newR += newM;

        R = (long long)newR;
        M = (long long)newM;
    }

    if (!ok) cout << -1 << "\\n";
    else cout << R << " " << M << "\\n";
    return 0;
}`,
        rust: `use std::io::{self, Read};

fn extgcd(a: i128, b: i128) -> (i128, i128, i128) {
    if b == 0 {
        return (a, 1, 0);
    }
    let (g, x1, y1) = extgcd(b, a % b);
    (g, y1, x1 - (a / b) * y1)
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let k: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };

    let mut r1: i128 = 0;
    let mut m1: i128 = 1;
    let mut ok = true;

    for _ in 0..k {
        let r2_raw: i128 = it.next().unwrap().parse().unwrap();
        let m2: i128 = it.next().unwrap().parse().unwrap();
        if !ok {
            continue;
        }
        let r2 = ((r2_raw % m2) + m2) % m2;
        let (g, x, _) = extgcd(m1, m2);
        let diff = r2 - r1;
        if diff % g != 0 {
            ok = false;
            continue;
        }
        let mod_k = m2 / g;
        let step = (((diff / g) * x) % mod_k + mod_k) % mod_k;
        let new_m = m1 * mod_k;
        let new_r = (((r1 + step * m1) % new_m) + new_m) % new_m;
        r1 = new_r;
        m1 = new_m;
    }

    if !ok {
        println!("-1");
    } else {
        println!("{} {}", r1, m1);
    }
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
            long sign = 1;
            if (c == '-') { sign = -1; c = readByte(); }
            long res = 0;
            while (c > ' ') { res = res * 10 + (c - '0'); c = readByte(); }
            return res * sign;
        }
    }

    static BigInteger[] extgcd(BigInteger a, BigInteger b) {
        if (b.equals(BigInteger.ZERO)) {
            return new BigInteger[]{a, BigInteger.ONE, BigInteger.ZERO};
        }
        BigInteger[] sub = extgcd(b, a.mod(b));
        BigInteger q = a.divide(b);
        return new BigInteger[]{sub[0], sub[2], sub[1].subtract(q.multiply(sub[2]))};
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        long kIn = fs.nextLong();
        if (kIn == Long.MIN_VALUE) return;
        int k = (int) kIn;

        BigInteger R = BigInteger.ZERO;
        BigInteger M = BigInteger.ONE;
        boolean ok = true;

        for (int i = 0; i < k; i++) {
            BigInteger r2 = BigInteger.valueOf(fs.nextLong());
            BigInteger m2 = BigInteger.valueOf(fs.nextLong());
            if (!ok) continue;
            r2 = r2.mod(m2);
            BigInteger[] gxy = extgcd(M, m2);
            BigInteger g = gxy[0];
            BigInteger diff = r2.subtract(R);
            if (!diff.mod(g).equals(BigInteger.ZERO)) {
                ok = false;
                continue;
            }
            BigInteger modK = m2.divide(g);
            BigInteger step = diff.divide(g).multiply(gxy[1]).mod(modK);
            BigInteger newM = M.multiply(modK);
            R = R.add(step.multiply(M)).mod(newM);
            M = newM;
        }

        if (!ok) System.out.println(-1);
        else System.out.println(R + " " + M);
    }
}`,
        python3: `import sys

sys.setrecursionlimit(200000)

def extgcd(a: int, b: int):
    if b == 0:
        return a, 1, 0
    g, x1, y1 = extgcd(b, a % b)
    return g, y1, x1 - (a // b) * y1

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    k = int(next(it))
    R, M = 0, 1
    ok = True

    for _ in range(k):
        r2 = int(next(it))
        m2 = int(next(it))
        if not ok:
            continue
        r2 %= m2
        g, x, _ = extgcd(M, m2)
        diff = r2 - R
        if diff % g != 0:
            ok = False
            continue
        mod_k = m2 // g
        step = ((diff // g) * x) % mod_k
        new_m = M * mod_k
        R = (R + step * M) % new_m
        M = new_m

    if not ok:
        print(-1)
    else:
        print(f"{R} {M}")

if __name__ == "__main__":
    solve()`,
        ruby: `def extgcd(a, b)
  return [a, 1, 0] if b == 0
  g, x1, y1 = extgcd(b, a % b)
  [g, y1, x1 - (a / b) * y1]
end

tokens = $stdin.read.split
exit if tokens.empty?
k = tokens[0].to_i
idx = 1
r1 = 0
m1 = 1
ok = true

k.times do
  r2 = tokens[idx].to_i
  m2 = tokens[idx + 1].to_i
  idx += 2
  next unless ok

  r2 %= m2
  g, x, _ = extgcd(m1, m2)
  diff = r2 - r1
  if diff % g != 0
    ok = false
    next
  end
  mod_k = m2 / g
  step = ((diff / g) * x) % mod_k
  new_m = m1 * mod_k
  r1 = (r1 + step * m1) % new_m
  m1 = new_m
end

puts(ok ? "#{r1} #{m1}" : "-1")`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'CSES',
      title: 'Exponentiation II (Tower Mod Power)',
      difficulty: 'Medium / Math',
      url: 'https://cses.fi/problemset/task/1712',
      patternNote: 'Compute `a^(b^c) mod (10^9+7)` reducing `b^c` modulo `P - 1` by Fermat’s Little Theorem.',
    },
    {
      platform: 'AtCoder',
      title: 'ABC193 E - Oversleeping (Generalized CRT)',
      difficulty: '1400–1600',
      url: 'https://atcoder.jp/contests/abc193/tasks/abc193_e',
      patternNote: 'Find minimum meeting timestamp across two periodic intervals by iterating small residue offsets + CRT.',
    },
    {
      platform: 'Codeforces',
      title: 'Remainders Game (CF 687B)',
      difficulty: '1800',
      url: 'https://codeforces.com/problemset/problem/687/B',
      patternNote: 'Verify whether `K` divides `lcm(c_1, ..., c_N)` using CRT prime-power divisibility.',
    },
    {
      platform: 'CodeChef',
      title: 'Chef and Modular Congruence / CRT',
      difficulty: 'Medium',
      url: 'https://www.codechef.com/problems/CHEFMOD',
      patternNote: 'Merge non-coprime congruence systems via Extended GCD and 128-bit modular multiplication.',
    },
    {
      platform: 'HackerRank',
      title: 'Closest Number & Extended GCD',
      difficulty: 'Medium',
      url: 'https://www.hackerrank.com/challenges/closest-number/problem',
      patternNote: 'Practice modular exponentiation, composite modular inverses, and Bezout coefficient shifts.',
    },
    {
      platform: 'NeetCode 150',
      title: 'Pow(x, n) & Super Pow',
      difficulty: 'Medium (LeetCode 50 / 372)',
      url: 'https://leetcode.com/problems/super-pow/',
      patternNote: 'Binary exponentiation paired with Euler Totient / CRT decomposition over `1337 = 7 * 191`.',
    },
  ],
  interviewNotes: [
    'Binary exponentiation (`O(log N)`) and Extended GCD (`O(log M)`) come up constantly in cryptography, hashing, and modular combinatorics interviews.',
    'Always know how to prove `O(log M)` division without Fermat: Extended GCD works for ANY modulus `M` with `gcd(a, M) == 1`, whereas `a^(M-2) mod M` strictly requires `M` to be prime.',
    'Generalized CRT shows up in distributed cron-job collision detection ("when do two periodic schedules overlap?").',
  ],
  projectBlueprint: {
    title: 'Distributed Cryptographic Key Verification Service',
    tagline: 'Verify RSA-style modular signatures and threshold secret-sharing congruences using Extended GCD and Generalized CRT reconstruction.',
    stackSummary: 'C++20 / 128-bit Modular Kernel, Bezout Key Inverter, CRT Threshold Secret Reconstructor',
    asciiDiagram: `
+-----------------------------+      +----------------------------------+
| Key Shards (r_i mod m_i)    | ---> | Generalized CRT Merger (ExtGCD)  |
| From K Quorum Nodes         |      | Reconstructs Master Secret S     |
+-----------------------------+      +----------------------------------+
                                                      |
          +-------------------------------------------+
          v
+-----------------------------------+     +----------------------------+
| RSA Public/Private Key Inversion  | --> | Verified Signature Token   |
| d = e^-1 mod phi(N) via ExtGCD    |     | S^e mod N == Hash(Payload) |
+-----------------------------------+     +----------------------------+`,
    milestones: [
      {
        id: 'm1',
        title: '1. Overflow-Safe 128-bit Modular Exponentiation Engine',
        detail: 'Implement `__int128` `modMul` and `modPow` supporting arbitrary 64-bit moduli without precision loss.',
      },
      {
        id: 'm2',
        title: '2. Composite-Safe Bezout Key Inverter',
        detail: 'Compute RSA private exponent `d = e^-1 mod phi(N)` via `extgcd(e, phi(N))`, normalizing negative Bezout outputs.',
      },
      {
        id: 'm3',
        title: '3. CRT Threshold Shard Reconstructor',
        detail: 'Assemble master token `S` from quorum shards `S ≡ r_i (mod m_i)` and detect tampered/inconsistent shards when `diff % gcd != 0`.',
      },
    ],
    starterCode: `// Distributed Cryptographic Key Verification Service (Runnable C++20 Prototype)
#include <bits/stdc++.h>
using namespace std;

long long extgcd(long long a, long long b, long long& x, long long& y) {
    if (b == 0) { x = 1; y = 0; return a; }
    long long x1, y1;
    long long g = extgcd(b, a % b, x1, y1);
    x = y1;
    y = x1 - (a / b) * y1;
    return g;
}

long long mod_pow(long long base, long long exp, long long mod) {
    long long res = 1;
    base %= mod;
    while (exp > 0) {
        if (exp & 1) res = (long long)((__int128)res * base % mod);
        base = (long long)((__int128)base * base % mod);
        exp >>= 1;
    }
    return res;
}

int main() {
    // 1. Toy RSA key generation via Extended GCD
    long long p = 10007, q = 10009, N = p * q, phi = (p - 1) * (q - 1);
    long long e = 65537, d, y;
    extgcd(e, phi, d, y);
    d = (d % phi + phi) % phi;

    long long digest = 42424242;
    long long sig = mod_pow(digest, d, N);
    long long verified = mod_pow(sig, e, N);
    cout << "Private Key d = " << d << " | Signature Verified = " << (verified == digest ? "YES" : "NO") << "\\n";

    // 2. CRT Secret Shard Reconstruction
    vector<pair<long long, long long>> shards = {{2, 6}, {5, 9}, {8, 12}};
    long long R = 0, M = 1;
    for (auto [r2, m2] : shards) {
        long long x0, y0;
        long long g = extgcd(M, m2, x0, y0);
        long long modK = m2 / g;
        long long step = (((r2 - R) / g * x0) % modK + modK) % modK;
        long long newM = M * modK;
        R = (R + step * M) % newM;
        M = newM;
    }
    cout << "Reconstructed Threshold Secret: " << R << " (mod " << M << ")\\n";
    return 0;
}`,
  },
};
