import type { VaultBreakdown } from '../../types/vault';

export const VAULT08_AHO_CORASICK_MATRIX_EXP: VaultBreakdown = {
  slug: 'forbidden-pattern-avoidance-aho-corasick-matrix',
  title:
    'Counting Valid 10¹⁸-Length Strings Avoiding Forbidden Patterns -> Aho-Corasick Automaton + Matrix Exponentiation',
  rating: 2500,
  ratingTier: '2200–2600',
  usacoDivision: 'Advanced',
  domain: 'Strings & Geometry',
  sourceTag: '2300–2600 Multi-Topic Reduction Vault (Aho-Corasick DFA + Matrix Power)',
  reductionHeadline:
    'Compile a dictionary of forbidden substrings into an Aho-Corasick DFA, prune terminal failure-link states, and raise the safe transition adjacency matrix to the 10^18-th power in O(S^3 log N).',
  linkedChapters: [
    {
      number: 63,
      slug: 'trie-aho-corasick-automaton',
      title: 'Trie & Aho-Corasick Multi-Pattern Automaton',
    },
    {
      number: 50,
      slug: 'matrix-exponentiation-linear-recurrence',
      title: 'Matrix Exponentiation & Linear Recurrences',
    },
  ],
  keyTraps: [
    {
      title: 'Trap 1: Missing Failure-Link Badness Propagation (isBad[u] |= isBad[fail[u]])',
      detail:
        'If "ABC" and "B" are both in the forbidden list, the Aho-Corasick Trie node for "AB" is not an explicit end-of-word node in the Trie, yet its suffix "B" (reached via fail["AB"] = "B") IS forbidden! Failing to propagate isBad[u] |= isBad[fail[u]] in BFS order lets invalid strings slip through.',
    },
    {
      title: 'Trap 2: Multiple Alphabet Transitions Landing on the Same Safe DFA State',
      detail:
        'From a given safe state u, many characters (e.g., all characters not starting any forbidden word) transition back to the root state 0. You must INCREMENT M[u][next_state] += 1 for each valid character rather than overwriting M[u][next_state] = 1!',
    },
  ],
  stage1Statement: {
    statement:
      'You are given an alphabet of size K (the first K uppercase English letters A, B, ...) and a dictionary of M forbidden pattern strings P_1, P_2, ..., P_M over this alphabet. Count the number of valid strings of exact length N (up to 10^18) over the K-letter alphabet that do NOT contain any P_i as a contiguous substring, modulo 10^9 + 7.',
    constraints: [
      '1 <= N <= 10^18',
      '1 <= K <= 26',
      '1 <= M <= 50, sum(|P_i|) <= 100',
      'Time Limit: 1.5 seconds',
    ],
    sampleInput: `4 2 2
AB
BA`,
    sampleOutput: `2`,
    sampleExplanation:
      'Alphabet size K = 2 ({A, B}), target string length N = 4, and M = 2 forbidden patterns {"AB", "BA"}. Any transition from A to B creates "AB" and any transition from B to A creates "BA", so the only valid length-4 strings over {A, B} are "AAAA" and "BBBB" (total = 2).',
  },
  stage2NaiveFailure: {
    naiveApproaches: [
      {
        approach: '1D / 2D Dynamic Programming Over String Position i = 1..N',
        complexity: 'O(N * S * K)',
        verdict: 'TLE',
        reason:
          'N reaches 10^18; iterating character by character up to 10^18 takes millions of years.',
      },
      {
        approach: 'Inclusion-Exclusion Principle Over Forbidden Pattern Placements',
        complexity: 'Exponential in Overlaps',
        verdict: 'WA',
        reason:
          'Forbidden patterns can overlap arbitrarily with themselves and one another (e.g., "ABA" and "BAB" overlap as "ABAB"), creating unbounded overlap chains across length 10^18.',
      },
      {
        approach: 'KMP Automaton per Pattern Multiplied Independently',
        complexity: 'State Product O(|P_1| * |P_2| * ... * |P_M|)',
        verdict: 'MLE',
        reason:
          'Tracking M independent KMP pointers produces a Cartesian product state space of size 2^50, whereas Aho-Corasick unifies all M patterns into at most sum(|P_i|) + 1 <= 101 states!',
      },
    ],
    constraintWhispers: [
      'N <= 10^18 with small total pattern length S = sum(|P_i|) <= 100 is the classic signature of O(S^3 log N) Matrix Exponentiation.',
      'Aho-Corasick turns multi-pattern substring avoidance into a deterministic finite automaton (DFA) with S + 1 <= 101 states.',
      'Every valid string of length N corresponds to a walk of length N starting at the Aho-Corasick root (state 0) that never visits a forbidden state!',
    ],
  },
  stage3AhaReduction: {
    coreInsight:
      'Construct the Aho-Corasick DFA on the M forbidden patterns. Propagate terminal flags down failure links (bad[u] |= bad[fail[u]]). Extract the submatrix M of transitions strictly between SAFE states, compute M^N via binary matrix exponentiation in O(S^3 log N), and sum row 0 of M^N!',
    steps: [
      {
        title: '1. Build Aho-Corasick Trie & BFS Failure Automaton',
        proofNote:
          'Insert all M patterns into a Trie rooted at 0, marking the final node of each pattern with bad[u] = true. Run a level-order BFS to compute fail[u] and complete all K character transitions go[u][c] so the Trie becomes a complete DFA.',
      },
      {
        title: '2. Suffix Badness Closure Along Failure Links',
        proofNote:
          'During the BFS (which visits shorter prefixes before longer ones), set bad[u] = bad[u] || bad[fail[u]]. Now bad[u] is true iff the prefix represented by state u ends with at least one forbidden pattern P_i.',
      },
      {
        title: '3. Safe-State Adjacency Matrix Construction',
        proofNote:
          'Filter all states u with !bad[u] (or simply leave rows/columns of bad states as all zeros). For each safe state u and each character c in 0..K-1, let v = go[u][c]; if !bad[v], increment M[u][v] += 1.',
      },
      {
        title: '4. Binary Matrix Exponentiation M^N',
        proofNote:
          'The entry (M^N)[0][v] equals the exact number of valid length-N strings starting from the empty string (state 0) and ending in safe state v. Output sum_{v safe} (M^N)[0][v] mod (10^9 + 7).',
      },
    ],
  },
  stage4DryRun: {
    intro:
      'Trace the Sample Input: N = 4, K = 2 ({A, B}), forbidden patterns {"AB", "BA"}. Watch the 5-state Aho-Corasick DFA prune states 2 ("AB") and 4 ("BA"), leaving a 3x3 safe transition matrix whose 4th power sums to 2.',
    traceSteps: [
      {
        stepNumber: 1,
        title: 'Aho-Corasick Trie & Failure Links for {"AB", "BA"}',
        explanation:
          'States: 0 = "" (root), 1 = "A", 2 = "AB" (BAD), 3 = "B", 4 = "BA" (BAD). Safe states are {0, 1, 3}.',
        mode: 'graph',
        graph: {
          calloutMetric: '5 Total States · 3 Safe States: {0:"", 1:"A", 3:"B"}',
          nodes: [
            { id: '0', label: '0:"" (Root)', x: 120, y: 150, state: 'active' },
            { id: '1', label: '1:"A" (Safe)', x: 300, y: 80, state: 'even' },
            { id: '3', label: '3:"B" (Safe)', x: 300, y: 220, state: 'even' },
            { id: '2', label: '2:"AB" (BAD)', x: 480, y: 80, state: 'blossom' },
            { id: '4', label: '4:"BA" (BAD)', x: 480, y: 220, state: 'blossom' },
          ],
          edges: [
            { id: 'e01', from: '0', to: '1', state: 'augmenting' },
            { id: 'e03', from: '0', to: '3', state: 'augmenting' },
            { id: 'e12', from: '1', to: '2', state: 'contracted' },
            { id: 'e34', from: '3', to: '4', state: 'contracted' },
          ],
        },
        variables: { SafeStates: '{0, 1, 3}', BadStates: '{2, 4}' },
      },
      {
        stepNumber: 2,
        title: 'Safe DFA Transitions Among {0:"", 1:"A", 3:"B"}',
        explanation:
          'From state 0 (""): +A -> state 1, +B -> state 3. From state 1 ("A"): +A -> state 1 ("A" suffix), +B -> state 2 (BAD, dropped!). From state 3 ("B"): +A -> state 4 (BAD, dropped!), +B -> state 3 ("B" suffix).',
        mode: 'array',
        arrays: [
          {
            name: '3x3 Safe Transition Matrix M (Rows/Cols = States {0, 1, 3})',
            cells: [
              { index: 0, value: '[0, 1, 1]', label: 'Row 0 ("")', highlight: 'active' },
              { index: 1, value: '[0, 1, 0]', label: 'Row 1 ("A")', highlight: 'window' },
              { index: 2, value: '[0, 0, 1]', label: 'Row 3 ("B")', highlight: 'window' },
            ],
          },
        ],
        variables: { 'M[0]': '[0, 1, 1]', 'M[1]': '[0, 1, 0]', 'M[3]': '[0, 0, 1]' },
      },
      {
        stepNumber: 3,
        title: 'Compute M^4 via Binary Matrix Exponentiation',
        explanation:
          'Because M[1][1] = 1 and M[2][2] = 1 are absorbing self-loops for "A...A" and "B...B", M^4 equals M itself: Row 0 of M^4 is [0, 1, 1].',
        mode: 'array',
        arrays: [
          {
            name: 'Row 0 of M^4 (Walk Counts of Length N = 4 from Root 0)',
            cells: [
              { index: 0, value: 0, label: 'End at 0 ("")', highlight: 'neutral' },
              { index: 1, value: 1, label: 'End at 1 ("AAAA")', highlight: 'updated' },
              { index: 2, value: 1, label: 'End at 3 ("BBBB")', highlight: 'updated' },
            ],
          },
        ],
        variables: { EndAtState1: 1, EndAtState3: 1, TotalValidStrings: 2 },
      },
    ],
  },
  stage5Solutions: {
    timeComplexity: 'O(S * K + S^3 log N) where S = sum(|P_i|) + 1 <= 101',
    spaceComplexity: 'O(S * K + S^2)',
    implementations: {
      cpp20: `#include <bits/stdc++.h>
using namespace std;

static constexpr long long MOD = 1000000007LL;

using Matrix = vector<vector<long long>>;

Matrix multiply(const Matrix& A, const Matrix& B) {
    int n = (int)A.size();
    Matrix C(n, vector<long long>(n, 0));
    for (int i = 0; i < n; ++i) {
        for (int k = 0; k < n; ++k) {
            if (A[i][k] == 0) continue;
            long long aik = A[i][k];
            for (int j = 0; j < n; ++j) {
                C[i][j] = (C[i][j] + aik * B[k][j]) % MOD;
            }
        }
    }
    return C;
}

Matrix mat_pow(Matrix A, long long p) {
    int n = (int)A.size();
    Matrix res(n, vector<long long>(n, 0));
    for (int i = 0; i < n; ++i) res[i][i] = 1;
    while (p > 0) {
        if (p & 1) res = multiply(res, A);
        A = multiply(A, A);
        p >>= 1;
    }
    return res;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    long long N;
    int K, M;
    if (!(cin >> N >> K >> M)) return 0;

    vector<array<int, 26>> trie(1);
    trie[0].fill(0);
    vector<bool> bad(1, false);

    for (int i = 0; i < M; ++i) {
        string s;
        cin >> s;
        int u = 0;
        for (char ch : s) {
            int c = ch - 'A';
            if (c < 0 || c >= K) continue;
            if (!trie[u][c]) {
                trie[u][c] = (int)trie.size();
                trie.emplace_back();
                trie.back().fill(0);
                bad.push_back(false);
            }
            u = trie[u][c];
        }
        bad[u] = true;
    }

    int S = (int)trie.size();
    vector<int> fail(S, 0);
    queue<int> q;
    for (int c = 0; c < K; ++c) {
        if (trie[0][c]) q.push(trie[0][c]);
    }

    while (!q.empty()) {
        int u = q.front();
        q.pop();
        bad[u] = bad[u] || bad[fail[u]]; // Propagate suffix badness!
        for (int c = 0; c < K; ++c) {
            int v = trie[u][c];
            if (v) {
                fail[v] = trie[fail[u]][c];
                q.push(v);
            } else {
                trie[u][c] = trie[fail[u]][c];
            }
        }
    }

    if (bad[0]) {
        cout << 0 << '\\n';
        return 0;
    }

    vector<int> safe_id(S, -1);
    int safe_cnt = 0;
    for (int u = 0; u < S; ++u) {
        if (!bad[u]) safe_id[u] = safe_cnt++;
    }

    Matrix T(safe_cnt, vector<long long>(safe_cnt, 0));
    for (int u = 0; u < S; ++u) {
        if (bad[u]) continue;
        for (int c = 0; c < K; ++c) {
            int v = trie[u][c];
            if (!bad[v]) {
                T[safe_id[u]][safe_id[v]] = (T[safe_id[u]][safe_id[v]] + 1) % MOD;
            }
        }
    }

    Matrix TN = mat_pow(T, N);
    long long ans = 0;
    int root_id = safe_id[0];
    for (int j = 0; j < safe_cnt; ++j) {
        ans = (ans + TN[root_id][j]) % MOD;
    }
    cout << ans << '\\n';
    return 0;
}`,
      rust: `use std::collections::VecDeque;
use std::io::{self, Read};

const MOD: i64 = 1_000_000_007;

type Matrix = Vec<Vec<i64>>;

fn multiply(a: &Matrix, b: &Matrix) -> Matrix {
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

fn mat_pow(mut a: Matrix, mut p: i64) -> Matrix {
    let n = a.len();
    let mut res = vec![vec![0i64; n]; n];
    for i in 0..n {
        res[i][i] = 1;
    }
    while p > 0 {
        if p & 1 == 1 {
            res = multiply(&res, &a);
        }
        a = multiply(&a, &a);
        p >>= 1;
    }
    res
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let Some(n_str) = it.next() else { return; };
    let n_len: i64 = n_str.parse().unwrap();
    let k_alpha: usize = it.next().unwrap().parse().unwrap();
    let m_pats: usize = it.next().unwrap().parse().unwrap();

    let mut trie: Vec<[usize; 26]> = vec![[0; 26]];
    let mut bad: Vec<bool> = vec![false];

    for _ in 0..m_pats {
        let s = it.next().unwrap().as_bytes();
        let mut u = 0usize;
        for &ch in s {
            let c = (ch - b'A') as usize;
            if c >= k_alpha {
                continue;
            }
            if trie[u][c] == 0 {
                trie[u][c] = trie.len();
                trie.push([0; 26]);
                bad.push(false);
            }
            u = trie[u][c];
        }
        bad[u] = true;
    }

    let s_cnt = trie.len();
    let mut fail = vec![0usize; s_cnt];
    let mut q = VecDeque::new();
    for c in 0..k_alpha {
        if trie[0][c] != 0 {
            q.push_back(trie[0][c]);
        }
    }

    while let Some(u) = q.pop_front() {
        bad[u] = bad[u] || bad[fail[u]];
        for c in 0..k_alpha {
            let v = trie[u][c];
            if v != 0 {
                fail[v] = trie[fail[u]][c];
                q.push_back(v);
            } else {
                trie[u][c] = trie[fail[u]][c];
            }
        }
    }

    if bad[0] {
        println!("0");
        return;
    }

    let mut safe_id = vec![usize::MAX; s_cnt];
    let mut safe_cnt = 0usize;
    for u in 0..s_cnt {
        if !bad[u] {
            safe_id[u] = safe_cnt;
            safe_cnt += 1;
        }
    }

    let mut trans = vec![vec![0i64; safe_cnt]; safe_cnt];
    for u in 0..s_cnt {
        if bad[u] {
            continue;
        }
        for c in 0..k_alpha {
            let v = trie[u][c];
            if !bad[v] {
                trans[safe_id[u]][safe_id[v]] = (trans[safe_id[u]][safe_id[v]] + 1) % MOD;
            }
        }
    }

    let tn = mat_pow(trans, n_len);
    let root = safe_id[0];
    let mut ans = 0i64;
    for j in 0..safe_cnt {
        ans = (ans + tn[root][j]) % MOD;
    }
    println!("{}", ans);
}`,
      java21: `import java.io.*;
import java.util.*;

public class Main {
    static final long MOD = 1_000_000_007L;

    static long[][] multiply(long[][] A, long[][] B) {
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

    static long[][] matPow(long[][] A, long p) {
        int n = A.length;
        long[][] res = new long[n][n];
        for (int i = 0; i < n; i++) res[i][i] = 1;
        while (p > 0) {
            if ((p & 1) == 1) res = multiply(res, A);
            A = multiply(A, A);
            p >>= 1;
        }
        return res;
    }

    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String line = br.readLine();
        if (line == null) return;
        StringTokenizer st = new StringTokenizer(line);
        long N = Long.parseLong(st.nextToken());
        int K = Integer.parseInt(st.nextToken());
        int M = Integer.parseInt(st.nextToken());

        List<int[]> trie = new ArrayList<>();
        trie.add(new int[26]);
        List<Boolean> bad = new ArrayList<>();
        bad.add(false);

        for (int i = 0; i < M; i++) {
            while (!st.hasMoreTokens()) st = new StringTokenizer(br.readLine());
            String s = st.nextToken();
            int u = 0;
            for (int j = 0; j < s.length(); j++) {
                int c = s.charAt(j) - 'A';
                if (c < 0 || c >= K) continue;
                if (trie.get(u)[c] == 0) {
                    trie.get(u)[c] = trie.size();
                    trie.add(new int[26]);
                    bad.add(false);
                }
                u = trie.get(u)[c];
            }
            bad.set(u, true);
        }

        int S = trie.size();
        int[] fail = new int[S];
        ArrayDeque<Integer> q = new ArrayDeque<>();
        for (int c = 0; c < K; c++) {
            if (trie.get(0)[c] != 0) q.add(trie.get(0)[c]);
        }

        while (!q.isEmpty()) {
            int u = q.poll();
            if (bad.get(fail[u])) bad.set(u, true);
            for (int c = 0; c < K; c++) {
                int v = trie.get(u)[c];
                if (v != 0) {
                    fail[v] = trie.get(fail[u])[c];
                    q.add(v);
                } else {
                    trie.get(u)[c] = trie.get(fail[u])[c];
                }
            }
        }

        if (bad.get(0)) {
            System.out.println(0);
            return;
        }

        int[] safeId = new int[S];
        Arrays.fill(safeId, -1);
        int safeCnt = 0;
        for (int u = 0; u < S; u++) if (!bad.get(u)) safeId[u] = safeCnt++;

        long[][] T = new long[safeCnt][safeCnt];
        for (int u = 0; u < S; u++) {
            if (bad.get(u)) continue;
            for (int c = 0; c < K; c++) {
                int v = trie.get(u)[c];
                if (!bad.get(v)) {
                    T[safeId[u]][safeId[v]] = (T[safeId[u]][safeId[v]] + 1) % MOD;
                }
            }
        }

        long[][] TN = matPow(T, N);
        long ans = 0;
        int root = safeId[0];
        for (int j = 0; j < safeCnt; j++) ans = (ans + TN[root][j]) % MOD;
        System.out.println(ans);
    }
}`,
      python3: `from collections import deque
import sys

MOD = 1_000_000_007

def mat_mul(A: list[list[int]], B: list[list[int]]) -> list[list[int]]:
    n = len(A)
    C = [[0] * n for _ in range(n)]
    for i in range(n):
        Ai = A[i]
        Ci = C[i]
        for k in range(n):
            aik = Ai[k]
            if not aik:
                continue
            Bk = B[k]
            for j in range(n):
                Ci[j] = (Ci[j] + aik * Bk[j]) % MOD
    return C

def mat_pow(A: list[list[int]], p: int) -> list[list[int]]:
    n = len(A)
    res = [[int(i == j) for j in range(n)] for i in range(n)]
    while p > 0:
        if p & 1:
            res = mat_mul(res, A)
        A = mat_mul(A, A)
        p >>= 1
    return res

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    N = int(data[0])
    K = int(data[1])
    M = int(data[2])
    patterns = data[3 : 3 + M]

    trie = [[0] * K]
    bad = [False]

    for s in patterns:
        u = 0
        for ch in s:
            c = ord(ch) - ord("A")
            if 0 <= c < K:
                if trie[u][c] == 0:
                    trie[u][c] = len(trie)
                    trie.append([0] * K)
                    bad.append(False)
                u = trie[u][c]
        bad[u] = True

    S = len(trie)
    fail = [0] * S
    q = deque()
    for c in range(K):
        if trie[0][c]:
            q.append(trie[0][c])

    while q:
        u = q.popleft()
        bad[u] = bad[u] or bad[fail[u]]
        for c in range(K):
            v = trie[u][c]
            if v:
                fail[v] = trie[fail[u]][c]
                q.append(v)
            else:
                trie[u][c] = trie[fail[u]][c]

    if bad[0]:
        print(0)
        return

    safe_id = [-1] * S
    safe_cnt = 0
    for u in range(S):
        if not bad[u]:
            safe_id[u] = safe_cnt
            safe_cnt += 1

    T = [[0] * safe_cnt for _ in range(safe_cnt)]
    for u in range(S):
        if bad[u]:
            continue
        for c in range(K):
            v = trie[u][c]
            if not bad[v]:
                T[safe_id[u]][safe_id[v]] = (T[safe_id[u]][safe_id[v]] + 1) % MOD

    TN = mat_pow(T, N)
    print(sum(TN[safe_id[0]]) % MOD)

if __name__ == "__main__":
    solve()`,
      ruby: `MOD = 1_000_000_007

def mat_mul(a, b)
  n = a.size
  c = Array.new(n) { Array.new(n, 0) }
  n.times do |i|
    ai = a[i]
    ci = c[i]
    n.times do |k|
      aik = ai[k]
      next if aik == 0
      bk = b[k]
      n.times do |j|
        ci[j] = (ci[j] + aik * bk[j]) % MOD
      end
    end
  end
  c
end

def mat_pow(a, p)
  n = a.size
  res = Array.new(n) { |i| Array.new(n) { |j| i == j ? 1 : 0 } }
  while p > 0
    res = mat_mul(res, a) if p.odd?
    a = mat_mul(a, a)
    p >>= 1
  end
  res
end

tokens = STDIN.read.split
exit if tokens.empty?
n_len = tokens[0].to_i
k_alpha = tokens[1].to_i
m_pats = tokens[2].to_i
patterns = tokens[3, m_pats]

trie = [Array.new(k_alpha, 0)]
bad = [false]

patterns.each do |s|
  u = 0
  s.each_byte do |b|
    c = b - 65
    next if c < 0 || c >= k_alpha
    if trie[u][c] == 0
      trie[u][c] = trie.size
      trie << Array.new(k_alpha, 0)
      bad << false
    end
    u = trie[u][c]
  end
  bad[u] = true
end

s_cnt = trie.size
fail = Array.new(s_cnt, 0)
q = []
k_alpha.times { |c| q << trie[0][c] if trie[0][c] != 0 }

head = 0
while head < q.size
  u = q[head]
  head += 1
  bad[u] ||= bad[fail[u]]
  k_alpha.times do |c|
    v = trie[u][c]
    if v != 0
      fail[v] = trie[fail[u]][c]
      q << v
    else
      trie[u][c] = trie[fail[u]][c]
    end
  end
end

if bad[0]
  puts 0
  exit
end

safe_id = Array.new(s_cnt, -1)
safe_cnt = 0
s_cnt.times do |u|
  unless bad[u]
    safe_id[u] = safe_cnt
    safe_cnt += 1
  end
end

trans = Array.new(safe_cnt) { Array.new(safe_cnt, 0) }
s_cnt.times do |u|
  next if bad[u]
  k_alpha.times do |c|
    v = trie[u][c]
    unless bad[v]
      trans[safe_id[u]][safe_id[v]] = (trans[safe_id[u]][safe_id[v]] + 1) % MOD
    end
  end
end

tn = mat_pow(trans, n_len)
puts tn[safe_id[0]].sum % MOD`,
    },
  },
};
