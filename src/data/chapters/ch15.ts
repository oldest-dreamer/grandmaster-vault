import type { TheoryChapter } from '../../types/vault';

export const CH15_MONOTONIC_STACK_DEQUE: TheoryChapter = {
  slug: 'monotonic-stack-queue',
  topicId: 'ds-03',
  title: 'Monotonic Stack & Sliding-Window Deque',
  domain: 'Data Structures',
  ratingTier: '1400–1600',
  usacoDivision: 'Gold',
  subtitle:
    'Find nearest smaller/larger elements, histogram rectangles, and sliding-window minimums in strict amortized O(N) time—each index enters and exits the structure at most once.',
  analogyTitle: 'The Taller-Building Shadow & VIP Queue Eviction Analogy',
  analogyBody:
    'Imagine walking left-to-right past skyscrapers of heights [5, 2, 6, 3]. When you stand on a short building of height 2, any earlier building taller than 2 (like 5) is PERMANENTLY blocked from ever being the "nearest shorter building to the left" for future skyscrapers—so you kick height 5 off your stack immediately! Because every building gets pushed onto the stack once and popped at most once, the total work across all N skyscrapers is strictly O(N). A Sliding-Window Deque uses the exact same eviction trick with one extra front door: besides kicking out worse/larger elements from the back before pushing, it also evicts elements from the front as soon as their index slips outside the `[i - K + 1 .. i]` window!',
  prerequisites: [
    {
      slug: 'prefix-sums-difference-arrays',
      title: 'Prefix Sums, Difference Arrays & Invariants',
    },
  ],
  traceTitle: 'Interactive Monotonic Increasing Stack & Sliding Window Deque Trace',
  traceSubtitle:
    'Watch A = [4, 2, 5, 1, 3] update a monotonic stack for Nearest Smaller Left and a size-3 sliding window deque for window minimums.',
  allowDynamicGraphEdit: false,
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Step 1: Process i=0 (A[0]=4) -> Stack [0(4)], Deque [0(4)]',
      explanation:
        'Index 0 (value 4) enters an empty stack -> NSL[0] = -1 (none smaller on left). Window deque starts with [0].',
      mode: 'array',
      arrays: [
        {
          name: 'Input Array A[0..4]',
          cells: [
            { index: 0, value: 4, label: 'cur', highlight: 'active' },
            { index: 1, value: 2, highlight: 'neutral' },
            { index: 2, value: 5, highlight: 'neutral' },
            { index: 3, value: 1, highlight: 'neutral' },
            { index: 4, value: 3, highlight: 'neutral' },
          ],
        },
        {
          name: 'Nearest Smaller Left (NSL)',
          cells: [
            { index: 0, value: -1, label: 'none', highlight: 'updated' },
            { index: 1, value: '?', highlight: 'neutral' },
            { index: 2, value: '?', highlight: 'neutral' },
            { index: 3, value: '?', highlight: 'neutral' },
            { index: 4, value: '?', highlight: 'neutral' },
          ],
        },
      ],
      variables: { Index: 0, Stack: '[0(4)]', Deque: '[0(4)]', WindowK: 3 },
    },
    {
      stepNumber: 2,
      title: 'Step 2: Process i=1 (A[1]=2) -> Evict 0(4) From Back!',
      explanation:
        'Since A[0]=4 >= 2, index 0 can never be nearest smaller OR minimum of any future window containing index 1! Pop 0 from stack and deque, then push 1 -> NSL[1] = -1.',
      mode: 'array',
      arrays: [
        {
          name: 'Input Array A[0..4]',
          cells: [
            { index: 0, value: 4, label: 'evicted', highlight: 'neutral' },
            { index: 1, value: 2, label: 'cur', highlight: 'active' },
            { index: 2, value: 5, highlight: 'neutral' },
            { index: 3, value: 1, highlight: 'neutral' },
            { index: 4, value: 3, highlight: 'neutral' },
          ],
        },
        {
          name: 'Nearest Smaller Left (NSL)',
          cells: [
            { index: 0, value: -1, highlight: 'neutral' },
            { index: 1, value: -1, label: 'none', highlight: 'updated' },
            { index: 2, value: '?', highlight: 'neutral' },
            { index: 3, value: '?', highlight: 'neutral' },
            { index: 4, value: '?', highlight: 'neutral' },
          ],
        },
      ],
      variables: { Index: 1, Stack: '[1(2)]', Deque: '[1(2)]', Evicted: '0(4)' },
    },
    {
      stepNumber: 3,
      title: 'Step 3: Process i=2 (A[2]=5) -> First Full Window [0..2] Min = 2',
      explanation:
        'A[2]=5 > top 2, so nothing pops! NSL[2] = index 1 (value 2). Deque holds [1(2), 2(5)], so front element A[1]=2 is the minimum of window [0..2].',
      mode: 'array',
      arrays: [
        {
          name: 'Input Array A[0..4]',
          cells: [
            { index: 0, value: 4, highlight: 'window' },
            { index: 1, value: 2, label: 'winMin', highlight: 'window' },
            { index: 2, value: 5, label: 'cur', highlight: 'active' },
            { index: 3, value: 1, highlight: 'neutral' },
            { index: 4, value: 3, highlight: 'neutral' },
          ],
        },
        {
          name: 'Nearest Smaller Left (NSL)',
          cells: [
            { index: 0, value: -1, highlight: 'neutral' },
            { index: 1, value: -1, highlight: 'neutral' },
            { index: 2, value: 1, label: 'idx 1', highlight: 'updated' },
            { index: 3, value: '?', highlight: 'neutral' },
            { index: 4, value: '?', highlight: 'neutral' },
          ],
        },
      ],
      variables: { Index: 2, Stack: '[1(2), 2(5)]', Deque: '[1(2), 2(5)]', WinMin_0_2: 2 },
    },
    {
      stepNumber: 4,
      title: 'Step 4: Process i=3 (A[3]=1) & i=4 (A[4]=3) -> Complete NSL & Windows',
      explanation:
        'At i=3 (val 1), pop 2(5) and 1(2) -> NSL[3]=-1, window [1..3] min = 1. At i=4 (val 3), keep 3(1) -> NSL[4]=3, window [2..4] min = 1.',
      mode: 'array',
      arrays: [
        {
          name: 'Input Array A[0..4]',
          cells: [
            { index: 0, value: 4, highlight: 'neutral' },
            { index: 1, value: 2, highlight: 'neutral' },
            { index: 2, value: 5, highlight: 'window' },
            { index: 3, value: 1, label: 'winMin', highlight: 'window' },
            { index: 4, value: 3, label: 'cur', highlight: 'active' },
          ],
        },
        {
          name: 'Nearest Smaller Left (NSL)',
          cells: [
            { index: 0, value: -1, highlight: 'neutral' },
            { index: 1, value: -1, highlight: 'neutral' },
            { index: 2, value: 1, highlight: 'neutral' },
            { index: 3, value: -1, highlight: 'updated' },
            { index: 4, value: 3, label: 'idx 3', highlight: 'updated' },
          ],
        },
      ],
      variables: { Stack: '[3(1), 4(3)]', WindowMins: '[2, 1, 1]', Complexity: 'O(N)' },
    },
  ],
  reductionClues: [
    {
      clue: '"For each index i, find the nearest index j < i (or j > i) with A[j] < A[i]"',
      translation: 'Single-pass Monotonic Stack storing indices (strictly increasing heights for nearest smaller).',
    },
    {
      clue: '"Find the sum of min(subarray) or max(subarray) over ALL subarrays [L..R]"',
      translation: 'Contribution technique: compute strict NSL and non-strict NSR (or vice versa!) via monotonic stack; A[i] is minimum in (i - L[i]) * (R[i] - i) subarrays.',
    },
    {
      clue: '"DP transition dp[i] = cost(i) + min_{j in [i-K .. i-1]} dp[j]"',
      translation: 'Sliding-Window Monotonic Deque speeds up Knapsack / Bounded-Jump DP from O(NK) down to O(N)!',
    },
    {
      clue: '"Largest empty/solid rectangle in an N x M binary grid"',
      translation: 'Accumulate vertical consecutive 1s row-by-row into histogram heights h[col], then run Largest Rectangle in Histogram in O(M) per row.',
    },
  ],
  timeComplexity: 'O(N) amortized (each index pushed and popped at most once)',
  spaceComplexity: 'O(N)',
  pitfalls: [
    {
      type: 'WA',
      title: 'Double-Counting Equal Elements in Subarray Sum Contribution',
      detail:
        'If A = [2, 2], using `<` on BOTH left and right counts subarray [0..1] TWICE! Use strict `<` on one side (`<=` on the other) so ties break consistently by index.',
    },
    {
      type: 'WA',
      title: 'Storing Values Instead of Indices Inside the Stack / Deque',
      detail:
        'A sliding-window deque MUST store indices so you know when the front element falls outside `[i - K + 1 .. i]`, and histogram widths require `(R - L - 1)` from indices.',
    },
    {
      type: 'WA',
      title: 'Missing Sentinel Bar Height 0 at End of Histogram Loop',
      detail:
        'Bars still remaining on the stack at index N extend all the way to the right wall! Push a virtual `height = 0` at `i = N` (or drain the stack after the loop) so they get evaluated.',
    },
    {
      type: 'RE',
      title: 'Reading Deque Front Before Checking Window Expiry or Emptiness',
      detail:
        'Always evict out-of-window front indices (`dq.front() <= i - k`), pop dominated back elements, push `i`, and only emit answers once `i >= k - 1`.',
    },
  ],
  implementations: {
    cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, k;
    if (!(cin >> n >> k)) return 0;
    vector<long long> a(n);
    for (int i = 0; i < n; ++i) cin >> a[i];

    // 1. Sliding Window Minimum in O(N) using Monotonic Deque
    deque<int> dq;
    vector<long long> winMin;
    winMin.reserve(max(0, n - k + 1));
    for (int i = 0; i < n; ++i) {
        if (!dq.empty() && dq.front() <= i - k) dq.pop_front();
        while (!dq.empty() && a[dq.back()] >= a[i]) dq.pop_back();
        dq.push_back(i);
        if (i >= k - 1) winMin.push_back(a[dq.front()]);
    }

    // 2. Nearest Strictly Smaller Index on Left in O(N) using Monotonic Stack
    vector<int> nsl(n, -1);
    vector<int> st;
    for (int i = 0; i < n; ++i) {
        while (!st.empty() && a[st.back()] >= a[i]) st.pop_back();
        nsl[i] = st.empty() ? -1 : st.back() + 1; // 1-indexed (0 if none)
        if (nsl[i] == -1) nsl[i] = 0;
        st.push_back(i);
    }

    for (size_t i = 0; i < winMin.size(); ++i) {
        cout << winMin[i] << (i + 1 == winMin.size() ? '\\n' : ' ');
    }
    return 0;
}`,
    rust: `use std::collections::VecDeque;
