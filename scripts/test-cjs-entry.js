const assert = require("assert");
const fs = require("fs");
const path = require("path");

const dist = path.resolve(__dirname, "../dist");
assert(
  !fs.existsSync(path.join(dist, "index.js.map")),
  "root has a stale source map"
);
const root = require(dist);
const loadedIcons = () =>
  Object.keys(require.cache).filter((file) =>
    file.startsWith(path.join(dist, "icons") + path.sep)
  );

assert.strictEqual(loadedIcons().length, 0, "root import loaded icon modules");
assert(Object.keys(root).length > 8000, "root is missing named icon exports");
assert.strictEqual(
  loadedIcons().length,
  0,
  "enumerating export names loaded icon modules"
);

assert.strictEqual(typeof root.AccessibilityOutlinedIcon, "function");
assert.strictEqual(
  loadedIcons().length,
  1,
  "one named icon loaded unrelated icons"
);

assert.strictEqual(typeof root.AngleDownIcon, "function");
assert(loadedIcons().length <= 3, "alias access loaded unrelated icons");

assert.strictEqual(typeof root.SvgIcon, "function");
assert(root.categories.Actions.includes("AccessibilityOutlinedIcon"));
assert(loadedIcons().length <= 3, "non-icon exports loaded unrelated icons");

console.log("CommonJS root loads only accessed icons");
