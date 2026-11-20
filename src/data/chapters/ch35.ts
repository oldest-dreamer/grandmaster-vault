import type { TheoryChapter } from '../../types/vault';

export const CH35_DIGIT_DP_AUTOMATON: TheoryChapter = {
  slug: 'digit-dp-automaton',
  topicId: 'dp-22',
  title: 'Digit DP & Aho-Corasick State Transitions',
  domain: 'Search, Greedy & DP',
  ratingTier: '1600–1900',
  usacoDivision: 'Gold',
  subtitle:
    'Count or sum properties across all integers in [L, R] up to 10^100 by marching left-to-right across decimal digits with tight-prefix, leading-zero, and Aho-Corasick forbidden-substring automaton states.',
  analogyTitle: 'The Padlock Tumbler & Forbidden-Code Automaton Analogy',
  analogyBody:
    'Suppose you must count how many numbers between `0` and `45,829,103,712,948,112` have digits summing to a prime—or avoid blacklisted PIN substrings like `"13"` and `"666"`. Looping `1..N` takes centuries! Instead, treat `N` as a string of `D` padlock dials read left-to-right. At dial `pos`, if every earlier dial matched `N`’s exact digit (`tight = true`), the next digit `d` cannot exceed `N[pos]`; the moment you spin a smaller digit (`d < N[pos]`), `tight` drops to `false` forever, unlocking EVERY choice `0..9` for all remaining dials and letting memoization reuse the identical subproblem millions of times! Plugging an **Aho-Corasick Trie** directly into the DP state tracks forbidden multi-digit patterns simultaneously—turning `10^100` integers into a tiny `D * S` table!',
  prerequisites: [
    {
      slug: 'knapsack-lis-classic-dp',
      title: '1D/2D Dynamic Programming & Knapsack State Design',
    },
  ],
  traceTitle: 'Interactive Digit DP Memoization Trace (pos, tight, leadingZero, sum) on N = "253"',
  traceSubtitle:
    'Trace how Digit DP branches at `pos = 0, 1, 2` over digits of `N = "253"` (`D = 3`), separating `tight = 1` prefixes from memoizable `tight = 0` subtrees.',
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Step 1: Root Call at pos = 0 (Bound Digit N[0] = 2, tight = 1, leadingZero = 1)',
      explanation:
        'At pos = 0, upper limit is N[0] = 2, so allowed digits are d in {0, 1, 2}. Choosing d = 0 keeps leadingZero = 1 (still no non-zero digit placed) and drops tight -> 0! Choosing d = 1 sets tight = 0, leadingZero = 0. Choosing d = 2 stays tight = 1!',
      mode: 'array',
      arrays: [
        {
          name: 'Digits of N = "253"',
          cells: [
            { index: 0, value: 2, highlight: 'active' },
            { index: 1, value: 5, highlight: 'neutral' },
            { index: 2, value: 3, highlight: 'neutral' },
          ],
        },
        {
          name: 'Branch Choices from pos = 0',
          cells: [
            { index: 0, value: 'd=0 -> (1,t=0,lz=1)', highlight: 'window' },
            { index: 1, value: 'd=1 -> (1,t=0,lz=0)', highlight: 'window' },
            { index: 2, value: 'd=2 -> (1,t=1,lz=0)', highlight: 'updated' },
          ],
        },
      ],
      variables: { pos: 0, tight: 1, leadingZero: 1, MaxDigit: 2 },
    },
    {
      stepNumber: 2,
      title: 'Step 2: tight = 0 Unlocks Full 0..9 Range & Activates Memoization Cache',
      explanation:
        'Inside branch (pos=1, tight=0, lz=0, sum=1), ALL 10 digits 0..9 are valid! Whenever another prefix later reaches (pos=1, tight=0, lz=0, sum=1), we never recompute—we return memo[1][0][1] in O(1)! (Pro tip: only cache when tight == 0, or separate tight dimension).',
      mode: 'array',
      arrays: [
        {
          name: 'Digits of N = "253"',
          cells: [
            { index: 0, value: 2, highlight: 'neutral' },
            { index: 1, value: 5, highlight: 'active' },
            { index: 2, value: 3, highlight: 'neutral' },
          ],
        },
        {
          name: 'Digit Upper Limit Comparison',
          cells: [
            { index: 0, value: 'tight=0: 0..9', highlight: 'updated' },
            { index: 1, value: 'tight=1: 0..5', highlight: 'active' },
          ],
        },
      ],
      variables: { pos: 1, 'tight=0_Choices': '10 digits', 'tight=1_Choices': '6 digits (0..5)' },
    },
    {
      stepNumber: 3,
      title: 'Step 3: Tight Path Reaches pos = 2 (Prefix "25" -> d <= N[2] = 3)',
      explanation:
        'Following the single tight prefix "2" -> "5" reaches pos = 2 with tight = 1, lz = 0, sum = 7. Only d in {0, 1, 2, 3} are permitted, generating {250, 251, 252, 253} and NEVER exceeding N!',
      mode: 'array',
      arrays: [
        {
          name: 'Digits of N = "253"',
          cells: [
            { index: 0, value: 2, highlight: 'window' },
            { index: 1, value: 5, highlight: 'window' },
            { index: 2, value: 3, highlight: 'active' },
          ],
        },
        {
          name: 'Final Valid Numbers on Tight Path',
          cells: [
            { index: 0, value: '250 (sum=7)', highlight: 'updated' },
            { index: 1, value: '251 (sum=8)', highlight: 'updated' },
            { index: 2, value: '252 (sum=9)', highlight: 'updated' },
            { index: 3, value: '253 (sum=10)', highlight: 'active' },
          ],
        },
      ],
      variables: { pos: 2, tight: 1, AllowedLastDigits: '0..3', BaseReturn: 'pos == D -> 1' },
    },
    {
      stepNumber: 4,
      title: 'Step 4: Range Query [L, R] via Inclusion-Exclusion F(R) - F(L - 1)',
      explanation:
        'To evaluate [L, R] up to 10^100: evaluate F(R) - F(L) + checkValid(L) (avoids risky BigInt string subtraction L - 1!), or subtract 1 from L carefully. Total states visited = O(D * States) <= 2,000!',
      mode: 'array',
      arrays: [
        {
          name: 'Range [L, R] Decomposition',
          cells: [
            { index: 0, value: 'F(R)', highlight: 'updated' },
            { index: 1, value: '- F(L)', highlight: 'window' },
            { index: 2, value: '+ valid(L)', highlight: 'active' },
          ],
        },
      ],
      variables: { Complexity: 'O(D * S * 10)', AvoidsBorrowBug: 'F(R) - F(L) + valid(L)' },
    },
  ],
  reductionClues: [
    {
      clue: '"Count integers in [L, R] up to 10^18 (or 10^1000) satisfying digit-sum, divisibility, or adjacent-digit rules"',
      translation:
        'Classic **Digit DP**! Transform `[L, R]` into `solve(R) - solve(L) + isValid(L)` (or `solve(R) - solve(L - 1)`). Track `(pos, tight, leadingZero, problemState)` across decimal digits.',
    },
    {
      clue: '"Compute BOTH the count of valid numbers AND the total sum of numbers / digits in [L, R]"',
      translation:
        'Return a pair `(cnt, totalSum)` from your DP! When placing digit `d` at position `pos` (with remaining `rem` positions), it contributes `d * 10^rem * sub.cnt + sub.totalSum` (for numeric sum) or `d * sub.cnt + sub.digitSum` (for digit sum)!',
    },
    {
      clue: '"Leading zeros behave differently from real zeros (e.g. no adjacent equal digits: 007 is valid as 7, 100 is invalid!)"',
      translation:
        'Include a boolean `started` (or `leadingZero = true`) flag in your memo state! While `!started && d == 0`, keep `prevDigit = -1` (or stay at Aho-Corasick root `0`) and keep `started = false`.',
    },
    {
      clue: '"Count strings/numbers <= N (up to 10^1000) containing NONE of K forbidden substrings"',
      translation:
        'Build an **Aho-Corasick Automaton** over alphabet `0..9` marking terminal & failure-chain-terminal states as `bad[state] = true`! Run Digit DP over `(pos, tight, started, acNode)`, skipping any transition `nxt = go[acNode][d]` where `bad[nxt]` is true!',
    },
  ],
  timeComplexity: 'O(D * S * 10) where D = number of digits (<= 100..1000) and S = DP / Aho-Corasick states',
  spaceComplexity: 'O(D * S)',
  pitfalls: [
    {
      type: 'WA',
      title: 'Leading Zeros Accidentally Triggering Adjacent-Digit or Forbidden-Pattern Rules',
      detail:
        'In `00042`, the first three zeros are padding—not actual digits! If you pass `prev = 0` or feed `0` into the Aho-Corasick automaton while `started == false`, `"0042"` is falsely rejected by `"no adjacent equal digits"` or pattern `"04"`. Keep `started = false` and `state = 0` until the first `d > 0`!',
    },
    {
      type: 'WA',
      title: 'Subtracting 1 From Decimal String L Incorrectly When L = "0" or L = "1000"',
      detail:
        'String decrementing `L - 1` breaks on `"0"` or trailing zeros `"1000" -> "0999"`! Instead, compute `F(R) - F(L) + directCheck(L)` modulo `P`—zero string subtraction needed!',
    },
    {
      type: 'TLE',
      title: 'Clearing Memo Table Including tight = 1 Across Multiple Bounds L and R',
      detail:
        'Note that `memo[pos][tight=0][...]` does NOT depend on the bound `N` (only on remaining length `D - pos`)! Meanwhile if you DO index by `pos` from left to right (dependent on `N.length()`), reset `memo` between `solve(R)` and `solve(L)` or index remaining digits `rem = D - 1 - pos` so `tight=0` memo caches across BOTH bounds!',
    },
    {
      type: 'WA',
      title: 'Missing Failure-Link Terminal Propagation in Aho-Corasick Automaton',
      detail:
        'Suppose forbidden patterns are `"123"` and `"2"`. When matching `"12"`, the state `"12"` isn’t `"2"` directly—its **failure link** points to `"2"`! During BFS automaton build, always propagate `bad[u] |= bad[fail[u]]`!',
    },
  ],
  implementations: {
    cpp20: `#include <bits/stdc++.h>
using namespace std;

// Digit DP Template: Count integers in [L, R] whose digit sum is divisible by K
static const long long MOD = 1000000007LL;

long long solve_up_to(const string& s, int K) {
    int n = (int)s.size();
    // dp[remMod] for non-tight states, rolling over digit positions
    vector<long long> dp_free(K, 0), dp_tight(K, 0);
    dp_tight[0] = 1;

    for (int pos = 0; pos < n; pos++) {
        int limit = s[pos] - '0';
        vector<long long> nxt_free(K, 0), nxt_tight(K, 0);
        for (int rem = 0; rem < K; rem++) {
            if (dp_free[rem]) {
                for (int d = 0; d <= 9; d++) {
                    int nr = (rem + d) % K;
                    nxt_free[nr] = (nxt_free[nr] + dp_free[rem]) % MOD;
                }
            }
            if (dp_tight[rem]) {
                for (int d = 0; d <= limit; d++) {
                    int nr = (rem + d) % K;
                    if (d < limit) {
                        nxt_free[nr] = (nxt_free[nr] + dp_tight[rem]) % MOD;
                    } else {
                        nxt_tight[nr] = (nxt_tight[nr] + dp_tight[rem]) % MOD;
                    }
                }
            }
        }
        dp_free.swap(nxt_free);
        dp_tight.swap(nxt_tight);
    }
    return (dp_free[0] + dp_tight[0]) % MOD;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    string L, R;
    int K;
    if (!(cin >> L >> R >> K)) return 0;

    long long ansR = solve_up_to(R, K);
    long long ansL = solve_up_to(L, K);
    int sumL = 0;
    for (char c : L) sumL = (sumL + (c - '0')) % K;
    long long okL = (sumL == 0) ? 1 : 0;

    long long ans = (ansR - ansL + okL + MOD) % MOD;
    cout << ans << "\\n";
    return 0;
}`,
    rust: `use std::io::{self, Read};

const MOD: i64 = 1_000_000_007;

fn solve_up_to(s: &[u8], k: usize) -> i64 {
    let mut dp_free = vec![0i64; k];
    let mut dp_tight = vec![0i64; k];
    dp_tight[0] = 1;

    for &ch in s {
        let limit = (ch - b'0') as usize;
        let mut nxt_free = vec![0i64; k];
        let mut nxt_tight = vec![0i64; k];
        for rem in 0..k {
            if dp_free[rem] != 0 {
                for d in 0..=9 {
                    let nr = (rem + d) % k;
                    nxt_free[nr] = (nxt_free[nr] + dp_free[rem]) % MOD;
                }
            }
            if dp_tight[rem] != 0 {
                for d in 0..=limit {
                    let nr = (rem + d) % k;
                    if d < limit {
                        nxt_free[nr] = (nxt_free[nr] + dp_tight[rem]) % MOD;
                    } else {
                        nxt_tight[nr] = (nxt_tight[nr] + dp_tight[rem]) % MOD;
                    }
                }
            }
        }
        dp_free = nxt_free;
        dp_tight = nxt_tight;
    }
    (dp_free[0] + dp_tight[0]) % MOD
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let l = match it.next() {
        Some(v) => v.as_bytes(),
        None => return,
    };
    let r = it.next().unwrap().as_bytes();
    let k: usize = it.next().unwrap().parse().unwrap();

    let sum_l = l.iter().fold(0usize, |acc, &c| (acc + (c - b'0') as usize) % k);
    let ok_l = if sum_l == 0 { 1 } else { 0 };
    let ans = (solve_up_to(r, k) - solve_up_to(l, k) + ok_l + MOD) % MOD;
    println!("{}", ans);
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

    static final long MOD = 1_000_000_007L;

    static long solveUpTo(String s, int k) {
        long[] dpFree = new long[k];
        long[] dpTight = new long[k];
        dpTight[0] = 1;
        for (int pos = 0; pos < s.length(); pos++) {
            int limit = s.charAt(pos) - '0';
            long[] nxtFree = new long[k];
            long[] nxtTight = new long[k];
            for (int rem = 0; rem < k; rem++) {
                if (dpFree[rem] != 0) {
                    for (int d = 0; d <= 9; d++) {
                        int nr = (rem + d) % k;
                        nxtFree[nr] = (nxtFree[nr] + dpFree[rem]) % MOD;
                    }
                }
                if (dpTight[rem] != 0) {
                    for (int d = 0; d <= limit; d++) {
                        int nr = (rem + d) % k;
                        if (d < limit) nxtFree[nr] = (nxtFree[nr] + dpTight[rem]) % MOD;
                        else nxtTight[nr] = (nxtTight[nr] + dpTight[rem]) % MOD;
                    }
                }
            }
            dpFree = nxtFree;
            dpTight = nxtTight;
        }
        return (dpFree[0] + dpTight[0]) % MOD;
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        String L = fs.next();
        if (L == null) return;
        String R = fs.next();
        int K = Integer.parseInt(fs.next());

        int sumL = 0;
        for (int i = 0; i < L.length(); i++) sumL = (sumL + (L.charAt(i) - '0')) % K;
        long okL = (sumL == 0) ? 1 : 0;
        long ans = (solveUpTo(R, K) - solveUpTo(L, K) + okL + MOD) % MOD;
        System.out.println(ans);
    }
}`,
    python3: `import sys

sys.setrecursionlimit(200000)

MOD = 1_000_000_007

def solve_up_to(s: str, k: int) -> int:
    dp_free = [0] * k
    dp_tight = [0] * k
    dp_tight[0] = 1
    for ch in s:
        limit = ord(ch) - 48
        nxt_free = [0] * k
        nxt_tight = [0] * k
        for rem in range(k):
            vf = dp_free[rem]
            if vf:
                for d in range(10):
                    nr = (rem + d) % k
                    nxt_free[nr] = (nxt_free[nr] + vf) % MOD
            vt = dp_tight[rem]
            if vt:
                for d in range(limit + 1):
                    nr = (rem + d) % k
                    if d < limit:
                        nxt_free[nr] = (nxt_free[nr] + vt) % MOD
                    else:
                        nxt_tight[nr] = (nxt_tight[nr] + vt) % MOD
        dp_free = nxt_free
        dp_tight = nxt_tight
    return (dp_free[0] + dp_tight[0]) % MOD

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    L, R, K = data[0], data[1], int(data[2])
    sum_l = sum(ord(c) - 48 for c in L) % K
    ok_l = 1 if sum_l == 0 else 0
    print((solve_up_to(R, K) - solve_up_to(L, K) + ok_l) % MOD)

if __name__ == "__main__":
    solve()`,
    ruby: `MOD = 1_000_000_007

def solve_up_to(s, k)
  dp_free = Array.new(k, 0)
  dp_tight = Array.new(k, 0)
  dp_tight[0] = 1
  s.each_byte do |b|
    limit = b - 48
    nxt_free = Array.new(k, 0)
    nxt_tight = Array.new(k, 0)
    k.times do |rem|
      vf = dp_free[rem]
      if vf != 0
        10.times do |d|
          nr = (rem + d) % k
          nxt_free[nr] = (nxt_free[nr] + vf) % MOD
        end
      end
      vt = dp_tight[rem]
      if vt != 0
        (0..limit).each do |d|
          nr = (rem + d) % k
          if d < limit
            nxt_free[nr] = (nxt_free[nr] + vt) % MOD
          else
            nxt_tight[nr] = (nxt_tight[nr] + vt) % MOD
          end
        end
      end
    end
    dp_free = nxt_free
    dp_tight = nxt_tight
  end
  (dp_free[0] + dp_tight[0]) % MOD
end

tokens = $stdin.read.split
exit if tokens.empty?
l_str, r_str, k_str = tokens[0], tokens[1], tokens[2]
k = k_str.to_i
sum_l = l_str.bytes.sum { |b| b - 48 } % k
ok_l = sum_l == 0 ? 1 : 0
puts (solve_up_to(r_str, k) - solve_up_to(l_str, k) + ok_l) % MOD`,
  },
  practiceProblems: [
    {
      id: 'ch35-p1',
      tier: 'Warmup',
      ratingRange: '1550–1750',
      title: 'Counting Numbers (No Two Adjacent Equal Digits in [A, B])',
      statement:
        'Given two integers A and B (0 <= A <= B <= 10^18), count how many integers x in [A, B] have no two adjacent decimal digits equal (for instance, 121 is valid, while 112 and 200 are invalid).',
      constraints: '0 <= A <= B <= 10^18',
      sampleInput: '123 321',
      sampleOutput: '171',
      hints: [
        'Use `countUpTo(B) - countUpTo(A) + isValid(A)`. State is `(pos, prevDigit, tight, started)` where `prevDigit` is in `0..9` (plus `-1` / `10` when `!started`).',
        'Notice why `started` is mandatory: leading zeros like `005` represent `5`, which has NO adjacent zeros! Only reject `d == prevDigit` once `started == true`.',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

long long memo[20][11][2][2];
string S;

long long dfs(int pos, int prev, int tight, int started) {
    if (pos == (int)S.size()) return 1;
    long long& res = memo[pos][prev][tight][started];
    if (res != -1) return res;

    int limit = tight ? (S[pos] - '0') : 9;
    long long ways = 0;
    for (int d = 0; d <= limit; d++) {
        if (started && d == prev) continue;
        int nstarted = started || (d != 0);
        int nprev = nstarted ? d : 10;
        ways += dfs(pos + 1, nprev, tight && (d == limit), nstarted);
    }
    return res = ways;
}

long long count_up_to(long long x) {
    if (x < 0) return 0;
    S = to_string(x);
    memset(memo, -1, sizeof(memo));
    return dfs(0, 10, 1, 0);
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    long long a, b;
    if (!(cin >> a >> b)) return 0;
    cout << count_up_to(b) - count_up_to(a - 1) << "\\n";
    return 0;
}`,
        rust: `use std::io::{self, Read};

fn dfs(
    pos: usize,
    prev: usize,
    tight: usize,
    started: usize,
    digits: &[u8],
    memo: &mut Vec<i64>,
) -> i64 {
    if pos == digits.len() {
        return 1;
    }
    let idx = (((pos * 11 + prev) * 2 + tight) * 2) + started;
    if memo[idx] != -1 {
        return memo[idx];
    }
    let limit = if tight == 1 { digits[pos] } else { 9 };
    let mut ways = 0i64;
    for d in 0..=limit {
        let d_usize = d as usize;
        if started == 1 && d_usize == prev {
            continue;
        }
        let nstarted = if started == 1 || d != 0 { 1 } else { 0 };
        let nprev = if nstarted == 1 { d_usize } else { 10 };
        let ntight = if tight == 1 && d == limit { 1 } else { 0 };
        ways += dfs(pos + 1, nprev, ntight, nstarted, digits, memo);
    }
    memo[idx] = ways;
    ways
}

fn count_up_to(x: i64) -> i64 {
    if x < 0 {
        return 0;
    }
    let digits: Vec<u8> = x.to_string().bytes().map(|b| b - b'0').collect();
    let mut memo = vec![-1i64; digits.len() * 11 * 2 * 2];
    dfs(0, 10, 1, 0, &digits, &mut memo)
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let a: i64 = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };
    let b: i64 = it.next().unwrap().parse().unwrap();
    println!("{}", count_up_to(b) - count_up_to(a - 1));
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

    static char[] digits;
    static long[][][][] memo;

    static long dfs(int pos, int prev, int tight, int started) {
        if (pos == digits.length) return 1;
        if (memo[pos][prev][tight][started] != -1) return memo[pos][prev][tight][started];
        int limit = (tight == 1) ? (digits[pos] - '0') : 9;
        long ways = 0;
        for (int d = 0; d <= limit; d++) {
            if (started == 1 && d == prev) continue;
            int ns = (started == 1 || d != 0) ? 1 : 0;
            int np = (ns == 1) ? d : 10;
            int nt = (tight == 1 && d == limit) ? 1 : 0;
            ways += dfs(pos + 1, np, nt, ns);
        }
        return memo[pos][prev][tight][started] = ways;
    }

    static long countUpTo(long x) {
        if (x < 0) return 0;
        digits = Long.toString(x).toCharArray();
        memo = new long[digits.length][11][2][2];
        for (long[][][] a : memo) for (long[][] b : a) for (long[] c : b) Arrays.fill(c, -1);
        return dfs(0, 10, 1, 0);
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        long a = fs.nextLong();
        if (a == Long.MIN_VALUE) return;
        long b = fs.nextLong();
        System.out.println(countUpTo(b) - countUpTo(a - 1));
    }
}`,
        python3: `from functools import lru_cache
import sys

sys.setrecursionlimit(200000)

def count_up_to(x: int) -> int:
    if x < 0:
        return 0
    s = [int(c) for c in str(x)]
    n = len(s)

    @lru_cache(maxsize=None)
    def dfs(pos: int, prev: int, tight: bool, started: bool) -> int:
        if pos == n:
            return 1
        limit = s[pos] if tight else 9
        ways = 0
        for d in range(limit + 1):
            if started and d == prev:
                continue
            ns = started or (d != 0)
            ways += dfs(pos + 1, d if ns else -1, tight and d == limit, ns)
        return ways

    return dfs(0, -1, True, False)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    a, b = int(data[0]), int(data[1])
    print(count_up_to(b) - count_up_to(a - 1))

if __name__ == "__main__":
    solve()`,
        ruby: `def count_up_to(x)
  return 0 if x < 0
  digits = x.to_s.bytes.map { |b| b - 48 }
  n = digits.length
  memo = {}
  dfs = lambda do |pos, prev, tight, started|
    return 1 if pos == n
    key = (((pos * 11 + prev) * 2 + tight) * 2) + started
    return memo[key] if memo.key?(key)
    limit = tight == 1 ? digits[pos] : 9
    ways = 0
    (0..limit).each do |d|
      next if started == 1 && d == prev
      ns = (started == 1 || d != 0) ? 1 : 0
      np = ns == 1 ? d : 10
      nt = (tight == 1 && d == limit) ? 1 : 0
      ways += dfs.call(pos + 1, np, nt, ns)
    end
    memo[key] = ways
  end
  dfs.call(0, 10, 1, 0)
end

tokens = $stdin.read.split
exit if tokens.empty?
a = tokens[0].to_i
b = tokens[1].to_i
puts count_up_to(b) - count_up_to(a - 1)`,
      },
    },
    {
      id: 'ch35-p2',
      tier: 'Standard',
      ratingRange: '1700–1900',
      title: 'Sum of Digits of All Integers in Range [L, R] Mod 10^9 + 7',
      statement:
        'Given two large non-negative integers L and R (0 <= L <= R <= 10^1000) as decimal strings, compute the sum of the decimal digits of every integer in [L, R], modulo 10^9 + 7.',
      constraints: '0 <= L <= R <= 10^1000',
      sampleInput: '10 25',
      sampleOutput: '83',
      hints: [
        'At each digit step moving left-to-right, maintain FOUR numbers: `(cntFree, sumFree, cntTight, sumTight)`!',
        'When transitioning from `cnt` valid prefixes with total accumulated digit sum `sum` by appending digit `d`, the new prefixes contribute `cnt` times and add `d * cnt + sum` to total digit sum! Compute `F(R) - F(L) + digitSum(L)` modulo `10^9 + 7`.',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

static const long long MOD = 1000000007LL;

long long digit_sum_up_to(const string& s) {
    long long cntF = 0, sumF = 0;
    long long cntT = 1, sumT = 0;
    for (char ch : s) {
        int lim = ch - '0';
        long long nCntF = 0, nSumF = 0, nCntT = 0, nSumT = 0;
        // Free transitions (10 digits)
        nCntF = (cntF * 10) % MOD;
        nSumF = (sumF * 10 + cntF * 45) % MOD;
        // Tight transitions (0..lim)
        for (int d = 0; d <= lim; d++) {
            if (d < lim) {
                nCntF = (nCntF + cntT) % MOD;
                nSumF = (nSumF + sumT + cntT * d) % MOD;
            } else {
                nCntT = (nCntT + cntT) % MOD;
                nSumT = (nSumT + sumT + cntT * d) % MOD;
            }
        }
        cntF = nCntF; sumF = nSumF;
        cntT = nCntT; sumT = nSumT;
    }
    return (sumF + sumT) % MOD;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    string L, R;
    if (!(cin >> L >> R)) return 0;

    long long sumL = 0;
    for (char c : L) sumL = (sumL + (c - '0')) % MOD;
    long long ans = (digit_sum_up_to(R) - digit_sum_up_to(L) + sumL + MOD) % MOD;
    cout << ans << "\\n";
    return 0;
}`,
        rust: `use std::io::{self, Read};

const MOD: i64 = 1_000_000_007;

fn digit_sum_up_to(s: &[u8]) -> i64 {
    let (mut cnt_f, mut sum_f) = (0i64, 0i64);
    let (mut cnt_t, mut sum_t) = (1i64, 0i64);

    for &ch in s {
        let lim = (ch - b'0') as i64;
        let mut n_cnt_f = (cnt_f * 10) % MOD;
        let mut n_sum_f = (sum_f * 10 + cnt_f * 45) % MOD;
        let mut n_cnt_t = 0i64;
        let mut n_sum_t = 0i64;

        for d in 0..=lim {
            if d < lim {
                n_cnt_f = (n_cnt_f + cnt_t) % MOD;
                n_sum_f = (n_sum_f + sum_t + cnt_t * d) % MOD;
            } else {
                n_cnt_t = (n_cnt_t + cnt_t) % MOD;
                n_sum_t = (n_sum_t + sum_t + cnt_t * d) % MOD;
            }
        }
        cnt_f = n_cnt_f;
        sum_f = n_sum_f;
        cnt_t = n_cnt_t;
        sum_t = n_sum_t;
    }
    (sum_f + sum_t) % MOD
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let l = match it.next() {
        Some(v) => v.as_bytes(),
        None => return,
    };
    let r = it.next().unwrap().as_bytes();
    let sum_l = l.iter().fold(0i64, |acc, &c| (acc + (c - b'0') as i64) % MOD);
    let ans = (digit_sum_up_to(r) - digit_sum_up_to(l) + sum_l + MOD) % MOD;
    println!("{}", ans);
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

    static final long MOD = 1_000_000_007L;

    static long digitSumUpTo(String s) {
        long cntF = 0, sumF = 0, cntT = 1, sumT = 0;
        for (int i = 0; i < s.length(); i++) {
            int lim = s.charAt(i) - '0';
            long nCntF = (cntF * 10) % MOD;
            long nSumF = (sumF * 10 + cntF * 45) % MOD;
            long nCntT = 0, nSumT = 0;
            for (int d = 0; d <= lim; d++) {
                if (d < lim) {
                    nCntF = (nCntF + cntT) % MOD;
                    nSumF = (nSumF + sumT + cntT * d) % MOD;
                } else {
                    nCntT = (nCntT + cntT) % MOD;
                    nSumT = (nSumT + sumT + cntT * d) % MOD;
                }
            }
            cntF = nCntF; sumF = nSumF;
            cntT = nCntT; sumT = nSumT;
        }
        return (sumF + sumT) % MOD;
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        String L = fs.next();
        if (L == null) return;
        String R = fs.next();
        long sumL = 0;
        for (int i = 0; i < L.length(); i++) sumL = (sumL + (L.charAt(i) - '0')) % MOD;
        long ans = (digitSumUpTo(R) - digitSumUpTo(L) + sumL + MOD) % MOD;
        System.out.println(ans);
    }
}`,
        python3: `import sys

sys.setrecursionlimit(200000)

MOD = 1_000_000_007

def digit_sum_up_to(s: str) -> int:
    cnt_f = sum_f = 0
    cnt_t, sum_t = 1, 0
    for ch in s:
        lim = ord(ch) - 48
        n_cnt_f = (cnt_f * 10) % MOD
        n_sum_f = (sum_f * 10 + cnt_f * 45) % MOD
        n_cnt_t = n_sum_t = 0
        for d in range(lim + 1):
            if d < lim:
                n_cnt_f = (n_cnt_f + cnt_t) % MOD
                n_sum_f = (n_sum_f + sum_t + cnt_t * d) % MOD
            else:
                n_cnt_t = (n_cnt_t + cnt_t) % MOD
                n_sum_t = (n_sum_t + sum_t + cnt_t * d) % MOD
        cnt_f, sum_f = n_cnt_f, n_sum_f
        cnt_t, sum_t = n_cnt_t, n_sum_t
    return (sum_f + sum_t) % MOD

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    L, R = data[0], data[1]
    sum_l = sum(ord(c) - 48 for c in L) % MOD
    print((digit_sum_up_to(R) - digit_sum_up_to(L) + sum_l) % MOD)

if __name__ == "__main__":
    solve()`,
        ruby: `MOD = 1_000_000_007

def digit_sum_up_to(s)
  cnt_f = 0
  sum_f = 0
  cnt_t = 1
  sum_t = 0
  s.each_byte do |b|
    lim = b - 48
    n_cnt_f = (cnt_f * 10) % MOD
    n_sum_f = (sum_f * 10 + cnt_f * 45) % MOD
    n_cnt_t = 0
    n_sum_t = 0
    (0..lim).each do |d|
      if d < lim
        n_cnt_f = (n_cnt_f + cnt_t) % MOD
        n_sum_f = (n_sum_f + sum_t + cnt_t * d) % MOD
      else
        n_cnt_t = (n_cnt_t + cnt_t) % MOD
        n_sum_t = (n_sum_t + sum_t + cnt_t * d) % MOD
      end
    end
    cnt_f = n_cnt_f
    sum_f = n_sum_f
    cnt_t = n_cnt_t
    sum_t = n_sum_t
  end
  (sum_f + sum_t) % MOD
end

tokens = $stdin.read.split
exit if tokens.empty?
l_str, r_str = tokens[0], tokens[1]
sum_l = l_str.bytes.sum { |b| b - 48 } % MOD
puts (digit_sum_up_to(r_str) - digit_sum_up_to(l_str) + sum_l) % MOD`,
      },
    },
    {
      id: 'ch35-p3',
      tier: 'Boss',
      ratingRange: '2000–2250',
      title: 'Numbers Up to 10^100 Avoiding K Forbidden Digit Substrings (Digit DP + Aho-Corasick)',
      statement:
        'Given a decimal integer N (1 <= N <= 10^100) and M forbidden digit strings P_1, ..., P_M (total length <= 1500), count how many positive integers x in [1, N] contain NONE of the strings P_i as a contiguous substring in their decimal representation (without leading zeros), modulo 10^9 + 7.',
      constraints: '1 <= len(N) <= 100, 1 <= M <= 100, sum |P_i| <= 1500',
      sampleInput: '20 2\n13\n2',
      sampleOutput: '16',
      hints: [
        'Insert all forbidden patterns `P_i` into a 10-ary Trie (`0..9`), run BFS to construct complete Aho-Corasick automaton transitions `go[u][d]` and propagate terminal flags `bad[u] |= bad[fail[u]]`.',
        'Run iterative Digit DP over `(started, tight, state)`! Crucial edge case: when `!started && d == 0` (leading zero), `next_state` MUST stay at Aho-Corasick root `0` (`nstarted = 0`), NOT advance via `go[0][0]`! Subtract `1` at the end to exclude `0` itself.',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

static const long long MOD = 1000000007LL;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    string N;
    int m;
    if (!(cin >> N >> m)) return 0;

    vector<array<int, 10>> nxt(1);
    nxt[0].fill(0);
    vector<int> fail(1, 0);
    vector<bool> bad(1, false);

    for (int i = 0; i < m; i++) {
        string p;
        cin >> p;
        int cur = 0;
        for (char c : p) {
            int d = c - '0';
            if (nxt[cur][d] == 0) {
                nxt[cur][d] = (int)nxt.size();
                nxt.emplace_back();
                nxt.back().fill(0);
                fail.push_back(0);
                bad.push_back(false);
            }
            cur = nxt[cur][d];
        }
        bad[cur] = true;
    }

    // Build Aho-Corasick automaton failure links & complete DFA transitions
    queue<int> q;
    for (int d = 0; d < 10; d++) {
        if (nxt[0][d] != 0) q.push(nxt[0][d]);
    }
    while (!q.empty()) {
        int u = q.front();
        q.pop();
        if (bad[fail[u]]) bad[u] = true;
        for (int d = 0; d < 10; d++) {
            int v = nxt[u][d];
            if (v != 0) {
                fail[v] = nxt[fail[u]][d];
                q.push(v);
            } else {
                nxt[u][d] = nxt[fail[u]][d];
            }
        }
    }

    int S = (int)nxt.size();
    // dp[tight][started][state]
    vector<vector<long long>> dp00(2, vector<long long>(S, 0));
    vector<vector<long long>> dp01(2, vector<long long>(S, 0));
    dp00[1][0] = 1; // tight=1, started=0, state=0

    for (char ch : N) {
        int lim = ch - '0';
        vector<vector<long long>> ndp00(2, vector<long long>(S, 0));
        vector<vector<long long>> ndp01(2, vector<long long>(S, 0));

        for (int tight = 0; tight < 2; tight++) {
            int maxD = tight ? lim : 9;
            for (int u = 0; u < S; u++) {
                // Case 1: not started yet (only at u == 0)
                long long ways0 = dp00[tight][u];
                if (ways0) {
                    for (int d = 0; d <= maxD; d++) {
                        int nt = tight && (d == maxD);
                        if (d == 0) {
                            ndp00[nt][0] = (ndp00[nt][0] + ways0) % MOD;
                        } else {
                            int v = nxt[0][d];
                            if (!bad[v]) ndp01[nt][v] = (ndp01[nt][v] + ways0) % MOD;
                        }
                    }
                }
                // Case 2: already started
                long long ways1 = dp01[tight][u];
                if (ways1) {
                    for (int d = 0; d <= maxD; d++) {
                        int nt = tight && (d == maxD);
                        int v = nxt[u][d];
                        if (!bad[v]) ndp01[nt][v] = (ndp01[nt][v] + ways1) % MOD;
                    }
                }
            }
        }
        dp00.swap(ndp00);
        dp01.swap(ndp01);
    }

    long long ans = 0;
    for (int tight = 0; tight < 2; tight++) {
        for (int u = 0; u < S; u++) {
            ans = (ans + dp01[tight][u]) % MOD;
        }
    }
    cout << ans << "\\n";
    return 0;
}`,
        rust: `use std::collections::VecDeque;
use std::io::{self, Read};

const MOD: i64 = 1_000_000_007;

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let n_str = match it.next() {
        Some(v) => v.as_bytes(),
        None => return,
    };
    let m: usize = it.next().unwrap().parse().unwrap();

    let mut nxt = vec![[0usize; 10]];
    let mut fail = vec![0usize];
    let mut bad = vec![false];

    for _ in 0..m {
        let p = it.next().unwrap().as_bytes();
        let mut cur = 0usize;
        for &c in p {
            let d = (c - b'0') as usize;
            if nxt[cur][d] == 0 {
                nxt[cur][d] = nxt.len();
                nxt.push([0usize; 10]);
                fail.push(0);
                bad.push(false);
            }
            cur = nxt[cur][d];
        }
        bad[cur] = true;
    }

    let mut q = VecDeque::new();
    for d in 0..10 {
        if nxt[0][d] != 0 {
            q.push_back(nxt[0][d]);
        }
    }
    while let Some(u) = q.pop_front() {
        if bad[fail[u]] {
            bad[u] = true;
        }
        for d in 0..10 {
            let v = nxt[u][d];
            if v != 0 {
                fail[v] = nxt[fail[u]][d];
                q.push_back(v);
            } else {
                nxt[u][d] = nxt[fail[u]][d];
            }
        }
    }

    let s = nxt.len();
    let mut dp00 = vec![vec![0i64; s]; 2];
    let mut dp01 = vec![vec![0i64; s]; 2];
    dp00[1][0] = 1;

    for &ch in n_str {
        let lim = (ch - b'0') as usize;
        let mut ndp00 = vec![vec![0i64; s]; 2];
        let mut ndp01 = vec![vec![0i64; s]; 2];

        for tight in 0..2 {
            let max_d = if tight == 1 { lim } else { 9 };
            for u in 0..s {
                let w0 = dp00[tight][u];
                if w0 != 0 {
                    for d in 0..=max_d {
                        let nt = if tight == 1 && d == max_d { 1 } else { 0 };
                        if d == 0 {
                            ndp00[nt][0] = (ndp00[nt][0] + w0) % MOD;
                        } else {
                            let v = nxt[0][d];
                            if !bad[v] {
                                ndp01[nt][v] = (ndp01[nt][v] + w0) % MOD;
                            }
                        }
                    }
                }
                let w1 = dp01[tight][u];
                if w1 != 0 {
                    for d in 0..=max_d {
                        let nt = if tight == 1 && d == max_d { 1 } else { 0 };
                        let v = nxt[u][d];
                        if !bad[v] {
                            ndp01[nt][v] = (ndp01[nt][v] + w1) % MOD;
                        }
                    }
                }
            }
        }
        dp00 = ndp00;
        dp01 = ndp01;
    }

    let mut ans = 0i64;
    for tight in 0..2 {
        for u in 0..s {
            ans = (ans + dp01[tight][u]) % MOD;
        }
    }
    println!("{}", ans);
}`,
        java21: `import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.List;
