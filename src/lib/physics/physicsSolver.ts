// ─────────────────────────────────────────────────────────────
// Physics Solver v2 — comprehensive domain coverage
// ─────────────────────────────────────────────────────────────

import { Solution, SolutionStep } from "@/contexts/AppContext";
import { parseValues, parseDimensionless, preprocessText } from "./unitParser";
import { detectContextFlags, detectAskedVariables, mapUnitToSymbol } from "./problemInterpreter";

type Lang = "en" | "es";

// ── Constants ──────────────────────────────────────────────────
const g     = 9.8;
const G_UNI = 6.674e-11;  // N·m²/kg²
const K_E   = 8.99e9;     // N·m²/C²
const c_LIGHT = 3e8;      // m/s
const R_GAS = 8.314;      // J/(mol·K)
const R_EARTH = 6.371e6;  // m
const M_EARTH = 5.972e24; // kg

// ── Helpers ────────────────────────────────────────────────────
const tr = (lang: Lang, en: string, es: string) => lang === "en" ? en : es;
const fmt = (n: number, d = 3) => {
  if (!isFinite(n)) return "∞";
  if (Math.abs(n) >= 1e4 || (Math.abs(n) < 0.001 && n !== 0)) return n.toExponential(d);
  return String(parseFloat(n.toFixed(d)));
};
const step = (title: string, explanation: string): SolutionStep => ({ title, explanation });
const notSolved = (lang: Lang): Solution => ({
  answer: tr(lang,"Could not solve automatically","No se pudo resolver automáticamente"),
  steps: [step(
    tr(lang,"Tip","Consejo"),
    tr(lang,
      "Try stating values explicitly with units, e.g. 'mass = 5 kg, velocity = 20 m/s'. State what you want to find.",
      "Intenta indicar los valores explícitamente con unidades, ej. 'masa = 5 kg, velocidad = 20 m/s'. Indica qué deseas encontrar."
    )
  )],
});

// Multi-answer builder
function multi(answers: string[], steps: SolutionStep[]): Solution {
  return { answer: answers.join("\n"), steps };
}

// ── Kinematics ─────────────────────────────────────────────────
function solveKinematics(k: Map<string, number>, asked: string[], lang: Lang, flags: Set<string>): Solution | null {
  const v0 = k.get("v0") ?? (flags.has("v0_zero") ? 0 : undefined);
  const vf = k.get("vf") ?? k.get("v");
  const a  = k.get("a");
  const d  = k.get("d") ?? k.get("h");
  const t  = k.get("t");

  const answers: string[] = [];
  const steps: SolutionStep[] = [];

  // MRU: d=vt
  if (a === undefined && (vf !== undefined || v0 !== undefined) && t !== undefined && (asked.includes("d") || (!asked.length && d === undefined))) {
    const vel = vf ?? v0!;
    const dist = vel * t;
    steps.push(step(tr(lang,"Uniform Motion (MRU)","Movimiento Rectilíneo Uniforme"), `v=${fmt(vel)} m/s, t=${fmt(t)} s\nd = v·t = ${fmt(vel)}·${fmt(t)}`));
    answers.push(`d = ${fmt(dist)} m`);
    return multi(answers, steps);
  }
  if (a === undefined && d !== undefined && t !== undefined && asked.includes("v")) {
    const vel = d/t;
    steps.push(step(tr(lang,"MRU: v = d/t","MRU: v = d/t"), `d=${fmt(d)} m, t=${fmt(t)} s`));
    answers.push(`v = ${fmt(vel)} m/s`);
    return multi(answers, steps);
  }

  // MRUA equations
  const results: string[] = [];
  const sts: SolutionStep[] = [];

  // Known summary
  const knownStr = [v0!==undefined?`v₀=${fmt(v0)} m/s`:"", vf!==undefined?`vf=${fmt(vf)} m/s`:"", a!==undefined?`a=${fmt(a)} m/s²`:"", d!==undefined?`d=${fmt(d)} m`:"", t!==undefined?`t=${fmt(t)} s`:""].filter(Boolean).join(", ");
  if (!knownStr) return null;
  sts.push(step(tr(lang,"Known values","Valores conocidos"), knownStr));

  // v = v₀ + at
  if (asked.includes("vf") || asked.includes("v")) {
    if (v0 !== undefined && a !== undefined && t !== undefined) {
      const val = v0 + a*t;
      sts.push(step("v = v₀ + a·t", `v = ${fmt(v0)} + ${fmt(a)}·${fmt(t)} = ${fmt(val)} m/s`));
      results.push(`v = ${fmt(val)} m/s`);
    }
  }
  if (asked.includes("v") || asked.includes("vf") || (!asked.length && vf === undefined)) {
    if (v0 !== undefined && a !== undefined && d !== undefined) {
      const vfSq = v0*v0 + 2*a*d;
      if (vfSq >= 0) {
        const val = Math.sqrt(vfSq);
        sts.push(step("v² = v₀² + 2·a·d", `v² = ${fmt(v0)}² + 2·${fmt(a)}·${fmt(d)} = ${fmt(vfSq)}\nv = ${fmt(val)} m/s`));
        if (!results.length) results.push(`v = ${fmt(val)} m/s`);
      }
    }
  }
  if (asked.includes("d") || (!asked.length && d === undefined)) {
    if (v0 !== undefined && a !== undefined && t !== undefined) {
      const val = v0*t + 0.5*a*t*t;
      sts.push(step("d = v₀t + ½at²", `d = ${fmt(v0)}·${fmt(t)} + ½·${fmt(a)}·${fmt(t)}² = ${fmt(val)} m`));
      results.push(`d = ${fmt(val)} m`);
    }
  }
  if (asked.includes("a") || (!asked.length && a === undefined)) {
    if (v0 !== undefined && vf !== undefined && t !== undefined) {
      const val = (vf-v0)/t;
      sts.push(step("a = (v-v₀)/t", `a = (${fmt(vf)}-${fmt(v0)})/${fmt(t)} = ${fmt(val)} m/s²`));
      results.push(`a = ${fmt(val)} m/s²`);
    }
  }
  if (asked.includes("t") || (!asked.length && t === undefined)) {
    if (v0 !== undefined && vf !== undefined && a !== undefined && a !== 0) {
      const val = (vf-v0)/a;
      sts.push(step("t = (v-v₀)/a", `t = (${fmt(vf)}-${fmt(v0)})/${fmt(a)} = ${fmt(val)} s`));
      results.push(`t = ${fmt(val)} s`);
    }
  }

  // Free fall special cases
  if (flags.has("falling")) {
    if ((asked.includes("v") || asked.includes("vf") || !asked.length) && d !== undefined && (v0 === undefined || v0 === 0)) {
      const val = Math.sqrt(2*g*d);
      sts.push(step(tr(lang,"Free fall: v=√(2gh)","Caída libre: v=√(2gh)"), `v = √(2·${g}·${fmt(d)}) = ${fmt(val)} m/s`));
      if (!results.length) results.push(`v = ${fmt(val)} m/s`);
    }
    if ((asked.includes("t") || !asked.length) && d !== undefined && (v0 === undefined || v0 === 0)) {
      const val = Math.sqrt(2*d/g);
      sts.push(step(tr(lang,"Free fall: t=√(2h/g)","Caída libre: t=√(2h/g)"), `t = √(2·${fmt(d)}/${g}) = ${fmt(val)} s`));
      if (!results.some(r=>r.startsWith("t"))) results.push(`t = ${fmt(val)} s`);
    }
  }
  if (flags.has("projectile_up") && v0 !== undefined) {
    const hMax = v0*v0/(2*g);
    const tUp = v0/g;
    sts.push(step(tr(lang,"Projectile up — max height","Proyectil hacia arriba — altura máxima"),
      `h_max = v₀²/(2g) = ${fmt(v0)}²/(2·${g}) = ${fmt(hMax)} m\nt_up = v₀/g = ${fmt(tUp)} s`));
    if (asked.includes("h") || !asked.length) results.push(`h_max = ${fmt(hMax)} m`);
    if (asked.includes("t")) results.push(`t_subida = ${fmt(tUp)} s`);
  }

  if (results.length) return multi(results, sts);
  return null;
}

