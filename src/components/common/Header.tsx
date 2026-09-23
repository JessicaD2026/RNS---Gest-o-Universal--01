import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Activity,
  AlertTriangle,
  Award,
  Brain,
  Building2,
  ChevronDown,
  Layers,
  RotateCcw,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { UserRole } from '../../types';

export const Header: React.FC<{ onOpenAI: () => void }> = ({ onOpenAI }) => {
  const {
    activeOrg,
    organizations,
    setActiveOrgId,
    technologies,
    selectedTechId,
    setSelectedTechId,
    applications,
    selectedAppId,
    setSelectedAppId,
    currentTech,
    currentApp,
    currentUser,
    setCurrentUserRole,
    resetAllDataToDefaults,
  } = useApp();

  const availableRoles: UserRole[] = [
    'Governança',
    'Gestor de Portfólio',
    'Pesquisador',
    'Gestor de Projeto',
    'Avaliador',
    'Especialista',
    'Administrador',
    'Visualizador',
  ];

  const currentTechApps = applications.filter((a) => a.technologyId === selectedTechId);

  return (
    <header className="h-14 bg-slate-900/90 backdrop-blur border-b border-slate-800/80 px-4 flex items-center justify-between sticky top-0 z-30 select-none">
      {/* LEFT ZONE: Brand & Entity Switchers */}
      <div className="flex items-center gap-3">
        {/* Organization Switcher */}
        <div className="flex items-center gap-2 pr-3 border-r border-slate-800">
          <div className="w-8 h-8 rounded bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Building2 className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-mono text-slate-400 tracking-wider">Organização</span>
            <select
              value={activeOrg?.id}
              onChange={(e) => setActiveOrgId(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-200 hover:text-cyan-400 cursor-pointer focus:outline-none focus:ring-1 focus:ring-cyan-500 rounded py-0.5"
            >
              {organizations.map((org) => (
                <option key={org.id} value={org.id} className="bg-slate-900 text-slate-200">
                  {org.acronym} – {org.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Technology Switcher */}
        <div className="flex items-center gap-2 pr-3 border-r border-slate-800 max-w-[280px]">
          <Layers className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] uppercase font-mono text-slate-400 tracking-wider">Ativo Tecnológico</span>
            <select
              value={selectedTechId}
              onChange={(e) => setSelectedTechId(e.target.value)}
              className="bg-transparent text-xs font-medium text-slate-200 truncate cursor-pointer focus:outline-none focus:ring-1 focus:ring-cyan-500 rounded py-0.5"
            >
              {technologies.map((t) => (
                <option key={t.id} value={t.id} className="bg-slate-900 text-slate-200">
                  {t.id}: {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Application Switcher (Multi-Application Principle) */}
        {currentTechApps.length > 0 && (
          <div className="flex items-center gap-2 max-w-[260px]">
            <Activity className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] uppercase font-mono text-slate-400 tracking-wider">Aplicação Específica</span>
              <select
                value={selectedAppId}
                onChange={(e) => setSelectedAppId(e.target.value)}
                className="bg-transparent text-xs font-medium text-amber-300 truncate cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-500 rounded py-0.5"
              >
                {currentTechApps.map((app) => (
                  <option key={app.id} value={app.id} className="bg-slate-900 text-slate-200">
                    {app.id}: {app.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* CENTER ZONE: Telemetry Ribbon */}
      <div className="hidden xl:flex items-center gap-4 bg-slate-950/60 border border-slate-800 rounded px-3 py-1 font-mono text-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400">TRL:</span>
          <span className="font-bold text-cyan-400 bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-800/60">
            {currentApp?.currentReadiness.TRL || 1} / 9
          </span>
        </div>

        <div className="h-3 w-px bg-slate-800" />

        <div className="flex items-center gap-1.5">
          <span className="text-slate-400">CRL:</span>
          <span className="font-bold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800/60">
            {currentApp?.currentReadiness.CRL || 0} / 5
          </span>
        </div>

        <div className="h-3 w-px bg-slate-800" />

        <div className="flex items-center gap-1.5">
          <span className="text-slate-400">RRL:</span>
          <span className="font-bold text-amber-400 bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-800/60">
            {currentApp?.currentReadiness.RRL || 0} / 5
          </span>
        </div>

        <div className="h-3 w-px bg-slate-800" />

        <div className="flex items-center gap-1.5">
          <span className="text-slate-400">Gate Atual:</span>
          <span className="text-purple-300 font-semibold">{currentApp?.currentGateId || 'GATE-01'}</span>
        </div>

        {currentApp?.blockers && currentApp.blockers.length > 0 && (
          <>
            <div className="h-3 w-px bg-slate-800" />
            <div className="flex items-center gap-1 text-rose-400">
              <AlertTriangle className="w-3.5 h-3.5 animate-pulse" />
              <span>{currentApp.blockers.length} Bloqueador(es)</span>
            </div>
          </>
        )}
      </div>

      {/* RIGHT ZONE: Role Switcher & Actions */}
      <div className="flex items-center gap-3">
        {/* Role Switcher */}
        <div className="flex items-center gap-2 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded px-2.5 py-1">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <div className="flex flex-col">
            <span className="text-[9px] uppercase font-mono text-slate-400">Perfil Ativo</span>
            <select
              value={currentUser.role}
              onChange={(e) => setCurrentUserRole(e.target.value as UserRole)}
              className="bg-transparent text-xs font-semibold text-slate-200 cursor-pointer focus:outline-none rounded"
            >
              {availableRoles.map((role) => (
                <option key={role} value={role} className="bg-slate-900 text-slate-200">
                  {role}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* AI Assistant Button */}
        <button
          onClick={onOpenAI}
          className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-600/30 to-blue-600/30 hover:from-cyan-600/40 hover:to-blue-600/40 border border-cyan-500/50 hover:border-cyan-400 text-cyan-200 px-2.5 py-1.5 rounded text-xs font-medium cursor-pointer transition-all shadow-sm"
          title="Abrir Auditoria e Diagnóstico Inteligente com IA"
        >
          <Brain className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="hidden sm:inline">Auditoria IA</span>
        </button>

        {/* Reset State Button */}
        <button
          onClick={() => {
            if (confirm('Deseja restaurar os dados de demonstração originais? Alterações locais serão reiniciadas.')) {
              resetAllDataToDefaults();
            }
          }}
          className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition"
          title="Restaurar dados iniciais"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
