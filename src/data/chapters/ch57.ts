import type { TheoryChapter } from '../../types/vault';

export const CH57_EXPECTED_VALUE_PROB_DP: TheoryChapter = {
  slug: 'expected-value-linearity',
  topicId: 'ma-53',
  title: 'Expected Value, Indicator Variables & Probability DP',
  domain: 'Math, Number Theory & Algebra',
  ratingTier: '1600–1900',
  usacoDivision: 'Gold',
  subtitle:
    'Decompose correlated random sums effortlessly with Linearity of Expectation E[X + Y] = E[X] + E[Y], rearrange self-looping Markov transitions algebraically (`E = (1 + ...) / (1 - p_stay)`), and solve cyclic hitting-time systems via Gaussian Elimination.',
  analogyTitle: 'The Uncorrelated-Expectation Superpower & Self-Loop Isolation Analogy',
  analogyBody:
    'Two myths break most competitors on probability problems: (1) thinking `E[X + Y] = E[X] + E[Y]` requires `X` and `Y` to be independent—FALSE! **Linearity of Expectation ALWAYS holds**, even when random events clash or correlate wildly (allowing us to write any count as a sum of binary `0/1` indicator variables `I_k` where `E[I_k] = P(event k)`!); and (2) panicking when a probability DP state `E[s]` transitions back to ITSELF with probability `p_0` (e.g., rolling an empty plate in AtCoder *Sushi*). By simply writing **`E[s] = 1 + p_0 * E[s] + sum(p_j * E[next_j])`** and subtracting `p_0 * E[s]` to the left side (`E[s] = (1 + sum p_j * E[next_j]) / (1 - p_0)`), self-loops vanish in one line of algebra! And when states form multi-node cycles on an arbitrary graph, writing one linear equation per vertex and running **Gaussian Elimination** resolves every cyclic hitting time simultaneously in `O(N^3)`!',
  prerequisites: [
    {
      slug: 'combinatorics-lucas-catalan',
      title: 'Combinatorics, Stars & Bars, Catalan & Lucas Theorem',
    },
  ],
  traceTitle: 'Interactive Indicator Decomposition & Self-Loop Algebra Trace',
  traceSubtitle:
    'Trace Coupon Collector (`E[T] = sum_{i=0}^{N-1} N / (N - i)`) via Linearity of Expectation, then trace AtCoder DP J (*Sushi*) state `E[c1=3, c2=0, c3=0] = 5.5`.',
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Step 1: Break Coupon Collector Into Independent Phase Indicators',
      explanation:
        'Suppose `N = 3` distinct coupons. Split total rolls `T` into `T = t_0 + t_1 + t_2`, where `t_i` counts rolls needed to go from `i` distinct coupons to `i + 1`. Even though future draws depend on the past set, each geometric waiting time `t_i` has success rate `p_i = (N - i) / N`, so `E[t_i] = N / (N - i)`! Total = `3/3 + 3/2 + 3/1 = 5.5`!',
      mode: 'array',
      arrays: [
        {
          name: 'Waiting Time Phases for N = 3 Coupons',
          cells: [
            { index: 0, value: 'p=3/3 -> E=1.0', label: '0 -> 1', highlight: 'window' },
            { index: 1, value: 'p=2/3 -> E=1.5', label: '1 -> 2', highlight: 'window' },
            { index: 2, value: 'p=1/3 -> E=3.0', label: '2 -> 3', highlight: 'active' },
          ],
        },
      ],
      variables: { E_Total: '5.5', Formula: 'N * H_N', Technique: 'Linearity of Expectation' },
    },
    {
      stepNumber: 2,
      title: 'Step 2: Isolate Self-Loop Probability on AtCoder Sushi (c1, c2, c3)',
      explanation:
        'At state `(c1, c2, c3)` with `s = c1 + c2 + c3` non-empty plates out of `N`: probability `(N - s) / N` rolls an EMPTY plate (`self-loop`)! Rearranging `E = 1 + ((N-s)/N)*E + ...` cancels `E` on the left to `(s / N) * E`, yielding **`E[c1,c2,c3] = (N + c1*E[c1-1,c2,c3] + c2*E[c1+1,c2-1,c3] + c3*E[c1,c2+1,c3-1]) / s`**!',
      mode: 'array',
      arrays: [
        {
          name: 'Bottom-Up Sushi DP for N = 3, Start = (c1=3, c2=0, c3=0)',
          cells: [
            { index: 0, value: 'E[0,0,0] = 0.0', highlight: 'neutral' },
            { index: 1, value: 'E[1,0,0] = 3/1 = 3.0', highlight: 'window' },
            { index: 2, value: 'E[2,0,0] = (3+2*3)/2 = 4.5', highlight: 'updated' },
            { index: 3, value: 'E[3,0,0] = (3+3*4.5)/3 = 5.5', highlight: 'active' },
          ],
        },
      ],
      variables: { E_3_0_0: 5.5, LoopOrder: 'c3 -> c2 -> c1', Complexity: 'O(N^3)' },
    },
    {
      stepNumber: 3,
      title: 'Step 3: Resolve Undirected Graph Cycles via Linear Equations (O(V^3))',
      explanation:
        'On cyclic graph `1-2-3-4` (`E[4] = 0`), vertex `1` links to `2,3` and `2` links back to `1,3`—so no DAG topological order exists! Writing `E[u] - sum_{v} (1/deg[u])*E[v] = 1` for `u < 4` gives an exact linear system solved by Gaussian Elimination -> `E[3]=7, E[1]=E[2]=9`!',
      mode: 'array',
      arrays: [
        {
          name: 'Solved Hitting Times to Sink Vertex 4',
          cells: [
            { index: 1, value: 'E[1] = 9.0', highlight: 'active' },
            { index: 2, value: 'E[2] = 9.0', highlight: 'window' },
            { index: 3, value: 'E[3] = 7.0', highlight: 'updated' },
            { index: 4, value: 'E[4] = 0.0 (sink)', highlight: 'neutral' },
          ],
        },
      ],
      variables: { Equations: 4, StartHittingTime: 9.0, Method: 'Gaussian Elimination' },
    },
  ],
  reductionClues: [
    {
      clue: '"Expected number of pairs / inversions / fixed points / matches in a random permutation or process"',
      translation:
        '**Indicator Variables + Linearity of Expectation**: decompose total count `X = sum I_k`, compute `P(I_k = 1)` independently for a single element/pair, and sum—ignoring ALL correlations between `I_a` and `I_b`!',
    },
    {
      clue: '"Expected steps until goal when transition can stay in the exact same state (`self-loop`) with probability p_stay"',
      translation:
        '**Self-Loop Algebraic Isolation**: write `E[u] = stepCost + p_stay * E[u] + sum p_v * E[v]`, move `p_stay * E[u]` left, and divide by **`(1 - p_stay)`**!',
    },
    {
      clue: '"Expected value DP where state order strictly decreases a tuple `(c3, c2, c1)` even though lower coordinates increase"',
      translation:
        '**Lexicographic State Ordering**: verify the invariant quantity (e.g., total remaining food or largest tier `c3`, then `c2`, then `c1`) shrinks strictly on transitions, fixing the exact loop nesting `for c3 -> for c2 -> for c1`!',
    },
    {
      clue: '"Random walk hitting time / Markov absorbing probability on general graph with cycles (N <= 200)"',
      translation:
        '**Gaussian Elimination over Reals (or Mod P)**: set `E[sink] = 0` (`1 * E[sink] = 0`) and `E[u] - (1/deg[u]) * sum E[v] = 1` for every non-sink `u`, then solve in `O(N^3)`!',
    },
  ],
  timeComplexity: 'O(N) for Indicator Sums | O(N^3) for 3D Sushi DP / Gaussian Elimination',
  spaceComplexity: 'O(N^2) to O(N^3)',
  pitfalls: [
    {
      type: 'WA',
      title: 'Multiplying Expectations When Variables Are Dependent (`E[X * Y] != E[X] * E[Y]`)',
      detail:
        'Linearity (`E[X + Y] = E[X] + E[Y]`) ALWAYS holds regardless of dependence, whereas **`E[X * Y] = E[X] * E[Y]` ONLY holds if X and Y are independent**! For variance or `E[X^2]`, expand `E[(sum I_k)^2] = sum E[I_k^2] + 2 sum_{a < b} P(I_a = 1 AND I_b = 1)` using joint pair probabilities!',
    },
    {
      type: 'WA',
      title: 'Forgetting Forward vs Backward Direction When Writing Probability vs Expectation DP',
      detail:
        '**Probabilities flow FORWARD** (`dp[next] += dp[cur] * p`), whereas **Expected Remaining Steps flow BACKWARD** (`E[cur] = 1 + sum p * E[next]` with `E[goal] = 0`)! Trying to push expected values forward without conditioning on reachability probability gives silent wrong answers!',
    },
    {
      type: 'WA',
      title: 'Wrong Loop Nesting on `dp[c1][c2][c3]` in AtCoder Sushi',
      detail:
        'Eating a 3-sushi plate transitions `(c1, c2, c3) -> (c1, c2 + 1, c3 - 1)` (decreasing `c3` while INCREASING `c2`), and eating a 2-sushi plate increases `c1`. Therefore **`c3` MUST be the outermost loop**, **`c2` middle**, and **`c1` innermost**!',
    },
    {
      type: 'TLE',
      title: 'Using `64`-Bit Integer Division or Unpadded Precision on Probabilities',
      detail:
        'Always print floating-point probability/expected-value answers with at least **`10` decimal places** (`fixed << setprecision(10)`) and check `double` precision (`53`-bit significand handles `10^{-15}` accuracy safely; guard `abs(pivot) < 1e-12` in Gaussian elimination).',
    },
  ],
  implementations: {
    cpp20: `#include <bits/stdc++.h>
using namespace std;

// Coupon Collector Expectation via Linearity of Expectation:
// Expected rolls to collect K distinct types out of N total types in O(K)
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    long long n, k;
    if (!(cin >> n >> k)) return 0;

    // Indicator waiting phase i (0 <= i < k): already hold i distinct types.
    // Probability of hitting a new type is (n - i) / n -> expected wait = n / (n - i).
    double expectedRolls = 0.0;
    for (long long i = 0; i < k; i++) {
        expectedRolls += (double)n / (double)(n - i);
    }

    cout << fixed << setprecision(10) << expectedRolls << "\\n";
    return 0;
}`,
    rust: `use std::io::{self, Read};

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let n: i64 = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };
    let k: i64 = it.next().unwrap().parse().unwrap();

    let mut expected: f64 = 0.0;
    for i in 0..k {
        expected += (n as f64) / ((n - i) as f64);
    }
    println!("{:.10}", expected);
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
        long n = fs.nextLong();
        if (n == Long.MIN_VALUE) return;
        long k = fs.nextLong();

        double expected = 0.0;
        for (long i = 0; i < k; i++) {
            expected += (double) n / (double) (n - i);
        }
        System.out.printf("%.10f%n", expected);
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

    expected = 0.0
    for i in range(k):
        expected += n / (n - i)
    sys.stdout.write(f"{expected:.10f}\\n")

if __name__ == "__main__":
    solve()`,
    ruby: `tokens = $stdin.read.split
exit if tokens.empty?
n = tokens[0].to_i
k = tokens[1].to_i

expected = 0.0
k.times do |i|
  expected += n.to_f / (n - i)
end
puts format("%.10f", expected)`,
  },
  practiceProblems: [
    {
      id: 'ch57-p1',
      tier: 'Warmup',
      ratingRange: '1400–1600',
      title: 'Dice Probability (Sum Distribution DP)',
      statement:
        'You throw a fair 6-sided die `N` times (`1 <= N <= 100`). Each throw independently yields integers `1..6` with equal probability `1/6`. Calculate the exact probability that the sum of all `N` outcomes lies in `[A, B]` (`1 <= A <= B <= 6N`), printed rounded to 6 decimal places.',
      constraints: '1 <= N <= 100, 1 <= A <= B <= 6 * N',
      sampleInput: `2 9 10`,
      sampleOutput: `0.194444`,
      hints: [
        'Probabilities propagate FORWARD: maintain `dp[s]` = probability of obtaining sum `s` after `step` throws.',
        'Initialize `dp[0] = 1.0`. For each throw `1..N`, transition `next[s + f] += dp[s] / 6.0` for `f = 1..6`.',
        'After `N` throws, sum `dp[s]` for all `s in [A, B]` and print with 6 decimal digits.',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, a, b;
    if (!(cin >> n >> a >> b)) return 0;

    vector<double> dp(6 * n + 1, 0.0);
    dp[0] = 1.0;
    for (int step = 1; step <= n; step++) {
        vector<double> nxt(6 * n + 1, 0.0);
        for (int s = step - 1; s <= 6 * (step - 1); s++) {
            if (dp[s] == 0.0) continue;
            for (int f = 1; f <= 6; f++) {
                nxt[s + f] += dp[s] / 6.0;
            }
        }
        dp.swap(nxt);
    }

    double ans = 0.0;
    for (int s = a; s <= b; s++) ans += dp[s];
    cout << fixed << setprecision(6) << ans << "\\n";
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
    let a: usize = it.next().unwrap().parse().unwrap();
    let b: usize = it.next().unwrap().parse().unwrap();

    let mut dp = vec![0.0f64; 6 * n + 1];
    dp[0] = 1.0;
    for step in 1..=n {
        let mut nxt = vec![0.0f64; 6 * n + 1];
        for s in (step - 1)..=(6 * (step - 1)) {
            if dp[s] == 0.0 { continue; }
            for f in 1..=6 {
                nxt[s + f] += dp[s] / 6.0;
            }
        }
        dp = nxt;
    }

    let ans: f64 = dp[a..=b].iter().sum();
    println!("{:.6}", ans);
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
        int n = (int) nLong, a = (int) fs.nextLong(), b = (int) fs.nextLong();

        double[] dp = new double[6 * n + 1];
        dp[0] = 1.0;
        for (int step = 1; step <= n; step++) {
            double[] nxt = new double[6 * n + 1];
            for (int s = step - 1; s <= 6 * (step - 1); s++) {
                if (dp[s] == 0.0) continue;
                for (int f = 1; f <= 6; f++) nxt[s + f] += dp[s] / 6.0;
            }
            dp = nxt;
        }

        double ans = 0.0;
        for (int s = a; s <= b; s++) ans += dp[s];
        System.out.printf("%.6f%n", ans);
    }
}`,
        python3: `import sys

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    a = int(data[1])
    b = int(data[2])

    dp = [0.0] * (6 * n + 1)
    dp[0] = 1.0
    for step in range(1, n + 1):
        nxt = [0.0] * (6 * n + 1)
        for s in range(step - 1, 6 * (step - 1) + 1):
            val = dp[s]
            if val == 0.0:
                continue
            p = val / 6.0
            for f in range(1, 7):
                nxt[s + f] += p
        dp = nxt

    ans = sum(dp[a:b + 1])
    sys.stdout.write(f"{ans:.6f}\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
n = tokens[0].to_i
a = tokens[1].to_i
b = tokens[2].to_i

dp = Array.new(6 * n + 1, 0.0)
dp[0] = 1.0
(1..n).each do |step|
  nxt = Array.new(6 * n + 1, 0.0)
  ((step - 1)..(6 * (step - 1))).each do |s|
    next if dp[s] == 0.0
    p = dp[s] / 6.0
    (1..6).each { |f| nxt[s + f] += p }
  end
  dp = nxt
end

ans = dp[a..b].sum
puts format("%.6f", ans)`,
      },
    },
    {
      id: 'ch57-p2',
      tier: 'Standard',
      ratingRange: '1700–1900',
      title: 'Sushi — Self-Loop Expected Value 3D DP (AtCoder EDPC J)',
      statement:
        'There are `N` plates (`1 <= N <= 300`), each initially holding `a_i in {1, 2, 3}` pieces of sushi. In each turn, Taro rolls an `N`-sided die uniformly at random (`1..N`): if the chosen plate has sushi, he eats 1 piece; otherwise nothing happens. Compute the expected number of turns until all plates are empty.',
      constraints: '1 <= N <= 300, 1 <= a_i <= 3',
      sampleInput: `3
1 1 1`,
      sampleOutput: `5.5000000000`,
      hints: [
        'Since plates of the same size are symmetric, state depends ONLY on `(c1, c2, c3)` = count of plates with 1, 2, 3 sushi!',
        'Let `s = c1 + c2 + c3`. Self-loop probability is `(N - s) / N`. Rearranging gives `E[c1,c2,c3] = (N + c1*E[c1-1,c2,c3] + c2*E[c1+1,c2-1,c3] + c3*E[c1,c2+1,c3-1]) / s`.',
        'Iterate `c3` outer `0..N`, `c2` middle `0..N-c3`, `c1` inner `0..N-c3-c2` so every prerequisite state is already computed!',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    if (!(cin >> n)) return 0;
    int cnt[4] = {0, 0, 0, 0};
    for (int i = 0; i < n; i++) {
        int a;
        cin >> a;
        cnt[a]++;
    }

    int stride = n + 2;
    vector<double> dp(stride * stride * stride, 0.0);
    auto idx = [&](int c1, int c2, int c3) {
        return (c3 * stride + c2) * stride + c1;
    };

    for (int c3 = 0; c3 <= n; c3++) {
        for (int c2 = 0; c2 <= n - c3; c2++) {
            for (int c1 = 0; c1 <= n - c3 - c2; c1++) {
                int s = c1 + c2 + c3;
                if (s == 0) continue;
                double val = (double)n;
                if (c1 > 0) val += c1 * dp[idx(c1 - 1, c2, c3)];
                if (c2 > 0) val += c2 * dp[idx(c1 + 1, c2 - 1, c3)];
                if (c3 > 0) val += c3 * dp[idx(c1, c2 + 1, c3 - 1)];
                dp[idx(c1, c2, c3)] = val / (double)s;
            }
        }
    }

    cout << fixed << setprecision(10) << dp[idx(cnt[1], cnt[2], cnt[3])] << "\\n";
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

    let mut cnt = [0usize; 4];
    for _ in 0..n {
        let a: usize = it.next().unwrap().parse().unwrap();
        cnt[a] += 1;
    }

    let stride = n + 2;
    let mut dp = vec![0.0f64; stride * stride * stride];
    let idx = |c1: usize, c2: usize, c3: usize| -> usize {
        (c3 * stride + c2) * stride + c1
    };

    for c3 in 0..=n {
        for c2 in 0..=(n - c3) {
            for c1 in 0..=(n - c3 - c2) {
                let s = c1 + c2 + c3;
                if s == 0 { continue; }
                let mut val = n as f64;
                if c1 > 0 { val += (c1 as f64) * dp[idx(c1 - 1, c2, c3)]; }
                if c2 > 0 { val += (c2 as f64) * dp[idx(c1 + 1, c2 - 1, c3)]; }
                if c3 > 0 { val += (c3 as f64) * dp[idx(c1, c2 + 1, c3 - 1)]; }
                dp[idx(c1, c2, c3)] = val / (s as f64);
            }
        }
    }

    println!("{:.10}", dp[idx(cnt[1], cnt[2], cnt[3])]);
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

        int[] cnt = new int[4];
        for (int i = 0; i < n; i++) cnt[(int) fs.nextLong()]++;

        int stride = n + 2;
        double[] dp = new double[stride * stride * stride];
        for (int c3 = 0; c3 <= n; c3++) {
            for (int c2 = 0; c2 <= n - c3; c2++) {
                int baseIdx = (c3 * stride + c2) * stride;
                for (int c1 = 0; c1 <= n - c3 - c2; c1++) {
                    int s = c1 + c2 + c3;
                    if (s == 0) continue;
                    double val = n;
                    if (c1 > 0) val += c1 * dp[baseIdx + c1 - 1];
                    if (c2 > 0) val += c2 * dp[(c3 * stride + c2 - 1) * stride + c1 + 1];
                    if (c3 > 0) val += c3 * dp[((c3 - 1) * stride + c2 + 1) * stride + c1];
                    dp[baseIdx + c1] = val / s;
                }
            }
        }
        System.out.printf("%.10f%n", dp[(cnt[3] * stride + cnt[2]) * stride + cnt[1]]);
    }
}`,
        python3: `import sys

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    cnt = [0, 0, 0, 0]
    for i in range(1, n + 1):
        cnt[int(data[i])] += 1

    stride = n + 2
    dp = [0.0] * (stride * stride * stride)
    for c3 in range(n + 1):
        for c2 in range(n - c3 + 1):
            base = (c3 * stride + c2) * stride
            row2 = (c3 * stride + (c2 - 1)) * stride if c2 > 0 else 0
            row3 = ((c3 - 1) * stride + (c2 + 1)) * stride if c3 > 0 else 0
            for c1 in range(n - c3 - c2 + 1):
                s = c1 + c2 + c3
                if s == 0:
                    continue
                val = float(n)
                if c1 > 0:
                    val += c1 * dp[base + c1 - 1]
                if c2 > 0:
                    val += c2 * dp[row2 + c1 + 1]
                if c3 > 0:
                    val += c3 * dp[row3 + c1]
                dp[base + c1] = val / s

    ans = dp[(cnt[3] * stride + cnt[2]) * stride + cnt[1]]
    sys.stdout.write(f"{ans:.10f}\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
n = tokens[0].to_i

cnt = [0, 0, 0, 0]
(1..n).each { |i| cnt[tokens[i].to_i] += 1 }

stride = n + 2
dp = Array.new(stride * stride * stride, 0.0)
(0..n).each do |c3|
  (0..(n - c3)).each do |c2|
    base = (c3 * stride + c2) * stride
    row2 = c2 > 0 ? (c3 * stride + (c2 - 1)) * stride : 0
    row3 = c3 > 0 ? ((c3 - 1) * stride + (c2 + 1)) * stride : 0
    (0..(n - c3 - c2)).each do |c1|
      s = c1 + c2 + c3
      next if s == 0
      val = n.to_f
      val += c1 * dp[base + c1 - 1] if c1 > 0
      val += c2 * dp[row2 + c1 + 1] if c2 > 0
      val += c3 * dp[row3 + c1] if c3 > 0
      dp[base + c1] = val / s
    end
  end
end

puts format("%.10f", dp[(cnt[3] * stride + cnt[2]) * stride + cnt[1]])`,
      },
    },
    {
      id: 'ch57-p3',
      tier: 'Boss',
      ratingRange: '2000–2200',
      title: 'Random Walk Hitting Time on Graphs (Gaussian Elimination)',
      statement:
        'Given a connected undirected simple graph on `N` vertices (`2 <= N <= 100`) and `M` edges, a token begins at vertex `1` and stops immediately upon reaching vertex `N`. Whenever the token stands at `u != N`, it moves to one of `u`’s neighbors chosen uniformly at random. Compute the expected number of moves to reach vertex `N` (within `10^{-6}`).',
      constraints: '2 <= N <= 100, N - 1 <= M <= N*(N-1)/2',
      sampleInput: `4 4
1 2
2 3
1 3
3 4`,
      sampleOutput: `9.0000000000`,
      hints: [
        'Let `E[u]` denote the expected moves starting from vertex `u`. Clearly `E[N] = 0`.',
        'For every `u` in `1..N-1`, `E[u] = 1 + sum_{v in adj[u]} (1 / deg[u]) * E[v]`, which rearranges into a linear equation `E[u] - (1/deg[u]) * sum E[v] = 1`.',
        'Solve the `N x (N + 1)` augmented matrix via partial-pivoting Gaussian Elimination in `O(N^3)` and output `E[1]`.',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, m;
    if (!(cin >> n >> m)) return 0;
    vector<vector<int>> adj(n);
    for (int i = 0; i < m; i++) {
        int u, v;
        cin >> u >> v;
        u--; v--;
        adj[u].push_back(v);
        adj[v].push_back(u);
    }

    // Build N x (N + 1) linear system: A * E = b
    vector<vector<double>> A(n, vector<double>(n + 1, 0.0));
    A[n - 1][n - 1] = 1.0; // E[n-1] = 0
    A[n - 1][n] = 0.0;
    for (int u = 0; u < n - 1; u++) {
        A[u][u] = 1.0;
        A[u][n] = 1.0;
        double invDeg = 1.0 / (double)adj[u].size();
        for (int v : adj[u]) {
            A[u][v] -= invDeg;
        }
    }

    // Partial-pivoting Gaussian Elimination
    for (int col = 0; col < n; col++) {
        int piv = col;
        for (int r = col + 1; r < n; r++) {
            if (fabs(A[r][col]) > fabs(A[piv][col])) piv = r;
        }
        swap(A[col], A[piv]);
        double diag = A[col][col];
        for (int c = col; c <= n; c++) A[col][c] /= diag;
        for (int r = 0; r < n; r++) {
            if (r == col || fabs(A[r][col]) < 1e-12) continue;
            double factor = A[r][col];
            for (int c = col; c <= n; c++) {
                A[r][c] -= factor * A[col][c];
            }
        }
    }

    cout << fixed << setprecision(10) << A[0][n] << "\\n";
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

    let mut adj = vec![Vec::new(); n];
    for _ in 0..m {
        let u = it.next().unwrap().parse::<usize>().unwrap() - 1;
        let v = it.next().unwrap().parse::<usize>().unwrap() - 1;
        adj[u].push(v);
        adj[v].push(u);
    }

    let mut a = vec![vec![0.0f64; n + 1]; n];
    a[n - 1][n - 1] = 1.0;
    for u in 0..(n - 1) {
        a[u][u] = 1.0;
        a[u][n] = 1.0;
        let inv_deg = 1.0 / (adj[u].len() as f64);
        for &v in &adj[u] {
            a[u][v] -= inv_deg;
        }
    }

    for col in 0..n {
        let mut piv = col;
        for r in (col + 1)..n {
            if a[r][col].abs() > a[piv][col].abs() {
                piv = r;
            }
        }
        a.swap(col, piv);
        let diag = a[col][col];
        for c in col..=n {
            a[col][c] /= diag;
        }
        for r in 0..n {
            if r == col || a[r][col].abs() < 1e-12 {
                continue;
            }
            let factor = a[r][col];
            for c in col..=n {
                a[r][c] -= factor * a[col][c];
            }
        }
    }

    println!("{:.10}", a[0][n]);
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

        List<List<Integer>> adj = new ArrayList<>(n);
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (int i = 0; i < m; i++) {
            int u = (int) fs.nextLong() - 1;
            int v = (int) fs.nextLong() - 1;
            adj.get(u).add(v);
            adj.get(v).add(u);
        }

        double[][] A = new double[n][n + 1];
        A[n - 1][n - 1] = 1.0;
        for (int u = 0; u < n - 1; u++) {
            A[u][u] = 1.0;
            A[u][n] = 1.0;
            double invDeg = 1.0 / adj.get(u).size();
            for (int v : adj.get(u)) A[u][v] -= invDeg;
        }

        for (int col = 0; col < n; col++) {
            int piv = col;
            for (int r = col + 1; r < n; r++) {
                if (Math.abs(A[r][col]) > Math.abs(A[piv][col])) piv = r;
            }
            double[] tmp = A[col]; A[col] = A[piv]; A[piv] = tmp;
            double diag = A[col][col];
            for (int c = col; c <= n; c++) A[col][c] /= diag;
            for (int r = 0; r < n; r++) {
                if (r == col || Math.abs(A[r][col]) < 1e-12) continue;
                double factor = A[r][col];
                for (int c = col; c <= n; c++) A[r][c] -= factor * A[col][c];
            }
        }
        System.out.printf("%.10f%n", A[0][n]);
    }
}`,
        python3: `import sys

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    m = int(data[1])
    adj = [[] for _ in range(n)]
    idx = 2
    for _ in range(m):
        u = int(data[idx]) - 1
        v = int(data[idx + 1]) - 1
        idx += 2
        adj[u].append(v)
        adj[v].append(u)

    A = [[0.0] * (n + 1) for _ in range(n)]
    A[n - 1][n - 1] = 1.0
    for u in range(n - 1):
        A[u][u] = 1.0
        A[u][n] = 1.0
        inv_deg = 1.0 / len(adj[u])
        for v in adj[u]:
            A[u][v] -= inv_deg

    for col in range(n):
        piv = max(range(col, n), key=lambda r: abs(A[r][col]))
        A[col], A[piv] = A[piv], A[col]
        diag = A[col][col]
        for c in range(col, n + 1):
            A[col][c] /= diag
        for r in range(n):
            if r == col or abs(A[r][col]) < 1e-12:
                continue
            factor = A[r][col]
            for c in range(col, n + 1):
                A[r][c] -= factor * A[col][c]

    sys.stdout.write(f"{A[0][n]:.10f}\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
n = tokens[0].to_i
m = tokens[1].to_i

adj = Array.new(n) { [] }
idx = 2
m.times do
  u = tokens[idx].to_i - 1
  v = tokens[idx + 1].to_i - 1
  idx += 2
  adj[u] << v
  adj[v] << u
end

a = Array.new(n) { Array.new(n + 1, 0.0) }
a[n - 1][n - 1] = 1.0
(0...(n - 1)).each do |u|
  a[u][u] = 1.0
  a[u][n] = 1.0
  inv_deg = 1.0 / adj[u].length
  adj[u].each { |v| a[u][v] -= inv_deg }
end

n.times do |col|
  piv = (col...n).max_by { |r| a[r][col].abs }
  a[col], a[piv] = a[piv], a[col]
  diag = a[col][col]
  (col..n).each { |c| a[col][c] /= diag }
  n.times do |r|
    next if r == col || a[r][col].abs < 1e-12
    factor = a[r][col]
    (col..n).each { |c| a[r][c] -= factor * a[col][c] }
  end
end

puts format("%.10f", a[0][n])`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'AtCoder',
      title: 'Educational DP Contest J — Sushi',
      difficulty: '1750',
      url: 'https://atcoder.jp/contests/dp/tasks/dp_j',
      patternNote: 'Benchmark for self-loop expected value DP with symmetric plate counts.',
    },
    {
      platform: 'CSES',
      title: 'Dice Probability (1725) & Candy Lottery / Inversion Probability',
      difficulty: 'Gold',
      url: 'https://cses.fi/problemset/task/1725',
      patternNote: 'Forward sum probability DP and indicator-variable inversion counting.',
    },
    {
      platform: 'Codeforces',
      title: 'Little Pony and Expected Maximum / Broken Robot (24D)',
      difficulty: '1600–2200',
      url: 'https://codeforces.com/problemset/problem/24/D',
      patternNote: 'Tridiagonal Markov hitting-time linear equations solved per grid row.',
    },
    {
      platform: 'CodeChef',
      title: 'Coupon Collector & Expected Jumps',
      difficulty: '1700',
      url: 'https://www.codechef.com',
      patternNote: 'Combine geometric phase waiting times cleanly via indicator variables.',
    },
    {
      platform: 'HackerRank',
      title: 'Random Number Generator / Favorite Sequence Expectation',
      difficulty: 'Hard',
      url: 'https://www.hackerrank.com/challenges',
      patternNote: 'Avoid joint-distribution explosion by computing marginal pair probabilities directly.',
    },
    {
      platform: 'NeetCode 150',
      title: 'Knight Probability in Chessboard (688) & New 21 Game (837)',
      difficulty: 'Medium',
      url: 'https://leetcode.com/problems/knight-probability-in-chessboard/',
      patternNote: 'Master exact fixed-horizon probability propagation and sliding-window Markov transitions.',
    },
  ],
  interviewNotes: [
    'Why is Linearity of Expectation `E[X + Y] = E[X] + E[Y]` so powerful in algorithmic analysis? Because it holds even when `X` and `Y` are completely dependent—letting us break coupled outputs into simple `0/1` indicator probabilities.',
    'How do you eliminate self-loops (`s -> s` with probability `p_stay`) in expected-value DP? Write `E[s] = 1 + p_stay * E[s] + sum(p_j * E[next_j])`, subtract `p_stay * E[s]` to the left, and divide by `1 - p_stay`.',
    'When should you switch from topological DP to Gaussian Elimination for expected hitting times? Whenever transitions contain multi-state directed or undirected cycles (`E[u]` depends on `E[v]` and vice versa).',
  ],
  projectBlueprint: {
    title: 'A/B Testing Reliability & Stochastic Retry-Backoff Simulator',
    tagline:
      'Analytical SLA probability and expected-latency modeling service calculating exact multi-hop retry hitting times without noisy Monte Carlo variance.',
    stackSummary: 'TypeScript Markov Hitting-Time & Expectation Analyzer',
    asciiDiagram: `[Service Transition Graph + Self-Loop Retries]
         |
         +--> [Coupon / Phase Indicators] --> [Exact Coverage Latency]
         |
         +--> [Linear System E - P*E = 1] --> [Gaussian Solver: Exact Mean Retries]`,
    milestones: [
      {
        id: 'm1',
        title: 'Forward Sum Probability Propagator',
        detail: 'Compute exact CDF and confidence intervals across N discrete stochastic steps.',
      },
      {
        id: 'm2',
        title: 'Self-Loop Geometric Isolation Module',
        detail: 'Evaluate expected completion under arbitrary transient failure probabilities.',
      },
      {
        id: 'm3',
        title: 'Cyclic Markov Hitting-Time Solver',
        detail: 'Run partial-pivot Gaussian elimination over cyclic microservice retry topologies.',
      },
    ],
    starterCode: `export function solveHittingTime(n: number, edges: [number, number][]): number {
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }
  const A: number[][] = Array.from({ length: n }, () => new Array(n + 1).fill(0));
  A[n - 1][n - 1] = 1;
  for (let u = 0; u < n - 1; u++) {
    A[u][u] = 1;
    A[u][n] = 1;
    const inv = 1 / adj[u].length;
    for (const v of adj[u]) A[u][v] -= inv;
  }
  for (let col = 0; col < n; col++) {
    let piv = col;
    for (let r = col + 1; r < n; r++) {
      if (Math.abs(A[r][col]) > Math.abs(A[piv][col])) piv = r;
    }
    [A[col], A[piv]] = [A[piv], A[col]];
    const diag = A[col][col];
    for (let c = col; c <= n; c++) A[col][c] /= diag;
    for (let r = 0; r < n; r++) {
      if (r === col || Math.abs(A[r][col]) < 1e-12) continue;
      const f = A[r][col];
      for (let c = col; c <= n; c++) A[r][c] -= f * A[col][c];
    }
  }
  return A[0][n];
}

console.log('Expected hitting time 0->3:', solveHittingTime(4, [[0, 1], [1, 2], [0, 2], [2, 3]]));`,
  },
};