// ── Oblique Projectile ─────────────────────────────────────────
function solveProjectileOblique(k: Map<string, number>, asked: string[], lang: Lang, flags: Set<string>): Solution | null {
  const v0   = k.get("v0") ?? k.get("v");
  const θ    = k.get("angle") ?? k.get("θ");
  const y0   = k.get("y0") ?? k.get("h") ?? 0; // launch height
  if (v0 === undefined || θ === undefined) return null;

  const vx   = v0 * Math.cos(θ);
  const vy0  = v0 * Math.sin(θ);
  const steps: SolutionStep[] = [];
  const results: string[] = [];

  steps.push(step(tr(lang,"Decompose initial velocity","Descomponer velocidad inicial"),
    `v₀ = ${fmt(v0)} m/s, θ = ${fmt(θ*180/Math.PI, 1)}°\nvₓ = v₀·cos(θ) = ${fmt(vx)} m/s\nvy₀ = v₀·sin(θ) = ${fmt(vy0)} m/s`));

  // Total flight time: y0 + vy0·t - ½g·t² = 0
  const A = -0.5*g, B = vy0, C = y0;
  const disc = B*B - 4*A*C;
  const t1 = (-B + Math.sqrt(disc)) / (2*A);
  const t2 = (-B - Math.sqrt(disc)) / (2*A);
  const tFlight = Math.max(t1, t2);

  steps.push(step(tr(lang,"Total flight time","Tiempo total de vuelo"),
    `y = y₀ + vy₀·t - ½g·t² = 0\n${fmt(y0)} + ${fmt(vy0)}·t - ${fmt(-A)}·t² = 0\nt = ${fmt(tFlight)} s`));
  results.push(`t_vuelo = ${fmt(tFlight)} s`);

  // Horizontal range
  const xRange = vx * tFlight;
  steps.push(step(tr(lang,"Horizontal range","Alcance horizontal"),
    `x = vₓ·t = ${fmt(vx)}·${fmt(tFlight)} = ${fmt(xRange)} m`));
  results.push(`x = ${fmt(xRange)} m`);

  // Impact velocity
  const vyFinal = vy0 - g*tFlight;
  const vImpact = Math.sqrt(vx*vx + vyFinal*vyFinal);
  const θImpact = Math.atan2(Math.abs(vyFinal), vx) * 180/Math.PI;
  steps.push(step(tr(lang,"Impact velocity","Velocidad de impacto"),
    `vy_final = vy₀ - g·t = ${fmt(vy0)} - ${g}·${fmt(tFlight)} = ${fmt(vyFinal)} m/s\n|v| = √(vₓ²+vy²) = √(${fmt(vx*vx)}+${fmt(vyFinal*vyFinal)}) = ${fmt(vImpact)} m/s\nθ = ${fmt(θImpact, 1)}° ${tr(lang,"below horizontal","bajo la horizontal")}`));
  results.push(`v_impacto = ${fmt(vImpact)} m/s`);

  // Max height
  const tUp = vy0/g;
  const hMax = y0 + vy0*tUp - 0.5*g*tUp*tUp;
  steps.push(step(tr(lang,"Maximum height","Altura máxima"),
    `t_cima = vy₀/g = ${fmt(tUp)} s\nh_max = ${fmt(y0)} + ${fmt(vy0)}·${fmt(tUp)} - ½·${g}·${fmt(tUp)}² = ${fmt(hMax)} m`));
  results.push(`h_max = ${fmt(hMax)} m`);

  return multi(results, steps);
}

