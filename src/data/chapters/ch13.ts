import type { TheoryChapter } from '../../types/vault';

export const CH13_ROLLING_HASH: TheoryChapter = {
  slug: 'polynomial-rolling-hash',
  topicId: 'sg-61',
  title: 'Polynomial Rolling Hash & Anti-Birthday Double Hashing',
  domain: 'Strings & Geometry',
  ratingTier: '1400–1600',
  usacoDivision: 'Gold',
  subtitle:
    'Turn any substring S[l..r] into a pair of O(1)-comparable fingerprints using dual large prime moduli and randomized bases that defeat deterministic anti-hash hacks.',
  analogyTitle: 'The Base-B Rolling Odometer & Dual Tamper-Seal Analogy',
  analogyBody:
    'Think of a string `"abac"` as a giant base-B number, just like `1213` in base 10! If you precompute prefix values `H[i] = (H[i-1] * B + S[i]) mod M`, then asking for the fingerprint of any substring `S[l..r]` is identical to subtracting away the left digits: `(H[r] - H[l-1] * B^(r-l+1)) mod M`. That lets you compare ANY two substrings for equality in O(1) instead of O(N)! Wait—why two moduli instead of one? By the Birthday Paradox, comparing ~10^5 substrings under a single 32-bit prime `10^9 + 7` has roughly a 10^10 / (2 * 10^9) -> virtual 100% collision guarantee! Pairing TWO independent primes (`10^9 + 7` and `10^9 + 9`) expands the fingerprint space to ~10^18, while picking a random base `B` at runtime prevents Codeforces hackers from crafting Thue-Morse collision strings against a fixed base.',
  prerequisites: [
    {
      slug: 'modular-arithmetic-fermat-crt',
      title: 'Modular Arithmetic, Fermat & CRT',
    },
  ],
  traceTitle: 'Interactive Double Polynomial Prefix-Hash & O(1) Substring Extraction Trace',
  traceSubtitle:
    'Watch prefix hashes build left-to-right on S = "ababa", then extract H("aba") at [1..3] and [3..5] in O(1) to confirm exact equality.',
  allowDynamicGraphEdit: false,
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Step 1: Encode Characters & Precompute Powers of B (B1=131, M1=10^9+7)',
      explanation:
        'Map lowercase letters to 1..26 (a=1, b=2—never 0 so "a" != "aa"!). Precompute pow1[k] = 131^k mod 10^9+7 and pow2[k] = 137^k mod 10^9+9.',
      mode: 'array',
      arrays: [
        {
          name: 'String S[1..5] (val)',
          cells: [
            { index: 1, value: 'a(1)', highlight: 'neutral' },
            { index: 2, value: 'b(2)', highlight: 'neutral' },
            { index: 3, value: 'a(1)', highlight: 'neutral' },
            { index: 4, value: 'b(2)', highlight: 'neutral' },
            { index: 5, value: 'a(1)', highlight: 'neutral' },
          ],
        },
        {
          name: 'pow1[0..5] (B=131)',
          cells: [
            { index: 0, value: 1, highlight: 'neutral' },
            { index: 1, value: 131, highlight: 'neutral' },
            { index: 2, value: 17161, highlight: 'neutral' },
            { index: 3, value: 2248091, highlight: 'neutral' },
            { index: 4, value: 294499921, highlight: 'neutral' },
          ],
        },
      ],
      variables: { B1: 131, M1: 1000000007, B2: 137, M2: 1000000009 },
    },
    {
      stepNumber: 2,
      title: 'Step 2: Build Prefix Hash Array H1[0..5]',
      explanation:
        'H1[0]=0. H1[1]=1. H1[2]=1*131+2=133. H1[3]=133*131+1=17424. H1[4]=17424*131+2=2282546. H1[5]=2282546*131+1=299013527.',
      mode: 'array',
      arrays: [
        {
          name: 'Prefix Hash H1[0..5]',
          cells: [
            { index: 0, value: 0, label: 'empty', highlight: 'neutral' },
            { index: 1, value: 1, label: 'a', highlight: 'updated' },
            { index: 2, value: 133, label: 'ab', highlight: 'updated' },
            { index: 3, value: 17424, label: 'aba', highlight: 'updated' },
            { index: 4, value: 2282546, label: 'abab', highlight: 'updated' },
            { index: 5, value: 299013527, label: 'ababa', highlight: 'updated' },
          ],
        },
      ],
      variables: { Recurrence: 'H[i] = (H[i-1]*B + val[i]) % M', H1_3: 17424, H1_5: 299013527 },
    },
    {
      stepNumber: 3,
      title: 'Step 3: Extract Substring S[1..3] ("aba") in O(1)',
      explanation:
        'Length = 3 - 1 + 1 = 3. Substring hash = (H1[3] - H1[0] * pow1[3]) mod M1 = (17424 - 0 * 2248091) = 17424.',
      mode: 'array',
      arrays: [
        {
          name: 'Prefix Hash H1[0..5]',
          cells: [
            { index: 0, value: 0, label: 'l-1', highlight: 'active' },
            { index: 1, value: 1, highlight: 'window' },
            { index: 2, value: 133, highlight: 'window' },
            { index: 3, value: 17424, label: 'r', highlight: 'active' },
            { index: 4, value: 2282546, highlight: 'neutral' },
            { index: 5, value: 299013527, highlight: 'neutral' },
          ],
        },
      ],
      variables: { Substring: 'S[1..3] = "aba"', Len: 3, Hash1: 17424 },
    },
    {
      stepNumber: 4,
      title: 'Step 4: Extract S[3..5] ("aba") -> Exact Match 17424!',
      explanation:
        'H1(3..5) = (H1[5] - H1[2] * pow1[3]) mod M1 = (299013527 - 133 * 2248091) mod M1 = 299013527 - 298996103 = 17424! Matched in O(1).',
      mode: 'array',
      arrays: [
        {
          name: 'Prefix Hash H1[0..5]',
          cells: [
            { index: 0, value: 0, highlight: 'neutral' },
            { index: 1, value: 1, highlight: 'neutral' },
            { index: 2, value: 133, label: 'l-1', highlight: 'active' },
            { index: 3, value: 17424, highlight: 'window' },
            { index: 4, value: 2282546, highlight: 'window' },
            { index: 5, value: 299013527, label: 'r', highlight: 'active' },
          ],
        },
      ],
      variables: { 'H(1..3)': 17424, 'H(3..5)': 17424, Equal: 'true (both hashes match)' },
    },
  ],
  reductionClues: [
    {
      clue: '"Check whether substrings S[a..b] and S[c..d] are equal / palindromic across Q <= 1e5 queries"',
      translation: 'Precompute forward & reverse DoubleHash in O(N), compare (h1, h2) pairs in O(1) per query.',
    },
    {
      clue: '"Find longest common prefix (LCP) / compare two substrings lexicographically without suffix array"',
      translation: 'Binary search on length len in [0..minLen] checking Hash(s1, len) == Hash(s2, len), then compare first mismatching char.',
    },
    {
      clue: '"Find longest substring occurring >= K times / two strings share common substring of max length"',
      translation: 'Binary search on length L; slide window of length L across string(s), pack (h1, h2) into 64-bit integer and count frequencies.',
    },
    {
      clue: '"Minimal rotation / cyclic shift equivalence of strings"',
      translation: 'Double string S -> S + S and binary search LCP between candidate starting indices.',
    },
  ],
  timeComplexity: 'O(N) precomputation, O(1) substring hash query, O(log N) LCP / lex comparison',
  spaceComplexity: 'O(N)',
  pitfalls: [
    {
      type: 'WA',
      title: 'Single 32-Bit Hash Collisions (Birthday Paradox Hack)',
      detail:
        'Comparing N = 10^5 pairs of substrings with only one mod 10^9+7 hash produces >99% collision probability. Always use TWO distinct large prime moduli (or 64-bit Mersenne prime 2^61 - 1) packed into a pair/u64.',
    },
    {
      type: 'WA',
      title: 'Mapping First Alphabet Character to 0 Instead of 1',
      detail:
        'If \'a\' maps to 0, then `"a"`, `"aa"`, and `"aaa"` all evaluate to hash 0! Always offset characters (`c - \'a\' + 1` or raw ASCII `ord(c)`).',
    },
    {
      type: 'WA',
      title: 'Fixed Deterministic Base Hacked by Thue-Morse Tests',
      detail:
        'Using fixed `B = 31, M = 10^9+7` fails anti-hash challenge tests on Codeforces. Seed a random odd base `B > 256` from `chrono::steady_clock` / `Random` at runtime.',
    },
    {
      type: 'WA',
      title: 'Negative Remainder After Modulo Subtraction',
      detail:
        'In C++/Rust/Java, `(h[r] - h[l] * pow[r-l]) % MOD` can return a negative number! Always normalize via `((h[r] - h[l] * pow[len]) % MOD + MOD) % MOD`.',
    },
  ],
  implementations: {
    cpp20: `#include <bits/stdc++.h>
using namespace std;

struct DoubleHash {
    static constexpr long long M1 = 1'000'000'007LL;
    static constexpr long long M2 = 1'000'000'009LL;
    long long B1, B2;
    vector<long long> h1, h2, p1, p2;

    explicit DoubleHash(const string& s) {
        mt19937_64 rng(chrono::steady_clock::now().time_since_epoch().count());
        B1 = uniform_int_distribution<long long>(300, 1'000'000)(rng) | 1LL;
        B2 = uniform_int_distribution<long long>(300, 1'000'000)(rng) | 1LL;
        int n = (int)s.size();
        h1.assign(n + 1, 0);
        h2.assign(n + 1, 0);
        p1.assign(n + 1, 1);
        p2.assign(n + 1, 1);
        for (int i = 0; i < n; ++i) {
            long long c = (unsigned char)s[i] + 1;
            p1[i + 1] = p1[i] * B1 % M1;
            p2[i + 1] = p2[i] * B2 % M2;
            h1[i + 1] = (h1[i] * B1 + c) % M1;
            h2[i + 1] = (h2[i] * B2 + c) % M2;
        }
    }

    // 0-indexed half-open interval [l, r)
    uint64_t get(int l, int r) const {
        long long x1 = (h1[r] - h1[l] * p1[r - l] % M1 + M1) % M1;
        long long x2 = (h2[r] - h2[l] * p2[r - l] % M2 + M2) % M2;
        return (uint64_t(x1) << 32) | uint64_t(x2);
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    string s;
    int q;
    if (!(cin >> s >> q)) return 0;

    DoubleHash dh(s);
    while (q--) {
        int l1, r1, l2, r2; // 1-indexed inclusive queries
        cin >> l1 >> r1 >> l2 >> r2;
        bool same = (r1 - l1 == r2 - l2) && (dh.get(l1 - 1, r1) == dh.get(l2 - 1, r2));
        cout << (same ? "YES\\n" : "NO\\n");
    }
    return 0;
}`,
    rust: `use std::io::{self, Read};
use std::time::{SystemTime, UNIX_EPOCH};

struct DoubleHash {
    b1: u64,
    b2: u64,
    h1: Vec<u64>,
    h2: Vec<u64>,
    p1: Vec<u64>,
    p2: Vec<u64>,
}

impl DoubleHash {
    const M1: u64 = 1_000_000_007;
    const M2: u64 = 1_000_000_009;

    fn new(s: &[u8]) -> Self {
        let seed = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .map(|d| d.as_nanos() as u64)
            .unwrap_or(88172645463325252);
        let b1 = (seed % 500_000) + 313;
        let b2 = ((seed >> 17) % 500_000) + 911;
        let n = s.len();
        let mut h1 = vec![0u64; n + 1];
        let mut h2 = vec![0u64; n + 1];
        let mut p1 = vec![1u64; n + 1];
        let mut p2 = vec![1u64; n + 1];
        for i in 0..n {
            let c = (s[i] as u64) + 1;
            p1[i + 1] = p1[i] * b1 % Self::M1;
            p2[i + 1] = p2[i] * b2 % Self::M2;
            h1[i + 1] = (h1[i] * b1 + c) % Self::M1;
            h2[i + 1] = (h2[i] * b2 + c) % Self::M2;
        }
        Self { b1, b2, h1, h2, p1, p2 }
    }

    fn get(&self, l: usize, r: usize) -> u64 {
        let x1 = (self.h1[r] + Self::M1 - (self.h1[l] * self.p1[r - l]) % Self::M1) % Self::M1;
        let x2 = (self.h2[r] + Self::M2 - (self.h2[l] * self.p2[r - l]) % Self::M2) % Self::M2;
        (x1 << 32) | x2
    }
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let s = match it.next() {
        Some(v) => v.as_bytes(),
        None => return,
    };
    let q: usize = it.next().unwrap().parse().unwrap();
    let dh = DoubleHash::new(s);
    let _ = (dh.b1, dh.b2);
    let mut out = String::new();
    for _ in 0..q {
        let l1: usize = it.next().unwrap().parse().unwrap();
        let r1: usize = it.next().unwrap().parse().unwrap();
        let l2: usize = it.next().unwrap().parse().unwrap();
        let r2: usize = it.next().unwrap().parse().unwrap();
        if r1 - l1 == r2 - l2 && dh.get(l1 - 1, r1) == dh.get(l2 - 1, r2) {
            out.push_str("YES\\n");
        } else {
            out.push_str("NO\\n");
        }
    }
    print!("{}", out);
}`,
    java21: `import java.io.IOException;
import java.io.InputStream;
import java.util.Random;

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

        String nextToken() throws IOException {
            int c;
            while ((c = readByte()) <= 32) {
                if (c == -1) return null;
            }
            StringBuilder sb = new StringBuilder();
            while (c > 32) {
                sb.append((char) c);
                c = readByte();
            }
            return sb.toString();
        }

        int nextInt() throws IOException { return Integer.parseInt(nextToken()); }
    }

    static class DoubleHash {
        static final long M1 = 1_000_000_007L;
        static final long M2 = 1_000_000_009L;
        final long[] h1, h2, p1, p2;

        DoubleHash(String s) {
            Random rng = new Random(System.nanoTime());
            long b1 = 301 + rng.nextInt(500_000) * 2L;
            long b2 = 701 + rng.nextInt(500_000) * 2L;
            int n = s.length();
            h1 = new long[n + 1];
            h2 = new long[n + 1];
            p1 = new long[n + 1];
            p2 = new long[n + 1];
            p1[0] = p2[0] = 1L;
            for (int i = 0; i < n; i++) {
                long c = s.charAt(i) + 1L;
                p1[i + 1] = p1[i] * b1 % M1;
                p2[i + 1] = p2[i] * b2 % M2;
                h1[i + 1] = (h1[i] * b1 + c) % M1;
                h2[i + 1] = (h2[i] * b2 + c) % M2;
            }
        }

        long get(int l, int r) {
            long x1 = (h1[r] - h1[l] * p1[r - l] % M1 + M1) % M1;
            long x2 = (h2[r] - h2[l] * p2[r - l] % M2 + M2) % M2;
            return (x1 << 32) | x2;
        }
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        String s = fs.nextToken();
        if (s == null) return;
        int q = fs.nextInt();
        DoubleHash dh = new DoubleHash(s);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < q; i++) {
            int l1 = fs.nextInt(), r1 = fs.nextInt();
            int l2 = fs.nextInt(), r2 = fs.nextInt();
            boolean ok = (r1 - l1 == r2 - l2) && (dh.get(l1 - 1, r1) == dh.get(l2 - 1, r2));
            sb.append(ok ? "YES\\n" : "NO\\n");
        }
        System.out.print(sb);
    }
}`,
    python3: `import random
import sys

class DoubleHash:
    M1 = 1_000_000_007
    M2 = 1_000_000_009

    def __init__(self, s: bytes) -> None:
        b1 = random.randrange(301, 1_000_000, 2)
        b2 = random.randrange(301, 1_000_000, 2)
        n = len(s)
        h1 = [0] * (n + 1)
        h2 = [0] * (n + 1)
        p1 = [1] * (n + 1)
        p2 = [1] * (n + 1)
        m1, m2 = self.M1, self.M2
        for i, ch in enumerate(s):
            c = ch + 1
            p1[i + 1] = p1[i] * b1 % m1
            p2[i + 1] = p2[i] * b2 % m2
            h1[i + 1] = (h1[i] * b1 + c) % m1
            h2[i + 1] = (h2[i] * b2 + c) % m2
        self.h1, self.h2, self.p1, self.p2 = h1, h2, p1, p2

    def get(self, l: int, r: int) -> int:
        x1 = (self.h1[r] - self.h1[l] * self.p1[r - l]) % self.M1
        x2 = (self.h2[r] - self.h2[l] * self.p2[r - l]) % self.M2
        return (x1 << 32) | x2

def solve() -> None:
    data = sys.stdin.buffer.read().split()
    if not data:
        return
    s = data[0]
    q = int(data[1])
    dh = DoubleHash(s)
    out = []
    idx = 2
    for _ in range(q):
        l1 = int(data[idx]); r1 = int(data[idx + 1])
        l2 = int(data[idx + 2]); r2 = int(data[idx + 3])
        idx += 4
        ok = (r1 - l1 == r2 - l2) and (dh.get(l1 - 1, r1) == dh.get(l2 - 1, r2))
        out.append("YES" if ok else "NO")
    sys.stdout.write("\\n".join(out) + "\\n")

if __name__ == "__main__":
    solve()`,
    ruby: `class DoubleHash
  M1 = 1_000_000_007
  M2 = 1_000_000_009

  def initialize(s)
    b1 = rand(300..999_999) | 1
    b2 = rand(300..999_999) | 1
    n = s.bytesize
    @h1 = Array.new(n + 1, 0)
    @h2 = Array.new(n + 1, 0)
    @p1 = Array.new(n + 1, 1)
    @p2 = Array.new(n + 1, 1)
    s.each_byte.with_index do |ch, i|
      c = ch + 1
      @p1[i + 1] = (@p1[i] * b1) % M1
      @p2[i + 1] = (@p2[i] * b2) % M2
      @h1[i + 1] = (@h1[i] * b1 + c) % M1
      @h2[i + 1] = (@h2[i] * b2 + c) % M2
    end
  end

  def get(l, r)
    x1 = (@h1[r] - @h1[l] * @p1[r - l]) % M1
    x2 = (@h2[r] - @h2[l] * @p2[r - l]) % M2
    (x1 << 32) | x2
  end
end

toks = STDIN.read.split
exit if toks.empty?
s = toks[0]
q = toks[1].to_i
dh = DoubleHash.new(s)
idx = 2
out = []
q.times do
  l1 = toks[idx].to_i; r1 = toks[idx + 1].to_i
  l2 = toks[idx + 2].to_i; r2 = toks[idx + 3].to_i
  idx += 4
  ok = (r1 - l1 == r2 - l2) && (dh.get(l1 - 1, r1) == dh.get(l2 - 1, r2))
  out << (ok ? "YES" : "NO")
end
puts out.join("\\n")`,
  },
  practiceProblems: [
    {
      id: 'sg61-p1',
      tier: 'Warmup',
      ratingRange: '1200–1400',
      title: 'String Matching (Rabin-Karp Pattern Count)',
      statement:
        'Given a text string T and a pattern string P, count the exact number of occurrences of P inside T using O(1) sliding double hashes.',
      constraints: '1 <= |T|, |P| <= 10^6, lowercase English letters.',
      sampleInput: `saippuakauppias
pp`,
      sampleOutput: `2`,
      hints: [
        'Compute the full DoubleHash of pattern P (1 value) and prefix DoubleHash of text T.',
        'Slide i from 0 to |T| - |P| and increment answer whenever T.get(i, i + |P|) == patHash.',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    string t, p;
    if (!(cin >> t >> p)) return 0;
    int n = (int)t.size(), m = (int)p.size();
    if (m > n) { cout << 0 << '\\n'; return 0; }
    const long long M1 = 1'000'000'007LL, M2 = 1'000'000'009LL;
    mt19937_64 rng(chrono::steady_clock::now().time_since_epoch().count());
    long long B1 = uniform_int_distribution<long long>(300, 1'000'000)(rng) | 1LL;
    long long B2 = uniform_int_distribution<long long>(300, 1'000'000)(rng) | 1LL;

    long long ph1 = 0, ph2 = 0, pw1 = 1, pw2 = 1;
    for (int i = 0; i < m; ++i) {
        long long c = (unsigned char)p[i] + 1;
        ph1 = (ph1 * B1 + c) % M1;
        ph2 = (ph2 * B2 + c) % M2;
        pw1 = pw1 * B1 % M1;
        pw2 = pw2 * B2 % M2;
    }
    vector<long long> h1(n + 1, 0), h2(n + 1, 0);
    for (int i = 0; i < n; ++i) {
        long long c = (unsigned char)t[i] + 1;
        h1[i + 1] = (h1[i] * B1 + c) % M1;
        h2[i + 1] = (h2[i] * B2 + c) % M2;
    }
    int ans = 0;
    for (int i = 0; i + m <= n; ++i) {
        long long x1 = (h1[i + m] - h1[i] * pw1 % M1 + M1) % M1;
        long long x2 = (h2[i + m] - h2[i] * pw2 % M2 + M2) % M2;
        if (x1 == ph1 && x2 == ph2) ans++;
    }
    cout << ans << '\\n';
    return 0;
}`,
        rust: `use std::io::{self, Read};
use std::time::{SystemTime, UNIX_EPOCH};

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let t = match it.next() { Some(x) => x.as_bytes(), None => return };
    let p = it.next().unwrap().as_bytes();
    let (n, m) = (t.len(), p.len());
    if m > n { println!("0"); return; }
    const M1: u64 = 1_000_000_007;
    const M2: u64 = 1_000_000_009;
    let seed = SystemTime::now().duration_since(UNIX_EPOCH).map(|d| d.as_nanos() as u64).unwrap_or(998244353);
    let b1 = (seed % 500_000) + 313;
    let b2 = ((seed >> 16) % 500_000) + 719;
    let (mut ph1, mut ph2, mut pw1, mut pw2) = (0u64, 0u64, 1u64, 1u64);
    for &ch in p {
        let c = (ch as u64) + 1;
        ph1 = (ph1 * b1 + c) % M1; ph2 = (ph2 * b2 + c) % M2;
        pw1 = pw1 * b1 % M1; pw2 = pw2 * b2 % M2;
    }
    let mut h1 = vec![0u64; n + 1];
    let mut h2 = vec![0u64; n + 1];
    for i in 0..n {
        let c = (t[i] as u64) + 1;
        h1[i + 1] = (h1[i] * b1 + c) % M1;
        h2[i + 1] = (h2[i] * b2 + c) % M2;
    }
    let mut ans = 0usize;
    for i in 0..=n - m {
        let x1 = (h1[i + m] + M1 - (h1[i] * pw1) % M1) % M1;
        let x2 = (h2[i + m] + M2 - (h2[i] * pw2) % M2) % M2;
        if x1 == ph1 && x2 == ph2 { ans += 1; }
    }
    println!("{}", ans);
}`,
        java21: `import java.io.*;
import java.util.Random;

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

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        String t = fs.nextToken(); if (t == null) return;
        String p = fs.nextToken();
        int n = t.length(), m = p.length();
        if (m > n) { System.out.println(0); return; }
        final long M1 = 1_000_000_007L, M2 = 1_000_000_009L;
        Random rng = new Random(System.nanoTime());
        long b1 = 301 + rng.nextInt(500_000) * 2L, b2 = 701 + rng.nextInt(500_000) * 2L;
        long ph1 = 0, ph2 = 0, pw1 = 1, pw2 = 1;
        for (int i = 0; i < m; i++) {
            long c = p.charAt(i) + 1L;
            ph1 = (ph1 * b1 + c) % M1; ph2 = (ph2 * b2 + c) % M2;
            pw1 = pw1 * b1 % M1; pw2 = pw2 * b2 % M2;
        }
        long[] h1 = new long[n + 1], h2 = new long[n + 1];
        for (int i = 0; i < n; i++) {
            long c = t.charAt(i) + 1L;
            h1[i + 1] = (h1[i] * b1 + c) % M1;
            h2[i + 1] = (h2[i] * b2 + c) % M2;
        }
        int ans = 0;
        for (int i = 0; i + m <= n; i++) {
            long x1 = (h1[i + m] - h1[i] * pw1 % M1 + M1) % M1;
            long x2 = (h2[i + m] - h2[i] * pw2 % M2 + M2) % M2;
            if (x1 == ph1 && x2 == ph2) ans++;
        }
        System.out.println(ans);
    }
}`,
        python3: `import random, sys
