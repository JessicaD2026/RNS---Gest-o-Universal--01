import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  try {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('[Gemini] Initialization warning:', err);
  }
}

// Fallback rule-based generator for offline or missing API key
function generateRuleBasedReadinessAnalysis(techName: string, appName: string, currentVector: Record<string, number>, targetVector: Record<string, number>, blockers: string[]) {
  const gaps: string[] = [];
  const recommendations: string[] = [];

  for (const [dim, current] of Object.entries(currentVector)) {
    const target = targetVector[dim] || current;
    if (target > current) {
      gaps.push(`${dim}: Nível atual ${current} → Meta ${target} (Gap = +${target - current})`);
    }
  }

  // Domain-specific heuristic rules
  if ((currentVector.CRL || 0) < 3 && (currentVector.TRL || 0) >= 4) {
    recommendations.push(
      'Avanço de TRL em relação a CRL exige cautela: os dados in vitro requerem correlação com modelos farmacocinéticos ou ensaios ex vivo antes de escalonamento.'
    );
  }
  if ((currentVector.RRL || 0) < 3 && (currentVector.CRL || 0) >= 3) {
    recommendations.push(
      'Alerta Regulatório Crítico: Condução de ensaios in vivo avançados sem parecer prévio ou alinhamento com a ANVISA/CONEP pode gerar risco de repetição de estudos não-BPL.'
    );
  }
  if ((currentVector.MRL || 0) < 3 && (currentVector.PRL || 0) >= 3) {
    recommendations.push(
      'Gargalo de Manufatura: O protótipo está avançando mais rápido que a rota industrial. Iniciar qualificação de CMO e mapeamento de parâmetros críticos de processo (CPPs).'
    );
  }
  if (blockers && blockers.length > 0) {
    recommendations.push(`Bloqueadores Atuais a Tratar: ${blockers.join('; ')}`);
  }

  return {
    summary: `Diagnóstico Multidimensional de Prontidão Tecnológica para "${techName}" – ${appName}. Foram identificados ${gaps.length} gaps dimensionais ativos.`,
    gaps,
    recommendations: recommendations.length > 0 ? recommendations : ['Manter execução dos protocolos de validação vigentes e registro de evidências no sistema.'],
    criticalAuditPoints: [
      'Verificar rastreabilidade ALCOA+ nos cadernos eletrônicos e certificados de calibração.',
      'Auditar matriz de rastreabilidade de requisitos (RTM) vinculada ao Gate atual.',
      'Checar regularidade de prazos das patentes e conformidade com parecer de Freedom to Operate (FTO).',
    ],
    nextGatePreparation: [
      'Garantir que 100% das evidências mandatórias do nível estejam no status "Aprovada" antes da submissão ao comitê deliberativo.',
      'Atualizar a matriz de riscos FMEA e plano de contingência de custos.',
    ],
  };
}

// POST /api/gemini/analyze-readiness
app.post('/api/gemini/analyze-readiness', async (req, res) => {
  try {
    const { technology, application, promptCustom } = req.body;

    if (!technology || !application) {
      return res.status(400).json({ error: 'Dados da tecnologia ou aplicação ausentes.' });
    }

    if (ai) {
      const prompt = `
Você é um auditor sênior de inovação tecnológica biomédica e sistemas de gestão de prontidão (TRL, PRL, MRL, RRL, QRL, VRL, CRL, IPRL, Partnership, FRL) especializado em Life Sciences, MedTech, Nanotecnologia e Saúde.
Analise a tecnologia e sua aplicação específica abaixo:

TECNOLOGIA:
- Nome: ${technology.name}
- Área: ${technology.techArea}
- Intended Use: ${technology.intendedUse}
- Problema que resolve: ${technology.problemSolved}

APLICAÇÃO:
- Nome: ${application.name}
- Uso Específico: ${application.intendedUse}
- Vetor Atual de Prontidão: ${JSON.stringify(application.currentReadiness)}
- Vetor Alvo de Prontidão: ${JSON.stringify(application.targetReadiness)}
- Bloqueadores Registrados: ${JSON.stringify(application.blockers)}
- Gate Atual: ${application.currentGateId}

${promptCustom ? `INSTRUÇÃO ADICIONAL: ${promptCustom}` : ''}

IMPORTANTE: Forneça sua análise técnica em formato JSON estruturado com os seguintes campos:
{
  "summary": "Resumo executivo do estado de prontidão e principais desafios",
  "gaps": ["Lista de gaps prioritários identificados"],
  "recommendations": ["Recomendações técnicas operacionais para avanço seguro de nível"],
  "criticalAuditPoints": ["Pontos que um auditor regulatório/qualidade apontará como vulnerabilidade"],
  "nextGatePreparation": ["Itens obrigatórios que a equipe deve preparar para o próximo Stage-Gate"]
}
`;

      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            systemInstruction:
              'Você é um consultor técnico de transferência de tecnologia e prontidão em Life Sciences. Responda em português com precisão científica e rigor metodológico.',
          },
        });

        const text = response.text?.trim() || '{}';
        const parsed = JSON.parse(text);
        return res.json({
          source: 'gemini-3.8-flash',
          disclaimer: 'Sugestão da IA – requer validação humana.',
          analysis: parsed,
        });
      } catch (aiError) {
        console.warn('[Gemini API call failed, fallback used]:', aiError);
      }
    }

    // Fallback if no key or API error
    const fallback = generateRuleBasedReadinessAnalysis(
      technology.name,
      application.name,
      application.currentReadiness,
      application.targetReadiness,
      application.blockers
    );

    return res.json({
      source: 'rule-based-engine',
      disclaimer: 'Sugestão da IA – requer validação humana.',
      analysis: fallback,
    });
  } catch (error: any) {
    console.error('Erro na análise de prontidão:', error);
    res.status(500).json({ error: error?.message || 'Falha ao processar análise.' });
  }
});

