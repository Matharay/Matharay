export interface Course {
  id: string;
  title: { en: string; es: string };
  subject: string;
  topics: string[];
}

export const courses: Course[] = [
  // ══════════════════════════════════════════════════════════
  // MATHEMATICS
  // ══════════════════════════════════════════════════════════
  { id:"ma-01", subject:"mathematics", topics:["suma","resta","multiplicar","dividir","add","subtract","multiply","divide","arithmetic"], title:{en:"Basic Arithmetic",es:"Aritmética Básica"} },
  { id:"ma-02", subject:"mathematics", topics:["fraction","numerator","denominator","fraccion","fracciones","mixed number"], title:{en:"Fractions & Mixed Numbers",es:"Fracciones y Números Mixtos"} },
  { id:"ma-03", subject:"mathematics", topics:["decimal","rounding","redondeo","truncar"], title:{en:"Decimals & Rounding",es:"Decimales y Redondeo"} },
  { id:"ma-04", subject:"mathematics", topics:["percentage","percent","porcentaje","descuento","interest"], title:{en:"Percentages & Discounts",es:"Porcentajes y Descuentos"} },
  { id:"ma-05", subject:"mathematics", topics:["ratio","proportion","razon","proporcion","regla de tres"], title:{en:"Ratios & Proportions",es:"Razones y Proporciones"} },
  { id:"ma-06", subject:"mathematics", topics:["integer","whole number","entero","numero entero","negative"], title:{en:"Integers & Number Line",es:"Números Enteros y Recta Numérica"} },
  { id:"ma-07", subject:"mathematics", topics:["prime","factor","factoring","factorizacion","primes","mcd","mcm"], title:{en:"Prime Numbers & Factoring",es:"Números Primos y Factorización"} },
  { id:"ma-08", subject:"mathematics", topics:["linear","equation","lineal","ecuacion","despejar","solve x"], title:{en:"Linear Equations (1 variable)",es:"Ecuaciones Lineales (1 variable)"} },
  { id:"ma-09", subject:"mathematics", topics:["system","elimination","substitution","sistema","eliminacion","sustitucion"], title:{en:"Systems of Equations",es:"Sistemas de Ecuaciones"} },
  { id:"ma-10", subject:"mathematics", topics:["quadratic","cuadratica","ax2","parabola","discriminante"], title:{en:"Quadratic Equations",es:"Ecuaciones Cuadráticas"} },
  { id:"ma-11", subject:"mathematics", topics:["inequality","desigualdad","mayor que","menor que","intervalo"], title:{en:"Inequalities & Intervals",es:"Inecuaciones e Intervalos"} },
  { id:"ma-12", subject:"mathematics", topics:["absolute value","valor absoluto","modulo"], title:{en:"Absolute Value",es:"Valor Absoluto"} },
  { id:"ma-13", subject:"mathematics", topics:["polynomial","polinomio","degree","grado"], title:{en:"Polynomials",es:"Polinomios"} },
  { id:"ma-14", subject:"mathematics", topics:["factoring polynomial","factorizacion polinomios","factor theorem","teorema factor"], title:{en:"Factoring Polynomials",es:"Factorización de Polinomios"} },
  { id:"ma-15", subject:"mathematics", topics:["rational expression","expresion racional","algebraic fraction","fraccion algebraica"], title:{en:"Rational Expressions",es:"Expresiones Racionales"} },
  { id:"ma-16", subject:"mathematics", topics:["exponent","power","potencia","exponente","laws of exponents"], title:{en:"Laws of Exponents",es:"Leyes de los Exponentes"} },
  { id:"ma-17", subject:"mathematics", topics:["radical","root","raiz","sqrt","nth root","raiz n-esima"], title:{en:"Radicals & Roots",es:"Radicales y Raíces"} },
  { id:"ma-18", subject:"mathematics", topics:["logarithm","log","ln","natural log","logaritmo"], title:{en:"Logarithms",es:"Logaritmos"} },
  { id:"ma-19", subject:"mathematics", topics:["function","domain","range","funcion","dominio","rango","mapping"], title:{en:"Functions & Domains",es:"Funciones y Dominios"} },
  { id:"ma-20", subject:"mathematics", topics:["composite function","inverse function","funcion compuesta","funcion inversa"], title:{en:"Composite & Inverse Functions",es:"Funciones Compuestas e Inversas"} },
  { id:"ma-21", subject:"mathematics", topics:["trigonometry","sin","cos","tan","seno","coseno","tangente"], title:{en:"Trigonometry Basics",es:"Trigonometría Básica"} },
  { id:"ma-22", subject:"mathematics", topics:["trigonometric identity","identidad trigonometrica","pythagorean identity"], title:{en:"Trig Identities",es:"Identidades Trigonométricas"} },
  { id:"ma-23", subject:"mathematics", topics:["geometry","area","perimeter","triangle","circle","area","perimetro"], title:{en:"Plane Geometry",es:"Geometría Plana"} },
  { id:"ma-24", subject:"mathematics", topics:["solid geometry","volume","surface area","volumen","area superficie","sphere","cone","cylinder"], title:{en:"Solid Geometry",es:"Geometría Sólida"} },
  { id:"ma-25", subject:"mathematics", topics:["analytic geometry","coordinate","coordenada","distance formula","midpoint"], title:{en:"Analytic Geometry",es:"Geometría Analítica"} },
  { id:"ma-26", subject:"mathematics", topics:["circle equation","ecuacion circulo","conic","conica","ellipse","elipse","hyperbola"], title:{en:"Conic Sections",es:"Secciones Cónicas"} },
  { id:"ma-27", subject:"mathematics", topics:["matrix","matrices","determinant","matriz","determinante"], title:{en:"Matrices & Determinants",es:"Matrices y Determinantes"} },
  { id:"ma-28", subject:"mathematics", topics:["vector","dot product","cross product","producto punto"], title:{en:"Vectors",es:"Vectores"} },
  { id:"ma-29", subject:"mathematics", topics:["probability","permutation","combination","probabilidad","permutacion"], title:{en:"Probability & Combinatorics",es:"Probabilidad y Combinatoria"} },
  { id:"ma-30", subject:"mathematics", topics:["statistics","mean","median","mode","standard deviation","estadistica","media"], title:{en:"Descriptive Statistics",es:"Estadística Descriptiva"} },
  { id:"ma-31", subject:"mathematics", topics:["sequence","series","arithmetic sequence","geometric","sucesion","serie"], title:{en:"Sequences & Series",es:"Sucesiones y Series"} },
  { id:"ma-32", subject:"mathematics", topics:["binomial theorem","binomio newton","pascal triangle"], title:{en:"Binomial Theorem",es:"Teorema del Binomio"} },
  { id:"ma-33", subject:"mathematics", topics:["complex number","numero complejo","imaginary","imaginario"], title:{en:"Complex Numbers",es:"Números Complejos"} },
  { id:"ma-34", subject:"mathematics", topics:["graph","slope","intercept","pendiente","intercepto","recta"], title:{en:"Linear Graphs & Slope",es:"Gráficas Lineales y Pendiente"} },
  { id:"ma-35", subject:"mathematics", topics:["word problem","problema aplicado","mixtures","mezclas","motion"], title:{en:"Applied Word Problems",es:"Problemas Aplicados"} },

  // ══════════════════════════════════════════════════════════
  // CALCULUS
  // ══════════════════════════════════════════════════════════
  { id:"ca-01", subject:"calculus", topics:["limit","lim","limite","one-sided","continuity","continuidad"], title:{en:"Limits & Continuity",es:"Límites y Continuidad"} },
  { id:"ca-02", subject:"calculus", topics:["derivative","derivada","d/dx","differentiate","diferencial"], title:{en:"Definition of Derivative",es:"Definición de Derivada"} },
  { id:"ca-03", subject:"calculus", topics:["power rule","regla potencia","constant rule"], title:{en:"Basic Differentiation Rules",es:"Reglas Básicas de Diferenciación"} },
  { id:"ca-04", subject:"calculus", topics:["product rule","quotient rule","regla producto","regla cociente"], title:{en:"Product & Quotient Rules",es:"Reglas del Producto y Cociente"} },
  { id:"ca-05", subject:"calculus", topics:["chain rule","regla cadena","composite derivative"], title:{en:"Chain Rule",es:"Regla de la Cadena"} },
  { id:"ca-06", subject:"calculus", topics:["implicit differentiation","derivacion implicita"], title:{en:"Implicit Differentiation",es:"Diferenciación Implícita"} },
  { id:"ca-07", subject:"calculus", topics:["higher order derivative","segunda derivada","second derivative"], title:{en:"Higher-Order Derivatives",es:"Derivadas de Orden Superior"} },
  { id:"ca-08", subject:"calculus", topics:["related rates","tasas relacionadas","rates of change"], title:{en:"Related Rates",es:"Tasas Relacionadas"} },
  { id:"ca-09", subject:"calculus", topics:["optimization","maximum","minimum","maximizar","minimizar"], title:{en:"Optimization",es:"Optimización"} },
  { id:"ca-10", subject:"calculus", topics:["mean value theorem","rolle","valor medio"], title:{en:"Mean Value Theorem",es:"Teorema del Valor Medio"} },
  { id:"ca-11", subject:"calculus", topics:["integral","integrate","antiderivative","integrar","primitiva"], title:{en:"Indefinite Integrals",es:"Integrales Indefinidas"} },
  { id:"ca-12", subject:"calculus", topics:["definite integral","riemann","area under","integral definida"], title:{en:"Definite Integrals",es:"Integrales Definidas"} },
  { id:"ca-13", subject:"calculus", topics:["fundamental theorem","teorema fundamental","FTC"], title:{en:"Fundamental Theorem of Calculus",es:"Teorema Fundamental del Cálculo"} },
  { id:"ca-14", subject:"calculus", topics:["substitution","u-sub","cambio variable","sustitucion"], title:{en:"Integration by Substitution",es:"Integración por Sustitución"} },
  { id:"ca-15", subject:"calculus", topics:["integration by parts","integracion por partes","LIATE"], title:{en:"Integration by Parts",es:"Integración por Partes"} },
  { id:"ca-16", subject:"calculus", topics:["partial fractions","fracciones parciales"], title:{en:"Partial Fractions",es:"Fracciones Parciales"} },
  { id:"ca-17", subject:"calculus", topics:["improper integral","integral impropia"], title:{en:"Improper Integrals",es:"Integrales Impropias"} },
  { id:"ca-18", subject:"calculus", topics:["application integral","area between","volume revolution","area entre curvas"], title:{en:"Applications of Integration",es:"Aplicaciones de la Integral"} },
  { id:"ca-19", subject:"calculus", topics:["series","convergence","divergence","taylor","maclaurin","serie"], title:{en:"Infinite Series & Convergence",es:"Series Infinitas y Convergencia"} },
  { id:"ca-20", subject:"calculus", topics:["differential equation","ode","ecuacion diferencial","separable"], title:{en:"Differential Equations Intro",es:"Introducción a Ecuaciones Diferenciales"} },
  { id:"ca-21", subject:"calculus", topics:["multivariable","partial derivative","derivada parcial","gradient"], title:{en:"Multivariable Calculus",es:"Cálculo Multivariable"} },
  { id:"ca-22", subject:"calculus", topics:["parametric","polar","parametrica","polar coordinates"], title:{en:"Parametric & Polar Curves",es:"Curvas Paramétricas y Polares"} },

  // ══════════════════════════════════════════════════════════
  // PHYSICS
  // ══════════════════════════════════════════════════════════
  { id:"ph-01", subject:"physics", topics:["kinematics","velocity","speed","distance","MRU","MRUA","velocidad","distancia"], title:{en:"Uniform Motion (MRU)",es:"Movimiento Rectilíneo Uniforme"} },
  { id:"ph-02", subject:"physics", topics:["acceleration","MRUA","uniformly accelerated","aceleracion"], title:{en:"Uniformly Accelerated Motion",es:"Movimiento Uniformemente Acelerado"} },
  { id:"ph-03", subject:"physics", topics:["free fall","caida libre","gravity drop","dropped"], title:{en:"Free Fall",es:"Caída Libre"} },
  { id:"ph-04", subject:"physics", topics:["projectile","oblique","parabolic","lanzamiento","alcance","trayectoria"], title:{en:"Projectile Motion",es:"Movimiento Parabólico"} },
  { id:"ph-05", subject:"physics", topics:["newton","force","mass","fuerza","newton primera","segunda","tercera"], title:{en:"Newton's Three Laws",es:"Las Tres Leyes de Newton"} },
  { id:"ph-06", subject:"physics", topics:["friction","static","kinetic","normal force","friccion","rozamiento"], title:{en:"Friction Forces",es:"Fuerzas de Fricción"} },
  { id:"ph-07", subject:"physics", topics:["incline","ramp","plano inclinado","slope angle"], title:{en:"Inclined Planes",es:"Planos Inclinados"} },
  { id:"ph-08", subject:"physics", topics:["pulley","atwood","tension","polea","tension cuerda"], title:{en:"Pulleys & Tension",es:"Poleas y Tensión"} },
  { id:"ph-09", subject:"physics", topics:["circular motion","centripetal","centrifugal","circular","centripeta"], title:{en:"Circular Motion",es:"Movimiento Circular"} },
  { id:"ph-10", subject:"physics", topics:["gravitation","gravity","universal","gravitacional","G","masa tierra"], title:{en:"Universal Gravitation",es:"Gravitación Universal"} },
  { id:"ph-11", subject:"physics", topics:["work","energy","kinetic","potential","trabajo","energia","joule"], title:{en:"Work & Energy",es:"Trabajo y Energía"} },
  { id:"ph-12", subject:"physics", topics:["conservation energy","conservacion energia","mechanical energy"], title:{en:"Conservation of Energy",es:"Conservación de Energía"} },
  { id:"ph-13", subject:"physics", topics:["power","watt","potencia","rendimiento","efficiency"], title:{en:"Power & Efficiency",es:"Potencia y Rendimiento"} },
  { id:"ph-14", subject:"physics", topics:["momentum","impulse","collision","momento","impulso","choque"], title:{en:"Momentum & Collisions",es:"Momento e Impulso"} },
  { id:"ph-15", subject:"physics", topics:["elastic collision","inelastic","choque elastico","coeficiente restitucion"], title:{en:"Elastic & Inelastic Collisions",es:"Choques Elásticos e Inelásticos"} },
  { id:"ph-16", subject:"physics", topics:["rotation","torque","angular","moment inertia","rotacion","par de fuerzas"], title:{en:"Rotational Dynamics",es:"Dinámica Rotacional"} },
  { id:"ph-17", subject:"physics", topics:["rolling","rueda","cylinder rolling","rodadura"], title:{en:"Rolling Motion",es:"Movimiento de Rodadura"} },
  { id:"ph-18", subject:"physics", topics:["oscillation","spring","shm","resorte","oscilacion","period spring"], title:{en:"Simple Harmonic Motion",es:"Movimiento Armónico Simple"} },
  { id:"ph-19", subject:"physics", topics:["pendulum","simple pendulum","pendulo","oscilacion pendulo"], title:{en:"Simple Pendulum",es:"Péndulo Simple"} },
  { id:"ph-20", subject:"physics", topics:["orbital","satellite","orbit","satelite","orbital velocity"], title:{en:"Orbital Mechanics",es:"Mecánica Orbital"} },
  { id:"ph-21", subject:"physics", topics:["thermodynamics","temperature","heat","calor","temperatura","primera ley"], title:{en:"Heat & Temperature",es:"Calor y Temperatura"} },
  { id:"ph-22", subject:"physics", topics:["ideal gas","gas law","pv nrt","ley gas","presion gas"], title:{en:"Ideal Gas Law",es:"Ley del Gas Ideal"} },
  { id:"ph-23", subject:"physics", topics:["thermodynamic process","isothermal","isobaric","adiabatic","isotermica"], title:{en:"Thermodynamic Processes",es:"Procesos Termodinámicos"} },
  { id:"ph-24", subject:"physics", topics:["entropy","second law","carnot","entropia"], title:{en:"Second Law of Thermodynamics",es:"Segunda Ley de la Termodinámica"} },
  { id:"ph-25", subject:"physics", topics:["wave","frequency","wavelength","amplitude","onda","frecuencia"], title:{en:"Waves & Oscillations",es:"Ondas y Oscilaciones"} },
  { id:"ph-26", subject:"physics", topics:["sound","acoustic","decibel","sonido","velocidad sonido","intensidad"], title:{en:"Sound & Acoustics",es:"Sonido y Acústica"} },
  { id:"ph-27", subject:"physics", topics:["optic","light","refraction","snell","optica","refraccion","lens"], title:{en:"Optics & Refraction",es:"Óptica y Refracción"} },
  { id:"ph-28", subject:"physics", topics:["mirror","lens","reflection","espejo","lente","imagen"], title:{en:"Mirrors & Lenses",es:"Espejos y Lentes"} },
  { id:"ph-29", subject:"physics", topics:["electric charge","coulomb","electrostatic","carga electrica"], title:{en:"Electric Charge & Coulomb",es:"Carga Eléctrica y Coulomb"} },
  { id:"ph-30", subject:"physics", topics:["electric field","campo electrico","electric potential","potencial electrico"], title:{en:"Electric Field & Potential",es:"Campo y Potencial Eléctrico"} },
  { id:"ph-31", subject:"physics", topics:["ohm","current","voltage","resistance","corriente","voltaje","resistencia"], title:{en:"Ohm's Law & Circuits",es:"Ley de Ohm y Circuitos"} },
  { id:"ph-32", subject:"physics", topics:["series circuit","parallel circuit","en serie","en paralelo","resistencia equivalente"], title:{en:"Series & Parallel Circuits",es:"Circuitos en Serie y Paralelo"} },
  { id:"ph-33", subject:"physics", topics:["capacitor","capacitance","capacitor","capacitancia"], title:{en:"Capacitors",es:"Capacitores"} },
  { id:"ph-34", subject:"physics", topics:["magnetic field","magnetism","campo magnetico","magnetismo","biot-savart"], title:{en:"Magnetic Fields",es:"Campos Magnéticos"} },
  { id:"ph-35", subject:"physics", topics:["electromagnetic induction","faraday","lenz","induccion electromagnetica"], title:{en:"Electromagnetic Induction",es:"Inducción Electromagnética"} },
  { id:"ph-36", subject:"physics", topics:["transformer","ac","dc","transformador","corriente alterna"], title:{en:"AC & Transformers",es:"CA y Transformadores"} },
  { id:"ph-37", subject:"physics", topics:["quantum","photon","photoelectric","cuantica","efecto fotoelectrico"], title:{en:"Quantum Physics Intro",es:"Física Cuántica Básica"} },
  { id:"ph-38", subject:"physics", topics:["relativity","einstein","relatividad","time dilation","lorentz"], title:{en:"Special Relativity",es:"Relatividad Especial"} },
  { id:"ph-39", subject:"physics", topics:["nuclear","radioactivity","decay","nucleo","radiactividad","desintegracion"], title:{en:"Nuclear Physics",es:"Física Nuclear"} },

  // ══════════════════════════════════════════════════════════
  // CHEMISTRY
  // ══════════════════════════════════════════════════════════
  { id:"ch-01", subject:"chemistry", topics:["atom","atomic structure","electron","proton","neutron","atomo"], title:{en:"Atomic Structure",es:"Estructura Atómica"} },
  { id:"ch-02", subject:"chemistry", topics:["periodic table","element","period","group","periodica","grupo"], title:{en:"Periodic Table",es:"Tabla Periódica"} },
  { id:"ch-03", subject:"chemistry", topics:["periodic trend","electronegativity","atomic radius","tendencia periodica"], title:{en:"Periodic Trends",es:"Tendencias Periódicas"} },
  { id:"ch-04", subject:"chemistry", topics:["ionic bond","covalent","metallic","enlace ionico","covalente","metalico"], title:{en:"Chemical Bonding",es:"Enlace Químico"} },
  { id:"ch-05", subject:"chemistry", topics:["lewis structure","VSEPR","geometria molecular","lewis"], title:{en:"Lewis Structures & VSEPR",es:"Estructuras de Lewis y VSEPR"} },
  { id:"ch-06", subject:"chemistry", topics:["oxidation number","nomenclature","nomenclatura","oxido","stock"], title:{en:"Nomenclature & Oxidation Numbers",es:"Nomenclatura y Números de Oxidación"} },
  { id:"ch-07", subject:"chemistry", topics:["balance","equation","reaction","balancear","ecuacion quimica"], title:{en:"Balancing Chemical Equations",es:"Balanceo de Ecuaciones"} },
  { id:"ch-08", subject:"chemistry", topics:["reaction type","synthesis","decomposition","combustion","tipo reaccion"], title:{en:"Types of Reactions",es:"Tipos de Reacciones"} },
  { id:"ch-09", subject:"chemistry", topics:["stoichiometry","mole","mol","limiting reagent","reactivo limitante"], title:{en:"Stoichiometry",es:"Estequiometría"} },
  { id:"ch-10", subject:"chemistry", topics:["mole concept","avogadro","number moles","concepto mol"], title:{en:"Mole Concept",es:"Concepto de Mol"} },
  { id:"ch-11", subject:"chemistry", topics:["gas law","ideal gas","pv nrt","boyle","charles","gay-lussac"], title:{en:"Gas Laws",es:"Leyes de los Gases"} },
  { id:"ch-12", subject:"chemistry", topics:["solution","molarity","molality","concentration","solucion","molaridad"], title:{en:"Solutions & Concentration",es:"Soluciones y Concentración"} },
  { id:"ch-13", subject:"chemistry", topics:["colligative","boiling point elevation","freezing point","propiedades coligativas"], title:{en:"Colligative Properties",es:"Propiedades Coligativas"} },
  { id:"ch-14", subject:"chemistry", topics:["acid","base","pH","pOH","neutralization","acido","base"], title:{en:"Acids, Bases & pH",es:"Ácidos, Bases y pH"} },
  { id:"ch-15", subject:"chemistry", topics:["buffer","henderson","hasselbalch","tampon","soluciones buffer"], title:{en:"Buffers & Henderson-Hasselbalch",es:"Soluciones Tampón"} },
  { id:"ch-16", subject:"chemistry", topics:["redox","oxidation","reduction","electrochemistry","electroquimica"], title:{en:"Redox & Electrochemistry",es:"Redox y Electroquímica"} },
  { id:"ch-17", subject:"chemistry", topics:["electrolysis","faraday electrochemistry","electrolisis"], title:{en:"Electrolysis",es:"Electrólisis"} },
  { id:"ch-18", subject:"chemistry", topics:["thermochemistry","enthalpy","hess","entalpia","calor reaccion"], title:{en:"Thermochemistry",es:"Termoquímica"} },
  { id:"ch-19", subject:"chemistry", topics:["entropy","gibbs","spontaneous","entropia","energia libre"], title:{en:"Entropy & Gibbs Energy",es:"Entropía y Energía de Gibbs"} },
  { id:"ch-20", subject:"chemistry", topics:["kinetics","rate","reaction rate","cinetica quimica","velocidad reaccion"], title:{en:"Chemical Kinetics",es:"Cinética Química"} },
  { id:"ch-21", subject:"chemistry", topics:["equilibrium","equilibrio","Kc","Kp","le chatelier"], title:{en:"Chemical Equilibrium",es:"Equilibrio Químico"} },
  { id:"ch-22", subject:"chemistry", topics:["solubility","Ksp","precipitate","solubilidad","precipitado"], title:{en:"Solubility & Ksp",es:"Solubilidad y Ksp"} },
  { id:"ch-23", subject:"chemistry", topics:["organic","carbon","alkane","alkene","organica","carbono","hidrocarburo"], title:{en:"Organic Chemistry Basics",es:"Química Orgánica Básica"} },
  { id:"ch-24", subject:"chemistry", topics:["functional group","alcohol","aldehyde","ketone","carboxylic","grupo funcional"], title:{en:"Functional Groups",es:"Grupos Funcionales"} },
  { id:"ch-25", subject:"chemistry", topics:["isomer","isomeria","stereochemistry","enantiomer","quiralidad"], title:{en:"Isomerism & Stereochemistry",es:"Isomería y Estereoquímica"} },
  { id:"ch-26", subject:"chemistry", topics:["polymer","monomer","polimero","condensation","addition"], title:{en:"Polymers",es:"Polímeros"} },
  { id:"ch-27", subject:"chemistry", topics:["nuclear chemistry","radioactive","half life","vida media","nuclear"], title:{en:"Nuclear Chemistry",es:"Química Nuclear"} },

  // ══════════════════════════════════════════════════════════
  // BIOLOGY
  // ══════════════════════════════════════════════════════════
  { id:"bi-01", subject:"biology", topics:["cell","membrane","nucleus","organelle","celula","membrana","nucleo"], title:{en:"Cell Biology",es:"Biología Celular"} },
  { id:"bi-02", subject:"biology", topics:["cell division","mitosis","meiosis","division celular"], title:{en:"Cell Division",es:"División Celular"} },
  { id:"bi-03", subject:"biology", topics:["genetics","dna","rna","gene","heredity","genetica","herencia"], title:{en:"Genetics & Heredity",es:"Genética y Herencia"} },
  { id:"bi-04", subject:"biology", topics:["mendel","monohybrid","dihybrid","punnett","cuadro mendel"], title:{en:"Mendelian Genetics",es:"Genética Mendeliana"} },
  { id:"bi-05", subject:"biology", topics:["protein synthesis","transcription","translation","sintesis proteinas"], title:{en:"Protein Synthesis",es:"Síntesis de Proteínas"} },
  { id:"bi-06", subject:"biology", topics:["photosynthesis","chloroplast","fotosintesis","clorofila"], title:{en:"Photosynthesis",es:"Fotosíntesis"} },
  { id:"bi-07", subject:"biology", topics:["cellular respiration","ATP","glycolysis","respiracion celular"], title:{en:"Cellular Respiration",es:"Respiración Celular"} },
  { id:"bi-08", subject:"biology", topics:["evolution","natural selection","darwin","evolucion","seleccion natural"], title:{en:"Evolution",es:"Evolución"} },
  { id:"bi-09", subject:"biology", topics:["ecology","ecosystem","food chain","ecosistema","cadena trófica"], title:{en:"Ecology & Ecosystems",es:"Ecología y Ecosistemas"} },
  { id:"bi-10", subject:"biology", topics:["human anatomy","body system","cuerpo humano","sistema corporal"], title:{en:"Human Anatomy",es:"Anatomía Humana"} },
  { id:"bi-11", subject:"biology", topics:["nervous system","neuron","brain","sistema nervioso","neurona"], title:{en:"Nervous System",es:"Sistema Nervioso"} },
  { id:"bi-12", subject:"biology", topics:["circulatory","heart","blood","circulatorio","corazon","sangre"], title:{en:"Circulatory System",es:"Sistema Circulatorio"} },
  { id:"bi-13", subject:"biology", topics:["immune system","immunity","antibody","sistema inmune","anticuerpo"], title:{en:"Immune System",es:"Sistema Inmunológico"} },
  { id:"bi-14", subject:"biology", topics:["taxonomy","classification","kingdom","taxonomia","clasificacion","reino"], title:{en:"Taxonomy & Classification",es:"Taxonomía y Clasificación"} },
  { id:"bi-15", subject:"biology", topics:["microbiology","bacteria","virus","microorganismo"], title:{en:"Microbiology",es:"Microbiología"} },

  // ══════════════════════════════════════════════════════════
  // NUTRITION
  // ══════════════════════════════════════════════════════════
  { id:"nu-01", subject:"nutrition", topics:["macronutrient","protein","carbohydrate","fat","macronutriente","proteina","carbohidrato","grasa"], title:{en:"Macronutrients",es:"Macronutrientes"} },
  { id:"nu-02", subject:"nutrition", topics:["calorie","kcal","energy balance","caloria","balance energetico"], title:{en:"Calories & Energy Balance",es:"Calorías y Balance Energético"} },
  { id:"nu-03", subject:"nutrition", topics:["bmi","imc","body mass index","masa corporal"], title:{en:"BMI & Body Weight",es:"IMC y Peso Corporal"} },
  { id:"nu-04", subject:"nutrition", topics:["basal metabolic rate","bmr","tmb","metabolismo basal","TDEE"], title:{en:"Basal Metabolic Rate",es:"Metabolismo Basal"} },
  { id:"nu-05", subject:"nutrition", topics:["vitamin","mineral","micronutrient","vitamina","mineral"], title:{en:"Vitamins & Minerals",es:"Vitaminas y Minerales"} },
  { id:"nu-06", subject:"nutrition", topics:["protein synthesis nutrition","amino acid","aminoacido"], title:{en:"Proteins & Amino Acids",es:"Proteínas y Aminoácidos"} },
  { id:"nu-07", subject:"nutrition", topics:["carbohydrate metabolism","glycemic index","glucosa","glucemico"], title:{en:"Carbohydrate Metabolism",es:"Metabolismo de Carbohidratos"} },
  { id:"nu-08", subject:"nutrition", topics:["fat metabolism","lipid","cholesterol","lipidos","colesterol"], title:{en:"Lipid Metabolism",es:"Metabolismo de Lípidos"} },
  { id:"nu-09", subject:"nutrition", topics:["hydration","water","electrolyte","hidratacion","agua","electrolit"], title:{en:"Hydration & Electrolytes",es:"Hidratación y Electrolitos"} },
  { id:"nu-10", subject:"nutrition", topics:["meal planning","dieta","diet plan","plan alimenticio"], title:{en:"Meal Planning",es:"Planificación de Comidas"} },
  { id:"nu-11", subject:"nutrition", topics:["sports nutrition","athletic performance","nutricion deportiva"], title:{en:"Sports Nutrition",es:"Nutrición Deportiva"} },
  { id:"nu-12", subject:"nutrition", topics:["food label","nutrition facts","etiqueta nutricional"], title:{en:"Reading Food Labels",es:"Etiquetas Nutricionales"} },
  { id:"nu-13", subject:"nutrition", topics:["digestive system","absorption","digestion","sistema digestivo","absorcion"], title:{en:"Digestion & Absorption",es:"Digestión y Absorción"} },
  { id:"nu-14", subject:"nutrition", topics:["obesity","overweight","obesity treatment","obesidad","sobrepeso"], title:{en:"Obesity & Weight Management",es:"Obesidad y Control de Peso"} },
  { id:"nu-15", subject:"nutrition", topics:["clinical nutrition","therapeutic diet","nutricion clinica","dieta terapeutica"], title:{en:"Clinical Nutrition",es:"Nutrición Clínica"} },

  // ══════════════════════════════════════════════════════════
  // ECONOMICS (MACRO + MICRO)
  // ══════════════════════════════════════════════════════════
  { id:"ec-01", subject:"economics", topics:["supply","demand","oferta","demanda","equilibrio mercado"], title:{en:"Supply & Demand",es:"Oferta y Demanda"} },
  { id:"ec-02", subject:"economics", topics:["elasticity","price elasticity","elasticidad","precio"], title:{en:"Price Elasticity",es:"Elasticidad del Precio"} },
  { id:"ec-03", subject:"economics", topics:["consumer surplus","producer surplus","excedente consumidor","bienestar"], title:{en:"Consumer & Producer Surplus",es:"Excedente del Consumidor y Productor"} },
  { id:"ec-04", subject:"economics", topics:["market structure","monopoly","oligopoly","competition","monopolio"], title:{en:"Market Structures",es:"Estructuras de Mercado"} },
  { id:"ec-05", subject:"economics", topics:["gdp","gross domestic product","pib","produccion","national income"], title:{en:"GDP & National Income",es:"PIB e Ingreso Nacional"} },
  { id:"ec-06", subject:"economics", topics:["inflation","CPI","deflation","inflacion","indice precios"], title:{en:"Inflation & Price Levels",es:"Inflación y Niveles de Precio"} },
  { id:"ec-07", subject:"economics", topics:["unemployment","desempleo","labor market","mercado laboral"], title:{en:"Unemployment",es:"Desempleo"} },
  { id:"ec-08", subject:"economics", topics:["fiscal policy","government spending","tax","politica fiscal","gasto publico"], title:{en:"Fiscal Policy",es:"Política Fiscal"} },
  { id:"ec-09", subject:"economics", topics:["monetary policy","central bank","interest rate","politica monetaria","banco central"], title:{en:"Monetary Policy",es:"Política Monetaria"} },
  { id:"ec-10", subject:"economics", topics:["trade","imports","exports","comparative advantage","comercio","exportacion"], title:{en:"International Trade",es:"Comercio Internacional"} },
  { id:"ec-11", subject:"economics", topics:["exchange rate","foreign exchange","tipo de cambio","divisa"], title:{en:"Exchange Rates",es:"Tipos de Cambio"} },
  { id:"ec-12", subject:"economics", topics:["economic growth","development","crecimiento economico","desarrollo"], title:{en:"Economic Growth",es:"Crecimiento Económico"} },
  { id:"ec-13", subject:"economics", topics:["business cycle","recession","expansion","ciclo economico","recesion"], title:{en:"Business Cycles",es:"Ciclos Económicos"} },
  { id:"ec-14", subject:"economics", topics:["aggregate demand","aggregate supply","IS-LM","demanda agregada"], title:{en:"Aggregate Demand & Supply",es:"Demanda y Oferta Agregada"} },
  { id:"ec-15", subject:"economics", topics:["financial market","bond","stock market","mercado financiero","bono"], title:{en:"Financial Markets",es:"Mercados Financieros"} },
  { id:"ec-16", subject:"economics", topics:["interest","compound interest","interes","interes compuesto","TIR","VPN"], title:{en:"Interest & Financial Math",es:"Interés y Matemáticas Financieras"} },
  { id:"ec-17", subject:"economics", topics:["game theory","nash equilibrium","teoria juegos","nash"], title:{en:"Game Theory",es:"Teoría de Juegos"} },
  { id:"ec-18", subject:"economics", topics:["externality","public goods","externalidad","bienes publicos","fallo mercado"], title:{en:"Externalities & Public Goods",es:"Externalidades y Bienes Públicos"} },

  // ══════════════════════════════════════════════════════════
  // ENGINEERING
  // ══════════════════════════════════════════════════════════
  { id:"en-01", subject:"engineering", topics:["circuit","resistance","ohm","kirchhoff","circuito"], title:{en:"Electric Circuits",es:"Circuitos Eléctricos"} },
  { id:"en-02", subject:"engineering", topics:["stress","strain","deformation","esfuerzo","deformacion","young"], title:{en:"Mechanics of Materials",es:"Mecánica de Materiales"} },
  { id:"en-03", subject:"engineering", topics:["fluid","flow","pressure","bernoulli","fluido","flujo"], title:{en:"Fluid Mechanics",es:"Mecánica de Fluidos"} },
  { id:"en-04", subject:"engineering", topics:["thermodynamics engineering","heat transfer","calor transferencia"], title:{en:"Engineering Thermodynamics",es:"Termodinámica para Ingeniería"} },
  { id:"en-05", subject:"engineering", topics:["structural","beam","load","viga","carga","estructura"], title:{en:"Structural Analysis",es:"Análisis Estructural"} },
  { id:"en-06", subject:"engineering", topics:["signal","frequency domain","fourier","senal","transformada"], title:{en:"Signals & Systems",es:"Señales y Sistemas"} },
  { id:"en-07", subject:"engineering", topics:["control system","feedback","PID","laplace","sistema control"], title:{en:"Control Systems",es:"Sistemas de Control"} },
  { id:"en-08", subject:"engineering", topics:["digital logic","boolean","gate","logica digital","compuerta"], title:{en:"Digital Logic",es:"Lógica Digital"} },
  { id:"en-09", subject:"engineering", topics:["statics","equilibrium","moment","estatica","equilibrio","momento"], title:{en:"Statics",es:"Estática"} },
  { id:"en-10", subject:"engineering", topics:["dynamics","motion engineering","dinamica ingenieria"], title:{en:"Engineering Dynamics",es:"Dinámica para Ingeniería"} },

  // ══════════════════════════════════════════════════════════
  // ACCOUNTING (blocked — coming soon)
  // ══════════════════════════════════════════════════════════
  { id:"ac-01", subject:"accounting", topics:["balance sheet","trial balance","balance comprobacion","activo","pasivo"], title:{en:"Trial Balance",es:"Balance de Comprobación"} },
  { id:"ac-02", subject:"accounting", topics:["income statement","profit loss","estado resultados","utilidad"], title:{en:"Income Statement",es:"Estado de Resultados"} },
  { id:"ac-03", subject:"accounting", topics:["journal entry","asiento contable","debe","haber","partida doble"], title:{en:"Journal Entries",es:"Asientos Contables"} },
  { id:"ac-04", subject:"accounting", topics:["depreciation","amortization","depreciacion","activo fijo"], title:{en:"Depreciation",es:"Depreciación"} },
  { id:"ac-05", subject:"accounting", topics:["cash flow","flujo caja","efectivo","cash statement"], title:{en:"Cash Flow Statement",es:"Estado de Flujo de Efectivo"} },
  { id:"ac-06", subject:"accounting", topics:["financial ratios","liquidity","solvency","razones financieras"], title:{en:"Financial Ratios",es:"Razones Financieras"} },
  { id:"ac-07", subject:"accounting", topics:["inventory","FIFO","LIFO","inventario","costo inventario"], title:{en:"Inventory Accounting",es:"Contabilidad de Inventarios"} },
  { id:"ac-08", subject:"accounting", topics:["tax accounting","impuesto","ISR","IVA","declaracion"], title:{en:"Tax Accounting",es:"Contabilidad Fiscal"} },
];

// Topic detection
export function detectRelevantCourses(problem: string, subject: string): Course[] {
  const lower = problem.toLowerCase();
  const scored = courses.map((c) => {
    const match = c.topics.filter((t) => lower.includes(t)).length;
    const bonus = c.subject === subject ? 4 : 0;
    return { c, score: match + bonus };
  });
  const relevant = scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((s) => s.c);
  if (relevant.length === 0) {
    return courses.filter((c) => c.subject === subject).slice(0, 3);
  }
  return relevant;
}
