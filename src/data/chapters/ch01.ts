import type { TheoryChapter } from '../../types/vault';

export const CH01_PREFIX_SUMS: TheoryChapter = {
  slug: 'prefix-sums-difference-arrays',
  topicId: 'ds-01',
  title: 'Prefix Sums, Difference Arrays & Invariants',
  domain: 'Data Structures',
  ratingTier: '800–1100',
  usacoDivision: 'Bronze',
  subtitle:
    'Collapse O(N) range aggregations and offline range additions into O(1) arithmetic by tracking cumulative invariants.',
  analogyTitle: 'The Bank Ledger Running Balance Analogy',
  analogyBody:
    'Imagine checking how much money entered your bank account between March 12 and March 29. Instead of re-adding every receipt from March 12 to March 29 each time someone asks, you look at your running balance at the close of March 29 and subtract your running balance at the close of March 11. That running balance is a Prefix Sum. Conversely, if an employer says "add $200 daily bonus from Day 3 to Day 7", you only write +$200 on Day 3 and -$200 on Day 8 on a sticky note—then sweep forward once at the end to materialize every day’s total. That sticky note is a Difference Array.',
  prerequisites: [],
  traceTitle: 'Interactive Dual-Array Trace: Difference Sweep -> Prefix Query',
  traceSubtitle:
    'Watch two offline range additions ([1, 3] +5 and [2, 4] +3) materialize into an array A, build Prefix Sums P, and answer sum(1..3) in O(1).',
  allowDynamicGraphEdit: false,
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Initialize Zeroed Difference Array D[0..5]',
      explanation:
        'Start with an extra sentinel slot at index N = 5 so range updates ending at R = 4 can safely subtract at R + 1 = 5 without out-of-bounds checks.',
      mode: 'array',
      arrays: [
        {
          name: 'Diff D[0..5]',
          cells: [
            { index: 0, value: 0, highlight: 'neutral' },
            { index: 1, value: 0, highlight: 'neutral' },
            { index: 2, value: 0, highlight: 'neutral' },
            { index: 3, value: 0, highlight: 'neutral' },
            { index: 4, value: 0, highlight: 'neutral' },
            { index: 5, value: 0, label: 'sentinel', highlight: 'neutral' },
          ],
        },
        {
          name: 'Array A[0..4]',
          cells: [
            { index: 0, value: 0, highlight: 'neutral' },
            { index: 1, value: 0, highlight: 'neutral' },
            { index: 2, value: 0, highlight: 'neutral' },
            { index: 3, value: 0, highlight: 'neutral' },
            { index: 4, value: 0, highlight: 'neutral' },
          ],
        },
      ],
      variables: { Operation: 'Init', L: '-', R: '-', Delta: '-' },
    },
    {
      stepNumber: 2,
      title: 'Apply Range Add [L=1, R=3] += 5',
      explanation:
        'Instead of looping from 1 to 3, execute D[1] += 5 and D[4] -= 5 in O(1). Every prefix sum passing index 1 gains +5 until index 4 cancels it out.',
      mode: 'array',
      arrays: [
        {
          name: 'Diff D[0..5]',
          cells: [
            { index: 0, value: 0, highlight: 'neutral' },
            { index: 1, value: '+5', label: 'L', highlight: 'updated' },
            { index: 2, value: 0, highlight: 'neutral' },
            { index: 3, value: 0, highlight: 'neutral' },
            { index: 4, value: '-5', label: 'R+1', highlight: 'updated' },
            { index: 5, value: 0, label: 'sentinel', highlight: 'neutral' },
          ],
        },
        {
          name: 'Array A[0..4]',
          cells: [
            { index: 0, value: 0, highlight: 'neutral' },
            { index: 1, value: 0, highlight: 'neutral' },
            { index: 2, value: 0, highlight: 'neutral' },
            { index: 3, value: 0, highlight: 'neutral' },
            { index: 4, value: 0, highlight: 'neutral' },
          ],
        },
      ],
      variables: { Operation: 'RangeAdd(1, 3, +5)', 'D[1]': 5, 'D[4]': -5 },
    },
    {
      stepNumber: 3,
      title: 'Apply Second Range Add [L=2, R=4] += 3',
      explanation:
        'Execute D[2] += 3 and D[5] -= 3. Notice D[4] remains -5 because the second range extends through index 4 and ends at sentinel 5.',
      mode: 'array',
      arrays: [
        {
          name: 'Diff D[0..5]',
          cells: [
            { index: 0, value: 0, highlight: 'neutral' },
            { index: 1, value: 5, highlight: 'neutral' },
            { index: 2, value: '+3', label: 'L', highlight: 'updated' },
            { index: 3, value: 0, highlight: 'neutral' },
            { index: 4, value: -5, highlight: 'neutral' },
            { index: 5, value: '-3', label: 'R+1', highlight: 'updated' },
          ],
        },
        {
          name: 'Array A[0..4]',
          cells: [
            { index: 0, value: 0, highlight: 'neutral' },
            { index: 1, value: 0, highlight: 'neutral' },
            { index: 2, value: 0, highlight: 'neutral' },
            { index: 3, value: 0, highlight: 'neutral' },
            { index: 4, value: 0, highlight: 'neutral' },
          ],
        },
      ],
      variables: { Operation: 'RangeAdd(2, 4, +3)', 'D[2]': 3, 'D[5]': -3 },
    },
    {
      stepNumber: 4,
      title: 'Sweep Difference Array to Materialize A[0..4]',
      explanation:
        'Take running sum of D left-to-right: A[i] = running += D[i]. Indices 1..3 receive +5, indices 2..4 receive +3, so overlap [2, 3] equals 8.',
      mode: 'array',
      arrays: [
        {
          name: 'Diff D[0..5]',
          cells: [
            { index: 0, value: 0, highlight: 'neutral' },
            { index: 1, value: 5, highlight: 'neutral' },
            { index: 2, value: 3, highlight: 'neutral' },
            { index: 3, value: 0, highlight: 'neutral' },
            { index: 4, value: -5, highlight: 'neutral' },
            { index: 5, value: -3, highlight: 'neutral' },
          ],
        },
        {
          name: 'Array A[0..4]',
          cells: [
            { index: 0, value: 0, highlight: 'neutral' },
            { index: 1, value: 5, highlight: 'active' },
            { index: 2, value: 8, highlight: 'active' },
            { index: 3, value: 8, highlight: 'active' },
            { index: 4, value: 3, highlight: 'active' },
          ],
        },
      ],
      variables: { Operation: 'Materialize Sweep', TotalSum: 24 },
    },
    {
      stepNumber: 5,
      title: 'Build 1-Indexed Prefix Sum P[0..5] & Answer Query(1, 3)',
      explanation:
        'Define P[0] = 0 and P[i + 1] = P[i] + A[i]. Then Sum(1..3) = P[4] - P[1] = 21 - 0 = 21 in strict O(1) time without scanning.',
      mode: 'array',
      arrays: [
        {
          name: 'Array A[0..4]',
          cells: [
            { index: 0, value: 0, highlight: 'neutral' },
            { index: 1, value: 5, highlight: 'window' },
            { index: 2, value: 8, highlight: 'window' },
            { index: 3, value: 8, highlight: 'window' },
            { index: 4, value: 3, highlight: 'neutral' },
          ],
        },
        {
          name: 'Prefix P[0..5]',
          cells: [
            { index: 0, value: 0, highlight: 'neutral' },
            { index: 1, value: 0, label: 'P[L]', highlight: 'updated' },
            { index: 2, value: 5, highlight: 'neutral' },
            { index: 3, value: 13, highlight: 'neutral' },
            { index: 4, value: 21, label: 'P[R+1]', highlight: 'updated' },
            { index: 5, value: 24, highlight: 'neutral' },
          ],
        },
      ],
      variables: { 'Query[1..3]': 'P[4] - P[1]', Result: '21 - 0 = 21' },
    },
  ],
  reductionClues: [
    {
      clue: '"Given Q <= 2e5 static queries for sum/XOR/count on [L, R]"',
      translation:
        'Any invertible associative operation (+, -, XOR) uses P[R + 1] op^-1 P[L] in O(1) per query.',
    },
    {
      clue: '"All K range additions happen before any final value is read"',
      translation:
        'Offline Difference Array: mark +V at L and -V at R+1, then take a single O(N) prefix sweep.',
    },
    {
      clue: '"Count subarrays whose sum equals K (or is divisible by M)"',
      translation:
        'Rewrite sum(L..R) = P[R+1] - P[L] = K as P[L] = P[R+1] - K and count matching prior prefixes in a hash map.',
    },
    {
      clue: '"Check if an operation preserves parity, total sum, or modular residue"',
      translation:
        'Look for an invariant I(state) that stays constant (or monovariant that strictly decreases) under every move.',
    },
  ],
  timeComplexity: 'O(N + Q) linear preprocessing and O(1) per query/update',
  spaceComplexity: 'O(N) for 1D arrays, O(N * M) for 2D prefix grids',
  pitfalls: [
    {
      type: 'WA',
      title: '32-bit Integer Overflow on Cumulative Sums',
      detail:
        'With N = 2e5 and A[i] = 1e9, prefix sums reach 2e14, overflowing 32-bit signed int (2.14e9). Always store prefix and difference arrays in 64-bit integers (long long / i64).',
    },
    {
      type: 'RE',
      title: 'Off-by-One When Indexing L = 0 or R = N - 1',
      detail:
        'Always allocate Prefix P of size N + 1 with P[0] = 0, and Difference D of size N + 1 so D[R + 1] never writes past array bounds when R = N - 1.',
    },
    {
      type: 'WA',
      title: 'Negative Modulo Remainders in Subarray Divisibility',
      detail:
        'In C++, Rust, and Java, (-5) % 3 == -2. Always normalize remainders as ((pref % M) + M) % M before indexing frequency buckets.',
    },
  ],
  implementations: {
    cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, u, q;
    if (!(cin >> n >> u >> q)) return 0;

    vector<long long> a(n);
    for (int i = 0; i < n; ++i) cin >> a[i];

    // Offline difference array for [l, r] += val (0-indexed)
    vector<long long> diff(n + 1, 0);
    for (int i = 0; i < u; ++i) {
        int l, r;
        long long val;
        cin >> l >> r >> val;
        diff[l] += val;
        diff[r + 1] -= val;
    }

    long long running = 0;
    vector<long long> pref(n + 1, 0);
    for (int i = 0; i < n; ++i) {
        running += diff[i];
        a[i] += running;
        pref[i + 1] = pref[i] + a[i];
    }

    while (q--) {
        int l, r;
        cin >> l >> r; // 0-indexed inclusive
        cout << (pref[r + 1] - pref[l]) << '\\n';
    }
    return 0;
}`,
    rust: `use std::io::{self, BufWriter, Read, Write};

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let Some(n_str) = it.next() else { return; };
    let n: usize = n_str.parse().unwrap();
    let u: usize = it.next().unwrap().parse().unwrap();
    let q: usize = it.next().unwrap().parse().unwrap();

    let mut a = vec![0i64; n];
    for i in 0..n {
        a[i] = it.next().unwrap().parse().unwrap();
    }

    let mut diff = vec![0i64; n + 1];
    for _ in 0..u {
        let l: usize = it.next().unwrap().parse().unwrap();
        let r: usize = it.next().unwrap().parse().unwrap();
        let val: i64 = it.next().unwrap().parse().unwrap();
        diff[l] += val;
        diff[r + 1] -= val;
    }

    let mut running = 0i64;
    let mut pref = vec![0i64; n + 1];
    for i in 0..n {
        running += diff[i];
        a[i] += running;
        pref[i + 1] = pref[i] + a[i];
    }

    let stdout = io::stdout();
    let mut out = BufWriter::new(stdout.lock());
    for _ in 0..q {
        let l: usize = it.next().unwrap().parse().unwrap();
        let r: usize = it.next().unwrap().parse().unwrap();
        writeln!(out, "{}", pref[r + 1] - pref[l]).unwrap();
    }
}`,
    java21: `import java.io.*;
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
            while (c > ' ') {
                res = res * 10 + (c - '0');
                c = readByte();
            }
            return res * sign;
        }
        int nextInt() throws IOException { return (int) nextLong(); }
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        int n = fs.nextInt(), u = fs.nextInt(), q = fs.nextInt();
        long[] a = new long[n];
        for (int i = 0; i < n; i++) a[i] = fs.nextLong();

        long[] diff = new long[n + 1];
        for (int i = 0; i < u; i++) {
            int l = fs.nextInt(), r = fs.nextInt();
            long val = fs.nextLong();
            diff[l] += val;
            diff[r + 1] -= val;
        }

        long running = 0;
        long[] pref = new long[n + 1];
        for (int i = 0; i < n; i++) {
            running += diff[i];
            a[i] += running;
            pref[i + 1] = pref[i] + a[i];
        }

        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < q; i++) {
            int l = fs.nextInt(), r = fs.nextInt();
            sb.append(pref[r + 1] - pref[l]).append('\\n');
        }
        System.out.print(sb);
    }
}`,
    python3: `import sys

