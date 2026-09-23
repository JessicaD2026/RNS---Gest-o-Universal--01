import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RiskCategory, RiskItem, RiskStatus } from '../../types';
import {
  AlertOctagon,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Filter,
  Plus,
  Search,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';

export const RiskRegister: React.FC = () => {
  const { risks, currentTech, currentApp, addRisk, updateRisk } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states for new risk
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<RiskCategory>('Regulatório');
  const [newProbability, setNewProbability] = useState<number>(3);
  const [newImpact, setNewImpact] = useState<number>(4);
  const [newDetectability, setNewDetectability] = useState<number>(2);
  const [newMitigation, setNewMitigation] = useState('');
  const [newOwner, setNewOwner] = useState('');

  const riskCategories: RiskCategory[] = [
    'Tecnológico',
    'Biológico / Clínico',
    'Manufatura / Escalonamento',
    'Regulatório',
    'Propriedade Intelectual',
    'Qualidade',
    'Mercado / Negócio',
    'Parceria / Cadeia de Suprimentos',
    'Financeiro',
  ];

  const filteredRisks = risks.filter((r) => {
    const matchesTech = r.technologyId === currentTech?.id;
    const mitText = r.mitigationPlan || r.mitigation || '';
    const matchesSearch =
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mitText.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'ALL' || r.category === categoryFilter;
    return matchesTech && matchesSearch && matchesCat;
  });

  const handleCreateRisk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !currentTech) return;

    addRisk({
      technologyId: currentTech.id,
      applicationId: currentApp?.id || 'APP-001',
      title: newTitle,
      description: newTitle,
      category: newCategory,
      probability: Number(newProbability),
      impact: Number(newImpact),
      detectability: Number(newDetectability),
      mitigation: newMitigation,
      mitigationPlan: newMitigation,
      responsible: newOwner || 'Gestor de Riscos',
      responsiblePerson: newOwner || 'Gestor de Riscos',
      deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'Em mitigação',
    });

    setIsModalOpen(false);
    setNewTitle('');
    setNewMitigation('');
  };

  const getCriticalityBadge = (criticality: number) => {
    if (criticality >= 15) {
      return 'bg-rose-950 text-rose-300 border-rose-800 font-bold';
    }
    if (criticality >= 8) {
      return 'bg-amber-950 text-amber-300 border-amber-800 font-bold';
    }
    return 'bg-slate-800 text-slate-300 border-slate-700';
  };

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
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <span>Matriz de Gestão de Riscos Tecnológicos (FMEA)</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-4xl">
              Mapeamento de vulnerabilidades nas 9 categorias críticas de DeepTech e Saúde.
              Índice de Risco (RPN) = <strong>Probabilidade × Impacto (1 a 25)</strong>.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold px-3 py-2 rounded shadow-sm transition cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Adicionar Novo Risco</span>
          </button>
        </div>
      </div>

      {/* 5x5 Heatmap Matrix & Category Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 5x5 Probability vs Impact Heatmap */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-lg p-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
              Matriz Heatmap 5×5 (Impacto × Probabilidade)
            </h3>
            <span className="text-[11px] font-mono text-slate-400">Distribuição dos Riscos</span>
          </div>

          <div className="space-y-1">
            <div className="flex text-[10px] font-mono text-slate-400 pl-8 pb-1">
              <span className="w-full text-center">Impacto (1 &rarr; 5)</span>
            </div>

            {[5, 4, 3, 2, 1].map((prob) => (
              <div key={prob} className="flex items-center gap-1.5 text-xs font-mono">
                <span className="w-6 text-right text-[10px] text-slate-400 font-bold">P{prob}</span>
                <div className="grid grid-cols-5 gap-1.5 flex-1">
                  {[1, 2, 3, 4, 5].map((imp) => {
                    const score = prob * imp;
                    const count = filteredRisks.filter(
                      (r) => r.probability === prob && r.impact === imp
                    ).length;

                    let bgClass = 'bg-emerald-950/40 border-emerald-900/60 text-emerald-300';
                    if (score >= 15) {
                      bgClass = 'bg-rose-950/80 border-rose-700 text-rose-200';
                    } else if (score >= 8) {
                      bgClass = 'bg-amber-950/60 border-amber-800 text-amber-200';
                    }

                    return (
                      <div
                        key={imp}
                        className={`h-10 rounded border flex items-center justify-center font-bold text-xs transition ${bgClass}`}
                        title={`Probabilidade: ${prob}, Impacto: ${imp} (RPN: ${score})`}
                      >
                        {count > 0 ? (
                          <span className="w-5 h-5 rounded-full bg-slate-950/80 flex items-center justify-center text-[10px]">
                            {count}
                          </span>
                        ) : (
                          <span className="text-[9px] text-slate-400 font-normal opacity-40">{score}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Categories Overview */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-lg p-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
              Distribuição por Categoria
            </h3>
            <span className="text-[11px] font-mono text-slate-400">Total: {filteredRisks.length}</span>
          </div>

          <div className="space-y-2 text-xs">
            {riskCategories.map((cat) => {
              const catRisks = filteredRisks.filter((r) => r.category === cat);
              if (catRisks.length === 0) return null;
              const hasCritical = catRisks.some((r) => r.criticality >= 15);

              return (
                <div
                  key={cat}
                  className="p-2.5 bg-slate-950 border border-slate-800 rounded flex items-center justify-between"
                >
                  <span className="text-slate-200 font-medium">{cat}</span>
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="text-slate-400">{catRisks.length} risco(s)</span>
                    {hasCritical && (
                      <span className="bg-rose-950 text-rose-400 border border-rose-800 text-[10px] px-1.5 py-0.2 rounded font-bold">
                        Crítico Ativo
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por risco, ID ou plano de mitigação..."
            className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Filter className="w-3.5 h-3.5" />
          <span>Categoria:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-slate-200 focus:outline-none"
          >
            <option value="ALL">Todas as Categorias</option>
            {riskCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Risks Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/90 text-[10px] font-mono uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Título do Risco</th>
                <th className="p-3">Categoria</th>
                <th className="p-3">P × I = RPN</th>
                <th className="p-3">Plano de Mitigação / Ação Preventiva</th>
                <th className="p-3">Responsável</th>
                <th className="p-3">Prazo</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredRisks.map((risk) => (
                <tr key={risk.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3 font-mono font-bold text-rose-400">{risk.id}</td>

                  <td className="p-3 font-semibold text-slate-100 max-w-[200px]">
                    <div className="line-clamp-2">{risk.title}</div>
                  </td>

                  <td className="p-3 text-[11px] text-slate-400 font-mono">{risk.category}</td>

                  <td className="p-3 font-mono">
                    <span className={`px-2 py-0.5 rounded border text-[11px] ${getCriticalityBadge(risk.criticality)}`}>
                      {risk.probability} × {risk.impact} = {risk.criticality}
                    </span>
                  </td>

                  <td className="p-3 text-slate-300 max-w-[260px]">
                    <div className="line-clamp-2 text-[11px]">{risk.mitigationPlan}</div>
                  </td>

                  <td className="p-3 text-slate-300">{risk.responsiblePerson}</td>

                  <td className="p-3 font-mono text-[10px] text-slate-400">{risk.deadline}</td>

                  <td className="p-3">
                    <select
                      value={risk.status}
                      onChange={(e) => updateRisk(risk.id, { status: e.target.value as RiskStatus })}
                      className="bg-slate-950 border border-slate-800 rounded px-1.5 py-0.5 text-[10px] font-mono text-slate-200 focus:outline-none"
                    >
                      <option value="Identificado">Identificado</option>
                      <option value="Em mitigação">Em mitigação</option>
                      <option value="Mitigado">Mitigado</option>
                      <option value="Aceito">Aceito</option>
                      <option value="Encerrado">Encerrado</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: New Risk */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-lg max-w-lg w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>Cadastrar Novo Risco FMEA</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRisk} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Título / Descrição do Risco *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex: Instabilidade química sob estresse térmico acelerado"
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Categoria</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as RiskCategory)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200"
                >
                  {riskCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3 font-mono">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Probabilidade (1-5)</label>
                  <select
                    value={newProbability}
                    onChange={(e) => setNewProbability(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200"
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Impacto (1-5)</label>
                  <select
                    value={newImpact}
                    onChange={(e) => setNewImpact(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200"
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Detecção (1-5)</label>
                  <select
                    value={newDetectability}
                    onChange={(e) => setNewDetectability(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200"
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Plano de Mitigação Obrigatório *</label>
                <textarea
                  rows={2}
                  required
                  value={newMitigation}
                  onChange={(e) => setNewMitigation(e.target.value)}
                  placeholder="Ações operacionais ou protocolos alternativos para conter o risco..."
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Responsável pela Mitigação</label>
                <input
                  type="text"
                  value={newOwner}
                  onChange={(e) => setNewOwner(e.target.value)}
                  placeholder="Dra. Helena Vasconcelos"
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded cursor-pointer"
                >
                  Salvar Risco
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
