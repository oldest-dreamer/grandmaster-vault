import type { TheoryChapter } from '../../types/vault';

export const CH73_LYNDON_DUVAL_RUNS: TheoryChapter = {
  slug: 'lyndon-duval-runs',
  topicId: 'sg-66',
  title: 'Lyndon Factorization (Duval) & Main-Lorentz Runs',
  domain: 'Strings & Geometry',
  ratingTier: '2600–3300+',
  usacoDivision: 'Advanced',
  subtitle: 'Chen-Fox-Lyndon non-increasing word decomposition via Duval’s three-pointer O(N) scan, minimal cyclic shifts, and O(N log N) maximal periodicities',
  analogyTitle: 'Slicing a String into Monotone Waves Without Backtracking',
  analogyBody:
    'A Lyndon word is a string that is strictly smaller than every one of its non-empty proper suffixes (equivalently, strictly smaller than all of its nontrivial cyclic rotations). The Chen-Fox-Lyndon theorem guarantees that every string S admits a unique factorization S = w_1 w_2 ... w_k into Lyndon words with w_1 >= w_2 >= ... >= w_k.\n\nDuval’s algorithm constructs this exact factorization in O(N) time and O(1) extra space by maintaining a candidate pre-simple block S[i..j-1] = u^t p where u is Lyndon and p is a proper prefix of u. Comparing S[k] against S[j] (with k trailing j by period p_len = j - k) yields only three transitions: if S[k] == S[j], the period continues; if S[k] < S[j], the entire prefix S[i..j] collapses into a single larger Lyndon word so k resets to i; and if S[k] > S[j], all t complete copies of u are immediately finalized as Lyndon factors and i leaps ahead.\n\nBecause the last Lyndon factor of S is always S’s lexicographically smallest suffix, running Duval on S + S yields the minimum cyclic rotation in O(N), while Main-Lorentz divide-and-conquer uses bidirectional Z-arrays around every midpoint to enumerate all maximal periodic repetitions (runs) in O(N log N).',
  prerequisites: [
    { slug: 'kmp-z-function-manacher', title: 'KMP Prefix Function, Z-Algorithm & Manacher' },
  ],
  traceTitle: 'Duval 3-Pointer Factorization on S = "abbaab"',
  traceSubtitle: 'Tracking anchor i, comparison cursor k, and frontier j across pre-simple waves',
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Start at i = 0 ("a"): Expand First Lyndon Prefix',
      explanation: 'Initialize i = 0, k = 0, j = 1. Compare S[0]="a" < S[1]="b", so S[0..1]="ab" is simple (Lyndon) and k resets to 0. Next j = 2 ("b"): S[0]="a" < S[2]="b", so "abb" is simple and k stays 0.',
      mode: 'array',
      arrays: [
        {
          name: 'S = "abbaab" (0-indexed)',
          cells: [
            { index: 0, value: 'a', label: 'i=k=0', highlight: 'active' },
            { index: 1, value: 'b', label: 'simple', highlight: 'window' },
            { index: 2, value: 'b', label: 'j=2', highlight: 'updated' },
            { index: 3, value: 'a', label: '', highlight: 'neutral' },
            { index: 4, value: 'a', label: '', highlight: 'neutral' },
            { index: 5, value: 'b', label: '', highlight: 'neutral' },
          ],
        },
      ],
      variables: { i: 0, k: 0, j: 3, period: 3, factorPrefix: 'abb' },
    },
    {
      stepNumber: 2,
      title: 'Match S[0] == S[3] ("a"), Then Drop at S[1]="b" > S[4]="a"',
      explanation: 'At j = 3, S[0] == S[3] ("a"), so period 3 repeats: k advances to 1. At j = 4, S[1]="b" > S[4]="a" triggers emission of all complete periods of length j - k = 4 - 1 = 3: factor "abb" [0, 2] is finalized and i jumps to 3.',
      mode: 'array',
      arrays: [
        {
          name: 'Emit "abb", Advance Anchor i = 3',
          cells: [
            { index: 0, value: 'a', label: 'F1', highlight: 'neutral' },
            { index: 1, value: 'b', label: 'F1', highlight: 'neutral' },
            { index: 2, value: 'b', label: 'F1', highlight: 'neutral' },
            { index: 3, value: 'a', label: 'i=k=3', highlight: 'active' },
            { index: 4, value: 'a', label: 'j=4', highlight: 'updated' },
            { index: 5, value: 'b', label: '', highlight: 'neutral' },
          ],
        },
      ],
      variables: { emitted: '"abb"', i: 3, j_next: 4, factorsCount: 1 },
    },
    {
      stepNumber: 3,
      title: 'Scan Remaining Suffix "aab" -> Final Factorization',
      explanation: 'From i = 3: S[3]=="a" == S[4]=="a" (k advances to 4, period 1), then at j = 5 ("b"): S[4]="a" < S[5]="b", so "aab" collapses into one Lyndon word and k resets to 3. Reached end j = 6: emit [3, 5] = "aab". Notice "abb" >= "aab".',
      mode: 'array',
      arrays: [
        {
          name: 'Completed Lyndon Decomposition',
          cells: [
            { index: 0, value: 'a', label: 'W1', highlight: 'active' },
            { index: 1, value: 'b', label: 'W1', highlight: 'active' },
            { index: 2, value: 'b', label: 'W1', highlight: 'active' },
            { index: 3, value: 'a', label: 'W2', highlight: 'updated' },
            { index: 4, value: 'a', label: 'W2', highlight: 'updated' },
            { index: 5, value: 'b', label: 'W2', highlight: 'updated' },
          ],
        },
      ],
      variables: { factors: 'abb | aab', invariant: 'w1 >= w2', totalOps: 'O(N)' },
    },
  ],
  reductionClues: [
    {
      clue: 'Find the lexicographically smallest cyclic rotation (Booth / Duval problem) in O(N)',
      translation: 'Run Duval’s loop on T = S + S while anchor i < N; the last anchor i entered before crossing N is the minimal rotation start.',
    },
    {
      clue: 'Partition a string into w_1 >= w_2 >= ... >= w_k with each w_i strictly smaller than its cyclic shifts',
      translation: 'Direct Chen-Fox-Lyndon factorization via Duval’s algorithm in O(N) time and O(1) auxiliary space.',
    },
    {
      clue: 'Compute the lexicographically smallest non-empty suffix of every prefix S[1..p] online in O(N)',
      translation: 'Duval’s pre-simple invariant tracks the minimal suffix at index j directly from k and i during the single forward sweep.',
    },
    {
      clue: 'Find all maximal periodic substrings (runs: l, r, p with r - l + 1 >= 2p), squares, or tandem repeats',
      translation: 'Apply Main-Lorentz divide-and-conquer: around each midpoint, compute left/right extension lengths using two Z-algorithm arrays in O(N log N).',
    },
  ],
  timeComplexity: 'O(N) for Duval factorization & minimal rotation; O(N log N) for Main-Lorentz runs',
  spaceComplexity: 'O(N) (O(1) extra space for minimal rotation)',
  pitfalls: [
    {
      type: 'WA',
      title: 'Checking i < j Instead of i <= k in Duval Emission Loop',
      detail: 'When S[k] > S[j], you MUST advance while (i <= k) { emit(i, j - k); i += j - k; } and NOT advance to j! The partial remainder S[i_new..j-1] is NOT yet finalized and will form the start of the next Lyndon wave.',
    },
    {
      type: 'WA',
      title: 'Off-by-One When Extracting Minimal Rotation Over S + S',
      detail: 'For all-equal strings like "aaaa", the inner loop reaches j = 2N with k = 2N - 1 and i = 0; only while (i <= k) advances i by j - k = 1 each time until i >= N while updating ans = i BEFORE the inner loop.',
    },
    {
      type: 'WA',
      title: 'Emitting Non-Primitive Periods or Duplicates in Main-Lorentz Runs',
      detail: 'In "aaaa", period p = 2 yields the same maximal interval [1, 4] as primitive period p = 1. Always verify maximality against global S boundaries and keep only the smallest period p per distinct interval [l, r].',
    },
    {
      type: 'TLE',
      title: 'Allocating Full-Length S Copies Inside Divide-and-Conquer Recursion',
      detail: 'In Main-Lorentz, Z-arrays around mid = (L + R) / 2 must only operate on substrings of length (R - L), never the whole string of length N, otherwise complexity degrades to O(N^2).',
    },
  ],
  implementations: {
    cpp20: `#include <iostream>
#include <string>
#include <vector>

using namespace std;

// Duval's O(N) Chen-Fox-Lyndon factorization: returns (start, length) of each factor.
vector<pair<int, int>> duvalFactorization(const string& s) {
    int n = (int)s.size();
    vector<pair<int, int>> factors;
    int i = 0;
    while (i < n) {
        int j = i + 1, k = i;
        while (j < n && s[k] <= s[j]) {
            if (s[k] < s[j]) k = i;
            else ++k;
            ++j;
        }
        while (i <= k) {
            factors.emplace_back(i, j - k);
            i += j - k;
        }
    }
    return factors;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    string s;
    if (!(cin >> s)) return 0;

    auto factors = duvalFactorization(s);
    cout << factors.size() << '\\n';
    for (size_t idx = 0; idx < factors.size(); ++idx) {
        if (idx) cout << ' ';
        cout << s.substr(factors[idx].first, factors[idx].second);
    }
    cout << '\\n';
    return 0;
}`,
    rust: `use std::io::{self, Read};

fn duval_factorization(s: &[u8]) -> Vec<(usize, usize)> {
    let n = s.len();
    let mut factors = Vec::new();
    let mut i = 0usize;
    while i < n {
        let mut j = i + 1;
        let mut k = i;
        while j < n && s[k] <= s[j] {
            if s[k] < s[j] {
                k = i;
            } else {
                k += 1;
            }
            j += 1;
        }
        while i <= k {
            factors.push((i, j - k));
            i += j - k;
        }
    }
    factors
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let s = match input.split_whitespace().next() {
        Some(v) => v,
        None => return,
    };
    let factors = duval_factorization(s.as_bytes());
    println!("{}", factors.len());
    let parts: Vec<&str> = factors.iter().map(|&(st, len)| &s[st..st + len]).collect();
    println!("{}", parts.join(" "));
}`,
    java21: `import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

public class Main {
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

        String next() throws IOException {
            int c;
            do {
                c = readByte();
                if (c == -1) return null;
            } while (c <= ' ');
            StringBuilder sb = new StringBuilder();
            while (c > ' ') {
                sb.append((char) c);
                c = readByte();
            }
            return sb.toString();
        }
    }

    public static void main(String[] args) throws Exception {
        FastScanner sc = new FastScanner(System.in);
        String s = sc.next();
        if (s == null) return;
        int n = s.length();
        List<String> factors = new ArrayList<>();
        int i = 0;
        while (i < n) {
            int j = i + 1, k = i;
            while (j < n && s.charAt(k) <= s.charAt(j)) {
                if (s.charAt(k) < s.charAt(j)) k = i;
                else k++;
                j++;
            }
            while (i <= k) {
                factors.add(s.substring(i, i + j - k));
                i += j - k;
            }
        }
        StringBuilder sb = new StringBuilder();
        sb.append(factors.size()).append('\\n');
        for (int idx = 0; idx < factors.size(); idx++) {
            if (idx > 0) sb.append(' ');
            sb.append(factors.get(idx));
        }
        System.out.println(sb.toString());
    }
}`,
    python3: `import sys


def duval_factorization(s: str) -> list[str]:
    n = len(s)
    factors: list[str] = []
    i = 0
    while i < n:
        j = i + 1
        k = i
        while j < n and s[k] <= s[j]:
            if s[k] < s[j]:
                k = i
            else:
                k += 1
            j += 1
        while i <= k:
            factors.append(s[i : i + j - k])
            i += j - k
    return factors


def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    factors = duval_factorization(data[0])
    sys.stdout.write(f"{len(factors)}\\n")
    sys.stdout.write(" ".join(factors) + "\\n")


if __name__ == "__main__":
    solve()`,
    ruby: `s = STDIN.read.split.first
return unless s

n = s.length
factors = []
i = 0
while i < n
  j = i + 1
  k = i
  while j < n && s[k] <= s[j]
    if s[k] < s[j]
      k = i
    else
      k += 1
    end
    j += 1
  end
  while i <= k
    factors << s[i, j - k]
    i += j - k
  end
end

puts factors.length
puts factors.join(' ')`,
  },
  practiceProblems: [
    {
      id: 'ch73-p1',
      tier: 'Warmup',
      ratingRange: '2200–2500',
      title: 'Lexicographically Minimal Cyclic Rotation in O(N)',
      statement:
        'Given a string S of lowercase English letters of length N, output the lexicographically smallest string obtainable by cyclically shifting S any number of times (using O(N) time and O(N) space via Duval on S + S).',
      constraints: '1 <= |S| <= 10^6',
      sampleInput: `cabab`,
      sampleOutput: `ababc`,
      hints: [
        'Duplicate the string T = S + S and run Duval’s loop while the factor start index i < N.',
        'At the beginning of each outer step (while i < N), record ans = i before scanning j forward and advancing i past k by period j - k.',
      ],
      solutions: {
        cpp20: `#include <iostream>
#include <string>

using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    string s;
    if (!(cin >> s)) return 0;

    int n = (int)s.size();
    string t = s + s;
    int i = 0, ans = 0;
    while (i < n) {
        ans = i;
        int j = i + 1, k = i;
        while (j < 2 * n && t[k] <= t[j]) {
            if (t[k] < t[j]) k = i;
            else ++k;
            ++j;
        }
        while (i <= k) i += j - k;
    }

    cout << t.substr(ans, n) << '\\n';
    return 0;
}`,
        rust: `use std::io::{self, Read};

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let s = match input.split_whitespace().next() {
        Some(v) => v,
        None => return,
    };
    let n = s.len();
    let mut t = Vec::with_capacity(2 * n);
    t.extend_from_slice(s.as_bytes());
    t.extend_from_slice(s.as_bytes());

    let mut i = 0usize;
    let mut ans = 0usize;
    while i < n {
        ans = i;
        let mut j = i + 1;
        let mut k = i;
        while j < 2 * n && t[k] <= t[j] {
            if t[k] < t[j] {
                k = i;
            } else {
                k += 1;
            }
            j += 1;
        }
        while i <= k {
            i += j - k;
        }
    }

    let out = std::str::from_utf8(&t[ans..ans + n]).unwrap();
    println!("{}", out);
}`,
        java21: `import java.io.IOException;
import java.io.InputStream;

public class Main {
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

        String next() throws IOException {
            int c;
            do {
                c = readByte();
                if (c == -1) return null;
            } while (c <= ' ');
            StringBuilder sb = new StringBuilder();
            while (c > ' ') {
                sb.append((char) c);
                c = readByte();
            }
            return sb.toString();
        }
    }

    public static void main(String[] args) throws Exception {
        FastScanner sc = new FastScanner(System.in);
        String s = sc.next();
        if (s == null) return;
        int n = s.length();
        String t = s + s;
        int i = 0, ans = 0;
        while (i < n) {
            ans = i;
            int j = i + 1, k = i;
            while (j < 2 * n && t.charAt(k) <= t.charAt(j)) {
                if (t.charAt(k) < t.charAt(j)) k = i;
                else k++;
                j++;
            }
            while (i <= k) i += j - k;
        }
        System.out.println(t.substring(ans, ans + n));
    }
}`,
        python3: `import sys


def minimal_rotation(s: str) -> str:
    n = len(s)
    t = s + s
    i = 0
    ans = 0
    while i < n:
        ans = i
        j = i + 1
        k = i
        while j < 2 * n and t[k] <= t[j]:
            if t[k] < t[j]:
                k = i
            else:
                k += 1
            j += 1
        while i <= k:
            i += j - k
    return t[ans : ans + n]


def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    sys.stdout.write(minimal_rotation(data[0]) + "\\n")


if __name__ == "__main__":
    solve()`,
        ruby: `s = STDIN.read.split.first
return unless s

n = s.length
t = s + s
i = 0
ans = 0
while i < n
  ans = i
  j = i + 1
  k = i
  while j < 2 * n && t[k] <= t[j]
    if t[k] < t[j]
      k = i
    else
      k += 1
    end
    j += 1
  end
  i += j - k while i <= k
end

puts t[ans, n]`,
      },
    },
    {
      id: 'ch73-p2',
      tier: 'Standard',
      ratingRange: '2600–2900',
      title: 'Minimal Suffix of Every Prefix via Duval Invariant',
      statement:
        'Given a string S of length N, for every prefix S[1..p] (1 <= p <= N) output the 1-indexed starting position of its lexicographically smallest non-empty suffix in O(N) total time.',
      constraints: '1 <= |S| <= 10^6',
      sampleInput: `ababcaba`,
      sampleOutput: `1 1 3 3 1 6 6 8`,
      hints: [
        'When Duval reaches a new Lyndon anchor i, the best suffix of S[0..i] starts at i.',
        'If S[k] < S[j], the whole pre-simple block collapses into a Lyndon word so best[j] = i; if S[k] == S[j], shifting best[k] by period p = j - k gives best[j] = best[k] + (j - k).',
      ],
      solutions: {
        cpp20: `#include <iostream>
#include <string>
#include <vector>

using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    string s;
    if (!(cin >> s)) return 0;

    int n = (int)s.size();
    vector<int> best(n, 0);
    int i = 0;
    while (i < n) {
        best[i] = i;
        int j = i + 1, k = i;
        while (j < n && s[k] <= s[j]) {
            if (s[k] < s[j]) {
                k = i;
                best[j] = i;
            } else {
                best[j] = best[k] + (j - k);
                ++k;
            }
            ++j;
        }
        while (i <= k) i += j - k;
    }

    for (int idx = 0; idx < n; ++idx) {
        cout << best[idx] + 1 << (idx + 1 == n ? '\\n' : ' ');
    }
    return 0;
}`,
        rust: `use std::io::{self, Read};

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let s = match input.split_whitespace().next() {
        Some(v) => v.as_bytes(),
        None => return,
    };
    let n = s.len();
    let mut best = vec![0usize; n];
    let mut i = 0usize;
    while i < n {
        best[i] = i;
        let mut j = i + 1;
        let mut k = i;
        while j < n && s[k] <= s[j] {
            if s[k] < s[j] {
                k = i;
                best[j] = i;
            } else {
                best[j] = best[k] + (j - k);
                k += 1;
            }
            j += 1;
        }
        while i <= k {
            i += j - k;
        }
    }
    let out: Vec<String> = best.iter().map(|v| (v + 1).to_string()).collect();
    println!("{}", out.join(" "));
}`,
        java21: `import java.io.IOException;
import java.io.InputStream;

public class Main {
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

        String next() throws IOException {
            int c;
            do {
                c = readByte();
                if (c == -1) return null;
            } while (c <= ' ');
            StringBuilder sb = new StringBuilder();
            while (c > ' ') {
                sb.append((char) c);
                c = readByte();
            }
            return sb.toString();
        }
    }

    public static void main(String[] args) throws Exception {
        FastScanner sc = new FastScanner(System.in);
        String s = sc.next();
        if (s == null) return;
        int n = s.length();
        int[] best = new int[n];
        int i = 0;
        while (i < n) {
            best[i] = i;
            int j = i + 1, k = i;
            while (j < n && s.charAt(k) <= s.charAt(j)) {
                if (s.charAt(k) < s.charAt(j)) {
                    k = i;
                    best[j] = i;
                } else {
                    best[j] = best[k] + (j - k);
                    k++;
                }
                j++;
            }
            while (i <= k) i += j - k;
        }
        StringBuilder sb = new StringBuilder();
        for (int idx = 0; idx < n; idx++) {
            if (idx > 0) sb.append(' ');
            sb.append(best[idx] + 1);
        }
        System.out.println(sb.toString());
    }
}`,
        python3: `import sys


def min_suffix_prefixes(s: str) -> list[int]:
    n = len(s)
    best = [0] * n
    i = 0
    while i < n:
        best[i] = i
        j = i + 1
        k = i
        while j < n and s[k] <= s[j]:
            if s[k] < s[j]:
                k = i
                best[j] = i
            else:
                best[j] = best[k] + (j - k)
                k += 1
            j += 1
        while i <= k:
            i += j - k
    return [x + 1 for x in best]


def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    ans = min_suffix_prefixes(data[0])
    sys.stdout.write(" ".join(map(str, ans)) + "\\n")


if __name__ == "__main__":
    solve()`,
        ruby: `s = STDIN.read.split.first
return unless s

n = s.length
best = Array.new(n, 0)
i = 0
while i < n
  best[i] = i
  j = i + 1
  k = i
  while j < n && s[k] <= s[j]
    if s[k] < s[j]
      k = i
      best[j] = i
    else
      best[j] = best[k] + (j - k)
      k += 1
    end
    j += 1
  end
  i += j - k while i <= k
end

puts best.map { |x| x + 1 }.join(' ')`,
      },
    },
    {
      id: 'ch73-p3',
      tier: 'Boss',
      ratingRange: '2900–3300+',
      title: 'All Maximal Periodic Runs (Main-Lorentz Divide & Conquer in O(N log N))',
      statement:
        'A run in string S is a triple (p, l, r) (1-indexed, 1 <= l < r <= N) such that r - l + 1 >= 2 * p, p is the minimal period of S[l..r], and extending S[l..r] one character left or right breaks period p. Output the total number of runs on line 1, followed by each (p, l, r) sorted by (p, l, r) ascending.',
      constraints: '1 <= |S| <= 2 * 10^5',
      sampleInput: `abaababaaba`,
      sampleOutput: `6
1 3 4
1 8 9
2 4 8
3 1 6
3 6 11
5 1 11`,
      hints: [
        'Divide S[L..R) at mid = (L + R) / 2 into left half u and right half v. Compute two Z-arrays for centers inside u and two symmetric Z-arrays for centers inside v.',
        'Keep only globally maximal runs (l == 0 or S[l - 1] != S[l - 1 + p], and r == N - 1 or S[r + 1] != S[r + 1 - p]), then deduplicate by (l, r) retaining the minimum period p (by Fine-Wilf).',
      ],
      solutions: {
        cpp20: `#include <algorithm>
#include <iostream>
#include <string>
#include <tuple>
#include <vector>

using namespace std;

vector<int> zFunction(const string& s) {
    int n = (int)s.size();
    vector<int> z(n, 0);
    for (int i = 1, l = 0, r = 0; i < n; ++i) {
        if (i <= r) z[i] = min(r - i + 1, z[i - l]);
        while (i + z[i] < n && s[z[i]] == s[i + z[i]]) ++z[i];
        if (i + z[i] - 1 > r) {
            l = i;
            r = i + z[i] - 1;
        }
    }
    return z;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    string s;
    if (!(cin >> s)) return 0;
    int n = (int)s.size();

    // Stores (l, r, p) in 0-indexed inclusive coordinates.
    vector<tuple<int, int, int>> raw;

    auto addCandidate = [&](int l, int r, int p) {
        if (l > 0 && s[l - 1] == s[l - 1 + p]) return;
        if (r + 1 < n && s[r + 1] == s[r + 1 - p]) return;
        raw.emplace_back(l, r, p);
    };

    auto solveDC = [&](auto& self, int L, int R) -> void {
        if (R - L <= 1) return;
        int mid = (L + R) >> 1;
        self(self, L, mid);
        self(self, mid, R);

        string u = s.substr(L, mid - L);
        string v = s.substr(mid, R - mid);
        int nu = (int)u.size(), nv = (int)v.size();

        string ru(u.rbegin(), u.rend());
        string rv(v.rbegin(), v.rend());

        vector<int> z1 = zFunction(ru);
        vector<int> z2 = zFunction(v + "#" + u + v);
        vector<int> z3 = zFunction(v);
        vector<int> z4 = zFunction(ru + "#" + rv + ru);

        for (int c = 0; c < nu; ++c) {
            int p = nu - c;
            int l1 = (p < nu) ? z1[p] : 0;
            int l2 = z2[nv + 1 + c];
            if (l1 + l2 >= p) addCandidate(L + c - l1, mid + l2 - 1, p);
        }
        for (int c = 0; c < nv; ++c) {
            int p = nv - c;
            int l1 = (p < nv) ? z3[p] : 0;
            int l2 = z4[nu + 1 + c];
            if (l1 + l2 >= p) addCandidate(mid - l2, mid + p + l1 - 1, p);
        }
    };

    solveDC(solveDC, 0, n);

    sort(raw.begin(), raw.end());
    vector<tuple<int, int, int>> runs;
    int last_l = -1, last_r = -1;
    for (auto [l, r, p] : raw) {
        if (l == last_l && r == last_r) continue;
        last_l = l;
        last_r = r;
        runs.emplace_back(p, l + 1, r + 1);
    }

    sort(runs.begin(), runs.end());
    cout << runs.size() << '\\n';
    for (auto [p, l, r] : runs) {
        cout << p << ' ' << l << ' ' << r << '\\n';
    }
    return 0;
}`,
        rust: `use std::io::{self, Read};

fn z_function(s: &[u8]) -> Vec<usize> {
    let n = s.len();
    let mut z = vec![0usize; n];
    let (mut l, mut r) = (0usize, 0usize);
    for i in 1..n {
        if i <= r {
            z[i] = (r - i + 1).min(z[i - l]);
        }
        while i + z[i] < n && s[z[i]] == s[i + z[i]] {
            z[i] += 1;
        }
        if i + z[i] > r + 1 {
            l = i;
            r = i + z[i] - 1;
        }
    }
    z
}

fn solve_dc(s: &[u8], l_bound: usize, r_bound: usize, raw: &mut Vec<(usize, usize, usize)>) {
    if r_bound - l_bound <= 1 {
        return;
    }
    let mid = (l_bound + r_bound) >> 1;
    solve_dc(s, l_bound, mid, raw);
    solve_dc(s, mid, r_bound, raw);

    let u = &s[l_bound..mid];
    let v = &s[mid..r_bound];
    let nu = u.len();
    let nv = v.len();

    let mut ru = u.to_vec();
    ru.reverse();
    let mut rv = v.to_vec();
    rv.reverse();

    let z1 = z_function(&ru);
    let mut s2 = Vec::with_capacity(nv + 1 + nu + nv);
    s2.extend_from_slice(v);
    s2.push(b'#');
    s2.extend_from_slice(u);
    s2.extend_from_slice(v);
    let z2 = z_function(&s2);

    let z3 = z_function(v);
    let mut s4 = Vec::with_capacity(nu + 1 + nv + nu);
    s4.extend_from_slice(&ru);
    s4.push(b'#');
    s4.extend_from_slice(&rv);
    s4.extend_from_slice(&ru);
    let z4 = z_function(&s4);

    let n = s.len();
    let mut try_add = |l: usize, r: usize, p: usize| {
        if l > 0 && s[l - 1] == s[l - 1 + p] {
            return;
        }
        if r + 1 < n && s[r + 1] == s[r + 1 - p] {
            return;
        }
        raw.push((l, r, p));
    };

    for c in 0..nu {
        let p = nu - c;
        let l1 = if p < nu { z1[p] } else { 0 };
        let l2 = z2[nv + 1 + c];
        if l1 + l2 >= p {
            try_add(l_bound + c - l1, mid + l2 - 1, p);
        }
    }
    for c in 0..nv {
        let p = nv - c;
        let l1 = if p < nv { z3[p] } else { 0 };
        let l2 = z4[nu + 1 + c];
        if l1 + l2 >= p {
            try_add(mid - l2, mid + p + l1 - 1, p);
        }
    }
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let s = match input.split_whitespace().next() {
        Some(v) => v.as_bytes(),
        None => return,
    };
    let mut raw = Vec::new();
    solve_dc(s, 0, s.len(), &mut raw);
    raw.sort_unstable();

    let mut runs = Vec::new();
    let mut last = (usize::MAX, usize::MAX);
    for (l, r, p) in raw {
        if (l, r) == last {
            continue;
        }
        last = (l, r);
        runs.push((p, l + 1, r + 1));
    }
    runs.sort_unstable();

    let mut out = format!("{}\\n", runs.len());
    for (p, l, r) in runs {
        out.push_str(&format!("{} {} {}\\n", p, l, r));
    }
    print!("{}", out);
}`,
        java21: `import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

public class Main {
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

        String next() throws IOException {
            int c;
            do {
                c = readByte();
                if (c == -1) return null;
            } while (c <= ' ');
            StringBuilder sb = new StringBuilder();
            while (c > ' ') {
                sb.append((char) c);
                c = readByte();
            }
            return sb.toString();
        }
    }

    static int[] zFunction(String s) {
        int n = s.length();
        int[] z = new int[n];
        for (int i = 1, l = 0, r = 0; i < n; i++) {
            if (i <= r) z[i] = Math.min(r - i + 1, z[i - l]);
            while (i + z[i] < n && s.charAt(z[i]) == s.charAt(i + z[i])) z[i]++;
            if (i + z[i] - 1 > r) {
                l = i;
                r = i + z[i] - 1;
            }
        }
        return z;
    }

    static void solveDC(String s, int L, int R, List<int[]> raw) {
        if (R - L <= 1) return;
        int mid = (L + R) >> 1;
        solveDC(s, L, mid, raw);
        solveDC(s, mid, R, raw);

        String u = s.substring(L, mid);
        String v = s.substring(mid, R);
        int nu = u.length(), nv = v.length();
        String ru = new StringBuilder(u).reverse().toString();
        String rv = new StringBuilder(v).reverse().toString();

        int[] z1 = zFunction(ru);
        int[] z2 = zFunction(v + "#" + u + v);
        int[] z3 = zFunction(v);
        int[] z4 = zFunction(ru + "#" + rv + ru);

        int n = s.length();
        for (int c = 0; c < nu; c++) {
            int p = nu - c;
            int l1 = p < nu ? z1[p] : 0;
            int l2 = z2[nv + 1 + c];
            if (l1 + l2 >= p) {
                int l = L + c - l1;
                int r = mid + l2 - 1;
                if ((l == 0 || s.charAt(l - 1) != s.charAt(l - 1 + p))
                        && (r + 1 == n || s.charAt(r + 1) != s.charAt(r + 1 - p))) {
                    raw.add(new int[]{l, r, p});
                }
            }
        }
        for (int c = 0; c < nv; c++) {
            int p = nv - c;
            int l1 = p < nv ? z3[p] : 0;
            int l2 = z4[nu + 1 + c];
            if (l1 + l2 >= p) {
                int l = mid - l2;
                int r = mid + p + l1 - 1;
                if ((l == 0 || s.charAt(l - 1) != s.charAt(l - 1 + p))
                        && (r + 1 == n || s.charAt(r + 1) != s.charAt(r + 1 - p))) {
                    raw.add(new int[]{l, r, p});
                }
            }
        }
    }

    public static void main(String[] args) throws Exception {
        FastScanner sc = new FastScanner(System.in);
        String s = sc.next();
        if (s == null) return;
        List<int[]> raw = new ArrayList<>();
        solveDC(s, 0, s.length(), raw);
        raw.sort(Comparator.comparingInt((int[] a) -> a[0])
                .thenComparingInt(a -> a[1])
                .thenComparingInt(a -> a[2]));

        List<int[]> runs = new ArrayList<>();
        int lastL = -1, lastR = -1;
        for (int[] cur : raw) {
            if (cur[0] == lastL && cur[1] == lastR) continue;
            lastL = cur[0];
            lastR = cur[1];
            runs.add(new int[]{cur[2], cur[0] + 1, cur[1] + 1});
        }
        runs.sort(Comparator.comparingInt((int[] a) -> a[0])
                .thenComparingInt(a -> a[1])
                .thenComparingInt(a -> a[2]));

        StringBuilder sb = new StringBuilder();
        sb.append(runs.size()).append('\\n');
        for (int[] run : runs) {
            sb.append(run[0]).append(' ').append(run[1]).append(' ').append(run[2]).append('\\n');
        }
        System.out.print(sb.toString());
    }
}`,
        python3: `import sys

sys.setrecursionlimit(200000)


def z_function(s: str) -> list[int]:
    n = len(s)
    z = [0] * n
    l = r = 0
    for i in range(1, n):
        if i <= r:
            z[i] = min(r - i + 1, z[i - l])
        while i + z[i] < n and s[z[i]] == s[i + z[i]]:
            z[i] += 1
        if i + z[i] - 1 > r:
            l = i
            r = i + z[i] - 1
    return z


def find_runs(s: str) -> list[tuple[int, int, int]]:
    n = len(s)
    raw: list[tuple[int, int, int]] = []

    def add_candidate(l: int, r: int, p: int) -> None:
        if l > 0 and s[l - 1] == s[l - 1 + p]:
            return
        if r + 1 < n and s[r + 1] == s[r + 1 - p]:
            return
        raw.append((l, r, p))

    def dc(L: int, R: int) -> None:
        if R - L <= 1:
            return
        mid = (L + R) >> 1
        dc(L, mid)
        dc(mid, R)

        u = s[L:mid]
        v = s[mid:R]
        nu, nv = len(u), len(v)
        ru, rv = u[::-1], v[::-1]

        z1 = z_function(ru)
        z2 = z_function(v + "#" + u + v)
        z3 = z_function(v)
        z4 = z_function(ru + "#" + rv + ru)

        for c in range(nu):
            p = nu - c
            l1 = z1[p] if p < nu else 0
            l2 = z2[nv + 1 + c]
            if l1 + l2 >= p:
                add_candidate(L + c - l1, mid + l2 - 1, p)
        for c in range(nv):
            p = nv - c
            l1 = z3[p] if p < nv else 0
            l2 = z4[nu + 1 + c]
            if l1 + l2 >= p:
                add_candidate(mid - l2, mid + p + l1 - 1, p)

    dc(0, n)
    raw.sort()
    runs: list[tuple[int, int, int]] = []
    last = (-1, -1)
    for l, r, p in raw:
        if (l, r) == last:
            continue
        last = (l, r)
        runs.append((p, l + 1, r + 1))
    runs.sort()
    return runs


def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    runs = find_runs(data[0])
    out = [str(len(runs))] + [f"{p} {l} {r}" for p, l, r in runs]
    sys.stdout.write("\\n".join(out) + "\\n")


if __name__ == "__main__":
    solve()`,
        ruby: `def z_function(s)
  n = s.length
  z = Array.new(n, 0)
  l = 0
  r = 0
  (1...n).each do |i|
    z[i] = [r - i + 1, z[i - l]].min if i <= r
    z[i] += 1 while i + z[i] < n && s[z[i]] == s[i + z[i]]
    if i + z[i] - 1 > r
      l = i
      r = i + z[i] - 1
    end
  end
  z
end

s = STDIN.read.split.first
return unless s

n = s.length
raw = []

dc = lambda do |left_b, right_b|
  return if right_b - left_b <= 1
  mid = (left_b + right_b) >> 1
  dc.call(left_b, mid)
  dc.call(mid, right_b)

  u = s[left_b...mid]
  v = s[mid...right_b]
  nu = u.length
  nv = v.length
  ru = u.reverse
  rv = v.reverse

  z1 = z_function(ru)
  z2 = z_function("#{v}##{u}#{v}")
  z3 = z_function(v)
  z4 = z_function("#{ru}##{rv}#{ru}")

  (0...nu).each do |c|
    p = nu - c
    l1 = p < nu ? z1[p] : 0
    l2 = z2[nv + 1 + c]
    if l1 + l2 >= p
      l = left_b + c - l1
      r = mid + l2 - 1
      next if l > 0 && s[l - 1] == s[l - 1 + p]
      next if r + 1 < n && s[r + 1] == s[r + 1 - p]
      raw << [l, r, p]
    end
  end
  (0...nv).each do |c|
    p = nv - c
    l1 = p < nv ? z3[p] : 0
    l2 = z4[nu + 1 + c]
    if l1 + l2 >= p
      l = mid - l2
      r = mid + p + l1 - 1
      next if l > 0 && s[l - 1] == s[l - 1 + p]
      next if r + 1 < n && s[r + 1] == s[r + 1 - p]
      raw << [l, r, p]
    end
  end
end

dc.call(0, n)
raw.sort!
runs = []
last_l = -1
last_r = -1
raw.each do |l, r, p|
  next if l == last_l && r == last_r
  last_l = l
  last_r = r
  runs << [p, l + 1, r + 1]
end
runs.sort!

puts runs.length
runs.each { |p, l, r| puts "#{p} #{l} #{r}" }`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'AtCoder',
      title: 'Library Checker - Lyndon Factorization',
      difficulty: 'Master',
      url: 'https://judge.yosupo.jp/problem/lyndon_factorization',
      patternNote: 'Direct O(N) Duval decomposition outputting factor boundary indices.',
    },
    {
      platform: 'CSES',
      title: 'Minimal Rotation',
      difficulty: 'Grandmaster',
      url: 'https://cses.fi/problemset/task/1110',
      patternNote: 'Duval’s O(N) scan over S + S beats O(N log N) suffix arrays with O(1) extra memory.',
    },
    {
      platform: 'AtCoder',
      title: 'Library Checker - Run Enumerate',
      difficulty: 'Grandmaster',
      url: 'https://judge.yosupo.jp/problem/runenumerate',
      patternNote: 'Main-Lorentz divide-and-conquer Z-algorithm enumerating all maximal periodicities in O(N log N).',
    },
  ],
  interviewNotes: [
    'Why does Duval run in strict O(N) despite nested loops? Pointer j advances every comparison (at most 2N total steps), and whenever i jumps forward across t periods, j only drops back within the partial remainder—each step decreases (N - i) or increases j so total character comparisons never exceed 2N.',
    'Because the sum of runs over any string of length N is at most N - 1 (The Runs Theorem, Bannai et al. 2017 showed #runs < N), storing and deduplicating runs never blows up memory.',
    'By Fine-Wilf’s theorem, if a substring S[l..r] of length >= 2p has a smaller period q < p, then gcd(p, q) is also a period, guaranteeing the minimal period divides every non-primitive period sharing [l, r].',
  ],
  projectBlueprint: {
    title: 'Linear-Time String Periodicity Analyzer',
    tagline: 'Duval Lyndon decomposition, O(N) minimal rotation, and Main-Lorentz O(N log N) maximal repeat detector',
    stackSummary: 'C++20 / Rust Three-Pointer Duval + Bidirectional Z-Array D&C',
    asciiDiagram:
`[String S] ---> [Duval Anchor i, Cursor k, Frontier j] ---> [w_1 >= w_2 >= ... >= w_k]
     |
     +---> [D&C Split (L, mid, R)] ---> [Z on rev(u), v#uv, v, ru#rvru] ---> [Maximal Runs (p, l, r)]`,
    milestones: [
      { id: 'm1', title: 'O(N) Duval Factorizer', detail: 'Maintain pre-simple block u^t p using pointers (i, j, k).' },
      { id: 'm2', title: 'Minimal Rotation & Suffixes', detail: 'Run Duval on S + S and track min_suf[j] = min_suf[k] + (j - k).' },
      { id: 'm3', title: 'Main-Lorentz Run Enumerator', detail: 'Combine four local Z-arrays per midpoint and deduplicate via Fine-Wilf.' },
    ],
    starterCode: `// Minimal cyclic rotation shift start in O(N):
// int i = 0, ans = 0; while (i < n) { ans = i; ... while (i <= k) i += j - k; }`,
  },
};
