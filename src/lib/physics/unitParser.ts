// ─────────────────────────────────────────────────────────────
// Unit Parser v2 — handles scientific notation, N/m, dual values
// ─────────────────────────────────────────────────────────────

export interface ParsedValue {
  raw: string;
  value: number;
  unit: string;
  siValue: number;
  siUnit: string;
  candidates: string[];
}

// ── Preprocess text: normalize scientific notation ────────────
export function preprocessText(text: string): string {
  return text
    // Unicode superscripts → ASCII
    .replace(/⁰/g,"0").replace(/¹/g,"1").replace(/²/g,"2").replace(/³/g,"3")
    .replace(/⁴/g,"4").replace(/⁵/g,"5").replace(/⁶/g,"6").replace(/⁷/g,"7")
    .replace(/⁸/g,"8").replace(/⁹/g,"9").replace(/⁻/g,"-").replace(/⁺/g,"+")
    // Scientific notation variants → e notation
    .replace(/(\d+\.?\d*)\s*[x×·\*]\s*10\^([+-]?\d+)/gi, (_, n, e) => `${n}e${e}`)
    .replace(/(\d+\.?\d*)\s*[x×·\*]\s*10\s*\^\s*\(([+-]?\d+)\)/gi, (_, n, e) => `${n}e${e}`)
    // Unicode minus in exponents
    .replace(/e−(\d+)/g, "e-$1")
    // Comma as decimal separator (Spanish)
    .replace(/(\d),(\d)/g, "$1.$2")
    // Normalize dashes
    .replace(/[−–]/g, "-");
}

