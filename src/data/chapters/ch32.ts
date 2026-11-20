import type { TheoryChapter } from '../../types/vault';

export const CH32_GEOMETRY_2D_VECTORS: TheoryChapter = {
  slug: '2d-vectors-cross-product-orientation',
  topicId: 'sg-67',
  title: '2D Vectors, Cross Product, Segment Intersection & Polygon Area',
  domain: 'Strings & Geometry',
  ratingTier: '1400–1600',
  usacoDivision: 'Gold',
  subtitle:
    'Eliminate floating-point precision bugs forever using integer-exact 2D cross/dot products, CCW orientation predicates, bounding-box segment intersection, Shoelace polygon area, and Pick’s Theorem.',
  analogyTitle: 'The Integer Carpenter’s Square & Shoelace Fence Analogy',
  analogyBody:
    'If you compute angles with `atan2()` or slopes with `double`, two nearly-parallel segments at coordinates `(10^9, 10^9)` lose precision around the 15th digit and falsely pass or fail intersection checks! Instead, imagine standing at point `A`, looking toward point `B`, and checking whether point `C` sits to your **LEFT (`> 0`)**, **RIGHT (`< 0`)**, or **DEAD AHEAD (`== 0`)**. The **2D Cross Product** `(B - A) x (C - A) = (xb - xa)*(yc - ya) - (yb - ya)*(xc - xa)` answers that turn direction using **100% pure integer multiplication and subtraction**! Even better, summing `x_i * y_{i+1} - y_i * x_{i+1}` around any polygon’s perimeter acts like tightening a zigzagging **shoelace**, yielding EXACTLY `2 * Area` as a single integer!',
  prerequisites: [],
  traceTitle: 'Interactive CCW Orientation Predicate & Shoelace Polygon Area Trace',
  traceSubtitle:
    'Trace integer cross-product turn tests across triangle `(0,0) -> (4,0) -> (4,3) -> (0,3)` (unit rectangle) and verify `2 * Area` via the Shoelace sum.',
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Step 1: Compute Vector Cross Product Orientation(A, B, C) for Turn Direction',
      explanation:
        'Let A=(0,0), B=(4,0), C=(4,3). Vectors AB=(4,0) and AC=(4,3). Cross(AB, AC) = 4*3 - 0*4 = +12 > 0 -> Strictly Counter-Clockwise (LEFT turn)! Dot(AB, AC) = 4*4 + 0*3 = +16 > 0 (acute angle).',
      mode: 'array',
      arrays: [
        {
          name: 'Vertices P[0..3]',
          cells: [
            { index: 0, value: '(0, 0)', highlight: 'active' },
            { index: 1, value: '(4, 0)', highlight: 'active' },
            { index: 2, value: '(4, 3)', highlight: 'active' },
            { index: 3, value: '(0, 3)', highlight: 'neutral' },
          ],
        },
        {
          name: 'Predicate Values',
          cells: [
            { index: 0, value: 'AB=(4,0)', highlight: 'window' },
            { index: 1, value: 'AC=(4,3)', highlight: 'window' },
            { index: 2, value: 'Cross=+12 (CCW)', highlight: 'updated' },
            { index: 3, value: 'Dot=+16', highlight: 'neutral' },
          ],
        },
      ],
      variables: { Turn: 'LEFT (CCW > 0)', CrossProduct: 12, DotProduct: 16 },
    },
    {
      stepNumber: 2,
      title: 'Step 2: Shoelace Terms 0->1 and 1->2 Accumulate Signed Trapezoids',
      explanation:
        'Shoelace edge (0,0)->(4,0): x0*y1 - y0*x1 = 0*0 - 0*4 = 0. Edge (4,0)->(4,3): 4*3 - 0*4 = +12. Running twiceArea = 0 + 12 = 12.',
      mode: 'array',
      arrays: [
        {
          name: 'Shoelace Edge Terms (xi*yi+1 - yi*xi+1)',
          cells: [
            { index: 0, value: '0*0 - 0*4 = 0', highlight: 'updated' },
            { index: 1, value: '4*3 - 0*4 = +12', highlight: 'active' },
            { index: 2, value: 'pending', highlight: 'neutral' },
            { index: 3, value: 'pending', highlight: 'neutral' },
          ],
        },
      ],
      variables: { Edge0: 0, Edge1: 12, Running2Area: 12 },
    },
    {
      stepNumber: 3,
      title: 'Step 3: Shoelace Terms 2->3 and Closing Edge 3->0',
      explanation:
        'Edge (4,3)->(0,3): 4*3 - 3*0 = +12. Closing edge (0,3)->(0,0): 0*0 - 3*0 = 0. Total signed twiceArea = 0 + 12 + 12 + 0 = +24, so exact Area = 24 / 2 = 12!',
      mode: 'array',
      arrays: [
        {
          name: 'Shoelace Edge Terms (All 4 Edges)',
          cells: [
            { index: 0, value: '0', highlight: 'neutral' },
            { index: 1, value: '+12', highlight: 'neutral' },
            { index: 2, value: '+12', highlight: 'updated' },
            { index: 3, value: '0', highlight: 'updated' },
          ],
        },
        {
          name: 'Pick Theorem Check (B=14 boundary, I=6 inside)',
          cells: [
            { index: 0, value: '2*Area = 24', highlight: 'active' },
            { index: 1, value: 'B = 14', highlight: 'window' },
            { index: 2, value: 'I = (24-14+2)/2 = 6', highlight: 'updated' },
          ],
        },
      ],
      variables: { Total2Area: 24, ExactArea: '12.0', BoundaryLatticeB: 14, InteriorLatticeI: 6 },
    },
    {
      stepNumber: 4,
      title: 'Step 4: Collinear Bounding-Box Overlap Check for Segment Intersection',
      explanation:
        'Suppose segment AB=(0,0)-(4,0) and CD=(2,0)-(6,0). All 4 cross products equal 0! Orientation alone cannot distinguish overlapping segments from disjoint collinear segments ((0,0)-(1,0) vs (2,0)-(4,0)), so we verify 1D bounding-box overlap on both X and Y!',
      mode: 'array',
      arrays: [
        {
          name: 'Collinear Case: Cross Signs All 0',
          cells: [
            { index: 0, value: 'ori(A,B,C)=0', highlight: 'window' },
            { index: 1, value: 'ori(A,B,D)=0', highlight: 'window' },
            { index: 2, value: 'max(xA,xB)>=min(xC,xD)', highlight: 'active' },
            { index: 3, value: 'INTERSECT = YES', highlight: 'updated' },
          ],
        },
      ],
      variables: { XOverlap: '[2, 4]', YOverlap: '[0, 0]', CollinearIntersect: 'TRUE' },
    },
  ],
  reductionClues: [
    {
      clue: '"Check whether point C lies left, right, or collinear with directed ray A -> B"',
      translation:
        'Compute integer cross product `cross(B - A, C - A)`: `> 0` is CCW (left turn), `< 0` is CW (right turn), `== 0` is collinear—zero floating-point division or `atan2`!',
    },
    {
      clue: '"Determine if segments AB and CD intersect (including endpoints or collinear overlap)"',
      translation:
        'Two segments straddle each other iff `sign(ori(A,B,C)) * sign(ori(A,B,D)) <= 0` AND `sign(ori(C,D,A)) * sign(ori(C,D,B)) <= 0` PLUS bounding-box X/Y interval overlap (`max(minX1, minX2) <= min(maxX1, maxX2)` and similarly for Y)!',
    },
    {
      clue: '"Compute polygon area or number of strictly interior lattice points (Pick’s Theorem)"',
      translation:
        'Compute `twiceArea = |sum (x_i * y_{i+1} - y_i * x_{i+1})|` as an integer, boundary lattice points `B = sum gcd(|dx_i|, |dy_i|)`, and interior lattice points `I = (twiceArea - B + 2) / 2`!',
    },
    {
      clue: '"Classify arbitrary query points P against a non-convex simple polygon (INSIDE / OUTSIDE / BOUNDARY)"',
      translation:
        'First test every edge `V_i V_{i+1}` with `onSegment(V_i, V_{i+1}, P)` for `BOUNDARY`; otherwise use horizontal ray-casting (using `yi > py != yj > py` and integer cross-product sign check without dividing!) or integer winding numbers!',
    },
  ],
  timeComplexity: 'Orientation / Segment Intersection: O(1) | Polygon Area / Point-in-Polygon: O(N)',
  spaceComplexity: 'O(N) for Polygon Vertices, O(1) Auxiliary',
  pitfalls: [
    {
      type: 'WA',
      title: '64-Bit Overflow When Subtracting Coordinates Up to 10^9 and Multiplying',
      detail:
        'If coordinates reach `10^9`, differences `dx, dy` reach `2 * 10^9`, and `dx1 * dy2 - dy1 * dx2` can reach `8 * 10^18`—plus multiplying two cross products `(ori1 * ori2 <= 0)` WILL overflow 64-bit `long long` (`9.22e18`)! Always reduce cross products to `sgn(val) in {-1, 0, +1}` BEFORE multiplying signs, and cast products to `__int128` / `i128`!',
    },
    {
      type: 'WA',
      title: 'Using Floating-Point Slope Division in Ray-Casting Point-in-Polygon',
      detail:
        'Horizontal ray-casting uses `px < x_i + (py - y_i) * (x_j - x_i) / (y_j - y_i)`. Dividing as `double` causes wrong parity near vertices! Rearrange into exact integers: ensure `y_i < y_j` by swapping if needed, then test `(py - y_i) * (x_j - x_i) > (px - x_i) * (y_j - y_i)` (strictly equivalent to `cross(P_j - P_i, Q - P_i) > 0`)!',
    },
    {
      type: 'WA',
      title: 'Forgetting Bounding-Box Check When Segments Are Collinear',
      detail:
        'If `A=(0,0), B=(1,0), C=(5,0), D=(6,0)`, all orientation signs are `0`, so `sign1 * sign2 <= 0` passes even though the segments are far apart! Always verify bounding-box overlap first.',
    },
    {
      type: 'WA',
      title: 'Dividing Shoelace 2*Area by 2 Using Integer Division Before Formatting',
      detail:
        'An integer-coordinate triangle can have half-integer area (e.g. `2*Area = 5`, `Area = 2.5`)! Keep `twiceArea` as a `long long` / `__int128` and print `twiceArea / 2` + `(twiceArea % 2 ? ".5" : ".0")` (or output `2 * Area` directly when requested).',
    },
  ],
  implementations: {
    cpp20: `#include <bits/stdc++.h>
using namespace std;

// Exact 2D Integer Vector & Orientation Geometry Library
struct Pt {
    long long x, y;
    Pt operator-(const Pt& o) const { return {x - o.x, y - o.y}; }
};

__int128 cross(Pt a, Pt b) {
    return (__int128)a.x * b.y - (__int128)a.y * b.x;
}

__int128 dot(Pt a, Pt b) {
    return (__int128)a.x * b.x + (__int128)a.y * b.y;
}

int sgn(__int128 v) {
    return (v > 0) - (v < 0);
}

int orient(Pt a, Pt b, Pt c) {
    return sgn(cross(b - a, c - a));
}

bool on_segment(Pt a, Pt b, Pt p) {
    return orient(a, b, p) == 0 && dot(a - p, b - p) <= 0;
}

bool segments_intersect(Pt a, Pt b, Pt c, Pt d) {
    if (max(a.x, b.x) < min(c.x, d.x) || max(c.x, d.x) < min(a.x, b.x) ||
        max(a.y, b.y) < min(c.y, d.y) || max(c.y, d.y) < min(a.y, b.y)) {
        return false;
    }
    int o1 = orient(a, b, c), o2 = orient(a, b, d);
    int o3 = orient(c, d, a), o4 = orient(c, d, b);
    return o1 * o2 <= 0 && o3 * o4 <= 0;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int t;
    if (!(cin >> t)) return 0;
    while (t--) {
        Pt a, b, c, d;
        cin >> a.x >> a.y >> b.x >> b.y >> c.x >> c.y >> d.x >> d.y;
        cout << (segments_intersect(a, b, c, d) ? "YES" : "NO") << "\\n";
    }
    return 0;
}`,
    rust: `use std::io::{self, Read};

#[derive(Clone, Copy)]
struct Pt {
    x: i128,
    y: i128,
}

fn cross(a: Pt, b: Pt) -> i128 {
    a.x * b.y - a.y * b.x
}

fn orient(a: Pt, b: Pt, c: Pt) -> i32 {
    let v = cross(Pt { x: b.x - a.x, y: b.y - a.y }, Pt { x: c.x - a.x, y: c.y - a.y });
    if v > 0 { 1 } else if v < 0 { -1 } else { 0 }
}

fn segments_intersect(a: Pt, b: Pt, c: Pt, d: Pt) -> bool {
    if a.x.max(b.x) < c.x.min(d.x) || c.x.max(d.x) < a.x.min(b.x)
        || a.y.max(b.y) < c.y.min(d.y) || c.y.max(d.y) < a.y.min(b.y)
    {
        return false;
    }
    let o1 = orient(a, b, c);
    let o2 = orient(a, b, d);
    let o3 = orient(c, d, a);
    let o4 = orient(c, d, b);
    o1 * o2 <= 0 && o3 * o4 <= 0
}

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
        let mut next_pt = || Pt {
            x: it.next().unwrap().parse().unwrap(),
            y: it.next().unwrap().parse().unwrap(),
        };
        let a = next_pt();
        let b = next_pt();
        let c = next_pt();
        let d = next_pt();
        out.push_str(if segments_intersect(a, b, c, d) { "YES\n" } else { "NO\n" });
    }
    print!("{}", out);
}`,
    java21: `import java.io.IOException;
import java.io.InputStream;
import java.math.BigInteger;

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

    static int orient(long ax, long ay, long bx, long by, long cx, long cy) {
        BigInteger dx1 = BigInteger.valueOf(bx - ax);
        BigInteger dy1 = BigInteger.valueOf(by - ay);
        BigInteger dx2 = BigInteger.valueOf(cx - ax);
        BigInteger dy2 = BigInteger.valueOf(cy - ay);
        return dx1.multiply(dy2).subtract(dy1.multiply(dx2)).signum();
    }

    static boolean segmentsIntersect(long ax, long ay, long bx, long by,
                                     long cx, long cy, long dx, long dy) {
        if (Math.max(ax, bx) < Math.min(cx, dx) || Math.max(cx, dx) < Math.min(ax, bx) ||
            Math.max(ay, by) < Math.min(cy, dy) || Math.max(cy, dy) < Math.min(ay, by)) {
            return false;
        }
        int o1 = orient(ax, ay, bx, by, cx, cy);
        int o2 = orient(ax, ay, bx, by, dx, dy);
        int o3 = orient(cx, cy, dx, dy, ax, ay);
        int o4 = orient(cx, cy, dx, dy, bx, by);
        return o1 * o2 <= 0 && o3 * o4 <= 0;
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        long tIn = fs.nextLong();
        if (tIn == Long.MIN_VALUE) return;
        int t = (int) tIn;
        StringBuilder sb = new StringBuilder();
        while (t-- > 0) {
            long ax = fs.nextLong(), ay = fs.nextLong();
            long bx = fs.nextLong(), by = fs.nextLong();
            long cx = fs.nextLong(), cy = fs.nextLong();
            long dx = fs.nextLong(), dy = fs.nextLong();
            sb.append(segmentsIntersect(ax, ay, bx, by, cx, cy, dx, dy) ? "YES\\n" : "NO\\n");
        }
        System.out.print(sb);
    }
}`,
    python3: `import sys

sys.setrecursionlimit(200000)

def orient(ax: int, ay: int, bx: int, by: int, cx: int, cy: int) -> int:
    v = (bx - ax) * (cy - ay) - (by - ay) * (cx - ax)
    return 1 if v > 0 else (-1 if v < 0 else 0)

def segments_intersect(ax: int, ay: int, bx: int, by: int,
                       cx: int, cy: int, dx: int, dy: int) -> bool:
    if (max(ax, bx) < min(cx, dx) or max(cx, dx) < min(ax, bx) or
            max(ay, by) < min(cy, dy) or max(cy, dy) < min(ay, by)):
        return False
    o1 = orient(ax, ay, bx, by, cx, cy)
    o2 = orient(ax, ay, bx, by, dx, dy)
    o3 = orient(cx, cy, dx, dy, ax, ay)
    o4 = orient(cx, cy, dx, dy, bx, by)
    return o1 * o2 <= 0 and o3 * o4 <= 0

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    t = int(next(it))
    out = []
    for _ in range(t):
        coords = [int(next(it)) for _ in range(8)]
        out.append("YES" if segments_intersect(*coords) else "NO")
    sys.stdout.write("\\n".join(out) + "\\n")

if __name__ == "__main__":
    solve()`,
    ruby: `def orient(ax, ay, bx, by, cx, cy)
  ((bx - ax) * (cy - ay) - (by - ay) * (cx - ax)) <=> 0
end

def segments_intersect(ax, ay, bx, by, cx, cy, dx, dy)
  return false if [ax, bx].max < [cx, dx].min || [cx, dx].max < [ax, bx].min
  return false if [ay, by].max < [cy, dy].min || [cy, dy].max < [ay, by].min
  o1 = orient(ax, ay, bx, by, cx, cy)
  o2 = orient(ax, ay, bx, by, dx, dy)
  o3 = orient(cx, cy, dx, dy, ax, ay)
  o4 = orient(cx, cy, dx, dy, bx, by)
  o1 * o2 <= 0 && o3 * o4 <= 0
end

tokens = $stdin.read.split
exit if tokens.empty?
t = tokens[0].to_i
idx = 1
out = []
t.times do
  c = tokens[idx, 8].map(&:to_i)
  idx += 8
  out << (segments_intersect(*c) ? "YES" : "NO")
end
puts out.join("\\n")`,
  },
  practiceProblems: [
    {
      id: 'ch32-p1',
      tier: 'Warmup',
      ratingRange: '1300–1500',
      title: 'Polygon Lattice Points & Exact 2*Area (Shoelace + Pick’s Theorem)',
      statement:
        'Given the N integer vertices of a simple polygon in order (N >= 3), compute three integers: twice its exact area (`2 * Area`), the number of strictly interior integer lattice points `I`, and the number of integer lattice points lying on its boundary `B`.',
      constraints: '3 <= N <= 10^5, -10^9 <= x_i, y_i <= 10^9',
      sampleInput: '4\n1 1\n5 1\n5 4\n1 4',
      sampleOutput: '24 6 14',
      hints: [
        'Shoelace formula gives `twiceArea = abs(sum_{i=0..N-1} (x_i * y_{i+1} - y_i * x_{i+1}))` where index `N` wraps to `0`.',
        'Number of lattice points along segment `(x_i, y_i) -> (x_{i+1}, y_{i+1})` excluding one endpoint is `gcd(|x_{i+1} - x_i|, |y_{i+1} - y_i|)`. Sum over all `N` edges to get `B`, then by Pick’s Theorem `Area = I + B/2 - 1` -> `I = (twiceArea - B + 2) / 2`!',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    if (!(cin >> n)) return 0;
    vector<long long> x(n), y(n);
    for (int i = 0; i < n; i++) cin >> x[i] >> y[i];

    __int128 twiceArea = 0;
    long long boundary = 0;
    for (int i = 0; i < n; i++) {
        int j = (i + 1) % n;
        twiceArea += (__int128)x[i] * y[j] - (__int128)y[i] * x[j];
        boundary += std::gcd(llabs(x[j] - x[i]), llabs(y[j] - y[i]));
    }
    if (twiceArea < 0) twiceArea = -twiceArea;
    __int128 interior = (twiceArea - boundary + 2) / 2;

    cout << (long long)twiceArea << " " << (long long)interior << " " << boundary << "\\n";
    return 0;
}`,
        rust: `use std::io::{self, Read};

fn gcd(mut a: i128, mut b: i128) -> i128 {
    a = a.abs();
    b = b.abs();
    while b != 0 {
        let r = a % b;
        a = b;
        b = r;
    }
    a
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let n: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };

    let mut x = Vec::with_capacity(n);
    let mut y = Vec::with_capacity(n);
    for _ in 0..n {
        x.push(it.next().unwrap().parse::<i128>().unwrap());
        y.push(it.next().unwrap().parse::<i128>().unwrap());
    }

    let mut twice_area: i128 = 0;
    let mut boundary: i128 = 0;
    for i in 0..n {
        let j = (i + 1) % n;
        twice_area += x[i] * y[j] - y[i] * x[j];
        boundary += gcd(x[j] - x[i], y[j] - y[i]);
    }
    twice_area = twice_area.abs();
    let interior = (twice_area - boundary + 2) / 2;
    println!("{} {} {}", twice_area, interior, boundary);
}`,
        java21: `import java.io.IOException;
import java.io.InputStream;
import java.math.BigInteger;

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

    static long gcd(long a, long b) {
        a = Math.abs(a);
        b = Math.abs(b);
        while (b != 0) {
            long r = a % b;
            a = b;
            b = r;
        }
        return a;
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        long nIn = fs.nextLong();
        if (nIn == Long.MIN_VALUE) return;
        int n = (int) nIn;
        long[] x = new long[n];
        long[] y = new long[n];
        for (int i = 0; i < n; i++) {
            x[i] = fs.nextLong();
            y[i] = fs.nextLong();
        }

        BigInteger twiceArea = BigInteger.ZERO;
        long boundary = 0;
        for (int i = 0; i < n; i++) {
            int j = (i + 1) % n;
            BigInteger cross = BigInteger.valueOf(x[i]).multiply(BigInteger.valueOf(y[j]))
                    .subtract(BigInteger.valueOf(y[i]).multiply(BigInteger.valueOf(x[j])));
            twiceArea = twiceArea.add(cross);
            boundary += gcd(x[j] - x[i], y[j] - y[i]);
        }
        twiceArea = twiceArea.abs();
        BigInteger interior = twiceArea.subtract(BigInteger.valueOf(boundary))
                .add(BigInteger.TWO).divide(BigInteger.TWO);
        System.out.println(twiceArea + " " + interior + " " + boundary);
    }
}`,
        python3: `import math