def solve():
    data = sys.stdin.buffer.read().split()
    if not data: return
    t, p = data[0], data[1]
    n, m = len(t), len(p)
    if m > n: print(0); return
    M1, M2 = 1_000_000_007, 1_000_000_009
    b1 = random.randrange(301, 1_000_000, 2)
    b2 = random.randrange(301, 1_000_000, 2)
    ph1 = ph2 = 0
    for ch in p:
        c = ch + 1
        ph1 = (ph1 * b1 + c) % M1; ph2 = (ph2 * b2 + c) % M2
    pw1 = pow(b1, m, M1); pw2 = pow(b2, m, M2)
    h1 = [0] * (n + 1); h2 = [0] * (n + 1)
    for i, ch in enumerate(t):
        c = ch + 1
        h1[i + 1] = (h1[i] * b1 + c) % M1; h2[i + 1] = (h2[i] * b2 + c) % M2
    ans = 0
    for i in range(n - m + 1):
        if (h1[i + m] - h1[i] * pw1) % M1 == ph1 and (h2[i + m] - h2[i] * pw2) % M2 == ph2:
            ans += 1
    print(ans)
if __name__ == "__main__":
    solve()`,
        ruby: `toks = STDIN.read.split
exit if toks.empty?
t = toks[0]; p = toks[1]
n = t.bytesize; m = p.bytesize
if m > n; puts 0; exit; end
M1 = 1_000_000_007; M2 = 1_000_000_009
b1 = rand(300..999_999) | 1; b2 = rand(300..999_999) | 1
ph1 = 0; ph2 = 0; pw1 = 1; pw2 = 1
p.each_byte do |ch|
  c = ch + 1
  ph1 = (ph1 * b1 + c) % M1; ph2 = (ph2 * b2 + c) % M2
  pw1 = (pw1 * b1) % M1; pw2 = (pw2 * b2) % M2
