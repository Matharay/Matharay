import { Solution } from "@/contexts/AppContext";

type Lang = "en" | "es";
const tr = (lang: Lang, en: string, es: string) => (lang === "en" ? en : es);

// ── Utility: extract numbers from text ───────────────────────
function nums(text: string): number[] {
  const raw = text.match(/-?\d+(?:[.,]\d+)?(?:%)?/g) ?? [];
  return raw.map((s) => {
    const isPct = s.endsWith("%");
    const val = parseFloat(s.replace(",", ".").replace("%", ""));
    return isPct ? val / 100 : val;
  });
}

function notSolved(lang: Lang, hint?: string): Solution {
  return {
    answer: tr(lang, "Could not solve", "No se pudo resolver"),
    steps: [
      {
        title: tr(lang, "Tip", "Consejo"),
        explanation:
          hint ??
          tr(
            lang,
            "Make sure to include the necessary numerical values in your problem.",
            "Asegúrate de incluir los valores numéricos necesarios en tu problema."
          ),
      },
    ],
  };
}

// ══════════════════════════════════════════════════════════════
// 4.1 ELASTICIDAD
// ══════════════════════════════════════════════════════════════
function solveElasticidad(text: string, lang: Lang): Solution {
  // Pattern 1: porcentaje directo  "cae 20% ... sube 10%"
  const pcts = text.match(/-?\d+(?:[.,]\d+)?\s*%/g);
  if (pcts && pcts.length >= 2) {
    const pctQ = parseFloat(pcts[0].replace(",", ".")) / 100;
    const pctP = parseFloat(pcts[1].replace(",", ".")) / 100;
    const Ed = pctQ / pctP;
    return buildElasticidad(pctQ, pctP, Ed, lang);
  }

  // Pattern 2: Q1, Q2, P1, P2
  const n = nums(text);
  if (n.length >= 4) {
    const [Q1, Q2, P1, P2] = n;
    const pctQ = (Q2 - Q1) / Q1;
    const pctP = (P2 - P1) / P1;
    const Ed = pctQ / pctP;
    return buildElasticidad(pctQ, pctP, Ed, lang, { Q1, Q2, P1, P2 });
  }

  return notSolved(
    lang,
    tr(
      lang,
      "Provide two percentage changes (e.g. 'demand falls 20% when price rises 10%') or Q1, Q2, P1, P2.",
      "Proporciona dos variaciones porcentuales (e.g. 'la demanda cae 20% cuando el precio sube 10%') o Q1, Q2, P1, P2."
    )
  );
}

function buildElasticidad(
  pctQ: number,
  pctP: number,
  Ed: number,
  lang: Lang,
  pts?: { Q1: number; Q2: number; P1: number; P2: number }
): Solution {
  const absEd = Math.abs(Ed);
  const classif =
    absEd > 1
      ? tr(lang, "Elastic (|Ed| > 1)", "Elástica (|Ed| > 1)")
      : absEd < 1
      ? tr(lang, "Inelastic (|Ed| < 1)", "Inelástica (|Ed| < 1)")
      : tr(lang, "Unit elastic (|Ed| = 1)", "Unitaria (|Ed| = 1)");

  const steps = pts
    ? [
        {
          title: tr(lang, "Known values", "Valores conocidos"),
          explanation: `Q₁ = ${pts.Q1},  Q₂ = ${pts.Q2},  P₁ = ${pts.P1},  P₂ = ${pts.P2}`,
        },
        {
          title: "Ed = (ΔQ/Q₁) / (ΔP/P₁)",
          explanation: tr(lang, "Price elasticity of demand formula", "Fórmula de elasticidad precio de la demanda"),
        },
        {
          title: tr(lang, "% change in quantity", "Variación % en cantidad"),
          explanation: `ΔQ/Q₁ = (${pts.Q2}−${pts.Q1})/${pts.Q1} = ${(pctQ * 100).toFixed(2)}%`,
        },
        {
          title: tr(lang, "% change in price", "Variación % en precio"),
          explanation: `ΔP/P₁ = (${pts.P2}−${pts.P1})/${pts.P1} = ${(pctP * 100).toFixed(2)}%`,
        },
        {
          title: tr(lang, "Calculate Ed", "Calcular Ed"),
          explanation: `Ed = ${(pctQ * 100).toFixed(2)}% / ${(pctP * 100).toFixed(2)}% = ${Ed.toFixed(4)}`,
        },
        { title: tr(lang, "Classification", "Clasificación"), explanation: classif },
      ]
    : [
        {
          title: "Ed = (ΔQ%) / (ΔP%)",
          explanation: tr(lang, "Price elasticity of demand formula", "Fórmula de elasticidad precio de la demanda"),
        },
        {
          title: tr(lang, "Calculate Ed", "Calcular Ed"),
          explanation: `Ed = ${(pctQ * 100).toFixed(2)}% / ${(pctP * 100).toFixed(2)}% = ${Ed.toFixed(4)}`,
        },
        { title: tr(lang, "Classification", "Clasificación"), explanation: classif },
      ];

  // Graph: demand curve with slope Ed
  const P1ref = pts ? pts.P1 : 100;
  const Q1ref = pts ? pts.Q1 : 50;
  const slope = Q1ref / (Ed * P1ref); // approximate
  const graphData = Array.from({ length: 11 }, (_, i) => {
    const P = P1ref * 0.5 + (P1ref * i) / 10;
    const Q = Math.max(0, Q1ref - slope * (P - P1ref));
    return { x: parseFloat(Q.toFixed(2)), demanda: parseFloat(P.toFixed(2)) };
  });

  return {
    answer: `Ed = ${Ed.toFixed(4)}  →  ${classif}`,
    steps,
    graphType: "multiline",
    graphTitle: tr(lang, "Demand Curve", "Curva de Demanda"),
    graphXLabel: tr(lang, "Quantity (Q)", "Cantidad (Q)"),
    graphYLabel: tr(lang, "Price (P)", "Precio (P)"),
    graphData,
    graphSeries: [{ key: "demanda", label: tr(lang, "Demand", "Demanda"), color: "#3B5BDB" }],
  };
}

