import type { TheoryChapter } from '../../types/vault';

export const CH28_MEET_IN_THE_MIDDLE: TheoryChapter = {
  slug: 'meet-in-the-middle',
  topicId: 'dp-19',
  title: 'Meet-in-the-Middle (N <= 40 Splitting)',
  domain: 'Search, Greedy & DP',
  ratingTier: '1600–1900',
  usacoDivision: 'Gold',
  subtitle:
    'Shrink impossible 2^40 (1 trillion) brute-force searches down to two crisp 2^20 (1 million) halves merged via sorting, Pareto-frontier pruning, two pointers, or binary search.',
  analogyTitle: 'The Two-Team Tunneling & Bridge-Meeting Analogy',
  analogyBody:
    'Suppose you must verify whether any combination of 40 safety deposit keys sums to an exact vault code `X = 1,000,000,000,000`. Trying all `2^40 ≈ 1.1 trillion` subsets sequentially would take over 30 minutes! Instead, split the 40 keys down the middle into **Left Vault Team (20 keys)** and **Right Vault Team (20 keys)**. Each team tries all `2^20 ≈ 1,048,576` subsets of its own half in milliseconds! Once Team Right sorts its `1M` totals (or stores frequency counts / Pareto-optimal value peaks), Team Left simply asks for every left total `L`: "Does `X - L` appear in Team Right?" Turning `2^N` into `O(2^(N/2) * (N/2))` works seamlessly even when weights hit `10^15` (where Knapsack DP dies)!',
  prerequisites: [
    {
      slug: 'binary-search-on-answer',
      title: 'Binary Search on Answer & Two Pointers',
    },
  ],
  traceTitle: 'Interactive N/2 Splitting, Sorted Subset Generation & Two-Pointer / Binary Search Merge',
  traceSubtitle:
    'Trace `A = [3, 8, 5, 11, 2, 7]` (modeling `N -> N/2` splitting) targeting `X = 18`: split into `L = [3, 8, 5]` and `R = [11, 2, 7]`.',
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Step 1: Split Input Array Down the Middle Into Left[0..N/2-1] & Right[N/2..N-1]',
      explanation:
        'For N = 40, brute force costs 2^40 = 1.09e12 ops. Splitting creates two halves of size N/2 = 20 (only 2^20 = 1.04e6 subsets each!). On our 6-item demo targeting X=18: Left=[3, 8, 5], Right=[11, 2, 7].',
      mode: 'array',
      arrays: [
        {
          name: 'Left Half (N/2)',
          cells: [
            { index: 0, value: 3, highlight: 'window' },
            { index: 1, value: 8, highlight: 'window' },
            { index: 2, value: 5, highlight: 'window' },
          ],
        },
        {
          name: 'Right Half (N/2)',
          cells: [
            { index: 0, value: 11, highlight: 'active' },
            { index: 1, value: 2, highlight: 'active' },
            { index: 2, value: 7, highlight: 'active' },
          ],
        },
      ],
      variables: { FullSizeN: 40, HalfSize: 20, BruteForceOps: '1.1e12', SplitOps: '2 * 1.04e6' },
    },
    {
      stepNumber: 2,
      title: 'Step 2: Enumerate Sorted Subset Sums Recursively (Zero Extra Log-Factor)',
      explanation:
        'Using BFS-style iterative doubling (`next = prev U (prev + x)` merged in `O(size)`), OR DFS generation + sort: Left sums = [0, 3, 5, 8, 8, 11, 13, 16]; Right sums = [0, 2, 7, 9, 11, 13, 18, 20].',
      mode: 'array',
      arrays: [
        {
          name: 'Sorted Left Sums',
          cells: [
            { index: 0, value: 0, highlight: 'neutral' },
            { index: 1, value: 3, highlight: 'neutral' },
            { index: 2, value: 5, highlight: 'neutral' },
            { index: 3, value: 8, highlight: 'window' },
            { index: 4, value: 8, highlight: 'window' },
            { index: 5, value: 11, highlight: 'neutral' },
            { index: 6, value: 13, highlight: 'neutral' },
            { index: 7, value: 16, highlight: 'neutral' },
          ],
        },
        {
          name: 'Sorted Right Sums',
          cells: [
            { index: 0, value: 0, highlight: 'neutral' },
            { index: 1, value: 2, highlight: 'neutral' },
            { index: 2, value: 7, highlight: 'neutral' },
            { index: 3, value: 9, highlight: 'active' },
            { index: 4, value: 11, highlight: 'neutral' },
            { index: 5, value: 13, highlight: 'neutral' },
            { index: 6, value: 18, highlight: 'neutral' },
            { index: 7, value: 20, highlight: 'neutral' },
          ],
        },
      ],
      variables: { TargetX: 18, LeftSize: 8, RightSize: 8 },
    },
    {
      stepNumber: 3,
      title: 'Step 3: Two-Pointer Sweep (i Forward on Left, j Backward on Right)',
      explanation:
        'Start i=0 (Left=0) and j=7 (Right=20): sum=20 > 18 -> j--. At j=6 (Right=18): 0 + 18 == 18 (HIT #1!). Advance i, walk j down: at i=2 (Left=5) + j=5 (Right=13) == 18 (HIT #2!).',
      mode: 'array',
      arrays: [
        {
          name: 'Left Pointer i',
          cells: [
            { index: 0, value: 0, highlight: 'updated' },
            { index: 1, value: 3, highlight: 'neutral' },
            { index: 2, value: 5, highlight: 'active' },
            { index: 3, value: 8, highlight: 'neutral' },
            { index: 4, value: 8, highlight: 'neutral' },
            { index: 5, value: 11, highlight: 'window' },
            { index: 6, value: 13, highlight: 'neutral' },
            { index: 7, value: 16, highlight: 'neutral' },
          ],
        },
        {
          name: 'Right Pointer j',
          cells: [
            { index: 0, value: 0, highlight: 'neutral' },
            { index: 1, value: 2, highlight: 'window' },
            { index: 2, value: 7, highlight: 'window' },
            { index: 3, value: 9, highlight: 'neutral' },
            { index: 4, value: 11, highlight: 'neutral' },
            { index: 5, value: 13, highlight: 'active' },
            { index: 6, value: 18, highlight: 'updated' },
            { index: 7, value: 20, highlight: 'neutral' },
          ],
        },
      ],
      variables: { MatchesSoFar: '0+18, 5+13, 11+7, 16+2', PointerSteps: 'O(2^(N/2))' },
    },
    {
      stepNumber: 4,
      title: 'Step 4: Equal-Block Run-Length Counting Gives Exact Subset Count = 4 in Linear Sweep',
      explanation:
        'Group equal Left sums and equal Right sums during the two-pointer pass (e.g., if `Left = 8` appeared 2x and `Right = 10` appeared 3x, add `2 * 3 = 6`). Total ways summing to X = 18 is 4: {11,7}, {5,11,2}, {3,8,7}, {3,8,5,2}!',
      mode: 'array',
      arrays: [
        {
          name: 'Matched Pairs (Sum=18)',
          cells: [
            { index: 0, value: '0+18', highlight: 'updated' },
            { index: 1, value: '5+13', highlight: 'updated' },
            { index: 2, value: '11+7', highlight: 'updated' },
            { index: 3, value: '16+2', highlight: 'updated' },
          ],
        },
      ],
      variables: { TotalSubsetsFor18: 4, ClosestSumTo18: 18, PeakSpace: '2 * 2^(N/2)' },
    },
  ],
  reductionClues: [
    {
      clue: '"N <= 40 (or 34..44), weights/values up to 10^9 or 10^15, count/minimize/maximize subset sums"',
      translation:
        'Classic Meet-in-the-Middle! Split into halves of `<= 20`, generate `2^(N/2)` states per half, sort, and merge via two pointers or binary search.',
    },
    {
      clue: '"Pick 4 elements a[i] + a[j] + a[k] + a[l] == X (distinct indices, N <= 1000)"',
      translation:
        'Four-Sum Meet-in-the-Middle: iterate `k` forward while inserting all earlier pair sums `(a[i] + a[j], i, j)` for `i < j < k`, then check `X - a[k] - a[l]` (`l > k`) in `O(N^2)`—zero index collisions guaranteed by the chronological split!',
    },
    {
      clue: '"0/1 Knapsack with N <= 40 and capacity W <= 10^9 (cannot allocate DP[W])"',
      translation:
        'Generate `(weight, value)` for both halves. Sort Right half by weight and **Pareto-prune** dominated states (`w1 <= w2 && v1 >= v2` means `(w2, v2)` is useless!), turning `R` into a strictly increasing prefix-max table queried via binary search!',
    },
    {
      clue: '"Minimum number of moves / shortest transformation on Rubik’s Cube / sliding puzzle / 20-step graph"',
      translation:
        'Bidirectional BFS! Run BFS from Start up to depth `D/2` and BFS from Target up to depth `D/2`, intersecting states in a hash map (`b^(D/2)` instead of `b^D`).',
    },
  ],
  timeComplexity: 'Standard Split + Sort: O(2^(N/2) * N) | Merge-Insertion Generation: O(2^(N/2))',
  spaceComplexity: 'O(2^(N/2))',
  pitfalls: [
    {
      type: 'TLE',
      title: 'Using std::unordered_map on 1,048,576 Keys Instead of Sorted Vector + Two Pointers',
      detail:
        '`unordered_map` with `10^6` 64-bit sums allocates millions of heap nodes (~60 MB) AND suffers from anti-hash blowups (`20x` slower than sorting a contiguous `vector<long long>`!). Always sort flat arrays + use two pointers / `lower_bound` (or iterative merge-sorting in `O(2^(N/2))` without even calling `std::sort`!).',
    },
    {
      type: 'WA',
      title: 'Skipping Elements Above Target X Prematurely When Array Contains Negative Numbers',
      detail:
        'If all `a_i > 0`, pruning sums `> X` during subset generation is safe and fast. If any `a_i` can be NEGATIVE (or `<= 0`), NEVER prune sums `> X` because later negative elements can pull the sum back down to `X`!',
    },
    {
      type: 'WA',
      title: 'Forgetting Run-Length Multiplicity in Equal-Sum Two-Pointer Counting',
      detail:
        'When counting how many pairs `(l, r)` satisfy `L[l] + R[r] == X` with duplicate values in `L` and `R`, incrementing `l++` alone misses duplicate pairings! Count the entire streak `cL` in `L` and streak `cR` in `R`, adding `cL * cR`.',
    },
    {
      type: 'MLE',
      title: 'Storing Both Bitmasks and Full Items Instead of Compact 64-bit Sums',
      detail:
        'Keep each subset array lean (`vector<long long>` = 8 MB for `2^20`). If `N = 42`, split unevenly (`20` and `22`, OR generate `R` on-the-fly with DFS and binary search inside `L` without storing `R` at all!) to stay safely below 256 MB.',
    },
  ],
  implementations: {
    cpp20: `#include <bits/stdc++.h>
using namespace std;

// O(2^(N/2)) Merge-Generated Meet-in-the-Middle Exact Subset Sum Counter
// Avoids N*2^(N/2) log sort overhead by merging sorted vectors at each step!
vector<long long> gen_sorted_sums(const vector<long long>& arr) {
    vector<long long> res = {0};
    for (long long x : arr) {
        vector<long long> added(res.size()), merged(res.size() * 2);
        for (size_t i = 0; i < res.size(); i++) added[i] = res[i] + x;
        merge(res.begin(), res.end(), added.begin(), added.end(), merged.begin());
        res.swap(merged);
    }
    return res;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    long long target;
    if (!(cin >> n >> target)) return 0;
    vector<long long> leftArr, rightArr;
    for (int i = 0; i < n; i++) {
        long long x;
        cin >> x;
        if (i < n / 2) leftArr.push_back(x);
        else rightArr.push_back(x);
    }

    vector<long long> L = gen_sorted_sums(leftArr);
    vector<long long> R = gen_sorted_sums(rightArr);

    long long ways = 0;
    size_t i = 0;
    long long j = (long long)R.size() - 1;
    while (i < L.size() && j >= 0) {
        long long s = L[i] + R[j];
        if (s < target) {
            i++;
        } else if (s > target) {
            j--;
        } else {
            long long cL = 1, cR = 1;
            while (i + 1 < L.size() && L[i + 1] == L[i]) { cL++; i++; }
            while (j - 1 >= 0 && R[j - 1] == R[j]) { cR++; j--; }
            ways += cL * cR;
            i++;
            j--;
        }
    }

    cout << ways << "\\n";
    return 0;
}`,
    rust: `use std::io::{self, Read};

fn gen_sorted_sums(arr: &[i64]) -> Vec<i64> {
    let mut res = vec![0i64];
    for &x in arr {
        let mut merged = Vec::with_capacity(res.len() * 2);
        let (mut a, mut b) = (0usize, 0usize);
        let n = res.len();
        while a < n && b < n {
            let vb = res[b] + x;
            if res[a] <= vb {
                merged.push(res[a]);
                a += 1;
            } else {
                merged.push(vb);
                b += 1;
            }
        }
        while a < n {
            merged.push(res[a]);
            a += 1;
        }
        while b < n {
            merged.push(res[b] + x);
            b += 1;
        }
        res = merged;
    }
    res
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let n: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };
    let target: i64 = it.next().unwrap().parse().unwrap();
    let mut arr = Vec::with_capacity(n);
    for _ in 0..n {
        arr.push(it.next().unwrap().parse::<i64>().unwrap());
    }

    let l = gen_sorted_sums(&arr[..n / 2]);
    let r = gen_sorted_sums(&arr[n / 2..]);

    let mut ways = 0i64;
    let mut i = 0usize;
    let mut j: isize = (r.len() as isize) - 1;
    while i < l.len() && j >= 0 {
        let s = l[i] + r[j as usize];
        if s < target {
            i += 1;
        } else if s > target {
            j -= 1;
        } else {
            let mut cl = 1i64;
            while i + 1 < l.len() && l[i + 1] == l[i] {
                cl += 1;
                i += 1;
            }
            let mut cr = 1i64;
            while j > 0 && r[(j - 1) as usize] == r[j as usize] {
                cr += 1;
                j -= 1;
            }
            ways += cl * cr;
            i += 1;
            j -= 1;
        }
    }
    println!("{}", ways);
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
        long nextLong() throws IOException {
            int c = readByte();
            while (c >= 0 && c <= ' ') c = readByte();
            if (c == -1) return Long.MIN_VALUE;
            boolean neg = false;
            if (c == '-') { neg = true; c = readByte(); }
            long res = 0;
            while (c > ' ') { res = res * 10 + (c - '0'); c = readByte(); }
            return neg ? -res : res;
        }
        int nextInt() throws IOException { return (int) nextLong(); }
    }

    static long[] genSortedSums(long[] arr, int start, int end) {
        long[] res = {0L};
        for (int idx = start; idx < end; idx++) {
            long x = arr[idx];
            int n = res.length;
            long[] merged = new long[n * 2];
            int a = 0, b = 0, k = 0;
            while (a < n && b < n) {
                long vb = res[b] + x;
                if (res[a] <= vb) merged[k++] = res[a++];
                else { merged[k++] = vb; b++; }
            }
            while (a < n) merged[k++] = res[a++];
            while (b < n) merged[k++] = res[b++] + x;
            res = merged;
        }
        return res;
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        int n = fs.nextInt();
        if (n == Integer.MIN_VALUE) return;
        long target = fs.nextLong();
        long[] arr = new long[n];
        for (int i = 0; i < n; i++) arr[i] = fs.nextLong();

        long[] L = genSortedSums(arr, 0, n / 2);
        long[] R = genSortedSums(arr, n / 2, n);

        long ways = 0;
        int i = 0, j = R.length - 1;
        while (i < L.length && j >= 0) {
            long s = L[i] + R[j];
            if (s < target) i++;
            else if (s > target) j--;
            else {
                long cL = 1, cR = 1;
                while (i + 1 < L.length && L[i + 1] == L[i]) { cL++; i++; }
                while (j - 1 >= 0 && R[j - 1] == R[j]) { cR++; j--; }
                ways += cL * cR;
                i++;
                j--;
            }
        }
        System.out.println(ways);
    }
}`,
    python3: `import sys

sys.setrecursionlimit(200000)

def gen_sorted_sums(arr: list[int]) -> list[int]:
    res = [0]
    for x in arr:
        added = [v + x for v in res]
        merged = []
        a = b = 0
        n = len(res)
        while a < n and b < n:
            if res[a] <= added[b]:
                merged.append(res[a])
                a += 1
            else:
                merged.append(added[b])
                b += 1
        if a < n:
            merged.extend(res[a:])
        if b < n:
            merged.extend(added[b:])
        res = merged
    return res

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    n = int(next(it))
    target = int(next(it))
    arr = [int(next(it)) for _ in range(n)]

    L = gen_sorted_sums(arr[: n // 2])
    R = gen_sorted_sums(arr[n // 2 :])

    ways = 0
    i = 0
    j = len(R) - 1
    while i < len(L) and j >= 0:
        s = L[i] + R[j]
        if s < target:
            i += 1
        elif s > target:
            j -= 1
        else:
            cL = 1
            while i + 1 < len(L) and L[i + 1] == L[i]:
                cL += 1
                i += 1
            cR = 1
            while j - 1 >= 0 and R[j - 1] == R[j]:
                cR += 1
                j -= 1
            ways += cL * cR
            i += 1
            j -= 1
    print(ways)

if __name__ == "__main__":
    solve()`,
    ruby: `def gen_sorted_sums(arr)
  res = [0]
  arr.each do |x|
    n = res.size
    merged = Array.new(n * 2)
    a = 0
    b = 0
    k = 0
    while a < n && b < n
      vb = res[b] + x
      if res[a] <= vb
        merged[k] = res[a]
        a += 1
      else
        merged[k] = vb
        b += 1
      end
      k += 1
    end
    while a < n
      merged[k] = res[a]
      a += 1
      k += 1
    end
    while b < n
      merged[k] = res[b] + x
      b += 1
      k += 1
    end
    res = merged
  end
  res
end

tokens = $stdin.read.split
exit if tokens.empty?
n = tokens[0].to_i
target = tokens[1].to_i
arr = Array.new(n) { |i| tokens[2 + i].to_i }

l_sums = gen_sorted_sums(arr[0, n / 2])
r_sums = gen_sorted_sums(arr[(n / 2)..])

ways = 0
i = 0
j = r_sums.size - 1
while i < l_sums.size && j >= 0
  s = l_sums[i] + r_sums[j]
  if s < target
    i += 1
  elsif s > target
    j -= 1
  else
    cl = 1
    while i + 1 < l_sums.size && l_sums[i + 1] == l_sums[i]
      cl += 1
      i += 1
    end
    cr = 1
    while j - 1 >= 0 && r_sums[j - 1] == r_sums[j]
      cr += 1
      j -= 1
    end
    ways += cl * cr
    i += 1
    j -= 1
  end
end
puts ways`,
  },
  practiceProblems: [
    {
      id: 'ch28-p1',
      tier: 'Warmup',
      ratingRange: '1600–1800',
      title: 'Subset Sum Closest to Target T (N <= 40)',
      statement:
        'Given N integers (potentially negative, positive, or zero) and an integer target T, select any subset of elements so that its sum S minimizes `|S - T|`, and output that minimum absolute difference `|S - T|`.',
      constraints: '1 <= N <= 40, -10^12 <= a_i, T <= 10^12',
      sampleInput: '5 10\n3 9 -4 2 15',
      sampleOutput: '0',
      hints: [
        'Split into two halves and generate all sorted subset sums `L` and `R` (remember empty subset `0` is allowed!).',
        'Use a standard two-pointer scan (`i` increasing from `0`, `j` decreasing from `R.size() - 1`): at every step update `best = min(best, abs(L[i] + R[j] - T))`; if `L[i] + R[j] < T` advance `i++`, else decrement `j--`.',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

vector<long long> gen_sorted(const vector<long long>& arr) {
    vector<long long> res = {0};
    for (long long x : arr) {
        vector<long long> added(res.size()), merged(res.size() * 2);
        for (size_t i = 0; i < res.size(); i++) added[i] = res[i] + x;
        merge(res.begin(), res.end(), added.begin(), added.end(), merged.begin());
        res.swap(merged);
    }
    return res;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    long long T;
    if (!(cin >> n >> T)) return 0;
    vector<long long> leftArr, rightArr;
    for (int i = 0; i < n; i++) {
        long long x;
        cin >> x;
        if (i < n / 2) leftArr.push_back(x);
        else rightArr.push_back(x);
    }

    auto L = gen_sorted(leftArr);
    auto R = gen_sorted(rightArr);
    long long best = llabs(T);
    size_t i = 0;
    long long j = (long long)R.size() - 1;
    while (i < L.size() && j >= 0) {
        long long s = L[i] + R[j];
        best = min(best, llabs(s - T));
        if (best == 0) break;
        if (s < T) i++;
        else j--;
    }
    cout << best << "\\n";
    return 0;
}`,
        rust: `use std::io::{self, Read};

fn gen_sorted(arr: &[i64]) -> Vec<i64> {
    let mut res = vec![0i64];
    for &x in arr {
        let mut merged = Vec::with_capacity(res.len() * 2);
        let (mut a, mut b) = (0usize, 0usize);
        let n = res.len();
        while a < n && b < n {
            let vb = res[b] + x;
            if res[a] <= vb { merged.push(res[a]); a += 1; } else { merged.push(vb); b += 1; }
        }
        while a < n { merged.push(res[a]); a += 1; }
        while b < n { merged.push(res[b] + x); b += 1; }
        res = merged;
    }
    res
}

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let n: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };
    let target: i64 = it.next().unwrap().parse().unwrap();
    let mut arr = Vec::with_capacity(n);
    for _ in 0..n { arr.push(it.next().unwrap().parse::<i64>().unwrap()); }

    let l = gen_sorted(&arr[..n / 2]);
    let r = gen_sorted(&arr[n / 2..]);
    let mut best = target.abs();
    let mut i = 0usize;
    let mut j: isize = (r.len() as isize) - 1;
    while i < l.len() && j >= 0 {
        let sum = l[i] + r[j as usize];
        best = best.min((sum - target).abs());
        if best == 0 { break; }
        if sum < target { i += 1; } else { j -= 1; }
    }
    println!("{}", best);
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
        long nextLong() throws IOException {
            int c = rb();
            while (c >= 0 && c <= ' ') c = rb();
            if (c == -1) return Long.MIN_VALUE;
            boolean neg = false;
            if (c == '-') { neg = true; c = rb(); }
            long v = 0;
            while (c > ' ') { v = v * 10 + (c - '0'); c = rb(); }
            return neg ? -v : v;
        }
        int nextInt() throws IOException { return (int) nextLong(); }
    }

    static long[] genSorted(long[] arr, int l, int r) {
        long[] res = {0L};
        for (int idx = l; idx < r; idx++) {
            long x = arr[idx];
            int n = res.length;
            long[] merged = new long[n * 2];
            int a = 0, b = 0, k = 0;
            while (a < n && b < n) {
                long vb = res[b] + x;
                if (res[a] <= vb) merged[k++] = res[a++];
                else { merged[k++] = vb; b++; }
            }
            while (a < n) merged[k++] = res[a++];
            while (b < n) merged[k++] = res[b++] + x;
            res = merged;
        }
        return res;
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        int n = fs.nextInt();
        if (n == Integer.MIN_VALUE) return;
        long target = fs.nextLong();
        long[] arr = new long[n];
        for (int i = 0; i < n; i++) arr[i] = fs.nextLong();
        long[] L = genSorted(arr, 0, n / 2);
        long[] R = genSorted(arr, n / 2, n);

        long best = Math.abs(target);
        int i = 0, j = R.length - 1;
        while (i < L.length && j >= 0) {
            long s = L[i] + R[j];
            best = Math.min(best, Math.abs(s - target));
            if (best == 0) break;
            if (s < target) i++;
            else j--;
        }
        System.out.println(best);
    }
}`,
        python3: `import sys

