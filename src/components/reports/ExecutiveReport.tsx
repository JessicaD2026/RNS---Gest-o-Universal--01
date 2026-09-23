import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { READINESS_DIMENSIONS } from '../../data/dimensions';
import {
  BookmarkCheck,
  CheckCircle2,
  Copy,
  Download,
  FileSpreadsheet,
  FileText,
  GitFork,
  Printer,
  Radar,
  ShieldAlert,
} from 'lucide-react';

export const ExecutiveReport: React.FC = () => {
  const {
    currentTech,
    currentApp,
    evidences,
    gates,
    risks,
    roadmap,
    rtmItems,
    currentUser,
  } = useApp();

  const [selectedReportType, setSelectedReportType] = useState<
    'dossier' | 'readiness' | 'gaps' | 'gate' | 'rtm' | 'fmea' | 'investor'
  >('dossier');

  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleExportJSON = () => {
    const reportData = {
      technology: currentTech,
      application: currentApp,
      evidences: evidences.filter((e) => e.applicationId === currentApp?.id),
      risks: risks.filter((r) => r.technologyId === currentTech?.id),
      stageGate: gates.find((g) => g.id === currentApp?.currentGateId),
      roadmap: roadmap.filter((r) => r.applicationId === currentApp?.id),
      exportedAt: new Date().toISOString(),
      generatedBy: `${currentUser.name} (${currentUser.role})`,
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DOSSIE-${currentTech?.id}-${currentApp?.id}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleCopySummary = () => {
    const text = `DOSSIÊ EXECUTIVO DE PRONTIDÃO TECNOLÓGICA
Ativo: ${currentTech?.name} (${currentTech?.id})
Aplicação: ${currentApp?.name} (${currentApp?.id})
Intended Use: ${currentApp?.intendedUse}
Gate Atual: ${currentApp?.currentGateId}
TRL Vigente: ${currentApp?.currentReadiness.TRL}/9 (Meta: ${currentApp?.targetReadiness.TRL})
CRL (Clínico/Aplicação): ${currentApp?.currentReadiness.CRL}/5
RRL (Regulatório): ${currentApp?.currentReadiness.RRL}/5
MRL (Manufatura): ${currentApp?.currentReadiness.MRL}/5
IPRL (Patentes/FTO): ${currentApp?.currentReadiness.IPRL}/5
Gargalos Críticos: ${currentApp?.blockers.join('; ') || 'Nenhum'}
Gerado em: ${new Date().toLocaleDateString('pt-BR')} por ${currentUser.name}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
              <FileText className="w-5 h-5 text-cyan-400" />
              <span>Gerador de Dossiês & Relatórios Executivos</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-4xl">
              Emissão de minutas técnicas consolidadas, pareceres para comitê de investimento, dossiês para submissão
              regulatória e extratos de rastreabilidade.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopySummary}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-2 rounded transition cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'Copiado!' : 'Copiar Sumário'}</span>
            </button>
            <button
              onClick={handleExportJSON}
              className="flex items-center gap-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold px-3 py-2 rounded transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar Dossiê (JSON)</span>
            </button>
          </div>
        </div>

        {/* Report Selector Tabs */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
          <button
            onClick={() => setSelectedReportType('dossier')}
            className={`px-3 py-1.5 rounded transition cursor-pointer font-medium ${
              selectedReportType === 'dossier'
                ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-700'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Dossiê Geral do Ativo
          </button>
          <button
            onClick={() => setSelectedReportType('readiness')}
            className={`px-3 py-1.5 rounded transition cursor-pointer font-medium ${
              selectedReportType === 'readiness'
                ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-700'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Relatório de Prontidão (10D)
          </button>
          <button
            onClick={() => setSelectedReportType('investor')}
            className={`px-3 py-1.5 rounded transition cursor-pointer font-medium ${
              selectedReportType === 'investor'
                ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-700'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Executive Summary p/ Investidores
          </button>
          <button
            onClick={() => setSelectedReportType('gate')}
            className={`px-3 py-1.5 rounded transition cursor-pointer font-medium ${
              selectedReportType === 'gate'
                ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-700'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Ata Deliberativa de Stage-Gate
          </button>
        </div>
      </div>

      {/* Printable Report Document Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-8 space-y-6 text-slate-200 max-w-4xl mx-auto shadow-xl">
        {/* Document Header */}
        <div className="border-b border-slate-700 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div>
            <span className="font-mono text-cyan-400 font-bold tracking-widest text-[11px] block">
              PLATAFORMA DE GESTÃO DO DESENVOLVIMENTO TECNOLÓGICO
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              DOCUMENTO TÉCNICO CONTROLADO &bull; CÓDIGO: DOS-{currentTech?.id}-{currentApp?.id}
            </span>
          </div>
          <div className="text-right font-mono text-[10px] text-slate-400">
            <div>EMISSÃO: {new Date().toLocaleDateString('pt-BR')}</div>
            <div>STATUS: HOMOLOGADO</div>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <span className="text-xs font-mono text-amber-400 uppercase tracking-wider">
            {currentTech?.techArea} &bull; {currentTech?.category}
          </span>
          <h2 className="text-xl font-bold text-slate-100">{currentTech?.name}</h2>
          <p className="text-xs text-slate-400">Aplicação em Análise: {currentApp?.name}</p>
        </div>

        {/* Section 1: Executive Identification */}
        <div className="space-y-2">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 border-b border-slate-800 pb-1">
            1. Identificação Técnica & Finalidade Pretendida (Intended Use)
          </h3>
          <div className="grid grid-cols-2 gap-4 text-xs bg-slate-950 p-3 rounded border border-slate-800">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Intended Use:</span>
              <p className="text-slate-200 mt-0.5">{currentTech?.intendedUse}</p>
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Problema que Resolve:</span>
              <p className="text-slate-200 mt-0.5">{currentTech?.problemSolved}</p>
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Usuário Pretendido:</span>
              <p className="text-slate-200 mt-0.5">{currentTech?.targetUser}</p>
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Ambiente Operacional:</span>
              <p className="text-slate-200 mt-0.5">{currentTech?.environmentOfUse}</p>
            </div>
          </div>
        </div>

        {/* Section 2: Multidimensional Readiness Vector */}
        <div className="space-y-2">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 border-b border-slate-800 pb-1">
            2. Vetor Multidimensional de Maturidade (Estado Vigente vs Meta)
          </h3>
          <div className="grid grid-cols-5 gap-2 font-mono text-xs text-center">
            {(Object.keys(READINESS_DIMENSIONS) as (keyof typeof READINESS_DIMENSIONS)[]).map((dimKey) => {
              const spec = READINESS_DIMENSIONS[dimKey];
              const cur = currentApp?.currentReadiness?.[dimKey] || 0;
              const tgt = currentApp?.targetReadiness?.[dimKey] || spec.maxLevel;
              return (
                <div key={dimKey} className="bg-slate-950 p-2 rounded border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-bold">{dimKey}</span>
                  <div className="text-sm font-bold text-cyan-400 mt-0.5">
                    {cur} <span className="text-[10px] text-slate-400 font-normal">/ {spec.maxLevel}</span>
                  </div>
                  <span className="text-[9px] text-amber-400 block">Meta: Lv.{tgt}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 3: Active Stage Gate & Committee Deliberation */}
        <div className="space-y-2">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 border-b border-slate-800 pb-1">
            3. Parecer do Comitê de Governança & Stage-Gate
          </h3>
          <div className="bg-slate-950 p-3 rounded border border-slate-800 text-xs space-y-2">
            <div className="flex items-center justify-between font-mono text-[11px]">
              <span className="text-purple-300 font-bold">Portão Atual: {currentApp?.currentGateId}</span>
              <span className="text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                Decisão: CONDITIONAL GO
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Autorizado o avanço para a fase de testes em modelo animal de roedores com a condicionante mandatória
              de entrega do laudo analítico de caracterização físico-química e estabilidade prévia.
            </p>
          </div>
        </div>

        {/* Section 4: Evidences Base */}
        <div className="space-y-2">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 border-b border-slate-800 pb-1">
            4. Síntese do Repositório de Evidências Homologadas
          </h3>
          <div className="space-y-1.5 text-xs">
            {evidences
              .filter((e) => e.applicationId === currentApp?.id && e.status === 'Aprovada')
              .map((ev) => (
                <div
                  key={ev.id}
                  className="p-2 bg-slate-950 border border-slate-800 rounded flex items-center justify-between text-[11px]"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-cyan-400 font-bold">{ev.id}</span>
                    <span className="text-slate-200">{ev.title}</span>
                  </div>
                  <span className="font-mono text-[10px] text-emerald-400">
                    {ev.dimension} Nível {ev.level} (Aprovada)
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* Signatures Footer */}
        <div className="pt-6 border-t border-slate-800 grid grid-cols-2 gap-8 text-center text-xs font-mono">
          <div>
            <div className="border-b border-slate-700 pb-1 font-semibold text-slate-300">
              {currentUser.name}
            </div>
            <span className="text-[10px] text-slate-400">
              {currentUser.role} &bull; Emissor Técnico
            </span>
          </div>
          <div>
            <div className="border-b border-slate-700 pb-1 font-semibold text-slate-300">
              Comitê de Governança e Qualidade
            </div>
            <span className="text-[10px] text-slate-400">Homologação Institucional</span>
          </div>
        </div>
      </div>
    </div>
  );
};
