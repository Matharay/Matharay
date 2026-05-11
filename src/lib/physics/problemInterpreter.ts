// ─────────────────────────────────────────────────────────────
// Problem Interpreter v2 — context flags + asked variable detection
// ─────────────────────────────────────────────────────────────

type Lang = "en" | "es";
import { preprocessText } from "./unitParser";

// ── Context flags ─────────────────────────────────────────────
export const CONTEXT_PATTERNS: { patterns: RegExp[]; flag: string }[] = [
  // Kinematics
  { flag: "v0_zero",        patterns: [/parte\s+del\s+reposo|desde\s+el\s+reposo|inicia\s+(?:en\s+)?reposo|starts?\s+from\s+rest|initially\s+at\s+rest|begins?\s+at\s+rest/i] },
  { flag: "vf_zero",        patterns: [/se\s+detiene|queda\s+en\s+reposo|para\s+(?:completamente|en\s+reposo)|comes?\s+to\s+(?:a\s+)?rest|stops?/i] },
  { flag: "falling",        patterns: [/cae\s+(?:libremente|desde|verticalmente)|caída\s+libre|se\s+deja\s+caer|falls?\s+(?:freely|from|down)|free\s+fall|dropped?/i] },
  { flag: "projectile_up",  patterns: [/lanzado\s+(?:verticalmente\s+)?hacia\s+arriba|se\s+lanza\s+hacia\s+arriba|thrown?\s+upward|launched?\s+upward/i] },
  { flag: "projectile_oblique", patterns: [/[aá]ngulo\s+(?:de\s+)?(?:\d+°|lanzamiento)|lanzado\s+con\s+un\s+[aá]ngulo|formando\s+un\s+[aá]ngulo|at\s+an\s+angle|launched?\s+at|fired?\s+at\s+\d/i] },
  // Gravity
  { flag: "universal_gravity", patterns: [/fuerza\s+de\s+atracci[oó]n|atracci[oó]n\s+gravitacional|gravitaci[oó]n\s+universal|ley\s+de\s+newton\s+de\s+la\s+gravitaci[oó]n|separad[ao]s?\s+por|se\s+atraen|gravitational\s+(?:force|attraction)|universal\s+gravitation/i] },
  // Newton / forces
  { flag: "has_friction",   patterns: [/coef(?:iciente)?\s+de\s+fricci[oó]n|fricci[oó]n\s+(?:cin[eé]tica|est[aá]tica)|friction\s+coefficient|μ\s*[=:]/i] },
  { flag: "has_incline",    patterns: [/plano\s+inclinado|rampa|inclinaci[oó]n|inclined?\s+(?:plane|surface|ramp)|slope\s+of/i] },
  { flag: "has_pulley",     patterns: [/polea|cuerda.*colgante|colgante.*cuerda|colgante.*polea|pulley|hanging\s+(?:mass|block)|atwood/i] },
  { flag: "circular_motion",patterns: [/(?:movimiento\s+)?circular|curva\s+(?:horizontal|de\s+radio)|radio\s+de\s+(?:la\s+)?(?:curva|giro)|centripet[ao]|circular\s+motion|takes?\s+a\s+(?:curve|turn)|rounds?\s+a\s+curve/i] },
  // Springs / SHM
  { flag: "spring_shm",     patterns: [/resorte|constante\s+el[aá]stica|oscila|muelle|spring|elastic\s+constant|simple\s+harmonic|SHM|oscillat/i] },
  // Thermodynamics
  { flag: "isothermal",     patterns: [/isoterm|temperatura\s+constante|isothermal|constant\s+temperature/i] },
  { flag: "isobaric",       patterns: [/isobar|presi[oó]n\s+constante|isobaric|constant\s+pressure/i] },
  { flag: "isochoric",      patterns: [/isoc[oó]rico|volumen\s+constante|isochoric|constant\s+volume/i] },
  { flag: "adiabatic",      patterns: [/adiab[aá]t/i] },
  { flag: "half_volume",    patterns: [/volumen\s+(?:se\s+reduce|se\s+comprime)\s+a\s+la\s+mitad|mitad\s+del\s+volumen|volume\s+(?:is\s+)?(?:halved|reduced\s+to\s+half)/i] },
  { flag: "double_volume",  patterns: [/volumen\s+se\s+duplica|volume\s+(?:is\s+)?doubled/i] },
  // Electric
  { flag: "coulomb_force",  patterns: [/fuerza\s+el[eé]ctrica|ley\s+de\s+coulomb|cargas?\s+el[eé]ctrica|se\s+repelen|se\s+atraen.*carga|coulomb(?:'?s)?\s+(?:force|law)|electric\s+(?:force|charge)/i] },
  { flag: "transformer",    patterns: [/transformador|primario|secundario|bobina|transformer|primary|secondary|winding|transmisi[oó]n.*voltaje/i] },
  { flag: "series_circuit", patterns: [/en\s+serie|series\s+circuit/i] },
  { flag: "parallel_circuit",patterns: [/en\s+paralelo|parallel\s+circuit/i] },
  // Optics
  { flag: "snell_refraction",patterns: [/refracci[oó]n|[íi]ndice\s+de\s+refracci[oó]n|vidrio|[aá]ngulo\s+de\s+incidencia|snell|refract|angle\s+of\s+incidence/i] },
  { flag: "reflection",     patterns: [/reflexi[oó]n|espejo|reflect|mirror/i] },
  // Orbital / satellite
  { flag: "orbital",        patterns: [/sat[eé]lite|[oó]rbita|velocidad\s+orbital|satellite|orbits?|orbital\s+(?:speed|velocity|period)/i] },
  // Rotation
  { flag: "rolling",        patterns: [/rueda\s+sin\s+deslizar|rodando\s+sin|rolling\s+without|descends?\s+rolling/i] },
  { flag: "rotation",       patterns: [/momento\s+de\s+inercia|torque|par\s+de\s+fuerzas|momento\s+angular|rotaci[oó]n|gira|angular\s+(?:momentum|velocity|acceleration)|moment\s+of\s+inertia|torque/i] },
  // Waves
  { flag: "wave",           patterns: [/onda|frecuencia.*longitud|wavelength|wave\s+(?:speed|frequency)/i] },
];

// ── Asked variable detection ──────────────────────────────────
const ASK_PATTERNS: { symbol: string; en: RegExp[]; es: RegExp[] }[] = [
  { symbol: "F",       es: [/fuerza\s+(?:de\s+atracci[oó]n|el[eé]ctrica|net[ao]|resultante|centr[ií]peta)?/i, /cu[aá]l\s+es\s+la\s+fuerza/i, /calcula\s+la\s+fuerza/i, /determina\s+la\s+fuerza/i], en: [/(?:find|calculate|determine|what\s+is)\s+(?:the\s+)?force/i, /how\s+much\s+force/i] },
  { symbol: "a",       es: [/aceleraci[oó]n\s+del\s+sistema|calcula\s+la\s+aceleraci[oó]n|determina\s+la\s+aceleraci[oó]n|cu[aá]l\s+es\s+la\s+aceleraci[oó]n/i], en: [/(?:find|calculate|determine|what\s+is)\s+(?:the\s+)?acceleration/i] },
  { symbol: "v",       es: [/velocidad\s+(?:final|m[aá]xima|orbital|de\s+impacto|con\s+la\s+que)/i, /calcula\s+la\s+velocidad/i, /a\s+qu[eé]\s+velocidad/i, /cu[aá]l\s+es\s+la\s+velocidad/i], en: [/(?:find|calculate)\s+(?:the\s+)?(?:final\s+|maximum\s+|orbital\s+)?velocity/i, /how\s+fast/i] },
  { symbol: "v0",      es: [/velocidad\s+inicial/i], en: [/initial\s+velocity/i] },
  { symbol: "d",       es: [/(?:cu[aá]nto\s+(?:recorre|avanza|viaja|camina))|distancia\s+(?:horizontal|total|recorrida)|alcance\s+horizontal/i, /qu[eé]\s+distancia/i], en: [/how\s+far|(?:find|calculate)\s+(?:the\s+)?(?:horizontal\s+)?(?:distance|range)/i] },
  { symbol: "r",       es: [/a\s+qu[eé]\s+distancia\s+se\s+encuentran|calcula\s+la\s+distancia\s+entre/i], en: [/(?:at\s+what|find\s+the)\s+distance\s+(?:between|apart|are)/i] },
  { symbol: "t",       es: [/tiempo\s+(?:total\s+de\s+vuelo|tarda|de\s+vuelo|en\s+completar)|cu[aá]nto\s+tiempo|en\s+qu[eé]\s+tiempo/i], en: [/(?:find|calculate)\s+(?:the\s+)?(?:total\s+)?time|how\s+long/i] },
  { symbol: "T_period",es: [/periodo\s+de\s+(?:oscilaci[oó]n|la\s+oscilaci[oó]n|la\s+vuelta)|tiempo\s+(?:en\s+dar\s+una\s+vuelta|en\s+completar\s+una\s+vuelta)/i], en: [/period\s+of\s+(?:oscillation|orbit)|time\s+(?:for\s+one|to\s+complete\s+(?:a|one))\s+(?:revolution|orbit)/i] },
  { symbol: "h",       es: [/altura\s+m[aá]xima|a\s+qu[eé]\s+altura|cu[aá]nto\s+(?:sube|eleva)/i], en: [/maximum\s+height|how\s+high/i] },
  { symbol: "KE",      es: [/energ[ií]a\s+cin[eé]tica/i], en: [/kinetic\s+energy/i] },
  { symbol: "PE",      es: [/energ[ií]a\s+potencial/i], en: [/potential\s+energy/i] },
  { symbol: "E_total", es: [/energ[ií]a\s+(?:mec[aá]nica\s+)?total|energ[ií]a\s+del\s+sistema/i], en: [/total\s+(?:mechanical\s+)?energy/i] },
  { symbol: "W_work",  es: [/trabajo\s+(?:realizado|efectuado|del\s+gas|sobre\s+el\s+gas)/i], en: [/work\s+(?:done|performed|on\s+the\s+gas)/i] },
  { symbol: "P_gas2",  es: [/nueva\s+presi[oó]n|presi[oó]n\s+(?:final|resultante)/i], en: [/new\s+pressure|final\s+pressure/i] },
  { symbol: "T_tension",es: [/tensi[oó]n\s+(?:en\s+la\s+cuerda|de\s+la\s+cuerda)|calcula\s+la\s+tensi[oó]n/i], en: [/tension\s+in\s+the\s+(?:rope|string|cord)/i] },
  { symbol: "θ_refr",  es: [[/[áa]ngulo\s+de\s+refracci[oó]n/i][0]], en: [/angle\s+of\s+refraction/i] },
  { symbol: "v_light", es: [/velocidad\s+de\s+la\s+luz\s+(?:dentro|en)\s+el/i], en: [/(?:speed|velocity)\s+of\s+light\s+(?:in|inside|within)\s+the/i] },
  { symbol: "I1",      es: [/corriente\s+en\s+el\s+primario/i], en: [/current\s+in\s+the\s+primary/i] },
  { symbol: "I2",      es: [/corriente\s+en\s+el\s+secundario/i], en: [/current\s+in\s+the\s+secondary/i] },
  { symbol: "v_orbital",es: [/velocidad\s+orbital/i], en: [/orbital\s+(?:speed|velocity)/i] },
  { symbol: "p",       es: [/momento\s+lineal|cantidad\s+de\s+movimiento/i], en: [/(?:linear\s+)?momentum/i] },
  { symbol: "V_e",     es: [/voltaje|tensi[oó]n\s+el[eé]ctrica/i], en: [/voltage/i] },
  { symbol: "I",       es: [/corriente\s+el[eé]ctrica/i], en: [/electric\s+current/i] },
  { symbol: "R_elec",  es: [/resistencia\s+el[eé]ctrica/i], en: [/electric\s+resistance/i] },
];

export function detectContextFlags(text: string): Set<string> {
  const processed = preprocessText(text);
  const flags = new Set<string>();
  for (const { flag, patterns } of CONTEXT_PATTERNS) {
    if (patterns.some((p) => p.test(processed))) flags.add(flag);
  }
  return flags;
}

export function detectAskedVariables(text: string, lang: Lang): string[] {
  const processed = preprocessText(text);
  const langKey = lang === "es" ? "es" : "en";
  const found: string[] = [];
  for (const { symbol, es, en } of ASK_PATTERNS) {
    const patterns = langKey === "es" ? es : en;
    if (patterns.some((p) => p.test(processed))) found.push(symbol);
  }
  return found;
}

export function detectAskedVariable(text: string, lang: Lang): string | null {
  const vars = detectAskedVariables(text, lang);
  return vars[0] ?? null;
}

// ── Symbol assignment ─────────────────────────────────────────
export function mapUnitToSymbol(
  siUnit: string,
  candidates: string[],
  existingSymbols: Set<string>,
  contextFlags: Set<string>,
  askedSymbols: string[]
): string | null {
  const available = candidates.filter((c) => !existingSymbols.has(c) && !askedSymbols.includes(c));
  if (available.length === 0) {
    // Allow re-use if it's m1/m2
    const reuse = candidates.find((c) => !existingSymbols.has(c));
    return reuse ?? null;
  }

  // Two-mass context → m1 then m2
  if (siUnit === "kg" && (contextFlags.has("universal_gravity") || contextFlags.has("coulomb_force") || contextFlags.has("has_pulley"))) {
    if (!existingSymbols.has("m1")) return "m1";
    if (!existingSymbols.has("m2")) return "m2";
  }

  // Two-voltage context (transformer)
  if (siUnit === "V_e" && contextFlags.has("transformer")) {
    if (!existingSymbols.has("V1")) return "V1";
    if (!existingSymbols.has("V2")) return "V2";
  }

  // Two-charge context (Coulomb)
  if (siUnit === "C_q" && contextFlags.has("coulomb_force")) {
    if (!existingSymbols.has("q1")) return "q1";
    if (!existingSymbols.has("q2")) return "q2";
  }

  // Two-pressure context (gas processes)
  if (siUnit === "Pa" && contextFlags.has("isothermal")) {
    if (!existingSymbols.has("P_gas")) return "P_gas";
    if (!existingSymbols.has("P_gas2")) return "P_gas2";
  }

  // Velocity disambiguation
  if (siUnit === "m/s") {
    if (contextFlags.has("v0_zero") && !existingSymbols.has("v0")) return "v0";
    if (available.includes("v0") && !existingSymbols.has("v0")) return "v0";
    if (available.includes("v")) return "v";
    return available[0];
  }

  // Distance disambiguation
  if (siUnit === "m") {
    if (contextFlags.has("universal_gravity") || contextFlags.has("coulomb_force")) {
      if (!existingSymbols.has("r")) return "r";
    }
    if (contextFlags.has("orbital")) {
      if (!existingSymbols.has("h_orbit")) return "h_orbit";
    }
    if (contextFlags.has("has_incline") || contextFlags.has("rolling")) {
      if (available.includes("L") && !existingSymbols.has("L")) return "L";
      if (available.includes("R_cyl") && !existingSymbols.has("R_cyl")) return "R_cyl";
    }
    if (contextFlags.has("spring_shm") && !existingSymbols.has("A_amp")) return "A_amp";
    if (contextFlags.has("falling") || contextFlags.has("projectile_oblique")) {
      if (available.includes("h") && !existingSymbols.has("h")) return "h";
      if (available.includes("y0") && !existingSymbols.has("y0")) return "y0";
    }
    if (available.includes("d")) return "d";
    return available[0];
  }

  return available[0];
}