// ══════════════════════════════════════════════════════════════
// 4.2 PIB POR GASTO
// ══════════════════════════════════════════════════════════════
function solvePIB(text: string, lang: Lang): Solution {
  // Try to extract labeled values
  const extract = (pattern: RegExp) => {
    const m = text.match(pattern);
    return m ? parseFloat(m[1].replace(",", ".")) : null;
  };

  const C = extract(/C\s*[=:]\s*([\d,.]+)/i) ?? extract(/consumo\s*[=:]\s*([\d,.]+)/i);
  const I = extract(/I\s*[=:]\s*([\d,.]+)/i) ?? extract(/inversi[oó]n\s*[=:]\s*([\d,.]+)/i);
  const G = extract(/G\s*[=:]\s*([\d,.]+)/i) ?? extract(/gasto\s*(?:gobierno|p[uú]blico)?\s*[=:]\s*([\d,.]+)/i);
  const X = extract(/X\s*[=:]\s*([\d,.]+)/i) ?? extract(/exportaci[oó]n(?:es)?\s*[=:]\s*([\d,.]+)/i);
  const M = extract(/M\s*[=:]\s*([\d,.]+)/i) ?? extract(/importaci[oó]n(?:es)?\s*[=:]\s*([\d,.]+)/i);

  // Fallback to positional
  const n = nums(text);
  const Cv = C ?? n[0], Iv = I ?? n[1], Gv = G ?? n[2], Xv = X ?? n[3], Mv = M ?? n[4] ?? 0;

  if (Cv == null || Iv == null || Gv == null || Xv == null) {
    return notSolved(
      lang,
      tr(lang, "Provide C, I, G, X, M values. Example: 'C=500 I=200 G=150 X=100 M=80'", "Proporciona C, I, G, X, M. Ejemplo: 'C=500 I=200 G=150 X=100 M=80'")
    );
  }

  const NX = Xv - Mv;
  const PIB = Cv + Iv + Gv + NX;

  const graphData = [
    { x: "C", y: Cv },
    { x: "I", y: Iv },
    { x: "G", y: Gv },
    { x: "X-M", y: NX },
    { x: "PIB", y: PIB },
  ];

  return {
    answer: `PIB = ${PIB.toLocaleString()}`,
    steps: [
      {
        title: tr(lang, "Known values", "Valores conocidos"),
        explanation: `C = ${Cv},  I = ${Iv},  G = ${Gv},  X = ${Xv},  M = ${Mv}`,
      },
      {
        title: "PIB = C + I + G + (X − M)",
        explanation: tr(lang, "Expenditure approach (Keynesian identity)", "Identidad keynesiana del método del gasto"),
      },
      {
        title: tr(lang, "Net exports", "Exportaciones netas"),
        explanation: `X − M = ${Xv} − ${Mv} = ${NX}`,
      },
      {
        title: tr(lang, "Calculate PIB", "Calcular PIB"),
        explanation: `PIB = ${Cv} + ${Iv} + ${Gv} + ${NX} = ${PIB.toLocaleString()}`,
      },
      {
        title: tr(lang, "Breakdown", "Descomposición"),
        explanation: tr(
          lang,
          `C represents ${((Cv / PIB) * 100).toFixed(1)}% of GDP\nI represents ${((Iv / PIB) * 100).toFixed(1)}%\nG represents ${((Gv / PIB) * 100).toFixed(1)}%`,
          `C representa el ${((Cv / PIB) * 100).toFixed(1)}% del PIB\nI representa el ${((Iv / PIB) * 100).toFixed(1)}%\nG representa el ${((Gv / PIB) * 100).toFixed(1)}%`
        ),
      },
    ],
    graphType: "bar",
    graphTitle: tr(lang, "GDP Components", "Componentes del PIB"),
    graphXLabel: tr(lang, "Component", "Componente"),
    graphYLabel: tr(lang, "Value", "Valor"),
    graphData,
  };
}