import java.util.Queue;

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

    static final long MOD = 1_000_000_007L;

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        String N = fs.next();
        if (N == null) return;
        int m = Integer.parseInt(fs.next());

        List<int[]> nxt = new ArrayList<>();
        List<Integer> fail = new ArrayList<>();
        List<Boolean> bad = new ArrayList<>();
        nxt.add(new int[10]);
        fail.add(0);
        bad.add(false);

        for (int i = 0; i < m; i++) {
            String p = fs.next();
            int cur = 0;
            for (int j = 0; j < p.length(); j++) {
                int d = p.charAt(j) - '0';
                if (nxt.get(cur)[d] == 0) {
                    nxt.get(cur)[d] = nxt.size();
                    nxt.add(new int[10]);
                    fail.add(0);
                    bad.add(false);
                }
                cur = nxt.get(cur)[d];
            }
            bad.set(cur, true);
        }

        Queue<Integer> q = new ArrayDeque<>();
        for (int d = 0; d < 10; d++) {
            if (nxt.get(0)[d] != 0) q.add(nxt.get(0)[d]);
        }
        while (!q.isEmpty()) {
            int u = q.poll();
            if (bad.get(fail.get(u))) bad.set(u, true);
            for (int d = 0; d < 10; d++) {
                int v = nxt.get(u)[d];
                if (v != 0) {
                    fail.set(v, nxt.get(fail.get(u))[d]);
                    q.add(v);
                } else {
                    nxt.get(u)[d] = nxt.get(fail.get(u))[d];
                }
            }
        }

        int S = nxt.size();
        long[][] dp00 = new long[2][S];
        long[][] dp01 = new long[2][S];
        dp00[1][0] = 1;

        for (int i = 0; i < N.length(); i++) {
            int lim = N.charAt(i) - '0';
            long[][] ndp00 = new long[2][S];
            long[][] ndp01 = new long[2][S];
            for (int tight = 0; tight < 2; tight++) {
                int maxD = (tight == 1) ? lim : 9;
                for (int u = 0; u < S; u++) {
                    long w0 = dp00[tight][u];
                    if (w0 != 0) {
                        for (int d = 0; d <= maxD; d++) {
                            int nt = (tight == 1 && d == maxD) ? 1 : 0;
                            if (d == 0) {
                                ndp00[nt][0] = (ndp00[nt][0] + w0) % MOD;
                            } else {
                                int v = nxt.get(0)[d];
                                if (!bad.get(v)) ndp01[nt][v] = (ndp01[nt][v] + w0) % MOD;
                            }
                        }
                    }
                    long w1 = dp01[tight][u];
                    if (w1 != 0) {
                        for (int d = 0; d <= maxD; d++) {
                            int nt = (tight == 1 && d == maxD) ? 1 : 0;
                            int v = nxt.get(u)[d];
                            if (!bad.get(v)) ndp01[nt][v] = (ndp01[nt][v] + w1) % MOD;
                        }
                    }
                }
            }
            dp00 = ndp00;
            dp01 = ndp01;
        }

        long ans = 0;
        for (int tight = 0; tight < 2; tight++) {
            for (int u = 0; u < S; u++) ans = (ans + dp01[tight][u]) % MOD;
        }
        System.out.println(ans);
    }
}`,
        python3: `from collections import deque