use std::io::{self, Read};

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let n: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };
    let k: usize = it.next().unwrap().parse().unwrap();
    let a: Vec<i64> = (0..n).map(|_| it.next().unwrap().parse().unwrap()).collect();

    let mut dq: VecDeque<usize> = VecDeque::with_capacity(k);
    let mut win_min = Vec::with_capacity(n.saturating_sub(k) + 1);
    for i in 0..n {
        if let Some(&front) = dq.front() {
            if front + k <= i {
                dq.pop_front();
            }
        }
        while let Some(&back) = dq.back() {
            if a[back] >= a[i] {
                dq.pop_back();
            } else {
                break;
            }
        }
        dq.push_back(i);
        if i + 1 >= k {
            win_min.push(a[*dq.front().unwrap()].to_string());
        }
    }
    println!("{}", win_min.join(" "));
}`,
    java21: `import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayDeque;

public class Main {
    static class FastScanner {
        private final InputStream in = System.in;
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;

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
            while ((c = readByte()) <= 32) {
                if (c == -1) return Long.MIN_VALUE;
            }
            long sign = 1;
            if (c == '-') { sign = -1; c = readByte(); }
            long res = 0;
            while (c > 32) {
                res = res * 10 + (c - '0');
                c = readByte();
            }
            return res * sign;
        }

