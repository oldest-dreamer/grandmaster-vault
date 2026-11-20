import type { TheoryChapter } from '../../types/vault';

export const CH50_IMPLICIT_TREAP_ROPE: TheoryChapter = {
  slug: 'treap-implicit-rope',
  topicId: 'ds-11',
  title: 'Implicit Treap & Persistent Split-Merge Trees',
  domain: 'Data Structures',
  ratingTier: '2200–2600',
  usacoDivision: 'Platinum',
  subtitle:
    'Index dynamic sequences strictly by subtree size `sz` inside a randomized Cartesian Treap, slicing, splicing, inserting, deleting, and reversing arbitrary subsegments `[l, r]` in expected `O(log N)` via `split(t, k)` + `merge(l, r)` and lazy `rev` flags.',
  analogyTitle: 'The Magnetic Rope With Random Heights & Lazy Flip Stickers Analogy',
  analogyBody:
    'A standard Segment Tree freezes array indices forever—if you want to **cut out substring `[l, r]` and paste it at the end**, or **reverse `[l, r]`** while also inserting/deleting elements at arbitrary positions, array indices shift dynamically! An **Implicit Treap** stores NO explicit key—each node’s position `idx` equals `1 + sz[left]` (the count of elements to its left!). By pairing BST in-order sequence ordering with random heap priorities `prio`, the expected height stays **`O(log N)`** automatically! Every operation collapses to two tiny primitives: **`split(t, k)`** (scissors slicing the sequence into the first `k` nodes `L` and remaining nodes `R`) and **`merge(L, R)`** (zipping two sequences while respecting heap priorities). Want to reverse `[l, r]`? Split `t` into `A | B | C`, toggle **`B.rev ^= 1`** in `O(1)` (`push` swaps `B.left` and `B.right` lazily!), and merge `A + B + C` back together!',
  prerequisites: [
    {
      slug: 'lazy-propagation-segment-tree',
      title: 'Segment Tree with Lazy Propagation',
    },
  ],
  traceTitle: 'Interactive Implicit Treap Split-Reverse-Merge Trace',
  traceSubtitle:
    'Watch `split(root, k)` slice `[10, 20, 30, 40, 50]` into prefix `[10]`, middle `[20, 30, 40]`, suffix `[50]`, apply lazy `rev ^= 1` to reverse `[20..40]`, and re-merge in O(log N).',
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Step 1: Sequence Stored by Implicit Subtree Sizes sz[]',
      explanation:
        'Each node stores {val, prio, sz, sum, rev}. Node position is NEVER stored—it is computed on the fly from sz[left] during traversal!',
      mode: 'array',
      arrays: [
        {
          name: 'In-Order Sequence (Implicit Ranks 1..5)',
          cells: [
            { index: 1, value: 10, label: 'pos 1', highlight: 'neutral' },
            { index: 2, value: 20, label: 'pos 2', highlight: 'window' },
            { index: 3, value: 30, label: 'pos 3', highlight: 'window' },
            { index: 4, value: 40, label: 'pos 4', highlight: 'window' },
            { index: 5, value: 50, label: 'pos 5', highlight: 'neutral' },
          ],
        },
      ],
      variables: { TotalSize: 5, TotalSum: 150, Action: 'Reverse [2..4]' },
    },
    {
      stepNumber: 2,
      title: 'Step 2: Two Splits Isolate Target Segment B = [20, 30, 40]',
      explanation:
        'First split(root, 4) produces AB = [10,20,30,40] and C = [50]. Next split(AB, 1) produces A = [10] and B = [20,30,40] (with B.sz = 3, B.sum = 90). Always call push(t) BEFORE checking sz[left]!',
      mode: 'array',
      arrays: [
        {
          name: 'Three Isolated Treaps A | B | C',
          cells: [
            { index: 0, value: '[10]', label: 'A (sz=1)', highlight: 'neutral' },
            { index: 1, value: '[20, 30, 40]', label: 'B (sz=3)', highlight: 'active' },
            { index: 2, value: '[50]', label: 'C (sz=1)', highlight: 'neutral' },
          ],
        },
      ],
      variables: { Split1K: 4, Split2K: 1, TargetSumB: 90 },
    },
    {
      stepNumber: 3,
      title: 'Step 3: Toggle B.rev ^= 1 in O(1) & Merge A + B + C',
      explanation:
        'Toggle B.rev ^= 1 without touching internal nodes! Merging merge(merge(A, B), C) produces [10, 40, 30, 20, 50]. Whenever any future split/merge visits B, push(B) swaps B.left <-> B.right and XORs children.rev ^= 1!',
      mode: 'array',
      arrays: [
        {
          name: 'Merged Result After Lazy Reversal of [2..4]',
          cells: [
            { index: 1, value: 10, label: 'pos 1', highlight: 'neutral' },
            { index: 2, value: 40, label: 'flipped', highlight: 'updated' },
            { index: 3, value: 30, label: 'flipped', highlight: 'updated' },
            { index: 4, value: 20, label: 'flipped', highlight: 'updated' },
            { index: 5, value: 50, label: 'pos 5', highlight: 'neutral' },
          ],
        },
      ],
      variables: { ReversedSlice: '[40, 30, 20]', TimeComplexity: 'O(log N) expected' },
    },
  ],
  reductionClues: [
    {
      clue: '"Cut substring [a, b] and paste it at the end (or after index k) across 2*10^5 operations"',
      translation:
        '**Implicit Treap Cut-and-Splice**: `split(root, b)` -> `AB, C`, `split(AB, a - 1)` -> `A, B`, then `merge(merge(A, C), B)` moves `[a, b]` to the back in `O(log N)`!',
    },
    {
      clue: '"Reverse arbitrary subarrays [a, b] + maintain range sum / range max / insert / erase"',
      translation:
        '**Lazy `rev` Tag on Implicit Treap**: isolate `B = [a, b]` with two splits, toggle `B.rev ^= 1`, and re-merge! Make sure `push(t)` swaps children AND toggles `children.rev ^= 1` BEFORE `split`, `merge`, or reading `sz[left]`!',
    },
    {
      clue: '"Need Persistent / Undoable Rope versions after cut, paste, or copy operations"',
      translation:
        '**Persistent Treap Split & Merge**: inside `split` and `merge` (plus `push`!), clone every node before mutating its `l`, `r`, or `rev` fields, returning the new root in `O(log N)` new nodes per operation!',
    },
    {
      clue: '"Circular shift a subarray [l, r] right by k steps in O(log N)"',
      translation:
        'A right cyclic shift of `[l, r]` by `k` is simply splitting `B` into `[l .. r-k]` and `[r-k+1 .. r]` and merging them in swapped order (`B_right + B_left`)!',
    },
  ],
  timeComplexity: 'Split / Merge / Reverse / Insert / Erase / Query: O(log N) expected',
  spaceComplexity: 'Standard: O(N) nodes | Persistent: O((N + Q) log N) nodes',
  pitfalls: [
    {
      type: 'WA',
      title: 'Reading sz[left] in split() Before Calling push(t) to Propagate Lazy rev',
      detail:
        'If `t.rev == true`, `t.l` and `t.r` are STILL swapped! Reading `sz[t.l]` before calling `push(t)` measures the RIGHT child’s size instead of the LEFT child’s size, corrupting the entire split boundary! ALWAYS call `push(t)` as the very first line of `split(t, k)` AND `merge(l, r)`!',
    },
    {
      type: 'WA',
      title: 'Forgetting `pull(t)` After Reassigning Child Pointers in split() and merge()',
      detail:
        'Every time `split` or `merge` changes `t.l` or `t.r`, you MUST call `pull(t)` (`sz[t] = 1 + sz[l] + sz[r]; sum[t] = val[t] + sum[l] + sum[r]`) before returning so parent aggregates stay valid.',
    },
    {
      type: 'WA',
      title: 'Writing Non-Uniform `rand()` Priorities Instead of 32/64-Bit MT19937 Priorities',
      detail:
        'On Windows/older compilers, `rand()` only spans `[0..32767]`, causing frequent duplicate priorities and unbalanced trees! Always generate priorities from a 64-bit RNG (`splitmix64` / `mt19937_64` / `SplittableRandom`).',
    },
    {
      type: 'RE',
      title: 'Overflowing Array Bounds or Using Node 0 Without Fixed Sentinel Defaults',
      detail:
        'Reserve index `0` as the null sentinel with `sz[0] = 0`, `sum[0] = 0`, `l[0] = r[0] = 0`. Never call `push(0)` or `pull(0)` (`if (!t) return;`)!',
    },
  ],
  implementations: {
    cpp20: `#include <bits/stdc++.h>
using namespace std;

// Implicit Treap supporting O(log N) Cut-Paste, Lazy Range Reversal, and Range Sum
struct ImplicitTreap {
    struct Node {
        long long val = 0, sum = 0;
        uint64_t prio = 0;
        int sz = 0, l = 0, r = 0;
        bool rev = false;
    };

    vector<Node> tr;
    mt19937_64 rng;
    int root = 0;

    ImplicitTreap(int maxN) : rng(chrono::steady_clock::now().time_since_epoch().count()) {
        tr.reserve(maxN + 1);
        tr.push_back(Node{}); // 0 = null sentinel
    }

    int newNode(long long v) {
        int id = (int)tr.size();
        tr.push_back(Node{v, v, rng(), 1, 0, 0, false});
        return id;
    }

    void push(int t) {
        if (!t || !tr[t].rev) return;
        swap(tr[t].l, tr[t].r);
        if (tr[t].l) tr[tr[t].l].rev ^= 1;
        if (tr[t].r) tr[tr[t].r].rev ^= 1;
        tr[t].rev = false;
    }

    void pull(int t) {
        if (!t) return;
        tr[t].sz = 1 + tr[tr[t].l].sz + tr[tr[t].r].sz;
        tr[t].sum = tr[t].val + tr[tr[t].l].sum + tr[tr[t].r].sum;
    }

    // Splits t into left (first k elements) and right (rest)
    void split(int t, int k, int& l, int& r) {
        if (!t) { l = r = 0; return; }
        push(t);
        int leftSz = tr[tr[t].l].sz;
        if (leftSz >= k) {
            split(tr[t].l, k, l, tr[t].l);
            r = t;
        } else {
            split(tr[t].r, k - leftSz - 1, tr[t].r, r);
            l = t;
        }
        pull(t);
    }

    int merge(int l, int r) {
        push(l);
        push(r);
        if (!l || !r) return l ? l : r;
        if (tr[l].prio > tr[r].prio) {
            tr[l].r = merge(tr[l].r, r);
            pull(l);
            return l;
        } else {
            tr[r].l = merge(l, tr[r].l);
            pull(r);
            return r;
        }
    }

    void pushBack(long long v) {
        root = merge(root, newNode(v));
    }

    void reverseRange(int lPos, int rPos) {
        int a, b, c;
        split(root, rPos, a, c);
        split(a, lPos - 1, a, b);
        if (b) tr[b].rev ^= 1;
        root = merge(merge(a, b), c);
    }

    long long querySum(int lPos, int rPos) {
        int a, b, c;
        split(root, rPos, a, c);
        split(a, lPos - 1, a, b);
        long long ans = tr[b].sum;
        root = merge(merge(a, b), c);
        return ans;
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, m;
    if (!(cin >> n >> m)) return 0;
    ImplicitTreap treap(n);
    for (int i = 0; i < n; i++) {
        long long x;
        cin >> x;
        treap.pushBack(x);
    }
    while (m--) {
        int type, a, b;
        cin >> type >> a >> b;
        if (type == 1) treap.reverseRange(a, b);
        else cout << treap.querySum(a, b) << "\\n";
    }
    return 0;
}`,
    rust: `use std::io::{self, Read};
use std::time::{SystemTime, UNIX_EPOCH};

#[derive(Clone, Default)]
struct Node {
    val: i64,
    sum: i64,
    prio: u64,
    sz: usize,
    l: usize,
    r: usize,
    rev: bool,
}

struct ImplicitTreap {
    tr: Vec<Node>,
    rng: u64,
    root: usize,
}

impl ImplicitTreap {
    fn new(cap: usize) -> Self {
        let mut tr = Vec::with_capacity(cap + 1);
        tr.push(Node::default());
        let seed = SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_nanos() as u64 | 1;
        Self { tr, rng: seed, root: 0 }
    }

    fn next_prio(&mut self) -> u64 {
        let mut x = self.rng;
        x ^= x << 13;
        x ^= x >> 7;
        x ^= x << 17;
        self.rng = x;
        x
    }

    fn new_node(&mut self, val: i64) -> usize {
        let prio = self.next_prio();
        let id = self.tr.len();
        self.tr.push(Node { val, sum: val, prio, sz: 1, l: 0, r: 0, rev: false });
        id
    }

    fn push(&mut self, t: usize) {
        if t == 0 || !self.tr[t].rev {
            return;
        }
        let l = self.tr[t].l;
        let r = self.tr[t].r;
        self.tr[t].l = r;
        self.tr[t].r = l;
        if r != 0 {
            self.tr[r].rev = !self.tr[r].rev;
        }
        if l != 0 {
            self.tr[l].rev = !self.tr[l].rev;
        }
        self.tr[t].rev = false;
    }

    fn pull(&mut self, t: usize) {
        if t == 0 {
            return;
        }
        let l = self.tr[t].l;
        let r = self.tr[t].r;
        self.tr[t].sz = 1 + self.tr[l].sz + self.tr[r].sz;
        self.tr[t].sum = self.tr[t].val + self.tr[l].sum + self.tr[r].sum;
    }

    fn split(&mut self, t: usize, k: usize) -> (usize, usize) {
        if t == 0 {
            return (0, 0);
        }
        self.push(t);
        let left_sz = self.tr[self.tr[t].l].sz;
        if left_sz >= k {
            let (ll, lr) = self.split(self.tr[t].l, k);
            self.tr[t].l = lr;
            self.pull(t);
            (ll, t)
        } else {
            let (rl, rr) = self.split(self.tr[t].r, k - left_sz - 1);
            self.tr[t].r = rl;
            self.pull(t);
            (t, rr)
        }
    }

    fn merge(&mut self, l: usize, r: usize) -> usize {
        self.push(l);
        self.push(r);
        if l == 0 {
            return r;
        }
        if r == 0 {
            return l;
        }
        if self.tr[l].prio > self.tr[r].prio {
            let nr = self.merge(self.tr[l].r, r);
            self.tr[l].r = nr;
            self.pull(l);
            l
        } else {
            let nl = self.merge(l, self.tr[r].l);
            self.tr[r].l = nl;
            self.pull(r);
            r
        }
    }

    fn push_back(&mut self, val: i64) {
        let nd = self.new_node(val);
        self.root = self.merge(self.root, nd);
    }

    fn reverse_range(&mut self, l_pos: usize, r_pos: usize) {
        let (ab, c) = self.split(self.root, r_pos);
        let (a, b) = self.split(ab, l_pos - 1);
        if b != 0 {
            self.tr[b].rev = !self.tr[b].rev;
        }
        let ab2 = self.merge(a, b);
        self.root = self.merge(ab2, c);
    }

    fn query_sum(&mut self, l_pos: usize, r_pos: usize) -> i64 {
        let (ab, c) = self.split(self.root, r_pos);
        let (a, b) = self.split(ab, l_pos - 1);
        let ans = self.tr[b].sum;
        let ab2 = self.merge(a, b);
        self.root = self.merge(ab2, c);
        ans
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
    let m: usize = it.next().unwrap().parse().unwrap();

    let mut treap = ImplicitTreap::new(n);
    for _ in 0..n {
        let x: i64 = it.next().unwrap().parse().unwrap();
        treap.push_back(x);
    }

    let mut out = String::new();
    for _ in 0..m {
        let typ: i32 = it.next().unwrap().parse().unwrap();
        let a: usize = it.next().unwrap().parse().unwrap();
        let b: usize = it.next().unwrap().parse().unwrap();
        if typ == 1 {
            treap.reverse_range(a, b);
        } else {
            out.push_str(&format!("{}\\n", treap.query_sum(a, b)));
        }
    }
    print!("{}", out);
}`,
    java21: `import java.io.IOException;
import java.io.InputStream;
import java.util.SplittableRandom;

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

    static long[] val, sum, prio;
    static int[] sz, lc, rc;
    static boolean[] rev;
    static int ptr = 0, root = 0, splitL, splitR;
    static final SplittableRandom rng = new SplittableRandom(System.nanoTime());

    static int newNode(long v) {
        int id = ++ptr;
        val[id] = sum[id] = v;
        prio[id] = rng.nextLong();
        sz[id] = 1;
        return id;
    }

    static void push(int t) {
        if (t == 0 || !rev[t]) return;
        int tmp = lc[t]; lc[t] = rc[t]; rc[t] = tmp;
        if (lc[t] != 0) rev[lc[t]] = !rev[lc[t]];
        if (rc[t] != 0) rev[rc[t]] = !rev[rc[t]];
        rev[t] = false;
    }

    static void pull(int t) {
        if (t == 0) return;
        sz[t] = 1 + sz[lc[t]] + sz[rc[t]];
        sum[t] = val[t] + sum[lc[t]] + sum[rc[t]];
    }

    static void split(int t, int k) {
        if (t == 0) { splitL = 0; splitR = 0; return; }
        push(t);
        int leftSz = sz[lc[t]];
        if (leftSz >= k) {
            split(lc[t], k);
            lc[t] = splitR;
            pull(t);
            splitR = t;
        } else {
            split(rc[t], k - leftSz - 1);
            rc[t] = splitL;
            pull(t);
            splitL = t;
        }
    }

    static int merge(int l, int r) {
        push(l);
        push(r);
        if (l == 0) return r;
        if (r == 0) return l;
        if (prio[l] > prio[r]) {
            rc[l] = merge(rc[l], r);
            pull(l);
            return l;
        } else {
            lc[r] = merge(l, lc[r]);
            pull(r);
            return r;
        }
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        long nIn = fs.nextLong();
        if (nIn == Long.MIN_VALUE) return;
        int n = (int) nIn, m = (int) fs.nextLong();

        val = new long[n + 2]; sum = new long[n + 2]; prio = new long[n + 2];
        sz = new int[n + 2]; lc = new int[n + 2]; rc = new int[n + 2];
        rev = new boolean[n + 2];

        for (int i = 0; i < n; i++) root = merge(root, newNode(fs.nextLong()));

        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < m; i++) {
            int type = (int) fs.nextLong();
            int a = (int) fs.nextLong(), b = (int) fs.nextLong();
            split(root, b);
            int ab = splitL, c = splitR;
            split(ab, a - 1);
            int aPart = splitL, bPart = splitR;
            if (type == 1) {
                if (bPart != 0) rev[bPart] = !rev[bPart];
            } else {
                sb.append(sum[bPart]).append('\\n');
            }
            root = merge(merge(aPart, bPart), c);
        }
        System.out.print(sb);
    }
}`,
    python3: `import random
import sys

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    n = int(next(it))
    m = int(next(it))

    val = [0] * (n + 1)
    ssum = [0] * (n + 1)
    prio = [0] * (n + 1)
    sz = [0] * (n + 1)
    lc = [0] * (n + 1)
    rc = [0] * (n + 1)
    rev = [False] * (n + 1)
    rng = random.Random(42)

    def push(t: int) -> None:
        if t and rev[t]:
            lc[t], rc[t] = rc[t], lc[t]
            if lc[t]:
                rev[lc[t]] = not rev[lc[t]]
            if rc[t]:
                rev[rc[t]] = not rev[rc[t]]
            rev[t] = False

    def pull(t: int) -> None:
        if t:
            l, r = lc[t], rc[t]
            sz[t] = 1 + sz[l] + sz[r]
            ssum[t] = val[t] + ssum[l] + ssum[r]

    def split(t: int, k: int):
        if not t:
            return 0, 0
        push(t)
        left_sz = sz[lc[t]]
        if left_sz >= k:
            ll, lr = split(lc[t], k)
            lc[t] = lr
            pull(t)
            return ll, t
        rl, rr = split(rc[t], k - left_sz - 1)
        rc[t] = rl
        pull(t)
        return t, rr

    def merge(l: int, r: int) -> int:
        push(l)
        push(r)
        if not l or not r:
            return l or r
        if prio[l] > prio[r]:
            rc[l] = merge(rc[l], r)
            pull(l)
            return l
        lc[r] = merge(l, lc[r])
        pull(r)
        return r

    root = 0
    for i in range(1, n + 1):
        v = int(next(it))
        val[i] = ssum[i] = v
        prio[i] = rng.getrandbits(60)
        sz[i] = 1
        root = merge(root, i)

    out = []
    for _ in range(m):
        typ = int(next(it))
        a = int(next(it))
        b = int(next(it))
        ab, c = split(root, b)
        ap, bp = split(ab, a - 1)
        if typ == 1:
            if bp:
                rev[bp] = not rev[bp]
        else:
            out.append(str(ssum[bp]))
        root = merge(merge(ap, bp), c)
    sys.stdout.write("\\n".join(out) + "\\n")

if __name__ == "__main__":
    solve()`,
    ruby: `tokens = $stdin.read.split
exit if tokens.empty?
idx = 0
n = tokens[idx].to_i; idx += 1
m = tokens[idx].to_i; idx += 1

val = Array.new(n + 1, 0)
sum_arr = Array.new(n + 1, 0)
prio = Array.new(n + 1, 0)
sz = Array.new(n + 1, 0)
lc = Array.new(n + 1, 0)
rc = Array.new(n + 1, 0)
rev = Array.new(n + 1, false)
rng = Random.new(42)

push = lambda do |t|
  return if t == 0 || !rev[t]
  lc[t], rc[t] = rc[t], lc[t]
  rev[lc[t]] = !rev[lc[t]] if lc[t] != 0
  rev[rc[t]] = !rev[rc[t]] if rc[t] != 0
  rev[t] = false
end

pull = lambda do |t|
  return if t == 0
  l = lc[t]; r = rc[t]
  sz[t] = 1 + sz[l] + sz[r]
  sum_arr[t] = val[t] + sum_arr[l] + sum_arr[r]
end

split = lambda do |t, k|
  return [0, 0] if t == 0
  push.call(t)
  left_sz = sz[lc[t]]
  if left_sz >= k
    ll, lr = split.call(lc[t], k)
    lc[t] = lr
    pull.call(t)
    [ll, t]
  else
    rl, rr = split.call(rc[t], k - left_sz - 1)
    rc[t] = rl
    pull.call(t)
    [t, rr]
  end
end

merge = lambda do |l, r|
  push.call(l)
  push.call(r)
  return r if l == 0
  return l if r == 0
  if prio[l] > prio[r]
    rc[l] = merge.call(rc[l], r)
    pull.call(l)
    l
  else
    lc[r] = merge.call(l, lc[r])
    pull.call(r)
    r
  end
end

root = 0
(1..n).each do |i|
  v = tokens[idx].to_i; idx += 1
  val[i] = sum_arr[i] = v
  prio[i] = rng.rand(1 << 60)
  sz[i] = 1
  root = merge.call(root, i)
end

out = []
m.times do
  typ = tokens[idx].to_i
  a = tokens[idx + 1].to_i
  b = tokens[idx + 2].to_i
  idx += 3
  ab, c = split.call(root, b)
  ap, bp = split.call(ab, a - 1)
  if typ == 1
    rev[bp] = !rev[bp] if bp != 0
  else
    out << sum_arr[bp].to_s
  end
  root = merge.call(merge.call(ap, bp), c)
end
puts out.join("\\n")`,
  },
  practiceProblems: [
    {
      id: 'ch50-p1',
      tier: 'Warmup',
      ratingRange: '2050–2250',
      title: 'Cut and Paste — Move Substring [a, b] to End via Implicit Treap',
      statement:
        'Given a string of length `N` and `M` operations `(a, b)`, cut the contiguous substring from 1-indexed position `a` to `b` and paste it at the **end** of the string. Print the final string after all `M` operations.',
      constraints: '1 <= N, M <= 2 * 10^5, 1 <= a <= b <= N',
      sampleInput: '7 2\nAYBABTU\n3 5\n3 5',
      sampleOutput: 'AYABTUB',
      hints: [
        'Build an Implicit Treap containing one character per node (`val = s[i]`, no `rev` tag needed here!).',
        'For each `(a, b)`: `split(root, b) -> (AB, C)` and `split(AB, a - 1) -> (A, B)`. Re-attach `B` at the end via `root = merge(merge(A, C), B)`! Finally traverse in-order to print the string.',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, m;
    string s;
    if (!(cin >> n >> m >> s)) return 0;

    vector<char> ch(n + 1);
    vector<uint64_t> prio(n + 1);
    vector<int> sz(n + 1, 0), lc(n + 1, 0), rc(n + 1, 0);
    mt19937_64 rng(42);

    auto pull = [&](int t) {
        if (t) sz[t] = 1 + sz[lc[t]] + sz[rc[t]];
    };

    function<void(int, int, int&, int&)> split = [&](int t, int k, int& l, int& r) {
        if (!t) { l = r = 0; return; }
        int lsz = sz[lc[t]];
        if (lsz >= k) { split(lc[t], k, l, lc[t]); r = t; }
        else { split(rc[t], k - lsz - 1, rc[t], r); l = t; }
        pull(t);
    };

    function<int(int, int)> merge = [&](int l, int r) {
        if (!l || !r) return l ? l : r;
        if (prio[l] > prio[r]) { rc[l] = merge(rc[l], r); pull(l); return l; }
        lc[r] = merge(l, lc[r]); pull(r); return r;
    };

    int root = 0;
    for (int i = 1; i <= n; i++) {
        ch[i] = s[i - 1];
        prio[i] = rng();
        sz[i] = 1;
        root = merge(root, i);
    }

    while (m--) {
        int a, b, ab, c, ap, bp;
        cin >> a >> b;
        split(root, b, ab, c);
        split(ab, a - 1, ap, bp);
        root = merge(merge(ap, c), bp);
    }

    string res;
    res.reserve(n);
    function<void(int)> inorder = [&](int t) {
        if (!t) return;
        inorder(lc[t]);
        res.push_back(ch[t]);
        inorder(rc[t]);
    };
    inorder(root);
    cout << res << "\\n";
    return 0;
}`,
        rust: `use std::io::{self, Read};

struct Treap {
    ch: Vec<u8>,
    prio: Vec<u64>,
    sz: Vec<usize>,
    lc: Vec<usize>,
    rc: Vec<usize>,
}

impl Treap {
    fn pull(&mut self, t: usize) {
        if t != 0 {
            self.sz[t] = 1 + self.sz[self.lc[t]] + self.sz[self.rc[t]];
        }
    }

    fn split(&mut self, t: usize, k: usize) -> (usize, usize) {
        if t == 0 {
            return (0, 0);
        }
        let lsz = self.sz[self.lc[t]];
        if lsz >= k {
            let (l, nr) = self.split(self.lc[t], k);
            self.lc[t] = nr;
            self.pull(t);
            (l, t)
        } else {
            let (nl, r) = self.split(self.rc[t], k - lsz - 1);
            self.rc[t] = nl;
            self.pull(t);
            (t, r)
        }
    }

    fn merge(&mut self, l: usize, r: usize) -> usize {
        if l == 0 { return r; }
        if r == 0 { return l; }
        if self.prio[l] > self.prio[r] {
            let nr = self.merge(self.rc[l], r);
            self.rc[l] = nr;
            self.pull(l);
            l
        } else {
            let nl = self.merge(l, self.lc[r]);
            self.lc[r] = nl;
            self.pull(r);
            r
        }
    }

    fn collect(&self, t: usize, out: &mut Vec<u8>) {
        if t == 0 { return; }
        self.collect(self.lc[t], out);
        out.push(self.ch[t]);
        self.collect(self.rc[t], out);
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
    let m: usize = it.next().unwrap().parse().unwrap();
    let s = it.next().unwrap().as_bytes();

    let mut tr = Treap {
        ch: vec![0; n + 1],
        prio: vec![0; n + 1],
        sz: vec![0; n + 1],
        lc: vec![0; n + 1],
        rc: vec![0; n + 1],
    };
    let mut rng = 88172645463325252u64;
    let mut root = 0usize;
    for i in 1..=n {
        rng ^= rng << 13;
        rng ^= rng >> 7;
        rng ^= rng << 17;
        tr.ch[i] = s[i - 1];
        tr.prio[i] = rng;
        tr.sz[i] = 1;
        root = tr.merge(root, i);
    }

    for _ in 0..m {
        let a: usize = it.next().unwrap().parse().unwrap();
        let b: usize = it.next().unwrap().parse().unwrap();
        let (ab, c) = tr.split(root, b);
        let (ap, bp) = tr.split(ab, a - 1);
        let ac = tr.merge(ap, c);
        root = tr.merge(ac, bp);
    }

    let mut out = Vec::with_capacity(n);
    tr.collect(root, &mut out);
    println!("{}", String::from_utf8(out).unwrap());
}`,
        java21: `import java.io.IOException;
import java.io.InputStream;
import java.util.SplittableRandom;

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
        int nextInt() throws IOException { return Integer.parseInt(next()); }
    }

    static char[] ch;
    static long[] prio;
    static int[] sz, lc, rc;
    static int splitL, splitR;

    static void pull(int t) { if (t != 0) sz[t] = 1 + sz[lc[t]] + sz[rc[t]]; }

    static void split(int t, int k) {
        if (t == 0) { splitL = 0; splitR = 0; return; }
        int lsz = sz[lc[t]];
        if (lsz >= k) {
            split(lc[t], k);
            lc[t] = splitR;
            pull(t);
            splitR = t;
        } else {
            split(rc[t], k - lsz - 1);
            rc[t] = splitL;
            pull(t);
            splitL = t;
        }
    }

    static int merge(int l, int r) {
        if (l == 0) return r;
        if (r == 0) return l;
        if (prio[l] > prio[r]) { rc[l] = merge(rc[l], r); pull(l); return l; }
        lc[r] = merge(l, lc[r]); pull(r); return r;
    }

    static void inorder(int t, StringBuilder sb) {
        if (t == 0) return;
        inorder(lc[t], sb);
        sb.append(ch[t]);
        inorder(rc[t], sb);
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        String first = fs.next();
        if (first == null) return;
        int n = Integer.parseInt(first), m = fs.nextInt();
        String s = fs.next();

        ch = new char[n + 1]; prio = new long[n + 1];
        sz = new int[n + 1]; lc = new int[n + 1]; rc = new int[n + 1];
        SplittableRandom rng = new SplittableRandom(42);
        int root = 0;
        for (int i = 1; i <= n; i++) {
            ch[i] = s.charAt(i - 1);
            prio[i] = rng.nextLong();
            sz[i] = 1;
            root = merge(root, i);
        }

        for (int i = 0; i < m; i++) {
            int a = fs.nextInt(), b = fs.nextInt();
            split(root, b); int ab = splitL, c = splitR;
            split(ab, a - 1); int ap = splitL, bp = splitR;
            root = merge(merge(ap, c), bp);
        }

        StringBuilder sb = new StringBuilder(n);
        inorder(root, sb);
        System.out.println(sb);
    }
}`,
        python3: `import random
import sys

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    n = int(next(it))
    m = int(next(it))
    s = next(it)

    ch = [''] * (n + 1)
    prio = [0] * (n + 1)
    sz = [0] * (n + 1)
    lc = [0] * (n + 1)
    rc = [0] * (n + 1)
    rng = random.Random(42)

    def pull(t: int) -> None:
        if t:
            sz[t] = 1 + sz[lc[t]] + sz[rc[t]]

    def split(t: int, k: int):
        if not t:
            return 0, 0
        lsz = sz[lc[t]]
        if lsz >= k:
            l, nr = split(lc[t], k)
            lc[t] = nr
            pull(t)
            return l, t
        nl, r = split(rc[t], k - lsz - 1)
        rc[t] = nl
        pull(t)
        return t, r

    def merge(l: int, r: int) -> int:
        if not l or not r:
            return l or r
        if prio[l] > prio[r]:
            rc[l] = merge(rc[l], r)
            pull(l)
            return l
        lc[r] = merge(l, lc[r])
        pull(r)
        return r

    root = 0
    for i in range(1, n + 1):
        ch[i] = s[i - 1]
        prio[i] = rng.getrandbits(60)
        sz[i] = 1
        root = merge(root, i)

    for _ in range(m):
        a = int(next(it))
        b = int(next(it))
        ab, c = split(root, b)
        ap, bp = split(ab, a - 1)
        root = merge(merge(ap, c), bp)

    res = []
    stack = []
    cur = root
    while stack or cur:
        while cur:
            stack.append(cur)
            cur = lc[cur]
        cur = stack.pop()
        res.append(ch[cur])
        cur = rc[cur]
    sys.stdout.write("".join(res) + "\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
n = tokens[0].to_i
m = tokens[1].to_i
s = tokens[2]

ch = [''] + s.chars
prio = Array.new(n + 1, 0)
sz = Array.new(n + 1, 0)
lc = Array.new(n + 1, 0)
rc = Array.new(n + 1, 0)
rng = Random.new(42)

pull = ->(t) { sz[t] = 1 + sz[lc[t]] + sz[rc[t]] if t != 0 }

split = lambda do |t, k|
  return [0, 0] if t == 0
  lsz = sz[lc[t]]
  if lsz >= k
    l, nr = split.call(lc[t], k)
    lc[t] = nr
    pull.call(t)
    [l, t]
  else
    nl, r = split.call(rc[t], k - lsz - 1)
    rc[t] = nl
    pull.call(t)
    [t, r]
  end
end

merge = lambda do |l, r|
  return r if l == 0
  return l if r == 0
  if prio[l] > prio[r]
    rc[l] = merge.call(rc[l], r)
    pull.call(l)
    l
  else
    lc[r] = merge.call(l, lc[r])
    pull.call(r)
    r
  end
end

root = 0
(1..n).each do |i|
  prio[i] = rng.rand(1 << 60)
  sz[i] = 1
  root = merge.call(root, i)
end

idx = 3
m.times do
  a = tokens[idx].to_i; b = tokens[idx + 1].to_i; idx += 2
  ab, c = split.call(root, b)
  ap, bp = split.call(ab, a - 1)
  root = merge.call(merge.call(ap, c), bp)
end

res = []
stack = []
cur = root
while !stack.empty? || cur != 0
  while cur != 0
    stack << cur
    cur = lc[cur]
  end
  cur = stack.pop
  res << ch[cur]
  cur = rc[cur]
end
puts res.join`,
      },
    },
    {
      id: 'ch50-p2',
      tier: 'Standard',
      ratingRange: '2150–2350',
      title: 'Substring Reversals — Lazy Flag Propagation on Implicit Treap',
      statement:
        'Given a string of length `N` and `M` operations `(a, b)`, reverse the substring from 1-indexed position `a` to `b` in place. Print the final string after all `M` reversals.',
      constraints: '1 <= N, M <= 2 * 10^5, 1 <= a <= b <= N',
      sampleInput: '7 2\nAYBABTU\n3 4\n4 7',
      sampleOutput: 'AYAUTBB',
      hints: [
        'Keep a boolean `rev[t]` on every Treap node. Isolate `B = [a, b]` using two splits (`split(root, b)` then `split(AB, a - 1)`), set `rev[B] ^= 1`, and merge `A + B + C`.',
        'Before reading `sz[lc[t]]` in `split`, before comparing priorities in `merge`, AND before descending during final in-order output, call `push(t)` to swap `lc[t] <-> rc[t]` and toggle `rev` on both children!',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, m;
    string s;
    if (!(cin >> n >> m >> s)) return 0;

    vector<char> ch(n + 1);
    vector<uint64_t> prio(n + 1);
    vector<int> sz(n + 1, 0), lc(n + 1, 0), rc(n + 1, 0);
    vector<bool> rev(n + 1, false);
    mt19937_64 rng(42);

    auto push = [&](int t) {
        if (!t || !rev[t]) return;
        swap(lc[t], rc[t]);
        if (lc[t]) rev[lc[t]] = !rev[lc[t]];
        if (rc[t]) rev[rc[t]] = !rev[rc[t]];
        rev[t] = false;
    };
    auto pull = [&](int t) {
        if (t) sz[t] = 1 + sz[lc[t]] + sz[rc[t]];
    };

    function<void(int, int, int&, int&)> split = [&](int t, int k, int& l, int& r) {
        if (!t) { l = r = 0; return; }
        push(t);
        int lsz = sz[lc[t]];
        if (lsz >= k) { split(lc[t], k, l, lc[t]); r = t; }
        else { split(rc[t], k - lsz - 1, rc[t], r); l = t; }
        pull(t);
    };

    function<int(int, int)> merge = [&](int l, int r) {
        push(l); push(r);
        if (!l || !r) return l ? l : r;
        if (prio[l] > prio[r]) { rc[l] = merge(rc[l], r); pull(l); return l; }
        lc[r] = merge(l, lc[r]); pull(r); return r;
    };

    int root = 0;
    for (int i = 1; i <= n; i++) {
        ch[i] = s[i - 1];
        prio[i] = rng();
        sz[i] = 1;
        root = merge(root, i);
    }

    while (m--) {
        int a, b, ab, c, ap, bp;
        cin >> a >> b;
        split(root, b, ab, c);
        split(ab, a - 1, ap, bp);
        if (bp) rev[bp] = !rev[bp];
        root = merge(merge(ap, bp), c);
    }

    string res;
    res.reserve(n);
    function<void(int)> dfs = [&](int t) {
        if (!t) return;
        push(t);
        dfs(lc[t]);
        res.push_back(ch[t]);
        dfs(rc[t]);
    };
    dfs(root);
    cout << res << "\\n";
    return 0;
}`,
        rust: `use std::io::{self, Read};

struct RevTreap {
    ch: Vec<u8>,
    prio: Vec<u64>,
    sz: Vec<usize>,
    lc: Vec<usize>,
    rc: Vec<usize>,
    rev: Vec<bool>,
}

impl RevTreap {
    fn push(&mut self, t: usize) {
        if t == 0 || !self.rev[t] {
            return;
        }
        let l = self.lc[t];
        let r = self.rc[t];
        self.lc[t] = r;
        self.rc[t] = l;
        if r != 0 { self.rev[r] = !self.rev[r]; }
        if l != 0 { self.rev[l] = !self.rev[l]; }
        self.rev[t] = false;
    }

    fn pull(&mut self, t: usize) {
        if t != 0 {
            self.sz[t] = 1 + self.sz[self.lc[t]] + self.sz[self.rc[t]];
        }
    }

    fn split(&mut self, t: usize, k: usize) -> (usize, usize) {
        if t == 0 { return (0, 0); }
        self.push(t);
        let lsz = self.sz[self.lc[t]];
        if lsz >= k {
            let (l, nr) = self.split(self.lc[t], k);
            self.lc[t] = nr;
            self.pull(t);
            (l, t)
        } else {
            let (nl, r) = self.split(self.rc[t], k - lsz - 1);
            self.rc[t] = nl;
            self.pull(t);
            (t, r)
        }
    }

    fn merge(&mut self, l: usize, r: usize) -> usize {
        self.push(l);
        self.push(r);
        if l == 0 { return r; }
        if r == 0 { return l; }
        if self.prio[l] > self.prio[r] {
            let nr = self.merge(self.rc[l], r);
            self.rc[l] = nr;
            self.pull(l);
            l
        } else {
            let nl = self.merge(l, self.lc[r]);
            self.lc[r] = nl;
            self.pull(r);
            r
        }
    }

    fn dfs(&mut self, t: usize, out: &mut Vec<u8>) {
        if t == 0 { return; }
        self.push(t);
        let l = self.lc[t];
        let r = self.rc[t];
        self.dfs(l, out);
        out.push(self.ch[t]);
        self.dfs(r, out);
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
    let m: usize = it.next().unwrap().parse().unwrap();
    let s = it.next().unwrap().as_bytes();

    let mut tr = RevTreap {
        ch: vec![0; n + 1],
        prio: vec![0; n + 1],
        sz: vec![0; n + 1],
        lc: vec![0; n + 1],
        rc: vec![0; n + 1],
        rev: vec![false; n + 1],
    };
    let mut rng = 123456789123456789u64;
    let mut root = 0usize;
    for i in 1..=n {
        rng ^= rng << 13;
        rng ^= rng >> 7;
        rng ^= rng << 17;
        tr.ch[i] = s[i - 1];
        tr.prio[i] = rng;
        tr.sz[i] = 1;
        root = tr.merge(root, i);
    }

    for _ in 0..m {
        let a: usize = it.next().unwrap().parse().unwrap();
        let b: usize = it.next().unwrap().parse().unwrap();
        let (ab, c) = tr.split(root, b);
        let (ap, bp) = tr.split(ab, a - 1);
        if bp != 0 {
            tr.rev[bp] = !tr.rev[bp];
        }
        let ab2 = tr.merge(ap, bp);
        root = tr.merge(ab2, c);
    }

    let mut out = Vec::with_capacity(n);
    tr.dfs(root, &mut out);
    println!("{}", String::from_utf8(out).unwrap());
}`,
        java21: `import java.io.IOException;
import java.io.InputStream;
import java.util.SplittableRandom;

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
        int nextInt() throws IOException { return Integer.parseInt(next()); }
    }

    static char[] ch;
    static long[] prio;
    static int[] sz, lc, rc;
    static boolean[] rev;
    static int splitL, splitR;

    static void push(int t) {
        if (t == 0 || !rev[t]) return;
        int tmp = lc[t]; lc[t] = rc[t]; rc[t] = tmp;
        if (lc[t] != 0) rev[lc[t]] = !rev[lc[t]];
        if (rc[t] != 0) rev[rc[t]] = !rev[rc[t]];
        rev[t] = false;
    }

    static void pull(int t) { if (t != 0) sz[t] = 1 + sz[lc[t]] + sz[rc[t]]; }

    static void split(int t, int k) {
        if (t == 0) { splitL = 0; splitR = 0; return; }
        push(t);
        int lsz = sz[lc[t]];
        if (lsz >= k) {
            split(lc[t], k);
            lc[t] = splitR;
            pull(t);
            splitR = t;
        } else {
            split(rc[t], k - lsz - 1);
            rc[t] = splitL;
            pull(t);
            splitL = t;
        }
    }

    static int merge(int l, int r) {
        push(l); push(r);
        if (l == 0) return r;
        if (r == 0) return l;
        if (prio[l] > prio[r]) { rc[l] = merge(rc[l], r); pull(l); return l; }
        lc[r] = merge(l, lc[r]); pull(r); return r;
    }

    static void dfs(int t, StringBuilder sb) {
        if (t == 0) return;
        push(t);
        dfs(lc[t], sb);
        sb.append(ch[t]);
        dfs(rc[t], sb);
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        String first = fs.next();
        if (first == null) return;
        int n = Integer.parseInt(first), m = fs.nextInt();
        String s = fs.next();

        ch = new char[n + 1]; prio = new long[n + 1];
        sz = new int[n + 1]; lc = new int[n + 1]; rc = new int[n + 1];
        rev = new boolean[n + 1];
        SplittableRandom rng = new SplittableRandom(42);

        int root = 0;
        for (int i = 1; i <= n; i++) {
            ch[i] = s.charAt(i - 1);
            prio[i] = rng.nextLong();
            sz[i] = 1;
            root = merge(root, i);
        }

        for (int i = 0; i < m; i++) {
            int a = fs.nextInt(), b = fs.nextInt();
            split(root, b); int ab = splitL, c = splitR;
            split(ab, a - 1); int ap = splitL, bp = splitR;
            if (bp != 0) rev[bp] = !rev[bp];
            root = merge(merge(ap, bp), c);
        }

        StringBuilder sb = new StringBuilder(n);
        dfs(root, sb);
        System.out.println(sb);
    }
}`,
        python3: `import random
import sys

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    n = int(next(it))
    m = int(next(it))
    s = next(it)

    ch = [''] * (n + 1)
    prio = [0] * (n + 1)
    sz = [0] * (n + 1)
    lc = [0] * (n + 1)
    rc = [0] * (n + 1)
    rev = [False] * (n + 1)
    rng = random.Random(42)

    def push(t: int) -> None:
        if t and rev[t]:
            lc[t], rc[t] = rc[t], lc[t]
            if lc[t]:
                rev[lc[t]] = not rev[lc[t]]
            if rc[t]:
                rev[rc[t]] = not rev[rc[t]]
            rev[t] = False

    def pull(t: int) -> None:
        if t:
            sz[t] = 1 + sz[lc[t]] + sz[rc[t]]

    def split(t: int, k: int):
        if not t:
            return 0, 0
        push(t)
        lsz = sz[lc[t]]
        if lsz >= k:
            l, nr = split(lc[t], k)
            lc[t] = nr
            pull(t)
            return l, t
        nl, r = split(rc[t], k - lsz - 1)
        rc[t] = nl
        pull(t)
        return t, r

    def merge(l: int, r: int) -> int:
        push(l)
        push(r)
        if not l or not r:
            return l or r
        if prio[l] > prio[r]:
            rc[l] = merge(rc[l], r)
            pull(l)
            return l
        lc[r] = merge(l, lc[r])
        pull(r)
        return r

    root = 0
    for i in range(1, n + 1):
        ch[i] = s[i - 1]
        prio[i] = rng.getrandbits(60)
        sz[i] = 1
        root = merge(root, i)

    for _ in range(m):
        a = int(next(it))
        b = int(next(it))
        ab, c = split(root, b)
        ap, bp = split(ab, a - 1)
        if bp:
            rev[bp] = not rev[bp]
        root = merge(merge(ap, bp), c)

    res = []
    stack = []
    cur = root
    while stack or cur:
        while cur:
            push(cur)
            stack.append(cur)
            cur = lc[cur]
        cur = stack.pop()
        res.append(ch[cur])
        cur = rc[cur]
    sys.stdout.write("".join(res) + "\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
n = tokens[0].to_i
m = tokens[1].to_i
s = tokens[2]

ch = [''] + s.chars
prio = Array.new(n + 1, 0)
sz = Array.new(n + 1, 0)
lc = Array.new(n + 1, 0)
rc = Array.new(n + 1, 0)
rev = Array.new(n + 1, false)
rng = Random.new(42)

push = lambda do |t|
  return if t == 0 || !rev[t]
  lc[t], rc[t] = rc[t], lc[t]
  rev[lc[t]] = !rev[lc[t]] if lc[t] != 0
  rev[rc[t]] = !rev[rc[t]] if rc[t] != 0
  rev[t] = false
end

pull = ->(t) { sz[t] = 1 + sz[lc[t]] + sz[rc[t]] if t != 0 }

split = lambda do |t, k|
  return [0, 0] if t == 0
  push.call(t)
  lsz = sz[lc[t]]
  if lsz >= k
    l, nr = split.call(lc[t], k)
    lc[t] = nr
    pull.call(t)
    [l, t]
  else
    nl, r = split.call(rc[t], k - lsz - 1)
    rc[t] = nl
    pull.call(t)
    [t, r]
  end
end

merge = lambda do |l, r|
  push.call(l)
  push.call(r)
  return r if l == 0
  return l if r == 0
  if prio[l] > prio[r]
    rc[l] = merge.call(rc[l], r)
    pull.call(l)
    l
  else
    lc[r] = merge.call(l, lc[r])
    pull.call(r)
    r
  end
end

root = 0
(1..n).each do |i|
  prio[i] = rng.rand(1 << 60)
  sz[i] = 1
  root = merge.call(root, i)
end

idx = 3
m.times do
  a = tokens[idx].to_i; b = tokens[idx + 1].to_i; idx += 2
  ab, c = split.call(root, b)
  ap, bp = split.call(ab, a - 1)
  rev[bp] = !rev[bp] if bp != 0
  root = merge.call(merge.call(ap, bp), c)
end

res = []
stack = []
cur = root
while !stack.empty? || cur != 0
  while cur != 0
    push.call(cur)
    stack << cur
    cur = lc[cur]
  end
  cur = stack.pop
  res << ch[cur]
  cur = rc[cur]
end
puts res.join`,
      },
    },
    {
      id: 'ch50-p3',
      tier: 'Boss',
      ratingRange: '2250–2550',
      title: 'Reversals and Sums — Dynamic Insert, Erase, Reverse & Range Sum in O(log N)',
      statement:
        'Maintain a dynamic integer sequence initially of length `N` and handle `M` operations: `1 a b` (reverse `[a, b]`), `2 a b` (output sum of `[a, b]`), `3 pos x` (insert `x` right after 1-indexed `pos`, where `pos = 0` inserts at front), and `4 pos` (delete the `pos`-th element).',
      constraints: '1 <= N, M <= 2 * 10^5, |x| <= 10^9',
      sampleInput: '8 5\n2 1 3 6 1 2 1 2\n1 2 5\n2 3 6\n3 2 10\n2 3 6\n4 3',
      sampleOutput: '12\n20',
      hints: [
        'Each Treap operation isolates a single index or slice using `split(t, k)`: inserting after `pos` simply does `split(root, pos) -> (L, R); root = merge(merge(L, newNode(x)), R)`.',
        'Deleting element at `pos` does `split(root, pos) -> (Lmid, R); split(Lmid, pos - 1) -> (L, mid); root = merge(L, R)` — dropping `mid` completely while preserving `sum[t]` and `sz[t]`!',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, m;
    if (!(cin >> n >> m)) return 0;

    struct Node {
        long long val = 0, sum = 0;
        uint64_t prio = 0;
        int sz = 0, l = 0, r = 0;
        bool rev = false;
    };
    vector<Node> tr;
    tr.reserve(n + m + 2);
    tr.push_back(Node{});
    mt19937_64 rng(42);

    auto newNode = [&](long long v) {
        int id = (int)tr.size();
        tr.push_back(Node{v, v, rng(), 1, 0, 0, false});
        return id;
    };
    auto push = [&](int t) {
        if (!t || !tr[t].rev) return;
        swap(tr[t].l, tr[t].r);
        if (tr[t].l) tr[tr[t].l].rev ^= 1;
        if (tr[t].r) tr[tr[t].r].rev ^= 1;
        tr[t].rev = false;
    };
    auto pull = [&](int t) {
        if (!t) return;
        tr[t].sz = 1 + tr[tr[t].l].sz + tr[tr[t].r].sz;
        tr[t].sum = tr[t].val + tr[tr[t].l].sum + tr[tr[t].r].sum;
    };

    function<void(int, int, int&, int&)> split = [&](int t, int k, int& l, int& r) {
        if (!t) { l = r = 0; return; }
        push(t);
        int lsz = tr[tr[t].l].sz;
        if (lsz >= k) { split(tr[t].l, k, l, tr[t].l); r = t; }
        else { split(tr[t].r, k - lsz - 1, tr[t].r, r); l = t; }
        pull(t);
    };
    function<int(int, int)> merge = [&](int l, int r) {
        push(l); push(r);
        if (!l || !r) return l ? l : r;
        if (tr[l].prio > tr[r].prio) { tr[l].r = merge(tr[l].r, r); pull(l); return l; }
        tr[r].l = merge(l, tr[r].l); pull(r); return r;
    };

    int root = 0;
    for (int i = 0; i < n; i++) {
        long long x;
        cin >> x;
        root = merge(root, newNode(x));
    }

    while (m--) {
        int typ;
        cin >> typ;
        if (typ == 1) {
            int a, b, ab, c, ap, bp;
            cin >> a >> b;
            split(root, b, ab, c);
            split(ab, a - 1, ap, bp);
            if (bp) tr[bp].rev ^= 1;
            root = merge(merge(ap, bp), c);
        } else if (typ == 2) {
            int a, b, ab, c, ap, bp;
            cin >> a >> b;
            split(root, b, ab, c);
            split(ab, a - 1, ap, bp);
            cout << tr[bp].sum << "\\n";
            root = merge(merge(ap, bp), c);
        } else if (typ == 3) {
            int pos;
            long long x;
            cin >> pos >> x;
            int l, r;
            split(root, pos, l, r);
            root = merge(merge(l, newNode(x)), r);
        } else {
            int pos, lm, r, l, mid;
            cin >> pos;
            split(root, pos, lm, r);
            split(lm, pos - 1, l, mid);
            root = merge(l, r);
        }
    }
    return 0;
}`,
        rust: `use std::io::{self, Read};

#[derive(Default)]
struct Node {
    val: i64,
    sum: i64,
    prio: u64,
    sz: usize,
    l: usize,
    r: usize,
    rev: bool,
}

struct DynTreap {
    tr: Vec<Node>,
    rng: u64,
}

impl DynTreap {
    fn new(cap: usize) -> Self {
        let mut tr = Vec::with_capacity(cap + 2);
        tr.push(Node::default());
        Self { tr, rng: 98765432101234567 }
    }
    fn new_node(&mut self, v: i64) -> usize {
        self.rng ^= self.rng << 13;
        self.rng ^= self.rng >> 7;
        self.rng ^= self.rng << 17;
        let id = self.tr.len();
        self.tr.push(Node { val: v, sum: v, prio: self.rng, sz: 1, l: 0, r: 0, rev: false });
        id
    }
    fn push(&mut self, t: usize) {
        if t == 0 || !self.tr[t].rev { return; }
        let l = self.tr[t].l;
        let r = self.tr[t].r;
        self.tr[t].l = r;
        self.tr[t].r = l;
        if r != 0 { self.tr[r].rev = !self.tr[r].rev; }
        if l != 0 { self.tr[l].rev = !self.tr[l].rev; }
        self.tr[t].rev = false;
    }
    fn pull(&mut self, t: usize) {
        if t == 0 { return; }
        let l = self.tr[t].l;
        let r = self.tr[t].r;
        self.tr[t].sz = 1 + self.tr[l].sz + self.tr[r].sz;
        self.tr[t].sum = self.tr[t].val + self.tr[l].sum + self.tr[r].sum;
    }
    fn split(&mut self, t: usize, k: usize) -> (usize, usize) {
        if t == 0 { return (0, 0); }
        self.push(t);
        let lsz = self.tr[self.tr[t].l].sz;
        if lsz >= k {
            let (l, nr) = self.split(self.tr[t].l, k);
            self.tr[t].l = nr;
            self.pull(t);
            (l, t)
        } else {
            let (nl, r) = self.split(self.tr[t].r, k - lsz - 1);
            self.tr[t].r = nl;
            self.pull(t);
            (t, r)
        }
    }
    fn merge(&mut self, l: usize, r: usize) -> usize {
        self.push(l);
        self.push(r);
        if l == 0 { return r; }
        if r == 0 { return l; }
        if self.tr[l].prio > self.tr[r].prio {
            let nr = self.merge(self.tr[l].r, r);
            self.tr[l].r = nr;
            self.pull(l);
            l
        } else {
            let nl = self.merge(l, self.tr[r].l);
            self.tr[r].l = nl;
            self.pull(r);
            r
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
    let m: usize = it.next().unwrap().parse().unwrap();

    let mut dt = DynTreap::new(n + m);
    let mut root = 0usize;
    for _ in 0..n {
        let x: i64 = it.next().unwrap().parse().unwrap();
        let nd = dt.new_node(x);
        root = dt.merge(root, nd);
    }

    let mut out = String::new();
    for _ in 0..m {
        let typ: i32 = it.next().unwrap().parse().unwrap();
        if typ == 1 {
            let a: usize = it.next().unwrap().parse().unwrap();
            let b: usize = it.next().unwrap().parse().unwrap();
            let (ab, c) = dt.split(root, b);
            let (ap, bp) = dt.split(ab, a - 1);
            if bp != 0 { dt.tr[bp].rev = !dt.tr[bp].rev; }
            let m1 = dt.merge(ap, bp);
            root = dt.merge(m1, c);
        } else if typ == 2 {
            let a: usize = it.next().unwrap().parse().unwrap();
            let b: usize = it.next().unwrap().parse().unwrap();
            let (ab, c) = dt.split(root, b);
            let (ap, bp) = dt.split(ab, a - 1);
            out.push_str(&format!("{}\\n", dt.tr[bp].sum));
            let m1 = dt.merge(ap, bp);
            root = dt.merge(m1, c);
        } else if typ == 3 {
            let pos: usize = it.next().unwrap().parse().unwrap();
            let x: i64 = it.next().unwrap().parse().unwrap();
            let (l, r) = dt.split(root, pos);
            let nd = dt.new_node(x);
            let m1 = dt.merge(l, nd);
            root = dt.merge(m1, r);
        } else {
            let pos: usize = it.next().unwrap().parse().unwrap();
            let (lm, r) = dt.split(root, pos);
            let (l, _) = dt.split(lm, pos - 1);
            root = dt.merge(l, r);
        }
    }
    print!("{}", out);
}`,
        java21: `import java.io.IOException;
import java.io.InputStream;
import java.util.SplittableRandom;

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

    static long[] val, sum, prio;
    static int[] sz, lc, rc;
    static boolean[] rev;
    static int ptr = 0, splitL, splitR;
    static final SplittableRandom rng = new SplittableRandom(42);

    static int newNode(long v) {
        int id = ++ptr;
        val[id] = sum[id] = v;
        prio[id] = rng.nextLong();
        sz[id] = 1;
        return id;
    }
    static void push(int t) {
        if (t == 0 || !rev[t]) return;
        int tmp = lc[t]; lc[t] = rc[t]; rc[t] = tmp;
        if (lc[t] != 0) rev[lc[t]] = !rev[lc[t]];
        if (rc[t] != 0) rev[rc[t]] = !rev[rc[t]];
        rev[t] = false;
    }
    static void pull(int t) {
        if (t == 0) return;
        sz[t] = 1 + sz[lc[t]] + sz[rc[t]];
        sum[t] = val[t] + sum[lc[t]] + sum[rc[t]];
    }
    static void split(int t, int k) {
        if (t == 0) { splitL = 0; splitR = 0; return; }
        push(t);
        int lsz = sz[lc[t]];
        if (lsz >= k) { split(lc[t], k); lc[t] = splitR; pull(t); splitR = t; }
        else { split(rc[t], k - lsz - 1); rc[t] = splitL; pull(t); splitL = t; }
    }
    static int merge(int l, int r) {
        push(l); push(r);
        if (l == 0) return r;
        if (r == 0) return l;
        if (prio[l] > prio[r]) { rc[l] = merge(rc[l], r); pull(l); return l; }
        lc[r] = merge(l, lc[r]); pull(r); return r;
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        long nIn = fs.nextLong();
        if (nIn == Long.MIN_VALUE) return;
        int n = (int) nIn, m = (int) fs.nextLong();
        int cap = n + m + 5;
        val = new long[cap]; sum = new long[cap]; prio = new long[cap];
        sz = new int[cap]; lc = new int[cap]; rc = new int[cap];
        rev = new boolean[cap];

        int root = 0;
        for (int i = 0; i < n; i++) root = merge(root, newNode(fs.nextLong()));

        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < m; i++) {
            int typ = (int) fs.nextLong();
            if (typ == 1 || typ == 2) {
                int a = (int) fs.nextLong(), b = (int) fs.nextLong();
                split(root, b); int ab = splitL, c = splitR;
                split(ab, a - 1); int ap = splitL, bp = splitR;
                if (typ == 1) { if (bp != 0) rev[bp] = !rev[bp]; }
                else sb.append(sum[bp]).append('\\n');
                root = merge(merge(ap, bp), c);
            } else if (typ == 3) {
                int pos = (int) fs.nextLong();
                long x = fs.nextLong();
                split(root, pos);
                root = merge(merge(splitL, newNode(x)), splitR);
            } else {
                int pos = (int) fs.nextLong();
                split(root, pos); int lm = splitL, r = splitR;
                split(lm, pos - 1);
                root = merge(splitL, r);
            }
        }
        System.out.print(sb);
    }
}`,
        python3: `import random
import sys

sys.setrecursionlimit(200000)

def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(data)
    n = int(next(it))
    m = int(next(it))

    cap = n + m + 5
    val = [0] * cap
    ssum = [0] * cap
    prio = [0] * cap
    sz = [0] * cap
    lc = [0] * cap
    rc = [0] * cap
    rev = [False] * cap
    rng = random.Random(42)
    ptr = 0

    def new_node(v: int) -> int:
        nonlocal ptr
        ptr += 1
        val[ptr] = ssum[ptr] = v
        prio[ptr] = rng.getrandbits(60)
        sz[ptr] = 1
        return ptr

    def push(t: int) -> None:
        if t and rev[t]:
            lc[t], rc[t] = rc[t], lc[t]
            if lc[t]:
                rev[lc[t]] = not rev[lc[t]]
            if rc[t]:
                rev[rc[t]] = not rev[rc[t]]
            rev[t] = False

    def pull(t: int) -> None:
        if t:
            l, r = lc[t], rc[t]
            sz[t] = 1 + sz[l] + sz[r]
            ssum[t] = val[t] + ssum[l] + ssum[r]

    def split(t: int, k: int):
        if not t:
            return 0, 0
        push(t)
        lsz = sz[lc[t]]
        if lsz >= k:
            l, nr = split(lc[t], k)
            lc[t] = nr
            pull(t)
            return l, t
        nl, r = split(rc[t], k - lsz - 1)
        rc[t] = nl
        pull(t)
        return t, r

    def merge(l: int, r: int) -> int:
        push(l)
        push(r)
        if not l or not r:
            return l or r
        if prio[l] > prio[r]:
            rc[l] = merge(rc[l], r)
            pull(l)
            return l
        lc[r] = merge(l, lc[r])
        pull(r)
        return r

    root = 0
    for _ in range(n):
        root = merge(root, new_node(int(next(it))))

    out = []
    for _ in range(m):
        typ = int(next(it))
        if typ == 1 or typ == 2:
            a = int(next(it))
            b = int(next(it))
            ab, c = split(root, b)
            ap, bp = split(ab, a - 1)
            if typ == 1:
                if bp:
                    rev[bp] = not rev[bp]
            else:
                out.append(str(ssum[bp]))
            root = merge(merge(ap, bp), c)
        elif typ == 3:
            pos = int(next(it))
            x = int(next(it))
            l, r = split(root, pos)
            root = merge(merge(l, new_node(x)), r)
        else:
            pos = int(next(it))
            lm, r = split(root, pos)
            l, _ = split(lm, pos - 1)
            root = merge(l, r)

    sys.stdout.write("\\n".join(out) + "\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
idx = 0
n = tokens[idx].to_i; idx += 1
m = tokens[idx].to_i; idx += 1

cap = n + m + 5
val = Array.new(cap, 0)
sum_arr = Array.new(cap, 0)
prio = Array.new(cap, 0)
sz = Array.new(cap, 0)
lc = Array.new(cap, 0)
rc = Array.new(cap, 0)
rev = Array.new(cap, false)
rng = Random.new(42)
ptr = 0

new_node = lambda do |v|
  ptr += 1
  val[ptr] = sum_arr[ptr] = v
  prio[ptr] = rng.rand(1 << 60)
  sz[ptr] = 1
  ptr
end

push = lambda do |t|
  return if t == 0 || !rev[t]
  lc[t], rc[t] = rc[t], lc[t]
  rev[lc[t]] = !rev[lc[t]] if lc[t] != 0
  rev[rc[t]] = !rev[rc[t]] if rc[t] != 0
  rev[t] = false
end

pull = lambda do |t|
  return if t == 0
  sz[t] = 1 + sz[lc[t]] + sz[rc[t]]
  sum_arr[t] = val[t] + sum_arr[lc[t]] + sum_arr[rc[t]]
end

split = lambda do |t, k|
  return [0, 0] if t == 0
  push.call(t)
  lsz = sz[lc[t]]
  if lsz >= k
    l, nr = split.call(lc[t], k)
    lc[t] = nr
    pull.call(t)
    [l, t]
  else
    nl, r = split.call(rc[t], k - lsz - 1)
    rc[t] = nl
    pull.call(t)
    [t, r]
  end
end

merge = lambda do |l, r|
  push.call(l)
  push.call(r)
  return r if l == 0
  return l if r == 0
  if prio[l] > prio[r]
    rc[l] = merge.call(rc[l], r)
    pull.call(l)
    l
  else
    lc[r] = merge.call(l, lc[r])
    pull.call(r)
    r
  end
end

root = 0
n.times do
  root = merge.call(root, new_node.call(tokens[idx].to_i))
  idx += 1
end

out = []
m.times do
  typ = tokens[idx].to_i; idx += 1
  if typ == 1 || typ == 2
    a = tokens[idx].to_i; b = tokens[idx + 1].to_i; idx += 2
    ab, c = split.call(root, b)
    ap, bp = split.call(ab, a - 1)
    if typ == 1
      rev[bp] = !rev[bp] if bp != 0
    else
      out << sum_arr[bp].to_s
    end
    root = merge.call(merge.call(ap, bp), c)
  elsif typ == 3
    pos = tokens[idx].to_i; x = tokens[idx + 1].to_i; idx += 2
    l, r = split.call(root, pos)
    root = merge.call(merge.call(l, new_node.call(x)), r)
  else
    pos = tokens[idx].to_i; idx += 1
    lm, r = split.call(root, pos)
    l, _ = split.call(lm, pos - 1)
    root = merge.call(l, r)
  end
end
puts out.join("\\n")`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'CSES',
      title: 'Cut and Paste / Substring Reversals / Reversals and Sums',
      difficulty: 'Platinum (2150)',
      url: 'https://cses.fi/problemset/task/2072',
      patternNote: 'Canonical 3-problem suite for Implicit Treap split, merge, and lazy rev propagation.',
    },
    {
      platform: 'Codeforces',
      title: 'Pearls in a Row / Reverse and Rotate (863D)',
      difficulty: '1800–2200',
      url: 'https://codeforces.com/problemset/problem/863/D',
      patternNote: 'Simulate cyclic shifts and subarray reversals directly in O(log N) per step.',
    },
    {
      platform: 'AtCoder',
      title: 'ABC350 F — Transpose / String Rope',
      difficulty: '2100',
      url: 'https://atcoder.jp/contests/abc350/tasks/abc350_f',
      patternNote: 'Lazy reversal + case-flip propagation on nested bracket intervals.',
    },
    {
      platform: 'CodeChef',
      title: 'Persistent Treap / Dynamic Array Splicing',
      difficulty: '2300',
      url: 'https://www.codechef.com/problems/CARDSHUF',
      patternNote: 'Multi-cut card shuffling and reversal modeled via Implicit Treap splits.',
    },
    {
      platform: 'HackerRank',
      title: 'Array and Simple Queries',
      difficulty: 'Hard',
      url: 'https://www.hackerrank.com/challenges/array-and-simple-queries',
      patternNote: 'Move any segment [i, j] to front or back in O(log N) using Implicit Treap.',
    },
    {
      platform: 'NeetCode 150',
      title: 'Design Text Editor (Rope Extension)',
      difficulty: 'Hard',
      url: 'https://neetcode.io/practice',
      patternNote: 'Scale cursor-based edit buffers to arbitrary range reverse/copy-paste in O(log N).',
    },
  ],
  interviewNotes: [
    'Why use an Implicit Treap instead of a Splay Tree? Treaps have a ~35-line iterative/recursive `split` + `merge` implementation with zero zig-zig/zig-zag rotation cases AND support **persistence** (just copy a node before modifying it!).',
    'Never compute node positions explicitly inside `split`; always evaluate `leftSz = sz[lc[t]]` AFTER `push(t)` and pass `k - leftSz - 1` when descending right.',
    'Wait-free persistence comes from cloning: if asked to preserve historical text versions after cut/paste, allocate a fresh copy inside `push`, `split`, and `merge` whenever mutating a node.',
  ],
  projectBlueprint: {
    title: 'Collaborative Rope Text Editor & Undoable Buffer Engine',
    tagline:
      'In-memory TypeScript Rope backed by a randomized Implicit Treap supporting O(log N) range splice, substring reversal, and immutable version snapshots.',
    stackSummary: 'TypeScript / Node.js with Flat-Array Implicit Treap & Copy-on-Write Snapshots',
    asciiDiagram: `[Document Buffer] -> [split(root, end)] -> [split(left, start-1)]
                            |                     |
                            v                     v
                 [Slice B: rev ^= 1]     [Cut-Paste / Merge A+C+B]`,
    milestones: [
      {
        id: 'm1',
        title: 'Flat-Arena Implicit Treap',
        detail: 'Implement 1-indexed typed arrays for value, subtree size, random priority, and lazy rev.',
      },
      {
        id: 'm2',
        title: 'O(log N) Splice & Reverse',
        detail: 'Support cut-and-paste, insert-at-cursor, erase-slice, and range-reversal primitives.',
      },
      {
        id: 'm3',
        title: 'In-Order Buffer Serializer',
        detail: 'Materialize live text views with lazy flag flushing in O(N) when exporting snapshots.',
      },
    ],
    starterCode: `export class ImplicitRope {
  private val: string[] = [''];
  private prio: number[] = [0];
  private sz: number[] = [0];
  private lc: number[] = [0];
  private rc: number[] = [0];
  private rev: boolean[] = [false];
  private root = 0;

  private newNode(ch: string): number {
    const id = this.val.length;
    this.val.push(ch);
    this.prio.push(Math.random());
    this.sz.push(1);
    this.lc.push(0);
    this.rc.push(0);
    this.rev.push(false);
    return id;
  }

  private push(t: number): void {
    if (!t || !this.rev[t]) return;
    const tmp = this.lc[t];
    this.lc[t] = this.rc[t];
    this.rc[t] = tmp;
    if (this.lc[t]) this.rev[this.lc[t]] = !this.rev[this.lc[t]];
    if (this.rc[t]) this.rev[this.rc[t]] = !this.rev[this.rc[t]];
    this.rev[t] = false;
  }

  private pull(t: number): void {
    if (t) this.sz[t] = 1 + this.sz[this.lc[t]] + this.sz[this.rc[t]];
  }

  private split(t: number, k: number): [number, number] {
    if (!t) return [0, 0];
    this.push(t);
    const lsz = this.sz[this.lc[t]];
    if (lsz >= k) {
      const [l, nr] = this.split(this.lc[t], k);
      this.lc[t] = nr;
      this.pull(t);
      return [l, t];
    }
    const [nl, r] = this.split(this.rc[t], k - lsz - 1);
    this.rc[t] = nl;
    this.pull(t);
    return [t, r];
  }

  private merge(l: number, r: number): number {
    this.push(l);
    this.push(r);
    if (!l || !r) return l || r;
    if (this.prio[l] > this.prio[r]) {
      this.rc[l] = this.merge(this.rc[l], r);
      this.pull(l);
      return l;
    }
    this.lc[r] = this.merge(l, this.lc[r]);
    this.pull(r);
    return r;
  }

  public appendText(text: string): void {
    for (const ch of text) this.root = this.merge(this.root, this.newNode(ch));
  }

  public reverseRange(l1: number, r1: number): void {
    const [ab, c] = this.split(this.root, r1);
    const [a, b] = this.split(ab, l1 - 1);
    if (b) this.rev[b] = !this.rev[b];
    this.root = this.merge(this.merge(a, b), c);
  }

  public toString(): string {
    const out: string[] = [];
    const dfs = (t: number) => {
      if (!t) return;
      this.push(t);
      dfs(this.lc[t]);
      out.push(this.val[t]);
      dfs(this.rc[t]);
    };
    dfs(this.root);
    return out.join('');
  }
}

const rope = new ImplicitRope();
rope.appendText('AYBABTU');
rope.reverseRange(3, 4);
rope.reverseRange(4, 7);
console.log('Result:', rope.toString());`,
  },
};
