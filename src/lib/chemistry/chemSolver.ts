// ─────────────────────────────────────────────────────────────
// Chemistry Solver — comprehensive solver for all chem topics
// ─────────────────────────────────────────────────────────────

import { Solution, SolutionStep } from "@/contexts/AppContext";
import { preprocessText } from "../physics/unitParser";

type Lang = "en" | "es";

const tr  = (lang: Lang, en: string, es: string) => lang === "en" ? en : es;
const fmt = (n: number, d = 4) => {
  if (!isFinite(n)) return "∞";
  if (Math.abs(n) >= 1e4 || (Math.abs(n) < 0.001 && n !== 0)) return n.toExponential(d);
  return String(parseFloat(n.toFixed(d)));
};
const st = (title: string, exp: string): SolutionStep => ({ title, explanation: exp });

// ── Molar masses for common elements ─────────────────────────
const MOLAR_MASS: Record<string, number> = {
  H:2.016, He:4.003, Li:6.941, Be:9.012, B:10.811, C:12.011, N:14.007,
  O:15.999, F:18.998, Ne:20.180, Na:22.990, Mg:24.305, Al:26.982, Si:28.086,
  P:30.974, S:32.065, Cl:35.453, Ar:39.948, K:39.098, Ca:40.078, Fe:55.845,
  Cu:63.546, Zn:65.38, Br:79.904, Ag:107.868, I:126.904, Ba:137.327, Pb:207.2,
};

// Parse molecular formula → molar mass
function molarMassOf(formula: string): number {
  let mass = 0;
  const re = /([A-Z][a-z]?)(\d*)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(formula)) !== null) {
    const el = m[1], n = parseInt(m[2] || "1");
    mass += (MOLAR_MASS[el] ?? 0) * n;
  }
  return mass;
}

// ── Extract numbers from text ─────────────────────────────────
function extractNums(text: string): number[] {
  const re = /(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g;
  const nums: number[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(preprocessText(text))) !== null) {
    nums.push(parseFloat(m[1]));
  }
  return nums;
}

function getNum(text: string, patterns: RegExp[]): number | undefined {
  const processed = preprocessText(text);
  for (const p of patterns) {
    const m = p.exec(processed);
    if (m) return parseFloat(m[1]);
  }
  return undefined;
}

