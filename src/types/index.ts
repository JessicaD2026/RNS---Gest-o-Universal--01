// ==========================================================
// TECHNOLOGY READINESS MANAGEMENT PLATFORM - DATA CONTRACTS
// ==========================================================

export type TechArea =
  | 'Life Sciences'
  | 'Healthcare'
  | 'HealthTech'
  | 'MedTech'
  | 'Biotecnologia'
  | 'Nanotecnologia'
  | 'Diagnóstico'
  | 'Dispositivos Médicos'
  | 'Biomateriais'
  | 'Fármacos e DDS'
  | 'Software Médico'
  | 'DeepTech';

export type ReadinessDimensionKey =
  | 'TRL'
  | 'PRL'
  | 'MRL'
  | 'RRL'
  | 'QRL'
  | 'VRL'
  | 'CRL'
  | 'IPRL'
  | 'Partnership'
  | 'FRL';

export type UserRole =
  | 'Administrador'
  | 'Governança'
  | 'Gestor de Portfólio'
  | 'Gestor de Projeto'
  | 'Pesquisador'
  | 'Especialista'
  | 'Avaliador'
  | 'Parceiro Externo'
  | 'Visualizador';

export type GateDecision = 'GO' | 'CONDITIONAL GO' | 'HOLD' | 'NO-GO' | 'RECYCLE' | 'PENDING';

export type EvidenceStatus =
  | 'Planejada'
  | 'Submetida'
  | 'Rascunho'
  | 'Em execução'
  | 'Em análise'
  | 'Aprovada'
  | 'Reprovada'
  | 'Necessita repetição'
  | 'Obsoleta';

export type EvidenceCategory =
  | 'Protocolo'
  | 'Relatório de Ensaio'
  | 'Certificado Analítico'
  | 'Parecer Regulatório'
  | 'Dossiê Técnico'
  | 'FMEA / Análise de Risco'
  | 'Estudo Clínico / Pré-clínico'
  | 'Parecer de Patente / FTO'
  | 'Acordo de Parceria'
  | 'Certificação de Qualidade'
  | 'Outro';

export type PartnerType =
  | 'ICT / Universidade'
  | 'CRO (Pesquisa Contratada)'
  | 'CMO (Fabricação Contratada)'
  | 'Hospital / Centro Clínico'
  | 'Laboratório Analítico'
  | 'Empresa Co-desenvolvedora'
  | 'Investidor / Fundo'
  | 'Instituição'
  | 'Laboratório'
  | 'Empresa'
  | 'Hospital'
  | 'CRO'
  | 'ICT'
  | 'Startup'
  | 'Especialista'
  | 'Órgão de Validação'
  | 'Prestador de Serviço';

export type DocumentCategory =
  | 'Protocolo'
  | 'Relatório Técnico'
  | 'POP / SOP'
  | 'POP/SOP'
  | 'Certificado de Calibração'
  | 'Certificado de Análise'
  | 'Dossiê Regulatório'
  | 'Patente / Parecer Jurídico'
  | 'Patente/PI'
  | 'Contrato / Termo'
  | 'Contrato/MOU'
  | 'Ata de Reunião / Gate'
  | 'Manual de Qualidade'
  | 'Artigo Científico'
  | 'Dados Brutos';

export type RiskCategory =
  | 'Tecnológico'
  | 'Experimental'
  | 'Biológico'
  | 'Clínico'
  | 'Biológico / Clínico'
  | 'Regulatório'
  | 'Qualidade'
  | 'Manufatura'
  | 'Manufatura / Escalonamento'
  | 'Financeiro'
  | 'Propriedade Intelectual'
  | 'Parcerias'
  | 'Parceria / Cadeia de Suprimentos'
  | 'Mercado / Negócio'
  | 'Cronograma'
  | string;

export type RiskStatus =
  | 'Identificado'
  | 'Em Mitigação'
  | 'Em mitigação'
  | 'Controlado'
  | 'Materializado'
  | 'Encerrado'
  | 'Mitigado'
  | 'Aceito';

export interface ReadinessVector {
  TRL: number; // 1 - 9
  PRL: number; // 0 - 5
  MRL: number; // 0 - 5
  RRL: number; // 0 - 5
  QRL: number; // 0 - 5
  VRL: number; // 0 - 5
  CRL: number; // 0 - 5
  IPRL: number; // 0 - 5
  Partnership: number; // 0 - 5
  FRL: number; // 0 - 5
}

export interface DimensionLevelSpec {
  level: number;
  name: string;
  definition: string;
  objective: string;
  requirements: string[];
  expectedActivities: string[];
  mandatoryEvidences: string[];
  recommendedEvidences: string[];
  metrics: string[];
  acceptanceCriteria: string;
  risks: string[];
  dependencies?: { dimension: ReadinessDimensionKey; minLevel: number }[];
  documentation: string[];
  responsibleRole: string;
  approvalGate: string;
}

