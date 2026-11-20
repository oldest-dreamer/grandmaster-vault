import type { TheoryChapter } from '../../types/vault';

export const CH24_SUFFIX_ARRAY_LCP: TheoryChapter = {
  slug: 'suffix-array-lcp-kasai',
  topicId: 'sg-64',
  title: 'Suffix Array, Kasai LCP & RMQ Substring Ordering',
  domain: 'Strings & Geometry',
  ratingTier: '2200–2600',
  usacoDivision: 'Platinum',
  subtitle:
    'Sort all N cyclic shifts and suffixes in O(N log N) via prefix doubling + radix counting sort, compute adjacent longest common prefixes in O(N) via Kasai’s lemma, and answer O(1) arbitrary substring comparisons with Sparse Table RMQ.',
  analogyTitle: 'The Dictionary Thumb-Index & Overlapping Page Bookmark Analogy',
  analogyBody:
    'Suppose a 500,000-page encyclopedia is shredded into every possible ending ("suffix"), and you need to sort all 500,000 endings alphabetically. Sorting from scratch compares millions of letters per pair—far too slow. **Prefix Doubling** behaves like sorting book spines by comparing 1 letter first, then pasting the rank of "page + 1" right beside it to sort 2-letter prefixes in one pass, then pasting the rank of "page + 2" to sort 4-letter prefixes, 8-letter prefixes, and so on—finishing in just `log2(N)` radix sweeps! Next, **Kasai’s Algorithm** measures how many starting letters adjacent dictionary entries share (`LCP[i]`), realizing that stepping one letter deeper into the book (`i -> i + 1`) shrinks shared overlap by at most `1` (`h >= max(0, h - 1)`), yielding all LCPs in `O(N)`. With a **Sparse Table** over `LCP[]`, any two substrings in the entire book can be lexicographically compared in `O(1)`.',
  prerequisites: [
    {
      slug: 'sparse-table-rmq',
      title: 'Sparse Table & Disjoint Sparse Table (O(1) RMQ)',
    },
    {
      slug: 'kmp-z-function-manacher',
      title: 'KMP Prefix Function, Z-Algorithm & Manacher',
    },
  ],
  traceTitle: 'Interactive Prefix Doubling, Radix Buckets & Kasai LCP Trace',
  traceSubtitle:
    'Step through building the Suffix Array (`sa[]`) and `lcp[]` on `"banana$"` (`n = 7`) from k = 1 doubling rounds through Kasai’s `O(N)` pass.',
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Step 1: Append Sentinel "$" & Counting-Sort Length-1 Prefixes (k = 1)',
      explanation:
        'Appending "$" (smaller than "a".."z") ensures every suffix ends uniquely. Group length-1 characters into equivalence classes: $=0, a=1, b=2, n=3. Initial order SA = [6("$"), 5("a"), 3("a"), 1("a"), 0("b"), 4("n"), 2("n")].',
      mode: 'array',
      arrays: [
        {
          name: 'Chars S',
          cells: [
            { index: 0, value: 'b', highlight: 'neutral' },
            { index: 1, value: 'a', highlight: 'window' },
            { index: 2, value: 'n', highlight: 'neutral' },
            { index: 3, value: 'a', highlight: 'window' },
            { index: 4, value: 'n', highlight: 'neutral' },
            { index: 5, value: 'a', highlight: 'window' },
            { index: 6, value: '$', highlight: 'active' },
          ],
        },
        {
          name: 'SA (k=1)',
          cells: [
            { index: 0, value: 6, label: '$', highlight: 'active' },
            { index: 1, value: 1, label: 'a', highlight: 'window' },
            { index: 2, value: 3, label: 'a', highlight: 'window' },
            { index: 3, value: 5, label: 'a', highlight: 'window' },
            { index: 4, value: 0, label: 'b', highlight: 'neutral' },
            { index: 5, value: 2, label: 'n', highlight: 'neutral' },
            { index: 6, value: 4, label: 'n', highlight: 'neutral' },
          ],
        },
        {
          name: 'Class rk[]',
          cells: [
            { index: 0, value: 2, highlight: 'neutral' },
            { index: 1, value: 1, highlight: 'window' },
            { index: 2, value: 3, highlight: 'neutral' },
            { index: 3, value: 1, highlight: 'window' },
            { index: 4, value: 3, highlight: 'neutral' },
            { index: 5, value: 1, highlight: 'window' },
            { index: 6, value: 0, highlight: 'active' },
          ],
        },
      ],
      variables: { StepK: 1, DistinctClasses: 4, SentinelIdx: 6 },
    },
    {
      stepNumber: 2,
      title: 'Step 2: Doubling Round k = 2 Sorts Pairs (rk[i], rk[i + 1]) via Radix Shift',
      explanation:
        'Shift every SA position backward by k=1 (`pn[i] = (sa[i] - 1 + n) % n`) so second halves are pre-sorted! Counting-sort by first half `rk[pn[i]]`: "a$" (idx 5) splits ahead of "an" (idx 1, 3), yielding 5 classes.',
      mode: 'array',
      arrays: [
        {
          name: 'SA (k=2)',
          cells: [
            { index: 0, value: 6, label: '$b', highlight: 'neutral' },
            { index: 1, value: 5, label: 'a$', highlight: 'updated' },
            { index: 2, value: 1, label: 'an', highlight: 'window' },
            { index: 3, value: 3, label: 'an', highlight: 'window' },
            { index: 4, value: 0, label: 'ba', highlight: 'neutral' },
            { index: 5, value: 2, label: 'na', highlight: 'neutral' },
            { index: 6, value: 4, label: 'na', highlight: 'neutral' },
          ],
        },
        {
          name: 'Class rk[]',
          cells: [
            { index: 0, value: 3, highlight: 'neutral' },
            { index: 1, value: 2, highlight: 'window' },
            { index: 2, value: 4, highlight: 'neutral' },
            { index: 3, value: 2, highlight: 'window' },
            { index: 4, value: 4, highlight: 'neutral' },
            { index: 5, value: 1, highlight: 'updated' },
            { index: 6, value: 0, highlight: 'neutral' },
          ],
        },
      ],
      variables: { StepK: 2, DistinctClasses: 5, SplitPair: 'a$ < an' },
    },
    {
      stepNumber: 3,
      title: 'Step 3: Doubling Round k = 4 Breaks All Remaining Ties (7 Distinct Classes)',
      explanation:
        'Shift by 2 and counting-sort pairs `(rk[i], rk[i + 2])`: "ana$" (idx 3) < "anan" (idx 1), and "na$" (idx 4) < "nana" (idx 2). All 7 suffixes now have unique ranks -> terminate early!',
      mode: 'array',
      arrays: [
        {
          name: 'Final SA[]',
          cells: [
            { index: 0, value: 6, label: '$', highlight: 'neutral' },
            { index: 1, value: 5, label: 'a$', highlight: 'active' },
            { index: 2, value: 3, label: 'ana$', highlight: 'active' },
            { index: 3, value: 1, label: 'anana$', highlight: 'active' },
            { index: 4, value: 0, label: 'banana$', highlight: 'neutral' },
            { index: 5, value: 4, label: 'na$', highlight: 'window' },
            { index: 6, value: 2, label: 'nana$', highlight: 'window' },
          ],
        },
        {
          name: 'Rank inv[]',
          cells: [
            { index: 0, value: 4, highlight: 'neutral' },
            { index: 1, value: 3, highlight: 'active' },
            { index: 2, value: 6, highlight: 'window' },
            { index: 3, value: 2, highlight: 'active' },
            { index: 4, value: 5, highlight: 'window' },
            { index: 5, value: 1, highlight: 'active' },
            { index: 6, value: 0, highlight: 'neutral' },
          ],
        },
      ],
      variables: { StepK: 4, DistinctClasses: 7, EarlyExit: 'classes == n' },
    },
    {
      stepNumber: 4,
      title: 'Step 4: Kasai Linear O(N) LCP Pass Drops Overlap h by At Most 1 Per Step',
      explanation:
        'Scan text order i = 0..5: at i=0 ("banana$" vs "anana$"), lcp[inv[0]=4]=0; at i=1 ("anana$" vs "ana$"), match len=3 -> lcp[3]=3; next i=2 ("nana$" vs "na$"), start from h=max(0, 3-1)=2 -> lcp[6]=2! Sum of real suffixes = 6+5+4+3+2+1=21, sum(lcp)=1+3+0+0+2=6 -> Distinct substrings = 21 - 6 = 15.',
      mode: 'array',
      arrays: [
        {
          name: 'SA[] (no $)',
          cells: [
            { index: 0, value: 5, label: 'a', highlight: 'neutral' },
            { index: 1, value: 3, label: 'ana', highlight: 'window' },
            { index: 2, value: 1, label: 'anana', highlight: 'active' },
            { index: 3, value: 0, label: 'banana', highlight: 'neutral' },
            { index: 4, value: 4, label: 'na', highlight: 'window' },
            { index: 5, value: 2, label: 'nana', highlight: 'active' },
          ],
        },
        {
          name: 'Kasai LCP[]',
          cells: [
            { index: 0, value: 1, label: 'a/ana', highlight: 'updated' },
            { index: 1, value: 3, label: 'ana/anana', highlight: 'active' },
            { index: 2, value: 0, label: 'anana/ban', highlight: 'neutral' },
            { index: 3, value: 0, label: 'ban/na', highlight: 'neutral' },
            { index: 4, value: 2, label: 'na/nana', highlight: 'updated' },
            { index: 5, value: 0, label: 'end', highlight: 'neutral' },
          ],
        },
      ],
      variables: { TotalSubstrings: 21, SumLCP: 6, DistinctSubstrings: 15, MaxRepeatedSubstr: 3 },
    },
  ],
  reductionClues: [
    {
      clue: '"Count distinct substrings OR find the K-th lexicographically smallest substring"',
      translation:
        'Distinct substrings = `N*(N+1)/2 - sum(LCP)`. For the K-th substring (distinct), subtract `(N - sa[i]) - lcp[i - 1]` suffix by suffix; for K-th including duplicates, binary search on SA + LCP intervals.',
    },
    {
      clue: '"Compare two arbitrary substrings S[l1..r1] and S[l2..r2] lexicographically in O(1)"',
      translation:
        'Build Sparse Table RMQ over `LCP[]` to get `lcp(i, j) = RMQ(min(rk[i], rk[j]), max(rk[i], rk[j]) - 1)` in `O(1)`. If `lcp >= min(len1, len2)`, shorter substring is smaller; else compare `S[l1 + lcp]` vs `S[l2 + lcp]`.',
    },
    {
      clue: '"Find the longest substring shared by at least M documents / all K strings"',
      translation:
        'Concatenate strings separated by **distinct** unique sentinels (`S1 + #1 + S2 + #2 ...`). Build SA + Kasai LCP, then slide a two-pointer `[L, R]` window over SA ensuring all K document IDs appear inside `[L, R]`, maximizing `RMQ(L, R - 1)`!',
    },
    {
      clue: '"Smallest cyclic shift OR longest repeated substring appearing >= K times"',
      translation:
        'For smallest cyclic shift, build cyclic Suffix Array of `S` (without `$`) and pick `sa[0]`. For longest substring repeated `>= K` times, find `max over i of min(lcp[i .. i + K - 2])` via a sliding-window monotonic deque of size `K - 1`.',
    },
  ],
  timeComplexity: 'SA Build (Doubling + Radix): O(N log N) | Kasai LCP: O(N) | Sparse Table LCP Query: O(1)',
  spaceComplexity: 'O(N) (or O(N log N) with Sparse Table)',
  pitfalls: [
    {
      type: 'WA',
      title: 'Forgetting a Sentinel or Reusing the Same Separator Between Multiple Strings',
      detail:
        'When concatenating `S1` and `S2` with a shared `#`, a match can cross `#` and falsely pretend characters from `S1` and `S2` form one continuous substring, or tie-break incorrectly at `#`. Always assign strictly distinct negative/high sentinels (`-1, -2, ...` or `256 + i`) strictly smaller than all alphabet characters!',
    },
    {
      type: 'WA',
      title: 'Off-by-One in LCP Indexing (lcp[i] = LCP(sa[i], sa[i+1]) vs. SA with "$")',
      detail:
        'If you build cyclic SA on `S + "$"`, index `sa[0]` is always `"$"`, and real suffixes sit at `sa[1..n]`. Also be consistent: if `lcp[rk[i]] = LCP(sa[rk[i]], sa[rk[i] + 1])`, then `LCP(sa[a], sa[b])` for `a < b` is `min(lcp[a .. b - 1])`—NEVER include `lcp[b]`!',
    },
    {
      type: 'RE',
      title: 'Counting Sort Array Alphabet Size Smaller Than String Length N',
      detail:
        'In round 1, classes fit in `max(256, N)` (e.g., ASCII values up to 255 or sentinel offset). Once doubling classes reach up to `N`, ensure `cnt` has size `max(alphabet, n)`—allocating only `256` causes out-of-bounds crashes as soon as `N > 256`!',
    },
    {
      type: 'WA',
      title: 'Integer Overflow in N*(N+1)/2 - sum(LCP) for N = 500,000',
      detail:
        'For `N = 5 * 10^5`, `N*(N+1)/2 ≈ 1.25 * 10^11`, which overflows signed 32-bit `int`. Always accumulate distinct substring counts in 64-bit integers (`long long` / `i64` / `long`).',
    },
  ],
  implementations: {
    cpp20: `#include <bits/stdc++.h>
using namespace std;

// O(N log N) Prefix-Doubling Suffix Array + O(N) Kasai LCP + O(N log N) Sparse Table RMQ
// Time: O(N log N) build, O(1) arbitrary LCP(i, j) | Space: O(N log N)
struct SuffixAutomataArray {
    int n;
    string s;
    vector<int> sa, rk, lcp;
    vector<vector<int>> st;
    vector<int> lg;

    explicit SuffixAutomataArray(const string& str) : s(str + "$") {
        n = (int)s.size();
        build_sa();
        build_lcp();
        build_rmq();
    }

    void build_sa() {
        const int alpha = max(256, n);
        sa.resize(n);
        rk.resize(n);
        vector<int> p(n), c(n), pn(n), cn(n), cnt(alpha, 0);

        for (int i = 0; i < n; i++) cnt[(unsigned char)s[i]]++;
        for (int i = 1; i < 256; i++) cnt[i] += cnt[i - 1];
        for (int i = n - 1; i >= 0; i--) p[--cnt[(unsigned char)s[i]]] = i;

        c[p[0]] = 0;
        int classes = 1;
        for (int i = 1; i < n; i++) {
            if (s[p[i]] != s[p[i - 1]]) classes++;
            c[p[i]] = classes - 1;
        }

        for (int h = 0; (1 << h) < n; h++) {
            int len = 1 << h;
            for (int i = 0; i < n; i++) {
                pn[i] = p[i] - len;
                if (pn[i] < 0) pn[i] += n;
            }
            fill(cnt.begin(), cnt.begin() + classes, 0);
            for (int i = 0; i < n; i++) cnt[c[pn[i]]]++;
            for (int i = 1; i < classes; i++) cnt[i] += cnt[i - 1];
            for (int i = n - 1; i >= 0; i--) p[--cnt[c[pn[i]]]] = pn[i];

            cn[p[0]] = 0;
            classes = 1;
            for (int i = 1; i < n; i++) {
                pair<int, int> cur = {c[p[i]], c[(p[i] + len) % n]};
                pair<int, int> prev = {c[p[i - 1]], c[(p[i - 1] + len) % n]};
                if (cur != prev) classes++;
                cn[p[i]] = classes - 1;
            }
            c.swap(cn);
            if (classes == n) break;
        }
        sa = move(p);
        for (int i = 0; i < n; i++) rk[sa[i]] = i;
    }

    void build_lcp() {
        lcp.assign(n, 0);
        int k = 0;
        for (int i = 0; i < n; i++) {
            if (rk[i] == n - 1) {
                k = 0;
                continue;
            }
            int j = sa[rk[i] + 1];
            while (i + k < n && j + k < n && s[i + k] == s[j + k]) k++;
            lcp[rk[i]] = k;
            if (k > 0) k--;
        }
    }

    void build_rmq() {
        lg.assign(n + 1, 0);
        for (int i = 2; i <= n; i++) lg[i] = lg[i / 2] + 1;
        int K = lg[n] + 1;
        st.assign(K, vector<int>(n, 0));
        for (int i = 0; i < n; i++) st[0][i] = lcp[i];
        for (int j = 1; j < K; j++) {
            for (int i = 0; i + (1 << j) <= n; i++) {
                st[j][i] = min(st[j - 1][i], st[j - 1][i + (1 << (j - 1))]);
            }
        }
    }

    int query_lcp(int i, int j) const {
        if (i == j) return (n - 1) - i;
        int ri = rk[i], rj = rk[j];
        if (ri > rj) swap(ri, rj);
        int k = lg[rj - ri];
        return min(st[k][ri], st[k][rj - (1 << k)]);
    }

    // Compare S[l1..r1] vs S[l2..r2] (0-indexed inclusive) in O(1)
    int compare_substrings(int l1, int r1, int l2, int r2) const {
        int len1 = r1 - l1 + 1, len2 = r2 - l2 + 1;
        int common = query_lcp(l1, l2);
        if (common >= min(len1, len2)) {
            if (len1 != len2) return len1 < len2 ? -1 : 1;
            return 0;
        }
        return s[l1 + common] < s[l2 + common] ? -1 : 1;
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    string s;
    if (!(cin >> s)) return 0;
    SuffixAutomataArray sa(s);

    // Output real suffixes (skip sa[0] which is "$")
    for (int i = 1; i < sa.n; i++) {
        if (i > 1) cout << ' ';
        cout << sa.sa[i];
    }
    cout << "\\n";
    for (int i = 1; i + 1 < sa.n; i++) {
        if (i > 1) cout << ' ';
        cout << sa.lcp[i];
    }
    cout << "\\n";
    return 0;
}`,
    rust: `use std::io::{self, Read};

struct SuffixArray {
    n: usize,
    s: Vec<u8>,
    sa: Vec<usize>,
    rk: Vec<usize>,
    lcp: Vec<usize>,
}

impl SuffixArray {
    fn new(input: &[u8]) -> Self {
        let mut s = input.to_vec();
        s.push(0); // sentinel strictly smaller than any ASCII letter
        let n = s.len();
        let alpha = n.max(256);

        let mut p = vec![0usize; n];
        let mut c = vec![0usize; n];
        let mut pn = vec![0usize; n];
        let mut cn = vec![0usize; n];
        let mut cnt = vec![0usize; alpha];

        for &b in &s {
            cnt[b as usize] += 1;
        }
        for i in 1..256 {
            cnt[i] += cnt[i - 1];
        }
        for i in (0..n).rev() {
            let ch = s[i] as usize;
            cnt[ch] -= 1;
            p[cnt[ch]] = i;
        }

        c[p[0]] = 0;
        let mut classes = 1usize;
        for i in 1..n {
            if s[p[i]] != s[p[i - 1]] {
                classes += 1;
            }
            c[p[i]] = classes - 1;
        }

        let mut len = 1usize;
        while len < n {
            for i in 0..n {
                pn[i] = if p[i] >= len { p[i] - len } else { p[i] + n - len };
            }
            cnt[..classes].fill(0);
            for i in 0..n {
                cnt[c[pn[i]]] += 1;
            }
            for i in 1..classes {
                cnt[i] += cnt[i - 1];
            }
            for i in (0..n).rev() {
                let cls = c[pn[i]];
                cnt[cls] -= 1;
                p[cnt[cls]] = pn[i];
            }

            cn[p[0]] = 0;
            classes = 1;
            for i in 1..n {
                let cur = (c[p[i]], c[(p[i] + len) % n]);
                let prev = (c[p[i - 1]], c[(p[i - 1] + len) % n]);
                if cur != prev {
                    classes += 1;
                }
                cn[p[i]] = classes - 1;
            }
            std::mem::swap(&mut c, &mut cn);
            if classes == n {
                break;
            }
            len <<= 1;
        }

        let mut rk = vec![0usize; n];
        for i in 0..n {
            rk[p[i]] = i;
        }

        let mut lcp = vec![0usize; n];
        let mut k = 0usize;
        for i in 0..n {
            if rk[i] == n - 1 {
                k = 0;
                continue;
            }
            let j = p[rk[i] + 1];
            while i + k < n && j + k < n && s[i + k] == s[j + k] {
                k += 1;
            }
            lcp[rk[i]] = k;
            if k > 0 {
                k -= 1;
            }
        }

        Self { n, s, sa: p, rk, lcp }
    }
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let word = match input.split_whitespace().next() {
        Some(v) => v.as_bytes(),
        None => return,
    };
    let sa = SuffixArray::new(word);
    let sa_str: Vec<String> = sa.sa[1..].iter().map(|x| x.to_string()).collect();
    let lcp_str: Vec<String> = sa.lcp[1..sa.n - 1].iter().map(|x| x.to_string()).collect();
    println!("{}", sa_str.join(" "));
    println!("{}", lcp_str.join(" "));
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

    static final class SuffixArray {
        final int n;
        final String s;
        final int[] sa, rk, lcp;

        SuffixArray(String str) {
            this.s = str + "\\0";
            this.n = s.length();
            int alpha = Math.max(256, n);
            int[] p = new int[n], c = new int[n], pn = new int[n], cn = new int[n], cnt = new int[alpha];

            for (int i = 0; i < n; i++) cnt[s.charAt(i)]++;
            for (int i = 1; i < 256; i++) cnt[i] += cnt[i - 1];
            for (int i = n - 1; i >= 0; i--) p[--cnt[s.charAt(i)]] = i;

            c[p[0]] = 0;
            int classes = 1;
            for (int i = 1; i < n; i++) {
                if (s.charAt(p[i]) != s.charAt(p[i - 1])) classes++;
                c[p[i]] = classes - 1;
            }

            for (int len = 1; len < n; len <<= 1) {
                for (int i = 0; i < n; i++) {
                    pn[i] = p[i] - len;
                    if (pn[i] < 0) pn[i] += n;
                }
                Arrays.fill(cnt, 0, classes, 0);
                for (int i = 0; i < n; i++) cnt[c[pn[i]]]++;
                for (int i = 1; i < classes; i++) cnt[i] += cnt[i - 1];
                for (int i = n - 1; i >= 0; i--) p[--cnt[c[pn[i]]]] = pn[i];

                cn[p[0]] = 0;
                classes = 1;
                for (int i = 1; i < n; i++) {
                    int a1 = c[p[i]], a2 = c[(p[i] + len) % n];
                    int b1 = c[p[i - 1]], b2 = c[(p[i - 1] + len) % n];
                    if (a1 != b1 || a2 != b2) classes++;
                    cn[p[i]] = classes - 1;
                }
                int[] tmp = c; c = cn; cn = tmp;
                if (classes == n) break;
            }

            this.sa = p;
            this.rk = new int[n];
            for (int i = 0; i < n; i++) rk[sa[i]] = i;

            this.lcp = new int[n];
            int k = 0;
            for (int i = 0; i < n; i++) {
                if (rk[i] == n - 1) { k = 0; continue; }
                int j = sa[rk[i] + 1];
                while (i + k < n && j + k < n && s.charAt(i + k) == s.charAt(j + k)) k++;
                lcp[rk[i]] = k;
                if (k > 0) k--;
            }
        }
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        String word = fs.next();
        if (word == null) return;
        SuffixArray sa = new SuffixArray(word);
        StringBuilder sb = new StringBuilder();
        for (int i = 1; i < sa.n; i++) {
            if (i > 1) sb.append(' ');
            sb.append(sa.sa[i]);
        }
        sb.append('\\n');
        for (int i = 1; i + 1 < sa.n; i++) {
            if (i > 1) sb.append(' ');
            sb.append(sa.lcp[i]);
        }
        System.out.println(sb);
    }
}`,
    python3: `import sys

sys.setrecursionlimit(200000)

def build_suffix_array(word: str) -> tuple[list[int], list[int], list[int]]:
    s = word + "\\0"
    n = len(s)
    alpha = max(256, n)
    p = [0] * n
    c = [0] * n
    cnt = [0] * alpha

    for ch in s:
        cnt[ord(ch)] += 1
    for i in range(1, 256):
        cnt[i] += cnt[i - 1]
    for i in range(n - 1, -1, -1):
        code = ord(s[i])
        cnt[code] -= 1
        p[cnt[code]] = i

    c[p[0]] = 0
    classes = 1
    for i in range(1, n):
        if s[p[i]] != s[p[i - 1]]:
            classes += 1
        c[p[i]] = classes - 1

    pn = [0] * n
    cn = [0] * n
    length = 1
    while length < n:
        for i in range(n):
            v = p[i] - length
            pn[i] = v + n if v < 0 else v
        for i in range(classes):
            cnt[i] = 0
        for i in range(n):
            cnt[c[pn[i]]] += 1
        for i in range(1, classes):
            cnt[i] += cnt[i - 1]
        for i in range(n - 1, -1, -1):
            cls = c[pn[i]]
            cnt[cls] -= 1
            p[cnt[cls]] = pn[i]

        cn[p[0]] = 0
        classes = 1
        for i in range(1, n):
            if c[p[i]] != c[p[i - 1]] or c[(p[i] + length) % n] != c[(p[i - 1] + length) % n]:
                classes += 1
            cn[p[i]] = classes - 1
        c, cn = cn, c
        if classes == n:
            break
        length <<= 1

    rk = [0] * n
    for i, pos in enumerate(p):
        rk[pos] = i

    lcp = [0] * n
    k = 0
    for i in range(n):
        if rk[i] == n - 1:
            k = 0
            continue
        j = p[rk[i] + 1]
        while i + k < n and j + k < n and s[i + k] == s[j + k]:
            k += 1
        lcp[rk[i]] = k
        if k > 0:
            k -= 1

    return p, rk, lcp

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    sa, _, lcp = build_suffix_array(data[0])
    print(" ".join(map(str, sa[1:])))
    print(" ".join(map(str, lcp[1:-1])))

if __name__ == "__main__":
    solve()`,
    ruby: `def build_suffix_array(word)
  s = word + "\0"
  n = s.bytesize
  alpha = [256, n].max
  p = Array.new(n, 0)
  c = Array.new(n, 0)
  cnt = Array.new(alpha, 0)

  bytes = s.bytes
  bytes.each { |b| cnt[b] += 1 }
  (1...256).each { |i| cnt[i] += cnt[i - 1] }
  (n - 1).downto(0) do |i|
    b = bytes[i]
    cnt[b] -= 1
    p[cnt[b]] = i
  end

  c[p[0]] = 0
  classes = 1
  (1...n).each do |i|
    classes += 1 if bytes[p[i]] != bytes[p[i - 1]]
    c[p[i]] = classes - 1
  end

  pn = Array.new(n, 0)
  cn = Array.new(n, 0)
  len = 1
  while len < n
    n.times do |i|
      v = p[i] - len
      pn[i] = v < 0 ? v + n : v
    end
    classes.times { |i| cnt[i] = 0 }
    n.times { |i| cnt[c[pn[i]]] += 1 }
    (1...classes).each { |i| cnt[i] += cnt[i - 1] }
    (n - 1).downto(0) do |i|
      cls = c[pn[i]]
      cnt[cls] -= 1
      p[cnt[cls]] = pn[i]
    end

    cn[p[0]] = 0
    classes = 1
    (1...n).each do |i|
      if c[p[i]] != c[p[i - 1]] || c[(p[i] + len) % n] != c[(p[i - 1] + len) % n]
        classes += 1
      end
      cn[p[i]] = classes - 1
    end
    c, cn = cn, c
    break if classes == n
    len <<= 1
  end

  rk = Array.new(n, 0)
  p.each_with_index { |pos, idx| rk[pos] = idx }

  lcp = Array.new(n, 0)
  k = 0
  n.times do |i|
    if rk[i] == n - 1
      k = 0
      next
    end
    j = p[rk[i] + 1]
    k += 1 while i + k < n && j + k < n && bytes[i + k] == bytes[j + k]
    lcp[rk[i]] = k
    k -= 1 if k > 0
  end

  [p, rk, lcp]
end

tokens = $stdin.read.split
exit if tokens.empty?
sa, _rk, lcp = build_suffix_array(tokens[0])
puts sa[1..].join(" ")
puts lcp[1...-1].join(" ")`,
  },
  practiceProblems: [
    {
      id: 'ch24-p1',
      tier: 'Warmup',
      ratingRange: '1900–2100',
      title: 'Substring Search & Lexicographical Substring Rank Queries',
      statement:
        'Given a base string S and Q pattern queries P_i, for each P_i output: (1) whether P_i appears in S ("YES" / "NO"), (2) how many times P_i occurs in S, and (3) its earliest 0-based start index (or -1).',
      constraints: '1 <= |S| <= 10^5, 1 <= Q <= 5 * 10^4, sum(|P_i|) <= 3 * 10^5',
      sampleInput: 'aybabtu\n3\nbab\nabc\na',
      sampleOutput: 'YES 1 2\nNO 0 -1\nYES 2 0',
      hints: [
        'Since all suffixes of S are sorted inside SA, all occurrences of P_i form one contiguous interval [L, R) in SA!',
        'Run two binary searches on SA[1..n] (`lower_bound` and `upper_bound`) comparing `S.substr(sa[mid], len(P))` against `P`. Once `[L, R)` is found, occurrence count is `R - L`, and earliest index is `RMQ_min(sa[L .. R - 1])`.',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    string raw;
    int q;
    if (!(cin >> raw >> q)) return 0;
    string s = raw + "$";
    int n = (int)s.size();
    int alpha = max(256, n);
    vector<int> p(n), c(n), pn(n), cn(n), cnt(alpha, 0);

    for (char ch : s) cnt[(unsigned char)ch]++;
    for (int i = 1; i < 256; i++) cnt[i] += cnt[i - 1];
    for (int i = n - 1; i >= 0; i--) p[--cnt[(unsigned char)s[i]]] = i;
    c[p[0]] = 0;
    int classes = 1;
    for (int i = 1; i < n; i++) {
        if (s[p[i]] != s[p[i - 1]]) classes++;
        c[p[i]] = classes - 1;
    }

    for (int len = 1; len < n; len <<= 1) {
        for (int i = 0; i < n; i++) {
            pn[i] = p[i] - len;
            if (pn[i] < 0) pn[i] += n;
        }
        fill(cnt.begin(), cnt.begin() + classes, 0);
        for (int i = 0; i < n; i++) cnt[c[pn[i]]]++;
        for (int i = 1; i < classes; i++) cnt[i] += cnt[i - 1];
        for (int i = n - 1; i >= 0; i--) p[--cnt[c[pn[i]]]] = pn[i];
        cn[p[0]] = 0;
        classes = 1;
        for (int i = 1; i < n; i++) {
            if (c[p[i]] != c[p[i - 1]] || c[(p[i] + len) % n] != c[(p[i - 1] + len) % n]) classes++;
            cn[p[i]] = classes - 1;
        }
        c.swap(cn);
        if (classes == n) break;
    }

    vector<int> lg(n + 1, 0);
    for (int i = 2; i <= n; i++) lg[i] = lg[i / 2] + 1;
    int K = lg[n] + 1;
    vector<vector<int>> minPos(K, vector<int>(n));
    for (int i = 0; i < n; i++) minPos[0][i] = p[i];
    for (int j = 1; j < K; j++) {
        for (int i = 0; i + (1 << j) <= n; i++) {
            minPos[j][i] = min(minPos[j - 1][i], minPos[j - 1][i + (1 << (j - 1))]);
        }
    }
    auto queryMinPos = [&](int l, int r) {
        int k = lg[r - l + 1];
        return min(minPos[k][l], minPos[k][r - (1 << k) + 1]);
    };

    auto cmpPrefix = [&](int saIdx, const string& pat) -> int {
        int start = p[saIdx];
        int m = (int)pat.size();
        for (int i = 0; i < m; i++) {
            if (start + i >= (int)raw.size()) return -1;
            if (raw[start + i] != pat[i]) return raw[start + i] < pat[i] ? -1 : 1;
        }
        return 0;
    };

    while (q--) {
        string pat;
        cin >> pat;
        int lo = 1, hi = n;
        while (lo < hi) {
            int mid = (lo + hi) >> 1;
            if (cmpPrefix(mid, pat) < 0) lo = mid + 1;
            else hi = mid;
        }
        int left = lo;
        lo = left; hi = n;
        while (lo < hi) {
            int mid = (lo + hi) >> 1;
            if (cmpPrefix(mid, pat) <= 0) lo = mid + 1;
            else hi = mid;
        }
        int right = lo;
        if (left == right) {
            cout << "NO 0 -1\\n";
        } else {
            cout << "YES " << (right - left) << " " << queryMinPos(left, right - 1) << "\\n";
        }
    }
    return 0;
}`,
        rust: `use std::cmp::Ordering;
use std::io::{self, Read};

fn build_sa(raw: &[u8]) -> Vec<usize> {
    let mut s = raw.to_vec();
    s.push(0);
    let n = s.len();
    let alpha = n.max(256);
    let mut p = vec![0usize; n];
    let mut c = vec![0usize; n];
    let mut pn = vec![0usize; n];
    let mut cn = vec![0usize; n];
    let mut cnt = vec![0usize; alpha];

    for &b in &s { cnt[b as usize] += 1; }
    for i in 1..256 { cnt[i] += cnt[i - 1]; }
    for i in (0..n).rev() { cnt[s[i] as usize] -= 1; p[cnt[s[i] as usize]] = i; }

    c[p[0]] = 0;
    let mut classes = 1usize;
    for i in 1..n {
        if s[p[i]] != s[p[i - 1]] { classes += 1; }
        c[p[i]] = classes - 1;
    }

    let mut len = 1usize;
    while len < n {
        for i in 0..n { pn[i] = if p[i] >= len { p[i] - len } else { p[i] + n - len }; }
        cnt[..classes].fill(0);
        for i in 0..n { cnt[c[pn[i]]] += 1; }
        for i in 1..classes { cnt[i] += cnt[i - 1]; }
        for i in (0..n).rev() { let cls = c[pn[i]]; cnt[cls] -= 1; p[cnt[cls]] = pn[i]; }
        cn[p[0]] = 0;
        classes = 1;
        for i in 1..n {
            if c[p[i]] != c[p[i - 1]] || c[(p[i] + len) % n] != c[(p[i - 1] + len) % n] { classes += 1; }
            cn[p[i]] = classes - 1;
        }
        std::mem::swap(&mut c, &mut cn);
        if classes == n { break; }
        len <<= 1;
    }
    p
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let raw = match it.next() {
        Some(v) => v.as_bytes(),
        None => return,
    };
    let q: usize = it.next().unwrap().parse().unwrap();
    let sa = build_sa(raw);
    let n = sa.len();

    let mut lg = vec![0usize; n + 1];
    for i in 2..=n { lg[i] = lg[i / 2] + 1; }
    let k_max = lg[n] + 1;
    let mut st = vec![vec![0usize; n]; k_max];
    st[0].copy_from_slice(&sa);
    for j in 1..k_max {
        for i in 0..=n.saturating_sub(1 << j) {
            st[j][i] = st[j - 1][i].min(st[j - 1][i + (1 << (j - 1))]);
        }
    }

    let mut out = String::new();
    for _ in 0..q {
        let pat = it.next().unwrap().as_bytes();
        let m = pat.len();
        let cmp_sa = |idx: usize| -> Ordering {
            let st_pos = sa[idx];
            let end = (st_pos + m).min(raw.len());
            raw[st_pos..end].cmp(pat)
        };

        let left = sa.partition_point(|&st_pos| {
            let end = (st_pos + m).min(raw.len());
            raw[st_pos..end] < *pat
        }).max(1);
        let right = (left..n).position(|i| cmp_sa(i) == Ordering::Greater).map(|d| left + d).unwrap_or(n);
        if left >= right {
            out.push_str("NO 0 -1\\n");
        } else {
            let k = lg[right - left];
            let min_idx = st[k][left].min(st[k][right - (1 << k)]);
            out.push_str(&format!("YES {} {}\\n", right - left, min_idx));
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
        int nextInt() throws IOException { return Integer.parseInt(next()); }
    }

    static int[] buildSA(String raw) {
        String s = raw + "\\0";
        int n = s.length(), alpha = Math.max(256, n);
        int[] p = new int[n], c = new int[n], pn = new int[n], cn = new int[n], cnt = new int[alpha];
        for (int i = 0; i < n; i++) cnt[s.charAt(i)]++;
        for (int i = 1; i < 256; i++) cnt[i] += cnt[i - 1];
        for (int i = n - 1; i >= 0; i--) p[--cnt[s.charAt(i)]] = i;
        c[p[0]] = 0;
        int classes = 1;
        for (int i = 1; i < n; i++) {
            if (s.charAt(p[i]) != s.charAt(p[i - 1])) classes++;
            c[p[i]] = classes - 1;
        }
        for (int len = 1; len < n; len <<= 1) {
            for (int i = 0; i < n; i++) {
                pn[i] = p[i] - len;
                if (pn[i] < 0) pn[i] += n;
            }
            Arrays.fill(cnt, 0, classes, 0);
            for (int i = 0; i < n; i++) cnt[c[pn[i]]]++;
            for (int i = 1; i < classes; i++) cnt[i] += cnt[i - 1];
            for (int i = n - 1; i >= 0; i--) p[--cnt[c[pn[i]]]] = pn[i];
            cn[p[0]] = 0;
            classes = 1;
            for (int i = 1; i < n; i++) {
                if (c[p[i]] != c[p[i - 1]] || c[(p[i] + len) % n] != c[(p[i - 1] + len) % n]) classes++;
                cn[p[i]] = classes - 1;
            }
            int[] tmp = c; c = cn; cn = tmp;
            if (classes == n) break;
        }
        return p;
    }

    static int cmpPrefix(String raw, int start, String pat) {
        int m = pat.length();
        for (int i = 0; i < m; i++) {
            if (start + i >= raw.length()) return -1;
            char a = raw.charAt(start + i), b = pat.charAt(i);
            if (a != b) return a < b ? -1 : 1;
        }
        return 0;
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        String raw = fs.next();
        if (raw == null) return;
        int q = fs.nextInt();
        int[] sa = buildSA(raw);
        int n = sa.length;

        int[] lg = new int[n + 1];
        for (int i = 2; i <= n; i++) lg[i] = lg[i / 2] + 1;
        int K = lg[n] + 1;
        int[][] st = new int[K][n];
        System.arraycopy(sa, 0, st[0], 0, n);
        for (int j = 1; j < K; j++) {
            for (int i = 0; i + (1 << j) <= n; i++) {
                st[j][i] = Math.min(st[j - 1][i], st[j - 1][i + (1 << (j - 1))]);
            }
        }

        StringBuilder sb = new StringBuilder();
        while (q-- > 0) {
            String pat = fs.next();
            int lo = 1, hi = n;
            while (lo < hi) {
                int mid = (lo + hi) >>> 1;
                if (cmpPrefix(raw, sa[mid], pat) < 0) lo = mid + 1;
                else hi = mid;
            }
            int left = lo;
            lo = left; hi = n;
            while (lo < hi) {
                int mid = (lo + hi) >>> 1;
                if (cmpPrefix(raw, sa[mid], pat) <= 0) lo = mid + 1;
                else hi = mid;
            }
            int right = lo;
            if (left == right) {
                sb.append("NO 0 -1\\n");
            } else {
                int k = lg[right - left];
                int minPos = Math.min(st[k][left], st[k][right - (1 << k)]);
                sb.append("YES ").append(right - left).append(' ').append(minPos).append('\\n');
            }
        }
        System.out.print(sb);
    }
}`,
        python3: `import sys

sys.setrecursionlimit(200000)

def build_sa(word: str) -> list[int]:
    s = word + "\\0"
    n = len(s)
    alpha = max(256, n)
    p = [0] * n
    c = [0] * n
    cnt = [0] * alpha
    for ch in s:
        cnt[ord(ch)] += 1
    for i in range(1, 256):
        cnt[i] += cnt[i - 1]
    for i in range(n - 1, -1, -1):
        code = ord(s[i])
        cnt[code] -= 1
        p[cnt[code]] = i
    c[p[0]] = 0
    classes = 1
    for i in range(1, n):
        if s[p[i]] != s[p[i - 1]]:
            classes += 1
        c[p[i]] = classes - 1

    pn = [0] * n
    cn = [0] * n
    length = 1
    while length < n:
        for i in range(n):
            v = p[i] - length
            pn[i] = v + n if v < 0 else v
        for i in range(classes):
            cnt[i] = 0
        for i in range(n):
            cnt[c[pn[i]]] += 1
        for i in range(1, classes):
            cnt[i] += cnt[i - 1]
        for i in range(n - 1, -1, -1):
            cls = c[pn[i]]
            cnt[cls] -= 1
            p[cnt[cls]] = pn[i]
        cn[p[0]] = 0
        classes = 1
        for i in range(1, n):
            if c[p[i]] != c[p[i - 1]] or c[(p[i] + length) % n] != c[(p[i - 1] + length) % n]:
                classes += 1
            cn[p[i]] = classes - 1
        c, cn = cn, c
        if classes == n:
            break
        length <<= 1
    return p

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    raw = data[0]
    q = int(data[1])
    sa = build_sa(raw)
    n = len(sa)

    lg = [0] * (n + 1)
    for i in range(2, n + 1):
        lg[i] = lg[i // 2] + 1
    st = [sa[:]]
    j = 1
    while (1 << j) <= n:
        prev = st[j - 1]
        step = 1 << (j - 1)
        st.append([min(prev[i], prev[i + step]) for i in range(n - (1 << j) + 1)])
        j += 1

    out = []
    for qi in range(q):
        pat = data[2 + qi]
        m = len(pat)
        lo, hi = 1, n
        while lo < hi:
            mid = (lo + hi) >> 1
            if raw[sa[mid] : sa[mid] + m] < pat:
                lo = mid + 1
            else:
                hi = mid
        left = lo
        lo, hi = left, n
        while lo < hi:
            mid = (lo + hi) >> 1
            if raw[sa[mid] : sa[mid] + m] <= pat:
                lo = mid + 1
            else:
                hi = mid
        right = lo
        if left == right:
            out.append("NO 0 -1")
        else:
            k = lg[right - left]
            earliest = min(st[k][left], st[k][right - (1 << k)])
            out.append(f"YES {right - left} {earliest}")
    sys.stdout.write("\\n".join(out) + "\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `def build_sa(word)
  s = word + "\0"
  n = s.bytesize
  alpha = [256, n].max
  p = Array.new(n, 0)
  c = Array.new(n, 0)
  cnt = Array.new(alpha, 0)
  bytes = s.bytes
  bytes.each { |b| cnt[b] += 1 }
  (1...256).each { |i| cnt[i] += cnt[i - 1] }
  (n - 1).downto(0) { |i| cnt[bytes[i]] -= 1; p[cnt[bytes[i]]] = i }
  c[p[0]] = 0
  classes = 1
  (1...n).each { |i| classes += 1 if bytes[p[i]] != bytes[p[i - 1]]; c[p[i]] = classes - 1 }
  pn = Array.new(n, 0)
  cn = Array.new(n, 0)
  len = 1
  while len < n
    n.times { |i| v = p[i] - len; pn[i] = v < 0 ? v + n : v }
    classes.times { |i| cnt[i] = 0 }
    n.times { |i| cnt[c[pn[i]]] += 1 }
    (1...classes).each { |i| cnt[i] += cnt[i - 1] }
    (n - 1).downto(0) { |i| cls = c[pn[i]]; cnt[cls] -= 1; p[cnt[cls]] = pn[i] }
    cn[p[0]] = 0
    classes = 1
    (1...n).each do |i|
      classes += 1 if c[p[i]] != c[p[i - 1]] || c[(p[i] + len) % n] != c[(p[i - 1] + len) % n]
      cn[p[i]] = classes - 1
    end
    c, cn = cn, c
    break if classes == n
    len <<= 1
  end
  p
end

tokens = $stdin.read.split
exit if tokens.empty?
raw = tokens[0]
q = tokens[1].to_i
sa = build_sa(raw)
n = sa.length

lg = Array.new(n + 1, 0)
(2..n).each { |i| lg[i] = lg[i / 2] + 1 }
st = [sa.dup]
j = 1
while (1 << j) <= n
  prev = st[j - 1]
  step = 1 << (j - 1)
  st << Array.new(n - (1 << j) + 1) { |i| [prev[i], prev[i + step]].min }
  j += 1
end

lines = []
q.times do |qi|
  pat = tokens[2 + qi]
  m = pat.length
  lo = 1
  hi = n
  while lo < hi
    mid = (lo + hi) >> 1
    if (raw[sa[mid], m] || "") < pat
      lo = mid + 1
    else
      hi = mid
    end
  end
  left = lo
  lo = left
  hi = n
  while lo < hi
    mid = (lo + hi) >> 1
    if (raw[sa[mid], m] || "") <= pat
      lo = mid + 1
    else
      hi = mid
    end
  end
  right = lo
  if left == right
    lines << "NO 0 -1"
  else
    k = lg[right - left]
    earliest = [st[k][left], st[k][right - (1 << k)]].min
    lines << "YES #{right - left} #{earliest}"
  end
end
puts lines.join("\\n")`,
      },
    },
    {
      id: 'ch24-p2',
      tier: 'Standard',
      ratingRange: '2050–2300',
      title: 'Count Distinct Substrings & Distinct Substrings Per Length in O(N log N)',
      statement:
        'Given a string S of length N, compute in O(N log N) time: (1) the total number of distinct non-empty substrings of S, and (2) for every length L = 1..N, the count of distinct substrings of length L.',
      constraints: '1 <= N <= 2 * 10^5',
      sampleInput: 'ababa',
      sampleOutput: '9\n2 2 2 2 1',
      hints: [
        'Each suffix starting at `sa[i]` (ignoring the sentinel at `sa[0]`) has length `sufLen = N - sa[i]` and shares `LCP(sa[i], sa[i - 1])` prefixes with its immediate predecessor in SA.',
        'Thus suffix `sa[i]` contributes `1` new distinct substring for EVERY length in `[lcp_prev + 1, sufLen]`! Accumulate all those intervals in `O(1)` using a difference array `diff[lcp_prev + 1]++, diff[sufLen + 1]--` and take prefix sums!',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    string raw;
    if (!(cin >> raw)) return 0;
    int m = (int)raw.size();
    string s = raw + "$";
    int n = (int)s.size();
    int alpha = max(256, n);
    vector<int> p(n), c(n), pn(n), cn(n), cnt(alpha, 0);

    for (char ch : s) cnt[(unsigned char)ch]++;
    for (int i = 1; i < 256; i++) cnt[i] += cnt[i - 1];
    for (int i = n - 1; i >= 0; i--) p[--cnt[(unsigned char)s[i]]] = i;
    c[p[0]] = 0;
    int classes = 1;
    for (int i = 1; i < n; i++) {
        if (s[p[i]] != s[p[i - 1]]) classes++;
        c[p[i]] = classes - 1;
    }

    for (int len = 1; len < n; len <<= 1) {
        for (int i = 0; i < n; i++) {
            pn[i] = p[i] - len;
            if (pn[i] < 0) pn[i] += n;
        }
        fill(cnt.begin(), cnt.begin() + classes, 0);
        for (int i = 0; i < n; i++) cnt[c[pn[i]]]++;
        for (int i = 1; i < classes; i++) cnt[i] += cnt[i - 1];
        for (int i = n - 1; i >= 0; i--) p[--cnt[c[pn[i]]]] = pn[i];
        cn[p[0]] = 0;
        classes = 1;
        for (int i = 1; i < n; i++) {
            if (c[p[i]] != c[p[i - 1]] || c[(p[i] + len) % n] != c[(p[i - 1] + len) % n]) classes++;
            cn[p[i]] = classes - 1;
        }
        c.swap(cn);
        if (classes == n) break;
    }

    vector<int> rk(n), lcp(n, 0);
    for (int i = 0; i < n; i++) rk[p[i]] = i;
    int k = 0;
    for (int i = 0; i < n; i++) {
        if (rk[i] == n - 1) { k = 0; continue; }
        int j = p[rk[i] + 1];
        while (i + k < n && j + k < n && s[i + k] == s[j + k]) k++;
        lcp[rk[i]] = k;
        if (k > 0) k--;
    }

    long long totalDistinct = 0;
    vector<long long> diff(m + 2, 0);
    for (int i = 1; i < n; i++) {
        int sufLen = m - p[i];
        int shared = (i == 1) ? 0 : lcp[i - 1];
        totalDistinct += (sufLen - shared);
        diff[shared + 1]++;
        diff[sufLen + 1]--;
    }

    cout << totalDistinct << "\\n";
    long long cur = 0;
    for (int len = 1; len <= m; len++) {
        cur += diff[len];
        if (len > 1) cout << ' ';
        cout << cur;
    }
    cout << "\\n";
    return 0;
}`,
        rust: `use std::io::{self, Read};

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let raw = match input.split_whitespace().next() {
        Some(v) => v.as_bytes(),
        None => return,
    };
    let m = raw.len();
    let mut s = raw.to_vec();
    s.push(0);
    let n = s.len();
    let alpha = n.max(256);

    let mut p = vec![0usize; n];
    let mut c = vec![0usize; n];
    let mut pn = vec![0usize; n];
    let mut cn = vec![0usize; n];
    let mut cnt = vec![0usize; alpha];

    for &b in &s { cnt[b as usize] += 1; }
    for i in 1..256 { cnt[i] += cnt[i - 1]; }
    for i in (0..n).rev() { cnt[s[i] as usize] -= 1; p[cnt[s[i] as usize]] = i; }
    c[p[0]] = 0;
    let mut classes = 1usize;
    for i in 1..n {
        if s[p[i]] != s[p[i - 1]] { classes += 1; }
        c[p[i]] = classes - 1;
    }

    let mut len = 1usize;
    while len < n {
        for i in 0..n { pn[i] = if p[i] >= len { p[i] - len } else { p[i] + n - len }; }
        cnt[..classes].fill(0);
        for i in 0..n { cnt[c[pn[i]]] += 1; }
        for i in 1..classes { cnt[i] += cnt[i - 1]; }
        for i in (0..n).rev() { let cls = c[pn[i]]; cnt[cls] -= 1; p[cnt[cls]] = pn[i]; }
        cn[p[0]] = 0;
        classes = 1;
        for i in 1..n {
            if c[p[i]] != c[p[i - 1]] || c[(p[i] + len) % n] != c[(p[i - 1] + len) % n] { classes += 1; }
            cn[p[i]] = classes - 1;
        }
        std::mem::swap(&mut c, &mut cn);
        if classes == n { break; }
        len <<= 1;
    }

    let mut rk = vec![0usize; n];
    for i in 0..n { rk[p[i]] = i; }
    let mut lcp = vec![0usize; n];
    let mut k = 0usize;
    for i in 0..n {
        if rk[i] == n - 1 { k = 0; continue; }
        let j = p[rk[i] + 1];
        while i + k < n && j + k < n && s[i + k] == s[j + k] { k += 1; }
        lcp[rk[i]] = k;
        if k > 0 { k -= 1; }
    }

    let mut total_distinct = 0u64;
    let mut diff = vec![0i64; m + 2];
    for i in 1..n {
        let suf_len = m - p[i];
        let shared = if i == 1 { 0 } else { lcp[i - 1] };
        total_distinct += (suf_len - shared) as u64;
        diff[shared + 1] += 1;
        diff[suf_len + 1] -= 1;
    }

    println!("{}", total_distinct);
    let mut cur = 0i64;
    let mut row = Vec::with_capacity(m);
    for l in 1..=m {
        cur += diff[l];
        row.push(cur.to_string());
    }
    println!("{}", row.join(" "));
}`,
        java21: `import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;

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
        String raw = fs.next();
        if (raw == null) return;
        int m = raw.length();
        String s = raw + "\\0";
        int n = s.length(), alpha = Math.max(256, n);
        int[] p = new int[n], c = new int[n], pn = new int[n], cn = new int[n], cnt = new int[alpha];

        for (int i = 0; i < n; i++) cnt[s.charAt(i)]++;
        for (int i = 1; i < 256; i++) cnt[i] += cnt[i - 1];
        for (int i = n - 1; i >= 0; i--) p[--cnt[s.charAt(i)]] = i;
        c[p[0]] = 0;
        int classes = 1;
        for (int i = 1; i < n; i++) {
            if (s.charAt(p[i]) != s.charAt(p[i - 1])) classes++;
            c[p[i]] = classes - 1;
        }
        for (int len = 1; len < n; len <<= 1) {
            for (int i = 0; i < n; i++) {
                pn[i] = p[i] - len;
                if (pn[i] < 0) pn[i] += n;
            }
            Arrays.fill(cnt, 0, classes, 0);
            for (int i = 0; i < n; i++) cnt[c[pn[i]]]++;
            for (int i = 1; i < classes; i++) cnt[i] += cnt[i - 1];
            for (int i = n - 1; i >= 0; i--) p[--cnt[c[pn[i]]]] = pn[i];
            cn[p[0]] = 0;
            classes = 1;
            for (int i = 1; i < n; i++) {
                if (c[p[i]] != c[p[i - 1]] || c[(p[i] + len) % n] != c[(p[i - 1] + len) % n]) classes++;
                cn[p[i]] = classes - 1;
            }
            int[] tmp = c; c = cn; cn = tmp;
            if (classes == n) break;
        }

        int[] rk = new int[n], lcp = new int[n];
        for (int i = 0; i < n; i++) rk[p[i]] = i;
        int k = 0;
        for (int i = 0; i < n; i++) {
            if (rk[i] == n - 1) { k = 0; continue; }
            int j = p[rk[i] + 1];
            while (i + k < n && j + k < n && s.charAt(i + k) == s.charAt(j + k)) k++;
            lcp[rk[i]] = k;
            if (k > 0) k--;
        }

        long totalDistinct = 0;
        long[] diff = new long[m + 2];
        for (int i = 1; i < n; i++) {
            int sufLen = m - p[i];
            int shared = (i == 1) ? 0 : lcp[i - 1];
            totalDistinct += (sufLen - shared);
            diff[shared + 1]++;
            diff[sufLen + 1]--;
        }

        StringBuilder sb = new StringBuilder();
        sb.append(totalDistinct).append('\\n');
        long cur = 0;
        for (int l = 1; l <= m; l++) {
            cur += diff[l];
            if (l > 1) sb.append(' ');
            sb.append(cur);
        }
        System.out.println(sb);
    }
}`,
        python3: `import sys

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    raw = data[0]
    m = len(raw)
    s = raw + "\\0"
    n = len(s)
    alpha = max(256, n)
    p = [0] * n
    c = [0] * n
    cnt = [0] * alpha

    for ch in s:
        cnt[ord(ch)] += 1
    for i in range(1, 256):
        cnt[i] += cnt[i - 1]
    for i in range(n - 1, -1, -1):
        code = ord(s[i])
        cnt[code] -= 1
        p[cnt[code]] = i

    c[p[0]] = 0
    classes = 1
    for i in range(1, n):
        if s[p[i]] != s[p[i - 1]]:
            classes += 1
        c[p[i]] = classes - 1

    pn = [0] * n
    cn = [0] * n
    length = 1
    while length < n:
        for i in range(n):
            v = p[i] - length
            pn[i] = v + n if v < 0 else v
        for i in range(classes):
            cnt[i] = 0
        for i in range(n):
            cnt[c[pn[i]]] += 1
        for i in range(1, classes):
            cnt[i] += cnt[i - 1]
        for i in range(n - 1, -1, -1):
            cls = c[pn[i]]
            cnt[cls] -= 1
            p[cnt[cls]] = pn[i]
        cn[p[0]] = 0
        classes = 1
        for i in range(1, n):
            if c[p[i]] != c[p[i - 1]] or c[(p[i] + length) % n] != c[(p[i - 1] + length) % n]:
                classes += 1
            cn[p[i]] = classes - 1
        c, cn = cn, c
        if classes == n:
            break
        length <<= 1

    rk = [0] * n
    for i, pos in enumerate(p):
        rk[pos] = i
    lcp = [0] * n
    k = 0
    for i in range(n):
        if rk[i] == n - 1:
            k = 0
            continue
        j = p[rk[i] + 1]
        while i + k < n and j + k < n and s[i + k] == s[j + k]:
            k += 1
        lcp[rk[i]] = k
        if k > 0:
            k -= 1

    total = 0
    diff = [0] * (m + 2)
    for i in range(1, n):
        suf_len = m - p[i]
        shared = 0 if i == 1 else lcp[i - 1]
        total += suf_len - shared
        diff[shared + 1] += 1
        diff[suf_len + 1] -= 1

    counts = []
    cur = 0
    for l in range(1, m + 1):
        cur += diff[l]
        counts.append(str(cur))

    print(total)
    print(" ".join(counts))

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
raw = tokens[0]
m = raw.bytesize
s = raw + "\0"
n = s.bytesize
alpha = [256, n].max
p = Array.new(n, 0)
c = Array.new(n, 0)
cnt = Array.new(alpha, 0)
bytes = s.bytes
bytes.each { |b| cnt[b] += 1 }
(1...256).each { |i| cnt[i] += cnt[i - 1] }
(n - 1).downto(0) { |i| cnt[bytes[i]] -= 1; p[cnt[bytes[i]]] = i }
c[p[0]] = 0
classes = 1
(1...n).each { |i| classes += 1 if bytes[p[i]] != bytes[p[i - 1]]; c[p[i]] = classes - 1 }
pn = Array.new(n, 0)
cn = Array.new(n, 0)
len = 1
while len < n
  n.times { |i| v = p[i] - len; pn[i] = v < 0 ? v + n : v }
  classes.times { |i| cnt[i] = 0 }
  n.times { |i| cnt[c[pn[i]]] += 1 }
  (1...classes).each { |i| cnt[i] += cnt[i - 1] }
  (n - 1).downto(0) { |i| cls = c[pn[i]]; cnt[cls] -= 1; p[cnt[cls]] = pn[i] }
  cn[p[0]] = 0
  classes = 1
  (1...n).each do |i|
    classes += 1 if c[p[i]] != c[p[i - 1]] || c[(p[i] + len) % n] != c[(p[i - 1] + len) % n]
    cn[p[i]] = classes - 1
  end
  c, cn = cn, c
  break if classes == n
  len <<= 1
end

rk = Array.new(n, 0)
p.each_with_index { |pos, idx| rk[pos] = idx }
lcp = Array.new(n, 0)
k = 0
n.times do |i|
  if rk[i] == n - 1
    k = 0
    next
  end
  j = p[rk[i] + 1]
  k += 1 while i + k < n && j + k < n && bytes[i + k] == bytes[j + k]
  lcp[rk[i]] = k
  k -= 1 if k > 0
end

total = 0
diff = Array.new(m + 2, 0)
(1...n).each do |i|
  suf_len = m - p[i]
  shared = i == 1 ? 0 : lcp[i - 1]
  total += suf_len - shared
  diff[shared + 1] += 1
  diff[suf_len + 1] -= 1
end

cur = 0
counts = (1..m).map { |l| cur += diff[l] }
puts total
puts counts.join(" ")`,
      },
    },
    {
      id: 'ch24-p3',
      tier: 'Boss',
      ratingRange: '2250–2550',
      title: 'Longest Common Substring of K Strings via Suffix Array Grouping',
      statement:
        'Given K strings S_1, ..., S_K, find the length of the longest string that appears as a contiguous substring of ALL K strings simultaneously (and output one such longest common substring, or empty line if length is 0).',
      constraints: '2 <= K <= 20, 1 <= sum(|S_i|) <= 2 * 10^5',
      sampleInput: '3\nabacaba\ncabana\nzabab',
      sampleOutput: '3\naba',
      hints: [
        'Concatenate all K strings using K strictly distinct integer sentinels outside the character range (e.g., character codes `1..K` before lowercase ASCII `97..122` or `300 + docId`).',
        'Build SA + Kasai LCP on the concatenated integer array. Slide a two-pointer `[L, R]` window over the real suffixes (`docId >= 0`): whenever all K documents appear inside `[L, R]`, query `min(lcp[L .. R - 1])` via a monotonic deque in `O(N)` total!',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int K;
    if (!(cin >> K)) return 0;
    vector<string> docs(K);
    vector<int> s, owner;
    int sepBase = 300;
    for (int id = 0; id < K; id++) {
        cin >> docs[id];
        for (unsigned char ch : docs[id]) {
            s.push_back(ch);
            owner.push_back(id);
        }
        s.push_back(sepBase + id);
        owner.push_back(-1);
    }

    int n = (int)s.size();
    int alpha = max(sepBase + K + 5, n);
    vector<int> p(n), c(n), pn(n), cn(n), cnt(alpha, 0);

    for (int v : s) cnt[v]++;
    for (int i = 1; i < alpha; i++) cnt[i] += cnt[i - 1];
    for (int i = n - 1; i >= 0; i--) p[--cnt[s[i]]] = i;
    c[p[0]] = 0;
    int classes = 1;
    for (int i = 1; i < n; i++) {
        if (s[p[i]] != s[p[i - 1]]) classes++;
        c[p[i]] = classes - 1;
    }

    for (int len = 1; len < n; len <<= 1) {
        for (int i = 0; i < n; i++) {
            pn[i] = p[i] - len;
            if (pn[i] < 0) pn[i] += n;
        }
        fill(cnt.begin(), cnt.begin() + classes, 0);
        for (int i = 0; i < n; i++) cnt[c[pn[i]]]++;
        for (int i = 1; i < classes; i++) cnt[i] += cnt[i - 1];
        for (int i = n - 1; i >= 0; i--) p[--cnt[c[pn[i]]]] = pn[i];
        cn[p[0]] = 0;
        classes = 1;
        for (int i = 1; i < n; i++) {
            if (c[p[i]] != c[p[i - 1]] || c[(p[i] + len) % n] != c[(p[i - 1] + len) % n]) classes++;
            cn[p[i]] = classes - 1;
        }
        c.swap(cn);
        if (classes == n) break;
    }

    vector<int> rk(n), lcp(n, 0);
    for (int i = 0; i < n; i++) rk[p[i]] = i;
    int k = 0;
    for (int i = 0; i < n; i++) {
        if (rk[i] == n - 1) { k = 0; continue; }
        int j = p[rk[i] + 1];
        while (i + k < n && j + k < n && s[i + k] == s[j + k]) k++;
        lcp[rk[i]] = k;
        if (k > 0) k--;
    }

    vector<int> docFreq(K, 0);
    int covered = 0;
    deque<int> dq; // monotonic queue for min(lcp[L .. R-1])
    int bestLen = 0, bestStart = 0;
    int L = 0;

    for (int R = 0; R < n; R++) {
        int idR = owner[p[R]];
        if (idR == -1) continue;
        if (docFreq[idR]++ == 0) covered++;
        if (R > 0) {
            while (!dq.empty() && lcp[dq.back()] >= lcp[R - 1]) dq.pop_back();
            dq.push_back(R - 1);
        }

        while (covered == K) {
            while (owner[p[L]] == -1) L++;
            while (!dq.empty() && dq.front() < L) dq.pop_front();
            int curLcp = (L < R && !dq.empty()) ? lcp[dq.front()] : 0;
            if (curLcp > bestLen) {
                bestLen = curLcp;
                bestStart = p[L];
            }
            int idL = owner[p[L]];
            if (--docFreq[idL] == 0) covered--;
            L++;
        }
    }

    cout << bestLen << "\\n";
    if (bestLen > 0) {
        for (int i = 0; i < bestLen; i++) cout << (char)s[bestStart + i];
        cout << "\\n";
    }
    return 0;
}`,
        rust: `use std::collections::VecDeque;
use std::io::{self, Read};

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let k_docs: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };

    let sep_base = 300usize;
    let mut s = Vec::new();
    let mut owner = Vec::new();
    for id in 0..k_docs {
        let doc = it.next().unwrap().as_bytes();
        for &b in doc {
            s.push(b as usize);
            owner.push(id as i32);
        }
        s.push(sep_base + id);
        owner.push(-1);
    }

    let n = s.len();
    let alpha = n.max(sep_base + k_docs + 5);
    let mut p = vec![0usize; n];
    let mut c = vec![0usize; n];
    let mut pn = vec![0usize; n];
    let mut cn = vec![0usize; n];
    let mut cnt = vec![0usize; alpha];

    for &v in &s { cnt[v] += 1; }
    for i in 1..alpha { cnt[i] += cnt[i - 1]; }
    for i in (0..n).rev() { cnt[s[i]] -= 1; p[cnt[s[i]]] = i; }
    c[p[0]] = 0;
    let mut classes = 1usize;
    for i in 1..n {
        if s[p[i]] != s[p[i - 1]] { classes += 1; }
        c[p[i]] = classes - 1;
    }

    let mut len = 1usize;
    while len < n {
        for i in 0..n { pn[i] = if p[i] >= len { p[i] - len } else { p[i] + n - len }; }
        cnt[..classes].fill(0);
        for i in 0..n { cnt[c[pn[i]]] += 1; }
        for i in 1..classes { cnt[i] += cnt[i - 1]; }
        for i in (0..n).rev() { let cls = c[pn[i]]; cnt[cls] -= 1; p[cnt[cls]] = pn[i]; }
        cn[p[0]] = 0;
        classes = 1;
        for i in 1..n {
            if c[p[i]] != c[p[i - 1]] || c[(p[i] + len) % n] != c[(p[i - 1] + len) % n] { classes += 1; }
            cn[p[i]] = classes - 1;
        }
        std::mem::swap(&mut c, &mut cn);
        if classes == n { break; }
        len <<= 1;
    }

    let mut rk = vec![0usize; n];
    for i in 0..n { rk[p[i]] = i; }
    let mut lcp = vec![0usize; n];
    let mut k = 0usize;
    for i in 0..n {
        if rk[i] == n - 1 { k = 0; continue; }
        let j = p[rk[i] + 1];
        while i + k < n && j + k < n && s[i + k] == s[j + k] { k += 1; }
        lcp[rk[i]] = k;
        if k > 0 { k -= 1; }
    }

    let mut doc_freq = vec![0usize; k_docs];
    let mut covered = 0usize;
    let mut dq: VecDeque<usize> = VecDeque::new();
    let (mut best_len, mut best_start, mut left) = (0usize, 0usize, 0usize);

    for right in 0..n {
        let id_r = owner[p[right]];
        if id_r < 0 { continue; }
        let ur = id_r as usize;
        if doc_freq[ur] == 0 { covered += 1; }
        doc_freq[ur] += 1;
        if right > 0 {
            while let Some(&back) = dq.back() {
                if lcp[back] >= lcp[right - 1] { dq.pop_back(); } else { break; }
            }
            dq.push_back(right - 1);
        }

        while covered == k_docs {
            while owner[p[left]] < 0 { left += 1; }
            while let Some(&front) = dq.front() {
                if front < left { dq.pop_front(); } else { break; }
            }
            let cur_lcp = if left < right { dq.front().map(|&idx| lcp[idx]).unwrap_or(0) } else { 0 };
            if cur_lcp > best_len {
                best_len = cur_lcp;
                best_start = p[left];
            }
            let ul = owner[p[left]] as usize;
            doc_freq[ul] -= 1;
            if doc_freq[ul] == 0 { covered -= 1; }
            left += 1;
        }
    }

    println!("{}", best_len);
    if best_len > 0 {
        let ans: String = s[best_start..best_start + best_len].iter().map(|&v| v as u8 as char).collect();
        println!("{}", ans);
    }
}`,
        java21: `import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayDeque;
import java.util.Arrays;

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
        int nextInt() throws IOException { return Integer.parseInt(next()); }
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        String first = fs.next();
        if (first == null) return;
        int K = Integer.parseInt(first);

        String[] docs = new String[K];
        int totalLen = K;
        for (int i = 0; i < K; i++) {
            docs[i] = fs.next();
            totalLen += docs[i].length();
        }

        int[] s = new int[totalLen], owner = new int[totalLen];
        int idx = 0, sepBase = 300;
        for (int id = 0; id < K; id++) {
            String d = docs[id];
            for (int i = 0; i < d.length(); i++) {
                s[idx] = d.charAt(i);
                owner[idx++] = id;
            }
            s[idx] = sepBase + id;
            owner[idx++] = -1;
        }

        int n = totalLen, alpha = Math.max(sepBase + K + 5, n);
        int[] p = new int[n], c = new int[n], pn = new int[n], cn = new int[n], cnt = new int[alpha];

        for (int v : s) cnt[v]++;
        for (int i = 1; i < alpha; i++) cnt[i] += cnt[i - 1];
        for (int i = n - 1; i >= 0; i--) p[--cnt[s[i]]] = i;
        c[p[0]] = 0;
        int classes = 1;
        for (int i = 1; i < n; i++) {
            if (s[p[i]] != s[p[i - 1]]) classes++;
            c[p[i]] = classes - 1;
        }
        for (int len = 1; len < n; len <<= 1) {
            for (int i = 0; i < n; i++) {
                pn[i] = p[i] - len;
                if (pn[i] < 0) pn[i] += n;
            }
            Arrays.fill(cnt, 0, classes, 0);
            for (int i = 0; i < n; i++) cnt[c[pn[i]]]++;
            for (int i = 1; i < classes; i++) cnt[i] += cnt[i - 1];
            for (int i = n - 1; i >= 0; i--) p[--cnt[c[pn[i]]]] = pn[i];
            cn[p[0]] = 0;
            classes = 1;
            for (int i = 1; i < n; i++) {
                if (c[p[i]] != c[p[i - 1]] || c[(p[i] + len) % n] != c[(p[i - 1] + len) % n]) classes++;
                cn[p[i]] = classes - 1;
            }
            int[] tmp = c; c = cn; cn = tmp;
            if (classes == n) break;
        }

        int[] rk = new int[n], lcp = new int[n];
        for (int i = 0; i < n; i++) rk[p[i]] = i;
        int k = 0;
        for (int i = 0; i < n; i++) {
            if (rk[i] == n - 1) { k = 0; continue; }
            int j = p[rk[i] + 1];
            while (i + k < n && j + k < n && s[i + k] == s[j + k]) k++;
            lcp[rk[i]] = k;
            if (k > 0) k--;
        }

        int[] docFreq = new int[K];
        int covered = 0, bestLen = 0, bestStart = 0, L = 0;
        ArrayDeque<Integer> dq = new ArrayDeque<>();
        for (int R = 0; R < n; R++) {
            int idR = owner[p[R]];
            if (idR < 0) continue;
            if (docFreq[idR]++ == 0) covered++;
            if (R > 0) {
                while (!dq.isEmpty() && lcp[dq.peekLast()] >= lcp[R - 1]) dq.pollLast();
                dq.addLast(R - 1);
            }
            while (covered == K) {
                while (owner[p[L]] < 0) L++;
                while (!dq.isEmpty() && dq.peekFirst() < L) dq.pollFirst();
                int curLcp = (L < R && !dq.isEmpty()) ? lcp[dq.peekFirst()] : 0;
                if (curLcp > bestLen) {
                    bestLen = curLcp;
                    bestStart = p[L];
                }
                if (--docFreq[owner[p[L]]] == 0) covered--;
                L++;
            }
        }

        System.out.println(bestLen);
        if (bestLen > 0) {
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < bestLen; i++) sb.append((char) s[bestStart + i]);
            System.out.println(sb);
        }
    }
}`,
        python3: `import sys