import sys

sys.setrecursionlimit(200000)

MOD = 1_000_000_007

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    N = data[0]
    m = int(data[1])
    patterns = data[2 : 2 + m]

    nxt = [[0] * 10]
    fail = [0]
    bad = [False]

    for p in patterns:
        cur = 0
        for ch in p:
            d = ord(ch) - 48
            if nxt[cur][d] == 0:
                nxt[cur][d] = len(nxt)
                nxt.append([0] * 10)
                fail.append(0)
                bad.append(False)
            cur = nxt[cur][d]
        bad[cur] = True

    q = deque()
    for d in range(10):
        if nxt[0][d] != 0:
            q.append(nxt[0][d])
    while q:
        u = q.popleft()
        if bad[fail[u]]:
            bad[u] = True
        for d in range(10):
            v = nxt[u][d]
            if v != 0:
                fail[v] = nxt[fail[u]][d]
                q.append(v)
            else:
                nxt[u][d] = nxt[fail[u]][d]

    S = len(nxt)
    dp00 = [[0] * S for _ in range(2)]
    dp01 = [[0] * S for _ in range(2)]
    dp00[1][0] = 1

    for ch in N:
        lim = ord(ch) - 48
        ndp00 = [[0] * S for _ in range(2)]
        ndp01 = [[0] * S for _ in range(2)]
        for tight in (0, 1):
            max_d = lim if tight else 9
            for u in range(S):
                w0 = dp00[tight][u]
                if w0:
                    for d in range(max_d + 1):
                        nt = 1 if (tight and d == max_d) else 0
                        if d == 0:
                            ndp00[nt][0] = (ndp00[nt][0] + w0) % MOD
                        else:
                            v = nxt[0][d]
                            if not bad[v]:
                                ndp01[nt][v] = (ndp01[nt][v] + w0) % MOD
                w1 = dp01[tight][u]
                if w1:
                    row_u = nxt[u]
                    for d in range(max_d + 1):
                        nt = 1 if (tight and d == max_d) else 0
                        v = row_u[d]
                        if not bad[v]:
                            ndp01[nt][v] = (ndp01[nt][v] + w1) % MOD
        dp00, dp01 = ndp00, ndp01

    ans = (sum(dp01[0]) + sum(dp01[1])) % MOD
    print(ans)

