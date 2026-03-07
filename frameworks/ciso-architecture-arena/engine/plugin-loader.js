const SUPPORTED_MODEL_TYPES = new Set(["wheel", "stack", "matrix", "lifecycle"]);

function normalizePlugin(pluginPayload) {
  if (!pluginPayload || typeof pluginPayload !== "object") return null;
  if (pluginPayload.framework && typeof pluginPayload.framework === "object") {
    return pluginPayload.framework;
  }
  return pluginPayload;
}

function validateFrameworkPlugin(framework) {
  return Boolean(
    framework
      && typeof framework.id === "string"
      && typeof framework.name === "string"
      && SUPPORTED_MODEL_TYPES.has(framework.type)
      && framework.renderData
      && Array.isArray(framework.scenarios)
  );
}

async function loadManifest(url) {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Framework manifest load failed (${response.status}).`);
  }

  const manifest = await response.json();
  if (!manifest || !Array.isArray(manifest.plugins)) {
    throw new Error("Framework manifest is invalid.");
  }

  return manifest.plugins;
}

export async function loadFrameworkPlugins(manifestUrl) {
  const pluginRefs = await loadManifest(manifestUrl);

  const plugins = await Promise.all(
    pluginRefs.map(async (ref) => {
      const response = await fetch(ref.url, { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`Plugin ${ref.id || ref.url} failed to load (${response.status}).`);
      }

      const payload = await response.json();
      const framework = normalizePlugin(payload);
      if (!validateFrameworkPlugin(framework)) {
        throw new Error(`Plugin ${ref.id || ref.url} has invalid framework structure.`);
      }
      return framework;
    })
  );

  const dedupedById = new Map();
  plugins.forEach((framework) => {
    dedupedById.set(framework.id, framework);
  });

  return Array.from(dedupedById.values());
}
