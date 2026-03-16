// =====================================================
// Imports
// =====================================================

import { type T_point2d } from "../Fillet/getFilletPoints";
import { DEG2RAD } from "three/src/math/MathUtils";

// =====================================================
// Types
// =====================================================

export type T_flap7Params = {
    A: number;
    B: number;
    T: number;
};

export type T_PathOutput = {
    pathData: string;
    pathDataNoZ: string;
    points: Record<string, T_point2d>;
};

// =====================================================
// Helpers
// =====================================================

const rad = (deg: number) => deg * DEG2RAD;

// =====================================================
// Defaults
// =====================================================

export const getDefaultFlap7Params = (): T_flap7Params => ({
    A: 200,
    B: 120,
    T: 5,
});

// =====================================================
// Geometry
// =====================================================

export function generateFlap7Complete(params: T_flap7Params): T_PathOutput {
    const { A, B, T } = params;

    const theta = rad(70);

    /* ===============================
     BASE POINTS
  =============================== */

    const A_pt: T_point2d = { x: 0, y: 0 };

    const B_pt: T_point2d = { x: B, y: 0 };

    const C_pt: T_point2d = {
        x: B + T + 1,
        y: T,
    };

    const D_pt: T_point2d = {
        x: 2 * B + T + 1,
        y: T,
    };

    const E_pt: T_point2d = {
        x: 2 * B + T + 1,
        y: T + 0.175 * A,
    };

    const L = 0.15 * A;

    /* ===============================
     Slanted flap geometry
  =============================== */

    const F_pt: T_point2d = {
        x: E_pt.x + 5,
        y: E_pt.y + 5 / Math.tan(theta),
    };

    const x = 5 / Math.tan(theta);

    const G_pt: T_point2d = {
        x: F_pt.x,
        y: E_pt.y + L - x,
    };

    const H_pt: T_point2d = {
        x: E_pt.x,
        y: E_pt.y + L,
    };

    const I_pt: T_point2d = {
        x: E_pt.x,
        y: H_pt.y + 0.175 * A,
    };

    const J_pt: T_point2d = {
        x: E_pt.x,
        y: I_pt.y + 0.175 * A,
    };

    const K_pt: T_point2d = {
        x: J_pt.x + 5,
        y: J_pt.y + 5 / Math.tan(theta),
    };

    const L_pt: T_point2d = {
        x: K_pt.x,
        y: J_pt.y + (L - x),
    };

    const M_pt: T_point2d = {
        x: E_pt.x,
        y: J_pt.y + 0.15 * A,
    };

    const N_pt: T_point2d = {
        x: E_pt.x,
        y: A - T,
    };

    const O_pt: T_point2d = {
        x: B + T + 1,
        y: A - T,
    };

    const P_pt: T_point2d = {
        x: B,
        y: A,
    };

    const Q_pt: T_point2d = {
        x: 0,
        y: A,
    };

    /* ===============================
     PATH
  =============================== */

    const pathData = [
        `M ${A_pt.x} ${A_pt.y}`,
        `L ${B_pt.x} ${B_pt.y}`,
        `L ${C_pt.x} ${C_pt.y}`,
        `L ${D_pt.x} ${D_pt.y}`,
        `L ${E_pt.x} ${E_pt.y}`,
        `L ${F_pt.x} ${F_pt.y}`,
        `L ${G_pt.x} ${G_pt.y}`,
        `L ${H_pt.x} ${H_pt.y}`,
        `L ${I_pt.x} ${I_pt.y}`,
        `L ${J_pt.x} ${J_pt.y}`,
        `L ${K_pt.x} ${K_pt.y}`,
        `L ${L_pt.x} ${L_pt.y}`,
        `L ${M_pt.x} ${M_pt.y}`,
        `L ${N_pt.x} ${N_pt.y}`,
        `L ${O_pt.x} ${O_pt.y}`,
        `L ${P_pt.x} ${P_pt.y}`,
        `L ${Q_pt.x} ${Q_pt.y}`,
        `Z`,
    ].join(" ");

    /* ===============================
     OUTPUT
  =============================== */

    return {
        pathData,
        pathDataNoZ: pathData.replace(/Z/g, ""),

        points: {
            A: A_pt,
            B: B_pt,
            C: C_pt,
            D: D_pt,
            E: E_pt,
            F: F_pt,
            G: G_pt,
            H: H_pt,
            I: I_pt,
            J: J_pt,
            K: K_pt,
            L: L_pt,
            M: M_pt,
            N: N_pt,
            O: O_pt,
            P: P_pt,
            Q: Q_pt,
        },
    };
}
