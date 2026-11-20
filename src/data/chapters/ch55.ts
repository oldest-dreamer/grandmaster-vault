import type { TheoryChapter } from '../../types/vault';

export const CH55_GREEDY_EXCHANGE_MATROID: TheoryChapter = {
  slug: 'exchange-arguments-greedy',
  topicId: 'dp-18',
  title: 'Greedy Exchange Arguments & Matroid Intuition',
  domain: 'Search, Greedy & DP',
  ratingTier: '1200–1400',
  usacoDivision: 'Silver',
  subtitle:
    'Prove why local greedy sorting beats exponential DP using adjacent pair swap inequalities (`a_i < a_j`, `w_i * t_j > w_j * t_i`, `a + b < b + a`), and upgrade irreversible greedy choices to provably optimal O(N log N) Regret Heaps.',
  analogyTitle: 'The Adjacent Bubble-Swap Microscope & Undoing Regret Tokens Analogy',
  analogyBody:
    'How do Grandmasters prove a greedy comparator isn’t a hallucination? Assume an optimal schedule `OPT` exists that disobeys our rule—then there MUST exist some adjacent inverted pair `(i, j)` right next to each other! Compute `Cost(i, j) - Cost(j, i)`: if `i` beats `j` under a transitive strict weak ordering (`a + b < b + a` or Smith’s `w_i * t_j > w_j * t_i`), swapping `(j, i)` into `(i, j)` NEVER worsens the objective while reducing inversions by 1, turning ANY optimal order into our greedy sort! Even when future choices invalidate a greedy pick (like selling a stock too early or taking an expensive deadline job), **Matroid Basis Augmentation / Regret Heaps** let us accept or tentatively pair elements now and swap out the worst committed choice later in `O(log N)` using a priority queue!',
  prerequisites: [],
  traceTitle: 'Interactive Exchange Swap Proof & Regret Min-Heap Trace',
  traceSubtitle:
    'Compare `Tasks and Deadlines` adjacent swap `(6, 10)` vs `(5, 12)` (`Reward(i,j) - Reward(j,i) = a_j - a_i = +1`), then trace `Buy Low Sell High` regret swaps on `[10, 5, 4, 7, 9, 12]`.',
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Step 1: Adjacent Exchange Proof on Tasks (6, 10) vs (5, 12)',
      explanation:
        'Suppose current prefix time is T. Order (i, j) gives reward (d_i - T - a_i) + (d_j - T - a_i - a_j). Swapping to (j, i) replaces term `- a_i` with `- a_j`! Since a_j = 5 < a_i = 6, putting shorter duration 5 BEFORE 6 strictly gains `6 - 5 = +1` regardless of deadlines!',
      mode: 'array',
      arrays: [
        {
          name: 'Tasks Sorted by Increasing Duration a_i (Shortest Processing Time First)',
          cells: [
            { index: 0, value: '(a=5, d=12)', label: 'finish=5, +7', highlight: 'active' },
            { index: 1, value: '(a=6, d=10)', label: 'finish=11, -1', highlight: 'window' },
            { index: 2, value: '(a=8, d=15)', label: 'finish=19, -4', highlight: 'updated' },
          ],
        },
      ],
      variables: { SwapDelta: '+1 (a_i - a_j)', DeadlinesRelevant: 'NO (Sum d_i is constant!)', TotalReward: 2 },
    },
    {
      stepNumber: 2,
      title: 'Step 2: Smith’s Rule & String Concatenation Strict Weak Ordering',
      explanation:
        'To minimize weighted completion time `sum w_i * C_i`, swapping adjacent `(i, j)` changes cost by `w_j * a_i - w_i * a_j`, giving exact integer cross-product comparator **`w_i * a_j > w_j * a_i`**! Similarly, two strings place `a` before `b` iff **`a + b < b + a`**!',
      mode: 'array',
      arrays: [
        {
          name: 'Concatenation Exchange Sorting on ["abba", "ab", "a", "b"]',
          cells: [
            { index: 0, value: '"a"', label: 'a+ab < ab+a', highlight: 'active' },
            { index: 1, value: '"ab"', label: 'ab+abba < abba+ab', highlight: 'window' },
            { index: 2, value: '"abba"', label: 'abba+b < b+abba', highlight: 'window' },
            { index: 3, value: '"b"', label: 'final: aababbab', highlight: 'updated' },
          ],
        },
      ],
      variables: { ComparatorType: 'Cross-Multiply / Concat', TransitivityVerified: 'YES' },
    },
    {
      stepNumber: 3,
      title: 'Step 3: Regret Min-Heap Undoes Early Stock Sale on `[10, 5, 4, 7, 9, 12]`',
      explanation:
        'At price `7`, pair with min-heap top `4` (+3) and push TWO `7`s (one buy option, one undo token!). At `12`, top is `7` < `12`: selling `4->12` instead of `4->7` adds `12 - 7 = +5` (net `+8`), smoothly canceling day 4’s sale via heap replacement!',
      mode: 'array',
      arrays: [
        {
          name: 'Regret Heap Progression Across Days 1..6',
          cells: [
            { index: 0, value: 'p=10 -> [10]', highlight: 'neutral' },
            { index: 1, value: 'p=5 -> [5,10]', highlight: 'neutral' },
            { index: 2, value: 'p=4 -> [4,5,10]', highlight: 'window' },
            { index: 3, value: 'p=7: +3, push 7,7', highlight: 'updated' },
            { index: 4, value: 'p=9: +4, push 9,9', highlight: 'updated' },
            { index: 5, value: 'p=12: +5 (undo 7!)', highlight: 'active' },
          ],
        },
      ],
      variables: { ProfitSoFar: 12, UndoneSaleAt: 7, Complexities: 'O(N log N)' },
    },
  ],
  reductionClues: [
    {
      clue: '"Reorder all N items to minimize completion penalty / string concatenation / damage taken"',
      translation:
        '**Adjacent Pair Exchange Argument**: assume `(i, j)` are adjacent, write `Cost(i, j) < Cost(j, i)`, simplify algebraically until variables depend strictly on `i` vs `j` (avoiding floating-point division via cross-multiplication)!',
    },
    {
      clue: '"Every feasible subset forms a downward-closed system where smaller sets can always augment from larger ones"',
      translation:
        '**Matroid Greedy Theorem**: sort elements by weight descending (or ascending) and greedily accept every element preserving independence (Kruskal MST, Scheduling Deadlines with Disjoint Set / Min-Heap)!',
    },
    {
      clue: '"Must pick decisions left-to-right (buy/sell stocks, drop tasks to stay <= deadline, hit HP >= 0), but later choices may dominate earlier ones"',
      translation:
        '**Regret Greedy (Priority Queue / Undo Tokens)**: accept greedy action tentatively and push its marginal penalty onto a heap; whenever a stronger future opportunity arrives (or constraint breaks), pop & swap in `O(log N)`!',
    },
    {
      clue: '"Minimize sum `w_i * C_i` or maximize `sum (d_i - C_i)` across arbitrary task orderings"',
      translation:
        'Notice `sum d_i` is constant for all permutations! Minimizing `sum C_i` reduces to **Shortest Processing Time First (`a_i < a_j`)**; weighted costs reduce to **Smith’s Rule (`w_i * a_j > w_j * a_i`)**.',
    },
  ],
  timeComplexity: 'O(N log N) sorting or priority-queue regret maintenance',
  spaceComplexity: 'O(N)',
  pitfalls: [
    {
      type: 'WA',
      title: 'Using `double` Ratios `(double)w / t` Instead of 64-Bit Cross Multiplication',
      detail:
        'Sorting by floating-point ratios `w_i / t_i` breaks transitivity or fails precision checks when `w, t <= 10^9`! Always compare using exact integer cross-products `(long long)w_i * t_j > (long long)w_j * t_i` (or `__int128` if products reach `10^{36}`).',
    },
    {
      type: 'WA',
      title: 'Non-Transitive / Strict-Weak-Ordering Violations (`<=` Instead of `<`)',
      detail:
        'In C++ `std::sort`, returning `true` when elements are equivalent (`a + b <= b + a` instead of `a + b < b + a`) causes **Undefined Behavior / segfaults** because a strict weak ordering MUST return `false` on `comp(x, x)`!',
    },
    {
      type: 'WA',
      title: 'Pushing Only ONE Copy of `p` in Buy Low Sell High (`CF 865D`)',
      detail:
        'When pairing today’s sell price `p` with a cheaper heap price `q < p`, you MUST push `p` **TWICE**: one copy serves as the regret token (allowing a later sell `r > p` to undo selling at `p` for net `+ (r - p)`), while the second copy represents buying an actual share on day `p`!',
    },
    {
      type: 'WA',
      title: 'Greedy Fails When Tasks Have Arbitrary Weights AND Arbitrary Deadlines Simultaneously',
      detail:
        'Unweighted deadline completion (`SPTF`) or unit-time weighted deadlines (`Matroid` with DSU/Min-Heap) are poly-time greedy. Arbitrary `(duration, deadline, weight)` (`1 || sum w_j U_j`) is **NP-hard** and requires DP over deadlines/weights instead!',
    },
  ],
  implementations: {
    cpp20: `#include <bits/stdc++.h>
using namespace std;

// Smith's Rule: Minimize weighted sum of completion times sum(w_i * C_i) via Exchange Argument
struct Job {
    long long duration, weight;
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    if (!(cin >> n)) return 0;
    vector<Job> jobs(n);
    for (int i = 0; i < n; i++) {
        cin >> jobs[i].duration >> jobs[i].weight;
    }

    // Exchange comparison: i before j iff w_i * d_j > w_j * d_i (strict weak ordering!)
    sort(jobs.begin(), jobs.end(), [](const Job& a, const Job& b) {
        return (__int128)a.weight * b.duration > (__int128)b.weight * a.duration;
    });

    long long elapsed = 0;
    long long totalWeightedCompletion = 0;
    for (const auto& jb : jobs) {
        elapsed += jb.duration;
        totalWeightedCompletion += jb.weight * elapsed;
    }
    cout << totalWeightedCompletion << "\\n";
    return 0;
}`,
    rust: `use std::io::{self, Read};

#[derive(Clone, Copy)]
struct Job {
    duration: i64,
    weight: i64,
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let n: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };

    let mut jobs = Vec::with_capacity(n);
    for _ in 0..n {
        let d: i64 = it.next().unwrap().parse().unwrap();
        let w: i64 = it.next().unwrap().parse().unwrap();
        jobs.push(Job { duration: d, weight: w });
    }

    // Strict weak ordering via 128-bit integer cross-product
    jobs.sort_unstable_by(|a, b| {
        let lhs = (b.weight as i128) * (a.duration as i128);
        let rhs = (a.weight as i128) * (b.duration as i128);
        lhs.cmp(&rhs)
    });

    let mut elapsed: i64 = 0;
    let mut total: i64 = 0;
    for jb in jobs {
        elapsed += jb.duration;
        total += jb.weight * elapsed;
    }
    println!("{}", total);
}`,
    java21: `import java.io.*;
import java.math.BigInteger;
import java.util.*;

public class Main {
    static class FastScanner {
        private final InputStream in;
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;

        FastScanner(InputStream is) { this.in = is; }

        private int readByte() throws IOException {
            if (ptr >= len) {
                ptr = 0;
                len = in.read(buf);
                if (len <= 0) return -1;
            }
            return buf[ptr++];
        }

        long nextLong() throws IOException {
            int c;
            do {
                c = readByte();
                if (c == -1) return Long.MIN_VALUE;
            } while (c <= ' ');
            long sign = 1;
            if (c == '-') { sign = -1; c = readByte(); }
            long res = 0;
            while (c > ' ') {
                res = res * 10 + (c - '0');
                c = readByte();
            }
            return res * sign;
        }
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        long nLong = fs.nextLong();
        if (nLong == Long.MIN_VALUE) return;
        int n = (int) nLong;

        long[][] jobs = new long[n][2];
        for (int i = 0; i < n; i++) {
            jobs[i][0] = fs.nextLong(); // duration
            jobs[i][1] = fs.nextLong(); // weight
        }

        Arrays.sort(jobs, (a, b) -> {
            BigInteger lhs = BigInteger.valueOf(b[1]).multiply(BigInteger.valueOf(a[0]));
            BigInteger rhs = BigInteger.valueOf(a[1]).multiply(BigInteger.valueOf(b[0]));
            return lhs.compareTo(rhs);
        });

        long elapsed = 0, total = 0;
        for (long[] jb : jobs) {
            elapsed += jb[0];
            total += jb[1] * elapsed;
        }
        System.out.println(total);
    }
}`,
    python3: `import sys
from functools import cmp_to_key

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    jobs = [(int(data[2 * i + 1]), int(data[2 * i + 2])) for i in range(n)]

    def cmp_jobs(a: tuple, b: tuple) -> int:
        # i before j iff w_i * d_j > w_j * d_i
        lhs = a[1] * b[0]
        rhs = b[1] * a[0]
        if lhs > rhs:
            return -1
        if lhs < rhs:
            return 1
        return 0

    jobs.sort(key=cmp_to_key(cmp_jobs))
    elapsed = 0
    total = 0
    for d, w in jobs:
        elapsed += d
        total += w * elapsed
    sys.stdout.write(f"{total}\\n")

if __name__ == "__main__":
    solve()`,
    ruby: `tokens = $stdin.read.split
exit if tokens.empty?
n = tokens[0].to_i

jobs = Array.new(n) { |i| [tokens[2 * i + 1].to_i, tokens[2 * i + 2].to_i] }
jobs.sort! { |a, b| (b[1] * a[0]) <=> (a[1] * b[0]) }

elapsed = 0
total = 0
jobs.each do |d, w|
  elapsed += d
  total += w * elapsed
end
puts total`,
  },
  practiceProblems: [
    {
      id: 'ch55-p1',
      tier: 'Warmup',
      ratingRange: '1100–1300',
      title: 'Tasks and Deadlines (SPTF Exchange Argument)',
      statement:
        'You have N tasks (`1 <= N <= 2 * 10^5`). Task `i` takes `a_i` time units and has deadline `d_i`. Completing task `i` at time `f_i` yields reward `d_i - f_i` (which may be negative). Maximize total reward across any task ordering.',
      constraints: '1 <= N <= 2 * 10^5, 1 <= a_i, d_i <= 10^6',
      sampleInput: `3
6 10
8 15
5 12`,
      sampleOutput: `2`,
      hints: [
        'Total reward equals `sum(d_i) - sum(f_i)`, so deadlines `d_i` contribute identically regardless of permutation!',
        'Swapping two adjacent tasks `(i, j)` into `(j, i)` reduces `f_i + f_j` iff `a_j < a_i`.',
        'Sort all tasks purely by increasing duration `a_i` and accumulate running completion times in 64-bit integers.',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    if (!(cin >> n)) return 0;
    vector<pair<long long, long long>> tasks(n);
    for (int i = 0; i < n; i++) cin >> tasks[i].first >> tasks[i].second;

    sort(tasks.begin(), tasks.end(), [](const auto& a, const auto& b) {
        return a.first < b.first;
    });

    long long cur = 0, reward = 0;
    for (const auto& [a, d] : tasks) {
        cur += a;
        reward += d - cur;
    }
    cout << reward << "\\n";
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

    let mut tasks = Vec::with_capacity(n);
    for _ in 0..n {
        let a: i64 = it.next().unwrap().parse().unwrap();
        let d: i64 = it.next().unwrap().parse().unwrap();
        tasks.push((a, d));
    }
    tasks.sort_unstable_by_key(|t| t.0);

    let mut cur: i64 = 0;
    let mut reward: i64 = 0;
    for (a, d) in tasks {
        cur += a;
        reward += d - cur;
    }
    println!("{}", reward);
}`,
        java21: `import java.io.*;
import java.util.*;

public class Main {
    static class FastScanner {
        private final InputStream in;
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;

        FastScanner(InputStream is) { this.in = is; }

        private int readByte() throws IOException {
            if (ptr >= len) {
                ptr = 0;
                len = in.read(buf);
                if (len <= 0) return -1;
            }
            return buf[ptr++];
        }

        long nextLong() throws IOException {
            int c;
            do {
                c = readByte();
                if (c == -1) return Long.MIN_VALUE;
            } while (c <= ' ');
            long sign = 1;
            if (c == '-') { sign = -1; c = readByte(); }
            long res = 0;
            while (c > ' ') {
                res = res * 10 + (c - '0');
                c = readByte();
            }
            return res * sign;
        }
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        long nLong = fs.nextLong();
        if (nLong == Long.MIN_VALUE) return;
        int n = (int) nLong;

        long[][] tasks = new long[n][2];
        for (int i = 0; i < n; i++) {
            tasks[i][0] = fs.nextLong();
            tasks[i][1] = fs.nextLong();
        }
        Arrays.sort(tasks, Comparator.comparingLong(t -> t[0]));

        long cur = 0, reward = 0;
        for (long[] t : tasks) {
            cur += t[0];
            reward += t[1] - cur;
        }
        System.out.println(reward);
    }
}`,
        python3: `import sys

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    tasks = [(int(data[2 * i + 1]), int(data[2 * i + 2])) for i in range(n)]
    tasks.sort(key=lambda t: t[0])

    cur = 0
    reward = 0
    for a, d in tasks:
        cur += a
        reward += d - cur
    sys.stdout.write(f"{reward}\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
n = tokens[0].to_i

tasks = Array.new(n) { |i| [tokens[2 * i + 1].to_i, tokens[2 * i + 2].to_i] }
tasks.sort_by! { |t| t[0] }

cur = 0
reward = 0
tasks.each do |a, d|
  cur += a
  reward += d - cur
end
puts reward`,
      },
    },
    {
      id: 'ch55-p2',
      tier: 'Standard',
      ratingRange: '1300–1500',
      title: 'Smallest Lexicographic String Concatenation (a + b < b + a)',
      statement:
        'Given N non-empty lowercase strings (`1 <= N <= 5 * 10^4`, total character length `<= 5 * 10^4`), concatenate all N strings in any permutation to form the lexicographically smallest resulting string.',
      constraints: '1 <= N <= 5 * 10^4, sum |s_i| <= 5 * 10^4',
      sampleInput: `4
abba
ab
a
b`,
      sampleOutput: `aababbab`,
      hints: [
        'Plain alphabetical sorting fails (`"b"` vs `"ba"` -> `"bab"` < `"bba"`, even though `"b" < "ba"`!).',
        'By adjacent exchange, string `x` precedes adjacent string `y` iff `x + y < y + x` (which holds identically under base-26 arithmetic, guaranteeing transitivity).',
        'Ensure your comparator returns strict inequality (`<` rather than `<=`) to preserve strict weak ordering.',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    if (!(cin >> n)) return 0;
    vector<string> s(n);
    for (int i = 0; i < n; i++) cin >> s[i];

    sort(s.begin(), s.end(), [](const string& a, const string& b) {
        return a + b < b + a;
    });

    string ans;
    for (const auto& w : s) ans += w;
    cout << ans << "\\n";
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

    let mut words: Vec<String> = Vec::with_capacity(n);
    for _ in 0..n {
        words.push(it.next().unwrap().to_string());
    }

    words.sort_unstable_by(|a, b| {
        a.bytes().chain(b.bytes()).cmp(b.bytes().chain(a.bytes()))
    });

    let mut out = String::new();
    for w in &words {
        out.push_str(w);
    }
    println!("{}", out);
}`,
        java21: `import java.io.*;
import java.util.*;

public class Main {
    static class FastScanner {
        private final InputStream in;
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;

        FastScanner(InputStream is) { this.in = is; }

        private int readByte() throws IOException {
            if (ptr >= len) {
                ptr = 0;
                len = in.read(buf);
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
        FastScanner fs = new FastScanner(System.in);
        String first = fs.next();
        if (first == null) return;
        int n = Integer.parseInt(first);

        String[] words = new String[n];
        for (int i = 0; i < n; i++) words[i] = fs.next();

        Arrays.sort(words, (a, b) -> (a + b).compareTo(b + a));

        StringBuilder out = new StringBuilder();
        for (String w : words) out.append(w);
        System.out.println(out.toString());
    }
}`,
        python3: `import sys
from functools import cmp_to_key

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    words = data[1:1 + n]

    def cmp_str(a: str, b: str) -> int:
        ab = a + b
        ba = b + a
        if ab < ba:
            return -1
        if ab > ba:
            return 1
        return 0

    words.sort(key=cmp_to_key(cmp_str))
    sys.stdout.write("".join(words) + "\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
n = tokens[0].to_i
words = tokens[1, n]
words.sort! { |a, b| (a + b) <=> (b + a) }
puts words.join`,
      },
    },
    {
      id: 'ch55-p3',
      tier: 'Boss',
      ratingRange: '2000–2200',
      title: 'Buy Low Sell High (Regret Greedy with Min-Heap)',
      statement:
        'You know the stock price `p_i` for the next N days (`1 <= N <= 3 * 10^5`). On each day, you may perform at most ONE action: buy 1 share at `p_i`, sell 1 currently held share at `p_i`, or do nothing. Starting with 0 shares, maximize total profit in `O(N log N)`.',
      constraints: '1 <= N <= 3 * 10^5, 1 <= p_i <= 10^6',
      sampleInput: `9
10 5 4 7 9 12 6 2 10`,
      sampleOutput: `20`,
      hints: [
        'Maintain a min-heap of active buy opportunities and regret-undo tokens.',
        'For each price `p`: if the heap is non-empty and `heap.top() < p`, add `p - heap.top()` to profit, pop `heap.top()`, and push `p` onto the heap (to permit later undoing the sell at `p` in favor of a higher future price!).',
        'Regardless of whether a trade happened, push `p` onto the heap again to represent the valid option of buying 1 fresh share on day `i` (so trades push `p` TWICE!).',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    if (!(cin >> n)) return 0;

    priority_queue<long long, vector<long long>, greater<long long>> pq;
    long long profit = 0;
    for (int i = 0; i < n; i++) {
        long long p;
        cin >> p;
        if (!pq.empty() && pq.top() < p) {
            profit += p - pq.top();
            pq.pop();
            pq.push(p); // regret token: undo previous sell if higher price appears later
        }
        pq.push(p);     // fresh option to buy 1 share at price p
    }
    cout << profit << "\\n";
    return 0;
}`,
        rust: `use std::cmp::Reverse;
use std::collections::BinaryHeap;
use std::io::{self, Read};

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let n: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };

    let mut heap: BinaryHeap<Reverse<i64>> = BinaryHeap::with_capacity(n);
    let mut profit: i64 = 0;
    for _ in 0..n {
        let p: i64 = it.next().unwrap().parse().unwrap();
        if let Some(&Reverse(low)) = heap.peek() {
            if low < p {
                profit += p - low;
                heap.pop();
                heap.push(Reverse(p));
            }
        }
        heap.push(Reverse(p));
    }
    println!("{}", profit);
}`,
        java21: `import java.io.*;