def solve() -> None:
    data = sys.stdin.buffer.read().split()
    if not data:
        return
    it = iter(data)
    n = int(next(it))
    u = int(next(it))
    q = int(next(it))

    a = [int(next(it)) for _ in range(n)]
    diff = [0] * (n + 1)
    for _ in range(u):
        l = int(next(it))
        r = int(next(it))
        val = int(next(it))
        diff[l] += val
        diff[r + 1] -= val

    running = 0
    pref = [0] * (n + 1)
    for i in range(n):
        running += diff[i]
        a[i] += running
        pref[i + 1] = pref[i] + a[i]

    out = []
    for _ in range(q):
        l = int(next(it))
        r = int(next(it))
        out.append(str(pref[r + 1] - pref[l]))
    sys.stdout.write("\\n".join(out) + "\\n")

if __name__ == "__main__":
    solve()`,
    ruby: `data = STDIN.read.split.map(&:to_i)
exit if data.empty?

idx = 0
n = data[idx]; idx += 1
u = data[idx]; idx += 1
q = data[idx]; idx += 1

a = data[idx, n]
idx += n

diff = Array.new(n + 1, 0)
u.times do
  l = data[idx]; r = data[idx + 1]; val = data[idx + 2]
  idx += 3
  diff[l] += val
  diff[r + 1] -= val