        int nextInt() throws IOException { return (int) nextLong(); }
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        long first = fs.nextLong();
        if (first == Long.MIN_VALUE) return;
        int n = (int) first;
        int k = fs.nextInt();
        long[] a = new long[n];
        for (int i = 0; i < n; i++) a[i] = fs.nextLong();

        int[] dq = new int[n];
        int head = 0, tail = 0;
        StringBuilder sb = new StringBuilder();

        for (int i = 0; i < n; i++) {
            if (head < tail && dq[head] <= i - k) head++;
            while (head < tail && a[dq[tail - 1]] >= a[i]) tail--;
            dq[tail++] = i;
            if (i >= k - 1) {
                if (i > k - 1) sb.append(' ');
                sb.append(a[dq[head]]);
            }
        }
        System.out.println(sb);
    }
}`,
    python3: `from collections import deque
import sys

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.buffer.read().split()
    if not data:
        return
    it = iter(data)
    n = int(next(it))
    k = int(next(it))
    a = [int(next(it)) for _ in range(n)]

    dq = deque()
    out = []
    for i, val in enumerate(a):
        if dq and dq[0] <= i - k:
            dq.popleft()
        while dq and a[dq[-1]] >= val:
            dq.pop()
        dq.append(i)
        if i >= k - 1:
            out.append(str(a[dq[0]]))

    sys.stdout.write(" ".join(out) + "\\n")

if __name__ == "__main__":
    solve()`,
    ruby: `data = STDIN.read.split.map(&:to_i)
exit if data.empty?
n = data[0]
k = data[1]
a = data[2, n]

dq = []
head = 0
out = []

n.times do |i|
  head += 1 if head < dq.size && dq[head] <= i - k
  dq.pop while head < dq.size && a[dq[-1]] >= a[i]
  dq << i
  out << a[dq[head]] if i >= k - 1
end

puts out.join(" ")`,
  },
  practiceProblems: [
    {
      id: 'ds03-p1',
      tier: 'Warmup',
      ratingRange: '1250–1450',
      title: 'Sliding Window Minimum in O(N)',
      statement:
        'Given an array A of N integers and a window width K, print the minimum value of every contiguous subarray A[i..i+K-1] for i = 0..N-K in O(N) time.',
      constraints: '1 <= K <= N <= 10^6, |A[i]| <= 10^9.',
      sampleInput: `8 3
1 3 -1 -3 5 3 6 7`,
      sampleOutput: `-1 -3 -3 -3 3 6`,
      hints: [
        'Maintain a deque of indices whose corresponding values A[idx] are strictly increasing from front to back.',
        'At index i: pop front if `dq.front() <= i - K`, pop back while `A[dq.back()] >= A[i]`, push `i`, and record `A[dq.front()]` once `i >= K - 1`.',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, k;
    if (!(cin >> n >> k)) return 0;
    vector<long long> a(n);
    for (int i = 0; i < n; ++i) cin >> a[i];
    deque<int> dq;
    for (int i = 0; i < n; ++i) {
        if (!dq.empty() && dq.front() <= i - k) dq.pop_front();
        while (!dq.empty() && a[dq.back()] >= a[i]) dq.pop_back();
        dq.push_back(i);
        if (i >= k - 1) cout << a[dq.front()] << (i == n - 1 ? '\\n' : ' ');
    }
    return 0;
}`,
        rust: `use std::collections::VecDeque;
use std::io::{self, Read};

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let n: usize = match it.next() { Some(x) => x.parse().unwrap(), None => return };
    let k: usize = it.next().unwrap().parse().unwrap();
    let a: Vec<i64> = (0..n).map(|_| it.next().unwrap().parse().unwrap()).collect();
    let mut dq = VecDeque::new();
    let mut out = Vec::with_capacity(n - k + 1);
    for i in 0..n {
        if let Some(&f) = dq.front() { if f + k <= i { dq.pop_front(); } }
        while let Some(&b) = dq.back() {
            if a[b] >= a[i] { dq.pop_back(); } else { break; }
        }
        dq.push_back(i);
        if i + 1 >= k { out.push(a[*dq.front().unwrap()].to_string()); }
    }
    println!("{}", out.join(" "));
}`,
        java21: `import java.io.*;

public class Main {
    static class FastScanner {
        private final InputStream in = System.in;
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;
        int read() throws IOException {
            if (ptr >= len) { len = in.read(buf); ptr = 0; if (len <= 0) return -1; }
            return buf[ptr++];
        }
        long nextLong() throws IOException {
            int c; while ((c = read()) <= 32) if (c == -1) return Long.MIN_VALUE;
            long s = 1; if (c == '-') { s = -1; c = read(); }
            long v = 0; while (c > 32) { v = v * 10 + (c - '0'); c = read(); }
            return v * s;
        }
        int nextInt() throws IOException { return (int) nextLong(); }
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        long f = fs.nextLong(); if (f == Long.MIN_VALUE) return;
        int n = (int) f, k = fs.nextInt();
        long[] a = new long[n];
        for (int i = 0; i < n; i++) a[i] = fs.nextLong();
        int[] dq = new int[n];
        int head = 0, tail = 0;
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) {
            if (head < tail && dq[head] <= i - k) head++;
            while (head < tail && a[dq[tail - 1]] >= a[i]) tail--;
            dq[tail++] = i;
            if (i >= k - 1) {
                if (i > k - 1) sb.append(' ');
                sb.append(a[dq[head]]);
            }
        }
        System.out.println(sb);
    }
}`,
        python3: `from collections import deque
import sys
sys.setrecursionlimit(200000)

def solve():
    data = sys.stdin.buffer.read().split()
    if not data: return
    it = iter(data)
    n, k = int(next(it)), int(next(it))
    a = [int(next(it)) for _ in range(n)]
    dq = deque()
    out = []
    for i, x in enumerate(a):
        if dq and dq[0] <= i - k: dq.popleft()
        while dq and a[dq[-1]] >= x: dq.pop()
        dq.append(i)
        if i >= k - 1: out.append(str(a[dq[0]]))
    sys.stdout.write(" ".join(out) + "\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `data = STDIN.read.split.map(&:to_i)
