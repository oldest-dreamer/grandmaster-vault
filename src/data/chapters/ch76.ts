import type { TheoryChapter } from '../../types/vault';

export const CH76_DIRICHLET_DU_SIEVE: TheoryChapter = {
  slug: 'dirichlet-convolution-du-sieve',
  topicId: 'ma-59',
  title: 'Dirichlet Convolution & Sublinear Prefix Sums (Du Sieve)',
  domain: 'Math, Number Theory & Algebra',
  ratingTier: '2600–3300+',
  usacoDivision: 'Advanced',
  subtitle: 'Dirichlet identities, floor-block hyperbola splitting, Du’s O(N^(2/3)) sublinear prefix sums of mu and phi, and Min_25 multiplicative prefix sieving',
  analogyTitle: 'Trading Dense Sieve Arrays for a Recursive Quotient Ladder',
  analogyBody:
    'For an arithmetic function f(n), computing S(N) = sum_{i=1..N} f(i) up to N = 10^10 is impossible with an O(N) linear sieve. Du’s Sieve exploits Dirichlet convolution (f * g)(n) = sum_{d | n} f(d) g(n/d): by summing (f * g)(i) up to N and switching the summation order, g(1) S(N) = sum_{i=1..N} (f * g)(i) - sum_{d=2..N} g(d) S(floor(N / d)).\n\nWhenever both g(i) and (f * g)(i) have O(1) closed-form prefix sums—such as f = mu with g = 1 giving (mu * 1)(i) = [i == 1], or f = phi with g = 1 giving (phi * 1)(i) = i—the floor values floor(N / d) collapse into only O(sqrt(N)) distinct quotients grouped into contiguous [l, r] blocks. Precomputing exact values of S(n) up to B = N^(2/3) with a linear sieve balances the precomputation O(B) against the uncached tail O(N / sqrt(B)) = O(N^(2/3)), solving N <= 10^10 in milliseconds.\n\nWhen f(p) has no simple Dirichlet companion g (such as f(p^e) = p^e(p^e - 1)), the Min_25 Sieve evaluates prime sums separately by sieving completely multiplicative power polynomials x^k over the O(sqrt(N)) floor quotients and then recursively combining prime-power contributions f(p^e).',
  prerequisites: [
    { slug: 'inclusion-exclusion-mobius', title: 'Inclusion-Exclusion & Mobius Inversion' },
  ],
  traceTitle: 'Du’s Sieve Recursive Decomposition on S_phi(12) and S_mu(12)',
  traceSubtitle: 'Grouping identical floor quotients floor(N / d) with small precomputation threshold B',
  traceSteps: [
    {
      stepNumber: 1,
      title: 'Step 1: Choose Linear Sieve Threshold B ~ N^(2/3)',
      explanation: 'Precompute mu(i) and phi(i) and their prefix sums S_mu[i], S_phi[i] for all i <= B via linear Euler sieve. Any recursive call with n <= B terminates in O(1).',
      mode: 'array',
      arrays: [
        {
          name: 'Precomputed Prefix Sums (Small Region i <= B)',
          cells: [
            { index: 1, value: '1 / 1', label: 'n=1', highlight: 'neutral' },
            { index: 2, value: '0 / 2', label: 'n=2', highlight: 'neutral' },
            { index: 3, value: '-1 / 4', label: 'n=3', highlight: 'active' },
            { index: 4, value: '-1 / 6', label: 'n=4', highlight: 'active' },
            { index: 5, value: '-2 / 10', label: 'n=5', highlight: 'updated' },
            { index: 6, value: '-1 / 12', label: 'S_mu / S_phi', highlight: 'updated' },
          ],
        },
      ],
      variables: { B_target: 'N^(2/3)', identityMu: 'mu * 1 = eps', identityPhi: 'phi * 1 = id' },
    },
    {
      stepNumber: 2,
      title: 'Step 2: Group Divisors d in [2, N] Into Equal-Quotient Blocks',
      explanation: 'For N = 12, loop d from 2 to 12 jumping by r = N / (N / d). Blocks: d=2 (q=6), d=3 (q=4), d=4 (q=3), d=[5..6] (q=2), d=[7..12] (q=1).',
      mode: 'array',
      arrays: [
        {
          name: 'Quotient Blocks for N = 12',
          cells: [
            { index: 0, value: '[2,2] q=6', label: 'w=1', highlight: 'active' },
            { index: 1, value: '[3,3] q=4', label: 'w=1', highlight: 'active' },
            { index: 2, value: '[4,4] q=3', label: 'w=1', highlight: 'active' },
            { index: 3, value: '[5,6] q=2', label: 'w=2', highlight: 'updated' },
            { index: 4, value: '[7,12] q=1', label: 'w=6', highlight: 'updated' },
          ],
        },
      ],
      variables: { totalPrefix12: '12*13/2 = 78', distinctBlocks: 5, complexityPerNode: 'O(sqrt(n))' },
    },
    {
      stepNumber: 3,
      title: 'Step 3: Memoize by n and Subtract Block Contributions',
      explanation: 'Compute S_mu(12) = 1 - [(-1) + (-1) + (-1) + 2*(0) + 6*(1)] = -2, and S_phi(12) = 78 - [12 + 6 + 4 + 2*(2) + 6*(1)] = 46.',
      mode: 'array',
      arrays: [
        {
          name: 'Evaluated Prefix Sums at N = 12',
          cells: [
            { index: 0, value: 'S_mu(10) = -1', label: 'N=10', highlight: 'active' },
            { index: 1, value: 'S_phi(10) = 32', label: 'N=10', highlight: 'active' },
            { index: 2, value: 'S_mu(12) = -2', label: 'N=12', highlight: 'updated' },
            { index: 3, value: 'S_phi(12) = 46', label: 'N=12', highlight: 'updated' },
          ],
        },
      ],
      variables: { S_mu_12: -2, S_phi_12: 46, globalMemoKeys: 'N / k for k <= sqrt(N)' },
    },
  ],
  reductionClues: [
    {
      clue: 'Compute sum_{i=1..N} mu(i) or sum_{i=1..N} phi(i) for N up to 10^10 - 10^11',
      translation: 'Apply Du’s Sieve with g = 1 and precompute linear Euler sieve prefix sums up to B ~ N^(2/3).',
    },
    {
      clue: 'Evaluate sum_{1<=i,j<=N} gcd(i, j) or sum lcm(i, j) for N <= 10^10',
      translation: 'Apply Mobius/Totient identity sum gcd(i,j) = sum_{d=1..N} phi(d) * floor(N/d)^2, then group by floor(N/d) blocks using Du S_phi(n).',
    },
    {
      clue: 'Prefix sum of multiplicative f(n) where f * g has simple prefix sums (e.g., i*phi(i) with g=id)',
      translation: 'Apply general Du recursion: g(1) S(N) = S_{f*g}(N) - sum_{d>=2} (G(r) - G(l-1)) * S(N/d) using prefix sums of g on [l, r].',
    },
    {
      clue: 'Prefix sum of multiplicative f(n) where f(p) is a polynomial in p without an easy Dirichlet inverse',
      translation: 'Use the Min_25 Sieve: sieve prime sums g_k over floor(N/i) quotients, then recurse S(x, j) for composite prime-power factors.',
    },
  ],
  timeComplexity: 'O(N^(2/3)) for Du’s Sieve; O(N^(3/4) / log N) for Min_25 Sieve',
  spaceComplexity: 'O(N^(2/3)) for Du’s Sieve; O(sqrt(N)) for Min_25 Sieve',
  pitfalls: [
    {
      type: 'TLE',
      title: 'Setting Precompute Limit B = sqrt(N) Instead of N^(2/3)',
      detail: 'Precomputing only up to sqrt(N) leaves O(N^(3/4)) recursive work. Setting B ~ max_n^(2/3) (capped around 1.5e6) drops runtime well under 0.1s for N = 10^10.',
    },
    {
      type: 'WA',
      title: 'Signed 64-Bit Overflow in S_phi(n) Multiplication (n * (n + 1))',
      detail: 'For N = 10^10, n * (n + 1) = 10^20 > 2^63 - 1. Always reduce n % MOD and (n + 1) % MOD BEFORE multiplying and multiply by inv2 mod MOD.',
    },
    {
      type: 'WA',
      title: 'Negative Prime Cutoff in Min_25 Recursion S(x, j)',
      detail: 'Always guard with if (x <= 1 || (j > 0 && x <= primes[j - 1])) return 0 (and handle j < P and x < primes[j]) so g(x) - sp[j] never subtracts primes larger than x.',
    },
    {
      type: 'TLE',
      title: 'Clearing Large Memo Tables Between Queries',
      detail: 'Keep memo_mu and memo_phi persistent across all T queries in a test file since S_mu(x) and S_phi(x) depend only on x, never on query N.',
    },
  ],
  implementations: {
    cpp20: `#include <algorithm>
#include <cmath>
#include <cstdint>
#include <iostream>
#include <unordered_map>
#include <vector>

using namespace std;

static constexpr long long MOD = 998244353LL;
static constexpr long long INV2 = 499122177LL;

struct DuSieve {
    int limit;
    vector<int> primes;
    vector<bool> is_comp;
    vector<long long> pref_mu;
    vector<long long> pref_phi;
    unordered_map<long long, long long> memo_mu;
    unordered_map<long long, long long> memo_phi;

    explicit DuSieve(long long max_n) {
        long double approx = pow((long double)max_n, 2.0L / 3.0L);
        limit = (int)min<long long>(1500000LL, max<long long>(100LL, (long long)approx + 16LL));
        is_comp.assign(limit + 1, false);
        pref_mu.assign(limit + 1, 0);
        pref_phi.assign(limit + 1, 0);
        pref_mu[1] = 1;
        pref_phi[1] = 1;
        vector<int> mu(limit + 1, 0), phi(limit + 1, 0);
        mu[1] = 1;
        phi[1] = 1;
        for (int i = 2; i <= limit; ++i) {
            if (!is_comp[i]) {
                primes.push_back(i);
                mu[i] = -1;
                phi[i] = i - 1;
            }
            for (int p : primes) {
                long long nx = 1LL * i * p;
                if (nx > limit) break;
                is_comp[nx] = true;
                if (i % p == 0) {
                    mu[nx] = 0;
                    phi[nx] = phi[i] * p;
                    break;
                } else {
                    mu[nx] = -mu[i];
                    phi[nx] = phi[i] * (p - 1);
                }
            }
            pref_mu[i] = pref_mu[i - 1] + mu[i];
            pref_phi[i] = (pref_phi[i - 1] + phi[i]) % MOD;
        }
    }

    long long sum_mu(long long n) {
        if (n <= limit) return pref_mu[n];
        auto it = memo_mu.find(n);
        if (it != memo_mu.end()) return it->second;
        long long ans = 1;
        for (long long l = 2, r; l <= n; l = r + 1) {
            long long q = n / l;
            r = n / q;
            ans -= (r - l + 1) * sum_mu(q);
        }
        return memo_mu[n] = ans;
    }

    long long sum_phi(long long n) {
        if (n <= limit) return pref_phi[n];
        auto it = memo_phi.find(n);
        if (it != memo_phi.end()) return it->second;
        long long nmod = n % MOD;
        long long ans = (nmod * ((n + 1) % MOD)) % MOD * INV2 % MOD;
        for (long long l = 2, r; l <= n; l = r + 1) {
            long long q = n / l;
            r = n / q;
            long long len = (r - l + 1) % MOD;
            ans = (ans - len * sum_phi(q)) % MOD;
            if (ans < 0) ans += MOD;
        }
        return memo_phi[n] = ans;
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int T;
    if (!(cin >> T)) return 0;
    vector<long long> qs(T);
    long long max_n = 1;
    for (int i = 0; i < T; ++i) {
        cin >> qs[i];
        max_n = max(max_n, qs[i]);
    }
    DuSieve solver(max_n);
    for (long long n : qs) {
        cout << solver.sum_mu(n) << ' ' << solver.sum_phi(n) << '\\n';
    }
    return 0;
}`,
    rust: `use std::collections::HashMap;
use std::io::{self, Read};

const MOD: i64 = 998_244_353;
const INV2: i64 = 499_122_177;

struct DuSieve {
    limit: usize,
    pref_mu: Vec<i64>,
    pref_phi: Vec<i64>,
    memo_mu: HashMap<i64, i64>,
    memo_phi: HashMap<i64, i64>,
}

impl DuSieve {
    fn new(max_n: i64) -> Self {
        let approx = (max_n as f64).powf(2.0 / 3.0) as i64 + 16;
        let limit = approx.clamp(100, 1_500_000) as usize;
        let mut is_comp = vec![false; limit + 1];
        let mut primes = Vec::new();
        let mut mu = vec![0i64; limit + 1];
        let mut phi = vec![0i64; limit + 1];
        let mut pref_mu = vec![0i64; limit + 1];
        let mut pref_phi = vec![0i64; limit + 1];
        mu[1] = 1;
        phi[1] = 1;
        pref_mu[1] = 1;
        pref_phi[1] = 1;
        for i in 2..=limit {
            if !is_comp[i] {
                primes.push(i);
                mu[i] = -1;
                phi[i] = (i - 1) as i64;
            }
            for &p in &primes {
                let nx = i * p;
                if nx > limit {
                    break;
                }
                is_comp[nx] = true;
                if i % p == 0 {
                    mu[nx] = 0;
                    phi[nx] = phi[i] * p as i64;
                    break;
                } else {
                    mu[nx] = -mu[i];
                    phi[nx] = phi[i] * (p as i64 - 1);
                }
            }
            pref_mu[i] = pref_mu[i - 1] + mu[i];
            pref_phi[i] = (pref_phi[i - 1] + phi[i]) % MOD;
        }
        Self {
            limit,
            pref_mu,
            pref_phi,
            memo_mu: HashMap::new(),
            memo_phi: HashMap::new(),
        }
    }

    fn sum_mu(&mut self, n: i64) -> i64 {
        if n <= self.limit as i64 {
            return self.pref_mu[n as usize];
        }
        if let Some(&v) = self.memo_mu.get(&n) {
            return v;
        }
        let mut ans = 1i64;
        let mut l = 2i64;
        while l <= n {
            let q = n / l;
            let r = n / q;
            ans -= (r - l + 1) * self.sum_mu(q);
            l = r + 1;
        }
        self.memo_mu.insert(n, ans);
        ans
    }

    fn sum_phi(&mut self, n: i64) -> i64 {
        if n <= self.limit as i64 {
            return self.pref_phi[n as usize];
        }
        if let Some(&v) = self.memo_phi.get(&n) {
            return v;
        }
        let nmod = n % MOD;
        let mut ans = ((nmod * ((n + 1) % MOD)) % MOD) * INV2 % MOD;
        let mut l = 2i64;
        while l <= n {
            let q = n / l;
            let r = n / q;
            let len = (r - l + 1) % MOD;
            let sub = self.sum_phi(q);
            ans = (ans - len * sub).rem_euclid(MOD);
            l = r + 1;
        }
        self.memo_phi.insert(n, ans);
        ans
    }
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let t: usize = match it.next() {
        Some(v) => v.parse().unwrap(),
        None => return,
    };
    let mut qs = Vec::with_capacity(t);
    let mut max_n = 1i64;
    for _ in 0..t {
        let n: i64 = it.next().unwrap().parse().unwrap();
        max_n = max_n.max(n);
        qs.push(n);
    }
    let mut solver = DuSieve::new(max_n);
    let mut out = String::new();
    for n in qs {
        out.push_str(&format!("{} {}\\n", solver.sum_mu(n), solver.sum_phi(n)));
    }
    print!("{}", out);
}`,
    java21: `import java.io.BufferedInputStream;
import java.io.IOException;
import java.util.HashMap;

public class Main {
    static final long MOD = 998244353L;
    static final long INV2 = 499122177L;

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
            if (c == '-') {
                sign = -1;
                c = readByte();
            }
            long res = 0;
            while (c > 32) {
                res = res * 10 + (c - '0');
                c = readByte();
            }
            return res * sign;
        }
    }

    static class DuSieve {
        final int limit;
        final long[] prefMu;
        final long[] prefPhi;
        final HashMap<Long, Long> memoMu = new HashMap<>();
        final HashMap<Long, Long> memoPhi = new HashMap<>();

        DuSieve(long maxN) {
            long approx = (long) Math.pow((double) maxN, 2.0 / 3.0) + 16L;
            limit = (int) Math.min(1500000L, Math.max(100L, approx));
            boolean[] isComp = new boolean[limit + 1];
            int[] primes = new int[limit + 1];
            int pCnt = 0;
            int[] mu = new int[limit + 1];
            long[] phi = new long[limit + 1];
            prefMu = new long[limit + 1];
            prefPhi = new long[limit + 1];
            mu[1] = 1;
            phi[1] = 1;
            prefMu[1] = 1;
            prefPhi[1] = 1;
            for (int i = 2; i <= limit; i++) {
                if (!isComp[i]) {
                    primes[pCnt++] = i;
                    mu[i] = -1;
                    phi[i] = i - 1;
                }
                for (int j = 0; j < pCnt; j++) {
                    int p = primes[j];
                    long nx = 1L * i * p;
                    if (nx > limit) break;
                    int idx = (int) nx;
                    isComp[idx] = true;
                    if (i % p == 0) {
                        mu[idx] = 0;
                        phi[idx] = phi[i] * p;
                        break;
                    } else {
                        mu[idx] = -mu[i];
                        phi[idx] = phi[i] * (p - 1);
                    }
                }
                prefMu[i] = prefMu[i - 1] + mu[i];
                prefPhi[i] = (prefPhi[i - 1] + phi[i]) % MOD;
            }
        }

        long sumMu(long n) {
            if (n <= limit) return prefMu[(int) n];
            Long cached = memoMu.get(n);
            if (cached != null) return cached;
            long ans = 1;
            for (long l = 2, r; l <= n; l = r + 1) {
                long q = n / l;
                r = n / q;
                ans -= (r - l + 1) * sumMu(q);
            }
            memoMu.put(n, ans);
            return ans;
        }

        long sumPhi(long n) {
            if (n <= limit) return prefPhi[(int) n];
            Long cached = memoPhi.get(n);
            if (cached != null) return cached;
            long nmod = n % MOD;
            long ans = ((nmod * ((n + 1) % MOD)) % MOD) * INV2 % MOD;
            for (long l = 2, r; l <= n; l = r + 1) {
                long q = n / l;
                r = n / q;
                long len = (r - l + 1) % MOD;
                ans = (ans - len * sumPhi(q)) % MOD;
                if (ans < 0) ans += MOD;
            }
            memoPhi.put(n, ans);
            return ans;
        }
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        int t = (int) fs.nextLong();
        if (t == 0) return;
        long[] qs = new long[t];
        long maxN = 1;
        for (int i = 0; i < t; i++) {
            qs[i] = fs.nextLong();
            if (qs[i] > maxN) maxN = qs[i];
        }
        DuSieve solver = new DuSieve(maxN);
        StringBuilder sb = new StringBuilder();
        for (long n : qs) {
            sb.append(solver.sumMu(n)).append(' ').append(solver.sumPhi(n)).append('\\n');
        }
        System.out.print(sb.toString());
    }
}`,
    python3: `import sys

sys.setrecursionlimit(200000)

MOD = 998244353
INV2 = 499122177


class DuSieve:
    def __init__(self, max_n: int) -> None:
        approx = int(max_n ** (2.0 / 3.0)) + 16
        self.limit = min(1_000_000, max(100, approx))
        lim = self.limit
        is_comp = bytearray(lim + 1)
        primes = []
        mu = [0] * (lim + 1)
        phi = [0] * (lim + 1)
        mu[1] = 1
        phi[1] = 1
        for i in range(2, lim + 1):
            if not is_comp[i]:
                primes.append(i)
                mu[i] = -1
                phi[i] = i - 1
            for p in primes:
                nx = i * p
                if nx > lim:
                    break
                is_comp[nx] = 1
                if i % p == 0:
                    mu[nx] = 0
                    phi[nx] = phi[i] * p
                    break
                else:
                    mu[nx] = -mu[i]
                    phi[nx] = phi[i] * (p - 1)
        self.pref_mu = [0] * (lim + 1)
        self.pref_phi = [0] * (lim + 1)
        sm = 0
        sp = 0
        for i in range(1, lim + 1):
            sm += mu[i]
            sp = (sp + phi[i]) % MOD
            self.pref_mu[i] = sm
            self.pref_phi[i] = sp
        self.memo_mu = {}
        self.memo_phi = {}

    def sum_mu(self, n: int) -> int:
        if n <= self.limit:
            return self.pref_mu[n]
        if n in self.memo_mu:
            return self.memo_mu[n]
        ans = 1
        l = 2
        while l <= n:
            q = n // l
            r = n // q
            ans -= (r - l + 1) * self.sum_mu(q)
            l = r + 1
        self.memo_mu[n] = ans
        return ans

    def sum_phi(self, n: int) -> int:
        if n <= self.limit:
            return self.pref_phi[n]
        if n in self.memo_phi:
            return self.memo_phi[n]
        ans = ((n % MOD) * ((n + 1) % MOD) % MOD) * INV2 % MOD
        l = 2
        while l <= n:
            q = n // l
            r = n // q
            ans = (ans - ((r - l + 1) % MOD) * self.sum_phi(q)) % MOD
            l = r + 1
        self.memo_phi[n] = ans
        return ans


def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    t = int(data[0])
    qs = [int(x) for x in data[1 : 1 + t]]
    solver = DuSieve(max(qs, default=1))
    out = [f"{solver.sum_mu(n)} {solver.sum_phi(n)}" for n in qs]
    sys.stdout.write("\\n".join(out) + "\\n")


if __name__ == "__main__":
    solve()`,
    ruby: `MOD = 998_244_353
INV2 = 499_122_177

class DuSieve
  def initialize(max_n)
    approx = (max_n**(2.0 / 3.0)).to_i + 16
    @limit = [[approx, 100].max, 1_000_000].min
    is_comp = Array.new(@limit + 1, false)
    primes = []
    mu = Array.new(@limit + 1, 0)
    phi = Array.new(@limit + 1, 0)
    mu[1] = 1
    phi[1] = 1
    (2..@limit).each do |i|
      unless is_comp[i]
        primes << i
        mu[i] = -1
        phi[i] = i - 1
      end
      primes.each do |p|
        nx = i * p
        break if nx > @limit
        is_comp[nx] = true
        if i % p == 0
          mu[nx] = 0
          phi[nx] = phi[i] * p
          break
        else
          mu[nx] = -mu[i]
          phi[nx] = phi[i] * (p - 1)
        end
      end
    end
    @pref_mu = Array.new(@limit + 1, 0)
    @pref_phi = Array.new(@limit + 1, 0)
    sm = 0
    sp = 0
    (1..@limit).each do |i|
      sm += mu[i]
      sp = (sp + phi[i]) % MOD
      @pref_mu[i] = sm
      @pref_phi[i] = sp
    end
    @memo_mu = {}
    @memo_phi = {}
  end

  def sum_mu(n)
    return @pref_mu[n] if n <= @limit
    return @memo_mu[n] if @memo_mu.key?(n)

    ans = 1
    l = 2
    while l <= n
      q = n / l
      r = n / q
      ans -= (r - l + 1) * sum_mu(q)
      l = r + 1
    end
    @memo_mu[n] = ans
  end

  def sum_phi(n)
    return @pref_phi[n] if n <= @limit
    return @memo_phi[n] if @memo_phi.key?(n)

    ans = (((n % MOD) * ((n + 1) % MOD)) % MOD) * INV2 % MOD
    l = 2
    while l <= n
      q = n / l
      r = n / q
      ans = (ans - ((r - l + 1) % MOD) * sum_phi(q)) % MOD
      l = r + 1
    end
    @memo_phi[n] = ans
  end
end

data = STDIN.read.split
exit if data.empty?
t = data[0].to_i
qs = data[1, t].map(&:to_i)
solver = DuSieve.new(qs.max || 1)
out = qs.map { |n| "#{solver.sum_mu(n)} #{solver.sum_phi(n)}" }
puts out.join("\\n")`,
  },
  practiceProblems: [
    {
      id: 'ch76-p1',
      tier: 'Warmup',
      ratingRange: '2500–2800',
      title: 'Sublinear Prefix Sums of Mobius mu and Euler phi',
      statement:
        'Given T queries (1 <= T <= 10), each providing an integer N (1 <= N <= 10^10), output S_mu(N) = sum_{i=1..N} mu(i) as a signed 64-bit integer and S_phi(N) = (sum_{i=1..N} phi(i)) mod 998244353 for each query.',
      constraints: '1 <= T <= 10; 1 <= N <= 10^10; Time Limit: 1.5s',
      sampleInput: '2\n10\n12',
      sampleOutput: '-1 32\n-2 46',
      hints: [
        'Use Dirichlet convolutions (mu * 1)(n) = [n == 1] and (phi * 1)(n) = n to express S(n) via recursive floor-quotient blocks.',
        'Precompute mu and phi prefix sums with a linear sieve up to limit = min(1500000, max(100, N^(2/3))) and share memo maps across queries.',
      ],
      solutions: {
        cpp20: `#include <algorithm>
#include <cmath>
#include <iostream>
#include <unordered_map>
#include <vector>

using namespace std;

static constexpr long long MOD = 998244353LL;
static constexpr long long INV2 = 499122177LL;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int T;
    if (!(cin >> T)) return 0;
    vector<long long> qs(T);
    long long max_n = 1;
    for (int i = 0; i < T; ++i) {
        cin >> qs[i];
        max_n = max(max_n, qs[i]);
    }
    int limit = (int)min<long long>(1500000LL, max<long long>(100LL, (long long)pow((long double)max_n, 2.0L / 3.0L) + 16LL));
    vector<bool> comp(limit + 1, false);
    vector<int> primes, mu(limit + 1, 0), phi(limit + 1, 0);
    vector<long long> pmu(limit + 1, 0), pphi(limit + 1, 0);
    mu[1] = phi[1] = 1;
    pmu[1] = pphi[1] = 1;
    for (int i = 2; i <= limit; ++i) {
        if (!comp[i]) {
            primes.push_back(i);
            mu[i] = -1;
            phi[i] = i - 1;
        }
        for (int p : primes) {
            long long nx = 1LL * i * p;
            if (nx > limit) break;
            comp[nx] = true;
            if (i % p == 0) {
                mu[nx] = 0;
                phi[nx] = phi[i] * p;
                break;
            } else {
                mu[nx] = -mu[i];
                phi[nx] = phi[i] * (p - 1);
            }
        }
        pmu[i] = pmu[i - 1] + mu[i];
        pphi[i] = (pphi[i - 1] + phi[i]) % MOD;
    }

    unordered_map<long long, long long> mmu, mphi;
    auto solve_mu = [&](auto& self, long long n) -> long long {
        if (n <= limit) return pmu[n];
        auto it = mmu.find(n);
        if (it != mmu.end()) return it->second;
        long long res = 1;
        for (long long l = 2, r; l <= n; l = r + 1) {
            long long q = n / l;
            r = n / q;
            res -= (r - l + 1) * self(self, q);
        }
        return mmu[n] = res;
    };
    auto solve_phi = [&](auto& self, long long n) -> long long {
        if (n <= limit) return pphi[n];
        auto it = mphi.find(n);
        if (it != mphi.end()) return it->second;
        long long res = ((n % MOD) * ((n + 1) % MOD)) % MOD * INV2 % MOD;
        for (long long l = 2, r; l <= n; l = r + 1) {
            long long q = n / l;
            r = n / q;
            res = (res - ((r - l + 1) % MOD) * self(self, q)) % MOD;
            if (res < 0) res += MOD;
        }
        return mphi[n] = res;
    };

    for (long long n : qs) {
        cout << solve_mu(solve_mu, n) << ' ' << solve_phi(solve_phi, n) << '\\n';
    }
    return 0;
}`,
        rust: `use std::collections::HashMap;
use std::io::{self, Read};

const MOD: i64 = 998_244_353;
const INV2: i64 = 499_122_177;

struct Sieve {
    limit: usize,
    pmu: Vec<i64>,
    pphi: Vec<i64>,
    mmu: HashMap<i64, i64>,
    mphi: HashMap<i64, i64>,
}

impl Sieve {
    fn new(max_n: i64) -> Self {
        let limit = ((max_n as f64).powf(2.0 / 3.0) as i64 + 16).clamp(100, 1_500_000) as usize;
        let mut comp = vec![false; limit + 1];
        let mut primes = Vec::new();
        let mut mu = vec![0i64; limit + 1];
        let mut phi = vec![0i64; limit + 1];
        let mut pmu = vec![0i64; limit + 1];
        let mut pphi = vec![0i64; limit + 1];
        mu[1] = 1;
        phi[1] = 1;
        pmu[1] = 1;
        pphi[1] = 1;
        for i in 2..=limit {
            if !comp[i] {
                primes.push(i);
                mu[i] = -1;
                phi[i] = (i - 1) as i64;
            }
            for &p in &primes {
                let nx = i * p;
                if nx > limit { break; }
                comp[nx] = true;
                if i % p == 0 {
                    mu[nx] = 0;
                    phi[nx] = phi[i] * p as i64;
                    break;
                } else {
                    mu[nx] = -mu[i];
                    phi[nx] = phi[i] * (p as i64 - 1);
                }
            }
            pmu[i] = pmu[i - 1] + mu[i];
            pphi[i] = (pphi[i - 1] + phi[i]) % MOD;
        }
        Self { limit, pmu, pphi, mmu: HashMap::new(), mphi: HashMap::new() }
    }

    fn mu_sum(&mut self, n: i64) -> i64 {
        if n <= self.limit as i64 { return self.pmu[n as usize]; }
        if let Some(&v) = self.mmu.get(&n) { return v; }
        let mut ans = 1i64;
        let mut l = 2i64;
        while l <= n {
            let q = n / l;
            let r = n / q;
            ans -= (r - l + 1) * self.mu_sum(q);
            l = r + 1;
        }
        self.mmu.insert(n, ans);
        ans
    }

    fn phi_sum(&mut self, n: i64) -> i64 {
        if n <= self.limit as i64 { return self.pphi[n as usize]; }
        if let Some(&v) = self.mphi.get(&n) { return v; }
        let mut ans = ((n % MOD) * ((n + 1) % MOD) % MOD) * INV2 % MOD;
        let mut l = 2i64;
        while l <= n {
            let q = n / l;
            let r = n / q;
            let sub = self.phi_sum(q);
            ans = (ans - ((r - l + 1) % MOD) * sub).rem_euclid(MOD);
            l = r + 1;
        }
        self.mphi.insert(n, ans);
        ans
    }
}

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let mut it = s.split_whitespace();
    let t: usize = match it.next() { Some(v) => v.parse().unwrap(), None => return };
    let qs: Vec<i64> = (0..t).map(|_| it.next().unwrap().parse().unwrap()).collect();
    let mut sv = Sieve::new(*qs.iter().max().unwrap_or(&1));
    let mut out = String::new();
    for n in qs {
        out.push_str(&format!("{} {}\\n", sv.mu_sum(n), sv.phi_sum(n)));
    }
    print!("{}", out);
}`,
        java21: `import java.io.BufferedInputStream;
import java.io.IOException;
import java.util.HashMap;

public class Main {
    static final long MOD = 998244353L;
    static final long INV2 = 499122177L;

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
            long res = 0;
            while (c > 32) {
                res = res * 10 + (c - '0');
                c = readByte();
            }
            return res;
        }
    }

    static int limit;
    static long[] pmu, pphi;
    static final HashMap<Long, Long> mmu = new HashMap<>();
    static final HashMap<Long, Long> mphi = new HashMap<>();

    static long sumMu(long n) {
        if (n <= limit) return pmu[(int) n];
        Long v = mmu.get(n);
        if (v != null) return v;
        long ans = 1;
        for (long l = 2, r; l <= n; l = r + 1) {
            long q = n / l;
            r = n / q;
            ans -= (r - l + 1) * sumMu(q);
        }
        mmu.put(n, ans);
        return ans;
    }

    static long sumPhi(long n) {
        if (n <= limit) return pphi[(int) n];
        Long v = mphi.get(n);
        if (v != null) return v;
        long ans = ((n % MOD) * ((n + 1) % MOD) % MOD) * INV2 % MOD;
        for (long l = 2, r; l <= n; l = r + 1) {
            long q = n / l;
            r = n / q;
            ans = (ans - ((r - l + 1) % MOD) * sumPhi(q)) % MOD;
            if (ans < 0) ans += MOD;
        }
        mphi.put(n, ans);
        return ans;
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        int t = (int) fs.nextLong();
        if (t == 0) return;
        long[] qs = new long[t];
        long mx = 1;
        for (int i = 0; i < t; i++) {
            qs[i] = fs.nextLong();
            if (qs[i] > mx) mx = qs[i];
        }
        limit = (int) Math.min(1500000L, Math.max(100L, (long) Math.pow((double) mx, 2.0 / 3.0) + 16L));
        boolean[] comp = new boolean[limit + 1];
        int[] primes = new int[limit + 1];
        int pc = 0;
        int[] mu = new int[limit + 1];
        long[] phi = new long[limit + 1];
        pmu = new long[limit + 1];
        pphi = new long[limit + 1];
        mu[1] = 1; phi[1] = 1; pmu[1] = 1; pphi[1] = 1;
        for (int i = 2; i <= limit; i++) {
            if (!comp[i]) {
                primes[pc++] = i;
                mu[i] = -1;
                phi[i] = i - 1;
            }
            for (int j = 0; j < pc; j++) {
                int p = primes[j];
                long nx = 1L * i * p;
                if (nx > limit) break;
                int id = (int) nx;
                comp[id] = true;
                if (i % p == 0) {
                    mu[id] = 0;
                    phi[id] = phi[i] * p;
                    break;
                } else {
                    mu[id] = -mu[i];
                    phi[id] = phi[i] * (p - 1);
                }
            }
            pmu[i] = pmu[i - 1] + mu[i];
            pphi[i] = (pphi[i - 1] + phi[i]) % MOD;
        }
        StringBuilder sb = new StringBuilder();
        for (long n : qs) sb.append(sumMu(n)).append(' ').append(sumPhi(n)).append('\\n');
        System.out.print(sb.toString());
    }
}`,
        python3: `import sys

sys.setrecursionlimit(200000)
MOD = 998244353
INV2 = 499122177


def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    t = int(data[0])
    qs = [int(x) for x in data[1 : 1 + t]]
    mx = max(qs, default=1)
    lim = min(1_000_000, max(100, int(mx ** (2.0 / 3.0)) + 16))
    comp = bytearray(lim + 1)
    primes = []
    mu = [0] * (lim + 1)
    phi = [0] * (lim + 1)
    mu[1] = phi[1] = 1
    for i in range(2, lim + 1):
        if not comp[i]:
            primes.append(i)
            mu[i] = -1
            phi[i] = i - 1
        for p in primes:
            nx = i * p
            if nx > lim:
                break
            comp[nx] = 1
            if i % p == 0:
                mu[nx] = 0
                phi[nx] = phi[i] * p
                break
            else:
                mu[nx] = -mu[i]
                phi[nx] = phi[i] * (p - 1)
    pmu = [0] * (lim + 1)
    pphi = [0] * (lim + 1)
    sm = sp = 0
    for i in range(1, lim + 1):
        sm += mu[i]
        sp = (sp + phi[i]) % MOD
        pmu[i] = sm
        pphi[i] = sp
    mmu, mphi = {}, {}

    def s_mu(n: int) -> int:
        if n <= lim:
            return pmu[n]
        if n in mmu:
            return mmu[n]
        ans = 1
        l = 2
        while l <= n:
            q = n // l
            r = n // q
            ans -= (r - l + 1) * s_mu(q)
            l = r + 1
        mmu[n] = ans
        return ans

    def s_phi(n: int) -> int:
        if n <= lim:
            return pphi[n]
        if n in mphi:
            return mphi[n]
        ans = ((n % MOD) * ((n + 1) % MOD) % MOD) * INV2 % MOD
        l = 2
        while l <= n:
            q = n // l
            r = n // q
            ans = (ans - ((r - l + 1) % MOD) * s_phi(q)) % MOD
            l = r + 1
        mphi[n] = ans
        return ans

    sys.stdout.write("\\n".join(f"{s_mu(n)} {s_phi(n)}" for n in qs) + "\\n")


if __name__ == "__main__":
    solve()`,
        ruby: `MOD = 998_244_353
INV2 = 499_122_177

data = STDIN.read.split
exit if data.empty?
t = data[0].to_i
qs = data[1, t].map(&:to_i)
mx = qs.max || 1
lim = [[(mx**(2.0 / 3.0)).to_i + 16, 100].max, 1_000_000].min
comp = Array.new(lim + 1, false)
primes = []
mu = Array.new(lim + 1, 0)
phi = Array.new(lim + 1, 0)
mu[1] = phi[1] = 1
(2..lim).each do |i|
  unless comp[i]
    primes << i
    mu[i] = -1
    phi[i] = i - 1
  end
  primes.each do |p|
    nx = i * p
    break if nx > lim
    comp[nx] = true
    if i % p == 0
      mu[nx] = 0
      phi[nx] = phi[i] * p
      break
    else
      mu[nx] = -mu[i]
      phi[nx] = phi[i] * (p - 1)
    end
  end
end
pmu = Array.new(lim + 1, 0)
pphi = Array.new(lim + 1, 0)
sm = sp = 0
(1..lim).each do |i|
  sm += mu[i]
  sp = (sp + phi[i]) % MOD
  pmu[i] = sm
  pphi[i] = sp
end
mmu = {}
mphi = {}

s_mu = lambda do |n|
  return pmu[n] if n <= lim
  return mmu[n] if mmu.key?(n)

  ans = 1
  l = 2
  while l <= n
    q = n / l
    r = n / q
    ans -= (r - l + 1) * s_mu.call(q)
    l = r + 1
  end
  mmu[n] = ans
end

s_phi = lambda do |n|
  return pphi[n] if n <= lim
  return mphi[n] if mphi.key?(n)

  ans = (((n % MOD) * ((n + 1) % MOD)) % MOD) * INV2 % MOD
  l = 2
  while l <= n
    q = n / l
    r = n / q
    ans = (ans - ((r - l + 1) % MOD) * s_phi.call(q)) % MOD
    l = r + 1
  end
  mphi[n] = ans
end

puts qs.map { |n| "#{s_mu.call(n)} #{s_phi.call(n)}" }.join("\\n")`,
      },
    },
    {
      id: 'ch76-p2',
      tier: 'Standard',
      ratingRange: '2700–3000',
      title: 'All-Pairs GCD Sum via Hyperbola Grouping & Du Sieve',
      statement:
        'Given an integer N (1 <= N <= 10^10), compute sum_{i=1..N} sum_{j=1..N} gcd(i, j) modulo 998244353.',
      constraints: '1 <= N <= 10^10; Time Limit: 1.5s',
      sampleInput: '4',
      sampleOutput: '24',
      hints: [
        'Use the identity n = sum_{d | n} phi(d) with n = gcd(i, j): the sum becomes sum_{d=1..N} phi(d) * floor(N / d)^2.',
        'Sweep over floor(N / d) quotient blocks [l, r] and weight each block by (S_phi(r) - S_phi(l - 1)) * (N / l)^2 mod 998244353 using Du’s Sieve.',
      ],
      solutions: {
        cpp20: `#include <algorithm>
#include <cmath>
#include <iostream>
#include <unordered_map>
#include <vector>

using namespace std;

static constexpr long long MOD = 998244353LL;
static constexpr long long INV2 = 499122177LL;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    long long n;
    if (!(cin >> n)) return 0;

    int limit = (int)min<long long>(1500000LL, max<long long>(100LL, (long long)pow((long double)n, 2.0L / 3.0L) + 16LL));
    vector<bool> comp(limit + 1, false);
    vector<int> primes, phi(limit + 1, 0);
    vector<long long> pphi(limit + 1, 0);
    phi[1] = 1;
    pphi[1] = 1;
    for (int i = 2; i <= limit; ++i) {
        if (!comp[i]) {
            primes.push_back(i);
            phi[i] = i - 1;
        }
        for (int p : primes) {
            long long nx = 1LL * i * p;
            if (nx > limit) break;
            comp[nx] = true;
            if (i % p == 0) {
                phi[nx] = phi[i] * p;
                break;
            } else {
                phi[nx] = phi[i] * (p - 1);
            }
        }
        pphi[i] = (pphi[i - 1] + phi[i]) % MOD;
    }

    unordered_map<long long, long long> mphi;
    auto sum_phi = [&](auto& self, long long x) -> long long {
        if (x <= limit) return pphi[x];
        auto it = mphi.find(x);
        if (it != mphi.end()) return it->second;
        long long res = ((x % MOD) * ((x + 1) % MOD)) % MOD * INV2 % MOD;
        for (long long l = 2, r; l <= x; l = r + 1) {
            long long q = x / l;
            r = x / q;
            res = (res - ((r - l + 1) % MOD) * self(self, q)) % MOD;
            if (res < 0) res += MOD;
        }
        return mphi[x] = res;
    };

    long long ans = 0;
    long long prev = 0;
    for (long long l = 1, r; l <= n; l = r + 1) {
        long long q = n / l;
        r = n / q;
        long long cur = sum_phi(sum_phi, r);
        long long diff = (cur - prev + MOD) % MOD;
        long long qm = q % MOD;
        long long q2 = (qm * qm) % MOD;
        ans = (ans + diff * q2) % MOD;
        prev = cur;
    }
    cout << ans << '\\n';
    return 0;
}`,
        rust: `use std::collections::HashMap;
use std::io::{self, Read};

const MOD: i64 = 998_244_353;
const INV2: i64 = 499_122_177;

struct PhiSieve {
    limit: usize,
    pphi: Vec<i64>,
    memo: HashMap<i64, i64>,
}

impl PhiSieve {
    fn new(n: i64) -> Self {
        let limit = ((n as f64).powf(2.0 / 3.0) as i64 + 16).clamp(100, 1_500_000) as usize;
        let mut comp = vec![false; limit + 1];
        let mut primes = Vec::new();
        let mut phi = vec![0i64; limit + 1];
        let mut pphi = vec![0i64; limit + 1];
        phi[1] = 1;
        pphi[1] = 1;
        for i in 2..=limit {
            if !comp[i] {
                primes.push(i);
                phi[i] = (i - 1) as i64;
            }
            for &p in &primes {
                let nx = i * p;
                if nx > limit { break; }
                comp[nx] = true;
                if i % p == 0 {
                    phi[nx] = phi[i] * p as i64;
                    break;
                } else {
                    phi[nx] = phi[i] * (p as i64 - 1);
                }
            }
            pphi[i] = (pphi[i - 1] + phi[i]) % MOD;
        }
        Self { limit, pphi, memo: HashMap::new() }
    }

    fn sum_phi(&mut self, x: i64) -> i64 {
        if x <= self.limit as i64 {
            return self.pphi[x as usize];
        }
        if let Some(&v) = self.memo.get(&x) {
            return v;
        }
        let mut res = ((x % MOD) * ((x + 1) % MOD) % MOD) * INV2 % MOD;
        let mut l = 2i64;
        while l <= x {
            let q = x / l;
            let r = x / q;
            let sub = self.sum_phi(q);
            res = (res - ((r - l + 1) % MOD) * sub).rem_euclid(MOD);
            l = r + 1;
        }
        self.memo.insert(x, res);
        res
    }
}

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let n: i64 = match s.split_whitespace().next() { Some(v) => v.parse().unwrap(), None => return };
    let mut sv = PhiSieve::new(n);
    let mut ans = 0i64;
    let mut prev = 0i64;
    let mut l = 1i64;
    while l <= n {
        let q = n / l;
        let r = n / q;
        let cur = sv.sum_phi(r);
        let diff = (cur - prev).rem_euclid(MOD);
        let qm = q % MOD;
        let q2 = (qm * qm) % MOD;
        ans = (ans + diff * q2) % MOD;
        prev = cur;
        l = r + 1;
    }
    println!("{}", ans);
}`,
        java21: `import java.io.BufferedInputStream;
import java.io.IOException;
import java.util.HashMap;

public class Main {
    static final long MOD = 998244353L;
    static final long INV2 = 499122177L;

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
            long res = 0;
            while (c > 32) {
                res = res * 10 + (c - '0');
                c = readByte();
            }
            return res;
        }
    }

    static int limit;
    static long[] pphi;
    static final HashMap<Long, Long> mphi = new HashMap<>();

    static long sumPhi(long x) {
        if (x <= limit) return pphi[(int) x];
        Long v = mphi.get(x);
        if (v != null) return v;
        long res = ((x % MOD) * ((x + 1) % MOD) % MOD) * INV2 % MOD;
        for (long l = 2, r; l <= x; l = r + 1) {
            long q = x / l;
            r = x / q;
            res = (res - ((r - l + 1) % MOD) * sumPhi(q)) % MOD;
            if (res < 0) res += MOD;
        }
        mphi.put(x, res);
        return res;
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        long n = fs.nextLong();
        if (n == 0) return;
        limit = (int) Math.min(1500000L, Math.max(100L, (long) Math.pow((double) n, 2.0 / 3.0) + 16L));
        boolean[] comp = new boolean[limit + 1];
        int[] primes = new int[limit + 1];
        int pc = 0;
        long[] phi = new long[limit + 1];
        pphi = new long[limit + 1];
        phi[1] = 1;
        pphi[1] = 1;
        for (int i = 2; i <= limit; i++) {
            if (!comp[i]) {
                primes[pc++] = i;
                phi[i] = i - 1;
            }
            for (int j = 0; j < pc; j++) {
                int p = primes[j];
                long nx = 1L * i * p;
                if (nx > limit) break;
                int id = (int) nx;
                comp[id] = true;
                if (i % p == 0) {
                    phi[id] = phi[i] * p;
                    break;
                } else {
                    phi[id] = phi[i] * (p - 1);
                }
            }
            pphi[i] = (pphi[i - 1] + phi[i]) % MOD;
        }
        long ans = 0, prev = 0;
        for (long l = 1, r; l <= n; l = r + 1) {
            long q = n / l;
            r = n / q;
            long cur = sumPhi(r);
            long diff = (cur - prev + MOD) % MOD;
            long qm = q % MOD;
            ans = (ans + diff * ((qm * qm) % MOD)) % MOD;
            prev = cur;
        }
        System.out.println(ans);
    }
}`,
        python3: `import sys

sys.setrecursionlimit(200000)
MOD = 998244353
INV2 = 499122177


def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    lim = min(1_000_000, max(100, int(n ** (2.0 / 3.0)) + 16))
    comp = bytearray(lim + 1)
    primes = []
    phi = [0] * (lim + 1)
    phi[1] = 1
    for i in range(2, lim + 1):
        if not comp[i]:
            primes.append(i)
            phi[i] = i - 1
        for p in primes:
            nx = i * p
            if nx > lim:
                break
            comp[nx] = 1
            if i % p == 0:
                phi[nx] = phi[i] * p
                break
            else:
                phi[nx] = phi[i] * (p - 1)
    pphi = [0] * (lim + 1)
    sp = 0
    for i in range(1, lim + 1):
        sp = (sp + phi[i]) % MOD
        pphi[i] = sp
    memo = {}

    def sum_phi(x: int) -> int:
        if x <= lim:
            return pphi[x]
        if x in memo:
            return memo[x]
        res = ((x % MOD) * ((x + 1) % MOD) % MOD) * INV2 % MOD
        l = 2
        while l <= x:
            q = x // l
            r = x // q
            res = (res - ((r - l + 1) % MOD) * sum_phi(q)) % MOD
            l = r + 1
        memo[x] = res
        return res

    ans = 0
    prev = 0
    l = 1
    while l <= n:
        q = n // l
        r = n // q
        cur = sum_phi(r)
        diff = (cur - prev) % MOD
        qm = q % MOD
        ans = (ans + diff * (qm * qm % MOD)) % MOD
        prev = cur
        l = r + 1
    sys.stdout.write(f"{ans}\\n")


if __name__ == "__main__":
    solve()`,
        ruby: `MOD = 998_244_353
INV2 = 499_122_177

data = STDIN.read.split
exit if data.empty?
n = data[0].to_i
lim = [[(n**(2.0 / 3.0)).to_i + 16, 100].max, 1_000_000].min
comp = Array.new(lim + 1, false)
primes = []
phi = Array.new(lim + 1, 0)
phi[1] = 1
(2..lim).each do |i|
  unless comp[i]
    primes << i
    phi[i] = i - 1
  end
  primes.each do |p|
    nx = i * p
    break if nx > lim
    comp[nx] = true
    if i % p == 0
      phi[nx] = phi[i] * p
      break
    else
      phi[nx] = phi[i] * (p - 1)
    end
  end
end
pphi = Array.new(lim + 1, 0)
sp = 0
(1..lim).each do |i|
  sp = (sp + phi[i]) % MOD
  pphi[i] = sp
end
memo = {}

sum_phi = lambda do |x|
  return pphi[x] if x <= lim
  return memo[x] if memo.key?(x)

  res = (((x % MOD) * ((x + 1) % MOD)) % MOD) * INV2 % MOD
  l = 2
  while l <= x
    q = x / l
    r = x / q
    res = (res - ((r - l + 1) % MOD) * sum_phi.call(q)) % MOD
    l = r + 1
  end
  memo[x] = res
end

ans = 0
prev = 0
l = 1
while l <= n
  q = n / l
  r = n / q
  cur = sum_phi.call(r)
  diff = (cur - prev) % MOD
  qm = q % MOD
  ans = (ans + diff * ((qm * qm) % MOD)) % MOD
  prev = cur
  l = r + 1
end
puts ans`,
      },
    },
    {
      id: 'ch76-p3',
      tier: 'Boss',
      ratingRange: '2900–3300+',
      title: 'Min_25 Sieve for Multiplicative Prefix Sums',
      statement:
        'Let f(n) be a multiplicative arithmetic function satisfying f(1) = 1 and f(p^e) = p^e (p^e - 1) for every prime p and exponent e >= 1. Given N (1 <= N <= 10^10), compute sum_{i=1..N} f(i) modulo 998244353.',
      constraints: '1 <= N <= 10^10; Time Limit: 2.0s',
      sampleInput: '6',
      sampleOutput: '53',
      hints: [
        'Decompose f(p) = p^2 - p into two completely multiplicative basis terms h2(n) = n^2 and h1(n) = n.',
        'Sieve prime prefix sums g1 and g2 across all distinct floor quotients floor(N / i) up to sqrt(N), then evaluate S(x, j) recursively across prime powers p^e.',
      ],
      solutions: {
        cpp20: `#include <cmath>
#include <iostream>
#include <vector>

using namespace std;

static constexpr long long MOD = 998244353LL;
static constexpr long long INV2 = 499122177LL;
static constexpr long long INV6 = 166374059LL;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    long long n;
    if (!(cin >> n)) return 0;

    long long sq = (long long)sqrt((long double)n);
    while ((sq + 1) * (sq + 1) <= n) ++sq;
    while (sq * sq > n) --sq;

    vector<bool> comp(sq + 1, false);
    vector<int> primes;
    vector<long long> sp1(1, 0), sp2(1, 0);
    for (int i = 2; i <= sq; ++i) {
        if (!comp[i]) {
            primes.push_back(i);
            long long pm = i % MOD;
            sp1.push_back((sp1.back() + pm) % MOD);
            sp2.push_back((sp2.back() + pm * pm % MOD) % MOD);
        }
        for (int p : primes) {
            if (1LL * i * p > sq) break;
            comp[i * p] = true;
            if (i % p == 0) break;
        }
    }
    int P = (int)primes.size();

    vector<long long> w, g1, g2;
    vector<int> id1(sq + 1, 0), id2(sq + 1, 0);
    for (long long l = 1, r; l <= n; l = r + 1) {
        long long q = n / l;
        r = n / q;
        int m = (int)w.size();
        w.push_back(q);
        if (q <= sq) id1[q] = m;
        else id2[n / q] = m;
        long long qm = q % MOD;
        long long s1 = (qm * ((qm + 1) % MOD) % MOD * INV2 % MOD - 1 + MOD) % MOD;
        long long s2 = (qm * ((qm + 1) % MOD) % MOD * ((2 * qm + 1) % MOD) % MOD * INV6 % MOD - 1 + MOD) % MOD;
        g1.push_back(s1);
        g2.push_back(s2);
    }
    int m = (int)w.size();
    auto get_id = [&](long long x) -> int {
        return x <= sq ? id1[x] : id2[n / x];
    };

    for (int j = 0; j < P; ++j) {
        long long p = primes[j];
        long long p2 = p * p;
        long long pm = p % MOD;
        long long pm2 = pm * pm % MOD;
        for (int i = 0; i < m && w[i] >= p2; ++i) {
            int k = get_id(w[i] / p);
            g1[i] = (g1[i] - pm * ((g1[k] - sp1[j] + MOD) % MOD)) % MOD;
            if (g1[i] < 0) g1[i] += MOD;
            g2[i] = (g2[i] - pm2 * ((g2[k] - sp2[j] + MOD) % MOD)) % MOD;
            if (g2[i] < 0) g2[i] += MOD;
        }
    }

    auto dfs = [&](auto& self, long long x, int j) -> long long {
        if (x <= 1 || (j > 0 && x <= primes[j - 1]) || (j < P && x < primes[j])) return 0;
        int k = get_id(x);
        long long ret = ((g2[k] - g1[k]) - (sp2[j] - sp1[j])) % MOD;
        if (ret < 0) ret += MOD;
        for (int idx = j; idx < P && 1LL * primes[idx] * primes[idx] <= x; ++idx) {
            long long p = primes[idx];
            long long pe = p;
            while (pe <= x / p) {
                long long pm = pe % MOD;
                long long f1 = pm * ((pm - 1 + MOD) % MOD) % MOD;
                long long pe2 = pe * p;
                long long pm2 = pe2 % MOD;
                long long f2 = pm2 * ((pm2 - 1 + MOD) % MOD) % MOD;
                ret = (ret + f1 * self(self, x / pe, idx + 1) + f2) % MOD;
                pe = pe2;
            }
        }
        return ret;
    };

    cout << (1 + dfs(dfs, n, 0)) % MOD << '\\n';
    return 0;
}`,
        rust: `use std::io::{self, Read};

const MOD: i64 = 998_244_353;
const INV2: i64 = 499_122_177;
const INV6: i64 = 166_374_059;

struct Min25 {
    n: i64,
    sq: i64,
    primes: Vec<i64>,
    sp1: Vec<i64>,
    sp2: Vec<i64>,
    g1: Vec<i64>,
    g2: Vec<i64>,
    id1: Vec<usize>,
    id2: Vec<usize>,
}

impl Min25 {
    fn new(n: i64) -> Self {
        let mut sq = (n as f64).sqrt() as i64;
        while (sq + 1) * (sq + 1) <= n { sq += 1; }
        while sq * sq > n { sq -= 1; }

        let sq_u = sq as usize;
        let mut comp = vec![false; sq_u + 1];
        let mut primes = Vec::new();
        let mut sp1 = vec![0i64];
        let mut sp2 = vec![0i64];
        for i in 2..=sq_u {
            if !comp[i] {
                primes.push(i as i64);
                let pm = (i as i64) % MOD;
                sp1.push((*sp1.last().unwrap() + pm) % MOD);
                sp2.push((*sp2.last().unwrap() + pm * pm % MOD) % MOD);
            }
            for &p in &primes {
                let nx = i * p as usize;
                if nx > sq_u { break; }
                comp[nx] = true;
                if i % p as usize == 0 { break; }
            }
        }

        let mut w = Vec::new();
        let mut g1 = Vec::new();
        let mut g2 = Vec::new();
        let mut id1 = vec![0usize; sq_u + 1];
        let mut id2 = vec![0usize; sq_u + 1];
        let mut l = 1i64;
        while l <= n {
            let q = n / l;
            let r = n / q;
            let m = w.len();
            w.push(q);
            if q <= sq { id1[q as usize] = m; } else { id2[(n / q) as usize] = m; }
            let qm = q % MOD;
            let s1 = ((qm * ((qm + 1) % MOD) % MOD) * INV2 % MOD - 1).rem_euclid(MOD);
            let s2 = (((qm * ((qm + 1) % MOD) % MOD) * ((2 * qm + 1) % MOD) % MOD) * INV6 % MOD - 1).rem_euclid(MOD);
            g1.push(s1);
            g2.push(s2);
            l = r + 1;
        }

        let p_cnt = primes.len();
        let m = w.len();
        for j in 0..p_cnt {
            let p = primes[j];
            let p2 = p * p;
            let pm = p % MOD;
            let pm2 = pm * pm % MOD;
            for i in 0..m {
                if w[i] < p2 { break; }
                let x = w[i] / p;
                let k = if x <= sq { id1[x as usize] } else { id2[(n / x) as usize] };
                g1[i] = (g1[i] - pm * (g1[k] - sp1[j]).rem_euclid(MOD)).rem_euclid(MOD);
                g2[i] = (g2[i] - pm2 * (g2[k] - sp2[j]).rem_euclid(MOD)).rem_euclid(MOD);
            }
        }

        Self { n, sq, primes, sp1, sp2, g1, g2, id1, id2 }
    }

    fn get_id(&self, x: i64) -> usize {
        if x <= self.sq { self.id1[x as usize] } else { self.id2[(self.n / x) as usize] }
    }

    fn dfs(&self, x: i64, j: usize) -> i64 {
        let p_cnt = self.primes.len();
        if x <= 1 || (j > 0 && x <= self.primes[j - 1]) || (j < p_cnt && x < self.primes[j]) {
            return 0;
        }
        let k = self.get_id(x);
        let mut ret = ((self.g2[k] - self.g1[k]) - (self.sp2[j] - self.sp1[j])).rem_euclid(MOD);
        for idx in j..p_cnt {
            let p = self.primes[idx];
            if p * p > x { break; }
            let mut pe = p;
            while pe <= x / p {
                let pm = pe % MOD;
                let f1 = pm * (pm - 1).rem_euclid(MOD) % MOD;
                let pe2 = pe * p;
                let pm2 = pe2 % MOD;
                let f2 = pm2 * (pm2 - 1).rem_euclid(MOD) % MOD;
                ret = (ret + f1 * self.dfs(x / pe, idx + 1) + f2) % MOD;
                pe = pe2;
            }
        }
        ret
    }
}

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let n: i64 = match s.split_whitespace().next() { Some(v) => v.parse().unwrap(), None => return };
    let solver = Min25::new(n);
    println!("{}", (1 + solver.dfs(n, 0)) % MOD);
}`,
        java21: `import java.io.BufferedInputStream;
import java.io.IOException;

public class Main {
    static final long MOD = 998244353L;
    static final long INV2 = 499122177L;
    static final long INV6 = 166374059L;

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
            long res = 0;
            while (c > 32) {
                res = res * 10 + (c - '0');
                c = readByte();
            }
            return res;
        }
    }

    static long n, sq;
    static int P;
    static long[] primes, sp1, sp2, w, g1, g2;
    static int[] id1, id2;

    static int getId(long x) {
        return x <= sq ? id1[(int) x] : id2[(int) (n / x)];
    }

    static long dfs(long x, int j) {
        if (x <= 1 || (j > 0 && x <= primes[j - 1]) || (j < P && x < primes[j])) return 0;
        int k = getId(x);
        long ret = ((g2[k] - g1[k]) - (sp2[j] - sp1[j])) % MOD;
        if (ret < 0) ret += MOD;
        for (int idx = j; idx < P && primes[idx] * primes[idx] <= x; idx++) {
            long p = primes[idx];
            long pe = p;
            while (pe <= x / p) {
                long pm = pe % MOD;
                long f1 = pm * ((pm - 1 + MOD) % MOD) % MOD;
                long pe2 = pe * p;
                long pm2 = pe2 % MOD;
                long f2 = pm2 * ((pm2 - 1 + MOD) % MOD) % MOD;
                ret = (ret + f1 * dfs(x / pe, idx + 1) + f2) % MOD;
                pe = pe2;
            }
        }
        return ret;
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        n = fs.nextLong();
        if (n == 0) return;
        sq = (long) Math.sqrt((double) n);
        while ((sq + 1) * (sq + 1) <= n) sq++;
        while (sq * sq > n) sq--;

        int sqi = (int) sq;
        boolean[] comp = new boolean[sqi + 1];
        primes = new long[sqi + 1];
        sp1 = new long[sqi + 2];
        sp2 = new long[sqi + 2];
        P = 0;
        for (int i = 2; i <= sqi; i++) {
            if (!comp[i]) {
                primes[P] = i;
                long pm = i % MOD;
                sp1[P + 1] = (sp1[P] + pm) % MOD;
                sp2[P + 1] = (sp2[P] + pm * pm % MOD) % MOD;
                P++;
            }
            for (int j = 0; j < P; j++) {
                long nx = i * primes[j];
                if (nx > sq) break;
                comp[(int) nx] = true;
                if (i % primes[j] == 0) break;
            }
        }

        int cap = 2 * sqi + 5;
        w = new long[cap];
        g1 = new long[cap];
        g2 = new long[cap];
        id1 = new int[sqi + 1];
        id2 = new int[sqi + 1];
        int m = 0;
        for (long l = 1, r; l <= n; l = r + 1) {
            long q = n / l;
            r = n / q;
            w[m] = q;
            if (q <= sq) id1[(int) q] = m;
            else id2[(int) (n / q)] = m;
            long qm = q % MOD;
            g1[m] = (qm * ((qm + 1) % MOD) % MOD * INV2 % MOD - 1 + MOD) % MOD;
            g2[m] = (qm * ((qm + 1) % MOD) % MOD * ((2 * qm + 1) % MOD) % MOD * INV6 % MOD - 1 + MOD) % MOD;
            m++;
        }

        for (int j = 0; j < P; j++) {
            long p = primes[j], p2 = p * p;
            long pm = p % MOD, pm2 = pm * pm % MOD;
            for (int i = 0; i < m && w[i] >= p2; i++) {
                int k = getId(w[i] / p);
                g1[i] = (g1[i] - pm * ((g1[k] - sp1[j] + MOD) % MOD)) % MOD;
                if (g1[i] < 0) g1[i] += MOD;
                g2[i] = (g2[i] - pm2 * ((g2[k] - sp2[j] + MOD) % MOD)) % MOD;
                if (g2[i] < 0) g2[i] += MOD;
            }
        }
        System.out.println((1 + dfs(n, 0)) % MOD);
    }
}`,
        python3: `import math
import sys

sys.setrecursionlimit(200000)
MOD = 998244353
INV2 = 499122177
INV6 = 166374059


def solve() -> None:
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    sq = math.isqrt(n)
    comp = bytearray(sq + 1)
    primes = []
    sp1 = [0]
    sp2 = [0]
    for i in range(2, sq + 1):
        if not comp[i]:
            primes.append(i)
            pm = i % MOD
            sp1.append((sp1[-1] + pm) % MOD)
            sp2.append((sp2[-1] + pm * pm) % MOD)
        for p in primes:
            nx = i * p
            if nx > sq:
                break
            comp[nx] = 1
            if i % p == 0:
                break
    p_cnt = len(primes)

    w = []
    g1 = []
    g2 = []
    id1 = [0] * (sq + 1)
    id2 = [0] * (sq + 1)
    l = 1
    while l <= n:
        q = n // l
        r = n // q
        m = len(w)
        w.append(q)
        if q <= sq:
            id1[q] = m
        else:
            id2[n // q] = m
        qm = q % MOD
        g1.append((qm * (qm + 1) % MOD * INV2 - 1) % MOD)
        g2.append((qm * (qm + 1) % MOD * (2 * qm + 1) % MOD * INV6 - 1) % MOD)
        l = r + 1

    def get_id(x: int) -> int:
        return id1[x] if x <= sq else id2[n // x]

    m = len(w)
    for j, p in enumerate(primes):
        p2 = p * p
        pm = p % MOD
        pm2 = pm * pm % MOD
        s1_j = sp1[j]
        s2_j = sp2[j]
        for i in range(m):
            if w[i] < p2:
                break
            k = get_id(w[i] // p)
            g1[i] = (g1[i] - pm * (g1[k] - s1_j)) % MOD
            g2[i] = (g2[i] - pm2 * (g2[k] - s2_j)) % MOD

    def dfs(x: int, j: int) -> int:
        if x <= 1 or (j > 0 and x <= primes[j - 1]) or (j < p_cnt and x < primes[j]):
            return 0
        k = get_id(x)
        ret = (g2[k] - g1[k] - sp2[j] + sp1[j]) % MOD
        idx = j
        while idx < p_cnt:
            p = primes[idx]
            if p * p > x:
                break
            pe = p
            while pe <= x // p:
                pm = pe % MOD
                f1 = pm * (pm - 1) % MOD
                pe2 = pe * p
                pm2 = pe2 % MOD
                f2 = pm2 * (pm2 - 1) % MOD
                ret = (ret + f1 * dfs(x // pe, idx + 1) + f2) % MOD
                pe = pe2
            idx += 1
        return ret

    sys.stdout.write(f"{(1 + dfs(n, 0)) % MOD}\\n")


if __name__ == "__main__":
    solve()`,
        ruby: `MOD = 998_244_353
INV2 = 499_122_177
INV6 = 166_374_059

data = STDIN.read.split
exit if data.empty?
n = data[0].to_i
sq = Integer.sqrt(n)
comp = Array.new(sq + 1, false)
primes = []
sp1 = [0]
sp2 = [0]
(2..sq).each do |i|
  unless comp[i]
    primes << i
    pm = i % MOD
    sp1 << (sp1[-1] + pm) % MOD
    sp2 << (sp2[-1] + pm * pm) % MOD
  end
  primes.each do |p|
    nx = i * p
    break if nx > sq
    comp[nx] = true
    break if i % p == 0
  end
end
p_cnt = primes.length

w = []
g1 = []
g2 = []
id1 = Array.new(sq + 1, 0)
id2 = Array.new(sq + 1, 0)
l = 1
while l <= n
  q = n / l
  r = n / q
  m = w.length
  w << q
  if q <= sq
    id1[q] = m
  else
    id2[n / q] = m
  end
  qm = q % MOD
  g1 << (qm * (qm + 1) % MOD * INV2 - 1) % MOD
  g2 << (qm * (qm + 1) % MOD * (2 * qm + 1) % MOD * INV6 - 1) % MOD
  l = r + 1
end

get_id = ->(x) { x <= sq ? id1[x] : id2[n / x] }

m = w.length
primes.each_with_index do |p, j|
  p2 = p * p
  pm = p % MOD
  pm2 = pm * pm % MOD
  (0...m).each do |i|
    break if w[i] < p2
    k = get_id.call(w[i] / p)
    g1[i] = (g1[i] - pm * (g1[k] - sp1[j])) % MOD
    g2[i] = (g2[i] - pm2 * (g2[k] - sp2[j])) % MOD
  end
end

dfs = lambda do |x, j|
  return 0 if x <= 1 || (j > 0 && x <= primes[j - 1]) || (j < p_cnt && x < primes[j])

  k = get_id.call(x)
  ret = (g2[k] - g1[k] - sp2[j] + sp1[j]) % MOD
  idx = j
  while idx < p_cnt
    p = primes[idx]
    break if p * p > x
    pe = p
    while pe <= x / p
      pm = pe % MOD
      f1 = pm * (pm - 1) % MOD
      pe2 = pe * p
      pm2 = pe2 % MOD
      f2 = pm2 * (pm2 - 1) % MOD
      ret = (ret + f1 * dfs.call(x / pe, idx + 1) + f2) % MOD
      pe = pe2
    end
    idx += 1
  end
  ret
end

puts (1 + dfs.call(n, 0)) % MOD`,
      },
    },
  ],
  platformRadar: [
    {
      platform: 'AtCoder',
      title: 'Library Checker - Sum of Totient Function & Min_25 Sieve',
      difficulty: 'Grandmaster',
      url: 'https://judge.yosupo.jp/problem/sum_of_totient_function',
      patternNote: 'Classic O(N^(2/3)) Du’s Sieve benchmark pairing linear Euler precomputation up to N^(2/3) with Dirichlet hyperbola recursion.',
    },
    {
      platform: 'Codeforces',
      title: 'Sublinear Multiplicative Sums & Prime Counting',
      difficulty: '2800',
      url: 'https://codeforces.com/problemset',
      patternNote: 'Decompose polynomial f(p) into completely multiplicative basis terms x^k and evaluate recursively via Min_25 Sieve.',
    },
    {
      platform: 'CodeChef',
      title: 'All-Pairs GCD & LCM Convolution Prefix Queries',
      difficulty: 'Grandmaster',
      url: 'https://www.codechef.com/problems',
      patternNote: 'Group floor quotients floor(N/d) with Du’s S_phi(r) - S_phi(l - 1) difference weights.',
    },
  ],
  interviewNotes: [
    'Precomputing linear sieve prefix sums up to B = N^(2/3) balances O(B) setup with O(N / sqrt(B)) recursive subproblems, tightening total runtime to O(N^(2/3)).',
    'Always share memoized hash maps across queries in Du’s Sieve because S(x) depends solely on the argument x.',
    'Min_25 handles arbitrary multiplicative functions whose values at primes are low-degree polynomials even when no closed-form Dirichlet inverse g exists.',
  ],
  projectBlueprint: {
    title: 'Sublinear Number-Theoretic Aggregator & Multiplicative Sieve Kernel',
    tagline: 'Computes totient, Mobius, and polynomial multiplicative prefix sums up to 10^10 in milliseconds',
    stackSummary: 'C++20 / Rust Euler Linear Sieve + Du Quotient Memoizer + Min_25 Prime-Power Evaluator',
    asciiDiagram:
`[Linear Euler Sieve <= N^(2/3)] ---> [Quotient Block Grouping l..r]
                                               |
[Min_25 Prime Sums g_k(x)] <----------- [Dirichlet Convolution Recurse]`,
    milestones: [
      { id: 'm1', title: 'Linear Euler Precompute', detail: 'Build exact mu(i), phi(i), and prefix tables up to B = min(1.5e6, N^(2/3)).' },
      { id: 'm2', title: 'Du Quotient Hyperbola Loop', detail: 'Evaluate floor(N/d) blocks with overflow-safe mod reductions.' },
      { id: 'm3', title: 'Min_25 Power Decomposition', detail: 'Sieve prime power sums over floor quotients and recurse S(x, j).' },
    ],
    starterCode: `// Dirichlet hyperbola identity:
// g(1) * S_f(N) = S_{f*g}(N) - sum_{l=2..N} (S_g(r) - S_g(l-1)) * S_f(N / l)`,
  },
};
