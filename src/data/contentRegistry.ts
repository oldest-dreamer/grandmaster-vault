import { BUILTIN_CHAPTERS, CH01_PREFIX_SUMS } from './chapters';
import { SYLLABUS_80 } from './syllabus80';
import { BUILTIN_VAULT, VAULT01_SHORTEST_EVEN_PATH } from './vault';
import type {
  CustomCmsEntry,
  SyllabusTopic,
  TheoryChapter,
  VaultBreakdown,
} from '../types/vault';

export { BUILTIN_CHAPTERS, BUILTIN_VAULT };

export function mergeSyllabusWithCustom(
  customEntries: CustomCmsEntry[],
): SyllabusTopic[] {
  const customSyllabus = customEntries
    .filter((e) => e.entryType === 'syllabus' || e.entryType === 'theory')
    .map((entry, idx): SyllabusTopic => {
      const existing = SYLLABUS_80.find((s) => s.slug === entry.slug);
      return {
        id: entry.id,
        number: existing?.number ?? SYLLABUS_80.length + idx + 1,
        slug: entry.slug,
        title: entry.title,
        domain: entry.domain,
        ratingTier: entry.ratingTier,
        usacoDivision: entry.usacoDivision,
        status: entry.entryType === 'theory' ? 'Full Guide Live' : 'Syllabus Mapped',
        summary: entry.summary || existing?.summary || 'Custom CMS topic entry.',
        complexity: entry.payload.complexity || existing?.complexity || 'O(N log N)',
        prerequisites: entry.payload.prerequisites as string[] | undefined ?? existing?.prerequisites ?? [],
      };
    });

  const merged = [...SYLLABUS_80];
  for (const c of customSyllabus) {
    const idx = merged.findIndex((m) => m.slug === c.slug);
    if (idx >= 0) {
      merged[idx] = { ...merged[idx], ...c };
    } else {
      merged.push(c);
    }
  }
  return merged;
}

export function getAllChapters(
  customEntries: CustomCmsEntry[],
): TheoryChapter[] {
  const customTheory = customEntries
    .filter((e) => e.entryType === 'theory')
    .map((entry): TheoryChapter => {
      const p = entry.payload;
      return {
        slug: entry.slug,
        topicId: entry.id,
        title: entry.title,
        domain: entry.domain,
        ratingTier: entry.ratingTier,
        usacoDivision: entry.usacoDivision,
        subtitle: entry.summary || 'Custom Grandmaster Vault theory module.',
        analogyTitle: p.analogyTitle || 'Core Mental Model',
        analogyBody:
          p.analogyBody ||
          entry.summary ||
          'Custom theory chapter authored in Grandmaster Vault CMS.',
        prerequisites: Array.isArray(p.prerequisites)
          ? (p.prerequisites as { slug: string; title: string }[])
          : [],
        traceTitle: p.traceTitle || 'Interactive Step Trace',
        traceSubtitle: p.traceSubtitle || 'Custom chapter walkthrough.',
        allowDynamicGraphEdit: Boolean(p.allowDynamicGraphEdit),
        traceSteps: p.traceSteps ?? CH01_PREFIX_SUMS.traceSteps,
        reductionClues: p.reductionClues ?? [
          {
            clue: 'Constraints & structural pattern trigger',
            translation: entry.summary || 'Apply the target paradigm.',
          },
        ],
        timeComplexity: p.timeComplexity || 'O(N log N)',
        spaceComplexity: p.spaceComplexity || 'O(N)',
        pitfalls: p.pitfalls ?? [
          {
            type: 'WA',
            title: 'Boundary & Overflow Hygiene',
            detail: 'Verify 64-bit types and 0/1-based indexing.',
          },
        ],
        implementations: p.implementations ?? CH01_PREFIX_SUMS.implementations,
        practiceProblems: p.practiceProblems ?? [],
        platformRadar: p.platformRadar ?? [],
        interviewNotes: p.interviewNotes ?? [],
        projectBlueprint: p.projectBlueprint ?? {
          title: `${entry.title} Engine`,
          tagline: entry.summary || 'Applied engineering project blueprint.',
          stackSummary: 'TypeScript / C++20',
          asciiDiagram: 'Input -> Core Algorithm -> Output Index',
          milestones: [
            {
              id: `${entry.slug}-m1`,
              title: 'Milestone 1: Core Data Structure',
              detail: 'Implement and unit test core invariants.',
            },
          ],
          starterCode: '// Starter architecture code',
        },
      };
    });

  const merged = [...BUILTIN_CHAPTERS];
  for (const ch of customTheory) {
    const idx = merged.findIndex((m) => m.slug === ch.slug);
    if (idx >= 0) merged[idx] = ch;
    else merged.push(ch);
  }
  return merged;
}

export function getAllVaultBreakdowns(
  customEntries: CustomCmsEntry[],
): VaultBreakdown[] {
  const customVault = customEntries
    .filter((e) => e.entryType === 'vault')
    .map((entry): VaultBreakdown => {
      const p = entry.payload;
      return {
        slug: entry.slug,
        title: entry.title,
        rating: typeof p.rating === 'number' ? p.rating : 2600,
        ratingTier: entry.ratingTier,
        usacoDivision: entry.usacoDivision,
        domain: entry.domain,
        sourceTag: p.sourceTag || 'Custom Vault Reduction',
        reductionHeadline: entry.summary || p.reductionHeadline || 'Custom 5-stage breakdown.',
        stage1Statement: p.stage1Statement ?? {
          statement: entry.summary || 'Problem statement.',
          constraints: ['N <= 2 * 10^5', 'Time Limit: 2.0s'],
          sampleInput: '1\n0',
          sampleOutput: '0',
          sampleExplanation: 'Custom vault sample.',
        },
        stage2NaiveFailure: p.stage2NaiveFailure ?? {
          naiveApproaches: [
            {
              approach: 'Brute Force Search',
              complexity: 'O(N^2)',
              verdict: 'TLE',
              reason: 'Exceeds 10^8 ops/sec.',
            },
          ],
          constraintWhispers: ['Constraints point toward an O(N log N) reduction.'],
        },
        stage3AhaReduction: p.stage3AhaReduction ?? {
          coreInsight: entry.summary || 'Key structural transformation.',
          steps: [{ title: '1. Core Insight', proofNote: entry.summary || 'Verified reduction step.' }],
        },
        stage4DryRun: p.stage4DryRun ?? VAULT01_SHORTEST_EVEN_PATH.stage4DryRun,
        stage5Solutions: p.stage5Solutions ?? {
          timeComplexity: 'O(N log N)',
          spaceComplexity: 'O(N)',
          implementations: CH01_PREFIX_SUMS.implementations,
        },
      };
    });

  const merged = [...BUILTIN_VAULT];
  for (const v of customVault) {
    const idx = merged.findIndex((m) => m.slug === v.slug);
    if (idx >= 0) merged[idx] = v;
    else merged.push(v);
  }
  return merged;
}
