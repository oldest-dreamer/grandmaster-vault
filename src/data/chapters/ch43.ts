import type { TheoryChapter } from '../../types/vault';

export const CH43_TRIE_AHO_CORASICK: TheoryChapter = {
  slug: 'trie-aho-corasick-automaton',
  topicId: 'sg-63',
  title: 'Binary/Prefix Trie & Aho-Corasick Automaton',
  domain: 'Strings & Geometry',
  ratingTier: '1900–2200',
  usacoDivision: 'Platinum',
  subtitle:
    'Maximize bitwise XOR pairs/subarrays in O(log V) with a 30-bit Binary Trie, and match thousands of dictionary patterns simultaneously in O(|T| + sum|P_i|) using Aho-Corasick BFS failure links, fail-tree accumulation, and DFA DP.',
  analogyTitle: 'The Multi-Track Railway Switchboard & Bitwise Greedy Compass Analogy',
  analogyBody:
    'A **30-Bit Binary Trie** is a bitwise compass: when querying the maximum `x ^ y` inside a dynamic set, walk from bit `29` down to `0`—at each bit `b` of `x`, always try to turn toward the **opposite bit** `1 - b` (`cnt > 0`), flipping on `2^b` in your answer greedily from MSB to LSB! Meanwhile, **Aho-Corasick** upgrades KMP from 1 pattern to `K` patterns at once. Think of a Trie as railway tracks fanning out from root `0`. When a character in text `T` causes a derailment (missing edge in the Trie), **failure links `fail[u]`** built by BFS act like automated track switches that shunt you onto the **longest proper suffix** of the current prefix that STILL exists in the Trie! Completing all missing edges into a deterministic automaton `go[u][c]` lets you scan gigabytes of text—or run DP/Matrix Exponentiation avoiding forbidden substrings—in strict `O(1)` per character!',
  prerequisites: [
    {
      slug: 'kmp-z-function-manacher',
      title: 'KMP Prefix Function, Z-Algorithm & Manacher',
    },
  ],
  traceTitle: 'Interactive Bitwise Trie Max-XOR & Aho-Corasick BFS Failure-Link Trace',
  traceSubtitle:
    'Trace 4-bit Binary Trie greedy XOR maximization (`query(10 = 1010_2)` against `{3, 5, 13}`), then construct BFS failure links over dictionary `{"he", "she", "his", "hers"}`.',
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Step 1: 4-Bit Binary Trie Insertions for {3 (0011), 5 (0101), 13 (1101)}',
      explanation:
        'Each node stores two child pointers (bit 0 / bit 1) and a subtree reference count `cnt` supporting O(log V) insertions and deletions.',
      mode: 'array',
      arrays: [
        {
          name: 'Stored 4-Bit Dictionary Values',
          cells: [
            { index: 0, value: '0011', label: 'val=3', highlight: 'window' },
            { index: 1, value: '0101', label: 'val=5', highlight: 'window' },
            { index: 2, value: '1101', label: 'val=13', highlight: 'window' },
            { index: 3, value: '1010', label: 'Query x=10', highlight: 'active' },
          ],
        },
      ],
      variables: { Bits: 4, QueryX: '10 (1010_2)' },
    },
    {
      stepNumber: 2,
      title: 'Step 2: Greedy Opposite-Bit Descent for Query x = 10 (1010_2) -> Picks 5 (0101_2)',
      explanation:
        'Bit 3 of 10 is 1 -> want bit 0 (exists! 3 and 5). Bit 2 of 10 is 0 -> want bit 1 (exists! only 5). Bit 1 is 1 -> want 0 (5 has 0). Bit 0 is 0 -> want 1 (5 has 1). Result: 10 ^ 5 = 15 (1111_2) in 4 steps!',
      mode: 'array',
      arrays: [
        {
          name: 'Bitwise Greedy Choice Path (x = 1010 -> y = 0101)',
          cells: [
            { index: 3, value: 'x=1 -> y=0', label: 'Bit 3 (+8)', highlight: 'active' },
            { index: 2, value: 'x=0 -> y=1', label: 'Bit 2 (+4)', highlight: 'active' },
            { index: 1, value: 'x=1 -> y=0', label: 'Bit 1 (+2)', highlight: 'active' },
            { index: 0, value: 'x=0 -> y=1', label: 'Bit 0 (+1)', highlight: 'active' },
          ],
        },
      ],
      variables: { BestPartner: 5, MaxXOR: 15, Complexity: 'O(log V)' },
    },
    {
      stepNumber: 3,
      title: 'Step 3: Aho-Corasick Trie Construction Over {"he", "she", "his", "hers"}',
      explanation:
        'Insert all 4 patterns from Root 0. Node prefixes: 1("h"), 2("he"*), 3("her"), 4("hers"*), 5("hi"), 6("his"*), 7("s"), 8("sh"), 9("she"*). Marked * nodes are terminal.',
      mode: 'graph',
      graph: {
        calloutMetric: 'Trie Built (Nodes 0..9) Before BFS Failure Links',
        nodes: [
          { id: '0', label: '0 (root)', x: 60, y: 120, state: 'active' },
          { id: '1', label: '1 (h)', x: 165, y: 65, state: 'even' },
          { id: '2', label: '2 (he*)', x: 275, y: 40, state: 'matched' },
          { id: '4', label: '4 (hers*)', x: 430, y: 40, state: 'matched' },
          { id: '6', label: '6 (his*)', x: 375, y: 100, state: 'matched' },
          { id: '7', label: '7 (s)', x: 165, y: 190, state: 'even' },
          { id: '8', label: '8 (sh)', x: 275, y: 190, state: 'even' },
          { id: '9', label: '9 (she*)', x: 390, y: 190, state: 'matched' },
        ],
        edges: [
          { id: 'e01', from: '0', to: '1', state: 'default' },
          { id: 'e12', from: '1', to: '2', state: 'default' },
          { id: 'e24', from: '2', to: '4', state: 'default' },
          { id: 'e16', from: '1', to: '6', state: 'default' },
          { id: 'e07', from: '0', to: '7', state: 'default' },
          { id: 'e78', from: '7', to: '8', state: 'default' },
          { id: 'e89', from: '8', to: '9', state: 'default' },
        ],
      },
      variables: { AutomatonStates: 10, Patterns: 4 },
    },
    {
      stepNumber: 4,
      title: 'Step 4: BFS Automaton Completion — fail["sh"] = "h", fail["she"] = "he"!',
      explanation:
        'In BFS level order: depth-1 nodes fail to 0. Node 8("sh") looks at fail[7]="0", sees edge \'h\' -> 1("h"), so fail[8]=1! Node 9("she") looks at fail[8]=1("h"), sees edge \'e\' -> 2("he"), so fail[9]=2! Scanning "she" hits BOTH "she" AND "he" via fail-tree!',
      mode: 'graph',
      graph: {
        calloutMetric: 'Dashed Amber Edges = BFS Failure Links (fail[8]=1, fail[9]=2)',
        nodes: [
          { id: '0', label: '0 (root)', x: 60, y: 120, state: 'active' },
          { id: '1', label: '1 (h)', x: 165, y: 65, state: 'even' },
          { id: '2', label: '2 (he*)', x: 275, y: 40, state: 'matched' },
          { id: '4', label: '4 (hers*)', x: 430, y: 40, state: 'matched' },
          { id: '6', label: '6 (his*)', x: 375, y: 100, state: 'matched' },
          { id: '7', label: '7 (s)', x: 165, y: 190, state: 'even' },
          { id: '8', label: '8 (sh)', x: 275, y: 190, state: 'active' },
          { id: '9', label: '9 (she*)', x: 390, y: 190, state: 'active' },
        ],
        edges: [
          { id: 'e01', from: '0', to: '1', state: 'default' },
          { id: 'e12', from: '1', to: '2', state: 'default' },
          { id: 'e24', from: '2', to: '4', state: 'default' },
          { id: 'e16', from: '1', to: '6', state: 'default' },
          { id: 'e07', from: '0', to: '7', state: 'default' },
          { id: 'e78', from: '7', to: '8', state: 'default' },
          { id: 'e89', from: '8', to: '9', state: 'default' },
          { id: 'f81', from: '8', to: '1', state: 'augmenting' },
          { id: 'f92', from: '9', to: '2', state: 'augmenting' },
        ],
      },
      variables: { FailOfSH: '1 ("h")', FailOfSHE: '2 ("he")', ScanTime: 'O(|T|)' },
    },
  ],
  reductionClues: [
    {
      clue: '"Dynamic set of integers supporting insert, delete, and max (x ^ y) or count (x ^ y < K)"',
      translation:
        '**30-bit / 60-bit Binary Trie**! Store `cnt[node]` at each node. For `max(x ^ y)`, descend MSB-to-LSB choosing `bit ^ 1` whenever `cnt[child[bit ^ 1]] > 0`. For `count < K`, branch whenever `K` has bit `b == 1`!',
    },
    {
      clue: '"Find which of K patterns P[1..K] appear in text T, or count total occurrences of each P[i] in T"',
      translation:
        '**Aho-Corasick Automaton**! Stream text `T` through `u = go[u][c]`, incrementing `hits[u]++` once per character (`O(|T|)`). NEVER walk `fail` pointers inside the text loop (`O(N^2)`!); instead accumulate `hits[fail[u]] += hits[u]` in **reverse BFS order** after scanning `T`!',
    },
    {
      clue: '"Count strings of length N (N <= 10^18 or 10^4) containing NONE of K forbidden patterns"',
      translation:
        '**Aho-Corasick + DP / Matrix Exponentiation**! Build the complete DFA (`go[u][c]`), mark `bad[u] |= bad[fail[u]]` during BFS, and only allow transitions `u -> v = go[u][c]` where `!bad[v]`! For small `N`, run `dp[step][v]`; for `N <= 10^18`, raise the transition matrix to power `N`!',
    },
    {
      clue: '"Maximum XOR subarray of an array A[1..N]"',
      translation:
        'Compute prefix XORs `P[0] = 0, P[i] = P[i - 1] ^ A[i]`. Insert `P[0]` into a 30-bit Binary Trie, then for `i = 1..N`, query `maxXor(P[i])` and insert `P[i]`!',
    },
  ],
  timeComplexity: 'Binary Trie: O(log V) per op | Aho-Corasick Build + Scan: O(sum |P_i| * Sigma + |T|)',
  spaceComplexity: 'Binary Trie: O(N log V) | Aho-Corasick DFA: O(sum |P_i| * Sigma)',
  pitfalls: [
    {
      type: 'TLE',
      title: 'Walking Up the Fail Chain Inside the Text-Scanning Loop (O(|T| * sqrt(L)) TLE!)',
      detail:
        'If patterns are `"a"`, `"aa"`, `"aaa"`, ..., walking `for (v = u; v; v = fail[v]) cnt[v]++` at every character of `"aaaa..."` degrades to `O(|T| * K)`! Instead ONLY do `hits[u]++` during the text scan, and push `hits[fail[u]] += hits[u]` **once per node** in reverse BFS order!',
    },
    {
      type: 'WA',
      title: 'Forgetting bad[u] |= bad[fail[u]] When Marking Forbidden Automaton States',
      detail:
        'If `"ab"` is forbidden and `"cab"` ends at a Trie leaf, state `"cab"` might not have been marked `bad` directly unless you propagate `bad[u] |= bad[fail[u]]` during BFS construction!',
    },
    {
      type: 'MLE',
      title: 'Allocating Sigma = 26 Pointers With HashMaps or Dynamic Objects in Java / Python / Ruby',
      detail:
        'On `sum |P_i| = 5 * 10^5`, creating `5 * 10^5` `HashMap` nodes blows memory limits! Use flat integer transition arrays `go[node * 26 + c]` (or `int[MAX][26]`)—just 104 bytes/node in C++ and ultra-fast cache locality.',
    },
    {
      type: 'WA',
      title: 'Binary Trie Missing the Initial Zero Prefix P[0] = 0 for Subarray Max-XOR',
      detail:
        'Any subarray `A[1..i]` equals `P[i] ^ P[0]`. If you forget to insert `0` into the Binary Trie before looping `i = 1..N`, prefix subarrays starting at index `1` are never considered!',
    },
  ],
  implementations: {
    cpp20: `#include <bits/stdc++.h>
using namespace std;

// Complete Aho-Corasick Automaton: Count Occurrences of K Patterns in Text T in O(|T| + sum|P_i|)
struct AhoCorasick {
    static constexpr int ALPHA = 26;
    vector<array<int, ALPHA>> go;
    vector<int> fail, bfsOrder, endNode, hits;

    AhoCorasick() {
        go.push_back(array<int, ALPHA>{});
        fail.push_back(0);
        hits.push_back(0);
    }

    int addPattern(const string& p) {
        int u = 0;
        for (char ch : p) {
            int c = ch - 'a';
            if (!go[u][c]) {
                go[u][c] = (int)go.size();
                go.push_back(array<int, ALPHA>{});
                fail.push_back(0);
                hits.push_back(0);
            }
            u = go[u][c];
        }
        endNode.push_back(u);
        return u;
    }

    void build() {
        queue<int> q;
        for (int c = 0; c < ALPHA; c++) {
            if (go[0][c]) {
                q.push(go[0][c]);
                bfsOrder.push_back(go[0][c]);
            }
        }
        while (!q.empty()) {
            int u = q.front();
            q.pop();
            for (int c = 0; c < ALPHA; c++) {
                int v = go[u][c];
                if (v) {
                    fail[v] = go[fail[u]][c];
                    q.push(v);
                    bfsOrder.push_back(v);
                } else {
                    go[u][c] = go[fail[u]][c];
                }
            }
        }
    }

    vector<long long> countAll(const string& text) {
        int u = 0;
        for (char ch : text) {
            u = go[u][ch - 'a'];
            hits[u]++;
        }
        vector<long long> totalHits(go.size());
        for (size_t i = 0; i < go.size(); i++) totalHits[i] = hits[i];
        // Propagate counts up the fail-tree in reverse BFS order
        for (int i = (int)bfsOrder.size() - 1; i >= 0; i--) {
            int node = bfsOrder[i];
            totalHits[fail[node]] += totalHits[node];
        }
        vector<long long> ans(endNode.size());
        for (size_t i = 0; i < endNode.size(); i++) ans[i] = totalHits[endNode[i]];
        return ans;
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    string text;
    int k;
    if (!(cin >> text >> k)) return 0;
    AhoCorasick ac;
    for (int i = 0; i < k; i++) {
        string p;
        cin >> p;
        ac.addPattern(p);
    }
    ac.build();
    vector<long long> ans = ac.countAll(text);
    for (long long x : ans) cout << x << "\\n";
    return 0;
}`,
    rust: `use std::collections::VecDeque;
use std::io::{self, Read};

struct AhoCorasick {
    go: Vec<[usize; 26]>,
    fail: Vec<usize>,
    bfs_order: Vec<usize>,
    end_node: Vec<usize>,
}

impl AhoCorasick {
    fn new(max_nodes: usize) -> Self {
        let mut go = Vec::with_capacity(max_nodes);
        go.push([0usize; 26]);
        let mut fail = Vec::with_capacity(max_nodes);
        fail.push(0);
        Self {
            go,
            fail,
            bfs_order: Vec::with_capacity(max_nodes),
            end_node: Vec::new(),
        }
    }

    fn add_pattern(&mut self, p: &[u8]) {
        let mut u = 0usize;
        for &b in p {
            let c = (b - b'a') as usize;
            if self.go[u][c] == 0 {
                let nxt = self.go.len();
                self.go[u][c] = nxt;
                self.go.push([0usize; 26]);
                self.fail.push(0);
            }
            u = self.go[u][c];
        }
        self.end_node.push(u);
    }

    fn build(&mut self) {
        let mut q = VecDeque::new();
        for c in 0..26 {
            let v = self.go[0][c];
            if v != 0 {
                q.push_back(v);
                self.bfs_order.push(v);
            }
        }
        while let Some(u) = q.pop_front() {
            let fu = self.fail[u];
            for c in 0..26 {
                let v = self.go[u][c];
                if v != 0 {
                    self.fail[v] = self.go[fu][c];
                    q.push_back(v);
                    self.bfs_order.push(v);
                } else {
                    self.go[u][c] = self.go[fu][c];
                }
            }
        }
    }

    fn count_all(&self, text: &[u8]) -> Vec<i64> {
        let mut hits = vec![0i64; self.go.len()];
        let mut u = 0usize;
        for &b in text {
            u = self.go[u][(b - b'a') as usize];
            hits[u] += 1;
        }
        for &node in self.bfs_order.iter().rev() {
            let f = self.fail[node];
            hits[f] += hits[node];
        }
        self.end_node.iter().map(|&node| hits[node]).collect()
    }
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let text = match it.next() {
        Some(v) => v.as_bytes(),
        None => return,
    };
    let k: usize = it.next().unwrap().parse().unwrap();
    let patterns: Vec<&str> = (0..k).map(|_| it.next().unwrap()).collect();
    let total_len: usize = patterns.iter().map(|p| p.len()).sum();

    let mut ac = AhoCorasick::new(total_len + 2);
    for p in patterns {
        ac.add_pattern(p.as_bytes());
    }
    ac.build();

    let mut out = String::new();
    for cnt in ac.count_all(text) {
        out.push_str(&format!("{}\\n", cnt));
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
        String nextWord() throws IOException {
            int c = readByte();
            while (c >= 0 && c <= ' ') c = readByte();
            if (c == -1) return null;
            StringBuilder sb = new StringBuilder();
            while (c > ' ') { sb.append((char) c); c = readByte(); }
            return sb.toString();
        }
        int nextInt() throws IOException {
            String w = nextWord();
            return w == null ? Integer.MIN_VALUE : Integer.parseInt(w);
        }
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        String text = fs.nextWord();
        if (text == null) return;
        int k = fs.nextInt();

        String[] patterns = new String[k];
        int totalLen = 1;
        for (int i = 0; i < k; i++) {
            patterns[i] = fs.nextWord();
            totalLen += patterns[i].length();
        }

        int[][] go = new int[totalLen + 2][26];
        int[] fail = new int[totalLen + 2];
        int[] endNode = new int[k];
        int states = 1;

        for (int i = 0; i < k; i++) {
            String p = patterns[i];
            int u = 0;
            for (int j = 0; j < p.length(); j++) {
                int c = p.charAt(j) - 'a';
                if (go[u][c] == 0) go[u][c] = states++;
                u = go[u][c];
            }
            endNode[i] = u;
        }

        int[] bfsOrder = new int[states];
        int qh = 0, qt = 0;
        for (int c = 0; c < 26; c++) {
            if (go[0][c] != 0) bfsOrder[qt++] = go[0][c];
        }
        while (qh < qt) {
            int u = bfsOrder[qh++];
            int fu = fail[u];
            for (int c = 0; c < 26; c++) {
                int v = go[u][c];
                if (v != 0) {
                    fail[v] = go[fu][c];
                    bfsOrder[qt++] = v;
                } else {
                    go[u][c] = go[fu][c];
                }
            }
        }

        long[] hits = new long[states];
        int u = 0;
        for (int i = 0; i < text.length(); i++) {
            u = go[u][text.charAt(i) - 'a'];
            hits[u]++;
        }
        for (int i = qt - 1; i >= 0; i--) {
            int node = bfsOrder[i];
            hits[fail[node]] += hits[node];
        }

        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < k; i++) sb.append(hits[endNode[i]]).append('\\n');
        System.out.print(sb);
    }
}`,
    python3: `import sys
from collections import deque

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    text = next(it)
    k = int(next(it))
    patterns = [next(it) for _ in range(k)]

    go = [[0] * 26]
    fail = [0]
    end_node = [0] * k

    for i, p in enumerate(patterns):
        u = 0
        for ch in p:
            c = ord(ch) - 97
            nxt = go[u][c]
            if nxt == 0:
                nxt = len(go)
                go[u][c] = nxt
                go.append([0] * 26)
                fail.append(0)
            u = nxt
        end_node[i] = u

    bfs_order = []
    q = deque()
    for c in range(26):
        v = go[0][c]
        if v:
            q.append(v)
            bfs_order.append(v)

    while q:
        u = q.popleft()
        fu = fail[u]
        go_u = go[u]
        go_fu = go[fu]
        for c in range(26):
            v = go_u[c]
            if v:
                fail[v] = go_fu[c]
                q.append(v)
                bfs_order.append(v)
            else:
                go_u[c] = go_fu[c]

    hits = [0] * len(go)
    u = 0
    for ch in text:
        u = go[u][ord(ch) - 97]
        hits[u] += 1

    for node in reversed(bfs_order):
        hits[fail[node]] += hits[node]

    sys.stdout.write("\\n".join(str(hits[end_node[i]]) for i in range(k)) + "\\n")

if __name__ == "__main__":
    solve()`,
    ruby: `tokens = $stdin.read.split
exit if tokens.empty?
idx = 0
text = tokens[idx]; idx += 1
k = tokens[idx].to_i; idx += 1
patterns = Array.new(k) { tokens[idx].tap { idx += 1 } }

go = [Array.new(26, 0)]
fail = [0]
end_node = Array.new(k, 0)

patterns.each_with_index do |p, i|
  u = 0
  p.each_byte do |b|
    c = b - 97
    if go[u][c] == 0
      go[u][c] = go.length
      go << Array.new(26, 0)
      fail << 0
    end
    u = go[u][c]
  end
  end_node[i] = u
end

bfs_order = []
26.times do |c|
  v = go[0][c]
  bfs_order << v if v != 0
end

qh = 0
while qh < bfs_order.length
  u = bfs_order[qh]; qh += 1
  fu = fail[u]
  26.times do |c|
    v = go[u][c]
    if v != 0
      fail[v] = go[fu][c]
      bfs_order << v
    else
      go[u][c] = go[fu][c]
    end
  end
end

hits = Array.new(go.length, 0)
u = 0
text.each_byte do |b|
  u = go[u][b - 97]
  hits[u] += 1
end

bfs_order.reverse_each do |node|
  hits[fail[node]] += hits[node]
end

puts end_node.map { |node| hits[node].to_s }.join("\\n")`,
  },
  practiceProblems: [
    {
      id: 'ch43-p1',
      tier: 'Warmup',
      ratingRange: '1650–1850',
      title: 'Maximum XOR Subarray & Dynamic Set Queries (30-Bit Binary Trie)',
      statement:
        'Given an array `A` of `N` non-negative integers (`0 <= A[i] < 2^30`), find the **maximum bitwise XOR** of any non-empty contiguous subarray `A[L..R]`. Support `O(N log V)` insertion and greedy MSB-to-LSB opposite-bit traversal using a flat-arena 30-bit Binary Trie with node counts `cnt[]`.',
      constraints: '1 <= N <= 2 * 10^5, 0 <= A[i] < 2^30',
      sampleInput: '4\n5 1 5 9',
      sampleOutput: '13',
      hints: [
        'Every subarray XOR `A[L] ^ ... ^ A[R]` equals `pref[R] ^ pref[L - 1]`. Don’t forget to insert `pref[0] = 0` first!',
        'For each `pref[i]`, walk bits `b = 29` down to `0`, trying `want = ((pref[i] >> b) & 1) ^ 1`: if that child exists (`cnt > 0`), add `(1 << b)` to `best` and step there; otherwise step to `want ^ 1`.',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    if (!(cin >> n)) return 0;

    // Flat arena for up to (N + 1) * 30 nodes
    vector<array<int, 2>> ch(1, {0, 0});
    ch.reserve((n + 1) * 30 + 5);
    vector<int> cnt(1, 0);
    cnt.reserve((n + 1) * 30 + 5);

    auto insertVal = [&](int x) {
        int u = 0;
        cnt[u]++;
        for (int b = 29; b >= 0; b--) {
            int bit = (x >> b) & 1;
            if (!ch[u][bit]) {
                ch[u][bit] = (int)ch.size();
                ch.push_back({0, 0});
                cnt.push_back(0);
            }
            u = ch[u][bit];
            cnt[u]++;
        }
    };

    auto queryMaxXor = [&](int x) {
        int u = 0, ans = 0;
        for (int b = 29; b >= 0; b--) {
            int bit = (x >> b) & 1;
            int want = bit ^ 1;
            if (ch[u][want] && cnt[ch[u][want]] > 0) {
                ans |= (1 << b);
                u = ch[u][want];
            } else {
                u = ch[u][bit];
            }
        }
        return ans;
    };

    insertVal(0);
    int pref = 0, best = 0;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        pref ^= x;
        best = max(best, queryMaxXor(pref));
        insertVal(pref);
    }
    cout << best << "\\n";
    return 0;
}`,
        rust: `use std::io::{self, Read};

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let n: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };

    let mut ch = Vec::with_capacity((n + 1) * 30 + 5);
    ch.push([0usize; 2]);
    let mut cnt = Vec::with_capacity((n + 1) * 30 + 5);
    cnt.push(0i32);

    let insert = |x: u32, ch: &mut Vec<[usize; 2]>, cnt: &mut Vec<i32>| {
        let mut u = 0usize;
        cnt[u] += 1;
        for b in (0..30).rev() {
            let bit = ((x >> b) & 1) as usize;
            if ch[u][bit] == 0 {
                ch[u][bit] = ch.len();
                ch.push([0, 0]);
                cnt.push(0);
            }
            u = ch[u][bit];
            cnt[u] += 1;
        }
    };

    insert(0, &mut ch, &mut cnt);
    let mut pref = 0u32;
    let mut best = 0u32;
    for _ in 0..n {
        let x: u32 = it.next().unwrap().parse().unwrap();
        pref ^= x;
        let mut u = 0usize;
        let mut cand = 0u32;
        for b in (0..30).rev() {
            let bit = ((pref >> b) & 1) as usize;
            let want = bit ^ 1;
            if ch[u][want] != 0 && cnt[ch[u][want]] > 0 {
                cand |= 1 << b;
                u = ch[u][want];
            } else {
                u = ch[u][bit];
            }
        }
        best = best.max(cand);
        insert(pref, &mut ch, &mut cnt);
    }
    println!("{}", best);
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
        int nextInt() throws IOException {
            int c = readByte();
            while (c >= 0 && c <= ' ') c = readByte();
            if (c == -1) return Integer.MIN_VALUE;
            int res = 0;
            while (c > ' ') { res = res * 10 + (c - '0'); c = readByte(); }
            return res;
        }
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        int n = fs.nextInt();
        if (n == Integer.MIN_VALUE) return;

        int maxNodes = (n + 1) * 30 + 5;
        int[] left = new int[maxNodes], right = new int[maxNodes], cnt = new int[maxNodes];
        int ptr = 1;

        // Insert prefix 0
        int u0 = 0;
        cnt[0] = 1;
        for (int b = 29; b >= 0; b--) {
            left[u0] = ptr++;
            u0 = left[u0];
            cnt[u0] = 1;
        }

        int pref = 0, best = 0;
        for (int i = 0; i < n; i++) {
            pref ^= fs.nextInt();
            int u = 0, cand = 0;
            for (int b = 29; b >= 0; b--) {
                int bit = (pref >> b) & 1;
                int want = bit ^ 1;
                int child = (want == 0) ? left[u] : right[u];
                if (child != 0 && cnt[child] > 0) {
                    cand |= (1 << b);
                    u = child;
                } else {
                    u = (bit == 0) ? left[u] : right[u];
                }
            }
            if (cand > best) best = cand;

            int ins = 0;
            cnt[ins]++;
            for (int b = 29; b >= 0; b--) {
                int bit = (pref >> b) & 1;
                if (bit == 0) {
                    if (left[ins] == 0) left[ins] = ptr++;
                    ins = left[ins];
                } else {
                    if (right[ins] == 0) right[ins] = ptr++;
                    ins = right[ins];
                }
                cnt[ins]++;
            }
        }
        System.out.println(best);
    }
}`,
        python3: `import sys

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    n = int(next(it))

    # Flat lists for left (bit 0) and right (bit 1) children
    c0 = [0]
    c1 = [0]

    def insert(x: int) -> None:
        u = 0
        for b in range(29, -1, -1):
            if (x >> b) & 1:
                nxt = c1[u]
                if nxt == 0:
                    nxt = len(c0)
                    c1[u] = nxt
                    c0.append(0)
                    c1.append(0)
                u = nxt
            else:
                nxt = c0[u]
                if nxt == 0:
                    nxt = len(c0)
                    c0[u] = nxt
                    c0.append(0)
                    c1.append(0)
                u = nxt

    def query_max(x: int) -> int:
        u = 0
        ans = 0
        for b in range(29, -1, -1):
            if (x >> b) & 1:
                if c0[u]:
                    ans |= 1 << b
                    u = c0[u]
                else:
                    u = c1[u]
            else:
                if c1[u]:
                    ans |= 1 << b
                    u = c1[u]
                else:
                    u = c0[u]
        return ans

    insert(0)
    pref = 0
    best = 0
    for _ in range(n):
        pref ^= int(next(it))
        cand = query_max(pref)
        if cand > best:
            best = cand
        insert(pref)
    sys.stdout.write(f"{best}\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
n = tokens[0].to_i

c0 = [0]
c1 = [0]

insert = lambda do |x|
  u = 0
  29.downto(0) do |b|
    if ((x >> b) & 1) == 1
      nxt = c1[u]
      if nxt == 0
        nxt = c0.length
        c1[u] = nxt
        c0 << 0
        c1 << 0
      end
      u = nxt
    else
      nxt = c0[u]
      if nxt == 0
        nxt = c0.length
        c0[u] = nxt
        c0 << 0
        c1 << 0
      end
      u = nxt
    end
  end
end

query_max = lambda do |x|
  u = 0
  ans = 0
  29.downto(0) do |b|
    if ((x >> b) & 1) == 1
      if c0[u] != 0
        ans |= (1 << b)
        u = c0[u]
      else
        u = c1[u]
      end
    else
      if c1[u] != 0
        ans |= (1 << b)
        u = c1[u]
      else
        u = c0[u]
      end
    end
  end
  ans
end

insert.call(0)
pref = 0
best = 0
(1..n).each do |i|
  pref ^= tokens[i].to_i
  cand = query_max.call(pref)
  best = cand if cand > best
  insert.call(pref)
end
puts best`,
      },
    },
    {
      id: 'ch43-p2',
      tier: 'Standard',
      ratingRange: '1900–2100',
      title: 'Finding Patterns & First Occurrence Positions (CSES Multi-Pattern Automaton)',
      statement:
        'Given a text `T` and `K` patterns `P[1..K]`, for EACH pattern `P[i]` report BOTH: (1) how many times `P[i]` appears in `T`, and (2) the 1-indexed starting position where `P[i]` FIRST appears in `T` (or `-1` if it never occurs). Solve both in a single `O(|T| + sum|P_i|)` Aho-Corasick fail-tree propagation!',
      constraints: '1 <= |T| <= 10^5, 1 <= K <= 5 * 10^5, sum |P_i| <= 5 * 10^5',
      sampleInput: 'aybabtu\n3\nbab\nabc\na',
      sampleOutput: '1 3\n0 -1\n2 1',
      hints: [
        'When scanning `T` at 1-indexed end position `pos` arriving at state `u`, record `hits[u]++` AND `firstEnd[u] = min(firstEnd[u], pos)`.',
        'After scanning `T`, walk `bfsOrder` in **reverse**: do `hits[fail[u]] += hits[u]` AND `firstEnd[fail[u]] = min(firstEnd[fail[u]], firstEnd[u])`! Starting index for pattern `i` of length `L` is `firstEnd[endNode[i]] - L + 1`!',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    string text;
    int k;
    if (!(cin >> text >> k)) return 0;

    vector<array<int, 26>> go(1, array<int, 26>{});
    vector<int> fail(1, 0), endNode(k), patLen(k);

    for (int i = 0; i < k; i++) {
        string p;
        cin >> p;
        patLen[i] = (int)p.size();
        int u = 0;
        for (char ch : p) {
            int c = ch - 'a';
            if (!go[u][c]) {
                go[u][c] = (int)go.size();
                go.push_back(array<int, 26>{});
                fail.push_back(0);
            }
            u = go[u][c];
        }
        endNode[i] = u;
    }

    vector<int> bfsOrder;
    bfsOrder.reserve(go.size());
    queue<int> q;
    for (int c = 0; c < 26; c++) {
        if (go[0][c]) { q.push(go[0][c]); bfsOrder.push_back(go[0][c]); }
    }
    while (!q.empty()) {
        int u = q.front();
        q.pop();
        for (int c = 0; c < 26; c++) {
            int v = go[u][c];
            if (v) {
                fail[v] = go[fail[u]][c];
                q.push(v);
                bfsOrder.push_back(v);
            } else {
                go[u][c] = go[fail[u]][c];
            }
        }
    }

    const int INF = 1e9;
    vector<long long> hits(go.size(), 0);
    vector<int> firstEnd(go.size(), INF);
    int u = 0;
    for (int i = 0; i < (int)text.size(); i++) {
        u = go[u][text[i] - 'a'];
        hits[u]++;
        if (firstEnd[u] == INF) firstEnd[u] = i + 1;
    }

    for (int i = (int)bfsOrder.size() - 1; i >= 0; i--) {
        int node = bfsOrder[i], f = fail[node];
        hits[f] += hits[node];
        firstEnd[f] = min(firstEnd[f], firstEnd[node]);
    }

    for (int i = 0; i < k; i++) {
        int en = endNode[i];
        int startPos = (firstEnd[en] == INF) ? -1 : (firstEnd[en] - patLen[i] + 1);
        cout << hits[en] << " " << startPos << "\\n";
    }
    return 0;
}`,
        rust: `use std::collections::VecDeque;
use std::io::{self, Read};

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let text = match it.next() {
        Some(v) => v.as_bytes(),
        None => return,
    };
    let k: usize = it.next().unwrap().parse().unwrap();
    let patterns: Vec<&str> = (0..k).map(|_| it.next().unwrap()).collect();
    let total_len: usize = patterns.iter().map(|p| p.len()).sum();

    let mut go = Vec::with_capacity(total_len + 2);
    go.push([0usize; 26]);
    let mut fail = Vec::with_capacity(total_len + 2);
    fail.push(0usize);
    let mut end_node = vec![0usize; k];
    let mut pat_len = vec![0usize; k];

    for (i, p) in patterns.iter().enumerate() {
        pat_len[i] = p.len();
        let mut u = 0usize;
        for &b in p.as_bytes() {
            let c = (b - b'a') as usize;
            if go[u][c] == 0 {
                go[u][c] = go.len();
                go.push([0usize; 26]);
                fail.push(0);
            }
            u = go[u][c];
        }
        end_node[i] = u;
    }

    let mut bfs_order = Vec::with_capacity(go.len());
    let mut q = VecDeque::new();
    for c in 0..26 {
        let v = go[0][c];
        if v != 0 {
            q.push_back(v);
            bfs_order.push(v);
        }
    }
    while let Some(u) = q.pop_front() {
        let fu = fail[u];
        for c in 0..26 {
            let v = go[u][c];
            if v != 0 {
                fail[v] = go[fu][c];
                q.push_back(v);
                bfs_order.push(v);
            } else {
                go[u][c] = go[fu][c];
            }
        }
    }

    let inf = usize::MAX / 2;
    let mut hits = vec![0i64; go.len()];
    let mut first_end = vec![inf; go.len()];
    let mut u = 0usize;
    for (i, &b) in text.iter().enumerate() {
        u = go[u][(b - b'a') as usize];
        hits[u] += 1;
        if first_end[u] == inf {
            first_end[u] = i + 1;
        }
    }

    for &node in bfs_order.iter().rev() {
        let f = fail[node];
        hits[f] += hits[node];
        first_end[f] = first_end[f].min(first_end[node]);
    }

    let mut out = String::new();
    for i in 0..k {
        let en = end_node[i];
        let start = if first_end[en] == inf {
            -1
        } else {
            (first_end[en] - pat_len[i] + 1) as isize
        };
        out.push_str(&format!("{} {}\\n", hits[en], start));
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
        String nextWord() throws IOException {
            int c = readByte();
            while (c >= 0 && c <= ' ') c = readByte();
            if (c == -1) return null;
            StringBuilder sb = new StringBuilder();
            while (c > ' ') { sb.append((char) c); c = readByte(); }
            return sb.toString();
        }
        int nextInt() throws IOException {
            String w = nextWord();
            return w == null ? Integer.MIN_VALUE : Integer.parseInt(w);
        }
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        String text = fs.nextWord();
        if (text == null) return;
        int k = fs.nextInt();

        String[] patterns = new String[k];
        int totalLen = 1;
        for (int i = 0; i < k; i++) {
            patterns[i] = fs.nextWord();
            totalLen += patterns[i].length();
        }

        int[][] go = new int[totalLen + 2][26];
        int[] fail = new int[totalLen + 2];
        int[] endNode = new int[k];
        int states = 1;

        for (int i = 0; i < k; i++) {
            String p = patterns[i];
            int u = 0;
            for (int j = 0; j < p.length(); j++) {
                int c = p.charAt(j) - 'a';
                if (go[u][c] == 0) go[u][c] = states++;
                u = go[u][c];
            }
            endNode[i] = u;
        }

        int[] bfsOrder = new int[states];
        int qh = 0, qt = 0;
        for (int c = 0; c < 26; c++) if (go[0][c] != 0) bfsOrder[qt++] = go[0][c];
        while (qh < qt) {
            int u = bfsOrder[qh++];
            int fu = fail[u];
            for (int c = 0; c < 26; c++) {
                int v = go[u][c];
                if (v != 0) { fail[v] = go[fu][c]; bfsOrder[qt++] = v; }
                else go[u][c] = go[fu][c];
            }
        }

        final int INF = Integer.MAX_VALUE / 2;
        long[] hits = new long[states];
        int[] firstEnd = new int[states];
        Arrays.fill(firstEnd, INF);

        int u = 0;
        for (int i = 0; i < text.length(); i++) {
            u = go[u][text.charAt(i) - 'a'];
            hits[u]++;
            if (firstEnd[u] == INF) firstEnd[u] = i + 1;
        }

        for (int i = qt - 1; i >= 0; i--) {
            int node = bfsOrder[i], f = fail[node];
            hits[f] += hits[node];
            if (firstEnd[node] < firstEnd[f]) firstEnd[f] = firstEnd[node];
        }

        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < k; i++) {
            int en = endNode[i];
            int start = (firstEnd[en] == INF) ? -1 : (firstEnd[en] - patterns[i].length() + 1);
            sb.append(hits[en]).append(' ').append(start).append('\\n');
        }
        System.out.print(sb);
    }
}`,
        python3: `import sys
from collections import deque

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    text = next(it)
    k = int(next(it))
    patterns = [next(it) for _ in range(k)]

    go = [[0] * 26]
    fail = [0]
    end_node = [0] * k

    for i, p in enumerate(patterns):
        u = 0
        for ch in p:
            c = ord(ch) - 97
            nxt = go[u][c]
            if nxt == 0:
                nxt = len(go)
                go[u][c] = nxt
                go.append([0] * 26)
                fail.append(0)
            u = nxt
        end_node[i] = u

    bfs_order = []
    q = deque()
    for c in range(26):
        if go[0][c]:
            q.append(go[0][c])
            bfs_order.append(go[0][c])

    while q:
        u = q.popleft()
        fu = fail[u]
        go_u = go[u]
        go_fu = go[fu]
        for c in range(26):
            v = go_u[c]
            if v:
                fail[v] = go_fu[c]
                q.append(v)
                bfs_order.append(v)
            else:
                go_u[c] = go_fu[c]

    INF = 10**9
    hits = [0] * len(go)
    first_end = [INF] * len(go)
    u = 0
    for i, ch in enumerate(text, 1):
        u = go[u][ord(ch) - 97]
        hits[u] += 1
        if first_end[u] == INF:
            first_end[u] = i

    for node in reversed(bfs_order):
        f = fail[node]
        hits[f] += hits[node]
        if first_end[node] < first_end[f]:
            first_end[f] = first_end[node]

    out = []
    for i, p in enumerate(patterns):
        en = end_node[i]
        start = -1 if first_end[en] == INF else (first_end[en] - len(p) + 1)
        out.append(f"{hits[en]} {start}")
    sys.stdout.write("\\n".join(out) + "\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
idx = 0
text = tokens[idx]; idx += 1
k = tokens[idx].to_i; idx += 1
patterns = Array.new(k) { tokens[idx].tap { idx += 1 } }

go = [Array.new(26, 0)]
fail = [0]
end_node = Array.new(k, 0)

patterns.each_with_index do |p, i|
  u = 0
  p.each_byte do |b|
    c = b - 97
    if go[u][c] == 0
      go[u][c] = go.length
      go << Array.new(26, 0)
      fail << 0
    end
    u = go[u][c]
  end
  end_node[i] = u
end

bfs_order = []
26.times { |c| bfs_order << go[0][c] if go[0][c] != 0 }
qh = 0
while qh < bfs_order.length
  u = bfs_order[qh]; qh += 1
  fu = fail[u]
  26.times do |c|
    v = go[u][c]
    if v != 0
      fail[v] = go[fu][c]
      bfs_order << v
    else
      go[u][c] = go[fu][c]
    end
  end
end

inf = 10**9
hits = Array.new(go.length, 0)
first_end = Array.new(go.length, inf)
u = 0
text.each_byte.with_index(1) do |b, pos|
  u = go[u][b - 97]
  hits[u] += 1
  first_end[u] = pos if first_end[u] == inf
end

bfs_order.reverse_each do |node|
  f = fail[node]
  hits[f] += hits[node]
  first_end[f] = first_end[node] if first_end[node] < first_end[f]
end

out = []
patterns.each_with_index do |p, i|
  en = end_node[i]
  start = first_end[en] == inf ? -1 : (first_end[en] - p.length + 1)
  out << "#{hits[en]} #{start}"
end
puts out.join("\\n")`,
      },
    },
    {
      id: 'ch43-p3',
      tier: 'Boss',
      ratingRange: '2150–2350',
      title: 'Counting Safe Strings of Length N Avoiding Forbidden Substrings (Aho-Corasick + Matrix Exp)',
      statement:
        'Count the number of strings of length `N` (over lowercase English letters `a..z`, `N <= 10^18`) that do **NOT** contain ANY of `K` forbidden substrings `F[1..K]` (`sum |F[i]| <= 100`), modulo `10^9 + 7`.',
      constraints: '1 <= N <= 10^18, 0 <= K <= 50, sum |F[i]| <= 100',
      sampleInput: '3 1\nab',
      sampleOutput: '17525',
      hints: [
        'Build an Aho-Corasick DFA over `a..z` with `S <= 101` states, marking `bad[v] |= bad[fail[v]]` during BFS so suffix-matched forbidden patterns are blocked too!',
        'Build the `S x S` transition matrix `M[u][v]`: for every safe state `u` (`!bad[u]`) and every letter `c = 0..25`, if `!bad[go[u][c]]`, increment `M[u][go[u][c]]++`! Compute `M^N` via Binary Matrix Exponentiation in `O(S^3 log N)` and sum row `0` (`M^N[0][0..S-1]`)!',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

static constexpr long long MOD = 1'000'000'007LL;

using Mat = vector<vector<long long>>;

Mat mul(const Mat& A, const Mat& B) {
    int n = (int)A.size();
    Mat C(n, vector<long long>(n, 0));
    for (int i = 0; i < n; i++) {
        for (int k = 0; k < n; k++) {
            if (!A[i][k]) continue;
            long long aik = A[i][k];
            for (int j = 0; j < n; j++) {
                C[i][j] = (C[i][j] + aik * B[k][j]) % MOD;
            }
        }
    }
    return C;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    long long n;
    int k;
    if (!(cin >> n >> k)) return 0;

    vector<array<int, 26>> go(1, array<int, 26>{});
    vector<int> fail(1, 0);
    vector<bool> bad(1, false);

    for (int i = 0; i < k; i++) {
        string f;
        cin >> f;
        int u = 0;
        for (char ch : f) {
            int c = ch - 'a';
            if (!go[u][c]) {
                go[u][c] = (int)go.size();
                go.push_back(array<int, 26>{});
                fail.push_back(0);
                bad.push_back(false);
            }
            u = go[u][c];
        }
        bad[u] = true;
    }

    queue<int> q;
    for (int c = 0; c < 26; c++) {
        if (go[0][c]) q.push(go[0][c]);
    }
    while (!q.empty()) {
        int u = q.front();
        q.pop();
        if (bad[fail[u]]) bad[u] = true;
        for (int c = 0; c < 26; c++) {
            int v = go[u][c];
            if (v) {
                fail[v] = go[fail[u]][c];
                q.push(v);
            } else {
                go[u][c] = go[fail[u]][c];
            }
        }
    }

    int s = (int)go.size();
    Mat base(s, vector<long long>(s, 0)), res(s, vector<long long>(s, 0));
    for (int i = 0; i < s; i++) res[i][i] = 1;
    for (int u = 0; u < s; u++) {
        if (bad[u]) continue;
        for (int c = 0; c < 26; c++) {
            int v = go[u][c];
            if (!bad[v]) base[u][v]++;
        }
    }

    while (n > 0) {
        if (n & 1) res = mul(res, base);
        base = mul(base, base);
        n >>= 1;
    }

    long long ans = 0;
    for (int j = 0; j < s; j++) ans = (ans + res[0][j]) % MOD;
    cout << ans << "\\n";
    return 0;
}`,
        rust: `use std::collections::VecDeque;
use std::io::{self, Read};

const MOD: i64 = 1_000_000_007;

fn mul(a: &[Vec<i64>], b: &[Vec<i64>]) -> Vec<Vec<i64>> {
    let n = a.len();
    let mut c = vec![vec![0i64; n]; n];
    for i in 0..n {
        for k in 0..n {
            let aik = a[i][k];
            if aik == 0 {
                continue;
            }
            for j in 0..n {
                c[i][j] = (c[i][j] + aik * b[k][j]) % MOD;
            }
        }
    }
    c
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let mut n: u64 = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };
    let k: usize = it.next().unwrap().parse().unwrap();

    let mut go = vec![[0usize; 26]];
    let mut fail = vec![0usize];
    let mut bad = vec![false];

    for _ in 0..k {
        let f = it.next().unwrap().as_bytes();
        let mut u = 0usize;
        for &b in f {
            let c = (b - b'a') as usize;
            if go[u][c] == 0 {
                go[u][c] = go.len();
                go.push([0usize; 26]);
                fail.push(0);
                bad.push(false);
            }
            u = go[u][c];
        }
        bad[u] = true;
    }

    let mut q = VecDeque::new();
    for c in 0..26 {
        if go[0][c] != 0 {
            q.push_back(go[0][c]);
        }
    }
    while let Some(u) = q.pop_front() {
        let fu = fail[u];
        if bad[fu] {
            bad[u] = true;
        }
        for c in 0..26 {
            let v = go[u][c];
            if v != 0 {
                fail[v] = go[fu][c];
                q.push_back(v);
            } else {
                go[u][c] = go[fu][c];
            }
        }
    }

    let s = go.len();
    let mut base = vec![vec![0i64; s]; s];
    let mut res = vec![vec![0i64; s]; s];
    for i in 0..s {
        res[i][i] = 1;
    }
    for u in 0..s {
        if bad[u] {
            continue;
        }
        for c in 0..26 {
            let v = go[u][c];
            if !bad[v] {
                base[u][v] += 1;
            }
        }
    }

    while n > 0 {
        if (n & 1) == 1 {
            res = mul(&res, &base);
        }
        base = mul(&base, &base);
        n >>= 1;
    }

    let mut ans = 0i64;
    for j in 0..s {
        ans = (ans + res[0][j]) % MOD;
    }
    println!("{}", ans);
}`,
        java21: `import java.io.IOException;
import java.io.InputStream;

public class Main {
    static final long MOD = 1_000_000_007L;

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
        String nextWord() throws IOException {
            int c = readByte();
            while (c >= 0 && c <= ' ') c = readByte();
            if (c == -1) return null;
            StringBuilder sb = new StringBuilder();
            while (c > ' ') { sb.append((char) c); c = readByte(); }
            return sb.toString();
        }
        long nextLong() throws IOException {
            String w = nextWord();
            return w == null ? Long.MIN_VALUE : Long.parseLong(w);
        }
    }

    static long[][] mul(long[][] A, long[][] B) {
        int n = A.length;
        long[][] C = new long[n][n];
        for (int i = 0; i < n; i++) {
            for (int k = 0; k < n; k++) {
                long aik = A[i][k];
                if (aik == 0) continue;
                for (int j = 0; j < n; j++) {
                    C[i][j] = (C[i][j] + aik * B[k][j]) % MOD;
                }
            }
        }
        return C;
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        long n = fs.nextLong();
        if (n == Long.MIN_VALUE) return;
        int k = (int) fs.nextLong();

        String[] forbid = new String[k];
        int cap = 2;
        for (int i = 0; i < k; i++) {
            forbid[i] = fs.nextWord();
            cap += forbid[i].length();
        }

        int[][] go = new int[cap][26];
        int[] fail = new int[cap];
        boolean[] bad = new boolean[cap];
        int states = 1;

        for (String f : forbid) {
            int u = 0;
            for (int i = 0; i < f.length(); i++) {
                int c = f.charAt(i) - 'a';
                if (go[u][c] == 0) go[u][c] = states++;
                u = go[u][c];
            }
            bad[u] = true;
        }

        int[] que = new int[states];
        int qh = 0, qt = 0;
        for (int c = 0; c < 26; c++) if (go[0][c] != 0) que[qt++] = go[0][c];
        while (qh < qt) {
            int u = que[qh++];
            int fu = fail[u];
            if (bad[fu]) bad[u] = true;
            for (int c = 0; c < 26; c++) {
                int v = go[u][c];
                if (v != 0) { fail[v] = go[fu][c]; que[qt++] = v; }
                else go[u][c] = go[fu][c];
            }
        }

        long[][] base = new long[states][states];
        long[][] res = new long[states][states];
        for (int i = 0; i < states; i++) res[i][i] = 1;
        for (int u = 0; u < states; u++) {
            if (bad[u]) continue;
            for (int c = 0; c < 26; c++) {
                int v = go[u][c];
                if (!bad[v]) base[u][v]++;
            }
        }

        while (n > 0) {
            if ((n & 1) == 1) res = mul(res, base);
            base = mul(base, base);
            n >>>= 1;
        }

        long ans = 0;
        for (int j = 0; j < states; j++) ans = (ans + res[0][j]) % MOD;
        System.out.println(ans);
    }
}`,
        python3: `import sys
