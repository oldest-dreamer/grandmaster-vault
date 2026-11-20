import type { TheoryChapter } from '../../types/vault';

export const CH78_3D_HULL_DELAUNAY_VORONOI: TheoryChapter = {
  slug: '3d-convex-hull-voronoi',
  topicId: 'sg-71',
  title: '3D Convex Hull, Spherical Geometry & Delaunay/Voronoi',
  domain: 'Strings & Geometry',
  ratingTier: '2600–3300+',
  usacoDivision: 'Advanced',
  subtitle: 'Incremental O(N^2) 3D convex hulls via horizon-edge tracking, Welzl O(N) minimum enclosing circles, and O(N log N) Guibas-Stolfi Quad-Edge Delaunay triangulation for EMST & Voronoi duality',
  analogyTitle: 'Wrapping a 3D Polyhedron Along Its Horizon & Flipping Empty Circles',
  analogyBody:
    'Constructing a 3D Convex Hull incrementally mirrors stretching a taut elastic skin over one point at a time. Maintaining outward-oriented triangular faces, inserting point P_i deletes every face that lies below P_i (i.e., P_i is strictly on the positive outward half-space of the face). The boundary separating deleted visible faces from surviving hidden faces forms a closed cycle of directed horizon edges (u -> v), which we stitch to P_i via new triangles (u, v, P_i). Adding a tiny deterministic coordinate jitter breaks coplanar degeneracies without affecting exact un-jittered area and volume sums, preserving O(N^2) simplicity.\n\nIn 2D proximity geometry, the Euclidean Minimum Spanning Tree (EMST) is always a subgraph of the Delaunay Triangulation—whose dual graph is the Voronoi Diagram. A triangulation is Delaunay iff no fourth vertex lies strictly inside the circumcircle of any triangle (verified exact in 128-bit integer arithmetic via the 4x4 InCircle determinant). Using Guibas-Stolfi divide-and-conquer over a Quad-Edge topological arena stitches left and right Delaunay halves along a rising common lower tangent in strict O(N log N) time.',
  prerequisites: [
    { slug: 'half-plane-intersection-minkowski', title: 'Half-Plane Intersection & Minkowski Sum' },
  ],
  traceTitle: 'Incremental 3D Hull Insertion & Guibas-Stolfi Quad-Edge Stitching',
  traceSubtitle: 'Tracking visible face deletion, horizon edges, and Delaunay InCircle edge flips',
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Step 1: Initialize Non-Degenerate Tetrahedron & Orient Away',
      explanation: 'Pick 4 maximally non-coplanar vertices (using deterministic jitter on ties) and emit 4 outward-oriented triangles so dot(cross(B-A, C-A), interior - A) < 0.',
      mode: 'array',
      arrays: [
        {
          name: 'Initial Tetrahedron Faces (CCW from Outside)',
          cells: [
            { index: 0, value: '(0,1,2)', label: 'base', highlight: 'active' },
            { index: 1, value: '(0,3,1)', label: 'side 1', highlight: 'active' },
            { index: 2, value: '(1,3,2)', label: 'side 2', highlight: 'active' },
            { index: 3, value: '(2,3,0)', label: 'side 3', highlight: 'active' },
          ],
        },
      ],
      variables: { eulerFaces: '2V - 4', jitterEps: '1e-9 (topology only)', exactMeasure: 'orig coords' },
    },
    {
      stepNumber: 2,
      title: 'Step 2: Delete Visible Faces & Stitch Horizon Edges to P_i',
      explanation: 'Mark directed edges u -> v of every visible face. An edge u -> v is on the horizon iff its reverse edge v -> u was NOT marked visible; emit (u, v, P_i).',
      mode: 'array',
      arrays: [
        {
          name: 'Edge Classification for Point P_i',
          cells: [
            { index: 0, value: 'u->v & v->u visible', label: 'interior', highlight: 'neutral' },
            { index: 1, value: 'u->v vis, v->u hidden', label: 'HORIZON', highlight: 'updated' },
            { index: 2, value: 'new face (u, v, P_i)', label: 'stitched', highlight: 'active' },
          ],
        },
      ],
      variables: { hullComplexity: 'O(N^2)', totalEdgesBound: '3N - 6' },
    },
    {
      stepNumber: 3,
      title: 'Step 3: Guibas-Stolfi Quad-Edge Delaunay Lower Tangent & EMST',
      explanation: 'Merge sorted left and right Delaunay halves from the common lower tangent upward, flipping any edge whose opposite triangle fails 128-bit InCircle, then run Kruskal.',
      mode: 'array',
      arrays: [
        {
          name: 'Quad-Edge Algebra & Delaunay -> EMST',
          cells: [
            { index: 0, value: 'sym = e ^ 2', label: 'reverse', highlight: 'active' },
            { index: 1, value: 'rot = +1 mod 4', label: 'dual', highlight: 'active' },
            { index: 2, value: 'invrot = +3 mod 4', label: 'dual^-1', highlight: 'active' },
            { index: 3, value: 'Kruskal(|E| <= 3N)', label: 'EMST', highlight: 'updated' },
          ],
        },
      ],
      variables: { delaunayTime: 'O(N log N)', inCircleType: '__int128 / BigInt', cubeResult: 'Area 6, Vol 1' },
    },
  ],
  reductionClues: [
    {
      clue: 'Compute surface area, volume, or faces of the convex hull of N <= 500 points in 3D space',
      translation: 'Run incremental O(N^2) 3D convex hull with 1e-9 deterministic jitter for visibility and un-jittered original vertices for area/volume.',
    },
    {
      clue: 'Find the smallest circle enclosing all N points in 2D (minimum enclosing disc) in linear time',
      translation: 'Shuffle points deterministically and run Welzl’s 3-level nested loop in O(N) expected time.',
    },
    {
      clue: 'Compute the Euclidean Minimum Spanning Tree (EMST) or all nearest neighbors of N <= 10^5 2D points',
      translation: 'Build the Delaunay triangulation in O(N log N) via Guibas-Stolfi Quad-Edge divide-and-conquer, then run Kruskal over its <= 3N edges.',
    },
    {
      clue: 'Find the empty circle maximizing radius inside a point set (largest empty circle / Voronoi vertex)',
      translation: 'Dualize the Delaunay triangulation: every Voronoi vertex is the circumcenter of a Delaunay triangle.',
    },
  ],
  timeComplexity: 'O(N^2) for Incremental 3D Convex Hull; O(N) expected for Welzl MEC; O(N log N) for Delaunay & EMST',
  spaceComplexity: 'O(N^2) edge-mark table (or O(N) hash) for 3D Hull; O(N) for Welzl & Quad-Edge Delaunay',
  pitfalls: [
    {
      type: 'WA',
      title: '1e-16 Coordinate Jitter Vanishes Under IEEE 754 ULP Rounding',
      detail: 'For coordinates around 10^3 - 10^4, double ULP is ~10^-12, so adding 1e-16 leaves coplanar points identical! Use ~1e-9 deterministic perturbation for topology tests while summing exact un-jittered coordinates for area and volume.',
    },
    {
      type: 'WA',
      title: 'Wrong invrot or rprev Index in Guibas-Stolfi Quad-Edge Delaunay',
      detail: 'With quad edges encoded as 4*q + r (r in 0..3), invrot(e) MUST rotate by +3 mod 4: (e & ~3) | ((e + 3) & 3) (NOT e ^ 1!), and e.Rprev is nxt[sym(e)] (NOT sym(nxt[e])).',
    },
    {
      type: 'WA',
      title: '64-Bit Overflow Inside 2D Delaunay InCircle Determinant',
      detail: 'InCircle involves degree-4 coordinate differences O(C^4), reaching 10^25 for coordinates <= 10^6. Always use 128-bit integers (__int128 / i128 / BigInteger / Python int).',
    },
    {
      type: 'WA',
      title: 'Origin Cancellation in Signed Tetrahedron Volume Sum',
      detail: 'Subtract a fixed reference vertex orig[p0] from every triangle vertex before taking dot(a, cross(b, c)) / 6.0 so large far-from-origin hulls retain full floating-point precision.',
    },
  ],
  implementations: {
    cpp20: `#include <algorithm>
#include <cmath>
#include <iomanip>
#include <iostream>
#include <vector>

using namespace std;

struct P3 {
    double x, y, z;
    P3 operator-(const P3& o) const { return {x - o.x, y - o.y, z - o.z}; }
};

static P3 cross(const P3& a, const P3& b) {
    return {a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x};
}

static double dot(const P3& a, const P3& b) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
}

static double norm(const P3& a) {
    return sqrt(dot(a, a));
}

struct Face {
    int a, b, c;
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    if (!(cin >> n)) return 0;
    vector<P3> orig(n), jit(n);
    for (int i = 0; i < n; ++i) {
        cin >> orig[i].x >> orig[i].y >> orig[i].z;
        auto noise = [&](int salt) -> double {
            unsigned long long h = 1469598103934665603ULL ^ (unsigned long long)(i * 131 + salt);
            h = (h ^ (h >> 30)) * 0xBF58476D1CE4E5B9ULL;
            h ^= h >> 27;
            return ((double)(h % 2000001ULL) / 1000000.0 - 1.0) * 1e-9;
        };
        jit[i] = {orig[i].x + noise(1), orig[i].y + noise(2), orig[i].z + noise(3)};
    }
    if (n < 3) {
        cout << fixed << setprecision(6) << 0.0 << ' ' << 0.0 << '\\n';
        return 0;
    }

    int p1 = 0;
    double best = -1.0;
    for (int i = 1; i < n; ++i) {
        double d = dot(jit[i] - jit[0], jit[i] - jit[0]);
        if (d > best) { best = d; p1 = i; }
    }
    swap(orig[1], orig[p1]);
    swap(jit[1], jit[p1]);

    int p2 = 1;
    best = -1.0;
    for (int i = 2; i < n; ++i) {
        double d = norm(cross(jit[1] - jit[0], jit[i] - jit[0]));
        if (d > best) { best = d; p2 = i; }
    }
    swap(orig[2], orig[p2]);
    swap(jit[2], jit[p2]);

    if (n == 3) {
        double area = norm(cross(orig[1] - orig[0], orig[2] - orig[0]));
        cout << fixed << setprecision(6) << area << ' ' << 0.0 << '\\n';
        return 0;
    }

    int p3 = 2;
    best = -1.0;
    P3 n012 = cross(jit[1] - jit[0], jit[2] - jit[0]);
    for (int i = 3; i < n; ++i) {
        double d = fabs(dot(n012, jit[i] - jit[0]));
        if (d > best) { best = d; p3 = i; }
    }
    swap(orig[3], orig[p3]);
    swap(jit[3], jit[p3]);

    vector<Face> faces;
    if (dot(cross(jit[1] - jit[0], jit[2] - jit[0]), jit[3] - jit[0]) > 0) {
        faces = {{0, 2, 1}, {0, 1, 3}, {1, 2, 3}, {2, 0, 3}};
    } else {
        faces = {{0, 1, 2}, {0, 3, 1}, {1, 3, 2}, {2, 3, 0}};
    }

    vector<vector<int>> mark(n, vector<int>(n, -1));
    for (int i = 4; i < n; ++i) {
        vector<Face> vis_faces, next_faces;
        for (const auto& f : faces) {
            double v = dot(cross(jit[f.b] - jit[f.a], jit[f.c] - jit[f.a]), jit[i] - jit[f.a]);
            if (v > 0) {
                mark[f.a][f.b] = i;
                mark[f.b][f.c] = i;
                mark[f.c][f.a] = i;
                vis_faces.push_back(f);
            } else {
                next_faces.push_back(f);
            }
        }
        for (const auto& f : vis_faces) {
            if (mark[f.b][f.a] != i) next_faces.push_back({f.a, f.b, i});
            if (mark[f.c][f.b] != i) next_faces.push_back({f.b, f.c, i});
            if (mark[f.a][f.c] != i) next_faces.push_back({f.c, f.a, i});
        }
        faces.swap(next_faces);
    }

    double area = 0.0, vol = 0.0;
    P3 ref = orig[0];
    for (const auto& f : faces) {
        P3 a = orig[f.a] - ref, b = orig[f.b] - ref, c = orig[f.c] - ref;
        area += 0.5 * norm(cross(orig[f.b] - orig[f.a], orig[f.c] - orig[f.a]));
        vol += dot(a, cross(b, c)) / 6.0;
    }
    cout << fixed << setprecision(6) << area << ' ' << fabs(vol) << '\\n';
    return 0;
}`,
    rust: `use std::io::{self, Read};

#[derive(Clone, Copy)]
struct P3 {
    x: f64,
    y: f64,
    z: f64,
}

impl P3 {
    fn sub(self, o: P3) -> P3 {
        P3 { x: self.x - o.x, y: self.y - o.y, z: self.z - o.z }
    }
    fn cross(self, o: P3) -> P3 {
        P3 {
            x: self.y * o.z - self.z * o.y,
            y: self.z * o.x - self.x * o.z,
            z: self.x * o.y - self.y * o.x,
        }
    }
    fn dot(self, o: P3) -> f64 {
        self.x * o.x + self.y * o.y + self.z * o.z
    }
    fn norm(self) -> f64 {
        self.dot(self).sqrt()
    }
}

#[derive(Clone, Copy)]
struct Face {
    a: usize,
    b: usize,
    c: usize,
}

fn noise(i: usize, salt: usize) -> f64 {
    let mut h: u64 = 1469598103934665603 ^ ((i * 131 + salt) as u64);
    h = (h ^ (h >> 30)).wrapping_mul(0xBF58_476D_1CE4_E5B9);
    h ^= h >> 27;
    (((h % 2_000_001) as f64) / 1_000_000.0 - 1.0) * 1e-9
}

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let n: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };
    let mut orig = Vec::with_capacity(n);
    let mut jit = Vec::with_capacity(n);
    for i in 0..n {
        let x: f64 = it.next().unwrap().parse().unwrap();
        let y: f64 = it.next().unwrap().parse().unwrap();
        let z: f64 = it.next().unwrap().parse().unwrap();
        orig.push(P3 { x, y, z });
        jit.push(P3 { x: x + noise(i, 1), y: y + noise(i, 2), z: z + noise(i, 3) });
    }
    if n < 3 {
        println!("{:.6} {:.6}", 0.0, 0.0);
        return;
    }

    let mut p1 = 0;
    let mut best = -1.0;
    for i in 1..n {
        let d = jit[i].sub(jit[0]).dot(jit[i].sub(jit[0]));
        if d > best { best = d; p1 = i; }
    }
    orig.swap(1, p1);
    jit.swap(1, p1);

    let mut p2 = 1;
    best = -1.0;
    for i in 2..n {
        let d = jit[1].sub(jit[0]).cross(jit[i].sub(jit[0])).norm();
        if d > best { best = d; p2 = i; }
    }
    orig.swap(2, p2);
    jit.swap(2, p2);

    if n == 3 {
        let area = orig[1].sub(orig[0]).cross(orig[2].sub(orig[0])).norm();
        println!("{:.6} {:.6}", area, 0.0);
        return;
    }

    let mut p3 = 2;
    best = -1.0;
    let n012 = jit[1].sub(jit[0]).cross(jit[2].sub(jit[0]));
    for i in 3..n {
        let d = n012.dot(jit[i].sub(jit[0])).abs();
        if d > best { best = d; p3 = i; }
    }
    orig.swap(3, p3);
    jit.swap(3, p3);

    let mut faces = if jit[1].sub(jit[0]).cross(jit[2].sub(jit[0])).dot(jit[3].sub(jit[0])) > 0.0 {
        vec![Face { a: 0, b: 2, c: 1 }, Face { a: 0, b: 1, c: 3 }, Face { a: 1, b: 2, c: 3 }, Face { a: 2, b: 0, c: 3 }]
    } else {
        vec![Face { a: 0, b: 1, c: 2 }, Face { a: 0, b: 3, c: 1 }, Face { a: 1, b: 3, c: 2 }, Face { a: 2, b: 3, c: 0 }]
    };

    let mut mark = vec![vec![0usize; n]; n];
    for i in 4..n {
        let mut vis = Vec::new();
        let mut nxt = Vec::new();
        for &f in &faces {
            let v = jit[f.b].sub(jit[f.a]).cross(jit[f.c].sub(jit[f.a])).dot(jit[i].sub(jit[f.a]));
            if v > 0.0 {
                mark[f.a][f.b] = i;
                mark[f.b][f.c] = i;
                mark[f.c][f.a] = i;
                vis.push(f);
            } else {
                nxt.push(f);
            }
        }
        for f in vis {
            if mark[f.b][f.a] != i { nxt.push(Face { a: f.a, b: f.b, c: i }); }
            if mark[f.c][f.b] != i { nxt.push(Face { a: f.b, b: f.c, c: i }); }
            if mark[f.a][f.c] != i { nxt.push(Face { a: f.c, b: f.a, c: i }); }
        }
        faces = nxt;
    }

    let mut area = 0.0;
    let mut vol = 0.0;
    let rf = orig[0];
    for f in faces {
        area += 0.5 * orig[f.b].sub(orig[f.a]).cross(orig[f.c].sub(orig[f.a])).norm();
        vol += orig[f.a].sub(rf).dot(orig[f.b].sub(rf).cross(orig[f.c].sub(rf))) / 6.0;
    }
    println!("{:.6} {:.6}", area, vol.abs());
}`,
    java21: `import java.io.BufferedInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Locale;

public class Main {
    static class FastScanner {
        private final BufferedInputStream in = new BufferedInputStream(System.in);
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;

        private int readByte() throws IOException {
            if (ptr >= len) {
                ptr = 0;
                len = in.read(buf);
                if (len <= 0) return -1;
            }
            return buf[ptr++];
        }

        String nextToken() throws IOException {
            int c = readByte();
            while (c >= 0 && c <= 32) c = readByte();
            if (c < 0) return null;
            StringBuilder sb = new StringBuilder();
            while (c > 32) {
                sb.append((char) c);
                c = readByte();
            }
            return sb.toString();
        }

        int nextInt() throws IOException {
            return Integer.parseInt(nextToken());
        }

        double nextDouble() throws IOException {
            return Double.parseDouble(nextToken());
        }
    }

    static class P3 {
        double x, y, z;
        P3(double x, double y, double z) { this.x = x; this.y = y; this.z = z; }
        P3 sub(P3 o) { return new P3(x - o.x, y - o.y, z - o.z); }
        P3 cross(P3 o) { return new P3(y * o.z - z * o.y, z * o.x - x * o.z, x * o.y - y * o.x); }
        double dot(P3 o) { return x * o.x + y * o.y + z * o.z; }
        double norm() { return Math.sqrt(dot(this)); }
    }

    static double noise(int i, int salt) {
        long h = 1469598103934665603L ^ (i * 131L + salt);
        h = (h ^ (h >>> 30)) * 0xBF58476D1CE4E5B9L;
        h ^= h >>> 27;
        return (Long.remainderUnsigned(h, 2000001L) / 1000000.0 - 1.0) * 1e-9;
    }

    public static void main(String[] args) throws Exception {
        Locale.setDefault(Locale.US);
        FastScanner fs = new FastScanner();
        String first = fs.nextToken();
        if (first == null) return;
        int n = Integer.parseInt(first);
        P3[] orig = new P3[n], jit = new P3[n];
        for (int i = 0; i < n; i++) {
            double x = fs.nextDouble(), y = fs.nextDouble(), z = fs.nextDouble();
            orig[i] = new P3(x, y, z);
            jit[i] = new P3(x + noise(i, 1), y + noise(i, 2), z + noise(i, 3));
        }
        if (n < 3) {
            System.out.printf("%.6f %.6f%n", 0.0, 0.0);
            return;
        }
        int p1 = 0; double best = -1;
        for (int i = 1; i < n; i++) {
            double d = jit[i].sub(jit[0]).dot(jit[i].sub(jit[0]));
            if (d > best) { best = d; p1 = i; }
        }
        P3 t = orig[1]; orig[1] = orig[p1]; orig[p1] = t;
        t = jit[1]; jit[1] = jit[p1]; jit[p1] = t;

        int p2 = 1; best = -1;
        for (int i = 2; i < n; i++) {
            double d = jit[1].sub(jit[0]).cross(jit[i].sub(jit[0])).norm();
            if (d > best) { best = d; p2 = i; }
        }
        t = orig[2]; orig[2] = orig[p2]; orig[p2] = t;
        t = jit[2]; jit[2] = jit[p2]; jit[p2] = t;

        if (n == 3) {
            double area = orig[1].sub(orig[0]).cross(orig[2].sub(orig[0])).norm();
            System.out.printf("%.6f %.6f%n", area, 0.0);
            return;
        }
        int p3 = 2; best = -1;
        P3 n012 = jit[1].sub(jit[0]).cross(jit[2].sub(jit[0]));
        for (int i = 3; i < n; i++) {
            double d = Math.abs(n012.dot(jit[i].sub(jit[0])));
            if (d > best) { best = d; p3 = i; }
        }
        t = orig[3]; orig[3] = orig[p3]; orig[p3] = t;
        t = jit[3]; jit[3] = jit[p3]; jit[p3] = t;

        ArrayList<int[]> faces = new ArrayList<>();
        if (jit[1].sub(jit[0]).cross(jit[2].sub(jit[0])).dot(jit[3].sub(jit[0])) > 0) {
            faces.add(new int[]{0, 2, 1}); faces.add(new int[]{0, 1, 3});
            faces.add(new int[]{1, 2, 3}); faces.add(new int[]{2, 0, 3});
        } else {
            faces.add(new int[]{0, 1, 2}); faces.add(new int[]{0, 3, 1});
            faces.add(new int[]{1, 3, 2}); faces.add(new int[]{2, 3, 0});
        }
        int[][] mark = new int[n][n];
        for (int i = 4; i < n; i++) {
            ArrayList<int[]> vis = new ArrayList<>(), nxt = new ArrayList<>();
            for (int[] f : faces) {
                double v = jit[f[1]].sub(jit[f[0]]).cross(jit[f[2]].sub(jit[f[0]])).dot(jit[i].sub(jit[f[0]]));
                if (v > 0) {
                    mark[f[0]][f[1]] = mark[f[1]][f[2]] = mark[f[2]][f[0]] = i;
                    vis.add(f);
                } else {
                    nxt.add(f);
                }
            }
            for (int[] f : vis) {
                if (mark[f[1]][f[0]] != i) nxt.add(new int[]{f[0], f[1], i});
                if (mark[f[2]][f[1]] != i) nxt.add(new int[]{f[1], f[2], i});
                if (mark[f[0]][f[2]] != i) nxt.add(new int[]{f[2], f[0], i});
            }
            faces = nxt;
        }
        double area = 0.0, vol = 0.0;
        P3 ref = orig[0];
        for (int[] f : faces) {
            area += 0.5 * orig[f[1]].sub(orig[f[0]]).cross(orig[f[2]].sub(orig[f[0]])).norm();
            vol += orig[f[0]].sub(ref).dot(orig[f[1]].sub(ref).cross(orig[f[2]].sub(ref))) / 6.0;
        }
        System.out.printf("%.6f %.6f%n", area, Math.abs(vol));
    }
}`,
    python3: `import math
import sys

sys.setrecursionlimit(200000)


def sub(a, b):
    return (a[0] - b[0], a[1] - b[1], a[2] - b[2])


def cross(a, b):
    return (
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0],
    )


def dot(a, b):
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]


def norm(a):
    return math.sqrt(dot(a, a))


def noise(i, salt):
    h = 1469598103934665603 ^ (i * 131 + salt)
    h = ((h ^ (h >> 30)) * 0xBF58476D1CE4E5B9) & ((1 << 64) - 1)
    h ^= h >> 27
    return ((h % 2000001) / 1000000.0 - 1.0) * 1e-9


def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    orig = []
    jit = []
    idx = 1
    for i in range(n):
        x = float(data[idx])
        y = float(data[idx + 1])
        z = float(data[idx + 2])
        idx += 3
        orig.append((x, y, z))
        jit.append((x + noise(i, 1), y + noise(i, 2), z + noise(i, 3)))
    if n < 3:
        sys.stdout.write("0.000000 0.000000\\n")
        return

    p1 = max(range(1, n), key=lambda i: dot(sub(jit[i], jit[0]), sub(jit[i], jit[0])))
    orig[1], orig[p1] = orig[p1], orig[1]
    jit[1], jit[p1] = jit[p1], jit[1]

    p2 = max(range(2, n), key=lambda i: norm(cross(sub(jit[1], jit[0]), sub(jit[i], jit[0]))))
    orig[2], orig[p2] = orig[p2], orig[2]
    jit[2], jit[p2] = jit[p2], jit[2]

    if n == 3:
        area = norm(cross(sub(orig[1], orig[0]), sub(orig[2], orig[0])))
        sys.stdout.write(f"{area:.6f} 0.000000\\n")
        return

    n012 = cross(sub(jit[1], jit[0]), sub(jit[2], jit[0]))
    p3 = max(range(3, n), key=lambda i: abs(dot(n012, sub(jit[i], jit[0]))))
    orig[3], orig[p3] = orig[p3], orig[3]
    jit[3], jit[p3] = jit[p3], jit[3]

    if dot(cross(sub(jit[1], jit[0]), sub(jit[2], jit[0])), sub(jit[3], jit[0])) > 0:
        faces = [(0, 2, 1), (0, 1, 3), (1, 2, 3), (2, 0, 3)]
    else:
        faces = [(0, 1, 2), (0, 3, 1), (1, 3, 2), (2, 3, 0)]

    mark = [[-1] * n for _ in range(n)]
    for i in range(4, n):
        vis = []
        nxt = []
        pi = jit[i]
        for a, b, c in faces:
            if dot(cross(sub(jit[b], jit[a]), sub(jit[c], jit[a])), sub(pi, jit[a])) > 0:
                mark[a][b] = mark[b][c] = mark[c][a] = i
                vis.append((a, b, c))
            else:
                nxt.append((a, b, c))
        for a, b, c in vis:
            if mark[b][a] != i:
                nxt.append((a, b, i))
            if mark[c][b] != i:
                nxt.append((b, c, i))
            if mark[a][c] != i:
                nxt.append((c, a, i))
        faces = nxt

    area = 0.0
    vol = 0.0
    ref = orig[0]
    for a, b, c in faces:
        area += 0.5 * norm(cross(sub(orig[b], orig[a]), sub(orig[c], orig[a])))
        vol += dot(sub(orig[a], ref), cross(sub(orig[b], ref), sub(orig[c], ref))) / 6.0
    sys.stdout.write(f"{area:.6f} {abs(vol):.6f}\\n")


if __name__ == "__main__":
    solve()`,
    ruby: `def sub(a, b)
  [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
end

def cross(a, b)
  [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0]
  ]
end

def dot(a, b)
  a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
end

def norm(a)
  Math.sqrt(dot(a, a))
end

def noise(i, salt)
  mask = (1 << 64) - 1
  h = 1469598103934665603 ^ (i * 131 + salt)
  h = ((h ^ (h >> 30)) * 0xBF58476D1CE4E5B9) & mask
  h ^= h >> 27
  ((h % 2_000_001) / 1_000_000.0 - 1.0) * 1e-9
end

data = STDIN.read.split
exit if data.empty?
n = data[0].to_i
orig = []
jit = []
idx = 1
n.times do |i|
  x = data[idx].to_f
  y = data[idx + 1].to_f
  z = data[idx + 2].to_f
  idx += 3
  orig << [x, y, z]
  jit << [x + noise(i, 1), y + noise(i, 2), z + noise(i, 3)]
end

if n < 3
  puts format('%.6f %.6f', 0.0, 0.0)
  exit
end

p1 = (1...n).max_by { |i| dot(sub(jit[i], jit[0]), sub(jit[i], jit[0])) }
orig[1], orig[p1] = orig[p1], orig[1]
jit[1], jit[p1] = jit[p1], jit[1]

p2 = (2...n).max_by { |i| norm(cross(sub(jit[1], jit[0]), sub(jit[i], jit[0]))) }
orig[2], orig[p2] = orig[p2], orig[2]
jit[2], jit[p2] = jit[p2], jit[2]

if n == 3
  area = norm(cross(sub(orig[1], orig[0]), sub(orig[2], orig[0])))
  puts format('%.6f %.6f', area, 0.0)
  exit
end

n012 = cross(sub(jit[1], jit[0]), sub(jit[2], jit[0]))
p3 = (3...n).max_by { |i| dot(n012, sub(jit[i], jit[0])).abs }
orig[3], orig[p3] = orig[p3], orig[3]
jit[3], jit[p3] = jit[p3], jit[3]

faces = if dot(cross(sub(jit[1], jit[0]), sub(jit[2], jit[0])), sub(jit[3], jit[0])) > 0
          [[0, 2, 1], [0, 1, 3], [1, 2, 3], [2, 0, 3]]
        else
          [[0, 1, 2], [0, 3, 1], [1, 3, 2], [2, 3, 0]]
        end

mark = Array.new(n) { Array.new(n, -1) }
(4...n).each do |i|
  vis = []
  nxt = []
  pi = jit[i]
  faces.each do |a, b, c|
    if dot(cross(sub(jit[b], jit[a]), sub(jit[c], jit[a])), sub(pi, jit[a])) > 0
      mark[a][b] = mark[b][c] = mark[c][a] = i
      vis << [a, b, c]
    else
      nxt << [a, b, c]
    end
  end
  vis.each do |a, b, c|
    nxt << [a, b, i] if mark[b][a] != i
    nxt << [b, c, i] if mark[c][b] != i
    nxt << [c, a, i] if mark[a][c] != i
  end
  faces = nxt
end

area = 0.0
vol = 0.0
ref = orig[0]
faces.each do |a, b, c|
  area += 0.5 * norm(cross(sub(orig[b], orig[a]), sub(orig[c], orig[a])))
  vol += dot(sub(orig[a], ref), cross(sub(orig[b], ref), sub(orig[c], ref))) / 6.0
end
puts format('%.6f %.6f', area, vol.abs)`,
  },
  practiceProblems: [
    {
      id: 'ch78-p1',
      tier: 'Warmup',
      ratingRange: '2500–2800',
      title: '3D Convex Hull Surface Area & Volume',
      statement:
        'Given N points (3 <= N <= 500) in 3D space with coordinates in [-10^4, 10^4], compute the total surface area and volume of their 3D convex hull printed to 6 decimal places (volume is 0.000000 if all points are coplanar). Coplanar faces and multiple collinear points on faces may appear in the input.',
      constraints: '3 <= N <= 500; |x|, |y|, |z| <= 10^4; Time Limit: 2.0s',
      sampleInput: '8\n0 0 0\n1 0 0\n0 1 0\n1 1 0\n0 0 1\n1 0 1\n0 1 1\n1 1 1',
      sampleOutput: '6.000000 1.000000',
      hints: [
        'Apply a deterministic ~1e-9 perturbation ONLY for visibility orientation checks so every intermediate hull remains strictly simplicial (triangular) without coplanar flips.',
        'Maintain an edge timestamp table mark[u][v] when removing faces visible from P_i: a directed edge u -> v is on the horizon iff mark[v][u] was not marked by the current insertion. Sum area and shifted tetrahedron volume using original un-jittered vertices.',
      ],
      solutions: {
        cpp20: `#include <algorithm>
#include <cmath>
#include <iomanip>
#include <iostream>
#include <vector>

using namespace std;

struct P3 {
    double x, y, z;
    P3 operator-(const P3& o) const { return {x - o.x, y - o.y, z - o.z}; }
};

static P3 cross(const P3& a, const P3& b) {
    return {a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x};
}

static double dot(const P3& a, const P3& b) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
}

static double norm(const P3& a) {
    return sqrt(dot(a, a));
}

struct Face { int a, b, c; };

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    if (!(cin >> n)) return 0;
    vector<P3> orig(n), jit(n);
    for (int i = 0; i < n; ++i) {
        cin >> orig[i].x >> orig[i].y >> orig[i].z;
        auto noise = [&](int salt) -> double {
            unsigned long long h = 1469598103934665603ULL ^ (unsigned long long)(i * 131 + salt);
            h = (h ^ (h >> 30)) * 0xBF58476D1CE4E5B9ULL;
            h ^= h >> 27;
            return ((double)(h % 2000001ULL) / 1000000.0 - 1.0) * 1e-9;
        };
        jit[i] = {orig[i].x + noise(1), orig[i].y + noise(2), orig[i].z + noise(3)};
    }
    if (n < 3) {
        cout << fixed << setprecision(6) << 0.0 << ' ' << 0.0 << '\\n';
        return 0;
    }

    int p1 = 1;
    double best = -1.0;
    for (int i = 1; i < n; ++i) {
        double d = dot(jit[i] - jit[0], jit[i] - jit[0]);
        if (d > best) { best = d; p1 = i; }
    }
    swap(orig[1], orig[p1]); swap(jit[1], jit[p1]);

    int p2 = 2;
    best = -1.0;
    for (int i = 2; i < n; ++i) {
        double d = norm(cross(jit[1] - jit[0], jit[i] - jit[0]));
        if (d > best) { best = d; p2 = i; }
    }
    swap(orig[2], orig[p2]); swap(jit[2], jit[p2]);

    if (n == 3) {
        cout << fixed << setprecision(6) << norm(cross(orig[1] - orig[0], orig[2] - orig[0])) << ' ' << 0.0 << '\\n';
        return 0;
    }

    int p3 = 3;
    best = -1.0;
    P3 n012 = cross(jit[1] - jit[0], jit[2] - jit[0]);
    for (int i = 3; i < n; ++i) {
        double d = fabs(dot(n012, jit[i] - jit[0]));
        if (d > best) { best = d; p3 = i; }
    }
    swap(orig[3], orig[p3]); swap(jit[3], jit[p3]);

    vector<Face> faces;
    if (dot(cross(jit[1] - jit[0], jit[2] - jit[0]), jit[3] - jit[0]) > 0) {
        faces = {{0, 2, 1}, {0, 1, 3}, {1, 2, 3}, {2, 0, 3}};
    } else {
        faces = {{0, 1, 2}, {0, 3, 1}, {1, 3, 2}, {2, 3, 0}};
    }

    vector<vector<int>> mark(n, vector<int>(n, -1));
    for (int i = 4; i < n; ++i) {
        vector<Face> vis, nxt;
        for (const auto& f : faces) {
            if (dot(cross(jit[f.b] - jit[f.a], jit[f.c] - jit[f.a]), jit[i] - jit[f.a]) > 0) {
                mark[f.a][f.b] = mark[f.b][f.c] = mark[f.c][f.a] = i;
                vis.push_back(f);
            } else {
                nxt.push_back(f);
            }
        }
        for (const auto& f : vis) {
            if (mark[f.b][f.a] != i) nxt.push_back({f.a, f.b, i});
            if (mark[f.c][f.b] != i) nxt.push_back({f.b, f.c, i});
            if (mark[f.a][f.c] != i) nxt.push_back({f.c, f.a, i});
        }
        faces.swap(nxt);
    }

    double area = 0.0, vol = 0.0;
    P3 ref = orig[0];
    for (const auto& f : faces) {
        area += 0.5 * norm(cross(orig[f.b] - orig[f.a], orig[f.c] - orig[f.a]));
        vol += dot(orig[f.a] - ref, cross(orig[f.b] - ref, orig[f.c] - ref)) / 6.0;
    }
    cout << fixed << setprecision(6) << area << ' ' << fabs(vol) << '\\n';
    return 0;
}`,
        rust: `use std::io::{self, Read};

#[derive(Clone, Copy)]
struct P3 { x: f64, y: f64, z: f64 }

impl P3 {
    fn sub(self, o: P3) -> P3 { P3 { x: self.x - o.x, y: self.y - o.y, z: self.z - o.z } }
    fn cross(self, o: P3) -> P3 {
        P3 { x: self.y * o.z - self.z * o.y, y: self.z * o.x - self.x * o.z, z: self.x * o.y - self.y * o.x }
    }
    fn dot(self, o: P3) -> f64 { self.x * o.x + self.y * o.y + self.z * o.z }
    fn norm(self) -> f64 { self.dot(self).sqrt() }
}

fn noise(i: usize, salt: usize) -> f64 {
    let mut h: u64 = 1469598103934665603 ^ ((i * 131 + salt) as u64);
    h = (h ^ (h >> 30)).wrapping_mul(0xBF58_476D_1CE4_E5B9);
    h ^= h >> 27;
    (((h % 2_000_001) as f64) / 1_000_000.0 - 1.0) * 1e-9
}

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let n: usize = match it.next() { Some(v) => v.parse().unwrap(), None => return };
    let mut orig = Vec::with_capacity(n);
    let mut jit = Vec::with_capacity(n);
    for i in 0..n {
        let x: f64 = it.next().unwrap().parse().unwrap();
        let y: f64 = it.next().unwrap().parse().unwrap();
        let z: f64 = it.next().unwrap().parse().unwrap();
        orig.push(P3 { x, y, z });
        jit.push(P3 { x: x + noise(i, 1), y: y + noise(i, 2), z: z + noise(i, 3) });
    }
    if n < 3 { println!("{:.6} {:.6}", 0.0, 0.0); return; }

    let mut p1 = 1; let mut best = -1.0;
    for i in 1..n {
        let d = jit[i].sub(jit[0]).dot(jit[i].sub(jit[0]));
        if d > best { best = d; p1 = i; }
    }
    orig.swap(1, p1); jit.swap(1, p1);

    let mut p2 = 2; best = -1.0;
    for i in 2..n {
        let d = jit[1].sub(jit[0]).cross(jit[i].sub(jit[0])).norm();
        if d > best { best = d; p2 = i; }
    }
    orig.swap(2, p2); jit.swap(2, p2);

    if n == 3 {
        println!("{:.6} {:.6}", orig[1].sub(orig[0]).cross(orig[2].sub(orig[0])).norm(), 0.0);
        return;
    }

    let mut p3 = 3; best = -1.0;
    let n012 = jit[1].sub(jit[0]).cross(jit[2].sub(jit[0]));
    for i in 3..n {
        let d = n012.dot(jit[i].sub(jit[0])).abs();
        if d > best { best = d; p3 = i; }
    }
    orig.swap(3, p3); jit.swap(3, p3);

    let mut faces = if jit[1].sub(jit[0]).cross(jit[2].sub(jit[0])).dot(jit[3].sub(jit[0])) > 0.0 {
        vec![(0, 2, 1), (0, 1, 3), (1, 2, 3), (2, 0, 3)]
    } else {
        vec![(0, 1, 2), (0, 3, 1), (1, 3, 2), (2, 3, 0)]
    };

    let mut mark = vec![vec![0usize; n]; n];
    for i in 4..n {
        let mut vis = Vec::new();
        let mut nxt = Vec::new();
        for &(a, b, c) in &faces {
            if jit[b].sub(jit[a]).cross(jit[c].sub(jit[a])).dot(jit[i].sub(jit[a])) > 0.0 {
                mark[a][b] = i; mark[b][c] = i; mark[c][a] = i;
                vis.push((a, b, c));
            } else {
                nxt.push((a, b, c));
            }
        }
        for (a, b, c) in vis {
            if mark[b][a] != i { nxt.push((a, b, i)); }
            if mark[c][b] != i { nxt.push((b, c, i)); }
            if mark[a][c] != i { nxt.push((c, a, i)); }
        }
        faces = nxt;
    }

    let mut area = 0.0;
    let mut vol = 0.0;
    let rf = orig[0];
    for (a, b, c) in faces {
        area += 0.5 * orig[b].sub(orig[a]).cross(orig[c].sub(orig[a])).norm();
        vol += orig[a].sub(rf).dot(orig[b].sub(rf).cross(orig[c].sub(rf))) / 6.0;
    }
    println!("{:.6} {:.6}", area, vol.abs());
}`,
        java21: `import java.io.BufferedInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Locale;

public class Main {
    static class FastScanner {
        private final BufferedInputStream in = new BufferedInputStream(System.in);
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;

        private int readByte() throws IOException {
            if (ptr >= len) {
                ptr = 0;
                len = in.read(buf);
                if (len <= 0) return -1;
            }
            return buf[ptr++];
        }

        String nextToken() throws IOException {
            int c = readByte();
            while (c >= 0 && c <= 32) c = readByte();
            if (c < 0) return null;
            StringBuilder sb = new StringBuilder();
            while (c > 32) { sb.append((char) c); c = readByte(); }
            return sb.toString();
        }
    }

    static class P3 {
        double x, y, z;
        P3(double x, double y, double z) { this.x = x; this.y = y; this.z = z; }
        P3 sub(P3 o) { return new P3(x - o.x, y - o.y, z - o.z); }
        P3 cross(P3 o) { return new P3(y * o.z - z * o.y, z * o.x - x * o.z, x * o.y - y * o.x); }
        double dot(P3 o) { return x * o.x + y * o.y + z * o.z; }
        double norm() { return Math.sqrt(dot(this)); }
    }

    static double noise(int i, int salt) {
        long h = 1469598103934665603L ^ (i * 131L + salt);
        h = (h ^ (h >>> 30)) * 0xBF58476D1CE4E5B9L;
        h ^= h >>> 27;
        return (Long.remainderUnsigned(h, 2000001L) / 1000000.0 - 1.0) * 1e-9;
    }

    public static void main(String[] args) throws Exception {
        Locale.setDefault(Locale.US);
        FastScanner fs = new FastScanner();
        String s0 = fs.nextToken();
        if (s0 == null) return;
        int n = Integer.parseInt(s0);
        P3[] orig = new P3[n], jit = new P3[n];
        for (int i = 0; i < n; i++) {
            double x = Double.parseDouble(fs.nextToken());
            double y = Double.parseDouble(fs.nextToken());
            double z = Double.parseDouble(fs.nextToken());
            orig[i] = new P3(x, y, z);
            jit[i] = new P3(x + noise(i, 1), y + noise(i, 2), z + noise(i, 3));
        }
        if (n < 3) { System.out.printf("%.6f %.6f%n", 0.0, 0.0); return; }

        int p1 = 1; double best = -1;
        for (int i = 1; i < n; i++) {
            double d = jit[i].sub(jit[0]).dot(jit[i].sub(jit[0]));
            if (d > best) { best = d; p1 = i; }
        }
        P3 t = orig[1]; orig[1] = orig[p1]; orig[p1] = t;
        t = jit[1]; jit[1] = jit[p1]; jit[p1] = t;

        int p2 = 2; best = -1;
        for (int i = 2; i < n; i++) {
            double d = jit[1].sub(jit[0]).cross(jit[i].sub(jit[0])).norm();
            if (d > best) { best = d; p2 = i; }
        }
        t = orig[2]; orig[2] = orig[p2]; orig[p2] = t;
        t = jit[2]; jit[2] = jit[p2]; jit[p2] = t;

        if (n == 3) {
            System.out.printf("%.6f %.6f%n", orig[1].sub(orig[0]).cross(orig[2].sub(orig[0])).norm(), 0.0);
            return;
        }
        int p3 = 3; best = -1;
        P3 n012 = jit[1].sub(jit[0]).cross(jit[2].sub(jit[0]));
        for (int i = 3; i < n; i++) {
            double d = Math.abs(n012.dot(jit[i].sub(jit[0])));
            if (d > best) { best = d; p3 = i; }
        }
        t = orig[3]; orig[3] = orig[p3]; orig[p3] = t;
        t = jit[3]; jit[3] = jit[p3]; jit[p3] = t;

        ArrayList<int[]> faces = new ArrayList<>();
        if (jit[1].sub(jit[0]).cross(jit[2].sub(jit[0])).dot(jit[3].sub(jit[0])) > 0) {
            faces.add(new int[]{0, 2, 1}); faces.add(new int[]{0, 1, 3});
            faces.add(new int[]{1, 2, 3}); faces.add(new int[]{2, 0, 3});
        } else {
            faces.add(new int[]{0, 1, 2}); faces.add(new int[]{0, 3, 1});
            faces.add(new int[]{1, 3, 2}); faces.add(new int[]{2, 3, 0});
        }
        int[][] mark = new int[n][n];
        for (int i = 4; i < n; i++) {
            ArrayList<int[]> vis = new ArrayList<>(), nxt = new ArrayList<>();
            for (int[] f : faces) {
                double v = jit[f[1]].sub(jit[f[0]]).cross(jit[f[2]].sub(jit[f[0]])).dot(jit[i].sub(jit[f[0]]));
                if (v > 0) { mark[f[0]][f[1]] = mark[f[1]][f[2]] = mark[f[2]][f[0]] = i; vis.add(f); }
                else nxt.add(f);
            }
            for (int[] f : vis) {
                if (mark[f[1]][f[0]] != i) nxt.add(new int[]{f[0], f[1], i});
                if (mark[f[2]][f[1]] != i) nxt.add(new int[]{f[1], f[2], i});
                if (mark[f[0]][f[2]] != i) nxt.add(new int[]{f[2], f[0], i});
            }
            faces = nxt;
        }
        double area = 0.0, vol = 0.0;
        P3 ref = orig[0];
        for (int[] f : faces) {
            area += 0.5 * orig[f[1]].sub(orig[f[0]]).cross(orig[f[2]].sub(orig[f[0]])).norm();
            vol += orig[f[0]].sub(ref).dot(orig[f[1]].sub(ref).cross(orig[f[2]].sub(ref))) / 6.0;
        }
        System.out.printf("%.6f %.6f%n", area, Math.abs(vol));
    }
}`,
        python3: `import math
import sys

sys.setrecursionlimit(200000)


def sub(a, b):
    return (a[0] - b[0], a[1] - b[1], a[2] - b[2])


def cross(a, b):
    return (
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0],
    )


def dot(a, b):
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]


def norm(a):
    return math.sqrt(dot(a, a))


def noise(i, salt):
    h = 1469598103934665603 ^ (i * 131 + salt)
    h = ((h ^ (h >> 30)) * 0xBF58476D1CE4E5B9) & ((1 << 64) - 1)
    h ^= h >> 27
    return ((h % 2000001) / 1000000.0 - 1.0) * 1e-9


def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    orig = []
    jit = []
    idx = 1
    for i in range(n):
        x, y, z = float(data[idx]), float(data[idx + 1]), float(data[idx + 2])
        idx += 3
        orig.append((x, y, z))
        jit.append((x + noise(i, 1), y + noise(i, 2), z + noise(i, 3)))
    if n < 3:
        sys.stdout.write("0.000000 0.000000\\n")
        return

    p1 = max(range(1, n), key=lambda i: dot(sub(jit[i], jit[0]), sub(jit[i], jit[0])))
    orig[1], orig[p1] = orig[p1], orig[1]
    jit[1], jit[p1] = jit[p1], jit[1]

    p2 = max(range(2, n), key=lambda i: norm(cross(sub(jit[1], jit[0]), sub(jit[i], jit[0]))))
    orig[2], orig[p2] = orig[p2], orig[2]
    jit[2], jit[p2] = jit[p2], jit[2]

    if n == 3:
        sys.stdout.write(f"{norm(cross(sub(orig[1], orig[0]), sub(orig[2], orig[0]))):.6f} 0.000000\\n")
        return

    n012 = cross(sub(jit[1], jit[0]), sub(jit[2], jit[0]))
    p3 = max(range(3, n), key=lambda i: abs(dot(n012, sub(jit[i], jit[0]))))
    orig[3], orig[p3] = orig[p3], orig[3]
    jit[3], jit[p3] = jit[p3], jit[3]

    if dot(cross(sub(jit[1], jit[0]), sub(jit[2], jit[0])), sub(jit[3], jit[0])) > 0:
        faces = [(0, 2, 1), (0, 1, 3), (1, 2, 3), (2, 0, 3)]
    else:
        faces = [(0, 1, 2), (0, 3, 1), (1, 3, 2), (2, 3, 0)]

    mark = [[-1] * n for _ in range(n)]
    for i in range(4, n):
        vis = []
        nxt = []
        pi = jit[i]
        for a, b, c in faces:
            if dot(cross(sub(jit[b], jit[a]), sub(jit[c], jit[a])), sub(pi, jit[a])) > 0:
                mark[a][b] = mark[b][c] = mark[c][a] = i
                vis.append((a, b, c))
            else:
                nxt.append((a, b, c))
        for a, b, c in vis:
            if mark[b][a] != i:
                nxt.append((a, b, i))
            if mark[c][b] != i:
                nxt.append((b, c, i))
            if mark[a][c] != i:
                nxt.append((c, a, i))
        faces = nxt

    area = 0.0
    vol = 0.0
    ref = orig[0]
    for a, b, c in faces:
        area += 0.5 * norm(cross(sub(orig[b], orig[a]), sub(orig[c], orig[a])))
        vol += dot(sub(orig[a], ref), cross(sub(orig[b], ref), sub(orig[c], ref))) / 6.0
    sys.stdout.write(f"{area:.6f} {abs(vol):.6f}\\n")


if __name__ == "__main__":
    solve()`,
        ruby: `def sub(a, b)
  [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
end

def cross(a, b)
  [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
end

def dot(a, b)
  a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
end

def norm(a)
  Math.sqrt(dot(a, a))
end

def noise(i, salt)
  mask = (1 << 64) - 1
  h = 1469598103934665603 ^ (i * 131 + salt)
  h = ((h ^ (h >> 30)) * 0xBF58476D1CE4E5B9) & mask
  h ^= h >> 27
  ((h % 2_000_001) / 1_000_000.0 - 1.0) * 1e-9
end

data = STDIN.read.split
exit if data.empty?
n = data[0].to_i
orig = []
jit = []
idx = 1
n.times do |i|
  x = data[idx].to_f; y = data[idx + 1].to_f; z = data[idx + 2].to_f
  idx += 3
  orig << [x, y, z]
  jit << [x + noise(i, 1), y + noise(i, 2), z + noise(i, 3)]
end

if n < 3
  puts format('%.6f %.6f', 0.0, 0.0)
  exit
end

p1 = (1...n).max_by { |i| dot(sub(jit[i], jit[0]), sub(jit[i], jit[0])) }
orig[1], orig[p1] = orig[p1], orig[1]; jit[1], jit[p1] = jit[p1], jit[1]

p2 = (2...n).max_by { |i| norm(cross(sub(jit[1], jit[0]), sub(jit[i], jit[0]))) }
orig[2], orig[p2] = orig[p2], orig[2]; jit[2], jit[p2] = jit[p2], jit[2]

if n == 3
  puts format('%.6f %.6f', norm(cross(sub(orig[1], orig[0]), sub(orig[2], orig[0]))), 0.0)
  exit
end

n012 = cross(sub(jit[1], jit[0]), sub(jit[2], jit[0]))
p3 = (3...n).max_by { |i| dot(n012, sub(jit[i], jit[0])).abs }
orig[3], orig[p3] = orig[p3], orig[3]; jit[3], jit[p3] = jit[p3], jit[3]

faces = if dot(cross(sub(jit[1], jit[0]), sub(jit[2], jit[0])), sub(jit[3], jit[0])) > 0
          [[0, 2, 1], [0, 1, 3], [1, 2, 3], [2, 0, 3]]
        else
          [[0, 1, 2], [0, 3, 1], [1, 3, 2], [2, 3, 0]]
        end

mark = Array.new(n) { Array.new(n, -1) }
(4...n).each do |i|
  vis = []; nxt = []; pi = jit[i]
  faces.each do |a, b, c|
    if dot(cross(sub(jit[b], jit[a]), sub(jit[c], jit[a])), sub(pi, jit[a])) > 0
      mark[a][b] = mark[b][c] = mark[c][a] = i
      vis << [a, b, c]
    else
      nxt << [a, b, c]
    end
  end
  vis.each do |a, b, c|
    nxt << [a, b, i] if mark[b][a] != i
    nxt << [b, c, i] if mark[c][b] != i
    nxt << [c, a, i] if mark[a][c] != i
  end
  faces = nxt
end

area = 0.0; vol = 0.0; ref = orig[0]
faces.each do |a, b, c|
  area += 0.5 * norm(cross(sub(orig[b], orig[a]), sub(orig[c], orig[a])))
  vol += dot(sub(orig[a], ref), cross(sub(orig[b], ref), sub(orig[c], ref))) / 6.0
end
puts format('%.6f %.6f', area, vol.abs)`,
      },
    },
    {
      id: 'ch78-p2',
      tier: 'Standard',
      ratingRange: '2700–3000',
      title: 'Minimum Enclosing Circle via Expected O(N) Welzl Algorithm',
      statement:
        'Given N points (1 <= N <= 100000) in the 2D plane with coordinates in [-10^6, 10^6], find the unique minimum enclosing circle (center x, y and radius r) printed to 6 decimal places.',
      constraints: '1 <= N <= 100000; |x|, |y| <= 10^6; Time Limit: 1.5s',
      sampleInput: '4\n0 0\n4 0\n0 4\n1 1',
      sampleOutput: '2.000000 2.000000 2.828427',
      hints: [
        'Apply a deterministic Fisher-Yates permutation using a 64-bit SplitMix/Xorshift generator so worst-case adversarial point orders reduce to O(N) expected updates.',
        'Iteratively maintain the smallest disc C over P[0..i]: whenever P[i] falls outside C, reset C = {P[i], 0} and scan j < i, then k < j with circumcircle(P[i], P[j], P[k]).',
      ],
      solutions: {
        cpp20: `#include <algorithm>
#include <cmath>
#include <cstdint>
#include <iomanip>
#include <iostream>
#include <vector>

using namespace std;

struct P2 { double x, y; };
struct Circle { P2 c; double r; };

static Circle c2(const P2& a, const P2& b) {
    return {{0.5 * (a.x + b.x), 0.5 * (a.y + b.y)}, 0.5 * hypot(a.x - b.x, a.y - b.y)};
}

static bool inside(const Circle& c, const P2& p) {
    return hypot(p.x - c.c.x, p.y - c.c.y) <= c.r + 1e-11;
}

static Circle c3(const P2& a, const P2& b, const P2& c) {
    double A = b.x - a.x, B = b.y - a.y;
    double C = c.x - a.x, D = c.y - a.y;
    double G = 2.0 * (A * D - B * C);
    if (fabs(G) < 1e-12) {
        Circle best = c2(a, b);
        if (best.r < c2(b, c).r) best = c2(b, c);
        if (best.r < c2(a, c).r) best = c2(a, c);
        return best;
    }
    double E = A * (a.x + b.x) + B * (a.y + b.y);
    double F = C * (a.x + c.x) + D * (a.y + c.y);
    double cx = (D * E - B * F) / G;
    double cy = (A * F - C * E) / G;
    return {{cx, cy}, hypot(cx - a.x, cy - a.y)};
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    if (!(cin >> n)) return 0;
    vector<P2> p(n);
    for (int i = 0; i < n; ++i) cin >> p[i].x >> p[i].y;

    uint64_t rng = 0x9E3779B97F4A7C15ULL ^ (uint64_t)n;
    for (int i = n - 1; i > 0; --i) {
        rng += 0x9E3779B97F4A7C15ULL;
        uint64_t z = (rng ^ (rng >> 30)) * 0xBF58476D1CE4E5B9ULL;
        z ^= z >> 27;
        swap(p[i], p[(int)(z % (uint64_t)(i + 1))]);
    }

    Circle cur = {p[0], 0.0};
    for (int i = 1; i < n; ++i) {
        if (!inside(cur, p[i])) {
            cur = {p[i], 0.0};
            for (int j = 0; j < i; ++j) {
                if (!inside(cur, p[j])) {
                    cur = c2(p[i], p[j]);
                    for (int k = 0; k < j; ++k) {
                        if (!inside(cur, p[k])) {
                            cur = c3(p[i], p[j], p[k]);
                        }
                    }
                }
            }
        }
    }
    cout << fixed << setprecision(6) << cur.c.x << ' ' << cur.c.y << ' ' << cur.r << '\\n';
    return 0;
}`,
        rust: `use std::io::{self, Read};

#[derive(Clone, Copy)]
struct P2 { x: f64, y: f64 }

#[derive(Clone, Copy)]
struct Circle { cx: f64, cy: f64, r: f64 }

fn dist(ax: f64, ay: f64, bx: f64, by: f64) -> f64 {
    (ax - bx).hypot(ay - by)
}

fn c2(a: P2, b: P2) -> Circle {
    Circle { cx: 0.5 * (a.x + b.x), cy: 0.5 * (a.y + b.y), r: 0.5 * dist(a.x, a.y, b.x, b.y) }
}

fn inside(c: Circle, p: P2) -> bool {
    dist(c.cx, c.cy, p.x, p.y) <= c.r + 1e-11
}

fn c3(a: P2, b: P2, c: P2) -> Circle {
    let a1 = b.x - a.x; let b1 = b.y - a.y;
    let c1 = c.x - a.x; let d1 = c.y - a.y;
    let g = 2.0 * (a1 * d1 - b1 * c1);
    if g.abs() < 1e-12 {
        let mut best = c2(a, b);
        for cand in [c2(b, c), c2(a, c)] {
            if cand.r > best.r { best = cand; }
        }
        return best;
    }
    let e = a1 * (a.x + b.x) + b1 * (a.y + b.y);
    let f = c1 * (a.x + c.x) + d1 * (a.y + c.y);
    let cx = (d1 * e - b1 * f) / g;
    let cy = (a1 * f - c1 * e) / g;
    Circle { cx, cy, r: dist(cx, cy, a.x, a.y) }
}

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let n: usize = match it.next() { Some(v) => v.parse().unwrap(), None => return };
    let mut p = Vec::with_capacity(n);
    for _ in 0..n {
        let x: f64 = it.next().unwrap().parse().unwrap();
        let y: f64 = it.next().unwrap().parse().unwrap();
        p.push(P2 { x, y });
    }
    let mut rng: u64 = 0x9E37_79B9_7F4A_7C15 ^ (n as u64);
    for i in (1..n).rev() {
        rng = rng.wrapping_add(0x9E37_79B9_7F4A_7C15);
        let mut z = (rng ^ (rng >> 30)).wrapping_mul(0xBF58_476D_1CE4_E5B9);
        z ^= z >> 27;
        p.swap(i, (z as usize) % (i + 1));
    }

    let mut cur = Circle { cx: p[0].x, cy: p[0].y, r: 0.0 };
    for i in 1..n {
        if !inside(cur, p[i]) {
            cur = Circle { cx: p[i].x, cy: p[i].y, r: 0.0 };
            for j in 0..i {
                if !inside(cur, p[j]) {
                    cur = c2(p[i], p[j]);
                    for k in 0..j {
                        if !inside(cur, p[k]) {
                            cur = c3(p[i], p[j], p[k]);
                        }
                    }
                }
            }
        }
    }
    println!("{:.6} {:.6} {:.6}", cur.cx, cur.cy, cur.r);
}`,
        java21: `import java.io.BufferedInputStream;
import java.io.IOException;
import java.util.Locale;

public class Main {
    static class FastScanner {
        private final BufferedInputStream in = new BufferedInputStream(System.in);
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;

        private int readByte() throws IOException {
            if (ptr >= len) {
                ptr = 0;
                len = in.read(buf);
                if (len <= 0) return -1;
            }
            return buf[ptr++];
        }

        String nextToken() throws IOException {
            int c = readByte();
            while (c >= 0 && c <= 32) c = readByte();
            if (c < 0) return null;
            StringBuilder sb = new StringBuilder();
            while (c > 32) { sb.append((char) c); c = readByte(); }
            return sb.toString();
        }
    }

    static double cx, cy, cr;

    static void setC2(double ax, double ay, double bx, double by) {
        cx = 0.5 * (ax + bx);
        cy = 0.5 * (ay + by);
        cr = 0.5 * Math.hypot(ax - bx, ay - by);
    }

    static boolean inside(double x, double y) {
        return Math.hypot(x - cx, y - cy) <= cr + 1e-11;
    }

    static void setC3(double ax, double ay, double bx, double by, double px, double py) {
        double A = bx - ax, B = by - ay;
        double C = px - ax, D = py - ay;
        double G = 2.0 * (A * D - B * C);
        if (Math.abs(G) < 1e-12) {
            setC2(ax, ay, bx, by);
            double r1 = cr, x1 = cx, y1 = cy;
            setC2(bx, by, px, py);
            if (cr > r1) { r1 = cr; x1 = cx; y1 = cy; }
            setC2(ax, ay, px, py);
            if (cr > r1) { r1 = cr; x1 = cx; y1 = cy; }
            cx = x1; cy = y1; cr = r1;
            return;
        }
        double E = A * (ax + bx) + B * (ay + by);
        double F = C * (ax + px) + D * (ay + py);
        cx = (D * E - B * F) / G;
        cy = (A * F - C * E) / G;
        cr = Math.hypot(cx - ax, cy - ay);
    }

    public static void main(String[] args) throws Exception {
        Locale.setDefault(Locale.US);
        FastScanner fs = new FastScanner();
        String s0 = fs.nextToken();
        if (s0 == null) return;
        int n = Integer.parseInt(s0);
        double[] xs = new double[n], ys = new double[n];
        for (int i = 0; i < n; i++) {
            xs[i] = Double.parseDouble(fs.nextToken());
            ys[i] = Double.parseDouble(fs.nextToken());
        }
        long rng = 0x9E3779B97F4A7C15L ^ n;
        for (int i = n - 1; i > 0; i--) {
            rng += 0x9E3779B97F4A7C15L;
            long z = (rng ^ (rng >>> 30)) * 0xBF58476D1CE4E5B9L;
            z ^= z >>> 27;
            int j = (int) Long.remainderUnsigned(z, i + 1L);
            double tx = xs[i]; xs[i] = xs[j]; xs[j] = tx;
            double ty = ys[i]; ys[i] = ys[j]; ys[j] = ty;
        }
        cx = xs[0]; cy = ys[0]; cr = 0.0;
        for (int i = 1; i < n; i++) {
            if (!inside(xs[i], ys[i])) {
                cx = xs[i]; cy = ys[i]; cr = 0.0;
                for (int j = 0; j < i; j++) {
                    if (!inside(xs[j], ys[j])) {
                        setC2(xs[i], ys[i], xs[j], ys[j]);
                        for (int k = 0; k < j; k++) {
                            if (!inside(xs[k], ys[k])) {
                                setC3(xs[i], ys[i], xs[j], ys[j], xs[k], ys[k]);
                            }
                        }
                    }
                }
            }
        }
        System.out.printf("%.6f %.6f %.6f%n", cx, cy, cr);
    }
}`,
        python3: `import math
import sys

sys.setrecursionlimit(200000)
MASK64 = (1 << 64) - 1


def c2(a, b):
    return (0.5 * (a[0] + b[0]), 0.5 * (a[1] + b[1]), 0.5 * math.hypot(a[0] - b[0], a[1] - b[1]))


def c3(a, b, c):
    A, B = b[0] - a[0], b[1] - a[1]
    C, D = c[0] - a[0], c[1] - a[1]
    G = 2.0 * (A * D - B * C)
    if abs(G) < 1e-12:
        return max((c2(a, b), c2(b, c), c2(a, c)), key=lambda t: t[2])
    E = A * (a[0] + b[0]) + B * (a[1] + b[1])
    F = C * (a[0] + c[0]) + D * (a[1] + c[1])
    cx = (D * E - B * F) / G
    cy = (A * F - C * E) / G
    return (cx, cy, math.hypot(cx - a[0], cy - a[1]))


def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    pts = [(float(data[1 + 2 * i]), float(data[2 + 2 * i])) for i in range(n)]
    rng = (0x9E3779B97F4A7C15 ^ n) & MASK64
    for i in range(n - 1, 0, -1):
        rng = (rng + 0x9E3779B97F4A7C15) & MASK64
        z = ((rng ^ (rng >> 30)) * 0xBF58476D1CE4E5B9) & MASK64
        z ^= z >> 27
        j = z % (i + 1)
        pts[i], pts[j] = pts[j], pts[i]

    cx, cy, cr = pts[0][0], pts[0][1], 0.0
    for i in range(1, n):
        px, py = pts[i]
        if math.hypot(px - cx, py - cy) > cr + 1e-11:
            cx, cy, cr = px, py, 0.0
            for j in range(i):
                qx, qy = pts[j]
                if math.hypot(qx - cx, qy - cy) > cr + 1e-11:
                    cx, cy, cr = c2(pts[i], pts[j])
                    for k in range(j):
                        rx, ry = pts[k]
                        if math.hypot(rx - cx, ry - cy) > cr + 1e-11:
                            cx, cy, cr = c3(pts[i], pts[j], pts[k])
    sys.stdout.write(f"{cx:.6f} {cy:.6f} {cr:.6f}\\n")


if __name__ == "__main__":
    solve()`,
        ruby: `MASK64 = (1 << 64) - 1

def c2(a, b)
  [0.5 * (a[0] + b[0]), 0.5 * (a[1] + b[1]), 0.5 * Math.hypot(a[0] - b[0], a[1] - b[1])]
end

def c3(a, b, c)
  aa = b[0] - a[0]; bb = b[1] - a[1]
  cc = c[0] - a[0]; dd = c[1] - a[1]
  g = 2.0 * (aa * dd - bb * cc)
  return [c2(a, b), c2(b, c), c2(a, c)].max_by { |t| t[2] } if g.abs < 1e-12

  ee = aa * (a[0] + b[0]) + bb * (a[1] + b[1])
  ff = cc * (a[0] + c[0]) + dd * (a[1] + c[1])
  cx = (dd * ee - bb * ff) / g
  cy = (aa * ff - cc * ee) / g
  [cx, cy, Math.hypot(cx - a[0], cy - a[1])]
end

data = STDIN.read.split
exit if data.empty?
n = data[0].to_i
pts = Array.new(n) { |i| [data[1 + 2 * i].to_f, data[2 + 2 * i].to_f] }
rng = (0x9E3779B97F4A7C15 ^ n) & MASK64
(n - 1).downto(1) do |i|
  rng = (rng + 0x9E3779B97F4A7C15) & MASK64
  z = ((rng ^ (rng >> 30)) * 0xBF58476D1CE4E5B9) & MASK64
  z ^= z >> 27
  j = z % (i + 1)
  pts[i], pts[j] = pts[j], pts[i]
end

cx, cy, cr = pts[0][0], pts[0][1], 0.0
(1...n).each do |i|
  px, py = pts[i]
  next if Math.hypot(px - cx, py - cy) <= cr + 1e-11
  cx, cy, cr = px, py, 0.0
  (0...i).each do |j|
    qx, qy = pts[j]
    next if Math.hypot(qx - cx, qy - cy) <= cr + 1e-11
    cx, cy, cr = c2(pts[i], pts[j])
    (0...j).each do |k|
      rx, ry = pts[k]
      next if Math.hypot(rx - cx, ry - cy) <= cr + 1e-11
      cx, cy, cr = c3(pts[i], pts[j], pts[k])
    end
  end
end
puts format('%.6f %.6f %.6f', cx, cy, cr)`,
      },
    },
    {
      id: 'ch78-p3',
      tier: 'Boss',
      ratingRange: '2900–3300+',
      title: 'Euclidean Minimum Spanning Tree via O(N log N) Delaunay Triangulation',
      statement:
        'Given N integer lattice points (x_i, y_i) in the 2D plane (1 <= N <= 50000, |x_i|, |y_i| <= 10^6), compute the total Euclidean edge length of a Minimum Spanning Tree connecting all N points, printed to 6 decimal places.',
      constraints: '1 <= N <= 50000; |x_i|, |y_i| <= 10^6; Time Limit: 2.0s',
      sampleInput: '5\n0 0\n2 0\n0 2\n2 2\n1 1',
      sampleOutput: '5.656854',
      hints: [
        'Sort and deduplicate points by (x, y), then construct the Delaunay triangulation in O(N log N) using Guibas-Stolfi Quad-Edge divide-and-conquer.',
        'Evaluate the 4x4 InCircle predicate using 128-bit integer arithmetic (__int128 / BigInteger) so coordinates up to 10^6 never overflow, then run Kruskal over all active Quad-Edge pairs sorted by exact squared integer distance.',
      ],
      solutions: {
        cpp20: `#include <algorithm>
#include <cmath>
#include <iomanip>
#include <iostream>
#include <numeric>
#include <vector>

using namespace std;

struct Pt {
    long long x, y;
    int id;
    bool operator<(const Pt& o) const { return x != o.x ? x < o.x : y < o.y; }
    bool operator==(const Pt& o) const { return x == o.x && y == o.y; }
};

struct QuadEdgeDelaunay {
    vector<Pt> pts;
    vector<int> org, nxt;
    vector<bool> alive;

    static int sym(int e) { return e ^ 2; }
    static int rot(int e) { return (e & ~3) | ((e + 1) & 3); }
    static int invrot(int e) { return (e & ~3) | ((e + 3) & 3); }
    int onext(int e) const { return nxt[e]; }
    int oprev(int e) const { return rot(nxt[rot(e)]); }
    int lnext(int e) const { return rot(nxt[invrot(e)]); }
    int rprev(int e) const { return nxt[sym(e)]; }
    int dest(int e) const { return org[sym(e)]; }

    static __int128 cross(const Pt& a, const Pt& b, const Pt& c) {
        return (__int128)(b.x - a.x) * (c.y - a.y) - (__int128)(b.y - a.y) * (c.x - a.x);
    }

    bool left_of(int p, int e) const { return cross(pts[p], pts[org[e]], pts[dest(e)]) > 0; }
    bool right_of(int p, int e) const { return cross(pts[p], pts[dest(e)], pts[org[e]]) > 0; }

    bool in_circle(int ia, int ib, int ic, int id) const {
        const Pt &a = pts[ia], &b = pts[ib], &c = pts[ic], &d = pts[id];
        __int128 ax = a.x - d.x, ay = a.y - d.y;
        __int128 bx = b.x - d.x, by = b.y - d.y;
        __int128 cx = c.x - d.x, cy = c.y - d.y;
        __int128 al = ax * ax + ay * ay;
        __int128 bl = bx * bx + by * by;
        __int128 cl = cx * cx + cy * cy;
        __int128 det = al * (bx * cy - by * cx)
                     - bl * (ax * cy - ay * cx)
                     + cl * (ax * by - ay * bx);
        return det > 0;
    }

    int make_edge(int u, int v) {
        int e0 = (int)org.size();
        org.push_back(u); org.push_back(-1); org.push_back(v); org.push_back(-1);
        nxt.push_back(e0); nxt.push_back(e0 + 3); nxt.push_back(e0 + 2); nxt.push_back(e0 + 1);
        alive.push_back(true);
        return e0;
    }

    void splice(int a, int b) {
        int alpha = rot(nxt[a]), beta = rot(nxt[b]);
        swap(nxt[a], nxt[b]);
        swap(nxt[alpha], nxt[beta]);
    }

    int connect(int a, int b) {
        int e = make_edge(dest(a), org[b]);
        splice(e, lnext(a));
        splice(sym(e), b);
        return e;
    }

    void delete_edge(int e) {
        alive[e >> 2] = false;
        splice(e, oprev(e));
        splice(sym(e), oprev(sym(e)));
    }

    pair<int, int> build(int l, int r) {
        int cnt = r - l;
        if (cnt == 2) {
            int a = make_edge(l, l + 1);
            return {a, sym(a)};
        }
        if (cnt == 3) {
            int a = make_edge(l, l + 1), b = make_edge(l + 1, l + 2);
            splice(sym(a), b);
            __int128 cr = cross(pts[l], pts[l + 1], pts[l + 2]);
            if (cr > 0) {
                connect(b, a);
                return {a, sym(b)};
            } else if (cr < 0) {
                int e = connect(b, a);
                return {sym(e), e};
            } else {
                return {a, sym(b)};
            }
        }
        int mid = (l + r) / 2;
        auto [ldo, ldi] = build(l, mid);
        auto [rdi, rdo] = build(mid, r);
        while (true) {
            if (left_of(org[rdi], ldi)) ldi = lnext(ldi);
            else if (right_of(org[ldi], rdi)) rdi = rprev(rdi);
            else break;
        }
        int basel = connect(sym(rdi), ldi);
        if (org[ldi] == org[ldo]) ldo = sym(basel);
        if (org[rdi] == org[rdo]) rdo = basel;

        auto valid = [&](int e) { return right_of(dest(e), basel); };
        while (true) {
            int lcand = nxt[sym(basel)];
            if (valid(lcand)) {
                while (in_circle(dest(basel), org[basel], dest(lcand), dest(nxt[lcand]))) {
                    int t = nxt[lcand];
                    delete_edge(lcand);
                    lcand = t;
                }
            }
            int rcand = oprev(basel);
            if (valid(rcand)) {
                while (in_circle(dest(basel), org[basel], dest(rcand), dest(oprev(rcand)))) {
                    int t = oprev(rcand);
                    delete_edge(rcand);
                    rcand = t;
                }
            }
            bool vl = valid(lcand), vr = valid(rcand);
            if (!vl && !vr) break;
            if (!vl || (vr && in_circle(dest(lcand), org[lcand], org[rcand], dest(rcand)))) {
                basel = connect(rcand, sym(basel));
            } else {
                basel = connect(sym(basel), sym(lcand));
            }
        }
        return {ldo, rdo};
    }
};

struct DSU {
    vector<int> p;
    explicit DSU(int n) : p(n) { iota(p.begin(), p.end(), 0); }
    int find(int x) { return p[x] == x ? x : p[x] = find(p[x]); }
    bool unite(int a, int b) {
        a = find(a); b = find(b);
        if (a == b) return false;
        p[b] = a;
        return true;
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    if (!(cin >> n)) return 0;
    vector<Pt> pts(n);
    for (int i = 0; i < n; ++i) {
        cin >> pts[i].x >> pts[i].y;
        pts[i].id = i;
    }
    sort(pts.begin(), pts.end());
    pts.erase(unique(pts.begin(), pts.end()), pts.end());
    int m = (int)pts.size();
    if (m <= 1) {
        cout << fixed << setprecision(6) << 0.0 << '\\n';
        return 0;
    }

    QuadEdgeDelaunay tri;
    tri.pts = move(pts);
    tri.build(0, m);

    struct Edge { unsigned long long d2; int u, v; };
    vector<Edge> edges;
    edges.reserve(tri.alive.size());
    for (size_t q = 0; q < tri.alive.size(); ++q) {
        if (!tri.alive[q]) continue;
        int e = (int)(q << 2);
        int u = tri.org[e], v = tri.dest(e);
        long long dx = tri.pts[u].x - tri.pts[v].x;
        long long dy = tri.pts[u].y - tri.pts[v].y;
        edges.push_back({(unsigned long long)(dx * dx + dy * dy), u, v});
    }
    sort(edges.begin(), edges.end(), [](const Edge& a, const Edge& b) { return a.d2 < b.d2; });

    DSU dsu(m);
    double ans = 0.0;
    for (const auto& ed : edges) {
        if (dsu.unite(ed.u, ed.v)) ans += sqrt((double)ed.d2);
    }
    cout << fixed << setprecision(6) << ans << '\\n';
    return 0;
}`,
        rust: `use std::io::{self, Read};

#[derive(Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
struct Pt {
    x: i64,
    y: i64,
}

struct QuadEdge {
    pts: Vec<Pt>,
    org: Vec<i32>,
    nxt: Vec<usize>,
    alive: Vec<bool>,
}

impl QuadEdge {
    fn sym(e: usize) -> usize { e ^ 2 }
    fn rot(e: usize) -> usize { (e & !3) | ((e + 1) & 3) }
    fn invrot(e: usize) -> usize { (e & !3) | ((e + 3) & 3) }
    fn oprev(&self, e: usize) -> usize { Self::rot(self.nxt[Self::rot(e)]) }
    fn lnext(&self, e: usize) -> usize { Self::rot(self.nxt[Self::invrot(e)]) }
    fn rprev(&self, e: usize) -> usize { self.nxt[Self::sym(e)] }
    fn org_p(&self, e: usize) -> usize { self.org[e] as usize }
    fn dest_p(&self, e: usize) -> usize { self.org[Self::sym(e)] as usize }

    fn cross(a: Pt, b: Pt, c: Pt) -> i128 {
        (b.x as i128 - a.x as i128) * (c.y as i128 - a.y as i128)
            - (b.y as i128 - a.y as i128) * (c.x as i128 - a.x as i128)
    }

    fn left_of(&self, p: usize, e: usize) -> bool {
        Self::cross(self.pts[p], self.pts[self.org_p(e)], self.pts[self.dest_p(e)]) > 0
    }
    fn right_of(&self, p: usize, e: usize) -> bool {
        Self::cross(self.pts[p], self.pts[self.dest_p(e)], self.pts[self.org_p(e)]) > 0
    }

    fn in_circle(&self, ia: usize, ib: usize, ic: usize, id: usize) -> bool {
        let (a, b, c, d) = (self.pts[ia], self.pts[ib], self.pts[ic], self.pts[id]);
        let ax = a.x as i128 - d.x as i128; let ay = a.y as i128 - d.y as i128;
        let bx = b.x as i128 - d.x as i128; let by = b.y as i128 - d.y as i128;
        let cx = c.x as i128 - d.x as i128; let cy = c.y as i128 - d.y as i128;
        let al = ax * ax + ay * ay;
        let bl = bx * bx + by * by;
        let cl = cx * cx + cy * cy;
        let det = al * (bx * cy - by * cx) - bl * (ax * cy - ay * cx) + cl * (ax * by - ay * bx);
        det > 0
    }

    fn make_edge(&mut self, u: usize, v: usize) -> usize {
        let e0 = self.org.len();
        self.org.extend_from_slice(&[u as i32, -1, v as i32, -1]);
        self.nxt.extend_from_slice(&[e0, e0 + 3, e0 + 2, e0 + 1]);
        self.alive.push(true);
        e0
    }

    fn splice(&mut self, a: usize, b: usize) {
        let alpha = Self::rot(self.nxt[a]);
        let beta = Self::rot(self.nxt[b]);
        self.nxt.swap(a, b);
        self.nxt.swap(alpha, beta);
    }

    fn connect(&mut self, a: usize, b: usize) -> usize {
        let e = self.make_edge(self.dest_p(a), self.org_p(b));
        let la = self.lnext(a);
        self.splice(e, la);
        self.splice(Self::sym(e), b);
        e
    }

    fn delete_edge(&mut self, e: usize) {
        self.alive[e >> 2] = false;
        let p1 = self.oprev(e);
        self.splice(e, p1);
        let se = Self::sym(e);
        let p2 = self.oprev(se);
        self.splice(se, p2);
    }

    fn build(&mut self, l: usize, r: usize) -> (usize, usize) {
        let cnt = r - l;
        if cnt == 2 {
            let a = self.make_edge(l, l + 1);
            return (a, Self::sym(a));
        }
        if cnt == 3 {
            let a = self.make_edge(l, l + 1);
            let b = self.make_edge(l + 1, l + 2);
            self.splice(Self::sym(a), b);
            let cr = Self::cross(self.pts[l], self.pts[l + 1], self.pts[l + 2]);
            if cr > 0 {
                self.connect(b, a);
                return (a, Self::sym(b));
            } else if cr < 0 {
                let e = self.connect(b, a);
                return (Self::sym(e), e);
            } else {
                return (a, Self::sym(b));
            }
        }
        let mid = (l + r) / 2;
        let (mut ldo, mut ldi) = self.build(l, mid);
        let (mut rdi, mut rdo) = self.build(mid, r);
        loop {
            if self.left_of(self.org_p(rdi), ldi) {
                ldi = self.lnext(ldi);
            } else if self.right_of(self.org_p(ldi), rdi) {
                rdi = self.rprev(rdi);
            } else {
                break;
            }
        }
        let mut basel = self.connect(Self::sym(rdi), ldi);
        if self.org_p(ldi) == self.org_p(ldo) { ldo = Self::sym(basel); }
        if self.org_p(rdi) == self.org_p(rdo) { rdo = basel; }
        loop {
            let mut lcand = self.nxt[Self::sym(basel)];
            if self.right_of(self.dest_p(lcand), basel) {
                while self.in_circle(self.dest_p(basel), self.org_p(basel), self.dest_p(lcand), self.dest_p(self.nxt[lcand])) {
                    let t = self.nxt[lcand];
                    self.delete_edge(lcand);
                    lcand = t;
                }
            }
            let mut rcand = self.oprev(basel);
            if self.right_of(self.dest_p(rcand), basel) {
                while self.in_circle(self.dest_p(basel), self.org_p(basel), self.dest_p(rcand), self.dest_p(self.oprev(rcand))) {
                    let t = self.oprev(rcand);
                    self.delete_edge(rcand);
                    rcand = t;
                }
            }
            let vl = self.right_of(self.dest_p(lcand), basel);
            let vr = self.right_of(self.dest_p(rcand), basel);
            if !vl && !vr { break; }
            if !vl || (vr && self.in_circle(self.dest_p(lcand), self.org_p(lcand), self.org_p(rcand), self.dest_p(rcand))) {
                basel = self.connect(rcand, Self::sym(basel));
            } else {
                basel = self.connect(Self::sym(basel), Self::sym(lcand));
            }
        }
        (ldo, rdo)
    }
}

fn find(p: &mut [usize], mut x: usize) -> usize {
    while p[x] != x {
        p[x] = p[p[x]];
        x = p[x];
    }
    x
}

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let n: usize = match it.next() { Some(v) => v.parse().unwrap(), None => return };
    let mut pts = Vec::with_capacity(n);
    for _ in 0..n {
        let x: i64 = it.next().unwrap().parse().unwrap();
        let y: i64 = it.next().unwrap().parse().unwrap();
        pts.push(Pt { x, y });
    }
    pts.sort();
    pts.dedup();
    let m = pts.len();
    if m <= 1 {
        println!("{:.6}", 0.0);
        return;
    }
    let mut qe = QuadEdge { pts, org: Vec::new(), nxt: Vec::new(), alive: Vec::new() };
    qe.build(0, m);

    let mut edges = Vec::new();
    for (q, &ok) in qe.alive.iter().enumerate() {
        if !ok { continue; }
        let e = q << 2;
        let u = qe.org_p(e);
        let v = qe.dest_p(e);
        let dx = (qe.pts[u].x - qe.pts[v].x) as i128;
        let dy = (qe.pts[u].y - qe.pts[v].y) as i128;
        edges.push((dx * dx + dy * dy, u, v));
    }
    edges.sort_unstable_by_key(|x| x.0);
    let mut par: Vec<usize> = (0..m).collect();
    let mut ans = 0.0f64;
    for (d2, u, v) in edges {
        let ru = find(&mut par, u);
        let rv = find(&mut par, v);
        if ru != rv {
            par[rv] = ru;
            ans += (d2 as f64).sqrt();
        }
    }
    println!("{:.6}", ans);
}`,
        java21: `import java.io.BufferedInputStream;
import java.io.IOException;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.Locale;

public class Main {
    static class FastScanner {
        private final BufferedInputStream in = new BufferedInputStream(System.in);
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;

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
            while (c >= 0 && c <= 32) c = readByte();
            if (c < 0) return 0;
            long sign = 1;
            if (c == '-') { sign = -1; c = readByte(); }
            long res = 0;
            while (c > 32) { res = res * 10 + (c - '0'); c = readByte(); }
            return res * sign;
        }
    }

    static long[] px, py;
    static int[] org = new int[1024];
    static int[] nxt = new int[1024];
    static boolean[] alive = new boolean[256];
    static int qCnt = 0;

    static int sym(int e) { return e ^ 2; }
    static int rot(int e) { return (e & ~3) | ((e + 1) & 3); }
    static int invrot(int e) { return (e & ~3) | ((e + 3) & 3); }
    static int oprev(int e) { return rot(nxt[rot(e)]); }
    static int lnext(int e) { return rot(nxt[invrot(e)]); }
    static int rprev(int e) { return nxt[sym(e)]; }
    static int dest(int e) { return org[sym(e)]; }

    static long cross64(int a, int b, int c) {
        return (px[b] - px[a]) * (py[c] - py[a]) - (py[b] - py[a]) * (px[c] - px[a]);
    }

    static boolean leftOf(int p, int e) { return cross64(p, org[e], dest(e)) > 0; }
    static boolean rightOf(int p, int e) { return cross64(p, dest(e), org[e]) > 0; }

    static boolean inCircle(int ia, int ib, int ic, int id) {
        BigInteger ax = BigInteger.valueOf(px[ia] - px[id]);
        BigInteger ay = BigInteger.valueOf(py[ia] - py[id]);
        BigInteger bx = BigInteger.valueOf(px[ib] - px[id]);
        BigInteger by = BigInteger.valueOf(py[ib] - py[id]);
        BigInteger cx = BigInteger.valueOf(px[ic] - px[id]);
        BigInteger cy = BigInteger.valueOf(py[ic] - py[id]);
        BigInteger al = ax.multiply(ax).add(ay.multiply(ay));
        BigInteger bl = bx.multiply(bx).add(by.multiply(by));
        BigInteger cl = cx.multiply(cx).add(cy.multiply(cy));
        BigInteger t1 = al.multiply(bx.multiply(cy).subtract(by.multiply(cx)));
        BigInteger t2 = bl.multiply(ax.multiply(cy).subtract(ay.multiply(cx)));
        BigInteger t3 = cl.multiply(ax.multiply(by).subtract(ay.multiply(bx)));
        return t1.subtract(t2).add(t3).signum() > 0;
    }

    static int makeEdge(int u, int v) {
        if ((qCnt << 2) >= org.length) {
            org = Arrays.copyOf(org, org.length * 2);
            nxt = Arrays.copyOf(nxt, nxt.length * 2);
            alive = Arrays.copyOf(alive, alive.length * 2);
        }
        int e0 = qCnt << 2;
        alive[qCnt++] = true;
        org[e0] = u; org[e0 + 1] = -1; org[e0 + 2] = v; org[e0 + 3] = -1;
        nxt[e0] = e0; nxt[e0 + 1] = e0 + 3; nxt[e0 + 2] = e0 + 2; nxt[e0 + 3] = e0 + 1;
        return e0;
    }

    static void splice(int a, int b) {
        int alpha = rot(nxt[a]), beta = rot(nxt[b]);
        int t = nxt[a]; nxt[a] = nxt[b]; nxt[b] = t;
        t = nxt[alpha]; nxt[alpha] = nxt[beta]; nxt[beta] = t;
    }

    static int connect(int a, int b) {
        int e = makeEdge(dest(a), org[b]);
        splice(e, lnext(a));
        splice(sym(e), b);
        return e;
    }

    static void deleteEdge(int e) {
        alive[e >> 2] = false;
        splice(e, oprev(e));
        splice(sym(e), oprev(sym(e)));
    }

    static long build(int l, int r) {
        int cnt = r - l;
        if (cnt == 2) {
            int a = makeEdge(l, l + 1);
            return (((long) a) << 32) | (sym(a) & 0xffffffffL);
        }
        if (cnt == 3) {
            int a = makeEdge(l, l + 1), b = makeEdge(l + 1, l + 2);
            splice(sym(a), b);
            long cr = cross64(l, l + 1, l + 2);
            if (cr > 0) {
                connect(b, a);
                return (((long) a) << 32) | (sym(b) & 0xffffffffL);
            } else if (cr < 0) {
                int e = connect(b, a);
                return (((long) sym(e)) << 32) | (e & 0xffffffffL);
            } else {
                return (((long) a) << 32) | (sym(b) & 0xffffffffL);
            }
        }
        int mid = (l + r) >>> 1;
        long lp = build(l, mid), rp = build(mid, r);
        int ldo = (int) (lp >>> 32), ldi = (int) lp;
        int rdi = (int) (rp >>> 32), rdo = (int) rp;
        while (true) {
            if (leftOf(org[rdi], ldi)) ldi = lnext(ldi);
            else if (rightOf(org[ldi], rdi)) rdi = rprev(rdi);
            else break;
        }
        int basel = connect(sym(rdi), ldi);
        if (org[ldi] == org[ldo]) ldo = sym(basel);
        if (org[rdi] == org[rdo]) rdo = basel;
        while (true) {
            int lcand = nxt[sym(basel)];
            if (rightOf(dest(lcand), basel)) {
                while (inCircle(dest(basel), org[basel], dest(lcand), dest(nxt[lcand]))) {
                    int t = nxt[lcand];
                    deleteEdge(lcand);
                    lcand = t;
                }
            }
            int rcand = oprev(basel);
            if (rightOf(dest(rcand), basel)) {
                while (inCircle(dest(basel), org[basel], dest(rcand), dest(oprev(rcand)))) {
                    int t = oprev(rcand);
                    deleteEdge(rcand);
                    rcand = t;
                }
            }
            boolean vl = rightOf(dest(lcand), basel), vr = rightOf(dest(rcand), basel);
            if (!vl && !vr) break;
            if (!vl || (vr && inCircle(dest(lcand), org[lcand], org[rcand], dest(rcand)))) {
                basel = connect(rcand, sym(basel));
            } else {
                basel = connect(sym(basel), sym(lcand));
            }
        }
        return (((long) ldo) << 32) | (rdo & 0xffffffffL);
    }

    static int find(int[] p, int x) {
        while (p[x] != x) { p[x] = p[p[x]]; x = p[x]; }
        return x;
    }

    public static void main(String[] args) throws Exception {
        Locale.setDefault(Locale.US);
        FastScanner fs = new FastScanner();
        int n = (int) fs.nextLong();
        if (n == 0) return;
        long[][] raw = new long[n][2];
        for (int i = 0; i < n; i++) {
            raw[i][0] = fs.nextLong();
            raw[i][1] = fs.nextLong();
        }
        Arrays.sort(raw, (a, b) -> a[0] != b[0] ? Long.compare(a[0], b[0]) : Long.compare(a[1], b[1]));
        int m = 0;
        for (int i = 0; i < n; i++) {
            if (m == 0 || raw[i][0] != raw[m - 1][0] || raw[i][1] != raw[m - 1][1]) {
                raw[m++] = raw[i];
            }
        }
        if (m <= 1) { System.out.printf("%.6f%n", 0.0); return; }
        px = new long[m]; py = new long[m];
        for (int i = 0; i < m; i++) { px[i] = raw[i][0]; py[i] = raw[i][1]; }

        build(0, m);
        ArrayList<long[]> edges = new ArrayList<>();
        for (int q = 0; q < qCnt; q++) {
            if (!alive[q]) continue;
            int e = q << 2;
            int u = org[e], v = dest(e);
            long dx = px[u] - px[v], dy = py[u] - py[v];
            edges.add(new long[]{dx * dx + dy * dy, u, v});
        }
        edges.sort(Comparator.comparingLong(a -> a[0]));
        int[] par = new int[m];
        for (int i = 0; i < m; i++) par[i] = i;
        double ans = 0.0;
        for (long[] ed : edges) {
            int ru = find(par, (int) ed[1]), rv = find(par, (int) ed[2]);
            if (ru != rv) { par[rv] = ru; ans += Math.sqrt((double) ed[0]); }
        }
        System.out.printf("%.6f%n", ans);
    }
}`,
        python3: `import math
import sys

sys.setrecursionlimit(200000)


def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    pts = sorted(set((int(data[1 + 2 * i]), int(data[2 + 2 * i])) for i in range(n)))
    m = len(pts)
    if m <= 1:
        sys.stdout.write("0.000000\\n")
        return

    px = [p[0] for p in pts]
    py = [p[1] for p in pts]
    org = []
    nxt = []
    alive = []

    def sym(e: int) -> int:
        return e ^ 2

    def rot(e: int) -> int:
        return (e & ~3) | ((e + 1) & 3)

    def invrot(e: int) -> int:
        return (e & ~3) | ((e + 3) & 3)

    def oprev(e: int) -> int:
        return rot(nxt[rot(e)])

    def lnext(e: int) -> int:
        return rot(nxt[invrot(e)])

    def rprev(e: int) -> int:
        return nxt[sym(e)]

    def dest(e: int) -> int:
        return org[sym(e)]

    def cross(a: int, b: int, c: int) -> int:
        return (px[b] - px[a]) * (py[c] - py[a]) - (py[b] - py[a]) * (px[c] - px[a])

    def left_of(p: int, e: int) -> bool:
        return cross(p, org[e], dest(e)) > 0

    def right_of(p: int, e: int) -> bool:
        return cross(p, dest(e), org[e]) > 0

    def in_circle(ia: int, ib: int, ic: int, id_: int) -> bool:
        dx0, dy0 = px[id_], py[id_]
        ax, ay = px[ia] - dx0, py[ia] - dy0
        bx, by = px[ib] - dx0, py[ib] - dy0
        cx, cy = px[ic] - dx0, py[ic] - dy0
        al = ax * ax + ay * ay
        bl = bx * bx + by * by
        cl = cx * cx + cy * cy
        return (al * (bx * cy - by * cx) - bl * (ax * cy - ay * cx) + cl * (ax * by - ay * bx)) > 0

    def make_edge(u: int, v: int) -> int:
        e0 = len(org)
        org.extend((u, -1, v, -1))
        nxt.extend((e0, e0 + 3, e0 + 2, e0 + 1))
        alive.append(True)
        return e0

    def splice(a: int, b: int) -> None:
        alpha = rot(nxt[a])
        beta = rot(nxt[b])
        nxt[a], nxt[b] = nxt[b], nxt[a]
        nxt[alpha], nxt[beta] = nxt[beta], nxt[alpha]

    def connect(a: int, b: int) -> int:
        e = make_edge(dest(a), org[b])
        splice(e, lnext(a))
        splice(sym(e), b)
        return e

    def delete_edge(e: int) -> None:
        alive[e >> 2] = False
        splice(e, oprev(e))
        splice(sym(e), oprev(sym(e)))

    def build(l: int, r: int):
        cnt = r - l
        if cnt == 2:
            a = make_edge(l, l + 1)
            return a, sym(a)
        if cnt == 3:
            a = make_edge(l, l + 1)
            b = make_edge(l + 1, l + 2)
            splice(sym(a), b)
            cr = cross(l, l + 1, l + 2)
            if cr > 0:
                connect(b, a)
                return a, sym(b)
            if cr < 0:
                e = connect(b, a)
                return sym(e), e
            return a, sym(b)

        mid = (l + r) // 2
        ldo, ldi = build(l, mid)
        rdi, rdo = build(mid, r)
        while True:
            if left_of(org[rdi], ldi):
                ldi = lnext(ldi)
            elif right_of(org[ldi], rdi):
                rdi = rprev(rdi)
            else:
                break
        basel = connect(sym(rdi), ldi)
        if org[ldi] == org[ldo]:
            ldo = sym(basel)
        if org[rdi] == org[rdo]:
            rdo = basel
        while True:
            lcand = nxt[sym(basel)]
            if right_of(dest(lcand), basel):
                while in_circle(dest(basel), org[basel], dest(lcand), dest(nxt[lcand])):
                    t = nxt[lcand]
                    delete_edge(lcand)
                    lcand = t
            rcand = oprev(basel)
            if right_of(dest(rcand), basel):
                while in_circle(dest(basel), org[basel], dest(rcand), dest(oprev(rcand))):
                    t = oprev(rcand)
                    delete_edge(rcand)
                    rcand = t
            vl = right_of(dest(lcand), basel)
            vr = right_of(dest(rcand), basel)
            if not vl and not vr:
                break
            if not vl or (vr and in_circle(dest(lcand), org[lcand], org[rcand], dest(rcand))):
                basel = connect(rcand, sym(basel))
            else:
                basel = connect(sym(basel), sym(lcand))
        return ldo, rdo

    build(0, m)
    edges = []
    for q, ok in enumerate(alive):
        if ok:
            e = q << 2
            u = org[e]
            v = dest(e)
            dx = px[u] - px[v]
            dy = py[u] - py[v]
            edges.append((dx * dx + dy * dy, u, v))
    edges.sort(key=lambda t: t[0])

    par = list(range(m))

    def find(x: int) -> int:
        while par[x] != x:
            par[x] = par[par[x]]
            x = par[x]
        return x

    ans = 0.0
    for d2, u, v in edges:
        ru, rv = find(u), find(v)
        if ru != rv:
            par[rv] = ru
            ans += math.sqrt(d2)
    sys.stdout.write(f"{ans:.6f}\\n")


if __name__ == "__main__":
    solve()`,
        ruby: `data = STDIN.read.split
exit if data.empty?
n = data[0].to_i
pts = Array.new(n) { |i| [data[1 + 2 * i].to_i, data[2 + 2 * i].to_i] }.uniq.sort
m = pts.length
if m <= 1
  puts format('%.6f', 0.0)
  exit
end

px = pts.map { |p| p[0] }
py = pts.map { |p| p[1] }
org = []
nxt = []
alive = []

sym = ->(e) { e ^ 2 }
rot = ->(e) { (e & ~3) | ((e + 1) & 3) }
invrot = ->(e) { (e & ~3) | ((e + 3) & 3) }
oprev = ->(e) { rot.call(nxt[rot.call(e)]) }
lnext = ->(e) { rot.call(nxt[invrot.call(e)]) }
rprev = ->(e) { nxt[sym.call(e)] }
dest = ->(e) { org[sym.call(e)] }

cross = ->(a, b, c) { (px[b] - px[a]) * (py[c] - py[a]) - (py[b] - py[a]) * (px[c] - px[a]) }
left_of = ->(p, e) { cross.call(p, org[e], dest.call(e)) > 0 }
right_of = ->(p, e) { cross.call(p, dest.call(e), org[e]) > 0 }

in_circle = lambda do |ia, ib, ic, id_|
  ax = px[ia] - px[id_]; ay = py[ia] - py[id_]
  bx = px[ib] - px[id_]; by = py[ib] - py[id_]
  cx = px[ic] - px[id_]; cy = py[ic] - py[id_]
  al = ax * ax + ay * ay
  bl = bx * bx + by * by
  cl = cx * cx + cy * cy
  (al * (bx * cy - by * cx) - bl * (ax * cy - ay * cx) + cl * (ax * by - ay * bx)) > 0
end

make_edge = lambda do |u, v|
  e0 = org.length
  org.push(u, -1, v, -1)
  nxt.push(e0, e0 + 3, e0 + 2, e0 + 1)
  alive << true
  e0
end

splice = lambda do |a, b|
  alpha = rot.call(nxt[a])
  beta = rot.call(nxt[b])
  nxt[a], nxt[b] = nxt[b], nxt[a]
  nxt[alpha], nxt[beta] = nxt[beta], nxt[alpha]
end

connect = lambda do |a, b|
  e = make_edge.call(dest.call(a), org[b])
  splice.call(e, lnext.call(a))
  splice.call(sym.call(e), b)
  e
end

delete_edge = lambda do |e|
  alive[e >> 2] = false
  splice.call(e, oprev.call(e))
  se = sym.call(e)
  splice.call(se, oprev.call(se))
end

build = lambda do |l, r|
  cnt = r - l
  if cnt == 2
    a = make_edge.call(l, l + 1)
    return [a, sym.call(a)]
  end
  if cnt == 3
    a = make_edge.call(l, l + 1)
    b = make_edge.call(l + 1, l + 2)
    splice.call(sym.call(a), b)
    cr = cross.call(l, l + 1, l + 2)
    if cr > 0
      connect.call(b, a)
      return [a, sym.call(b)]
    elsif cr < 0
      e = connect.call(b, a)
      return [sym.call(e), e]
    else
      return [a, sym.call(b)]
    end
  end
  mid = (l + r) / 2
  ldo, ldi = build.call(l, mid)
  rdi, rdo = build.call(mid, r)
  loop do
    if left_of.call(org[rdi], ldi)
      ldi = lnext.call(ldi)
    elsif right_of.call(org[ldi], rdi)
      rdi = rprev.call(rdi)
    else
      break
    end
  end
  basel = connect.call(sym.call(rdi), ldi)
  ldo = sym.call(basel) if org[ldi] == org[ldo]
  rdo = basel if org[rdi] == org[rdo]
  loop do
    lcand = nxt[sym.call(basel)]
    if right_of.call(dest.call(lcand), basel)
      while in_circle.call(dest.call(basel), org[basel], dest.call(lcand), dest.call(nxt[lcand]))
        t = nxt[lcand]
        delete_edge.call(lcand)
        lcand = t
      end
    end
    rcand = oprev.call(basel)
    if right_of.call(dest.call(rcand), basel)
      while in_circle.call(dest.call(basel), org[basel], dest.call(rcand), dest.call(oprev.call(rcand)))
        t = oprev.call(rcand)
        delete_edge.call(rcand)
        rcand = t
      end
    end
    vl = right_of.call(dest.call(lcand), basel)
    vr = right_of.call(dest.call(rcand), basel)
    break if !vl && !vr
    if !vl || (vr && in_circle.call(dest.call(lcand), org[lcand], org[rcand], dest.call(rcand)))
      basel = connect.call(rcand, sym.call(basel))
    else
      basel = connect.call(sym.call(basel), sym.call(lcand))
    end
  end
  [ldo, rdo]
end

build.call(0, m)
edges = []
alive.each_with_index do |ok, q|
  next unless ok
  e = q << 2
  u = org[e]
  v = dest.call(e)
  dx = px[u] - px[v]
  dy = py[u] - py[v]
  edges << [dx * dx + dy * dy, u, v]
end
edges.sort_by! { |ed| ed[0] }

par = (0...m).to_a
find = lambda do |x|
  while par[x] != x
    par[x] = par[par[x]]
    x = par[x]
  end
  x
end

ans = 0.0
edges.each do |d2, u, v|
  ru = find.call(u)
  rv = find.call(v)
  if ru != rv
    par[rv] = ru
    ans += Math.sqrt(d2.to_f)
  end
end
puts format('%.6f', ans)`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'AtCoder',
      title: 'Library Checker - Euclidean Minimum Spanning Tree',
      difficulty: 'Grandmaster',
      url: 'https://judge.yosupo.jp/problem/euclidean_mst',
      patternNote: 'Every EMST edge belongs to the Delaunay triangulation, solved in O(N log N) via Guibas-Stolfi Quad-Edge divide-and-conquer.',
    },
    {
      platform: 'Codeforces',
      title: '3D Convex Hull Area / Volume & Half-Space Polyhedra',
      difficulty: '2700',
      url: 'https://codeforces.com/problemset',
      patternNote: 'Incremental horizon-edge hull construction with deterministic topology jitter and un-jittered exact accumulation.',
    },
    {
      platform: 'CSES',
      title: 'Minimum Enclosing Circle & Voronoi Proximity',
      difficulty: 'Advanced',
      url: 'https://cses.fi/problemset',
      patternNote: 'Expected O(N) randomized Welzl scan paired with 2-point and 3-point circumcircle boundaries.',
    },
  ],
  interviewNotes: [
    'Guibas-Stolfi Quad-Edge D&C requires 128-bit integer determinants for InCircle so fourth-power coordinate differences never overflow.',
    'In 3D Convex Hull, IEEE 754 ULP near 10^4 exceeds 1e-16, so perturbation for non-coplanar tie-breaking should be ~1e-9 while computing final area and volume from unperturbed vertices.',
    'Shuffling points deterministically before Welzl’s iterative 3-loop scan guarantees expected O(N) runtime even against sorted adversarial inputs.',
  ],
  projectBlueprint: {
    title: 'Computational Geometry Kernel: 3D Polyhedra & Quad-Edge Delaunay Engine',
    tagline: 'Precision-hardened incremental 3D hull, expected O(N) Welzl MEC, and O(N log N) Delaunay EMST solver',
    stackSummary: 'C++20 / Rust 128-Bit Quad-Edge Arena + 3D Horizon Hull + Welzl Disc Solver',
    asciiDiagram:
`[2D Points] ---> [Sort + Dedup] ---> [Guibas-Stolfi Quad-Edge D&C] ---> [Kruskal EMST]
[3D Points] ---> [Jitter Topology] -> [Horizon-Edge Insertion] --------> [Area & Vol]`,
    milestones: [
      { id: 'm1', title: '3D Horizon Hull Builder', detail: 'Track visible face timestamps on directed edges to stitch boundary polygons in O(N^2).' },
      { id: 'm2', title: 'Welzl Randomized MEC', detail: 'Deterministic 64-bit Fisher-Yates shuffle + 3-nested disc expansion in O(N).' },
      { id: 'm3', title: 'Quad-Edge Delaunay Triangulator', detail: 'Divide-and-conquer lower-tangent merging with 128-bit InCircle edge flips.' },
    ],
    starterCode: `// Guibas-Stolfi Quad-Edge primitive indexing:
// sym(e) = e ^ 2; rot(e) = (e & ~3) | ((e + 1) & 3); invrot(e) = (e & ~3) | ((e + 3) & 3);`,
  },
};
