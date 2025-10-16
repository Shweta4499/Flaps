import { getFilletPoints } from "../Fillet/getFilletPoints";
import type { T_point2d } from "../Fillet/getFilletPoints";
import { DEG2RAD } from "three/src/math/MathUtils";

/**
 * Convert degrees → radians
 */
const rad = (deg: number): number => deg * DEG2RAD;

/**
 * Calculate Euclidean distance between two 2D points.
 */
const getDistance2d = (p1: T_point2d, p2: T_point2d): number =>
  Math.hypot(p2.x - p1.x, p2.y - p1.y);

export type T_PathOutput = {
  pathData: string;
  pathDataNoZ: string;
};
export function generateFlap2PathData(
  A: number,
  B: number,
  theta1: number,
  R: number
): T_PathOutput {
  // Dependencies
  const P = B;
  const Q = A / 3;
  const S = 0.66667 * Q;
  const t1 = rad(theta1);

  //  points 
  const A_pt: T_point2d = { x: 0, y: 0 };
  const B_pt: T_point2d = { x: P, y: 0 };
  const C_pt: T_point2d = { x: P - S / Math.tan(t1), y: S };
  const D_pt: T_point2d = { x: P, y: Q };
  const E_pt: T_point2d = { x: 0, y: Q };

 


//  Compute actual angle between vectors CD and DE 
const vCD = { x: C_pt.x - D_pt.x, y: C_pt.y - D_pt.y };
const vDE = { x: E_pt.x - D_pt.x, y: E_pt.y - D_pt.y };
const dot = vCD.x * vDE.x + vCD.y * vDE.y;
const lenCD = Math.hypot(vCD.x, vCD.y);
const lenDE = Math.hypot(vDE.x, vDE.y);
const cosθ = Math.max(-1, Math.min(1, dot / (lenCD * lenDE)));
const theta = Math.acos(cosθ); 

//  Compute upper bound for R
const tanHalf = Math.tan(theta / 2);
const maxR1 = lenCD * tanHalf;
const maxR2 = lenDE * tanHalf;
const maxR = Math.min(maxR1, maxR2);

// Clamp R
const validR = R > maxR ? maxR : R < 0 ? 0 : R;

// Pass into fillet generator
const { tangent1: T1, tangent2: T2, center: O } = getFilletPoints(C_pt, D_pt, E_pt, validR);


 
  const startAng = Math.atan2(T1.y - O.y, T1.x - O.x);
  const endAng   = Math.atan2(T2.y - O.y, T2.x - O.x);

  let delta = endAng - startAng;
  while (delta < 0) delta += 2 * Math.PI;
  while (delta >= 2 * Math.PI) delta -= 2 * Math.PI;

  const largeArcFlag = Math.abs(delta) > Math.PI ? 1 : 0;

  // Cross-product of radius vectors decides sweep direction
  const cross =
    (T1.x - O.x) * (T2.y - O.y) - (T1.y - O.y) * (T2.x - O.x);
  const sweepFlag = cross < 0 ? 0 : 1;

  //  Construct SVG path
  const arcCmd = `A ${validR.toFixed(4)} ${validR.toFixed(
    4
  )} 0 ${largeArcFlag} ${sweepFlag} ${T2.x.toFixed(4)} ${T2.y.toFixed(4)}`;

  const pathData = [
    `M ${A_pt.x} ${A_pt.y}`,                        // Start A
    `L ${B_pt.x} ${B_pt.y}`,                        // B
    `L ${C_pt.x.toFixed(4)} ${C_pt.y.toFixed(4)}`,  // C
    `L ${T1.x.toFixed(4)} ${T1.y.toFixed(4)}`,      // T₁
    arcCmd,                                         // Fillet arc T₁→T₂
    `L ${E_pt.x} ${E_pt.y}`,                        // E
    `Z`,                                            // Close path
  ].join(" ");

const pathDataNoZ=pathData.replace(/Z$/,"");
console.log(pathData)
console.log(pathDataNoZ)
console.log("POINTS:", { A_pt, B_pt, C_pt, D_pt, E_pt, T1, T2, O });

return {pathData, pathDataNoZ}}
