import type { TheoryChapter } from '../../types/vault';

export const CH74_SMAWK_MONGE: TheoryChapter = {
  slug: 'smawk-monotone-minima',
  topicId: 'dp-29',
  title: 'SMAWK Algorithm & Monge Matrix Multiplication',
  domain: 'Search, Greedy & DP',
  ratingTier: '2600–3300+',
  usacoDivision: 'Advanced',
  subtitle: 'Linear-time O(N + M) row-minima of totally monotone Monge matrices via stack REDUCE, recursive odd-row reduction, INTERPOLATE, and Wilber/LARSCH O(N) 1D/1D concave DP',
  analogyTitle: 'Pruning Dead Columns Until Every Row Needs Only Two Neighbors',
  analogyBody:
    'Standard Divide-and-Conquer DP computes all row minima of an N x M totally monotone matrix in O((N + M) log N) time because each recursion depth halves the rows while re-scanning the entire active column range. SMAWK (Aggarwal, Klawe, Moran, Shor & Wilber) strips away that logarithmic factor by shrinking BOTH dimensions together.\n\nA matrix A is totally monotone if in every 2 x 2 submatrix A[{r1, r2}, {c1, c2}] (r1 < r2, c1 < c2), whenever A[r1, c2] < A[r1, c1], we necessarily have A[r2, c2] < A[r2, c1]. The REDUCE phase scans columns left-to-right with a stack S: if S currently holds k columns and the back column S[k-1] loses to the new column c at row r_{k-1}, then S[k-1] can NEVER win any later row r >= r_{k-1}—and by total monotonicity, it is dominated at earlier rows too, so S[k-1] is permanently popped! Once |S| reaches N, no further column can beat existing columns across the N rows.\n\nSMAWK then recurses on only the odd rows R_odd using those <= N surviving columns—halving BOTH rows and columns simultaneously so total work forms a geometric sum O(N + M)—and finishes with a monotonic two-pointer INTERPOLATE pass across the even rows. Paired with convex extension penalties or Wilber/LARSCH batching, both convex min-plus convolution and 1D/1D concave DP collapse to strict O(N).',
  prerequisites: [
    { slug: 'divide-conquer-knuth-dp', title: 'Divide & Conquer DP and Knuth-Yao Optimization' },
  ],
  traceTitle: 'SMAWK REDUCE + Odd-Row Recursion on a 4 x 6 Monge Matrix',
  traceSubtitle: 'Tracking REDUCE stack pruning, odd-row recursion [1, 3], and two-pointer INTERPOLATE on rows [0, 2]',
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Step 1: REDUCE Stack Sweeps 6 Columns Down to <= 4 Candidates',
      explanation: 'Scan columns 0..5 left-to-right. Compare stack top c_top vs new column c at row r = |S| - 1: pop whenever A[r][c_top] > A[r][c]; skip c once |S| == 4.',
      mode: 'array',
      arrays: [
        {
          name: 'Column Survival After REDUCE',
          cells: [
            { index: 0, value: 'KEEP', label: 'c0', highlight: 'active' },
            { index: 1, value: 'KEEP', label: 'c1', highlight: 'active' },
            { index: 2, value: 'PRUNE', label: 'c2', highlight: 'neutral' },
            { index: 3, value: 'KEEP', label: 'c3', highlight: 'updated' },
            { index: 4, value: 'PRUNE', label: 'c4', highlight: 'neutral' },
            { index: 5, value: 'KEEP', label: 'c5', highlight: 'updated' },
          ],
        },
      ],
      variables: { rows: 4, colsBefore: 6, colsAfterReduce: 4, stackRule: 'pop if M[|S|-1][top] > M[|S|-1][c]' },
    },
    {
      stepNumber: 2,
      title: 'Step 2: Recurse on Odd Rows [1, 3] Using Surviving Columns',
      explanation: 'Recursively invoke SMAWK on the 2 odd rows [1, 3] and the surviving column list, bounding all even-row optima.',
      mode: 'array',
      arrays: [
        {
          name: 'Provisional Argmins (Odd Rows Solved)',
          cells: [
            { index: 0, value: '?', label: 'r0', highlight: 'neutral' },
            { index: 1, value: 'c1 (2)', label: 'r1', highlight: 'active' },
            { index: 2, value: '?', label: 'r2', highlight: 'neutral' },
            { index: 3, value: 'c5 (6)', label: 'r3', highlight: 'active' },
          ],
        },
      ],
      variables: { subRows: '[1, 3]', argmin_r1: 1, argmin_r3: 5 },
    },
    {
      stepNumber: 3,
      title: 'Step 3: Two-Pointer INTERPOLATE Completes Even Rows [0, 2] in O(C)',
      explanation: 'Scan monotonically between adjacent odd-row argmins across surviving columns so total probes telescope to O(|S|).',
      mode: 'array',
      arrays: [
        {
          name: 'Final Row Minima (argmin, val)',
          cells: [
            { index: 0, value: '0 (0)', label: 'r0', highlight: 'updated' },
            { index: 1, value: '1 (2)', label: 'r1', highlight: 'active' },
            { index: 2, value: '3 (4)', label: 'r2', highlight: 'updated' },
            { index: 3, value: '5 (6)', label: 'r3', highlight: 'active' },
          ],
        },
      ],
      variables: { argmins: '[0, 1, 3, 5]', vals: '[0, 2, 4, 6]', complexity: 'O(N + M)' },
    },
  ],
  reductionClues: [
    {
      clue: 'Find all row minima of an N x M totally monotone (or Monge) matrix without a log N factor',
      translation: 'Run static SMAWK (REDUCE stack + odd-row recursion + two-pointer INTERPOLATE) in strict O(N + M) queries.',
    },
    {
      clue: 'Compute min-plus convolution C[k] = min(A[i] + B[k - i]) where sequence B is convex in O(N)',
      translation: 'Extend B linearly beyond [0, M-1] with huge slope +/-BIG so W(k, i) = A[i] + B_ext(k - i) is everywhere Monge, then run SMAWK.',
    },
    {
      clue: 'Solve 1D/1D convex DP dp[i] = min_{j < i} (dp[j] + w(j, i)) with quadrangle inequality in O(N)',
      translation: 'Use Wilber / LARSCH batch-SMAWK: alternate optimistic SMAWK over [c+1..p] x [l..c] with monotonicity contradiction advances.',
    },
    {
      clue: 'Distinguish Monge (quadrangle inequality) from Total Monotonicity',
      translation: 'Every Monge matrix (A[a,c] + A[b,d] <= A[a,d] + A[b,c]) is totally monotone; SMAWK only needs total monotonicity.',
    },
  ],
  timeComplexity: 'O(N + M) matrix evaluations for SMAWK; O(N) for Convex Min-Plus Convolution & Wilber/LARSCH 1D DP',
  spaceComplexity: 'O(N + M) recursion frames and column candidate stacks',
  pitfalls: [
    {
      type: 'WA',
      title: 'Wrong Tie-Breaking Inequality in REDUCE and INTERPOLATE',
      detail: 'When breaking ties toward the earliest column, REDUCE must pop ONLY when M[r][top] > M[r][c] (strictly worse), and INTERPOLATE updates best only on v < best_v.',
    },
    {
      type: 'WA',
      title: 'Using +INF Directly in Convex Min-Plus Convolution',
      detail: 'Raw +INF entries for out-of-range k - i break the 2x2 total monotonicity invariant across boundaries. Extend B linearly with slope -BIG left and +BIG right exceeding max|A| + max|B|.',
    },
    {
      type: 'TLE',
      title: 'Linearly Searching stack.index(argmin) Inside INTERPOLATE',
      detail: 'Maintain a single monotonically advancing pointer across the surviving column stack so INTERPOLATE stays strictly O(N + |stack|).',
    },
    {
      type: 'WA',
      title: 'Skipping Intermediate Buffer F[r] When Advancing l in Wilber 1D/1D DP',
      detail: 'When columns [c+1..p-1] beat [l..c] at row p, save F[r] = min(F[r], G[r]) for c+2 <= r < p before jumping l = c + 1.',
    },
  ],
  implementations: {
    cpp20: `#include <iostream>
#include <vector>

using namespace std;

template <class Eval>
vector<int> smawk(int n, int m, Eval eval) {
    auto rec = [&](auto& self, const vector<int>& rows, const vector<int>& cols) -> vector<int> {
        int rsz = static_cast<int>(rows.size());
        if (rsz == 0) return {};
        vector<int> stk;
        stk.reserve(rsz);
        for (int c : cols) {
            while (!stk.empty()) {
                int r = rows[stk.size() - 1];
                if (eval(r, stk.back()) <= eval(r, c)) break;
                stk.pop_back();
            }
            if (static_cast<int>(stk.size()) < rsz) stk.push_back(c);
        }
        if (rsz == 1) return {stk[0]};
        vector<int> odd_rows;
        odd_rows.reserve(rsz / 2);
        for (int i = 1; i < rsz; i += 2) odd_rows.push_back(rows[i]);
        vector<int> sub = self(self, odd_rows, stk);
        vector<int> ans(rsz, 0);
        int ptr = 0;
        for (int i = 0; i < rsz; i += 2) {
            int lo = ptr;
            int hi;
            if (i + 1 < rsz) {
                int target = sub[i >> 1];
                while (stk[ptr] != target) ++ptr;
                hi = ptr;
                ans[i + 1] = target;
            } else {
                hi = static_cast<int>(stk.size()) - 1;
            }
            int best_c = stk[lo];
            long long best_v = eval(rows[i], best_c);
            for (int k = lo + 1; k <= hi; ++k) {
                int c = stk[k];
                long long v = eval(rows[i], c);
                if (v < best_v) {
                    best_v = v;
                    best_c = c;
                }
            }
            ans[i] = best_c;
        }
        return ans;
    };
    vector<int> rows(n), cols(m);
    for (int i = 0; i < n; ++i) rows[i] = i;
    for (int j = 0; j < m; ++j) cols[j] = j;
    return rec(rec, rows, cols);
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, m;
    if (!(cin >> n >> m)) return 0;
    vector<vector<long long>> mat(n, vector<long long>(m));
    for (int i = 0; i < n; ++i) {
        for (int j = 0; j < m; ++j) cin >> mat[i][j];
    }
    vector<int> argmins = smawk(n, m, [&](int r, int c) { return mat[r][c]; });
    for (int i = 0; i < n; ++i) {
        cout << argmins[i] << " " << mat[i][argmins[i]] << "\\n";
    }
    return 0;
}`,
    rust: `use std::io::{self, Read};

fn smawk_rec<F>(rows: &[usize], cols: &[usize], eval: &F) -> Vec<usize>
where
    F: Fn(usize, usize) -> i64,
{
    let rsz = rows.len();
    if rsz == 0 {
        return Vec::new();
    }
    let mut stk: Vec<usize> = Vec::with_capacity(rsz);
    for &c in cols {
        while let Some(&top) = stk.last() {
            let r = rows[stk.len() - 1];
            if eval(r, top) <= eval(r, c) {
                break;
            }
            stk.pop();
        }
        if stk.len() < rsz {
            stk.push(c);
        }
    }
    if rsz == 1 {
        return vec![stk[0]];
    }
    let odd_rows: Vec<usize> = rows.iter().skip(1).step_by(2).copied().collect();
    let sub = smawk_rec(&odd_rows, &stk, eval);
    let mut ans = vec![0usize; rsz];
    let mut ptr = 0usize;
    let mut i = 0usize;
    while i < rsz {
        let lo = ptr;
        let hi = if i + 1 < rsz {
            let target = sub[i >> 1];
            while stk[ptr] != target {
                ptr += 1;
            }
            ans[i + 1] = target;
            ptr
        } else {
            stk.len() - 1
        };
        let mut best_c = stk[lo];
        let mut best_v = eval(rows[i], best_c);
        for &c in &stk[(lo + 1)..=hi] {
            let v = eval(rows[i], c);
            if v < best_v {
                best_v = v;
                best_c = c;
            }
        }
        ans[i] = best_c;
        i += 2;
    }
    ans
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let n: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };
    let m: usize = it.next().unwrap().parse().unwrap();
    let mut mat = vec![vec![0i64; m]; n];
    for r in 0..n {
        for c in 0..m {
            mat[r][c] = it.next().unwrap().parse().unwrap();
        }
    }
    let rows: Vec<usize> = (0..n).collect();
    let cols: Vec<usize> = (0..m).collect();
    let argmins = smawk_rec(&rows, &cols, &|r, c| mat[r][c]);
    let mut out = String::new();
    for r in 0..n {
        let c = argmins[r];
        out.push_str(&format!("{} {}\\n", c, mat[r][c]));
    }
    print!("{}", out);
}`,
    java21: `import java.io.IOException;
import java.io.InputStream;

public class Main {
    static class FastScanner {
        private final InputStream in = System.in;
        private final byte[] buffer = new byte[1 << 16];
        private int ptr = 0, len = 0;

        private int readByte() throws IOException {
            if (ptr >= len) {
                len = in.read(buffer);
                ptr = 0;
                if (len <= 0) return -1;
            }
            return buffer[ptr++];
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
            long val = 0;
            while (c > ' ') {
                val = val * 10 + (c - '0');
                c = readByte();
            }
            return val * sign;
        }
    }

    static long[][] mat;

    static int[] smawkRec(int[] rows, int[] cols) {
        int rsz = rows.length;
        if (rsz == 0) return new int[0];
        int[] stk = new int[rsz];
        int top = 0;
        for (int c : cols) {
            while (top > 0) {
                int r = rows[top - 1];
                if (mat[r][stk[top - 1]] <= mat[r][c]) break;
                top--;
            }
            if (top < rsz) stk[top++] = c;
        }
        int[] redCols = new int[top];
        System.arraycopy(stk, 0, redCols, 0, top);
        if (rsz == 1) return new int[]{redCols[0]};

        int oddCount = rsz / 2;
        int[] oddRows = new int[oddCount];
        for (int i = 1, k = 0; i < rsz; i += 2) oddRows[k++] = rows[i];
        int[] sub = smawkRec(oddRows, redCols);

        int[] ans = new int[rsz];
        int ptr = 0;
        for (int i = 0; i < rsz; i += 2) {
            int lo = ptr;
            int hi;
            if (i + 1 < rsz) {
                int target = sub[i >> 1];
                while (redCols[ptr] != target) ptr++;
                hi = ptr;
                ans[i + 1] = target;
            } else {
                hi = top - 1;
            }
            int bestC = redCols[lo];
            long bestV = mat[rows[i]][bestC];
            for (int k = lo + 1; k <= hi; k++) {
                int c = redCols[k];
                long v = mat[rows[i]][c];
                if (v < bestV) {
                    bestV = v;
                    bestC = c;
                }
            }
            ans[i] = bestC;
        }
        return ans;
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        long nVal = fs.nextLong();
        if (nVal == Long.MIN_VALUE) return;
        int n = (int) nVal;
        int m = (int) fs.nextLong();
        mat = new long[n][m];
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < m; j++) mat[i][j] = fs.nextLong();
        }
        int[] rows = new int[n], cols = new int[m];
        for (int i = 0; i < n; i++) rows[i] = i;
        for (int j = 0; j < m; j++) cols[j] = j;
        int[] argmins = smawkRec(rows, cols);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) {
            sb.append(argmins[i]).append(' ').append(mat[i][argmins[i]]).append('\\n');
        }
        System.out.print(sb);
    }
}`,
    python3: `import sys

sys.setrecursionlimit(200000)


def smawk(rows: list[int], cols: list[int], eval_fn) -> list[int]:
    rsz = len(rows)
    if rsz == 0:
        return []
    stk: list[int] = []
    for c in cols:
        while stk:
            r = rows[len(stk) - 1]
            if eval_fn(r, stk[-1]) <= eval_fn(r, c):
                break
            stk.pop()
        if len(stk) < rsz:
            stk.append(c)
    if rsz == 1:
        return [stk[0]]
    sub = smawk(rows[1::2], stk, eval_fn)
    ans = [0] * rsz
    ptr = 0
    for i in range(0, rsz, 2):
        lo = ptr
        if i + 1 < rsz:
            target = sub[i >> 1]
            while stk[ptr] != target:
                ptr += 1
            hi = ptr
            ans[i + 1] = target
        else:
            hi = len(stk) - 1
        best_c = stk[lo]
        best_v = eval_fn(rows[i], best_c)
        for k in range(lo + 1, hi + 1):
            c = stk[k]
            v = eval_fn(rows[i], c)
            if v < best_v:
                best_v = v
                best_c = c
        ans[i] = best_c
    return ans


def main() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    m = int(data[1])
    it = iter(data[2:])
    mat = [[int(next(it)) for _ in range(m)] for _ in range(n)]
    argmins = smawk(list(range(n)), list(range(m)), lambda r, c: mat[r][c])
    out = [f"{c} {mat[r][c]}" for r, c in enumerate(argmins)]
    sys.stdout.write("\\n".join(out) + "\\n")


if __name__ == "__main__":
    main()`,
    ruby: `def smawk(rows, cols, &eval_fn)
  rsz = rows.length
  return [] if rsz == 0

  stk = []
  cols.each do |c|
    while !stk.empty?
      r = rows[stk.length - 1]
      break if eval_fn.call(r, stk[-1]) <= eval_fn.call(r, c)
      stk.pop
    end
    stk << c if stk.length < rsz
  end
  return [stk[0]] if rsz == 1

  odd_rows = []
  i = 1
  while i < rsz
    odd_rows << rows[i]
    i += 2
  end
  sub = smawk(odd_rows, stk, &eval_fn)
  ans = Array.new(rsz, 0)
  ptr = 0
  i = 0
  while i < rsz
    lo = ptr
    if i + 1 < rsz
      target = sub[i >> 1]
      ptr += 1 while stk[ptr] != target
      hi = ptr
      ans[i + 1] = target
    else
      hi = stk.length - 1
    end
    best_c = stk[lo]
    best_v = eval_fn.call(rows[i], best_c)
    ((lo + 1)..hi).each do |k|
      c = stk[k]
      v = eval_fn.call(rows[i], c)
      if v < best_v
        best_v = v
        best_c = c
      end
    end
    ans[i] = best_c
    i += 2
  end
  ans
end

tokens = STDIN.read.split
return if tokens.empty?
n = tokens[0].to_i
m = tokens[1].to_i
mat = Array.new(n) { |i| tokens[2 + i * m, m].map(&:to_i) }
argmins = smawk((0...n).to_a, (0...m).to_a) { |r, c| mat[r][c] }
argmins.each_with_index { |c, r| puts "#{c} #{mat[r][c]}" }`,
  },
  practiceProblems: [
    {
      id: 'ch74-p1',
      tier: 'Warmup',
      ratingRange: '2400–2700',
      title: 'All-Row Minima of an Implicit Quadratic Monge Matrix in O(N + M)',
      statement:
        'You are given non-decreasing integer arrays A[0..N-1], B[0..M-1], and an arbitrary offset array C[0..M-1]. For each row i (0 <= i < N), output min_{0 <= j < M} ((A[i] - B[j])^2 + C[j]) in O(N + M) time without materializing the N x M matrix.',
      constraints: '1 <= N, M <= 2 * 10^5; -10^9 <= A[i], B[j], C[j] <= 10^9; A, B non-decreasing',
      sampleInput: `4 5\n1 4 8 12\n0 3 7 10 15\n1 0 2 1 0`,
      sampleOutput: `2 1 3 5`,
      hints: [
        'Because A and B are non-decreasing, -2 * A[i] * B[j] satisfies the quadrangle inequality regardless of C[j], making M(i, j) = (A[i] - B[j])^2 + C[j] totally monotone.',
        'Evaluate M(i, j) lazily on the fly inside SMAWK REDUCE and INTERPOLATE callbacks in O(1) per query.',
      ],
      solutions: {
        cpp20: `#include <iostream>
#include <vector>

using namespace std;

template <class Eval>
vector<int> smawk(int n, int m, Eval eval) {
    auto rec = [&](auto& self, const vector<int>& rows, const vector<int>& cols) -> vector<int> {
        int rsz = static_cast<int>(rows.size());
        if (rsz == 0) return {};
        vector<int> stk;
        stk.reserve(rsz);
        for (int c : cols) {
            while (!stk.empty()) {
                int r = rows[stk.size() - 1];
                if (eval(r, stk.back()) <= eval(r, c)) break;
                stk.pop_back();
            }
            if (static_cast<int>(stk.size()) < rsz) stk.push_back(c);
        }
        if (rsz == 1) return {stk[0]};
        vector<int> odd_rows;
        odd_rows.reserve(rsz / 2);
        for (int i = 1; i < rsz; i += 2) odd_rows.push_back(rows[i]);
        vector<int> sub = self(self, odd_rows, stk);
        vector<int> ans(rsz, 0);
        int ptr = 0;
        for (int i = 0; i < rsz; i += 2) {
            int lo = ptr, hi;
            if (i + 1 < rsz) {
                int target = sub[i >> 1];
                while (stk[ptr] != target) ++ptr;
                hi = ptr;
                ans[i + 1] = target;
            } else {
                hi = static_cast<int>(stk.size()) - 1;
            }
            int best_c = stk[lo];
            auto best_v = eval(rows[i], best_c);
            for (int k = lo + 1; k <= hi; ++k) {
                int c = stk[k];
                auto v = eval(rows[i], c);
                if (v < best_v) {
                    best_v = v;
                    best_c = c;
                }
            }
            ans[i] = best_c;
        }
        return ans;
    };
    vector<int> rows(n), cols(m);
    for (int i = 0; i < n; ++i) rows[i] = i;
    for (int j = 0; j < m; ++j) cols[j] = j;
    return rec(rec, rows, cols);
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, m;
    if (!(cin >> n >> m)) return 0;
    vector<long long> a(n), b(m), c(m);
    for (int i = 0; i < n; ++i) cin >> a[i];
    for (int j = 0; j < m; ++j) cin >> b[j];
    for (int j = 0; j < m; ++j) cin >> c[j];

    auto eval = [&](int i, int j) -> __int128 {
        __int128 d = static_cast<__int128>(a[i]) - b[j];
        return d * d + c[j];
    };
    vector<int> argmins = smawk(n, m, eval);
    for (int i = 0; i < n; ++i) {
        long long ans = static_cast<long long>(eval(i, argmins[i]));
        cout << ans << (i + 1 == n ? '\\n' : ' ');
    }
    return 0;
}`,
        rust: `use std::io::{self, Read};

fn smawk_rec<F>(rows: &[usize], cols: &[usize], eval: &F) -> Vec<usize>
where
    F: Fn(usize, usize) -> i128,
{
    let rsz = rows.len();
    if rsz == 0 {
        return Vec::new();
    }
    let mut stk: Vec<usize> = Vec::with_capacity(rsz);
    for &c in cols {
        while let Some(&top) = stk.last() {
            let r = rows[stk.len() - 1];
            if eval(r, top) <= eval(r, c) {
                break;
            }
            stk.pop();
        }
        if stk.len() < rsz {
            stk.push(c);
        }
    }
    if rsz == 1 {
        return vec![stk[0]];
    }
    let odd_rows: Vec<usize> = rows.iter().skip(1).step_by(2).copied().collect();
    let sub = smawk_rec(&odd_rows, &stk, eval);
    let mut ans = vec![0usize; rsz];
    let mut ptr = 0usize;
    let mut i = 0usize;
    while i < rsz {
        let lo = ptr;
        let hi = if i + 1 < rsz {
            let target = sub[i >> 1];
            while stk[ptr] != target {
                ptr += 1;
            }
            ans[i + 1] = target;
            ptr
        } else {
            stk.len() - 1
        };
        let mut best_c = stk[lo];
        let mut best_v = eval(rows[i], best_c);
        for &c in &stk[(lo + 1)..=hi] {
            let v = eval(rows[i], c);
            if v < best_v {
                best_v = v;
                best_c = c;
            }
        }
        ans[i] = best_c;
        i += 2;
    }
    ans
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let n: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };
    let m: usize = it.next().unwrap().parse().unwrap();
    let a: Vec<i128> = (0..n).map(|_| it.next().unwrap().parse().unwrap()).collect();
    let b: Vec<i128> = (0..m).map(|_| it.next().unwrap().parse().unwrap()).collect();
    let c: Vec<i128> = (0..m).map(|_| it.next().unwrap().parse().unwrap()).collect();
    let eval = |i: usize, j: usize| -> i128 {
        let d = a[i] - b[j];
        d * d + c[j]
    };
    let rows: Vec<usize> = (0..n).collect();
    let cols: Vec<usize> = (0..m).collect();
    let arg = smawk_rec(&rows, &cols, &eval);
    let out: Vec<String> = (0..n).map(|i| eval(i, arg[i]).to_string()).collect();
    println!("{}", out.join(" "));
}`,
        java21: `import java.io.IOException;
import java.io.InputStream;

public class Main {
    static class FastScanner {
        private final InputStream in = System.in;
        private final byte[] buffer = new byte[1 << 16];
        private int ptr = 0, len = 0;

        private int readByte() throws IOException {
            if (ptr >= len) {
                len = in.read(buffer);
                ptr = 0;
                if (len <= 0) return -1;
            }
            return buffer[ptr++];
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
            long val = 0;
            while (c > ' ') {
                val = val * 10 + (c - '0');
                c = readByte();
            }
            return val * sign;
        }
    }

    static long[] A, B, C;

    static long eval(int i, int j) {
        long d = A[i] - B[j];
        return d * d + C[j];
    }

    static int[] smawkRec(int[] rows, int[] cols) {
        int rsz = rows.length;
        if (rsz == 0) return new int[0];
        int[] stk = new int[rsz];
        int top = 0;
        for (int c : cols) {
            while (top > 0) {
                int r = rows[top - 1];
                if (eval(r, stk[top - 1]) <= eval(r, c)) break;
                top--;
            }
            if (top < rsz) stk[top++] = c;
        }
        int[] red = new int[top];
        System.arraycopy(stk, 0, red, 0, top);
        if (rsz == 1) return new int[]{red[0]};

        int[] oddRows = new int[rsz / 2];
        for (int i = 1, k = 0; i < rsz; i += 2) oddRows[k++] = rows[i];
        int[] sub = smawkRec(oddRows, red);

        int[] ans = new int[rsz];
        int ptr = 0;
        for (int i = 0; i < rsz; i += 2) {
            int lo = ptr, hi;
            if (i + 1 < rsz) {
                int target = sub[i >> 1];
                while (red[ptr] != target) ptr++;
                hi = ptr;
                ans[i + 1] = target;
            } else {
                hi = top - 1;
            }
            int bestC = red[lo];
            long bestV = eval(rows[i], bestC);
            for (int k = lo + 1; k <= hi; k++) {
                int c = red[k];
                long v = eval(rows[i], c);
                if (v < bestV) {
                    bestV = v;
                    bestC = c;
                }
            }
            ans[i] = bestC;
        }
        return ans;
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        long nVal = fs.nextLong();
        if (nVal == Long.MIN_VALUE) return;
        int n = (int) nVal, m = (int) fs.nextLong();
        A = new long[n];
        B = new long[m];
        C = new long[m];
        for (int i = 0; i < n; i++) A[i] = fs.nextLong();
        for (int j = 0; j < m; j++) B[j] = fs.nextLong();
        for (int j = 0; j < m; j++) C[j] = fs.nextLong();
        int[] rows = new int[n], cols = new int[m];
        for (int i = 0; i < n; i++) rows[i] = i;
        for (int j = 0; j < m; j++) cols[j] = j;
        int[] arg = smawkRec(rows, cols);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) {
            if (i > 0) sb.append(' ');
            sb.append(eval(i, arg[i]));
        }
        System.out.println(sb);
    }
}`,
        python3: `import sys

sys.setrecursionlimit(200000)


def smawk(rows: list[int], cols: list[int], eval_fn) -> list[int]:
    rsz = len(rows)
    if rsz == 0:
        return []
    stk: list[int] = []
    for c in cols:
        while stk:
            r = rows[len(stk) - 1]
            if eval_fn(r, stk[-1]) <= eval_fn(r, c):
                break
            stk.pop()
        if len(stk) < rsz:
            stk.append(c)
    if rsz == 1:
        return [stk[0]]
    sub = smawk(rows[1::2], stk, eval_fn)
    ans = [0] * rsz
    ptr = 0
    for i in range(0, rsz, 2):
        lo = ptr
        if i + 1 < rsz:
            target = sub[i >> 1]
            while stk[ptr] != target:
                ptr += 1
            hi = ptr
            ans[i + 1] = target
        else:
            hi = len(stk) - 1
        best_c = stk[lo]
        best_v = eval_fn(rows[i], best_c)
        for k in range(lo + 1, hi + 1):
            c = stk[k]
            v = eval_fn(rows[i], c)
            if v < best_v:
                best_v = v
                best_c = c
        ans[i] = best_c
    return ans


def main() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    m = int(data[1])
    a = list(map(int, data[2 : 2 + n]))
    b = list(map(int, data[2 + n : 2 + n + m]))
    c = list(map(int, data[2 + n + m : 2 + n + 2 * m]))
    eval_fn = lambda i, j: (a[i] - b[j]) * (a[i] - b[j]) + c[j]
    arg = smawk(list(range(n)), list(range(m)), eval_fn)
    print(" ".join(str(eval_fn(i, arg[i])) for i in range(n)))


if __name__ == "__main__":
    main()`,
        ruby: `def smawk(rows, cols, &eval_fn)
  rsz = rows.length
  return [] if rsz == 0

  stk = []
  cols.each do |c|
    while !stk.empty?
      r = rows[stk.length - 1]
      break if eval_fn.call(r, stk[-1]) <= eval_fn.call(r, c)
      stk.pop
    end
    stk << c if stk.length < rsz
  end
  return [stk[0]] if rsz == 1

  odd_rows = []
  i = 1
  while i < rsz
    odd_rows << rows[i]
    i += 2
  end
  sub = smawk(odd_rows, stk, &eval_fn)
  ans = Array.new(rsz, 0)
  ptr = 0
  i = 0
  while i < rsz
    lo = ptr
    if i + 1 < rsz
      target = sub[i >> 1]
      ptr += 1 while stk[ptr] != target
      hi = ptr
      ans[i + 1] = target
    else
      hi = stk.length - 1
    end
    best_c = stk[lo]
    best_v = eval_fn.call(rows[i], best_c)
    ((lo + 1)..hi).each do |k|
      c = stk[k]
      v = eval_fn.call(rows[i], c)
      if v < best_v
        best_v = v
        best_c = c
      end
    end
    ans[i] = best_c
    i += 2
  end
  ans
end

tokens = STDIN.read.split
return if tokens.empty?
n = tokens[0].to_i
m = tokens[1].to_i
a = tokens[2, n].map(&:to_i)
b = tokens[2 + n, m].map(&:to_i)
c = tokens[2 + n + m, m].map(&:to_i)
eval_fn = ->(i, j) { d = a[i] - b[j]; d * d + c[j] }
arg = smawk((0...n).to_a, (0...m).to_a, &eval_fn)
puts((0...n).map { |i| eval_fn.call(i, arg[i]) }.join(" "))`,
      },
    },
    {
      id: 'ch74-p2',
      tier: 'Standard',
      ratingRange: '2600–2900',
      title: 'Min-Plus Convolution with Convex Sequence in O(N + M)',
      statement:
        'Given an arbitrary integer array A[0..N-1] and a convex integer array B[0..M-1] (meaning B[i+1] - B[i] is non-decreasing), compute C[k] = min_{0 <= j < N, 0 <= k - j < M} (A[j] + B[k - j]) for all 0 <= k <= N + M - 2 in O(N + M) time.',
      constraints: '1 <= N, M <= 2 * 10^5; -10^9 <= A[j], B[d] <= 10^9',
      sampleInput: `3 3\n3 1 4\n5 1 2`,
      sampleOutput: `8 4 2 3 6`,
      hints: [
        'Using +INF outside [0, M-1] breaks 2x2 total monotonicity along the staircase diagonal.',
        'Extend B linearly outside [0, M-1] with steep slope BIG = 10^10 (B_ext(d) = B[0] - d * BIG for d < 0, B[M-1] + (d - (M - 1)) * BIG for d >= M) so W(k, j) = A[j] + B_ext(k - j) is globally Monge, then run static SMAWK.',
      ],
      solutions: {
        cpp20: `#include <iostream>
#include <vector>

using namespace std;

template <class Eval>
vector<int> smawk(int n, int m, Eval eval) {
    auto rec = [&](auto& self, const vector<int>& rows, const vector<int>& cols) -> vector<int> {
        int rsz = static_cast<int>(rows.size());
        if (rsz == 0) return {};
        vector<int> stk;
        stk.reserve(rsz);
        for (int c : cols) {
            while (!stk.empty()) {
                int r = rows[stk.size() - 1];
                if (eval(r, stk.back()) <= eval(r, c)) break;
                stk.pop_back();
            }
            if (static_cast<int>(stk.size()) < rsz) stk.push_back(c);
        }
        if (rsz == 1) return {stk[0]};
        vector<int> odd_rows;
        odd_rows.reserve(rsz / 2);
        for (int i = 1; i < rsz; i += 2) odd_rows.push_back(rows[i]);
        vector<int> sub = self(self, odd_rows, stk);
        vector<int> ans(rsz, 0);
        int ptr = 0;
        for (int i = 0; i < rsz; i += 2) {
            int lo = ptr, hi;
            if (i + 1 < rsz) {
                int target = sub[i >> 1];
                while (stk[ptr] != target) ++ptr;
                hi = ptr;
                ans[i + 1] = target;
            } else {
                hi = static_cast<int>(stk.size()) - 1;
            }
            int best_c = stk[lo];
            long long best_v = eval(rows[i], best_c);
            for (int k = lo + 1; k <= hi; ++k) {
                int c = stk[k];
                long long v = eval(rows[i], c);
                if (v < best_v) {
                    best_v = v;
                    best_c = c;
                }
            }
            ans[i] = best_c;
        }
        return ans;
    };
    vector<int> rows(n), cols(m);
    for (int i = 0; i < n; ++i) rows[i] = i;
    for (int j = 0; j < m; ++j) cols[j] = j;
    return rec(rec, rows, cols);
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, m;
    if (!(cin >> n >> m)) return 0;
    vector<long long> a(n), b(m);
    for (int i = 0; i < n; ++i) cin >> a[i];
    for (int j = 0; j < m; ++j) cin >> b[j];

    constexpr long long BIG = 10000000000LL;
    auto eval = [&](int k, int j) -> long long {
        int d = k - j;
        long long bd;
        if (d < 0) bd = b[0] - static_cast<long long>(d) * BIG;
        else if (d >= m) bd = b[m - 1] + static_cast<long long>(d - (m - 1)) * BIG;
        else bd = b[d];
        return a[j] + bd;
    };
    int len = n + m - 1;
    vector<int> argmins = smawk(len, n, eval);
    for (int k = 0; k < len; ++k) {
        cout << eval(k, argmins[k]) << (k + 1 == len ? '\\n' : ' ');
    }
    return 0;
}`,
        rust: `use std::io::{self, Read};

fn smawk_rec<F>(rows: &[usize], cols: &[usize], eval: &F) -> Vec<usize>
where
    F: Fn(usize, usize) -> i64,
{
    let rsz = rows.len();
    if rsz == 0 {
        return Vec::new();
    }
    let mut stk: Vec<usize> = Vec::with_capacity(rsz);
    for &c in cols {
        while let Some(&top) = stk.last() {
            let r = rows[stk.len() - 1];
            if eval(r, top) <= eval(r, c) {
                break;
            }
            stk.pop();
        }
        if stk.len() < rsz {
            stk.push(c);
        }
    }
    if rsz == 1 {
        return vec![stk[0]];
    }
    let odd_rows: Vec<usize> = rows.iter().skip(1).step_by(2).copied().collect();
    let sub = smawk_rec(&odd_rows, &stk, eval);
    let mut ans = vec![0usize; rsz];
    let mut ptr = 0usize;
    let mut i = 0usize;
    while i < rsz {
        let lo = ptr;
        let hi = if i + 1 < rsz {
            let target = sub[i >> 1];
            while stk[ptr] != target {
                ptr += 1;
            }
            ans[i + 1] = target;
            ptr
        } else {
            stk.len() - 1
        };
        let mut best_c = stk[lo];
        let mut best_v = eval(rows[i], best_c);
        for &c in &stk[(lo + 1)..=hi] {
            let v = eval(rows[i], c);
            if v < best_v {
                best_v = v;
                best_c = c;
            }
        }
        ans[i] = best_c;
        i += 2;
    }
    ans
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let n: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };
    let m: usize = it.next().unwrap().parse().unwrap();
    let a: Vec<i64> = (0..n).map(|_| it.next().unwrap().parse().unwrap()).collect();
    let b: Vec<i64> = (0..m).map(|_| it.next().unwrap().parse().unwrap()).collect();
    const BIG: i64 = 10_000_000_000;
    let eval = |k: usize, j: usize| -> i64 {
        let d = k as i64 - j as i64;
        let bd = if d < 0 {
            b[0] - d * BIG
        } else if d >= m as i64 {
            b[m - 1] + (d - (m as i64 - 1)) * BIG
        } else {
            b[d as usize]
        };
        a[j] + bd
    };
    let len = n + m - 1;
    let rows: Vec<usize> = (0..len).collect();
    let cols: Vec<usize> = (0..n).collect();
    let arg = smawk_rec(&rows, &cols, &eval);
    let out: Vec<String> = (0..len).map(|k| eval(k, arg[k]).to_string()).collect();
    println!("{}", out.join(" "));
}`,
        java21: `import java.io.IOException;
import java.io.InputStream;

public class Main {
    static class FastScanner {
        private final InputStream in = System.in;
        private final byte[] buffer = new byte[1 << 16];
        private int ptr = 0, len = 0;

        private int readByte() throws IOException {
            if (ptr >= len) {
                len = in.read(buffer);
                ptr = 0;
                if (len <= 0) return -1;
            }
            return buffer[ptr++];
        }

        long nextLong() throws IOException {
            int c;
            do {
                c = readByte();
                if (c == -1) return Long.MIN_VALUE;
            } while (c <= ' ');
            long sign = 1;
            if (c == '-') { sign = -1; c = readByte(); }
            long val = 0;
            while (c > ' ') { val = val * 10 + (c - '0'); c = readByte(); }
            return val * sign;
        }
    }

    static final long BIG = 10000000000L;
    static long[] A, B;
    static int M;

    static long eval(int k, int j) {
        int d = k - j;
        long bd;
        if (d < 0) bd = B[0] - (long) d * BIG;
        else if (d >= M) bd = B[M - 1] + (long) (d - (M - 1)) * BIG;
        else bd = B[d];
        return A[j] + bd;
    }

    static int[] smawkRec(int[] rows, int[] cols) {
        int rsz = rows.length;
        if (rsz == 0) return new int[0];
        int[] stk = new int[rsz];
        int top = 0;
        for (int c : cols) {
            while (top > 0) {
                int r = rows[top - 1];
                if (eval(r, stk[top - 1]) <= eval(r, c)) break;
                top--;
            }
            if (top < rsz) stk[top++] = c;
        }
        int[] red = new int[top];
        System.arraycopy(stk, 0, red, 0, top);
        if (rsz == 1) return new int[]{red[0]};

        int[] oddRows = new int[rsz / 2];
        for (int i = 1, k = 0; i < rsz; i += 2) oddRows[k++] = rows[i];
        int[] sub = smawkRec(oddRows, red);

        int[] ans = new int[rsz];
        int ptr = 0;
        for (int i = 0; i < rsz; i += 2) {
            int lo = ptr, hi;
            if (i + 1 < rsz) {
                int target = sub[i >> 1];
                while (red[ptr] != target) ptr++;
                hi = ptr;
                ans[i + 1] = target;
            } else {
                hi = top - 1;
            }
            int bestC = red[lo];
            long bestV = eval(rows[i], bestC);
            for (int k = lo + 1; k <= hi; k++) {
                int c = red[k];
                long v = eval(rows[i], c);
                if (v < bestV) { bestV = v; bestC = c; }
            }
            ans[i] = bestC;
        }
        return ans;
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        long nVal = fs.nextLong();
        if (nVal == Long.MIN_VALUE) return;
        int n = (int) nVal;
        M = (int) fs.nextLong();
        A = new long[n];
        B = new long[M];
        for (int i = 0; i < n; i++) A[i] = fs.nextLong();
        for (int j = 0; j < M; j++) B[j] = fs.nextLong();
        int len = n + M - 1;
        int[] rows = new int[len], cols = new int[n];
        for (int i = 0; i < len; i++) rows[i] = i;
        for (int j = 0; j < n; j++) cols[j] = j;
        int[] arg = smawkRec(rows, cols);
        StringBuilder sb = new StringBuilder();
        for (int k = 0; k < len; k++) {
            if (k > 0) sb.append(' ');
            sb.append(eval(k, arg[k]));
        }
        System.out.println(sb);
    }
}`,
        python3: `import sys

sys.setrecursionlimit(200000)


def smawk(rows: list[int], cols: list[int], eval_fn) -> list[int]:
    rsz = len(rows)
    if rsz == 0:
        return []
    stk: list[int] = []
    for c in cols:
        while stk:
            r = rows[len(stk) - 1]
            if eval_fn(r, stk[-1]) <= eval_fn(r, c):
                break
            stk.pop()
        if len(stk) < rsz:
            stk.append(c)
    if rsz == 1:
        return [stk[0]]
    sub = smawk(rows[1::2], stk, eval_fn)
    ans = [0] * rsz
    ptr = 0
    for i in range(0, rsz, 2):
        lo = ptr
        if i + 1 < rsz:
            target = sub[i >> 1]
            while stk[ptr] != target:
                ptr += 1
            hi = ptr
            ans[i + 1] = target
        else:
            hi = len(stk) - 1
        best_c = stk[lo]
        best_v = eval_fn(rows[i], best_c)
        for k in range(lo + 1, hi + 1):
            c = stk[k]
            v = eval_fn(rows[i], c)
            if v < best_v:
                best_v = v
                best_c = c
        ans[i] = best_c
    return ans


def main() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    m = int(data[1])
    a = list(map(int, data[2 : 2 + n]))
    b = list(map(int, data[2 + n : 2 + n + m]))
    big = 10_000_000_000

    def eval_fn(k: int, j: int) -> int:
        d = k - j
        if d < 0:
            bd = b[0] - d * big
        elif d >= m:
            bd = b[m - 1] + (d - (m - 1)) * big
        else:
            bd = b[d]
        return a[j] + bd

    total_len = n + m - 1
    arg = smawk(list(range(total_len)), list(range(n)), eval_fn)
    print(" ".join(str(eval_fn(k, arg[k])) for k in range(total_len)))


if __name__ == "__main__":
    main()`,
        ruby: `def smawk(rows, cols, &eval_fn)
  rsz = rows.length
  return [] if rsz == 0

  stk = []
  cols.each do |c|
    while !stk.empty?
      r = rows[stk.length - 1]
      break if eval_fn.call(r, stk[-1]) <= eval_fn.call(r, c)
      stk.pop
    end
    stk << c if stk.length < rsz
  end
  return [stk[0]] if rsz == 1

  odd_rows = []
  i = 1
  while i < rsz
    odd_rows << rows[i]
    i += 2
  end
  sub = smawk(odd_rows, stk, &eval_fn)
  ans = Array.new(rsz, 0)
  ptr = 0
  i = 0
  while i < rsz
    lo = ptr
    if i + 1 < rsz
      target = sub[i >> 1]
      ptr += 1 while stk[ptr] != target
      hi = ptr
      ans[i + 1] = target
    else
      hi = stk.length - 1
    end
    best_c = stk[lo]
    best_v = eval_fn.call(rows[i], best_c)
    ((lo + 1)..hi).each do |k|
      c = stk[k]
      v = eval_fn.call(rows[i], c)
      if v < best_v
        best_v = v
        best_c = c
      end
    end
    ans[i] = best_c
    i += 2
  end
  ans
end

tokens = STDIN.read.split
return if tokens.empty?
n = tokens[0].to_i
m = tokens[1].to_i
a = tokens[2, n].map(&:to_i)
b = tokens[2 + n, m].map(&:to_i)
big = 10_000_000_000

eval_fn = lambda do |k, j|
  d = k - j
  bd = if d < 0
         b[0] - d * big
       elsif d >= m
         b[m - 1] + (d - (m - 1)) * big
       else
         b[d]
       end
  a[j] + bd
end

total_len = n + m - 1
arg = smawk((0...total_len).to_a, (0...n).to_a, &eval_fn)
puts((0...total_len).map { |k| eval_fn.call(k, arg[k]) }.join(" "))`,
      },
    },
    {
      id: 'ch74-p3',
      tier: 'Boss',
      ratingRange: '2800–3300+',
      title: 'Linear-Time 1D/1D Concave DP via Wilber / LARSCH Batch-SMAWK',
      statement:
        'Given N non-decreasing coordinates X[1..N] (X[0] = 0) and a setup penalty C >= 0, compute dp[N] = min_{0 <= j < N} (dp[j] + (X[N] - X[j])^2 + C) where dp[i] = min_{0 <= j < i} (dp[j] + (X[i] - X[j])^2 + C) in strict O(N) time without any O(log N) factor.',
      constraints: '1 <= N <= 2 * 10^5; 0 <= X[1] <= ... <= X[N] <= 10^6; 0 <= C <= 10^12',
      sampleInput: `4 10\n1 3 6 10`,
      sampleOutput: `64`,
      hints: [
        'Because cost(j, i) = (X[i] - X[j])^2 + C satisfies the Monge quadrangle inequality, columns dp[j] + cost(j, i) are totally monotone.',
        'Use Wilber’s batch-SMAWK algorithm: maintain frontier [l..c], optimistically solve rows [c+1..p] against columns [l..c] (p = min(n, 2c - l + 1)), commit all rows if no internal candidate in [c+1..p-1] beats row p, otherwise commit dp[c+1], save partial minima into f[], and advance l = c + 1, c += 1.',
      ],
      solutions: {
        cpp20: `#include <algorithm>
#include <iostream>
#include <vector>

using namespace std;

template <class Eval>
vector<int> smawk_rect(const vector<int>& rows, const vector<int>& cols, Eval eval) {
    auto rec = [&](auto& self, const vector<int>& rs, const vector<int>& cs) -> vector<int> {
        int rsz = static_cast<int>(rs.size());
        if (rsz == 0) return {};
        vector<int> stk;
        stk.reserve(rsz);
        for (int c : cs) {
            while (!stk.empty()) {
                int r = rs[stk.size() - 1];
                if (eval(r, stk.back()) <= eval(r, c)) break;
                stk.pop_back();
            }
            if (static_cast<int>(stk.size()) < rsz) stk.push_back(c);
        }
        if (rsz == 1) return {stk[0]};
        vector<int> odd_rs;
        odd_rs.reserve(rsz / 2);
        for (int i = 1; i < rsz; i += 2) odd_rs.push_back(rs[i]);
        vector<int> sub = self(self, odd_rs, stk);
        vector<int> ans(rsz, 0);
        int ptr = 0;
        for (int i = 0; i < rsz; i += 2) {
            int lo = ptr, hi;
            if (i + 1 < rsz) {
                int target = sub[i >> 1];
                while (stk[ptr] != target) ++ptr;
                hi = ptr;
                ans[i + 1] = target;
            } else {
                hi = static_cast<int>(stk.size()) - 1;
            }
            int best_c = stk[lo];
            auto best_v = eval(rs[i], best_c);
            for (int k = lo + 1; k <= hi; ++k) {
                int c = stk[k];
                auto v = eval(rs[i], c);
                if (v < best_v) {
                    best_v = v;
                    best_c = c;
                }
            }
            ans[i] = best_c;
        }
        return ans;
    };
    return rec(rec, rows, cols);
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    long long c_cost;
    if (!(cin >> n >> c_cost)) return 0;
    vector<long long> x(n + 1, 0);
    for (int i = 1; i <= n; ++i) cin >> x[i];

    auto w = [&](int j, int i) -> __int128 {
        __int128 d = static_cast<__int128>(x[i]) - x[j];
        return d * d + c_cost;
    };

    const __int128 INF = static_cast<__int128>(4e18) * static_cast<__int128>(4e12);
    vector<__int128> dp(n + 1, INF), f(n + 1, INF);
    dp[0] = 0;
    int l = 0, c = 0;
    while (c < n) {
        int p = min(n, 2 * c - l + 1);
        vector<int> rows(p - c), cols(c - l + 1);
        for (int i = 0; i < p - c; ++i) rows[i] = c + 1 + i;
        for (int j = 0; j < c - l + 1; ++j) cols[j] = l + j;
        vector<int> arg = smawk_rect(rows, cols, [&](int r, int col) {
            return dp[col] + w(col, r);
        });
        vector<__int128> g(rows.size());
        for (size_t idx = 0; idx < rows.size(); ++idx) {
            int r = rows[idx];
            g[idx] = min(f[r], dp[arg[idx]] + w(arg[idx], r));
        }
        __int128 h_best = INF;
        for (int k = c + 1; k < p; ++k) {
            h_best = min(h_best, g[k - (c + 1)] + w(k, p));
        }
        if (h_best >= g.back()) {
            for (size_t idx = 0; idx < rows.size(); ++idx) dp[rows[idx]] = g[idx];
            c = p;
        } else {
            dp[c + 1] = g[0];
            for (size_t idx = 1; idx + 1 < rows.size(); ++idx) {
                int r = rows[idx];
                f[r] = min(f[r], g[idx]);
            }
            l = c + 1;
            ++c;
        }
    }
    cout << static_cast<long long>(dp[n]) << "\\n";
    return 0;
}`,
        rust: `use std::io::{self, Read};

fn smawk_rect<F>(rows: &[usize], cols: &[usize], eval: &F) -> Vec<usize>
where
    F: Fn(usize, usize) -> i128,
{
    let rsz = rows.len();
    if rsz == 0 {
        return Vec::new();
    }
    let mut stk: Vec<usize> = Vec::with_capacity(rsz);
    for &c in cols {
        while let Some(&top) = stk.last() {
            let r = rows[stk.len() - 1];
            if eval(r, top) <= eval(r, c) {
                break;
            }
            stk.pop();
        }
        if stk.len() < rsz {
            stk.push(c);
        }
    }
    if rsz == 1 {
        return vec![stk[0]];
    }
    let odd_rows: Vec<usize> = rows.iter().skip(1).step_by(2).copied().collect();
    let sub = smawk_rect(&odd_rows, &stk, eval);
    let mut ans = vec![0usize; rsz];
    let mut ptr = 0usize;
    let mut i = 0usize;
    while i < rsz {
        let lo = ptr;
        let hi = if i + 1 < rsz {
            let target = sub[i >> 1];
            while stk[ptr] != target {
                ptr += 1;
            }
            ans[i + 1] = target;
            ptr
        } else {
            stk.len() - 1
        };
        let mut best_c = stk[lo];
        let mut best_v = eval(rows[i], best_c);
        for &c in &stk[(lo + 1)..=hi] {
            let v = eval(rows[i], c);
            if v < best_v {
                best_v = v;
                best_c = c;
            }
        }
        ans[i] = best_c;
        i += 2;
    }
    ans
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let n: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };
    let c_cost: i128 = it.next().unwrap().parse().unwrap();
    let mut x = vec![0i128; n + 1];
    for i in 1..=n {
        x[i] = it.next().unwrap().parse().unwrap();
    }
    let w = |j: usize, i: usize| -> i128 {
        let d = x[i] - x[j];
        d * d + c_cost
    };
    const INF: i128 = 1_000_000_000_000_000_000_000_000_000_000;
    let mut dp = vec![INF; n + 1];
    let mut f = vec![INF; n + 1];
    dp[0] = 0;
    let mut l = 0usize;
    let mut c = 0usize;
    while c < n {
        let p = n.min(2 * c - l + 1);
        let rows: Vec<usize> = ((c + 1)..=p).collect();
        let cols: Vec<usize> = (l..=c).collect();
        let arg = smawk_rect(&rows, &cols, &|r, col| dp[col] + w(col, r));
        let mut g = Vec::with_capacity(rows.len());
        for (idx, &r) in rows.iter().enumerate() {
            g.push(f[r].min(dp[arg[idx]] + w(arg[idx], r)));
        }
        let mut h_best = INF;
        for k in (c + 1)..p {
            h_best = h_best.min(g[k - (c + 1)] + w(k, p));
        }
        if h_best >= *g.last().unwrap() {
            for (idx, &r) in rows.iter().enumerate() {
                dp[r] = g[idx];
            }
            c = p;
        } else {
            dp[c + 1] = g[0];
            for idx in 1..(rows.len() - 1) {
                let r = rows[idx];
                f[r] = f[r].min(g[idx]);
            }
            l = c + 1;
            c += 1;
        }
    }
    println!("{}", dp[n]);
}`,
        java21: `import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;

public class Main {
    static class FastScanner {
        private final InputStream in = System.in;
        private final byte[] buffer = new byte[1 << 16];
        private int ptr = 0, len = 0;

        private int readByte() throws IOException {
            if (ptr >= len) {
                len = in.read(buffer);
                ptr = 0;
                if (len <= 0) return -1;
            }
            return buffer[ptr++];
        }

        long nextLong() throws IOException {
            int c;
            do {
                c = readByte();
                if (c == -1) return Long.MIN_VALUE;
            } while (c <= ' ');
            long sign = 1;
            if (c == '-') { sign = -1; c = readByte(); }
            long val = 0;
            while (c > ' ') { val = val * 10 + (c - '0'); c = readByte(); }
            return val * sign;
        }
    }

    static long[] X, dp;
    static long C_COST;

    static long evalCost(int col, int r) {
        long d = X[r] - X[col];
        return dp[col] + d * d + C_COST;
    }

    static int[] smawkRect(int[] rows, int[] cols) {
        int rsz = rows.length;
        if (rsz == 0) return new int[0];
        int[] stk = new int[rsz];
        int top = 0;
        for (int c : cols) {
            while (top > 0) {
                int r = rows[top - 1];
                if (evalCost(stk[top - 1], r) <= evalCost(c, r)) break;
                top--;
            }
            if (top < rsz) stk[top++] = c;
        }
        int[] red = Arrays.copyOf(stk, top);
        if (rsz == 1) return new int[]{red[0]};

        int[] oddRows = new int[rsz / 2];
        for (int i = 1, k = 0; i < rsz; i += 2) oddRows[k++] = rows[i];
        int[] sub = smawkRect(oddRows, red);

        int[] ans = new int[rsz];
        int ptr = 0;
        for (int i = 0; i < rsz; i += 2) {
            int lo = ptr, hi;
            if (i + 1 < rsz) {
                int target = sub[i >> 1];
                while (red[ptr] != target) ptr++;
                hi = ptr;
                ans[i + 1] = target;
            } else {
                hi = top - 1;
            }
            int bestC = red[lo];
            long bestV = evalCost(bestC, rows[i]);
            for (int k = lo + 1; k <= hi; k++) {
                int c = red[k];
                long v = evalCost(c, rows[i]);
                if (v < bestV) { bestV = v; bestC = c; }
            }
            ans[i] = bestC;
        }
        return ans;
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        long nVal = fs.nextLong();
        if (nVal == Long.MIN_VALUE) return;
        int n = (int) nVal;
        C_COST = fs.nextLong();
        X = new long[n + 1];
        for (int i = 1; i <= n; i++) X[i] = fs.nextLong();

        final long INF = Long.MAX_VALUE / 4;
        dp = new long[n + 1];
        long[] f = new long[n + 1];
        Arrays.fill(dp, INF);
        Arrays.fill(f, INF);
        dp[0] = 0;

        int l = 0, c = 0;
        while (c < n) {
            int p = Math.min(n, 2 * c - l + 1);
            int[] rows = new int[p - c];
            int[] cols = new int[c - l + 1];
            for (int i = 0; i < p - c; i++) rows[i] = c + 1 + i;
            for (int j = 0; j < c - l + 1; j++) cols[j] = l + j;
            int[] arg = smawkRect(rows, cols);
            long[] g = new long[rows.length];
            for (int idx = 0; idx < rows.length; idx++) {
                int r = rows[idx];
                g[idx] = Math.min(f[r], evalCost(arg[idx], r));
            }
            long hBest = INF;
            for (int k = c + 1; k < p; k++) {
                long d = X[p] - X[k];
                hBest = Math.min(hBest, g[k - (c + 1)] + d * d + C_COST);
            }
            if (hBest >= g[rows.length - 1]) {
                for (int idx = 0; idx < rows.length; idx++) dp[rows[idx]] = g[idx];
                c = p;
            } else {
                dp[c + 1] = g[0];
                for (int idx = 1; idx + 1 < rows.length; idx++) {
                    int r = rows[idx];
                    f[r] = Math.min(f[r], g[idx]);
                }
                l = c + 1;
                c++;
            }
        }
        System.out.println(dp[n]);
    }
}`,
        python3: `import sys

sys.setrecursionlimit(200000)


def smawk_rect(rows: list[int], cols: list[int], eval_fn) -> list[int]:
    rsz = len(rows)
    if rsz == 0:
        return []
    stk: list[int] = []
    for c in cols:
        while stk:
            r = rows[len(stk) - 1]
            if eval_fn(r, stk[-1]) <= eval_fn(r, c):
                break
            stk.pop()
        if len(stk) < rsz:
            stk.append(c)
    if rsz == 1:
        return [stk[0]]
    sub = smawk_rect(rows[1::2], stk, eval_fn)
    ans = [0] * rsz
    ptr = 0
    for i in range(0, rsz, 2):
        lo = ptr
        if i + 1 < rsz:
            target = sub[i >> 1]
            while stk[ptr] != target:
                ptr += 1
            hi = ptr
            ans[i + 1] = target
        else:
            hi = len(stk) - 1
        best_c = stk[lo]
        best_v = eval_fn(rows[i], best_c)
        for k in range(lo + 1, hi + 1):
            c = stk[k]
            v = eval_fn(rows[i], c)
            if v < best_v:
                best_v = v
                best_c = c
        ans[i] = best_c
    return ans


def main() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    c_cost = int(data[1])
    x = [0] + list(map(int, data[2 : 2 + n]))
    w = lambda j, i: (x[i] - x[j]) * (x[i] - x[j]) + c_cost

    inf = 10**30
    dp = [inf] * (n + 1)
    f = [inf] * (n + 1)
    dp[0] = 0
    l = 0
    c = 0
    while c < n:
        p = min(n, 2 * c - l + 1)
        rows = list(range(c + 1, p + 1))
        cols = list(range(l, c + 1))
        arg = smawk_rect(rows, cols, lambda r, col: dp[col] + w(col, r))
        g = [min(f[r], dp[arg[idx]] + w(arg[idx], r)) for idx, r in enumerate(rows)]
        h_best = inf
        for k in range(c + 1, p):
            val = g[k - (c + 1)] + w(k, p)
            if val < h_best:
                h_best = val
        if h_best >= g[-1]:
            for idx, r in enumerate(rows):
                dp[r] = g[idx]
            c = p
        else:
            dp[c + 1] = g[0]
            for idx in range(1, len(rows) - 1):
                r = rows[idx]
                if g[idx] < f[r]:
                    f[r] = g[idx]
            l = c + 1
            c += 1
    print(dp[n])


if __name__ == "__main__":
    main()`,
        ruby: `def smawk_rect(rows, cols, &eval_fn)
  rsz = rows.length
  return [] if rsz == 0

  stk = []
  cols.each do |c|
    while !stk.empty?
      r = rows[stk.length - 1]
      break if eval_fn.call(r, stk[-1]) <= eval_fn.call(r, c)
      stk.pop
    end
    stk << c if stk.length < rsz
  end
  return [stk[0]] if rsz == 1

  odd_rows = []
  i = 1
  while i < rsz
    odd_rows << rows[i]
    i += 2
  end
  sub = smawk_rect(odd_rows, stk, &eval_fn)
  ans = Array.new(rsz, 0)
  ptr = 0
  i = 0
  while i < rsz
    lo = ptr
    if i + 1 < rsz
      target = sub[i >> 1]
      ptr += 1 while stk[ptr] != target
      hi = ptr
      ans[i + 1] = target
    else
      hi = stk.length - 1
    end
    best_c = stk[lo]
    best_v = eval_fn.call(rows[i], best_c)
    ((lo + 1)..hi).each do |k|
      c = stk[k]
      v = eval_fn.call(rows[i], c)
      if v < best_v
        best_v = v
        best_c = c
      end
    end
    ans[i] = best_c
    i += 2
  end
  ans
end

tokens = STDIN.read.split
return if tokens.empty?
n = tokens[0].to_i
c_cost = tokens[1].to_i
x = [0] + tokens[2, n].map(&:to_i)
w = ->(j, i) { (x[i] - x[j])**2 + c_cost }

inf = 10**30
dp = Array.new(n + 1, inf)
f = Array.new(n + 1, inf)
dp[0] = 0
l = 0
c = 0
while c < n
  p = [n, 2 * c - l + 1].min
  rows = ((c + 1)..p).to_a
  cols = (l..c).to_a
  arg = smawk_rect(rows, cols) { |r, col| dp[col] + w.call(col, r) }
  g = rows.each_with_index.map { |r, idx| [f[r], dp[arg[idx]] + w.call(arg[idx], r)].min }
  h_best = inf
  ((c + 1)...p).each do |k|
    val = g[k - (c + 1)] + w.call(k, p)
    h_best = val if val < h_best
  end
  if h_best >= g[-1]
    rows.each_with_index { |r, idx| dp[r] = g[idx] }
    c = p
  else
    dp[c + 1] = g[0]
    (1...(rows.length - 1)).each do |idx|
      r = rows[idx]
      f[r] = g[idx] if g[idx] < f[r]
    end
    l = c + 1
    c += 1
  end
end

puts dp[n]`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'AtCoder',
      title: 'Library Checker - Min Plus Convolution (Convex and Arbitrary)',
      difficulty: 'Grandmaster',
      url: 'https://judge.yosupo.jp/problem/min_plus_convolution_convex_arbitrary',
      patternNote: 'Global slope extension of convex B reduces banded staircase convolution to static O(N + M) SMAWK.',
    },
    {
      platform: 'AtCoder',
      title: 'ABC218H / AGC Monge DP Speedups',
      difficulty: 'Grandmaster',
      url: 'https://atcoder.jp/contests/abc218/tasks/abc218_h',
      patternNote: 'Concave 1D/1D optimization or Aliens trick paired with linear SMAWK/Wilber DP.',
    },
    {
      platform: 'Codeforces',
      title: 'Ciel and Gondolas (CF 321E)',
      difficulty: '2600',
      url: 'https://codeforces.com/problemset/problem/321/E',
      patternNote: 'Offline matrix Monge D&C layer can be tightened to O(K * N) via SMAWK.',
    },
  ],
  interviewNotes: [
    'SMAWK works on any totally monotone matrix, not only Monge matrices—total monotonicity only demands that in every 2x2 submatrix the row-minima never reverse order.',
    'Because REDUCE trims columns down to at most |rows| in a single O(|cols|) pass, odd-row recursion halves BOTH rows and columns simultaneously, giving T(R, C) = T(R/2, R/2) + O(R + C) = O(R + C).',
    'Wilber’s algorithm achieves the exact same O(N) bound as online LARSCH for 1D/1D quadrangle-inequality DP using only standard offline SMAWK batches and potential Phi = c + l.',
  ],
  projectBlueprint: {
    title: 'Linear-Time Optimal Text Line-Wrapping & Dynamic Quantization Engine',
    tagline: 'Zero-log-factor convex layout optimizer leveraging SMAWK REDUCE/INTERPOLATE and Wilber batch Monge DP',
    stackSummary: 'C++20 / Rust SMAWK Kernel + Convex Extension Convolver + Wilber 1D/1D Engine',
    asciiDiagram:
`[R x C Monge Matrix] ---> [REDUCE Stack (<= R cols)] ---> [Recurse Odd Rows R/2]
                                                                 |
[O(N) 1D Concave DP] <--- [Wilber / LARSCH Batching] <--- [Two-Pointer INTERPOLATE]`,
    milestones: [
      { id: 'm1', title: 'REDUCE & INTERPOLATE Kernel', detail: 'Maintain stack <= |rows| and scan monotonic even-row ranges with a single pointer.' },
      { id: 'm2', title: 'Convex Min-Plus Convolver', detail: 'Extend boundary slopes with dominating +/-BIG linear wings for O(N + M) convolution.' },
      { id: 'm3', title: 'Wilber / LARSCH 1D DP', detail: 'Batch [c+1..p] x [l..c] and test internal takeover at p in strict O(N).' },
    ],
    starterCode: `// Given prefix sums P[0..N], wrap lines with quadratic penalty (P[i] - P[j] - L)^2:
// Cost w(j, i) = (P[i] - P[j] - L)^2 satisfies Monge QI -> solved in O(N) via Wilber Batch-SMAWK.`,
  },
};
