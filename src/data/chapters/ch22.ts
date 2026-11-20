import type { TheoryChapter } from '../../types/vault';

export const CH22_KMP_Z_MANACHER: TheoryChapter = {
  slug: 'kmp-z-function-manacher',
  topicId: 'sg-62',
  title: 'KMP Prefix Function, Z-Algorithm & Manacher',
  domain: 'Strings & Geometry',
  ratingTier: '1600–1900',
  usacoDivision: 'Gold',
  subtitle:
    'Eliminate quadratic string-comparison backtracking with amortized O(N) KMP prefix borders, Z-box sliding intervals, and linear-time Manacher palindrome symmetry mirroring.',
  analogyTitle: 'The Recycled Bookmark & Mirror-Box Analogy',
  analogyBody:
    'Imagine checking whether a 10,000-letter DNA motif appears in a million-letter genome. A naive reader slides forward one letter and restarts from character 0 every time a mismatch occurs—wasting everything already read. Instead, **KMP** memorizes a "longest valid self-overlap bookmark" (`pi[i]`): upon a mismatch at position `j`, you snap back to `pi[j - 1]` without ever moving the text cursor backward! The **Z-Algorithm** tracks the rightmost exact match window `[L, R]` (`z[i]` = LCP of `s` and `s[i..]`), copying precomputed answers from `z[i - L]` inside the window and only advancing `R` forward at most `N` times total. **Manacher’s Algorithm** applies that exact same `[L, R]` box mirroring trick around palindromic centers (`R = 2*C - i` mirror reflection) over a `#`-interleaved string so both odd and even palindromes run in strict `O(N)`.',
  prerequisites: [],
  traceTitle: 'Interactive KMP Prefix Function (pi[]) & Z-Box Pointer Movement Trace',
  traceSubtitle:
    'Step through `S = "abacaba"` (and Z-box `[L, R]` window expansions) to watch border fallbacks and Z-window reuse happen in O(N).',
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Step 1: Initialize pi[0] = 0 & Scan Prefix Borders Across "abacaba"',
      explanation:
        'At i = 0, a proper prefix must be shorter than the whole substring, so pi[0] = 0. At i = 1 ("b") and i = 2 ("a"): s[2]==s[0] ("a"), so pi[2] = 1 while j advances to 1.',
      mode: 'array',
      arrays: [
        {
          name: 'Chars S',
          cells: [
            { index: 0, value: 'a', highlight: 'window' },
            { index: 1, value: 'b', highlight: 'neutral' },
            { index: 2, value: 'a', highlight: 'active' },
            { index: 3, value: 'c', highlight: 'neutral' },
            { index: 4, value: 'a', highlight: 'neutral' },
            { index: 5, value: 'b', highlight: 'neutral' },
            { index: 6, value: 'a', highlight: 'neutral' },
          ],
        },
        {
          name: 'KMP pi[]',
          cells: [
            { index: 0, value: 0, highlight: 'neutral' },
            { index: 1, value: 0, highlight: 'neutral' },
            { index: 2, value: 1, highlight: 'updated' },
            { index: 3, value: '-', highlight: 'neutral' },
            { index: 4, value: '-', highlight: 'neutral' },
            { index: 5, value: '-', highlight: 'neutral' },
            { index: 6, value: '-', highlight: 'neutral' },
          ],
        },
      ],
      variables: { i: 2, j: 1, Match: "'a' == 'a'", 'pi[2]': 1 },
    },
    {
      stepNumber: 2,
      title: 'Step 2: Mismatch at i = 3 ("c") Triggers Border Fallback j = pi[j - 1] = 0',
      explanation:
        'Compare s[3]="c" against s[j=1]="b": mismatch! Rather than restarting i, KMP falls back j = pi[0] = 0, compares s[3]="c" vs s[0]="a" (still mismatch), setting pi[3] = 0.',
      mode: 'array',
      arrays: [
        {
          name: 'Chars S',
          cells: [
            { index: 0, value: 'a', highlight: 'neutral' },
            { index: 1, value: 'b', highlight: 'neutral' },
            { index: 2, value: 'a', highlight: 'neutral' },
            { index: 3, value: 'c', highlight: 'active' },
            { index: 4, value: 'a', highlight: 'neutral' },
            { index: 5, value: 'b', highlight: 'neutral' },
            { index: 6, value: 'a', highlight: 'neutral' },
          ],
        },
        {
          name: 'KMP pi[]',
          cells: [
            { index: 0, value: 0, highlight: 'neutral' },
            { index: 1, value: 0, highlight: 'neutral' },
            { index: 2, value: 1, highlight: 'neutral' },
            { index: 3, value: 0, highlight: 'updated' },
            { index: 4, value: '-', highlight: 'neutral' },
            { index: 5, value: '-', highlight: 'neutral' },
            { index: 6, value: '-', highlight: 'neutral' },
          ],
        },
      ],
      variables: { i: 3, PrevJ: 1, FallbackJ: 'pi[0] = 0', 'pi[3]': 0 },
    },
    {
      stepNumber: 3,
      title: 'Step 3: Suffix "aba" Rebuilds Prefix Overlap pi[4..6] = [1, 2, 3]',
      explanation:
        'Positions 4, 5, 6 ("a","b","a") sequentially match s[0], s[1], s[2], advancing j from 0 -> 1 -> 2 -> 3. Thus pi = [0, 0, 1, 0, 1, 2, 3] (borders of lengths 3 and 1 exist!).',
      mode: 'array',
      arrays: [
        {
          name: 'Chars S',
          cells: [
            { index: 0, value: 'a', highlight: 'window' },
            { index: 1, value: 'b', highlight: 'window' },
            { index: 2, value: 'a', highlight: 'window' },
            { index: 3, value: 'c', highlight: 'neutral' },
            { index: 4, value: 'a', highlight: 'active' },
            { index: 5, value: 'b', highlight: 'active' },
            { index: 6, value: 'a', highlight: 'active' },
          ],
        },
        {
          name: 'KMP pi[]',
          cells: [
            { index: 0, value: 0, highlight: 'neutral' },
            { index: 1, value: 0, highlight: 'neutral' },
            { index: 2, value: 1, highlight: 'neutral' },
            { index: 3, value: 0, highlight: 'neutral' },
            { index: 4, value: 1, highlight: 'updated' },
            { index: 5, value: 2, highlight: 'updated' },
            { index: 6, value: 3, highlight: 'updated' },
          ],
        },
      ],
      variables: { LongestBorder: 3, SecondBorder: 'pi[2] = 1', MinPeriod: '7 - 3 = 4' },
    },
    {
      stepNumber: 4,
      title: 'Step 4: Z-Box Mirroring on "abacaba" Reuses z[i - L] Inside [L=4, R=6]',
      explanation:
        'For Z-Algorithm: at i=4, matching "aba" creates Z-box [L=4, R=6] with z[4]=3. Next at i=5, i <= R so z[5] starts at min(R - i + 1 = 2, z[5 - 4] = z[1] = 0) = 0 in O(1)! At i=6, min(1, z[2]=1)=1 -> z[6]=1.',
      mode: 'array',
      arrays: [
        {
          name: 'Chars S',
          cells: [
            { index: 0, value: 'a', highlight: 'neutral' },
            { index: 1, value: 'b', highlight: 'neutral' },
            { index: 2, value: 'a', highlight: 'neutral' },
            { index: 3, value: 'c', highlight: 'neutral' },
            { index: 4, value: 'a', highlight: 'window' },
            { index: 5, value: 'b', highlight: 'window' },
            { index: 6, value: 'a', highlight: 'window' },
          ],
        },
        {
          name: 'Z-Array z[]',
          cells: [
            { index: 0, value: 0, highlight: 'neutral' },
            { index: 1, value: 0, highlight: 'neutral' },
            { index: 2, value: 1, highlight: 'neutral' },
            { index: 3, value: 0, highlight: 'neutral' },
            { index: 4, value: 3, highlight: 'updated' },
            { index: 5, value: 0, highlight: 'updated' },
            { index: 6, value: 1, highlight: 'updated' },
          ],
        },
      ],
      variables: { ZBox_L: 4, ZBox_R: 6, 'Mirror(5)': 'z[5-4]=z[1]=0', 'Mirror(6)': 'min(1, z[2])=1' },
    },
  ],
  reductionClues: [
    {
      clue: '"Find all occurrences of pattern P inside text T (including overlapping matches)"',
      translation:
        'Compute `pi[]` (KMP) or `z[]` (Z-function) on `P + "#" + T` where `#` never appears in `P` or `T`; every index with `pi[i] == |P|` or `z[i] == |P|` is an exact occurrence.',
    },
    {
      clue: '"Smallest repeating period / cyclic shift equivalence / string compression"',
      translation:
        'Smallest period of `S[0..N-1]` (allowing a partial last block) is always `p = N - pi[N - 1]`. It divides `N` evenly iff `N % p == 0`.',
    },
    {
      clue: '"List all borders (prefixes that are also suffixes) or count occurrences of every prefix"',
      translation:
        'Walk `k = pi[N - 1]`, `k = pi[k - 1]` down to `0` for all borders! For prefix-frequency counting, accumulate `cnt[pi[i]]++` backward from `N` down to `1`: `ans[pi[i - 1]] += ans[i]`.',
    },
    {
      clue: '"Longest palindromic substring OR count total palindromic substrings in O(N)"',
      translation:
        'Transform `"abba"` into `"^#a#b#b#a#$"` (with unique sentinels `^`, `$`), run Manacher’s `p[i]` radius array in `O(N)`, then `maxLen = max(p[i])` and total palindromic substrings = `sum((p[i] + 1) / 2)` (over `#`/char centers).',
    },
  ],
  timeComplexity: 'KMP / Z-Algorithm / Manacher: Strictly O(N + M)',
  spaceComplexity: 'O(N + M)',
  pitfalls: [
    {
      type: 'WA',
      title: 'Choosing a Separator Character That Already Exists in the Alphabet',
      detail:
        'Running `P + "#" + T` when `#` can appear inside `P` or `T` corrupts `pi[]` / `z[]` across the boundary! Either pick a character guaranteed outside the alphabet (e.g., `\\0` or `int` sentinel `-1`) or compute `pi[]` on `P` alone and stream `T` against it.',
    },
    {
      type: 'WA',
      title: 'Missing Length Bounds on Z-Box Mirroring (i + z[i] < n)',
      detail:
        'In the Z-Algorithm loop, always check `i + z[i] < n` before comparing `s[z[i]] == s[i + z[i]]`, and only update `l = i; r = i + z[i] - 1` when `i + z[i] - 1 > r` (or half-open `[l, r)` when `i + z[i] > r`).',
    },
    {
      type: 'WA',
      title: 'Off-by-One Center & Radius Conversion in Manacher’s Algorithm',
      detail:
        'On `#`-interleaved string `t = "^#s0#s1#...#$"`, `p[i]` equals the **half-radius excluding the center in `t`**, which miraculously equals the exact **length of the original palindrome in `s`**! Its start index in `s` is simply `(i - 1 - p[i]) / 2`—double-check this invariant on both `"aba"` and `"abba"`.',
    },
    {
      type: 'RE',
      title: 'Calling pi[j - 1] When j == 0',
      detail:
        'Always write `while (j > 0 && s[i] != s[j]) j = pi[j - 1];` with `j > 0` checked first so you never index `pi[-1]`.',
    },
  ],
  implementations: {
    cpp20: `#include <bits/stdc++.h>
using namespace std;

// Complete Linear String Toolkit: KMP Prefix Function, Z-Algorithm & Manacher
// Time: O(N) each | Space: O(N)
vector<int> prefix_function(const string& s) {
    int n = (int)s.size();
    vector<int> pi(n, 0);
    for (int i = 1; i < n; i++) {
        int j = pi[i - 1];
        while (j > 0 && s[i] != s[j]) j = pi[j - 1];
        if (s[i] == s[j]) j++;
        pi[i] = j;
    }
    return pi;
}

vector<int> z_function(const string& s) {
    int n = (int)s.size();
    vector<int> z(n, 0);
    int l = 0, r = 0;
    for (int i = 1; i < n; i++) {
        if (i < r) z[i] = min(r - i, z[i - l]);
        while (i + z[i] < n && s[z[i]] == s[i + z[i]]) z[i]++;
        if (i + z[i] > r) {
            l = i;
            r = i + z[i];
        }
    }
    return z;
}

pair<int, int> manacher_longest(const string& s) {
    if (s.empty()) return {0, 0};
    string t = "^";
    t.reserve(2 * s.size() + 3);
    for (char c : s) {
        t.push_back('#');
        t.push_back(c);
    }
    t += "#$";

    int m = (int)t.size();
    vector<int> p(m, 0);
    int c = 0, r = 0;
    int bestLen = 0, bestCenter = 0;

    for (int i = 1; i < m - 1; i++) {
        int mir = 2 * c - i;
        if (i < r) p[i] = min(r - i, p[mir]);
        while (t[i + 1 + p[i]] == t[i - 1 - p[i]]) p[i]++;
        if (i + p[i] > r) {
            c = i;
            r = i + p[i];
        }
        if (p[i] > bestLen) {
            bestLen = p[i];
            bestCenter = i;
        }
    }
    int start = (bestCenter - 1 - bestLen) / 2;
    return {start, bestLen};
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    string text, pat;
    if (!(cin >> text >> pat)) return 0;

    // 1. KMP pattern occurrences
    vector<int> pi = prefix_function(pat);
    int j = 0, hits = 0;
    for (char ch : text) {
        while (j > 0 && ch != pat[j]) j = pi[j - 1];
        if (ch == pat[j]) j++;
        if (j == (int)pat.size()) {
            hits++;
            j = pi[j - 1];
        }
    }

    // 2. Z-function verification on text
    vector<int> z = z_function(text);
    // 3. Manacher longest palindrome in text
    auto [palStart, palLen] = manacher_longest(text);

    cout << hits << " " << z.size() << " " << text.substr(palStart, palLen) << "\\n";
    return 0;
}`,
    rust: `use std::io::{self, Read};

fn prefix_function(s: &[u8]) -> Vec<usize> {
    let n = s.len();
    let mut pi = vec![0usize; n];
    for i in 1..n {
        let mut j = pi[i - 1];
        while j > 0 && s[i] != s[j] {
            j = pi[j - 1];
        }
        if s[i] == s[j] {
            j += 1;
        }
        pi[i] = j;
    }
    pi
}

fn z_function(s: &[u8]) -> Vec<usize> {
    let n = s.len();
    let mut z = vec![0usize; n];
    let (mut l, mut r) = (0usize, 0usize);
    for i in 1..n {
        if i < r {
            z[i] = (r - i).min(z[i - l]);
        }
        while i + z[i] < n && s[z[i]] == s[i + z[i]] {
            z[i] += 1;
        }
        if i + z[i] > r {
            l = i;
            r = i + z[i];
        }
    }
    z
}

fn manacher_longest(s: &[u8]) -> (usize, usize) {
    if s.is_empty() {
        return (0, 0);
    }
    let mut t = Vec::with_capacity(2 * s.len() + 3);
    t.push(b'^');
    for &b in s {
        t.push(b'#');
        t.push(b);
    }
    t.push(b'#');
    t.push(b'$');

    let m = t.len();
    let mut p = vec![0usize; m];
    let (mut c, mut r) = (0usize, 0usize);
    let (mut best_len, mut best_center) = (0usize, 0usize);

    for i in 1..m - 1 {
        if i < r {
            let mir = 2 * c - i;
            p[i] = (r - i).min(p[mir]);
        }
        while t[i + 1 + p[i]] == t[i - 1 - p[i]] {
            p[i] += 1;
        }
        if i + p[i] > r {
            c = i;
            r = i + p[i];
        }
        if p[i] > best_len {
            best_len = p[i];
            best_center = i;
        }
    }
    let start = (best_center - 1 - best_len) / 2;
    (start, best_len)
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let text = match it.next() {
        Some(v) => v.as_bytes(),
        None => return,
    };
    let pat = it.next().unwrap_or("").as_bytes();

    let pi = prefix_function(pat);
    let mut j = 0usize;
    let mut hits = 0usize;
    for &ch in text {
        while j > 0 && ch != pat[j] {
            j = pi[j - 1];
        }
        if !pat.is_empty() && ch == pat[j] {
            j += 1;
        }
        if !pat.is_empty() && j == pat.len() {
            hits += 1;
            j = pi[j - 1];
        }
    }

    let z = z_function(text);
    let (ps, pl) = manacher_longest(text);
    let pal = std::str::from_utf8(&text[ps..ps + pl]).unwrap();
    println!("{} {} {}", hits, z.len(), pal);
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

        String next() throws IOException {
            int c = readByte();
            while (c >= 0 && c <= ' ') c = readByte();
            if (c == -1) return null;
            StringBuilder sb = new StringBuilder();
            while (c > ' ') {
                sb.append((char) c);
                c = readByte();
            }
            return sb.toString();
        }
    }

    static int[] prefixFunction(String s) {
        int n = s.length();
        int[] pi = new int[n];
        for (int i = 1; i < n; i++) {
            int j = pi[i - 1];
            while (j > 0 && s.charAt(i) != s.charAt(j)) j = pi[j - 1];
            if (s.charAt(i) == s.charAt(j)) j++;
            pi[i] = j;
        }
        return pi;
    }

    static int[] zFunction(String s) {
        int n = s.length();
        int[] z = new int[n];
        int l = 0, r = 0;
        for (int i = 1; i < n; i++) {
            if (i < r) z[i] = Math.min(r - i, z[i - l]);
            while (i + z[i] < n && s.charAt(z[i]) == s.charAt(i + z[i])) z[i]++;
            if (i + z[i] > r) {
                l = i;
                r = i + z[i];
            }
        }
        return z;
    }

    static String manacherLongest(String s) {
        if (s.isEmpty()) return "";
        char[] t = new char[2 * s.length() + 3];
        t[0] = '^';
        int k = 1;
        for (int i = 0; i < s.length(); i++) {
            t[k++] = '#';
            t[k++] = s.charAt(i);
        }
        t[k++] = '#';
        t[k++] = '$';

        int m = t.length;
        int[] p = new int[m];
        int c = 0, r = 0, bestLen = 0, bestCenter = 0;
        for (int i = 1; i < m - 1; i++) {
            int mir = 2 * c - i;
            if (i < r) p[i] = Math.min(r - i, p[mir]);
            while (t[i + 1 + p[i]] == t[i - 1 - p[i]]) p[i]++;
            if (i + p[i] > r) {
                c = i;
                r = i + p[i];
            }
            if (p[i] > bestLen) {
                bestLen = p[i];
                bestCenter = i;
            }
        }
        int start = (bestCenter - 1 - bestLen) / 2;
        return s.substring(start, start + bestLen);
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        String text = fs.next();
        if (text == null) return;
        String pat = fs.next();

        int[] pi = prefixFunction(pat);
        int j = 0, hits = 0;
        for (int i = 0; i < text.length(); i++) {
            char ch = text.charAt(i);
            while (j > 0 && ch != pat.charAt(j)) j = pi[j - 1];
            if (ch == pat.charAt(j)) j++;
            if (j == pat.length()) {
                hits++;
                j = pi[j - 1];
            }
        }

        int[] z = zFunction(text);
        System.out.println(hits + " " + z.length + " " + manacherLongest(text));
    }
}`,
    python3: `import sys

sys.setrecursionlimit(200000)

def prefix_function(s: str) -> list[int]:
    n = len(s)
    pi = [0] * n
    for i in range(1, n):
        j = pi[i - 1]
        while j > 0 and s[i] != s[j]:
            j = pi[j - 1]
        if s[i] == s[j]:
            j += 1
        pi[i] = j
    return pi

def z_function(s: str) -> list[int]:
    n = len(s)
    z = [0] * n
    l = r = 0
    for i in range(1, n):
        if i < r:
            z[i] = min(r - i, z[i - l])
        while i + z[i] < n and s[z[i]] == s[i + z[i]]:
            z[i] += 1
        if i + z[i] > r:
            l, r = i, i + z[i]
    return z

def manacher_longest(s: str) -> str:
    if not s:
        return ""
    t = "^#" + "#".join(s) + "#$"
    m = len(t)
    p = [0] * m
    c = r = best_len = best_center = 0
    for i in range(1, m - 1):
        mir = 2 * c - i
        if i < r:
            p[i] = min(r - i, p[mir])
        while t[i + 1 + p[i]] == t[i - 1 - p[i]]:
            p[i] += 1
        if i + p[i] > r:
            c, r = i, i + p[i]
        if p[i] > best_len:
            best_len = p[i]
            best_center = i
    start = (best_center - 1 - best_len) // 2
    return s[start : start + best_len]

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    text, pat = data[0], data[1]
    pi = prefix_function(pat)
    j = 0
    hits = 0
    for ch in text:
        while j > 0 and ch != pat[j]:
            j = pi[j - 1]
        if ch == pat[j]:
            j += 1
        if j == len(pat):
            hits += 1
            j = pi[j - 1]
    z = z_function(text)
    print(f"{hits} {len(z)} {manacher_longest(text)}")

if __name__ == "__main__":
    solve()`,
    ruby: `def prefix_function(s)
  n = s.length
  pi = Array.new(n, 0)
  (1...n).each do |i|
    j = pi[i - 1]
    j = pi[j - 1] while j > 0 && s.getbyte(i) != s.getbyte(j)
    j += 1 if s.getbyte(i) == s.getbyte(j)
    pi[i] = j
  end
  pi
end

def z_function(s)
  n = s.length
  z = Array.new(n, 0)
  l = 0
  r = 0
  (1...n).each do |i|
    z[i] = [r - i, z[i - l]].min if i < r
    z[i] += 1 while i + z[i] < n && s.getbyte(z[i]) == s.getbyte(i + z[i])
    if i + z[i] > r
      l = i
      r = i + z[i]
    end
  end
  z
end

def manacher_longest(s)
  return "" if s.empty?
  t = +"^"
  s.each_byte do |b|
    t << "#"
    t << b.chr
  end
  t << "#$"
  m = t.length
  p = Array.new(m, 0)
  c = 0
  r = 0
  best_len = 0
  best_center = 0
  (1...(m - 1)).each do |i|
    mir = 2 * c - i
    p[i] = [r - i, p[mir]].min if i < r
    p[i] += 1 while t.getbyte(i + 1 + p[i]) == t.getbyte(i - 1 - p[i])
    if i + p[i] > r
      c = i
      r = i + p[i]
    end
    if p[i] > best_len
      best_len = p[i]
      best_center = i
    end
  end
  start = (best_center - 1 - best_len) / 2
  s[start, best_len]
end

tokens = $stdin.read.split
exit if tokens.size < 2
text = tokens[0]
pat = tokens[1]
pi = prefix_function(pat)
j = 0
hits = 0
text.each_byte do |b|
  j = pi[j - 1] while j > 0 && b != pat.getbyte(j)
  j += 1 if b == pat.getbyte(j)
  if j == pat.length
    hits += 1
    j = pi[j - 1]
  end
end
z = z_function(text)
puts "#{hits} #{z.length} #{manacher_longest(text)}"`,
  },
  practiceProblems: [
    {
      id: 'ch22-p1',
      tier: 'Warmup',
      ratingRange: '1400–1600',
      title: 'Exact String Matching & Occurrence Count (CSES String Matching)',
      statement:
        'Given a text string T and a pattern string P consisting of lowercase English letters, count how many times P occurs as a contiguous substring of T (overlapping occurrences count separately).',
      constraints: '1 <= |T|, |P| <= 10^6',
      sampleInput: 'saippuakauppias\npp',
      sampleOutput: '2',
      hints: [
        'Build the prefix function `pi` on P alone (`O(|P|)` memory) and stream characters of T across a single state variable `j`.',
        'Whenever `j == |P|`, increment your answer and fall back to `j = pi[j - 1]` so overlapping matches like "aa" in "aaaa" are counted.',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    string text, pat;
    if (!(cin >> text >> pat)) return 0;

    int m = (int)pat.size();
    vector<int> pi(m, 0);
    for (int i = 1; i < m; i++) {
        int j = pi[i - 1];
        while (j > 0 && pat[i] != pat[j]) j = pi[j - 1];
        if (pat[i] == pat[j]) j++;
        pi[i] = j;
    }

    int j = 0;
    long long ans = 0;
    for (char c : text) {
        while (j > 0 && c != pat[j]) j = pi[j - 1];
        if (c == pat[j]) j++;
        if (j == m) {
            ans++;
            j = pi[j - 1];
        }
    }
    cout << ans << "\\n";
    return 0;
}`,
        rust: `use std::io::{self, Read};

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let text = match it.next() {
        Some(v) => v.as_bytes(),
        None => return,
    };
    let pat = it.next().unwrap().as_bytes();
    let m = pat.len();
    let mut pi = vec![0usize; m];
    for i in 1..m {
        let mut j = pi[i - 1];
        while j > 0 && pat[i] != pat[j] {
            j = pi[j - 1];
        }
        if pat[i] == pat[j] {
            j += 1;
        }
        pi[i] = j;
    }
    let mut j = 0usize;
    let mut ans = 0u64;
    for &c in text {
        while j > 0 && c != pat[j] {
            j = pi[j - 1];
        }
        if c == pat[j] {
            j += 1;
        }
        if j == m {
            ans += 1;
            j = pi[j - 1];
        }
    }
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
        String next() throws IOException {
            int c = rb();
            while (c >= 0 && c <= ' ') c = rb();
            if (c == -1) return null;
            StringBuilder sb = new StringBuilder();
            while (c > ' ') { sb.append((char) c); c = rb(); }
            return sb.toString();
        }
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        String text = fs.next();
        if (text == null) return;
        String pat = fs.next();
        int m = pat.length();
        int[] pi = new int[m];
        for (int i = 1; i < m; i++) {
            int j = pi[i - 1];
            while (j > 0 && pat.charAt(i) != pat.charAt(j)) j = pi[j - 1];
            if (pat.charAt(i) == pat.charAt(j)) j++;
            pi[i] = j;
        }
        int j = 0;
        long ans = 0;
        for (int i = 0; i < text.length(); i++) {
            char c = text.charAt(i);
            while (j > 0 && c != pat.charAt(j)) j = pi[j - 1];
            if (c == pat.charAt(j)) j++;
            if (j == m) {
                ans++;
                j = pi[j - 1];
            }
        }
        System.out.println(ans);
    }
}`,
        python3: `import sys

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.read().split()
    if len(data) < 2:
        return
    text, pat = data[0], data[1]
    m = len(pat)
    pi = [0] * m
    for i in range(1, m):
        j = pi[i - 1]
        while j > 0 and pat[i] != pat[j]:
            j = pi[j - 1]
        if pat[i] == pat[j]:
            j += 1
        pi[i] = j

    j = 0
    ans = 0
    for c in text:
        while j > 0 and c != pat[j]:
            j = pi[j - 1]
        if c == pat[j]:
            j += 1
        if j == m:
            ans += 1
            j = pi[j - 1]
    print(ans)

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.size < 2
text = tokens[0]
pat = tokens[1]
m = pat.length
pi = Array.new(m, 0)
(1...m).each do |i|
  j = pi[i - 1]
  j = pi[j - 1] while j > 0 && pat.getbyte(i) != pat.getbyte(j)
  j += 1 if pat.getbyte(i) == pat.getbyte(j)
  pi[i] = j
