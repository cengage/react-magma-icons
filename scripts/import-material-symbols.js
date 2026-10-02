const crypto = require("crypto");
const fs = require("fs");
const os = require("os");
const path = require("path");

const CUSTOM_CATEGORY = "Custom";
const OUTLINED_SUFFIX = "_outlined";
const MATERIAL_VARIANT_DIRECTORY = "materialsymbolsrounded";
const repositoryRoot = path.resolve(__dirname, "..");
const iconsRoot = path.join(repositoryRoot, "src/svg/icons");
const legacyNamesPath = path.join(__dirname, "legacy-icon-names.json");

function toPascalCase(value) {
  return value
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join("");
}

function legacyComponentName(category, iconName) {
  const prefix = /^\d/.test(iconName) ? category : "";
  return `${toPascalCase(`${prefix}_${iconName}`)}Icon`;
}

function generatedComponentName(category, sourceName, legacyNames) {
  const isOutlined = sourceName.endsWith(OUTLINED_SUFFIX);
  const iconName = isOutlined
    ? sourceName.slice(0, -OUTLINED_SUFFIX.length)
    : sourceName;
  const legacyName = legacyNames[iconName];
  const stem = legacyName
    ? legacyName.replace(/Icon$/, "")
    : toPascalCase(`${/^\d/.test(iconName) ? `${category}_` : ""}${iconName}`);

  return `${stem}${isOutlined ? "Outlined" : ""}Icon`;
}

function listDirectories(directory) {
  return fs
    .readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

function listSvgFiles(directory) {
  return fs
    .readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".svg"))
    .map((entry) => entry.name)
    .sort();
}

function resolveMaterialRoot(inputPath) {
  const suppliedPath = path.resolve(inputPath);
  const nestedPath = path.join(suppliedPath, "symbols/web");

  if (fs.existsSync(nestedPath)) {
    return nestedPath;
  }

  return suppliedPath;
}

function createLegacyNameManifest() {
  if (fs.existsSync(legacyNamesPath)) {
    return JSON.parse(fs.readFileSync(legacyNamesPath, "utf8"));
  }

  const names = {};

  listDirectories(iconsRoot)
    .filter((category) => category !== CUSTOM_CATEGORY)
    .forEach((category) => {
      listSvgFiles(path.join(iconsRoot, category)).forEach((fileName) => {
        const iconName = path.basename(fileName, ".svg");
        const componentName = legacyComponentName(category, iconName);

        if (names[iconName] && names[iconName] !== componentName) {
          throw new Error(`Duplicate legacy icon name: ${iconName}`);
        }

        names[iconName] = componentName;
      });
    });

  fs.writeFileSync(
    legacyNamesPath,
    `${JSON.stringify(names, null, 2)}\n`,
    "utf8"
  );

  return names;
}

function hashDirectory(directory) {
  const hash = crypto.createHash("sha256");

  function visit(currentDirectory) {
    fs.readdirSync(currentDirectory, { withFileTypes: true })
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach((entry) => {
        const entryPath = path.join(currentDirectory, entry.name);
        const relativePath = path.relative(directory, entryPath);
        hash.update(relativePath);

        if (entry.isDirectory()) {
          visit(entryPath);
        } else {
          hash.update(fs.readFileSync(entryPath));
        }
      });
  }

  visit(directory);
  return hash.digest("hex");
}

function copyMaterialSymbols(materialRoot, stagingRoot, legacyNames) {
  const googleIconNames = new Set();
  const generatedNames = new Map();
  let filledCount = 0;
  let outlinedCount = 0;

  listDirectories(materialRoot).forEach((category) => {
    if (category === CUSTOM_CATEGORY) {
      throw new Error("The Material source must not contain a Custom category.");
    }

    const categoryPath = path.join(materialRoot, category);
    const destinationCategory = path.join(stagingRoot, category);
    fs.mkdirSync(destinationCategory, { recursive: true });

    listDirectories(categoryPath).forEach((iconName) => {
      const variantPath = path.join(
        categoryPath,
        iconName,
        MATERIAL_VARIANT_DIRECTORY
      );
      const filledSource = path.join(variantPath, `${iconName}.svg`);
      const outlinedSource = path.join(
        variantPath,
        `${iconName}_outline.svg`
      );

      if (!fs.existsSync(filledSource) || !fs.existsSync(outlinedSource)) {
        throw new Error(`Missing filled or outlined SVG for ${category}/${iconName}`);
      }

      const variants = [
        { source: filledSource, targetName: iconName },
        { source: outlinedSource, targetName: `${iconName}${OUTLINED_SUFFIX}` },
      ];

      variants.forEach(({ source, targetName }) => {
        const componentName = generatedComponentName(
          category,
          targetName,
          legacyNames
        );
        const owner = generatedNames.get(componentName);

        if (owner) {
          throw new Error(
            `Generated component collision: ${componentName} (${owner} and ${category}/${targetName})`
          );
        }

        generatedNames.set(componentName, `${category}/${targetName}`);
        fs.copyFileSync(source, path.join(destinationCategory, `${targetName}.svg`));
      });

      googleIconNames.add(iconName);
      filledCount += 1;
      outlinedCount += 1;
    });
  });

  return { filledCount, generatedNames, googleIconNames, outlinedCount };
}