import sys

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    n = int(next(it))
    pts = [(int(next(it)), int(next(it))) for _ in range(n)]

    twice_area = 0
    boundary = 0
    for i in range(n):
        x1, y1 = pts[i]
        x2, y2 = pts[(i + 1) % n]
        twice_area += x1 * y2 - y1 * x2
        boundary += math.gcd(abs(x2 - x1), abs(y2 - y1))

    twice_area = abs(twice_area)
    interior = (twice_area - boundary + 2) // 2
    print(f"{twice_area} {interior} {boundary}")

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
n = tokens[0].to_i
pts = Array.new(n) { |i| [tokens[1 + 2 * i].to_i, tokens[2 + 2 * i].to_i] }

twice_area = 0
boundary = 0
n.times do |i|
  x1, y1 = pts[i]
  x2, y2 = pts[(i + 1) % n]
  twice_area += x1 * y2 - y1 * x2
  boundary += (x2 - x1).abs.gcd((y2 - y1).abs)
end

twice_area = twice_area.abs
interior = (twice_area - boundary + 2) / 2
puts "#{twice_area} #{interior} #{boundary}"`,
      },
    },
    {
      id: 'ch32-p2',
      tier: 'Standard',
      ratingRange: '1400–1650',
      title: 'Robust Line Segment Intersection With Collinearity & Endpoint Checks',
      statement:
        'Given T test cases, each containing two closed 2D line segments AB and CD with integer coordinates, output "PROPER" if they intersect strictly in the interior of both segments, "BOUNDARY" if they intersect only at an endpoint or overlap collinearly, or "NONE" if they are disjoint.',
      constraints: '1 <= T <= 10^5, -10^9 <= x, y <= 10^9',
      sampleInput: '3\n0 0 4 4\n0 4 4 0\n0 0 2 0\n2 0 5 0\n0 0 1 1\n2 2 3 3',
      sampleOutput: 'PROPER\nBOUNDARY\nNONE',
      hints: [
        'First check 1D X and Y bounding-box intervals: if disjoint, output `"NONE"`. Compute the four integer orientation signs `o1 = orient(A, B, C)`, `o2 = orient(A, B, D)`, `o3 = orient(C, D, A)`, `o4 = orient(C, D, B)`.',
        'If `o1 * o2 < 0 && o3 * o4 < 0`, they cross strictly in their interiors -> `"PROPER"`! Otherwise if `o1 * o2 <= 0 && o3 * o4 <= 0` (meaning at least one endpoint lies on the other segment or all 4 are collinear with overlapping bounding boxes), output `"BOUNDARY"`, else `"NONE"`.',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

struct Pt {
    long long x, y;
};

int orient(Pt a, Pt b, Pt c) {
    __int128 v = (__int128)(b.x - a.x) * (c.y - a.y) - (__int128)(b.y - a.y) * (c.x - a.x);
    return (v > 0) - (v < 0);
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int t;
    if (!(cin >> t)) return 0;
    while (t--) {
        Pt a, b, c, d;
        cin >> a.x >> a.y >> b.x >> b.y >> c.x >> c.y >> d.x >> d.y;
        if (max(a.x, b.x) < min(c.x, d.x) || max(c.x, d.x) < min(a.x, b.x) ||
            max(a.y, b.y) < min(c.y, d.y) || max(c.y, d.y) < min(a.y, b.y)) {
            cout << "NONE\\n";
            continue;
        }
        int o1 = orient(a, b, c), o2 = orient(a, b, d);
        int o3 = orient(c, d, a), o4 = orient(c, d, b);
        if (o1 * o2 < 0 && o3 * o4 < 0) cout << "PROPER\\n";
        else if (o1 * o2 <= 0 && o3 * o4 <= 0) cout << "BOUNDARY\\n";
        else cout << "NONE\\n";
    }
    return 0;
}`,
        rust: `use std::io::{self, Read};

#[derive(Clone, Copy)]
struct Pt {
    x: i128,
    y: i128,
}

fn orient(a: Pt, b: Pt, c: Pt) -> i32 {
    let v = (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
    if v > 0 { 1 } else if v < 0 { -1 } else { 0 }
}

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
        let mut next_pt = || Pt {
            x: it.next().unwrap().parse().unwrap(),
            y: it.next().unwrap().parse().unwrap(),
        };
        let (a, b, c, d) = (next_pt(), next_pt(), next_pt(), next_pt());
        if a.x.max(b.x) < c.x.min(d.x)
            || c.x.max(d.x) < a.x.min(b.x)
            || a.y.max(b.y) < c.y.min(d.y)
            || c.y.max(d.y) < a.y.min(b.y)
        {
            out.push_str("NONE\n");
            continue;
        }
        let (o1, o2) = (orient(a, b, c), orient(a, b, d));
        let (o3, o4) = (orient(c, d, a), orient(c, d, b));
        if o1 * o2 < 0 && o3 * o4 < 0 {
            out.push_str("PROPER\n");
        } else if o1 * o2 <= 0 && o3 * o4 <= 0 {
            out.push_str("BOUNDARY\n");
        } else {
            out.push_str("NONE\n");
        }
    }
    print!("{}", out);
}`,
        java21: `import java.io.IOException;
import java.io.InputStream;
import java.math.BigInteger;

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

    static int orient(long ax, long ay, long bx, long by, long cx, long cy) {
        BigInteger v = BigInteger.valueOf(bx - ax).multiply(BigInteger.valueOf(cy - ay))
                .subtract(BigInteger.valueOf(by - ay).multiply(BigInteger.valueOf(cx - ax)));
        return v.signum();
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        long tIn = fs.nextLong();
        if (tIn == Long.MIN_VALUE) return;
        int t = (int) tIn;
        StringBuilder sb = new StringBuilder();
        while (t-- > 0) {
            long ax = fs.nextLong(), ay = fs.nextLong();
            long bx = fs.nextLong(), by = fs.nextLong();
            long cx = fs.nextLong(), cy = fs.nextLong();
            long dx = fs.nextLong(), dy = fs.nextLong();
            if (Math.max(ax, bx) < Math.min(cx, dx) || Math.max(cx, dx) < Math.min(ax, bx) ||
                Math.max(ay, by) < Math.min(cy, dy) || Math.max(cy, dy) < Math.min(ay, by)) {
                sb.append("NONE\\n");
                continue;
            }
            int o1 = orient(ax, ay, bx, by, cx, cy);
            int o2 = orient(ax, ay, bx, by, dx, dy);
            int o3 = orient(cx, cy, dx, dy, ax, ay);
            int o4 = orient(cx, cy, dx, dy, bx, by);
            if (o1 * o2 < 0 && o3 * o4 < 0) sb.append("PROPER\\n");
            else if (o1 * o2 <= 0 && o3 * o4 <= 0) sb.append("BOUNDARY\\n");
            else sb.append("NONE\\n");
        }
        System.out.print(sb);
    }
}`,
        python3: `import sys

sys.setrecursionlimit(200000)

def orient(ax: int, ay: int, bx: int, by: int, cx: int, cy: int) -> int:
    v = (bx - ax) * (cy - ay) - (by - ay) * (cx - ax)
    return 1 if v > 0 else (-1 if v < 0 else 0)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    t = int(next(it))
    out = []
    for _ in range(t):
        ax, ay, bx, by, cx, cy, dx, dy = (int(next(it)) for _ in range(8))
        if (max(ax, bx) < min(cx, dx) or max(cx, dx) < min(ax, bx) or
                max(ay, by) < min(cy, dy) or max(cy, dy) < min(ay, by)):
            out.append("NONE")
            continue
        o1 = orient(ax, ay, bx, by, cx, cy)
        o2 = orient(ax, ay, bx, by, dx, dy)
        o3 = orient(cx, cy, dx, dy, ax, ay)
        o4 = orient(cx, cy, dx, dy, bx, by)
        if o1 * o2 < 0 and o3 * o4 < 0:
            out.append("PROPER")
        elif o1 * o2 <= 0 and o3 * o4 <= 0:
            out.append("BOUNDARY")
        else:
            out.append("NONE")
    sys.stdout.write("\\n".join(out) + "\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `def orient(ax, ay, bx, by, cx, cy)
  ((bx - ax) * (cy - ay) - (by - ay) * (cx - ax)) <=> 0