if __name__ == "__main__":
    solve()`,
        ruby: `MOD = 1_000_000_007

tokens = $stdin.read.split
exit if tokens.empty?
n_str = tokens[0]
m = tokens[1].to_i
patterns = tokens[2, m]

nxt = [Array.new(10, 0)]
fail = [0]
bad = [false]

patterns.each do |p|
  cur = 0
  p.each_byte do |b|
    d = b - 48
    if nxt[cur][d] == 0
      nxt[cur][d] = nxt.length
      nxt << Array.new(10, 0)
      fail << 0
      bad << false
    end
    cur = nxt[cur][d]
  end
  bad[cur] = true
end

q = []
10.times { |d| q << nxt[0][d] if nxt[0][d] != 0 }
until q.empty?
  u = q.shift
  bad[u] = true if bad[fail[u]]
  10.times do |d|
    v = nxt[u][d]
    if v != 0
      fail[v] = nxt[fail[u]][d]
      q << v
    else
      nxt[u][d] = nxt[fail[u]][d]
    end
  end
end

s_cnt = nxt.length
dp00 = Array.new(2) { Array.new(s_cnt, 0) }
dp01 = Array.new(2) { Array.new(s_cnt, 0) }
dp00[1][0] = 1

n_str.each_byte do |b|
  lim = b - 48
  ndp00 = Array.new(2) { Array.new(s_cnt, 0) }
  ndp01 = Array.new(2) { Array.new(s_cnt, 0) }
  2.times do |tight|
    max_d = tight == 1 ? lim : 9
    s_cnt.times do |u|
      w0 = dp00[tight][u]
      if w0 != 0
        (0..max_d).each do |d|
          nt = (tight == 1 && d == max_d) ? 1 : 0
          if d == 0
            ndp00[nt][0] = (ndp00[nt][0] + w0) % MOD
          else
            v = nxt[0][d]
            ndp01[nt][v] = (ndp01[nt][v] + w0) % MOD unless bad[v]
          end
        end
      end
      w1 = dp01[tight][u]
      if w1 != 0
        (0..max_d).each do |d|
          nt = (tight == 1 && d == max_d) ? 1 : 0
          v = nxt[u][d]
          ndp01[nt][v] = (ndp01[nt][v] + w1) % MOD unless bad[v]
        end
      end
    end
  end
  dp00 = ndp00
  dp01 = ndp01
