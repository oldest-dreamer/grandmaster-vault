import type { TheoryChapter } from '../../types/vault';

export const CH47_SUFFIX_AUTOMATON_EERTREE: TheoryChapter = {
  slug: 'suffix-automaton-sam',
  topicId: 'sg-65',
  title: 'Suffix Automaton (SAM) & Palindromic Tree (Eertree)',
  domain: 'Strings & Geometry',
  ratingTier: '2200–2600',
  usacoDivision: 'Platinum',
  subtitle:
    'Compress ALL O(N^2) substrings of a string into a linear-size O(N) minimal DFA using endpos equivalence classes, clone split states when len[p]+1 != len[q], and track every distinct palindrome + occurrence count in O(N) using an Eertree.',
  analogyTitle: 'The Endpos Equivalence Family Tree & Dual-Root Mirror Palace Analogy',
  analogyBody:
    'Every substring of `S` occurs at a set of ending indices called **`endpos(w)`**. Substrings sharing the exact same `endpos` belong to the same **SAM state `v`**, covering contiguous lengths `[len[link[v]] + 1 .. len[v]]`! When appending character `c` (`extend(c)`), we walk up suffix links `link[p]` wiring missing `c`-transitions to the new `cur` state until hitting a state `p` that already has a `c`-transition to `q`. If **`len[p] + 1 == len[q]`**, `q` only holds suffixes of `cur` (`link[cur] = q`). Otherwise **`len[p] + 1 < len[q]`** (`q` holds longer strings that do NOT end at the new position!), so we **clone `q`** into a fresh state `clone` with `len[clone] = len[p] + 1`, copy `q`’s transitions and `link[q]`, and redirect `p`’s ancestors pointing to `q` toward `clone`! Remarkably, **every string has at most `2N - 1` states and `3N - 4` transitions**, constructed in `O(N)`! Its geometric twin for palindromes—the **Eertree (Palindromic Tree)**—uses just two roots (`len = -1` for odd-length palindromes, `len = 0` for even-length palindromes) and `<= N + 2` nodes to capture EVERY distinct palindromic substring and its frequency in strict `O(N)`!',
  prerequisites: [
    {
      slug: 'trie-aho-corasick-automaton',
      title: 'Binary/Prefix Trie & Aho-Corasick Automaton',
    },
  ],
  traceTitle: 'Interactive Suffix Automaton (SAM) State Cloning & Endpos Link Trace',
  traceSubtitle:
    'Insert `"abcbc"` character-by-character and observe how adding the second `b` creates state `5` via `len[p]+1 == len[q]`, while appending `c` triggers a `clone` split!',
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Step 1: Insert "a", "b", "c" — Linear Chain With Suffix Links Back to Root 0',
      explanation:
        'Root state 0 has len=0, link=-1. Inserting "a" -> state 1 (len=1, link=0); "b" -> state 2 (len=2, link=0); "c" -> state 3 (len=3, link=0). Total distinct substrings = sum(len[v] - len[link[v]]) = 1 + 2 + 3 = 6.',
      mode: 'array',
      arrays: [
        {
          name: 'SAM States After "abc"',
          cells: [
            { index: 0, value: 'len=0, lk=-1', label: 'Root 0', highlight: 'neutral' },
            { index: 1, value: 'len=1, lk=0', label: 'State 1 ("a")', highlight: 'window' },
            { index: 2, value: 'len=2, lk=0', label: 'State 2 ("ab")', highlight: 'window' },
            { index: 3, value: 'len=3, lk=0', label: 'State 3 ("abc")', highlight: 'active' },
          ],
        },
      ],
      variables: { LastState: 3, DistinctSubstrings: 6, Clones: 0 },
    },
    {
      stepNumber: 2,
      title: 'Step 2: Append "b" -> Walk Links to Root 0 -> Hit State 2 (len[0]+1 != len[2] -> CLONE!)',
      explanation:
        'Append "b" from last=3: State 3 has no "b"-edge -> next[3]["b"] = 4 (len=4). Follow link[3]=0: Root 0 ALREADY has next[0]["b"] = q=2 (len[2]=2)! Since len[0]+1 = 1 != len[2] = 2 ("ab" != "b"), we CLONE state 2 into state 5 with len=1, link[5]=0, link[2]=5, link[4]=5!',
      mode: 'array',
      arrays: [
        {
          name: 'SAM States After Appending "b" ("abcb") — Clone State 5 Created!',
          cells: [
            { index: 2, value: 'len=2, lk=5', label: '"ab" only', highlight: 'window' },
            { index: 4, value: 'len=4, lk=5', label: '"abcb","bcb","cb"', highlight: 'active' },
            { index: 5, value: 'len=1, lk=0', label: 'Clone 5 ("b")', highlight: 'updated' },
          ],
        },
      ],
      variables: { ClonedFrom: 2, NewCloneId: 5, LenClone: 1, DistinctSubstrings: 9 },
    },
    {
      stepNumber: 3,
      title: 'Step 3: Append "c" ("abcbc") -> Clone State 3 into State 7 ("bc","c") & Propagate endpos',
      explanation:
        'From last=4 ("abcb"), create state 6 (len=5). Walk link[4]=5 ("b"): since state 5 inherited next[2]["c"]=3 (len=3) and len[5]+1 = 2 != len[3] = 3, clone state 3 into state 7 (len=2, link=0, representing {"bc", "c"}) and set link[3] = link[6] = 7. Propagating endpos sizes bottom-up (occ[link[v]] += occ[v]) gives exact counts for every substring class across all 12 distinct substrings!',
      mode: 'array',
      arrays: [
        {
          name: 'Top Substring Classes in SAM("abcbc")',
          cells: [
            { index: 5, value: 'occ=2 ("b")', label: 'len=1', highlight: 'updated' },
            { index: 7, value: 'occ=2 ("bc","c")', label: 'len=2', highlight: 'updated' },
            { index: 6, value: 'occ=1 ("abcbc")', label: 'len=5', highlight: 'active' },
            { index: 99, value: 'Total Distinct = 12', label: 'Verified', highlight: 'active' },
          ],
        },
      ],
      variables: { TotalStates: 8, DistinctSubstrings: 12, MaxOccurrences: 'b:2, bc:2, c:2' },
    },
  ],
  reductionClues: [
    {
      clue: '"Count distinct substrings, sum of lengths of distinct substrings, or K-th lexicographical distinct substring"',
      translation:
        '**Suffix Automaton (SAM)**! Distinct count is simply `sum(len[v] - len[link[v]])` over `v >= 1`; K-th substring runs `O(N * Sigma)` DAG DP `dp[u] = 1 + sum_{c} dp[next[u][c]]` in one reverse-topological pass!',
    },
    {
      clue: '"Longest Common Substring of 2 (or M) strings, or count occurrences of EVERY query pattern P"',
      translation:
        'Build SAM on `S`. To count occurrences of any pattern `P` in `O(|P|)`, just walk transitions from state `0` and read precomputed **`occ[v]`** (`occ` is seeded as `1` ONLY on non-cloned states and summed upward along `link[v]`)!',
    },
    {
      clue: '"Distinct palindromic substrings, number of occurrences of each palindrome, or max (len * occ) over all palindromes"',
      translation:
        '**Eertree (Palindromic Tree)**! It builds `<= N + 2` palindrome nodes in `O(N)` (`root 0` length `-1`, `root 1` length `0`), and summing `occ[link[v]] += occ[v]` in reverse node order `sz-1 .. 2` yields exact frequencies of every distinct palindrome in `O(N)`!',
    },
    {
      clue: '"Maximum over all substrings w of |w| * occurrences(w) (or min occurrences >= K)"',
      translation:
        'Propagate `occ[v]` up the SAM suffix-link tree (sorting states by `len[v]` descending via counting sort in `O(N)`) and take `max(len[v] * occ[v])`!',
    },
  ],
  timeComplexity: 'SAM Construction: O(N * Sigma) | Eertree Construction: O(N * Sigma)',
  spaceComplexity: 'SAM: <= 2N states * Sigma ints | Eertree: <= (N + 2) states * Sigma ints',
  pitfalls: [
    {
      type: 'WA',
      title: 'Initializing occ[clone] = 1 Instead of 0 When Counting Substring Occurrences',
      detail:
        'A cloned state splits an existing `endpos` class — it does NOT correspond to a new prefix ending position! ALWAYS set `occ[cur] = 1` on real prefix extensions, and **`occ[clone] = 0`** on clones (otherwise every clone double-counts occurrences!).',
    },
    {
      type: 'MLE',
      title: 'Allocating 26-Element Transition Arrays for 2*N = 2*10^6 States on N = 10^6',
      detail:
        'With `N = 10^6`, `2N` states x `26` `int`s = `208 MB`, which fits a `256 MB` limit cleanly, whereas `long long` (`416 MB`) or large `std::map` overhead triggers MLE/TLE! Store `int next[26]` in flat `vector<array<int, 26>>` (and reserve `2 * N + 2` capacity upfront).',
    },
    {
      type: 'WA',
      title: 'Using Recursion Instead of Counting Sort to Propagate endpos Counts Up SAM Links',
      detail:
        'On `"aaaa...a"` (`N = 5 * 10^5`), the suffix-link tree has depth `N`, overflowing the C++/Python call stack! Instead, bucket-sort states by `len[v]` in `O(N)` and iterate from `len = N` down to `1`: `occ[link[v]] += occ[v]`.',
    },
    {
      type: 'WA',
      title: 'Wrong Root Initialization in Eertree (Length 0 vs Length -1)',
      detail:
        'In an Eertree, `node 0` has `len[0] = -1, link[0] = 0` (odd-palindrome root), and `node 1` has `len[1] = 0, link[1] = 0` (even-palindrome root), with `s[0] = sentinel` (`#`). Starting `last = 1` and carefully checking `getLink(p)` ensures single-character palindromes fallback cleanly to `node 0` where `pos - (-1) - 1 == pos`!',
    },
  ],
  implementations: {
    cpp20: `#include <bits/stdc++.h>
using namespace std;

// Suffix Automaton (SAM) with O(N) counting-sort endpos frequency propagation
struct SuffixAutomaton {
    struct State {
        int len = 0, link = -1;
        array<int, 26> next{};
        State() { next.fill(-1); }
    };

    vector<State> st;
    vector<long long> occ;
    int last = 0;

    SuffixAutomaton(int maxLen) {
        st.reserve(2 * maxLen + 2);
        occ.reserve(2 * maxLen + 2);
        st.push_back(State{});
        occ.push_back(0);
    }

    void extend(char ch) {
        int c = ch - 'a';
        int cur = (int)st.size();
        st.push_back(State{});
        occ.push_back(1);
        st[cur].len = st[last].len + 1;

        int p = last;
        while (p != -1 && st[p].next[c] == -1) {
            st[p].next[c] = cur;
            p = st[p].link;
        }
        if (p == -1) {
            st[cur].link = 0;
        } else {
            int q = st[p].next[c];
            if (st[p].len + 1 == st[q].len) {
                st[cur].link = q;
            } else {
                int clone = (int)st.size();
                st.push_back(st[q]);
                st[clone].len = st[p].len + 1;
                occ.push_back(0); // Clones NEVER receive initial occurrence 1
                while (p != -1 && st[p].next[c] == q) {
                    st[p].next[c] = clone;
                    p = st[p].link;
                }
                st[q].link = clone;
                st[cur].link = clone;
            }
        }
        last = cur;
    }

    void buildOccurrences(int n) {
        int sz = (int)st.size();
        vector<int> cnt(n + 1, 0), order(sz);
        for (int i = 0; i < sz; i++) cnt[st[i].len]++;
        for (int i = 1; i <= n; i++) cnt[i] += cnt[i - 1];
        for (int i = sz - 1; i >= 0; i--) order[--cnt[st[i].len]] = i;
        for (int i = sz - 1; i >= 1; i--) {
            int v = order[i];
            if (st[v].link != -1) occ[st[v].link] += occ[v];
        }
    }

    long long distinctSubstrings() const {
        long long ans = 0;
        for (int i = 1; i < (int)st.size(); i++) {
            ans += st[i].len - st[st[i].link].len;
        }
        return ans;
    }

    long long countPattern(const string& p) const {
        int u = 0;
        for (char ch : p) {
            u = st[u].next[ch - 'a'];
            if (u == -1) return 0;
        }
        return occ[u];
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    string s;
    int q;
    if (!(cin >> s >> q)) return 0;

    SuffixAutomaton sam((int)s.size());
    for (char c : s) sam.extend(c);
    sam.buildOccurrences((int)s.size());

    cout << sam.distinctSubstrings() << "\\n";
    while (q--) {
        string p;
        cin >> p;
        cout << sam.countPattern(p) << "\\n";
    }
    return 0;
}`,
    rust: `use std::io::{self, Read};

#[derive(Clone)]
struct State {
    len: usize,
    link: isize,
    next: [isize; 26],
}

impl State {
    fn new() -> Self {
        Self { len: 0, link: -1, next: [-1; 26] }
    }
}

struct SuffixAutomaton {
    st: Vec<State>,
    occ: Vec<i64>,
    last: usize,
}

impl SuffixAutomaton {
    fn new(max_len: usize) -> Self {
        let mut st = Vec::with_capacity(2 * max_len + 2);
        let mut occ = Vec::with_capacity(2 * max_len + 2);
        st.push(State::new());
        occ.push(0);
        Self { st, occ, last: 0 }
    }

    fn extend(&mut self, b: u8) {
        let c = (b - b'a') as usize;
        let cur = self.st.len();
        let mut cur_st = State::new();
        cur_st.len = self.st[self.last].len + 1;
        self.st.push(cur_st);
        self.occ.push(1);

        let mut p = self.last as isize;
        while p != -1 && self.st[p as usize].next[c] == -1 {
            self.st[p as usize].next[c] = cur as isize;
            p = self.st[p as usize].link;
        }
        if p == -1 {
            self.st[cur].link = 0;
        } else {
            let q = self.st[p as usize].next[c] as usize;
            if self.st[p as usize].len + 1 == self.st[q].len {
                self.st[cur].link = q as isize;
            } else {
                let clone = self.st.len();
                let mut cl = self.st[q].clone();
                cl.len = self.st[p as usize].len + 1;
                self.st.push(cl);
                self.occ.push(0);

                while p != -1 && self.st[p as usize].next[c] == q as isize {
                    self.st[p as usize].next[c] = clone as isize;
                    p = self.st[p as usize].link;
                }
                self.st[q].link = clone as isize;
                self.st[cur].link = clone as isize;
            }
        }
        self.last = cur;
    }

    fn build_occurrences(&mut self, n: usize) {
        let sz = self.st.len();
        let mut cnt = vec![0usize; n + 1];
        for s in &self.st {
            cnt[s.len] += 1;
        }
        for i in 1..=n {
            cnt[i] += cnt[i - 1];
        }
        let mut order = vec![0usize; sz];
        for i in (0..sz).rev() {
            cnt[self.st[i].len] -= 1;
            order[cnt[self.st[i].len]] = i;
        }
        for &v in order.iter().rev() {
            let lk = self.st[v].link;
            if lk > 0 {
                self.occ[lk as usize] += self.occ[v];
            }
        }
    }

    fn distinct_substrings(&self) -> i64 {
        let mut ans = 0i64;
        for i in 1..self.st.len() {
            let lk = self.st[i].link as usize;
            ans += (self.st[i].len - self.st[lk].len) as i64;
        }
        ans
    }

    fn count_pattern(&self, p: &[u8]) -> i64 {
        let mut u = 0usize;
        for &b in p {
            let nx = self.st[u].next[(b - b'a') as usize];
            if nx == -1 {
                return 0;
            }
            u = nx as usize;
        }
        self.occ[u]
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

    let mut sam = SuffixAutomaton::new(s.len());
    for &b in s {
        sam.extend(b);
    }
    sam.build_occurrences(s.len());

    let mut out = format!("{}\\n", sam.distinct_substrings());
    for _ in 0..q {
        let p = it.next().unwrap().as_bytes();
        out.push_str(&format!("{}\\n", sam.count_pattern(p)));
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
        String next() throws IOException {
            int c = readByte();
            while (c >= 0 && c <= ' ') c = readByte();
            if (c == -1) return null;
            StringBuilder sb = new StringBuilder();
            while (c > ' ') { sb.append((char) c); c = readByte(); }
            return sb.toString();
        }
        int nextInt() throws IOException {
            String s = next();
            return s == null ? -1 : Integer.parseInt(s);
        }
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        String s = fs.next();
        if (s == null) return;
        int q = fs.nextInt();
        int n = s.length(), maxSt = 2 * n + 2;

        int[] len = new int[maxSt];
        int[] link = new int[maxSt];
        long[] occ = new long[maxSt];
        int[][] next = new int[maxSt][26];
        for (int i = 0; i < maxSt; i++) Arrays.fill(next[i], -1);
        link[0] = -1;
        int sz = 1, last = 0;

        for (int i = 0; i < n; i++) {
            int c = s.charAt(i) - 'a';
            int cur = sz++;
            len[cur] = len[last] + 1;
            occ[cur] = 1;
            int p = last;
            while (p != -1 && next[p][c] == -1) {
                next[p][c] = cur;
                p = link[p];
            }
            if (p == -1) {
                link[cur] = 0;
            } else {
                int qSt = next[p][c];
                if (len[p] + 1 == len[qSt]) {
                    link[cur] = qSt;
                } else {
                    int clone = sz++;
                    len[clone] = len[p] + 1;
                    System.arraycopy(next[qSt], 0, next[clone], 0, 26);
                    link[clone] = link[qSt];
                    while (p != -1 && next[p][c] == qSt) {
                        next[p][c] = clone;
                        p = link[p];
                    }
                    link[qSt] = clone;
                    link[cur] = clone;
                }
            }
            last = cur;
        }

        int[] cnt = new int[n + 1], order = new int[sz];
        for (int i = 0; i < sz; i++) cnt[len[i]]++;
        for (int i = 1; i <= n; i++) cnt[i] += cnt[i - 1];
        for (int i = sz - 1; i >= 0; i--) order[--cnt[len[i]]] = i;
        for (int i = sz - 1; i >= 1; i--) {
            int v = order[i];
            if (link[v] > 0) occ[link[v]] += occ[v];
        }

        long distinct = 0;
        for (int i = 1; i < sz; i++) distinct += len[i] - len[link[i]];

        StringBuilder sb = new StringBuilder();
        sb.append(distinct).append('\\n');
        for (int qi = 0; qi < q; qi++) {
            String pat = fs.next();
            int u = 0;
            for (int i = 0; i < pat.length(); i++) {
                u = next[u][pat.charAt(i) - 'a'];
                if (u == -1) break;
            }
            sb.append(u == -1 ? 0 : occ[u]).append('\\n');
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
    s = data[0]
    q = int(data[1])
    n = len(s)

    max_st = 2 * n + 2
    length = [0] * max_st
    link = [-1] * max_st
    occ = [0] * max_st
    nxt = [[-1] * 26 for _ in range(max_st)]
    sz = 1
    last = 0

    for ch in s:
        c = ord(ch) - 97
        cur = sz
        sz += 1
        length[cur] = length[last] + 1
        occ[cur] = 1
        p = last
        while p != -1 and nxt[p][c] == -1:
            nxt[p][c] = cur
            p = link[p]
        if p == -1:
            link[cur] = 0
        else:
            q_st = nxt[p][c]
            if length[p] + 1 == length[q_st]:
                link[cur] = q_st
            else:
                clone = sz
                sz += 1
                length[clone] = length[p] + 1
                nxt[clone] = nxt[q_st][:]
                link[clone] = link[q_st]
                while p != -1 and nxt[p][c] == q_st:
                    nxt[p][c] = clone
                    p = link[p]
                link[q_st] = clone
                link[cur] = clone
        last = cur

    cnt = [0] * (n + 1)
    for i in range(sz):
        cnt[length[i]] += 1
    for i in range(1, n + 1):
        cnt[i] += cnt[i - 1]
    order = [0] * sz
    for i in range(sz - 1, -1, -1):
        cnt[length[i]] -= 1
        order[cnt[length[i]]] = i
    for i in range(sz - 1, 0, -1):
        v = order[i]
        lk = link[v]
        if lk > 0:
            occ[lk] += occ[v]

    distinct = sum(length[i] - length[link[i]] for i in range(1, sz))
    out = [str(distinct)]
    for pat in data[2:2 + q]:
        u = 0
        for ch in pat:
            u = nxt[u][ord(ch) - 97]
            if u == -1:
                break
        out.append("0" if u == -1 else str(occ[u]))
    sys.stdout.write("\\n".join(out) + "\\n")

if __name__ == "__main__":
    solve()`,
    ruby: `tokens = $stdin.read.split
exit if tokens.empty?
s = tokens[0]
q = tokens[1].to_i
n = s.length

max_st = 2 * n + 2
length = Array.new(max_st, 0)
link = Array.new(max_st, -1)
occ = Array.new(max_st, 0)
nxt = Array.new(max_st) { Array.new(26, -1) }
sz = 1
last = 0

s.each_byte do |b|
  c = b - 97
  cur = sz
  sz += 1
  length[cur] = length[last] + 1
  occ[cur] = 1
  p = last
  while p != -1 && nxt[p][c] == -1
    nxt[p][c] = cur
    p = link[p]
  end
  if p == -1
    link[cur] = 0
  else
    q_st = nxt[p][c]
    if length[p] + 1 == length[q_st]
      link[cur] = q_st
    else
      clone = sz
      sz += 1
      length[clone] = length[p] + 1
      nxt[clone] = nxt[q_st].dup
      link[clone] = link[q_st]
      while p != -1 && nxt[p][c] == q_st
        nxt[p][c] = clone
        p = link[p]
      end
      link[q_st] = clone
      link[cur] = clone
    end
  end
  last = cur
end

cnt = Array.new(n + 1, 0)
sz.times { |i| cnt[length[i]] += 1 }
(1..n).each { |i| cnt[i] += cnt[i - 1] }
order = Array.new(sz, 0)
(sz - 1).downto(0) do |i|
  cnt[length[i]] -= 1
  order[cnt[length[i]]] = i
end
(sz - 1).downto(1) do |i|
  v = order[i]
  lk = link[v]
  occ[lk] += occ[v] if lk > 0
end

distinct = (1...sz).sum { |i| length[i] - length[link[i]] }
out = [distinct.to_s]
tokens[2, q].each do |pat|
  u = 0
  pat.each_byte do |b|
    u = nxt[u][b - 97]
    break if u == -1
  end
  out << (u == -1 ? "0" : occ[u].to_s)
end
puts out.join("\\n")`,
  },
  practiceProblems: [
    {
      id: 'ch47-p1',
      tier: 'Warmup',
      ratingRange: '2050–2250',
      title: 'Distinct Substrings & Total Substring Length Sum in O(N)',
      statement:
        'Given a lowercase string `S` of length `N`, compute two values in `O(N)` time: (1) the number of distinct non-empty substrings of `S`, and (2) the sum of the lengths of all distinct non-empty substrings of `S`.',
      constraints: '1 <= N <= 5 * 10^5, lowercase English letters',
      sampleInput: 'ababa',
      sampleOutput: '9 25',
      hints: [
        'Each SAM state `v >= 1` represents every substring whose length falls in `[len[link[v]] + 1 .. len[v]]`, so state `v` adds `len[v] - len[link[v]]` distinct substrings.',
        'The sum of lengths inside state `v` is the arithmetic series `sum_{k = L..R} k = R*(R+1)/2 - L*(L+1)/2` where `R = len[v]` and `L = len[link[v]]`!',
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

    vector<int> len(2 * n + 2, 0), link(2 * n + 2, -1);
    vector<array<int, 26>> nxt(2 * n + 2);
    for (auto& a : nxt) a.fill(-1);
    int sz = 1, last = 0;

    for (char ch : s) {
        int c = ch - 'a', cur = sz++;
        len[cur] = len[last] + 1;
        int p = last;
        while (p != -1 && nxt[p][c] == -1) { nxt[p][c] = cur; p = link[p]; }
        if (p == -1) link[cur] = 0;
        else {
            int q = nxt[p][c];
            if (len[p] + 1 == len[q]) link[cur] = q;
            else {
                int clone = sz++;
                len[clone] = len[p] + 1;
                nxt[clone] = nxt[q];
                link[clone] = link[q];
                while (p != -1 && nxt[p][c] == q) { nxt[p][c] = clone; p = link[p]; }
                link[q] = link[cur] = clone;
            }
        }
        last = cur;
    }

    long long cnt = 0, lenSum = 0;
    for (int i = 1; i < sz; i++) {
        long long R = len[i], L = len[link[i]];
        cnt += R - L;
        lenSum += R * (R + 1) / 2 - L * (L + 1) / 2;
    }
    cout << cnt << " " << lenSum << "\\n";
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
    let mut len = vec![0usize; 2 * n + 2];
    let mut link = vec![-1isize; 2 * n + 2];
    let mut nxt = vec![[-1isize; 26]; 2 * n + 2];
    let mut sz = 1usize;
    let mut last = 0usize;

    for &b in s {
        let c = (b - b'a') as usize;
        let cur = sz;
        sz += 1;
        len[cur] = len[last] + 1;
        let mut p = last as isize;
        while p != -1 && nxt[p as usize][c] == -1 {
            nxt[p as usize][c] = cur as isize;
            p = link[p as usize];
        }
        if p == -1 {
            link[cur] = 0;
        } else {
            let q = nxt[p as usize][c] as usize;
            if len[p as usize] + 1 == len[q] {
                link[cur] = q as isize;
            } else {
                let clone = sz;
                sz += 1;
                len[clone] = len[p as usize] + 1;
                nxt[clone] = nxt[q];
                link[clone] = link[q];
                while p != -1 && nxt[p as usize][c] == q as isize {
                    nxt[p as usize][c] = clone as isize;
                    p = link[p as usize];
                }
                link[q] = clone as isize;
                link[cur] = clone as isize;
            }
        }
        last = cur;
    }

    let mut cnt = 0i64;
    let mut len_sum = 0i64;
    for i in 1..sz {
        let r = len[i] as i64;
        let l = len[link[i] as usize] as i64;
        cnt += r - l;
        len_sum += r * (r + 1) / 2 - l * (l + 1) / 2;
    }
    println!("{} {}", cnt, len_sum);
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
            while (c > ' ') { sb.append((char) c); c = readByte(); }
            return sb.toString();
        }
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        String s = fs.next();
        if (s == null) return;
        int n = s.length(), maxSt = 2 * n + 2;
        int[] len = new int[maxSt], link = new int[maxSt];
        int[][] nxt = new int[maxSt][26];
        for (int i = 0; i < maxSt; i++) Arrays.fill(nxt[i], -1);
        link[0] = -1;
        int sz = 1, last = 0;

        for (int i = 0; i < n; i++) {
            int c = s.charAt(i) - 'a', cur = sz++;
            len[cur] = len[last] + 1;
            int p = last;
            while (p != -1 && nxt[p][c] == -1) { nxt[p][c] = cur; p = link[p]; }
            if (p == -1) link[cur] = 0;
            else {
                int q = nxt[p][c];
                if (len[p] + 1 == len[q]) link[cur] = q;
                else {
                    int clone = sz++;
                    len[clone] = len[p] + 1;
                    System.arraycopy(nxt[q], 0, nxt[clone], 0, 26);
                    link[clone] = link[q];
                    while (p != -1 && nxt[p][c] == q) { nxt[p][c] = clone; p = link[p]; }
                    link[q] = link[cur] = clone;
                }
            }
            last = cur;
        }

        long cnt = 0, lenSum = 0;
        for (int i = 1; i < sz; i++) {
            long r = len[i], l = len[link[i]];
            cnt += r - l;
            lenSum += r * (r + 1) / 2 - l * (l + 1) / 2;
        }
        System.out.println(cnt + " " + lenSum);
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
    max_st = 2 * n + 2
    length = [0] * max_st
    link = [-1] * max_st
    nxt = [[-1] * 26 for _ in range(max_st)]
    sz = 1
    last = 0

    for ch in s:
        c = ord(ch) - 97
        cur = sz
        sz += 1
        length[cur] = length[last] + 1
        p = last
        while p != -1 and nxt[p][c] == -1:
            nxt[p][c] = cur
            p = link[p]
        if p == -1:
            link[cur] = 0
        else:
            q = nxt[p][c]
            if length[p] + 1 == length[q]:
                link[cur] = q
            else:
                clone = sz
                sz += 1
                length[clone] = length[p] + 1
                nxt[clone] = nxt[q][:]
                link[clone] = link[q]
                while p != -1 and nxt[p][c] == q:
                    nxt[p][c] = clone
                    p = link[p]
                link[q] = clone
                link[cur] = clone
        last = cur

    cnt = 0
    len_sum = 0
    for i in range(1, sz):
        r = length[i]
        l = length[link[i]]
        cnt += r - l
        len_sum += r * (r + 1) // 2 - l * (l + 1) // 2
    sys.stdout.write(f"{cnt} {len_sum}\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `s = $stdin.read.split.first
exit unless s
n = s.length
max_st = 2 * n + 2
length = Array.new(max_st, 0)
link = Array.new(max_st, -1)
nxt = Array.new(max_st) { Array.new(26, -1) }
sz = 1
last = 0

s.each_byte do |b|
  c = b - 97
  cur = sz
  sz += 1
  length[cur] = length[last] + 1
  p = last
  while p != -1 && nxt[p][c] == -1
    nxt[p][c] = cur
    p = link[p]
  end
  if p == -1
    link[cur] = 0
  else
    q = nxt[p][c]
    if length[p] + 1 == length[q]
      link[cur] = q
    else
      clone = sz
      sz += 1
      length[clone] = length[p] + 1
      nxt[clone] = nxt[q].dup
      link[clone] = link[q]
      while p != -1 && nxt[p][c] == q
        nxt[p][c] = clone
        p = link[p]
      end
      link[q] = clone
      link[cur] = clone
    end
  end
  last = cur
end

cnt = 0
len_sum = 0
(1...sz).each do |i|
  r = length[i]
  l = length[link[i]]
  cnt += r - l
  len_sum += r * (r + 1) / 2 - l * (l + 1) / 2
end
puts "#{cnt} #{len_sum}"`,
      },
    },
    {
      id: 'ch47-p2',
      tier: 'Standard',
      ratingRange: '2150–2350',
      title: 'Longest Common Substring of Two Strings via SAM Streaming',
      statement:
        'Given two lowercase strings `S` and `T`, find the length of their longest common contiguous substring (i.e. maximum `|W|` such that `W` is a substring of both `S` and `T`) in `O(|S| + |T|)` time.',
      constraints: '1 <= |S|, |T| <= 2.5 * 10^5, lowercase English letters',
      sampleInput: 'abcbcbc\nbbcbca',
      sampleOutput: '4',
      hints: [
        'Build the Suffix Automaton on `S` only. Maintain current state `v = 0` and matched length `curLen = 0` as you scan each character `c` of `T`.',
        'While `v != 0 && nxt[v][c] == -1`, rewind `v = link[v]` and reset `curLen = len[v]`! Then if `nxt[v][c] != -1`, advance `v = nxt[v][c]; curLen++` and update `ans = max(ans, curLen)`.',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    string s, t;
    if (!(cin >> s >> t)) return 0;
    int n = (int)s.size();

    vector<int> len(2 * n + 2, 0), link(2 * n + 2, -1);
    vector<array<int, 26>> nxt(2 * n + 2);
    for (auto& a : nxt) a.fill(-1);
    int sz = 1, last = 0;

    for (char ch : s) {
        int c = ch - 'a', cur = sz++;
        len[cur] = len[last] + 1;
        int p = last;
        while (p != -1 && nxt[p][c] == -1) { nxt[p][c] = cur; p = link[p]; }
        if (p == -1) link[cur] = 0;
        else {
            int q = nxt[p][c];
            if (len[p] + 1 == len[q]) link[cur] = q;
            else {
                int clone = sz++;
                len[clone] = len[p] + 1;
                nxt[clone] = nxt[q];
                link[clone] = link[q];
                while (p != -1 && nxt[p][c] == q) { nxt[p][c] = clone; p = link[p]; }
                link[q] = link[cur] = clone;
            }
        }
        last = cur;
    }

    int v = 0, curLen = 0, ans = 0;
    for (char ch : t) {
        int c = ch - 'a';
        while (v != 0 && nxt[v][c] == -1) {
            v = link[v];
            curLen = len[v];
        }
        if (nxt[v][c] != -1) {
            v = nxt[v][c];
            curLen++;
            ans = max(ans, curLen);
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
    let s = match it.next() {
        Some(v) => v.as_bytes(),
        None => return,
    };
    let t = it.next().unwrap().as_bytes();

    let n = s.len();
    let mut len = vec![0usize; 2 * n + 2];
    let mut link = vec![-1isize; 2 * n + 2];
    let mut nxt = vec![[-1isize; 26]; 2 * n + 2];
    let mut sz = 1usize;
    let mut last = 0usize;

    for &b in s {
        let c = (b - b'a') as usize;
        let cur = sz;
        sz += 1;
        len[cur] = len[last] + 1;
        let mut p = last as isize;
        while p != -1 && nxt[p as usize][c] == -1 {
            nxt[p as usize][c] = cur as isize;
            p = link[p as usize];
        }
        if p == -1 {
            link[cur] = 0;
        } else {
            let q = nxt[p as usize][c] as usize;
            if len[p as usize] + 1 == len[q] {
                link[cur] = q as isize;
            } else {
                let clone = sz;
                sz += 1;
                len[clone] = len[p as usize] + 1;
                nxt[clone] = nxt[q];
                link[clone] = link[q];
                while p != -1 && nxt[p as usize][c] == q as isize {
                    nxt[p as usize][c] = clone as isize;
                    p = link[p as usize];
                }
                link[q] = clone as isize;
                link[cur] = clone as isize;
            }
        }
        last = cur;
    }

    let mut v = 0usize;
    let mut cur_len = 0usize;
    let mut ans = 0usize;
    for &b in t {
        let c = (b - b'a') as usize;
        while v != 0 && nxt[v][c] == -1 {
            v = link[v] as usize;
            cur_len = len[v];
        }
        if nxt[v][c] != -1 {
            v = nxt[v][c] as usize;
            cur_len += 1;
            ans = ans.max(cur_len);
        }
    }
    println!("{}", ans);
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
            while (c > ' ') { sb.append((char) c); c = readByte(); }
            return sb.toString();
        }
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        String s = fs.next();
        if (s == null) return;
        String t = fs.next();

        int n = s.length(), maxSt = 2 * n + 2;
        int[] len = new int[maxSt], link = new int[maxSt];
        int[][] nxt = new int[maxSt][26];
        for (int i = 0; i < maxSt; i++) Arrays.fill(nxt[i], -1);
        link[0] = -1;
        int sz = 1, last = 0;

        for (int i = 0; i < n; i++) {
            int c = s.charAt(i) - 'a', cur = sz++;
            len[cur] = len[last] + 1;
            int p = last;
            while (p != -1 && nxt[p][c] == -1) { nxt[p][c] = cur; p = link[p]; }
            if (p == -1) link[cur] = 0;
            else {
                int q = nxt[p][c];
                if (len[p] + 1 == len[q]) link[cur] = q;
                else {
                    int clone = sz++;
                    len[clone] = len[p] + 1;
                    System.arraycopy(nxt[q], 0, nxt[clone], 0, 26);
                    link[clone] = link[q];
                    while (p != -1 && nxt[p][c] == q) { nxt[p][c] = clone; p = link[p]; }
                    link[q] = link[cur] = clone;
                }
            }
            last = cur;
        }

        int v = 0, curLen = 0, ans = 0;
        for (int i = 0; i < t.length(); i++) {
            int c = t.charAt(i) - 'a';
            while (v != 0 && nxt[v][c] == -1) {
                v = link[v];
                curLen = len[v];
            }
            if (nxt[v][c] != -1) {
                v = nxt[v][c];
                curLen++;
                if (curLen > ans) ans = curLen;
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
    s, t = data[0], data[1]
    n = len(s)
    max_st = 2 * n + 2
    length = [0] * max_st
    link = [-1] * max_st
    nxt = [[-1] * 26 for _ in range(max_st)]
    sz = 1
    last = 0

    for ch in s:
        c = ord(ch) - 97
        cur = sz
        sz += 1
        length[cur] = length[last] + 1
        p = last
        while p != -1 and nxt[p][c] == -1:
            nxt[p][c] = cur
            p = link[p]
        if p == -1:
            link[cur] = 0
        else:
            q = nxt[p][c]
            if length[p] + 1 == length[q]:
                link[cur] = q
            else:
                clone = sz
                sz += 1
                length[clone] = length[p] + 1
                nxt[clone] = nxt[q][:]
                link[clone] = link[q]
                while p != -1 and nxt[p][c] == q:
                    nxt[p][c] = clone
                    p = link[p]
                link[q] = clone
                link[cur] = clone
        last = cur

    v = 0
    cur_len = 0
    ans = 0
    for ch in t:
        c = ord(ch) - 97
        while v != 0 and nxt[v][c] == -1:
            v = link[v]
            cur_len = length[v]
        if nxt[v][c] != -1:
            v = nxt[v][c]
            cur_len += 1
            if cur_len > ans:
                ans = cur_len
    sys.stdout.write(f"{ans}\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.length < 2
s, t = tokens[0], tokens[1]
n = s.length
max_st = 2 * n + 2
length = Array.new(max_st, 0)
link = Array.new(max_st, -1)
nxt = Array.new(max_st) { Array.new(26, -1) }
sz = 1
last = 0

s.each_byte do |b|
  c = b - 97
  cur = sz
  sz += 1
  length[cur] = length[last] + 1
  p = last
  while p != -1 && nxt[p][c] == -1
    nxt[p][c] = cur
    p = link[p]
  end
  if p == -1
    link[cur] = 0
  else
    q = nxt[p][c]
    if length[p] + 1 == length[q]
      link[cur] = q
    else
      clone = sz
      sz += 1
      length[clone] = length[p] + 1
      nxt[clone] = nxt[q].dup
      link[clone] = link[q]
      while p != -1 && nxt[p][c] == q
        nxt[p][c] = clone
        p = link[p]
      end
      link[q] = clone
      link[cur] = clone
    end
  end
  last = cur
end

v = 0
cur_len = 0
ans = 0
t.each_byte do |b|
  c = b - 97
  while v != 0 && nxt[v][c] == -1
    v = link[v]
    cur_len = length[v]
  end
  if nxt[v][c] != -1
    v = nxt[v][c]
    cur_len += 1
    ans = cur_len if cur_len > ans
  end
end
puts ans`,
      },
    },
    {
      id: 'ch47-p3',
      tier: 'Boss',
      ratingRange: '2250–2550',
      title: 'Eertree (Palindromic Tree) — Distinct Palindromes & Occurrence Propagation in O(N)',
      statement:
        'Given a lowercase string `S` of length `N`, construct a **Palindromic Tree (Eertree)** in `O(N)` time and compute: (1) the number of **distinct non-empty palindromic substrings**, and (2) the **sum of occurrences** of all palindromic substrings across `S` (i.e., total palindromic substrings).',
      constraints: '1 <= N <= 3 * 10^5, lowercase English letters',
      sampleInput: 'ababa',
      sampleOutput: '5 9',
      hints: [
        'Initialize `node 0` (`len = -1, link = 0`) and `node 1` (`len = 0, link = 0`), `last = 1`. When reading `s[pos]`, follow `cur = link[cur]` until `pos - len[cur] - 1 >= 0 && s[pos - len[cur] - 1] == s[pos]`.',
        'If `nxt[cur][c] == 0`, create node `now = sz++` with `len[now] = len[cur] + 2`, find its longest proper palindromic suffix via `getLink(link[cur], pos)` (or `0` if `cur == 0` so `link[now] = 1`), and attach `nxt[cur][c] = now`. Increment `occ[last]++` at every index, then sum `occ[link[v]] += occ[v]` from `sz - 1` down to `2`!',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

// Eertree (Palindromic Tree): O(N) distinct palindromes & total palindrome occurrences
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    string s;
    if (!(cin >> s)) return 0;
    int n = (int)s.size();

    vector<int> len(n + 3, 0), link(n + 3, 0);
    vector<long long> occ(n + 3, 0);
    vector<array<int, 26>> nxt(n + 3);
    for (auto& a : nxt) a.fill(0);

    len[0] = -1; link[0] = 0;
    len[1] = 0;  link[1] = 0;
    int sz = 2, last = 1;

    auto getLink = [&](int v, int pos) {
        while (pos - len[v] - 1 < 0 || s[pos - len[v] - 1] != s[pos]) {
            v = link[v];
        }
        return v;
    };

    for (int i = 0; i < n; i++) {
        int c = s[i] - 'a';
        int cur = getLink(last, i);
        if (!nxt[cur][c]) {
            int now = sz++;
            len[now] = len[cur] + 2;
            link[now] = (cur == 0) ? 1 : nxt[getLink(link[cur], i)][c];
            nxt[cur][c] = now;
        }
        last = nxt[cur][c];
        occ[last]++;
    }

    long long totalOcc = 0;
    for (int i = sz - 1; i >= 2; i--) {
        occ[link[i]] += occ[i];
        totalOcc += occ[i];
    }
    cout << (sz - 2) << " " << totalOcc << "\\n";
    return 0;
}`,
        rust: `use std::io::{self, Read};

fn get_link(v_start: usize, pos: usize, s: &[u8], len: &[isize], link: &[usize]) -> usize {
    let mut v = v_start;
    loop {
        let prev = pos as isize - len[v] - 1;
        if prev >= 0 && s[prev as usize] == s[pos] {
            return v;
        }
        v = link[v];
    }
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let s = match input.split_whitespace().next() {
        Some(v) => v.as_bytes(),
        None => return,
    };
    let n = s.len();

    let mut len = vec![0isize; n + 3];
    let mut link = vec![0usize; n + 3];
    let mut occ = vec![0i64; n + 3];
    let mut nxt = vec![[0usize; 26]; n + 3];

    len[0] = -1;
    link[0] = 0;
    len[1] = 0;
    link[1] = 0;
    let mut sz = 2usize;
    let mut last = 1usize;

    for i in 0..n {
        let c = (s[i] - b'a') as usize;
        let cur = get_link(last, i, s, &len, &link);
        if nxt[cur][c] == 0 {
            let now = sz;
            sz += 1;
            len[now] = len[cur] + 2;
            link[now] = if cur == 0 {
                1
            } else {
                let lk = get_link(link[cur], i, s, &len, &link);
                nxt[lk][c]
            };
            nxt[cur][c] = now;
        }
        last = nxt[cur][c];
        occ[last] += 1;
    }

    let mut total_occ = 0i64;
    for i in (2..sz).rev() {
        let lk = link[i];
        occ[lk] += occ[i];
        total_occ += occ[i];
    }
    println!("{} {}", sz - 2, total_occ);
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
            while (c > ' ') { sb.append((char) c); c = readByte(); }
            return sb.toString();
        }
    }

    static int getLink(int v, int pos, String s, int[] len, int[] link) {
        while (pos - len[v] - 1 < 0 || s.charAt(pos - len[v] - 1) != s.charAt(pos)) {
            v = link[v];
        }
        return v;
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        String s = fs.next();
        if (s == null) return;
        int n = s.length();

        int[] len = new int[n + 3], link = new int[n + 3];
        long[] occ = new long[n + 3];
        int[][] nxt = new int[n + 3][26];
        len[0] = -1; link[0] = 0;
        len[1] = 0;  link[1] = 0;
        int sz = 2, last = 1;

        for (int i = 0; i < n; i++) {
            int c = s.charAt(i) - 'a';
            int cur = getLink(last, i, s, len, link);
            if (nxt[cur][c] == 0) {
                int now = sz++;
                len[now] = len[cur] + 2;
                link[now] = (cur == 0) ? 1 : nxt[getLink(link[cur], i, s, len, link)][c];
                nxt[cur][c] = now;
            }
            last = nxt[cur][c];
            occ[last]++;
        }

        long totalOcc = 0;
        for (int i = sz - 1; i >= 2; i--) {
            occ[link[i]] += occ[i];
            totalOcc += occ[i];
        }
        System.out.println((sz - 2) + " " + totalOcc);
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

    length = [0] * (n + 3)
    link = [0] * (n + 3)
    occ = [0] * (n + 3)
    nxt = [[0] * 26 for _ in range(n + 3)]
    length[0] = -1
    link[0] = 0
    length[1] = 0
    link[1] = 0
    sz = 2
    last = 1

    def get_link(v: int, pos: int) -> int:
        while pos - length[v] - 1 < 0 or s[pos - length[v] - 1] != s[pos]:
            v = link[v]
        return v

    for i, ch in enumerate(s):
        c = ord(ch) - 97
        cur = get_link(last, i)
        if nxt[cur][c] == 0:
            now = sz
            sz += 1
            length[now] = length[cur] + 2
            link[now] = 1 if cur == 0 else nxt[get_link(link[cur], i)][c]
            nxt[cur][c] = now
        last = nxt[cur][c]
        occ[last] += 1

    total_occ = 0
    for i in range(sz - 1, 1, -1):
        occ[link[i]] += occ[i]
        total_occ += occ[i]
    sys.stdout.write(f"{sz - 2} {total_occ}\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `s = $stdin.read.split.first
exit unless s
n = s.length

length = Array.new(n + 3, 0)
link = Array.new(n + 3, 0)
occ = Array.new(n + 3, 0)
nxt = Array.new(n + 3) { Array.new(26, 0) }
length[0] = -1; link[0] = 0
length[1] = 0;  link[1] = 0
sz = 2
last = 1

get_link = lambda do |v, pos|
  while pos - length[v] - 1 < 0 || s.getbyte(pos - length[v] - 1) != s.getbyte(pos)
    v = link[v]
  end
  v
end

n.times do |i|
  c = s.getbyte(i) - 97
  cur = get_link.call(last, i)
  if nxt[cur][c] == 0
    now = sz
    sz += 1
    length[now] = length[cur] + 2
    link[now] = cur == 0 ? 1 : nxt[get_link.call(link[cur], i)][c]
    nxt[cur][c] = now
  end
  last = nxt[cur][c]
  occ[last] += 1
end

total_occ = 0
(sz - 1).downto(2) do |i|
  occ[link[i]] += occ[i]
  total_occ += occ[i]
end
puts "#{sz - 2} #{total_occ}"`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'CSES',
      title: 'Distinct Substrings / Substring Distribution',
      difficulty: 'Platinum (2200)',
      url: 'https://cses.fi/problemset/task/2105',
      patternNote: 'Direct SAM distinct-substring and per-length interval diff-array counting in O(N).',
    },
    {
      platform: 'Codeforces',
      title: 'Substrings in a String / Cyclical Quest (235C)',
      difficulty: '2400',
      url: 'https://codeforces.com/problemset/problem/235/C',
      patternNote: 'Slide window around doubled query `T + T` while rewinding SAM suffix links (`len[link[v]]`).',
    },
    {
      platform: 'AtCoder',
      title: 'ABC280 F / Library Checker: Number of Substrings',
      difficulty: '2100',
      url: 'https://judge.yosupo.jp/problem/number_of_substrings',
      patternNote: 'Standard 5*10^5 benchmark verifying linear-memory SAM construction without MLE.',
    },
    {
      platform: 'CodeChef',
      title: 'Palindrome Tree / APIO14 Palindromes',
      difficulty: '2350',
      url: 'https://www.codechef.com/problems/LPS',
      patternNote: 'Maximize `len[v] * occ[v]` over all nodes in an Eertree after reverse-topological propagation.',
    },
    {
      platform: 'HackerRank',
      title: 'String Function Calculation',
      difficulty: 'Advanced',
      url: 'https://www.hackerrank.com/challenges/string-function-calculation',
      patternNote: 'Classic SAM max(len[v] * occ[v]) solved cleanly via counting sort + suffix-link accumulation.',
    },
    {
      platform: 'NeetCode 150',
      title: 'Palindromic Substrings (O(N^2) -> O(N) Eertree)',
      difficulty: 'Medium / Boss',
      url: 'https://neetcode.io/practice',
      patternNote: 'Upgrade quadratic center-expansion to O(N) Eertree occurrence aggregation.',
    },
  ],
  interviewNotes: [
    'Contrast Suffix Array vs Suffix Automaton: Suffix Array excels at lexicographical suffix ordering and RMQ LCP queries across multiple strings, while SAM excels at online streaming insertion, distinct substring DP, and `endpos` occurrence counting.',
    'Every node in an Eertree adds AT MOST ONE new distinct palindrome per appended character (prove why: any shorter palindrome ending at `i` already appeared inside its longest palindrome’s mirror image!), bounding the total nodes strictly by `|S| + 2`.',
    'Never recurse down SAM suffix links when `N > 10^5`; bucket-sorting nodes by `len[v]` in `O(N)` is trivial, iterative, and cache-friendly.',
  ],
  projectBlueprint: {
    title: 'Streaming Genome Motif & Palindromic Repeats Indexer',
    tagline:
      'Linear-memory DNA indexing engine using a 4-letter Suffix Automaton and an Eertree to detect distinct motifs, longest common viral fragments, and restriction-site palindromes in O(N).',
    stackSummary: 'TypeScript / Node.js with Flat Int32Array SAM & Eertree Kernel',
    asciiDiagram: `[DNA Stream "AGCT..."] ---> [SAM Builder (Sigma=4)] ---> [endpos Counting Sort] -> Motif Frequency
                      \\--> [Eertree Builder] ----------> [Palindromic Hairpins] -> Occ * Len Rank`,
    milestones: [
      {
        id: 'm1',
        title: 'Compact 4-Base SAM Arena',
        detail: 'Construct SAM states in flat Int32Array buffers using A/C/G/T alphabet mapping.',
      },
      {
        id: 'm2',
        title: 'Iterative Endpos Ranker',
        detail: 'Compute exact motif frequencies across all states via bucket-sorted reverse suffix links.',
      },
      {
        id: 'm3',
        title: 'Eertree Palindrome Detector',
        detail: 'Extract every distinct DNA palindrome and its occurrence count in one linear pass.',
      },
    ],
    starterCode: `export class GenomeMotifIndexer {
  private len: Int32Array;
  private link: Int32Array;
  private occ: Int32Array;
  private next: Int32Array;
  private sz = 1;
  private last = 0;

  constructor(private readonly maxLen: number) {
    const cap = 2 * maxLen + 2;
    this.len = new Int32Array(cap);
    this.link = new Int32Array(cap).fill(-1);
    this.occ = new Int32Array(cap);
    this.next = new Int32Array(cap * 4).fill(-1);
  }

  private code(ch: string): number {
    if (ch === 'A') return 0;
    if (ch === 'C') return 1;
    if (ch === 'G') return 2;
    return 3;
  }

  public indexSequence(seq: string): void {
    for (let i = 0; i < seq.length; i++) {
      const c = this.code(seq[i]);
      const cur = this.sz++;
      this.len[cur] = this.len[this.last] + 1;
      this.occ[cur] = 1;
      let p = this.last;
      while (p !== -1 && this.next[p * 4 + c] === -1) {
        this.next[p * 4 + c] = cur;
        p = this.link[p];
      }
      if (p === -1) {
        this.link[cur] = 0;
      } else {
        const q = this.next[p * 4 + c];
        if (this.len[p] + 1 === this.len[q]) {
          this.link[cur] = q;
        } else {
          const clone = this.sz++;
          this.len[clone] = this.len[p] + 1;
          this.link[clone] = this.link[q];
          for (let k = 0; k < 4; k++) this.next[clone * 4 + k] = this.next[q * 4 + k];
          while (p !== -1 && this.next[p * 4 + c] === q) {
            this.next[p * 4 + c] = clone;
            p = this.link[p];
          }
          this.link[q] = clone;
          this.link[cur] = clone;
        }
      }
      this.last = cur;
    }

    const cnt = new Int32Array(seq.length + 1);
    for (let i = 0; i < this.sz; i++) cnt[this.len[i]]++;
    for (let i = 1; i <= seq.length; i++) cnt[i] += cnt[i - 1];
    const order = new Int32Array(this.sz);
    for (let i = this.sz - 1; i >= 0; i--) order[--cnt[this.len[i]]] = i;
    for (let i = this.sz - 1; i >= 1; i--) {
      const v = order[i];
      if (this.link[v] > 0) this.occ[this.link[v]] += this.occ[v];
    }
  }

  public queryMotif(motif: string): number {
    let u = 0;
    for (let i = 0; i < motif.length; i++) {
      u = this.next[u * 4 + this.code(motif[i])];
      if (u === -1) return 0;
    }
    return this.occ[u];
  }
}

const idx = new GenomeMotifIndexer(64);
idx.indexSequence('ACGACGTTTACG');
console.log('Occurrences of ACG:', idx.queryMotif('ACG'));`,
  },
};
