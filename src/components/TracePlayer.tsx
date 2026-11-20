import { useMemo, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  GitBranchPlus,
  Plus,
  RotateCcw,
  Trash2,
} from 'lucide-react';
import type {
  TraceGraphEdge,
  TraceGraphNode,
  TraceStep,
} from '../types/vault';

interface TracePlayerProps {
  title: string;
  subtitle: string;
  steps: TraceStep[];
  allowDynamicGraphEdit?: boolean;
}

const NODE_COLORS: Record<
  TraceGraphNode['state'],
  { fill: string; stroke: string; text: string; label: string }
> = {
  unmatched: {
    fill: '#191C23',
    stroke: '#64748B',
    text: '#E2E8F0',
    label: 'Unmatched',
  },
  even: {
    fill: '#1E293B',
    stroke: '#F59E0B',
    text: '#FCD34D',
    label: 'EVEN',
  },
  odd: {
    fill: '#2E1A1E',
    stroke: '#F43F5E',
    text: '#FDA4AF',
    label: 'ODD',
  },
  blossom: {
    fill: '#2D2006',
    stroke: '#FBBF24',
    text: '#FEF08A',
    label: 'Blossom EVEN',
  },
  matched: {
    fill: '#062E24',
    stroke: '#10B981',
    text: '#6EE7B7',
    label: 'Matched',
  },
  active: {
    fill: '#1E293B',
    stroke: '#38BDF8',
    text: '#BAE6FD',
    label: 'Terminal',
  },
};

