export interface StressHarnessFile {
  id: 'gen' | 'brute' | 'sol';
  filename: string;
  title: string;
  subtitle: string;
  compileCmd: string;
  code: string;
}

export interface StressRunnerScript {
  id: 'bash' | 'powershell' | 'python3';
  label: string;
  platform: string;
  filename: string;
  runCmd: string;
  description: string;
  code: string;
}

export interface CompilerFlagPreset {
  id: string;
  mode: string;
  badge: string;
  command: string;
  whenToUse: string;
  flagsExplained: { flag: string; meaning: string }[];
}

export type SnippetCategory =
  | 'pbds'
  | 'hashing'
  | 'modint'
  | 'bitmask'
  | 'fastio';

export interface ContestTemplateSnippet {
  id: string;
  category: SnippetCategory;
  categoryLabel: string;
  title: string;
  complexity: string;
  summary: string;
  pitfallWarning: string;
  code: string;
}

export type JudgeVerdictId =
  | 'wa-early'
  | 'wa-hidden'
  | 'tle'
  | 'mle'
  | 're'
  | 'ile';

export interface VerdictDiagnosticItem {
  id: string;
  rank: number;
  title: string;
  symptom: string;
  buggyPattern: string;
  exactFix: string;
}

export interface VerdictCategory {
  id: JudgeVerdictId;
  shortCode: string;
  label: string;
  badgeColor: 'rose' | 'amber' | 'violet' | 'sky' | 'emerald';
  tagline: string;
  diagnostics: VerdictDiagnosticItem[];
}

// ============================================================================
// TAB 1: AUTOMATED STRESS-TESTING HARNESS DATA
// ============================================================================

export const STRESS_HARNESS_FILES: StressHarnessFile[] = [
  {
    id: 'gen',
    filename: 'gen.cpp',
    title: 'Master Random Test Generator (mt19937_64 + Graph/Tree/String Builders)',
    subtitle:
      'Seeds deterministically from argv[1] so every counterexample seed is 100% reproducible and includes uniform, star, caterpillar, and chain tree generators.',
    compileCmd: 'g++ -O2 -std=c++20 gen.cpp -o gen',
    code: `#include <bits/stdc++.h>
using namespace std;

// Seed via CLI argument argv[1] (NEVER use time(0) alone, which repeats inside the same second!)
mt19937_64 rng;

long long rand_int(long long l, long long r) {
    return uniform_int_distribution<long long>(l, r)(rng);
}

// 1. Random Array of length n with elements in [min_v, max_v]
vector<long long> rand_array(int n, long long min_v, long long max_v, bool distinct = false) {
    vector<long long> a;
    a.reserve(n);
    if (!distinct) {
        for (int i = 0; i < n; ++i) a.push_back(rand_int(min_v, max_v));
    } else {
        unordered_set<long long> used;
        while ((int)a.size() < n) {
            long long v = rand_int(min_v, max_v);
            if (used.insert(v).second) a.push_back(v);
        }
    }
    return a;
}

// 2. Random 1-Indexed Permutation of {1..n}
vector<int> rand_perm(int n) {
    vector<int> p(n);
    iota(p.begin(), p.end(), 1);
    shuffle(p.begin(), p.end(), rng);
    return p;
}

// 3. Random Tree Generator with 4 Topology Modes:
// mode 0 = Uniform Prufer/Parent, mode 1 = Deep Chain, mode 2 = Star Graph, mode 3 = Caterpillar
enum class TreeMode { UNIFORM = 0, CHAIN = 1, STAR = 2, CATERPILLAR = 3 };

vector<pair<int, int>> rand_tree(int n, TreeMode mode = TreeMode::UNIFORM) {
    vector<pair<int, int>> edges;
    edges.reserve(max(0, n - 1));
    for (int i = 2; i <= n; ++i) {
        int parent = 1;
        if (mode == TreeMode::UNIFORM) {
            parent = (int)rand_int(1, i - 1);
        } else if (mode == TreeMode::CHAIN) {
            parent = i - 1;
        } else if (mode == TreeMode::STAR) {
            parent = 1;
        } else if (mode == TreeMode::CATERPILLAR) {
            int spine = max(1, (i - 1) / 2);
            parent = (int)rand_int(1, spine);
        }
        edges.push_back({parent, i});
    }
    // Randomly permute vertex labels and edge order to expose 1-root assumptions
    vector<int> perm = rand_perm(n);
    for (auto& [u, v] : edges) {
        u = perm[u - 1];
        v = perm[v - 1];
        if (rand_int(0, 1)) swap(u, v);
    }
    shuffle(edges.begin(), edges.end(), rng);
    return edges;
}

// 4. Random Connected Simple Undirected Graph (n vertices, m edges, no self-loops or multi-edges)
vector<pair<int, int>> rand_graph(int n, int m) {
    m = max(m, n - 1);
    long long max_edges = 1LL * n * (n - 1) / 2;
    m = (int)min((long long)m, max_edges);

    auto tree_edges = rand_tree(n, TreeMode::UNIFORM);
    set<pair<int, int>> edge_set;
    vector<pair<int, int>> edges;
    for (auto [u, v] : tree_edges) {
        edge_set.insert({min(u, v), max(u, v)});
        edges.push_back({u, v});
    }
    while ((int)edges.size() < m) {
        int u = (int)rand_int(1, n);
        int v = (int)rand_int(1, n);
        if (u == v) continue;
        auto key = make_pair(min(u, v), max(u, v));
        if (edge_set.insert(key).second) {
            edges.push_back({u, v});
        }
    }
    shuffle(edges.begin(), edges.end(), rng);
    return edges;
}

// 5. Random Weighted Directed Acyclic Graph (DAG)
vector<tuple<int, int, long long>> rand_dag(int n, int m, long long min_w, long long max_w) {
    long long max_dag = 1LL * n * (n - 1) / 2;
    m = (int)min((long long)m, max_dag);
    vector<int> topo = rand_perm(n);
    set<pair<int, int>> used;
    vector<tuple<int, int, long long>> edges;
    while ((int)edges.size() < m) {
        int i = (int)rand_int(0, n - 1);
        int j = (int)rand_int(0, n - 1);
        if (i == j) continue;
        if (i > j) swap(i, j);
        int u = topo[i], v = topo[j];
        if (used.insert({u, v}).second) {
            edges.emplace_back(u, v, rand_int(min_w, max_w));
        }
    }
    return edges;
}

// 6. Random String over Custom Alphabet
string rand_string(int len, const string& alphabet = "abc") {
    string s(len, ' ');
    for (int i = 0; i < len; ++i) {
        s[i] = alphabet[(size_t)rand_int(0, (int)alphabet.size() - 1)];
    }
    return s;
}

int main(int argc, char* argv[]) {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    unsigned long long seed = (argc >= 2) ? stoull(argv[1]) : 1337ULL;
    rng.seed(seed);

    // Keep N small (e.g., N in [2..8]) so counterexamples are easy to hand-trace!
    int n = (int)rand_int(2, 8);
    int q = (int)rand_int(1, 8);
    cout << n << " " << q << "\\n";

    auto a = rand_array(n, -10, 10);
    for (int i = 0; i < n; ++i) {
        cout << a[i] << (i + 1 == n ? "\\n" : " ");
    }

    // Example: generate q random range queries [l, r]
    for (int i = 0; i < q; ++i) {
        int l = (int)rand_int(1, n);
        int r = (int)rand_int(1, n);
        if (l > r) swap(l, r);
        cout << l << " " << r << "\\n";
    }

    // Uncomment below to emit a random tree of shape mode = seed % 4:
    // auto tree = rand_tree(n, static_cast<TreeMode>(seed % 4));
    // for (auto [u, v] : tree) cout << u << " " << v << "\\n";

    return 0;
}`,
  },
  {
    id: 'brute',
    filename: 'brute.cpp',
    title: 'Guaranteed-Correct Brute Force Oracle (O(N²) / O(2^N))',
    subtitle:
      'Prioritize 100% mathematical simplicity over speed. Use 64-bit integers and direct loops with zero complex data structures.',
    compileCmd: 'g++ -O2 -std=c++20 brute.cpp -o brute',
    code: `#include <bits/stdc++.h>
using namespace std;

// Guaranteed-correct O(N * Q) or O(2^N) naive reference oracle.
// Rule: Never copy-paste helper functions from sol.cpp into brute.cpp!
void solve() {
    int n, q;
    if (!(cin >> n >> q)) return;
    vector<long long> a(n + 1);
    for (int i = 1; i <= n; ++i) cin >> a[i];

    for (int qi = 0; qi < q; ++qi) {
        int l, r;
        cin >> l >> r;
        long long best = (1LL << 60);
        long long cur_sum = 0;
        for (int i = l; i <= r; ++i) {
            cur_sum += a[i];
            best = min(best, a[i]);
        }
        cout << cur_sum << " " << best << "\\n";
    }
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    solve();
    return 0;
}`,
  },
  {
    id: 'sol',
    filename: 'sol.cpp',
    title: 'Candidate O(N log N) Contest Solution Under Test',
    subtitle:
      'Compile with AddressSanitizer + UndefinedBehaviorSanitizer during stress testing to catch out-of-bounds and signed overflows simultaneously.',
    compileCmd:
      'g++ -O2 -std=c++20 -Wall -Wextra -fsanitize=address,undefined sol.cpp -o sol',
    code: `#include <bits/stdc++.h>
using namespace std;

struct SegTree {
    int n;
    vector<long long> sum_t, min_t;

    explicit SegTree(const vector<long long>& a) {
        n = (int)a.size() - 1;
        sum_t.assign(4 * n + 4, 0);
        min_t.assign(4 * n + 4, (1LL << 60));
        build(1, 1, n, a);
    }

    void build(int p, int l, int r, const vector<long long>& a) {
        if (l == r) {
            sum_t[p] = a[l];
            min_t[p] = a[l];
            return;
        }
        int mid = (l + r) >> 1;
        build(p << 1, l, mid, a);
        build(p << 1 | 1, mid + 1, r, a);
        sum_t[p] = sum_t[p << 1] + sum_t[p << 1 | 1];
        min_t[p] = min(min_t[p << 1], min_t[p << 1 | 1]);
    }

    pair<long long, long long> query(int p, int l, int r, int ql, int qr) const {
        if (ql <= l && r <= qr) return {sum_t[p], min_t[p]};
        int mid = (l + r) >> 1;
        long long s = 0, m = (1LL << 60);
        if (ql <= mid) {
            auto [ls, lm] = query(p << 1, l, mid, ql, qr);
            s += ls;
            m = min(m, lm);
        }
        if (qr > mid) {
            auto [rs, rm] = query(p << 1 | 1, mid + 1, r, ql, qr);
            s += rs;
            m = min(m, rm);
        }
        return {s, m};
    }
};

void solve() {
    int n, q;
    if (!(cin >> n >> q)) return;
    vector<long long> a(n + 1);
    for (int i = 1; i <= n; ++i) cin >> a[i];

    SegTree st(a);
    for (int qi = 0; qi < q; ++qi) {
        int l, r;
        cin >> l >> r;
        auto [s, m] = st.query(1, 1, n, l, r);
        cout << s << " " << m << "\\n";
    }
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    solve();
    return 0;
}`,
  },
];

