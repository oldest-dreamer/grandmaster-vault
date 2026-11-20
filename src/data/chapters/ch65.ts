import type { TheoryChapter } from '../../types/vault';

export const CH65_SLOPE_TRICK_CONVEX_DP: TheoryChapter = {
  slug: 'slope-trick-convex-dp',
  topicId: 'dp-27',
  title: 'Slope Trick (Piecewise Linear Convex DP)',
  domain: 'Search, Greedy & DP',
  ratingTier: '2600–3300+',
  usacoDivision: 'Advanced',
  subtitle: 'Representing convex DP transitions via slope-change multiset heaps with O(1) lazy horizontal offsets',
  analogyTitle: 'Sculpting a U-Shaped Valley by Dropping Hinge Pins on Its Left and Right Walls',
  analogyBody:
    'Many sequence and tree DP states dp[i](x) turn out to be continuous, convex, piecewise-linear functions of x whose slopes only change by integer steps (+1) at discrete breakpoints. Storing dp[i](x) explicitly across large value ranges O(N * V) times out instantly—yet we only ever care about the shape of the valley.\n\nSlope Trick splits the breakpoints around the flat zero-slope bottom [vL, vR]: a max-heap L tracks all negative-slope hinges to the left of the minimum, and a min-heap R tracks all positive-slope hinges to the right. Adding |x - a_i| simply injects breakpoint a_i twice while sliding at most one boundary hinge across [vL, vR].\n\nEven better, range-constrained transitions min_{x in [y - R_step, y - L_step]} dp[i-1](x) shift every negative hinge right by +L_step and every positive hinge right by +R_step—requiring O(1) lazy offset variables shiftL and shiftR instead of touching every heap element.',
  prerequisites: [
    { slug: 'aliens-trick-wqs-binary-search', title: 'Aliens Trick (WQS Binary Search / Lagrangian)' },
  ],
  traceTitle: 'Single-Heap Slope Trick for Non-Decreasing Sequence Fitting',
  traceSubtitle: 'Computing min sum |a_i - b_i| subject to b_1 <= ... <= b_5 on A = [3, 2, 5, 1, 7]',
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Step i = 0 (a = 3): Seed Initial Slope Breakpoint',
      explanation: 'Start with f_0(x) = |x - 3|, then take prefix min_{u <= x} so slopes > 0 flatten to 0. Left max-heap L = [3], optimal cost = 0.',
      mode: 'array',
      arrays: [
        {
          name: 'Left Max-Heap L Breakpoints',
          cells: [{ index: 0, value: 3, label: 'top', highlight: 'active' }],
        },
      ],
      variables: { a_i: 3, topL: 3, minCost: 0 },
    },
    {
      stepNumber: 2,
      title: 'Step i = 1 (a = 2 < topL = 3): Valley Bottom Shifts Left',
      explanation: 'Push a = 2 twice into L and pop the max hinge 3 (discarded by prefix-min truncation). Cost increases by topL - a = 3 - 2 = 1; heap L becomes [2, 2].',
      mode: 'array',
      arrays: [
        {
          name: 'Left Max-Heap L Breakpoints',
          cells: [
            { index: 0, value: 2, label: 'top', highlight: 'updated' },
            { index: 1, value: 2, label: 'hinge', highlight: 'updated' },
          ],
        },
      ],
      variables: { a_i: 2, deltaCost: '+1', minCost: 1 },
    },
    {
      stepNumber: 3,
      title: 'Step i = 2 (a = 5 >= topL = 2): Free Extension to the Right',
      explanation: 'Push a = 5 twice, pop top 5 once: top stays 5, cost unchanged (delta = 0). L becomes [5, 2, 2].',
      mode: 'array',
      arrays: [
        {
          name: 'Left Max-Heap L Breakpoints',
          cells: [
            { index: 0, value: 5, label: 'top', highlight: 'active' },
            { index: 1, value: 2, label: 'hinge', highlight: 'neutral' },
            { index: 2, value: 2, label: 'hinge', highlight: 'neutral' },
          ],
        },
      ],
      variables: { a_i: 5, deltaCost: '+0', minCost: 1 },
    },
    {
      stepNumber: 4,
      title: 'Step i = 3 (a = 1 < topL = 5): Pull Down the Steep Slope',
      explanation: 'Push 1 twice, pay topL - a = 5 - 1 = 4, and pop 5. Total minCost reaches 5 with heap L = [2, 2, 1, 1].',
      mode: 'array',
      arrays: [
        {
          name: 'Left Max-Heap L Breakpoints',
          cells: [
            { index: 0, value: 2, label: 'top', highlight: 'updated' },
            { index: 1, value: 2, label: 'hinge', highlight: 'neutral' },
            { index: 2, value: 1, label: 'hinge', highlight: 'updated' },
            { index: 3, value: 1, label: 'hinge', highlight: 'updated' },
          ],
        },
      ],
      variables: { a_i: 1, deltaCost: '+4', minCost: 5 },
    },
    {
      stepNumber: 5,
      title: 'Step i = 4 (a = 7 >= topL = 2): Final Optimal Cost Locked',
      explanation: 'Push 7 twice and pop 7 once -> zero extra cost. Final minimum sum |a_i - b_i| = 5 (achieved by b = [2, 2, 2, 2, 7]).',
      mode: 'array',
      arrays: [
        {
          name: 'Final Left Max-Heap L',
          cells: [
            { index: 0, value: 7, label: 'top', highlight: 'active' },
            { index: 1, value: 2, label: 'hinge', highlight: 'neutral' },
            { index: 2, value: 2, label: 'hinge', highlight: 'neutral' },
            { index: 3, value: 1, label: 'hinge', highlight: 'neutral' },
            { index: 4, value: 1, label: 'hinge', highlight: 'neutral' },
          ],
        },
      ],
      variables: { a_i: 7, finalMinCost: 5, complexity: 'O(N log N)' },
    },
  ],
  reductionClues: [
    {
      clue: 'Minimize sum |a_i - b_i| subject to b_1 <= b_2 <= ... <= b_n (or strict b_1 < b_2 < ... < b_n)',
      translation: 'For non-strict, single max-heap Slope Trick solves in O(N log N); for strict b_i < b_{i+1}, substitute a_i\' = a_i - i first.',
    },
    {
      clue: 'Minimize sum |a_i - b_i| subject to sliding bounds L_s <= b_i - b_{i-1} <= R_s',
      translation: 'Maintain dual heaps (L max-heap, R min-heap) with lazy horizontal offsets shiftL += L_s and shiftR += R_s.',
    },
    {
      clue: 'Tree DP where each child contributes convex piecewise-linear cost f_v(x) and edges add |x - t - w|',
      translation: 'Merge child heaps via Small-to-Large priority queue merging (swapping references) and truncate upper slopes above +1.',
    },
    {
      clue: 'DP state dp[i][v] has L1 / piecewise-linear convex cost over v in [0, 10^9]',
      translation: 'Verify convexity is closed under addition, prefix minimum, and infimal convolution—then replace the value table with heaps of slope breakpoints.',
    },
  ],
  timeComplexity: 'O(N log N) for sequence Slope Trick; O(N log^2 N) or O(N log N) with leftist heaps on trees',
  spaceComplexity: 'O(N) breakpoints stored across dual priority queues',
  pitfalls: [
    {
      type: 'WA',
      title: 'Ignoring Strict vs. Non-Strict Monotonicity Offset (a_i - i)',
      detail: 'Single-heap Slope Trick naturally enforces non-decreasing b_i <= b_{i+1}. If the problem requires strictly increasing integers b_i < b_{i+1}, transform every input value to a_i\' = a_i - i beforehand (or use dual-heap L_step = 1).',
    },
    {
      type: 'WA',
      title: 'Mixing Up Raw vs. Shifted Heap Values When Moving Between L and R',
      detail: 'When moving an element popped from L into R under lazy offsets shiftL and shiftR, compute the TRUE value realVal = L.top() + shiftL first, and push (realVal - shiftR) into R. Pushing raw values corrupts future comparisons.',
    },
    {
      type: 'MLE',
      title: 'Linear Heap Copy Instead of Small-to-Large Reference Swap on Trees',
      detail: 'In tree Slope Trick (e.g. Fireworks), merging child heaps into parent in arbitrary order degenerates to O(N^2 log N). Always swap heap references so the smaller heap is drained into the larger heap.',
    },
    {
      type: 'WA',
      title: '64-Bit Overflow on Sum of Breakpoints',
      detail: 'Even if individual coordinates a_i <= 10^9, the cumulative L1 cost sum |a_i - b_i| reaches up to 10^14. Always use 64-bit integers (long long / i64 / long) for minCost and shifted breakpoints.',
    },
  ],
  implementations: {
    cpp20: `#include <iostream>
#include <vector>
#include <queue>
#include <functional>
using namespace std;

// Dual-Heap Slope Trick with lazy horizontal offsets [L_step, R_step]
// Minimizes sum |a_i - b_i| subject to L_step <= b_i - b_{i-1} <= R_step
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    long long lStep, rStep;
    if (!(cin >> n >> lStep >> rStep)) return 0;

    vector<long long> a(n);
    for (int i = 0; i < n; ++i) cin >> a[i];

    priority_queue<long long> L;
    priority_queue<long long, vector<long long>, greater<long long>> R;
    long long shiftL = 0, shiftR = 0, minCost = 0;

    L.push(a[0]);
    R.push(a[0]);

    for (int i = 1; i < n; ++i) {
        shiftL += lStep;
        shiftR += rStep;

        long long vL = L.top() + shiftL;
        long long vR = R.top() + shiftR;
        long long cur = a[i];

        if (cur < vL) {
            minCost += vL - cur;
            L.push(cur - shiftL);
            L.push(cur - shiftL);
            long long moved = L.top() + shiftL;
            L.pop();
            R.push(moved - shiftR);
        } else if (cur > vR) {
            minCost += cur - vR;
            R.push(cur - shiftR);
            R.push(cur - shiftR);
            long long moved = R.top() + shiftR;
            R.pop();
            L.push(moved - shiftL);
        } else {
            L.push(cur - shiftL);
            R.push(cur - shiftR);
        }
    }

    cout << minCost << "\\n";
    return 0;
}
`,
    rust: `use std::cmp::Reverse;
use std::collections::BinaryHeap;
use std::io::{self, Read};

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let n: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };
    let l_step: i64 = it.next().unwrap().parse().unwrap();
    let r_step: i64 = it.next().unwrap().parse().unwrap();

    let mut a = Vec::with_capacity(n);
    for _ in 0..n {
        a.push(it.next().unwrap().parse::<i64>().unwrap());
    }

    let mut left: BinaryHeap<i64> = BinaryHeap::new();
    let mut right: BinaryHeap<Reverse<i64>> = BinaryHeap::new();
    let mut shift_l = 0i64;
    let mut shift_r = 0i64;
    let mut min_cost = 0i64;

    left.push(a[0]);
    right.push(Reverse(a[0]));

    for &cur in &a[1..] {
        shift_l += l_step;
        shift_r += r_step;

        let v_l = *left.peek().unwrap() + shift_l;
        let v_r = right.peek().unwrap().0 + shift_r;

        if cur < v_l {
            min_cost += v_l - cur;
            left.push(cur - shift_l);
            left.push(cur - shift_l);
            let moved = left.pop().unwrap() + shift_l;
            right.push(Reverse(moved - shift_r));
        } else if cur > v_r {
            min_cost += cur - v_r;
            right.push(Reverse(cur - shift_r));
            right.push(Reverse(cur - shift_r));
            let moved = right.pop().unwrap().0 + shift_r;
            left.push(moved - shift_l);
        } else {
            left.push(cur - shift_l);
            right.push(Reverse(cur - shift_r));
        }
    }

    println!("{}", min_cost);
}
`,
    java21: `import java.io.BufferedInputStream;
import java.io.IOException;
import java.util.Collections;
import java.util.PriorityQueue;

public class Main {
    static class FastScanner {
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;
        private final BufferedInputStream in = new BufferedInputStream(System.in);

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
            do {
                c = readByte();
                if (c == -1) return Long.MIN_VALUE;
            } while (c <= ' ');
            long sign = 1;
            if (c == '-') {
                sign = -1;
                c = readByte();
            }
            long res = 0;
            while (c > ' ') {
                res = res * 10 + (c - '0');
                c = readByte();
            }
            return res * sign;
        }
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        long nLong = fs.nextLong();
        if (nLong == Long.MIN_VALUE) return;
        int n = (int) nLong;
        long lStep = fs.nextLong();
        long rStep = fs.nextLong();

        long[] a = new long[n];
        for (int i = 0; i < n; i++) a[i] = fs.nextLong();

        PriorityQueue<Long> L = new PriorityQueue<>(Collections.reverseOrder());
        PriorityQueue<Long> R = new PriorityQueue<>();
        long shiftL = 0, shiftR = 0, minCost = 0;

        L.add(a[0]);
        R.add(a[0]);

        for (int i = 1; i < n; i++) {
            shiftL += lStep;
            shiftR += rStep;
            long vL = L.peek() + shiftL;
            long vR = R.peek() + shiftR;
            long cur = a[i];

            if (cur < vL) {
                minCost += vL - cur;
                L.add(cur - shiftL);
                L.add(cur - shiftL);
                long moved = L.poll() + shiftL;
                R.add(moved - shiftR);
            } else if (cur > vR) {
                minCost += cur - vR;
                R.add(cur - shiftR);
                R.add(cur - shiftR);
                long moved = R.poll() + shiftR;
                L.add(moved - shiftL);
            } else {
                L.add(cur - shiftL);
                R.add(cur - shiftR);
            }
        }
        System.out.println(minCost);
    }
}
`,
    python3: `import heapq
import sys

sys.setrecursionlimit(200000)


def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    l_step = int(data[1])
    r_step = int(data[2])
    a = [int(v) for v in data[3 : 3 + n]]

    left_neg = [-a[0]]  # max-heap stored negated
    right = [a[0]]
    shift_l = 0
    shift_r = 0
    min_cost = 0

    for cur in a[1:]:
        shift_l += l_step
        shift_r += r_step
        v_l = -left_neg[0] + shift_l
        v_r = right[0] + shift_r

        if cur < v_l:
            min_cost += v_l - cur
            heapq.heappush(left_neg, -(cur - shift_l))
            heapq.heappush(left_neg, -(cur - shift_l))
            moved = -heapq.heappop(left_neg) + shift_l
            heapq.heappush(right, moved - shift_r)
        elif cur > v_r:
            min_cost += cur - v_r
            heapq.heappush(right, cur - shift_r)
            heapq.heappush(right, cur - shift_r)
            moved = heapq.heappop(right) + shift_r
            heapq.heappush(left_neg, -(moved - shift_l))
        else:
            heapq.heappush(left_neg, -(cur - shift_l))
            heapq.heappush(right, cur - shift_r)

    print(min_cost)


if __name__ == "__main__":
    solve()
`,
    ruby: `class MaxHeap
  def initialize
    @h = []
  end

  def push(x)
    @h << x
    i = @h.length - 1
    while i > 0
      p = (i - 1) >> 1
      break if @h[p] >= @h[i]
      @h[p], @h[i] = @h[i], @h[p]
      i = p
    end
  end

  def peek
    @h[0]
  end

  def pop
    res = @h[0]
    last = @h.pop
    unless @h.empty?
      @h[0] = last
      i = 0
      n = @h.length
      loop do
        l = (i << 1) + 1
        r = l + 1
        best = i
        best = l if l < n && @h[l] > @h[best]
        best = r if r < n && @h[r] > @h[best]
        break if best == i
        @h[i], @h[best] = @h[best], @h[i]
        i = best
      end
    end
    res
  end
end

class MinHeap
  def initialize
    @h = []
  end

  def push(x)
    @h << x
    i = @h.length - 1
    while i > 0
      p = (i - 1) >> 1
      break if @h[p] <= @h[i]
      @h[p], @h[i] = @h[i], @h[p]
      i = p
    end
  end

  def peek
    @h[0]
  end

  def pop
    res = @h[0]
    last = @h.pop
    unless @h.empty?
      @h[0] = last
      i = 0
      n = @h.length
      loop do
        l = (i << 1) + 1
        r = l + 1
        best = i
        best = l if l < n && @h[l] < @h[best]
        best = r if r < n && @h[r] < @h[best]
        break if best == i
        @h[i], @h[best] = @h[best], @h[i]
        i = best
      end
    end
    res
  end
end

data = $stdin.read.split
exit if data.empty?
n = data[0].to_i
l_step = data[1].to_i
r_step = data[2].to_i
a = data[3, n].map(&:to_i)

left = MaxHeap.new
right = MinHeap.new
shift_l = 0
shift_r = 0
min_cost = 0

left.push(a[0])
right.push(a[0])

(1...n).each do |i|
  shift_l += l_step
  shift_r += r_step
  v_l = left.peek + shift_l
  v_r = right.peek + shift_r
  cur = a[i]

  if cur < v_l
    min_cost += v_l - cur
    left.push(cur - shift_l)
    left.push(cur - shift_l)
    moved = left.pop + shift_l
    right.push(moved - shift_r)
  elsif cur > v_r
    min_cost += cur - v_r
    right.push(cur - shift_r)
    right.push(cur - shift_r)
    moved = right.pop + shift_r
    left.push(moved - shift_l)
  else
    left.push(cur - shift_l)
    right.push(cur - shift_r)
  end
end

puts min_cost
`,
  },
  practiceProblems: [
    {
      id: 'ch65-p1',
      tier: 'Warmup',
      ratingRange: '2200–2400',
      title: 'Make Array Non-Decreasing via Single-Heap Slope Trick',
      statement:
        'Given an integer array A of length N, find the minimum total L1 modification cost sum_{i=1}^{N} |A[i] - B[i]| such that B is non-decreasing: B[1] <= B[2] <= ... <= B[N]. Solve in O(N log N) time.',
      constraints: '1 <= N <= 2 * 10^5, |A[i]| <= 10^9',
      sampleInput: '5\n3 2 5 1 7',
      sampleOutput: '5',
      hints: [
        'Define dp[i](x) = min_{B_i <= x} cost after fixing prefix 1..i. Taking prefix minimum truncates all positive-slope breakpoints above the flat minimum.',
        'At each step i, push A[i] twice into a single max-heap L (slope change +2 at A[i]), then pay max(0, L.top() - A[i]) and pop L.top().',
        'Notice that if A[i] >= old top, pushing A[i] twice and popping once adds A[i] once with zero cost; if A[i] < old top, the old top is replaced by two copies of A[i].',
      ],
      solutions: {
        cpp20: `#include <iostream>
#include <queue>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    if (!(cin >> n)) return 0;

    priority_queue<long long> pq;
    long long ans = 0;
    for (int i = 0; i < n; ++i) {
        long long x;
        cin >> x;
        pq.push(x);
        pq.push(x);
        ans += pq.top() - x;
        pq.pop();
    }

    cout << ans << "\\n";
    return 0;
}
`,
        rust: `use std::collections::BinaryHeap;
use std::io::{self, Read};

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let n: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };

    let mut pq: BinaryHeap<i64> = BinaryHeap::new();
    let mut ans = 0i64;
    for _ in 0..n {
        let x: i64 = it.next().unwrap().parse().unwrap();
        pq.push(x);
        pq.push(x);
        ans += *pq.peek().unwrap() - x;
        pq.pop();
    }

    println!("{}", ans);
}
`,
        java21: `import java.io.BufferedInputStream;
import java.io.IOException;
import java.util.Collections;
import java.util.PriorityQueue;

public class Main {
    static class FastScanner {
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;
        private final BufferedInputStream in = new BufferedInputStream(System.in);

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
            do {
                c = readByte();
                if (c == -1) return Long.MIN_VALUE;
            } while (c <= ' ');
            long sign = 1;
            if (c == '-') {
                sign = -1;
                c = readByte();
            }
            long res = 0;
            while (c > ' ') {
                res = res * 10 + (c - '0');
                c = readByte();
            }
            return res * sign;
        }
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        long nLong = fs.nextLong();
        if (nLong == Long.MIN_VALUE) return;
        int n = (int) nLong;

        PriorityQueue<Long> pq = new PriorityQueue<>(Collections.reverseOrder());
        long ans = 0;
        for (int i = 0; i < n; i++) {
            long x = fs.nextLong();
            pq.add(x);
            pq.add(x);
            ans += pq.poll() - x;
        }
        System.out.println(ans);
    }
}
`,
        python3: `import heapq
import sys

sys.setrecursionlimit(200000)


def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    pq: list[int] = []
    ans = 0
    for s in data[1 : 1 + n]:
        x = int(s)
        heapq.heappush(pq, -x)
        heapq.heappush(pq, -x)
        top = -heapq.heappop(pq)
        ans += top - x
    print(ans)


if __name__ == "__main__":
    solve()
`,
        ruby: `class MaxHeap
  def initialize
    @h = []
  end

  def push(x)
    @h << x
    i = @h.length - 1
    while i > 0
      p = (i - 1) >> 1
      break if @h[p] >= @h[i]
      @h[p], @h[i] = @h[i], @h[p]
      i = p
    end
  end

  def pop
    res = @h[0]
    last = @h.pop
    unless @h.empty?
      @h[0] = last
      i = 0
      n = @h.length
      loop do
        l = (i << 1) + 1
        r = l + 1
        best = i
        best = l if l < n && @h[l] > @h[best]
        best = r if r < n && @h[r] > @h[best]
        break if best == i
        @h[i], @h[best] = @h[best], @h[i]
        i = best
      end
    end
    res
  end
end

data = $stdin.read.split
exit if data.empty?
n = data[0].to_i
pq = MaxHeap.new
ans = 0
data[1, n].each do |s|
  x = s.to_i
  pq.push(x)
  pq.push(x)
  ans += pq.pop - x
end
puts ans
`,
      },
    },
    {
      id: 'ch65-p2',
      tier: 'Standard',
      ratingRange: '2400–2700',
      title: 'Step-Constrained Sequence Modification (Dual-Heap Slope Trick)',
      statement:
        'Given integers N, L_step, R_step (with L_step <= R_step) and array A[1..N], find the minimum L1 cost sum_{i=1}^{N} |A[i] - B[i]| subject to L_step <= B[i] - B[i - 1] <= R_step for every i >= 2. Output the minimum integer cost.',
      constraints: '1 <= N <= 2 * 10^5, -10^9 <= L_step <= R_step <= 10^9, |A[i]| <= 10^9',
      sampleInput: '4 1 2\n1 5 4 8',
      sampleOutput: '4',
      hints: [
        'Each transition solves f_i(y) = |y - A[i]| + min_{y - R_step <= x <= y - L_step} f_{i-1}(x).',
        'Observe that taking the sliding minimum over [y - R_step, y - L_step] shifts the left convex wall right by L_step (shiftL += L_step) and the right convex wall right by R_step (shiftR += R_step).',
        'Insert A[i] into the dual heaps after shifting, balancing any boundary crossing between L and R using true coordinates (heapVal + shift).',
      ],
      solutions: {
        cpp20: `#include <iostream>
#include <vector>
#include <queue>
#include <functional>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    long long lStep, rStep;
    if (!(cin >> n >> lStep >> rStep)) return 0;

    vector<long long> a(n);
    for (int i = 0; i < n; ++i) cin >> a[i];

    priority_queue<long long> L;
    priority_queue<long long, vector<long long>, greater<long long>> R;
    long long shiftL = 0, shiftR = 0, minCost = 0;

    L.push(a[0]);
    R.push(a[0]);

    for (int i = 1; i < n; ++i) {
        shiftL += lStep;
        shiftR += rStep;
        long long vL = L.top() + shiftL;
        long long vR = R.top() + shiftR;
        long long cur = a[i];

        if (cur < vL) {
            minCost += vL - cur;
            L.push(cur - shiftL);
            L.push(cur - shiftL);
            long long moved = L.top() + shiftL;
            L.pop();
            R.push(moved - shiftR);
        } else if (cur > vR) {
            minCost += cur - vR;
            R.push(cur - shiftR);
            R.push(cur - shiftR);
            long long moved = R.top() + shiftR;
            R.pop();
            L.push(moved - shiftL);
        } else {
            L.push(cur - shiftL);
            R.push(cur - shiftR);
        }
    }

    cout << minCost << "\\n";
    return 0;
}
`,
        rust: `use std::cmp::Reverse;
use std::collections::BinaryHeap;
use std::io::{self, Read};

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let n: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };
    let l_step: i64 = it.next().unwrap().parse().unwrap();
    let r_step: i64 = it.next().unwrap().parse().unwrap();
    let mut a = Vec::with_capacity(n);
    for _ in 0..n {
        a.push(it.next().unwrap().parse::<i64>().unwrap());
    }

    let mut left: BinaryHeap<i64> = BinaryHeap::new();
    let mut right: BinaryHeap<Reverse<i64>> = BinaryHeap::new();
    let (mut shift_l, mut shift_r, mut min_cost) = (0i64, 0i64, 0i64);
    left.push(a[0]);
    right.push(Reverse(a[0]));

    for &cur in &a[1..] {
        shift_l += l_step;
        shift_r += r_step;
        let v_l = *left.peek().unwrap() + shift_l;
        let v_r = right.peek().unwrap().0 + shift_r;
        if cur < v_l {
            min_cost += v_l - cur;
            left.push(cur - shift_l);
            left.push(cur - shift_l);
            let moved = left.pop().unwrap() + shift_l;
            right.push(Reverse(moved - shift_r));
        } else if cur > v_r {
            min_cost += cur - v_r;
            right.push(Reverse(cur - shift_r));
            right.push(Reverse(cur - shift_r));
            let moved = right.pop().unwrap().0 + shift_r;
            left.push(moved - shift_l);
        } else {
            left.push(cur - shift_l);
            right.push(Reverse(cur - shift_r));
        }
    }
    println!("{}", min_cost);
}
`,
        java21: `import java.io.BufferedInputStream;
import java.io.IOException;
import java.util.Collections;
import java.util.PriorityQueue;

public class Main {
    static class FastScanner {
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;
        private final BufferedInputStream in = new BufferedInputStream(System.in);

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
            do {
                c = readByte();
                if (c == -1) return Long.MIN_VALUE;
            } while (c <= ' ');
            long sign = 1;
            if (c == '-') {
                sign = -1;
                c = readByte();
            }
            long res = 0;
            while (c > ' ') {
                res = res * 10 + (c - '0');
                c = readByte();
            }
            return res * sign;
        }
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        long nLong = fs.nextLong();
        if (nLong == Long.MIN_VALUE) return;
        int n = (int) nLong;
        long lStep = fs.nextLong();
        long rStep = fs.nextLong();
        long[] a = new long[n];
        for (int i = 0; i < n; i++) a[i] = fs.nextLong();

        PriorityQueue<Long> L = new PriorityQueue<>(Collections.reverseOrder());
        PriorityQueue<Long> R = new PriorityQueue<>();
        long shiftL = 0, shiftR = 0, minCost = 0;
        L.add(a[0]);
        R.add(a[0]);

        for (int i = 1; i < n; i++) {
            shiftL += lStep;
            shiftR += rStep;
            long vL = L.peek() + shiftL;
            long vR = R.peek() + shiftR;
            long cur = a[i];
            if (cur < vL) {
                minCost += vL - cur;
                L.add(cur - shiftL);
                L.add(cur - shiftL);
                long moved = L.poll() + shiftL;
                R.add(moved - shiftR);
            } else if (cur > vR) {
                minCost += cur - vR;
                R.add(cur - shiftR);
                R.add(cur - shiftR);
                long moved = R.poll() + shiftR;
                L.add(moved - shiftL);
            } else {
                L.add(cur - shiftL);
                R.add(cur - shiftR);
            }
        }
        System.out.println(minCost);
    }
}
`,
        python3: `import heapq
import sys

sys.setrecursionlimit(200000)


def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    l_step = int(data[1])
    r_step = int(data[2])
    a = [int(v) for v in data[3 : 3 + n]]

    left_neg = [-a[0]]
    right = [a[0]]
    shift_l = 0
    shift_r = 0
    min_cost = 0

    for cur in a[1:]:
        shift_l += l_step
        shift_r += r_step
        v_l = -left_neg[0] + shift_l
        v_r = right[0] + shift_r
        if cur < v_l:
            min_cost += v_l - cur
            heapq.heappush(left_neg, -(cur - shift_l))
            heapq.heappush(left_neg, -(cur - shift_l))
            moved = -heapq.heappop(left_neg) + shift_l
            heapq.heappush(right, moved - shift_r)
        elif cur > v_r:
            min_cost += cur - v_r
            heapq.heappush(right, cur - shift_r)
            heapq.heappush(right, cur - shift_r)
            moved = heapq.heappop(right) + shift_r
            heapq.heappush(left_neg, -(moved - shift_l))
        else:
            heapq.heappush(left_neg, -(cur - shift_l))
            heapq.heappush(right, cur - shift_r)

    print(min_cost)


if __name__ == "__main__":
    solve()
`,
        ruby: `class Heap
  def initialize(min_mode)
    @h = []
    @cmp = min_mode ? ->(a, b) { a < b } : ->(a, b) { a > b }
  end

  def push(x)
    @h << x
    i = @h.length - 1
    while i > 0
      p = (i - 1) >> 1
      break unless @cmp.call(@h[i], @h[p])
      @h[p], @h[i] = @h[i], @h[p]
      i = p
    end
  end

  def peek
    @h[0]
  end

  def pop
    res = @h[0]
    last = @h.pop
    unless @h.empty?
      @h[0] = last
      i = 0
      n = @h.length
      loop do
        l = (i << 1) + 1
        r = l + 1
        best = i
        best = l if l < n && @cmp.call(@h[l], @h[best])
        best = r if r < n && @cmp.call(@h[r], @h[best])
        break if best == i
        @h[i], @h[best] = @h[best], @h[i]
        i = best
      end
    end
    res
  end
end

data = $stdin.read.split
exit if data.empty?
n = data[0].to_i
l_step = data[1].to_i
r_step = data[2].to_i
a = data[3, n].map(&:to_i)

left = Heap.new(false)
right = Heap.new(true)
shift_l = 0
shift_r = 0
min_cost = 0
left.push(a[0])
right.push(a[0])

(1...n).each do |i|
  shift_l += l_step
  shift_r += r_step
  v_l = left.peek + shift_l
  v_r = right.peek + shift_r
  cur = a[i]
  if cur < v_l
    min_cost += v_l - cur
    left.push(cur - shift_l)
    left.push(cur - shift_l)
    right.push((left.pop + shift_l) - shift_r)
  elsif cur > v_r
    min_cost += cur - v_r
    right.push(cur - shift_r)
    right.push(cur - shift_r)
    left.push((right.pop + shift_r) - shift_l)
  else
    left.push(cur - shift_l)
    right.push(cur - shift_r)
  end
end

puts min_cost
`,
      },
    },
    {
      id: 'ch65-p3',
      tier: 'Boss',
      ratingRange: '2600–3100',
      title: 'Fireworks (Tree Slope Trick + Small-to-Large Heap Merging)',
      statement:
        'You are given a rooted tree with N vertices (1 is root), where each non-root vertex i (2 <= i <= N) has parent P[i] connected by a fuse of initial non-negative length W[i]. Modifying an edge length from W[i] to any non-negative integer W\'[i] >= 0 costs |W[i] - W\'[i]|. Compute the minimum total cost so that every leaf is at identical distance from the root 1.',
      constraints: '2 <= N <= 3 * 10^5, 0 <= W[i] <= 10^9, leaves have no children',
      sampleInput: '6\n1 1\n1 5\n1 3\n2 1\n2 5',
      sampleOutput: '6',
      hints: [
        'For each subtree u, maintain the convex piecewise-linear DP function f_u(x) using a max-heap of all breakpoints where slope increases by +1.',
        'Merge child heaps bottom-up via Small-to-Large swapping. If u has C children (after merging), the merged curve has right-slope +C; pop the top C - 1 breakpoints, then pop the two flat-minimum bounds R and L and push L + W[u] and R + W[u].',
        'At the root 1, pop the top (rootChildren) breakpoints to clip right-slope down to 0, then compute f_min = sum(all W[i]) - sum(remaining breakpoints in root heap)!',
      ],
      solutions: {
        cpp20: `#include <iostream>
#include <vector>
#include <queue>
#include <utility>
using namespace std;

// APIO Fireworks: Bottom-up Slope Trick + Small-to-Large priority_queue merging
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    if (!(cin >> n)) return 0;

    vector<int> parent(n + 1, 0), deg(n + 1, 0);
    vector<long long> w(n + 1, 0);
    long long totalWeight = 0;
    for (int i = 2; i <= n; ++i) {
        cin >> parent[i] >> w[i];
        ++deg[parent[i]];
        totalWeight += w[i];
    }

    vector<priority_queue<long long>> heaps(n + 1);
    vector<int> childrenCount = deg;

    // Input parents satisfy topological ordering or process via queue in general
    vector<int> q;
    q.reserve(n);
    for (int i = 1; i <= n; ++i) {
        if (deg[i] == 0) q.push_back(i);
    }

    for (size_t head = 0; head < q.size(); ++head) {
        int u = q[head];
        if (u == 1) break;

        if (childrenCount[u] == 0) {
            heaps[u].push(w[u]);
            heaps[u].push(w[u]);
        } else {
            for (int k = 0; k < childrenCount[u] - 1; ++k) {
                heaps[u].pop();
            }
            long long rVal = heaps[u].top();
            heaps[u].pop();
            long long lVal = heaps[u].top();
            heaps[u].pop();
            heaps[u].push(lVal + w[u]);
            heaps[u].push(rVal + w[u]);
        }

        int p = parent[u];
        if (heaps[p].size() < heaps[u].size()) {
            swap(heaps[p], heaps[u]);
        }
        while (!heaps[u].empty()) {
            heaps[p].push(heaps[u].top());
            heaps[u].pop();
        }
        if (--deg[p] == 0) q.push_back(p);
    }

    for (int k = 0; k < childrenCount[1]; ++k) {
        heaps[1].pop();
    }

    long long dropSum = 0;
    while (!heaps[1].empty()) {
        dropSum += heaps[1].top();
        heaps[1].pop();
    }

    cout << (totalWeight - dropSum) << "\\n";
    return 0;
}
`,
        rust: `use std::collections::BinaryHeap;
use std::io::{self, Read};

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let n: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };

    let mut parent = vec![0usize; n + 1];
    let mut w = vec![0i64; n + 1];
    let mut deg = vec![0usize; n + 1];
    let mut total_weight = 0i64;

    for i in 2..=n {
        parent[i] = it.next().unwrap().parse().unwrap();
        w[i] = it.next().unwrap().parse().unwrap();
        deg[parent[i]] += 1;
        total_weight += w[i];
    }

    let children_count = deg.clone();
    let mut heaps: Vec<BinaryHeap<i64>> = (0..=n).map(|_| BinaryHeap::new()).collect();
    let mut q = Vec::with_capacity(n);
    for i in 1..=n {
        if deg[i] == 0 {
            q.push(i);
        }
    }

    let mut head = 0usize;
    while head < q.len() {
        let u = q[head];
        head += 1;
        if u == 1 {
            break;
        }

        if children_count[u] == 0 {
            heaps[u].push(w[u]);
            heaps[u].push(w[u]);
        } else {
            for _ in 0..(children_count[u] - 1) {
                heaps[u].pop();
            }
            let r_val = heaps[u].pop().unwrap();
            let l_val = heaps[u].pop().unwrap();
            heaps[u].push(l_val + w[u]);
            heaps[u].push(r_val + w[u]);
        }

        let p = parent[u];
        let mut child_heap = std::mem::take(&mut heaps[u]);
        if heaps[p].len() < child_heap.len() {
            std::mem::swap(&mut heaps[p], &mut child_heap);
        }
        while let Some(x) = child_heap.pop() {
            heaps[p].push(x);
        }
        deg[p] -= 1;
        if deg[p] == 0 {
            q.push(p);
        }
    }

    for _ in 0..children_count[1] {
        heaps[1].pop();
    }
    let drop_sum: i64 = heaps[1].iter().sum();
    println!("{}", total_weight - drop_sum);
}
`,
        java21: `import java.io.BufferedInputStream;
import java.io.IOException;
import java.util.Collections;
import java.util.PriorityQueue;

public class Main {
    static class FastScanner {
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;
        private final BufferedInputStream in = new BufferedInputStream(System.in);

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
            do {
                c = readByte();
                if (c == -1) return Long.MIN_VALUE;
            } while (c <= ' ');
            long res = 0;
            while (c > ' ') {
                res = res * 10 + (c - '0');
                c = readByte();
            }
            return res;
        }
    }

    @SuppressWarnings("unchecked")
    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        long nLong = fs.nextLong();
        if (nLong == Long.MIN_VALUE) return;
        int n = (int) nLong;

        int[] parent = new int[n + 1];
        long[] w = new long[n + 1];
        int[] deg = new int[n + 1];
        long totalWeight = 0;
        for (int i = 2; i <= n; i++) {
            parent[i] = (int) fs.nextLong();
            w[i] = fs.nextLong();
            deg[parent[i]]++;
            totalWeight += w[i];
        }

        int[] childrenCount = deg.clone();
        PriorityQueue<Long>[] heaps = new PriorityQueue[n + 1];
        for (int i = 1; i <= n; i++) heaps[i] = new PriorityQueue<>(Collections.reverseOrder());

        int[] q = new int[n];
        int head = 0, tail = 0;
        for (int i = 1; i <= n; i++) {
            if (deg[i] == 0) q[tail++] = i;
        }

        while (head < tail) {
            int u = q[head++];
            if (u == 1) break;

            if (childrenCount[u] == 0) {
                heaps[u].add(w[u]);
                heaps[u].add(w[u]);
            } else {
                for (int k = 0; k < childrenCount[u] - 1; k++) heaps[u].poll();
                long rVal = heaps[u].poll();
                long lVal = heaps[u].poll();
                heaps[u].add(lVal + w[u]);
                heaps[u].add(rVal + w[u]);
            }

            int p = parent[u];
            if (heaps[p].size() < heaps[u].size()) {
                PriorityQueue<Long> tmp = heaps[p];
                heaps[p] = heaps[u];
                heaps[u] = tmp;
            }
            while (!heaps[u].isEmpty()) heaps[p].add(heaps[u].poll());
            if (--deg[p] == 0) q[tail++] = p;
        }

        for (int k = 0; k < childrenCount[1]; k++) heaps[1].poll();
        long dropSum = 0;
        while (!heaps[1].isEmpty()) dropSum += heaps[1].poll();

        System.out.println(totalWeight - dropSum);
    }
}
`,
        python3: `import heapq
import sys

sys.setrecursionlimit(200000)


def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    parent = [0] * (n + 1)
    w = [0] * (n + 1)
    deg = [0] * (n + 1)
    total_weight = 0
    idx = 1
    for i in range(2, n + 1):
        parent[i] = int(data[idx])
        w[i] = int(data[idx + 1])
        idx += 2
        deg[parent[i]] += 1
        total_weight += w[i]

    children_count = deg[:]
    heaps: list[list[int]] = [[] for _ in range(n + 1)]
    q = [i for i in range(1, n + 1) if deg[i] == 0]
    head = 0

    while head < len(q):
        u = q[head]
        head += 1
        if u == 1:
            break
        hu = heaps[u]
        if children_count[u] == 0:
            heapq.heappush(hu, -w[u])
            heapq.heappush(hu, -w[u])
        else:
            for _ in range(children_count[u] - 1):
                heapq.heappop(hu)
            r_val = -heapq.heappop(hu)
            l_val = -heapq.heappop(hu)
            heapq.heappush(hu, -(l_val + w[u]))
            heapq.heappush(hu, -(r_val + w[u]))

        p = parent[u]
        if len(heaps[p]) < len(hu):
            heaps[p], heaps[u] = heaps[u], heaps[p]
            hu = heaps[u]
        for val in hu:
            heapq.heappush(heaps[p], val)
        heaps[u] = []
        deg[p] -= 1
        if deg[p] == 0:
            q.append(p)

    for _ in range(children_count[1]):
        heapq.heappop(heaps[1])

    drop_sum = sum(-x for x in heaps[1])
    print(total_weight - drop_sum)


if __name__ == "__main__":
    solve()
`,
        ruby: `class MaxHeap
  attr_reader :size

  def initialize
    @h = []
  end

  def empty?
    @h.empty?
  end

  def length
    @h.length
  end

  def push(x)
    @h << x
    i = @h.length - 1
    while i > 0
      p = (i - 1) >> 1
      break if @h[p] >= @h[i]
      @h[p], @h[i] = @h[i], @h[p]
      i = p
    end
  end

  def pop
    res = @h[0]
    last = @h.pop
    unless @h.empty?
      @h[0] = last
      i = 0
      n = @h.length
      loop do
        l = (i << 1) + 1
        r = l + 1
        best = i
        best = l if l < n && @h[l] > @h[best]
        best = r if r < n && @h[r] > @h[best]
        break if best == i
        @h[i], @h[best] = @h[best], @h[i]
        i = best
      end
    end
    res
  end
end

data = $stdin.read.split
exit if data.empty?
n = data[0].to_i
parent = Array.new(n + 1, 0)
w = Array.new(n + 1, 0)
deg = Array.new(n + 1, 0)
total_weight = 0
idx = 1
(2..n).each do |i|
  parent[i] = data[idx].to_i
  w[i] = data[idx + 1].to_i
  idx += 2
  deg[parent[i]] += 1
  total_weight += w[i]
end

children_count = deg.dup
heaps = Array.new(n + 1) { MaxHeap.new }
q = []
(1..n).each { |i| q << i if deg[i] == 0 }
head = 0

while head < q.length
  u = q[head]
  head += 1
  break if u == 1

  if children_count[u] == 0
    heaps[u].push(w[u])
    heaps[u].push(w[u])
  else
    (children_count[u] - 1).times { heaps[u].pop }
    r_val = heaps[u].pop
    l_val = heaps[u].pop
    heaps[u].push(l_val + w[u])
    heaps[u].push(r_val + w[u])
  end

  p = parent[u]
  if heaps[p].length < heaps[u].length
    heaps[p], heaps[u] = heaps[u], heaps[p]
  end
  heaps[p].push(heaps[u].pop) until heaps[u].empty?
  deg[p] -= 1
  q << p if deg[p] == 0
end

children_count[1].times { heaps[1].pop }
drop_sum = 0
drop_sum += heaps[1].pop until heaps[1].empty?
puts total_weight - drop_sum
`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'Codeforces',
      title: '713C — Sonya and Problem Wihtout a Legend',
      difficulty: '2300',
      url: 'https://codeforces.com/problemset/problem/713/C',
      patternNote: 'Canonical strictly increasing sequence L1 DP reduced to non-decreasing Slope Trick via a_i - i.',
    },
    {
      platform: 'AtCoder',
      title: 'ARC123D / ABC217H — Snuketoon (Dual-Heap Slope Trick)',
      difficulty: '2400–2700',
      url: 'https://atcoder.jp/contests/abc217/tasks/abc217_h',
      patternNote: 'Standard dual-heap Slope Trick maintaining lazy shiftL and shiftR offsets.',
    },
    {
      platform: 'Codeforces',
      title: 'APIO 2016 — Fireworks',
      difficulty: '2800',
      url: 'https://codeforces.com/problemset?tags=dp,data+structures',
      patternNote: 'Bottom-up tree convex DP merging child heaps via Small-to-Large swaps.',
    },
  ],
  interviewNotes: [
    'Clearly verify the two closure properties that enable Slope Trick: sums of convex piecewise-linear functions preserve convexity, and sliding/prefix minimization shifts breakpoints laterally without changing integer slope steps.',
    'Explain how single-heap non-decreasing DP generalizes to strictly increasing sequences via a_i\' = a_i - i, transforming b_i < b_{i+1} into b_i - i <= b_{i+1} - (i+1).',
    'Walk through Small-to-Large heap merging on trees and show why f_min equals sum(w) minus the sum of remaining breakpoints below slope 0—turning a seemingly O(N * V) continuous DP into O(N log N).',
  ],
  projectBlueprint: {
    title: 'Real-Time Supply-Demand Pricing & Monotonic Signal Smoothing Optimizer',
    tagline: 'O(N log N) L1 isotonic regression and rate-constrained pricing trajectory solver for streaming time-series',
    stackSummary: 'TypeScript Dual-Heap Solver Core + Convex Breakpoint Curve Visualizer',
    asciiDiagram: [
      '+---------------------------------------------------------------+',
      '|  Noisy Stream A[1..N] + Step Bounds [L_step, R_step]          |',
      '|        |                                                      |',
      '|        +--> Left Max-Heap (+shiftL)   [slope < 0]             |',
      '|        +--> Right Min-Heap (+shiftR)  [slope > 0]             |',
      '|        |                                                      |',
      '|        v                                                      |',
      '|  Exact O(N log N) L1 Optimal Trajectory Cost                  |',
      '+---------------------------------------------------------------+',
    ].join('\n'),
    milestones: [
      {
        id: 'm1',
        title: 'Isotonic Single-Heap Median Stream',
        detail: 'Compute exact non-decreasing L1 fit in a single priority queue pass.',
      },
      {
        id: 'm2',
        title: 'Lazy-Shift Dual-Heap Band Controller',
        detail: 'Enforce rate-of-change caps [L_step, R_step] without per-step heap rebuilds.',
      },
      {
        id: 'm3',
        title: 'Hierarchical Tree Synchronization',
        detail: 'Merge downstream cost curves upward using Small-to-Large heap ownership transfer.',
      },
    ],
    starterCode: `export function minNonDecreasingL1(a: number[]): number {
  // Simple O(N log N) Slope Trick via binary max-heap
  const h: number[] = [];
  const push = (x: number) => {
    h.push(x);
    let i = h.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (h[p] >= h[i]) break;
      [h[p], h[i]] = [h[i], h[p]];
      i = p;
    }
  };
  const pop = () => {
    const top = h[0], last = h.pop()!;
    if (h.length) {
      h[0] = last;
      let i = 0;
      while (true) {
        let best = i, l = 2 * i + 1, r = 2 * i + 2;
        if (l < h.length && h[l] > h[best]) best = l;
        if (r < h.length && h[r] > h[best]) best = r;
        if (best === i) break;
        [h[i], h[best]] = [h[best], h[i]];
        i = best;
      }
    }
    return top;
  };
  let cost = 0;
  for (const x of a) { push(x); push(x); cost += pop() - x; }
  return cost;
}`,
  },
};
