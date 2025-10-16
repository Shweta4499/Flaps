import { getFilletPoints, type T_point2d } from "../Fillet/getFilletPoints";
import { generateFlap3PathData } from "../Flap3/Flap3";
import { DEG2RAD } from "three/src/math/MathUtils";


/**
 * Convert degrees → radians
 */
const rad = (deg: number): number => deg * DEG2RAD;

window.onload = () => {
  const svgNS = "http://www.w3.org/2000/svg";

  // SVG Canvas 
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", "800");
  svg.setAttribute("height", "600");
const padding = 30;
svg.setAttribute("viewBox", `${-padding} ${-padding} ${150 + 2 * padding} ${100 + 2 * padding}`);
  svg.style.background = "#f9f9f9";
  svg.style.border = "1px solid #aaa";
  svg.style.margin = "20px";
  document.body.appendChild(svg);

  // === Input parameters ===
  const A = 100;
  const B = 100;
  const theta1 = 60;
  const R = B / 10;

  // === Derived geometry ===
  const P = A;
  const Q = B / 2;
  const S = B / 4;
  const t1 = rad(theta1);

  // === Define main points ===
  const A_pt: T_point2d = { x: 0, y: 0 };
  const B_pt: T_point2d = { x: P, y: 0 };
  const C_pt: T_point2d = { x: P - Q / Math.tan(t1), y: Q };
  const D_pt: T_point2d = { x: P, y: Q + S };
  const E_pt: T_point2d = { x: 0, y: Q + S };
  const F_pt: T_point2d = { x: Q / Math.tan(rad(60)), y: C_pt.y };

  // === Fillet 1 (CDE) ===
  const fillet1 = getFilletPoints(C_pt, D_pt, E_pt, R);
const { tangent1: T1a, tangent2: T2a, center: Oa } = fillet1;

  // === Fillet 2 (DEF) ===
  const fillet2 = getFilletPoints(D_pt, E_pt, F_pt, R);
const { tangent1: T1b, tangent2: T2b, center: Ob } = fillet2;

  console.log("POINTS:", {
    A_pt, B_pt, C_pt, D_pt, E_pt, F_pt,
    T1a, T2a, Oa, T1b, T2b, Ob
  });

  // === Path from flap3.ts ===
  const {pathData,pathDataNoZ} = generateFlap3PathData(A, B, theta1, R);

  const flap = document.createElementNS(svgNS, "path");
  flap.setAttribute("d", pathData);
  flap.setAttribute("stroke", "#111");
  flap.setAttribute("stroke-width", "1.4");
  flap.setAttribute("fill", "#cce4ff");
  svg.appendChild(flap);

  // === Helper draw functions ===
  const addLine = (p1: T_point2d, p2: T_point2d, color = "#888", dash = false, width = 0.7) => {
    const line = document.createElementNS(svgNS, "line");
    line.setAttribute("x1", p1.x.toString());
    line.setAttribute("y1", p1.y.toString());
    line.setAttribute("x2", p2.x.toString());
    line.setAttribute("y2", p2.y.toString());
    line.setAttribute("stroke", color);
    line.setAttribute("stroke-width", width.toString());
    if (dash) line.setAttribute("stroke-dasharray", "1.8,1.8");
    svg.appendChild(line);
  };

  const addPoint = (p: T_point2d, color: string, size = 1.3) => {
    const c = document.createElementNS(svgNS, "circle");
    c.setAttribute("cx", p.x.toString());
    c.setAttribute("cy", p.y.toString());
    c.setAttribute("r", size.toString());
    c.setAttribute("fill", color);
    svg.appendChild(c);
  };

  const addText = (x: number, y: number, text: string, color = "#333") => {
    const t = document.createElementNS(svgNS, "text");
    t.setAttribute("x", (x + 1.5).toString());
    t.setAttribute("y", (y - 1.5).toString());
    t.setAttribute("font-size", "4");
    t.setAttribute("fill", color);
    t.textContent = text;
    svg.appendChild(t);
  };

  // === Draw all key points ===
  const points = [
    { p: A_pt, name: "A" },
    { p: B_pt, name: "B" },
    { p: C_pt, name: "C" },
    { p: D_pt, name: "D" },
    { p: E_pt, name: "E" },
    { p: F_pt, name: "F" },
    { p: T1a, name: "T1a" },
    { p: T2a, name: "T2a" },
    { p: Oa, name: "Oa" },
    { p: T1b, name: "T1b" },
    { p: T2b, name: "T2b" },
    { p: Ob, name: "Ob" },
  ];

  for (const { p, name } of points) {
    addPoint(p, name.startsWith("O") ? "green" : "red");
    addText(p.x, p.y, `${name} (${p.x.toFixed(4)},${p.y.toFixed(4)})`,
      name.startsWith("O") ? "green" : "#222");
  }

  // Construction lines
  // Fillet 1 (CDE)
  addLine(T1a, D_pt, "#ff9800", true);
  addLine(T2a, D_pt, "#ff9800", true);
  addLine(Oa, T1a, "#2E7D32", false, 1.2);
  addLine(Oa, T2a, "#2E7D32", false, 1.2);

  // Fillet 2 (DEF)
  addLine(T1b, E_pt, "#ff9800", true);
  addLine(T2b, E_pt, "#ff9800", true);
  addLine(Ob, T1b, "#2E7D32", false, 1.2);
  addLine(Ob, T2b, "#2E7D32", false, 1.2);

  // Reference lines
  addLine(A_pt, E_pt, "#999", true);
  addLine(B_pt, D_pt, "#999", true);

  addText(Oa.x - 3, Oa.y - 3, "Fillet 1 Center", "green");
  addText(Ob.x - 3, Ob.y - 3, "Fillet 2 Center", "green");
};