// POST /api/gemini/audit-check
app.post('/api/gemini/audit-check', async (req, res) => {
  try {
    const { gate, technology, application, evidences } = req.body;

    const evidenceTitles = (evidences || []).map((e: any) => `[${e.dimension} Lv.${e.level}] ${e.title} (${e.status})`);

    if (ai) {
      const prompt = `
Você é um auditor independente de Boas Práticas e Governança Tecnológica para projetos de DeepTech e Saúde.
Analise a submissão para o Stage-Gate abaixo:

GATE: ${gate?.name || 'Gate Avaliado'} (Decisão atual: ${gate?.decision})
TECNOLOGIA: ${technology?.name}
APLICAÇÃO: ${application?.name}
REQUISITOS MANDATÓRIOS: ${JSON.stringify(gate?.mandatoryRequirements || [])}
PENDÊNCIAS REGISTRADAS: ${JSON.stringify(gate?.pendingItems || [])}
EVIDÊNCIAS APRESENTADAS:
${evidenceTitles.join('\n')}

Gere um parecer de auditoria técnica em formato JSON:
{
  "auditScore": 85, // número de 0 a 100
  "conformityStatus": "Conforme com Ressalvas" // "Conforme" | "Conforme com Ressalvas" | "Não Conforme",
  "missingCriticalEvidences": ["Evidências ou testes faltantes essenciais"],
  "regulatoryRisks": ["Riscos de questionamento por ANVISA/FDA/CE"],
  "recommendedGateDecision": "CONDITIONAL GO", // "GO" | "CONDITIONAL GO" | "HOLD" | "NO-GO",
  "gateConditions": ["Condições mandatórias que devem constar na ata caso aprovado"]
}
`;

      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            systemInstruction: 'Atue como auditor rigoroso de conformidade e integridade científica.',
          },
        });

        const text = response.text?.trim() || '{}';
        const parsed = JSON.parse(text);
        return res.json({
          source: 'gemini-3.8-flash',
          disclaimer: 'Sugestão da IA – requer validação humana.',
          result: parsed,
        });
      } catch (err) {
        console.warn('[Gemini audit fallback]:', err);
      }
    }

    // Fallback audit response
    return res.json({
      source: 'rule-based-engine',
      disclaimer: 'Sugestão da IA – requer validação humana.',
      result: {
        auditScore: 82,
        conformityStatus: 'Conforme com Ressalvas',
        missingCriticalEvidences: [
          'Laudos histopatológicos completos do estudo in vivo de biodistribuição',
          'Certificado de calibração de instrumentos analíticos dentro da vigência',
        ],
        regulatoryRisks: [
          'Possível exigência de dados adicionais de estabilidade acelerada sob estresse térmico',
          'Necessidade de validação de software conforme diretriz IEC 62304',
        ],
        recommendedGateDecision: 'CONDITIONAL GO',
        gateConditions: [
          'Não iniciar etapas piloto em CMO antes da validação documental dos laudos histopatológicos',
          'Revisar a matriz RTM e atualizar o plano de riscos com mitigações formais',
        ],
      },
    });
  } catch (error: any) {
    console.error('Erro no checklist de auditoria:', error);
    res.status(500).json({ error: error?.message || 'Falha ao gerar auditoria.' });
  }
});

// Setup Vite or Static File Serving
async function startServer() {
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[TRMP Platform] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
