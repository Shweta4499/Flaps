// Flap8.ts
// =====================================================
// Types
// =====================================================
import { getFilletPoints } from "../Fillet/getFilletPoints";
export type T_point2d = {
    x: number;
    y: number;
};

export type T_flap8Params = {
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
// Defaults
// =====================================================

export const getDefaultFlap8Params = (): T_flap8Params => ({
    A: 200,
    B: 50,
    T: 5,
});

// =====================================================
// Geometry
// =====================================================

export function generateFlap8Complete(params: T_flap8Params): T_PathOutput {
    const { A, B, T } = params;

    /* ===============================
       BASE POINTS
    =============================== */

    const A_pt: T_point2d = { x: 0, y: 0 };

    const B_pt: T_point2d = {
        x: B / 2,
        y: 0,
    };

    const C_pt: T_point2d = {
        x: B_pt.x + A - T,
        y: 0,
    };

    const D_pt: T_point2d = {
        x: C_pt.x,
        y: T,
    };

    const E_pt: T_point2d = {
        x: C_pt.x + B / 2,
        y: T,
    };

    const F_pt: T_point2d = {
        x: E_pt.x,
        y: B - T,
    };

    const G_pt: T_point2d = {
        x: D_pt.x,
        y: B - T,
    };
    const H_pt: T_point2d = {
        x: D_pt.x,
        y: B,
    };
    const I_pt: T_point2d = {
        x: B_pt.x,
        y: B,
    };
    const J_pt: T_point2d = {
        x: B_pt.x,
        y: B - T,
    };
    const K_pt: T_point2d = {
        x: 0,
        y: B - T,
    };
    const L_pt: T_point2d = {
        x: 0,
        y: T,
    };
    const M_pt: T_point2d = {
        x: B_pt.x,
        y: T,
    };
    /* ===============================
       PATH
    =============================== */
    const rLeft = B / 2;
    const rRight = B / 4;
    const {
        tangent1: DEF_T1,
        tangent2: DEF_T2,
        center: DEF_O,
    } = getFilletPoints(D_pt, E_pt, F_pt, rRight);

    const {
        tangent1: KLM_T1,
        tangent2: KLM_T2,
        center: KLM_O,
    } = getFilletPoints(K_pt, L_pt, M_pt, rLeft);

    const arc = (O: T_point2d, T1: T_point2d, T2: T_point2d, R: number) => {
        const s = Math.atan2(T1.y - O.y, T1.x - O.x);
        const e = Math.atan2(T2.y - O.y, T2.x - O.x);
        let d = e - s;

        while (d < 0) d += 2 * Math.PI;
        while (d >= 2 * Math.PI) d -= 2 * Math.PI;

        const laf = Math.abs(d) > Math.PI ? 1 : 0;
        const cross = (T1.x - O.x) * (T2.y - O.y) - (T1.y - O.y) * (T2.x - O.x);
        const sf = cross < 0 ? 0 : 1;

        return `A ${R} ${R} 0 ${laf} ${sf} ${T2.x} ${T2.y}`;
    };
    const pathData = [
        ` M${B_pt.x} ${B_pt.y}`,
        `L ${C_pt.x} ${C_pt.y}`,
        `L ${D_pt.x} ${D_pt.y}`,

        arc(DEF_O, DEF_T1, DEF_T2, rLeft),

        `L ${F_pt.x} ${F_pt.y}`,

        `L ${G_pt.x} ${G_pt.y}`,
        `L ${H_pt.x} ${H_pt.y}`,
        `L ${I_pt.x} ${I_pt.y}`,
        `L ${J_pt.x} ${J_pt.y}`,
        `L ${K_pt.x} ${K_pt.y}`,
        arc(KLM_O, KLM_T1, KLM_T2, rRight),
        ` L${B_pt.x} ${B_pt.y}`,
        `L ${C_pt.x} ${C_pt.y}`,
        `L ${G_pt.x} ${G_pt.y}`,
        `L ${H_pt.x} ${H_pt.y}`,
        `L ${I_pt.x} ${I_pt.y}`,
        ` L${B_pt.x} ${B_pt.y}`,

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
        },
    };
}