end
h1 = Array.new(n + 1, 0); h2 = Array.new(n + 1, 0)
t.each_byte.with_index do |ch, i|
  c = ch + 1
  h1[i + 1] = (h1[i] * b1 + c) % M1; h2[i + 1] = (h2[i] * b2 + c) % M2
end
ans = 0
(0..n - m).each do |i|
  x1 = (h1[i + m] - h1[i] * pw1) % M1
  x2 = (h2[i + m] - h2[i] * pw2) % M2
  ans += 1 if x1 == ph1 && x2 == ph2
end
puts ans`,
      },
    },
    {
      id: 'sg61-p2',
      tier: 'Standard',
      ratingRange: '1400–1550',
      title: 'Finding Borders (All Prefix-Suffix Lengths)',
      statement:
        'A border of string S is a proper non-empty prefix that is simultaneously a suffix of S. Print all border lengths of S in strictly increasing order.',
      constraints: '1 <= |S| <= 10^6.',
      sampleInput: `abcababcab`,
      sampleOutput: `2 5`,
      hints: [
        'For every length L from 1 to |S| - 1, compare prefix S[0..L) against suffix S[N-L..N).',
        'DoubleHash answers each length check in O(1), solving the entire problem in O(N).',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    string s;
    if (!(cin >> s)) return 0;
    int n = (int)s.size();
    const long long M1 = 1'000'000'007LL, M2 = 1'000'000'009LL;
    mt19937_64 rng(chrono::steady_clock::now().time_since_epoch().count());
    long long B1 = uniform_int_distribution<long long>(300, 1'000'000)(rng) | 1LL;
    long long B2 = uniform_int_distribution<long long>(300, 1'000'000)(rng) | 1LL;

    vector<long long> h1(n + 1, 0), h2(n + 1, 0), p1(n + 1, 1), p2(n + 1, 1);
    for (int i = 0; i < n; ++i) {
        long long c = (unsigned char)s[i] + 1;
        p1[i + 1] = p1[i] * B1 % M1;
        p2[i + 1] = p2[i] * B2 % M2;
        h1[i + 1] = (h1[i] * B1 + c) % M1;
        h2[i + 1] = (h2[i] * B2 + c) % M2;
    }
    vector<int> out;
    for (int len = 1; len < n; ++len) {
        long long suf1 = (h1[n] - h1[n - len] * p1[len] % M1 + M1) % M1;
        long long suf2 = (h2[n] - h2[n - len] * p2[len] % M2 + M2) % M2;
        if (h1[len] == suf1 && h2[len] == suf2) out.push_back(len);
    }
    for (size_t i = 0; i < out.size(); ++i)
        cout << out[i] << (i + 1 == out.size() ? "" : " ");
    cout << '\\n';
    return 0;
}`,
        rust: `use std::io::{self, Read};
use std::time::{SystemTime, UNIX_EPOCH};

fn main() {
    let mut s_in = String::new();
    io::stdin().read_to_string(&mut s_in).unwrap();
    let s = match s_in.split_whitespace().next() { Some(x) => x.as_bytes(), None => return };
    let n = s.len();
    const M1: u64 = 1_000_000_007;
    const M2: u64 = 1_000_000_009;
    let seed = SystemTime::now().duration_since(UNIX_EPOCH).map(|d| d.as_nanos() as u64).unwrap_or(1234567);
    let b1 = (seed % 500_000) + 313;
    let b2 = ((seed >> 16) % 500_000) + 719;
    let mut h1 = vec![0u64; n + 1];
    let mut h2 = vec![0u64; n + 1];
    let mut p1 = vec![1u64; n + 1];
    let mut p2 = vec![1u64; n + 1];
    for i in 0..n {
        let c = (s[i] as u64) + 1;
        p1[i + 1] = p1[i] * b1 % M1; p2[i + 1] = p2[i] * b2 % M2;
        h1[i + 1] = (h1[i] * b1 + c) % M1; h2[i + 1] = (h2[i] * b2 + c) % M2;
    }
    let mut out = Vec::new();
    for len in 1..n {
        let suf1 = (h1[n] + M1 - (h1[n - len] * p1[len]) % M1) % M1;
        let suf2 = (h2[n] + M2 - (h2[n - len] * p2[len]) % M2) % M2;
        if h1[len] == suf1 && h2[len] == suf2 { out.push(len.to_string()); }
    }
    println!("{}", out.join(" "));
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
        String nextToken() throws IOException {
            int c; while ((c = read()) <= 32) if (c == -1) return null;
            StringBuilder sb = new StringBuilder();
            while (c > 32) { sb.append((char) c); c = read(); }
            return sb.toString();
        }
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        String s = fs.nextToken(); if (s == null) return;
        int n = s.length();
        final long M1 = 1_000_000_007L, M2 = 1_000_000_009L;
        Random rng = new Random(System.nanoTime());
        long b1 = 301 + rng.nextInt(500_000) * 2L, b2 = 701 + rng.nextInt(500_000) * 2L;
        long[] h1 = new long[n + 1], h2 = new long[n + 1], p1 = new long[n + 1], p2 = new long[n + 1];
        p1[0] = p2[0] = 1L;
        for (int i = 0; i < n; i++) {
            long c = s.charAt(i) + 1L;
            p1[i + 1] = p1[i] * b1 % M1; p2[i + 1] = p2[i] * b2 % M2;
            h1[i + 1] = (h1[i] * b1 + c) % M1; h2[i + 1] = (h2[i] * b2 + c) % M2;
        }
        StringBuilder sb = new StringBuilder();
        for (int len = 1; len < n; len++) {
            long suf1 = (h1[n] - h1[n - len] * p1[len] % M1 + M1) % M1;
            long suf2 = (h2[n] - h2[n - len] * p2[len] % M2 + M2) % M2;
            if (h1[len] == suf1 && h2[len] == suf2) {
                if (sb.length() > 0) sb.append(' ');
                sb.append(len);
            }
        }
        System.out.println(sb);
    }
}`,
        python3: `import random, sys
def solve():
    data = sys.stdin.buffer.read().split()
    if not data: return
    s = data[0]; n = len(s)
    M1, M2 = 1_000_000_007, 1_000_000_009
    b1 = random.randrange(301, 1_000_000, 2)
    b2 = random.randrange(301, 1_000_000, 2)
    h1 = [0] * (n + 1); h2 = [0] * (n + 1)
    p1 = [1] * (n + 1); p2 = [1] * (n + 1)
    for i, ch in enumerate(s):
        c = ch + 1
        p1[i + 1] = p1[i] * b1 % M1; p2[i + 1] = p2[i] * b2 % M2
        h1[i + 1] = (h1[i] * b1 + c) % M1; h2[i + 1] = (h2[i] * b2 + c) % M2
    out = []
    for ln in range(1, n):
        if h1[ln] == (h1[n] - h1[n - ln] * p1[ln]) % M1 and h2[ln] == (h2[n] - h2[n - ln] * p2[ln]) % M2:
            out.append(str(ln))
    sys.stdout.write(" ".join(out) + "\\n")
if __name__ == "__main__":
    solve()`,
        ruby: `toks = STDIN.read.split
exit if toks.empty?
s = toks[0]; n = s.bytesize
M1 = 1_000_000_007; M2 = 1_000_000_009
b1 = rand(300..999_999) | 1; b2 = rand(300..999_999) | 1
h1 = Array.new(n + 1, 0); h2 = Array.new(n + 1, 0)
p1 = Array.new(n + 1, 1); p2 = Array.new(n + 1, 1)
s.each_byte.with_index do |ch, i|
  c = ch + 1
  p1[i + 1] = (p1[i] * b1) % M1; p2[i + 1] = (p2[i] * b2) % M2
  h1[i + 1] = (h1[i] * b1 + c) % M1; h2[i + 1] = (h2[i] * b2 + c) % M2
end
out = []
(1...n).each do |ln|
  suf1 = (h1[n] - h1[n - ln] * p1[ln]) % M1
  suf2 = (h2[n] - h2[n - ln] * p2[ln]) % M2
  out << ln if h1[ln] == suf1 && h2[ln] == suf2
end
puts out.join(" ")`,
      },
    },
    {
      id: 'sg61-p3',
      tier: 'Boss',
      ratingRange: '1650–1850',
      title: 'Minimal Cyclic Rotation (Double Hash + Binary Search LCP)',
      statement:
        'A rotation of string S is obtained by moving its first character to the end zero or more times. Find the lexicographically smallest rotation of S in O(N log N) time.',
      constraints: '1 <= |S| <= 10^6, lowercase English letters.',
      sampleInput: `acab`,
      sampleOutput: `abac`,
      hints: [
        'Concatenate S + S (length 2N) so every rotation corresponds to a contiguous window of length N starting at index i in [0..N-1].',
        'Maintain the current `best` start index and compare it against candidate `i` in O(log N) by binary-searching their Longest Common Prefix (LCP) via DoubleHash, then comparing `S2[best + lcp]` vs `S2[i + lcp]`.',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    string s;
    if (!(cin >> s)) return 0;
    int n = (int)s.size();
    string t = s + s;
    const long long M1 = 1'000'000'007LL, M2 = 1'000'000'009LL;
    mt19937_64 rng(chrono::steady_clock::now().time_since_epoch().count());
    long long B1 = uniform_int_distribution<long long>(300, 1'000'000)(rng) | 1LL;
    long long B2 = uniform_int_distribution<long long>(300, 1'000'000)(rng) | 1LL;

    vector<long long> h1(2 * n + 1, 0), h2(2 * n + 1, 0), p1(2 * n + 1, 1), p2(2 * n + 1, 1);
    for (int i = 0; i < 2 * n; ++i) {
        long long c = (unsigned char)t[i] + 1;
        p1[i + 1] = p1[i] * B1 % M1;
        p2[i + 1] = p2[i] * B2 % M2;
        h1[i + 1] = (h1[i] * B1 + c) % M1;
        h2[i + 1] = (h2[i] * B2 + c) % M2;
    }
    auto eq = [&](int a, int b, int len) {
        long long x1 = (h1[a + len] - h1[a] * p1[len] % M1 + M1) % M1;
        long long y1 = (h1[b + len] - h1[b] * p1[len] % M1 + M1) % M1;
        if (x1 != y1) return false;
        long long x2 = (h2[a + len] - h2[a] * p2[len] % M2 + M2) % M2;
        long long y2 = (h2[b + len] - h2[b] * p2[len] % M2 + M2) % M2;
        return x2 == y2;
    };

    int best = 0;
    for (int i = 1; i < n; ++i) {
        if (t[i] != t[best]) {
            if (t[i] < t[best]) best = i;
            continue;
        }
        int lo = 1, hi = n, lcp = 0;
        while (lo <= hi) {
            int mid = (lo + hi) >> 1;
            if (eq(best, i, mid)) { lcp = mid; lo = mid + 1; }
            else hi = mid - 1;
        }
        if (lcp < n && t[i + lcp] < t[best + lcp]) best = i;
    }
    cout << t.substr(best, n) << '\\n';
    return 0;
}`,
        rust: `use std::io::{self, Read};
use std::time::{SystemTime, UNIX_EPOCH};

fn main() {
    let mut s_in = String::new();
    io::stdin().read_to_string(&mut s_in).unwrap();
    let s_str = match s_in.split_whitespace().next() { Some(x) => x, None => return };
    let n = s_str.len();
    let mut t = Vec::with_capacity(2 * n);
    t.extend_from_slice(s_str.as_bytes());
    t.extend_from_slice(s_str.as_bytes());

    const M1: u64 = 1_000_000_007;
    const M2: u64 = 1_000_000_009;
    let seed = SystemTime::now().duration_since(UNIX_EPOCH).map(|d| d.as_nanos() as u64).unwrap_or(7777777);
    let b1 = (seed % 500_000) + 313;
    let b2 = ((seed >> 16) % 500_000) + 719;
    let mut h1 = vec![0u64; 2 * n + 1];
    let mut h2 = vec![0u64; 2 * n + 1];
    let mut p1 = vec![1u64; 2 * n + 1];
    let mut p2 = vec![1u64; 2 * n + 1];
    for i in 0..2 * n {
        let c = (t[i] as u64) + 1;
        p1[i + 1] = p1[i] * b1 % M1; p2[i + 1] = p2[i] * b2 % M2;
        h1[i + 1] = (h1[i] * b1 + c) % M1; h2[i + 1] = (h2[i] * b2 + c) % M2;
    }
    let eq = |a: usize, b: usize, len: usize| -> bool {
        let x1 = (h1[a + len] + M1 - (h1[a] * p1[len]) % M1) % M1;
        let y1 = (h1[b + len] + M1 - (h1[b] * p1[len]) % M1) % M1;
        if x1 != y1 { return false; }
        let x2 = (h2[a + len] + M2 - (h2[a] * p2[len]) % M2) % M2;
        let y2 = (h2[b + len] + M2 - (h2[b] * p2[len]) % M2) % M2;
        x2 == y2
    };

    let mut best = 0usize;
    for i in 1..n {
        if t[i] != t[best] {
            if t[i] < t[best] { best = i; }
            continue;
        }
        let (mut lo, mut hi, mut lcp) = (1usize, n, 0usize);
        while lo <= hi {
            let mid = (lo + hi) >> 1;
            if eq(best, i, mid) { lcp = mid; lo = mid + 1; } else { hi = mid - 1; }
        }
        if lcp < n && t[i + lcp] < t[best + lcp] { best = i; }
    }
    println!("{}", std::str::from_utf8(&t[best..best + n]).unwrap());
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
        String nextToken() throws IOException {
            int c; while ((c = read()) <= 32) if (c == -1) return null;
            StringBuilder sb = new StringBuilder();
            while (c > 32) { sb.append((char) c); c = read(); }
            return sb.toString();
        }
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        String s = fs.nextToken(); if (s == null) return;
        int n = s.length();
        String t = s + s;
        final long M1 = 1_000_000_007L, M2 = 1_000_000_009L;
        Random rng = new Random(System.nanoTime());
        long b1 = 301 + rng.nextInt(500_000) * 2L, b2 = 701 + rng.nextInt(500_000) * 2L;
        long[] h1 = new long[2 * n + 1], h2 = new long[2 * n + 1], p1 = new long[2 * n + 1], p2 = new long[2 * n + 1];
        p1[0] = p2[0] = 1L;
        for (int i = 0; i < 2 * n; i++) {
            long c = t.charAt(i) + 1L;
            p1[i + 1] = p1[i] * b1 % M1; p2[i + 1] = p2[i] * b2 % M2;
            h1[i + 1] = (h1[i] * b1 + c) % M1; h2[i + 1] = (h2[i] * b2 + c) % M2;
        }
        int best = 0;
        for (int i = 1; i < n; i++) {
            if (t.charAt(i) != t.charAt(best)) {
                if (t.charAt(i) < t.charAt(best)) best = i;
                continue;
            }
            int lo = 1, hi = n, lcp = 0;
            while (lo <= hi) {
                int mid = (lo + hi) >>> 1;
                long x1 = (h1[best + mid] - h1[best] * p1[mid] % M1 + M1) % M1;
                long y1 = (h1[i + mid] - h1[i] * p1[mid] % M1 + M1) % M1;
                long x2 = (h2[best + mid] - h2[best] * p2[mid] % M2 + M2) % M2;
                long y2 = (h2[i + mid] - h2[i] * p2[mid] % M2 + M2) % M2;
                if (x1 == y1 && x2 == y2) { lcp = mid; lo = mid + 1; } else { hi = mid - 1; }
            }
            if (lcp < n && t.charAt(i + lcp) < t.charAt(best + lcp)) best = i;
        }
        System.out.println(t.substring(best, best + n));
    }
}`,
        python3: `import random, sys