end

j = 0
ans = 0
text.each_byte do |b|
  j = pi[j - 1] while j > 0 && b != pat.getbyte(j)
  j += 1 if b == pat.getbyte(j)
  if j == m
    ans += 1
    j = pi[j - 1]
  end
end
puts ans`,
      },
    },
    {
      id: 'ch22-p2',
      tier: 'Standard',
      ratingRange: '1650–1850',
      title: 'All Repeating Borders & Minimum Prefix Periods in O(N)',
      statement:
        'Given a string S of length N: (1) Find every proper border length k (1 <= k < N) where S[0..k-1] == S[N-k..N-1] in ascending order; (2) Find all valid repeating periods p (1 <= p <= N) such that S is a prefix of some repetition of S[0..p-1].',
      constraints: '1 <= N <= 10^6',
      sampleInput: 'abcabca',
      sampleOutput: '1 4\n3 6 7',
      hints: [
        'Line 1 (Borders): Start at `k = pi[n - 1]` and repeatedly jump `k = pi[k - 1]` until `k == 0`, then reverse to print ascending order.',
        'Line 2 (Periods): Every border length `k` corresponds to a valid period `n - k`! Adding `n` itself yields all periods in ascending order automatically.',
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
    vector<int> pi(n, 0);
    for (int i = 1; i < n; i++) {
        int j = pi[i - 1];
        while (j > 0 && s[i] != s[j]) j = pi[j - 1];
        if (s[i] == s[j]) j++;
        pi[i] = j;
    }

    vector<int> borders, periods;
    int k = pi[n - 1];
    while (k > 0) {
        borders.push_back(k);
        periods.push_back(n - k);
        k = pi[k - 1];
    }
    periods.push_back(n);
    reverse(borders.begin(), borders.end());

    for (size_t i = 0; i < borders.size(); i++) {
        if (i) cout << ' ';
        cout << borders[i];
    }
    cout << "\\n";
    for (size_t i = 0; i < periods.size(); i++) {
        if (i) cout << ' ';
        cout << periods[i];
    }
    cout << "\\n";
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
    let mut pi = vec![0usize; n];
    for i in 1..n {
        let mut j = pi[i - 1];
        while j > 0 && s[i] != s[j] {
            j = pi[j - 1];
        }
        if s[i] == s[j] {
            j += 1;
        }
        pi[i] = j;
    }

    let mut borders = Vec::new();
    let mut periods = Vec::new();
    let mut k = pi[n - 1];
    while k > 0 {
        borders.push(k.to_string());
        periods.push((n - k).to_string());
        k = pi[k - 1];
    }
    periods.push(n.to_string());
    borders.reverse();

    println!("{}", borders.join(" "));
    println!("{}", periods.join(" "));
}`,
        java21: `import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Collections;
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

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        String s = fs.next();
        if (s == null) return;
        int n = s.length();
        int[] pi = new int[n];
        for (int i = 1; i < n; i++) {
            int j = pi[i - 1];
            while (j > 0 && s.charAt(i) != s.charAt(j)) j = pi[j - 1];
            if (s.charAt(i) == s.charAt(j)) j++;
            pi[i] = j;
        }

        List<Integer> borders = new ArrayList<>();
        List<Integer> periods = new ArrayList<>();
        int k = pi[n - 1];
        while (k > 0) {
            borders.add(k);
            periods.add(n - k);
            k = pi[k - 1];
        }
        periods.add(n);
        Collections.reverse(borders);

        StringBuilder out = new StringBuilder();
        for (int i = 0; i < borders.size(); i++) {
            if (i > 0) out.append(' ');
            out.append(borders.get(i));
        }
        out.append('\\n');
        for (int i = 0; i < periods.size(); i++) {
            if (i > 0) out.append(' ');
            out.append(periods.get(i));
        }
        out.append('\\n');
        System.out.print(out);
    }
}`,
        python3: `import sys

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    s = data[0]
    n = len(s)
    pi = [0] * n
    for i in range(1, n):
        j = pi[i - 1]
        while j > 0 and s[i] != s[j]:
            j = pi[j - 1]
        if s[i] == s[j]:
            j += 1
        pi[i] = j

    borders = []
    periods = []
    k = pi[n - 1]
    while k > 0:
        borders.append(str(k))
        periods.append(str(n - k))
        k = pi[k - 1]
    periods.append(str(n))
    borders.reverse()

    print(" ".join(borders))
    print(" ".join(periods))

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
s = tokens[0]
n = s.length
pi = Array.new(n, 0)
(1...n).each do |i|
  j = pi[i - 1]
  j = pi[j - 1] while j > 0 && s.getbyte(i) != s.getbyte(j)
  j += 1 if s.getbyte(i) == s.getbyte(j)
  pi[i] = j
end

borders = []
periods = []
k = pi[n - 1]
while k > 0
  borders << k
  periods << (n - k)
  k = pi[k - 1]
end
periods << n
borders.reverse!

puts borders.join(" ")
puts periods.join(" ")`,
      },
    },
    {
      id: 'ch22-p3',
      tier: 'Boss',
      ratingRange: '1750–2000',
      title: 'Longest Palindromic Substring & Total Palindrome Count (Manacher O(N))',
      statement:
        'Given a string S of length up to 1,000,000, find in strict O(N) time and O(N) space: (1) The longest palindromic substring (if ties exist, output the leftmost one), and (2) The total number of non-empty palindromic substrings in S.',
      constraints: '1 <= |S| <= 10^6',
      sampleInput: 'aybabtu',
      sampleOutput: 'bab\n9',
      hints: [
        'Transform S into T = "^#s0#s1#...#$" so every palindrome (both odd and even length) becomes odd-centered in T.',
        'At center i in T, `p[i]` is both the exact length of the longest original palindrome centered there AND contributes `(p[i] + 1) / 2` distinct palindromic substrings.',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    string s;
    if (!(cin >> s)) return 0;

    string t = "^";
    t.reserve(2 * s.size() + 3);
    for (char ch : s) {
        t.push_back('#');
        t.push_back(ch);
    }
    t += "#$";

    int m = (int)t.size();
    vector<int> p(m, 0);
    int c = 0, r = 0;
    int bestLen = 0, bestCenter = 0;
    long long totalPalindromes = 0;

    for (int i = 1; i < m - 1; i++) {
        int mir = 2 * c - i;
        if (i < r) p[i] = min(r - i, p[mir]);
        while (t[i + 1 + p[i]] == t[i - 1 - p[i]]) p[i]++;
        if (i + p[i] > r) {
            c = i;
            r = i + p[i];
        }
        if (p[i] > bestLen) {
            bestLen = p[i];
            bestCenter = i;
        }
        totalPalindromes += (p[i] + 1) / 2;
    }

    int start = (bestCenter - 1 - bestLen) / 2;
    cout << s.substr(start, bestLen) << "\\n";
    cout << totalPalindromes << "\\n";
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

    let mut t = Vec::with_capacity(2 * s.len() + 3);
    t.push(b'^');
    for &b in s {
        t.push(b'#');
        t.push(b);
    }
    t.push(b'#');
    t.push(b'$');

    let m = t.len();
    let mut p = vec![0usize; m];
    let (mut c, mut r) = (0usize, 0usize);
    let (mut best_len, mut best_center) = (0usize, 0usize);
    let mut total_pal = 0u64;

    for i in 1..m - 1 {
        if i < r {
            let mir = 2 * c - i;
            p[i] = (r - i).min(p[mir]);
        }
        while t[i + 1 + p[i]] == t[i - 1 - p[i]] {
            p[i] += 1;
        }
        if i + p[i] > r {
            c = i;
            r = i + p[i];
        }
        if p[i] > best_len {
            best_len = p[i];
            best_center = i;
        }
        total_pal += ((p[i] + 1) / 2) as u64;
    }

    let start = (best_center - 1 - best_len) / 2;
    let best_sub = std::str::from_utf8(&s[start..start + best_len]).unwrap();
    println!("{}", best_sub);
    println!("{}", total_pal);
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

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        String s = fs.next();
        if (s == null) return;

        int n = s.length();
        char[] t = new char[2 * n + 3];
        t[0] = '^';
        int k = 1;
        for (int i = 0; i < n; i++) {
            t[k++] = '#';
            t[k++] = s.charAt(i);
        }
        t[k++] = '#';
        t[k++] = '$';

        int m = t.length;
        int[] p = new int[m];
        int c = 0, r = 0, bestLen = 0, bestCenter = 0;
        long totalPal = 0;

        for (int i = 1; i < m - 1; i++) {
            int mir = 2 * c - i;
            if (i < r) p[i] = Math.min(r - i, p[mir]);
            while (t[i + 1 + p[i]] == t[i - 1 - p[i]]) p[i]++;
            if (i + p[i] > r) {
                c = i;
                r = i + p[i];
            }
            if (p[i] > bestLen) {
                bestLen = p[i];
                bestCenter = i;
            }
            totalPal += (p[i] + 1) / 2;
        }

        int start = (bestCenter - 1 - bestLen) / 2;
        System.out.println(s.substring(start, start + bestLen));
        System.out.println(totalPal);
    }
}`,
        python3: `import sys

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    s = data[0]
    t = "^#" + "#".join(s) + "#$"
    m = len(t)
    p = [0] * m
    c = r = best_len = best_center = 0
    total_pal = 0

    for i in range(1, m - 1):
        mir = 2 * c - i
        if i < r:
            p[i] = min(r - i, p[mir])
        while t[i + 1 + p[i]] == t[i - 1 - p[i]]:
            p[i] += 1
        if i + p[i] > r:
            c, r = i, i + p[i]
        if p[i] > best_len:
            best_len = p[i]
            best_center = i
        total_pal += (p[i] + 1) // 2

    start = (best_center - 1 - best_len) // 2
    print(s[start : start + best_len])
    print(total_pal)

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
s = tokens[0]
t = +"^"
s.each_byte do |b|
  t << "#"
  t << b.chr
