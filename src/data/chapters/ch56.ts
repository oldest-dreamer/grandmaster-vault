import type { TheoryChapter } from '../../types/vault';

export const CH56_ALIENS_WQS_BINARY_SEARCH: TheoryChapter = {
  slug: 'aliens-trick-wqs-binary-search',
  topicId: 'dp-26',
  title: 'Aliens Trick (WQS Binary Search / Lagrangian)',
  domain: 'Search, Greedy & DP',
  ratingTier: '2200–2600',
  usacoDivision: 'Platinum',
  subtitle:
    'Eliminate exact-K cardinality dimensions from convex/concave DP recurrences (`O(NK) -> O(N log V)`) using Lagrangian slope penalty `lambda` binary search and exact collinear convex-hull recovery.',
  analogyTitle: 'The Rubber-Band Tangent Line & Toll-Booth Penalty Analogy',
  analogyBody:
    'Suppose solving an optimization DP with NO limit on how many segments/edges/transactions you pick takes fast `O(N)` time, whereas tracking the exact count `k <= K` forces an `O(NK)` TLE loop. Whenever the optimal value curve `f(k)` is **concave** for maximization (diminishing marginal returns) or **convex** for minimization, charging a toll `lambda` for every unit chosen turns the constrained `K`-problem into an **unconstrained DP**: maximize `f(k) - lambda * k`! Increasing `lambda` tilts a tangent line across the convex hull of `(k, f(k))`, monotonically shrinking the optimal count `k*(lambda)`. Binary searching the largest `lambda` where max tie-broken count `k*(lambda) >= K` touches `(K, f(K))` directly—even across flat collinear plateaus—letting us recover exact `f(K) = dpVal(lambda) + K * lambda` in `O(N log V)`!',
  prerequisites: [
    {
      slug: 'divide-conquer-knuth-dp',
      title: 'Divide & Conquer DP and Knuth-Yao Optimization',
    },
    {
      slug: 'li-chao-tree-convex-hull-trick',
      title: 'Li Chao Tree & Dynamic Convex Hull Trick',
    },
  ],
  traceTitle: 'Interactive WQS Slope Binary Search & Collinear Recovery Trace',
  traceSubtitle:
    'Maximize profit on stock `[1, 5, 2, 8, 3, 9]` with `K = 2` (`f(0)=0, f(1)=8, f(2)=13, f(3)=16`). Watch binary search converge to `lambda = 5` and reconstruct `dp(5) + 2*5 = 13`.',
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Step 1: Verify Discrete Concavity of Profit Curve f(k)',
      explanation:
        'Unconstrained optimal profit for k=0,1,2,3 transactions is f(0)=0, f(1)=8 (1->9), f(2)=13 (1->8, 3->9), f(3)=16 (1->5, 2->8, 3->9). Marginal gains are +8, +5, +3 (monotonically non-increasing -> strictly concave)!',
      mode: 'array',
      arrays: [
        {
          name: 'Concave Curve f(k) & Marginal Slopes s(k) = f(k) - f(k-1)',
          cells: [
            { index: 0, value: 'f(0)=0', label: 'base', highlight: 'neutral' },
            { index: 1, value: 'f(1)=8', label: 'slope +8', highlight: 'window' },
            { index: 2, value: 'f(2)=13', label: 'slope +5 (Target K=2)', highlight: 'active' },
            { index: 3, value: 'f(3)=16', label: 'slope +3', highlight: 'window' },
          ],
        },
      ],
      variables: { TargetK: 2, TrueAnswer: 13, UnconstrainedCount: 3 },
    },
    {
      stepNumber: 2,
      title: 'Step 2: Binary Search Toll lambda While Breaking Ties by Max Count',
      explanation:
        'Test lambda = 3: f(2)-6 = 7 and f(3)-9 = 7 -> tie! Maximizing count gives cnt(3) = 3 >= 2 (lambda can go higher). Test lambda = 5: f(1)-5 = 3 and f(2)-10 = 3 -> tie! Max count gives cnt(5) = 2 >= 2. Test lambda = 6: f(1)-6 = 2 -> cnt(6) = 1 < 2!',
      mode: 'array',
      arrays: [
        {
          name: 'Lagrangian Max Profit & Tie-Broken Max Count vs lambda',
          cells: [
            { index: 0, value: 'lam=3 -> val=7, cnt=3', label: '>= K (up)', highlight: 'window' },
            { index: 1, value: 'lam=5 -> val=3, cnt=2', label: '>= K (BEST)', highlight: 'active' },
            { index: 2, value: 'lam=6 -> val=2, cnt=1', label: '< K (down)', highlight: 'neutral' },
          ],
        },
      ],
      variables: { BestLambda: 5, PenalizedValue: 3, TieBrokenMaxCnt: 2 },
    },
    {
      stepNumber: 3,
      title: 'Step 3: Recover Exact f(K) Without Collinear Drift (`dpVal + K * bestLambda`)',
      explanation:
        'Crucial rule: NEVER multiply by `cnt(bestLambda)` (which might exceed K on collinear plateaus)! Always compute `dpVal(bestLambda) + K * bestLambda = 3 + 2 * 5 = 13` because `K` lies on the exact same tangent line!',
      mode: 'array',
      arrays: [
        {
          name: 'Convex Hull Recovery Formula Verification',
          cells: [
            { index: 0, value: 'dp(lam=5) = 3', highlight: 'window' },
            { index: 1, value: 'K * lam = 2 * 5 = 10', highlight: 'window' },
            { index: 2, value: 'Sum = 13 = f(2)', highlight: 'active' },
          ],
        },
      ],
      variables: { RecoveredProfit: 13, Formula: 'dpVal + K * bestLambda', Complexity: 'O(N log V)' },
    },
  ],
  reductionClues: [
    {
      clue: '"Partition array / pick matching / do stock trades using AT MOST or EXACTLY K items, N <= 10^5, K <= N"',
      translation:
        '**Aliens Trick (WQS Binary Search)**: check if optimal cost/reward `f(k)` satisfies convexity/concavity (`f(k+1) - f(k)` monotonic). Drop the `K` DP state completely, charge penalty `lambda` per item, and binary search `lambda`!',
    },
    {
      clue: '"Binary search count jumps past K from k_1 < K directly to k_2 > K when slope changes by 1"',
      translation:
        '**Collinear Points on Convex Hull**: several `k` share identical marginal slope `lambda*`. Always break DP ties consistently (e.g., **maximize `cnt`** on equal penalized score), find the **largest `lambda` with `cnt >= K`**, and recover **`dpVal + K * lambda`**!',
    },
    {
      clue: '"How do I test if WQS / Aliens Trick is valid for an unfamiliar problem?"',
      translation:
        'Check either (1) **Monge / Quadrangle Inequality** on segment costs, (2) **Min-Cost Flow convexity** (matchings, disjoint paths, b-matchings), or (3) **Brute-force small N** in a local test to verify `f(k+1) - f(k)` monotonicity!',
    },
    {
      clue: '"Problem asks for AT MOST K (not EXACTLY K) segments/transactions"',
      translation:
        'Solve unconstrained first (`lambda = 0`): if unconstrained `cnt <= K`, return `dpVal(0)` directly! Otherwise the optimum lies on the decreasing slope side, where `best <= K` forces `exact K` via binary search on `lambda >= 0`!',
    },
  ],
  timeComplexity: 'O(T_DP(N) * log(MaxSlope)) — typically O(N log V)',
  spaceComplexity: 'O(N)',
  pitfalls: [
    {
      type: 'WA',
      title: 'Multiplying `bestLambda` by `cnt(bestLambda)` Instead of `K` During Reconstruction',
      detail:
        'When `k = 2, 3, 4` are collinear with slope `lambda*` and target is `K = 3`, max-count tie-breaking produces `cnt(lambda*) = 4`. Multiplying `4 * lambda*` adds an extra `lambda*`! You MUST ALWAYS reconstruct using the target **`K`**: **`dpVal + K * bestLambda`**!',
    },
    {
      type: 'WA',
      title: 'Inconsistent Tie-Breaking Inside DP State Comparisons',
      detail:
        'If your binary search predicate asks `cnt >= K`, every `max()` transition inside the DP MUST break ties toward **LARGER `cnt`** (`a.val != b.val ? a.val > b.val : a.cnt > b.cnt`). Mixing `<` and `>` tie-breaks causes `cnt(lambda)` to oscillate non-monotonically!',
    },
    {
      type: 'WA',
      title: 'Binary Search Range Too Narrow for Alternating-Path / Negative-Weight Slopes',
      detail:
        'On negative arrays or tree matchings (`N = 50,000, |w| <= 10^9`), adding 1 matching edge can flip an augmenting chain whose slope reaches `-10^{14}`! Use generous bounds like `[-10^{14}, +10^{14}]` (around `60` iterations) with 64-bit `long long` (`-4e18` INF sentinel).',
    },
    {
      type: 'WA',
      title: 'Midpoint Rounding Toward Zero vs Floor on Signed Integer Binary Search',
      detail:
        'In C++/Java/Rust, `(lo + hi) / 2` truncates toward zero when `lo + hi < 0`, creating an **infinite loop** when `hi == lo + 1` and `lo < 0`! ALWAYS write **`lo + (hi - lo + 1) / 2`** (using arithmetic division on non-negative `hi - lo`, or `(lo + hi + 1) >> 1` safely in 64-bit)!',
    },
  ],
  implementations: {
    cpp20: `#include <bits/stdc++.h>
using namespace std;

// Aliens Trick (WQS Binary Search) on K-Subarray Maximum Sum in O(N log V)
struct State {
    long long val;
    long long cnt;
    bool operator<(const State& o) const {
        if (val != o.val) return val < o.val;
        return cnt < o.cnt; // maximize cnt on exact score ties!
    }
};

State solveLagrange(const vector<long long>& a, long long lambda) {
    const long long NEG_INF = -4000000000000000000LL;
    State off = {0, 0};          // not currently inside any subarray
    State on = {NEG_INF, 0};     // ending at current element inside an active subarray
    for (long long x : a) {
        State bestPrev = max(off, on);
        State startNew = {bestPrev.val + x - lambda, bestPrev.cnt + 1};
        State extendOld = {on.val + x, on.cnt};
        on = max(startNew, extendOld);
        off = bestPrev;
    }
    return max(off, on);
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    long long k;
    if (!(cin >> n >> k)) return 0;
    vector<long long> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];

    // Binary search largest lambda where tie-broken max count >= k
    long long lo = -100000000000000LL;
    long long hi =  100000000000000LL;
    long long bestLambda = lo;
    State bestState = {0, 0};

    while (lo <= hi) {
        long long mid = lo + ((hi - lo) >> 1);
        State st = solveLagrange(a, mid);
        if (st.cnt >= k) {
            bestLambda = mid;
            bestState = st;
            lo = mid + 1;
        } else {
            hi = mid - 1;
        }
    }

    cout << (bestState.val + k * bestLambda) << "\\n";
    return 0;
}`,
    rust: `use std::io::{self, Read};

#[derive(Clone, Copy, PartialEq, Eq)]
struct State {
    val: i128,
    cnt: i64,
}

#[inline]
fn best(a: State, b: State) -> State {
    if a.val != b.val {
        if a.val > b.val { a } else { b }
    } else if a.cnt >= b.cnt {
        a
    } else {
        b
    }
}

fn solve_lagrange(a: &[i64], lambda: i128) -> State {
    const NEG_INF: i128 = -1_000_000_000_000_000_000_000_000_000_000;
    let mut off = State { val: 0, cnt: 0 };
    let mut on = State { val: NEG_INF, cnt: 0 };
    for &x in a {
        let prev = best(off, on);
        let start_new = State {
            val: prev.val + (x as i128) - lambda,
            cnt: prev.cnt + 1,
        };
        let extend_old = State {
            val: on.val + (x as i128),
            cnt: on.cnt,
        };
        on = best(start_new, extend_old);
        off = prev;
    }
    best(off, on)
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let n: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };
    let k: i64 = it.next().unwrap().parse().unwrap();
    let mut a = Vec::with_capacity(n);
    for _ in 0..n {
        a.push(it.next().unwrap().parse().unwrap());
    }

    let mut lo: i128 = -100_000_000_000_000;
    let mut hi: i128 = 100_000_000_000_000;
    let mut best_lam: i128 = lo;
    let mut best_st = State { val: 0, cnt: 0 };

    while lo <= hi {
        let mid = lo + ((hi - lo) >> 1);
        let st = solve_lagrange(&a, mid);
        if st.cnt >= k {
            best_lam = mid;
            best_st = st;
            lo = mid + 1;
        } else {
            hi = mid - 1;
        }
    }

    println!("{}", best_st.val + (k as i128) * best_lam);
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

    static long[] a;
    static long resVal, resCnt;

    static void solveLagrange(long lambda) {
        final long NEG_INF = -4_000_000_000_000_000_000L;
        long offV = 0, offC = 0;
        long onV = NEG_INF, onC = 0;

        for (long x : a) {
            boolean pickOnPrev = (onV > offV) || (onV == offV && onC > offC);
            long prevV = pickOnPrev ? onV : offV;
            long prevC = pickOnPrev ? onC : offC;

            long startV = prevV + x - lambda;
            long startC = prevC + 1;
            long extV = onV + x;
            long extC = onC;

            if (startV > extV || (startV == extV && startC >= extC)) {
                onV = startV; onC = startC;
            } else {
                onV = extV; onC = extC;
            }
            offV = prevV; offC = prevC;
        }
        if (onV > offV || (onV == offV && onC > offC)) {
            resVal = onV; resCnt = onC;
        } else {
            resVal = offV; resCnt = offC;
        }
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        long nLong = fs.nextLong();
        if (nLong == Long.MIN_VALUE) return;
        int n = (int) nLong;
        long k = fs.nextLong();

        a = new long[n];
        for (int i = 0; i < n; i++) a[i] = fs.nextLong();

        long lo = -100_000_000_000_000L;
        long hi =  100_000_000_000_000L;
        long bestLam = lo, bestVal = 0;

        while (lo <= hi) {
            long mid = lo + ((hi - lo) >> 1);
            solveLagrange(mid);
            if (resCnt >= k) {
                bestLam = mid;
                bestVal = resVal;
                lo = mid + 1;
            } else {
                hi = mid - 1;
            }
        }
        System.out.println(bestVal + k * bestLam);
    }
}`,
    python3: `import sys

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    k = int(data[1])
    a = [int(data[2 + i]) for i in range(n)]
    NEG_INF = -10**30

    def lagrange(lam: int) -> tuple:
        off_v, off_c = 0, 0
        on_v, on_c = NEG_INF, 0
        for x in a:
            if on_v > off_v or (on_v == off_v and on_c > off_c):
                pv, pc = on_v, on_c
            else:
                pv, pc = off_v, off_c
            sv, sc = pv + x - lam, pc + 1
            ev, ec = on_v + x, on_c
            if sv > ev or (sv == ev and sc >= ec):
                on_v, on_c = sv, sc
            else:
                on_v, on_c = ev, ec
            off_v, off_c = pv, pc
        if on_v > off_v or (on_v == off_v and on_c > off_c):
            return on_v, on_c
        return off_v, off_c

    lo, hi = -10**14, 10**14
    best_lam, best_val = lo, 0
    while lo <= hi:
        mid = (lo + hi) >> 1
        val, cnt = lagrange(mid)
        if cnt >= k:
            best_lam = mid
            best_val = val
            lo = mid + 1
        else:
            hi = mid - 1

    sys.stdout.write(f"{best_val + k * best_lam}\\n")

if __name__ == "__main__":
    solve()`,
    ruby: `tokens = $stdin.read.split
exit if tokens.empty?
n = tokens[0].to_i
k = tokens[1].to_i
a = Array.new(n) { |i| tokens[2 + i].to_i }
NEG_INF = -10**30

lagrange = lambda do |lam|
  off_v = 0; off_c = 0
  on_v = NEG_INF; on_c = 0
  a.each do |x|
    if on_v > off_v || (on_v == off_v && on_c > off_c)
      pv = on_v; pc = on_c
    else
      pv = off_v; pc = off_c
    end
    sv = pv + x - lam; sc = pc + 1
    ev = on_v + x; ec = on_c
    if sv > ev || (sv == ev && sc >= ec)
      on_v = sv; on_c = sc
    else
      on_v = ev; on_c = ec
    end
    off_v = pv; off_c = pc
  end
  (on_v > off_v || (on_v == off_v && on_c > off_c)) ? [on_v, on_c] : [off_v, off_c]
end

lo = -10**14; hi = 10**14
best_lam = lo; best_val = 0
while lo <= hi
  mid = (lo + hi) >> 1
  val, cnt = lagrange.call(mid)
  if cnt >= k
    best_lam = mid
    best_val = val
    lo = mid + 1
  else
    hi = mid - 1
  end
end
puts best_val + k * best_lam`,
  },
  practiceProblems: [
    {
      id: 'ch56-p1',
      tier: 'Warmup',
      ratingRange: '2000–2200',
      title: 'Best Time to Buy and Sell Stock with at Most K Transactions (WQS)',
      statement:
        'Given `K` (`1 <= K <= 10^5`) and an array of `N` stock prices (`1 <= N <= 2 * 10^5`, `0 <= p_i <= 10^9`), compute the maximum total profit achievable using at most `K` complete buy-then-sell transactions (holding at most 1 share at a time). Solve in `O(N log V)` even when `N` and `K` are `2 * 10^5`.',
      constraints: '1 <= N <= 2 * 10^5, 1 <= K <= 10^5, 0 <= p_i <= 10^9',
      sampleInput: `2 6
1 5 2 8 3 9`,
      sampleOutput: `13`,
      hints: [
        'Each completed transaction (`sell`) incurs toll `lambda >= 0`, maximizing `(profit - lambda * cnt)` via 2 states: `cash` (not holding) and `hold` (holding 1 share).',
        'First check `lambda = 0`: if unconstrained transaction count `<= K`, return `cash.val` immediately.',
        'Otherwise binary search the largest integer `lambda in [0, 10^9]` with `cnt >= K` (breaking ties by larger count) and output `bestVal + K * bestLambda`.',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

struct State {
    long long val, cnt;
    bool operator<(const State& o) const {
        return val != o.val ? val < o.val : cnt < o.cnt;
    }
};

State runDP(const vector<long long>& p, long long lam) {
    State cash = {0, 0};
    State hold = {-4000000000000000000LL, 0};
    for (long long price : p) {
        State newCash = max(cash, {hold.val + price - lam, hold.cnt + 1});
        State newHold = max(hold, {cash.val - price, cash.cnt});
        cash = newCash;
        hold = newHold;
    }
    return cash;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    long long k;
    int n;
    if (!(cin >> k >> n)) return 0;
    vector<long long> p(n);
    long long mx = 0;
    for (int i = 0; i < n; i++) {
        cin >> p[i];
        mx = max(mx, p[i]);
    }

    State zero = runDP(p, 0);
    if (zero.cnt <= k) {
        cout << zero.val << "\\n";
        return 0;
    }

    long long lo = 0, hi = mx, bestLam = 0, bestVal = zero.val;
    while (lo <= hi) {
        long long mid = lo + ((hi - lo) >> 1);
        State st = runDP(p, mid);
        if (st.cnt >= k) {
            bestLam = mid;
            bestVal = st.val;
            lo = mid + 1;
        } else {
            hi = mid - 1;
        }
    }
    cout << (bestVal + k * bestLam) << "\\n";
    return 0;
}`,
        rust: `use std::io::{self, Read};

#[derive(Clone, Copy)]
struct State {
    val: i128,
    cnt: i64,
}

#[inline]
fn best(a: State, b: State) -> State {
    if a.val != b.val {
        if a.val > b.val { a } else { b }
    } else if a.cnt >= b.cnt {
        a
    } else {
        b
    }
}

fn run_dp(prices: &[i64], lam: i128) -> State {
    const NEG_INF: i128 = -1_000_000_000_000_000_000_000_000;
    let mut cash = State { val: 0, cnt: 0 };
    let mut hold = State { val: NEG_INF, cnt: 0 };
    for &p in prices {
        let p128 = p as i128;
        let n_cash = best(cash, State { val: hold.val + p128 - lam, cnt: hold.cnt + 1 });
        let n_hold = best(hold, State { val: cash.val - p128, cnt: cash.cnt });
        cash = n_cash;
        hold = n_hold;
    }
    cash
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let k: i64 = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };
    let n: usize = it.next().unwrap().parse().unwrap();
    let mut p = Vec::with_capacity(n);
    let mut mx: i128 = 0;
    for _ in 0..n {
        let v: i64 = it.next().unwrap().parse().unwrap();
        mx = mx.max(v as i128);
        p.push(v);
    }

    let zero = run_dp(&p, 0);
    if zero.cnt <= k {
        println!("{}", zero.val);
        return;
    }

    let (mut lo, mut hi) = (0i128, mx);
    let (mut best_lam, mut best_val) = (0i128, zero.val);
    while lo <= hi {
        let mid = lo + ((hi - lo) >> 1);
        let st = run_dp(&p, mid);
        if st.cnt >= k {
            best_lam = mid;
            best_val = st.val;
            lo = mid + 1;
        } else {
            hi = mid - 1;
        }
    }
    println!("{}", best_val + (k as i128) * best_lam);
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

    static long[] p;
    static long resVal, resCnt;

    static void runDP(long lam) {
        long cashV = 0, cashC = 0;
        long holdV = -4_000_000_000_000_000_000L, holdC = 0;
        for (long price : p) {
            long sellV = holdV + price - lam, sellC = holdC + 1;
            long nCashV = cashV, nCashC = cashC;
            if (sellV > cashV || (sellV == cashV && sellC > cashC)) {
                nCashV = sellV; nCashC = sellC;
            }
            long buyV = cashV - price, buyC = cashC;
            long nHoldV = holdV, nHoldC = holdC;
            if (buyV > holdV || (buyV == holdV && buyC > holdC)) {
                nHoldV = buyV; nHoldC = buyC;
            }
            cashV = nCashV; cashC = nCashC;
            holdV = nHoldV; holdC = nHoldC;
        }
        resVal = cashV; resCnt = cashC;
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        long k = fs.nextLong();
        if (k == Long.MIN_VALUE) return;
        int n = (int) fs.nextLong();
        p = new long[n];
        long mx = 0;
        for (int i = 0; i < n; i++) {
            p[i] = fs.nextLong();
            if (p[i] > mx) mx = p[i];
        }

        runDP(0);
        if (resCnt <= k) {
            System.out.println(resVal);
            return;
        }

        long lo = 0, hi = mx, bestLam = 0, bestVal = resVal;
        while (lo <= hi) {
            long mid = lo + ((hi - lo) >> 1);
            runDP(mid);
            if (resCnt >= k) {
                bestLam = mid;
                bestVal = resVal;
                lo = mid + 1;
            } else {
                hi = mid - 1;
            }
        }
        System.out.println(bestVal + k * bestLam);
    }
}`,
        python3: `import sys

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    k = int(data[0])
    n = int(data[1])
    prices = [int(data[2 + i]) for i in range(n)]
    NEG_INF = -10**30

    def run_dp(lam: int) -> tuple:
        cash_v, cash_c = 0, 0
        hold_v, hold_c = NEG_INF, 0
        for price in prices:
            sv, sc = hold_v + price - lam, hold_c + 1
            if sv > cash_v or (sv == cash_v and sc > cash_c):
                ncv, ncc = sv, sc
            else:
                ncv, ncc = cash_v, cash_c
            bv, bc = cash_v - price, cash_c
            if bv > hold_v or (bv == hold_v and bc > hold_c):
                nhv, nhc = bv, bc
            else:
                nhv, nhc = hold_v, hold_c
            cash_v, cash_c = ncv, ncc
            hold_v, hold_c = nhv, nhc
        return cash_v, cash_c

    zv, zc = run_dp(0)
    if zc <= k:
        sys.stdout.write(f"{zv}\\n")
        return

    lo, hi = 0, max(prices) if prices else 0
    best_lam, best_val = 0, zv
    while lo <= hi:
        mid = (lo + hi) >> 1
        val, cnt = run_dp(mid)
        if cnt >= k:
            best_lam = mid
            best_val = val
            lo = mid + 1
        else:
            hi = mid - 1
    sys.stdout.write(f"{best_val + k * best_lam}\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
k = tokens[0].to_i
n = tokens[1].to_i
prices = Array.new(n) { |i| tokens[2 + i].to_i }
NEG_INF = -10**30

run_dp = lambda do |lam|
  cash_v = 0; cash_c = 0
  hold_v = NEG_INF; hold_c = 0
  prices.each do |price|
    sv = hold_v + price - lam; sc = hold_c + 1
    if sv > cash_v || (sv == cash_v && sc > cash_c)
      ncv = sv; ncc = sc
    else
      ncv = cash_v; ncc = cash_c
    end
    bv = cash_v - price; bc = cash_c
    if bv > hold_v || (bv == hold_v && bc > hold_c)
      nhv = bv; nhc = bc
    else
      nhv = hold_v; nhc = hold_c
    end
    cash_v = ncv; cash_c = ncc
    hold_v = nhv; hold_c = nhc
  end
  [cash_v, cash_c]
end

zv, zc = run_dp.call(0)
if zc <= k
  puts zv
  exit
end

lo = 0; hi = prices.max || 0
best_lam = 0; best_val = zv
while lo <= hi
  mid = (lo + hi) >> 1
  val, cnt = run_dp.call(mid)
  if cnt >= k
    best_lam = mid
    best_val = val
    lo = mid + 1
  else
    hi = mid - 1
  end
end
puts best_val + k * best_lam`,
      },
    },
    {
      id: 'ch56-p2',
      tier: 'Standard',
      ratingRange: '2200–2400',
      title: 'Maximum Sum of Exactly K Disjoint Subarrays',
      statement:
        'Given an array of N signed integers (`1 <= N <= 2 * 10^5`, `-10^9 <= a_i <= 10^9`) and an integer K (`1 <= K <= N`), select **exactly K** pairwise disjoint, non-empty contiguous subarrays maximizing their total sum.',
      constraints: '1 <= K <= N <= 2 * 10^5, -10^9 <= a_i <= 10^9',
      sampleInput: `5 2
2 -5 4 -1 3`,
      sampleOutput: `8`,
      hints: [
        'Let `f(k)` be the maximum sum of `k` disjoint subarrays; because merging or dropping worst blocks shrinks marginal gain, `f(k)` is strictly concave for `1 <= k <= N`!',
        'Since `K` may exceed the number of positive blocks, allow negative `lambda` in `[-10^{14}, 10^{14}]` so negative subarrays are forced when necessary.',
        'At each step, `on = max(extendOld, startNewFromBestPrev - lambda)` with ties broken by larger segment count `cnt`.',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

struct State {
    long long val, cnt;
    bool operator<(const State& o) const {
        return val != o.val ? val < o.val : cnt < o.cnt;
    }
};

State runLagrange(const vector<long long>& a, long long lam) {
    State off = {0, 0};
    State on = {-4000000000000000000LL, 0};
    for (long long x : a) {
        State prev = max(off, on);
        on = max(State{prev.val + x - lam, prev.cnt + 1}, State{on.val + x, on.cnt});
        off = prev;
    }
    return max(off, on);
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    long long k;
    if (!(cin >> n >> k)) return 0;
    vector<long long> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];

    long long lo = -100000000000000LL, hi = 100000000000000LL;
    long long bestLam = lo, bestVal = 0;
    while (lo <= hi) {
        long long mid = lo + ((hi - lo) >> 1);
        State st = runLagrange(a, mid);
        if (st.cnt >= k) {
            bestLam = mid;
            bestVal = st.val;
            lo = mid + 1;
        } else {
            hi = mid - 1;
        }
    }
    cout << (bestVal + k * bestLam) << "\\n";
    return 0;
}`,
        rust: `use std::io::{self, Read};

#[derive(Clone, Copy)]
struct State {
    val: i128,
    cnt: i64,
}

#[inline]
fn best(a: State, b: State) -> State {
    if a.val != b.val {
        if a.val > b.val { a } else { b }
    } else if a.cnt >= b.cnt {
        a
    } else {
        b
    }
}

fn run_lagrange(a: &[i64], lam: i128) -> State {
    let mut off = State { val: 0, cnt: 0 };
    let mut on = State { val: -1_000_000_000_000_000_000_000_000, cnt: 0 };
    for &x in a {
        let prev = best(off, on);
        let start = State { val: prev.val + (x as i128) - lam, cnt: prev.cnt + 1 };
        let ext = State { val: on.val + (x as i128), cnt: on.cnt };
        on = best(start, ext);
        off = prev;
    }
    best(off, on)
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let n: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };
    let k: i64 = it.next().unwrap().parse().unwrap();
    let mut a = Vec::with_capacity(n);
    for _ in 0..n { a.push(it.next().unwrap().parse().unwrap()); }

    let (mut lo, mut hi) = (-100_000_000_000_000i128, 100_000_000_000_000i128);
    let (mut best_lam, mut best_val) = (lo, 0i128);
    while lo <= hi {
        let mid = lo + ((hi - lo) >> 1);
        let st = run_lagrange(&a, mid);
        if st.cnt >= k {
            best_lam = mid;
            best_val = st.val;
            lo = mid + 1;
        } else {
            hi = mid - 1;
        }
    }
    println!("{}", best_val + (k as i128) * best_lam);
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

    static long[] a;
    static long resVal, resCnt;

    static void runLagrange(long lam) {
        long offV = 0, offC = 0;
        long onV = -4_000_000_000_000_000_000L, onC = 0;
        for (long x : a) {
            boolean useOn = (onV > offV) || (onV == offV && onC > offC);
            long prevV = useOn ? onV : offV;
            long prevC = useOn ? onC : offC;
            long sv = prevV + x - lam, sc = prevC + 1;
            long ev = onV + x, ec = onC;
            if (sv > ev || (sv == ev && sc >= ec)) {
                onV = sv; onC = sc;
            } else {
                onV = ev; onC = ec;
            }
            offV = prevV; offC = prevC;
        }
        if (onV > offV || (onV == offV && onC > offC)) {
            resVal = onV; resCnt = onC;
        } else {
            resVal = offV; resCnt = offC;
        }
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        long nLong = fs.nextLong();
        if (nLong == Long.MIN_VALUE) return;
        int n = (int) nLong;
        long k = fs.nextLong();
        a = new long[n];
        for (int i = 0; i < n; i++) a[i] = fs.nextLong();

        long lo = -100_000_000_000_000L, hi = 100_000_000_000_000L;
        long bestLam = lo, bestVal = 0;
        while (lo <= hi) {
            long mid = lo + ((hi - lo) >> 1);
            runLagrange(mid);
            if (resCnt >= k) {
                bestLam = mid;
                bestVal = resVal;
                lo = mid + 1;
            } else {
                hi = mid - 1;
            }
        }
        System.out.println(bestVal + k * bestLam);
    }
}`,
        python3: `import sys

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    k = int(data[1])
    a = [int(data[2 + i]) for i in range(n)]
    NEG_INF = -10**30

    def lagrange(lam: int) -> tuple:
        off_v, off_c = 0, 0
        on_v, on_c = NEG_INF, 0
        for x in a:
            if on_v > off_v or (on_v == off_v and on_c > off_c):
                pv, pc = on_v, on_c
            else:
                pv, pc = off_v, off_c
            sv, sc = pv + x - lam, pc + 1
            ev, ec = on_v + x, on_c
            if sv > ev or (sv == ev and sc >= ec):
                on_v, on_c = sv, sc
            else:
                on_v, on_c = ev, ec
            off_v, off_c = pv, pc
        return (on_v, on_c) if (on_v > off_v or (on_v == off_v and on_c > off_c)) else (off_v, off_c)

    lo, hi = -10**14, 10**14
    best_lam, best_val = lo, 0
    while lo <= hi:
        mid = (lo + hi) >> 1
        val, cnt = lagrange(mid)
        if cnt >= k:
            best_lam = mid
            best_val = val
            lo = mid + 1
        else:
            hi = mid - 1
    sys.stdout.write(f"{best_val + k * best_lam}\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
n = tokens[0].to_i
k = tokens[1].to_i
a = Array.new(n) { |i| tokens[2 + i].to_i }
NEG_INF = -10**30

lagrange = lambda do |lam|
  off_v = 0; off_c = 0; on_v = NEG_INF; on_c = 0
  a.each do |x|
    if on_v > off_v || (on_v == off_v && on_c > off_c)
      pv = on_v; pc = on_c
    else
      pv = off_v; pc = off_c
    end
    sv = pv + x - lam; sc = pc + 1
    ev = on_v + x; ec = on_c
    if sv > ev || (sv == ev && sc >= ec)
      on_v = sv; on_c = sc
    else
      on_v = ev; on_c = ec
    end
    off_v = pv; off_c = pc
  end
  (on_v > off_v || (on_v == off_v && on_c > off_c)) ? [on_v, on_c] : [off_v, off_c]
end

lo = -10**14; hi = 10**14
best_lam = lo; best_val = 0
while lo <= hi
  mid = (lo + hi) >> 1
  val, cnt = lagrange.call(mid)
  if cnt >= k
    best_lam = mid; best_val = val; lo = mid + 1
  else
    hi = mid - 1
  end
end
puts best_val + k * best_lam`,
      },
    },
    {
      id: 'ch56-p3',
      tier: 'Boss',
      ratingRange: '2400–2600',
      title: 'Maximum-Weight Matching of Exact Size K on a Tree',
      statement:
        'Given a weighted tree on `N` vertices (`2 <= N <= 5 * 10^4`, edge weights `-10^9 <= w <= 10^9`) and an integer `K` (`1 <= K <= N / 2`), choose **exactly K** pairwise vertex-disjoint edges maximizing the sum of their weights. Print `Impossible` if the tree has no matching of size `K`.',
      constraints: '2 <= N <= 5 * 10^4, 1 <= K <= N / 2, -10^9 <= w <= 10^9',
      sampleInput: `5 2
1 2 10
2 3 5
2 4 8
4 5 7`,
      sampleOutput: `17`,
      hints: [
        'Maximum-weight matching size-k curves on arbitrary trees are concave by augmenting-path flow duality!',
        'Build an iterative BFS topological order from root 1 and evaluate tree DP bottom-up: `dp0[u]` (`u` unmatched to any child) vs `dp1[u]` (`u` matched to one child), deducting penalty `lambda` on every matched edge `(u, v)`.',
        'Check feasibility first with `lambda = -10^{14}`: if maximum matching cardinality `< K`, print `Impossible`. Otherwise binary search largest `lambda in [-10^{14}, 10^{14}]` where `cnt >= K`.',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

struct State {
    long long val, cnt;
    bool operator<(const State& o) const {
        return val != o.val ? val < o.val : cnt < o.cnt;
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    long long k;
    if (!(cin >> n >> k)) return 0;

    vector<vector<pair<int, long long>>> adj(n + 1);
    for (int i = 0; i < n - 1; i++) {
        int u, v;
        long long w;
        cin >> u >> v >> w;
        adj[u].push_back({v, w});
        adj[v].push_back({u, w});
    }

    vector<int> parent(n + 1, 0), order;
    vector<long long> parentW(n + 1, 0);
    order.reserve(n);
    queue<int> q;
    q.push(1);
    parent[1] = -1;
    while (!q.empty()) {
        int u = q.front();
        q.pop();
        order.push_back(u);
        for (auto [v, w] : adj[u]) {
            if (parent[v] == 0) {
                parent[v] = u;
                parentW[v] = w;
                q.push(v);
            }
        }
    }

    const long long NEG_INF = -4000000000000000000LL;
    auto runTreeDP = [&](long long lam) -> State {
        vector<State> dp0(n + 1, {0, 0}), dp1(n + 1, {NEG_INF, 0});
        for (int idx = n - 1; idx >= 1; idx--) {
            int v = order[idx];
            int u = parent[v];
            long long w = parentW[v];
            State bestV = max(dp0[v], dp1[v]);

            State cand1A = {dp1[u].val + bestV.val, dp1[u].cnt + bestV.cnt};
            State cand1B = {dp0[u].val + dp0[v].val + w - lam, dp0[u].cnt + dp0[v].cnt + 1};
            dp1[u] = max(cand1A, cand1B);
            dp0[u] = {dp0[u].val + bestV.val, dp0[u].cnt + bestV.cnt};
        }
        return max(dp0[1], dp1[1]);
    };

    long long lo = -100000000000000LL, hi = 100000000000000LL;
    if (runTreeDP(lo).cnt < k) {
        cout << "Impossible\\n";
        return 0;
    }

    long long bestLam = lo, bestVal = 0;
    while (lo <= hi) {
        long long mid = lo + ((hi - lo) >> 1);
        State st = runTreeDP(mid);
        if (st.cnt >= k) {
            bestLam = mid;
            bestVal = st.val;
            lo = mid + 1;
        } else {
            hi = mid - 1;
        }
    }
    cout << (bestVal + k * bestLam) << "\\n";
    return 0;
}`,
        rust: `use std::collections::VecDeque;
use std::io::{self, Read};

#[derive(Clone, Copy)]
struct State {
    val: i128,
    cnt: i64,
}

#[inline]
fn best(a: State, b: State) -> State {
    if a.val != b.val {
        if a.val > b.val { a } else { b }
    } else if a.cnt >= b.cnt {
        a
    } else {
        b
    }
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let n: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };
    let k: i64 = it.next().unwrap().parse().unwrap();

    let mut adj = vec![Vec::new(); n + 1];
    for _ in 0..(n - 1) {
        let u: usize = it.next().unwrap().parse().unwrap();
        let v: usize = it.next().unwrap().parse().unwrap();
        let w: i64 = it.next().unwrap().parse().unwrap();
        adj[u].push((v, w));
        adj[v].push((u, w));
    }

    let mut parent = vec![0usize; n + 1];
    let mut pw = vec![0i128; n + 1];
    let mut order = Vec::with_capacity(n);
    let mut q = VecDeque::new();
    parent[1] = n + 1;
    q.push_back(1);
    while let Some(u) = q.pop_front() {
        order.push(u);
        for &(v, w) in &adj[u] {
            if parent[v] == 0 {
                parent[v] = u;
                pw[v] = w as i128;
                q.push_back(v);
            }
        }
    }

    const NEG_INF: i128 = -1_000_000_000_000_000_000_000_000_000;
    let run_tree_dp = |lam: i128| -> State {
        let mut dp0 = vec![State { val: 0, cnt: 0 }; n + 1];
        let mut dp1 = vec![State { val: NEG_INF, cnt: 0 }; n + 1];
        for &v in order[1..].iter().rev() {
            let u = parent[v];
            let best_v = best(dp0[v], dp1[v]);
            let c1 = State { val: dp1[u].val + best_v.val, cnt: dp1[u].cnt + best_v.cnt };
            let c2 = State { val: dp0[u].val + dp0[v].val + pw[v] - lam, cnt: dp0[u].cnt + dp0[v].cnt + 1 };
            dp1[u] = best(c1, c2);
            dp0[u] = State { val: dp0[u].val + best_v.val, cnt: dp0[u].cnt + best_v.cnt };
        }
        best(dp0[1], dp1[1])
    };

    let (mut lo, mut hi) = (-100_000_000_000_000i128, 100_000_000_000_000i128);
    if run_tree_dp(lo).cnt < k {
        println!("Impossible");
        return;
    }

    let (mut best_lam, mut best_val) = (lo, 0i128);
    while lo <= hi {
        let mid = lo + ((hi - lo) >> 1);
        let st = run_tree_dp(mid);
        if st.cnt >= k {
            best_lam = mid;
            best_val = st.val;
            lo = mid + 1;
        } else {
            hi = mid - 1;
        }
    }
    println!("{}", best_val + (k as i128) * best_lam);
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

    static int n;
    static int[] head, to, nxt, parent, order;
    static long[] edgeW, parentW, dp0V, dp0C, dp1V, dp1C;
    static final long NEG_INF = -4_000_000_000_000_000_000L;

    static void runTreeDP(long lam) {
        Arrays.fill(dp0V, 0); Arrays.fill(dp0C, 0);
        Arrays.fill(dp1V, NEG_INF); Arrays.fill(dp1C, 0);

        for (int idx = n - 1; idx >= 1; idx--) {
            int v = order[idx];
            int u = parent[v];
            boolean useV1 = dp1V[v] > dp0V[v] || (dp1V[v] == dp0V[v] && dp1C[v] > dp0C[v]);
            long bvV = useV1 ? dp1V[v] : dp0V[v];
            long bvC = useV1 ? dp1C[v] : dp0C[v];

            long c1V = dp1V[u] + bvV, c1C = dp1C[u] + bvC;
            long c2V = dp0V[u] + dp0V[v] + parentW[v] - lam, c2C = dp0C[u] + dp0C[v] + 1;
            if (c2V > c1V || (c2V == c1V && c2C > c1C)) {
                dp1V[u] = c2V; dp1C[u] = c2C;
            } else {
                dp1V[u] = c1V; dp1C[u] = c1C;
            }
            dp0V[u] += bvV;
            dp0C[u] += bvC;
        }
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        long nLong = fs.nextLong();
        if (nLong == Long.MIN_VALUE) return;
        n = (int) nLong;
        long k = fs.nextLong();

        head = new int[n + 1];
        Arrays.fill(head, -1);
        to = new int[2 * n];
        nxt = new int[2 * n];
        edgeW = new long[2 * n];
        int ec = 0;
        for (int i = 0; i < n - 1; i++) {
            int u = (int) fs.nextLong(), v = (int) fs.nextLong();
            long w = fs.nextLong();
            to[ec] = v; edgeW[ec] = w; nxt[ec] = head[u]; head[u] = ec++;
            to[ec] = u; edgeW[ec] = w; nxt[ec] = head[v]; head[v] = ec++;
        }

        parent = new int[n + 1];
        parentW = new long[n + 1];
        order = new int[n];
        int qh = 0, qt = 0;
        order[qt++] = 1;
        parent[1] = -1;
        while (qh < qt) {
            int u = order[qh++];
            for (int e = head[u]; e != -1; e = nxt[e]) {
                int v = to[e];
                if (parent[v] == 0) {
                    parent[v] = u;
                    parentW[v] = edgeW[e];
                    order[qt++] = v;
                }
            }
        }

        dp0V = new long[n + 1]; dp0C = new long[n + 1];
        dp1V = new long[n + 1]; dp1C = new long[n + 1];

        long lo = -100_000_000_000_000L, hi = 100_000_000_000_000L;
        runTreeDP(lo);
        long maxCnt = (dp1V[1] > dp0V[1] || (dp1V[1] == dp0V[1] && dp1C[1] > dp0C[1])) ? dp1C[1] : dp0C[1];
        if (maxCnt < k) {
            System.out.println("Impossible");
            return;
        }

        long bestLam = lo, bestVal = 0;
        while (lo <= hi) {
            long mid = lo + ((hi - lo) >> 1);
            runTreeDP(mid);
            boolean use1 = dp1V[1] > dp0V[1] || (dp1V[1] == dp0V[1] && dp1C[1] > dp0C[1]);
            long val = use1 ? dp1V[1] : dp0V[1];
            long cnt = use1 ? dp1C[1] : dp0C[1];
            if (cnt >= k) {
                bestLam = mid; bestVal = val; lo = mid + 1;
            } else {
                hi = mid - 1;
            }
        }
        System.out.println(bestVal + k * bestLam);
    }
}`,
        python3: `import sys
from collections import deque

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    k = int(data[1])
    adj = [[] for _ in range(n + 1)]
    idx = 2
    for _ in range(n - 1):
        u = int(data[idx]); v = int(data[idx + 1]); w = int(data[idx + 2])
        idx += 3
        adj[u].append((v, w))
        adj[v].append((u, w))

    parent = [0] * (n + 1)
    pw = [0] * (n + 1)
    order = []
    q = deque([1])
    parent[1] = -1
    while q:
        u = q.popleft()
        order.append(u)
        for v, w in adj[u]:
            if parent[v] == 0:
                parent[v] = u
                pw[v] = w
                q.append(v)

    NEG_INF = -10**30
    def run_tree_dp(lam: int) -> tuple:
        dp0_v = [0] * (n + 1)
        dp0_c = [0] * (n + 1)
        dp1_v = [NEG_INF] * (n + 1)
        dp1_c = [0] * (n + 1)
        for v in reversed(order[1:]):
            u = parent[v]
            if dp1_v[v] > dp0_v[v] or (dp1_v[v] == dp0_v[v] and dp1_c[v] > dp0_c[v]):
                bv, bc = dp1_v[v], dp1_c[v]
            else:
                bv, bc = dp0_v[v], dp0_c[v]
            c1v, c1c = dp1_v[u] + bv, dp1_c[u] + bc
            c2v, c2c = dp0_v[u] + dp0_v[v] + pw[v] - lam, dp0_c[u] + dp0_c[v] + 1
            if c2v > c1v or (c2v == c1v and c2c > c1c):
                dp1_v[u], dp1_c[u] = c2v, c2c
            else:
                dp1_v[u], dp1_c[u] = c1v, c1c
            dp0_v[u] += bv
            dp0_c[u] += bc
        return (dp1_v[1], dp1_c[1]) if (dp1_v[1] > dp0_v[1] or (dp1_v[1] == dp0_v[1] and dp1_c[1] > dp0_c[1])) else (dp0_v[1], dp0_c[1])

    lo, hi = -10**14, 10**14
    if run_tree_dp(lo)[1] < k:
        sys.stdout.write("Impossible\\n")
        return

    best_lam, best_val = lo, 0
    while lo <= hi:
        mid = (lo + hi) >> 1
        val, cnt = run_tree_dp(mid)
        if cnt >= k:
            best_lam = mid
            best_val = val
            lo = mid + 1
        else:
            hi = mid - 1
    sys.stdout.write(f"{best_val + k * best_lam}\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
n = tokens[0].to_i
k = tokens[1].to_i

adj = Array.new(n + 1) { [] }
idx = 2
(n - 1).times do
  u = tokens[idx].to_i; v = tokens[idx + 1].to_i; w = tokens[idx + 2].to_i
  idx += 3
  adj[u] << [v, w]
  adj[v] << [u, w]
end

parent = Array.new(n + 1, 0)
pw = Array.new(n + 1, 0)
order = [1]
parent[1] = -1
head = 0
while head < order.length
  u = order[head]; head += 1
  adj[u].each do |v, w|
    if parent[v] == 0
      parent[v] = u; pw[v] = w; order << v
    end
  end
end

NEG_INF = -10**30
run_tree_dp = lambda do |lam|
  dp0_v = Array.new(n + 1, 0); dp0_c = Array.new(n + 1, 0)
  dp1_v = Array.new(n + 1, NEG_INF); dp1_c = Array.new(n + 1, 0)
  (n - 1).downto(1) do |i|
    v = order[i]; u = parent[v]
    if dp1_v[v] > dp0_v[v] || (dp1_v[v] == dp0_v[v] && dp1_c[v] > dp0_c[v])
      bv = dp1_v[v]; bc = dp1_c[v]
    else
      bv = dp0_v[v]; bc = dp0_c[v]
    end
    c1v = dp1_v[u] + bv; c1c = dp1_c[u] + bc
    c2v = dp0_v[u] + dp0_v[v] + pw[v] - lam; c2c = dp0_c[u] + dp0_c[v] + 1
    if c2v > c1v || (c2v == c1v && c2c > c1c)
      dp1_v[u] = c2v; dp1_c[u] = c2c
    else
      dp1_v[u] = c1v; dp1_c[u] = c1c
    end
    dp0_v[u] += bv; dp0_c[u] += bc
  end
  (dp1_v[1] > dp0_v[1] || (dp1_v[1] == dp0_v[1] && dp1_c[1] > dp0_c[1])) ? [dp1_v[1], dp1_c[1]] : [dp0_v[1], dp0_c[1]]
end

lo = -10**14; hi = 10**14
if run_tree_dp.call(lo)[1] < k
  puts "Impossible"
  exit
end

best_lam = lo; best_val = 0
while lo <= hi
  mid = (lo + hi) >> 1
  val, cnt = run_tree_dp.call(mid)
  if cnt >= k
    best_lam = mid; best_val = val; lo = mid + 1
  else
    hi = mid - 1
  end
end
puts best_val + k * best_lam`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'Codeforces',
      title: 'Gosha is Hunting (739E) & Tree Destruction / Subarray Partition',
      difficulty: '2500–3000',
      url: 'https://codeforces.com/problemset/problem/739/E',
      patternNote: 'Even two simultaneous cardinality constraints yield to nested 2D Aliens Trick.',
    },
    {
      platform: 'AtCoder',
      title: 'ABC218H / ARC — Red and Blue Lamps & Tree Matching',
      difficulty: '2400',
      url: 'https://atcoder.jp/contests/abc218/tasks/abc218_h',
      patternNote: 'Convex DP cardinality elimination via integer penalty binary search.',
    },
    {
      platform: 'CSES',
      title: 'Subarray Sum Partitions / K-Transaction Convex Extensions',
      difficulty: 'Platinum',
      url: 'https://cses.fi/problemset',
      patternNote: 'Accelerate O(NK) segment partition DP directly down to O(N log V).',
    },
    {
      platform: 'CodeChef',
      title: 'IOI 2016 Aliens / Convex Partition Optimization',
      difficulty: '2600',
      url: 'https://oj.uz/problem/view/IOI16_aliens',
      patternNote: 'Origin of the "Aliens Trick": combine Convex Hull Trick inside WQS binary search.',
    },
    {
      platform: 'HackerRank',
      title: 'Stock Maximize K-Limit',
      difficulty: 'Expert',
      url: 'https://www.hackerrank.com/challenges',
      patternNote: 'Drop the O(K) transaction loop completely using two-state cash/hold Lagrangian DP.',
    },
    {
      platform: 'NeetCode 150',
      title: 'Best Time to Buy and Sell Stock IV (188)',
      difficulty: 'Hard -> Plat',
      url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/',
      patternNote: 'Upgrade the standard O(NK) LeetCode 188 solution to true O(N log V) WQS.',
    },
  ],
  interviewNotes: [
    'Why is Aliens Trick valid ONLY when `f(k)` is concave (maximization) or convex (minimization)? Because non-convex dents in `f(k)` lie strictly inside the convex hull and can NEVER become tangent to any line `y = lambda * x + b` regardless of `lambda`!',
    'Always reconstruct with target `K`: `bestVal + K * bestLambda`, NEVER `bestVal + bestCnt * bestLambda`, because collinear points at `lambda*` return `bestCnt >= K` while sharing the exact same intercept.',
    'Check your tie-breaking direction carefully: binary searching the largest `lambda` where `cnt >= K` requires breaking DP ties toward LARGER `cnt` so `cnt(lambda)` remains monotonically non-increasing.',
  ],
  projectBlueprint: {
    title: 'Budget-Constrained Ad Campaign & Resource Cap Optimizer',
    tagline:
      'Cardinality-constrained portfolio allocator replacing O(N * K) dynamic programming with sub-millisecond Lagrangian slope binary search.',
    stackSummary: 'TypeScript Lagrangian Convex Optimizer Engine',
    asciiDiagram: `[Channel Marginal Returns] --> [Binary Search Penalty lambda] --> [Unconstrained O(N) DP]
                                        |
                              [Verify maxCnt(lambda) >= K]
                                        |
                        [Exact Optimum = dpVal + K * bestLambda]`,
    milestones: [
      {
        id: 'm1',
        title: 'Consistent Tie-Breaking DP Kernel',
        detail: 'Implement unconstrained O(N) transition tracking both score and max tie-broken count.',
      },
      {
        id: 'm2',
        title: 'Integer Slope Binary Search Driver',
        detail: 'Converge on exact supporting hyperplane slope lambda* within 50 iterations.',
      },
      {
        id: 'm3',
        title: 'Convex Hull Intercept Recovery',
        detail: 'Recover exact K-allocation return free from collinear plateau errors.',
      },
    ],
    starterCode: `export function maxKSubarraySum(arr: number[], k: number): number {
  const NEG_INF = -1e15;
  const runLagrange = (lam: number): [number, number] => {
    let offV = 0, offC = 0;
    let onV = NEG_INF, onC = 0;
    for (const x of arr) {
      const useOn = onV > offV || (onV === offV && onC > offC);
      const pv = useOn ? onV : offV;
      const pc = useOn ? onC : offC;
      const sv = pv + x - lam, sc = pc + 1;
      const ev = onV + x, ec = onC;
      if (sv > ev || (sv === ev && sc >= ec)) {
        onV = sv; onC = sc;
      } else {
        onV = ev; onC = ec;
      }
      offV = pv; offC = pc;
    }
    return onV > offV || (onV === offV && onC > offC) ? [onV, onC] : [offV, offC];
  };

  let lo = -1e9, hi = 1e9, bestLam = lo, bestVal = 0;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const [val, cnt] = runLagrange(mid);
    if (cnt >= k) {
      bestLam = mid; bestVal = val; lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return bestVal + k * bestLam;
}

console.log('K=2 max disjoint sum:', maxKSubarraySum([2, -5, 4, -1, 3], 2));`,
  },
};
