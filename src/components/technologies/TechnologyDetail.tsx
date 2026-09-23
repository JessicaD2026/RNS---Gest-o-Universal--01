import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  FileCheck2,
  GitFork,
  History,
  Layers,
  Network,
  Shield,
  Tag,
  User,
  ExternalLink,
} from 'lucide-react';

export const TechnologyDetail: React.FC = () => {
  const {
    currentTech,
    applications,
    partners,
    setSelectedAppId,
    setCurrentView,
    evidences,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'apps' | 'ip' | 'partners' | 'versions'>('overview');

  if (!currentTech) {
    return (
      <div className="p-8 text-center text-slate-400">
        Nenhuma tecnologia selecionada.
      </div>
    );
  }

  const techApps = applications.filter((a) => a.technologyId === currentTech.id);
  const techPartners = partners.filter((p) => currentTech.partnerIds.includes(p.id));
  const techEvidences = evidences.filter((e) =>
    techApps.some((a) => a.id === e.applicationId)
  );

  return (
    <div className="space-y-6">
      {/* Back Button & Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentView('technologies')}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao Portfólio</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded font-bold">
            {currentTech.id}
          </span>
          <span className="text-xs font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
            Versão: {currentTech.currentVersion}
          </span>
          <span
            className={`text-xs font-mono px-2 py-0.5 rounded border ${
              currentTech.status === 'Ativo'
                ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                : 'bg-amber-950 text-amber-400 border-amber-800'
            }`}
          >
            {currentTech.status}
          </span>
        </div>
      </div>

      {/* Main Title Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block mb-1">
              {currentTech.techArea} &bull; {currentTech.category}
            </span>
            <h1 className="text-xl font-bold text-slate-100 tracking-tight">{currentTech.name}</h1>
          </div>

          <button
            onClick={() => setCurrentView('readiness')}
            className="self-start md:self-auto bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold px-4 py-2 rounded flex items-center gap-2 transition cursor-pointer"
          >
            <span>Inspecionar Prontidão</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed max-w-5xl">{currentTech.description}</p>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-800 flex items-center gap-2 text-xs">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3 py-2 border-b-2 font-medium transition cursor-pointer ${
            activeTab === 'overview'
              ? 'border-cyan-400 text-cyan-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Visão Geral & Parâmetros
        </button>
        <button
          onClick={() => setActiveTab('apps')}
          className={`px-3 py-2 border-b-2 font-medium transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'apps'
              ? 'border-cyan-400 text-cyan-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>Aplicações Derivadas</span>
          <span className="text-[10px] font-mono bg-slate-800 px-1.5 py-0.2 rounded text-slate-300">
            {techApps.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('ip')}
          className={`px-3 py-2 border-b-2 font-medium transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'ip'
              ? 'border-cyan-400 text-cyan-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>Propriedade Intelectual</span>
          <span className="text-[10px] font-mono bg-slate-800 px-1.5 py-0.2 rounded text-slate-300">
            {currentTech.intellectualProperty.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('partners')}
          className={`px-3 py-2 border-b-2 font-medium transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'partners'
              ? 'border-cyan-400 text-cyan-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>Parceiros & ICTs</span>
          <span className="text-[10px] font-mono bg-slate-800 px-1.5 py-0.2 rounded text-slate-300">
            {techPartners.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('versions')}
          className={`px-3 py-2 border-b-2 font-medium transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'versions'
              ? 'border-cyan-400 text-cyan-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>Histórico de Versões</span>
          <span className="text-[10px] font-mono bg-slate-800 px-1.5 py-0.2 rounded text-slate-300">
            {currentTech.versionHistory.length}
          </span>
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-3">
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Tag className="w-4 h-4 text-cyan-400" />
              <span>Especificações de Uso Pretendido</span>
            </h3>

            <div className="space-y-2.5 text-xs">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Intended Use:</span>
                <p className="text-slate-200 mt-0.5 leading-relaxed bg-slate-950 p-2.5 rounded border border-slate-800">
                  {currentTech.intendedUse}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Usuário Pretendido:</span>
                <p className="text-slate-200 mt-0.5 bg-slate-950 p-2.5 rounded border border-slate-800">
                  {currentTech.targetUser}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Ambiente de Utilização:</span>
                <p className="text-slate-200 mt-0.5 bg-slate-950 p-2.5 rounded border border-slate-800">
                  {currentTech.environmentOfUse}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-3">
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-cyan-400" />
              <span>Governança & Responsabilidade Técnica</span>
            </h3>

            <div className="space-y-2.5 text-xs">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Problema que Resolve:</span>
                <p className="text-slate-200 mt-0.5 leading-relaxed bg-slate-950 p-2.5 rounded border border-slate-800">
                  {currentTech.problemSolved}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase block">
                  Responsáveis Técnicos / PIs:
                </span>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {currentTech.owners.map((owner, idx) => (
                    <span
                      key={idx}
                      className="bg-slate-950 text-cyan-300 border border-slate-800 px-2 py-1 rounded text-xs flex items-center gap-1.5"
                    >
                      <User className="w-3 h-3 text-cyan-400" />
                      <span>{owner}</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="bg-slate-950 p-2 rounded border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Data de Criação:</span>
                  <span className="text-slate-200 font-mono text-xs">{currentTech.createdAt}</span>
                </div>
                <div className="bg-slate-950 p-2 rounded border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Última Avaliação:</span>
                  <span className="text-cyan-400 font-mono text-xs">{currentTech.lastEvaluatedAt}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'apps' && (
        <div className="space-y-4">
          <div className="p-3 bg-slate-900 border border-slate-800 rounded text-xs text-slate-300">
            Cada aplicação listada abaixo possui sua própria trajetória de desenvolvimento, evidências documentais e
            vetor de maturidade independente.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {techApps.map((app) => (
              <div key={app.id} className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-mono text-xs font-bold text-amber-400">{app.id}</span>
                  <span className="font-mono text-[10px] bg-purple-950 text-purple-300 border border-purple-800 px-2 py-0.5 rounded">
                    {app.currentGateId}
                  </span>
                </div>

                <h4 className="font-bold text-slate-100 text-sm">{app.name}</h4>
                <p className="text-xs text-slate-400">{app.intendedUse}</p>

                <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                    Vetor de Maturidade Atual:
                  </span>
                  <div className="grid grid-cols-5 gap-1.5 text-center font-mono text-xs">
                    <div className="bg-slate-900 p-1 rounded">
                      <span className="text-[9px] text-slate-400 block">TRL</span>
                      <span className="font-bold text-cyan-400">{app.currentReadiness.TRL}/9</span>
                    </div>
                    <div className="bg-slate-900 p-1 rounded">
                      <span className="text-[9px] text-slate-400 block">CRL</span>
                      <span className="font-bold text-emerald-400">{app.currentReadiness.CRL}/5</span>
                    </div>
                    <div className="bg-slate-900 p-1 rounded">
                      <span className="text-[9px] text-slate-400 block">RRL</span>
                      <span className="font-bold text-amber-400">{app.currentReadiness.RRL}/5</span>
                    </div>
                    <div className="bg-slate-900 p-1 rounded">
                      <span className="text-[9px] text-slate-400 block">MRL</span>
                      <span className="font-bold text-slate-200">{app.currentReadiness.MRL}/5</span>
                    </div>
                    <div className="bg-slate-900 p-1 rounded">
                      <span className="text-[9px] text-slate-400 block">VRL</span>
                      <span className="font-bold text-slate-200">{app.currentReadiness.VRL}/5</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => {
                      setSelectedAppId(app.id);
                      setCurrentView('readiness');
                    }}
                    className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Avaliar Níveis Desta Aplicação</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'ip' && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>Registros de Propriedade Intelectual & Freedom to Operate</span>
            </h3>
          </div>

          {currentTech.intellectualProperty.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-400">
              Nenhuma patente ou registro de PI associado.
            </div>
          ) : (
            <div className="space-y-3">
              {currentTech.intellectualProperty.map((ip) => (
                <div key={ip.id} className="bg-slate-950 border border-slate-800 rounded p-3 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-cyan-400 font-bold">
                        {ip.patentNumber || ip.number || ip.id}
                      </span>
                      <span className="font-mono text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded">
                        {ip.type || 'Patente'} &bull; {ip.jurisdiction || ip.territory || 'PCT/BR'}
                      </span>
                    </div>
                    <span
                      className={`font-mono text-[10px] px-2 py-0.5 rounded border ${
                        ip.status === 'Concedida'
                          ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                          : 'bg-amber-950 text-amber-400 border-amber-800'
                      }`}
                    >
                      {ip.status}
                    </span>
                  </div>
                  <h4 className="font-semibold text-slate-200">{ip.title}</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-1 text-[11px] text-slate-400">
                    <div>
                      <span>Depósito: </span>
                      <span className="text-slate-300 font-mono">
                        {ip.depositDate || ip.filingDate || '2024-03-15'}
                      </span>
                    </div>
                    <div>
                      <span>Titularidade: </span>
                      <span className="text-slate-300">
                        {ip.owners?.join(', ') || ip.ownership || 'BioTech Innovations S/A'}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span>FTO Status: </span>
                      <span className="text-emerald-400">
                        {ip.ftoStatus || (ip.status === 'FTO Concluído' ? 'Concluído favorável' : 'Parecer preliminar favorável')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'partners' && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Network className="w-4 h-4 text-cyan-400" />
              <span>Rede de Instituições & Parceiros Envolvidos</span>
            </h3>
          </div>

          {techPartners.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-400">
              Nenhum parceiro externo formalmente vinculado a este ativo.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {techPartners.map((partner) => (
                <div key={partner.id} className="bg-slate-950 border border-slate-800 rounded p-3 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-cyan-400 font-bold">{partner.id}</span>
                    <span className="font-mono text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded">
                      {partner.type}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-200">{partner.name}</h4>
                  <p className="text-[11px] text-slate-400">
                    Papel: {partner.role || partner.partnershipType || 'Cooperação em P&D'}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Competências: {partner.competencies?.join(', ') || 'Validação Analítica'}
                  </p>
                  <div className="pt-1 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                    <span>
                      Acordo: {partner.agreementStatus || partner.agreements?.[0]?.title || 'Acordo Homologado'}
                    </span>
                    <span>
                      Validade: {partner.validUntil || partner.agreements?.[0]?.validity || '2027-12-31'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'versions' && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-4">
          <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <History className="w-4 h-4 text-cyan-400" />
            <span>Linha do Tempo de Versões Técnicas</span>
          </h3>

          <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-800">
            {currentTech.versionHistory.map((ver, idx) => (
              <div key={idx} className="relative flex items-start gap-4 pl-8">
                <div className="absolute left-2 top-1.5 w-3.5 h-3.5 rounded-full bg-cyan-950 border border-cyan-400 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded p-3 text-xs flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-cyan-400 text-xs">{ver.version}</span>
                    <span className="font-mono text-[10px] text-slate-400">{ver.date}</span>
                  </div>
                  <p className="text-slate-300 text-xs">{ver.notes}</p>
                  <span className="text-[10px] text-slate-400 block mt-1">Autor: {ver.author}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
