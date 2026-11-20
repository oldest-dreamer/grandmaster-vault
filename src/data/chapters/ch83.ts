import type { TheoryChapter } from '../../types/vault';

export const CH83_AMORTIZED_POTENTIAL_UNDO: TheoryChapter = {
  slug: 'online-offline-amortized-potential',
  topicId: 'th-80',
  title: 'Amortized Potential Functions & Undoable Structures',
  domain: 'Theoretical & Randomized',
  ratingTier: '2600–3300+',
  usacoDivision: 'Advanced',
  subtitle: 'Tarjan’s physicist potential method, Two-Stack Sliding Window Aggregation (SWAG), Bentley-Saxe logarithmic decomposable search, and FIFO queue undo on LIFO Rollback DSU',
  analogyTitle: 'Storing Tax Credits in a Potential Battery to Pay for Expensive Rebuilds',
  analogyBody:
    'Many fundamental algebraic operations and data structures lack direct deletion or inversion: greatest common divisor (gcd), matrix multiplication over a non-invertible ring, (+, min) tropical convolution, Aho-Corasick automata, and Union-Find (DSU). Tarjan’s Potential Method Phi(D_t) >= 0 acts like a rechargeable battery attached to the data structure: every cheap insertion deposits a small credit (+1) into Phi, so when an expensive O(K) reorganization finally triggers, the stored potential drops by ΔPhi = -K and completely pays for the real CPU work!\n\nThree universal black-box transformations emerge from this principle:\n1. Two-Stack Sliding Window Aggregation (SWAG): Maintain a Front stack F (storing suffix monoid products) and a Back stack B (storing prefix monoid products) with potential Phi = |B|. Pushing to B takes 1 operation (+1 potential); when F is empty, pouring all K elements from B into F costs K operations but releases ΔPhi = -K potential, giving O(1) amortized monoid multiplications per sliding-window advance.\n2. Bentley-Saxe Logarithmic Grouping: Partition N active items into power-of-two static buckets B_0, B_1, ..., B_L following binary carry propagation. Each element is rebuilt at most floor(log2 N) + 1 times, turning static indexes like Aho-Corasick or Convex Hulls into online dynamic structures in O(log N) amortized time.\n3. FIFO Queue Undo on LIFO Rollback DSU: Tag items on the LIFO stack as A (front stack) or B (back stack). When pop_front() encounters buried A items beneath B items, pop a balanced suffix where |pulled_A| == |pulled_B| and re-push B below A in O(log Q) amortized rollbacks.',
  prerequisites: [
    {
      slug: 'cdq-divide-conquer-offline',
      title: 'CDQ Divide & Conquer and Offline Dynamic Connectivity',
    },
  ],
  traceTitle: 'Two-Stack Sliding Window Aggregation (SWAG) on Window K = 3 Over A = [12, 18, 24, 36]',
  traceSubtitle: 'Tracking Front Stack suffix GCDs, Back Stack prefix GCDs, and Tarjan Potential Phi = |B|',
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Step 1: Push First 3 Elements into Back Stack B (Phi = |B| = 3)',
      explanation: 'Push 12, 18, 24 onto Back Stack B. Each node stores (val, running_gcd): B = [(12, 12), (18, 6), (24, 6)]. Front stack F is empty. Window [12, 18, 24] GCD = 6. Potential Phi = |B| = 3.',
      mode: 'array',
      arrays: [
        {
          name: 'SWAG Queues After 3 Pushes (Front Empty, Back Size 3)',
          cells: [
            { index: 0, value: 'F: []', label: 'empty', highlight: 'neutral' },
            { index: 1, value: 'B0:(12, g=12)', label: 'push 1', highlight: 'active' },
            { index: 2, value: 'B1:(18, g=6)', label: 'push 2', highlight: 'active' },
            { index: 3, value: 'B2:(24, g=6)', label: 'top B', highlight: 'updated' },
            { index: 4, value: 'Phi = |B| = 3', label: 'WinGCD=6', highlight: 'updated' },
          ],
        },
      ],
      variables: { frontSize: 0, backSize: 3, windowGCD: 6, potentialPhi: 3 },
    },
    {
      stepNumber: 2,
      title: 'Step 2: Pop Front Triggers Stack Pour B -> F (ΔPhi = -3 Pays for 3 GCDs)',
      explanation: 'Calling pop_front() with empty F pours all 3 items from B onto F with suffix GCDs: F = [(24, 24), (18, 6), (12, 6)], then pops top (12) from F. Potential drops from 3 to 0, paying for the 3 GCD calls!',
      mode: 'array',
      arrays: [
        {
          name: 'After Pouring B -> F and Popping Oldest Element (12)',
          cells: [
            { index: 0, value: 'F0:(24, g=24)', label: 'bottom F', highlight: 'active' },
            { index: 1, value: 'F1:(18, g=6)', label: 'top F', highlight: 'updated' },
            { index: 2, value: 'Popped: 12', label: 'removed', highlight: 'neutral' },
            { index: 3, value: 'B: []', label: 'empty', highlight: 'neutral' },
            { index: 4, value: 'Phi = |B| = 0', label: 'dPhi = -3', highlight: 'updated' },
          ],
        },
      ],
      variables: { frontSize: 2, backSize: 0, realCost: 3, deltaPhi: -3, amortizedCost: 0 },
    },
    {
      stepNumber: 3,
      title: 'Step 3: Push 36 onto Back Stack B & Query gcd(F.top, B.top) in O(1)',
      explanation: 'Push 36 onto B: B = [(36, g=36)], Phi = 1. Window [18, 24, 36] is split across F=[24, 18] (agg=6) and B=[36] (agg=36). Total Window GCD = gcd(6, 36) = 6 in O(1)!',
      mode: 'array',
      arrays: [
        {
          name: 'Combined O(1) Two-Stack Query gcd(F.top, B.top)',
          cells: [
            { index: 0, value: 'F0:(24, g=24)', label: 'F', highlight: 'neutral' },
            { index: 1, value: 'F1:(18, g=6)', label: 'F_agg=6', highlight: 'updated' },
            { index: 2, value: 'B0:(36, g=36)', label: 'B_agg=36', highlight: 'updated' },
            { index: 3, value: 'gcd(6,36) = 6', label: 'WinGCD=6', highlight: 'active' },
          ],
        },
      ],
      variables: { frontAgg: 6, backAgg: 36, windowGCD: 6, potentialPhi: 1 },
    },
  ],
  reductionClues: [
    {
      clue: 'Maintain sliding-window range product [L, R] over a non-invertible monoid (GCD, min/max, KxK matrices, affine functions)',
      translation: 'Use a Two-Stack SWAG queue (Front suffix aggregates, Back prefix aggregates) for O(1) amortized monoid multiplications per step.',
    },
    {
      clue: 'Convert a static structure (Aho-Corasick automaton, Convex Hull, K-D tree) into an online dynamic structure with insertions',
      translation: 'Group active elements into Bentley-Saxe binary buckets B_k of size 2^k; merge equal powers of two on insert and sum/min across O(log N) buckets on query.',
    },
    {
      clue: 'Online insertions AND deletions on a decomposable counting query (e.g., Dynamic Aho-Corasick substring occurrences)',
      translation: 'Maintain two Bentley-Saxe forests—one for inserted items and one for deleted items—and return query(Inserted) - query(Deleted).',
    },
    {
      clue: 'Simulate online FIFO queue edge pops (sliding window connectivity/bipartiteness) using a LIFO Rollback DSU',
      translation: 'Tag LIFO stack items as A (front) or B (back); when B buries A on pop_front, pop a suffix with |pulled_A| == |pulled_B| and re-push B below A in O(log Q) amortized rollbacks.',
    },
  ],
  timeComplexity: 'O(1) amortized SWAG; O(log N) amortized Bentley-Saxe & FIFO-on-LIFO Undo',
  spaceComplexity: 'O(N) stack / bucket storage',
  pitfalls: [
    {
      type: 'WA',
      title: 'Multiplying Non-Commutative Monoid Aggregates in the Wrong Order When Pouring B -> F in SWAG',
      detail: 'For matrices or affine functions, sequence order x_L * ... * x_R must be preserved: Front stack pushes must left-multiply combine(x, F.top().agg), Back stack pushes must right-multiply combine(B.top().agg, y), and queries return combine(F.top().agg, B.top().agg).',
    },
    {
      type: 'TLE',
      title: 'Using Path Compression Inside a Rollback DSU',
      detail: 'Path compression mutates an unbounded number of parent pointers during find(), destroying the O(log N) bound under repeated rollbacks. Always use Union-by-Size WITHOUT path compression so each unite() modifies O(1) cells.',
    },
    {
      type: 'TLE',
      title: 'Rebuilding a Single Monolithic Aho-Corasick Automaton on Every Online Pattern Insertion',
      detail: 'Rebuilding from scratch on each insert takes O(Q * sum |P|) = O(N^2). Bentley-Saxe binary grouping ensures each character is rebuilt at most floor(log2 Q) + 1 times.',
    },
    {
      type: 'WA',
      title: 'Reversing Relative Order Within Pulled A or Pulled B During FIFO-on-LIFO Rebalancing',
      detail: 'When rebalancing a suffix where B buries A, only when total_A == 0 do we reverse all B items into A items; when total_A > 0, both pulled_B and pulled_A must be re-pushed in their original bottom-to-top relative order (with pulled_A placed above pulled_B).',
    },
  ],
  implementations: {
    cpp20: `#include <iostream>
#include <vector>
#include <numeric>

using namespace std;

// Two-Stack Sliding Window Aggregation (SWAG) for any associative monoid (here GCD)
struct SwagGCD {
    struct Node {
        long long val;
        long long agg;
    };
    vector<Node> front_st, back_st;

    void push_back(long long x) {
        long long g = back_st.empty() ? x : std::gcd(back_st.back().agg, x);
        back_st.push_back({x, g});
    }

    void pop_front() {
        if (front_st.empty()) {
            while (!back_st.empty()) {
                long long x = back_st.back().val;
                back_st.pop_back();
                long long g = front_st.empty() ? x : std::gcd(x, front_st.back().agg);
                front_st.push_back({x, g});
            }
        }
        if (!front_st.empty()) front_st.pop_back();
    }

    long long query() const {
        if (front_st.empty()) return back_st.back().agg;
        if (back_st.empty()) return front_st.back().agg;
        return std::gcd(front_st.back().agg, back_st.back().agg);
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, k;
    if (!(cin >> n >> k)) return 0;
    vector<long long> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];
    SwagGCD swag;
    for (int i = 0; i < n; i++) {
        swag.push_back(a[i]);
        if (i >= k - 1) {
            cout << swag.query() << (i + 1 == n ? "" : " ");
            swag.pop_front();
        }
    }
    cout << "\\n";
    return 0;
}`,
    rust: `use std::io::{self, Read};

fn gcd(mut a: i64, mut b: i64) -> i64 {
    while b != 0 {
        let t = a % b;
        a = b;
        b = t;
    }
    a.abs()
}

struct SwagGCD {
    front_st: Vec<(i64, i64)>,
    back_st: Vec<(i64, i64)>,
}

impl SwagGCD {
    fn new() -> Self {
        Self { front_st: Vec::new(), back_st: Vec::new() }
    }
    fn push_back(&mut self, x: i64) {
        let g = match self.back_st.last() {
            Some(&(_, agg)) => gcd(agg, x),
            None => x,
        };
        self.back_st.push((x, g));
    }
    fn pop_front(&mut self) {
        if self.front_st.is_empty() {
            while let Some((x, _)) = self.back_st.pop() {
                let g = match self.front_st.last() {
                    Some(&(_, agg)) => gcd(x, agg),
                    None => x,
                };
                self.front_st.push((x, g));
            }
        }
        self.front_st.pop();
    }
    fn query(&self) -> i64 {
        match (self.front_st.last(), self.back_st.last()) {
            (Some(&(_, fg)), Some(&(_, bg))) => gcd(fg, bg),
            (Some(&(_, fg)), None) => fg,
            (None, Some(&(_, bg))) => bg,
            (None, None) => 0,
        }
    }
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let n: usize = match it.next() {
        Some(s) => s.parse().unwrap(),
        None => return,
    };
    let k: usize = it.next().unwrap().parse().unwrap();
    let mut swag = SwagGCD::new();
    let mut out = Vec::with_capacity(n - k + 1);
    for i in 0..n {
        let x: i64 = it.next().unwrap().parse().unwrap();
        swag.push_back(x);
        if i + 1 >= k {
            out.push(swag.query().to_string());
            swag.pop_front();
        }
    }
    println!("{}", out.join(" "));
}`,
    java21: `import java.io.*;
import java.util.*;

public class Main {
    static long gcd(long a, long b) {
        while (b != 0) {
            long t = a % b;
            a = b;
            b = t;
        }
        return Math.abs(a);
    }

    static class SwagGCD {
        long[] fVal, fAgg, bVal, bAgg;
        int fTop = 0, bTop = 0;

        SwagGCD(int cap) {
            fVal = new long[cap];
            fAgg = new long[cap];
            bVal = new long[cap];
            bAgg = new long[cap];
        }

        void pushBack(long x) {
            long g = (bTop == 0) ? x : gcd(bAgg[bTop - 1], x);
            bVal[bTop] = x;
            bAgg[bTop] = g;
            bTop++;
        }

        void popFront() {
            if (fTop == 0) {
                while (bTop > 0) {
                    long x = bVal[--bTop];
                    long g = (fTop == 0) ? x : gcd(x, fAgg[fTop - 1]);
                    fVal[fTop] = x;
                    fAgg[fTop] = g;
                    fTop++;
                }
            }
            if (fTop > 0) fTop--;
        }

        long query() {
            if (fTop == 0) return bAgg[bTop - 1];
            if (bTop == 0) return fAgg[fTop - 1];
            return gcd(fAgg[fTop - 1], bAgg[bTop - 1]);
        }
    }

    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = null;
        while (st == null || !st.hasMoreTokens()) {
            String line = br.readLine();
            if (line == null) return;
            st = new StringTokenizer(line);
        }
        int n = Integer.parseInt(st.nextToken());
        int k = Integer.parseInt(st.nextToken());
        SwagGCD swag = new SwagGCD(n + 5);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) {
            while (!st.hasMoreTokens()) st = new StringTokenizer(br.readLine());
            long x = Long.parseLong(st.nextToken());
            swag.pushBack(x);
            if (i >= k - 1) {
                if (sb.length() > 0) sb.append(' ');
                sb.append(swag.query());
                swag.popFront();
            }
        }
        System.out.println(sb.toString());
    }
}`,
    python3: `import sys
import math

class SwagGCD:
    def __init__(self):
        self.front_st = []
        self.back_st = []

    def push_back(self, x: int):
        g = x if not self.back_st else math.gcd(self.back_st[-1][1], x)
        self.back_st.append((x, g))

    def pop_front(self):
        if not self.front_st:
            while self.back_st:
                x, _ = self.back_st.pop()
                g = x if not self.front_st else math.gcd(x, self.front_st[-1][1])
                self.front_st.append((x, g))
        if self.front_st:
            self.front_st.pop()

    def query(self) -> int:
        if not self.front_st:
            return self.back_st[-1][1]
        if not self.back_st:
            return self.front_st[-1][1]
        return math.gcd(self.front_st[-1][1], self.back_st[-1][1])

def main():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    it = iter(tokens)
    n = int(next(it))
    k = int(next(it))
    swag = SwagGCD()
    out = []
    for i in range(n):
        x = int(next(it))
        swag.push_back(x)
        if i >= k - 1:
            out.append(str(swag.query()))
            swag.pop_front()
    print(" ".join(out))

if __name__ == '__main__':
    main()`,
    ruby: `class SwagGCD
  def initialize
    @front_st = []
    @back_st = []
  end

  def push_back(x)
    g = @back_st.empty? ? x : @back_st[-1][1].gcd(x)
    @back_st << [x, g]
  end

  def pop_front
    if @front_st.empty?
      until @back_st.empty?
        x, _ = @back_st.pop
        g = @front_st.empty? ? x : x.gcd(@front_st[-1][1])
        @front_st << [x, g]
      end
    end
    @front_st.pop unless @front_st.empty?
  end

  def query
    return @back_st[-1][1] if @front_st.empty?
    return @front_st[-1][1] if @back_st.empty?
    @front_st[-1][1].gcd(@back_st[-1][1])
  end
end

tokens = STDIN.read.split
exit if tokens.empty?
n = tokens[0].to_i
k = tokens[1].to_i
swag = SwagGCD.new
out = []
(0...n).each do |i|
  swag.push_back(tokens[i + 2].to_i)
  if i >= k - 1
    out << swag.query
    swag.pop_front
  end
end
puts out.join(" ")`,
  },
  practiceProblems: [
    {
      id: 'ch83-p1',
      tier: 'Warmup',
      ratingRange: '2400–2600',
      title: 'Sliding Window Non-Invertible Monoid GCD via Two-Stack Queue (SWAG)',
      statement:
        'Given an array $A$ of $N$ positive integers ($1 \\le N \\le 2 \\cdot 10^5$, $1 \\le A_i \\le 10^{18}$) and a window length $K$ ($1 \\le K \\le N$), compute the greatest common divisor $\\gcd(A_i, A_{i+1}, \\dots, A_{i+K-1})$ for every contiguous window of length $K$ ($1 \\le i \\le N - K + 1$) using $O(N)$ total $\\gcd$ evaluations via Two-Stack Sliding Window Aggregation.',
      constraints: '1 <= K <= N <= 2 * 10^5, 1 <= A_i <= 10^18',
      sampleInput: '6 3\n12 18 24 36 48 60',
      sampleOutput: '6 6 12 12',
      hints: [
        'Unlike sum or XOR, $\\gcd$ is non-invertible: when $A_i$ leaves the left end of the window, you cannot "divide out" $A_i$ from the running GCD.',
        'Maintain two stacks `front_st` and `back_st` where each node stores `(value, running_gcd)`. Pushing to `back_st` updates `gcd(back_st.top().agg, x)`.',
        'When `pop_front()` is called and `front_st` is empty, pop all elements from `back_st` into `front_st`, recomputing suffix GCDs. By Tarjan’s potential $\\Phi = |\\text{back\\_st}|$, each element is moved from `back_st` to `front_st` at most once!',
      ],
      solutions: {
        cpp20: `#include <iostream>
#include <vector>
#include <numeric>

using namespace std;

struct SwagGCD {
    struct Node { long long val, agg; };
    vector<Node> front_st, back_st;

    void push_back(long long x) {
        long long g = back_st.empty() ? x : std::gcd(back_st.back().agg, x);
        back_st.push_back({x, g});
    }

    void pop_front() {
        if (front_st.empty()) {
            while (!back_st.empty()) {
                long long x = back_st.back().val;
                back_st.pop_back();
                long long g = front_st.empty() ? x : std::gcd(x, front_st.back().agg);
                front_st.push_back({x, g});
            }
        }
        if (!front_st.empty()) front_st.pop_back();
    }

    long long query() const {
        if (front_st.empty()) return back_st.back().agg;
        if (back_st.empty()) return front_st.back().agg;
        return std::gcd(front_st.back().agg, back_st.back().agg);
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, k;
    if (!(cin >> n >> k)) return 0;
    SwagGCD swag;
    for (int i = 0; i < n; i++) {
        long long x;
        cin >> x;
        swag.push_back(x);
        if (i >= k - 1) {
            cout << swag.query() << (i + 1 == n ? "" : " ");
            swag.pop_front();
        }
    }
    cout << "\\n";
    return 0;
}`,
        rust: `use std::io::{self, Read};

fn gcd(mut a: i64, mut b: i64) -> i64 {
    while b != 0 {
        let t = a % b;
        a = b;
        b = t;
    }
    a.abs()
}

struct SwagGCD {
    front_st: Vec<(i64, i64)>,
    back_st: Vec<(i64, i64)>,
}

impl SwagGCD {
    fn new() -> Self { Self { front_st: Vec::new(), back_st: Vec::new() } }
    fn push_back(&mut self, x: i64) {
        let g = self.back_st.last().map_or(x, |&(_, agg)| gcd(agg, x));
        self.back_st.push((x, g));
    }
    fn pop_front(&mut self) {
        if self.front_st.is_empty() {
            while let Some((x, _)) = self.back_st.pop() {
                let g = self.front_st.last().map_or(x, |&(_, agg)| gcd(x, agg));
                self.front_st.push((x, g));
            }
        }
        self.front_st.pop();
    }
    fn query(&self) -> i64 {
        match (self.front_st.last(), self.back_st.last()) {
            (Some(&(_, fg)), Some(&(_, bg))) => gcd(fg, bg),
            (Some(&(_, fg)), None) => fg,
            (None, Some(&(_, bg))) => bg,
            (None, None) => 0,
        }
    }
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let n: usize = match it.next() { Some(s) => s.parse().unwrap(), None => return };
    let k: usize = it.next().unwrap().parse().unwrap();
    let mut swag = SwagGCD::new();
    let mut out = Vec::with_capacity(n - k + 1);
    for i in 0..n {
        let x: i64 = it.next().unwrap().parse().unwrap();
        swag.push_back(x);
        if i + 1 >= k {
            out.push(swag.query().to_string());
            swag.pop_front();
        }
    }
    println!("{}", out.join(" "));
}`,
        java21: `import java.io.*;
import java.util.*;

public class Main {
    static long gcd(long a, long b) {
        while (b != 0) { long t = a % b; a = b; b = t; }
        return Math.abs(a);
    }

    static class SwagGCD {
        long[] fVal, fAgg, bVal, bAgg;
        int fTop = 0, bTop = 0;
        SwagGCD(int cap) {
            fVal = new long[cap]; fAgg = new long[cap];
            bVal = new long[cap]; bAgg = new long[cap];
        }
        void pushBack(long x) {
            bVal[bTop] = x;
            bAgg[bTop] = (bTop == 0) ? x : gcd(bAgg[bTop - 1], x);
            bTop++;
        }
        void popFront() {
            if (fTop == 0) {
                while (bTop > 0) {
                    long x = bVal[--bTop];
                    fVal[fTop] = x;
                    fAgg[fTop] = (fTop == 0) ? x : gcd(x, fAgg[fTop - 1]);
                    fTop++;
                }
            }
            if (fTop > 0) fTop--;
        }
        long query() {
            if (fTop == 0) return bAgg[bTop - 1];
            if (bTop == 0) return fAgg[fTop - 1];
            return gcd(fAgg[fTop - 1], bAgg[bTop - 1]);
        }
    }

    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = null;
        while (st == null || !st.hasMoreTokens()) {
            String line = br.readLine();
            if (line == null) return;
            st = new StringTokenizer(line);
        }
        int n = Integer.parseInt(st.nextToken());
        int k = Integer.parseInt(st.nextToken());
        SwagGCD swag = new SwagGCD(n + 5);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) {
            while (!st.hasMoreTokens()) st = new StringTokenizer(br.readLine());
            swag.pushBack(Long.parseLong(st.nextToken()));
            if (i >= k - 1) {
                if (sb.length() > 0) sb.append(' ');
                sb.append(swag.query());
                swag.popFront();
            }
        }
        System.out.println(sb.toString());
    }
}`,
        python3: `import sys
import math

class SwagGCD:
    def __init__(self):
        self.front_st = []
        self.back_st = []

    def push_back(self, x: int):
        g = x if not self.back_st else math.gcd(self.back_st[-1][1], x)
        self.back_st.append((x, g))

    def pop_front(self):
        if not self.front_st:
            while self.back_st:
                x, _ = self.back_st.pop()
                g = x if not self.front_st else math.gcd(x, self.front_st[-1][1])
                self.front_st.append((x, g))
        if self.front_st:
            self.front_st.pop()

    def query(self) -> int:
        if not self.front_st:
            return self.back_st[-1][1]
        if not self.back_st:
            return self.front_st[-1][1]
        return math.gcd(self.front_st[-1][1], self.back_st[-1][1])

def main():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    it = iter(tokens)
    n = int(next(it))
    k = int(next(it))
    swag = SwagGCD()
    out = []
    for i in range(n):
        swag.push_back(int(next(it)))
        if i >= k - 1:
            out.append(str(swag.query()))
            swag.pop_front()
    print(" ".join(out))

if __name__ == '__main__':
    main()`,
        ruby: `class SwagGCD
  def initialize
    @front_st = []
    @back_st = []
  end
  def push_back(x)
    g = @back_st.empty? ? x : @back_st[-1][1].gcd(x)
    @back_st << [x, g]
  end
  def pop_front
    if @front_st.empty?
      until @back_st.empty?
        x, _ = @back_st.pop
        g = @front_st.empty? ? x : x.gcd(@front_st[-1][1])
        @front_st << [x, g]
      end
    end
    @front_st.pop unless @front_st.empty?
  end
  def query
    return @back_st[-1][1] if @front_st.empty?
    return @front_st[-1][1] if @back_st.empty?
    @front_st[-1][1].gcd(@back_st[-1][1])
  end
end

tokens = STDIN.read.split
exit if tokens.empty?
n = tokens[0].to_i; k = tokens[1].to_i
swag = SwagGCD.new
out = []
(0...n).each do |i|
  swag.push_back(tokens[i + 2].to_i)
  if i >= k - 1
    out << swag.query
    swag.pop_front
  end
end
puts out.join(" ")`,
      },
    },
    {
      id: 'ch83-p2',
      tier: 'Standard',
      ratingRange: '2600–2900',
      title: 'Online Dynamic Aho-Corasick via Bentley-Saxe Logarithmic Binary Grouping',
      statement:
        'Process $Q$ online queries ($1 \\le Q \\le 5 \\cdot 10^4$, total string length $\\sum |S| \\le 2 \\cdot 10^5$ over lowercase English letters `a`–`z`):\\n- `1 P`: Insert pattern string $P$ into the active multiset of patterns.\\n- `2 T`: Count the total number of occurrences of all currently inserted patterns as substrings of text $T$ (if a pattern was inserted multiple times, count each copy).\\nAll queries are strictly online. Implement the **Bentley-Saxe Logarithmic Method** (maintaining $O(\\log Q)$ static Aho-Corasick automata of sizes $2^0, 2^1, 2^2, \\dots$).',
      constraints: '1 <= Q <= 5 * 10^4, sum of |P| and |T| <= 2 * 10^5, alphabet a-z',
      sampleInput: '5\n1 ab\n1 b\n2 abab\n1 aba\n2 ababa',
      sampleOutput: '4\n6',
      hints: [
        'A single Aho-Corasick automaton requires all failure links to be built via BFS before answering queries, making it inherently static.',
        'Maintain an array of buckets $B_0, B_1, \\dots, B_{17}$, where bucket $B_k$ either is empty or stores $2^k$ patterns along with their compiled Aho-Corasick automaton.',
        'To insert a new pattern $P$, place $[P]$ in a temporary list. For $k = 0, 1, \\dots$: if $B_k$ is non-empty, append $B_k$’s patterns to the temporary list and clear $B_k$; when you hit the first empty $B_k$, move the $2^k$ patterns into $B_k$ and run the linear-time Aho-Corasick BFS build on $B_k$!',
      ],
      solutions: {
        cpp20: `#include <iostream>
#include <vector>
#include <string>
#include <queue>
#include <array>

using namespace std;

struct AhoBucket {
    vector<string> patterns;
    vector<array<int, 26>> trie;
    vector<int> fail;
    vector<long long> out_cnt;

    void clear() {
        patterns.clear();
        trie.clear();
        fail.clear();
        out_cnt.clear();
    }

    void build() {
        trie.clear();
        fail.clear();
        out_cnt.clear();
        trie.push_back({});
        trie[0].fill(0);
        fail.push_back(0);
        out_cnt.push_back(0);

        for (const string& s : patterns) {
            int u = 0;
            for (char ch : s) {
                int c = ch - 'a';
                if (!trie[u][c]) {
                    trie[u][c] = (int)trie.size();
                    trie.push_back({});
                    trie.back().fill(0);
                    fail.push_back(0);
                    out_cnt.push_back(0);
                }
                u = trie[u][c];
            }
            out_cnt[u]++;
        }

        queue<int> q;
        for (int c = 0; c < 26; c++) {
            if (trie[0][c]) q.push(trie[0][c]);
        }
        while (!q.empty()) {
            int u = q.front();
            q.pop();
            out_cnt[u] += out_cnt[fail[u]];
            for (int c = 0; c < 26; c++) {
                int v = trie[u][c];
                if (v) {
                    fail[v] = trie[fail[u]][c];
                    q.push(v);
                } else {
                    trie[u][c] = trie[fail[u]][c];
                }
            }
        }
    }

    long long query(const string& text) const {
        if (patterns.empty()) return 0;
        int u = 0;
        long long total = 0;
        for (char ch : text) {
            u = trie[u][ch - 'a'];
            total += out_cnt[u];
        }
        return total;
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int q;
    if (!(cin >> q)) return 0;
    vector<AhoBucket> buckets(18);
    while (q--) {
        int type;
        string s;
        cin >> type >> s;
        if (type == 1) {
            vector<string> carry = {s};
            for (int k = 0; k < 18; k++) {
                if (buckets[k].patterns.empty()) {
                    buckets[k].patterns = move(carry);
                    buckets[k].build();
                    break;
                } else {
                    for (string& p : buckets[k].patterns) carry.push_back(move(p));
                    buckets[k].clear();
                }
            }
        } else {
            long long ans = 0;
            for (int k = 0; k < 18; k++) {
                if (!buckets[k].patterns.empty()) ans += buckets[k].query(s);
            }
            cout << ans << "\\n";
        }
    }
    return 0;
}`,
        rust: `use std::collections::VecDeque;
use std::io::{self, Read};

struct AhoBucket {
    patterns: Vec<Vec<usize>>,
    trie: Vec<[usize; 26]>,
    fail: Vec<usize>,
    out_cnt: Vec<i64>,
}

impl AhoBucket {
    fn new() -> Self {
        Self {
            patterns: Vec::new(),
            trie: Vec::new(),
            fail: Vec::new(),
            out_cnt: Vec::new(),
        }
    }

    fn clear(&mut self) {
        self.patterns.clear();
        self.trie.clear();
        self.fail.clear();
        self.out_cnt.clear();
    }

    fn build(&mut self) {
        self.trie.clear();
        self.fail.clear();
        self.out_cnt.clear();
        self.trie.push([0; 26]);
        self.fail.push(0);
        self.out_cnt.push(0);

        for pat in &self.patterns {
            let mut u = 0;
            for &c in pat {
                if self.trie[u][c] == 0 {
                    let nxt = self.trie.len();
                    self.trie[u][c] = nxt;
                    self.trie.push([0; 26]);
                    self.fail.push(0);
                    self.out_cnt.push(0);
                }
                u = self.trie[u][c];
            }
            self.out_cnt[u] += 1;
        }

        let mut q = VecDeque::new();
        for c in 0..26 {
            let v = self.trie[0][c];
            if v != 0 {
                q.push_back(v);
            }
        }
        while let Some(u) = q.pop_front() {
            let fu = self.fail[u];
            self.out_cnt[u] += self.out_cnt[fu];
            for c in 0..26 {
                let v = self.trie[u][c];
                if v != 0 {
                    self.fail[v] = self.trie[fu][c];
                    q.push_back(v);
                } else {
                    self.trie[u][c] = self.trie[fu][c];
                }
            }
        }
    }

    fn query(&self, text: &[usize]) -> i64 {
        if self.patterns.is_empty() {
            return 0;
        }
        let mut u = 0;
        let mut total = 0i64;
        for &c in text {
            u = self.trie[u][c];
            total += self.out_cnt[u];
        }
        total
    }
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let q: usize = match it.next() {
        Some(s) => s.parse().unwrap(),
        None => return,
    };
    let mut buckets: Vec<AhoBucket> = (0..18).map(|_| AhoBucket::new()).collect();
    for _ in 0..q {
        let t: usize = it.next().unwrap().parse().unwrap();
        let s: Vec<usize> = it
            .next()
            .unwrap()
            .bytes()
            .map(|b| (b - b'a') as usize)
            .collect();
        if t == 1 {
            let mut carry = vec![s];
            for k in 0..18 {
                if buckets[k].patterns.is_empty() {
                    buckets[k].patterns = carry;
                    buckets[k].build();
                    break;
                } else {
                    carry.append(&mut buckets[k].patterns);
                    buckets[k].clear();
                }
            }
        } else {
            let mut ans = 0i64;
            for k in 0..18 {
                if !buckets[k].patterns.is_empty() {
                    ans += buckets[k].query(&s);
                }
            }
            println!("{}", ans);
        }
    }
}`,
        java21: `import java.io.*;
import java.util.*;

public class Main {
    static class AhoBucket {
        List<String> patterns = new ArrayList<>();
        int[][] trie;
        int[] fail;
        long[] outCnt;

        void clear() {
            patterns.clear();
            trie = null;
            fail = null;
            outCnt = null;
        }

        void build() {
            int maxNodes = 1;
            for (String s : patterns) maxNodes += s.length();
            trie = new int[maxNodes][26];
            fail = new int[maxNodes];
            outCnt = new long[maxNodes];
            int sz = 1;

            for (String s : patterns) {
                int u = 0;
                for (int i = 0; i < s.length(); i++) {
                    int c = s.charAt(i) - 'a';
                    if (trie[u][c] == 0) trie[u][c] = sz++;
                    u = trie[u][c];
                }
                outCnt[u]++;
            }

            int[] q = new int[sz];
            int head = 0, tail = 0;
            for (int c = 0; c < 26; c++) {
                if (trie[0][c] != 0) q[tail++] = trie[0][c];
            }
            while (head < tail) {
                int u = q[head++];
                int fu = fail[u];
                outCnt[u] += outCnt[fu];
                for (int c = 0; c < 26; c++) {
                    int v = trie[u][c];
                    if (v != 0) {
                        fail[v] = trie[fu][c];
                        q[tail++] = v;
                    } else {
                        trie[u][c] = trie[fu][c];
                    }
                }
            }
        }

        long query(String text) {
            if (patterns.isEmpty()) return 0;
            int u = 0;
            long total = 0;
            for (int i = 0; i < text.length(); i++) {
                u = trie[u][text.charAt(i) - 'a'];
                total += outCnt[u];
            }
            return total;
        }
    }

    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = null;
        while (st == null || !st.hasMoreTokens()) {
            String line = br.readLine();
            if (line == null) return;
            st = new StringTokenizer(line);
        }
        int q = Integer.parseInt(st.nextToken());
        AhoBucket[] buckets = new AhoBucket[18];
        for (int i = 0; i < 18; i++) buckets[i] = new AhoBucket();
        StringBuilder sb = new StringBuilder();

        while (q-- > 0) {
            while (!st.hasMoreTokens()) st = new StringTokenizer(br.readLine());
            int type = Integer.parseInt(st.nextToken());
            while (!st.hasMoreTokens()) st = new StringTokenizer(br.readLine());
            String s = st.nextToken();
            if (type == 1) {
                List<String> carry = new ArrayList<>();
                carry.add(s);
                for (int k = 0; k < 18; k++) {
                    if (buckets[k].patterns.isEmpty()) {
                        buckets[k].patterns = carry;
                        buckets[k].build();
                        break;
                    } else {
                        carry.addAll(buckets[k].patterns);
                        buckets[k].clear();
                    }
                }
            } else {
                long ans = 0;
                for (int k = 0; k < 18; k++) {
                    if (!buckets[k].patterns.isEmpty()) ans += buckets[k].query(s);
                }
                sb.append(ans).append('\\n');
            }
        }
        System.out.print(sb.toString());
    }
}`,
        python3: `import sys
from collections import deque

class AhoBucket:
    def __init__(self):
        self.patterns = []
        self.trie = []
        self.fail = []
        self.out_cnt = []

    def clear(self):
        self.patterns = []
        self.trie = []
        self.fail = []
        self.out_cnt = []

    def build(self):
        self.trie = [[0] * 26]
        self.fail = [0]
        self.out_cnt = [0]
        for s in self.patterns:
            u = 0
            for ch in s:
                c = ord(ch) - 97
                if self.trie[u][c] == 0:
                    self.trie[u][c] = len(self.trie)
                    self.trie.append([0] * 26)
                    self.fail.append(0)
                    self.out_cnt.append(0)
                u = self.trie[u][c]
            self.out_cnt[u] += 1

        q = deque()
        for c in range(26):
            if self.trie[0][c]:
                q.append(self.trie[0][c])
        while q:
            u = q.popleft()
            fu = self.fail[u]
            self.out_cnt[u] += self.out_cnt[fu]
            row_u = self.trie[u]
            row_fu = self.trie[fu]
            for c in range(26):
                v = row_u[c]
                if v:
                    self.fail[v] = row_fu[c]
                    q.append(v)
                else:
                    row_u[c] = row_fu[c]

    def query(self, text: str) -> int:
        if not self.patterns:
            return 0
        u = 0
        total = 0
        trie = self.trie
        out_cnt = self.out_cnt
        for ch in text:
            u = trie[u][ord(ch) - 97]
            total += out_cnt[u]
        return total

def main():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    it = iter(tokens)
    q = int(next(it))
    buckets = [AhoBucket() for _ in range(18)]
    out = []
    for _ in range(q):
        t = int(next(it))
        s = next(it)
        if t == 1:
            carry = [s]
            for k in range(18):
                if not buckets[k].patterns:
                    buckets[k].patterns = carry
                    buckets[k].build()
                    break
                else:
                    carry.extend(buckets[k].patterns)
                    buckets[k].clear()
        else:
            ans = 0
            for k in range(18):
                if buckets[k].patterns:
                    ans += buckets[k].query(s)
            out.append(str(ans))
    print("\\n".join(out))

if __name__ == '__main__':
    main()`,
        ruby: `class AhoBucket
  attr_accessor :patterns

  def initialize
    clear
  end

  def clear
    @patterns = []
    @trie = []
    @fail = []
    @out_cnt = []
  end

  def build
    @trie = [Array.new(26, 0)]
    @fail = [0]
    @out_cnt = [0]
    @patterns.each do |s|
      u = 0
      s.each_byte do |b|
        c = b - 97
        if @trie[u][c] == 0
          @trie[u][c] = @trie.size
          @trie << Array.new(26, 0)
          @fail << 0
          @out_cnt << 0
        end
        u = @trie[u][c]
      end
      @out_cnt[u] += 1
    end

    q = []
    26.times { |c| q << @trie[0][c] if @trie[0][c] != 0 }
    head = 0
    while head < q.size
      u = q[head]
      head += 1
      fu = @fail[u]
      @out_cnt[u] += @out_cnt[fu]
      row_u = @trie[u]
      row_fu = @trie[fu]
      26.times do |c|
        v = row_u[c]
        if v != 0
          @fail[v] = row_fu[c]
          q << v
        else
          row_u[c] = row_fu[c]
        end
      end
    end
  end

  def query(text)
    return 0 if @patterns.empty?
    u = 0
    total = 0
    text.each_byte do |b|
      u = @trie[u][b - 97]
      total += @out_cnt[u]
    end
    total
  end
end

tokens = STDIN.read.split
exit if tokens.empty?
idx = 0
q = tokens[idx].to_i; idx += 1
buckets = Array.new(18) { AhoBucket.new }
out = []

q.times do
  t = tokens[idx].to_i; s = tokens[idx + 1]; idx += 2
  if t == 1
    carry = [s]
    18.times do |k|
      if buckets[k].patterns.empty?
        buckets[k].patterns = carry
        buckets[k].build
        break
      else
        carry.concat(buckets[k].patterns)
        buckets[k].clear
      end
    end
  else
    ans = 0
    18.times { |k| ans += buckets[k].query(s) unless buckets[k].patterns.empty? }
    out << ans
  end
end

puts out.join("\\n")`,
      },
    },
    {
      id: 'ch83-p3',
      tier: 'Boss',
      ratingRange: '2900–3300+',
      title: 'Online FIFO Queue Undo on a LIFO Rollback DSU via Two-Tag Rebalancing',
      statement:
        'Maintain an undirected graph on $N$ vertices ($1 \\le N \\le 10^5$) under $Q$ online FIFO queue operations ($1 \\le Q \\le 10^5$):\\n- `1 u v`: Push undirected edge $(u, v)$ to the **back** of the active FIFO edge queue.\\n- `2`: Pop the **oldest** edge from the **front** of the active FIFO edge queue.\\n- `3`: Output the current number of connected components in the graph formed by all edges currently in the FIFO queue.\\nAll operations must be processed strictly online using a LIFO Rollback DSU and the $O(\\log Q)$ amortized Two-Tag (`A`/`B`) FIFO-on-LIFO stack rebalancing algorithm.',
      constraints: '1 <= N, Q <= 10^5, 1 <= u, v <= N',
      sampleInput: '4 6\n3\n1 1 2\n1 2 3\n3\n2\n3',
      sampleOutput: '4\n2\n3',
      hints: [
        'A Rollback DSU (union-by-size without path compression) only supports LIFO `pop_back()`. To simulate FIFO `pop_front()`, tag each edge on the LIFO stack as `B` (back stack, chronological bottom-to-top) or `A` (front stack, reverse-chronological bottom-to-top).',
        'On `pop_front()`, if there are zero `A` items on the stack, pop all `B` items from the LIFO stack and re-push them in popped order as `A` items (reversing their order so the oldest sits at the top).',
        'If the top of the stack is a `B` item while `total_A > 0` items are buried below, pop items into `pulled_A` and `pulled_B` until `|pulled_A| == |pulled_B|` (or `|pulled_A| == total_A`), then re-push `pulled_B` followed by `pulled_A` so the oldest `A` item rises to the top in $O(\\log Q)$ amortized rollbacks!',
      ],
      solutions: {
        cpp20: `#include <iostream>
#include <vector>
#include <numeric>

using namespace std;

struct RollbackDSU {
    int n, comps;
    vector<int> parent, sz;
    struct Change { int u, v, merged; };
    vector<Change> history;

    RollbackDSU(int n) : n(n), comps(n), parent(n + 1), sz(n + 1, 1) {
        iota(parent.begin(), parent.end(), 0);
    }

    int find(int i) const {
        while (i != parent[i]) i = parent[i];
        return i;
    }

    void unite(int u, int v) {
        u = find(u);
        v = find(v);
        if (u == v) {
            history.push_back({u, v, 0});
            return;
        }
        if (sz[u] < sz[v]) swap(u, v);
        parent[v] = u;
        sz[u] += sz[v];
        comps--;
        history.push_back({u, v, 1});
    }

    void rollback() {
        auto ch = history.back();
        history.pop_back();
        if (ch.merged) {
            sz[ch.u] -= sz.at(ch.v);
            parent[ch.v] = ch.v;
            comps++;
        }
    }
};

struct Item {
    int u, v;
    char tag; // 'A' = front stack, 'B' = back stack
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, q;
    if (!(cin >> n >> q)) return 0;
    RollbackDSU dsu(n);
    vector<Item> st;
    int total_A = 0;

    auto push_item = [&](Item it) {
        st.push_back(it);
        if (it.tag == 'A') total_A++;
        dsu.unite(it.u, it.v);
    };

    auto pop_item = [&]() -> Item {
        Item it = st.back();
        st.pop_back();
        if (it.tag == 'A') total_A--;
        dsu.rollback();
        return it;
    };

    while (q--) {
        int type;
        cin >> type;
        if (type == 1) {
            int u, v;
            cin >> u >> v;
            push_item({u, v, 'B'});
        } else if (type == 2) {
            if (st.empty()) continue;
            if (total_A == 0) {
                vector<Item> all_b;
                all_b.reserve(st.size());
                while (!st.empty()) {
                    Item it = pop_item();
                    it.tag = 'A';
                    all_b.push_back(it);
                }
                for (const Item& it : all_b) push_item(it);
            } else if (st.back().tag == 'B') {
                vector<Item> pulled_A, pulled_B;
                int rem_A = total_A;
                while (pulled_A.empty() || (pulled_A.size() < pulled_B.size() && (int)pulled_A.size() < rem_A)) {
                    Item it = pop_item();
                    if (it.tag == 'A') pulled_A.push_back(it);
                    else pulled_B.push_back(it);
                }
                for (int i = (int)pulled_B.size() - 1; i >= 0; i--) push_item(pulled_B[i]);
                for (int i = (int)pulled_A.size() - 1; i >= 0; i--) push_item(pulled_A[i]);
            }
            pop_item();
        } else {
            cout << dsu.comps << "\\n";
        }
    }
    return 0;
}`,
        rust: `use std::io::{self, Read};

struct RollbackDSU {
    comps: usize,
    parent: Vec<usize>,
    sz: Vec<usize>,
    history: Vec<(usize, usize, bool)>,
}

impl RollbackDSU {
    fn new(n: usize) -> Self {
        Self {
            comps: n,
            parent: (0..=n).collect(),
            sz: vec![1; n + 1],
            history: Vec::new(),
        }
    }
    fn find(&self, mut i: usize) -> usize {
        while i != self.parent[i] {
            i = self.parent[i];
        }
        i
    }
    fn unite(&mut self, u: usize, v: usize) {
        let mut ru = self.find(u);
        let mut rv = self.find(v);
        if ru == rv {
            self.history.push((ru, rv, false));
            return;
        }
        if self.sz[ru] < self.sz[rv] {
            std::mem::swap(&mut ru, &mut rv);
        }
        self.parent[rv] = ru;
        self.sz[ru] += self.sz[rv];
        self.comps -= 1;
        self.history.push((ru, rv, true));
    }
    fn rollback(&mut self) {
        if let Some((u, v, merged)) = self.history.pop() {
            if merged {
                self.sz[u] -= self.sz[v];
                self.parent[v] = v;
                self.comps += 1;
            }
        }
    }
}

#[derive(Clone, Copy)]
struct Item {
    u: usize,
    v: usize,
    is_a: bool,
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let n: usize = match it.next() {
        Some(s) => s.parse().unwrap(),
        None => return,
    };
    let q: usize = it.next().unwrap().parse().unwrap();
    let mut dsu = RollbackDSU::new(n);
    let mut st: Vec<Item> = Vec::new();
    let mut total_a: usize = 0;

    let push_item = |item: Item, st: &mut Vec<Item>, total_a: &mut usize, dsu: &mut RollbackDSU| {
        st.push(item);
        if item.is_a {
            *total_a += 1;
        }
        dsu.unite(item.u, item.v);
    };

    let pop_item = |st: &mut Vec<Item>, total_a: &mut usize, dsu: &mut RollbackDSU| -> Item {
        let item = st.pop().unwrap();
        if item.is_a {
            *total_a -= 1;
        }
        dsu.rollback();
        item
    };

    let mut out = Vec::new();
    for _ in 0..q {
        let t: usize = it.next().unwrap().parse().unwrap();
        if t == 1 {
            let u: usize = it.next().unwrap().parse().unwrap();
            let v: usize = it.next().unwrap().parse().unwrap();
            push_item(Item { u, v, is_a: false }, &mut st, &mut total_a, &mut dsu);
        } else if t == 2 {
            if st.is_empty() {
                continue;
            }
            if total_a == 0 {
                let mut all_b = Vec::with_capacity(st.len());
                while !st.is_empty() {
                    let mut item = pop_item(&mut st, &mut total_a, &mut dsu);
                    item.is_a = true;
                    all_b.push(item);
                }
                for item in all_b {
                    push_item(item, &mut st, &mut total_a, &mut dsu);
                }
            } else if !st.last().unwrap().is_a {
                let mut pulled_a = Vec::new();
                let mut pulled_b = Vec::new();
                let rem_a = total_a;
                while pulled_a.is_empty() || (pulled_a.len() < pulled_b.len() && pulled_a.len() < rem_a) {
                    let item = pop_item(&mut st, &mut total_a, &mut dsu);
                    if item.is_a {
                        pulled_a.push(item);
                    } else {
                        pulled_b.push(item);
                    }
                }
                for &item in pulled_b.iter().rev() {
                    push_item(item, &mut st, &mut total_a, &mut dsu);
                }
                for &item in pulled_a.iter().rev() {
                    push_item(item, &mut st, &mut total_a, &mut dsu);
                }
            }
            pop_item(&mut st, &mut total_a, &mut dsu);
        } else {
            out.push(dsu.comps.to_string());
        }
    }
    println!("{}", out.join("\\n"));
}`,
        java21: `import java.io.*;
import java.util.*;

public class Main {
    static class RollbackDSU {
        int comps;
        int[] parent, sz, histU, histV, histMerged;
        int hTop = 0;

        RollbackDSU(int n, int maxOps) {
            comps = n;
            parent = new int[n + 1];
            sz = new int[n + 1];
            for (int i = 1; i <= n; i++) { parent[i] = i; sz[i] = 1; }
            histU = new int[maxOps];
            histV = new int[maxOps];
            histMerged = new int[maxOps];
        }

        int find(int i) {
            while (i != parent[i]) i = parent[i];
            return i;
        }

        void unite(int u, int v) {
            u = find(u);
            v = find(v);
            if (u == v) {
                histU[hTop] = u; histV[hTop] = v; histMerged[hTop++] = 0;
                return;
            }
            if (sz[u] < sz[v]) { int t = u; u = v; v = t; }
            parent[v] = u;
            sz[u] += sz[v];
            comps--;
            histU[hTop] = u; histV[hTop] = v; histMerged[hTop++] = 1;
        }

        void rollback() {
            --hTop;
            if (histMerged[hTop] == 1) {
                int u = histU[hTop], v = histV[hTop];
                sz[u] -= sz[v];
                parent[v] = v;
                comps++;
            }
        }
    }

    static class Item {
        int u, v;
        boolean isA;
        Item(int u, int v, boolean isA) { this.u = u; this.v = v; this.isA = isA; }
    }

    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer stTok = null;
        while (stTok == null || !stTok.hasMoreTokens()) {
            String line = br.readLine();
            if (line == null) return;
            stTok = new StringTokenizer(line);
        }
        int n = Integer.parseInt(stTok.nextToken());
        int q = Integer.parseInt(stTok.nextToken());
        RollbackDSU dsu = new RollbackDSU(n, q + 5);
        List<Item> st = new ArrayList<>();
        int[] totalA = {0};

        Runnable popTop = () -> {
            Item it = st.remove(st.size() - 1);
            if (it.isA) totalA[0]--;
            dsu.rollback();
        };

        StringBuilder sb = new StringBuilder();
        while (q-- > 0) {
            while (!stTok.hasMoreTokens()) stTok = new StringTokenizer(br.readLine());
            int type = Integer.parseInt(stTok.nextToken());
            if (type == 1) {
                int u = Integer.parseInt(stTok.nextToken());
                int v = Integer.parseInt(stTok.nextToken());
                st.add(new Item(u, v, false));
                dsu.unite(u, v);
            } else if (type == 2) {
                if (st.isEmpty()) continue;
                if (totalA[0] == 0) {
                    List<Item> allB = new ArrayList<>(st.size());
                    while (!st.isEmpty()) {
                        Item it = st.remove(st.size() - 1);
                        dsu.rollback();
                        it.isA = true;
                        allB.add(it);
                    }
                    for (Item it : allB) {
                        st.add(it);
                        totalA[0]++;
                        dsu.unite(it.u, it.v);
                    }
                } else if (!st.get(st.size() - 1).isA) {
                    List<Item> pulledA = new ArrayList<>();
                    List<Item> pulledB = new ArrayList<>();
                    int remA = totalA[0];
                    while (pulledA.isEmpty() || (pulledA.size() < pulledB.size() && pulledA.size() < remA)) {
                        Item it = st.remove(st.size() - 1);
                        if (it.isA) totalA[0]--;
                        dsu.rollback();
                        if (it.isA) pulledA.add(it);
                        else pulledB.add(it);
                    }
                    for (int i = pulledB.size() - 1; i >= 0; i--) {
                        Item it = pulledB.get(i);
                        st.add(it);
                        dsu.unite(it.u, it.v);
                    }
                    for (int i = pulledA.size() - 1; i >= 0; i--) {
                        Item it = pulledA.get(i);
                        st.add(it);
                        totalA[0]++;
                        dsu.unite(it.u, it.v);
                    }
                }
                popTop.run();
            } else {
                sb.append(dsu.comps).append('\\n');
            }
        }
        System.out.print(sb.toString());
    }
}`,
        python3: `import sys

class RollbackDSU:
    def __init__(self, n: int):
        self.comps = n
        self.parent = list(range(n + 1))
        self.sz = [1] * (n + 1)
        self.history = []

    def find(self, i: int) -> int:
        parent = self.parent
        while i != parent[i]:
            i = parent[i]
        return i

    def unite(self, u: int, v: int):
        u = self.find(u)
        v = self.find(v)
        if u == v:
            self.history.append((u, v, False))
            return
        if self.sz[u] < self.sz[v]:
            u, v = v, u
        self.parent[v] = u
        self.sz[u] += self.sz[v]
        self.comps -= 1
        self.history.append((u, v, True))

    def rollback(self):
        u, v, merged = self.history.pop()
        if merged:
            self.sz[u] -= self.sz[v]
            self.parent[v] = v
            self.comps += 1

def main():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    it = iter(tokens)
    n = int(next(it))
    q = int(next(it))
    dsu = RollbackDSU(n)
    st = []
    total_a = 0

    def push_item(u, v, is_a):
        nonlocal total_a
        st.append((u, v, is_a))
        if is_a:
            total_a += 1
        dsu.unite(u, v)

    def pop_item():
        nonlocal total_a
        u, v, is_a = st.pop()
        if is_a:
            total_a -= 1
        dsu.rollback()
        return u, v, is_a

    out = []
    for _ in range(q):
        t = int(next(it))
        if t == 1:
            u = int(next(it))
            v = int(next(it))
            push_item(u, v, False)
        elif t == 2:
            if not st:
                continue
            if total_a == 0:
                all_b = []
                while st:
                    u, v, _ = pop_item()
                    all_b.append((u, v))
                for u, v in all_b:
                    push_item(u, v, True)
            elif not st[-1][2]:
                pulled_a = []
                pulled_b = []
                rem_a = total_a
                while not pulled_a or (len(pulled_a) < len(pulled_b) and len(pulled_a) < rem_a):
                    u, v, is_a = pop_item()
                    if is_a:
                        pulled_a.append((u, v))
                    else:
                        pulled_b.append((u, v))
                for u, v in reversed(pulled_b):
                    push_item(u, v, False)
                for u, v in reversed(pulled_a):
                    push_item(u, v, True)
            pop_item()
        else:
            out.append(str(dsu.comps))

    print("\\n".join(out))

if __name__ == '__main__':
    main()`,
        ruby: `class RollbackDSU
  attr_reader :comps

  def initialize(n)
    @comps = n
    @parent = (0..n).to_a
    @sz = Array.new(n + 1, 1)
    @history = []
  end

  def find(i)
    i = @parent[i] while i != @parent[i]
    i
  end

  def unite(u, v)
    u = find(u)
    v = find(v)
    if u == v
      @history << [u, v, false]
      return
    end
    u, v = v, u if @sz[u] < @sz[v]
    @parent[v] = u
    @sz[u] += @sz[v]
    @comps -= 1
    @history << [u, v, true]
  end

  def rollback
    u, v, merged = @history.pop
    if merged
      @sz[u] -= @sz[v]
      @parent[v] = v
      @comps += 1
    end
  end
end

tokens = STDIN.read.split
exit if tokens.empty?
idx = 0
n = tokens[idx].to_i; q = tokens[idx + 1].to_i; idx += 2
dsu = RollbackDSU.new(n)
st = []
total_a = 0

push_item = lambda do |u, v, is_a|
  st << [u, v, is_a]
  total_a += 1 if is_a
  dsu.unite(u, v)
end

pop_item = lambda do
  u, v, is_a = st.pop
  total_a -= 1 if is_a
  dsu.rollback
  [u, v, is_a]
end

out = []
q.times do
  t = tokens[idx].to_i; idx += 1
  if t == 1
    u = tokens[idx].to_i; v = tokens[idx + 1].to_i; idx += 2
    push_item.call(u, v, false)
  elsif t == 2
    next if st.empty?
    if total_a == 0
      all_b = []
      until st.empty?
        u, v, _ = pop_item.call
        all_b << [u, v]
      end
      all_b.each { |u, v| push_item.call(u, v, true) }
    elsif !st[-1][2]
      pulled_a = []
      pulled_b = []
      rem_a = total_a
      while pulled_a.empty? || (pulled_a.size < pulled_b.size && pulled_a.size < rem_a)
        u, v, is_a = pop_item.call
        if is_a
          pulled_a << [u, v]
        else
          pulled_b << [u, v]
        end
      end
      pulled_b.reverse_each { |u, v| push_item.call(u, v, false) }
      pulled_a.reverse_each { |u, v| push_item.call(u, v, true) }
    end
    pop_item.call
  else
    out << dsu.comps
  end
end

puts out.join("\\n")`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'Codeforces',
      title: 'String Set Queries — Bentley-Saxe Dynamic Aho-Corasick (CF 710F)',
      difficulty: '2400',
      url: 'https://codeforces.com/problemset/problem/710/F',
      patternNote: 'Maintain two Bentley-Saxe Aho-Corasick forests (Inserted and Deleted) of power-of-two bucket sizes and subtract their match counts.',
    },
    {
      platform: 'AtCoder',
      title: 'SWAG Sliding Window Non-Invertible Monoid Aggregation (ABC / AGC)',
      difficulty: '2500',
      url: 'https://atcoder.jp/contests',
      patternNote: 'Two-stack queue computes sliding-window products over GCD, affine functions, or matrices in O(1) amortized multiplications.',
    },
    {
      platform: 'Codeforces',
      title: 'Online Sliding-Window Connectivity & FIFO-on-LIFO Rollback DSU (CF 1423H / CF 1386C)',
      difficulty: '2900',
      url: 'https://codeforces.com/problemset',
      patternNote: 'Use Two-Tag (A/B) binary rebalancing on a LIFO Rollback DSU to support online FIFO queue pops in O(log Q) amortized time.',
    },
  ],
  interviewNotes: [
    'Modern LSM-Tree storage engines (RocksDB, LevelDB, Apache Cassandra) are the disk-backed realization of Bentley-Saxe binary grouping: writes land in Level 0 and compact into exponentially larger immutable SSTable levels.',
    'A Rollback DSU must use union-by-size WITHOUT path compression so each unite() mutates at most one parent pointer and one size entry, allowing strict O(1) worst-case rollback.',
    'In Tarjan’s potential method, telescoping sum_t (c_t + Phi(D_t) - Phi(D_{t-1})) = sum_t c_t + Phi(D_T) - Phi(D_0) bounds total real work whenever Phi(D_T) >= Phi(D_0) = 0.',
  ],
  projectBlueprint: {
    title: 'Streaming Non-Invertible Monoid Aggregator & LSM-Style Live Search Index',
    tagline: 'O(1) SWAG stream engine + Bentley-Saxe logarithmic Aho-Corasick & Rollback DSU visualizer',
    stackSummary: 'C++20 / TypeScript Generic SWAG Queue + Bentley-Saxe Binary Compaction Forest + Two-Tag Rollback DSU',
    asciiDiagram:
`[Live Stream] ---> [SWAG Front/Back Stacks (O(1) Monoid)]
              ---> [Bentley-Saxe 2^k Aho-Corasick Buckets (O(log N) Compaction)]
              ---> [Two-Tag A/B FIFO-on-LIFO Rollback DSU (O(log Q) Undo)]`,
    milestones: [
      { id: 'm1', title: 'Generic Non-Commutative SWAG Container', detail: 'Parameterize over 3x3 transition matrices, affine functions, and GCD with live potential Phi = |B| telemetry.' },
      { id: 'm2', title: 'Bentley-Saxe Binary Compaction Engine', detail: 'Animate power-of-two carry merges across static Aho-Corasick buckets B_0, B_1, ..., B_k.' },
      { id: 'm3', title: 'Two-Tag FIFO-on-LIFO Rollback DSU', detail: 'Visualize A/B tag suffix rebalancing on live sliding-window graph connectivity streams.' },
    ],
    starterCode: `// SWAG pop_front stack pour:
// if (front_st.empty()) while (!back_st.empty()) { ... }
// front_st.pop_back();`,
  },
};
