import { getFilletPoints, T_point2d } from "./getFilletPoints";
import { generateFlap2PathData } from "./flap2"; 

// degrees → radians
const rad = (deg: number): number => (deg * Math.PI) / 180;

window.onload = () => {
  const svgNS = "http://www.w3.org/2000/svg";


  //  SVG Canvas 
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", "800");
  svg.setAttribute("height", "600");
  svg.setAttribute("viewBox", "0 0 150 100");
  svg.style.background = "#f9f9f9";
  svg.style.border = "1px solid #aaa";
  svg.style.margin = "40px";
  document.body.appendChild(svg);

  
  // Input parameters
  
  const A = 180; 
  const B = 100; 
  const theta1 = 60; 
  const R = 8;  

  
  // Derived geometry
  const P = B;
  const Q = A / 3;
  const S = 0.66667 * Q;
  const t1 = rad(theta1);

  
  // Define main points
  
  const A_pt: T_point2d  = { x: 0, y: 0 };
  const B_pt: T_point2d  = { x: P, y: 0 };
  const C_pt: T_point2d = { x: P - S / Math.tan(t1), y: S };
  const D_pt: T_point2d = { x: P, y: Q };
  const E_pt: T_point2d = { x: 0, y: Q };

  
  // Compute Fillet Geometry 
  
  const { T1, T2, O } = getFilletPoints(C_pt, D_pt, E_pt, R);

  console.log("POINTS:", { A_pt, B_pt, C_pt, D_pt, E_pt, T1, T2, O });

  
  //Get path from flap2.ts 
  const pathData = generateFlap2PathData(A, B, theta1, R); 

  const flap = document.createElementNS(svgNS, "path");
  flap.setAttribute("d", pathData);
  flap.setAttribute("stroke", "#111");
  flap.setAttribute("stroke-width", "1.4");
  flap.setAttribute("fill", "#cce4ff");
  svg.appendChild(flap);

  
  // Helper draw functions

  const addLine = (p1: T_point2d , p2: T_point2d , color = "#888", dash = false, width = 0.7) => {
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

  const addPoint = (p: T_point2d , color: string, size = 1.3) => {
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

  
  //Draw labeled points
  
  const points = [
    { p: A_pt, name: "A" },
    { p: B_pt, name: "B" },
    { p: C_pt, name: "C" },
    { p: D_pt, name: "D" },
    { p: E_pt, name: "E" },
    { p: T1, name: "T1" },
    { p: T2, name: "T2" },
    { p: O, name: "O" },
  ];

  for (const { p, name } of points) {
    addPoint(p, name === "O" ? "green" : "red");
    addText(p.x, p.y, `${name} (${p.x.toFixed(1)},${p.y.toFixed(1)})`,
      name === "O" ? "green" : "#222");
  }

  
  //Construction lines
  
  addLine(T1, D_pt, "#ff9800", true);
  addLine(T2, D_pt, "#ff9800", true);
  addText((T1.x + D_pt.x) / 2, (T1.y + D_pt.y) / 2, "Tangent", "#ff9800");

  addLine(O, T1, "#2E7D32", false, 1.2);
  const midR = { x: (O.x + T1.x) / 2, y: (O.y + T1.y) / 2 };
  addText(midR.x, midR.y, `R=${R}`, "#2E7D32");

  addLine(D_pt, O, "#2196F3", true);
  addText(O.x - 3, O.y - 3, "Fillet Center", "green");

  addLine(A_pt, E_pt, "#999", true);
  addText((A_pt.x + E_pt.x) / 2, E_pt.y + 3, `Q=${Q.toFixed(1)}`, "#555");
};
