import { Solution } from "@/contexts/AppContext";

type Lang = "en" | "es";
const tr = (lang: Lang, en: string, es: string) => lang === "en" ? en : es;

function extractNumbers(text: string): number[] {
  const matches = text.match(/-?\d+(?:[.,]\d+)?/g) ?? [];
  return matches.map((n) => parseFloat(n.replace(",", ".")));
}

function solveElasticity(problem: string, lang: Lang): Solution {
  const nums = extractNumbers(problem);
  if (nums.length < 4) {
    return {
      answer: tr(lang, "Provide: Q1, Q2, P1, P2", "Proporciona: Q1, Q2, P1, P2"),
      steps: [{ title: "Ed = (ΔQ/Q₁) / (ΔP/P₁)", explanation: tr(lang, "Example: 'elasticity Q1=100 Q2=80 P1=50 P2=60'", "Ejemplo: 'elasticidad Q1=100 Q2=80 P1=50 P2=60'") }],
    };
  }
  const [Q1, Q2, P1, P2] = nums;
  const deltaQ = Q2 - Q1;
  const deltaP = P2 - P1;
  const pctQ = deltaQ / Q1;
  const pctP = deltaP / P1;
  const Ed = pctQ / pctP;
  const absEd = Math.abs(Ed);
  const interpretation = absEd > 1
    ? tr(lang, "Elastic demand (|Ed| > 1)", "Demanda elástica (|Ed| > 1)")
    : absEd < 1
    ? tr(lang, "Inelastic demand (|Ed| < 1)", "Demanda inelástica (|Ed| < 1)")
    : tr(lang, "Unitary elastic demand (|Ed| = 1)", "Demanda unitaria (|Ed| = 1)");
  return {
    answer: `Ed = ${Ed.toFixed(4)}  →  ${interpretation}`,
    steps: [
      { title: tr(lang, "Known values", "Valores conocidos"), explanation: `Q₁ = ${Q1},  Q₂ = ${Q2},  P₁ = ${P1},  P₂ = ${P2}` },
      { title: "Ed = (ΔQ/Q₁) / (ΔP/P₁)", explanation: tr(lang, "Price elasticity of demand formula", "Fórmula de elasticidad precio de la demanda") },
      { title: tr(lang, "% change in quantity", "Variación % en cantidad"), explanation: `ΔQ/Q₁ = (${Q2}-${Q1})/${Q1} = ${pctQ.toFixed(4)} (${(pctQ*100).toFixed(2)}%)` },
      { title: tr(lang, "% change in price", "Variación % en precio"), explanation: `ΔP/P₁ = (${P2}-${P1})/${P1} = ${pctP.toFixed(4)} (${(pctP*100).toFixed(2)}%)` },
      { title: tr(lang, "Calculate Ed", "Calcular Ed"), explanation: `Ed = ${pctQ.toFixed(4)} / ${pctP.toFixed(4)} = ${Ed.toFixed(4)}` },
      { title: tr(lang, "Interpretation", "Interpretación"), explanation: interpretation },
    ],
  };
}

function solveGDP(problem: string, lang: Lang): Solution {
  const nums = extractNumbers(problem);
  if (nums.length < 4) {
    return {
      answer: tr(lang, "Provide C, I, G, X, M", "Proporciona C, I, G, X, M"),
      steps: [{ title: "PIB = C + I + G + (X − M)", explanation: tr(lang, "Example: 'GDP C=1000 I=300 G=500 X=200 M=150'", "Ejemplo: 'PIB C=1000 I=300 G=500 X=200 M=150'") }],
    };
  }
  const C = nums[0], I = nums[1], G = nums[2], X = nums[3], M = nums[4] ?? 0;
  const NX = X - M;
  const PIB = C + I + G + NX;
  return {
    answer: `PIB = ${PIB.toLocaleString()}`,
    steps: [
      { title: tr(lang, "Known values", "Valores conocidos"), explanation: `C=${C},  I=${I},  G=${G},  X=${X},  M=${M}` },
      { title: "PIB = C + I + G + (X − M)", explanation: tr(lang, "Expenditure approach", "Método del gasto") },
      { title: tr(lang, "Net exports", "Exportaciones netas"), explanation: `X − M = ${X} − ${M} = ${NX}` },
      { title: tr(lang, "Calculate PIB", "Calcular PIB"), explanation: `PIB = ${C} + ${I} + ${G} + ${NX} = ${PIB.toLocaleString()}` },
    ],
  };
}

