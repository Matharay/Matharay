// Simple safe function evaluator for graphing
import { Solution } from "@/contexts/AppContext";

const SAFE_MATH: Record<string, unknown> = {
  sin: Math.sin, cos: Math.cos, tan: Math.tan,
  asin: Math.asin, acos: Math.acos, atan: Math.atan,
  sinh: Math.sinh, cosh: Math.cosh, tanh: Math.tanh,
  sqrt: Math.sqrt, abs: Math.abs, log: Math.log, log10: Math.log10,
  exp: Math.exp, pow: Math.pow, PI: Math.PI, E: Math.E,
};

function safeEval(expr: string, x: number): number | null {
  try {
    const cleaned = expr
      .replace(/\^/g, "**")
      .replace(/(\d)(x)/g, "$1*$2")
      .replace(/([)])(x)/g, "$1*$2")
      .replace(/e\^/g, "Math.exp(")
      .replace(/ln\(/g, "Math.log(")
      .replace(/\bsin\b/g, "Math.sin")
      .replace(/\bcos\b/g, "Math.cos")
      .replace(/\btan\b/g, "Math.tan")
      .replace(/\bsqrt\b/g, "Math.sqrt")
      .replace(/\babs\b/g, "Math.abs")
      .replace(/\bexp\b/g, "Math.exp")
      .replace(/\bPI\b|\bpi\b/g, "Math.PI")
      .replace(/\be\b(?!\w)/g, "Math.E");
    // eslint-disable-next-line no-new-func
    const fn = new Function("x", `"use strict"; try { return (${cleaned}); } catch(e) { return null; }`);
    const result = fn(x);
    return typeof result === "number" && isFinite(result) ? result : null;
  } catch {
    return null;
  }
}

function numericalDerivative(expr: string, x: number): number | null {
  const h = 1e-6;
  const f1 = safeEval(expr, x + h);
  const f2 = safeEval(expr, x - h);
  if (f1 === null || f2 === null) return null;
  return (f1 - f2) / (2 * h);
}

function numericalIntegral(expr: string, a: number, b: number, n = 1000): number {
  const h = (b - a) / n;
  let sum = 0;
  for (let i = 0; i <= n; i++) {
    const x = a + i * h;
    const f = safeEval(expr, x) ?? 0;
    sum += (i === 0 || i === n) ? f : (i % 2 === 0 ? 2 * f : 4 * f);
  }
  return (h / 3) * sum;
}

export function extractFunctionExpression(text: string): string | null {
  const patterns = [
    /f\s*\(\s*x\s*\)\s*=\s*([^\n,;]+)/i,
    /y\s*=\s*([^\n,;]+)/i,
    /grafica\s+([^\n,;]+)/i,
    /graph\s+([^\n,;]+)/i,
    /d\/dx\s*[\[\(]([^\]\)]+)[\]\)]/i,
    /derivative\s+of\s+([^\n,;]+)/i,
    /derivada\s+de\s+([^\n,;]+)/i,
    /integral\s+of\s+([^\n,;]+)/i,
    /integra[rl]\s+([^\n,;]+)/i,
  ];
  for (const p of patterns) {
    const m = p.exec(text);
    if (m) return m[1].trim();
  }
  return null;
}

export function generateFunctionGraph(
  expr: string,
  xMin = -10, xMax = 10, points = 200
): { data: Record<string, number>[]; series: any[] } {
  const step = (xMax - xMin) / points;
  const data: Record<string, number>[] = [];

  for (let i = 0; i <= points; i++) {
    const x = parseFloat((xMin + i * step).toFixed(4));
    const y = safeEval(expr, x);
    const dy = numericalDerivative(expr, x);
    if (y !== null) {
      const row: Record<string, number> = { x };
      row.y = parseFloat(y.toFixed(4));
      if (dy !== null && isFinite(dy)) row.dy = parseFloat(dy.toFixed(4));
      data.push(row);
    }
  }

  return {
    data,
    series: [
      { key: "y",  label: `f(x) = ${expr}`,  color: "#3B5BDB" },
      { key: "dy", label: "f'(x)",            color: "#D97706" },
    ],
  };
}

export function solveCalculusWithGraph(text: string, lang: string): Partial<Solution> | null {
  const expr = extractFunctionExpression(text);
  if (!expr) return null;

  const isDerivative = /deriv|d\/dx/i.test(text);
  const isIntegral   = /integr|∫/i.test(text);

  // Determine range
  const rangeMatch = text.match(/from\s+(-?\d+\.?\d*)\s+to\s+(-?\d+\.?\d*)/i) ||
                     text.match(/de\s+(-?\d+\.?\d*)\s+a\s+(-?\d+\.?\d*)/i);
  const xMin = rangeMatch ? parseFloat(rangeMatch[1]) : -8;
  const xMax = rangeMatch ? parseFloat(rangeMatch[2]) : 8;

  const { data, series } = generateFunctionGraph(expr, xMin, xMax);

  if (isIntegral && rangeMatch) {
    const area = numericalIntegral(expr, xMin, xMax);
    return {
      graphData: data, graphSeries: series,
      graphTitle: `∫f(x)dx from ${xMin} to ${xMax} ≈ ${area.toFixed(4)}`,
      graphXLabel: "x", graphYLabel: "y",
    };
  }

  return {
    graphData: data, graphSeries: series,
    graphTitle: isDerivative ? `f(x) and f'(x)` : `f(x) = ${expr}`,
    graphXLabel: "x", graphYLabel: "y",
  };
}
