export type T_point2d = { x: number; y: number };

export interface FilletPoints {
  T1: T_point2d; // Tangent point on side CD
  T2: T_point2d; // Tangent point on side DE
  O: T_point2d;  // Fillet center point
}


export function getFilletPoints(
  C: T_point2d,
  D: T_point2d,
  E: T_point2d,
  r: number
): FilletPoints {
  //  Utility vector functions 
  const sub = (a: T_point2d, b: T_point2d): T_point2d => ({ x: a.x - b.x, y: a.y - b.y });
  const add = (a: T_point2d, b: T_point2d): T_point2d => ({ x: a.x + b.x, y: a.y + b.y });
  const mul = (v: T_point2d, s: number): T_point2d => ({ x: v.x * s, y: v.y * s });
  const len = (v: T_point2d): number => Math.hypot(v.x, v.y);
  const dot = (a: T_point2d, b: T_point2d): number => a.x * b.x + a.y * b.y;
  const normalize = (v: T_point2d): T_point2d => {
    const L = len(v);
    return { x: v.x / L, y: v.y / L };
  };
  const clamp = (v: number, a: number, b: number): number => Math.max(a, Math.min(b, v));

  //  Direction vectors 
  const ua = normalize(sub(C, D)); // vector D→C
  const ub = normalize(sub(E, D)); // vector D→E

  //  Angle at D 
  const cosθ = clamp(dot(ua, ub), -1, 1);
  const θ = Math.acos(cosθ); // angle between lines (in radians)

  // Tangent and center distances
  const half = θ / 2;
  const DO = r / Math.sin(half); // distance from D to circle center
  const DT = r / Math.tan(half); // distance from D to each tangent point

  //   Internal bisector 
  let bisector = { x: ua.x + ub.x, y: ua.y + ub.y };
  const bisectorLen = len(bisector);
  bisector = { x: bisector.x / bisectorLen, y: bisector.y / bisectorLen };

  // Compute circle center and tangent points 
  const O = add(D, mul(bisector, DO)); // Circle center
  const T1 = add(D, mul(ua, DT));      // Tangent on CD
  const T2 = add(D, mul(ub, DT));      // Tangent on DE

  return { T1, T2, O };
}
