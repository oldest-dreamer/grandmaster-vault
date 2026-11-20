import type { LanguageId, RatingTier, UsacoDivision } from '../types/vault';

export interface RatingLadderTier {
  tier: RatingTier;
  rankTitle: string;
  usaco: UsacoDivision;
  targetSkill: string;
  keyAlgorithms: string[];
  weeklyGoal: string;
}

export const RATING_LADDER: RatingLadderTier[] = [
  {
    tier: '800–1100',
    rankTitle: 'Newbie -> Pupil',
    usaco: 'Bronze',
    targetSkill: 'Implementation Fluency & Linear Invariants',
    keyAlgorithms: ['Prefix Sums', 'Difference Arrays', 'Frequency Maps', 'Greedy Sorting'],
    weeklyGoal: 'Solve 15 Div. 2 A/B problems with zero off-by-one WA.',
  },
  {
    tier: '1200–1400',
    rankTitle: 'Pupil -> Specialist',
    usaco: 'Silver',
    targetSkill: 'Monotonicity, Two Pointers & Basic Graphs',
    keyAlgorithms: ['Binary Search on Answer', 'Coordinate Compression', 'BFS / DFS', 'Exchange Greedy'],
    weeklyGoal: 'Master Silver flood-fill + binary search reductions.',
  },
  {
    tier: '1400–1600',
    rankTitle: 'Specialist -> Expert',
    usaco: 'Gold',
    targetSkill: 'Shortest Paths, DSU & State-Space DP',
    keyAlgorithms: ['Dijkstra / 0-1 BFS', 'DSU', 'Fenwick BIT', 'Knapsack & LIS'],
    weeklyGoal: 'Recognize DP states within 10 minutes of reading constraints.',
  },
  {
    tier: '1600–1900',
    rankTitle: 'Expert -> Candidate Master',
    usaco: 'Gold',
    targetSkill: 'Segment Trees, Tree Rerooting & String Automata',
    keyAlgorithms: ['Segment Trees', 'Tarjan SCC / 2-SAT', 'LCA Binary Lifting', 'KMP / Z-Func'],
    weeklyGoal: 'Upsolve every Div. 2 C/D + one +200 problem per contest.',
  },
  {
    tier: '1900–2200',
    rankTitle: 'Candidate Master -> Master',
    usaco: 'Platinum',
    targetSkill: 'Heavy Tree Machinery, Sqrt & Bipartite Flow',
    keyAlgorithms: ['HLD', 'Lazy / Persistent Segtree', 'Mo’s Algorithm', 'Hopcroft-Karp'],
    weeklyGoal: 'Write bug-free lazy segtrees and HLD under 15 minutes.',
  },
  {
    tier: '2200–2600',
    rankTitle: 'Master -> Grandmaster',
    usaco: 'Platinum',
    targetSkill: 'DP Optimizations, Flows & Polynomial Convolutions',
    keyAlgorithms: ['Dinic Max-Flow / MCMF', 'Aliens Trick / Li Chao', 'FFT / NTT', 'Suffix Automaton'],
    weeklyGoal: 'Spot convex DP & network flow reductions in Div. 1 C/D.',
  },
  {
    tier: '2600–3300+',
    rankTitle: 'Grandmaster -> Legendary GM',
    usaco: 'Advanced',
    targetSkill: 'Non-Bipartite Matching, FPS & Matroid Theory',
    keyAlgorithms: ['Edmonds Blossom', 'Slope Trick', 'Formal Power Series', 'Matroid Intersection'],
    weeklyGoal: 'Deconstruct 3000+ editorial reductions into reusable gadgets.',
  },
];

export interface ComplexityRule {
  id: string;
  notation: string;
  computeOps: (n: number) => number;
  maxNHint: string;
  matchingAlgorithms: string[];
}