function solveCompoundInterest(problem: string, lang: Lang): Solution {
  const nums = extractNumbers(problem);
  if (nums.length < 3) {
    return {
      answer: tr(lang, "Provide: C, i (rate), n (periods)", "Proporciona: C, i (tasa), n (periodos)"),
      steps: [{ title: "M = C(1 + i)ⁿ", explanation: tr(lang, "Example: 'compound interest C=10000 i=5 n=3'", "Ejemplo: 'interés compuesto C=10000 i=5 n=3'") }],
    };
  }
  let [C, i, n] = nums;
  if (i > 1) i = i / 100;
  const M = C * Math.pow(1 + i, n);
  const interest = M - C;
  return {
    answer: `M = ${M.toFixed(2)}  (${tr(lang, "Interest", "Interés")}: ${interest.toFixed(2)})`,
    steps: [
      { title: tr(lang, "Known values", "Valores conocidos"), explanation: `C = ${C},  i = ${(i*100).toFixed(2)}%,  n = ${n} ${tr(lang,"periods","periodos")}` },
      { title: "M = C(1 + i)ⁿ", explanation: tr(lang, "Compound interest formula", "Fórmula de interés compuesto") },
      { title: tr(lang, "Apply", "Aplicar"), explanation: `M = ${C} × (1 + ${i})^${n} = ${C} × ${Math.pow(1+i,n).toFixed(6)}` },
      { title: tr(lang, "Result", "Resultado"), explanation: `M = ${M.toFixed(2)}\nInterés generado = ${interest.toFixed(2)}` },
    ],
  };
}

function solveNPV(problem: string, lang: Lang): Solution {
  const nums = extractNumbers(problem);
  if (nums.length < 3) {
    return {
      answer: tr(lang, "Provide: r, investment, cash flows", "Proporciona: r, inversión, flujos de caja"),
      steps: [{ title: "VPN = Σ [FC/(1+r)ᵗ] − Inversión", explanation: tr(lang, "Example: 'NPV r=10 investment=5000 CF=2000 2000 2000'", "Ejemplo: 'VPN r=10 inversión=5000 FC=2000 2000 2000'") }],
    };
  }
  let r = nums[0];
  if (r > 1) r = r / 100;
  const investment = nums[1];
  const cashFlows = nums.slice(2);
  const pvs = cashFlows.map((cf, t) => cf / Math.pow(1 + r, t + 1));
  const totalPV = pvs.reduce((a, b) => a + b, 0);
  const npv = totalPV - investment;
  const decision = npv >= 0
    ? tr(lang, "✓ Accept — project adds value", "✓ Aceptar — el proyecto crea valor")
    : tr(lang, "✗ Reject — project destroys value", "✗ Rechazar — el proyecto destruye valor");
  const pvDetail = cashFlows.map((cf, t) => `FC${t+1} = ${cf} / (1+${r})^${t+1} = ${pvs[t].toFixed(2)}`).join("\n");
  return {
    answer: `VPN = ${npv.toFixed(2)}  →  ${decision}`,
    steps: [
      { title: tr(lang, "Known values", "Valores conocidos"), explanation: `r=${(r*100).toFixed(1)}%,  Inversión=${investment},  FC=[${cashFlows.join(", ")}]` },
      { title: "VPN = Σ [FC/(1+r)ᵗ] − Inversión", explanation: tr(lang, "Net Present Value formula", "Fórmula del Valor Presente Neto") },
      { title: tr(lang, "Discount each cash flow", "Descontar cada flujo"), explanation: pvDetail },
      { title: tr(lang, "Sum of PV", "Suma de VP"), explanation: `Σ VP = ${totalPV.toFixed(2)}` },
      { title: tr(lang, "Calculate VPN", "Calcular VPN"), explanation: `VPN = ${totalPV.toFixed(2)} − ${investment} = ${npv.toFixed(2)}` },
      { title: tr(lang, "Decision", "Decisión"), explanation: decision },
    ],
  };
}

