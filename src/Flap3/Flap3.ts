import { getFilletPoints } from "./getFilletPoints";
import type { T_point2d } from "./getFilletPoints";

//Convert degrees → radians 
const rad = (deg: number): number => (deg * Math.PI) / 180;


export function generateFlap3PathData(
  A: number,
  B: number,
  theta1: number,
  R: number
): string {
  //  Dependencies
  const P = A;
  const Q = B / 2;
  const S = B/4;
  const t1 = rad(theta1);

  // points 
  const A_pt: T_point2d = { x: 0, y: 0 };
  const B_pt: T_point2d = { x: P, y: 0 };
  const C_pt: T_point2d = { x: P - Q / Math.tan(t1), y: Q };
  const D_pt: T_point2d = { x: P, y: Q+S };
  const E_pt: T_point2d = { x: 0, y: Q+S };
  const F_pt: T_point2d = { x: Q / Math.tan(rad(60)), y: C_pt.y }; 

  //  Fillet 1 → at ∠CDE 
  const vCD = { x: C_pt.x - D_pt.x, y: C_pt.y - D_pt.y };
  const vDE = { x: E_pt.x - D_pt.x, y: E_pt.y - D_pt.y };
  const dot1 = vCD.x * vDE.x + vCD.y * vDE.y;
  const lenCD = Math.hypot(vCD.x, vCD.y);
  const lenDE = Math.hypot(vDE.x, vDE.y);
  const cosθ1 = Math.max(-1, Math.min(1, dot1 / (lenCD * lenDE)));
  const theta1_rad = Math.acos(cosθ1);

  const tanHalf1 = Math.tan(theta1_rad / 2);
  const maxR1a = lenCD * tanHalf1;
  const maxR1b = lenDE * tanHalf1;
  const maxR1 = Math.min(maxR1a, maxR1b);
  const validR1 = R > maxR1 ? maxR1 : R < 0 ? 0 : R;

  const { T1: T1a, T2: T2a, O: Oa } = getFilletPoints(C_pt, D_pt, E_pt, validR1);

  // Fillet 2 → at ∠DEF
  const vED = { x: D_pt.x - E_pt.x, y: D_pt.y - E_pt.y };
  const vEF = { x: F_pt.x - E_pt.x, y: F_pt.y - E_pt.y };
  const dot2 = vED.x * vEF.x + vED.y * vEF.y;
  const lenED = Math.hypot(vED.x, vED.y);
  const lenEF = Math.hypot(vEF.x, vEF.y);
  const cosθ2 = Math.max(-1, Math.min(1, dot2 / (lenED * lenEF)));
  const theta2_rad = Math.acos(cosθ2);

  const tanHalf2 = Math.tan(theta2_rad / 2);
  const maxR2a = lenED * tanHalf2;
  const maxR2b = lenEF * tanHalf2;
  const maxR2 = Math.min(maxR2a, maxR2b);
  const validR2 = R > maxR2 ? maxR2 : R < 0 ? 0 : R;

  const { T1: T1b, T2: T2b, O: Ob } = getFilletPoints(D_pt, E_pt, F_pt, validR2);

  //  Arc geometry
  const arcData = (T1: T_point2d, T2: T_point2d, O: T_point2d, R: number) => {
    const startAng = Math.atan2(T1.y - O.y, T1.x - O.x);
    const endAng = Math.atan2(T2.y - O.y, T2.x - O.x);
    let delta = endAng - startAng;
    while (delta < 0) delta += 2 * Math.PI;
    while (delta >= 2 * Math.PI) delta -= 2 * Math.PI;
    const largeArcFlag = Math.abs(delta) > Math.PI ? 1 : 0;
    const cross = (T1.x - O.x) * (T2.y - O.y) - (T1.y - O.y) * (T2.x - O.x);
    const sweepFlag = cross < 0 ? 0 : 1;
    return `A ${R.toFixed(4)} ${R.toFixed(4)} 0 ${largeArcFlag} ${sweepFlag} ${T2.x.toFixed(4)} ${T2.y.toFixed(4)}`;
  };

  const arcCmd1 = arcData(T1a, T2a, Oa, validR1); // CDE arc
  const arcCmd2 = arcData(T1b, T2b, Ob, validR2); // DEF arc

  //  Construct SVG path
  const path = [
    `M ${A_pt.x} ${A_pt.y}`,                         // A
    `L ${B_pt.x} ${B_pt.y}`,                         // B
    `L ${C_pt.x.toFixed(4)} ${C_pt.y.toFixed(4)}`,   // C
    `L ${T1a.x.toFixed(4)} ${T1a.y.toFixed(4)}`,     // Start of CDE fillet
    arcCmd1,                                          // Arc CDE
    `L ${T1b.x.toFixed(4)} ${T1b.y.toFixed(4)}`,     // Connect to DEF fillet
    arcCmd2,                                          // Arc DEF
    `L ${F_pt.x.toFixed(4)} ${F_pt.y.toFixed(4)}`,   // F
    `Z`,                                              // Close shape
  ].join(" ");



  return path;
}
