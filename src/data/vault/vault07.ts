import type { VaultBreakdown } from '../../types/vault';

export const VAULT07_CENTROID_NTT_PRIMES: VaultBreakdown = {
  slug: 'prime-length-tree-paths-centroid-ntt',
  title:
    'Counting All Tree Paths of Prime Length -> Centroid Decomposition + NTT Polynomial Convolution',
  rating: 2700,
  ratingTier: '2600–3300+',
  usacoDivision: 'Advanced',
  domain: 'Graph & Tree Theory',
  sourceTag: '2500–2800 Multi-Topic Reduction Vault (Centroid Decomp + NTT + Linear Sieve)',
  reductionHeadline:
    'Combine O(N log N) Centroid Divide-and-Conquer with O(D log D) Number Theoretic Transform auto-convolutions to tabulate all N(N-1)/2 pairwise tree distances in O(N log^2 N) time.',
  linkedChapters: [
    {
      number: 38,
      slug: 'centroid-decomposition',
      title: 'Centroid Decomposition & Centroid Tree',
    },
    {
      number: 55,
      slug: 'fft-ntt-polynomial-convolution',
      title: 'FFT, NTT & Fast Walsh-Hadamard Transform (FWHT)',
    },
    {
      number: 46,
      slug: 'euclidean-gcd-sieve-factorization',
      title: 'Euclidean GCD, Sieve of Eratosthenes & Prime Factorization',
    },
  ],
  keyTraps: [
    {
      title: 'Trap 1: Running NTT of Size N Instead of Current Subtree Max-Depth D',
      detail:
        'At centroid level k, there are 2^k components of size ~N / 2^k. If you pad every NTT to the global tree size N instead of 2 * max_depth(component), the runtime degrades to O(N^2 log N) and gets TLE! Sizing NTT to the component’s actual depth bounds total work per centroid level to O(N log N).',
    },
    {
      title: 'Trap 2: Double-Counting Paths Within the Same Child Subtree of Centroid c',
      detail:
        'Squaring the aggregate depth polynomial P_c(x)^2 pairs vertices (u, v) that belong to the SAME child branch of c (whose true path does not pass through c and has length dist(u,c) + dist(v,c) - 2*dist(lca,c)). You must subtract sum_{child b} P_b(x)^2 and divide by 2!',
    },
  ],
  stage1Statement: {
    statement:
      'You are given an unrooted unweighted tree T with N vertices. A simple path between two unordered vertices {u, v} (u != v) has length equal to the number of edges on the unique simple path between u and v. Compute the exact total number of unordered vertex pairs {u, v} whose path length is a prime number (2, 3, 5, 7, 11, ...).',
    constraints: [
      '2 <= N <= 10^5',
      'Tree edges have unit length 1',
      'Time Limit: 2.0 seconds',
    ],
    sampleInput: `6
1 2
2 3
2 4
4 5
4 6`,
    sampleOutput: `10`,
    sampleExplanation:
      'On this 6-node H-tree (centered at 2 and 4): there are 5 edges (length 1, not prime). Distance-2 paths: (1,3), (1,4), (3,4), (2,5), (2,6), (5,6) = 6 paths of prime length 2. Distance-3 paths: (1,5), (1,6), (3,5), (3,6) = 4 paths of prime length 3. Total pairs = 5 + 6 + 4 = 15, and total prime-length paths = 6 + 4 = 10.',
  },
  stage2NaiveFailure: {
    naiveApproaches: [
      {
        approach: 'BFS / DFS from Every Vertex u in 1..N',
        complexity: 'O(N^2)',
        verdict: 'TLE',
        reason:
          'N = 10^5 yields N(N-1)/2 = 5 * 10^9 pairs, exceeding the 2.0s budget by 50x.',
      },
      {
        approach: 'Tree DP Tracking Full Depth Histogram Array dp[u][0..N] at Every Node',
        complexity: 'O(N^2) Time & Space',
        verdict: 'MLE',
        reason:
          'Even with DSU-on-Tree / Small-to-Large height merging, convolving two branches of depth D taking O(D^2) pairwise prime checks degenerates to O(N^2) on a balanced tree of long chains.',
      },
      {
        approach: 'Centroid Decomposition + Pairwise Iteration Over Primes for Each Depth',
        complexity: 'O(N * pi(N) * log N)',
        verdict: 'TLE',
        reason:
          'There are pi(10^5) = 9,592 primes up to N. Looping over all primes for every vertex in every centroid level takes 10^5 * 9592 * 17 ~ 1.6 * 10^10 operations.',
      },
    ],
    constraintWhispers: [
      'Instead of querying only prime sums during traversal, compute the FULL distance distribution array ways[d] = number of pairs at distance d for all d in [1..N-1], then sum ways[p] over primes p at the very end!',
      'At any centroid c, dist(u, v) = depth[u] + depth[v] for u, v in different child subtrees of c — which is a polynomial Cauchy product (convolution)!',
      'With NTT/FFT convolving depth polynomials of degree D in O(D log D), the recurrence T(N) = sum T(N_i) + O(N log N) solves to O(N log^2 N).',
    ],
  },
  stage3AhaReduction: {
    coreInsight:
      'Use Centroid Decomposition so every path is counted at the unique centroid c that separates its endpoints. At centroid c, form the depth generating function A(x) = sum_u x^{depth(u)} (with x^0 = 1 for c itself) and each child branch polynomial B_i(x). By inclusion-exclusion, the paths strictly passing through c equal (A(x)^2 - sum_i B_i(x)^2) / 2, computed in O(S log S) via NTT!',
    steps: [
      {
        title: '1. Centroid Divide-and-Conquer Depth Bound',
        proofNote:
          'Finding and removing the centroid c (where every remaining component has size <= S/2) guarantees recursion depth <= log_2 N ~ 17. The sum of component sizes S across each level of the Centroid Tree is at most N.',
      },
      {
        title: '2. Polynomial Auto-Convolution via Inclusion-Exclusion',
        proofNote:
          'For each child v of centroid c, collect the depth frequency array B_v[d] of vertices in v’s component (with root c at depth 0). Convolve B_v with itself via NTT and subtract B_v * B_v from the global distance counter ways[d]. Then sum A[d] = 1 + sum_v B_v[d] (where A[0] = 1 represents c), convolve A * A via NTT, and add A * A to ways[d].',
      },
      {
        title: '3. Halve Ordered Pairs & Sieve Prime Distances',
        proofNote:
          'Because A(x)^2 - sum B_v(x)^2 counts each unordered pair {u, v} twice (as (u, v) and (v, u)) for d >= 1, divide ways[d] by 2 after Centroid Decomposition finishes. Finally, run a linear Sieve of Eratosthenes up to N and output sum_{p prime} ways[p].',
      },
    ],
  },
  stage4DryRun: {
    intro:
      'Trace the 6-node H-tree from the Sample Input. Watch Centroid Decomposition pick c = 2, build branch depth polynomials, square and subtract same-branch overcounts via NTT, and filter prime lengths {2, 3}.',
    traceSteps: [
      {
        stepNumber: 1,
        title: 'Find First Centroid c = 2 of the 6-Node H-Tree',
        explanation:
          'Edges: (1-2), (2-3), (2-4), (4-5), (4-6). Removing vertex 2 splits the tree into three components: {1} (size 1), {3} (size 1), and {4, 5, 6} (size 3 <= 6/2). Thus c = 2 is a valid centroid.',
        mode: 'graph',
        graph: {
          calloutMetric: 'Centroid c = 2 · 3 Child Branches: {1}, {3}, {4,5,6}',
          nodes: [
            { id: '1', label: '1 (d=1)', x: 100, y: 80, state: 'even' },
            { id: '3', label: '3 (d=1)', x: 100, y: 220, state: 'even' },
            { id: '2', label: 'c=2 (d=0)', x: 250, y: 150, state: 'active' },
            { id: '4', label: '4 (d=1)', x: 400, y: 150, state: 'odd' },
            { id: '5', label: '5 (d=2)', x: 520, y: 80, state: 'odd' },
            { id: '6', label: '6 (d=2)', x: 520, y: 220, state: 'odd' },
          ],
          edges: [
            { id: 'e12', from: '1', to: '2', state: 'augmenting' },
            { id: 'e23', from: '2', to: '3', state: 'augmenting' },
            { id: 'e24', from: '2', to: '4', state: 'augmenting' },
            { id: 'e45', from: '4', to: '5', state: 'default' },
            { id: 'e46', from: '4', to: '6', state: 'default' },
          ],
        },
        variables: { Centroid: 2, Branch1: '{1}', Branch2: '{3}', Branch3: '{4,5,6}' },
      },
      {
        stepNumber: 2,
        title: 'Build Depth Polynomials A(x) and B_i(x) Around c = 2',
        explanation:
          'Branch {1}: B_1(x) = x. Branch {3}: B_2(x) = x. Branch {4,5,6}: B_3(x) = x + 2x^2. Total polynomial including c=2 (x^0): A(x) = 1 + 3x + 2x^2.',
        mode: 'array',
        arrays: [
          {
            name: 'Total Depth Polynomial A[d] Around c = 2',
            cells: [
              { index: 0, value: 1, label: 'd=0 ({2})', highlight: 'active' },
              { index: 1, value: 3, label: 'd=1 ({1,3,4})', highlight: 'window' },
              { index: 2, value: 2, label: 'd=2 ({5,6})', highlight: 'window' },
            ],
          },
          {
            name: 'Branch {4,5,6} Polynomial B_3[d]',
            cells: [
              { index: 0, value: 0, label: 'd=0', highlight: 'neutral' },
              { index: 1, value: 1, label: 'd=1 ({4})', highlight: 'updated' },
              { index: 2, value: 2, label: 'd=2 ({5,6})', highlight: 'updated' },
            ],
          },
        ],
        variables: { 'A(x)': '1 + 3x + 2x^2', 'B_3(x)': 'x + 2x^2' },
      },
      {
        stepNumber: 3,
        title: 'NTT Auto-Convolution: (A(x)^2 - ∑ B_i(x)^2) / 2',
        explanation:
          'A(x)^2 = 1 + 6x + 13x^2 + 12x^3 + 4x^4. Sum of branch squares: x^2 + x^2 + (x^2 + 4x^3 + 4x^4) = 3x^2 + 4x^3 + 4x^4. Difference / 2 = 3x + 5x^2 + 4x^3! That gives 3 paths of length 1, 5 paths of length 2, and 4 paths of length 3 passing through c = 2.',
        mode: 'array',
        arrays: [
          {
            name: 'Paths Strictly Passing Through Centroid c = 2',
            cells: [
              { index: 1, value: 3, label: 'len=1', highlight: 'neutral' },
              { index: 2, value: 5, label: 'len=2 (PRIME)', highlight: 'active' },
              { index: 3, value: 4, label: 'len=3 (PRIME)', highlight: 'active' },
            ],
          },
        ],
        variables: { Len1_c2: 3, Len2_c2: 5, Len3_c2: 4 },
      },
      {
        stepNumber: 4,
        title: 'Recurse on Subtree {4, 5, 6} (Centroid c = 4) & Filter Primes',
        explanation:
          'Recursing on {4, 5, 6} picks centroid c = 4, adding 2 paths of length 1 ((4,5), (4,6)) and 1 path of length 2 ((5,6)). Global distance histogram: ways[1]=5, ways[2]=6, ways[3]=4. Summing ways[p] for primes p in {2, 3} gives 6 + 4 = 10!',
        mode: 'array',
        arrays: [
          {
            name: 'Final Global Distance Histogram ways[1..3]',
            cells: [
              { index: 1, value: 5, label: 'd=1 (non-prime)', highlight: 'neutral' },
              { index: 2, value: 6, label: 'd=2 (PRIME)', highlight: 'updated' },
              { index: 3, value: 4, label: 'd=3 (PRIME)', highlight: 'updated' },
            ],
          },
        ],
        variables: { 'ways[2]': 6, 'ways[3]': 4, TotalPrimePaths: 10 },
      },
    ],
  },
  stage5Solutions: {
    timeComplexity: 'O(N log^2 N)',
    spaceComplexity: 'O(N)',
    implementations: {
      cpp20: `#include <bits/stdc++.h>
using namespace std;

// Note: Sample output for the 6-node H-tree is 10 (6 paths of length 2 + 4 paths of length 3).
static constexpr long long MOD = 998244353;
static constexpr long long G = 3;

long long power(long long base, long long exp) {
    long long res = 1;
    base %= MOD;
    while (exp > 0) {
        if (exp & 1) res = (res * base) % MOD;
        base = (base * base) % MOD;
        exp >>= 1;
    }
    return res;
}

void ntt(vector<long long>& a, bool invert) {
    int n = (int)a.size();
    for (int i = 1, j = 0; i < n; ++i) {
        int bit = n >> 1;
        for (; j & bit; bit >>= 1) j ^= bit;
        j ^= bit;
        if (i < j) swap(a[i], a[j]);
    }
    for (int len = 2; len <= n; len <<= 1) {
        long long wlen = power(G, (MOD - 1) / len);
        if (invert) wlen = power(wlen, MOD - 2);
        for (int i = 0; i < n; i += len) {
            long long w = 1;
            for (int j = 0; j < len / 2; ++j) {
                long long u = a[i + j];
                long long v = (a[i + j + len / 2] * w) % MOD;
                a[i + j] = (u + v < MOD ? u + v : u + v - MOD);
                a[i + j + len / 2] = (u - v >= 0 ? u - v : u - v + MOD);
                w = (w * wlen) % MOD;
            }
        }
    }
    if (invert) {
        long long n_inv = power(n, MOD - 2);
        for (long long& x : a) x = (x * n_inv) % MOD;
    }
}

vector<long long> square_poly(const vector<long long>& p) {
    int deg = (int)p.size();
    if (deg <= 32) {
        vector<long long> res(2 * deg - 1, 0);
        for (int i = 0; i < deg; ++i) {
            if (!p[i]) continue;
            for (int j = 0; j < deg; ++j) {
                res[i + j] += p[i] * p[j];
            }
        }
        return res;
    }
    int sz = 1;
    while (sz < 2 * deg - 1) sz <<= 1;
    vector<long long> fa(sz, 0);
    for (int i = 0; i < deg; ++i) fa[i] = p[i] % MOD;
    ntt(fa, false);
    for (int i = 0; i < sz; ++i) fa[i] = (fa[i] * fa[i]) % MOD;
    ntt(fa, true);
    fa.resize(2 * deg - 1);
    return fa;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    if (!(cin >> n)) return 0;

    vector<vector<int>> adj(n + 1);
    for (int i = 0; i < n - 1; ++i) {
        int u, v;
        cin >> u >> v;
        adj[u].push_back(v);
        adj[v].push_back(u);
    }

    vector<int> sz(n + 1, 0);
    vector<bool> removed(n + 1, false);
    vector<long long> ways(n + 1, 0);

    auto get_sz = [&](auto& self, int u, int p) -> int {
        sz[u] = 1;
        for (int v : adj[u]) {
            if (v != p && !removed[v]) sz[u] += self(self, v, u);
        }
        return sz[u];
    };

    auto get_centroid = [&](auto& self, int u, int p, int total) -> int {
        for (int v : adj[u]) {
            if (v != p && !removed[v] && sz[v] > total / 2) {
                return self(self, v, u, total);
            }
        }
        return u;
    };

    vector<int> branch_depths;
    auto collect_depths = [&](auto& self, int u, int p, int d) -> void {
        if (d >= (int)branch_depths.size()) branch_depths.resize(d + 1, 0);
        branch_depths[d]++;
        for (int v : adj[u]) {
            if (v != p && !removed[v]) self(self, v, u, d + 1);
        }
    };

    auto decompose = [&](auto& self, int entry) -> void {
        int total = get_sz(get_sz, entry, 0);
        int c = get_centroid(get_centroid, entry, 0, total);
        removed[c] = true;

        vector<long long> total_poly(1, 1); // c itself at depth 0
        for (int v : adj[c]) {
            if (removed[v]) continue;
            branch_depths.assign(1, 0);
            collect_depths(collect_depths, v, c, 1);

            vector<long long> b_poly(branch_depths.begin(), branch_depths.end());
            auto b_sq = square_poly(b_poly);
            for (int d = 1; d < (int)b_sq.size() && d <= n; ++d) {
                ways[d] -= b_sq[d];
            }

            if (b_poly.size() > total_poly.size()) total_poly.resize(b_poly.size(), 0);
            for (size_t d = 1; d < b_poly.size(); ++d) {
                total_poly[d] += b_poly[d];
            }
        }

        auto tot_sq = square_poly(total_poly);
        for (int d = 1; d < (int)tot_sq.size() && d <= n; ++d) {
            ways[d] += tot_sq[d];
        }

        for (int v : adj[c]) {
            if (!removed[v]) self(self, v);
        }
    };

    decompose(decompose, 1);

    vector<bool> is_prime(n + 1, true);
    is_prime[0] = is_prime[1] = false;
    for (int i = 2; i * i <= n; ++i) {
        if (is_prime[i]) {
            for (int j = i * i; j <= n; j += i) is_prime[j] = false;
        }
    }

    long long total_prime_paths = 0;
    for (int d = 2; d <= n; ++d) {
        if (is_prime[d]) {
            total_prime_paths += ways[d] / 2;
        }
    }
    cout << total_prime_paths << '\\n';
    return 0;
}`,
      rust: `use std::io::{self, Read};

const MOD: i64 = 998_244_353;
const G: i64 = 3;

fn power(mut base: i64, mut exp: i64) -> i64 {
    let mut res = 1i64;
    base %= MOD;
    while exp > 0 {
        if exp & 1 == 1 {
            res = (res * base) % MOD;
        }
        base = (base * base) % MOD;
        exp >>= 1;
    }
    res
}

fn ntt(a: &mut [i64], invert: bool) {
    let n = a.len();
    let mut j = 0usize;
    for i in 1..n {
        let mut bit = n >> 1;
        while j & bit != 0 {
            j ^= bit;
            bit >>= 1;
        }
        j ^= bit;
        if i < j {
            a.swap(i, j);
        }
    }
    let mut len = 2;
    while len <= n {
        let mut wlen = power(G, (MOD - 1) / (len as i64));
        if invert {
            wlen = power(wlen, MOD - 2);
        }
        for i in (0..n).step_by(len) {
            let mut w = 1i64;
            for k in 0..(len / 2) {
                let u = a[i + k];
                let v = (a[i + k + len / 2] * w) % MOD;
                a[i + k] = if u + v < MOD { u + v } else { u + v - MOD };
                a[i + k + len / 2] = if u - v >= 0 { u - v } else { u - v + MOD };
                w = (w * wlen) % MOD;
            }
        }
        len <<= 1;
    }
    if invert {
        let n_inv = power(n as i64, MOD - 2);
        for x in a.iter_mut() {
            *x = (*x * n_inv) % MOD;
        }
    }
}

fn square_poly(p: &[i64]) -> Vec<i64> {
    let deg = p.len();
    if deg <= 32 {
        let mut res = vec![0i64; 2 * deg - 1];
        for i in 0..deg {
            if p[i] == 0 {
                continue;
            }
            for j in 0..deg {
                res[i + j] += p[i] * p[j];
            }
        }
        return res;
    }
    let mut sz = 1usize;
    while sz < 2 * deg - 1 {
        sz <<= 1;
    }
    let mut fa = vec![0i64; sz];
    for i in 0..deg {
        fa[i] = p[i] % MOD;
    }
    ntt(&mut fa, false);
    for x in fa.iter_mut() {
        *x = (*x * *x) % MOD;
    }
    ntt(&mut fa, true);
    fa.truncate(2 * deg - 1);
    fa
}

struct Solver {
    n: usize,
    adj: Vec<Vec<usize>>,
    sz: Vec<usize>,
    removed: Vec<bool>,
    ways: Vec<i64>,
}

impl Solver {
    fn get_sz(&mut self, u: usize, p: usize) -> usize {
        self.sz[u] = 1;
        let neighbors = self.adj[u].clone();
        for v in neighbors {
            if v != p && !self.removed[v] {
                self.sz[u] += self.get_sz(v, u);
            }
        }
        self.sz[u]
    }

    fn get_centroid(&self, u: usize, p: usize, total: usize) -> usize {
        for &v in &self.adj[u] {
            if v != p && !self.removed[v] && self.sz[v] > total / 2 {
                return self.get_centroid(v, u, total);
            }
        }
        u
    }

    fn collect_depths(&self, u: usize, p: usize, d: usize, out: &mut Vec<i64>) {
        if d >= out.len() {
            out.resize(d + 1, 0);
        }
        out[d] += 1;
        for &v in &self.adj[u] {
            if v != p && !self.removed[v] {
                self.collect_depths(v, u, d + 1, out);
            }
        }
    }

    fn decompose(&mut self, entry: usize) {
        let total = self.get_sz(entry, 0);
        let c = self.get_centroid(entry, 0, total);
        self.removed[c] = true;

        let mut total_poly = vec![1i64];
        let neighbors = self.adj[c].clone();
        for v in &neighbors {
            if self.removed[*v] {
                continue;
            }
            let mut b_poly = vec![0i64];
            self.collect_depths(*v, c, 1, &mut b_poly);
            let b_sq = square_poly(&b_poly);
            for d in 1..b_sq.len().min(self.n + 1) {
                self.ways[d] -= b_sq[d];
            }
            if b_poly.len() > total_poly.len() {
                total_poly.resize(b_poly.len(), 0);
            }
            for d in 1..b_poly.len() {
                total_poly[d] += b_poly[d];
            }
        }

        let tot_sq = square_poly(&total_poly);
        for d in 1..tot_sq.len().min(self.n + 1) {
            self.ways[d] += tot_sq[d];
        }

        for v in neighbors {
            if !self.removed[v] {
                self.decompose(v);
            }
        }
    }
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let Some(n_str) = it.next() else { return; };
    let n: usize = n_str.parse().unwrap();

    let mut adj = vec![Vec::new(); n + 1];
    for _ in 0..(n - 1) {
        let u: usize = it.next().unwrap().parse().unwrap();
        let v: usize = it.next().unwrap().parse().unwrap();
        adj[u].push(v);
        adj[v].push(u);
    }

    let mut solver = Solver {
        n,
        adj,
        sz: vec![0; n + 1],
        removed: vec![false; n + 1],
        ways: vec![0; n + 1],
    };
    solver.decompose(1);

    let mut is_prime = vec![true; n + 1];
    is_prime[0] = false;
    if n >= 1 {
        is_prime[1] = false;
    }
    let mut i = 2;
    while i * i <= n {
        if is_prime[i] {
            let mut j = i * i;
            while j <= n {
                is_prime[j] = false;
                j += i;
            }
        }
        i += 1;
    }

    let mut ans = 0i64;
    for d in 2..=n {
        if is_prime[d] {
            ans += solver.ways[d] / 2;
        }
    }
    println!("{}", ans);
}`,
      java21: `import java.io.*;
import java.util.*;

public class Main {
    static final long MOD = 998_244_353L;
    static final long G = 3L;

    static final class FastScanner {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer("");
        String next() throws IOException {
            while (!st.hasMoreTokens()) {
                String line = br.readLine();
                if (line == null) return null;
                st = new StringTokenizer(line);
            }
            return st.nextToken();
        }
        int nextInt() throws IOException { return Integer.parseInt(next()); }
    }

    static long power(long base, long exp) {
        long res = 1;
        base %= MOD;
        while (exp > 0) {
            if ((exp & 1) == 1) res = (res * base) % MOD;
            base = (base * base) % MOD;
            exp >>= 1;
        }
        return res;
    }

    static void ntt(long[] a, boolean invert) {
        int n = a.length;
        for (int i = 1, j = 0; i < n; i++) {
            int bit = n >> 1;
            for (; (j & bit) != 0; bit >>= 1) j ^= bit;
            j ^= bit;
            if (i < j) { long tmp = a[i]; a[i] = a[j]; a[j] = tmp; }
        }
        for (int len = 2; len <= n; len <<= 1) {
            long wlen = power(G, (MOD - 1) / len);
            if (invert) wlen = power(wlen, MOD - 2);
            for (int i = 0; i < n; i += len) {
                long w = 1;
                for (int j = 0; j < len / 2; j++) {
                    long u = a[i + j];
                    long v = (a[i + j + len / 2] * w) % MOD;
                    a[i + j] = (u + v < MOD ? u + v : u + v - MOD);
                    a[i + j + len / 2] = (u - v >= 0 ? u - v : u - v + MOD);
                    w = (w * wlen) % MOD;
                }
            }
        }
        if (invert) {
            long nInv = power(n, MOD - 2);
            for (int i = 0; i < n; i++) a[i] = (a[i] * nInv) % MOD;
        }
    }

    static long[] squarePoly(long[] p, int deg) {
        if (deg <= 32) {
            long[] res = new long[2 * deg - 1];
            for (int i = 0; i < deg; i++) {
                if (p[i] == 0) continue;
                for (int j = 0; j < deg; j++) res[i + j] += p[i] * p[j];
            }
            return res;
        }
        int sz = 1;
        while (sz < 2 * deg - 1) sz <<= 1;
        long[] fa = new long[sz];
        System.arraycopy(p, 0, fa, 0, deg);
        ntt(fa, false);
        for (int i = 0; i < sz; i++) fa[i] = (fa[i] * fa[i]) % MOD;
        ntt(fa, true);
        return Arrays.copyOf(fa, 2 * deg - 1);
    }

    static int n;
    static List<Integer>[] adj;
    static int[] sz;
    static boolean[] removed;
    static long[] ways;
    static long[] branchBuf;
    static int maxD;

    static int getSz(int u, int p) {
        sz[u] = 1;
        for (int v : adj[u]) if (v != p && !removed[v]) sz[u] += getSz(v, u);
        return sz[u];
    }

    static int getCentroid(int u, int p, int total) {
        for (int v : adj[u])
            if (v != p && !removed[v] && sz[v] > total / 2) return getCentroid(v, u, total);
        return u;
    }

    static void collectDepths(int u, int p, int d) {
        if (d > maxD) maxD = d;
        branchBuf[d]++;
        for (int v : adj[u]) if (v != p && !removed[v]) collectDepths(v, u, d + 1);
    }

    static void decompose(int entry) {
        int total = getSz(entry, 0);
        int c = getCentroid(entry, 0, total);
        removed[c] = true;

        long[] totalPoly = new long[total + 1];
        totalPoly[0] = 1;
        int totDeg = 1;

        for (int v : adj[c]) {
            if (removed[v]) continue;
            maxD = 0;
            collectDepths(v, c, 1);
            int bDeg = maxD + 1;
            long[] bPoly = new long[bDeg];
            for (int d = 1; d <= maxD; d++) {
                bPoly[d] = branchBuf[d];
                totalPoly[d] += branchBuf[d];
                branchBuf[d] = 0;
            }
            if (bDeg > totDeg) totDeg = bDeg;
            long[] bSq = squarePoly(bPoly, bDeg);
            for (int d = 1; d < bSq.length && d <= n; d++) ways[d] -= bSq[d];
        }

        long[] totSq = squarePoly(totalPoly, totDeg);
        for (int d = 1; d < totSq.length && d <= n; d++) ways[d] += totSq[d];

        for (int v : adj[c]) if (!removed[v]) decompose(v);
    }

    @SuppressWarnings("unchecked")
    public static void main(String[] args) throws Exception {
        FastScanner sc = new FastScanner();
        String first = sc.next();
        if (first == null) return;
        n = Integer.parseInt(first);
        adj = new ArrayList[n + 1];
        for (int i = 1; i <= n; i++) adj[i] = new ArrayList<>();
        for (int i = 0; i < n - 1; i++) {
            int u = sc.nextInt(), v = sc.nextInt();
            adj[u].add(v); adj[v].add(u);
        }
        sz = new int[n + 1];
        removed = new boolean[n + 1];
        ways = new long[n + 1];
        branchBuf = new long[n + 1];

        decompose(1);

        boolean[] isPrime = new boolean[n + 1];
        Arrays.fill(isPrime, true);
        isPrime[0] = isPrime[1] = false;
        for (int i = 2; i * i <= n; i++)
            if (isPrime[i]) for (int j = i * i; j <= n; j += i) isPrime[j] = false;

        long ans = 0;
        for (int d = 2; d <= n; d++) if (isPrime[d]) ans += ways[d] / 2;
        System.out.println(ans);
    }
}`,
      python3: `import sys

sys.setrecursionlimit(250000)
MOD = 998244353
G = 3

def ntt(a: list[int], invert: bool) -> None:
    n = len(a)
    j = 0
    for i in range(1, n):
        bit = n >> 1
        while j & bit:
            j ^= bit
            bit >>= 1
        j ^= bit
        if i < j:
            a[i], a[j] = a[j], a[i]
    length = 2
    while length <= n:
        wlen = pow(G, (MOD - 1) // length, MOD)
        if invert:
            wlen = pow(wlen, MOD - 2, MOD)
        half = length >> 1
        for i in range(0, n, length):
            w = 1
            for k in range(half):
                u = a[i + k]
                v = a[i + k + half] * w % MOD
                a[i + k] = (u + v) % MOD
                a[i + k + half] = (u - v) % MOD
                w = w * wlen % MOD
        length <<= 1
    if invert:
        n_inv = pow(n, MOD - 2, MOD)
        for i in range(n):
            a[i] = a[i] * n_inv % MOD

def square_poly(p: list[int]) -> list[int]:
    deg = len(p)
    if deg <= 32:
        res = [0] * (2 * deg - 1)
        for i in range(deg):
            pi = p[i]
            if not pi:
                continue
            for j in range(deg):
                res[i + j] += pi * p[j]
        return res
    sz = 1
    while sz < 2 * deg - 1:
        sz <<= 1
    fa = p + [0] * (sz - deg)
    ntt(fa, False)
    for i in range(sz):
        fa[i] = fa[i] * fa[i] % MOD
    ntt(fa, True)
    return fa[: 2 * deg - 1]

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    n = int(next(it))
    adj = [[] for _ in range(n + 1)]
    for _ in range(n - 1):
        u = int(next(it))
        v = int(next(it))
        adj[u].append(v)
        adj[v].append(u)

    sz = [0] * (n + 1)
    removed = [False] * (n + 1)
    ways = [0] * (n + 1)

    def get_sz(u: int, p: int) -> int:
        s = 1
        for v in adj[u]:
            if v != p and not removed[v]:
                s += get_sz(v, u)
        sz[u] = s
        return s

    def get_centroid(u: int, p: int, total: int) -> int:
        for v in adj[u]:
            if v != p and not removed[v] and sz[v] > total // 2:
                return get_centroid(v, u, total)
        return u

    def decompose(entry: int) -> None:
        total = get_sz(entry, 0)
        c = get_centroid(entry, 0, total)
        removed[c] = True

        total_poly = [1]
        for v in adj[c]:
            if removed[v]:
                continue
            b_poly = [0]
            stack = [(v, c, 1)]
            while stack:
                curr, par, d = stack.pop()
                if d >= len(b_poly):
                    b_poly.extend([0] * (d - len(b_poly) + 1))
                b_poly[d] += 1
                for nxt in adj[curr]:
                    if nxt != par and not removed[nxt]:
                        stack.append((nxt, curr, d + 1))

            b_sq = square_poly(b_poly)
            for d in range(1, min(len(b_sq), n + 1)):
                ways[d] -= b_sq[d]
            if len(b_poly) > len(total_poly):
                total_poly.extend([0] * (len(b_poly) - len(total_poly)))
            for d in range(1, len(b_poly)):
                total_poly[d] += b_poly[d]

        tot_sq = square_poly(total_poly)
        for d in range(1, min(len(tot_sq), n + 1)):
            ways[d] += tot_sq[d]

        for v in adj[c]:
            if not removed[v]:
                decompose(v)

    decompose(1)

    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False
    for i in range(2, int(n**0.5) + 1):
        if is_prime[i]:
            for j in range(i * i, n + 1, i):
                is_prime[j] = False

    ans = sum(ways[d] // 2 for d in range(2, n + 1) if is_prime[d])
    print(ans)

if __name__ == "__main__":
    solve()`,
      ruby: `MOD = 998_244_353
G = 3

def power(base, exp)
  res = 1
  base %= MOD
  while exp > 0
    res = (res * base) % MOD if exp.odd?
    base = (base * base) % MOD
    exp >>= 1
  end
  res
end

def ntt(a, invert)
  n = a.size
  j = 0
  (1...n).each do |i|
    bit = n >> 1
    while (j & bit) != 0
      j ^= bit
      bit >>= 1
    end
    j ^= bit
    a[i], a[j] = a[j], a[i] if i < j
  end
  len = 2
  while len <= n
    wlen = power(G, (MOD - 1) / len)
    wlen = power(wlen, MOD - 2) if invert
    half = len >> 1
    (0...n).step(len) do |i|
      w = 1
      half.times do |k|
        u = a[i + k]
        v = (a[i + k + half] * w) % MOD
        a[i + k] = (u + v) % MOD
        a[i + k + half] = (u - v) % MOD
        w = (w * wlen) % MOD
      end
    end
    len <<= 1
  end
  if invert
    n_inv = power(n, MOD - 2)
    n.times { |i| a[i] = (a[i] * n_inv) % MOD }
  end
end

def square_poly(p)
  deg = p.size
  if deg <= 32
    res = Array.new(2 * deg - 1, 0)
    deg.times do |i|
      next if p[i] == 0
      deg.times { |j| res[i + j] += p[i] * p[j] }
    end
    return res
  end
  sz = 1
  sz <<= 1 while sz < 2 * deg - 1
  fa = p + Array.new(sz - deg, 0)
  ntt(fa, false)
  sz.times { |i| fa[i] = (fa[i] * fa[i]) % MOD }
  ntt(fa, true)
  fa[0, 2 * deg - 1]
end

tokens = STDIN.read.split.map(&:to_i)
exit if tokens.empty?
n = tokens[0]
adj = Array.new(n + 1) { [] }
idx = 1
(n - 1).times do
  u = tokens[idx]; v = tokens[idx + 1]; idx += 2
  adj[u] << v
  adj[v] << u
end

$adj = adj
$n = n
$sz = Array.new(n + 1, 0)
$removed = Array.new(n + 1, false)
$ways = Array.new(n + 1, 0)

def get_sz(u, p)
  s = 1
  $adj[u].each do |v|
    s += get_sz(v, u) if v != p && !$removed[v]
  end
  $sz[u] = s
end

def get_centroid(u, p, total)
  $adj[u].each do |v|
    return get_centroid(v, u, total) if v != p && !$removed[v] && $sz[v] > total / 2
  end
  u
end

def decompose(entry)
  total = get_sz(entry, 0)
  c = get_centroid(entry, 0, total)
  $removed[c] = true

  total_poly = [1]
  $adj[c].each do |v|
    next if $removed[v]
    b_poly = [0]
    stack = [[v, c, 1]]
    until stack.empty?
      curr, par, d = stack.pop
      b_poly[d] = (b_poly[d] || 0) + 1
      $adj[curr].each do |nxt|
        stack << [nxt, curr, d + 1] if nxt != par && !$removed[nxt]
      end
    end
    b_poly.map! { |x| x || 0 }
    b_sq = square_poly(b_poly)
    (1...[b_sq.size, $n + 1].min).each { |d| $ways[d] -= b_sq[d] }
    total_poly.fill(0, total_poly.size...b_poly.size) if b_poly.size > total_poly.size
    (1...b_poly.size).each { |d| total_poly[d] += b_poly[d] }
  end

  tot_sq = square_poly(total_poly)
  (1...[tot_sq.size, $n + 1].min).each { |d| $ways[d] += tot_sq[d] }

  $adj[c].each { |v| decompose(v) unless $removed[v] }
end

decompose(1)

is_prime = Array.new(n + 1, true)
is_prime[0] = is_prime[1] = false
(2..Math.sqrt(n).to_i).each do |i|
  if is_prime[i]
    (i * i..n).step(i) { |j| is_prime[j] = false }
  end
end

ans = 0
(2..n).each { |d| ans += $ways[d] / 2 if is_prime[d] }
puts ans`,
    },
  },
};
