function clearNode(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

function createEl(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text) el.textContent = text;
  return el;
}

function renderWheel(data, container) {
  const segments = data.segments || [];
  const hasCenter = Boolean(data.center && typeof data.center === "object");

  if (!hasCenter) {
    const shell = createEl("div", "framework-wheel");
    segments.forEach((segment, index) => {
      const slice = createEl("div", "framework-wheel-slice");
      slice.style.setProperty("--slice-index", String(index));
      slice.style.setProperty("--slice-total", String(segments.length || 1));

      const title = createEl("strong", "framework-wheel-title", segment.label || "Phase");
      const focus = createEl("span", "framework-wheel-focus", segment.focus || "");
      slice.appendChild(title);
      slice.appendChild(focus);
      shell.appendChild(slice);
    });
    container.appendChild(shell);
    return;
  }

  const shell = createEl("div", "framework-wheel-circle");
  const startDeg = Number.isFinite(data.rotationStartDegrees) ? data.rotationStartDegrees : -90;
  const clockwise = data.clockwise !== false;

  segments.forEach((segment, index) => {
    const item = createEl("button", "framework-wheel-node");
    item.type = "button";
    item.disabled = true;
    const angle = startDeg + (clockwise ? 1 : -1) * (index * (360 / Math.max(1, segments.length)));
    item.style.setProperty("--node-angle", `${angle}deg`);
    item.appendChild(createEl("strong", "framework-wheel-title", segment.label || "Phase"));
    item.appendChild(createEl("span", "framework-wheel-focus", segment.focus || ""));
    shell.appendChild(item);
  });

  const centerNode = createEl("button", "framework-wheel-center");
  centerNode.type = "button";
  centerNode.disabled = true;
  centerNode.appendChild(createEl("strong", "framework-wheel-title", data.center.label || "Center"));
  centerNode.appendChild(createEl("span", "framework-wheel-focus", data.center.focus || ""));
  shell.appendChild(centerNode);

  container.appendChild(shell);
}

function renderStack(data, container) {
  const shell = createEl("div", "framework-stack");
  (data.layers || []).forEach((layer) => {
    const item = createEl("div", "framework-stack-item");
    item.appendChild(createEl("strong", "", layer.label || "Layer"));
    item.appendChild(createEl("span", "", layer.focus || ""));
    shell.appendChild(item);
  });
  container.appendChild(shell);
}

function renderMatrix(data, container) {
  const tableWrap = createEl("div", "framework-matrix-wrap");
  const table = createEl("table", "framework-matrix");

  const head = document.createElement("thead");
  const headRow = document.createElement("tr");
  headRow.appendChild(createEl("th", "", "Perspective \\ Interrogative"));
  (data.columns || []).forEach((col) => headRow.appendChild(createEl("th", "", col)));
  head.appendChild(headRow);
  table.appendChild(head);

  const body = document.createElement("tbody");
  (data.rows || []).forEach((row) => {
    const tr = document.createElement("tr");
    tr.appendChild(createEl("th", "", row));
    (data.columns || []).forEach((col) => {
      tr.appendChild(createEl("td", "", `${row} / ${col}`));
    });
    body.appendChild(tr);
  });
  table.appendChild(body);
  tableWrap.appendChild(table);
  container.appendChild(tableWrap);
}

function renderLifecycle(data, container) {
  const shell = createEl("div", "framework-lifecycle");
  (data.phases || []).forEach((phase, index) => {
    const item = createEl("div", "framework-lifecycle-item");
    item.appendChild(createEl("strong", "", phase.label || "Phase"));
    item.appendChild(createEl("span", "", phase.focus || ""));
    shell.appendChild(item);

    if (index < (data.phases || []).length - 1) {
      shell.appendChild(createEl("div", "framework-lifecycle-arrow", "→"));
    }
  });
  container.appendChild(shell);
}

export function frameworkRenderer(type, data, container) {
  clearNode(container);

  const supported = {
    wheel: renderWheel,
    stack: renderStack,
    matrix: renderMatrix,
    lifecycle: renderLifecycle
  };

  const renderer = supported[type];
  if (!renderer) {
    container.appendChild(createEl("p", "", "Unsupported framework view."));
    return;
  }

  renderer(data || {}, container);
}