from collections import deque

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    K = int(data[0])
    s = []
    owner = []
    sep_base = 300
    for doc_id in range(K):
        word = data[1 + doc_id]
        for ch in word:
            s.append(ord(ch))
            owner.append(doc_id)
        s.append(sep_base + doc_id)
        owner.append(-1)

    n = len(s)
    alpha = max(sep_base + K + 5, n)
    p = [0] * n
    c = [0] * n
    cnt = [0] * alpha

    for v in s:
        cnt[v] += 1
    for i in range(1, alpha):
        cnt[i] += cnt[i - 1]
    for i in range(n - 1, -1, -1):
        v = s[i]
        cnt[v] -= 1
        p[cnt[v]] = i
    c[p[0]] = 0
    classes = 1
    for i in range(1, n):
        if s[p[i]] != s[p[i - 1]]:
            classes += 1
        c[p[i]] = classes - 1

    pn = [0] * n
    cn = [0] * n
    length = 1
    while length < n:
        for i in range(n):
            v = p[i] - length
            pn[i] = v + n if v < 0 else v
        for i in range(classes):
            cnt[i] = 0
        for i in range(n):
            cnt[c[pn[i]]] += 1
        for i in range(1, classes):
            cnt[i] += cnt[i - 1]
        for i in range(n - 1, -1, -1):
            cls = c[pn[i]]
            cnt[cls] -= 1
            p[cnt[cls]] = pn[i]
        cn[p[0]] = 0
        classes = 1
        for i in range(1, n):
            if c[p[i]] != c[p[i - 1]] or c[(p[i] + length) % n] != c[(p[i - 1] + length) % n]:
                classes += 1
            cn[p[i]] = classes - 1
        c, cn = cn, c
        if classes == n:
            break
        length <<= 1

    rk = [0] * n
    for i, pos in enumerate(p):
        rk[pos] = i
    lcp = [0] * n
    k = 0
    for i in range(n):
        if rk[i] == n - 1:
            k = 0
            continue
        j = p[rk[i] + 1]
        while i + k < n and j + k < n and s[i + k] == s[j + k]:
            k += 1
        lcp[rk[i]] = k
        if k > 0:
            k -= 1

    doc_freq = [0] * K
    covered = 0
    dq = deque()
    best_len = 0
    best_start = 0
    left = 0

    for right in range(n):
        id_r = owner[p[right]]
        if id_r < 0:
            continue
        if doc_freq[id_r] == 0:
            covered += 1
        doc_freq[id_r] += 1
        if right > 0:
            while dq and lcp[dq[-1]] >= lcp[right - 1]:
                dq.pop()
            dq.append(right - 1)
        while covered == K:
            while owner[p[left]] < 0:
                left += 1
            while dq and dq[0] < left:
                dq.popleft()
            cur_lcp = lcp[dq[0]] if (left < right and dq) else 0
            if cur_lcp > best_len:
                best_len = cur_lcp
                best_start = p[left]
            id_l = owner[p[left]]
            doc_freq[id_l] -= 1
            if doc_freq[id_l] == 0:
                covered -= 1
            left += 1

    print(best_len)
    if best_len > 0:
        print("".join(chr(v) for v in s[best_start : best_start + best_len]))

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
k_docs = tokens[0].to_i
s = []
owner = []
sep_base = 300