end

tokens = $stdin.read.split
exit if tokens.empty?
t = tokens[0].to_i
idx = 1
out = []
t.times do
  ax, ay, bx, by, cx, cy, dx, dy = tokens[idx, 8].map(&:to_i)
  idx += 8
  if [ax, bx].max < [cx, dx].min || [cx, dx].max < [ax, bx].min ||
     [ay, by].max < [cy, dy].min || [cy, dy].max < [ay, by].min
    out << "NONE"
    next
  end
  o1 = orient(ax, ay, bx, by, cx, cy)
  o2 = orient(ax, ay, bx, by, dx, dy)
  o3 = orient(cx, cy, dx, dy, ax, ay)
  o4 = orient(cx, cy, dx, dy, bx, by)
  if o1 * o2 < 0 && o3 * o4 < 0
    out << "PROPER"
  elsif o1 * o2 <= 0 && o3 * o4 <= 0
    out << "BOUNDARY"
  else
    out << "NONE"
  end
end
puts out.join("\\n")`,
      },
    },
    {
      id: 'ch32-p3',
      tier: 'Boss',
      ratingRange: '1650–1900',
      title: 'Exact Integer Point-in-Polygon Containment (Ray-Casting & Winding Number)',
      statement:
        'Given a simple (possibly non-convex) polygon with N vertices and M query points, classify each query point as "INSIDE", "OUTSIDE", or "BOUNDARY".',
      constraints: '3 <= N <= 1000, 1 <= M <= 1000, -10^9 <= x, y <= 10^9',
      sampleInput: '4 3\n0 0\n4 0\n4 4\n0 4\n2 2\n4 2\n5 5',
      sampleOutput: 'INSIDE\nBOUNDARY\nOUTSIDE',
      hints: [
        'First loop over all `N` edges `(A, B)`: check if `orient(A, B, P) == 0` AND `dot(A - P, B - P) <= 0`. If true for any edge, immediately output `"BOUNDARY"`.',
        'Otherwise compute the **Winding Number** (or integer ray-casting crossings) without floats! For each edge `A -> B`: if `A.y <= P.y && B.y > P.y && cross(B - A, P - A) > 0`, increment `winding++`; if `A.y > P.y && B.y <= P.y && cross(B - A, P - A) < 0`, decrement `winding--`. `P` is `"INSIDE"` iff `winding != 0`!',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

struct Pt {
    long long x, y;
};

__int128 cross(Pt a, Pt b, Pt c) {
    return (__int128)(b.x - a.x) * (c.y - a.y) - (__int128)(b.y - a.y) * (c.x - a.x);
}

bool on_segment(Pt a, Pt b, Pt p) {
    if (cross(a, b, p) != 0) return false;
    return min(a.x, b.x) <= p.x && p.x <= max(a.x, b.x) &&
           min(a.y, b.y) <= p.y && p.y <= max(a.y, b.y);
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, m;
    if (!(cin >> n >> m)) return 0;
    vector<Pt> poly(n);
    for (int i = 0; i < n; i++) cin >> poly[i].x >> poly[i].y;

    while (m--) {
        Pt p;
        cin >> p.x >> p.y;
        bool boundary = false;
        int winding = 0;
        for (int i = 0; i < n; i++) {
            Pt a = poly[i];
            Pt b = poly[(i + 1) % n];
            if (on_segment(a, b, p)) {
                boundary = true;
                break;
            }
            if (a.y <= p.y) {
                if (b.y > p.y && cross(a, b, p) > 0) winding++;
            } else {
                if (b.y <= p.y && cross(a, b, p) < 0) winding--;
            }
        }
        if (boundary) cout << "BOUNDARY\\n";
        else if (winding != 0) cout << "INSIDE\\n";
        else cout << "OUTSIDE\\n";
    }
    return 0;
}`,
        rust: `use std::io::{self, Read};

#[derive(Clone, Copy)]
struct Pt {
    x: i128,
    y: i128,
}

fn cross(a: Pt, b: Pt, c: Pt) -> i128 {
    (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x)
}

fn on_segment(a: Pt, b: Pt, p: Pt) -> bool {
    cross(a, b, p) == 0
        && a.x.min(b.x) <= p.x && p.x <= a.x.max(b.x)
        && a.y.min(b.y) <= p.y && p.y <= a.y.max(b.y)
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

    let mut poly = Vec::with_capacity(n);
    for _ in 0..n {
        poly.push(Pt {
            x: it.next().unwrap().parse().unwrap(),
            y: it.next().unwrap().parse().unwrap(),
        });
    }

    let mut out = String::new();
    for _ in 0..m {
        let p = Pt {
            x: it.next().unwrap().parse().unwrap(),
            y: it.next().unwrap().parse().unwrap(),
        };
        let mut boundary = false;
        let mut winding = 0i32;
        for i in 0..n {
            let a = poly[i];
            let b = poly[(i + 1) % n];
            if on_segment(a, b, p) {
                boundary = true;
                break;
            }
            if a.y <= p.y {
                if b.y > p.y && cross(a, b, p) > 0 {
                    winding += 1;
                }
            } else if b.y <= p.y && cross(a, b, p) < 0 {
                winding -= 1;
            }
        }
        if boundary {
            out.push_str("BOUNDARY\n");
        } else if winding != 0 {
            out.push_str("INSIDE\n");
        } else {
            out.push_str("OUTSIDE\n");
        }
    }
    print!("{}", out);
}`,
        java21: `import java.io.IOException;
import java.io.InputStream;
import java.math.BigInteger;

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

    static int crossSign(long ax, long ay, long bx, long by, long cx, long cy) {
        BigInteger v = BigInteger.valueOf(bx - ax).multiply(BigInteger.valueOf(cy - ay))
                .subtract(BigInteger.valueOf(by - ay).multiply(BigInteger.valueOf(cx - ax)));
        return v.signum();
    }

    static boolean onSegment(long ax, long ay, long bx, long by, long px, long py) {
        return crossSign(ax, ay, bx, by, px, py) == 0 &&
               Math.min(ax, bx) <= px && px <= Math.max(ax, bx) &&
               Math.min(ay, by) <= py && py <= Math.max(ay, by);
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        long nIn = fs.nextLong();
        if (nIn == Long.MIN_VALUE) return;
        int n = (int) nIn;
        int m = (int) fs.nextLong();
        long[] px = new long[n], py = new long[n];
        for (int i = 0; i < n; i++) {
            px[i] = fs.nextLong();
            py[i] = fs.nextLong();
        }

        StringBuilder sb = new StringBuilder();
        while (m-- > 0) {
            long qx = fs.nextLong(), qy = fs.nextLong();
            boolean boundary = false;
            int winding = 0;
            for (int i = 0; i < n; i++) {
                int j = (i + 1) % n;
                if (onSegment(px[i], py[i], px[j], py[j], qx, qy)) {
                    boundary = true;
                    break;
                }
                if (py[i] <= qy) {
                    if (py[j] > qy && crossSign(px[i], py[i], px[j], py[j], qx, qy) > 0) {
                        winding++;
                    }
                } else {
                    if (py[j] <= qy && crossSign(px[i], py[i], px[j], py[j], qx, qy) < 0) {
                        winding--;
                    }
                }
            }
            if (boundary) sb.append("BOUNDARY\\n");
            else if (winding != 0) sb.append("INSIDE\\n");
            else sb.append("OUTSIDE\\n");
        }
        System.out.print(sb);
    }
}`,
        python3: `import sys

sys.setrecursionlimit(200000)

def cross(ax: int, ay: int, bx: int, by: int, cx: int, cy: int) -> int:
    return (bx - ax) * (cy - ay) - (by - ay) * (cx - ax)

def on_segment(ax: int, ay: int, bx: int, by: int, px: int, py: int) -> bool:
    return (cross(ax, ay, bx, by, px, py) == 0 and
            min(ax, bx) <= px <= max(ax, bx) and
            min(ay, by) <= py <= max(ay, by))

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    n = int(next(it))
    m = int(next(it))
    poly = [(int(next(it)), int(next(it))) for _ in range(n)]

    out = []
    for _ in range(m):
        qx, qy = int(next(it)), int(next(it))
        boundary = False
        winding = 0
        for i in range(n):
            ax, ay = poly[i]
            bx, by = poly[(i + 1) % n]
            if on_segment(ax, ay, bx, by, qx, qy):
                boundary = True
                break
            if ay <= qy:
                if by > qy and cross(ax, ay, bx, by, qx, qy) > 0:
                    winding += 1
            else:
                if by <= qy and cross(ax, ay, bx, by, qx, qy) < 0:
                    winding -= 1
        if boundary:
            out.append("BOUNDARY")
        elif winding != 0:
            out.append("INSIDE")
        else:
            out.append("OUTSIDE")
    sys.stdout.write("\\n".join(out) + "\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `def cross(ax, ay, bx, by, cx, cy)
  (bx - ax) * (cy - ay) - (by - ay) * (cx - ax)
