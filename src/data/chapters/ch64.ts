import type { TheoryChapter } from '../../types/vault';

export const CH64_WAVELET_TREES_FRACTIONAL_CASCADING: TheoryChapter = {
  slug: 'merge-sort-wavelet-tree',
  topicId: 'ds-15',
  title: 'Wavelet Trees & Fractional Cascading',
  domain: 'Data Structures',
  ratingTier: '2200–2600',
  usacoDivision: 'Platinum',
  subtitle: 'Value-domain binary partitioning with O(log Sigma) range quantile, frequency, and bounded prefix queries',
  analogyTitle: 'A Digital Post-Office Sorter Built Over Value Ranges Instead of Array Indices',
  analogyBody:
    'A standard Segment Tree partitions the array by index [1..N]. A Wavelet Tree flips that perspective completely: every node represents a contiguous interval of VALUES [lo, hi] and preserves the relative left-to-right order of the elements falling inside [lo, hi].\n\nEach internal node picks midpoint mid = (lo + hi) / 2 and routes every element <= mid to its left child and > mid to its right child, storing ONLY a tiny prefix-count array b[i] = number of elements in the first i positions routed left. With just that prefix array (and optional prefix sums), a subsegment [L, R] at the root maps cleanly to [b[L-1] + 1, b[R]] in the left child and [(L-1 - b[L-1]) + 1, R - b[R]] in the right child—answering range K-th smallest, range frequency of X, and range count/sum <= K in strict O(log Sigma) time without O(log^2 N) nested searches.\n\nWhen you need to preserve array-index partitioning (like a Merge-Sort Tree), Fractional Cascading wires downward left/right index pointers between adjacent sorted arrays so a single initial binary search cascades down all O(log N) levels in O(1) per level.',
  prerequisites: [
    { slug: 'persistent-segment-tree', title: 'Persistent Segment Trees & Offline K-th Queries' },
  ],
  traceTitle: 'Wavelet Tree Top-Down Range Navigation',
  traceSubtitle: 'Finding the 2nd smallest element in A[2..5] on A = [5, 2, 6, 2, 3, 2] (compressed values 1..4)',
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Root Node [lo=1, hi=4] (mid = 2) Routes Elements',
      explanation: 'Map values {2->1, 3->2, 5->3, 6->4}, giving compressed array [3, 1, 4, 1, 2, 1]. Prefix array b stores counts <= 2: b = [0, 0, 1, 1, 2, 3, 4].',
      mode: 'array',
      arrays: [
        {
          name: 'Root Prefix Count b[0..6]',
          cells: [
            { index: 0, value: 0, label: 'b[0]', highlight: 'neutral' },
            { index: 1, value: 0, label: '5>2', highlight: 'neutral' },
            { index: 2, value: 1, label: '2<=2', highlight: 'window' },
            { index: 3, value: 1, label: '6>2', highlight: 'window' },
            { index: 4, value: 2, label: '2<=2', highlight: 'window' },
            { index: 5, value: 3, label: '3<=2', highlight: 'active' },
            { index: 6, value: 4, label: '2<=2', highlight: 'neutral' },
          ],
        },
      ],
      variables: { query: 'kth(2, 5, k=2)', inLeft: 'b[5]-b[1] = 3 - 0 = 3', branch: 'go LEFT' },
    },
    {
      stepNumber: 2,
      title: 'Step Down to Left Child [lo=1, hi=2] (mid = 1)',
      explanation: 'Since k = 2 <= inLeft (3), descend left with remapped range [b[1]+1, b[5]] = [1, 3]. The left child holds [1, 1, 2, 1] with prefix array b_L = [0, 1, 2, 2, 3].',
      mode: 'array',
      arrays: [
        {
          name: 'Left Child [1..2] Sequence & b_L',
          cells: [
            { index: 1, value: 1, label: 'val=2, b=1', highlight: 'window' },
            { index: 2, value: 1, label: 'val=2, b=2', highlight: 'window' },
            { index: 3, value: 2, label: 'val=3, b=2', highlight: 'active' },
            { index: 4, value: 1, label: 'val=2, b=3', highlight: 'neutral' },
          ],
        },
      ],
      variables: { subRange: '[1, 3]', inLeftLeft: 'b_L[3] - b_L[0] = 2', k: 2, branch: 'go LEFT' },
    },
    {
      stepNumber: 3,
      title: 'Hit Leaf Node [lo=1, hi=1] and Decompress',
      explanation: 'Because k = 2 <= 2, descend to leaf [lo=1, hi=1]. Return sorted unique value uncomp[1] = 2.',
      mode: 'array',
      arrays: [
        {
          name: 'Leaf [1..1] Answer',
          cells: [
            { index: 1, value: 2, label: 'sorted[1]', highlight: 'active' },
            { index: 2, value: 3, label: 'sorted[2]', highlight: 'neutral' },
            { index: 3, value: 5, label: 'sorted[3]', highlight: 'neutral' },
            { index: 4, value: 6, label: 'sorted[4]', highlight: 'neutral' },
          ],
        },
      ],
      variables: { leafValueId: 1, originalValue: 2, complexity: 'O(log Sigma)' },
    },
  ],
  reductionClues: [
    {
      clue: 'Static range K-th smallest, range frequency of X, and range count <= K on [L, R] without offline sorting',
      translation: 'Coordinate-compress distinct values to [1..U] and answer every query online in O(log U) via a Wavelet Tree.',
    },
    {
      clue: 'Need BOTH count and exact sum of elements <= K in subarray [L, R]',
      translation: 'Augment each Wavelet Tree node with prefix sums prefSum[i] of elements at that node; add left prefSum in O(1) when K > mid.',
    },
    {
      clue: 'Support adjacent swap (swap A[i], A[i+1]) alongside online K-th smallest / frequency queries',
      translation: 'Walk down the Wavelet Tree: if A[i] and A[i+1] split across mid, update b[i] in O(1) and halt; if both go to the same child, recurse.',
    },
    {
      clue: 'Eliminate O(log N) binary searches inside O(log N) Merge-Sort Tree nodes',
      translation: 'Precompute Fractional Cascading arrays storing for each element i in merged node its lower_bound index in left and right children.',
    },
  ],
  timeComplexity: 'O(N log Sigma) build, O(log Sigma) per query / adjacent swap',
  spaceComplexity: 'O(N log Sigma) prefix arrays (succinct O(N log Sigma) bits with bitvectors)',
  pitfalls: [
    {
      type: 'WA',
      title: 'Off-by-One Remapping of Right-Child Subranges',
      detail: 'For 1-indexed [L, R], elements in [1..i] routed to the LEFT child are b[i], so elements routed to the RIGHT child are (i - b[i]). Thus [L, R] maps to [b[L-1] + 1, b[R]] on the left and [(L - 1 - b[L - 1]) + 1, R - b[R]] on the right.',
    },
    {
      type: 'MLE',
      title: 'Building Wavelet Tree Over Raw 10^9 Values Without Compression',
      detail: 'If values reach 10^9 and you skip coordinate compression, the tree requires 30+ levels and allocates huge vectors or crashes. Always sort+unique into [0..U-1] first.',
    },
    {
      type: 'WA',
      title: 'Counting Frequency of X Not Present in Array',
      detail: 'If a frequency query asks for a value X absent from the compressed dictionary, return 0 immediately before indexing compressed IDs; otherwise lower_bound matches the wrong neighbor.',
    },
    {
      type: 'WA',
      title: 'Using A[i] Inside Swap After Mutating Only One Child',
      detail: 'During an adjacent swap swap(A[i], A[i+1]) on a Wavelet Tree, update the base array A[i], A[i+1] ONLY after the recursive tree update completes (or pass old values before swapping).',
    },
  ],
  implementations: {
    cpp20: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

// Wavelet Tree supporting O(log U) Range K-th Smallest and Range Frequency
struct WaveletTree {
    struct Node {
        int lo, hi, left, right;
        vector<int> b;
    };
    vector<Node> tree;

    int build(vector<int>& arr, int lo, int hi) {
        int id = static_cast<int>(tree.size());
        tree.push_back({lo, hi, -1, -1, {}});
        if (lo == hi || arr.empty()) return id;

        int mid = lo + (hi - lo) / 2;
        tree[id].b.resize(arr.size() + 1, 0);
        vector<int> leftArr, rightArr;
        leftArr.reserve(arr.size());
        rightArr.reserve(arr.size());

        for (size_t i = 0; i < arr.size(); ++i) {
            bool goLeft = (arr[i] <= mid);
            tree[id].b[i + 1] = tree[id].b[i] + (goLeft ? 1 : 0);
            if (goLeft) leftArr.push_back(arr[i]);
            else rightArr.push_back(arr[i]);
        }
        arr.clear();
        arr.shrink_to_fit();

        int lChild = build(leftArr, lo, mid);
        int rChild = build(rightArr, mid + 1, hi);
        tree[id].left = lChild;
        tree[id].right = rChild;
        return id;
    }

    int kth(int id, int l, int r, int k) const {
        if (tree[id].lo == tree[id].hi) return tree[id].lo;
        int lb = tree[id].b[l - 1];
        int rb = tree[id].b[r];
        int inLeft = rb - lb;
        if (k <= inLeft) {
            return kth(tree[id].left, lb + 1, rb, k);
        }
        return kth(tree[id].right, l - lb, r - rb, k - inLeft);
    }

    int freq(int id, int l, int r, int val) const {
        if (l > r || val < tree[id].lo || val > tree[id].hi) return 0;
        if (tree[id].lo == tree[id].hi) return r - l + 1;
        int mid = tree[id].lo + (tree[id].hi - tree[id].lo) / 2;
        int lb = tree[id].b[l - 1];
        int rb = tree[id].b[r];
        if (val <= mid) {
            return freq(tree[id].left, lb + 1, rb, val);
        }
        return freq(tree[id].right, l - lb, r - rb, val);
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, q;
    if (!(cin >> n >> q)) return 0;
    vector<int> raw(n);
    for (int i = 0; i < n; ++i) cin >> raw[i];

    vector<int> vals = raw;
    sort(vals.begin(), vals.end());
    vals.erase(unique(vals.begin(), vals.end()), vals.end());

    vector<int> comp(n);
    for (int i = 0; i < n; ++i) {
        comp[i] = static_cast<int>(lower_bound(vals.begin(), vals.end(), raw[i]) - vals.begin());
    }

    WaveletTree wt;
    int root = wt.build(comp, 0, static_cast<int>(vals.size()) - 1);

    while (q--) {
        int type, l, r;
        cin >> type >> l >> r;
        if (type == 1) {
            int k;
            cin >> k;
            cout << vals[wt.kth(root, l, r, k)] << "\\n";
        } else {
            int x;
            cin >> x;
            auto it = lower_bound(vals.begin(), vals.end(), x);
            if (it == vals.end() || *it != x) {
                cout << 0 << "\\n";
            } else {
                cout << wt.freq(root, l, r, static_cast<int>(it - vals.begin())) << "\\n";
            }
        }
    }
    return 0;
}
`,
    rust: `use std::io::{self, Read, Write, BufWriter};

struct Node {
    lo: usize,
    hi: usize,
    left: usize,
    right: usize,
    b: Vec<usize>,
}

struct WaveletTree {
    nodes: Vec<Node>,
}

impl WaveletTree {
    fn new(arr: Vec<usize>, u: usize) -> Self {
        let mut wt = WaveletTree { nodes: Vec::new() };
        wt.build(arr, 0, u - 1);
        wt
    }

    fn build(&mut self, arr: Vec<usize>, lo: usize, hi: usize) -> usize {
        let id = self.nodes.len();
        if lo == hi || arr.is_empty() {
            self.nodes.push(Node { lo, hi, left: 0, right: 0, b: Vec::new() });
            return id;
        }
        let mid = lo + (hi - lo) / 2;
        let mut b = vec![0usize; arr.len() + 1];
        let mut left_arr = Vec::new();
        let mut right_arr = Vec::new();
        for (i, &v) in arr.iter().enumerate() {
            if v <= mid {
                b[i + 1] = b[i] + 1;
                left_arr.push(v);
            } else {
                b[i + 1] = b[i];
                right_arr.push(v);
            }
        }
        self.nodes.push(Node { lo, hi, left: 0, right: 0, b });
        let l_id = self.build(left_arr, lo, mid);
        let r_id = self.build(right_arr, mid + 1, hi);
        self.nodes[id].left = l_id;
        self.nodes[id].right = r_id;
        id
    }

    fn kth(&self, mut id: usize, mut l: usize, mut r: usize, mut k: usize) -> usize {
        while self.nodes[id].lo != self.nodes[id].hi {
            let lb = self.nodes[id].b[l - 1];
            let rb = self.nodes[id].b[r];
            let in_left = rb - lb;
            if k <= in_left {
                l = lb + 1;
                r = rb;
                id = self.nodes[id].left;
            } else {
                k -= in_left;
                l = l - lb;
                r = r - rb;
                id = self.nodes[id].right;
            }
        }
        self.nodes[id].lo
    }

    fn freq(&self, mut id: usize, mut l: usize, mut r: usize, val: usize) -> usize {
        while l <= r {
            let node = &self.nodes[id];
            if val < node.lo || val > node.hi {
                return 0;
            }
            if node.lo == node.hi {
                return r - l + 1;
            }
            let mid = node.lo + (node.hi - node.lo) / 2;
            let lb = node.b[l - 1];
            let rb = node.b[r];
            if val <= mid {
                l = lb + 1;
                r = rb;
                id = node.left;
            } else {
                l = l - lb;
                r = r - rb;
                id = node.right;
            }
        }
        0
    }
}

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let n: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };
    let q: usize = it.next().unwrap().parse().unwrap();
    let mut raw = Vec::with_capacity(n);
    for _ in 0..n {
        raw.push(it.next().unwrap().parse::<i64>().unwrap());
    }

    let mut vals = raw.clone();
    vals.sort_unstable();
    vals.dedup();
    let comp: Vec<usize> = raw.iter().map(|v| vals.binary_search(v).unwrap()).collect();
    let wt = WaveletTree::new(comp, vals.len());

    let out = io::stdout();
    let mut bw = BufWriter::new(out.lock());
    for _ in 0..q {
        let t: usize = it.next().unwrap().parse().unwrap();
        let l: usize = it.next().unwrap().parse().unwrap();
        let r: usize = it.next().unwrap().parse().unwrap();
        if t == 1 {
            let k: usize = it.next().unwrap().parse().unwrap();
            writeln!(bw, "{}", vals[wt.kth(0, l, r, k)]).unwrap();
        } else {
            let x: i64 = it.next().unwrap().parse().unwrap();
            match vals.binary_search(&x) {
                Ok(idx) => writeln!(bw, "{}", wt.freq(0, l, r, idx)).unwrap(),
                Err(_) => writeln!(bw, "0").unwrap(),
            }
        }
    }
}
`,
    java21: `import java.io.BufferedInputStream;
