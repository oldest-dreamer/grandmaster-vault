import type { TheoryChapter } from '../../types/vault';

export const CH53_SWEEP_LINE_CLOSEST_PAIR: TheoryChapter = {
  slug: 'line-sweep-closest-pair-delaunay',
  topicId: 'sg-70',
  title: 'Sweep Line (Union of Rectangles) & Closest Pair of Points',
  domain: 'Strings & Geometry',
  ratingTier: '1900–2200',
  usacoDivision: 'Platinum',
  subtitle:
    'Compute the exact area of N overlapping axis-aligned rectangles in O(N log N) using vertical event sweeps over a lazy-free cover-count Segment Tree, and find the closest pair among N 2D points via divide-and-conquer strip pruning in O(N log N).',
  analogyTitle: 'The Sliding Vertical Scanner & The 7-Point Strip Box Analogy',
  analogyBody:
    'Imagine projecting a vertical laser line across a blueprint of overlapping rectangles from left to right. Between any two consecutive critical x-coordinates `x_prev` and `x_cur`, the active vertical slice never changes shape—its exact area is simply **`(x_cur - x_prev) * active_covered_Y_length`**! By maintaining a **coordinate-compressed Segment Tree** over elementary y-intervals `[ys[i], ys[i+1]]` that tracks `coverCount[node]` and `coveredLen[node]`, adding `+1` at `x1` and `-1` at `x2` updates the active vertical span in `O(log N)` WITHOUT even pushing lazy tags! For **Closest Pair of Points**, sort all points by `x` and split in half: once both halves know their minimum squared distance `d`, any cross-boundary closer pair must lie inside a narrow vertical strip of width `2 * sqrt(d)`. Partitioning that strip into `sqrt(d)/2 x sqrt(d)/2` boxes proves by the Pigeonhole Principle that each point only ever needs to check **at most 7 subsequent neighbors** sorted by `y`!',
  prerequisites: [
    {
      slug: 'segment-tree-point-range',
      title: 'Iterative & Recursive Segment Trees',
    },
    {
      slug: '2d-vectors-cross-product-orientation',
      title: '2D Vectors, Cross Product, Segment Intersection & Polygon Area',
    },
  ],
  traceTitle: 'Interactive Rectangle Union Sweep & Closest-Pair Strip Trace',
  traceSubtitle:
    'Sweep three rectangles `[1,3,4,5]`, `[3,1,7,4]`, `[5,3,8,6]` across compressed elementary y-intervals `{[1,3], [3,4], [4,5], [5,6]}` to accumulate exact union area = 24.',
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Step 1: Compress Y-Coordinates Into Elementary Intervals & Emit X-Events',
      explanation:
        'Unique sorted y-coordinates are ys = [1, 3, 4, 5, 6], forming 4 elementary intervals: I0=[1,3] (len 2), I1=[3,4] (len 1), I2=[4,5] (len 1), I3=[5,6] (len 1). Each rectangle emits (+1 at x1, -1 at x2) covering its compressed y-interval range.',
      mode: 'array',
      arrays: [
        {
          name: 'Elementary Y-Interval Coverage Counts at x = 1',
          cells: [
            { index: 0, value: 'cnt=0', label: '[1,3] len=2', highlight: 'neutral' },
            { index: 1, value: 'cnt=1', label: '[3,4] len=1', highlight: 'active' },
            { index: 2, value: 'cnt=1', label: '[4,5] len=1', highlight: 'active' },
            { index: 3, value: 'cnt=0', label: '[5,6] len=1', highlight: 'neutral' },
          ],
        },
      ],
      variables: { SweepX: 1, ActiveYLen: 2, AccumulatedArea: 0 },
    },
    {
      stepNumber: 2,
      title: 'Step 2: Advance Sweep to x = 3 (+2 * 2 = 4) and Activate R2 [1, 4]',
      explanation:
        'Moving from x=1 to x=3 sweeps dx = 2 with activeLen = 2, adding area = 4. At x=3, R2 enters covering I0=[1,3] and I1=[3,4]. Notice I1 now has cnt = 2 (covered by both R1 and R2), so its contribution stays len=1 (not 2!), bringing total activeYLen to 2 + 1 + 1 = 4.',
      mode: 'array',
      arrays: [
        {
          name: 'Elementary Y-Interval Coverage Counts at x = 3',
          cells: [
            { index: 0, value: 'cnt=1', label: '[1,3] len=2', highlight: 'updated' },
            { index: 1, value: 'cnt=2', label: '[3,4] len=1', highlight: 'active' },
            { index: 2, value: 'cnt=1', label: '[4,5] len=1', highlight: 'active' },
            { index: 3, value: 'cnt=0', label: '[5,6] len=1', highlight: 'neutral' },
          ],
        },
      ],
      variables: { SweepX: 3, AddedArea: 4, AccumulatedArea: 4, ActiveYLen: 4 },
    },
    {
      stepNumber: 3,
      title: 'Step 3: Finish Sweep Through x = 4, 5, 7, 8 to Reach Total Area = 24',
      explanation:
        'x=3->4 adds 1*4=4 (area=8), R1 exits leaving I2=0 (active=3). x=4->5 adds 1*3=3 (area=11), R3 enters activating I1,I2,I3 (active=5). x=5->7 adds 2*5=10 (area=21), R2 exits leaving I0=0 (active=3). x=7->8 adds 1*3=3 -> Final Area = 24!',
      mode: 'array',
      arrays: [
        {
          name: 'Sweep Slice Contributions Across X',
          cells: [
            { index: 0, value: '[1,3]: 2*2=4', highlight: 'window' },
            { index: 1, value: '[3,4]: 1*4=4', highlight: 'window' },
            { index: 2, value: '[4,5]: 1*3=3', highlight: 'window' },
            { index: 3, value: '[5,7]: 2*5=10', highlight: 'updated' },
            { index: 4, value: '[7,8]: 1*3=3', highlight: 'active' },
          ],
        },
      ],
      variables: { FinalArea: 24, TotalEvents: 6, TimeComplexity: 'O(N log N)' },
    },
  ],
  reductionClues: [
    {
      clue: '"Compute total area (or perimeter) of union of N <= 10^5 rectangles with coordinates up to 10^9"',
      translation:
        '**Sweep Line along X + Coordinate-Compressed Y Segment Tree**: discretize `y` into `M - 1` elementary intervals `[ys[i], ys[i+1]]` and track `coverCnt` + `coveredLen` on each node!',
    },
    {
      clue: '"Find a point (x, y) covered by the maximum number of rectangles / find max depth"',
      translation:
        '**Sweep Line + Lazy Range-Add / Range-Max Segment Tree**: emit `(x1, +1, y1, y2)` BEFORE `(x2, -1, y1, y2)` on equal `x` (for closed intervals) and query `tree[1]` after processing additions!',
    },
    {
      clue: '"Find closest pair of N <= 2 * 10^5 2D points (or minimum Euclidean / Manhattan distance)"',
      translation:
        '**Divide & Conquer Strip Pruning (or X-Sweep with Y-Ordered Active Set)**: sort by `x`, merge-sort by `y` on recursion return, and scan only the next `<= 7` points within `|dy|^2 < bestD2`!',
    },
    {
      clue: '"Count intersections among horizontal and vertical line segments"',
      translation:
        '**Sweep Line + Fenwick Tree (BIT)**: insert horizontal segment `y` at `x1`, remove at `x2`, and on vertical segment `(x, y1, y2)` query BIT prefix sum `[y1..y2]` in `O(log N)`!',
    },
  ],
  timeComplexity: 'O(N log N) for both Sweep-Line Union & Closest Pair',
  spaceComplexity: 'O(N)',
  pitfalls: [
    {
      type: 'WA',
      title: 'Indexing Segment Tree Over Compressed Points Instead of Elementary Intervals',
      detail:
        'A point array `ys` of length `M` defines **`M - 1` elementary intervals** `i` covering `[ys[i], ys[i+1]]`. A rectangle `[y1, y2]` updates the segment range **`[idx(y1), idx(y2) - 1]`**, and a covered leaf `l == r` adds `ys[r + 1] - ys[l]` (NEVER `0`!).',
    },
    {
      type: 'WA',
      title: 'Floating-Point Precision Loss in Closest Pair Distance Comparisons',
      detail:
        'Using `sqrt()` and `double` introduces precision loss when coordinates reach `10^9` (`dist^2` up to `8 * 10^{18}`, exceeding 53-bit `double` mantissa!). Keep ALL comparisons in **64-bit integer squared distance** `dx * dx + dy * dy`, taking `sqrt()` ONLY if an output explicitly requires decimal format!',
    },
    {
      type: 'TLE',
      title: 'Re-Sorting the Closest-Pair Strip by Y Inside Every Recursion Call',
      detail:
        'Calling `sort(strip)` inside each D&C call adds an extra `log N` factor -> `O(N log^2 N)`! Instead, merge-sort `[l, r)` by `y` on the way UP from the recursion (or pass a pre-sorted `py` list partitioned in `O(N)` per level) to keep strict **`O(N log N)`**!',
    },
    {
      type: 'WA',
      title: 'Wrong Event Tie-Breaking Order on Closed vs Half-Open Intervals',
      detail:
        'For union area, event order at equal `x` does not change `dx = 0`, though grouping equal `x` is clean. For **Maximum Overlap Depth** on closed rectangles `[x1, x2]`, you MUST process `+1` (enter) events **BEFORE** `-1` (exit) events at the same `x`, otherwise a point shared on the boundary misses the overlap!',
    },
  ],
  implementations: {
    cpp20: `#include <bits/stdc++.h>
using namespace std;

// Vertical Sweep Line + Cover-Count Segment Tree for Union Area of Rectangles in O(N log N)
struct Event {
    long long x;
    int y1, y2, delta;
    bool operator<(const Event& other) const {
        return x < other.x;
    }
};

struct CoverSegTree {
    int n;
    vector<int> cnt;
    vector<long long> len;
    vector<long long> ys;

    CoverSegTree(const vector<long long>& coords) : ys(coords) {
        n = (int)ys.size() - 1; // number of elementary intervals [ys[i], ys[i+1]]
        cnt.assign(4 * max(1, n), 0);
        len.assign(4 * max(1, n), 0);
    }

    void pull(int node, int l, int r) {
        if (cnt[node] > 0) {
            len[node] = ys[r + 1] - ys[l];
        } else if (l == r) {
            len[node] = 0;
        } else {
            len[node] = len[node * 2] + len[node * 2 + 1];
        }
    }

    void update(int node, int l, int r, int ql, int qr, int delta) {
        if (ql > r || qr < l) return;
        if (ql <= l && r <= qr) {
            cnt[node] += delta;
            pull(node, l, r);
            return;
        }
        int mid = (l + r) >> 1;
        update(node * 2, l, mid, ql, qr, delta);
        update(node * 2 + 1, mid + 1, r, ql, qr, delta);
        pull(node, l, r);
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    if (!(cin >> n)) return 0;

    struct Rect { long long x1, y1, x2, y2; };
    vector<Rect> rects;
    vector<long long> ys;
    rects.reserve(n);
    ys.reserve(2 * n);

    for (int i = 0; i < n; i++) {
        long long x1, y1, x2, y2;
        cin >> x1 >> y1 >> x2 >> y2;
        if (x1 == x2 || y1 == y2) continue;
        if (x1 > x2) swap(x1, x2);
        if (y1 > y2) swap(y1, y2);
        rects.push_back({x1, y1, x2, y2});
        ys.push_back(y1);
        ys.push_back(y2);
    }

    if (rects.empty()) {
        cout << 0 << "\\n";
        return 0;
    }

    sort(ys.begin(), ys.end());
    ys.erase(unique(ys.begin(), ys.end()), ys.end());

    vector<Event> events;
    events.reserve(2 * rects.size());
    for (const auto& rc : rects) {
        int id1 = (int)(lower_bound(ys.begin(), ys.end(), rc.y1) - ys.begin());
        int id2 = (int)(lower_bound(ys.begin(), ys.end(), rc.y2) - ys.begin());
        events.push_back({rc.x1, id1, id2 - 1, 1});
        events.push_back({rc.x2, id1, id2 - 1, -1});
    }
    sort(events.begin(), events.end());

    CoverSegTree seg(ys);
    long long area = 0;
    long long prevX = events[0].x;
    for (const auto& ev : events) {
        area += (ev.x - prevX) * seg.len[1];
        seg.update(1, 0, seg.n - 1, ev.y1, ev.y2, ev.delta);
        prevX = ev.x;
    }

    cout << area << "\\n";
    return 0;
}`,
    rust: `use std::io::{self, Read};

struct Event {
    x: i64,
    y1: usize,
    y2: usize,
    delta: i32,
}

struct CoverSegTree {
    n: usize,
    cnt: Vec<i32>,
    len: Vec<i64>,
    ys: Vec<i64>,
}

impl CoverSegTree {
    fn new(ys: Vec<i64>) -> Self {
        let n = ys.len() - 1;
        Self {
            n,
            cnt: vec![0; 4 * n.max(1)],
            len: vec![0; 4 * n.max(1)],
            ys,
        }
    }

    fn pull(&mut self, node: usize, l: usize, r: usize) {
        if self.cnt[node] > 0 {
            self.len[node] = self.ys[r + 1] - self.ys[l];
        } else if l == r {
            self.len[node] = 0;
        } else {
            self.len[node] = self.len[node * 2] + self.len[node * 2 + 1];
        }
    }

    fn update(&mut self, node: usize, l: usize, r: usize, ql: usize, qr: usize, delta: i32) {
        if ql > r || qr < l {
            return;
        }
        if ql <= l && r <= qr {
            self.cnt[node] += delta;
            self.pull(node, l, r);
            return;
        }
        let mid = (l + r) >> 1;
        if ql <= mid {
            self.update(node * 2, l, mid, ql, qr, delta);
        }
        if qr > mid {
            self.update(node * 2 + 1, mid + 1, r, ql, qr, delta);
        }
        self.pull(node, l, r);
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

    let mut rects = Vec::with_capacity(n);
    let mut ys = Vec::with_capacity(2 * n);
    for _ in 0..n {
        let mut x1: i64 = it.next().unwrap().parse().unwrap();
        let mut y1: i64 = it.next().unwrap().parse().unwrap();
        let mut x2: i64 = it.next().unwrap().parse().unwrap();
        let mut y2: i64 = it.next().unwrap().parse().unwrap();
        if x1 == x2 || y1 == y2 {
            continue;
        }
        if x1 > x2 { std::mem::swap(&mut x1, &mut x2); }
        if y1 > y2 { std::mem::swap(&mut y1, &mut y2); }
        rects.push((x1, y1, x2, y2));
        ys.push(y1);
        ys.push(y2);
    }

    if rects.is_empty() {
        println!("0");
        return;
    }

    ys.sort_unstable();
    ys.dedup();

    let mut events = Vec::with_capacity(2 * rects.len());
    for (x1, y1, x2, y2) in rects {
        let id1 = ys.binary_search(&y1).unwrap();
        let id2 = ys.binary_search(&y2).unwrap();
        events.push(Event { x: x1, y1: id1, y2: id2 - 1, delta: 1 });
        events.push(Event { x: x2, y1: id1, y2: id2 - 1, delta: -1 });
    }
    events.sort_unstable_by_key(|e| e.x);

    let mut seg = CoverSegTree::new(ys);
    let mut area: i64 = 0;
    let mut prev_x = events[0].x;
    for ev in &events {
        area += (ev.x - prev_x) * seg.len[1];
        seg.update(1, 0, seg.n - 1, ev.y1, ev.y2, ev.delta);
        prev_x = ev.x;
    }

    println!("{}", area);
}`,
    java21: `import java.io.*;
import java.util.*;

public class Main {
    static class FastScanner {
        private final InputStream in;
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;

        FastScanner(InputStream is) { this.in = is; }

        private int readByte() throws IOException {
            if (ptr >= len) {
                ptr = 0;
                len = in.read(buf);
                if (len <= 0) return -1;
            }
            return buf[ptr++];
        }

        long nextLong() throws IOException {
            int c;
            do {
                c = readByte();
                if (c == -1) return Long.MIN_VALUE;
            } while (c <= ' ');
            long sign = 1;
            if (c == '-') { sign = -1; c = readByte(); }
            long res = 0;
            while (c > ' ') {
                res = res * 10 + (c - '0');
                c = readByte();
            }
            return res * sign;
        }
    }

    static class Event implements Comparable<Event> {
        long x;
        int y1, y2, delta;
        Event(long x, int y1, int y2, int delta) {
            this.x = x; this.y1 = y1; this.y2 = y2; this.delta = delta;
        }
        public int compareTo(Event o) { return Long.compare(this.x, o.x); }
    }

    static int[] cnt;
    static long[] segLen;
    static long[] ys;
    static int m;

    static void pull(int node, int l, int r) {
        if (cnt[node] > 0) {
            segLen[node] = ys[r + 1] - ys[l];
        } else if (l == r) {
            segLen[node] = 0;
        } else {
            segLen[node] = segLen[node * 2] + segLen[node * 2 + 1];
        }
    }

    static void update(int node, int l, int r, int ql, int qr, int delta) {
        if (ql > r || qr < l) return;
        if (ql <= l && r <= qr) {
            cnt[node] += delta;
            pull(node, l, r);
            return;
        }
        int mid = (l + r) >>> 1;
        if (ql <= mid) update(node * 2, l, mid, ql, qr, delta);
        if (qr > mid) update(node * 2 + 1, mid + 1, r, ql, qr, delta);
        pull(node, l, r);
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        long nLong = fs.nextLong();
        if (nLong == Long.MIN_VALUE) return;
        int n = (int) nLong;

        long[][] rects = new long[n][4];
        long[] rawY = new long[2 * n];
        int rCnt = 0, yCnt = 0;
        for (int i = 0; i < n; i++) {
            long x1 = fs.nextLong(), y1 = fs.nextLong(), x2 = fs.nextLong(), y2 = fs.nextLong();
            if (x1 == x2 || y1 == y2) continue;
            if (x1 > x2) { long t = x1; x1 = x2; x2 = t; }
            if (y1 > y2) { long t = y1; y1 = y2; y2 = t; }
            rects[rCnt][0] = x1; rects[rCnt][1] = y1;
            rects[rCnt][2] = x2; rects[rCnt][3] = y2;
            rCnt++;
            rawY[yCnt++] = y1;
            rawY[yCnt++] = y2;
        }

        if (rCnt == 0) {
            System.out.println(0);
            return;
        }

        Arrays.sort(rawY, 0, yCnt);
        int uniq = 0;
        for (int i = 0; i < yCnt; i++) {
            if (i == 0 || rawY[i] != rawY[i - 1]) rawY[uniq++] = rawY[i];
        }
        ys = Arrays.copyOf(rawY, uniq);
        m = uniq - 1;
        cnt = new int[4 * m];
        segLen = new long[4 * m];

        Event[] events = new Event[2 * rCnt];
        for (int i = 0; i < rCnt; i++) {
            int id1 = Arrays.binarySearch(ys, rects[i][1]);
            int id2 = Arrays.binarySearch(ys, rects[i][3]);
            events[2 * i] = new Event(rects[i][0], id1, id2 - 1, 1);
            events[2 * i + 1] = new Event(rects[i][2], id1, id2 - 1, -1);
        }
        Arrays.sort(events);

        long area = 0;
        long prevX = events[0].x;
        for (Event ev : events) {
            area += (ev.x - prevX) * segLen[1];
            update(1, 0, m - 1, ev.y1, ev.y2, ev.delta);
            prevX = ev.x;
        }
        System.out.println(area);
    }
}`,
    python3: `import sys
from bisect import bisect_left

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    rects = []
    raw_y = []
    idx = 1
    for _ in range(n):
        x1 = int(data[idx]); y1 = int(data[idx + 1])
        x2 = int(data[idx + 2]); y2 = int(data[idx + 3])
        idx += 4
        if x1 == x2 or y1 == y2:
            continue
        if x1 > x2:
            x1, x2 = x2, x1
        if y1 > y2:
            y1, y2 = y2, y1
        rects.append((x1, y1, x2, y2))
        raw_y.append(y1)
        raw_y.append(y2)

    if not rects:
        sys.stdout.write("0\\n")
        return

    ys = sorted(set(raw_y))
    m = len(ys) - 1
    cnt = [0] * (4 * m)
    seg_len = [0] * (4 * m)

    def pull(node: int, l: int, r: int) -> None:
        if cnt[node] > 0:
            seg_len[node] = ys[r + 1] - ys[l]
        elif l == r:
            seg_len[node] = 0
        else:
            seg_len[node] = seg_len[node * 2] + seg_len[node * 2 + 1]

    def update(node: int, l: int, r: int, ql: int, qr: int, delta: int) -> None:
        if ql <= l and r <= qr:
            cnt[node] += delta
            pull(node, l, r)
            return
        mid = (l + r) >> 1
        if ql <= mid:
            update(node * 2, l, mid, ql, qr, delta)
        if qr > mid:
            update(node * 2 + 1, mid + 1, r, ql, qr, delta)
        pull(node, l, r)

    events = []
    for x1, y1, x2, y2 in rects:
        id1 = bisect_left(ys, y1)
        id2 = bisect_left(ys, y2) - 1
        events.append((x1, id1, id2, 1))
        events.append((x2, id1, id2, -1))
    events.sort(key=lambda e: e[0])

    area = 0
    prev_x = events[0][0]
    for x, yl, yr, delta in events:
        area += (x - prev_x) * seg_len[1]
        update(1, 0, m - 1, yl, yr, delta)
        prev_x = x

    sys.stdout.write(f"{area}\\n")

if __name__ == "__main__":
    solve()`,
    ruby: `tokens = $stdin.read.split
exit if tokens.empty?
n = tokens[0].to_i

rects = []
raw_y = []
idx = 1
n.times do
  x1 = tokens[idx].to_i; y1 = tokens[idx + 1].to_i
  x2 = tokens[idx + 2].to_i; y2 = tokens[idx + 3].to_i
  idx += 4
  next if x1 == x2 || y1 == y2
  x1, x2 = x2, x1 if x1 > x2
  y1, y2 = y2, y1 if y1 > y2
  rects << [x1, y1, x2, y2]
  raw_y << y1 << y2
end

if rects.empty?
  puts 0
  exit
end

ys = raw_y.uniq.sort
m = ys.length - 1
cnt = Array.new(4 * m, 0)
seg_len = Array.new(4 * m, 0)

pull = lambda do |node, l, r|
  if cnt[node] > 0
    seg_len[node] = ys[r + 1] - ys[l]
  elsif l == r
    seg_len[node] = 0
  else
    seg_len[node] = seg_len[node * 2] + seg_len[node * 2 + 1]
  end
end

update = nil
update = lambda do |node, l, r, ql, qr, delta|
  if ql <= l && r <= qr
    cnt[node] += delta
    pull.call(node, l, r)
    return
  end
  mid = (l + r) >> 1
  update.call(node * 2, l, mid, ql, qr, delta) if ql <= mid
  update.call(node * 2 + 1, mid + 1, r, ql, qr, delta) if qr > mid
  pull.call(node, l, r)
end

events = []
rects.each do |x1, y1, x2, y2|
  id1 = ys.bsearch_index { |v| v >= y1 }
  id2 = ys.bsearch_index { |v| v >= y2 } - 1
  events << [x1, id1, id2, 1]
  events << [x2, id1, id2, -1]
end
events.sort_by! { |e| e[0] }

area = 0
prev_x = events[0][0]
events.each do |x, yl, yr, delta|
  area += (x - prev_x) * seg_len[1]
  update.call(1, 0, m - 1, yl, yr, delta)
  prev_x = x
end

puts area`,
  },
  practiceProblems: [
    {
      id: 'ch53-p1',
      tier: 'Warmup',
      ratingRange: '1800–2000',
      title: 'Minimum Euclidean Distance (Closest Pair of Points)',
      statement:
        'Given N points in the 2D plane (2 <= N <= 200,000, coordinates |x|, |y| <= 10^9), compute the minimum squared Euclidean distance `(x_i - x_j)^2 + (y_i - y_j)^2` between two distinct points `i != j`. Print the exact integer squared distance (no square root rounding!). Input starts with N followed by N lines of x_i y_i.',
      constraints: '2 <= N <= 2 * 10^5, -10^9 <= x_i, y_i <= 10^9',
      sampleInput: `4
2 1
4 4
1 2
6 3`,
      sampleOutput: `2`,
      hints: [
        'Sort points by (x, y) and apply Divide & Conquer, returning subarrays already merge-sorted by y-coordinate.',
        'Collect strip points satisfying `(x - midX)^2 < bestD2`, then check at most 7 subsequent neighbors whose `(y_j - y_i)^2 < bestD2`.',
        'Keep all calculations in 64-bit integer squared distance to avoid floating-point precision loss at 10^9 coordinates.',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

struct Pt {
    long long x, y;
};

long long dist2(const Pt& a, const Pt& b) {
    long long dx = a.x - b.x;
    long long dy = a.y - b.y;
    return dx * dx + dy * dy;
}

long long solveDC(vector<Pt>& pts, vector<Pt>& tmp, int l, int r) {
    if (r - l <= 3) {
        long long best = LLONG_MAX;
        for (int i = l; i < r; i++) {
            for (int j = i + 1; j < r; j++) {
                best = min(best, dist2(pts[i], pts[j]));
            }
        }
        sort(pts.begin() + l, pts.begin() + r, [](const Pt& a, const Pt& b) {
            return a.y < b.y;
        });
        return best;
    }

    int mid = (l + r) >> 1;
    long long midX = pts[mid].x;
    long long d = min(solveDC(pts, tmp, l, mid), solveDC(pts, tmp, mid, r));

    merge(pts.begin() + l, pts.begin() + mid,
          pts.begin() + mid, pts.begin() + r,
          tmp.begin(),
          [](const Pt& a, const Pt& b) { return a.y < b.y; });
    copy(tmp.begin(), tmp.begin() + (r - l), pts.begin() + l);

    vector<Pt> strip;
    for (int i = l; i < r; i++) {
        long long dx = pts[i].x - midX;
        if (dx * dx < d) strip.push_back(pts[i]);
    }
    for (int i = 0; i < (int)strip.size(); i++) {
        for (int j = i + 1; j < (int)strip.size(); j++) {
            long long dy = strip[j].y - strip[i].y;
            if (dy * dy >= d) break;
            d = min(d, dist2(strip[i], strip[j]));
        }
    }
    return d;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    if (!(cin >> n)) return 0;
    vector<Pt> pts(n), tmp(n);
    for (int i = 0; i < n; i++) cin >> pts[i].x >> pts[i].y;
    sort(pts.begin(), pts.end(), [](const Pt& a, const Pt& b) {
        return a.x != b.x ? a.x < b.x : a.y < b.y;
    });
    cout << solveDC(pts, tmp, 0, n) << "\\n";
    return 0;
}`,
        rust: `use std::io::{self, Read};

#[derive(Clone, Copy)]
struct Pt {
    x: i64,
    y: i64,
}

#[inline]
fn dist2(a: Pt, b: Pt) -> i64 {
    let dx = a.x - b.x;
    let dy = a.y - b.y;
    dx * dx + dy * dy
}

fn solve_dc(pts: &mut [Pt], tmp: &mut [Pt], strip: &mut Vec<Pt>) -> i64 {
    let n = pts.len();
    if n <= 3 {
        let mut best = i64::MAX;
        for i in 0..n {
            for j in (i + 1)..n {
                best = best.min(dist2(pts[i], pts[j]));
            }
        }
        pts.sort_unstable_by_key(|p| p.y);
        return best;
    }

    let mid = n >> 1;
    let mid_x = pts[mid].x;
    let d1 = solve_dc(&mut pts[..mid], &mut tmp[..mid], strip);
    let d2 = solve_dc(&mut pts[mid..], &mut tmp[mid..], strip);
    let mut d = d1.min(d2);

    let (mut i, mut j, mut k) = (0, mid, 0);
    while i < mid && j < n {
        if pts[i].y <= pts[j].y {
            tmp[k] = pts[i];
            i += 1;
        } else {
            tmp[k] = pts[j];
            j += 1;
        }
        k += 1;
    }
    while i < mid { tmp[k] = pts[i]; i += 1; k += 1; }
    while j < n { tmp[k] = pts[j]; j += 1; k += 1; }
    pts.copy_from_slice(&tmp[..n]);

    strip.clear();
    for &p in pts.iter() {
        let dx = p.x - mid_x;
        if dx * dx < d {
            strip.push(p);
        }
    }
    for a in 0..strip.len() {
        for b in (a + 1)..strip.len() {
            let dy = strip[b].y - strip[a].y;
            if dy * dy >= d {
                break;
            }
            d = d.min(dist2(strip[a], strip[b]));
        }
    }
    d
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let n: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };

    let mut pts = Vec::with_capacity(n);
    for _ in 0..n {
        let x: i64 = it.next().unwrap().parse().unwrap();
        let y: i64 = it.next().unwrap().parse().unwrap();
        pts.push(Pt { x, y });
    }
    pts.sort_unstable_by(|a, b| a.x.cmp(&b.x).then(a.y.cmp(&b.y)));

    let mut tmp = vec![Pt { x: 0, y: 0 }; n];
    let mut strip = Vec::with_capacity(n);
    println!("{}", solve_dc(&mut pts, &mut tmp, &mut strip));
}`,
        java21: `import java.io.*;
import java.util.*;

public class Main {
    static class FastScanner {
        private final InputStream in;
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;

        FastScanner(InputStream is) { this.in = is; }

        private int readByte() throws IOException {
            if (ptr >= len) {
                ptr = 0;
                len = in.read(buf);
                if (len <= 0) return -1;
            }
            return buf[ptr++];
        }

        long nextLong() throws IOException {
            int c;
            do {
                c = readByte();
                if (c == -1) return Long.MIN_VALUE;
            } while (c <= ' ');
            long sign = 1;
            if (c == '-') { sign = -1; c = readByte(); }
            long res = 0;
            while (c > ' ') {
                res = res * 10 + (c - '0');
                c = readByte();
            }
            return res * sign;
        }
    }

    static long[] px, py, tx, ty, sx, sy;

    static long dist2(int i, int j) {
        long dx = px[i] - px[j];
        long dy = py[i] - py[j];
        return dx * dx + dy * dy;
    }

    static long solveDC(int l, int r) {
        if (r - l <= 3) {
            long best = Long.MAX_VALUE;
            for (int i = l; i < r; i++) {
                for (int j = i + 1; j < r; j++) {
                    best = Math.min(best, dist2(i, j));
                }
            }
            for (int i = l; i < r; i++) {
                for (int j = i + 1; j < r; j++) {
                    if (py[j] < py[i]) {
                        long vx = px[i]; px[i] = px[j]; px[j] = vx;
                        long vy = py[i]; py[i] = py[j]; py[j] = vy;
                    }
                }
            }
            return best;
        }

        int mid = (l + r) >>> 1;
        long midX = px[mid];
        long d = Math.min(solveDC(l, mid), solveDC(mid, r));

        int i = l, j = mid, k = 0;
        while (i < mid && j < r) {
            if (py[i] <= py[j]) {
                tx[k] = px[i]; ty[k] = py[i]; i++;
            } else {
                tx[k] = px[j]; ty[k] = py[j]; j++;
            }
            k++;
        }
        while (i < mid) { tx[k] = px[i]; ty[k] = py[i]; i++; k++; }
        while (j < r) { tx[k] = px[j]; ty[k] = py[j]; j++; k++; }
        System.arraycopy(tx, 0, px, l, r - l);
        System.arraycopy(ty, 0, py, l, r - l);

        int sLen = 0;
        for (int p = l; p < r; p++) {
            long dx = px[p] - midX;
            if (dx * dx < d) {
                sx[sLen] = px[p];
                sy[sLen] = py[p];
                sLen++;
            }
        }
        for (int a = 0; a < sLen; a++) {
            for (int b = a + 1; b < sLen; b++) {
                long dy = sy[b] - sy[a];
                if (dy * dy >= d) break;
                long dx = sx[b] - sx[a];
                long cur = dx * dx + dy * dy;
                if (cur < d) d = cur;
            }
        }
        return d;
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        long nLong = fs.nextLong();
        if (nLong == Long.MIN_VALUE) return;
        int n = (int) nLong;

        long[][] pts = new long[n][2];
        for (int i = 0; i < n; i++) {
            pts[i][0] = fs.nextLong();
            pts[i][1] = fs.nextLong();
        }
        Arrays.sort(pts, (a, b) -> a[0] != b[0] ? Long.compare(a[0], b[0]) : Long.compare(a[1], b[1]));

        px = new long[n]; py = new long[n];
        tx = new long[n]; ty = new long[n];
        sx = new long[n]; sy = new long[n];
        for (int i = 0; i < n; i++) {
            px[i] = pts[i][0];
            py[i] = pts[i][1];
        }

        System.out.println(solveDC(0, n));
    }
}`,
        python3: `import sys

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    pts = [(int(data[2 * i + 1]), int(data[2 * i + 2])) for i in range(n)]
    pts.sort()
    pts_y = sorted(pts, key=lambda p: p[1])

    def dc(px: list, py: list) -> int:
        m = len(px)
        if m <= 3:
            best = 1 << 63
            for i in range(m):
                xi, yi = px[i]
                for j in range(i + 1, m):
                    dx = xi - px[j][0]
                    dy = yi - px[j][1]
                    d2 = dx * dx + dy * dy
                    if d2 < best:
                        best = d2
            return best

        mid = m >> 1
        mid_pt = px[mid]
        lx = px[:mid]
        rx = px[mid:]
        ly = []
        ry = []
        for p in py:
            if p < mid_pt:
                ly.append(p)
            else:
                ry.append(p)

        d = dc(lx, ly)
        dr = dc(rx, ry)
        if dr < d:
            d = dr

        mid_x = mid_pt[0]
        strip = [p for p in py if (p[0] - mid_x) * (p[0] - mid_x) < d]
        k = len(strip)
        for i in range(k):
            xi, yi = strip[i]
            for j in range(i + 1, k):
                dy = strip[j][1] - yi
                if dy * dy >= d:
                    break
                dx = strip[j][0] - xi
                d2 = dx * dx + dy * dy
                if d2 < d:
                    d = d2
        return d

    sys.stdout.write(f"{dc(pts, pts_y)}\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
n = tokens[0].to_i

pts = Array.new(n) { |i| [tokens[2 * i + 1].to_i, tokens[2 * i + 2].to_i] }
pts.sort!
pts_y = pts.sort_by { |p| p[1] }

dc = nil
dc = lambda do |px, py|
  m = px.length
  if m <= 3
    best = 1 << 63
    (0...m).each do |i|
      xi, yi = px[i]
      ((i + 1)...m).each do |j|
        dx = xi - px[j][0]
        dy = yi - px[j][1]
        d2 = dx * dx + dy * dy
        best = d2 if d2 < best
      end
    end
    return best
  end

  mid = m >> 1
  mid_pt = px[mid]
  lx = px[0...mid]
  rx = px[mid...m]
  ly = []
  ry = []
  py.each do |p|
    if (p <=> mid_pt) < 0
      ly << p
    else
      ry << p
    end
  end

  d = dc.call(lx, ly)
  dr = dc.call(rx, ry)
  d = dr if dr < d

  mid_x = mid_pt[0]
  strip = py.select { |p| (p[0] - mid_x) * (p[0] - mid_x) < d }
  k = strip.length
  (0...k).each do |i|
    xi, yi = strip[i]
    ((i + 1)...k).each do |j|
      dy = strip[j][1] - yi
      break if dy * dy >= d
      dx = strip[j][0] - xi
      d2 = dx * dx + dy * dy
      d = d2 if d2 < d
    end
  end
  d
end

puts dc.call(pts, pts_y)`,
      },
    },
    {
      id: 'ch53-p2',
      tier: 'Standard',
      ratingRange: '2000–2200',
      title: 'Area of Union of Rectangles',
      statement:
        'Given N axis-aligned rectangles `[x1, x2] x [y1, y2]` (`1 <= N <= 10^5`, coordinates `-10^9 <= x, y <= 10^9`), compute the exact total area of their union in `O(N log N)` time. Input starts with N followed by N lines of x1 y1 x2 y2.',
      constraints: '1 <= N <= 10^5, -10^9 <= x1 <= x2 <= 10^9, -10^9 <= y1 <= y2 <= 10^9',
      sampleInput: `3
1 3 4 5
3 1 7 4
5 3 8 6`,
      sampleOutput: `24`,
      hints: [
        'Compress unique y-coordinates into M - 1 elementary intervals `[ys[i], ys[i+1]]`.',
        'Track `coverCnt[node]` and `coveredLen[node]` in a Segment Tree; because every `+1` has a matching `-1` on identical nodes, lazy push is unnecessary.',
        'At node `[l, r]`, if `coverCnt[node] > 0` set `coveredLen[node] = ys[r + 1] - ys[l]`, else sum its children (or `0` at leaves).',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

struct Event {
    long long x;
    int y1, y2, delta;
    bool operator<(const Event& o) const { return x < o.x; }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    if (!(cin >> n)) return 0;

    struct Rect { long long x1, y1, x2, y2; };
    vector<Rect> rects;
    vector<long long> ys;
    rects.reserve(n);
    ys.reserve(2 * n);

    for (int i = 0; i < n; i++) {
        long long x1, y1, x2, y2;
        cin >> x1 >> y1 >> x2 >> y2;
        if (x1 == x2 || y1 == y2) continue;
        if (x1 > x2) swap(x1, x2);
        if (y1 > y2) swap(y1, y2);
        rects.push_back({x1, y1, x2, y2});
        ys.push_back(y1);
        ys.push_back(y2);
    }

    if (rects.empty()) {
        cout << 0 << "\\n";
        return 0;
    }

    sort(ys.begin(), ys.end());
    ys.erase(unique(ys.begin(), ys.end()), ys.end());
    int m = (int)ys.size() - 1;

    vector<int> cnt(4 * m, 0);
    vector<long long> len(4 * m, 0);

    auto pull = [&](int node, int l, int r) {
        if (cnt[node] > 0) len[node] = ys[r + 1] - ys[l];
        else if (l == r) len[node] = 0;
        else len[node] = len[node * 2] + len[node * 2 + 1];
    };

    auto update = [&](auto& self, int node, int l, int r, int ql, int qr, int d) -> void {
        if (ql <= l && r <= qr) {
            cnt[node] += d;
            pull(node, l, r);
            return;
        }
        int mid = (l + r) >> 1;
        if (ql <= mid) self(self, node * 2, l, mid, ql, qr, d);
        if (qr > mid) self(self, node * 2 + 1, mid + 1, r, ql, qr, d);
        pull(node, l, r);
    };

    vector<Event> events;
    events.reserve(2 * rects.size());
    for (const auto& rc : rects) {
        int id1 = (int)(lower_bound(ys.begin(), ys.end(), rc.y1) - ys.begin());
        int id2 = (int)(lower_bound(ys.begin(), ys.end(), rc.y2) - ys.begin()) - 1;
        events.push_back({rc.x1, id1, id2, 1});
        events.push_back({rc.x2, id1, id2, -1});
    }
    sort(events.begin(), events.end());

    long long area = 0, prevX = events[0].x;
    for (const auto& ev : events) {
        area += (ev.x - prevX) * len[1];
        update(update, 1, 0, m - 1, ev.y1, ev.y2, ev.delta);
        prevX = ev.x;
    }
    cout << area << "\\n";
    return 0;
}`,
        rust: `use std::io::{self, Read};

struct SegTree {
    m: usize,
    cnt: Vec<i32>,
    len: Vec<i64>,
    ys: Vec<i64>,
}

impl SegTree {
    fn new(ys: Vec<i64>) -> Self {
        let m = ys.len() - 1;
        Self { m, cnt: vec![0; 4 * m], len: vec![0; 4 * m], ys }
    }

    fn pull(&mut self, node: usize, l: usize, r: usize) {
        if self.cnt[node] > 0 {
            self.len[node] = self.ys[r + 1] - self.ys[l];
        } else if l == r {
            self.len[node] = 0;
        } else {
            self.len[node] = self.len[node * 2] + self.len[node * 2 + 1];
        }
    }

    fn update(&mut self, node: usize, l: usize, r: usize, ql: usize, qr: usize, d: i32) {
        if ql <= l && r <= qr {
            self.cnt[node] += d;
            self.pull(node, l, r);
            return;
        }
        let mid = (l + r) >> 1;
        if ql <= mid { self.update(node * 2, l, mid, ql, qr, d); }
        if qr > mid { self.update(node * 2 + 1, mid + 1, r, ql, qr, d); }
        self.pull(node, l, r);
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

    let mut rects = Vec::with_capacity(n);
    let mut ys = Vec::with_capacity(2 * n);
    for _ in 0..n {
        let mut x1: i64 = it.next().unwrap().parse().unwrap();
        let mut y1: i64 = it.next().unwrap().parse().unwrap();
        let mut x2: i64 = it.next().unwrap().parse().unwrap();
        let mut y2: i64 = it.next().unwrap().parse().unwrap();
        if x1 == x2 || y1 == y2 { continue; }
        if x1 > x2 { std::mem::swap(&mut x1, &mut x2); }
        if y1 > y2 { std::mem::swap(&mut y1, &mut y2); }
        rects.push((x1, y1, x2, y2));
        ys.push(y1);
        ys.push(y2);
    }
    if rects.is_empty() { println!("0"); return; }

    ys.sort_unstable();
    ys.dedup();
    let mut events = Vec::with_capacity(2 * rects.len());
    for (x1, y1, x2, y2) in rects {
        let id1 = ys.binary_search(&y1).unwrap();
        let id2 = ys.binary_search(&y2).unwrap() - 1;
        events.push((x1, id1, id2, 1i32));
        events.push((x2, id1, id2, -1i32));
    }
    events.sort_unstable_by_key(|e| e.0);

    let mut seg = SegTree::new(ys);
    let mut area: i64 = 0;
    let mut prev_x = events[0].0;
    for &(x, yl, yr, d) in &events {
        area += (x - prev_x) * seg.len[1];
        seg.update(1, 0, seg.m - 1, yl, yr, d);
        prev_x = x;
    }
    println!("{}", area);
}`,
        java21: `import java.io.*;
import java.util.*;

public class Main {
    static class FastScanner {
        private final InputStream in;
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;

        FastScanner(InputStream is) { this.in = is; }

        private int readByte() throws IOException {
            if (ptr >= len) {
                ptr = 0;
                len = in.read(buf);
                if (len <= 0) return -1;
            }
            return buf[ptr++];
        }

        long nextLong() throws IOException {
            int c;
            do {
                c = readByte();
                if (c == -1) return Long.MIN_VALUE;
            } while (c <= ' ');
            long sign = 1;
            if (c == '-') { sign = -1; c = readByte(); }
            long res = 0;
            while (c > ' ') {
                res = res * 10 + (c - '0');
                c = readByte();
            }
            return res * sign;
        }
    }

    static int[] cnt;
    static long[] segLen, ys;
    static int m;

    static void pull(int node, int l, int r) {
        if (cnt[node] > 0) segLen[node] = ys[r + 1] - ys[l];
        else if (l == r) segLen[node] = 0;
        else segLen[node] = segLen[node * 2] + segLen[node * 2 + 1];
    }

    static void update(int node, int l, int r, int ql, int qr, int d) {
        if (ql <= l && r <= qr) {
            cnt[node] += d;
            pull(node, l, r);
            return;
        }
        int mid = (l + r) >>> 1;
        if (ql <= mid) update(node * 2, l, mid, ql, qr, d);
        if (qr > mid) update(node * 2 + 1, mid + 1, r, ql, qr, d);
        pull(node, l, r);
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        long nLong = fs.nextLong();
        if (nLong == Long.MIN_VALUE) return;
        int n = (int) nLong;

        long[][] rects = new long[n][4];
        long[] rawY = new long[2 * n];
        int rCnt = 0, yCnt = 0;
        for (int i = 0; i < n; i++) {
            long x1 = fs.nextLong(), y1 = fs.nextLong(), x2 = fs.nextLong(), y2 = fs.nextLong();
            if (x1 == x2 || y1 == y2) continue;
            if (x1 > x2) { long t = x1; x1 = x2; x2 = t; }
            if (y1 > y2) { long t = y1; y1 = y2; y2 = t; }
            rects[rCnt][0] = x1; rects[rCnt][1] = y1;
            rects[rCnt][2] = x2; rects[rCnt][3] = y2;
            rCnt++;
            rawY[yCnt++] = y1;
            rawY[yCnt++] = y2;
        }
        if (rCnt == 0) { System.out.println(0); return; }

        Arrays.sort(rawY, 0, yCnt);
        int uniq = 0;
        for (int i = 0; i < yCnt; i++) {
            if (i == 0 || rawY[i] != rawY[i - 1]) rawY[uniq++] = rawY[i];
        }
        ys = Arrays.copyOf(rawY, uniq);
        m = uniq - 1;
        cnt = new int[4 * m];
        segLen = new long[4 * m];

        long[][] events = new long[2 * rCnt][4];
        for (int i = 0; i < rCnt; i++) {
            int id1 = Arrays.binarySearch(ys, rects[i][1]);
            int id2 = Arrays.binarySearch(ys, rects[i][3]) - 1;
            events[2 * i] = new long[]{rects[i][0], id1, id2, 1};
            events[2 * i + 1] = new long[]{rects[i][2], id1, id2, -1};
        }
        Arrays.sort(events, Comparator.comparingLong(e -> e[0]));

        long area = 0, prevX = events[0][0];
        for (long[] ev : events) {
            area += (ev[0] - prevX) * segLen[1];
            update(1, 0, m - 1, (int) ev[1], (int) ev[2], (int) ev[3]);
            prevX = ev[0];
        }
        System.out.println(area);
    }
}`,
        python3: `import sys
from bisect import bisect_left

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    rects = []
    raw_y = []
    idx = 1
    for _ in range(n):
        x1 = int(data[idx]); y1 = int(data[idx + 1])
        x2 = int(data[idx + 2]); y2 = int(data[idx + 3])
        idx += 4
        if x1 == x2 or y1 == y2:
            continue
        if x1 > x2:
            x1, x2 = x2, x1
        if y1 > y2:
            y1, y2 = y2, y1
        rects.append((x1, y1, x2, y2))
        raw_y.append(y1)
        raw_y.append(y2)

    if not rects:
        sys.stdout.write("0\\n")
        return

    ys = sorted(set(raw_y))
    m = len(ys) - 1
    cnt = [0] * (4 * m)
    seg_len = [0] * (4 * m)

    def pull(node: int, l: int, r: int) -> None:
        if cnt[node] > 0:
            seg_len[node] = ys[r + 1] - ys[l]
        elif l == r:
            seg_len[node] = 0
        else:
            seg_len[node] = seg_len[node * 2] + seg_len[node * 2 + 1]

    def update(node: int, l: int, r: int, ql: int, qr: int, delta: int) -> None:
        if ql <= l and r <= qr:
            cnt[node] += delta
            pull(node, l, r)
            return
        mid = (l + r) >> 1
        if ql <= mid:
            update(node * 2, l, mid, ql, qr, delta)
        if qr > mid:
            update(node * 2 + 1, mid + 1, r, ql, qr, delta)
        pull(node, l, r)

    events = []
    for x1, y1, x2, y2 in rects:
        id1 = bisect_left(ys, y1)
        id2 = bisect_left(ys, y2) - 1
        events.append((x1, id1, id2, 1))
        events.append((x2, id1, id2, -1))
    events.sort(key=lambda e: e[0])

    area = 0
    prev_x = events[0][0]
    for x, yl, yr, delta in events:
        area += (x - prev_x) * seg_len[1]
        update(1, 0, m - 1, yl, yr, delta)
        prev_x = x
    sys.stdout.write(f"{area}\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
n = tokens[0].to_i

rects = []
raw_y = []
idx = 1
n.times do
  x1 = tokens[idx].to_i; y1 = tokens[idx + 1].to_i
  x2 = tokens[idx + 2].to_i; y2 = tokens[idx + 3].to_i
  idx += 4
  next if x1 == x2 || y1 == y2
  x1, x2 = x2, x1 if x1 > x2
  y1, y2 = y2, y1 if y1 > y2
  rects << [x1, y1, x2, y2]
  raw_y << y1 << y2
end

if rects.empty?
  puts 0
  exit
end

ys = raw_y.uniq.sort
m = ys.length - 1
cnt = Array.new(4 * m, 0)
seg_len = Array.new(4 * m, 0)

pull = lambda do |node, l, r|
  if cnt[node] > 0
    seg_len[node] = ys[r + 1] - ys[l]
  elsif l == r
    seg_len[node] = 0
  else
    seg_len[node] = seg_len[node * 2] + seg_len[node * 2 + 1]
  end
end

update = nil
update = lambda do |node, l, r, ql, qr, d|
  if ql <= l && r <= qr
    cnt[node] += d
    pull.call(node, l, r)
    return
  end
  mid = (l + r) >> 1
  update.call(node * 2, l, mid, ql, qr, d) if ql <= mid
  update.call(node * 2 + 1, mid + 1, r, ql, qr, d) if qr > mid
  pull.call(node, l, r)
end

events = []
rects.each do |x1, y1, x2, y2|
  id1 = ys.bsearch_index { |v| v >= y1 }
  id2 = ys.bsearch_index { |v| v >= y2 } - 1
  events << [x1, id1, id2, 1]
  events << [x2, id1, id2, -1]
end
events.sort_by! { |e| e[0] }

area = 0
prev_x = events[0][0]
events.each do |x, yl, yr, d|
  area += (x - prev_x) * seg_len[1]
  update.call(1, 0, m - 1, yl, yr, d)
  prev_x = x
end
puts area`,
      },
    },
    {
      id: 'ch53-p3',
      tier: 'Boss',
      ratingRange: '2200–2400',
      title: 'Maximum Rectangle Overlap Depth (Lazy Sweep Segment Tree)',
      statement:
        'Given N closed axis-aligned rectangles `[x1, x2] x [y1, y2]` (`1 <= N <= 10^5`), determine the maximum number of rectangles that simultaneously cover any single point `(x, y)` in the 2D plane (including boundaries). Input starts with N followed by N lines of x1 y1 x2 y2.',
      constraints: '1 <= N <= 10^5, -10^9 <= x1 <= x2 <= 10^9, -10^9 <= y1 <= y2 <= 10^9',
      sampleInput: `3
1 1 4 4
2 2 5 5
3 3 6 6`,
      sampleOutput: `3`,
      hints: [
        'Compress all `y1` and `y2` coordinates into discrete point indices `[0..U-1]`.',
        'Sort X-events by `(x, -delta)` so `+1` enter events run BEFORE `-1` exit events on equal `x` (preserving closed boundary touches).',
        'Maintain a Lazy Range-Add / Range-Max Segment Tree and update the global answer with `tree[1]` after every `+1` update.',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

struct Event {
    long long x;
    int delta, y1, y2;
    bool operator<(const Event& o) const {
        if (x != o.x) return x < o.x;
        return delta > o.delta; // +1 (enter) BEFORE -1 (exit) for closed boundaries
    }
};

struct LazyMaxSegTree {
    int n;
    vector<int> tree, lazy;

    LazyMaxSegTree(int n) : n(n), tree(4 * max(1, n), 0), lazy(4 * max(1, n), 0) {}

    void push(int node) {
        if (lazy[node] != 0) {
            int val = lazy[node];
            tree[node * 2] += val;
            lazy[node * 2] += val;
            tree[node * 2 + 1] += val;
            lazy[node * 2 + 1] += val;
            lazy[node] = 0;
        }
    }

    void update(int node, int l, int r, int ql, int qr, int val) {
        if (ql <= l && r <= qr) {
            tree[node] += val;
            lazy[node] += val;
            return;
        }
        push(node);
        int mid = (l + r) >> 1;
        if (ql <= mid) update(node * 2, l, mid, ql, qr, val);
        if (qr > mid) update(node * 2 + 1, mid + 1, r, ql, qr, val);
        tree[node] = max(tree[node * 2], tree[node * 2 + 1]);
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    if (!(cin >> n)) return 0;

    struct Rect { long long x1, y1, x2, y2; };
    vector<Rect> rects(n);
    vector<long long> ys;
    ys.reserve(2 * n);

    for (int i = 0; i < n; i++) {
        cin >> rects[i].x1 >> rects[i].y1 >> rects[i].x2 >> rects[i].y2;
        if (rects[i].x1 > rects[i].x2) swap(rects[i].x1, rects[i].x2);
        if (rects[i].y1 > rects[i].y2) swap(rects[i].y1, rects[i].y2);
        ys.push_back(rects[i].y1);
        ys.push_back(rects[i].y2);
    }
    if (n == 0) {
        cout << 0 << "\\n";
        return 0;
    }

    sort(ys.begin(), ys.end());
    ys.erase(unique(ys.begin(), ys.end()), ys.end());

    vector<Event> events;
    events.reserve(2 * n);
    for (const auto& rc : rects) {
        int id1 = (int)(lower_bound(ys.begin(), ys.end(), rc.y1) - ys.begin());
        int id2 = (int)(lower_bound(ys.begin(), ys.end(), rc.y2) - ys.begin());
        events.push_back({rc.x1, 1, id1, id2});
        events.push_back({rc.x2, -1, id1, id2});
    }
    sort(events.begin(), events.end());

    int m = (int)ys.size();
    LazyMaxSegTree seg(m);
    int ans = 0;
    for (const auto& ev : events) {
        seg.update(1, 0, m - 1, ev.y1, ev.y2, ev.delta);
        if (ev.delta == 1) ans = max(ans, seg.tree[1]);
    }
    cout << ans << "\\n";
    return 0;
}`,
        rust: `use std::io::{self, Read};

struct LazyMaxSegTree {
    tree: Vec<i32>,
    lazy: Vec<i32>,
}

impl LazyMaxSegTree {
    fn new(n: usize) -> Self {
        Self { tree: vec![0; 4 * n.max(1)], lazy: vec![0; 4 * n.max(1)] }
    }

    fn push(&mut self, node: usize) {
        if self.lazy[node] != 0 {
            let v = self.lazy[node];
            self.tree[node * 2] += v;
            self.lazy[node * 2] += v;
            self.tree[node * 2 + 1] += v;
            self.lazy[node * 2 + 1] += v;
            self.lazy[node] = 0;
        }
    }

    fn update(&mut self, node: usize, l: usize, r: usize, ql: usize, qr: usize, val: i32) {
        if ql <= l && r <= qr {
            self.tree[node] += val;
            self.lazy[node] += val;
            return;
        }
        self.push(node);
        let mid = (l + r) >> 1;
        if ql <= mid { self.update(node * 2, l, mid, ql, qr, val); }
        if qr > mid { self.update(node * 2 + 1, mid + 1, r, ql, qr, val); }
        self.tree[node] = self.tree[node * 2].max(self.tree[node * 2 + 1]);
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
    if n == 0 { println!("0"); return; }

    let mut rects = Vec::with_capacity(n);
    let mut ys = Vec::with_capacity(2 * n);
    for _ in 0..n {
        let mut x1: i64 = it.next().unwrap().parse().unwrap();
        let mut y1: i64 = it.next().unwrap().parse().unwrap();
        let mut x2: i64 = it.next().unwrap().parse().unwrap();
        let mut y2: i64 = it.next().unwrap().parse().unwrap();
        if x1 > x2 { std::mem::swap(&mut x1, &mut x2); }
        if y1 > y2 { std::mem::swap(&mut y1, &mut y2); }
        rects.push((x1, y1, x2, y2));
        ys.push(y1);
        ys.push(y2);
    }

    ys.sort_unstable();
    ys.dedup();
    let mut events = Vec::with_capacity(2 * n);
    for (x1, y1, x2, y2) in rects {
        let id1 = ys.binary_search(&y1).unwrap();
        let id2 = ys.binary_search(&y2).unwrap();
        events.push((x1, -1i32, id1, id2, 1i32));
        events.push((x2, 1i32, id1, id2, -1i32));
    }
    events.sort_unstable_by(|a, b| a.0.cmp(&b.0).then(a.1.cmp(&b.1)));

    let m = ys.len();
    let mut seg = LazyMaxSegTree::new(m);
    let mut ans = 0;
    for &(_x, _ord, yl, yr, delta) in &events {
        seg.update(1, 0, m - 1, yl, yr, delta);
        if delta == 1 {
            ans = ans.max(seg.tree[1]);
        }
    }
    println!("{}", ans);
}`,
        java21: `import java.io.*;
import java.util.*;

public class Main {
    static class FastScanner {
        private final InputStream in;
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;

        FastScanner(InputStream is) { this.in = is; }

        private int readByte() throws IOException {
            if (ptr >= len) {
                ptr = 0;
                len = in.read(buf);
                if (len <= 0) return -1;
            }
            return buf[ptr++];
        }

        long nextLong() throws IOException {
            int c;
            do {
                c = readByte();
                if (c == -1) return Long.MIN_VALUE;
            } while (c <= ' ');
            long sign = 1;
            if (c == '-') { sign = -1; c = readByte(); }
            long res = 0;
            while (c > ' ') {
                res = res * 10 + (c - '0');
                c = readByte();
            }
            return res * sign;
        }
    }

    static int[] tree, lazy;

    static void push(int node) {
        if (lazy[node] != 0) {
            int v = lazy[node];
            tree[node * 2] += v;
            lazy[node * 2] += v;
            tree[node * 2 + 1] += v;
            lazy[node * 2 + 1] += v;
            lazy[node] = 0;
        }
    }

    static void update(int node, int l, int r, int ql, int qr, int val) {
        if (ql <= l && r <= qr) {
            tree[node] += val;
            lazy[node] += val;
            return;
        }
        push(node);
        int mid = (l + r) >>> 1;
        if (ql <= mid) update(node * 2, l, mid, ql, qr, val);
        if (qr > mid) update(node * 2 + 1, mid + 1, r, ql, qr, val);
        tree[node] = Math.max(tree[node * 2], tree[node * 2 + 1]);
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        long nLong = fs.nextLong();
        if (nLong == Long.MIN_VALUE) return;
        int n = (int) nLong;
        if (n == 0) { System.out.println(0); return; }

        long[][] rects = new long[n][4];
        long[] rawY = new long[2 * n];
        for (int i = 0; i < n; i++) {
            long x1 = fs.nextLong(), y1 = fs.nextLong(), x2 = fs.nextLong(), y2 = fs.nextLong();
            if (x1 > x2) { long t = x1; x1 = x2; x2 = t; }
            if (y1 > y2) { long t = y1; y1 = y2; y2 = t; }
            rects[i][0] = x1; rects[i][1] = y1;
            rects[i][2] = x2; rects[i][3] = y2;
            rawY[2 * i] = y1;
            rawY[2 * i + 1] = y2;
        }

        Arrays.sort(rawY);
        int uniq = 0;
        for (int i = 0; i < 2 * n; i++) {
            if (i == 0 || rawY[i] != rawY[i - 1]) rawY[uniq++] = rawY[i];
        }
        long[] ys = Arrays.copyOf(rawY, uniq);

        long[][] events = new long[2 * n][4];
        for (int i = 0; i < n; i++) {
            int id1 = Arrays.binarySearch(ys, rects[i][1]);
            int id2 = Arrays.binarySearch(ys, rects[i][3]);
            events[2 * i] = new long[]{rects[i][0], 1, id1, id2};
            events[2 * i + 1] = new long[]{rects[i][2], -1, id1, id2};
        }
        Arrays.sort(events, (a, b) -> a[0] != b[0] ? Long.compare(a[0], b[0]) : Long.compare(b[1], a[1]));

        tree = new int[4 * uniq];
        lazy = new int[4 * uniq];
        int ans = 0;
        for (long[] ev : events) {
            update(1, 0, uniq - 1, (int) ev[2], (int) ev[3], (int) ev[1]);
            if (ev[1] == 1 && tree[1] > ans) ans = tree[1];
        }
        System.out.println(ans);
    }
}`,
        python3: `import sys
from bisect import bisect_left

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    if n == 0:
        sys.stdout.write("0\\n")
        return

    rects = []
    raw_y = []
    idx = 1
    for _ in range(n):
        x1 = int(data[idx]); y1 = int(data[idx + 1])
        x2 = int(data[idx + 2]); y2 = int(data[idx + 3])
        idx += 4
        if x1 > x2:
            x1, x2 = x2, x1
        if y1 > y2:
            y1, y2 = y2, y1
        rects.append((x1, y1, x2, y2))
        raw_y.append(y1)
        raw_y.append(y2)

    ys = sorted(set(raw_y))
    m = len(ys)
    tree = [0] * (4 * m)
    lazy = [0] * (4 * m)

    def push(node: int) -> None:
        if lazy[node] != 0:
            v = lazy[node]
            lc = node * 2
            rc = lc + 1
            tree[lc] += v
            lazy[lc] += v
            tree[rc] += v
            lazy[rc] += v
            lazy[node] = 0

    def update(node: int, l: int, r: int, ql: int, qr: int, val: int) -> None:
        if ql <= l and r <= qr:
            tree[node] += val
            lazy[node] += val
            return
        push(node)
        mid = (l + r) >> 1
        if ql <= mid:
            update(node * 2, l, mid, ql, qr, val)
        if qr > mid:
            update(node * 2 + 1, mid + 1, r, ql, qr, val)
        tree[node] = tree[node * 2] if tree[node * 2] >= tree[node * 2 + 1] else tree[node * 2 + 1]

    events = []
    for x1, y1, x2, y2 in rects:
        id1 = bisect_left(ys, y1)
        id2 = bisect_left(ys, y2)
        events.append((x1, -1, id1, id2, 1))
        events.append((x2, 1, id1, id2, -1))
    events.sort()

    ans = 0
    for _x, _ord, yl, yr, val in events:
        update(1, 0, m - 1, yl, yr, val)
        if val == 1 and tree[1] > ans:
            ans = tree[1]
    sys.stdout.write(f"{ans}\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
n = tokens[0].to_i
if n == 0
  puts 0
  exit
end

rects = []
raw_y = []
idx = 1
n.times do
  x1 = tokens[idx].to_i; y1 = tokens[idx + 1].to_i
  x2 = tokens[idx + 2].to_i; y2 = tokens[idx + 3].to_i
  idx += 4
  x1, x2 = x2, x1 if x1 > x2
  y1, y2 = y2, y1 if y1 > y2
  rects << [x1, y1, x2, y2]
  raw_y << y1 << y2
end

ys = raw_y.uniq.sort
m = ys.length
tree = Array.new(4 * m, 0)
lazy = Array.new(4 * m, 0)

push = lambda do |node|
  v = lazy[node]
  if v != 0
    lc = node * 2
    rc = lc + 1
    tree[lc] += v
    lazy[lc] += v
    tree[rc] += v
    lazy[rc] += v
    lazy[node] = 0
  end
end

update = nil
update = lambda do |node, l, r, ql, qr, val|
  if ql <= l && r <= qr
    tree[node] += val
    lazy[node] += val
    return
  end
  push.call(node)
  mid = (l + r) >> 1
  update.call(node * 2, l, mid, ql, qr, val) if ql <= mid
  update.call(node * 2 + 1, mid + 1, r, ql, qr, val) if qr > mid
  a = tree[node * 2]; b = tree[node * 2 + 1]
  tree[node] = a >= b ? a : b
end

events = []
rects.each do |x1, y1, x2, y2|
  id1 = ys.bsearch_index { |v| v >= y1 }
  id2 = ys.bsearch_index { |v| v >= y2 }
  events << [x1, -1, id1, id2, 1]
  events << [x2, 1, id1, id2, -1]
end
events.sort_by! { |e| [e[0], e[1]] }

ans = 0
events.each do |_x, _ord, yl, yr, val|
  update.call(1, 0, m - 1, yl, yr, val)
  ans = tree[1] if val == 1 && tree[1] > ans
end
puts ans`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'CSES',
      title: 'Area of Rectangles / Minimum Euclidean Distance',
      difficulty: 'Gold–Platinum',
      url: 'https://cses.fi/problemset/task/1741',
      patternNote: 'Direct CSES benchmarks for X-sweep + elementary Y segment tree and closest-pair D&C.',
    },
    {
      platform: 'Codeforces',
      title: 'Trivial Conjecture / Closest Pair & Line Sweep (429D)',
      difficulty: '1600–2100',
      url: 'https://codeforces.com/problemset/problem/429/D',
      patternNote: 'Transform prefix-sum squared differences into a 2D Closest Pair of Points instance.',
    },
    {
      platform: 'AtCoder',
      title: 'ABC / ARC — Rectangle Union & Intersection Count',
      difficulty: '1900',
      url: 'https://atcoder.jp',
      patternNote: 'Coordinate-compressed segment tree tracking minimum value + count of minimums on grid.',
    },
    {
      platform: 'CodeChef',
      title: 'Closest Pair & VLSI Footprint Area',
      difficulty: '2000',
      url: 'https://www.codechef.com',
      patternNote: 'Compute total silicon bounding coverage area across 10^5 non-disjoint rectangles.',
    },
    {
      platform: 'HackerRank',
      title: 'Direct Connections / Two Closest Points',
      difficulty: 'Hard',
      url: 'https://www.hackerrank.com/challenges',
      patternNote: 'Combine 64-bit squared-distance strip pruning with sweep-line interval counts.',
    },
    {
      platform: 'NeetCode 150',
      title: 'Rectangle Area II (850) & Skyline (218)',
      difficulty: 'Hard',
      url: 'https://leetcode.com/problems/rectangle-area-ii/',
      patternNote: 'Scale Rectangle Area II from O(N^2) coordinate sweeps to true O(N log N) segment trees.',
    },
  ],
  interviewNotes: [
    'Why does the Union-of-Rectangles Segment Tree NEVER need `push()` lazy propagation? Because every active rectangle adds `+1` and later subtracts `-1` over the exact same canonical Segment Tree nodes, so `cnt[node]` always stays valid at the exact node covering `[ql, qr]`!',
    'Why does the Closest-Pair strip check terminate in at most 7 iterations per point? All points inside the strip of width `2 * sqrt(d)` have pairwise distance `>= sqrt(d)` within the left half and within the right half, packing at most 8 points into any `2*sqrt(d) x sqrt(d)` rectangle.',
    'Always compress `y` into `M - 1` elementary intervals `[ys[i], ys[i+1]]` and map rectangle `[y1, y2]` to `[idx(y1), idx(y2) - 1]`.',
  ],
  projectBlueprint: {
    title: 'VLSI Chip Layout Overlap & Geospatial Coverage Area Engine',
    tagline:
      'Sub-millisecond CAD layout analyzer computing exact non-overlapping silicon die area and flagging nearest-neighbor minimum spacing violations via O(N log N) sweep lines.',
    stackSummary: 'TypeScript / Node.js Geometry Sweep Engine',
    asciiDiagram: `[Rectangles (x1,y1,x2,y2)] --> [Sort X-Events (+1 / -1)] --> [Cover-Count SegTree over ys]
                                                                    |
[2D Pin Coordinates] --------> [D&C X-Split + 7-Point Y-Strip] -> [Exact Total Area & Min d^2]`,
    milestones: [
      {
        id: 'm1',
        title: 'Elementary Y-Interval Discretizer',
        detail: 'Deduplicate all rectangle Y-edges into M - 1 non-overlapping vertical strips.',
      },
      {
        id: 'm2',
        title: 'Lazy-Free Cover-Count Segment Tree',
        detail: 'Accumulate total union area `(x - prevX) * segLen[1]` across sorted X-events.',
      },
      {
        id: 'm3',
        title: 'Integer-Exact Closest-Pair Proximity Check',
        detail: 'Verify minimum pin-to-pin squared Euclidean clearance without floating-point drift.',
      },
    ],
    starterCode: `export function unionArea(rects: [number, number, number, number][]): number {
  const ysSet = new Set<number>();
  const events: [number, number, number, number][] = [];
  for (const [x1, y1, x2, y2] of rects) {
    if (x1 === x2 || y1 === y2) continue;
    ysSet.add(y1);
    ysSet.add(y2);
  }
  const ys = Array.from(ysSet).sort((a, b) => a - b);
  if (ys.length <= 1) return 0;

  const yIdx = new Map<number, number>();
  ys.forEach((v, i) => yIdx.set(v, i));
  for (const [x1, y1, x2, y2] of rects) {
    if (x1 === x2 || y1 === y2) continue;
    const l = yIdx.get(Math.min(y1, y2))!;
    const r = yIdx.get(Math.max(y1, y2))! - 1;
    events.push([Math.min(x1, x2), l, r, 1]);
    events.push([Math.max(x1, x2), l, r, -1]);
  }
  events.sort((a, b) => a[0] - b[0]);

  const m = ys.length - 1;
  const cnt = new Int32Array(4 * m);
  const len = new Float64Array(4 * m);

  function pull(node: number, l: number, r: number) {
    if (cnt[node] > 0) len[node] = ys[r + 1] - ys[l];
    else if (l === r) len[node] = 0;
    else len[node] = len[node * 2] + len[node * 2 + 1];
  }

  function update(node: number, l: number, r: number, ql: number, qr: number, d: number) {
    if (ql <= l && r <= qr) {
      cnt[node] += d;
      pull(node, l, r);
      return;
    }
    const mid = (l + r) >> 1;
    if (ql <= mid) update(node * 2, l, mid, ql, qr, d);
    if (qr > mid) update(node * 2 + 1, mid + 1, r, ql, qr, d);
    pull(node, l, r);
  }

  let area = 0;
  let prevX = events[0][0];
  for (const [x, l, r, d] of events) {
    area += (x - prevX) * len[1];
    update(1, 0, m - 1, l, r, d);
    prevX = x;
  }
  return area;
}

console.log('Union area:', unionArea([[1, 3, 4, 5], [3, 1, 7, 4], [5, 3, 8, 6]]));`,
  },
};