// ── Newton's Laws ──────────────────────────────────────────────
function solveNewton(k: Map<string, number>, asked: string[], lang: Lang, flags: Set<string>): Solution | null {
  const F  = k.get("F");
  const m  = k.get("m");
  const a  = k.get("a");
  const μ  = k.get("μ");

  if (flags.has("has_incline") && flags.has("has_pulley")) return null; // handled by inclined pulley solver

  if (F !== undefined && m !== undefined && a === undefined) {
    const aVal = F/m;
    return multi([`a = ${fmt(aVal)} m/s²`], [step("F=ma → a=F/m", `a = ${fmt(F)}/${fmt(m)} = ${fmt(aVal)} m/s²`)]);
  }
  if (m !== undefined && a !== undefined && F === undefined) {
    const fNet = m*a;
    if (μ !== undefined) {
      const ff = μ*m*g;
      const fApp = fNet + ff;
      return multi([`F_neta = ${fmt(fNet)} N`, `F_aplicada = ${fmt(fApp)} N`], [
        step(tr(lang,"Net force","Fuerza neta"), `F_neta = m·a = ${fmt(m)}·${fmt(a)} = ${fmt(fNet)} N`),
        step(tr(lang,"Friction force","Fuerza de fricción"), `f = μ·m·g = ${fmt(μ)}·${fmt(m)}·${g} = ${fmt(ff)} N`),
        step(tr(lang,"Applied force","Fuerza aplicada"), `F_ap = F_neta + f = ${fmt(fApp)} N`),
      ]);
    }
    return multi([`F = ${fmt(fNet)} N`], [step("F = m·a", `F = ${fmt(m)}·${fmt(a)} = ${fmt(fNet)} N`)]);
  }
  if (m !== undefined && a === undefined && F === undefined) {
    const W = m*g;
    return multi([`W = ${fmt(W)} N`], [step(tr(lang,"Weight","Peso"), `W = m·g = ${fmt(m)}·${g} = ${fmt(W)} N`)]);
  }
  return null;
}

// ── Inclined Plane + Pulley ────────────────────────────────────
function solveInclinedPulley(k: Map<string, number>, asked: string[], lang: Lang, flags: Set<string>): Solution | null {
  if (!flags.has("has_pulley") && !flags.has("has_incline")) return null;
  const m1 = k.get("m1"); // on incline
  const m2 = k.get("m2"); // hanging
  const θ  = k.get("angle") ?? k.get("θ");
  const μ  = k.get("μ");

  // Pure Atwood machine (no incline, just two hanging masses)
  if (m1 !== undefined && m2 !== undefined && θ === undefined && !flags.has("has_incline")) {
    const a  = (m2-m1)*g/(m1+m2);
    const T  = 2*m1*m2*g/(m1+m2);
    return multi([`a = ${fmt(a)} m/s²`, `T = ${fmt(T)} N`], [
      step(tr(lang,"Atwood machine","Máquina de Atwood"),
        tr(lang,"Two hanging masses connected by a rope over a pulley.",
           "Dos masas colgantes unidas por una cuerda sobre una polea.")),
      step(tr(lang,"Net force","Fuerza neta"), `(m₂-m₁)·g = (${fmt(m2)}-${fmt(m1)})·${g} = ${fmt((m2-m1)*g)} N`),
      step(tr(lang,"Acceleration","Aceleración"), `a = (m₂-m₁)·g/(m₁+m₂) = ${fmt(a)} m/s²`),
      step(tr(lang,"Tension","Tensión"), `T = 2·m₁·m₂·g/(m₁+m₂) = ${fmt(T)} N`),
    ]);
  }

  // Inclined plane + hanging mass
  if (m1 !== undefined && m2 !== undefined && θ !== undefined) {
    const sinθ = Math.sin(θ), cosθ = Math.cos(θ);
    const frictionForce = μ !== undefined ? μ*m1*g*cosθ : 0;
    // m2 pulls down, m1 on incline: net = m2·g - m1·g·sinθ - friction
    const netForce = m2*g - m1*g*sinθ - frictionForce;
    const aVal = netForce / (m1+m2);
    const T = m2*(g - aVal);
    const direction = aVal >= 0
      ? tr(lang,"m₂ descends, m₁ moves up the incline","m₂ desciende, m₁ sube por el plano")
      : tr(lang,"m₁ slides down the incline, m₂ rises","m₁ desliza hacia abajo, m₂ sube");
    const frStr = μ !== undefined ? `\nf = μ·m₁·g·cos(θ) = ${fmt(μ)}·${fmt(m1)}·${g}·${fmt(cosθ,3)} = ${fmt(frictionForce)} N` : "";

    return multi([`a = ${fmt(Math.abs(aVal))} m/s²`, `T = ${fmt(T)} N`], [
      step(tr(lang,"System setup","Configuración del sistema"),
        `m₁ = ${fmt(m1)} kg ${tr(lang,"on incline","en plano")}, m₂ = ${fmt(m2)} kg ${tr(lang,"hanging","colgante")}\nθ = ${fmt(θ*180/Math.PI,1)}°, sin(θ)=${fmt(sinθ,4)}, cos(θ)=${fmt(cosθ,4)}`),
      step(tr(lang,"Forces on each mass","Fuerzas sobre cada masa"),
        `m₂: m₂·g = ${fmt(m2*g)} N ${tr(lang,"down","↓")}\nm₁: m₁·g·sin(θ) = ${fmt(m1*g*sinθ)} N ${tr(lang,"down the incline","cuesta abajo")}${frStr}`),
      step(tr(lang,"Net force & acceleration","Fuerza neta y aceleración"),
        `F_net = ${fmt(m2*g)} - ${fmt(m1*g*sinθ)} - ${fmt(frictionForce)} = ${fmt(netForce)} N\na = F_net/(m₁+m₂) = ${fmt(netForce)}/${fmt(m1+m2)} = ${fmt(aVal)} m/s²\n${direction}`),
      step(tr(lang,"Tension in the rope","Tensión en la cuerda"),
        `T = m₂·(g-a) = ${fmt(m2)}·(${g}-${fmt(aVal)}) = ${fmt(T)} N`),
    ]);
  }

  // Single mass on incline
  if ((m1 !== undefined || k.get("m") !== undefined) && θ !== undefined) {
    const mass = m1 ?? k.get("m")!;
    const sinθ = Math.sin(θ), cosθ = Math.cos(θ);
    const fGravDown = mass*g*sinθ;
    const fNormal = mass*g*cosθ;
    const fFric = μ !== undefined ? μ*fNormal : 0;
    const aVal = (fGravDown - fFric) / mass;

    return multi([`a = ${fmt(aVal)} m/s²`], [
      step(tr(lang,"Inclined plane forces","Fuerzas en plano inclinado"),
        `F_gravedad_paralela = m·g·sin(θ) = ${fmt(fGravDown)} N\nF_normal = m·g·cos(θ) = ${fmt(fNormal)} N${μ !== undefined ? `\nF_fricción = μ·N = ${fmt(fFric)} N` : ""}`),
      step(tr(lang,"Net acceleration","Aceleración neta"),
        `a = (${fmt(fGravDown)} - ${fmt(fFric)}) / ${fmt(mass)} = ${fmt(aVal)} m/s²`),
    ]);
  }
  return null;
}

