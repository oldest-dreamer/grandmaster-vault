import type { TheoryChapter } from '../../types/vault';

export const CH49_COORD_COMPRESSION_SWEEP: TheoryChapter = {
  slug: 'coordinate-compression-offline-sorting',
  topicId: 'ds-02',
  title: 'Coordinate Compression & Offline Event Sorting',
  domain: 'Data Structures',
  ratingTier: '1200–1400',
  usacoDivision: 'Silver',
  subtitle:
    'Shrink sparse 10^9 coordinate spaces into dense 0..M-1 array indices via sort + unique + lower_bound, sweep (+1/-1) interval events to track maximum concurrency, and unlock Fenwick/Segment Trees over arbitrary large keys.',
  analogyTitle: 'The Sparse Address Book Re-Numbering & Turnstile Counter Analogy',
  analogyBody:
    'Suppose `2 * 10^5` events happen at timestamps between `1` and `10^9`. Building a `10^9`-element Fenwick Tree or difference array instantly crashes with **MLE / TLE** — yet `99.98%` of those `10^9` integers never appear in the input! **Coordinate Compression** solves this in three lines: push every relevant coordinate (both array values AND query endpoints!) into a single vector, sort it, strip duplicates (`unique`), and replace every raw `x` with its dense rank **`lower_bound(x) - begin()`** in `[0 .. M-1]`. Now `M <= 4 * 10^5` fits inside a fast cache-local array! Similarly, for interval overlap problems over `[1, 10^9]`, **Offline Event Sorting** decomposes each `[L, R]` span into two turnstile events `(L, +1)` and `(R, -1)`, sorts all `2N` events chronologically, and sweeps a single counter in `O(N log N)`!',
  prerequisites: [
    {
      slug: 'prefix-sums-difference-arrays',
      title: 'Prefix Sums, Difference Arrays & Invariants',
    },
  ],
  traceTitle: 'Interactive Coordinate Compression & Sweep-Line Event Trace',
  traceSubtitle:
    'Compress sparse values `[1000000, 50, 1000000, 999, 50]` into dense Fenwick indices, and trace `(time, delta)` turnstile events for intervals `[5, 8]`, `[2, 4]`, `[3, 9]`.',
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Step 1: Sort & Deduplicate Raw Sparse Values -> Dense Rank Map',
      explanation:
        'Take raw input [1000000, 50, 1000000, 999, 50]. Sort ascending -> [50, 50, 999, 1000000, 1000000]. Deduplicate -> vals = [50, 999, 1000000]. Binary search maps 50->0, 999->1, 1000000->2 while preserving strict < comparisons!',
      mode: 'array',
      arrays: [
        {
          name: 'Raw vs Compressed Ranks',
          cells: [
            { index: 0, value: '50 -> rk 0', label: 'vals[0]', highlight: 'active' },
            { index: 1, value: '999 -> rk 1', label: 'vals[1]', highlight: 'window' },
            { index: 2, value: '10^6 -> rk 2', label: 'vals[2]', highlight: 'updated' },
          ],
        },
      ],
      variables: { UniqueCount: 3, OriginalMax: 1000000, DenseMax: 2 },
    },
    {
      stepNumber: 2,
      title: 'Step 2: Split Intervals [5,8], [2,4], [3,9] Into Sorted (t, delta) Events',
      explanation:
        'Convert each interval [a, b] into arrival (a, +1) and departure (b, -1). Sort by time ascending: (2,+1), (3,+1), (4,-1), (5,+1), (8,-1), (9,-1).',
      mode: 'array',
      arrays: [
        {
          name: 'Chronological Turnstile Events',
          cells: [
            { index: 0, value: '(2, +1)', label: 'Enter C2', highlight: 'window' },
            { index: 1, value: '(3, +1)', label: 'Enter C3', highlight: 'active' },
            { index: 2, value: '(4, -1)', label: 'Leave C2', highlight: 'neutral' },
            { index: 3, value: '(5, +1)', label: 'Enter C1', highlight: 'active' },
            { index: 4, value: '(8, -1)', label: 'Leave C1', highlight: 'neutral' },
            { index: 5, value: '(9, -1)', label: 'Leave C3', highlight: 'neutral' },
          ],
        },
      ],
      variables: { TotalEvents: 6, SortOrder: 't ascending' },
    },
    {
      stepNumber: 3,
      title: 'Step 3: Single Linear Sweep Tracks Peak Concurrency = 2',
      explanation:
        'Walk events left-to-right updating active += delta: 0 -> 1 (t=2) -> 2 (t=3, peak!) -> 1 (t=4) -> 2 (t=5, peak!) -> 1 (t=8) -> 0 (t=9). Answer = 2 in O(N log N) independent of 10^9 timestamps!',
      mode: 'array',
      arrays: [
        {
          name: 'Running Active Counter Across Sweep',
          cells: [
            { index: 2, value: '1', label: 't=2', highlight: 'window' },
            { index: 3, value: '2 (Max)', label: 't=3', highlight: 'active' },
            { index: 4, value: '1', label: 't=4', highlight: 'neutral' },
            { index: 5, value: '2 (Max)', label: 't=5', highlight: 'active' },
            { index: 8, value: '1', label: 't=8', highlight: 'neutral' },
            { index: 9, value: '0', label: 't=9', highlight: 'neutral' },
          ],
        },
      ],
      variables: { MaxConcurrency: 2, TimeComplexity: 'O(N log N)' },
    },
  ],
  reductionClues: [
    {
      clue: '"Values/timestamps reach 10^9 (or negative), yet N + Q <= 2 * 10^5 and you need a Fenwick/Segment Tree"',
      translation:
        '**Offline Coordinate Compression**: gather ALL initial values, update values, AND query bounds into a single vector, sort + deduplicate, and index via `lower_bound`!',
    },
    {
      clue: '"Find maximum overlapping intervals (or union length of 1D segments) with endpoints up to 10^9"',
      translation:
        '**Sweep-Line Event Sorting**: emit `(L, +1)` and `(R, -1)`, sort by time (careful with tie-breaking!), and sweep a single running counter!',
    },
    {
      clue: '"Count inversions (i < j and a[i] > a[j]) or offline 2D dominance (x_i <= x_q and y_i <= y_q)"',
      translation:
        'Sort points and queries by **`x` ascending**, compress **`y`** coordinates, and walk in `x`-order inserting points (`bit.add(compY, +1)`) and answering queries (`bit.sum(compQy)`)!',
    },
    {
      clue: '"Need to process dynamic queries where coordinates appear mid-flight"',
      translation:
        'Read ALL `Q` queries upfront (**offline**!) before building the coordinate dictionary, so every future coordinate already owns a pre-assigned slot in `[0 .. M-1]`.',
    },
  ],
  timeComplexity: 'Sort + Deduplicate + Sweep / BIT: O((N + Q) log(N + Q))',
  spaceComplexity: 'O(N + Q)',
  pitfalls: [
    {
      type: 'WA',
      title: 'Forgetting to Include Query Endpoints (and Update Values) in the Compression Dictionary',
      detail:
        'If you compress ONLY the initial array `A`, then updating an element to a new value `x` or querying a range `[a, b]` not present in `A` causes `lower_bound` to jump past the end or merge distinct intervals! Always read ALL queries offline and push every update value and query boundary into `coords` before deduplicating.',
    },
    {
      type: 'WA',
      title: 'Wrong Tie-Breaking Between (+1) Arrival and (-1) Departure at the Same Timestamp',
      detail:
        'If closed intervals `[1, 3]` and `[3, 5]` are treated as overlapping at `3`, process `+1` BEFORE `-1` at identical timestamps (`if (t1 == t2) return d1 > d2;`). If half-open `[1, 3)` and `[3, 5)` do NOT overlap at `3`, process `-1` BEFORE `+1` (`d1 < d2`)!',
    },
    {
      type: 'TLE',
      title: 'Compressing Values Inside a Hash Map Instead of Sorted Array + Binary Search',
      detail:
        'In C++/Rust/Java, `unordered_map` per lookup adds ~5-10x constant-factor overhead and risks hash-collision hacks. A contiguous sorted `vector` + `std::lower_bound` (or single scan mapping after sorting index pairs) is completely deterministic and cache-friendly.',
    },
    {
      type: 'WA',
      title: 'Using `upper_bound` vs `lower_bound` Incorrectly for Range Queries [a, b]',
      detail:
        'When all query endpoints `a, b` are included in `coords`, `idx(a)` and `idx(b)` exist verbatim via `lower_bound`. If you did NOT include `b`, `upper_bound(b) - 1` is required to find the largest compressed rank `<= b`!',
    },
  ],
  implementations: {
    cpp20: `#include <bits/stdc++.h>
using namespace std;

// Coordinate Compression + Fenwick Tree (BIT) Toolkit
struct Fenwick {
    int n;
    vector<long long> bit;
    Fenwick(int n) : n(n), bit(n + 1, 0) {}

    void add(int idx1, long long delta) {
        for (; idx1 <= n; idx1 += idx1 & -idx1) bit[idx1] += delta;
    }
    long long prefixSum(int idx1) const {
        long long s = 0;
        for (; idx1 > 0; idx1 -= idx1 & -idx1) s += bit[idx1];
        return s;
    }
    long long rangeSum(int l1, int r1) const {
        return l1 > r1 ? 0 : prefixSum(r1) - prefixSum(l1 - 1);
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, q;
    if (!(cin >> n >> q)) return 0;
    vector<long long> a(n + 1);
    vector<long long> coords;
    coords.reserve(n + 2 * q);

    for (int i = 1; i <= n; i++) {
        cin >> a[i];
        coords.push_back(a[i]);
    }

    struct Query { char type; long long x, y; };
    vector<Query> qs(q);
    for (int i = 0; i < q; i++) {
        cin >> qs[i].type >> qs[i].x >> qs[i].y;
        if (qs[i].type == '!') {
            coords.push_back(qs[i].y);
        } else {
            coords.push_back(qs[i].x);
            coords.push_back(qs[i].y);
        }
    }

    sort(coords.begin(), coords.end());
    coords.erase(unique(coords.begin(), coords.end()), coords.end());

    auto rank1 = [&](long long v) {
        return (int)(lower_bound(coords.begin(), coords.end(), v) - coords.begin()) + 1;
    };

    Fenwick bit((int)coords.size());
    for (int i = 1; i <= n; i++) bit.add(rank1(a[i]), 1);

    for (const auto& qu : qs) {
        if (qu.type == '!') {
            int pos = (int)qu.x;
            bit.add(rank1(a[pos]), -1);
            a[pos] = qu.y;
            bit.add(rank1(a[pos]), 1);
        } else {
            cout << bit.rangeSum(rank1(qu.x), rank1(qu.y)) << "\\n";
        }
    }
    return 0;
}`,
    rust: `use std::io::{self, Read};

struct Fenwick {
    bit: Vec<i64>,
}

impl Fenwick {
    fn new(n: usize) -> Self {
        Self { bit: vec![0; n + 1] }
    }
    fn add(&mut self, mut idx: usize, delta: i64) {
        while idx < self.bit.len() {
            self.bit[idx] += delta;
            idx += idx & idx.wrapping_neg();
        }
    }
    fn prefix_sum(&self, mut idx: usize) -> i64 {
        let mut s = 0;
        while idx > 0 {
            s += self.bit[idx];
            idx -= idx & idx.wrapping_neg();
        }
        s
    }
    fn range_sum(&self, l: usize, r: usize) -> i64 {
        if l > r { 0 } else { self.prefix_sum(r) - self.prefix_sum(l - 1) }
    }
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let n: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };
    let q: usize = it.next().unwrap().parse().unwrap();

    let mut a = vec![0i64; n + 1];
    let mut coords = Vec::with_capacity(n + 2 * q);
    for i in 1..=n {
        a[i] = it.next().unwrap().parse().unwrap();
        coords.push(a[i]);
    }

    let mut qs = Vec::with_capacity(q);
    for _ in 0..q {
        let typ = it.next().unwrap().as_bytes()[0];
        let x: i64 = it.next().unwrap().parse().unwrap();
        let y: i64 = it.next().unwrap().parse().unwrap();
        if typ == b'!' {
            coords.push(y);
        } else {
            coords.push(x);
            coords.push(y);
        }
        qs.push((typ, x, y));
    }

    coords.sort_unstable();
    coords.dedup();
    let rank1 = |v: i64| coords.binary_search(&v).unwrap() + 1;

    let mut bit = Fenwick::new(coords.len());
    for i in 1..=n {
        bit.add(rank1(a[i]), 1);
    }

    let mut out = String::new();
    for (typ, x, y) in qs {
        if typ == b'!' {
            let pos = x as usize;
            bit.add(rank1(a[pos]), -1);
            a[pos] = y;
            bit.add(rank1(a[pos]), 1);
        } else {
            out.push_str(&format!("{}\\n", bit.range_sum(rank1(x), rank1(y))));
        }
    }
    print!("{}", out);
}`,
    java21: `import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;

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
        String next() throws IOException {
            int c = readByte();
            while (c >= 0 && c <= ' ') c = readByte();
            if (c == -1) return null;
            StringBuilder sb = new StringBuilder();
            while (c > ' ') { sb.append((char) c); c = readByte(); }
            return sb.toString();
        }
        long nextLong() throws IOException {
            return Long.parseLong(next());
        }
    }

    static long[] bit;
    static int m;

    static void add(int i, long delta) {
        for (; i <= m; i += i & -i) bit[i] += delta;
    }

    static long prefixSum(int i) {
        long s = 0;
        for (; i > 0; i -= i & -i) s += bit[i];
        return s;
    }

    static int rank1(long[] coords, int sz, long v) {
        return Arrays.binarySearch(coords, 0, sz, v) + 1;
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        String nStr = fs.next();
        if (nStr == null) return;
        int n = Integer.parseInt(nStr);
        int q = (int) fs.nextLong();

        long[] a = new long[n + 1];
        long[] raw = new long[n + 2 * q];
        int rc = 0;
        for (int i = 1; i <= n; i++) {
            a[i] = fs.nextLong();
            raw[rc++] = a[i];
        }

        char[] qt = new char[q];
        long[] qx = new long[q], qy = new long[q];
        for (int i = 0; i < q; i++) {
            qt[i] = fs.next().charAt(0);
            qx[i] = fs.nextLong();
            qy[i] = fs.nextLong();
            if (qt[i] == '!') raw[rc++] = qy[i];
            else { raw[rc++] = qx[i]; raw[rc++] = qy[i]; }
        }

        Arrays.sort(raw, 0, rc);
        m = 0;
        for (int i = 0; i < rc; i++) {
            if (i == 0 || raw[i] != raw[i - 1]) raw[m++] = raw[i];
        }

        bit = new long[m + 1];
        for (int i = 1; i <= n; i++) add(rank1(raw, m, a[i]), 1);

        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < q; i++) {
            if (qt[i] == '!') {
                int pos = (int) qx[i];
                add(rank1(raw, m, a[pos]), -1);
                a[pos] = qy[i];
                add(rank1(raw, m, a[pos]), 1);
            } else {
                int l = rank1(raw, m, qx[i]);
                int r = rank1(raw, m, qy[i]);
                sb.append(prefixSum(r) - prefixSum(l - 1)).append('\\n');
            }
        }
        System.out.print(sb);
    }
}`,
    python3: `import bisect
import sys

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    n = int(next(it))
    q = int(next(it))

    a = [0] * (n + 1)
    coords = []
    for i in range(1, n + 1):
        v = int(next(it))
        a[i] = v
        coords.append(v)

    qs = []
    for _ in range(q):
        typ = next(it)
        x = int(next(it))
        y = int(next(it))
        qs.append((typ, x, y))
        if typ == '!':
            coords.append(y)
        else:
            coords.append(x)
            coords.append(y)

    coords = sorted(set(coords))
    m = len(coords)
    bit = [0] * (m + 1)

    def add(i: int, delta: int) -> None:
        while i <= m:
            bit[i] += delta
            i += i & -i

    def pref(i: int) -> int:
        s = 0
        while i > 0:
            s += bit[i]
            i -= i & -i
        return s

    for i in range(1, n + 1):
        add(bisect.bisect_left(coords, a[i]) + 1, 1)

    out = []
    for typ, x, y in qs:
        if typ == '!':
            add(bisect.bisect_left(coords, a[x]) + 1, -1)
            a[x] = y
            add(bisect.bisect_left(coords, y) + 1, 1)
        else:
            l = bisect.bisect_left(coords, x) + 1
            r = bisect.bisect_left(coords, y) + 1
            out.append(str(pref(r) - pref(l - 1)))
    sys.stdout.write("\\n".join(out) + "\\n")

if __name__ == "__main__":
    solve()`,
    ruby: `tokens = $stdin.read.split
exit if tokens.empty?
idx = 0
n = tokens[idx].to_i; idx += 1
q = tokens[idx].to_i; idx += 1

a = [0]
coords = []
n.times do
  v = tokens[idx].to_i; idx += 1
  a << v
  coords << v
end

qs = []
q.times do
  typ = tokens[idx]; x = tokens[idx + 1].to_i; y = tokens[idx + 2].to_i
  idx += 3
  qs << [typ, x, y]
  if typ == '!'
    coords << y
  else
    coords << x << y
  end
end

coords = coords.uniq.sort
m = coords.length
rank1 = ->(v) { coords.bsearch_index { |c| c >= v } + 1 }

bit = Array.new(m + 1, 0)
add = lambda do |i, d|
  while i <= m
    bit[i] += d
    i += i & -i
  end
end
pref = lambda do |i|
  s = 0
  while i > 0
    s += bit[i]
    i -= i & -i
  end
  s
end

(1..n).each { |i| add.call(rank1.call(a[i]), 1) }

out = []
qs.each do |typ, x, y|
  if typ == '!'
    add.call(rank1.call(a[x]), -1)
    a[x] = y
    add.call(rank1.call(y), 1)
  else
    l = rank1.call(x)
    r = rank1.call(y)
    out << (pref.call(r) - pref.call(l - 1)).to_s
  end
end
puts out.join("\\n")`,
  },
  practiceProblems: [
    {
      id: 'ch49-p1',
      tier: 'Warmup',
      ratingRange: '1150–1350',
      title: 'Restaurant Customers — Maximum Interval Concurrency via Event Sorting',
      statement:
        'You are given the arrival and leaving times `(a_i, b_i)` of `N` customers in a restaurant (`all arrival and leaving times are distinct`). Find the **maximum number of customers** in the restaurant at any single moment.',
      constraints: '1 <= N <= 2 * 10^5, 1 <= a_i < b_i <= 10^9',
      sampleInput: '3\n5 8\n2 4\n3 9',
      sampleOutput: '2',
      hints: [
        'Never allocate an array of length `10^9`! Represent each customer as two events: `(a_i, +1)` and `(b_i, -1)`.',
        'Sort all `2N` events chronologically by timestamp and sweep left-to-right maintaining `cur += delta` and `best = max(best, cur)`.',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    if (!(cin >> n)) return 0;
    vector<pair<long long, int>> events;
    events.reserve(2 * n);
    for (int i = 0; i < n; i++) {
        long long a, b;
        cin >> a >> b;
        events.push_back({a, 1});
        events.push_back({b, -1});
    }
    sort(events.begin(), events.end());

    int cur = 0, best = 0;
    for (auto [t, d] : events) {
        cur += d;
        best = max(best, cur);
    }
    cout << best << "\\n";
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

    let mut events = Vec::with_capacity(2 * n);
    for _ in 0..n {
        let a: i64 = it.next().unwrap().parse().unwrap();
        let b: i64 = it.next().unwrap().parse().unwrap();
        events.push((a, 1i32));
        events.push((b, -1i32));
    }
    events.sort_unstable();

    let mut cur = 0i32;
    let mut best = 0i32;
    for (_, d) in events {
        cur += d;
        best = best.max(cur);
    }
    println!("{}", best);
}`,
        java21: `import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;

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

        long[] ev = new long[2 * n];
        for (int i = 0; i < n; i++) {
            long a = fs.nextLong(), b = fs.nextLong();
            ev[2 * i] = (a << 1) | 1L;
            ev[2 * i + 1] = (b << 1);
        }
        Arrays.sort(ev);

        int cur = 0, best = 0;
        for (long e : ev) {
            cur += ((e & 1L) == 1L) ? 1 : -1;
            if (cur > best) best = cur;
        }
        System.out.println(best);
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
    events = []
    for _ in range(n):
        a = int(next(it))
        b = int(next(it))
        events.append((a, 1))
        events.append((b, -1))
    events.sort()

    cur = 0
    best = 0
    for _, d in events:
        cur += d
        if cur > best:
            best = cur
    sys.stdout.write(f"{best}\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
idx = 0
n = tokens[idx].to_i; idx += 1
events = []
n.times do
  a = tokens[idx].to_i; b = tokens[idx + 1].to_i; idx += 2
  events << [a, 1] << [b, -1]
end
events.sort_by! { |t, d| [t, d] }

cur = 0
best = 0
events.each do |_, d|
  cur += d
  best = cur if cur > best
end
puts best`,
      },
    },
    {
      id: 'ch49-p2',
      tier: 'Standard',
      ratingRange: '1300–1500',
      title: 'Salary Queries — Offline Coordinate Compression + Fenwick Tree',
      statement:
        'A company has `N` employees with initial salaries `p_1..p_N` (`<= 10^9`). Process `Q` operations: `! k x` (change employee `k`’s salary to `x`) and `? a b` (count employees whose current salary lies in `[a, b]`).',
      constraints: '1 <= N, Q <= 2 * 10^5, 1 <= p_i, x, a, b <= 10^9',
      sampleInput: '5 3\n3 7 2 2 5\n? 2 3\n! 3 6\n? 2 3',
      sampleOutput: '3\n2',
      hints: [
        'Read ALL `Q` operations before touching the Fenwick Tree so you can collect every salary `p_i`, every new value `x`, and every query endpoint `a, b` into one sorted unique array `coords`.',
        'Update `! k x` simply decrements `bit` at `rank(p[k])`, sets `p[k] = x`, and increments `bit` at `rank(x)`. Query `? a b` returns `pref(rank(b)) - pref(rank(a) - 1)`!',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, q;
    if (!(cin >> n >> q)) return 0;
    vector<long long> p(n + 1), coords;
    coords.reserve(n + 2 * q);
    for (int i = 1; i <= n; i++) {
        cin >> p[i];
        coords.push_back(p[i]);
    }

    struct Op { char t; long long a, b; };
    vector<Op> ops(q);
    for (int i = 0; i < q; i++) {
        cin >> ops[i].t >> ops[i].a >> ops[i].b;
        if (ops[i].t == '!') coords.push_back(ops[i].b);
        else { coords.push_back(ops[i].a); coords.push_back(ops[i].b); }
    }

    sort(coords.begin(), coords.end());
    coords.erase(unique(coords.begin(), coords.end()), coords.end());
    int m = (int)coords.size();
    vector<int> bit(m + 1, 0);

    auto add = [&](int i, int d) {
        for (; i <= m; i += i & -i) bit[i] += d;
    };
    auto pref = [&](int i) {
        int s = 0;
        for (; i > 0; i -= i & -i) s += bit[i];
        return s;
    };
    auto id = [&](long long v) {
        return (int)(lower_bound(coords.begin(), coords.end(), v) - coords.begin()) + 1;
    };

    for (int i = 1; i <= n; i++) add(id(p[i]), 1);
    for (const auto& op : ops) {
        if (op.t == '!') {
            int k = (int)op.a;
            add(id(p[k]), -1);
            p[k] = op.b;
            add(id(p[k]), 1);
        } else {
            cout << pref(id(op.b)) - pref(id(op.a) - 1) << "\\n";
        }
    }
    return 0;
}`,
        rust: `use std::io::{self, Read};

fn add(bit: &mut [i32], mut i: usize, d: i32) {
    while i < bit.len() {
        bit[i] += d;
        i += i & i.wrapping_neg();
    }
}

fn pref(bit: &[i32], mut i: usize) -> i32 {
    let mut s = 0;
    while i > 0 {
        s += bit[i];
        i -= i & i.wrapping_neg();
    }
    s
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let n: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };
    let q: usize = it.next().unwrap().parse().unwrap();

    let mut p = vec![0i64; n + 1];
    let mut coords = Vec::with_capacity(n + 2 * q);
    for i in 1..=n {
        p[i] = it.next().unwrap().parse().unwrap();
        coords.push(p[i]);
    }

    let mut ops = Vec::with_capacity(q);
    for _ in 0..q {
        let t = it.next().unwrap().as_bytes()[0];
        let a: i64 = it.next().unwrap().parse().unwrap();
        let b: i64 = it.next().unwrap().parse().unwrap();
        if t == b'!' {
            coords.push(b);
        } else {
            coords.push(a);
            coords.push(b);
        }
        ops.push((t, a, b));
    }

    coords.sort_unstable();
    coords.dedup();
    let id = |v: i64| coords.binary_search(&v).unwrap() + 1;

    let mut bit = vec![0i32; coords.len() + 1];
    for i in 1..=n {
        add(&mut bit, id(p[i]), 1);
    }

    let mut out = String::new();
    for (t, a, b) in ops {
        if t == b'!' {
            let k = a as usize;
            add(&mut bit, id(p[k]), -1);
            p[k] = b;
            add(&mut bit, id(b), 1);
        } else {
            out.push_str(&format!("{}\\n", pref(&bit, id(b)) - pref(&bit, id(a) - 1)));
        }
    }
    print!("{}", out);
}`,
        java21: `import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;

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
        String next() throws IOException {
            int c = readByte();
            while (c >= 0 && c <= ' ') c = readByte();
            if (c == -1) return null;
            StringBuilder sb = new StringBuilder();
            while (c > ' ') { sb.append((char) c); c = readByte(); }
            return sb.toString();
        }
        long nextLong() throws IOException { return Long.parseLong(next()); }
    }

    static int[] bit;
    static int m;
    static void add(int i, int d) { for (; i <= m; i += i & -i) bit[i] += d; }
    static int pref(int i) { int s = 0; for (; i > 0; i -= i & -i) s += bit[i]; return s; }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        String nStr = fs.next();
        if (nStr == null) return;
        int n = Integer.parseInt(nStr), q = (int) fs.nextLong();

        long[] p = new long[n + 1], coords = new long[n + 2 * q];
        int cc = 0;
        for (int i = 1; i <= n; i++) { p[i] = fs.nextLong(); coords[cc++] = p[i]; }

        char[] qt = new char[q];
        long[] qa = new long[q], qb = new long[q];
        for (int i = 0; i < q; i++) {
            qt[i] = fs.next().charAt(0);
            qa[i] = fs.nextLong();
            qb[i] = fs.nextLong();
            if (qt[i] == '!') coords[cc++] = qb[i];
            else { coords[cc++] = qa[i]; coords[cc++] = qb[i]; }
        }

        Arrays.sort(coords, 0, cc);
        m = 0;
        for (int i = 0; i < cc; i++) if (i == 0 || coords[i] != coords[i - 1]) coords[m++] = coords[i];

        bit = new int[m + 1];
        for (int i = 1; i <= n; i++) add(Arrays.binarySearch(coords, 0, m, p[i]) + 1, 1);

        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < q; i++) {
            if (qt[i] == '!') {
                int k = (int) qa[i];
                add(Arrays.binarySearch(coords, 0, m, p[k]) + 1, -1);
                p[k] = qb[i];
                add(Arrays.binarySearch(coords, 0, m, p[k]) + 1, 1);
            } else {
                int l = Arrays.binarySearch(coords, 0, m, qa[i]) + 1;
                int r = Arrays.binarySearch(coords, 0, m, qb[i]) + 1;
                sb.append(pref(r) - pref(l - 1)).append('\\n');
            }
        }
        System.out.print(sb);
    }
}`,
        python3: `import bisect
import sys

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    n = int(next(it))
    q = int(next(it))

    p = [0] + [int(next(it)) for _ in range(n)]
    coords = p[1:]
    ops = []
    for _ in range(q):
        t = next(it)
        a = int(next(it))
        b = int(next(it))
        ops.append((t, a, b))
        if t == '!':
            coords.append(b)
        else:
            coords.append(a)
            coords.append(b)

    coords = sorted(set(coords))
    m = len(coords)
    bit = [0] * (m + 1)

    def add(i: int, d: int) -> None:
        while i <= m:
            bit[i] += d
            i += i & -i

    def pref(i: int) -> int:
        s = 0
        while i > 0:
            s += bit[i]
            i -= i & -i
        return s

    for i in range(1, n + 1):
        add(bisect.bisect_left(coords, p[i]) + 1, 1)

    out = []
    for t, a, b in ops:
        if t == '!':
            add(bisect.bisect_left(coords, p[a]) + 1, -1)
            p[a] = b
            add(bisect.bisect_left(coords, b) + 1, 1)
        else:
            l = bisect.bisect_left(coords, a) + 1
            r = bisect.bisect_left(coords, b) + 1
            out.append(str(pref(r) - pref(l - 1)))
    sys.stdout.write("\\n".join(out) + "\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
idx = 0
n = tokens[idx].to_i; idx += 1
q = tokens[idx].to_i; idx += 1

p = [0] + Array.new(n) { tokens[idx].to_i.tap { idx += 1 } }
coords = p[1..].dup
ops = []
q.times do
  t = tokens[idx]; a = tokens[idx + 1].to_i; b = tokens[idx + 2].to_i
  idx += 3
  ops << [t, a, b]
  if t == '!'
    coords << b
  else
    coords << a << b
  end
end

coords = coords.uniq.sort
m = coords.length
rank1 = ->(v) { coords.bsearch_index { |c| c >= v } + 1 }
bit = Array.new(m + 1, 0)

add = lambda do |i, d|
  while i <= m
    bit[i] += d
    i += i & -i
  end
end
pref = lambda do |i|
  s = 0
  while i > 0
    s += bit[i]
    i -= i & -i
  end
  s
end

(1..n).each { |i| add.call(rank1.call(p[i]), 1) }

out = []
ops.each do |t, a, b|
  if t == '!'
    add.call(rank1.call(p[a]), -1)
    p[a] = b
    add.call(rank1.call(b), 1)
  else
    out << (pref.call(rank1.call(b)) - pref.call(rank1.call(a) - 1)).to_s
  end
end
puts out.join("\\n")`,
      },
    },
    {
      id: 'ch49-p3',
      tier: 'Boss',
      ratingRange: '1450–1700',
      title: 'Offline 2D Dominance Queries — X-Sweep + Compressed Y-Fenwick Tree',
      statement:
        'Given `N` 2D data points `(x_i, y_i)` and `Q` queries `(qx_j, qy_j)`, for each query count how many points satisfy **both** `x_i <= qx_j` AND `y_i <= qy_j` in `O((N + Q) log(N + Q))` time.',
      constraints: '1 <= N, Q <= 2 * 10^5, -10^9 <= x_i, y_i, qx_j, qy_j <= 10^9',
      sampleInput: '4 2\n1 4\n2 2\n3 3\n5 1\n3 3\n5 2',
      sampleOutput: '2\n2',
      hints: [
        'Eliminate the `x <= qx` dimension completely by sorting ALL points AND queries together by `x` ascending, ensuring **points come BEFORE queries** when `x_i == qx_j` (`type = 0` for point, `type = 1` for query)!',
        'Compress all `y_i` and `qy_j` into dense `[1 .. M]`. As you sweep in sorted `x`-order, a point inserts `+1` at `rank(y)` into a Fenwick Tree, and a query reads `bit.prefixSum(rank(qy))`!',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, q;
    if (!(cin >> n >> q)) return 0;

    struct Event {
        long long x, y;
        int type, qIdx; // type 0 = point, type 1 = query
        bool operator<(const Event& o) const {
            if (x != o.x) return x < o.x;
            return type < o.type; // points before queries on tie
        }
    };

    vector<Event> events;
    events.reserve(n + q);
    vector<long long> ys;
    ys.reserve(n + q);

    for (int i = 0; i < n; i++) {
        long long x, y;
        cin >> x >> y;
        events.push_back({x, y, 0, -1});
        ys.push_back(y);
    }
    for (int i = 0; i < q; i++) {
        long long x, y;
        cin >> x >> y;
        events.push_back({x, y, 1, i});
        ys.push_back(y);
    }

    sort(ys.begin(), ys.end());
    ys.erase(unique(ys.begin(), ys.end()), ys.end());
    int m = (int)ys.size();
    sort(events.begin(), events.end());

    vector<int> bit(m + 1, 0), ans(q, 0);
    auto add = [&](int i, int d) { for (; i <= m; i += i & -i) bit[i] += d; };
    auto pref = [&](int i) { int s = 0; for (; i > 0; i -= i & -i) s += bit[i]; return s; };

    for (const auto& ev : events) {
        int cy = (int)(lower_bound(ys.begin(), ys.end(), ev.y) - ys.begin()) + 1;
        if (ev.type == 0) add(cy, 1);
        else ans[ev.qIdx] = pref(cy);
    }

    for (int x : ans) cout << x << "\\n";
    return 0;
}`,
        rust: `use std::io::{self, Read};

fn add(bit: &mut [i32], mut i: usize, d: i32) {
    while i < bit.len() {
        bit[i] += d;
        i += i & i.wrapping_neg();
    }
}

fn pref(bit: &[i32], mut i: usize) -> i32 {
    let mut s = 0;
    while i > 0 {
        s += bit[i];
        i -= i & i.wrapping_neg();
    }
    s
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let n: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };
    let q: usize = it.next().unwrap().parse().unwrap();

    let mut events = Vec::with_capacity(n + q);
    let mut ys = Vec::with_capacity(n + q);
    for _ in 0..n {
        let x: i64 = it.next().unwrap().parse().unwrap();
        let y: i64 = it.next().unwrap().parse().unwrap();
        events.push((x, 0usize, y, 0usize));
        ys.push(y);
    }
    for qi in 0..q {
        let x: i64 = it.next().unwrap().parse().unwrap();
        let y: i64 = it.next().unwrap().parse().unwrap();
        events.push((x, 1usize, y, qi));
        ys.push(y);
    }

    ys.sort_unstable();
    ys.dedup();
    events.sort_unstable_by_key(|e| (e.0, e.1));

    let mut bit = vec![0i32; ys.len() + 1];
    let mut ans = vec![0i32; q];
    for (_, typ, y, qi) in events {
        let cy = ys.binary_search(&y).unwrap() + 1;
        if typ == 0 {
            add(&mut bit, cy, 1);
        } else {
            ans[qi] = pref(&bit, cy);
        }
    }

    let mut out = String::new();
    for v in ans {
        out.push_str(&format!("{}\\n", v));
    }
    print!("{}", out);
}`,
        java21: `import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;

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
            long sign = 1;
            if (c == '-') { sign = -1; c = readByte(); }
            long res = 0;
            while (c > ' ') { res = res * 10 + (c - '0'); c = readByte(); }
            return res * sign;
        }
    }

    static int[] bit;
    static int m;
    static void add(int i, int d) { for (; i <= m; i += i & -i) bit[i] += d; }
    static int pref(int i) { int s = 0; for (; i > 0; i -= i & -i) s += bit[i]; return s; }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        long nIn = fs.nextLong();
        if (nIn == Long.MIN_VALUE) return;
        int n = (int) nIn, q = (int) fs.nextLong();

        long[][] ev = new long[n + q][4];
        long[] ys = new long[n + q];
        for (int i = 0; i < n; i++) {
            ev[i][0] = fs.nextLong();
            ev[i][1] = fs.nextLong();
            ev[i][2] = 0;
            ev[i][3] = -1;
            ys[i] = ev[i][1];
        }
        for (int i = 0; i < q; i++) {
            ev[n + i][0] = fs.nextLong();
            ev[n + i][1] = fs.nextLong();
            ev[n + i][2] = 1;
            ev[n + i][3] = i;
            ys[n + i] = ev[n + i][1];
        }

        Arrays.sort(ys);
        m = 0;
        for (int i = 0; i < ys.length; i++) if (i == 0 || ys[i] != ys[i - 1]) ys[m++] = ys[i];

        Arrays.sort(ev, (a, b) -> a[0] != b[0] ? Long.compare(a[0], b[0]) : Long.compare(a[2], b[2]));

        bit = new int[m + 1];
        int[] ans = new int[q];
        for (long[] e : ev) {
            int cy = Arrays.binarySearch(ys, 0, m, e[1]) + 1;
            if (e[2] == 0) add(cy, 1);
            else ans[(int) e[3]] = pref(cy);
        }

        StringBuilder sb = new StringBuilder();
        for (int x : ans) sb.append(x).append('\\n');
        System.out.print(sb);
    }
}`,
        python3: `import bisect
