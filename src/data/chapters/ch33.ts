import type { TheoryChapter } from '../../types/vault';

export const CH33_INTERACTIVE_ADVERSARY: TheoryChapter = {
  slug: 'interactive-adaptive-adversary',
  topicId: 'th-72',
  title: 'Interactive Problems & Adaptive Adversary Strategies',
  domain: 'Theoretical & Randomized',
  ratingTier: '1600–1900',
  usacoDivision: 'Gold',
  subtitle:
    'Master query-response pipe synchronization with strict stdout flushing, information-theoretic log2(N) lower bounds, and worst-case reasoning against adaptive judges that mutate answers on the fly.',
  analogyTitle: 'The Dishonest Twenty-Questions Referee Analogy',
  analogyBody:
    'In normal problems, your program reads the whole input file upfront and prints one answer at the end. In **Interactive Problems**, your program plays live ping-pong with a referee process over `stdin`/`stdout` pipes: if you forget to **flush stdout** (`cout << endl` / `fflush(stdout)`), your question sits trapped in your output buffer while the referee waits forever—causing an instant **Idleness Limit Exceeded (ILE)**! Worse, some referees are **Adaptive Adversaries**: they do NOT pick the secret number `X` before the game starts. Whenever you ask "Is `X >= 50`?", the referee peeks at `[1, 49]` vs `[50, 100]` and dynamically places `X` inside whichever half hurts your search the most, forcing you to rely on worst-case **information-theoretic bounds** rather than lucky guesses!',
  prerequisites: [
    {
      slug: 'binary-search-on-answer',
      title: 'Binary Search on Answer & Two Pointers',
    },
  ],
  traceTitle: 'Interactive Pipe Flush Protocol & Adaptive Adversary State-Space Halving Trace',
  traceSubtitle:
    'Simulate 4 interactive probes (`? mid` asking `X >= mid`) on `[1, 16]` against an **Adaptive Adversary** that always keeps the larger consistent sub-interval.',
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Step 1: Probe ? 9 + Flush -> Adversary Picks Larger Half [1, 8] ("<")',
      explanation:
        'Candidate interval is [1, 16] (size 16). Solver outputs `? 9` and flushes stdout immediately. Adversary evaluates sizes: `< 9` leaves [1, 8] (size 8), `>= 9` leaves [9, 16] (size 8). Tie! Adversary replies `<`, shrinking range to [1, 8].',
      mode: 'array',
      arrays: [
        {
          name: 'Probe Protocol Pipe',
          cells: [
            { index: 0, value: 'OUT: ? 9', highlight: 'active' },
            { index: 1, value: 'FLUSH()', highlight: 'updated' },
            { index: 2, value: 'IN: <', highlight: 'window' },
          ],
        },
        {
          name: 'Consistent Candidate Range',
          cells: [
            { index: 0, value: 'L = 1', highlight: 'window' },
            { index: 1, value: 'mid = 9', highlight: 'active' },
            { index: 2, value: 'R = 8', highlight: 'window' },
            { index: 3, value: 'Size = 8', highlight: 'updated' },
          ],
        },
      ],
      variables: { QueryNum: 1, RemainingCandidates: 8, AdversaryStrategy: 'Max Remaining Set' },
    },
    {
      stepNumber: 2,
      title: 'Step 2: Probe ? 4 + Flush -> Adversary Sees [4, 8] Has Size 5 > [1, 3] Size 3 -> ">="',
      explanation:
        'Solver probes mid = 4 (`? 4` + flush). Adversary compares `< 4` -> [1, 3] (size 3) vs `>= 4` -> [4, 8] (size 5). To delay convergence, adversary dynamically shifts secret into [4, 8] and replies `>=`!',
      mode: 'array',
      arrays: [
        {
          name: 'Probe Protocol Pipe',
          cells: [
            { index: 0, value: 'OUT: ? 4', highlight: 'active' },
            { index: 1, value: 'FLUSH()', highlight: 'updated' },
            { index: 2, value: 'IN: >=', highlight: 'window' },
          ],
        },
        {
          name: 'Consistent Candidate Range',
          cells: [
            { index: 0, value: 'L = 4', highlight: 'window' },
            { index: 1, value: 'mid = 4', highlight: 'active' },
            { index: 2, value: 'R = 8', highlight: 'window' },
            { index: 3, value: 'Size = 5', highlight: 'updated' },
          ],
        },
      ],
      variables: { QueryNum: 2, RemainingCandidates: 5, ChosenBranch: '[4, 8]' },
    },
    {
      stepNumber: 3,
      title: 'Step 3: Probe ? 7 + Flush -> Adversary Chooses [4, 6] (Size 3 > Size 2)',
      explanation:
        'Solver probes mid = (4 + 8 + 1) / 2 = 6 or 7: probing `? 7` splits [4, 6] (size 3) vs [7, 8] (size 2). Adversary replies `<`, leaving [4, 6] (3 candidates). Notice even an adversary loses >= ~half on balanced midpoints!',
      mode: 'array',
      arrays: [
        {
          name: 'Probe Protocol Pipe',
          cells: [
            { index: 0, value: 'OUT: ? 7', highlight: 'active' },
            { index: 1, value: 'FLUSH()', highlight: 'updated' },
            { index: 2, value: 'IN: <', highlight: 'window' },
          ],
        },
        {
          name: 'Consistent Candidate Range',
          cells: [
            { index: 0, value: 'L = 4', highlight: 'window' },
            { index: 1, value: 'mid = 7', highlight: 'active' },
            { index: 2, value: 'R = 6', highlight: 'window' },
            { index: 3, value: 'Size = 3', highlight: 'updated' },
          ],
        },
      ],
      variables: { QueryNum: 3, RemainingCandidates: 3, ChosenBranch: '[4, 6]' },
    },
    {
      stepNumber: 4,
      title: 'Step 4: Final Probes Converge to L == R = 5 -> Emit "! 5" & Exit Cleanly',
      explanation:
        'Probing `? 5` (adversary picks [5, 6] size 2 -> `>=`), then `? 6` (size 1 vs 1 -> `<`), forces L = R = 5. Solver emits `! 5`, flushes stdout, and terminates `return 0` without reading further.',
      mode: 'array',
      arrays: [
        {
          name: 'Convergence & Shutdown',
          cells: [
            { index: 0, value: 'Q4: ? 5 -> >=', highlight: 'neutral' },
            { index: 1, value: 'Q5: ? 6 -> <', highlight: 'neutral' },
            { index: 2, value: 'OUT: ! 5', highlight: 'active' },
            { index: 3, value: 'FLUSH & EXIT(0)', highlight: 'updated' },
          ],
        },
      ],
      variables: { TotalQueries: 5, MaxAllowed: 'ceil(log2(16)) + 1', LockedAnswer: 5 },
    },
  ],
  reductionClues: [
    {
      clue: '"You have <= Q queries to find a hidden value in [1, 10^18] where each probe splits possibilities"',
      translation:
        'Check information theory first: `Q >= ceil(log2(SearchSpace))`! For `[1, 10^18]`, `log2(10^18) ≈ 59.79`, so `60` binary probes suffice. If `Q == 60` is tight, NEVER waste 1 query on an off-by-one midpoint!',
    },
    {
      clue: '"The interactor is explicitly marked ADAPTIVE (or may change the hidden object consistently)"',
      translation:
        'Randomized guessing fails if the judge responds based on YOUR past queries! Design a **deterministic worst-case invariant** (binary/ternary halving, parity queries, or minimax decision tree) so every single answer still shrinks the valid candidate set.',
    },
    {
      clue: '"Program receives Idleness Limit Exceeded (ILE) despite working on local sample files"',
      translation:
        'You forgot to flush stdout OR tried to read all input up front! Replace `"\\n"` with `endl` (or `cout.flush()`) after EVERY query, NEVER use `sys.stdin.read()` in interactive mode (`readline()` instead), and handle judge error response (`-1`) by exiting immediately.',
    },
    {
      clue: '"Find a peak / local minimum / pivot in a hidden array using <= 2 * log2(N) element queries"',
      translation:
        'Compare adjacent probes `query(mid)` vs `query(mid + 1)` (or `query(mid)` vs boundary `query(N)` for rotated sorted arrays)! Each comparison deterministically discards half the array in `2 * log2(N)` queries.',
    },
  ],
  timeComplexity: 'O(log N) to O(K log N) Interactive Probes | O(1) Per Probe Decision',
  spaceComplexity: 'O(1) Solver State (or O(N) for Candidate Set Filtering)',
  pitfalls: [
    {
      type: 'TLE',
      title: 'Idleness Limit Exceeded From Using "\\n" Without Flushing Stdout',
      detail:
        'Buffered `cout << "? " << mid << "\\n"` or `printf` stays in RAM instead of going through the pipe to the judge! Always call `cout << endl;` or `cout.flush();` (`fflush(stdout)` in C, `io::stdout().flush()` in Rust, `System.out.flush()` in Java, `flush=True` in Python, `$stdout.flush` in Ruby).',
    },
    {
      type: 'TLE',
      title: 'Calling sys.stdin.read() Inside an Interactive Python Problem',
      detail:
        '`sys.stdin.read()` blocks until EOF, which the interactive judge NEVER sends until your program prints `! ans`! Always read interactive responses line-by-line via `sys.stdin.readline().strip()`.',
    },
    {
      type: 'WA',
      title: 'Ignoring Judge "-1" Invalid-Query Termination Signal',
      detail:
        'When your query exceeds the limit or goes out of bounds, judges print `-1` (or `0`/`ERROR`) and close the pipe. If your code keeps looping, you get `TLE`/`RE` instead of `WA`—check for `"-1"` immediately and `exit(0)`.',
    },
    {
      type: 'WA',
      title: 'Using (L + R) / 2 Instead of (L + R + 1) / 2 When Updating L = mid',
      detail:
        'In binary search returning `>=` (where `L = mid` keeps `mid`), using `(L + R) / 2` loops forever when `R == L + 1`! Always use `mid = L + (R - L + 1) / 2` for `L = mid` branches, and beware `(L + R)` overflowing 64-bit integers when `L, R ~ 10^18` (`L + (R - L + 1) / 2` never overflows)!',
    },
  ],
  implementations: {
    cpp20: `#include <bits/stdc++.h>
using namespace std;

// Interactive Binary Search Template with Safe Flushing & Overflow-Free Midpoint
// Protocol: emits "? mid" (asks if X >= mid), reads ">=" or "<", exits with "! ans"
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    long long L = 1, R = 1000000;
    if (!(cin >> R)) return 0; // Optional upper bound N from judge

    while (L < R) {
        long long mid = L + (R - L + 1) / 2;
        cout << "? " << mid << endl; // endl automatically flushes stdout
        string resp;
        if (!(cin >> resp) || resp == "-1") return 0;
        if (resp == ">=") {
            L = mid;
        } else {
            R = mid - 1;
        }
    }
    cout << "! " << L << endl;
    return 0;
}`,
    rust: `use std::io::{self, BufRead, Write};

fn main() {
    let stdin = io::stdin();
    let mut lines = stdin.lock().lines();
    let mut stdout = io::BufWriter::new(io::stdout().lock());

    let mut l: i64 = 1;
    let mut r: i64 = match lines.next() {
        Some(Ok(line)) => match line.trim().parse() {
            Ok(v) => v,
            Err(_) => return,
        },
        _ => return,
    };

    while l < r {
        let mid = l + (r - l + 1) / 2;
        writeln!(stdout, "? {}", mid).unwrap();
        stdout.flush().unwrap();

        let resp = match lines.next() {
            Some(Ok(s)) => s.trim().to_string(),
            _ => return,
        };
        if resp == "-1" {
            return;
        }
        if resp == ">=" {
            l = mid;
        } else {
            r = mid - 1;
        }
    }
    writeln!(stdout, "! {}", l).unwrap();
    stdout.flush().unwrap();
}`,
    java21: `import java.io.IOException;
import java.io.InputStream;

public class Main {
    static final class FastScanner {
        private final InputStream in;
        private final byte[] buf = new byte[1 << 12];
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
            while (c > ' ') {
                sb.append((char) c);
                c = readByte();
            }
            return sb.toString();
        }
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        String first = fs.next();
        if (first == null) return;
        long L = 1, R = Long.parseLong(first);

        while (L < R) {
            long mid = L + (R - L + 1) / 2;
            System.out.println("? " + mid);
            System.out.flush();
            String resp = fs.next();
            if (resp == null || resp.equals("-1")) return;
            if (resp.equals(">=")) L = mid;
            else R = mid - 1;
        }
        System.out.println("! " + L);
        System.out.flush();
    }
}`,
    python3: `import sys

sys.setrecursionlimit(200000)

def solve() -> None:
    line = sys.stdin.readline()
    if not line:
        return
    L, R = 1, int(line.strip())

    while L < R:
        mid = L + (R - L + 1) // 2
        print(f"? {mid}", flush=True)
        resp = sys.stdin.readline().strip()
        if not resp or resp == "-1":
            return
        if resp == ">=":
            L = mid
        else:
            R = mid - 1

    print(f"! {L}", flush=True)

if __name__ == "__main__":
    solve()`,
    ruby: `line = $stdin.gets
exit if line.nil?
l = 1
r = line.strip.to_i

while l < r
  mid = l + (r - l + 1) / 2
  puts "? #{mid}"
  $stdout.flush
  resp = $stdin.gets
  exit if resp.nil?
  resp = resp.strip
  exit if resp == "-1"
  if resp == ">="
    l = mid
  else
    r = mid - 1
  end
end

puts "! #{l}"
$stdout.flush`,
  },
  practiceProblems: [
    {
      id: 'ch33-p1',
      tier: 'Warmup',
      ratingRange: '1300–1550',
      title: 'Guess the Hidden Integer in <= 60 Queries (1 <= X <= 10^18)',
      statement:
        'This is an interactive problem. First read N (1 <= N <= 10^18). The judge hides an integer X in [1, N]. You may ask up to 60 queries of the form `? y` (`1 <= y <= N`). The judge replies `YES` if `X >= y` and `NO` if `X < y`. Output `! X` once found.',
      constraints: '1 <= X <= N <= 10^18, max 60 queries',
      sampleInput: '100\nYES\nNO\nYES\n...',
      sampleOutput: '? 51\n? 76\n...\n! 64',
      hints: [
        'Since `2^60 = 1.15 * 10^18 > 10^18`, strict binary search needs at most `ceil(log2(N)) <= 60` queries!',
        'Watch overflow on `10^18 + 10^18`: compute `mid = L + (R - L + 1) / 2`, flush stdout after every `? mid`, and stop immediately as soon as `L == R` without spending an extra verification query!',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    long long n;
    if (!(cin >> n)) return 0;

    long long L = 1, R = n;
    while (L < R) {
        long long mid = L + (R - L + 1) / 2;
        cout << "? " << mid << endl;
        string ans;
        if (!(cin >> ans) || ans == "-1") return 0;
        if (ans == "YES") L = mid;
        else R = mid - 1;
    }
    cout << "! " << L << endl;
    return 0;
}`,
        rust: `use std::io::{self, BufRead, Write};

fn main() {
    let stdin = io::stdin();
    let mut lines = stdin.lock().lines();
    let mut stdout = io::BufWriter::new(io::stdout().lock());

    let n: i64 = match lines.next() {
        Some(Ok(s)) => match s.trim().parse() {
            Ok(v) => v,
            Err(_) => return,
        },
        _ => return,
    };

    let (mut l, mut r) = (1i64, n);
    while l < r {
        let mid = l + (r - l + 1) / 2;
        writeln!(stdout, "? {}", mid).unwrap();
        stdout.flush().unwrap();
        let ans = match lines.next() {
            Some(Ok(s)) => s.trim().to_string(),
            _ => return,
        };
        if ans == "-1" {
            return;
        }
        if ans == "YES" {
            l = mid;
        } else {
            r = mid - 1;
        }
    }
    writeln!(stdout, "! {}", l).unwrap();
    stdout.flush().unwrap();
}`,
        java21: `import java.io.IOException;
import java.io.InputStream;

public class Main {
    static final class FastScanner {
        private final InputStream in;
        private final byte[] buf = new byte[1 << 12];
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
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        String nStr = fs.next();
        if (nStr == null) return;
        long L = 1, R = Long.parseLong(nStr);

        while (L < R) {
            long mid = L + (R - L + 1) / 2;
            System.out.println("? " + mid);
            System.out.flush();
            String ans = fs.next();
            if (ans == null || ans.equals("-1")) return;
            if (ans.equals("YES")) L = mid;
            else R = mid - 1;
        }
        System.out.println("! " + L);
        System.out.flush();
    }
}`,
        python3: `import sys

sys.setrecursionlimit(200000)

def solve() -> None:
    first = sys.stdin.readline()
    if not first:
        return
    L, R = 1, int(first.strip())
    while L < R:
        mid = L + (R - L + 1) // 2
        print(f"? {mid}", flush=True)
        ans = sys.stdin.readline().strip()
        if not ans or ans == "-1":
            return
        if ans == "YES":
            L = mid
        else:
            R = mid - 1
    print(f"! {L}", flush=True)

if __name__ == "__main__":
    solve()`,
        ruby: `first = $stdin.gets
exit if first.nil?
l = 1
r = first.strip.to_i
while l < r
  mid = l + (r - l + 1) / 2
  puts "? #{mid}"
  $stdout.flush
  ans = $stdin.gets
  exit if ans.nil?
  ans = ans.strip
  exit if ans == "-1"
  if ans == "YES"
    l = mid
  else
    r = mid - 1
  end
end
puts "! #{l}"
$stdout.flush`,
      },
    },
    {
      id: 'ch33-p2',
      tier: 'Standard',
      ratingRange: '1600–1850',
      title: 'Interactive Unimodal Peak Finder (<= 40 Value Probes)',
      statement:
        'An array A[1..N] of distinct integers is strictly increasing up to an unknown peak index P and strictly decreasing afterwards (unimodal). Read N (1 <= N <= 10^5). Using at most 40 queries `? i` (which return A[i]), find and output `! P`.',
      constraints: '1 <= N <= 10^5, at most 40 queries',
      sampleInput: '5\n10\n25\n18',
      sampleOutput: '? 3\n? 4\n? 2\n! 2',
      hints: [
        'Because `N <= 10^5`, `ceil(log2(10^5)) = 17`, so `2 * 17 = 34 <= 40`! At any interval `[L, R]` with `L < R`, set `mid = (L + R) / 2` (so `mid + 1 <= R`).',
        'Query BOTH `A[mid]` and `A[mid + 1]`. If `A[mid] < A[mid + 1]`, the peak MUST lie in `[mid + 1, R]`; otherwise the peak lies in `[L, mid]`. Optionally cache queried indices so duplicate probes never cost extra queries!',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    if (!(cin >> n)) return 0;

    unordered_map<int, long long> cache;
    auto ask = [&](int idx) -> long long {
        auto it = cache.find(idx);
        if (it != cache.end()) return it->second;
        cout << "? " << idx << endl;
        long long val;
        if (!(cin >> val) || val == -1) exit(0);
        return cache[idx] = val;
    };

    int L = 1, R = n;
    while (L < R) {
        int mid = L + (R - L) / 2;
        if (ask(mid) < ask(mid + 1)) {
            L = mid + 1;
        } else {
            R = mid;
        }
    }
    cout << "! " << L << endl;
    return 0;
}`,
        rust: `use std::collections::HashMap;
use std::io::{self, BufRead, Write};

fn main() {
    let stdin = io::stdin();
    let mut lines = stdin.lock().lines();
    let mut stdout = io::BufWriter::new(io::stdout().lock());

    let n: usize = match lines.next() {
        Some(Ok(s)) => match s.trim().parse() {
            Ok(v) => v,
            Err(_) => return,
        },
        _ => return,
    };

    let mut cache: HashMap<usize, i64> = HashMap::new();
    let mut ask = |idx: usize| -> Option<i64> {
        if let Some(&v) = cache.get(&idx) {
            return Some(v);
        }
        writeln!(stdout, "? {}", idx).unwrap();
        stdout.flush().unwrap();
        let line = lines.next()?.ok()?;
        let val: i64 = line.trim().parse().ok()?;
        if val == -1 {
            return None;
        }
        cache.insert(idx, val);
        Some(val)
    };

    let (mut l, mut r) = (1usize, n);
    while l < r {
        let mid = l + (r - l) / 2;
        let v1 = match ask(mid) {
            Some(v) => v,
            None => return,
        };
        let v2 = match ask(mid + 1) {
            Some(v) => v,
            None => return,
        };
        if v1 < v2 {
            l = mid + 1;
        } else {
            r = mid;
        }
    }
    writeln!(stdout, "! {}", l).unwrap();
    stdout.flush().unwrap();
}`,
        java21: `import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

public class Main {
    static final class FastScanner {
        private final InputStream in;
        private final byte[] buf = new byte[1 << 12];
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
    }

    static FastScanner fs;
    static Map<Integer, Long> cache = new HashMap<>();

    static long ask(int idx) throws IOException {
        if (cache.containsKey(idx)) return cache.get(idx);
        System.out.println("? " + idx);
        System.out.flush();
        String s = fs.next();
        if (s == null) System.exit(0);
        long v = Long.parseLong(s);
        if (v == -1) System.exit(0);
        cache.put(idx, v);
        return v;
    }

    public static void main(String[] args) throws Exception {
        fs = new FastScanner(System.in);
        String nStr = fs.next();
        if (nStr == null) return;
        int L = 1, R = Integer.parseInt(nStr);
        while (L < R) {
            int mid = L + (R - L) / 2;
            if (ask(mid) < ask(mid + 1)) L = mid + 1;
            else R = mid;
        }
        System.out.println("! " + L);
        System.out.flush();
    }
}`,
        python3: `import sys

sys.setrecursionlimit(200000)

def solve() -> None:
    first = sys.stdin.readline()
    if not first:
        return
    n = int(first.strip())
    cache = {}

    def ask(idx: int) -> int:
        if idx in cache:
            return cache[idx]
        print(f"? {idx}", flush=True)
        resp = sys.stdin.readline().strip()
        if not resp or resp == "-1":
            sys.exit(0)
        val = int(resp)
        cache[idx] = val
        return val

    L, R = 1, n
    while L < R:
        mid = L + (R - L) // 2
        if ask(mid) < ask(mid + 1):
            L = mid + 1
        else:
            R = mid
    print(f"! {L}", flush=True)

if __name__ == "__main__":
    solve()`,
        ruby: `first = $stdin.gets
exit if first.nil?
n = first.strip.to_i
cache = {}

ask = lambda do |idx|
  return cache[idx] if cache.key?(idx)
  puts "? #{idx}"
  $stdout.flush
  resp = $stdin.gets
  exit if resp.nil?
  val = resp.strip.to_i
  exit if val == -1
  cache[idx] = val
end

l = 1
r = n
while l < r
  mid = l + (r - l) / 2
  if ask.call(mid) < ask.call(mid + 1)
    l = mid + 1
  else
    r = mid
  end
end
puts "! #{l}"
$stdout.flush`,
      },
    },
    {
      id: 'ch33-p3',
      tier: 'Boss',
      ratingRange: '1850–2100',
      title: 'Adaptive Adversary Judge Simulator (Maintain Maximal Consistent Range)',
      statement:
        'Implement an Adaptive Adversary interactor over hidden interval [1, N]. Given N and Q contestant probes x_1, ..., x_Q asking "Is hidden X >= x_i?": dynamically maintain the current valid interval [L, R]. Whenever possible, answer YES (`[max(L, x), R]`) or NO (`[L, min(R, x - 1)]`) to MAXIMIZE the number of remaining valid candidates (breaking ties in favor of NO). Output each adversary response ("YES" or "NO") alongside the new remaining candidate count.',
      constraints: '1 <= N <= 10^18, 1 <= Q <= 10^5, 1 <= x_i <= N',
      sampleInput: '16 4\n9\n4\n7\n5',
      sampleOutput: 'NO 8\nYES 5\nNO 3\nYES 2',
      hints: [
        'For a probe `x` against active range `[L, R]`: if `x <= L`, NO is impossible (left size = `0`), so the adversary is FORCED to say `YES` keeping `[L, R]`. If `x > R`, YES is impossible (right size = `0`), so it MUST say `NO` keeping `[L, R]`.',
        'When `L < x <= R`, left branch `[L, x - 1]` has `leftSz = x - L` candidates and right branch `[x, R]` has `rightSz = R - x + 1` candidates. If `rightSz > leftSz`, update `L = x` and emit `YES rightSz`; otherwise update `R = x - 1` and emit `NO leftSz`!',
      ],
      solutions: {
        cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    long long n;
    int q;
    if (!(cin >> n >> q)) return 0;

    long long L = 1, R = n;
    while (q--) {
        long long x;
        cin >> x;
        if (x <= L) {
            cout << "YES " << (R - L + 1) << "\\n";
        } else if (x > R) {
            cout << "NO " << (R - L + 1) << "\\n";
        } else {
            long long leftSz = x - L;
            long long rightSz = R - x + 1;
            if (rightSz > leftSz) {
                L = x;
                cout << "YES " << rightSz << "\\n";
            } else {
                R = x - 1;
                cout << "NO " << leftSz << "\\n";
            }
        }
    }
    return 0;
}`,
        rust: `use std::io::{self, Read};

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let n: i64 = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };
    let q: usize = it.next().unwrap().parse().unwrap();

    let (mut l, mut r) = (1i64, n);
    let mut out = String::new();
    for _ in 0..q {
        let x: i64 = it.next().unwrap().parse().unwrap();
        if x <= l {
            out.push_str(&format!("YES {}\\n", r - l + 1));
        } else if x > r {
            out.push_str(&format!("NO {}\\n", r - l + 1));
        } else {
            let left_sz = x - l;
            let right_sz = r - x + 1;
            if right_sz > left_sz {
                l = x;
                out.push_str(&format!("YES {}\\n", right_sz));
            } else {
                r = x - 1;
                out.push_str(&format!("NO {}\\n", left_sz));
            }
        }
    }
    print!("{}", out);
}`,
        java21: `import java.io.IOException;