end

def on_segment(ax, ay, bx, by, px, py)
  cross(ax, ay, bx, by, px, py) == 0 &&
    [ax, bx].min <= px && px <= [ax, bx].max &&
    [ay, by].min <= py && py <= [ay, by].max
end

tokens = $stdin.read.split
exit if tokens.empty?
n = tokens[0].to_i
m = tokens[1].to_i
idx = 2
poly = Array.new(n) do
  x = tokens[idx].to_i
  y = tokens[idx + 1].to_i
  idx += 2
  [x, y]
end

out = []
m.times do
  qx = tokens[idx].to_i
  qy = tokens[idx + 1].to_i
  idx += 2
  boundary = false
  winding = 0
  n.times do |i|
    ax, ay = poly[i]
    bx, by = poly[(i + 1) % n]
    if on_segment(ax, ay, bx, by, qx, qy)
      boundary = true
      break
    end
    if ay <= qy
      winding += 1 if by > qy && cross(ax, ay, bx, by, qx, qy) > 0
    elsif by <= qy && cross(ax, ay, bx, by, qx, qy) < 0
      winding -= 1
    end
  end
  if boundary
    out << "BOUNDARY"
  elsif winding != 0
    out << "INSIDE"
  else
    out << "OUTSIDE"
  end
end
puts out.join("\\n")`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'CSES',
      title: 'Point Location Test, Polygon Area & Point in Polygon',
      difficulty: 'Geometry Core',
      url: 'https://cses.fi/problemset/task/2189',
      patternNote: 'Tasks 2189–2193 form the gold-standard integer computational geometry gauntlet.',
    },
    {
      platform: 'AtCoder',
      title: 'ABC296 F / G - Polygon and Points',
      difficulty: '1500–1700',
      url: 'https://atcoder.jp/contests/abc296/tasks/abc296_g',
      patternNote: 'Combine CCW orientation cross-product predicates with binary search on convex boundaries.',
    },
    {
      platform: 'Codeforces',
      title: 'Minimum Triangle / Polygon Queries (CF 600D / 166B)',
      difficulty: '1700–2000',
      url: 'https://codeforces.com/problemset/problem/166/B',
      patternNote: 'Strictly-inside point-in-polygon tests relying on exact integer cross products.',
    },
    {
      platform: 'CodeChef',
      title: 'Polygon Containment & Lattice Points',
      difficulty: 'Medium',
      url: 'https://www.codechef.com/problems/CHEFGEO',
      patternNote: 'Shoelace integer area combined with GCD boundary lattice counting (Pick’s Theorem).',
    },
    {
      platform: 'HackerRank',
      title: 'Points On a Line / Polygon Area',
      difficulty: 'Easy–Medium',
      url: 'https://www.hackerrank.com/challenges/points-on-a-line/problem',
      patternNote: 'Exact integer orientation predicates with zero division-by-zero edge cases.',
    },
    {
      platform: 'NeetCode 150',
      title: 'Max Points on a Line & Minimum Area Rectangle',
      difficulty: 'Medium–Hard (LeetCode 149)',
      url: 'https://leetcode.com/problems/max-points-on-a-line/',
      patternNote: 'Normalize slope vectors `(dx/g, dy/g)` using GCD instead of floating-point division.',
    },
  ],
  interviewNotes: [
    'Never divide `(y2 - y1) / (x2 - x1)` when testing collinearity or segment intersection in interviews—cross-multiply `dy1 * dx2 == dy2 * dx1` to stay 100% immune to vertical lines and float rounding.',
    'The Winding Number algorithm is strictly cleaner than naive ray-casting on vertex-grazing rays because `ay <= py` vs `by > py` handles horizontal edges and shared vertices cleanly.',
    'Explain Pick’s Theorem (`2A = 2I + B - 2`) alongside Shoelace—it is a classic follow-up for grid geometry interviews.',
  ],
  projectBlueprint: {
    title: 'Geospatial Boundary Collision Detector',
    tagline: 'Perform exact integer geofence containment, route-crossing collision checks, and parcel acreage computation for GIS mapping.',
    stackSummary: 'C++20 Exact Integer Geometry Core, Winding-Number Geofence Engine, Shoelace Area Calculator',
    asciiDiagram: `