k_docs.times do |id|
  tokens[1 + id].each_byte do |b|
    s << b
    owner << id
  end
  s << (sep_base + id)
  owner << -1
end

n = s.size
alpha = [sep_base + k_docs + 5, n].max
p = Array.new(n, 0)
c = Array.new(n, 0)
cnt = Array.new(alpha, 0)

s.each { |v| cnt[v] += 1 }
(1...alpha).each { |i| cnt[i] += cnt[i - 1] }
(n - 1).downto(0) { |i| cnt[s[i]] -= 1; p[cnt[s[i]]] = i }
c[p[0]] = 0
classes = 1
(1...n).each { |i| classes += 1 if s[p[i]] != s[p[i - 1]]; c[p[i]] = classes - 1 }

pn = Array.new(n, 0)
cn = Array.new(n, 0)
len = 1
while len < n
  n.times { |i| v = p[i] - len; pn[i] = v < 0 ? v + n : v }
  classes.times { |i| cnt[i] = 0 }
  n.times { |i| cnt[c[pn[i]]] += 1 }
  (1...classes).each { |i| cnt[i] += cnt[i - 1] }
  (n - 1).downto(0) { |i| cls = c[pn[i]]; cnt[cls] -= 1; p[cnt[cls]] = pn[i] }
  cn[p[0]] = 0
  classes = 1
  (1...n).each do |i|
    classes += 1 if c[p[i]] != c[p[i - 1]] || c[(p[i] + len) % n] != c[(p[i - 1] + len) % n]
    cn[p[i]] = classes - 1
  end
  c, cn = cn, c
  break if classes == n
  len <<= 1