export interface DimensionMetadata {
  key: ReadinessDimensionKey;
  name: string;
  fullName: string;
  description: string;
  maxLevel: number;
  unitText: string;
  levels: DimensionLevelSpec[];
}

export interface IntellectualPropertyRecord {
  id: string;
  title: string;
  patentNumber?: string;
  number?: string;
  type?: string;
  territory?: string;
  filingDate?: string;
  status: 'Depósito' | 'Concedida' | 'FTO Concluído' | 'Em Análise' | 'Segredo Industrial' | string;
  jurisdiction?: string;
  depositDate?: string;
  owners?: string[];
  ownership?: string;
  ftoStatus?: string;
}

export interface TechnologyVersion {
  version: string;
  date: string;
  notes: string;
  author: string;
}

export interface Technology {
  id: string; // e.g. "TEC-BIO-001"
  name: string;
  description: string;
  organizationId: string;
  owners: string[];
  techArea: TechArea;
  category: string;
  intendedUse: string; // Finalidade de uso pretendida
  targetUser: string; // Usuário pretendido
  environmentOfUse: string; // Ambiente de utilização
  problemSolved: string;
  currentVersion: string;
  versionHistory: TechnologyVersion[];
  status: 'Ativo' | 'Em Validação' | 'Em Pausa' | 'Aprovado' | 'Arquivado';
  createdAt: string;
  lastEvaluatedAt: string;
  intellectualProperty: IntellectualPropertyRecord[];
  partnerIds: string[];
  documentsCount: number;
}

export interface GapPriorityConfig {
  impact: number; // 1 - 5
  urgency: number; // 1 - 5
  risk: number; // 1 - 5
}

