import type { TheoryChapter } from '../../types/vault';

export const CH41_DSU_ON_TREE_SACK: TheoryChapter = {
  slug: 'small-to-large-dsu-on-tree',
  topicId: 'gr-36',
  title: 'Small-to-Large Merging (DSU on Tree / Sack)',
  domain: 'Graph & Tree Theory',
  ratingTier: '1900–2200',
  usacoDivision: 'Platinum',
  subtitle:
    'Answer offline subtree frequency, distinct-count, and depth-parity queries across an entire tree in O(N log N)—either by swapping sets from smaller children into the largest child, or via Arpa’s flat-array Sack algorithm.',
  analogyTitle: 'The Heavy-Bucket Reuse & Warehouse Consolidation Analogy',
  analogyBody:
    'Imagine every tree node owns a warehouse full of colored boxes, and each parent needs to combine all its children’s warehouses to answer a question about its subtree. Copying every child’s boxes into a brand-new warehouse takes `O(N^2)` on a skewed tree. Two simple tricks slash this to `O(N log N)`: **(1) Map/Set Swapping (Small-to-Large)**: if parent `u` keeps the **largest child’s** warehouse untouched (`swap(mp[u], mp[heavyChild])` in `O(1)`) and manually moves boxes ONLY from the **smaller (light) children**, every box moved sees its warehouse size at least **double** (`>= 2x`)—meaning any single box can be moved at most `log2(N)` times across the entire algorithm! **(2) Arpa’s Sack (`keep = true / false`)**: instead of `N` separate hash maps (`O(N log N)` overhead), maintain ONE global frequency array `cnt[]`! Process light children with `keep = false` (add, answer, then erase), then process the **heavy child LAST with `keep = true`** (leaving its subtree inside `cnt[]`!), and finally re-walk only the light children’s Euler tour ranges `tin[c]..tout[c]` to add them in `O(N log N)` flat-array speed!',
  prerequisites: [
    {
      slug: 'lca-binary-lifting-euler-tour',
      title: 'LCA, Binary Lifting & Euler Tour',
    },
  ],
  traceTitle: 'Interactive Heavy-Child Selection & Amortized Element-Move Counter Trace',
  traceSubtitle:
    'Track subtree sizes `sz[u]`, heavy child pointers `heavy[u]`, and global `cnt[]` mutations during Arpa’s Sack on a 7-node colored tree.',
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Step 1: Compute Subtree Sizes sz[u], Euler Tour [tin..tout], and Heavy Children',
      explanation:
        'Root at 1. Subtree sizes: sz = [-, 7, 4, 2, 1, 1, 1, 1]. At root 1, child 2 (sz=4) beats child 3 (sz=2), so heavy[1] = 2 and node 3 is a LIGHT child!',
      mode: 'graph',
      graph: {
        calloutMetric: 'Heavy edges marked in green: heavy[1]=2, heavy[2]=4, heavy[3]=7',
        nodes: [
          { id: '1', label: '1 (c=A, sz=7)', x: 260, y: 38, state: 'active' },
          { id: '2', label: '2 (c=B, sz=4)', x: 145, y: 120, state: 'matched' },
          { id: '3', label: '3 (c=A, sz=2)', x: 375, y: 120, state: 'even' },
          { id: '4', label: '4 (c=C, sz=1)', x: 70, y: 215, state: 'matched' },
          { id: '5', label: '5 (c=B, sz=1)', x: 145, y: 215, state: 'unmatched' },
          { id: '6', label: '6 (c=A, sz=1)', x: 220, y: 215, state: 'unmatched' },
          { id: '7', label: '7 (c=C, sz=1)', x: 375, y: 215, state: 'matched' },
        ],
        edges: [
          { id: 'e12', from: '1', to: '2', state: 'matched' },
          { id: 'e13', from: '1', to: '3', state: 'default' },
          { id: 'e24', from: '2', to: '4', state: 'matched' },
          { id: 'e25', from: '2', to: '5', state: 'default' },
          { id: 'e26', from: '2', to: '6', state: 'default' },
          { id: 'e37', from: '3', to: '7', state: 'matched' },
        ],
      },
      variables: { TotalNodes: 7, HeavyOf1: 2, LightOf1: 3, TotalMoves: 0 },
    },
    {
      stepNumber: 2,
      title: 'Step 2: Visit Light Subtree (Node 3) with keep=0, Answer It, Then Erase',
      explanation:
        'At node 1, recurse into light child 3 FIRST with keep=false. Node 3 visits 7 (c=C), adds c=A, answers distinct[3]=2 ({A, C}), then clears cnt[] completely back to [0, 0, 0] before returning so it does not pollute child 2!',
      mode: 'array',
      arrays: [
        {
          name: 'Global cnt[color] After Light Subtree 3 Cleanup',
          cells: [
            { index: 0, value: 0, label: 'Color A', highlight: 'neutral' },
            { index: 1, value: 0, label: 'Color B', highlight: 'neutral' },
            { index: 2, value: 0, label: 'Color C', highlight: 'neutral' },
          ],
        },
      ],
      variables: { AnswerNode3: 2, AnswerNode7: 1, KeepFlag: 'false', MovesSoFar: 4 },
    },
    {
      stepNumber: 3,
      title: 'Step 3: Visit Heavy Child (Node 2) LAST with keep=1 — Zero Cleanup Needed!',
      explanation:
        'Recurse into heavy child 2 with keep=true. It retains all 4 elements of subtree(2) directly inside global cnt[]: {A: 1, B: 2, C: 1}. Zero re-insertions for the 4 heavy-subtree nodes!',
      mode: 'array',
      arrays: [
        {
          name: 'Global cnt[color] Retained from Heavy Child 2',
          cells: [
            { index: 0, value: 1, label: 'Color A', highlight: 'window' },
            { index: 1, value: 2, label: 'Color B', highlight: 'active' },
            { index: 2, value: 1, label: 'Color C', highlight: 'window' },
          ],
        },
      ],
      variables: { AnswerNode2: 3, RetainedHeavyNodes: 4, KeepFlag: 'true' },
    },
    {
      stepNumber: 4,
      title: 'Step 4: Add Node 1 + Re-Walk Light Subtree 3 (Euler Range [tin[3]..tout[3]])',
      explanation:
        'Finally add node 1 (c=A) and scan flat Euler indices of light subtree 3 (nodes {3, 7}) into cnt[]. Now cnt = {A: 3, B: 2, C: 2} -> answer distinct[1] = 3 in O(N log N) total moves across all nodes!',
      mode: 'array',
      arrays: [
        {
          name: 'Final Global cnt[color] at Root 1',
          cells: [
            { index: 0, value: 3, label: 'Color A', highlight: 'active' },
            { index: 1, value: 2, label: 'Color B', highlight: 'updated' },
            { index: 2, value: 2, label: 'Color C', highlight: 'updated' },
          ],
        },
      ],
      variables: { DistinctAtRoot1: 3, DominatingColorAt1: 'A (cnt=3)', TotalMovesAcrossTree: 9 },
    },
  ],
  reductionClues: [
    {
      clue: '"Answer offline queries over EVERY subtree (distinct values, mode frequency, XOR pairs, depth counts)"',
      translation:
        '**DSU on Tree (Sack)**! If each query depends only on the multiset of nodes inside subtree `v`, answer ALL queries offline during a single DFS in `O(N log N)` instead of `O(N sqrt(N))` Mo’s on Trees!',
    },
    {
      clue: '"Maintain a std::set / std::map / hash_map per node and merge children up to parent"',
      translation:
        'Use **Small-to-Large Set Swapping**: `if (st[u].size() < st[v].size()) swap(st[u], st[v]);` then loop `st[v]` into `st[u]`. Takes 5 lines of code and `O(N log^2 N)` time (`O(N log N)` with `unordered_map` / hash table)!',
    },
    {
      clue: '"Subtree queries ask for sum of MOST FREQUENT colors, or frequencies at exact depth h in subtree v"',
      translation:
        'Use **Arpa’s Sack (`cnt[]` + Euler `tin..tout`)**! Because Sack maintains a single global flat array `cnt[val]` (or `cnt[depth]`), maintaining `maxFreq`, `sumOfMaxColors`, or `depthMask[depth]` takes `O(1)` per element insertion/deletion—keeping total complexity strictly `O(N log N)`!',
    },
    {
      clue: '"Check whether characters at depth h in subtree v can be rearranged into a palindrome"',
      translation:
        'A multiset of letters forms a palindrome iff **at most 1 letter has an odd count**! Store a 26-bit integer `mask[depth]` per depth; toggling node `u` flips `mask[depth[u]] ^= (1 << char(u))`, and the palindrome check is simply `(m & (m - 1)) == 0` in `O(1)`!',
    },
  ],
  timeComplexity: 'O(N log N) (Arpa Sack) | O(N log^2 N) (std::set / TreeSet Small-to-Large)',
  spaceComplexity: 'O(N) (Arpa Sack) | O(N log N) peak or O(N) with cleared light maps',
  pitfalls: [
    {
      type: 'TLE',
      title: 'Writing a = merge(a, b) Without Swapping by Container Size (O(N^2) Disaster)',
      detail:
        'If `u` only has ONE child `v` or `u` is smaller than `v`, NOT executing `if (map[u].size() < map[v].size()) swap(map[u], map[v])` copies the giant `N`-element map `N` times up a bamboo path—instant `O(N^2)` TLE!',
    },
    {
      type: 'TLE',
      title: 'Allocating std::vector or Clearing Entire Global cnt[1..N] Between Light Subtrees',
      detail:
        'Inside Sack’s `keep = false` cleanup, NEVER call `memset(cnt, 0, sizeof(cnt))` (`O(N)` per node = `O(N^2)`!). Instead iterate ONLY over the exact nodes `id = tin[u]..tout[u]` (`order[id]`) and decrement `cnt[val[node]]--`—touching only `sz[u]` entries!',
    },
    {
      type: 'WA',
      title: 'Forgetting to Reset Auxiliary State (like maxFreq / maxSum) During keep = false Cleanup',
      detail:
        'In Lomsat Gelral, when `keep = false` clears `cnt[col]--` after visiting a light child, you CANNOT decrement `maxFreq` easily during deletions—instead simply reset `maxFreq = 0; sumMax = 0;` right after erasing the light subtree (because the entire global `cnt[]` is guaranteed empty at that instant!).',
    },
    {
      type: 'RE',
      title: 'Deep Recursion Stack Overflow on Bamboo Trees (N = 2 * 10^5)',
      detail:
        'In Python, Java, and Ruby, recursive DFS on `N = 200,000` line graphs throws `StackOverflowError` / `RecursionError`! Precompute `tin[]`, `tout[]`, `flat[]`, and `heavy[]` with an **explicit iterative stack**, and even run Sack iteratively or with heavy-child TCO!',
    },
  ],
  implementations: {
    cpp20: `#include <bits/stdc++.h>
using namespace std;

// Arpa's DSU on Tree (Sack): Distinct Colors in Every Subtree in O(N log N)
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    if (!(cin >> n)) return 0;
    vector<int> rawColor(n + 1), vals(n);
    for (int i = 1; i <= n; i++) {
        cin >> rawColor[i];
        vals[i - 1] = rawColor[i];
    }
    sort(vals.begin(), vals.end());
    vals.erase(unique(vals.begin(), vals.end()), vals.end());
    vector<int> col(n + 1);
    for (int i = 1; i <= n; i++) {
        col[i] = (int)(lower_bound(vals.begin(), vals.end(), rawColor[i]) - vals.begin());
    }

    vector<vector<int>> adj(n + 1);
    for (int i = 0; i < n - 1; i++) {
        int u, v;
        cin >> u >> v;
        adj[u].push_back(v);
        adj[v].push_back(u);
    }

    vector<int> sz(n + 1, 1), heavy(n + 1, 0), tin(n + 1), tout(n + 1), flat(n + 1);
    int timer = 0;

    function<void(int, int)> dfsSz = [&](int u, int p) {
        tin[u] = ++timer;
        flat[timer] = u;
        int bestSz = 0;
        for (int v : adj[u]) {
            if (v == p) continue;
            dfsSz(v, u);
            sz[u] += sz[v];
            if (sz[v] > bestSz) {
                bestSz = sz[v];
                heavy[u] = v;
            }
        }
        tout[u] = timer;
    };
    dfsSz(1, 0);

    vector<int> cnt(vals.size(), 0), ans(n + 1, 0);
    int distinct = 0;

    auto addNode = [&](int u) {
        if (cnt[col[u]]++ == 0) distinct++;
    };
    auto remNode = [&](int u) {
        if (--cnt[col[u]] == 0) distinct--;
    };

    function<void(int, int, bool)> sack = [&](int u, int p, bool keep) {
        // 1. Process all light children (erase after answering)
        for (int v : adj[u]) {
            if (v != p && v != heavy[u]) sack(v, u, false);
        }
        // 2. Process heavy child LAST and retain its counts in global cnt[]
        if (heavy[u]) sack(heavy[u], u, true);

        // 3. Re-add light subtrees via flat Euler range + add u itself
        for (int v : adj[u]) {
            if (v != p && v != heavy[u]) {
                for (int t = tin[v]; t <= tout[v]; t++) addNode(flat[t]);
            }
        }
        addNode(u);
        ans[u] = distinct;

        // 4. Clean up if u is a light child
        if (!keep) {
            for (int t = tin[u]; t <= tout[u]; t++) remNode(flat[t]);
        }
    };

    sack(1, 0, true);
    for (int i = 1; i <= n; i++) cout << ans[i] << (i == n ? '\\n' : ' ');
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

    let mut raw = vec![0i64; n + 1];
    let mut vals = Vec::with_capacity(n);
    for i in 1..=n {
        let x: i64 = it.next().unwrap().parse().unwrap();
        raw[i] = x;
        vals.push(x);
    }
    vals.sort_unstable();
    vals.dedup();
    let mut col = vec![0usize; n + 1];
    for i in 1..=n {
        col[i] = vals.binary_search(&raw[i]).unwrap();
    }

    let mut adj = vec![Vec::new(); n + 1];
    for _ in 0..n - 1 {
        let u: usize = it.next().unwrap().parse().unwrap();
        let v: usize = it.next().unwrap().parse().unwrap();
        adj[u].push(v);
        adj[v].push(u);
    }

    // Iterative DFS for Euler tour + heavy child computation (stack-safe for N = 2e5)
    let mut parent = vec![0usize; n + 1];
    let mut sz = vec![1usize; n + 1];
    let mut heavy = vec![0usize; n + 1];
    let mut tin = vec![0usize; n + 1];
    let mut tout = vec![0usize; n + 1];
    let mut flat = vec![0usize; n + 1];

    let mut stk: Vec<(usize, usize, bool)> = Vec::with_capacity(2 * n);
    stk.push((1, 0, false));
    let mut timer = 0usize;
    while let Some((u, p, done)) = stk.pop() {
        if !done {
            parent[u] = p;
            timer += 1;
            tin[u] = timer;
            flat[timer] = u;
            stk.push((u, p, true));
            for &v in &adj[u] {
                if v != p {
                    stk.push((v, u, false));
                }
            }
        } else {
            tout[u] = timer;
            let mut best = 0;
            for &v in &adj[u] {
                if v != p {
                    sz[u] += sz[v];
                    if sz[v] > best {
                        best = sz[v];
                        heavy[u] = v;
                    }
                }
            }
        }
    }

    // Iterative Arpa's Sack using state machine frames
    let mut cnt = vec![0usize; vals.len()];
    let mut distinct = 0usize;
    let mut ans = vec![0usize; n + 1];

    enum Frame {
        Enter(usize, bool),
        Finish(usize, bool),
    }

    let mut frames = Vec::with_capacity(3 * n);
    frames.push(Frame::Enter(1, true));
    while let Some(fr) = frames.pop() {
        match fr {
            Frame::Enter(u, keep) => {
                frames.push(Frame::Finish(u, keep));
                if heavy[u] != 0 {
                    frames.push(Frame::Enter(heavy[u], true));
                }
                for &v in &adj[u] {
                    if v != parent[u] && v != heavy[u] {
                        frames.push(Frame::Enter(v, false));
                    }
                }
            }
            Frame::Finish(u, keep) => {
                for &v in &adj[u] {
                    if v != parent[u] && v != heavy[u] {
                        for t in tin[v]..=tout[v] {
                            let c = col[flat[t]];
                            if cnt[c] == 0 {
                                distinct += 1;
                            }
                            cnt[c] += 1;
                        }
                    }
                }
                let cu = col[u];
                if cnt[cu] == 0 {
                    distinct += 1;
                }
                cnt[cu] += 1;
                ans[u] = distinct;
                if !keep {
                    for t in tin[u]..=tout[u] {
                        let c = col[flat[t]];
                        cnt[c] -= 1;
                        if cnt[c] == 0 {
                            distinct -= 1;
                        }
                    }
                }
            }
        }
    }

    let out: Vec<String> = (1..=n).map(|i| ans[i].to_string()).collect();
    println!("{}", out.join(" "));
}`,
    java21: `import java.io.IOException;
import java.io.InputStream;
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
        int nextInt() throws IOException {
            int c = readByte();
            while (c >= 0 && c <= ' ') c = readByte();
            if (c == -1) return Integer.MIN_VALUE;
            int res = 0;
            while (c > ' ') { res = res * 10 + (c - '0'); c = readByte(); }
            return res;
        }
    }

    @SuppressWarnings("unchecked")
    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        int n = fs.nextInt();
        if (n == Integer.MIN_VALUE) return;

        int[] raw = new int[n + 1];
        int[] sorted = new int[n];
        for (int i = 1; i <= n; i++) {
            raw[i] = fs.nextInt();
            sorted[i - 1] = raw[i];
        }
        Arrays.sort(sorted);
        int m = 0;
        for (int i = 0; i < n; i++) {
            if (i == 0 || sorted[i] != sorted[i - 1]) sorted[m++] = sorted[i];
        }
        int[] col = new int[n + 1];
        for (int i = 1; i <= n; i++) col[i] = Arrays.binarySearch(sorted, 0, m, raw[i]);

        List<Integer>[] adj = new ArrayList[n + 1];
        for (int i = 1; i <= n; i++) adj[i] = new ArrayList<>();
        for (int i = 0; i < n - 1; i++) {
            int u = fs.nextInt(), v = fs.nextInt();
            adj[u].add(v);
            adj[v].add(u);
        }

        int[] parent = new int[n + 1], sz = new int[n + 1], heavy = new int[n + 1];
        int[] tin = new int[n + 1], tout = new int[n + 1], flat = new int[n + 1];
        Arrays.fill(sz, 1);

        // Iterative Euler tour + heavy child computation
        int[] stkNode = new int[2 * n];
        boolean[] stkDone = new boolean[2 * n];
        int sp = 0, timer = 0;
        stkNode[sp] = 1; stkDone[sp++] = false;
        while (sp > 0) {
            int u = stkNode[--sp];
            boolean done = stkDone[sp];
            if (!done) {
                tin[u] = ++timer;
                flat[timer] = u;
                stkNode[sp] = u; stkDone[sp++] = true;
                for (int v : adj[u]) {
                    if (v != parent[u]) {
                        parent[v] = u;
                        stkNode[sp] = v; stkDone[sp++] = false;
                    }
                }
            } else {
                tout[u] = timer;
                int best = 0;
                for (int v : adj[u]) {
                    if (v != parent[u]) {
                        sz[u] += sz[v];
                        if (sz[v] > best) { best = sz[v]; heavy[u] = v; }
                    }
                }
            }
        }

        // Iterative Sack traversal
        int[] cnt = new int[m];
        int[] ans = new int[n + 1];
        int distinct = 0;
        int[] fNode = new int[3 * n];
        boolean[] fKeep = new boolean[3 * n];
        boolean[] fFinish = new boolean[3 * n];
        int fp = 0;
        fNode[fp] = 1; fKeep[fp] = true; fFinish[fp++] = false;

        while (fp > 0) {
            int u = fNode[--fp];
            boolean keep = fKeep[fp], finish = fFinish[fp];
            if (!finish) {
                fNode[fp] = u; fKeep[fp] = keep; fFinish[fp++] = true;
                if (heavy[u] != 0) {
                    fNode[fp] = heavy[u]; fKeep[fp] = true; fFinish[fp++] = false;
                }
                for (int v : adj[u]) {
                    if (v != parent[u] && v != heavy[u]) {
                        fNode[fp] = v; fKeep[fp] = false; fFinish[fp++] = false;
                    }
                }
            } else {
                for (int v : adj[u]) {
                    if (v != parent[u] && v != heavy[u]) {
                        for (int t = tin[v]; t <= tout[v]; t++) {
                            int c = col[flat[t]];
                            if (cnt[c]++ == 0) distinct++;
                        }
                    }
                }
                if (cnt[col[u]]++ == 0) distinct++;
                ans[u] = distinct;
                if (!keep) {
                    for (int t = tin[u]; t <= tout[u]; t++) {
                        int c = col[flat[t]];
                        if (--cnt[c] == 0) distinct--;
                    }
                }
            }
        }

        StringBuilder sb = new StringBuilder();
        for (int i = 1; i <= n; i++) {
            if (i > 1) sb.append(' ');
            sb.append(ans[i]);
        }
        sb.append('\\n');
        System.out.print(sb);
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
    raw = [0] + [int(next(it)) for _ in range(n)]
    vals = sorted(set(raw[1:]))
    comp = {v: i for i, v in enumerate(vals)}
    col = [0] + [comp[raw[i]] for i in range(1, n + 1)]

    adj = [[] for _ in range(n + 1)]
    for _ in range(n - 1):
        u = int(next(it))
        v = int(next(it))
        adj[u].append(v)
        adj[v].append(u)

    parent = [0] * (n + 1)
    sz = [1] * (n + 1)
    heavy = [0] * (n + 1)
    tin = [0] * (n + 1)
    tout = [0] * (n + 1)
    flat = [0] * (n + 1)

    # Iterative Euler tour + heavy child computation
    timer = 0
    stk = [(1, 0)]
    while stk:
        u, state = stk.pop()
        if state == 0:
            timer += 1
            tin[u] = timer
            flat[timer] = u
            stk.append((u, 1))
            p = parent[u]
            for v in adj[u]:
                if v != p:
                    parent[v] = u
                    stk.append((v, 0))
        else:
            tout[u] = timer
            best = 0
            p = parent[u]
            for v in adj[u]:
                if v != p:
                    sz[u] += sz[v]
                    if sz[v] > best:
                        best = sz[v]
                        heavy[u] = v

    # Iterative Arpa's Sack
    cnt = [0] * len(vals)
    ans = [0] * (n + 1)
    distinct = 0
    frames = [(1, True, False)]
    while frames:
        u, keep, finish = frames.pop()
        if not finish:
            frames.append((u, keep, True))
            if heavy[u]:
                frames.append((heavy[u], True, False))
            p = parent[u]
            h = heavy[u]
            for v in adj[u]:
                if v != p and v != h:
                    frames.append((v, False, False))
        else:
            p = parent[u]
            h = heavy[u]
            for v in adj[u]:
                if v != p and v != h:
                    for t in range(tin[v], tout[v] + 1):
                        c = col[flat[t]]
                        if cnt[c] == 0:
                            distinct += 1
                        cnt[c] += 1
            cu = col[u]
            if cnt[cu] == 0:
                distinct += 1
            cnt[cu] += 1
            ans[u] = distinct
            if not keep:
                for t in range(tin[u], tout[u] + 1):
                    c = col[flat[t]]
                    cnt[c] -= 1
                    if cnt[c] == 0:
                        distinct -= 1

    sys.stdout.write(" ".join(str(ans[i]) for i in range(1, n + 1)) + "\\n")

if __name__ == "__main__":
    solve()`,
    ruby: `tokens = $stdin.read.split
exit if tokens.empty?
idx = 0
n = tokens[idx].to_i; idx += 1
raw = [0]
n.times do
  raw << tokens[idx].to_i
  idx += 1
end

vals = raw[1..].uniq.sort
comp = {}
vals.each_with_index { |v, i| comp[v] = i }
col = [0] + raw[1..].map { |v| comp[v] }

adj = Array.new(n + 1) { [] }
(n - 1).times do
  u = tokens[idx].to_i; idx += 1
  v = tokens[idx].to_i; idx += 1
  adj[u] << v
  adj[v] << u
end

parent = Array.new(n + 1, 0)
sz = Array.new(n + 1, 1)
heavy = Array.new(n + 1, 0)
tin = Array.new(n + 1, 0)
tout = Array.new(n + 1, 0)
flat = Array.new(n + 1, 0)

timer = 0
stk = [[1, false]]
until stk.empty?
  u, done = stk.pop
  if !done
    timer += 1
    tin[u] = timer
    flat[timer] = u
    stk << [u, true]
    p = parent[u]
    adj[u].each do |v|
      next if v == p
      parent[v] = u
      stk << [v, false]
    end
  else
    tout[u] = timer
    best = 0
    p = parent[u]
    adj[u].each do |v|
      next if v == p
      sz[u] += sz[v]
      if sz[v] > best
        best = sz[v]
        heavy[u] = v
      end
    end
  end
end

cnt = Array.new(vals.length, 0)
ans = Array.new(n + 1, 0)
distinct = 0
frames = [[1, true, false]]
until frames.empty?
  u, keep, finish = frames.pop
  if !finish
    frames << [u, keep, true]
    frames << [heavy[u], true, false] if heavy[u] != 0
    p = parent[u]
    h = heavy[u]
    adj[u].each do |v|
      next if v == p || v == h
      frames << [v, false, false]
    end
  else
    p = parent[u]
    h = heavy[u]
    adj[u].each do |v|
      next if v == p || v == h
      (tin[v]..tout[v]).each do |t|
        c = col[flat[t]]
        distinct += 1 if cnt[c] == 0
        cnt[c] += 1
      end
    end
    cu = col[u]
    distinct += 1 if cnt[cu] == 0
    cnt[cu] += 1
    ans[u] = distinct
    if !keep
      (tin[u]..tout[u]).each do |t|
        c = col[flat[t]]
        cnt[c] -= 1
        distinct -= 1 if cnt[c] == 0
      end
    end
  end
end

puts (1..n).map { |i| ans[i].to_s }.join(" ")`,
  },
  practiceProblems: [
    {
      id: 'ch41-p1',
      tier: 'Warmup',
      ratingRange: '1750–1950',
      title: 'Distinct Colors in Every Subtree (CSES Set-Swapping Method)',
      statement:
        'You are given a rooted tree with N vertices (root is vertex 1). Each vertex `i` has an integer color `c[i]`. For every vertex `1..N`, compute the number of distinct colors in its subtree using the clean Small-to-Large `std::set` / `HashSet` swapping technique.',
      constraints: '1 <= N <= 2 * 10^5, 1 <= c[i] <= 10^9',
      sampleInput: '5\n2 3 2 2 1\n1 2\n1 3\n3 4\n3 5',
      sampleOutput: '3 1 2 1 1',
      hints: [
        'Keep a `HashSet` / `std::set` for every node `u`. Before merging child `v` into `u`, always check `if (sets[u].size() < sets[v].size()) swap(sets[u], sets[v])`!',
        'When `sets[u]` adopts the larger child’s pointer/reference in `O(1)`, iterating only over the smaller set inserts each element at most `log2(N)` times—just `~18` swaps in the worst case!',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    if (!(cin >> n)) return 0;
    vector<set<int>> st(n + 1);
    for (int i = 1; i <= n; i++) {
        int c;
        cin >> c;
        st[i].insert(c);
    }

    vector<vector<int>> adj(n + 1);
    for (int i = 0; i < n - 1; i++) {
        int u, v;
        cin >> u >> v;
        adj[u].push_back(v);
        adj[v].push_back(u);
    }

    vector<int> parent(n + 1, 0), order = {1};
    order.reserve(n);
    for (size_t i = 0; i < order.size(); i++) {
        int u = order[i];
        for (int v : adj[u]) {
            if (v != parent[u]) {
                parent[v] = u;
                order.push_back(v);
            }
        }
    }

    vector<int> ans(n + 1, 0);
    for (int i = n - 1; i >= 0; i--) {
        int u = order[i];
        ans[u] = (int)st[u].size();
        int p = parent[u];
        if (p != 0) {
            if (st[p].size() < st[u].size()) swap(st[p], st[u]);
            for (int x : st[u]) st[p].insert(x);
            st[u].clear();
        }
    }

    for (int i = 1; i <= n; i++) cout << ans[i] << (i == n ? '\\n' : ' ');
    return 0;
}`,
        rust: `use std::collections::HashSet;
use std::io::{self, Read};

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let n: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };

    let mut st: Vec<HashSet<i64>> = vec![HashSet::new(); n + 1];
    for i in 1..=n {
        let c: i64 = it.next().unwrap().parse().unwrap();
        st[i].insert(c);
    }

    let mut adj = vec![Vec::new(); n + 1];
    for _ in 0..n - 1 {
        let u: usize = it.next().unwrap().parse().unwrap();
        let v: usize = it.next().unwrap().parse().unwrap();
        adj[u].push(v);
        adj[v].push(u);
    }

    let mut parent = vec![0usize; n + 1];
    let mut order = Vec::with_capacity(n);
    order.push(1usize);
    let mut idx = 0;
    while idx < order.len() {
        let u = order[idx];
        idx += 1;
        for &v in &adj[u] {
            if v != parent[u] {
                parent[v] = u;
                order.push(v);
            }
        }
    }

    let mut ans = vec![0usize; n + 1];
    for &u in order.iter().rev() {
        ans[u] = st[u].len();
        let p = parent[u];
        if p != 0 {
            if st[p].len() < st[u].len() {
                st.swap(p, u);
            }
            let drained: Vec<i64> = st[u].drain().collect();
            for x in drained {
                st[p].insert(x);
            }
        }
    }

    let out: Vec<String> = (1..=n).map(|i| ans[i].to_string()).collect();
    println!("{}", out.join(" "));
}`,
        java21: `import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

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
        int nextInt() throws IOException {
            int c = readByte();
            while (c >= 0 && c <= ' ') c = readByte();
            if (c == -1) return Integer.MIN_VALUE;
            int res = 0;
            while (c > ' ') { res = res * 10 + (c - '0'); c = readByte(); }
            return res;
        }
    }

    @SuppressWarnings("unchecked")
    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        int n = fs.nextInt();
        if (n == Integer.MIN_VALUE) return;

        Set<Integer>[] sets = new HashSet[n + 1];
        for (int i = 1; i <= n; i++) {
            sets[i] = new HashSet<>();
            sets[i].add(fs.nextInt());
        }

        List<Integer>[] adj = new ArrayList[n + 1];
        for (int i = 1; i <= n; i++) adj[i] = new ArrayList<>();
        for (int i = 0; i < n - 1; i++) {
            int u = fs.nextInt(), v = fs.nextInt();
            adj[u].add(v);
            adj[v].add(u);
        }

        int[] parent = new int[n + 1];
        int[] order = new int[n];
        int qt = 0;
        order[qt++] = 1;
        for (int qh = 0; qh < qt; qh++) {
            int u = order[qh];
            for (int v : adj[u]) {
                if (v != parent[u]) {
                    parent[v] = u;
                    order[qt++] = v;
                }
            }
        }

        int[] ans = new int[n + 1];
        for (int i = n - 1; i >= 0; i--) {
            int u = order[i];
            ans[u] = sets[u].size();
            int p = parent[u];
            if (p != 0) {
                if (sets[p].size() < sets[u].size()) {
                    Set<Integer> tmp = sets[p];
                    sets[p] = sets[u];
                    sets[u] = tmp;
                }
                sets[p].addAll(sets[u]);
                sets[u] = null;
            }
        }

        StringBuilder sb = new StringBuilder();
        for (int i = 1; i <= n; i++) {
            if (i > 1) sb.append(' ');
            sb.append(ans[i]);
        }
        sb.append('\\n');
        System.out.print(sb);
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
    sets = [set()] + [{int(next(it))} for _ in range(n)]

    adj = [[] for _ in range(n + 1)]
    for _ in range(n - 1):
        u = int(next(it))
        v = int(next(it))
        adj[u].append(v)
        adj[v].append(u)

    parent = [0] * (n + 1)
    order = [1]
    for u in order:
        p = parent[u]
        for v in adj[u]:
            if v != p:
                parent[v] = u
                order.append(v)

    ans = [0] * (n + 1)
    for u in reversed(order):
        ans[u] = len(sets[u])
        p = parent[u]
        if p:
            if len(sets[p]) < len(sets[u]):
                sets[p], sets[u] = sets[u], sets[p]
            sets[p].update(sets[u])
            sets[u].clear()

    sys.stdout.write(" ".join(str(ans[i]) for i in range(1, n + 1)) + "\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `require "set"
tokens = $stdin.read.split
exit if tokens.empty?
idx = 0
n = tokens[idx].to_i; idx += 1
sets = [Set.new]
n.times do
  sets << Set.new([tokens[idx].to_i])
  idx += 1
end

adj = Array.new(n + 1) { [] }
(n - 1).times do
  u = tokens[idx].to_i; idx += 1
  v = tokens[idx].to_i; idx += 1
  adj[u] << v
  adj[v] << u
end

parent = Array.new(n + 1, 0)
order = [1]
head = 0
while head < order.length
  u = order[head]; head += 1
  p = parent[u]
  adj[u].each do |v|
    next if v == p
    parent[v] = u
    order << v
  end
end

ans = Array.new(n + 1, 0)
order.reverse_each do |u|
  ans[u] = sets[u].size
  p = parent[u]
  if p != 0
    if sets[p].size < sets[u].size
      sets[p], sets[u] = sets[u], sets[p]
    end
    sets[p].merge(sets[u])
    sets[u].clear
  end
end

puts (1..n).map { |i| ans[i].to_s }.join(" ")`,
      },
    },
    {
      id: 'ch41-p2',
      tier: 'Standard',
      ratingRange: '1900–2100',
      title: 'Lomsat Gelral — Sum of Dominating Colors in Every Subtree (O(N log N) Sack)',
      statement:
        'A color `c` is called **dominating** in the subtree of vertex `v` if no other color appears strictly more times than `c` inside `v`’s subtree (multiple colors can tie for maximum frequency!). Given a tree of N vertices rooted at 1 with color `c[i]` (`1 <= c[i] <= N`), find the **sum** of all dominating color IDs for every subtree `1..N`.',
      constraints: '1 <= N <= 10^5, 1 <= c[i] <= N',
      sampleInput: '4\n1 2 3 4\n1 2\n2 3\n2 4',
      sampleOutput: '10 9 3 4',
      hints: [
        'Use Arpa’s Sack with a global array `cnt[1..N]` plus two global scalars: `maxFreq` and `sumMax`!',
        'When adding node `u` of color `c`: `cnt[c]++`. If `cnt[c] > maxFreq`, reset `maxFreq = cnt[c]; sumMax = c;`! Else if `cnt[c] == maxFreq`, add `sumMax += c;`! When `keep = false`, decrement all `cnt[col[flat[t]]]--` in `[tin[u]..tout[u]]` and then reset `maxFreq = 0; sumMax = 0;`!',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

// CF 600E (Lomsat Gelral): Sum of dominating colors per subtree in O(N log N)
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    if (!(cin >> n)) return 0;
    vector<int> col(n + 1);
    for (int i = 1; i <= n; i++) cin >> col[i];

    vector<vector<int>> adj(n + 1);
    for (int i = 0; i < n - 1; i++) {
        int u, v;
        cin >> u >> v;
        adj[u].push_back(v);
        adj[v].push_back(u);
    }

    vector<int> sz(n + 1, 1), heavy(n + 1, 0), tin(n + 1), tout(n + 1), flat(n + 1);
    int timer = 0;
    function<void(int, int)> dfsSz = [&](int u, int p) {
        tin[u] = ++timer;
        flat[timer] = u;
        int best = 0;
        for (int v : adj[u]) {
            if (v == p) continue;
            dfsSz(v, u);
            sz[u] += sz[v];
            if (sz[v] > best) { best = sz[v]; heavy[u] = v; }
        }
        tout[u] = timer;
    };
    dfsSz(1, 0);

    vector<int> cnt(n + 1, 0);
    vector<long long> ans(n + 1, 0);
    int maxFreq = 0;
    long long sumMax = 0;

    auto addColor = [&](int c) {
        cnt[c]++;
        if (cnt[c] > maxFreq) {
            maxFreq = cnt[c];
            sumMax = c;
        } else if (cnt[c] == maxFreq) {
            sumMax += c;
        }
    };

    function<void(int, int, bool)> sack = [&](int u, int p, bool keep) {
        for (int v : adj[u]) if (v != p && v != heavy[u]) sack(v, u, false);
        if (heavy[u]) sack(heavy[u], u, true);

        for (int v : adj[u]) {
            if (v != p && v != heavy[u]) {
                for (int t = tin[v]; t <= tout[v]; t++) addColor(col[flat[t]]);
            }
        }
        addColor(col[u]);
        ans[u] = sumMax;

        if (!keep) {
            for (int t = tin[u]; t <= tout[u]; t++) cnt[col[flat[t]]]--;
            maxFreq = 0;
            sumMax = 0;
        }
    };

    sack(1, 0, true);
    for (int i = 1; i <= n; i++) cout << ans[i] << (i == n ? '\\n' : ' ');
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

    let mut col = vec![0usize; n + 1];
    for i in 1..=n {
        col[i] = it.next().unwrap().parse().unwrap();
    }

    let mut adj = vec![Vec::new(); n + 1];
    for _ in 0..n - 1 {
        let u: usize = it.next().unwrap().parse().unwrap();
        let v: usize = it.next().unwrap().parse().unwrap();
        adj[u].push(v);
        adj[v].push(u);
    }

    let mut parent = vec![0usize; n + 1];
    let mut sz = vec![1usize; n + 1];
    let mut heavy = vec![0usize; n + 1];
    let mut tin = vec![0usize; n + 1];
    let mut tout = vec![0usize; n + 1];
    let mut flat = vec![0usize; n + 1];

    let mut stk = Vec::with_capacity(2 * n);
    stk.push((1usize, 0usize, false));
    let mut timer = 0usize;
    while let Some((u, p, done)) = stk.pop() {
        if !done {
            parent[u] = p;
            timer += 1;
            tin[u] = timer;
            flat[timer] = u;
            stk.push((u, p, true));
            for &v in &adj[u] {
                if v != p {
                    stk.push((v, u, false));
                }
            }
        } else {
            tout[u] = timer;
            let mut best = 0;
            for &v in &adj[u] {
                if v != p {
                    sz[u] += sz[v];
                    if sz[v] > best {
                        best = sz[v];
                        heavy[u] = v;
                    }
                }
            }
        }
    }

    let mut cnt = vec![0usize; n + 1];
    let mut ans = vec![0i64; n + 1];
    let mut max_freq = 0usize;
    let mut sum_max = 0i64;

    let mut frames = Vec::with_capacity(3 * n);
    frames.push((1usize, true, false));
    while let Some((u, keep, finish)) = frames.pop() {
        if !finish {
            frames.push((u, keep, true));
            if heavy[u] != 0 {
                frames.push((heavy[u], true, false));
            }
            for &v in &adj[u] {
                if v != parent[u] && v != heavy[u] {
                    frames.push((v, false, false));
                }
            }
        } else {
            for &v in &adj[u] {
                if v != parent[u] && v != heavy[u] {
                    for t in tin[v]..=tout[v] {
                        let c = col[flat[t]];
                        cnt[c] += 1;
                        if cnt[c] > max_freq {
                            max_freq = cnt[c];
                            sum_max = c as i64;
                        } else if cnt[c] == max_freq {
                            sum_max += c as i64;
                        }
                    }
                }
            }
            let cu = col[u];
            cnt[cu] += 1;
            if cnt[cu] > max_freq {
                max_freq = cnt[cu];
                sum_max = cu as i64;
            } else if cnt[cu] == max_freq {
                sum_max += cu as i64;
            }
            ans[u] = sum_max;

            if !keep {
                for t in tin[u]..=tout[u] {
                    cnt[col[flat[t]]] -= 1;
                }
                max_freq = 0;
                sum_max = 0;
            }
        }
    }

    let out: Vec<String> = (1..=n).map(|i| ans[i].to_string()).collect();
    println!("{}", out.join(" "));
}`,
        java21: `import java.io.IOException;
import java.io.InputStream;
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
        int nextInt() throws IOException {
            int c = readByte();
            while (c >= 0 && c <= ' ') c = readByte();
            if (c == -1) return Integer.MIN_VALUE;
            int res = 0;
            while (c > ' ') { res = res * 10 + (c - '0'); c = readByte(); }
            return res;
        }
    }

    @SuppressWarnings("unchecked")
    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        int n = fs.nextInt();
        if (n == Integer.MIN_VALUE) return;

        int[] col = new int[n + 1];
        for (int i = 1; i <= n; i++) col[i] = fs.nextInt();

        List<Integer>[] adj = new ArrayList[n + 1];
        for (int i = 1; i <= n; i++) adj[i] = new ArrayList<>();
        for (int i = 0; i < n - 1; i++) {
            int u = fs.nextInt(), v = fs.nextInt();
            adj[u].add(v);
            adj[v].add(u);
        }

        int[] parent = new int[n + 1], sz = new int[n + 1], heavy = new int[n + 1];
        int[] tin = new int[n + 1], tout = new int[n + 1], flat = new int[n + 1];
        Arrays.fill(sz, 1);

        int[] stkNode = new int[2 * n];
        boolean[] stkDone = new boolean[2 * n];
        int sp = 0, timer = 0;
        stkNode[sp] = 1; stkDone[sp++] = false;
        while (sp > 0) {
            int u = stkNode[--sp];
            boolean done = stkDone[sp];
            if (!done) {
                tin[u] = ++timer;
                flat[timer] = u;
                stkNode[sp] = u; stkDone[sp++] = true;
                for (int v : adj[u]) {
                    if (v != parent[u]) {
                        parent[v] = u;
                        stkNode[sp] = v; stkDone[sp++] = false;
                    }
                }
            } else {
                tout[u] = timer;
                int best = 0;
                for (int v : adj[u]) {
                    if (v != parent[u]) {
                        sz[u] += sz[v];
                        if (sz[v] > best) { best = sz[v]; heavy[u] = v; }
                    }
                }
            }
        }

        int[] cnt = new int[n + 1];
        long[] ans = new long[n + 1];
        int maxFreq = 0;
        long sumMax = 0;

        int[] fNode = new int[3 * n];
        boolean[] fKeep = new boolean[3 * n];
        boolean[] fFinish = new boolean[3 * n];
        int fp = 0;
        fNode[fp] = 1; fKeep[fp] = true; fFinish[fp++] = false;

        while (fp > 0) {
            int u = fNode[--fp];
            boolean keep = fKeep[fp], finish = fFinish[fp];
            if (!finish) {
                fNode[fp] = u; fKeep[fp] = keep; fFinish[fp++] = true;
                if (heavy[u] != 0) {
                    fNode[fp] = heavy[u]; fKeep[fp] = true; fFinish[fp++] = false;
                }
                for (int v : adj[u]) {
                    if (v != parent[u] && v != heavy[u]) {
                        fNode[fp] = v; fKeep[fp] = false; fFinish[fp++] = false;
                    }
                }
            } else {
                for (int v : adj[u]) {
                    if (v != parent[u] && v != heavy[u]) {
                        for (int t = tin[v]; t <= tout[v]; t++) {
                            int c = col[flat[t]];
                            cnt[c]++;
                            if (cnt[c] > maxFreq) { maxFreq = cnt[c]; sumMax = c; }
                            else if (cnt[c] == maxFreq) sumMax += c;
                        }
                    }
                }
                int cu = col[u];
                cnt[cu]++;
                if (cnt[cu] > maxFreq) { maxFreq = cnt[cu]; sumMax = cu; }
                else if (cnt[cu] == maxFreq) sumMax += cu;
                ans[u] = sumMax;

                if (!keep) {
                    for (int t = tin[u]; t <= tout[u]; t++) cnt[col[flat[t]]]--;
                    maxFreq = 0;
                    sumMax = 0;
                }
            }
        }

        StringBuilder sb = new StringBuilder();
        for (int i = 1; i <= n; i++) {
            if (i > 1) sb.append(' ');
            sb.append(ans[i]);
        }
        sb.append('\\n');
        System.out.print(sb);
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
    col = [0] + [int(next(it)) for _ in range(n)]

    adj = [[] for _ in range(n + 1)]
    for _ in range(n - 1):
        u = int(next(it))
        v = int(next(it))
        adj[u].append(v)
        adj[v].append(u)

    parent = [0] * (n + 1)
    sz = [1] * (n + 1)
    heavy = [0] * (n + 1)
    tin = [0] * (n + 1)
    tout = [0] * (n + 1)
    flat = [0] * (n + 1)

    timer = 0
    stk = [(1, 0)]
    while stk:
        u, st = stk.pop()
        if st == 0:
            timer += 1
            tin[u] = timer
            flat[timer] = u
            stk.append((u, 1))
            p = parent[u]
            for v in adj[u]:
                if v != p:
                    parent[v] = u
                    stk.append((v, 0))
        else:
            tout[u] = timer
            best = 0
            p = parent[u]
            for v in adj[u]:
                if v != p:
                    sz[u] += sz[v]
                    if sz[v] > best:
                        best = sz[v]
                        heavy[u] = v

    cnt = [0] * (n + 1)
    ans = [0] * (n + 1)
    max_freq = 0
    sum_max = 0

    frames = [(1, True, False)]
    while frames:
        u, keep, finish = frames.pop()
        if not finish:
            frames.append((u, keep, True))
            if heavy[u]:
                frames.append((heavy[u], True, False))
            p = parent[u]
            h = heavy[u]
            for v in adj[u]:
                if v != p and v != h:
                    frames.append((v, False, False))
        else:
            p = parent[u]
            h = heavy[u]
            for v in adj[u]:
                if v != p and v != h:
                    for t in range(tin[v], tout[v] + 1):
                        c = col[flat[t]]
                        cnt[c] += 1
                        if cnt[c] > max_freq:
                            max_freq = cnt[c]
                            sum_max = c
                        elif cnt[c] == max_freq:
                            sum_max += c
            cu = col[u]
            cnt[cu] += 1
            if cnt[cu] > max_freq:
                max_freq = cnt[cu]
                sum_max = cu
            elif cnt[cu] == max_freq:
                sum_max += cu
            ans[u] = sum_max

            if not keep:
                for t in range(tin[u], tout[u] + 1):
                    cnt[col[flat[t]]] -= 1
                max_freq = 0
                sum_max = 0

    sys.stdout.write(" ".join(str(ans[i]) for i in range(1, n + 1)) + "\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
idx = 0
n = tokens[idx].to_i; idx += 1
col = [0]
n.times do
  col << tokens[idx].to_i
  idx += 1
end

adj = Array.new(n + 1) { [] }
(n - 1).times do
  u = tokens[idx].to_i; idx += 1
  v = tokens[idx].to_i; idx += 1
  adj[u] << v
  adj[v] << u
end

parent = Array.new(n + 1, 0)
sz = Array.new(n + 1, 1)
heavy = Array.new(n + 1, 0)
tin = Array.new(n + 1, 0)
tout = Array.new(n + 1, 0)
flat = Array.new(n + 1, 0)

timer = 0
stk = [[1, false]]
until stk.empty?
  u, done = stk.pop
  if !done
    timer += 1
    tin[u] = timer
    flat[timer] = u
    stk << [u, true]
    p = parent[u]
    adj[u].each do |v|
      next if v == p
      parent[v] = u
      stk << [v, false]
    end
  else
    tout[u] = timer
    best = 0
    p = parent[u]
    adj[u].each do |v|
      next if v == p
      sz[u] += sz[v]
      if sz[v] > best
        best = sz[v]
        heavy[u] = v
      end
    end
  end
end

cnt = Array.new(n + 1, 0)
ans = Array.new(n + 1, 0)
max_freq = 0
sum_max = 0

frames = [[1, true, false]]
until frames.empty?
  u, keep, finish = frames.pop
  if !finish
    frames << [u, keep, true]
    frames << [heavy[u], true, false] if heavy[u] != 0
    p = parent[u]
    h = heavy[u]
    adj[u].each do |v|
      next if v == p || v == h
      frames << [v, false, false]
    end
  else
    p = parent[u]
    h = heavy[u]
    adj[u].each do |v|
      next if v == p || v == h
      (tin[v]..tout[v]).each do |t|
        c = col[flat[t]]
        cnt[c] += 1
        if cnt[c] > max_freq
          max_freq = cnt[c]
          sum_max = c
        elsif cnt[c] == max_freq
          sum_max += c
        end
      end
    end
    cu = col[u]
    cnt[cu] += 1
    if cnt[cu] > max_freq
      max_freq = cnt[cu]
      sum_max = cu
    elsif cnt[cu] == max_freq
      sum_max += cu
    end
    ans[u] = sum_max

    if !keep
      (tin[u]..tout[u]).each { |t| cnt[col[flat[t]]] -= 1 }
      max_freq = 0
      sum_max = 0
    end
  end
end

puts (1..n).map { |i| ans[i].to_s }.join(" ")`,
      },
    },
    {
      id: 'ch41-p3',
      tier: 'Boss',
      ratingRange: '2150–2350',
      title: 'Tree Requests — Palindrome Check at Depth H in Subtree V (Bitmask Parity + Sack)',
      statement:
        'You are given a rooted tree with N vertices (1 is root, given parent `p[2..N]`), where each vertex has a lowercase letter `a..z`. Answer M offline queries `(v, h)`: take all vertices inside the subtree of `v` whose absolute depth from root `1` equals `h` (root `1` has depth `1`). Can the letters of those vertices be rearranged into a palindrome? Print `Yes` or `No` for each query.',
      constraints: '1 <= N, M <= 5 * 10^5',
      sampleInput: '6 5\n1 1 1 3 3\nzacccd\n1 1\n3 3\n4 1\n6 1\n1 2',
      sampleOutput: 'Yes\nNo\nYes\nYes\nYes',
      hints: [
        'Attach all queries `(h, queryId)` onto vertex `v` in `queriesAt[v]`. Run Arpa’s Sack maintaining a 26-bit integer `depthMask[d]` for every depth `d = 1..N`!',
        'Toggling vertex `x` simply executes `depthMask[depth[x]] ^= (1 << (s[x] - \'a\'))`! At vertex `v` (right before the `keep = false` cleanup), a mask `m = depthMask[h]` forms a palindrome iff `__builtin_popcount(m) <= 1` (`(m & (m - 1)) == 0`)!',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

// CF 570D (Tree Requests): Bitmask Parity + Arpa's Sack in O((N + M) log N)
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, m;
    if (!(cin >> n >> m)) return 0;
    vector<vector<int>> children(n + 1);
    for (int i = 2; i <= n; i++) {
        int p;
        cin >> p;
        children[p].push_back(i);
    }
    string s;
    cin >> s;

    vector<vector<pair<int, int>>> queries(n + 1);
    for (int i = 0; i < m; i++) {
        int v, h;
        cin >> v >> h;
        queries[v].push_back({h, i});
    }

    vector<int> depth(n + 1, 1), sz(n + 1, 1), heavy(n + 1, 0), tin(n + 1), tout(n + 1), flat(n + 1);
    int timer = 0;
    // Iterative Euler tour + heavy child computation (N up to 5e5!)
    vector<pair<int, bool>> stk = {{1, false}};
    stk.reserve(2 * n);
    while (!stk.empty()) {
        auto [u, done] = stk.back();
        stk.pop_back();
        if (!done) {
            tin[u] = ++timer;
            flat[timer] = u;
            stk.push_back({u, true});
            for (int v : children[u]) {
                depth[v] = depth[u] + 1;
                stk.push_back({v, false});
            }
        } else {
            tout[u] = timer;
            int best = 0;
            for (int v : children[u]) {
                sz[u] += sz[v];
                if (sz[v] > best) { best = sz[v]; heavy[u] = v; }
            }
        }
    }

    vector<int> depthMask(n + 2, 0);
    vector<bool> ans(m, false);

    struct Frame { int u; bool keep, finish; };
    vector<Frame> frames;
    frames.reserve(3 * n);
    frames.push_back({1, true, false});

    while (!frames.empty()) {
        Frame f = frames.back();
        frames.pop_back();
        int u = f.u;
        if (!f.finish) {
            frames.push_back({u, f.keep, true});
            if (heavy[u]) frames.push_back({heavy[u], true, false});
            for (int v : children[u]) {
                if (v != heavy[u]) frames.push_back({v, false, false});
            }
        } else {
            for (int v : children[u]) {
                if (v != heavy[u]) {
                    for (int t = tin[v]; t <= tout[v]; t++) {
                        int x = flat[t];
                        depthMask[depth[x]] ^= (1 << (s[x - 1] - 'a'));
                    }
                }
            }
            depthMask[depth[u]] ^= (1 << (s[u - 1] - 'a'));

            for (auto [h, qid] : queries[u]) {
                int mask = (h <= n) ? depthMask[h] : 0;
                ans[qid] = ((mask & (mask - 1)) == 0);
            }

            if (!f.keep) {
                for (int t = tin[u]; t <= tout[u]; t++) {
                    int x = flat[t];
                    depthMask[depth[x]] ^= (1 << (s[x - 1] - 'a'));
                }
            }
        }
    }

    for (int i = 0; i < m; i++) cout << (ans[i] ? "Yes\\n" : "No\\n");
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
    let m: usize = it.next().unwrap().parse().unwrap();

    let mut children = vec![Vec::new(); n + 1];
    for i in 2..=n {
        let p: usize = it.next().unwrap().parse().unwrap();
        children[p].push(i);
    }
    let s = it.next().unwrap().as_bytes();

    let mut queries = vec![Vec::new(); n + 1];
    for qid in 0..m {
        let v: usize = it.next().unwrap().parse().unwrap();
        let h: usize = it.next().unwrap().parse().unwrap();
        queries[v].push((h, qid));
    }

    let mut depth = vec![1usize; n + 1];
    let mut sz = vec![1usize; n + 1];
    let mut heavy = vec![0usize; n + 1];
    let mut tin = vec![0usize; n + 1];
    let mut tout = vec![0usize; n + 1];
    let mut flat = vec![0usize; n + 1];

    let mut stk = Vec::with_capacity(2 * n);
    stk.push((1usize, false));
    let mut timer = 0usize;
    while let Some((u, done)) = stk.pop() {
        if !done {
            timer += 1;
            tin[u] = timer;
            flat[timer] = u;
            stk.push((u, true));
            for &v in &children[u] {
                depth[v] = depth[u] + 1;
                stk.push((v, false));
            }
        } else {
            tout[u] = timer;
            let mut best = 0;
            for &v in &children[u] {
                sz[u] += sz[v];
                if sz[v] > best {
                    best = sz[v];
                    heavy[u] = v;
                }
            }
        }
    }

    let mut depth_mask = vec![0u32; n + 2];
    let mut ans = vec![false; m];
    let mut frames = Vec::with_capacity(3 * n);
    frames.push((1usize, true, false));

    while let Some((u, keep, finish)) = frames.pop() {
        if !finish {
            frames.push((u, keep, true));
            if heavy[u] != 0 {
                frames.push((heavy[u], true, false));
            }
            for &v in &children[u] {
                if v != heavy[u] {
                    frames.push((v, false, false));
                }
            }
        } else {
            for &v in &children[u] {
                if v != heavy[u] {
                    for t in tin[v]..=tout[v] {
                        let x = flat[t];
                        depth_mask[depth[x]] ^= 1u32 << (s[x - 1] - b'a');
                    }
                }
            }
            depth_mask[depth[u]] ^= 1u32 << (s[u - 1] - b'a');

            for &(h, qid) in &queries[u] {
                let mask = if h <= n { depth_mask[h] } else { 0 };
                ans[qid] = (mask & mask.wrapping_sub(1)) == 0;
            }

            if !keep {
                for t in tin[u]..=tout[u] {
                    let x = flat[t];
                    depth_mask[depth[x]] ^= 1u32 << (s[x - 1] - b'a');
                }
            }
        }
    }

    let mut out = String::new();
    for ok in ans {
        out.push_str(if ok { "Yes\\n" } else { "No\\n" });
    }
    print!("{}", out);
}`,
        java21: `import java.io.IOException;
import java.io.InputStream;
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
        int nextInt() throws IOException {
            int c = readByte();
            while (c >= 0 && c <= ' ') c = readByte();
            if (c == -1) return Integer.MIN_VALUE;
            int res = 0;
            while (c > ' ') { res = res * 10 + (c - '0'); c = readByte(); }
            return res;
        }
        String nextWord() throws IOException {
            int c = readByte();
            while (c >= 0 && c <= ' ') c = readByte();
            if (c == -1) return null;
            StringBuilder sb = new StringBuilder();
            while (c > ' ') { sb.append((char) c); c = readByte(); }
            return sb.toString();
        }
    }

    @SuppressWarnings("unchecked")
    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        int n = fs.nextInt();
        if (n == Integer.MIN_VALUE) return;
        int m = fs.nextInt();

        List<Integer>[] children = new ArrayList[n + 1];
        for (int i = 1; i <= n; i++) children[i] = new ArrayList<>();
        for (int i = 2; i <= n; i++) children[fs.nextInt()].add(i);
        char[] s = fs.nextWord().toCharArray();

        List<long[]>[] queries = new ArrayList[n + 1];
        for (int i = 1; i <= n; i++) queries[i] = new ArrayList<>();
        for (int qid = 0; qid < m; qid++) {
            int v = fs.nextInt(), h = fs.nextInt();
            queries[v].add(new long[]{h, qid});
        }

        int[] depth = new int[n + 1], sz = new int[n + 1], heavy = new int[n + 1];
        int[] tin = new int[n + 1], tout = new int[n + 1], flat = new int[n + 1];
        Arrays.fill(sz, 1);
        depth[1] = 1;

        int[] stkNode = new int[2 * n];
        boolean[] stkDone = new boolean[2 * n];
        int sp = 0, timer = 0;
        stkNode[sp] = 1; stkDone[sp++] = false;
        while (sp > 0) {
            int u = stkNode[--sp];
            boolean done = stkDone[sp];
            if (!done) {
                tin[u] = ++timer;
                flat[timer] = u;
                stkNode[sp] = u; stkDone[sp++] = true;
                for (int v : children[u]) {
                    depth[v] = depth[u] + 1;
                    stkNode[sp] = v; stkDone[sp++] = false;
                }
            } else {
                tout[u] = timer;
                int best = 0;
                for (int v : children[u]) {
                    sz[u] += sz[v];
                    if (sz[v] > best) { best = sz[v]; heavy[u] = v; }
                }
            }
        }

        int[] depthMask = new int[n + 2];
        boolean[] ans = new boolean[m];
        int[] fNode = new int[3 * n];
        boolean[] fKeep = new boolean[3 * n];
        boolean[] fFinish = new boolean[3 * n];
        int fp = 0;
        fNode[fp] = 1; fKeep[fp] = true; fFinish[fp++] = false;

        while (fp > 0) {
            int u = fNode[--fp];
            boolean keep = fKeep[fp], finish = fFinish[fp];
            if (!finish) {
                fNode[fp] = u; fKeep[fp] = keep; fFinish[fp++] = true;
                if (heavy[u] != 0) { fNode[fp] = heavy[u]; fKeep[fp] = true; fFinish[fp++] = false; }
                for (int v : children[u]) {
                    if (v != heavy[u]) { fNode[fp] = v; fKeep[fp] = false; fFinish[fp++] = false; }
                }
            } else {
                for (int v : children[u]) {
                    if (v != heavy[u]) {
                        for (int t = tin[v]; t <= tout[v]; t++) {
                            int x = flat[t];
                            depthMask[depth[x]] ^= (1 << (s[x - 1] - 'a'));
                        }
                    }
                }
                depthMask[depth[u]] ^= (1 << (s[u - 1] - 'a'));
                for (long[] qr : queries[u]) {
                    int h = (int) qr[0], qid = (int) qr[1];
                    int mask = (h <= n) ? depthMask[h] : 0;
                    ans[qid] = ((mask & (mask - 1)) == 0);
                }
                if (!keep) {
                    for (int t = tin[u]; t <= tout[u]; t++) {
                        int x = flat[t];
                        depthMask[depth[x]] ^= (1 << (s[x - 1] - 'a'));
                    }
                }
            }
        }

        StringBuilder sb = new StringBuilder();
        for (boolean ok : ans) sb.append(ok ? "Yes\\n" : "No\\n");
        System.out.print(sb);
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
    m = int(next(it))
    children = [[] for _ in range(n + 1)]
    for i in range(2, n + 1):
        p = int(next(it))
        children[p].append(i)
    s = next(it)
    char_bit = [0] + [1 << (ord(ch) - 97) for ch in s]

    queries = [[] for _ in range(n + 1)]
    for qid in range(m):
        v = int(next(it))
        h = int(next(it))
        queries[v].append((h, qid))

    depth = [1] * (n + 1)
    sz = [1] * (n + 1)
    heavy = [0] * (n + 1)
    tin = [0] * (n + 1)
    tout = [0] * (n + 1)
    flat = [0] * (n + 1)

    timer = 0
    stk = [(1, 0)]
    while stk:
        u, st = stk.pop()
        if st == 0:
            timer += 1
            tin[u] = timer
            flat[timer] = u
            stk.append((u, 1))
            for v in children[u]:
                depth[v] = depth[u] + 1
                stk.append((v, 0))
        else:
            tout[u] = timer
            best = 0
            for v in children[u]:
                sz[u] += sz[v]
                if sz[v] > best:
                    best = sz[v]
                    heavy[u] = v

    depth_mask = [0] * (n + 2)
    ans = [False] * m
    frames = [(1, True, False)]
    while frames:
        u, keep, finish = frames.pop()
        if not finish:
            frames.append((u, keep, True))
            if heavy[u]:
                frames.append((heavy[u], True, False))
            h = heavy[u]
            for v in children[u]:
                if v != h:
                    frames.append((v, False, False))
        else:
            h_child = heavy[u]
            for v in children[u]:
                if v != h_child:
                    for t in range(tin[v], tout[v] + 1):
                        x = flat[t]
                        depth_mask[depth[x]] ^= char_bit[x]
            depth_mask[depth[u]] ^= char_bit[u]

            for qh, qid in queries[u]:
                mask = depth_mask[qh] if qh <= n else 0
                ans[qid] = (mask & (mask - 1)) == 0

            if not keep:
                for t in range(tin[u], tout[u] + 1):
                    x = flat[t]
                    depth_mask[depth[x]] ^= char_bit[x]

    sys.stdout.write("\\n".join("Yes" if ok else "No" for ok in ans) + "\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
idx = 0
n = tokens[idx].to_i; idx += 1
m = tokens[idx].to_i; idx += 1
children = Array.new(n + 1) { [] }
(2..n).each do |i|
  p = tokens[idx].to_i; idx += 1
  children[p] << i
end
s = tokens[idx]; idx += 1
char_bit = [0] + s.bytes.map { |b| 1 << (b - 97) }

queries = Array.new(n + 1) { [] }
m.times do |qid|
  v = tokens[idx].to_i; idx += 1
  h = tokens[idx].to_i; idx += 1
  queries[v] << [h, qid]
end

depth = Array.new(n + 1, 1)
sz = Array.new(n + 1, 1)
heavy = Array.new(n + 1, 0)
tin = Array.new(n + 1, 0)
tout = Array.new(n + 1, 0)
flat = Array.new(n + 1, 0)

timer = 0
stk = [[1, false]]
until stk.empty?
  u, done = stk.pop
  if !done
    timer += 1
    tin[u] = timer
    flat[timer] = u
    stk << [u, true]
    children[u].each do |v|
      depth[v] = depth[u] + 1
      stk << [v, false]
    end
  else
    tout[u] = timer
    best = 0
    children[u].each do |v|
      sz[u] += sz[v]
      if sz[v] > best
        best = sz[v]
        heavy[u] = v
      end
    end
  end
end

depth_mask = Array.new(n + 2, 0)
ans = Array.new(m, false)
frames = [[1, true, false]]
until frames.empty?
  u, keep, finish = frames.pop
  if !finish
    frames << [u, keep, true]
    frames << [heavy[u], true, false] if heavy[u] != 0
    h = heavy[u]
    children[u].each { |v| frames << [v, false, false] if v != h }
  else
    h_child = heavy[u]
    children[u].each do |v|
      next if v == h_child
      (tin[v]..tout[v]).each do |t|
        x = flat[t]
        depth_mask[depth[x]] ^= char_bit[x]
      end
    end
    depth_mask[depth[u]] ^= char_bit[u]

    queries[u].each do |qh, qid|
      mask = qh <= n ? depth_mask[qh] : 0
      ans[qid] = (mask & (mask - 1)) == 0
    end

    if !keep
      (tin[u]..tout[u]).each do |t|
        x = flat[t]
        depth_mask[depth[x]] ^= char_bit[x]
      end
    end
  end
end

puts ans.map { |ok| ok ? "Yes" : "No" }.join("\\n")`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'CSES',
      title: 'Distinct Colors',
      difficulty: 'Medium',
      url: 'https://cses.fi/problemset/task/1139',
      patternNote: 'Direct benchmark comparing Small-to-Large set swapping vs Euler Tour + Fenwick/Sack.',
    },
    {
      platform: 'Codeforces',
      title: 'Lomsat Gelral (CF 600E)',
      difficulty: '1900',
      url: 'https://codeforces.com/problemset/problem/600/E',
      patternNote: 'Canonical Arpa’s Sack problem computing dominating subtree frequencies in O(N log N).',
    },
    {
      platform: 'Codeforces',
      title: 'Tree Requests (CF 570D)',
      difficulty: '2200',
      url: 'https://codeforces.com/problemset/problem/570/D',
      patternNote: 'Sack + 26-bit depth parity bitmask for O((N + M) log N) palindrome queries.',
    },
    {
      platform: 'AtCoder',
      title: 'ABC 220 / Tree Subtree Frequency Queries',
      difficulty: '1900',
      url: 'https://atcoder.jp/contests/abc220',
      patternNote: 'Small-to-large map merging across tree edges for pair counting.',
    },
    {
      platform: 'CodeChef',
      title: 'TREECNT2 / Subtree Value Aggregation',
      difficulty: 'Hard',
      url: 'https://www.codechef.com/problems/PRIMEDST',
      patternNote: 'Subtree distance/color aggregation comparing Sack vs Centroid Decomposition.',
    },
    {
      platform: 'NeetCode 150',
      title: 'Number of Good Paths (DSU Small-to-Large)',
      difficulty: 'Hard',
      url: 'https://neetcode.io/problems/count-good-paths',
      patternNote: 'Applies the identical small-to-large frequency map merge across DSU component roots!',
    },
  ],
  interviewNotes: [
    'Prove the `O(N log N)` bound cleanly: whenever two sets/subtrees are merged, we ALWAYS iterate over the smaller set `|B| <= |A|`, so every element inside `B` enters a component of size at least `2|B|`—this doubling can happen at most `log2(N)` times per element.',
    'Explain why **Arpa’s Sack (`keep = true / false`)** dominates `std::map` swapping on strict `5 * 10^5` time limits: Sack uses a single contiguous array `cnt[]` with `O(1)` array indexing instead of `O(log N)` red-black tree allocations, saving both a `log N` factor and massive heap overhead.',
    'Be ready to contrast **DSU on Tree** (offline, `O(N log N)`, subtree-only queries) with **Centroid Decomposition** (handles arbitrary node-to-node path pairs `u -> v`) and **Persistent Segment Tree** (handles online queries).',
  ],
  projectBlueprint: {
    title: 'Real-Time Hierarchical Tag & Category Frequency Aggregator',
    tagline:
      'Analyze nested e-commerce / forum taxonomies in O(N log N): compute distinct tag counts, top dominating category trends, and tag-diversity metrics for every category branch in one pass.',
    stackSummary: 'C++20 Flat Euler-Tour Sack Engine, Dominating-Tag Leaderboard Tracker',
    asciiDiagram: `Taxonomy Tree:
  [Root: Tech] (tag: cloud)
     ├── [Heavy: Backend] (tag: rust) -> {rust: 2, go: 1}  <-- KEPT IN cnt[]!
     │      ├── [Systems] (tag: rust)
     │      └── [APIs]    (tag: go)
     └── [Light: Frontend] (tag: ts)  -> {ts: 1}           <-- Re-walked once!

Sack Result at [Tech]: Distinct=3 | Top Tag="rust" (freq=2) | Total Element Moves=2!`,
    milestones: [
      {
        id: 'm1',
        title: '1. Iterative Euler-Tour & Heavy-Child Profiler',
        detail: 'Flatten arbitrary deep taxonomy trees without recursion stack overflow.',
      },
      {
        id: 'm2',
        title: '2. Zero-Allocation Global Frequency & Top-Tag Tracker',
        detail: 'Maintain live `distinctCount`, `topFreq`, and `topTagSum` across light-child cleanups.',
      },
      {
        id: 'm3',
        title: '3. Subtree Rollup Benchmark Harness',
        detail: 'Compare `O(N log^2 N)` `std::map` swapping against `O(N log N)` flat Sack on `100K`-node trees.',
      },
    ],
    starterCode: `#include <bits/stdc++.h>
using namespace std;

// Real-Time Hierarchical Tag & Category Frequency Aggregator (Arpa's Sack O(N log N))
struct CategoryStats {
    int distinctTags;
    int topTagId;
    int topTagFreq;
};

vector<CategoryStats> aggregateTaxonomy(int n, const vector<int>& tagId, const vector<pair<int, int>>& edges) {
    vector<vector<int>> adj(n + 1);
    for (auto [u, v] : edges) {
        adj[u].push_back(v);
        adj[v].push_back(u);
    }

    int maxTag = *max_element(tagId.begin(), tagId.end());
    vector<int> parent(n + 1, 0), sz(n + 1, 1), heavy(n + 1, 0), tin(n + 1), tout(n + 1), flat(n + 1);
    int timer = 0;
    vector<pair<int, bool>> stk = {{1, false}};
    while (!stk.empty()) {
        auto [u, done] = stk.back();
        stk.pop_back();
        if (!done) {
            tin[u] = ++timer; flat[timer] = u;
            stk.push_back({u, true});
            for (int v : adj[u]) if (v != parent[u]) { parent[v] = u; stk.push_back({v, false}); }
        } else {
            tout[u] = timer;
            int best = 0;
            for (int v : adj[u]) if (v != parent[u]) {
                sz[u] += sz[v];
                if (sz[v] > best) { best = sz[v]; heavy[u] = v; }
            }
        }
    }

    vector<int> cnt(maxTag + 1, 0);
    vector<CategoryStats> stats(n + 1);
    int distinct = 0, topFreq = 0, topTag = 0;

    auto addTag = [&](int t) {
        if (cnt[t]++ == 0) distinct++;
        if (cnt[t] > topFreq) { topFreq = cnt[t]; topTag = t; }
    };

    struct Frame { int u; bool keep, finish; };
    vector<Frame> frames = {{1, true, false}};
    while (!frames.empty()) {
        auto [u, keep, finish] = frames.back();
        frames.pop_back();
        if (!finish) {
            frames.push_back({u, keep, true});
            if (heavy[u]) frames.push_back({heavy[u], true, false});
            for (int v : adj[u]) if (v != parent[u] && v != heavy[u]) frames.push_back({v, false, false});
        } else {
            for (int v : adj[u]) if (v != parent[u] && v != heavy[u]) {
                for (int t = tin[v]; t <= tout[v]; t++) addTag(tagId[flat[t]]);
            }
            addTag(tagId[u]);
            stats[u] = {distinct, topTag, topFreq};
            if (!keep) {
                for (int t = tin[u]; t <= tout[u]; t++) cnt[tagId[flat[t]]]--;
                distinct = 0; topFreq = 0; topTag = 0;
            }
        }
    }
    return stats;
}

int main() {
    // 5 taxonomy categories with tag IDs (1=Rust, 2=Go, 3=TS)
    vector<int> tags = {0, 1, 1, 3, 1, 2};
    auto stats = aggregateTaxonomy(5, tags, {{1, 2}, {1, 3}, {2, 4}, {2, 5}});
    for (int u = 1; u <= 5; u++) {
        cout << "Category " << u << " -> Distinct Tags: " << stats[u].distinctTags
             << ", Dominant Tag: #" << stats[u].topTagId << " (x" << stats[u].topTagFreq << ")\\n";
    }
    return 0;
}`,
  },
};
