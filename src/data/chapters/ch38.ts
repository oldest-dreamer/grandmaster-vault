import type { TheoryChapter } from '../../types/vault';

export const CH38_CONVEX_HULL_CALIPERS: TheoryChapter = {
  slug: 'convex-hull-andrew-monotone',
  topicId: 'sg-68',
  title: 'Convex Hull (Andrew Monotone Chain) & Rotating Calipers',
  domain: 'Strings & Geometry',
  ratingTier: '1900–2200',
  usacoDivision: 'Platinum',
  subtitle:
    'Wrap arbitrary 2D point clouds in O(N log N) via Andrew’s Monotone Chain with integer cross products, rotate antipodal calipers in O(N) for polygon diameter and minimum enclosing rectangles, and answer Point-in-Convex-Polygon queries in O(log N).',
  analogyTitle: 'The Stretched Rubber Band & Parallel Sliding Yardsticks Analogy',
  analogyBody:
    'Hammer nails into a wooden board at every point `(x, y)` and snap a giant rubber band around all of them: the nails the band touches form the **Convex Hull**. Instead of fragile `atan2` angle sorting, **Andrew’s Monotone Chain** sorts points lexicographically left-to-right `(x, then y)`, builds the **Lower Hull** keeping only counter-clockwise left turns (`cross > 0`), and then walks right-to-left building the **Upper Hull**! Next, clamp two parallel yardsticks (**Rotating Calipers**) onto opposite sides of the hull and spin them smoothly around the perimeter: as the base edge advances, the farthest opposite nail advances monotonically without ever moving backward—computing polygon diameter (`max dist^2`) and minimum-area bounding rectangles in strict `O(H)` linear time!',
  prerequisites: [
    {
      slug: '2d-vectors-cross-product-orientation',
      title: '2D Vectors, Cross Product, Segment Intersection & Polygon Area',
    },
  ],
  traceTitle: 'Interactive Andrew Monotone Chain Stack & Rotating Calipers Antipodal Trace',
  traceSubtitle:
    'Trace sorting 6 points, popping non-CCW right turns on the lower & upper hulls, and advancing antipodal pointer `j` across hull edges in `O(H)`.',
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Step 1: Sort Points Lexicographically (x Ascending, Tie-Break y Ascending)',
      explanation:
        'Input points sorted and deduplicated: P0=(0,0), P1=(1,3), P2=(2,1), P3=(3,2), P4=(4,0), P5=(4,4). P0=(0,0) is guaranteed leftmost-bottommost and stays on BOTH lower and upper hulls!',
      mode: 'array',
      arrays: [
        {
          name: 'Sorted Point Cloud P[0..5]',
          cells: [
            { index: 0, value: '(0,0)', highlight: 'active' },
            { index: 1, value: '(1,3)', highlight: 'neutral' },
            { index: 2, value: '(2,1)', highlight: 'neutral' },
            { index: 3, value: '(3,2)', highlight: 'neutral' },
            { index: 4, value: '(4,0)', highlight: 'neutral' },
            { index: 5, value: '(4,4)', highlight: 'window' },
          ],
        },
      ],
      variables: { Phase: 'Lexicographic Sort', SortedCount: 6, Time: 'O(N log N)' },
    },
    {
      stepNumber: 2,
      title: 'Step 2: Lower Hull Sweep Pops Clockwise Detours (1,3) & (3,2)',
      explanation:
        'Push (0,0), (1,3). Arrival of (2,1): cross((0,0)->(1,3), (1,3)->(2,1)) = 1*(-2) - 3*1 = -5 <= 0 (RIGHT turn!) -> POP (1,3)! Push (2,1), (3,2). Arrival of (4,0): cross((2,1)->(3,2), (3,2)->(4,0)) = 1*(-2) - 1*1 = -3 <= 0 -> POP (3,2)! Lower hull = [(0,0), (2,1), (4,0)]? Wait: cross((0,0)->(2,1), (2,1)->(4,0)) = 2*(-1) - 1*2 = -4 <= 0 -> POP (2,1) too! Lower hull = [(0,0), (4,0)]!',
      mode: 'array',
      arrays: [
        {
          name: 'Lower Hull Stack (Strict CCW)',
          cells: [
            { index: 0, value: '(0,0)', highlight: 'updated' },
            { index: 1, value: '(4,0)', highlight: 'active' },
            { index: 2, value: '[popped: (1,3),(2,1),(3,2)]', highlight: 'neutral' },
          ],
        },
      ],
      variables: { PoppedInterior: '(1,3), (2,1), (3,2)', LowerHull: '[(0,0), (4,0)]' },
    },
    {
      stepNumber: 3,
      title: 'Step 3: Upper Hull Sweep Right-to-Left Merges Into 4-Vertex CCW Hull',
      explanation:
        'Walk backward from P5=(4,4): push (4,0) already at boundary, then (4,4), skip (3,2)/(2,1), push (1,3), close at (0,0). Removing duplicate endpoints yields CCW Convex Hull H = [(0,0), (4,0), (4,4), (1,3)]!',
      mode: 'array',
      arrays: [
        {
          name: 'Final CCW Convex Hull H[0..3]',
          cells: [
            { index: 0, value: '(0,0)', highlight: 'active' },
            { index: 1, value: '(4,0)', highlight: 'window' },
            { index: 2, value: '(4,4)', highlight: 'updated' },
            { index: 3, value: '(1,3)', highlight: 'window' },
          ],
        },
      ],
      variables: { HullSize: 4, Order: 'Strictly CCW', StackOps: 'O(N) amortized' },
    },
    {
      stepNumber: 4,
      title: 'Step 4: Rotating Calipers Advance Pointer j Monotonically Across Antipodal Peaks',
      explanation:
        'For edge H[0]->H[1] = (0,0)->(4,0), advance j while area(H[0], H[1], H[j+1]) > area(H[0], H[1], H[j]): j advances 1 -> 2 ((4,4), area=16). Max squared distance across antipodal pairs = dist2((0,0), (4,4)) = 32! j never resets -> O(H) total!',
      mode: 'array',
      arrays: [
        {
          name: 'Calipers Base Edge i & Opposite Peak j',
          cells: [
            { index: 0, value: 'i=0: (0,0)->(4,0)', highlight: 'window' },
            { index: 1, value: 'j=2: (4,4) [A=16]', highlight: 'active' },
            { index: 2, value: 'MaxDist2 = 32', highlight: 'updated' },
          ],
        },
      ],
      variables: { BaseEdge: '(0,0)->(4,0)', AntipodalPeak: '(4,4)', DiameterSquared: 32 },
    },
  ],
  reductionClues: [
    {
      clue: '"Find Convex Hull of N <= 2 * 10^5 points (either strict minimal corners or including collinear boundary points)"',
      translation:
        'Use **Andrew’s Monotone Chain** (`sort(x, y)` + lower/upper hulls). Use `cross(a, b, c) <= 0` when popping collinear interior points (strict convex hull), OR `cross(a, b, c) < 0` when keeping ALL collinear points along boundary edges!',
    },
    {
      clue: '"Find the farthest pair of points (diameter) among N <= 10^5 points"',
      translation:
        'Farthest pair ALWAYS lies on the Convex Hull! Build strict hull `H` (`<= 0` pop), handle `H.size() <= 2`, then run **Rotating Calipers**: increment `j` while `cross(H[i], H[i+1], H[j+1]) > cross(H[i], H[i+1], H[j])` and track `max(dist2(H[i], H[j]), dist2(H[i+1], H[j]))`!',
    },
    {
      clue: '"Find the Minimum-Area (or Minimum-Perimeter) Enclosing Rectangle for N <= 10^5 points"',
      translation:
        'By Freeman-Shapira Theorem, at least ONE side of the minimum-area bounding rectangle MUST be collinear with a Convex Hull edge! Track 4 pointers (`base i`, `rightmost j` via max dot, `top k` via max cross, `leftmost m` via min dot) rotating monotonically in `O(H)`!',
    },
    {
      clue: '"Answer Q <= 2 * 10^5 Point-in-Convex-Polygon queries in O(log N) per query"',
      translation:
        'Anchor at `H[0]`: first verify `P` lies inside wedge `[H[1] - H[0], H[k-1] - H[0]]` (`cross(H[0], H[1], P) >= 0 && cross(H[0], H[k-1], P) <= 0`). Binary search the fan triangle `(H[0], H[idx], H[idx+1])` containing ray `H[0]->P` in `O(log N)`, then check `cross(H[idx], H[idx+1], P) >= 0`!',
    },
  ],
  timeComplexity: 'Hull Build: O(N log N) | Rotating Calipers: O(H) <= O(N) | Point-in-Convex-Polygon: O(log H)',
  spaceComplexity: 'O(N)',
  pitfalls: [
    {
      type: 'WA',
      title: 'Duplicate Boundary Points When All Input Points Are Collinear & Keeping Collinear Points',
      detail:
        'When you use `cross < 0` (keeping collinear boundary points) on a degenerate collinear input like `(0,0), (1,0), (2,0)`, the lower hull has `[(0,0), (1,0), (2,0)]` AND the upper hull ALSO picks up `(1,0)` in reverse! Handle the all-collinear edge case explicitly or filter duplicates cleanly.',
    },
    {
      type: 'WA',
      title: 'Infinite Loop in Rotating Calipers When Two Opposite Hull Edges Are Parallel',
      detail:
        'If `cross(H[i], H[i+1], H[j+1]) >= cross(...)` loops on equality for a parallelogram, `j` can spin infinitely around equal-area edges! Use strict inequality `>` (or bound increments `steps < H`) and check BOTH `dist2(H[i], H[j])` and `dist2(H[i+1], H[j])` after advancing!',
    },
    {
      type: 'WA',
      title: 'Minimum Enclosing Rectangle Left-Caliper Must Start AFTER Top-Caliper (Never Before!)',
      detail:
        'In 4-caliper minimum bounding rectangle, the left-most point (`min dot(edgeVec, H[m] - H[i])`) sits on the BACKWARD side of the polygon—if initialized at `i`, `dot` increases first toward `rightmost`, then decreases! Always initialize `left` at `top` (after advancing `top`) so `dot` monotonically decreases toward the minimum!',
    },
    {
      type: 'WA',
      title: 'Point-in-Convex-Polygon Failing on Collinear Edge H[0]->H[1] or Degenerate Hull (|H| < 3)',
      detail:
        'Always check `|H| == 1` (`P == H[0]`) and `|H| == 2` (`on_segment(H[0], H[1], P)`), and remember that points lying directly on ray `H[0] -> H[1]` or `H[0] -> H[k-1]` are inside ONLY if they lie on the segment (`dot <= ...`)—not strictly beyond `H[1]`!',
    },
  ],
  implementations: {
    cpp20: `#include <bits/stdc++.h>
using namespace std;

// Andrew's Monotone Chain Convex Hull (O(N log N)) + Rotating Calipers Diameter (O(N))
struct Pt {
    long long x, y;
    bool operator<(const Pt& o) const {
        return x < o.x || (x == o.x && y < o.y);
    }
    bool operator==(const Pt& o) const {
        return x == o.x && y == o.y;
    }
};

__int128 cross(Pt a, Pt b, Pt c) {
    return (__int128)(b.x - a.x) * (c.y - a.y) - (__int128)(b.y - a.y) * (c.x - a.x);
}

unsigned long long dist2(Pt a, Pt b) {
    long long dx = a.x - b.x, dy = a.y - b.y;
    return (unsigned long long)dx * dx + (unsigned long long)dy * dy;
}

vector<Pt> convex_hull(vector<Pt> pts) {
    sort(pts.begin(), pts.end());
    pts.erase(unique(pts.begin(), pts.end()), pts.end());
    int n = (int)pts.size();
    if (n <= 2) return pts;

    vector<Pt> h;
    for (int i = 0; i < n; i++) {
        while (h.size() >= 2 && cross(h[h.size() - 2], h.back(), pts[i]) <= 0) h.pop_back();
        h.push_back(pts[i]);
    }
    size_t lower_sz = h.size();
    for (int i = n - 2; i >= 0; i--) {
        while (h.size() > lower_sz && cross(h[h.size() - 2], h.back(), pts[i]) <= 0) h.pop_back();
        h.push_back(pts[i]);
    }
    h.pop_back();
    return h;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    if (!(cin >> n)) return 0;
    vector<Pt> pts(n);
    for (int i = 0; i < n; i++) cin >> pts[i].x >> pts[i].y;

    vector<Pt> h = convex_hull(pts);
    int k = (int)h.size();
    cout << k << "\\n";
    for (const Pt& p : h) cout << p.x << " " << p.y << "\\n";

    unsigned long long best = 0;
    if (k == 2) {
        best = dist2(h[0], h[1]);
    } else if (k >= 3) {
        int j = 1;
        for (int i = 0; i < k; i++) {
            int ni = (i + 1) % k;
            while (cross(h[i], h[ni], h[(j + 1) % k]) > cross(h[i], h[ni], h[j])) {
                j = (j + 1) % k;
            }
            best = max(best, dist2(h[i], h[j]));
            best = max(best, dist2(h[ni], h[j]));
        }
    }
    cout << best << "\\n";
    return 0;
}`,
    rust: `use std::io::{self, Read};

#[derive(Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
struct Pt {
    x: i64,
    y: i64,
}

fn cross(a: Pt, b: Pt, c: Pt) -> i128 {
    (b.x as i128 - a.x as i128) * (c.y as i128 - a.y as i128)
        - (b.y as i128 - a.y as i128) * (c.x as i128 - a.x as i128)
}

fn dist2(a: Pt, b: Pt) -> u128 {
    let dx = a.x as i128 - b.x as i128;
    let dy = a.y as i128 - b.y as i128;
    (dx * dx + dy * dy) as u128
}

fn convex_hull(mut pts: Vec<Pt>) -> Vec<Pt> {
    pts.sort();
    pts.dedup();
    let n = pts.len();
    if n <= 2 {
        return pts;
    }
    let mut h: Vec<Pt> = Vec::with_capacity(2 * n);
    for &p in &pts {
        while h.len() >= 2 && cross(h[h.len() - 2], h[h.len() - 1], p) <= 0 {
            h.pop();
        }
        h.push(p);
    }
    let lower_sz = h.len();
    for &p in pts[..n - 1].iter().rev() {
        while h.len() > lower_sz && cross(h[h.len() - 2], h[h.len() - 1], p) <= 0 {
            h.pop();
        }
        h.push(p);
    }
    h.pop();
    h
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
        pts.push(Pt {
            x: it.next().unwrap().parse().unwrap(),
            y: it.next().unwrap().parse().unwrap(),
        });
    }

    let h = convex_hull(pts);
    let k = h.len();
    let mut out = format!("{}\\n", k);
    for p in &h {
        out.push_str(&format!("{} {}\\n", p.x, p.y));
    }

    let mut best: u128 = 0;
    if k == 2 {
        best = dist2(h[0], h[1]);
    } else if k >= 3 {
        let mut j = 1usize;
        for i in 0..k {
            let ni = (i + 1) % k;
            while cross(h[i], h[ni], h[(j + 1) % k]) > cross(h[i], h[ni], h[j]) {
                j = (j + 1) % k;
            }
            best = best.max(dist2(h[i], h[j])).max(dist2(h[ni], h[j]));
        }
    }
    out.push_str(&format!("{}\\n", best));
    print!("{}", out);
}`,
    java21: `import java.io.IOException;
import java.io.InputStream;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.Arrays;
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
            long sign = 1;
            if (c == '-') { sign = -1; c = readByte(); }
            long res = 0;
            while (c > ' ') { res = res * 10 + (c - '0'); c = readByte(); }
            return res * sign;
        }
    }

    static class Pt implements Comparable<Pt> {
        long x, y;
        Pt(long x, long y) { this.x = x; this.y = y; }
        public int compareTo(Pt o) {
            return x != o.x ? Long.compare(x, o.x) : Long.compare(y, o.y);
        }
    }

    static BigInteger cross(Pt a, Pt b, Pt c) {
        return BigInteger.valueOf(b.x - a.x).multiply(BigInteger.valueOf(c.y - a.y))
                .subtract(BigInteger.valueOf(b.y - a.y).multiply(BigInteger.valueOf(c.x - a.x)));
    }

    static BigInteger dist2(Pt a, Pt b) {
        BigInteger dx = BigInteger.valueOf(a.x - b.x);
        BigInteger dy = BigInteger.valueOf(a.y - b.y);
        return dx.multiply(dx).add(dy.multiply(dy));
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        long nIn = fs.nextLong();
        if (nIn == Long.MIN_VALUE) return;
        int n = (int) nIn;
        Pt[] raw = new Pt[n];
        for (int i = 0; i < n; i++) raw[i] = new Pt(fs.nextLong(), fs.nextLong());
        Arrays.sort(raw);

        List<Pt> pts = new ArrayList<>();
        for (Pt p : raw) {
            if (pts.isEmpty() || pts.get(pts.size() - 1).x != p.x || pts.get(pts.size() - 1).y != p.y) {
                pts.add(p);
            }
        }

        List<Pt> h = new ArrayList<>();
        if (pts.size() <= 2) {
            h.addAll(pts);
        } else {
            for (Pt p : pts) {
                while (h.size() >= 2 && cross(h.get(h.size() - 2), h.get(h.size() - 1), p).signum() <= 0) {
                    h.remove(h.size() - 1);
                }
                h.add(p);
            }
            int lowerSz = h.size();
            for (int i = pts.size() - 2; i >= 0; i--) {
                Pt p = pts.get(i);
                while (h.size() > lowerSz && cross(h.get(h.size() - 2), h.get(h.size() - 1), p).signum() <= 0) {
                    h.remove(h.size() - 1);
                }
                h.add(p);
            }
            h.remove(h.size() - 1);
        }

        int k = h.size();
        StringBuilder sb = new StringBuilder();
        sb.append(k).append('\\n');
        for (Pt p : h) sb.append(p.x).append(' ').append(p.y).append('\\n');

        BigInteger best = BigInteger.ZERO;
        if (k == 2) {
            best = dist2(h.get(0), h.get(1));
        } else if (k >= 3) {
            int j = 1;
            for (int i = 0; i < k; i++) {
                int ni = (i + 1) % k;
                while (cross(h.get(i), h.get(ni), h.get((j + 1) % k))
                        .compareTo(cross(h.get(i), h.get(ni), h.get(j))) > 0) {
                    j = (j + 1) % k;
                }
                best = best.max(dist2(h.get(i), h.get(j))).max(dist2(h.get(ni), h.get(j)));
            }
        }
        sb.append(best).append('\\n');
        System.out.print(sb);
    }
}`,
        python3: `import sys

sys.setrecursionlimit(200000)

def cross(a, b, c) -> int:
    return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])

def dist2(a, b) -> int:
    return (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2

def convex_hull(pts):
    pts = sorted(set(pts))
    if len(pts) <= 2:
        return pts
    lower = []
    for p in pts:
        while len(lower) >= 2 and cross(lower[-2], lower[-1], p) <= 0:
            lower.pop()
        lower.append(p)
    upper = []
    for p in reversed(pts):
        while len(upper) >= 2 and cross(upper[-2], upper[-1], p) <= 0:
            upper.pop()
        upper.append(p)
    return lower[:-1] + upper[:-1]

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    n = int(next(it))
    pts = [(int(next(it)), int(next(it))) for _ in range(n)]
    h = convex_hull(pts)
    k = len(h)

    best = 0
    if k == 2:
        best = dist2(h[0], h[1])
    elif k >= 3:
        j = 1
        for i in range(k):
            ni = (i + 1) % k
            while cross(h[i], h[ni], h[(j + 1) % k]) > cross(h[i], h[ni], h[j]):
                j = (j + 1) % k
            best = max(best, dist2(h[i], h[j]), dist2(h[ni], h[j]))

    out = [str(k)] + [f"{x} {y}" for x, y in h] + [str(best)]
    sys.stdout.write("\\n".join(out) + "\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `def cross(a, b, c)
  (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
end

def dist2(a, b)
  (a[0] - b[0])**2 + (a[1] - b[1])**2
end

tokens = $stdin.read.split
exit if tokens.empty?
n = tokens[0].to_i
pts = Array.new(n) { |i| [tokens[1 + 2 * i].to_i, tokens[2 + 2 * i].to_i] }.uniq.sort

h = []
if pts.length <= 2
  h = pts
else
  lower = []
  pts.each do |p|
    lower.pop while lower.length >= 2 && cross(lower[-2], lower[-1], p) <= 0
    lower << p
  end
  upper = []
  pts.reverse_each do |p|
    upper.pop while upper.length >= 2 && cross(upper[-2], upper[-1], p) <= 0
    upper << p
  end
  h = lower[0...-1] + upper[0...-1]
end

k = h.length
best = 0
if k == 2
  best = dist2(h[0], h[1])
elsif k >= 3
  j = 1
  k.times do |i|
    ni = (i + 1) % k
    j = (j + 1) % k while cross(h[i], h[ni], h[(j + 1) % k]) > cross(h[i], h[ni], h[j])
    best = [best, dist2(h[i], h[j]), dist2(h[ni], h[j])].max
  end
end

out = [k.to_s] + h.map { |x, y| "#{x} #{y}" } + [best.to_s]
puts out.join("\\n")`,
  },
  practiceProblems: [
    {
      id: 'ch38-p1',
      tier: 'Warmup',
      ratingRange: '1650–1850',
      title: 'Convex Hull With Collinear Boundary Points & Exact Perimeter',
      statement:
        'Given N integer points in the 2D plane (N >= 3), output ALL points lying on the Convex Hull boundary (including points lying strictly on an edge between two corners), followed by the total perimeter of the Convex Hull rounded to 6 decimal places.',
      constraints: '3 <= N <= 10^5, -10^9 <= x, y <= 10^9',
      sampleInput: '6\n0 0\n2 0\n4 0\n4 3\n2 1\n0 3',
      sampleOutput: '5\n0 0\n2 0\n4 0\n4 3\n0 3\n14.000000',
      hints: [
        'Use Andrew’s Monotone Chain with **strict** pop condition `cross(a, b, c) < 0` (instead of `<= 0`) so collinear boundary points are preserved!',
        'Watch the collinear edge case: if ALL `N` distinct points are collinear, the upper hull duplicates the middle points from the lower hull unless you deduplicate `(lower + upper)` or check if all `N` points are collinear first!',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

struct Pt {
    long long x, y;
    bool operator<(const Pt& o) const { return x < o.x || (x == o.x && y < o.y); }
    bool operator==(const Pt& o) const { return x == o.x && y == o.y; }
};

__int128 cross(Pt a, Pt b, Pt c) {
    return (__int128)(b.x - a.x) * (c.y - a.y) - (__int128)(b.y - a.y) * (c.x - a.x);
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    if (!(cin >> n)) return 0;
    vector<Pt> pts(n);
    for (int i = 0; i < n; i++) cin >> pts[i].x >> pts[i].y;

    sort(pts.begin(), pts.end());
    pts.erase(unique(pts.begin(), pts.end()), pts.end());
    int m = (int)pts.size();

    vector<Pt> h;
    if (m <= 2) {
        h = pts;
    } else {
        bool allCollinear = true;
        for (int i = 2; i < m; i++) {
            if (cross(pts[0], pts[1], pts[i]) != 0) {
                allCollinear = false;
                break;
            }
        }
        if (allCollinear) {
            h = pts;
        } else {
            for (int i = 0; i < m; i++) {
                while (h.size() >= 2 && cross(h[h.size() - 2], h.back(), pts[i]) < 0) h.pop_back();
                h.push_back(pts[i]);
            }
            size_t low = h.size();
            for (int i = m - 2; i >= 0; i--) {
                while (h.size() > low && cross(h[h.size() - 2], h.back(), pts[i]) < 0) h.pop_back();
                h.push_back(pts[i]);
            }
            h.pop_back();
        }
    }

    int k = (int)h.size();
    double perim = 0.0;
    if (k == 2) {
        perim = 2.0 * hypot((double)(h[0].x - h[1].x), (double)(h[0].y - h[1].y));
    } else if (k >= 3) {
        for (int i = 0; i < k; i++) {
            Pt a = h[i], b = h[(i + 1) % k];
            perim += hypot((double)(a.x - b.x), (double)(a.y - b.y));
        }
    }

    cout << k << "\\n";
    for (const Pt& p : h) cout << p.x << " " << p.y << "\\n";
    cout << fixed << setprecision(6) << perim << "\\n";
    return 0;
}`,
        rust: `use std::io::{self, Read};

#[derive(Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
struct Pt {
    x: i64,
    y: i64,
}

fn cross(a: Pt, b: Pt, c: Pt) -> i128 {
    (b.x as i128 - a.x as i128) * (c.y as i128 - a.y as i128)
        - (b.y as i128 - a.y as i128) * (c.x as i128 - a.x as i128)
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
        pts.push(Pt {
            x: it.next().unwrap().parse().unwrap(),
            y: it.next().unwrap().parse().unwrap(),
        });
    }
    pts.sort();
    pts.dedup();
    let m = pts.len();

    let h = if m <= 2 || (2..m).all(|i| cross(pts[0], pts[1], pts[i]) == 0) {
        pts
    } else {
        let mut h = Vec::with_capacity(2 * m);
        for &p in &pts {
            while h.len() >= 2 && cross(h[h.len() - 2], h[h.len() - 1], p) < 0 {
                h.pop();
            }
            h.push(p);
        }
        let low = h.len();
        for &p in pts[..m - 1].iter().rev() {
            while h.len() > low && cross(h[h.len() - 2], h[h.len() - 1], p) < 0 {
                h.pop();
            }
            h.push(p);
        }
        h.pop();
        h
    };

    let k = h.len();
    let mut perim = 0.0f64;
    if k == 2 {
        perim = 2.0 * ((h[0].x - h[1].x) as f64).hypot((h[0].y - h[1].y) as f64);
    } else if k >= 3 {
        for i in 0..k {
            let a = h[i];
            let b = h[(i + 1) % k];
            perim += ((a.x - b.x) as f64).hypot((a.y - b.y) as f64);
        }
    }

    let mut out = format!("{}\\n", k);
    for p in &h {
        out.push_str(&format!("{} {}\\n", p.x, p.y));
    }
    out.push_str(&format!("{:.6}\\n", perim));
    print!("{}", out);
}`,
        java21: `import java.io.IOException;
import java.io.InputStream;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;

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

    static class Pt implements Comparable<Pt> {
        long x, y;
        Pt(long x, long y) { this.x = x; this.y = y; }
        public int compareTo(Pt o) {
            return x != o.x ? Long.compare(x, o.x) : Long.compare(y, o.y);
        }
    }

    static int crossSign(Pt a, Pt b, Pt c) {
        return BigInteger.valueOf(b.x - a.x).multiply(BigInteger.valueOf(c.y - a.y))
                .subtract(BigInteger.valueOf(b.y - a.y).multiply(BigInteger.valueOf(c.x - a.x))).signum();
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        long nIn = fs.nextLong();
        if (nIn == Long.MIN_VALUE) return;
        int n = (int) nIn;
        Pt[] raw = new Pt[n];
        for (int i = 0; i < n; i++) raw[i] = new Pt(fs.nextLong(), fs.nextLong());
        Arrays.sort(raw);

        List<Pt> pts = new ArrayList<>();
        for (Pt p : raw) {
            if (pts.isEmpty() || pts.get(pts.size() - 1).x != p.x || pts.get(pts.size() - 1).y != p.y) pts.add(p);
        }

        int m = pts.size();
        boolean allCol = true;
        for (int i = 2; i < m; i++) {
            if (crossSign(pts.get(0), pts.get(1), pts.get(i)) != 0) { allCol = false; break; }
        }

        List<Pt> h = new ArrayList<>();
        if (m <= 2 || allCol) {
            h.addAll(pts);
        } else {
            for (Pt p : pts) {
                while (h.size() >= 2 && crossSign(h.get(h.size() - 2), h.get(h.size() - 1), p) < 0) {
                    h.remove(h.size() - 1);
                }
                h.add(p);
            }
            int low = h.size();
            for (int i = m - 2; i >= 0; i--) {
                Pt p = pts.get(i);
                while (h.size() > low && crossSign(h.get(h.size() - 2), h.get(h.size() - 1), p) < 0) {
                    h.remove(h.size() - 1);
                }
                h.add(p);
            }
            h.remove(h.size() - 1);
        }

        int k = h.size();
        double perim = 0.0;
        if (k == 2) {
            perim = 2.0 * Math.hypot(h.get(0).x - h.get(1).x, h.get(0).y - h.get(1).y);
        } else if (k >= 3) {
            for (int i = 0; i < k; i++) {
                Pt a = h.get(i), b = h.get((i + 1) % k);
                perim += Math.hypot(a.x - b.x, a.y - b.y);
            }
        }

        StringBuilder sb = new StringBuilder();
        sb.append(k).append('\\n');
        for (Pt p : h) sb.append(p.x).append(' ').append(p.y).append('\\n');
        sb.append(String.format(Locale.US, "%.6f%n", perim));
        System.out.print(sb);
    }
}`,
        python3: `import math
import sys

sys.setrecursionlimit(200000)

def cross(a, b, c) -> int:
    return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    n = int(next(it))
    pts = sorted(set((int(next(it)), int(next(it))) for _ in range(n)))
    m = len(pts)

    if m <= 2 or all(cross(pts[0], pts[1], pts[i]) == 0 for i in range(2, m)):
        h = pts
    else:
        lower = []
        for p in pts:
            while len(lower) >= 2 and cross(lower[-2], lower[-1], p) < 0:
                lower.pop()
            lower.append(p)
        upper = []
        for p in reversed(pts):
            while len(upper) >= 2 and cross(upper[-2], upper[-1], p) < 0:
                upper.pop()
            upper.append(p)
        h = lower[:-1] + upper[:-1]

    k = len(h)
    perim = 0.0
    if k == 2:
        perim = 2.0 * math.hypot(h[0][0] - h[1][0], h[0][1] - h[1][1])
    elif k >= 3:
        for i in range(k):
            a, b = h[i], h[(i + 1) % k]
            perim += math.hypot(a[0] - b[0], a[1] - b[1])

    out = [str(k)] + [f"{x} {y}" for x, y in h] + [f"{perim:.6f}"]
    sys.stdout.write("\\n".join(out) + "\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `def cross(a, b, c)
  (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
end

tokens = $stdin.read.split
exit if tokens.empty?
n = tokens[0].to_i
pts = Array.new(n) { |i| [tokens[1 + 2 * i].to_i, tokens[2 + 2 * i].to_i] }.uniq.sort
m = pts.length

if m <= 2 || (2...m).all? { |i| cross(pts[0], pts[1], pts[i]) == 0 }
  h = pts
else
  lower = []
  pts.each do |p|
    lower.pop while lower.length >= 2 && cross(lower[-2], lower[-1], p) < 0
    lower << p
  end
  upper = []
  pts.reverse_each do |p|
    upper.pop while upper.length >= 2 && cross(upper[-2], upper[-1], p) < 0
    upper << p
  end
  h = lower[0...-1] + upper[0...-1]
end

k = h.length
perim = 0.0
if k == 2
  perim = 2.0 * Math.hypot(h[0][0] - h[1][0], h[0][1] - h[1][1])
elsif k >= 3
  k.times do |i|
    a = h[i]
    b = h[(i + 1) % k]
    perim += Math.hypot(a[0] - b[0], a[1] - b[1])
  end
end

out = [k.to_s] + h.map { |x, y| "#{x} #{y}" } + [format("%.6f", perim)]
puts out.join("\\n")`,
      },
    },
    {
      id: 'ch38-p2',
      tier: 'Standard',
      ratingRange: '1900–2100',
      title: 'Farthest Pair of Points (Convex Diameter) via Rotating Calipers',
      statement:
        'Given N integer points in the 2D plane (2 <= N <= 10^5), find the MAXIMUM squared Euclidean distance (dx^2 + dy^2) between any pair of points in strict O(N log N) time.',
      constraints: '2 <= N <= 10^5, -10^9 <= x, y <= 10^9',
      sampleInput: '5\n0 0\n3 0\n1 1\n0 4\n4 3',
      sampleOutput: '25',
      hints: [
        'Build the STRICT Convex Hull (`cross <= 0` pop) so there are zero collinear intermediate points.',
        'If `k = H.size() <= 1`, answer is `0`; if `k == 2`, answer is `dist2(H[0], H[1])`. For `k >= 3`, initialize `j = 1` and advance `j = (j + 1) % k` while `cross(H[i], H[(i + 1) % k], H[(j + 1) % k]) > cross(H[i], H[(i + 1) % k], H[j])`, updating `best = max(best, dist2(H[i], H[j]), dist2(H[ni], H[j]))`!',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

struct Pt {
    long long x, y;
    bool operator<(const Pt& o) const { return x < o.x || (x == o.x && y < o.y); }
    bool operator==(const Pt& o) const { return x == o.x && y == o.y; }
};

__int128 cross(Pt a, Pt b, Pt c) {
    return (__int128)(b.x - a.x) * (c.y - a.y) - (__int128)(b.y - a.y) * (c.x - a.x);
}

__int128 dist2(Pt a, Pt b) {
    __int128 dx = a.x - b.x, dy = a.y - b.y;
    return dx * dx + dy * dy;
}

void print_u128(__int128 v) {
    if (v == 0) { cout << 0 << "\\n"; return; }
    string s;
    while (v > 0) { s.push_back(char('0' + (int)(v % 10))); v /= 10; }
    reverse(s.begin(), s.end());
    cout << s << "\\n";
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    if (!(cin >> n)) return 0;
    vector<Pt> pts(n);
    for (int i = 0; i < n; i++) cin >> pts[i].x >> pts[i].y;

    sort(pts.begin(), pts.end());
    pts.erase(unique(pts.begin(), pts.end()), pts.end());
    int m = (int)pts.size();

    vector<Pt> h;
    if (m <= 2) {
        h = pts;
    } else {
        for (int i = 0; i < m; i++) {
            while (h.size() >= 2 && cross(h[h.size() - 2], h.back(), pts[i]) <= 0) h.pop_back();
            h.push_back(pts[i]);
        }
        size_t low = h.size();
        for (int i = m - 2; i >= 0; i--) {
            while (h.size() > low && cross(h[h.size() - 2], h.back(), pts[i]) <= 0) h.pop_back();
            h.push_back(pts[i]);
        }
        h.pop_back();
    }

    int k = (int)h.size();
    __int128 best = 0;
    if (k == 2) {
        best = dist2(h[0], h[1]);
    } else if (k >= 3) {
        int j = 1;
        for (int i = 0; i < k; i++) {
            int ni = (i + 1) % k;
            while (cross(h[i], h[ni], h[(j + 1) % k]) > cross(h[i], h[ni], h[j])) {
                j = (j + 1) % k;
            }
            best = max(best, dist2(h[i], h[j]));
            best = max(best, dist2(h[ni], h[j]));
        }
    }
    print_u128(best);
    return 0;
}`,
        rust: `use std::io::{self, Read};

#[derive(Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
struct Pt {
    x: i64,
    y: i64,
}

fn cross(a: Pt, b: Pt, c: Pt) -> i128 {
    (b.x as i128 - a.x as i128) * (c.y as i128 - a.y as i128)
        - (b.y as i128 - a.y as i128) * (c.x as i128 - a.x as i128)
}

fn dist2(a: Pt, b: Pt) -> i128 {
    let dx = a.x as i128 - b.x as i128;
    let dy = a.y as i128 - b.y as i128;
    dx * dx + dy * dy
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
        pts.push(Pt {
            x: it.next().unwrap().parse().unwrap(),
            y: it.next().unwrap().parse().unwrap(),
        });
    }
    pts.sort();
    pts.dedup();
    let m = pts.len();

    let h = if m <= 2 {
        pts
    } else {
        let mut h = Vec::with_capacity(2 * m);
        for &p in &pts {
            while h.len() >= 2 && cross(h[h.len() - 2], h[h.len() - 1], p) <= 0 {
                h.pop();
            }
            h.push(p);
        }
        let low = h.len();
        for &p in pts[..m - 1].iter().rev() {
            while h.len() > low && cross(h[h.len() - 2], h[h.len() - 1], p) <= 0 {
                h.pop();
            }
            h.push(p);
        }
        h.pop();
        h
    };

    let k = h.len();
    let mut best = 0i128;
    if k == 2 {
        best = dist2(h[0], h[1]);
    } else if k >= 3 {
        let mut j = 1usize;
        for i in 0..k {
            let ni = (i + 1) % k;
            while cross(h[i], h[ni], h[(j + 1) % k]) > cross(h[i], h[ni], h[j]) {
                j = (j + 1) % k;
            }
            best = best.max(dist2(h[i], h[j])).max(dist2(h[ni], h[j]));
        }
    }
    println!("{}", best);
}`,
        java21: `import java.io.IOException;
import java.io.InputStream;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.Arrays;
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
            long sign = 1;
            if (c == '-') { sign = -1; c = readByte(); }
            long res = 0;
            while (c > ' ') { res = res * 10 + (c - '0'); c = readByte(); }
            return res * sign;
        }
    }

    static class Pt implements Comparable<Pt> {
        long x, y;
        Pt(long x, long y) { this.x = x; this.y = y; }
        public int compareTo(Pt o) { return x != o.x ? Long.compare(x, o.x) : Long.compare(y, o.y); }
    }

    static BigInteger cross(Pt a, Pt b, Pt c) {
        return BigInteger.valueOf(b.x - a.x).multiply(BigInteger.valueOf(c.y - a.y))
                .subtract(BigInteger.valueOf(b.y - a.y).multiply(BigInteger.valueOf(c.x - a.x)));
    }

    static BigInteger dist2(Pt a, Pt b) {
        BigInteger dx = BigInteger.valueOf(a.x - b.x);
        BigInteger dy = BigInteger.valueOf(a.y - b.y);
        return dx.multiply(dx).add(dy.multiply(dy));
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        long nIn = fs.nextLong();
        if (nIn == Long.MIN_VALUE) return;
        int n = (int) nIn;
        Pt[] raw = new Pt[n];
        for (int i = 0; i < n; i++) raw[i] = new Pt(fs.nextLong(), fs.nextLong());
        Arrays.sort(raw);

        List<Pt> pts = new ArrayList<>();
        for (Pt p : raw) {
            if (pts.isEmpty() || pts.get(pts.size() - 1).x != p.x || pts.get(pts.size() - 1).y != p.y) pts.add(p);
        }

        List<Pt> h = new ArrayList<>();
        if (pts.size() <= 2) {
            h.addAll(pts);
        } else {
            for (Pt p : pts) {
                while (h.size() >= 2 && cross(h.get(h.size() - 2), h.get(h.size() - 1), p).signum() <= 0) {
                    h.remove(h.size() - 1);
                }
                h.add(p);
            }
            int low = h.size();
            for (int i = pts.size() - 2; i >= 0; i--) {
                Pt p = pts.get(i);
                while (h.size() > low && cross(h.get(h.size() - 2), h.get(h.size() - 1), p).signum() <= 0) {
                    h.remove(h.size() - 1);
                }
                h.add(p);
            }
            h.remove(h.size() - 1);
        }

        int k = h.size();
        BigInteger best = BigInteger.ZERO;
        if (k == 2) {
            best = dist2(h.get(0), h.get(1));
        } else if (k >= 3) {
            int j = 1;
            for (int i = 0; i < k; i++) {
                int ni = (i + 1) % k;
                while (cross(h.get(i), h.get(ni), h.get((j + 1) % k))
                        .compareTo(cross(h.get(i), h.get(ni), h.get(j))) > 0) {
                    j = (j + 1) % k;
                }
                best = best.max(dist2(h.get(i), h.get(j))).max(dist2(h.get(ni), h.get(j)));
            }
        }
        System.out.println(best);
    }
}`,
        python3: `import sys

sys.setrecursionlimit(200000)

def cross(a, b, c) -> int:
    return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])

def dist2(a, b) -> int:
    return (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    n = int(next(it))
    pts = sorted(set((int(next(it)), int(next(it))) for _ in range(n)))
    if len(pts) <= 1:
        print(0)
        return
    if len(pts) == 2:
        print(dist2(pts[0], pts[1]))
        return

    lower, upper = [], []
    for p in pts:
        while len(lower) >= 2 and cross(lower[-2], lower[-1], p) <= 0:
            lower.pop()
        lower.append(p)
    for p in reversed(pts):
        while len(upper) >= 2 and cross(upper[-2], upper[-1], p) <= 0:
            upper.pop()
        upper.append(p)
    h = lower[:-1] + upper[:-1]

    k = len(h)
    best = 0
    if k == 2:
        best = dist2(h[0], h[1])
    else:
        j = 1
        for i in range(k):
            ni = (i + 1) % k
            while cross(h[i], h[ni], h[(j + 1) % k]) > cross(h[i], h[ni], h[j]):
                j = (j + 1) % k
            best = max(best, dist2(h[i], h[j]), dist2(h[ni], h[j]))
    print(best)

if __name__ == "__main__":
    solve()`,
        ruby: `def cross(a, b, c)
  (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
end

def dist2(a, b)
  (a[0] - b[0])**2 + (a[1] - b[1])**2
end

tokens = $stdin.read.split
exit if tokens.empty?
n = tokens[0].to_i
pts = Array.new(n) { |i| [tokens[1 + 2 * i].to_i, tokens[2 + 2 * i].to_i] }.uniq.sort

if pts.length <= 1
  puts 0
  exit
elsif pts.length == 2
  puts dist2(pts[0], pts[1])
  exit
end

lower = []
pts.each do |p|
  lower.pop while lower.length >= 2 && cross(lower[-2], lower[-1], p) <= 0
  lower << p
end
upper = []
pts.reverse_each do |p|
  upper.pop while upper.length >= 2 && cross(upper[-2], upper[-1], p) <= 0
  upper << p
end
h = lower[0...-1] + upper[0...-1]

k = h.length
best = 0
if k == 2
  best = dist2(h[0], h[1])
else
  j = 1
  k.times do |i|
    ni = (i + 1) % k
    j = (j + 1) % k while cross(h[i], h[ni], h[(j + 1) % k]) > cross(h[i], h[ni], h[j])
    best = [best, dist2(h[i], h[j]), dist2(h[ni], h[j])].max
  end
end
puts best`,
      },
    },
    {
      id: 'ch38-p3',
      tier: 'Boss',
      ratingRange: '2200–2450',
      title: 'Minimum Area Enclosing Rectangle & O(log N) Point-in-Convex-Polygon Queries',
      statement:
        'Given N points (3 <= N <= 10^5) forming a point cloud and M query points (1 <= M <= 10^5): (1) build the strict CCW Convex Hull and compute the Minimum Area of any enclosing rectangle (not necessarily axis-aligned) via 4-pointer Rotating Calipers to 6 decimal places, then (2) answer each query point with "IN" (inside or on boundary) or "OUT" in O(log N) per query.',
      constraints: '3 <= N <= 10^5, 1 <= M <= 10^5, -10^6 <= x, y <= 10^6',
      sampleInput: '4 3\n0 0\n4 0\n4 3\n0 3\n2 2\n4 3\n5 1',
      sampleOutput: '12.000000\nIN\nIN\nOUT',
      hints: [
        'For Minimum Area Enclosing Rectangle on hull `H` (`k >= 3`): iterate base edge `u = H[i] -> H[(i+1)%k]` (`vec = v - u`). Advance `top` via `cross(vec, ...)` maximum, advance `right` via `dot(vec, ...)` maximum, initialize `left = top` on step 0 and advance `left` via `dot(vec, ...)` minimum! Area for that edge is `(cross(u, v, H[top]) * (dot(vec, H[right]) - dot(vec, H[left]))) / |vec|^2`!',
        'For `O(log N)` Point-in-Convex-Polygon `H[0..k-1]`: reject if `cross(H[0], H[1], P) < 0` or `cross(H[0], H[k-1], P) > 0`; binary search `idx` in `[1, k - 2]` with largest `cross(H[0], H[idx], P) >= 0`, then check `cross(H[idx], H[idx + 1], P) >= 0` (and for `idx == 1` collinear on `H[0]H[1]`, verify bounding box!).',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

struct Pt {
    long long x, y;
    Pt operator-(const Pt& o) const { return {x - o.x, y - o.y}; }
    bool operator<(const Pt& o) const { return x < o.x || (x == o.x && y < o.y); }
    bool operator==(const Pt& o) const { return x == o.x && y == o.y; }
};

__int128 cross(Pt a, Pt b) {
    return (__int128)a.x * b.y - (__int128)a.y * b.x;
}

__int128 cross3(Pt a, Pt b, Pt c) {
    return cross(b - a, c - a);
}

__int128 dot(Pt a, Pt b) {
    return (__int128)a.x * b.x + (__int128)a.y * b.y;
}

bool on_seg(Pt a, Pt b, Pt p) {
    return cross3(a, b, p) == 0 && min(a.x, b.x) <= p.x && p.x <= max(a.x, b.x)
        && min(a.y, b.y) <= p.y && p.y <= max(a.y, b.y);
}

bool in_convex(const vector<Pt>& h, Pt p) {
    int k = (int)h.size();
    if (k == 0) return false;
    if (k == 1) return h[0] == p;
    if (k == 2) return on_seg(h[0], h[1], p);
    if (cross3(h[0], h[1], p) < 0 || cross3(h[0], h[k - 1], p) > 0) return false;
    if (cross3(h[0], h[1], p) == 0) return on_seg(h[0], h[1], p);
    if (cross3(h[0], h[k - 1], p) == 0) return on_seg(h[0], h[k - 1], p);

    int lo = 1, hi = k - 1;
    while (hi - lo > 1) {
        int mid = (lo + hi) / 2;
        if (cross3(h[0], h[mid], p) >= 0) lo = mid;
        else hi = mid;
    }
    return cross3(h[lo], h[lo + 1], p) >= 0;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, m;
    if (!(cin >> n >> m)) return 0;
    vector<Pt> pts(n);
    for (int i = 0; i < n; i++) cin >> pts[i].x >> pts[i].y;

    sort(pts.begin(), pts.end());
    pts.erase(unique(pts.begin(), pts.end()), pts.end());
    int u = (int)pts.size();

    vector<Pt> h;
    if (u <= 2) {
        h = pts;
    } else {
        for (int i = 0; i < u; i++) {
            while (h.size() >= 2 && cross3(h[h.size() - 2], h.back(), pts[i]) <= 0) h.pop_back();
            h.push_back(pts[i]);
        }
        size_t low = h.size();
        for (int i = u - 2; i >= 0; i--) {
            while (h.size() > low && cross3(h[h.size() - 2], h.back(), pts[i]) <= 0) h.pop_back();
            h.push_back(pts[i]);
        }
        h.pop_back();
    }

    int k = (int)h.size();
    double minArea = 0.0;
    if (k >= 3) {
        minArea = 1e30;
        int top = 1, right = 1, left = -1;
        for (int i = 0; i < k; i++) {
            int ni = (i + 1) % k;
            Pt base = h[ni] - h[i];
            while (cross(base, h[(top + 1) % k] - h[i]) > cross(base, h[top] - h[i])) {
                top = (top + 1) % k;
            }
            while (dot(base, h[(right + 1) % k] - h[i]) > dot(base, h[right] - h[i])) {
                right = (right + 1) % k;
            }
            if (i == 0) left = top;
            while (dot(base, h[(left + 1) % k] - h[i]) < dot(base, h[left] - h[i])) {
                left = (left + 1) % k;
            }
            long double heightTimesBase = (long double)cross(base, h[top] - h[i]);
            long double widthTimesBase = (long double)(dot(base, h[right] - h[i]) - dot(base, h[left] - h[i]));
            long double baseLen2 = (long double)dot(base, base);
            minArea = min(minArea, (double)(heightTimesBase * widthTimesBase / baseLen2));
        }
    }

    cout << fixed << setprecision(6) << minArea << "\\n";
    while (m--) {
        Pt q;
        cin >> q.x >> q.y;
        cout << (in_convex(h, q) ? "IN" : "OUT") << "\\n";
    }
    return 0;
}`,
        rust: `use std::io::{self, Read};

#[derive(Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
struct Pt {
    x: i64,
    y: i64,
}

fn sub(a: Pt, b: Pt) -> (i128, i128) {
    (a.x as i128 - b.x as i128, a.y as i128 - b.y as i128)
}

fn cross(u: (i128, i128), v: (i128, i128)) -> i128 {
    u.0 * v.1 - u.1 * v.0
}

fn dot(u: (i128, i128), v: (i128, i128)) -> i128 {
    u.0 * v.0 + u.1 * v.1
}

fn cross3(a: Pt, b: Pt, c: Pt) -> i128 {
    cross(sub(b, a), sub(c, a))
}

fn on_seg(a: Pt, b: Pt, p: Pt) -> bool {
    cross3(a, b, p) == 0
        && a.x.min(b.x) <= p.x && p.x <= a.x.max(b.x)
        && a.y.min(b.y) <= p.y && p.y <= a.y.max(b.y)
}

fn in_convex(h: &[Pt], p: Pt) -> bool {
    let k = h.len();
    if k == 0 {
        return false;
    }
    if k == 1 {
        return h[0] == p;
    }
    if k == 2 {
        return on_seg(h[0], h[1], p);
    }
    if cross3(h[0], h[1], p) < 0 || cross3(h[0], h[k - 1], p) > 0 {
        return false;
    }
    if cross3(h[0], h[1], p) == 0 {
        return on_seg(h[0], h[1], p);
    }
    if cross3(h[0], h[k - 1], p) == 0 {
        return on_seg(h[0], h[k - 1], p);
    }
    let (mut lo, mut hi) = (1usize, k - 1);
    while hi - lo > 1 {
        let mid = (lo + hi) / 2;
        if cross3(h[0], h[mid], p) >= 0 {
            lo = mid;
        } else {
            hi = mid;
        }
    }
    cross3(h[lo], h[lo + 1], p) >= 0
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let n: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };
    let m: usize = it.next().unwrap().parse().unwrap();

    let mut pts = Vec::with_capacity(n);
    for _ in 0..n {
        pts.push(Pt {
            x: it.next().unwrap().parse().unwrap(),
            y: it.next().unwrap().parse().unwrap(),
        });
    }
    pts.sort();
    pts.dedup();
    let u = pts.len();

    let h = if u <= 2 {
        pts
    } else {
        let mut h = Vec::with_capacity(2 * u);
        for &p in &pts {
            while h.len() >= 2 && cross3(h[h.len() - 2], h[h.len() - 1], p) <= 0 {
                h.pop();
            }
            h.push(p);
        }
        let low = h.len();
        for &p in pts[..u - 1].iter().rev() {
            while h.len() > low && cross3(h[h.len() - 2], h[h.len() - 1], p) <= 0 {
                h.pop();
            }
            h.push(p);
        }
        h.pop();
        h
    };

    let k = h.len();
    let mut min_area = 0.0f64;
    if k >= 3 {
        min_area = 1e30;
        let (mut top, mut right, mut left) = (1usize, 1usize, 0usize);
        for i in 0..k {
            let ni = (i + 1) % k;
            let base = sub(h[ni], h[i]);
            while cross(base, sub(h[(top + 1) % k], h[i])) > cross(base, sub(h[top], h[i])) {
                top = (top + 1) % k;
            }
            while dot(base, sub(h[(right + 1) % k], h[i])) > dot(base, sub(h[right], h[i])) {
                right = (right + 1) % k;
            }
            if i == 0 {
                left = top;
            }
            while dot(base, sub(h[(left + 1) % k], h[i])) < dot(base, sub(h[left], h[i])) {
                left = (left + 1) % k;
            }
            let h_b = cross(base, sub(h[top], h[i])) as f64;
            let w_b = (dot(base, sub(h[right], h[i])) - dot(base, sub(h[left], h[i]))) as f64;
            let b2 = dot(base, base) as f64;
            min_area = min_area.min(h_b * w_b / b2);
        }
    }

    let mut out = format!("{:.6}\\n", min_area);
    for _ in 0..m {
        let q = Pt {
            x: it.next().unwrap().parse().unwrap(),
            y: it.next().unwrap().parse().unwrap(),
        };
        out.push_str(if in_convex(&h, q) { "IN\n" } else { "OUT\n" });
    }
    print!("{}", out);
}`,
        java21: `import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;

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

    static class Pt implements Comparable<Pt> {
        long x, y;
        Pt(long x, long y) { this.x = x; this.y = y; }
        public int compareTo(Pt o) { return x != o.x ? Long.compare(x, o.x) : Long.compare(y, o.y); }
    }

    static long cross(long ax, long ay, long bx, long by) { return ax * by - ay * bx; }
    static long dot(long ax, long ay, long bx, long by) { return ax * bx + ay * by; }
    static long cross3(Pt a, Pt b, Pt c) { return cross(b.x - a.x, b.y - a.y, c.x - a.x, c.y - a.y); }

    static boolean onSeg(Pt a, Pt b, Pt p) {
        return cross3(a, b, p) == 0 && Math.min(a.x, b.x) <= p.x && p.x <= Math.max(a.x, b.x)
            && Math.min(a.y, b.y) <= p.y && p.y <= Math.max(a.y, b.y);
    }

    static boolean inConvex(List<Pt> h, Pt p) {
        int k = h.size();
        if (k == 0) return false;
        if (k == 1) return h.get(0).x == p.x && h.get(0).y == p.y;
        if (k == 2) return onSeg(h.get(0), h.get(1), p);
        if (cross3(h.get(0), h.get(1), p) < 0 || cross3(h.get(0), h.get(k - 1), p) > 0) return false;
        if (cross3(h.get(0), h.get(1), p) == 0) return onSeg(h.get(0), h.get(1), p);
        if (cross3(h.get(0), h.get(k - 1), p) == 0) return onSeg(h.get(0), h.get(k - 1), p);
        int lo = 1, hi = k - 1;
        while (hi - lo > 1) {
            int mid = (lo + hi) >>> 1;
            if (cross3(h.get(0), h.get(mid), p) >= 0) lo = mid;
            else hi = mid;
        }
        return cross3(h.get(lo), h.get(lo + 1), p) >= 0;
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        long nIn = fs.nextLong();
        if (nIn == Long.MIN_VALUE) return;
        int n = (int) nIn, m = (int) fs.nextLong();

        Pt[] raw = new Pt[n];
        for (int i = 0; i < n; i++) raw[i] = new Pt(fs.nextLong(), fs.nextLong());
        Arrays.sort(raw);

        List<Pt> pts = new ArrayList<>();
        for (Pt p : raw) {
            if (pts.isEmpty() || pts.get(pts.size() - 1).x != p.x || pts.get(pts.size() - 1).y != p.y) pts.add(p);
        }

        List<Pt> h = new ArrayList<>();
        if (pts.size() <= 2) {
            h.addAll(pts);
        } else {
            for (Pt p : pts) {
                while (h.size() >= 2 && cross3(h.get(h.size() - 2), h.get(h.size() - 1), p) <= 0) h.remove(h.size() - 1);
                h.add(p);
            }
            int low = h.size();
            for (int i = pts.size() - 2; i >= 0; i--) {
                Pt p = pts.get(i);
                while (h.size() > low && cross3(h.get(h.size() - 2), h.get(h.size() - 1), p) <= 0) h.remove(h.size() - 1);
                h.add(p);
            }
            h.remove(h.size() - 1);
        }

        int k = h.size();
        double minArea = 0.0;
        if (k >= 3) {
            minArea = 1e30;
            int top = 1, right = 1, left = 0;
            for (int i = 0; i < k; i++) {
                int ni = (i + 1) % k;
                long bx = h.get(ni).x - h.get(i).x, by = h.get(ni).y - h.get(i).y;
                while (cross(bx, by, h.get((top + 1) % k).x - h.get(i).x, h.get((top + 1) % k).y - h.get(i).y)
                        > cross(bx, by, h.get(top).x - h.get(i).x, h.get(top).y - h.get(i).y)) {
                    top = (top + 1) % k;
                }
                while (dot(bx, by, h.get((right + 1) % k).x - h.get(i).x, h.get((right + 1) % k).y - h.get(i).y)
                        > dot(bx, by, h.get(right).x - h.get(i).x, h.get(right).y - h.get(i).y)) {
                    right = (right + 1) % k;
                }
                if (i == 0) left = top;
                while (dot(bx, by, h.get((left + 1) % k).x - h.get(i).x, h.get((left + 1) % k).y - h.get(i).y)
                        < dot(bx, by, h.get(left).x - h.get(i).x, h.get(left).y - h.get(i).y)) {
                    left = (left + 1) % k;
                }
                double hB = cross(bx, by, h.get(top).x - h.get(i).x, h.get(top).y - h.get(i).y);
                double wB = dot(bx, by, h.get(right).x - h.get(i).x, h.get(right).y - h.get(i).y)
                          - dot(bx, by, h.get(left).x - h.get(i).x, h.get(left).y - h.get(i).y);
                double b2 = (double) bx * bx + (double) by * by;
                minArea = Math.min(minArea, hB * wB / b2);
            }
        }

        StringBuilder sb = new StringBuilder();
        sb.append(String.format(Locale.US, "%.6f%n", minArea));
        while (m-- > 0) {
            Pt q = new Pt(fs.nextLong(), fs.nextLong());
            sb.append(inConvex(h, q) ? "IN\\n" : "OUT\\n");
        }
        System.out.print(sb);
    }
}`,
        python3: `import sys

sys.setrecursionlimit(200000)

def cross(bx: int, by: int, cx: int, cy: int) -> int:
    return bx * cy - by * cx

def dot(bx: int, by: int, cx: int, cy: int) -> int:
    return bx * cx + by * cy

def cross3(a, b, c) -> int:
    return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])