export const STRESS_RUNNER_SCRIPTS: StressRunnerScript[] = [
  {
    id: 'bash',
    label: 'Bash (Linux / macOS / WSL)',
    platform: 'POSIX Shell · diff -w whitespace-insensitive loop',
    filename: 'stress.sh',
    runCmd: 'chmod +x stress.sh && ./stress.sh',
    description:
      'Compiles gen, brute, and sol (with ASan/UBSan enabled on sol) and executes up to 10,000 seeds, halting immediately on the first counterexample.',
    code: `#!/usr/bin/env bash
set -e

echo "[1/3] Compiling gen.cpp, brute.cpp, and sol.cpp (with ASan/UBSan)..."
g++ -O2 -std=c++20 gen.cpp -o gen
g++ -O2 -std=c++20 brute.cpp -o brute
g++ -O2 -std=c++20 -Wall -Wextra -fsanitize=address,undefined sol.cpp -o sol

echo "[2/3] Running automated stress loop..."
for ((seed = 1; seed <= 10000; ++seed)); do
    ./gen "$seed" > input.txt
    ./brute < input.txt > out_brute.txt
    ./sol < input.txt > out_sol.txt

    if ! diff -w -q out_brute.txt out_sol.txt > /dev/null; then
        echo ""
        echo "====================================================="
        echo " COUNTEREXAMPLE FOUND ON SEED #$seed"
        echo "====================================================="
        echo "--- FAILING INPUT (input.txt) ---"
        cat input.txt
        echo "--- EXPECTED OUTPUT (brute) ---"
        cat out_brute.txt
        echo "--- ACTUAL OUTPUT (sol) ---"
        cat out_sol.txt
        exit 1
    fi

    if ((seed % 100 == 0)); then
        echo "Passed $seed / 10000 random test cases..."
    fi
done

echo "[3/3] All 10,000 tests passed with zero discrepancies!"`,
  },
  {
    id: 'powershell',
    label: 'PowerShell (Windows Native)',
    platform: 'Windows PowerShell 5.1 / 7+ · Compare-Object token diff',
    filename: 'stress.ps1',
    runCmd: 'powershell -ExecutionPolicy Bypass -File .\\stress.ps1',
    description:
      'Native Windows PowerShell stress loop normalizing whitespace tokens and halting immediately when brute.exe and sol.exe diverge.',
    code: `$ErrorActionPreference = "Stop"

Write-Host "[1/3] Compiling gen.cpp, brute.cpp, and sol.cpp..." -ForegroundColor Cyan
g++ -O2 -std=c++20 gen.cpp -o gen.exe
g++ -O2 -std=c++20 brute.cpp -o brute.exe
g++ -O2 -std=c++20 -Wall -Wextra sol.cpp -o sol.exe

Write-Host "[2/3] Starting PowerShell Stress Loop..." -ForegroundColor Cyan
for ($seed = 1; $seed -le 10000; $seed++) {
    .\\gen.exe $seed | Out-File -FilePath input.txt -Encoding ascii
    Get-Content input.txt | .\\brute.exe | Out-File -FilePath out_brute.txt -Encoding ascii
    if ($LASTEXITCODE -ne 0) { throw "brute.exe crashed on seed $seed" }

    Get-Content input.txt | .\\sol.exe | Out-File -FilePath out_sol.txt -Encoding ascii
    if ($LASTEXITCODE -ne 0) {
        Write-Host "RUNTIME ERROR in sol.exe on Seed #$seed" -ForegroundColor Red
        Get-Content input.txt
        exit 1
    }

    $expected = (Get-Content out_brute.txt -Raw).Trim() -replace '\\s+', ' '
    $actual   = (Get-Content out_sol.txt -Raw).Trim() -replace '\\s+', ' '

    if ($expected -ne $actual) {
        Write-Host "=====================================================" -ForegroundColor Red
        Write-Host " COUNTEREXAMPLE FOUND ON SEED #$seed" -ForegroundColor Red
        Write-Host "=====================================================" -ForegroundColor Red
        Write-Host "--- FAILING INPUT (input.txt) ---" -ForegroundColor Yellow
        Get-Content input.txt
        Write-Host "--- EXPECTED OUTPUT (brute) ---" -ForegroundColor Green
        Get-Content out_brute.txt
        Write-Host "--- ACTUAL OUTPUT (sol) ---" -ForegroundColor Red
        Get-Content out_sol.txt
        exit 1
    }

    if ($seed % 100 -eq 0) {
        Write-Host "Passed $seed / 10000 tests..." -ForegroundColor DarkGray
    }
}
Write-Host "[3/3] All 10,000 tests passed!" -ForegroundColor Green`,
  },
  {
    id: 'python3',
    label: 'Python 3 (Universal + Custom Checker)',
    platform: 'Cross-Platform Python 3.10+ · Supports Constructive Multi-Answer Checkers',
    filename: 'stress.py',
    runCmd: 'python3 stress.py',
    description:
      'Universal subprocess harness that measures execution time per test and includes a pluggable custom_checker(inp, brute_out, sol_out) function for constructive problems with multiple valid outputs.',
    code: `import subprocess
import sys
import time

def compile_all() -> None:
    print("[1/3] Compiling C++20 sources...")
    cmds = [
        ["g++", "-O2", "-std=c++20", "gen.cpp", "-o", "gen"],
        ["g++", "-O2", "-std=c++20", "brute.cpp", "-o", "brute"],
        ["g++", "-O2", "-std=c++20", "-Wall", "-Wextra", "sol.cpp", "-o", "sol"],
    ]
    for cmd in cmds:
        subprocess.run(cmd, check=True)

def custom_checker(inp: str, expected_out: str, actual_out: str) -> tuple[bool, str]:
    """
    Default token-by-token comparator.
    For constructive problems with multiple valid answers, parse inp and actual_out
    here and verify that actual_out satisfies all problem invariants and achieves
    the same optimal objective value as expected_out.
    """
    exp_tokens = expected_out.split()
    act_tokens = actual_out.split()
    if exp_tokens != act_tokens:
        return False, f"Token mismatch: expected {exp_tokens[:10]}, got {act_tokens[:10]}"
    return True, "OK"

def main() -> None:
    compile_all()
    max_time_ms = 0.0

    print("[2/3] Running stress loop (up to 10,000 seeds)...")
    for seed in range(1, 10001):
        inp = subprocess.check_output(["./gen", str(seed)], text=True)

        brute_res = subprocess.run(
            ["./brute"], input=inp, text=True, capture_output=True, check=True
        )

        t0 = time.perf_counter()
        sol_res = subprocess.run(
            ["./sol"], input=inp, text=True, capture_output=True
        )
        elapsed_ms = (time.perf_counter() - t0) * 1000.0
        max_time_ms = max(max_time_ms, elapsed_ms)

        if sol_res.returncode != 0:
            print(f"\\n[RE] Runtime Error (exit code {sol_res.returncode}) on Seed #{seed}!")
            print("--- INPUT ---\\n" + inp)
            print("--- STDERR ---\\n" + sol_res.stderr)
            sys.exit(1)

        ok, reason = custom_checker(inp, brute_res.stdout, sol_res.stdout)
        if not ok:
            with open("input.txt", "w", encoding="utf-8") as f:
                f.write(inp)
            print("=" * 60)
            print(f" COUNTEREXAMPLE FOUND ON SEED #{seed} ({reason})")
            print("=" * 60)
            print("--- FAILING INPUT (saved to input.txt) ---\\n" + inp.strip())
            print("--- EXPECTED (brute) ---\\n" + brute_res.stdout.strip())
            print("--- ACTUAL (sol) ---\\n" + sol_res.stdout.strip())
            sys.exit(1)

        if seed % 100 == 0:
            print(f"Passed {seed} tests (max sol time: {max_time_ms:.2f} ms)")

    print("[3/3] All 10,000 tests passed!")

if __name__ == "__main__":
    main()`,
  },
];