export const COMPLEXITY_RULES: ComplexityRule[] = [
  {
    id: 'o-2n',
    notation: 'O(2^N) / O(N * 2^N)',
    computeOps: (n) => (n > 32 ? Infinity : n * Math.pow(2, n)),
    maxNHint: 'N <= 20..22',
    matchingAlgorithms: ['Bitmask DP', 'Submask Enumeration', 'Recursive Backtracking'],
  },
  {
    id: 'o-n3',
    notation: 'O(N^3)',
    computeOps: (n) => (n > 2000 ? Infinity : n * n * n),
    maxNHint: 'N <= 400..500',
    matchingAlgorithms: ['Floyd-Warshall', 'Edmonds Blossom', 'Interval DP', 'Matrix Gaussian Elimination'],
  },
  {
    id: 'o-n2',
    notation: 'O(N^2)',
    computeOps: (n) => (n > 50000 ? Infinity : n * n),
    maxNHint: 'N <= 5,000',
    matchingAlgorithms: ['2D Grid DP', 'Tree Rerooting Quadratic', 'All-Pairs Shortest Checks'],
  },
  {
    id: 'o-nsqrt',
    notation: 'O(N sqrt(N))',
    computeOps: (n) => n * Math.sqrt(n),
    maxNHint: 'N <= 10^5..2*10^5',
    matchingAlgorithms: ['Mo’s Algorithm', 'Sqrt Decomposition', 'Heavy-Light Threshold Splitting'],
  },
  {
    id: 'o-nlogn',
    notation: 'O(N log N)',
    computeOps: (n) => (n <= 1 ? 1 : n * Math.log2(n)),
    maxNHint: 'N <= 2*10^5..10^6',
    matchingAlgorithms: ['Segment Tree', 'Fenwick BIT', 'Dijkstra', 'FFT / NTT', 'Binary Search on Answer'],
  },
  {
    id: 'o-n',
    notation: 'O(N)',
    computeOps: (n) => n,
    maxNHint: 'N <= 10^7',
    matchingAlgorithms: ['Prefix Sums', 'Difference Arrays', 'Two Pointers', 'KMP / Z-Algorithm', 'Monotonic Queue'],
  },
  {
    id: 'o-logn',
    notation: 'O(log N)',
    computeOps: (n) => (n <= 1 ? 1 : Math.log2(n)),
    maxNHint: 'N <= 10^18',
    matchingAlgorithms: ['Matrix Exponentiation', 'Euclidean GCD', 'Digit DP', 'Modular Binary Exponentiation'],
  },
];

export interface LanguageProfile {
  id: LanguageId;
  name: string;
  speedIndex: string;
  cfCeiling: string;
  strengths: string;
  bottleneck: string;
  builtinStructures: string[];
  templateTitle: string;
  templateDescription: string;
  templateCode: string;
}

