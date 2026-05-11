import { Subject, Solution } from "@/contexts/AppContext";
import { solvePhysics } from "./physics/physicsSolver";
import { solveChemistry } from "./chemistry/chemSolver";
import { solveCalculusWithGraph, extractFunctionExpression } from "./calcGrapher";
import { solveEconomics } from "./economics/econSolver";

type Lang = "en" | "es";
const tr = (lang: Lang, en: string, es: string) => lang === "en" ? en : es;

// ── Mathematics ──────────────────────────────────────────────
function solveMath(problem: string, lang: Lang): Solution {
  const linear = problem.match(/(-?\d*\.?\d*)\s*x\s*([+\-])\s*(\d+\.?\d*)\s*=\s*(-?\d+\.?\d*)/);
  if (linear) {
    const a = parseFloat(linear[1] || "1") || 1;
    const op = linear[2], b = parseFloat(linear[3]), c = parseFloat(linear[4]);
    const bSigned = op === "+" ? b : -b;
    const x = (c - bSigned) / a;
    return {
      answer: `x = ${x}`,
      steps: [
        { title: tr(lang,"Identify equation","Identificar ecuación"), explanation: `${a !== 1 ? a : ""}x ${op} ${b} = ${c}` },
        { title: tr(lang,"Isolate variable","Aislar variable"), explanation: `x = (${c} ${op === "+" ? "-" : "+"} ${b}) / ${a} = ${x}` },
      ],
    };
  }

  const quad = problem.match(/(-?\d*\.?\d*)\s*x\s*[²2]\s*([+\-]\s*\d*\.?\d*)\s*x\s*([+\-]\s*\d+\.?\d*)\s*=\s*0/);
  if (quad) {
    const a = parseFloat(quad[1] || "1") || 1;
    const b = parseFloat(quad[2].replace(/\s/g,""));
    const c = parseFloat(quad[3].replace(/\s/g,""));
    const disc = b*b - 4*a*c;
    if (disc < 0) return { answer: tr(lang,"No real roots","Sin raíces reales"),
      steps: [{ title: "Δ = b² - 4ac", explanation: `Δ = ${disc} < 0` }] };
    const x1 = (-b + Math.sqrt(disc))/(2*a), x2 = (-b - Math.sqrt(disc))/(2*a);
    return {
      answer: `x₁ = ${parseFloat(x1.toFixed(4))}, x₂ = ${parseFloat(x2.toFixed(4))}`,
      steps: [
        { title: tr(lang,"Quadratic formula","Fórmula cuadrática"), explanation: "x = (-b ± √(b²-4ac)) / 2a" },
        { title: "Δ = b² - 4ac", explanation: `Δ = ${b}² - 4·${a}·${c} = ${disc}` },
        { title: tr(lang,"Roots","Raíces"), explanation: `x₁ = ${parseFloat(x1.toFixed(4))}, x₂ = ${parseFloat(x2.toFixed(4))}` },
      ],
    };
  }

  try {
    const sanitized = problem.replace(/×/g,"*").replace(/÷/g,"/").replace(/−/g,"-").replace(/\^/g,"**");
    const safe = sanitized.replace(/[^0-9+\-*/().\s]/g,"");
    if (safe.trim()) {
      // eslint-disable-next-line no-new-func
      const result = new Function(`"use strict"; return (${safe})`)();
      if (typeof result === "number" && isFinite(result)) {
        return { answer: `${parseFloat(result.toFixed(6))}`,
          steps: [{ title: tr(lang,"Evaluate","Evaluar"), explanation: `${problem} = ${result}` }] };
      }
    }
  } catch {}

  return { answer: tr(lang,"Could not solve","No se pudo resolver"),
    steps: [{ title: tr(lang,"Tip","Consejo"), explanation: tr(lang,
      "Try: '2x + 5 = 13' or '3x² + 2x - 1 = 0' or a simple expression like '25 * 4 - 12'",
      "Intenta: '2x + 5 = 13' o '3x² + 2x - 1 = 0' o una expresión como '25 * 4 - 12'"
    )}] };
}

// ── Calculus ──────────────────────────────────────────────────
function solveCalculus(problem: string, lang: Lang): Solution {
  const powerDeriv = problem.match(/d\s*\/\s*dx\s*[\[\(]?\s*x\s*\^?\s*(\d+)/i);
  if (powerDeriv) {
    const n = parseInt(powerDeriv[1]);
    const result: Solution = {
      answer: `${n}x^${n-1}`,
      steps: [
        { title: "d/dx(xⁿ) = n·xⁿ⁻¹", explanation: tr(lang,"Power rule for derivatives","Regla de la potencia para derivadas") },
        { title: tr(lang,"Apply","Aplicar"), explanation: `d/dx(x^${n}) = ${n}·x^${n-1}` },
      ],
    };
    const graphPart = solveCalculusWithGraph(`x^${n}`, lang);
    if (graphPart) Object.assign(result, graphPart);
    return result;
  }

  const powerInteg = problem.match(/[∫]\s*x\s*\^?\s*(\d+)\s*dx/i) ||
                     problem.match(/integral\s+(?:of\s+)?x\^(\d+)/i) ||
                     problem.match(/integra[rl]\s+x\^(\d+)/i);
  if (powerInteg) {
    const n = parseInt(powerInteg[1]);
    const result: Solution = {
      answer: `x^${n+1}/${n+1} + C`,
      steps: [
        { title: "∫xⁿ dx = xⁿ⁺¹/(n+1) + C", explanation: tr(lang,"Power rule for integrals","Regla de la potencia para integrales") },
        { title: tr(lang,"Apply","Aplicar"), explanation: `∫x^${n} dx = x^${n+1}/${n+1} + C` },
      ],
    };
    const graphPart = solveCalculusWithGraph(`x^${n}`, lang);
    if (graphPart) Object.assign(result, graphPart);
    return result;
  }

  const expr = extractFunctionExpression(problem);
  if (expr) {
    const graphPart = solveCalculusWithGraph(problem, lang);
    const result: Solution = {
      answer: `f(x) = ${expr}`,
      steps: [
        { title: tr(lang,"Function graphed","Función graficada"), explanation: tr(lang,
          `Plotting f(x) = ${expr} and its derivative f'(x)`,
          `Graficando f(x) = ${expr} y su derivada f'(x)`) },
      ],
    };
    if (graphPart) Object.assign(result, graphPart);
    return result;
  }

  return { answer: tr(lang,"Could not solve","No se pudo resolver"),
    steps: [{ title: tr(lang,"Tip","Consejo"), explanation: tr(lang,
      "Try: 'd/dx(x^3)', '∫x^2 dx', or 'f(x) = sin(x)' to graph",
      "Intenta: 'd/dx(x^3)', '∫x^2 dx', o 'f(x) = sin(x)' para graficar"
    )}] };
}

// ── Main dispatcher ───────────────────────────────────────────
export function solve(problem: string, subject: Subject, lang: Lang): Solution {
  const trimmed = problem.trim();
  if (!trimmed) return { answer: "", steps: [] };
  switch (subject) {
    case "mathematics": return solveMath(trimmed, lang);
    case "calculus":    return solveCalculus(trimmed, lang);
    case "physics":     return solvePhysics(trimmed, lang);
    case "chemistry":   return solveChemistry(trimmed, lang);
    case "economics":   return solveEconomics(trimmed, lang);
    default:            return { answer: tr(lang,"Coming soon","Próximamente"), steps: [] };
  }
}