end

rk = Array.new(n, 0)
p.each_with_index { |pos, idx| rk[pos] = idx }
lcp = Array.new(n, 0)
k = 0
n.times do |i|
  if rk[i] == n - 1
    k = 0
    next
  end
  j = p[rk[i] + 1]
  k += 1 while i + k < n && j + k < n && s[i + k] == s[j + k]
  lcp[rk[i]] = k
  k -= 1 if k > 0
end

doc_freq = Array.new(k_docs, 0)
covered = 0
dq = []
head = 0
best_len = 0
best_start = 0
left = 0

n.times do |right|
  id_r = owner[p[right]]
  next if id_r < 0
  covered += 1 if doc_freq[id_r] == 0
  doc_freq[id_r] += 1
  if right > 0
    dq.pop while dq.size > head && lcp[dq[-1]] >= lcp[right - 1]
    dq << (right - 1)
  end
  while covered == k_docs
    left += 1 while owner[p[left]] < 0
    head += 1 while head < dq.size && dq[head] < left
    cur_lcp = (left < right && head < dq.size) ? lcp[dq[head]] : 0
    if cur_lcp > best_len
      best_len = cur_lcp
      best_start = p[left]
    end
    id_l = owner[p[left]]
    doc_freq[id_l] -= 1
    covered -= 1 if doc_freq[id_l] == 0
    left += 1
  end
