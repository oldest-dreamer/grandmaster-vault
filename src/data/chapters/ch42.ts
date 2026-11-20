import type { TheoryChapter } from '../../types/vault';

export const CH42_SPRAGUE_GRUNDY_GAMES: TheoryChapter = {
  slug: 'sprague-grundy-combinatorial-games',
  topicId: 'ma-52',
  title: 'Nim, Sprague-Grundy Theorem & Misere Games',
  domain: 'Math, Number Theory & Algebra',
  ratingTier: '1600–1900',
  usacoDivision: 'Gold',
  subtitle:
    'Decompose ANY finite impartial combinatorial game into equivalent Nim piles via Grundy values (mex of reachable states) and combine independent subgames using XOR—plus Misere Nim and Tree Hackenbush.',
  analogyTitle: 'The Balanced Scale & Universal XOR Currency Analogy',
  analogyBody:
    'In **Normal-Play Nim** (where the player unable to move loses), two equal piles `[x, x]` give the second player a **mirroring strategy**: whatever tokens the first player removes from one pile, the second player copies on the twin pile until the board hits `[0, 0]`. **XOR (`^`)** generalizes this mirroring to ANY number of piles: if `A1 ^ A2 ^ ... ^ An != 0`, you can always shrink one pile `Ai` down to `Ai ^ S < Ai` (pick the pile containing the highest set bit of `S`!) to hand your opponent a `0` XOR-sum! **Sprague-Grundy Theorem** takes this even further: EVERY finite, acyclic, impartial game state `u` behaves identically to a single Nim pile of size `g[u] = mex({g[v] : u -> v})` (the **Minimum Excluded** non-negative integer among all legal next states!). When a game splits into independent subgames `u1 + u2 + ... + uk` (like breaking a pile into two heaps, or playing on multiple graphs simultaneously), its combined Grundy number is simply **`g[u1] ^ g[u2] ^ ... ^ g[uk]`**!',
  prerequisites: [
    {
      slug: 'xor-basis-gaussian-elimination',
      title: 'Gaussian Elimination & GF(2) Linear XOR Basis',
    },
  ],
  traceTitle: 'Interactive Game-State DAG mex Computation & Multi-Pile XOR Combination Trace',
  traceSubtitle:
    'Compute Grundy values `g[0..5]` bottom-up on a subtraction game (allowed moves: `-1` or `-3`), then evaluate a composite game of piles `(4, 5)`.',
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Step 1: Terminal Losing State g[0] = 0 and Base States g[1], g[2]',
      explanation:
        'At state 0, zero moves exist -> reachable set = {} -> g[0] = mex({}) = 0 (P-position / Second player wins). From 1, only move is 1->0 -> mex({0}) = 1. From 2, only move is 2->1 -> mex({1}) = 0.',
      mode: 'graph',
      graph: {
        calloutMetric: 'DAG States g[0]=0, g[1]=1, g[2]=0 (Allowed moves: -1, -3)',
        nodes: [
          { id: '0', label: '0 (g=0)', x: 60, y: 130, state: 'odd' },
          { id: '1', label: '1 (g=1)', x: 150, y: 130, state: 'even' },
          { id: '2', label: '2 (g=0)', x: 240, y: 130, state: 'odd' },
          { id: '3', label: '3 (g=?)', x: 330, y: 130, state: 'unmatched' },
          { id: '4', label: '4 (g=?)', x: 420, y: 130, state: 'unmatched' },
          { id: '5', label: '5 (g=?)', x: 510, y: 130, state: 'unmatched' },
        ],
        edges: [
          { id: 'e10', from: '1', to: '0', state: 'augmenting' },
          { id: 'e21', from: '2', to: '1', state: 'augmenting' },
          { id: 'e32', from: '3', to: '2', state: 'default' },
          { id: 'e30', from: '3', to: '0', state: 'default' },
          { id: 'e43', from: '4', to: '3', state: 'default' },
          { id: 'e41', from: '4', to: '1', state: 'default' },
          { id: 'e54', from: '5', to: '4', state: 'default' },
          { id: 'e52', from: '5', to: '2', state: 'default' },
        ],
      },
      variables: { g0: 0, g1: 1, g2: 0 },
    },
    {
      stepNumber: 2,
      title: 'Step 2: Compute g[3] = mex({g[2], g[0]}) = mex({0, 0}) = 1',
      explanation:
        'From state 3, moves go to 2 (g=0) and 0 (g=0). Reachable Grundy set = {0}. The smallest missing non-negative integer is 1 -> g[3] = 1!',
      mode: 'graph',
      graph: {
        calloutMetric: 'g[3] = mex({0}) = 1',
        nodes: [
          { id: '0', label: '0 (g=0)', x: 60, y: 130, state: 'odd' },
          { id: '1', label: '1 (g=1)', x: 150, y: 130, state: 'even' },
          { id: '2', label: '2 (g=0)', x: 240, y: 130, state: 'odd' },
          { id: '3', label: '3 (g=1)', x: 330, y: 130, state: 'active' },
          { id: '4', label: '4 (g=?)', x: 420, y: 130, state: 'unmatched' },
          { id: '5', label: '5 (g=?)', x: 510, y: 130, state: 'unmatched' },
        ],
        edges: [
          { id: 'e10', from: '1', to: '0', state: 'default' },
          { id: 'e21', from: '2', to: '1', state: 'default' },
          { id: 'e32', from: '3', to: '2', state: 'augmenting' },
          { id: 'e30', from: '3', to: '0', state: 'augmenting' },
          { id: 'e43', from: '4', to: '3', state: 'default' },
          { id: 'e41', from: '4', to: '1', state: 'default' },
          { id: 'e54', from: '5', to: '4', state: 'default' },
          { id: 'e52', from: '5', to: '2', state: 'default' },
        ],
      },
      variables: { g3: 1, ReachableFrom3: '{0}' },
    },
    {
      stepNumber: 3,
      title: 'Step 3: Compute g[4] = mex({g[3], g[1]}) = 0 & g[5] = mex({g[4], g[2]}) = 1',
      explanation:
        'From 4 -> {3 (g=1), 1 (g=1)} -> mex({1}) = 0! From 5 -> {4 (g=0), 2 (g=0)} -> mex({0}) = 1! Notice the clean periodic pattern: g[n] = n % 2 = [0, 1, 0, 1, 0, 1] whenever all allowed moves are odd numbers!',
      mode: 'array',
      arrays: [
        {
          name: 'Grundy Table g[0..5] (Moves: -1, -3)',
          cells: [
            { index: 0, value: 0, label: 'Loss', highlight: 'neutral' },
            { index: 1, value: 1, label: 'Win', highlight: 'window' },
            { index: 2, value: 0, label: 'Loss', highlight: 'neutral' },
            { index: 3, value: 1, label: 'Win', highlight: 'window' },
            { index: 4, value: 0, label: 'Loss', highlight: 'updated' },
            { index: 5, value: 1, label: 'Win', highlight: 'active' },
          ],
        },
      ],
      variables: { g4: 0, g5: 1, Period: 2 },
    },
    {
      stepNumber: 4,
      title: 'Step 4: Combine Independent Subgames (4, 5) via XOR & Find Winning Move',
      explanation:
        'Composite Grundy XOR = g[4] ^ g[5] = 0 ^ 1 = 1 != 0 -> FIRST PLAYER WINS! Which move wins? Shrink pile 5 (g=1) to a state with Grundy value 1 ^ 1 = 0 -> move 5 -> 4 (or 5 -> 2), leaving XOR(g[4], g[4]) = 0 ^ 0 = 0!',
      mode: 'array',
      arrays: [
        {
          name: 'Composite Game Piles & XOR Reduction',
          cells: [
            { index: 0, value: 'g[4]=0', label: 'Pile 1 (sz=4)', highlight: 'neutral' },
            { index: 1, value: 'g[5]=1', label: 'Pile 2 (sz=5)', highlight: 'active' },
            { index: 2, value: 'XOR=1', label: 'First Wins!', highlight: 'updated' },
            { index: 3, value: '5->4', label: 'Winning Move', highlight: 'window' },
          ],
        },
      ],
      variables: { NimSum: 1, Winner: 'First Player', WinningMove: 'Pile 2: 5 -> 4' },
    },
  ],
  reductionClues: [
    {
      clue: '"Take 1..A[i] stones from any of N piles; last player to move wins (Normal Nim)"',
      translation:
        'First player wins iff **`A[1] ^ A[2] ^ ... ^ A[N] != 0`**. If allowed to take `1..K` per turn, each pile reduces modulo `K + 1`: **`(A[1] % (K+1)) ^ ... ^ (A[N] % (K+1)) != 0`**!',
    },
    {
      clue: '"Player taking the LAST stone LOSES (Misere Nim)"',
      translation:
        '**Bouton’s Misere Theorem**: If ALL piles have size `<= 1`, First wins iff the number of `1`-piles is **EVEN** (`XOR == 0`). Otherwise (at least one pile `>= 2`), First wins under the **EXACT same rule as Normal Nim (`XOR != 0`)**!',
    },
    {
      clue: '"Split a pile into two sub-piles (like Grundy’s Game), or move on a DAG / grid where tokens multiply"',
      translation:
        'When a single move replaces state `x` with TWO independent subgames `(a, b)`, its resulting Grundy number is **`g[a] ^ g[b]`**! Compute `g[x] = mex({g[a] ^ g[b] : all valid splits})`!',
    },
    {
      clue: '"Move stones from pile i only to pile i - 1 (Staircase Nim), or cut branches in a rooted tree (Green Hackenbush)"',
      translation:
        'In **Staircase Nim**, EVEN-indexed piles cancel out via mirror moves—First wins iff the XOR of **ODD-indexed piles** (`A[1] ^ A[3] ^ A[5]...`) is non-zero! In **Tree Hackenbush** (Colon Principle), a node’s Grundy value is simply `XOR_{child v} (g[v] + 1)`!',
    },
  ],
  timeComplexity: 'Standard Nim / Misere / Hackenbush: O(N) | General DAG Sprague-Grundy: O(States * Transitions)',
  spaceComplexity: 'O(States) for memoized mex array (or O(1) after discovering small periodicity)',
  pitfalls: [
    {
      type: 'WA',
      title: 'Applying Normal Nim XOR Directly to Misere Nim When All Piles Are Size 1',
      detail:
        'For `[1, 1, 1]`, `1 ^ 1 ^ 1 = 1 != 0`, so Normal Nim says First wins—but in **Misere Nim** (last mover loses), `[1, 1, 1]` forces First -> `[1, 1]` -> Second -> `[1]` -> First takes last stone and **LOSES**! Always guard the `all <= 1` base case (`countOnes % 2 == 0`)!',
    },
    {
      type: 'WA',
      title: 'Misreading Staircase Nim 0-Indexing vs 1-Indexing',
      detail:
        'In Staircase Nim, stones moved into bin `0` (ground) leave the game permanently, while stones moved from `even -> odd` can always be pushed back down `odd -> even` by the opponent! Therefore, ONLY piles at odd distances `1, 3, 5, ...` steps from the ground (`1`-indexed odd, `0`-indexed odd if `0` is ground) enter the XOR sum!',
    },
    {
      type: 'TLE',
      title: 'Computing mex(S) With std::set or Sorting Inside Tight Inner Loops',
      detail:
        'Using `std::set` to compute `mex` across `10^6` transitions adds `O(log D)` and heap allocations! Instead maintain a reusable `seen[]` array stamped with `stamp++` (`seen[val] == stamp`), incrementing `m = 0; while (seen[m] == stamp) m++;` in amortized `O(deg)` with zero allocations!',
    },
    {
      type: 'WA',
      title: 'Using + instead of ^ When Combining Independent Subgames in Sprague-Grundy',
      detail:
        'If a move splits pile `n` into `(a, b)`, you MUST take `g[a] ^ g[b]` BEFORE taking `mex`, NOT `g[a] + g[b]` and NOT `mex({g[a], g[b]})`!',
    },
  ],
  implementations: {
    cpp20: `#include <bits/stdc++.h>
using namespace std;

// General DAG Sprague-Grundy Solver + Composite Multi-Pile XOR Evaluator
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    // Input: N = max state value, M = allowed subtraction moves s[0..M-1], K = number of piles p[0..K-1]
    int maxVal, m, k;
    if (!(cin >> maxVal >> m >> k)) return 0;
    vector<int> moves(m);
    for (int i = 0; i < m; i++) cin >> moves[i];
    vector<int> piles(k);
    for (int i = 0; i < k; i++) cin >> piles[i];

    vector<int> g(maxVal + 1, 0), seen(m + 2, 0);
    int stamp = 0;
    for (int x = 1; x <= maxVal; x++) {
        stamp++;
        for (int d : moves) {
            if (x >= d && g[x - d] <= m + 1) {
                seen[g[x - d]] = stamp;
            }
        }
        int mex = 0;
        while (seen[mex] == stamp) mex++;
        g[x] = mex;
    }

    int nimSum = 0;
    for (int p : piles) nimSum ^= g[p];
    cout << (nimSum != 0 ? "First\\n" : "Second\\n");
    return 0;
}`,
    rust: `use std::io::{self, Read};

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let max_val: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };
    let m: usize = it.next().unwrap().parse().unwrap();
    let k: usize = it.next().unwrap().parse().unwrap();

    let mut moves = Vec::with_capacity(m);
    for _ in 0..m {
        moves.push(it.next().unwrap().parse::<usize>().unwrap());
    }
    let mut piles = Vec::with_capacity(k);
    for _ in 0..k {
        piles.push(it.next().unwrap().parse::<usize>().unwrap());
    }

    let mut g = vec![0usize; max_val + 1];
    let mut seen = vec![0usize; m + 2];
    let mut stamp = 0usize;
    for x in 1..=max_val {
        stamp += 1;
        for &d in &moves {
            if x >= d && g[x - d] <= m + 1 {
                seen[g[x - d]] = stamp;
            }
        }
        let mut mex = 0;
        while seen[mex] == stamp {
            mex += 1;
        }
        g[x] = mex;
    }

    let nim_sum = piles.iter().fold(0usize, |acc, &p| acc ^ g[p]);
    println!("{}", if nim_sum != 0 { "First" } else { "Second" });
}`,
    java21: `import java.io.IOException;
import java.io.InputStream;

public class Main {
    static final class FastScanner {
        private final InputStream in;
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;
        FastScanner(InputStream in) { this.in = in; }
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
            while (c >= 0 && c <= ' ') c = readByte();
            if (c == -1) return Integer.MIN_VALUE;
            int res = 0;
            while (c > ' ') { res = res * 10 + (c - '0'); c = readByte(); }
            return res;
        }
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        int maxVal = fs.nextInt();
        if (maxVal == Integer.MIN_VALUE) return;
        int m = fs.nextInt(), k = fs.nextInt();

        int[] moves = new int[m];
        for (int i = 0; i < m; i++) moves[i] = fs.nextInt();
        int[] piles = new int[k];
        for (int i = 0; i < k; i++) piles[i] = fs.nextInt();

        int[] g = new int[maxVal + 1];
        int[] seen = new int[m + 2];
        int stamp = 0;
        for (int x = 1; x <= maxVal; x++) {
            stamp++;
            for (int d : moves) {
                if (x >= d && g[x - d] <= m + 1) seen[g[x - d]] = stamp;
            }
            int mex = 0;
            while (seen[mex] == stamp) mex++;
            g[x] = mex;
        }

        int nimSum = 0;
        for (int p : piles) nimSum ^= g[p];
        System.out.println(nimSum != 0 ? "First" : "Second");
    }
}`,
    python3: `import sys

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    max_val = int(next(it))
    m = int(next(it))
    k = int(next(it))
    moves = [int(next(it)) for _ in range(m)]
    piles = [int(next(it)) for _ in range(k)]

    g = [0] * (max_val + 1)
    seen = [0] * (m + 2)
    stamp = 0
    for x in range(1, max_val + 1):
        stamp += 1
        for d in moves:
            if x >= d and g[x - d] <= m + 1:
                seen[g[x - d]] = stamp
        mex = 0
        while seen[mex] == stamp:
            mex += 1
        g[x] = mex

    nim_sum = 0
    for p in piles:
        nim_sum ^= g[p]
    sys.stdout.write("First\\n" if nim_sum != 0 else "Second\\n")

if __name__ == "__main__":
    solve()`,
    ruby: `tokens = $stdin.read.split
exit if tokens.empty?
idx = 0
max_val = tokens[idx].to_i; idx += 1
m = tokens[idx].to_i; idx += 1
k = tokens[idx].to_i; idx += 1
moves = Array.new(m) { tokens[idx].to_i.tap { idx += 1 } }
piles = Array.new(k) { tokens[idx].to_i.tap { idx += 1 } }

g = Array.new(max_val + 1, 0)
seen = Array.new(m + 2, 0)
stamp = 0
(1..max_val).each do |x|
  stamp += 1
  moves.each do |d|
    seen[g[x - d]] = stamp if x >= d && g[x - d] <= m + 1
  end
  mex = 0
  mex += 1 while seen[mex] == stamp
  g[x] = mex
end

nim_sum = piles.reduce(0) { |acc, p| acc ^ g[p] }
puts(nim_sum != 0 ? "First" : "Second")`,
  },
  practiceProblems: [
    {
      id: 'ch42-p1',
      tier: 'Warmup',
      ratingRange: '1450–1650',
      title: 'Nim Game I & Bounded Nim II (Modulo K+1 Reduction)',
      statement:
        'Process T test cases. Each test case specifies `mode` (`1` for unbounded Standard Nim, `2` for Bounded Nim where at most `K` stones may be taken per move), `N` piles, and pile sizes `A[1..N]` (plus `K` when `mode == 2`). Print `first` if the first player wins under optimal play, otherwise `second`.',
      constraints: '1 <= T <= 10^4, 1 <= N <= 2 * 10^5 (sum <= 2 * 10^5), 1 <= A[i], K <= 10^9',
      sampleInput: '3\n1 4\n5 7 2 5\n1 2\n4 4\n2 3 2\n4 8 3',
      sampleOutput: 'first\nsecond\nfirst',
      hints: [
        'For Standard Nim (`mode == 1`), `g(x) = x`, so compute `XOR` over all `A[i]`.',
        'For Bounded Subtraction Nim (`1..K` tokens per move, `mode == 2`), each pile reduces modulo `K + 1`: `g(x) = x % (K + 1)`! On case 3 (`K = 2`, piles `[4, 8, 3]` mod `3`), we get `[1, 2, 0]` whose XOR is `1 ^ 2 ^ 0 = 3 != 0` -> `first`.',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int t;
    if (!(cin >> t)) return 0;
    while (t--) {
        int mode, n;
        cin >> mode >> n;
        long long k = 0;
        if (mode == 2) cin >> k;
        long long nimSum = 0;
        for (int i = 0; i < n; i++) {
            long long a;
            cin >> a;
            nimSum ^= (mode == 1 ? a : (a % (k + 1)));
        }
        cout << (nimSum != 0 ? "first\\n" : "second\\n");
    }
    return 0;
}`,
        rust: `use std::io::{self, Read};

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let t: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };

    let mut out = String::new();
    for _ in 0..t {
        let mode: i32 = it.next().unwrap().parse().unwrap();
        let n: usize = it.next().unwrap().parse().unwrap();
        let k: i64 = if mode == 2 { it.next().unwrap().parse().unwrap() } else { 0 };
        let mut nim_sum = 0i64;
        for _ in 0..n {
            let a: i64 = it.next().unwrap().parse().unwrap();
            nim_sum ^= if mode == 1 { a } else { a % (k + 1) };
        }
        out.push_str(if nim_sum != 0 { "first\\n" } else { "second\\n" });
    }
    print!("{}", out);
}`,
        java21: `import java.io.IOException;