export const COMPILER_FLAG_PRESETS: CompilerFlagPreset[] = [
  {
    id: 'debug-sanitized',
    mode: 'Debug & Sanitizer Mode (Catch UB, Out-of-Bounds & Overflow)',
    badge: 'RECOMMENDED FOR DEBUGGING',
    command:
      'g++ -std=c++20 -O1 -g -DLOCAL -Wall -Wextra -Wshadow -Wconversion -fsanitize=address,undefined -D_GLIBCXX_DEBUG sol.cpp -o sol_debug',
    whenToUse:
      'Use whenever your code gets WA, RE, or mysterious differences between local and Codeforces custom invocation.',
    flagsExplained: [
      {
        flag: '-fsanitize=address,undefined',
        meaning:
          'Aborts with an exact line number stack trace on heap/stack out-of-bounds, use-after-free, signed integer overflow, and shift-by-32 UB.',
      },
      {
        flag: '-D_GLIBCXX_DEBUG',
        meaning:
          'Enables bounds checking on std::vector::operator[], iterator invalidation checks, and unsorted binary_search assertions.',
      },
      {
        flag: '-Wshadow -Wconversion',
        meaning:
          'Warns when a local variable shadows an outer loop variable or when a 64-bit long long silently truncates into a 32-bit int.',
      },
    ],
  },
  {
    id: 'release-benchmark',
    mode: 'Contest Release & Timing Benchmark Mode',
    badge: 'MAX THROUGHPUT (10⁸ OPS/SEC)',
    command: 'g++ -std=c++20 -O2 -Wall -Wextra -march=native sol.cpp -o sol_fast',
    whenToUse:
      'Use when measuring real wall-clock runtime against a max-constraint N = 2e5 test file generated by gen.cpp (sanitizers slow execution by 3x–10x).',
    flagsExplained: [
      {
        flag: '-O2',
        meaning:
          'Matches the exact optimization level used on Codeforces, AtCoder, CSES, and ICPC DOMjudge servers.',
      },
      {
        flag: '-std=c++20',
        meaning:
          'Enables <bit> (std::popcount, std::bit_width), ranges, constexpr algorithms, and template lambda syntax.',
      },
      {
        flag: '-march=native',
        meaning:
          'Enables local AVX2/BMI2 hardware instructions for bitsets and tight inner loops.',
      },
    ],
  },
];