end

ans = (dp01[0].sum + dp01[1].sum) % MOD
puts ans`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'CSES',
      title: 'Counting Numbers',
      difficulty: 'Medium / DP',
      url: 'https://cses.fi/problemset/task/2220',
      patternNote: 'Canonical Digit DP requiring `started` / `leadingZero` handling so leading zeros never collide with zero digits.',
    },
    {
      platform: 'AtCoder',
      title: 'EDPC S - Digit Sum & ABC154 E',
      difficulty: '1400–1600',
      url: 'https://atcoder.jp/contests/dp/tasks/dp_s',
      patternNote: 'Direct `(pos, tight, rem_mod_D)` Digit DP up to `10^10000`.',
    },
    {
      platform: 'Codeforces',
      title: 'Magic Numbers & Classy Numbers (CF 628D / 1036C)',
      difficulty: '1700–1900',
      url: 'https://codeforces.com/problemset/problem/1036/C',
      patternNote: 'Track non-zero digit counts in `(pos, tight, nonzero_cnt)` across `[L, R]`.',
    },
    {
      platform: 'CodeChef',
      title: 'Digit DP & Sum Over Decimal Ranges',
      difficulty: 'Medium–Hard',
      url: 'https://www.codechef.com/problems/WORKCHEF',
      patternNote: 'Combine Digit DP with LCM bitmask tracking of used non-zero divisors.',
    },
    {
      platform: 'HackerRank',
      title: 'Lucifer Number / Digit Sum Divisibility',
      difficulty: 'Medium',
      url: 'https://www.hackerrank.com/challenges/prime-digit-sums/problem',
      patternNote: 'Rolling 4-digit suffix state transitions across huge upper bounds.',
    },
    {
      platform: 'NeetCode 150',
      title: 'Numbers At Most N Given Digit Set',
      difficulty: 'Hard (LeetCode 902)',
      url: 'https://leetcode.com/problems/numbers-at-most-n-given-digit-set/',
      patternNote: 'Restricted-alphabet Digit DP directly mirrorable with `(pos, tight, started)`.',
    },
  ],
  interviewNotes: [
    'In coding interviews, Digit DP appears whenever `N <= 10^9..10^18` and you must count numbers with digit constraints (e.g., LeetCode 233 Number of Digit One, LeetCode 902, LeetCode 2376).',
    'Always isolate `leadingZero` (`started`) as an explicit flag so you never confuse padding zeros with literal `0` digits in the number.',
    'Combining Digit DP with an Aho-Corasick DFA is a hallmark Grandmaster technique for multi-pattern constrained counting.',
  ],
  projectBlueprint: {
    title: 'Compliance & Pattern-Constrained Serial Number Generator',
    tagline: 'Count compliant ID space capacity and generate valid k-th serial keys avoiding blacklisted digit sequences in O(D * S).',
    stackSummary: 'C++20 Aho-Corasick Automaton, Digit-DP Space Counter, Order-Statistic Unranker',
    asciiDiagram: `
