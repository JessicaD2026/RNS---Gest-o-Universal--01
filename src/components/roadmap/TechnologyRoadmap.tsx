import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RoadmapActivity } from '../../types';
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Kanban,
  Layers,
  ListFilter,
  Plus,
  Table,
  TrendingUp,
  User,
} from 'lucide-react';

export const TechnologyRoadmap: React.FC = () => {
  const { roadmap, currentTech, currentApp, updateRoadmapActivity } = useApp();

  const [viewMode, setViewMode] = useState<'timeline' | 'kanban' | 'table' | 'flow'>('timeline');

  const appRoadmap = roadmap.filter((r) => r.applicationId === currentApp?.id);

  const statuses: ('Não iniciada' | 'Em andamento' | 'Concluída' | 'Atrasada')[] = [
    'Não iniciada',
    'Em andamento',
    'Concluída',
    'Atrasada',
  ];

  const getStatusColor = (status: RoadmapActivity['status']) => {
    switch (status) {
      case 'Concluída':
        return 'bg-emerald-950 text-emerald-400 border-emerald-800';
      case 'Em andamento':
        return 'bg-cyan-950 text-cyan-400 border-cyan-800';
      case 'Atrasada':
        return 'bg-rose-950 text-rose-400 border-rose-800';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

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
              <Calendar className="w-5 h-5 text-cyan-400" />
              <span>Roadmap de Desenvolvimento Tecnológico & Atividades</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-4xl">
              Cadeia operacional estruturada: Estado Atual &rarr; Gap &rarr; Atividade &rarr; Responsável &rarr; Recursos &rarr; Evidência Esperada &rarr; Gate &rarr; Próximo Nível.
            </p>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded border border-slate-800 text-xs shrink-0">
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1.5 rounded transition cursor-pointer font-medium ${
                viewMode === 'timeline' ? 'bg-cyan-950 text-cyan-300 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Linha do Tempo
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded transition cursor-pointer font-medium ${
                viewMode === 'kanban' ? 'bg-cyan-950 text-cyan-300 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Kanban
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded transition cursor-pointer font-medium ${
                viewMode === 'table' ? 'bg-cyan-950 text-cyan-300 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Tabela
            </button>
            <button
              onClick={() => setViewMode('flow')}
              className={`px-3 py-1.5 rounded transition cursor-pointer font-medium ${
                viewMode === 'flow' ? 'bg-cyan-950 text-cyan-300 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Fluxo
            </button>
          </div>
        </div>
      </div>

      {/* View: Timeline */}
      {viewMode === 'timeline' && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
          <div className="space-y-6 relative before:absolute before:inset-0 before:left-4 before:w-0.5 before:bg-slate-800">
            {appRoadmap.map((item) => (
              <div key={item.id} className="relative flex items-start gap-4 pl-8">
                <div
                  className={`absolute left-2.5 top-1.5 w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                    item.status === 'Concluída'
                      ? 'bg-emerald-950 border-emerald-400'
                      : item.status === 'Em andamento'
                      ? 'bg-cyan-950 border-cyan-400'
                      : 'bg-slate-900 border-slate-600'
                  }`}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      item.status === 'Concluída'
                        ? 'bg-emerald-400'
                        : item.status === 'Em andamento'
                        ? 'bg-cyan-400'
                        : 'bg-slate-500'
                    }`}
                  />
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 text-xs flex-1 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-cyan-400 font-bold">{item.id}</span>
                      <span className="font-bold text-slate-100 text-sm">{item.activity}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span className={`px-2 py-0.5 rounded border ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                      <span className="text-slate-400">
                        {item.startDate} &rarr; {item.endDate}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2 pt-2 text-[11px] text-slate-400">
                    <div>
                      <span className="text-slate-400 uppercase font-mono text-[10px] block">Responsável / Lab:</span>
                      <span className="text-slate-200">{item.responsible}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 uppercase font-mono text-[10px] block">Orçamento Previsto:</span>
                      <span className="text-cyan-400 font-mono">
                        R$ {(item.budget || item.allocatedBudget || 0).toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 uppercase font-mono text-[10px] block">Evidência Esperada:</span>
                      <span className="text-slate-200">{item.expectedEvidence}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 uppercase font-mono text-[10px] block">Gate Alvo:</span>
                      <span className="text-purple-300 font-mono font-bold">{item.associatedGate}</span>
                    </div>
                  </div>

                  <div className="p-2 bg-slate-900/80 rounded border border-slate-800/80 flex items-center justify-between text-[11px]">
                    <span className="text-slate-300">
                      Gap a Superar: <strong className="text-amber-400">{item.gapToOvercome}</strong>
                    </span>
                    <span className="font-mono text-cyan-400">
                      Meta: {item.targetDimension} Lv.{item.targetLevel}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View: Kanban */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {statuses.map((st) => {
            const itemsInStatus = appRoadmap.filter((r) => r.status === st);
            return (
              <div key={st} className="bg-slate-900 border border-slate-800 rounded-lg p-3 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-mono font-bold text-slate-200">{st}</span>
                  <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded">
                    {itemsInStatus.length}
                  </span>
                </div>

                <div className="space-y-2">
                  {itemsInStatus.map((item) => (
                    <div key={item.id} className="p-3 bg-slate-950 border border-slate-800 rounded text-xs space-y-1.5">
                      <div className="flex items-center justify-between font-mono text-[10px]">
                        <span className="text-cyan-400 font-bold">{item.id}</span>
                        <span className="text-purple-300">{item.associatedGate}</span>
                      </div>
                      <h4 className="font-bold text-slate-100 text-xs">{item.activity}</h4>
                      <p className="text-[11px] text-slate-400">{item.expectedEvidence}</p>
                      <div className="pt-1 text-[10px] text-slate-400 flex items-center justify-between">
                        <span>{item.responsible}</span>
                        <span className="font-mono text-emerald-400">
                          R$ {(((item.budget || item.allocatedBudget || 0)) / 1000).toFixed(0)}k
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View: Table */}
      {viewMode === 'table' && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/90 text-[10px] font-mono uppercase text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">Atividade de Desenvolvimento</th>
                  <th className="p-3">Gap a Superar</th>
                  <th className="p-3">Responsável</th>
                  <th className="p-3">Recurso (BRL)</th>
                  <th className="p-3">Evidência Esperada</th>
                  <th className="p-3">Gate</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {appRoadmap.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3 font-mono font-bold text-cyan-400">{item.id}</td>
                    <td className="p-3 font-semibold text-slate-100">{item.activity}</td>
                    <td className="p-3 text-amber-300 font-mono text-[11px]">{item.gapToOvercome}</td>
                    <td className="p-3 text-slate-300">{item.responsible}</td>
                    <td className="p-3 font-mono text-slate-200">
                      R$ {(item.budget || item.allocatedBudget || 0).toLocaleString('pt-BR')}
                    </td>
                    <td className="p-3 text-slate-300">{item.expectedEvidence}</td>
                    <td className="p-3 font-mono text-purple-300 font-bold">{item.associatedGate}</td>
                    <td className="p-3">
                      <select
                        value={item.status}
                        onChange={(e) => updateRoadmapActivity(item.id, { status: e.target.value as any })}
                        className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border bg-slate-950 cursor-pointer focus:outline-none ${getStatusColor(
                          item.status
                        )}`}
                      >
                        {statuses.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View: Flowchart / Sequence */}
      {viewMode === 'flow' && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
          <div className="flex items-center gap-3 overflow-x-auto pb-4">
            {appRoadmap.map((item, idx) => (
              <React.Fragment key={item.id}>
                <div className="min-w-[240px] max-w-[240px] bg-slate-950 border border-slate-800 rounded-lg p-4 text-xs space-y-2 shrink-0">
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <span className="text-cyan-400 font-bold">Passo {idx + 1}</span>
                    <span className={`px-1.5 py-0.2 rounded border ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-100 text-xs line-clamp-2">{item.activity}</h4>
                  <div className="p-2 bg-slate-900 rounded border border-slate-800/80 text-[10px] space-y-1">
                    <div>
                      <span className="text-slate-400">Evidência: </span>
                      <span className="text-slate-200">{item.expectedEvidence}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Gate: </span>
                      <span className="text-purple-300 font-mono font-bold">{item.associatedGate}</span>
                    </div>
                  </div>
                </div>

                {idx < appRoadmap.length - 1 && (
                  <ArrowRight className="w-5 h-5 text-slate-600 shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