export const LANGUAGE_MATRIX: LanguageProfile[] = [
  {
    id: 'cpp20',
    name: 'C++20 (GCC 13+)',
    speedIndex: '1.0x Baseline (Fastest)',
    cfCeiling: '3600+ (LGM Unlimited)',
    strengths:
      'Zero-cost abstractions, PBDS order-statistics tree, deterministic memory, SIMD bitset.',
    bottleneck:
      'std::unordered_map uses identity hashing mod prime buckets—vulnerable to Codeforces hacks without splitmix64.',
    builtinStructures: [
      '__gnu_pbds::tree (ordered_set)',
      'std::bitset<N> (64x speedup)',
      'std::priority_queue / std::set',
      'std::ranges / std::span',
    ],
    templateTitle: 'splitmix64 Anti-Hash + PBDS Ordered Set Template',
    templateDescription:
      'Defeats deterministic Codeforces anti-hash tests and unlocks O(log N) order_of_key / find_by_order.',
    templateCode: `#include <bits/stdc++.h>
#include <ext/pb_ds/assoc_container.hpp>
#include <ext/pb_ds/tree_policy.hpp>
using namespace std;
using namespace __gnu_pbds;

struct custom_hash {
    static uint64_t splitmix64(uint64_t x) {
        x += 0x9e3779b97f4a7c15ULL;
        x = (x ^ (x >> 30)) * 0xbf58476d1ce4e5b9ULL;
        x = (x ^ (x >> 27)) * 0x94d049bb133111ebULL;
        return x ^ (x >> 31);
    }
    size_t operator()(uint64_t x) const {
        static const uint64_t FIXED_RANDOM =
            chrono::steady_clock::now().time_since_epoch().count();
        return splitmix64(x + FIXED_RANDOM);
    }
};

template <class T>
using ordered_set = tree<T, null_type, less<T>, rb_tree_tag, tree_order_statistics_node_update>;

template <class K, class V>
using safe_map = gp_hash_table<K, V, custom_hash>;`,
  },
  {
    id: 'rust',
    name: 'Rust (1.75+ Release)',
    speedIndex: '1.0x–1.15x (C++ Parity)',
    cfCeiling: '3300+ (LGM)',
    strengths:
      'LLVM -O3 machine speed, overflow checks in debug, algebraic enums, slices & iterators.',
    bottleneck:
      'Borrow checker rejects cyclic/parent-pointer graphs unless stored in flat Vec arena indices.',
    builtinStructures: [
      'Vec<T> Arena Indexing',
      'BTreeMap / BTreeSet',
      'BinaryHeap<Reverse<T>>',
      'VecDeque<T>',
    ],
    templateTitle: 'Safe Vec Arena Tree + Scanner Boilerplate',
    templateDescription:
      'Eliminates Rc/RefCell overhead in Segment Trees, Treaps, and Euler Tours using usize arena indices.',
    templateCode: `use std::io::{self, BufWriter, Read, Write};

#[derive(Clone, Default)]
struct ArenaNode {
    left: usize,
    right: usize,
    sum: i64,
}

struct ArenaTree {
    nodes: Vec<ArenaNode>,
}

impl ArenaTree {
    fn with_capacity(cap: usize) -> Self {
        Self { nodes: Vec::with_capacity(cap) }
    }
    fn alloc(&mut self, val: i64) -> usize {
        let id = self.nodes.len();
        self.nodes.push(ArenaNode { left: usize::MAX, right: usize::MAX, sum: val });
        id
    }
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let stdout = io::stdout();
    let mut out = BufWriter::new(stdout.lock());
    if let Some(tok) = it.next() {
        let _ = writeln!(out, "Parsed first token: {tok}");
    }
}`,
  },
  {
    id: 'java21',
    name: 'Java 21 (64-bit JVM)',
    speedIndex: '1.8x–3.0x (Warmup JIT)',
    cfCeiling: '2600–2800 (GM)',
    strengths:
      'BigInteger native, rich Collections, deterministic hashCode for strings, clean OOP isolation.',
    bottleneck:
      'Arrays.sort(int[]) uses Dual-Pivot Quicksort which degrades to O(N^2) on adversarial anti-quicksort inputs!',
    builtinStructures: [
      'TreeMap / TreeSet',
      'PriorityQueue',
      'ArrayDeque',
      'BigInteger',
    ],
    templateTitle: 'FastScanner + Anti-Quicksort Fisher-Yates Shuffle',
    templateDescription:
      'Prevents O(N^2) primitive array sort hacks and replaces slow java.util.Scanner.',
    templateCode: `import java.io.*;
import java.util.*;

public class Main {
    static final class FastScanner {
        private final InputStream in;
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;
        FastScanner(InputStream is) { this.in = is; }
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
            while ((c = readByte()) <= ' ') if (c == -1) return 0;
            long sign = 1;
            if (c == '-') { sign = -1; c = readByte(); }
            long res = 0;
            while (c > ' ') { res = res * 10 + (c - '0'); c = readByte(); }
            return res * sign;
        }
        int nextInt() throws IOException { return (int) nextLong(); }
    }

    static void safeSort(int[] a) {
        Random rng = new Random(System.nanoTime());
        for (int i = a.length - 1; i > 0; i--) {
            int j = rng.nextInt(i + 1);
            int tmp = a[i]; a[i] = a[j]; a[j] = tmp;
        }
        Arrays.sort(a);
    }
}`,
  },
  {
    id: 'python3',
    name: 'Python 3 / PyPy3',
    speedIndex: '4x–10x (PyPy3) / 40x (CPython)',
    cfCeiling: '2100–2400 (Master)',
    strengths:
      'Arbitrary-precision integers, rapid prototyping, slice semantics, heapq & bisect.',
    bottleneck:
      'No built-in TreeSet/OrderedSet, and Python int dict hashing equals x itself (hackable in O(N^2))!',
    builtinStructures: [
      'heapq (min-heap)',
      'bisect + Fenwick',
      'collections.deque',
      'functools.lru_cache',
    ],
    templateTitle: 'Dual-Heap Lazy-Delete Ordered Set + XOR Anti-Hash Salt',
    templateDescription:
      'Simulate multiset deletion/peek in O(log N) and defeat Python integer dict collision hacks.',
    templateCode: `import heapq
import random
import sys

RAND_XOR = random.getrandbits(62)

class SafeCounter:
    """XOR-salted dictionary resistant to Codeforces integer anti-hash tests."""
    def __init__(self):
        self.mp = {}
    def add(self, key: int, delta: int = 1) -> None:
        k = key ^ RAND_XOR
        self.mp[k] = self.mp.get(k, 0) + delta
    def get(self, key: int) -> int:
        return self.mp.get(key ^ RAND_XOR, 0)

class LazyOrderedMinHeap:
    """Supports push, lazy erase, and min peek in amortized O(log N)."""
    def __init__(self):
        self.h = []
        self.deleted = SafeCounter()
    def push(self, x: int) -> None:
        heapq.heappush(self.h, x)
    def erase(self, x: int) -> None:
        self.deleted.add(x, 1)
    def peek(self) -> int:
        while self.h and self.deleted.get(self.h[0]) > 0:
            val = heapq.heappop(self.h)
            self.deleted.add(val, -1)
        return self.h[0]`,
  },
  {
    id: 'ruby',
    name: 'Ruby 3.3 (YJIT)',
    speedIndex: '12x–25x (YJIT)',
    cfCeiling: '1800–2000 (Expert/CM)',
    strengths:
      'Expressive enumerables, arbitrary precision Integer, concise string/regex parsing.',
    bottleneck:
      'No native priority queue in stdlib prior to gems; recursive DFS hits default stack limits fast.',
    builtinStructures: [
      'Array#bsearch_index',
      'Hash (insertion-ordered)',
      'Set',
      'Integer (BigInt)',
    ],
    templateTitle: 'Ruby Binary Heap + Fast Bulk Input',
    templateDescription:
      'Lightweight zero-dependency MinHeap and bulk integer reader for Ruby contests.',
    templateCode: `class MinHeap
  def initialize
    @h = []
  end

  def push(x)
    @h << x
    i = @h.size - 1
    while i > 0
      p = (i - 1) >> 1
      break if @h[p] <= @h[i]
      @h[p], @h[i] = @h[i], @h[p]
      i = p
    end
  end

  def pop
    return nil if @h.empty?
    top = @h[0]
    last = @h.pop
    unless @h.empty?
      @h[0] = last
      i = 0
      n = @h.size
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
    top
  end
end`,
  },
];