+------------------------------+      +------------------------------------+
| Blacklisted PIN/ID Patterns  | ---> | 10-ary Aho-Corasick Failure DFA    |
| ["000", "13", "666", ...]    |      | Flags bad[u] Across Suffix Links   |
+------------------------------+      +------------------------------------+
                                                       |
          +--------------------------------------------+
          v
+------------------------------------+     +-------------------------------+
| Digit DP Capacity Counter O(D * S) | --> | Exact Valid ID Count in [L,R] |
| + k-th Compliant Serial Unranker   |     | & Instant Policy Audit Report |
+------------------------------------+     +-------------------------------+`,
    milestones: [
      {
        id: 'm1',
        title: '1. Blacklist Pattern Aho-Corasick Compiler',
        detail: 'Compile arbitrary numeric blacklist patterns into a deterministic 10-transition automaton with failure-chain propagation.',
      },
      {
        id: 'm2',
        title: '2. Digit DP Capacity & Range Counter',
        detail: 'Count valid serial numbers in `[L, R]` of length up to 100 digits in milliseconds.',
      },
      {
        id: 'm3',
        title: '3. K-th Lexicographical Serial Key Unranker',
        detail: 'Walk the DP table greedily digit-by-digit (`0..9`) to materialize the exact `K`-th compliant serial ID without enumeration.',
      },
    ],
    starterCode: `// Compliance & Pattern-Constrained Serial Number Generator (Runnable C++20 Prototype)