// ── Circular Motion ────────────────────────────────────────────
function solveCircularMotion(k: Map<string, number>, asked: string[], lang: Lang): Solution | null {
  const m = k.get("m");
  const v = k.get("v") ?? k.get("v0") ?? k.get("vf");
  const r = k.get("r") ?? k.get("d");
  const μ = k.get("μ");

  if (m === undefined || v === undefined || r === undefined) return null;

  const Fc = m*v*v/r;
  const results: string[] = [];
  const sts: SolutionStep[] = [
    step(tr(lang,"Known values","Valores conocidos"), `m=${fmt(m)} kg, v=${fmt(v)} m/s, r=${fmt(r)} m`),
    step(tr(lang,"Centripetal force","Fuerza centrípeta"), `Fc = m·v²/r = ${fmt(m)}·${fmt(v)}²/${fmt(r)} = ${fmt(Fc)} N`),
  ];
  results.push(`Fc = ${fmt(Fc)} N`);

  // Friction check for sliding
  if (μ !== undefined) {
    const fMax = μ*m*g;
    const slides = Fc > fMax;
    sts.push(step(tr(lang,"Max static friction","Fricción estática máxima"),
      `f_max = μ·m·g = ${fmt(μ)}·${fmt(m)}·${g} = ${fmt(fMax)} N`));
    sts.push(step(slides
      ? tr(lang,"⚠ The car WILL skid (Fc > f_max)","⚠ El automóvil SÍ derrapa (Fc > f_max)")
      : tr(lang,"✓ The car will NOT skid (Fc ≤ f_max)","✓ El automóvil NO derrapa (Fc ≤ f_max)"),
      `Fc = ${fmt(Fc)} N ${slides?">":"≤"} f_max = ${fmt(fMax)} N`));
    results.push(slides
      ? tr(lang,"Result: SKIDS","Resultado: SÍ DERRAPA")
      : tr(lang,"Result: does NOT skid","Resultado: NO derrapa"));
    results.push(`f_requerida = ${fmt(Fc)} N`);
  }

  return multi(results, sts);
}

// ── Spring / SHM ───────────────────────────────────────────────
function solveSHM(k: Map<string, number>, asked: string[], lang: Lang): Solution | null {
  const m  = k.get("m");
  const kk = k.get("k"); // spring constant
  const A  = k.get("A_amp");

  if (kk === undefined) return null;
  const results: string[] = [];
  const sts: SolutionStep[] = [
    step(tr(lang,"Spring-Mass System (SHM)","Sistema Masa-Resorte (MAS)"),
      `k = ${fmt(kk)} N/m${m !== undefined ? `, m = ${fmt(m)} kg` : ""}${A !== undefined ? `, A = ${fmt(A)} m` : ""}`),
  ];

  // Total mechanical energy
  if (A !== undefined) {
    const E = 0.5*kk*A*A;
    sts.push(step("E = ½kA²", `E = ½·${fmt(kk)}·${fmt(A)}² = ${fmt(E)} J`));
    results.push(`E_total = ${fmt(E)} J`);
  }

  // Maximum velocity
  if (A !== undefined && m !== undefined) {
    const vMax = A * Math.sqrt(kk/m);
    sts.push(step("v_max = A·√(k/m)", `v_max = ${fmt(A)}·√(${fmt(kk)}/${fmt(m)}) = ${fmt(vMax)} m/s`));
    results.push(`v_max = ${fmt(vMax)} m/s`);
  }

  // Period
  if (m !== undefined) {
    const T = 2*Math.PI*Math.sqrt(m/kk);
    const f = 1/T;
    sts.push(step("T = 2π·√(m/k)", `T = 2π·√(${fmt(m)}/${fmt(kk)}) = ${fmt(T)} s\nf = 1/T = ${fmt(f)} Hz`));
    results.push(`T = ${fmt(T)} s`, `f = ${fmt(f)} Hz`);
  }

  if (results.length === 0) return null;
  return multi(results, sts);
}