import java.io.IOException;
import java.util.Arrays;

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
                if (c == -1) return Integer.MIN_VALUE;
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

    static class Node {
        int lo, hi;
        int[] b;
        Node left, right;
        Node(int lo, int hi) { this.lo = lo; this.hi = hi; }
    }

    static Node build(int[] arr, int len, int lo, int hi) {
        Node node = new Node(lo, hi);
        if (lo == hi || len == 0) return node;
        int mid = lo + (hi - lo) / 2;
        node.b = new int[len + 1];
        int leftCount = 0;
        for (int i = 0; i < len; i++) {
            boolean goLeft = arr[i] <= mid;
            node.b[i + 1] = node.b[i] + (goLeft ? 1 : 0);
            if (goLeft) leftCount++;
        }
        int[] leftArr = new int[leftCount];
        int[] rightArr = new int[len - leftCount];
        int li = 0, ri = 0;
        for (int i = 0; i < len; i++) {
            if (arr[i] <= mid) leftArr[li++] = arr[i];
            else rightArr[ri++] = arr[i];
        }
        node.left = build(leftArr, leftCount, lo, mid);
        node.right = build(rightArr, len - leftCount, mid + 1, hi);
        return node;
    }

    static int kth(Node node, int l, int r, int k) {
        while (node.lo != node.hi) {
            int lb = node.b[l - 1];
            int rb = node.b[r];
            int inLeft = rb - lb;
            if (k <= inLeft) {
                l = lb + 1;
                r = rb;
                node = node.left;
            } else {
                k -= inLeft;
                l = l - lb;
                r = r - rb;
                node = node.right;
            }
        }
        return node.lo;
    }

    static int freq(Node node, int l, int r, int val) {
        while (l <= r) {
            if (val < node.lo || val > node.hi) return 0;
            if (node.lo == node.hi) return r - l + 1;
            int mid = node.lo + (node.hi - node.lo) / 2;
            int lb = node.b[l - 1];
            int rb = node.b[r];
            if (val <= mid) {
                l = lb + 1;
                r = rb;
                node = node.left;
            } else {
                l = l - lb;
                r = r - rb;
                node = node.right;
            }
        }
        return 0;
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        int n = fs.nextInt();
        if (n == Integer.MIN_VALUE) return;
        int q = fs.nextInt();
        int[] raw = new int[n];
        for (int i = 0; i < n; i++) raw[i] = fs.nextInt();

        int[] sorted = raw.clone();
        Arrays.sort(sorted);
        int u = 0;
        for (int i = 0; i < n; i++) {
            if (u == 0 || sorted[i] != sorted[u - 1]) sorted[u++] = sorted[i];
        }
        int[] vals = Arrays.copyOf(sorted, u);
        int[] comp = new int[n];
        for (int i = 0; i < n; i++) comp[i] = Arrays.binarySearch(vals, raw[i]);

        Node root = build(comp, n, 0, u - 1);
        StringBuilder sb = new StringBuilder();
        while (q-- > 0) {
            int t = fs.nextInt();
            int l = fs.nextInt();
            int r = fs.nextInt();
            if (t == 1) {
                int k = fs.nextInt();
                sb.append(vals[kth(root, l, r, k)]).append('\\n');
            } else {
                int x = fs.nextInt();
                int idx = Arrays.binarySearch(vals, x);
                sb.append(idx < 0 ? 0 : freq(root, l, r, idx)).append('\\n');
            }
        }
        System.out.print(sb.toString());
    }
}
`,
    python3: `import bisect
import sys

sys.setrecursionlimit(200000)


class WaveletNode:
    __slots__ = ("lo", "hi", "b", "left", "right")

    def __init__(self, lo: int, hi: int) -> None:
        self.lo = lo
        self.hi = hi
        self.b: list[int] = []
        self.left: WaveletNode | None = None
        self.right: WaveletNode | None = None


