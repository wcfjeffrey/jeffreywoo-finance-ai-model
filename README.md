<div align="center">
  <img src="assets/JeffreyWooFinance.png" alt="JeffreyWooFinanceBanner" width="1200" height="600" />
</div>

## 📊 Overview

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff)
![HTML](https://img.shields.io/badge/HTML-%23E34F26.svg?logo=html5&logoColor=white)
![React](https://img.shields.io/badge/React-%2320232a.svg?logo=react&logoColor=%2361DAFB)
![Node.js](https://img.shields.io/badge/Node.js-6DA55F?logo=node.js&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-886FBF?logo=googlegemini&logoColor=fff)

> **Not your typical financial strategic decision assistant app!**

**JeffreyWooFinance** is an AI-powered financial strategic decision assistant designed to help businesses and professionals make smarter, faster, and more confident financial choices.

## ✨ What It Does
- 📊 **Real-Time Financial Intelligence** — analyze complex financial data and market trends (by month/quarter/year) using predictive models
- 🧠 **AI-Powered Strategic Guidance** — deliver actionable recommendations for investment, budgeting, and risk management
- 🔍 **Scenario Simulation Engine** — explore “what-if” models to evaluate outcomes before making decisions
- 🌍 **Multi-Market Analysis** — supports financial insights across APAC, US, and Europe
- 🔒 **Enterprise-Grade Security** — built with reproducible workflows and scalable architecture

## 💡Finance Transformation Impact
This project showcases how technology can reshape financial management by:  
- Digitizing strategic finance workflows with predictive modeling & real‑time insights.  
- Enhancing executive decision‑making through scenario simulations & ROI/payback analysis.  
- Optimizing liquidity & risk management with automated forecasting tools.  
- Driving enterprise transformation by aligning financial strategies with long‑term organizational goals.  
- Promoting responsible innovation with secure handling of sensitive financial data.

## 🚀 Why Choose JeffreyWooFinance
Most tools just crunch numbers. **JeffreyWooFinance** goes further — embedding AI into your decision-making process so you can anticipate risks, seize opportunities, and align financial strategies with long-term goals.

## 💰 Financial Theories Applied
This app leverages accounting and finance principles to automate analysis of corporate performance, investment decisions, and compliance reporting. It transforms raw financial data into actionable insights for managers, auditors, and investors:
- **Financial Statement Analysis** — The app parses balance sheets, income statements, and cash flow statements, applying ratio analysis (e.g. EBITDA margin, net profit margin) to benchmark company performance.  
- **DuPont Framework** — Embedded into dashboards to decompose Return on Equity (ROE) into margin, turnover, and leverage, helping users identify drivers of shareholder value. 
- **Discounted Cash Flow (DCF), Net Present Value (NPV) & Internal Rate of Return (IRR)** - Used in scenario simulations to evaluate investment projects and long-term corporate valuation, directly integrated into the app’s forecasting module.  
- **Capital Asset Pricing Model (CAPM)** — Applied to estimate cost of equity and Weighted Average Cost of Capital (WACC), supporting financing decisions within the app’s risk-return analysis.  
- **Variance & Sensitivity Analysis** — AI-driven stochastic simulations test resilience of financial outcomes under different market conditions, aligning with actuarial-style stress testing.  
- **Cash Flow Statement Interpretation** — Automated classification of operating, investing, and financing cash flows to highlight liquidity risks and sustainability.  
- **Consolidation & Group Structures** — The app models intercompany transactions and compliance with controlled foreign corporation (CFC) regimes, ensuring accurate group-level reporting.

## ⭐ Finance Skills Strengthened
- Full‑stack architecture for finance applications.  
- Secure handling of financial data & environment variables.  
- AI model integration into real‑world financial analysis workflows.  
- Parsing & transforming ERP & structured datasets for insights.  
- Interactive dashboards & state management in React (TypeScript + Vite).

## 🤖 Tech Stack
- **Language** — TypeScript, HTML  
- **Framework** — React (with Vite as the build tool)  
- **UI** — Standard React components, styled via TSX
- **Runtime** — Node.js

## 📦 Getting Started
1. Connect your financial datasets by uploading your source file
2. Run **JeffreyWooFinance** to generate insights, simulations, and strategic recommendations tailored to your business

## ⚙️ Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) file after you create .env.local file
3. Run the app:
   `npm run dev`

## 📋 Sample

<img src="assets/JeffreyWooFinance1.png" alt="JeffreyWooFinance1" width="1200" height="1500" />
<img src="assets/JeffreyWooFinance2.png" alt="JeffreyWooFinance2" width="1200" height="800" />
<img src="assets/JeffreyWooFinance3.png" alt="JeffreyWooFinance3" width="1200" height="800" />
<img src="assets/JeffreyWooFinance4.png" alt="JeffreyWooFinance4" width="1200" height="800" />
<img src="assets/JeffreyWooFinance5.png" alt="JeffreyWooFinance5" width="1200" height="800" />
<img src="assets/JeffreyWooFinance6.png" alt="JeffreyWooFinance6" width="1200" height="800" />

## 📐Data Flow and Logic Sequence

```mermaid
flowchart TD
    subgraph PHASE1["Phase 1: Data Input"]
        direction TB
        A1["Upload Financial Data"] --> A2["Balance Sheet"]
        A1 --> A3["Income Statement"]
        A1 --> A4["Cash Flow Statement"]
        A1 --> A5["ERP Export / Structured Dataset"]
    end

    subgraph PHASE2["Phase 2: Financial Analysis"]
        direction TB
        B1["Ratio Analysis"] --> B2["EBITDA Margin / Net Profit Margin"]
        B2 --> B3["DuPont Framework ROE Decomposition"]
        B3 --> B4["Cash Flow Classification Operating/Investing/Financing"]
        B4 --> B5["Variance and Sensitivity Analysis"]
    end

    subgraph PHASE3["Phase 3: AI Strategic Guidance"]
        direction TB
        C1["Gemini API Analysis"] --> C2["Generate Investment Recommendations"]
        C2 --> C3["Budgeting Insights"]
        C3 --> C4["Risk Management Strategies"]
    end

    subgraph PHASE4["Phase 4: Scenario Simulation"]
        direction TB
        D1["DCF / NPV / IRR Calculation"] --> D2["CAPM for Cost of Equity"]
        D2 --> D3["WACC Estimation"]
        D3 --> D4["What-If Scenario Modeling"]
        D4 --> D5["Stochastic Stress Testing"]
    end

    subgraph PHASE5["Phase 5: Output Dashboard"]
        direction TB
        E1["Real-Time Cash Flow Forecast"] --> E2["ROI Analysis Dashboard"]
        E2 --> E3["Scenario Comparison"]
        E3 --> E4["Strategic Recommendations"]
    end

    A5 --> B1
    B5 --> C1
    C4 --> D1
    D5 --> E1
```

## ⚖️ Disclaimer
**JeffreyWooFinance** provides AI-driven insights for informational, educational, and demonstration purposes only. It does not constitute professional financial, investment, or legal advice.

AI‑generated predictions, analyses, and recommendations are based on historical data and machine learning models. They are not guarantees of future performance and may contain errors or omissions.

Always consult a qualified financial professional before making any investment or business decisions. The developer assumes no liability for any losses or damages arising from the use of this app.

Use at your own risk.

## 📄 License

**GNU Affero General Public License v3.0 (AGPL‑3.0)** — JeffreyWooFinance 

- ✅ You are free to use, modify, and distribute this software, provided that any derivative works are also licensed under AGPL‑3.0.
- ✅ If you run or deploy this software over a network (e.g., as a web service), you must make the source code of your modified version available to all users who interact with it.
- ✅ This ensures transparency, collaboration, and continued open‑source availability of improvements.
- ❌ The software is provided “as is”, without warranties of any kind.

For full details, see the [LICENSE](./LICENSE) file.

## 👤 About the Author
Jeffrey Woo — Finance Manager | Strategic FP&A, AI Automation & Cost Optimization | MBA | FCCA | CTA | FTIHK | SAP Financial Accounting (FI) Certified Application Associate | Xero Advisor Certified

📧 Email: jeffreywoocf@gmail.com  
💼 LinkedIn: https://www.linkedin.com/in/wcfjeffrey/  
🐙 GitHub: https://github.com/wcfjeffrey/