// ── Unit map ─────────────────────────────────────────────────
const UNIT_MAP: [RegExp, number, string, string[]][] = [
  // Velocity
  [/km\/h|kmh|kph/i,         1000/3600, "m/s",  ["v","v0","vf"]],
  [/m\/s(?![²2])/,           1,         "m/s",  ["v","v0","vf"]],
  [/cm\/s/i,                 0.01,      "m/s",  ["v","v0","vf"]],
  [/km\/s/i,                 1000,      "m/s",  ["v","v0","vf"]],
  [/mph/i,                   0.44704,   "m/s",  ["v","v0","vf"]],
  // Acceleration
  [/m\/s[²2]/,               1,         "m/s²", ["a"]],
  [/km\/h[²2]/i,             1000/12960,"m/s²", ["a"]],
  // Spring constant (must come before N alone)
  [/N\/m/,                   1,         "N/m",  ["k"]],
  [/kN\/m/i,                 1000,      "N/m",  ["k"]],
  // Force
  [/kN(?!\/)/i,              1000,      "N",    ["F","T"]],
  [/N(?![\/\w])/,            1,         "N",    ["F","T","W_weight"]],
  // Distance
  [/km(?![\/\w])/i,          1000,      "m",    ["d","h","r","L","R_cyl","y0"]],
  [/cm(?![\/\w])/i,          0.01,      "m",    ["d","h","r","L","R_cyl","λ"]],
  [/mm(?![\/\w])/i,          0.001,     "m",    ["d","h","r","L","λ"]],
  [/nm(?![\/\w])/i,          1e-9,      "m",    ["λ"]],
  [/μm(?![\/\w])/i,          1e-6,      "m",    ["λ"]],
  [/m(?![\/\w²³sA])/,        1,         "m",    ["d","h","r","L","R_cyl","y0","λ"]],
  // Time
  [/h(?:ours?|r)?(?=[\s,;.)]|$)/i, 3600,  "s", ["t"]],
  [/min(?:utes?)?(?=[\s,;.)]|$)/i, 60,    "s", ["t"]],
  [/ms(?=[\s,;.)]|$)/i,            0.001, "s", ["t"]],
  [/s(?:ec(?:onds?)?)?(?=[\s,;.)]|$)/i, 1,"s", ["t"]],
  // Mass
  [/kg(?![\/\w])/i,          1,         "kg",   ["m","m1","m2"]],
  [/g(?=[\s,;.)]|$)/,        0.001,     "kg",   ["m","m1","m2"]],
  [/mg(?!\/)/i,              1e-6,      "kg",   ["m","m1","m2"]],
  [/lb(?![\/\w])/i,          0.4536,    "kg",   ["m","m1","m2"]],
  [/ton(?![\/\w])/i,         1000,      "kg",   ["m","m1","m2"]],
  // Energy / Work / Heat
  [/kJ(?![\/\w])/i,          1000,      "J",    ["E","KE","PE","W_work","Q"]],
  [/MJ(?![\/\w])/i,          1e6,       "J",    ["E","KE","PE","W_work","Q"]],
  [/J(?![\/\w])/,            1,         "J",    ["E","KE","PE","W_work","Q"]],
  [/cal(?!\/)/i,             4.184,     "J",    ["Q"]],
  [/kcal(?![\/\w])/i,        4184,      "J",    ["Q"]],
  // Power
  [/kW(?![\/\w])/i,          1000,      "W_p",  ["P_power"]],
  [/MW(?![\/\w])/i,          1e6,       "W_p",  ["P_power"]],
  [/W(?![\/\w])/,            1,         "W_p",  ["P_power"]],
  [/hp(?![\/\w])/i,          745.7,     "W_p",  ["P_power"]],
  // Pressure
  [/kPa(?![\/\w])/i,         1000,      "Pa",   ["P_gas"]],
  [/MPa(?![\/\w])/i,         1e6,       "Pa",   ["P_gas"]],
  [/Pa(?![\/\w])/i,          1,         "Pa",   ["P_gas"]],
  [/atm(?![\/\w])/i,         101325,    "Pa",   ["P_gas"]],
  [/bar(?![\/\w])/i,         100000,    "Pa",   ["P_gas"]],
  [/mmHg(?![\/\w])/i,        133.322,   "Pa",   ["P_gas"]],
  [/psi(?![\/\w])/i,         6894.76,   "Pa",   ["P_gas"]],
  // Temperature
  [/°?C(?=[\s,;.)]|$)/,      1,         "°C",   ["T_temp"]],
  [/°?K(?=[\s,;.)]|$)/,      1,         "K",    ["T_temp"]],
  [/°?F(?=[\s,;.)]|$)/,      1,         "°F",   ["T_temp"]],
  // Electric
  [/kV(?![\/\w])/i,          1000,      "V_e",  ["V1","V2","V_e"]],
  [/mV(?![\/\w])/i,          0.001,     "V_e",  ["V1","V2","V_e"]],
  [/V(?![\/\w])/,            1,         "V_e",  ["V1","V2","V_e"]],
  [/mA(?![\/\w])/i,          0.001,     "A_e",  ["I","I1","I2"]],
  [/A(?![\/\w])/,            1,         "A_e",  ["I","I1","I2"]],
  [/kΩ(?![\/\w])/i,          1000,      "Ω",    ["R_elec"]],
  [/MΩ(?![\/\w])/i,          1e6,       "Ω",    ["R_elec"]],
  [/Ω(?![\/\w])/,            1,         "Ω",    ["R_elec"]],
  [/μF(?![\/\w])/i,          1e-6,      "F_cap",["C_cap"]],
  [/mF(?![\/\w])/i,          0.001,     "F_cap",["C_cap"]],
  [/nF(?![\/\w])/i,          1e-9,      "F_cap",["C_cap"]],
  // Charge
  [/μC(?![\/\w])/i,          1e-6,      "C_q",  ["q1","q2","q"]],
  [/mC(?![\/\w])/i,          0.001,     "C_q",  ["q1","q2","q"]],
  [/nC(?![\/\w])/i,          1e-9,      "C_q",  ["q1","q2","q"]],
  [/C(?![\/\w])/,            1,         "C_q",  ["q1","q2","q"]],
  // Frequency
  [/kHz(?![\/\w])/i,         1000,      "Hz",   ["f_freq"]],
  [/MHz(?![\/\w])/i,         1e6,       "Hz",   ["f_freq"]],
  [/GHz(?![\/\w])/i,         1e9,       "Hz",   ["f_freq"]],
  [/Hz(?![\/\w])/i,          1,         "Hz",   ["f_freq"]],
  [/rpm(?![\/\w])/i,         2*Math.PI/60,"rad/s",["ω"]],
  [/rad\/s(?![²2])/i,        1,         "rad/s",["ω"]],
  [/rad\/s[²2]/i,            1,         "rad/s²",["α"]],
  // Moles / chemistry
  [/mol(?![\/\w])/i,         1,         "mol",  ["n_mol"]],
  [/g\/mol(?![\/\w])/i,      1,         "g/mol",["M_mol"]],
  // Volume
  [/mL(?![\/\w])/i,          0.001,     "L",    ["V_gas"]],
  [/L(?![\/\w])/i,           1,         "L",    ["V_gas"]],
  [/m³(?![\/\w])/i,          1000,      "L",    ["V_gas"]],
  [/cm³(?![\/\w])/i,         0.001,     "L",    ["V_gas"]],
  // Angle
  [/rad(?![\/\w])/i,         1,         "rad",  ["θ","φ","angle"]],
  [/°/,                      Math.PI/180,"rad", ["θ","φ","angle"]],
  // Amplitude / displacement (context)
  [/m(?=\s*(?:de\s+)?(?:amplitud|amplitude))/i, 1, "m", ["A_amp"]],
];