+------------------------------+      +------------------------------------+
| GPS Parcel Polygons (int64)  | ---> | Exact Cross-Product & Winding Core |
| Geofence Vertices V[0..N-1]  |      | Zero Float-Epsilon Rounding Drift  |
+------------------------------+      +------------------------------------+
                                                       |
          +--------------------------------------------+
          v
+------------------------------------+     +-------------------------------+
| Segment Collision & Containment    | --> | INSIDE / BOUNDARY / CROSSING  |
| + Shoelace Exact Parcel Area       |     | Real-Time Spatial Alert Feed  |
+------------------------------------+     +-------------------------------+`,
    milestones: [
      {
        id: 'm1',
        title: '1. Exact Fixed-Point Coordinate Vector Kernel',
        detail: 'Represent lat/lon micro-degrees as 64-bit integers and compute 128-bit cross/dot products without precision loss.',
      },
      {
        id: 'm2',
        title: '2. Winding-Number Geofence Containment Engine',
        detail: 'Classify drone/vehicle telemetry pings as INSIDE, BOUNDARY, or OUTSIDE complex concave zoning polygons.',
      },
      {
        id: 'm3',
        title: '3. Route Segment Collision & Acreage Auditor',
        detail: 'Detect restricted airspace boundary crossings and audit exact parcel areas via Shoelace summation.',
      },
    ],
    starterCode: `// Geospatial Boundary Collision Detector (Runnable C++20 Prototype)