def build(arr: list[int], lo: int, hi: int) -> WaveletNode:
    node = WaveletNode(lo, hi)
    if lo == hi or not arr:
        return node
    mid = (lo + hi) // 2
    b = [0] * (len(arr) + 1)
    left_arr: list[int] = []
    right_arr: list[int] = []
    for i, v in enumerate(arr):
        if v <= mid:
            b[i + 1] = b[i] + 1
            left_arr.append(v)
        else:
            b[i + 1] = b[i]
            right_arr.append(v)
    node.b = b
    node.left = build(left_arr, lo, mid)
    node.right = build(right_arr, mid + 1, hi)
    return node


def kth(node: WaveletNode, l: int, r: int, k: int) -> int:
    while node.lo != node.hi:
        lb = node.b[l - 1]
        rb = node.b[r]
        in_left = rb - lb
        if k <= in_left:
            l = lb + 1
            r = rb
            node = node.left  # type: ignore[assignment]
        else:
            k -= in_left
            l = l - lb
            r = r - rb
            node = node.right  # type: ignore[assignment]
    return node.lo


def freq(node: WaveletNode, l: int, r: int, val: int) -> int:
    while l <= r:
        if val < node.lo or val > node.hi:
            return 0
        if node.lo == node.hi:
            return r - l + 1
        mid = (node.lo + node.hi) // 2
        lb = node.b[l - 1]
        rb = node.b[r]
        if val <= mid:
            l = lb + 1
            r = rb
            node = node.left  # type: ignore[assignment]
        else:
            l = l - lb
            r = r - rb
            node = node.right  # type: ignore[assignment]
    return 0


def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    q = int(data[1])
    raw = [int(v) for v in data[2 : 2 + n]]

    vals = sorted(set(raw))
    comp = [bisect.bisect_left(vals, v) for v in raw]
    root = build(comp, 0, len(vals) - 1)

    out: list[str] = []
    idx = 2 + n
    for _ in range(q):
        t = int(data[idx])
        l = int(data[idx + 1])
        r = int(data[idx + 2])
        arg = int(data[idx + 3])
        idx += 4
        if t == 1:
            out.append(str(vals[kth(root, l, r, arg)]))
        else:
            pos = bisect.bisect_left(vals, arg)
            if pos == len(vals) or vals[pos] != arg:
                out.append("0")
            else:
                out.append(str(freq(root, l, r, pos)))

    sys.stdout.write("\\n".join(out) + "\\n")


if __name__ == "__main__":
    solve()
`,
    ruby: `class WaveletNode
  attr_accessor :lo, :hi, :b, :left, :right

  def initialize(lo, hi)
    @lo = lo
    @hi = hi
    @b = []
    @left = nil
    @right = nil
  end
end

def build_wt(arr, lo, hi)
  node = WaveletNode.new(lo, hi)
  return node if lo == hi || arr.empty?

  mid = (lo + hi) / 2
  b = Array.new(arr.length + 1, 0)
  left_arr = []
  right_arr = []
  arr.each_with_index do |v, i|
    if v <= mid
      b[i + 1] = b[i] + 1
      left_arr << v
    else
      b[i + 1] = b[i]
      right_arr << v
    end
  end
  node.b = b
  node.left = build_wt(left_arr, lo, mid)
  node.right = build_wt(right_arr, mid + 1, hi)
  node
end

def query_kth(node, l, r, k)
  while node.lo != node.hi
    lb = node.b[l - 1]
    rb = node.b[r]
    in_left = rb - lb
    if k <= in_left
      l = lb + 1
      r = rb
      node = node.left
    else
      k -= in_left
      l -= lb
      r -= rb
      node = node.right
    end
  end
  node.lo
end

def query_freq(node, l, r, val)
  while l <= r
    return 0 if val < node.lo || val > node.hi
    return r - l + 1 if node.lo == node.hi

    mid = (node.lo + node.hi) / 2
    lb = node.b[l - 1]
    rb = node.b[r]
    if val <= mid
      l = lb + 1
      r = rb
      node = node.left
    else
      l -= lb
      r -= rb
      node = node.right
    end
  end
  0
end

data = $stdin.read.split
exit if data.empty?
n = data[0].to_i
q = data[1].to_i
raw = data[2, n].map(&:to_i)

vals = raw.uniq.sort
rank_of = {}
vals.each_with_index { |v, i| rank_of[v] = i }
comp = raw.map { |v| rank_of[v] }
root = build_wt(comp, 0, vals.length - 1)

out = []
idx = 2 + n
q.times do
  t = data[idx].to_i
  l = data[idx + 1].to_i
  r = data[idx + 2].to_i
  arg = data[idx + 3].to_i
  idx += 4
  if t == 1
    out << vals[query_kth(root, l, r, arg)].to_s
  else
    id = rank_of[arg]
    out << (id.nil? ? '0' : query_freq(root, l, r, id).to_s)
  end
end

