
import { getFilletPoints, type T_point2d } from "../Fillet/getFilletPoints";
import { DEG2RAD } from "three/src/math/MathUtils";



const rad = (deg: number): number => deg * DEG2RAD;
const clamp = (v: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, v));



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
export type T_PathOutput = {
  pathData: string;
  pathDataNoZ: string;
};

export function generateFlap6PathData(
  P: number,     // width of rectangle
  Q: number,     // height of rectangle
  theta1: number,
  theta2: number,
  W: number,     // flap height
  R: number,     // fillet radius (for flaps)
  rCircle: number // circle radius (center circle)
): T_PathOutput{
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

const { tangent1: T1, tangent2: T2, center: O } = getFilletPoints(A, U1, U2, R);
const { tangent1: T3, tangent2: T4, center: O2 } = getFilletPoints(U1, U2, B, R);

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
const { tangent1: LT1, tangent2: LT2, center: LO1 } = getFilletPoints(D, L2, L1, R);
const { tangent1: LT3, tangent2: LT4, center: LO2 } = getFilletPoints(L2, L1, A, R);

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

const { tangent1: RT1, tangent2: RT2, center: RO1 } = getFilletPoints(B, R1, R2, R);
const { tangent1: RT3, tangent2: RT4, center: RO2 } = getFilletPoints(R1, R2, C, R);

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
   const pathData = [
    rectPath,
    topFlapPath,
    leftFlapPath,
    rightFlapPath,
    bottomFlapPath,
    circlePath,
  ].join(" ");
   const pathDataNoZ = pathData.replace(/Z/g, "");
console.log(pathData)
console.log(pathDataNoZ)
  return { pathData, pathDataNoZ };
}
