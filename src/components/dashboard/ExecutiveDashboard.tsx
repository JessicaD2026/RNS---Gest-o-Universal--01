import React from 'react';
import { useApp } from '../../context/AppContext';
import { READINESS_DIMENSIONS } from '../../data/dimensions';
import { ReadinessDimensionKey } from '../../types';
import {
  Activity,
  AlertOctagon,
  AlertTriangle,
  ArrowUpRight,
  Brain,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileCheck,
  GitFork,
  Layers,
  Radar as RadarIcon,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

export const ExecutiveDashboard: React.FC<{ onOpenAI: () => void }> = ({ onOpenAI }) => {
  const {
    currentTech,
    currentApp,
    applications,
    setSelectedAppId,
    setCurrentView,
    evidences,
    risks,
    gates,
    financials,
  } = useApp();

  const techApps = applications.filter((a) => a.technologyId === currentTech?.id);
  const currentGate = gates.find((g) => g.id === currentApp?.currentGateId);
  const techFinancial = financials.find((f) => f.technologyId === currentTech?.id);

  const approvedEvidencesCount = evidences.filter(
    (e) => e.applicationId === currentApp?.id && e.status === 'Aprovada'
  ).length;
  const inAnalysisEvidencesCount = evidences.filter(
    (e) => e.applicationId === currentApp?.id && e.status === 'Em análise'
  ).length;

  const highCriticalRisks = risks.filter(
    (r) => r.technologyId === currentTech?.id && r.criticality >= 12 && r.status !== 'Encerrado'
  );

  // Radar Chart Calculation (10 Dimensions)
  const dimensionsOrder: ReadinessDimensionKey[] = [
    'TRL',
    'PRL',
    'MRL',
    'RRL',
    'QRL',
    'VRL',
    'CRL',
    'IPRL',
    'Partnership',
    'FRL',
  ];

  const radarSize = 300;
  const center = radarSize / 2;
  const radius = radarSize * 0.38;

  const getCoordinates = (index: number, total: number, value: number, max: number) => {
    const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
    const normalized = Math.min(1, Math.max(0, value / max));
    const r = radius * normalized;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
      labelX: center + (radius + 20) * Math.cos(angle),
      labelY: center + (radius + 18) * Math.sin(angle),
    };
  };

  const currentPoints = dimensionsOrder.map((dim, i) => {
    const max = dim === 'TRL' ? 9 : 5;
    const val = currentApp?.currentReadiness[dim] || 0;
    return getCoordinates(i, dimensionsOrder.length, val, max);
  });

  const targetPoints = dimensionsOrder.map((dim, i) => {
    const max = dim === 'TRL' ? 9 : 5;
    const val = currentApp?.targetReadiness[dim] || max;
    return getCoordinates(i, dimensionsOrder.length, val, max);
  });

  const currentPolygon = currentPoints.map((p) => `${p.x},${p.y}`).join(' ');
  const targetPolygon = targetPoints.map((p) => `${p.x},${p.y}`).join(' ');

  // Web rings (20%, 40%, 60%, 80%, 100%)
  const rings = [0.2, 0.4, 0.6, 0.8, 1.0];

  return (
    <div className="space-y-6">
      {/* Top Banner with Active Technology Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono bg-cyan-950/80 text-cyan-400 border border-cyan-800/80 px-2 py-0.5 rounded font-semibold">
                {currentTech?.id}
              </span>
              <span className="text-xs font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                Área: {currentTech?.techArea}
              </span>
              <span className="text-xs font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                Versão: {currentTech?.currentVersion}
              </span>
              <span
                className={`text-xs font-mono px-2 py-0.5 rounded border ${
                  currentTech?.status === 'Ativo'
                    ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800'
                    : 'bg-amber-950/60 text-amber-400 border-amber-800'
                }`}
              >
                Status: {currentTech?.status}
              </span>
            </div>
            <h1 className="text-lg font-bold text-slate-100 tracking-tight">{currentTech?.name}</h1>
            <p className="text-xs text-slate-400 max-w-4xl line-clamp-2 leading-relaxed">
              {currentTech?.description}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setCurrentView('technology-detail')}
              className="flex items-center gap-1 text-xs font-medium text-slate-300 hover:text-cyan-400 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 px-3 py-1.5 rounded transition cursor-pointer"
            >
              <span>Detalhes do Ativo</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onOpenAI}
              className="flex items-center gap-1 text-xs font-medium text-cyan-300 bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/50 px-3 py-1.5 rounded transition cursor-pointer"
            >
              <Brain className="w-3.5 h-3.5 text-cyan-400" />
              <span>Diagnóstico IA</span>
            </button>
          </div>
        </div>

        {/* Multi-Application Selector Tabs */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-xs font-semibold text-slate-300">Aplicações da Plataforma:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {techApps.map((app) => {
              const isSelected = app.id === currentApp?.id;
              return (
                <button
                  key={app.id}
                  onClick={() => setSelectedAppId(app.id)}
                  className={`text-xs px-3 py-1 rounded transition flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-amber-950/80 text-amber-300 border border-amber-500/60 font-medium'
                      : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  <span className="font-mono">{app.id}</span>
                  <span className="truncate max-w-[180px]">{app.name.split(':')[1] || app.name}</span>
                  <span className="font-mono text-[10px] bg-slate-900/80 px-1 py-0.2 rounded text-slate-300">
                    TRL {app.currentReadiness.TRL}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* TRL Status */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono uppercase tracking-wider">Maturidade TRL</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono text-cyan-400">
                Nível {currentApp?.currentReadiness.TRL || 1}
              </span>
              <span className="text-xs font-mono text-slate-400">/ 9</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 truncate">
              {READINESS_DIMENSIONS.TRL.levels.find((l) => l.level === (currentApp?.currentReadiness.TRL || 1))?.name}
            </p>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-cyan-400 h-1.5 transition-all"
              style={{ width: `${((currentApp?.currentReadiness.TRL || 1) / 9) * 100}%` }}
            />
          </div>
        </div>

        {/* Stage-Gate Status */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono uppercase tracking-wider">Stage-Gate Ativo</span>
            <GitFork className="w-4 h-4 text-purple-400" />
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold font-mono text-purple-300">
                {currentGate?.name.split(':')[0] || 'Gate 1'}
              </span>
            </div>
            <div className="mt-1 flex items-center gap-1.5">
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                  currentGate?.decision === 'GO'
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : currentGate?.decision === 'CONDITIONAL GO'
                    ? 'bg-amber-950 text-amber-300 border border-amber-800'
                    : currentGate?.decision === 'HOLD'
                    ? 'bg-blue-950 text-blue-300 border border-blue-800'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                {currentGate?.decision || 'PENDING'}
              </span>
              <span className="text-[11px] text-slate-400 truncate">{currentGate?.scheduledDate}</span>
            </div>
          </div>
          <button
            onClick={() => setCurrentView('stagegate')}
            className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer"
          >
            <span>Ver Deliberação</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        {/* Evidences Status */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono uppercase tracking-wider">Evidências Técnicas</span>
            <FileCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono text-emerald-400">{approvedEvidencesCount}</span>
              <span className="text-xs text-slate-400">aprovadas</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {inAnalysisEvidencesCount > 0 ? (
                <span className="text-amber-400 font-medium">
                  {inAnalysisEvidencesCount} evidência(s) aguardando revisão
                </span>
              ) : (
                'Todas revisadas pela governança'
              )}
            </p>
          </div>
          <button
            onClick={() => setCurrentView('evidence')}
            className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
          >
            <span>Gerenciar Evidências</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        {/* Financial Runway & Gaps */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono uppercase tracking-wider">Orçamento & Fomento</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="my-2">
            <div className="text-lg font-bold font-mono text-slate-200">
              {techFinancial
                ? `R$ ${(techFinancial.executedBudget / 1000).toFixed(0)}k / ${(techFinancial.availableBudget / 1000).toFixed(0)}k`
                : 'R$ 1.497k / 1.800k'}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Fonte:{' '}
              <span className="text-cyan-400 font-medium">
                {techFinancial?.fundingSource || 'FINEP / FAPESP'}
              </span>
            </p>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-400 h-1.5 transition-all"
              style={{
                width: techFinancial
                  ? `${(techFinancial.executedBudget / techFinancial.availableBudget) * 100}%`
                  : '83%',
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Radar Chart + TRL Stepper & Critical Blockers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Radar Chart (10 Dimensions) */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-lg p-5 flex flex-col items-center">
          <div className="w-full flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <RadarIcon className="w-4 h-4 text-cyan-400" />
              <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-200">
                Radar de Prontidão Multidimensional (10 Dimensões)
              </h2>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400/80 border border-cyan-400" />
                <span className="text-slate-300">Atual</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-amber-500/30 border border-amber-400 border-dashed" />
                <span className="text-slate-400">Meta</span>
              </div>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <svg width={radarSize} height={radarSize} className="overflow-visible">
              {/* Concentric rings */}
              {rings.map((ring, idx) => (
                <circle
                  key={idx}
                  cx={center}
                  cy={center}
                  r={radius * ring}
                  fill="none"
                  stroke="#334155"
                  strokeWidth="1"
                  strokeDasharray={idx === rings.length - 1 ? 'none' : '2,2'}
                  opacity={0.6}
                />
              ))}

              {/* Axis lines */}
              {dimensionsOrder.map((_, i) => {
                const angle = (Math.PI * 2 * i) / dimensionsOrder.length - Math.PI / 2;
                const x2 = center + radius * Math.cos(angle);
                const y2 = center + radius * Math.sin(angle);
                return (
                  <line
                    key={i}
                    x1={center}
                    y1={center}
                    x2={x2}
                    y2={y2}
                    stroke="#1e293b"
                    strokeWidth="1.5"
                  />
                );
              })}

              {/* Target Polygon */}
              <polygon
                points={targetPolygon}
                fill="rgba(245, 158, 11, 0.08)"
                stroke="#f59e0b"
                strokeWidth="1.5"
                strokeDasharray="4,4"
              />

              {/* Current Polygon */}
              <polygon
                points={currentPolygon}
                fill="rgba(6, 182, 212, 0.25)"
                stroke="#06b6d4"
                strokeWidth="2"
              />

              {/* Current Data Points */}
              {currentPoints.map((p, i) => (
                <circle
                  key={i}
                  cx={p.x}
                  cy={p.y}
                  r="3.5"
                  fill="#06b6d4"
                  stroke="#082f49"
                  strokeWidth="1.5"
                />
              ))}

              {/* Dimension Labels */}
              {dimensionsOrder.map((dim, i) => {
                const p = currentPoints[i];
                const currentVal = currentApp?.currentReadiness[dim] || 0;
                const max = dim === 'TRL' ? 9 : 5;
                return (
                  <g key={dim}>
                    <text
                      x={p.labelX}
                      y={p.labelY}
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="text-[10px] font-mono fill-slate-300 font-semibold"
                    >
                      {dim}
                    </text>
                    <text
                      x={p.labelX}
                      y={p.labelY + 11}
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="text-[9px] font-mono fill-cyan-400 font-bold"
                    >
                      {currentVal}/{max}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="w-full mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Dimensões avaliadas: 10/10</span>
            <button
              onClick={() => setCurrentView('readiness')}
              className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 cursor-pointer"
            >
              <span>Inspecionar Matriz Completa</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column: TRL Progression + Critical Blockers & Risks */}
        <div className="lg:col-span-6 space-y-4">
          {/* TRL Pipeline Stepper */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-200">
                Pipeline de Maturidade TRL (1 a 9)
              </h2>
              <span className="text-[11px] font-mono text-cyan-400">
                Nível Atual: {currentApp?.currentReadiness.TRL || 1}
              </span>
            </div>

            <div className="grid grid-cols-9 gap-1 text-center font-mono">
              {READINESS_DIMENSIONS.TRL.levels.map((lvl) => {
                const currentTRL = currentApp?.currentReadiness.TRL || 1;
                const isPassed = lvl.level < currentTRL;
                const isCurrent = lvl.level === currentTRL;
                return (
                  <div
                    key={lvl.level}
                    className={`py-2 px-1 rounded flex flex-col items-center justify-center transition border ${
                      isCurrent
                        ? 'bg-cyan-950 text-cyan-300 border-cyan-400 shadow-sm shadow-cyan-500/20 ring-1 ring-cyan-500/50'
                        : isPassed
                        ? 'bg-slate-800/80 text-emerald-400 border-emerald-900/60'
                        : 'bg-slate-950/60 text-slate-400 border-slate-800/60'
                    }`}
                    title={`${lvl.level}: ${lvl.name}`}
                  >
                    <span className="text-[10px] font-bold">TRL {lvl.level}</span>
                    <span className="text-[8px] mt-0.5">
                      {isPassed ? '✓' : isCurrent ? '●' : '○'}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Current Level Definition Excerpt */}
            <div className="mt-4 p-3 bg-slate-950/70 border border-slate-800 rounded">
              <div className="text-[11px] font-bold text-cyan-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>
                  TRL {currentApp?.currentReadiness.TRL}:{' '}
                  {READINESS_DIMENSIONS.TRL.levels.find((l) => l.level === (currentApp?.currentReadiness.TRL || 1))?.name}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                {READINESS_DIMENSIONS.TRL.levels.find((l) => l.level === (currentApp?.currentReadiness.TRL || 1))?.definition}
              </p>
            </div>
          </div>

          {/* Blockers & Critical Risks */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-rose-400" />
                <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-200">
                  Bloqueadores Ativos & Riscos Críticos (FMEA)
                </h2>
              </div>
              <button
                onClick={() => setCurrentView('risks')}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 cursor-pointer"
              >
                Ver Matriz de Riscos
              </button>
            </div>

            {/* Blockers list */}
            {currentApp?.blockers && currentApp.blockers.length > 0 ? (
              <div className="space-y-2">
                {currentApp.blockers.map((blocker, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded bg-rose-950/40 border border-rose-900/60 flex items-start gap-2.5"
                  >
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <span className="font-bold text-rose-300 font-mono">Bloqueador #{i + 1}: </span>
                      <span className="text-slate-300 leading-snug">{blocker}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 bg-emerald-950/20 border border-emerald-900/40 rounded text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Nenhum bloqueador crítico impedindo o avanço neste momento.</span>
              </div>
            )}

            {/* High Criticality Risks Preview */}
            {highCriticalRisks.length > 0 && (
              <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
                <span className="text-[10px] uppercase font-mono text-slate-400 tracking-wider">
                  Top Riscos com RPN Crítico:
                </span>
                {highCriticalRisks.slice(0, 2).map((r) => (
                  <div
                    key={r.id}
                    className="p-2 bg-slate-950/60 border border-slate-800 rounded flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-mono text-amber-400 text-[10px] shrink-0">
                        RPN {r.criticality}
                      </span>
                      <span className="text-slate-200 truncate">{r.title}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0 ml-2">
                      {r.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