// ══════════════════════════════════════════════════════════════
// 4.3 INTERÉS COMPUESTO
// ══════════════════════════════════════════════════════════════
function solveInteresCompuesto(text: string, lang: Lang): Solution {
  const n = nums(text);
  if (n.length < 3) {
    return {
      answer: tr(lang, "Provide C, i, n", "Proporciona C, i, n"),
      steps: [
        {
          title: "M = C(1 + i)ⁿ",
          explanation: tr(
            lang,
            "Example: 'C=10000 i=5% n=3 compound interest'",
            "Ejemplo: 'C=10000 i=5% n=3 interés compuesto'"
          ),
        },
      ],
      askVariable: {
        question: { en: "What do you want to calculate?", es: "¿Qué deseas calcular?" },
        options: [
          { symbol: "M", label: { en: "Final amount (M)", es: "Monto final (M)" } },
          { symbol: "C", label: { en: "Initial capital (C)", es: "Capital inicial (C)" } },
          { symbol: "i", label: { en: "Interest rate (i)", es: "Tasa de interés (i)" } },
          { symbol: "n", label: { en: "Number of periods (n)", es: "Número de periodos (n)" } },
        ],
      },
    };
  }

  let [C, i, periods] = n;
  if (i > 1) i = i / 100; // convert % to decimal
  const M = C * Math.pow(1 + i, periods);
  const interest = M - C;

  const graphData = Array.from({ length: Math.ceil(periods) + 1 }, (_, idx) => ({
    x: idx,
    monto: parseFloat((C * Math.pow(1 + i, idx)).toFixed(2)),
  }));

  return {
    answer: `M = ${M.toFixed(2)}  (${tr(lang, "Interest", "Interés")}: ${interest.toFixed(2)})`,
    steps: [
      {
        title: tr(lang, "Known values", "Valores conocidos"),
        explanation: `C = ${C},  i = ${(i * 100).toFixed(2)}%,  n = ${periods} ${tr(lang, "periods", "periodos")}`,
      },
      { title: "M = C(1 + i)ⁿ", explanation: tr(lang, "Compound interest formula", "Fórmula de interés compuesto") },
      {
        title: tr(lang, "Apply", "Aplicar"),
        explanation: `M = ${C} × (1 + ${i.toFixed(4)})^${periods} = ${C} × ${Math.pow(1 + i, periods).toFixed(6)}`,
      },
      {
        title: tr(lang, "Result", "Resultado"),
        explanation: `M = ${M.toFixed(2)}\n${tr(lang, "Total interest", "Interés total")} = M − C = ${M.toFixed(2)} − ${C} = ${interest.toFixed(2)}`,
      },
      {
        title: tr(lang, "Effective annual rate", "Tasa efectiva anual"),
        explanation: `i_efectiva = (1 + ${i.toFixed(4)})^1 − 1 = ${(i * 100).toFixed(2)}%`,
      },
    ],
    graphType: "multiline",
    graphTitle: tr(lang, "Capital Growth", "Crecimiento del Capital"),
    graphXLabel: tr(lang, "Period (n)", "Período (n)"),
    graphYLabel: tr(lang, "Amount (M)", "Monto (M)"),
    graphData,
    graphSeries: [{ key: "monto", label: tr(lang, "Amount", "Monto"), color: "#059669" }],
  };
}

// ══════════════════════════════════════════════════════════════
// 4.4 INTERÉS SIMPLE
// ══════════════════════════════════════════════════════════════
function solveInteresSimple(text: string, lang: Lang): Solution {
  const n = nums(text);
  if (n.length < 3) {
    return notSolved(
      lang,
      tr(lang, "Provide C, i, t. Example: 'C=10000 i=5% t=3 simple interest'", "Proporciona C, i, t. Ejemplo: 'C=10000 i=5% t=3 interés simple'")
    );
  }
  let [C, i, t] = n;
  if (i > 1) i = i / 100;
  const interest = C * i * t;
  const M = C + interest;
  return {
    answer: `M = ${M.toFixed(2)}  (${tr(lang, "Interest", "Interés")}: ${interest.toFixed(2)})`,
    steps: [
      {
        title: tr(lang, "Known values", "Valores conocidos"),
        explanation: `C = ${C},  i = ${(i * 100).toFixed(2)}%,  t = ${t}`,
      },
      { title: "I = C × i × t", explanation: tr(lang, "Simple interest formula", "Fórmula de interés simple") },
      {
        title: tr(lang, "Calculate interest", "Calcular interés"),
        explanation: `I = ${C} × ${i.toFixed(4)} × ${t} = ${interest.toFixed(2)}`,
      },
      { title: "M = C(1 + i×t)", explanation: `M = ${C} × (1 + ${i.toFixed(4)} × ${t}) = ${M.toFixed(2)}` },
    ],
  };
}

// ══════════════════════════════════════════════════════════════
// 4.5 VPN / NPV
// ══════════════════════════════════════════════════════════════
function solveVPN(text: string, lang: Lang): Solution {
  const n = nums(text);
  if (n.length < 3) {
    return notSolved(
      lang,
      tr(
        lang,
        "Provide: r (discount rate %), initial investment, and cash flows by year. Example: 'r=10% investment=15000 CF1=5000 CF2=7000 CF3=8000'",
        "Proporciona: r (tasa de descuento %), inversión inicial y flujos de caja. Ejemplo: 'r=10% inversión=15000 FC1=5000 FC2=7000 FC3=8000'"
      )
    );
  }

  let r = n[0];
  if (r > 1) r = r / 100;
  const investment = n[1];
  const cashFlows = n.slice(2);

  const pvs = cashFlows.map((cf, t) => cf / Math.pow(1 + r, t + 1));
  const totalPV = pvs.reduce((a, b) => a + b, 0);
  const npv = totalPV - investment;

  const decision =
    npv > 0
      ? tr(lang, "✅ Viable — NPV > 0, project creates value", "✅ Viable — VPN > 0, el proyecto crea valor")
      : npv < 0
      ? tr(lang, "❌ Not viable — NPV < 0, project destroys value", "❌ No viable — VPN < 0, el proyecto destruye valor")
      : tr(lang, "⚖️ Break even — NPV = 0", "⚖️ Punto de equilibrio — VPN = 0");

  const pvDetail = cashFlows.map((cf, t) => `FC${t + 1} = ${cf} / (1+${r})^${t + 1} = ${pvs[t].toFixed(2)}`).join("\n");

  const graphData = [
    { x: "Año 0", flujo: -investment },
    ...cashFlows.map((cf, t) => ({ x: `Año ${t + 1}`, flujo: cf })),
  ];

  return {
    answer: `VPN = ${npv.toFixed(2)}  →  ${decision}`,
    steps: [
      {
        title: tr(lang, "Known values", "Valores conocidos"),
        explanation: `r = ${(r * 100).toFixed(1)}%,  Inversión = ${investment}\n${tr(lang, "Cash flows", "Flujos")}: [${cashFlows.join(", ")}]`,
      },
      {
        title: "VPN = Σ [FC/(1+r)ᵗ] − Inversión",
        explanation: tr(lang, "Net Present Value — discounts future cash flows to today's money", "Valor Presente Neto — descuenta flujos futuros al valor del dinero hoy"),
      },
      { title: tr(lang, "Discount each cash flow", "Descontar cada flujo"), explanation: pvDetail },
      { title: tr(lang, "Sum of present values", "Suma de valores presentes"), explanation: `Σ VP = ${totalPV.toFixed(2)}` },
      {
        title: tr(lang, "Calculate VPN", "Calcular VPN"),
        explanation: `VPN = ${totalPV.toFixed(2)} − ${investment} = ${npv.toFixed(2)}`,
      },
      { title: tr(lang, "Decision", "Decisión"), explanation: decision },
    ],
    graphType: "bar",
    graphTitle: tr(lang, "Cash Flow by Year", "Flujos de Caja por Año"),
    graphXLabel: tr(lang, "Year", "Año"),
    graphYLabel: tr(lang, "Cash Flow ($)", "Flujo ($)"),
    graphData,
    graphSeries: [{ key: "flujo", label: tr(lang, "Cash Flow", "Flujo de Caja"), color: "#3B5BDB" }],
  };
}

