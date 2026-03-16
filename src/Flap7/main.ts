// main.ts

import { getDefaultFlap7Params, generateFlap7Complete } from "./Flap7";

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
    svg.setAttribute("viewBox", "0 0 300 350");

    svg.style.background = "#f9f9f9";
    svg.style.border = "1px solid #aaa";

    document.body.appendChild(svg);

    /* =======================
       PADDING GROUP
    ======================= */

    const g = document.createElementNS(svgNS, "g");
    g.setAttribute("transform", "translate(40,40)");

    svg.appendChild(g);

    /* =======================
       GENERATE FLAP7
    ======================= */

    const params = getDefaultFlap7Params();

    const { pathData, points } = generateFlap7Complete(params);

    /* =======================
       DRAW PATH
    ======================= */

    const path = document.createElementNS(svgNS, "path");

    path.setAttribute("d", pathData);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "#111");
    path.setAttribute("stroke-width", "2");

    g.appendChild(path);

    /* =======================
       DRAW POINTS + COORDS
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
        "N",
        "O",
        "P",
        "Q",
    ] as const;
    orderedKeys.forEach((key) => {
        const p = points[key];
        if (!p) return;

        // point dot
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
        label.setAttribute("fill", "#000");

        g.appendChild(label);
    });
};
