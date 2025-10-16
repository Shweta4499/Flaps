import { generateFlap4PathData } from "./Flap4";
import { DEG2RAD } from "three/src/math/MathUtils";


type T_point2d = { x: number; y: number };
const rad = (deg: number): number => deg * DEG2RAD;

window.onload = () => {
  const svgNS = "http://www.w3.org/2000/svg";

  // SVG 
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", "900");
  svg.setAttribute("height", "600");
  const padding = 30;
  svg.setAttribute(
    "viewBox",
    `${-padding} ${-padding} ${150 + 2 * padding} ${120 + 2 * padding}`
  );
  svg.style.background = "#f9f9f9";
  svg.style.border = "1px solid #aaa";
  svg.style.margin = "20px";
  document.body.appendChild(svg);

  //  Parameters 
  const A = 100; // main width
  const B = 100; // main height
  const theta = 75;
  const alpha1 = 10;
  const alpha2 = 10;

  //  Flap Path 
  const {pathData,pathDataNoZ} = generateFlap4PathData(A, B, theta, alpha1, alpha2);

  const flapPath = document.createElementNS(svgNS, "path");
  flapPath.setAttribute("d", pathData);
  flapPath.setAttribute("stroke", "#111");
  flapPath.setAttribute("stroke-width", "1.4");
  flapPath.setAttribute("fill", "#cce4ff");
  svg.appendChild(flapPath);

  // === Helper Functions ===
  const addPoint = (p: T_point2d, color = "red", size = 1.8) => {
    const c = document.createElementNS(svgNS, "circle");
    c.setAttribute("cx", p.x.toString());
    c.setAttribute("cy", p.y.toString());
    c.setAttribute("r", size.toString());
    c.setAttribute("fill", color);
    svg.appendChild(c);
  };

  
  const addText = (x: number, y: number, label: string) => {
    const t = document.createElementNS(svgNS, "text");
    t.setAttribute("x", (x + 1.5).toString());
    t.setAttribute("y", (y - 1.5).toString());
    t.setAttribute("font-size", "4");
    t.setAttribute("fill", "#000");
    t.textContent = label;
    svg.appendChild(t);
  };

  
  const addAngleLabel = (x: number, y: number, text: string) => {
    const t = document.createElementNS(svgNS, "text");
    t.setAttribute("x", x.toString());
    t.setAttribute("y", y.toString());
    t.setAttribute("font-size", "4");
    t.setAttribute("fill", "#000");
    t.textContent = text;
    svg.appendChild(t);
  };

  
  const P = A;
  const Q = B / 2;
  const S = B / 4;
  const tθ = rad(theta);
  const cotθ = 1 / Math.tan(tθ);
  const M = P - 2 * Q * cotθ;
  const d = S / 10;
  const a1 = rad(alpha1);
  const a2 = rad(alpha2);
  const z1 = S - d / Math.tan(a1);
  const z2 = S - d / Math.tan(a2);
  const F = (P - M) / 2;

  // Points A → J
  const A_pt = { x: 0, y: 0 };
  const B_pt = { x: P / 2 - M / 2 - z1 + F, y: 0 };
  const C_pt = { x: P / 2 - M / 2 + F, y: S - S / 5 };
  const D_pt = { x: P / 2 - M / 2 + F, y: S };
  const E_pt = { x: P / 2 + M / 2 - F, y: S };
  const F_pt = { x: P / 2 + M / 2 - F, y: S - S / 5 };
  const G_pt = { x: P / 2 + M / 2 - F + z2, y: 0 };
  const H_pt = { x: P, y: 0 };
  const I_pt = { x: P, y: S + Q };
  const J_pt = { x: 0, y: S + Q };

  //  Label Points 
  const pts = [
    { p: A_pt, n: "A" },
    { p: B_pt, n: "B" },
    { p: C_pt, n: "C" },
    { p: D_pt, n: "D" },
    { p: E_pt, n: "E" },
    { p: F_pt, n: "F" },
    { p: G_pt, n: "G" },
    { p: H_pt, n: "H" },
    { p: I_pt, n: "I" },
    { p: J_pt, n: "J" },
  ];

  for (const { p, n } of pts) {
    addPoint(p, "red"); 
    addText(p.x, p.y, `${n} (${p.x.toFixed(1)}, ${p.y.toFixed(1)})`); //  All text black
  }

  addAngleLabel(C_pt.x - 10, C_pt.y - 5, `α₁ = ${alpha1}°`);
  addAngleLabel(F_pt.x + 3, F_pt.y - 3, `α₂ = ${alpha2}°`);
};