// ══════════════════════════════════════════════════════════════
// ACID / BASE SOLVER
// ══════════════════════════════════════════════════════════════
function solveAcidBase(text: string, lang: Lang): Solution | null {
  const lower = text.toLowerCase();
  const nums = extractNums(text);

  // pH from [H+]
  if (/\[h\+?\]|concentraci[oó]n.*h[iíì]/i.test(text) && /ph/i.test(text)) {
    const conc = nums.find(n => n > 0 && n < 10);
    if (conc) {
      const pH = -Math.log10(conc);
      const pOH = 14 - pH;
      const OH = Math.pow(10, -pOH);
      return {
        answer: `pH = ${fmt(pH)}\npOH = ${fmt(pOH)}`,
        steps: [
          st("pH = -log[H⁺]", `[H⁺] = ${conc.toExponential(2)} mol/L`),
          st("pH = -log[H⁺]", `pH = -log(${conc.toExponential(2)}) = ${fmt(pH)}`),
          st("pOH = 14 - pH", `pOH = 14 - ${fmt(pH)} = ${fmt(pOH)}`),
          st("[OH⁻] = 10^(-pOH)", `[OH⁻] = ${OH.toExponential(3)} mol/L`),
          st(tr(lang,"Classification","Clasificación"),
            pH < 7 ? tr(lang,"Acidic solution (pH < 7)","Solución ácida (pH < 7)") :
            pH > 7 ? tr(lang,"Basic solution (pH > 7)","Solución básica (pH > 7)") :
            tr(lang,"Neutral solution (pH = 7)","Solución neutra (pH = 7)")),
        ],
        graphType: "xy",
        graphTitle: "pH Scale",
        graphData: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14].map(x => ({ x, y: x })),
        graphSeries: [{ key: "y", label: "pH", color: pH < 7 ? "#e74c3c" : "#3498db" }],
        graphXLabel: "pH value", graphYLabel: "pH",
      };
    }
  }

  // Ka → pH of weak acid
  const ka = getNum(text, [/ka\s*=?\s*(\d+\.?\d*[eE][+-]?\d+)/i, /ka\s*[=:]\s*(\d+\.?\d*)/i]);
  const conc = getNum(text, [/(\d+\.?\d*)\s*mol(?:ar|\/L)?/i, /concentraci[oó]n.*?(\d+\.?\d*)/i]);
  if (ka && conc) {
    // pH = ½(pKa - log C)  for weak acid approximation
    const x = Math.sqrt(ka * conc); // [H+]
    const pH = -Math.log10(x);
    const pct_dissoc = (x / conc) * 100;
    return {
      answer: `pH = ${fmt(pH)}\n[H⁺] = ${x.toExponential(3)} mol/L`,
      steps: [
        st(tr(lang,"Weak acid equilibrium","Equilibrio de ácido débil"),
          `HA ⇌ H⁺ + A⁻\nKa = ${ka.toExponential(2)}, C = ${fmt(conc)} M`),
        st("Ka = x²/(C-x) ≈ x²/C",
          `x = √(Ka·C) = √(${ka.toExponential(2)}·${fmt(conc)})\nx = ${x.toExponential(3)} mol/L`),
        st("pH = -log[H⁺]", `pH = -log(${x.toExponential(3)}) = ${fmt(pH)}`),
        st(tr(lang,"% dissociation","% disociación"), `α = x/C × 100 = ${fmt(pct_dissoc, 2)}%`),
      ],
    };
  }

  // Henderson-Hasselbalch: buffer
  if (/buffer|tampon|henderson/i.test(text)) {
    const pKa = getNum(text, [/pka\s*[=:]\s*(\d+\.?\d*)/i]);
    const nums2 = extractNums(text);
    if (pKa && nums2.length >= 2) {
      const salt = nums2[nums2.length - 2];
      const acid = nums2[nums2.length - 1];
      if (salt > 0 && acid > 0) {
        const pH = pKa + Math.log10(salt / acid);
        return {
          answer: `pH = ${fmt(pH)}`,
          steps: [
            st("Henderson-Hasselbalch", "pH = pKa + log([A⁻]/[HA])"),
            st(tr(lang,"Known values","Valores conocidos"),
              `pKa = ${pKa}, [A⁻] = ${salt} M, [HA] = ${acid} M`),
            st("pH = pKa + log([A⁻]/[HA])",
              `pH = ${pKa} + log(${salt}/${acid}) = ${pKa} + ${fmt(Math.log10(salt/acid))} = ${fmt(pH)}`),
          ],
        };
      }
    }
  }

  return null;
}