end

running = 0
pref = Array.new(n + 1, 0)
n.times do |i|
  running += diff[i]
  a[i] += running
  pref[i + 1] = pref[i] + a[i]
end

out = []
q.times do
  l = data[idx]; r = data[idx + 1]
  idx += 2
  out << (pref[r + 1] - pref[l]).to_s
end
STDOUT.write(out.join("\\n") + "\\n")`,
  },
  practiceProblems: [
    {
      id: 'ch01-warmup',
      tier: 'Warmup',
      ratingRange: '800–1100',
      title: 'Equilibrium Partition Count',
      statement:
        'Given an integer array A of length N, count how many split indices i (1 <= i <= N - 1) partition A into a non-empty prefix A[0..i-1] and non-empty suffix A[i..N-1] with identical sums.',
      constraints: '2 <= N <= 2 * 10^5, -10^9 <= A[i] <= 10^9, Time Limit: 1.0s',
      sampleInput: '5\n2 -1 3 1 3',
      sampleOutput: '1',
      hints: [
        'Total sum S = sum(A). If S is odd, no equal split exists.',
        'Maintain a running prefix sum pref and check whether 2 * pref == S before index N - 1.',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n; cin >> n;
    vector<long long> a(n);
    long long total = 0;
    for (int i = 0; i < n; ++i) { cin >> a[i]; total += a[i]; }
    long long pref = 0, ans = 0;
    for (int i = 0; i + 1 < n; ++i) {
        pref += a[i];
        if (pref * 2 == total) ans++;
    }
    cout << ans << '\\n';
}`,
        rust: `use std::io::{self, Read};
fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace().map(|x| x.parse::<i64>().unwrap());
    let n = it.next().unwrap() as usize;
    let a: Vec<i64> = it.take(n).collect();
    let total: i64 = a.iter().sum();
    let (mut pref, mut ans) = (0i64, 0i64);
    for i in 0..n - 1 {
        pref += a[i];
        if pref * 2 == total { ans += 1; }
    }
    println!("{ans}");
}`,
        java21: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        long[] a = new long[n];
        long total = 0;
        for (int i = 0; i < n; i++) { a[i] = sc.nextLong(); total += a[i]; }
        long pref = 0, ans = 0;
        for (int i = 0; i + 1 < n; i++) {
            pref += a[i];
            if (pref * 2 == total) ans++;
        }
        System.out.println(ans);
    }
}`,
        python3: `import sys
