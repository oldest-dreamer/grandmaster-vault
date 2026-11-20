import type { TheoryChapter } from '../../types/vault';

export const CH77_KIRCHHOFF_TUTTE_PFAFFIAN: TheoryChapter = {
  slug: 'matrix-tree-kirchhoff-pfaffian',
  topicId: 'ma-60',
  title: 'Kirchhoff Matrix-Tree Theorem & Tutte / Pfaffian',
  domain: 'Math, Number Theory & Algebra',
  ratingTier: '2600–3300+',
  usacoDivision: 'Advanced',
  subtitle: 'Counting spanning trees and directed arborescences via Laplacian cofactors over prime or composite moduli, algebraic matching size via Tutte skew-symmetric rank, and FKT Pfaffians',
  analogyTitle: 'Turn Combinatorial Cycles Into Determinant Cancellations',
  analogyBody:
    'In any connected graph, enumerating spanning trees directly fails exponentially. Kirchhoff’s Matrix-Tree Theorem replaces combinatorial search with linear algebra via the Binet-Cauchy identity: expressing the Laplacian L = D - A as B * B^T (where B is the signed vertex-edge incidence matrix) ensures every (N - 1) x (N - 1) submatrix of B has determinant +/-1 precisely when those N - 1 edges form a spanning tree, and 0 whenever they contain a cycle.\n\nFor directed out-arborescences rooted at R, replacing the undirected Laplacian with the in-degree directed Laplacian L_in (where L_in[v][v] = indeg(v) and L_in[u][v] = -count(u -> v)) and taking the cofactor deleting row R and column R counts spanning arborescences even modulo arbitrary composite integers P when row elimination uses Euclidean GCD divisions.\n\nFor general graph matchings, Tutte’s skew-symmetric matrix T (with independent random weights T[u][v] = r_e, T[v][u] = -r_e) guarantees det(T) != 0 identically iff a perfect matching exists, and rank(T) / 2 equals the maximum matching cardinality in O(N^3) with overwhelming probability over GF(998244353). For planar graphs, orienting edges so every bounded face has an odd number of clockwise edges turns sqrt(det(T))—the Pfaffian—into an exact deterministic perfect-matching counter (FKT algorithm).',
  prerequisites: [
    { slug: 'xor-basis-gaussian-elimination', title: 'Gaussian Elimination & GF(2) Linear XOR Basis' },
    { slug: 'general-graph-matching-blossom', title: "General Graph Matching & Edmonds' Blossom Algorithm" },
  ],
  traceTitle: 'Kirchhoff Cofactor & Gaussian Elimination on K4 Minus One Edge',
  traceSubtitle: 'Deleting vertex 4 from the 4 x 4 Laplacian and upper-triangularizing the 3 x 3 minor',
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Step 1: Construct Signed Laplacian Matrix L = D - A',
      explanation: 'For edges (1,2), (2,3), (3,4), (4,1), (1,3), degrees are [3, 2, 3, 2]. Ignore self-loops and subtract adjacency counts.',
      mode: 'array',
      arrays: [
        {
          name: 'Laplacian Rows L[1..3][1..4] (Deleting Vertex 4)',
          cells: [
            { index: 1, value: '[3, -1, -1, -1]', label: 'row 1', highlight: 'active' },
            { index: 2, value: '[-1, 2, -1, 0]', label: 'row 2', highlight: 'active' },
            { index: 3, value: '[-1, -1, 3, -1]', label: 'row 3', highlight: 'active' },
            { index: 4, value: '[-1, 0, -1, 2]', label: 'del row 4', highlight: 'neutral' },
          ],
        },
      ],
      variables: { vertices: 4, edges: 5, minorSize: '3 x 3' },
    },
    {
      stepNumber: 2,
      title: 'Step 2: Delete Row 4 & Col 4, Eliminate Pivot Column 1',
      explanation: 'Drop the last vertex row/column to obtain the 3x3 cofactor. Eliminate (-1) below pivot L[1][1] = 3 mod 998244353.',
      mode: 'array',
      arrays: [
        {
          name: '3x3 Minor Rows After Pivot Column 1 Elimination',
          cells: [
            { index: 1, value: '[3, -1, -1]', label: 'pivot 3', highlight: 'updated' },
            { index: 2, value: '[0, 5/3, -4/3]', label: 'row 2', highlight: 'active' },
            { index: 3, value: '[0, -4/3, 8/3]', label: 'row 3', highlight: 'active' },
          ],
        },
      ],
      variables: { pivot1: 3, row2_new: '[0, 5/3, -4/3]', row3_new: '[0, -4/3, 8/3]' },
    },
    {
      stepNumber: 3,
      title: 'Step 3: Upper-Triangular Product Gives Determinant = 8',
      explanation: 'Multiplying upper-triangular diagonal entries 3 * (5/3) * (8/5) mod 998244353 yields exactly 8 spanning trees.',
      mode: 'array',
      arrays: [
        {
          name: 'Upper-Triangular Diagonal Entries',
          cells: [
            { index: 1, value: '3', label: 'diag 1', highlight: 'active' },
            { index: 2, value: '5/3', label: 'diag 2', highlight: 'active' },
            { index: 3, value: '8/5', label: 'diag 3', highlight: 'updated' },
          ],
        },
      ],
      variables: { spanningTrees: 8, formula: '3 * (5/3) * (8/5) = 8' },
    },
  ],
  reductionClues: [
    {
      clue: 'Count all labeled spanning trees of an undirected (weighted) multigraph mod M',
      translation: 'Build L[u][u] += w, L[u][v] -= w, delete any single row/col, and compute the determinant (mod P via GCD if M is composite).',
    },
    {
      clue: 'Count directed spanning out-arborescences rooted at R',
      translation: 'For each directed edge u -> v, add +1 to L[v][v] and -1 to L[u][v]; take the (N-1)x(N-1) cofactor deleting row R and column R.',
    },
    {
      clue: 'Find maximum matching size (or detect perfect matching) via randomized matrix algebra in O(N^3)',
      translation: 'Fill skew-symmetric Tutte matrix T[u][v] = w_e, T[v][u] = -w_e over GF(998244353); max matching size equals rank(T) / 2.',
    },
    {
      clue: 'Count exact number of perfect matchings in a planar graph without modulo randomness',
      translation: 'Construct a Pfaffian orientation (odd clockwise edges on every finite face) via spanning-tree DFS and evaluate sqrt(det(A)) in O(N^3).',
    },
  ],
  timeComplexity: 'O(N^3) for prime-mod determinant / Tutte rank; O(N^3 + N^2 log P) for composite-mod GCD elimination',
  spaceComplexity: 'O(N^2)',
  pitfalls: [
    {
      type: 'WA',
      title: 'Including Self-Loops u == v Inside the Laplacian Matrix',
      detail: 'Self-loops contribute +1 to degree and -1 to adjacency (zero net effect on L, or break in-degree counts). Always skip u == v before touching L.',
    },
    {
      type: 'WA',
      title: 'Deleting the Wrong Laplacian for Directed Out-Arborescences vs In-Arborescences',
      detail: 'Out-arborescences rooted at R require the IN-DEGREE Laplacian (L[v][v] = indeg(v), L[u][v] = -cnt(u->v)) with row R & col R removed; swapping L[u][u] counts in-arborescences into R instead!',
    },
    {
      type: 'WA',
      title: 'Using Modular Inverse When Modulo P Is Composite',
      detail: 'If P is not guaranteed prime, gcd(pivot, P) > 1 causes mod_inv to fail or produce garbage. Use Euclidean GCD row reduction so only integer divisions a[i][c] / a[j][c] are performed.',
    },
    {
      type: 'WA',
      title: 'Reusing a Weak Constant Weight or Non-Skew Entry in Tutte Matrix',
      detail: 'Every edge e = (u, v) needs an independent non-zero pseudorandom weight w_e in [1, MOD - 1] with T[u][v] += w_e and T[v][u] -= w_e; equal weights cancel valid matchings.',
    },
  ],
  implementations: {
    cpp20: `#include <iostream>
#include <vector>

using namespace std;

static constexpr long long MOD = 998244353LL;

long long mod_pow(long long a, long long e) {
    long long r = 1;
    a %= MOD;
    if (a < 0) a += MOD;
    while (e > 0) {
        if (e & 1) r = r * a % MOD;
        a = a * a % MOD;
        e >>= 1;
    }
    return r;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    if (!(cin >> n >> m)) return 0;
    vector<vector<long long>> lap(n, vector<long long>(n, 0));
    for (int i = 0; i < m; ++i) {
        int u, v;
        cin >> u >> v;
        --u;
        --v;
        if (u == v) continue;
        lap[u][u] = (lap[u][u] + 1) % MOD;
        lap[v][v] = (lap[v][v] + 1) % MOD;
        lap[u][v] = (lap[u][v] + MOD - 1) % MOD;
        lap[v][u] = (lap[v][u] + MOD - 1) % MOD;
    }
    if (n == 1) {
        cout << 1 << '\\n';
        return 0;
    }
    int k = n - 1;
    long long det = 1;
    for (int i = 0; i < k; ++i) {
        int piv = -1;
        for (int r = i; r < k; ++r) {
            if (lap[r][i] != 0) {
                piv = r;
                break;
            }
        }
        if (piv == -1) {
            cout << 0 << '\\n';
            return 0;
        }
        if (piv != i) {
            swap(lap[piv], lap[i]);
            det = (MOD - det) % MOD;
        }
        det = det * lap[i][i] % MOD;
        long long inv = mod_pow(lap[i][i], MOD - 2);
        for (int r = i + 1; r < k; ++r) {
            if (lap[r][i] == 0) continue;
            long long factor = lap[r][i] * inv % MOD;
            for (int c = i; c < k; ++c) {
                lap[r][c] = (lap[r][c] - factor * lap[i][c]) % MOD;
                if (lap[r][c] < 0) lap[r][c] += MOD;
            }
        }
    }
    cout << det << '\\n';
    return 0;
}`,
    rust: `use std::io::{self, Read};

const MOD: i64 = 998_244_353;

fn mod_pow(mut a: i64, mut e: i64) -> i64 {
    let mut r = 1i64;
    a = a.rem_euclid(MOD);
    while e > 0 {
        if e & 1 == 1 {
            r = r * a % MOD;
        }
        a = a * a % MOD;
        e >>= 1;
    }
    r
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
    let mut lap = vec![vec![0i64; n]; n];
    for _ in 0..m {
        let u: usize = it.next().unwrap().parse::<usize>().unwrap() - 1;
        let v: usize = it.next().unwrap().parse::<usize>().unwrap() - 1;
        if u == v {
            continue;
        }
        lap[u][u] = (lap[u][u] + 1) % MOD;
        lap[v][v] = (lap[v][v] + 1) % MOD;
        lap[u][v] = (lap[u][v] + MOD - 1) % MOD;
        lap[v][u] = (lap[v][u] + MOD - 1) % MOD;
    }
    if n == 1 {
        println!("1");
        return;
    }
    let k = n - 1;
    let mut det = 1i64;
    for i in 0..k {
        let mut piv = None;
        for r in i..k {
            if lap[r][i] != 0 {
                piv = Some(r);
                break;
            }
        }
        let piv = match piv {
            Some(p) => p,
            None => {
                println!("0");
                return;
            }
        };
        if piv != i {
            lap.swap(piv, i);
            det = (MOD - det) % MOD;
        }
        det = det * lap[i][i] % MOD;
        let inv = mod_pow(lap[i][i], MOD - 2);
        for r in (i + 1)..k {
            if lap[r][i] == 0 {
                continue;
            }
            let factor = lap[r][i] * inv % MOD;
            for c in i..k {
                lap[r][c] = (lap[r][c] - factor * lap[i][c]).rem_euclid(MOD);
            }
        }
    }
    println!("{}", det);
}`,
    java21: `import java.io.BufferedInputStream;
import java.io.IOException;

public class Main {
    static final long MOD = 998244353L;

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

        int nextInt() throws IOException {
            int c = readByte();
            while (c >= 0 && c <= 32) c = readByte();
            if (c < 0) return 0;
            int res = 0;
            while (c > 32) {
                res = res * 10 + (c - '0');
                c = readByte();
            }
            return res;
        }
    }

    static long modPow(long a, long e) {
        long r = 1;
        a %= MOD;
        if (a < 0) a += MOD;
        while (e > 0) {
            if ((e & 1L) != 0) r = r * a % MOD;
            a = a * a % MOD;
            e >>= 1;
        }
        return r;
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        int n = fs.nextInt();
        if (n == 0) return;
        int m = fs.nextInt();
        long[][] lap = new long[n][n];
        for (int i = 0; i < m; i++) {
            int u = fs.nextInt() - 1;
            int v = fs.nextInt() - 1;
            if (u == v) continue;
            lap[u][u] = (lap[u][u] + 1) % MOD;
            lap[v][v] = (lap[v][v] + 1) % MOD;
            lap[u][v] = (lap[u][v] + MOD - 1) % MOD;
            lap[v][u] = (lap[v][u] + MOD - 1) % MOD;
        }
        if (n == 1) {
            System.out.println(1);
            return;
        }
        int k = n - 1;
        long det = 1;
        for (int i = 0; i < k; i++) {
            int piv = -1;
            for (int r = i; r < k; r++) {
                if (lap[r][i] != 0) {
                    piv = r;
                    break;
                }
            }
            if (piv == -1) {
                System.out.println(0);
                return;
            }
            if (piv != i) {
                long[] tmp = lap[piv];
                lap[piv] = lap[i];
                lap[i] = tmp;
                det = (MOD - det) % MOD;
            }
            det = det * lap[i][i] % MOD;
            long inv = modPow(lap[i][i], MOD - 2);
            for (int r = i + 1; r < k; r++) {
                if (lap[r][i] == 0) continue;
                long factor = lap[r][i] * inv % MOD;
                for (int c = i; c < k; c++) {
                    lap[r][c] = (lap[r][c] - factor * lap[i][c]) % MOD;
                    if (lap[r][c] < 0) lap[r][c] += MOD;
                }
            }
        }
        System.out.println(det);
    }
}`,
    python3: `import sys

sys.setrecursionlimit(200000)
MOD = 998244353


def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    m = int(data[1])
    lap = [[0] * n for _ in range(n)]
    idx = 2
    for _ in range(m):
        u = int(data[idx]) - 1
        v = int(data[idx + 1]) - 1
        idx += 2
        if u == v:
            continue
        lap[u][u] = (lap[u][u] + 1) % MOD
        lap[v][v] = (lap[v][v] + 1) % MOD
        lap[u][v] = (lap[u][v] - 1) % MOD
        lap[v][u] = (lap[v][u] - 1) % MOD

    if n == 1:
        sys.stdout.write("1\\n")
        return

    k = n - 1
    det = 1
    for i in range(k):
        piv = -1
        for r in range(i, k):
            if lap[r][i] != 0:
                piv = r
                break
        if piv == -1:
            sys.stdout.write("0\\n")
            return
        if piv != i:
            lap[piv], lap[i] = lap[i], lap[piv]
            det = (MOD - det) % MOD
        det = det * lap[i][i] % MOD
        inv = pow(lap[i][i], MOD - 2, MOD)
        row_i = lap[i]
        for r in range(i + 1, k):
            if lap[r][i] == 0:
                continue
            factor = lap[r][i] * inv % MOD
            row_r = lap[r]
            for c in range(i, k):
                row_r[c] = (row_r[c] - factor * row_i[c]) % MOD
    sys.stdout.write(f"{det}\\n")


if __name__ == "__main__":
    solve()`,
    ruby: `MOD = 998_244_353

def mod_pow(a, e)
  r = 1
  a %= MOD
  while e > 0
    r = (r * a) % MOD if (e & 1) == 1
    a = (a * a) % MOD
    e >>= 1
  end
  r
end

data = STDIN.read.split
exit if data.empty?
n = data[0].to_i
m = data[1].to_i
lap = Array.new(n) { Array.new(n, 0) }
idx = 2
m.times do
  u = data[idx].to_i - 1
  v = data[idx + 1].to_i - 1
  idx += 2
  next if u == v
  lap[u][u] = (lap[u][u] + 1) % MOD
  lap[v][v] = (lap[v][v] + 1) % MOD
  lap[u][v] = (lap[u][v] - 1) % MOD
  lap[v][u] = (lap[v][u] - 1) % MOD
end

if n == 1
  puts 1
  exit
end

k = n - 1
det = 1
(0...k).each do |i|
  piv = (i...k).find { |r| lap[r][i] != 0 }
  if piv.nil?
    puts 0
    exit
  end
  if piv != i
    lap[piv], lap[i] = lap[i], lap[piv]
    det = (MOD - det) % MOD
  end
  det = (det * lap[i][i]) % MOD
  inv = mod_pow(lap[i][i], MOD - 2)
  ((i + 1)...k).each do |r|
    next if lap[r][i] == 0
    factor = (lap[r][i] * inv) % MOD
    (i...k).each do |c|
      lap[r][c] = (lap[r][c] - factor * lap[i][c]) % MOD
    end
  end
end
puts det`,
  },
  practiceProblems: [
    {
      id: 'ch77-p1',
      tier: 'Warmup',
      ratingRange: '2400–2700',
      title: 'Counting Spanning Trees of an Undirected Multigraph',
      statement:
        'Given an undirected multigraph with N vertices (1 <= N <= 300) and M edges (0 <= M <= 20000), count the number of labeled spanning trees modulo 998244353. Self-loops may be present in the input.',
      constraints: '1 <= N <= 300; 0 <= M <= 20000; Time Limit: 1.5s',
      sampleInput: '4 5\n1 2\n2 3\n3 4\n4 1\n1 3',
      sampleOutput: '8',
      hints: [
        'Ignore self-loops (u == v) and accumulate L[u][u] += 1, L[v][v] += 1, L[u][v] -= 1, L[v][u] -= 1 for every undirected edge (u, v).',
        'Delete the last row and last column and compute the (N - 1) x (N - 1) determinant via Gaussian elimination modulo 998244353 (returning 1 when N = 1).',
      ],
      solutions: {
        cpp20: `#include <iostream>
#include <vector>

using namespace std;

static constexpr long long MOD = 998244353LL;

long long mod_pow(long long a, long long e) {
    long long r = 1;
    a %= MOD;
    while (e > 0) {
        if (e & 1) r = r * a % MOD;
        a = a * a % MOD;
        e >>= 1;
    }
    return r;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    if (!(cin >> n >> m)) return 0;
    vector<vector<long long>> lap(n, vector<long long>(n, 0));
    for (int i = 0; i < m; ++i) {
        int u, v;
        cin >> u >> v;
        --u;
        --v;
        if (u == v) continue;
        lap[u][u] = (lap[u][u] + 1) % MOD;
        lap[v][v] = (lap[v][v] + 1) % MOD;
        lap[u][v] = (lap[u][v] + MOD - 1) % MOD;
        lap[v][u] = (lap[v][u] + MOD - 1) % MOD;
    }
    if (n == 1) {
        cout << 1 << '\\n';
        return 0;
    }
    int k = n - 1;
    long long det = 1;
    for (int i = 0; i < k; ++i) {
        int piv = -1;
        for (int r = i; r < k; ++r) {
            if (lap[r][i] != 0) {
                piv = r;
                break;
            }
        }
        if (piv == -1) {
            cout << 0 << '\\n';
            return 0;
        }
        if (piv != i) {
            swap(lap[piv], lap[i]);
            det = (MOD - det) % MOD;
        }
        det = det * lap[i][i] % MOD;
        long long inv = mod_pow(lap[i][i], MOD - 2);
        for (int r = i + 1; r < k; ++r) {
            if (lap[r][i] == 0) continue;
            long long f = lap[r][i] * inv % MOD;
            for (int c = i; c < k; ++c) {
                lap[r][c] = (lap[r][c] - f * lap[i][c]) % MOD;
                if (lap[r][c] < 0) lap[r][c] += MOD;
            }
        }
    }
    cout << det << '\\n';
    return 0;
}`,
        rust: `use std::io::{self, Read};

const MOD: i64 = 998_244_353;

fn mod_pow(mut a: i64, mut e: i64) -> i64 {
    let mut r = 1i64;
    a = a.rem_euclid(MOD);
    while e > 0 {
        if e & 1 == 1 { r = r * a % MOD; }
        a = a * a % MOD;
        e >>= 1;
    }
    r
}

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let n: usize = match it.next() { Some(v) => v.parse().unwrap(), None => return };
    let m: usize = it.next().unwrap().parse().unwrap();
    let mut lap = vec![vec![0i64; n]; n];
    for _ in 0..m {
        let u: usize = it.next().unwrap().parse::<usize>().unwrap() - 1;
        let v: usize = it.next().unwrap().parse::<usize>().unwrap() - 1;
        if u == v { continue; }
        lap[u][u] = (lap[u][u] + 1) % MOD;
        lap[v][v] = (lap[v][v] + 1) % MOD;
        lap[u][v] = (lap[u][v] + MOD - 1) % MOD;
        lap[v][u] = (lap[v][u] + MOD - 1) % MOD;
    }
    if n == 1 { println!("1"); return; }
    let k = n - 1;
    let mut det = 1i64;
    for i in 0..k {
        let mut piv = None;
        for r in i..k {
            if lap[r][i] != 0 { piv = Some(r); break; }
        }
        let piv = match piv { Some(p) => p, None => { println!("0"); return; } };
        if piv != i {
            lap.swap(piv, i);
            det = (MOD - det) % MOD;
        }
        det = det * lap[i][i] % MOD;
        let inv = mod_pow(lap[i][i], MOD - 2);
        for r in (i + 1)..k {
            if lap[r][i] == 0 { continue; }
            let f = lap[r][i] * inv % MOD;
            for c in i..k {
                lap[r][c] = (lap[r][c] - f * lap[i][c]).rem_euclid(MOD);
            }
        }
    }
    println!("{}", det);
}`,
        java21: `import java.io.BufferedInputStream;
import java.io.IOException;

public class Main {
    static final long MOD = 998244353L;

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

        int nextInt() throws IOException {
            int c = readByte();
            while (c >= 0 && c <= 32) c = readByte();
            if (c < 0) return 0;
            int res = 0;
            while (c > 32) {
                res = res * 10 + (c - '0');
                c = readByte();
            }
            return res;
        }
    }

    static long modPow(long a, long e) {
        long r = 1;
        a %= MOD;
        while (e > 0) {
            if ((e & 1L) != 0) r = r * a % MOD;
            a = a * a % MOD;
            e >>= 1;
        }
        return r;
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        int n = fs.nextInt();
        if (n == 0) return;
        int m = fs.nextInt();
        long[][] lap = new long[n][n];
        for (int i = 0; i < m; i++) {
            int u = fs.nextInt() - 1;
            int v = fs.nextInt() - 1;
            if (u == v) continue;
            lap[u][u] = (lap[u][u] + 1) % MOD;
            lap[v][v] = (lap[v][v] + 1) % MOD;
            lap[u][v] = (lap[u][v] + MOD - 1) % MOD;
            lap[v][u] = (lap[v][u] + MOD - 1) % MOD;
        }
        if (n == 1) {
            System.out.println(1);
            return;
        }
        int k = n - 1;
        long det = 1;
        for (int i = 0; i < k; i++) {
            int piv = -1;
            for (int r = i; r < k; r++) {
                if (lap[r][i] != 0) { piv = r; break; }
            }
            if (piv == -1) { System.out.println(0); return; }
            if (piv != i) {
                long[] tmp = lap[piv]; lap[piv] = lap[i]; lap[i] = tmp;
                det = (MOD - det) % MOD;
            }
            det = det * lap[i][i] % MOD;
            long inv = modPow(lap[i][i], MOD - 2);
            for (int r = i + 1; r < k; r++) {
                if (lap[r][i] == 0) continue;
                long f = lap[r][i] * inv % MOD;
                for (int c = i; c < k; c++) {
                    lap[r][c] = (lap[r][c] - f * lap[i][c]) % MOD;
                    if (lap[r][c] < 0) lap[r][c] += MOD;
                }
            }
        }
        System.out.println(det);
    }
}`,
        python3: `import sys

sys.setrecursionlimit(200000)
MOD = 998244353


def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    m = int(data[1])
    lap = [[0] * n for _ in range(n)]
    idx = 2
    for _ in range(m):
        u = int(data[idx]) - 1
        v = int(data[idx + 1]) - 1
        idx += 2
        if u == v:
            continue
        lap[u][u] = (lap[u][u] + 1) % MOD
        lap[v][v] = (lap[v][v] + 1) % MOD
        lap[u][v] = (lap[u][v] - 1) % MOD
        lap[v][u] = (lap[v][u] - 1) % MOD
    if n == 1:
        sys.stdout.write("1\\n")
        return
    k = n - 1
    det = 1
    for i in range(k):
        piv = -1
        for r in range(i, k):
            if lap[r][i] != 0:
                piv = r
                break
        if piv == -1:
            sys.stdout.write("0\\n")
            return
        if piv != i:
            lap[piv], lap[i] = lap[i], lap[piv]
            det = (MOD - det) % MOD
        det = det * lap[i][i] % MOD
        inv = pow(lap[i][i], MOD - 2, MOD)
        ri = lap[i]
        for r in range(i + 1, k):
            if lap[r][i] == 0:
                continue
            f = lap[r][i] * inv % MOD
            rr = lap[r]
            for c in range(i, k):
                rr[c] = (rr[c] - f * ri[c]) % MOD
    sys.stdout.write(f"{det}\\n")


if __name__ == "__main__":
    solve()`,
        ruby: `MOD = 998_244_353

def mod_pow(a, e)
  r = 1
  a %= MOD
  while e > 0
    r = (r * a) % MOD if (e & 1) == 1
    a = (a * a) % MOD
    e >>= 1
  end
  r
end

data = STDIN.read.split
exit if data.empty?
n = data[0].to_i
m = data[1].to_i
lap = Array.new(n) { Array.new(n, 0) }
idx = 2
m.times do
  u = data[idx].to_i - 1
  v = data[idx + 1].to_i - 1
  idx += 2
  next if u == v
  lap[u][u] = (lap[u][u] + 1) % MOD
  lap[v][v] = (lap[v][v] + 1) % MOD
  lap[u][v] = (lap[u][v] - 1) % MOD
  lap[v][u] = (lap[v][u] - 1) % MOD
end
if n == 1
  puts 1
  exit
end
k = n - 1
det = 1
(0...k).each do |i|
  piv = (i...k).find { |r| lap[r][i] != 0 }
  if piv.nil?
    puts 0
    exit
  end
  if piv != i
    lap[piv], lap[i] = lap[i], lap[piv]
    det = (MOD - det) % MOD
  end
  det = (det * lap[i][i]) % MOD
  inv = mod_pow(lap[i][i], MOD - 2)
  ((i + 1)...k).each do |r|
    next if lap[r][i] == 0
    f = (lap[r][i] * inv) % MOD
    (i...k).each { |c| lap[r][c] = (lap[r][c] - f * lap[i][c]) % MOD }
  end
end
puts det`,
      },
    },
    {
      id: 'ch77-p2',
      tier: 'Standard',
      ratingRange: '2600–2900',
      title: 'Directed Arborescences from Root R Modulo Composite P',
      statement:
        'Given a directed multigraph with N vertices (1 <= N <= 300), M directed edges u -> v (0 <= M <= 20000), a fixed root R (1 <= R <= N), and an arbitrary positive integer modulus P (1 <= P <= 10^9, not necessarily prime), count the number of directed spanning out-arborescences rooted at R modulo P.',
      constraints: '1 <= N <= 300; 0 <= M <= 20000; 1 <= R <= N; 1 <= P <= 10^9; Time Limit: 2.0s',
      sampleInput: '4 7 1 10\n1 2\n1 2\n1 3\n1 4\n2 3\n3 4\n4 2',
      sampleOutput: '1',
      hints: [
        'Construct the directed in-degree Laplacian: for each non-loop edge u -> v, add +1 to L[v][v] and -1 to L[u][v], then extract the (N - 1) x (N - 1) minor deleting row R and column R.',
        'Because P may be composite, eliminate column i via Euclidean GCD division loops (while a[j][i] != 0: t = a[i][i] / a[j][i], subtract row j * t from row i, swap rows i and j, flip determinant sign).',
      ],
      solutions: {
        cpp20: `#include <iostream>
#include <vector>

using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m, root;
    long long P;
    if (!(cin >> n >> m >> root >> P)) return 0;
    --root;
    if (P == 1) {
        for (int i = 0; i < m; ++i) {
            int u, v;
            cin >> u >> v;
        }
        cout << 0 << '\\n';
        return 0;
    }

    vector<vector<long long>> lap(n, vector<long long>(n, 0));
    for (int i = 0; i < m; ++i) {
        int u, v;
        cin >> u >> v;
        --u;
        --v;
        if (u == v) continue;
        lap[v][v] = (lap[v][v] + 1) % P;
        lap[u][v] = (lap[u][v] + P - 1) % P;
    }
    if (n == 1) {
        cout << (1 % P) << '\\n';
        return 0;
    }

    int k = n - 1;
    vector<vector<long long>> a(k, vector<long long>(k, 0));
    for (int r = 0, rr = 0; r < n; ++r) {
        if (r == root) continue;
        for (int c = 0, cc = 0; c < n; ++c) {
            if (c == root) continue;
            a[rr][cc++] = lap[r][c] % P;
        }
        ++rr;
    }

    long long det = 1 % P;
    for (int i = 0; i < k; ++i) {
        for (int j = i + 1; j < k; ++j) {
            while (a[j][i] != 0) {
                long long t = a[i][i] / a[j][i];
                if (t != 0) {
                    for (int c = i; c < k; ++c) {
                        a[i][c] = (a[i][c] - t * a[j][c]) % P;
                        if (a[i][c] < 0) a[i][c] += P;
                    }
                }
                swap(a[i], a[j]);
                det = (P - det) % P;
            }
        }
        if (a[i][i] == 0) {
            cout << 0 << '\\n';
            return 0;
        }
        det = det * a[i][i] % P;
    }
    cout << det << '\\n';
    return 0;
}`,
        rust: `use std::io::{self, Read};

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let n: usize = match it.next() { Some(v) => v.parse().unwrap(), None => return };
    let m: usize = it.next().unwrap().parse().unwrap();
    let root: usize = it.next().unwrap().parse::<usize>().unwrap() - 1;
    let p: i64 = it.next().unwrap().parse().unwrap();
    if p == 1 {
        println!("0");
        return;
    }

    let mut lap = vec![vec![0i64; n]; n];
    for _ in 0..m {
        let u: usize = it.next().unwrap().parse::<usize>().unwrap() - 1;
        let v: usize = it.next().unwrap().parse::<usize>().unwrap() - 1;
        if u == v { continue; }
        lap[v][v] = (lap[v][v] + 1) % p;
        lap[u][v] = (lap[u][v] + p - 1) % p;
    }
    if n == 1 {
        println!("{}", 1 % p);
        return;
    }

    let k = n - 1;
    let mut a = vec![vec![0i64; k]; k];
    let mut rr = 0;
    for r in 0..n {
        if r == root { continue; }
        let mut cc = 0;
        for c in 0..n {
            if c == root { continue; }
            a[rr][cc] = lap[r][c].rem_euclid(p);
            cc += 1;
        }
        rr += 1;
    }

    let mut det = 1i64 % p;
    for i in 0..k {
        for j in (i + 1)..k {
            while a[j][i] != 0 {
                let t = a[i][i] / a[j][i];
                if t != 0 {
                    for c in i..k {
                        a[i][c] = (a[i][c] - t * a[j][c]).rem_euclid(p);
                    }
                }
                a.swap(i, j);
                det = (p - det) % p;
            }
        }
        if a[i][i] == 0 {
            println!("0");
            return;
        }
        det = det * a[i][i] % p;
    }
    println!("{}", det);
}`,
        java21: `import java.io.BufferedInputStream;
import java.io.IOException;

public class Main {
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

        long nextLong() throws IOException {
            int c = readByte();
            while (c >= 0 && c <= 32) c = readByte();
            if (c < 0) return 0;
            long res = 0;
            while (c > 32) {
                res = res * 10 + (c - '0');
                c = readByte();
            }
            return res;
        }
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        int n = (int) fs.nextLong();
        if (n == 0) return;
        int m = (int) fs.nextLong();
        int root = (int) fs.nextLong() - 1;
        long P = fs.nextLong();
        if (P == 1) {
            System.out.println(0);
            return;
        }
        long[][] lap = new long[n][n];
        for (int i = 0; i < m; i++) {
            int u = (int) fs.nextLong() - 1;
            int v = (int) fs.nextLong() - 1;
            if (u == v) continue;
            lap[v][v] = (lap[v][v] + 1) % P;
            lap[u][v] = (lap[u][v] + P - 1) % P;
        }
        if (n == 1) {
            System.out.println(1 % P);
            return;
        }
        int k = n - 1;
        long[][] a = new long[k][k];
        for (int r = 0, rr = 0; r < n; r++) {
            if (r == root) continue;
            for (int c = 0, cc = 0; c < n; c++) {
                if (c == root) continue;
                a[rr][cc++] = lap[r][c] % P;
            }
            rr++;
        }
        long det = 1 % P;
        for (int i = 0; i < k; i++) {
            for (int j = i + 1; j < k; j++) {
                while (a[j][i] != 0) {
                    long t = a[i][i] / a[j][i];
                    if (t != 0) {
                        for (int c = i; c < k; c++) {
                            a[i][c] = (a[i][c] - t * a[j][c]) % P;
                            if (a[i][c] < 0) a[i][c] += P;
                        }
                    }
                    long[] tmp = a[i]; a[i] = a[j]; a[j] = tmp;
                    det = (P - det) % P;
                }
            }
            if (a[i][i] == 0) {
                System.out.println(0);
                return;
            }
            det = det * a[i][i] % P;
        }
        System.out.println(det);
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
    root = int(data[2]) - 1
    P = int(data[3])
    if P == 1:
        sys.stdout.write("0\\n")
        return

    lap = [[0] * n for _ in range(n)]
    idx = 4
    for _ in range(m):
        u = int(data[idx]) - 1
        v = int(data[idx + 1]) - 1
        idx += 2
        if u == v:
            continue
        lap[v][v] = (lap[v][v] + 1) % P
        lap[u][v] = (lap[u][v] - 1) % P

    if n == 1:
        sys.stdout.write(f"{1 % P}\\n")
        return

    k = n - 1
    a = [
        [lap[r][c] % P for c in range(n) if c != root]
        for r in range(n)
        if r != root
    ]

    det = 1 % P
    for i in range(k):
        for j in range(i + 1, k):
            while a[j][i] != 0:
                t = a[i][i] // a[j][i]
                if t:
                    ri = a[i]
                    rj = a[j]
                    for c in range(i, k):
                        ri[c] = (ri[c] - t * rj[c]) % P
                a[i], a[j] = a[j], a[i]
                det = (P - det) % P
        if a[i][i] == 0:
            sys.stdout.write("0\\n")
            return
        det = det * a[i][i] % P
    sys.stdout.write(f"{det}\\n")


if __name__ == "__main__":
    solve()`,
        ruby: `data = STDIN.read.split
exit if data.empty?
n = data[0].to_i
m = data[1].to_i
root = data[2].to_i - 1
mod_p = data[3].to_i
if mod_p == 1
  puts 0
  exit
end

lap = Array.new(n) { Array.new(n, 0) }
idx = 4
m.times do
  u = data[idx].to_i - 1
  v = data[idx + 1].to_i - 1
  idx += 2
  next if u == v
  lap[v][v] = (lap[v][v] + 1) % mod_p
  lap[u][v] = (lap[u][v] - 1) % mod_p
end

if n == 1
  puts 1 % mod_p
  exit
end

k = n - 1
a = []
(0...n).each do |r|
  next if r == root
  row = []
  (0...n).each do |c|
    next if c == root
    row << (lap[r][c] % mod_p)
  end
  a << row
end

det = 1 % mod_p
(0...k).each do |i|
  ((i + 1)...k).each do |j|
    while a[j][i] != 0
      t = a[i][i] / a[j][i]
      if t != 0
        (i...k).each do |c|
          a[i][c] = (a[i][c] - t * a[j][c]) % mod_p
        end
      end
      a[i], a[j] = a[j], a[i]
      det = (mod_p - det) % mod_p
    end
  end
  if a[i][i] == 0
    puts 0
    exit
  end
  det = (det * a[i][i]) % mod_p
end
puts det`,
      },
    },
    {
      id: 'ch77-p3',
      tier: 'Boss',
      ratingRange: '2800–3300+',
      title: 'General Graph Maximum Matching via Tutte Matrix Rank',
      statement:
        'Given an arbitrary undirected graph G with N vertices (1 <= N <= 300) and M edges (0 <= M <= N * (N - 1) / 2), compute the exact maximum cardinality of a matching in G without Edmonds’ Blossom algorithm by evaluating the algebraic rank of its randomized Tutte skew-symmetric matrix over GF(998244353).',
      constraints: '1 <= N <= 300; 0 <= M <= 44850; Time Limit: 1.5s',
      sampleInput: '6 6\n1 2\n2 3\n3 4\n4 5\n5 1\n5 6',
      sampleOutput: '3',
      hints: [
        'Build an N x N matrix T where each undirected edge e = (u, v) with u < v receives an independent non-zero weight w_e in [1, MOD - 1], setting T[u][v] += w_e and T[v][u] -= w_e mod 998244353.',
        'By Lovasz’s theorem, the maximum matching size nu(G) satisfies rank(T) <= 2 * nu(G) with equality holding with probability at least 1 - N / 998244353.',
      ],
      solutions: {
        cpp20: `#include <algorithm>
#include <cstdint>
#include <iostream>
#include <vector>

using namespace std;

static constexpr long long MOD = 998244353LL;

long long mod_pow(long long a, long long e) {
    long long r = 1;
    a %= MOD;
    while (e > 0) {
        if (e & 1) r = r * a % MOD;
        a = a * a % MOD;
        e >>= 1;
    }
    return r;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    if (!(cin >> n >> m)) return 0;

    vector<vector<long long>> mat(n, vector<long long>(n, 0));
    uint64_t seed = 0x9E3779B97F4A7C15ULL ^ (uint64_t)n;
    auto next_w = [&]() -> long long {
        seed += 0x9E3779B97F4A7C15ULL;
        uint64_t z = seed;
        z = (z ^ (z >> 30)) * 0xBF58476D1CE4E5B9ULL;
        z = (z ^ (z >> 27)) * 0x94D049BB133111EBULL;
        z ^= z >> 31;
        return (long long)(z % (MOD - 1)) + 1;
    };

    for (int i = 0; i < m; ++i) {
        int u, v;
        cin >> u >> v;
        --u;
        --v;
        if (u == v) continue;
        if (u > v) swap(u, v);
        long long w = next_w();
        mat[u][v] = (mat[u][v] + w) % MOD;
        mat[v][u] = (mat[v][u] + MOD - w) % MOD;
    }

    int rank = 0;
    for (int col = 0; col < n && rank < n; ++col) {
        int piv = -1;
        for (int r = rank; r < n; ++r) {
            if (mat[r][col] != 0) {
                piv = r;
                break;
            }
        }
        if (piv == -1) continue;
        swap(mat[piv], mat[rank]);
        long long inv = mod_pow(mat[rank][col], MOD - 2);
        for (int r = rank + 1; r < n; ++r) {
            if (mat[r][col] == 0) continue;
            long long f = mat[r][col] * inv % MOD;
            for (int c = col; c < n; ++c) {
                mat[r][c] = (mat[r][c] - f * mat[rank][c]) % MOD;
                if (mat[r][c] < 0) mat[r][c] += MOD;
            }
        }
        ++rank;
    }
    cout << (rank / 2) << '\\n';
    return 0;
}`,
        rust: `use std::io::{self, Read};

const MOD: i64 = 998_244_353;

fn mod_pow(mut a: i64, mut e: i64) -> i64 {
    let mut r = 1i64;
    a = a.rem_euclid(MOD);
    while e > 0 {
        if e & 1 == 1 { r = r * a % MOD; }
        a = a * a % MOD;
        e >>= 1;
    }
    r
}

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let n: usize = match it.next() { Some(v) => v.parse().unwrap(), None => return };
    let m: usize = it.next().unwrap().parse().unwrap();
    let mut mat = vec![vec![0i64; n]; n];
    let mut seed: u64 = 0x9E37_79B9_7F4A_7C15 ^ (n as u64);
    let mut next_w = || -> i64 {
        seed = seed.wrapping_add(0x9E37_79B9_7F4A_7C15);
        let mut z = seed;
        z = (z ^ (z >> 30)).wrapping_mul(0xBF58_476D_1CE4_E5B9);
        z = (z ^ (z >> 27)).wrapping_mul(0x94D0_49BB_1331_11EB);
        z ^= z >> 31;
        ((z % ((MOD - 1) as u64)) as i64) + 1
    };

    for _ in 0..m {
        let mut u: usize = it.next().unwrap().parse::<usize>().unwrap() - 1;
        let mut v: usize = it.next().unwrap().parse::<usize>().unwrap() - 1;
        if u == v { continue; }
        if u > v { std::mem::swap(&mut u, &mut v); }
        let w = next_w();
        mat[u][v] = (mat[u][v] + w) % MOD;
        mat[v][u] = (mat[v][u] + MOD - w) % MOD;
    }

    let mut rank = 0usize;
    for col in 0..n {
        if rank >= n { break; }
        let mut piv = None;
        for r in rank..n {
            if mat[r][col] != 0 { piv = Some(r); break; }
        }
        let piv = match piv { Some(p) => p, None => continue };
        mat.swap(piv, rank);
        let inv = mod_pow(mat[rank][col], MOD - 2);
        for r in (rank + 1)..n {
            if mat[r][col] == 0 { continue; }
            let f = mat[r][col] * inv % MOD;
            for c in col..n {
                mat[r][c] = (mat[r][c] - f * mat[rank][c]).rem_euclid(MOD);
            }
        }
        rank += 1;
    }
    println!("{}", rank / 2);
}`,
        java21: `import java.io.BufferedInputStream;
import java.io.IOException;

public class Main {
    static final long MOD = 998244353L;

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

        int nextInt() throws IOException {
            int c = readByte();
            while (c >= 0 && c <= 32) c = readByte();
            if (c < 0) return 0;
            int res = 0;
            while (c > 32) {
                res = res * 10 + (c - '0');
                c = readByte();
            }
            return res;
        }
    }

    static long modPow(long a, long e) {
        long r = 1;
        a %= MOD;
        while (e > 0) {
            if ((e & 1L) != 0) r = r * a % MOD;
            a = a * a % MOD;
            e >>= 1;
        }
        return r;
    }

    static long seed;

    static long nextW() {
        seed += 0x9E3779B97F4A7C15L;
        long z = seed;
        z = (z ^ (z >>> 30)) * 0xBF58476D1CE4E5B9L;
        z = (z ^ (z >>> 27)) * 0x94D049BB133111EBL;
        z ^= z >>> 31;
        return Long.remainderUnsigned(z, MOD - 1L) + 1L;
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        int n = fs.nextInt();
        if (n == 0) return;
        int m = fs.nextInt();
        long[][] mat = new long[n][n];
        seed = 0x9E3779B97F4A7C15L ^ n;
        for (int i = 0; i < m; i++) {
            int u = fs.nextInt() - 1;
            int v = fs.nextInt() - 1;
            if (u == v) continue;
            if (u > v) { int t = u; u = v; v = t; }
            long w = nextW();
            mat[u][v] = (mat[u][v] + w) % MOD;
            mat[v][u] = (mat[v][u] + MOD - w) % MOD;
        }
        int rank = 0;
        for (int col = 0; col < n && rank < n; col++) {
            int piv = -1;
            for (int r = rank; r < n; r++) {
                if (mat[r][col] != 0) { piv = r; break; }
            }
            if (piv == -1) continue;
            long[] tmp = mat[piv]; mat[piv] = mat[rank]; mat[rank] = tmp;
            long inv = modPow(mat[rank][col], MOD - 2);
            for (int r = rank + 1; r < n; r++) {
                if (mat[r][col] == 0) continue;
                long f = mat[r][col] * inv % MOD;
                for (int c = col; c < n; c++) {
                    mat[r][c] = (mat[r][c] - f * mat[rank][c]) % MOD;
                    if (mat[r][c] < 0) mat[r][c] += MOD;
                }
            }
            rank++;
        }
        System.out.println(rank / 2);
    }
}`,
        python3: `import sys

sys.setrecursionlimit(200000)
MOD = 998244353
MASK64 = (1 << 64) - 1


def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    m = int(data[1])
    mat = [[0] * n for _ in range(n)]
    seed = (0x9E3779B97F4A7C15 ^ n) & MASK64
    idx = 2
    for _ in range(m):
        u = int(data[idx]) - 1
        v = int(data[idx + 1]) - 1
        idx += 2
        if u == v:
            continue
        if u > v:
            u, v = v, u
        seed = (seed + 0x9E3779B97F4A7C15) & MASK64
        z = seed
        z = ((z ^ (z >> 30)) * 0xBF58476D1CE4E5B9) & MASK64
        z = ((z ^ (z >> 27)) * 0x94D049BB133111EB) & MASK64
        z = (z ^ (z >> 31)) & MASK64
        w = (z % (MOD - 1)) + 1
        mat[u][v] = (mat[u][v] + w) % MOD
        mat[v][u] = (mat[v][u] - w) % MOD

    rank = 0
    for col in range(n):
        if rank >= n:
            break
        piv = -1
        for r in range(rank, n):
            if mat[r][col] != 0:
                piv = r
                break
        if piv == -1:
            continue
        mat[piv], mat[rank] = mat[rank], mat[piv]
        inv = pow(mat[rank][col], MOD - 2, MOD)
        r_row = mat[rank]
        for r in range(rank + 1, n):
            if mat[r][col] == 0:
                continue
            f = mat[r][col] * inv % MOD
            cur = mat[r]
            for c in range(col, n):
                cur[c] = (cur[c] - f * r_row[c]) % MOD
        rank += 1
    sys.stdout.write(f"{rank // 2}\\n")


if __name__ == "__main__":
    solve()`,
        ruby: `MOD = 998_244_353
MASK64 = (1 << 64) - 1

def mod_pow(a, e)
  r = 1
  a %= MOD
  while e > 0
    r = (r * a) % MOD if (e & 1) == 1
    a = (a * a) % MOD
    e >>= 1
  end
  r
end

data = STDIN.read.split
exit if data.empty?
n = data[0].to_i
m = data[1].to_i
mat = Array.new(n) { Array.new(n, 0) }
seed = (0x9E3779B97F4A7C15 ^ n) & MASK64
idx = 2
m.times do
  u = data[idx].to_i - 1
  v = data[idx + 1].to_i - 1
  idx += 2
  next if u == v
  u, v = v, u if u > v
  seed = (seed + 0x9E3779B97F4A7C15) & MASK64
  z = seed
  z = ((z ^ (z >> 30)) * 0xBF58476D1CE4E5B9) & MASK64
  z = ((z ^ (z >> 27)) * 0x94D049BB133111EB) & MASK64
  z = (z ^ (z >> 31)) & MASK64
  w = (z % (MOD - 1)) + 1
  mat[u][v] = (mat[u][v] + w) % MOD
  mat[v][u] = (mat[v][u] - w) % MOD
end

rank = 0
(0...n).each do |col|
  break if rank >= n
  piv = (rank...n).find { |r| mat[r][col] != 0 }
  next if piv.nil?
  mat[piv], mat[rank] = mat[rank], mat[piv]
  inv = mod_pow(mat[rank][col], MOD - 2)
  ((rank + 1)...n).each do |r|
    next if mat[r][col] == 0
    f = (mat[r][col] * inv) % MOD
    (col...n).each { |c| mat[r][c] = (mat[r][c] - f * mat[rank][c]) % MOD }
  end
  rank += 1
end
puts rank / 2`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'AtCoder',
      title: 'Library Checker - Counting Spanning Trees (Directed & Undirected)',
      difficulty: 'Grandmaster',
      url: 'https://judge.yosupo.jp/problem/counting_spanning_tree_directed',
      patternNote: 'Direct application of directed in-degree Laplacian cofactor mod 998244353.',
    },
    {
      platform: 'Codeforces',
      title: 'Matrix-Tree Modulo Composite Integer (Euclidean Elimination)',
      difficulty: '2600',
      url: 'https://codeforces.com/problemset',
      patternNote: 'Pair directed Laplacian minor extraction with integer GCD row reduction when modulus P is arbitrary.',
    },
    {
      platform: 'AtCoder',
      title: 'Maximum Matching via Tutte Matrix / Pfaffian Orientation',
      difficulty: 'Grandmaster',
      url: 'https://judge.yosupo.jp/problem/general_matching',
      patternNote: 'Rank of skew-symmetric Tutte matrix divided by 2 gives exact matching cardinality in O(N^3).',
    },
  ],
  interviewNotes: [
    'Out-arborescences rooted at R require the IN-DEGREE Laplacian (L[v][v] += 1, L[u][v] -= 1) with row R and column R removed.',
    'Euclidean GCD row reduction computes exact integer determinants modulo any composite P without requiring modular inverses.',
    'Because a skew-symmetric matrix over GF(P) (P > 2) always has even rank equal to twice the largest invertible principal submatrix matching, rank(Tutte) / 2 recovers maximum matching size cleanly.',
  ],
  projectBlueprint: {
    title: 'Algebraic Graph Enumeration & Skew-Symmetric Matching Analyzer',
    tagline: 'Unified Laplacian determinant solver over prime and composite moduli paired with Tutte matching rank',
    stackSummary: 'C++20 / Rust Modular & GCD Eliminator + SplitMix64 Tutte Matrix Ranker',
    asciiDiagram:
`[Graph G=(V,E)] ---> [Build Laplacian L / Tutte T]
                             |
[Spanning Trees / nu(G)] <--- [Prime Inv / Euclidean GCD Gauss]`,
    milestones: [
      { id: 'm1', title: 'Undirected & Directed Laplacians', detail: 'Construct signed minor after skipping self-loops and deleting root row/column.' },
      { id: 'm2', title: 'Composite-Mod GCD Elimination', detail: 'Replace mod_inv with integer division loops while preserving determinant parity.' },
      { id: 'm3', title: 'Tutte Matrix Rank Solver', detail: 'Assign independent 64-bit pseudorandom weights to compute matching size in O(N^3).' },
    ],
    starterCode: `// Directed Matrix-Tree (out-arborescence rooted at R):
// For edge u -> v (u != v): L[v][v] += 1; L[u][v] -= 1; answer = det(L without row R, col R).`,
  },
};