puts out.join("\\n")
`,
  },
  practiceProblems: [
    {
      id: 'ch64-p1',
      tier: 'Warmup',
      ratingRange: '2100–2300',
      title: 'Static Range K-th Smallest & Frequency Queries',
      statement:
        'Given a static 1-indexed array A of N integers and Q queries of two types: "1 L R K" asks for the K-th smallest integer in subarray A[L..R]; "2 L R X" asks how many times X occurs in A[L..R]. Answer all queries online in O(log Sigma) per query using a Wavelet Tree.',
      constraints: '1 <= N, Q <= 10^5, |A[i]| <= 10^9, 1 <= L <= R <= N',
      sampleInput: '6 3\n5 2 6 2 3 2\n1 2 5 2\n2 1 6 2\n1 1 6 5',
      sampleOutput: '2\n3\n5',
      hints: [
        'Coordinate-compress A[1..N] into dense IDs 0..U-1 so tree depth is guaranteed <= ceil(log2 N).',
        'At node [lo, hi] with mid = (lo + hi) / 2, count elements routed left inside [L, R] via inLeft = b[R] - b[L - 1].',
        'For K-th smallest, descend left if K <= inLeft, otherwise subtract inLeft from K and descend right; for frequency of val, compare val <= mid to pick a single branch.',
      ],
      solutions: {
        cpp20: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

struct WaveletTree {
    struct Node {
        int lo, hi, left, right;
        vector<int> b;
    };
    vector<Node> tree;

    int build(vector<int>& arr, int lo, int hi) {
        int id = static_cast<int>(tree.size());
        tree.push_back({lo, hi, -1, -1, {}});
        if (lo == hi || arr.empty()) return id;
        int mid = lo + (hi - lo) / 2;
        tree[id].b.resize(arr.size() + 1, 0);
        vector<int> lArr, rArr;
        for (size_t i = 0; i < arr.size(); ++i) {
            bool left = arr[i] <= mid;
            tree[id].b[i + 1] = tree[id].b[i] + (left ? 1 : 0);
            if (left) lArr.push_back(arr[i]);
            else rArr.push_back(arr[i]);
        }
        int lc = build(lArr, lo, mid);
        int rc = build(rArr, mid + 1, hi);
        tree[id].left = lc;
        tree[id].right = rc;
        return id;
    }

    int kth(int id, int l, int r, int k) const {
        while (tree[id].lo != tree[id].hi) {
            int lb = tree[id].b[l - 1], rb = tree[id].b[r];
            int inLeft = rb - lb;
            if (k <= inLeft) {
                l = lb + 1;
                r = rb;
                id = tree[id].left;
            } else {
                k -= inLeft;
                l -= lb;
                r -= rb;
                id = tree[id].right;
            }
        }
        return tree[id].lo;
    }

    int freq(int id, int l, int r, int val) const {
        while (l <= r) {
            if (val < tree[id].lo || val > tree[id].hi) return 0;
            if (tree[id].lo == tree[id].hi) return r - l + 1;
            int mid = tree[id].lo + (tree[id].hi - tree[id].lo) / 2;
            int lb = tree[id].b[l - 1], rb = tree[id].b[r];
            if (val <= mid) {
                l = lb + 1;
                r = rb;
                id = tree[id].left;
            } else {
                l -= lb;
                r -= rb;
                id = tree[id].right;
            }
        }
        return 0;
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, q;
    if (!(cin >> n >> q)) return 0;
    vector<int> raw(n);
    for (int i = 0; i < n; ++i) cin >> raw[i];
    vector<int> vals = raw;
    sort(vals.begin(), vals.end());
    vals.erase(unique(vals.begin(), vals.end()), vals.end());

    vector<int> comp(n);
    for (int i = 0; i < n; ++i) {
        comp[i] = static_cast<int>(lower_bound(vals.begin(), vals.end(), raw[i]) - vals.begin());
    }

    WaveletTree wt;
    int root = wt.build(comp, 0, static_cast<int>(vals.size()) - 1);

    while (q--) {
        int t, l, r, x;
        cin >> t >> l >> r >> x;
        if (t == 1) {
            cout << vals[wt.kth(root, l, r, x)] << "\\n";
        } else {
            auto it = lower_bound(vals.begin(), vals.end(), x);
            cout << (it == vals.end() || *it != x ? 0 : wt.freq(root, l, r, static_cast<int>(it - vals.begin()))) << "\\n";
        }
    }
    return 0;
}
`,
        rust: `use std::io::{self, Read, Write, BufWriter};

struct Node {
    lo: usize,
    hi: usize,
    left: usize,
    right: usize,
    b: Vec<usize>,
}

fn build(nodes: &mut Vec<Node>, arr: Vec<usize>, lo: usize, hi: usize) -> usize {
    let id = nodes.len();
    if lo == hi || arr.is_empty() {
        nodes.push(Node { lo, hi, left: 0, right: 0, b: Vec::new() });
        return id;
    }
    let mid = lo + (hi - lo) / 2;
    let mut b = vec![0usize; arr.len() + 1];
    let (mut l_arr, mut r_arr) = (Vec::new(), Vec::new());
    for (i, &v) in arr.iter().enumerate() {
        if v <= mid {
            b[i + 1] = b[i] + 1;
            l_arr.push(v);
        } else {
            b[i + 1] = b[i];
            r_arr.push(v);
        }
    }
    nodes.push(Node { lo, hi, left: 0, right: 0, b });
    let lc = build(nodes, l_arr, lo, mid);
    let rc = build(nodes, r_arr, mid + 1, hi);
    nodes[id].left = lc;
    nodes[id].right = rc;
    id
}

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let n: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };
    let q: usize = it.next().unwrap().parse().unwrap();
    let mut raw = Vec::with_capacity(n);
    for _ in 0..n {
        raw.push(it.next().unwrap().parse::<i64>().unwrap());
    }
    let mut vals = raw.clone();
    vals.sort_unstable();
    vals.dedup();
    let comp: Vec<usize> = raw.iter().map(|v| vals.binary_search(v).unwrap()).collect();

    let mut nodes = Vec::new();
    build(&mut nodes, comp, 0, vals.len() - 1);

    let out = io::stdout();
    let mut bw = BufWriter::new(out.lock());
    for _ in 0..q {
        let t: usize = it.next().unwrap().parse().unwrap();
        let mut l: usize = it.next().unwrap().parse().unwrap();
        let mut r: usize = it.next().unwrap().parse().unwrap();
        let arg: i64 = it.next().unwrap().parse().unwrap();
        let mut id = 0usize;
        if t == 1 {
            let mut k = arg as usize;
            while nodes[id].lo != nodes[id].hi {
                let lb = nodes[id].b[l - 1];
                let rb = nodes[id].b[r];
                if k <= rb - lb {
                    l = lb + 1;
                    r = rb;
                    id = nodes[id].left;
                } else {
                    k -= rb - lb;
                    l -= lb;
                    r -= rb;
                    id = nodes[id].right;
                }
            }
            writeln!(bw, "{}", vals[nodes[id].lo]).unwrap();
        } else {
            let ans = match vals.binary_search(&arg) {
                Err(_) => 0,
                Ok(val) => {
                    let mut res = 0;
                    while l <= r {
                        if nodes[id].lo == nodes[id].hi {
                            res = r - l + 1;
                            break;
                        }
                        let mid = nodes[id].lo + (nodes[id].hi - nodes[id].lo) / 2;
                        let lb = nodes[id].b[l - 1];
                        let rb = nodes[id].b[r];
                        if val <= mid {
                            l = lb + 1;
                            r = rb;
                            id = nodes[id].left;
                        } else {
                            l -= lb;
                            r -= rb;
                            id = nodes[id].right;
                        }
                    }
                    res
                }
            };
            writeln!(bw, "{}", ans).unwrap();
        }
    }
}
`,
        java21: `import java.io.BufferedInputStream;
import java.io.IOException;
import java.util.Arrays;

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
                if (c == -1) return Integer.MIN_VALUE;
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

    static class Node {
        int lo, hi;
        int[] b;
        Node left, right;
        Node(int lo, int hi) { this.lo = lo; this.hi = hi; }
    }

    static Node build(int[] arr, int len, int lo, int hi) {
        Node node = new Node(lo, hi);
        if (lo == hi || len == 0) return node;
        int mid = lo + (hi - lo) / 2;
        node.b = new int[len + 1];
        int lc = 0;
        for (int i = 0; i < len; i++) {
            boolean goLeft = arr[i] <= mid;
            node.b[i + 1] = node.b[i] + (goLeft ? 1 : 0);
            if (goLeft) lc++;
        }
        int[] la = new int[lc], ra = new int[len - lc];
        int li = 0, ri = 0;
        for (int i = 0; i < len; i++) {
            if (arr[i] <= mid) la[li++] = arr[i];
            else ra[ri++] = arr[i];
        }
        node.left = build(la, lc, lo, mid);
        node.right = build(ra, len - lc, mid + 1, hi);
        return node;
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        int n = fs.nextInt();
        if (n == Integer.MIN_VALUE) return;
        int q = fs.nextInt();
        int[] raw = new int[n];
        for (int i = 0; i < n; i++) raw[i] = fs.nextInt();

        int[] sorted = raw.clone();
        Arrays.sort(sorted);
        int u = 0;
        for (int i = 0; i < n; i++) {
            if (u == 0 || sorted[i] != sorted[u - 1]) sorted[u++] = sorted[i];
        }
        int[] vals = Arrays.copyOf(sorted, u);
        int[] comp = new int[n];
        for (int i = 0; i < n; i++) comp[i] = Arrays.binarySearch(vals, raw[i]);

        Node root = build(comp, n, 0, u - 1);
        StringBuilder sb = new StringBuilder();
        while (q-- > 0) {
            int t = fs.nextInt(), l = fs.nextInt(), r = fs.nextInt(), arg = fs.nextInt();
            Node cur = root;
            if (t == 1) {
                int k = arg;
                while (cur.lo != cur.hi) {
                    int lb = cur.b[l - 1], rb = cur.b[r];
                    if (k <= rb - lb) {
                        l = lb + 1;
                        r = rb;
                        cur = cur.left;
                    } else {
                        k -= rb - lb;
                        l -= lb;
                        r -= rb;
                        cur = cur.right;
                    }
                }
                sb.append(vals[cur.lo]).append('\\n');
            } else {
                int idx = Arrays.binarySearch(vals, arg);
                int ans = 0;
                if (idx >= 0) {
                    while (l <= r) {
                        if (cur.lo == cur.hi) { ans = r - l + 1; break; }
                        int mid = cur.lo + (cur.hi - cur.lo) / 2;
                        int lb = cur.b[l - 1], rb = cur.b[r];
                        if (idx <= mid) { l = lb + 1; r = rb; cur = cur.left; }
                        else { l -= lb; r -= rb; cur = cur.right; }
                    }
                }
                sb.append(ans).append('\\n');
            }
        }
        System.out.print(sb.toString());
    }
}
`,
        python3: `import bisect
import sys

sys.setrecursionlimit(200000)


class Node:
    __slots__ = ("lo", "hi", "b", "left", "right")

    def __init__(self, lo: int, hi: int) -> None:
        self.lo = lo
        self.hi = hi
        self.b: list[int] = []
        self.left: Node | None = None
        self.right: Node | None = None


def build(arr: list[int], lo: int, hi: int) -> Node:
    node = Node(lo, hi)
    if lo == hi or not arr:
        return node
    mid = (lo + hi) // 2
    b = [0] * (len(arr) + 1)
    la: list[int] = []
    ra: list[int] = []
    for i, v in enumerate(arr):
        if v <= mid:
            b[i + 1] = b[i] + 1
            la.append(v)
        else:
            b[i + 1] = b[i]
            ra.append(v)
    node.b = b
    node.left = build(la, lo, mid)
    node.right = build(ra, mid + 1, hi)
    return node


def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    q = int(data[1])
    raw = [int(v) for v in data[2 : 2 + n]]
    vals = sorted(set(raw))
    comp = [bisect.bisect_left(vals, v) for v in raw]
    root = build(comp, 0, len(vals) - 1)

    out: list[str] = []
    idx = 2 + n
    for _ in range(q):
        t = int(data[idx])
        l = int(data[idx + 1])
        r = int(data[idx + 2])
        arg = int(data[idx + 3])
        idx += 4
        cur = root
        if t == 1:
            k = arg
            while cur.lo != cur.hi:
                lb = cur.b[l - 1]
                rb = cur.b[r]
                if k <= rb - lb:
                    l = lb + 1
                    r = rb
                    cur = cur.left  # type: ignore[assignment]
                else:
                    k -= rb - lb
                    l -= lb
                    r -= rb
                    cur = cur.right  # type: ignore[assignment]
            out.append(str(vals[cur.lo]))
        else:
            pos = bisect.bisect_left(vals, arg)
            if pos == len(vals) or vals[pos] != arg:
                out.append("0")
            else:
                ans = 0
                while l <= r:
                    if cur.lo == cur.hi:
                        ans = r - l + 1
                        break
                    mid = (cur.lo + cur.hi) // 2
                    lb = cur.b[l - 1]
                    rb = cur.b[r]
                    if pos <= mid:
                        l = lb + 1
                        r = rb
                        cur = cur.left  # type: ignore[assignment]
                    else:
                        l -= lb
                        r -= rb
                        cur = cur.right  # type: ignore[assignment]
                out.append(str(ans))

    sys.stdout.write("\\n".join(out) + "\\n")


if __name__ == "__main__":
    solve()
`,
        ruby: `class Node
  attr_accessor :lo, :hi, :b, :left, :right

  def initialize(lo, hi)
    @lo = lo
    @hi = hi
    @b = []
    @left = nil
    @right = nil
  end
end

def build(arr, lo, hi)
  node = Node.new(lo, hi)
  return node if lo == hi || arr.empty?

  mid = (lo + hi) / 2
  b = Array.new(arr.length + 1, 0)
  la = []
  ra = []
  arr.each_with_index do |v, i|
    if v <= mid
      b[i + 1] = b[i] + 1
      la << v
    else
      b[i + 1] = b[i]
      ra << v
    end
  end
  node.b = b
  node.left = build(la, lo, mid)
  node.right = build(ra, mid + 1, hi)
  node
end

data = $stdin.read.split
exit if data.empty?
n = data[0].to_i
q = data[1].to_i
raw = data[2, n].map(&:to_i)
vals = raw.uniq.sort
rank_of = {}
vals.each_with_index { |v, i| rank_of[v] = i }
root = build(raw.map { |v| rank_of[v] }, 0, vals.length - 1)

out = []
idx = 2 + n
q.times do
  t = data[idx].to_i
  l = data[idx + 1].to_i
  r = data[idx + 2].to_i
  arg = data[idx + 3].to_i
  idx += 4
  cur = root
  if t == 1
    k = arg
    while cur.lo != cur.hi
      lb = cur.b[l - 1]
      rb = cur.b[r]
      if k <= rb - lb
        l = lb + 1
        r = rb
        cur = cur.left
      else
        k -= rb - lb
        l -= lb
        r -= rb
        cur = cur.right
      end
    end
    out << vals[cur.lo].to_s
  else
    id = rank_of[arg]
    if id.nil?
      out << '0'
    else
      ans = 0
      while l <= r
        if cur.lo == cur.hi
          ans = r - l + 1
          break
        end
        mid = (cur.lo + cur.hi) / 2
        lb = cur.b[l - 1]
        rb = cur.b[r]
        if id <= mid
          l = lb + 1
          r = rb
          cur = cur.left
        else
          l -= lb
          r -= rb
          cur = cur.right
        end
      end
      out << ans.to_s
    end
  end
end

puts out.join("\\n")
`,
      },
    },
    {
      id: 'ch64-p2',
      tier: 'Standard',
      ratingRange: '2250–2450',
      title: 'Static 2D Rectangle Count & Sum <= K (Augmented Wavelet Tree)',
      statement:
        'Given an array A of N integers and Q online queries (L, R, K), report BOTH the count of elements A[i] <= K inside subarray A[L..R] AND their exact total sum in O(log Sigma) time per query without sorting queries offline.',
      constraints: '1 <= N, Q <= 10^5, |A[i]| <= 10^9, |K| <= 10^9, 1 <= L <= R <= N',
      sampleInput: '5 2\n3 1 4 1 5\n1 4 3\n2 5 4',
      sampleOutput: '3 5\n3 6',
      hints: [
        'At every internal Wavelet node, alongside b[i] (count of prefix elements routed left), maintain prefLeftSum[i] (exact sum of those left-routed elements).',
        'If the query threshold is >= vals[hi], ALL elements in [L, R] at this node qualify: return count = r - l + 1 and sum = nodeTotalPrefSum[r] - nodeTotalPrefSum[l - 1].',
        'Otherwise, if threshold <= mid, recurse only left; if threshold > mid, add the ENTIRE left child contribution (rb - lb, prefLeftSum[r] - prefLeftSum[l - 1]) in O(1) and recurse right.',
      ],
      solutions: {
        cpp20: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

struct WaveletSumTree {
    struct Node {
        int lo, hi, left, right;
        vector<int> b;
        vector<long long> prefSum;
        vector<long long> leftSum;
    };
    vector<Node> tree;
    vector<long long> vals;

    int build(vector<int>& arr, int lo, int hi) {
        int id = static_cast<int>(tree.size());
        tree.push_back({lo, hi, -1, -1, {}, {}, {}});
        tree[id].prefSum.resize(arr.size() + 1, 0);
        for (size_t i = 0; i < arr.size(); ++i) {
            tree[id].prefSum[i + 1] = tree[id].prefSum[i] + vals[arr[i]];
        }
        if (lo == hi || arr.empty()) return id;

        int mid = lo + (hi - lo) / 2;
        tree[id].b.resize(arr.size() + 1, 0);
        tree[id].leftSum.resize(arr.size() + 1, 0);
        vector<int> lArr, rArr;
        for (size_t i = 0; i < arr.size(); ++i) {
            bool goLeft = (arr[i] <= mid);
            tree[id].b[i + 1] = tree[id].b[i] + (goLeft ? 1 : 0);
            tree[id].leftSum[i + 1] = tree[id].leftSum[i] + (goLeft ? vals[arr[i]] : 0);
            if (goLeft) lArr.push_back(arr[i]);
            else rArr.push_back(arr[i]);
        }
        int lc = build(lArr, lo, mid);
        int rc = build(rArr, mid + 1, hi);
        tree[id].left = lc;
        tree[id].right = rc;
        return id;
    }

    pair<int, long long> queryLeq(int id, int l, int r, int maxRank) const {
        if (l > r || maxRank < tree[id].lo) return {0, 0};
        if (tree[id].hi <= maxRank) {
            return {r - l + 1, tree[id].prefSum[r] - tree[id].prefSum[l - 1]};
        }
        int mid = tree[id].lo + (tree[id].hi - tree[id].lo) / 2;
        int lb = tree[id].b[l - 1];
        int rb = tree[id].b[r];
        if (maxRank <= mid) {
            return queryLeq(tree[id].left, lb + 1, rb, maxRank);
        }
        int leftCnt = rb - lb;
        long long leftSum = tree[id].leftSum[r] - tree[id].leftSum[l - 1];
        auto rightRes = queryLeq(tree[id].right, l - lb, r - rb, maxRank);
        return {leftCnt + rightRes.first, leftSum + rightRes.second};
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, q;
    if (!(cin >> n >> q)) return 0;
    vector<long long> raw(n);
    for (int i = 0; i < n; ++i) cin >> raw[i];

    vector<long long> vals = raw;
    sort(vals.begin(), vals.end());
    vals.erase(unique(vals.begin(), vals.end()), vals.end());

    vector<int> comp(n);
    for (int i = 0; i < n; ++i) {
        comp[i] = static_cast<int>(lower_bound(vals.begin(), vals.end(), raw[i]) - vals.begin());
    }

    WaveletSumTree wt;
    wt.vals = vals;
    int root = wt.build(comp, 0, static_cast<int>(vals.size()) - 1);

    while (q--) {
        int l, r;
        long long k;
        cin >> l >> r >> k;
        int maxRank = static_cast<int>(upper_bound(vals.begin(), vals.end(), k) - vals.begin()) - 1;
        auto res = wt.queryLeq(root, l, r, maxRank);
        cout << res.first << " " << res.second << "\\n";
    }
    return 0;
}
`,
        rust: `use std::io::{self, Read, Write, BufWriter};

struct Node {
    lo: usize,
    hi: usize,
    left: usize,
    right: usize,
    b: Vec<usize>,
    pref_sum: Vec<i64>,
    left_sum: Vec<i64>,
}

fn build(nodes: &mut Vec<Node>, vals: &[i64], arr: Vec<usize>, lo: usize, hi: usize) -> usize {
    let id = nodes.len();
    let mut pref_sum = vec![0i64; arr.len() + 1];
    for (i, &r) in arr.iter().enumerate() {
        pref_sum[i + 1] = pref_sum[i] + vals[r];
    }
    if lo == hi || arr.is_empty() {
        nodes.push(Node { lo, hi, left: 0, right: 0, b: Vec::new(), pref_sum, left_sum: Vec::new() });
        return id;
    }
    let mid = lo + (hi - lo) / 2;
    let mut b = vec![0usize; arr.len() + 1];
    let mut left_sum = vec![0i64; arr.len() + 1];
    let (mut l_arr, mut r_arr) = (Vec::new(), Vec::new());
    for (i, &v) in arr.iter().enumerate() {
        if v <= mid {
            b[i + 1] = b[i] + 1;
            left_sum[i + 1] = left_sum[i] + vals[v];
            l_arr.push(v);
        } else {
            b[i + 1] = b[i];
            left_sum[i + 1] = left_sum[i];
            r_arr.push(v);
        }
    }
    nodes.push(Node { lo, hi, left: 0, right: 0, b, pref_sum, left_sum });
    let lc = build(nodes, vals, l_arr, lo, mid);
    let rc = build(nodes, vals, r_arr, mid + 1, hi);
    nodes[id].left = lc;
    nodes[id].right = rc;
    id
}

fn query_leq(nodes: &[Node], mut id: usize, mut l: usize, mut r: usize, max_rank: usize) -> (usize, i64) {
    let mut cnt = 0usize;
    let mut sum = 0i64;
    while l <= r {
        let node = &nodes[id];
        if node.hi <= max_rank {
            cnt += r - l + 1;
            sum += node.pref_sum[r] - node.pref_sum[l - 1];
            break;
        }
        if node.lo == node.hi {
            break;
        }
        let mid = node.lo + (node.hi - node.lo) / 2;
        let lb = node.b[l - 1];
        let rb = node.b[r];
        if max_rank <= mid {
            l = lb + 1;
            r = rb;
            id = node.left;
        } else {
            cnt += rb - lb;
            sum += node.left_sum[r] - node.left_sum[l - 1];
            l -= lb;
            r -= rb;
            id = node.right;
        }
    }
    (cnt, sum)
}

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let n: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };
    let q: usize = it.next().unwrap().parse().unwrap();
    let mut raw = Vec::with_capacity(n);
    for _ in 0..n {
        raw.push(it.next().unwrap().parse::<i64>().unwrap());
    }
    let mut vals = raw.clone();
    vals.sort_unstable();
    vals.dedup();
    let comp: Vec<usize> = raw.iter().map(|v| vals.binary_search(v).unwrap()).collect();

    let mut nodes = Vec::new();
    build(&mut nodes, &vals, comp, 0, vals.len() - 1);

    let out = io::stdout();
    let mut bw = BufWriter::new(out.lock());
    for _ in 0..q {
        let l: usize = it.next().unwrap().parse().unwrap();
        let r: usize = it.next().unwrap().parse().unwrap();
        let k: i64 = it.next().unwrap().parse().unwrap();
        let pos = vals.partition_point(|&v| v <= k);
        if pos == 0 {
            writeln!(bw, "0 0").unwrap();
        } else {
            let (c, sm) = query_leq(&nodes, 0, l, r, pos - 1);
            writeln!(bw, "{} {}", c, sm).unwrap();
        }
    }
}
`,
        java21: `import java.io.BufferedInputStream;
import java.io.IOException;
import java.util.Arrays;

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

    static class Node {
        int lo, hi;
        int[] b;
        long[] prefSum, leftSum;
        Node left, right;
        Node(int lo, int hi) { this.lo = lo; this.hi = hi; }
    }

    static long[] vals;

    static Node build(int[] arr, int len, int lo, int hi) {
        Node node = new Node(lo, hi);
        node.prefSum = new long[len + 1];
        for (int i = 0; i < len; i++) node.prefSum[i + 1] = node.prefSum[i] + vals[arr[i]];
        if (lo == hi || len == 0) return node;
        int mid = lo + (hi - lo) / 2;
        node.b = new int[len + 1];
        node.leftSum = new long[len + 1];
        int lc = 0;
        for (int i = 0; i < len; i++) {
            boolean goLeft = arr[i] <= mid;
            node.b[i + 1] = node.b[i] + (goLeft ? 1 : 0);
            node.leftSum[i + 1] = node.leftSum[i] + (goLeft ? vals[arr[i]] : 0);
            if (goLeft) lc++;
        }
        int[] la = new int[lc], ra = new int[len - lc];
        int li = 0, ri = 0;
        for (int i = 0; i < len; i++) {
            if (arr[i] <= mid) la[li++] = arr[i];
            else ra[ri++] = arr[i];
        }
        node.left = build(la, lc, lo, mid);
        node.right = build(ra, len - lc, mid + 1, hi);
        return node;
    }

    static int upperBound(long[] a, long key) {
        int lo = 0, hi = a.length;
        while (lo < hi) {
            int mid = (lo + hi) >>> 1;
            if (a[mid] <= key) lo = mid + 1;
            else hi = mid;
        }
        return lo;
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        long nLong = fs.nextLong();
        if (nLong == Long.MIN_VALUE) return;
        int n = (int) nLong;
        int q = (int) fs.nextLong();
        long[] raw = new long[n];
        for (int i = 0; i < n; i++) raw[i] = fs.nextLong();

        long[] sorted = raw.clone();
        Arrays.sort(sorted);
        int u = 0;
        for (int i = 0; i < n; i++) {
            if (u == 0 || sorted[i] != sorted[u - 1]) sorted[u++] = sorted[i];
        }
        vals = Arrays.copyOf(sorted, u);
        int[] comp = new int[n];
        for (int i = 0; i < n; i++) comp[i] = Arrays.binarySearch(vals, raw[i]);

        Node root = build(comp, n, 0, u - 1);
        StringBuilder sb = new StringBuilder();
        while (q-- > 0) {
            int l = (int) fs.nextLong();
            int r = (int) fs.nextLong();
            long k = fs.nextLong();
            int maxRank = upperBound(vals, k) - 1;
            if (maxRank < 0) {
                sb.append("0 0\\n");
                continue;
            }
            int cnt = 0;
            long sum = 0;
            Node cur = root;
            while (l <= r) {
                if (cur.hi <= maxRank) {
                    cnt += r - l + 1;
                    sum += cur.prefSum[r] - cur.prefSum[l - 1];
                    break;
                }
                if (cur.lo == cur.hi) break;
                int mid = cur.lo + (cur.hi - cur.lo) / 2;
                int lb = cur.b[l - 1], rb = cur.b[r];
                if (maxRank <= mid) {
                    l = lb + 1;
                    r = rb;
                    cur = cur.left;
                } else {
                    cnt += rb - lb;
                    sum += cur.leftSum[r] - cur.leftSum[l - 1];
                    l -= lb;
                    r -= rb;
                    cur = cur.right;
                }
            }
            sb.append(cnt).append(' ').append(sum).append('\\n');
        }
        System.out.print(sb.toString());
    }
}
`,
        python3: `import bisect