def solve():
    data = sys.stdin.buffer.read().split()
    if not data: return
    s = data[0]; n = len(s); t = s + s
    M1, M2 = 1_000_000_007, 1_000_000_009
    b1 = random.randrange(301, 1_000_000, 2)
    b2 = random.randrange(301, 1_000_000, 2)
    h1 = [0] * (2 * n + 1); h2 = [0] * (2 * n + 1)
    p1 = [1] * (2 * n + 1); p2 = [1] * (2 * n + 1)
    for i, ch in enumerate(t):
        c = ch + 1
        p1[i + 1] = p1[i] * b1 % M1; p2[i + 1] = p2[i] * b2 % M2
        h1[i + 1] = (h1[i] * b1 + c) % M1; h2[i + 1] = (h2[i] * b2 + c) % M2
    best = 0
    for i in range(1, n):
        if t[i] != t[best]:
            if t[i] < t[best]: best = i
            continue
        lo, hi, lcp = 1, n, 0
        while lo <= hi:
            mid = (lo + hi) >> 1
            x1 = (h1[best + mid] - h1[best] * p1[mid]) % M1
            y1 = (h1[i + mid] - h1[i] * p1[mid]) % M1
            if x1 == y1 and (h2[best + mid] - h2[best] * p2[mid]) % M2 == (h2[i + mid] - h2[i] * p2[mid]) % M2:
                lcp = mid; lo = mid + 1
            else:
                hi = mid - 1
        if lcp < n and t[i + lcp] < t[best + lcp]: best = i
    sys.stdout.buffer.write(t[best:best + n] + b"\\n")