// ══════════════════════════════════════════════════════════════
// 4.6 TIR
// ══════════════════════════════════════════════════════════════
function solveTIR(text: string, lang: Lang): Solution {
  const n = nums(text);
  if (n.length < 3) {
    return notSolved(
      lang,
      tr(lang, "Provide investment and cash flows. Example: 'TIR investment=15000 CF1=5000 CF2=7000 CF3=8000'", "Proporciona inversión y flujos. Ejemplo: 'TIR inversión=15000 FC1=5000 FC2=7000 FC3=8000'")
    );
  }

  let rComp = n[0];
  if (rComp > 1) rComp = rComp / 100; // comparison rate
  const investment = n[1];
  const cashFlows = n.slice(2);

  // Bisection method
  let lo = 0, hi = 10, tir = 0;
  for (let iter = 0; iter < 100; iter++) {
    tir = (lo + hi) / 2;
    const npv = cashFlows.reduce((sum, cf, t) => sum + cf / Math.pow(1 + tir, t + 1), 0) - investment;
    if (Math.abs(npv) < 0.0001) break;
    if (npv > 0) lo = tir;
    else hi = tir;
  }

  const viable = tir > rComp;
  const decision = viable
    ? tr(lang, `✅ Viable: TIR (${(tir * 100).toFixed(2)}%) > discount rate (${(rComp * 100).toFixed(1)}%)`, `✅ Viable: TIR (${(tir * 100).toFixed(2)}%) > tasa de descuento (${(rComp * 100).toFixed(1)}%)`)
    : tr(lang, `❌ Not viable: TIR (${(tir * 100).toFixed(2)}%) < discount rate (${(rComp * 100).toFixed(1)}%)`, `❌ No viable: TIR (${(tir * 100).toFixed(2)}%) < tasa de descuento (${(rComp * 100).toFixed(1)}%)`);

  return {
    answer: `TIR ≈ ${(tir * 100).toFixed(2)}%  →  ${decision}`,
    steps: [
      {
        title: tr(lang, "What is the TIR?", "¿Qué es la TIR?"),
        explanation: tr(
          lang,
          "The Internal Rate of Return is the discount rate that makes NPV = 0. If TIR > cost of capital → project is viable.",
          "La Tasa Interna de Retorno es la tasa que hace VPN = 0. Si TIR > costo de capital → proyecto viable."
        ),
      },
      {
        title: tr(lang, "Method: Bisection", "Método: Bisección"),
        explanation: tr(lang, "Iteratively search the rate r where NPV(r) = 0", "Buscamos iterativamente la tasa r donde VPN(r) = 0"),
      },
      {
        title: tr(lang, "Result", "Resultado"),
        explanation: `TIR ≈ ${(tir * 100).toFixed(2)}%`,
      },
      { title: tr(lang, "Decision", "Decisión"), explanation: decision },
    ],
  };
}

// ══════════════════════════════════════════════════════════════
// 4.7 INFLACIÓN
// ══════════════════════════════════════════════════════════════
function solveInflacion(text: string, lang: Lang): Solution {
  const n = nums(text);
  if (n.length < 2) {
    return notSolved(
      lang,
      tr(lang, "Provide IPC1 and IPC2. Example: 'IPC1=120 IPC2=132'", "Proporciona IPC1 e IPC2. Ejemplo: 'IPC1=120 IPC2=132'")
    );
  }
  const [IPC1, IPC2] = n;
  const inflation = ((IPC2 - IPC1) / IPC1) * 100;
  const purchasingPower = 1 / (1 + inflation / 100);
  const type =
    inflation > 0
      ? tr(lang, "Inflation (prices rose)", "Inflación (precios subieron)")
      : inflation < 0
      ? tr(lang, "Deflation (prices fell)", "Deflación (precios bajaron)")
      : tr(lang, "Price stability", "Estabilidad de precios");

  const graphData = [
    { x: tr(lang, "Period 1", "Período 1"), ipc: IPC1 },
    { x: tr(lang, "Period 2", "Período 2"), ipc: IPC2 },
  ];

  return {
    answer: `${tr(lang, "Inflation", "Inflación")} = ${inflation.toFixed(2)}%  →  ${type}`,
    steps: [
      { title: tr(lang, "Known values", "Valores conocidos"), explanation: `IPC₁ = ${IPC1},  IPC₂ = ${IPC2}` },
      {
        title: "Inflación = ((IPC₂ − IPC₁) / IPC₁) × 100",
        explanation: tr(lang, "Consumer Price Index inflation formula", "Fórmula de inflación con Índice de Precios al Consumidor"),
      },
      {
        title: tr(lang, "Calculate", "Calcular"),
        explanation: `Inflación = ((${IPC2} − ${IPC1}) / ${IPC1}) × 100 = ${inflation.toFixed(2)}%`,
      },
      {
        title: tr(lang, "Purchasing power", "Poder adquisitivo"),
        explanation: tr(
          lang,
          `With ${inflation.toFixed(2)}% inflation, $1 today is worth $${purchasingPower.toFixed(4)} in real terms.`,
          `Con ${inflation.toFixed(2)}% de inflación, $1 hoy equivale a $${purchasingPower.toFixed(4)} en términos reales.`
        ),
      },
      { title: tr(lang, "Interpretation", "Interpretación"), explanation: type },
    ],
    graphType: "multiline",
    graphTitle: tr(lang, "IPC Evolution", "Evolución del IPC"),
    graphXLabel: tr(lang, "Period", "Período"),
    graphYLabel: "IPC",
    graphData,
    graphSeries: [{ key: "ipc", label: "IPC", color: "#D97706" }],
  };
}

