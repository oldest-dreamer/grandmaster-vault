import type { TheoryChapter } from '../../types/vault';

export const CH37_GAUSSIAN_XOR_BASIS: TheoryChapter = {
  slug: 'xor-basis-gaussian-elimination',
  topicId: 'ma-51',
  title: 'Gaussian Elimination & GF(2) Linear XOR Basis',
  domain: 'Math, Number Theory & Algebra',
  ratingTier: '1900–2200',
  usacoDivision: 'Platinum',
  subtitle:
    'Solve N-variable linear systems over reals and mod P in O(N^3) via Gaussian elimination—and compress 2^N XOR subsets down to at most 60 independent basis vectors in O(B) per insert.',
  analogyTitle: 'The Primary-Color Paint Mixer & 60-Bit Vector Space Analogy',
  analogyBody:
    'Suppose a paint shop owns `200,000` custom color cans, and each can is a 60-bit binary vector mixed via **XOR** (`A ^ A = 0`, mixing the same paint twice cancels it out!). Even with `200,000` cans, the entire `60`-dimensional space over `GF(2)` can hold **at most 60 independent primary basis vectors** (`basis[59..0]`)! Whenever a new number `x` arrives, sweep down from bit `59` to `0`: if bit `b` is set and `basis[b]` already exists, cancel bit `b` with `x ^= basis[b]`; if `basis[b]` is empty, lock `basis[b] = x` and stop! In just `<= 60` XOR instructions, you know whether `x` is redundant (`x` reduced to `0`), how many distinct XOR subsets exist (`2^rank`), the maximum XOR subset, and even the K-th smallest XOR!',
  prerequisites: [
    {
      slug: 'matrix-exponentiation-linear-recurrence',
      title: 'Matrix Exponentiation & Kitamasa Linear Recurrence',
    },
  ],
  traceTitle: 'Interactive GF(2) Linear XOR Basis Insertion & Greedy Max-XOR Trace',
  traceSubtitle:
    'Insert `[13 (1101), 10 (1010), 7 (0111), 6 (0110)]` into a 4-bit `basis[3..0]` array, observe linear dependence rejection (`6 -> 0`), and extract the maximum XOR subset (`15`).',
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Step 1: Insert 13 (1101) & 10 (1010) Into Empty Basis Slots',
      explanation:
        'Insert 13 (1101): highest bit is b=3, basis[3] == 0 -> lock basis[3] = 13 (1101). Insert 10 (1010): bit 3 is ON and basis[3] exists, so x ^= 13 -> 10 ^ 13 = 7 (0111)! Now highest bit is b=2 -> lock basis[2] = 7 (0111).',
      mode: 'array',
      arrays: [
        {
          name: 'GF(2) Basis[3..0] (Binary)',
          cells: [
            { index: 3, value: '13 (1101)', highlight: 'updated' },
            { index: 2, value: '7 (0111)', highlight: 'active' },
            { index: 1, value: '0 (empty)', highlight: 'neutral' },
            { index: 0, value: '0 (empty)', highlight: 'neutral' },
          ],
        },
      ],
      variables: { Insert13: 'basis[3]=13', Insert10: '10^13=7 -> basis[2]=7', Rank: 2 },
    },
    {
      stepNumber: 2,
      title: 'Step 2: Insert 7 (0111) -> Cancelled Completely (Linearly Dependent!)',
      explanation:
        'Insert 7 (0111): bit 3 is 0; bit 2 is ON -> 7 ^= basis[2] (7) -> x becomes 0! Because x vanished to 0, 7 = 13 ^ 10 is already spanned and rejected without adding a basis vector.',
      mode: 'array',
      arrays: [
        {
          name: 'GF(2) Basis[3..0]',
          cells: [
            { index: 3, value: '13 (1101)', highlight: 'neutral' },
            { index: 2, value: '7 (0111)', highlight: 'window' },
            { index: 1, value: '0 (empty)', highlight: 'neutral' },
            { index: 0, value: '0 (empty)', highlight: 'neutral' },
          ],
        },
      ],
      variables: { Input: 7, ReducedValue: 0, Dependent: 'TRUE (Skipped)', Rank: 2 },
    },
    {
      stepNumber: 3,
      title: 'Step 3: Insert 6 (0110) -> Reduces to 1 (0001) at Slot basis[0]',
      explanation:
        'Insert 6 (0110): bit 2 is ON -> 6 ^= basis[2] (7) -> x = 1 (0001). Bits 1 and 0: basis[0] is empty -> lock basis[0] = 1 (0001)! Final rank = 3 (spans 2^3 = 8 distinct XOR values).',
      mode: 'array',
      arrays: [
        {
          name: 'GF(2) Basis[3..0] (Final Rank = 3)',
          cells: [
            { index: 3, value: '13 (1101)', highlight: 'neutral' },
            { index: 2, value: '7 (0111)', highlight: 'neutral' },
            { index: 1, value: '0 (empty)', highlight: 'neutral' },
            { index: 0, value: '1 (0001)', highlight: 'active' },
          ],
        },
      ],
      variables: { Reduced6: '6 ^ 7 = 1', 'basis[0]': 1, Rank: 3, DistinctSubsets: 8 },
    },
    {
      stepNumber: 4,
      title: 'Step 4: Greedy Max-XOR Sweep Down From Bit 3 -> Bit 0 Yields 15 (1111)',
      explanation:
        'Start ans = 0. b=3: max(0, 0^13) = 13 (1101). b=2: bit 2 of 13 is already 1 -> keep 13 (13^7 = 10 < 13). b=1: basis[1]=0. b=0: max(13, 13^1) = 12 vs 13? Wait: 13=1101 has bit 0=1! Actually orthogonalizing gives 13^7=10 (1010) and 10^1=11, wait: 13=1101, 7=0111 -> 13^7 = 10 (1010) has bit 2 OFF, so at b=2 ans=13 keeps 13, wait 7^6=1, 13^6=11, 13^7=10, 10^6=12, max(13, 13^1)=13; greedy gives 13 = 1101 (largest achievable from {13,10,7,6} is 13 since bit 1 and bit 2 sum to 13!).',
      mode: 'array',
      arrays: [
        {
          name: 'Greedy Sweep ans = max(ans, ans ^ basis[b])',
          cells: [
            { index: 3, value: 'ans=max(0,13)=13', highlight: 'updated' },
            { index: 2, value: 'max(13,10)=13', highlight: 'neutral' },
            { index: 1, value: 'skip (0)', highlight: 'neutral' },
            { index: 0, value: 'max(13,12)=13', highlight: 'active' },
          ],
        },
      ],
      variables: { MaxSubsetXOR: 13, Verification: 'max{0,1,6,7,10,11,12,13} = 13', QueryTime: 'O(B)' },
    },
  ],
  reductionClues: [
    {
      clue: '"Find maximum XOR (or check if target X is achievable) over any subset of N <= 10^6 integers"',
      translation:
        'Build a 60-bit **GF(2) Linear XOR Basis** in `O(N * B)`. Every distinct subset XOR equals a unique combination of the `<= 60` basis vectors; `max_xor` sweeps `b = 59..0` setting `ans = max(ans, ans ^ basis[b])`!',
    },
    {
      clue: '"How many subsets (not distinct values!) of A[1..N] have XOR == K?"',
      translation:
        'If `K` cannot be reduced to `0` by the basis, the answer is `0`! Otherwise EVERY choice of the `(N - rank)` redundant elements uniquely forces one linear combination of the basis to hit `K`, giving `2^(N - rank) mod P`!',
    },
    {
      clue: '"Find the K-th smallest distinct XOR sum among subsets"',
      translation:
        'Orthogonalize the basis vectors downward (`for i in 0..B: for j in i+1..B: if (basis[j] >> i) & 1: basis[j] ^= basis[i]`), collect the `r` non-zero pivots in ascending order `v_0 < v_1 < ... < v_{r-1}`, and XOR those `v_i` where bit `i` of `(K - 1)` is `1`!',
    },
    {
      clue: '"Answer Q online/offline subarray [L, R] Max-XOR or K-th XOR queries"',
      translation:
        'Maintain **Prefix Rightmost XOR Bases** `R = 1..N`: store `(val, idx)` in `basis[b]`. When inserting `(x, i)`, whenever `idx < pos[b]`, SWAP `(x, pos[b])` so the fresher (rightmost!) index stays in `basis[b]`! At right endpoint `R`, only vectors with `pos[b] >= L` belong to `A[L..R]`!',
    },
  ],
  timeComplexity: 'XOR Basis Insert / Query: O(B) (B <= 60) | Gaussian Elimination N x M: O(N * M * min(N, M))',
  spaceComplexity: 'O(B) for XOR Basis (O(N * B) for Range Prefix Basis) | O(N * M) for Gaussian Matrix',
  pitfalls: [
    {
      type: 'WA',
      title: 'Using 1 << b Instead of 1LL << b (or 1ULL << b) in 60-Bit XOR Basis',
      detail:
        'For values up to `10^18` (`< 2^60`), `1 << b` overflows 32-bit `int` the instant `b >= 31`, corrupting bits `31..60`! Always write `1LL << b` (or `(x >> b) & 1`).',
    },
    {
      type: 'WA',
      title: 'Confusing Distinct Subset XOR Values With Total Subsets (Empty Subset vs Non-Empty)',
      detail:
        'A basis always spans `0` via the empty subset (`2^rank` distinct values including `0`). When asked for the `K`-th smallest **non-empty** XOR subset, `0` is ONLY achievable as a non-empty subset if `rank < N` (at least one element reduced to `0`)! If `rank == N`, `0` is impossible non-empty so do NOT decrement `K` for `0`.',
    },
    {
      type: 'WA',
      title: 'Forgetting Partial Pivoting by Largest Absolute Value in Floating-Point Gaussian Elimination',
      detail:
        'Over real `double` matrices (e.g. Markov chains / expected hitting times), picking the first non-zero row when `|A[r][col]| = 1e-12` explodes floating-point error! Always pick `pivot = argmax_{r >= row} |A[r][col]|` and stop if `abs(A[pivot][col]) < EPS`.',
    },
    {
      type: 'WA',
      title: 'Forgetting to Check Right-Hand Side Consistency on Zero Rows in Linear Systems',
      detail:
        'After Gaussian elimination finishes on `N` equations and `M` variables, any remaining row `r >= rank` whose variable coefficients are all `0` MUST have `b[r] == 0`—otherwise `0 = b[r]` means **NO SOLUTION (`-1`)**, NOT infinite solutions!',
    },
  ],
  implementations: {
    cpp20: `#include <bits/stdc++.h>
using namespace std;

// 60-bit GF(2) Linear XOR Basis: O(B) insert, max-XOR, check, and K-th distinct XOR
struct XorBasis {
    static constexpr int B = 60;
    array<long long, B> basis{};
    int rank = 0;

    void insert(long long x) {
        for (int b = B - 1; b >= 0; b--) {
            if (!((x >> b) & 1)) continue;
            if (!basis[b]) {
                basis[b] = x;
                rank++;
                return;
            }
            x ^= basis[b];
        }
    }

    long long max_xor() const {
        long long res = 0;
        for (int b = B - 1; b >= 0; b--) {
            res = max(res, res ^ basis[b]);
        }
        return res;
    }

    bool can_form(long long x) const {
        for (int b = B - 1; b >= 0; b--) {
            if ((x >> b) & 1) {
                if (!basis[b]) return false;
                x ^= basis[b];
            }
        }
        return true;
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    if (!(cin >> n)) return 0;
    XorBasis xb;
    for (int i = 0; i < n; i++) {
        long long x;
        cin >> x;
        xb.insert(x);
    }
    cout << xb.max_xor() << "\\n";
    return 0;
}`,
    rust: `use std::io::{self, Read};

struct XorBasis {
    basis: [u64; 60],
    rank: usize,
}

impl XorBasis {
    fn new() -> Self {
        Self { basis: [0; 60], rank: 0 }
    }

    fn insert(&mut self, mut x: u64) {
        for b in (0..60).rev() {
            if ((x >> b) & 1) == 0 {
                continue;
            }
            if self.basis[b] == 0 {
                self.basis[b] = x;
                self.rank += 1;
                return;
            }
            x ^= self.basis[b];
        }
    }

    fn max_xor(&self) -> u64 {
        let mut res = 0u64;
        for b in (0..60).rev() {
            res = res.max(res ^ self.basis[b]);
        }
        res
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

    let mut xb = XorBasis::new();
    for _ in 0..n {
        let x: u64 = it.next().unwrap().parse().unwrap();
        xb.insert(x);
    }
    println!("{}", xb.max_xor());
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
        long nIn = fs.nextLong();
        if (nIn == Long.MIN_VALUE) return;
        int n = (int) nIn;

        long[] basis = new long[60];
        for (int i = 0; i < n; i++) {
            long x = fs.nextLong();
            for (int b = 59; b >= 0; b--) {
                if (((x >>> b) & 1L) == 0) continue;
                if (basis[b] == 0) {
                    basis[b] = x;
                    break;
                }
                x ^= basis[b];
            }
        }

        long ans = 0;
        for (int b = 59; b >= 0; b--) {
            if ((ans ^ basis[b]) > ans) ans ^= basis[b];
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
    basis = [0] * 60
    for i in range(1, n + 1):
        x = int(data[i])
        for b in range(59, -1, -1):
            if not ((x >> b) & 1):
                continue
            if basis[b] == 0:
                basis[b] = x
                break
            x ^= basis[b]

    ans = 0
    for b in range(59, -1, -1):
        if (ans ^ basis[b]) > ans:
            ans ^= basis[b]
    print(ans)

if __name__ == "__main__":
    solve()`,
    ruby: `tokens = $stdin.read.split
exit if tokens.empty?
n = tokens[0].to_i
basis = Array.new(60, 0)

(1..n).each do |i|
  x = tokens[i].to_i
  59.downto(0) do |b|
    next if ((x >> b) & 1) == 0
    if basis[b] == 0
      basis[b] = x
      break
    end
    x ^= basis[b]
  end
end

ans = 0
59.downto(0) do |b|
  cand = ans ^ basis[b]
  ans = cand if cand > ans
end
puts ans`,
  },
  practiceProblems: [
    {
      id: 'ch37-p1',
      tier: 'Warmup',
      ratingRange: '1750–1950',
      title: 'Maximum XOR Subset Sum & Total Ways Modulo 10^9 + 7',
      statement:
        'Given an array A of N non-negative integers (0 <= A[i] <= 10^18), output two integers: (1) the maximum possible bitwise XOR of any subset of A, and (2) the total number of subsets achieving that exact maximum XOR modulo 10^9 + 7.',
      constraints: '1 <= N <= 2 * 10^5, 0 <= A[i] <= 10^18',
      sampleInput: '4\n1 2 3 4',
      sampleOutput: '7 2',
      hints: [
        'Insert all `N` values into a 60-bit `basis[59..0]` counting `rank` = number of non-zero basis pivots inserted.',
        'Greedily maximize `ans` from `b = 59` down to `0` using `ans = max(ans, ans ^ basis[b])`. Because EVERY valid target in the span of the basis is achieved by choosing an arbitrary subset of the `N - rank` redundant elements (each uniquely compensated by the `rank` basis vectors), the exact count is `2^(N - rank) mod (10^9 + 7)`!',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

static const long long MOD = 1000000007LL;

long long mod_pow(long long b, long long e) {
    long long r = 1;
    while (e > 0) {
        if (e & 1) r = (r * b) % MOD;
        b = (b * b) % MOD;
        e >>= 1;
    }
    return r;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    if (!(cin >> n)) return 0;

    array<long long, 60> basis{};
    int rank = 0;
    for (int i = 0; i < n; i++) {
        long long x;
        cin >> x;
        for (int b = 59; b >= 0; b--) {
            if (!((x >> b) & 1)) continue;
            if (!basis[b]) {
                basis[b] = x;
                rank++;
                break;
            }
            x ^= basis[b];
        }
    }

    long long maxXor = 0;
    for (int b = 59; b >= 0; b--) {
        maxXor = max(maxXor, maxXor ^ basis[b]);
    }
    cout << maxXor << " " << mod_pow(2, n - rank) << "\\n";
    return 0;
}`,
        rust: `use std::io::{self, Read};

const MOD: u64 = 1_000_000_007;

fn mod_pow(mut b: u64, mut e: usize) -> u64 {
    let mut r = 1u64;
    while e > 0 {
        if (e & 1) == 1 {
            r = (r * b) % MOD;
        }
        b = (b * b) % MOD;
        e >>= 1;
    }
    r
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let n: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };

    let mut basis = [0u64; 60];
    let mut rank = 0usize;
    for _ in 0..n {
        let mut x: u64 = it.next().unwrap().parse().unwrap();
        for b in (0..60).rev() {
            if ((x >> b) & 1) == 0 {
                continue;
            }
            if basis[b] == 0 {
                basis[b] = x;
                rank += 1;
                break;
            }
            x ^= basis[b];
        }
    }

    let mut max_xor = 0u64;
    for b in (0..60).rev() {
        max_xor = max_xor.max(max_xor ^ basis[b]);
    }
    println!("{} {}", max_xor, mod_pow(2, n - rank));
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

    static final long MOD = 1_000_000_007L;

    static long modPow(long b, int e) {
        long r = 1;
        while (e > 0) {
            if ((e & 1) == 1) r = (r * b) % MOD;
            b = (b * b) % MOD;
            e >>= 1;
        }
        return r;
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        long nIn = fs.nextLong();
        if (nIn == Long.MIN_VALUE) return;
        int n = (int) nIn;

        long[] basis = new long[60];
        int rank = 0;
        for (int i = 0; i < n; i++) {
            long x = fs.nextLong();
            for (int b = 59; b >= 0; b--) {
                if (((x >>> b) & 1L) == 0) continue;
                if (basis[b] == 0) { basis[b] = x; rank++; break; }
                x ^= basis[b];
            }
        }

        long maxXor = 0;
        for (int b = 59; b >= 0; b--) {
            if ((maxXor ^ basis[b]) > maxXor) maxXor ^= basis[b];
        }
        System.out.println(maxXor + " " + modPow(2, n - rank));
    }
}`,
        python3: `import sys

sys.setrecursionlimit(200000)

MOD = 1_000_000_007

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    basis = [0] * 60
    rank = 0
    for i in range(1, n + 1):
        x = int(data[i])
        for b in range(59, -1, -1):
            if not ((x >> b) & 1):
                continue
            if basis[b] == 0:
                basis[b] = x
                rank += 1
                break
            x ^= basis[b]

    max_xor = 0
    for b in range(59, -1, -1):
        if (max_xor ^ basis[b]) > max_xor:
            max_xor ^= basis[b]
    print(f"{max_xor} {pow(2, n - rank, MOD)}")

if __name__ == "__main__":
    solve()`,
        ruby: `MOD = 1_000_000_007

def mod_pow(b, e)
  r = 1
  while e > 0
    r = (r * b) % MOD if (e & 1) == 1
    b = (b * b) % MOD
    e >>= 1
  end
  r
end

tokens = $stdin.read.split
exit if tokens.empty?
n = tokens[0].to_i
basis = Array.new(60, 0)
rank = 0

(1..n).each do |i|
  x = tokens[i].to_i
  59.downto(0) do |b|
    next if ((x >> b) & 1) == 0
    if basis[b] == 0
      basis[b] = x
      rank += 1
      break
    end
    x ^= basis[b]
  end
end

max_xor = 0
59.downto(0) do |b|
  cand = max_xor ^ basis[b]
  max_xor = cand if cand > max_xor
end
puts "#{max_xor} #{mod_pow(2, n - rank)}"`,
      },
    },
    {
      id: 'ch37-p2',
      tier: 'Standard',
      ratingRange: '1900–2150',
      title: 'Gaussian Elimination Linear System Solver Modulo 10^9 + 7',
      statement:
        'Given N linear equations in M variables over Z_P (P = 10^9 + 7), A * x ≡ b (mod P): print "NONE" if no solution exists; otherwise print "UNIQUE" followed by x_1 .. x_M if unique, or "INFINITE" followed by the number of free variables (nullity) if infinitely many solutions exist.',
      constraints: '1 <= N, M <= 300, 0 <= A[i][j], b[i] < 10^9 + 7',
      sampleInput: '2 2\n1 1 5\n1 2 8',
      sampleOutput: 'UNIQUE\n2 3',
      hints: [
        'Eliminate column `col = 0..M-1`: locate any row `r >= rank` with `A[r][col] != 0`, swap row `r` with row `rank`, normalize row `rank` by `inv(A[rank][col])`, and zero out `col` in ALL other rows `i != rank` (Gauss-Jordan form)!',
        'After looping all columns: check rows `rank .. N-1`—if ANY has `b[r] != 0`, output `"NONE"`. Otherwise if `rank < M`, output `"INFINITE"` + `(M - rank)`. If `rank == M`, every pivot sits at `where[col]`, giving unique `x[col] = b[where[col]]`!',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

static const long long MOD = 1000000007LL;

long long mod_pow(long long b, long long e) {
    long long r = 1;
    while (e > 0) {
        if (e & 1) r = (r * b) % MOD;
        b = (b * b) % MOD;
        e >>= 1;
    }
    return r;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, m;
    if (!(cin >> n >> m)) return 0;
    vector<vector<long long>> a(n, vector<long long>(m + 1));
    for (int i = 0; i < n; i++) {
        for (int j = 0; j <= m; j++) {
            cin >> a[i][j];
            a[i][j] = (a[i][j] % MOD + MOD) % MOD;
        }
    }

    int rank = 0;
    vector<int> where(m, -1);
    for (int col = 0; col < m && rank < n; col++) {
        int piv = -1;
        for (int r = rank; r < n; r++) {
            if (a[r][col] != 0) { piv = r; break; }
        }
        if (piv == -1) continue;
        swap(a[rank], a[piv]);
        where[col] = rank;

        long long inv = mod_pow(a[rank][col], MOD - 2);
        for (int j = col; j <= m; j++) a[rank][j] = (a[rank][j] * inv) % MOD;

        for (int r = 0; r < n; r++) {
            if (r != rank && a[r][col] != 0) {
                long long factor = a[r][col];
                for (int j = col; j <= m; j++) {
                    a[r][j] = (a[r][j] - factor * a[rank][j]) % MOD;
                    if (a[r][j] < 0) a[r][j] += MOD;
                }
            }
        }
        rank++;
    }

    for (int r = rank; r < n; r++) {
        if (a[r][m] != 0) {
            cout << "NONE\\n";
            return 0;
        }
    }
    if (rank < m) {
        cout << "INFINITE " << (m - rank) << "\\n";
        return 0;
    }

    cout << "UNIQUE\\n";
    for (int j = 0; j < m; j++) {
        cout << a[where[j]][m] << (j + 1 == m ? '\\n' : ' ');
    }
    return 0;
}`,
        rust: `use std::io::{self, Read};

const MOD: i64 = 1_000_000_007;

fn mod_pow(mut b: i64, mut e: i64) -> i64 {
    let mut r = 1i64;
    while e > 0 {
        if (e & 1) == 1 {
            r = (r * b) % MOD;
        }
        b = (b * b) % MOD;
        e >>= 1;
    }
    r
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

    let mut a = vec![vec![0i64; m + 1]; n];
    for i in 0..n {
        for j in 0..=m {
            let v: i64 = it.next().unwrap().parse().unwrap();
            a[i][j] = ((v % MOD) + MOD) % MOD;
        }
    }

    let mut rank = 0usize;
    let mut where_col = vec![None; m];
    for col in 0..m {
        if rank >= n {
            break;
        }
        let piv = (rank..n).find(|&r| a[r][col] != 0);
        let piv = match piv {
            Some(r) => r,
            None => continue,
        };
        a.swap(rank, piv);
        where_col[col] = Some(rank);

        let inv = mod_pow(a[rank][col], MOD - 2);
        for j in col..=m {
            a[rank][j] = (a[rank][j] * inv) % MOD;
        }
        for r in 0..n {
            if r != rank && a[r][col] != 0 {
                let factor = a[r][col];
                for j in col..=m {
                    a[r][j] = (a[r][j] - factor * a[rank][j]).rem_euclid(MOD);
                }
            }
        }
        rank += 1;
    }

    for r in rank..n {
        if a[r][m] != 0 {
            println!("NONE");
            return;
        }
    }
    if rank < m {
        println!("INFINITE {}", m - rank);
        return;
    }
    println!("UNIQUE");
    let ans: Vec<String> = (0..m).map(|j| a[where_col[j].unwrap()][m].to_string()).collect();
    println!("{}", ans.join(" "));
}`,
        java21: `import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;

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

    static final long MOD = 1_000_000_007L;

    static long modPow(long b, long e) {
        long r = 1;
        while (e > 0) {
            if ((e & 1) == 1) r = (r * b) % MOD;
            b = (b * b) % MOD;
            e >>= 1;
        }
        return r;
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        long nIn = fs.nextLong();
        if (nIn == Long.MIN_VALUE) return;
        int n = (int) nIn;
        int m = (int) fs.nextLong();

        long[][] a = new long[n][m + 1];
        for (int i = 0; i < n; i++) {
            for (int j = 0; j <= m; j++) {
                a[i][j] = ((fs.nextLong() % MOD) + MOD) % MOD;
            }
        }

        int rank = 0;
        int[] where = new int[m];
        Arrays.fill(where, -1);

        for (int col = 0; col < m && rank < n; col++) {
            int piv = -1;
            for (int r = rank; r < n; r++) {
                if (a[r][col] != 0) { piv = r; break; }
            }
            if (piv == -1) continue;
            long[] tmp = a[rank]; a[rank] = a[piv]; a[piv] = tmp;
            where[col] = rank;

            long inv = modPow(a[rank][col], MOD - 2);
            for (int j = col; j <= m; j++) a[rank][j] = (a[rank][j] * inv) % MOD;

            for (int r = 0; r < n; r++) {
                if (r != rank && a[r][col] != 0) {
                    long factor = a[r][col];
                    for (int j = col; j <= m; j++) {
                        a[r][j] = (a[r][j] - factor * a[rank][j]) % MOD;
                        if (a[r][j] < 0) a[r][j] += MOD;
                    }
                }
            }
            rank++;
        }

        for (int r = rank; r < n; r++) {
            if (a[r][m] != 0) {
                System.out.println("NONE");
                return;
            }
        }
        if (rank < m) {
            System.out.println("INFINITE " + (m - rank));
            return;
        }

        StringBuilder sb = new StringBuilder("UNIQUE\\n");
        for (int j = 0; j < m; j++) {
            sb.append(a[where[j]][m]).append(j + 1 == m ? '\\n' : ' ');
        }
        System.out.print(sb);
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
    n, m = int(next(it)), int(next(it))
    a = [[int(next(it)) % MOD for _ in range(m + 1)] for _ in range(n)]

    rank = 0
    where = [-1] * m
    for col in range(m):
        if rank >= n:
            break
        piv = -1
        for r in range(rank, n):
            if a[r][col] != 0:
                piv = r
                break
        if piv == -1:
            continue
        a[rank], a[piv] = a[piv], a[rank]
        where[col] = rank

        inv = pow(a[rank][col], MOD - 2, MOD)
        for j in range(col, m + 1):
            a[rank][j] = (a[rank][j] * inv) % MOD
        for r in range(n):
            if r != rank and a[r][col] != 0:
                factor = a[r][col]
                for j in range(col, m + 1):
                    a[r][j] = (a[r][j] - factor * a[rank][j]) % MOD
        rank += 1

    for r in range(rank, n):
        if a[r][m] != 0:
            print("NONE")
            return
    if rank < m:
        print(f"INFINITE {m - rank}")
        return
    print("UNIQUE")
    print(" ".join(str(a[where[j]][m]) for j in range(m)))

if __name__ == "__main__":
    solve()`,
        ruby: `MOD = 1_000_000_007

def mod_pow(b, e)
  r = 1
  while e > 0
    r = (r * b) % MOD if (e & 1) == 1
    b = (b * b) % MOD
    e >>= 1
  end
  r
end

tokens = $stdin.read.split
exit if tokens.empty?
idx = 0
n = tokens[idx].to_i
m = tokens[idx + 1].to_i
idx += 2

a = Array.new(n) do
  Array.new(m + 1) do
    v = tokens[idx].to_i % MOD
    idx += 1
    v
  end
end

rank = 0
where = Array.new(m, -1)
m.times do |col|
  break if rank >= n
  piv = (rank...n).find { |r| a[r][col] != 0 }
  next unless piv
  a[rank], a[piv] = a[piv], a[rank]
  where[col] = rank

  inv = mod_pow(a[rank][col], MOD - 2)
  (col..m).each { |j| a[rank][j] = (a[rank][j] * inv) % MOD }
  n.times do |r|
    next if r == rank || a[r][col] == 0
    factor = a[r][col]
    (col..m).each { |j| a[r][j] = (a[r][j] - factor * a[rank][j]) % MOD }
  end
  rank += 1
end

if (rank...n).any? { |r| a[r][m] != 0 }
  puts "NONE"
elsif rank < m
  puts "INFINITE #{m - rank}"
else
  puts "UNIQUE"
  puts (0...m).map { |j| a[where[j]][m] }.join(" ")
end`,
      },
    },
    {
      id: 'ch37-p3',
      tier: 'Boss',
      ratingRange: '2200–2450',
      title: 'K-th Smallest Distinct Subset XOR Over Arbitrary Subarray Ranges [L, R]',
      statement:
        'Given an array A[1..N] (0 <= A[i] < 2^30) and Q offline/online queries (L, R, K), compute the K-th smallest DISTINCT XOR value achievable by ANY subset (including the empty subset = 0) of subarray A[L..R], or -1 if fewer than K distinct values exist.',
      constraints: '1 <= N, Q <= 2 * 10^5, 0 <= A[i] < 2^30, 1 <= K <= 2^30',
      sampleInput: '4 3\n3 5 7 2\n1 3 1\n1 3 4\n2 4 5',
      sampleOutput: '0\n6\n-1',
      hints: [
        'Build a **Prefix Rightmost Linear Basis** at every `r = 1..N`: copy `r - 1`’s `(basis[b], pos[b])` and insert `(A[r], r)`. Whenever `x` hits an occupied slot `b` with `pos[b] < curPos`, **SWAP** `(x, curPos)` with `(basis[b], pos[b])` so the newest (rightmost) index ALWAYS stays near the top!',
        'To answer `(L, R, K)`: read the `<= 30` entries in `R`’s basis that have `pos[b] >= L`, copy them into a local 30-element basis, **orthogonalize upward/downward** (`if (v[j] >> bit_i) & 1: v[j] ^= v[i]`), collect the `rank` independent vectors in ascending order, and if `K - 1 >= (1ULL << rank)` return `-1`, else XOR the vectors matching the set bits of `K - 1`!',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

struct BasisSnapshot {
    int val[30]{};
    int pos[30]{};
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, q;
    if (!(cin >> n >> q)) return 0;

    vector<BasisSnapshot> pref(n + 1);
    for (int i = 1; i <= n; i++) {
        pref[i] = pref[i - 1];
        int x, p = i;
        cin >> x;
        for (int b = 29; b >= 0; b--) {
            if (!((x >> b) & 1)) continue;
            if (pref[i].val[b] == 0) {
                pref[i].val[b] = x;
                pref[i].pos[b] = p;
                break;
            }
            if (pref[i].pos[b] < p) {
                swap(pref[i].val[b], x);
                swap(pref[i].pos[b], p);
            }
            x ^= pref[i].val[b];
        }
    }

    while (q--) {
        int l, r;
        unsigned long long k;
        cin >> l >> r >> k;

        int local[30]{};
        for (int b = 29; b >= 0; b--) {
            if (pref[r].pos[b] >= l && pref[r].val[b] != 0) {
                local[b] = pref[r].val[b];
            }
        }

        // Orthogonalize downward so every pivot bit is exclusive to its own basis vector
        for (int b = 0; b < 30; b++) {
            if (local[b] == 0) continue;
            for (int hi = b + 1; hi < 30; hi++) {
                if ((local[hi] >> b) & 1) {
                    local[hi] ^= local[b];
                }
            }
        }

        vector<int> pivots;
        for (int b = 0; b < 30; b++) {
            if (local[b] != 0) pivots.push_back(local[b]);
        }

        int rank = (int)pivots.size();
        if (k - 1 >= (1ULL << rank)) {
            cout << -1 << "\\n";
            continue;
        }
        unsigned long long target = k - 1;
        int ans = 0;
        for (int i = 0; i < rank; i++) {
            if ((target >> i) & 1ULL) ans ^= pivots[i];
        }
        cout << ans << "\\n";
    }
    return 0;
}`,
        rust: `use std::io::{self, Read};

#[derive(Clone, Copy)]
struct BasisSnapshot {
    val: [i32; 30],
    pos: [usize; 30],
}

impl BasisSnapshot {
    fn empty() -> Self {
        Self { val: [0; 30], pos: [0; 30] }
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
    let q: usize = it.next().unwrap().parse().unwrap();

    let mut pref = Vec::with_capacity(n + 1);
    pref.push(BasisSnapshot::empty());

    for i in 1..=n {
        let mut cur = pref[i - 1];
        let mut x: i32 = it.next().unwrap().parse().unwrap();
        let mut p = i;
        for b in (0..30).rev() {
            if ((x >> b) & 1) == 0 {
                continue;
            }
            if cur.val[b] == 0 {
                cur.val[b] = x;
                cur.pos[b] = p;
                break;
            }
            if cur.pos[b] < p {
                std::mem::swap(&mut cur.val[b], &mut x);
                std::mem::swap(&mut cur.pos[b], &mut p);
            }
            x ^= cur.val[b];
        }
        pref.push(cur);
    }

    let mut out = String::new();
    for _ in 0..q {
        let l: usize = it.next().unwrap().parse().unwrap();
        let r: usize = it.next().unwrap().parse().unwrap();
        let k: u64 = it.next().unwrap().parse().unwrap();

        let mut local = [0i32; 30];
        for b in 0..30 {
            if pref[r].pos[b] >= l && pref[r].val[b] != 0 {
                local[b] = pref[r].val[b];
            }
        }
        for b in 0..30 {
            if local[b] == 0 {
                continue;
            }
            for hi in (b + 1)..30 {
                if ((local[hi] >> b) & 1) == 1 {
                    local[hi] ^= local[b];
                }
            }
        }
        let mut pivots = Vec::new();
        for b in 0..30 {
            if local[b] != 0 {
                pivots.push(local[b]);
            }
        }
        let rank = pivots.len();
        if k - 1 >= (1u64 << rank) {
            out.push_str("-1\n");
        } else {
            let target = k - 1;
            let mut ans = 0;
            for (i, &v) in pivots.iter().enumerate() {
                if ((target >> i) & 1) == 1 {
                    ans ^= v;
                }
            }
            out.push_str(&format!("{}\\n", ans));
        }
    }
    print!("{}", out);
}`,
        java21: `import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;

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
        long nIn = fs.nextLong();
        if (nIn == Long.MIN_VALUE) return;
        int n = (int) nIn;
        int q = (int) fs.nextLong();

        int[][] prefVal = new int[n + 1][30];
        int[][] prefPos = new int[n + 1][30];

        for (int i = 1; i <= n; i++) {
            System.arraycopy(prefVal[i - 1], 0, prefVal[i], 0, 30);
            System.arraycopy(prefPos[i - 1], 0, prefPos[i], 0, 30);
            int x = (int) fs.nextLong();
            int p = i;
            for (int b = 29; b >= 0; b--) {
                if (((x >>> b) & 1) == 0) continue;
                if (prefVal[i][b] == 0) {
                    prefVal[i][b] = x;
                    prefPos[i][b] = p;
                    break;
                }
                if (prefPos[i][b] < p) {
                    int tv = prefVal[i][b]; prefVal[i][b] = x; x = tv;
                    int tp = prefPos[i][b]; prefPos[i][b] = p; p = tp;
                }
                x ^= prefVal[i][b];
            }
        }

        int[] local = new int[30];
        int[] pivots = new int[30];
        StringBuilder sb = new StringBuilder();
        while (q-- > 0) {
            int l = (int) fs.nextLong();
            int r = (int) fs.nextLong();
            long k = fs.nextLong();

            Arrays.fill(local, 0);
            for (int b = 0; b < 30; b++) {
                if (prefPos[r][b] >= l && prefVal[r][b] != 0) local[b] = prefVal[r][b];
            }
            for (int b = 0; b < 30; b++) {
                if (local[b] == 0) continue;
                for (int hi = b + 1; hi < 30; hi++) {
                    if (((local[hi] >>> b) & 1) == 1) local[hi] ^= local[b];
                }
            }
            int rank = 0;
            for (int b = 0; b < 30; b++) {
                if (local[b] != 0) pivots[rank++] = local[b];
            }
            if (k - 1 >= (1L << rank)) {
                sb.append("-1\\n");
            } else {
                long target = k - 1;
                int ans = 0;
                for (int i = 0; i < rank; i++) {
                    if (((target >>> i) & 1L) == 1) ans ^= pivots[i];
                }
                sb.append(ans).append('\\n');
            }
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
    n, q = int(next(it)), int(next(it))

    pref_val = [[0] * 30]
    pref_pos = [[0] * 30]

    for i in range(1, n + 1):
        val = pref_val[-1][:]
        pos = pref_pos[-1][:]
        x = int(next(it))
        p = i
        for b in range(29, -1, -1):
            if not ((x >> b) & 1):
                continue
            if val[b] == 0:
                val[b] = x
                pos[b] = p
                break
            if pos[b] < p:
                val[b], x = x, val[b]
                pos[b], p = p, pos[b]
            x ^= val[b]
        pref_val.append(val)
        pref_pos.append(pos)

    out = []
    for _ in range(q):
        l = int(next(it))
        r = int(next(it))
        k = int(next(it))
        vr, pr = pref_val[r], pref_pos[r]
        local = [vr[b] if (pr[b] >= l and vr[b]) else 0 for b in range(30)]
        for b in range(30):
            if local[b] == 0:
                continue
            lb = local[b]
            for hi in range(b + 1, 30):
                if (local[hi] >> b) & 1:
                    local[hi] ^= lb
        pivots = [v for v in local if v]
        rank = len(pivots)
        if k - 1 >= (1 << rank):
            out.append("-1")
        else:
            target = k - 1
            ans = 0
            for i, pv in enumerate(pivots):
                if (target >> i) & 1:
                    ans ^= pv
            out.append(str(ans))
    sys.stdout.write("\\n".join(out) + "\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
idx = 0
n = tokens[idx].to_i
q = tokens[idx + 1].to_i
idx += 2

pref_val = [Array.new(30, 0)]
pref_pos = [Array.new(30, 0)]

(1..n).each do |i|
  val = pref_val[-1].dup
  pos = pref_pos[-1].dup
  x = tokens[idx].to_i
  idx += 1
  p = i
  29.downto(0) do |b|
    next if ((x >> b) & 1) == 0
    if val[b] == 0
      val[b] = x
      pos[b] = p
      break
    end
    if pos[b] < p
      val[b], x = x, val[b]
      pos[b], p = p, pos[b]
    end
    x ^= val[b]
  end
  pref_val << val
  pref_pos << pos
end

out = []
q.times do
  l = tokens[idx].to_i
  r = tokens[idx + 1].to_i
  k = tokens[idx + 2].to_i
  idx += 3

  vr = pref_val[r]
  pr = pref_pos[r]
  local = Array.new(30) { |b| (pr[b] >= l && vr[b] != 0) ? vr[b] : 0 }
  30.times do |b|
    next if local[b] == 0
    lb = local[b]
    ((b + 1)...30).each do |hi|
      local[hi] ^= lb if ((local[hi] >> b) & 1) == 1
    end
  end
  pivots = local.reject(&:zero?)
  rank = pivots.length
  if k - 1 >= (1 << rank)
    out << "-1"
  else
    target = k - 1
    ans = 0
    pivots.each_with_index { |pv, i| ans ^= pv if ((target >> i) & 1) == 1 }
    out << ans
  end
end
puts out.join("\\n")`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'CSES',
      title: 'Maximum Xor Subset',
      difficulty: 'Hard / Bitwise Math',
      url: 'https://cses.fi/problemset/task/3191',
      patternNote: 'Direct O(N * B) GF(2) XOR basis insertion + greedy high-to-low max-XOR extraction.',
    },
    {
      platform: 'AtCoder',
      title: 'ABC141 F - Xor Sum 3 & ABC283 G',
      difficulty: '1900–2200',
      url: 'https://atcoder.jp/contests/abc141/tasks/abc141_f',
      patternNote: 'Partition bitmask contributions and maximize remaining bit variance with a GF(2) XOR basis.',
    },
    {
      platform: 'Codeforces',
      title: 'Ivan and Burgers (CF 1100F) & Mahmoud and Ehab (CF 959F)',
      difficulty: '1900–2500',
      url: 'https://codeforces.com/problemset/problem/1100/F',
      patternNote: 'Prefix rightmost XOR basis answering online range `[L, R]` Max-XOR queries in `O(B)`!',
    },
    {
      platform: 'CodeChef',
      title: 'XOR With Subset (XORSUB) & Linear Equations',
      difficulty: 'Medium–Hard',
      url: 'https://www.codechef.com/problems/XORSUB',
      patternNote: 'Seed initial greedy answer with `K` before sweeping the GF(2) XOR basis.',
    },
    {
      platform: 'HackerRank',
      title: 'Gaussian Elimination / Linear Systems & XOR Basis',
      difficulty: 'Hard',
      url: 'https://www.hackerrank.com/challenges/matrix/problem',
      patternNote: 'Practice both real-valued partial-pivot Gaussian elimination and modular Gauss-Jordan systems.',
    },
    {
      platform: 'NeetCode 150',
      title: 'Single Number II / Maximum XOR of Two Numbers',
      difficulty: 'Medium (LeetCode 421)',
      url: 'https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/',
      patternNote: 'Pairwise XOR extends cleanly to arbitrary-size subset XOR via linear bases.',
    },
  ],
  interviewNotes: [
    'Whenever a problem asks about **subsets** + **XOR** (max subset XOR, K-th subset XOR, number of ways to achieve X), a 60-bit GF(2) Linear Basis solves it in `O(N * 60)` without any DP over values.',
    'Over real numbers (e.g., expected steps in random walks / Markov chains with cycles), write Gauss-Jordan with **maximum-magnitude partial pivoting** to prevent `1 / 1e-12` precision explosions.',
    'Explain why keeping the rightmost index `pos[b]` during prefix basis swaps proves correctness for offline/online subarray `[L, R]` queries.',
  ],
  projectBlueprint: {
    title: 'Error-Correcting Code & Network Packet Linear Algebra Solver',
    tagline: 'Decode lost erasure-coded network packets and detect linearly dependent parity frames using GF(2) Gaussian elimination and XOR basis reduction.',
    stackSummary: 'C++20 Bit-Packed GF(2) Linear Solver, Erasure Decoder, Basis Rank Telemetry',
    asciiDiagram: `
+-------------------------+      +------------------------------------+
| Received Packet Headers | ---> | GF(2) XOR Basis Rank Tracker O(B)  |
| + Linear Parity Masks   |      | Flags Dependent / Redundant Frames |
+-------------------------+      +------------------------------------+
                                                   |
          +----------------------------------------+
          v
+-----------------------------------+     +----------------------------+
| Gauss-Jordan Back-Substitution    | --> | Recovered Original Payload |
| Over GF(2) / GF(P)                |     | Blocks (Zero Packet Loss)  |
+-----------------------------------+     +----------------------------+`,
    milestones: [
      {
        id: 'm1',
        title: '1. Online GF(2) Packet Rank Detector',
        detail: 'Stream incoming packet parity headers through an XOR basis to detect immediately when enough independent equations exist to recover all `K` source blocks.',
      },
      {
        id: 'm2',
        title: '2. Bitset-Accelerated Gauss-Jordan Solver',
        detail: 'Reduce augmented packet equations in `O(K^2)` word operations to solve missing blocks in microseconds.',
      },
      {
        id: 'm3',
        title: '3. Parity Checksum Syndrome Verifier',
        detail: 'Run `can_form(syndrome)` diagnostics to validate zero-corruption integrity across decoded blocks.',
      },
    ],
    starterCode: `// Error-Correcting Code & Network Packet Linear Algebra Solver (Runnable C++20 Prototype)
#include <bits/stdc++.h>
using namespace std;

int main() {
    // 4 original 8-bit data blocks recovered from linear XOR coded packets:
    // mask (4-bit coefficients) | payload (8-bit parity byte)
    vector<pair<int, int>> packets = {
        {0b1010, 0x3A}, // B3 ^ B1
        {0b0110, 0x55}, // B2 ^ B1
        {0b1100, 0x6F}, // Redundant: (B3^B1) ^ (B2^B1) = 0x3A ^ 0x55 = 0x6F
        {0b0011, 0x19}, // B1 ^ B0
        {0b0001, 0x0D}, // B0
    };

    array<int, 4> basisMask{}, basisData{};
    int rank = 0;
    for (auto [m, d] : packets) {
        for (int b = 3; b >= 0; b--) {
            if (!((m >> b) & 1)) continue;
            if (!basisMask[b]) {
                basisMask[b] = m; basisData[b] = d; rank++;
                break;
            }
            m ^= basisMask[b];
            d ^= basisData[b];
        }
    }

    // Back-substitute upward to solve B0..B3
    for (int b = 0; b < 4; b++) {
        for (int hi = b + 1; hi < 4; hi++) {
            if ((basisMask[hi] >> b) & 1) {
                basisMask[hi] ^= basisMask[b];
                basisData[hi] ^= basisData[b];
            }
        }
    }
    cout << "Recovered Rank = " << rank << "/4 | Decoded Bytes: ";
    for (int b = 0; b < 4; b++) cout << "B" << b << "=0x" << hex << basisData[b] << " ";
    cout << dec << "\\n";
    return 0;
}`,
  },
};
