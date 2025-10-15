import { getFilletPoints, type T_point2d } from "../Flap5/getFilletPoints";

const rad = (deg: number): number => (deg * Math.PI) / 180;
const clamp = (v: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, v));

export function generateFlap5PathData(A: number, theta1 = 90, theta2 = 120) {
  // dependencies
  const P = A;
  const Q = P / 2;
  const R = Q / 10;
  const G = Math.max(Q / 10, 10);
  const t1 = clamp(theta1, 60, 150);
  const t2 = clamp(theta2, 60, 150);
  const t1r = rad(t1);
  const t2r = rad(t2);

  //  Upper flap points
  const A_pt: T_point2d = { x: 0, y: 0 };
  const B_pt: T_point2d = { x: P, y: 0 };
  const C_pt: T_point2d = { x: B_pt.x - Q / Math.tan(t2r), y: Q };
  const AD_len = Q / Math.sin(t1r);
  const D_pt: T_point2d = {
    x: A_pt.x + AD_len * Math.cos(t1r),
    y: A_pt.y + AD_len * Math.sin(t1r),
  };

  // Fillets at C & D
  const f2 = getFilletPoints(B_pt, C_pt, D_pt, R);
  const f3 = getFilletPoints(C_pt, D_pt, A_pt, R);
  const { T1: T1b, T2: T2b, O: Ob } = f2;
  const { T1: T1c, T2: T2c, O: Oc } = f3;

  // Arc helper 
  const arc = (O: T_point2d, T1: T_point2d, T2: T_point2d) => {
    const s = Math.atan2(T1.y - O.y, T1.x - O.x);
    const e = Math.atan2(T2.y - O.y, T2.x - O.x);
    let d = e - s;
    while (d < 0) d += 2 * Math.PI;
    while (d >= 2 * Math.PI) d -= 2 * Math.PI;
    const laf = Math.abs(d) > Math.PI ? 1 : 0;
    const cross = (T1.x - O.x) * (T2.y - O.y) - (T1.y - O.y) * (T2.x - O.x);
    const sf = cross < 0 ? 0 : 1;
    return {
      cmd: `A ${R.toFixed(3)} ${R.toFixed(3)} 0 ${laf} ${sf} ${T2.x.toFixed(3)} ${T2.y.toFixed(3)}`,
      laf,
      sf,
    };
  };

  const arc2 = arc(Ob, T1b, T2b);
  const arc3 = arc(Oc, T1c, T2c);

  // Upper flap path
  const upperPath = [
    `M ${A_pt.x.toFixed(4)} ${A_pt.y.toFixed(4)}`,
    `L ${B_pt.x.toFixed(4)} ${B_pt.y.toFixed(4)}`,
    `L ${T1b.x.toFixed(4)} ${T1b.y.toFixed(4)}`,
    arc2.cmd,
    `L ${T1c.x.toFixed(4)} ${T1c.y.toFixed(4)}`,
    arc3.cmd,
    `Z`,
  ].join(" ");

  //  Mirror function across CD 
  const reflectAcrossCD = (p: T_point2d): T_point2d => {
    const v = { x: D_pt.x - C_pt.x, y: D_pt.y - C_pt.y };
    const n = { x: v.y, y: -v.x };
    const pC = { x: p.x - C_pt.x, y: p.y - C_pt.y };
    const dotPN = pC.x * n.x + pC.y * n.y;
    const lenN2 = n.x * n.x + n.y * n.y;
    const proj = { x: (2 * dotPN * n.x) / lenN2, y: (2 * dotPN * n.y) / lenN2 };
    return { x: p.x - proj.x, y: p.y - proj.y };
  };

  //  Mirror top flap
  const mirror = (p: T_point2d): T_point2d => reflectAcrossCD(p);
  const A_p = mirror(A_pt);
  const B_p = mirror(B_pt);
  const T1b_p = mirror(T1b);
  const T2b_p = mirror(T2b);
  const T1c_p = mirror(T1c);
  const T2c_p = mirror(T2c);

  const arcMirror = (_T1: T_point2d, T2: T_point2d, origArc: { laf: number; sf: number }) => {
    const sfMirrored = origArc.sf === 1 ? 0 : 1;
    return `A ${R.toFixed(4)} ${R.toFixed(4)} 0 ${origArc.laf} ${sfMirrored} ${T2.x.toFixed(4)} ${T2.y.toFixed(4)}`;
  };

  const arc2m = arcMirror(T1b_p, T2b_p, arc2);
  const arc3m = arcMirror(T1c_p, T2c_p, arc3);

  // === 8 · Bottom mirrored flap ===
  const lowerPath = [
    `M ${A_p.x.toFixed(4)} ${A_p.y.toFixed(4)}`,
    `L ${B_p.x.toFixed(4)} ${B_p.y.toFixed(4)}`,
    `L ${T1b_p.x.toFixed(4)} ${T1b_p.y.toFixed(4)}`,
    arc2m,
    `L ${T1c_p.x.toFixed(4)} ${T1c_p.y.toFixed(4)}`,
    arc3m,
    `Z`,
  ].join(" ");

  //  Rectangle below mirrored flap 
  const A2: T_point2d = { x: A_p.x, y: A_p.y + G };
  const B2: T_point2d = { x: B_p.x, y: B_p.y + G };

  const rectPath = [
    `M ${A_p.x.toFixed(4)} ${A_p.y.toFixed(4)}`,
    `L ${B_p.x.toFixed(4)} ${B_p.y.toFixed(4)}`,
    `L ${B2.x.toFixed(4)} ${B2.y.toFixed(4)}`,
    `L ${A2.x.toFixed(4)} ${A2.y.toFixed(4)}`,
    `Z`,
  ].join(" ");

  //  Return combined SVG path 
  return {
    path: [upperPath, lowerPath, rectPath].join(" "),
  };
}