// ══════════════════════════════════════════════════════════════
// 4.8 OFERTA Y DEMANDA
// ══════════════════════════════════════════════════════════════
function solveOfertaDemanda(text: string, lang: Lang): Solution {
  // Detect: Qd = a - bP, Qs = c + dP
  const qdMatch = text.match(/Qd\s*=\s*(\d+(?:[.,]\d+)?)\s*[-−]\s*(\d+(?:[.,]\d+)?)\s*[Pp]/i);
  const qsMatch = text.match(/Qs\s*=\s*(\d+(?:[.,]\d+)?)\s*[+]\s*(\d+(?:[.,]\d+)?)\s*[Pp]/i);

  if (!qdMatch || !qsMatch) {
    return notSolved(
      lang,
      tr(
        lang,
        "Provide supply and demand functions. Example: 'Qd = 100 - 2P, Qs = 20 + 3P'",
        "Proporciona funciones de oferta y demanda. Ejemplo: 'Qd = 100 - 2P, Qs = 20 + 3P'"
      )
    );
  }

  const a = parseFloat(qdMatch[1].replace(",", ".")); // intercept demand
  const b = parseFloat(qdMatch[2].replace(",", ".")); // slope demand
  const c = parseFloat(qsMatch[1].replace(",", ".")); // intercept supply
  const d = parseFloat(qsMatch[2].replace(",", ".")); // slope supply

  // Equilibrium: a - bP = c + dP → P* = (a-c)/(b+d)
  const Pstar = (a - c) / (b + d);
  const Qstar = a - b * Pstar;

  const Pmax = Pstar * 2;
  const graphData = Array.from({ length: 21 }, (_, i) => {
    const P = (Pmax * i) / 20;
    const Qd = Math.max(0, a - b * P);
    const Qs = Math.max(0, c + d * P);
    return { x: parseFloat(P.toFixed(2)), demanda: parseFloat(Qd.toFixed(2)), oferta: parseFloat(Qs.toFixed(2)) };
  });

  return {
    answer: `P* = ${Pstar.toFixed(2)},  Q* = ${Qstar.toFixed(2)}`,
    steps: [
      {
        title: tr(lang, "Demand function", "Función de demanda"),
        explanation: `Qd = ${a} − ${b}P`,
      },
      {
        title: tr(lang, "Supply function", "Función de oferta"),
        explanation: `Qs = ${c} + ${d}P`,
      },
      {
        title: tr(lang, "Equilibrium condition", "Condición de equilibrio"),
        explanation: `Qd = Qs\n${a} − ${b}P = ${c} + ${d}P`,
      },
      {
        title: tr(lang, "Solve for P*", "Despejar P*"),
        explanation: `${a} − ${c} = (${b} + ${d})P\n${a - c} = ${b + d}P\nP* = ${a - c}/${b + d} = ${Pstar.toFixed(2)}`,
      },
      {
        title: tr(lang, "Find Q*", "Encontrar Q*"),
        explanation: `Q* = ${a} − ${b} × ${Pstar.toFixed(2)} = ${Qstar.toFixed(2)}`,
      },
    ],
    graphType: "multiline",
    graphTitle: tr(lang, "Supply & Demand", "Oferta y Demanda"),
    graphXLabel: tr(lang, "Quantity (Q)", "Cantidad (Q)"),
    graphYLabel: tr(lang, "Price (P)", "Precio (P)"),
    graphData,
    graphSeries: [
      { key: "demanda", label: tr(lang, "Demand", "Demanda"), color: "#3B5BDB" },
      { key: "oferta", label: tr(lang, "Supply", "Oferta"), color: "#DC2626" },
    ],
  };
}

