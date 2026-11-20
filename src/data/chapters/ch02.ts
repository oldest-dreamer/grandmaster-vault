import type { TheoryChapter } from '../../types/vault';

export const CH02_BINARY_SEARCH: TheoryChapter = {
  slug: 'binary-search-on-answer',
  topicId: 'dp-17',
  title: 'Binary Search on Answer & Two Pointers',
  domain: 'Search, Greedy & DP',
  ratingTier: '1200–1400',
  usacoDivision: 'Silver',
  subtitle:
    'Convert optimization problems ("minimize the maximum" or "maximize the minimum") into monotonic O(N) feasibility checks searched over [lo, hi] in O(log V).',
  analogyTitle: 'The Thermostat Guessing Game Analogy',
  analogyBody:
    'Imagine you are managing a bakery trying to fulfill 100 orders before noon, and you want to know the minimum number of ovens needed. Solving directly for the exact optimal oven count feels tangled. Instead, ask a much easier yes/no question: "If I rent T = 10 ovens, can we finish all orders by noon?" Checking a fixed T is a simple linear simulation. And notice the monotonicity: if 10 ovens succeed, 11 ovens also succeed; if 5 ovens fail, 4 ovens also fail. Binary Search on Answer cuts the candidate range in half 30 to 60 times until it pinpoints the exact boundary between NO and YES.',
  prerequisites: [
    {
      slug: 'prefix-sums-difference-arrays',
      title: 'Prefix Sums, Difference Arrays & Invariants',
    },
  ],
  traceTitle: 'Interactive Trace: Binary Search on Max Subarray Partition Sum (Array Division)',
  traceSubtitle:
    'Partition A = [2, 4, 7, 3, 5] into at most K = 3 contiguous subarrays while minimizing the maximum subarray sum. Watch [lo, hi] converge.',
  allowDynamicGraphEdit: false,
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Initialize Search Bounds [lo = max(A), hi = sum(A)]',
      explanation:
        'No subarray sum can be smaller than the largest single element (7), and K = 1 gives sum(A) = 21. Set lo = 7, hi = 21.',
      mode: 'array',
      arrays: [
        {
          name: 'Input Array A[0..4]',
          cells: [
            { index: 0, value: 2, highlight: 'neutral' },
            { index: 1, value: 4, highlight: 'neutral' },
            { index: 2, value: 7, label: 'max=7', highlight: 'updated' },
            { index: 3, value: 3, highlight: 'neutral' },
            { index: 4, value: 5, highlight: 'neutral' },
          ],
        },
        {
          name: 'Search Interval',
          cells: [
            { index: 0, value: 7, label: 'lo', highlight: 'active' },
            { index: 1, value: 14, label: 'mid', highlight: 'window' },
            { index: 2, value: 21, label: 'hi', highlight: 'neutral' },
          ],
        },
      ],
      variables: { K_limit: 3, lo: 7, mid: 14, hi: 21, Feasible: 'Testing 14' },
    },
    {
      stepNumber: 2,
      title: 'Test mid = 14 -> Greedy Partition Takes 2 Groups (PASS)',
      explanation:
        'Greedily pack elements left-to-right without exceeding 14: [2, 4, 7] (sum=13) and [3, 5] (sum=8). Needed 2 <= 3 groups! Record ans = 14 and tighten hi = 13.',
      mode: 'array',
      arrays: [
        {
          name: 'Greedy Check (cap = 14)',
          cells: [
            { index: 0, value: 2, label: 'Grp 1', highlight: 'active' },
            { index: 1, value: 4, label: 'Grp 1', highlight: 'active' },
            { index: 2, value: 7, label: 'sum=13', highlight: 'active' },
            { index: 3, value: 3, label: 'Grp 2', highlight: 'window' },
            { index: 4, value: 5, label: 'sum=8', highlight: 'window' },
          ],
        },
        {
          name: 'Search Interval',
          cells: [
            { index: 0, value: 7, label: 'lo', highlight: 'neutral' },
            { index: 1, value: 10, label: 'next mid', highlight: 'window' },
            { index: 2, value: 13, label: 'hi', highlight: 'updated' },
          ],
        },
      ],
      variables: { GroupsUsed: 2, BestAns: 14, NextRange: '[7, 13]' },
    },
    {
      stepNumber: 3,
      title: 'Test mid = 10 -> Greedy Partition Takes 3 Groups (PASS)',
      explanation:
        'With cap = 10: [2, 4] (6), [7, 3] (10), [5] (5). Needed 3 <= 3 groups! Record ans = 10 and tighten hi = 9.',
      mode: 'array',
      arrays: [
        {
          name: 'Greedy Check (cap = 10)',
          cells: [
            { index: 0, value: 2, label: 'Grp 1', highlight: 'active' },
            { index: 1, value: 4, label: 'sum=6', highlight: 'active' },
            { index: 2, value: 7, label: 'Grp 2', highlight: 'window' },
            { index: 3, value: 3, label: 'sum=10', highlight: 'window' },
            { index: 4, value: 5, label: 'Grp 3', highlight: 'updated' },
          ],
        },
        {
          name: 'Search Interval',
          cells: [
            { index: 0, value: 7, label: 'lo', highlight: 'neutral' },
            { index: 1, value: 8, label: 'next mid', highlight: 'window' },
            { index: 2, value: 9, label: 'hi', highlight: 'updated' },
          ],
        },
      ],
      variables: { GroupsUsed: 3, BestAns: 10, NextRange: '[7, 9]' },
    },
    {
      stepNumber: 4,
      title: 'Test mid = 8 -> Requires 4 Groups (FAIL)',
      explanation:
        'With cap = 8: [2, 4] (6), [7] (7), [3, 5] (8) -> wait: 3+5 = 8! Wait: [2,4]=6, [7]=7, [3,5]=8 uses 3 groups! Let us verify: 2+4=6, +7=13>8 so split; 7+3=10>8 so split; 3+5=8 <= 8 -> 3 groups! So cap = 8 PASSES! Then next step tests mid = 7: [2,4]=6, [7]=7, [3]=3, [5]=5 -> 4 groups (FAIL), converging cleanly to Optimal = 8.',
      mode: 'array',
      arrays: [
        {
          name: 'Optimal Cap = 8 (3 Groups)',
          cells: [
            { index: 0, value: 2, label: 'Grp 1', highlight: 'active' },
            { index: 1, value: 4, label: 'sum=6', highlight: 'active' },
            { index: 2, value: 7, label: 'Grp 2', highlight: 'window' },
            { index: 3, value: 3, label: 'Grp 3', highlight: 'updated' },
            { index: 4, value: 5, label: 'sum=8', highlight: 'updated' },
          ],
        },
        {
          name: 'Converged Answer',
          cells: [
            { index: 0, value: 7, label: 'fail', highlight: 'neutral' },
            { index: 1, value: 8, label: 'OPT', highlight: 'active' },
          ],
        },
      ],
      variables: { TestCap8: '3 groups (PASS)', TestCap7: '4 groups (FAIL)', Answer: 8 },
    },
  ],
  reductionClues: [
    {
      clue: '"Minimize the maximum..." or "Maximize the minimum..."',
      translation:
        'Classic Binary Search on Answer signature. Fix candidate X and check feasibility greedily in O(N).',
    },
    {
      clue: '"Find the K-th smallest pair sum / median / average >= X"',
      translation:
        'Binary search the value X and count how many pairs/subarrays satisfy <= X using Two Pointers or Prefix Sums.',
    },
    {
      clue: '"Subarray with sum <= S and all A[i] >= 0" (longest/count)',
      translation:
        'Non-negative elements guarantee monotonicity as R advances, so L never moves backward -> O(N) Two Pointers.',
    },
    {
      clue: '"Maximize sum(a_i) / sum(b_i) >= X"',
      translation:
        'Fractional Binary Search: rewrite as sum(a_i - X * b_i) >= 0 and test feasibility with greedy top-K or DP.',
    },
  ],
  timeComplexity: 'O(N log(hi - lo)) for Binary Search on Answer; O(N) for Two Pointers',
  spaceComplexity: 'O(1) auxiliary space beyond input array',
  pitfalls: [
    {
      type: 'WA',
      title: 'Overflow Inside mid = (lo + hi) / 2 or Feasibility Sum',
      detail:
        'When hi <= 10^18 (e.g., Factory Machines), summing mid / t_i across N = 2e5 machines can exceed 2^63 - 1! Always stop accumulating inside ok(mid) as soon as count >= target.',
    },
    {
      type: 'TLE',
      title: 'Infinite Loop From Wrong Mid Rounding',
      detail:
        'If updating lo = mid (finding maximum valid X), use mid = lo + (hi - lo + 1) / 2. If updating hi = mid (finding minimum valid X), use mid = lo + (hi - lo) / 2.',
    },
    {
      type: 'WA',
      title: 'Applying Two Pointers on Arrays With Negative Numbers',
      detail:
        'Advancing R with negative elements can shrink the sum, breaking monotonicity. Use Prefix Sums + Map or Monotonic Deque instead.',
    },
  ],
  implementations: {
    cpp20: `#include <bits/stdc++.h>
using namespace std;

// CSES Array Division + Two Pointers template:
// Partition N positive integers into <= K subarrays minimizing the max subarray sum.
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, k;
    if (!(cin >> n >> k)) return 0;

    vector<long long> a(n);
    long long lo = 0, hi = 0;
    for (int i = 0; i < n; ++i) {
        cin >> a[i];
        lo = max(lo, a[i]);
        hi += a[i];
    }

    auto can_split = [&](long long max_sum) -> bool {
        int groups = 1;
        long long cur = 0;
        for (long long x : a) {
            if (cur + x > max_sum) {
                ++groups;
                cur = x;
                if (groups > k) return false;
            } else {
                cur += x;
            }
        }
        return true;
    };

    long long ans = hi;
    while (lo <= hi) {
        long long mid = lo + (hi - lo) / 2;
        if (can_split(mid)) {
            ans = mid;
            hi = mid - 1;
        } else {
            lo = mid + 1;
        }
    }
    cout << ans << '\\n';
    return 0;
}`,
    rust: `use std::io::{self, Read};

fn can_split(a: &[i64], k: usize, max_sum: i64) -> bool {
    let mut groups = 1usize;
    let mut cur = 0i64;
    for &x in a {
        if cur + x > max_sum {
            groups += 1;
            cur = x;
            if groups > k {
                return false;
            }
        } else {
            cur += x;
        }
    }
    true
}

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let Some(n_str) = it.next() else { return; };
    let n: usize = n_str.parse().unwrap();
    let k: usize = it.next().unwrap().parse().unwrap();

    let mut a = Vec::with_capacity(n);
    let (mut lo, mut hi) = (0i64, 0i64);
    for _ in 0..n {
        let x: i64 = it.next().unwrap().parse().unwrap();
        lo = lo.max(x);
        hi += x;
        a.push(x);
    }

    let mut ans = hi;
    while lo <= hi {
        let mid = lo + (hi - lo) / 2;
        if can_split(&a, k, mid) {
            ans = mid;
            hi = mid - 1;
        } else {
            lo = mid + 1;
        }
    }
    println!("{ans}");
}`,
    java21: `import java.io.*;

public class Main {
    static final class FastScanner {
        private final InputStream in;
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;
        FastScanner(InputStream is) { this.in = is; }
        private int readByte() throws IOException {
            if (ptr >= len) {
                len = in.read(buf);
                ptr = 0;
                if (len <= 0) return -1;
            }
            return buf[ptr++];
        }
        long nextLong() throws IOException {
            int c;
            while ((c = readByte()) <= ' ') if (c == -1) return 0;
            long sign = 1;
            if (c == '-') { sign = -1; c = readByte(); }
            long res = 0;
            while (c > ' ') { res = res * 10 + (c - '0'); c = readByte(); }
            return res * sign;
        }
        int nextInt() throws IOException { return (int) nextLong(); }
    }

    static boolean canSplit(long[] a, int k, long cap) {
        int groups = 1;
        long cur = 0;
        for (long x : a) {
            if (cur + x > cap) {
                groups++;
                cur = x;
                if (groups > k) return false;
            } else {
                cur += x;
            }
        }
        return true;
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        int n = fs.nextInt(), k = fs.nextInt();
        long[] a = new long[n];
        long lo = 0, hi = 0;
        for (int i = 0; i < n; i++) {
            a[i] = fs.nextLong();
            lo = Math.max(lo, a[i]);
            hi += a[i];
        }
        long ans = hi;
        while (lo <= hi) {
            long mid = lo + (hi - lo) / 2;
            if (canSplit(a, k, mid)) {
                ans = mid;
                hi = mid - 1;
            } else {
                lo = mid + 1;
            }
        }
        System.out.println(ans);
    }
}`,
    python3: `import sys

def solve() -> None:
    data = list(map(int, sys.stdin.buffer.read().split()))
    if not data:
        return
    n, k = data[0], data[1]
    a = data[2:2 + n]

    def can_split(cap: int) -> bool:
        groups = 1
        cur = 0
        for x in a:
            if cur + x > cap:
                groups += 1
                cur = x
                if groups > k:
                    return False
            else:
                cur += x
        return True

    lo, hi = max(a), sum(a)
    ans = hi
    while lo <= hi:
        mid = (lo + hi) // 2
        if can_split(mid):
            ans = mid
            hi = mid - 1
        else:
            lo = mid + 1
    print(ans)

if __name__ == "__main__":
    solve()`,
    ruby: `data = STDIN.read.split.map(&:to_i)
exit if data.empty?
n, k = data[0], data[1]
a = data[2, n]

can_split = lambda do |cap|
  groups = 1
  cur = 0
  a.each do |x|
    if cur + x > cap
      groups += 1
      cur = x
      return false if groups > k
    else
      cur += x
    end
  end
  true
end

lo = a.max
hi = a.sum
ans = hi
while lo <= hi
  mid = (lo + hi) / 2
  if can_split.call(mid)
    ans = mid
    hi = mid - 1
  else
    lo = mid + 1
  end
end
puts ans`,
  },
  practiceProblems: [
    {
      id: 'ch02-warmup',
      tier: 'Warmup',
      ratingRange: '1000–1300',
      title: 'Koko-Style Parallel Machine Production (Factory Machines)',
      statement:
        'There are N machines; machine i makes one product in k_i seconds. All machines work simultaneously. Find the minimum total seconds needed to produce at least T products.',
      constraints: '1 <= N <= 2 * 10^5, 1 <= T <= 10^9, 1 <= k_i <= 10^9',
      sampleInput: '3 7\n3 2 5',
      sampleOutput: '8',
      hints: [
        'In X seconds, machine i makes floor(X / k_i) products.',
        'Binary search X in [1, T * min(k_i)] and break early inside the sum loop once total >= T to avoid 64-bit overflow.',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n; long long t; cin >> n >> t;
    vector<long long> k(n);
    long long mn = LLONG_MAX;
    for (int i = 0; i < n; ++i) { cin >> k[i]; mn = min(mn, k[i]); }
    long long lo = 1, hi = mn * t, ans = hi;
    while (lo <= hi) {
        long long mid = lo + (hi - lo) / 2, made = 0;
        for (long long x : k) {
            made += mid / x;
            if (made >= t) break;
        }
        if (made >= t) { ans = mid; hi = mid - 1; }
        else lo = mid + 1;
    }
    cout << ans << '\\n';
}`,
        rust: `use std::io::{self, Read};
fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace().map(|x| x.parse::<i64>().unwrap());
    let n = it.next().unwrap() as usize;
    let t = it.next().unwrap();
    let k: Vec<i64> = it.take(n).collect();
    let mn = *k.iter().min().unwrap();
    let (mut lo, mut hi, mut ans) = (1i64, mn * t, mn * t);
    while lo <= hi {
        let mid = lo + (hi - lo) / 2;
        let mut made = 0i64;
        for &x in &k {
            made += mid / x;
            if made >= t { break; }
        }
        if made >= t { ans = mid; hi = mid - 1; } else { lo = mid + 1; }
    }
    println!("{ans}");
}`,
        java21: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(); long t = sc.nextLong();
        long[] k = new long[n]; long mn = Long.MAX_VALUE;
        for (int i = 0; i < n; i++) { k[i] = sc.nextLong(); mn = Math.min(mn, k[i]); }
        long lo = 1, hi = mn * t, ans = hi;
        while (lo <= hi) {
            long mid = lo + (hi - lo) / 2, made = 0;
            for (long x : k) { made += mid / x; if (made >= t) break; }
            if (made >= t) { ans = mid; hi = mid - 1; } else lo = mid + 1;
        }
        System.out.println(ans);
    }
}`,
        python3: `import sys
data = list(map(int, sys.stdin.buffer.read().split()))
n, t, k = data[0], data[1], data[2:]
lo, hi = 1, min(k) * t
ans = hi
while lo <= hi:
    mid = (lo + hi) // 2
    made = 0
    for x in k:
        made += mid // x
        if made >= t: break
    if made >= t: ans = mid; hi = mid - 1
    else: lo = mid + 1
print(ans)`,
        ruby: `data = STDIN.read.split.map(&:to_i)
n, t = data[0], data[1]; k = data[2, n]
lo = 1; hi = k.min * t; ans = hi
while lo <= hi
  mid = (lo + hi) / 2
  made = 0
  k.each { |x| made += mid / x; break if made >= t }
  if made >= t then ans = mid; hi = mid - 1 else lo = mid + 1 end
end
puts ans`,
      },
    },
    {
      id: 'ch02-standard',
      tier: 'Standard',
      ratingRange: '1400–1700',
      title: 'USACO Silver Cow Dance / Aggressive Cows Placement',
      statement:
        'Given N sorted stall coordinates x_1 < x_2 < ... < x_N and C cows, place the C cows in stalls to maximize the minimum distance between any two cows.',
      constraints: '2 <= C <= N <= 2 * 10^5, 0 <= x_i <= 10^9',
      sampleInput: '5 3\n1 2 8 4 9',
      sampleOutput: '3',
      hints: [
        'Sort x[]. Binary search the minimum gap D in [1, x[N-1] - x[0]].',
        'Greedily place the first cow at x[0], and each next cow at the earliest stall >= last + D.',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, c; cin >> n >> c;
    vector<long long> x(n);
    for (int i = 0; i < n; ++i) cin >> x[i];
    sort(x.begin(), x.end());
    long long lo = 1, hi = x.back() - x.front(), ans = 0;
    while (lo <= hi) {
        long long mid = lo + (hi - lo) / 2;
        int placed = 1; long long last = x[0];
        for (int i = 1; i < n; ++i) {
            if (x[i] - last >= mid) { placed++; last = x[i]; }
        }
        if (placed >= c) { ans = mid; lo = mid + 1; }
        else hi = mid - 1;
    }
    cout << ans << '\\n';
}`,
        rust: `use std::io::{self, Read};
fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace().map(|v| v.parse::<i64>().unwrap());
    let n = it.next().unwrap() as usize;
    let c = it.next().unwrap();
    let mut x: Vec<i64> = it.take(n).collect();
    x.sort_unstable();
    let (mut lo, mut hi, mut ans) = (1i64, x[n - 1] - x[0], 0i64);
    while lo <= hi {
        let mid = lo + (hi - lo) / 2;
        let (mut placed, mut last) = (1i64, x[0]);
        for &pos in &x[1..] {
            if pos - last >= mid { placed += 1; last = pos; }
        }
        if placed >= c { ans = mid; lo = mid + 1; } else { hi = mid - 1; }
    }
    println!("{ans}");
}`,
        java21: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(), c = sc.nextInt();
        long[] x = new long[n];
        for (int i = 0; i < n; i++) x[i] = sc.nextLong();
        Arrays.sort(x);
        long lo = 1, hi = x[n - 1] - x[0], ans = 0;
        while (lo <= hi) {
            long mid = lo + (hi - lo) / 2, last = x[0];
            int placed = 1;
            for (int i = 1; i < n; i++) if (x[i] - last >= mid) { placed++; last = x[i]; }
            if (placed >= c) { ans = mid; lo = mid + 1; } else hi = mid - 1;
        }
        System.out.println(ans);
    }
}`,
        python3: `import sys
data = list(map(int, sys.stdin.buffer.read().split()))
n, c = data[0], data[1]
x = sorted(data[2:2 + n])
lo, hi, ans = 1, x[-1] - x[0], 0
while lo <= hi:
    mid = (lo + hi) // 2
    placed, last = 1, x[0]
    for pos in x[1:]:
        if pos - last >= mid:
            placed += 1
            last = pos
    if placed >= c: ans = mid; lo = mid + 1
    else: hi = mid - 1
print(ans)`,
        ruby: `data = STDIN.read.split.map(&:to_i)
n, c = data[0], data[1]
x = data[2, n].sort
lo = 1; hi = x[-1] - x[0]; ans = 0
while lo <= hi
  mid = (lo + hi) / 2
  placed = 1; last = x[0]
  x[1..].each { |pos| if pos - last >= mid then placed += 1; last = pos end }
  if placed >= c then ans = mid; lo = mid + 1 else hi = mid - 1 end
end
puts ans`,
      },
    },
    {
      id: 'ch02-boss',
      tier: 'Boss',
      ratingRange: '2000–2400',
      title: 'Maximum Average Subarray of Length >= L (Fractional Binary Search)',
      statement:
        'Given an array A of N integers and an integer L (1 <= L <= N), find the maximum possible arithmetic mean of any contiguous subarray of length at least L, accurate to 10^-6.',
      constraints: '1 <= L <= N <= 2 * 10^5, -10^6 <= A[i] <= 10^6',
      sampleInput: '6 3\n1 12 -5 -6 50 3',
      sampleOutput: '12.750000',
      hints: [
        'Binary search the average X over 70 iterations. Subtract X from every element: B[i] = A[i] - X.',
        'A subarray of length >= L has mean >= X iff some prefix sum P_B[i] - min_{0 <= j <= i-L} P_B[j] >= 0.',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, L; cin >> n >> L;
    vector<double> a(n);
    for (int i = 0; i < n; ++i) cin >> a[i];
    double lo = -1e6, hi = 1e6;
    for (int it = 0; it < 70; ++it) {
        double mid = 0.5 * (lo + hi);
        vector<double> p(n + 1, 0.0);
        for (int i = 0; i < n; ++i) p[i + 1] = p[i] + (a[i] - mid);
        double min_pref = 0.0;
        bool ok = false;
        for (int i = L; i <= n; ++i) {
            min_pref = min(min_pref, p[i - L]);
            if (p[i] - min_pref >= 0.0) { ok = true; break; }
        }
        if (ok) lo = mid; else hi = mid;
    }
    cout << fixed << setprecision(6) << lo << '\\n';
}`,
        rust: `use std::io::{self, Read};
fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let n: usize = it.next().unwrap().parse().unwrap();
    let l: usize = it.next().unwrap().parse().unwrap();
    let a: Vec<f64> = it.take(n).map(|x| x.parse().unwrap()).collect();
    let (mut lo, mut hi) = (-1e6f64, 1e6f64);
    for _ in 0..70 {
        let mid = 0.5 * (lo + hi);
        let mut p = vec![0.0f64; n + 1];
        for i in 0..n { p[i + 1] = p[i] + a[i] - mid; }
        let (mut min_p, mut ok) = (0.0f64, false);
        for i in l..=n {
            min_p = min_p.min(p[i - l]);
            if p[i] - min_p >= 0.0 { ok = true; break; }
        }
        if ok { lo = mid; } else { hi = mid; }
    }
    println!("{:.6}", lo);
}`,
        java21: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(), L = sc.nextInt();
        double[] a = new double[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextDouble();
        double lo = -1e6, hi = 1e6;
        for (int it = 0; it < 70; it++) {
            double mid = 0.5 * (lo + hi);
            double[] p = new double[n + 1];
            for (int i = 0; i < n; i++) p[i + 1] = p[i] + a[i] - mid;
            double minP = 0; boolean ok = false;
            for (int i = L; i <= n; i++) {
                minP = Math.min(minP, p[i - L]);
                if (p[i] - minP >= 0) { ok = true; break; }
            }
            if (ok) lo = mid; else hi = mid;
        }
        System.out.printf(Locale.US, "%.6f%n", lo);
    }
}`,
        python3: `import sys
data = sys.stdin.buffer.read().split()
n, L = int(data[0]), int(data[1])
a = [float(x) for x in data[2:2 + n]]
lo, hi = -1e6, 1e6
for _ in range(70):
    mid = 0.5 * (lo + hi)
    p = [0.0] * (n + 1)
    for i, x in enumerate(a):
        p[i + 1] = p[i] + x - mid
    min_p, ok = 0.0, False
    for i in range(L, n + 1):
        if p[i - L] < min_p:
            min_p = p[i - L]
        if p[i] - min_p >= 0.0:
            ok = True
            break
    if ok: lo = mid
    else: hi = mid
print(f"{lo:.6f}")`,
        ruby: `data = STDIN.read.split
n = data[0].to_i; l = data[1].to_i
a = data[2, n].map(&:to_f)
lo = -1e6; hi = 1e6
70.times do
  mid = 0.5 * (lo + hi)
  p = Array.new(n + 1, 0.0)
  n.times { |i| p[i + 1] = p[i] + a[i] - mid }
  min_p = 0.0; ok = false
  (l..n).each do |i|
    min_p = p[i - l] if p[i - l] < min_p
    if p[i] - min_p >= 0.0
      ok = true; break
    end
  end
  if ok then lo = mid else hi = mid end
end
printf("%.6f\n", lo)`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'CSES',
      title: 'Factory Machines & Array Division',
      difficulty: 'Sorting & Searching',
      url: 'https://cses.fi/problemset/task/1620',
      patternNote: 'Canonical monotonic feasibility search with 64-bit bounds.',
    },
    {
      platform: 'AtCoder',
      title: 'ABC 144 E - Gluttony & ABC 203 D - Pond',
      difficulty: 'AtCoder 1200–1600',
      url: 'https://atcoder.jp/search?f.Task=binary+search',
      patternNote: 'Binary search combined with 2D prefix sums or sorting.',
    },
    {
      platform: 'Codeforces',
      title: 'Cellular Network (702C) & Maximum Median (1201C)',
      difficulty: 'CF 1400–1600',
      url: 'https://codeforces.com/problemset?tags=binary+search,two+pointers',
      patternNote: 'Two pointers coverage and monotonic median lifting.',
    },
    {
      platform: 'CodeChef',
      title: 'STACKS / SNACKDOWN Binary Search on Answer',
      difficulty: 'CodeChef 3★',
      url: 'https://www.codechef.com/practice',
      patternNote: 'Greedy array partitioning under capacity caps.',
    },
    {
      platform: 'HackerRank',
      title: 'Minimum Time Required & Hackerland Radio Transmitters',
      difficulty: 'Medium Prep',
      url: 'https://www.hackerrank.com/challenges/minimum-time-required/problem',
      patternNote: 'Direct equivalent of Factory Machines.',
    },
    {
      platform: 'NeetCode 150',
      title: 'Koko Eating Bananas & Split Array Largest Sum',
      difficulty: 'FAANG Medium / Hard',
      url: 'https://leetcode.com/problemset/?search=Koko+Eating+Bananas',
      patternNote: 'Most frequent binary-search-on-answer interview pattern.',
    },
  ],
  interviewNotes: [
    'Whenever an interviewer asks "Split Array Largest Sum" or "Capacity to Ship Packages Within D Days", state the monotonic predicate explicitly before coding.',
    'Highlight why setting lo = max(weights) and hi = sum(weights) prevents infeasible midpoints and guarantees O(N log(sum)) time.',
  ],
  projectBlueprint: {
    title: 'Cloud Server Load Balancer Capacity Planner',
    tagline:
      'Autoscaling simulator that calculates the exact minimum CPU/GPU cluster capacity needed to drain queued microservices jobs within SLA deadlines.',
    stackSummary: 'TypeScript Simulation Core + SLA Feasibility Verifier + Cluster Telemetry',
    asciiDiagram: `┌────────────────────┐     ┌─────────────────────────┐     ┌─────────────────────────┐
│ Job Latency Queue  │────►│ Binary Search Solver    │────►│ Greedy Partition Check  │
│ [j_1, j_2, ..., j_n│     │ lo = max(j), hi = sum(j)│     │ fits <= K worker shards │
└────────────────────┘     └─────────────────────────┘     └────────────┬────────────┘
                                                                        │
                                                                        ▼
                                                           ┌─────────────────────────┐
                                                           │ Minimum Provisioned SLA │
                                                           │ Core Count & Cost Plan  │
                                                           └─────────────────────────┘`,
    milestones: [
      {
        id: 'ch02-m1',
        title: 'Milestone 1: Workload Queue & Shard Affinity Model',
        detail:
          'Represent ordered tenant batch jobs with deterministic runtime estimates and shard-contiguity constraints.',
      },
      {
        id: 'ch02-m2',
        title: 'Milestone 2: O(N) Greedy SLA Feasibility Checker',
        detail:
          'Verify whether K homogeneous worker nodes can finish all jobs within a candidate latency budget T.',
      },
      {
        id: 'ch02-m3',
        title: 'Milestone 3: Monotonic Binary Search Capacity Solver',
        detail:
          'Search over [max(job), sum(jobs)] to compute the exact lowest SLA-compliant node capacity.',
      },
      {
        id: 'ch02-m4',
        title: 'Milestone 4: Sliding-Window Burst Detector',
        detail:
          'Add a Two-Pointer sliding window pass to flag consecutive request bursts violating rate limits.',
      },
    ],
    starterCode: `export interface CapacityPlan {
  minShardBudget: number;
  shardsUsed: number;
  assignments: number[][];
}

export function planMinimumShardCapacity(
  jobDurationsMs: number[],
  maxShards: number,
): CapacityPlan {
  if (jobDurationsMs.length === 0) {
    return { minShardBudget: 0, shardsUsed: 0, assignments: [] };
  }
  let lo = Math.max(...jobDurationsMs);
  let hi = jobDurationsMs.reduce((acc, v) => acc + v, 0);
  let best = hi;

  const canFit = (cap: number): boolean => {
    let shards = 1;
    let cur = 0;
    for (const d of jobDurationsMs) {
      if (cur + d > cap) {
        shards += 1;
        cur = d;
        if (shards > maxShards) return false;
      } else {
        cur += d;
      }
    }
    return true;
  };

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (canFit(mid)) {
      best = mid;
      hi = mid - 1;
    } else {
      lo = mid + 1;
    }
  }

  const assignments: number[][] = [[]];
  let cur = 0;
  for (const d of jobDurationsMs) {
    if (cur + d > best) {
      assignments.push([d]);
      cur = d;
    } else {
      assignments[assignments.length - 1].push(d);
      cur += d;
    }
  }
  return { minShardBudget: best, shardsUsed: assignments.length, assignments };
}`,
  },
};