data = list(map(int, sys.stdin.buffer.read().split()))
n, a = data[0], data[1:]
total = sum(a)
pref = ans = 0
for x in a[:-1]:
    pref += x
    if pref * 2 == total:
        ans += 1
print(ans)`,
        ruby: `data = STDIN.read.split.map(&:to_i)
n = data[0]; a = data[1, n]
total = a.sum
pref = ans = 0
(0...(n - 1)).each do |i|
  pref += a[i]
  ans += 1 if pref * 2 == total
end
puts ans`,
      },
    },
    {
      id: 'ch01-standard',
      tier: 'Standard',
      ratingRange: '1400–1700',
      title: 'Subarrays Divisible by N (Pigeonhole & Modulo Prefix)',
      statement:
        'Given an array of N integers (possibly negative), count the number of contiguous subarrays [L, R] whose element sum is divisible by N.',
      constraints: '1 <= N <= 2 * 10^5, -10^9 <= A[i] <= 10^9, Time Limit: 1.0s',
      sampleInput: '5\n3 1 2 7 4',
      sampleOutput: '2',
      hints: [
        'Subarray [L, R] has sum divisible by N iff P[R+1] mod N == P[L] mod N.',
        'Normalize negative remainders via ((r % N) + N) % N, and initialize freq[0] = 1 for empty prefix.',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n; cin >> n;
    vector<long long> cnt(n, 0);
    cnt[0] = 1;
    long long pref = 0, ans = 0;
    for (int i = 0; i < n; ++i) {
        long long x; cin >> x;
        pref = ((pref + x) % n + n) % n;
        ans += cnt[pref];
        cnt[pref]++;
    }
    cout << ans << '\\n';
}`,
        rust: `use std::io::{self, Read};
fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace().map(|x| x.parse::<i64>().unwrap());
    let n = it.next().unwrap();
    let mut cnt = vec![0i64; n as usize];
    cnt[0] = 1;
    let (mut pref, mut ans) = (0i64, 0i64);
    for x in it {
        pref = (pref + x).rem_euclid(n);
        ans += cnt[pref as usize];
        cnt[pref as usize] += 1;
    }
    println!("{ans}");
}`,
        java21: `import java.io.*;
public class Main {
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        int n = Integer.parseInt(br.readLine().trim());
        String[] parts = br.readLine().trim().split("\\\\s+");
        long[] cnt = new long[n];
        cnt[0] = 1;
        long pref = 0, ans = 0;
        for (int i = 0; i < n; i++) {
            long x = Long.parseLong(parts[i]);
            pref = ((pref + x) % n + n) % n;
            ans += cnt[(int) pref]++;
        }
        System.out.println(ans);
    }
}`,
        python3: `import sys
data = list(map(int, sys.stdin.buffer.read().split()))
n, a = data[0], data[1:]
cnt = [0] * n
cnt[0] = 1
pref = ans = 0
for x in a:
    pref = (pref + x) % n
    ans += cnt[pref]
    cnt[pref] += 1
print(ans)`,
        ruby: `data = STDIN.read.split.map(&:to_i)
n = data[0]; a = data[1, n]
cnt = Array.new(n, 0)
cnt[0] = 1
pref = ans = 0
a.each do |x|
  pref = (pref + x) % n
  ans += cnt[pref]
  cnt[pref] += 1
end
puts ans`,
      },
    },
    {
      id: 'ch01-boss',
      tier: 'Boss',
      ratingRange: '2000–2400',
      title: '2D Difference Matrix & Zero-Cost Subrectangle Invariant',
      statement:
        'You have an N x M grid of heights and Q rectangular bulldozer operations (r1, c1, r2, c2, +d). After all Q updates, find the maximum K x K square subgrid whose total elevation is <= B.',
      constraints: '1 <= N, M <= 1000, 1 <= Q <= 2 * 10^5, 1 <= B <= 10^15',
      sampleInput: '3 3 2 15\n1 1 2 2 3\n2 2 3 3 4',
      sampleOutput: '2',
      hints: [
        'Use a 2D Difference Array D[r1][c1] += d, D[r1][c2+1] -= d, D[r2+1][c1] -= d, D[r2+1][c2+1] += d.',
        'Sweep 2D prefix sums once to recover the grid, then build a second 2D prefix sum to test square size K via binary search.',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m, q;
    long long B;
    if (!(cin >> n >> m >> q >> B)) return 0;
    vector<vector<long long>> d(n + 2, vector<long long>(m + 2, 0));
    while (q--) {
        int r1, c1, r2, c2; long long val;
        cin >> r1 >> c1 >> r2 >> c2 >> val;
        d[r1][c1] += val; d[r1][c2 + 1] -= val;
        d[r2 + 1][c1] -= val; d[r2 + 1][c2 + 1] += val;
    }
    vector<vector<long long>> p(n + 1, vector<long long>(m + 1, 0));
    for (int i = 1; i <= n; ++i)
        for (int j = 1; j <= m; ++j) {
            d[i][j] += d[i - 1][j] + d[i][j - 1] - d[i - 1][j - 1];
            p[i][j] = d[i][j] + p[i - 1][j] + p[i][j - 1] - p[i - 1][j - 1];
        }
    auto ok = [&](int k) {
        if (k == 0) return true;
        for (int i = k; i <= n; ++i)
            for (int j = k; j <= m; ++j)
                if (p[i][j] - p[i - k][j] - p[i][j - k] + p[i - k][j - k] <= B)
                    return true;
        return false;
    };
    int lo = 0, hi = min(n, m), ans = 0;
    while (lo <= hi) {
        int mid = (lo + hi) / 2;
        if (ok(mid)) { ans = mid; lo = mid + 1; }
        else hi = mid - 1;
    }
    cout << ans << '\\n';
}`,
        rust: `use std::io::{self, Read};
fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let n: usize = it.next().unwrap().parse().unwrap();
    let m: usize = it.next().unwrap().parse().unwrap();
    let q: usize = it.next().unwrap().parse().unwrap();
    let budget: i64 = it.next().unwrap().parse().unwrap();
    let mut d = vec![vec![0i64; m + 2]; n + 2];
    for _ in 0..q {
        let r1: usize = it.next().unwrap().parse().unwrap();
        let c1: usize = it.next().unwrap().parse().unwrap();
        let r2: usize = it.next().unwrap().parse().unwrap();
        let c2: usize = it.next().unwrap().parse().unwrap();
        let v: i64 = it.next().unwrap().parse().unwrap();
        d[r1][c1] += v; d[r1][c2 + 1] -= v;
        d[r2 + 1][c1] -= v; d[r2 + 1][c2 + 1] += v;
    }
    let mut p = vec![vec![0i64; m + 1]; n + 1];
    for i in 1..=n {
        for j in 1..=m {
            d[i][j] += d[i - 1][j] + d[i][j - 1] - d[i - 1][j - 1];
            p[i][j] = d[i][j] + p[i - 1][j] + p[i][j - 1] - p[i - 1][j - 1];
        }
    }
    let (mut lo, mut hi, mut ans) = (0usize, n.min(m), 0usize);
    while lo <= hi {
        let mid = (lo + hi) / 2;
        let mut ok = mid == 0;
        if !ok {
            'outer: for i in mid..=n {
                for j in mid..=m {
                    if p[i][j] - p[i - mid][j] - p[i][j - mid] + p[i - mid][j - mid] <= budget {
                        ok = true; break 'outer;
                    }
                }
            }
        }
        if ok { ans = mid; lo = mid + 1; } else { if mid == 0 { break; } hi = mid - 1; }
    }
    println!("{ans}");
}`,
        java21: `import java.io.*;