// ── Energy & Work ──────────────────────────────────────────────
function solveEnergy(k: Map<string, number>, asked: string[], lang: Lang, flags: Set<string>): Solution | null {
  const m  = k.get("m");
  const v  = k.get("v") ?? k.get("vf");
  const h  = k.get("h") ?? k.get("d");
  const F  = k.get("F");
  const d  = k.get("d");
  const θ  = k.get("angle") ?? k.get("θ") ?? 0;

  const results: string[] = [];
  const sts: SolutionStep[] = [];

  if (m !== undefined && v !== undefined && (asked.includes("KE") || !asked.length)) {
    const ke = 0.5*m*v*v;
    sts.push(step("KE = ½mv²", `KE = ½·${fmt(m)}·${fmt(v)}² = ${fmt(ke)} J`));
    results.push(`KE = ${fmt(ke)} J`);
  }
  if (m !== undefined && h !== undefined && (asked.includes("PE") || !asked.length)) {
    const pe = m*g*h;
    sts.push(step("PE = mgh", `PE = ${fmt(m)}·${g}·${fmt(h)} = ${fmt(pe)} J`));
    results.push(`PE = ${fmt(pe)} J`);
  }
  if (F !== undefined && d !== undefined && (asked.includes("W_work") || !asked.length)) {
    const cosθ = Math.cos(θ);
    const W = F*d*cosθ;
    sts.push(step("W = F·d·cos(θ)", `W = ${fmt(F)}·${fmt(d)}·${fmt(cosθ,3)} = ${fmt(W)} J`));
    results.push(`W = ${fmt(W)} J`);
  }

  if (results.length === 0) return null;
  return multi(results, sts);
}

// ── Rolling Motion ─────────────────────────────────────────────
function solveRolling(k: Map<string, number>, asked: string[], lang: Lang, flags: Set<string>): Solution | null {
  if (!flags.has("rolling") && !flags.has("has_incline")) return null;
  const m  = k.get("m");
  const L  = k.get("L") ?? k.get("d");
  const θ  = k.get("angle") ?? k.get("θ");
  const R  = k.get("R_cyl");

  if (m === undefined || L === undefined || θ === undefined) return null;

  const sinθ = Math.sin(θ);
  const h = L*sinθ;
  // Cylinder: I = ½mr² → a = ⅔g·sinθ
  const I_factor = 0.5; // ½mr² for solid cylinder; could extend for sphere (⅖), disk, etc.
  const a = g*sinθ / (1 + I_factor);
  const v = Math.sqrt(2*g*h/(1 + I_factor));

  return multi([`a = ${fmt(a)} m/s²`, `v_final = ${fmt(v)} m/s`], [
    step(tr(lang,"Rolling without slipping — solid cylinder","Rodadura sin deslizamiento — cilindro macizo"),
      `m=${fmt(m)} kg, L=${fmt(L)} m, θ=${fmt(θ*180/Math.PI,1)}°\nI = ½mr² → factor = ½`),
    step(tr(lang,"Height of ramp","Altura de la rampa"),
      `h = L·sin(θ) = ${fmt(L)}·${fmt(sinθ,4)} = ${fmt(h)} m`),
    step(tr(lang,"Acceleration","Aceleración"),
      `a = g·sin(θ)/(1+I/mr²) = ${g}·${fmt(sinθ,4)}/(1+½) = ${fmt(a)} m/s²`),
    step(tr(lang,"Final velocity (energy conservation)","Velocidad final (conservación de energía)"),
      `½mv²+½Iω² = mgh → v = √(4gh/3) = √(4·${g}·${fmt(h)}/3) = ${fmt(v)} m/s`),
  ]);
}

// ── Thermodynamics ─────────────────────────────────────────────
function solveThermo(k: Map<string, number>, asked: string[], lang: Lang, flags: Set<string>): Solution | null {
  const P1  = k.get("P_gas");
  const V1  = k.get("V_gas");
  const T1  = k.get("T_temp"); // already in Kelvin
  const n   = k.get("n_mol");
  let V2    = k.get("V_gas2");
  let P2    = k.get("P_gas2");

  // "volume halved/doubled" virtual values
  if (V1 !== undefined) {
    if (flags.has("half_volume"))   V2 = V1/2;
    if (flags.has("double_volume")) V2 = V1*2;
  }

  const results: string[] = [];
  const sts: SolutionStep[] = [];

  // Isothermal: P1V1 = P2V2
  if (flags.has("isothermal") && P1 !== undefined && V1 !== undefined) {
    if (V2 !== undefined && P2 === undefined) {
      const P2val = P1*V1/V2;
      const W = -P1*V1*Math.log(V2/V1) * 1000; // convert L·Pa → mJ ... use SI: V in m³
      // V in Liters → m³
      const V1_m3 = V1/1000, V2_m3 = V2/1000;
      const W_J = P1 * V1_m3 * Math.log(V1_m3/V2_m3); // work done ON gas (compression)
      sts.push(step(tr(lang,"Isothermal process: P₁V₁ = P₂V₂","Proceso isotérmico: P₁V₁ = P₂V₂"),
        `P₁ = ${fmt(P1/1000)} kPa, V₁ = ${fmt(V1)} L, V₂ = ${fmt(V2)} L`));
      sts.push(step("P₂ = P₁·V₁/V₂", `P₂ = ${fmt(P1/1000)}·${fmt(V1)}/${fmt(V2)} = ${fmt(P2val/1000)} kPa`));
      sts.push(step(tr(lang,"Work done on gas: W = P₁V₁·ln(V₁/V₂)","Trabajo sobre el gas: W = P₁V₁·ln(V₁/V₂)"),
        `W = ${fmt(P1/1000)} kPa·${fmt(V1)} L·ln(${fmt(V1)}/${fmt(V2)})\nW = ${fmt(W_J)} J\n${W_J>0?tr(lang,"(compression — work done ON gas)","(compresión — trabajo realizado SOBRE el gas)"):tr(lang,"(expansion — work done BY gas)","(expansión — trabajo realizado POR el gas)")}`));
      results.push(`P₂ = ${fmt(P2val/1000)} kPa`, `W = ${fmt(W_J)} J`);
      return multi(results, sts);
    }
  }

  // Ideal gas law: PV = nRT
  if (P1 !== undefined && V1 !== undefined && T1 !== undefined && n !== undefined) {
    const R_calc = P1*(V1/1000) / (n*T1);
    sts.push(step("PV = nRT", `P=${fmt(P1)} Pa, V=${fmt(V1/1000)} m³, n=${fmt(n)} mol, T=${fmt(T1)} K\nR = PV/nT = ${fmt(R_calc)} (should be ≈ ${R_GAS})`));
    return multi([tr(lang,"State confirmed via PV=nRT","Estado verificado con PV=nRT")], sts);
  }

  return null;
}