// ══════════════════════════════════════════════════════════════
// 4.9 EXCEDENTE DEL CONSUMIDOR Y PRODUCTOR
// ══════════════════════════════════════════════════════════════
function solveExcedente(text: string, lang: Lang): Solution {
  const n = nums(text);
  if (n.length < 3) {
    return notSolved(
      lang,
      tr(lang, "Provide Pmax (or Pmin), P*, Q*. Example: 'Pmax=100 P*=60 Q*=40 consumer surplus'", "Proporciona Pmax (o Pmin), P*, Q*. Ejemplo: 'Pmax=100 P*=60 Q*=40 excedente consumidor'")
    );
  }
  const [Pmax, Pstar, Qstar] = n;
  const Pmin = n[3] ?? 0;
  const EC = 0.5 * (Pmax - Pstar) * Qstar;
  const EP = 0.5 * (Pstar - Pmin) * Qstar;
  const bienestar = EC + EP;

  return {
    answer: `EC = ${EC.toFixed(2)},  EP = ${EP.toFixed(2)},  BT = ${bienestar.toFixed(2)}`,
    steps: [
      {
        title: tr(lang, "Known values", "Valores conocidos"),
        explanation: `P_máx = ${Pmax},  P* = ${Pstar},  Q* = ${Qstar},  P_mín = ${Pmin}`,
      },
      {
        title: tr(lang, "Consumer Surplus", "Excedente del Consumidor"),
        explanation: `EC = ½ × (P_máx − P*) × Q* = ½ × (${Pmax} − ${Pstar}) × ${Qstar} = ${EC.toFixed(2)}`,
      },
      {
        title: tr(lang, "Producer Surplus", "Excedente del Productor"),
        explanation: `EP = ½ × (P* − P_mín) × Q* = ½ × (${Pstar} − ${Pmin}) × ${Qstar} = ${EP.toFixed(2)}`,
      },
      {
        title: tr(lang, "Total welfare", "Bienestar total"),
        explanation: `BT = EC + EP = ${EC.toFixed(2)} + ${EP.toFixed(2)} = ${bienestar.toFixed(2)}`,
      },
    ],
  };
}

// ══════════════════════════════════════════════════════════════
// 4.10 MULTIPLICADOR KEYNESIANO
// ══════════════════════════════════════════════════════════════
function solveMultiplicador(text: string, lang: Lang): Solution {
  const n = nums(text);
  if (n.length < 1) {
    return notSolved(
      lang,
      tr(lang, "Provide PMC (MPC) and ΔG. Example: 'PMC=0.8 ΔG=100 Keynesian multiplier'", "Proporciona PMC y ΔG. Ejemplo: 'PMC=0.8 ΔG=100 multiplicador keynesiano'")
    );
  }

  let PMC = n[0];
  if (PMC > 1) PMC = PMC / 100;
  const deltaG = n[1] ?? 100;
  const k = 1 / (1 - PMC);
  const deltaPIB = k * deltaG;

  return {
    answer: `k = ${k.toFixed(4)},  ΔPIB = ${deltaPIB.toFixed(2)}`,
    steps: [
      {
        title: tr(lang, "Known values", "Valores conocidos"),
        explanation: `PMC = ${PMC.toFixed(2)},  ΔG = ${deltaG}`,
      },
      {
        title: "k = 1 / (1 − PMC)",
        explanation: tr(lang, "Keynesian multiplier formula", "Fórmula del multiplicador keynesiano"),
      },
      {
        title: tr(lang, "Calculate multiplier", "Calcular multiplicador"),
        explanation: `k = 1 / (1 − ${PMC.toFixed(2)}) = 1 / ${(1 - PMC).toFixed(2)} = ${k.toFixed(4)}`,
      },
      {
        title: "ΔPIB = k × ΔG",
        explanation: `ΔPIB = ${k.toFixed(4)} × ${deltaG} = ${deltaPIB.toFixed(2)}`,
      },
      {
        title: tr(lang, "Interpretation", "Interpretación"),
        explanation: tr(
          lang,
          `Each $1 increase in government spending generates $${k.toFixed(2)} in total GDP.`,
          `Cada $1 de aumento en gasto gobierno genera $${k.toFixed(2)} de PIB total.`
        ),
      },
    ],
  };
}

// ══════════════════════════════════════════════════════════════
// 4.11 TIPO DE CAMBIO
// ══════════════════════════════════════════════════════════════
function solveTipoCambio(text: string, lang: Lang): Solution {
  const n = nums(text);
  if (n.length < 2) {
    return notSolved(
      lang,
      tr(lang, "Provide: amount and exchange rate. Example: '$1000 USD at exchange rate 17.5 MXN'", "Proporciona: monto y tipo de cambio. Ejemplo: '$1000 USD a tipo de cambio 17.5 MXN'")
    );
  }
  const [amount, rate] = n;
  const converted = amount * rate;
  const reverse = amount / rate;

  return {
    answer: `${amount} × ${rate} = ${converted.toFixed(2)}`,
    steps: [
      { title: tr(lang, "Known values", "Valores conocidos"), explanation: `${tr(lang, "Amount", "Monto")} = ${amount},  TC = ${rate}` },
      {
        title: tr(lang, "Direct conversion", "Conversión directa"),
        explanation: `${amount} × ${rate} = ${converted.toFixed(2)}`,
      },
      {
        title: tr(lang, "Reverse conversion", "Conversión inversa"),
        explanation: `${amount} / ${rate} = ${reverse.toFixed(4)}`,
      },
      {
        title: tr(lang, "Real vs nominal", "Real vs nominal"),
        explanation: tr(
          lang,
          "The nominal exchange rate is the official quote. The real exchange rate adjusts for price level differences between countries.",
          "El tipo de cambio nominal es la cotización oficial. El real ajusta por diferencias en niveles de precios entre países."
        ),
      },
    ],
  };
}

