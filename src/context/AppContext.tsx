import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  Application,
  AuditLogEntry,
  DocumentItem,
  Evidence,
  EvidenceStatus,
  FinancialMilestone,
  GateDecision,
  MaturityTransitionRecord,
  Organization,
  Partner,
  ReadinessDimensionKey,
  RequirementTraceabilityItem,
  RiskItem,
  RoadmapActivity,
  StageGate,
  Technology,
  User,
  UserRole,
} from '../types';
import {
  INITIAL_APPLICATIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_DOCUMENTS,
  INITIAL_EVIDENCES,
  INITIAL_FINANCIALS,
  INITIAL_GATES,
  INITIAL_MATURITY_HISTORY,
  INITIAL_ORGANIZATIONS,
  INITIAL_PARTNERS,
  INITIAL_RISKS,
  INITIAL_ROADMAP,
  INITIAL_RTM,
  INITIAL_TECHNOLOGIES,
  INITIAL_USERS,
} from '../data/initialData';
import { READINESS_DIMENSIONS } from '../data/dimensions';

export type AppView =
  | 'dashboard'
  | 'technologies'
  | 'technology-detail'
  | 'tech-detail'
  | 'readiness'
  | 'evidence'
  | 'rtm'
  | 'gaps'
  | 'stagegate'
  | 'roadmap'
  | 'risks'
  | 'financial'
  | 'partners'
  | 'documents'
  | 'history'
  | 'reports'
  | 'audit'
  | 'ai-audit';

interface AppContextType {
  // Navigation & View
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  selectedTechId: string;
  setSelectedTechId: (id: string) => void;
  selectedAppId: string;
  setSelectedAppId: (id: string) => void;

  // Selected Entities
  currentTech: Technology | undefined;
  currentApp: Application | undefined;

  // Users & Organizations
  organizations: Organization[];
  activeOrgId: string;
  setActiveOrgId: (id: string) => void;
  activeOrg: Organization | undefined;
  users: User[];
  currentUser: User;
  setCurrentUserRole: (role: UserRole) => void;

  // Data Collections
  technologies: Technology[];
  applications: Application[];
  evidences: Evidence[];
  rtmItems: RequirementTraceabilityItem[];
  gates: StageGate[];
  risks: RiskItem[];
  partners: Partner[];
  financials: FinancialMilestone[];
  documents: DocumentItem[];
  roadmap: RoadmapActivity[];
  maturityHistory: MaturityTransitionRecord[];
  auditLogs: AuditLogEntry[];

  // Mutations
  addTechnology: (tech: Omit<Technology, 'id' | 'createdAt' | 'lastEvaluatedAt' | 'documentsCount' | 'versionHistory'>) => string;
  updateTechnology: (id: string, updates: Partial<Technology>) => void;
  addApplication: (app: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateApplication: (id: string, updates: Partial<Application>) => void;
  updateReadinessLevel: (
    appId: string,
    dimension: ReadinessDimensionKey,
    newLevel: number,
    justification: string
  ) => { success: boolean; message: string };
  addEvidence: (evidence: Omit<Evidence, 'id' | 'history'>) => string;
  updateEvidenceStatus: (evidenceId: string, status: EvidenceStatus, approverNotes?: string) => void;
  addRtmItem: (item: Omit<RequirementTraceabilityItem, 'id'>) => string;
  updateRtmItem: (id: string, updates: Partial<RequirementTraceabilityItem>) => void;
  recordGateDecision: (gateId: string, decision: GateDecision, justification: string, conditions?: string[]) => void;
  addRisk: (risk: Omit<RiskItem, 'id' | 'criticality'>) => string;
  updateRisk: (id: string, updates: Partial<RiskItem>) => void;
  addDocument: (doc: Omit<DocumentItem, 'id' | 'history'>) => string;
  addPartner: (partner: Omit<Partner, 'id'>) => string;
  updateRoadmapActivity: (id: string, updates: Partial<RoadmapActivity>) => void;
  updateFinancial: (id: string, updates: Partial<FinancialMilestone>) => void;
  logAudit: (entry: Omit<AuditLogEntry, 'id' | 'timestamp' | 'userId' | 'userName' | 'userRole'>) => void;
  resetAllDataToDefaults: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_PREFIX = 'trmp_state_';

function loadStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.warn(`[LocalStorage] Error loading ${key}`, e);
    return fallback;
  }
}

