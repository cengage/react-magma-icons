figma.showUI(__html__, { width: 440, height: 620, themeColors: true });

const PAGE_PREFIX = "Icons — ";
const componentIndex = new Map();

function displayCategory(category) {
  return category === "UI actions" ? "UI Actions" : category;
}

function normalizeSvg(svg, preserveColors) {
  if (preserveColors) return svg.replace(/<\?xml[^>]*>/gi, "");
  return svg
    .replace(/<\?xml[^>]*>/gi, "")
    .replace(/fill=(['"])(?!none)[^'"]+\1/gi, 'fill="#000000"')
    .replace(/stroke=(['"])(?!none)[^'"]+\1/gi, 'stroke="#000000"');
}

function placeSvgInComponent(svg, component, preserveColors) {
  const imported = figma.createNodeFromSvg(normalizeSvg(svg, preserveColors));
  imported.name = "Artwork";
  component.appendChild(imported);

  const scale = Math.min(24 / imported.width, 24 / imported.height);
  if (Number.isFinite(scale) && scale > 0 && scale !== 1) {
    imported.resize(imported.width * scale, imported.height * scale);
  }
  imported.x = (24 - imported.width) / 2;
  imported.y = (24 - imported.height) / 2;
}

function createVariant(icon, variant, svg) {
  const component = figma.createComponent();
  component.name = `Variant=${variant}`;
  component.resize(24, 24);
  component.fills = [];
  component.clipsContent = false;
  placeSvgInComponent(svg, component, icon.category === "Custom");
  component.description = [
    `${icon.displayName} — ${variant}`,
    `Source name: ${icon.sourceName}`,
    `React export: ${icon.reactNames[variant] || icon.reactNames.Filled}`,
    `Category: ${icon.category}`,
  ].join("\n");
  return component;
}

async function getOrCreatePage(category) {
  const pageName = displayCategory(category);
  let page = figma.root.children.find(
    node => node.type === "PAGE" && node.name === pageName
  );
  if (!page) {
    page = figma.root.children.find(
      node => node.type === "PAGE" && node.name === `${PAGE_PREFIX}${category}`
    );
    if (page) page.name = pageName;
  }
  if (!page) {
    page = figma.createPage();
    page.name = pageName;
  }
  await figma.setCurrentPageAsync(page);
  return page;
}

function indexExistingComponents(page) {
  componentIndex.clear();
  const nodes = page.findAllWithCriteria({ types: ["COMPONENT", "COMPONENT_SET"] });
  for (const node of nodes) {
    if (node.parent && node.parent.type === "COMPONENT_SET") continue;
    componentIndex.set(node.name, node);
  }
}

function nextPosition(page) {
  const generated = page.children.filter(
    node => node.type === "COMPONENT" || node.type === "COMPONENT_SET"
  );
  const index = generated.length;
  return {
    x: (index % 12) * 88,
    y: Math.floor(index / 12) * 88,
  };
}

function createIcon(icon, page, replaceExisting) {
  const libraryName = icon.displayName;
  const legacyLibraryName = `${icon.category}/${icon.displayName}`;
  const existing =
    componentIndex.get(libraryName) || componentIndex.get(legacyLibraryName);
  if (existing && !replaceExisting) {
    return { id: existing.id, status: "skipped" };
  }

  const position = existing
    ? { x: existing.x, y: existing.y }
    : nextPosition(page);

  if (existing) {
    existing.remove();
    componentIndex.delete(libraryName);
    componentIndex.delete(legacyLibraryName);
  }

  const variants = [];
  if (icon.filled) variants.push(createVariant(icon, "Filled", icon.filled));
  if (icon.outlined) variants.push(createVariant(icon, "Outlined", icon.outlined));

  let result;
  if (variants.length > 1) {
    variants.forEach((variant, index) => {
      variant.x = index * 64;
      variant.y = 0;
    });
    result = figma.combineAsVariants(variants, page);
    result.name = libraryName;
  } else {
    result = variants[0];
    result.name = libraryName;
  }

  result.x = position.x;
  result.y = position.y;
  result.description = [
    icon.displayName,
    `Search terms: ${icon.searchTerms.join(", ")}`,
    `Source name: ${icon.sourceName}`,
    `React exports: ${Object.values(icon.reactNames).join(", ")}`,
    `Category: ${icon.category}`,
  ].join("\n");
  componentIndex.set(libraryName, result);
  return { id: result.id, status: existing ? "replaced" : "created" };
}

figma.ui.onmessage = async message => {
  if (message.type === "cancel") {
    figma.closePlugin();
    return;
  }

  if (message.type === "start") {
    figma.ui.postMessage({ type: "ready" });
    return;
  }

  if (message.type === "normalize-names") {
    let renamedPages = 0;
    let renamedComponents = 0;

    for (const page of figma.root.children) {
      if (page.type !== "PAGE" || !page.name.startsWith(PAGE_PREFIX)) continue;

      const sourceCategory = page.name.slice(PAGE_PREFIX.length);
      const categoryName = displayCategory(sourceCategory);
      page.name = categoryName;
      renamedPages += 1;

      await figma.setCurrentPageAsync(page);
      const nodes = page.findAllWithCriteria({
        types: ["COMPONENT", "COMPONENT_SET"],
      });
      for (const node of nodes) {
        if (node.parent && node.parent.type === "COMPONENT_SET") continue;
        const prefix = `${sourceCategory}/`;
        if (!node.name.startsWith(prefix)) continue;
        node.name = node.name.slice(prefix.length);
        renamedComponents += 1;
      }
    }

    figma.ui.postMessage({
      type: "names-normalized",
      renamedPages,
      renamedComponents,
    });
    return;
  }

  if (message.type === "batch") {
    const page = await getOrCreatePage(message.category);
    indexExistingComponents(page);

    const results = message.icons.map(icon =>
      createIcon(icon, page, message.replaceExisting)
    );
    figma.ui.postMessage({
      type: "batch-complete",
      category: message.category,
      count: results.length,
      ids: results.map(result => result.id),
      created: results.filter(result => result.status === "created").length,
      replaced: results.filter(result => result.status === "replaced").length,
      skipped: results.filter(result => result.status === "skipped").length,
    });
    return;
  }

  if (message.type === "complete") {
    figma.ui.postMessage({ type: "complete" });
  }
};
