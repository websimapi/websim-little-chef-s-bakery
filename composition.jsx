import { jsxDEV } from "react/jsx-dev-runtime";
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring, useVideoConfig, Img, Audio, staticFile } from "remotion";
const TitleCard = ({ recipeName }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ fps, frame, config: { damping: 10 } });
  return /* @__PURE__ */ jsxDEV(AbsoluteFill, { style: { backgroundColor: "#FF9F1C", justifyContent: "center", alignItems: "center" }, children: /* @__PURE__ */ jsxDEV("h1", { style: { color: "white", fontSize: "60px", textAlign: "center", transform: `scale(${scale})` }, children: [
    "Making",
    /* @__PURE__ */ jsxDEV("br", {}, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 12,
      columnNumber: 23
    }),
    recipeName,
    "!"
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 11,
    columnNumber: 13
  }) }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 10,
    columnNumber: 9
  });
};
const IngredientsScene = ({ ingredients }) => {
  const frame = useCurrentFrame();
  return /* @__PURE__ */ jsxDEV(AbsoluteFill, { style: { backgroundColor: "#CBF3F0", flexWrap: "wrap", justifyContent: "center", alignContent: "center", padding: 20 }, children: ingredients.map((ing, i) => {
    const delay = i * 10;
    const opacity = interpolate(frame, [delay, delay + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const y = interpolate(frame, [delay, delay + 20], [50, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return /* @__PURE__ */ jsxDEV("div", { style: { opacity, transform: `translateY(${y}px)`, margin: 20 }, children: /* @__PURE__ */ jsxDEV(Img, { src: ing.img, style: { width: 150, height: 150, objectFit: "contain" } }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 31,
      columnNumber: 25
    }) }, i, false, {
      fileName: "<stdin>",
      lineNumber: 30,
      columnNumber: 21
    });
  }) }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 22,
    columnNumber: 9
  });
};
const MixScene = ({ mixColor }) => {
  const frame = useCurrentFrame();
  const rotation = frame * 15;
  return /* @__PURE__ */ jsxDEV(AbsoluteFill, { style: { backgroundColor: "#FFF", justifyContent: "center", alignItems: "center" }, children: [
    /* @__PURE__ */ jsxDEV("div", { style: { width: 400, height: 400, position: "relative" }, children: [
      /* @__PURE__ */ jsxDEV(Img, { src: "asset_bowl.png", style: { width: "100%", height: "100%" } }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 46,
        columnNumber: 17
      }),
      /* @__PURE__ */ jsxDEV("div", { style: {
        position: "absolute",
        top: "50%",
        left: "50%",
        width: "60%",
        height: "60%",
        backgroundColor: mixColor,
        borderRadius: "50%",
        transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
        boxShadow: "inset 10px 10px 20px rgba(0,0,0,0.1)"
      }, children: /* @__PURE__ */ jsxDEV("div", { style: { width: 20, height: 20, background: "rgba(0,0,0,0.1)", borderRadius: "50%", position: "absolute", top: 20, left: 100 } }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 57,
        columnNumber: 21
      }) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 47,
        columnNumber: 17
      }),
      /* @__PURE__ */ jsxDEV(
        Img,
        {
          src: "asset_tool_spoon.png",
          style: {
            position: "absolute",
            top: "20%",
            left: "40%",
            width: 150,
            transform: `rotate(${Math.sin(frame / 5) * 20}deg) translateY(${Math.cos(frame / 5) * 20}px)`
          }
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 59,
          columnNumber: 17
        }
      )
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 45,
      columnNumber: 13
    }),
    /* @__PURE__ */ jsxDEV("h2", { style: { position: "absolute", bottom: 100, fontSize: 50, color: "#333" }, children: "Stir It Up!" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 70,
      columnNumber: 13
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 44,
    columnNumber: 9
  });
};
const BakeScene = ({ base }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 60], [0.5, 1], { extrapolateRight: "clamp" });
  return /* @__PURE__ */ jsxDEV(AbsoluteFill, { style: { backgroundColor: "#FFBF69", justifyContent: "center", alignItems: "center" }, children: [
    /* @__PURE__ */ jsxDEV(Img, { src: "asset_oven.png", style: { width: 400, height: 400 } }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 81,
      columnNumber: 13
    }),
    frame > 20 && /* @__PURE__ */ jsxDEV("div", { style: {
      position: "absolute",
      width: 150,
      height: 150,
      background: "#222",
      borderRadius: 10,
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }, children: /* @__PURE__ */ jsxDEV(Img, { src: base, style: { width: "80%", transform: `scale(${scale})` } }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 90,
      columnNumber: 21
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 83,
      columnNumber: 17
    }),
    frame > 50 && /* @__PURE__ */ jsxDEV("h2", { style: { color: "white", marginTop: 450, fontSize: 50 }, children: "DING!" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 94,
      columnNumber: 17
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 80,
    columnNumber: 9
  });
};
const FinalProduct = ({ base, decorations }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ fps, frame, config: { damping: 12 } });
  return /* @__PURE__ */ jsxDEV(AbsoluteFill, { style: { backgroundColor: "#E0F7FA", justifyContent: "center", alignItems: "center" }, children: [
    /* @__PURE__ */ jsxDEV("h2", { style: { position: "absolute", top: 100, fontSize: 60, color: "#FF9F1C" }, children: "Yummy!" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 107,
      columnNumber: 13
    }),
    /* @__PURE__ */ jsxDEV("div", { style: { position: "relative", width: 300, height: 300, transform: `scale(${scale})` }, children: [
      /* @__PURE__ */ jsxDEV(Img, { src: base, style: { width: "100%", height: "100%", objectFit: "contain" } }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 110,
        columnNumber: 17
      }),
      decorations.map((deco, i) => /* @__PURE__ */ jsxDEV(
        Img,
        {
          src: deco.img,
          style: {
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 50,
            height: 50,
            transform: `translate(-50%, -50%) translate(${deco.x}px, ${deco.y}px)`
          }
        },
        i,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 113,
          columnNumber: 21
        }
      ))
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 109,
      columnNumber: 13
    }),
    /* @__PURE__ */ jsxDEV(Audio, { src: staticFile("sfx_cheer.mp3"), volume: 0.5, startFrom: 0 }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 127,
      columnNumber: 13
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 106,
    columnNumber: 9
  });
};
const BakingComposition = ({ recipe, decorations }) => {
  if (!recipe) return null;
  return /* @__PURE__ */ jsxDEV(AbsoluteFill, { style: { backgroundColor: "white" }, children: [
    /* @__PURE__ */ jsxDEV(Audio, { src: staticFile("bgm_cheerful.mp3"), volume: 0.3, loop: true }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 137,
      columnNumber: 13
    }),
    /* @__PURE__ */ jsxDEV(Sequence, { durationInFrames: 60, children: /* @__PURE__ */ jsxDEV(TitleCard, { recipeName: recipe.name }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 140,
      columnNumber: 17
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 139,
      columnNumber: 13
    }),
    /* @__PURE__ */ jsxDEV(Sequence, { from: 60, durationInFrames: 90, children: /* @__PURE__ */ jsxDEV(IngredientsScene, { ingredients: recipe.ingredients }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 144,
      columnNumber: 17
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 143,
      columnNumber: 13
    }),
    /* @__PURE__ */ jsxDEV(Sequence, { from: 150, durationInFrames: 90, children: /* @__PURE__ */ jsxDEV(MixScene, { mixColor: recipe.mixColor }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 148,
      columnNumber: 17
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 147,
      columnNumber: 13
    }),
    /* @__PURE__ */ jsxDEV(Sequence, { from: 240, durationInFrames: 90, children: /* @__PURE__ */ jsxDEV(BakeScene, { base: recipe.base }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 152,
      columnNumber: 17
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 151,
      columnNumber: 13
    }),
    /* @__PURE__ */ jsxDEV(Sequence, { from: 330, children: /* @__PURE__ */ jsxDEV(FinalProduct, { base: recipe.base, decorations }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 156,
      columnNumber: 17
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 155,
      columnNumber: 13
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 136,
    columnNumber: 9
  });
};
export {
  BakingComposition
};
