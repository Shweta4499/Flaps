import { DEG2RAD } from "three/src/math/MathUtils";

export type T_point2d = { x: number; y: number };

const rad = (deg: number): number => deg * DEG2RAD;
export type T_PathOutput = {
  pathData: string;
  pathDataNoZ: string;
};
export function generateFlap4PathData(
  A: number,
  B: number,
  theta: number,
  alpha1?: number,
  alpha2?: number,
): T_PathOutput{
  //  Dependencies 
  const P = A;
  const Q = B / 2;
  const S = B / 4;
  const tθ = rad(theta);
  const cotθ = 1 / Math.tan(tθ);
  const M = P - 2 * Q * cotθ;
  const F=(P-M)/2;
  const d = S / 10;

  const a1 = alpha1 ? rad(alpha1) : 0;
  const a2 = alpha2 ? rad(alpha2) : 0;
  const z1 = alpha1 ? S - d / Math.tan(a1) : 0;
  const z2 = alpha2 ? S - d / Math.tan(a2) : 0;
  

  // Points 
  const A_pt = { x: 0, y: 0 };                         
  const B_pt = { x: P / 2 - M / 2 - z1 +F, y: 0 };   
  const C_pt = { x: P / 2 - M / 2+F, y: S - S / 5 };
  const D_pt = { x: P / 2 - M / 2+F, y: S };             
  const E_pt = { x: P/2 + M/2-F, y: S };                
  const F_pt = { x: P/2+M/2-F, y: S - S / 5 };
  const G_pt = { x: P/2+M/2-F + z2, y: 0 };               
  const H_pt = { x: P, y: 0 };                         
  const I_pt = { x: P, y: S + Q };                     
  const J_pt = { x: 0, y: S + Q };                     

  //  SVG Path 
  const pathData: string[] = [];
  pathData.push(`M ${A_pt.x} ${A_pt.y}`);
  pathData.push(`L ${B_pt.x} ${B_pt.y}`);

  // LEFT OUTWARD CURVE (B→C→D)
  const ctrlBC = {
    x: (B_pt.x + C_pt.x) / 2,
    y: (B_pt.y + C_pt.y) / 2 - S / 6,
  };
  pathData.push(
    `Q ${ctrlBC.x.toFixed(4)} ${ctrlBC.y.toFixed(4)}, ${C_pt.x.toFixed(4)} ${C_pt.y.toFixed(4)}`
  );
  pathData.push(`L ${D_pt.x} ${D_pt.y}`);

  // EDGE (D→E)
  pathData.push(`L ${E_pt.x} ${E_pt.y}`);
  pathData.push(`L ${F_pt.x} ${F_pt.y}`);

  // RIGHT OUTWARD CURVE (F→G)
  const ctrlFG = {
    x: (F_pt.x + G_pt.x) / 2,
    y: (F_pt.y + G_pt.y) / 2 - S / 6,
  };
  pathData.push(
    `Q ${ctrlFG.x.toFixed(4)} ${ctrlFG.y.toFixed(4)}, ${G_pt.x.toFixed(4)} ${G_pt.y.toFixed(4)}`
  );

  // BOTTOM + CLOSE
  pathData.push(`L ${H_pt.x} ${H_pt.y}`);
  pathData.push(`L ${I_pt.x} ${I_pt.y}`);
  pathData.push(`L ${J_pt.x} ${J_pt.y}`);
  pathData.push(`Z`);

  // Debug 
 const fullPath=pathData.join("");
 const pathDataNoZ = fullPath.replace(/Z$/, "");
console.log(fullPath)
console.log(pathDataNoZ)
console.log("POINTS:", { A_pt, B_pt, C_pt, D_pt, E_pt,F_pt ,G_pt,I_pt,J_pt});
return {pathData:fullPath, pathDataNoZ}}