// ══════════════════════════════════════════════════════════════
// 4.12 COSTO DE OPORTUNIDAD
// ══════════════════════════════════════════════════════════════
function solveCostoOportunidad(text: string, lang: Lang): Solution {
  const n = nums(text);
  if (n.length < 2) {
    return notSolved(
      lang,
      tr(lang, "Provide at least two values to compare. Example: 'option A earns 5000, option B earns 8000, find opportunity cost'", "Proporciona al menos dos valores a comparar. Ejemplo: 'opción A genera 5000, opción B genera 8000'")
    );
  }
  const [A, B] = n;
  const best = Math.max(A, B);
  const chosen = A;
  const opportunityCost = best - chosen;
  const isOptimal = chosen >= best;

  return {
    answer: `${tr(lang, "Opportunity Cost", "Costo de Oportunidad")} = ${opportunityCost.toFixed(2)}`,
    steps: [
      {
        title: tr(lang, "What is opportunity cost?", "¿Qué es el costo de oportunidad?"),
        explanation: tr(
          lang,
          "The value of the best alternative forgone when making a decision.",
          "El valor de la mejor alternativa sacrificada al tomar una decisión."
        ),
      },
      {
        title: tr(lang, "Values compared", "Valores comparados"),
        explanation: `${tr(lang, "Option A", "Opción A")} = ${A}\n${tr(lang, "Option B", "Opción B")} = ${B}`,
      },
      {
        title: tr(lang, "Best alternative", "Mejor alternativa"),
        explanation: `${tr(lang, "Max", "Máximo")} = ${best}`,
      },
      {
        title: tr(lang, "Opportunity cost", "Costo de oportunidad"),
        explanation: `CO = ${best} − ${chosen} = ${opportunityCost.toFixed(2)}`,
      },
      {
        title: tr(lang, "Conclusion", "Conclusión"),
        explanation: isOptimal
          ? tr(lang, "Option A is optimal — no opportunity cost.", "La opción A es óptima — sin costo de oportunidad.")
          : tr(lang, `By choosing option A over B, you forgo ${opportunityCost.toFixed(2)}.`, `Al elegir A sobre B, se sacrifica ${opportunityCost.toFixed(2)}.`),
      },
    ],
  };
}

// ══════════════════════════════════════════════════════════════
// 8.3 IS-LM
// ══════════════════════════════════════════════════════════════
function solveISLM(text: string, lang: Lang): Solution {
  const ext = (pattern: RegExp, def: number) => {
    const m = text.match(pattern);
    return m ? parseFloat(m[1].replace(",", ".")) : def;
  };

  // Parameters with typical textbook defaults
  const C0 = ext(/C0\s*[=:]\s*([\d.,]+)/i, 200);
  const c  = ext(/\bc\s*[=:]\s*([\d.,]+)/i, 0.8);
  const I0 = ext(/I0\s*[=:]\s*([\d.,]+)/i, 300);
  const b  = ext(/\bb\s*[=:]\s*([\d.,]+)/i, 50);
  const G  = ext(/G\s*[=:]\s*([\d.,]+)/i, 200);
  const T  = ext(/T\s*[=:]\s*([\d.,]+)/i, 100);
  const MP = ext(/(?:M\/P|M)\s*[=:]\s*([\d.,]+)/i, 500);
  const k  = ext(/\bk\s*[=:]\s*([\d.,]+)/i, 0.5);
  const h  = ext(/\bh\s*[=:]\s*([\d.,]+)/i, 100);

  // IS: Y = A/(1-c) - (b/(1-c))×i  where A = C0 + I0 + G - c×T
  const A  = C0 + I0 + G - c * T;
  const isIntercept = A / (1 - c);
  const isSlope     = b / (1 - c); // negative slope in Y-i space

  // LM: i = (k×Y - M/P) / h
  const lmSlope     = k / h;
  const lmIntercept = -MP / h;

  // Equilibrium: IS = LM
  // isIntercept - isSlope×i = Y (IS)
  // i = lmSlope×Y + lmIntercept (LM)
  // Substitute: Y = isIntercept - isSlope×(lmSlope×Y + lmIntercept)
  // Y = isIntercept - isSlope×lmSlope×Y - isSlope×lmIntercept
  // Y(1 + isSlope×lmSlope) = isIntercept - isSlope×lmIntercept
  const Ystar = (isIntercept - isSlope * lmIntercept) / (1 + isSlope * lmSlope);
  const istar = lmSlope * Ystar + lmIntercept;

  // Generate graph data
  const Ymax = Ystar * 2;
  const graphData = Array.from({ length: 21 }, (_, idx) => {
    const Y = (Ymax * idx) / 20;
    const iIS = (isIntercept - Y) / isSlope; // IS: i = (IS_intercept - Y) / isSlope
    const iLM = lmSlope * Y + lmIntercept;  // LM
    return {
      x: parseFloat(Y.toFixed(1)),
      IS: parseFloat(Math.max(0, iIS).toFixed(3)),
      LM: parseFloat(Math.max(0, iLM).toFixed(3)),
    };
  });

  return {
    answer: `Y* = ${Ystar.toFixed(2)},  i* = ${(istar * 100).toFixed(2)}%`,
    steps: [
      {
        title: tr(lang, "IS-LM Model parameters", "Parámetros del modelo IS-LM"),
        explanation: `C₀=${C0}, c=${c}, I₀=${I0}, b=${b}, G=${G}, T=${T}\nM/P=${MP}, k=${k}, h=${h}`,
      },
      {
        title: tr(lang, "IS Curve (goods market)", "Curva IS (mercado de bienes)"),
        explanation: `IS: Y = ${isIntercept.toFixed(2)} − ${isSlope.toFixed(2)}×i`,
      },
      {
        title: tr(lang, "LM Curve (money market)", "Curva LM (mercado de dinero)"),
        explanation: `LM: i = ${lmSlope.toFixed(4)}×Y − ${Math.abs(lmIntercept).toFixed(4)}`,
      },
      {
        title: tr(lang, "Equilibrium IS = LM", "Equilibrio IS = LM"),
        explanation: tr(lang, "Solve the system of two equations simultaneously", "Resolver el sistema de dos ecuaciones simultáneamente"),
      },
      {
        title: tr(lang, "Results", "Resultados"),
        explanation: `Y* = ${Ystar.toFixed(2)}\ni* = ${(istar * 100).toFixed(2)}%`,
      },
    ],
    graphType: "multiline",
    graphTitle: tr(lang, "IS-LM Equilibrium", "Equilibrio IS-LM"),
    graphXLabel: tr(lang, "Output (Y)", "Producto (Y)"),
    graphYLabel: tr(lang, "Interest rate (i)", "Tasa de interés (i)"),
    graphData,
    graphSeries: [
      { key: "IS", label: "Curva IS", color: "#3B5BDB" },
      { key: "LM", label: "Curva LM", color: "#059669" },
    ],
  };
}