end

puts best_len
puts s[best_start, best_len].map(&:chr).join if best_len > 0`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'CSES',
      title: 'Substring Distribution & Substring Order II',
      difficulty: 'Hard',
      url: 'https://cses.fi/problemset/task/2110',
      patternNote: 'Suffix Array + Kasai LCP difference array for exact per-length distinct substring counts.',
    },
    {
      platform: 'AtCoder',
      title: 'ACL Practice I — Number of Substrings',
      difficulty: 'AtCoder Blue (~1650)',
      url: 'https://atcoder.jp/contests/practice2/tasks/practice2_i',
      patternNote: 'Standard Suffix Array + Kasai LCP distinct substring formula `N*(N+1)/2 - sum(LCP)`.',
    },
    {
      platform: 'Codeforces',
      title: 'CF 427D — Match & Catch / Educational Suffix Array Step 5',
      difficulty: '2200 (Div.1)',
      url: 'https://codeforces.com/edu/course/2/lesson/2',
      patternNote: 'Multi-string concatenated SA + Kasai LCP with monotonic deque windowing.',
    },
    {
      platform: 'CodeChef',
      title: 'SSTORY — A Story with Strings',
      difficulty: 'CodeChef 6-Star',
      url: 'https://www.codechef.com/problems/SSTORY',
      patternNote: 'Two-string Longest Common Substring + earliest occurrence recovery using SA + LCP.',
    },
    {
      platform: 'HackerRank',
      title: 'Ashton and String / Find Strings',
      difficulty: 'Hard',
      url: 'https://www.hackerrank.com/challenges/find-strings/problem',
      patternNote: 'Union of multiple documents’ distinct substrings indexed in lexicographical order.',
    },
    {
      platform: 'NeetCode 150',
      title: 'Longest Repeating / Longest Duplicate Substring',
      difficulty: 'Hard',
      url: 'https://neetcode.io/practice',
      patternNote: 'Maximum value inside Kasai’s `LCP[]` immediately returns the longest duplicated substring without binary search or hash collisions.',
    },
  ],
  interviewNotes: [
    'Why Suffix Array beats Suffix Tree in production: both achieve `O(N)`–`O(N log N)` construction, yet a Suffix Array uses only 2 flat `int32` arrays (`sa`, `lcp` = `8N` bytes) with sequential cache locality instead of `26N` pointer-heavy tree nodes.',
    'Explain Kasai’s `O(N)` proof cleanly: when moving from suffix `i` to `i + 1`, if `lcp[rk[i]] = h`, deleting the first character leaves a match of length at least `h - 1` between `S[i+1..]` and some suffix adjacent to it—so `k` decreases at most `N` times total across the loop!',
    'Sparse Table RMQ over `LCP[]` upgrades Suffix Array into a universal `O(1)` substring comparator (`compare(S[l1..r1], S[l2..r2])`), powering custom string sorting without substring slicing.',
  ],
  projectBlueprint: {
    title: 'Plagiarism & Genomic Substring Similarity Engine',
    tagline:
      'Align multi-document corpora and DNA reads into one deterministic Suffix Array + LCP index to detect shared motifs, unique coverage, and cross-document overlaps.',
    stackSummary: 'TypeScript Engine • Prefix-Doubling SA • Kasai LCP • Sliding Multi-Doc Window',
    asciiDiagram: `[Doc 0] + [sep0] + [Doc 1] + [sep1] + ... + [Doc K-1]
                         |
                         v
       [ Prefix-Doubling SA[] + Kasai LCP[] ]
                         |
       +-----------------+-----------------+
       |                                   |
       v                                   v