import sys

sys.setrecursionlimit(200000)


class Node:
    __slots__ = ("lo", "hi", "b", "pref_sum", "left_sum", "left", "right")

    def __init__(self, lo: int, hi: int) -> None:
        self.lo = lo
        self.hi = hi
        self.b: list[int] = []
        self.pref_sum: list[int] = []
        self.left_sum: list[int] = []
        self.left: Node | None = None
        self.right: Node | None = None


def build(arr: list[int], vals: list[int], lo: int, hi: int) -> Node:
    node = Node(lo, hi)
    ps = [0] * (len(arr) + 1)
    for i, r in enumerate(arr):
        ps[i + 1] = ps[i] + vals[r]
    node.pref_sum = ps
    if lo == hi or not arr:
        return node
    mid = (lo + hi) // 2
    b = [0] * (len(arr) + 1)
    ls = [0] * (len(arr) + 1)
    la: list[int] = []
    ra: list[int] = []
    for i, v in enumerate(arr):
        if v <= mid:
            b[i + 1] = b[i] + 1
            ls[i + 1] = ls[i] + vals[v]
            la.append(v)
        else:
            b[i + 1] = b[i]
            ls[i + 1] = ls[i]
            ra.append(v)
    node.b = b
    node.left_sum = ls
    node.left = build(la, vals, lo, mid)
    node.right = build(ra, vals, mid + 1, hi)
    return node