function saveStorage<T>(key: string, data: T) {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
  } catch (e) {
    console.warn(`[LocalStorage] Error saving ${key}`, e);
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [selectedTechId, setSelectedTechId] = useState<string>('TEC-01');
  const [selectedAppId, setSelectedAppId] = useState<string>('APP-01-A');

  const [organizations] = useState<Organization[]>(INITIAL_ORGANIZATIONS);
  const [activeOrgId, setActiveOrgId] = useState<string>('ORG-01');
  const [users] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]);

  const [technologies, setTechnologies] = useState<Technology[]>(() =>
    loadStorage('technologies', INITIAL_TECHNOLOGIES)
  );
  const [applications, setApplications] = useState<Application[]>(() =>
    loadStorage('applications', INITIAL_APPLICATIONS)
  );
  const [evidences, setEvidences] = useState<Evidence[]>(() =>
    loadStorage('evidences', INITIAL_EVIDENCES)
  );
  const [rtmItems, setRtmItems] = useState<RequirementTraceabilityItem[]>(() =>
    loadStorage('rtm', INITIAL_RTM)
  );
  const [gates, setGates] = useState<StageGate[]>(() =>
    loadStorage('gates', INITIAL_GATES)
  );
  const [risks, setRisks] = useState<RiskItem[]>(() =>
    loadStorage('risks', INITIAL_RISKS)
  );
  const [partners, setPartners] = useState<Partner[]>(() =>
    loadStorage('partners', INITIAL_PARTNERS)
  );
  const [financials, setFinancials] = useState<FinancialMilestone[]>(() =>
    loadStorage('financials', INITIAL_FINANCIALS)
  );
  const [documents, setDocuments] = useState<DocumentItem[]>(() =>
    loadStorage('documents', INITIAL_DOCUMENTS)
  );
  const [roadmap, setRoadmap] = useState<RoadmapActivity[]>(() =>
    loadStorage('roadmap', INITIAL_ROADMAP)
  );
  const [maturityHistory, setMaturityHistory] = useState<MaturityTransitionRecord[]>(() =>
    loadStorage('maturity_history', INITIAL_MATURITY_HISTORY)
  );
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() =>
    loadStorage('audit_logs', INITIAL_AUDIT_LOGS)
  );

  // Sync to LocalStorage
  useEffect(() => saveStorage('technologies', technologies), [technologies]);
  useEffect(() => saveStorage('applications', applications), [applications]);
  useEffect(() => saveStorage('evidences', evidences), [evidences]);
  useEffect(() => saveStorage('rtm', rtmItems), [rtmItems]);
  useEffect(() => saveStorage('gates', gates), [gates]);
  useEffect(() => saveStorage('risks', risks), [risks]);
  useEffect(() => saveStorage('partners', partners), [partners]);
  useEffect(() => saveStorage('financials', financials), [financials]);
  useEffect(() => saveStorage('documents', documents), [documents]);
  useEffect(() => saveStorage('roadmap', roadmap), [roadmap]);
  useEffect(() => saveStorage('maturity_history', maturityHistory), [maturityHistory]);
  useEffect(() => saveStorage('audit_logs', auditLogs), [auditLogs]);

  // Derived current tech and application
  const currentTech = technologies.find((t) => t.id === selectedTechId) || technologies[0];
  const currentApp =
    applications.find((a) => a.id === selectedAppId && a.technologyId === currentTech?.id) ||
    applications.find((a) => a.technologyId === currentTech?.id) ||
    applications[0];

  const activeOrg = organizations.find((o) => o.id === activeOrgId) || organizations[0];

  const setCurrentUserRole = (role: UserRole) => {
    setCurrentUser((prev) => ({ ...prev, role }));
  };

  const logAudit = (entry: Omit<AuditLogEntry, 'id' | 'timestamp' | 'userId' | 'userName' | 'userRole'>) => {
    const newEntry: AuditLogEntry = {
      id: `AUD-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      ...entry,
    };
    setAuditLogs((prev) => [newEntry, ...prev]);
  };

  const addTechnology = (techData: Omit<Technology, 'id' | 'createdAt' | 'lastEvaluatedAt' | 'documentsCount' | 'versionHistory'>) => {
    const newId = `TEC-0${technologies.length + 1}`;
    const newTech: Technology = {
      ...techData,
      id: newId,
      organizationId: activeOrgId,
      createdAt: new Date().toISOString().split('T')[0],
      lastEvaluatedAt: new Date().toISOString().split('T')[0],
      documentsCount: 0,
      versionHistory: [
        {
          version: techData.currentVersion || 'v1.0',
          date: new Date().toISOString().split('T')[0],
          notes: 'Cadastro inicial do ativo tecnológico na plataforma.',
          author: currentUser.name,
        },
      ],
    };

    setTechnologies((prev) => [...prev, newTech]);
    logAudit({
      entityType: 'Technology',
      entityId: newId,
      action: 'CREATE',
      newValue: newTech.name,
      justification: 'Cadastro de nova tecnologia.',
      version: newTech.currentVersion,
    });

    // Create a default primary application for this technology
    const defaultAppId = `APP-0${technologies.length + 1}-A`;
    const defaultApp: Application = {
      id: defaultAppId,
      technologyId: newId,
      name: `Aplicação Primária: ${newTech.name}`,
      description: newTech.intendedUse,
      intendedUse: newTech.intendedUse,
      targetMarket: 'Mercado Inicial Pretendido',
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
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setApplications((prev) => [...prev, defaultApp]);

    setSelectedTechId(newId);
    setSelectedAppId(defaultAppId);
    return newId;
  };

  const updateTechnology = (id: string, updates: Partial<Technology>) => {
    setTechnologies((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const updated = { ...t, ...updates, lastEvaluatedAt: new Date().toISOString().split('T')[0] };
          logAudit({
            entityType: 'Technology',
            entityId: id,
            action: 'UPDATE',
            newValue: JSON.stringify(updates),
            justification: 'Atualização cadastral da tecnologia.',
            version: updated.currentVersion,
          });
          return updated;
        }
        return t;
      })
    );
  };

  const addApplication = (appData: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>) => {
    const techApps = applications.filter((a) => a.technologyId === appData.technologyId);
    const suffix = String.fromCharCode(65 + techApps.length); // A, B, C...
    const newId = `${appData.technologyId.replace('TEC-', 'APP-')}-${suffix}`;

    const newApp: Application = {
      ...appData,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    setApplications((prev) => [...prev, newApp]);
    logAudit({
      entityType: 'Application',
      entityId: newId,
      action: 'CREATE',
      newValue: newApp.name,
      justification: 'Cadastro de nova aplicação independente para a tecnologia.',
      version: currentTech?.currentVersion || 'v1.0',
    });

    setSelectedAppId(newId);
    return newId;
  };

  const updateApplication = (id: string, updates: Partial<Application>) => {
    setApplications((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const updated = { ...a, ...updates, updatedAt: new Date().toISOString().split('T')[0] };
          logAudit({
            entityType: 'Application',
            entityId: id,
            action: 'UPDATE',
            newValue: JSON.stringify(updates),
            justification: 'Atualização das informações da aplicação.',
            version: currentTech?.currentVersion || 'v1.0',
          });
          return updated;
        }
        return a;
      })
    );
  };

  /**
   * STRICT EVIDENCE-BASED READINESS TRANSITION
   * "O sistema não deve permitir avançar o nível sem evidência"
   * Verifies that approved evidence exists for target level in that dimension!
   */
  const updateReadinessLevel = (
    appId: string,
    dimension: ReadinessDimensionKey,
    newLevel: number,
    justification: string
  ): { success: boolean; message: string } => {
    const app = applications.find((a) => a.id === appId);
    if (!app) return { success: false, message: 'Aplicação não encontrada.' };

    const currentLevel = app.currentReadiness[dimension] || 0;
    if (newLevel === currentLevel) {
      return { success: true, message: 'Nível inalterado.' };
    }

    // If advancing, check if evidence exists and is approved!
    if (newLevel > currentLevel) {
      const validEvidence = evidences.find(
        (e) =>
          e.applicationId === appId &&
          e.dimension === dimension &&
          e.level === newLevel &&
          e.status === 'Aprovada'
      );

      if (!validEvidence) {
        return {
          success: false,
          message: `BLOQUEIO METODOLÓGICO: Não é permitido avançar ${dimension} para o nível ${newLevel} sem pelo menos uma Evidência no status "Aprovada" vinculada a este nível. Registre e aprove a evidência primeiro.`,
        };
      }

      // Check dimension dependency rules
      const dimSpec = READINESS_DIMENSIONS[dimension]?.levels.find((l) => l.level === newLevel);
      if (dimSpec?.dependencies) {
        for (const dep of dimSpec.dependencies) {
          const actualDepLevel = app.currentReadiness[dep.dimension] || 0;
          if (actualDepLevel < dep.minLevel) {
            return {
              success: false,
              message: `DEPENDÊNCIA NÃO ATENDIDA: O avanço de ${dimension} para o nível ${newLevel} requer ${dep.dimension} no mínimo em nível ${dep.minLevel}. Nível atual de ${dep.dimension}: ${actualDepLevel}.`,
            };
          }
        }
      }
    }

    // Apply the change
    const updatedVector = {
      ...app.currentReadiness,
      [dimension]: newLevel,
    };

    setApplications((prev) =>
      prev.map((a) =>
        a.id === appId
          ? {
              ...a,
              currentReadiness: updatedVector,
              updatedAt: new Date().toISOString().split('T')[0],
            }
          : a
      )
    );

    // Record Maturity Transition Record
    const transition: MaturityTransitionRecord = {
      id: `HIST-${Date.now().toString().slice(-6)}`,
      technologyId: app.technologyId,
      applicationId: app.id,
      dimension,
      previousLevel: currentLevel,
      newLevel,
      date: new Date().toISOString().split('T')[0],
      resourcesUsed: 0,
      currency: 'BRL',
      evidencesProduced: evidences
        .filter((e) => e.applicationId === appId && e.dimension === dimension && e.level === newLevel)
        .map((e) => e.id),
      keyBottlenecks: [],
      responsibleUser: currentUser.name,
      auditJustification: justification || `Avanço formal para ${dimension} nível ${newLevel}.`,
    };

    setMaturityHistory((prev) => [transition, ...prev]);

    // Record Audit Log
    logAudit({
      entityType: 'ReadinessAssessment',
      entityId: appId,
      action: 'LEVEL_CHANGE',
      fieldChanged: dimension,
      previousValue: String(currentLevel),
      newValue: String(newLevel),
      justification: justification || `Alteração do nível de ${dimension} de ${currentLevel} para ${newLevel}.`,
      version: currentTech?.currentVersion || 'v1.0',
    });

    return {
      success: true,
      message: `Nível de ${dimension} atualizado com sucesso para ${newLevel} com rastreabilidade registrada.`,
    };
  };

  const addEvidence = (evidenceData: Omit<Evidence, 'id' | 'history'>) => {
    const newId = `EVD-${new Date().getFullYear()}-${String(evidences.length + 1).padStart(3, '0')}`;
    const newEvidence: Evidence = {
      ...evidenceData,
      id: newId,
      history: [
        {
          date: new Date().toISOString().split('T')[0],
          action: 'Criação da Evidência',
          user: currentUser.name,
          notes: 'Registro inicial da evidência técnica no sistema.',
        },
      ],
    };

    setEvidences((prev) => [newEvidence, ...prev]);

    logAudit({
      entityType: 'Evidence',
      entityId: newId,
      action: 'CREATE',
      newValue: `${newEvidence.id}: ${newEvidence.title} (${newEvidence.dimension} Lv.${newEvidence.level})`,
      justification: 'Cadastro de nova evidência técnica.',
      version: newEvidence.version,
    });

    return newId;
  };

  const updateEvidenceStatus = (evidenceId: string, status: EvidenceStatus, approverNotes?: string) => {
    setEvidences((prev) =>
      prev.map((e) => {
        if (e.id === evidenceId) {
          const now = new Date().toISOString().split('T')[0];
          const isApproval = status === 'Aprovada';
          const updated: Evidence = {
            ...e,
            status,
            approver: isApproval ? currentUser.name : e.approver,
            approvalDate: isApproval ? now : e.approvalDate,
            history: [
              {
                date: now,
                action: `Alteração de Status para: ${status}`,
                user: currentUser.name,
                notes: approverNotes || `Status atualizado por ${currentUser.name} (${currentUser.role}).`,
              },
              ...(e.history || []),
            ],
          };

          logAudit({
            entityType: 'Evidence',
            entityId: evidenceId,
            action: isApproval ? 'EVIDENCE_APPROVE' : status === 'Reprovada' ? 'EVIDENCE_REJECT' : 'UPDATE',
            fieldChanged: 'status',
            previousValue: e.status,
            newValue: status,
            justification: approverNotes || `Mudança de status da evidência ${evidenceId} para ${status}.`,
            version: e.version,
          });

          return updated;
        }
        return e;
      })
    );
  };

  const addRtmItem = (itemData: Omit<RequirementTraceabilityItem, 'id'>) => {
    const newId = `REQ-${String(rtmItems.length + 1).padStart(3, '0')}`;
    const newItem: RequirementTraceabilityItem = {
      ...itemData,
      id: newId,
    };
    setRtmItems((prev) => [...prev, newItem]);
    return newId;
  };

  const updateRtmItem = (id: string, updates: Partial<RequirementTraceabilityItem>) => {
    setRtmItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  };

  const recordGateDecision = (
    gateId: string,
    decision: GateDecision,
    justification: string,
    conditions?: string[]
  ) => {
    const now = new Date().toISOString().split('T')[0];
    setGates((prev) =>
      prev.map((g) => {
        if (g.id === gateId) {
          const updated: StageGate = {
            ...g,
            decision,
            decisionMaker: currentUser.name,
            decisionDate: now,
            justification,
            conditions: conditions || g.conditions,
          };

          logAudit({
            entityType: 'Gate',
            entityId: gateId,
            action: 'DECISION',
            fieldChanged: 'decision',
            previousValue: g.decision,
            newValue: decision,
            justification: `Decisão de ${decision} homologada: ${justification}`,
            version: currentTech?.currentVersion || 'v1.0',
          });

          return updated;
        }
        return g;
      })
    );
  };

  const addRisk = (riskData: Omit<RiskItem, 'id' | 'criticality'>) => {
    const newId = `RSK-${String(risks.length + 1).padStart(3, '0')}`;
    const newRisk: RiskItem = {
      ...riskData,
      id: newId,
      criticality: riskData.probability * riskData.impact,
    };
    setRisks((prev) => [...prev, newRisk]);
    logAudit({
      entityType: 'Risk',
      entityId: newId,
      action: 'CREATE',
      newValue: newRisk.title,
      justification: 'Inclusão de risco no registro FMEA.',
      version: currentTech?.currentVersion || 'v1.0',
    });
    return newId;
  };

  const updateRisk = (id: string, updates: Partial<RiskItem>) => {
    setRisks((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const prob = updates.probability ?? r.probability;
          const imp = updates.impact ?? r.impact;
          return {
            ...r,
            ...updates,
            criticality: prob * imp,
          };
        }
        return r;
      })
    );
  };

  const addDocument = (docData: Omit<DocumentItem, 'id' | 'history'>) => {
    const newId = `DOC-${docData.category.slice(0, 3).toUpperCase()}-${String(documents.length + 1).padStart(3, '0')}`;
    const newDoc: DocumentItem = {
      ...docData,
      id: newId,
      history: [
        {
          version: docData.version,
          author: currentUser.name,
          date: new Date().toISOString().split('T')[0],
          changeLog: 'Upload e registro do documento no repositório.',
        },
      ],
    };
    setDocuments((prev) => [newDoc, ...prev]);
    return newId;
  };

  const addPartner = (partnerData: Omit<Partner, 'id'>) => {
    const newId = `PART-${String(partners.length + 1).padStart(2, '0')}`;
    const newPartner: Partner = {
      ...partnerData,
      id: newId,
    };
    setPartners((prev) => [...prev, newPartner]);
    return newId;
  };

  const updateRoadmapActivity = (id: string, updates: Partial<RoadmapActivity>) => {
    setRoadmap((prev) => prev.map((act) => (act.id === id ? { ...act, ...updates } : act)));
  };

  const updateFinancial = (id: string, updates: Partial<FinancialMilestone>) => {
    setFinancials((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  const resetAllDataToDefaults = () => {
    setTechnologies(INITIAL_TECHNOLOGIES);
    setApplications(INITIAL_APPLICATIONS);
    setEvidences(INITIAL_EVIDENCES);
    setRtmItems(INITIAL_RTM);
    setGates(INITIAL_GATES);
    setRisks(INITIAL_RISKS);
    setPartners(INITIAL_PARTNERS);
    setFinancials(INITIAL_FINANCIALS);
    setDocuments(INITIAL_DOCUMENTS);
    setRoadmap(INITIAL_ROADMAP);
    setMaturityHistory(INITIAL_MATURITY_HISTORY);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setSelectedTechId('TEC-01');
    setSelectedAppId('APP-01-A');
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedTechId,
        setSelectedTechId,
        selectedAppId,
        setSelectedAppId,
        currentTech,
        currentApp,
        organizations,
        activeOrgId,
        setActiveOrgId,
        activeOrg,
        users,
        currentUser,
        setCurrentUserRole,
        technologies,
        applications,
        evidences,
        rtmItems,
        gates,
        risks,
        partners,
        financials,
        documents,
        roadmap,
        maturityHistory,
        auditLogs,
        addTechnology,
        updateTechnology,
        addApplication,
        updateApplication,
        updateReadinessLevel,
        addEvidence,
        updateEvidenceStatus,
        addRtmItem,
        updateRtmItem,
        recordGateDecision,
        addRisk,
        updateRisk,
        addDocument,
        addPartner,
        updateRoadmapActivity,
        updateFinancial,
        logAudit,
        resetAllDataToDefaults,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