export interface Application {
  id: string; // e.g. "APP-BIO-001-A"
  technologyId: string;
  name: string;
  description: string;
  intendedUse: string;
  targetMarket: string;
  currentReadiness: ReadinessVector;
  targetReadiness: ReadinessVector;
  gapPriorities: Partial<Record<ReadinessDimensionKey, GapPriorityConfig>>;
  currentGateId: string;
  status: 'Em Desenvolvimento' | 'Em Gate Review' | 'Aprovado' | 'Bloqueado';
  blockers: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Evidence {
  id: string; // e.g. "EVD-2026-001"
  technologyId: string;
  applicationId: string;
  version: string;
  dimension: ReadinessDimensionKey;
  level: number;
  requirementId: string;
  evidenceType?:
    | 'Protocolo'
    | 'Relatório de Ensaio'
    | 'Certificado Analítico'
    | 'Dossiê Regulatório'
    | 'Parecer Ético (CEP/CEUA)'
    | 'Estudo de Estabilidade'
    | 'Relatório FMEA'
    | 'Parecer de FTO'
    | 'Auditoria de Qualidade'
    | 'Dados Brutos'
    | 'Validação de Processo'
    | string;
  category?: EvidenceCategory | string;
  title: string;
  description: string;
  relatedProtocol?: string;
  result?: string;
  acceptanceCriteria?: string;
  status: EvidenceStatus;
  responsible?: string;
  author?: string;
  labOrOrg?: string;
  laboratory?: string;
  date: string;
  fileName?: string;
  fileSize?: string;
  link?: string;
  fileUrl?: string;
  fileHash?: string;
  notes?: string;
  approver?: string;
  approvalDate?: string;
  history?: {
    date: string;
    action: string;
    user: string;
    notes?: string;
  }[];
}

export interface RequirementTraceabilityItem {
  id: string; // e.g. "REQ-010"
  technologyId?: string;
  applicationId: string;
  need?: string; // Necessidade
  userNeed?: string;
  requirement: string; // Requisito
  riskId?: string; // Risco associado
  associatedRiskId?: string;
  activity?: string; // Atividade
  protocol?: string; // Protocolo
  protocolDocument?: string;
  evidenceIds?: string[]; // Evidências associadas
  evidenceId?: string;
  result?: string; // Resultado
  acceptanceCriteria: string; // Critério de aceitação
  gateId?: string; // Gate
  associatedGateId?: string;
  dimension?: ReadinessDimensionKey; // Readiness Level
  associatedDimension?: ReadinessDimensionKey;
  targetLevel?: number;
  associatedLevel?: number;
  status:
    | 'Não Iniciado'
    | 'Em Progresso'
    | 'Parcialmente Atendido'
    | 'Aprovado'
    | 'Reprovado'
    | 'Atendido'
    | 'Em andamento'
    | 'Bloqueado'
    | 'Pendente';
}

export interface StageGate {
  id: string; // e.g. "GATE-01"
  gateNumber?: number;
  name: string;
  technologyId?: string;
  applicationId?: string;
  mandatoryRequirements: string[];
  optionalRequirements?: string[];
  evidenceIds?: string[];
  risks?: string[];
  pendingItems?: string[];
  budget?: {
    allocated: number;
    spent: number;
    currency: 'BRL' | 'USD' | 'EUR';
  };
  responsible?: string;
  technicalOpinion?: string;
  decision: GateDecision;
  decisionMaker?: string;
  decisionDate?: string;
  justification?: string;
  conditions?: string[];
  scheduledDate: string;
  committeeMembers?: string[];
  associatedDocuments?: string[];
}

export interface FinancialMilestone {
  id: string;
  technologyId: string;
  applicationId?: string;
  plannedBudget: number;
  availableBudget: number;
  executedBudget: number;
  fundingGap?: number;
  milestoneName?: string;
  deadline?: string;
  currency: 'BRL' | 'USD' | 'EUR';
  fundingSource:
    | 'FAPESP'
    | 'FINEP'
    | 'CNPq'
    | 'Horizon Europe'
    | 'NIH'
    | 'Venture Capital'
    | 'Parceiro Corporativo'
    | 'Recursos Próprios';
  grantProjectNumber: string;
  agencyOrProgram: string;
  fundedActivity: string;
  costPerExperiment?: { experimentName: string; cost: number; date: string }[];
  costPerStage?: { stageName: string; cost: number }[];
  costPerGate?: { gateName: string; cost: number }[];
  estimatedCostNextLevel?: number;
}

export interface Partner {
  id: string;
  name: string;
  type: PartnerType;
  competencies: string[];
  infrastructure: string[];
  services?: string[];
  leadContact?: string;
  email?: string;
  location?: string;
  role?: string;
  partnershipType?:
    | 'Convênio P&D'
    | 'Prestação de Serviços'
    | 'Co-desenvolvimento'
    | 'Ensaios Clínicos (CRO)'
    | 'Licenciamento'
    | string;
  agreementStatus?: string;
  validUntil?: string;
  agreements?: {
    title: string;
    status: 'Ativo' | 'Em Negociação' | 'Expirado';
    validity: string;
  }[];
  relatedProjectIds?: string[];
  activities?: string[];
  evidencesProduced?: string[];
  evidencesGenerated?: string[];
}

export interface RiskItem {
  id: string;
  technologyId: string;
  applicationId: string;
  category: RiskCategory;
  title: string;
  description: string;
  failureMode?: string;
  failureEffect?: string;
  probability: number; // 1-5
  impact: number; // 1-5
  detectability?: number; // 1-5 (FMEA)
  criticality: number; // Probability * Impact (1-25)
  mitigation: string;
  mitigationPlan?: string;
  responsible: string;
  responsiblePerson?: string;
  deadline: string;
  status: RiskStatus;
}

export interface DocumentItem {
  id: string;
  technologyId: string;
  applicationId?: string;
  title: string;
  category: DocumentCategory;
  version: string;
  author: string;
  approver?: string;
  status?: string;
  date: string;
  approvalStatus?: 'Rascunho' | 'Em Revisão' | 'Aprovado' | 'Obsoleto';
  fileSize?: string;
  fileHash?: string;
  history?: {
    version: string;
    author: string;
    date: string;
    changeLog: string;
  }[];
}

export interface RoadmapActivity {
  id: string;
  technologyId?: string;
  applicationId: string;
  currentState?: string;
  targetGap?: string;
  gapToOvercome?: string;
  dimension?: ReadinessDimensionKey;
  targetDimension?: ReadinessDimensionKey;
  targetLevel?: number;
  activityName?: string;
  activity?: string;
  responsible: string;
  partnerId?: string;
  allocatedBudget?: number;
  budget?: number;
  expectedEvidence: string;
  targetGateId?: string;
  associatedGate?: string;
  nextStage?: string;
  status:
    | 'Pendente'
    | 'Em Andamento'
    | 'Concluído'
    | 'Bloqueado'
    | 'Não iniciada'
    | 'Em andamento'
    | 'Concluída'
    | 'Atrasada';
  startDate?: string;
  endDate?: string;
  progress?: number; // 0 - 100
}

export interface MaturityTransitionRecord {
  id: string;
  technologyId: string;
  applicationId: string;
  dimension: ReadinessDimensionKey;
  previousLevel: number;
  newLevel: number;
  date: string;
  resourcesUsed: number;
  currency: string;
  evidencesProduced: string[];
  keyBottlenecks: string[];
  responsibleUser: string;
  gateDecisionId?: string;
  auditJustification: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId?: string;
  userName?: string;
  userRole?: UserRole;
  user?: string;
  role?: string;
  entityType: 'Technology' | 'Application' | 'ReadinessAssessment' | 'Evidence' | 'Gate' | 'StageGate' | 'Requirement' | 'Risk' | 'Document' | string;
  entityId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LEVEL_CHANGE' | 'DECISION' | 'EVIDENCE_APPROVE' | 'EVIDENCE_REJECT' | string;
  fieldChanged?: string;
  previousValue?: string;
  newValue?: string;
  justification?: string;
  version?: string;
  hash?: string;
}

export interface Organization {
  id: string;
  name: string;
  acronym: string;
  legalEntity: string;
  colorTheme: string;
  customTerminology: {
    readinessLabel: string;
    gateLabel: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organizationId: string;
  avatarInitials: string;
}