import java.io.InputStream;

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
            long res = 0;
            while (c > ' ') { res = res * 10 + (c - '0'); c = readByte(); }
            return res;
        }
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner(System.in);
        long n = fs.nextLong();
        if (n == Long.MIN_VALUE) return;
        int q = (int) fs.nextLong();

        long L = 1, R = n;
        StringBuilder sb = new StringBuilder();
        while (q-- > 0) {
            long x = fs.nextLong();
            if (x <= L) {
                sb.append("YES ").append(R - L + 1).append('\\n');
            } else if (x > R) {
                sb.append("NO ").append(R - L + 1).append('\\n');
            } else {
                long leftSz = x - L;
                long rightSz = R - x + 1;
                if (rightSz > leftSz) {
                    L = x;
                    sb.append("YES ").append(rightSz).append('\\n');
                } else {
                    R = x - 1;
                    sb.append("NO ").append(leftSz).append('\\n');
                }
            }
        }
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
    q = int(next(it))
    L, R = 1, n
    out = []

    for _ in range(q):
        x = int(next(it))
        if x <= L:
            out.append(f"YES {R - L + 1}")
        elif x > R:
            out.append(f"NO {R - L + 1}")
        else:
            left_sz = x - L
            right_sz = R - x + 1
            if right_sz > left_sz:
                L = x
                out.append(f"YES {right_sz}")
            else:
                R = x - 1
                out.append(f"NO {left_sz}")

    sys.stdout.write("\\n".join(out) + "\\n")