import java.util.*;
public class Main {
    public static void main(String[] args) throws Exception {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(), m = sc.nextInt(), q = sc.nextInt();
        long B = sc.nextLong();
        long[][] d = new long[n + 2][m + 2];
        for (int i = 0; i < q; i++) {
            int r1 = sc.nextInt(), c1 = sc.nextInt(), r2 = sc.nextInt(), c2 = sc.nextInt();
            long v = sc.nextLong();
            d[r1][c1] += v; d[r1][c2 + 1] -= v; d[r2 + 1][c1] -= v; d[r2 + 1][c2 + 1] += v;
        }
        long[][] p = new long[n + 1][m + 1];
        for (int i = 1; i <= n; i++)
            for (int j = 1; j <= m; j++) {
                d[i][j] += d[i - 1][j] + d[i][j - 1] - d[i - 1][j - 1];
                p[i][j] = d[i][j] + p[i - 1][j] + p[i][j - 1] - p[i - 1][j - 1];
            }
        int lo = 0, hi = Math.min(n, m), ans = 0;
        while (lo <= hi) {
            int k = (lo + hi) / 2;
            boolean ok = (k == 0);
            for (int i = k; i <= n && !ok; i++)
                for (int j = k; j <= m && !ok; j++)
                    if (p[i][j] - p[i - k][j] - p[i][j - k] + p[i - k][j - k] <= B) ok = true;
            if (ok) { ans = k; lo = k + 1; } else hi = k - 1;
        }
        System.out.println(ans);
    }
}`,
        python3: `import sys