// ══════════════════════════════════════════════════════════════
// MAIN DISPATCHER
// ══════════════════════════════════════════════════════════════
export function solveEconomics(text: string, lang: Lang): Solution {
  const t = text.toLowerCase();

  if (/is[-\s]lm|curva\s+is|curva\s+lm|equilibrio\s+macro/i.test(text))
    return solveISLM(text, lang);
  if (/elasticidad|elasticity|elastic/i.test(t)) return solveElasticidad(text, lang);
  if (/\bpib\b|\bgdp\b|producto\s+interno|gross\s+domestic|demanda\s+agregada/i.test(t))
    return solvePIB(text, lang);
  if (/inter[eé]s\s+compuesto|compound\s+interest/i.test(t))
    return solveInteresCompuesto(text, lang);
  if (/inter[eé]s\s+simple|simple\s+interest/i.test(t))
    return solveInteresSimple(text, lang);
  if (/\bvpn\b|\bnpv\b|valor\s+presente\s+neto|net\s+present\s+value/i.test(t))
    return solveVPN(text, lang);
  if (/\btir\b|\birr\b|tasa\s+interna\s+de\s+retorno|internal\s+rate\s+of\s+return/i.test(t))
    return solveTIR(text, lang);
  if (/inflaci[oó]n|inflation|deflaci[oó]n|\bipc\b|\bcpi\b|[ií]ndice\s+de\s+precios/i.test(t))
    return solveInflacion(text, lang);
  if (/\boferta\b.*\bdemanda\b|\bdemanda\b.*\boferta\b|supply.*demand|demand.*supply|equilibr/i.test(t))
    return solveOfertaDemanda(text, lang);
  if (/excedente|surplus|bienestar|welfare/i.test(t)) return solveExcedente(text, lang);
  if (/multiplicador|keynesiano|keynesian|propensión\s+marginal|mpc|pmc/i.test(t))
    return solveMultiplicador(text, lang);
  if (/tipo\s+de\s+cambio|exchange\s+rate|divisas?|moneda|conversi[oó]n/i.test(t))
    return solveTipoCambio(text, lang);
  if (/costo\s+de\s+oportunidad|opportunity\s+cost|ventaja\s+comparativa|ventaja\s+absoluta/i.test(t))
    return solveCostoOportunidad(text, lang);

  // Generic fallback with topic menu
  return {
    answer: tr(lang, "Economics solver ready", "Solver de Economía listo"),
    steps: [
      {
        title: tr(lang, "Available topics", "Temas disponibles"),
        explanation: tr(
          lang,
          `Try one of these:\n• Elasticity: 'elasticity Q1=100 Q2=80 P1=50 P2=60'\n• GDP: 'GDP C=500 I=200 G=150 X=100 M=80'\n• Compound interest: 'compound interest C=10000 i=5% n=3'\n• Simple interest: 'simple interest C=10000 i=5% t=3'\n• NPV: 'NPV r=10% investment=15000 CF1=5000 CF2=7000 CF3=8000'\n• IRR: 'IRR investment=15000 CF1=5000 CF2=7000 CF3=8000'\n• Inflation: 'inflation IPC1=120 IPC2=132'\n• Supply & demand: 'Qd = 100 - 2P, Qs = 20 + 3P'\n• Consumer surplus: 'Pmax=100 P*=60 Q*=40 consumer surplus'\n• Keynesian multiplier: 'PMC=0.8 ΔG=100 multiplier'\n• Exchange rate: '$1000 at rate 17.5'\n• IS-LM: 'IS-LM C0=200 c=0.8 I0=300 G=200 T=100'`,
          `Intenta uno de estos:\n• Elasticidad: 'elasticidad Q1=100 Q2=80 P1=50 P2=60'\n• PIB: 'PIB C=500 I=200 G=150 X=100 M=80'\n• Interés compuesto: 'interés compuesto C=10000 i=5% n=3'\n• Interés simple: 'interés simple C=10000 i=5% t=3'\n• VPN: 'VPN r=10% inversión=15000 FC1=5000 FC2=7000 FC3=8000'\n• TIR: 'TIR inversión=15000 FC1=5000 FC2=7000 FC3=8000'\n• Inflación: 'inflación IPC1=120 IPC2=132'\n• Oferta y demanda: 'Qd = 100 - 2P, Qs = 20 + 3P'\n• Excedente: 'Pmax=100 P*=60 Q*=40 excedente consumidor'\n• Multiplicador: 'PMC=0.8 ΔG=100 multiplicador keynesiano'\n• Tipo de cambio: '$1000 a tipo de cambio 17.5'\n• IS-LM: 'IS-LM C0=200 c=0.8 I0=300 G=200 T=100'`
        ),
      },
    ],
  };
}