[ Distinct Substring Index ]     [ Two-Pointer + Deque Window ]
  Total Unique Substrings          Longest Shared Motif Across All Docs`,
    milestones: [
      {
        id: 'ch24-m1',
        title: 'Build Multi-Document Integer-Code Suffix Array Indexer',
        detail: 'Assign each document a distinct sentinel code above alphabet range so zero cross-boundary false matches ever occur.',
      },
      {
        id: 'ch24-m2',
        title: 'Implement Linear Kasai LCP & Sparse Table RMQ',
        detail: 'Compute adjacent overlaps in `O(N)` and answer arbitrary `LCP(posA, posB)` queries in `O(1)`.',
      },
      {
        id: 'ch24-m3',
        title: 'Add Sliding Window Multi-Document Common Motif Finder',
        detail: 'Track document coverage across `SA[]` with a monotonic min-deque on `LCP[]` to return longest shared fragments across all documents.',
      },
      {
        id: 'ch24-m4',
        title: 'Compute Per-Document Uniqueness & Plagiarism Similarity Score',
        detail: 'Aggregate exact distinct substring counts (`sum(sufLen - lcp)`) and Jaccard/containment overlap metrics.',
      },
    ],
    starterCode: `export interface SimilarityReport {
  totalCombinedLength: number;
  distinctSubstrings: number;
  longestSharedMotif: string;
  longestSharedLength: number;
}