// ══════════════════════════════════════════════════════════════
// GAS LAWS
// ══════════════════════════════════════════════════════════════
function solveGasLaws(text: string, lang: Lang): Solution | null {
  const lower = text.toLowerCase();
  const processed = preprocessText(text);

  // Extract pressures, volumes, temps
  const pressures = [...processed.matchAll(/(-?\d+\.?\d*[eE]?[+-]?\d*)\s*(?:kPa|atm|Pa|bar|mmHg)/gi)]
    .map(m => {
      const v = parseFloat(m[1]);
      const u = m[0].replace(m[1],"").trim().toLowerCase();
      if (u.includes("kpa")) return v*1000;
      if (u.includes("atm")) return v*101325;
      if (u.includes("mmhg")) return v*133.322;
      if (u.includes("bar")) return v*100000;
      return v;
    });
  const volumes = [...processed.matchAll(/(-?\d+\.?\d*)\s*(?:m[³3]|L|mL|dm[³3])/gi)]
    .map(m => {
      const v = parseFloat(m[1]);
      const u = m[0].replace(m[1],"").trim().toLowerCase();
      if (u.includes("ml")) return v/1000;
      if (u.includes("m³") || u.includes("m3") || u.includes("dm³")) return v*1000;
      return v;
    });
  const temps = [...processed.matchAll(/(-?\d+\.?\d*)\s*°?([CKF])\b/g)]
    .map(m => {
      const v = parseFloat(m[1]), u = m[2];
      if (u === "C") return v + 273.15;
      if (u === "F") return (v-32)*5/9 + 273.15;
      return v;
    });
  const moles = getNum(text, [/(\d+\.?\d*)\s*mol(?!\ar)/i]);

  // Ideal Gas: PV = nRT
  const R = 8.314; // J/(mol·K)
  if (pressures.length >= 1 && volumes.length >= 1 && temps.length >= 1 && moles) {
    const P = pressures[0], V = volumes[0]/1000, T = temps[0], n = moles;
    const PV_nRT = (P*V)/(n*R*T);
    return {
      answer: tr(lang,`State verified: PV/nRT = ${fmt(PV_nRT,3)}`,`Estado verificado: PV/nRT = ${fmt(PV_nRT,3)}`),
      steps: [
        st("PV = nRT", `P=${fmt(P)} Pa, V=${fmt(V)} m³, n=${fmt(n)} mol, T=${fmt(T)} K`),
        st(tr(lang,"Check","Verificación"), `PV/nRT = ${fmt(P)}×${fmt(V)}/(${fmt(n)}×${R}×${fmt(T)}) = ${fmt(PV_nRT,4)}`),
      ],
      graphType: "xy",
      graphTitle: tr(lang,"Pressure vs Volume (Boyle's Law)","Presión vs Volumen (Ley de Boyle)"),
      graphData: Array.from({length:20},(_,i)=>{ const Vp=(i+1)*V/10; return {x:parseFloat(Vp.toFixed(4)), y:parseFloat((n*R*T/Vp).toFixed(1))}; }),
      graphSeries: [{key:"y",label:"P (Pa)",color:"#7C3AED"}],
      graphXLabel:"V (m³)", graphYLabel:"P (Pa)",
    };
  }

  // Boyle: P1V1 = P2V2
  if (pressures.length >= 2 && volumes.length >= 1) {
    const P1=pressures[0], V1=volumes[0], P2=pressures[1];
    const V2 = P1*V1/P2;
    const graphData = Array.from({length:30},(_,i)=>{ const v=(i+1)*Math.max(V1,V2)/15; return {x:parseFloat(v.toFixed(3)),y:parseFloat((P1*V1/v).toFixed(2))}; });
    return {
      answer: `V₂ = ${fmt(V2)} L`,
      steps: [
        st("Boyle's Law / Ley de Boyle", "P₁V₁ = P₂V₂ (isothermal/isotérmico)"),
        st(tr(lang,"Known values","Valores conocidos"), `P₁=${fmt(P1/1000)} kPa, V₁=${fmt(V1)} L, P₂=${fmt(P2/1000)} kPa`),
        st("V₂ = P₁V₁/P₂", `V₂ = ${fmt(P1/1000)}×${fmt(V1)}/${fmt(P2/1000)} = ${fmt(V2)} L`),
      ],
      graphType:"xy", graphTitle:tr(lang,"Boyle's Law","Ley de Boyle"),
      graphData, graphSeries:[{key:"y",label:"P (kPa)",color:"#059669"}],
      graphXLabel:"V (L)", graphYLabel:"P (kPa)",
    };
  }

  // Charles: V1/T1 = V2/T2
  if (volumes.length >= 2 && temps.length >= 1) {
    const V1=volumes[0], T1=temps[0], V2=volumes[1];
    const T2 = V2*T1/V1;
    return {
      answer: `T₂ = ${fmt(T2)} K (${fmt(T2-273.15,1)} °C)`,
      steps: [
        st("Charles's Law / Ley de Charles", "V₁/T₁ = V₂/T₂ (isobaric/isobárico)"),
        st(tr(lang,"Known values","Valores conocidos"), `V₁=${fmt(V1)} L, T₁=${fmt(T1)} K, V₂=${fmt(V2)} L`),
        st("T₂ = V₂·T₁/V₁", `T₂ = ${fmt(V2)}×${fmt(T1)}/${fmt(V1)} = ${fmt(T2)} K = ${fmt(T2-273.15,1)} °C`),
      ],
      graphType:"xy", graphTitle:tr(lang,"Charles's Law","Ley de Charles"),
      graphData: Array.from({length:20},(_,i)=>{const T=(i+1)*T2/10; return {x:parseFloat(T.toFixed(1)),y:parseFloat((V1*T/T1).toFixed(3))};}),
      graphSeries:[{key:"y",label:"V (L)",color:"#D97706"}],
      graphXLabel:"T (K)", graphYLabel:"V (L)",
    };
  }

  // Gay-Lussac: P1/T1 = P2/T2
  if (pressures.length >= 2 && temps.length >= 1) {
    const P1=pressures[0], T1=temps[0], P2=pressures[1];
    const T2 = P2*T1/P1;
    return {
      answer: `T₂ = ${fmt(T2)} K (${fmt(T2-273.15,1)} °C)`,
      steps: [
        st("Gay-Lussac's Law", "P₁/T₁ = P₂/T₂ (isochoric/isocórico)"),
        st(tr(lang,"Known values","Valores conocidos"), `P₁=${fmt(P1/1000)} kPa, T₁=${fmt(T1)} K, P₂=${fmt(P2/1000)} kPa`),
        st("T₂ = P₂·T₁/P₁", `T₂ = ${fmt(T2)} K = ${fmt(T2-273.15,1)} °C`),
      ],
    };
  }

  return null;
}