exit if data.empty?
n = data[0]; k = data[1]; a = data[2, n]
dq = []; head = 0; out = []
n.times do |i|
  head += 1 if head < dq.size && dq[head] <= i - k
  dq.pop while head < dq.size && a[dq[-1]] >= a[i]
  dq << i
  out << a[dq[head]] if i >= k - 1
end
puts out.join(" ")`,
      },
    },
    {
      id: 'ds03-p2',
      tier: 'Standard',
      ratingRange: '1400–1600',
      title: 'Largest Rectangle in Histogram & Maximal Empty Submatrix',
      statement:
        'Given an N x M grid of `.` (empty) and `*` (blocked) cells, compute the maximum area of an axis-aligned rectangle containing only `.` cells.',
      constraints: '1 <= N, M <= 1000.',
      sampleInput: `4 7
...*.*.
.*.....
.......
......*`,
      sampleOutput: `12`,
      hints: [
        'Process rows top-to-bottom maintaining `h[c]`, the count of consecutive `.` cells upward ending at row r.',
        'For each row, run the O(M) monotonic-stack Largest Rectangle in Histogram pass over `h[0..M-1]` using a trailing sentinel `0`.',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    if (!(cin >> n >> m)) return 0;
    vector<int> h(m + 1, 0), st;
    long long best = 0;
    for (int r = 0; r < n; ++r) {
        string row;
        cin >> row;
        for (int c = 0; c < m; ++c) h[c] = (row[c] == '.') ? h[c] + 1 : 0;
        st.clear();
        for (int c = 0; c <= m; ++c) {
            int curH = h[c]; // h[m] == 0 acts as sentinel
            while (!st.empty() && h[st.back()] >= curH) {
                int height = h[st.back()];
                st.pop_back();
                int left = st.empty() ? -1 : st.back();
                best = max(best, 1LL * height * (c - left - 1));
            }
            st.push_back(c);
        }
    }
    cout << best << '\\n';
    return 0;
}`,
        rust: `use std::io::{self, Read};

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let n: usize = match it.next() { Some(x) => x.parse().unwrap(), None => return };
    let m: usize = it.next().unwrap().parse().unwrap();
    let mut h = vec![0i64; m + 1];
    let mut st: Vec<usize> = Vec::with_capacity(m + 1);
    let mut best = 0i64;
    for _ in 0..n {
        let row = it.next().unwrap().as_bytes();
        for c in 0..m {
            h[c] = if row[c] == b'.' { h[c] + 1 } else { 0 };
        }
        st.clear();
        for c in 0..=m {
            let cur_h = h[c];
            while let Some(&top) = st.last() {
                if h[top] >= cur_h {
                    st.pop();
                    let left = st.last().map(|&x| x as i64).unwrap_or(-1);
                    let area = h[top] * (c as i64 - left - 1);
                    if area > best { best = area; }
                } else {
                    break;
                }
            }
            st.push(c);
        }
    }
    println!("{}", best);
}`,
        java21: `import java.io.*;

public class Main {
    static class FastScanner {
        private final InputStream in = System.in;
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;
        int read() throws IOException {
            if (ptr >= len) { len = in.read(buf); ptr = 0; if (len <= 0) return -1; }
            return buf[ptr++];
        }
        String nextToken() throws IOException {
            int c; while ((c = read()) <= 32) if (c == -1) return null;
            StringBuilder sb = new StringBuilder();
            while (c > 32) { sb.append((char) c); c = read(); }
            return sb.toString();
        }
        int nextInt() throws IOException { return Integer.parseInt(nextToken()); }
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        String f = fs.nextToken(); if (f == null) return;
        int n = Integer.parseInt(f), m = fs.nextInt();
        int[] h = new int[m + 1];
        int[] st = new int[m + 1];
        long best = 0;
        for (int r = 0; r < n; r++) {
            String row = fs.nextToken();
            for (int c = 0; c < m; c++) h[c] = row.charAt(c) == '.' ? h[c] + 1 : 0;
            int top = 0;
            for (int c = 0; c <= m; c++) {
                int curH = h[c];
                while (top > 0 && h[st[top - 1]] >= curH) {
                    int height = h[st[--top]];
                    int left = top == 0 ? -1 : st[top - 1];
                    best = Math.max(best, (long) height * (c - left - 1));
                }
                st[top++] = c;
            }
        }
        System.out.println(best);
    }
}`,
        python3: `import sys
sys.setrecursionlimit(200000)

def solve():
    data = sys.stdin.buffer.read().split()
    if not data: return
    it = iter(data)
    n, m = int(next(it)), int(next(it))
    h = [0] * (m + 1)
    best = 0
    for _ in range(n):
        row = next(it)
        for c in range(m):
            h[c] = h[c] + 1 if row[c] == 46 else 0  # ord('.') == 46
        st = []
        for c in range(m + 1):
            cur_h = h[c]
            while st and h[st[-1]] >= cur_h:
                height = h[st.pop()]
                left = st[-1] if st else -1
                area = height * (c - left - 1)
                if area > best: best = area
            st.append(c)
    print(best)

if __name__ == "__main__":
    solve()`,
        ruby: `toks = STDIN.read.split
exit if toks.empty?
n = toks[0].to_i; m = toks[1].to_i
h = Array.new(m + 1, 0)
best = 0
n.times do |r|
  row = toks[2 + r]
  m.times { |c| h[c] = row.getbyte(c) == 46 ? h[c] + 1 : 0 }
  st = []
  (0..m).each do |c|
    cur_h = h[c]
    while !st.empty? && h[st[-1]] >= cur_h
      height = h[st.pop]
      left = st.empty? ? -1 : st[-1]
      area = height * (c - left - 1)
      best = area if area > best
    end
    st << c
  end
end
puts best`,
      },
    },
    {
      id: 'ds03-p3',
      tier: 'Boss',
      ratingRange: '1650–1850',
      title: 'Circular Subarray Minimum Sums Across Query Ranges (Offline Sweep)',
      statement:
        'Given an array A[0..N-1] wrapped circularly and Q queries (L_i, R_i) (where 0 <= L_i <= R_i < N and we count subarrays inside [L_i..R_i], plus optional circular wrap check via doubling A+A for linear contiguous queries of length <= N), answer for each query [L, R] the sum of minimum elements over ALL contiguous subarrays contained completely inside [L, R]!',
      constraints: '1 <= N, Q <= 10^5, 1 <= A[i] <= 10^9.',
      sampleInput: `4 2
3 1 2 4
0 3
1 3`,
      sampleOutput: `17
10`,
      hints: [
        'Use a monotonic stack to find for each index i its Nearest Strictly Smaller Left `L_bound[i]` and Nearest Smaller-or-Equal Right `R_bound[i]`.',
        'Equivalently for offline right-endpoint sweep `r = 0..N-1`: maintain prefix/segment-tree values `contrib[l]` equal to `min(A[l..r])`. When pushing `A[r]`, popping `A[top]` off the monotonic stack overwrites `[prev_top + 1 .. top]` with constant `A[r]`, and querying query `(ql, r)` sums `contrib[ql..r]` across history using a Lazy Segment Tree storing cumulative historical sums!',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

// Clean 2-Fenwick / Monotonic-Stack Offline Interval Contribution Sweep in O((N + Q) log N):
// Every monotonic stack rectangle [L_i..i] x [i..R_i] adds A[i] to queries [ql, qr] using 2D offline prefix sums.
struct BIT {
    int n;
    vector<long long> b0, b1;
    explicit BIT(int n) : n(n), b0(n + 2, 0), b1(n + 2, 0) {}
    void add(vector<long long>& b, int i, long long v) { for (++i; i <= n + 1; i += i & -i) b[i] += v; }
    long long qry(const vector<long long>& b, int i) const { long long s = 0; for (++i; i > 0; i -= i & -i) s += b[i]; return s; }
    void rangeAdd(int l, int r, long long v) {
        if (l > r) return;
        add(b0, l, v); add(b0, r + 1, -v);
        add(b1, l, v * (l - 1)); add(b1, r + 1, -v * r);
    }
    long long pref(int x) const { return qry(b0, x) * x - qry(b1, x); }
    long long rangeSum(int l, int r) const { return l > r ? 0 : pref(r) - pref(l - 1); }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, q;
    if (!(cin >> n >> q)) return 0;
    vector<long long> a(n);
    for (int i = 0; i < n; ++i) cin >> a[i];

    vector<vector<pair<int, int>>> byR(n);
    for (int i = 0; i < q; ++i) {
        int l, r; cin >> l >> r;
        byR[r].push_back({l, i});
    }

    // Track stack of intervals (start, end, val) with monotonic stack
    // When sweeping r, curSumBIT holds current min(A[j..r]) at index j.
    // HistSum(l, r) = sum_{t=0..r} cur[t] evaluated offline via:
    // val * (r_current + 1 - entry_time) -> linear in r: (t_coef * r + const_coef)!
    BIT slopeBit(n), constBit(n);
    struct Seg { int l, r; long long v; };
    vector<Seg> st;
    vector<long long> ans(q, 0);

    for (int r = 0; r < n; ++r) {
        int newL = r;
        while (!st.empty() && st.back().v >= a[r]) {
            auto seg = st.back(); st.pop_back();
            newL = seg.l;
            // Remove seg.v starting from current time r (kept contributions for <= r-1)
            slopeBit.rangeAdd(seg.l, seg.r, -seg.v);
            constBit.rangeAdd(seg.l, seg.r, seg.v * (r - 1));
        }
        st.push_back({newL, r, a[r]});
        slopeBit.rangeAdd(newL, r, a[r]);
        constBit.rangeAdd(newL, r, -a[r] * (r - 1));

        for (auto [ql, qi] : byR[r]) {
            ans[qi] = slopeBit.rangeSum(ql, r) * r + constBit.rangeSum(ql, r);
        }
    }
    for (long long v : ans) cout << v << '\\n';
    return 0;
}`,
        rust: `use std::io::{self, Read};

struct RangeBit {
    n: usize,
    b0: Vec<i64>,
    b1: Vec<i64>,
}

impl RangeBit {
    fn new(n: usize) -> Self {
        Self { n, b0: vec![0; n + 3], b1: vec![0; n + 3] }
    }
    fn add_raw(b: &mut [i64], mut i: usize, v: i64) {
        i += 1;
        while i < b.len() { b[i] += v; i += i & i.wrapping_neg(); }
    }
    fn qry_raw(b: &[i64], mut i: i64) -> i64 {
        let mut s = 0;
        let mut idx = (i + 1) as usize;
        while idx > 0 { s += b[idx]; idx -= idx & idx.wrapping_neg(); }
        s
    }
    fn range_add(&mut self, l: usize, r: usize, v: i64) {
        if l > r { return; }
        let li = l as i64;
        let ri = r as i64;
        Self::add_raw(&mut self.b0, l, v);
        Self::add_raw(&mut self.b0, r + 1, -v);
        Self::add_raw(&mut self.b1, l, v * (li - 1));
        Self::add_raw(&mut self.b1, r + 1, -v * ri);
    }
    fn pref(&self, x: i64) -> i64 {
        if x < 0 { return 0; }
        Self::qry_raw(&self.b0, x) * x - Self::qry_raw(&self.b1, x)
    }
    fn range_sum(&self, l: usize, r: usize) -> i64 {
        if l > r { return 0; }
        self.pref(r as i64) - self.pref(l as i64 - 1)
    }
}

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let n: usize = match it.next() { Some(x) => x.parse().unwrap(), None => return };
    let q: usize = it.next().unwrap().parse().unwrap();
    let a: Vec<i64> = (0..n).map(|_| it.next().unwrap().parse().unwrap()).collect();
    let mut by_r = vec![Vec::<(usize, usize)>::new(); n];
    for qi in 0..q {
        let l: usize = it.next().unwrap().parse().unwrap();
        let r: usize = it.next().unwrap().parse().unwrap();
        by_r[r].push((l, qi));
    }
    let mut slope_bit = RangeBit::new(n);
    let mut const_bit = RangeBit::new(n);
    let mut st: Vec<(usize, usize, i64)> = Vec::new();
    let mut ans = vec![0i64; q];
    for r in 0..n {
        let mut new_l = r;
        let ri = r as i64;
        while let Some(&(sl, sr, sv)) = st.last() {
            if sv >= a[r] {
                st.pop();
                new_l = sl;
                slope_bit.range_add(sl, sr, -sv);
                const_bit.range_add(sl, sr, sv * (ri - 1));
            } else { break; }
        }
        st.push((new_l, r, a[r]));
        slope_bit.range_add(new_l, r, a[r]);
        const_bit.range_add(new_l, r, -a[r] * (ri - 1));
        for &(ql, qi) in &by_r[r] {
            ans[qi] = slope_bit.range_sum(ql, r) * ri + const_bit.range_sum(ql, r);
        }
    }
    for v in ans { println!("{}", v); }
}`,
        java21: `import java.io.*;
import java.util.*;

public class Main {
    static class FastScanner {
        private final InputStream in = System.in;
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;
        int read() throws IOException {
            if (ptr >= len) { len = in.read(buf); ptr = 0; if (len <= 0) return -1; }
            return buf[ptr++];
        }
        long nextLong() throws IOException {
            int c; while ((c = read()) <= 32) if (c == -1) return Long.MIN_VALUE;
            long s = 1; if (c == '-') { s = -1; c = read(); }
            long v = 0; while (c > 32) { v = v * 10 + (c - '0'); c = read(); }
            return v * s;
        }
        int nextInt() throws IOException { return (int) nextLong(); }
    }

    static class RangeBit {
        final int n;
        final long[] b0, b1;
        RangeBit(int n) { this.n = n; b0 = new long[n + 3]; b1 = new long[n + 3]; }
        void add(long[] b, int i, long v) { for (i++; i < b.length; i += i & -i) b[i] += v; }
        long qry(long[] b, int i) { long s = 0; for (i++; i > 0; i -= i & -i) s += b[i]; return s; }
        void rangeAdd(int l, int r, long v) {
            if (l > r) return;
            add(b0, l, v); add(b0, r + 1, -v);
            add(b1, l, v * (l - 1L)); add(b1, r + 1, -v * (long) r);
        }
        long pref(int x) { return x < 0 ? 0 : qry(b0, x) * x - qry(b1, x); }
        long rangeSum(int l, int r) { return l > r ? 0 : pref(r) - pref(l - 1); }
    }

    @SuppressWarnings("unchecked")
    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        long f = fs.nextLong(); if (f == Long.MIN_VALUE) return;
        int n = (int) f, q = fs.nextInt();
        long[] a = new long[n];
        for (int i = 0; i < n; i++) a[i] = fs.nextLong();
        ArrayList<int[]>[] byR = new ArrayList[n];
        for (int i = 0; i < n; i++) byR[i] = new ArrayList<>();
        for (int i = 0; i < q; i++) {
            int l = fs.nextInt(), r = fs.nextInt();
            byR[r].add(new int[]{l, i});
        }
        RangeBit slopeBit = new RangeBit(n), constBit = new RangeBit(n);
        int[] stL = new int[n], stR = new int[n]; long[] stV = new long[n];
        int top = 0;
        long[] ans = new long[q];
        for (int r = 0; r < n; r++) {
            int newL = r;
            while (top > 0 && stV[top - 1] >= a[r]) {
                top--;
                newL = stL[top];
                slopeBit.rangeAdd(stL[top], stR[top], -stV[top]);
                constBit.rangeAdd(stL[top], stR[top], stV[top] * (r - 1L));
            }
            stL[top] = newL; stR[top] = r; stV[top] = a[r]; top++;
            slopeBit.rangeAdd(newL, r, a[r]);
            constBit.rangeAdd(newL, r, -a[r] * (r - 1L));
            for (int[] qry : byR[r]) {
                ans[qry[1]] = slopeBit.rangeSum(qry[0], r) * r + constBit.rangeSum(qry[0], r);
            }
        }
        StringBuilder sb = new StringBuilder();
        for (long v : ans) sb.append(v).append('\\n');
        System.out.print(sb);
    }
}`,
        python3: `import sys