function celsiusToKelvin(c: number) { return c + 273.15; }
function fahrenheitToKelvin(f: number) { return (f-32)*5/9 + 273.15; }

function toSI(value: number, rawUnit: string, mult: number, siUnit: string): number {
  if (siUnit === "°C") return celsiusToKelvin(value);
  if (siUnit === "°F") return fahrenheitToKelvin(value);
  return value * mult;
}

// EXTRACT_RE created fresh per call (avoids global regex state bug)

export function parseValues(rawText: string): ParsedValue[] {
  const text = preprocessText(rawText);
  const results: ParsedValue[] = [];
  // Fresh regex instance each call — avoids stale lastIndex across React re-renders
  const RE = /(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)\s*([a-zA-Z\u03bc\u00b0\u00b2\u00b3/\u03a9\u00b7]+(?:[\u00b2\u00b323]|\/[a-zA-Z\u00b2\u00b323\u00b7]+)*)/g;
  let m: RegExpExecArray | null;
  while ((m = RE.exec(text)) !== null) {
    const value = parseFloat(m[1]);
    if (isNaN(value)) continue;
    const unitStr = m[2].trim();
    for (const [pattern, mult, siUnit, candidates] of UNIT_MAP) {
      if (pattern.test(unitStr)) {
        results.push({
          raw: m[0].trim(), value, unit: unitStr,
          siValue: toSI(value, unitStr, mult, siUnit),
          siUnit, candidates,
        });
        break;
      }
    }
  }
  return results;
}

// ── Dimensionless keyword extraction ─────────────────────────
// Returns map of symbol → value for dimensionless quantities

const DIMENSIONLESS_PATTERNS: [RegExp, string][] = [
  [/coef(?:iciente)?\s+de\s+fricci[oó]n\s+(?:est[aá]tica|cin[eé]tica|total)?\s+(?:de|es|=|:)?\s*(-?\d+\.?\d*)/i, "μ"],
  [/(?:static|kinetic|sliding)?\s*(?:coefficient\s+of\s+)?friction\s+(?:coefficient\s+)?(?:is|of|=|:)?\s*(-?\d+\.?\d*)/i, "μ"],
  [/μ\s*[=:]\s*(-?\d+\.?\d*)/i, "μ"],
  [/[íi]ndice\s+de\s+refracci[oó]n\s+(?:de|del|es|=)?\s*(-?\d+\.?\d*)/i, "n_refr"],
  [/(?:index|índice)\s+of\s+refraction\s+(?:of|is|=)?\s*(-?\d+\.?\d*)/i, "n_refr"],
  [/n\s*[=:]\s*(\d+\.?\d*)/i, "n_refr"],
  [/amplitud\s+(?:de|es)?\s*(-?\d+\.?\d*)\s*m/i, "A_amp"],
  [/amplitude\s+(?:of|is)?\s*(-?\d+\.?\d*)\s*m/i, "A_amp"],
  [/[aá]ngulo\s+de\s+incidencia\s+(?:de|es)?\s*(\d+\.?\d*)/i, "θ_inc"],
  [/angle\s+of\s+incidence\s+(?:of|is)?\s*(\d+\.?\d*)/i, "θ_inc"],
];

export function parseDimensionless(text: string): Map<string, number> {
  const result = new Map<string, number>();
  const processed = preprocessText(text);
  for (const [pattern, symbol] of DIMENSIONLESS_PATTERNS) {
    const m = pattern.exec(processed);
    if (m) result.set(symbol, parseFloat(m[1]));
  }
  return result;
}

export function extractPureNumbers(text: string): number[] {
  const re = /(?<![a-zA-Z\d])(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)(?![a-zA-Z\d])/g;
  const nums: number[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(preprocessText(text))) !== null) {
    nums.push(parseFloat(m[1]));
  }
  return nums;
}
