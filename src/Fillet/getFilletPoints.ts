// src/Fillet/getFilletPoints.ts

// 2D point type
export type T_point2d = { x: number; y: number };

// Fillet geometry result
export type T_filletPoints = {
  tangent1: T_point2d; // Tangent point on the first side (start → mid)
  tangent2: T_point2d; // Tangent point on the second side (mid → end)
  center: T_point2d;   // Circle center of the fillet
};

/**
 * Compute fillet geometry between two connected line segments:
 * startPoint → midPoint and midPoint → endPoint.
 *
 * @param startPoint - Start of the first segment
 * @param midPoint - The shared vertex (corner point)
 * @param endPoint - End of the second segment
 * @param radius - Desired fillet radius
 * @returns Tangent points and fillet center coordinates
 */
export function getFilletPoints(
  startPoint: T_point2d,
  midPoint: T_point2d,
  endPoint: T_point2d,
  radius: number
): T_filletPoints {
  // ---- Utility vector math ----
  const sub = (a: T_point2d, b: T_point2d): T_point2d => ({ x: a.x - b.x, y: a.y - b.y });
  const add = (a: T_point2d, b: T_point2d): T_point2d => ({ x: a.x + b.x, y: a.y + b.y });
  const mul = (v: T_point2d, s: number): T_point2d => ({ x: v.x * s, y: v.y * s });
  const len = (v: T_point2d): number => Math.hypot(v.x, v.y);
  const dot = (a: T_point2d, b: T_point2d): number => a.x * b.x + a.y * b.y;
  const normalize = (v: T_point2d): T_point2d => {
    const L = len(v);
    return L === 0 ? { x: 0, y: 0 } : { x: v.x / L, y: v.y / L };
  };
  const clamp = (v: number, a: number, b: number): number => Math.max(a, Math.min(b, v));

  // ---- Geometry ----
  // Direction vectors from the corner point (midPoint)
  const u1 = normalize(sub(startPoint, midPoint)); // mid → start
  const u2 = normalize(sub(endPoint, midPoint));   // mid → end

  // Angle between the two vectors
  const cosθ = clamp(dot(u1, u2), -1, 1);
  const θ = Math.acos(cosθ);

  // If lines are nearly straight or parallel
  if (θ < 1e-6) {
    return { tangent1: midPoint, tangent2: midPoint, center: midPoint };
  }

  const half = θ / 2;
  const distToCenter = radius / Math.sin(half); // midPoint → center distance
  const distToTangent = radius / Math.tan(half); // midPoint → tangent distance

  // Compute bisector direction
  let bisector = add(u1, u2);
  const bisectorLen = len(bisector);
  bisector = { x: bisector.x / bisectorLen, y: bisector.y / bisectorLen };

  // Compute key geometry points
  const center = add(midPoint, mul(bisector, distToCenter)); // Circle center
  const tangent1 = add(midPoint, mul(u1, distToTangent));    // Tangent on first line
  const tangent2 = add(midPoint, mul(u2, distToTangent));    // Tangent on second line

  return { tangent1, tangent2, center };
}
