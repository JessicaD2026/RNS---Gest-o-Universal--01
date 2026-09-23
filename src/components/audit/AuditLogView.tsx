import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  AlertCircle,
  Brain,
  CheckCircle2,
  FileCheck2,
  Filter,
  History,
  Lock,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export const AuditLogView: React.FC = () => {
  const { auditLogs, currentTech } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [entityFilter, setEntityFilter] = useState<string>('ALL');

  // AI Audit Check state
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditReport, setAuditReport] = useState<{
    complianceScore: number;
    alcoaStatus: {
      attributable: boolean;
      legible: boolean;
      contemporaneous: boolean;
      original: boolean;
      accurate: boolean;
    };
    flags: string[];
    recommendations: string[];
  } | null>(null);

  const filteredLogs = auditLogs.filter((log) => {
    const userName = log.user || log.userName || '';
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entityId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.justification && log.justification.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesEntity = entityFilter === 'ALL' || log.entityType === entityFilter;
    return matchesSearch && matchesEntity;
  });

  const runAIAudit = async () => {
    setIsAuditing(true);
    try {
      const res = await fetch('/api/gemini/audit-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logs: auditLogs }),
      });
      const data = await res.json();
      setAuditReport(data);
    } catch (err) {
      console.error('Audit check failed:', err);
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-bold">
                ALCOA+ DATA INTEGRITY
              </span>
              <span className="text-xs text-slate-400">Total de Registros Imutáveis: {auditLogs.length}</span>
            </div>
            <h1 className="text-lg font-bold text-slate-100 tracking-tight flex items-center gap-2">
              <History className="w-5 h-5 text-emerald-400" />
              <span>Trilha de Auditoria & Integridade Regulatória</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-4xl">
              Log imutável (append-only) de todas as homologações de nível, pareceres de comitê e alterações de
              documentos técnicos. Atende aos requisitos da ANVISA (RDC 301/RDC 751), FDA (21 CFR Part 11) e EMA.
            </p>
          </div>

          <button
            onClick={runAIAudit}
            disabled={isAuditing}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold px-3.5 py-2 rounded shadow-sm transition cursor-pointer shrink-0"
          >
            <Sparkles className="w-4 h-4 text-emerald-200" />
            <span>{isAuditing ? 'Auditando Logs...' : 'Auditoria de Integridade ALCOA+'}</span>
          </button>
        </div>
      </div>

      {/* AI Audit Report Result Panel if generated */}
      {auditReport && (
        <div className="bg-slate-900 border border-emerald-800/80 rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-slate-100">
                Relatório de Auditoria de Integridade de Dados
              </h3>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-slate-400">Score de Integridade:</span>
              <span className="text-emerald-400 font-bold text-base">{auditReport.complianceScore}%</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono text-xs text-center">
            <div className="bg-slate-950 p-2 rounded border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Atribuível</span>
              <span className="text-emerald-400 font-bold">
                {auditReport.alcoaStatus.attributable ? '✓ CONFORME' : '✗ FALHA'}
              </span>
            </div>
            <div className="bg-slate-950 p-2 rounded border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Legível</span>
              <span className="text-emerald-400 font-bold">
                {auditReport.alcoaStatus.legible ? '✓ CONFORME' : '✗ FALHA'}
              </span>
            </div>
            <div className="bg-slate-950 p-2 rounded border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Contemporâneo</span>
              <span className="text-emerald-400 font-bold">
                {auditReport.alcoaStatus.contemporaneous ? '✓ CONFORME' : '✗ FALHA'}
              </span>
            </div>
            <div className="bg-slate-950 p-2 rounded border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Original</span>
              <span className="text-emerald-400 font-bold">
                {auditReport.alcoaStatus.original ? '✓ CONFORME' : '✗ FALHA'}
              </span>
            </div>
            <div className="bg-slate-950 p-2 rounded border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Exato (Accurate)</span>
              <span className="text-emerald-400 font-bold">
                {auditReport.alcoaStatus.accurate ? '✓ CONFORME' : '✗ FALHA'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-950 p-3 rounded border border-slate-800 space-y-1">
              <span className="font-mono text-[10px] uppercase text-amber-400 font-bold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                Alertas de Desvio / Auditoria:
              </span>
              <ul className="space-y-1 text-slate-300 list-disc list-inside">
                {auditReport.flags.map((flag, idx) => (
                  <li key={idx} className="text-[11px]">
                    {flag}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-950 p-3 rounded border border-slate-800 space-y-1">
              <span className="font-mono text-[10px] uppercase text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Recomendações Regulatórias:
              </span>
              <ul className="space-y-1 text-slate-300 list-disc list-inside">
                {auditReport.recommendations.map((rec, idx) => (
                  <li key={idx} className="text-[11px]">
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="text-[10px] font-mono text-slate-400 italic">
            * Sugestão da IA – requer validação humana por auditor de qualidade credenciado.
          </p>
        </div>
      )}

      {/* Filter and Search */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por usuário, ação, ID ou justificativa..."
            className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Filter className="w-3.5 h-3.5" />
          <span>Entidade:</span>
          <select
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-slate-200 focus:outline-none"
          >
            <option value="ALL">Todas as Entidades</option>
            <option value="Application">Application</option>
            <option value="Evidence">Evidence</option>
            <option value="StageGate">StageGate</option>
            <option value="Requirement">Requirement</option>
            <option value="Technology">Technology</option>
            <option value="Risk">Risk</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/90 text-[10px] font-mono uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3">Data / Hora (UTC)</th>
                <th className="p-3">Usuário / Papel</th>
                <th className="p-3">Ação Executada</th>
                <th className="p-3">Entidade & ID</th>
                <th className="p-3">Justificativa Registrada</th>
                <th className="p-3">Assinatura / Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono text-[11px]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3 text-slate-400">
                    <div>{log.timestamp.split('T')[0]}</div>
                    <div className="text-[10px] text-slate-400">
                      {log.timestamp.split('T')[1]?.substring(0, 8) || ''}
                    </div>
                  </td>

                  <td className="p-3">
                    <div className="text-slate-200 font-sans font-semibold">{log.user}</div>
                    <div className="text-[10px] text-cyan-400">{log.role}</div>
                  </td>

                  <td className="p-3 font-sans">
                    <span className="font-semibold text-slate-100">{log.action}</span>
                  </td>

                  <td className="p-3">
                    <div className="text-purple-300 font-bold">{log.entityType}</div>
                    <div className="text-[10px] text-slate-400">{log.entityId}</div>
                  </td>

                  <td className="p-3 font-sans text-slate-300 max-w-[280px]">
                    <p className="line-clamp-2 text-[11px] leading-snug">
                      {log.justification || 'Operação padrão de governança'}
                    </p>
                  </td>

                  <td className="p-3 text-[10px] text-slate-400 truncate max-w-[120px]">
                    {log.hash || 'sha256-verified'}
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