def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    q = int(data[1])
    raw = [int(v) for v in data[2 : 2 + n]]
    vals = sorted(set(raw))
    comp = [bisect.bisect_left(vals, v) for v in raw]
    root = build(comp, vals, 0, len(vals) - 1)

    out: list[str] = []
    idx = 2 + n
    for _ in range(q):
        l = int(data[idx])
        r = int(data[idx + 1])
        k = int(data[idx + 2])
        idx += 3
        max_rank = bisect.bisect_right(vals, k) - 1
        if max_rank < 0:
            out.append("0 0")
            continue
        cnt = 0
        total = 0
        cur = root
        while l <= r:
            if cur.hi <= max_rank:
                cnt += r - l + 1
                total += cur.pref_sum[r] - cur.pref_sum[l - 1]
                break
            if cur.lo == cur.hi:
                break
            mid = (cur.lo + cur.hi) // 2
            lb = cur.b[l - 1]
            rb = cur.b[r]
            if max_rank <= mid:
                l = lb + 1
                r = rb
                cur = cur.left  # type: ignore[assignment]
            else:
                cnt += rb - lb
                total += cur.left_sum[r] - cur.left_sum[l - 1]
                l -= lb
                r -= rb
                cur = cur.right  # type: ignore[assignment]
        out.append(f"{cnt} {total}")

    sys.stdout.write("\\n".join(out) + "\\n")


if __name__ == "__main__":
    solve()
`,
        ruby: `class Node
  attr_accessor :lo, :hi, :b, :pref_sum, :left_sum, :left, :right

  def initialize(lo, hi)
    @lo = lo
    @hi = hi
    @b = []
    @pref_sum = []
    @left_sum = []
    @left = nil
    @right = nil
  end
end

def build(arr, vals, lo, hi)
  node = Node.new(lo, hi)
  ps = Array.new(arr.length + 1, 0)
  arr.each_with_index { |r, i| ps[i + 1] = ps[i] + vals[r] }
  node.pref_sum = ps
  return node if lo == hi || arr.empty?

  mid = (lo + hi) / 2
  b = Array.new(arr.length + 1, 0)
  ls = Array.new(arr.length + 1, 0)
  la = []
  ra = []
  arr.each_with_index do |v, i|
    if v <= mid
      b[i + 1] = b[i] + 1
      ls[i + 1] = ls[i] + vals[v]
      la << v
    else
      b[i + 1] = b[i]
      ls[i + 1] = ls[i]
      ra << v
    end
  end
  node.b = b
  node.left_sum = ls
  node.left = build(la, vals, lo, mid)
  node.right = build(ra, vals, mid + 1, hi)
  node
end

data = $stdin.read.split
exit if data.empty?
n = data[0].to_i
q = data[1].to_i
raw = data[2, n].map(&:to_i)
vals = raw.uniq.sort
rank_of = {}
vals.each_with_index { |v, i| rank_of[v] = i }
root = build(raw.map { |v| rank_of[v] }, vals, 0, vals.length - 1)