// ============================================================================
// TAB 2: BATTLE-TESTED C++20 CONTEST TEMPLATES & SPEED SNIPPETS
// ============================================================================

export const CONTEST_TEMPLATES: ContestTemplateSnippet[] = [
  {
    id: 'pbds-ordered-set',
    category: 'pbds',
    categoryLabel: 'GNU PBDS Trees',
    title: 'GNU PBDS ordered_set & Duplicate-Safe ordered_multiset',
    complexity: 'O(log N) order_of_key & find_by_order',
    summary:
      'Provides Red-Black Tree order statistics in C++ STL: find_by_order(k) returns an iterator to the 0-indexed k-th smallest element, and order_of_key(x) returns the count of elements strictly less than x.',
    pitfallWarning:
      'NEVER use less_equal<T> for multisets—it breaks lower_bound() and makes tree.erase(x) silently fail! Always use pair<T, int> with a unique monotonic timestamp ID.',
    code: `#include <bits/stdc++.h>
#include <ext/pb_ds/assoc_container.hpp>
#include <ext/pb_ds/tree_policy.hpp>
using namespace std;
using namespace __gnu_pbds;

// 1. Standard duplicate-free Ordered Set
template <typename T>
using ordered_set = tree<
    T,
    null_type,
    less<T>,
    rb_tree_tag,
    tree_order_statistics_node_update>;

// 2. Duplicate-safe Ordered Multiset using (value, unique_id) pairs
template <typename T>
struct OrderedMultiset {
    ordered_set<pair<T, int>> t;
    int uid = 0;

    void insert(T x) {
        t.insert({x, ++uid});
    }

    // Erases exactly ONE occurrence of x if present
    bool erase_one(T x) {
        auto it = t.lower_bound({x, -1});
        if (it != t.end() && it->first == x) {
            t.erase(it);
            return true;
        }
        return false;
    }

    // Number of elements strictly less than x
    int count_strictly_less(T x) const {
        return (int)t.order_of_key({x, -1});
    }

    // Number of elements less than or equal to x
    int count_less_equal(T x) const {
        return (int)t.order_of_key({x, INT_MAX});
    }

    // 0-indexed k-th smallest element (0 <= k < size())
    T kth(int k) const {
        return t.find_by_order(k)->first;
    }

    int size() const { return (int)t.size(); }
};`,
  },
  {
    id: 'anti-hack-hash',
    category: 'hashing',
    categoryLabel: 'Anti-Hack Hash Table',
    title: 'SplitMix64 Anti-Hack Custom Hash + GNU gp_hash_table',
    complexity: 'O(1) Expected (Immune to Codeforces Anti-Hash Tests)',
    summary:
      'Standard std::unordered_map uses a fixed identity/prime hash that open-hacking phases easily force into O(N²) collisions. Mixing steady_clock nanoseconds through Sebastiano Vigna’s SplitMix64 makes hash buckets unpredictable across runs while gp_hash_table runs 3x–4x faster than unordered_map.',
    pitfallWarning:
      'Declare gp_hash_table<long long, int, CustomHash> with the explicit CustomHash template parameter; default gp_hash_table without CustomHash is vulnerable to power-of-two mask collisions.',
    code: `#include <bits/stdc++.h>
#include <ext/pb_ds/assoc_container.hpp>
using namespace std;
using namespace __gnu_pbds;

struct CustomHash {
    static uint64_t splitmix64(uint64_t x) {
        // http://xorshift.di.unimi.it/splitmix64.c
        x += 0x9e3779b97f4a7c15ULL;
        x = (x ^ (x >> 30)) * 0xbf58476d1ce4e5b9ULL;
        x = (x ^ (x >> 27)) * 0x94d049bb133111ebULL;
        return x ^ (x >> 31);
    }

    size_t operator()(uint64_t x) const {
        static const uint64_t FIXED_RANDOM =
            chrono::steady_clock::now().time_since_epoch().count();
        return (size_t)splitmix64(x + FIXED_RANDOM);
    }

    // Pair hash overload for coordinate/edge keys
    template <typename A, typename B>
    size_t operator()(const pair<A, B>& p) const {
        uint64_t h1 = (*this)((uint64_t)p.first);
        uint64_t h2 = (*this)((uint64_t)p.second);
        return (size_t)(h1 ^ (h2 + 0x9e3779b97f4a7c15ULL + (h1 << 6) + (h1 >> 2)));
    }
};

// High-speed probing hash table (3x faster than std::unordered_map)
template <typename K, typename V>
using fast_map = gp_hash_table<K, V, CustomHash>;

template <typename K>
using fast_set = gp_hash_table<K, null_type, CustomHash>;`,
  },
  {
    id: 'modint-struct',
    category: 'modint',
    categoryLabel: 'Modular Arithmetic',
    title: 'Zero-Overhead ModInt<MOD> + O(N) Combinatorics Table',
    complexity: 'O(1) Arithmetic · O(log MOD) Inverse · O(1) nCr',
    summary:
      'Eliminates missing-modulo bugs and negative-remainder traps across DP, combinatorics, and polynomial problems. Supports +, -, *, /, pow(), inv(), and stream I/O.',
    pitfallWarning:
      'Division a / b uses Fermat’s Little Theorem a * b^(MOD-2) and requires MOD to be prime (e.g. 998244353 or 1000000007).',
    code: `#include <bits/stdc++.h>
using namespace std;

template <int MOD>
struct ModInt {
    int v;
    constexpr ModInt() : v(0) {}
    constexpr ModInt(long long x) : v((int)(x % MOD)) {
        if (v < 0) v += MOD;
    }

    constexpr ModInt& operator+=(const ModInt& o) {
        v += o.v;
        if (v >= MOD) v -= MOD;
        return *this;
    }
    constexpr ModInt& operator-=(const ModInt& o) {
        v -= o.v;
        if (v < 0) v += MOD;
        return *this;
    }
    constexpr ModInt& operator*=(const ModInt& o) {
        v = (int)((1LL * v * o.v) % MOD);
        return *this;
    }
    constexpr ModInt pow(long long p) const {
        ModInt a = *this, res = 1;
        while (p > 0) {
            if (p & 1) res *= a;
            a *= a;
            p >>= 1;
        }
        return res;
    }
    constexpr ModInt inv() const { return pow(MOD - 2); }
    constexpr ModInt& operator/=(const ModInt& o) { return *this *= o.inv(); }

    friend constexpr ModInt operator+(ModInt a, const ModInt& b) { return a += b; }
    friend constexpr ModInt operator-(ModInt a, const ModInt& b) { return a -= b; }
    friend constexpr ModInt operator*(ModInt a, const ModInt& b) { return a *= b; }
    friend constexpr ModInt operator/(ModInt a, const ModInt& b) { return a /= b; }
    friend constexpr bool operator==(const ModInt& a, const ModInt& b) { return a.v == b.v; }
    friend constexpr bool operator!=(const ModInt& a, const ModInt& b) { return a.v != b.v; }
    friend istream& operator>>(istream& is, ModInt& m) {
        long long x; is >> x; m = ModInt(x); return is;
    }
    friend ostream& operator<<(ostream& os, const ModInt& m) { return os << m.v; }
};

using mint998 = ModInt<998244353>;
using mint107 = ModInt<1000000007>;

// O(N) Precomputed Factorials & Inverse Factorials
template <typename Mint>
struct Comb {
    int n;
    vector<Mint> fact, inv_fact;

    explicit Comb(int max_n) : n(max_n), fact(max_n + 1), inv_fact(max_n + 1) {
        fact[0] = 1;
        for (int i = 1; i <= n; ++i) fact[i] = fact[i - 1] * i;
        inv_fact[n] = fact[n].inv();
        for (int i = n - 1; i >= 0; --i) inv_fact[i] = inv_fact[i + 1] * (i + 1);
    }

    Mint nCr(int N, int R) const {
        if (R < 0 || R > N) return 0;
        return fact[N] * inv_fact[R] * inv_fact[N - R];
    }
};`,
  },
  {
    id: 'cpp20-bit-arsenal',
    category: 'bitmask',
    categoryLabel: 'C++20 Bit & Submask Arsenal',
    title: 'C++20 <bit> Intrinsics, O(3^N) Submask Iteration & Gosper’s Hack',
    complexity: 'O(1) Hardware Bit Ops · O(3^N) Submask Enumeration',
    summary:
      'Leverages standard C++20 <bit> functions (replacing non-portable __builtin_* where desired), enumerates all submasks of all masks in O(3^N), and visits all k-bit masks of an n-bit universe via Gosper’s Hack.',
    pitfallWarning:
      'Always use 1ULL << k instead of 1 << k whenever k >= 31! Shifting a 32-bit signed int by >= 31 bits is Undefined Behavior in C++.',
    code: `#include <bits/stdc++.h>
#include <bit>
using namespace std;

// 1. C++20 <bit> Hardware Intrinsics (Require unsigned types: uint32_t / uint64_t)
void bit_intrinsics_demo(uint64_t mask) {
    int ones      = std::popcount(mask);      // __builtin_popcountll(mask)
    int lead_zero = std::countl_zero(mask);   // 64 if mask == 0
    int trail_z   = std::countr_zero(mask);   // index of lowest set bit (0-indexed)
    int width     = std::bit_width(mask);     // 1 + floor(log2(mask)), 0 if mask == 0
    bool is_pow2  = std::has_single_bit(mask);
    uint64_t lsb  = mask & (~mask + 1);       // isolate lowest set bit
    (void)ones; (void)lead_zero; (void)trail_z; (void)width; (void)is_pow2; (void)lsb;
}

// 2. Iterate over all non-empty submasks s of mask m (Total across all m in [0..2^N): O(3^N))
void enumerate_all_submasks(int n) {
    for (int m = 0; m < (1 << n); ++m) {
        for (int s = m; s > 0; s = (s - 1) & m) {
            int complement = m ^ s;
            (void)complement;
        }
    }
}

// 3. Gosper's Hack: Iterate over all N-bit masks having EXACTLY K bits set in O(C(N, K))
void gospers_hack(int n, int k) {
    if (k <= 0 || k > n) return;
    uint64_t mask = (1ULL << k) - 1;
    uint64_t limit = (1ULL << n);
    while (mask < limit) {
        // Process mask with popcount == k
        uint64_t c = mask & (~mask + 1);
        uint64_t r = mask + c;
        mask = (((r ^ mask) >> 2) / c) | r;
    }
}`,
  },
  {
    id: 'fast-io-interactive-multi',
    category: 'fastio',
    categoryLabel: 'Fast I/O & Interactive',
    title: 'Fast I/O, Interactive Flush Protocol & 5-Language Speed Headers',
    complexity: 'O(1) Per-Token Buffered I/O',
    summary:
      'Complete copy-ready high-throughput I/O and interactive query/flush harness for C++20, Python 3, Java 21, and Rust so your solution never gets TLE on 10^6 tokens or ILE on interactive problems.',
    pitfallWarning:
      'In normal batch problems, never use std::endl (it forces an OS write syscall on every line). In interactive problems, ALWAYS flush after every query and exit(0) immediately if the judge returns -1!',
    code: `// ============================================================================
// 1. C++20 FAST I/O + INTERACTIVE QUERY HELPER
// ============================================================================
#include <bits/stdc++.h>
using namespace std;

long long ask_query(int u, int v) {
    cout << "? " << u << " " << v << endl; // endl automatically flushes
    long long resp;
    if (!(cin >> resp) || resp == -1) exit(0); // Mandatory: terminate on -1 to avoid ILE!
    return resp;
}

void answer_final(long long ans) {
    cout << "! " << ans << endl;
}

// ============================================================================
// 2. PYTHON 3 / PYPY3 FAST BUFFERED I/O + DEEP RECURSION BOOTSTRAP
// ============================================================================
/*
import sys
sys.setrecursionlimit(300000)

def main():
    tokens = sys.stdin.buffer.read().split()
    it = iter(tokens)
    n = int(next(it))
    out = []
    # Append string results to out and print once:
    sys.stdout.write("\\n".join(out) + "\\n")
*/

// ============================================================================
// 3. RUST BUFFERED STDIN + BUFWRITER STDOUT
// ============================================================================
/*
use std::io::{self, BufWriter, Read, Write};

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let out = io::stdout();
    let mut writer = BufWriter::new(out.lock());
    // writeln!(writer, "{}", ans).unwrap();
}
*/`,
  },
];