#include <bits/stdc++.h>
using namespace std;

struct Pt { long long x, y; };

__int128 cross(Pt a, Pt b, Pt c) {
    return (__int128)(b.x - a.x) * (c.y - a.y) - (__int128)(b.y - a.y) * (c.x - a.x);
}

bool on_seg(Pt a, Pt b, Pt p) {
    return cross(a, b, p) == 0 && min(a.x, b.x) <= p.x && p.x <= max(a.x, b.x)
        && min(a.y, b.y) <= p.y && p.y <= max(a.y, b.y);
}

string classify_point(const vector<Pt>& poly, Pt p) {
    int n = poly.size(), winding = 0;
    for (int i = 0; i < n; i++) {
        Pt a = poly[i], b = poly[(i + 1) % n];
        if (on_seg(a, b, p)) return "BOUNDARY";
        if (a.y <= p.y) {
            if (b.y > p.y && cross(a, b, p) > 0) winding++;
        } else if (b.y <= p.y && cross(a, b, p) < 0) {
            winding--;
        }
    }
    return winding != 0 ? "INSIDE" : "OUTSIDE";
}

int main() {
    vector<Pt> geofence = {{0, 0}, {10, 0}, {10, 10}, {5, 4}, {0, 10}};
    long long twiceArea = 0;
    for (size_t i = 0; i < geofence.size(); i++) {
        Pt a = geofence[i], b = geofence[(i + 1) % geofence.size()];
        twiceArea += a.x * b.y - a.y * b.x;
    }
    cout << "Geofence Area = " << abs(twiceArea) / 2.0 << "\\n";
    for (Pt ping : vector<Pt>{{2, 2}, {5, 6}, {5, 4}}) {
        cout << "Ping (" << ping.x << "," << ping.y << ") -> " << classify_point(geofence, ping) << "\\n";
    }
    return 0;
}`,
  },
};
