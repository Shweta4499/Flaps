

export type T_point2d = { x: number; y: number };

const rad = (deg: number): number => (deg * Math.PI) / 180;
const clamp = (v: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, v));

function getFilletPoints(p1: T_point2d, p2: T_point2d, p3: T_point2d, r: number) {
  const v1 = { x: p1.x - p2.x, y: p1.y - p2.y };
  const v2 = { x: p3.x - p2.x, y: p3.y - p2.y };

  const len1 = Math.hypot(v1.x, v1.y);
  const len2 = Math.hypot(v2.x, v2.y);
  v1.x /= len1; v1.y /= len1;
  v2.x /= len2; v2.y /= len2;

  const dot = v1.x * v2.x + v1.y * v2.y;
  const angle = Math.acos(Math.max(-1, Math.min(1, dot)));
  const dist = r / Math.tan(angle / 2);

  const T1 = { x: p2.x + v1.x * dist, y: p2.y + v1.y * dist };
  const T2 = { x: p2.x + v2.x * dist, y: p2.y + v2.y * dist };

  // Adjust for SVG Y-down coordinate system
  const cross = v1.x * v2.y - v1.y * v2.x;
  const sign = cross < 0 ? 1 : -1;

  const bis = { x: v1.x + v2.x, y: v1.y + v2.y };
  const bisLen = Math.hypot(bis.x, bis.y);
  bis.x /= bisLen; bis.y /= bisLen;

  const h = r / Math.sin(angle / 2);
  const O = { x: p2.x + bis.x * h * sign, y: p2.y + bis.y * h * sign };

  return { T1, T2, O };
}

const arc = (O: T_point2d, T1: T_point2d, T2: T_point2d, R: number) => {
  const s = Math.atan2(T1.y - O.y, T1.x - O.x);
  const e = Math.atan2(T2.y - O.y, T2.x - O.x);
  let d = e - s;
  while (d < 0) d += 2 * Math.PI;
  while (d >= 2 * Math.PI) d -= 2 * Math.PI;
  const laf = Math.abs(d) > Math.PI ? 1 : 0;
  const cross = (T1.x - O.x) * (T2.y - O.y) - (T1.y - O.y) * (T2.x - O.x);
  const sf = cross < 0 ? 0 : 1;
  return `A ${R.toFixed(4)} ${R.toFixed(4)} 0 ${laf} ${sf} ${T2.x.toFixed(4)} ${T2.y.toFixed(4)}`;
};


export function generateFlap6PathData(
  P: number,     // width of rectangle
  Q: number,     // height of rectangle
  theta1: number,
  theta2: number,
  W: number,     // flap height
  R: number,     // fillet radius (for flaps)
  rCircle: number // circle radius (center circle)
): string {
  //  Rectangle base 
  const A: T_point2d = { x: 0, y: 0 };
  const B: T_point2d = { x: P, y: 0 };
  const C: T_point2d = { x: P, y: Q };
  const D: T_point2d = { x: 0, y: Q };

  // Top flap (trapezium)
  const t1 = rad(clamp(theta1, 40, 140));
  const t2 = rad(clamp(180 - theta2, 40, 140));

  const U1 = { x: A.x + W * Math.cos(t1), y: A.y - W * Math.sin(t1) };
  const U2 = { x: B.x + W * Math.cos(t2), y: B.y - W * Math.sin(t2) };

  const { T1, T2, O } = getFilletPoints(A, U1, U2, R);
  const { T1: T3, T2: T4, O: O2 } = getFilletPoints(U1, U2, B, R);

  const topFlapPath = [
    `M ${A.x} ${A.y}`,
    `L ${T1.x} ${T1.y}`,
    arc(O, T1, T2, R),
    `L ${T3.x} ${T3.y}`,
    arc(O2, T3, T4, R),
    `L ${B.x} ${B.y}`,
    `Z`,
  ].join(" ");

  // Left flap (trapezium) 
  const L1 = { x: A.x - W * Math.sin(t1), y: A.y + W * Math.cos(t1) };
  const L2 = { x: D.x - W * Math.sin(t2), y: D.y + W * Math.cos(t2) };

  const { T1: LT1, T2: LT2, O: LO1 } = getFilletPoints(D, L2, L1, R);
  const { T1: LT3, T2: LT4, O: LO2 } = getFilletPoints(L2, L1, A, R);

  const leftFlapPath = [
    `M ${D.x} ${D.y}`,
    `L ${LT1.x} ${LT1.y}`,
    arc(LO1, LT1, LT2, R),
    `L ${LT3.x} ${LT3.y}`,
    arc(LO2, LT3, LT4, R),
    `L ${A.x} ${A.y}`,
    `Z`,
  ].join(" ");

  // Right flap (trapezium) 
  const R1 = { x: B.x + W * Math.sin(t1), y: B.y + W * Math.cos(t1) };
  const R2 = { x: C.x + W * Math.sin(t2), y: C.y + W * Math.cos(t2) };

  const { T1: RT1, T2: RT2, O: RO1 } = getFilletPoints(B, R1, R2, R);
  const { T1: RT3, T2: RT4, O: RO2 } = getFilletPoints(R1, R2, C, R);

  const rightFlapPath = [
    `M ${B.x} ${B.y}`,
    `L ${RT1.x} ${RT1.y}`,
    arc(RO1, RT1, RT2, R),
    `L ${RT3.x} ${RT3.y}`,
    arc(RO2, RT3, RT4, R),
    `L ${C.x} ${C.y}`,
    `Z`,
  ].join(" ");

  //  Bottom flap rectangle
  const B1 = { x: D.x, y: D.y + W };
  const B2 = { x: C.x, y: C.y + W };

  const bottomFlapPath = [
    `M ${D.x} ${D.y}`,
    `L ${C.x} ${C.y}`,
    `L ${B2.x} ${B2.y}`,
    `L ${B1.x} ${B1.y}`,
    `Z`,
  ].join(" ");

  //  Rectangle body
  const rectPath = [
    `M ${A.x} ${A.y}`,
    `L ${B.x} ${B.y}`,
    `L ${C.x} ${C.y}`,
    `L ${D.x} ${D.y}`,
    `Z`,
  ].join(" ");

  // Center circle 
  const center = { x: P / 2, y: Q / 2 };
  const circlePath = [
    `M ${center.x + rCircle} ${center.y}`,
    `A ${rCircle} ${rCircle} 0 1 0 ${center.x - rCircle} ${center.y}`,
    `A ${rCircle} ${rCircle} 0 1 0 ${center.x + rCircle} ${center.y}`,
  ].join(" ");

  //  Combine all svg
  return [
    rectPath,
    topFlapPath,
    leftFlapPath,
    rightFlapPath,
    bottomFlapPath,
    circlePath,
  ].join(" ");
}
