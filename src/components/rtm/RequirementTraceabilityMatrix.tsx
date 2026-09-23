import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RequirementTraceabilityItem } from '../../types';
import {
  BookmarkCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  Filter,
  Layers,
  Plus,
  Search,
  ShieldAlert,
  XCircle,
} from 'lucide-react';

export const RequirementTraceabilityMatrix: React.FC = () => {
  const {
    rtmItems,
    currentTech,
    currentApp,
    addRtmItem,
    updateRtmItem,
    evidences,
    gates,
    setCurrentView,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states for new requirement
  const [need, setNeed] = useState('');
  const [requirement, setRequirement] = useState('');
  const [associatedRisk, setAssociatedRisk] = useState('');
  const [activity, setActivity] = useState('');
  const [protocol, setProtocol] = useState('');
  const [acceptanceCriteria, setAcceptanceCriteria] = useState('');
  const [associatedGate, setAssociatedGate] = useState('GATE-01');
  const [associatedDimension, setAssociatedDimension] = useState('TRL');
  const [associatedLevel, setAssociatedLevel] = useState<number>(4);

  const filteredItems = rtmItems.filter((item) => {
    const matchesApp = item.applicationId === currentApp?.id;
    const matchesSearch =
      item.requirement.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.userNeed || item.need || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'ALL' || item.status === selectedStatus;
    return matchesApp && matchesSearch && matchesStatus;
  });

  const handleCreateRtm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requirement.trim() || !currentApp) return;

    addRtmItem({
      applicationId: currentApp.id,
      userNeed: need,
      need: need,
      requirement,
      associatedRiskId: associatedRisk || 'RSK-001',
      riskId: associatedRisk || 'RSK-001',
      activity: activity || 'Ensaio de Conformidade',
      protocolDocument: protocol || 'POP-LAB-01',
      protocol: protocol || 'POP-LAB-01',
      evidenceId: 'EVD-2026-001',
      acceptanceCriteria,
      associatedGateId: associatedGate,
      gateId: associatedGate,
      associatedDimension: associatedDimension as any,
      dimension: associatedDimension as any,
      associatedLevel,
      targetLevel: associatedLevel,
      status: 'Pendente',
    });

    setIsModalOpen(false);
    setNeed('');
    setRequirement('');
    setAcceptanceCriteria('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded font-bold">
              {currentApp?.id}
            </span>
            <span className="text-xs text-slate-400">Ativo: {currentTech?.name}</span>
          </div>
          <h1 className="text-lg font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <BookmarkCheck className="w-5 h-5 text-cyan-400" />
            <span>Matriz de Rastreabilidade de Requisitos (RTM)</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Cadeia ininterrupta: Necessidade &rarr; Requisito &rarr; Risco &rarr; Atividade &rarr; Protocolo &rarr; Evidência &rarr; Critério de Aceitação &rarr; Gate &rarr; Nível.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold px-3 py-2 rounded shadow-sm transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Novo Item de Rastreabilidade</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar requisito, ID ou necessidade..."
            className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Filter className="w-3.5 h-3.5" />
          <span>Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-slate-200 focus:outline-none"
          >
            <option value="ALL">Todos os Status</option>
            <option value="Atendido">Atendido</option>
            <option value="Em andamento">Em andamento</option>
            <option value="Bloqueado">Bloqueado</option>
            <option value="Pendente">Pendente</option>
          </select>
        </div>
      </div>

      {/* RTM Full Chain Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/90 text-[10px] font-mono uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3">ID Requisito</th>
                <th className="p-3">Necessidade do Usuário</th>
                <th className="p-3">Requisito Técnico</th>
                <th className="p-3">Risco FMEA</th>
                <th className="p-3">Protocolo / Evidência</th>
                <th className="p-3">Critério de Aceitação</th>
                <th className="p-3">Gate & Nível</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-6 text-center text-slate-400">
                    Nenhum requisito cadastrado para esta aplicação.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3 font-mono font-bold text-cyan-400 shrink-0">{item.id}</td>

                    <td className="p-3 text-slate-300 max-w-[180px]">
                      <div className="line-clamp-2">{item.userNeed}</div>
                    </td>

                    <td className="p-3 text-slate-100 font-semibold max-w-[200px]">
                      <div className="line-clamp-2">{item.requirement}</div>
                    </td>

                    <td className="p-3 font-mono text-[10px] text-amber-400">
                      <span>{item.associatedRiskId}</span>
                    </td>

                    <td className="p-3">
                      <div className="font-mono text-[11px] text-slate-200">{item.protocolDocument}</div>
                      <span className="text-[10px] font-mono text-cyan-400">{item.evidenceId}</span>
                    </td>

                    <td className="p-3 text-slate-300 max-w-[200px]">
                      <div className="line-clamp-2 text-[11px]">{item.acceptanceCriteria}</div>
                    </td>

                    <td className="p-3 font-mono text-[11px]">
                      <div className="text-purple-300 font-semibold">{item.associatedGateId}</div>
                      <div className="text-slate-400 text-[10px]">
                        {item.associatedDimension} Lv.{item.associatedLevel}
                      </div>
                    </td>

                    <td className="p-3">
                      <select
                        value={item.status}
                        onChange={(e) => updateRtmItem(item.id, { status: e.target.value as any })}
                        className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border bg-slate-950 cursor-pointer focus:outline-none ${
                          item.status === 'Atendido'
                            ? 'text-emerald-400 border-emerald-800'
                            : item.status === 'Em andamento'
                            ? 'text-cyan-400 border-cyan-800'
                            : item.status === 'Bloqueado'
                            ? 'text-rose-400 border-rose-800'
                            : 'text-amber-400 border-amber-800'
                        }`}
                      >
                        <option value="Pendente">Pendente</option>
                        <option value="Em andamento">Em andamento</option>
                        <option value="Atendido">Atendido</option>
                        <option value="Bloqueado">Bloqueado</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: New RTM Item */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-lg max-w-xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <BookmarkCheck className="w-4 h-4 text-cyan-400" />
                <span>Novo Requisito na Matriz RTM</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRtm} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Necessidade do Usuário / Mercado *</label>
                <input
                  type="text"
                  required
                  value={need}
                  onChange={(e) => setNeed(e.target.value)}
                  placeholder="Ex: Administração precisa e estável sem toxicidade em células endoteliais"
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Requisito Técnico Quantificável *</label>
                <input
                  type="text"
                  required
                  value={requirement}
                  onChange={(e) => setRequirement(e.target.value)}
                  placeholder="Ex: Diâmetro hidrodinâmico entre 80 e 150 nm e PDI < 0.20"
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Protocolo Operacional</label>
                  <input
                    type="text"
                    value={protocol}
                    onChange={(e) => setProtocol(e.target.value)}
                    placeholder="Ex: POP-DLS-002"
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Risco Associado (ID)</label>
                  <input
                    type="text"
                    value={associatedRisk}
                    onChange={(e) => setAssociatedRisk(e.target.value)}
                    placeholder="RSK-001"
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Critério de Aceitação *</label>
                <textarea
                  rows={2}
                  required
                  value={acceptanceCriteria}
                  onChange={(e) => setAcceptanceCriteria(e.target.value)}
                  placeholder="Especificação numérica ou teste estatístico para aprovação..."
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Gate Vinculado</label>
                  <select
                    value={associatedGate}
                    onChange={(e) => setAssociatedGate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 font-mono"
                  >
                    {gates.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name.split(':')[0]}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Dimensão</label>
                  <select
                    value={associatedDimension}
                    onChange={(e) => setAssociatedDimension(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 font-mono"
                  >
                    <option value="TRL">TRL</option>
                    <option value="PRL">PRL</option>
                    <option value="MRL">MRL</option>
                    <option value="RRL">RRL</option>
                    <option value="QRL">QRL</option>
                    <option value="VRL">VRL</option>
                    <option value="CRL">CRL</option>
                    <option value="IPRL">IPRL</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nível Alvo</label>
                  <input
                    type="number"
                    min={1}
                    max={9}
                    value={associatedLevel}
                    onChange={(e) => setAssociatedLevel(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 font-mono"
                  />
                </div>
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
                  className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded cursor-pointer"
                >
                  Salvar Requisito
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