data = list(map(int, sys.stdin.buffer.read().split()))
n, m, q, B = data[0], data[1], data[2], data[3]
d = [[0] * (m + 2) for _ in range(n + 2)]
idx = 4
for _ in range(q):
    r1, c1, r2, c2, v = data[idx:idx+5]
    idx += 5
    d[r1][c1] += v; d[r1][c2 + 1] -= v
    d[r2 + 1][c1] -= v; d[r2 + 1][c2 + 1] += v
p = [[0] * (m + 1) for _ in range(n + 1)]
for i in range(1, n + 1):
    for j in range(1, m + 1):
        d[i][j] += d[i - 1][j] + d[i][j - 1] - d[i - 1][j - 1]
        p[i][j] = d[i][j] + p[i - 1][j] + p[i][j - 1] - p[i - 1][j - 1]
lo, hi, ans = 0, min(n, m), 0
while lo <= hi:
    k = (lo + hi) // 2
    ok = (k == 0)
    if not ok:
        for i in range(k, n + 1):
            for j in range(k, m + 1):
                if p[i][j] - p[i - k][j] - p[i][j - k] + p[i - k][j - k] <= B:
                    ok = True
                    break
            if ok: break
    if ok: ans = k; lo = k + 1
    else: hi = k - 1
print(ans)`,
        ruby: `data = STDIN.read.split.map(&:to_i)
