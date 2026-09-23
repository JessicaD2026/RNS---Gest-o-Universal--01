import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { READINESS_DIMENSIONS } from '../../data/dimensions';
import { ReadinessDimensionKey } from '../../types';
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Brain,
  CheckCircle2,
  GitCompare,
  Layers,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

interface GapItem {
  dimension: ReadinessDimensionKey;
  dimensionName: string;
  current: number;
  target: number;
  gap: number;
  max: number;
  impact: number; // 1 to 5
  urgency: number; // 1 to 5
  priorityScore: number;
  priorityLabel: 'Crítico' | 'Alto' | 'Médio' | 'Baixo';
  blocker: string | null;
  recommendedAction: string;
}

export const GapManagement: React.FC<{ onOpenAI: () => void }> = ({ onOpenAI }) => {
  const { currentTech, currentApp, setCurrentView } = useApp();

  const [impactOverrides, setImpactOverrides] = useState<Record<string, number>>({
    CRL: 5,
    RRL: 5,
    TRL: 4,
    MRL: 4,
    QRL: 4,
    VRL: 4,
    IPRL: 3,
    Partnership: 3,
    FRL: 4,
    PRL: 3,
  });

  const [urgencyOverrides, setUrgencyOverrides] = useState<Record<string, number>>({
    CRL: 5,
    RRL: 4,
    TRL: 4,
    MRL: 3,
    QRL: 3,
    VRL: 3,
    IPRL: 3,
    Partnership: 3,
    FRL: 4,
    PRL: 3,
  });

  const dimensionsList = Object.keys(READINESS_DIMENSIONS) as ReadinessDimensionKey[];

  const gapItems: GapItem[] = dimensionsList.map((dim) => {
    const spec = READINESS_DIMENSIONS[dim];
    const current = currentApp?.currentReadiness[dim] || 0;
    const target = currentApp?.targetReadiness[dim] || spec.maxLevel;
    const gap = Math.max(0, target - current);
    const impact = impactOverrides[dim] || 3;
    const urgency = urgencyOverrides[dim] || 3;
    const priorityScore = gap * impact * urgency;

    let priorityLabel: 'Crítico' | 'Alto' | 'Médio' | 'Baixo' = 'Baixo';
    if (priorityScore >= 35) priorityLabel = 'Crítico';
    else if (priorityScore >= 20) priorityLabel = 'Alto';
    else if (priorityScore >= 10) priorityLabel = 'Médio';

    // Heuristics for recommendations
    let recommendedAction = 'Manter monitoramento de conformidade e rotina de validação.';
    if (dim === 'CRL' && gap > 0) {
      recommendedAction = 'Finalizar desenho de estudo ex vivo/in vivo e submeter protocolo ao CEUA/CONEP.';
    } else if (dim === 'RRL' && gap > 0) {
      recommendedAction = 'Agendar reunião de diálogo técnico (RDC 751/RDC 683) com a ANVISA e alinhar enquadramento.';
    } else if (dim === 'MRL' && gap > 0) {
      recommendedAction = 'Iniciar qualificação formal de fornecedores CMO e mapeamento de Critical Process Parameters (CPPs).';
    } else if (dim === 'IPRL' && gap > 0) {
      recommendedAction = 'Emitir parecer formal de Freedom to Operate (FTO) antes de investimentos industriais.';
    } else if (dim === 'TRL' && gap > 0) {
      recommendedAction = 'Executar testes de bancada em ambiente simulado e aprovar laudos analíticos.';
    }

    const blocker =
      currentApp?.blockers && currentApp.blockers.length > 0 && (dim === 'CRL' || dim === 'RRL')
        ? currentApp.blockers[0]
        : null;

    return {
      dimension: dim,
      dimensionName: spec.name,
      current,
      target,
      gap,
      max: spec.maxLevel,
      impact,
      urgency,
      priorityScore,
      priorityLabel,
      blocker,
      recommendedAction,
    };
  });

  // Sort by priorityScore descending
  const sortedGaps = [...gapItems].sort((a, b) => b.priorityScore - a.priorityScore);

  const totalGapsCount = sortedGaps.filter((g) => g.gap > 0).length;
  const criticalGapsCount = sortedGaps.filter((g) => g.priorityLabel === 'Crítico').length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded font-bold">
                {currentApp?.id}
              </span>
              <span className="text-xs text-slate-400">Ativo: {currentTech?.name}</span>
            </div>
            <h1 className="text-lg font-bold text-slate-100 tracking-tight flex items-center gap-2">
              <GitCompare className="w-5 h-5 text-amber-400" />
              <span>Diagnóstico de Gaps & Matriz de Priorização</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-4xl">
              Cálculo quantitativo de desvios entre o estado atual e a meta do próximo Stage-Gate.
              Fórmula de prioridade analítica: <strong>Índice = Gap × Impacto × Urgência</strong>.
            </p>
          </div>

          <button
            onClick={onOpenAI}
            className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold px-3.5 py-2 rounded shadow-sm transition cursor-pointer shrink-0"
          >
            <Brain className="w-4 h-4 text-cyan-200" />
            <span>Diagnóstico com IA</span>
          </button>
        </div>

        {/* Telemetry counters */}
        <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
          <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
            <span className="text-slate-400 text-[10px] uppercase block">Gaps Dimensionais Ativos:</span>
            <span className="text-lg font-bold text-amber-400">{totalGapsCount}</span>
          </div>
          <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
            <span className="text-slate-400 text-[10px] uppercase block">Gaps Críticos / Gargalos:</span>
            <span className="text-lg font-bold text-rose-400">{criticalGapsCount}</span>
          </div>
          <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
            <span className="text-slate-400 text-[10px] uppercase block">Maior Gargalo Identificado:</span>
            <span className="text-sm font-bold text-cyan-300 truncate block">
              {sortedGaps[0]?.dimension} (Índice {sortedGaps[0]?.priorityScore})
            </span>
          </div>
          <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
            <span className="text-slate-400 text-[10px] uppercase block">Stage-Gate Alvo:</span>
            <span className="text-sm font-bold text-purple-300">{currentApp?.currentGateId}</span>
          </div>
        </div>
      </div>

      {/* Gaps Ranked Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
            Ranking Multidimensional de Gaps por Índice de Prioridade
          </h3>
          <span className="text-[11px] text-slate-400">Ordenado por Criticidade Decrescente</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-[10px] font-mono uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3">Dimensão</th>
                <th className="p-3">Nível Atual</th>
                <th className="p-3">Nível Meta</th>
                <th className="p-3">Gap Absoluto</th>
                <th className="p-3">Impacto (1-5)</th>
                <th className="p-3">Urgência (1-5)</th>
                <th className="p-3">Índice & Prioridade</th>
                <th className="p-3">Ação Recomendada para Fechamento</th>
                <th className="p-3 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {sortedGaps.map((item) => (
                <tr key={item.dimension} className="hover:bg-slate-800/40 transition">
                  <td className="p-3">
                    <div className="font-mono font-bold text-cyan-400 text-xs">{item.dimension}</div>
                    <div className="text-[10px] text-slate-400">{item.dimensionName}</div>
                  </td>

                  <td className="p-3 font-mono font-bold text-slate-200">
                    {item.current} / {item.max}
                  </td>

                  <td className="p-3 font-mono font-bold text-amber-400">
                    {item.target} / {item.max}
                  </td>

                  <td className="p-3 font-mono">
                    <span
                      className={`px-2 py-0.5 rounded font-bold ${
                        item.gap === 0
                          ? 'bg-emerald-950 text-emerald-400'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {item.gap === 0 ? '0 (OK)' : `+${item.gap}`}
                    </span>
                  </td>

                  <td className="p-3 font-mono">
                    <select
                      value={item.impact}
                      onChange={(e) =>
                        setImpactOverrides((prev) => ({
                          ...prev,
                          [item.dimension]: Number(e.target.value),
                        }))
                      }
                      className="bg-slate-950 border border-slate-800 rounded px-1.5 py-0.5 text-xs text-slate-200 focus:outline-none"
                    >
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="p-3 font-mono">
                    <select
                      value={item.urgency}
                      onChange={(e) =>
                        setUrgencyOverrides((prev) => ({
                          ...prev,
                          [item.dimension]: Number(e.target.value),
                        }))
                      }
                      className="bg-slate-950 border border-slate-800 rounded px-1.5 py-0.5 text-xs text-slate-200 focus:outline-none"
                    >
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="p-3 font-mono">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-100">{item.priorityScore}</span>
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded border font-semibold ${
                          item.priorityLabel === 'Crítico'
                            ? 'bg-rose-950 text-rose-300 border-rose-800'
                            : item.priorityLabel === 'Alto'
                            ? 'bg-amber-950 text-amber-300 border-amber-800'
                            : item.priorityLabel === 'Médio'
                            ? 'bg-blue-950 text-blue-300 border-blue-800'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {item.priorityLabel}
                      </span>
                    </div>
                  </td>

                  <td className="p-3 text-slate-300 max-w-[280px]">
                    <p className="text-[11px] leading-snug line-clamp-2">{item.recommendedAction}</p>
                    {item.blocker && (
                      <span className="text-[10px] text-rose-400 font-mono block mt-0.5">
                        Bloqueador: {item.blocker}
                      </span>
                    )}
                  </td>

                  <td className="p-3 text-right">
                    <button
                      onClick={() => setCurrentView('readiness')}
                      className="text-cyan-400 hover:text-cyan-300 font-medium text-[11px] flex items-center gap-1 ml-auto cursor-pointer"
                    >
                      <span>Tratar</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