function solveInflation(problem: string, lang: Lang): Solution {
  const nums = extractNumbers(problem);
  if (nums.length < 2) {
    return {
      answer: tr(lang, "Provide: IPC1, IPC2", "Proporciona: IPC1, IPC2"),
      steps: [{ title: "Inflación = ((IPC₂ − IPC₁) / IPC₁) × 100", explanation: tr(lang, "Example: 'inflation IPC1=100 IPC2=107'", "Ejemplo: 'inflación IPC1=100 IPC2=107'") }],
    };
  }
  const [IPC1, IPC2] = nums;
  const inflation = ((IPC2 - IPC1) / IPC1) * 100;
  const type = inflation > 0 ? tr(lang, "Inflation (prices rose)", "Inflación (precios subieron)")
    : inflation < 0 ? tr(lang, "Deflation (prices fell)", "Deflación (precios bajaron)")
    : tr(lang, "Price stability", "Estabilidad de precios");
  return {
    answer: `Inflación = ${inflation.toFixed(2)}%  →  ${type}`,
    steps: [
      { title: tr(lang, "Known values", "Valores conocidos"), explanation: `IPC₁ = ${IPC1},  IPC₂ = ${IPC2}` },
      { title: "Inflación = ((IPC₂ − IPC₁) / IPC₁) × 100", explanation: tr(lang, "Inflation rate formula", "Fórmula de la tasa de inflación") },
      { title: tr(lang, "Calculate", "Calcular"), explanation: `Inflación = ((${IPC2} − ${IPC1}) / ${IPC1}) × 100 = ${inflation.toFixed(2)}%` },
      { title: tr(lang, "Interpretation", "Interpretación"), explanation: type },
    ],
  };
}

export function solveEconomics(problem: string, lang: Lang): Solution {
  const p = problem.toLowerCase();
  if (/elasticidad|elasticity|elastic/.test(p)) return solveElasticity(problem, lang);
  if (/\bpib\b|\bgdp\b|producto interno|gross domestic/.test(p)) return solveGDP(problem, lang);
  if (/inter[eé]s\s*compuesto|compound\s*interest/.test(p)) return solveCompoundInterest(problem, lang);
  if (/\bvpn\b|\bnpv\b|valor\s*presente\s*neto|net\s*present/.test(p)) return solveNPV(problem, lang);
  if (/inflaci[oó]n|inflation|deflaci[oó]n|\bipc\b/.test(p)) return solveInflation(problem, lang);
  return {
    answer: tr(lang, "Economics solver ready", "Solver de Economía listo"),
    steps: [{
      title: tr(lang, "Available topics", "Temas disponibles"),
      explanation: tr(lang,
        "• Elasticity: 'elasticity Q1=100 Q2=80 P1=50 P2=60'\n• GDP: 'GDP C=1000 I=300 G=500 X=200 M=150'\n• Compound interest: 'compound interest C=10000 i=5 n=3'\n• NPV: 'NPV r=10 investment=5000 CF=2000 2000 2000'\n• Inflation: 'inflation IPC1=100 IPC2=107'",
        "• Elasticidad: 'elasticidad Q1=100 Q2=80 P1=50 P2=60'\n• PIB: 'PIB C=1000 I=300 G=500 X=200 M=150'\n• Interés compuesto: 'interés compuesto C=10000 i=5 n=3'\n• VPN: 'VPN r=10 inversión=5000 FC=2000 2000 2000'\n• Inflación: 'inflación IPC1=100 IPC2=107'"
      ),
    }],
  };
}