sys.setrecursionlimit(200000)

def gen_sorted(arr: list[int]) -> list[int]:
    res = [0]
    for x in arr:
        added = [v + x for v in res]
        merged = []
        a = b = 0
        n = len(res)
        while a < n and b < n:
            if res[a] <= added[b]:
                merged.append(res[a])
                a += 1
            else:
                merged.append(added[b])
                b += 1
        if a < n:
            merged.extend(res[a:])
        if b < n:
            merged.extend(added[b:])
        res = merged
    return res

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    n = int(next(it))
    target = int(next(it))
    arr = [int(next(it)) for _ in range(n)]

    L = gen_sorted(arr[: n // 2])
    R = gen_sorted(arr[n // 2 :])
    best = abs(target)
    i = 0
    j = len(R) - 1
    while i < len(L) and j >= 0:
        s = L[i] + R[j]
        diff = abs(s - target)
        if diff < best:
            best = diff
            if best == 0:
                break
        if s < target:
            i += 1
        else:
            j -= 1
    print(best)

if __name__ == "__main__":
    solve()`,
        ruby: `def gen_sorted(arr)
  res = [0]
  arr.each do |x|
    n = res.size
    merged = Array.new(n * 2)
    a = 0
    b = 0
    k = 0
    while a < n && b < n
      vb = res[b] + x
      if res[a] <= vb
        merged[k] = res[a]
        a += 1
      else
        merged[k] = vb
        b += 1
      end
      k += 1
    end
    while a < n
      merged[k] = res[a]
      a += 1
      k += 1
    end
    while b < n
      merged[k] = res[b] + x
      b += 1
      k += 1
    end
    res = merged
  end
  res
end

tokens = $stdin.read.split
exit if tokens.empty?
n = tokens[0].to_i
target = tokens[1].to_i
arr = Array.new(n) { |i| tokens[2 + i].to_i }

l_sums = gen_sorted(arr[0, n / 2])
r_sums = gen_sorted(arr[(n / 2)..])
best = target.abs
i = 0
j = r_sums.size - 1
while i < l_sums.size && j >= 0
  s = l_sums[i] + r_sums[j]
  diff = (s - target).abs
  best = diff if diff < best
  break if best == 0
  if s < target
    i += 1
  else
    j -= 1
  end
end
puts best`,
      },
    },
    {
      id: 'ch28-p2',
      tier: 'Standard',
      ratingRange: '1750–1950',
      title: 'Sum of Four Values (O(N^2 log N) Pair-Splitting Meet-in-the-Middle)',
      statement:
        'Given an array of N integers and target X, find four DISTINCT indices (1-based) i, j, k, l such that a[i] + a[j] + a[k] + a[l] == X, or output "IMPOSSIBLE" if no such quadruple exists.',
      constraints: '1 <= N <= 1000, 1 <= a[i], X <= 10^9',
      sampleInput: '8 15\n3 2 5 8 1 3 2 3',
      sampleOutput: '1 3 5 6',
      hints: [
        'Instead of putting all N*(N-1)/2 pairs into a single unordered_map (slow & risks index reuse), sweep `mid` from `0..N-1`: look up `X - (a[mid] + a[r])` among pairs `(i, j)` with `i < j < mid` BEFORE inserting `(i, mid)` for `i < mid`!',
        'Or sort all `(a[i] + a[j], i, j)` pairs once in `O(N^2 log N)` and use two pointers checking index disjointness. The online chronological `mid` sweep guarantees disjoint indices (`i < j < mid < r`) automatically without ANY index checks!',
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

    // Sort all left pairs? Chronological mid-sweep guarantees i < j < mid < r!
    vector<tuple<long long, int, int>> pairs;
    pairs.reserve((size_t)n * (n - 1) / 2);
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            pairs.emplace_back(a[i] + a[j], i, j);
        }
    }
    sort(pairs.begin(), pairs.end());

    long long L = 0, R = (long long)pairs.size() - 1;
    while (L < R) {
        long long sum = get<0>(pairs[L]) + get<0>(pairs[R]);
        if (sum < x) {
            L++;
        } else if (sum > x) {
            R--;
        } else {
            auto [s1, i1, j1] = pairs[L];
            // Scan equal values on R block for any disjoint pair
            long long ptr = R;
            while (ptr > L && get<0>(pairs[ptr]) == get<0>(pairs[R])) {
                auto [s2, i2, j2] = pairs[ptr];
                if (i1 != i2 && i1 != j2 && j1 != i2 && j1 != j2) {
                    cout << i1 + 1 << " " << j1 + 1 << " " << i2 + 1 << " " << j2 + 1 << "\\n";
                    return 0;
                }
                ptr--;
            }
            L++;
        }
    }
    cout << "IMPOSSIBLE\\n";
    return 0;
}`,
        rust: `use std::collections::HashMap;
use std::io::{self, Read};

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let n: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };
    let x: i64 = it.next().unwrap().parse().unwrap();
    let mut a = Vec::with_capacity(n);
    for _ in 0..n { a.push(it.next().unwrap().parse::<i64>().unwrap()); }

    let mut seen: HashMap<i64, (usize, usize)> = HashMap::with_capacity(n * n / 2);
    for mid in 1..n {
        for r in (mid + 1)..n {
            let need = x - a[mid] - a[r];
            if let Some(&(i, j)) = seen.get(&need) {
                println!("{} {} {} {}", i + 1, j + 1, mid + 1, r + 1);
                return;
            }
        }
        for i in 0..mid {
            seen.entry(a[i] + a[mid]).or_insert((i, mid));
        }
    }
    println!("IMPOSSIBLE");
}`,
        java21: `import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;

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
        long nextLong() throws IOException {
            int c = rb();
            while (c >= 0 && c <= ' ') c = rb();
            if (c == -1) return Long.MIN_VALUE;
            boolean neg = false;
            if (c == '-') { neg = true; c = rb(); }
            long v = 0;
            while (c > ' ') { v = v * 10 + (c - '0'); c = rb(); }
            return neg ? -v : v;
        }
        int nextInt() throws IOException { return (int) nextLong(); }
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        int n = fs.nextInt();
        if (n == Integer.MIN_VALUE) return;
        long x = fs.nextLong();
        long[] a = new long[n];
        for (int i = 0; i < n; i++) a[i] = fs.nextLong();

        HashMap<Long, Long> seen = new HashMap<>(n * n);
        for (int mid = 1; mid < n; mid++) {
            for (int r = mid + 1; r < n; r++) {
                long need = x - a[mid] - a[r];
                Long packed = seen.get(need);
                if (packed != null) {
                    int i = (int) (packed >>> 16);
                    int j = (int) (packed & 0xFFFFL);
                    System.out.println((i + 1) + " " + (j + 1) + " " + (mid + 1) + " " + (r + 1));
                    return;
                }
            }
            for (int i = 0; i < mid; i++) {
                seen.putIfAbsent(a[i] + a[mid], ((long) i << 16) | mid);
            }
        }
        System.out.println("IMPOSSIBLE");
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
    x = int(next(it))
    a = [int(next(it)) for _ in range(n)]

    seen: dict[int, tuple[int, int]] = {}
    for mid in range(1, n):
        am = a[mid]
        for r in range(mid + 1, n):
            need = x - am - a[r]
            if need in seen:
                i, j = seen[need]
                print(i + 1, j + 1, mid + 1, r + 1)
                return
        for i in range(mid):
            s = a[i] + am
            if s not in seen:
                seen[s] = (i, mid)
    print("IMPOSSIBLE")

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
n = tokens[0].to_i
x = tokens[1].to_i
a = Array.new(n) { |i| tokens[2 + i].to_i }

seen = {}
(1...n).each do |mid|
  am = a[mid]
  ((mid + 1)...n).each do |r|
    need = x - am - a[r]
    if seen.key?(need)
      i, j = seen[need]
      puts "#{i + 1} #{j + 1} #{mid + 1} #{r + 1}"
      exit
    end
  end
  mid.times do |i|
    s = a[i] + am
    seen[s] ||= [i, mid]
  end
end
puts "IMPOSSIBLE"`,
      },
    },
    {
      id: 'ch28-p3',
      tier: 'Boss',
      ratingRange: '2000–2250',
      title: 'Large-Weight 0/1 Knapsack via Meet-in-the-Middle & Pareto Pruning',
      statement:
        'You have N <= 40 items where item i has huge weight w_i (up to 10^9) and value v_i (up to 10^9), and a knapsack capacity W (up to 10^9). Maximize the total value of chosen items whose total weight does not exceed W.',
      constraints: '1 <= N <= 40, 1 <= w_i, v_i, W <= 10^9',
      sampleInput: '4 500000000\n200000000 10\n300000000 20\n400000000 25\n150000000 12',
      sampleOutput: '32',
      hints: [
        'Generate all `<= 2^20` `(weight, value)` pairs with `weight <= W` for Left and Right halves.',
        'Sort Right half ascending by `weight`, then compress it to a **strictly Pareto-optimal frontier** (drop any entry whose value is `<=` the max value seen at smaller weight!). Now for every `(wL, vL)` in Left, binary search (or two-pointer sweep!) the maximum `wR <= W - wL` in Right to get `vL + vR` in `O(1)` amortized per Left subset!',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    long long W;
    if (!(cin >> n >> W)) return 0;
    vector<pair<long long, long long>> items(n);
    for (int i = 0; i < n; i++) cin >> items[i].first >> items[i].second;

    int half = n / 2;
    auto gen_pareto = [&](int l, int r) {
        vector<pair<long long, long long>> cur = {{0, 0}};
        for (int i = l; i < r; i++) {
            auto [wi, vi] = items[i];
            vector<pair<long long, long long>> nxt;
            nxt.reserve(cur.size() * 2);
            size_t a = 0, b = 0;
            while (a < cur.size() || b < cur.size()) {
                bool takeA = false;
                if (a < cur.size() && b < cur.size()) {
                    long long wb = cur[b].first + wi;
                    if (wb > W) {
                        takeA = true;
                        b = cur.size(); // all further b exceed W too!
                    } else {
                        takeA = (cur[a].first <= wb);
                    }
                } else {
                    takeA = (a < cur.size());
                }
                pair<long long, long long> cand;
                if (takeA) {
                    cand = cur[a++];
                } else {
                    if (cur[b].first + wi > W) {
                        b = cur.size();
                        continue;
                    }
                    cand = {cur[b].first + wi, cur[b].second + vi};
                    b++;
                }
                if (nxt.empty() || cand.second > nxt.back().second) {
                    if (!nxt.empty() && nxt.back().first == cand.first) nxt.back().second = cand.second;
                    else nxt.push_back(cand);
                }
            }
            cur.swap(nxt);
        }
        return cur;
    };

    auto L = gen_pareto(0, half);
    auto R = gen_pareto(half, n);

    long long bestVal = 0;
    long long j = (long long)R.size() - 1;
    for (const auto& [wL, vL] : L) {
        while (j >= 0 && wL + R[j].first > W) j--;
        if (j >= 0) bestVal = max(bestVal, vL + R[j].second);
    }
    cout << bestVal << "\\n";
    return 0;
}`,
        rust: `use std::io::{self, Read};

fn gen_pareto(items: &[(i64, i64)], max_w: i64) -> Vec<(i64, i64)> {
    let mut cur = vec![(0i64, 0i64)];
    for &(wi, vi) in items {
        let mut nxt: Vec<(i64, i64)> = Vec::with_capacity(cur.len() * 2);
        let (mut a, mut b) = (0usize, 0usize);
        let m = cur.len();
        while a < m || b < m {
            let take_a = if a < m && b < m {
                let wb = cur[b].0 + wi;
                if wb > max_w {
                    b = m;
                    true
                } else {
                    cur[a].0 <= wb
                }
            } else {
                a < m
            };
            let cand = if take_a {
                let v = cur[a];
                a += 1;
                v
            } else {
                let wb = cur[b].0 + wi;
                if wb > max_w {
                    b = m;
                    continue;
                }
                let v = (wb, cur[b].1 + vi);
                b += 1;
                v
            };
            if let Some(last) = nxt.last_mut() {
                if cand.1 > last.1 {
                    if last.0 == cand.0 {
                        last.1 = cand.1;
                    } else {
                        nxt.push(cand);
                    }
                }
            } else {
                nxt.push(cand);
            }
        }
        cur = nxt;
    }
    cur
}

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let n: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };
    let max_w: i64 = it.next().unwrap().parse().unwrap();
    let mut items = Vec::with_capacity(n);
    for _ in 0..n {
        let w: i64 = it.next().unwrap().parse().unwrap();
        let v: i64 = it.next().unwrap().parse().unwrap();
        items.push((w, v));
    }

    let l = gen_pareto(&items[..n / 2], max_w);
    let r = gen_pareto(&items[n / 2..], max_w);

    let mut best = 0i64;
    let mut j: isize = (r.len() as isize) - 1;
    for &(wl, vl) in &l {
        while j >= 0 && wl + r[j as usize].0 > max_w {
            j -= 1;
        }
        if j >= 0 {
            best = best.max(vl + r[j as usize].1);
        }
    }
    println!("{}", best);
}`,
        java21: `import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Comparator;
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
        long nextLong() throws IOException {
            int c = rb();
            while (c >= 0 && c <= ' ') c = rb();
            if (c == -1) return Long.MIN_VALUE;
            boolean neg = false;
            if (c == '-') { neg = true; c = rb(); }
            long v = 0;
            while (c > ' ') { v = v * 10 + (c - '0'); c = rb(); }
            return neg ? -v : v;
        }
        int nextInt() throws IOException { return (int) nextLong(); }
    }

    static List<long[]> genPareto(long[] w, long[] v, int l, int r, long maxW) {
        List<long[]> raw = new ArrayList<>();
        raw.add(new long[]{0L, 0L});
        for (int i = l; i < r; i++) {
            int sz = raw.size();
            for (int k = 0; k < sz; k++) {
                long[] cur = raw.get(k);
                if (cur[0] + w[i] <= maxW) raw.add(new long[]{cur[0] + w[i], cur[1] + v[i]});
            }
            raw.sort(Comparator.comparingLong((long[] a) -> a[0]).thenComparingLong(a -> -a[1]));
            List<long[]> pareto = new ArrayList<>(raw.size());
            long bestV = -1;
            for (long[] cur : raw) {
                if (cur[1] > bestV) {
                    pareto.add(cur);
                    bestV = cur[1];
                }
            }
            raw = pareto;
        }
        return raw;
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        int n = fs.nextInt();
        if (n == Integer.MIN_VALUE) return;
        long W = fs.nextLong();
        long[] w = new long[n], v = new long[n];
        for (int i = 0; i < n; i++) {
            w[i] = fs.nextLong();
            v[i] = fs.nextLong();
        }
        List<long[]> L = genPareto(w, v, 0, n / 2, W);
        List<long[]> R = genPareto(w, v, n / 2, n, W);

        long best = 0;
        int j = R.size() - 1;
        for (long[] wl : L) {
            while (j >= 0 && wl[0] + R.get(j)[0] > W) j--;
            if (j >= 0) best = Math.max(best, wl[1] + R.get(j)[1]);
        }
        System.out.println(best);
    }
}`,
        python3: `import sys

