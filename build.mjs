// Builds the whole site into ONE self-contained dist/index.html (JS + CSS inlined).
// Fonts still load from Google Fonts. Usage: npm run build:single
import { build } from "esbuild";
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";

rmSync("dist", { recursive: true, force: true });
mkdirSync("dist/_tmp", { recursive: true });

await build({
  entryPoints: ["src/main.tsx"],
  bundle: true,
  minify: true,
  format: "iife",
  target: "es2020",
  jsx: "automatic",
  outdir: "dist/_tmp",
  define: { "process.env.NODE_ENV": '"production"' },
  logLevel: "info",
});

const js = readFileSync("dist/_tmp/main.js", "utf8").replace(/<\/script/gi, "<\\/script");
const css = readFileSync("dist/_tmp/main.css", "utf8");
let html = readFileSync("index.html", "utf8");
html = html
  .replace('<script type="module" src="/src/main.tsx"></script>', "")
  .replace("</head>", `<style>${css}</style>\n  </head>`)
  .replace("</body>", `<script>${js}</script>\n  </body>`);
writeFileSync("dist/index.html", html);
rmSync("dist/_tmp", { recursive: true, force: true });
console.log("dist/index.html", (html.length / 1024).toFixed(0) + " KB");
