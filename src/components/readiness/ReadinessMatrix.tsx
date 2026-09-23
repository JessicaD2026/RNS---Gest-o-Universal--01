import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { READINESS_DIMENSIONS } from '../../data/dimensions';
import { ReadinessDimensionKey } from '../../types';
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  FileCheck2,
  HelpCircle,
  Info,
  Layers,
  Lock,
  Plus,
  Radar,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';

export const ReadinessMatrix: React.FC<{ onOpenAI: () => void }> = ({ onOpenAI }) => {
  const {
    currentTech,
    currentApp,
    evidences,
    updateReadinessLevel,
    setCurrentView,
  } = useApp();

  const [selectedDimension, setSelectedDimension] = useState<ReadinessDimensionKey>('TRL');
  const [selectedLevelNum, setSelectedLevelNum] = useState<number>(1);
  const [transitionJustification, setTransitionJustification] = useState('');
  const [transitionModalOpen, setTransitionModalOpen] = useState(false);
  const [transitionResult, setTransitionResult] = useState<{ success: boolean; message: string } | null>(null);

  const dimensionKeys = Object.keys(READINESS_DIMENSIONS) as ReadinessDimensionKey[];
  const activeDimSpec = READINESS_DIMENSIONS[selectedDimension];
  const currentLevelForDim = currentApp?.currentReadiness[selectedDimension] || 0;
  const targetLevelForDim = currentApp?.targetReadiness[selectedDimension] || activeDimSpec.maxLevel;

  const currentLevelObj = activeDimSpec.levels.find((l) => l.level === selectedLevelNum) || activeDimSpec.levels[0];

  // Check evidences associated with selected level
  const relatedEvidences = evidences.filter(
    (e) =>
      e.applicationId === currentApp?.id &&
      e.dimension === selectedDimension &&
      e.level === selectedLevelNum
  );

  const hasApprovedEvidenceForLevel = relatedEvidences.some((e) => e.status === 'Aprovada');

  const handleLevelTransition = (targetLevel: number) => {
    setSelectedLevelNum(targetLevel);
    setTransitionJustification('');
    setTransitionResult(null);
    setTransitionModalOpen(true);
  };

  const confirmLevelTransition = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentApp) return;

    const res = updateReadinessLevel(
      currentApp.id,
      selectedDimension,
      selectedLevelNum,
      transitionJustification
    );

    setTransitionResult(res);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded font-bold">
                {currentApp?.id}
              </span>
              <span className="text-xs text-slate-400">Ativo: {currentTech?.name}</span>
            </div>
            <h1 className="text-lg font-bold text-slate-100 tracking-tight flex items-center gap-2">
              <Radar className="w-5 h-5 text-cyan-400" />
              <span>Matriz de Maturidade Multidimensional (10 Dimensões)</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-4xl">
              Inspeção aprofundada de requisitos, critérios de aceitação, riscos e dependências.
              Avanço condicionado à existência de evidências técnicas documentadas e aprovadas.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenAI}
              className="text-xs font-medium bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-600/50 px-3 py-1.5 rounded flex items-center gap-1.5 transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Diagnosticar Gaps com IA</span>
            </button>
          </div>
        </div>

        {/* 10 Dimension Buttons Tab Bar */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {dimensionKeys.map((dimKey) => {
            const spec = READINESS_DIMENSIONS[dimKey];
            const currentVal = currentApp?.currentReadiness[dimKey] || 0;
            const targetVal = currentApp?.targetReadiness[dimKey] || spec.maxLevel;
            const isSelected = selectedDimension === dimKey;
            const hasGap = targetVal > currentVal;

            return (
              <button
                key={dimKey}
                onClick={() => {
                  setSelectedDimension(dimKey);
                  setSelectedLevelNum(currentVal > 0 ? currentVal : 1);
                  setTransitionResult(null);
                }}
                className={`px-3 py-2 rounded text-xs font-mono flex flex-col items-start min-w-[95px] shrink-0 border transition cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-950 text-cyan-300 border-cyan-500 shadow-sm'
                    : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-bold text-xs">{dimKey}</span>
                  {hasGap && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" title="Gap ativo" />}
                </div>
                <div className="text-[11px] mt-1 flex items-baseline gap-1">
                  <span className={`font-bold ${isSelected ? 'text-cyan-400' : 'text-slate-200'}`}>
                    {currentVal}
                  </span>
                  <span className="text-[9px] text-slate-400">/ {spec.maxLevel}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Dimension Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Levels Stepper */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <div>
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                  {selectedDimension} – {activeDimSpec.name}
                </span>
                <p className="text-[11px] text-slate-400">{activeDimSpec.description}</p>
              </div>
            </div>

            {/* Level Stepper Buttons */}
            <div className="space-y-2">
              {activeDimSpec.levels.map((lvl) => {
                const isSelected = lvl.level === selectedLevelNum;
                const isCurrent = lvl.level === currentLevelForDim;
                const isAchieved = lvl.level <= currentLevelForDim;
                const isTarget = lvl.level === targetLevelForDim;

                return (
                  <button
                    key={lvl.level}
                    onClick={() => setSelectedLevelNum(lvl.level)}
                    className={`w-full text-left p-3 rounded border transition flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-950/80 border-cyan-500 text-cyan-200 ring-1 ring-cyan-500/40'
                        : isAchieved
                        ? 'bg-slate-950/80 border-emerald-900/60 text-slate-200 hover:border-slate-700'
                        : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-6 h-6 rounded flex items-center justify-center font-mono text-xs font-bold shrink-0 ${
                          isCurrent
                            ? 'bg-cyan-500 text-slate-950'
                            : isAchieved
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {lvl.level}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold truncate text-slate-100">{lvl.name}</span>
                          {isCurrent && (
                            <span className="text-[9px] font-mono bg-cyan-900 text-cyan-300 px-1.5 py-0.2 rounded">
                              ATUAL
                            </span>
                          )}
                          {isTarget && (
                            <span className="text-[9px] font-mono bg-amber-950 text-amber-300 px-1.5 py-0.2 rounded">
                              META
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">{lvl.definition}</p>
                      </div>
                    </div>

                    <ChevronRight
                      className={`w-4 h-4 shrink-0 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Deep Level Inspector */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-5">
            {/* Level Title & Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded">
                    {selectedDimension} Nível {currentLevelObj.level}
                  </span>
                  {selectedLevelNum === currentLevelForDim && (
                    <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Nível Vigente Homologado
                    </span>
                  )}
                </div>
                <h2 className="text-base font-bold text-slate-100 mt-1">{currentLevelObj.name}</h2>
              </div>

              {/* Advance Level Button */}
              {selectedLevelNum !== currentLevelForDim && (
                <button
                  onClick={() => handleLevelTransition(selectedLevelNum)}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold px-3.5 py-2 rounded flex items-center gap-2 shadow-sm transition cursor-pointer shrink-0"
                >
                  <span>Mudar para Nível {selectedLevelNum}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Definition & Objective */}
            <div className="space-y-3 text-xs">
              <div className="bg-slate-950 p-3 rounded border border-slate-800">
                <span className="font-mono text-[10px] uppercase text-cyan-400 font-bold block mb-1">
                  Definição Operacional:
                </span>
                <p className="text-slate-200 leading-relaxed">{currentLevelObj.definition}</p>
              </div>

              <div className="bg-slate-950 p-3 rounded border border-slate-800">
                <span className="font-mono text-[10px] uppercase text-emerald-400 font-bold block mb-1">
                  Objetivo Esperado:
                </span>
                <p className="text-slate-200 leading-relaxed">{currentLevelObj.objective}</p>
              </div>
            </div>

            {/* Mandatory Evidence Types */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <FileCheck2 className="w-4 h-4 text-cyan-400" />
                  <span>Tipos de Evidências Mandatórias para este Nível:</span>
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {relatedEvidences.length} evidência(s) vinculada(s)
                </span>
              </div>

              <div className="space-y-1.5">
                {(currentLevelObj.mandatoryEvidences || []).map((evType: string, idx: number) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-slate-950/70 border border-slate-800/80 rounded text-xs text-slate-300 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      <span>{evType}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Status of actual evidences */}
              <div className="mt-3 pt-3 border-t border-slate-800">
                <span className="text-[10px] font-mono uppercase text-slate-400 block mb-2">
                  Evidências Registradas no Sistema para [{selectedDimension} Lv.{selectedLevelNum}]:
                </span>
                {relatedEvidences.length === 0 ? (
                  <div className="p-3 bg-rose-950/20 border border-rose-900/40 rounded text-xs text-rose-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>
                      Nenhuma evidência cadastrada para este nível. O avanço formal está travado por regra metodológica.
                    </span>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {relatedEvidences.map((ev) => (
                      <div
                        key={ev.id}
                        className="p-2.5 bg-slate-950 border border-slate-800 rounded flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-cyan-400 font-bold">{ev.id}</span>
                          <span className="text-slate-200">{ev.title}</span>
                        </div>
                        <span
                          className={`font-mono text-[10px] px-2 py-0.5 rounded border ${
                            ev.status === 'Aprovada'
                              ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                              : ev.status === 'Em análise'
                              ? 'bg-amber-950 text-amber-400 border-amber-800'
                              : 'bg-rose-950 text-rose-400 border-rose-800'
                          }`}
                        >
                          {ev.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Associated Risks & Acceptance Criteria */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950 p-3 rounded border border-slate-800 space-y-1.5">
                <span className="font-mono text-[10px] uppercase text-rose-400 font-bold block flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Riscos Típicos do Nível:
                </span>
                <ul className="space-y-1 text-slate-300 list-disc list-inside">
                  {(currentLevelObj.risks || []).map((risk: string, idx: number) => (
                    <li key={idx} className="text-[11px] leading-snug">
                      {risk}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-950 p-3 rounded border border-slate-800 space-y-1.5">
                <span className="font-mono text-[10px] uppercase text-emerald-400 font-bold block flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Critérios de Aceitação:
                </span>
                <p className="text-slate-300 text-[11px] leading-snug">
                  {currentLevelObj.acceptanceCriteria}
                </p>
              </div>
            </div>

            {/* Inter-Dimension Dependencies */}
            {currentLevelObj.dependencies && currentLevelObj.dependencies.length > 0 && (
              <div className="p-3 bg-amber-950/30 border border-amber-900/50 rounded text-xs space-y-1.5">
                <span className="font-mono text-[10px] uppercase text-amber-400 font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Dependências Metodológicas Cruzadas:
                </span>
                <div className="space-y-1">
                  {currentLevelObj.dependencies.map((dep: any, idx: number) => {
                    const actualDepVal = currentApp?.currentReadiness[dep.dimension as ReadinessDimensionKey] || 0;
                    const isSatisfied = actualDepVal >= dep.minLevel;
                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-[11px] bg-slate-950/60 p-1.5 rounded"
                      >
                        <span className="text-slate-300">
                          Requer <strong className="text-amber-300">{dep.dimension}</strong> no mínimo em nível{' '}
                          <strong className="text-amber-300">{dep.minLevel}</strong>
                          {dep.rationale ? ` (${dep.rationale})` : ''}
                        </span>
                        <span
                          className={`font-mono font-bold text-[10px] px-2 py-0.5 rounded ${
                            isSatisfied
                              ? 'bg-emerald-950 text-emerald-400'
                              : 'bg-rose-950 text-rose-400'
                          }`}
                        >
                          Atual: {actualDepVal} ({isSatisfied ? 'ATENDIDO' : 'BLOQUEADO'})
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Transition Modal with Mandatory Justification & Evidence Check */}
      {transitionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-lg max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Transição Formal de Nível: {selectedDimension}</span>
              </h3>
              <button
                onClick={() => setTransitionModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="text-xs space-y-3">
              <div className="bg-slate-950 p-3 rounded border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[10px] font-mono">NÍVEL ATUAL:</span>
                  <span className="text-sm font-mono font-bold text-slate-200">
                    {selectedDimension} {currentLevelForDim}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-cyan-400" />
                <div>
                  <span className="text-slate-400 block text-[10px] font-mono">NOVO NÍVEL PRETENDIDO:</span>
                  <span className="text-sm font-mono font-bold text-cyan-400">
                    {selectedDimension} {selectedLevelNum}
                  </span>
                </div>
              </div>

              {/* Status Alert if not allowed */}
              {selectedLevelNum > currentLevelForDim && !hasApprovedEvidenceForLevel && (
                <div className="p-3 bg-rose-950/40 border border-rose-800 rounded text-rose-300 text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-rose-400" />
                    <span>TRAVA DE SEGURANÇA METODOLÓGICA</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    Não é permitido avançar o nível de maturidade sem pelo menos uma Evidência Técnica no status
                    "Aprovada" vinculada a {selectedDimension} Nível {selectedLevelNum}.
                  </p>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setTransitionModalOpen(false);
                        setCurrentView('evidence');
                      }}
                      className="text-cyan-300 hover:underline font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                    >
                      <span>Ir para a Central de Evidências para cadastrar/aprovar</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}

              {transitionResult && (
                <div
                  className={`p-3 rounded text-xs ${
                    transitionResult.success
                      ? 'bg-emerald-950/50 border border-emerald-800 text-emerald-300'
                      : 'bg-rose-950/50 border border-rose-800 text-rose-300'
                  }`}
                >
                  <div className="font-bold">{transitionResult.success ? '✓ Sucesso' : '✗ Bloqueio'}</div>
                  <p className="mt-1">{transitionResult.message}</p>
                </div>
              )}

              <form onSubmit={confirmLevelTransition} className="space-y-3 pt-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Justificativa Técnica para Auditoria (Obrigatória) *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={transitionJustification}
                    onChange={(e) => setTransitionJustification(e.target.value)}
                    placeholder="Descreva as deliberações, relatórios técnicos que sustentam esta homologação de maturidade..."
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 focus:ring-1 focus:ring-cyan-500"
                  />
                  <span className="text-[10px] text-slate-400 block mt-1">
                    Este registro será gravado com assinatura eletrônica e timestamp na Trilha de Auditoria.
                  </span>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setTransitionModalOpen(false)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded cursor-pointer"
                  >
                    Fechar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded cursor-pointer"
                  >
                    Homologar Mudança de Nível
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
