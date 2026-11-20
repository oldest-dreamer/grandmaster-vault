import type { TheoryChapter } from '../../types/vault';

export const CH48_ZOBRIST_RANDOMIZED_HASH: TheoryChapter = {
  slug: 'randomized-hashing-xor-fingerprints',
  topicId: 'th-73',
  title: 'Zobrist Hashing, Randomized Fingerprints & Schwartz-Zippel',
  domain: 'Theoretical & Randomized',
  ratingTier: '1900–2200',
  usacoDivision: 'Platinum',
  subtitle:
    'Map multisets, parity conditions, and board states into order-independent 64/128-bit signatures using splitmix64 Zobrist keys, verify N x N matrix multiplication in O(K * N^2) with Freivalds’ algorithm, and apply Schwartz-Zippel algebraic identity testing.',
  analogyTitle: 'The Unordered Currency Stamp & Randomized Spotlight Analogy',
  analogyBody:
    'Polynomial Rolling Hash cares deeply about order (`[1, 2] != [2, 1]`). What if you need to test whether two subarrays are **permutations of each other (same multiset)**, or whether **every value in a subarray appears an even (or `K`-divisible) number of times** in `O(1)`? Enter **Zobrist Hashing**: stamp every distinct integer `x` with an independent random 64-bit key `W[x] = splitmix64(seed + x)`. Summing `W[x]` over a range yields an **order-independent multiset signature**, while XORing `W[x]` yields a **mod-2 parity signature** (`0` iff every element appears an even number of times!). Even better, by the **Schwartz-Zippel Lemma**, any non-zero multivariate polynomial of degree `d` evaluates to `0` at a random point over field `F_p` with probability at most **`d / p`**! **Freivalds’ Algorithm** uses that exact principle to verify whether `A * B == C` for `N x N` matrices in **`O(K * N^2)`** instead of `O(N^3)` simply by testing `A * (B * r) == C * r` across `K` random binary vectors `r`!',
  prerequisites: [
    {
      slug: 'polynomial-rolling-hash',
      title: 'Polynomial Rolling Hash & Anti-Birthday Double Hashing',
    },
  ],
  traceTitle: 'Interactive Zobrist Multiset Fingerprint & Freivalds Vector Probe Trace',
  traceSubtitle:
    'Compare subarray `[1, 2, 3]` vs `[3, 2, 1]` using Zobrist Sum + XOR prefix fingerprints, then watch Freivalds catch a corrupted entry in `A * B != C` in O(N^2).',
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Step 1: Assign Independent splitmix64 Random Keys W[1], W[2], W[3]',
      explanation:
        'Using splitmix64 seeded at runtime with steady_clock / non-fixed entropy prevents deterministic anti-hash tests. Here W[1]=0x9e37..., W[2]=0xbf58..., W[3]=0x94d0.... Build prefix Sum (mod 2^64) AND prefix XOR arrays!',
      mode: 'array',
      arrays: [
        {
          name: 'Prefix Zobrist Sum & XOR on A = [1, 2, 3, 2, 1]',
          cells: [
            { index: 0, value: 'S=0, X=0', label: 'pos 0', highlight: 'neutral' },
            { index: 1, value: 'W1', label: 'A[1]=1', highlight: 'window' },
            { index: 2, value: 'W1+W2', label: 'A[2]=2', highlight: 'window' },
            { index: 3, value: 'W1+W2+W3', label: 'A[3]=3', highlight: 'active' },
            { index: 4, value: 'S4, X4', label: 'A[4]=2', highlight: 'updated' },
            { index: 5, value: 'S5, X5', label: 'A[5]=1', highlight: 'active' },
          ],
        },
      ],
      variables: { CollisionProb: '< 2^-128 (Dual 64-bit)', QueryCost: 'O(1)' },
    },
    {
      stepNumber: 2,
      title: 'Step 2: Query Multiset Equality [1..3] vs [3..5] in O(1)',
      explanation:
        'Compare Sum(1..3) = W1+W2+W3 vs Sum(3..5) = PrefSum[5] - PrefSum[2] = W3+W2+W1, AND check Xor(1..3) == Xor(3..5). Both match identically -> YES, [1,2,3] and [3,2,1] are exact multisets! Querying [1..3] vs [2..4] compares W1+W2+W3 != W2+W3+W2 -> NO!',
      mode: 'array',
      arrays: [
        {
          name: 'Subarray Signature Comparisons',
          cells: [
            { index: 1, value: 'W1+W2+W3', label: '[1..3]', highlight: 'active' },
            { index: 2, value: 'W3+W2+W1', label: '[3..5] Match!', highlight: 'active' },
            { index: 3, value: 'W2+W3+W2', label: '[2..4] Mismatch', highlight: 'updated' },
          ],
        },
      ],
      variables: { Query1: 'YES', Query2: 'NO', OrderSensitive: 'False' },
    },
    {
      stepNumber: 3,
      title: 'Step 3: Freivalds’ O(N^2) Matrix Check — Test A*(B*r) == C*r With Random r',
      explanation:
        'Never multiply N x N matrices in O(N^3)! Multiply B by random N x 1 vector r in O(N^2), multiply A by (B*r) in O(N^2), and compare to C*r in O(N^2). If A*B != C in ANY entry, a single random binary vector r catches it with probability >= 1/2; 30 rounds shrink error to <= 2^-30 < 10^-9!',
      mode: 'array',
      arrays: [
        {
          name: 'Freivalds Vector Collapse (O(N^3) -> O(K * N^2))',
          cells: [
            { index: 0, value: 'v1 = B * r', label: 'O(N^2)', highlight: 'window' },
            { index: 1, value: 'v2 = A * v1', label: 'O(N^2)', highlight: 'window' },
            { index: 2, value: 'v3 = C * r', label: 'O(N^2)', highlight: 'updated' },
            { index: 3, value: 'v2 == v3 ?', label: '30x -> 2^-30 err', highlight: 'active' },
          ],
        },
      ],
      variables: { Rounds: 30, FailureBound: '9.3e-10', TimeComplexity: 'O(K * N^2)' },
    },
  ],
  reductionClues: [
    {
      clue: '"Check whether subarray [l1..r1] is a permutation/multiset of [l2..r2], or equals {1..k}"',
      translation:
        '**Zobrist Multiset Hashing (Sum + XOR with `splitmix64`)**! Assign each value `v` a randomized 64-bit weight `w[v]` (or dual pair `(w1[v], w2[v])`); `pref[r] - pref[l - 1]` tests ANY multiset equality in `O(1)`!',
    },
    {
      clue: '"Count subarrays where every element occurs an EVEN number of times (or divisible by K)"',
      translation:
        'Track per-value residue `cnt[v] = (cnt[v] + 1) % K`! Updating a dual 64-bit hash `H += (new_cnt - old_cnt) * W[v]` as you sweep right makes `pref[r] == pref[l - 1]` hold **if and only if every distinct element in `[l..r]` has frequency divisible by `K`**!',
    },
    {
      clue: '"Verify A * B == C for N x N matrices (N <= 1000) under tight 1-second TL"',
      translation:
        '**Freivalds’ Algorithm**: test `A * (B * r) == C * r` across `K = 25..30` random binary vectors `r in {0, 1}^N` (or `r in [0, P-1]^N` mod prime `P`), cutting `O(N^3)` down to `O(K * N^2)`!',
    },
    {
      clue: '"Check if two trees are isomorphic, or test whether an algebraic matrix/polynomial expression is identically 0"',
      translation:
        '**Schwartz-Zippel & Randomized Tree Hashing**: hash subtrees by `1 + sum_{child} splitmix64(hash[child])`, or plug random field scalars `x_1..x_m in [1, P-1]` into the polynomial/determinant!',
    },
  ],
  timeComplexity: 'Zobrist Prefix Query: O(1) | Freivalds Check: O(K * N^2)',
  spaceComplexity: 'Zobrist: O(N + V) | Freivalds: O(N^2) input',
  pitfalls: [
    {
      type: 'WA',
      title: 'Using Plain Integer Identity `w[x] = x` or `x * x` Without Random 64-Bit Mixing',
      detail:
        'Without `splitmix64` mixing, simple identities collide trivially (`1 + 4 == 2 + 3`, `1^2 + 8^2 == 4^2 + 7^2`)! Always pass every key through a full 64-bit avalanche mixer (`splitmix64`) and combine **BOTH Sum AND XOR** (or dual independent 64-bit seeds)!',
    },
    {
      type: 'WA',
      title: 'Collision by Birthday Paradox When N^2 Approaches 2^64 (Single 64-Bit Hash)',
      detail:
        'If comparing `N = 2 * 10^5` prefix hashes in a hash map (`N^2 / 2 = 2 * 10^{10}` pairs), a single 32-bit hash collides with probability `~99%`, and even a weak hash can fail! Always use **64-bit or Dual 64-bit (`128-bit`)** `splitmix64` signatures so birthday collision drops below `10^{-18}`!',
    },
    {
      type: 'WA',
      title: 'Using Fixed Deterministic Seed Against Hackable Educational Rounds',
      detail:
        'Codeforces open-hacking contests explicitly look for fixed seeds in `splitmix64`! Seed your `mt19937_64` RNG with `chrono::steady_clock::now().time_since_epoch().count()` (plus heap address entropy) so no adversary can craft a precomputed collision!',
    },
    {
      type: 'WA',
      title: 'Using XOR Alone for General Multiset Equality (When Duplicate Frequencies Matter)',
      detail:
        'XOR cancels duplicates (`{1, 1, 2}` has the SAME XOR hash as `{2}`!). For full multiset equality (where `{1, 1}` != `{1, 1, 1, 1}`), ALWAYS use **64-bit Sum** (`prefSum[r] - prefSum[l - 1]`) — and reserve pure XOR for mod-2 parity problems!',
    },
  ],
  implementations: {
    cpp20: `#include <bits/stdc++.h>
using namespace std;

// Dual-Seed SplitMix64 Zobrist Multiset Hasher: O(1) Order-Independent Subarray Equality
static uint64_t splitmix64(uint64_t x) {
    x += 0x9e3779b97f4a7c15ULL;
    x = (x ^ (x >> 30)) * 0xbf58476d1ce4e5b9ULL;
    x = (x ^ (x >> 27)) * 0x94d049bb133111ebULL;
    return x ^ (x >> 31);
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, q;
    if (!(cin >> n >> q)) return 0;

    uint64_t seed1 = chrono::steady_clock::now().time_since_epoch().count() ^ 0x517cc1b727220a95ULL;
    uint64_t seed2 = seed1 ^ 0x9e3779b97f4a7c15ULL;

    vector<uint64_t> prefSum1(n + 1, 0), prefSum2(n + 1, 0), prefXor(n + 1, 0);
    for (int i = 1; i <= n; i++) {
        uint64_t x;
        cin >> x;
        uint64_t h1 = splitmix64(x ^ seed1);
        uint64_t h2 = splitmix64(x ^ seed2);
        prefSum1[i] = prefSum1[i - 1] + h1;
        prefSum2[i] = prefSum2[i - 1] + h2;
        prefXor[i]  = prefXor[i - 1]  ^ h1;
    }

    while (q--) {
        int l1, r1, l2, r2;
        cin >> l1 >> r1 >> l2 >> r2;
        bool ok = (r1 - l1 == r2 - l2)
               && (prefSum1[r1] - prefSum1[l1 - 1] == prefSum1[r2] - prefSum1[l2 - 1])
               && (prefSum2[r1] - prefSum2[l1 - 1] == prefSum2[r2] - prefSum2[l2 - 1])
               && ((prefXor[r1]  ^ prefXor[l1 - 1]) == (prefXor[r2]  ^ prefXor[l2 - 1]));
        cout << (ok ? "YES" : "NO") << "\\n";
    }
    return 0;
}`,
    rust: `use std::io::{self, Read};
use std::time::{SystemTime, UNIX_EPOCH};

fn splitmix64(mut x: u64) -> u64 {
    x = x.wrapping_add(0x9e37_79b9_7f4a_7c15);
    x = (x ^ (x >> 30)).wrapping_mul(0xbf58_476d_1ce4_e5b9);
    x = (x ^ (x >> 27)).wrapping_mul(0x94d0_49bb_1331_11eb);
    x ^ (x >> 31)
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

    let nanos = SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_nanos() as u64;
    let seed1 = nanos ^ 0x517c_c1b7_2722_0a95;
    let seed2 = seed1 ^ 0x9e37_79b9_7f4a_7c15;

    let mut pref1 = vec![0u64; n + 1];
    let mut pref2 = vec![0u64; n + 1];
    let mut pxor = vec![0u64; n + 1];

    for i in 1..=n {
        let x: u64 = it.next().unwrap().parse::<i64>().unwrap() as u64;
        let h1 = splitmix64(x ^ seed1);
        let h2 = splitmix64(x ^ seed2);
        pref1[i] = pref1[i - 1].wrapping_add(h1);
        pref2[i] = pref2[i - 1].wrapping_add(h2);
        pxor[i] = pxor[i - 1] ^ h1;
    }

    let mut out = String::new();
    for _ in 0..q {
        let l1: usize = it.next().unwrap().parse().unwrap();
        let r1: usize = it.next().unwrap().parse().unwrap();
        let l2: usize = it.next().unwrap().parse().unwrap();
        let r2: usize = it.next().unwrap().parse().unwrap();
        let ok = (r1 - l1 == r2 - l2)
            && (pref1[r1].wrapping_sub(pref1[l1 - 1]) == pref1[r2].wrapping_sub(pref1[l2 - 1]))
            && (pref2[r1].wrapping_sub(pref2[l1 - 1]) == pref2[r2].wrapping_sub(pref2[l2 - 1]))
            && ((pxor[r1] ^ pxor[l1 - 1]) == (pxor[r2] ^ pxor[l2 - 1]));
        out.push_str(if ok { "YES\\n" } else { "NO\\n" });
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

    static long splitmix64(long x) {
        x += 0x9e3779b97f4a7c15L;
        x = (x ^ (x >>> 30)) * 0xbf58476d1ce4e5b9L;
        x = (x ^ (x >>> 27)) * 0x94d049bb133111ebL;
        return x ^ (x >>> 31);
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        long nIn = fs.nextLong();
        if (nIn == Long.MIN_VALUE) return;
        int n = (int) nIn, q = (int) fs.nextLong();

        long seed1 = System.nanoTime() ^ 0x517cc1b727220a95L;
        long seed2 = seed1 ^ 0x9e3779b97f4a7c15L;

        long[] pref1 = new long[n + 1], pref2 = new long[n + 1], pxor = new long[n + 1];
        for (int i = 1; i <= n; i++) {
            long x = fs.nextLong();
            long h1 = splitmix64(x ^ seed1);
            long h2 = splitmix64(x ^ seed2);
            pref1[i] = pref1[i - 1] + h1;
            pref2[i] = pref2[i - 1] + h2;
            pxor[i] = pxor[i - 1] ^ h1;
        }

        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < q; i++) {
            int l1 = (int) fs.nextLong(), r1 = (int) fs.nextLong();
            int l2 = (int) fs.nextLong(), r2 = (int) fs.nextLong();
            boolean ok = (r1 - l1 == r2 - l2)
                && (pref1[r1] - pref1[l1 - 1] == pref1[r2] - pref1[l2 - 1])
                && (pref2[r1] - pref2[l1 - 1] == pref2[r2] - pref2[l2 - 1])
                && ((pxor[r1] ^ pxor[l1 - 1]) == (pxor[r2] ^ pxor[l2 - 1]));
            sb.append(ok ? "YES\\n" : "NO\\n");
        }
        System.out.print(sb);
    }
}`,
    python3: `import random
import sys

sys.setrecursionlimit(200000)

MASK = (1 << 64) - 1

def splitmix64(x: int) -> int:
    x = (x + 0x9E3779B97F4A7C15) & MASK
    x = ((x ^ (x >> 30)) * 0xBF58476D1CE4E5B9) & MASK
    x = ((x ^ (x >> 27)) * 0x94D049BB133111EB) & MASK
    return x ^ (x >> 31)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    n = int(next(it))
    q = int(next(it))

    rng = random.SystemRandom()
    seed1 = rng.getrandbits(64)
    seed2 = rng.getrandbits(64)

    pref1 = [0] * (n + 1)
    pref2 = [0] * (n + 1)
    pxor = [0] * (n + 1)

    for i in range(1, n + 1):
        x = int(next(it)) & MASK
        h1 = splitmix64(x ^ seed1)
        h2 = splitmix64(x ^ seed2)
        pref1[i] = (pref1[i - 1] + h1) & MASK
        pref2[i] = (pref2[i - 1] + h2) & MASK
        pxor[i] = pxor[i - 1] ^ h1

    out = []
    for _ in range(q):
        l1 = int(next(it))
        r1 = int(next(it))
        l2 = int(next(it))
        r2 = int(next(it))
        ok = (
            (r1 - l1 == r2 - l2)
            and ((pref1[r1] - pref1[l1 - 1]) & MASK) == ((pref1[r2] - pref1[l2 - 1]) & MASK)
            and ((pref2[r1] - pref2[l1 - 1]) & MASK) == ((pref2[r2] - pref2[l2 - 1]) & MASK)
            and (pxor[r1] ^ pxor[l1 - 1]) == (pxor[r2] ^ pxor[l2 - 1])
        )
        out.append("YES" if ok else "NO")
    sys.stdout.write("\\n".join(out) + "\\n")

if __name__ == "__main__":
    solve()`,
    ruby: `require 'securerandom'

MASK = (1 << 64) - 1

def splitmix64(x)
  x = (x + 0x9e3779b97f4a7c15) & MASK
  x = ((x ^ (x >> 30)) * 0xbf58476d1ce4e5b9) & MASK
  x = ((x ^ (x >> 27)) * 0x94d049bb133111eb) & MASK
  x ^ (x >> 31)
end

tokens = $stdin.read.split
exit if tokens.empty?
idx = 0
n = tokens[idx].to_i; idx += 1
q = tokens[idx].to_i; idx += 1

seed1 = SecureRandom.random_number(1 << 64)
seed2 = SecureRandom.random_number(1 << 64)

pref1 = Array.new(n + 1, 0)
pref2 = Array.new(n + 1, 0)
pxor = Array.new(n + 1, 0)

(1..n).each do |i|
  x = tokens[idx].to_i & MASK; idx += 1
  h1 = splitmix64(x ^ seed1)
  h2 = splitmix64(x ^ seed2)
  pref1[i] = (pref1[i - 1] + h1) & MASK
  pref2[i] = (pref2[i - 1] + h2) & MASK
  pxor[i] = pxor[i - 1] ^ h1
end

out = []
q.times do
  l1 = tokens[idx].to_i; r1 = tokens[idx + 1].to_i
  l2 = tokens[idx + 2].to_i; r2 = tokens[idx + 3].to_i
  idx += 4
  ok = (r1 - l1 == r2 - l2) &&
       ((pref1[r1] - pref1[l1 - 1]) & MASK) == ((pref1[r2] - pref1[l2 - 1]) & MASK) &&
       ((pref2[r1] - pref2[l1 - 1]) & MASK) == ((pref2[r2] - pref2[l2 - 1]) & MASK) &&
       (pxor[r1] ^ pxor[l1 - 1]) == (pxor[r2] ^ pxor[l2 - 1])
  out << (ok ? "YES" : "NO")
end
puts out.join("\\n")`,
  },
  practiceProblems: [
    {
      id: 'ch48-p1',
      tier: 'Warmup',
      ratingRange: '1750–1950',
      title: 'Subarray Multiset Equality — Dual SplitMix64 Zobrist Prefix Fingerprints',
      statement:
        'Given an array `A[1..N]` and `Q` queries `(l1, r1, l2, r2)`, determine whether subarray `A[l1..r1]` is a **permutation (identical multiset)** of subarray `A[l2..r2]`. Output `YES` or `NO` for each query in `O(1)`.',
      constraints: '1 <= N, Q <= 2 * 10^5, 1 <= A[i] <= 10^9',
      sampleInput: '5 3\n1 2 3 2 1\n1 3 3 5\n1 2 4 5\n1 3 2 4',
      sampleOutput: 'YES\nYES\nNO',
      hints: [
        'Map each element `A[i]` through two independent `splitmix64` hash functions `h1 = splitmix64(A[i] ^ seed1)` and `h2 = splitmix64(A[i] ^ seed2)`.',
        'Build prefix sums modulo `2^64` for `h1` and `h2` (plus prefix XOR of `h1`). Subarrays `[l1..r1]` and `[l2..r2]` match as multisets iff their lengths and all 3 range signatures match!',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

static uint64_t splitmix64(uint64_t x) {
    x += 0x9e3779b97f4a7c15ULL;
    x = (x ^ (x >> 30)) * 0xbf58476d1ce4e5b9ULL;
    x = (x ^ (x >> 27)) * 0x94d049bb133111ebULL;
    return x ^ (x >> 31);
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, q;
    if (!(cin >> n >> q)) return 0;

    uint64_t s1 = chrono::steady_clock::now().time_since_epoch().count() ^ 0x243f6a8885a308d3ULL;
    uint64_t s2 = s1 ^ 0x13198a2e03707344ULL;

    vector<uint64_t> p1(n + 1, 0), p2(n + 1, 0), px(n + 1, 0);
    for (int i = 1; i <= n; i++) {
        uint64_t x;
        cin >> x;
        uint64_t h1 = splitmix64(x ^ s1);
        uint64_t h2 = splitmix64(x ^ s2);
        p1[i] = p1[i - 1] + h1;
        p2[i] = p2[i - 1] + h2;
        px[i] = px[i - 1] ^ h1;
    }

    while (q--) {
        int l1, r1, l2, r2;
        cin >> l1 >> r1 >> l2 >> r2;
        bool ok = (r1 - l1 == r2 - l2)
               && (p1[r1] - p1[l1 - 1] == p1[r2] - p1[l2 - 1])
               && (p2[r1] - p2[l1 - 1] == p2[r2] - p2[l2 - 1])
               && ((px[r1] ^ px[l1 - 1]) == (px[r2] ^ px[l2 - 1]));
        cout << (ok ? "YES" : "NO") << "\\n";
    }
    return 0;
}`,
        rust: `use std::io::{self, Read};
use std::time::{SystemTime, UNIX_EPOCH};

fn splitmix64(mut x: u64) -> u64 {
    x = x.wrapping_add(0x9e37_79b9_7f4a_7c15);
    x = (x ^ (x >> 30)).wrapping_mul(0xbf58_476d_1ce4_e5b9);
    x = (x ^ (x >> 27)).wrapping_mul(0x94d0_49bb_1331_11eb);
    x ^ (x >> 31)
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

    let nanos = SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_nanos() as u64;
    let s1 = nanos ^ 0x243f_6a88_85a3_08d3;
    let s2 = s1 ^ 0x1319_8a2e_0370_7344;

    let mut p1 = vec![0u64; n + 1];
    let mut p2 = vec![0u64; n + 1];
    let mut px = vec![0u64; n + 1];
    for i in 1..=n {
        let x: u64 = it.next().unwrap().parse::<i64>().unwrap() as u64;
        let h1 = splitmix64(x ^ s1);
        let h2 = splitmix64(x ^ s2);
        p1[i] = p1[i - 1].wrapping_add(h1);
        p2[i] = p2[i - 1].wrapping_add(h2);
        px[i] = px[i - 1] ^ h1;
    }

    let mut out = String::new();
    for _ in 0..q {
        let l1: usize = it.next().unwrap().parse().unwrap();
        let r1: usize = it.next().unwrap().parse().unwrap();
        let l2: usize = it.next().unwrap().parse().unwrap();
        let r2: usize = it.next().unwrap().parse().unwrap();
        let ok = (r1 - l1 == r2 - l2)
            && (p1[r1].wrapping_sub(p1[l1 - 1]) == p1[r2].wrapping_sub(p1[l2 - 1]))
            && (p2[r1].wrapping_sub(p2[l1 - 1]) == p2[r2].wrapping_sub(p2[l2 - 1]))
            && ((px[r1] ^ px[l1 - 1]) == (px[r2] ^ px[l2 - 1]));
        out.push_str(if ok { "YES\\n" } else { "NO\\n" });
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
        long nextLong() throws IOException {
            int c = readByte();
            while (c >= 0 && c <= ' ') c = readByte();
            if (c == -1) return Long.MIN_VALUE;
            long res = 0;
            while (c > ' ') { res = res * 10 + (c - '0'); c = readByte(); }
            return res;
        }
    }

    static long splitmix64(long x) {
        x += 0x9e3779b97f4a7c15L;
        x = (x ^ (x >>> 30)) * 0xbf58476d1ce4e5b9L;
        x = (x ^ (x >>> 27)) * 0x94d049bb133111ebL;
        return x ^ (x >>> 31);
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        long nIn = fs.nextLong();
        if (nIn == Long.MIN_VALUE) return;
        int n = (int) nIn, q = (int) fs.nextLong();

        long s1 = System.nanoTime() ^ 0x243f6a8885a308d3L;
        long s2 = s1 ^ 0x13198a2e03707344L;

        long[] p1 = new long[n + 1], p2 = new long[n + 1], px = new long[n + 1];
        for (int i = 1; i <= n; i++) {
            long x = fs.nextLong();
            long h1 = splitmix64(x ^ s1);
            long h2 = splitmix64(x ^ s2);
            p1[i] = p1[i - 1] + h1;
            p2[i] = p2[i - 1] + h2;
            px[i] = px[i - 1] ^ h1;
        }

        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < q; i++) {
            int l1 = (int) fs.nextLong(), r1 = (int) fs.nextLong();
            int l2 = (int) fs.nextLong(), r2 = (int) fs.nextLong();
            boolean ok = (r1 - l1 == r2 - l2)
                && (p1[r1] - p1[l1 - 1] == p1[r2] - p1[l2 - 1])
                && (p2[r1] - p2[l1 - 1] == p2[r2] - p2[l2 - 1])
                && ((px[r1] ^ px[l1 - 1]) == (px[r2] ^ px[l2 - 1]));
            sb.append(ok ? "YES\\n" : "NO\\n");
        }
        System.out.print(sb);
    }
}`,
        python3: `import random
import sys

sys.setrecursionlimit(200000)

MASK = (1 << 64) - 1

def splitmix64(x: int) -> int:
    x = (x + 0x9E3779B97F4A7C15) & MASK
    x = ((x ^ (x >> 30)) * 0xBF58476D1CE4E5B9) & MASK
    x = ((x ^ (x >> 27)) * 0x94D049BB133111EB) & MASK
    return x ^ (x >> 31)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    n = int(next(it))
    q = int(next(it))
    rng = random.SystemRandom()
    s1 = rng.getrandbits(64)
    s2 = rng.getrandbits(64)

    p1 = [0] * (n + 1)
    p2 = [0] * (n + 1)
    px = [0] * (n + 1)
    for i in range(1, n + 1):
        x = int(next(it)) & MASK
        h1 = splitmix64(x ^ s1)
        h2 = splitmix64(x ^ s2)
        p1[i] = (p1[i - 1] + h1) & MASK
        p2[i] = (p2[i - 1] + h2) & MASK
        px[i] = px[i - 1] ^ h1

    out = []
    for _ in range(q):
        l1, r1, l2, r2 = int(next(it)), int(next(it)), int(next(it)), int(next(it))
        ok = (
            r1 - l1 == r2 - l2
            and ((p1[r1] - p1[l1 - 1]) & MASK) == ((p1[r2] - p1[l2 - 1]) & MASK)
            and ((p2[r1] - p2[l1 - 1]) & MASK) == ((p2[r2] - p2[l2 - 1]) & MASK)
            and (px[r1] ^ px[l1 - 1]) == (px[r2] ^ px[l2 - 1])
        )
        out.append("YES" if ok else "NO")
    sys.stdout.write("\\n".join(out) + "\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `require 'securerandom'

MASK = (1 << 64) - 1

def splitmix64(x)
  x = (x + 0x9e3779b97f4a7c15) & MASK
  x = ((x ^ (x >> 30)) * 0xbf58476d1ce4e5b9) & MASK
  x = ((x ^ (x >> 27)) * 0x94d049bb133111eb) & MASK
  x ^ (x >> 31)
end

tokens = $stdin.read.split
exit if tokens.empty?
idx = 0
n = tokens[idx].to_i; idx += 1
q = tokens[idx].to_i; idx += 1
s1 = SecureRandom.random_number(1 << 64)
s2 = SecureRandom.random_number(1 << 64)

p1 = Array.new(n + 1, 0)
p2 = Array.new(n + 1, 0)
px = Array.new(n + 1, 0)
(1..n).each do |i|
  x = tokens[idx].to_i & MASK; idx += 1
  h1 = splitmix64(x ^ s1)
  h2 = splitmix64(x ^ s2)
  p1[i] = (p1[i - 1] + h1) & MASK
  p2[i] = (p2[i - 1] + h2) & MASK
  px[i] = px[i - 1] ^ h1
end

out = []
q.times do
  l1 = tokens[idx].to_i; r1 = tokens[idx + 1].to_i
  l2 = tokens[idx + 2].to_i; r2 = tokens[idx + 3].to_i
  idx += 4
  ok = (r1 - l1 == r2 - l2) &&
       ((p1[r1] - p1[l1 - 1]) & MASK) == ((p1[r2] - p1[l2 - 1]) & MASK) &&
       ((p2[r1] - p2[l1 - 1]) & MASK) == ((p2[r2] - p2[l2 - 1]) & MASK) &&
       (px[r1] ^ px[l1 - 1]) == (px[r2] ^ px[l2 - 1])
  out << (ok ? "YES" : "NO")
end
puts out.join("\\n")`,
      },
    },
    {
      id: 'ch48-p2',
      tier: 'Standard',
      ratingRange: '1900–2150',
      title: 'Freivalds’ Matrix Multiplication Verification in O(K * N^2)',
      statement:
        'Given three `N x N` matrices `A`, `B`, and `C` modulo `998244353`, determine whether `A * B = C` (mod `998244353`) in `O(K * N^2)` time instead of `O(N^3)`. Print `YES` or `NO`.',
      constraints: '1 <= N <= 1000, 0 <= A[i][j], B[i][j], C[i][j] < 998244353',
      sampleInput: '2\n1 2\n3 4\n0 1\n1 0\n2 1\n4 3',
      sampleOutput: 'YES',
      hints: [
        'Run `K = 25` independent trials. In each trial, pick a uniformly random vector `r[0..N-1]` over `[0, MOD - 1]`.',
        'Compute `v = B * r` (`O(N^2)`), `u = A * v` (`O(N^2)`), and `w = C * r` (`O(N^2)`). If `u != w` in any trial, return `NO` immediately; if all `K` trials pass, print `YES` (error probability `<= 998244353^{-25} ~ 0`)!',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    if (!(cin >> n)) return 0;
    const long long MOD = 998244353;

    auto readMat = [&]() {
        vector<vector<long long>> m(n, vector<long long>(n));
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++) {
                cin >> m[i][j];
                m[i][j] %= MOD;
            }
        return m;
    };

    auto A = readMat(), B = readMat(), C = readMat();
    mt19937_64 rng(chrono::steady_clock::now().time_since_epoch().count());

    auto mulVec = [&](const vector<vector<long long>>& M, const vector<long long>& v) {
        vector<long long> res(n, 0);
        for (int i = 0; i < n; i++) {
            __int128 sum = 0;
            for (int j = 0; j < n; j++) sum += M[i][j] * v[j];
            res[i] = (long long)(sum % MOD);
        }
        return res;
    };

    for (int trial = 0; trial < 20; trial++) {
        vector<long long> r(n);
        for (int i = 0; i < n; i++) r[i] = rng() % MOD;
        auto ab_r = mulVec(A, mulVec(B, r));
        auto c_r  = mulVec(C, r);
        if (ab_r != c_r) {
            cout << "NO\\n";
            return 0;
        }
    }
    cout << "YES\\n";
    return 0;
}`,
        rust: `use std::io::{self, Read};
use std::time::{SystemTime, UNIX_EPOCH};

const MOD: i64 = 998_244_353;

fn mul_vec(m: &[Vec<i64>], v: &[i64]) -> Vec<i64> {
    let n = m.len();
    let mut res = vec![0i64; n];
    for i in 0..n {
        let mut s = 0i128;
        for j in 0..n {
            s += (m[i][j] as i128) * (v[j] as i128);
        }
        res[i] = (s % MOD as i128) as i64;
    }
    res
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let n: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };

    let mut read_mat = || -> Vec<Vec<i64>> {
        let mut m = vec![vec![0i64; n]; n];
        for i in 0..n {
            for j in 0..n {
                m[i][j] = it.next().unwrap().parse::<i64>().unwrap() % MOD;
            }
        }
        m
    };

    let a = read_mat();
    let b = read_mat();
    let c = read_mat();

    let mut state = SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_nanos() as u64 | 1;
    let mut next_rand = || -> i64 {
        state ^= state << 13;
        state ^= state >> 7;
        state ^= state << 17;
        (state % MOD as u64) as i64
    };

    for _ in 0..20 {
        let mut r = vec![0i64; n];
        for i in 0..n {
            r[i] = next_rand();
        }
        let br = mul_vec(&b, &r);
        let abr = mul_vec(&a, &br);
        let cr = mul_vec(&c, &r);
        if abr != cr {
            println!("NO");
            return;
        }
    }
    println!("YES");
}`,
        java21: `import java.io.IOException;
import java.io.InputStream;
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
        int nextInt() throws IOException {
            int c = readByte();
            while (c >= 0 && c <= ' ') c = readByte();
            if (c == -1) return -1;
            int res = 0;
            while (c > ' ') { res = res * 10 + (c - '0'); c = readByte(); }
            return res;
        }
    }

    static final long MOD = 998_244_353L;

    static long[] mulVec(long[][] m, long[] v, int n) {
        long[] res = new long[n];
        for (int i = 0; i < n; i++) {
            long sum = 0;
            long[] row = m[i];
            for (int j = 0; j < n; j++) {
                sum = (sum + row[j] * v[j]) % MOD;
            }
            res[i] = sum;
        }
        return res;
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        int n = fs.nextInt();
        if (n == -1) return;

        long[][] A = new long[n][n], B = new long[n][n], C = new long[n][n];
        for (int i = 0; i < n; i++) for (int j = 0; j < n; j++) A[i][j] = fs.nextInt() % MOD;
        for (int i = 0; i < n; i++) for (int j = 0; j < n; j++) B[i][j] = fs.nextInt() % MOD;
        for (int i = 0; i < n; i++) for (int j = 0; j < n; j++) C[i][j] = fs.nextInt() % MOD;

        SplittableRandom rng = new SplittableRandom(System.nanoTime());
        for (int trial = 0; trial < 20; trial++) {
            long[] r = new long[n];
            for (int i = 0; i < n; i++) r[i] = rng.nextLong(MOD);
            long[] abr = mulVec(A, mulVec(B, r, n), n);
            long[] cr = mulVec(C, r, n);
            for (int i = 0; i < n; i++) {
                if (abr[i] != cr[i]) {
                    System.out.println("NO");
                    return;
                }
            }
        }
        System.out.println("YES");
    }
}`,
        python3: `import random
import sys

sys.setrecursionlimit(200000)

MOD = 998244353

def mul_vec(m, v, n):
    res = [0] * n
    for i in range(n):
        row = m[i]
        res[i] = sum(row[j] * v[j] for j in range(n)) % MOD
    return res

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    n = int(next(it))

    A = [[int(next(it)) % MOD for _ in range(n)] for _ in range(n)]
    B = [[int(next(it)) % MOD for _ in range(n)] for _ in range(n)]
    C = [[int(next(it)) % MOD for _ in range(n)] for _ in range(n)]

    rng = random.SystemRandom()
    for _ in range(20):
        r = [rng.randrange(MOD) for _ in range(n)]
        if mul_vec(A, mul_vec(B, r, n), n) != mul_vec(C, r, n):
            sys.stdout.write("NO\\n")
            return
    sys.stdout.write("YES\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `require 'securerandom'

MOD = 998_244_353

tokens = $stdin.read.split
exit if tokens.empty?
idx = 0
n = tokens[idx].to_i; idx += 1

read_mat = lambda do
  Array.new(n) do
    Array.new(n) do
      v = tokens[idx].to_i % MOD
      idx += 1
      v
    end
  end
end

a = read_mat.call
b = read_mat.call
c = read_mat.call

mul_vec = lambda do |m, v|
  m.map do |row|
    sum = 0
    n.times { |j| sum += row[j] * v[j] }
    sum % MOD
  end
end

20.times do
  r = Array.new(n) { SecureRandom.random_number(MOD) }
  if mul_vec.call(a, mul_vec.call(b, r)) != mul_vec.call(c, r)
    puts "NO"
    exit
  end
end
puts "YES"`,
      },
    },
    {
      id: 'ch48-p3',
      tier: 'Boss',
      ratingRange: '2050–2300',
      title: 'Frequencies Divisible by K — Randomized Mod-K Vector Zobrist Fingerprinting',
      statement:
        'Given an integer `K >= 2` and an array `A[1..N]`, count the number of contiguous subarrays `A[l..r]` such that **every distinct integer** appearing in `A[l..r]` occurs a number of times divisible by `K`.',
      constraints: '1 <= N <= 3 * 10^5, 2 <= K <= N, 1 <= A[i] <= N',
      sampleInput: '6 2\n1 2 1 2 3 3',
      sampleOutput: '3',
      hints: [
        'For each value `v in [1..N]`, assign a dual 64-bit random Zobrist vector `(w1[v], w2[v])`. Maintain per-value count modulo `K`: `cnt[v]`.',
        'Whenever `v = A[i]` arrives: compute `oldC = cnt[v]`, `newC = (oldC + 1) % K`, and update the running signature `h1 += (uint64_t)(newC - oldC) * w1[v]`, `h2 += (uint64_t)(newC - oldC) * w2[v]` (which adds `+w[v]` cleanly when `cnt` increases, and subtracts `(K - 1) * w[v]` when `cnt` wraps back to `0`!). Two prefixes `l-1` and `r` have identical `cnt[v] % K` for ALL `v` simultaneously iff `(h1[l-1], h2[l-1]) == (h1[r], h2[r])`!',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

static uint64_t splitmix64(uint64_t x) {
    x += 0x9e3779b97f4a7c15ULL;
    x = (x ^ (x >> 30)) * 0xbf58476d1ce4e5b9ULL;
    x = (x ^ (x >> 27)) * 0x94d049bb133111ebULL;
    return x ^ (x >> 31);
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, k;
    if (!(cin >> n >> k)) return 0;

    uint64_t s1 = chrono::steady_clock::now().time_since_epoch().count() ^ 0x6a09e667f3bcc908ULL;
    uint64_t s2 = s1 ^ 0xbb67ae8584caa73bULL;

    vector<uint64_t> w1(n + 1), w2(n + 1);
    for (int v = 1; v <= n; v++) {
        w1[v] = splitmix64((uint64_t)v ^ s1);
        w2[v] = splitmix64((uint64_t)v ^ s2);
    }

    struct PairHash {
        size_t operator()(const pair<uint64_t, uint64_t>& p) const {
            return (size_t)(p.first ^ splitmix64(p.second));
        }
    };

    vector<int> cnt(n + 1, 0);
    unordered_map<pair<uint64_t, uint64_t>, long long, PairHash> freq;
    freq.reserve(n + 1);

    uint64_t h1 = 0, h2 = 0;
    freq[{0, 0}] = 1;
    long long ans = 0;

    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        int oldC = cnt[x];
        int newC = (oldC + 1) % k;
        cnt[x] = newC;
        uint64_t delta = (uint64_t)(newC - oldC); // wraps unsigned cleanly by two's complement
        h1 += delta * w1[x];
        h2 += delta * w2[x];
        ans += freq[{h1, h2}]++;
    }
    cout << ans << "\\n";
    return 0;
}`,
        rust: `use std::collections::HashMap;
use std::io::{self, Read};
use std::time::{SystemTime, UNIX_EPOCH};

fn splitmix64(mut x: u64) -> u64 {
    x = x.wrapping_add(0x9e37_79b9_7f4a_7c15);
    x = (x ^ (x >> 30)).wrapping_mul(0xbf58_476d_1ce4_e5b9);
    x = (x ^ (x >> 27)).wrapping_mul(0x94d0_49bb_1331_11eb);
    x ^ (x >> 31)
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let n: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };
    let k: i64 = it.next().unwrap().parse().unwrap();

    let nanos = SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_nanos() as u64;
    let s1 = nanos ^ 0x6a09_e667_f3bc_c908;
    let s2 = s1 ^ 0xbb67_ae85_84ca_a73b;

    let mut w1 = vec![0u64; n + 1];
    let mut w2 = vec![0u64; n + 1];
    for v in 1..=n {
        w1[v] = splitmix64(v as u64 ^ s1);
        w2[v] = splitmix64(v as u64 ^ s2);
    }

    let mut cnt = vec![0i64; n + 1];
    let mut freq: HashMap<(u64, u64), i64> = HashMap::with_capacity(n + 1);
    freq.insert((0, 0), 1);

    let mut h1 = 0u64;
    let mut h2 = 0u64;
    let mut ans = 0i64;

    for _ in 0..n {
        let x: usize = it.next().unwrap().parse().unwrap();
        let old_c = cnt[x];
        let new_c = (old_c + 1) % k;
        cnt[x] = new_c;
        let delta = (new_c - old_c) as i64 as u64;
        h1 = h1.wrapping_add(delta.wrapping_mul(w1[x]));
        h2 = h2.wrapping_add(delta.wrapping_mul(w2[x]));
        let entry = freq.entry((h1, h2)).or_insert(0);
        ans += *entry;
        *entry += 1;
    }
    println!("{}", ans);
}`,
        java21: `import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;

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

    static long splitmix64(long x) {
        x += 0x9e3779b97f4a7c15L;
        x = (x ^ (x >>> 30)) * 0xbf58476d1ce4e5b9L;
        x = (x ^ (x >>> 27)) * 0x94d049bb133111ebL;
        return x ^ (x >>> 31);
    }

    record Sig(long h1, long h2) {}

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        int n = fs.nextInt();
        if (n == -1) return;
        int k = fs.nextInt();

        long s1 = System.nanoTime() ^ 0x6a09e667f3bcc908L;
        long s2 = s1 ^ 0xbb67ae8584caa73bL;
        long[] w1 = new long[n + 1], w2 = new long[n + 1];
        for (int v = 1; v <= n; v++) {
            w1[v] = splitmix64(v ^ s1);
            w2[v] = splitmix64(v ^ s2);
        }

        int[] cnt = new int[n + 1];
        HashMap<Sig, Integer> freq = new HashMap<>(n * 2);
        freq.put(new Sig(0L, 0L), 1);

        long h1 = 0, h2 = 0, ans = 0;
        for (int i = 0; i < n; i++) {
            int x = fs.nextInt();
            int oldC = cnt[x];
            int newC = (oldC + 1) % k;
            cnt[x] = newC;
            long delta = newC - oldC;
            h1 += delta * w1[x];
            h2 += delta * w2[x];
            Sig sig = new Sig(h1, h2);
            int prev = freq.getOrDefault(sig, 0);
            ans += prev;
            freq.put(sig, prev + 1);
        }
        System.out.println(ans);
    }
}`,
        python3: `import random
import sys

sys.setrecursionlimit(200000)

MASK = (1 << 64) - 1

def splitmix64(x: int) -> int:
    x = (x + 0x9E3779B97F4A7C15) & MASK
    x = ((x ^ (x >> 30)) * 0xBF58476D1CE4E5B9) & MASK
    x = ((x ^ (x >> 27)) * 0x94D049BB133111EB) & MASK
    return x ^ (x >> 31)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    n = int(next(it))
    k = int(next(it))

    rng = random.SystemRandom()
    s1 = rng.getrandbits(64)
    s2 = rng.getrandbits(64)
    w1 = [splitmix64(v ^ s1) for v in range(n + 1)]
    w2 = [splitmix64(v ^ s2) for v in range(n + 1)]

    cnt = [0] * (n + 1)
    freq = {(0, 0): 1}
    h1 = 0
    h2 = 0
    ans = 0

    for _ in range(n):
        x = int(next(it))
        old_c = cnt[x]
        new_c = (old_c + 1) % k
        cnt[x] = new_c
        delta = new_c - old_c
        h1 = (h1 + delta * w1[x]) & MASK
        h2 = (h2 + delta * w2[x]) & MASK
        sig = (h1, h2)
        prev = freq.get(sig, 0)
        ans += prev
        freq[sig] = prev + 1

    sys.stdout.write(f"{ans}\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `require 'securerandom'

MASK = (1 << 64) - 1

def splitmix64(x)
  x = (x + 0x9e3779b97f4a7c15) & MASK
  x = ((x ^ (x >> 30)) * 0xbf58476d1ce4e5b9) & MASK
  x = ((x ^ (x >> 27)) * 0x94d049bb133111eb) & MASK
  x ^ (x >> 31)
end

tokens = $stdin.read.split
exit if tokens.empty?
idx = 0
n = tokens[idx].to_i; idx += 1
k = tokens[idx].to_i; idx += 1

s1 = SecureRandom.random_number(1 << 64)
s2 = SecureRandom.random_number(1 << 64)
w1 = Array.new(n + 1) { |v| splitmix64(v ^ s1) }
w2 = Array.new(n + 1) { |v| splitmix64(v ^ s2) }

cnt = Array.new(n + 1, 0)
freq = Hash.new(0)
freq[[0, 0]] = 1
h1 = 0
h2 = 0
ans = 0

n.times do
  x = tokens[idx].to_i; idx += 1
  old_c = cnt[x]
  new_c = (old_c + 1) % k
  cnt[x] = new_c
  delta = new_c - old_c
  h1 = (h1 + delta * w1[x]) & MASK
  h2 = (h2 + delta * w2[x]) & MASK
  sig = [h1, h2]
  prev = freq[sig]
  ans += prev
  freq[sig] = prev + 1
end
puts ans`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'Codeforces',
      title: 'Three Occurrences (1418G)',
      difficulty: '2500',
      url: 'https://codeforces.com/problemset/problem/1418/G',
      patternNote: 'Combine K=3 Zobrist frequency fingerprints with two-pointer count<=3 sliding window.',
    },
    {
      platform: 'Codeforces',
      title: 'Almost Sorted / Robin Hood Archery (2014H)',
      difficulty: '2100',
      url: 'https://codeforces.com/problemset/problem/2014/H',
      patternNote: 'Check if every element in subarray [l..r] has even frequency via O(1) Zobrist XOR query.',
    },
    {
      platform: 'AtCoder',
      title: 'ABC250 E — Prefix Equality',
      difficulty: '1550',
      url: 'https://atcoder.jp/contests/abc250/tasks/abc250_e',
      patternNote: 'Compare DISTINCT set equality of prefixes A[1..x] and B[1..y] using Zobrist XOR on first occurrences.',
    },
    {
      platform: 'CodeChef',
      title: 'Matrix Check / Freivalds Verification',
      difficulty: '1950',
      url: 'https://www.codechef.com/problems/CHEFMAT',
      patternNote: 'Apply Freivalds’ O(K * N^2) vector-matrix product test to certify A*B = C without O(N^3) TLE.',
    },
    {
      platform: 'HackerRank',
      title: 'Subarray Multiset / Equal Sets',
      difficulty: 'Hard',
      url: 'https://www.hackerrank.com/challenges',
      patternNote: 'Order-independent subarray matching in O(1) via dual splitmix64 sum + XOR.',
    },
    {
      platform: 'NeetCode 150',
      title: 'Valid Anagram / Group Anagrams (Large Scale)',
      difficulty: 'Medium -> Plat',
      url: 'https://neetcode.io/practice',
      patternNote: 'Generalize fixed-alphabet character counts to O(1) range multiset equality over 10^9-valued arrays.',
    },
  ],
  interviewNotes: [
    'Explain Zobrist XOR vs Sum cleanly: XOR collapses frequencies modulo 2 (so `{a, a}` vanishes to `0`—ideal for parity or set equality with a `seen` guard), whereas 64-bit Sum tracks full additive multiplicities without cancellation.',
    'Always seed random hashes with runtime clock entropy (`steady_clock` / `System.nanoTime()` / `SystemRandom`) in competitive rounds—deterministic seeds can be reverse-engineered and collided.',
    'Freivalds’ Algorithm is the cleanest real-world demonstration of Schwartz-Zippel: turning an `O(N^3)` verification barrier into `O(K * N^2)` with exponentially vanishing error `<= 2^{-K}` (or `P^{-K}` over field `F_p`).',
  ],
  projectBlueprint: {
    title: 'Distributed Cache State-Diff & Board-Game Transposition Table Engine',
    tagline:
      'High-speed state-fingerprinting toolkit providing order-independent O(1) Zobrist multiset parity checks, incremental board hashing, and O(K * N^2) Freivalds matrix integrity audits.',
    stackSummary: 'TypeScript / Node.js with BigUint64Array SplitMix64 Zobrist Kernel',
    asciiDiagram: `[Shard Updates (key, delta)] ---> [SplitMix64 128-bit Mixer] ---> [XOR Parity & Additive Sum]
                                                                          |
[Matrix Audit A * B == C] ------> [K Random Vector Probes r] ----------> [O(K * N^2) Verifier]`,
    milestones: [
      {
        id: 'm1',
        title: '128-Bit SplitMix64 Key Generator',
        detail: 'Generate runtime-seeded dual 64-bit random signatures resilient against birthday collisions.',
      },
      {
        id: 'm2',
        title: 'O(1) Incremental Multiset & Mod-K Hash',
        detail: 'Track unordered state equality and mod-K replica balance across distributed nodes.',
      },
      {
        id: 'm3',
        title: 'Freivalds Integrity Auditor',
        detail: 'Verify dense N x N linear transforms in O(K * N^2) with configurable error tolerance.',
      },
    ],
    starterCode: `const MASK64 = (1n << 64n) - 1n;

export function splitmix64(x: bigint): bigint {
  x = (x + 0x9e3779b97f4a7c15n) & MASK64;
  x = ((x ^ (x >> 30n)) * 0xbf58476d1ce4e5b9n) & MASK64;
  x = ((x ^ (x >> 27n)) * 0x94d049bb133111ebn) & MASK64;
  return x ^ (x >> 31n);
}

export class ZobristMultisetTable {
  private readonly seed1 = BigInt(Date.now()) ^ 0x517cc1b727220a95n;
  private readonly seed2 = this.seed1 ^ 0x9e3779b97f4a7c15n;

  public fingerprint(items: number[]): { sum1: bigint; sum2: bigint; xor1: bigint } {
    let sum1 = 0n;
    let sum2 = 0n;
    let xor1 = 0n;
    for (const v of items) {
      const bv = BigInt(v) & MASK64;
      const h1 = splitmix64(bv ^ this.seed1);
      const h2 = splitmix64(bv ^ this.seed2);
      sum1 = (sum1 + h1) & MASK64;
      sum2 = (sum2 + h2) & MASK64;
      xor1 ^= h1;
    }
    return { sum1, sum2, xor1 };
  }
}

const zmt = new ZobristMultisetTable();
const a = zmt.fingerprint([10, 20, 30, 20]);
const b = zmt.fingerprint([20, 30, 10, 20]);
console.log('Multisets identical:', a.sum1 === b.sum1 && a.sum2 === b.sum2 && a.xor1 === b.xor1);`,
  },
};
