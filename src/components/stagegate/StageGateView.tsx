import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GateDecision, StageGate } from '../../types';
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Brain,
  Calendar,
  CheckCircle2,
  FileCheck2,
  GitFork,
  HelpCircle,
  History,
  Lock,
  PauseCircle,
  PlayCircle,
  ShieldCheck,
  StopCircle,
  Users,
} from 'lucide-react';

export const StageGateView: React.FC<{ onOpenAI: () => void }> = ({ onOpenAI }) => {
  const {
    gates,
    currentTech,
    currentApp,
    recordGateDecision,
    evidences,
    currentUser,
  } = useApp();

  const [selectedGateId, setSelectedGateId] = useState<string>('GATE-02');
  const [isDeliberationModalOpen, setIsDeliberationModalOpen] = useState(false);
  const [deliberationDecision, setDeliberationDecision] = useState<GateDecision>('CONDITIONAL GO');
  const [deliberationJustification, setDeliberationJustification] = useState('');
  const [deliberationConditions, setDeliberationConditions] = useState('');

  const selectedGate = gates.find((g) => g.id === selectedGateId) || gates[0];

  const handleDeliberate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliberationJustification.trim()) return;

    const conditionsArray = deliberationConditions
      .split('\n')
      .map((c) => c.trim())
      .filter(Boolean);

    recordGateDecision(
      selectedGate.id,
      deliberationDecision,
      deliberationJustification,
      conditionsArray
    );

    setIsDeliberationModalOpen(false);
    setDeliberationJustification('');
    setDeliberationConditions('');
  };

  const getDecisionBadge = (decision: GateDecision) => {
    switch (decision) {
      case 'GO':
        return 'bg-emerald-950 text-emerald-400 border-emerald-800';
      case 'CONDITIONAL GO':
        return 'bg-amber-950 text-amber-300 border-amber-800';
      case 'HOLD':
        return 'bg-blue-950 text-blue-300 border-blue-800';
      case 'RECYCLE':
        return 'bg-orange-950 text-orange-300 border-orange-800';
      case 'NO-GO':
        return 'bg-rose-950 text-rose-400 border-rose-800';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono bg-purple-950 text-purple-400 border border-purple-800 px-2 py-0.5 rounded font-bold">
                {currentApp?.id}
              </span>
              <span className="text-xs text-slate-400">Ativo: {currentTech?.name}</span>
            </div>
            <h1 className="text-lg font-bold text-slate-100 tracking-tight flex items-center gap-2">
              <GitFork className="w-5 h-5 text-purple-400" />
              <span>Governança Stage-Gate & Comitê Deliberativo</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-4xl">
              Portões de decisão formal que autorizam o avanço de etapas de investimento e desenvolvimento.
              Decisões possíveis: <strong>GO, CONDITIONAL GO, HOLD, RECYCLE, NO-GO</strong>.
            </p>
          </div>

          <button
            onClick={() => {
              setDeliberationDecision(selectedGate.decision);
              setIsDeliberationModalOpen(true);
            }}
            className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold px-4 py-2 rounded shadow-sm transition cursor-pointer shrink-0"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Deliberar Gate</span>
          </button>
        </div>

        {/* Gate Stepper Navigation */}
        <div className="mt-5 pt-4 border-t border-slate-800 grid grid-cols-1 md:grid-cols-5 gap-2 font-mono text-xs">
          {gates.map((g) => {
            const isSelected = g.id === selectedGateId;
            const isCurrent = g.id === currentApp?.currentGateId;
            return (
              <button
                key={g.id}
                onClick={() => setSelectedGateId(g.id)}
                className={`p-3 rounded border text-left flex flex-col justify-between transition cursor-pointer ${
                  isSelected
                    ? 'bg-purple-950/80 border-purple-500 text-purple-200 ring-1 ring-purple-500/50'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold">{g.id}</span>
                    {isCurrent && (
                      <span className="text-[9px] bg-purple-900 text-purple-300 px-1 py-0.2 rounded">
                        ATIVO
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] font-bold text-slate-200 truncate">
                    {g.name.split(':')[1] || g.name}
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                  <span className={`px-1.5 py-0.2 rounded border font-semibold ${getDecisionBadge(g.decision)}`}>
                    {g.decision}
                  </span>
                  <span className="text-slate-400">{g.scheduledDate}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Gate Deep Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Requirements & Input/Output Criteria */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-purple-400">{selectedGate.id}</span>
                <h2 className="text-base font-bold text-slate-100">{selectedGate.name}</h2>
              </div>

              <span className={`font-mono text-xs px-2.5 py-1 rounded border font-bold ${getDecisionBadge(selectedGate.decision)}`}>
                Decisão: {selectedGate.decision}
              </span>
            </div>

            {/* Deliberation Summary */}
            <div className="bg-slate-950 p-3.5 rounded border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between font-mono text-[11px] text-slate-400 border-b border-slate-800/80 pb-1.5">
                <span>Homologado por: <strong className="text-slate-200">{selectedGate.decisionMaker}</strong></span>
                <span>Data da Reunião: <strong className="text-slate-200">{selectedGate.decisionDate || selectedGate.scheduledDate}</strong></span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Parecer da Ata:</span>
                <p className="text-slate-300 leading-relaxed">{selectedGate.justification}</p>
              </div>

              {selectedGate.conditions && selectedGate.conditions.length > 0 && (
                <div className="pt-2 border-t border-slate-800/60">
                  <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block mb-1">
                    Condicionantes Mandatórias para Continuidade:
                  </span>
                  <ul className="space-y-1 text-slate-300 list-disc list-inside">
                    {selectedGate.conditions.map((cond, i) => (
                      <li key={i} className="text-[11px] text-amber-200/90">
                        {cond}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Mandatory Gate Requirements */}
            <div className="space-y-2 text-xs">
              <span className="font-mono text-[10px] uppercase text-slate-400 font-bold tracking-wider block">
                Requisitos Mandatórios Avaliados no Gate:
              </span>
              <div className="space-y-1.5">
                {selectedGate.mandatoryRequirements.map((req, i) => (
                  <div
                    key={i}
                    className="p-2.5 bg-slate-950 border border-slate-800 rounded flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="text-slate-200">{req}</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-900">
                      Auditado
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pending items if any */}
            {selectedGate.pendingItems && selectedGate.pendingItems.length > 0 && (
              <div className="p-3 bg-amber-950/30 border border-amber-900/50 rounded text-xs space-y-1.5">
                <span className="font-mono text-[10px] uppercase text-amber-400 font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Pendências em Aberto:
                </span>
                <ul className="space-y-1 text-slate-300 list-disc list-inside">
                  {selectedGate.pendingItems.map((pend, i) => (
                    <li key={i} className="text-[11px]">
                      {pend}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Deliberation Committee & Associated Documents */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
              <Users className="w-4 h-4 text-purple-400" />
              <span>Comitê de Avaliação & Deliberação</span>
            </h3>

            <div className="space-y-2 text-xs">
              {(selectedGate.committeeMembers || [
                'Dr. Fernando Brandão (Garantia da Qualidade)',
                'Dra. Camila Nogueira (Assuntos Regulatórios)',
                'Dr. Roberto Souza (Diretoria de Inovação e P&D)',
              ]).map((member: string, i: number) => (
                <div
                  key={i}
                  className="p-2.5 bg-slate-950 border border-slate-800 rounded flex items-center justify-between"
                >
                  <span className="text-slate-200 font-medium">{member}</span>
                  <span className="text-[10px] font-mono text-slate-400">Votante Homologado</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-800">
              <span className="text-[10px] font-mono uppercase text-slate-400 block mb-2">
                Documentos & Dossiês Vinculados ao Gate:
              </span>
              <div className="space-y-1.5 text-xs">
                {(selectedGate.associatedDocuments || [
                  'Dossiê de Prova de Conceito RT-2026-003.pdf',
                  'Relatório FMEA de Riscos Biológicos v1.2.pdf',
                  'Certificado de Conformidade Analítica HPLC.pdf',
                ]).map((doc: string, i: number) => (
                  <div
                    key={i}
                    className="p-2 bg-slate-950 border border-slate-800 rounded flex items-center justify-between text-[11px]"
                  >
                    <span className="text-slate-300 font-mono">{doc}</span>
                    <span className="text-cyan-400 text-[10px] hover:underline cursor-pointer">
                      Ver Anexo
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Deliberate Gate */}
      {isDeliberationModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-lg max-w-lg w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <GitFork className="w-4 h-4 text-purple-400" />
                <span>Registrar Deliberação de Governança: {selectedGate.id}</span>
              </h3>
              <button
                onClick={() => setIsDeliberationModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleDeliberate} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Decisão do Comitê *</label>
                <select
                  value={deliberationDecision}
                  onChange={(e) => setDeliberationDecision(e.target.value as GateDecision)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 font-mono font-bold"
                >
                  <option value="GO">GO (Avanço Irrestrito para Próxima Etapa)</option>
                  <option value="CONDITIONAL GO">CONDITIONAL GO (Avanço com Condicionantes Obrigatórias)</option>
                  <option value="HOLD">HOLD (Pausa Estratégica / Aguardando Recursos)</option>
                  <option value="RECYCLE">RECYCLE (Retorno para Etapa Anterior / Re-teste)</option>
                  <option value="NO-GO">NO-GO (Descontinuação / Encerramento do Ativo)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Parecer Técnico e Ata da Deliberação *
                </label>
                <textarea
                  rows={3}
                  required
                  value={deliberationJustification}
                  onChange={(e) => setDeliberationJustification(e.target.value)}
                  placeholder="Justificativa formal com dados analíticos que embasam a decisão do comitê..."
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Condicionantes e Prazos Mandatórios (1 por linha se houver)
                </label>
                <textarea
                  rows={2}
                  value={deliberationConditions}
                  onChange={(e) => setDeliberationConditions(e.target.value)}
                  placeholder="Ex: Não iniciar produção em lote piloto antes da entrega do relatório de estabilidade"
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 font-mono text-[11px]"
                />
              </div>

              <div className="p-3 bg-purple-950/30 border border-purple-900/50 rounded text-[11px] text-purple-300">
                Esta deliberação será assinada eletronicamente por <strong>{currentUser.name}</strong> ({currentUser.role})
                e inserida permanentemente na Trilha de Auditoria imutável.
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsDeliberationModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded cursor-pointer"
                >
                  Homologar Decisão de Gate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