export class SuffixSimilarityEngine {
  static buildSAAndLCP(codes: Int32Array, alphabetMax: number) {
    const n = codes.length;
    const alpha = Math.max(alphabetMax, n);
    let p = new Int32Array(n);
    let c = new Int32Array(n);
    const pn = new Int32Array(n);
    const cn = new Int32Array(n);
    const cnt = new Int32Array(alpha);

    for (let i = 0; i < n; i++) cnt[codes[i]]++;
    for (let i = 1; i < alphabetMax; i++) cnt[i] += cnt[i - 1];
    for (let i = n - 1; i >= 0; i--) p[--cnt[codes[i]]] = i;

    c[p[0]] = 0;
    let classes = 1;
    for (let i = 1; i < n; i++) {
      if (codes[p[i]] !== codes[p[i - 1]]) classes++;
      c[p[i]] = classes - 1;
    }

    for (let len = 1; len < n; len <<= 1) {
      for (let i = 0; i < n; i++) {
        const v = p[i] - len;
        pn[i] = v < 0 ? v + n : v;
      }
      cnt.fill(0, 0, classes);
      for (let i = 0; i < n; i++) cnt[c[pn[i]]]++;
      for (let i = 1; i < classes; i++) cnt[i] += cnt[i - 1];
      for (let i = n - 1; i >= 0; i--) p[--cnt[c[pn[i]]]] = pn[i];

      cn[p[0]] = 0;
      classes = 1;
      for (let i = 1; i < n; i++) {
        if (
          c[p[i]] !== c[p[i - 1]] ||
          c[(p[i] + len) % n] !== c[(p[i - 1] + len) % n]
        ) {
          classes++;
        }
        cn[p[i]] = classes - 1;
      }
      const tmp = c;
      c = cn;
      cn.set(tmp);
      if (classes === n) break;
    }

    const rk = new Int32Array(n);
    for (let i = 0; i < n; i++) rk[p[i]] = i;

    const lcp = new Int32Array(n);
    let k = 0;
    for (let i = 0; i < n; i++) {
      if (rk[i] === n - 1) {
        k = 0;
        continue;
      }
      const j = p[rk[i] + 1];
      while (i + k < n && j + k < n && codes[i + k] === codes[j + k]) k++;
      lcp[rk[i]] = k;
      if (k > 0) k--;
    }

    return { sa: p, rk, lcp };
  }

