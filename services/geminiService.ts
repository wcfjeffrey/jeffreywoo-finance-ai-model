
import { GoogleGenAI, Type } from "@google/genai";
import { DashboardState } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export async function analyzeFinancialData(
  userInput: string, 
  currentState: DashboardState,
  fileBase64?: { data: string, mimeType: string }
): Promise<Partial<DashboardState>> {
  
  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      metrics: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            label: { type: Type.STRING },
            value: { type: Type.STRING },
            change: { type: Type.NUMBER },
            trend: { type: Type.STRING },
          },
          required: ['label', 'value']
        }
      },
      risks: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            severity: { type: Type.STRING },
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            probability: { type: Type.NUMBER },
            impact: { type: Type.STRING },
          }
        }
      },
      recommendations: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING },
            title: { type: Type.STRING },
            content: { type: Type.STRING },
            priority: { type: Type.STRING },
            horizon: { type: Type.STRING },
            impactScore: { type: Type.NUMBER }
          }
        }
      },
      predictionAssumptions: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: 'Key assumptions behind the projected cash flow trends.'
      },
      analysisSummary: { type: Type.STRING }
    },
    required: ['metrics', 'risks', 'recommendations', 'predictionAssumptions']
  };

  const model = "gemini-3-pro-preview";
  const systemInstruction = `You are JeffreyWooFinance, a premier AI CFO and Strategic Financial Advisor. 
  Your goal is to analyze provided financial data (text or documents) and return enterprise-level management recommendations.
  In this version, also monitor and provide feedback on:
  1. Budgets: Compare allocated vs spent and suggest reallocations if a category is exceeding its limit (e.g., Marketing).
  2. Goals: Evaluate progress on debt payoff, asset purchases, and development funds. Suggest capital maneuvers to accelerate goal achievement.
  3. Investments: Evaluate the portfolio performance and risk profile.
  Use domain-specific reasoning: ROI, NPV, IRR, WACC, liquidity ratios, and EBITDA optimization.
  Consider the historical context: ${JSON.stringify(currentState.cashFlowHistory)}.
  Categorize advice by Strategic Priority (High/Medium/Low) and Time Horizon (Short/Mid/Long).
  Always calculate an "Impact Score" (0-100) representing potential EBIT improvement.
  Be concise, professional, and executive-friendly.`;

  const contents: any[] = [{ text: userInput }];
  if (fileBase64) {
    contents.push({
      inlineData: {
        data: fileBase64.data,
        mimeType: fileBase64.mimeType
      }
    });
  }

  try {
    const response = await ai.models.generateContent({
      model,
      contents: { parts: contents },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema
      }
    });

    const result = JSON.parse(response.text || '{}');
    return {
      metrics: result.metrics || currentState.metrics,
      risks: result.risks?.map((r: any, i: number) => ({ ...r, id: `risk-${i}` })) || currentState.risks,
      recommendations: result.recommendations?.map((r: any, i: number) => ({ ...r, id: `rec-${i}` })) || currentState.recommendations,
      predictionAssumptions: result.predictionAssumptions || currentState.predictionAssumptions,
      lastUpdated: new Date().toLocaleTimeString()
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}

export async function simulateScenario(
  scenarioDescription: string,
  currentState: DashboardState
): Promise<any> {
  const model = "gemini-3-pro-preview";
  const response = await ai.models.generateContent({
    model,
    contents: `Simulate this strategic management scenario: "${scenarioDescription}". 
    Consider the company's historical performance, current debt goals, and budget constraints. 
    Provide ROI, Payback Period, NPV, and IRR. Return as JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          scenarioName: { type: Type.STRING },
          roi: { type: Type.NUMBER },
          paybackPeriod: { type: Type.NUMBER },
          npv: { type: Type.STRING },
          irr: { type: Type.STRING },
          strategicReasoning: { type: Type.STRING }
        }
      }
    }
  });

  return JSON.parse(response.text || '{}');
}