export interface PlaybookPrinciple {
  id: string;
  category: 'Problem Solving' | 'Training Protocol' | 'Engineering & Anti-Hack';
  title: string;
  ruleSummary: string;
  actionChecklist: string[];
  codeSnippet?: string;
}

export const PLAYBOOK_PRINCIPLES: PlaybookPrinciple[] = [
  {
    id: 'pb-constraints',
    category: 'Problem Solving',
    title: 'Reverse-Engineering Constraints First',
    ruleSummary:
      'Never design an algorithm before translating N and Time Limit into the exact target Big-O envelope (~10^8 ops/sec).',
    actionChecklist: [
      'N <= 20 -> Bitmask DP or Meet-in-the-Middle (N <= 40).',
      'N <= 400 -> O(N^3) Floyd-Warshall, Interval DP, or Blossom.',
      'N <= 5000 -> O(N^2) DP or quadratic tree merging.',
      'N <= 2*10^5 -> O(N log N) Segment Tree, DSU, Sort + Two Pointers.',
      'N <= 10^18 -> O(log N) Matrix Exponentiation, Math, or Binary Search.',
    ],
  },
  {
    id: 'pb-invariants',
    category: 'Problem Solving',
    title: 'Invariants & Monovariants',
    ruleSummary:
      'Whenever an operation mutates an array or graph repeatedly, write down 3 quantities and test which stays constant (invariant) or moves strictly in one direction (monovariant).',
    actionChecklist: [
      'Check sum, alternating sum (odd - even), XOR sum, and parity of inversions.',
      'For termination proofs, define potential Phi(state) >= 0 that decreases by >= 1 every step.',
    ],
  },
  {
    id: 'pb-backwards',
    category: 'Problem Solving',
    title: 'Working Backwards & Reversing Time',
    ruleSummary:
      'Deletions in graphs or DSU are hard; insertions are trivial. Reverse the query timeline offline whenever elements only vanish.',
    actionChecklist: [
      'Convert edge deletions -> offline reverse-order DSU unions.',
      'For game states or constructive transforms, inspect the final target state and invert the last move.',
    ],
  },
  {
    id: 'pb-constructive',
    category: 'Problem Solving',
    title: 'Guessing Constructive Bounds on Small N',
    ruleSummary:
      'Brute-force N = 2..7 locally in 60 seconds to discover tight mathematical bounds and structural patterns instead of staring blindly.',
    actionChecklist: [
      'Write a 15-line Python/C++ brute force for N <= 7 and print optimal constructions.',
      'Look for repeating blocks of size 2, 3, or 4 and verify with induction.',
    ],
  },
  {
    id: 'pb-200-rule',
    category: 'Training Protocol',
    title: 'The +200 / -200 Rating Rule & 45–60 Min Struggle Rule',
    ruleSummary:
      'Spend 80% of practice between [CurrentRating, CurrentRating + 200]. Struggle cleanly for 45–60 minutes before reading a single hint—never jump to editorials after 10 minutes.',
    actionChecklist: [
      'Warm up with 1–2 problems at CurrentRating - 200 for implementation speed.',
      'Push ceiling at CurrentRating + 200; set a 50-minute focus timer before opening Hint 1.',
      'After solving or reading the editorial, log the missing mental trigger in your Mistake Log.',
    ],
  },
  {
    id: 'pb-upsolve',
    category: 'Training Protocol',
    title: 'Upsolving +1 Rule After Every Contest',
    ruleSummary:
      'Your rating grows exclusively from the first problem you could NOT solve during the live contest window.',
    actionChecklist: [
      'Immediately after every contest, pick the lowest-index unsolved problem (+1).',
      'Re-implement it cleanly from scratch until Accepted without looking at editorial code.',
    ],
  },
  {
    id: 'pb-stress-test',
    category: 'Engineering & Anti-Hack',
    title: 'Local Stress Testing (Fuzzing Script Generator)',
    ruleSummary:
      'When stuck on WA #14 with no clue, never guess patches—write a tiny brute-force oracle + random generator and find the smallest N = 4 counterexample in 2 seconds.',
    actionChecklist: [
      'Generate small graphs/arrays (N <= 7) where brute force is 100% obviously right.',
      'Run gen -> brute & fast in an infinite loop until outputs diverge.',
    ],
    codeSnippet: `#!/usr/bin/env bash
set -e
g++ -O2 sol.cpp -o sol
g++ -O2 brute.cpp -o brute
g++ -O2 gen.cpp -o gen

for ((i = 1; ; i++)); do
  ./gen "$i" > in.txt
  ./sol < in.txt > out_sol.txt
  ./brute < in.txt > out_brute.txt
  if ! diff -w -B out_sol.txt out_brute.txt > /dev/null; then
    echo "Counterexample found on seed $i:"
    cat in.txt
    echo "--- Expected (brute) ---"
    cat out_brute.txt
    echo "--- Got (sol) ---"
    cat out_sol.txt
    exit 1
  fi
  if (( i % 500 == 0 )); then echo "Passed $i random cases..."; fi
done`,
  },
  {
    id: 'pb-antihash',
    category: 'Engineering & Anti-Hack',
    title: 'Anti-Hash & Anti-Sort Countermeasures',
    ruleSummary:
      'Open-hacking rounds target deterministic unordered_map, Python int dicts, and Java Arrays.sort(int[]). Always salt hashes with runtime clocks.',
    actionChecklist: [
      'C++: Attach splitmix64 + steady_clock::now() to unordered_map or use gp_hash_table.',
      'Java: Shuffle primitive int[]/long[] before Arrays.sort, or sort Integer[] / ArrayList.',
      'Python: XOR dictionary integer keys with random.getrandbits(62).',
    ],
  },
];
