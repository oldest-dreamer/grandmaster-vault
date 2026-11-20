import type { TheoryChapter } from '../../types/vault';

export const CH61_BROKEN_PROFILE_PLUG_DP: TheoryChapter = {
  slug: 'broken-profile-plug-dp',
  topicId: 'dp-24',
  title: 'Broken Profile & Connectivity Plug DP',
  domain: 'Search, Greedy & DP',
  ratingTier: '2200–2600',
  usacoDivision: 'Platinum',
  subtitle: 'Cell-by-cell frontier compression and base-4 balanced bracket encoding for grid tilings and Hamiltonian cycles',
  analogyTitle: 'The 3D Printer Nozzle Scanning Across a Blueprint',
  analogyBody:
    'Imagine an industrial 3D printer head sweeping across a grid one cell at a time, top-to-bottom, left-to-right. Everything behind the nozzle is already locked in concrete; everything ahead of it is blank air. The ONLY interface between the finalized past and the blank future is a jagged "broken profile" staircase of length N + 1 edges directly bordering the nozzle.\n\nFor domino tilings, each edge on this staircase simply records a single bit: "Does a domino stick out across this boundary?" That shrinks an exponential O(2^(N*M)) grid state into O(N * M * 2^N) per-cell transitions with just two lines of bit arithmetic.\n\nWhen counting single-component cycles or paths (Hamiltonian paths/cycles on grids with obstacles), disconnected components on the frontier form a non-crossing planar matching—which bijects cleanly to balanced parentheses! Assigning base-4 plugs (0 = empty, 1 = "(", 2 = ")") lets us merge paths, enforce non-crossing constraints, and prevent premature closed loops until the very last valid cell.',
  prerequisites: [
    { slug: 'bitmask-dp-sos', title: 'Bitmask DP & Sum Over Subsets (SOS DP)' },
  ],
  traceTitle: 'Cell-by-Cell Broken Profile Sweep',
  traceSubtitle: 'Updating the 1-bit horizontal-protrusion mask across a 3x4 grid',
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Initialize Frontier Profile',
      explanation: 'Before cell (r=0, c=0), no dominoes stick across the left boundary of the grid. Only mask 0b000 has count 1.',
      mode: 'array',
      arrays: [
        {
          name: 'Frontier Mask Counts (dp[0..7])',
          cells: [
            { index: 0, value: 1, label: '000', highlight: 'active' },
            { index: 1, value: 0, label: '001', highlight: 'neutral' },
            { index: 2, value: 0, label: '010', highlight: 'neutral' },
            { index: 3, value: 0, label: '011', highlight: 'neutral' },
            { index: 4, value: 0, label: '100', highlight: 'neutral' },
            { index: 5, value: 0, label: '101', highlight: 'neutral' },
            { index: 6, value: 0, label: '110', highlight: 'neutral' },
            { index: 7, value: 0, label: '111', highlight: 'neutral' },
          ],
        },
      ],
      variables: { cell: '(0,0)', activeStates: 1, validAtEnd: 'dp[000]' },
    },
    {
      stepNumber: 2,
      title: 'Process Cell (0,0): Two Branching Choices',
      explanation: 'At (r=0, c=0) with mask 000, bit 0 is empty. We can either push a horizontal domino into (0,1) -> mask 001, or drop a vertical domino covering (0,0) and (1,0) -> mask 010.',
      mode: 'array',
      arrays: [
        {
          name: 'Frontier Mask Counts after (0,0)',
          cells: [
            { index: 0, value: 0, label: '000', highlight: 'neutral' },
            { index: 1, value: 1, label: '001 (H)', highlight: 'updated' },
            { index: 2, value: 1, label: '010 (V)', highlight: 'updated' },
            { index: 3, value: 0, label: '011', highlight: 'neutral' },
            { index: 4, value: 0, label: '100', highlight: 'neutral' },
            { index: 5, value: 0, label: '101', highlight: 'neutral' },
            { index: 6, value: 0, label: '110', highlight: 'neutral' },
            { index: 7, value: 0, label: '111', highlight: 'neutral' },
          ],
        },
      ],
      variables: { cell: '(0,0)', horizontalTarget: '001', verticalTarget: '010' },
    },
    {
      stepNumber: 3,
      title: 'Process Cell (1,0): Forced Clear vs. Vertical Start',
      explanation: 'Bit 1 is occupied in 010 (covered by vertical domino from row 0), so it clears to 000. From 001, bit 1 is free: place horizontal (011) or vertical covering row 2 (101).',
      mode: 'array',
      arrays: [
        {
          name: 'Frontier Mask Counts after (1,0)',
          cells: [
            { index: 0, value: 1, label: '000', highlight: 'updated' },
            { index: 1, value: 0, label: '001', highlight: 'neutral' },
            { index: 2, value: 0, label: '010', highlight: 'neutral' },
            { index: 3, value: 1, label: '011', highlight: 'updated' },
            { index: 4, value: 0, label: '100', highlight: 'neutral' },
            { index: 5, value: 1, label: '101', highlight: 'updated' },
            { index: 6, value: 0, label: '110', highlight: 'neutral' },
            { index: 7, value: 0, label: '111', highlight: 'neutral' },
          ],
        },
      ],
      variables: { cell: '(1,0)', transitions: '010->000, 001->011|101' },
    },
    {
      stepNumber: 4,
      title: 'Complete Column 0 at Cell (2,0)',
      explanation: 'At the bottom row r=2, vertical dominoes cannot go further down. Masks 000 and 011 have bit 2 clear and must extend right (100 and 111); mask 101 clears bit 2 to 001.',
      mode: 'array',
      arrays: [
        {
          name: 'Column 0 Exit Profile after (2,0)',
          cells: [
            { index: 0, value: 0, label: '000', highlight: 'neutral' },
            { index: 1, value: 1, label: '001', highlight: 'updated' },
            { index: 2, value: 0, label: '010', highlight: 'neutral' },
            { index: 3, value: 0, label: '011', highlight: 'neutral' },
            { index: 4, value: 1, label: '100', highlight: 'updated' },
            { index: 5, value: 0, label: '101', highlight: 'neutral' },
            { index: 6, value: 0, label: '110', highlight: 'neutral' },
            { index: 7, value: 1, label: '111', highlight: 'updated' },
          ],
        },
      ],
      variables: { columnCompleted: 0, validMasks: '001, 100, 111' },
    },
    {
      stepNumber: 5,
      title: 'Final Frontier Reading at End of Grid',
      explanation: 'After scanning all 4 columns of the 3x4 grid, only dp[000] represents tilings with zero dominoes dangling past the right edge: 11 valid domino tilings.',
      mode: 'array',
      arrays: [
        {
          name: 'Final Column Exit Profile (3x4)',
          cells: [
            { index: 0, value: 11, label: '000 (ANS)', highlight: 'active' },
            { index: 1, value: 4, label: '001', highlight: 'neutral' },
            { index: 2, value: 0, label: '010', highlight: 'neutral' },
            { index: 3, value: 3, label: '011', highlight: 'neutral' },
            { index: 4, value: 4, label: '100', highlight: 'neutral' },
            { index: 5, value: 0, label: '101', highlight: 'neutral' },
            { index: 6, value: 3, label: '110', highlight: 'neutral' },
            { index: 7, value: 8, label: '111', highlight: 'neutral' },
          ],
        },
      ],
      variables: { totalTilings3x4: 11, complexity: 'O(N * M * 2^N)' },
    },
  ],
  reductionClues: [
    {
      clue: 'Grid dimensions satisfy min(N, M) <= 12 while max(N, M) <= 1000',
      translation: 'Transpose the grid if needed so the narrower axis becomes the profile width; run broken-profile DP across it.',
    },
    {
      clue: 'Count tilings by 1x2 dominoes, L-trominoes, or non-overlapping paths on a grid with obstacles',
      translation: 'Cell-by-cell broken profile avoids O(4^N) column-to-column DFS transitions and handles "#" obstacle cells in O(1) per state.',
    },
    {
      clue: 'Count single simple Hamiltonian cycles or paths visiting every valid cell on a grid',
      translation: 'Use Base-4 Bracket Plug DP (0 = empty, 1 = "(", 2 = ")") with a sparse hash map of reachable balanced-parenthesis states.',
    },
    {
      clue: 'Find maximum weight connected subgraph / Steiner tree / degree-constrained tree on an R x C grid',
      translation: 'Generalized connectivity Plug DP using minimal-representation disjoint-set labeling across the C + 1 frontier plugs.',
    },
  ],
  timeComplexity: 'O(N * M * 2^N) for domino broken profile; O(N * M * S) where S <= Catalan(N) for bracket plug DP',
  spaceComplexity: 'O(2^N) rolling arrays for tilings; O(S) sparse hash map for bracket plug states',
  pitfalls: [
    {
      type: 'TLE',
      title: 'Column-by-Column O(4^N) Transitions Instead of Cell-by-Cell O(2^N)',
      detail: 'Generating every next-column mask via DFS from every current mask takes O(M * 3^N) or O(M * 4^N). Advancing one cell at a time splits each mask into at most two transitions, keeping runtime strictly O(N * M * 2^N).',
    },
    {
      type: 'WA',
      title: 'Closing "(" + ")" Before the Last Free Cell',
      detail: 'In Hamiltonian cycle Plug DP, connecting a Left plug "(" with an Up plug ")" closes a cycle. If any unvisited free cell remains later in the grid, this forms a disconnected multi-cycle cover instead of a single cycle. Only permit L=1, U=2 when at (lastR, lastC) with all remaining plugs equal to 0.',
    },
    {
      type: 'WA',
      title: 'Forgetting End-of-Row Plug Shift in Base-4 Plug DP',
      detail: 'Across a row of width C there are C + 1 plugs: slots 0..C-1 are vertical edges above row r, plus 1 horizontal Left edge. After processing cell (r, C-1), the rightmost plug slot C MUST be 0, and the state must be shifted left by 2 bits so slot 0 becomes empty Left plug 0 for cell (r+1, 0).',
    },
    {
      type: 'RE',
      title: 'Not Transposing Wide Grids (N > M)',
      detail: 'If N=100, M=8 and you build a mask of size 2^N, allocation crashes instantly. Always transpose if the dimension stored in the bitmask exceeds the other.',
    },
  ],
  implementations: {
    cpp20: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

// Cell-by-cell Broken Profile DP for 1x2 / 2x1 Domino Tiling on an N x M grid
static constexpr long long MOD = 1000000007LL;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, m;
    if (!(cin >> n >> m)) return 0;

    // Ensure n is the smaller dimension so bitmask size 2^n is minimal
    if (n > m) swap(n, m);

    int full = 1 << n;
    vector<long long> dp(full, 0), ndp(full, 0);
    dp[0] = 1;

    for (int j = 0; j < m; ++j) {
        for (int i = 0; i < n; ++i) {
            fill(ndp.begin(), ndp.end(), 0);
            int bit = 1 << i;
            int nextBit = 1 << (i + 1);
            for (int mask = 0; mask < full; ++mask) {
                long long ways = dp[mask];
                if (ways == 0) continue;

                if (mask & bit) {
                    // Cell (i, j) already covered from left: clear protrusion bit
                    int nmask = mask ^ bit;
                    ndp[nmask] = (ndp[nmask] + ways) % MOD;
                } else {
                    // Option 1: Place horizontal domino protruding to column j + 1
                    int hmask = mask | bit;
                    ndp[hmask] = (ndp[hmask] + ways) % MOD;

                    // Option 2: Place vertical domino covering (i, j) and (i + 1, j)
                    if (i + 1 < n && !(mask & nextBit)) {
                        int vmask = mask | nextBit;
                        ndp[vmask] = (ndp[vmask] + ways) % MOD;
                    }
                }
            }
            dp.swap(ndp);
        }
    }

    cout << dp[0] % MOD << "\n";
    return 0;
}
`,
    rust: `use std::io::{self, Read};

