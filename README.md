# Grandmaster Vault

**Grandmaster Vault** is an interactive Competitive Programming Encyclopedia, Active-Recall Training Engine, Contest Survival Lab, and Multi-Topic Problem Reduction Vault spanning the **800 to 3300+** Codeforces rating ladder, **USACO Bronze through Platinum / Advanced** divisions, and **ICPC World Finals** syllabus.

Built with **React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons**, a 60fps zero-dependency **Signature Motion & Domain-Specific Visual FX System**, and a hybrid **Supabase + `localStorage`** persistence layer.

---

## Core Architecture & Feature Highlights

### 1. 80-Topic Master Syllabus & 5-Tab Interactive Theory Chapters (`/theory` & `/theory/:slug`)
- **100% Complete (80/80 Full Guides Live)** across 6 Master Domains:
  1. *Data Structures*
  2. *Search, Greedy & DP*
  3. *Graph & Tree Theory*
  4. *Math, Number Theory & Algebra*
  5. *Strings & Geometry*
  6. *Theoretical & Randomized*
- Every chapter includes **5 interactive tabs**:
  - **Tab 1 — Intuition & Step-by-Step Trace Player:** First-principles mental model, interactive array/graph state visualizer (`Prev` / `Next` / `Reset` with live amber mutation pulses and dynamic graph node/edge editing), and contest reduction clues.
  - **Tab 2 — 5-Language Code & Pitfalls:** Complete, zero-placeholder implementations in **C++20** (default), **Rust**, **Java 21**, **Python 3 / PyPy3**, and **Ruby**, paired with WA / TLE / RE / MLE pitfall cards.
  - **Tab 3 — 3 Progressive Practice Problems (240 Total Problems):** *Warmup*, *Standard*, and *Boss* problems per chapter, each with statements, constraints, progressive hints, and complete 5-language solutions (**1,600 total runnable code implementations** across the 80 chapters).
  - **Tab 4 — Multi-Platform & Technical Interview Radar:** Curated problem links across Codeforces, AtCoder, CSES, USACO, Library Checker, and SPOJ, plus systems/quant interview pattern notes.
  - **Tab 5 — Real Project Blueprint:** Algorithm-to-portfolio architecture diagram, trackable implementation milestones, and TypeScript core starter code.