import java.util.*;

public class Main {
    static class FastScanner {
        private final InputStream in;
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;

        FastScanner(InputStream is) { this.in = is; }

        private int readByte() throws IOException {
            if (ptr >= len) {
                ptr = 0;
                len = in.read(buf);
                if (len <= 0) return -1;
            }
            return buf[ptr++];
        }

        long nextLong() throws IOException {
            int c;
            do {
                c = readByte();
                if (c == -1) return Long.MIN_VALUE;
            } while (c <= ' ');
            long sign = 1;
            if (c == '-') { sign = -1; c = readByte(); }
            long res = 0;
            while (c > ' ') {
                res = res * 10 + (c - '0');
                c = readByte();
            }
            return res * sign;
        }
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        long nLong = fs.nextLong();
        if (nLong == Long.MIN_VALUE) return;
        int n = (int) nLong;

        PriorityQueue<Long> pq = new PriorityQueue<>();
        long profit = 0;
        for (int i = 0; i < n; i++) {
            long p = fs.nextLong();
            if (!pq.isEmpty() && pq.peek() < p) {
                profit += p - pq.poll();
                pq.offer(p);
            }
            pq.offer(p);
        }
        System.out.println(profit);
    }
}`,
        python3: `import heapq
import sys

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    heap = []
    profit = 0
    for i in range(1, n + 1):
        p = int(data[i])
        if heap and heap[0] < p:
            profit += p - heapq.heappop(heap)
            heapq.heappush(heap, p)
        heapq.heappush(heap, p)
    sys.stdout.write(f"{profit}\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `# Compact binary min-heap for O(N log N) Regret Greedy
class MinHeap
  def initialize; @a = []; end
  def empty?; @a.empty?; end
  def peek; @a[0]; end

  def push(x)
    @a << x
    i = @a.length - 1
    while i > 0
      p = (i - 1) >> 1
      break if @a[p] <= @a[i]
      @a[p], @a[i] = @a[i], @a[p]
      i = p
    end
  end

  def pop
    top = @a[0]
    last = @a.pop
    unless @a.empty?
      @a[0] = last
      i = 0
      n = @a.length
      loop do
        l = 2 * i + 1; r = l + 1; best = i
        best = l if l < n && @a[l] < @a[best]
        best = r if r < n && @a[r] < @a[best]
        break if best == i
        @a[i], @a[best] = @a[best], @a[i]
        i = best
      end
    end
    top
  end
end

tokens = $stdin.read.split
exit if tokens.empty?
n = tokens[0].to_i

heap = MinHeap.new
profit = 0
(1..n).each do |i|
  p = tokens[i].to_i
  if !heap.empty? && heap.peek < p
    profit += p - heap.pop
    heap.push(p)
  end
  heap.push(p)
end
puts profit`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'CSES',
      title: 'Tasks and Deadlines (1630)',
      difficulty: 'Silver',
      url: 'https://cses.fi/problemset/task/1630',
      patternNote: 'Direct application of Shortest Processing Time First proved via adjacent swap.',
    },
    {
      platform: 'Codeforces',
      title: 'Buy Low Sell High (865D) & The Smallest String Concatenation (632C)',
      difficulty: '1600–2400',
      url: 'https://codeforces.com/problemset/problem/865/D',
      patternNote: 'Benchmarks covering both a+b < b+a exchange comparators and regret min-heaps.',
    },
    {
      platform: 'AtCoder',
      title: 'ABC — Weighted Scheduling & Exchange Inequalities',
      difficulty: '1400',
      url: 'https://atcoder.jp',
      patternNote: 'Cross-product ratio sorting avoiding floating-point instability.',
    },
    {
      platform: 'CodeChef',
      title: 'Ciel and Tomya / Job Sequencing with Deadlines',
      difficulty: '1500',
      url: 'https://www.codechef.com',
      patternNote: 'Matroid basis greedy augmentation with priority queues or DSU slots.',
    },
    {
      platform: 'HackerRank',
      title: 'Chief Hopper / Scheduling Orders',
      difficulty: 'Medium',
      url: 'https://www.hackerrank.com/challenges',
      patternNote: 'Prove order optimality by algebraically canceling invariant terms across adjacent pairs.',
    },
    {
      platform: 'NeetCode 150',
      title: 'Course Schedule III (630) & Largest Number (179)',
      difficulty: 'Medium–Hard',
      url: 'https://leetcode.com/problems/course-schedule-iii/',
      patternNote: 'Course Schedule III is classic Regret Max-Heap; Largest Number is exact exchange ordering.',
    },
  ],
  interviewNotes: [
    'Whenever asked to prove a greedy sorting rule in an interview, assume an inverted adjacent pair `(i, j)` exists in OPT, write `Cost(i, j) - Cost(j, i)`, and show it is non-positive under the comparator.',
    'Why must a string concatenation comparator check `a + b < b + a` strictly instead of comparing character prefixes one by one? Compare `"3"` and `"30"`: prefix check gets confused at the end, whereas `"3" + "30" = "330" > "303" = "30" + "3"` decides in one transitive predicate.',
    'Why does pushing two copies of `p` in Buy Low Sell High maintain exact legality? One popped `p` cancels an earlier sell `(q -> p)` into `(q -> r)` (making day `p` a no-op), while the remaining `p` allows buying a fresh share on day `p`.',
  ],
  projectBlueprint: {
    title: 'CPU Task Scheduler & Cloud Job Priority Dispatcher',
    tagline:
      'Production-ready job queue dispatcher minimizing SLA-weighted latency via Smith’s exchange rule and dynamically replacing lower-priority deadlines via regret heaps.',
    stackSummary: 'TypeScript Exchange Comparator & Binary Min-Heap Engine',
    asciiDiagram: `[Incoming Cloud Jobs (duration, weight, deadline)]
         |
         +--> [Smith Cross-Product Sort: w_i * d_j > w_j * d_i] --> [Optimal Dispatch Queue]
         |
         +--> [Unit/Deadline Overflow? Regret Heap Evicts Max Duration] --> [Max Throughput]`,
    milestones: [
      {
        id: 'm1',
        title: 'Overflow-Safe BigInt Exchange Comparator',
        detail: 'Compare job priority ratios via exact BigInt cross-multiplication.',
      },
      {
        id: 'm2',
        title: 'SLA Weighted Completion Simulator',
        detail: 'Compute cumulative completion times and aggregate SLA penalty metrics.',
      },
      {
        id: 'm3',
        title: 'Priority-Queue Deadline Regret Module',
        detail: 'Evict the longest queued task when deadline budget overflows, maximizing total completed jobs.',
      },
    ],
    starterCode: `export interface CloudJob {
  id: string;
  duration: bigint;
  weight: bigint;
}

export function scheduleOptimalSmith(jobs: CloudJob[]): { order: string[]; weightedCompletion: bigint } {
  const sorted = [...jobs].sort((a, b) => {
    const lhs = b.weight * a.duration;
    const rhs = a.weight * b.duration;
    return lhs < rhs ? -1 : lhs > rhs ? 1 : 0;
  });

  let elapsed = 0n;
  let total = 0n;
  const order: string[] = [];
  for (const job of sorted) {
    elapsed += job.duration;
    total += job.weight * elapsed;
    order.push(job.id);
  }
  return { order, weightedCompletion: total };
}

console.log(scheduleOptimalSmith([
  { id: 'auth-sync', duration: 5n, weight: 10n },
  { id: 'video-transcode', duration: 10n, weight: 3n },
  { id: 'billing-webhook', duration: 2n, weight: 8n },
]));`,
  },
};