n, m, q, budget = data[0, 4]
d = Array.new(n + 2) { Array.new(m + 2, 0) }
idx = 4
q.times do
  r1, c1, r2, c2, v = data[idx, 5]; idx += 5
  d[r1][c1] += v; d[r1][c2 + 1] -= v
  d[r2 + 1][c1] -= v; d[r2 + 1][c2 + 1] += v
end
p = Array.new(n + 1) { Array.new(m + 1, 0) }
(1..n).each do |i|
  (1..m).each do |j|
    d[i][j] += d[i - 1][j] + d[i][j - 1] - d[i - 1][j - 1]
    p[i][j] = d[i][j] + p[i - 1][j] + p[i][j - 1] - p[i - 1][j - 1]
  end
end
lo = 0; hi = [n, m].min; ans = 0
while lo <= hi
  k = (lo + hi) / 2
  ok = (k == 0)
  (k..n).each do |i|
    break if ok
    (k..m).each do |j|
      if p[i][j] - p[i - k][j] - p[i][j - k] + p[i - k][j - k] <= budget
        ok = true; break
      end
    end
  end unless ok
  if ok then ans = k; lo = k + 1 else hi = k - 1 end
end
puts ans`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'CSES',
      title: 'Static Range Sum Queries & Subarray Sums II',
      difficulty: 'Introductory / Sorting',
      url: 'https://cses.fi/problemset/task/1646',
      patternNote: 'Direct 1D prefix sums and hash-map prefix difference counting.',
    },
    {
      platform: 'AtCoder',
      title: 'ABC 122 C - GeT AC & ABC 188 D - Snuke Prime',
      difficulty: 'AtCoder ~900–1300',
      url: 'https://atcoder.jp/contests/abc188/tasks/abc188_d',
      patternNote: 'Coordinate-compressed difference arrays for huge 10^9 day intervals.',
    },
    {
      platform: 'Codeforces',
      title: 'Karen and Coffee (816B) & Greg and Array (295A)',
      difficulty: 'CF 1400–1500',
      url: 'https://codeforces.com/problemset?tags=data+structures,implementation',
      patternNote: 'Stacked difference array on top of operations followed by prefix threshold counting.',
    },
    {
      platform: 'CodeChef',
      title: 'CENS20A - Priya and AND / Difference Matrix',
      difficulty: 'CodeChef 2★–3★',
      url: 'https://www.codechef.com/practice',
      patternNote: '2D grid parity toggling using 2D difference array corners.',
    },
    {
      platform: 'HackerRank',
      title: 'Array Manipulation (Crush)',
      difficulty: 'Hard Prep',
      url: 'https://www.hackerrank.com/challenges/crush/problem',
      patternNote: 'Canonical 10^7-length batch range-add evaluated with O(N) sweep.',
    },
    {
      platform: 'NeetCode 150',
      title: 'Product of Array Except Self & Subarray Sum Equals K',
      difficulty: 'FAANG Medium',
      url: 'https://leetcode.com/problemset/?search=Subarray+Sum+Equals+K',
      patternNote: 'Prefix/suffix factorization and cumulative hash lookup.',
    },
  ],
  interviewNotes: [
    'FAANG interviews rarely ask for raw range sum queries alone; they wrap prefix sums inside "Count subarrays equal to K" or "Continuous Subarray Sum divisible by K".',
    'Always mention integer overflow and negative modulo normalization unprompted—interviewers treat that as production maturity.',
    'Difference arrays appear in systems interviews as "Meeting Rooms II / Maximum Concurrent Bookings / Bandwidth Spike Peak".',
  ],
  projectBlueprint: {
    title: 'Financial Ledger & Range Analytics Engine',
    tagline:
      'High-throughput immutable time-series ledger computing arbitrary date-window P&L, rolling volatility, and scheduled tax-bracket overlays in O(1).',
    stackSummary: 'TypeScript / Rust Core Engine + Append-Only Event Log + Materialized Prefix Snapshots',
    asciiDiagram: `┌────────────────────┐     ┌─────────────────────────┐     ┌────────────────────────┐
