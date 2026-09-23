import React from 'react';
import { useApp, AppView } from '../../context/AppContext';
import {
  Activity,
  AlertOctagon,
  BarChart3,
  BookmarkCheck,
  Brain,
  CalendarDays,
  Coins,
  FileCheck2,
  FileSpreadsheet,
  FileText,
  FolderGit2,
  GitCompare,
  GitFork,
  History,
  Layers,
  Network,
  Radar,
  ShieldAlert,
  Sparkles,
  Users,
} from 'lucide-react';

interface NavGroup {
  title: string;
  items: {
    id: AppView;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }[];
}

export const Sidebar: React.FC<{ onOpenAI: () => void }> = ({ onOpenAI }) => {
  const { currentView, setCurrentView, currentApp, evidences, risks, gates } = useApp();

  const pendingEvidencesCount = evidences.filter((e) => e.status === 'Em análise').length;
  const criticalRisksCount = risks.filter((r) => r.criticality >= 15 && r.status !== 'Encerrado').length;
  const activeGate = gates.find((g) => g.id === currentApp?.currentGateId);

  const navGroups: NavGroup[] = [
    {
      title: 'VISÃO GERAL',
      items: [
        { id: 'dashboard', label: 'Dashboard Executivo', icon: BarChart3 },
        { id: 'technologies', label: 'Portfólio de Ativos', icon: Layers },
      ],
    },
    {
      title: 'GESTÃO DE PRONTIDÃO',
      items: [
        { id: 'readiness', label: 'Matriz Multidimensional', icon: Radar },
        {
          id: 'evidence',
          label: 'Central de Evidências',
          icon: FileCheck2,
          badge: pendingEvidencesCount > 0 ? `${pendingEvidencesCount}` : undefined,
        },
        { id: 'rtm', label: 'Matriz RTM (Rastreabilidade)', icon: BookmarkCheck },
        { id: 'gaps', label: 'Análise de Gaps & Gargalos', icon: GitCompare },
      ],
    },
    {
      title: 'GOVERNANÇA & EXECUÇÃO',
      items: [
        {
          id: 'stagegate',
          label: 'Stage-Gate & Deliberações',
          icon: GitFork,
          badge: activeGate?.decision === 'CONDITIONAL GO' ? 'Condicional' : undefined,
        },
        { id: 'roadmap', label: 'Roadmap Tecnológico', icon: CalendarDays },
        {
          id: 'risks',
          label: 'Matriz de Riscos (FMEA)',
          icon: ShieldAlert,
          badge: criticalRisksCount > 0 ? `${criticalRisksCount}` : undefined,
        },
        { id: 'financial', label: 'Gestão Financeira & Editais', icon: Coins },
        { id: 'partners', label: 'Rede de Parceiros & ICTs', icon: Network },
        { id: 'documents', label: 'Repositório de Documentos', icon: FileSpreadsheet },
      ],
    },
    {
      title: 'AUDITORIA & RELATÓRIOS',
      items: [
        { id: 'history', label: 'Histórico & Trilha de Auditoria', icon: History },
        { id: 'reports', label: 'Central de Relatórios', icon: FileText },
        { id: 'ai-audit', label: 'Auditoria & Diagnóstico com IA', icon: Brain, badge: 'IA' },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
          <Radar className="w-4 h-4 animate-spin-slow" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold tracking-tight text-slate-100 flex items-center gap-1">
            TRMP PLATFORM
            <span className="text-[9px] font-mono bg-cyan-950 text-cyan-400 px-1 py-0.2 rounded border border-cyan-800">
              v2.4
            </span>
          </span>
          <span className="text-[10px] text-slate-400">Technology Readiness Management</span>
        </div>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-5 scrollbar-thin scrollbar-thumb-slate-800">
        {navGroups.map((group) => (
          <div key={group.title} className="space-y-1">
            <h3 className="px-2 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-medium">
              {group.title}
            </h3>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.id === 'ai-audit') {
                        onOpenAI();
                      } else {
                        setCurrentView(item.id);
                      }
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs transition font-medium cursor-pointer ${
                      isActive
                        ? 'bg-cyan-950/70 text-cyan-300 border border-cyan-500/30'
                        : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-300'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                          item.badge === 'IA'
                            ? 'bg-gradient-to-r from-cyan-900 to-blue-900 text-cyan-300 border border-cyan-700/50'
                            : item.badge === 'Condicional'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-rose-950 text-rose-300 border border-rose-800'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom User Telemetry */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 text-xs text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-mono text-[10px] text-slate-300">Modo Governança Ativo</span>
        </div>
        <span className="text-[10px] font-mono text-slate-400">Rastreabilidade 100%</span>
      </div>
    </aside>
  );
};
