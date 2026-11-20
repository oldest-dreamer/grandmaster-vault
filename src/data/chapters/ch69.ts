import type { TheoryChapter } from '../../types/vault';

export const CH69_LINK_CUT_TREES: TheoryChapter = {
  slug: 'link-cut-tree',
  topicId: 'ds-13',
  title: 'Link-Cut Trees (Splay-Backed Dynamic Forest)',
  domain: 'Data Structures',
  ratingTier: '2600–3300+',
  usacoDivision: 'Advanced',
  subtitle: 'Preferred-path decomposition via auxiliary Splay Trees for O(log N) amortized dynamic link, cut, reroot, and virtual subtree aggregates',
  analogyTitle: 'Zipping and Unzipping Heavy Highways Inside a Dynamic Forest',
  analogyBody:
    'Heavy-Light Decomposition splits a static tree into solid chains connected by light dashed edges—but if edges are continuously inserted and deleted, static Euler tours and segment trees break immediately.\n\nA Link-Cut Tree (Sleator & Tarjan) solves this by dynamically managing the heavy/preferred paths using an auxiliary Splay Tree for each preferred path, keyed by depth in the represented tree. Every node stores at most one preferred (right) child and any number of dashed (virtual) children whose parent pointers point into the middle of the splay tree (`fa[c] = u`), while `u` deliberately does NOT point back (`ch[u][0/1] != c`).\n\nCalling `access(v)` zips a single solid path from the represented tree root down to `v` by splaying `v` to the root of its current auxiliary tree, snapping its old right child to dashed, and splicing its preferred path upward until reaching the global root. Calling `makeRoot(v)` runs `access(v)` and flips a lazy reversal bit on `v`, inverting parent pointers along the entire root-to-`v` path in O(1) so arbitrary `link(u, v)` and `cut(u, v)` operations run in O(log N) amortized time.',
  prerequisites: [
    { slug: 'treap-implicit-rope', title: 'Implicit Treap & Persistent Split-Merge Trees' },
  ],
  traceTitle: 'Preferred-Path Splicing with access(v) & makeRoot(v)',
  traceSubtitle: 'Tracking parent pointers, splay roots, and reversal flags across a 6-node dynamic forest',
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Initial 6-Node Forest State (Disjoint Singletons)',
      explanation: 'Every vertex 1..6 starts as its own auxiliary splay tree with ch=[0,0], fa=0, rev=0, and val=[1,2,3,4,5,6].',
      mode: 'array',
      arrays: [
        {
          name: 'Parent Pointers fa[1..6]',
          cells: [
            { index: 1, value: 0, label: 'n1', highlight: 'neutral' },
            { index: 2, value: 0, label: 'n2', highlight: 'neutral' },
            { index: 3, value: 0, label: 'n3', highlight: 'neutral' },
            { index: 4, value: 0, label: 'n4', highlight: 'neutral' },
            { index: 5, value: 0, label: 'n5', highlight: 'neutral' },
            { index: 6, value: 0, label: 'n6', highlight: 'neutral' },
          ],
        },
      ],
      variables: { action: 'init(6)', preferredChains: 6, root: 'disjoint' },
    },
    {
      stepNumber: 2,
      title: 'link(1, 2), link(2, 3), link(2, 4), link(4, 5)',
      explanation: 'makeRoot(u) flips rev on u and attaches fa[u] = v as a dashed (virtual) edge. Node 2 currently has dashed children 1 and 4, forming two solid fragments.',
      mode: 'array',
      arrays: [
        {
          name: 'Represented Tree Parents after Links',
          cells: [
            { index: 1, value: 2, label: 'n1->2', highlight: 'updated' },
            { index: 2, value: 3, label: 'n2->3', highlight: 'updated' },
            { index: 3, value: 0, label: 'root', highlight: 'active' },
            { index: 4, value: 2, label: 'n4->2', highlight: 'updated' },
            { index: 5, value: 4, label: 'n5->4', highlight: 'updated' },
            { index: 6, value: 0, label: 'isolated', highlight: 'neutral' },
          ],
        },
      ],
      variables: { action: 'link edges', solidPaths: '3', components: 2 },
    },
    {
      stepNumber: 3,
      title: 'access(5): Splay & Splice Upward to Global Root',
      explanation: 'Loop x=5 -> y=0: splay(5), detach old right child, set ch[5][1]=0, pull(5). Advance x=fa[5]=4 -> splay(4), set ch[4][1]=5. Advance to 2 -> 3 until fa=0.',
      mode: 'array',
      arrays: [
        {
          name: 'Preferred Path Root->5 Marked Solid',
          cells: [
            { index: 1, value: 'dashed', label: 'n1', highlight: 'neutral' },
            { index: 2, value: 'SOLID', label: 'n2', highlight: 'active' },
            { index: 3, value: 'SOLID', label: 'n3', highlight: 'active' },
            { index: 4, value: 'SOLID', label: 'n4', highlight: 'active' },
            { index: 5, value: 'SOLID', label: 'n5', highlight: 'updated' },
            { index: 6, value: 'dashed', label: 'n6', highlight: 'neutral' },
          ],
        },
      ],
      variables: { action: 'access(5)', preferredPath: '3 - 2 - 4 - 5', zigZagRotations: 2 },
    },
    {
      stepNumber: 4,
      title: 'makeRoot(1) & cut(2, 4)',
      explanation: 'makeRoot(1) calls access(1); splay(1); rev[1]^=1 to make 1 the root. Then cut(2, 4) calls makeRoot(2); access(4); splay(4); detaches left child ch[4][0]=fa[2]=0.',
      mode: 'array',
      arrays: [
        {
          name: 'Connected Components after cut(2, 4)',
          cells: [
            { index: 1, value: 'C1', label: 'n1', highlight: 'active' },
            { index: 2, value: 'C1', label: 'n2', highlight: 'active' },
            { index: 3, value: 'C1', label: 'n3', highlight: 'active' },
            { index: 4, value: 'C2', label: 'n4', highlight: 'updated' },
            { index: 5, value: 'C2', label: 'n5', highlight: 'updated' },
            { index: 6, value: 'C3', label: 'n6', highlight: 'neutral' },
          ],
        },
      ],
      variables: { action: 'cut(2, 4)', components: 3, querySum_1_3: 6 },
    },
  ],
  reductionClues: [
    {
      clue: 'Add/remove undirected edges in a forest and query path aggregates (sum, max, min, XOR) online',
      translation: 'Direct Link-Cut Tree application: represent paths in auxiliary splay trees and query via makeRoot(u); access(v); splay(v).',
    },
    {
      clue: 'Maintain Minimum Spanning Tree/Forest while inserting new weighted edges online',
      translation: 'Represent every edge as a middle vertex of weight w connected to u and v; on cycle creation, query path max edge id and cut it if w < maxEdge.',
    },
    {
      clue: 'Support link, cut, and subtree size / subtree sum queries on a dynamic forest',
      translation: 'Track virtual-child totals (vir_sz, vir_sum) updated whenever access(x) switches preferred children or link(x, y) attaches a dashed edge.',
    },
    {
      clue: 'Check connectivity dynamically alongside point value updates in O(log N) amortized',
      translation: 'findRoot(u): access(u); splay(u); walk ch[u][0] pushing lazy reversals until leftmost node; remember to splay(u) back up.',
    },
  ],
  timeComplexity: 'O(log N) amortized per access, makeRoot, link, cut, and path/subtree query',
  spaceComplexity: 'O(N) auxiliary arrays (parent, children, rev flag, aggregates)',
  pitfalls: [
    {
      type: 'WA',
      title: 'Forgetting Lazy Push Before Reading Left Child in findRoot(u)',
      detail: 'After access(u); splay(u), walking left via while (ch[x][0]) x = ch[x][0] without calling push(x) at every step follows stale unreversed right/left pointers and breaks O(log N) splay complexity if you forget to splay(x) back to root.',
    },
    {
      type: 'WA',
      title: 'Unsafe cut(u, v) When Edge (u, v) Does Not Exist',
      detail: 'Running makeRoot(u); access(v) assumes (u, v) is a tree edge. Always guard with findRoot(v) == u && fa[v] == u && ch[v][0] == 0 (after splaying v? Wait: check fa[u] == v && ch[u][1] == 0 after access(v) with u left-child!) before severing pointers.',
    },
    {
      type: 'WA',
      title: 'Corrupting Virtual Sums During link(u, v) or pointSet(u, val)',
      detail: 'If maintaining subtree aggregates, calling link(u, v) MUST call makeRoot(u) AND makeRoot(v) (so v is the splay root with no pending pushes) before attaching fa[u] = v and adding sub_sum[u] to vir_sum[v]. Similarly, update val[u] only after access(u); splay(u).',
    },
    {
      type: 'WA',
      title: 'Representing Edge Weights on Vertices Instead of Edge Nodes',
      detail: 'When edge weights change or edges are cut dynamically (like Dynamic MST), makeRoot reverses parent-child orientation so storing edge weights on child vertices breaks. Allocate explicit edge vertices N + 1 .. N + M with weight on the edge node and 0 / -INF on original vertices.',
    },
  ],
  implementations: {
    cpp20: `#include <algorithm>
#include <array>
#include <iostream>
#include <utility>
#include <vector>

using namespace std;

// Standard Link-Cut Tree supporting link, cut, point update, and path sum in O(log N) amortized.
struct LinkCutTree {
    int n;
    vector<int> fa, rev;
    vector<array<int, 2>> ch;
    vector<long long> val, sum;

    explicit LinkCutTree(int n)
        : n(n), fa(n + 1, 0), rev(n + 1, 0), ch(n + 1, {0, 0}), val(n + 1, 0), sum(n + 1, 0) {}

    bool isRoot(int x) const {
        return ch[fa[x]][0] != x && ch[fa[x]][1] != x;
    }

    void pull(int x) {
        sum[x] = sum[ch[x][0]] + sum[ch[x][1]] + val[x];
    }

    void pushRev(int x) {
        if (!x) return;
        swap(ch[x][0], ch[x][1]);
        rev[x] ^= 1;
    }

    void push(int x) {
        if (rev[x]) {
            pushRev(ch[x][0]);
            pushRev(ch[x][1]);
            rev[x] = 0;
        }
    }

    void pushAll(int x) {
        if (!isRoot(x)) pushAll(fa[x]);
        push(x);
    }

    void rotate(int x) {
        int y = fa[x], z = fa[y];
        int k = (ch[y][1] == x);
        if (!isRoot(y)) ch[z][ch[z][1] == y] = x;
        fa[x] = z;
        ch[y][k] = ch[x][k ^ 1];
        if (ch[x][k ^ 1]) fa[ch[x][k ^ 1]] = y;
        ch[x][k ^ 1] = y;
        fa[y] = x;
        pull(y);
        pull(x);
    }

    void splay(int x) {
        pushAll(x);
        while (!isRoot(x)) {
            int y = fa[x], z = fa[y];
            if (!isRoot(y)) {
                rotate(((ch[y][1] == x) ^ (ch[z][1] == y)) ? x : y);
            }
            rotate(x);
        }
    }

    void access(int x) {
        for (int y = 0; x; y = x, x = fa[x]) {
            splay(x);
            ch[x][1] = y;
            pull(x);
        }
    }

    void makeRoot(int x) {
        access(x);
        splay(x);
        pushRev(x);
    }

    int findRoot(int x) {
        access(x);
        splay(x);
        while (ch[x][0]) {
            push(x);
            x = ch[x][0];
        }
        splay(x);
        return x;
    }

    bool link(int u, int v) {
        makeRoot(u);
        if (findRoot(v) == u) return false;
        fa[u] = v;
        return true;
    }

    bool cut(int u, int v) {
        makeRoot(u);
        if (findRoot(v) != u || fa[v] != u || ch[v][0] != 0) return false;
        fa[v] = ch[u][1] = 0;
        pull(u);
        return true;
    }

    void pointSet(int u, long long v) {
        splay(u);
        val[u] = v;
        pull(u);
    }

    long long pathSum(int u, int v) {
        makeRoot(u);
        if (findRoot(v) != u) return -1;
        return sum[u];
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, q;
    if (!(cin >> n >> q)) return 0;
    LinkCutTree lct(n);
    for (int i = 1; i <= n; ++i) {
        cin >> lct.val[i];
        lct.sum[i] = lct.val[i];
    }

    while (q--) {
        int type, u;
        long long v;
        cin >> type >> u >> v;
        if (type == 1) {
            lct.link(u, static_cast<int>(v));
        } else if (type == 2) {
            lct.cut(u, static_cast<int>(v));
        } else if (type == 3) {
            lct.pointSet(u, v);
        } else {
            cout << lct.pathSum(u, static_cast<int>(v)) << "\\n";
        }
    }
    return 0;
}
`,
    rust: `use std::io::{self, Read};

struct LinkCutTree {
    fa: Vec<usize>,
    ch: Vec<[usize; 2]>,
    rev: Vec<bool>,
    val: Vec<i64>,
    sum: Vec<i64>,
}

impl LinkCutTree {
    fn new(n: usize) -> Self {
        Self {
            fa: vec![0; n + 1],
            ch: vec![[0, 0]; n + 1],
            rev: vec![false; n + 1],
            val: vec![0; n + 1],
            sum: vec![0; n + 1],
        }
    }

    fn is_root(&self, x: usize) -> bool {
        let p = self.fa[x];
        self.ch[p][0] != x && self.ch[p][1] != x
    }

    fn pull(&mut self, x: usize) {
        let l = self.ch[x][0];
        let r = self.ch[x][1];
        self.sum[x] = self.sum[l] + self.sum[r] + self.val[x];
    }

    fn push_rev(&mut self, x: usize) {
        if x == 0 {
            return;
        }
        self.ch[x].swap(0, 1);
        self.rev[x] = !self.rev[x];
    }

    fn push(&mut self, x: usize) {
        if self.rev[x] {
            let l = self.ch[x][0];
            let r = self.ch[x][1];
            self.push_rev(l);
            self.push_rev(r);
            self.rev[x] = false;
        }
    }

    fn push_all(&mut self, x: usize) {
        let mut stack = Vec::new();
        let mut cur = x;
        while !self.is_root(cur) {
            stack.push(cur);
            cur = self.fa[cur];
        }
        stack.push(cur);
        while let Some(u) = stack.pop() {
            self.push(u);
        }
    }

    fn rotate(&mut self, x: usize) {
        let y = self.fa[x];
        let z = self.fa[y];
        let k = usize::from(self.ch[y][1] == x);
        if !self.is_root(y) {
            let zk = usize::from(self.ch[z][1] == y);
            self.ch[z][zk] = x;
        }
        self.fa[x] = z;
        let c = self.ch[x][k ^ 1];
        self.ch[y][k] = c;
        if c != 0 {
            self.fa[c] = y;
        }
        self.ch[x][k ^ 1] = y;
        self.fa[y] = x;
        self.pull(y);
        self.pull(x);
    }

    fn splay(&mut self, x: usize) {
        self.push_all(x);
        while !self.is_root(x) {
            let y = self.fa[x];
            let z = self.fa[y];
            if !self.is_root(y) {
                let same = (self.ch[y][1] == x) == (self.ch[z][1] == y);
                self.rotate(if same { y } else { x });
            }
            self.rotate(x);
        }
    }

    fn access(&mut self, mut x: usize) {
        let mut y = 0;
        while x != 0 {
            self.splay(x);
            self.ch[x][1] = y;
            self.pull(x);
            y = x;
            x = self.fa[x];
        }
    }

    fn make_root(&mut self, x: usize) {
        self.access(x);
        self.splay(x);
        self.push_rev(x);
    }

    fn find_root(&mut self, mut x: usize) -> usize {
        self.access(x);
        self.splay(x);
        while self.ch[x][0] != 0 {
            self.push(x);
            x = self.ch[x][0];
        }
        self.splay(x);
        x
    }

    fn link(&mut self, u: usize, v: usize) {
        self.make_root(u);
        if self.find_root(v) != u {
            self.fa[u] = v;
        }
    }

    fn cut(&mut self, u: usize, v: usize) {
        self.make_root(u);
        if self.find_root(v) == u && self.fa[v] == u && self.ch[v][0] == 0 {
            self.fa[v] = 0;
            self.ch[u][1] = 0;
            self.pull(u);
        }
    }

    fn point_set(&mut self, u: usize, val: i64) {
        self.splay(u);
        self.val[u] = val;
        self.pull(u);
    }

    fn path_sum(&mut self, u: usize, v: usize) -> i64 {
        self.make_root(u);
        if self.find_root(v) != u {
            -1
        } else {
            self.sum[u]
        }
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

    let mut lct = LinkCutTree::new(n);
    for i in 1..=n {
        let v: i64 = it.next().unwrap().parse().unwrap();
        lct.val[i] = v;
        lct.sum[i] = v;
    }

    let mut out = String::new();
    for _ in 0..q {
        let t: usize = it.next().unwrap().parse().unwrap();
        let u: usize = it.next().unwrap().parse().unwrap();
        let v: i64 = it.next().unwrap().parse().unwrap();
        match t {
            1 => lct.link(u, v as usize),
            2 => lct.cut(u, v as usize),
            3 => lct.point_set(u, v),
            _ => out.push_str(&format!("{}\\n", lct.path_sum(u, v as usize))),
        }
    }
    print!("{out}");
}
`,
    java21: `import java.io.IOException;
import java.io.InputStream;

public class Main {
    static class FastScanner {
        private final InputStream in;
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;

        FastScanner(InputStream in) {
            this.in = in;
        }

        private int readByte() throws IOException {
            if (ptr >= len) {
                len = in.read(buf);
                ptr = 0;
                if (len <= 0) return -1;
            }
            return buf[ptr++];
        }

        long nextLong() throws IOException {
            int c = readByte();
            while (c != -1 && c <= ' ') c = readByte();
            if (c == -1) return Long.MIN_VALUE;
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

        int nextInt() throws IOException {
            return (int) nextLong();
        }
    }

    static class LinkCutTree {
        final int[] fa, lc, rc, stk;
        final boolean[] rev;
        final long[] val, sum;

        LinkCutTree(int n) {
            fa = new int[n + 1];
            lc = new int[n + 1];
            rc = new int[n + 1];
            stk = new int[n + 1];
            rev = new boolean[n + 1];
            val = new long[n + 1];
            sum = new long[n + 1];
        }

        boolean isRoot(int x) {
            int p = fa[x];
            return lc[p] != x && rc[p] != x;
        }

        void pull(int x) {
            sum[x] = sum[lc[x]] + sum[rc[x]] + val[x];
        }

        void pushRev(int x) {
            if (x == 0) return;
            int tmp = lc[x];
            lc[x] = rc[x];
            rc[x] = tmp;
            rev[x] = !rev[x];
        }

        void push(int x) {
            if (rev[x]) {
                pushRev(lc[x]);
                pushRev(rc[x]);
                rev[x] = false;
            }
        }

        void rotate(int x) {
            int y = fa[x], z = fa[y];
            boolean xRight = (rc[y] == x);
            if (!isRoot(y)) {
                if (rc[z] == y) rc[z] = x;
                else lc[z] = x;
            }
            fa[x] = z;
            int c = xRight ? lc[x] : rc[x];
            if (xRight) rc[y] = c;
            else lc[y] = c;
            if (c != 0) fa[c] = y;
            if (xRight) lc[x] = y;
            else rc[x] = y;
            fa[y] = x;
            pull(y);
            pull(x);
        }

        void splay(int x) {
            int top = 0, cur = x;
            stk[top++] = cur;
            while (!isRoot(cur)) {
                cur = fa[cur];
                stk[top++] = cur;
            }
            while (top > 0) push(stk[--top]);

            while (!isRoot(x)) {
                int y = fa[x], z = fa[y];
                if (!isRoot(y)) {
                    boolean same = (rc[y] == x) == (rc[z] == y);
                    rotate(same ? y : x);
                }
                rotate(x);
            }
        }

        void access(int x) {
            for (int y = 0; x != 0; y = x, x = fa[x]) {
                splay(x);
                rc[x] = y;
                pull(x);
            }
        }

        void makeRoot(int x) {
            access(x);
            splay(x);
            pushRev(x);
        }

        int findRoot(int x) {
            access(x);
            splay(x);
            while (lc[x] != 0) {
                push(x);
                x = lc[x];
            }
            splay(x);
            return x;
        }

        void link(int u, int v) {
            makeRoot(u);
            if (findRoot(v) != u) fa[u] = v;
        }

        void cut(int u, int v) {
            makeRoot(u);
            if (findRoot(v) == u && fa[v] == u && lc[v] == 0) {
                fa[v] = 0;
                rc[u] = 0;
                pull(u);
            }
        }

        void pointSet(int u, long v) {
            splay(u);
            val[u] = v;
            pull(u);
        }

        long pathSum(int u, int v) {
            makeRoot(u);
            if (findRoot(v) != u) return -1;
            return sum[u];
        }
    }

    public static void main(String[] args) throws IOException {
        FastScanner fs = new FastScanner(System.in);
        long nLong = fs.nextLong();
        if (nLong == Long.MIN_VALUE) return;
        int n = (int) nLong;
        int q = fs.nextInt();

        LinkCutTree lct = new LinkCutTree(n);
        for (int i = 1; i <= n; i++) {
            lct.val[i] = fs.nextLong();
            lct.sum[i] = lct.val[i];
        }

        StringBuilder sb = new StringBuilder();
        while (q-- > 0) {
            int t = fs.nextInt();
            int u = fs.nextInt();
            long v = fs.nextLong();
            if (t == 1) lct.link(u, (int) v);
            else if (t == 2) lct.cut(u, (int) v);
            else if (t == 3) lct.pointSet(u, v);
            else sb.append(lct.pathSum(u, (int) v)).append('\\n');
        }
        System.out.print(sb);
    }
}
`,
    python3: `import sys

sys.setrecursionlimit(200000)


class LinkCutTree:
    def __init__(self, n: int) -> None:
        self.fa = [0] * (n + 1)
        self.lc = [0] * (n + 1)
        self.rc = [0] * (n + 1)
        self.rev = [False] * (n + 1)
        self.val = [0] * (n + 1)
        self.sum = [0] * (n + 1)

    def _is_root(self, x: int) -> bool:
        p = self.fa[x]
        return self.lc[p] != x and self.rc[p] != x

    def _pull(self, x: int) -> None:
        self.sum[x] = self.sum[self.lc[x]] + self.sum[self.rc[x]] + self.val[x]

    def _push_rev(self, x: int) -> None:
        if x:
            self.lc[x], self.rc[x] = self.rc[x], self.lc[x]
            self.rev[x] = not self.rev[x]

    def _push(self, x: int) -> None:
        if self.rev[x]:
            self._push_rev(self.lc[x])
            self._push_rev(self.rc[x])
            self.rev[x] = False

    def _rotate(self, x: int) -> None:
        y = self.fa[x]
        z = self.fa[y]
        x_right = self.rc[y] == x
        if not self._is_root(y):
            if self.rc[z] == y:
                self.rc[z] = x
            else:
                self.lc[z] = x
        self.fa[x] = z
        if x_right:
            c = self.lc[x]
            self.rc[y] = c
            self.lc[x] = y
        else:
            c = self.rc[x]
            self.lc[y] = c
            self.rc[x] = y
        if c:
            self.fa[c] = y
        self.fa[y] = x
        self._pull(y)
        self._pull(x)

    def splay(self, x: int) -> None:
        stk = [x]
        cur = x
        while not self._is_root(cur):
            cur = self.fa[cur]
            stk.append(cur)
        while stk:
            self._push(stk.pop())

        while not self._is_root(x):
            y = self.fa[x]
            z = self.fa[y]
            if not self._is_root(y):
                same = (self.rc[y] == x) == (self.rc[z] == y)
                self._rotate(y if same else x)
            self._rotate(x)

    def access(self, x: int) -> None:
        y = 0
        while x:
            self.splay(x)
            self.rc[x] = y
            self._pull(x)
            y = x
            x = self.fa[x]

    def make_root(self, x: int) -> None:
        self.access(x)
        self.splay(x)
        self._push_rev(x)

    def find_root(self, x: int) -> int:
        self.access(x)
        self.splay(x)
        while self.lc[x]:
            self._push(x)
            x = self.lc[x]
        self.splay(x)
        return x

    def link(self, u: int, v: int) -> None:
        self.make_root(u)
        if self.find_root(v) != u:
            self.fa[u] = v

    def cut(self, u: int, v: int) -> None:
        self.make_root(u)
        if self.find_root(v) == u and self.fa[v] == u and self.lc[v] == 0:
            self.fa[v] = 0
            self.rc[u] = 0
            self._pull(u)

    def point_set(self, u: int, v: int) -> None:
        self.splay(u)
        self.val[u] = v
        self._pull(u)

    def path_sum(self, u: int, v: int) -> int:
        self.make_root(u)
        if self.find_root(v) != u:
            return -1
        return self.sum[u]


def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    n = int(next(it))
    q = int(next(it))
    lct = LinkCutTree(n)
    for i in range(1, n + 1):
        v = int(next(it))
        lct.val[i] = v
        lct.sum[i] = v

    out: list[str] = []
    for _ in range(q):
        t = int(next(it))
        u = int(next(it))
        v = int(next(it))
        if t == 1:
            lct.link(u, v)
        elif t == 2:
            lct.cut(u, v)
        elif t == 3:
            lct.point_set(u, v)
        else:
            out.append(str(lct.path_sum(u, v)))

    sys.stdout.write("\\n".join(out) + ("\\n" if out else ""))


if __name__ == "__main__":
    solve()
`,
    ruby: `class LinkCutTree
  attr_accessor :val, :sum

  def initialize(n)
    @fa = Array.new(n + 1, 0)
    @lc = Array.new(n + 1, 0)
    @rc = Array.new(n + 1, 0)
    @rev = Array.new(n + 1, false)
    @val = Array.new(n + 1, 0)
    @sum = Array.new(n + 1, 0)
  end

  def is_root(x)
    p = @fa[x]
    @lc[p] != x && @rc[p] != x
  end

  def pull(x)
    @sum[x] = @sum[@lc[x]] + @sum[@rc[x]] + @val[x]
  end

  def push_rev(x)
    return if x == 0

    @lc[x], @rc[x] = @rc[x], @lc[x]
    @rev[x] = !@rev[x]
  end

  def push(x)
    return unless @rev[x]

    push_rev(@lc[x])
    push_rev(@rc[x])
    @rev[x] = false
  end

  def rotate(x)
    y = @fa[x]
    z = @fa[y]
    x_right = (@rc[y] == x)
    unless is_root(y)
      if @rc[z] == y
        @rc[z] = x
      else
        @lc[z] = x
      end
    end
    @fa[x] = z
    if x_right
      c = @lc[x]
      @rc[y] = c
      @lc[x] = y
    else
      c = @rc[x]
      @lc[y] = c
      @rc[x] = y
    end
    @fa[c] = y if c != 0
    @fa[y] = x
    pull(y)
    pull(x)
  end

  def splay(x)
    stk = [x]
    cur = x
    until is_root(cur)
      cur = @fa[cur]
      stk << cur
    end
    push(stk.pop) until stk.empty?

    until is_root(x)
      y = @fa[x]
      z = @fa[y]
      unless is_root(y)
        same = (@rc[y] == x) == (@rc[z] == y)
        rotate(same ? y : x)
      end
      rotate(x)
    end
  end

  def access(x)
    y = 0
    while x != 0
      splay(x)
      @rc[x] = y
      pull(x)
      y = x
      x = @fa[x]
    end
  end

  def make_root(x)
    access(x)
    splay(x)
    push_rev(x)
  end

  def find_root(x)
    access(x)
    splay(x)
    while @lc[x] != 0
      push(x)
      x = @lc[x]
    end
    splay(x)
    x
  end

  def link(u, v)
    make_root(u)
    @fa[u] = v if find_root(v) != u
  end

  def cut(u, v)
    make_root(u)
    if find_root(v) == u && @fa[v] == u && @lc[v] == 0
      @fa[v] = 0
      @rc[u] = 0
      pull(u)
    end
  end

  def point_set(u, v)
    splay(u)
    @val[u] = v
    pull(u)
  end

  def path_sum(u, v)
    make_root(u)
    return -1 if find_root(v) != u

    @sum[u]
  end
end

data = $stdin.read.split
exit if data.empty?
idx = 0
n = data[idx].to_i; idx += 1
q = data[idx].to_i; idx += 1

lct = LinkCutTree.new(n)
(1..n).each do |i|
  v = data[idx].to_i; idx += 1
  lct.val[i] = v
  lct.sum[i] = v
end

out = []
q.times do
  t = data[idx].to_i; idx += 1
  u = data[idx].to_i; idx += 1
  v = data[idx].to_i; idx += 1
  if t == 1
    lct.link(u, v)
  elsif t == 2
    lct.cut(u, v)
  elsif t == 3
    lct.point_set(u, v)
  else
    out << lct.path_sum(u, v).to_s
  end
end

puts out.join("\\n") unless out.empty?
`,
  },
  practiceProblems: [
    {
      id: 'ch69-p1',
      tier: 'Warmup',
      ratingRange: '2400–2700',
      title: 'Dynamic Tree Connectivity & Path Sum Queries',
      statement:
        'You maintain a forest of N vertices numbered 1..N with initial vertex weights a_1..a_N and initially no edges. Process Q operations: (1 u v) add edge (u, v) if u and v are in different components; (2 u v) remove edge (u, v) if it currently exists; (3 u x) update weight a_u = x; (4 u v) output the sum of weights on the unique path from u to v, or -1 if disconnected.',
      constraints: '1 <= N, Q <= 10^5; 0 <= a_i, x <= 10^9',
      sampleInput: `5 7
1 2 3 4 5
1 1 2
1 2 3
4 1 3
3 2 10
4 1 3
2 1 2
4 1 3`,
      sampleOutput: `6
14
-1`,
      hints: [
        'Use a Link-Cut Tree where every auxiliary splay node maintains the sum of vertex weights in its splay subtree.',
        'For pathSum(u, v): call makeRoot(u), then verify findRoot(v) == u (which leaves u at the splay root covering the entire u..v path).',
        'Before cut(u, v), call makeRoot(u) and confirm findRoot(v) == u && fa[v] == u && lc[v] == 0 so invalid cuts are safely ignored.',
      ],
      solutions: {
        cpp20: `#include <algorithm>
#include <array>
#include <iostream>
#include <vector>

using namespace std;

struct LinkCutTree {
    vector<int> fa, rev;
    vector<array<int, 2>> ch;
    vector<long long> val, sum;

    explicit LinkCutTree(int n)
        : fa(n + 1, 0), rev(n + 1, 0), ch(n + 1, {0, 0}), val(n + 1, 0), sum(n + 1, 0) {}

    bool isRoot(int x) const {
        return ch[fa[x]][0] != x && ch[fa[x]][1] != x;
    }

    void pull(int x) {
        sum[x] = sum[ch[x][0]] + sum[ch[x][1]] + val[x];
    }

    void pushRev(int x) {
        if (!x) return;
        swap(ch[x][0], ch[x][1]);
        rev[x] ^= 1;
    }

    void push(int x) {
        if (rev[x]) {
            pushRev(ch[x][0]);
            pushRev(ch[x][1]);
            rev[x] = 0;
        }
    }

    void pushAll(int x) {
        if (!isRoot(x)) pushAll(fa[x]);
        push(x);
    }

    void rotate(int x) {
        int y = fa[x], z = fa[y];
        int k = (ch[y][1] == x);
        if (!isRoot(y)) ch[z][ch[z][1] == y] = x;
        fa[x] = z;
        ch[y][k] = ch[x][k ^ 1];
        if (ch[x][k ^ 1]) fa[ch[x][k ^ 1]] = y;
        ch[x][k ^ 1] = y;
        fa[y] = x;
        pull(y);
        pull(x);
    }

    void splay(int x) {
        pushAll(x);
        while (!isRoot(x)) {
            int y = fa[x], z = fa[y];
            if (!isRoot(y)) {
                rotate(((ch[y][1] == x) ^ (ch[z][1] == y)) ? x : y);
            }
            rotate(x);
        }
    }

    void access(int x) {
        for (int y = 0; x; y = x, x = fa[x]) {
            splay(x);
            ch[x][1] = y;
            pull(x);
        }
    }

    void makeRoot(int x) {
        access(x);
        splay(x);
        pushRev(x);
    }

    int findRoot(int x) {
        access(x);
        splay(x);
        while (ch[x][0]) {
            push(x);
            x = ch[x][0];
        }
        splay(x);
        return x;
    }

    void link(int u, int v) {
        makeRoot(u);
        if (findRoot(v) != u) fa[u] = v;
    }

    void cut(int u, int v) {
        makeRoot(u);
        if (findRoot(v) == u && fa[v] == u && ch[v][0] == 0) {
            fa[v] = ch[u][1] = 0;
            pull(u);
        }
    }

    void update(int u, long long x) {
        splay(u);
        val[u] = x;
        pull(u);
    }

    long long queryPath(int u, int v) {
        makeRoot(u);
        if (findRoot(v) != u) return -1;
        return sum[u];
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, q;
    if (!(cin >> n >> q)) return 0;

    LinkCutTree lct(n);
    for (int i = 1; i <= n; ++i) {
        cin >> lct.val[i];
        lct.sum[i] = lct.val[i];
    }

    while (q--) {
        int t, u;
        long long v;
        cin >> t >> u >> v;
        if (t == 1) lct.link(u, static_cast<int>(v));
        else if (t == 2) lct.cut(u, static_cast<int>(v));
        else if (t == 3) lct.update(u, v);
        else cout << lct.queryPath(u, static_cast<int>(v)) << "\\n";
    }
    return 0;
}
`,
        rust: `use std::io::{self, Read};

struct LinkCutTree {
    fa: Vec<usize>,
    ch: Vec<[usize; 2]>,
    rev: Vec<bool>,
    val: Vec<i64>,
    sum: Vec<i64>,
}

impl LinkCutTree {
    fn new(n: usize) -> Self {
        Self {
            fa: vec![0; n + 1],
            ch: vec![[0, 0]; n + 1],
            rev: vec![false; n + 1],
            val: vec![0; n + 1],
            sum: vec![0; n + 1],
        }
    }

    fn is_root(&self, x: usize) -> bool {
        let p = self.fa[x];
        self.ch[p][0] != x && self.ch[p][1] != x
    }

    fn pull(&mut self, x: usize) {
        self.sum[x] = self.sum[self.ch[x][0]] + self.sum[self.ch[x][1]] + self.val[x];
    }

    fn push_rev(&mut self, x: usize) {
        if x != 0 {
            self.ch[x].swap(0, 1);
            self.rev[x] = !self.rev[x];
        }
    }

    fn push(&mut self, x: usize) {
        if self.rev[x] {
            let l = self.ch[x][0];
            let r = self.ch[x][1];
            self.push_rev(l);
            self.push_rev(r);
            self.rev[x] = false;
        }
    }

    fn push_all(&mut self, x: usize) {
        let mut stk = Vec::new();
        let mut cur = x;
        while !self.is_root(cur) {
            stk.push(cur);
            cur = self.fa[cur];
        }
        stk.push(cur);
        while let Some(u) = stk.pop() {
            self.push(u);
        }
    }

    fn rotate(&mut self, x: usize) {
        let y = self.fa[x];
        let z = self.fa[y];
        let k = usize::from(self.ch[y][1] == x);
        if !self.is_root(y) {
            let zk = usize::from(self.ch[z][1] == y);
            self.ch[z][zk] = x;
        }
        self.fa[x] = z;
        let c = self.ch[x][k ^ 1];
        self.ch[y][k] = c;
        if c != 0 {
            self.fa[c] = y;
        }
        self.ch[x][k ^ 1] = y;
        self.fa[y] = x;
        self.pull(y);
        self.pull(x);
    }

    fn splay(&mut self, x: usize) {
        self.push_all(x);
        while !self.is_root(x) {
            let y = self.fa[x];
            let z = self.fa[y];
            if !self.is_root(y) {
                let same = (self.ch[y][1] == x) == (self.ch[z][1] == y);
                self.rotate(if same { y } else { x });
            }
            self.rotate(x);
        }
    }

    fn access(&mut self, mut x: usize) {
        let mut y = 0;
        while x != 0 {
            self.splay(x);
            self.ch[x][1] = y;
            self.pull(x);
            y = x;
            x = self.fa[x];
        }
    }

    fn make_root(&mut self, x: usize) {
        self.access(x);
        self.splay(x);
        self.push_rev(x);
    }

    fn find_root(&mut self, mut x: usize) -> usize {
        self.access(x);
        self.splay(x);
        while self.ch[x][0] != 0 {
            self.push(x);
            x = self.ch[x][0];
        }
        self.splay(x);
        x
    }

    fn link(&mut self, u: usize, v: usize) {
        self.make_root(u);
        if self.find_root(v) != u {
            self.fa[u] = v;
        }
    }

    fn cut(&mut self, u: usize, v: usize) {
        self.make_root(u);
        if self.find_root(v) == u && self.fa[v] == u && self.ch[v][0] == 0 {
            self.fa[v] = 0;
            self.ch[u][1] = 0;
            self.pull(u);
        }
    }

    fn update(&mut self, u: usize, x: i64) {
        self.splay(u);
        self.val[u] = x;
        self.pull(u);
    }

    fn query_path(&mut self, u: usize, v: usize) -> i64 {
        self.make_root(u);
        if self.find_root(v) != u {
            -1
        } else {
            self.sum[u]
        }
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

    let mut lct = LinkCutTree::new(n);
    for i in 1..=n {
        let v: i64 = it.next().unwrap().parse().unwrap();
        lct.val[i] = v;
        lct.sum[i] = v;
    }

    let mut out = String::new();
    for _ in 0..q {
        let t: usize = it.next().unwrap().parse().unwrap();
        let u: usize = it.next().unwrap().parse().unwrap();
        let v: i64 = it.next().unwrap().parse().unwrap();
        match t {
            1 => lct.link(u, v as usize),
            2 => lct.cut(u, v as usize),
            3 => lct.update(u, v),
            _ => out.push_str(&format!("{}\\n", lct.query_path(u, v as usize))),
        }
    }
    print!("{out}");
}
`,
        java21: `import java.io.IOException;
import java.io.InputStream;

public class Main {
    static class FastScanner {
        private final InputStream in;
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;

        FastScanner(InputStream in) {
            this.in = in;
        }

        private int readByte() throws IOException {
            if (ptr >= len) {
                len = in.read(buf);
                ptr = 0;
                if (len <= 0) return -1;
            }
            return buf[ptr++];
        }

        long nextLong() throws IOException {
            int c = readByte();
            while (c != -1 && c <= ' ') c = readByte();
            if (c == -1) return Long.MIN_VALUE;
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

        int nextInt() throws IOException {
            return (int) nextLong();
        }
    }

    static class LCT {
        final int[] fa, lc, rc, stk;
        final boolean[] rev;
        final long[] val, sum;

        LCT(int n) {
            fa = new int[n + 1];
            lc = new int[n + 1];
            rc = new int[n + 1];
            stk = new int[n + 1];
            rev = new boolean[n + 1];
            val = new long[n + 1];
            sum = new long[n + 1];
        }

        boolean isRoot(int x) {
            int p = fa[x];
            return lc[p] != x && rc[p] != x;
        }

        void pull(int x) {
            sum[x] = sum[lc[x]] + sum[rc[x]] + val[x];
        }

        void pushRev(int x) {
            if (x == 0) return;
            int t = lc[x];
            lc[x] = rc[x];
            rc[x] = t;
            rev[x] = !rev[x];
        }

        void push(int x) {
            if (rev[x]) {
                pushRev(lc[x]);
                pushRev(rc[x]);
                rev[x] = false;
            }
        }

        void rotate(int x) {
            int y = fa[x], z = fa[y];
            boolean xr = (rc[y] == x);
            if (!isRoot(y)) {
                if (rc[z] == y) rc[z] = x;
                else lc[z] = x;
            }
            fa[x] = z;
            int c = xr ? lc[x] : rc[x];
            if (xr) rc[y] = c;
            else lc[y] = c;
            if (c != 0) fa[c] = y;
            if (xr) lc[x] = y;
            else rc[x] = y;
            fa[y] = x;
            pull(y);
            pull(x);
        }

        void splay(int x) {
            int top = 0, cur = x;
            stk[top++] = cur;
            while (!isRoot(cur)) {
                cur = fa[cur];
                stk[top++] = cur;
            }
            while (top > 0) push(stk[--top]);
            while (!isRoot(x)) {
                int y = fa[x], z = fa[y];
                if (!isRoot(y)) {
                    rotate(((rc[y] == x) == (rc[z] == y)) ? y : x);
                }
                rotate(x);
            }
        }

        void access(int x) {
            for (int y = 0; x != 0; y = x, x = fa[x]) {
                splay(x);
                rc[x] = y;
                pull(x);
            }
        }

        void makeRoot(int x) {
            access(x);
            splay(x);
            pushRev(x);
        }

        int findRoot(int x) {
            access(x);
            splay(x);
            while (lc[x] != 0) {
                push(x);
                x = lc[x];
            }
            splay(x);
            return x;
        }

        void link(int u, int v) {
            makeRoot(u);
            if (findRoot(v) != u) fa[u] = v;
        }

        void cut(int u, int v) {
            makeRoot(u);
            if (findRoot(v) == u && fa[v] == u && lc[v] == 0) {
                fa[v] = rc[u] = 0;
                pull(u);
            }
        }

        void update(int u, long v) {
            splay(u);
            val[u] = v;
            pull(u);
        }

        long queryPath(int u, int v) {
            makeRoot(u);
            if (findRoot(v) != u) return -1;
            return sum[u];
        }
    }

    public static void main(String[] args) throws IOException {
        FastScanner fs = new FastScanner(System.in);
        long nLong = fs.nextLong();
        if (nLong == Long.MIN_VALUE) return;
        int n = (int) nLong;
        int q = fs.nextInt();
        LCT lct = new LCT(n);
        for (int i = 1; i <= n; i++) {
            lct.val[i] = fs.nextLong();
            lct.sum[i] = lct.val[i];
        }
        StringBuilder sb = new StringBuilder();
        while (q-- > 0) {
            int t = fs.nextInt();
            int u = fs.nextInt();
            long v = fs.nextLong();
            if (t == 1) lct.link(u, (int) v);
            else if (t == 2) lct.cut(u, (int) v);
            else if (t == 3) lct.update(u, v);
            else sb.append(lct.queryPath(u, (int) v)).append('\\n');
        }
        System.out.print(sb);
    }
}
`,
        python3: `import sys

sys.setrecursionlimit(200000)


class LinkCutTree:
    def __init__(self, n: int) -> None:
        self.fa = [0] * (n + 1)
        self.lc = [0] * (n + 1)
        self.rc = [0] * (n + 1)
        self.rev = [False] * (n + 1)
        self.val = [0] * (n + 1)
        self.sum = [0] * (n + 1)

    def _is_root(self, x: int) -> bool:
        p = self.fa[x]
        return self.lc[p] != x and self.rc[p] != x

    def _pull(self, x: int) -> None:
        self.sum[x] = self.sum[self.lc[x]] + self.sum[self.rc[x]] + self.val[x]

    def _push_rev(self, x: int) -> None:
        if x:
            self.lc[x], self.rc[x] = self.rc[x], self.lc[x]
            self.rev[x] = not self.rev[x]

    def _push(self, x: int) -> None:
        if self.rev[x]:
            self._push_rev(self.lc[x])
            self._push_rev(self.rc[x])
            self.rev[x] = False

    def _rotate(self, x: int) -> None:
        y = self.fa[x]
        z = self.fa[y]
        xr = self.rc[y] == x
        if not self._is_root(y):
            if self.rc[z] == y:
                self.rc[z] = x
            else:
                self.lc[z] = x
        self.fa[x] = z
        if xr:
            c = self.lc[x]
            self.rc[y] = c
            self.lc[x] = y
        else:
            c = self.rc[x]
            self.lc[y] = c
            self.rc[x] = y
        if c:
            self.fa[c] = y
        self.fa[y] = x
        self._pull(y)
        self._pull(x)

    def splay(self, x: int) -> None:
        stk = [x]
        cur = x
        while not self._is_root(cur):
            cur = self.fa[cur]
            stk.append(cur)
        while stk:
            self._push(stk.pop())
        while not self._is_root(x):
            y = self.fa[x]
            z = self.fa[y]
            if not self._is_root(y):
                same = (self.rc[y] == x) == (self.rc[z] == y)
                self._rotate(y if same else x)
            self._rotate(x)

    def access(self, x: int) -> None:
        y = 0
        while x:
            self.splay(x)
            self.rc[x] = y
            self._pull(x)
            y = x
            x = self.fa[x]

    def make_root(self, x: int) -> None:
        self.access(x)
        self.splay(x)
        self._push_rev(x)

    def find_root(self, x: int) -> int:
        self.access(x)
        self.splay(x)
        while self.lc[x]:
            self._push(x)
            x = self.lc[x]
        self.splay(x)
        return x

    def link(self, u: int, v: int) -> None:
        self.make_root(u)
        if self.find_root(v) != u:
            self.fa[u] = v

    def cut(self, u: int, v: int) -> None:
        self.make_root(u)
        if self.find_root(v) == u and self.fa[v] == u and self.lc[v] == 0:
            self.fa[v] = 0
            self.rc[u] = 0
            self._pull(u)

    def update(self, u: int, v: int) -> None:
        self.splay(u)
        self.val[u] = v
        self._pull(u)

    def query_path(self, u: int, v: int) -> int:
        self.make_root(u)
        if self.find_root(v) != u:
            return -1
        return self.sum[u]


def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    n = int(next(it))
    q = int(next(it))
    lct = LinkCutTree(n)
    for i in range(1, n + 1):
        v = int(next(it))
        lct.val[i] = v
        lct.sum[i] = v

    out: list[str] = []
    for _ in range(q):
        t = int(next(it))
        u = int(next(it))
        v = int(next(it))
        if t == 1:
            lct.link(u, v)
        elif t == 2:
            lct.cut(u, v)
        elif t == 3:
            lct.update(u, v)
        else:
            out.append(str(lct.query_path(u, v)))
    sys.stdout.write("\\n".join(out) + ("\\n" if out else ""))


if __name__ == "__main__":
    solve()
`,
        ruby: `class LinkCutTree
  attr_accessor :val, :sum

  def initialize(n)
    @fa = Array.new(n + 1, 0)
    @lc = Array.new(n + 1, 0)
    @rc = Array.new(n + 1, 0)
    @rev = Array.new(n + 1, false)
    @val = Array.new(n + 1, 0)
    @sum = Array.new(n + 1, 0)
  end

  def is_root(x)
    p = @fa[x]
    @lc[p] != x && @rc[p] != x
  end

  def pull(x)
    @sum[x] = @sum[@lc[x]] + @sum[@rc[x]] + @val[x]
  end

  def push_rev(x)
    return if x == 0

    @lc[x], @rc[x] = @rc[x], @lc[x]
    @rev[x] = !@rev[x]
  end

  def push(x)
    return unless @rev[x]

    push_rev(@lc[x])
    push_rev(@rc[x])
    @rev[x] = false
  end

  def rotate(x)
    y = @fa[x]
    z = @fa[y]
    xr = (@rc[y] == x)
    unless is_root(y)
      if @rc[z] == y
        @rc[z] = x
      else
        @lc[z] = x
      end
    end
    @fa[x] = z
    if xr
      c = @lc[x]
      @rc[y] = c
      @lc[x] = y
    else
      c = @rc[x]
      @lc[y] = c
      @rc[x] = y
    end
    @fa[c] = y if c != 0
    @fa[y] = x
    pull(y)
    pull(x)
  end

  def splay(x)
    stk = [x]
    cur = x
    until is_root(cur)
      cur = @fa[cur]
      stk << cur
    end
    push(stk.pop) until stk.empty?

    until is_root(x)
      y = @fa[x]
      z = @fa[y]
      unless is_root(y)
        rotate((@rc[y] == x) == (@rc[z] == y) ? y : x)
      end
      rotate(x)
    end
  end

  def access(x)
    y = 0
    while x != 0
      splay(x)
      @rc[x] = y
      pull(x)
      y = x
      x = @fa[x]
    end
  end

  def make_root(x)
    access(x)
    splay(x)
    push_rev(x)
  end

  def find_root(x)
    access(x)
    splay(x)
    while @lc[x] != 0
      push(x)
      x = @lc[x]
    end
    splay(x)
    x
  end

  def link(u, v)
    make_root(u)
    @fa[u] = v if find_root(v) != u
  end

  def cut(u, v)
    make_root(u)
    if find_root(v) == u && @fa[v] == u && @lc[v] == 0
      @fa[v] = 0
      @rc[u] = 0
      pull(u)
    end
  end

  def update(u, v)
    splay(u)
    @val[u] = v
    pull(u)
  end

  def query_path(u, v)
    make_root(u)
    return -1 if find_root(v) != u

    @sum[u]
  end
end

data = $stdin.read.split
exit if data.empty?
idx = 0
n = data[idx].to_i; idx += 1
q = data[idx].to_i; idx += 1

lct = LinkCutTree.new(n)
(1..n).each do |i|
  v = data[idx].to_i; idx += 1
  lct.val[i] = v
  lct.sum[i] = v
end

out = []
q.times do
  t = data[idx].to_i; idx += 1
  u = data[idx].to_i; idx += 1
  v = data[idx].to_i; idx += 1
  if t == 1
    lct.link(u, v)
  elsif t == 2
    lct.cut(u, v)
  elsif t == 3
    lct.update(u, v)
  else
    out << lct.query_path(u, v).to_s
  end
end

puts out.join("\\n") unless out.empty?
`,
      },
    },
    {
      id: 'ch69-p2',
      tier: 'Standard',
      ratingRange: '2550–2850',
      title: 'Dynamic Minimum Spanning Forest via Edge Nodes',
      statement:
        'Given N vertices (1..N) initially with no edges, process Q operations in order: (1 u v w) add an undirected edge between u and v (u != v) with weight w; (2) print the total weight of the Minimum Spanning Tree across all N vertices, or -1 if the graph is not yet connected into a single spanning tree.',
      constraints: '2 <= N <= 10^5; 1 <= Q <= 2 * 10^5; 1 <= u, v <= N; 0 <= w <= 10^9',
      sampleInput: `4 6
1 1 2 5
1 2 3 4
1 3 4 6
2
1 1 4 2
2`,
      sampleOutput: `15
11`,
      hints: [
        'Represent each inserted edge i as an explicit node N + i carrying weight w_i (while original vertices 1..N carry weight -1).',
        'When adding edge (u, v, w): if findRoot(u) != findRoot(v), link u <-> eNode <-> v and add w to totalWeight.',
        'If u and v are already connected, makeRoot(u); access(v); splay(v); inspect the argmax node mxId on the path. If w < weight[mxId], cut mxId from both its stored endpoints and link the new edge node!',
      ],
      solutions: {
        cpp20: `#include <algorithm>
#include <array>
#include <iostream>
#include <vector>

using namespace std;

struct EdgeLCT {
    vector<int> fa, rev, mxId, endU, endV;
    vector<array<int, 2>> ch;
    vector<long long> w;

    EdgeLCT(int n, int maxEdges)
        : fa(n + maxEdges + 1, 0),
          rev(n + maxEdges + 1, 0),
          mxId(n + maxEdges + 1, 0),
          endU(n + maxEdges + 1, 0),
          endV(n + maxEdges + 1, 0),
          ch(n + maxEdges + 1, {0, 0}),
          w(n + maxEdges + 1, -1) {
        for (int i = 1; i <= n + maxEdges; ++i) mxId[i] = i;
    }

    bool isRoot(int x) const {
        return ch[fa[x]][0] != x && ch[fa[x]][1] != x;
    }

    void pull(int x) {
        mxId[x] = x;
        int l = ch[x][0], r = ch[x][1];
        if (l && w[mxId[l]] > w[mxId[x]]) mxId[x] = mxId[l];
        if (r && w[mxId[r]] > w[mxId[x]]) mxId[x] = mxId[r];
    }

    void pushRev(int x) {
        if (!x) return;
        swap(ch[x][0], ch[x][1]);
        rev[x] ^= 1;
    }

    void push(int x) {
        if (rev[x]) {
            pushRev(ch[x][0]);
            pushRev(ch[x][1]);
            rev[x] = 0;
        }
    }

    void pushAll(int x) {
        if (!isRoot(x)) pushAll(fa[x]);
        push(x);
    }

    void rotate(int x) {
        int y = fa[x], z = fa[y];
        int k = (ch[y][1] == x);
        if (!isRoot(y)) ch[z][ch[z][1] == y] = x;
        fa[x] = z;
        ch[y][k] = ch[x][k ^ 1];
        if (ch[x][k ^ 1]) fa[ch[x][k ^ 1]] = y;
        ch[x][k ^ 1] = y;
        fa[y] = x;
        pull(y);
        pull(x);
    }

    void splay(int x) {
        pushAll(x);
        while (!isRoot(x)) {
            int y = fa[x], z = fa[y];
            if (!isRoot(y)) {
                rotate(((ch[y][1] == x) ^ (ch[z][1] == y)) ? x : y);
            }
            rotate(x);
        }
    }

    void access(int x) {
        for (int y = 0; x; y = x, x = fa[x]) {
            splay(x);
            ch[x][1] = y;
            pull(x);
        }
    }

    void makeRoot(int x) {
        access(x);
        splay(x);
        pushRev(x);
    }

    int findRoot(int x) {
        access(x);
        splay(x);
        while (ch[x][0]) {
            push(x);
            x = ch[x][0];
        }
        splay(x);
        return x;
    }

    void link(int u, int v) {
        makeRoot(u);
        fa[u] = v;
    }

    void cut(int u, int v) {
        makeRoot(u);
        access(v);
        splay(v);
        ch[v][0] = fa[u] = 0;
        pull(v);
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, q;
    if (!(cin >> n >> q)) return 0;

    EdgeLCT lct(n, q);
    long long mstWeight = 0;
    int edgeCnt = 0;
    int nextEdgeId = n;

    while (q--) {
        int type;
        cin >> type;
        if (type == 1) {
            int u, v;
            long long wt;
            cin >> u >> v >> wt;
            if (lct.findRoot(u) != lct.findRoot(v)) {
                int e = ++nextEdgeId;
                lct.w[e] = wt;
                lct.endU[e] = u;
                lct.endV[e] = v;
                lct.link(u, e);
                lct.link(v, e);
                mstWeight += wt;
                ++edgeCnt;
            } else {
                lct.makeRoot(u);
                lct.access(v);
                lct.splay(v);
                int maxEdge = lct.mxId[v];
                if (lct.w[maxEdge] > wt) {
                    lct.cut(lct.endU[maxEdge], maxEdge);
                    lct.cut(lct.endV[maxEdge], maxEdge);
                    mstWeight += wt - lct.w[maxEdge];
                    int e = ++nextEdgeId;
                    lct.w[e] = wt;
                    lct.endU[e] = u;
                    lct.endV[e] = v;
                    lct.link(u, e);
                    lct.link(v, e);
                }
            }
        } else {
            cout << (edgeCnt == n - 1 ? mstWeight : -1LL) << "\\n";
        }
    }
    return 0;
}
`,
        rust: `use std::io::{self, Read};

struct EdgeLCT {
    fa: Vec<usize>,
    ch: Vec<[usize; 2]>,
    rev: Vec<bool>,
    mx_id: Vec<usize>,
    end_u: Vec<usize>,
    end_v: Vec<usize>,
    w: Vec<i64>,
}

impl EdgeLCT {
    fn new(n: usize, max_edges: usize) -> Self {
        let total = n + max_edges + 1;
        let mx_id: Vec<usize> = (0..total).collect();
        Self {
            fa: vec![0; total],
            ch: vec![[0, 0]; total],
            rev: vec![false; total],
            mx_id,
            end_u: vec![0; total],
            end_v: vec![0; total],
            w: vec![-1; total],
        }
    }

    fn is_root(&self, x: usize) -> bool {
        let p = self.fa[x];
        self.ch[p][0] != x && self.ch[p][1] != x
    }

    fn pull(&mut self, x: usize) {
        self.mx_id[x] = x;
        let l = self.ch[x][0];
        let r = self.ch[x][1];
        if l != 0 && self.w[self.mx_id[l]] > self.w[self.mx_id[x]] {
            self.mx_id[x] = self.mx_id[l];
        }
        if r != 0 && self.w[self.mx_id[r]] > self.w[self.mx_id[x]] {
            self.mx_id[x] = self.mx_id[r];
        }
    }

    fn push_rev(&mut self, x: usize) {
        if x != 0 {
            self.ch[x].swap(0, 1);
            self.rev[x] = !self.rev[x];
        }
    }

    fn push(&mut self, x: usize) {
        if self.rev[x] {
            let l = self.ch[x][0];
            let r = self.ch[x][1];
            self.push_rev(l);
            self.push_rev(r);
            self.rev[x] = false;
        }
    }

    fn push_all(&mut self, x: usize) {
        let mut stk = Vec::new();
        let mut cur = x;
        while !self.is_root(cur) {
            stk.push(cur);
            cur = self.fa[cur];
        }
        stk.push(cur);
        while let Some(u) = stk.pop() {
            self.push(u);
        }
    }

    fn rotate(&mut self, x: usize) {
        let y = self.fa[x];
        let z = self.fa[y];
        let k = usize::from(self.ch[y][1] == x);
        if !self.is_root(y) {
            let zk = usize::from(self.ch[z][1] == y);
            self.ch[z][zk] = x;
        }
        self.fa[x] = z;
        let c = self.ch[x][k ^ 1];
        self.ch[y][k] = c;
        if c != 0 {
            self.fa[c] = y;
        }
        self.ch[x][k ^ 1] = y;
        self.fa[y] = x;
        self.pull(y);
        self.pull(x);
    }

    fn splay(&mut self, x: usize) {
        self.push_all(x);
        while !self.is_root(x) {
            let y = self.fa[x];
            let z = self.fa[y];
            if !self.is_root(y) {
                let same = (self.ch[y][1] == x) == (self.ch[z][1] == y);
                self.rotate(if same { y } else { x });
            }
            self.rotate(x);
        }
    }

    fn access(&mut self, mut x: usize) {
        let mut y = 0;
        while x != 0 {
            self.splay(x);
            self.ch[x][1] = y;
            self.pull(x);
            y = x;
            x = self.fa[x];
        }
    }

    fn make_root(&mut self, x: usize) {
        self.access(x);
        self.splay(x);
        self.push_rev(x);
    }

    fn find_root(&mut self, mut x: usize) -> usize {
        self.access(x);
        self.splay(x);
        while self.ch[x][0] != 0 {
            self.push(x);
            x = self.ch[x][0];
        }
        self.splay(x);
        x
    }

    fn link(&mut self, u: usize, v: usize) {
        self.make_root(u);
        self.fa[u] = v;
    }

    fn cut(&mut self, u: usize, v: usize) {
        self.make_root(u);
        self.access(v);
        self.splay(v);
        self.ch[v][0] = 0;
        self.fa[u] = 0;
        self.pull(v);
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

    let mut lct = EdgeLCT::new(n, q);
    let mut mst_weight = 0i64;
    let mut edge_cnt = 0usize;
    let mut next_id = n;
    let mut out = String::new();

    for _ in 0..q {
        let t: usize = it.next().unwrap().parse().unwrap();
        if t == 1 {
            let u: usize = it.next().unwrap().parse().unwrap();
            let v: usize = it.next().unwrap().parse().unwrap();
            let wt: i64 = it.next().unwrap().parse().unwrap();
            if lct.find_root(u) != lct.find_root(v) {
                next_id += 1;
                let e = next_id;
                lct.w[e] = wt;
                lct.end_u[e] = u;
                lct.end_v[e] = v;
                lct.link(u, e);
                lct.link(v, e);
                mst_weight += wt;
                edge_cnt += 1;
            } else {
                lct.make_root(u);
                lct.access(v);
                lct.splay(v);
                let mx = lct.mx_id[v];
                if lct.w[mx] > wt {
                    let eu = lct.end_u[mx];
                    let ev = lct.end_v[mx];
                    lct.cut(eu, mx);
                    lct.cut(ev, mx);
                    mst_weight += wt - lct.w[mx];
                    next_id += 1;
                    let e = next_id;
                    lct.w[e] = wt;
                    lct.end_u[e] = u;
                    lct.end_v[e] = v;
                    lct.link(u, e);
                    lct.link(v, e);
                }
            }
        } else {
            out.push_str(&format!(
                "{}\\n",
                if edge_cnt == n - 1 { mst_weight } else { -1 }
            ));
        }
    }
    print!("{out}");
}
`,
        java21: `import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;

public class Main {
    static class FastScanner {
        private final InputStream in;
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;

        FastScanner(InputStream in) {
            this.in = in;
        }

        private int readByte() throws IOException {
            if (ptr >= len) {
                len = in.read(buf);
                ptr = 0;
                if (len <= 0) return -1;
            }
            return buf[ptr++];
        }

        long nextLong() throws IOException {
            int c = readByte();
            while (c != -1 && c <= ' ') c = readByte();
            if (c == -1) return Long.MIN_VALUE;
            long res = 0;
            while (c > ' ') {
                res = res * 10 + (c - '0');
                c = readByte();
            }
            return res;
        }

        int nextInt() throws IOException {
            return (int) nextLong();
        }
    }

    static class EdgeLCT {
        final int[] fa, lc, rc, stk, mxId, endU, endV;
        final boolean[] rev;
        final long[] w;

        EdgeLCT(int n, int maxEdges) {
            int sz = n + maxEdges + 1;
            fa = new int[sz];
            lc = new int[sz];
            rc = new int[sz];
            stk = new int[sz];
            mxId = new int[sz];
            endU = new int[sz];
            endV = new int[sz];
            rev = new boolean[sz];
            w = new long[sz];
            Arrays.fill(w, -1L);
            for (int i = 1; i < sz; i++) mxId[i] = i;
        }

        boolean isRoot(int x) {
            int p = fa[x];
            return lc[p] != x && rc[p] != x;
        }

        void pull(int x) {
            mxId[x] = x;
            int l = lc[x], r = rc[x];
            if (l != 0 && w[mxId[l]] > w[mxId[x]]) mxId[x] = mxId[l];
            if (r != 0 && w[mxId[r]] > w[mxId[x]]) mxId[x] = mxId[r];
        }

        void pushRev(int x) {
            if (x == 0) return;
            int t = lc[x];
            lc[x] = rc[x];
            rc[x] = t;
            rev[x] = !rev[x];
        }

        void push(int x) {
            if (rev[x]) {
                pushRev(lc[x]);
                pushRev(rc[x]);
                rev[x] = false;
            }
        }

        void rotate(int x) {
            int y = fa[x], z = fa[y];
            boolean xr = (rc[y] == x);
            if (!isRoot(y)) {
                if (rc[z] == y) rc[z] = x;
                else lc[z] = x;
            }
            fa[x] = z;
            int c = xr ? lc[x] : rc[x];
            if (xr) rc[y] = c;
            else lc[y] = c;
            if (c != 0) fa[c] = y;
            if (xr) lc[x] = y;
            else rc[x] = y;
            fa[y] = x;
            pull(y);
            pull(x);
        }

        void splay(int x) {
            int top = 0, cur = x;
            stk[top++] = cur;
            while (!isRoot(cur)) {
                cur = fa[cur];
                stk[top++] = cur;
            }
            while (top > 0) push(stk[--top]);
            while (!isRoot(x)) {
                int y = fa[x], z = fa[y];
                if (!isRoot(y)) {
                    rotate(((rc[y] == x) == (rc[z] == y)) ? y : x);
                }
                rotate(x);
            }
        }

        void access(int x) {
            for (int y = 0; x != 0; y = x, x = fa[x]) {
                splay(x);
                rc[x] = y;
                pull(x);
            }
        }

        void makeRoot(int x) {
            access(x);
            splay(x);
            pushRev(x);
        }

        int findRoot(int x) {
            access(x);
            splay(x);
            while (lc[x] != 0) {
                push(x);
                x = lc[x];
            }
            splay(x);
            return x;
        }

        void link(int u, int v) {
            makeRoot(u);
            fa[u] = v;
        }

        void cut(int u, int v) {
            makeRoot(u);
            access(v);
            splay(v);
            lc[v] = fa[u] = 0;
            pull(v);
        }
    }

    public static void main(String[] args) throws IOException {
        FastScanner fs = new FastScanner(System.in);
        long nLong = fs.nextLong();
        if (nLong == Long.MIN_VALUE) return;
        int n = (int) nLong;
        int q = fs.nextInt();

        EdgeLCT lct = new EdgeLCT(n, q);
        long mstWeight = 0;
        int edgeCnt = 0;
        int nextId = n;
        StringBuilder sb = new StringBuilder();

        while (q-- > 0) {
            int type = fs.nextInt();
            if (type == 1) {
                int u = fs.nextInt();
                int v = fs.nextInt();
                long wt = fs.nextLong();
                if (lct.findRoot(u) != lct.findRoot(v)) {
                    int e = ++nextId;
                    lct.w[e] = wt;
                    lct.endU[e] = u;
                    lct.endV[e] = v;
                    lct.link(u, e);
                    lct.link(v, e);
                    mstWeight += wt;
                    edgeCnt++;
                } else {
                    lct.makeRoot(u);
                    lct.access(v);
                    lct.splay(v);
                    int mx = lct.mxId[v];
                    if (lct.w[mx] > wt) {
                        lct.cut(lct.endU[mx], mx);
                        lct.cut(lct.endV[mx], mx);
                        mstWeight += wt - lct.w[mx];
                        int e = ++nextId;
                        lct.w[e] = wt;
                        lct.endU[e] = u;
                        lct.endV[e] = v;
                        lct.link(u, e);
                        lct.link(v, e);
                    }
                }
            } else {
                sb.append(edgeCnt == n - 1 ? mstWeight : -1L).append('\\n');
            }
        }
        System.out.print(sb);
    }
}
`,
        python3: `import sys

sys.setrecursionlimit(200000)


class EdgeLCT:
    def __init__(self, n: int, max_edges: int) -> None:
        sz = n + max_edges + 1
        self.fa = [0] * sz
        self.lc = [0] * sz
        self.rc = [0] * sz
        self.rev = [False] * sz
        self.mx_id = list(range(sz))
        self.end_u = [0] * sz
        self.end_v = [0] * sz
        self.w = [-1] * sz

    def _is_root(self, x: int) -> bool:
        p = self.fa[x]
        return self.lc[p] != x and self.rc[p] != x

    def _pull(self, x: int) -> None:
        mx = x
        l = self.lc[x]
        r = self.rc[x]
        if l and self.w[self.mx_id[l]] > self.w[mx]:
            mx = self.mx_id[l]
        if r and self.w[self.mx_id[r]] > self.w[mx]:
            mx = self.mx_id[r]
        self.mx_id[x] = mx

    def _push_rev(self, x: int) -> None:
        if x:
            self.lc[x], self.rc[x] = self.rc[x], self.lc[x]
            self.rev[x] = not self.rev[x]

    def _push(self, x: int) -> None:
        if self.rev[x]:
            self._push_rev(self.lc[x])
            self._push_rev(self.rc[x])
            self.rev[x] = False

    def _rotate(self, x: int) -> None:
        y = self.fa[x]
        z = self.fa[y]
        xr = self.rc[y] == x
        if not self._is_root(y):
            if self.rc[z] == y:
                self.rc[z] = x
            else:
                self.lc[z] = x
        self.fa[x] = z
        if xr:
            c = self.lc[x]
            self.rc[y] = c
            self.lc[x] = y
        else:
            c = self.rc[x]
            self.lc[y] = c
            self.rc[x] = y
        if c:
            self.fa[c] = y
        self.fa[y] = x
        self._pull(y)
        self._pull(x)

    def splay(self, x: int) -> None:
        stk = [x]
        cur = x
        while not self._is_root(cur):
            cur = self.fa[cur]
            stk.append(cur)
        while stk:
            self._push(stk.pop())
        while not self._is_root(x):
            y = self.fa[x]
            z = self.fa[y]
            if not self._is_root(y):
                same = (self.rc[y] == x) == (self.rc[z] == y)
                self._rotate(y if same else x)
            self._rotate(x)

    def access(self, x: int) -> None:
        y = 0
        while x:
            self.splay(x)
            self.rc[x] = y
            self._pull(x)
            y = x
            x = self.fa[x]

    def make_root(self, x: int) -> None:
        self.access(x)
        self.splay(x)
        self._push_rev(x)

    def find_root(self, x: int) -> int:
        self.access(x)
        self.splay(x)
        while self.lc[x]:
            self._push(x)
            x = self.lc[x]
        self.splay(x)
        return x

    def link(self, u: int, v: int) -> None:
        self.make_root(u)
        self.fa[u] = v

    def cut(self, u: int, v: int) -> None:
        self.make_root(u)
        self.access(v)
        self.splay(v)
        self.lc[v] = 0
        self.fa[u] = 0
        self._pull(v)


def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    n = int(next(it))
    q = int(next(it))
    lct = EdgeLCT(n, q)
    mst_weight = 0
    edge_cnt = 0
    next_id = n
    out: list[str] = []

    for _ in range(q):
        t = int(next(it))
        if t == 1:
            u = int(next(it))
            v = int(next(it))
            wt = int(next(it))
            if lct.find_root(u) != lct.find_root(v):
                next_id += 1
                e = next_id
                lct.w[e] = wt
                lct.end_u[e] = u
                lct.end_v[e] = v
                lct.link(u, e)
                lct.link(v, e)
                mst_weight += wt
                edge_cnt += 1
            else:
                lct.make_root(u)
                lct.access(v)
                lct.splay(v)
                mx = lct.mx_id[v]
                if lct.w[mx] > wt:
                    lct.cut(lct.end_u[mx], mx)
                    lct.cut(lct.end_v[mx], mx)
                    mst_weight += wt - lct.w[mx]
                    next_id += 1
                    e = next_id
                    lct.w[e] = wt
                    lct.end_u[e] = u
                    lct.end_v[e] = v
                    lct.link(u, e)
                    lct.link(v, e)
        else:
            out.append(str(mst_weight if edge_cnt == n - 1 else -1))

    sys.stdout.write("\\n".join(out) + ("\\n" if out else ""))


if __name__ == "__main__":
    solve()
`,
        ruby: `class EdgeLCT
  attr_accessor :mx_id, :end_u, :end_v, :w

  def initialize(n, max_edges)
    sz = n + max_edges + 1
    @fa = Array.new(sz, 0)
    @lc = Array.new(sz, 0)
    @rc = Array.new(sz, 0)
    @rev = Array.new(sz, false)
    @mx_id = (0...sz).to_a
    @end_u = Array.new(sz, 0)
    @end_v = Array.new(sz, 0)
    @w = Array.new(sz, -1)
  end

  def is_root(x)
    p = @fa[x]
    @lc[p] != x && @rc[p] != x
  end

  def pull(x)
    mx = x
    l = @lc[x]
    r = @rc[x]
    mx = @mx_id[l] if l != 0 && @w[@mx_id[l]] > @w[mx]
    mx = @mx_id[r] if r != 0 && @w[@mx_id[r]] > @w[mx]
    @mx_id[x] = mx
  end

  def push_rev(x)
    return if x == 0

    @lc[x], @rc[x] = @rc[x], @lc[x]
    @rev[x] = !@rev[x]
  end

  def push(x)
    return unless @rev[x]

    push_rev(@lc[x])
    push_rev(@rc[x])
    @rev[x] = false
  end

  def rotate(x)
    y = @fa[x]
    z = @fa[y]
    xr = (@rc[y] == x)
    unless is_root(y)
      if @rc[z] == y
        @rc[z] = x
      else
        @lc[z] = x
      end
    end
    @fa[x] = z
    if xr
      c = @lc[x]
      @rc[y] = c
      @lc[x] = y
    else
      c = @rc[x]
      @lc[y] = c
      @rc[x] = y
    end
    @fa[c] = y if c != 0
    @fa[y] = x
    pull(y)
    pull(x)
  end

  def splay(x)
    stk = [x]
    cur = x
    until is_root(cur)
      cur = @fa[cur]
      stk << cur
    end
    push(stk.pop) until stk.empty?

    until is_root(x)
      y = @fa[x]
      z = @fa[y]
      unless is_root(y)
        rotate((@rc[y] == x) == (@rc[z] == y) ? y : x)
      end
      rotate(x)
    end
  end

  def access(x)
    y = 0
    while x != 0
      splay(x)
      @rc[x] = y
      pull(x)
      y = x
      x = @fa[x]
    end
  end

  def make_root(x)
    access(x)
    splay(x)
    push_rev(x)
  end

  def find_root(x)
    access(x)
    splay(x)
    while @lc[x] != 0
      push(x)
      x = @lc[x]
    end
    splay(x)
    x
  end

  def link(u, v)
    make_root(u)
    @fa[u] = v
  end

  def cut(u, v)
    make_root(u)
    access(v)
    splay(v)
    @lc[v] = 0
    @fa[u] = 0
    pull(v)
  end
end

data = $stdin.read.split
exit if data.empty?
idx = 0
n = data[idx].to_i; idx += 1
q = data[idx].to_i; idx += 1

lct = EdgeLCT.new(n, q)
mst_weight = 0
edge_cnt = 0
next_id = n
out = []

q.times do
  t = data[idx].to_i; idx += 1
  if t == 1
    u = data[idx].to_i; idx += 1
    v = data[idx].to_i; idx += 1
    wt = data[idx].to_i; idx += 1
    if lct.find_root(u) != lct.find_root(v)
      next_id += 1
      e = next_id
      lct.w[e] = wt
      lct.end_u[e] = u
      lct.end_v[e] = v
      lct.link(u, e)
      lct.link(v, e)
      mst_weight += wt
      edge_cnt += 1
    else
      lct.make_root(u)
      lct.access(v)
      lct.splay(v)
      mx = lct.mx_id[v]
      if lct.w[mx] > wt
        lct.cut(lct.end_u[mx], mx)
        lct.cut(lct.end_v[mx], mx)
        mst_weight += wt - lct.w[mx]
        next_id += 1
        e = next_id
        lct.w[e] = wt
        lct.end_u[e] = u
        lct.end_v[e] = v
        lct.link(u, e)
        lct.link(v, e)
      end
    end
  else
    out << (edge_cnt == n - 1 ? mst_weight : -1).to_s
  end
end

puts out.join("\\n") unless out.empty?
`,
      },
    },
    {
      id: 'ch69-p3',
      tier: 'Boss',
      ratingRange: '2750–3150',
      title: 'Dynamic Subtree Size & Virtual-Subtree Aggregates',
      statement:
        'Maintain a dynamic forest of N nodes (1..N) with initial values a_1..a_N and initially no edges. Process Q operations: (1 u v) link u and v if disconnected; (2 u v) cut edge (u, v) if present; (3 u x) set node value a_u = x; (4 u p) if p == 0 output total (size sum) of u’s connected component, otherwise root u’s component at p and output (subtree_size subtree_sum) of u’s subtree away from p.',
      constraints: '1 <= N, Q <= 10^5; 0 <= a_i, x <= 10^9; whenever p != 0, p and u are in the same component',
      sampleInput: `5 7
10 20 30 40 50
1 1 2
1 2 3
1 2 4
1 4 5
4 2 1
2 2 4
4 2 1`,
      sampleOutput: `4 140
2 50`,
      hints: [
        'Each node stores both total splay-subtree aggregates (sub_sz, sub_sum) and virtual-child aggregates (vir_sz, vir_sum).',
        'In access(x), whenever preferred right child ch[x][1] is replaced by y, add sub[ch[x][1]] to vir[x] and subtract sub[y] from vir[x].',
        'In link(u, v), makeRoot(u) AND makeRoot(v) first so v has no lazy parent above it, then set fa[u] = v, vir[v] += sub[u], pull(v). To query u rooted at p, makeRoot(p); access(u); the subtree of u away from p is exactly (1 + vir_sz[u], val[u] + vir_sum[u])!',
      ],
      solutions: {
        cpp20: `#include <algorithm>
#include <array>
#include <iostream>
#include <vector>

using namespace std;

struct SubtreeLCT {
    vector<int> fa, rev;
    vector<array<int, 2>> ch;
    vector<long long> val, subSz, virSz, subSum, virSum;

    explicit SubtreeLCT(int n)
        : fa(n + 1, 0),
          rev(n + 1, 0),
          ch(n + 1, {0, 0}),
          val(n + 1, 0),
          subSz(n + 1, 1),
          virSz(n + 1, 0),
          subSum(n + 1, 0),
          virSum(n + 1, 0) {
        subSz[0] = 0;
    }

    bool isRoot(int x) const {
        return ch[fa[x]][0] != x && ch[fa[x]][1] != x;
    }

    void pull(int x) {
        int l = ch[x][0], r = ch[x][1];
        subSz[x] = subSz[l] + subSz[r] + virSz[x] + 1;
        subSum[x] = subSum[l] + subSum[r] + virSum[x] + val[x];
    }

    void pushRev(int x) {
        if (!x) return;
        swap(ch[x][0], ch[x][1]);
        rev[x] ^= 1;
    }

    void push(int x) {
        if (rev[x]) {
            pushRev(ch[x][0]);
            pushRev(ch[x][1]);
            rev[x] = 0;
        }
    }

    void pushAll(int x) {
        if (!isRoot(x)) pushAll(fa[x]);
        push(x);
    }

    void rotate(int x) {
        int y = fa[x], z = fa[y];
        int k = (ch[y][1] == x);
        if (!isRoot(y)) ch[z][ch[z][1] == y] = x;
        fa[x] = z;
        ch[y][k] = ch[x][k ^ 1];
        if (ch[x][k ^ 1]) fa[ch[x][k ^ 1]] = y;
        ch[x][k ^ 1] = y;
        fa[y] = x;
        pull(y);
        pull(x);
    }

    void splay(int x) {
        pushAll(x);
        while (!isRoot(x)) {
            int y = fa[x], z = fa[y];
            if (!isRoot(y)) {
                rotate(((ch[y][1] == x) ^ (ch[z][1] == y)) ? x : y);
            }
            rotate(x);
        }
    }

    void access(int x) {
        for (int y = 0; x; y = x, x = fa[x]) {
            splay(x);
            int r = ch[x][1];
            virSz[x] += subSz[r] - subSz[y];
            virSum[x] += subSum[r] - subSum[y];
            ch[x][1] = y;
            pull(x);
        }
    }

    void makeRoot(int x) {
        access(x);
        splay(x);
        pushRev(x);
    }

    int findRoot(int x) {
        access(x);
        splay(x);
        while (ch[x][0]) {
            push(x);
            x = ch[x][0];
        }
        splay(x);
        return x;
    }

    void link(int u, int v) {
        makeRoot(u);
        if (findRoot(v) != u) {
            makeRoot(v);
            fa[u] = v;
            virSz[v] += subSz[u];
            virSum[v] += subSum[u];
            pull(v);
        }
    }

    void cut(int u, int v) {
        makeRoot(u);
        if (findRoot(v) == u && fa[v] == u && ch[v][0] == 0) {
            fa[v] = ch[u][1] = 0;
            pull(u);
        }
    }

    void pointSet(int u, long long x) {
        access(u);
        splay(u);
        val[u] = x;
        pull(u);
    }

    pair<long long, long long> querySubtree(int u, int p) {
        if (p == 0 || p == u) {
            makeRoot(u);
            return {subSz[u], subSum[u]};
        }
        makeRoot(p);
        access(u);
        return {1 + virSz[u], val[u] + virSum[u]};
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, q;
    if (!(cin >> n >> q)) return 0;

    SubtreeLCT lct(n);
    for (int i = 1; i <= n; ++i) {
        cin >> lct.val[i];
        lct.subSum[i] = lct.val[i];
    }

    while (q--) {
        int t, u;
        long long x;
        cin >> t >> u >> x;
        if (t == 1) lct.link(u, static_cast<int>(x));
        else if (t == 2) lct.cut(u, static_cast<int>(x));
        else if (t == 3) lct.pointSet(u, x);
        else {
            auto res = lct.querySubtree(u, static_cast<int>(x));
            cout << res.first << ' ' << res.second << "\\n";
        }
    }
    return 0;
}
`,
        rust: `use std::io::{self, Read};

struct SubtreeLCT {
    fa: Vec<usize>,
    ch: Vec<[usize; 2]>,
    rev: Vec<bool>,
    val: Vec<i64>,
    sub_sz: Vec<i64>,
    vir_sz: Vec<i64>,
    sub_sum: Vec<i64>,
    vir_sum: Vec<i64>,
}

impl SubtreeLCT {
    fn new(n: usize) -> Self {
        let mut sub_sz = vec![1i64; n + 1];
        sub_sz[0] = 0;
        Self {
            fa: vec![0; n + 1],
            ch: vec![[0, 0]; n + 1],
            rev: vec![false; n + 1],
            val: vec![0; n + 1],
            sub_sz,
            vir_sz: vec![0; n + 1],
            sub_sum: vec![0; n + 1],
            vir_sum: vec![0; n + 1],
        }
    }

    fn is_root(&self, x: usize) -> bool {
        let p = self.fa[x];
        self.ch[p][0] != x && self.ch[p][1] != x
    }

    fn pull(&mut self, x: usize) {
        let l = self.ch[x][0];
        let r = self.ch[x][1];
        self.sub_sz[x] = self.sub_sz[l] + self.sub_sz[r] + self.vir_sz[x] + 1;
        self.sub_sum[x] = self.sub_sum[l] + self.sub_sum[r] + self.vir_sum[x] + self.val[x];
    }

    fn push_rev(&mut self, x: usize) {
        if x != 0 {
            self.ch[x].swap(0, 1);
            self.rev[x] = !self.rev[x];
        }
    }

    fn push(&mut self, x: usize) {
        if self.rev[x] {
            let l = self.ch[x][0];
            let r = self.ch[x][1];
            self.push_rev(l);
            self.push_rev(r);
            self.rev[x] = false;
        }
    }

    fn push_all(&mut self, x: usize) {
        let mut stk = Vec::new();
        let mut cur = x;
        while !self.is_root(cur) {
            stk.push(cur);
            cur = self.fa[cur];
        }
        stk.push(cur);
        while let Some(u) = stk.pop() {
            self.push(u);
        }
    }

    fn rotate(&mut self, x: usize) {
        let y = self.fa[x];
        let z = self.fa[y];
        let k = usize::from(self.ch[y][1] == x);
        if !self.is_root(y) {
            let zk = usize::from(self.ch[z][1] == y);
            self.ch[z][zk] = x;
        }
        self.fa[x] = z;
        let c = self.ch[x][k ^ 1];
        self.ch[y][k] = c;
        if c != 0 {
            self.fa[c] = y;
        }
        self.ch[x][k ^ 1] = y;
        self.fa[y] = x;
        self.pull(y);
        self.pull(x);
    }

    fn splay(&mut self, x: usize) {
        self.push_all(x);
        while !self.is_root(x) {
            let y = self.fa[x];
            let z = self.fa[y];
            if !self.is_root(y) {
                let same = (self.ch[y][1] == x) == (self.ch[z][1] == y);
                self.rotate(if same { y } else { x });
            }
            self.rotate(x);
        }
    }

    fn access(&mut self, mut x: usize) {
        let mut y = 0;
        while x != 0 {
            self.splay(x);
            let r = self.ch[x][1];
            self.vir_sz[x] += self.sub_sz[r] - self.sub_sz[y];
            self.vir_sum[x] += self.sub_sum[r] - self.sub_sum[y];
            self.ch[x][1] = y;
            self.pull(x);
            y = x;
            x = self.fa[x];
        }
    }

    fn make_root(&mut self, x: usize) {
        self.access(x);
        self.splay(x);
        self.push_rev(x);
    }

    fn find_root(&mut self, mut x: usize) -> usize {
        self.access(x);
        self.splay(x);
        while self.ch[x][0] != 0 {
            self.push(x);
            x = self.ch[x][0];
        }
        self.splay(x);
        x
    }

    fn link(&mut self, u: usize, v: usize) {
        self.make_root(u);
        if self.find_root(v) != u {
            self.make_root(v);
            self.fa[u] = v;
            self.vir_sz[v] += self.sub_sz[u];
            self.vir_sum[v] += self.sub_sum[u];
            self.pull(v);
        }
    }

    fn cut(&mut self, u: usize, v: usize) {
        self.make_root(u);
        if self.find_root(v) == u && self.fa[v] == u && self.ch[v][0] == 0 {
            self.fa[v] = 0;
            self.ch[u][1] = 0;
            self.pull(u);
        }
    }

    fn point_set(&mut self, u: usize, x: i64) {
        self.access(u);
        self.splay(u);
        self.val[u] = x;
        self.pull(u);
    }

    fn query_subtree(&mut self, u: usize, p: usize) -> (i64, i64) {
        if p == 0 || p == u {
            self.make_root(u);
            return (self.sub_sz[u], self.sub_sum[u]);
        }
        self.make_root(p);
        self.access(u);
        (1 + self.vir_sz[u], self.val[u] + self.vir_sum[u])
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

    let mut lct = SubtreeLCT::new(n);
    for i in 1..=n {
        let v: i64 = it.next().unwrap().parse().unwrap();
        lct.val[i] = v;
        lct.sub_sum[i] = v;
    }

    let mut out = String::new();
    for _ in 0..q {
        let t: usize = it.next().unwrap().parse().unwrap();
        let u: usize = it.next().unwrap().parse().unwrap();
        let x: i64 = it.next().unwrap().parse().unwrap();
        match t {
            1 => lct.link(u, x as usize),
            2 => lct.cut(u, x as usize),
            3 => lct.point_set(u, x),
            _ => {
                let (sz, s) = lct.query_subtree(u, x as usize);
                out.push_str(&format!("{sz} {s}\\n"));
            }
        }
    }
    print!("{out}");
}
`,
        java21: `import java.io.IOException;
import java.io.InputStream;

public class Main {
    static class FastScanner {
        private final InputStream in;
        private final byte[] buf = new byte[1 << 16];
        private int ptr = 0, len = 0;

        FastScanner(InputStream in) {
            this.in = in;
        }

        private int readByte() throws IOException {
            if (ptr >= len) {
                len = in.read(buf);
                ptr = 0;
                if (len <= 0) return -1;
            }
            return buf[ptr++];
        }

        long nextLong() throws IOException {
            int c = readByte();
            while (c != -1 && c <= ' ') c = readByte();
            if (c == -1) return Long.MIN_VALUE;
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

        int nextInt() throws IOException {
            return (int) nextLong();
        }
    }

    static class SubtreeLCT {
        final int[] fa, lc, rc, stk;
        final boolean[] rev;
        final long[] val, subSz, virSz, subSum, virSum;

        SubtreeLCT(int n) {
            fa = new int[n + 1];
            lc = new int[n + 1];
            rc = new int[n + 1];
            stk = new int[n + 1];
            rev = new boolean[n + 1];
            val = new long[n + 1];
            subSz = new long[n + 1];
            virSz = new long[n + 1];
            subSum = new long[n + 1];
            virSum = new long[n + 1];
            for (int i = 1; i <= n; i++) subSz[i] = 1;
        }

        boolean isRoot(int x) {
            int p = fa[x];
            return lc[p] != x && rc[p] != x;
        }

        void pull(int x) {
            subSz[x] = subSz[lc[x]] + subSz[rc[x]] + virSz[x] + 1;
            subSum[x] = subSum[lc[x]] + subSum[rc[x]] + virSum[x] + val[x];
        }

        void pushRev(int x) {
            if (x == 0) return;
            int t = lc[x];
            lc[x] = rc[x];
            rc[x] = t;
            rev[x] = !rev[x];
        }

        void push(int x) {
            if (rev[x]) {
                pushRev(lc[x]);
                pushRev(rc[x]);
                rev[x] = false;
            }
        }

        void rotate(int x) {
            int y = fa[x], z = fa[y];
            boolean xr = (rc[y] == x);
            if (!isRoot(y)) {
                if (rc[z] == y) rc[z] = x;
                else lc[z] = x;
            }
            fa[x] = z;
            int c = xr ? lc[x] : rc[x];
            if (xr) rc[y] = c;
            else lc[y] = c;
            if (c != 0) fa[c] = y;
            if (xr) lc[x] = y;
            else rc[x] = y;
            fa[y] = x;
            pull(y);
            pull(x);
        }

        void splay(int x) {
            int top = 0, cur = x;
            stk[top++] = cur;
            while (!isRoot(cur)) {
                cur = fa[cur];
                stk[top++] = cur;
            }
            while (top > 0) push(stk[--top]);
            while (!isRoot(x)) {
                int y = fa[x], z = fa[y];
                if (!isRoot(y)) {
                    rotate(((rc[y] == x) == (rc[z] == y)) ? y : x);
                }
                rotate(x);
            }
        }

        void access(int x) {
            for (int y = 0; x != 0; y = x, x = fa[x]) {
                splay(x);
                int r = rc[x];
                virSz[x] += subSz[r] - subSz[y];
                virSum[x] += subSum[r] - subSum[y];
                rc[x] = y;
                pull(x);
            }
        }

        void makeRoot(int x) {
            access(x);
            splay(x);
            pushRev(x);
        }

        int findRoot(int x) {
            access(x);
            splay(x);
            while (lc[x] != 0) {
                push(x);
                x = lc[x];
            }
            splay(x);
            return x;
        }

        void link(int u, int v) {
            makeRoot(u);
            if (findRoot(v) != u) {
                makeRoot(v);
                fa[u] = v;
                virSz[v] += subSz[u];
                virSum[v] += subSum[u];
                pull(v);
            }
        }

        void cut(int u, int v) {
            makeRoot(u);
            if (findRoot(v) == u && fa[v] == u && lc[v] == 0) {
                fa[v] = rc[u] = 0;
                pull(u);
            }
        }

        void pointSet(int u, long x) {
            access(u);
            splay(u);
            val[u] = x;
            pull(u);
        }
    }

    public static void main(String[] args) throws IOException {
        FastScanner fs = new FastScanner(System.in);
        long nLong = fs.nextLong();
        if (nLong == Long.MIN_VALUE) return;
        int n = (int) nLong;
        int q = fs.nextInt();

        SubtreeLCT lct = new SubtreeLCT(n);
        for (int i = 1; i <= n; i++) {
            lct.val[i] = fs.nextLong();
            lct.subSum[i] = lct.val[i];
        }

        StringBuilder sb = new StringBuilder();
        while (q-- > 0) {
            int t = fs.nextInt();
            int u = fs.nextInt();
            long x = fs.nextLong();
            if (t == 1) lct.link(u, (int) x);
            else if (t == 2) lct.cut(u, (int) x);
            else if (t == 3) lct.pointSet(u, x);
            else {
                int p = (int) x;
                if (p == 0 || p == u) {
                    lct.makeRoot(u);
                    sb.append(lct.subSz[u]).append(' ').append(lct.subSum[u]).append('\\n');
                } else {
                    lct.makeRoot(p);
                    lct.access(u);
                    sb.append(1 + lct.virSz[u]).append(' ').append(lct.val[u] + lct.virSum[u]).append('\\n');
                }
            }
        }
        System.out.print(sb);
    }
}
`,
        python3: `import sys

sys.setrecursionlimit(200000)


class SubtreeLCT:
    def __init__(self, n: int) -> None:
        self.fa = [0] * (n + 1)
        self.lc = [0] * (n + 1)
        self.rc = [0] * (n + 1)
        self.rev = [False] * (n + 1)
        self.val = [0] * (n + 1)
        self.sub_sz = [1] * (n + 1)
        self.sub_sz[0] = 0
        self.vir_sz = [0] * (n + 1)
        self.sub_sum = [0] * (n + 1)
        self.vir_sum = [0] * (n + 1)

    def _is_root(self, x: int) -> bool:
        p = self.fa[x]
        return self.lc[p] != x and self.rc[p] != x

    def _pull(self, x: int) -> None:
        l = self.lc[x]
        r = self.rc[x]
        self.sub_sz[x] = self.sub_sz[l] + self.sub_sz[r] + self.vir_sz[x] + 1
        self.sub_sum[x] = self.sub_sum[l] + self.sub_sum[r] + self.vir_sum[x] + self.val[x]

    def _push_rev(self, x: int) -> None:
        if x:
            self.lc[x], self.rc[x] = self.rc[x], self.lc[x]
            self.rev[x] = not self.rev[x]

    def _push(self, x: int) -> None:
        if self.rev[x]:
            self._push_rev(self.lc[x])
            self._push_rev(self.rc[x])
            self.rev[x] = False

    def _rotate(self, x: int) -> None:
        y = self.fa[x]
        z = self.fa[y]
        xr = self.rc[y] == x
        if not self._is_root(y):
            if self.rc[z] == y:
                self.rc[z] = x
            else:
                self.lc[z] = x
        self.fa[x] = z
        if xr:
            c = self.lc[x]
            self.rc[y] = c
            self.lc[x] = y
        else:
            c = self.rc[x]
            self.lc[y] = c
            self.rc[x] = y
        if c:
            self.fa[c] = y
        self.fa[y] = x
        self._pull(y)
        self._pull(x)

    def splay(self, x: int) -> None:
        stk = [x]
        cur = x
        while not self._is_root(cur):
            cur = self.fa[cur]
            stk.append(cur)
        while stk:
            self._push(stk.pop())
        while not self._is_root(x):
            y = self.fa[x]
            z = self.fa[y]
            if not self._is_root(y):
                same = (self.rc[y] == x) == (self.rc[z] == y)
                self._rotate(y if same else x)
            self._rotate(x)

    def access(self, x: int) -> None:
        y = 0
        while x:
            self.splay(x)
            r = self.rc[x]
            self.vir_sz[x] += self.sub_sz[r] - self.sub_sz[y]
            self.vir_sum[x] += self.sub_sum[r] - self.sub_sum[y]
            self.rc[x] = y
            self._pull(x)
            y = x
            x = self.fa[x]

    def make_root(self, x: int) -> None:
        self.access(x)
        self.splay(x)
        self._push_rev(x)

    def find_root(self, x: int) -> int:
        self.access(x)
        self.splay(x)
        while self.lc[x]:
            self._push(x)
            x = self.lc[x]
        self.splay(x)
        return x

    def link(self, u: int, v: int) -> None:
        self.make_root(u)
        if self.find_root(v) != u:
            self.make_root(v)
            self.fa[u] = v
            self.vir_sz[v] += self.sub_sz[u]
            self.vir_sum[v] += self.sub_sum[u]
            self._pull(v)

    def cut(self, u: int, v: int) -> None:
        self.make_root(u)
        if self.find_root(v) == u and self.fa[v] == u and self.lc[v] == 0:
            self.fa[v] = 0
            self.rc[u] = 0
            self._pull(u)

    def point_set(self, u: int, x: int) -> None:
        self.access(u)
        self.splay(u)
        self.val[u] = x
        self._pull(u)

    def query_subtree(self, u: int, p: int) -> tuple[int, int]:
        if p == 0 or p == u:
            self.make_root(u)
            return self.sub_sz[u], self.sub_sum[u]
        self.make_root(p)
        self.access(u)
        return 1 + self.vir_sz[u], self.val[u] + self.vir_sum[u]


def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    n = int(next(it))
    q = int(next(it))
    lct = SubtreeLCT(n)
    for i in range(1, n + 1):
        v = int(next(it))
        lct.val[i] = v
        lct.sub_sum[i] = v

    out: list[str] = []
    for _ in range(q):
        t = int(next(it))
        u = int(next(it))
        x = int(next(it))
        if t == 1:
            lct.link(u, x)
        elif t == 2:
            lct.cut(u, x)
        elif t == 3:
            lct.point_set(u, x)
        else:
            sz, s = lct.query_subtree(u, x)
            out.append(f"{sz} {s}")
    sys.stdout.write("\\n".join(out) + ("\\n" if out else ""))


if __name__ == "__main__":
    solve()
`,
        ruby: `class SubtreeLCT
  attr_accessor :val, :sub_sum

  def initialize(n)
    @fa = Array.new(n + 1, 0)
    @lc = Array.new(n + 1, 0)
    @rc = Array.new(n + 1, 0)
    @rev = Array.new(n + 1, false)
    @val = Array.new(n + 1, 0)
    @sub_sz = Array.new(n + 1, 1)
    @sub_sz[0] = 0
    @vir_sz = Array.new(n + 1, 0)
    @sub_sum = Array.new(n + 1, 0)
    @vir_sum = Array.new(n + 1, 0)
  end

  def is_root(x)
    p = @fa[x]
    @lc[p] != x && @rc[p] != x
  end

  def pull(x)
    l = @lc[x]
    r = @rc[x]
    @sub_sz[x] = @sub_sz[l] + @sub_sz[r] + @vir_sz[x] + 1
    @sub_sum[x] = @sub_sum[l] + @sub_sum[r] + @vir_sum[x] + @val[x]
  end

  def push_rev(x)
    return if x == 0

    @lc[x], @rc[x] = @rc[x], @lc[x]
    @rev[x] = !@rev[x]
  end

  def push(x)
    return unless @rev[x]

    push_rev(@lc[x])
    push_rev(@rc[x])
    @rev[x] = false
  end

  def rotate(x)
    y = @fa[x]
    z = @fa[y]
    xr = (@rc[y] == x)
    unless is_root(y)
      if @rc[z] == y
        @rc[z] = x
      else
        @lc[z] = x
      end
    end
    @fa[x] = z
    if xr
      c = @lc[x]
      @rc[y] = c
      @lc[x] = y
    else
      c = @rc[x]
      @lc[y] = c
      @rc[x] = y
    end
    @fa[c] = y if c != 0
    @fa[y] = x
    pull(y)
    pull(x)
  end

  def splay(x)
    stk = [x]
    cur = x
    until is_root(cur)
      cur = @fa[cur]
      stk << cur
    end
    push(stk.pop) until stk.empty?

    until is_root(x)
      y = @fa[x]
      z = @fa[y]
      unless is_root(y)
        rotate((@rc[y] == x) == (@rc[z] == y) ? y : x)
      end
      rotate(x)
    end
  end

  def access(x)
    y = 0
    while x != 0
      splay(x)
      r = @rc[x]
      @vir_sz[x] += @sub_sz[r] - @sub_sz[y]
      @vir_sum[x] += @sub_sum[r] - @sub_sum[y]
      @rc[x] = y
      pull(x)
      y = x
      x = @fa[x]
    end
  end

  def make_root(x)
    access(x)
    splay(x)
    push_rev(x)
  end

  def find_root(x)
    access(x)
    splay(x)
    while @lc[x] != 0
      push(x)
      x = @lc[x]
    end
    splay(x)
    x
  end

  def link(u, v)
    make_root(u)
    if find_root(v) != u
      make_root(v)
      @fa[u] = v
      @vir_sz[v] += @sub_sz[u]
      @vir_sum[v] += @sub_sum[u]
      pull(v)
    end
  end

  def cut(u, v)
    make_root(u)
    if find_root(v) == u && @fa[v] == u && @lc[v] == 0
      @fa[v] = 0
      @rc[u] = 0
      pull(u)
    end
  end

  def point_set(u, x)
    access(u)
    splay(u)
    @val[u] = x
    pull(u)
  end

  def query_subtree(u, p)
    if p == 0 || p == u
      make_root(u)
      return [@sub_sz[u], @sub_sum[u]]
    end
    make_root(p)
    access(u)
    [1 + @vir_sz[u], @val[u] + @vir_sum[u]]
  end
end

data = $stdin.read.split
exit if data.empty?
idx = 0
n = data[idx].to_i; idx += 1
q = data[idx].to_i; idx += 1

lct = SubtreeLCT.new(n)
(1..n).each do |i|
  v = data[idx].to_i; idx += 1
  lct.val[i] = v
  lct.sub_sum[i] = v
end

out = []
q.times do
  t = data[idx].to_i; idx += 1
  u = data[idx].to_i; idx += 1
  x = data[idx].to_i; idx += 1
  if t == 1
    lct.link(u, x)
  elsif t == 2
    lct.cut(u, x)
  elsif t == 3
    lct.point_set(u, x)
  else
    sz, s = lct.query_subtree(u, x)
    out << "#{sz} #{s}"
  end
end

puts out.join("\\n") unless out.empty?
`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'Codeforces',
      title: 'Link-Cut Trees, Dynamic MST & Virtual Subtree Classics',
      difficulty: '2600–3000',
      url: 'https://codeforces.com/problemset?tags=data+structures,trees',
      patternNote: 'Edge-node dynamic MST and Top-Tree/virtual-sum rerooting queries in O(log N) amortized.',
    },
    {
      platform: 'CSES',
      title: 'Dynamic Tree Connectivity & Path Queries',
      difficulty: 'Hard',
      url: 'https://cses.fi/problemset/',
      patternNote: 'Online edge insertion/deletion bypassing offline DSU-with-rollback.',
    },
    {
      platform: 'AtCoder',
      title: 'ABC / AGC Dynamic Forest Queries',
      difficulty: '2600–2900',
      url: 'https://atcoder.jp/',
      patternNote: 'Maintain path extrema and virtual-child sums using splay-backed preferred paths.',
    },
  ],
  interviewNotes: [
    'Contrast Link-Cut Trees (O(log N) amortized online link/cut) against Euler-Tour HLD (O(log^2 N) static topology only) and DSU with Rollback (O(log^2 N) offline segment-tree timeline).',
    'Explain why auxiliary splay trees use parent pointers across dashed edges (one-way ch[p] != x) so access(v) cleanly knows when it hits the top of a preferred path.',
    'Demonstrate why Dynamic MST requires allocating explicit edge nodes: makeRoot flips parent-child directions arbitrarily, so storing edge weights on child endpoints breaks on rerooting.',
  ],
  projectBlueprint: {
    title: 'Dynamic Distributed Mesh-Network Failover & Live Topology Router',
    tagline: 'Real-time evolving spanning forest engine supporting instantaneous link failures, cable upgrades, and bottleneck audits',
    stackSummary: 'TypeScript Splay-Backed LCT Core + Edge-Node Dynamic MST Engine',
    asciiDiagram: [
      '+---------------------------------------------------------------+',
      '|  Live Network Events: link(u,v) | cut(u,v) | upgrade(u,v,w)  |',
      '|        |                                                      |',
      '|        +--> access(v) & splay(v) zips solid preferred path    |',
      '|        +--> edge-node argmax locates redundant heavy cycle    |',
      '|        v                                                      |',
      '|  O(log N) Amortized Failover Spanning Forest & Bandwidth Sums |',
      '+---------------------------------------------------------------+',
    ].join('\n'),
    milestones: [
      {
        id: 'm1',
        title: 'Auxiliary Splay Kernel & Lazy Rerooting',
        detail: 'Implement zig/zig-zag rotations, pushAll stack traversal, and O(1) lazy path reversals.',
      },
      {
        id: 'm2',
        title: 'Online Edge-Node Spanning Forest Replacer',
        detail: 'Detect cycle-closing lower-latency links and atomically sever the heaviest bottleneck cable.',
      },
      {
        id: 'm3',
        title: 'Virtual Subtree Telemetry Aggregator',
        detail: 'Track downstream node counts and load sums during live topology migrations.',
      },
    ],
    starterCode: `export class DynamicForest {
  fa: Int32Array;
  lc: Int32Array;
  rc: Int32Array;
  rev: Uint8Array;
  constructor(n: number) {
    this.fa = new Int32Array(n + 1);
    this.lc = new Int32Array(n + 1);
    this.rc = new Int32Array(n + 1);
    this.rev = new Uint8Array(n + 1);
  }
  isRoot(x: number): boolean {
    const p = this.fa[x];
    return this.lc[p] !== x && this.rc[p] !== x;
  }
}`,
  },
};