  static analyzeDocuments(docs: string[]): SimilarityReport {
    if (docs.length === 0) {
      return { totalCombinedLength: 0, distinctSubstrings: 0, longestSharedMotif: '', longestSharedLength: 0 };
    }
    const sepBase = 65536;
    const rawCodes: number[] = [];
    const owner: number[] = [];
    docs.forEach((doc, docId) => {
      for (let i = 0; i < doc.length; i++) {
        rawCodes.push(doc.charCodeAt(i));
        owner.push(docId);
      }
      rawCodes.push(sepBase + docId);
      owner.push(-1);
    });

    const codes = Int32Array.from(rawCodes);
    const { sa, lcp } = this.buildSAAndLCP(codes, sepBase + docs.length + 2);
    const n = codes.length;

    let distinctSubstrings = 0;
    for (let i = 0; i < n; i++) {
      if (owner[sa[i]] === -1) continue;
      let rem = 0;
      while (sa[i] + rem < n && owner[sa[i] + rem] === owner[sa[i]]) rem++;
      const shared = i > 0 ? Math.min(rem, lcp[i - 1]) : 0;
      distinctSubstrings += rem - shared;
    }

    const freq = new Int32Array(docs.length);
    const dq: number[] = [];
    let dqHead = 0;
    let covered = 0;
    let bestLen = 0;
    let bestStart = 0;
    let left = 0;

    for (let right = 0; right < n; right++) {
      const idR = owner[sa[right]];
      if (idR < 0) continue;
      if (freq[idR]++ === 0) covered++;
      if (right > 0) {
        while (dq.length > dqHead && lcp[dq[dq.length - 1]] >= lcp[right - 1]) dq.pop();
        dq.push(right - 1);
      }
      while (covered === docs.length) {
        while (owner[sa[left]] < 0) left++;
        while (dqHead < dq.length && dq[dqHead] < left) dqHead++;
        const curLcp = left < right && dqHead < dq.length ? lcp[dq[dqHead]] : 0;
        if (curLcp > bestLen) {
          bestLen = curLcp;
          bestStart = sa[left];
        }
        const idL = owner[sa[left]];
        if (--freq[idL] === 0) covered--;
        left++;
      }
    }

    const longestSharedMotif = Array.from({ length: bestLen }, (_, idx) =>
      String.fromCharCode(codes[bestStart + idx])
    ).join('');

    return {
      totalCombinedLength: n - docs.length,
      distinctSubstrings,
      longestSharedMotif,
      longestSharedLength: bestLen,
    };
  }
}`,
  },
};
