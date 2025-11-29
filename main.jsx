import { jsxDEV } from "react/jsx-dev-runtime";
import React from "react";
import { createRoot } from "react-dom/client";
import { Player } from "@websim/remotion/player";
import { BakingComposition } from "./composition.jsx";
let root = null;
window.mountReplay = (data) => {
  const container = document.getElementById("replay-app");
  if (!root) {
    root = createRoot(container);
  }
  root.render(
    /* @__PURE__ */ jsxDEV("div", { style: { width: "100%", height: "100%", background: "#000" }, children: /* @__PURE__ */ jsxDEV(
      Player,
      {
        component: BakingComposition,
        durationInFrames: 450,
        fps: 30,
        compositionWidth: 540,
        compositionHeight: 960,
        controls: true,
        autoplay: true,
        loop: true,
        inputProps: {
          recipe: data.recipe,
          decorations: data.decorations
        },
        style: { width: "100%", height: "100%" }
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 17,
        columnNumber: 7
      }
    ) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 16,
      columnNumber: 5
    })
  );
};