// ══════════════════════════════════════════════════════════════
// STOICHIOMETRY
// ══════════════════════════════════════════════════════════════
function solveStiochiometry(text: string, lang: Lang): Solution | null {
  const lower = text.toLowerCase();

  // Moles from mass: n = m/M
  const massMatch = text.match(/(\d+\.?\d*)\s*g(?:rams?)?\s+(?:of\s+)?(?:de\s+)?([A-Z][a-zA-Z0-9]*)/);
  if (massMatch) {
    const mass = parseFloat(massMatch[1]);
    const formula = massMatch[2];
    const M = molarMassOf(formula);
    if (M > 0) {
      const n = mass / M;
      const molecules = n * 6.022e23;
      return {
        answer: `n = ${fmt(n)} mol\nN = ${molecules.toExponential(3)} molecules`,
        steps: [
          st(tr(lang,"Molar mass","Masa molar"), `M(${formula}) = ${fmt(M,2)} g/mol`),
          st("n = m/M", `n = ${mass} g / ${fmt(M,2)} g/mol = ${fmt(n)} mol`),
          st(tr(lang,"Number of molecules","Número de moléculas"),
            `N = n × Nₐ = ${fmt(n)} × 6.022×10²³ = ${molecules.toExponential(3)}`),
        ],
      };
    }
  }

  // Percent yield
  if (/rendimiento|percent\s*yield|yield/i.test(text)) {
    const nums = extractNums(text);
    if (nums.length >= 2) {
      const actual = nums[0], theoretical = nums[1];
      const pct = (actual/theoretical)*100;
      return {
        answer: `% Yield = ${fmt(pct,2)}%`,
        steps: [
          st(tr(lang,"Percent yield","Rendimiento porcentual"), "% Rendimiento = (rendimiento real / teórico) × 100"),
          st(tr(lang,"Values","Valores"), `Actual=${fmt(actual)} g, Theoretical=${fmt(theoretical)} g`),
          st(tr(lang,"Result","Resultado"), `% = (${fmt(actual)}/${fmt(theoretical)}) × 100 = ${fmt(pct,2)}%`),
        ],
      };
    }
  }

  return null;
}

