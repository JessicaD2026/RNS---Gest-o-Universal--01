import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DocumentCategory, DocumentItem } from '../../types';
import {
  FileSpreadsheet,
  FileText,
  Filter,
  Hash,
  Plus,
  Search,
  ShieldCheck,
  Tag,
} from 'lucide-react';

export const DocumentRepository: React.FC = () => {
  const { documents, addDocument, currentTech, currentUser } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states for new document
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<DocumentCategory>('Relatório Técnico');
  const [newVersion, setNewVersion] = useState('v1.0');
  const [newApprover, setNewApprover] = useState('');

  const docCategories: DocumentCategory[] = [
    'Protocolo',
    'Relatório Técnico',
    'POP / SOP',
    'Certificado de Calibração',
    'Dossiê Regulatório',
    'Patente / Parecer Jurídico',
    'Contrato / Termo',
    'Ata de Reunião / Gate',
  ];

  const filteredDocuments = documents.filter((doc) => {
    const matchesTech = doc.technologyId === currentTech?.id;
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'ALL' || doc.category === categoryFilter;
    return matchesTech && matchesSearch && matchesCat;
  });

  const handleCreateDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !currentTech) return;

    addDocument({
      technologyId: currentTech.id,
      title: newTitle,
      category: newCategory,
      version: newVersion,
      author: currentUser.name,
      approver: newApprover || 'Garantia da Qualidade (QA)',
      date: new Date().toISOString().split('T')[0],
      status: 'Vigente',
      fileHash: `sha256-${Math.random().toString(36).substring(2, 12)}${Math.random().toString(36).substring(2, 12)}`,
    });

    setIsModalOpen(false);
    setNewTitle('');
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
              <FileSpreadsheet className="w-5 h-5 text-cyan-400" />
              <span>Repositório de Documentos Controlados & Dossiês</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-4xl">
              Sistema de gestão eletrônica de documentos (GED) regulatório com controle estrito de versões,
              aprovações de qualidade e assinaturas criptográficas SHA-256.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold px-3.5 py-2 rounded shadow-sm transition cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Registrar Novo Documento</span>
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por ID, título do documento, autor..."
            className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Filter className="w-3.5 h-3.5" />
          <span>Categoria:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-slate-200 focus:outline-none"
          >
            <option value="ALL">Todas as Categorias</option>
            {docCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/90 text-[10px] font-mono uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3">Código</th>
                <th className="p-3">Título do Documento</th>
                <th className="p-3">Categoria</th>
                <th className="p-3">Versão</th>
                <th className="p-3">Autor</th>
                <th className="p-3">Aprovador</th>
                <th className="p-3">Data</th>
                <th className="p-3">Status</th>
                <th className="p-3">Assinatura SHA-256</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredDocuments.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3 font-mono font-bold text-cyan-400">{doc.id}</td>

                  <td className="p-3 font-semibold text-slate-100 max-w-[240px]">
                    <div className="line-clamp-2">{doc.title}</div>
                  </td>

                  <td className="p-3 text-[11px] text-slate-400 font-mono">{doc.category}</td>

                  <td className="p-3 font-mono text-cyan-300 font-bold">{doc.version}</td>

                  <td className="p-3 text-slate-300">{doc.author}</td>

                  <td className="p-3 text-slate-300">{doc.approver}</td>

                  <td className="p-3 font-mono text-slate-400 text-[11px]">{doc.date}</td>

                  <td className="p-3">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${
                        doc.status === 'Vigente'
                          ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                          : doc.status === 'Em revisão'
                          ? 'bg-amber-950 text-amber-300 border-amber-800'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {doc.status}
                    </span>
                  </td>

                  <td className="p-3 font-mono text-[10px] text-slate-400 truncate max-w-[120px]">
                    {doc.fileHash}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: New Document */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-lg max-w-lg w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
                <span>Registrar Documento Controlado</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDoc} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Título do Documento *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex: Procedimento Operacional Padrão: Extração e Purificação de Lipídeos"
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Categoria</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as DocumentCategory)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200"
                  >
                    {docCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Versão</label>
                  <input
                    type="text"
                    value={newVersion}
                    onChange={(e) => setNewVersion(e.target.value)}
                    placeholder="v1.0"
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Aprovador da Qualidade (QA)</label>
                <input
                  type="text"
                  value={newApprover}
                  onChange={(e) => setNewApprover(e.target.value)}
                  placeholder="Dr. Fernando Brandão (Garantia da Qualidade)"
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded cursor-pointer"
                >
                  Salvar Documento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
