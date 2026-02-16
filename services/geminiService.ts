
import { GoogleGenAI, Type } from "@google/genai";
import { DashboardState } from "../types";

// Always use the process.env.API_KEY directly as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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
            category: { type: Type.STRING }
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
            mitigation: { type: Type.STRING }
          }
        }
      },
      budgets: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            name: { type: Type.STRING },
            allocated: { type: Type.NUMBER },
            spent: { type: Type.NUMBER },
            forecastedNextQ: { type: Type.NUMBER }
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
        items: { type: Type.STRING }
      }
    },
    required: ['metrics', 'risks', 'recommendations', 'predictionAssumptions']
  };

  const model = "gemini-3-pro-preview";
  const systemInstruction = `You are JeffreyWooFinance, a premier AI CFO. 
  Analyze financial data to provide:
  1. Profitability Metrics: Gross/Net margins and EBITDA.
  2. Budget Forecasting: Forecast next quarter spend based on current burn rate.
  3. Risk Mitigation: For every risk identified, provide a concrete mitigation strategy.
  4. Strategic ROI: Evaluate investments and recommendations with impact scores.
  Format the output strictly as JSON following the provided schema.`;

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

    // Use .text property to get the response string.
    const result = JSON.parse(response.text || '{}');
    return {
      metrics: result.metrics || currentState.metrics,
      risks: result.risks?.map((r: any, i: number) => ({ ...r, id: `risk-${i}` })) || currentState.risks,
      budgets: result.budgets || currentState.budgets,
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
    Evaluate Revenue Impact, Cost Impact, ROI, NPV, and IRR. Return as JSON.`,
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
          revenueImpact: { type: Type.STRING },
          costImpact: { type: Type.STRING },
          description: { type: Type.STRING }
        }
      }
    }
  });

  // Use .text property to get the response string.
  return JSON.parse(response.text || '{}');
}