#include <bits/stdc++.h>
using namespace std;

int main() {
    vector<string> blacklist = {"13", "666", "000"};
    vector<array<int, 10>> nxt(1);
    nxt[0].fill(0);
    vector<int> fail(1, 0);
    vector<bool> bad(1, false);

    for (const string& pat : blacklist) {
        int cur = 0;
        for (char c : pat) {
            int d = c - '0';
            if (!nxt[cur][d]) {
                nxt[cur][d] = (int)nxt.size();
                nxt.emplace_back();
                nxt.back().fill(0);
                fail.push_back(0);
                bad.push_back(false);
            }
            cur = nxt[cur][d];
        }
        bad[cur] = true;
    }

    queue<int> q;
    for (int d = 0; d < 10; d++) if (nxt[0][d]) q.push(nxt[0][d]);
    while (!q.empty()) {
        int u = q.front(); q.pop();
        if (bad[fail[u]]) bad[u] = true;
        for (int d = 0; d < 10; d++) {
            int v = nxt[u][d];
            if (v) { fail[v] = nxt[fail[u]][d]; q.push(v); }
            else nxt[u][d] = nxt[fail[u]][d];
        }
    }

    int len = 6, S = (int)nxt.size();
    vector<vector<long long>> ways(len + 1, vector<long long>(S, 0));
    for (int u = 0; u < S; u++) if (!bad[u]) ways[len][u] = 1;
    for (int pos = len - 1; pos >= 0; pos--) {
        for (int u = 0; u < S; u++) {
            if (bad[u]) continue;
            for (int d = 0; d < 10; d++) ways[pos][u] += ways[pos + 1][nxt[u][d]];
        }
    }

    cout << "Compliant 6-digit serial IDs: " << ways[0][0] << "\\n";
    long long k = 500000;
    string serial;
    int state = 0;
    for (int pos = 0; pos < len; pos++) {
        for (int d = 0; d < 10; d++) {
            int ns = nxt[state][d];
            long long cnt = bad[ns] ? 0 : ways[pos + 1][ns];
            if (k <= cnt) { serial.push_back(char('0' + d)); state = ns; break; }
            k -= cnt;
        }
    }
    cout << "500,000-th compliant serial ID: " << serial << "\\n";
    return 0;
}`,
  },
};