if __name__ == "__main__":
    solve()`,
        ruby: `tokens = $stdin.read.split
exit if tokens.empty?
n = tokens[0].to_i
q = tokens[1].to_i
l = 1
r = n
out = []
q.times do |i|
  x = tokens[2 + i].to_i
  if x <= l
    out << "YES #{r - l + 1}"
  elsif x > r
    out << "NO #{r - l + 1}"
  else
    left_sz = x - l
    right_sz = r - x + 1
    if right_sz > left_sz
      l = x
      out << "YES #{right_sz}"
    else
      r = x - 1
      out << "NO #{left_sz}"
    end
  end
end
puts out.join("\\n")`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'CSES',
      title: 'Hidden Integer / Interactive Binary Search',
      difficulty: 'Interactive Warmup',
      url: 'https://cses.fi/problemset/',
      patternNote: 'Practice strict flush discipline (`endl` / `flush=True`) and zero-overhead `ceil(log2 N)` halving.',
    },
    {
      platform: 'AtCoder',
      title: 'ABC244 C / ABC299 D - Find by Query',
      difficulty: '1000–1400',
      url: 'https://atcoder.jp/contests/abc299/tasks/abc299_d',
      patternNote: 'Binary search on a binary string with `S[1] = 0, S[N] = 1` guaranteeing a `01` transition in `<= 20` queries.',
    },
    {
      platform: 'Codeforces',
      title: 'Guess the Number / Flamingoes of Mystery (CF 1486C2 / 1425F)',
      difficulty: '1600–2000',
      url: 'https://codeforces.com/problemset/problem/1486/C2',
      patternNote: 'Locate the maximum via second-maximum queries in `<= 20` probes using careful adaptive binary search.',
    },
    {
      platform: 'CodeChef',
      title: 'Interactive Guessing / Adaptive Judge Practice',
      difficulty: 'Div2 Medium',
      url: 'https://www.codechef.com/problems/GUESSG',
      patternNote: 'Overcome periodic lying/adaptive judges by cross-validating probes across disjoint intervals.',
    },
    {
      platform: 'HackerRank',
      title: 'Query Protocol & Search Space Halving',
      difficulty: 'Medium',
      url: 'https://www.hackerrank.com/challenges/icecream-parlor/problem',
      patternNote: 'Verify worst-case query budget before coding using `log2(candidates)` lower bounds.',
    },
    {
      platform: 'NeetCode 150',
      title: 'Find Peak Element & Guess Number Higher or Lower',
      difficulty: 'Medium (LeetCode 162 / 374)',
      url: 'https://leetcode.com/problems/find-peak-element/',
      patternNote: 'Identical `mid` vs `mid+1` unimodal slope halving behind LeetCode’s hidden-API interactive problems.',
    },
  ],
  interviewNotes: [
    'Interactive LeetCode/system-design rounds ("given hidden API `guess(x)` or `read4()`, minimize calls") test the exact same `ceil(log2 N)` invariant and caching discipline.',
    'Always state why `flush` is required (OS pipe buffering vs TTY line buffering) and how you guard against adaptive adversaries by shrinking the worst-case branch.',
    'When local testing interactive solutions, write a two-way FIFO pipe script or build an embedded in-process `MockJudge` struct toggled by `#ifdef LOCAL`!',
  ],
  projectBlueprint: {
    title: 'Automated Protocol Fuzzing & Probe Testing Harness',
    tagline: 'Stress-test interactive solvers against deterministic, randomized, and adaptive-adversary judges under strict query-budget and flush checks.',
    stackSummary: 'C++20 In-Process Judge Harness, Adaptive Interval Adversary, Query-Budget Telemetry',
    asciiDiagram: `
+-------------------------+      +------------------------------------+
| Solver Probe Stream     | ---> | Adaptive Adversary Engine          |
| ? mid (flush verified)  |      | Compares |Left| vs |Right|         |
+-------------------------+      +------------------------------------+
            ^                                      |
            |       Response ("YES" / "NO")        |
            +--------------------------------------+`,
    milestones: [
      {
        id: 'm1',
        title: '1. Abstract Judge Interface (Static vs Adaptive Modes)',
        detail: 'Decouple the solver from `cin/cout` using an injectable `query()` callback so tests run at 10M calls/sec in-memory.',
      },
      {
        id: 'm2',
        title: '2. Adaptive Worst-Case Adversary Oracle',
        detail: 'Track `[L, R]` dynamically and always steer the solver toward the larger remaining candidate partition.',
      },
      {
        id: 'm3',
        title: '3. Automated Query-Budget & Edge-Case Assertion Suite',
        detail: 'Fuzz boundary sizes (`N = 1, 2, 3, 2^k, 2^k+1, 10^18`) asserting zero infinite loops and `queries <= ceil(log2(N))`.',
      },
    ],
    starterCode: `// Automated Protocol Fuzzing & Probe Testing Harness (Runnable C++20 Prototype)
#include <bits/stdc++.h>
using namespace std;

struct AdaptiveAdversary {
    long long L = 1, R;
    int queries = 0;
    explicit AdaptiveAdversary(long long n) : R(n) {}

    bool is_ge(long long x) {
        queries++;
        if (x <= L) return true;
        if (x > R) return false;
        long long leftSz = x - L, rightSz = R - x + 1;
        if (rightSz > leftSz) {
            L = x;
            return true;
        }
        R = x - 1;
        return false;
    }
};

int main() {
    for (long long n : {1LL, 2LL, 15LL, 16LL, 17LL, 1000000000000000000LL}) {
        AdaptiveAdversary judge(n);
        long long l = 1, r = n;
        while (l < r) {
            long long mid = l + (r - l + 1) / 2;
            if (judge.is_ge(mid)) l = mid;
            else r = mid - 1;
        }
        assert(l == judge.L && r == judge.R);
        cout << "N = " << n << " | Converged to X = " << l << " in " << judge.queries << " worst-case probes\\n";
    }
    return 0;
}`,
  },
};