// ── Momentum ───────────────────────────────────────────────────
function solveMomentum(k: Map<string, number>, asked: string[], lang: Lang): Solution | null {
  const m = k.get("m");
  const v = k.get("v") ?? k.get("vf");
  const p = k.get("p");

  if (m !== undefined && v !== undefined && (asked.includes("p") || !asked.length)) {
    const pVal = m*v;
    return multi([`p = ${fmt(pVal)} kg·m/s`], [
      step("p = m·v", `p = ${fmt(m)}·${fmt(v)} = ${fmt(pVal)} kg·m/s`),
    ]);
  }
  if (m !== undefined && p !== undefined) {
    const vVal = p/m;
    return multi([`v = ${fmt(vVal)} m/s`], [step("v = p/m", `v = ${fmt(p)}/${fmt(m)} = ${fmt(vVal)} m/s`)]);
  }
  return null;
}

// ── Coulomb's Law ──────────────────────────────────────────────
function solveCoulomb(k: Map<string, number>, asked: string[], lang: Lang): Solution | null {
  const q1 = k.get("q1");
  const q2 = k.get("q2");
  const r  = k.get("r") ?? k.get("d");

  if (q1 === undefined || q2 === undefined || r === undefined) return null;

  const F = K_E * Math.abs(q1) * Math.abs(q2) / (r*r);
  const attractive = (q1 * q2) < 0;
  const dirStr = attractive
    ? tr(lang,"Attractive (opposite charges)","Atractiva (cargas de signo opuesto)")
    : tr(lang,"Repulsive (same sign charges)","Repulsiva (cargas del mismo signo)");

  return multi([`F = ${fmt(F)} N`, dirStr], [
    step("Coulomb's Law / Ley de Coulomb",
      `F = k·|q₁|·|q₂|/r²\nk = 8.99×10⁹ N·m²/C²`),
    step(tr(lang,"Known values","Valores conocidos"),
      `q₁ = ${q1.toExponential(2)} C, q₂ = ${q2.toExponential(2)} C, r = ${fmt(r)} m`),
    step(tr(lang,"Substitute","Sustituir"),
      `F = ${K_E.toExponential(3)}·${Math.abs(q1).toExponential(2)}·${Math.abs(q2).toExponential(2)}/${fmt(r)}²`),
    step(tr(lang,"Result & direction","Resultado y dirección"),
      `F = ${fmt(F)} N\n${dirStr}`),
  ]);
}

// ── Electricity ────────────────────────────────────────────────
function solveElectricity(k: Map<string, number>, asked: string[], lang: Lang): Solution | null {
  const V  = k.get("V_e") ?? k.get("V1");
  const I  = k.get("I");
  const R  = k.get("R_elec");
  const P  = k.get("P_power");

  const results: string[] = [];
  const sts: SolutionStep[] = [];

  if (V !== undefined && I !== undefined && R === undefined) {
    const Rv = V/I;
    sts.push(step("R = V/I", `R = ${fmt(V)}/${fmt(I)} = ${fmt(Rv)} Ω`));
    results.push(`R = ${fmt(Rv)} Ω`);
  }
  if (V !== undefined && R !== undefined && I === undefined) {
    const Iv = V/R;
    sts.push(step("I = V/R", `I = ${fmt(V)}/${fmt(R)} = ${fmt(Iv)} A`));
    results.push(`I = ${fmt(Iv)} A`);
  }
  if (I !== undefined && R !== undefined && V === undefined) {
    const Vv = I*R;
    sts.push(step("V = I·R", `V = ${fmt(I)}·${fmt(R)} = ${fmt(Vv)} V`));
    results.push(`V = ${fmt(Vv)} V`);
  }
  if (V !== undefined && I !== undefined) {
    const Pv = V*I;
    sts.push(step("P = V·I", `P = ${fmt(V)}·${fmt(I)} = ${fmt(Pv)} W`));
    results.push(`P = ${fmt(Pv)} W`);
  }
  if (I !== undefined && R !== undefined) {
    const Pv = I*I*R;
    sts.push(step("P = I²·R", `P = ${fmt(I)}²·${fmt(R)} = ${fmt(Pv)} W`));
    if (!results.some(r=>r.startsWith("P"))) results.push(`P = ${fmt(Pv)} W`);
  }
  if (results.length) return multi(results, sts);
  return null;
}

// ── Transformer ────────────────────────────────────────────────
function solveTransformer(k: Map<string, number>, asked: string[], lang: Lang): Solution | null {
  const V1 = k.get("V1");
  const V2 = k.get("V2");
  const P  = k.get("P_power");

  if (V1 === undefined || V2 === undefined || P === undefined) return null;

  const I1 = P/V1;
  const I2 = P/V2;
  const ratio = V1/V2;

  return multi([`I₁ = ${fmt(I1)} A`, `I₂ = ${fmt(I2)} A`], [
    step(tr(lang,"Ideal transformer","Transformador ideal"),
      `V₁ = ${fmt(V1)} V, V₂ = ${fmt(V2)} V, P = ${fmt(P)} W\n${tr(lang,"Turns ratio","Relación de transformación")} N₁/N₂ = V₁/V₂ = ${fmt(ratio, 1)}`),
    step(tr(lang,"Primary current (from P=V·I)","Corriente en primario (de P=V·I)"),
      `I₁ = P/V₁ = ${fmt(P)}/${fmt(V1)} = ${fmt(I1)} A`),
    step(tr(lang,"Secondary current","Corriente en secundario"),
      `I₂ = P/V₂ = ${fmt(P)}/${fmt(V2)} = ${fmt(I2)} A`),
    step(tr(lang,"Verification: P₁ = P₂ (ideal)","Verificación: P₁ = P₂ (ideal)"),
      `P₁ = V₁·I₁ = ${fmt(V1*I1)} W ✓`),
  ]);
}

