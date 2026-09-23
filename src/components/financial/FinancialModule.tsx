import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Coins, TrendingUp, AlertTriangle, ArrowUpRight, DollarSign, PieChart, Plus } from 'lucide-react';

export const FinancialModule: React.FC = () => {
  const { financials, currentTech, currentApp, updateFinancial } = useApp();

  const techFinancials = financials.filter((f) => f.technologyId === currentTech?.id);

  const totalPlanned = techFinancials.reduce((acc, f) => acc + f.plannedBudget, 0);
  const totalAvailable = techFinancials.reduce((acc, f) => acc + f.availableBudget, 0);
  const totalExecuted = techFinancials.reduce((acc, f) => acc + f.executedBudget, 0);
  const totalGap = techFinancials.reduce((acc, f) => acc + (f.fundingGap ?? Math.max(0, f.plannedBudget - f.availableBudget)), 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded font-bold">
                {currentTech?.id}
              </span>
              <span className="text-xs text-slate-400">Ativo: {currentTech?.name}</span>
            </div>
            <h1 className="text-lg font-bold text-slate-100 tracking-tight flex items-center gap-2">
              <Coins className="w-5 h-5 text-emerald-400" />
              <span>Gestão Financeira, Editais & Funding Gap</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-4xl">
              Rastreamento de orçamentos por marco de desenvolvimento (TRL/Gate), fontes de fomento público/privado
              (FINEP, FAPESP, Horizon Europe, VC) e cálculo do déficit financeiro (funding gap) até a próxima etapa.
            </p>
          </div>
        </div>

        {/* Global Financial KPI Cards */}
        <div className="mt-5 pt-4 border-t border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
          <div className="bg-slate-950 p-3 rounded border border-slate-800">
            <span className="text-slate-400 text-[10px] uppercase block">Orçamento Previsto:</span>
            <span className="text-lg font-bold text-slate-200">
              R$ {(totalPlanned / 1000).toFixed(0)}k
            </span>
          </div>

          <div className="bg-slate-950 p-3 rounded border border-slate-800">
            <span className="text-slate-400 text-[10px] uppercase block">Recursos Captados:</span>
            <span className="text-lg font-bold text-cyan-400">
              R$ {(totalAvailable / 1000).toFixed(0)}k
            </span>
          </div>

          <div className="bg-slate-950 p-3 rounded border border-slate-800">
            <span className="text-slate-400 text-[10px] uppercase block">Executado (Desembolso):</span>
            <span className="text-lg font-bold text-emerald-400">
              R$ {(totalExecuted / 1000).toFixed(0)}k
            </span>
          </div>

          <div className="bg-slate-950 p-3 rounded border border-slate-800">
            <span className="text-slate-400 text-[10px] uppercase block">Funding Gap Atual:</span>
            <span className="text-lg font-bold text-amber-400">
              R$ {(totalGap / 1000).toFixed(0)}k
            </span>
          </div>
        </div>
      </div>

      {/* Financial Milestones Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
            Marcos Financeiros & Fontes Vinculadas
          </h3>
          <span className="text-[11px] text-slate-400">Moeda Base: BRL (R$)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-[10px] font-mono uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3">ID Marco</th>
                <th className="p-3">Etapa / Marco Tecnológico</th>
                <th className="p-3">Fonte de Fomento</th>
                <th className="p-3">Previsto (R$)</th>
                <th className="p-3">Captado (R$)</th>
                <th className="p-3">Executado (R$)</th>
                <th className="p-3">Funding Gap</th>
                <th className="p-3">Prazo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {techFinancials.map((fin) => {
                const execPct = Math.min(100, Math.round((fin.executedBudget / fin.availableBudget) * 100));
                return (
                  <tr key={fin.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3 font-mono font-bold text-cyan-400">{fin.id}</td>

                    <td className="p-3 font-semibold text-slate-100">{fin.milestoneName}</td>

                    <td className="p-3">
                      <span className="font-mono text-cyan-300 text-[11px] bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
                        {fin.fundingSource}
                      </span>
                    </td>

                    <td className="p-3 font-mono text-slate-300">
                      R$ {fin.plannedBudget.toLocaleString('pt-BR')}
                    </td>

                    <td className="p-3 font-mono text-cyan-300">
                      R$ {fin.availableBudget.toLocaleString('pt-BR')}
                    </td>

                    <td className="p-3 font-mono text-emerald-300">
                      <div>R$ {fin.executedBudget.toLocaleString('pt-BR')}</div>
                      <div className="w-24 bg-slate-800 rounded-full h-1 mt-1 overflow-hidden">
                        <div className="bg-emerald-400 h-1" style={{ width: `${execPct}%` }} />
                      </div>
                    </td>

                    <td className="p-3 font-mono">
                      {(() => {
                        const gap = fin.fundingGap ?? Math.max(0, fin.plannedBudget - fin.availableBudget);
                        return (
                          <span
                            className={`px-2 py-0.5 rounded font-bold ${
                              gap > 0
                                ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                : 'bg-emerald-950 text-emerald-400'
                            }`}
                          >
                            {gap > 0 ? `R$ ${gap.toLocaleString('pt-BR')}` : 'Zerado'}
                          </span>
                        );
                      })()}
                    </td>

                    <td className="p-3 font-mono text-slate-400">{fin.deadline || '2027-12-31'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