def on_seg(a, b, p) -> bool:
    return (cross3(a, b, p) == 0 and
            min(a[0], b[0]) <= p[0] <= max(a[0], b[0]) and
            min(a[1], b[1]) <= p[1] <= max(a[1], b[1]))

def in_convex(h, p) -> bool:
    k = len(h)
    if k == 0:
        return False
    if k == 1:
        return h[0] == p
    if k == 2:
        return on_seg(h[0], h[1], p)
    if cross3(h[0], h[1], p) < 0 or cross3(h[0], h[-1], p) > 0:
        return False
    if cross3(h[0], h[1], p) == 0:
        return on_seg(h[0], h[1], p)
    if cross3(h[0], h[-1], p) == 0:
        return on_seg(h[0], h[-1], p)
    lo, hi = 1, k - 1
    while hi - lo > 1:
        mid = (lo + hi) >> 1
        if cross3(h[0], h[mid], p) >= 0:
            lo = mid
        else:
            hi = mid
    return cross3(h[lo], h[lo + 1], p) >= 0

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    n, m = int(next(it)), int(next(it))
    pts = sorted(set((int(next(it)), int(next(it))) for _ in range(n)))

    if len(pts) <= 2:
        h = pts
    else:
        lower, upper = [], []
        for p in pts:
            while len(lower) >= 2 and cross3(lower[-2], lower[-1], p) <= 0:
                lower.pop()
            lower.append(p)
        for p in reversed(pts):
            while len(upper) >= 2 and cross3(upper[-2], upper[-1], p) <= 0:
                upper.pop()
            upper.append(p)
        h = lower[:-1] + upper[:-1]

    k = len(h)
    min_area = 0.0
    if k >= 3:
        min_area = 1e30
        top = right = 1
        left = 0
        for i in range(k):
            ni = (i + 1) % k
            bx, by = h[ni][0] - h[i][0], h[ni][1] - h[i][1]
            while (cross(bx, by, h[(top + 1) % k][0] - h[i][0], h[(top + 1) % k][1] - h[i][1]) >
                   cross(bx, by, h[top][0] - h[i][0], h[top][1] - h[i][1])):
                top = (top + 1) % k
            while (dot(bx, by, h[(right + 1) % k][0] - h[i][0], h[(right + 1) % k][1] - h[i][1]) >
                   dot(bx, by, h[right][0] - h[i][0], h[right][1] - h[i][1])):
                right = (right + 1) % k
            if i == 0:
                left = top
            while (dot(bx, by, h[(left + 1) % k][0] - h[i][0], h[(left + 1) % k][1] - h[i][1]) <
                   dot(bx, by, h[left][0] - h[i][0], h[left][1] - h[i][1])):
                left = (left + 1) % k
            hb = cross(bx, by, h[top][0] - h[i][0], h[top][1] - h[i][1])
            wb = (dot(bx, by, h[right][0] - h[i][0], h[right][1] - h[i][1]) -
                  dot(bx, by, h[left][0] - h[i][0], h[left][1] - h[i][1]))
            area = (hb * wb) / (bx * bx + by * by)
            if area < min_area:
                min_area = area

    out = [f"{min_area:.6f}"]
    for _ in range(m):
        q = (int(next(it)), int(next(it)))
        out.append("IN" if in_convex(h, q) else "OUT")
    sys.stdout.write("\\n".join(out) + "\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `def cross(bx, by, cx, cy)
  bx * cy - by * cx
end

def dot(bx, by, cx, cy)
  bx * cx + by * cy
end

def cross3(a, b, c)
  (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
end

def on_seg(a, b, p)
  cross3(a, b, p) == 0 &&
    [a[0], b[0]].min <= p[0] && p[0] <= [a[0], b[0]].max &&
    [a[1], b[1]].min <= p[1] && p[1] <= [a[1], b[1]].max
end

def in_convex(h, p)
  k = h.length
  return false if k == 0
  return h[0] == p if k == 1
  return on_seg(h[0], h[1], p) if k == 2
  return false if cross3(h[0], h[1], p) < 0 || cross3(h[0], h[-1], p) > 0
  return on_seg(h[0], h[1], p) if cross3(h[0], h[1], p) == 0
  return on_seg(h[0], h[-1], p) if cross3(h[0], h[-1], p) == 0
  lo = 1
  hi = k - 1
  while hi - lo > 1
    mid = (lo + hi) >> 1
    if cross3(h[0], h[mid], p) >= 0
      lo = mid
    else
      hi = mid
    end
  end
  cross3(h[lo], h[lo + 1], p) >= 0
end

tokens = $stdin.read.split
exit if tokens.empty?
n = tokens[0].to_i
m = tokens[1].to_i
idx = 2
pts = Array.new(n) do
  x = tokens[idx].to_i
  y = tokens[idx + 1].to_i
  idx += 2
  [x, y]
end.uniq.sort

if pts.length <= 2
  h = pts
else
  lower = []
  pts.each do |p|
    lower.pop while lower.length >= 2 && cross3(lower[-2], lower[-1], p) <= 0
    lower << p
  end
  upper = []
  pts.reverse_each do |p|
    upper.pop while upper.length >= 2 && cross3(upper[-2], upper[-1], p) <= 0
    upper << p
  end
  h = lower[0...-1] + upper[0...-1]
end

k = h.length
min_area = 0.0
if k >= 3
  min_area = 1e30
  top = 1
  right = 1
  left = 0
  k.times do |i|
    ni = (i + 1) % k
    bx = h[ni][0] - h[i][0]
    by = h[ni][1] - h[i][1]
    top = (top + 1) % k while cross(bx, by, h[(top + 1) % k][0] - h[i][0], h[(top + 1) % k][1] - h[i][1]) > cross(bx, by, h[top][0] - h[i][0], h[top][1] - h[i][1])
    right = (right + 1) % k while dot(bx, by, h[(right + 1) % k][0] - h[i][0], h[(right + 1) % k][1] - h[i][1]) > dot(bx, by, h[right][0] - h[i][0], h[right][1] - h[i][1])
    left = top if i == 0
    left = (left + 1) % k while dot(bx, by, h[(left + 1) % k][0] - h[i][0], h[(left + 1) % k][1] - h[i][1]) < dot(bx, by, h[left][0] - h[i][0], h[left][1] - h[i][1])
    hb = cross(bx, by, h[top][0] - h[i][0], h[top][1] - h[i][1])
    wb = dot(bx, by, h[right][0] - h[i][0], h[right][1] - h[i][1]) - dot(bx, by, h[left][0] - h[i][0], h[left][1] - h[i][1])
    area = (hb * wb).to_f / (bx * bx + by * by)
    min_area = area if area < min_area
  end
end

out = [format("%.6f", min_area)]
m.times do
  q = [tokens[idx].to_i, tokens[idx + 1].to_i]
  idx += 2
  out << (in_convex(h, q) ? "IN" : "OUT")
end
puts out.join("\\n")`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'CSES',
      title: 'Convex Hull',
      difficulty: 'Medium / Geometry',
      url: 'https://cses.fi/problemset/task/2195',
      patternNote: 'Andrew’s Monotone Chain keeping collinear boundary vertices (`cross < 0` pop + all-collinear check).',
    },
    {
      platform: 'AtCoder',
      title: 'ABC296 G - Polygon and Points & ABC275 Ex',
      difficulty: '1800–2000',
      url: 'https://atcoder.jp/contests/abc296/tasks/abc296_g',
      patternNote: 'Direct O(log N) binary-search fan containment (`IN` / `ON` / `OUT`) inside a convex polygon.',
    },
    {
      platform: 'Codeforces',
      title: 'Robert Hood / Convex Diameter (CF 166B / Kattis roberthood)',
      difficulty: '1900–2100',
      url: 'https://codeforces.com/problemset/problem/166/B',
      patternNote: 'Strictly-inside O(log N) convex polygon check & O(N log N) rotating calipers farthest pair.',
    },
    {
      platform: 'CodeChef',
      title: 'Convex Hull & Rotating Calipers',
      difficulty: 'Hard',
      url: 'https://www.codechef.com/problems/CHEFHULL',
      patternNote: 'Minimize bounding rectangle area and compute maximum pairwise Euclidean distance via calipers.',
    },
    {
      platform: 'HackerRank',
      title: 'Convex Hull (Graham / Andrew Monotone Chain)',
      difficulty: 'Medium',
      url: 'https://www.hackerrank.com/challenges/convex-hull-fp/problem',
      patternNote: 'Compute exact convex perimeter without floating-point angle sorting.',
    },
    {
      platform: 'NeetCode 150',
      title: 'Erect the Fence',
      difficulty: 'Hard (LeetCode 587)',
      url: 'https://leetcode.com/problems/erect-the-fence/',
      patternNote: 'Exact Andrew’s Monotone Chain including collinear perimeter trees (`cross < 0` + deduplication).',
    },
  ],
  interviewNotes: [
    'Always prefer **Andrew’s Monotone Chain** over Graham Scan in interviews: lexicographic `(x, y)` sorting avoids choosing an anchor pole and `atan2()` tie-breaking bugs.',
    'Point-in-Convex-Polygon drops from `O(N)` winding-number ray-casting down to `O(log N)` wedge binary search—vital when `N, Q <= 2 * 10^5`.',
    'Know the **two** versions of the stack pop rule: `cross <= 0` removes collinear interior edge vertices (strict hull for calipers/binary search), while `cross < 0` preserves collinear boundary points.',
  ],
  projectBlueprint: {
    title: 'Robotics LiDAR Obstacle Bounding-Box & Collision Hull Engine',
    tagline: 'Compute real-time 2D oriented bounding boxes (OBB), obstacle clearance diameters, and O(log N) safety-zone collision checks from LiDAR point clouds.',
    stackSummary: 'C++20 Andrew Monotone Chain, 4-Pointer OBB Calipers, O(log H) Safety Collision Binary Search',
    asciiDiagram: `
+-------------------------+      +------------------------------------+
| Raw 2D LiDAR Scan Cloud | ---> | Andrew Monotone Chain O(N log N)   |
| (x, y) Obstacle Returns |      | Tight Strict CCW Obstacle Hull     |
+-------------------------+      +------------------------------------+
                                                   |
          +----------------------------------------+
          v
+-----------------------------------+     +----------------------------+
| 4-Pointer Rotating Calipers O(H)  | --> | Min-Area Oriented Bounding |
| + O(log H) Ray-Wedge Collision    |     | Box (OBB) & Collision Flag |
+-----------------------------------+     +----------------------------+`,
    milestones: [
      {
        id: 'm1',
        title: '1. Fast Lexicographic Point-Cloud Envelope Builder',
        detail: 'Deduplicate and wrap 2D LiDAR clusters into minimal CCW convex polygons using integer cross products.',
      },
      {
        id: 'm2',
        title: '2. 4-Caliper Oriented Bounding Box (OBB) Extractor',
        detail: 'Compute the minimum-area oriented bounding box and maximum obstacle span in linear `O(H)` time per frame.',
      },
      {
        id: 'm3',
        title: '3. Sub-Microsecond O(log H) Robot Trajectory Collision Probe',
        detail: 'Binary search robot waypoint coordinates against obstacle convex hulls in `O(log H)` per waypoint.',
      },
    ],
    starterCode: `// Robotics LiDAR Obstacle Bounding-Box & Collision Hull Engine (Runnable C++20 Prototype)
#include <bits/stdc++.h>
using namespace std;

struct Pt {
    long long x, y;
    Pt operator-(const Pt& o) const { return {x - o.x, y - o.y}; }
    bool operator<(const Pt& o) const { return x < o.x || (x == o.x && y < o.y); }
    bool operator==(const Pt& o) const { return x == o.x && y == o.y; }
};

long long cross(Pt a, Pt b) { return a.x * b.y - a.y * b.x; }
long long dot(Pt a, Pt b) { return a.x * b.x + a.y * b.y; }
long long cross3(Pt a, Pt b, Pt c) { return cross(b - a, c - a); }

int main() {
    vector<Pt> lidar = {{1, 2}, {3, 1}, {5, 2}, {4, 5}, {2, 4}, {3, 3}};
    sort(lidar.begin(), lidar.end());
    vector<Pt> hull;
    for (const Pt& p : lidar) {
        while (hull.size() >= 2 && cross3(hull[hull.size() - 2], hull.back(), p) <= 0) hull.pop_back();
        hull.push_back(p);
    }
    size_t low = hull.size();
    for (int i = (int)lidar.size() - 2; i >= 0; i--) {
        while (hull.size() > low && cross3(hull[hull.size() - 2], hull.back(), lidar[i]) <= 0) hull.pop_back();
        hull.push_back(lidar[i]);
    }
    hull.pop_back();

    int k = (int)hull.size(), top = 1, right = 1, left = 0;
    double bestOBB = 1e30;
    for (int i = 0; i < k; i++) {
        Pt base = hull[(i + 1) % k] - hull[i];
        while (cross(base, hull[(top + 1) % k] - hull[i]) > cross(base, hull[top] - hull[i])) top = (top + 1) % k;
        while (dot(base, hull[(right + 1) % k] - hull[i]) > dot(base, hull[right] - hull[i])) right = (right + 1) % k;
        if (i == 0) left = top;
        while (dot(base, hull[(left + 1) % k] - hull[i]) < dot(base, hull[left] - hull[i])) left = (left + 1) % k;
        double area = (double)cross(base, hull[top] - hull[i])
                    * (dot(base, hull[right] - hull[i]) - dot(base, hull[left] - hull[i]))
                    / (double)dot(base, base);
        bestOBB = min(bestOBB, area);
    }
    cout << "Hull Vertices: " << k << " | Min Oriented Bounding Box Area: " << bestOBB << "\\n";
    return 0;
}`,
  },
};