from collections import deque

sys.setrecursionlimit(200000)
MOD = 10**9 + 7

def mul(a, b):
    n = len(a)
    c = [[0] * n for _ in range(n)]
    for i in range(n):
        row_c = c[i]
        row_a = a[i]
        for k in range(n):
            aik = row_a[k]
            if aik:
                row_b = b[k]
                for j in range(n):
                    row_c[j] = (row_c[j] + aik * row_b[j]) % MOD
    return c

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    n = int(next(it))
    k = int(next(it))

    go = [[0] * 26]
    fail = [0]
    bad = [False]
    for _ in range(k):
        f = next(it)
        u = 0
        for ch in f:
            c = ord(ch) - 97
            if go[u][c] == 0:
                go[u][c] = len(go)
                go.append([0] * 26)
                fail.append(0)
                bad.append(False)
            u = go[u][c]
        bad[u] = True

    q = deque()
    for c in range(26):
        if go[0][c]:
            q.append(go[0][c])
    while q:
        u = q.popleft()
        fu = fail[u]
        if bad[fu]:
            bad[u] = True
        for c in range(26):
            v = go[u][c]
            if v:
                fail[v] = go[fu][c]
                q.append(v)
            else:
                go[u][c] = go[fu][c]

    s = len(go)
    base = [[0] * s for _ in range(s)]
    res = [[0] * s for _ in range(s)]
    for i in range(s):
        res[i][i] = 1
    for u in range(s):
        if bad[u]:
            continue
        for c in range(26):
            v = go[u][c]
            if not bad[v]:
                base[u][v] += 1

    while n > 0:
        if n & 1:
            res = mul(res, base)
        base = mul(base, base)
        n >>= 1

    ans = sum(res[0]) % MOD
    sys.stdout.write(f"{ans}\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
MOD = 1_000_000_007

def mat_mul(a, b)
  n = a.length
  c = Array.new(n) { Array.new(n, 0) }
  n.times do |i|
    n.times do |k|
      aik = a[i][k]
      next if aik == 0
      n.times { |j| c[i][j] = (c[i][j] + aik * b[k][j]) % MOD }
    end
  end
  c
end

idx = 0
n = tokens[idx].to_i; idx += 1
k = tokens[idx].to_i; idx += 1

go = [Array.new(26, 0)]
fail = [0]
bad = [false]

k.times do
  f = tokens[idx]; idx += 1
  u = 0
  f.each_byte do |b|
    c = b - 97
    if go[u][c] == 0
      go[u][c] = go.length
      go << Array.new(26, 0)
      fail << 0
      bad << false
    end
    u = go[u][c]
  end
  bad[u] = true
end

q = []
26.times { |c| q << go[0][c] if go[0][c] != 0 }
qh = 0
while qh < q.length
  u = q[qh]; qh += 1
  fu = fail[u]
  bad[u] = true if bad[fu]
  26.times do |c|
    v = go[u][c]
    if v != 0
      fail[v] = go[fu][c]
      q << v
    else
      go[u][c] = go[fu][c]
    end
  end
end

s = go.length
base = Array.new(s) { Array.new(s, 0) }
res = Array.new(s) { |i| Array.new(s) { |j| i == j ? 1 : 0 } }
s.times do |u|
  next if bad[u]
  26.times do |c|
    v = go[u][c]
    base[u][v] += 1 unless bad[v]
  end
end

while n > 0
  res = mat_mul(res, base) if (n & 1) == 1
  base = mat_mul(base, base)
  n >>= 1
end

puts(res[0].sum % MOD)`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'CSES',
      title: 'Finding Patterns, Counting Patterns & Pattern Positions',
      difficulty: 'Hard',
      url: 'https://cses.fi/problemset/task/2103',
      patternNote: 'Canonical Aho-Corasick fail-tree accumulation benchmark for 5 * 10^5 pattern sums.',
    },
    {
      platform: 'Codeforces',
      title: 'Vasiliy’s Multiset (CF 706D — Binary Trie Insert/Delete/Max-XOR)',
      difficulty: '1800',
      url: 'https://codeforces.com/problemset/problem/706/D',
      patternNote: 'Dynamic 30-bit Binary Trie with `cnt[]` deletions and greedy opposite-bit traversal.',
    },
    {
      platform: 'AtCoder',
      title: 'ABC 268 H - Taboo (Greedy Aho-Corasick Prefix Replacements)',
      difficulty: '2200',
      url: 'https://atcoder.jp/contests/abc268/tasks/abc268_h',
      patternNote: 'Linear-time Aho-Corasick scanner resetting to state 0 whenever entering a `bad[u]` state.',
    },
    {
      platform: 'CodeChef',
      title: 'SUBBXOR (Subarrays with XOR < K via Binary Trie)',
      difficulty: 'Medium-Hard',
      url: 'https://www.codechef.com/problems/SUBBXOR',
      patternNote: 'Count pairs with `(pref[i] ^ y) < K` by summing left/right subtree counts along bits of `K`.',
    },
    {
      platform: 'HackerRank',
      title: 'Determining DNA Health (Aho-Corasick + Offline Prefix Sums)',
      difficulty: 'Hard',
      url: 'https://www.hackerrank.com/challenges/determining-dna-health/problem',
      patternNote: 'Combine Aho-Corasick fail-tree traversal with Fenwick / binary search over pattern index ranges.',
    },
    {
      platform: 'NeetCode 150',
      title: 'Word Search II & Design Add and Search Words Data Structure',
      difficulty: 'Hard / Medium',
      url: 'https://neetcode.io/problems/search-for-word-ii',
      patternNote: 'Prefix Trie pruning foundations that scale up into Aho-Corasick multi-pattern DFAs.',
    },
  ],
  interviewNotes: [
    'On **Maximum XOR of Two Numbers**, always derive why greedy MSB-to-LSB selection works: `2^b > 2^(b-1) + ... + 2^0`, so winning a single higher bit `b` ALWAYS beats every possible gain from all lower bits combined!',
    'In **Aho-Corasick**, clearly explain the two phases of BFS completion: (1) computing `fail[v] = go[fail[u]][c]` for actual Trie edges, and (2) compressing missing edges `go[u][c] = go[fail[u]][c]` so runtime state transitions NEVER loop along fail pointers (`O(1)` per byte!).',
    'Always mention **fail-tree reverse-BFS accumulation** (`hits[fail[u]] += hits[u]`) to prove `O(|T| + sum |P_i|)` worst-case runtime even when patterns are overlapping prefixes like `{"a", "aa", "aaa", ...}`.',
  ],
  projectBlueprint: {
    title: 'High-Throughput Network Intrusion Detection & Multi-Pattern Content Filter',
    tagline:
      'Real-time packet signature scanner compiling thousands of threat signatures into a flat Aho-Corasick DFA that scans payload streams in strict O(1) per byte.',
    stackSummary: 'C++20 Flat DFA Aho-Corasick Engine, Zero-Copy Stream Scanner, Reverse-BFS Alert Aggregator',
    asciiDiagram: `Signature Set: ["sql_inject", "xss_tag", "drop_table", "eval("]
   --> Compiled into 32-state Flat DFA (go[state][byte])
   --> Packet Stream: "GET /?q=drop_table_users&x=eval(1)"
   --> Single O(N) Pass: 1 transition per byte -> Emits Exact Alert Offsets + Counts!`,
    milestones: [
      {
        id: 'm1',
        title: '1. Flat Transition Matrix Compiler',
        detail: 'Precompile signature sets into contiguous `go[state][ASCII]` tables with zero pointer chasing.',
      },
      {
        id: 'm2',
        title: '2. Single-Pass Stream Scanner & Fail-Tree Summarizer',
        detail: 'Aggregate exact hit frequencies across thousands of overlapping threat rules in `O(|Stream|)`.',
      },
      {
        id: 'm3',
        title: '3. Blocked-Payload DFA Transition Guard',
        detail: 'Propagate terminal threat flags down failure chains (`blocked[u] |= blocked[fail[u]]`) for instant drop/allow filtering.',
      },
    ],
    starterCode: `#include <bits/stdc++.h>
using namespace std;

// High-Throughput Network Intrusion Detection Multi-Pattern Scanner (Aho-Corasick DFA)
class PacketSignatureScanner {
    static constexpr int ALPHA = 128;
    vector<array<int, ALPHA>> go;
    vector<int> fail, bfsOrder;
    vector<vector<int>> terminalRules;
    vector<string> rules;

public:
    PacketSignatureScanner() {
        go.push_back(array<int, ALPHA>{});
        fail.push_back(0);
        terminalRules.emplace_back();
    }

    void registerSignature(const string& sig) {
        int id = (int)rules.size();
        rules.push_back(sig);
        int u = 0;
        for (unsigned char ch : sig) {
            if (ch >= ALPHA) continue;
            if (!go[u][ch]) {
                go[u][ch] = (int)go.size();
                go.push_back(array<int, ALPHA>{});
                fail.push_back(0);
                terminalRules.emplace_back();
            }
            u = go[u][ch];
        }
        terminalRules[u].push_back(id);
    }

    void compileDFA() {
        queue<int> q;
        for (int c = 0; c < ALPHA; c++) {
            if (go[0][c]) { q.push(go[0][c]); bfsOrder.push_back(go[0][c]); }
        }
        while (!q.empty()) {
            int u = q.front(); q.pop();
            for (int c = 0; c < ALPHA; c++) {
                int v = go[u][c];
                if (v) {
                    fail[v] = go[fail[u]][c];
                    q.push(v);
                    bfsOrder.push_back(v);
                } else {
                    go[u][c] = go[fail[u]][c];
                }
            }
        }
    }

    vector<pair<string, long long>> scanPayload(const string& payload) const {
        vector<long long> hits(go.size(), 0);
        int u = 0;
        for (unsigned char ch : payload) {
            u = (ch < ALPHA) ? go[u][ch] : 0;
            hits[u]++;
        }
        for (int i = (int)bfsOrder.size() - 1; i >= 0; i--) {
            int node = bfsOrder[i];
            hits[fail[node]] += hits[node];
        }
        vector<pair<string, long long>> alerts;
        for (size_t node = 0; node < go.size(); node++) {
            if (hits[node] > 0) {
                for (int rid : terminalRules[node]) alerts.push_back({rules[rid], hits[node]});
            }
        }
        return alerts;
    }
};

int main() {
    PacketSignatureScanner ids;
    ids.registerSignature("DROP TABLE");
    ids.registerSignature("SELECT *");
    ids.registerSignature("<script>");
    ids.registerSignature("script");
    ids.compileDFA();

    string packet = "POST /api body=SELECT * FROM users; DROP TABLE logs; <script>alert(1)</script>";
    auto alerts = ids.scanPayload(packet);
    cout << "IDS Threat Alerts Detected: " << alerts.size() << "\\n";
    for (auto& [sig, count] : alerts) {
        cout << "  Signature '" << sig << "' matched " << count << " time(s)\\n";
    }
    return 0;
}`,
  },
};