// ══════════════════════════════════════════════════════════════
// THERMOCHEMISTRY
// ══════════════════════════════════════════════════════════════
function solveThermoChem(text: string, lang: Lang): Solution | null {
  const lower = text.toLowerCase();

  // Calorimetry: q = mcΔT
  const nums = extractNums(text);
  if (/calorim|q\s*=\s*mc|calor\s+espec[ií]fico|specific\s+heat/i.test(text)) {
    const mass = getNum(text, [/(\d+\.?\d*)\s*g/i, /(\d+\.?\d*)\s*kg/i]);
    const c    = getNum(text, [/c\s*[=:]\s*(\d+\.?\d*)/i, /(\d+\.?\d*)\s*J\/(?:g·?K|g·?°C)/i]) ?? 4.184;
    const dt   = getNum(text, [/δt\s*[=:]\s*(\d+\.?\d*)/i, /ΔT\s*[=:]\s*(\d+\.?\d*)/i,
                               /cambia\s+(?:de\s+)?(\d+\.?\d*)/i]);
    if (mass && dt) {
      const q = mass * c * dt;
      return {
        answer: `q = ${fmt(q)} J = ${fmt(q/1000)} kJ`,
        steps: [
          st("q = m·c·ΔT", tr(lang,"Calorimetry equation","Ecuación de calorimetría")),
          st(tr(lang,"Known values","Valores conocidos"),
            `m = ${fmt(mass)} g, c = ${fmt(c)} J/(g·°C), ΔT = ${fmt(dt)} °C`),
          st(tr(lang,"Result","Resultado"),
            `q = ${fmt(mass)} × ${fmt(c)} × ${fmt(dt)} = ${fmt(q)} J = ${fmt(q/1000)} kJ`),
          st(q>0 ? tr(lang,"Endothermic (absorbs heat)","Endotérmica (absorbe calor)")
                 : tr(lang,"Exothermic (releases heat)","Exotérmica (libera calor)"),
            q>0 ? "q > 0 → endothermic" : "q < 0 → exothermic"),
        ],
      };
    }
  }

  return null;
}

// ══════════════════════════════════════════════════════════════
// ELECTROCHEMISTRY
// ══════════════════════════════════════════════════════════════
function solveElectroChem(text: string, lang: Lang): Solution | null {
  const lower = text.toLowerCase();

  if (/celda\s+galv[aá]nica|galvanic\s+cell|potencial\s+standard|standard\s+cell|E°/i.test(text)) {
    const potentials = [...text.matchAll(/E°?\s*[=:]\s*([+-]?\d+\.?\d*)\s*V/gi)]
      .map(m => parseFloat(m[1]));
    if (potentials.length >= 2) {
      const Ecath = Math.max(...potentials);
      const Ean   = Math.min(...potentials);
      const Ecell = Ecath - Ean;
      const spontaneous = Ecell > 0;
      return {
        answer: `E°cell = ${fmt(Ecell)} V\n${spontaneous ? "✓ Spontaneous" : "✗ Non-spontaneous"}`,
        steps: [
          st("E°cell = E°cathode - E°anode",
            `Cathode (reduction): ${fmt(Ecath)} V\nAnode (oxidation): ${fmt(Ean)} V`),
          st(tr(lang,"Cell potential","Potencial de celda"),
            `E°cell = ${fmt(Ecath)} - (${fmt(Ean)}) = ${fmt(Ecell)} V`),
          st(spontaneous ? "✓ Spontaneous (E° > 0)" : "✗ Non-spontaneous (E° < 0)",
            `ΔG° = -nFE° = ${spontaneous?"<0 (favored)":">0 (not favored)"}`),
        ],
      };
    }
  }

  return null;
}

