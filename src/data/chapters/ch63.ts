import type { TheoryChapter } from '../../types/vault';

export const CH63_HALF_PLANE_MINKOWSKI: TheoryChapter = {
  slug: 'half-plane-intersection-minkowski',
  topicId: 'sg-69',
  title: 'Half-Plane Intersection & Minkowski Sum',
  domain: 'Strings & Geometry',
  ratingTier: '2200–2600',
  usacoDivision: 'Platinum',
  subtitle: 'O(N log N) S&I deque intersection for linear constraint hulls and O(N + M) Minkowski sum configuration spaces',
  analogyTitle: 'Shaving Away Forbidden Regions and Folding Two Polygons Together',
  analogyBody:
    'Half-Plane Intersection is 2D Linear Programming in geometric disguise. Every directed line L cuts the Euclidean plane into two halves: keep everything to the left of L, discard everything to the right. Sorting all N half-planes by polar angle and sweeping them around 360 degrees maintains a convex feasible corridor on a double-ended deque. Whenever a newly introduced line slices off the intersection vertex formed by the two oldest lines on the front—or the two newest lines on the back—those redundant walls are popped from the deque.\n\nMinkowski Sum asks a dual robotics question: given a convex robot shape A and a convex obstacle B, where can the reference origin of A safely sit without colliding with B? Colliding means a + q = b, or equivalently a = b - q, meaning the robot origin is trapped inside the Minkowski sum B + (-A)! Because both convex polygons already have edges sorted by polar angle in CCW order, computing B + (-A) reduces to a single O(N + M) two-pointer merge of their edge vectors—zero O(N * M) convex hulls needed.',
  prerequisites: [
    { slug: 'convex-hull-andrew-monotone', title: 'Convex Hull (Andrew Monotone Chain) & Rotating Calipers' },
  ],
  traceTitle: 'S&I Half-Plane Deque Pruning',
  traceSubtitle: 'Intersecting a bounding box with a diagonal bevel cut (2,4) -> (0,2)',
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Sort Half-Planes by Polar Angle (Lowest Tightest Tie-Break)',
      explanation: 'Orient the 4 box boundaries CCW plus the cut (2,4)->(0,2) with direction (-2,-2). Sorting puts bottom (+x), right (+y), top (-x), diagonal (-2,-2), left (-y) in cyclic CCW order.',
      mode: 'array',
      arrays: [
        {
          name: 'Angle-Sorted Half-Planes',
          cells: [
            { index: 0, value: 'y >= 0', label: '0 deg', highlight: 'neutral' },
            { index: 1, value: 'x <= 4', label: '90 deg', highlight: 'neutral' },
            { index: 2, value: 'y <= 4', label: '180 deg', highlight: 'neutral' },
            { index: 3, value: 'cut', label: '225 deg', highlight: 'active' },
            { index: 4, value: 'x >= 0', label: '270 deg', highlight: 'neutral' },
          ],
        },
      ],
      variables: { sortedCount: 5, tieBreak: 'keep leftmost parallel line' },
    },
    {
      stepNumber: 2,
      title: 'Push Bottom, Right, and Top Walls onto Deque',
      explanation: 'Lines 0, 1, 2 form valid intersections (4, 0) and (4, 4). No intersection lies on the right side of the incoming line yet, so deque = [0, 1, 2].',
      mode: 'array',
      arrays: [
        {
          name: 'Active Deque Indices',
          cells: [
            { index: 0, value: 'y >= 0', label: 'front', highlight: 'window' },
            { index: 1, value: 'x <= 4', label: 'mid', highlight: 'window' },
            { index: 2, value: 'y <= 4', label: 'back', highlight: 'window' },
          ],
        },
      ],
      variables: { verticesSoFar: '(4,0), (4,4)', pops: 0 },
    },
    {
      stepNumber: 3,
      title: 'Introduce Diagonal Cut (2,4) -> (0,2)',
      explanation: 'Check inter(1, 2) = (4, 4): it lies to the LEFT of the cut (x - y >= -2 holds at (4,4)), so wall 2 is NOT popped. Append cut at back -> deque = [0, 1, 2, 3] creating vertex (2, 4).',
      mode: 'array',
      arrays: [
        {
          name: 'Active Deque Indices',
          cells: [
            { index: 0, value: 'y >= 0', label: 'front', highlight: 'window' },
            { index: 1, value: 'x <= 4', label: 'mid', highlight: 'window' },
            { index: 2, value: 'y <= 4', label: 'mid', highlight: 'window' },
            { index: 3, value: 'cut', label: 'back', highlight: 'updated' },
          ],
        },
      ],
      variables: { newVertex: '(2,4)', cutDirection: '(-2,-2)' },
    },
    {
      stepNumber: 4,
      title: 'Wrap-Around Closure with Left Wall x >= 0',
      explanation: 'Append line 4 (x >= 0) creating vertices (0, 2) and (0, 0). Final front/back wrap check confirms all 5 corners lie on the left of every neighbor. Shoelace area = 16 - 2 = 14.0.',
      mode: 'array',
      arrays: [
        {
          name: 'Final Feasible Polygon Vertices',
          cells: [
            { index: 0, value: '(0,0)', label: 'v0', highlight: 'updated' },
            { index: 1, value: '(4,0)', label: 'v1', highlight: 'updated' },
            { index: 2, value: '(4,4)', label: 'v2', highlight: 'updated' },
            { index: 3, value: '(2,4)', label: 'v3', highlight: 'updated' },
            { index: 4, value: '(0,2)', label: 'v4', highlight: 'updated' },
          ],
        },
      ],
      variables: { vertices: 5, area: '14.000000' },
    },
  ],
  reductionClues: [
    {
      clue: 'Find the kernel (points able to see every vertex) or feasible area of N linear inequalities a_i x + b_i y <= c_i',
      translation: 'Convert each inequality into a directed left half-plane and run O(N log N) S&I deque intersection.',
    },
    {
      clue: 'Maximize the radius R of a circle/disc inscribed inside a convex or star-shaped polygon',
      translation: 'Binary search R; shift every polygon edge inward along its unit left normal by R and test if Half-Plane Intersection is non-empty.',
    },
    {
      clue: 'Compute minimum Euclidean distance between two convex polygons P and Q, or test collision under translation',
      translation: 'Construct Minkowski sum M = P + (-Q) in O(N + M) via edge-vector merge, then test origin containment and distance from (0, 0) to M.',
    },
    {
      clue: 'Merge two convex hulls in DP (e.g., max-plus convolution / Minkowski sum of concave DP functions)',
      translation: 'Slope-ordered edge merge (identical to Minkowski sum) combines two convex curves in linear O(N + M) time.',
    },
  ],
  timeComplexity: 'O(N log N) for Half-Plane Intersection; O(N + M) for Minkowski Sum of convex polygons',
  spaceComplexity: 'O(N) for deque and polygon vertices',
  pitfalls: [
    {
      type: 'WA',
      title: 'Popping Back Before Popping Front vs. Antiparallel Half-Planes',
      detail: 'If two remaining half-planes have opposite angles (cross == 0, dot < 0), line-intersection divides by zero and yields NaN. Always guard intersect(a, b) with abs(cross) < EPS and immediately detect disjoint antiparallel pairs.',
    },
    {
      type: 'WA',
      title: 'Omitting Wrap-Around Pruning After the Sweep Loop',
      detail: 'Once all N sorted half-planes are processed, the final back lines can still invalidate intersections near the deque front (and vice versa). Always loop while q.size() >= 3 checking front against back intersections and back against front intersections.',
    },
    {
      type: 'WA',
      title: 'Floating-Point Instability Around atan2(-0.0, -1.0)',
      detail: 'Sorting angles with atan2(y, x) can disagree around +/- pi. Compare polar angles cleanly via upper/lower half-plane partitioning (half = 0 or 1) followed by cross(a.v, b.v) > 0.',
    },
    {
      type: 'RE',
      title: 'Unbounded Feasible Regions Without Sentinel Bounding Box',
      detail: 'If N inequalities leave an infinite open wedge, deque wrap-around fails or yields bogus finite area. Always inject a large CCW bounding box [-1e9, 1e9]^2 when finite closure is assumed or bounded area is queried.',
    },
  ],
  implementations: {
    cpp20: `#include <iostream>
#include <vector>
#include <deque>
#include <algorithm>
#include <cmath>
#include <iomanip>
using namespace std;

static constexpr double EPS = 1e-10;

struct Pt {
    double x, y;
    Pt operator+(const Pt& o) const { return {x + o.x, y + o.y}; }
    Pt operator-(const Pt& o) const { return {x - o.x, y - o.y}; }
    Pt operator*(double k) const { return {x * k, y * k}; }
};

double cross(const Pt& a, const Pt& b) {
    return a.x * b.y - a.y * b.x;
}

double dot(const Pt& a, const Pt& b) {
    return a.x * b.x + a.y * b.y;
}

struct HalfPlane {
    Pt p, v;
    int half() const {
        return (v.y < -EPS || (fabs(v.y) <= EPS && v.x < 0)) ? 1 : 0;
    }
};

bool onRight(const HalfPlane& l, const Pt& pt) {
    return cross(l.v, pt - l.p) < -EPS;
}

Pt intersectLine(const HalfPlane& a, const HalfPlane& b) {
    double denom = cross(a.v, b.v);
    double t = cross(b.p - a.p, b.v) / denom;
    return a.p + a.v * t;
}

vector<Pt> halfPlaneIntersect(vector<HalfPlane> lines) {
    // Sort counter-clockwise around 360 deg; for parallel lines keep leftmost (tightest) first
    sort(lines.begin(), lines.end(), [](const HalfPlane& a, const HalfPlane& b) {
        int ha = a.half(), hb = b.half();
        if (ha != hb) return ha < hb;
        double c = cross(a.v, b.v);
        if (fabs(c) > EPS) return c > 0;
        return cross(a.v, b.p - a.p) < 0;
    });

    deque<HalfPlane> q;
    for (int i = 0; i < static_cast<int>(lines.size()); ++i) {
        if (i > 0 && lines[i].half() == lines[i - 1].half() &&
            fabs(cross(lines[i].v, lines[i - 1].v)) <= EPS) {
            continue;
        }
        while (q.size() >= 2 && onRight(lines[i], intersectLine(q[q.size() - 2], q.back()))) {
            q.pop_back();
        }
        while (q.size() >= 2 && onRight(lines[i], intersectLine(q[0], q[1]))) {
            q.pop_front();
        }
        if (!q.empty() && fabs(cross(q.back().v, lines[i].v)) <= EPS && dot(q.back().v, lines[i].v) < 0) {
            if (cross(lines[i].v, q.back().p - lines[i].p) < -EPS) {
                return {};
            }
        }
        q.push_back(lines[i]);
    }

    while (q.size() >= 3 && onRight(q.front(), intersectLine(q[q.size() - 2], q.back()))) {
        q.pop_back();
    }
    while (q.size() >= 3 && onRight(q.back(), intersectLine(q[0], q[1]))) {
        q.pop_front();
    }

    if (q.size() < 3) return {};
    vector<Pt> poly;
    poly.reserve(q.size());
    for (int i = 0; i < static_cast<int>(q.size()); ++i) {
        const HalfPlane& a = q[i];
        const HalfPlane& b = q[(i + 1) % q.size()];
        if (fabs(cross(a.v, b.v)) <= EPS) return {};
        poly.push_back(intersectLine(a, b));
    }
    return poly;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    if (!(cin >> n)) return 0;
    vector<HalfPlane> lines;
    lines.reserve(n + 4);
    for (int i = 0; i < n; ++i) {
        double x1, y1, x2, y2;
        cin >> x1 >> y1 >> x2 >> y2;
        lines.push_back({{x1, y1}, {x2 - x1, y2 - y1}});
    }

    const double B = 1e9;
    lines.push_back({{-B, -B}, {1, 0}});
    lines.push_back({{B, -B}, {0, 1}});
    lines.push_back({{B, B}, {-1, 0}});
    lines.push_back({{-B, B}, {0, -1}});

    vector<Pt> poly = halfPlaneIntersect(move(lines));
    double area = 0.0;
    for (int i = 0; i < static_cast<int>(poly.size()); ++i) {
        area += cross(poly[i], poly[(i + 1) % poly.size()]);
    }
    cout << fixed << setprecision(6) << fabs(area) * 0.5 << "\n";
    return 0;
}
`,
    rust: `use std::cmp::Ordering;
use std::collections::VecDeque;
use std::io::{self, Read};

const EPS: f64 = 1e-10;

#[derive(Clone, Copy)]
struct Pt {
    x: f64,
    y: f64,
}

impl Pt {
    fn add(self, o: Self) -> Self {
        Pt { x: self.x + o.x, y: self.y + o.y }
    }
    fn sub(self, o: Self) -> Self {
        Pt { x: self.x - o.x, y: self.y - o.y }
    }
    fn mul(self, k: f64) -> Self {
        Pt { x: self.x * k, y: self.y * k }
    }
}

fn cross(a: Pt, b: Pt) -> f64 {
    a.x * b.y - a.y * b.x
}

fn dot(a: Pt, b: Pt) -> f64 {
    a.x * b.x + a.y * b.y
}

#[derive(Clone, Copy)]
struct HalfPlane {
    p: Pt,
    v: Pt,
}

impl HalfPlane {
    fn half(&self) -> u8 {
        if self.v.y < -EPS || (self.v.y.abs() <= EPS && self.v.x < 0.0) {
            1
        } else {
            0
        }
    }
}

fn on_right(l: HalfPlane, pt: Pt) -> bool {
    cross(l.v, pt.sub(l.p)) < -EPS
}

fn intersect_line(a: HalfPlane, b: HalfPlane) -> Pt {
    let denom = cross(a.v, b.v);
    let t = cross(b.p.sub(a.p), b.v) / denom;
    a.p.add(a.v.mul(t))
}

fn half_plane_intersect(mut lines: Vec<HalfPlane>) -> Vec<Pt> {
    lines.sort_by(|a, b| {
        let ha = a.half();
        let hb = b.half();
        if ha != hb {
            return ha.cmp(&hb);
        }
        let c = cross(a.v, b.v);
        if c.abs() > EPS {
            return if c > 0.0 { Ordering::Less } else { Ordering::Greater };
        }
        if cross(a.v, b.p.sub(a.p)) < 0.0 {
            Ordering::Less
        } else {
            Ordering::Greater
        }
    });

    let mut q: VecDeque<HalfPlane> = VecDeque::new();
    for i in 0..lines.len() {
        if i > 0
            && lines[i].half() == lines[i - 1].half()
            && cross(lines[i].v, lines[i - 1].v).abs() <= EPS
        {
            continue;
        }
        while q.len() >= 2 && on_right(lines[i], intersect_line(q[q.len() - 2], q[q.len() - 1])) {
            q.pop_back();
        }
        while q.len() >= 2 && on_right(lines[i], intersect_line(q[0], q[1])) {
            q.pop_front();
        }
        if let Some(&last) = q.back() {
            if cross(last.v, lines[i].v).abs() <= EPS
                && dot(last.v, lines[i].v) < 0.0
                && cross(lines[i].v, last.p.sub(lines[i].p)) < -EPS
            {
                return Vec::new();
            }
        }
        q.push_back(lines[i]);
    }

    while q.len() >= 3 && on_right(q[0], intersect_line(q[q.len() - 2], q[q.len() - 1])) {
        q.pop_back();
    }
    while q.len() >= 3 && on_right(q[q.len() - 1], intersect_line(q[0], q[1])) {
        q.pop_front();
    }

    if q.len() < 3 {
        return Vec::new();
    }
    let mut poly = Vec::with_capacity(q.len());
    for i in 0..q.len() {
        let a = q[i];
        let b = q[(i + 1) % q.len()];
        if cross(a.v, b.v).abs() <= EPS {
            return Vec::new();
        }
        poly.push(intersect_line(a, b));
    }
    poly
}

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let n: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };
    let mut lines = Vec::with_capacity(n + 4);
    for _ in 0..n {
        let x1: f64 = it.next().unwrap().parse().unwrap();
        let y1: f64 = it.next().unwrap().parse().unwrap();
        let x2: f64 = it.next().unwrap().parse().unwrap();
        let y2: f64 = it.next().unwrap().parse().unwrap();
        lines.push(HalfPlane {
            p: Pt { x: x1, y: y1 },
            v: Pt { x: x2 - x1, y: y2 - y1 },
        });
    }
    let b = 1e9;
    lines.push(HalfPlane { p: Pt { x: -b, y: -b }, v: Pt { x: 1.0, y: 0.0 } });
    lines.push(HalfPlane { p: Pt { x: b, y: -b }, v: Pt { x: 0.0, y: 1.0 } });
    lines.push(HalfPlane { p: Pt { x: b, y: b }, v: Pt { x: -1.0, y: 0.0 } });
    lines.push(HalfPlane { p: Pt { x: -b, y: b }, v: Pt { x: 0.0, y: -1.0 } });

    let poly = half_plane_intersect(lines);
    let mut area = 0.0;
    for i in 0..poly.len() {
        area += cross(poly[i], poly[(i + 1) % poly.len()]);
    }
    println!("{:.6}", area.abs() * 0.5);
}
`,
    java21: `import java.io.BufferedInputStream;
import java.io.IOException;
import java.util.ArrayDeque;
import java.util.Arrays;
import java.util.Locale;

public class Main {
    static final double EPS = 1e-10;

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

        String next() throws IOException {
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

        int nextInt() throws IOException {
            String s = next();
            return s == null ? -1 : Integer.parseInt(s);
        }

        double nextDouble() throws IOException {
            return Double.parseDouble(next());
        }
    }

    static class Pt {
        double x, y;
        Pt(double x, double y) { this.x = x; this.y = y; }
        Pt add(Pt o) { return new Pt(x + o.x, y + o.y); }
        Pt sub(Pt o) { return new Pt(x - o.x, y - o.y); }
        Pt mul(double k) { return new Pt(x * k, y * k); }
    }

    static double cross(Pt a, Pt b) { return a.x * b.y - a.y * b.x; }
    static double dot(Pt a, Pt b) { return a.x * b.x + a.y * b.y; }

    static class HalfPlane {
        Pt p, v;
        HalfPlane(Pt p, Pt v) { this.p = p; this.v = v; }
        int half() {
            return (v.y < -EPS || (Math.abs(v.y) <= EPS && v.x < 0)) ? 1 : 0;
        }
    }

    static boolean onRight(HalfPlane l, Pt pt) {
        return cross(l.v, pt.sub(l.p)) < -EPS;
    }

    static Pt intersectLine(HalfPlane a, HalfPlane b) {
        double denom = cross(a.v, b.v);
        double t = cross(b.p.sub(a.p), b.v) / denom;
        return a.p.add(a.v.mul(t));
    }

    static Pt[] halfPlaneIntersect(HalfPlane[] lines) {
        Arrays.sort(lines, (a, b) -> {
            int ha = a.half(), hb = b.half();
            if (ha != hb) return Integer.compare(ha, hb);
            double c = cross(a.v, b.v);
            if (Math.abs(c) > EPS) return c > 0 ? -1 : 1;
            return cross(a.v, b.p.sub(a.p)) < 0 ? -1 : 1;
        });

        HalfPlane[] dq = new HalfPlane[lines.length + 5];
        int head = 0, tail = 0;

        for (int i = 0; i < lines.length; i++) {
            if (i > 0 && lines[i].half() == lines[i - 1].half()
                    && Math.abs(cross(lines[i].v, lines[i - 1].v)) <= EPS) {
                continue;
            }
            while (tail - head >= 2 && onRight(lines[i], intersectLine(dq[tail - 2], dq[tail - 1]))) {
                tail--;
            }
            while (tail - head >= 2 && onRight(lines[i], intersectLine(dq[head], dq[head + 1]))) {
                head++;
            }
            if (tail > head && Math.abs(cross(dq[tail - 1].v, lines[i].v)) <= EPS
                    && dot(dq[tail - 1].v, lines[i].v) < 0
                    && cross(lines[i].v, dq[tail - 1].p.sub(lines[i].p)) < -EPS) {
                return new Pt[0];
            }
            dq[tail++] = lines[i];
        }

        while (tail - head >= 3 && onRight(dq[head], intersectLine(dq[tail - 2], dq[tail - 1]))) {
            tail--;
        }
        while (tail - head >= 3 && onRight(dq[tail - 1], intersectLine(dq[head], dq[head + 1]))) {
            head++;
        }

        int sz = tail - head;
        if (sz < 3) return new Pt[0];
        Pt[] poly = new Pt[sz];
        for (int i = 0; i < sz; i++) {
            HalfPlane a = dq[head + i];
            HalfPlane b = dq[head + (i + 1) % sz];
            if (Math.abs(cross(a.v, b.v)) <= EPS) return new Pt[0];
            poly[i] = intersectLine(a, b);
        }
        return poly;
    }

    public static void main(String[] args) throws Exception {
        Locale.setDefault(Locale.US);
        FastScanner fs = new FastScanner();
        int n = fs.nextInt();
        if (n == -1) return;

        HalfPlane[] lines = new HalfPlane[n + 4];
        for (int i = 0; i < n; i++) {
            double x1 = fs.nextDouble(), y1 = fs.nextDouble();
            double x2 = fs.nextDouble(), y2 = fs.nextDouble();
            lines[i] = new HalfPlane(new Pt(x1, y1), new Pt(x2 - x1, y2 - y1));
        }
        double B = 1e9;
        lines[n] = new HalfPlane(new Pt(-B, -B), new Pt(1, 0));
        lines[n + 1] = new HalfPlane(new Pt(B, -B), new Pt(0, 1));
        lines[n + 2] = new HalfPlane(new Pt(B, B), new Pt(-1, 0));
        lines[n + 3] = new HalfPlane(new Pt(-B, B), new Pt(0, -1));

        Pt[] poly = halfPlaneIntersect(lines);
        double area = 0.0;
        for (int i = 0; i < poly.length; i++) {
            area += cross(poly[i], poly[(i + 1) % poly.length]);
        }
        System.out.printf("%.6f%n", Math.abs(area) * 0.5);
    }
}
`,
    python3: `import sys
from collections import deque
from functools import cmp_to_key

sys.setrecursionlimit(200000)
EPS = 1e-10


def cross(ax: float, ay: float, bx: float, by: float) -> float:
    return ax * by - ay * bx


def dot(ax: float, ay: float, bx: float, by: float) -> float:
    return ax * bx + ay * by


def half_flag(vx: float, vy: float) -> int:
    return 1 if (vy < -EPS or (abs(vy) <= EPS and vx < 0.0)) else 0


def on_right(l: tuple[float, float, float, float], pt: tuple[float, float]) -> bool:
    px, py, vx, vy = l
    return cross(vx, vy, pt[0] - px, pt[1] - py) < -EPS


def intersect_line(
    a: tuple[float, float, float, float], b: tuple[float, float, float, float]
) -> tuple[float, float]:
    apx, apy, avx, avy = a
    bpx, bpy, bvx, bvy = b
    denom = cross(avx, avy, bvx, bvy)
    t = cross(bpx - apx, bpy - apy, bvx, bvy) / denom
    return (apx + avx * t, apy + avy * t)


def half_plane_intersect(lines: list[tuple[float, float, float, float]]) -> list[tuple[float, float]]:
    def cmp(a: tuple[float, float, float, float], b: tuple[float, float, float, float]) -> int:
        ha = half_flag(a[2], a[3])
        hb = half_flag(b[2], b[3])
        if ha != hb:
            return -1 if ha < hb else 1
        c = cross(a[2], a[3], b[2], b[3])
        if abs(c) > EPS:
            return -1 if c > 0 else 1
        return -1 if cross(a[2], a[3], b[0] - a[0], b[1] - a[1]) < 0 else 1

    lines.sort(key=cmp_to_key(cmp))
    q: deque[tuple[float, float, float, float]] = deque()
    for i, line in enumerate(lines):
        if (
            i > 0
            and half_flag(line[2], line[3]) == half_flag(lines[i - 1][2], lines[i - 1][3])
            and abs(cross(line[2], line[3], lines[i - 1][2], lines[i - 1][3])) <= EPS
        ):
            continue
        while len(q) >= 2 and on_right(line, intersect_line(q[-2], q[-1])):
            q.pop()
        while len(q) >= 2 and on_right(line, intersect_line(q[0], q[1])):
            q.popleft()
        if q:
            last = q[-1]
            if (
                abs(cross(last[2], last[3], line[2], line[3])) <= EPS
                and dot(last[2], last[3], line[2], line[3]) < 0
                and cross(line[2], line[3], last[0] - line[0], last[1] - line[1]) < -EPS
            ):
                return []
        q.append(line)

    while len(q) >= 3 and on_right(q[0], intersect_line(q[-2], q[-1])):
        q.pop()
    while len(q) >= 3 and on_right(q[-1], intersect_line(q[0], q[1])):
        q.popleft()

    if len(q) < 3:
        return []
    poly = []
    m = len(q)
    for i in range(m):
        a = q[i]
        b = q[(i + 1) % m]
        if abs(cross(a[2], a[3], b[2], b[3])) <= EPS:
            return []
        poly.append(intersect_line(a, b))
    return poly


def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    lines = []
    idx = 1
    for _ in range(n):
        x1 = float(data[idx])
        y1 = float(data[idx + 1])
        x2 = float(data[idx + 2])
        y2 = float(data[idx + 3])
        idx += 4
        lines.append((x1, y1, x2 - x1, y2 - y1))

    b = 1e9
    lines.extend([(-b, -b, 1.0, 0.0), (b, -b, 0.0, 1.0), (b, b, -1.0, 0.0), (-b, b, 0.0, -1.0)])
    poly = half_plane_intersect(lines)
    area = 0.0
    for i in range(len(poly)):
        x1, y1 = poly[i]
        x2, y2 = poly[(i + 1) % len(poly)]
        area += cross(x1, y1, x2, y2)
    print(f"{abs(area) * 0.5:.6f}")


if __name__ == "__main__":
    solve()
`,
    ruby: `EPS = 1e-10

def cross(ax, ay, bx, by)
  ax * by - ay * bx
end

def dot(ax, ay, bx, by)
  ax * bx + ay * by
end

def half_flag(vx, vy)
  (vy < -EPS || (vy.abs <= EPS && vx < 0.0)) ? 1 : 0
end

def on_right(l, pt)
  cross(l[2], l[3], pt[0] - l[0], pt[1] - l[1]) < -EPS
end

def intersect_line(a, b)
  denom = cross(a[2], a[3], b[2], b[3])
  t = cross(b[0] - a[0], b[1] - a[1], b[2], b[3]) / denom
  [a[0] + a[2] * t, a[1] + a[3] * t]
end

def half_plane_intersect(lines)
  sorted = lines.sort do |a, b|
    ha = half_flag(a[2], a[3])
    hb = half_flag(b[2], b[3])
    if ha != hb
      ha <=> hb
    else
      c = cross(a[2], a[3], b[2], b[3])
      if c.abs > EPS
        c > 0 ? -1 : 1
      else
        cross(a[2], a[3], b[0] - a[0], b[1] - a[1]) < 0 ? -1 : 1
      end
    end
  end

  q = []
  sorted.each_with_index do |line, i|
    if i > 0 && half_flag(line[2], line[3]) == half_flag(sorted[i - 1][2], sorted[i - 1][3]) &&
       cross(line[2], line[3], sorted[i - 1][2], sorted[i - 1][3]).abs <= EPS
      next
    end
    q.pop while q.length >= 2 && on_right(line, intersect_line(q[-2], q[-1]))
    q.shift while q.length >= 2 && on_right(line, intersect_line(q[0], q[1]))
    unless q.empty?
      last = q[-1]
      if cross(last[2], last[3], line[2], line[3]).abs <= EPS &&
         dot(last[2], last[3], line[2], line[3]) < 0 &&
         cross(line[2], line[3], last[0] - line[0], last[1] - line[1]) < -EPS
        return []
      end
    end
    q << line
  end

  q.pop while q.length >= 3 && on_right(q[0], intersect_line(q[-2], q[-1]))
  q.shift while q.length >= 3 && on_right(q[-1], intersect_line(q[0], q[1]))
  return [] if q.length < 3

  poly = []
  q.length.times do |i|
    a = q[i]
    b = q[(i + 1) % q.length]
    return [] if cross(a[2], a[3], b[2], b[3]).abs <= EPS
    poly << intersect_line(a, b)
  end
  poly
end

data = $stdin.read.split
exit if data.empty?
n = data[0].to_i
lines = []
idx = 1
n.times do
  x1 = data[idx].to_f
  y1 = data[idx + 1].to_f
  x2 = data[idx + 2].to_f
  y2 = data[idx + 3].to_f
  idx += 4
  lines << [x1, y1, x2 - x1, y2 - y1]
end

b = 1e9
lines << [-b, -b, 1.0, 0.0]
lines << [b, -b, 0.0, 1.0]
lines << [b, b, -1.0, 0.0]
lines << [-b, b, 0.0, -1.0]

poly = half_plane_intersect(lines)
area = 0.0
poly.length.times do |i|
  p1 = poly[i]
  p2 = poly[(i + 1) % poly.length]
  area += cross(p1[0], p1[1], p2[0], p2[1])
end
puts format('%.6f', area.abs * 0.5)
`,
  },
  practiceProblems: [
    {
      id: 'ch63-p1',
      tier: 'Warmup',
      ratingRange: '2100–2300',
      title: 'Feasible Region Area of Directed Half-Planes',
      statement:
        'You are given N directed lines in the 2D plane, each defined by two distinct points (x1, y1) -> (x2, y2). Each line constrains the feasible region to points lying on or to the left of the directed vector (x2 - x1, y2 - y1). Compute the bounded area of the intersection of all N half-planes (or 0.000000 if empty), accurate to 1e-6.',
      constraints: '3 <= N <= 20000, |coordinates| <= 10^6, intersection region is guaranteed bounded if non-empty',
      sampleInput: '5\n0 0 4 0\n4 0 4 4\n4 4 0 4\n0 4 0 0\n2 4 0 2',
      sampleOutput: '14.000000',
      hints: [
        'Represent each half-plane by anchor point p = (x1, y1) and direction vector v = (x2 - x1, y2 - y1).',
        'Sort half-planes by polar angle using half-plane flag + cross product; deduplicate parallel same-direction lines keeping only the tightest leftmost line.',
        'Maintain the convex frontier on a deque, perform wrap-around front/back pruning after the loop, and sum pairwise cross products of consecutive intersection vertices.',
      ],
      solutions: {
        cpp20: `#include <iostream>
#include <vector>
#include <deque>
#include <algorithm>
#include <cmath>
#include <iomanip>
using namespace std;

static constexpr double EPS = 1e-10;

struct Pt {
    double x, y;
    Pt operator+(const Pt& o) const { return {x + o.x, y + o.y}; }
    Pt operator-(const Pt& o) const { return {x - o.x, y - o.y}; }
    Pt operator*(double k) const { return {x * k, y * k}; }
};

double cross(const Pt& a, const Pt& b) { return a.x * b.y - a.y * b.x; }
double dot(const Pt& a, const Pt& b) { return a.x * b.x + a.y * b.y; }

struct HalfPlane {
    Pt p, v;
    int half() const {
        return (v.y < -EPS || (fabs(v.y) <= EPS && v.x < 0)) ? 1 : 0;
    }
};

bool onRight(const HalfPlane& l, const Pt& pt) {
    return cross(l.v, pt - l.p) < -EPS;
}

Pt intersectLine(const HalfPlane& a, const HalfPlane& b) {
    double t = cross(b.p - a.p, b.v) / cross(a.v, b.v);
    return a.p + a.v * t;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    if (!(cin >> n)) return 0;
    vector<HalfPlane> lines(n);
    for (int i = 0; i < n; ++i) {
        double x1, y1, x2, y2;
        cin >> x1 >> y1 >> x2 >> y2;
        lines[i] = {{x1, y1}, {x2 - x1, y2 - y1}};
    }

    sort(lines.begin(), lines.end(), [](const HalfPlane& a, const HalfPlane& b) {
        int ha = a.half(), hb = b.half();
        if (ha != hb) return ha < hb;
        double c = cross(a.v, b.v);
        if (fabs(c) > EPS) return c > 0;
        return cross(a.v, b.p - a.p) < 0;
    });

    deque<HalfPlane> q;
    for (int i = 0; i < n; ++i) {
        if (i > 0 && lines[i].half() == lines[i - 1].half() &&
            fabs(cross(lines[i].v, lines[i - 1].v)) <= EPS) {
            continue;
        }
        while (q.size() >= 2 && onRight(lines[i], intersectLine(q[q.size() - 2], q.back()))) q.pop_back();
        while (q.size() >= 2 && onRight(lines[i], intersectLine(q[0], q[1]))) q.pop_front();
        if (!q.empty() && fabs(cross(q.back().v, lines[i].v)) <= EPS && dot(q.back().v, lines[i].v) < 0) {
            if (cross(lines[i].v, q.back().p - lines[i].p) < -EPS) {
                cout << "0.000000\n";
                return 0;
            }
        }
        q.push_back(lines[i]);
    }

    while (q.size() >= 3 && onRight(q.front(), intersectLine(q[q.size() - 2], q.back()))) q.pop_back();
    while (q.size() >= 3 && onRight(q.back(), intersectLine(q[0], q[1]))) q.pop_front();

    if (q.size() < 3) {
        cout << "0.000000\n";
        return 0;
    }

    vector<Pt> poly;
    for (int i = 0; i < static_cast<int>(q.size()); ++i) {
        const auto& a = q[i];
        const auto& b = q[(i + 1) % q.size()];
        if (fabs(cross(a.v, b.v)) <= EPS) {
            cout << "0.000000\n";
            return 0;
        }
        poly.push_back(intersectLine(a, b));
    }

    double area = 0.0;
    for (int i = 0; i < static_cast<int>(poly.size()); ++i) {
        area += cross(poly[i], poly[(i + 1) % poly.size()]);
    }
    cout << fixed << setprecision(6) << fabs(area) * 0.5 << "\n";
    return 0;
}
`,
        rust: `use std::cmp::Ordering;
use std::collections::VecDeque;
use std::io::{self, Read};

const EPS: f64 = 1e-10;

#[derive(Clone, Copy)]
struct Pt {
    x: f64,
    y: f64,
}

impl Pt {
    fn add(self, o: Self) -> Self { Pt { x: self.x + o.x, y: self.y + o.y } }
    fn sub(self, o: Self) -> Self { Pt { x: self.x - o.x, y: self.y - o.y } }
    fn mul(self, k: f64) -> Self { Pt { x: self.x * k, y: self.y * k } }
}

fn cross(a: Pt, b: Pt) -> f64 { a.x * b.y - a.y * b.x }
fn dot(a: Pt, b: Pt) -> f64 { a.x * b.x + a.y * b.y }

#[derive(Clone, Copy)]
struct HalfPlane {
    p: Pt,
    v: Pt,
}

impl HalfPlane {
    fn half(&self) -> u8 {
        if self.v.y < -EPS || (self.v.y.abs() <= EPS && self.v.x < 0.0) { 1 } else { 0 }
    }
}

fn on_right(l: HalfPlane, pt: Pt) -> bool {
    cross(l.v, pt.sub(l.p)) < -EPS
}

fn intersect_line(a: HalfPlane, b: HalfPlane) -> Pt {
    let t = cross(b.p.sub(a.p), b.v) / cross(a.v, b.v);
    a.p.add(a.v.mul(t))
}

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let n: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };

    let mut lines = Vec::with_capacity(n);
    for _ in 0..n {
        let x1: f64 = it.next().unwrap().parse().unwrap();
        let y1: f64 = it.next().unwrap().parse().unwrap();
        let x2: f64 = it.next().unwrap().parse().unwrap();
        let y2: f64 = it.next().unwrap().parse().unwrap();
        lines.push(HalfPlane { p: Pt { x: x1, y: y1 }, v: Pt { x: x2 - x1, y: y2 - y1 } });
    }

    lines.sort_by(|a, b| {
        let ha = a.half();
        let hb = b.half();
        if ha != hb { return ha.cmp(&hb); }
        let c = cross(a.v, b.v);
        if c.abs() > EPS {
            return if c > 0.0 { Ordering::Less } else { Ordering::Greater };
        }
        if cross(a.v, b.p.sub(a.p)) < 0.0 { Ordering::Less } else { Ordering::Greater }
    });

    let mut q: VecDeque<HalfPlane> = VecDeque::new();
    for i in 0..n {
        if i > 0 && lines[i].half() == lines[i - 1].half()
            && cross(lines[i].v, lines[i - 1].v).abs() <= EPS
        {
            continue;
        }
        while q.len() >= 2 && on_right(lines[i], intersect_line(q[q.len() - 2], q[q.len() - 1])) {
            q.pop_back();
        }
        while q.len() >= 2 && on_right(lines[i], intersect_line(q[0], q[1])) {
            q.pop_front();
        }
        if let Some(&last) = q.back() {
            if cross(last.v, lines[i].v).abs() <= EPS
                && dot(last.v, lines[i].v) < 0.0
                && cross(lines[i].v, last.p.sub(lines[i].p)) < -EPS
            {
                println!("0.000000");
                return;
            }
        }
        q.push_back(lines[i]);
    }

    while q.len() >= 3 && on_right(q[0], intersect_line(q[q.len() - 2], q[q.len() - 1])) {
        q.pop_back();
    }
    while q.len() >= 3 && on_right(q[q.len() - 1], intersect_line(q[0], q[1])) {
        q.pop_front();
    }

    if q.len() < 3 {
        println!("0.000000");
        return;
    }

    let mut poly = Vec::with_capacity(q.len());
    for i in 0..q.len() {
        let a = q[i];
        let b = q[(i + 1) % q.len()];
        if cross(a.v, b.v).abs() <= EPS {
            println!("0.000000");
            return;
        }
        poly.push(intersect_line(a, b));
    }

    let mut area = 0.0;
    for i in 0..poly.len() {
        area += cross(poly[i], poly[(i + 1) % poly.len()]);
    }
    println!("{:.6}", area.abs() * 0.5);
}
`,
        java21: `import java.io.BufferedInputStream;
import java.io.IOException;
import java.util.Arrays;
import java.util.Locale;

public class Main {
    static final double EPS = 1e-10;

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

        String next() throws IOException {
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

        int nextInt() throws IOException {
            String s = next();
            return s == null ? -1 : Integer.parseInt(s);
        }

        double nextDouble() throws IOException {
            return Double.parseDouble(next());
        }
    }

    static class Pt {
        double x, y;
        Pt(double x, double y) { this.x = x; this.y = y; }
        Pt add(Pt o) { return new Pt(x + o.x, y + o.y); }
        Pt sub(Pt o) { return new Pt(x - o.x, y - o.y); }
        Pt mul(double k) { return new Pt(x * k, y * k); }
    }

    static double cross(Pt a, Pt b) { return a.x * b.y - a.y * b.x; }
    static double dot(Pt a, Pt b) { return a.x * b.x + a.y * b.y; }

    static class HalfPlane {
        Pt p, v;
        HalfPlane(Pt p, Pt v) { this.p = p; this.v = v; }
        int half() { return (v.y < -EPS || (Math.abs(v.y) <= EPS && v.x < 0)) ? 1 : 0; }
    }

    static boolean onRight(HalfPlane l, Pt pt) {
        return cross(l.v, pt.sub(l.p)) < -EPS;
    }

    static Pt intersectLine(HalfPlane a, HalfPlane b) {
        double t = cross(b.p.sub(a.p), b.v) / cross(a.v, b.v);
        return a.p.add(a.v.mul(t));
    }

    public static void main(String[] args) throws Exception {
        Locale.setDefault(Locale.US);
        FastScanner fs = new FastScanner();
        int n = fs.nextInt();
        if (n == -1) return;

        HalfPlane[] lines = new HalfPlane[n];
        for (int i = 0; i < n; i++) {
            double x1 = fs.nextDouble(), y1 = fs.nextDouble();
            double x2 = fs.nextDouble(), y2 = fs.nextDouble();
            lines[i] = new HalfPlane(new Pt(x1, y1), new Pt(x2 - x1, y2 - y1));
        }

        Arrays.sort(lines, (a, b) -> {
            int ha = a.half(), hb = b.half();
            if (ha != hb) return Integer.compare(ha, hb);
            double c = cross(a.v, b.v);
            if (Math.abs(c) > EPS) return c > 0 ? -1 : 1;
            return cross(a.v, b.p.sub(a.p)) < 0 ? -1 : 1;
        });

        HalfPlane[] dq = new HalfPlane[n + 2];
        int head = 0, tail = 0;

        for (int i = 0; i < n; i++) {
            if (i > 0 && lines[i].half() == lines[i - 1].half()
                    && Math.abs(cross(lines[i].v, lines[i - 1].v)) <= EPS) {
                continue;
            }
            while (tail - head >= 2 && onRight(lines[i], intersectLine(dq[tail - 2], dq[tail - 1]))) tail--;
            while (tail - head >= 2 && onRight(lines[i], intersectLine(dq[head], dq[head + 1]))) head++;
            if (tail > head && Math.abs(cross(dq[tail - 1].v, lines[i].v)) <= EPS
                    && dot(dq[tail - 1].v, lines[i].v) < 0
                    && cross(lines[i].v, dq[tail - 1].p.sub(lines[i].p)) < -EPS) {
                System.out.println("0.000000");
                return;
            }
            dq[tail++] = lines[i];
        }

        while (tail - head >= 3 && onRight(dq[head], intersectLine(dq[tail - 2], dq[tail - 1]))) tail--;
        while (tail - head >= 3 && onRight(dq[tail - 1], intersectLine(dq[head], dq[head + 1]))) head++;

        int sz = tail - head;
        if (sz < 3) {
            System.out.println("0.000000");
            return;
        }
        Pt[] poly = new Pt[sz];
        for (int i = 0; i < sz; i++) {
            HalfPlane a = dq[head + i];
            HalfPlane b = dq[head + (i + 1) % sz];
            if (Math.abs(cross(a.v, b.v)) <= EPS) {
                System.out.println("0.000000");
                return;
            }
            poly[i] = intersectLine(a, b);
        }

        double area = 0.0;
        for (int i = 0; i < sz; i++) area += cross(poly[i], poly[(i + 1) % sz]);
        System.out.printf("%.6f%n", Math.abs(area) * 0.5);
    }
}
`,
        python3: `import sys
from collections import deque
from functools import cmp_to_key

sys.setrecursionlimit(200000)
EPS = 1e-10


def cross(ax: float, ay: float, bx: float, by: float) -> float:
    return ax * by - ay * bx


def dot(ax: float, ay: float, bx: float, by: float) -> float:
    return ax * bx + ay * by


def half_flag(vx: float, vy: float) -> int:
    return 1 if (vy < -EPS or (abs(vy) <= EPS and vx < 0.0)) else 0


def on_right(l: tuple[float, float, float, float], pt: tuple[float, float]) -> bool:
    return cross(l[2], l[3], pt[0] - l[0], pt[1] - l[1]) < -EPS


def intersect_line(
    a: tuple[float, float, float, float], b: tuple[float, float, float, float]
) -> tuple[float, float]:
    t = cross(b[0] - a[0], b[1] - a[1], b[2], b[3]) / cross(a[2], a[3], b[2], b[3])
    return (a[0] + a[2] * t, a[1] + a[3] * t)


def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    lines = []
    idx = 1
    for _ in range(n):
        x1 = float(data[idx])
        y1 = float(data[idx + 1])
        x2 = float(data[idx + 2])
        y2 = float(data[idx + 3])
        idx += 4
        lines.append((x1, y1, x2 - x1, y2 - y1))

    def cmp(a: tuple[float, float, float, float], b: tuple[float, float, float, float]) -> int:
        ha = half_flag(a[2], a[3])
        hb = half_flag(b[2], b[3])
        if ha != hb:
            return -1 if ha < hb else 1
        c = cross(a[2], a[3], b[2], b[3])
        if abs(c) > EPS:
            return -1 if c > 0 else 1
        return -1 if cross(a[2], a[3], b[0] - a[0], b[1] - a[1]) < 0 else 1

    lines.sort(key=cmp_to_key(cmp))
    q: deque[tuple[float, float, float, float]] = deque()
    for i, line in enumerate(lines):
        if (
            i > 0
            and half_flag(line[2], line[3]) == half_flag(lines[i - 1][2], lines[i - 1][3])
            and abs(cross(line[2], line[3], lines[i - 1][2], lines[i - 1][3])) <= EPS
        ):
            continue
        while len(q) >= 2 and on_right(line, intersect_line(q[-2], q[-1])):
            q.pop()
        while len(q) >= 2 and on_right(line, intersect_line(q[0], q[1])):
            q.popleft()
        if q:
            last = q[-1]
            if (
                abs(cross(last[2], last[3], line[2], line[3])) <= EPS
                and dot(last[2], last[3], line[2], line[3]) < 0
                and cross(line[2], line[3], last[0] - line[0], last[1] - line[1]) < -EPS
            ):
                print("0.000000")
                return
        q.append(line)

    while len(q) >= 3 and on_right(q[0], intersect_line(q[-2], q[-1])):
        q.pop()
    while len(q) >= 3 and on_right(q[-1], intersect_line(q[0], q[1])):
        q.popleft()

    if len(q) < 3:
        print("0.000000")
        return
    poly = []
    m = len(q)
    for i in range(m):
        a = q[i]
        b = q[(i + 1) % m]
        if abs(cross(a[2], a[3], b[2], b[3])) <= EPS:
            print("0.000000")
            return
        poly.append(intersect_line(a, b))

    area = sum(cross(poly[i][0], poly[i][1], poly[(i + 1) % m][0], poly[(i + 1) % m][1]) for i in range(m))
    print(f"{abs(area) * 0.5:.6f}")


if __name__ == "__main__":
    solve()
`,
        ruby: `EPS = 1e-10

def cross(ax, ay, bx, by)
  ax * by - ay * bx
end

def dot(ax, ay, bx, by)
  ax * bx + ay * by
end

def half_flag(vx, vy)
  (vy < -EPS || (vy.abs <= EPS && vx < 0.0)) ? 1 : 0
end

def on_right(l, pt)
  cross(l[2], l[3], pt[0] - l[0], pt[1] - l[1]) < -EPS
end

def intersect_line(a, b)
  t = cross(b[0] - a[0], b[1] - a[1], b[2], b[3]) / cross(a[2], a[3], b[2], b[3])
  [a[0] + a[2] * t, a[1] + a[3] * t]
end

data = $stdin.read.split
exit if data.empty?
n = data[0].to_i
lines = []
idx = 1
n.times do
  x1 = data[idx].to_f
  y1 = data[idx + 1].to_f
  x2 = data[idx + 2].to_f
  y2 = data[idx + 3].to_f
  idx += 4
  lines << [x1, y1, x2 - x1, y2 - y1]
end

lines.sort! do |a, b|
  ha = half_flag(a[2], a[3])
  hb = half_flag(b[2], b[3])
  if ha != hb
    ha <=> hb
  else
    c = cross(a[2], a[3], b[2], b[3])
    c.abs > EPS ? (c > 0 ? -1 : 1) : (cross(a[2], a[3], b[0] - a[0], b[1] - a[1]) < 0 ? -1 : 1)
  end
end

q = []
lines.each_with_index do |line, i|
  if i > 0 && half_flag(line[2], line[3]) == half_flag(lines[i - 1][2], lines[i - 1][3]) &&
     cross(line[2], line[3], lines[i - 1][2], lines[i - 1][3]).abs <= EPS
    next
  end
  q.pop while q.length >= 2 && on_right(line, intersect_line(q[-2], q[-1]))
  q.shift while q.length >= 2 && on_right(line, intersect_line(q[0], q[1]))
  unless q.empty?
    last = q[-1]
    if cross(last[2], last[3], line[2], line[3]).abs <= EPS &&
       dot(last[2], last[3], line[2], line[3]) < 0 &&
       cross(line[2], line[3], last[0] - line[0], last[1] - line[1]) < -EPS
      puts '0.000000'
      exit
    end
  end
  q << line
end

q.pop while q.length >= 3 && on_right(q[0], intersect_line(q[-2], q[-1]))
q.shift while q.length >= 3 && on_right(q[-1], intersect_line(q[0], q[1]))

if q.length < 3
  puts '0.000000'
  exit
end

poly = []
q.length.times do |i|
  a = q[i]
  b = q[(i + 1) % q.length]
  if cross(a[2], a[3], b[2], b[3]).abs <= EPS
    puts '0.000000'
    exit
  end
  poly << intersect_line(a, b)
end

area = 0.0
poly.length.times do |i|
  p1 = poly[i]
  p2 = poly[(i + 1) % poly.length]
  area += cross(p1[0], p1[1], p2[0], p2[1])
end
puts format('%.6f', area.abs * 0.5)
`,
      },
    },
    {
      id: 'ch63-p2',
      tier: 'Standard',
      ratingRange: '2200–2450',
      title: 'Largest Inscribed Circle via Parallel Offset Half-Planes',
      statement:
        'Given a simple polygon with N vertices in counter-clockwise order (forming a convex or star-shaped polygon with non-empty interior), find the maximum radius R of a circle that fits entirely inside the polygon. Output R accurate to 1e-6.',
      constraints: '3 <= N <= 500, |coordinates| <= 10^5',
      sampleInput: '3\n0 0\n6 0\n0 8',
      sampleOutput: '2.000000',
      hints: [
        'For any candidate radius R, a circle centered at C fits inside the polygon if and only if C stays at distance >= R to the left of every directed edge P[i] -> P[i+1].',
        'Shifting edge P[i] -> P[i+1] inward along its unit left normal n = (-vy / |v|, vx / |v|) by distance R converts the condition into N directed half-planes.',
        'Binary search R across [0, 1e6] for ~65 iterations, checking whether Half-Plane Intersection produces a non-empty feasible region (watch out for antiparallel opposite lines!).',
      ],
      solutions: {
        cpp20: `#include <iostream>
#include <vector>
#include <deque>
#include <algorithm>
#include <cmath>
#include <iomanip>
using namespace std;

static constexpr double EPS = 1e-10;

struct Pt {
    double x, y;
    Pt operator+(const Pt& o) const { return {x + o.x, y + o.y}; }
    Pt operator-(const Pt& o) const { return {x - o.x, y - o.y}; }
    Pt operator*(double k) const { return {x * k, y * k}; }
};

double cross(const Pt& a, const Pt& b) { return a.x * b.y - a.y * b.x; }
double dot(const Pt& a, const Pt& b) { return a.x * b.x + a.y * b.y; }

struct HalfPlane {
    Pt p, v;
    int half() const {
        return (v.y < -EPS || (fabs(v.y) <= EPS && v.x < 0)) ? 1 : 0;
    }
};

bool onRight(const HalfPlane& l, const Pt& pt) {
    return cross(l.v, pt - l.p) < -EPS;
}

Pt intersectLine(const HalfPlane& a, const HalfPlane& b) {
    double t = cross(b.p - a.p, b.v) / cross(a.v, b.v);
    return a.p + a.v * t;
}

bool hasFeasiblePoint(vector<HalfPlane> lines) {
    sort(lines.begin(), lines.end(), [](const HalfPlane& a, const HalfPlane& b) {
        int ha = a.half(), hb = b.half();
        if (ha != hb) return ha < hb;
        double c = cross(a.v, b.v);
        if (fabs(c) > EPS) return c > 0;
        return cross(a.v, b.p - a.p) < 0;
    });

    deque<HalfPlane> q;
    for (int i = 0; i < static_cast<int>(lines.size()); ++i) {
        if (i > 0 && lines[i].half() == lines[i - 1].half() &&
            fabs(cross(lines[i].v, lines[i - 1].v)) <= EPS) {
            continue;
        }
        while (q.size() >= 2 && onRight(lines[i], intersectLine(q[q.size() - 2], q.back()))) q.pop_back();
        while (q.size() >= 2 && onRight(lines[i], intersectLine(q[0], q[1]))) q.pop_front();
        if (!q.empty() && fabs(cross(q.back().v, lines[i].v)) <= EPS && dot(q.back().v, lines[i].v) < 0) {
            if (cross(lines[i].v, q.back().p - lines[i].p) < -EPS) return false;
        }
        q.push_back(lines[i]);
    }
    while (q.size() >= 3 && onRight(q.front(), intersectLine(q[q.size() - 2], q.back()))) q.pop_back();
    while (q.size() >= 3 && onRight(q.back(), intersectLine(q[0], q[1]))) q.pop_front();

    if (q.size() < 3) return false;
    for (int i = 0; i < static_cast<int>(q.size()); ++i) {
        if (fabs(cross(q[i].v, q[(i + 1) % q.size()].v)) <= EPS) return false;
    }
    return true;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    if (!(cin >> n)) return 0;
    vector<Pt> poly(n);
    for (int i = 0; i < n; ++i) cin >> poly[i].x >> poly[i].y;

    vector<Pt> edgeDir(n), leftNorm(n);
    for (int i = 0; i < n; ++i) {
        Pt v = poly[(i + 1) % n] - poly[i];
        double len = hypot(v.x, v.y);
        edgeDir[i] = v;
        leftNorm[i] = {-v.y / len, v.x / len};
    }

    double lo = 0.0, hi = 1e6;
    for (int iter = 0; iter < 65; ++iter) {
        double mid = 0.5 * (lo + hi);
        vector<HalfPlane> lines(n);
        for (int i = 0; i < n; ++i) {
            lines[i] = {poly[i] + leftNorm[i] * mid, edgeDir[i]};
        }
        if (hasFeasiblePoint(move(lines))) lo = mid;
        else hi = mid;
    }

    cout << fixed << setprecision(6) << lo << "\n";
    return 0;
}
`,
        rust: `use std::cmp::Ordering;
use std::collections::VecDeque;
use std::io::{self, Read};

const EPS: f64 = 1e-10;

#[derive(Clone, Copy)]
struct Pt {
    x: f64,
    y: f64,
}

impl Pt {
    fn add(self, o: Self) -> Self { Pt { x: self.x + o.x, y: self.y + o.y } }
    fn sub(self, o: Self) -> Self { Pt { x: self.x - o.x, y: self.y - o.y } }
    fn mul(self, k: f64) -> Self { Pt { x: self.x * k, y: self.y * k } }
}

fn cross(a: Pt, b: Pt) -> f64 { a.x * b.y - a.y * b.x }
fn dot(a: Pt, b: Pt) -> f64 { a.x * b.x + a.y * b.y }

#[derive(Clone, Copy)]
struct HalfPlane {
    p: Pt,
    v: Pt,
}

impl HalfPlane {
    fn half(&self) -> u8 {
        if self.v.y < -EPS || (self.v.y.abs() <= EPS && self.v.x < 0.0) { 1 } else { 0 }
    }
}

fn on_right(l: HalfPlane, pt: Pt) -> bool {
    cross(l.v, pt.sub(l.p)) < -EPS
}

fn intersect_line(a: HalfPlane, b: HalfPlane) -> Pt {
    let t = cross(b.p.sub(a.p), b.v) / cross(a.v, b.v);
    a.p.add(a.v.mul(t))
}

fn feasible(mut lines: Vec<HalfPlane>) -> bool {
    lines.sort_by(|a, b| {
        let ha = a.half();
        let hb = b.half();
        if ha != hb { return ha.cmp(&hb); }
        let c = cross(a.v, b.v);
        if c.abs() > EPS {
            return if c > 0.0 { Ordering::Less } else { Ordering::Greater };
        }
        if cross(a.v, b.p.sub(a.p)) < 0.0 { Ordering::Less } else { Ordering::Greater }
    });

    let mut q: VecDeque<HalfPlane> = VecDeque::new();
    for i in 0..lines.len() {
        if i > 0 && lines[i].half() == lines[i - 1].half()
            && cross(lines[i].v, lines[i - 1].v).abs() <= EPS
        {
            continue;
        }
        while q.len() >= 2 && on_right(lines[i], intersect_line(q[q.len() - 2], q[q.len() - 1])) {
            q.pop_back();
        }
        while q.len() >= 2 && on_right(lines[i], intersect_line(q[0], q[1])) {
            q.pop_front();
        }
        if let Some(&last) = q.back() {
            if cross(last.v, lines[i].v).abs() <= EPS
                && dot(last.v, lines[i].v) < 0.0
                && cross(lines[i].v, last.p.sub(lines[i].p)) < -EPS
            {
                return false;
            }
        }
        q.push_back(lines[i]);
    }
    while q.len() >= 3 && on_right(q[0], intersect_line(q[q.len() - 2], q[q.len() - 1])) {
        q.pop_back();
    }
    while q.len() >= 3 && on_right(q[q.len() - 1], intersect_line(q[0], q[1])) {
        q.pop_front();
    }
    if q.len() < 3 {
        return false;
    }
    for i in 0..q.len() {
        if cross(q[i].v, q[(i + 1) % q.len()].v).abs() <= EPS {
            return false;
        }
    }
    true
}

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let n: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };
    let mut poly = Vec::with_capacity(n);
    for _ in 0..n {
        let x: f64 = it.next().unwrap().parse().unwrap();
        let y: f64 = it.next().unwrap().parse().unwrap();
        poly.push(Pt { x, y });
    }

    let mut dirs = Vec::with_capacity(n);
    let mut norms = Vec::with_capacity(n);
    for i in 0..n {
        let v = poly[(i + 1) % n].sub(poly[i]);
        let len = v.x.hypot(v.y);
        dirs.push(v);
        norms.push(Pt { x: -v.y / len, y: v.x / len });
    }

    let (mut lo, mut hi) = (0.0, 1e6);
    for _ in 0..65 {
        let mid = 0.5 * (lo + hi);
        let lines = (0..n)
            .map(|i| HalfPlane { p: poly[i].add(norms[i].mul(mid)), v: dirs[i] })
            .collect();
        if feasible(lines) {
            lo = mid;
        } else {
            hi = mid;
        }
    }
    println!("{:.6}", lo);
}
`,
        java21: `import java.io.BufferedInputStream;
import java.io.IOException;
import java.util.Arrays;
import java.util.Locale;

public class Main {
    static final double EPS = 1e-10;

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

        String next() throws IOException {
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

        int nextInt() throws IOException {
            String s = next();
            return s == null ? -1 : Integer.parseInt(s);
        }

        double nextDouble() throws IOException {
            return Double.parseDouble(next());
        }
    }

    static class Pt {
        double x, y;
        Pt(double x, double y) { this.x = x; this.y = y; }
        Pt add(Pt o) { return new Pt(x + o.x, y + o.y); }
        Pt sub(Pt o) { return new Pt(x - o.x, y - o.y); }
        Pt mul(double k) { return new Pt(x * k, y * k); }
    }

    static double cross(Pt a, Pt b) { return a.x * b.y - a.y * b.x; }
    static double dot(Pt a, Pt b) { return a.x * b.x + a.y * b.y; }

    static class HalfPlane {
        Pt p, v;
        HalfPlane(Pt p, Pt v) { this.p = p; this.v = v; }
        int half() { return (v.y < -EPS || (Math.abs(v.y) <= EPS && v.x < 0)) ? 1 : 0; }
    }

    static boolean onRight(HalfPlane l, Pt pt) {
        return cross(l.v, pt.sub(l.p)) < -EPS;
    }

    static Pt intersectLine(HalfPlane a, HalfPlane b) {
        double t = cross(b.p.sub(a.p), b.v) / cross(a.v, b.v);
        return a.p.add(a.v.mul(t));
    }

    static boolean feasible(HalfPlane[] lines) {
        Arrays.sort(lines, (a, b) -> {
            int ha = a.half(), hb = b.half();
            if (ha != hb) return Integer.compare(ha, hb);
            double c = cross(a.v, b.v);
            if (Math.abs(c) > EPS) return c > 0 ? -1 : 1;
            return cross(a.v, b.p.sub(a.p)) < 0 ? -1 : 1;
        });

        HalfPlane[] dq = new HalfPlane[lines.length + 2];
        int head = 0, tail = 0;

        for (int i = 0; i < lines.length; i++) {
            if (i > 0 && lines[i].half() == lines[i - 1].half()
                    && Math.abs(cross(lines[i].v, lines[i - 1].v)) <= EPS) {
                continue;
            }
            while (tail - head >= 2 && onRight(lines[i], intersectLine(dq[tail - 2], dq[tail - 1]))) tail--;
            while (tail - head >= 2 && onRight(lines[i], intersectLine(dq[head], dq[head + 1]))) head++;
            if (tail > head && Math.abs(cross(dq[tail - 1].v, lines[i].v)) <= EPS
                    && dot(dq[tail - 1].v, lines[i].v) < 0
                    && cross(lines[i].v, dq[tail - 1].p.sub(lines[i].p)) < -EPS) {
                return false;
            }
            dq[tail++] = lines[i];
        }
        while (tail - head >= 3 && onRight(dq[head], intersectLine(dq[tail - 2], dq[tail - 1]))) tail--;
        while (tail - head >= 3 && onRight(dq[tail - 1], intersectLine(dq[head], dq[head + 1]))) head++;

        int sz = tail - head;
        if (sz < 3) return false;
        for (int i = 0; i < sz; i++) {
            if (Math.abs(cross(dq[head + i].v, dq[head + (i + 1) % sz].v)) <= EPS) return false;
        }
        return true;
    }

    public static void main(String[] args) throws Exception {
        Locale.setDefault(Locale.US);
        FastScanner fs = new FastScanner();
        int n = fs.nextInt();
        if (n == -1) return;

        Pt[] poly = new Pt[n];
        for (int i = 0; i < n; i++) poly[i] = new Pt(fs.nextDouble(), fs.nextDouble());

        Pt[] dirs = new Pt[n];
        Pt[] norms = new Pt[n];
        for (int i = 0; i < n; i++) {
            Pt v = poly[(i + 1) % n].sub(poly[i]);
            double len = Math.hypot(v.x, v.y);
            dirs[i] = v;
            norms[i] = new Pt(-v.y / len, v.x / len);
        }

        double lo = 0.0, hi = 1e6;
        for (int iter = 0; iter < 65; iter++) {
            double mid = 0.5 * (lo + hi);
            HalfPlane[] lines = new HalfPlane[n];
            for (int i = 0; i < n; i++) {
                lines[i] = new HalfPlane(poly[i].add(norms[i].mul(mid)), dirs[i]);
            }
            if (feasible(lines)) lo = mid;
            else hi = mid;
        }
        System.out.printf("%.6f%n", lo);
    }
}
`,
        python3: `import math
import sys
from collections import deque
from functools import cmp_to_key

sys.setrecursionlimit(200000)
EPS = 1e-10


def cross(ax: float, ay: float, bx: float, by: float) -> float:
    return ax * by - ay * bx


def dot(ax: float, ay: float, bx: float, by: float) -> float:
    return ax * bx + ay * by


def half_flag(vx: float, vy: float) -> int:
    return 1 if (vy < -EPS or (abs(vy) <= EPS and vx < 0.0)) else 0


def on_right(l: tuple[float, float, float, float], pt: tuple[float, float]) -> bool:
    return cross(l[2], l[3], pt[0] - l[0], pt[1] - l[1]) < -EPS


def intersect_line(
    a: tuple[float, float, float, float], b: tuple[float, float, float, float]
) -> tuple[float, float]:
    t = cross(b[0] - a[0], b[1] - a[1], b[2], b[3]) / cross(a[2], a[3], b[2], b[3])
    return (a[0] + a[2] * t, a[1] + a[3] * t)


def feasible(lines: list[tuple[float, float, float, float]]) -> bool:
    def cmp(a: tuple[float, float, float, float], b: tuple[float, float, float, float]) -> int:
        ha = half_flag(a[2], a[3])
        hb = half_flag(b[2], b[3])
        if ha != hb:
            return -1 if ha < hb else 1
        c = cross(a[2], a[3], b[2], b[3])
        if abs(c) > EPS:
            return -1 if c > 0 else 1
        return -1 if cross(a[2], a[3], b[0] - a[0], b[1] - a[1]) < 0 else 1

    lines.sort(key=cmp_to_key(cmp))
    q: deque[tuple[float, float, float, float]] = deque()
    for i, line in enumerate(lines):
        if (
            i > 0
            and half_flag(line[2], line[3]) == half_flag(lines[i - 1][2], lines[i - 1][3])
            and abs(cross(line[2], line[3], lines[i - 1][2], lines[i - 1][3])) <= EPS
        ):
            continue
        while len(q) >= 2 and on_right(line, intersect_line(q[-2], q[-1])):
            q.pop()
        while len(q) >= 2 and on_right(line, intersect_line(q[0], q[1])):
            q.popleft()
        if q:
            last = q[-1]
            if (
                abs(cross(last[2], last[3], line[2], line[3])) <= EPS
                and dot(last[2], last[3], line[2], line[3]) < 0
                and cross(line[2], line[3], last[0] - line[0], last[1] - line[1]) < -EPS
            ):
                return False
        q.append(line)

    while len(q) >= 3 and on_right(q[0], intersect_line(q[-2], q[-1])):
        q.pop()
    while len(q) >= 3 and on_right(q[-1], intersect_line(q[0], q[1])):
        q.popleft()

    if len(q) < 3:
        return False
    m = len(q)
    for i in range(m):
        if abs(cross(q[i][2], q[i][3], q[(i + 1) % m][2], q[(i + 1) % m][3])) <= EPS:
            return False
    return True


def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    poly = [(float(data[1 + 2 * i]), float(data[2 + 2 * i])) for i in range(n)]

    dirs = []
    norms = []
    for i in range(n):
        vx = poly[(i + 1) % n][0] - poly[i][0]
        vy = poly[(i + 1) % n][1] - poly[i][1]
        length = math.hypot(vx, vy)
        dirs.append((vx, vy))
        norms.append((-vy / length, vx / length))

    lo, hi = 0.0, 1e6
    for _ in range(65):
        mid = 0.5 * (lo + hi)
        lines = [
            (poly[i][0] + norms[i][0] * mid, poly[i][1] + norms[i][1] * mid, dirs[i][0], dirs[i][1])
            for i in range(n)
        ]
        if feasible(lines):
            lo = mid
        else:
            hi = mid

    print(f"{lo:.6f}")


if __name__ == "__main__":
    solve()
`,
        ruby: `EPS = 1e-10

def cross(ax, ay, bx, by)
  ax * by - ay * bx
end

def dot(ax, ay, bx, by)
  ax * bx + ay * by
end

def half_flag(vx, vy)
  (vy < -EPS || (vy.abs <= EPS && vx < 0.0)) ? 1 : 0
end

def on_right(l, pt)
  cross(l[2], l[3], pt[0] - l[0], pt[1] - l[1]) < -EPS
end

def intersect_line(a, b)
  t = cross(b[0] - a[0], b[1] - a[1], b[2], b[3]) / cross(a[2], a[3], b[2], b[3])
  [a[0] + a[2] * t, a[1] + a[3] * t]
end

def feasible?(lines)
  sorted = lines.sort do |a, b|
    ha = half_flag(a[2], a[3])
    hb = half_flag(b[2], b[3])
    if ha != hb
      ha <=> hb
    else
      c = cross(a[2], a[3], b[2], b[3])
      c.abs > EPS ? (c > 0 ? -1 : 1) : (cross(a[2], a[3], b[0] - a[0], b[1] - a[1]) < 0 ? -1 : 1)
    end
  end

  q = []
  sorted.each_with_index do |line, i|
    if i > 0 && half_flag(line[2], line[3]) == half_flag(sorted[i - 1][2], sorted[i - 1][3]) &&
       cross(line[2], line[3], sorted[i - 1][2], sorted[i - 1][3]).abs <= EPS
      next
    end
    q.pop while q.length >= 2 && on_right(line, intersect_line(q[-2], q[-1]))
    q.shift while q.length >= 2 && on_right(line, intersect_line(q[0], q[1]))
    unless q.empty?
      last = q[-1]
      if cross(last[2], last[3], line[2], line[3]).abs <= EPS &&
         dot(last[2], last[3], line[2], line[3]) < 0 &&
         cross(line[2], line[3], last[0] - line[0], last[1] - line[1]) < -EPS
        return false
      end
    end
    q << line
  end

  q.pop while q.length >= 3 && on_right(q[0], intersect_line(q[-2], q[-1]))
  q.shift while q.length >= 3 && on_right(q[-1], intersect_line(q[0], q[1]))
  return false if q.length < 3

  q.length.times do |i|
    return false if cross(q[i][2], q[i][3], q[(i + 1) % q.length][2], q[(i + 1) % q.length][3]).abs <= EPS
  end
  true
end

data = $stdin.read.split
exit if data.empty?
n = data[0].to_i
poly = Array.new(n) { |i| [data[1 + 2 * i].to_f, data[2 + 2 * i].to_f] }

dirs = []
norms = []
n.times do |i|
  vx = poly[(i + 1) % n][0] - poly[i][0]
  vy = poly[(i + 1) % n][1] - poly[i][1]
  len = Math.hypot(vx, vy)
  dirs << [vx, vy]
  norms << [-vy / len, vx / len]
end

lo = 0.0
hi = 1e6
65.times do
  mid = 0.5 * (lo + hi)
  lines = (0...n).map do |i|
    [poly[i][0] + norms[i][0] * mid, poly[i][1] + norms[i][1] * mid, dirs[i][0], dirs[i][1]]
  end
  if feasible?(lines)
    lo = mid
  else
    hi = mid
  end
end

puts format('%.6f', lo)
`,
      },
    },
    {
      id: 'ch63-p3',
      tier: 'Boss',
      ratingRange: '2400–2600',
      title: 'Minimum Distance Between Convex Polygons via Minkowski Sum',
      statement:
        'Given two strictly convex polygons P (N vertices) and Q (M vertices), each provided in counter-clockwise order with integer coordinates, compute the minimum Euclidean distance between any point p in P and any point q in Q in O(N + M) time. Output 0.000000 if they intersect or touch.',
      constraints: '3 <= N, M <= 10^5, |coordinates| <= 10^8',
      sampleInput: '4\n0 0\n2 0\n2 2\n0 2\n4\n5 6\n7 6\n7 8\n5 8',
      sampleOutput: '5.000000',
      hints: [
        'Minimizing ||p - q|| for p in P, q in Q is identical to finding the closest point to the origin (0, 0) inside the Minkowski difference M = P + (-Q).',
        'Rotate both P and negQ = [(-q.x, -q.y)] so index 0 is their lowest (y, x) vertex, then two-pointer merge their CCW edge vectors by cross product in O(N + M).',
        'If (0, 0) lies on or to the left of every CCW edge of M, the polygons intersect (distance 0); otherwise take the minimum point-to-segment distance from (0, 0) across all edges of M.',
      ],
      solutions: {
        cpp20: `#include <iostream>
#include <vector>
#include <algorithm>
#include <cmath>
#include <iomanip>
using namespace std;

struct Pt {
    long long x, y;
    Pt operator+(const Pt& o) const { return {x + o.x, y + o.y}; }
    Pt operator-(const Pt& o) const { return {x - o.x, y - o.y}; }
};

__int128 cross128(const Pt& a, const Pt& b) {
    return static_cast<__int128>(a.x) * b.y - static_cast<__int128>(a.y) * b.x;
}

void reorderBottomLeft(vector<Pt>& p) {
    int pos = 0;
    for (int i = 1; i < static_cast<int>(p.size()); ++i) {
        if (p[i].y < p[pos].y || (p[i].y == p[pos].y && p[i].x < p[pos].x)) {
            pos = i;
        }
    }
    rotate(p.begin(), p.begin() + pos, p.end());
}

vector<Pt> minkowski(vector<Pt> p, vector<Pt> q) {
    reorderBottomLeft(p);
    reorderBottomLeft(q);
    int n = static_cast<int>(p.size());
    int m = static_cast<int>(q.size());
    p.push_back(p[0]);
    p.push_back(p[1]);
    q.push_back(q[0]);
    q.push_back(q[1]);

    vector<Pt> res;
    res.reserve(n + m);
    int i = 0, j = 0;
    while (i < n || j < m) {
        res.push_back(p[i] + q[j]);
        Pt dp = p[i + 1] - p[i];
        Pt dq = q[j + 1] - q[j];
        __int128 c = cross128(dp, dq);
        if (c >= 0 && i < n) ++i;
        if (c <= 0 && j < m) ++j;
    }
    return res;
}

double distPointToSegmentOrigin(const Pt& a, const Pt& b) {
    double dx = static_cast<double>(b.x - a.x);
    double dy = static_cast<double>(b.y - a.y);
    double len2 = dx * dx + dy * dy;
    if (len2 == 0.0) return hypot(static_cast<double>(a.x), static_cast<double>(a.y));
    double t = -(static_cast<double>(a.x) * dx + static_cast<double>(a.y) * dy) / len2;
    t = max(0.0, min(1.0, t));
    double px = a.x + t * dx;
    double py = a.y + t * dy;
    return hypot(px, py);
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    if (!(cin >> n)) return 0;
    vector<Pt> p(n);
    for (int i = 0; i < n; ++i) cin >> p[i].x >> p[i].y;

    int m;
    cin >> m;
    vector<Pt> negQ(m);
    for (int j = 0; j < m; ++j) {
        long long x, y;
        cin >> x >> y;
        negQ[j] = {-x, -y};
    }

    vector<Pt> sum = minkowski(move(p), move(negQ));
    int k = static_cast<int>(sum.size());
    bool inside = true;
    double best = 1e30;
    for (int i = 0; i < k; ++i) {
        const Pt& a = sum[i];
        const Pt& b = sum[(i + 1) % k];
        if (cross128(b - a, Pt{-a.x, -a.y}) < 0) inside = false;
        best = min(best, distPointToSegmentOrigin(a, b));
    }

    if (inside) best = 0.0;
    cout << fixed << setprecision(6) << best << "\n";
    return 0;
}
`,
        rust: `use std::io::{self, Read};

#[derive(Clone, Copy)]
struct Pt {
    x: i64,
    y: i64,
}

impl Pt {
    fn add(self, o: Self) -> Self { Pt { x: self.x + o.x, y: self.y + o.y } }
    fn sub(self, o: Self) -> Self { Pt { x: self.x - o.x, y: self.y - o.y } }
}

fn cross128(a: Pt, b: Pt) -> i128 {
    (a.x as i128) * (b.y as i128) - (a.y as i128) * (b.x as i128)
}

fn reorder_bottom_left(p: &mut Vec<Pt>) {
    let mut pos = 0;
    for i in 1..p.len() {
        if p[i].y < p[pos].y || (p[i].y == p[pos].y && p[i].x < p[pos].x) {
            pos = i;
        }
    }
    p.rotate_left(pos);
}

fn minkowski(mut p: Vec<Pt>, mut q: Vec<Pt>) -> Vec<Pt> {
    reorder_bottom_left(&mut p);
    reorder_bottom_left(&mut q);
    let n = p.len();
    let m = q.len();
    p.push(p[0]);
    p.push(p[1]);
    q.push(q[0]);
    q.push(q[1]);

    let mut res = Vec::with_capacity(n + m);
    let (mut i, mut j) = (0usize, 0usize);
    while i < n || j < m {
        res.push(p[i].add(q[j]));
        let c = cross128(p[i + 1].sub(p[i]), q[j + 1].sub(q[j]));
        if c >= 0 && i < n {
            i += 1;
        }
        if c <= 0 && j < m {
            j += 1;
        }
    }
    res
}

fn dist_origin_to_seg(a: Pt, b: Pt) -> f64 {
    let dx = (b.x - a.x) as f64;
    let dy = (b.y - a.y) as f64;
    let len2 = dx * dx + dy * dy;
    if len2 == 0.0 {
        return (a.x as f64).hypot(a.y as f64);
    }
    let t = (-((a.x as f64) * dx + (a.y as f64) * dy) / len2).clamp(0.0, 1.0);
    let px = (a.x as f64) + t * dx;
    let py = (a.y as f64) + t * dy;
    px.hypot(py)
}

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let n: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };
    let mut p = Vec::with_capacity(n);
    for _ in 0..n {
        let x: i64 = it.next().unwrap().parse().unwrap();
        let y: i64 = it.next().unwrap().parse().unwrap();
        p.push(Pt { x, y });
    }
    let m: usize = it.next().unwrap().parse().unwrap();
    let mut neg_q = Vec::with_capacity(m);
    for _ in 0..m {
        let x: i64 = it.next().unwrap().parse().unwrap();
        let y: i64 = it.next().unwrap().parse().unwrap();
        neg_q.push(Pt { x: -x, y: -y });
    }

    let sum = minkowski(p, neg_q);
    let k = sum.len();
    let mut inside = true;
    let mut best = f64::MAX;
    for i in 0..k {
        let a = sum[i];
        let b = sum[(i + 1) % k];
        if cross128(b.sub(a), Pt { x: -a.x, y: -a.y }) < 0 {
            inside = false;
        }
        best = best.min(dist_origin_to_seg(a, b));
    }
    if inside {
        best = 0.0;
    }
    println!("{:.6}", best);
}
`,
        java21: `import java.io.BufferedInputStream;
import java.io.IOException;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.Locale;

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

        long nextLong() throws IOException {
            int c;
            do {
                c = readByte();
                if (c == -1) return Long.MIN_VALUE;
            } while (c <= ' ');
            long sign = 1;
            if (c == '-') {
                sign = -1;
                c = readByte();
            }
            long res = 0;
            while (c > ' ') {
                res = res * 10 + (c - '0');
                c = readByte();
            }
            return res * sign;
        }
    }

    static class Pt {
        long x, y;
        Pt(long x, long y) { this.x = x; this.y = y; }
        Pt add(Pt o) { return new Pt(x + o.x, y + o.y); }
        Pt sub(Pt o) { return new Pt(x - o.x, y - o.y); }
    }

    static int crossSign(Pt a, Pt b) {
        BigInteger c = BigInteger.valueOf(a.x).multiply(BigInteger.valueOf(b.y))
                .subtract(BigInteger.valueOf(a.y).multiply(BigInteger.valueOf(b.x)));
        return c.signum();
    }

    static Pt[] reorderBottomLeft(Pt[] pts) {
        int pos = 0;
        for (int i = 1; i < pts.length; i++) {
            if (pts[i].y < pts[pos].y || (pts[i].y == pts[pos].y && pts[i].x < pts[pos].x)) {
                pos = i;
            }
        }
        Pt[] res = new Pt[pts.length + 2];
        for (int i = 0; i < pts.length; i++) res[i] = pts[(pos + i) % pts.length];
        res[pts.length] = res[0];
        res[pts.length + 1] = res[1];
        return res;
    }

    static ArrayList<Pt> minkowski(Pt[] rawP, Pt[] rawQ) {
        int n = rawP.length, m = rawQ.length;
        Pt[] p = reorderBottomLeft(rawP);
        Pt[] q = reorderBottomLeft(rawQ);
        ArrayList<Pt> res = new ArrayList<>(n + m);
        int i = 0, j = 0;
        while (i < n || j < m) {
            res.add(p[i].add(q[j]));
            int cs = crossSign(p[i + 1].sub(p[i]), q[j + 1].sub(q[j]));
            if (cs >= 0 && i < n) i++;
            if (cs <= 0 && j < m) j++;
        }
        return res;
    }

    static double distOriginToSeg(Pt a, Pt b) {
        double dx = (double) (b.x - a.x);
        double dy = (double) (b.y - a.y);
        double len2 = dx * dx + dy * dy;
        if (len2 == 0.0) return Math.hypot((double) a.x, (double) a.y);
        double t = -((double) a.x * dx + (double) a.y * dy) / len2;
        if (t < 0.0) t = 0.0;
        if (t > 1.0) t = 1.0;
        return Math.hypot(a.x + t * dx, a.y + t * dy);
    }

    public static void main(String[] args) throws Exception {
        Locale.setDefault(Locale.US);
        FastScanner fs = new FastScanner();
        long nLong = fs.nextLong();
        if (nLong == Long.MIN_VALUE) return;
        int n = (int) nLong;
        Pt[] p = new Pt[n];
        for (int i = 0; i < n; i++) p[i] = new Pt(fs.nextLong(), fs.nextLong());

        int m = (int) fs.nextLong();
        Pt[] negQ = new Pt[m];
        for (int j = 0; j < m; j++) negQ[j] = new Pt(-fs.nextLong(), -fs.nextLong());

        ArrayList<Pt> sum = minkowski(p, negQ);
        int k = sum.size();
        boolean inside = true;
        double best = Double.MAX_VALUE;
        for (int i = 0; i < k; i++) {
            Pt a = sum.get(i);
            Pt b = sum.get((i + 1) % k);
            if (crossSign(b.sub(a), new Pt(-a.x, -a.y)) < 0) inside = false;
            best = Math.min(best, distOriginToSeg(a, b));
        }
        if (inside) best = 0.0;
        System.out.printf("%.6f%n", best);
    }
}
`,
        python3: `import math
import sys

sys.setrecursionlimit(200000)


def cross(ax: int, ay: int, bx: int, by: int) -> int:
    return ax * by - ay * bx


def reorder_bottom_left(pts: list[tuple[int, int]]) -> list[tuple[int, int]]:
    pos = min(range(len(pts)), key=lambda i: (pts[i][1], pts[i][0]))
    rot = pts[pos:] + pts[:pos]
    return rot + rot[:2]


def minkowski(p_raw: list[tuple[int, int]], q_raw: list[tuple[int, int]]) -> list[tuple[int, int]]:
    n, m = len(p_raw), len(q_raw)
    p = reorder_bottom_left(p_raw)
    q = reorder_bottom_left(q_raw)
    res: list[tuple[int, int]] = []
    i = 0
    j = 0
    while i < n or j < m:
        res.append((p[i][0] + q[j][0], p[i][1] + q[j][1]))
        c = cross(p[i + 1][0] - p[i][0], p[i + 1][1] - p[i][1], q[j + 1][0] - q[j][0], q[j + 1][1] - q[j][1])
        if c >= 0 and i < n:
            i += 1
        if c <= 0 and j < m:
            j += 1
    return res


def dist_origin_to_seg(ax: int, ay: int, bx: int, by: int) -> float:
    dx = bx - ax
    dy = by - ay
    len2 = dx * dx + dy * dy
    if len2 == 0:
        return math.hypot(ax, ay)
    t = max(0.0, min(1.0, -(ax * dx + ay * dy) / len2))
    return math.hypot(ax + t * dx, ay + t * dy)


def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    idx = 0
    n = int(data[idx])
    idx += 1
    p = []
    for _ in range(n):
        p.append((int(data[idx]), int(data[idx + 1])))
        idx += 2
    m = int(data[idx])
    idx += 1
    neg_q = []
    for _ in range(m):
        neg_q.append((-int(data[idx]), -int(data[idx + 1])))
        idx += 2

    total = minkowski(p, neg_q)
    k = len(total)
    inside = True
    best = float("inf")
    for i in range(k):
        ax, ay = total[i]
        bx, by = total[(i + 1) % k]
        if cross(bx - ax, by - ay, -ax, -ay) < 0:
            inside = False
        best = min(best, dist_origin_to_seg(ax, ay, bx, by))

    if inside:
        best = 0.0
    print(f"{best:.6f}")


if __name__ == "__main__":
    solve()
`,
        ruby: `def cross(ax, ay, bx, by)
  ax * by - ay * bx
end

def reorder_bottom_left(pts)
  pos = 0
  (1...pts.length).each do |i|
    if pts[i][1] < pts[pos][1] || (pts[i][1] == pts[pos][1] && pts[i][0] < pts[pos][0])
      pos = i
    end
  end
  rot = pts.rotate(pos)
  rot + rot[0, 2]
end

def minkowski(p_raw, q_raw)
  n = p_raw.length
  m = q_raw.length
  p = reorder_bottom_left(p_raw)
  q = reorder_bottom_left(q_raw)
  res = []
  i = 0
  j = 0
  while i < n || j < m
    res << [p[i][0] + q[j][0], p[i][1] + q[j][1]]
    c = cross(p[i + 1][0] - p[i][0], p[i + 1][1] - p[i][1], q[j + 1][0] - q[j][0], q[j + 1][1] - q[j][1])
    i += 1 if c >= 0 && i < n
    j += 1 if c <= 0 && j < m
  end
  res
end

def dist_origin_to_seg(ax, ay, bx, by)
  dx = (bx - ax).to_f
  dy = (by - ay).to_f
  len2 = dx * dx + dy * dy
  return Math.hypot(ax.to_f, ay.to_f) if len2 == 0.0

  t = -(ax * dx + ay * dy) / len2
  t = 0.0 if t < 0.0
  t = 1.0 if t > 1.0
  Math.hypot(ax + t * dx, ay + t * dy)
end

data = $stdin.read.split
exit if data.empty?
idx = 0
n = data[idx].to_i
idx += 1
p = Array.new(n) do
  pt = [data[idx].to_i, data[idx + 1].to_i]
  idx += 2
  pt
end
m = data[idx].to_i
idx += 1
neg_q = Array.new(m) do
  pt = [-data[idx].to_i, -data[idx + 1].to_i]
  idx += 2
  pt
end

sum = minkowski(p, neg_q)
k = sum.length
inside = true
best = Float::INFINITY
k.times do |i|
  a = sum[i]
  b = sum[(i + 1) % k]
  inside = false if cross(b[0] - a[0], b[1] - a[1], -a[0], -a[1]) < 0
  d = dist_origin_to_seg(a[0], a[1], b[0], b[1])
  best = d if d < best
end

best = 0.0 if inside
puts format('%.6f', best)
`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'CSES',
      title: 'Polygon / Convex Geometry Classics',
      difficulty: 'Hard',
      url: 'https://cses.fi/problemset/list/',
      patternNote: 'CCW orientation, point-to-segment distance, and convex hull primitives.',
    },
    {
      platform: 'Codeforces',
      title: '1195F / 600D / 87E — Minkowski Sum & Linear Regions',
      difficulty: '2300–2600',
      url: 'https://codeforces.com/problemset?tags=geometry',
      patternNote: 'Minkowski sum edge merge and half-plane intersection for visibility kernels.',
    },
    {
      platform: 'AtCoder',
      title: 'ABC286H / AGC021E — Convex Hull & Half-Plane Optimization',
      difficulty: '2200–2500',
      url: 'https://atcoder.jp/',
      patternNote: '2D half-plane pruning and convex obstacle inflation via Minkowski difference.',
    },
  ],
  interviewNotes: [
    'Explain why Half-Plane Intersection uses a double-ended deque instead of a monotonic stack: as angles sweep a full 360 degrees, newly added half-planes near the tail can clip intersections back at the front of the hull.',
    'Derive why the Minkowski sum of two convex polygons with N and M vertices has at most N + M vertices and computes in O(N + M): the normal/edge angles of a convex polygon are already sorted cyclically in CCW order.',
    'Point out the robotics configuration-space (C-space) reduction: testing whether convex polygon A translated by vector v intersects convex obstacle B reduces directly to testing whether v lies inside B + (-A).',
  ],
  projectBlueprint: {
    title: 'Autonomous Robot C-Space Obstacle Inflation Engine',
    tagline: 'Linear-time Minkowski collision boundary synthesis and half-plane safe-corridor solver for 2D navigation',
    stackSummary: 'TypeScript Geometry Kernel + Canvas C-Space Polygons & Feasible Deque Stepper',
    asciiDiagram: [
      '+---------------------------------------------------------------+',
      '|  Obstacle Polygon B (CCW)  +  Reflected Robot (-A) (CCW)      |',
      '|                 \\                /                            |',
      '|                  v              v                             |',
      '|            [ O(N+M) Edge-Vector Merge ]                       |',
      '|                         |                                     |',
      '|                         v                                     |',
      '|       Expanded C-Space Obstacle  B + (-A)                     |',
      '+---------------------------------------------------------------+',
    ].join('\n'),
    milestones: [
      {
        id: 'm1',
        title: 'S&I Angle-Sorted Deque Intersector',
        detail: 'Compute feasible convex polygons from arbitrary linear inequality constraints.',
      },
      {
        id: 'm2',
        title: 'Linear-Time Minkowski Difference Merger',
        detail: 'Merge bottom-left-aligned CCW polygons P and -Q without sorting or convex hull.',
      },
      {
        id: 'm3',
        title: 'Inscribed Radius Clearance Solver',
        detail: 'Binary search inward edge offsets to determine maximum circular clearance radius.',
      },
    ],
    starterCode: `export interface Pt { x: number; y: number; }
export function cross2D(a: Pt, b: Pt): number { return a.x * b.y - a.y * b.x; }
export function minkowskiSum(pRaw: Pt[], qRaw: Pt[]): Pt[] {
  const rot = (pts: Pt[]) => {
    let pos = 0;
    for (let i = 1; i < pts.length; i++) {
      if (pts[i].y < pts[pos].y || (pts[i].y === pts[pos].y && pts[i].x < pts[pos].x)) pos = i;
    }
    const r = [...pts.slice(pos), ...pts.slice(0, pos)];
    return [...r, r[0], r[1]];
  };
  const p = rot(pRaw), q = rot(qRaw);
  const res: Pt[] = [];
  let i = 0, j = 0;
  while (i < pRaw.length || j < qRaw.length) {
    res.push({ x: p[i].x + q[j].x, y: p[i].y + q[j].y });
    const dp = { x: p[i + 1].x - p[i].x, y: p[i + 1].y - p[i].y };
    const dq = { x: q[j + 1].x - q[j].x, y: q[j + 1].y - q[j].y };
    const c = cross2D(dp, dq);
    if (c >= 0 && i < pRaw.length) i++;
    if (c <= 0 && j < qRaw.length) j++;
  }
  return res;
}`,
  },
};