import java.io.InputStream;

public class Main {
    static final class FastScanner {
        private final InputStream in;
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;
        FastScanner(InputStream in) { this.in = in; }
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
            while (c >= 0 && c <= ' ') c = readByte();
            if (c == -1) return Long.MIN_VALUE;
            long res = 0;
            while (c > ' ') { res = res * 10 + (c - '0'); c = readByte(); }
            return res;
        }
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        long tIn = fs.nextLong();
        if (tIn == Long.MIN_VALUE) return;
        int t = (int) tIn;
        StringBuilder sb = new StringBuilder();
        while (t-- > 0) {
            int mode = (int) fs.nextLong();
            int n = (int) fs.nextLong();
            long k = (mode == 2) ? fs.nextLong() : 0;
            long nimSum = 0;
            for (int i = 0; i < n; i++) {
                long a = fs.nextLong();
                nimSum ^= (mode == 1 ? a : (a % (k + 1)));
            }
            sb.append(nimSum != 0 ? "first\\n" : "second\\n");
        }
        System.out.print(sb);
    }
}`,
        python3: `import sys

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    t = int(next(it))
    out = []
    for _ in range(t):
        mode = int(next(it))
        n = int(next(it))
        k = int(next(it)) if mode == 2 else 0
        nim_sum = 0
        for _ in range(n):
            a = int(next(it))
            nim_sum ^= a if mode == 1 else (a % (k + 1))
        out.append("first" if nim_sum != 0 else "second")
    sys.stdout.write("\\n".join(out) + "\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
idx = 0
t = tokens[idx].to_i; idx += 1
out = []
t.times do
  mode = tokens[idx].to_i; idx += 1
  n = tokens[idx].to_i; idx += 1
  k = mode == 2 ? tokens[idx].to_i.tap { idx += 1 } : 0
  nim_sum = 0
  n.times do
    a = tokens[idx].to_i; idx += 1
    nim_sum ^= (mode == 1 ? a : a % (k + 1))
  end
  out << (nim_sum != 0 ? "first" : "second")
end
puts out.join("\\n")`,
      },
    },
    {
      id: 'ch42-p2',
      tier: 'Standard',
      ratingRange: '1700–1950',
      title: "Grundy's Game (Splitting Into Unequal Piles) & Staircase Nim",
      statement:
        'Solve TWO classic games per query batch: Given `N` 1-indexed staircases of stones `P[1..N]` (Staircase Nim: on each turn move any positive number of stones from stair `i >= 2` down to `i - 1`, where stair `1` is the ground floor), PLUS evaluate **Grundy’s Game** on a single pile of size `M`: split any pile into TWO **strictly unequal** non-empty piles (`a + b = x, a != b`)—noting the famous Sprague-Grundy theorem that `g[M] > 0` for EVERY `M >= 1223`! Print Staircase Nim winner (`first`/`second`), then Grundy’s Game winner for `M`.',
      constraints: '1 <= N <= 2 * 10^5, 1 <= M <= 10^6, 0 <= P[i] <= 10^9',
      sampleInput: '4\n1 3 0 2\n7',
      sampleOutput: 'first\nfirst',
      hints: [
        'In Staircase Nim with 1-indexed stairs `1..N` where moves push stones from `i -> i - 1` (`i >= 2`, floor at `1`), `XOR` ONLY the even indices `P[2] ^ P[4] ^ ...`! (Check sample: `P[2]=3, P[4]=2` -> `3 ^ 2 = 1 != 0` -> `first`!)',
        'In Grundy’s Game, `g[0]=0, g[1]=0, g[2]=0`, and for `x >= 3` up to `1222`, `g[x] = mex({g[a] ^ g[x - a] : 1 <= a < x - a})`. Amazingly, for ALL `x >= 1223`, `g[x]` is NEVER `0` (`first` always wins!), so you only ever precompute up to `min(M, 1222)` in `< 1 ms`!',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    if (!(cin >> n)) return 0;
    long long stairXor = 0;
    for (int i = 1; i <= n; i++) {
        long long p;
        cin >> p;
        if (i % 2 == 0) stairXor ^= p; // 1-indexed even stairs sit at odd distance from floor 1
    }

    int m;
    cin >> m;
    cout << (stairXor != 0 ? "first\\n" : "second\\n");

    const int LIMIT = 1222; // Famous Guy/Conway threshold: g[x] > 0 for all x > 1222
    if (m > LIMIT) {
        cout << "first\\n";
        return 0;
    }

    vector<int> g(m + 1, 0), seen(m + 2, 0);
    int stamp = 0;
    for (int x = 3; x <= m; x++) {
        stamp++;
        for (int a = 1; 2 * a < x; a++) {
            int val = g[a] ^ g[x - a];
            if (val < (int)seen.size()) seen[val] = stamp;
        }
        int mex = 0;
        while (seen[mex] == stamp) mex++;
        g[x] = mex;
    }
    cout << (g[m] != 0 ? "first\\n" : "second\\n");
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

    let mut stair_xor = 0i64;
    for i in 1..=n {
        let p: i64 = it.next().unwrap().parse().unwrap();
        if i % 2 == 0 {
            stair_xor ^= p;
        }
    }
    let m: usize = it.next().unwrap().parse().unwrap();
    println!("{}", if stair_xor != 0 { "first" } else { "second" });

    const LIMIT: usize = 1222;
    if m > LIMIT {
        println!("first");
        return;
    }

    let mut g = vec![0usize; m + 1];
    let mut seen = vec![0usize; m + 2];
    let mut stamp = 0usize;
    for x in 3..=m {
        stamp += 1;
        let mut a = 1;
        while 2 * a < x {
            let val = g[a] ^ g[x - a];
            if val < seen.len() {
                seen[val] = stamp;
            }
            a += 1;
        }
        let mut mex = 0;
        while seen[mex] == stamp {
            mex += 1;
        }
        g[x] = mex;
    }
    println!("{}", if g[m] != 0 { "first" } else { "second" });
}`,
        java21: `import java.io.IOException;
import java.io.InputStream;

public class Main {
    static final class FastScanner {
        private final InputStream in;
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;
        FastScanner(InputStream in) { this.in = in; }
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
            while (c >= 0 && c <= ' ') c = readByte();
            if (c == -1) return Long.MIN_VALUE;
            long res = 0;
            while (c > ' ') { res = res * 10 + (c - '0'); c = readByte(); }
            return res;
        }
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        long nIn = fs.nextLong();
        if (nIn == Long.MIN_VALUE) return;
        int n = (int) nIn;

        long stairXor = 0;
        for (int i = 1; i <= n; i++) {
            long p = fs.nextLong();
            if ((i & 1) == 0) stairXor ^= p;
        }
        int m = (int) fs.nextLong();
        System.out.println(stairXor != 0 ? "first" : "second");

        final int LIMIT = 1222;
        if (m > LIMIT) {
            System.out.println("first");
            return;
        }
        int[] g = new int[m + 1];
        int[] seen = new int[m + 2];
        int stamp = 0;
        for (int x = 3; x <= m; x++) {
            stamp++;
            for (int a = 1; 2 * a < x; a++) {
                int val = g[a] ^ g[x - a];
                if (val < seen.length) seen[val] = stamp;
            }
            int mex = 0;
            while (seen[mex] == stamp) mex++;
            g[x] = mex;
        }
        System.out.println(g[m] != 0 ? "first" : "second");
    }
}`,
        python3: `import sys

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    n = int(next(it))
    stair_xor = 0
    for i in range(1, n + 1):
        p = int(next(it))
        if i % 2 == 0:
            stair_xor ^= p
    m = int(next(it))

    res1 = "first" if stair_xor != 0 else "second"
    if m > 1222:
        sys.stdout.write(f"{res1}\\nfirst\\n")
        return

    g = [0] * (m + 1)
    seen = [0] * (m + 2)
    stamp = 0
    for x in range(3, m + 1):
        stamp += 1
        for a in range(1, (x + 1) // 2):
            val = g[a] ^ g[x - a]
            if val < len(seen):
                seen[val] = stamp
        mex = 0
        while seen[mex] == stamp:
            mex += 1
        g[x] = mex

    res2 = "first" if g[m] != 0 else "second"
    sys.stdout.write(f"{res1}\\n{res2}\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
idx = 0
n = tokens[idx].to_i; idx += 1
stair_xor = 0
(1..n).each do |i|
  p = tokens[idx].to_i; idx += 1
  stair_xor ^= p if i.even?
end
m = tokens[idx].to_i

puts(stair_xor != 0 ? "first" : "second")
if m > 1222
  puts "first"
  exit
end

g = Array.new(m + 1, 0)
seen = Array.new(m + 2, 0)
stamp = 0
(3..m).each do |x|
  stamp += 1
  a = 1
  while 2 * a < x
    val = g[a] ^ g[x - a]
    seen[val] = stamp if val < seen.length
    a += 1
  end
  mex = 0
  mex += 1 while seen[mex] == stamp
  g[x] = mex
end
puts(g[m] != 0 ? "first" : "second")`,
      },
    },
    {
      id: 'ch42-p3',
      tier: 'Boss',
      ratingRange: '2000–2250',
      title: 'Misere Nim & Composite Tree Hackenbush (Colon Principle + Edge Cases)',
      statement:
        'A turn-based strategy match consists of TWO games: (A) **Misere Nim** on `K` piles `A[1..K]` where the player who takes the LAST stone LOSES, and (B) **Green Tree Hackenbush** on a tree of `N` vertices rooted at vertex `1` (the ground): on each turn a player cuts any edge `(u, v)`, deleting the edge and the entire disconnected component no longer anchored to root `1` (Normal play: last cut wins!). Print `First` or `Second` for Misere Nim on line 1, and `First` or `Second` for Tree Hackenbush on line 2.',
      constraints: '1 <= K, N <= 2 * 10^5, 1 <= A[i] <= 10^9',
      sampleInput: '3\n1 1 1\n4\n1 2\n1 3\n2 4',
      sampleOutput: 'Second\nFirst',
      hints: [
        'For Misere Nim: check `bool allOnes = true` (every `A[i] <= 1`). If `allOnes`, First wins iff `K % 2 == 0` (actually count of `1`-piles is even!). Otherwise First wins iff `(A[1] ^ ... ^ A[K]) != 0`!',
        'For Green Tree Hackenbush (Colon Principle): by moving up bottom-up post-order, a leaf has Grundy `0`, a single edge of a child `v` adds `+1` (`g[v] + 1`, equivalent to shifting Nim stalk height by 1), and merging branches at node `u` XORs them: **`g[u] = XOR_{child v} (g[v] + 1)`**! Root wins iff `g[1] != 0`!',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int k;
    if (!(cin >> k)) return 0;
    long long misereXor = 0;
    bool allLeOne = true;
    int ones = 0;
    for (int i = 0; i < k; i++) {
        long long x;
        cin >> x;
        misereXor ^= x;
        if (x > 1) allLeOne = false;
        if (x == 1) ones++;
    }
    bool misereFirstWins = allLeOne ? (ones % 2 == 0) : (misereXor != 0);
    cout << (misereFirstWins ? "First\\n" : "Second\\n");

    int n;
    cin >> n;
    vector<vector<int>> adj(n + 1);
    for (int i = 0; i < n - 1; i++) {
        int u, v;
        cin >> u >> v;
        adj[u].push_back(v);
        adj[v].push_back(u);
    }

    // Iterative BFS post-order for Green Tree Hackenbush (Colon Principle)
    vector<int> parent(n + 1, 0), order = {1};
    order.reserve(n);
    for (size_t i = 0; i < order.size(); i++) {
        int u = order[i];
        for (int v : adj[u]) {
            if (v != parent[u]) {
                parent[v] = u;
                order.push_back(v);
            }
        }
    }

    vector<int> g(n + 1, 0);
    for (int i = n - 1; i >= 1; i--) {
        int u = order[i], p = parent[u];
        g[p] ^= (g[u] + 1); // Colon Principle: attach stalk edge (+1) and XOR into parent
    }
    cout << (g[1] != 0 ? "First\\n" : "Second\\n");
    return 0;
}`,
        rust: `use std::io::{self, Read};

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let k: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };

    let mut misere_xor = 0i64;
    let mut all_le_one = true;
    let mut ones = 0usize;
    for _ in 0..k {
        let x: i64 = it.next().unwrap().parse().unwrap();
        misere_xor ^= x;
        if x > 1 {
            all_le_one = false;
        }
        if x == 1 {
            ones += 1;
        }
    }
    let misere_first = if all_le_one { ones % 2 == 0 } else { misere_xor != 0 };
    println!("{}", if misere_first { "First" } else { "Second" });

    let n: usize = it.next().unwrap().parse().unwrap();
    let mut adj = vec![Vec::new(); n + 1];
    for _ in 0..n - 1 {
        let u: usize = it.next().unwrap().parse().unwrap();
        let v: usize = it.next().unwrap().parse().unwrap();
        adj[u].push(v);
        adj[v].push(u);
    }

    let mut parent = vec![0usize; n + 1];
    let mut order = Vec::with_capacity(n);
    order.push(1usize);
    let mut idx = 0;
    while idx < order.len() {
        let u = order[idx];
        idx += 1;
        for &v in &adj[u] {
            if v != parent[u] {
                parent[v] = u;
                order.push(v);
            }
        }
    }

    let mut g = vec![0usize; n + 1];
    for &u in order.iter().skip(1).rev() {
        let p = parent[u];
        g[p] ^= g[u] + 1;
    }
    println!("{}", if g[1] != 0 { "First" } else { "Second" });
}`,
        java21: `import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