import sys

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    n = int(next(it))
    q = int(next(it))

    events = []
    ys = []
    for _ in range(n):
        x = int(next(it))
        y = int(next(it))
        events.append((x, 0, y, -1))
        ys.append(y)
    for qi in range(q):
        x = int(next(it))
        y = int(next(it))
        events.append((x, 1, y, qi))
        ys.append(y)

    ys = sorted(set(ys))
    m = len(ys)
    events.sort(key=lambda e: (e[0], e[1]))

    bit = [0] * (m + 1)
    def add(i: int, d: int) -> None:
        while i <= m:
            bit[i] += d
            i += i & -i

    def pref(i: int) -> int:
        s = 0
        while i > 0:
            s += bit[i]
            i -= i & -i
        return s

    ans = [0] * q
    for _, typ, y, qi in events:
        cy = bisect.bisect_left(ys, y) + 1
        if typ == 0:
            add(cy, 1)
        else:
            ans[qi] = pref(cy)

    sys.stdout.write("\\n".join(map(str, ans)) + "\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
idx = 0
n = tokens[idx].to_i; idx += 1
q = tokens[idx].to_i; idx += 1

events = []
ys = []
n.times do
  x = tokens[idx].to_i; y = tokens[idx + 1].to_i; idx += 2
  events << [x, 0, y, -1]
  ys << y
end
q.times do |qi|
  x = tokens[idx].to_i; y = tokens[idx + 1].to_i; idx += 2
  events << [x, 1, y, qi]
  ys << y
end

ys = ys.uniq.sort
m = ys.length
events.sort_by! { |e| [e[0], e[1]] }

bit = Array.new(m + 1, 0)
add = lambda do |i, d|
  while i <= m
    bit[i] += d
    i += i & -i
  end
end
pref = lambda do |i|
  s = 0
  while i > 0
    s += bit[i]
    i -= i & -i
  end
  s
end

ans = Array.new(q, 0)
events.each do |_, typ, y, qi|
  cy = ys.bsearch_index { |c| c >= y } + 1
  if typ == 0
    add.call(cy, 1)
  else
    ans[qi] = pref.call(cy)
  end
end
puts ans.join("\\n")`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'CSES',
      title: 'Restaurant Customers / Salary Queries',
      difficulty: 'Silver–Gold (1350)',
      url: 'https://cses.fi/problemset/task/1619',
      patternNote: 'Prototypical (+1/-1) event sweep and offline coordinate-compressed Fenwick tree.',
    },
    {
      platform: 'AtCoder',
      title: 'ABC213 C — Reorder Cards',
      difficulty: '1000',
      url: 'https://atcoder.jp/contests/abc213/tasks/abc213_c',
      patternNote: 'Independent 1D row and column coordinate compression on a 10^9 x 10^9 grid.',
    },
    {
      platform: 'Codeforces',
      title: 'Nested Segments (652E / 652D)',
      difficulty: '1800',
      url: 'https://codeforces.com/problemset/problem/652/D',
      patternNote: 'Sort segments by r ascending + compressed left-endpoint Fenwick query in O(N log N).',
    },
    {
      platform: 'CodeChef',
      title: 'Counting Inversions Revisited',
      difficulty: '1500',
      url: 'https://www.codechef.com/problems/INVCNT',
      patternNote: 'Compress values up to 10^9 into [1..N] ranks before computing inversions via BIT.',
    },
    {
      platform: 'HackerRank',
      title: 'Maximum Subarray Sum / Interval Selection',
      difficulty: 'Medium',
      url: 'https://www.hackerrank.com/challenges',
      patternNote: 'Use sorted coordinate sets and event sweep lines to compress continuous real/integer bounds.',
    },
    {
      platform: 'NeetCode 150',
      title: 'Meeting Rooms II',
      difficulty: 'Medium',
      url: 'https://neetcode.io/practice/meeting-schedule-ii',
      patternNote: 'Minimum conference rooms equals maximum overlapping intervals via sorted (+1/-1) timestamps.',
    },
  ],
  interviewNotes: [
    'Coordinate compression is strictly **order-preserving**: it keeps `<`, `==`, and `>` relationships intact while discarding metric gaps (`10^9 - 10^8` collapses to adjacent integer ranks `k` and `k+1`).',
    'Never forget offline tie-breaking: when sweeping intervals `[L, R]` or 2D dominance queries `(x, y)`, explicitly decide whether `point` updates go BEFORE `query` reads (`x == qx`) and whether `+1` goes BEFORE `-1`.',
    'Offline event sorting often replaces an entire outer Segment Tree dimension: sorting by `x` eliminates one full coordinate dimension before you even touch a 1D Fenwick Tree on `y`.',
  ],
  projectBlueprint: {
    title: 'High-Resolution Financial Tick & Event Timeline Indexer',
    tagline:
      'TypeScript time-series engine converting sparse nanosecond market timestamps into dense rank arrays for sub-millisecond order-book concurrency peaks and price-band histograms.',
    stackSummary: 'TypeScript / Node.js with Float64Array Rank Dictionaries & Fenwick Counters',
    asciiDiagram: `[Raw Nanosecond Ticks (10^18)] -> [Sort & Dedup O(N log N)] -> [Dense Rank Map 0..M-1]
                                                                       |
         +-------------------------------------------------------------+
         v                                                             v
[Concurrency Peak Sweep (+1/-1)]                        [Price-Band Fenwick Range Counter]`,
    milestones: [
      {
        id: 'm1',
        title: 'Sparse Timestamp & Price Compressor',
        detail: 'Deduplicate arbitrary 64-bit numbers into contiguous [0..M-1] indices with O(log M) binary lookup.',
      },
      {
        id: 'm2',
        title: 'Session Concurrency Sweep',
        detail: 'Compute peak active orders and total overlapping window durations in O(N log N).',
      },
      {
        id: 'm3',
        title: 'Dynamic Price-Band Fenwick Tree',
        detail: 'Maintain live order frequency counts across arbitrary compressed price intervals [a, b].',
      },
    ],
    starterCode: `export class TimelineIndexer {
  private coords: number[];
  private bit: Int32Array;

  constructor(initialValues: number[]) {
    this.coords = Array.from(new Set(initialValues)).sort((a, b) => a - b);
    this.bit = new Int32Array(this.coords.length + 1);
  }

  public rank1(val: number): number {
    let lo = 0, hi = this.coords.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (this.coords[mid] < val) lo = mid + 1;
      else hi = mid;
    }
    return lo + 1;
  }

  public add(val: number, delta: number): void {
    for (let i = this.rank1(val); i < this.bit.length; i += i & -i) {
      this.bit[i] += delta;
    }
  }

  public rangeCount(loVal: number, hiVal: number): number {
    const l = this.rank1(loVal) - 1;
    const r = this.rank1(hiVal);
    return this.prefix(r) - this.prefix(l);
  }

  private prefix(i: number): number {
    let s = 0;
    for (; i > 0; i -= i & -i) s += this.bit[i];
    return s;
  }
}

const indexer = new TimelineIndexer([1000000, 250000, 750000, 500000]);
indexer.add(250000, 1);
indexer.add(750000, 1);
console.log('Active in [250k..750k]:', indexer.rangeCount(250000, 750000));`,
  },
};