// ── Waves ──────────────────────────────────────────────────────
function solveWaves(k: Map<string, number>, asked: string[], lang: Lang): Solution | null {
  const f = k.get("f_freq");
  const λ = k.get("λ") ?? k.get("d");
  const v = k.get("v") ?? k.get("vf");

  const results: string[] = [];
  const sts: SolutionStep[] = [];

  if (f !== undefined && λ !== undefined) {
    const vw = f*λ; sts.push(step("v = f·λ", `v = ${fmt(f)}·${fmt(λ)} = ${fmt(vw)} m/s`)); results.push(`v = ${fmt(vw)} m/s`);
  }
  if (v !== undefined && λ !== undefined && f === undefined) {
    const fv = v/λ; sts.push(step("f = v/λ", `f = ${fmt(v)}/${fmt(λ)} = ${fmt(fv)} Hz`)); results.push(`f = ${fmt(fv)} Hz`);
  }
  if (v !== undefined && f !== undefined && λ === undefined) {
    const lv = v/f; sts.push(step("λ = v/f", `λ = ${fmt(v)}/${fmt(f)} = ${fmt(lv)} m`)); results.push(`λ = ${fmt(lv)} m`);
  }
  if (f !== undefined) {
    const T = 1/f; sts.push(step("T = 1/f", `T = 1/${fmt(f)} = ${fmt(T)} s`)); results.push(`T = ${fmt(T)} s`);
  }
  if (results.length) return multi(results, sts);
  return null;
}

// ── Optics / Snell ─────────────────────────────────────────────
function solveOptics(k: Map<string, number>, asked: string[], lang: Lang): Solution | null {
  const n2      = k.get("n_refr");
  const θ_inc   = k.get("θ_inc") ?? k.get("angle") ?? k.get("θ");

  if (n2 === undefined || θ_inc === undefined) return null;

  const n1 = 1.0; // air
  const sinθr = n1*Math.sin(θ_inc)/n2;
  if (Math.abs(sinθr) > 1) {
    return multi([tr(lang,"Total internal reflection","Reflexión interna total")], [
      step(tr(lang,"Snell's Law","Ley de Snell"), `n₁·sin(θ₁) = n₂·sin(θ₂)`),
      step(tr(lang,"Total internal reflection — angle exceeds critical angle","Reflexión interna total — el ángulo supera el crítico"),
        `sin(θ₂) = ${fmt(sinθr)} > 1 → ${tr(lang,"impossible to refract","imposible refractar")}`),
    ]);
  }
  const θr = Math.asin(sinθr);
  const vLight = c_LIGHT/n2;

  return multi([`θ₂ = ${fmt(θr*180/Math.PI, 2)}°`, `v_luz = ${vLight.toExponential(3)} m/s`], [
    step(tr(lang,"Snell's Law: n₁·sin(θ₁) = n₂·sin(θ₂)","Ley de Snell: n₁·sin(θ₁) = n₂·sin(θ₂)"),
      `n₁ (air/aire) = 1.00, n₂ = ${fmt(n2)}\nθ₁ = ${fmt(θ_inc*180/Math.PI, 1)}°`),
    step(tr(lang,"Refraction angle","Ángulo de refracción"),
      `sin(θ₂) = n₁·sin(θ₁)/n₂ = 1.00·sin(${fmt(θ_inc*180/Math.PI,1)}°)/${fmt(n2)}\nsin(θ₂) = ${fmt(sinθr, 4)}\nθ₂ = arcsin(${fmt(sinθr,4)}) = ${fmt(θr*180/Math.PI,2)}°`),
    step(tr(lang,"Speed of light in medium","Velocidad de la luz en el medio"),
      `v = c/n₂ = ${c_LIGHT.toExponential(2)}/${fmt(n2)} = ${vLight.toExponential(3)} m/s`),
  ]);
}

// ── Orbital Mechanics ──────────────────────────────────────────
function solveOrbital(k: Map<string, number>, asked: string[], lang: Lang): Solution | null {
  const h_orbit = k.get("h_orbit") ?? k.get("d") ?? k.get("h");
  const m_sat   = k.get("m") ?? k.get("m1");

  if (h_orbit === undefined) return null;

  const r_orbit = R_EARTH + h_orbit;
  const GM = 3.986e14; // m³/s²
  const v_orb = Math.sqrt(GM/r_orbit);
  const T_orb = 2*Math.PI*r_orbit/v_orb;
  const T_min = T_orb/60;

  return multi([`v_orbital = ${fmt(v_orb)} m/s`, `T = ${fmt(T_orb)} s (${fmt(T_min,1)} min)`], [
    step(tr(lang,"Orbital setup","Configuración orbital"),
      `h = ${fmt(h_orbit/1000)} km ${tr(lang,"above Earth surface","sobre la superficie terrestre")}\nR_Earth = ${fmt(R_EARTH/1000)} km\nr_orbit = R_E + h = ${fmt(r_orbit/1000)} km`),
    step(tr(lang,"Orbital velocity: v = √(GM/r)","Velocidad orbital: v = √(GM/r)"),
      `GM = 3.986×10¹⁴ m³/s²\nv = √(${GM.toExponential(3)}/${r_orbit.toExponential(4)})\nv = ${fmt(v_orb)} m/s ≈ ${fmt(v_orb/1000,2)} km/s`),
    step(tr(lang,"Orbital period: T = 2πr/v","Periodo orbital: T = 2πr/v"),
      `T = 2π·${r_orbit.toExponential(4)}/${fmt(v_orb)}\nT = ${fmt(T_orb)} s = ${fmt(T_min,1)} min ≈ ${fmt(T_orb/3600,2)} h`),
  ]);
}

