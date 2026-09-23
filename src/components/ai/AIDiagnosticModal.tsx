import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  AlertCircle,
  AlertTriangle,
  Brain,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileCheck2,
  HelpCircle,
  Layers,
  Sparkles,
  X,
} from 'lucide-react';

interface AIDiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIDiagnosticModal: React.FC<AIDiagnosticModalProps> = ({ isOpen, onClose }) => {
  const { currentTech, currentApp, evidences, gates, risks } = useApp();

  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<{
    consistencyScore?: number;
    gapAnalysis?: string;
    hiddenRisks?: string[];
    recommendedAssaysAndStandards?: string[];
    criticalGateQuestions?: string[];
    effortAndTimelineEstimate?: string;
    actionPlan?: string[];
  } | null>(null);

  useEffect(() => {
    if (isOpen && !analysis && currentApp && currentTech) {
      runAnalysis();
    }
  }, [isOpen, currentApp, currentTech]);

  const runAnalysis = async () => {
    if (!currentApp || !currentTech) return;
    setLoading(true);

    try {
      const payload = {
        technology: currentTech,
        application: currentApp,
        evidences: evidences.filter((e) => e.applicationId === currentApp.id),
        risks: risks.filter((r) => r.technologyId === currentTech.id),
        gate: gates.find((g) => g.id === currentApp.currentGateId),
      };

      const res = await fetch('/api/gemini/analyze-readiness', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setAnalysis(data);
    } catch (err) {
      console.error('AI Analysis failed:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-lg max-w-3xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-400">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <span>Diagnóstico Analítico de Maturidade Tecnológica</span>
                <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800 px-1.5 py-0.2 rounded">
                  Gemini API
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Avaliação de gaps, consistência documental e normas para {currentApp?.name}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 text-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mandatory Regulatory Warning */}
        <div className="p-3 bg-cyan-950/40 border border-cyan-800/80 rounded text-xs text-cyan-200 flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div className="text-[11px] leading-relaxed">
            <strong>AVISO METODOLÓGICO:</strong> Toda e qualquer inferência gerada por este módulo constitui{' '}
            <em>"Sugestão da IA – requer validação humana"</em>. O sistema é estritamente proibido de alterar
            níveis ou deliberar gates de forma autônoma.
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-3">
            <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-mono text-cyan-300">
              Correlacionando 10 dimensões, normas ISO/ANVISA/FDA e evidências técnicas...
            </p>
          </div>
        ) : analysis ? (
          <div className="space-y-4 text-xs">
            {/* Consistency & Summary */}
            <div className="bg-slate-950 p-4 rounded border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase text-slate-400 font-bold">
                  Diagnóstico de Coerência Multidimensional:
                </span>
                {analysis.consistencyScore !== undefined && (
                  <span className="font-mono text-cyan-400 font-bold">
                    Score de Robustez: {analysis.consistencyScore}%
                  </span>
                )}
              </div>
              <p className="text-slate-200 leading-relaxed">{analysis.gapAnalysis}</p>
            </div>

            {/* Hidden Risks */}
            {analysis.hiddenRisks && analysis.hiddenRisks.length > 0 && (
              <div className="bg-slate-950 p-4 rounded border border-rose-900/50 space-y-2">
                <span className="font-mono text-[10px] uppercase text-rose-400 font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Riscos Ocultos & Gargalos Silenciosos Identificados:
                </span>
                <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
                  {analysis.hiddenRisks.map((risk, idx) => (
                    <li key={idx} className="text-[11px] leading-snug">
                      {risk}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommended Assays & Standards */}
            {analysis.recommendedAssaysAndStandards && analysis.recommendedAssaysAndStandards.length > 0 && (
              <div className="bg-slate-950 p-4 rounded border border-cyan-900/50 space-y-2">
                <span className="font-mono text-[10px] uppercase text-cyan-400 font-bold flex items-center gap-1.5">
                  <FileCheck2 className="w-3.5 h-3.5" />
                  Normas Técnicas Aplicáveis & Ensaios Recomendados:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {analysis.recommendedAssaysAndStandards.map((std, idx) => (
                    <div
                      key={idx}
                      className="p-2 bg-slate-900/90 rounded border border-slate-800 text-[11px] text-slate-200"
                    >
                      &bull; {std}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Critical Gate Questions */}
            {analysis.criticalGateQuestions && analysis.criticalGateQuestions.length > 0 && (
              <div className="bg-slate-950 p-4 rounded border border-purple-900/50 space-y-2">
                <span className="font-mono text-[10px] uppercase text-purple-400 font-bold flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5" />
                  Perguntas Críticas para o Comitê de Stage-Gate:
                </span>
                <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
                  {analysis.criticalGateQuestions.map((q, idx) => (
                    <li key={idx} className="text-[11px] leading-snug">
                      {q}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Timeline & Effort Estimate */}
            {analysis.effortAndTimelineEstimate && (
              <div className="p-3 bg-slate-950 rounded border border-slate-800 flex items-center gap-3">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <div className="text-[11px]">
                  <span className="text-slate-400 block font-mono text-[10px] uppercase">
                    Estimativa de Tempo & Esforço para Próximo Gate:
                  </span>
                  <span className="text-slate-200 font-semibold">{analysis.effortAndTimelineEstimate}</span>
                </div>
              </div>
            )}

            {/* Action Plan */}
            {analysis.actionPlan && analysis.actionPlan.length > 0 && (
              <div className="bg-slate-950 p-4 rounded border border-slate-800 space-y-2">
                <span className="font-mono text-[10px] uppercase text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Plano de Ação Sugerido para Fechamento dos Gaps:
                </span>
                <div className="space-y-1.5">
                  {analysis.actionPlan.map((action, idx) => (
                    <div
                      key={idx}
                      className="p-2 bg-slate-900 rounded border border-slate-800 text-[11px] text-slate-200 flex items-start gap-2"
                    >
                      <span className="font-mono font-bold text-cyan-400 shrink-0">0{idx + 1}.</span>
                      <span>{action}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400 text-xs">
            Nenhuma análise disponível. Clique no botão abaixo para reprocessar.
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
          <button
            onClick={runAnalysis}
            disabled={loading}
            className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Reprocessar Análise</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-medium cursor-pointer"
          >
            Fechar Diagnóstico
          </button>
        </div>
      </div>
    </div>
  );
};