sys.setrecursionlimit(200000)

class RangeBit:
    def __init__(self, n):
        self.n = n
        self.b0 = [0] * (n + 3)
        self.b1 = [0] * (n + 3)

    def _add(self, b, i, v):
        i += 1
        m = len(b)
        while i < m:
            b[i] += v
            i += i & -i

    def _qry(self, b, i):
        s = 0
        i += 1
        while i > 0:
            s += b[i]
            i -= i & -i
        return s

    def range_add(self, l, r, v):
        if l > r: return
        self._add(self.b0, l, v)
        self._add(self.b0, r + 1, -v)
        self._add(self.b1, l, v * (l - 1))
        self._add(self.b1, r + 1, -v * r)

    def pref(self, x):
        return 0 if x < 0 else self._qry(self.b0, x) * x - self._qry(self.b1, x)

    def range_sum(self, l, r):
        return 0 if l > r else self.pref(r) - self.pref(l - 1)

def solve():
    data = sys.stdin.buffer.read().split()
    if not data: return
    it = iter(data)
    n, q = int(next(it)), int(next(it))
    a = [int(next(it)) for _ in range(n)]
    by_r = [[] for _ in range(n)]
    for qi in range(q):
        l, r = int(next(it)), int(next(it))
        by_r[r].append((l, qi))

    slope_bit = RangeBit(n)
    const_bit = RangeBit(n)
    st = []
    ans = [0] * q
    for r in range(n):
        new_l = r
        while st and st[-1][2] >= a[r]:
            sl, sr, sv = st.pop()
            new_l = sl
            slope_bit.range_add(sl, sr, -sv)
            const_bit.range_add(sl, sr, sv * (r - 1))
        st.append((new_l, r, a[r]))
        slope_bit.range_add(new_l, r, a[r])
        const_bit.range_add(new_l, r, -a[r] * (r - 1))
        for ql, qi in by_r[r]:
            ans[qi] = slope_bit.range_sum(ql, r) * r + const_bit.range_sum(ql, r)
    sys.stdout.write("\\n".join(map(str, ans)) + "\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `class RangeBit
  def initialize(n)
    @b0 = Array.new(n + 3, 0)
    @b1 = Array.new(n + 3, 0)
  end

  def add_raw(b, i, v)
    i += 1
    while i < b.size
      b[i] += v
      i += i & -i
    end
  end

  def qry_raw(b, i)
    s = 0; i += 1
    while i > 0
      s += b[i]
      i -= i & -i
    end
    s
  end

  def range_add(l, r, v)
    return if l > r
    add_raw(@b0, l, v); add_raw(@b0, r + 1, -v)
    add_raw(@b1, l, v * (l - 1)); add_raw(@b1, r + 1, -v * r)
  end

  def pref(x)
    x < 0 ? 0 : qry_raw(@b0, x) * x - qry_raw(@b1, x)
  end

  def range_sum(l, r)
    l > r ? 0 : pref(r) - pref(l - 1)
  end
end

data = STDIN.read.split.map(&:to_i)
exit if data.empty?
idx = 0; n = data[idx]; q = data[idx + 1]; idx += 2
a = data[idx, n]; idx += n
by_r = Array.new(n) { [] }
q.times do |qi|
  l = data[idx]; r = data[idx + 1]; idx += 2
  by_r[r] << [l, qi]
end
slope_bit = RangeBit.new(n)
const_bit = RangeBit.new(n)
st = []
ans = Array.new(q, 0)
n.times do |r|
  new_l = r
  while !st.empty? && st[-1][2] >= a[r]
    sl, sr, sv = st.pop
    new_l = sl
    slope_bit.range_add(sl, sr, -sv)
    const_bit.range_add(sl, sr, sv * (r - 1))
  end
  st << [new_l, r, a[r]]
  slope_bit.range_add(new_l, r, a[r])
  const_bit.range_add(new_l, r, -a[r] * (r - 1))
  by_r[r].each { |ql, qi| ans[qi] = slope_bit.range_sum(ql, r) * r + const_bit.range_sum(ql, r) }
end
puts ans.join("\\n")`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'CSES',
      title: 'Nearest Smaller Values & Advertisement',
      difficulty: 'USACO Gold (1350–1600)',
      url: 'https://cses.fi/problemset/task/1645',
      patternNote: 'Nearest Smaller Values + Largest Rectangle in Histogram (Advertisement) side-by-side.',
    },
    {
      platform: 'AtCoder',
      title: 'EDPC Z (Frog 3) & ABC189 C (Mandarin Orange)',
      difficulty: 'AtCoder Green / Cyan (~1300)',
      url: 'https://atcoder.jp/contests/abc189/tasks/abc189_c',
      patternNote: 'Monotonic stack spans compute max(min(l..r) * (r - l + 1)) in O(N).',
    },
    {
      platform: 'Codeforces',
      title: 'CF 547B Mike and Feet & CF 1313C2 Skyscrapers',
      difficulty: 'CF 1900',
      url: 'https://codeforces.com/problemset/problem/547/B',
      patternNote: '547B maps every monotonic-stack interval length (R - L - 1) to max minimum height.',
    },
    {
      platform: 'CodeChef',
      title: 'HISTOGRA / CHFQUEUE (Monotonic Stack Classics)',
      difficulty: 'CodeChef 3★–4★',
      url: 'https://www.codechef.com/tags/problems/stack',
      patternNote: 'Standard monotonic stack left/right dominance span problems.',
    },
    {
      platform: 'HackerRank',
      title: 'Largest Rectangle & Waiter / Stock Span',
      difficulty: 'Medium',
      url: 'https://www.hackerrank.com/challenges/largest-rectangle',
      patternNote: 'Direct O(N) histogram rectangle benchmark.',
    },
    {
      platform: 'NeetCode 150',
      title: 'Daily Temperatures, Largest Rectangle in Histogram & Sliding Window Max',
      difficulty: 'FAANG Medium / Hard',
      url: 'https://leetcode.com/problems/largest-rectangle-in-histogram/',
      patternNote: 'Three top FAANG Stack & Sliding Window Deque questions.',
    },
  ],
  interviewNotes: [
    'Clearly explain the amortized O(1) push/pop proof: each index enters once and leaves once across the whole scan, so total pops <= N.',
    'Highlight why tie-breaking (`<` on left, `<=` on right) prevents double-counting equal values when summing subarray minimums/maximums.',
  ],
  projectBlueprint: {
    title: 'Stock Candlestick Span & Real-Time Anomaly Detector',
    tagline:
      'Compute live K-tick rolling drawdown extremes in O(1) amortized time per tick and measure breakout support spans with a monotonic price stack.',
    stackSummary: 'TypeScript + Circular Ring-Buffer Monotonic Deque + Support-Span Stack',
    asciiDiagram:
      'Price Tick Stream ──▶ [Monotonic Sliding Deque (W ticks)] ──▶ Rolling High/Low & Drawdown\n' +
      '                  └──▶ [Monotonic Support Stack]         ──▶ Days-Since-Lower-Low Span',
    milestones: [
      {
        id: 'ch15-m1',
        title: 'Milestone 1: Zero-Shift Ring-Buffer Monotonic Deque',
        detail: 'Track min and max over sliding windows of W ticks in O(1) amortized per incoming price tick.',
      },
      {
        id: 'ch15-m2',
        title: 'Milestone 2: Breakout & Support Span Calculator',
        detail: 'Use a decreasing/increasing monotonic stack to compute consecutive days each price dominates.',
      },
      {
        id: 'ch15-m3',
        title: 'Milestone 3: Z-Score & Spike Anomaly Alerting',
        detail: 'Emit breakout events whenever the current tick exceeds the window range threshold.',
      },
    ],
    starterCode: `export interface TickMetric {
  timestamp: number;
  price: number;
  windowMin: number;
  windowMax: number;
  supportSpan: number;
}

export class CandlestickWindowAnalyzer {
  private readonly windowSize: number;
  private readonly prices: number[] = [];
  private readonly minDq: number[] = [];
  private readonly maxDq: number[] = [];
  private readonly spanStack: number[] = [];

  constructor(windowSize: number) {
    this.windowSize = windowSize;
  }

  pushTick(timestamp: number, price: number): TickMetric {
    const idx = this.prices.length;
    this.prices.push(price);

    if (this.minDq.length > 0 && this.minDq[0] <= idx - this.windowSize) this.minDq.shift();
    while (this.minDq.length > 0 && this.prices[this.minDq[this.minDq.length - 1]] >= price) {
      this.minDq.pop();
    }
    this.minDq.push(idx);

    if (this.maxDq.length > 0 && this.maxDq[0] <= idx - this.windowSize) this.maxDq.shift();
    while (this.maxDq.length > 0 && this.prices[this.maxDq[this.maxDq.length - 1]] <= price) {
      this.maxDq.pop();
    }
    this.maxDq.push(idx);

    while (this.spanStack.length > 0 && this.prices[this.spanStack[this.spanStack.length - 1]] <= price) {
      this.spanStack.pop();
    }
    const prevHigher = this.spanStack.length > 0 ? this.spanStack[this.spanStack.length - 1] : -1;
    this.spanStack.push(idx);

    return {
      timestamp,
      price,
      windowMin: this.prices[this.minDq[0]],
      windowMax: this.prices[this.maxDq[0]],
      supportSpan: idx - prevHigher,
    };
  }
}`,
  },
};
