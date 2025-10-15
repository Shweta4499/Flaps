

import { generateFlap5PathData } from "./Flap5";
import type { T_point2d } from "../Flap5/getFilletPoints";

window.onload = () => {
  const svgNS = "http://www.w3.org/2000/svg";

  // SVG Canvas 
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", "900");
  svg.setAttribute("height", "600");
  svg.setAttribute("viewBox", "-40 -80 440 380");
  svg.style.background = "#f9f9f9";
  svg.style.border = "1px solid #aaa";
  svg.style.margin = "40px";
  document.body.appendChild(svg);

  // Parameters
  const A = 200;
  const theta1 = 90;
  const theta2 = 90;

  // Generate flap path 
  const { path } = generateFlap5PathData(A, theta1, theta2);

  //  Draw main shape 
  const flapPath = document.createElementNS(svgNS, "path");
  flapPath.setAttribute("d", path);
  flapPath.setAttribute("stroke", "#111");
  flapPath.setAttribute("stroke-width", "2.5");
  flapPath.setAttribute("fill", "#cce4ff");
  svg.appendChild(flapPath);

  // = Draw point (circle + label + coordinates) 
  const addPointWithLabel = (p: T_point2d, label: string, color = "#333") => {
    // Circle
    const c = document.createElementNS(svgNS, "circle");
    c.setAttribute("cx", p.x.toString());
    c.setAttribute("cy", p.y.toString());
    c.setAttribute("r", "2");
    c.setAttribute("fill", color);
    svg.appendChild(c);

    // Label (A, B, etc.)
    const text = document.createElementNS(svgNS, "text");
    text.textContent = label;
    text.setAttribute("x", (p.x + 2.5).toString());
    text.setAttribute("y", (p.y - 2).toString());
    text.setAttribute("font-size", "10");
    text.setAttribute("font-weight", "600");
    text.setAttribute("fill", color);
    svg.appendChild(text);

    // Coordinates
    const coord = document.createElementNS(svgNS, "text");
    coord.textContent = `(${p.x.toFixed(1)}, ${p.y.toFixed(1)})`;
    coord.setAttribute("x", (p.x + 2.5).toString());
    coord.setAttribute("y", (p.y + 8).toString());
    coord.setAttribute("font-size", "9");
    coord.setAttribute("fill", "#555");
    coord.setAttribute("font-family", "monospace");
    svg.appendChild(coord);
  };

  // Compute points locally 
  const rad = (deg: number) => (deg * Math.PI) / 180;
  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

  const P = A;
  const Q = P / 2;
  const t1 = clamp(theta1, 60, 150);
  const t2 = clamp(theta2, 60, 150);
  const t1r = rad(t1);
  const t2r = rad(t2);

  const A_pt = { x: 0, y: 0 };
  const B_pt = { x: P, y: 0 };
  const C_pt = { x: B_pt.x - Q / Math.tan(t2r), y: Q };
  const AD_len = Q / Math.sin(t1r);
  const D_pt = {
    x: A_pt.x + AD_len * Math.cos(t1r),
    y: A_pt.y + AD_len * Math.sin(t1r),
  };

  // Reflect function for mirrored flap
  const reflectAcrossCD = (p: T_point2d): T_point2d => {
    const v = { x: D_pt.x - C_pt.x, y: D_pt.y - C_pt.y };
    const n = { x: v.y, y: -v.x };
    const pC = { x: p.x - C_pt.x, y: p.y - C_pt.y };
    const dotPN = pC.x * n.x + pC.y * n.y;
    const lenN2 = n.x * n.x + n.y * n.y;
    const proj = { x: (2 * dotPN * n.x) / lenN2, y: (2 * dotPN * n.y) / lenN2 };
    return { x: p.x - proj.x, y: p.y - proj.y };
  };

  const A_p = reflectAcrossCD(A_pt);
  const B_p = reflectAcrossCD(B_pt);
  const C_p = reflectAcrossCD(C_pt);
  const D_p = reflectAcrossCD(D_pt);

  const G = Math.max(Q / 10, 10);
  const A2 = { x: A_p.x, y: A_p.y + G };
  const B2 = { x: B_p.x, y: B_p.y + G };

  // Draw points + coordinates
  const pts = [
    { p: A_pt, n: "A" },
    { p: B_pt, n: "B" },
    { p: C_pt, n: "C" },
    { p: D_pt, n: "D" },
    { p: A_p, n: "A′" },
    { p: B_p, n: "B′" },
    { p: C_p, n: "C′" },
    { p: D_p, n: "D′" },
    { p: A2, n: "A″" },
    { p: B2, n: "B″" },
  ];

// Use one color for all points
const pointColor = "#fe3300"; // bright orange-red (change if you want)

for (const { p, n } of pts) {
  addPointWithLabel(p, n, pointColor);
}

};
