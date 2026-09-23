import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TechArea } from '../../types';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Building2,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Filter,
  FolderGit2,
  GitFork,
  Layers,
  Plus,
  Search,
  Shield,
  Tag,
  User,
} from 'lucide-react';

export const TechnologyPortfolio: React.FC = () => {
  const {
    technologies,
    applications,
    selectedTechId,
    setSelectedTechId,
    selectedAppId,
    setSelectedAppId,
    setCurrentView,
    addTechnology,
    addApplication,
    activeOrg,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState<string>('ALL');
  const [isTechModalOpen, setIsTechModalOpen] = useState(false);
  const [isAppModalOpen, setIsAppModalOpen] = useState(false);
  const [targetTechForNewApp, setTargetTechForNewApp] = useState<string>('');

  // Form states for new technology
  const [newTechName, setNewTechName] = useState('');
  const [newTechDesc, setNewTechDesc] = useState('');
  const [newTechArea, setNewTechArea] = useState<TechArea>('Life Sciences');
  const [newTechCategory, setNewTechCategory] = useState('');
  const [newTechIntendedUse, setNewTechIntendedUse] = useState('');
  const [newTechTargetUser, setNewTechTargetUser] = useState('');
  const [newTechEnv, setNewTechEnv] = useState('');
  const [newTechProblem, setNewTechProblem] = useState('');
  const [newTechOwners, setNewTechOwners] = useState('');
  const [newTechVersion, setNewTechVersion] = useState('v1.0');

  // Form states for new application
  const [newAppName, setNewAppName] = useState('');
  const [newAppDesc, setNewAppDesc] = useState('');
  const [newAppIntendedUse, setNewAppIntendedUse] = useState('');
  const [newAppMarket, setNewAppMarket] = useState('');

  const techAreasList: TechArea[] = [
    'Life Sciences',
    'Healthcare',
    'HealthTech',
    'MedTech',
    'Biotecnologia',
    'Nanotecnologia',
    'Diagnóstico',
    'Dispositivos Médicos',
    'Biomateriais',
    'Fármacos e DDS',
    'Software Médico',
    'DeepTech',
  ];

  const filteredTechnologies = technologies.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.intendedUse.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesArea = selectedArea === 'ALL' || t.techArea === selectedArea;
    return matchesSearch && matchesArea;
  });

  const handleCreateTech = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTechName.trim()) return;

    const ownersList = newTechOwners.split(',').map((s) => s.trim()).filter(Boolean);

    addTechnology({
      name: newTechName,
      description: newTechDesc,
      organizationId: activeOrg?.id || 'ORG-01',
      owners: ownersList.length ? ownersList : ['Pesquisador Responsável'],
      techArea: newTechArea,
      category: newTechCategory || 'Plataforma Tecnológica',
      intendedUse: newTechIntendedUse,
      targetUser: newTechTargetUser || 'Pesquisadores e Especialistas',
      environmentOfUse: newTechEnv || 'Laboratório / Hospital',
      problemSolved: newTechProblem,
      currentVersion: newTechVersion || 'v1.0',
      status: 'Em Validação',
      intellectualProperty: [],
      partnerIds: [],
    });

    setIsTechModalOpen(false);
    // Reset form
    setNewTechName('');
    setNewTechDesc('');
    setNewTechIntendedUse('');
    setNewTechProblem('');
  };

  const handleCreateApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppName.trim() || !targetTechForNewApp) return;

    addApplication({
      technologyId: targetTechForNewApp,
      name: newAppName,
      description: newAppDesc,
      intendedUse: newAppIntendedUse,
      targetMarket: newAppMarket || 'Mercado Geral',
      currentReadiness: {
        TRL: 1,
        PRL: 0,
        MRL: 0,
        RRL: 0,
        QRL: 1,
        VRL: 0,
        CRL: 0,
        IPRL: 1,
        Partnership: 0,
        FRL: 1,
      },
      targetReadiness: {
        TRL: 7,
        PRL: 4,
        MRL: 4,
        RRL: 4,
        QRL: 4,
        VRL: 4,
        CRL: 4,
        IPRL: 4,
        Partnership: 4,
        FRL: 4,
      },
      gapPriorities: {},
      currentGateId: 'GATE-01',
      status: 'Em Desenvolvimento',
      blockers: [],
    });

    setIsAppModalOpen(false);
    setNewAppName('');
    setNewAppDesc('');
    setNewAppIntendedUse('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <span>Portfólio de Ativos Tecnológicos & Aplicações</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Gestão multinível de tecnologias e matriz de maturidade individualizada por aplicação pretendida.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsTechModalOpen(true)}
            className="flex items-center gap-1.5 bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-1.5 rounded text-xs font-semibold shadow-sm transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Novo Ativo Tecnológico</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por ID, nome, indicação de uso ou palavras-chave..."
            className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Área Tecnológica:</span>
          </div>
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer"
          >
            <option value="ALL">Todas as Áreas ({technologies.length})</option>
            {techAreasList.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Technology List & Multi-Application Hierarchy */}
      <div className="space-y-4">
        {filteredTechnologies.map((tech) => {
          const techApps = applications.filter((a) => a.technologyId === tech.id);
          const isCurrentActive = tech.id === selectedTechId;

          return (
            <div
              key={tech.id}
              className={`bg-slate-900 border rounded-lg overflow-hidden transition ${
                isCurrentActive
                  ? 'border-cyan-500/60 shadow-md shadow-cyan-950/40'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Technology Header Bar */}
              <div className="p-4 bg-slate-900/90 border-b border-slate-800/80">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded">
                        {tech.id}
                      </span>
                      <span className="text-xs font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                        {tech.techArea}
                      </span>
                      <span className="text-xs font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                        {tech.currentVersion}
                      </span>
                      <span
                        className={`text-xs font-mono px-2 py-0.5 rounded border ${
                          tech.status === 'Ativo'
                            ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800'
                            : 'bg-amber-950/60 text-amber-400 border-amber-800'
                        }`}
                      >
                        {tech.status}
                      </span>
                    </div>

                    <h2 className="text-base font-bold text-slate-100 tracking-tight">{tech.name}</h2>
                    <p className="text-xs text-slate-400 line-clamp-2">{tech.description}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        setSelectedTechId(tech.id);
                        if (techApps.length > 0) setSelectedAppId(techApps[0].id);
                        setCurrentView('technology-detail');
                      }}
                      className="text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <span>Ficha Técnica Completa</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setTargetTechForNewApp(tech.id);
                        setIsAppModalOpen(true);
                      }}
                      className="text-xs font-medium bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-700/60 px-3 py-1.5 rounded flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Nova Aplicação</span>
                    </button>
                  </div>
                </div>

                {/* Metadata badges: Intended Use, Target User, Problem */}
                <div className="mt-3 pt-3 border-t border-slate-800/60 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-400">
                  <div>
                    <span className="font-mono text-[10px] uppercase text-slate-400 block">Intended Use:</span>
                    <span className="text-slate-300 line-clamp-1">{tech.intendedUse}</span>
                  </div>
                  <div>
                    <span className="font-mono text-[10px] uppercase text-slate-400 block">Usuário Pretendido:</span>
                    <span className="text-slate-300 line-clamp-1">{tech.targetUser}</span>
                  </div>
                  <div>
                    <span className="font-mono text-[10px] uppercase text-slate-400 block">Propriedade Intelectual:</span>
                    <span className="text-cyan-400 font-mono">
                      {tech.intellectualProperty.length} registro(s) associado(s)
                    </span>
                  </div>
                </div>
              </div>

              {/* Sub-Applications Tree (Section 1 Principle) */}
              <div className="p-4 bg-slate-950/60">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
                      Aplicações Derivadas & Vetor de Maturidade Individual ({techApps.length}):
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    O TRL da plataforma tecnológica não representa automaticamente o TRL de todas as suas aplicações.
                  </span>
                </div>

                {techApps.length === 0 ? (
                  <div className="p-3 text-center text-xs text-slate-400 border border-dashed border-slate-800 rounded">
                    Nenhuma aplicação cadastrada ainda para este ativo.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {techApps.map((app) => {
                      const isSelected = app.id === selectedAppId;
                      return (
                        <div
                          key={app.id}
                          className={`p-3 rounded border text-xs flex flex-col justify-between transition ${
                            isSelected
                              ? 'bg-amber-950/40 border-amber-500/70 shadow-sm'
                              : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="font-mono text-[11px] font-bold text-amber-400">
                                {app.id}
                              </span>
                              <span
                                className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                                  app.status === 'Aprovado'
                                    ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                                    : app.status === 'Em Gate Review'
                                    ? 'bg-purple-950 text-purple-300 border-purple-800'
                                    : 'bg-slate-800 text-slate-300 border-slate-700'
                                }`}
                              >
                                {app.status}
                              </span>
                            </div>
                            <h3 className="font-semibold text-slate-100 text-xs mb-1 line-clamp-2">
                              {app.name}
                            </h3>
                            <p className="text-[11px] text-slate-400 line-clamp-2 mb-2">
                              {app.description}
                            </p>
                          </div>

                          {/* Readiness Mini-Vector Grid */}
                          <div>
                            <div className="grid grid-cols-5 gap-1 text-center font-mono text-[10px] bg-slate-950 p-1.5 rounded border border-slate-800 mb-2">
                              <div>
                                <span className="text-slate-400 block">TRL</span>
                                <span className="font-bold text-cyan-400">{app.currentReadiness.TRL}/9</span>
                              </div>
                              <div>
                                <span className="text-slate-400 block">PRL</span>
                                <span className="font-bold text-slate-200">{app.currentReadiness.PRL}/5</span>
                              </div>
                              <div>
                                <span className="text-slate-400 block">MRL</span>
                                <span className="font-bold text-slate-200">{app.currentReadiness.MRL}/5</span>
                              </div>
                              <div>
                                <span className="text-slate-400 block">RRL</span>
                                <span className="font-bold text-amber-400">{app.currentReadiness.RRL}/5</span>
                              </div>
                              <div>
                                <span className="text-slate-400 block">CRL</span>
                                <span className="font-bold text-emerald-400">{app.currentReadiness.CRL}/5</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-1">
                              <span className="text-[10px] font-mono text-purple-300">
                                {app.currentGateId}
                              </span>
                              <button
                                onClick={() => {
                                  setSelectedTechId(tech.id);
                                  setSelectedAppId(app.id);
                                  setCurrentView('readiness');
                                }}
                                className="text-[11px] text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 cursor-pointer"
                              >
                                <span>Avaliar Níveis</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: New Technology */}
      {isTechModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Cadastrar Novo Ativo Tecnológico</span>
              </h3>
              <button
                onClick={() => setIsTechModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTech} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nome da Tecnologia / Produto *</label>
                <input
                  type="text"
                  required
                  value={newTechName}
                  onChange={(e) => setNewTechName(e.target.value)}
                  placeholder="Ex: Plataforma de Nanocarreadores Lipídicos para Liberação de Fármacos"
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Área Tecnológica</label>
                  <select
                    value={newTechArea}
                    onChange={(e) => setNewTechArea(e.target.value as TechArea)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200"
                  >
                    {techAreasList.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Categoria / Classe</label>
                  <input
                    type="text"
                    value={newTechCategory}
                    onChange={(e) => setNewTechCategory(e.target.value)}
                    placeholder="Ex: Drug Delivery System / Dispositivo Médico IIb"
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Descrição Geral da Tecnologia</label>
                <textarea
                  rows={2}
                  value={newTechDesc}
                  onChange={(e) => setNewTechDesc(e.target.value)}
                  placeholder="Explique o princípio científico e a arquitetura técnica..."
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Finalidade Pretendida (Intended Use) *</label>
                  <input
                    type="text"
                    required
                    value={newTechIntendedUse}
                    onChange={(e) => setNewTechIntendedUse(e.target.value)}
                    placeholder="Para que serve especificamente"
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Usuário Pretendido</label>
                  <input
                    type="text"
                    value={newTechTargetUser}
                    onChange={(e) => setNewTechTargetUser(e.target.value)}
                    placeholder="Ex: Oncologistas, farmacêuticos, laboratoristas"
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Ambiente de Utilização</label>
                  <input
                    type="text"
                    value={newTechEnv}
                    onChange={(e) => setNewTechEnv(e.target.value)}
                    placeholder="Ex: Salas limpas BPF, UTI hospitalar, laboratório analítico"
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Versão Inicial</label>
                  <input
                    type="text"
                    value={newTechVersion}
                    onChange={(e) => setNewTechVersion(e.target.value)}
                    placeholder="v1.0"
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Problema que Resolve</label>
                <textarea
                  rows={2}
                  value={newTechProblem}
                  onChange={(e) => setNewTechProblem(e.target.value)}
                  placeholder="Qual gargalo clínico, analítico ou produtivo este ativo soluciona?"
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Responsáveis Técnicos / PIs (separar por vírgula)</label>
                <input
                  type="text"
                  value={newTechOwners}
                  onChange={(e) => setNewTechOwners(e.target.value)}
                  placeholder="Dra. Helena Vasconcelos, Dr. Carlos Menezes"
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsTechModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded cursor-pointer"
                >
                  Salvar Ativo Tecnológico
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New Application */}
      {isAppModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-lg max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-400" />
                <span>Nova Aplicação para {targetTechForNewApp}</span>
              </h3>
              <button
                onClick={() => setIsAppModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateApp} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nome da Aplicação *</label>
                <input
                  type="text"
                  required
                  value={newAppName}
                  onChange={(e) => setNewAppName(e.target.value)}
                  placeholder="Ex: Aplicação 2: Formulação Tópica Nanocosmecêutica"
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Descrição do Escopo</label>
                <textarea
                  rows={2}
                  value={newAppDesc}
                  onChange={(e) => setNewAppDesc(e.target.value)}
                  placeholder="Finalidade e especificidades desta aplicação..."
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Uso Pretendido Específico (Intended Use) *</label>
                <input
                  type="text"
                  required
                  value={newAppIntendedUse}
                  onChange={(e) => setNewAppIntendedUse(e.target.value)}
                  placeholder="Ex: Regeneração de barreira cutânea em pós-cirúrgico"
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Mercado / Segmento Alvo</label>
                <input
                  type="text"
                  value={newAppMarket}
                  onChange={(e) => setNewAppMarket(e.target.value)}
                  placeholder="Ex: Dermatologia regenerativa e clínicas de queimados"
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200"
                />
              </div>

              <div className="p-3 bg-amber-950/30 border border-amber-900/50 rounded text-amber-300 text-[11px]">
                Esta nova aplicação iniciará com vetor próprio em TRL 1 e acompanhará seu ciclo de maturidade e
                evidências de forma completamente independente da plataforma principal.
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAppModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded cursor-pointer"
                >
                  Criar Aplicação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
