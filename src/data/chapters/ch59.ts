import type { TheoryChapter } from '../../types/vault';

export const CH59_TWO_POINTERS_SLIDING_WINDOW: TheoryChapter = {
  slug: 'two-pointers-sliding-window',
  topicId: 'dp-16',
  title: 'Two Pointers & Variable Sliding Window',
  domain: 'Search, Greedy & DP',
  ratingTier: '800–1100',
  usacoDivision: 'Bronze',
  subtitle:
    'Turn quadratic O(N^2) subarray searches into strictly linear O(N) scans by exploiting monotonicity invariants on non-negative arrays and sliding frequency maps (`l` and `r` advance at most N times each).',
  analogyTitle: 'The Expanding-and-Contracting Caterpillar Window Analogy',
  analogyBody:
    'Imagine an inchworm crawling across a row of positive numbers. Whenever the worm’s total weight is below target `X`, its **right head `r` creeps forward** to swallow more elements (`sum += a[r++]`). The instant its sum exceeds `X` (or distinct element count exceeds `K`), adding more positive elements can NEVER shrink the window back down—so its **left tail `l` contracts forward** (`sum -= a[l++]`) until the invariant holds again! Because neither `l` nor `r` ever steps backward, the worm makes **at most `2N` elementary moves in total**, dropping `O(N^2)` nested loops directly down to rock-solid `O(N)`!',
  prerequisites: [
    {
      slug: 'prefix-sums-difference-arrays',
      title: 'Prefix Sums, Difference Arrays & Invariants',
    },
  ],
  traceTitle: 'Interactive Caterpillar Window Expansion & Contraction Trace',
  traceSubtitle:
    'Count contiguous subarrays summing to `X = 7` on positive array `[2, 4, 1, 2, 7]` by monotonically advancing `l` and `r` in `O(N)`.',
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Step 1: Expand Right Pointer Until Window Hits Sum = 7',
      explanation:
        'Start l = 0, sum = 0. Advance r: add 2 (sum=2), add 4 (sum=6), add 1 (sum=7). Window [0..2] matches target X = 7! Match count becomes 1.',
      mode: 'array',
      arrays: [
        {
          name: 'Window [l=0..r=2] on [2, 4, 1, 2, 7]',
          cells: [
            { index: 0, value: 2, label: 'L=0', highlight: 'window' },
            { index: 1, value: 4, highlight: 'window' },
            { index: 2, value: 1, label: 'R=2', highlight: 'active' },
            { index: 3, value: 2, highlight: 'neutral' },
            { index: 4, value: 7, highlight: 'neutral' },
          ],
        },
      ],
      variables: { L: 0, R: 2, WindowSum: 7, MatchesFound: 1 },
    },
    {
      stepNumber: 2,
      title: 'Step 2: Advance Right to 2 (Sum = 9 > 7), Contract Left Tail to Re-Hit 7',
      explanation:
        'Expand r to 3 (+2 -> sum = 9 > 7). Since all elements are positive, shrink l = 0 (-2 -> sum = 7)! Window [1..3] = [4, 1, 2] hits sum = 7 -> Match count = 2!',
      mode: 'array',
      arrays: [
        {
          name: 'Window [l=1..r=3] After Contracting L = 0',
          cells: [
            { index: 0, value: 2, label: 'evicted', highlight: 'neutral' },
            { index: 1, value: 4, label: 'L=1', highlight: 'window' },
            { index: 2, value: 1, highlight: 'window' },
            { index: 3, value: 2, label: 'R=3', highlight: 'active' },
            { index: 4, value: 7, highlight: 'neutral' },
          ],
        },
      ],
      variables: { L: 1, R: 3, WindowSum: 7, MatchesFound: 2 },
    },
    {
      stepNumber: 3,
      title: 'Step 3: Advance Right to 7 (Sum = 14), Shrink Left Past [4,1,2] to [4..4]',
      explanation:
        'Expand r to 4 (+7 -> sum = 14). Contract l = 1 (-4 -> 10), l = 2 (-1 -> 9), l = 3 (-2 -> 7). Window [4..4] = [7] hits target X = 7 -> Final Matches = 3 in 10 total pointer steps!',
      mode: 'array',
      arrays: [
        {
          name: 'Final Window [l=4..r=4] on [2, 4, 1, 2, 7]',
          cells: [
            { index: 0, value: 2, highlight: 'neutral' },
            { index: 1, value: 4, highlight: 'neutral' },
            { index: 2, value: 1, highlight: 'neutral' },
            { index: 3, value: 2, highlight: 'neutral' },
            { index: 4, value: 7, label: 'L=R=4', highlight: 'active' },
          ],
        },
      ],
      variables: { L: 4, R: 4, WindowSum: 7, TotalMatches: 3 },
    },
  ],
  reductionClues: [
    {
      clue: '"Count or find longest/shortest subarray of POSITIVE integers with sum <= X, >= X, or == X"',
      translation:
        '**Variable Two Pointers (`O(N)`)**: because every element `a_i > 0`, expanding `r` strictly increases `sum` and contracting `l` strictly decreases `sum`—maintaining exact monotonicity without a hash map!',
    },
    {
      clue: '"Count contiguous subarrays containing AT MOST K distinct values (or find longest good segment)"',
      translation:
        '**Frequency Map + Sliding Window (`O(N)`)**: when `[l..r]` is the maximal valid window ending at `r`, EVERY suffix `[m..r]` with `l <= m <= r` is ALSO valid, contributing **`r - l + 1`** new valid subarrays in one step!',
    },
    {
      clue: '"Count subarrays with EXACTLY K distinct values"',
      translation:
        '**AtMost(K) - AtMost(K - 1)**: exact cardinality breaks single-window monotonicity, whereas `atMost(K)` is cleanly monotonic—subtracting two sliding passes yields `exactly(K)` in linear time!',
    },
    {
      clue: '"Find shortest contiguous window covering all required element frequencies"',
      translation:
        'Maintain `satisfiedKinds == requiredKinds`: advance `r` until all constraints are met, then greedily contract `l` while `satisfiedKinds == requiredKinds` to tighten the minimal valid `[l..r]`!',
    },
  ],
  timeComplexity: 'O(N) — each pointer moves across the array at most once',
  spaceComplexity: 'O(1) for sum / O(N) for frequency map',
  pitfalls: [
    {
      type: 'WA',
      title: 'Using Two Pointers for Subarray Sum When Negative Numbers Exist',
      detail:
        'Variable Two Pointers (`l++, r++`) FAILS completely if `a_i < 0`! Because shrinking `l` over a negative element *increases* the sum instead of decreasing it, breaking monotonicity. With negative numbers, switch immediately to **Prefix Sum + Hash Map (`pref[r] - X`)**!',
    },
    {
      type: 'WA',
      title: 'Counting `ans += (r - l + 1)` with `int` Overflow on `N = 2 * 10^5`',
      detail:
        'The total number of subarrays in an array of length `N = 200,000` is `N * (N + 1) / 2 ~ 2 * 10^{10}`, which overflows a signed 32-bit `int` (`2.14 * 10^9`)! Always store subarray counts and window sums in **64-bit `long long` / `i64` / `long`**!',
    },
    {
      type: 'TLE',
      title: 'Scanning the Entire Frequency Dictionary Inside the Inner Loop to Check Validity',
      detail:
        'Checking whether all target frequencies are satisfied by iterating over the map takes `O(M)` per step (`O(NM)` TLE!). Track an integer counter **`distinct`** (or **`satisfied`**) updated incrementally in `O(1)` when `freq[x]` crosses `0 -> 1`, `1 -> 0`, or `req[x]`.',
    },
    {
      type: 'WA',
      title: 'Forgetting `freq[x] == 0` Cleanup vs `distinct--` on Removal',
      detail:
        'When evicting `a[l]` from the sliding window, decrement `freq[a[l]]` FIRST and ONLY decrement `distinct` when `freq[a[l]]` drops specifically to **`0`**!',
    },
  ],
  implementations: {
    cpp20: `#include <bits/stdc++.h>
using namespace std;

// Variable Sliding Window: Count contiguous subarrays of positive integers summing to X in O(N)
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    long long target;
    if (!(cin >> n >> target)) return 0;
    vector<long long> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];

    long long sum = 0, count = 0;
    int l = 0;
    for (int r = 0; r < n; r++) {
        sum += a[r];
        while (l <= r && sum > target) {
            sum -= a[l++];
        }
        if (sum == target) count++;
    }

    cout << count << "\\n";
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
    let target: i64 = it.next().unwrap().parse().unwrap();

    let mut a = Vec::with_capacity(n);
    for _ in 0..n {
        a.push(it.next().unwrap().parse::<i64>().unwrap());
    }

    let mut sum: i64 = 0;
    let mut count: i64 = 0;
    let mut l: usize = 0;
    for r in 0..n {
        sum += a[r];
        while l <= r && sum > target {
            sum -= a[l];
            l += 1;
        }
        if sum == target {
            count += 1;
        }
    }
    println!("{}", count);
}`,
    java21: `import java.io.*;

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
        long target = fs.nextLong();

        long[] a = new long[n];
        for (int i = 0; i < n; i++) a[i] = fs.nextLong();

        long sum = 0, count = 0;
        int l = 0;
        for (int r = 0; r < n; r++) {
            sum += a[r];
            while (l <= r && sum > target) {
                sum -= a[l++];
            }
            if (sum == target) count++;
        }
        System.out.println(count);
    }
}`,
    python3: `import sys

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    target = int(data[1])
    a = [int(data[2 + i]) for i in range(n)]

    cur_sum = 0
    count = 0
    l = 0
    for r in range(n):
        cur_sum += a[r]
        while l <= r and cur_sum > target:
            cur_sum -= a[l]
            l += 1
        if cur_sum == target:
            count += 1
    sys.stdout.write(f"{count}\\n")

if __name__ == "__main__":
    solve()`,
    ruby: `tokens = $stdin.read.split
exit if tokens.empty?
n = tokens[0].to_i
target = tokens[1].to_i
a = Array.new(n) { |i| tokens[2 + i].to_i }

cur_sum = 0
count = 0
l = 0
n.times do |r|
  cur_sum += a[r]
  while l <= r && cur_sum > target
    cur_sum -= a[l]
    l += 1
  end
  count += 1 if cur_sum == target
end
puts count`,
  },
  practiceProblems: [
    {
      id: 'ch59-p1',
      tier: 'Warmup',
      ratingRange: '900–1100',
      title: 'Subarray Sums I (Exact Sum in Positive Array)',
      statement:
        'Given an array of N positive integers (`1 <= N <= 2 * 10^5`, `1 <= a_i <= 10^9`) and a target sum `X` (`1 <= X <= 10^9`), count the number of contiguous subarrays whose element sum equals `X` in `O(N)` time and `O(1)` auxiliary space.',
      constraints: '1 <= N <= 2 * 10^5, 1 <= a_i, X <= 10^9',
      sampleInput: `5 7
2 4 1 2 7`,
      sampleOutput: `3`,
      hints: [
        'Because all elements `a_i >= 1` are strictly positive, enlarging the window increases its sum while shrinking it decreases its sum.',
        'For each right endpoint `r`, add `a[r]` to `sum` and advance `l` while `sum > X`.',
        'Increment answer whenever `sum == X` (`[2,4,1]`, `[4,1,2]`, `[7]` -> 3).',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    long long x;
    if (!(cin >> n >> x)) return 0;
    vector<long long> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];

    long long sum = 0, ans = 0;
    int l = 0;
    for (int r = 0; r < n; r++) {
        sum += a[r];
        while (l <= r && sum > x) sum -= a[l++];
        if (sum == x) ans++;
    }
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
    let x: i64 = it.next().unwrap().parse().unwrap();
    let mut a = Vec::with_capacity(n);
    for _ in 0..n { a.push(it.next().unwrap().parse::<i64>().unwrap()); }

    let (mut sum, mut ans, mut l) = (0i64, 0i64, 0usize);
    for r in 0..n {
        sum += a[r];
        while l <= r && sum > x {
            sum -= a[l];
            l += 1;
        }
        if sum == x { ans += 1; }
    }
    println!("{}", ans);
}`,
        java21: `import java.io.*;

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
        long x = fs.nextLong();

        long[] a = new long[n];
        for (int i = 0; i < n; i++) a[i] = fs.nextLong();

        long sum = 0, ans = 0;
        int l = 0;
        for (int r = 0; r < n; r++) {
            sum += a[r];
            while (l <= r && sum > x) sum -= a[l++];
            if (sum == x) ans++;
        }
        System.out.println(ans);
    }
}`,
        python3: `import sys

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    x = int(data[1])
    a = [int(data[2 + i]) for i in range(n)]

    s = 0
    ans = 0
    l = 0
    for r in range(n):
        s += a[r]
        while l <= r and s > x:
            s -= a[l]
            l += 1
        if s == x:
            ans += 1
    sys.stdout.write(f"{ans}\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
n = tokens[0].to_i
x = tokens[1].to_i
a = Array.new(n) { |i| tokens[2 + i].to_i }

s = 0; ans = 0; l = 0
n.times do |r|
  s += a[r]
  while l <= r && s > x
    s -= a[l]
    l += 1
  end
  ans += 1 if s == x
end
puts ans`,
      },
    },
    {
      id: 'ch59-p2',
      tier: 'Standard',
      ratingRange: '1000–1200',
      title: 'Subarray Distinct Values (At Most K Distinct)',
      statement:
        'Given an array of N integers (`1 <= N <= 2 * 10^5`, `1 <= x_i <= 10^9`) and an integer K (`1 <= K <= N`), count the number of contiguous subarrays that contain at most `K` distinct values.',
      constraints: '1 <= K <= N <= 2 * 10^5, 1 <= x_i <= 10^9',
      sampleInput: `5 2
1 2 3 1 1`,
      sampleOutput: `10`,
      hints: [
        'Track active frequencies in the window `[l..r]` along with `distinct` count.',
        'Coordinate-compress values (or use a hash map) so distinct updates run cleanly without custom hash collisions.',
        'Whenever `distinct <= K` holds for minimal left pointer `l`, ALL `r - l + 1` subarrays ending at `r` are valid: `ans += (r - l + 1)` (use 64-bit integers!).',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, k;
    if (!(cin >> n >> k)) return 0;
    vector<int> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];

    vector<int> vals = a;
    sort(vals.begin(), vals.end());
    vals.erase(unique(vals.begin(), vals.end()), vals.end());
    for (int& v : a) {
        v = (int)(lower_bound(vals.begin(), vals.end(), v) - vals.begin());
    }

    vector<int> freq(vals.size(), 0);
    int distinct = 0, l = 0;
    long long ans = 0;
    for (int r = 0; r < n; r++) {
        if (++freq[a[r]] == 1) distinct++;
        while (distinct > k) {
            if (--freq[a[l]] == 0) distinct--;
            l++;
        }
        ans += (r - l + 1);
    }
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
    let k: usize = it.next().unwrap().parse().unwrap();

    let mut raw = Vec::with_capacity(n);
    for _ in 0..n { raw.push(it.next().unwrap().parse::<i64>().unwrap()); }
    let mut vals = raw.clone();
    vals.sort_unstable();
    vals.dedup();
    let a: Vec<usize> = raw.iter().map(|v| vals.binary_search(v).unwrap()).collect();

    let mut freq = vec![0usize; vals.len()];
    let (mut distinct, mut l, mut ans) = (0usize, 0usize, 0i64);
    for r in 0..n {
        freq[a[r]] += 1;
        if freq[a[r]] == 1 { distinct += 1; }
        while distinct > k {
            freq[a[l]] -= 1;
            if freq[a[l]] == 0 { distinct -= 1; }
            l += 1;
        }
        ans += (r - l + 1) as i64;
    }
    println!("{}", ans);
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
        int n = (int) nLong, k = (int) fs.nextLong();

        long[] raw = new long[n];
        for (int i = 0; i < n; i++) raw[i] = fs.nextLong();
        long[] vals = raw.clone();
        Arrays.sort(vals);
        int uniq = 0;
        for (int i = 0; i < n; i++) {
            if (i == 0 || vals[i] != vals[i - 1]) vals[uniq++] = vals[i];
        }
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = Arrays.binarySearch(vals, 0, uniq, raw[i]);

        int[] freq = new int[uniq];
        int distinct = 0, l = 0;
        long ans = 0;
        for (int r = 0; r < n; r++) {
            if (++freq[a[r]] == 1) distinct++;
            while (distinct > k) {
                if (--freq[a[l]] == 0) distinct--;
                l++;
            }
            ans += (r - l + 1);
        }
        System.out.println(ans);
    }
}`,
        python3: `import sys
from bisect import bisect_left

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    k = int(data[1])
    raw = [int(data[2 + i]) for i in range(n)]
    vals = sorted(set(raw))
    a = [bisect_left(vals, v) for v in raw]

    freq = [0] * len(vals)
    distinct = 0
    l = 0
    ans = 0
    for r in range(n):
        x = a[r]
        freq[x] += 1
        if freq[x] == 1:
            distinct += 1
        while distinct > k:
            y = a[l]
            freq[y] -= 1
            if freq[y] == 0:
                distinct -= 1
            l += 1
        ans += (r - l + 1)
    sys.stdout.write(f"{ans}\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
n = tokens[0].to_i
k = tokens[1].to_i
raw = Array.new(n) { |i| tokens[2 + i].to_i }

vals = raw.uniq.sort
a = raw.map { |v| vals.bsearch_index { |u| u >= v } }
freq = Array.new(vals.length, 0)

distinct = 0; l = 0; ans = 0
n.times do |r|
  x = a[r]
  freq[x] += 1
  distinct += 1 if freq[x] == 1
  while distinct > k
    y = a[l]
    freq[y] -= 1
    distinct -= 1 if freq[y] == 0
    l += 1
  end
  ans += (r - l + 1)
end
puts ans`,
      },
    },
    {
      id: 'ch59-p3',
      tier: 'Boss',
      ratingRange: '1200–1400',
      title: 'Smallest Window Covering All Target Frequencies',
      statement:
        'Given an input stream array `a` of `N` integers (`1 <= N <= 2 * 10^5`) and a multiset `b` of `M` required target tokens (`1 <= M <= 2 * 10^5`), determine the minimum length of a contiguous subarray of `a` that contains every token in `b` with at least its required multiplicity. Output `-1` if no such window exists.',
      constraints: '1 <= N, M <= 2 * 10^5, -10^9 <= a_i, b_j <= 10^9',
      sampleInput: `8 3
1 3 2 1 2 1 3 2
1 1 2`,
      sampleOutput: `3`,
      hints: [
        'Coordinate-compress unique values from `b` (mapping unrequired tokens in `a` to `-1` so they never slow down frequency checks!).',
        'Track `reqFreq[id]` for each distinct required value and maintain `satisfiedKinds` (`have[id] == reqFreq[id]` increments `satisfiedKinds` once).',
        'Whenever `satisfiedKinds == requiredKinds`, record `bestLen = min(bestLen, r - l + 1)` and greedily contract `l` until `satisfiedKinds < requiredKinds`.',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, m;
    if (!(cin >> n >> m)) return 0;
    vector<long long> a(n), b(m);
    for (int i = 0; i < n; i++) cin >> a[i];
    for (int i = 0; i < m; i++) cin >> b[i];

    vector<long long> keys = b;
    sort(keys.begin(), keys.end());
    keys.erase(unique(keys.begin(), keys.end()), keys.end());
    int U = (int)keys.size();

    vector<int> req(U, 0), have(U, 0);
    for (long long v : b) {
        int id = (int)(lower_bound(keys.begin(), keys.end(), v) - keys.begin());
        req[id]++;
    }

    auto getId = [&](long long v) -> int {
        auto it = lower_bound(keys.begin(), keys.end(), v);
        if (it == keys.end() || *it != v) return -1;
        return (int)(it - keys.begin());
    };

    int satisfied = 0, bestLen = n + 1, l = 0;
    for (int r = 0; r < n; r++) {
        int idR = getId(a[r]);
        if (idR != -1 && ++have[idR] == req[idR]) satisfied++;

        while (satisfied == U) {
            bestLen = min(bestLen, r - l + 1);
            int idL = getId(a[l++]);
            if (idL != -1 && have[idL]-- == req[idL]) satisfied--;
        }
    }

    cout << (bestLen <= n ? bestLen : -1) << "\\n";
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
    let m: usize = it.next().unwrap().parse().unwrap();

    let mut a = Vec::with_capacity(n);
    let mut b = Vec::with_capacity(m);
    for _ in 0..n { a.push(it.next().unwrap().parse::<i64>().unwrap()); }
    for _ in 0..m { b.push(it.next().unwrap().parse::<i64>().unwrap()); }

    let mut keys = b.clone();
    keys.sort_unstable();
    keys.dedup();
    let u = keys.len();

    let mut req = vec![0usize; u];
    let mut have = vec![0usize; u];
    for &v in &b {
        req[keys.binary_search(&v).unwrap()] += 1;
    }

    let mut satisfied = 0usize;
    let mut best_len = n + 1;
    let mut l = 0usize;
    for r in 0..n {
        if let Ok(id_r) = keys.binary_search(&a[r]) {
            have[id_r] += 1;
            if have[id_r] == req[id_r] { satisfied += 1; }
        }
        while satisfied == u {
            best_len = best_len.min(r - l + 1);
            if let Ok(id_l) = keys.binary_search(&a[l]) {
                if have[id_l] == req[id_l] { satisfied -= 1; }
                have[id_l] -= 1;
            }
            l += 1;
        }
    }
    println!("{}", if best_len <= n { best_len as isize } else { -1 });
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
        int n = (int) nLong, m = (int) fs.nextLong();

        long[] a = new long[n], b = new long[m];
        for (int i = 0; i < n; i++) a[i] = fs.nextLong();
        for (int i = 0; i < m; i++) b[i] = fs.nextLong();

        long[] rawKeys = b.clone();
        Arrays.sort(rawKeys);
        int uniq = 0;
        for (int i = 0; i < m; i++) {
            if (i == 0 || rawKeys[i] != rawKeys[i - 1]) rawKeys[uniq++] = rawKeys[i];
        }
        long[] keys = Arrays.copyOf(rawKeys, uniq);
        int[] req = new int[uniq], have = new int[uniq];
        for (long v : b) req[Arrays.binarySearch(keys, v)]++;

        int satisfied = 0, bestLen = n + 1, l = 0;
        for (int r = 0; r < n; r++) {
            int idR = Arrays.binarySearch(keys, a[r]);
            if (idR >= 0 && ++have[idR] == req[idR]) satisfied++;
            while (satisfied == uniq) {
                if (r - l + 1 < bestLen) bestLen = r - l + 1;
                int idL = Arrays.binarySearch(keys, a[l++]);
                if (idL >= 0 && have[idL]-- == req[idL]) satisfied--;
            }
        }
        System.out.println(bestLen <= n ? bestLen : -1);
    }
}`,
        python3: `import sys