export function TracePlayer({
  title,
  subtitle,
  steps,
  allowDynamicGraphEdit = false,
}: TracePlayerProps) {
  const [stepIdx, setStepIdx] = useState(0);
  // Dynamic nodes & edges persist independently across step transitions so graph state never resets.
  const [customNodes, setCustomNodes] = useState<TraceGraphNode[]>([]);
  const [customEdges, setCustomEdges] = useState<TraceGraphEdge[]>([]);
  const [edgeFrom, setEdgeFrom] = useState<string>('0');
  const [edgeTo, setEdgeTo] = useState<string>('');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const safeIdx = Math.min(stepIdx, Math.max(0, steps.length - 1));
  const current = steps[safeIdx];

  const mergedGraph = useMemo(() => {
    if (!current?.graph) return null;
    const nodeMap = new Map<string, TraceGraphNode>();
    for (const n of current.graph.nodes) {
      nodeMap.set(n.id, n);
    }
    for (const cn of customNodes) {
      if (!nodeMap.has(cn.id)) {
        nodeMap.set(cn.id, cn);
      }
    }
    const allNodes = Array.from(nodeMap.values());
    const allEdges = [...current.graph.edges, ...customEdges];
    return {
      ...current.graph,
      nodes: allNodes,
      edges: allEdges,
    };
  }, [current, customNodes, customEdges]);

  const handleAddDynamicNode = () => {
    if (!mergedGraph) return;
    const baseCount = mergedGraph.nodes.length;
    const nextId = `dyn_${baseCount}`;
    const nextLabel = String(baseCount);
    // Distribute newly added nodes cleanly along an arc so they never overlap existing nodes
    const col = customNodes.length % 4;
    const row = Math.floor(customNodes.length / 4);
    const newNode: TraceGraphNode = {
      id: nextId,
      label: nextLabel,
      x: 115 + col * 130,
      y: 280 + row * 48,
      state: 'unmatched',
      matchWith: null,
    };
    setCustomNodes((prev) => [...prev, newNode]);
    if (!edgeFrom && mergedGraph.nodes[0]) {
      setEdgeFrom(mergedGraph.nodes[0].id);
    }
    setEdgeTo(nextId);
  };

  const handleConnectEdge = () => {
    if (!mergedGraph || !edgeFrom || !edgeTo || edgeFrom === edgeTo) return;
    const exists = mergedGraph.edges.some(
      (e) =>
        (e.from === edgeFrom && e.to === edgeTo) ||
        (e.from === edgeTo && e.to === edgeFrom),
    );
    if (exists) return;
    const newEdge: TraceGraphEdge = {
      id: `dyn_e_${Date.now()}_${customEdges.length}`,
      from: edgeFrom,
      to: edgeTo,
      state: 'default',
    };
    setCustomEdges((prev) => [...prev, newEdge]);
  };

  const handleClearDynamicAdditions = () => {
    setCustomNodes([]);
    setCustomEdges([]);
    setEdgeTo('');
  };

  const handleStepReset = () => {
    setStepIdx(0);
  };

  if (!current) return null;

  return (
    <section className="rounded-xl border border-white/10 bg-[#13151A] overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 border-b border-white/10">
        <div>
          <h3 className="text-base font-semibold text-slate-100">{title}</h3>
          <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">{subtitle}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setStepIdx((i) => Math.max(0, i - 1))}
            disabled={safeIdx === 0}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md border border-white/10 bg-[#191C23] text-slate-200 hover:border-amber-500/50 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Prev Step</span>
          </button>

          <span className="px-2.5 py-1 text-xs font-mono tabular-nums text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-md whitespace-nowrap">
            Step {safeIdx + 1} / {steps.length}
          </span>

          <button
            type="button"
            onClick={() => setStepIdx((i) => Math.min(steps.length - 1, i + 1))}
            disabled={safeIdx >= steps.length - 1}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md bg-amber-500 text-zinc-950 font-semibold hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>Next Step</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleStepReset}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md border border-white/10 bg-[#191C23] text-slate-300 hover:text-white whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
        {/* Left Interactive Visual Stage */}
        <div className="lg:col-span-7 p-5 bg-[#0E1014]">
          {current.mode === 'array' && current.arrays && (
            <div className="space-y-6">
              {current.arrays.map((arr) => (
                <div key={arr.name} className="space-y-2">
                  <div className="text-xs font-mono text-slate-400">
                    {arr.name}
                  </div>
                  <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
                    {arr.cells.map((cell) => {
                      const styleMap: Record<string, string> = {
                        neutral: 'border-white/10 bg-[#151820] text-slate-200',
                        active:
                          'gv-trace-pulse border-emerald-500/60 bg-emerald-500/10 text-emerald-300',
                        window:
                          'gv-trace-pulse border-amber-500/70 bg-amber-500/15 text-amber-200',
                        updated:
                          'gv-trace-pulse border-amber-400 bg-amber-500/20 text-amber-200 ring-1 ring-amber-400/30',
                      };
                      const cls =
                        styleMap[cell.highlight ?? 'neutral'] ??
                        styleMap.neutral;
                      return (
                        <div
                          key={`${arr.name}-${cell.index}-${safeIdx}-${cell.highlight ?? 'n'}`}
                          className={`rounded-lg border p-2.5 text-center transition-colors ${cls}`}
                        >
                          <div className="text-[11px] font-mono text-slate-400 tabular-nums">
                            [{cell.index}]
                          </div>
                          <div className="text-base font-mono font-semibold tabular-nums mt-0.5">
                            {cell.value}
                          </div>
                          {cell.label && (
                            <div className="text-[10px] font-mono text-amber-300 mt-0.5 truncate">
                              {cell.label}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {current.mode === 'graph' && mergedGraph && (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                <span className="text-amber-300">
                  {mergedGraph.calloutMetric || 'Interactive Graph State'}
                </span>
                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                  <span>Solid green = matched</span>
                  <span aria-hidden="true">·</span>
                  <span>Amber dashed = augmenting / blossom</span>
                </div>
              </div>

              <div className="rounded-lg border border-white/10 bg-[#0B0C0E] overflow-hidden">
                <svg
                  viewBox="0 0 640 340"
                  className="w-full h-[300px] select-none"
                  role="img"
                  aria-label="Algorithm graph state visualization"
                >
                  {/* Highlight contracted blossom hull when active */}
                  {mergedGraph.blossomRing &&
                    mergedGraph.blossomRing.length >= 3 && (
                      <ellipse
                        cx="330"
                        cy="145"
                        rx="165"
                        ry="98"
                        fill="rgba(245, 158, 11, 0.06)"
                        stroke="#F59E0B"
                        strokeDasharray="6 4"
                        strokeWidth="1.5"
                      />
                    )}

                  {/* Edges */}
                  {mergedGraph.edges.map((edge) => {
                    const u = mergedGraph.nodes.find((n) => n.id === edge.from);
                    const v = mergedGraph.nodes.find((n) => n.id === edge.to);
                    if (!u || !v) return null;
                    const strokeMap: Record<TraceGraphEdge['state'], string> = {
                      default: '#475569',
                      matched: '#10B981',
                      augmenting: '#F59E0B',
                      'blossom-cycle': '#FBBF24',
                      contracted: '#64748B',
                    };
                    const isBold = edge.state !== 'default';
                    const mx = (u.x + v.x) / 2;
                    const my = (u.y + v.y) / 2;
                    return (
                      <g key={edge.id}>
                        <line
                          x1={u.x}
                          y1={u.y}
                          x2={v.x}
                          y2={v.y}
                          stroke={strokeMap[edge.state]}
                          strokeWidth={isBold ? 3 : 1.75}
                          strokeDasharray={
                            edge.state === 'augmenting' ||
                            edge.state === 'blossom-cycle'
                              ? '6 4'
                              : undefined
                          }
                        />
                        {edge.weight !== undefined && (
                          <g>
                            <rect
                              x={mx - 12}
                              y={my - 9}
                              width={24}
                              height={18}
                              rx={4}
                              fill="#0B0C0E"
                              stroke="#334155"
                              strokeWidth={1}
                            />
                            <text
                              x={mx}
                              y={my + 4}
                              textAnchor="middle"
                              fill="#E2E8F0"
                              fontSize="10"
                              fontFamily="JetBrains Mono, monospace"
                            >
                              {edge.weight}
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })}

                  {/* Nodes */}
                  {mergedGraph.nodes.map((node) => {
                    const palette = NODE_COLORS[node.state];
                    const selected = selectedNodeId === node.id;
                    return (
                      <g
                        key={node.id}
                        onClick={() => setSelectedNodeId(node.id)}
                        className="cursor-pointer"
                      >
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={selected ? 23 : 20}
                          fill={palette.fill}
                          stroke={selected ? '#FFFFFF' : palette.stroke}
                          strokeWidth={selected ? 2.5 : 2}
                        />
                        <text
                          x={node.x}
                          y={node.y + 4}
                          textAnchor="middle"
                          fill={palette.text}
                          fontSize="12"
                          fontWeight="600"
                          fontFamily="JetBrains Mono, monospace"
                        >
                          {node.label}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {allowDynamicGraphEdit && (
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={handleAddDynamicNode}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Node</span>
                    </button>

                    <select
                      value={edgeFrom}
                      onChange={(e) => setEdgeFrom(e.target.value)}
                      aria-label="Edge source node"
                      className="px-2 py-1.5 text-xs font-mono rounded-md border border-white/10 bg-[#191C23] text-slate-200"
                    >
                      {mergedGraph.nodes.map((n) => (
                        <option key={n.id} value={n.id}>
                          From {n.label}
                        </option>
                      ))}
                    </select>

                    <select
                      value={edgeTo}
                      onChange={(e) => setEdgeTo(e.target.value)}
                      aria-label="Edge target node"
                      className="px-2 py-1.5 text-xs font-mono rounded-md border border-white/10 bg-[#191C23] text-slate-200"
                    >
                      <option value="">To node...</option>
                      {mergedGraph.nodes.map((n) => (
                        <option key={n.id} value={n.id}>
                          To {n.label}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={handleConnectEdge}
                      disabled={!edgeFrom || !edgeTo || edgeFrom === edgeTo}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-white/10 bg-[#191C23] text-slate-200 hover:border-amber-500/50 disabled:opacity-40 whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <GitBranchPlus className="w-3.5 h-3.5" />
                      <span>Connect Edge</span>
                    </button>
                  </div>

                  {(customNodes.length > 0 || customEdges.length > 0) && (
                    <button
                      type="button"
                      onClick={handleClearDynamicAdditions}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-400 hover:text-rose-400 whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear Added ({customNodes.length}n / {customEdges.length}e)</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Step Annotation & Live State Deck */}
        <div className="lg:col-span-5 p-5 flex flex-col justify-between gap-5 bg-[#13151A]">
          <div className="space-y-3">
            <div className="text-xs font-mono text-amber-400">
              State Transition {safeIdx + 1}
            </div>
            <h4 className="text-base font-semibold text-slate-100">
              {current.title}
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              {current.explanation}
            </p>
            {selectedNodeId && mergedGraph && (
              <div className="p-3 rounded-lg border border-white/10 bg-[#0E1014] text-xs font-mono text-slate-300">
                Selected Node:{' '}
                <span className="text-amber-300">
                  {mergedGraph.nodes.find((n) => n.id === selectedNodeId)?.label}
                </span>{' '}
                · State:{' '}
                <span className="text-emerald-300">
                  {
                    NODE_COLORS[
                      mergedGraph.nodes.find((n) => n.id === selectedNodeId)
                        ?.state ?? 'unmatched'
                    ].label
                  }
                </span>
              </div>
            )}
          </div>

          {current.variables && (
            <div className="border-t border-white/10 pt-4">
              <div className="text-xs font-medium text-slate-400 mb-2">
                Live State Variables
              </div>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(current.variables).map(([k, v]) => (
                  <div
                    key={k}
                    className="rounded-md border border-white/10 bg-[#0E1014] px-3 py-2"
                  >
                    <div className="text-[11px] font-mono text-slate-400 truncate">
                      {k}
                    </div>
                    <div className="text-xs font-mono font-medium text-slate-100 tabular-nums mt-0.5 truncate">
                      {String(v)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