sys.setrecursionlimit(200000)

def gen_pareto(items: list[tuple[int, int]], max_w: int) -> list[tuple[int, int]]:
    cur = [(0, 0)]
    for wi, vi in items:
        nxt = []
        a = b = 0
        m = len(cur)
        while a < m or b < m:
            if a < m and b < m:
                wb = cur[b][0] + wi
                if wb > max_w:
                    b = m
                    take_a = True
                else:
                    take_a = cur[a][0] <= wb
            else:
                take_a = a < m

            if take_a:
                cand = cur[a]
                a += 1
            else:
                wb = cur[b][0] + wi
                if wb > max_w:
                    b = m
                    continue
                cand = (wb, cur[b][1] + vi)
                b += 1

            if not nxt or cand[1] > nxt[-1][1]:
                if nxt and nxt[-1][0] == cand[0]:
                    nxt[-1] = cand
                else:
                    nxt.append(cand)
        cur = nxt
    return cur

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    n = int(next(it))
    max_w = int(next(it))
    items = [(int(next(it)), int(next(it))) for _ in range(n)]

    L = gen_pareto(items[: n // 2], max_w)
    R = gen_pareto(items[n // 2 :], max_w)

    best = 0
    j = len(R) - 1
    for wl, vl in L:
        while j >= 0 and wl + R[j][0] > max_w:
            j -= 1
        if j >= 0 and vl + R[j][1] > best:
            best = vl + R[j][1]
    print(best)

if __name__ == "__main__":
    solve()`,
        ruby: `def gen_pareto(items, max_w)
  cur = [[0, 0]]
  items.each do |wi, vi|
    nxt = []
    a = 0
    b = 0
    m = cur.size
    while a < m || b < m
      take_a = if a < m && b < m
                 wb = cur[b][0] + wi
                 if wb > max_w
                   b = m
                   true
                 else
                   cur[a][0] <= wb
                 end
               else
                 a < m
               end

      if take_a
        cand = cur[a]
        a += 1
      else
        wb = cur[b][0] + wi
        if wb > max_w
          b = m
          next
        end
        cand = [wb, cur[b][1] + vi]
        b += 1
      end

      if nxt.empty? || cand[1] > nxt[-1][1]
        if !nxt.empty? && nxt[-1][0] == cand[0]
          nxt[-1] = cand
        else
          nxt << cand
        end
      end
    end
    cur = nxt
  end
  cur
end

tokens = $stdin.read.split
exit if tokens.empty?
n = tokens[0].to_i
max_w = tokens[1].to_i
items = Array.new(n) { |i| [tokens[2 + 2 * i].to_i, tokens[3 + 2 * i].to_i] }

l_front = gen_pareto(items[0, n / 2], max_w)
r_front = gen_pareto(items[(n / 2)..], max_w)

best = 0
j = r_front.size - 1
l_front.each do |wl, vl|
  j -= 1 while j >= 0 && wl + r_front[j][0] > max_w
  best = [best, vl + r_front[j][1]].max if j >= 0
end
puts best`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'CSES',
      title: 'Meet in the Middle & Sum of Four Values',
      difficulty: 'Medium / Hard',
      url: 'https://cses.fi/problemset/task/1628',
      patternNote: 'Canonical `N <= 40` subset-sum count under tight 1.0s time limits (demands merge-sort / sorted vector over hash map).',
    },
    {
      platform: 'AtCoder',
      title: 'ABC 184 F — Programming Contest',
      difficulty: 'AtCoder Blue (~1650)',
      url: 'https://atcoder.jp/contests/abc184/tasks/abc184_f',
      patternNote: 'Purest `N <= 40, T <= 10^9` closest-subset-sum <= T via Meet-in-the-Middle.',
    },
    {
      platform: 'Codeforces',
      title: 'CF 888E — Maximum Subsequence / CF 1006F — Xor-Paths',
      difficulty: '1800–2100 (Div.2)',
      url: 'https://codeforces.com/problemset/problem/1006/F',
      patternNote: '2D grid paths (`N, M <= 20`) split along the anti-diagonal `(r + c == (N + M) / 2)` for `O(2^20)` Meet-in-the-Middle!',
    },
    {
      platform: 'CodeChef',
      title: 'SUBSUM / KNPSK40',
      difficulty: 'CodeChef 4-Star',
      url: 'https://www.codechef.com/problems/CD1IT5',
      patternNote: 'Large-weight knapsack (`W <= 10^9, N <= 40`) using Pareto-frontier monotonic pruning.',
    },
    {
      platform: 'HackerRank',
      title: 'Maximum Subarray Sum / Bidirectional Search Challenges',
      difficulty: 'Medium / Hard',
      url: 'https://www.hackerrank.com/challenges/maximum-subarray-sum/problem',
      patternNote: 'Modular closest-to-M subset pairing and bidirectional path splitting.',
    },
    {
      platform: 'NeetCode 150',
      title: 'Partition Equal Subset Sum / Closest Subsequence Sum (LC 1755)',
      difficulty: 'Hard',
      url: 'https://neetcode.io/practice',
      patternNote: 'Turns negative/large-value subset DP failures (`N <= 40`) into instant two-pointer Meet-in-the-Middle.',
    },
  ],
  interviewNotes: [
    'Whenever you see `N <= 40` in an interview or contest with no tight bound on `W` (like `10^9` or negative numbers), immediately think `2^(N/2) = 10^6`: Meet-in-the-Middle.',
    'Explain the merge-generation optimization: inserting elements one by one via two-way merge (`merge(cur, cur + x)`) keeps each half sorted in `O(2^(N/2))` total time, completely eliminating the `O(N/2)` factor of `std::sort`!',
    'In Large-Weight Knapsack, explain Pareto dominance: sorting by weight and dropping any state whose value fails to strictly exceed the previous max value simultaneously keeps arrays compact AND makes two-pointer merging valid without binary searching.',
  ],
  projectBlueprint: {
    title: 'Cryptographic Subset-Sum Brute-Force & Verification Analyzer',
    tagline:
      'Audit Merkle/knapsack hash preimages, closest-balance ledger reconciliations, and Pareto-optimal knapsack constraints up to N = 40 in milliseconds.',
    stackSummary: 'TypeScript Engine • Merge-Sorted Half Generator • Two-Pointer Exact Matcher • Pareto Knapsack Frontier',
    asciiDiagram: `40-Element Ledger / Key Vector [w_0 .. w_{N-1}]
          |
          +----------------------+----------------------+
          |                                             |
          v                                             v
   Left Half (N/2 <= 20)                        Right Half (N/2 <= 20)
[ Merge-Sort Generation O(2^20) ]          [ Merge-Sort Generation O(2^20) ]
          |                                             |
          +----------------------> <--------------------+
                                   |
                                   v
                [ Two-Pointer Audit / Pareto Frontier Merge ]`,
    milestones: [
      {
        id: 'ch28-m1',
        title: 'Implement O(2^(N/2)) Linear-Merge Subset Sum Generator',
        detail: 'Generate pre-sorted `Float64Array` / `BigInt[]` subset sums for each half without post-generation `Array.sort` overhead.',
      },
      {
        id: 'ch28-m2',
        title: 'Add Exact Audit Count & Closest Reconciliation Finder',
        detail: 'Compute both exact-match subset counts (with streak multiplicity) and minimum distance `|sum - target|` via two pointers.',
      },
      {
        id: 'ch28-m3',
        title: 'Integrate Witness Subset Reconstruction (Mask Recovery)',
        detail: 'Track compact 20-bit witness masks alongside sums when requested so auditors can inspect the exact colliding key combination.',
      },
      {
        id: 'ch28-m4',
        title: 'Build Pareto-Optimal Knapsack Solver for Constrained Audits',
        detail: 'Merge `(cost, utility)` frontiers across halves to return optimal bounded-budget selections up to `10^15` capacity.',
      },
    ],
    starterCode: `export interface SubsetAuditReport {
  exactMatchCount: number;
  closestDifference: number;
  witnessIndices: number[] | null;
}

export class SubsetVerificationAnalyzer {
  private static generateHalfWithMasks(nums: number[], offset: number) {
    let entries: { sum: number; mask: number }[] = [{ sum: 0, mask: 0 }];
    for (let i = 0; i < nums.length; i++) {
      const val = nums[i];
      const bit = 1 << i;
      const merged: { sum: number; mask: number }[] = new Array(entries.length * 2);
      let a = 0;
      let b = 0;
      let k = 0;
      const len = entries.length;
      while (a < len && b < len) {
        const vb = entries[b].sum + val;
        if (entries[a].sum <= vb) {
          merged[k++] = entries[a++];
        } else {
          merged[k++] = { sum: vb, mask: entries[b++].mask | bit };
        }
      }
      while (a < len) merged[k++] = entries[a++];
      while (b < len) {
        merged[k++] = { sum: entries[b].sum + val, mask: entries[b].mask | bit };
        b++;
      }
      entries = merged;
    }
    return { entries, offset };
  }

  static auditSubsetTarget(nums: number[], target: number): SubsetAuditReport {
    const mid = Math.floor(nums.length / 2);
    const left = this.generateHalfWithMasks(nums.slice(0, mid), 0).entries;
    const right = this.generateHalfWithMasks(nums.slice(mid), mid).entries;

    let exactMatchCount = 0;
    let closestDifference = Infinity;
    let bestMasks: [number, number] | null = null;

    let i = 0;
    let j = right.length - 1;
    while (i < left.length && j >= 0) {
      const s = left[i].sum + right[j].sum;
      const diff = Math.abs(s - target);
      if (diff < closestDifference) {
        closestDifference = diff;
        bestMasks = [left[i].mask, right[j].mask];
      }
      if (s < target) {
        i++;
      } else if (s > target) {
        j--;
      } else {
        let cL = 1;
        while (i + 1 < left.length && left[i + 1].sum === left[i].sum) {
          cL++;
          i++;
        }
        let cR = 1;
        while (j - 1 >= 0 && right[j - 1].sum === right[j].sum) {
          cR++;
          j--;
        }
        exactMatchCount += cL * cR;
        i++;
        j--;
      }
    }

    const witnessIndices: number[] | null = bestMasks
      ? [
          ...Array.from({ length: mid }, (_, idx) => ((bestMasks![0] & (1 << idx)) !== 0 ? idx : -1)),
          ...Array.from({ length: nums.length - mid }, (_, idx) =>
            (bestMasks![1] & (1 << idx)) !== 0 ? mid + idx : -1
          ),
        ].filter((idx) => idx !== -1)
      : null;

    return {
      exactMatchCount,
      closestDifference,
      witnessIndices,
    };
  }
}`,
  },
};