// ══════════════════════════════════════════════════════════════
// EQUILIBRIUM
// ══════════════════════════════════════════════════════════════
function solveEquilibrium(text: string, lang: Lang): Solution | null {
  if (/kc|equilibrio|equilibrium|ice\s*table|tabla\s*ice/i.test(text)) {
    const nums = extractNums(text);
    const Kc = getNum(text, [/Kc\s*[=:]\s*(\d+\.?\d*[eE]?[+-]?\d*)/i, /K\s*[=:]\s*(\d+\.?\d*[eE]?[+-]?\d*)/i]);
    const concInit = nums.filter(n => n > 0 && n < 100).slice(0, 2);

    if (Kc && concInit.length >= 1) {
      const C0 = concInit[0];
      // Simple A ⇌ B: Kc = x/(C0-x)
      // x² + Kc·x - Kc·C0 = 0
      const a=1, b=Kc, c=-Kc*C0;
      const x = (-b + Math.sqrt(b*b - 4*a*c)) / (2*a);
      const A_eq = C0 - x, B_eq = x;
      return {
        answer: `[Products] = ${fmt(x)} M\n[Reactants] = ${fmt(A_eq)} M`,
        steps: [
          st(tr(lang,"ICE Table","Tabla ICE"),
            `A ⇌ B\nInitial: [A]=${fmt(C0)} M, [B]=0\nChange: -x, +x\nEquil: [A]=${fmt(C0)}-x, [B]=x`),
          st(`Kc = [B]/[A] = x/(C₀-x) = ${fmt(Kc)}`,
            `x² + ${fmt(Kc)}x - ${fmt(Kc*C0)} = 0`),
          st(tr(lang,"Solve for x","Resolver para x"),
            `x = ${fmt(x)} M\n[A]_eq = ${fmt(A_eq)} M\n[B]_eq = ${fmt(B_eq)} M`),
          st(tr(lang,"Verify","Verificar"),
            `Kc = ${fmt(B_eq)}/${fmt(A_eq)} = ${fmt(B_eq/A_eq,4)} ≈ ${fmt(Kc)}`),
        ],
      };
    }
  }
  return null;
}

// ══════════════════════════════════════════════════════════════
// SOLUTIONS / CONCENTRATION
// ══════════════════════════════════════════════════════════════
function solveSolutions(text: string, lang: Lang): Solution | null {
  const lower = text.toLowerCase();

  // Dilution: M1V1 = M2V2
  if (/dilut|diluci[oó]n/i.test(text)) {
    const concPairs = [...text.matchAll(/(\d+\.?\d*)\s*M(?:\s+(?:and|y|en)\s+)?.*?(\d+\.?\d*)\s*(?:mL|L)/gi)];
    const nums = extractNums(text);
    if (nums.length >= 3) {
      const M1=nums[0], V1=nums[1], M2orV2=nums[2];
      if (/find.*m2|hallar.*m2|nueva\s+molaridad/i.test(text)) {
        const V2 = M2orV2;
        const M2 = M1*V1/V2;
        return {
          answer: `M₂ = ${fmt(M2)} mol/L`,
          steps: [
            st("M₁V₁ = M₂V₂", "Dilution equation / Ecuación de dilución"),
            st(tr(lang,"Known values","Valores conocidos"), `M₁=${fmt(M1)} M, V₁=${fmt(V1)} mL, V₂=${fmt(V2)} mL`),
            st("M₂ = M₁V₁/V₂", `M₂ = ${fmt(M1)}×${fmt(V1)}/${fmt(V2)} = ${fmt(M2)} M`),
          ],
        };
      }
      const M2=M2orV2;
      const V2 = M1*V1/M2;
      return {
        answer: `V₂ = ${fmt(V2)} mL`,
        steps: [
          st("M₁V₁ = M₂V₂", "Dilution equation"),
          st(tr(lang,"Known values","Valores conocidos"), `M₁=${fmt(M1)} M, V₁=${fmt(V1)} mL, M₂=${fmt(M2)} M`),
          st("V₂ = M₁V₁/M₂", `V₂ = ${fmt(M1)}×${fmt(V1)}/${fmt(M2)} = ${fmt(V2)} mL`),
        ],
      };
    }
  }

  // Molarity: M = n/V
  if (/molaridad|molarity|mol\/L/i.test(text)) {
    const n = getNum(text, [/(\d+\.?\d*)\s*mol/i]);
    const V = getNum(text, [/(\d+\.?\d*)\s*L/i, /(\d+\.?\d*)\s*mL/i]);
    if (n && V) {
      const M = n / (V > 100 ? V/1000 : V); // if mL, convert
      return {
        answer: `M = ${fmt(M)} mol/L`,
        steps: [
          st("M = n/V", `n = ${fmt(n)} mol, V = ${fmt(V > 100 ? V/1000 : V)} L`),
          st(tr(lang,"Result","Resultado"), `M = ${fmt(n)}/${fmt(V>100?V/1000:V)} = ${fmt(M)} mol/L`),
        ],
      };
    }
  }

  return null;
}

