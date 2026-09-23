import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { ExecutiveDashboard } from './components/dashboard/ExecutiveDashboard';
import { TechnologyPortfolio } from './components/technologies/TechnologyPortfolio';
import { TechnologyDetail } from './components/technologies/TechnologyDetail';
import { ReadinessMatrix } from './components/readiness/ReadinessMatrix';
import { EvidenceManager } from './components/evidence/EvidenceManager';
import { RequirementTraceabilityMatrix } from './components/rtm/RequirementTraceabilityMatrix';
import { GapManagement } from './components/gaps/GapManagement';
import { StageGateView } from './components/stagegate/StageGateView';
import { TechnologyRoadmap } from './components/roadmap/TechnologyRoadmap';
import { RiskRegister } from './components/risks/RiskRegister';
import { FinancialModule } from './components/financial/FinancialModule';
import { PartnerDirectory } from './components/partners/PartnerDirectory';
import { DocumentRepository } from './components/documents/DocumentRepository';
import { AuditLogView } from './components/audit/AuditLogView';
import { ExecutiveReport } from './components/reports/ExecutiveReport';
import { AIDiagnosticModal } from './components/ai/AIDiagnosticModal';

const MainLayout: React.FC = () => {
  const { currentView, currentTech, currentApp } = useApp();
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  const openAIModal = () => setIsAIModalOpen(true);
  const closeAIModal = () => setIsAIModalOpen(false);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <ExecutiveDashboard onOpenAI={openAIModal} />;
      case 'technologies':
        return <TechnologyPortfolio />;
      case 'tech-detail':
        return <TechnologyDetail />;
      case 'readiness':
        return <ReadinessMatrix onOpenAI={openAIModal} />;
      case 'evidence':
        return <EvidenceManager />;
      case 'rtm':
        return <RequirementTraceabilityMatrix />;
      case 'gaps':
        return <GapManagement onOpenAI={openAIModal} />;
      case 'stagegate':
        return <StageGateView onOpenAI={openAIModal} />;
      case 'roadmap':
        return <TechnologyRoadmap />;
      case 'risks':
        return <RiskRegister />;
      case 'financial':
        return <FinancialModule />;
      case 'partners':
        return <PartnerDirectory />;
      case 'documents':
        return <DocumentRepository />;
      case 'audit':
        return <AuditLogView />;
      case 'reports':
        return <ExecutiveReport />;
      default:
        return <ExecutiveDashboard onOpenAI={openAIModal} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Telemetry & Control Header */}
      <Header onOpenAI={openAIModal} />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Precision Navigation Column */}
        <Sidebar onOpenAI={openAIModal} />

        {/* Main Operational Viewport */}
        <main className="flex-1 overflow-y-auto p-5 md:p-6 lg:p-8 space-y-6 pb-16">
          {renderCurrentView()}
        </main>
      </div>

      {/* Bottom Telemetry & Status Ribbon */}
      <footer className="h-7 bg-slate-950 border-t border-slate-800 px-4 flex items-center justify-between text-[10px] font-mono text-slate-400 select-none z-10 shrink-0">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>SISTEMA DE GESTÃO TECNOLÓGICA OPERACIONAL</span>
          </span>
          <span className="hidden sm:inline text-slate-400">|</span>
          <span className="hidden sm:inline">
            ATIVO SELECIONADO: <strong className="text-slate-300">{currentTech?.id}</strong> (
            {currentApp?.id})
          </span>
          <span className="hidden md:inline text-slate-400">|</span>
          <span className="hidden md:inline">
            GATE ATUAL: <strong className="text-purple-300">{currentApp?.currentGateId}</strong>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-slate-400 hidden lg:inline">ANVISA RDC 751 / FDA 21 CFR 11 / ISO 13485</span>
          <span className="text-cyan-400 font-semibold">TRL PLATAFORMA v2.4</span>
        </div>
      </footer>

      {/* AI Diagnostic Modal */}
      <AIDiagnosticModal isOpen={isAIModalOpen} onClose={closeAIModal} />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