const MOD: i64 = 1_000_000_007;

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let n_in: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };
    let m_in: usize = it.next().unwrap().parse().unwrap();

    let (n, m) = if n_in > m_in { (m_in, n_in) } else { (n_in, m_in) };
    let full = 1usize << n;
    let mut dp = vec![0i64; full];
    let mut ndp = vec![0i64; full];
    dp[0] = 1;

    for _j in 0..m {
        for i in 0..n {
            ndp.fill(0);
            let bit = 1usize << i;
            let next_bit = 1usize << (i + 1);
            for mask in 0..full {
                let ways = dp[mask];
                if ways == 0 {
                    continue;
                }
                if (mask & bit) != 0 {
                    let nmask = mask ^ bit;
                    ndp[nmask] = (ndp[nmask] + ways) % MOD;
                } else {
                    let hmask = mask | bit;
                    ndp[hmask] = (ndp[hmask] + ways) % MOD;
                    if i + 1 < n && (mask & next_bit) == 0 {
                        let vmask = mask | next_bit;
                        ndp[vmask] = (ndp[vmask] + ways) % MOD;
                    }
                }
            }
            std::mem::swap(&mut dp, &mut ndp);
        }
    }

    println!("{}", dp[0] % MOD);
}
`,
    java21: `import java.io.BufferedInputStream;
import java.io.IOException;
import java.util.Arrays;

public class Main {
    static final long MOD = 1_000_000_007L;

    static class FastScanner {
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;
        private final BufferedInputStream in = new BufferedInputStream(System.in);

        private int readByte() throws IOException {
            if (ptr >= len) {
                len = in.read(buf);
                ptr = 0;
                if (len <= 0) return -1;
            }
            return buf[ptr++];
        }

        int nextInt() throws IOException {
            int c;
            do {
                c = readByte();
                if (c == -1) return -1;
            } while (c <= ' ');
            int sign = 1;
            if (c == '-') {
                sign = -1;
                c = readByte();
            }
            int res = 0;
            while (c > ' ') {
                res = res * 10 + (c - '0');
                c = readByte();
            }
            return res * sign;
        }
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        int n = fs.nextInt();
        if (n == -1) return;
        int m = fs.nextInt();

        if (n > m) {
            int tmp = n;
            n = m;
            m = tmp;
        }

        int full = 1 << n;
        long[] dp = new long[full];
        long[] ndp = new long[full];
        dp[0] = 1L;

        for (int j = 0; j < m; j++) {
            for (int i = 0; i < n; i++) {
                Arrays.fill(ndp, 0L);
                int bit = 1 << i;
                int nextBit = 1 << (i + 1);
                for (int mask = 0; mask < full; mask++) {
                    long ways = dp[mask];
                    if (ways == 0) continue;
                    if ((mask & bit) != 0) {
                        int nmask = mask ^ bit;
                        ndp[nmask] = (ndp[nmask] + ways) % MOD;
                    } else {
                        int hmask = mask | bit;
                        ndp[hmask] = (ndp[hmask] + ways) % MOD;
                        if (i + 1 < n && (mask & nextBit) == 0) {
                            int vmask = mask | nextBit;
                            ndp[vmask] = (ndp[vmask] + ways) % MOD;
                        }
                    }
                }
                long[] tmp = dp;
                dp = ndp;
                ndp = tmp;
            }
        }

        System.out.println(dp[0] % MOD);
    }
}
`,
    python3: `import sys

sys.setrecursionlimit(200000)
MOD = 1_000_000_007