// ══════════════════════════════════════════════════════════════
// MOLECULE RECOGNITION
// ══════════════════════════════════════════════════════════════
function recognizeMolecule(text: string): string | null {
  const lower = text.toLowerCase();
  if (/\bh2o\b|water|agua|water\s+molecule/i.test(text)) return "H2O";
  if (/\bco2\b|carbon\s*dioxide|di[oó]xido\s+de\s+carbono/i.test(text)) return "CO2";
  if (/\bch4\b|methane|metano/i.test(text)) return "CH4";
  if (/\bnh3\b|ammonia|amon[ií]aco/i.test(text)) return "NH3";
  if (/\bhcl\b|hydrochloric/i.test(text)) return "HCl";
  if (/\bh2so4\b|sulfuric|sulf[uú]rico/i.test(text)) return "H2SO4";
  if (/\bc6h6\b|benzene|benceno/i.test(text)) return "C6H6";
  if (/\bnacl\b|sodium\s+chloride|cloruro\s+de\s+sodio|sal\s+de\s+mesa/i.test(text)) return "NaCl";
  return null;
}

// ══════════════════════════════════════════════════════════════
// MAIN CHEMISTRY SOLVER
// ══════════════════════════════════════════════════════════════
export function solveChemistry(text: string, lang: Lang): Solution {
  const lower = text.toLowerCase();
  const moleculeName = recognizeMolecule(text);

  const solvers: Array<() => Solution | null> = [
    () => /ph|poh|ka|kb|acid|base|buffer|tampon|henderson/i.test(text) ? solveAcidBase(text, lang) : null,
    () => /kpa|atm|boyle|charles|gay.lussac|ideal.*gas|ley.*gas|gas.*law|pv.*nrt/i.test(text) ? solveGasLaws(text, lang) : null,
    () => /dilut|diluc|molaridad|molarity|mol\/L/i.test(text) ? solveSolutions(text, lang) : null,
    () => /stoich|estequio|rendimiento|percent.*yield|mol.*gram|gramo.*mol/i.test(text) ? solveStiochiometry(text, lang) : null,
    () => /calor[iíì]metr|specific\s*heat|calor\s+espec[ií]fico|q\s*=\s*mc|ΔH|entalp[ií]a/i.test(text) ? solveThermoChem(text, lang) : null,
    () => /celda|galv[aá]nica|E°|potencial.*celda|standard.*potential/i.test(text) ? solveElectroChem(text, lang) : null,
    () => /kc\b|equilibr|tabla.*ice|ice.*table/i.test(text) ? solveEquilibrium(text, lang) : null,
    () => solveGasLaws(text, lang),  // try gas laws even without explicit keywords
    () => solveStiochiometry(text, lang),
  ];

  for (const solver of solvers) {
    try {
      const result = solver();
      if (result) {
        if (moleculeName && !result.moleculeName) result.moleculeName = moleculeName;
        return result;
      }
    } catch {}
  }

  return {
    answer: tr(lang,"Could not solve automatically","No se pudo resolver automáticamente"),
    steps: [{
      title: tr(lang,"Tip","Consejo"),
      explanation: tr(lang,
        "Try being explicit: 'Ka = 1.8×10⁻⁵, concentration = 0.1 M, find pH' or 'P₁ = 2 atm, V₁ = 5 L, P₂ = 4 atm, find V₂'",
        "Sé explícito: 'Ka = 1.8×10⁻⁵, concentración = 0.1 M, calcular pH' o 'P₁ = 2 atm, V₁ = 5 L, P₂ = 4 atm, calcular V₂'"
      ),
    }],
    moleculeName: moleculeName ?? undefined,
  };
}