if __name__ == "__main__":
    solve()`,
        ruby: `toks = STDIN.read.split
exit if toks.empty?
s = toks[0]; n = s.bytesize; t = s + s; bytes = t.bytes
M1 = 1_000_000_007; M2 = 1_000_000_009
b1 = rand(300..999_999) | 1; b2 = rand(300..999_999) | 1
h1 = Array.new(2 * n + 1, 0); h2 = Array.new(2 * n + 1, 0)
p1 = Array.new(2 * n + 1, 1); p2 = Array.new(2 * n + 1, 1)
bytes.each_with_index do |ch, i|
  c = ch + 1
  p1[i + 1] = (p1[i] * b1) % M1; p2[i + 1] = (p2[i] * b2) % M2
  h1[i + 1] = (h1[i] * b1 + c) % M1; h2[i + 1] = (h2[i] * b2 + c) % M2
end
best = 0
(1...n).each do |i|
  if bytes[i] != bytes[best]
    best = i if bytes[i] < bytes[best]
    next
  end
  lo = 1; hi = n; lcp = 0
  while lo <= hi
    mid = (lo + hi) >> 1
    x1 = (h1[best + mid] - h1[best] * p1[mid]) % M1
    y1 = (h1[i + mid] - h1[i] * p1[mid]) % M1
    x2 = (h2[best + mid] - h2[best] * p2[mid]) % M2
    y2 = (h2[i + mid] - h2[i] * p2[mid]) % M2
    if x1 == y1 && x2 == y2; lcp = mid; lo = mid + 1; else hi = mid - 1; end
  end
  best = i if lcp < n && bytes[i + lcp] < bytes[best + lcp]