// ============================================================================
// TAB 3: INTERACTIVE VERDICT DEBUGGER (WA / TLE / MLE / RE / ILE)
// ============================================================================

export const VERDICT_CATEGORIES: VerdictCategory[] = [
  {
    id: 'wa-early',
    shortCode: 'WA (Test 1–2)',
    label: 'Wrong Answer on Test 1–2 (Early Failure)',
    badgeColor: 'rose',
    tagline:
      'Failing sample or Test 2 means a structural bug in input parsing, multi-testcase reset, 0/1-based indexing, or degenerate N = 1 boundary handling.',
    diagnostics: [
      {
        id: 'wa-early-1',
        rank: 1,
        title: 'Multi-Testcase Global State Leak',
        symptom:
          'Single test case passes locally, but multi-test input (t = 1..T) fails on the 2nd or 3rd sub-case inside Test 1 or Test 2.',
        buggyPattern:
          'Clearing adj/vis or priority_queue only partially, or breaking out of the read loop early (if (bad) return;) before consuming the remaining input integers of the current test case!',
        exactFix:
          'Always read ALL input tokens of the current test case before returning early, and reset every vertex 1..n (for (int i = 0; i <= n; ++i) adj[i].clear();).',
      },
      {
        id: 'wa-early-2',
        rank: 2,
        title: '0-Based vs. 1-Based Indexing Mismatch',
        symptom:
          'Off-by-one answers on sample trees/arrays or vertex n silently ignored.',
        buggyPattern:
          'Reading 1-indexed vertices u, v in [1..N] into a 0-indexed algorithm without --u, --v, or running loop for (int i = 0; i < n; ++i) on a 1-indexed Fenwick Tree.',
        exactFix:
          'Standardize on 1-based indexing for Fenwick Trees and graph vertices [1..n], or explicitly decrement --u, --v at the exact line of cin >> u >> v.',
      },
      {
        id: 'wa-early-3',
        rank: 3,
        title: 'Degenerate Boundary Cases (N = 1, K = 0, Empty Range)',
        symptom:
          'Passes sample (where N = 5) but fails immediately on Test 2 (where N = 1 or K = 0).',
        buggyPattern:
          'Assuming a tree with N = 1 has at least one edge (degree[1] >= 1), or accessing a[1] when N = 1 in a 0-indexed vector.',
        exactFix:
          'Test N = 1, N = 2, K = 0, and all-equal elements manually before submitting. Remember a 1-vertex tree has 0 edges and its single node has degree 0 (not 1!).',
      },
      {
        id: 'wa-early-4',
        rank: 4,
        title: 'Wrong Greedy Tie-Breaking or Unsorted Input Assumption',
        symptom:
          'Sample happens to be sorted in ascending order and passes, but Test 2 gives unsorted input and fails.',
        buggyPattern:
          'Forgetting sort(a.begin(), a.end()) before Two Pointers / Binary Search, or greedy tie-breaking on equal primary keys.',
        exactFix:
          'Explicitly sort input arrays or intervals before running two pointers, and verify tie-breaking order on equal endpoints (e.g., process interval opens before closes at the same coordinate).',
      },
      {
        id: 'wa-early-5',
        rank: 5,
        title: 'Unweighted vs. Weighted / Directed vs. Undirected Misread',
        symptom:
          'Output differs on small graphs in Test 2.',
        buggyPattern:
          'Adding only adj[u].push_back(v) for an undirected road network, or outputting the minimum cost without printing the reconstructed path.',
        exactFix:
          'Re-read the Input and Output sections word-for-word: check directed vs. undirected, 1-indexed vs. 0-indexed output, and "YES/NO" vs. "-1" for impossible cases.',
      },
    ],
  },
  {
    id: 'wa-hidden',
    shortCode: 'WA (Test 10+)',
    label: 'Wrong Answer on Hidden Tests (Test 10+)',
    badgeColor: 'amber',
    tagline:
      'Passing the first 10 tests proves your core logic works on small numbers; late WA almost always comes from 32-bit overflow, negative modulo, or graph multi-edges/disconnected components.',
    diagnostics: [
      {
        id: 'wa-hidden-1',
        rank: 1,
        title: '32-Bit Signed Integer Overflow Before 64-Bit Assignment',
        symptom:
          'Passes all small tests, fails on the first large-constraint test (Test 12+) with negative or wrapped answers.',
        buggyPattern:
          'long long area = w * h; (where w, h are int <= 10^9), accumulate(a.begin(), a.end(), 0) (0 is 32-bit int!), or (1 << k) for k >= 31.',
        exactFix:
          'Use 1LL * w * h, accumulate(a.begin(), a.end(), 0LL), and (1ULL << k). In Dijkstra/DP, set INF = (1LL << 60), never 1e9 (which is smaller than N * max_w = 2e14!).',
      },
      {
        id: 'wa-hidden-2',
        rank: 2,
        title: 'Negative Remainder in C++ Modulo Operator (%)',
        symptom:
          'Modular subtraction (a - b) % MOD produces negative outputs or out-of-bounds array indices on large tests.',
        buggyPattern:
          'long long ans = (pref[r] - pref[l - 1]) % MOD; // negative whenever pref[r] < pref[l - 1] mod P!',
        exactFix:
          'Always normalize after subtraction: long long ans = ((pref[r] - pref[l - 1]) % MOD + MOD) % MOD; or use ModInt<MOD>.',
      },
      {
        id: 'wa-hidden-3',
        rank: 3,
        title: 'Disconnected Graph, Self-Loops, or Parallel Multi-Edges',
        symptom:
          'Graph algorithm passes connected simple trees/graphs, fails on Test 25.',
        buggyPattern:
          'Running DFS/BFS/Tarjan from vertex 1 only (missing components 2..N), or adjacency matrix g[u][v] = w overwriting a cheaper parallel edge with a heavier one.',
        exactFix:
          'Loop for (int i = 1; i <= n; ++i) if (!vis[i]) dfs(i); and when storing edges in a matrix, use g[u][v] = min(g[u][v], w).',
      },
      {
        id: 'wa-hidden-4',
        rank: 4,
        title: 'Floating-Point Precision Loss in double (53-Bit Mantissa)',
        symptom:
          'Large integers >= 2^53 (~9 * 10^15) or geometry intersection coordinates lose the last 2–3 decimal digits.',
        buggyPattern:
          'Using double for 10^18 integer arithmetic, or comparing floating-point slopes dy1/dx1 == dy2/dx2 without cross-multiplication.',
        exactFix:
          'Prefer exact integer cross-products (__int128)1 * dy1 * dx2 == (__int128)1 * dy2 * dx1, or use long double (80-bit extended precision on x86_64).',
      },
      {
        id: 'wa-hidden-5',
        rank: 5,
        title: 'Lazy Segment Tree Composition / Push Order Bug',
        symptom:
          'Range updates pass when non-overlapping or single-type, fail when affine/assign updates overlap deeply.',
        buggyPattern:
          'Adding lazy tags without pushing existing parent tags first, or updating node sum1 before sum2 when sum2 depends on old sum1.',
        exactFix:
          'Ensure push(p) is called before recursing in BOTH update() and query(), and save old node aggregates in local temporaries before applying composite tags.',
      },
    ],
  },
  {
    id: 'tle',
    shortCode: 'TLE',
    label: 'Time Limit Exceeded (Performance Bottleneck)',
    badgeColor: 'amber',
    tagline:
      'When your asymptotic complexity should pass but gets TLE, check O(N) per-testcase resets, std::endl flushes, pass-by-value copies, and anti-hash collisions.',
    diagnostics: [
      {
        id: 'tle-1',
        rank: 1,
        title: 'O(MAXN) memset / fill Inside a Multi-Testcase Loop',
        symptom:
          'Problem states "sum of N over all T testcases <= 2 * 10^5", with T = 10^4. Code TLEs on a test file with 10,000 tiny N = 2 testcases.',
        buggyPattern:
          'memset(dp, 0, sizeof(dp)); inside solve(), which zeroes all 200,000 entries 10,000 times (2 * 10^9 ops)!',
        exactFix:
          'Only clear up to the current testcase size n: fill(dp, dp + n + 1, 0); so total clearing work is O(sum of N) = 2 * 10^5.',
      },
      {
        id: 'tle-2',
        rank: 2,
        title: 'Accidental Pass-by-Value Container Copy in Recursion / Lambdas',
        symptom:
          'O(N) DFS or binary search helper takes O(N²) time.',
        buggyPattern:
          'void dfs(int u, vector<vector<int>> adj) — missing the reference & copies the entire adjacency list at every recursive call!',
        exactFix:
          'Always pass containers by const reference: const vector<vector<int>>& adj.',
      },
      {
        id: 'tle-3',
        rank: 3,
        title: 'Unprotected std::unordered_map / std::unordered_set Anti-Hash Blowup',
        symptom:
          'Passes pretests in 80ms, TLEs on hacked system test or Div. 2 educational test #45.',
        buggyPattern:
          'unordered_map<long long, int> mp; without reserve() or custom splitmix64 hash.',
        exactFix:
          'Attach the SplitMix64 CustomHash struct (from Tab 2) and call mp.reserve(n); mp.max_load_factor(0.25); or use coordinate compression + flat vector.',
      },
      {
        id: 'tle-4',
        rank: 4,
        title: 'Using std::endl Instead of "\\n" on >= 10^5 Output Lines',
        symptom:
          'Printing 2 * 10^5 query answers takes > 1.5 seconds even with trivial computation.',
        buggyPattern:
          'cout << ans << endl; inside the query loop, forcing 200,000 OS buffer flushes.',
        exactFix:
          'Use ios::sync_with_stdio(false); cin.tie(nullptr); and replace every endl with "\\n" (except in interactive problems).',
      },
      {
        id: 'tle-5',
        rank: 5,
        title: 'Missing Stale-State Check in Dijkstra’s Priority Queue',
        symptom:
          'Dijkstra TLEs on dense graphs with many parallel/decreasing relaxation edges.',
        buggyPattern:
          'Popping (d, u) from priority_queue and iterating over adj[u] without checking if (d > dist[u]) continue; first.',
        exactFix:
          'Immediately after auto [d, u] = pq.top(); pq.pop(); add if (d != dist[u]) continue; to skip outdated heap entries in O(1).',
      },
    ],
  },
  {
    id: 'mle',
    shortCode: 'MLE',
    label: 'Memory Limit Exceeded (RAM Footprint)',
    badgeColor: 'violet',
    tagline:
      'Keep total allocations well under 256 MB: watch out for 64-bit pointer bloat in node-based STL containers, 2D DP tables, and persistent tree pools.',
    diagnostics: [
      {
        id: 'mle-1',
        rank: 1,
        title: '2D DP Table Allocated Without Rolling-Array Compression',
        symptom:
          'Allocation of vector<vector<long long>> dp(5005, vector<long long>(5005)) uses 200+ MB or N * K table exceeds 256 MB.',
        buggyPattern:
          'Storing all N rows of a DP table when row i only depends on row i - 1.',
        exactFix:
          'Keep only 2 rows: vector<long long> prev_dp(M + 1), cur_dp(M + 1); and swap(prev_dp, cur_dp) after each outer iteration (reduces memory from O(N * M) to O(M)).',
      },
      {
        id: 'mle-2',
        rank: 2,
        title: 'std::map / std::set Pointer Node Overhead (48 Bytes per Element)',
        symptom:
          'Inserting 4 * 10^6 elements into std::set or std::map exceeds 256 MB.',
        buggyPattern:
          'Each red-black tree node allocates three 64-bit pointers (left, right, parent), color enum, and allocator header (~48 bytes per int).',
        exactFix:
          'Store elements in a flat std::vector, sort once, and use std::unique + std::lower_bound (4–8 bytes per element, 10x smaller and cache-contiguous).',
      },
      {
        id: 'mle-3',
        rank: 3,
        title: 'Array of Millions of Small std::vector Instances',
        symptom:
          'vector<int> bucket[5000000]; consumes 120 MB before pushing a single element.',
        buggyPattern:
          'Each empty std::vector header is 24 bytes on 64-bit systems, and push_back() doubles capacity dynamically.',
        exactFix:
          'Use a CSR / Forward-Star flat linked list (head[u], to[e], nxt[e]) when N + M is near the memory ceiling.',
      },
      {
        id: 'mle-4',
        rank: 4,
        title: '64-Bit long long Used in Large Static Tables Where int32_t Suffices',
        symptom:
          'Persistent Segment Tree or 20-level Sparse Table with 2 * 10^7 nodes hits 256 MB.',
        buggyPattern:
          'Storing left/right child indices and modulo-998244353 sums as 8-byte long long inside a 20M-node struct.',
        exactFix:
          'Store child indices and modulo values as 4-byte int (or uint32_t) inside the node struct, and only cast to 1LL * a * b during multiplication.',
      },
      {
        id: 'mle-5',
        rank: 5,
        title: 'Deep Recursion Stack Frames Carrying Large Local Arrays',
        symptom:
          'DFS to depth 2 * 10^5 crashes with MLE or stack overflow.',
        buggyPattern:
          'Declaring int temp[64]; inside a recursive DFS function (200,000 frames * 256 bytes = 51 MB stack memory).',
        exactFix:
          'Move shared buffers outside the recursive function or convert deep recursion to an explicit iterative stack.',
      },
    ],
  },
  {
    id: 're',
    shortCode: 'RE (SIGSEGV / SIGFPE)',
    label: 'Runtime Error (Crash / Segfault / Division by Zero)',
    badgeColor: 'sky',
    tagline:
      'Runtime errors come from out-of-bounds indices, unsigned size() - 1 underflow on empty vectors, iterator invalidation, or division by zero.',
    diagnostics: [
      {
        id: 're-1',
        rank: 1,
        title: 'Unsigned Underflow on v.size() - 1 When Vector Is Empty',
        symptom:
          'Loop for (int i = 0; i < v.size() - 1; ++i) runs 2^64 times and segfaults immediately when v is empty!',
        buggyPattern:
          'v.size() returns unsigned size_t; when v.empty(), v.size() - 1 wraps around to 18,446,744,073,709,551,615.',
        exactFix:
          'Cast size to signed int: for (int i = 0; i + 1 < (int)v.size(); ++i).',
      },
      {
        id: 're-2',
        rank: 2,
        title: 'Non-Strict Comparator in std::sort (a <= b Instead of a < b)',
        symptom:
          'std::sort crashes with SIGSEGV on arrays of >= 32 equal elements.',
        buggyPattern:
          'sort(v.begin(), v.end(), [](int a, int b) { return a <= b; }); violates Strict Weak Ordering (cmp(x, x) MUST be false!).',
        exactFix:
          'Ensure your comparator returns false when a == b (use < or > strictly, never <= or >=).',
      },
      {
        id: 're-3',
        rank: 3,
        title: 'Container Reallocation Invalidating Pointers/References/Iterators',
        symptom:
          'Trie or dynamic Segment Tree corrupts memory or segfaults on node creation.',
        buggyPattern:
          'trie[u][c] = new_node(); where new_node() calls trie.emplace_back(), reallocating the vector before evaluating the left-hand reference trie[u][c]!',
        exactFix:
          'Store the new index in a local variable first: int nxt = new_node(); trie[u][c] = nxt; or call trie.reserve(MAX_NODES) upfront.',
      },
      {
        id: 're-4',
        rank: 4,
        title: 'Segment Tree Allocated as 2 * N Instead of 4 * N',
        symptom:
          'Recursive Segment Tree works for powers of two, crashes with out-of-bounds index on N = 131,073.',
        buggyPattern:
          'A recursive 1-indexed binary segment tree over [0, N-1] can visit node index up to 4 * N - 5.',
        exactFix:
          'Always allocate 4 * N + 5 nodes for recursive Segment Trees (or 2 * N only for flat bottom-up iterative trees).',
      },
      {
        id: 're-5',
        rank: 5,
        title: 'Division or Modulo by Zero (SIGFPE)',
        symptom:
          'Crash with exit code 136 / Floating-point exception on degenerate inputs.',
        buggyPattern:
          'Computing a / b, a % b, or modular inverse inv(0) when b == 0 (e.g., vertical line dx == 0 or empty bucket count == 0).',
        exactFix:
          'Guard every division and gcd normalization: if (dx == 0) dy = 1; else { int g = std::gcd(dx, dy); dx /= g; dy /= g; }.',
      },
    ],
  },
  {
    id: 'ile',
    shortCode: 'ILE (Interactive)',
    label: 'Idleness Limit Exceeded (Interactive Protocol Deadlock)',
    badgeColor: 'emerald',
    tagline:
      'In interactive problems, your program and the judge communicate via pipes; deadlocks occur when output stays buffered or when you keep reading after a -1 verdict.',
    diagnostics: [
      {
        id: 'ile-1',
        rank: 1,
        title: 'Missing Buffer Flush After Printing a Query',
        symptom:
          'Program gets ILE on Test 1 despite printing the first query string.',
        buggyPattern:
          'cout << "? " << l << " " << r << "\\n"; followed by cin >> resp; with cin.tie(nullptr) active — the query sits in your stdout buffer and never reaches the judge!',
        exactFix:
          'Use std::endl (cout << "? " << l << " " << r << endl;) or explicit cout.flush() after every single interactive print.',
      },
      {
        id: 'ile-2',
        rank: 2,
        title: 'Waiting for Next Input After Judge Sent -1 (Invalid Query / Limit Exceeded)',
        symptom:
          'A bug in your query logic causes an invalid query or > Q_max queries, but the judge reports ILE instead of WA.',
        buggyPattern:
          'When your query is invalid, the interactor prints -1 and terminates. If your code ignores -1 and tries to read again, it blocks on EOF/pipe and gets ILE!',
        exactFix:
          'After every cin >> resp;, check if (resp == -1) exit(0); so the judge reports the true WA verdict.',
      },
      {
        id: 'ile-3',
        rank: 3,
        title: 'Forgetting to Read the Next Testcase Header After Printing "! ans"',
        symptom:
          'Single testcase works, multi-testcase interactive problem hangs after Case 1.',
        buggyPattern:
          'Some interactive judges require reading a confirmation integer (1 = correct, -1 = wrong) after printing "! ans" before moving to the next testcase.',
        exactFix:
          'Check the Interaction section carefully for whether the judge sends a verdict token after "!" in multi-test mode.',
      },
      {
        id: 'ile-4',
        rank: 4,
        title: 'Off-by-One in Binary Search Query Budget (log₂ N + 1 vs log₂ N)',
        symptom:
          'Exceeds the strict query limit Q_max = 20 by 1 extra query when N = 10^6.',
        buggyPattern:
          'Querying inside while (l <= r) instead of while (l < r), wasting 1 query when l == r is already uniquely determined!',
        exactFix:
          'Use while (l < r) so the loop terminates as soon as the search space shrinks to 1 element, saving 1 full query.',
      },
      {
        id: 'ile-5',
        rank: 5,
        title: 'Adaptive Adversary Changing the Hidden State Mid-Execution',
        symptom:
          'Randomized probing fails consistently against an adaptive interactor.',
        buggyPattern:
          'Assuming the judge chose a fixed secret before your queries started, when an adaptive judge maintains the set of all secrets consistent with answers so far.',
        exactFix:
          'Ensure every query splits the worst-case remaining consistent state space deterministically (e.g., exact midpoint bisection).',
      },
    ],
  },
];
