import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Partner, PartnerType } from '../../types';
import {
  Building,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileCheck2,
  Filter,
  Network,
  Plus,
  Search,
  Shield,
  Tag,
} from 'lucide-react';

export const PartnerDirectory: React.FC = () => {
  const { partners, addPartner, currentTech } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states for new partner
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<PartnerType>('ICT / Universidade');
  const [newRole, setNewRole] = useState('');
  const [newCompetencies, setNewCompetencies] = useState('');
  const [newInfra, setNewInfra] = useState('');
  const [newAgreement, setNewAgreement] = useState('Acordo de Cooperação Vigente');

  const partnerTypes: PartnerType[] = [
    'ICT / Universidade',
    'CRO (Pesquisa Contratada)',
    'CMO (Fabricação Contratada)',
    'Hospital / Centro Clínico',
    'Laboratório Analítico',
    'Empresa Co-desenvolvedora',
    'Investidor / Fundo',
  ];

  const filteredPartners = partners.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.role && p.role.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = typeFilter === 'ALL' || p.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleCreatePartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    addPartner({
      name: newName,
      type: newType,
      role: newRole || 'Cooperação Científica e Tecnológica',
      competencies: newCompetencies.split(',').map((s) => s.trim()).filter(Boolean),
      infrastructure: newInfra ? [newInfra] : ['Infraestrutura Laboratorial Certificada'],
      agreementStatus: newAgreement,
      validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      evidencesGenerated: [],
    });

    setIsModalOpen(false);
    setNewName('');
    setNewRole('');
    setNewCompetencies('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded font-bold">
                REDE COLABORATIVA
              </span>
              <span className="text-xs text-slate-400">Total de Parceiros Homologados: {partners.length}</span>
            </div>
            <h1 className="text-lg font-bold text-slate-100 tracking-tight flex items-center gap-2">
              <Network className="w-5 h-5 text-cyan-400" />
              <span>Rede de Parceiros, ICTs, CROs & Hospitais de Pesquisa</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-4xl">
              Gestão de acordos formais (MOU, NDA, MTA, Contrato de Co-desenvolvimento), infraestrutura analítica e
              rastreabilidade das evidências geradas por terceiros qualificados.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold px-3.5 py-2 rounded shadow-sm transition cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Cadastrar Novo Parceiro</span>
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
            placeholder="Buscar por instituição, competências ou papel..."
            className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Filter className="w-3.5 h-3.5" />
          <span>Tipo:</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-slate-200 focus:outline-none"
          >
            <option value="ALL">Todos os Tipos</option>
            {partnerTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Partners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPartners.map((partner) => (
          <div
            key={partner.id}
            className="bg-slate-900 border border-slate-800 rounded-lg p-4 text-xs space-y-3 flex flex-col justify-between hover:border-slate-700 transition"
          >
            <div>
              <div className="flex items-center justify-between font-mono text-[10px] mb-1.5">
                <span className="text-cyan-400 font-bold">{partner.id}</span>
                <span className="bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded border border-slate-700">
                  {partner.type}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-100">{partner.name}</h3>
              <p className="text-slate-300 text-xs mt-1">{partner.role}</p>

              <div className="mt-3 pt-2 border-t border-slate-800/80 space-y-2">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Competências Técnicas:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {partner.competencies.map((comp, idx) => (
                      <span
                        key={idx}
                        className="bg-slate-950 text-slate-300 px-1.5 py-0.5 rounded text-[10px] border border-slate-800"
                      >
                        {comp}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Infraestrutura:</span>
                  <p className="text-[11px] text-slate-300 mt-0.5">{partner.infrastructure.join(', ')}</p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
              <div>
                <span className="text-emerald-400 block font-semibold">{partner.agreementStatus}</span>
                <span className="text-slate-400 text-[10px]">Vigência: {partner.validUntil}</span>
              </div>
              <span className="text-cyan-400 text-[10px]">
                {partner.evidencesGenerated?.length || partner.evidencesProduced?.length || 0} evidência(s)
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: New Partner */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-lg max-w-lg w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Network className="w-4 h-4 text-cyan-400" />
                <span>Qualificar Novo Parceiro / ICT</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePartner} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nome da Instituição / Empresa *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ex: Instituto de Pesquisas Tecnológicas (IPT)"
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Tipo de Organização</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as PartnerType)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200"
                >
                  {partnerTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Papel no Desenvolvimento</label>
                <input
                  type="text"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  placeholder="Ex: Ensaios de citotoxicidade in vitro e estabilidade"
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Competências Principais (separar por vírgula)</label>
                <input
                  type="text"
                  value={newCompetencies}
                  onChange={(e) => setNewCompetencies(e.target.value)}
                  placeholder="Ex: Citometria, BPF, ISO 17025, Ensaio com células endoteliais"
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Infraestrutura Disponibilizada</label>
                <input
                  type="text"
                  value={newInfra}
                  onChange={(e) => setNewInfra(e.target.value)}
                  placeholder="Ex: Sala limpa classe ISO 7, Citômetro de fluxo BD, Espectrômetro de massa"
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Status do Instrumento Jurídico</label>
                <input
                  type="text"
                  value={newAgreement}
                  onChange={(e) => setNewAgreement(e.target.value)}
                  placeholder="Ex: Acordo de Parceria Tecnológica e NDA assinados"
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
                  Salvar Parceiro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