public class Main {
    static final class FastScanner {
        private final InputStream in;
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;
        FastScanner(InputStream in) { this.in = in; }
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
            while (c >= 0 && c <= ' ') c = readByte();
            if (c == -1) return Long.MIN_VALUE;
            long res = 0;
            while (c > ' ') { res = res * 10 + (c - '0'); c = readByte(); }
            return res;
        }
    }

    @SuppressWarnings("unchecked")
    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        long kIn = fs.nextLong();
        if (kIn == Long.MIN_VALUE) return;
        int k = (int) kIn;

        long misereXor = 0;
        boolean allLeOne = true;
        int ones = 0;
        for (int i = 0; i < k; i++) {
            long x = fs.nextLong();
            misereXor ^= x;
            if (x > 1) allLeOne = false;
            if (x == 1) ones++;
        }
        boolean misereFirst = allLeOne ? (ones % 2 == 0) : (misereXor != 0);
        System.out.println(misereFirst ? "First" : "Second");

        int n = (int) fs.nextLong();
        List<Integer>[] adj = new ArrayList[n + 1];
        for (int i = 1; i <= n; i++) adj[i] = new ArrayList<>();
        for (int i = 0; i < n - 1; i++) {
            int u = (int) fs.nextLong(), v = (int) fs.nextLong();
            adj[u].add(v);
            adj[v].add(u);
        }

        int[] parent = new int[n + 1];
        int[] order = new int[n];
        int qt = 0;
        order[qt++] = 1;
        for (int qh = 0; qh < qt; qh++) {
            int u = order[qh];
            for (int v : adj[u]) {
                if (v != parent[u]) { parent[v] = u; order[qt++] = v; }
            }
        }

        int[] g = new int[n + 1];
        for (int i = n - 1; i >= 1; i--) {
            int u = order[i], p = parent[u];
            g[p] ^= (g[u] + 1);
        }
        System.out.println(g[1] != 0 ? "First" : "Second");
    }
}`,
        python3: `import sys

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    k = int(next(it))
    misere_xor = 0
    all_le_one = True
    ones = 0
    for _ in range(k):
        x = int(next(it))
        misere_xor ^= x
        if x > 1:
            all_le_one = False
        if x == 1:
            ones += 1
    misere_first = (ones % 2 == 0) if all_le_one else (misere_xor != 0)

    n = int(next(it))
    adj = [[] for _ in range(n + 1)]
    for _ in range(n - 1):
        u = int(next(it))
        v = int(next(it))
        adj[u].append(v)
        adj[v].append(u)

    parent = [0] * (n + 1)
    order = [1]
    for u in order:
        p = parent[u]
        for v in adj[u]:
            if v != p:
                parent[v] = u
                order.append(v)

    g = [0] * (n + 1)
    for u in reversed(order[1:]):
        g[parent[u]] ^= g[u] + 1

    r1 = "First" if misere_first else "Second"
    r2 = "First" if g[1] != 0 else "Second"
    sys.stdout.write(f"{r1}\\n{r2}\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
idx = 0
k = tokens[idx].to_i; idx += 1
misere_xor = 0
all_le_one = true
ones = 0
k.times do
  x = tokens[idx].to_i; idx += 1
  misere_xor ^= x
  all_le_one = false if x > 1
  ones += 1 if x == 1
end
misere_first = all_le_one ? ones.even? : (misere_xor != 0)

n = tokens[idx].to_i; idx += 1
adj = Array.new(n + 1) { [] }
(n - 1).times do
  u = tokens[idx].to_i; idx += 1
  v = tokens[idx].to_i; idx += 1
  adj[u] << v
  adj[v] << u
end

parent = Array.new(n + 1, 0)
order = [1]
head = 0
while head < order.length
  u = order[head]; head += 1
  p = parent[u]
  adj[u].each do |v|
    next if v == p
    parent[v] = u
    order << v
  end
end

g = Array.new(n + 1, 0)
(n - 1).downto(1) do |i|
  u = order[i]
  g[parent[u]] ^= (g[u] + 1)
end

puts(misere_first ? "First" : "Second")
puts(g[1] != 0 ? "First" : "Second")`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'CSES',
      title: 'Nim Game I, Nim Game II, Staircase Game & Grundy’s Game',
      difficulty: 'Medium-Hard',
      url: 'https://cses.fi/problemset/task/1730',
      patternNote: 'Complete CSES 4-problem combinatorial game theory gauntlet.',
    },
    {
      platform: 'Codeforces',
      title: 'Marbles / Misere & Tree Hackenbush (CF 138D / 794E)',
      difficulty: '1800–2100',
      url: 'https://codeforces.com/problemset/problem/138/D',
      patternNote: '2D grid parity split + Sprague-Grundy XOR over independent regions.',
    },
    {
      platform: 'AtCoder',
      title: 'ARC / ABC Nim & Grundy Transitions (ABC 206F)',
      difficulty: '1900',
      url: 'https://atcoder.jp/contests/abc206/tasks/abc206_f',
      patternNote: 'Interval-split Sprague-Grundy DP computing mex over sub-intervals [L..R].',
    },
    {
      platform: 'CodeChef',
      title: 'FDIVGAME / Large State Periodicity',
      difficulty: 'Medium-Hard',
      url: 'https://www.codechef.com/problems/FDIVGAME',
      patternNote: 'Brute-force small Grundy table to discover logarithmic scaling / periodicity up to 10^18.',
    },
    {
      platform: 'HackerRank',
      title: 'Misere Nim & Zero-Move Nim',
      difficulty: 'Medium',
      url: 'https://www.hackerrank.com/challenges/misere-nim-1/problem',
      patternNote: 'Bouton’s Misere exception check (`all <= 1`) vs normal XOR.',
    },
    {
      platform: 'NeetCode 150',
      title: 'Nim Game / Stone Game Series',
      difficulty: 'Easy / Medium',
      url: 'https://leetcode.com/problems/nim-game/',
      patternNote: 'Single-pile modulo `K + 1` special case of bounded Nim Grundy values.',
    },
  ],
  interviewNotes: [
    'Wait before writing code on ANY game with `N <= 10^18`: always write a 15-line brute-force `mex` script for `x = 0..40` first to spot periodicity (`x % (K + 1)`), powers of 2, or bounded thresholds (like Grundy’s Game failing only up to `1222`)!',
    'Explain **why** `XOR` works in Sprague-Grundy: a game with Grundy value `g` behaves identically to a Nim pile of size `g` because any move can reduce `g` to ANY `0 <= v < g`, and any move increasing `g -> g\' > g` can immediately be reverted back to `g` by the opponent!',
    'Remember **Bouton’s Misere Nim Rule**: Normal play and Misere play have the EXACT SAME winning condition (`XOR != 0`) whenever at least one pile has size `>= 2`—the only flip occurs when ALL piles have size `<= 1`!',
  ],
  projectBlueprint: {
    title: 'Combinatorial Turn-Based Strategy AI & Winning-Move Evaluator',
    tagline:
      'Deterministic impartial game engine that computes exact Grundy numbers for custom rule sets, combines multi-board subgames via XOR, and outputs guaranteed winning moves.',
    stackSummary: 'C++20 Stamp-Mex DAG Solver, Multi-Board XOR Strategy Selector, Misere/Hackenbush Evaluator',
    asciiDiagram: `Composite Board: [Subgame A: Subtract {1,3,4} on 10] (+) [Subgame B: Nim Pile 7]
   g_A(10) = 3                                        g_B(7) = 7
   Total Nim-Sum = 3 ^ 7 = 4 != 0  -->  PLAYER 1 HAS FORCED WIN!
   Target Grundy for Subgame B: 7 ^ 4 = 3  --> AI Recommends: Reduce Pile B from 7 -> 3!`,
    milestones: [
      {
        id: 'm1',
        title: '1. Zero-Allocation Stamp-Mex Grundy Precompiler',
        detail: 'Compute `g[0..MaxN]` for arbitrary legal-move generators in linear time.',
      },
      {
        id: 'm2',
        title: '2. Composite XOR Winning-Move Finder',
        detail: 'Identify a component `i` with `(g[i] ^ totalXor) < g[i]` and search its exact winning transition.',
      },
      {
        id: 'm3',
        title: '3. Misere & Tree Hackenbush Modules',
        detail: 'Integrate Bouton’s Misere rule and Colon Principle tree evaluation.',
      },
    ],
    starterCode: `#include <bits/stdc++.h>
using namespace std;

// Combinatorial Turn-Based Strategy AI & Winning-Move Evaluator
struct MoveRecommendation {
    bool player1Wins;
    int totalNimSum;
    int subgameIndex;
    int newState;
};

MoveRecommendation solveSubtractionBoard(const vector<int>& piles, const vector<int>& allowedMoves) {
    int maxP = *max_element(piles.begin(), piles.end());
    vector<int> g(maxP + 1, 0), seen(allowedMoves.size() + 2, 0);
    int stamp = 0;
    for (int x = 1; x <= maxP; x++) {
        stamp++;
        for (int d : allowedMoves) {
            if (x >= d && g[x - d] < (int)seen.size()) seen[g[x - d]] = stamp;
        }
        int mex = 0;
        while (seen[mex] == stamp) mex++;
        g[x] = mex;
    }

    int nimSum = 0;
    for (int p : piles) nimSum ^= g[p];
    if (nimSum == 0) return {false, 0, -1, -1};

    for (int i = 0; i < (int)piles.size(); i++) {
        int targetG = g[piles[i]] ^ nimSum;
        if (targetG < g[piles[i]]) {
            for (int d : allowedMoves) {
                if (piles[i] >= d && g[piles[i] - d] == targetG) {
                    return {true, nimSum, i, piles[i] - d};
                }
            }
        }
    }
    return {false, 0, -1, -1};
}

int main() {
    auto rec = solveSubtractionBoard({10, 7, 5}, {1, 3, 4});
    cout << "Status: " << (rec.player1Wins ? "WINNING" : "LOSING")
         << " | NimSum=" << rec.totalNimSum << "\\n";
    if (rec.player1Wins) {
        cout << "AI Optimal Move -> Reduce Subgame #" << rec.subgameIndex
             << " to state " << rec.newState << "\\n";
    }
    return 0;
}`,
  },
};
