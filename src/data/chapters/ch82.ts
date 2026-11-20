import type { TheoryChapter } from '../../types/vault';

export const CH82_SIMULATED_ANNEALING: TheoryChapter = {
  slug: 'simulated-annealing-local-search',
  topicId: 'th-78',
  title: 'Simulated Annealing & Heuristic Search for Constructives',
  domain: 'Theoretical & Randomized',
  ratingTier: '2200–2600',
  usacoDivision: 'Platinum',
  subtitle: 'Boltzmann-Metropolis transitions, exponential cooling schedules, O(1) incremental energy delta evaluation, and 2-Opt / swap neighborhoods',
  analogyTitle: 'Shaking the Mountain Range so the Steel Ball Escapes Shallow Ditches',
  analogyBody:
    'Pure greedy Hill Climbing gets permanently trapped in the first local minimum it encounters because it only accepts moves with ΔE <= 0. Simulated Annealing (SA), inspired by statistical mechanics and metallurgical annealing, introduces a synthetic temperature T(t) = T_0 * (T_end / T_0)^(t / t_max) and accepts uphill moves (ΔE > 0) with the Metropolis-Boltzmann probability P(ΔE, T) = exp(-ΔE / T).\n\nImagine dropping a heavy steel ball onto a rugged mountain range (the objective function E(S)) while shaking the entire terrain violently. Early on, the shaking is intense (high temperature T_0 >> ΔE), so P ≈ 1 and the ball bounces freely out of shallow ditches and crosses tall ridges into deeper valleys. As you gradually dial down the shaking intensity (exponential cooling T_{k+1} = alpha * T_k), the ball loses the kinetic energy required to climb out of the deepest canyon and settles cleanly into the global minimum.\n\nUnder a symmetric irreducible neighborhood graph, the Metropolis kernel satisfies detailed balance with respect to the Gibbs-Boltzmann stationary distribution pi_T(S) = exp(-E(S)/T) / Z(T), which concentrates 100% of its probability mass on the global minima argmin E(S) as T -> 0+. In competitive programming, combining a 64-bit SplitMix64 PRNG with O(1) incremental ΔE evaluation executes 2 * 10^7 transitions per second.',
  prerequisites: [],
  traceTitle: 'Simulated Annealing with 2-Opt Subsegment Reversals on 4-Point Euclidean TSP',
  traceSubtitle: 'Uncrossing diagonal edges (0,0)-(4,3) and (0,3)-(4,0) via O(1) boundary delta checks and Boltzmann temperature decay',
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Step 1: Initialize Crossed Tour & High Starting Temperature T0 = 10.0',
      explanation: 'Start with tour P = [0, 1, 2, 3] where P0=(0,0), P1=(4,3), P2=(0,3), P3=(4,0). Edges: dist(0,1)=5, dist(1,2)=4, dist(2,3)=5, dist(3,0)=4. Total initial energy E = 18.0.',
      mode: 'array',
      arrays: [
        {
          name: 'Initial Crossed Tour P & Energy State',
          cells: [
            { index: 0, value: 'P0:(0,0)', label: 'v0', highlight: 'active' },
            { index: 1, value: 'P1:(4,3)', label: 'diag 5', highlight: 'active' },
            { index: 2, value: 'P2:(0,3)', label: 'side 4', highlight: 'neutral' },
            { index: 3, value: 'P3:(4,0)', label: 'diag 5', highlight: 'neutral' },
            { index: 4, value: 'E = 18.00', label: 'T = 10.0', highlight: 'updated' },
          ],
        },
      ],
      variables: { tour: '[0, 1, 2, 3]', E: '18.000000', T: '10.00' },
    },
    {
      stepNumber: 2,
      title: 'Step 2: Evaluate O(1) 2-Opt Delta on Subsegment P[1..2]',
      explanation: 'Propose reversing subsegment P[1..2] (swapping P1 and P2). Compute ΔE in O(1): remove edges (P0,P1)=5 and (P2,P3)=5, add edges (P0,P2)=3 and (P1,P3)=3. ΔE = (3 + 3) - (5 + 5) = -4.0.',
      mode: 'array',
      arrays: [
        {
          name: '2-Opt Boundary Edge Replacement on [L=1, R=2]',
          cells: [
            { index: 0, value: 'P0:(0,0)', label: 'anchor L-1', highlight: 'neutral' },
            { index: 1, value: 'P1:(4,3)', label: 'rev L=1', highlight: 'active' },
            { index: 2, value: 'P2:(0,3)', label: 'rev R=2', highlight: 'active' },
            { index: 3, value: 'P3:(4,0)', label: 'anchor R+1', highlight: 'neutral' },
            { index: 4, value: 'dE = -4.00', label: 'accept!', highlight: 'updated' },
          ],
        },
      ],
      variables: { oldEdges: '5 + 5 = 10', newEdges: '3 + 3 = 6', deltaE: '-4.000000' },
    },
    {
      stepNumber: 3,
      title: 'Step 3: Accept Uncrossed Tour (E = 14.0) & Freeze at Low Temperature',
      explanation: 'Since ΔE = -4.0 <= 0, accept with probability 1. New tour [0, 2, 1, 3] has perimeter 3 + 4 + 3 + 4 = 14.0. At T = 0.01, uphill moves with ΔE = +2.0 have exp(-200) ≈ 0 acceptance, locking in E* = 14.0.',
      mode: 'array',
      arrays: [
        {
          name: 'Optimal Uncrossed Perimeter Tour',
          cells: [
            { index: 0, value: 'P0:(0,0)', label: 'len 3', highlight: 'updated' },
            { index: 1, value: 'P2:(0,3)', label: 'len 4', highlight: 'updated' },
            { index: 2, value: 'P1:(4,3)', label: 'len 3', highlight: 'updated' },
            { index: 3, value: 'P3:(4,0)', label: 'len 4', highlight: 'updated' },
            { index: 4, value: 'E* = 14.00', label: 'T = 0.01', highlight: 'active' },
          ],
        },
      ],
      variables: { optimalTour: '[0, 2, 1, 3]', bestE: '14.000000', finalTemp: '0.01' },
    },
  ],
  reductionClues: [
    {
      clue: 'Constructive combinatorics asking for any valid configuration with zero conflicts (N-Queens, graph coloring, Latin squares)',
      translation: 'Define integer conflict count E(S) >= 0 with O(1) swap delta and anneal until E(S) == 0.',
    },
    {
      clue: 'Geometric cycle or routing problem (Euclidean TSP / VRP) where random vertex swaps produce tangled crossings',
      translation: 'Use 2-Opt subsegment reversal reverse(tour + i, tour + j + 1), which replaces only 2 boundary edges in O(1) time.',
    },
    {
      clue: 'Balanced graph bisection or K-way equal partitioning minimizing cut weight',
      translation: 'Maintain vertex-to-cluster incidence sums S[u][c] so swapping u in C_a and v in C_b evaluates ΔE = (S[u][a]-S[u][b]) + (S[v][b]-S[v][a]) + 2W[u][v] in O(1).',
    },
    {
      clue: 'Search stagnates in a deep suboptimal basin halfway through the time budget',
      translation: 'Trigger a periodic reheating spike (resetting T <- 0.25 * T_0) while preserving best_state separately from cur_state.',
    },
  ],
  timeComplexity: 'O(I * T_delta) where I = iterations and T_delta = O(1) incremental energy delta',
  spaceComplexity: 'O(N) current and best state storage',
  pitfalls: [
    {
      type: 'WA',
      title: 'Using 2-Element Vertex Swaps Instead of 2-Opt Subsegment Reversals in Geometric TSP',
      detail: 'Swapping two non-adjacent vertices modifies 4 edges and creates double-crossings; 2-Opt reverses P[i..j] and cleanly uncrosses a single pair of edges by replacing only 2 boundary edges.',
    },
    {
      type: 'TLE',
      title: 'Calling chrono::steady_clock::now() or std::pow() on Every Inner-Loop Iteration',
      detail: 'System clock syscalls and transcendental pow() take 30-100 CPU cycles—more than the O(1) delta check itself! Multiply T *= alpha or poll the clock only once every 256 iterations.',
    },
    {
      type: 'TLE',
      title: 'Mutating the State Before Checking Metropolis Acceptance and Rolling Back on Rejection',
      detail: 'At low temperatures, >95% of candidate moves are rejected. Always compute ΔE read-only in O(1) first, and only mutate the state when the move is accepted.',
    },
    {
      type: 'WA',
      title: 'Returning the Final Annealing State Instead of the Best-Ever Recorded State',
      detail: 'Especially with reheating or non-zero final temperature, cur_state may drift uphill near the end; always track best_state and polish it with deterministic steepest descent.',
    },
  ],
  implementations: {
    cpp20: `#include <iostream>
#include <vector>
#include <cmath>
#include <iomanip>
#include <algorithm>
#include <cstdint>

using namespace std;

// Fast deterministic SplitMix64 PRNG for zero-overhead SA sampling
struct SplitMix64 {
    uint64_t state;
    SplitMix64(uint64_t seed = 0x9E3779B97F4A7C15ULL) : state(seed) {}
    uint64_t next_u64() {
        uint64_t z = (state += 0x9E3779B97F4A7C15ULL);
        z = (z ^ (z >> 30)) * 0xBF58476D1CE4E5B9ULL;
        z = (z ^ (z >> 27)) * 0x94D049BB133111EBULL;
        return z ^ (z >> 31);
    }
    int next_int(int mod) { return (int)(next_u64() % (uint64_t)mod); }
    double next_double() { return (next_u64() >> 11) * 0x1.0p-53; }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    if (!(cin >> n)) return 0;
    vector<double> x(n), y(n);
    for (int i = 0; i < n; i++) cin >> x[i] >> y[i];
    if (n <= 1) {
        cout << "0.000000\\n";
        return 0;
    }
    vector<vector<double>> dist(n, vector<double>(n, 0.0));
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            dist[i][j] = hypot(x[i] - x[j], y[i] - y[j]);
        }
    }
    vector<int> tour(n);
    for (int i = 0; i < n; i++) tour[i] = i;
    auto calc_cost = [&](const vector<int>& p) {
        double c = 0.0;
        for (int i = 0; i < n; i++) c += dist[p[i]][p[(i + 1) % n]];
        return c;
    };
    double cur_cost = calc_cost(tour);
    double best_cost = cur_cost;
    vector<int> best_tour = tour;

    SplitMix64 rng(133742ULL);
    double T = 100.0;
    double alpha = 0.9995;
    int iterations = 60000;

    if (n >= 4) {
        for (int iter = 0; iter < iterations; iter++) {
            int i = 1 + rng.next_int(n - 2);
            int j = i + 1 + rng.next_int(n - 1 - i);
            int a = tour[i - 1], b = tour[i];
            int c = tour[j], d = tour[(j + 1) % n];
            double delta = (dist[a][c] + dist[b][d]) - (dist[a][b] + dist[c][d]);
            if (delta < -1e-11 || exp(-delta / T) > rng.next_double()) {
                reverse(tour.begin() + i, tour.begin() + j + 1);
                cur_cost += delta;
                if (cur_cost < best_cost - 1e-11) {
                    best_cost = cur_cost;
                    best_tour = tour;
                }
            }
            T *= alpha;
            if (T < 1e-6) T = 1e-6;
        }
        // Final deterministic 2-Opt polish to guarantee local optimality
        tour = best_tour;
        bool improved = true;
        while (improved) {
            improved = false;
            for (int i = 1; i < n - 1; i++) {
                for (int j = i + 1; j < n; j++) {
                    int a = tour[i - 1], b = tour[i];
                    int c = tour[j], d = tour[(j + 1) % n];
                    double delta = (dist[a][c] + dist[b][d]) - (dist[a][b] + dist[c][d]);
                    if (delta < -1e-11) {
                        reverse(tour.begin() + i, tour.begin() + j + 1);
                        improved = true;
                    }
                }
            }
        }
        best_cost = calc_cost(tour);
    }
    cout << fixed << setprecision(6) << best_cost << "\\n";
    return 0;
}`,
    rust: `use std::io::{self, Read};

struct SplitMix64 {
    state: u64,
}

impl SplitMix64 {
    fn new(seed: u64) -> Self {
        Self { state: seed }
    }
    fn next_u64(&mut self) -> u64 {
        self.state = self.state.wrapping_add(0x9E3779B97F4A7C15);
        let mut z = self.state;
        z = (z ^ (z >> 30)).wrapping_mul(0xBF58476D1CE4E5B9);
        z = (z ^ (z >> 27)).wrapping_mul(0x94D049BB133111EB);
        z ^ (z >> 31)
    }
    fn next_usize(&mut self, modulo: usize) -> usize {
        (self.next_u64() % (modulo as u64)) as usize
    }
    fn next_f64(&mut self) -> f64 {
        ((self.next_u64() >> 11) as f64) * (1.0 / ((1u64 << 53) as f64))
    }
}

fn calc_cost(tour: &[usize], dist: &[Vec<f64>]) -> f64 {
    let n = tour.len();
    let mut c = 0.0;
    for i in 0..n {
        c += dist[tour[i]][tour[(i + 1) % n]];
    }
    c
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let n: usize = match it.next() {
        Some(s) => s.parse().unwrap(),
        None => return,
    };
    let mut x = vec![0.0; n];
    let mut y = vec![0.0; n];
    for i in 0..n {
        x[i] = it.next().unwrap().parse().unwrap();
        y[i] = it.next().unwrap().parse().unwrap();
    }
    if n <= 1 {
        println!("0.000000");
        return;
    }
    let mut dist = vec![vec![0.0; n]; n];
    for i in 0..n {
        for j in 0..n {
            dist[i][j] = (x[i] - x[j]).hypot(y[i] - y[j]);
        }
    }
    let mut tour: Vec<usize> = (0..n).collect();
    let mut cur_cost = calc_cost(&tour, &dist);
    let mut best_cost = cur_cost;
    let mut best_tour = tour.clone();

    let mut rng = SplitMix64::new(133742);
    let mut t = 100.0_f64;
    let alpha = 0.9995_f64;

    if n >= 4 {
        for _ in 0..60000 {
            let i = 1 + rng.next_usize(n - 2);
            let j = i + 1 + rng.next_usize(n - 1 - i);
            let a = tour[i - 1];
            let b = tour[i];
            let c = tour[j];
            let d = tour[(j + 1) % n];
            let delta = (dist[a][c] + dist[b][d]) - (dist[a][b] + dist[c][d]);
            if delta < -1e-11 || (-delta / t).exp() > rng.next_f64() {
                tour[i..=j].reverse();
                cur_cost += delta;
                if cur_cost < best_cost - 1e-11 {
                    best_cost = cur_cost;
                    best_tour.clone_from(&tour);
                }
            }
            t *= alpha;
            if t < 1e-6 {
                t = 1e-6;
            }
        }
        tour = best_tour;
        let mut improved = true;
        while improved {
            improved = false;
            for i in 1..(n - 1) {
                for j in (i + 1)..n {
                    let a = tour[i - 1];
                    let b = tour[i];
                    let c = tour[j];
                    let d = tour[(j + 1) % n];
                    let delta = (dist[a][c] + dist[b][d]) - (dist[a][b] + dist[c][d]);
                    if delta < -1e-11 {
                        tour[i..=j].reverse();
                        improved = true;
                    }
                }
            }
        }
        best_cost = calc_cost(&tour, &dist);
    }
    println!("{:.6}", best_cost);
}`,
    java21: `import java.io.*;
import java.util.*;

public class Main {
    static class SplitMix64 {
        long state;
        SplitMix64(long seed) { this.state = seed; }
        long nextLong() {
            long z = (state += 0x9E3779B97F4A7C15L);
            z = (z ^ (z >>> 30)) * 0xBF58476D1CE4E5B9L;
            z = (z ^ (z >>> 27)) * 0x94D049BB133111EBL;
            return z ^ (z >>> 31);
        }
        int nextInt(int mod) {
            return (int) (Long.remainderUnsigned(nextLong(), mod));
        }
        double nextDouble() {
            return (nextLong() >>> 11) * 0x1.0p-53;
        }
    }

    static void reverse(int[] arr, int l, int r) {
        while (l < r) {
            int tmp = arr[l];
            arr[l] = arr[r];
            arr[r] = tmp;
            l++;
            r--;
        }
    }

    static double calcCost(int[] tour, double[][] dist) {
        int n = tour.length;
        double c = 0.0;
        for (int i = 0; i < n; i++) c += dist[tour[i]][tour[(i + 1) % n]];
        return c;
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
        double[] x = new double[n];
        double[] y = new double[n];
        for (int i = 0; i < n; i++) {
            while (!st.hasMoreTokens()) st = new StringTokenizer(br.readLine());
            x[i] = Double.parseDouble(st.nextToken());
            y[i] = Double.parseDouble(st.nextToken());
        }
        if (n <= 1) {
            System.out.println("0.000000");
            return;
        }
        double[][] dist = new double[n][n];
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                dist[i][j] = Math.hypot(x[i] - x[j], y[i] - y[j]);
            }
        }
        int[] tour = new int[n];
        for (int i = 0; i < n; i++) tour[i] = i;
        double curCost = calcCost(tour, dist);
        double bestCost = curCost;
        int[] bestTour = tour.clone();

        SplitMix64 rng = new SplitMix64(133742L);
        double T = 100.0;
        double alpha = 0.9995;

        if (n >= 4) {
            for (int iter = 0; iter < 60000; iter++) {
                int i = 1 + rng.nextInt(n - 2);
                int j = i + 1 + rng.nextInt(n - 1 - i);
                int a = tour[i - 1], b = tour[i];
                int c = tour[j], d = tour[(j + 1) % n];
                double delta = (dist[a][c] + dist[b][d]) - (dist[a][b] + dist[c][d]);
                if (delta < -1e-11 || Math.exp(-delta / T) > rng.nextDouble()) {
                    reverse(tour, i, j);
                    curCost += delta;
                    if (curCost < bestCost - 1e-11) {
                        bestCost = curCost;
                        bestTour = tour.clone();
                    }
                }
                T *= alpha;
                if (T < 1e-6) T = 1e-6;
            }
            tour = bestTour;
            boolean improved = true;
            while (improved) {
                improved = false;
                for (int i = 1; i < n - 1; i++) {
                    for (int j = i + 1; j < n; j++) {
                        int a = tour[i - 1], b = tour[i];
                        int c = tour[j], d = tour[(j + 1) % n];
                        double delta = (dist[a][c] + dist[b][d]) - (dist[a][b] + dist[c][d]);
                        if (delta < -1e-11) {
                            reverse(tour, i, j);
                            improved = true;
                        }
                    }
                }
            }
            bestCost = calcCost(tour, dist);
        }
        System.out.printf(Locale.US, "%.6f%n", bestCost);
    }
}`,
    python3: `import sys
import math

class SplitMix64:
    def __init__(self, seed=133742):
        self.state = seed & 0xFFFFFFFFFFFFFFFF

    def next_u64(self):
        self.state = (self.state + 0x9E3779B97F4A7C15) & 0xFFFFFFFFFFFFFFFF
        z = self.state
        z = ((z ^ (z >> 30)) * 0xBF58476D1CE4E5B9) & 0xFFFFFFFFFFFFFFFF
        z = ((z ^ (z >> 27)) * 0x94D049BB133111EB) & 0xFFFFFFFFFFFFFFFF
        return (z ^ (z >> 31)) & 0xFFFFFFFFFFFFFFFF

    def next_int(self, mod):
        return self.next_u64() % mod

    def next_double(self):
        return (self.next_u64() >> 11) * (1.0 / (1 << 53))

def main():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    it = iter(tokens)
    n = int(next(it))
    pts = [(float(next(it)), float(next(it))) for _ in range(n)]
    if n <= 1:
        print("0.000000")
        return
    dist = [[math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1]) for j in range(n)] for i in range(n)]
    tour = list(range(n))

    def calc_cost(p):
        return sum(dist[p[i]][p[(i + 1) % n]] for i in range(n))

    cur_cost = calc_cost(tour)
    best_cost = cur_cost
    best_tour = tour[:]

    rng = SplitMix64(133742)
    T = 100.0
    alpha = 0.9992

    if n >= 4:
        for _ in range(30000):
            i = 1 + rng.next_int(n - 2)
            j = i + 1 + rng.next_int(n - 1 - i)
            a, b = tour[i - 1], tour[i]
            c, d = tour[j], tour[(j + 1) % n]
            delta = (dist[a][c] + dist[b][d]) - (dist[a][b] + dist[c][d])
            if delta < -1e-11 or math.exp(-delta / T) > rng.next_double():
                tour[i:j + 1] = reversed(tour[i:j + 1])
                cur_cost += delta
                if cur_cost < best_cost - 1e-11:
                    best_cost = cur_cost
                    best_tour = tour[:]
            T *= alpha
            if T < 1e-6:
                T = 1e-6

        tour = best_tour
        improved = True
        while improved:
            improved = False
            for i in range(1, n - 1):
                for j in range(i + 1, n):
                    a, b = tour[i - 1], tour[i]
                    c, d = tour[j], tour[(j + 1) % n]
                    delta = (dist[a][c] + dist[b][d]) - (dist[a][b] + dist[c][d])
                    if delta < -1e-11:
                        tour[i:j + 1] = reversed(tour[i:j + 1])
                        improved = True
        best_cost = calc_cost(tour)

    print(f"{best_cost:.6f}")

if __name__ == '__main__':
    main()`,
    ruby: `MASK64 = 0xFFFFFFFFFFFFFFFF

class SplitMix64
  def initialize(seed = 133742)
    @state = seed & MASK64
  end

  def next_u64
    @state = (@state + 0x9E3779B97F4A7C15) & MASK64
    z = @state
    z = ((z ^ (z >> 30)) * 0xBF58476D1CE4E5B9) & MASK64
    z = ((z ^ (z >> 27)) * 0x94D049BB133111EB) & MASK64
    (z ^ (z >> 31)) & MASK64
  end

  def next_int(mod)
    next_u64 % mod
  end

  def next_double
    (next_u64 >> 11).to_f / (1 << 53)
  end
end

tokens = STDIN.read.split
exit if tokens.empty?
idx = 0
n = tokens[idx].to_i; idx += 1
pts = Array.new(n) do
  x = tokens[idx].to_f; y = tokens[idx + 1].to_f; idx += 2
  [x, y]
end
if n <= 1
  puts "0.000000"
  exit
end

dist = Array.new(n) do |i|
  Array.new(n) { |j| Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1]) }
end

calc_cost = lambda do |p|
  s = 0.0
  n.times { |i| s += dist[p[i]][p[(i + 1) % n]] }
  s
end

tour = (0...n).to_a
cur_cost = calc_cost.call(tour)
best_cost = cur_cost
best_tour = tour.dup

rng = SplitMix64.new(133742)
t = 100.0
alpha = 0.999

if n >= 4
  25000.times do
    i = 1 + rng.next_int(n - 2)
    j = i + 1 + rng.next_int(n - 1 - i)
    a = tour[i - 1]; b = tour[i]
    c = tour[j]; d = tour[(j + 1) % n]
    delta = (dist[a][c] + dist[b][d]) - (dist[a][b] + dist[c][d])
    if delta < -1e-11 || Math.exp(-delta / t) > rng.next_double
      tour[i..j] = tour[i..j].reverse
      cur_cost += delta
      if cur_cost < best_cost - 1e-11
        best_cost = cur_cost
        best_tour = tour.dup
      end
    end
    t *= alpha
    t = 1e-6 if t < 1e-6
  end

  tour = best_tour
  improved = true
  while improved
    improved = false
    (1...(n - 1)).each do |i|
      ((i + 1)...n).each do |j|
        a = tour[i - 1]; b = tour[i]
        c = tour[j]; d = tour[(j + 1) % n]
        delta = (dist[a][c] + dist[b][d]) - (dist[a][b] + dist[c][d])
        if delta < -1e-11
          tour[i..j] = tour[i..j].reverse
          improved = true
        end
      end
    end
  end
  best_cost = calc_cost.call(tour)
end

puts format("%.6f", best_cost)`,
  },
  practiceProblems: [
    {
      id: 'ch82-p1',
      tier: 'Warmup',
      ratingRange: '2100–2300',
      title: 'Euclidean TSP Tour Uncrossing via 2-Opt Simulated Annealing',
      statement:
        'Given $N$ points $(x_i, y_i)$ in the Euclidean plane ($1 \\le N \\le 40$, $|x_i|, |y_i| \\le 10^4$), compute the minimum perimeter of a closed Hamiltonian cycle visiting every point exactly once and returning to the starting point, printed to 6 decimal places.',
      constraints: '1 <= N <= 40, -10^4 <= x_i, y_i <= 10^4',
      sampleInput: '4\n0 0\n4 3\n0 3\n4 0',
      sampleOutput: '14.000000',
      hints: [
        'Precompute the $N \\times N$ Euclidean distance matrix $D[u][v] = \\hypot(x_u - x_v, y_u - y_v)$ once before starting the annealing loop.',
        'A 2-Opt move reverses the subsegment $P[i..j]$ ($1 \\le i < j < N$). Because the distance matrix is symmetric, the internal edges of $P[i..j]$ keep the exact same lengths; only the two boundary edges $(P[i-1], P[i])$ and $(P[j], P[(j+1) \\bmod N])$ are replaced by $(P[i-1], P[j])$ and $(P[i], P[(j+1) \\bmod N])$.',
        'Run Simulated Annealing with $O(1)$ delta checks followed by a deterministic 2-Opt local search pass to guarantee zero crossed edges remain.',
      ],
      solutions: {
        cpp20: `#include <iostream>
#include <vector>
#include <cmath>
#include <iomanip>
#include <algorithm>
#include <cstdint>

using namespace std;

struct SplitMix64 {
    uint64_t state;
    SplitMix64(uint64_t seed = 133742ULL) : state(seed) {}
    uint64_t next_u64() {
        uint64_t z = (state += 0x9E3779B97F4A7C15ULL);
        z = (z ^ (z >> 30)) * 0xBF58476D1CE4E5B9ULL;
        z = (z ^ (z >> 27)) * 0x94D049BB133111EBULL;
        return z ^ (z >> 31);
    }
    int next_int(int mod) { return (int)(next_u64() % (uint64_t)mod); }
    double next_double() { return (next_u64() >> 11) * 0x1.0p-53; }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    if (!(cin >> n)) return 0;
    vector<double> x(n), y(n);
    for (int i = 0; i < n; i++) cin >> x[i] >> y[i];
    if (n <= 1) {
        cout << "0.000000\\n";
        return 0;
    }
    vector<vector<double>> dist(n, vector<double>(n, 0.0));
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            dist[i][j] = hypot(x[i] - x[j], y[i] - y[j]);

    vector<int> tour(n);
    for (int i = 0; i < n; i++) tour[i] = i;
    auto calc_cost = [&](const vector<int>& p) {
        double c = 0.0;
        for (int i = 0; i < n; i++) c += dist[p[i]][p[(i + 1) % n]];
        return c;
    };
    double cur_cost = calc_cost(tour);
    double best_cost = cur_cost;
    vector<int> best_tour = tour;

    SplitMix64 rng(133742ULL);
    double T = 100.0, alpha = 0.9995;
    if (n >= 4) {
        for (int iter = 0; iter < 60000; iter++) {
            int i = 1 + rng.next_int(n - 2);
            int j = i + 1 + rng.next_int(n - 1 - i);
            int a = tour[i - 1], b = tour[i];
            int c = tour[j], d = tour[(j + 1) % n];
            double delta = (dist[a][c] + dist[b][d]) - (dist[a][b] + dist[c][d]);
            if (delta < -1e-11 || exp(-delta / T) > rng.next_double()) {
                reverse(tour.begin() + i, tour.begin() + j + 1);
                cur_cost += delta;
                if (cur_cost < best_cost - 1e-11) {
                    best_cost = cur_cost;
                    best_tour = tour;
                }
            }
            T *= alpha;
            if (T < 1e-6) T = 1e-6;
        }
        tour = best_tour;
        bool improved = true;
        while (improved) {
            improved = false;
            for (int i = 1; i < n - 1; i++) {
                for (int j = i + 1; j < n; j++) {
                    int a = tour[i - 1], b = tour[i];
                    int c = tour[j], d = tour[(j + 1) % n];
                    double delta = (dist[a][c] + dist[b][d]) - (dist[a][b] + dist[c][d]);
                    if (delta < -1e-11) {
                        reverse(tour.begin() + i, tour.begin() + j + 1);
                        improved = true;
                    }
                }
            }
        }
        best_cost = calc_cost(tour);
    }
    cout << fixed << setprecision(6) << best_cost << "\\n";
    return 0;
}`,
        rust: `use std::io::{self, Read};

struct SplitMix64 { state: u64 }
impl SplitMix64 {
    fn new(seed: u64) -> Self { Self { state: seed } }
    fn next_u64(&mut self) -> u64 {
        self.state = self.state.wrapping_add(0x9E3779B97F4A7C15);
        let mut z = self.state;
        z = (z ^ (z >> 30)).wrapping_mul(0xBF58476D1CE4E5B9);
        z = (z ^ (z >> 27)).wrapping_mul(0x94D049BB133111EB);
        z ^ (z >> 31)
    }
    fn next_usize(&mut self, m: usize) -> usize { (self.next_u64() % (m as u64)) as usize }
    fn next_f64(&mut self) -> f64 { ((self.next_u64() >> 11) as f64) * (1.0 / ((1u64 << 53) as f64)) }
}

fn calc_cost(tour: &[usize], dist: &[Vec<f64>]) -> f64 {
    let n = tour.len();
    (0..n).map(|i| dist[tour[i]][tour[(i + 1) % n]]).sum()
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let n: usize = match it.next() { Some(s) => s.parse().unwrap(), None => return };
    let mut x = vec![0.0; n];
    let mut y = vec![0.0; n];
    for i in 0..n {
        x[i] = it.next().unwrap().parse().unwrap();
        y[i] = it.next().unwrap().parse().unwrap();
    }
    if n <= 1 { println!("0.000000"); return; }
    let mut dist = vec![vec![0.0; n]; n];
    for i in 0..n {
        for j in 0..n { dist[i][j] = (x[i] - x[j]).hypot(y[i] - y[j]); }
    }
    let mut tour: Vec<usize> = (0..n).collect();
    let mut cur_cost = calc_cost(&tour, &dist);
    let mut best_cost = cur_cost;
    let mut best_tour = tour.clone();
    let mut rng = SplitMix64::new(133742);
    let mut t = 100.0_f64;
    if n >= 4 {
        for _ in 0..60000 {
            let i = 1 + rng.next_usize(n - 2);
            let j = i + 1 + rng.next_usize(n - 1 - i);
            let (a, b, c, d) = (tour[i - 1], tour[i], tour[j], tour[(j + 1) % n]);
            let delta = (dist[a][c] + dist[b][d]) - (dist[a][b] + dist[c][d]);
            if delta < -1e-11 || (-delta / t).exp() > rng.next_f64() {
                tour[i..=j].reverse();
                cur_cost += delta;
                if cur_cost < best_cost - 1e-11 {
                    best_cost = cur_cost;
                    best_tour.clone_from(&tour);
                }
            }
            t = (t * 0.9995).max(1e-6);
        }
        tour = best_tour;
        let mut improved = true;
        while improved {
            improved = false;
            for i in 1..(n - 1) {
                for j in (i + 1)..n {
                    let (a, b, c, d) = (tour[i - 1], tour[i], tour[j], tour[(j + 1) % n]);
                    let delta = (dist[a][c] + dist[b][d]) - (dist[a][b] + dist[c][d]);
                    if delta < -1e-11 { tour[i..=j].reverse(); improved = true; }
                }
            }
        }
        best_cost = calc_cost(&tour, &dist);
    }
    println!("{:.6}", best_cost);
}`,
        java21: `import java.io.*;
import java.util.*;

public class Main {
    static class SplitMix64 {
        long state;
        SplitMix64(long seed) { this.state = seed; }
        long nextLong() {
            long z = (state += 0x9E3779B97F4A7C15L);
            z = (z ^ (z >>> 30)) * 0xBF58476D1CE4E5B9L;
            z = (z ^ (z >>> 27)) * 0x94D049BB133111EBL;
            return z ^ (z >>> 31);
        }
        int nextInt(int mod) { return (int) Long.remainderUnsigned(nextLong(), mod); }
        double nextDouble() { return (nextLong() >>> 11) * 0x1.0p-53; }
    }

    static void reverse(int[] arr, int l, int r) {
        while (l < r) { int t = arr[l]; arr[l++] = arr[r]; arr[r--] = t; }
    }

    static double calcCost(int[] tour, double[][] dist) {
        int n = tour.length;
        double c = 0.0;
        for (int i = 0; i < n; i++) c += dist[tour[i]][tour[(i + 1) % n]];
        return c;
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
        double[] x = new double[n], y = new double[n];
        for (int i = 0; i < n; i++) {
            while (!st.hasMoreTokens()) st = new StringTokenizer(br.readLine());
            x[i] = Double.parseDouble(st.nextToken());
            y[i] = Double.parseDouble(st.nextToken());
        }
        if (n <= 1) { System.out.println("0.000000"); return; }
        double[][] dist = new double[n][n];
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++)
                dist[i][j] = Math.hypot(x[i] - x[j], y[i] - y[j]);
        int[] tour = new int[n];
        for (int i = 0; i < n; i++) tour[i] = i;
        double curCost = calcCost(tour, dist), bestCost = curCost;
        int[] bestTour = tour.clone();
        SplitMix64 rng = new SplitMix64(133742L);
        double T = 100.0;
        if (n >= 4) {
            for (int iter = 0; iter < 60000; iter++) {
                int i = 1 + rng.nextInt(n - 2);
                int j = i + 1 + rng.nextInt(n - 1 - i);
                int a = tour[i - 1], b = tour[i], c = tour[j], d = tour[(j + 1) % n];
                double delta = (dist[a][c] + dist[b][d]) - (dist[a][b] + dist[c][d]);
                if (delta < -1e-11 || Math.exp(-delta / T) > rng.nextDouble()) {
                    reverse(tour, i, j);
                    curCost += delta;
                    if (curCost < bestCost - 1e-11) { bestCost = curCost; bestTour = tour.clone(); }
                }
                T = Math.max(1e-6, T * 0.9995);
            }
            tour = bestTour;
            boolean improved = true;
            while (improved) {
                improved = false;
                for (int i = 1; i < n - 1; i++) {
                    for (int j = i + 1; j < n; j++) {
                        int a = tour[i - 1], b = tour[i], c = tour[j], d = tour[(j + 1) % n];
                        double delta = (dist[a][c] + dist[b][d]) - (dist[a][b] + dist[c][d]);
                        if (delta < -1e-11) { reverse(tour, i, j); improved = true; }
                    }
                }
            }
            bestCost = calcCost(tour, dist);
        }
        System.out.printf(Locale.US, "%.6f%n", bestCost);
    }
}`,
        python3: `import sys
import math

class SplitMix64:
    def __init__(self, seed=133742):
        self.state = seed & 0xFFFFFFFFFFFFFFFF

    def next_u64(self):
        self.state = (self.state + 0x9E3779B97F4A7C15) & 0xFFFFFFFFFFFFFFFF
        z = self.state
        z = ((z ^ (z >> 30)) * 0xBF58476D1CE4E5B9) & 0xFFFFFFFFFFFFFFFF
        z = ((z ^ (z >> 27)) * 0x94D049BB133111EB) & 0xFFFFFFFFFFFFFFFF
        return (z ^ (z >> 31)) & 0xFFFFFFFFFFFFFFFF

    def next_int(self, mod):
        return self.next_u64() % mod

    def next_double(self):
        return (self.next_u64() >> 11) * (1.0 / (1 << 53))

def main():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    it = iter(tokens)
    n = int(next(it))
    pts = [(float(next(it)), float(next(it))) for _ in range(n)]
    if n <= 1:
        print("0.000000")
        return
    dist = [[math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1]) for j in range(n)] for i in range(n)]
    tour = list(range(n))
    calc_cost = lambda p: sum(dist[p[i]][p[(i + 1) % n]] for i in range(n))
    cur_cost = calc_cost(tour)
    best_cost = cur_cost
    best_tour = tour[:]
    rng = SplitMix64(133742)
    T = 100.0
    if n >= 4:
        for _ in range(30000):
            i = 1 + rng.next_int(n - 2)
            j = i + 1 + rng.next_int(n - 1 - i)
            a, b, c, d = tour[i - 1], tour[i], tour[j], tour[(j + 1) % n]
            delta = (dist[a][c] + dist[b][d]) - (dist[a][b] + dist[c][d])
            if delta < -1e-11 or math.exp(-delta / T) > rng.next_double():
                tour[i:j + 1] = reversed(tour[i:j + 1])
                cur_cost += delta
                if cur_cost < best_cost - 1e-11:
                    best_cost = cur_cost
                    best_tour = tour[:]
            T = max(1e-6, T * 0.9992)
        tour = best_tour
        improved = True
        while improved:
            improved = False
            for i in range(1, n - 1):
                for j in range(i + 1, n):
                    a, b, c, d = tour[i - 1], tour[i], tour[j], tour[(j + 1) % n]
                    delta = (dist[a][c] + dist[b][d]) - (dist[a][b] + dist[c][d])
                    if delta < -1e-11:
                        tour[i:j + 1] = reversed(tour[i:j + 1])
                        improved = True
        best_cost = calc_cost(tour)
    print(f"{best_cost:.6f}")

if __name__ == '__main__':
    main()`,
        ruby: `MASK64 = 0xFFFFFFFFFFFFFFFF

class SplitMix64
  def initialize(seed = 133742)
    @state = seed & MASK64
  end
  def next_u64
    @state = (@state + 0x9E3779B97F4A7C15) & MASK64
    z = @state
    z = ((z ^ (z >> 30)) * 0xBF58476D1CE4E5B9) & MASK64
    z = ((z ^ (z >> 27)) * 0x94D049BB133111EB) & MASK64
    (z ^ (z >> 31)) & MASK64
  end
  def next_int(mod); next_u64 % mod; end
  def next_double; (next_u64 >> 11).to_f / (1 << 53); end
end

tokens = STDIN.read.split
exit if tokens.empty?
idx = 0
n = tokens[idx].to_i; idx += 1
pts = Array.new(n) { x = tokens[idx].to_f; y = tokens[idx + 1].to_f; idx += 2; [x, y] }
if n <= 1
  puts "0.000000"
  exit
end
dist = Array.new(n) { |i| Array.new(n) { |j| Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1]) } }
calc_cost = ->(p) { (0...n).sum { |i| dist[p[i]][p[(i + 1) % n]] } }
tour = (0...n).to_a
cur_cost = calc_cost.call(tour)
best_cost = cur_cost
best_tour = tour.dup
rng = SplitMix64.new(133742)
t = 100.0
if n >= 4
  25000.times do
    i = 1 + rng.next_int(n - 2)
    j = i + 1 + rng.next_int(n - 1 - i)
    a = tour[i - 1]; b = tour[i]; c = tour[j]; d = tour[(j + 1) % n]
    delta = (dist[a][c] + dist[b][d]) - (dist[a][b] + dist[c][d])
    if delta < -1e-11 || Math.exp(-delta / t) > rng.next_double
      tour[i..j] = tour[i..j].reverse
      cur_cost += delta
      if cur_cost < best_cost - 1e-11
        best_cost = cur_cost
        best_tour = tour.dup
      end
    end
    t = [1e-6, t * 0.999].max
  end
  tour = best_tour
  improved = true
  while improved
    improved = false
    (1...(n - 1)).each do |i|
      ((i + 1)...n).each do |j|
        a = tour[i - 1]; b = tour[i]; c = tour[j]; d = tour[(j + 1) % n]
        delta = (dist[a][c] + dist[b][d]) - (dist[a][b] + dist[c][d])
        if delta < -1e-11
          tour[i..j] = tour[i..j].reverse
          improved = true
        end
      end
    end
  end
  best_cost = calc_cost.call(tour)
end
puts format("%.6f", best_cost)`,
      },
    },
    {
      id: 'ch82-p2',
      tier: 'Standard',
      ratingRange: '2300–2500',
      title: 'Minimum Balanced Graph Bisection via O(1) Gain-Swap Annealing',
      statement:
        'Given an undirected weighted graph with an even number of vertices $N$ ($2 \\le N \\le 36$, $N$ even) and $M$ weighted edges ($0 \\le M \\le N(N-1)/2$, $1 \\le w_e \\le 10^6$), partition the vertex set $V = \\{1, \\dots, N\\}$ into two disjoint subsets $A$ and $B$ of equal size $|A| = |B| = N/2$ so as to minimize the total weight of edges crossing between $A$ and $B$. Output the minimum possible bisection cut weight.',
      constraints: '2 <= N <= 36 (N even), 0 <= M <= N(N-1)/2, 1 <= w_e <= 10^6',
      sampleInput: '4 5\n1 2 10\n3 4 10\n1 3 1\n2 4 1\n1 4 2',
      sampleOutput: '4',
      hints: [
        'Maintain the partition as two arrays `side[u] in {0, 1}` along with `S0[y]` (sum of edge weights from $y$ to side 0) and `S1[y]` (sum of edge weights from $y$ to side 1).',
        'When proposing a swap between $u$ (in side 0) and $v$ (in side 1), the edge $(u, v)$ stays across the cut in both states. Thus the exact energy change in $O(1)$ time is $\\Delta E = (S_0[u] - S_1[u]) + (S_1[v] - S_0[v]) + 2 W[u][v]$.',
        'Only when a swap is accepted do we spend $O(N)$ time updating `S0[y] += W[y][v] - W[y][u]` and `S1[y] += W[y][u] - W[y][v]` for $y \\in [0, N)$. Follow SA with a deterministic Kernighan-Lin / 2-swap local descent.',
      ],
      solutions: {
        cpp20: `#include <iostream>
#include <vector>
#include <cmath>
#include <algorithm>
#include <cstdint>

using namespace std;

struct SplitMix64 {
    uint64_t state;
    SplitMix64(uint64_t seed = 987654321ULL) : state(seed) {}
    uint64_t next_u64() {
        uint64_t z = (state += 0x9E3779B97F4A7C15ULL);
        z = (z ^ (z >> 30)) * 0xBF58476D1CE4E5B9ULL;
        z = (z ^ (z >> 27)) * 0x94D049BB133111EBULL;
        return z ^ (z >> 31);
    }
    int next_int(int mod) { return (int)(next_u64() % (uint64_t)mod); }
    double next_double() { return (next_u64() >> 11) * 0x1.0p-53; }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    if (!(cin >> n >> m)) return 0;
    vector<vector<long long>> W(n, vector<long long>(n, 0));
    long long max_w = 1;
    for (int i = 0; i < m; i++) {
        int u, v;
        long long w;
        cin >> u >> v >> w;
        --u; --v;
        W[u][v] += w;
        W[v][u] += w;
        max_w = max(max_w, w);
    }
    int half = n / 2;
    vector<int> side(n, 0);
    for (int i = half; i < n; i++) side[i] = 1;

    vector<long long> S0(n, 0), S1(n, 0);
    long long cur_cut = 0;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            if (side[j] == 0) S0[i] += W[i][j];
            else S1[i] += W[i][j];
        }
        if (side[i] == 0) cur_cut += S1[i];
    }
    long long best_cut = cur_cut;
    vector<int> best_side = side;

    vector<int> A, B;
    A.reserve(half); B.reserve(half);
    for (int i = 0; i < n; i++) {
        if (side[i] == 0) A.push_back(i);
        else B.push_back(i);
    }

    SplitMix64 rng(987654321ULL);
    double T = (double)max_w * 4.0;
    double alpha = 0.9994;

    for (int iter = 0; iter < 50000; iter++) {
        int ia = rng.next_int(half);
        int ib = rng.next_int(half);
        int u = A[ia], v = B[ib];
        long long delta = (S0[u] - S1[u]) + (S1[v] - S0[v]) + 2LL * W[u][v];
        if (delta <= 0 || exp(-(double)delta / T) > rng.next_double()) {
            side[u] = 1;
            side[v] = 0;
            A[ia] = v;
            B[ib] = u;
            for (int y = 0; y < n; y++) {
                S0[y] += W[y][v] - W[y][u];
                S1[y] += W[y][u] - W[y][v];
            }
            cur_cut += delta;
            if (cur_cut < best_cut) {
                best_cut = cur_cut;
                best_side = side;
            }
        }
        T *= alpha;
        if (T < 1e-5) T = 1e-5;
    }

    // Deterministic steepest-descent polish from best_side
    side = best_side;
    fill(S0.begin(), S0.end(), 0);
    fill(S1.begin(), S1.end(), 0);
    cur_cut = 0;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            if (side[j] == 0) S0[i] += W[i][j];
            else S1[i] += W[i][j];
        }
        if (side[i] == 0) cur_cut += S1[i];
    }
    bool improved = true;
    while (improved) {
        improved = false;
        for (int u = 0; u < n; u++) {
            if (side[u] != 0) continue;
            for (int v = 0; v < n; v++) {
                if (side[v] != 1) continue;
                long long delta = (S0[u] - S1[u]) + (S1[v] - S0[v]) + 2LL * W[u][v];
                if (delta < 0) {
                    side[u] = 1;
                    side[v] = 0;
                    for (int y = 0; y < n; y++) {
                        S0[y] += W[y][v] - W[y][u];
                        S1[y] += W[y][u] - W[y][v];
                    }
                    cur_cut += delta;
                    improved = true;
                    break;
                }
            }
        }
    }
    best_cut = min(best_cut, cur_cut);
    cout << best_cut << "\\n";
    return 0;
}`,
        rust: `use std::io::{self, Read};

struct SplitMix64 { state: u64 }
impl SplitMix64 {
    fn new(seed: u64) -> Self { Self { state: seed } }
    fn next_u64(&mut self) -> u64 {
        self.state = self.state.wrapping_add(0x9E3779B97F4A7C15);
        let mut z = self.state;
        z = (z ^ (z >> 30)).wrapping_mul(0xBF58476D1CE4E5B9);
        z = (z ^ (z >> 27)).wrapping_mul(0x94D049BB133111EB);
        z ^ (z >> 31)
    }
    fn next_usize(&mut self, m: usize) -> usize { (self.next_u64() % (m as u64)) as usize }
    fn next_f64(&mut self) -> f64 { ((self.next_u64() >> 11) as f64) * (1.0 / ((1u64 << 53) as f64)) }
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let n: usize = match it.next() { Some(s) => s.parse().unwrap(), None => return };
    let m: usize = it.next().unwrap().parse().unwrap();
    let mut w = vec![vec![0i64; n]; n];
    let mut max_w = 1i64;
    for _ in 0..m {
        let u: usize = it.next().unwrap().parse::<usize>().unwrap() - 1;
        let v: usize = it.next().unwrap().parse::<usize>().unwrap() - 1;
        let wt: i64 = it.next().unwrap().parse().unwrap();
        w[u][v] += wt;
        w[v][u] += wt;
        if wt > max_w { max_w = wt; }
    }
    let half = n / 2;
    let mut side = vec![0usize; n];
    for i in half..n { side[i] = 1; }
    let mut s0 = vec![0i64; n];
    let mut s1 = vec![0i64; n];
    let mut cur_cut = 0i64;
    for i in 0..n {
        for j in 0..n {
            if side[j] == 0 { s0[i] += w[i][j]; } else { s1[i] += w[i][j]; }
        }
        if side[i] == 0 { cur_cut += s1[i]; }
    }
    let mut best_cut = cur_cut;
    let mut best_side = side.clone();
    let mut a: Vec<usize> = (0..half).collect();
    let mut b: Vec<usize> = (half..n).collect();

    let mut rng = SplitMix64::new(987654321);
    let mut t = (max_w as f64) * 4.0;
    for _ in 0..50000 {
        let ia = rng.next_usize(half);
        let ib = rng.next_usize(half);
        let u = a[ia];
        let v = b[ib];
        let delta = (s0[u] - s1[u]) + (s1[v] - s0[v]) + 2 * w[u][v];
        if delta <= 0 || (-(delta as f64) / t).exp() > rng.next_f64() {
            side[u] = 1;
            side[v] = 0;
            a[ia] = v;
            b[ib] = u;
            for y in 0..n {
                s0[y] += w[y][v] - w[y][u];
                s1[y] += w[y][u] - w[y][v];
            }
            cur_cut += delta;
            if cur_cut < best_cut {
                best_cut = cur_cut;
                best_side.clone_from(&side);
            }
        }
        t = (t * 0.9994).max(1e-5);
    }

    side = best_side;
    s0.fill(0);
    s1.fill(0);
    cur_cut = 0;
    for i in 0..n {
        for j in 0..n {
            if side[j] == 0 { s0[i] += w[i][j]; } else { s1[i] += w[i][j]; }
        }
        if side[i] == 0 { cur_cut += s1[i]; }
    }
    let mut improved = true;
    while improved {
        improved = false;
        for u in 0..n {
            if side[u] != 0 { continue; }
            for v in 0..n {
                if side[v] != 1 { continue; }
                let delta = (s0[u] - s1[u]) + (s1[v] - s0[v]) + 2 * w[u][v];
                if delta < 0 {
                    side[u] = 1;
                    side[v] = 0;
                    for y in 0..n {
                        s0[y] += w[y][v] - w[y][u];
                        s1[y] += w[y][u] - w[y][v];
                    }
                    cur_cut += delta;
                    improved = true;
                    break;
                }
            }
        }
    }
    best_cut = best_cut.min(cur_cut);
    println!("{}", best_cut);
}`,
        java21: `import java.io.*;
import java.util.*;

public class Main {
    static class SplitMix64 {
        long state;
        SplitMix64(long seed) { this.state = seed; }
        long nextLong() {
            long z = (state += 0x9E3779B97F4A7C15L);
            z = (z ^ (z >>> 30)) * 0xBF58476D1CE4E5B9L;
            z = (z ^ (z >>> 27)) * 0x94D049BB133111EBL;
            return z ^ (z >>> 31);
        }
        int nextInt(int mod) { return (int) Long.remainderUnsigned(nextLong(), mod); }
        double nextDouble() { return (nextLong() >>> 11) * 0x1.0p-53; }
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
        long[][] W = new long[n][n];
        long maxW = 1;
        for (int i = 0; i < m; i++) {
            while (!st.hasMoreTokens()) st = new StringTokenizer(br.readLine());
            int u = Integer.parseInt(st.nextToken()) - 1;
            int v = Integer.parseInt(st.nextToken()) - 1;
            long w = Long.parseLong(st.nextToken());
            W[u][v] += w;
            W[v][u] += w;
            maxW = Math.max(maxW, w);
        }
        int half = n / 2;
        int[] side = new int[n];
        for (int i = half; i < n; i++) side[i] = 1;
        long[] S0 = new long[n], S1 = new long[n];
        long curCut = 0;
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (side[j] == 0) S0[i] += W[i][j];
                else S1[i] += W[i][j];
            }
            if (side[i] == 0) curCut += S1[i];
        }
        long bestCut = curCut;
        int[] bestSide = side.clone();
        int[] A = new int[half], B = new int[half];
        for (int i = 0; i < half; i++) { A[i] = i; B[i] = half + i; }

        SplitMix64 rng = new SplitMix64(987654321L);
        double T = maxW * 4.0;
        for (int iter = 0; iter < 50000; iter++) {
            int ia = rng.nextInt(half), ib = rng.nextInt(half);
            int u = A[ia], v = B[ib];
            long delta = (S0[u] - S1[u]) + (S1[v] - S0[v]) + 2L * W[u][v];
            if (delta <= 0 || Math.exp(-delta / T) > rng.nextDouble()) {
                side[u] = 1; side[v] = 0;
                A[ia] = v; B[ib] = u;
                for (int y = 0; y < n; y++) {
                    S0[y] += W[y][v] - W[y][u];
                    S1[y] += W[y][u] - W[y][v];
                }
                curCut += delta;
                if (curCut < bestCut) { bestCut = curCut; bestSide = side.clone(); }
            }
            T = Math.max(1e-5, T * 0.9994);
        }

        side = bestSide;
        Arrays.fill(S0, 0); Arrays.fill(S1, 0);
        curCut = 0;
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (side[j] == 0) S0[i] += W[i][j];
                else S1[i] += W[i][j];
            }
            if (side[i] == 0) curCut += S1[i];
        }
        boolean improved = true;
        while (improved) {
            improved = false;
            for (int u = 0; u < n; u++) {
                if (side[u] != 0) continue;
                for (int v = 0; v < n; v++) {
                    if (side[v] != 1) continue;
                    long delta = (S0[u] - S1[u]) + (S1[v] - S0[v]) + 2L * W[u][v];
                    if (delta < 0) {
                        side[u] = 1; side[v] = 0;
                        for (int y = 0; y < n; y++) {
                            S0[y] += W[y][v] - W[y][u];
                            S1[y] += W[y][u] - W[y][v];
                        }
                        curCut += delta;
                        improved = true;
                        break;
                    }
                }
            }
        }
        bestCut = Math.min(bestCut, curCut);
        System.out.println(bestCut);
    }
}`,
        python3: `import sys
import math

class SplitMix64:
    def __init__(self, seed=987654321):
        self.state = seed & 0xFFFFFFFFFFFFFFFF

    def next_u64(self):
        self.state = (self.state + 0x9E3779B97F4A7C15) & 0xFFFFFFFFFFFFFFFF
        z = self.state
        z = ((z ^ (z >> 30)) * 0xBF58476D1CE4E5B9) & 0xFFFFFFFFFFFFFFFF
        z = ((z ^ (z >> 27)) * 0x94D049BB133111EB) & 0xFFFFFFFFFFFFFFFF
        return (z ^ (z >> 31)) & 0xFFFFFFFFFFFFFFFF

    def next_int(self, mod):
        return self.next_u64() % mod

    def next_double(self):
        return (self.next_u64() >> 11) * (1.0 / (1 << 53))

def main():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    it = iter(tokens)
    n = int(next(it))
    m = int(next(it))
    W = [[0] * n for _ in range(n)]
    max_w = 1
    for _ in range(m):
        u = int(next(it)) - 1
        v = int(next(it)) - 1
        w = int(next(it))
        W[u][v] += w
        W[v][u] += w
        if w > max_w:
            max_w = w

    half = n // 2
    side = [0] * half + [1] * half
    S0 = [0] * n
    S1 = [0] * n
    cur_cut = 0
    for i in range(n):
        for j in range(n):
            if side[j] == 0:
                S0[i] += W[i][j]
            else:
                S1[i] += W[i][j]
        if side[i] == 0:
            cur_cut += S1[i]

    best_cut = cur_cut
    best_side = side[:]
    A = list(range(half))
    B = list(range(half, n))

    rng = SplitMix64(987654321)
    T = float(max_w) * 4.0

    for _ in range(25000):
        ia = rng.next_int(half)
        ib = rng.next_int(half)
        u, v = A[ia], B[ib]
        delta = (S0[u] - S1[u]) + (S1[v] - S0[v]) + 2 * W[u][v]
        if delta <= 0 or math.exp(-delta / T) > rng.next_double():
            side[u] = 1
            side[v] = 0
            A[ia] = v
            B[ib] = u
            Wu, Wv = W[u], W[v]
            for y in range(n):
                diff = Wv[y] - Wu[y]
                S0[y] += diff
                S1[y] -= diff
            cur_cut += delta
            if cur_cut < best_cut:
                best_cut = cur_cut
                best_side = side[:]
        T = max(1e-5, T * 0.9992)

    side = best_side
    S0 = [0] * n
    S1 = [0] * n
    cur_cut = 0
    for i in range(n):
        for j in range(n):
            if side[j] == 0:
                S0[i] += W[i][j]
            else:
                S1[i] += W[i][j]
        if side[i] == 0:
            cur_cut += S1[i]

    improved = True
    while improved:
        improved = False
        for u in range(n):
            if side[u] != 0:
                continue
            for v in range(n):
                if side[v] != 1:
                    continue
                delta = (S0[u] - S1[u]) + (S1[v] - S0[v]) + 2 * W[u][v]
                if delta < 0:
                    side[u] = 1
                    side[v] = 0
                    for y in range(n):
                        S0[y] += W[y][v] - W[y][u]
                        S1[y] += W[y][u] - W[y][v]
                    cur_cut += delta
                    improved = True
                    break

    print(min(best_cut, cur_cut))

if __name__ == '__main__':
    main()`,
        ruby: `MASK64 = 0xFFFFFFFFFFFFFFFF

class SplitMix64
  def initialize(seed = 987654321)
    @state = seed & MASK64
  end
  def next_u64
    @state = (@state + 0x9E3779B97F4A7C15) & MASK64
    z = @state
    z = ((z ^ (z >> 30)) * 0xBF58476D1CE4E5B9) & MASK64
    z = ((z ^ (z >> 27)) * 0x94D049BB133111EB) & MASK64
    (z ^ (z >> 31)) & MASK64
  end
  def next_int(mod); next_u64 % mod; end
  def next_double; (next_u64 >> 11).to_f / (1 << 53); end
end

tokens = STDIN.read.split
exit if tokens.empty?
idx = 0
n = tokens[idx].to_i; m = tokens[idx + 1].to_i; idx += 2
w = Array.new(n) { Array.new(n, 0) }
max_w = 1
m.times do
  u = tokens[idx].to_i - 1; v = tokens[idx + 1].to_i - 1; wt = tokens[idx + 2].to_i; idx += 3
  w[u][v] += wt
  w[v][u] += wt
  max_w = wt if wt > max_w
end

half = n / 2
side = Array.new(n) { |i| i < half ? 0 : 1 }
s0 = Array.new(n, 0)
s1 = Array.new(n, 0)
cur_cut = 0
n.times do |i|
  n.times do |j|
    if side[j] == 0
      s0[i] += w[i][j]
    else
      s1[i] += w[i][j]
    end
  end
  cur_cut += s1[i] if side[i] == 0
end

best_cut = cur_cut
best_side = side.dup
a = (0...half).to_a
b = (half...n).to_a
rng = SplitMix64.new(987654321)
t = max_w.to_f * 4.0

20000.times do
  ia = rng.next_int(half)
  ib = rng.next_int(half)
  u = a[ia]; v = b[ib]
  delta = (s0[u] - s1[u]) + (s1[v] - s0[v]) + 2 * w[u][v]
  if delta <= 0 || Math.exp(-delta / t) > rng.next_double
    side[u] = 1; side[v] = 0
    a[ia] = v; b[ib] = u
    n.times do |y|
      diff = w[y][v] - w[y][u]
      s0[y] += diff
      s1[y] -= diff
    end
    cur_cut += delta
    if cur_cut < best_cut
      best_cut = cur_cut
      best_side = side.dup
    end
  end
  t = [1e-5, t * 0.999].max
end

side = best_side
s0.fill(0); s1.fill(0)
cur_cut = 0
n.times do |i|
  n.times do |j|
    if side[j] == 0
      s0[i] += w[i][j]
    else
      s1[i] += w[i][j]
    end
  end
  cur_cut += s1[i] if side[i] == 0
end

improved = true
while improved
  improved = false
  n.times do |u|
    next unless side[u] == 0
    n.times do |v|
      next unless side[v] == 1
      delta = (s0[u] - s1[u]) + (s1[v] - s0[v]) + 2 * w[u][v]
      if delta < 0
        side[u] = 1; side[v] = 0
        n.times do |y|
          s0[y] += w[y][v] - w[y][u]
          s1[y] += w[y][u] - w[y][v]
        end
        cur_cut += delta
        improved = true
        break
      end
    end
  end
end

puts [best_cut, cur_cut].min`,
      },
    },
    {
      id: 'ch82-p3',
      tier: 'Boss',
      ratingRange: '2500–2800',
      title: 'Minimum-Cut K-Way Equal Graph Partitioning with Periodic Reheating',
      statement:
        'Given an undirected weighted graph with $N$ vertices ($2 \\le N \\le 36$), $M$ weighted edges ($0 \\le M \\le N(N-1)/2$), and an integer $K$ ($2 \\le K \\le N$, $K \\mid N$), partition the $N$ vertices into $K$ disjoint clusters $C_1, C_2, \\dots, C_K$ of exact size $N / K$ each so as to minimize the total weight of edges whose endpoints lie in different clusters. Output the minimum inter-cluster cut weight.',
      constraints: '2 <= N <= 36, 2 <= K <= N (K divides N), 0 <= M <= N(N-1)/2, 1 <= w_e <= 10^6',
      sampleInput: '6 6 3\n1 2 10\n3 4 10\n5 6 10\n2 3 1\n4 5 2\n6 1 3',
      sampleOutput: '6',
      hints: [
        'Maintain `S[u][c]`, the sum of edge weights from vertex $u$ to cluster $c \\in [0, K)$. The total cut weight is $\\frac{1}{2} \\sum_{u=0}^{N-1} (\\text{deg}(u) - S[u][\\text{cluster}[u]])$.',
        'When swapping $u \\in C_a$ and $v \\in C_b$ ($a \\neq b$), the internal edge weight changes by $(S[u][b] - W[u][v] - S[u][a]) + (S[v][a] - W[u][v] - S[v][b])$, so the cut weight changes in $O(1)$ time by $\\Delta E = (S[u][a] - S[u][b]) + (S[v][b] - S[v][a]) + 2 W[u][v]$.',
        'Combine an exponential cooling schedule with periodic reheating spikes and a final deterministic pairwise steepest-descent pass so the solver escapes multi-cluster local traps.',
      ],
      solutions: {
        cpp20: `#include <iostream>
#include <vector>
#include <cmath>
#include <algorithm>
#include <cstdint>

using namespace std;

struct SplitMix64 {
    uint64_t state;
    SplitMix64(uint64_t seed = 20260402ULL) : state(seed) {}
    uint64_t next_u64() {
        uint64_t z = (state += 0x9E3779B97F4A7C15ULL);
        z = (z ^ (z >> 30)) * 0xBF58476D1CE4E5B9ULL;
        z = (z ^ (z >> 27)) * 0x94D049BB133111EBULL;
        return z ^ (z >> 31);
    }
    int next_int(int mod) { return (int)(next_u64() % (uint64_t)mod); }
    double next_double() { return (next_u64() >> 11) * 0x1.0p-53; }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m, k;
    if (!(cin >> n >> m >> k)) return 0;
    vector<vector<long long>> W(n, vector<long long>(n, 0));
    long long total_w = 0, max_w = 1;
    for (int i = 0; i < m; i++) {
        int u, v;
        long long w;
        cin >> u >> v >> w;
        --u; --v;
        W[u][v] += w;
        W[v][u] += w;
        total_w += w;
        max_w = max(max_w, w);
    }
    if (k == 1) {
        cout << 0 << "\\n";
        return 0;
    }
    if (k == n) {
        cout << total_w << "\\n";
        return 0;
    }
    int sz = n / k;
    vector<int> col(n);
    for (int i = 0; i < n; i++) col[i] = i / sz;

    vector<vector<long long>> S(n, vector<long long>(k, 0));
    long long internal_w = 0;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) S[i][col[j]] += W[i][j];
        internal_w += S[i][col[i]];
    }
    internal_w /= 2;
    long long cur_cut = total_w - internal_w;
    long long best_cut = cur_cut;
    vector<int> best_col = col;

    SplitMix64 rng(20260402ULL);
    double T0 = (double)max_w * 4.0;
    double T = T0;
    double alpha = 0.9994;

    for (int iter = 0; iter < 60000; iter++) {
        if (iter == 30000) T = T0 * 0.25; // Periodic reheating spike
        int u = rng.next_int(n);
        int v = rng.next_int(n);
        int a = col[u], b = col[v];
        if (a == b) continue;
        long long delta = (S[u][a] - S[u][b]) + (S[v][b] - S[v][a]) + 2LL * W[u][v];
        if (delta <= 0 || exp(-(double)delta / T) > rng.next_double()) {
            col[u] = b;
            col[v] = a;
            for (int y = 0; y < n; y++) {
                S[y][a] += W[y][v] - W[y][u];
                S[y][b] += W[y][u] - W[y][v];
            }
            cur_cut += delta;
            if (cur_cut < best_cut) {
                best_cut = cur_cut;
                best_col = col;
            }
        }
        T *= alpha;
        if (T < 1e-5) T = 1e-5;
    }

    col = best_col;
    for (int i = 0; i < n; i++) fill(S[i].begin(), S[i].end(), 0);
    internal_w = 0;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) S[i][col[j]] += W[i][j];
        internal_w += S[i][col[i]];
    }
    cur_cut = total_w - internal_w / 2;

    bool improved = true;
    while (improved) {
        improved = false;
        for (int u = 0; u < n; u++) {
            for (int v = u + 1; v < n; v++) {
                int a = col[u], b = col[v];
                if (a == b) continue;
                long long delta = (S[u][a] - S[u][b]) + (S[v][b] - S[v][a]) + 2LL * W[u][v];
                if (delta < 0) {
                    col[u] = b;
                    col[v] = a;
                    for (int y = 0; y < n; y++) {
                        S[y][a] += W[y][v] - W[y][u];
                        S[y][b] += W[y][u] - W[y][v];
                    }
                    cur_cut += delta;
                    improved = true;
                }
            }
        }
    }
    cout << min(best_cut, cur_cut) << "\\n";
    return 0;
}`,
        rust: `use std::io::{self, Read};

struct SplitMix64 { state: u64 }
impl SplitMix64 {
    fn new(seed: u64) -> Self { Self { state: seed } }
    fn next_u64(&mut self) -> u64 {
        self.state = self.state.wrapping_add(0x9E3779B97F4A7C15);
        let mut z = self.state;
        z = (z ^ (z >> 30)).wrapping_mul(0xBF58476D1CE4E5B9);
        z = (z ^ (z >> 27)).wrapping_mul(0x94D049BB133111EB);
        z ^ (z >> 31)
    }
    fn next_usize(&mut self, m: usize) -> usize { (self.next_u64() % (m as u64)) as usize }
    fn next_f64(&mut self) -> f64 { ((self.next_u64() >> 11) as f64) * (1.0 / ((1u64 << 53) as f64)) }
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let n: usize = match it.next() { Some(s) => s.parse().unwrap(), None => return };
    let m: usize = it.next().unwrap().parse().unwrap();
    let k: usize = it.next().unwrap().parse().unwrap();
    let mut w = vec![vec![0i64; n]; n];
    let mut total_w = 0i64;
    let mut max_w = 1i64;
    for _ in 0..m {
        let u: usize = it.next().unwrap().parse::<usize>().unwrap() - 1;
        let v: usize = it.next().unwrap().parse::<usize>().unwrap() - 1;
        let wt: i64 = it.next().unwrap().parse().unwrap();
        w[u][v] += wt;
        w[v][u] += wt;
        total_w += wt;
        if wt > max_w { max_w = wt; }
    }
    if k == 1 { println!("0"); return; }
    if k == n { println!("{}", total_w); return; }
    let sz = n / k;
    let mut col: Vec<usize> = (0..n).map(|i| i / sz).collect();
    let mut s = vec![vec![0i64; k]; n];
    let mut internal_w = 0i64;
    for i in 0..n {
        for j in 0..n { s[i][col[j]] += w[i][j]; }
        internal_w += s[i][col[i]];
    }
    let mut cur_cut = total_w - internal_w / 2;
    let mut best_cut = cur_cut;
    let mut best_col = col.clone();

    let mut rng = SplitMix64::new(20260402);
    let t0 = (max_w as f64) * 4.0;
    let mut t = t0;
    for iter in 0..60000 {
        if iter == 30000 { t = t0 * 0.25; }
        let u = rng.next_usize(n);
        let v = rng.next_usize(n);
        let a = col[u];
        let b = col[v];
        if a == b { continue; }
        let delta = (s[u][a] - s[u][b]) + (s[v][b] - s[v][a]) + 2 * w[u][v];
        if delta <= 0 || (-(delta as f64) / t).exp() > rng.next_f64() {
            col[u] = b;
            col[v] = a;
            for y in 0..n {
                s[y][a] += w[y][v] - w[y][u];
                s[y][b] += w[y][u] - w[y][v];
            }
            cur_cut += delta;
            if cur_cut < best_cut {
                best_cut = cur_cut;
                best_col.clone_from(&col);
            }
        }
        t = (t * 0.9994).max(1e-5);
    }

    col = best_col;
    for i in 0..n { s[i].fill(0); }
    internal_w = 0;
    for i in 0..n {
        for j in 0..n { s[i][col[j]] += w[i][j]; }
        internal_w += s[i][col[i]];
    }
    cur_cut = total_w - internal_w / 2;
    let mut improved = true;
    while improved {
        improved = false;
        for u in 0..n {
            for v in (u + 1)..n {
                let a = col[u];
                let b = col[v];
                if a == b { continue; }
                let delta = (s[u][a] - s[u][b]) + (s[v][b] - s[v][a]) + 2 * w[u][v];
                if delta < 0 {
                    col[u] = b;
                    col[v] = a;
                    for y in 0..n {
                        s[y][a] += w[y][v] - w[y][u];
                        s[y][b] += w[y][u] - w[y][v];
                    }
                    cur_cut += delta;
                    improved = true;
                }
            }
        }
    }
    println!("{}", best_cut.min(cur_cut));
}`,
        java21: `import java.io.*;
import java.util.*;

public class Main {
    static class SplitMix64 {
        long state;
        SplitMix64(long seed) { this.state = seed; }
        long nextLong() {
            long z = (state += 0x9E3779B97F4A7C15L);
            z = (z ^ (z >>> 30)) * 0xBF58476D1CE4E5B9L;
            z = (z ^ (z >>> 27)) * 0x94D049BB133111EBL;
            return z ^ (z >>> 31);
        }
        int nextInt(int mod) { return (int) Long.remainderUnsigned(nextLong(), mod); }
        double nextDouble() { return (nextLong() >>> 11) * 0x1.0p-53; }
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
        int k = Integer.parseInt(st.nextToken());
        long[][] W = new long[n][n];
        long totalW = 0, maxW = 1;
        for (int i = 0; i < m; i++) {
            while (!st.hasMoreTokens()) st = new StringTokenizer(br.readLine());
            int u = Integer.parseInt(st.nextToken()) - 1;
            int v = Integer.parseInt(st.nextToken()) - 1;
            long w = Long.parseLong(st.nextToken());
            W[u][v] += w;
            W[v][u] += w;
            totalW += w;
            maxW = Math.max(maxW, w);
        }
        if (k == 1) { System.out.println(0); return; }
        if (k == n) { System.out.println(totalW); return; }
        int sz = n / k;
        int[] col = new int[n];
        for (int i = 0; i < n; i++) col[i] = i / sz;
        long[][] S = new long[n][k];
        long internalW = 0;
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) S[i][col[j]] += W[i][j];
            internalW += S[i][col[i]];
        }
        long curCut = totalW - internalW / 2;
        long bestCut = curCut;
        int[] bestCol = col.clone();

        SplitMix64 rng = new SplitMix64(20260402L);
        double T0 = maxW * 4.0, T = T0;
        for (int iter = 0; iter < 60000; iter++) {
            if (iter == 30000) T = T0 * 0.25;
            int u = rng.nextInt(n), v = rng.nextInt(n);
            int a = col[u], b = col[v];
            if (a == b) continue;
            long delta = (S[u][a] - S[u][b]) + (S[v][b] - S[v][a]) + 2L * W[u][v];
            if (delta <= 0 || Math.exp(-delta / T) > rng.nextDouble()) {
                col[u] = b; col[v] = a;
                for (int y = 0; y < n; y++) {
                    S[y][a] += W[y][v] - W[y][u];
                    S[y][b] += W[y][u] - W[y][v];
                }
                curCut += delta;
                if (curCut < bestCut) { bestCut = curCut; bestCol = col.clone(); }
            }
            T = Math.max(1e-5, T * 0.9994);
        }

        col = bestCol;
        for (int i = 0; i < n; i++) Arrays.fill(S[i], 0);
        internalW = 0;
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) S[i][col[j]] += W[i][j];
            internalW += S[i][col[i]];
        }
        curCut = totalW - internalW / 2;
        boolean improved = true;
        while (improved) {
            improved = false;
            for (int u = 0; u < n; u++) {
                for (int v = u + 1; v < n; v++) {
                    int a = col[u], b = col[v];
                    if (a == b) continue;
                    long delta = (S[u][a] - S[u][b]) + (S[v][b] - S[v][a]) + 2L * W[u][v];
                    if (delta < 0) {
                        col[u] = b; col[v] = a;
                        for (int y = 0; y < n; y++) {
                            S[y][a] += W[y][v] - W[y][u];
                            S[y][b] += W[y][u] - W[y][v];
                        }
                        curCut += delta;
                        improved = true;
                    }
                }
            }
        }
        System.out.println(Math.min(bestCut, curCut));
    }
}`,
        python3: `import sys
import math

class SplitMix64:
    def __init__(self, seed=20260402):
        self.state = seed & 0xFFFFFFFFFFFFFFFF

    def next_u64(self):
        self.state = (self.state + 0x9E3779B97F4A7C15) & 0xFFFFFFFFFFFFFFFF
        z = self.state
        z = ((z ^ (z >> 30)) * 0xBF58476D1CE4E5B9) & 0xFFFFFFFFFFFFFFFF
        z = ((z ^ (z >> 27)) * 0x94D049BB133111EB) & 0xFFFFFFFFFFFFFFFF
        return (z ^ (z >> 31)) & 0xFFFFFFFFFFFFFFFF

    def next_int(self, mod):
        return self.next_u64() % mod

    def next_double(self):
        return (self.next_u64() >> 11) * (1.0 / (1 << 53))

def main():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    it = iter(tokens)
    n = int(next(it))
    m = int(next(it))
    k = int(next(it))
    W = [[0] * n for _ in range(n)]
    total_w = 0
    max_w = 1
    for _ in range(m):
        u = int(next(it)) - 1
        v = int(next(it)) - 1
        w = int(next(it))
        W[u][v] += w
        W[v][u] += w
        total_w += w
        if w > max_w:
            max_w = w
    if k == 1:
        print(0)
        return
    if k == n:
        print(total_w)
        return

    sz = n // k
    col = [i // sz for i in range(n)]
    S = [[0] * k for _ in range(n)]
    internal_w = 0
    for i in range(n):
        for j in range(n):
            S[i][col[j]] += W[i][j]
        internal_w += S[i][col[i]]
    cur_cut = total_w - internal_w // 2
    best_cut = cur_cut
    best_col = col[:]

    rng = SplitMix64(20260402)
    T0 = float(max_w) * 4.0
    T = T0
    for it_num in range(30000):
        if it_num == 15000:
            T = T0 * 0.25
        u = rng.next_int(n)
        v = rng.next_int(n)
        a, b = col[u], col[v]
        if a == b:
            continue
        delta = (S[u][a] - S[u][b]) + (S[v][b] - S[v][a]) + 2 * W[u][v]
        if delta <= 0 or math.exp(-delta / T) > rng.next_double():
            col[u] = b
            col[v] = a
            Wu, Wv = W[u], W[v]
            for y in range(n):
                diff = Wv[y] - Wu[y]
                S[y][a] += diff
                S[y][b] -= diff
            cur_cut += delta
            if cur_cut < best_cut:
                best_cut = cur_cut
                best_col = col[:]
        T = max(1e-5, T * 0.9992)

    col = best_col
    S = [[0] * k for _ in range(n)]
    internal_w = 0
    for i in range(n):
        for j in range(n):
            S[i][col[j]] += W[i][j]
        internal_w += S[i][col[i]]
    cur_cut = total_w - internal_w // 2

    improved = True
    while improved:
        improved = False
        for u in range(n):
            for v in range(u + 1, n):
                a, b = col[u], col[v]
                if a == b:
                    continue
                delta = (S[u][a] - S[u][b]) + (S[v][b] - S[v][a]) + 2 * W[u][v]
                if delta < 0:
                    col[u] = b
                    col[v] = a
                    for y in range(n):
                        S[y][a] += W[y][v] - W[y][u]
                        S[y][b] += W[y][u] - W[y][v]
                    cur_cut += delta
                    improved = True

    print(min(best_cut, cur_cut))

if __name__ == '__main__':
    main()`,
        ruby: `MASK64 = 0xFFFFFFFFFFFFFFFF

class SplitMix64
  def initialize(seed = 20260402)
    @state = seed & MASK64
  end
  def next_u64
    @state = (@state + 0x9E3779B97F4A7C15) & MASK64
    z = @state
    z = ((z ^ (z >> 30)) * 0xBF58476D1CE4E5B9) & MASK64
    z = ((z ^ (z >> 27)) * 0x94D049BB133111EB) & MASK64
    (z ^ (z >> 31)) & MASK64
  end
  def next_int(mod); next_u64 % mod; end
  def next_double; (next_u64 >> 11).to_f / (1 << 53); end
end

tokens = STDIN.read.split
exit if tokens.empty?
idx = 0
n = tokens[idx].to_i; m = tokens[idx + 1].to_i; k = tokens[idx + 2].to_i; idx += 3
w = Array.new(n) { Array.new(n, 0) }
total_w = 0
max_w = 1
m.times do
  u = tokens[idx].to_i - 1; v = tokens[idx + 1].to_i - 1; wt = tokens[idx + 2].to_i; idx += 3
  w[u][v] += wt
  w[v][u] += wt
  total_w += wt
  max_w = wt if wt > max_w
end
if k == 1
  puts 0
  exit
end
if k == n
  puts total_w
  exit
end

sz = n / k
col = Array.new(n) { |i| i / sz }
s = Array.new(n) { Array.new(k, 0) }
internal_w = 0
n.times do |i|
  n.times { |j| s[i][col[j]] += w[i][j] }
  internal_w += s[i][col[i]]
end
cur_cut = total_w - internal_w / 2
best_cut = cur_cut
best_col = col.dup

rng = SplitMix64.new(20260402)
t0 = max_w.to_f * 4.0
t = t0
24000.times do |iter|
  t = t0 * 0.25 if iter == 12000
  u = rng.next_int(n)
  v = rng.next_int(n)
  a = col[u]; b = col[v]
  next if a == b
  delta = (s[u][a] - s[u][b]) + (s[v][b] - s[v][a]) + 2 * w[u][v]
  if delta <= 0 || Math.exp(-delta / t) > rng.next_double
    col[u] = b; col[v] = a
    n.times do |y|
      diff = w[y][v] - w[y][u]
      s[y][a] += diff
      s[y][b] -= diff
    end
    cur_cut += delta
    if cur_cut < best_cut
      best_cut = cur_cut
      best_col = col.dup
    end
  end
  t = [1e-5, t * 0.999].max
end

col = best_col
s = Array.new(n) { Array.new(k, 0) }
internal_w = 0
n.times do |i|
  n.times { |j| s[i][col[j]] += w[i][j] }
  internal_w += s[i][col[i]]
end
cur_cut = total_w - internal_w / 2

improved = true
while improved
  improved = false
  n.times do |u|
    ((u + 1)...n).each do |v|
      a = col[u]; b = col[v]
      next if a == b
      delta = (s[u][a] - s[u][b]) + (s[v][b] - s[v][a]) + 2 * w[u][v]
      if delta < 0
        col[u] = b; col[v] = a
        n.times do |y|
          s[y][a] += w[y][v] - w[y][u]
          s[y][b] += w[y][u] - w[y][v]
        end
        cur_cut += delta
        improved = true
      end
    end
  end
end

puts [best_cut, cur_cut].min`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'AtCoder',
      title: 'AtCoder Heuristic Contest (AHC) — 2-Opt Routing & Placement Annealing',
      difficulty: '2400',
      url: 'https://atcoder.jp/contests',
      patternNote: 'Evaluate ΔE read-only in O(1) before mutating state; >90% of low-temperature moves are rejected.',
    },
    {
      platform: 'Codeforces',
      title: 'Constructive Combinatorics & Subgraph Bisection via Local Search',
      difficulty: '2500',
      url: 'https://codeforces.com/problemset',
      patternNote: 'Formulate constructive constraints as an integer penalty E(S) >= 0 and anneal until E(S) == 0.',
    },
    {
      platform: 'CodeChef',
      title: 'Balanced K-Way Partitioning & TSP Heuristic Optimization',
      difficulty: '2500',
      url: 'https://www.codechef.com/problems',
      patternNote: 'Always follow Simulated Annealing with a deterministic steepest-descent 2-Opt or swap polish.',
    },
  ],
  interviewNotes: [
    'Calibrate initial temperature T_0 ≈ 2 * ΔE_avg (so initial uphill moves have exp(-0.5) ≈ 60% acceptance) and final temperature T_end ≈ 0.1 * ΔE_min (so final uphill moves have < 0.005% acceptance).',
    'Simulated Annealing outperforms Multi-Start Random Hill Climbing on rugged landscapes because high-quality minima cluster inside deep super-basins where SA hops across internal ridges without resetting to high-altitude random states.',
    'In Euclidean TSP, 2-Opt subsegment reversal replaces only 2 boundary edges in O(1) time because the distance matrix is symmetric.',
  ],
  projectBlueprint: {
    title: 'Vehicle Routing (VRP) & VLSI Macro-Cell Floorplan Annealing Workbench',
    tagline: 'Real-time 60 FPS Boltzmann annealing & 2-Opt route uncrossing visualizer',
    stackSummary: 'C++20 / TypeScript Web Worker SplitMix64 Annealer + O(1) 2-Opt Delta Kernel + Live Boltzmann Telemetry Chart',
    asciiDiagram:
`[Initial Tour / Partition] ---> [O(1) Read-Only Delta Check] ---> [Metropolis exp(-dE/T)]
            ^                                                               |
            +-------- [Exponential Cooling + 2-Opt Steepest Polish] <-------+`,
    milestones: [
      { id: 'm1', title: 'O(1) 2-Opt & Gain-Swap Kernel', detail: 'Evaluate boundary edge replacements and cluster-incidence swaps without copying state.' },
      { id: 'm2', title: 'Adaptive Cooling & Reheating Scheduler', detail: 'Support exponential decay and automatic reheating spikes when acceptance drops below 1%.' },
      { id: 'm3', title: 'Deterministic Steepest-Descent Polish', detail: 'Guarantee zero crossed edges remain via a final exhaustive 2-Opt sweep.' },
    ],
    starterCode: `// O(1) 2-Opt delta evaluation for reversing tour[i..j]:
// double delta = (dist[a][c] + dist[b][d]) - (dist[a][b] + dist[c][d]);`,
  },
};