def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    m = int(data[1])
    if n > m:
        n, m = m, n

    full = 1 << n
    dp = [0] * full
    dp[0] = 1

    for _ in range(m):
        for i in range(n):
            ndp = [0] * full
            bit = 1 << i
            next_bit = 1 << (i + 1)
            for mask in range(full):
                ways = dp[mask]
                if ways == 0:
                    continue
                if mask & bit:
                    nmask = mask ^ bit
                    ndp[nmask] = (ndp[nmask] + ways) % MOD
                else:
                    hmask = mask | bit
                    ndp[hmask] = (ndp[hmask] + ways) % MOD
                    if i + 1 < n and not (mask & next_bit):
                        vmask = mask | next_bit
                        ndp[vmask] = (ndp[vmask] + ways) % MOD
            dp = ndp

    print(dp[0] % MOD)


if __name__ == "__main__":
    solve()
`,
    ruby: `MOD = 1_000_000_007

data = $stdin.read.split
exit if data.empty?

n = data[0].to_i
m = data[1].to_i
n, m = m, n if n > m

full = 1 << n
dp = Array.new(full, 0)
dp[0] = 1

m.times do
  n.times do |i|
    ndp = Array.new(full, 0)
    bit = 1 << i
    next_bit = 1 << (i + 1)
    mask = 0
    while mask < full
      ways = dp[mask]
      if ways != 0
        if (mask & bit) != 0
          nmask = mask ^ bit
          ndp[nmask] = (ndp[nmask] + ways) % MOD
        else
          hmask = mask | bit
          ndp[hmask] = (ndp[hmask] + ways) % MOD
          if i + 1 < n && (mask & next_bit) == 0
            vmask = mask | next_bit
            ndp[vmask] = (ndp[vmask] + ways) % MOD
          end
        end
      end
      mask += 1
    end
    dp = ndp
  end
end