end
puts t[best, n]`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'CSES',
      title: 'String Matching, Finding Borders & Minimal Rotation',
      difficulty: 'USACO Gold (1400–1750)',
      url: 'https://cses.fi/problemset/task/1753',
      patternNote: 'String Matching, Borders, and Minimal Rotation are all solvable in minutes with DoubleHash + LCP.',
    },
    {
      platform: 'AtCoder',
      title: 'ABC141 E (Who Says a Pun?) & ABC284 F (ABCBAC)',
      difficulty: 'AtCoder Cyan (~1500)',
      url: 'https://atcoder.jp/contests/abc284/tasks/abc284_f',
      patternNote: 'Split-string reversal matching solved in O(N) by gluing forward + reverse prefix hashes.',
    },
    {
      platform: 'Codeforces',
      title: 'CF 271D Good Substrings & CF 1200E Compress Words',
      difficulty: 'CF 1700–2000',
      url: 'https://codeforces.com/problemset/problem/271/D',
      patternNote: '271D specifically punishes single-hash solutions via Birthday Paradox collisions—DoubleHash passes effortlessly.',
    },
    {
      platform: 'CodeChef',
      title: 'SSTORY / STRQ (Longest Common Substring via Binary Search + Hash)',
      difficulty: 'CodeChef 4★',
      url: 'https://www.codechef.com/tags/problems/hashing',
      patternNote: 'Binary search length + hash-set lookup replaces full Suffix Automaton on Gold-tier tasks.',
    },
    {
      platform: 'HackerRank',
      title: 'Palindromic Substrings & Substring Diff',
      difficulty: 'Medium / Hard',
      url: 'https://www.hackerrank.com/domains/algorithms/strings',
      patternNote: 'Verify palindrome symmetry in O(1) using forward hash == reverse hash.',
    },
    {
      platform: 'NeetCode 150',
      title: 'Longest Duplicate Substring (LeetCode 1044) & Repeated DNA',
      difficulty: 'FAANG Hard',
      url: 'https://leetcode.com/problems/longest-duplicate-substring/',
      patternNote: 'Classic Rolling Hash + Binary Search interview problem where naive hashing collides unless doubled.',
    },
  ],
  interviewNotes: [
    'Always mention the Birthday Paradox collision threshold sqrt(M) (~31,600 items for M=10^9+7) and why dual-mod or 64-bit prime hashing eliminates false positives.',
    'Highlight how Hash + Binary Search replaces complex Suffix Arrays/Automata when comparing arbitrary substrings or computing LCP in O(log N).',
  ],
  projectBlueprint: {
    title: 'Plagiarism & Substring Deduplication Scanner',
    tagline:
      'Scan multi-file source submissions in O(N log N) to surface longest shared code blocks, cyclic token matches, and near-duplicate snippets.',
    stackSummary: 'TypeScript + BigInt Dual-Prime Rolling Hash + Binary Search Window Matcher',
    asciiDiagram:
      'Document A & B ──▶ [BigInt DoubleHash Precompute] ──▶ Binary Search Block Length L\n' +
      '                                                          │\n' +
      '  Matched Fingerprints & Line Spans ◀─────────────────────┘',
    milestones: [
      {
        id: 'ch13-m1',
        title: 'Milestone 1: Overflow-Safe 64-Bit Dual Hasher',
        detail: 'Implement randomized-base DoubleHash using BigInt modular arithmetic to pack (h1, h2) into zero-collision keys.',
      },
      {
        id: 'ch13-m2',
        title: 'Milestone 2: Longest Common Substring Finder',
        detail: 'Binary search shared chunk length L across normalized token streams with a Set of packed 64-bit hashes.',
      },
      {
        id: 'ch13-m3',
        title: 'Milestone 3: Substring LCP & Lexicographical Diff',
        detail: 'Support O(log N) longest-common-prefix alignment to jump straight to diverging lines between files.',
      },
    ],
    starterCode: `export class DoubleRollingHash {
  private static readonly M1 = 1_000_000_007n;
  private static readonly M2 = 1_000_000_009n;
  private readonly h1: BigInt64Array;
  private readonly h2: BigInt64Array;
  private readonly p1: BigInt64Array;
  private readonly p2: BigInt64Array;

  constructor(text: string) {
    const b1 = BigInt(301 + Math.floor(Math.random() * 500_000) * 2);
    const b2 = BigInt(701 + Math.floor(Math.random() * 500_000) * 2);
    const n = text.length;
    this.h1 = new BigInt64Array(n + 1);
    this.h2 = new BigInt64Array(n + 1);
    this.p1 = new BigInt64Array(n + 1);
    this.p2 = new BigInt64Array(n + 1);
    this.p1[0] = 1n;
    this.p2[0] = 1n;

    for (let i = 0; i < n; i++) {
      const c = BigInt(text.charCodeAt(i) + 1);
      this.p1[i + 1] = (this.p1[i] * b1) % DoubleRollingHash.M1;
      this.p2[i + 1] = (this.p2[i] * b2) % DoubleRollingHash.M2;
      this.h1[i + 1] = (this.h1[i] * b1 + c) % DoubleRollingHash.M1;
      this.h2[i + 1] = (this.h2[i] * b2 + c) % DoubleRollingHash.M2;
    }
  }

  // Returns unique 64-bit fingerprint for half-open range [l, r)
  sliceHash(l: number, r: number): bigint {
    const M1 = DoubleRollingHash.M1;
    const M2 = DoubleRollingHash.M2;
    const x1 = ((this.h1[r] - ((this.h1[l] * this.p1[r - l]) % M1)) + M1) % M1;
    const x2 = ((this.h2[r] - ((this.h2[l] * this.p2[r - l]) % M2)) + M2) % M2;
    return (x1 << 32n) | x2;
  }

  equals(l1: number, r1: number, l2: number, r2: number): boolean {
    return r1 - l1 === r2 - l2 && this.sliceHash(l1, r1) === this.sliceHash(l2, r2);
  }
}`,
  },
};
