import type { TheoryChapter } from '../../types/vault';

export const CH04_DP_KNAPSACK: TheoryChapter = {
  slug: 'knapsack-lis-classic-dp',
  topicId: 'dp-20',
  title: '1D/2D Dynamic Programming & Knapsack State Design',
  domain: 'Search, Greedy & DP',
  ratingTier: '1400–1600',
  usacoDivision: 'Gold',
  subtitle:
    'Design minimal sufficient DP states, compress O(N * W) 2D tables into 1D rolling arrays, and flip states when weights exceed 10^9.',
  analogyTitle: 'The Packing-Crate Blueprint Analogy',
  analogyBody:
    'Imagine packing valuable equipment into a cargo crate that holds at most 50 kg. Trying every combination of 40 items would take 2^40 (over a trillion) checks. Instead, ask a focused question: "For every capacity w from 0 up to 50 kg, what is the highest value I can achieve using only the first i items?" When you inspect item i+1, you only ever look back at row i—specifically at w and (w - weight[i+1]). By sweeping capacity w backwards from 50 down to weight[i+1], you do not even need a second sheet of paper: one single 1D row updates itself cleanly without ever double-counting an item.',
  prerequisites: [
    {
      slug: 'binary-search-on-answer',
      title: 'Binary Search on Answer & Two Pointers',
    },
  ],
  traceTitle: 'Interactive Trace: 0/1 Knapsack Rolling 1D Array (Backward Capacity Sweep)',
  traceSubtitle:
    'Items: (w=2, v=3), (w=3, v=4), (w=4, v=6) with Capacity W = 5. Watch dp[0..5] mutate right-to-left so each item is used at most once.',
  allowDynamicGraphEdit: false,
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Initialize dp[0..5] = 0',
      explanation:
        'With 0 items considered, every capacity w in 0..5 holds value 0. We will sweep w from W = 5 down to w_i for each item.',
      mode: 'array',
      arrays: [
        {
          name: 'DP Table dp[0..5]',
          cells: [
            { index: 0, value: 0, highlight: 'neutral' },
            { index: 1, value: 0, highlight: 'neutral' },
            { index: 2, value: 0, highlight: 'neutral' },
            { index: 3, value: 0, highlight: 'neutral' },
            { index: 4, value: 0, highlight: 'neutral' },
            { index: 5, value: 0, highlight: 'neutral' },
          ],
        },
      ],
      variables: { Item: 'Init', CapacityW: 5, SweepDir: '5 -> w_i' },
    },
    {
      stepNumber: 2,
      title: 'Process Item 1: (weight = 2, value = 3)',
      explanation:
        'For w = 5 down to 2: dp[w] = max(dp[w], dp[w - 2] + 3). Capacities 2..5 all update to 3 using Item 1 once.',
      mode: 'array',
      arrays: [
        {
          name: 'DP Table dp[0..5]',
          cells: [
            { index: 0, value: 0, highlight: 'neutral' },
            { index: 1, value: 0, highlight: 'neutral' },
            { index: 2, value: 3, label: 'new', highlight: 'updated' },
            { index: 3, value: 3, label: 'new', highlight: 'updated' },
            { index: 4, value: 3, label: 'new', highlight: 'updated' },
            { index: 5, value: 3, label: 'new', highlight: 'updated' },
          ],
        },
      ],
      variables: { Item1: '(w=2, v=3)', BestSoFar: 3 },
    },
    {
      stepNumber: 3,
      title: 'Process Item 2: (weight = 3, value = 4)',
      explanation:
        'Sweep w = 5 down to 3: dp[5] = max(3, dp[2] + 4) = 7! Notice dp[2] still holds 3 (Item 1) because we swept downward from 5 to 3.',
      mode: 'array',
      arrays: [
        {
          name: 'DP Table dp[0..5]',
          cells: [
            { index: 0, value: 0, highlight: 'neutral' },
            { index: 1, value: 0, highlight: 'neutral' },
            { index: 2, value: 3, label: 'dp[2]', highlight: 'window' },
            { index: 3, value: 4, label: '0+4', highlight: 'updated' },
            { index: 4, value: 4, label: '0+4', highlight: 'updated' },
            { index: 5, value: 7, label: '3+4', highlight: 'active' },
          ],
        },
      ],
      variables: { Item2: '(w=3, v=4)', 'dp[5]': 'dp[2] + 4 = 7' },
    },
    {
      stepNumber: 4,
      title: 'Process Item 3: (weight = 4, value = 6) -> Final Max = 7',
      explanation:
        'Sweep w = 5 down to 4: dp[4] improves from 4 to max(4, dp[0]+6) = 6. At w = 5: max(7, dp[1]+6) = max(7, 6) = 7. Optimal answer is dp[5] = 7.',
      mode: 'array',
      arrays: [
        {
          name: 'Final DP Table dp[0..5]',
          cells: [
            { index: 0, value: 0, highlight: 'neutral' },
            { index: 1, value: 0, highlight: 'neutral' },
            { index: 2, value: 3, highlight: 'neutral' },
            { index: 3, value: 4, highlight: 'neutral' },
            { index: 4, value: 6, label: 'updated', highlight: 'updated' },
            { index: 5, value: 7, label: 'OPT', highlight: 'active' },
          ],
        },
      ],
      variables: { Item3: '(w=4, v=6)', OptimalValue: 7, Selected: 'Item 1 + Item 2' },
    },
  ],
  reductionClues: [
    {
      clue: '"W <= 10^9, N <= 100, and item values v_i <= 1000" (AtCoder DP E)',
      translation:
        'Flip the DP axes! Instead of dp[weight] = max_value, compute dp[total_value] = min_weight <= W.',
    },
    {
      clue: '"Each item can be picked infinitely many times (Unbounded Knapsack)"',
      translation:
        'Flip the inner loop direction from backward (W -> w_i) to forward (w_i -> W).',
    },
    {
      clue: '"Minimum edits / LCS / grid paths between two sequences of length <= 5000"',
      translation:
        '2D prefix-prefix DP dp[i][j] comparing prefixes A[0..i-1] and B[0..j-1] with rolling 2-row compression.',
    },
    {
      clue: '"Bounded Knapsack with count c_i up to 10^5"',
      translation:
        'Binary-split c_i into powers of 2 (1, 2, 4, ..., remainder) to reduce O(N * W * C) down to O(N * W * log C).',
    },
  ],
  timeComplexity: 'O(N * W) for Knapsack, O(N * M) for 2D Edit Distance / LCS, O(N log N) for LIS',
  spaceComplexity: 'O(W) or O(M) with 1D rolling compression',
  pitfalls: [
    {
      type: 'WA',
      title: 'Sweeping 0/1 Knapsack Forward Instead of Backward',
      detail:
        'A forward loop w = w_i..W turns 0/1 Knapsack into Unbounded Knapsack, letting the same item be picked multiple times in one round.',
    },
    {
      type: 'WA',
      title: 'Using 32-bit int for Sum of Values > 2e9',
      detail:
        'In AtCoder DP D (N=100, v_i=10^9), max total value is 10^11—always store dp[] in 64-bit long long / i64.',
    },
    {
      type: 'TLE',
      title: 'Allocating Full 2D Vector<Vector<int>> Inside Tight Loops',
      detail:
        'When reconstructing an optimal path isn’t required, compress 2D DP to 1D or flat 1D arrays to keep memory inside L1/L2 cache.',
    },
  ],
  implementations: {
    cpp20: `#include <bits/stdc++.h>
using namespace std;

// AtCoder Educational DP Contest D (0/1 Knapsack) with 1D rolling array
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, W;
    if (!(cin >> n >> W)) return 0;

    vector<long long> dp(W + 1, 0);
    for (int i = 0; i < n; ++i) {
        int w;
        long long v;
        cin >> w >> v;
        for (int cap = W; cap >= w; --cap) {
            dp[cap] = max(dp[cap], dp[cap - w] + v);
        }
    }

    cout << dp[W] << '\\n';
    return 0;
}`,
    rust: `use std::io::{self, Read};

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let Some(n_str) = it.next() else { return; };
    let n: usize = n_str.parse().unwrap();
    let max_w: usize = it.next().unwrap().parse().unwrap();

    let mut dp = vec![0i64; max_w + 1];
    for _ in 0..n {
        let w: usize = it.next().unwrap().parse().unwrap();
        let v: i64 = it.next().unwrap().parse().unwrap();
        for cap in (w..=max_w).rev() {
            dp[cap] = dp[cap].max(dp[cap - w] + v);
        }
    }
    println!("{}", dp[max_w]);
}`,
    java21: `import java.io.*;

public class Main {
    static final class FastScanner {
        private final InputStream in;
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;
        FastScanner(InputStream is) { this.in = is; }
        private int readByte() throws IOException {
            if (ptr >= len) { len = in.read(buf); ptr = 0; if (len <= 0) return -1; }
            return buf[ptr++];
        }
        long nextLong() throws IOException {
            int c; while ((c = readByte()) <= ' ') if (c == -1) return 0;
            long sign = 1; if (c == '-') { sign = -1; c = readByte(); }
            long r = 0; while (c > ' ') { r = r * 10 + (c - '0'); c = readByte(); }
            return r * sign;
        }
        int nextInt() throws IOException { return (int) nextLong(); }
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        int n = fs.nextInt(), W = fs.nextInt();
        long[] dp = new long[W + 1];
        for (int i = 0; i < n; i++) {
            int w = fs.nextInt();
            long v = fs.nextLong();
            for (int cap = W; cap >= w; cap--) {
                dp[cap] = Math.max(dp[cap], dp[cap - w] + v);
            }
        }
        System.out.println(dp[W]);
    }
}`,
    python3: `import sys

def solve() -> None:
    data = list(map(int, sys.stdin.buffer.read().split()))
    if not data:
        return
    n, W = data[0], data[1]
    dp = [0] * (W + 1)
    idx = 2
    for _ in range(n):
        w, v = data[idx], data[idx + 1]
        idx += 2
        for cap in range(W, w - 1, -1):
            cand = dp[cap - w] + v
            if cand > dp[cap]:
                dp[cap] = cand
    print(dp[W])

if __name__ == "__main__":
    solve()`,
    ruby: `data = STDIN.read.split.map(&:to_i)
exit if data.empty?
n, max_w = data[0], data[1]
dp = Array.new(max_w + 1, 0)
idx = 2
n.times do
  w = data[idx]; v = data[idx + 1]
  idx += 2
  max_w.downto(w) do |cap|
    cand = dp[cap - w] + v
    dp[cap] = cand if cand > dp[cap]
  end
end
puts dp[max_w]`,
  },
  practiceProblems: [
    {
      id: 'ch04-warmup',
      tier: 'Warmup',
      ratingRange: '1000–1300',
      title: 'Frog Jump & K-Step Transition DP (AtCoder DP A/B)',
      statement:
        'There are N stones with heights h_1..h_N. A frog starts at stone 1 and can jump to i + 1, ..., i + K paying |h_i - h_j|. Find the minimum total cost to reach stone N.',
      constraints: '2 <= N <= 10^5, 1 <= K <= 100, 1 <= h_i <= 10^4',
      sampleInput: '5 3\n10 30 40 50 20',
      sampleOutput: '30',
      hints: [
        'Define dp[i] = minimum cost to reach stone i, initialized to INF except dp[0] = 0.',
        'Transition: dp[i] = min_{1 <= step <= K} (dp[i - step] + |h[i] - h[i - step]|).',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, k; cin >> n >> k;
    vector<long long> h(n), dp(n, 1e18);
    for (int i = 0; i < n; ++i) cin >> h[i];
    dp[0] = 0;
    for (int i = 1; i < n; ++i)
        for (int s = 1; s <= k && i - s >= 0; ++s)
            dp[i] = min(dp[i], dp[i - s] + llabs(h[i] - h[i - s]));
    cout << dp[n - 1] << '\\n';
}`,
        rust: `use std::io::{self, Read};
fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace().map(|x| x.parse::<i64>().unwrap());
    let n = it.next().unwrap() as usize;
    let k = it.next().unwrap() as usize;
    let h: Vec<i64> = it.take(n).collect();
    let mut dp = vec![i64::MAX / 2; n];
    dp[0] = 0;
    for i in 1..n {
        for step in 1..=k.min(i) {
            dp[i] = dp[i].min(dp[i - step] + (h[i] - h[i - step]).abs());
        }
    }
    println!("{}", dp[n - 1]);
}`,
        java21: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(), k = sc.nextInt();
        long[] h = new long[n], dp = new long[n];
        for (int i = 0; i < n; i++) h[i] = sc.nextLong();
        Arrays.fill(dp, Long.MAX_VALUE / 2); dp[0] = 0;
        for (int i = 1; i < n; i++)
            for (int s = 1; s <= k && i - s >= 0; s++)
                dp[i] = Math.min(dp[i], dp[i - s] + Math.abs(h[i] - h[i - s]));
        System.out.println(dp[n - 1]);
    }
}`,
        python3: `import sys
data = list(map(int, sys.stdin.buffer.read().split()))
n, k, h = data[0], data[1], data[2:]
dp = [10**18] * n
dp[0] = 0
for i in range(1, n):
    for s in range(1, min(k, i) + 1):
        dp[i] = min(dp[i], dp[i - s] + abs(h[i] - h[i - s]))
print(dp[-1])`,
        ruby: `data = STDIN.read.split.map(&:to_i)
n, k = data[0], data[1]; h = data[2, n]
dp = Array.new(n, 10**18); dp[0] = 0
(1...n).each do |i|
  (1..[k, i].min).each do |s|
    cand = dp[i - s] + (h[i] - h[i - s]).abs
    dp[i] = cand if cand < dp[i]
  end
end
puts dp[-1]`,
      },
    },
    {
      id: 'ch04-standard',
      tier: 'Standard',
      ratingRange: '1400–1700',
      title: '2D Levenshtein Edit Distance (CSES Edit Distance)',
      statement:
        'Given two strings S and T of lengths up to 5000, find the minimum number of single-character insertions, deletions, or replacements to transform S into T.',
      constraints: '1 <= |S|, |T| <= 5000, Time Limit: 1.0s',
      sampleInput: 'LOVE\nMOVIE',
      sampleOutput: '2',
      hints: [
        'Let dp[i][j] be the min edit distance between S[0..i-1] and T[0..j-1].',
        'If S[i-1] == T[j-1], dp[i][j] = dp[i-1][j-1]; else 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]).',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    string s, t; cin >> s >> t;
    int n = s.size(), m = t.size();
    vector<int> prev(m + 1), cur(m + 1);
    iota(prev.begin(), prev.end(), 0);
    for (int i = 1; i <= n; ++i) {
        cur[0] = i;
        for (int j = 1; j <= m; ++j) {
            if (s[i - 1] == t[j - 1]) cur[j] = prev[j - 1];
            else cur[j] = 1 + min({prev[j], cur[j - 1], prev[j - 1]});
        }
        swap(prev, cur);
    }
    cout << prev[m] << '\\n';
}`,
        rust: `use std::io::{self, Read};
fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let s = it.next().unwrap().as_bytes();
    let t = it.next().unwrap().as_bytes();
    let (n, m) = (s.len(), t.len());
    let mut prev: Vec<usize> = (0..=m).collect();
    let mut cur = vec![0usize; m + 1];
    for i in 1..=n {
        cur[0] = i;
        for j in 1..=m {
            cur[j] = if s[i - 1] == t[j - 1] { prev[j - 1] }
                     else { 1 + prev[j].min(cur[j - 1]).min(prev[j - 1]) };
        }
        std::mem::swap(&mut prev, &mut cur);
    }
    println!("{}", prev[m]);
}`,
        java21: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next(), t = sc.next();
        int n = s.length(), m = t.length();
        int[] prev = new int[m + 1], cur = new int[m + 1];
        for (int j = 0; j <= m; j++) prev[j] = j;
        for (int i = 1; i <= n; i++) {
            cur[0] = i;
            for (int j = 1; j <= m; j++) {
                if (s.charAt(i - 1) == t.charAt(j - 1)) cur[j] = prev[j - 1];
                else cur[j] = 1 + Math.min(prev[j], Math.min(cur[j - 1], prev[j - 1]));
            }
            int[] tmp = prev; prev = cur; cur = tmp;
        }
        System.out.println(prev[m]);
    }
}`,
        python3: `import sys
s, t = sys.stdin.read().split()
n, m = len(s), len(t)
prev = list(range(m + 1))
for i in range(1, n + 1):
    cur = [i] + [0] * m
    si = s[i - 1]
    for j in range(1, m + 1):
        if si == t[j - 1]: cur[j] = prev[j - 1]
        else: cur[j] = 1 + min(prev[j], cur[j - 1], prev[j - 1])
    prev = cur
print(prev[m])`,
        ruby: `s, t = STDIN.read.split
n = s.length; m = t.length
prev = (0..m).to_a
(1..n).each do |i|
  cur = Array.new(m + 1, 0); cur[0] = i
  (1..m).each do |j|
    cur[j] = s[i - 1] == t[j - 1] ? prev[j - 1] : 1 + [prev[j], cur[j - 1], prev[j - 1]].min
  end
  prev = cur
end
puts prev[m]`,
      },
    },
    {
      id: 'ch04-boss',
      tier: 'Boss',
      ratingRange: '1800–2200',
      title: 'Huge-Weight Value-Axis Knapsack (AtCoder DP E)',
      statement:
        'Given N <= 100 items with weights up to 10^9 and integer values v_i <= 1000, maximize total value without exceeding knapsack capacity W <= 10^9.',
      constraints: '1 <= N <= 100, 1 <= W <= 10^9, 1 <= v_i <= 1000',
      sampleInput: '3 8\n3 30\n4 50\n5 60',
      sampleOutput: '90',
      hints: [
        'Total value V_sum = sum(v_i) <= 10^5, whereas W = 10^9 is way too large to index.',
        'Invert the state: dp[val] = minimum weight required to achieve exact value val. Answer is max val with dp[val] <= W.',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n; long long W; cin >> n >> W;
    vector<int> w(n), v(n);
    int maxV = 0;
    for (int i = 0; i < n; ++i) { cin >> w[i] >> v[i]; maxV += v[i]; }
    vector<long long> dp(maxV + 1, 1e18);
    dp[0] = 0;
    for (int i = 0; i < n; ++i)
        for (int val = maxV; val >= v[i]; --val)
            dp[val] = min(dp[val], dp[val - v[i]] + w[i]);
    for (int val = maxV; val >= 0; --val) {
        if (dp[val] <= W) { cout << val << '\\n'; break; }
    }
}`,
        rust: `use std::io::{self, Read};
fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace().map(|x| x.parse::<i64>().unwrap());
    let n = it.next().unwrap() as usize;
    let max_w = it.next().unwrap();
    let mut items = Vec::with_capacity(n);
    let mut max_v = 0usize;
    for _ in 0..n {
        let w = it.next().unwrap();
        let v = it.next().unwrap() as usize;
        max_v += v;
        items.push((w, v));
    }
    let mut dp = vec![i64::MAX / 2; max_v + 1];
    dp[0] = 0;
    for &(w, v) in &items {
        for val in (v..=max_v).rev() {
            dp[val] = dp[val].min(dp[val - v] + w);
        }
    }
    let ans = (0..=max_v).rev().find(|&val| dp[val] <= max_w).unwrap_or(0);
    println!("{ans}");
}`,
        java21: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(); long W = sc.nextLong();
        long[] w = new long[n]; int[] v = new int[n]; int maxV = 0;
        for (int i = 0; i < n; i++) { w[i] = sc.nextLong(); v[i] = sc.nextInt(); maxV += v[i]; }
        long[] dp = new long[maxV + 1];
        Arrays.fill(dp, Long.MAX_VALUE / 2); dp[0] = 0;
        for (int i = 0; i < n; i++)
            for (int val = maxV; val >= v[i]; val--)
                dp[val] = Math.min(dp[val], dp[val - v[i]] + w[i]);
        for (int val = maxV; val >= 0; val--) if (dp[val] <= W) { System.out.println(val); break; }
    }
}`,
        python3: `import sys
data = list(map(int, sys.stdin.buffer.read().split()))
n, W = data[0], data[1]
items = [(data[2 + 2*i], data[3 + 2*i]) for i in range(n)]
maxV = sum(v for _, v in items)
dp = [10**18] * (maxV + 1)
dp[0] = 0
for w, v in items:
    for val in range(maxV, v - 1, -1):
        if dp[val - v] + w < dp[val]:
            dp[val] = dp[val - v] + w
print(next(val for val in range(maxV, -1, -1) if dp[val] <= W))`,
        ruby: `data = STDIN.read.split.map(&:to_i)
n, max_w = data[0], data[1]
items = Array.new(n) { |i| [data[2 + 2*i], data[3 + 2*i]] }
max_v = items.sum { |_, v| v }
dp = Array.new(max_v + 1, 10**18); dp[0] = 0
items.each do |w, v|
  max_v.downto(v) { |val| dp[val] = dp[val - v] + w if dp[val - v] + w < dp[val] }
end
puts max_v.downto(0).find { |val| dp[val] <= max_w }`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'AtCoder',
      title: 'Educational DP Contest Tasks A–F (Frog, Vacation, Knapsack 1/2, LCS)',
      difficulty: 'AtCoder 800–1600',
      url: 'https://atcoder.jp/contests/dp/tasks',
      patternNote: 'The gold-standard 26-problem DP training ladder.',
    },
    {
      platform: 'CSES',
      title: 'Coin Combinations I/II, Book Shop & Edit Distance',
      difficulty: 'Dynamic Programming',
      url: 'https://cses.fi/problemset/task/1639',
      patternNote: 'Ordered vs unordered coin transitions and 2D sequence alignment.',
    },
    {
      platform: 'Codeforces',
      title: 'Boredom (455A) & Two Substrings / Knapsack Variants',
      difficulty: 'CF 1500',
      url: 'https://codeforces.com/problemset?tags=dp',
      patternNote: 'Frequency-compressed linear DP and state transitions.',
    },
    {
      platform: 'CodeChef',
      title: 'FROGV / Knapsack & Subsequence DP',
      difficulty: 'CodeChef 3★',
      url: 'https://www.codechef.com/practice',
      patternNote: 'Rolling DP arrays under tight memory limits.',
    },
    {
      platform: 'HackerRank',
      title: 'The Coin Change Problem & Equal / Stock Maximize',
      difficulty: 'Medium',
      url: 'https://www.hackerrank.com/challenges/coin-change/problem',
      patternNote: 'Loop ordering determines combinations vs permutations.',
    },
    {
      platform: 'NeetCode 150',
      title: 'Partition Equal Subset Sum, Coin Change & Edit Distance',
      difficulty: 'FAANG Medium',
      url: 'https://leetcode.com/problemset/?search=Partition+Equal+Subset+Sum',
      patternNote: 'Core 1D/2D DP patterns tested across nearly all backend interviews.',
    },
  ],
  interviewNotes: [
    'Always start with the explicit state definition in plain English ("dp[i][c] = min cost using first i items with capacity c") before writing loops.',
    'Knowing when to swap the value and weight axes (AtCoder DP E) immediately signals senior algorithmic depth.',
  ],
  projectBlueprint: {
    title: 'Smart Cargo & Budget Allocation Optimizer',
    tagline:
      'Freight & ad-spend allocation microservice selecting optimal container shipments under strict weight/volume caps and exact item manifests.',
    stackSummary: 'TypeScript / Rust Solver + Parent Backtracking Reconstruction + Cost Breakdown',
    asciiDiagram: `┌────────────────────┐     ┌─────────────────────────┐     ┌─────────────────────────┐
│ Shipment Catalog   │────►│ 0/1 & Bounded DP Kernel │────►│ Manifest Backtracker    │
│ (weight, profit)   │     │ dp[w] = max profit      │     │ Trace selected item IDs │
└────────────────────┘     └─────────────────────────┘     └────────────┬────────────┘
                                                                        │
                                                                        ▼
                                                           ┌─────────────────────────┐
                                                           │ Optimal Manifest JSON   │
                                                           │ & Utilization %         │
                                                           └─────────────────────────┘`,
    milestones: [
      {
        id: 'ch04-m1',
        title: 'Milestone 1: Item & Capacity Constraint Schema',
        detail:
          'Define SKU items with integer weights, profit margins, and optional multiplicity counts.',
      },
      {
        id: 'ch04-m2',
        title: 'Milestone 2: Rolling 1D Knapsack Core',
        detail:
          'Compute maximum profit in O(N * W) time and O(W) memory for fast real-time budget sliders.',
      },
      {
        id: 'ch04-m3',
        title: 'Milestone 3: Bitset / Decision Reconstruction',
        detail:
          'Store compact choice flags or binary-split batches to emit the exact chosen SKU manifest.',
      },
      {
        id: 'ch04-m4',
        title: 'Milestone 4: Value-Axis Fallback for High Capacity',
        detail:
          'Switch automatically to value-axis DP whenever maxWeight > 10^6 and sum(profit) is small.',
      },
    ],
    starterCode: `export interface CargoItem {
  id: string;
  weight: number;
  value: number;
}

export function optimizeCargoManifest(
  items: CargoItem[],
  capacity: number,
): { maxValue: number; selectedIds: string[] } {
  const n = items.length;
  const dp = Array.from({ length: n + 1 }, () => new Float64Array(capacity + 1));

  for (let i = 1; i <= n; i++) {
    const { weight, value } = items[i - 1];
    for (let w = 0; w <= capacity; w++) {
      dp[i][w] = dp[i - 1][w];
      if (w >= weight) {
        dp[i][w] = Math.max(dp[i][w], dp[i - 1][w - weight] + value);
      }
    }
  }

  const selectedIds: string[] = [];
  let rem = capacity;
  for (let i = n; i >= 1; i--) {
    if (dp[i][rem] !== dp[i - 1][rem]) {
      selectedIds.push(items[i - 1].id);
      rem -= items[i - 1].weight;
    }
  }
  return { maxValue: dp[n][capacity], selectedIds: selectedIds.reverse() };
}`,
  },
};