│ Raw Ledger Events  │────►│ Difference Delta Buffer │────►│ Prefix Snapshot Index  │
│ (ts, amount, tag)  │     │ (+delta at L, - at R+1) │     │ P[i] = P[i-1] + net[i] │
└────────────────────┘     └─────────────────────────┘     └───────────┬────────────┘
                                                                       │ O(1) Query
                                                                       ▼
                                                           ┌────────────────────────┐
                                                           │ P&L Window Analytics   │
                                                           │ sum(L..R) = P[R]-P[L-1]│
                                                           └────────────────────────┘`,
    milestones: [
      {
        id: 'ch01-m1',
        title: 'Milestone 1: Immutable Event Ingestion & Bucket Alignment',
        detail:
          'Normalize Unix timestamps into discrete minute/day buckets and maintain an append-only array of net cashflows.',
      },
      {
        id: 'ch01-m2',
        title: 'Milestone 2: Scheduled Recurring Overlay via Difference Buffers',
        detail:
          'Support multi-day promotional rebates and recurring server cost accruals using O(1) start/end difference markers.',
      },
      {
        id: 'ch01-m3',
        title: 'Milestone 3: Prefix Sum Materialization & O(1) Audit Queries',
        detail:
          'Expose GET /analytics/window?from=L&to=R returning total revenue, net margin, and transaction count in constant time.',
      },
      {
        id: 'ch01-m4',
        title: 'Milestone 4: 2D Cohort Heatmaps',
        detail:
          'Extend the 1D engine to a 2D (signup_week x retention_week) prefix matrix for sub-millisecond dashboard cohort slicing.',
      },
    ],
    starterCode: `export class LedgerAnalyticsEngine {
  private readonly buckets: number;
  private readonly diff: Float64Array;
  private prefix: Float64Array;
  private dirty = true;

  constructor(buckets: number) {
    this.buckets = buckets;
    this.diff = new Float64Array(buckets + 1);
    this.prefix = new Float64Array(buckets + 1);
  }

  /** Apply an O(1) recurring adjustment across [startBucket, endBucket] inclusive */
  applyRangeAdjustment(startBucket: number, endBucket: number, dailyAmount: number): void {
    const l = Math.max(0, startBucket);
    const r = Math.min(this.buckets - 1, endBucket);
    if (l > r) return;
    this.diff[l] += dailyAmount;
    this.diff[r + 1] -= dailyAmount;
    this.dirty = true;
  }

  private rebuildIfNeeded(): void {
    if (!this.dirty) return;
    let running = 0;
    this.prefix[0] = 0;
    for (let i = 0; i < this.buckets; i++) {
      running += this.diff[i];
      this.prefix[i + 1] = this.prefix[i] + running;
    }
    this.dirty = false;
  }

  /** Answer arbitrary [l, r] P&L sum in O(1) */
  queryWindowSum(l: number, r: number): number {
    this.rebuildIfNeeded();
    const cl = Math.max(0, l);
    const cr = Math.min(this.buckets - 1, r);
    if (cl > cr) return 0;
    return this.prefix[cr + 1] - this.prefix[cl];
  }
}`,
  },
};