out = []
idx = 2 + n
q.times do
  l = data[idx].to_i
  r = data[idx + 1].to_i
  k = data[idx + 2].to_i
  idx += 3
  pos = vals.bsearch_index { |v| v > k } || vals.length
  max_rank = pos - 1
  if max_rank < 0
    out << '0 0'
    next
  end
  cnt = 0
  total = 0
  cur = root
  while l <= r
    if cur.hi <= max_rank
      cnt += r - l + 1
      total += cur.pref_sum[r] - cur.pref_sum[l - 1]
      break
    end
    break if cur.lo == cur.hi

    mid = (cur.lo + cur.hi) / 2
    lb = cur.b[l - 1]
    rb = cur.b[r]
    if max_rank <= mid
      l = lb + 1
      r = rb
      cur = cur.left
    else
      cnt += rb - lb
      total += cur.left_sum[r] - cur.left_sum[l - 1]
      l -= lb
      r -= rb
      cur = cur.right
    end
  end
  out << "#{cnt} #{total}"
end

puts out.join("\\n")
`,
      },
    },
    {
      id: 'ch64-p3',
      tier: 'Boss',
      ratingRange: '2400–2600',
      title: 'Fractional Cascading Merge-Sort Tree (O(log N) Static Queries)',
      statement:
        'Using Fractional Cascading over a Merge-Sort Tree (without building a Wavelet Tree or performing nested binary searches inside every segment tree node), preprocess a static 1-indexed array A of N integers in O(N log N) and answer Q queries (L, R, K) asking for the count of elements <= K in A[L..R] in strict O(log N) time per query.',
      constraints: '1 <= N, Q <= 10^5, |A[i]| <= 10^9, 1 <= L <= R <= N',
      sampleInput: '6 3\n4 1 6 2 5 3\n1 4 3\n2 6 4\n3 5 1',
      sampleOutput: '2\n3\n0',
      hints: [
        'Each Segment Tree node v stores its sorted subarray arr[v], plus two cascade tables nextL[i] and nextR[i] giving the index of the first element >= arr[v][i] inside its left and right children.',
        'At the root (node 1), run ONE binary search idx = upper_bound(arr[1], K) in O(log N) time to find the prefix length of elements <= K.',
        'When stepping down to a child with current prefix length p (meaning p elements in arr[v] are <= K), the number of elements <= K in the left child is directly nextL[p] (and nextR[p] for right child) in O(1)—dropping total query complexity from O(log^2 N) to O(log N)!',
      ],
      solutions: {
        cpp20: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

// Fractional Cascading Merge-Sort Tree: 1 binary search at root + O(1) per level
struct FractionalCascadingTree {
    struct Node {
        vector<int> vals;
        vector<int> toLeft;
        vector<int> toRight;
    };
    int n;
    vector<Node> tree;

    FractionalCascadingTree(const vector<int>& a) : n(static_cast<int>(a.size())), tree(4 * n + 4) {
        build(1, 0, n - 1, a);
    }

    void build(int v, int l, int r, const vector<int>& a) {
        if (l == r) {
            tree[v].vals = {a[l]};
            return;
        }
        int mid = (l + r) >> 1;
        build(v << 1, l, mid, a);
        build(v << 1 | 1, mid + 1, r, a);

        const auto& L = tree[v << 1].vals;
        const auto& R = tree[v << 1 | 1].vals;
        auto& V = tree[v].vals;
        auto& tL = tree[v].toLeft;
        auto& tR = tree[v].toRight;

        int sz = static_cast<int>(L.size() + R.size());
        V.resize(sz);
        tL.resize(sz + 1);
        tR.resize(sz + 1);

        // Merge sorted child arrays and record count of elements <= V[i-1] (or <= K via upper_bound)
        size_t i = 0, j = 0, k = 0;
        while (i < L.size() || j < R.size()) {
            tL[k] = static_cast<int>(i);
            tR[k] = static_cast<int>(j);
            if (j == R.size() || (i < L.size() && L[i] <= R[j])) {
                V[k++] = L[i++];
            } else {
                V[k++] = R[j++];
            }
        }
        tL[sz] = static_cast<int>(L.size());
        tR[sz] = static_cast<int>(R.size());
    }

    // Given pos = count of elements <= K in node v, recurse without another binary search
    int query(int v, int l, int r, int ql, int qr, int pos) const {
        if (ql > r || qr < l || pos == 0) return 0;
        if (ql <= l && r <= qr) return pos;
        int mid = (l + r) >> 1;
        return query(v << 1, l, mid, ql, qr, tree[v].toLeft[pos]) +
               query(v << 1 | 1, mid + 1, r, ql, qr, tree[v].toRight[pos]);
    }

    int countLeq(int ql, int qr, int k) const {
        int pos = static_cast<int>(upper_bound(tree[1].vals.begin(), tree[1].vals.end(), k) - tree[1].vals.begin());
        return query(1, 0, n - 1, ql - 1, qr - 1, pos);
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, q;
    if (!(cin >> n >> q)) return 0;
    vector<int> a(n);
    for (int i = 0; i < n; ++i) cin >> a[i];

    FractionalCascadingTree fct(a);
    while (q--) {
        int l, r, k;
        cin >> l >> r >> k;
        cout << fct.countLeq(l, r, k) << "\\n";
    }
    return 0;
}
`,
        rust: `use std::io::{self, Read, Write, BufWriter};

struct Node {
    vals: Vec<i32>,
    to_left: Vec<usize>,
    to_right: Vec<usize>,
}

impl Default for Node {
    fn default() -> Self {
        Node { vals: Vec::new(), to_left: Vec::new(), to_right: Vec::new() }
    }
}

fn build(tree: &mut Vec<Node>, v: usize, l: usize, r: usize, a: &[i32]) {
    if l == r {
        tree[v].vals = vec![a[l]];
        return;
    }
    let mid = (l + r) >> 1;
    build(tree, v << 1, l, mid, a);
    build(tree, v << 1 | 1, mid + 1, r, a);

    let l_vals = std::mem::take(&mut tree[v << 1].vals);
    let r_vals = std::mem::take(&mut tree[v << 1 | 1].vals);
    let sz = l_vals.len() + r_vals.len();
    let mut vals = Vec::with_capacity(sz);
    let mut to_left = vec![0usize; sz + 1];
    let mut to_right = vec![0usize; sz + 1];

    let (mut i, mut j, mut k) = (0usize, 0usize, 0usize);
    while i < l_vals.len() || j < r_vals.len() {
        to_left[k] = i;
        to_right[k] = j;
        if j == r_vals.len() || (i < l_vals.len() && l_vals[i] <= r_vals[j]) {
            vals.push(l_vals[i]);
            i += 1;
        } else {
            vals.push(r_vals[j]);
            j += 1;
        }
        k += 1;
    }
    to_left[sz] = l_vals.len();
    to_right[sz] = r_vals.len();

    tree[v << 1].vals = l_vals;
    tree[v << 1 | 1].vals = r_vals;
    tree[v].vals = vals;
    tree[v].to_left = to_left;
    tree[v].to_right = to_right;
}

fn query(tree: &[Node], v: usize, l: usize, r: usize, ql: usize, qr: usize, pos: usize) -> usize {
    if ql > r || qr < l || pos == 0 {
        return 0;
    }
    if ql <= l && r <= qr {
        return pos;
    }
    let mid = (l + r) >> 1;
    query(tree, v << 1, l, mid, ql, qr, tree[v].to_left[pos])
        + query(tree, v << 1 | 1, mid + 1, r, ql, qr, tree[v].to_right[pos])
}

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let n: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };
    let q: usize = it.next().unwrap().parse().unwrap();
    let mut a = Vec::with_capacity(n);
    for _ in 0..n {
        a.push(it.next().unwrap().parse::<i32>().unwrap());
    }

    let mut tree = Vec::new();
    tree.resize_with(4 * n + 4, Node::default);
    build(&mut tree, 1, 0, n - 1, &a);

    let out = io::stdout();
    let mut bw = BufWriter::new(out.lock());
    for _ in 0..q {
        let l: usize = it.next().unwrap().parse().unwrap();
        let r: usize = it.next().unwrap().parse().unwrap();
        let k: i32 = it.next().unwrap().parse().unwrap();
        let pos = tree[1].vals.partition_point(|&v| v <= k);
        writeln!(bw, "{}", query(&tree, 1, 0, n - 1, l - 1, r - 1, pos)).unwrap();
    }
}
`,
        java21: `import java.io.BufferedInputStream;
import java.io.IOException;

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
                if (c == -1) return Integer.MIN_VALUE;
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

    static int[][] vals;
    static int[][] toLeft;
    static int[][] toRight;

    static void build(int v, int l, int r, int[] a) {
        if (l == r) {
            vals[v] = new int[]{a[l]};
            return;
        }
        int mid = (l + r) >>> 1;
        build(v << 1, l, mid, a);
        build(v << 1 | 1, mid + 1, r, a);

        int[] L = vals[v << 1];
        int[] R = vals[v << 1 | 1];
        int sz = L.length + R.length;
        int[] V = new int[sz];
        int[] tL = new int[sz + 1];
        int[] tR = new int[sz + 1];

        int i = 0, j = 0, k = 0;
        while (i < L.length || j < R.length) {
            tL[k] = i;
            tR[k] = j;
            if (j == R.length || (i < L.length && L[i] <= R[j])) {
                V[k++] = L[i++];
            } else {
                V[k++] = R[j++];
            }
        }
        tL[sz] = L.length;
        tR[sz] = R.length;
        vals[v] = V;
        toLeft[v] = tL;
        toRight[v] = tR;
    }

    static int query(int v, int l, int r, int ql, int qr, int pos) {
        if (ql > r || qr < l || pos == 0) return 0;
        if (ql <= l && r <= qr) return pos;
        int mid = (l + r) >>> 1;
        return query(v << 1, l, mid, ql, qr, toLeft[v][pos])
                + query(v << 1 | 1, mid + 1, r, ql, qr, toRight[v][pos]);
    }

    static int upperBound(int[] a, int key) {
        int lo = 0, hi = a.length;
        while (lo < hi) {
            int mid = (lo + hi) >>> 1;
            if (a[mid] <= key) lo = mid + 1;
            else hi = mid;
        }
        return lo;
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        int n = fs.nextInt();
        if (n == Integer.MIN_VALUE) return;
        int q = fs.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = fs.nextInt();

        vals = new int[4 * n + 4][];
        toLeft = new int[4 * n + 4][];
        toRight = new int[4 * n + 4][];
        build(1, 0, n - 1, a);

        StringBuilder sb = new StringBuilder();
        while (q-- > 0) {
            int l = fs.nextInt(), r = fs.nextInt(), k = fs.nextInt();
            int pos = upperBound(vals[1], k);
            sb.append(query(1, 0, n - 1, l - 1, r - 1, pos)).append('\\n');
        }
        System.out.print(sb.toString());
    }
}
`,
        python3: `import bisect
import sys

sys.setrecursionlimit(200000)


def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    q = int(data[1])
    a = [int(v) for v in data[2 : 2 + n]]

    vals: list[list[int]] = [[] for _ in range(4 * n + 4)]
    to_left: list[list[int]] = [[] for _ in range(4 * n + 4)]
    to_right: list[list[int]] = [[] for _ in range(4 * n + 4)]

    def build(v: int, l: int, r: int) -> None:
        if l == r:
            vals[v] = [a[l]]
            return
        mid = (l + r) >> 1
        build(v << 1, l, mid)
        build(v << 1 | 1, mid + 1, r)
        l_arr = vals[v << 1]
        r_arr = vals[v << 1 | 1]
        sz = len(l_arr) + len(r_arr)
        merged = [0] * sz
        tl = [0] * (sz + 1)
        tr = [0] * (sz + 1)
        i = 0
        j = 0
        k = 0
        while i < len(l_arr) or j < len(r_arr):
            tl[k] = i
            tr[k] = j
            if j == len(r_arr) or (i < len(l_arr) and l_arr[i] <= r_arr[j]):
                merged[k] = l_arr[i]
                i += 1
            else:
                merged[k] = r_arr[j]
                j += 1
            k += 1
        tl[sz] = len(l_arr)
        tr[sz] = len(r_arr)
        vals[v] = merged
        to_left[v] = tl
        to_right[v] = tr

    def query(v: int, l: int, r: int, ql: int, qr: int, pos: int) -> int:
        if ql > r or qr < l or pos == 0:
            return 0
        if ql <= l and r <= qr:
            return pos
        mid = (l + r) >> 1
        return query(v << 1, l, mid, ql, qr, to_left[v][pos]) + query(
            v << 1 | 1, mid + 1, r, ql, qr, to_right[v][pos]
        )

    build(1, 0, n - 1)
    out: list[str] = []
    idx = 2 + n
    for _ in range(q):
        l = int(data[idx])
        r = int(data[idx + 1])
        k = int(data[idx + 2])
        idx += 3
        pos = bisect.bisect_right(vals[1], k)
        out.append(str(query(1, 0, n - 1, l - 1, r - 1, pos)))

    sys.stdout.write("\\n".join(out) + "\\n")


if __name__ == "__main__":
    solve()
`,
        ruby: `data = $stdin.read.split
exit if data.empty?
n = data[0].to_i
q = data[1].to_i
a = data[2, n].map(&:to_i)

vals = Array.new(4 * n + 4)
to_left = Array.new(4 * n + 4)
to_right = Array.new(4 * n + 4)

build = lambda do |v, l, r|
  if l == r
    vals[v] = [a[l]]
    return
  end
  mid = (l + r) >> 1
  build.call(v << 1, l, mid)
  build.call((v << 1) | 1, mid + 1, r)
  la = vals[v << 1]
  ra = vals[(v << 1) | 1]
  sz = la.length + ra.length
  merged = Array.new(sz, 0)
  tl = Array.new(sz + 1, 0)
  tr = Array.new(sz + 1, 0)
  i = 0
  j = 0
  k = 0
  while i < la.length || j < ra.length
    tl[k] = i
    tr[k] = j
    if j == ra.length || (i < la.length && la[i] <= ra[j])
      merged[k] = la[i]
      i += 1
    else
      merged[k] = ra[j]
      j += 1
    end
    k += 1
  end
  tl[sz] = la.length
  tr[sz] = ra.length
  vals[v] = merged
  to_left[v] = tl
  to_right[v] = tr
end

query = lambda do |v, l, r, ql, qr, pos|
  return 0 if ql > r || qr < l || pos == 0
  return pos if ql <= l && r <= qr

  mid = (l + r) >> 1
  query.call(v << 1, l, mid, ql, qr, to_left[v][pos]) +
    query.call((v << 1) | 1, mid + 1, r, ql, qr, to_right[v][pos])
end

build.call(1, 0, n - 1)
out = []
idx = 2 + n
q.times do
  l = data[idx].to_i
  r = data[idx + 1].to_i
  k = data[idx + 2].to_i
  idx += 3
  pos = vals[1].bsearch_index { |v| v > k } || vals[1].length
  out << query.call(1, 0, n - 1, l - 1, r - 1, pos).to_s
end

puts out.join("\\n")
`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'Codeforces',
      title: 'MKTHNUM / Range K-th & Wavelet Tree Classics',
      difficulty: '2200–2400',
      url: 'https://codeforces.com/problemset?tags=data+structures',
      patternNote: 'Wavelet Tree replaces Persistent Segment Tree or O(N log^2 N) Merge-Sort Trees cleanly.',
    },
    {
      platform: 'CodeChef',
      title: 'DISTNUM3 / Wavelet Tree Quantiles & Swaps',
      difficulty: 'Hard',
      url: 'https://www.codechef.com/',
      patternNote: 'Supports adjacent swap updates in O(log Sigma) by adjusting only split boundary prefix counts.',
    },
    {
      platform: 'CSES',
      title: 'Range Queries and Copies / Subarray Quantiles',
      difficulty: 'Hard',
      url: 'https://cses.fi/problemset/list/',
      patternNote: 'Value-partitioned prefix arrays answer arbitrary subarray order statistics online.',
    },
  ],
  interviewNotes: [
    'Explain the architectural inversion between a Segment Tree (partitions index space, queries value properties) and a Wavelet Tree (partitions value domain, preserves index ordering via prefix arrays b[i]).',
    'Walk through the exact child subrange transformation [b[L-1] + 1, b[R]] and [(L - 1 - b[L-1]) + 1, R - b[R]] so interviewers see why every level drops to O(1) index arithmetic.',
    'Explain how Fractional Cascading reduces O(log^2 N) Merge-Sort Tree queries to O(log N): you pay the binary search cost ONCE at the root, and precomputed bridge pointers propagate the rank down every tree level.',
  ],
  projectBlueprint: {
    title: 'Compressed Columnar Database Range-Quantile & Histogram Engine',
    tagline: 'Succinct value-domain analytical indexing layer for zero-scan median, percentile, and histogram SQL queries',
    stackSummary: 'TypeScript TypedArray Index + Wavelet Prefix Arrays + Cascade Bridge Tables',
    asciiDiagram: [
      '+---------------------------------------------------------------+',
      '|  Column Values A[1..N] --(Compress)--> Ranks [0..U-1]         |',
      '|                                |                              |',
      '|              +-----------------+-----------------+            |',
      '|              v                                   v            |',
      '|    [lo..mid] b[i] (left prefix)       [mid+1..hi] (i - b[i])  |',
      '|              |                                                |',
      '|              v                                                |',
      '|    O(log U) Online PERCENTILE_DISC(K) & COUNT_LEQ(L, R, X)    |',
      '+---------------------------------------------------------------+',
    ].join('\n'),
    milestones: [
      {
        id: 'm1',
        title: 'Dictionary Encoder & Wavelet Builder',
        detail: 'Compress arbitrary numeric columns into compact [0..U-1] integer partitions.',
      },
      {
        id: 'm2',
        title: 'Augmented Prefix-Sum Nodes',
        detail: 'Store left-child value sums alongside routing counts for exact O(log U) AVG/SUM WHERE val <= K.',
      },
      {
        id: 'm3',
        title: 'Fractional Cascading Bridge Array',
        detail: 'Eliminate secondary binary searches across merge-sort index partitions.',
      },
    ],
    starterCode: `export class WaveletNode {
  b: Int32Array = new Int32Array(0);
  left: WaveletNode | null = null;
  right: WaveletNode | null = null;
  constructor(public lo: number, public hi: number) {}
}`,
  },
};
