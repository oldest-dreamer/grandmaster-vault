import type { TheoryChapter } from '../../types/vault';

export const CH81_LP_DUALITY_SIMPLEX: TheoryChapter = {
  slug: 'lp-duality-simplex-method',
  topicId: 'th-77',
  title: 'Linear Programming Duality & Simplex Algorithm',
  domain: 'Theoretical & Randomized',
  ratingTier: '2600–3300+',
  usacoDivision: 'Advanced',
  subtitle: 'Two-Phase Dantzig Simplex tableau with Bland’s anti-cycling rule, Strong LP Duality max c^T x = min b^T y, zero-sum matrix games, and flow/covering dualization',
  analogyTitle: 'Walking Polytope Corners While the Dual Certifies the Ceiling',
  analogyBody:
    'A Linear Program (LP) in canonical form maximizes c^T x subject to A x <= b and x >= 0. Geometrically, the feasible region is a convex polytope, and the Fundamental Theorem of Linear Programming guarantees that if an optimal finite solution exists, it is attained at a vertex (basic feasible solution).\n\nDantzig’s Simplex Algorithm introduces slack variables x_{n+i} = b_i - sum_j A_{i,j} x_j >= 0 and walks from vertex to adjacent vertex along polytope edges: in each step, a non-basic variable x_s with positive reduced cost c_s > 0 enters the basis, and the basic variable x_r with the tightest positive ratio b_r / A_{r,s} leaves the basis via a Gauss-Jordan pivot. When some b_i < 0 initially, Phase I introduces an artificial variable x_{n+1} to eliminate the most negative RHS and drives it to zero before optimizing c^T x in Phase II. Breaking ties by smallest variable ID (Bland’s Rule) prevents degenerate cycling.\n\nEven more powerful in competitive programming is Strong LP Duality: max {c^T x : A x <= b, x >= 0} = min {b^T y : A^T y >= c, y >= 0}. Dualizing transposes the constraint matrix A—turning dense covering LPs with M >> N into compact packing LPs, or converting contiguous interval covering constraints (where each column has a single +1/-1 entry in difference form) into circulation / min-cost max-flow!',
  prerequisites: [
    { slug: 'min-cost-max-flow-hungarian', title: 'Min-Cost Max-Flow & Hungarian Algorithm (O(N^3))' },
    { slug: 'xor-basis-gaussian-elimination', title: 'Gaussian Elimination & GF(2) Linear XOR Basis' },
  ],
  traceTitle: 'Simplex Tableau Pivoting on 2D Polytope max 3x1 + 2x2',
  traceSubtitle: 'Tracking slack basis B, entering column s, minimum-ratio leaving row r, and dual prices y',
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Step 1: Initialize Slack Tableau at Origin x = (0, 0)',
      explanation: 'Constraints: 2x1 + x2 <= 18 (slack s1), 2x1 + 3x2 <= 42 (slack s2), 3x1 + x2 <= 24 (slack s3). Objective z = 3x1 + 2x2. Both reduced costs c1 = 3 and c2 = 2 are positive; pick x1 (s = 0) to enter.',
      mode: 'array',
      arrays: [
        {
          name: 'Initial Tableau RHS & Ratios for Entering x1',
          cells: [
            { index: 0, value: 's1=18 (18/2=9)', label: 'row 0', highlight: 'active' },
            { index: 1, value: 's2=42 (42/2=21)', label: 'row 1', highlight: 'neutral' },
            { index: 2, value: 's3=24 (24/3=8*)', label: 'leave r=2', highlight: 'updated' },
            { index: 3, value: 'z = 0', label: 'c=[3, 2]', highlight: 'active' },
          ],
        },
      ],
      variables: { entering: 'x1', leaving: 's3 (ratio 8)', x: '(0, 0)', z: 0 },
    },
    {
      stepNumber: 2,
      title: 'Step 2: Pivot (r=2, s=0) -> Move to Corner (8, 0), Then Enter x2',
      explanation: 'After pivoting x1 into row 2, x = (8, 0) with z = 24. Reduced cost of x2 remains positive (+1); minimum ratio across rows selects s1 (row 0) to leave, moving to (3, 12) with z = 33.',
      mode: 'array',
      arrays: [
        {
          name: 'After Second & Third Pivots Along Polytope Boundary',
          cells: [
            { index: 0, value: '(8, 0) z=24', label: 'pivot 1', highlight: 'neutral' },
            { index: 1, value: '(3, 12) z=33', label: 'pivot 2', highlight: 'updated' },
            { index: 2, value: 'c_red <= 0', label: 'optimal!', highlight: 'active' },
          ],
        },
      ],
      variables: { corner1: '(8, 0) -> 24', corner2: '(3, 12) -> 33', reducedCosts: 'all <= 0' },
    },
    {
      stepNumber: 3,
      title: 'Step 3: Strong Duality Certificate b^T y = 33',
      explanation: 'All reduced costs are non-positive, certifying x* = (3, 12) with max z = 33. The negated slack objective coefficients give optimal dual multipliers y* = (7/4, 1/4, 0) with 18*(7/4) + 42*(1/4) = 33.',
      mode: 'array',
      arrays: [
        {
          name: 'Primal x* and Dual y* Optimality Match',
          cells: [
            { index: 0, value: 'x1* = 3', label: 'primal', highlight: 'updated' },
            { index: 1, value: 'x2* = 12', label: 'primal', highlight: 'updated' },
            { index: 2, value: 'y* = (1.75, 0.25, 0)', label: 'dual', highlight: 'active' },
            { index: 3, value: 'c^T x* = b^T y* = 33', label: 'gap = 0', highlight: 'updated' },
          ],
        },
      ],
      variables: { optimalObjective: '33.000000', primalGap: '0.0', status: 'OPTIMAL' },
    },
  ],
  reductionClues: [
    {
      clue: 'Maximize or minimize a linear objective subject to M <= 60 linear inequalities over N <= 60 continuous variables',
      translation: 'Run Two-Phase Simplex with Bland’s anti-cycling rule directly in O(pivots * M * N).',
    },
    {
      clue: 'Zero-sum two-player matrix game (Minimax Theorem: max_p min_j (p^T M)_j)',
      translation: 'Shift matrix M by +C so all entries > 0, then solve max sum(y_j) s.t. M^T y <= 1, y >= 0; game value is 1 / (sum y_j) - C.',
    },
    {
      clue: 'Minimum-cost covering of contiguous intervals [L_k, R_k] with capacities and per-unit costs',
      translation: 'Dualize the LP (or take consecutive constraint differences): each interval variable has one +1 and one -1, yielding a Min-Cost Circulation / MCMF network.',
    },
    {
      clue: 'LP has N = 5 variables and M = 5000 constraints (A x >= b, min c^T x)',
      translation: 'Pass the Dual LP (max b^T y s.t. A^T y <= c, y >= 0) to Simplex so the tableau has only 5 rows instead of 5000!',
    },
  ],
  timeComplexity: 'O(Pivots * M * N) — typically 2M to 4M pivots in practice',
  spaceComplexity: 'O(M * N) tableau storage',
  pitfalls: [
    {
      type: 'WA',
      title: 'Assuming the Origin x = 0 Is Always Feasible Without Phase I',
      detail: 'Whenever any b_i < 0 in A x <= b, the origin violates constraint i! Always run Phase I by pivoting the most negative b_r row against an artificial variable x_{n+1} with coefficient -1.',
    },
    {
      type: 'TLE',
      title: 'Infinite Degenerate Pivot Cycling Without Bland’s Tie-Breaking Rule',
      detail: 'When b_r == 0 at a degenerate vertex, naive steepest-edge rules can cycle forever. Break ties in entering column and leaving row ratio by smallest original variable ID (Bland’s Rule).',
    },
    {
      type: 'WA',
      title: 'Zero-Sum Game Value Failure When Payoff Matrix Has Non-Positive Entries',
      detail: 'The standard LP reduction max sum(y) s.t. M^T y <= 1 assumes game value v > 0. Always add a constant shift S = -min(M) + 1 to every entry of M first, then subtract S from 1 / sum(y).',
    },
    {
      type: 'TLE',
      title: 'Updating Zero Entries During Gauss-Jordan Tableau Pivots',
      detail: 'Skip rows i with fabs(D[i][s]) <= EPS during pivot(r, s); sparse LP and network matrices have >80% zeros, giving a 5x-10x speedup.',
    },
  ],
  implementations: {
    cpp20: `#include <algorithm>
#include <cmath>
#include <iomanip>
#include <iostream>
#include <limits>
#include <vector>

using namespace std;

static constexpr double EPS = 1e-9;

struct LPSolver {
    int m, n;
    vector<int> N, B;
    vector<vector<double>> D;

    LPSolver(const vector<vector<double>>& A, const vector<double>& b, const vector<double>& c)
        : m((int)b.size()), n((int)c.size()), N(n + 1), B(m), D(m + 2, vector<double>(n + 2, 0.0)) {
        for (int i = 0; i < m; ++i) {
            for (int j = 0; j < n; ++j) D[i][j] = A[i][j];
        }
        for (int i = 0; i < m; ++i) {
            B[i] = n + i;
            D[i][n] = -1.0;
            D[i][n + 1] = b[i];
        }
        for (int j = 0; j < n; ++j) {
            N[j] = j;
            D[m][j] = -c[j];
        }
        N[n] = -1;
        D[m + 1][n] = 1.0;
    }

    void pivot(int r, int s) {
        double inv = 1.0 / D[r][s];
        for (int i = 0; i < m + 2; ++i) {
            if (i == r || fabs(D[i][s]) <= 1e-15) continue;
            for (int j = 0; j < n + 2; ++j) {
                if (j != s) D[i][j] -= D[r][j] * D[i][s] * inv;
            }
        }
        for (int j = 0; j < n + 2; ++j) if (j != s) D[r][j] *= inv;
        for (int i = 0; i < m + 2; ++i) if (i != r) D[i][s] *= -inv;
        D[r][s] = inv;
        swap(B[r], N[s]);
    }

    bool simplex(int phase) {
        int x = m + (phase == 1 ? 1 : 0);
        while (true) {
            int s = -1;
            for (int j = 0; j <= n; ++j) {
                if (phase == 2 && N[j] == -1) continue;
                if (s == -1 || D[x][j] < D[x][s] - EPS || (fabs(D[x][j] - D[x][s]) <= EPS && N[j] < N[s])) {
                    s = j;
                }
            }
            if (D[x][s] > -EPS) return true;
            int r = -1;
            for (int i = 0; i < m; ++i) {
                if (D[i][s] < EPS) continue;
                if (r == -1) {
                    r = i;
                } else {
                    double lhs = D[i][n + 1] / D[i][s];
                    double rhs = D[r][n + 1] / D[r][s];
                    if (lhs < rhs - EPS || (fabs(lhs - rhs) <= EPS && B[i] < B[r])) r = i;
                }
            }
            if (r == -1) return false;
            pivot(r, s);
        }
    }

    // Returns: 1 = optimal, 0 = infeasible, -1 = unbounded
    int solve(double& opt_val, vector<double>& x_out) {
        int r = 0;
        for (int i = 1; i < m; ++i) {
            if (D[i][n + 1] < D[r][n + 1]) r = i;
        }
        if (D[r][n + 1] < -EPS) {
            pivot(r, n);
            if (!simplex(1) || D[m + 1][n + 1] < -EPS) return 0;
            for (int i = 0; i < m; ++i) {
                if (B[i] == -1) {
                    int s = -1;
                    for (int j = 0; j <= n; ++j) {
                        if (s == -1 || D[i][j] < D[i][s] - EPS || (fabs(D[i][j] - D[i][s]) <= EPS && N[j] < N[s])) {
                            s = j;
                        }
                    }
                    pivot(i, s);
                }
            }
        }
        if (!simplex(2)) return -1;
        x_out.assign(n, 0.0);
        for (int i = 0; i < m; ++i) {
            if (B[i] >= 0 && B[i] < n) x_out[B[i]] = D[i][n + 1];
        }
        opt_val = D[m][n + 1];
        return 1;
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    if (!(cin >> n >> m)) return 0;
    vector<double> c(n);
    for (int j = 0; j < n; ++j) cin >> c[j];
    vector<vector<double>> A(m, vector<double>(n));
    vector<double> b(m);
    for (int i = 0; i < m; ++i) {
        for (int j = 0; j < n; ++j) cin >> A[i][j];
        cin >> b[i];
    }
    LPSolver lp(A, b, c);
    double val = 0.0;
    vector<double> sol;
    int st = lp.solve(val, sol);
    if (st == 0) cout << "INFEASIBLE\\n";
    else if (st == -1) cout << "UNBOUNDED\\n";
    else cout << fixed << setprecision(6) << val << '\\n';
    return 0;
}`,
    rust: `use std::io::{self, Read};

const EPS: f64 = 1e-9;

struct LpSolver {
    m: usize,
    n: usize,
    non_basic: Vec<i32>,
    basic: Vec<i32>,
    d: Vec<Vec<f64>>,
}

impl LpSolver {
    fn new(a: &[Vec<f64>], b: &[f64], c: &[f64]) -> Self {
        let m = b.len();
        let n = c.len();
        let mut d = vec![vec![0.0; n + 2]; m + 2];
        let mut non_basic = vec![0i32; n + 1];
        let mut basic = vec![0i32; m];
        for i in 0..m {
            for j in 0..n {
                d[i][j] = a[i][j];
            }
            basic[i] = (n + i) as i32;
            d[i][n] = -1.0;
            d[i][n + 1] = b[i];
        }
        for j in 0..n {
            non_basic[j] = j as i32;
            d[m][j] = -c[j];
        }
        non_basic[n] = -1;
        d[m + 1][n] = 1.0;
        Self { m, n, non_basic, basic, d }
    }

    fn pivot(&mut self, r: usize, s: usize) {
        let inv = 1.0 / self.d[r][s];
        for i in 0..(self.m + 2) {
            if i == r || self.d[i][s].abs() <= 1e-15 {
                continue;
            }
            for j in 0..(self.n + 2) {
                if j != s {
                    self.d[i][j] -= self.d[r][j] * self.d[i][s] * inv;
                }
            }
        }
        for j in 0..(self.n + 2) {
            if j != s {
                self.d[r][j] *= inv;
            }
        }
        for i in 0..(self.m + 2) {
            if i != r {
                self.d[i][s] *= -inv;
            }
        }
        self.d[r][s] = inv;
        std::mem::swap(&mut self.basic[r], &mut self.non_basic[s]);
    }

    fn simplex(&mut self, phase: usize) -> bool {
        let x = self.m + if phase == 1 { 1 } else { 0 };
        loop {
            let mut s: Option<usize> = None;
            for j in 0..=self.n {
                if phase == 2 && self.non_basic[j] == -1 {
                    continue;
                }
                match s {
                    None => s = Some(j),
                    Some(cur) => {
                        if self.d[x][j] < self.d[x][cur] - EPS
                            || ((self.d[x][j] - self.d[x][cur]).abs() <= EPS
                                && self.non_basic[j] < self.non_basic[cur])
                        {
                            s = Some(j);
                        }
                    }
                }
            }
            let s = s.unwrap();
            if self.d[x][s] > -EPS {
                return true;
            }
            let mut r: Option<usize> = None;
            for i in 0..self.m {
                if self.d[i][s] < EPS {
                    continue;
                }
                match r {
                    None => r = Some(i),
                    Some(cur) => {
                        let lhs = self.d[i][self.n + 1] / self.d[i][s];
                        let rhs = self.d[cur][self.n + 1] / self.d[cur][s];
                        if lhs < rhs - EPS
                            || ((lhs - rhs).abs() <= EPS && self.basic[i] < self.basic[cur])
                        {
                            r = Some(i);
                        }
                    }
                }
            }
            match r {
                None => return false,
                Some(row) => self.pivot(row, s),
            }
        }
    }

    fn solve(&mut self) -> Result<f64, &'static str> {
        let mut r = 0usize;
        for i in 1..self.m {
            if self.d[i][self.n + 1] < self.d[r][self.n + 1] {
                r = i;
            }
        }
        if self.d[r][self.n + 1] < -EPS {
            self.pivot(r, self.n);
            if !self.simplex(1) || self.d[self.m + 1][self.n + 1] < -EPS {
                return Err("INFEASIBLE");
            }
            for i in 0..self.m {
                if self.basic[i] == -1 {
                    let mut s = 0usize;
                    for j in 1..=self.n {
                        if self.d[i][j] < self.d[i][s] - EPS
                            || ((self.d[i][j] - self.d[i][s]).abs() <= EPS
                                && self.non_basic[j] < self.non_basic[s])
                        {
                            s = j;
                        }
                    }
                    self.pivot(i, s);
                }
            }
        }
        if !self.simplex(2) {
            return Err("UNBOUNDED");
        }
        Ok(self.d[self.m][self.n + 1])
    }
}

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let n: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };
    let m: usize = it.next().unwrap().parse().unwrap();
    let c: Vec<f64> = (0..n).map(|_| it.next().unwrap().parse().unwrap()).collect();
    let mut a = vec![vec![0.0; n]; m];
    let mut b = vec![0.0; m];
    for i in 0..m {
        for j in 0..n {
            a[i][j] = it.next().unwrap().parse().unwrap();
        }
        b[i] = it.next().unwrap().parse().unwrap();
    }
    let mut lp = LpSolver::new(&a, &b, &c);
    match lp.solve() {
        Ok(v) => println!("{:.6}", v),
        Err(msg) => println!("{}", msg),
    }
}`,
    java21: `import java.io.BufferedInputStream;
import java.io.IOException;
import java.util.Locale;

public class Main {
    static final double EPS = 1e-9;

    static class FastScanner {
        private final BufferedInputStream in = new BufferedInputStream(System.in);
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;

        private int readByte() throws IOException {
            if (ptr >= len) {
                ptr = 0;
                len = in.read(buf);
                if (len <= 0) return -1;
            }
            return buf[ptr++];
        }

        String nextToken() throws IOException {
            int c = readByte();
            while (c >= 0 && c <= 32) c = readByte();
            if (c < 0) return null;
            StringBuilder sb = new StringBuilder();
            while (c > 32) { sb.append((char) c); c = readByte(); }
            return sb.toString();
        }
    }

    static class LPSolver {
        int m, n;
        int[] N, B;
        double[][] D;

        LPSolver(double[][] A, double[] b, double[] c) {
            m = b.length;
            n = c.length;
            N = new int[n + 1];
            B = new int[m];
            D = new double[m + 2][n + 2];
            for (int i = 0; i < m; i++) {
                System.arraycopy(A[i], 0, D[i], 0, n);
                B[i] = n + i;
                D[i][n] = -1.0;
                D[i][n + 1] = b[i];
            }
            for (int j = 0; j < n; j++) {
                N[j] = j;
                D[m][j] = -c[j];
            }
            N[n] = -1;
            D[m + 1][n] = 1.0;
        }

        void pivot(int r, int s) {
            double inv = 1.0 / D[r][s];
            for (int i = 0; i < m + 2; i++) {
                if (i == r || Math.abs(D[i][s]) <= 1e-15) continue;
                for (int j = 0; j < n + 2; j++) {
                    if (j != s) D[i][j] -= D[r][j] * D[i][s] * inv;
                }
            }
            for (int j = 0; j < n + 2; j++) if (j != s) D[r][j] *= inv;
            for (int i = 0; i < m + 2; i++) if (i != r) D[i][s] *= -inv;
            D[r][s] = inv;
            int tmp = B[r]; B[r] = N[s]; N[s] = tmp;
        }

        boolean simplex(int phase) {
            int x = m + (phase == 1 ? 1 : 0);
            while (true) {
                int s = -1;
                for (int j = 0; j <= n; j++) {
                    if (phase == 2 && N[j] == -1) continue;
                    if (s == -1 || D[x][j] < D[x][s] - EPS || (Math.abs(D[x][j] - D[x][s]) <= EPS && N[j] < N[s])) {
                        s = j;
                    }
                }
                if (D[x][s] > -EPS) return true;
                int r = -1;
                for (int i = 0; i < m; i++) {
                    if (D[i][s] < EPS) continue;
                    if (r == -1) r = i;
                    else {
                        double lhs = D[i][n + 1] / D[i][s];
                        double rhs = D[r][n + 1] / D[r][s];
                        if (lhs < rhs - EPS || (Math.abs(lhs - rhs) <= EPS && B[i] < B[r])) r = i;
                    }
                }
                if (r == -1) return false;
                pivot(r, s);
            }
        }

        String solve() {
            int r = 0;
            for (int i = 1; i < m; i++) if (D[i][n + 1] < D[r][n + 1]) r = i;
            if (D[r][n + 1] < -EPS) {
                pivot(r, n);
                if (!simplex(1) || D[m + 1][n + 1] < -EPS) return "INFEASIBLE";
                for (int i = 0; i < m; i++) {
                    if (B[i] == -1) {
                        int s = -1;
                        for (int j = 0; j <= n; j++) {
                            if (s == -1 || D[i][j] < D[i][s] - EPS || (Math.abs(D[i][j] - D[i][s]) <= EPS && N[j] < N[s])) {
                                s = j;
                            }
                        }
                        pivot(i, s);
                    }
                }
            }
            if (!simplex(2)) return "UNBOUNDED";
            return String.format(Locale.US, "%.6f", D[m][n + 1]);
        }
    }

    public static void main(String[] args) throws Exception {
        Locale.setDefault(Locale.US);
        FastScanner fs = new FastScanner();
        String s0 = fs.nextToken();
        if (s0 == null) return;
        int n = Integer.parseInt(s0);
        int m = Integer.parseInt(fs.nextToken());
        double[] c = new double[n];
        for (int j = 0; j < n; j++) c[j] = Double.parseDouble(fs.nextToken());
        double[][] A = new double[m][n];
        double[] b = new double[m];
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) A[i][j] = Double.parseDouble(fs.nextToken());
            b[i] = Double.parseDouble(fs.nextToken());
        }
        System.out.println(new LPSolver(A, b, c).solve());
    }
}`,
    python3: `import sys

sys.setrecursionlimit(200000)
EPS = 1e-9


class LPSolver:
    def __init__(self, A, b, c) -> None:
        self.m = len(b)
        self.n = len(c)
        self.N = list(range(self.n)) + [-1]
        self.B = [self.n + i for i in range(self.m)]
        self.D = [[0.0] * (self.n + 2) for _ in range(self.m + 2)]
        for i in range(self.m):
            for j in range(self.n):
                self.D[i][j] = A[i][j]
            self.D[i][self.n] = -1.0
            self.D[i][self.n + 1] = b[i]
        for j in range(self.n):
            self.D[self.m][j] = -c[j]
        self.D[self.m + 1][self.n] = 1.0

    def pivot(self, r: int, s: int) -> None:
        D = self.D
        inv = 1.0 / D[r][s]
        row_r = D[r]
        for i in range(self.m + 2):
            if i == r or abs(D[i][s]) <= 1e-15:
                continue
            row_i = D[i]
            factor = row_i[s] * inv
            for j in range(self.n + 2):
                if j != s:
                    row_i[j] -= row_r[j] * factor
        for j in range(self.n + 2):
            if j != s:
                row_r[j] *= inv
        for i in range(self.m + 2):
            if i != r:
                D[i][s] *= -inv
        D[r][s] = inv
        self.B[r], self.N[s] = self.N[s], self.B[r]

    def simplex(self, phase: int) -> bool:
        x = self.m + (1 if phase == 1 else 0)
        D, N, B = self.D, self.N, self.B
        while True:
            s = -1
            for j in range(self.n + 1):
                if phase == 2 and N[j] == -1:
                    continue
                if s == -1 or D[x][j] < D[x][s] - EPS or (abs(D[x][j] - D[x][s]) <= EPS and N[j] < N[s]):
                    s = j
            if D[x][s] > -EPS:
                return True
            r = -1
            for i in range(self.m):
                if D[i][s] < EPS:
                    continue
                if r == -1:
                    r = i
                else:
                    lhs = D[i][self.n + 1] / D[i][s]
                    rhs = D[r][self.n + 1] / D[r][s]
                    if lhs < rhs - EPS or (abs(lhs - rhs) <= EPS and B[i] < B[r]):
                        r = i
            if r == -1:
                return False
            self.pivot(r, s)

    def solve(self):
        D, N, B = self.D, self.N, self.B
        r = min(range(self.m), key=lambda i: D[i][self.n + 1]) if self.m > 0 else 0
        if self.m > 0 and D[r][self.n + 1] < -EPS:
            self.pivot(r, self.n)
            if not self.simplex(1) or D[self.m + 1][self.n + 1] < -EPS:
                return "INFEASIBLE"
            for i in range(self.m):
                if B[i] == -1:
                    s = -1
                    for j in range(self.n + 1):
                        if s == -1 or D[i][j] < D[i][s] - EPS or (abs(D[i][j] - D[i][s]) <= EPS and N[j] < N[s]):
                            s = j
                    self.pivot(i, s)
        if not self.simplex(2):
            return "UNBOUNDED"
        return f"{D[self.m][self.n + 1]:.6f}"


def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n, m = int(data[0]), int(data[1])
    c = [float(data[2 + j]) for j in range(n)]
    idx = 2 + n
    A = []
    b = []
    for _ in range(m):
        A.append([float(data[idx + j]) for j in range(n)])
        b.append(float(data[idx + n]))
        idx += n + 1
    sys.stdout.write(LPSolver(A, b, c).solve() + "\\n")


if __name__ == "__main__":
    solve()`,
    ruby: `EPS = 1e-9

class LPSolver
  def initialize(a, b, c)
    @m = b.length
    @n = c.length
    @nb = (0...@n).to_a + [-1]
    @b = (0...@m).map { |i| @n + i }
    @d = Array.new(@m + 2) { Array.new(@n + 2, 0.0) }
    @m.times do |i|
      @n.times { |j| @d[i][j] = a[i][j] }
      @d[i][@n] = -1.0
      @d[i][@n + 1] = b[i]
    end
    @n.times { |j| @d[@m][j] = -c[j] }
    @d[@m + 1][@n] = 1.0
  end

  def pivot(r, s)
    inv = 1.0 / @d[r][s]
    (@m + 2).times do |i|
      next if i == r || @d[i][s].abs <= 1e-15
      factor = @d[i][s] * inv
      (@n + 2).times { |j| @d[i][j] -= @d[r][j] * factor if j != s }
    end
    (@n + 2).times { |j| @d[r][j] *= inv if j != s }
    (@m + 2).times { |i| @d[i][s] *= -inv if i != r }
    @d[r][s] = inv
    @b[r], @nb[s] = @nb[s], @b[r]
  end

  def simplex(phase)
    x = @m + (phase == 1 ? 1 : 0)
    loop do
      s = -1
      (0..@n).each do |j|
        next if phase == 2 && @nb[j] == -1
        if s == -1 || @d[x][j] < @d[x][s] - EPS || ((@d[x][j] - @d[x][s]).abs <= EPS && @nb[j] < @nb[s])
          s = j
        end
      end
      return true if @d[x][s] > -EPS
      r = -1
      @m.times do |i|
        next if @d[i][s] < EPS
        if r == -1
          r = i
        else
          lhs = @d[i][@n + 1] / @d[i][s]
          rhs = @d[r][@n + 1] / @d[r][s]
          r = i if lhs < rhs - EPS || ((lhs - rhs).abs <= EPS && @b[i] < @b[r])
        end
      end
      return false if r == -1
      pivot(r, s)
    end
  end

  def solve
    if @m > 0
      r = (0...@m).min_by { |i| @d[i][@n + 1] }
      if @d[r][@n + 1] < -EPS
        pivot(r, @n)
        return 'INFEASIBLE' if !simplex(1) || @d[@m + 1][@n + 1] < -EPS
        @m.times do |i|
          next unless @b[i] == -1
          s = -1
          (0..@n).each do |j|
            if s == -1 || @d[i][j] < @d[i][s] - EPS || ((@d[i][j] - @d[i][s]).abs <= EPS && @nb[j] < @nb[s])
              s = j
            end
          end
          pivot(i, s)
        end
      end
    end
    return 'UNBOUNDED' unless simplex(2)
    format('%.6f', @d[@m][@n + 1])
  end
end

data = STDIN.read.split
exit if data.empty?
n = data[0].to_i; m = data[1].to_i
c = data[2, n].map(&:to_f)
idx = 2 + n
a = []; b = []
m.times do
  a << data[idx, n].map(&:to_f)
  b << data[idx + n].to_f
  idx += n + 1
end
puts LPSolver.new(a, b, c).solve`,
  },
  practiceProblems: [
    {
      id: 'ch81-p1',
      tier: 'Warmup',
      ratingRange: '2500–2800',
      title: 'Canonical Linear Program Maximization via Two-Phase Simplex',
      statement:
        'Given a Linear Program in canonical form: maximize c^T x subject to A x <= b and x >= 0, with N variables (1 <= N <= 30) and M constraints (1 <= M <= 30), output the maximum objective value printed to 6 decimal places, or output INFEASIBLE if the feasible polytope is empty, or UNBOUNDED if the objective is unbounded above.',
      constraints: '1 <= N, M <= 30; |A_{i,j}|, |b_i|, |c_j| <= 10^4; Time Limit: 1.5s',
      sampleInput: '2 3\n3 2\n2 1 18\n2 3 42\n3 1 24',
      sampleOutput: '33.000000',
      hints: [
        'Build an (M + 2) x (N + 2) tableau with an artificial column n = -1 to handle negative b_i via Phase I.',
        'Use Bland’s anti-cycling tie-breaker (prefer smallest variable ID on ties within EPS = 1e-9) in both column and row selection.',
      ],
      solutions: {
        cpp20: `#include <algorithm>
#include <cmath>
#include <iomanip>
#include <iostream>
#include <vector>

using namespace std;

static constexpr double EPS = 1e-9;

struct LPSolver {
    int m, n;
    vector<int> N, B;
    vector<vector<double>> D;

    LPSolver(const vector<vector<double>>& A, const vector<double>& b, const vector<double>& c)
        : m((int)b.size()), n((int)c.size()), N(n + 1), B(m), D(m + 2, vector<double>(n + 2, 0.0)) {
        for (int i = 0; i < m; ++i) {
            for (int j = 0; j < n; ++j) D[i][j] = A[i][j];
            B[i] = n + i;
            D[i][n] = -1.0;
            D[i][n + 1] = b[i];
        }
        for (int j = 0; j < n; ++j) { N[j] = j; D[m][j] = -c[j]; }
        N[n] = -1;
        D[m + 1][n] = 1.0;
    }

    void pivot(int r, int s) {
        double inv = 1.0 / D[r][s];
        for (int i = 0; i < m + 2; ++i) {
            if (i == r || fabs(D[i][s]) <= 1e-15) continue;
            for (int j = 0; j < n + 2; ++j) if (j != s) D[i][j] -= D[r][j] * D[i][s] * inv;
        }
        for (int j = 0; j < n + 2; ++j) if (j != s) D[r][j] *= inv;
        for (int i = 0; i < m + 2; ++i) if (i != r) D[i][s] *= -inv;
        D[r][s] = inv;
        swap(B[r], N[s]);
    }

    bool simplex(int phase) {
        int x = m + (phase == 1 ? 1 : 0);
        while (true) {
            int s = -1;
            for (int j = 0; j <= n; ++j) {
                if (phase == 2 && N[j] == -1) continue;
                if (s == -1 || D[x][j] < D[x][s] - EPS || (fabs(D[x][j] - D[x][s]) <= EPS && N[j] < N[s])) s = j;
            }
            if (D[x][s] > -EPS) return true;
            int r = -1;
            for (int i = 0; i < m; ++i) {
                if (D[i][s] < EPS) continue;
                if (r == -1) r = i;
                else {
                    double lhs = D[i][n + 1] / D[i][s], rhs = D[r][n + 1] / D[r][s];
                    if (lhs < rhs - EPS || (fabs(lhs - rhs) <= EPS && B[i] < B[r])) r = i;
                }
            }
            if (r == -1) return false;
            pivot(r, s);
        }
    }

    int solve(double& val) {
        int r = 0;
        for (int i = 1; i < m; ++i) if (D[i][n + 1] < D[r][n + 1]) r = i;
        if (D[r][n + 1] < -EPS) {
            pivot(r, n);
            if (!simplex(1) || D[m + 1][n + 1] < -EPS) return 0;
            for (int i = 0; i < m; ++i) {
                if (B[i] == -1) {
                    int s = -1;
                    for (int j = 0; j <= n; ++j) {
                        if (s == -1 || D[i][j] < D[i][s] - EPS || (fabs(D[i][j] - D[i][s]) <= EPS && N[j] < N[s])) s = j;
                    }
                    pivot(i, s);
                }
            }
        }
        if (!simplex(2)) return -1;
        val = D[m][n + 1];
        return 1;
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    if (!(cin >> n >> m)) return 0;
    vector<double> c(n), b(m);
    for (int j = 0; j < n; ++j) cin >> c[j];
    vector<vector<double>> A(m, vector<double>(n));
    for (int i = 0; i < m; ++i) {
        for (int j = 0; j < n; ++j) cin >> A[i][j];
        cin >> b[i];
    }
    LPSolver lp(A, b, c);
    double val = 0.0;
    int st = lp.solve(val);
    if (st == 0) cout << "INFEASIBLE\\n";
    else if (st == -1) cout << "UNBOUNDED\\n";
    else cout << fixed << setprecision(6) << val << '\\n';
    return 0;
}`,
        rust: `use std::io::{self, Read};

const EPS: f64 = 1e-9;

struct LpSolver {
    m: usize,
    n: usize,
    nb: Vec<i32>,
    b: Vec<i32>,
    d: Vec<Vec<f64>>,
}

impl LpSolver {
    fn new(a: &[Vec<f64>], b_in: &[f64], c: &[f64]) -> Self {
        let m = b_in.len();
        let n = c.len();
        let mut d = vec![vec![0.0; n + 2]; m + 2];
        let mut nb = vec![0i32; n + 1];
        let mut b = vec![0i32; m];
        for i in 0..m {
            for j in 0..n { d[i][j] = a[i][j]; }
            b[i] = (n + i) as i32;
            d[i][n] = -1.0;
            d[i][n + 1] = b_in[i];
        }
        for j in 0..n { nb[j] = j as i32; d[m][j] = -c[j]; }
        nb[n] = -1;
        d[m + 1][n] = 1.0;
        Self { m, n, nb, b, d }
    }

    fn pivot(&mut self, r: usize, s: usize) {
        let inv = 1.0 / self.d[r][s];
        for i in 0..(self.m + 2) {
            if i == r || self.d[i][s].abs() <= 1e-15 { continue; }
            for j in 0..(self.n + 2) {
                if j != s { self.d[i][j] -= self.d[r][j] * self.d[i][s] * inv; }
            }
        }
        for j in 0..(self.n + 2) { if j != s { self.d[r][j] *= inv; } }
        for i in 0..(self.m + 2) { if i != r { self.d[i][s] *= -inv; } }
        self.d[r][s] = inv;
        std::mem::swap(&mut self.b[r], &mut self.nb[s]);
    }

    fn simplex(&mut self, phase: usize) -> bool {
        let x = self.m + if phase == 1 { 1 } else { 0 };
        loop {
            let mut s: Option<usize> = None;
            for j in 0..=self.n {
                if phase == 2 && self.nb[j] == -1 { continue; }
                if let Some(cur) = s {
                    if self.d[x][j] < self.d[x][cur] - EPS
                        || ((self.d[x][j] - self.d[x][cur]).abs() <= EPS && self.nb[j] < self.nb[cur])
                    { s = Some(j); }
                } else { s = Some(j); }
            }
            let s = s.unwrap();
            if self.d[x][s] > -EPS { return true; }
            let mut r: Option<usize> = None;
            for i in 0..self.m {
                if self.d[i][s] < EPS { continue; }
                if let Some(cur) = r {
                    let lhs = self.d[i][self.n + 1] / self.d[i][s];
                    let rhs = self.d[cur][self.n + 1] / self.d[cur][s];
                    if lhs < rhs - EPS || ((lhs - rhs).abs() <= EPS && self.b[i] < self.b[cur]) {
                        r = Some(i);
                    }
                } else { r = Some(i); }
            }
            match r { None => return false, Some(row) => self.pivot(row, s) }
        }
    }

    fn solve(&mut self) -> Result<f64, &'static str> {
        let mut r = 0usize;
        for i in 1..self.m { if self.d[i][self.n + 1] < self.d[r][self.n + 1] { r = i; } }
        if self.d[r][self.n + 1] < -EPS {
            self.pivot(r, self.n);
            if !self.simplex(1) || self.d[self.m + 1][self.n + 1] < -EPS { return Err("INFEASIBLE"); }
            for i in 0..self.m {
                if self.b[i] == -1 {
                    let mut s = 0usize;
                    for j in 1..=self.n {
                        if self.d[i][j] < self.d[i][s] - EPS
                            || ((self.d[i][j] - self.d[i][s]).abs() <= EPS && self.nb[j] < self.nb[s])
                        { s = j; }
                    }
                    self.pivot(i, s);
                }
            }
        }
        if !self.simplex(2) { return Err("UNBOUNDED"); }
        Ok(self.d[self.m][self.n + 1])
    }
}

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let n: usize = match it.next() { Some(v) => v.parse().unwrap(), None => return };
    let m: usize = it.next().unwrap().parse().unwrap();
    let c: Vec<f64> = (0..n).map(|_| it.next().unwrap().parse().unwrap()).collect();
    let mut a = vec![vec![0.0; n]; m];
    let mut b = vec![0.0; m];
    for i in 0..m {
        for j in 0..n { a[i][j] = it.next().unwrap().parse().unwrap(); }
        b[i] = it.next().unwrap().parse().unwrap();
    }
    match LpSolver::new(&a, &b, &c).solve() {
        Ok(v) => println!("{:.6}", v),
        Err(e) => println!("{}", e),
    }
}`,
        java21: `import java.io.BufferedInputStream;
import java.io.IOException;
import java.util.Locale;

public class Main {
    static final double EPS = 1e-9;

    static class FastScanner {
        private final BufferedInputStream in = new BufferedInputStream(System.in);
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;

        private int readByte() throws IOException {
            if (ptr >= len) {
                ptr = 0;
                len = in.read(buf);
                if (len <= 0) return -1;
            }
            return buf[ptr++];
        }

        String nextToken() throws IOException {
            int c = readByte();
            while (c >= 0 && c <= 32) c = readByte();
            if (c < 0) return null;
            StringBuilder sb = new StringBuilder();
            while (c > 32) { sb.append((char) c); c = readByte(); }
            return sb.toString();
        }
    }

    static class LPSolver {
        int m, n;
        int[] N, B;
        double[][] D;

        LPSolver(double[][] A, double[] b, double[] c) {
            m = b.length; n = c.length;
            N = new int[n + 1]; B = new int[m];
            D = new double[m + 2][n + 2];
            for (int i = 0; i < m; i++) {
                System.arraycopy(A[i], 0, D[i], 0, n);
                B[i] = n + i; D[i][n] = -1.0; D[i][n + 1] = b[i];
            }
            for (int j = 0; j < n; j++) { N[j] = j; D[m][j] = -c[j]; }
            N[n] = -1; D[m + 1][n] = 1.0;
        }

        void pivot(int r, int s) {
            double inv = 1.0 / D[r][s];
            for (int i = 0; i < m + 2; i++) {
                if (i == r || Math.abs(D[i][s]) <= 1e-15) continue;
                for (int j = 0; j < n + 2; j++) if (j != s) D[i][j] -= D[r][j] * D[i][s] * inv;
            }
            for (int j = 0; j < n + 2; j++) if (j != s) D[r][j] *= inv;
            for (int i = 0; i < m + 2; i++) if (i != r) D[i][s] *= -inv;
            D[r][s] = inv;
            int t = B[r]; B[r] = N[s]; N[s] = t;
        }

        boolean simplex(int phase) {
            int x = m + (phase == 1 ? 1 : 0);
            while (true) {
                int s = -1;
                for (int j = 0; j <= n; j++) {
                    if (phase == 2 && N[j] == -1) continue;
                    if (s == -1 || D[x][j] < D[x][s] - EPS || (Math.abs(D[x][j] - D[x][s]) <= EPS && N[j] < N[s])) s = j;
                }
                if (D[x][s] > -EPS) return true;
                int r = -1;
                for (int i = 0; i < m; i++) {
                    if (D[i][s] < EPS) continue;
                    if (r == -1) r = i;
                    else {
                        double lhs = D[i][n + 1] / D[i][s], rhs = D[r][n + 1] / D[r][s];
                        if (lhs < rhs - EPS || (Math.abs(lhs - rhs) <= EPS && B[i] < B[r])) r = i;
                    }
                }
                if (r == -1) return false;
                pivot(r, s);
            }
        }

        String solve() {
            int r = 0;
            for (int i = 1; i < m; i++) if (D[i][n + 1] < D[r][n + 1]) r = i;
            if (D[r][n + 1] < -EPS) {
                pivot(r, n);
                if (!simplex(1) || D[m + 1][n + 1] < -EPS) return "INFEASIBLE";
                for (int i = 0; i < m; i++) {
                    if (B[i] == -1) {
                        int s = -1;
                        for (int j = 0; j <= n; j++) {
                            if (s == -1 || D[i][j] < D[i][s] - EPS || (Math.abs(D[i][j] - D[i][s]) <= EPS && N[j] < N[s])) s = j;
                        }
                        pivot(i, s);
                    }
                }
            }
            if (!simplex(2)) return "UNBOUNDED";
            return String.format(Locale.US, "%.6f", D[m][n + 1]);
        }
    }

    public static void main(String[] args) throws Exception {
        Locale.setDefault(Locale.US);
        FastScanner fs = new FastScanner();
        String s0 = fs.nextToken();
        if (s0 == null) return;
        int n = Integer.parseInt(s0), m = Integer.parseInt(fs.nextToken());
        double[] c = new double[n];
        for (int j = 0; j < n; j++) c[j] = Double.parseDouble(fs.nextToken());
        double[][] A = new double[m][n];
        double[] b = new double[m];
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) A[i][j] = Double.parseDouble(fs.nextToken());
            b[i] = Double.parseDouble(fs.nextToken());
        }
        System.out.println(new LPSolver(A, b, c).solve());
    }
}`,
        python3: `import sys

sys.setrecursionlimit(200000)
EPS = 1e-9


class LPSolver:
    def __init__(self, A, b, c) -> None:
        self.m, self.n = len(b), len(c)
        self.N = list(range(self.n)) + [-1]
        self.B = [self.n + i for i in range(self.m)]
        self.D = [[0.0] * (self.n + 2) for _ in range(self.m + 2)]
        for i in range(self.m):
            for j in range(self.n):
                self.D[i][j] = A[i][j]
            self.D[i][self.n] = -1.0
            self.D[i][self.n + 1] = b[i]
        for j in range(self.n):
            self.D[self.m][j] = -c[j]
        self.D[self.m + 1][self.n] = 1.0

    def pivot(self, r: int, s: int) -> None:
        D = self.D
        inv = 1.0 / D[r][s]
        rr = D[r]
        for i in range(self.m + 2):
            if i == r or abs(D[i][s]) <= 1e-15:
                continue
            ri = D[i]
            f = ri[s] * inv
            for j in range(self.n + 2):
                if j != s:
                    ri[j] -= rr[j] * f
        for j in range(self.n + 2):
            if j != s:
                rr[j] *= inv
        for i in range(self.m + 2):
            if i != r:
                D[i][s] *= -inv
        D[r][s] = inv
        self.B[r], self.N[s] = self.N[s], self.B[r]

    def simplex(self, phase: int) -> bool:
        x = self.m + (1 if phase == 1 else 0)
        D, N, B = self.D, self.N, self.B
        while True:
            s = -1
            for j in range(self.n + 1):
                if phase == 2 and N[j] == -1:
                    continue
                if s == -1 or D[x][j] < D[x][s] - EPS or (abs(D[x][j] - D[x][s]) <= EPS and N[j] < N[s]):
                    s = j
            if D[x][s] > -EPS:
                return True
            r = -1
            for i in range(self.m):
                if D[i][s] < EPS:
                    continue
                if r == -1:
                    r = i
                else:
                    lhs = D[i][self.n + 1] / D[i][s]
                    rhs = D[r][self.n + 1] / D[r][s]
                    if lhs < rhs - EPS or (abs(lhs - rhs) <= EPS and B[i] < B[r]):
                        r = i
            if r == -1:
                return False
            self.pivot(r, s)

    def solve(self) -> str:
        D, N, B = self.D, self.N, self.B
        r = min(range(self.m), key=lambda i: D[i][self.n + 1]) if self.m else 0
        if self.m and D[r][self.n + 1] < -EPS:
            self.pivot(r, self.n)
            if not self.simplex(1) or D[self.m + 1][self.n + 1] < -EPS:
                return "INFEASIBLE"
            for i in range(self.m):
                if B[i] == -1:
                    s = -1
                    for j in range(self.n + 1):
                        if s == -1 or D[i][j] < D[i][s] - EPS or (abs(D[i][j] - D[i][s]) <= EPS and N[j] < N[s]):
                            s = j
                    self.pivot(i, s)
        if not self.simplex(2):
            return "UNBOUNDED"
        return f"{D[self.m][self.n + 1]:.6f}"


def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n, m = int(data[0]), int(data[1])
    c = [float(data[2 + j]) for j in range(n)]
    idx = 2 + n
    A, b = [], []
    for _ in range(m):
        A.append([float(data[idx + j]) for j in range(n)])
        b.append(float(data[idx + n]))
        idx += n + 1
    sys.stdout.write(LPSolver(A, b, c).solve() + "\\n")


if __name__ == "__main__":
    solve()`,
        ruby: `EPS = 1e-9

class LPSolver
  def initialize(a, b, c)
    @m = b.length; @n = c.length
    @nb = (0...@n).to_a + [-1]
    @b = (0...@m).map { |i| @n + i }
    @d = Array.new(@m + 2) { Array.new(@n + 2, 0.0) }
    @m.times do |i|
      @n.times { |j| @d[i][j] = a[i][j] }
      @d[i][@n] = -1.0; @d[i][@n + 1] = b[i]
    end
    @n.times { |j| @d[@m][j] = -c[j] }
    @d[@m + 1][@n] = 1.0
  end

  def pivot(r, s)
    inv = 1.0 / @d[r][s]
    (@m + 2).times do |i|
      next if i == r || @d[i][s].abs <= 1e-15
      f = @d[i][s] * inv
      (@n + 2).times { |j| @d[i][j] -= @d[r][j] * f if j != s }
    end
    (@n + 2).times { |j| @d[r][j] *= inv if j != s }
    (@m + 2).times { |i| @d[i][s] *= -inv if i != r }
    @d[r][s] = inv
    @b[r], @nb[s] = @nb[s], @b[r]
  end

  def simplex(phase)
    x = @m + (phase == 1 ? 1 : 0)
    loop do
      s = -1
      (0..@n).each do |j|
        next if phase == 2 && @nb[j] == -1
        s = j if s == -1 || @d[x][j] < @d[x][s] - EPS || ((@d[x][j] - @d[x][s]).abs <= EPS && @nb[j] < @nb[s])
      end
      return true if @d[x][s] > -EPS
      r = -1
      @m.times do |i|
        next if @d[i][s] < EPS
        if r == -1
          r = i
        else
          lhs = @d[i][@n + 1] / @d[i][s]; rhs = @d[r][@n + 1] / @d[r][s]
          r = i if lhs < rhs - EPS || ((lhs - rhs).abs <= EPS && @b[i] < @b[r])
        end
      end
      return false if r == -1
      pivot(r, s)
    end
  end

  def solve
    if @m > 0
      r = (0...@m).min_by { |i| @d[i][@n + 1] }
      if @d[r][@n + 1] < -EPS
        pivot(r, @n)
        return 'INFEASIBLE' if !simplex(1) || @d[@m + 1][@n + 1] < -EPS
        @m.times do |i|
          next unless @b[i] == -1
          s = -1
          (0..@n).each do |j|
            s = j if s == -1 || @d[i][j] < @d[i][s] - EPS || ((@d[i][j] - @d[i][s]).abs <= EPS && @nb[j] < @nb[s])
          end
          pivot(i, s)
        end
      end
    end
    return 'UNBOUNDED' unless simplex(2)
    format('%.6f', @d[@m][@n + 1])
  end
end

data = STDIN.read.split
exit if data.empty?
n = data[0].to_i; m = data[1].to_i
c = data[2, n].map(&:to_f); idx = 2 + n
a = []; b = []
m.times do
  a << data[idx, n].map(&:to_f); b << data[idx + n].to_f; idx += n + 1
end
puts LPSolver.new(a, b, c).solve`,
      },
    },
    {
      id: 'ch81-p2',
      tier: 'Standard',
      ratingRange: '2700–3000',
      title: 'Zero-Sum Matrix Game Nash Equilibrium Value via LP Duality',
      statement:
        'Given an R x C payoff matrix M (1 <= R, C <= 25, |M_{i,j}| <= 10^4) for a two-player zero-sum game where the row player chooses a probability distribution p in Delta_R to maximize min_j (p^T M)_j and the column player chooses q in Delta_C to minimize max_i (M q)_i, compute the unique Nash equilibrium game value printed to 6 decimal places.',
      constraints: '1 <= R, C <= 25; |M_{i,j}| <= 10^4; Time Limit: 1.5s',
      sampleInput: '2 2\n3 -1\n-2 4',
      sampleOutput: '1.000000',
      hints: [
        'Shift every entry of M by shift = -min_{i,j}(M_{i,j}) + 1.0 so the shifted game value V\' is strictly positive.',
        'By substituting y_i = p_i / V\', maximizing V\' subject to sum_i p_i M\'_{i,j} >= V\' and sum p_i = 1 becomes minimizing sum y_i subject to (M\')^T y >= 1, y >= 0. Its dual LP is simply: maximize sum_{j=1..C} z_j subject to M\' z <= 1, z >= 0! Then V\' = 1.0 / (max sum z_j) and V = V\' - shift.',
      ],
      solutions: {
        cpp20: `#include <algorithm>
#include <cmath>
#include <iomanip>
#include <iostream>
#include <vector>

using namespace std;

static constexpr double EPS = 1e-9;

struct LPSolver {
    int m, n;
    vector<int> N, B;
    vector<vector<double>> D;

    LPSolver(const vector<vector<double>>& A, const vector<double>& b, const vector<double>& c)
        : m((int)b.size()), n((int)c.size()), N(n + 1), B(m), D(m + 2, vector<double>(n + 2, 0.0)) {
        for (int i = 0; i < m; ++i) {
            for (int j = 0; j < n; ++j) D[i][j] = A[i][j];
            B[i] = n + i; D[i][n] = -1.0; D[i][n + 1] = b[i];
        }
        for (int j = 0; j < n; ++j) { N[j] = j; D[m][j] = -c[j]; }
        N[n] = -1; D[m + 1][n] = 1.0;
    }

    void pivot(int r, int s) {
        double inv = 1.0 / D[r][s];
        for (int i = 0; i < m + 2; ++i) {
            if (i == r || fabs(D[i][s]) <= 1e-15) continue;
            for (int j = 0; j < n + 2; ++j) if (j != s) D[i][j] -= D[r][j] * D[i][s] * inv;
        }
        for (int j = 0; j < n + 2; ++j) if (j != s) D[r][j] *= inv;
        for (int i = 0; i < m + 2; ++i) if (i != r) D[i][s] *= -inv;
        D[r][s] = inv;
        swap(B[r], N[s]);
    }

    bool simplex(int phase) {
        int x = m + (phase == 1 ? 1 : 0);
        while (true) {
            int s = -1;
            for (int j = 0; j <= n; ++j) {
                if (phase == 2 && N[j] == -1) continue;
                if (s == -1 || D[x][j] < D[x][s] - EPS || (fabs(D[x][j] - D[x][s]) <= EPS && N[j] < N[s])) s = j;
            }
            if (D[x][s] > -EPS) return true;
            int r = -1;
            for (int i = 0; i < m; ++i) {
                if (D[i][s] < EPS) continue;
                if (r == -1) r = i;
                else {
                    double lhs = D[i][n + 1] / D[i][s], rhs = D[r][n + 1] / D[r][s];
                    if (lhs < rhs - EPS || (fabs(lhs - rhs) <= EPS && B[i] < B[r])) r = i;
                }
            }
            if (r == -1) return false;
            pivot(r, s);
        }
    }

    double solve() {
        simplex(2);
        return D[m][n + 1];
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int R, C;
    if (!(cin >> R >> C)) return 0;
    vector<vector<double>> M(R, vector<double>(C));
    double mn = 1e18;
    for (int i = 0; i < R; ++i) {
        for (int j = 0; j < C; ++j) {
            cin >> M[i][j];
            mn = min(mn, M[i][j]);
        }
    }
    double shift = (mn <= 0.0) ? (-mn + 1.0) : 0.0;
    for (int i = 0; i < R; ++i) {
        for (int j = 0; j < C; ++j) M[i][j] += shift;
    }
    vector<double> b(R, 1.0), c(C, 1.0);
    LPSolver lp(M, b, c);
    double z_sum = lp.solve();
    double val = 1.0 / z_sum - shift;
    cout << fixed << setprecision(6) << val << '\\n';
    return 0;
}`,
        rust: `use std::io::{self, Read};

const EPS: f64 = 1e-9;

struct LpSolver {
    m: usize,
    n: usize,
    nb: Vec<i32>,
    b: Vec<i32>,
    d: Vec<Vec<f64>>,
}

impl LpSolver {
    fn new(a: &[Vec<f64>], b_in: &[f64], c: &[f64]) -> Self {
        let m = b_in.len();
        let n = c.len();
        let mut d = vec![vec![0.0; n + 2]; m + 2];
        let mut nb = vec![0i32; n + 1];
        let mut b = vec![0i32; m];
        for i in 0..m {
            for j in 0..n { d[i][j] = a[i][j]; }
            b[i] = (n + i) as i32; d[i][n] = -1.0; d[i][n + 1] = b_in[i];
        }
        for j in 0..n { nb[j] = j as i32; d[m][j] = -c[j]; }
        nb[n] = -1; d[m + 1][n] = 1.0;
        Self { m, n, nb, b, d }
    }

    fn pivot(&mut self, r: usize, s: usize) {
        let inv = 1.0 / self.d[r][s];
        for i in 0..(self.m + 2) {
            if i == r || self.d[i][s].abs() <= 1e-15 { continue; }
            for j in 0..(self.n + 2) { if j != s { self.d[i][j] -= self.d[r][j] * self.d[i][s] * inv; } }
        }
        for j in 0..(self.n + 2) { if j != s { self.d[r][j] *= inv; } }
        for i in 0..(self.m + 2) { if i != r { self.d[i][s] *= -inv; } }
        self.d[r][s] = inv;
        std::mem::swap(&mut self.b[r], &mut self.nb[s]);
    }

    fn solve(&mut self) -> f64 {
        let x = self.m;
        loop {
            let mut s: Option<usize> = None;
            for j in 0..=self.n {
                if self.nb[j] == -1 { continue; }
                if let Some(cur) = s {
                    if self.d[x][j] < self.d[x][cur] - EPS
                        || ((self.d[x][j] - self.d[x][cur]).abs() <= EPS && self.nb[j] < self.nb[cur])
                    { s = Some(j); }
                } else { s = Some(j); }
            }
            let s = s.unwrap();
            if self.d[x][s] > -EPS { break; }
            let mut r: Option<usize> = None;
            for i in 0..self.m {
                if self.d[i][s] < EPS { continue; }
                if let Some(cur) = r {
                    let lhs = self.d[i][self.n + 1] / self.d[i][s];
                    let rhs = self.d[cur][self.n + 1] / self.d[cur][s];
                    if lhs < rhs - EPS || ((lhs - rhs).abs() <= EPS && self.b[i] < self.b[cur]) { r = Some(i); }
                } else { r = Some(i); }
            }
            self.pivot(r.unwrap(), s);
        }
        self.d[self.m][self.n + 1]
    }
}

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let r: usize = match it.next() { Some(v) => v.parse().unwrap(), None => return };
    let c: usize = it.next().unwrap().parse().unwrap();
    let mut mat = vec![vec![0.0f64; c]; r];
    let mut mn = f64::INFINITY;
    for i in 0..r {
        for j in 0..c {
            mat[i][j] = it.next().unwrap().parse().unwrap();
            if mat[i][j] < mn { mn = mat[i][j]; }
        }
    }
    let shift = if mn <= 0.0 { -mn + 1.0 } else { 0.0 };
    for i in 0..r { for j in 0..c { mat[i][j] += shift; } }
    let b = vec![1.0; r];
    let obj = vec![1.0; c];
    let z_sum = LpSolver::new(&mat, &b, &obj).solve();
    println!("{:.6}", 1.0 / z_sum - shift);
}`,
        java21: `import java.io.BufferedInputStream;
import java.io.IOException;
import java.util.Arrays;
import java.util.Locale;

public class Main {
    static final double EPS = 1e-9;

    static class FastScanner {
        private final BufferedInputStream in = new BufferedInputStream(System.in);
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;

        private int readByte() throws IOException {
            if (ptr >= len) {
                ptr = 0;
                len = in.read(buf);
                if (len <= 0) return -1;
            }
            return buf[ptr++];
        }

        String nextToken() throws IOException {
            int c = readByte();
            while (c >= 0 && c <= 32) c = readByte();
            if (c < 0) return null;
            StringBuilder sb = new StringBuilder();
            while (c > 32) { sb.append((char) c); c = readByte(); }
            return sb.toString();
        }
    }

    static class LPSolver {
        int m, n;
        int[] N, B;
        double[][] D;

        LPSolver(double[][] A, double[] b, double[] c) {
            m = b.length; n = c.length;
            N = new int[n + 1]; B = new int[m];
            D = new double[m + 2][n + 2];
            for (int i = 0; i < m; i++) {
                System.arraycopy(A[i], 0, D[i], 0, n);
                B[i] = n + i; D[i][n] = -1.0; D[i][n + 1] = b[i];
            }
            for (int j = 0; j < n; j++) { N[j] = j; D[m][j] = -c[j]; }
            N[n] = -1; D[m + 1][n] = 1.0;
        }

        void pivot(int r, int s) {
            double inv = 1.0 / D[r][s];
            for (int i = 0; i < m + 2; i++) {
                if (i == r || Math.abs(D[i][s]) <= 1e-15) continue;
                for (int j = 0; j < n + 2; j++) if (j != s) D[i][j] -= D[r][j] * D[i][s] * inv;
            }
            for (int j = 0; j < n + 2; j++) if (j != s) D[r][j] *= inv;
            for (int i = 0; i < m + 2; i++) if (i != r) D[i][s] *= -inv;
            D[r][s] = inv;
            int t = B[r]; B[r] = N[s]; N[s] = t;
        }

        double solve() {
            int x = m;
            while (true) {
                int s = -1;
                for (int j = 0; j <= n; j++) {
                    if (N[j] == -1) continue;
                    if (s == -1 || D[x][j] < D[x][s] - EPS || (Math.abs(D[x][j] - D[x][s]) <= EPS && N[j] < N[s])) s = j;
                }
                if (D[x][s] > -EPS) break;
                int r = -1;
                for (int i = 0; i < m; i++) {
                    if (D[i][s] < EPS) continue;
                    if (r == -1) r = i;
                    else {
                        double lhs = D[i][n + 1] / D[i][s], rhs = D[r][n + 1] / D[r][s];
                        if (lhs < rhs - EPS || (Math.abs(lhs - rhs) <= EPS && B[i] < B[r])) r = i;
                    }
                }
                pivot(r, s);
            }
            return D[m][n + 1];
        }
    }

    public static void main(String[] args) throws Exception {
        Locale.setDefault(Locale.US);
        FastScanner fs = new FastScanner();
        String s0 = fs.nextToken();
        if (s0 == null) return;
        int R = Integer.parseInt(s0), C = Integer.parseInt(fs.nextToken());
        double[][] M = new double[R][C];
        double mn = 1e18;
        for (int i = 0; i < R; i++) {
            for (int j = 0; j < C; j++) {
                M[i][j] = Double.parseDouble(fs.nextToken());
                if (M[i][j] < mn) mn = M[i][j];
            }
        }
        double shift = mn <= 0.0 ? (-mn + 1.0) : 0.0;
        for (int i = 0; i < R; i++) for (int j = 0; j < C; j++) M[i][j] += shift;
        double[] b = new double[R], c = new double[C];
        Arrays.fill(b, 1.0); Arrays.fill(c, 1.0);
        double zSum = new LPSolver(M, b, c).solve();
        System.out.printf("%.6f%n", 1.0 / zSum - shift);
    }
}`,
        python3: `import sys

sys.setrecursionlimit(200000)
EPS = 1e-9


class LPSolver:
    def __init__(self, A, b, c) -> None:
        self.m, self.n = len(b), len(c)
        self.N = list(range(self.n)) + [-1]
        self.B = [self.n + i for i in range(self.m)]
        self.D = [[0.0] * (self.n + 2) for _ in range(self.m + 2)]
        for i in range(self.m):
            for j in range(self.n):
                self.D[i][j] = A[i][j]
            self.D[i][self.n] = -1.0
            self.D[i][self.n + 1] = b[i]
        for j in range(self.n):
            self.D[self.m][j] = -c[j]
        self.D[self.m + 1][self.n] = 1.0

    def pivot(self, r: int, s: int) -> None:
        D = self.D
        inv = 1.0 / D[r][s]
        rr = D[r]
        for i in range(self.m + 2):
            if i == r or abs(D[i][s]) <= 1e-15:
                continue
            ri = D[i]
            f = ri[s] * inv
            for j in range(self.n + 2):
                if j != s:
                    ri[j] -= rr[j] * f
        for j in range(self.n + 2):
            if j != s:
                rr[j] *= inv
        for i in range(self.m + 2):
            if i != r:
                D[i][s] *= -inv
        D[r][s] = inv
        self.B[r], self.N[s] = self.N[s], self.B[r]

    def solve(self) -> float:
        x = self.m
        D, N, B = self.D, self.N, self.B
        while True:
            s = -1
            for j in range(self.n + 1):
                if N[j] == -1:
                    continue
                if s == -1 or D[x][j] < D[x][s] - EPS or (abs(D[x][j] - D[x][s]) <= EPS and N[j] < N[s]):
                    s = j
            if D[x][s] > -EPS:
                break
            r = -1
            for i in range(self.m):
                if D[i][s] < EPS:
                    continue
                if r == -1:
                    r = i
                else:
                    lhs = D[i][self.n + 1] / D[i][s]
                    rhs = D[r][self.n + 1] / D[r][s]
                    if lhs < rhs - EPS or (abs(lhs - rhs) <= EPS and B[i] < B[r]):
                        r = i
            self.pivot(r, s)
        return D[self.m][self.n + 1]


def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    R, C = int(data[0]), int(data[1])
    M = [[float(data[2 + i * C + j]) for j in range(C)] for i in range(R)]
    mn = min(min(row) for row in M)
    shift = -mn + 1.0 if mn <= 0.0 else 0.0
    for i in range(R):
        for j in range(C):
            M[i][j] += shift
    z_sum = LPSolver(M, [1.0] * R, [1.0] * C).solve()
    sys.stdout.write(f"{1.0 / z_sum - shift:.6f}\\n")


if __name__ == "__main__":
    solve()`,
        ruby: `EPS = 1e-9

class LPSolver
  def initialize(a, b, c)
    @m = b.length; @n = c.length
    @nb = (0...@n).to_a + [-1]
    @b = (0...@m).map { |i| @n + i }
    @d = Array.new(@m + 2) { Array.new(@n + 2, 0.0) }
    @m.times do |i|
      @n.times { |j| @d[i][j] = a[i][j] }
      @d[i][@n] = -1.0; @d[i][@n + 1] = b[i]
    end
    @n.times { |j| @d[@m][j] = -c[j] }
    @d[@m + 1][@n] = 1.0
  end

  def pivot(r, s)
    inv = 1.0 / @d[r][s]
    (@m + 2).times do |i|
      next if i == r || @d[i][s].abs <= 1e-15
      f = @d[i][s] * inv
      (@n + 2).times { |j| @d[i][j] -= @d[r][j] * f if j != s }
    end
    (@n + 2).times { |j| @d[r][j] *= inv if j != s }
    (@m + 2).times { |i| @d[i][s] *= -inv if i != r }
    @d[r][s] = inv
    @b[r], @nb[s] = @nb[s], @b[r]
  end

  def solve
    x = @m
    loop do
      s = -1
      (0..@n).each do |j|
        next if @nb[j] == -1
        s = j if s == -1 || @d[x][j] < @d[x][s] - EPS || ((@d[x][j] - @d[x][s]).abs <= EPS && @nb[j] < @nb[s])
      end
      break if @d[x][s] > -EPS
      r = -1
      @m.times do |i|
        next if @d[i][s] < EPS
        if r == -1
          r = i
        else
          lhs = @d[i][@n + 1] / @d[i][s]; rhs = @d[r][@n + 1] / @d[r][s]
          r = i if lhs < rhs - EPS || ((lhs - rhs).abs <= EPS && @b[i] < @b[r])
        end
      end
      pivot(r, s)
    end
    @d[@m][@n + 1]
  end
end

data = STDIN.read.split
exit if data.empty?
r = data[0].to_i; c = data[1].to_i
mat = Array.new(r) { |i| Array.new(c) { |j| data[2 + i * c + j].to_f } }
mn = mat.flatten.min
shift = mn <= 0.0 ? (-mn + 1.0) : 0.0
r.times { |i| c.times { |j| mat[i][j] += shift } }
z_sum = LPSolver.new(mat, Array.new(r, 1.0), Array.new(c, 1.0)).solve
puts format('%.6f', 1.0 / z_sum - shift)`,
      },
    },
    {
      id: 'ch81-p3',
      tier: 'Boss',
      ratingRange: '2900–3300+',
      title: 'Minimum-Cost Interval Shift Covering via LP Dualization',
      statement:
        'You manage a 24/7 data center divided into $N$ discrete time slots ($1 \\le N \\le 25$), where slot $i$ requires at least $D_i$ active engineers ($0 \\le D_i \\le 10^4$). There are $M$ shift templates ($1 \\le M \\le 40$); shift template $k$ covers the contiguous range of slots $[L_k, R_k]$ ($1 \\le L_k \\le R_k \\le N$) at a salary cost of $C_k$ ($0 \\le C_k \\le 10^4$) per unit assigned. Fractions of shift templates are permitted (continuous relaxation). Compute the minimum total cost $\\sum_{k=1}^M C_k x_k$ ($x_k \\ge 0$) such that every slot $i$ receives coverage at least $D_i$, printed to 6 decimal places, or output `INFEASIBLE` if some slot with $D_i > 0$ cannot be covered.',
      constraints: '1 <= N <= 25, 1 <= M <= 40, 0 <= D_i, C_k <= 10^4',
      sampleInput: '4 4\n2 3 4 2\n1 2 5\n2 3 6\n3 4 4\n1 4 10',
      sampleOutput: '28.000000',
      hints: [
        'The primal problem is a covering LP: minimize $C^T x$ subject to $A x \\ge D$ and $x \\ge 0$, where $A_{i,k} = 1$ if $L_k \\le i \\le R_k$ and $0$ otherwise.',
        'Rather than adding $N$ artificial variables to handle $\\ge$ constraints directly, take the Dual LP: maximize $D^T y$ subject to $A^T y \\le C$ and $y \\ge 0$.',
        'Because $C_k \\ge 0$, $y = 0$ is immediately a feasible starting basic solution for the Dual LP! If the Dual LP is unbounded, then the Primal covering LP is INFEASIBLE.',
      ],
      solutions: {
        cpp20: `#include <iostream>
#include <vector>
#include <cmath>
#include <iomanip>
#include <limits>

using namespace std;

const double EPS = 1e-9;

struct LPSolver {
    int m, n;
    vector<int> B, N;
    vector<vector<double>> D;

    LPSolver(const vector<vector<double>>& A, const vector<double>& b, const vector<double>& c)
        : m(b.size()), n(c.size()), B(m), N(n + 1), D(m + 2, vector<double>(n + 2, 0.0)) {
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) D[i][j] = A[i][j];
            B[i] = n + i;
            D[i][n] = -1.0;
            D[i][n + 1] = b[i];
        }
        for (int j = 0; j < n; j++) {
            N[j] = j;
            D[m][j] = -c[j];
        }
        N[n] = -1;
        D[m + 1][n] = 1.0;
    }

    void pivot(int r, int s) {
        double inv = 1.0 / D[r][s];
        for (int i = 0; i < m + 2; i++) {
            if (i != r && abs(D[i][s]) > EPS) {
                double factor = D[i][s] * inv;
                for (int j = 0; j < n + 2; j++) {
                    if (j != s) D[i][j] -= D[r][j] * factor;
                }
                D[i][s] = -factor;
            }
        }
        for (int j = 0; j < n + 2; j++) if (j != s) D[r][j] *= inv;
        D[r][s] = inv;
        swap(B[r], N[s]);
    }

    bool simplex(int phase) {
        int x = m + (phase == 1);
        while (true) {
            int s = -1;
            for (int j = 0; j <= n; j++) {
                if (phase == 2 && N[j] == -1) continue;
                if (D[x][j] < -EPS) {
                    if (s == -1 || N[j] < N[s]) s = j;
                }
            }
            if (s == -1) return true;
            int r = -1;
            for (int i = 0; i < m; i++) {
                if (D[i][s] > EPS) {
                    if (r == -1) r = i;
                    else {
                        double lhs = D[i][n + 1] / D[i][s];
                        double rhs = D[r][n + 1] / D[r][s];
                        if (lhs < rhs - EPS || (abs(lhs - rhs) <= EPS && B[i] < B[r])) r = i;
                    }
                }
            }
            if (r == -1) return false;
            pivot(r, s);
        }
    }

    double solve() {
        int r = 0;
        for (int i = 1; i < m; i++) if (D[i][n + 1] < D[r][n + 1]) r = i;
        if (D[r][n + 1] < -EPS) {
            pivot(r, n);
            if (!simplex(1) || D[m + 1][n + 1] < -EPS) return -numeric_limits<double>::infinity();
            for (int i = 0; i < m; i++) if (B[i] == -1) {
                int s = -1;
                for (int j = 0; j <= n; j++) if (s == -1 || abs(D[i][j]) > abs(D[i][s])) s = j;
                pivot(i, s);
            }
        }
        if (!simplex(2)) return numeric_limits<double>::infinity();
        return D[m][n + 1];
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    if (!(cin >> n >> m)) return 0;
    vector<double> demand(n);
    for (int i = 0; i < n; i++) cin >> demand[i];
    // Dual LP: max sum(demand[i] * y[i]) s.t. for each shift k: sum_{i=L_k}^{R_k} y[i] <= C_k, y >= 0
    vector<vector<double>> A(m, vector<double>(n, 0.0));
    vector<double> b(m);
    for (int k = 0; k < m; k++) {
        int l, r;
        cin >> l >> r >> b[k];
        for (int i = l - 1; i <= r - 1; i++) A[k][i] = 1.0;
    }
    LPSolver solver(A, b, demand);
    double ans = solver.solve();
    if (isinf(ans)) {
        cout << "INFEASIBLE\\n";
    } else {
        cout << fixed << setprecision(6) << ans << "\\n";
    }
    return 0;
}`,
        rust: `use std::io::{self, Read};

const EPS: f64 = 1e-9;

struct LPSolver {
    m: usize,
    n: usize,
    b_idx: Vec<isize>,
    n_idx: Vec<isize>,
    d: Vec<Vec<f64>>,
}

impl LPSolver {
    fn new(a: &[Vec<f64>], b: &[f64], c: &[f64]) -> Self {
        let m = b.len();
        let n = c.len();
        let mut b_idx = vec![0isize; m];
        let mut n_idx = vec![0isize; n + 1];
        let mut d = vec![vec![0.0; n + 2]; m + 2];
        for i in 0..m {
            for j in 0..n {
                d[i][j] = a[i][j];
            }
            b_idx[i] = (n + i) as isize;
            d[i][n] = -1.0;
            d[i][n + 1] = b[i];
        }
        for j in 0..n {
            n_idx[j] = j as isize;
            d[m][j] = -c[j];
        }
        n_idx[n] = -1;
        d[m + 1][n] = 1.0;
        Self { m, n, b_idx, n_idx, d }
    }

    fn pivot(&mut self, r: usize, s: usize) {
        let inv = 1.0 / self.d[r][s];
        for i in 0..(self.m + 2) {
            if i != r && self.d[i][s].abs() > EPS {
                let factor = self.d[i][s] * inv;
                for j in 0..(self.n + 2) {
                    if j != s {
                        self.d[i][j] -= self.d[r][j] * factor;
                    }
                }
                self.d[i][s] = -factor;
            }
        }
        for j in 0..(self.n + 2) {
            if j != s {
                self.d[r][j] *= inv;
            }
        }
        self.d[r][s] = inv;
        std::mem::swap(&mut self.b_idx[r], &mut self.n_idx[s]);
    }

    fn simplex(&mut self, phase: usize) -> bool {
        let x = self.m + if phase == 1 { 1 } else { 0 };
        loop {
            let mut s: Option<usize> = None;
            for j in 0..=self.n {
                if phase == 2 && self.n_idx[j] == -1 {
                    continue;
                }
                if self.d[x][j] < -EPS {
                    if s.is_none() || self.n_idx[j] < self.n_idx[s.unwrap()] {
                        s = Some(j);
                    }
                }
            }
            let s = match s {
                Some(val) => val,
                None => return true,
            };
            let mut r: Option<usize> = None;
            for i in 0..self.m {
                if self.d[i][s] > EPS {
                    if r.is_none() {
                        r = Some(i);
                    } else {
                        let r_cur = r.unwrap();
                        let lhs = self.d[i][self.n + 1] / self.d[i][s];
                        let rhs = self.d[r_cur][self.n + 1] / self.d[r_cur][s];
                        if lhs < rhs - EPS || ((lhs - rhs).abs() <= EPS && self.b_idx[i] < self.b_idx[r_cur]) {
                            r = Some(i);
                        }
                    }
                }
            }
            let r = match r {
                Some(val) => val,
                None => return false,
            };
            self.pivot(r, s);
        }
    }

    fn solve(&mut self) -> f64 {
        let mut r = 0;
        for i in 1..self.m {
            if self.d[i][self.n + 1] < self.d[r][self.n + 1] {
                r = i;
            }
        }
        if self.d[r][self.n + 1] < -EPS {
            self.pivot(r, self.n);
            if !self.simplex(1) || self.d[self.m + 1][self.n + 1] < -EPS {
                return f64::NEG_INFINITY;
            }
            for i in 0..self.m {
                if self.b_idx[i] == -1 {
                    let mut s = 0;
                    for j in 1..=self.n {
                        if self.d[i][j].abs() > self.d[i][s].abs() {
                            s = j;
                        }
                    }
                    self.pivot(i, s);
                }
            }
        }
        if !self.simplex(2) {
            return f64::INFINITY;
        }
        self.d[self.m][self.n + 1]
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
    let m: usize = it.next().unwrap().parse().unwrap();
    let mut demand = vec![0.0; n];
    for i in 0..n {
        demand[i] = it.next().unwrap().parse().unwrap();
    }
    let mut a = vec![vec![0.0; n]; m];
    let mut b = vec![0.0; m];
    for k in 0..m {
        let l: usize = it.next().unwrap().parse().unwrap();
        let r: usize = it.next().unwrap().parse().unwrap();
        b[k] = it.next().unwrap().parse().unwrap();
        for i in (l - 1)..r {
            a[k][i] = 1.0;
        }
    }
    let mut solver = LPSolver::new(&a, &b, &demand);
    let ans = solver.solve();
    if ans.is_infinite() {
        println!("INFEASIBLE");
    } else {
        println!("{:.6}", ans);
    }
}`,
        java21: `import java.io.*;
import java.util.*;

public class Main {
    static final double EPS = 1e-9;

    static class LPSolver {
        int m, n;
        int[] B, N;
        double[][] D;

        LPSolver(double[][] A, double[] b, double[] c) {
            m = b.length;
            n = c.length;
            B = new int[m];
            N = new int[n + 1];
            D = new double[m + 2][n + 2];
            for (int i = 0; i < m; i++) {
                System.arraycopy(A[i], 0, D[i], 0, n);
                B[i] = n + i;
                D[i][n] = -1.0;
                D[i][n + 1] = b[i];
            }
            for (int j = 0; j < n; j++) {
                N[j] = j;
                D[m][j] = -c[j];
            }
            N[n] = -1;
            D[m + 1][n] = 1.0;
        }

        void pivot(int r, int s) {
            double inv = 1.0 / D[r][s];
            for (int i = 0; i < m + 2; i++) {
                if (i != r && Math.abs(D[i][s]) > EPS) {
                    double factor = D[i][s] * inv;
                    for (int j = 0; j < n + 2; j++) {
                        if (j != s) D[i][j] -= D[r][j] * factor;
                    }
                    D[i][s] = -factor;
                }
            }
            for (int j = 0; j < n + 2; j++) if (j != s) D[r][j] *= inv;
            D[r][s] = inv;
            int tmp = B[r]; B[r] = N[s]; N[s] = tmp;
        }

        boolean simplex(int phase) {
            int x = m + (phase == 1 ? 1 : 0);
            while (true) {
                int s = -1;
                for (int j = 0; j <= n; j++) {
                    if (phase == 2 && N[j] == -1) continue;
                    if (D[x][j] < -EPS) {
                        if (s == -1 || N[j] < N[s]) s = j;
                    }
                }
                if (s == -1) return true;
                int r = -1;
                for (int i = 0; i < m; i++) {
                    if (D[i][s] > EPS) {
                        if (r == -1) r = i;
                        else {
                            double lhs = D[i][n + 1] / D[i][s];
                            double rhs = D[r][n + 1] / D[r][s];
                            if (lhs < rhs - EPS || (Math.abs(lhs - rhs) <= EPS && B[i] < B[r])) r = i;
                        }
                    }
                }
                if (r == -1) return false;
                pivot(r, s);
            }
        }

        double solve() {
            int r = 0;
            for (int i = 1; i < m; i++) if (D[i][n + 1] < D[r][n + 1]) r = i;
            if (D[r][n + 1] < -EPS) {
                pivot(r, n);
                if (!simplex(1) || D[m + 1][n + 1] < -EPS) return Double.NEGATIVE_INFINITY;
                for (int i = 0; i < m; i++) if (B[i] == -1) {
                    int s = 0;
                    for (int j = 1; j <= n; j++) if (Math.abs(D[i][j]) > Math.abs(D[i][s])) s = j;
                    pivot(i, s);
                }
            }
            if (!simplex(2)) return Double.POSITIVE_INFINITY;
            return D[m][n + 1];
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
        int m = Integer.parseInt(st.nextToken());
        double[] demand = new double[n];
        for (int i = 0; i < n; i++) {
            while (!st.hasMoreTokens()) st = new StringTokenizer(br.readLine());
            demand[i] = Double.parseDouble(st.nextToken());
        }
        double[][] A = new double[m][n];
        double[] b = new double[m];
        for (int k = 0; k < m; k++) {
            while (!st.hasMoreTokens()) st = new StringTokenizer(br.readLine());
            int l = Integer.parseInt(st.nextToken());
            int r = Integer.parseInt(st.nextToken());
            b[k] = Double.parseDouble(st.nextToken());
            for (int i = l - 1; i <= r - 1; i++) A[k][i] = 1.0;
        }
        LPSolver solver = new LPSolver(A, b, demand);
        double ans = solver.solve();
        if (Double.isInfinite(ans)) {
            System.out.println("INFEASIBLE");
        } else {
            System.out.printf(Locale.US, "%.6f%n", ans);
        }
    }
}`,
        python3: `import sys

EPS = 1e-9

class LPSolver:
    def __init__(self, A, b, c):
        self.m = len(b)
        self.n = len(c)
        self.B = [self.n + i for i in range(self.m)]
        self.N = [j for j in range(self.n)] + [-1]
        self.D = [[0.0] * (self.n + 2) for _ in range(self.m + 2)]
        for i in range(self.m):
            for j in range(self.n):
                self.D[i][j] = float(A[i][j])
            self.D[i][self.n] = -1.0
            self.D[i][self.n + 1] = float(b[i])
        for j in range(self.n):
            self.D[self.m][j] = -float(c[j])
        self.D[self.m + 1][self.n] = 1.0

    def pivot(self, r, s):
        D = self.D
        inv = 1.0 / D[r][s]
        for i in range(self.m + 2):
            if i != r and abs(D[i][s]) > EPS:
                factor = D[i][s] * inv
                row_i = D[i]
                row_r = D[r]
                for j in range(self.n + 2):
                    if j != s:
                        row_i[j] -= row_r[j] * factor
                row_i[s] = -factor
        for j in range(self.n + 2):
            if j != s:
                D[r][j] *= inv
        D[r][s] = inv
        self.B[r], self.N[s] = self.N[s], self.B[r]

    def simplex(self, phase):
        x = self.m + (1 if phase == 1 else 0)
        while True:
            s = -1
            for j in range(self.n + 1):
                if phase == 2 and self.N[j] == -1:
                    continue
                if self.D[x][j] < -EPS:
                    if s == -1 or self.N[j] < self.N[s]:
                        s = j
            if s == -1:
                return True
            r = -1
            for i in range(self.m):
                if self.D[i][s] > EPS:
                    if r == -1:
                        r = i
                    else:
                        lhs = self.D[i][self.n + 1] / self.D[i][s]
                        rhs = self.D[r][self.n + 1] / self.D[r][s]
                        if lhs < rhs - EPS or (abs(lhs - rhs) <= EPS and self.B[i] < self.B[r]):
                            r = i
            if r == -1:
                return False
            self.pivot(r, s)

    def solve(self):
        r = 0
        for i in range(1, self.m):
            if self.D[i][self.n + 1] < self.D[r][self.n + 1]:
                r = i
        if self.D[r][self.n + 1] < -EPS:
            self.pivot(r, self.n)
            if not self.simplex(1) or self.D[self.m + 1][self.n + 1] < -EPS:
                return float('-inf')
            for i in range(self.m):
                if self.B[i] == -1:
                    s = max(range(self.n + 1), key=lambda j: abs(self.D[i][j]))
                    self.pivot(i, s)
        if not self.simplex(2):
            return float('inf')
        return self.D[self.m][self.n + 1]

def main():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    it = iter(tokens)
    n = int(next(it))
    m = int(next(it))
    demand = [float(next(it)) for _ in range(n)]
    A = [[0.0] * n for _ in range(m)]
    b = [0.0] * m
    for k in range(m):
        l = int(next(it))
        r = int(next(it))
        b[k] = float(next(it))
        for i in range(l - 1, r):
            A[k][i] = 1.0
    solver = LPSolver(A, b, demand)
    ans = solver.solve()
    if ans == float('inf') or ans == float('-inf'):
        print("INFEASIBLE")
    else:
        print(f"{ans:.6f}")

if __name__ == '__main__':
    main()`,
        ruby: `EPS = 1e-9

class LPSolver
  def initialize(a, b, c)
    @m = b.size
    @n = c.size
    @b_idx = Array.new(@m) { |i| @n + i }
    @n_idx = Array.new(@n) { |j| j } + [-1]
    @d = Array.new(@m + 2) { Array.new(@n + 2, 0.0) }
    @m.times do |i|
      @n.times { |j| @d[i][j] = a[i][j].to_f }
      @d[i][@n] = -1.0
      @d[i][@n + 1] = b[i].to_f
    end
    @n.times { |j| @d[@m][j] = -c[j].to_f }
    @d[@m + 1][@n] = 1.0
  end

  def pivot(r, s)
    inv = 1.0 / @d[r][s]
    (@m + 2).times do |i|
      if i != r && @d[i][s].abs > EPS
        factor = @d[i][s] * inv
        (@n + 2).times do |j|
          @d[i][j] -= @d[r][j] * factor if j != s
        end
        @d[i][s] = -factor
      end
    end
    (@n + 2).times { |j| @d[r][j] *= inv if j != s }
    @d[r][s] = inv
    @b_idx[r], @n_idx[s] = @n_idx[s], @b_idx[r]
  end

  def simplex(phase)
    x = @m + (phase == 1 ? 1 : 0)
    loop do
      s = -1
      (@n + 1).times do |j|
        next if phase == 2 && @n_idx[j] == -1
        if @d[x][j] < -EPS
          s = j if s == -1 || @n_idx[j] < @n_idx[s]
        end
      end
      return true if s == -1
      r = -1
      @m.times do |i|
        if @d[i][s] > EPS
          if r == -1
            r = i
          else
            lhs = @d[i][@n + 1] / @d[i][s]
            rhs = @d[r][@n + 1] / @d[r][s]
            r = i if lhs < rhs - EPS || ((lhs - rhs).abs <= EPS && @b_idx[i] < @b_idx[r])
          end
        end
      end
      return false if r == -1
      pivot(r, s)
    end
  end

  def solve
    r = 0
    (1...@m).each { |i| r = i if @d[i][@n + 1] < @d[r][@n + 1] }
    if @d[r][@n + 1] < -EPS
      pivot(r, @n)
      return -Float::INFINITY if !simplex(1) || @d[@m + 1][@n + 1] < -EPS
      @m.times do |i|
        if @b_idx[i] == -1
          s = (0..@n).max_by { |j| @d[i][j].abs }
          pivot(i, s)
        end
      end
    end
    return Float::INFINITY unless simplex(2)
    @d[@m][@n + 1]
  end
end

tokens = STDIN.read.split
exit if tokens.empty?
idx = 0
n = tokens[idx].to_i; idx += 1
m = tokens[idx].to_i; idx += 1
demand = Array.new(n) { v = tokens[idx].to_f; idx += 1; v }
a = Array.new(m) { Array.new(n, 0.0) }
b = Array.new(m, 0.0)
m.times do |k|
  l = tokens[idx].to_i; r = tokens[idx + 1].to_i; b[k] = tokens[idx + 2].to_f; idx += 3
  ((l - 1)..(r - 1)).each { |i| a[k][i] = 1.0 }
end
solver = LPSolver.new(a, b, demand)
ans = solver.solve
if ans.infinite?
  puts "INFEASIBLE"
else
  puts format("%.6f", ans)
end`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'Codeforces',
      title: 'LP Duality & Interval Covering / Flow Dualization (CF 1307G / CF 375E)',
      difficulty: '2700',
      url: 'https://codeforces.com/problemset',
      patternNote: 'Whenever a problem minimizes a linear cost over >= covering constraints with non-negative costs, dualize into max b^T y s.t. A^T y <= c so y = 0 is trivially feasible.',
    },
    {
      platform: 'AtCoder',
      title: 'AGC / ABC Total Unimodularity & Continuous LP Relaxations',
      difficulty: '2600',
      url: 'https://atcoder.jp/contests',
      patternNote: 'Contiguous interval matrices have the consecutive-ones property and are Totally Unimodular (TU), guaranteeing exact integer Simplex optima.',
    },
    {
      platform: 'CodeChef',
      title: 'Two-Phase Simplex & Zero-Sum Matrix Games',
      difficulty: '2800',
      url: 'https://www.codechef.com/problems',
      patternNote: 'Shift zero-sum payoff matrices so all entries are positive before reducing to a standard packing LP.',
    },
  ],
  interviewNotes: [
    'Spielman and Teng proved via Smoothed Analysis that under tiny Gaussian perturbations of the constraint matrix A, the expected number of Simplex pivots is polynomial—explaining why pathological Klee-Minty cubes almost never occur in practice.',
    'Complementary Slackness states that primal feasible x and dual feasible y are simultaneously optimal iff x_j > 0 implies dual constraint j is tight and y_i > 0 implies primal constraint i is tight.',
    'If a primal LP has N = 10 variables and M = 2000 constraints, dualizing transposes the tableau into 10 rows and 2000 columns, accelerating Simplex by two orders of magnitude.',
  ],
  projectBlueprint: {
    title: 'Production Mix, Shift Scheduling & Multi-Constraint Portfolio Optimizer',
    tagline: 'Interactive Two-Phase Simplex & Strong Duality sensitivity analysis workbench',
    stackSummary: 'C++20 / TypeScript Two-Phase Bland Simplex Engine + Primal-to-Dual Symbolic Transformer + Shadow-Price Extractor',
    asciiDiagram:
`[Primal / Covering LP] ---> [Primal-to-Dual Transposer] ---> [Phase I Artificial Pivot]
                                                                      |
[Shadow Prices & Optimum] <--- [Phase II Bland Simplex Tableau] <-----+`,
    milestones: [
      { id: 'm1', title: 'Two-Phase Bland Tableau Engine', detail: 'Implement Phase I artificial feasibility recovery and Phase II Bland tie-breaking.' },
      { id: 'm2', title: 'Automatic Primal-Dual Transposer', detail: 'Transform dense covering LPs into compact packing LPs with complementary slackness certificates.' },
      { id: 'm3', title: 'Shadow-Price Sensitivity Dashboard', detail: 'Extract dual multipliers y* from the final tableau row to report marginal constraint values.' },
    ],
    starterCode: `// Two-Phase Simplex pivot core:
// double inv = 1.0 / D[r][s];
// for (int i = 0; i < m + 2; ++i) if (i != r && abs(D[i][s]) > EPS) ...`,
  },
};