puts dp[0] % MOD
`,
  },
  practiceProblems: [
    {
      id: 'ch61-p1',
      tier: 'Warmup',
      ratingRange: '2000–2200',
      title: 'Counting Tilings (Narrow Grid Domino Cover)',
      statement:
        'Your task is to count the number of ways you can fill an N x M grid using 1 x 2 and 2 x 1 tiles modulo 10^9 + 7.',
      constraints: '1 <= N <= 10, 1 <= M <= 1000',
      sampleInput: '4 7',
      sampleOutput: '781',
      hints: [
        'Because N <= 10, a column boundary only needs 10 bits indicating which rows already receive a horizontal domino from the previous column.',
        'Scan column by column and cell by cell (i from 0 to N - 1) so each state performs at most 2 bitmask updates instead of 2^N DFS branches.',
        'The answer after processing all M columns is dp[0]—no domino is allowed to overhang past column M - 1.',
      ],
      solutions: {
        cpp20: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

static constexpr long long MOD = 1000000007LL;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, m;
    if (!(cin >> n >> m)) return 0;

    int full = 1 << n;
    vector<long long> dp(full, 0), ndp(full, 0);
    dp[0] = 1;

    for (int j = 0; j < m; ++j) {
        for (int i = 0; i < n; ++i) {
            fill(ndp.begin(), ndp.end(), 0);
            int bit = 1 << i;
            int nextBit = 1 << (i + 1);
            for (int mask = 0; mask < full; ++mask) {
                long long ways = dp[mask];
                if (!ways) continue;
                if (mask & bit) {
                    int nmask = mask ^ bit;
                    ndp[nmask] += ways;
                    if (ndp[nmask] >= MOD) ndp[nmask] -= MOD;
                } else {
                    int hmask = mask | bit;
                    ndp[hmask] += ways;
                    if (ndp[hmask] >= MOD) ndp[hmask] -= MOD;
                    if (i + 1 < n && !(mask & nextBit)) {
                        int vmask = mask | nextBit;
                        ndp[vmask] += ways;
                        if (ndp[vmask] >= MOD) ndp[vmask] -= MOD;
                    }
                }
            }
            dp.swap(ndp);
        }
    }

    cout << dp[0] << "\n";
    return 0;
}
`,
        rust: `use std::io::{self, Read};

const MOD: i64 = 1_000_000_007;

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let n: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };
    let m: usize = it.next().unwrap().parse().unwrap();

    let full = 1usize << n;
    let mut dp = vec![0i64; full];
    let mut ndp = vec![0i64; full];
    dp[0] = 1;

    for _ in 0..m {
        for i in 0..n {
            ndp.fill(0);
            let bit = 1usize << i;
            let next_bit = 1usize << (i + 1);
            for mask in 0..full {
                let ways = dp[mask];
                if ways == 0 {
                    continue;
                }
                if (mask & bit) != 0 {
                    let nmask = mask ^ bit;
                    ndp[nmask] = (ndp[nmask] + ways) % MOD;
                } else {
                    let hmask = mask | bit;
                    ndp[hmask] = (ndp[hmask] + ways) % MOD;
                    if i + 1 < n && (mask & next_bit) == 0 {
                        let vmask = mask | next_bit;
                        ndp[vmask] = (ndp[vmask] + ways) % MOD;
                    }
                }
            }
            std::mem::swap(&mut dp, &mut ndp);
        }
    }

    println!("{}", dp[0]);
}
`,
        java21: `import java.io.BufferedInputStream;
import java.io.IOException;
import java.util.Arrays;

public class Main {
    static final long MOD = 1_000_000_007L;

    static class FastScanner {
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;
        private final BufferedInputStream in = new BufferedInputStream(System.in);

        private int readByte() throws IOException {
            if (ptr >= len) {
                len = in.read(buf);
                ptr = 0;
                if (len <= 0) return -1;
            }
            return buf[ptr++];
        }

        int nextInt() throws IOException {
            int c;
            do {
                c = readByte();
                if (c == -1) return -1;
            } while (c <= ' ');
            int res = 0;
            while (c > ' ') {
                res = res * 10 + (c - '0');
                c = readByte();
            }
            return res;
        }
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        int n = fs.nextInt();
        if (n == -1) return;
        int m = fs.nextInt();

        int full = 1 << n;
        long[] dp = new long[full];
        long[] ndp = new long[full];
        dp[0] = 1L;

        for (int j = 0; j < m; j++) {
            for (int i = 0; i < n; i++) {
                Arrays.fill(ndp, 0L);
                int bit = 1 << i;
                int nextBit = 1 << (i + 1);
                for (int mask = 0; mask < full; mask++) {
                    long ways = dp[mask];
                    if (ways == 0) continue;
                    if ((mask & bit) != 0) {
                        int nmask = mask ^ bit;
                        ndp[nmask] = (ndp[nmask] + ways) % MOD;
                    } else {
                        int hmask = mask | bit;
                        ndp[hmask] = (ndp[hmask] + ways) % MOD;
                        if (i + 1 < n && (mask & nextBit) == 0) {
                            int vmask = mask | nextBit;
                            ndp[vmask] = (ndp[vmask] + ways) % MOD;
                        }
                    }
                }
                long[] tmp = dp;
                dp = ndp;
                ndp = tmp;
            }
        }
        System.out.println(dp[0]);
    }
}
`,
        python3: `import sys

sys.setrecursionlimit(200000)
MOD = 1_000_000_007


def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    m = int(data[1])

    full = 1 << n
    dp = [0] * full
    dp[0] = 1

    for _ in range(m):
        for i in range(n):
            ndp = [0] * full
            bit = 1 << i
            next_bit = 1 << (i + 1)
            for mask in range(full):
                ways = dp[mask]
                if not ways:
                    continue
                if mask & bit:
                    nmask = mask ^ bit
                    ndp[nmask] = (ndp[nmask] + ways) % MOD
                else:
                    hmask = mask | bit
                    ndp[hmask] = (ndp[hmask] + ways) % MOD
                    if i + 1 < n and not (mask & next_bit):
                        vmask = mask | next_bit
                        ndp[vmask] = (ndp[vmask] + ways) % MOD
            dp = ndp

    print(dp[0])


if __name__ == "__main__":
    solve()
`,
        ruby: `MOD = 1_000_000_007
data = $stdin.read.split
exit if data.empty?
n = data[0].to_i
m = data[1].to_i

full = 1 << n
dp = Array.new(full, 0)
dp[0] = 1

m.times do
  n.times do |i|
    ndp = Array.new(full, 0)
    bit = 1 << i
    next_bit = 1 << (i + 1)
    mask = 0
    while mask < full
      ways = dp[mask]
      if ways != 0
        if (mask & bit) != 0
          nmask = mask ^ bit
          ndp[nmask] = (ndp[nmask] + ways) % MOD
        else
          hmask = mask | bit
          ndp[hmask] = (ndp[hmask] + ways) % MOD
          if i + 1 < n && (mask & next_bit) == 0
            vmask = mask | next_bit
            ndp[vmask] = (ndp[vmask] + ways) % MOD
          end
        end
      end
      mask += 1
    end
    dp = ndp
  end
end

puts dp[0]
`,
      },
    },
    {
      id: 'ch61-p2',
      tier: 'Standard',
      ratingRange: '2200–2400',
      title: 'Obstacle Floor Domino Tiling',
      statement:
        'Given an R x C grid where "." represents an open floor cell and "#" represents a solid pillar, count the number of ways to completely cover all "." cells using non-overlapping 1 x 2 and 2 x 1 dominoes (no domino may cover a "#" pillar or hang outside the grid). Output the count modulo 10^9 + 7.',
      constraints: '1 <= R, C <= 100, min(R, C) <= 10',
      sampleInput: '4 4\n....\n.##.\n....\n....',
      sampleOutput: '6',
      hints: [
        'If R > C, transpose the grid before running DP so the bitmask width is always <= 10.',
        'At a "#" obstacle cell (i, j): if bit i is already 1 (a horizontal domino protruded from (i, j-1) into this pillar), the state is invalid and discarded; otherwise bit i stays 0 and passes through unchanged.',
        'When placing a vertical domino at free cell (i, j), verify both i + 1 < R AND grid[i + 1][j] == "." AND bit (i + 1) == 0.',
      ],
      solutions: {
        cpp20: `#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
using namespace std;

static constexpr long long MOD = 1000000007LL;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int r, c;
    if (!(cin >> r >> c)) return 0;
    vector<string> raw(r);
    for (int i = 0; i < r; ++i) cin >> raw[i];

    vector<string> grid;
    if (r > c) {
        grid.assign(c, string(r, '.'));
        for (int i = 0; i < r; ++i)
            for (int j = 0; j < c; ++j)
                grid[j][i] = raw[i][j];
        swap(r, c);
    } else {
        grid = move(raw);
    }

    int full = 1 << r;
    vector<long long> dp(full, 0), ndp(full, 0);
    dp[0] = 1;

    for (int j = 0; j < c; ++j) {
        for (int i = 0; i < r; ++i) {
            fill(ndp.begin(), ndp.end(), 0);
            int bit = 1 << i;
            int nextBit = 1 << (i + 1);
            bool blocked = (grid[i][j] == '#');

            for (int mask = 0; mask < full; ++mask) {
                long long ways = dp[mask];
                if (!ways) continue;

                if (blocked) {
                    // Cannot receive a horizontal domino from the left into a wall
                    if (!(mask & bit)) {
                        ndp[mask] = (ndp[mask] + ways) % MOD;
                    }
                } else if (mask & bit) {
                    int nmask = mask ^ bit;
                    ndp[nmask] = (ndp[nmask] + ways) % MOD;
                } else {
                    // Horizontal protrusion to column j + 1
                    int hmask = mask | bit;
                    ndp[hmask] = (ndp[hmask] + ways) % MOD;

                    // Vertical domino to (i + 1, j)
                    if (i + 1 < r && grid[i + 1][j] == '.' && !(mask & nextBit)) {
                        int vmask = mask | nextBit;
                        ndp[vmask] = (ndp[vmask] + ways) % MOD;
                    }
                }
            }
            dp.swap(ndp);
        }
    }

    cout << dp[0] << "\n";
    return 0;
}
`,
        rust: `use std::io::{self, Read};

const MOD: i64 = 1_000_000_007;

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let r_in: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };
    let c_in: usize = it.next().unwrap().parse().unwrap();
    let mut raw: Vec<Vec<u8>> = Vec::with_capacity(r_in);
    for _ in 0..r_in {
        raw.push(it.next().unwrap().as_bytes().to_vec());
    }

    let (r, c, grid) = if r_in > c_in {
        let mut t = vec![vec![b'.'; r_in]; c_in];
        for i in 0..r_in {
            for j in 0..c_in {
                t[j][i] = raw[i][j];
            }
        }
        (c_in, r_in, t)
    } else {
        (r_in, c_in, raw)
    };

    let full = 1usize << r;
    let mut dp = vec![0i64; full];
    let mut ndp = vec![0i64; full];
    dp[0] = 1;

    for j in 0..c {
        for i in 0..r {
            ndp.fill(0);
            let bit = 1usize << i;
            let next_bit = 1usize << (i + 1);
            let blocked = grid[i][j] == b'#';
            for mask in 0..full {
                let ways = dp[mask];
                if ways == 0 {
                    continue;
                }
                if blocked {
                    if (mask & bit) == 0 {
                        ndp[mask] = (ndp[mask] + ways) % MOD;
                    }
                } else if (mask & bit) != 0 {
                    let nmask = mask ^ bit;
                    ndp[nmask] = (ndp[nmask] + ways) % MOD;
                } else {
                    let hmask = mask | bit;
                    ndp[hmask] = (ndp[hmask] + ways) % MOD;
                    if i + 1 < r && grid[i + 1][j] == b'.' && (mask & next_bit) == 0 {
                        let vmask = mask | next_bit;
                        ndp[vmask] = (ndp[vmask] + ways) % MOD;
                    }
                }
            }
            std::mem::swap(&mut dp, &mut ndp);
        }
    }

    println!("{}", dp[0]);
}
`,
        java21: `import java.io.BufferedInputStream;
import java.io.IOException;
import java.util.Arrays;

public class Main {
    static final long MOD = 1_000_000_007L;

    static class FastScanner {
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;
        private final BufferedInputStream in = new BufferedInputStream(System.in);

        private int readByte() throws IOException {
            if (ptr >= len) {
                len = in.read(buf);
                ptr = 0;
                if (len <= 0) return -1;
            }
            return buf[ptr++];
        }

        int nextInt() throws IOException {
            int c;
            do {
                c = readByte();
                if (c == -1) return -1;
            } while (c <= ' ');
            int res = 0;
            while (c > ' ') {
                res = res * 10 + (c - '0');
                c = readByte();
            }
            return res;
        }

        String nextToken() throws IOException {
            int c;
            do {
                c = readByte();
                if (c == -1) return null;
            } while (c <= ' ');
            StringBuilder sb = new StringBuilder();
            while (c > ' ') {
                sb.append((char) c);
                c = readByte();
            }
            return sb.toString();
        }
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        int r = fs.nextInt();
        if (r == -1) return;
        int c = fs.nextInt();

        char[][] raw = new char[r][c];
        for (int i = 0; i < r; i++) {
            raw[i] = fs.nextToken().toCharArray();
        }

        char[][] grid;
        if (r > c) {
            grid = new char[c][r];
            for (int i = 0; i < r; i++) {
                for (int j = 0; j < c; j++) {
                    grid[j][i] = raw[i][j];
                }
            }
            int tmp = r;
            r = c;
            c = tmp;
        } else {
            grid = raw;
        }

        int full = 1 << r;
        long[] dp = new long[full];
        long[] ndp = new long[full];
        dp[0] = 1L;

        for (int j = 0; j < c; j++) {
            for (int i = 0; i < r; i++) {
                Arrays.fill(ndp, 0L);
                int bit = 1 << i;
                int nextBit = 1 << (i + 1);
                boolean blocked = (grid[i][j] == '#');
                for (int mask = 0; mask < full; mask++) {
                    long ways = dp[mask];
                    if (ways == 0) continue;
                    if (blocked) {
                        if ((mask & bit) == 0) {
                            ndp[mask] = (ndp[mask] + ways) % MOD;
                        }
                    } else if ((mask & bit) != 0) {
                        int nmask = mask ^ bit;
                        ndp[nmask] = (ndp[nmask] + ways) % MOD;
                    } else {
                        int hmask = mask | bit;
                        ndp[hmask] = (ndp[hmask] + ways) % MOD;
                        if (i + 1 < r && grid[i + 1][j] == '.' && (mask & nextBit) == 0) {
                            int vmask = mask | nextBit;
                            ndp[vmask] = (ndp[vmask] + ways) % MOD;
                        }
                    }
                }
                long[] tmp = dp;
                dp = ndp;
                ndp = tmp;
            }
        }
        System.out.println(dp[0]);
    }
}
`,
        python3: `import sys

sys.setrecursionlimit(200000)
MOD = 1_000_000_007


def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    r = int(data[0])
    c = int(data[1])
    raw = data[2 : 2 + r]

    if r > c:
        grid = [[raw[i][j] for i in range(r)] for j in range(c)]
        r, c = c, r
    else:
        grid = [list(row) for row in raw]

    full = 1 << r
    dp = [0] * full
    dp[0] = 1

    for j in range(c):
        for i in range(r):
            ndp = [0] * full
            bit = 1 << i
            next_bit = 1 << (i + 1)
            blocked = grid[i][j] == "#"
            for mask in range(full):
                ways = dp[mask]
                if not ways:
                    continue
                if blocked:
                    if not (mask & bit):
                        ndp[mask] = (ndp[mask] + ways) % MOD
                elif mask & bit:
                    nmask = mask ^ bit
                    ndp[nmask] = (ndp[nmask] + ways) % MOD
                else:
                    hmask = mask | bit
                    ndp[hmask] = (ndp[hmask] + ways) % MOD
                    if i + 1 < r and grid[i + 1][j] == "." and not (mask & next_bit):
                        vmask = mask | next_bit
                        ndp[vmask] = (ndp[vmask] + ways) % MOD
            dp = ndp

    print(dp[0])


if __name__ == "__main__":
    solve()
`,
        ruby: `MOD = 1_000_000_007
data = $stdin.read.split
exit if data.empty?

r = data[0].to_i
c = data[1].to_i
raw = data[2, r]

if r > c
  grid = Array.new(c) { |j| Array.new(r) { |i| raw[i][j] } }
  r, c = c, r
else
  grid = raw.map(&:chars)
end

full = 1 << r
dp = Array.new(full, 0)
dp[0] = 1

c.times do |j|
  r.times do |i|
    ndp = Array.new(full, 0)
    bit = 1 << i
    next_bit = 1 << (i + 1)
    blocked = (grid[i][j] == '#')
    mask = 0
    while mask < full
      ways = dp[mask]
      if ways != 0
        if blocked
          ndp[mask] = (ndp[mask] + ways) % MOD if (mask & bit) == 0
        elsif (mask & bit) != 0
          nmask = mask ^ bit
          ndp[nmask] = (ndp[nmask] + ways) % MOD
        else
          hmask = mask | bit
          ndp[hmask] = (ndp[hmask] + ways) % MOD
          if i + 1 < r && grid[i + 1][j] == '.' && (mask & next_bit) == 0
            vmask = mask | next_bit
            ndp[vmask] = (ndp[vmask] + ways) % MOD
          end
        end
      end
      mask += 1
    end
    dp = ndp
  end
end

puts dp[0]
`,
      },
    },
    {
      id: 'ch61-p3',
      tier: 'Boss',
      ratingRange: '2400–2600',
      title: 'Formula 1: Hamiltonian Cycles via Bracket Plug DP',
      statement:
        'Given an R x C grid where "." represents drivable track and "#" represents an obstacle, count the exact number of simple cycles that pass through every "." cell exactly once (two cycles that traverse the same undirected set of edges are considered identical). Output the exact integer count.',
      constraints: '2 <= R, C <= 12',
      sampleInput: '4 4\n....\n....\n....\n....',
      sampleOutput: '6',
      hints: [
        'Track C + 1 base-4 plugs (0 = empty, 1 = "(", 2 = ")") across the broken profile separating processed and unprocessed cells.',
        'At cell (r, c), read Left plug at slot c and Up plug at slot c + 1. Merging "(" + "(" requires scanning right for the matching ")" of the right plug and turning it into "("; symmetrically, ")" + ")" scans left to flip its matching "(" into ")".',
        'Closing "(" (Left) with ")" (Up) creates a closed loop and is ONLY legal on (lastR, lastC), the very last "." cell in row-major order. After the last cell of each row, shift the mask left by 2 bits.',
      ],
      solutions: {
        cpp20: `#include <iostream>
#include <vector>
#include <string>
#include <unordered_map>
#include <cstdint>
using namespace std;

// Base-4 Bracket Plug DP for counting single Hamiltonian cycles on R x C grid
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int r, c;
    if (!(cin >> r >> c)) return 0;
    vector<string> grid(r);
    int lastR = -1, lastC = -1, freeCount = 0;
    for (int i = 0; i < r; ++i) {
        cin >> grid[i];
        for (int j = 0; j < c; ++j) {
            if (grid[i][j] == '.') {
                lastR = i;
                lastC = j;
                ++freeCount;
            }
        }
    }

    if (freeCount < 4) {
        cout << 0 << "\n";
        return 0;
    }

    auto getPlug = [](uint32_t mask, int pos) -> int {
        return (mask >> (2 * pos)) & 3;
    };
    auto setPlug = [](uint32_t mask, int pos, int val) -> uint32_t {
        return (mask & ~(3U << (2 * pos))) | (static_cast<uint32_t>(val) << (2 * pos));
    };

    uint32_t fullMask = (1U << (2 * (c + 1))) - 1U;
    unordered_map<uint32_t, unsigned long long> dp, ndp;
    dp[0] = 1;
    unsigned long long ans = 0;

    for (int i = 0; i < r; ++i) {
        for (int j = 0; j < c; ++j) {
            ndp.clear();
            bool hasRight = (j + 1 < c && grid[i][j + 1] == '.');
            bool hasDown = (i + 1 < r && grid[i + 1][j] == '.');

            for (const auto& [mask, ways] : dp) {
                int L = getPlug(mask, j);
                int U = getPlug(mask, j + 1);

                if (grid[i][j] == '#') {
                    if (L == 0 && U == 0) ndp[mask] += ways;
                    continue;
                }

                if (L == 0 && U == 0) {
                    if (hasRight && hasDown) {
                        uint32_t nmask = setPlug(setPlug(mask, j, 1), j + 1, 2);
                        ndp[nmask] += ways;
                    }
                } else if (L == 0 && U != 0) {
                    if (hasDown) {
                        uint32_t nmask = setPlug(setPlug(mask, j, U), j + 1, 0);
                        ndp[nmask] += ways;
                    }
                    if (hasRight) {
                        uint32_t nmask = setPlug(setPlug(mask, j, 0), j + 1, U);
                        ndp[nmask] += ways;
                    }
                } else if (L != 0 && U == 0) {
                    if (hasDown) {
                        uint32_t nmask = setPlug(setPlug(mask, j, L), j + 1, 0);
                        ndp[nmask] += ways;
                    }
                    if (hasRight) {
                        uint32_t nmask = setPlug(setPlug(mask, j, 0), j + 1, L);
                        ndp[nmask] += ways;
                    }
                } else if (L == 1 && U == 1) {
                    int bal = 1, k = j + 2;
                    for (; k <= c; ++k) {
                        int p = getPlug(mask, k);
                        if (p == 1) ++bal;
                        else if (p == 2 && --bal == 0) break;
                    }
                    uint32_t nmask = setPlug(setPlug(setPlug(mask, j, 0), j + 1, 0), k, 1);
                    ndp[nmask] += ways;
                } else if (L == 2 && U == 2) {
                    int bal = 1, k = j - 1;
                    for (; k >= 0; --k) {
                        int p = getPlug(mask, k);
                        if (p == 2) ++bal;
                        else if (p == 1 && --bal == 0) break;
                    }
                    uint32_t nmask = setPlug(setPlug(setPlug(mask, j, 0), j + 1, 0), k, 2);
                    ndp[nmask] += ways;
                } else if (L == 2 && U == 1) {
                    uint32_t nmask = setPlug(setPlug(mask, j, 0), j + 1, 0);
                    ndp[nmask] += ways;
                } else if (L == 1 && U == 2) {
                    if (i == lastR && j == lastC) {
                        uint32_t nmask = setPlug(setPlug(mask, j, 0), j + 1, 0);
                        if (nmask == 0) ans += ways;
                    }
                }
            }
            dp.swap(ndp);
        }

        // Shift frontier down by one row: slot C (always 0) drops, slot 0 becomes 0
        ndp.clear();
        for (const auto& [mask, ways] : dp) {
            if (getPlug(mask, c) == 0) {
                ndp[(mask << 2) & fullMask] += ways;
            }
        }
        dp.swap(ndp);
    }

    cout << ans << "\n";
    return 0;
}
`,
        rust: `use std::collections::HashMap;
use std::io::{self, Read};

#[inline]
fn get_plug(mask: u32, pos: usize) -> u32 {
    (mask >> (2 * pos)) & 3
}

#[inline]
fn set_plug(mask: u32, pos: usize, val: u32) -> u32 {
    (mask & !(3u32 << (2 * pos))) | (val << (2 * pos))
}

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let r: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };
    let c: usize = it.next().unwrap().parse().unwrap();

    let mut grid = Vec::with_capacity(r);
    let mut last_r = 0usize;
    let mut last_c = 0usize;
    let mut free_count = 0usize;
    for i in 0..r {
        let row = it.next().unwrap().as_bytes().to_vec();
        for j in 0..c {
            if row[j] == b'.' {
                last_r = i;
                last_c = j;
                free_count += 1;
            }
        }
        grid.push(row);
    }

    if free_count < 4 {
        println!("0");
        return;
    }

    let full_mask: u32 = (1u32 << (2 * (c + 1))) - 1;
    let mut dp: HashMap<u32, u64> = HashMap::new();
    let mut ndp: HashMap<u32, u64> = HashMap::new();
    dp.insert(0, 1);
    let mut ans: u64 = 0;

    for i in 0..r {
        for j in 0..c {
            ndp.clear();
            let has_right = j + 1 < c && grid[i][j + 1] == b'.';
            let has_down = i + 1 < r && grid[i + 1][j] == b'.';

            for (&mask, &ways) in &dp {
                let l = get_plug(mask, j);
                let u = get_plug(mask, j + 1);

                if grid[i][j] == b'#' {
                    if l == 0 && u == 0 {
                        *ndp.entry(mask).or_insert(0) += ways;
                    }
                    continue;
                }

                if l == 0 && u == 0 {
                    if has_right && has_down {
                        let nmask = set_plug(set_plug(mask, j, 1), j + 1, 2);
                        *ndp.entry(nmask).or_insert(0) += ways;
                    }
                } else if l == 0 && u != 0 {
                    if has_down {
                        let nmask = set_plug(set_plug(mask, j, u), j + 1, 0);
                        *ndp.entry(nmask).or_insert(0) += ways;
                    }
                    if has_right {
                        let nmask = set_plug(set_plug(mask, j, 0), j + 1, u);
                        *ndp.entry(nmask).or_insert(0) += ways;
                    }
                } else if l != 0 && u == 0 {
                    if has_down {
                        let nmask = set_plug(set_plug(mask, j, l), j + 1, 0);
                        *ndp.entry(nmask).or_insert(0) += ways;
                    }
                    if has_right {
                        let nmask = set_plug(set_plug(mask, j, 0), j + 1, l);
                        *ndp.entry(nmask).or_insert(0) += ways;
                    }
                } else if l == 1 && u == 1 {
                    let mut bal = 1;
                    let mut k = j + 2;
                    while k <= c {
                        let p = get_plug(mask, k);
                        if p == 1 {
                            bal += 1;
                        } else if p == 2 {
                            bal -= 1;
                            if bal == 0 {
                                break;
                            }
                        }
                        k += 1;
                    }
                    let nmask = set_plug(set_plug(set_plug(mask, j, 0), j + 1, 0), k, 1);
                    *ndp.entry(nmask).or_insert(0) += ways;
                } else if l == 2 && u == 2 {
                    let mut bal = 1;
                    let mut k = (j as isize) - 1;
                    while k >= 0 {
                        let p = get_plug(mask, k as usize);
                        if p == 2 {
                            bal += 1;
                        } else if p == 1 {
                            bal -= 1;
                            if bal == 0 {
                                break;
                            }
                        }
                        k -= 1;
                    }
                    let nmask = set_plug(set_plug(set_plug(mask, j, 0), j + 1, 0), k as usize, 2);
                    *ndp.entry(nmask).or_insert(0) += ways;
                } else if l == 2 && u == 1 {
                    let nmask = set_plug(set_plug(mask, j, 0), j + 1, 0);
                    *ndp.entry(nmask).or_insert(0) += ways;
                } else if l == 1 && u == 2 {
                    if i == last_r && j == last_c {
                        let nmask = set_plug(set_plug(mask, j, 0), j + 1, 0);
                        if nmask == 0 {
                            ans += ways;
                        }
                    }
                }
            }
            std::mem::swap(&mut dp, &mut ndp);
        }

        ndp.clear();
        for (&mask, &ways) in &dp {
            if get_plug(mask, c) == 0 {
                *ndp.entry((mask << 2) & full_mask).or_insert(0) += ways;
            }
        }
        std::mem::swap(&mut dp, &mut ndp);
    }

    println!("{}", ans);
}
`,
        java21: `import java.io.BufferedInputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class Main {
    static class FastScanner {
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;
        private final BufferedInputStream in = new BufferedInputStream(System.in);

        private int readByte() throws IOException {
            if (ptr >= len) {
                len = in.read(buf);
                ptr = 0;
                if (len <= 0) return -1;
            }
            return buf[ptr++];
        }

        int nextInt() throws IOException {
            int c;
            do {
                c = readByte();
                if (c == -1) return -1;
            } while (c <= ' ');
            int res = 0;
            while (c > ' ') {
                res = res * 10 + (c - '0');
                c = readByte();
            }
            return res;
        }

        String nextToken() throws IOException {
            int c;
            do {
                c = readByte();
                if (c == -1) return null;
            } while (c <= ' ');
            StringBuilder sb = new StringBuilder();
            while (c > ' ') {
                sb.append((char) c);
                c = readByte();
            }
            return sb.toString();
        }
    }

    static int getPlug(int mask, int pos) {
        return (mask >>> (2 * pos)) & 3;
    }

    static int setPlug(int mask, int pos, int val) {
        return (mask & ~(3 << (2 * pos))) | (val << (2 * pos));
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        int r = fs.nextInt();
        if (r == -1) return;
        int c = fs.nextInt();

        char[][] grid = new char[r][c];
        int lastR = -1, lastC = -1, freeCount = 0;
        for (int i = 0; i < r; i++) {
            grid[i] = fs.nextToken().toCharArray();
            for (int j = 0; j < c; j++) {
                if (grid[i][j] == '.') {
                    lastR = i;
                    lastC = j;
                    freeCount++;
                }
            }
        }

        if (freeCount < 4) {
            System.out.println(0);
            return;
        }

        int fullMask = (1 << (2 * (c + 1))) - 1;
        HashMap<Integer, Long> dp = new HashMap<>();
        HashMap<Integer, Long> ndp = new HashMap<>();
        dp.put(0, 1L);
        long ans = 0L;

        for (int i = 0; i < r; i++) {
            for (int j = 0; j < c; j++) {
                ndp.clear();
                boolean hasRight = (j + 1 < c && grid[i][j + 1] == '.');
                boolean hasDown = (i + 1 < r && grid[i + 1][j] == '.');

                for (Map.Entry<Integer, Long> entry : dp.entrySet()) {
                    int mask = entry.getKey();
                    long ways = entry.getValue();
                    int L = getPlug(mask, j);
                    int U = getPlug(mask, j + 1);

                    if (grid[i][j] == '#') {
                        if (L == 0 && U == 0) ndp.merge(mask, ways, Long::sum);
                        continue;
                    }

                    if (L == 0 && U == 0) {
                        if (hasRight && hasDown) {
                            int nmask = setPlug(setPlug(mask, j, 1), j + 1, 2);
                            ndp.merge(nmask, ways, Long::sum);
                        }
                    } else if (L == 0) {
                        if (hasDown) {
                            int nmask = setPlug(setPlug(mask, j, U), j + 1, 0);
                            ndp.merge(nmask, ways, Long::sum);
                        }
                        if (hasRight) {
                            int nmask = setPlug(setPlug(mask, j, 0), j + 1, U);
                            ndp.merge(nmask, ways, Long::sum);
                        }
                    } else if (U == 0) {
                        if (hasDown) {
                            int nmask = setPlug(setPlug(mask, j, L), j + 1, 0);
                            ndp.merge(nmask, ways, Long::sum);
                        }
                        if (hasRight) {
                            int nmask = setPlug(setPlug(mask, j, 0), j + 1, L);
                            ndp.merge(nmask, ways, Long::sum);
                        }
                    } else if (L == 1 && U == 1) {
                        int bal = 1, k = j + 2;
                        for (; k <= c; k++) {
                            int p = getPlug(mask, k);
                            if (p == 1) bal++;
                            else if (p == 2 && --bal == 0) break;
                        }
                        int nmask = setPlug(setPlug(setPlug(mask, j, 0), j + 1, 0), k, 1);
                        ndp.merge(nmask, ways, Long::sum);
                    } else if (L == 2 && U == 2) {
                        int bal = 1, k = j - 1;
                        for (; k >= 0; k--) {
                            int p = getPlug(mask, k);
                            if (p == 2) bal++;
                            else if (p == 1 && --bal == 0) break;
                        }
                        int nmask = setPlug(setPlug(setPlug(mask, j, 0), j + 1, 0), k, 2);
                        ndp.merge(nmask, ways, Long::sum);
                    } else if (L == 2 && U == 1) {
                        int nmask = setPlug(setPlug(mask, j, 0), j + 1, 0);
                        ndp.merge(nmask, ways, Long::sum);
                    } else if (L == 1 && U == 2) {
                        if (i == lastR && j == lastC) {
                            int nmask = setPlug(setPlug(mask, j, 0), j + 1, 0);
                            if (nmask == 0) ans += ways;
                        }
                    }
                }
                HashMap<Integer, Long> tmp = dp;
                dp = ndp;
                ndp = tmp;
            }

            ndp.clear();
            for (Map.Entry<Integer, Long> entry : dp.entrySet()) {
                int mask = entry.getKey();
                if (getPlug(mask, c) == 0) {
                    ndp.merge((mask << 2) & fullMask, entry.getValue(), Long::sum);
                }
            }
            HashMap<Integer, Long> tmp = dp;
            dp = ndp;
            ndp = tmp;
        }

        System.out.println(ans);
    }
}
`,
        python3: `import sys
from collections import defaultdict

sys.setrecursionlimit(200000)


def get_plug(mask: int, pos: int) -> int:
    return (mask >> (2 * pos)) & 3


def set_plug(mask: int, pos: int, val: int) -> int:
    return (mask & ~(3 << (2 * pos))) | (val << (2 * pos))


def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    r = int(data[0])
    c = int(data[1])
    grid = data[2 : 2 + r]

    last_r = -1
    last_c = -1
    free_count = 0
    for i in range(r):
        for j in range(c):
            if grid[i][j] == ".":
                last_r = i
                last_c = j
                free_count += 1

    if free_count < 4:
        print(0)
        return

    full_mask = (1 << (2 * (c + 1))) - 1
    dp: dict[int, int] = {0: 1}
    ans = 0

    for i in range(r):
        for j in range(c):
            ndp: dict[int, int] = defaultdict(int)
            has_right = j + 1 < c and grid[i][j + 1] == "."
            has_down = i + 1 < r and grid[i + 1][j] == "."
            cell_blocked = grid[i][j] == "#"

            for mask, ways in dp.items():
                l = get_plug(mask, j)
                u = get_plug(mask, j + 1)

                if cell_blocked:
                    if l == 0 and u == 0:
                        ndp[mask] += ways
                    continue

                if l == 0 and u == 0:
                    if has_right and has_down:
                        nmask = set_plug(set_plug(mask, j, 1), j + 1, 2)
                        ndp[nmask] += ways
                elif l == 0 and u != 0:
                    if has_down:
                        ndp[set_plug(set_plug(mask, j, u), j + 1, 0)] += ways
                    if has_right:
                        ndp[set_plug(set_plug(mask, j, 0), j + 1, u)] += ways
                elif l != 0 and u == 0:
                    if has_down:
                        ndp[set_plug(set_plug(mask, j, l), j + 1, 0)] += ways
                    if has_right:
                        ndp[set_plug(set_plug(mask, j, 0), j + 1, l)] += ways
                elif l == 1 and u == 1:
                    bal = 1
                    k = j + 2
                    while k <= c:
                        p = get_plug(mask, k)
                        if p == 1:
                            bal += 1
                        elif p == 2:
                            bal -= 1
                            if bal == 0:
                                break
                        k += 1
                    nmask = set_plug(set_plug(set_plug(mask, j, 0), j + 1, 0), k, 1)
                    ndp[nmask] += ways
                elif l == 2 and u == 2:
                    bal = 1
                    k = j - 1
                    while k >= 0:
                        p = get_plug(mask, k)
                        if p == 2:
                            bal += 1
                        elif p == 1:
                            bal -= 1
                            if bal == 0:
                                break
                        k -= 1
                    nmask = set_plug(set_plug(set_plug(mask, j, 0), j + 1, 0), k, 2)
                    ndp[nmask] += ways
                elif l == 2 and u == 1:
                    ndp[set_plug(set_plug(mask, j, 0), j + 1, 0)] += ways
                elif l == 1 and u == 2:
                    if i == last_r and j == last_c:
                        nmask = set_plug(set_plug(mask, j, 0), j + 1, 0)
                        if nmask == 0:
                            ans += ways
            dp = ndp

        shift_dp: dict[int, int] = defaultdict(int)
        for mask, ways in dp.items():
            if get_plug(mask, c) == 0:
                shift_dp[(mask << 2) & full_mask] += ways
        dp = shift_dp

    print(ans)


if __name__ == "__main__":
    solve()
`,
        ruby: `def get_plug(mask, pos)
  (mask >> (2 * pos)) & 3
end

def set_plug(mask, pos, val)
  (mask & ~(3 << (2 * pos))) | (val << (2 * pos))
end

data = $stdin.read.split
exit if data.empty?

r = data[0].to_i
c = data[1].to_i
grid = data[2, r]

last_r = -1
last_c = -1
free_count = 0
r.times do |i|
  c.times do |j|
    if grid[i][j] == '.'
      last_r = i
      last_c = j
      free_count += 1
    end
  end
end

if free_count < 4
  puts 0
  exit
end

full_mask = (1 << (2 * (c + 1))) - 1
dp = { 0 => 1 }
ans = 0

r.times do |i|
  c.times do |j|
    ndp = Hash.new(0)
    has_right = (j + 1 < c && grid[i][j + 1] == '.')
    has_down = (i + 1 < r && grid[i + 1][j] == '.')
    blocked = (grid[i][j] == '#')

    dp.each do |mask, ways|
      l = get_plug(mask, j)
      u = get_plug(mask, j + 1)

      if blocked
        ndp[mask] += ways if l == 0 && u == 0
        next
      end

      if l == 0 && u == 0
        ndp[set_plug(set_plug(mask, j, 1), j + 1, 2)] += ways if has_right && has_down
      elsif l == 0 && u != 0
        ndp[set_plug(set_plug(mask, j, u), j + 1, 0)] += ways if has_down
        ndp[set_plug(set_plug(mask, j, 0), j + 1, u)] += ways if has_right
      elsif l != 0 && u == 0
        ndp[set_plug(set_plug(mask, j, l), j + 1, 0)] += ways if has_down
        ndp[set_plug(set_plug(mask, j, 0), j + 1, l)] += ways if has_right
      elsif l == 1 && u == 1
        bal = 1
        k = j + 2
        while k <= c
          p = get_plug(mask, k)
          if p == 1
            bal += 1
          elsif p == 2
            bal -= 1
            break if bal == 0
          end
          k += 1
        end
        ndp[set_plug(set_plug(set_plug(mask, j, 0), j + 1, 0), k, 1)] += ways
      elsif l == 2 && u == 2
        bal = 1
        k = j - 1
        while k >= 0
          p = get_plug(mask, k)
          if p == 2
            bal += 1
          elsif p == 1
            bal -= 1
            break if bal == 0
          end
          k -= 1
        end
        ndp[set_plug(set_plug(set_plug(mask, j, 0), j + 1, 0), k, 2)] += ways
      elsif l == 2 && u == 1
        ndp[set_plug(set_plug(mask, j, 0), j + 1, 0)] += ways
      elsif l == 1 && u == 2
        if i == last_r && j == last_c
          nmask = set_plug(set_plug(mask, j, 0), j + 1, 0)
          ans += ways if nmask == 0
        end
      end
    end
    dp = ndp
  end

  shift_dp = Hash.new(0)
  dp.each do |mask, ways|
    shift_dp[(mask << 2) & full_mask] += ways if get_plug(mask, c) == 0
  end
  dp = shift_dp
end

puts ans
`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'CSES',
      title: 'Counting Tilings',
      difficulty: 'Hard',
      url: 'https://cses.fi/problemset/task/2181',
      patternNote: 'Canonical 10 x 1000 domino tiling solved cleanly in O(NM * 2^N) via cell-by-cell broken profile DP.',
    },
    {
      platform: 'Codeforces',
      title: 'Grid Tiling & Hamiltonian Cycle Div1 Classics',
      difficulty: '2300–2500',
      url: 'https://codeforces.com/problemset?tags=bitmasks,dp',
      patternNote: 'Narrow-width grid problems where N <= 10 and obstacle connectivity requires frontier bitmasks.',
    },
    {
      platform: 'AtCoder',
      title: 'ABC295F / ABC247G Grid State & Frontier DP',
      difficulty: '2100–2400',
      url: 'https://atcoder.jp/contests/abc295',
      patternNote: 'State-compressed frontier DP maintaining component connectivity across narrow rows.',
    },
  ],
  interviewNotes: [
    'Clearly contrast column-by-column DP (O(M * 3^N) or O(M * 4^N)) vs. cell-by-cell broken profile DP (O(N * M * 2^N)), noting why handling obstacle cells becomes effortless cell-by-cell.',
    'Explain why planar non-crossing path endpoints on a 1D frontier always form a balanced parenthesis string, reducing exponential partition states to at most Catalan(N/2) reachable masks.',
    'Point out the single-cycle invariant in Bracket Plug DP: prematurely merging "(" with ")" closes an isolated loop, which must be forbidden except at the lexicographically last passable cell.',
  ],
  projectBlueprint: {
    title: 'PCB Circuit-Board Trace Router & Floor Tiling Optimizer',
    tagline: 'Exact single-loop bus routing and obstacle-aware module placement engine on constrained grid planes',
    stackSummary: 'TypeScript + WebAssembly/Rust Solver Core + Canvas Staircase Frontier Visualizer',
    asciiDiagram: [
      '+------------------------------------------------------------------+',
      '|  Grid Plane (R x C with Blocked # Vias)                          |',
      '|   [ . ][ . ][ . ] <-- finalized past                             |',
      '|   [ . ][ * ]      <-- nozzle at (r,c), L = slot[c], U = slot[c+1]|',
      '|   ======^======== <-- Broken Profile Frontier (C+1 Base-4 Plugs) |',
      '+------------------------------------------------------------------+',
    ].join('\n'),
    milestones: [
      {
        id: 'm1',
        title: 'Broken-Profile Staircase Stepper',
        detail: 'Step cell by cell through an R x C grid highlighting Left and Up edge plugs.',
      },
      {
        id: 'm2',
        title: 'Base-4 Balanced Bracket State Compression',
        detail: 'Maintain sparse active-state maps indexed by packed 2-bit-per-plug integers.',
      },
      {
        id: 'm3',
        title: 'Auto-Transpose Dimension Guard',
        detail: 'Automatically transpose grids where rows > cols to keep profile bit-width minimal.',
      },
    ],
    starterCode: `export function countDominoTilings(r: number, c: number, blocked: boolean[][]): number {
  const MOD = 1_000_000_007;
  const full = 1 << r;
  let dp = new Int32Array(full);
  let ndp = new Int32Array(full);
  dp[0] = 1;
  for (let j = 0; j < c; j++) {
    for (let i = 0; i < r; i++) {
      ndp.fill(0);
      const bit = 1 << i;
      const nextBit = 1 << (i + 1);
      for (let mask = 0; mask < full; mask++) {
        const ways = dp[mask];
        if (!ways) continue;
        if (blocked[i][j]) {
          if ((mask & bit) === 0) ndp[mask] = (ndp[mask] + ways) % MOD;
        } else if (mask & bit) {
          ndp[mask ^ bit] = (ndp[mask ^ bit] + ways) % MOD;
        } else {
          ndp[mask | bit] = (ndp[mask | bit] + ways) % MOD;
          if (i + 1 < r && !blocked[i + 1][j] && (mask & nextBit) === 0) {
            ndp[mask | nextBit] = (ndp[mask | nextBit] + ways) % MOD;
          }
        }
      }
      [dp, ndp] = [ndp, dp];
    }
  }
  return dp[0];
}`,
  },
};
