// main.ts

import { getDefaultFlap8Params, generateFlap8Complete } from "./Flap8";

// =======================
// SVG RENDER
// =======================

window.onload = () => {
    const svgNS = "http://www.w3.org/2000/svg";

    /* =======================
       SVG CANVAS
    ======================= */

    const svg = document.createElementNS(svgNS, "svg");

    svg.setAttribute("width", "700");
    svg.setAttribute("height", "500");
    svg.setAttribute("viewBox", "0 0 400 300");

    svg.style.background = "#f9f9f9";
    svg.style.border = "1px solid #aaa";

    document.body.appendChild(svg);

    /* =======================
       PADDING GROUP
    ======================= */

    const g = document.createElementNS(svgNS, "g");
    g.setAttribute("transform", "translate(60,60)");

    svg.appendChild(g);

    /* =======================
       GENERATE FLAP 8
    ======================= */

    const params = getDefaultFlap8Params();

    const { pathData, points } = generateFlap8Complete(params);

    /* =======================
       DRAW PATH
    ======================= */

    const path = document.createElementNS(svgNS, "path");

    path.setAttribute("d", pathData);
    path.setAttribute("fill", "#cce4ff");
    path.setAttribute("stroke", "#111");
    path.setAttribute("stroke-width", "2");

    g.appendChild(path);

    /* =======================
       DRAW POINTS
    ======================= */

    const orderedKeys = [
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
    ] as const;

    orderedKeys.forEach((key) => {
        const p = points[key];
        if (!p) return;

        // draw point
        const dot = document.createElementNS(svgNS, "circle");
        dot.setAttribute("cx", p.x.toString());
        dot.setAttribute("cy", p.y.toString());
        dot.setAttribute("r", "4");
        dot.setAttribute("fill", "red");

        g.appendChild(dot);

        // label
        const label = document.createElementNS(svgNS, "text");

        label.textContent = `${key} (${p.x.toFixed(1)}, ${p.y.toFixed(1)})`;

        label.setAttribute("x", (p.x + 6).toString());
        label.setAttribute("y", (p.y - 6).toString());
        label.setAttribute("font-size", "10");
        label.setAttribute("font-family", "monospace");
        label.setAttribute("font-weight", "600");

        g.appendChild(label);
    });
};