from bisect import bisect_left

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    m = int(data[1])
    a = [int(data[2 + i]) for i in range(n)]
    b = [int(data[2 + n + i]) for i in range(m)]

    keys = sorted(set(b))
    U = len(keys)
    req = [0] * U
    have = [0] * U
    for v in b:
        req[bisect_left(keys, v)] += 1

    def get_id(v: int) -> int:
        pos = bisect_left(keys, v)
        return pos if pos < U and keys[pos] == v else -1

    satisfied = 0
    best_len = n + 1
    l = 0
    for r in range(n):
        id_r = get_id(a[r])
        if id_r != -1:
            have[id_r] += 1
            if have[id_r] == req[id_r]:
                satisfied += 1
        while satisfied == U:
            cur = r - l + 1
            if cur < best_len:
                best_len = cur
            id_l = get_id(a[l])
            if id_l != -1:
                if have[id_l] == req[id_l]:
                    satisfied -= 1
                have[id_l] -= 1
            l += 1

    sys.stdout.write(f"{best_len if best_len <= n else -1}\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
n = tokens[0].to_i
m = tokens[1].to_i
a = Array.new(n) { |i| tokens[2 + i].to_i }
b = Array.new(m) { |i| tokens[2 + n + i].to_i }

keys = b.uniq.sort
u = keys.length
req = Array.new(u, 0)
have = Array.new(u, 0)
key_map = {}
keys.each_with_index { |v, idx| key_map[v] = idx }
b.each { |v| req[key_map[v]] += 1 }

satisfied = 0; best_len = n + 1; l = 0
n.times do |r|
  id_r = key_map[a[r]]
  unless id_r.nil?
    have[id_r] += 1
    satisfied += 1 if have[id_r] == req[id_r]
  end
  while satisfied == u
    cur = r - l + 1
    best_len = cur if cur < best_len
    id_l = key_map[a[l]]
    unless id_l.nil?
      satisfied -= 1 if have[id_l] == req[id_l]
      have[id_l] -= 1
    end
    l += 1
  end
end
puts(best_len <= n ? best_len : -1)`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'CSES',
      title: 'Subarray Sums I & Subarray Distinct Values',
      difficulty: 'Bronze–Silver',
      url: 'https://cses.fi/problemset/task/1660',
      patternNote: 'Standard positive-sum contraction and `r - l + 1` subarray counting patterns.',
    },
    {
      platform: 'Codeforces',
      title: 'K-good Segment (616D) & They Are Everywhere (701C)',
      difficulty: '1500–1600',
      url: 'https://codeforces.com/problemset/problem/616/D',
      patternNote: 'Variable sliding window maximizing distinct length and minimizing cover width.',
    },
    {
      platform: 'AtCoder',
      title: 'ABC038C / ABC130D — Enough Array',
      difficulty: '1000',
      url: 'https://atcoder.jp/contests/abc130/tasks/abc130_d',
      patternNote: 'Count suffixes with sum >= K via O(N) tail contraction without binary search.',
    },
    {
      platform: 'CodeChef',
      title: 'SUBARRAY / Sliding Window Distinct',
      difficulty: '1200',
      url: 'https://www.codechef.com',
      patternNote: 'Incremental frequency tracking avoiding inner-loop dictionary scans.',
    },
    {
      platform: 'HackerRank',
      title: 'Two Pointers / Minimum Loss Subwindow',
      difficulty: 'Easy–Medium',
      url: 'https://www.hackerrank.com/challenges',
      patternNote: 'Enforce strict invariant check before advancing left pointer.',
    },
    {
      platform: 'NeetCode 150',
      title: 'Minimum Window Substring (76) & Subarrays with K Different Integers (992)',
      difficulty: 'Hard',
      url: 'https://leetcode.com/problems/minimum-window-substring/',
      patternNote: 'Combine O(1) satisfied-counter contraction with `atMost(K) - atMost(K - 1)`.',
    },
  ],
  interviewNotes: [
    'Why is the total complexity of nested `for (r = 0..N-1) while (...) l++;` strictly `O(N)`? Because `l` only ever increments across the loop (`0 -> N`), executing at most `N` total iterations across the entire algorithm.',
    'Always verify monotonicity before choosing Two Pointers over Prefix Sum + Hash Map: if negative numbers can enter the array, shrinking `l` can increase `sum` and break the two-pointer invariant.',
    'For exact distinct counts (`exactly K distinct`), transform via `atMost(K) - atMost(K - 1)` so both passes retain a clean monotonic predicate.',
  ],
  projectBlueprint: {
    title: 'API Rate-Limiter & Real-Time Sliding-Window Telemetry Aggregator',
    tagline:
      'Zero-allocation O(N) streaming telemetry engine enforcing multi-tenant burst quotas and computing distinct active user windows in real time.',
    stackSummary: 'TypeScript Streaming Window Engine',
    asciiDiagram: `[Incoming Request Stream (ts, userId)]
         |
         +--> [Advance Right r, Increment freq[userId]]
         |
         +--> [Contract Left l while window > TTL or distinct > Quota] --> [Emit Allow / 429]`,
    milestones: [
      {
        id: 'm1',
        title: 'Monotonic Window Eviction Queue',
        detail: 'Expire stale timestamps outside the active time horizon in O(1) amortized per request.',
      },
      {
        id: 'm2',
        title: 'Incremental Distinct-Tenant Counter',
        detail: 'Maintain unique active callers inside each window without scanning the frequency table.',
      },
      {
        id: 'm3',
        title: 'Minimum Spike-Interval Detector',
        detail: 'Flag the narrowest burst duration containing all critical error-code signatures.',
      },
    ],
    starterCode: `export function countSubarraysAtMostKDistinct(events: number[], k: number): number {
  const freq = new Map<number, number>();
  let distinct = 0;
  let l = 0;
  let total = 0;
  for (let r = 0; r < events.length; r++) {
    const c = freq.get(events[r]) ?? 0;
    if (c === 0) distinct++;
    freq.set(events[r], c + 1);
    while (distinct > k) {
      const lc = freq.get(events[l])!;
      if (lc === 1) distinct--;
      freq.set(events[l], lc - 1);
      l++;
    }
    total += r - l + 1;
  }
  return total;
}

console.log('At most 2 distinct:', countSubarraysAtMostKDistinct([1, 2, 3, 1, 1], 2));`,
  },
};
