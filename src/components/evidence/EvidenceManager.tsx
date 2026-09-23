import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EvidenceCategory, EvidenceStatus, ReadinessDimensionKey } from '../../types';
import { READINESS_DIMENSIONS } from '../../data/dimensions';
import {
  AlertCircle,
  CheckCircle,
  Clock,
  ExternalLink,
  Eye,
  FileCheck2,
  FileText,
  Filter,
  Hash,
  History,
  Lock,
  Plus,
  Search,
  ShieldCheck,
  XCircle,
} from 'lucide-react';

export const EvidenceManager: React.FC = () => {
  const {
    evidences,
    currentTech,
    currentApp,
    addEvidence,
    updateEvidenceStatus,
    currentUser,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDimensionFilter, setSelectedDimensionFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');

  // Form states for new evidence
  const [newTitle, setNewTitle] = useState('');
  const [newDimension, setNewDimension] = useState<ReadinessDimensionKey>('TRL');
  const [newLevel, setNewLevel] = useState<number>(1);
  const [newCategory, setNewCategory] = useState<EvidenceCategory>('Relatório de Ensaio');
  const [newDescription, setNewDescription] = useState('');
  const [newLab, setNewLab] = useState('');
  const [newDocUrl, setNewDocUrl] = useState('');
  const [newHash, setNewHash] = useState('');

  const evidenceCategories: EvidenceCategory[] = [
    'Relatório de Ensaio',
    'Protocolo',
    'Certificado Analítico',
    'Parecer Regulatório',
    'Dossiê Técnico',
    'FMEA / Análise de Risco',
    'Estudo Clínico / Pré-clínico',
    'Parecer de Patente / FTO',
    'Acordo de Parceria',
    'Certificação de Qualidade',
    'Outro',
  ];

  const filteredEvidences = evidences.filter((e) => {
    // Show evidences for current application or current tech
    const matchesApp = e.applicationId === currentApp?.id;
    const authorStr = e.author || e.responsible || '';
    const matchesSearch =
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      authorStr.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDim = selectedDimensionFilter === 'ALL' || e.dimension === selectedDimensionFilter;
    const matchesStatus = selectedStatusFilter === 'ALL' || e.status === selectedStatusFilter;

    return matchesApp && matchesSearch && matchesDim && matchesStatus;
  });

  const selectedEvidence = evidences.find((e) => e.id === selectedEvidenceId);

  const handleCreateEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !currentApp) return;

    // Generate pseudo sha256 hash if empty
    const fileHash = newHash || `sha256-${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;

    addEvidence({
      title: newTitle,
      applicationId: currentApp.id,
      technologyId: currentTech?.id || 'TEC-001',
      dimension: newDimension,
      level: Number(newLevel),
      category: newCategory,
      evidenceType: newCategory,
      requirementId: 'REQ-01',
      description: newDescription,
      author: currentUser.name,
      responsible: currentUser.name,
      labOrOrg: newLab || 'Laboratório de Pesquisa e Desenvolvimento',
      laboratory: newLab || 'Laboratório de Pesquisa e Desenvolvimento',
      date: new Date().toISOString().split('T')[0],
      version: 'v1.0',
      status: 'Em análise',
      fileUrl: newDocUrl || '/documents/evd-doc-sample.pdf',
      fileHash,
    });

    setIsCreateModalOpen(false);
    setNewTitle('');
    setNewDescription('');
  };

  const handleStatusUpdate = (status: EvidenceStatus) => {
    if (!selectedEvidenceId) return;
    updateEvidenceStatus(selectedEvidenceId, status, reviewNotes);
    setReviewNotes('');
    setIsDetailModalOpen(false);
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
            <FileCheck2 className="w-5 h-5 text-emerald-400" />
            <span>Central de Evidências Técnicas & Rastreabilidade</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Repositório de protocolos, relatórios analíticos, laudos e dossiês que sustentam a maturidade.
            Nenhum nível pode ser avançado sem evidência no status "Aprovada".
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-2 rounded shadow-sm transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Cadastrar Nova Evidência</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por ID, título da evidência, responsável..."
            className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Dimensão:</span>
            <select
              value={selectedDimensionFilter}
              onChange={(e) => setSelectedDimensionFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200 focus:outline-none"
            >
              <option value="ALL">Todas</option>
              {Object.keys(READINESS_DIMENSIONS).map((dim) => (
                <option key={dim} value={dim}>
                  {dim}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400">
            <span>Status:</span>
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200 focus:outline-none"
            >
              <option value="ALL">Todos os Status</option>
              <option value="Aprovada">Aprovada</option>
              <option value="Em análise">Em análise</option>
              <option value="Submetida">Submetida</option>
              <option value="Rascunho">Rascunho</option>
              <option value="Reprovada">Reprovada</option>
            </select>
          </div>
        </div>
      </div>

      {/* Evidences Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[10px] font-mono uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3">ID Evidência</th>
                <th className="p-3">Título & Categoria</th>
                <th className="p-3">Dimensão & Nível</th>
                <th className="p-3">Data / Autor</th>
                <th className="p-3">Integridade (Hash)</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredEvidences.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-slate-400">
                    Nenhuma evidência localizada com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredEvidences.map((ev) => (
                  <tr key={ev.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3 font-mono font-bold text-cyan-400">{ev.id}</td>

                    <td className="p-3">
                      <div className="font-semibold text-slate-100 line-clamp-1">{ev.title}</div>
                      <span className="text-[10px] text-slate-400 font-mono">{ev.category}</span>
                    </td>

                    <td className="p-3">
                      <div className="flex items-center gap-1.5 font-mono">
                        <span className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-300 font-bold">
                          {ev.dimension}
                        </span>
                        <span className="text-cyan-400 font-bold">Nível {ev.level}</span>
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="text-slate-200">{ev.author}</div>
                      <div className="text-[10px] font-mono text-slate-400">{ev.date}</div>
                    </td>

                    <td className="p-3">
                      <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400">
                        <Hash className="w-3 h-3 text-cyan-400 shrink-0" />
                        <span className="truncate max-w-[100px]">{ev.fileHash}</span>
                      </div>
                    </td>

                    <td className="p-3">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${
                          ev.status === 'Aprovada'
                            ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                            : ev.status === 'Em análise'
                            ? 'bg-amber-950 text-amber-400 border-amber-800'
                            : ev.status === 'Submetida'
                            ? 'bg-blue-950 text-blue-300 border-blue-800'
                            : ev.status === 'Reprovada'
                            ? 'bg-rose-950 text-rose-400 border-rose-800'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {ev.status}
                      </span>
                    </td>

                    <td className="p-3 text-right">
                      <button
                        onClick={() => {
                          setSelectedEvidenceId(ev.id);
                          setIsDetailModalOpen(true);
                        }}
                        className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 px-2.5 py-1 rounded transition cursor-pointer"
                      >
                        Inspecionar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create Evidence */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-lg max-w-2xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-emerald-400" />
                <span>Registrar Nova Evidência Técnica (ALCOA+)</span>
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEvidence} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Título da Evidência *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex: Relatório de Caracterização Físico-Química e DLS por Zetasizer"
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Dimensão de Maturidade</label>
                  <select
                    value={newDimension}
                    onChange={(e) => setNewDimension(e.target.value as ReadinessDimensionKey)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200"
                  >
                    {Object.keys(READINESS_DIMENSIONS).map((dim) => (
                      <option key={dim} value={dim}>
                        {dim} ({READINESS_DIMENSIONS[dim as ReadinessDimensionKey].name})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nível Alvo</label>
                  <select
                    value={newLevel}
                    onChange={(e) => setNewLevel(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 font-mono"
                  >
                    {READINESS_DIMENSIONS[newDimension].levels.map((lvl) => (
                      <option key={lvl.level} value={lvl.level}>
                        Nível {lvl.level}: {lvl.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Categoria do Documento</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as EvidenceCategory)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200"
                  >
                    {evidenceCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Laboratório Executor / Instalação</label>
                <input
                  type="text"
                  value={newLab}
                  onChange={(e) => setNewLab(e.target.value)}
                  placeholder="Ex: Laboratório de Caracterização de Nanomateriais (LCN/ICT)"
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Descrição e Resultados Chave</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Resumo dos dados brutos, equipamentos calibrados utilizados, critérios de reprodutibilidade..."
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">URL / Link do Arquivo Anexo</label>
                  <input
                    type="text"
                    value={newDocUrl}
                    onChange={(e) => setNewDocUrl(e.target.value)}
                    placeholder="/dossiers/relatorio-tecnico-final.pdf"
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Assinatura SHA-256 (ou deixe vazio p/ auto-gerar)</label>
                  <input
                    type="text"
                    value={newHash}
                    onChange={(e) => setNewHash(e.target.value)}
                    placeholder="sha256: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1f..."
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded text-[11px] text-slate-400">
                A submissão entrará com status <strong>"Em análise"</strong> e será auditada pelo responsável de
                Qualidade/Governança antes de permitir a validação do nível associado.
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded cursor-pointer"
                >
                  Submeter Evidência
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Evidence Details & Governance Approval Workflow */}
      {isDetailModalOpen && selectedEvidence && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-lg max-w-2xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-cyan-400">{selectedEvidence.id}</span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${
                    selectedEvidence.status === 'Aprovada'
                      ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                      : selectedEvidence.status === 'Em análise'
                      ? 'bg-amber-950 text-amber-400 border-amber-800'
                      : 'bg-rose-950 text-rose-400 border-rose-800'
                  }`}
                >
                  {selectedEvidence.status}
                </span>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <h3 className="text-sm font-bold text-slate-100">{selectedEvidence.title}</h3>
                <span className="text-[11px] font-mono text-slate-400">
                  {selectedEvidence.category} &bull; Dimensão: {selectedEvidence.dimension} Nível {selectedEvidence.level}
                </span>
              </div>

              <div className="bg-slate-950 p-3 rounded border border-slate-800">
                <span className="font-mono text-[10px] uppercase text-slate-400 block mb-1">
                  Descrição & Parâmetros Metodológicos:
                </span>
                <p className="text-slate-200 leading-relaxed">{selectedEvidence.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                  <span className="font-mono text-[10px] uppercase text-slate-400 block">Autor / Pesquisador:</span>
                  <span className="text-slate-200 font-semibold">{selectedEvidence.author}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">{selectedEvidence.laboratory}</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                  <span className="font-mono text-[10px] uppercase text-slate-400 block">Data de Registro:</span>
                  <span className="text-slate-200 font-mono">{selectedEvidence.date}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Versão: {selectedEvidence.version}</span>
                </div>
              </div>

              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="font-mono text-[10px] uppercase text-slate-400 block">Integridade de Dados (ALCOA+):</span>
                <div className="font-mono text-[10px] text-cyan-400 break-all mt-0.5">
                  {selectedEvidence.fileHash}
                </div>
              </div>

              {selectedEvidence.approver && (
                <div className="p-2.5 bg-emerald-950/30 border border-emerald-900/50 rounded flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 block">HOMOLOGAÇÃO DE GOVERNANÇA:</span>
                    <span className="text-slate-200 font-semibold">{selectedEvidence.approver}</span>
                  </div>
                  <span className="font-mono text-[11px] text-slate-400">{selectedEvidence.approvalDate}</span>
                </div>
              )}

              {/* History trail */}
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                  Trilha de Auditoria Desta Evidência:
                </span>
                <div className="space-y-1.5 max-h-32 overflow-y-auto">
                  {(selectedEvidence.history || []).map((h, i) => (
                    <div key={i} className="p-2 bg-slate-950 border border-slate-800 rounded text-[11px]">
                      <div className="flex items-center justify-between font-mono text-[10px] text-slate-400">
                        <span className="text-cyan-400 font-bold">{h.action}</span>
                        <span>{h.date} - {h.user}</span>
                      </div>
                      {h.notes && <p className="text-slate-300 mt-1">{h.notes}</p>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Governance Actions Bar */}
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <label className="block text-slate-300 font-semibold">
                  Notas de Avaliação / Justificativa da Deliberação:
                </label>
                <input
                  type="text"
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Parecer da governança, ressalvas ou motivo da aprovação/rejeição..."
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 focus:ring-1 focus:ring-cyan-500"
                />

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[10px] font-mono text-slate-400">
                    Avaliador: {currentUser.name} ({currentUser.role})
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleStatusUpdate('Reprovada')}
                      className="px-3 py-1.5 bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-300 font-semibold rounded cursor-pointer transition"
                    >
                      Reprovar Evidência
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusUpdate('Aprovada')}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded cursor-pointer transition flex items-center gap-1.5"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Aprovar Evidência</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
