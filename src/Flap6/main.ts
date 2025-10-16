import { generateFlap6PathData } from "./Flap6";
import { DEG2RAD } from "three/src/math/MathUtils";


window.onload = () => {
  const svgNS = "http://www.w3.org/2000/svg";

  // SVG Canvas 
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", "800");
  svg.setAttribute("height", "600");
  svg.setAttribute("viewBox", "-100 -100 500 400");
  svg.style.background = "#f9f9f9";
  svg.style.border = "1px solid #aaa";
  svg.style.margin = "40px";
  document.body.appendChild(svg);

  // Parameters
  const P = 250;   // rectangle width
  const Q = 190;   // rectangle height
  const theta1 = 70;
  const theta2 = 70;
  const W = 50;    // flap height
  const R = 12;    // fillet radius
  const rCircle = 45; // center circle radius

  //  Generate path from Flap6.ts 
  const {pathData,pathDataNoZ} = generateFlap6PathData(P, Q, theta1, theta2, W, R, rCircle);

  const flap = document.createElementNS(svgNS, "path");
  flap.setAttribute("d", pathData);
  flap.setAttribute("stroke", "#111");
  flap.setAttribute("stroke-width", "2.4");
  flap.setAttribute("fill", "#cce4ff");
  svg.appendChild(flap);

const rad = (deg: number): number => deg * DEG2RAD;
  const clamp = (v: number, min: number, max: number): number =>
    Math.max(min, Math.min(max, v));

  const addPoint = (p: any, color = "red", size = 2) => {
    const c = document.createElementNS(svgNS, "circle");
    c.setAttribute("cx", p.x.toString());
    c.setAttribute("cy", p.y.toString());
    c.setAttribute("r", size.toString());
    c.setAttribute("fill", color);
    svg.appendChild(c);
  };

  const addText = (
    x: number,
    y: number,
    text: string,
    color = "#000", 
    size = 10
  ) => {
    const t = document.createElementNS(svgNS, "text");
    t.textContent = text;
    t.setAttribute("x", (x + 10).toString());
    t.setAttribute("y", (y + 10).toString());
    t.setAttribute("font-size", size.toString());
    t.setAttribute("font-family", "monospace");
    t.setAttribute("font-weight", "600");
    t.setAttribute("fill", color);
    svg.appendChild(t);
  };

  const A = { x: 0, y: 0 };
  const B = { x: P, y: 0 };
  const C = { x: P, y: Q };
  const D = { x: 0, y: Q };

  const t1 = rad(clamp(theta1, 40, 140));
  const t2 = rad(clamp(180 - theta2, 40, 140));

  const U1 = { x: A.x + W * Math.cos(t1), y: A.y - W * Math.sin(t1) };
  const U2 = { x: B.x + W * Math.cos(t2), y: B.y - W * Math.sin(t2) };

  const L1 = { x: A.x - W * Math.sin(t1), y: A.y + W * Math.cos(t1) };
  const L2 = { x: D.x - W * Math.sin(t2), y: D.y + W * Math.cos(t2) };

  const R1 = { x: B.x + W * Math.sin(t1), y: B.y + W * Math.cos(t1) };
  const R2 = { x: C.x + W * Math.sin(t2), y: C.y + W * Math.cos(t2) };

  const B1 = { x: D.x, y: D.y + W };
  const B2 = { x: C.x, y: C.y + W };

  const center = { x: P / 2, y: Q / 2 };

  const points = [
    { p: A, name: "A", size: 10 },
    { p: B, name: "B", size: 10 },
    { p: C, name: "C", size: 10 },
    { p: D, name: "D", size: 10 },
    { p: U1, name: "U1", size: 9 },
    { p: U2, name: "U2", size: 9 },
    { p: L1, name: "L1", size: 9 },
    { p: L2, name: "L2", size: 9 },
    { p: R1, name: "R1", size: 9 },
    { p: R2, name: "R2", size: 9 },
    { p: B1, name: "B1", size: 9 },
    { p: B2, name: "B2", size: 9 },
    { p: center, name: "Center", size: 12 },
  ];

  for (const { p, name, size } of points) {
    addPoint(p, "red", 2.3);
    addText(
      p.x,
      p.y,
      `${name} (${p.x.toFixed(1)}, ${p.y.toFixed(1)})`,
      "#000", 
    );
  }
};
