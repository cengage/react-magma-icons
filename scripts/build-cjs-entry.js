const fs = require("fs");
const path = require("path");

const sourceRoot = path.resolve(__dirname, "../src");
const distRoot = path.resolve(__dirname, "../dist");
const rootSource = fs.readFileSync(path.join(sourceRoot, "index.ts"), "utf8");
const groups = [
  ...rootSource.matchAll(/export \* from ["']\.\/icons\/([^"']+)["'];/g),
].map((match) => match[1]);

const exportsByName = new Map([
  ["SvgIcon", "./SvgIcon"],
  ["categories", "./categories"],
]);

for (const group of groups) {
  const groupSource = fs.readFileSync(
    path.join(sourceRoot, "icons", group, "index.ts"),
    "utf8"
  );
  const iconExports = [
    ...groupSource.matchAll(/export \{ (\w+) \} from ["']\.\/([^"']+)["'];/g),
  ];
  if (iconExports.length === 0) {
    throw new Error(`No icon exports found in ${group}`);
  }
  for (const [, name, file] of iconExports) {
    if (!exportsByName.has(name)) {
      exportsByName.set(name, `./icons/${group}/${file}`);
    }
  }
}

const entry = `"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Keep CommonJS named imports lazy. TypeScript declarations and the ESM entry
// are generated separately by tsc.
const paths = ${JSON.stringify(Object.fromEntries(exportsByName))};
for (const name of Object.keys(paths)) {
  Object.defineProperty(exports, name, {
    enumerable: true,
    get: function () { return require(paths[name])[name]; },
  });
}
`;

fs.writeFileSync(path.join(distRoot, "index.js"), entry);
fs.rmSync(path.join(distRoot, "index.js.map"));
