export interface Variable {
  symbol: string;
  name: { en: string; es: string };
  unit: string;
}

export interface Formula {
  id: string;
  subject: string;
  topic: { en: string; es: string };
  description: { en: string; es: string };
  formula: string;       // e.g. "F = m · a"
  solveFor: string;      // what this formula finds
  variables: Variable[]; // all variables involved
  knowVariables: string[]; // symbols you need to KNOW to use this formula
  findVariable: string;    // symbol you FIND
}

export const formulas: Formula[] = [
  // ── PHYSICS ──────────────────────────────────────────────────
  {
    id: "ph-01", subject: "physics",
    topic: { en: "Newton's Second Law", es: "Segunda Ley de Newton" },
    description: { en: "Find force given mass and acceleration", es: "Encuentra la fuerza dada la masa y la aceleración" },
    formula: "F = m · a",
    solveFor: "F",
    findVariable: "F",
    knowVariables: ["m", "a"],
    variables: [
      { symbol: "F", name: { en: "Force", es: "Fuerza" }, unit: "N" },
      { symbol: "m", name: { en: "Mass", es: "Masa" }, unit: "kg" },
      { symbol: "a", name: { en: "Acceleration", es: "Aceleración" }, unit: "m/s²" },
    ],
  },
  {
    id: "ph-02", subject: "physics",
    topic: { en: "Newton's Second Law", es: "Segunda Ley de Newton" },
    description: { en: "Find mass given force and acceleration", es: "Encuentra la masa dada la fuerza y aceleración" },
    formula: "m = F / a",
    solveFor: "m",
    findVariable: "m",
    knowVariables: ["F", "a"],
    variables: [
      { symbol: "F", name: { en: "Force", es: "Fuerza" }, unit: "N" },
      { symbol: "m", name: { en: "Mass", es: "Masa" }, unit: "kg" },
      { symbol: "a", name: { en: "Acceleration", es: "Aceleración" }, unit: "m/s²" },
    ],
  },
  {
    id: "ph-03", subject: "physics",
    topic: { en: "Kinematics", es: "Cinemática" },
    description: { en: "Find velocity given distance and time", es: "Encuentra la velocidad dada la distancia y el tiempo" },
    formula: "v = d / t",
    solveFor: "v",
    findVariable: "v",
    knowVariables: ["d", "t"],
    variables: [
      { symbol: "v", name: { en: "Velocity", es: "Velocidad" }, unit: "m/s" },
      { symbol: "d", name: { en: "Distance", es: "Distancia" }, unit: "m" },
      { symbol: "t", name: { en: "Time", es: "Tiempo" }, unit: "s" },
    ],
  },
  {
    id: "ph-04", subject: "physics",
    topic: { en: "Kinematics", es: "Cinemática" },
    description: { en: "Find distance from initial velocity, time, and acceleration", es: "Encuentra distancia con velocidad inicial, tiempo y aceleración" },
    formula: "d = v₀t + ½at²",
    solveFor: "d",
    findVariable: "d",
    knowVariables: ["v₀", "t", "a"],
    variables: [
      { symbol: "d", name: { en: "Distance", es: "Distancia" }, unit: "m" },
      { symbol: "v₀", name: { en: "Initial velocity", es: "Velocidad inicial" }, unit: "m/s" },
      { symbol: "t", name: { en: "Time", es: "Tiempo" }, unit: "s" },
      { symbol: "a", name: { en: "Acceleration", es: "Aceleración" }, unit: "m/s²" },
    ],
  },
  {
    id: "ph-05", subject: "physics",
    topic: { en: "Kinetic Energy", es: "Energía Cinética" },
    description: { en: "Find kinetic energy given mass and velocity", es: "Encuentra energía cinética dada masa y velocidad" },
    formula: "KE = ½mv²",
    solveFor: "KE",
    findVariable: "KE",
    knowVariables: ["m", "v"],
    variables: [
      { symbol: "KE", name: { en: "Kinetic Energy", es: "Energía Cinética" }, unit: "J" },
      { symbol: "m", name: { en: "Mass", es: "Masa" }, unit: "kg" },
      { symbol: "v", name: { en: "Velocity", es: "Velocidad" }, unit: "m/s" },
    ],
  },
  {
    id: "ph-06", subject: "physics",
    topic: { en: "Gravitational PE", es: "Energía Potencial Gravitatoria" },
    description: { en: "Find potential energy given mass, gravity, height", es: "Encuentra la energía potencial dada masa, gravedad y altura" },
    formula: "PE = mgh",
    solveFor: "PE",
    findVariable: "PE",
    knowVariables: ["m", "g", "h"],
    variables: [
      { symbol: "PE", name: { en: "Potential Energy", es: "Energía Potencial" }, unit: "J" },
      { symbol: "m", name: { en: "Mass", es: "Masa" }, unit: "kg" },
      { symbol: "g", name: { en: "Gravity", es: "Gravedad" }, unit: "m/s²" },
      { symbol: "h", name: { en: "Height", es: "Altura" }, unit: "m" },
    ],
  },
  {
    id: "ph-07", subject: "physics",
    topic: { en: "Work", es: "Trabajo" },
    description: { en: "Find work given force, distance, and angle", es: "Encuentra trabajo dado fuerza, distancia y ángulo" },
    formula: "W = F · d · cos(θ)",
    solveFor: "W",
    findVariable: "W",
    knowVariables: ["F", "d", "θ"],
    variables: [
      { symbol: "W", name: { en: "Work", es: "Trabajo" }, unit: "J" },
      { symbol: "F", name: { en: "Force", es: "Fuerza" }, unit: "N" },
      { symbol: "d", name: { en: "Distance", es: "Distancia" }, unit: "m" },
      { symbol: "θ", name: { en: "Angle", es: "Ángulo" }, unit: "°" },
    ],
  },
  {
    id: "ph-08", subject: "physics",
    topic: { en: "Ohm's Law", es: "Ley de Ohm" },
    description: { en: "Find voltage given current and resistance", es: "Encuentra el voltaje dado corriente y resistencia" },
    formula: "V = I · R",
    solveFor: "V",
    findVariable: "V",
    knowVariables: ["I", "R"],
    variables: [
      { symbol: "V", name: { en: "Voltage", es: "Voltaje" }, unit: "V" },
      { symbol: "I", name: { en: "Current", es: "Corriente" }, unit: "A" },
      { symbol: "R", name: { en: "Resistance", es: "Resistencia" }, unit: "Ω" },
    ],
  },
  {
    id: "ph-09", subject: "physics",
    topic: { en: "Wave Speed", es: "Velocidad de Onda" },
    description: { en: "Find wave speed given frequency and wavelength", es: "Encuentra velocidad de onda dada frecuencia y longitud de onda" },
    formula: "v = f · λ",
    solveFor: "v",
    findVariable: "v",
    knowVariables: ["f", "λ"],
    variables: [
      { symbol: "v", name: { en: "Wave speed", es: "Velocidad de onda" }, unit: "m/s" },
      { symbol: "f", name: { en: "Frequency", es: "Frecuencia" }, unit: "Hz" },
      { symbol: "λ", name: { en: "Wavelength", es: "Longitud de onda" }, unit: "m" },
    ],
  },
  {
    id: "ph-10", subject: "physics",
    topic: { en: "Momentum", es: "Momento" },
    description: { en: "Find momentum given mass and velocity", es: "Encuentra el momento dado masa y velocidad" },
    formula: "p = m · v",
    solveFor: "p",
    findVariable: "p",
    knowVariables: ["m", "v"],
    variables: [
      { symbol: "p", name: { en: "Momentum", es: "Momento" }, unit: "kg·m/s" },
      { symbol: "m", name: { en: "Mass", es: "Masa" }, unit: "kg" },
      { symbol: "v", name: { en: "Velocity", es: "Velocidad" }, unit: "m/s" },
    ],
  },
  // ── CHEMISTRY ────────────────────────────────────────────────
  {
    id: "ch-01", subject: "chemistry",
    topic: { en: "Ideal Gas Law", es: "Ley del Gas Ideal" },
    description: { en: "Find pressure given moles, volume, temperature", es: "Encuentra la presión dado moles, volumen y temperatura" },
    formula: "PV = nRT",
    solveFor: "P",
    findVariable: "P",
    knowVariables: ["n", "V", "T"],
    variables: [
      { symbol: "P", name: { en: "Pressure", es: "Presión" }, unit: "atm" },
      { symbol: "V", name: { en: "Volume", es: "Volumen" }, unit: "L" },
      { symbol: "n", name: { en: "Moles", es: "Moles" }, unit: "mol" },
      { symbol: "R", name: { en: "Gas constant", es: "Constante del gas" }, unit: "0.0821" },
      { symbol: "T", name: { en: "Temperature", es: "Temperatura" }, unit: "K" },
    ],
  },
  {
    id: "ch-02", subject: "chemistry",
    topic: { en: "Molarity", es: "Molaridad" },
    description: { en: "Find molarity given moles and volume", es: "Encuentra la molaridad dado moles y volumen" },
    formula: "M = n / V",
    solveFor: "M",
    findVariable: "M",
    knowVariables: ["n", "V"],
    variables: [
      { symbol: "M", name: { en: "Molarity", es: "Molaridad" }, unit: "mol/L" },
      { symbol: "n", name: { en: "Moles", es: "Moles" }, unit: "mol" },
      { symbol: "V", name: { en: "Volume", es: "Volumen" }, unit: "L" },
    ],
  },
  {
    id: "ch-03", subject: "chemistry",
    topic: { en: "pH", es: "pH" },
    description: { en: "Find pH given H⁺ concentration", es: "Encuentra el pH dada la concentración de H⁺" },
    formula: "pH = -log[H⁺]",
    solveFor: "pH",
    findVariable: "pH",
    knowVariables: ["[H⁺]"],
    variables: [
      { symbol: "pH", name: { en: "pH", es: "pH" }, unit: "" },
      { symbol: "[H⁺]", name: { en: "H⁺ concentration", es: "Concentración de H⁺" }, unit: "mol/L" },
    ],
  },
  {
    id: "ch-04", subject: "chemistry",
    topic: { en: "Moles from mass", es: "Moles a partir de masa" },
    description: { en: "Find moles given mass and molar mass", es: "Encuentra moles dado masa y masa molar" },
    formula: "n = m / M",
    solveFor: "n",
    findVariable: "n",
    knowVariables: ["m", "M"],
    variables: [
      { symbol: "n", name: { en: "Moles", es: "Moles" }, unit: "mol" },
      { symbol: "m", name: { en: "Mass", es: "Masa" }, unit: "g" },
      { symbol: "M", name: { en: "Molar mass", es: "Masa molar" }, unit: "g/mol" },
    ],
  },
  // ── MATHEMATICS ──────────────────────────────────────────────
  {
    id: "ma-01", subject: "mathematics",
    topic: { en: "Circle Area", es: "Área del Círculo" },
    description: { en: "Find area given radius", es: "Encuentra el área dado el radio" },
    formula: "A = π · r²",
    solveFor: "A",
    findVariable: "A",
    knowVariables: ["r"],
    variables: [
      { symbol: "A", name: { en: "Area", es: "Área" }, unit: "u²" },
      { symbol: "r", name: { en: "Radius", es: "Radio" }, unit: "u" },
    ],
  },
  {
    id: "ma-02", subject: "mathematics",
    topic: { en: "Pythagorean Theorem", es: "Teorema de Pitágoras" },
    description: { en: "Find hypotenuse given two legs", es: "Encuentra la hipotenusa dado dos catetos" },
    formula: "c = √(a² + b²)",
    solveFor: "c",
    findVariable: "c",
    knowVariables: ["a", "b"],
    variables: [
      { symbol: "c", name: { en: "Hypotenuse", es: "Hipotenusa" }, unit: "u" },
      { symbol: "a", name: { en: "Leg a", es: "Cateto a" }, unit: "u" },
      { symbol: "b", name: { en: "Leg b", es: "Cateto b" }, unit: "u" },
    ],
  },
  {
    id: "ma-03", subject: "mathematics",
    topic: { en: "Quadratic Formula", es: "Fórmula Cuadrática" },
    description: { en: "Find roots of ax²+bx+c=0", es: "Encuentra las raíces de ax²+bx+c=0" },
    formula: "x = (-b ± √(b²-4ac)) / 2a",
    solveFor: "x",
    findVariable: "x",
    knowVariables: ["a", "b", "c"],
    variables: [
      { symbol: "x", name: { en: "Root", es: "Raíz" }, unit: "" },
      { symbol: "a", name: { en: "Coefficient a", es: "Coeficiente a" }, unit: "" },
      { symbol: "b", name: { en: "Coefficient b", es: "Coeficiente b" }, unit: "" },
      { symbol: "c", name: { en: "Coefficient c", es: "Coeficiente c" }, unit: "" },
    ],
  },
  // ── CALCULUS ─────────────────────────────────────────────────
  {
    id: "ca-01", subject: "calculus",
    topic: { en: "Power Rule", es: "Regla de la Potencia" },
    description: { en: "Derivative of xⁿ", es: "Derivada de xⁿ" },
    formula: "d/dx(xⁿ) = n·xⁿ⁻¹",
    solveFor: "f'(x)",
    findVariable: "f'(x)",
    knowVariables: ["n"],
    variables: [
      { symbol: "n", name: { en: "Exponent", es: "Exponente" }, unit: "" },
      { symbol: "f'(x)", name: { en: "Derivative", es: "Derivada" }, unit: "" },
    ],
  },
  {
    id: "ca-02", subject: "calculus",
    topic: { en: "Basic Integral", es: "Integral Básica" },
    description: { en: "Integral of xⁿ", es: "Integral de xⁿ" },
    formula: "∫xⁿ dx = xⁿ⁺¹/(n+1) + C",
    solveFor: "∫f(x)dx",
    findVariable: "∫f(x)dx",
    knowVariables: ["n"],
    variables: [
      { symbol: "n", name: { en: "Exponent", es: "Exponente" }, unit: "" },
    ],
  },
];

/**
 * Given known variable symbols, find which formulas can be applied
 */
export function findApplicableFormulas(knownSymbols: string[], subject: string): Formula[] {
  return formulas.filter((f) => {
    if (f.subject !== subject) return false;
    return f.knowVariables.every((v) => knownSymbols.includes(v));
  });
}

/**
 * Get all unique variable symbols for a subject (for the selector)
 */
export function getSubjectVariables(subject: string): Variable[] {
  const seen = new Set<string>();
  const result: Variable[] = [];
  formulas
    .filter((f) => f.subject === subject)
    .forEach((f) => {
      f.variables.forEach((v) => {
        if (!seen.has(v.symbol)) {
          seen.add(v.symbol);
          result.push(v);
        }
      });
    });
  return result;
}
