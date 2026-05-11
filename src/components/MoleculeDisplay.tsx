// 2D molecule SVG renderer for common chemistry molecules
import { useApp } from "@/contexts/AppContext";
import { getSubjectColor } from "@/lib/subjectColors";

interface Props {
  name: string;   // molecule identifier
  svg?: string;   // optional raw SVG override
}

// Prebuilt SVG structures for common molecules
const MOLECULES: Record<string, { label: string; svg: string }> = {
  H2O: {
    label: "Water (H₂O)",
    svg: `<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg" font-family="monospace" font-size="14">
      <circle cx="100" cy="60" r="18" fill="#ff6b6b" stroke="#c0392b" stroke-width="1.5"/>
      <text x="100" y="65" text-anchor="middle" fill="white" font-weight="bold">O</text>
      <circle cx="45" cy="100" r="14" fill="#74b9ff" stroke="#2980b9" stroke-width="1.5"/>
      <text x="45" y="105" text-anchor="middle" fill="white" font-weight="bold">H</text>
      <circle cx="155" cy="100" r="14" fill="#74b9ff" stroke="#2980b9" stroke-width="1.5"/>
      <text x="155" y="105" text-anchor="middle" fill="white" font-weight="bold">H</text>
      <line x1="83" y1="72" x2="57" y2="90" stroke="#555" stroke-width="2"/>
      <line x1="117" y1="72" x2="143" y2="90" stroke="#555" stroke-width="2"/>
      <text x="100" y="130" text-anchor="middle" fill="#888" font-size="11">Bond angle: 104.5°</text>
    </svg>`
  },
  CO2: {
    label: "Carbon Dioxide (CO₂)",
    svg: `<svg viewBox="0 0 260 100" xmlns="http://www.w3.org/2000/svg" font-family="monospace" font-size="14">
      <circle cx="130" cy="50" r="18" fill="#555" stroke="#333" stroke-width="1.5"/>
      <text x="130" y="55" text-anchor="middle" fill="white" font-weight="bold">C</text>
      <circle cx="45" cy="50" r="18" fill="#ff6b6b" stroke="#c0392b" stroke-width="1.5"/>
      <text x="45" y="55" text-anchor="middle" fill="white" font-weight="bold">O</text>
      <circle cx="215" cy="50" r="18" fill="#ff6b6b" stroke="#c0392b" stroke-width="1.5"/>
      <text x="215" y="55" text-anchor="middle" fill="white" font-weight="bold">O</text>
      <line x1="67" y1="46" x2="110" y2="46" stroke="#555" stroke-width="2"/>
      <line x1="67" y1="54" x2="110" y2="54" stroke="#555" stroke-width="2"/>
      <line x1="150" y1="46" x2="195" y2="46" stroke="#555" stroke-width="2"/>
      <line x1="150" y1="54" x2="195" y2="54" stroke="#555" stroke-width="2"/>
      <text x="130" y="85" text-anchor="middle" fill="#888" font-size="11">Linear · sp hybridization</text>
    </svg>`
  },
  CH4: {
    label: "Methane (CH₄)",
    svg: `<svg viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg" font-family="monospace" font-size="14">
      <circle cx="110" cy="110" r="18" fill="#555" stroke="#333" stroke-width="1.5"/>
      <text x="110" y="115" text-anchor="middle" fill="white" font-weight="bold">C</text>
      <circle cx="110" cy="35" r="14" fill="#74b9ff" stroke="#2980b9" stroke-width="1.5"/>
      <text x="110" y="40" text-anchor="middle" fill="white" font-weight="bold">H</text>
      <circle cx="185" cy="110" r="14" fill="#74b9ff" stroke="#2980b9" stroke-width="1.5"/>
      <text x="185" y="115" text-anchor="middle" fill="white" font-weight="bold">H</text>
      <circle cx="110" cy="185" r="14" fill="#74b9ff" stroke="#2980b9" stroke-width="1.5"/>
      <text x="110" y="190" text-anchor="middle" fill="white" font-weight="bold">H</text>
      <circle cx="35" cy="110" r="14" fill="#74b9ff" stroke="#2980b9" stroke-width="1.5"/>
      <text x="35" y="115" text-anchor="middle" fill="white" font-weight="bold">H</text>
      <line x1="110" y1="92" x2="110" y2="49" stroke="#555" stroke-width="2"/>
      <line x1="128" y1="110" x2="171" y2="110" stroke="#555" stroke-width="2"/>
      <line x1="110" y1="128" x2="110" y2="171" stroke="#555" stroke-width="2"/>
      <line x1="92" y1="110" x2="49" y2="110" stroke="#555" stroke-width="2"/>
      <text x="110" y="210" text-anchor="middle" fill="#888" font-size="11">Tetrahedral · sp³</text>
    </svg>`
  },
  NH3: {
    label: "Ammonia (NH₃)",
    svg: `<svg viewBox="0 0 220 180" xmlns="http://www.w3.org/2000/svg" font-family="monospace" font-size="14">
      <circle cx="110" cy="80" r="18" fill="#6c5ce7" stroke="#4a3fb5" stroke-width="1.5"/>
      <text x="110" y="85" text-anchor="middle" fill="white" font-weight="bold">N</text>
      <circle cx="45" cy="140" r="14" fill="#74b9ff" stroke="#2980b9" stroke-width="1.5"/>
      <text x="45" y="145" text-anchor="middle" fill="white" font-weight="bold">H</text>
      <circle cx="110" cy="150" r="14" fill="#74b9ff" stroke="#2980b9" stroke-width="1.5"/>
      <text x="110" y="155" text-anchor="middle" fill="white" font-weight="bold">H</text>
      <circle cx="175" cy="140" r="14" fill="#74b9ff" stroke="#2980b9" stroke-width="1.5"/>
      <text x="175" y="145" text-anchor="middle" fill="white" font-weight="bold">H</text>
      <line x1="93" y1="94" x2="57" y2="130" stroke="#555" stroke-width="2"/>
      <line x1="110" y1="98" x2="110" y2="136" stroke="#555" stroke-width="2"/>
      <line x1="127" y1="94" x2="163" y2="130" stroke="#555" stroke-width="2"/>
      <text x="155" y="55" fill="#6c5ce7" font-size="11">lone pair</text>
      <ellipse cx="110" cy="48" rx="12" ry="6" fill="none" stroke="#6c5ce7" stroke-width="1.5" stroke-dasharray="3 2"/>
      <text x="110" y="170" text-anchor="middle" fill="#888" font-size="11">Trigonal pyramidal · sp³</text>
    </svg>`
  },
  HCl: {
    label: "Hydrochloric Acid (HCl)",
    svg: `<svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg" font-family="monospace" font-size="14">
      <circle cx="60" cy="50" r="14" fill="#74b9ff" stroke="#2980b9" stroke-width="1.5"/>
      <text x="60" y="55" text-anchor="middle" fill="white" font-weight="bold">H</text>
      <circle cx="140" cy="50" r="22" fill="#00b894" stroke="#00695c" stroke-width="1.5"/>
      <text x="140" y="55" text-anchor="middle" fill="white" font-weight="bold">Cl</text>
      <line x1="74" y1="50" x2="118" y2="50" stroke="#555" stroke-width="2"/>
      <text x="100" y="85" text-anchor="middle" fill="#888" font-size="11">Polar covalent bond</text>
    </svg>`
  },
  H2SO4: {
    label: "Sulfuric Acid (H₂SO₄)",
    svg: `<svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg" font-family="monospace" font-size="13">
      <circle cx="150" cy="100" r="20" fill="#fdcb6e" stroke="#e17055" stroke-width="1.5"/>
      <text x="150" y="106" text-anchor="middle" fill="white" font-weight="bold">S</text>
      <circle cx="70" cy="100" r="17" fill="#ff6b6b" stroke="#c0392b" stroke-width="1.5"/>
      <text x="70" y="106" text-anchor="middle" fill="white" font-weight="bold">O</text>
      <circle cx="230" cy="100" r="17" fill="#ff6b6b" stroke="#c0392b" stroke-width="1.5"/>
      <text x="230" y="106" text-anchor="middle" fill="white" font-weight="bold">O</text>
      <circle cx="150" cy="30" r="17" fill="#ff6b6b" stroke="#c0392b" stroke-width="1.5"/>
      <text x="150" y="36" text-anchor="middle" fill="white" font-weight="bold">O</text>
      <circle cx="150" cy="170" r="17" fill="#ff6b6b" stroke="#c0392b" stroke-width="1.5"/>
      <text x="150" y="176" text-anchor="middle" fill="white" font-weight="bold">O</text>
      <circle cx="25" cy="100" r="13" fill="#74b9ff" stroke="#2980b9" stroke-width="1.5"/>
      <text x="25" y="105" text-anchor="middle" fill="white" font-weight="bold">H</text>
      <circle cx="275" cy="100" r="13" fill="#74b9ff" stroke="#2980b9" stroke-width="1.5"/>
      <text x="275" y="105" text-anchor="middle" fill="white" font-weight="bold">H</text>
      <line x1="87" y1="100" x2="130" y2="100" stroke="#555" stroke-width="2"/>
      <line x1="170" y1="100" x2="213" y2="100" stroke="#555" stroke-width="2"/>
      <line x1="150" y1="80" x2="150" y2="47" stroke="#555" stroke-width="2.5"/>
      <line x1="145" y1="80" x2="145" y2="47" stroke="#555" stroke-width="2.5"/>
      <line x1="150" y1="120" x2="150" y2="153" stroke="#555" stroke-width="2.5"/>
      <line x1="145" y1="120" x2="145" y2="153" stroke="#555" stroke-width="2.5"/>
      <line x1="38" y1="100" x2="53" y2="100" stroke="#555" stroke-width="2"/>
      <line x1="247" y1="100" x2="262" y2="100" stroke="#555" stroke-width="2"/>
    </svg>`
  },
  C6H6: {
    label: "Benzene (C₆H₆)",
    svg: `<svg viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg" font-family="monospace" font-size="12">
      ${[0,60,120,180,240,300].map((angle, i) => {
        const rad = (angle - 90) * Math.PI / 180;
        const cx = 110 + 60 * Math.cos(rad);
        const cy = 110 + 60 * Math.sin(rad);
        const nx = 110 + 90 * Math.cos(rad);
        const ny = 110 + 90 * Math.sin(rad);
        return `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="14" fill="#555" stroke="#333" stroke-width="1.5"/>
        <text x="${cx.toFixed(1)}" y="${(cy+4).toFixed(1)}" text-anchor="middle" fill="white" font-weight="bold">C</text>
        <circle cx="${nx.toFixed(1)}" cy="${ny.toFixed(1)}" r="10" fill="#74b9ff" stroke="#2980b9" stroke-width="1"/>
        <text x="${nx.toFixed(1)}" y="${(ny+4).toFixed(1)}" text-anchor="middle" fill="white" font-weight="bold">H</text>
        <line x1="${(cx + 12*Math.cos(rad)).toFixed(1)}" y1="${(cy + 12*Math.sin(rad)).toFixed(1)}" x2="${(nx - 10*Math.cos(rad)).toFixed(1)}" y2="${(ny - 10*Math.sin(rad)).toFixed(1)}" stroke="#555" stroke-width="1.5"/>`;
      }).join("")}
      ${[0,60,120,180,240,300].map((angle) => {
        const rad1 = (angle - 90) * Math.PI / 180;
        const rad2 = (angle + 60 - 90) * Math.PI / 180;
        return `<line x1="${(110+46*Math.cos(rad1)).toFixed(1)}" y1="${(110+46*Math.sin(rad1)).toFixed(1)}" x2="${(110+46*Math.cos(rad2)).toFixed(1)}" y2="${(110+46*Math.sin(rad2)).toFixed(1)}" stroke="#e17055" stroke-width="2"/>`;
      }).join("")}
      <circle cx="110" cy="110" r="28" fill="none" stroke="#e17055" stroke-width="1.5" stroke-dasharray="5 3"/>
      <text x="110" y="205" text-anchor="middle" fill="#888" font-size="11">Aromatic ring · Delocalized π electrons</text>
    </svg>`
  },
  NaCl: {
    label: "Sodium Chloride (NaCl)",
    svg: `<svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg" font-family="monospace" font-size="14">
      <circle cx="60" cy="50" r="20" fill="#fdcb6e" stroke="#e17055" stroke-width="1.5"/>
      <text x="60" y="47" text-anchor="middle" fill="white" font-weight="bold">Na</text>
      <text x="60" y="62" text-anchor="middle" fill="#fff8" font-size="10">+</text>
      <circle cx="145" cy="50" r="24" fill="#00b894" stroke="#00695c" stroke-width="1.5"/>
      <text x="145" y="47" text-anchor="middle" fill="white" font-weight="bold">Cl</text>
      <text x="145" y="62" text-anchor="middle" fill="#fff8" font-size="10">−</text>
      <line x1="80" y1="50" x2="121" y2="50" stroke="#888" stroke-width="1.5" stroke-dasharray="4 3"/>
      <text x="100" y="85" text-anchor="middle" fill="#888" font-size="11">Ionic bond</text>
    </svg>`
  },
};

const MoleculeDisplay = ({ name, svg }: Props) => {
  const { subject } = useApp();
  const sc = getSubjectColor(subject);
  const mol = MOLECULES[name];
  const rawSVG = svg ?? mol?.svg;
  if (!rawSVG) return null;

  return (
    <div className="mt-4 rounded-xl border border-border bg-card p-4">
      <p className="text-xs font-semibold uppercase tracking-wide mb-3"
         style={{ color: sc.accent }}>
        {mol?.label ?? name} — 2D Structure
      </p>
      <div
        className="flex justify-center"
        dangerouslySetInnerHTML={{ __html: rawSVG }}
        style={{ maxWidth: 320, margin: "0 auto" }}
      />
    </div>
  );
};

export default MoleculeDisplay;
export { MOLECULES };