// ── Universal Gravitation ──────────────────────────────────────
function solveUniversalGravitation(k: Map<string, number>, asked: string[], lang: Lang): Solution | null {
  const m1 = k.get("m1");
  const m2 = k.get("m2");
  const r  = k.get("r") ?? k.get("d");
  const F  = k.get("F");

  if (m1 !== undefined && m2 !== undefined && r !== undefined) {
    const Fval = G_UNI*m1*m2/(r*r);
    return multi([`F = ${Fval.toExponential(3)} N`], [
      step(tr(lang,"Law of Universal Gravitation","Ley de Gravitación Universal"), "F = G·m₁·m₂/r²\nG = 6.674×10⁻¹¹ N·m²/kg²"),
      step(tr(lang,"Known values","Valores conocidos"), `m₁=${fmt(m1)} kg, m₂=${fmt(m2)} kg, r=${fmt(r)} m`),
      step(tr(lang,"Result","Resultado"), `F = ${Fval.toExponential(3)} N`),
    ]);
  }
  if (m1 !== undefined && m2 !== undefined && F !== undefined) {
    const rVal = Math.sqrt(G_UNI*m1*m2/F);
    return multi([`r = ${rVal.toExponential(3)} m`], [
      step("F=G·m₁·m₂/r² → r=√(G·m₁·m₂/F)", `m₁=${fmt(m1)} kg, m₂=${fmt(m2)} kg, F=${F.toExponential(3)} N`),
      step(tr(lang,"Result","Resultado"), `r = ${rVal.toExponential(3)} m`),
    ]);
  }
  return null;
}

// ── MAIN SOLVER ────────────────────────────────────────────────
export function solvePhysics(text: string, lang: Lang): Solution {
  const processed = preprocessText(text);
  const flags  = detectContextFlags(text);
  const askedVars = detectAskedVariables(text, lang);
  const parsed = parseValues(processed);
  const dimless = parseDimensionless(text);

  if (parsed.length === 0 && dimless.size === 0) return notSolved(lang);

  // Build known map
  const known = new Map<string, number>();
  const assigned = new Set<string>();

  // Inject context-derived zero values
  if (flags.has("v0_zero")) { known.set("v0", 0); assigned.add("v0"); }
  if (flags.has("vf_zero")) { known.set("vf", 0); assigned.add("vf"); }

  // Inject dimensionless values (μ, n_refr, A_amp, θ_inc)
  for (const [sym, val] of dimless) {
    if (!assigned.has(sym)) { known.set(sym, sym === "θ_inc" ? val*Math.PI/180 : val); assigned.add(sym); }
  }

  // Assign parsed values
  for (const pv of parsed) {
    const sym = mapUnitToSymbol(pv.siUnit, pv.candidates, assigned, flags, askedVars);
    if (sym && !assigned.has(sym)) {
      known.set(sym, pv.siValue);
      assigned.add(sym);
    }
  }

  // Given values summary
  const givenStr = Array.from(known.entries())
    .filter(([,v]) => v !== 0 || assigned.has("v0"))
    .map(([s,v]) => `${s} = ${typeof v === 'number' && Math.abs(v) >= 1000 ? v.toExponential(3) : fmt(v)}`)
    .join(", ");

  const prependSummary = (sol: Solution): Solution => {
    sol.steps.unshift(step(
      tr(lang,"📋 Interpreted values","📋 Valores interpretados"),
      givenStr || tr(lang,"(no values detected with units)","(no se detectaron valores con unidades)")
    ));
    return sol;
  };

  // Try solvers in priority order
  const tryAll: Array<() => Solution | null> = [
    // Specific flags first (high confidence)
    () => flags.has("universal_gravity") ? solveUniversalGravitation(known, askedVars, lang) : null,
    () => flags.has("coulomb_force")     ? solveCoulomb(known, askedVars, lang) : null,
    () => flags.has("transformer")       ? solveTransformer(known, askedVars, lang) : null,
    () => flags.has("snell_refraction")  ? solveOptics(known, askedVars, lang) : null,
    () => flags.has("orbital")           ? solveOrbital(known, askedVars, lang) : null,
    () => flags.has("spring_shm")        ? solveSHM(known, askedVars, lang) : null,
    () => flags.has("circular_motion")   ? solveCircularMotion(known, askedVars, lang) : null,
    () => flags.has("rolling")           ? solveRolling(known, askedVars, lang) : null,
    () => (flags.has("has_incline")||flags.has("has_pulley")) ? solveInclinedPulley(known, askedVars, lang) : null,
    () => flags.has("projectile_oblique")? solveProjectileOblique(known, askedVars, lang) : null,
    () => (flags.has("isothermal")||flags.has("isobaric")||flags.has("isochoric")) ? solveThermo(known, askedVars, lang) : null,
    // General solvers
    () => solveKinematics(known, askedVars, lang, flags),
    () => solveNewton(known, askedVars, lang, flags),
    () => solveEnergy(known, askedVars, lang, flags),
    () => solveMomentum(known, askedVars, lang),
    () => solveElectricity(known, askedVars, lang),
    () => solveWaves(known, askedVars, lang),
    // Fallbacks without flags
    () => solveUniversalGravitation(known, askedVars, lang),
    () => solveCoulomb(known, askedVars, lang),
    () => solveOptics(known, askedVars, lang),
    () => solveOrbital(known, askedVars, lang),
    () => solveSHM(known, askedVars, lang),
    () => solveRolling(known, askedVars, lang),
  ];

  for (const solver of tryAll) {
    const result = solver();
    if (result && result.answer) return prependSummary(result);
  }

  return prependSummary(notSolved(lang));
}