function preserveLegacyIcons(
  stagingRoot,
  googleIconNames,
  generatedNames,
  legacyNames
) {
  const uncategorizedPath = path.join(stagingRoot, "Uncategorized");
  fs.mkdirSync(uncategorizedPath, { recursive: true });
  let preservedCount = 0;
  let replacedByGeneratedVariantCount = 0;

  listDirectories(iconsRoot)
    .filter((category) => category !== CUSTOM_CATEGORY)
    .forEach((category) => {
      listSvgFiles(path.join(iconsRoot, category)).forEach((fileName) => {
        const iconName = path.basename(fileName, ".svg");

        if (googleIconNames.has(iconName)) {
          return;
        }

        const legacyName = legacyNames[iconName];

        if (generatedNames.has(legacyName)) {
          replacedByGeneratedVariantCount += 1;
          return;
        }

        const destination = path.join(uncategorizedPath, fileName);

        if (fs.existsSync(destination)) {
          throw new Error(`Legacy icon filename collision: ${fileName}`);
        }

        fs.copyFileSync(path.join(iconsRoot, category, fileName), destination);
        preservedCount += 1;
      });
    });

  return { preservedCount, replacedByGeneratedVariantCount };
}

function replaceGoogleSource(stagingRoot) {
  listDirectories(iconsRoot)
    .filter((category) => category !== CUSTOM_CATEGORY)
    .forEach((category) => {
      const target = path.join(iconsRoot, category);

      if (path.dirname(target) !== iconsRoot) {
        throw new Error(`Refusing to remove unexpected path: ${target}`);
      }

      fs.rmSync(target, { recursive: true, force: true });
    });

  listDirectories(stagingRoot).forEach((category) => {
    fs.cpSync(path.join(stagingRoot, category), path.join(iconsRoot, category), {
      recursive: true,
    });
  });
}

function main() {
  const inputPath = process.argv[2];

  if (!inputPath) {
    throw new Error(
      "Usage: node scripts/import-material-symbols.js /path/to/material-symbols"
    );
  }

  const materialRoot = resolveMaterialRoot(inputPath);

  if (!fs.existsSync(materialRoot)) {
    throw new Error(`Material Symbols source not found: ${materialRoot}`);
  }

  const customPath = path.join(iconsRoot, CUSTOM_CATEGORY);
  const customHashBefore = hashDirectory(customPath);
  const legacyNames = createLegacyNameManifest();
  const stagingRoot = fs.mkdtempSync(
    path.join(os.tmpdir(), "react-magma-material-symbols-")
  );

  try {
    const { filledCount, generatedNames, googleIconNames, outlinedCount } =
      copyMaterialSymbols(materialRoot, stagingRoot, legacyNames);
    const { preservedCount, replacedByGeneratedVariantCount } =
      preserveLegacyIcons(
        stagingRoot,
        googleIconNames,
        generatedNames,
        legacyNames
      );

    replaceGoogleSource(stagingRoot);

    const customHashAfter = hashDirectory(customPath);

    if (customHashBefore !== customHashAfter) {
      throw new Error("Protected Custom SVGs changed during import.");
    }

    console.log(`Imported ${filledCount} filled Material Symbols.`);
    console.log(`Imported ${outlinedCount} outlined Material Symbols.`);
    console.log(`Preserved ${preservedCount} legacy-only icons.`);
    console.log(
      `Replaced ${replacedByGeneratedVariantCount} legacy icons with generated variants.`
    );
    console.log(`Protected Custom hash: ${customHashAfter}`);
  } finally {
    fs.rmSync(stagingRoot, { recursive: true, force: true });
  }
}

main();