### 2. 10 Multi-Topic Grandmaster Problem Reductions (`/vault` & `/vault/:slug`)
- **10 Five-Stage Case Studies (`1900` to `3300` rated)** dissecting multi-topic problems:
  - `vault01` (`3300`): Shortest Even-Length Simple Path via General Graph Matching (Edmonds' Blossom)
  - `vault02` (`1900`): Range Affine Update & Range Sum Query (Lazy Segment Tree Dual-Tag Composition)
  - `vault03` (`2150`): Dynamic Tree Path & Subtree Rerooting Queries (HLD + Euler Tour Invariant)
  - `vault04` (`2400`): Project Selection & Maximum Weight Closure (Dinic Min-Cut Reduction)
  - `vault05` (`2300`): Emergency Evacuation Bottleneck (Binary Search + Multi-Source BFS + Dinic Max-Flow)
  - `vault06` (`2400`): Dynamic Tree Path Affine Updates & Subtree Sums (HLD + Lazy Segment Tree)
  - `vault07` (`2600`): Prime-Distance Tree Paths (Centroid Decomposition + NTT Polynomial Convolution)
  - `vault08` (`2700`): Forbidden Substring Genomes of Length $10^{18}$ (Aho-Corasick Automaton + Matrix Exponentiation)
  - `vault09` (`2900`): Optimal $K$-Hub Network Partition (WQS / Aliens Binary Search + Li Chao Tree CHT)
  - `vault10` (`3200`): Offline Dynamic Graph XOR-Cycle Queries (Segment Tree over Time + Rollback DSU + Linear XOR Basis)

### 3. Active-Recall Learning Engine: Rating-Climb Roadmaps & Pattern Drills (`/` & `/drills`)
- **5 Structured Rating-Climb Roadmaps (`/`):**
  - *Track 1 (800–1400 · USACO Bronze → Silver)* through *Track 5 (2600–3300+ · USACO Advanced & ICPC World Finals)* covering all 80 chapters.
  - Interactive 3-state mastery cycling (`Not Started` → `Learning` → `Mastered`), `"Recommended Next Topic"` spotlight card, animated SVG dashed-energy flow lines, and milestone confetti bursts.
  - **Reverse-Engineering Constraints Decoder ($10^8$ ops/sec rule):** Maps input size $N$ directly to feasible Big-O complexities and canonical algorithm paradigms.
- **30 "Spot the Algorithm" Contest Pattern Drills (`/drills`):**
  - 30 realistic problem scenarios across 5 rating tiers with an animated SVG radial **60-Second Rapid-Fire Timer**, streak tracking, detailed proof breakdowns of why the optimal reduction passes and why the other 3 choices TLE/WA/MLE, and direct chapter deep-links.

### 4. Contest Survival & Stress-Testing Lab (`/lab`)
- **Tab 1 — Automated Stress-Testing Harness:** Complete `mt19937_64` test generator (`gen.cpp` with uniform/chain/star/caterpillar tree builders, connected graphs, DAGs, and strings), `brute.cpp` & `sol.cpp` skeletons, cross-platform auto-diff runners (**Bash**, **PowerShell**, **Python 3 Custom Checker**), and a **Sanitizer & Compiler Flags Cheat Card** (`-fsanitize=address,undefined -D_GLIBCXX_DEBUG` vs. `-O2 -std=c++20 -march=native`).
- **Tab 2 — Battle-Tested C++20 Contest Templates:** Copy-ready modules for GNU PBDS `ordered_set` & `OrderedMultiset`, Anti-Hack `splitmix64` `gp_hash_table`, zero-overhead `ModInt<MOD>` + $O(1)$ `nCr` combinatorics, C++20 `<bit>` intrinsics & Gosper's Hack, and Fast I/O / Interactive flush guards.
- **Tab 3 — Interactive Verdict Debugger (`WA` / `TLE` / `MLE` / `RE` / `ILE`):** 30 ranked diagnostic cards across 6 judge verdicts with symptom analysis, buggy code patterns, exact contest fixes, and a `localStorage`-persisted verification checklist.

### 5. Dual Infinite Ticker Bar, `Ctrl+K` Search & 60fps Signature Motion FX
- **DSE-Style Dual Infinite Horizontal Ticker (`TopTickerBar.tsx`):** Pinned above the main navbar with a live algorithm complexity ticker (Row 1, with pause/play control) and platform announcements (Row 2).
- **60fps Signature Motion & Domain-Specific Visual FX (`src/components/fx/*`):**
  - Raycast-style cursor glow (`SpotlightCard`), Linear-style rotating conic-gradient perimeter light beam + subtle 3D perspective tilt (`BorderBeamCard`), and 6 unique domain-specific chapter hero animations (`DomainHeroBackdrop`).
  - Includes a navbar **FX Toggle** (`Full FX` / `Reduced FX`) persisted in `localStorage` and full `@media (prefers-reduced-motion: reduce)` compliance.

---

## Local Development

```bash
npm install
npm run dev
```

The development server runs at `http://localhost:3000`. When Supabase environment variables are not provided, all mastery tracking, bookmarks, solved problems, checklists, Mistake Log entries, and Demo Admin CMS entries persist automatically in `localStorage`.

---

## Environment Variables

Copy `.env.example` to `.env` for local overrides or configure these in your Cloudflare Pages dashboard:

| Variable | Required | Description |
| :--- | :--- | :--- |
| `VITE_SUPABASE_URL` | Optional | Your Supabase project URL (`https://<project-ref>.supabase.co`). Falls back cleanly to `localStorage` if omitted. |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Optional | Your Supabase anon / publishable client key. |
| `VITE_ADMIN_EMAIL` | Optional | Admin email authorized to create, update, and delete `custom_entries` in the CMS Drawer. Defaults to `randomboy4016@gmail.com`. |

---

## Supabase SQL Setup & Email Auth Configuration

1. Create a Supabase project and enable **Email / Password** authentication under **Authentication → Providers**.
2. Open the **SQL Editor** in Supabase and execute the entire contents of `supabase_schema.sql` from the repository root:
   - Creates `public.user_progress` with per-user Row-Level Security (`auth.uid() = user_id`).
   - Creates `public.custom_entries` with public `SELECT` access and admin-only `INSERT` / `UPDATE` / `DELETE` RLS policies strictly locked to `(auth.jwt() ->> 'email') = 'randomboy4016@gmail.com'`.
   - All statements in `supabase_schema.sql` are fully idempotent (`CREATE TABLE IF NOT EXISTS`, `DROP POLICY IF EXISTS`).

---

## Cloudflare Pages Deployment

This project includes `public/_redirects` containing `/* /index.html 200` so direct navigation or refresh on nested SPA routes (`/theory/:slug`, `/vault/:slug`, `/drills`, `/lab`) resolves cleanly.

Configure Cloudflare Pages with:
- **Framework preset:** `Vite`
- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Environment variables:** Add `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, and `VITE_ADMIN_EMAIL` under **Settings → Environment variables**.

Verify locally before pushing:

```bash
npm run lint
npm run build
```