end
t << "#$"

m = t.length
p = Array.new(m, 0)
c = 0
r = 0
best_len = 0
best_center = 0
total_pal = 0

(1...(m - 1)).each do |i|
  mir = 2 * c - i
  p[i] = [r - i, p[mir]].min if i < r
  p[i] += 1 while t.getbyte(i + 1 + p[i]) == t.getbyte(i - 1 - p[i])
  if i + p[i] > r
    c = i
    r = i + p[i]
  end
  if p[i] > best_len
    best_len = p[i]
    best_center = i
  end
  total_pal += (p[i] + 1) / 2
end

start = (best_center - 1 - best_len) / 2
puts s[start, best_len]
puts total_pal`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'CSES',
      title: 'Finding Borders, Finding Periods & Longest Palindrome',
      difficulty: 'Medium',
      url: 'https://cses.fi/problemset/task/1732',
      patternNote: 'Direct O(N) KMP border walking, period extraction (`n - pi[n - 1]`), and Manacher verification.',
    },
    {
      platform: 'AtCoder',
      title: 'ABC 257 G — Prefix Concatenation',
      difficulty: 'AtCoder Blue (~1750)',
      url: 'https://atcoder.jp/contests/abc257/tasks/abc257_g',
      patternNote: 'Z-function computes longest prefix-of-S match at each index of T, feeding an O(N) greedy jump or DP.',
    },
    {
      platform: 'Codeforces',
      title: 'CF 432D — Prefixes and Suffixes',
      difficulty: '2000 (Div.2)',
      url: 'https://codeforces.com/problemset/problem/432/D',
      patternNote: 'Combines KMP border chain (or Z-function suffix sums) to count all occurrences of every border.',
    },
    {
      platform: 'CodeChef',
      title: 'SEAPERM / INSQ15_A — Z-Function Prefix Queries',
      difficulty: 'CodeChef 4-Star',
      url: 'https://www.codechef.com/problems/INSQ15_A',
      patternNote: 'Answers O(1) LCP(S, S[i..]) queries using Z-box precomputation.',
    },
    {
      platform: 'HackerRank',
      title: 'String Similarity',
      difficulty: 'Hard',
      url: 'https://www.hackerrank.com/challenges/string-similarity/problem',
      patternNote: 'Total sum of `n + sum(z[1..n-1])` directly using the Z-Algorithm.',
    },
    {
      platform: 'NeetCode 150',
      title: 'Find the Index of the First Occurrence / Longest Palindromic Substring',
      difficulty: 'Medium',
      url: 'https://neetcode.io/practice',
      patternNote: 'Upgrades standard interview O(N^2) expand-around-center to linear O(N) Manacher & KMP.',
    },
  ],
  interviewNotes: [
    'Amortized O(N) proof for KMP: `j` increases by at most +1 per outer loop iteration (at most N total increments), and each `j = pi[j - 1]` strictly decreases `j` while keeping `j >= 0`, bounding total `while` steps to <= N.',
    'When asked for Longest Palindromic Substring in interviews: explain center-expansion (O(N^2) time, O(1) space) first, then cite Manacher’s mirror invariant `p[i] >= min(R - i, p[2*C - i])` for O(N) worst-case guarantees.',
    'Explain why Z-Algorithm is often cleaner than KMP for LCP(S, S[i..]) queries: `z[i]` gives the forward match length immediately without walking back border pointers.',
  ],
  projectBlueprint: {
    title: 'High-Speed Genomic Sequence Pattern Matcher',
    tagline:
      'Scan multi-megabase FASTA chromosomes for exact motifs, tandem repeating periods, and palindromic hairpin loops in linear O(N) time.',
    stackSummary: 'TypeScript Engine • Linear KMP Scanner • Z-Box Motif Indexer • Manacher Hairpin Detector',
    asciiDiagram: `FASTA Sequence Stream (A/C/G/T, up to 10^7 bp)
   |
   +--> [ KMP Automaton (pi[]) ]  -----> Exact CRISPR / Primer Motif Positions
   |
   +--> [ Z-Box Sliding Window ]  -----> Longest Common Prefix & Overlap Score
   |
   +--> [ Manacher (#-Interleave) ] ---> Palindromic Hairpin / Restriction Sites`,
    milestones: [
      {
        id: 'ch22-m1',
        title: 'Build Streaming KMP Motif Scanner',
        detail: 'Compile primer patterns into compact `Int32Array` prefix tables (`pi[]`) so streaming arbitrarily large FASTA reads runs in O(|Pattern|) extra RAM.',
      },
      {
        id: 'ch22-m2',
        title: 'Add Z-Algorithm Tandem Repeat & Period Detector',
        detail: 'Compute `z[]` across queried gene windows to detect exact tandem repeats and partial-block periodicities.',
      },
      {
        id: 'ch22-m3',
        title: 'Integrate Manacher Hairpin Palindrome Inspector',
        detail: 'Run O(N) Manacher over sequences (and reverse-complement pairs) to flag restriction enzyme sites and inverted hairpin loops.',
      },
      {
        id: 'ch22-m4',
        title: 'Emit Structured Genomic Annotation Report',
        detail: 'Return sorted motif offsets, minimum period, and top-K longest palindromic spans with zero quadratic bottlenecks.',
      },
    ],
    starterCode: `export interface GenomicScanReport {
  motifHits: number[];
  minPeriod: number;
  isExactPeriodic: boolean;
  longestPalindrome: { start: number; length: number; sequence: string };
}

export class GenomicSequenceMatcher {
  static prefixFunction(s: string): Int32Array {
    const n = s.length;
    const pi = new Int32Array(n);
    for (let i = 1; i < n; i++) {
      let j = pi[i - 1];
      while (j > 0 && s.charCodeAt(i) !== s.charCodeAt(j)) {
        j = pi[j - 1];
      }
      if (s.charCodeAt(i) === s.charCodeAt(j)) j++;
      pi[i] = j;
    }
    return pi;
  }

  static zFunction(s: string): Int32Array {
    const n = s.length;
    const z = new Int32Array(n);
    let l = 0;
    let r = 0;
    for (let i = 1; i < n; i++) {
      if (i < r) z[i] = Math.min(r - i, z[i - l]);
      while (i + z[i] < n && s.charCodeAt(z[i]) === s.charCodeAt(i + z[i])) {
        z[i]++;
      }
      if (i + z[i] > r) {
        l = i;
        r = i + z[i];
      }
    }
    return z;
  }

  static findAllMotifs(genome: string, motif: string): number[] {
    if (!motif.length || genome.length < motif.length) return [];
    const pi = this.prefixFunction(motif);
    const hits: number[] = [];
    let j = 0;
    for (let i = 0; i < genome.length; i++) {
      const ch = genome.charCodeAt(i);
      while (j > 0 && ch !== motif.charCodeAt(j)) j = pi[j - 1];
      if (ch === motif.charCodeAt(j)) j++;
      if (j === motif.length) {
        hits.push(i - motif.length + 1);
        j = pi[j - 1];
      }
    }
    return hits;
  }

  static longestPalindrome(s: string): { start: number; length: number; sequence: string } {
    if (!s.length) return { start: 0, length: 0, sequence: '' };
    const t = '^#' + s.split('').join('#') + '#$';
    const m = t.length;
    const p = new Int32Array(m);
    let c = 0;
    let r = 0;
    let bestLen = 0;
    let bestCenter = 0;

    for (let i = 1; i < m - 1; i++) {
      const mir = 2 * c - i;
      if (i < r) p[i] = Math.min(r - i, p[mir]);
      while (t.charCodeAt(i + 1 + p[i]) === t.charCodeAt(i - 1 - p[i])) {
        p[i]++;
      }
      if (i + p[i] > r) {
        c = i;
        r = i + p[i];
      }
      if (p[i] > bestLen) {
        bestLen = p[i];
        bestCenter = i;
      }
    }
    const start = Math.floor((bestCenter - 1 - bestLen) / 2);
    return { start, length: bestLen, sequence: s.slice(start, start + bestLen) };
  }

  static analyzeSequence(genome: string, motif: string): GenomicScanReport {
    const pi = this.prefixFunction(genome);
    const n = genome.length;
    const minPeriod = n === 0 ? 0 : n - pi[n - 1];
    return {
      motifHits: this.findAllMotifs(genome, motif),
      minPeriod,
      isExactPeriodic: n > 0 && n % minPeriod === 0,
      longestPalindrome: this.longestPalindrome(genome),
    };
  }
}`,
  },
};
