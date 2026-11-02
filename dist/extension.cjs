"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/extension/activate.ts
var activate_exports = {};
__export(activate_exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(activate_exports);
var vscode13 = __toESM(require("vscode"));

// src/extension/commands/index.ts
var vscode6 = __toESM(require("vscode"));

// src/extension/commands/canvas-commands.ts
var vscode4 = __toESM(require("vscode"));

// src/extension/flows/node-flows.ts
var vscode = __toESM(require("vscode"));

// src/shared/registry/uml-registry.ts
var UML_SHAPE_GEOMETRIES = [
  { kind: "ellipse", label: "Ellipse" },
  { kind: "rectangle", label: "Rectangle" },
  { kind: "rhombus", label: "Rhombus" },
  { kind: "trapezoid", label: "Trapezoid" },
  { kind: "parallelogram", label: "Parallelogram" }
];
var endpointShapeRegistry = /* @__PURE__ */ new Map();
var nodeKindRegistry = /* @__PURE__ */ new Map();
var relationPresetRegistry = /* @__PURE__ */ new Map();
function registerEndpointShape(descriptor) {
  endpointShapeRegistry.set(descriptor.kind, descriptor);
}
function getEndpointShape(kind) {
  return endpointShapeRegistry.get(kind);
}
function listEndpointShapes() {
  return Array.from(endpointShapeRegistry.values());
}
function registerUmlNodeKind(descriptor) {
  nodeKindRegistry.set(descriptor.kind, descriptor);
}
function getUmlNodeKind(kind) {
  return nodeKindRegistry.get(kind);
}
function listUmlNodeKinds() {
  return Array.from(nodeKindRegistry.values());
}
function registerUmlRelationPreset(preset) {
  relationPresetRegistry.set(preset.kind, preset);
}
function getUmlRelationPreset(kind) {
  if (kind === "none") {
    return relationPresetRegistry.get("other");
  }
  return relationPresetRegistry.get(kind);
}
function listUmlRelationPresets() {
  return Array.from(relationPresetRegistry.values());
}
function detectMatchingRelationPreset(line, start, end) {
  const isDashed = line === "dashed";
  const startShape = start?.shape ?? "none";
  const startFill = start?.fill ?? "hollow";
  const endShape = end?.shape ?? "none";
  const endFill = end?.fill ?? "hollow";
  if (isDashed && startShape === "none" && endShape === "open-arrow") {
    return "dependency";
  }
  if (isDashed && startShape === "none" && endShape === "triangle" && endFill === "hollow") {
    return "realization";
  }
  if (!isDashed && startShape === "none" && endShape === "triangle" && endFill === "hollow") {
    return "generalization";
  }
  if (!isDashed && startShape === "diamond" && startFill === "hollow" && endShape === "none") {
    return "aggregation";
  }
  if (!isDashed && startShape === "diamond" && startFill === "filled" && endShape === "none") {
    return "composition";
  }
  const isStartAssoc = startShape === "none" || startShape === "open-arrow";
  const isEndAssoc = endShape === "none" || endShape === "open-arrow";
  if (!isDashed && isStartAssoc && isEndAssoc) {
    return "association";
  }
  return null;
}
registerEndpointShape({
  kind: "none",
  label: "None",
  description: "Plain line termination with no marker",
  supportsFill: false,
  defaultSize: 10,
  trimMultiplier: 0,
  buildLocalPath: () => ""
});
registerEndpointShape({
  kind: "circle",
  label: "Circle",
  description: "Circular endpoint decoration (hollow or filled)",
  supportsFill: true,
  defaultFill: "hollow",
  defaultSize: 10,
  trimMultiplier: 1,
  buildLocalPath: (size) => {
    const r = size / 2;
    return `M 0 0 A ${r} ${r} 0 1 0 -${size} 0 A ${r} ${r} 0 1 0 0 0 Z`;
  }
});
registerEndpointShape({
  kind: "diamond",
  label: "Diamond",
  description: "Diamond endpoint decoration (hollow for aggregation, filled for composition)",
  supportsFill: true,
  defaultFill: "hollow",
  defaultSize: 13,
  trimMultiplier: 1,
  buildLocalPath: (size) => {
    const halfLen = size / 2;
    const halfWidth = size * 0.36;
    return `M 0 0 L -${halfLen} -${halfWidth} L -${size} 0 L -${halfLen} ${halfWidth} Z`;
  }
});
registerEndpointShape({
  kind: "square",
  label: "Square",
  description: "Square port/endpoint decoration (hollow or filled)",
  supportsFill: true,
  defaultFill: "hollow",
  defaultSize: 10,
  trimMultiplier: 1,
  buildLocalPath: (size) => {
    const half = size / 2;
    return `M 0 -${half} L -${size} -${half} L -${size} ${half} L 0 ${half} Z`;
  }
});
registerEndpointShape({
  kind: "triangle",
  label: "Triangle",
  description: "Closed triangular arrowhead (hollow for generalization/realization, or filled)",
  supportsFill: true,
  defaultFill: "hollow",
  defaultSize: 12,
  trimMultiplier: 1,
  buildLocalPath: (size) => {
    const halfWidth = size * 0.48;
    return `M 0 0 L -${size} -${halfWidth} L -${size} ${halfWidth} Z`;
  }
});
registerEndpointShape({
  kind: "open-arrow",
  label: "Open Arrow",
  description: "Open V-shaped navigable arrowhead (stroke only)",
  supportsFill: false,
  defaultSize: 11,
  trimMultiplier: 0.15,
  buildLocalPath: (size) => {
    const halfWidth = size * 0.45;
    return `M -${size} -${halfWidth} L 0 0 L -${size} ${halfWidth}`;
  }
});
registerUmlNodeKind({
  kind: "class",
  label: "Class",
  description: "Standard UML class with attributes and operations compartments",
  defaultWidth: 240,
  defaultHeight: 140,
  hasCompartments: true
});
registerUmlNodeKind({
  kind: "note",
  label: "Note",
  description: "Free-text UML annotation note with folded corner",
  defaultWidth: 185,
  defaultHeight: 100,
  hasCompartments: false
});
registerUmlNodeKind({
  kind: "shape",
  label: "Shape",
  description: "Geometric shape node with centered label (ellipse, rectangle, rhombus, trapezoid, parallelogram)",
  defaultWidth: 160,
  defaultHeight: 90,
  hasCompartments: false
});
registerUmlNodeKind({
  kind: "frame",
  label: "Frame",
  description: "Container frame with label that automatically encloses contained elements",
  defaultWidth: 260,
  defaultHeight: 180,
  hasCompartments: false
});
registerUmlRelationPreset({
  kind: "association",
  label: "Association",
  description: "Structural link between classes (solid line, no endpoint markers by default)",
  line: "solid",
  routing: "default",
  start: { shape: "none", size: 10 },
  end: { shape: "none", size: 10 }
});
registerUmlRelationPreset({
  kind: "dependency",
  label: "Dependency",
  description: "Uses/depends-on relationship (dashed line, open arrow at target)",
  line: "dashed",
  routing: "default",
  start: { shape: "none", size: 10 },
  end: { shape: "open-arrow", size: 11 }
});
registerUmlRelationPreset({
  kind: "generalization",
  label: "Generalization (Inheritance)",
  description: "Subclasses a general classifier (solid line, hollow triangle at target)",
  line: "solid",
  routing: "default",
  start: { shape: "none", size: 10 },
  end: { shape: "triangle", fill: "hollow", size: 12 }
});
registerUmlRelationPreset({
  kind: "realization",
  label: "Realization (Implements)",
  description: "Implements a specification contract (dashed line, hollow triangle at target)",
  line: "dashed",
  routing: "default",
  start: { shape: "none", size: 10 },
  end: { shape: "triangle", fill: "hollow", size: 12 }
});
registerUmlRelationPreset({
  kind: "aggregation",
  label: "Aggregation",
  description: "Whole-part weak ownership (solid line, hollow diamond at source)",
  line: "solid",
  routing: "default",
  start: { shape: "diamond", fill: "hollow", size: 13 },
  end: { shape: "none", size: 10 }
});
registerUmlRelationPreset({
  kind: "composition",
  label: "Composition",
  description: "Whole-part strong lifecycle ownership (solid line, filled diamond at source)",
  line: "solid",
  routing: "default",
  start: { shape: "diamond", fill: "filled", size: 13 },
  end: { shape: "none", size: 10 }
});
registerUmlRelationPreset({
  kind: "other",
  label: "Other",
  description: "Generic relation without semantic UML decoration",
  line: "dashed",
  routing: "default",
  start: { shape: "none", size: 10 },
  end: { shape: "none", size: 10 }
});

// src/extension/flows/node-flows.ts
async function promptAddUmlNodeFlow(ctx, params = {}) {
  const { x = 120, y = 100, defaultKind } = params;
  let chosenKind = defaultKind;
  if (!chosenKind) {
    const kindItems = listUmlNodeKinds().map((desc) => ({
      label: desc.label,
      description: desc.kind,
      detail: desc.description,
      kindValue: desc.kind
    }));
    const picked = await vscode.window.showQuickPick(kindItems, {
      title: "Vizion UML: Choose Node Kind",
      placeHolder: "Select class, note, shape, or frame"
    });
    if (!picked) {
      ctx.restoreFocus(ctx.panel);
      return;
    }
    chosenKind = picked.kindValue;
  }
  let chosenStereotype = params.stereotype;
  if (chosenKind === "class" && chosenStereotype === void 0) {
    const stereotypeItems = [
      { label: "$(symbol-class) (None)", description: "Standard UML Class", value: "" },
      { label: "$(symbol-interface) \xABinterface\xBB", description: "Interface specification", value: "interface" },
      { label: "$(symbol-structure) \xABabstract\xBB", description: "Abstract base class", value: "abstract" },
      { label: "$(symbol-misc) \xABservice\xBB", description: "Business or domain service", value: "service" },
      { label: "$(database) \xABentity\xBB", description: "Persistent domain entity", value: "entity" },
      { label: "$(edit) Custom Stereotype...", description: "Specify a custom stereotype label", value: "__CUSTOM__" }
    ];
    const pickedStereo = await vscode.window.showQuickPick(stereotypeItems, {
      title: "Vizion UML: Class Stereotype",
      placeHolder: "Select a standard stereotype or leave as standard class"
    });
    if (pickedStereo === void 0) {
      ctx.restoreFocus(ctx.panel);
      return;
    }
    if (pickedStereo.value === "__CUSTOM__") {
      const customStereo = await vscode.window.showInputBox({
        title: "Vizion UML: Custom Stereotype",
        prompt: "Enter custom stereotype (without guillemets)",
        placeHolder: "e.g. repository, controller, boundary",
        validateInput: (v) => !v.trim() ? "Stereotype cannot be empty" : void 0
      });
      if (customStereo === void 0) {
        ctx.restoreFocus(ctx.panel);
        return;
      }
      chosenStereotype = customStereo.replace(/[«»]/g, "").trim();
    } else {
      chosenStereotype = pickedStereo.value;
    }
  }
  let chosenShapeGeometry = params.shapeGeometry;
  if (chosenKind === "shape" && !chosenShapeGeometry) {
    const shapeItems = UML_SHAPE_GEOMETRIES.map((geo) => ({
      label: geo.label,
      description: `UML 2.5 ${geo.kind} geometry`,
      geometry: geo.kind
    }));
    const pickedShape = await vscode.window.showQuickPick(shapeItems, {
      title: "Vizion UML: Shape Geometry",
      placeHolder: "Select geometric shape outline"
    });
    if (!pickedShape) {
      ctx.restoreFocus(ctx.panel);
      return;
    }
    chosenShapeGeometry = pickedShape.geometry;
  }
  const defaultName = params.name ?? (chosenKind === "note" ? "Architecture Note" : chosenKind === "shape" ? chosenShapeGeometry ? chosenShapeGeometry.charAt(0).toUpperCase() + chosenShapeGeometry.slice(1) : "Shape" : chosenKind === "frame" ? "Frame" : chosenStereotype === "interface" ? "IService" : "DomainEntity");
  const enteredName = await vscode.window.showInputBox({
    title: `Vizion UML: New ${chosenKind.toUpperCase()} Name`,
    prompt: chosenKind === "note" ? "Enter note text or summary" : `Enter ${chosenKind} identifier`,
    value: defaultName,
    validateInput: (val) => {
      const trimmed = val.trim();
      if (trimmed.length === 0) return "Name cannot be empty";
      if (chosenKind === "class" && !/^[a-zA-Z_$][\w$-]*$/.test(trimmed)) {
        return "Class name should be a valid identifier (e.g. OrderService, User_Entity)";
      }
      return void 0;
    }
  });
  ctx.restoreFocus(ctx.panel);
  if (!enteredName || enteredName.trim().length === 0) return;
  if (ctx.document.version !== ctx.expectedVersion) {
    void vscode.window.showWarningMessage("Document changed while the picker was open. Please retry adding the node.");
    return;
  }
  const baseSlug = enteredName.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || chosenKind;
  const uniqueId = `${baseSlug}-${Date.now().toString(36).slice(-4)}`;
  await ctx.enqueueOperation(async () => {
    await ctx.executeOperation(ctx.panel, `host-add-${uniqueId}`, ctx.expectedVersion, {
      type: "uml.addNode",
      id: uniqueId,
      kind: chosenKind,
      name: enteredName.trim(),
      x,
      y,
      ...chosenShapeGeometry ? { shape: chosenShapeGeometry } : {},
      text: chosenKind === "note" ? enteredName.trim() : void 0
    });
    if (chosenKind === "class" && chosenStereotype) {
      await ctx.executeOperation(ctx.panel, `host-set-stereo-${uniqueId}`, ctx.document.version, {
        type: "uml.updateNode",
        nodeId: uniqueId,
        stereotype: chosenStereotype
      });
    }
  });
}

// src/extension/flows/relation-flows.ts
var vscode2 = __toESM(require("vscode"));
async function promptAddUmlEdgeFlow(ctx, params = {}) {
  let { sourceNodeId, targetNodeId, defaultKind, label } = params;
  if (!sourceNodeId || !targetNodeId) {
    const docAst = ctx.getLastValidDocument?.();
    const availableNodes = docAst?.nodes.filter((n) => n.kind !== "frame") ?? [];
    if (availableNodes.length < 2) {
      void vscode2.window.showWarningMessage(
        "At least two non-frame nodes are required in the diagram to connect a relation."
      );
      ctx.restoreFocus(ctx.panel);
      return;
    }
    if (!sourceNodeId) {
      const sourceItems = availableNodes.map((n) => ({
        label: n.name || n.id,
        description: n.kind + (n.stereotype ? ` \xAB${n.stereotype}\xBB` : ""),
        detail: `ID: ${n.id}`,
        nodeId: n.id
      }));
      const pickedSource = await vscode2.window.showQuickPick(sourceItems, {
        title: "Vizion UML: Select Source Node",
        placeHolder: "Choose starting entity for relation"
      });
      if (!pickedSource) {
        ctx.restoreFocus(ctx.panel);
        return;
      }
      sourceNodeId = pickedSource.nodeId;
    }
    if (!targetNodeId) {
      const targetItems = availableNodes.filter((n) => n.id !== sourceNodeId).map((n) => ({
        label: n.name || n.id,
        description: n.kind + (n.stereotype ? ` \xAB${n.stereotype}\xBB` : ""),
        detail: `ID: ${n.id}`,
        nodeId: n.id
      }));
      const pickedTarget = await vscode2.window.showQuickPick(targetItems, {
        title: "Vizion UML: Select Target Node",
        placeHolder: "Choose destination entity for relation"
      });
      if (!pickedTarget) {
        ctx.restoreFocus(ctx.panel);
        return;
      }
      targetNodeId = pickedTarget.nodeId;
    }
  }
  const presetItems = listUmlRelationPresets().map((preset) => ({
    label: preset.label,
    description: preset.kind,
    detail: preset.description,
    picked: preset.kind === (defaultKind ?? "association"),
    presetKind: preset.kind
  }));
  const picked = await vscode2.window.showQuickPick(presetItems, {
    title: `Vizion UML: Relation Kind (${sourceNodeId} \u2192 ${targetNodeId})`,
    placeHolder: "Choose semantic relationship kind"
  });
  ctx.restoreFocus(ctx.panel);
  if (!picked) return;
  if (ctx.document.version !== ctx.expectedVersion) {
    void vscode2.window.showWarningMessage("Document changed while choosing relation kind. Connection cancelled.");
    return;
  }
  const edgeId = `edge-${sourceNodeId}-${targetNodeId}-${Date.now().toString(36).slice(-4)}`;
  await ctx.enqueueOperation(async () => {
    await ctx.executeOperation(ctx.panel, `host-edge-${edgeId}`, ctx.expectedVersion, {
      type: "uml.addEdge",
      id: edgeId,
      kind: picked.presetKind,
      sourceNodeId,
      targetNodeId,
      ...label ? { label } : {}
    });
  });
}
async function promptEndpointDecorationFlow(ctx, params) {
  const { edgeId, end, currentDecoration } = params;
  const endLabel = end === "start" ? "START (Source)" : "END (Target)";
  const shapeItems = listEndpointShapes().map((shape) => ({
    label: shape.label,
    description: currentDecoration?.shape === shape.kind ? `${shape.kind} (current)` : shape.kind,
    detail: shape.description,
    shapeDescriptor: shape
  }));
  const pickedShape = await vscode2.window.showQuickPick(shapeItems, {
    title: `Vizion UML: Customize ${endLabel} Endpoint Shape`,
    placeHolder: `Select decoration shape for ${endLabel} endpoint of relation "${edgeId}"`
  });
  if (!pickedShape) {
    ctx.restoreFocus(ctx.panel);
    return;
  }
  let chosenFill;
  if (pickedShape.shapeDescriptor.supportsFill) {
    const currentFill = currentDecoration?.fill ?? pickedShape.shapeDescriptor.defaultFill ?? "hollow";
    const fillItems = [
      {
        label: "Hollow",
        description: currentFill === "hollow" ? "hollow (current)" : "hollow",
        detail: "Interior filled with theme canvas background; path trimmed cleanly at boundary",
        fillValue: "hollow"
      },
      {
        label: "Filled",
        description: currentFill === "filled" ? "filled (current)" : "filled",
        detail: "Solid foreground fill",
        fillValue: "filled"
      }
    ];
    const pickedFill = await vscode2.window.showQuickPick(fillItems, {
      title: `Vizion UML: Choose ${endLabel} ${pickedShape.shapeDescriptor.label} Fill Mode`,
      placeHolder: "Select Hollow or Filled appearance"
    });
    if (!pickedFill) {
      ctx.restoreFocus(ctx.panel);
      return;
    }
    chosenFill = pickedFill.fillValue;
  }
  ctx.restoreFocus(ctx.panel);
  if (ctx.document.version !== ctx.expectedVersion) {
    void vscode2.window.showWarningMessage("Document changed while endpoint picker was open. Endpoint update cancelled.");
    return;
  }
  const decoration = {
    shape: pickedShape.shapeDescriptor.kind,
    size: currentDecoration?.size ?? pickedShape.shapeDescriptor.defaultSize,
    ...chosenFill ? { fill: chosenFill } : {}
  };
  await ctx.enqueueOperation(async () => {
    await ctx.executeOperation(ctx.panel, `host-endpoint-${edgeId}-${end}`, ctx.expectedVersion, {
      type: "uml.updateEndpoint",
      edgeId,
      end,
      decoration
    });
  });
}
async function promptChangeRelationKindFlow(ctx, params) {
  const { edgeId, currentKind } = params;
  const items = listUmlRelationPresets().map((preset) => ({
    label: preset.label,
    description: preset.kind === currentKind ? `${preset.kind} (current)` : preset.kind,
    detail: preset.description,
    presetKind: preset.kind
  }));
  const picked = await vscode2.window.showQuickPick(items, {
    title: `Vizion UML: Change Relation Kind (${edgeId})`,
    placeHolder: "Select relation semantic kind and reset notation preset"
  });
  ctx.restoreFocus(ctx.panel);
  if (!picked) return;
  if (ctx.document.version !== ctx.expectedVersion) {
    void vscode2.window.showWarningMessage("Document changed while picker was open. Operation cancelled.");
    return;
  }
  await ctx.enqueueOperation(async () => {
    await ctx.executeOperation(ctx.panel, `host-relkind-${edgeId}`, ctx.expectedVersion, {
      type: "uml.updateEdge",
      edgeId,
      kind: picked.presetKind
    });
  });
}

// src/extension/flows/metadata-flows.ts
var vscode3 = __toESM(require("vscode"));

// src/shared/operations/text-parsers.ts
function parseAttributesFromText(text, nodeId, existingAttrs = []) {
  const lines = text.split(/\r?\n/);
  const result = [];
  const ATTR_REGEX2 = /^\s*([+\-#~＋－])?\s*([a-zA-Z_$][\w$-]*)(?:\s*:\s*(.+?))?\s*$/;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const match = line.match(ATTR_REGEX2);
    if (!match) continue;
    let rawVis = match[1];
    let vis = "+";
    if (rawVis === "-" || rawVis === "\uFF0D") vis = "-";
    else if (rawVis === "#") vis = "#";
    else if (rawVis === "~") vis = "~";
    else vis = "+";
    const name = match[2].trim();
    const type = match[3] ? match[3].trim() : void 0;
    const existing = existingAttrs[result.length];
    const id = existing?.id ?? `${nodeId}-attr-${Date.now().toString(36)}-${result.length + 1}`;
    result.push({
      id,
      visibility: vis,
      name,
      ...type ? { type } : {}
    });
  }
  return result;
}
function parseOperationsFromText(text, nodeId, existingOps = []) {
  const lines = text.split(/\r?\n/);
  const result = [];
  const OP_REGEX2 = /^\s*([+\-#~＋－])?\s*([a-zA-Z_$][\w$-]*)\s*(?:\((.*?)\))?(?:\s*:\s*(.+?))?\s*$/;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const match = line.match(OP_REGEX2);
    if (!match) continue;
    let rawVis = match[1];
    let vis = "+";
    if (rawVis === "-" || rawVis === "\uFF0D") vis = "-";
    else if (rawVis === "#") vis = "#";
    else if (rawVis === "~") vis = "~";
    else vis = "+";
    const name = match[2].trim();
    const rawParams = match[3];
    const returnType = match[4] ? match[4].trim() : void 0;
    const existing = existingOps[result.length];
    const id = existing?.id ?? `${nodeId}-op-${Date.now().toString(36)}-${result.length + 1}`;
    const parameters = [];
    if (rawParams !== void 0 && rawParams.trim().length > 0) {
      const parts = rawParams.split(",");
      for (let pIdx = 0; pIdx < parts.length; pIdx++) {
        const pTrimmed = parts[pIdx].trim();
        if (!pTrimmed) continue;
        const colonIdx = pTrimmed.indexOf(":");
        let pName = pTrimmed;
        let pType = "";
        if (colonIdx !== -1) {
          pName = pTrimmed.slice(0, colonIdx).trim();
          pType = pTrimmed.slice(colonIdx + 1).trim();
        }
        if (pName.length > 0) {
          parameters.push({
            id: `${id}-param-${pIdx + 1}`,
            name: pName,
            ...pType ? { type: pType } : {}
          });
        }
      }
    }
    const signature = rawParams !== void 0 ? `(${parameters.map((p) => p.type ? `${p.name}: ${p.type}` : p.name).join(", ")})` : "()";
    result.push({
      id,
      visibility: vis,
      name,
      signature,
      ...returnType ? { returnType } : {},
      parameters
    });
  }
  return result;
}

// src/extension/flows/metadata-flows.ts
var ATTR_REGEX = /^\s*([+\-#~＋－])?\s*([a-zA-Z_$][\w$-]*)(?:\s*:\s*(.+?))?\s*$/;
var OP_REGEX = /^\s*([+\-#~＋－])?\s*([a-zA-Z_$][\w$-]*)\s*(?:\((.*?)\))?(?:\s*:\s*(.+?))?\s*$/;
async function promptRenameEntityFlow(ctx, params = {}) {
  let { targetKind, targetId, memberId, currentValue } = params;
  const doc = ctx.getLastValidDocument?.();
  if (!targetKind) {
    const kindItems = [
      { label: "$(symbol-class) Node Name", description: "Rename a class, note, or shape", targetKindValue: "node" },
      { label: "$(git-commit) Relation Label", description: "Edit text label on a relation link", targetKindValue: "edgeLabel" },
      { label: "$(symbol-field) Class Attribute", description: "Edit visibility, name, or type of an attribute", targetKindValue: "attribute" },
      { label: "$(symbol-method) Class Operation", description: "Edit method signature, parameters, or return type", targetKindValue: "operation" },
      { label: "$(book) Document Title", description: "Change the title of this .viz diagram", targetKindValue: "documentTitle" }
    ];
    const pickedKind = await vscode3.window.showQuickPick(kindItems, {
      title: "Vizion: What would you like to edit?",
      placeHolder: "Select entity category"
    });
    if (!pickedKind) {
      ctx.restoreFocus(ctx.panel);
      return;
    }
    targetKind = pickedKind.targetKindValue;
  }
  switch (targetKind) {
    case "node": {
      if (!targetId) {
        const nodes = doc?.nodes ?? [];
        if (nodes.length === 0) {
          void vscode3.window.showInformationMessage("No nodes found in diagram to rename.");
          ctx.restoreFocus(ctx.panel);
          return;
        }
        const pickedNode = await vscode3.window.showQuickPick(
          nodes.map((n) => ({ label: n.name || n.id, description: n.kind, nodeId: n.id })),
          { title: "Vizion: Select Node to Rename" }
        );
        if (!pickedNode) {
          ctx.restoreFocus(ctx.panel);
          return;
        }
        targetId = pickedNode.nodeId;
        const found = nodes.find((n) => n.id === targetId);
        if (found) currentValue = found.name;
      }
      const nextName = await vscode3.window.showInputBox({
        title: "Vizion: Rename UML Node",
        value: currentValue ?? "",
        prompt: "Enter new node identifier",
        validateInput: (v) => !v.trim() ? "Name cannot be empty." : void 0
      });
      ctx.restoreFocus(ctx.panel);
      if (!nextName || !nextName.trim()) return;
      if (ctx.document.version !== ctx.expectedVersion) {
        void vscode3.window.showWarningMessage("Document changed while input box was open. Edit cancelled.");
        return;
      }
      await ctx.enqueueOperation(async () => {
        await ctx.executeOperation(ctx.panel, `rename-node-${targetId}`, ctx.expectedVersion, {
          type: "uml.updateNode",
          nodeId: targetId,
          name: nextName.trim()
        });
      });
      break;
    }
    case "edgeLabel": {
      if (!targetId) {
        const edges = doc?.edges ?? [];
        if (edges.length === 0) {
          void vscode3.window.showInformationMessage("No relations found in diagram.");
          ctx.restoreFocus(ctx.panel);
          return;
        }
        const pickedEdge = await vscode3.window.showQuickPick(
          edges.map((e) => ({
            label: e.label || `(${e.kind ?? "relation"})`,
            description: `${e.sourceNodeId} \u2192 ${e.targetNodeId}`,
            edgeId: e.id
          })),
          { title: "Vizion: Select Relation to Edit Label" }
        );
        if (!pickedEdge) {
          ctx.restoreFocus(ctx.panel);
          return;
        }
        targetId = pickedEdge.edgeId;
        const found = edges.find((e) => e.id === targetId);
        if (found) currentValue = found.label ?? "";
      }
      const nextLabel = await vscode3.window.showInputBox({
        title: "Vizion: Edit Relation Label",
        value: currentValue ?? "",
        prompt: "Enter relation label (leave empty to clear)"
      });
      ctx.restoreFocus(ctx.panel);
      if (nextLabel === void 0) return;
      if (ctx.document.version !== ctx.expectedVersion) {
        void vscode3.window.showWarningMessage("Document changed while input box was open. Edit cancelled.");
        return;
      }
      await ctx.enqueueOperation(async () => {
        await ctx.executeOperation(ctx.panel, `rename-edge-${targetId}`, ctx.expectedVersion, {
          type: "uml.updateEdge",
          edgeId: targetId,
          label: nextLabel.trim()
        });
      });
      break;
    }
    case "documentTitle": {
      const nextTitle = await vscode3.window.showInputBox({
        title: "Vizion: Rename Document Title",
        value: currentValue ?? doc?.title ?? "",
        prompt: "Enter new diagram title",
        validateInput: (v) => !v.trim() ? "Title cannot be empty." : void 0
      });
      ctx.restoreFocus(ctx.panel);
      if (!nextTitle || !nextTitle.trim()) return;
      if (ctx.document.version !== ctx.expectedVersion) {
        void vscode3.window.showWarningMessage("Document changed while input box was open. Edit cancelled.");
        return;
      }
      await ctx.enqueueOperation(async () => {
        await ctx.executeOperation(ctx.panel, "rename-doc", ctx.expectedVersion, {
          type: "uml.updateMetadata",
          title: nextTitle.trim()
        });
      });
      break;
    }
    case "attribute": {
      const candidateNodes = doc?.nodes.filter((n) => n.kind === "class" || n.attributes && n.attributes.length > 0) ?? [];
      if (candidateNodes.length === 0) {
        void vscode3.window.showInformationMessage("No classes with attributes found in diagram.");
        ctx.restoreFocus(ctx.panel);
        return;
      }
      let targetNode = candidateNodes.find((n) => n.id === targetId);
      if (!targetNode) {
        const picked = await vscode3.window.showQuickPick(
          candidateNodes.map((n) => ({ label: n.name, description: `${n.attributes?.length ?? 0} attributes`, node: n })),
          { title: "Vizion: Select Class Containing Attribute" }
        );
        if (!picked) {
          ctx.restoreFocus(ctx.panel);
          return;
        }
        targetNode = picked.node;
        targetId = targetNode.id;
      }
      const attrs = targetNode.attributes ?? [];
      let targetAttr = attrs.find((a) => a.id === memberId);
      if (!targetAttr && attrs.length > 0) {
        const pickedAttr = await vscode3.window.showQuickPick(
          attrs.map((a) => ({
            label: `${a.visibility ?? "+"} ${a.name}${a.type ? `: ${a.type}` : ""}`,
            attr: a
          })),
          { title: `Vizion: Select Attribute in "${targetNode.name}"` }
        );
        if (!pickedAttr) {
          ctx.restoreFocus(ctx.panel);
          return;
        }
        targetAttr = pickedAttr.attr;
        memberId = targetAttr.id;
      }
      const defaultAttrText = targetAttr ? `${targetAttr.visibility ?? "+"} ${targetAttr.name}${targetAttr.type ? `: ${targetAttr.type}` : ""}` : "+ id: string";
      const nextAttrText = await vscode3.window.showInputBox({
        title: `Vizion: Edit Attribute (${targetNode.name})`,
        value: currentValue ?? defaultAttrText,
        prompt: "Format: [+|-|#|~] name: type (e.g. + totalAmount: number)",
        validateInput: (v) => !ATTR_REGEX.test(v.trim()) ? "Invalid attribute syntax. Example: + name: string" : void 0
      });
      ctx.restoreFocus(ctx.panel);
      if (!nextAttrText || !nextAttrText.trim()) return;
      if (ctx.document.version !== ctx.expectedVersion) {
        void vscode3.window.showWarningMessage("Document changed while input box was open. Edit cancelled.");
        return;
      }
      const parsedAttrs = parseAttributesFromText(nextAttrText.trim(), targetId, targetAttr ? [targetAttr] : []);
      if (parsedAttrs.length === 0) return;
      const newAttr = parsedAttrs[0];
      const updatedList = attrs.map((a) => a.id === memberId ? newAttr : a);
      if (!attrs.some((a) => a.id === memberId)) {
        updatedList.push(newAttr);
      }
      await ctx.enqueueOperation(async () => {
        await ctx.executeOperation(ctx.panel, `update-attr-${targetId}`, ctx.expectedVersion, {
          type: "uml.updateNode",
          nodeId: targetId,
          attributes: updatedList
        });
      });
      break;
    }
    case "operation": {
      const candidateNodes = doc?.nodes.filter((n) => n.kind === "class" || n.operations && n.operations.length > 0) ?? [];
      if (candidateNodes.length === 0) {
        void vscode3.window.showInformationMessage("No classes with operations found in diagram.");
        ctx.restoreFocus(ctx.panel);
        return;
      }
      let targetNode = candidateNodes.find((n) => n.id === targetId);
      if (!targetNode) {
        const picked = await vscode3.window.showQuickPick(
          candidateNodes.map((n) => ({ label: n.name, description: `${n.operations?.length ?? 0} operations`, node: n })),
          { title: "Vizion: Select Class Containing Operation" }
        );
        if (!picked) {
          ctx.restoreFocus(ctx.panel);
          return;
        }
        targetNode = picked.node;
        targetId = targetNode.id;
      }
      const ops = targetNode.operations ?? [];
      let targetOp = ops.find((o) => o.id === memberId);
      if (!targetOp && ops.length > 0) {
        const pickedOp = await vscode3.window.showQuickPick(
          ops.map((o) => ({
            label: `${o.visibility ?? "+"} ${o.name}${o.signature ?? "()"}${o.returnType ? `: ${o.returnType}` : ""}`,
            op: o
          })),
          { title: `Vizion: Select Operation in "${targetNode.name}"` }
        );
        if (!pickedOp) {
          ctx.restoreFocus(ctx.panel);
          return;
        }
        targetOp = pickedOp.op;
        memberId = targetOp.id;
      }
      const defaultOpText = targetOp ? `${targetOp.visibility ?? "+"} ${targetOp.name}${targetOp.signature ?? "()"}${targetOp.returnType ? `: ${targetOp.returnType}` : ""}` : "+ execute(): void";
      const nextOpText = await vscode3.window.showInputBox({
        title: `Vizion: Edit Operation (${targetNode.name})`,
        value: currentValue ?? defaultOpText,
        prompt: "Format: [+|-|#|~] name(param: type): returnType (e.g. + calculateTotal(discount: number): number)",
        validateInput: (v) => !OP_REGEX.test(v.trim()) ? "Invalid operation syntax. Example: + execute(): void" : void 0
      });
      ctx.restoreFocus(ctx.panel);
      if (!nextOpText || !nextOpText.trim()) return;
      if (ctx.document.version !== ctx.expectedVersion) {
        void vscode3.window.showWarningMessage("Document changed while input box was open. Edit cancelled.");
        return;
      }
      const parsedOps = parseOperationsFromText(nextOpText.trim(), targetId, targetOp ? [targetOp] : []);
      if (parsedOps.length === 0) return;
      const newOp = parsedOps[0];
      const updatedList = ops.map((o) => o.id === memberId ? newOp : o);
      if (!ops.some((o) => o.id === memberId)) {
        updatedList.push(newOp);
      }
      await ctx.enqueueOperation(async () => {
        await ctx.executeOperation(ctx.panel, `update-op-${targetId}`, ctx.expectedVersion, {
          type: "uml.updateNode",
          nodeId: targetId,
          operations: updatedList
        });
      });
      break;
    }
  }
}

// src/extension/commands/canvas-commands.ts
function registerCanvasCommands(context, registry) {
  context.subscriptions.push(
    vscode4.commands.registerCommand("vizion.initializeCurrentDocument", async () => {
      const active = registry.getActiveCoordinator();
      if (active) {
        await active.explicitlyInitializeEmptyDocument();
        return;
      }
      const editor = vscode4.window.activeTextEditor;
      if (editor && editor.document.fileName.endsWith(".viz")) {
        const coord = registry.acquire(editor.document, "uml");
        await coord.explicitlyInitializeEmptyDocument();
      } else {
        void vscode4.window.showInformationMessage("Focus an empty .viz document first.");
      }
    }),
    vscode4.commands.registerCommand("vizion.openCurrentAsText", async () => {
      const active = registry.getActiveCoordinator();
      if (active) {
        await vscode4.commands.executeCommand("vscode.openWith", active.document.uri, "default");
      }
    }),
    vscode4.commands.registerCommand("vizion.fitCanvasToContent", () => {
      const active = registry.getActiveCoordinator();
      active?.broadcastCommand("fitContent", true);
    }),
    vscode4.commands.registerCommand("vizion.resetCanvasZoom", () => {
      const active = registry.getActiveCoordinator();
      active?.broadcastCommand("resetZoom", true);
    }),
    vscode4.commands.registerCommand("vizion.addNode", async () => {
      const active = registry.getActiveCoordinator();
      if (!active) {
        void vscode4.window.showInformationMessage("Open or focus a Vizion UML editor first.");
        return;
      }
      await promptAddUmlNodeFlow(active.createFlowContext());
    }),
    vscode4.commands.registerCommand("vizion.addRelation", async () => {
      const active = registry.getActiveCoordinator();
      if (!active) {
        void vscode4.window.showInformationMessage("Open or focus a Vizion UML editor first.");
        return;
      }
      await promptAddUmlEdgeFlow(active.createFlowContext());
    }),
    vscode4.commands.registerCommand("vizion.renameEntity", async () => {
      const active = registry.getActiveCoordinator();
      if (!active) {
        void vscode4.window.showInformationMessage("Open or focus a Vizion UML editor first.");
        return;
      }
      await promptRenameEntityFlow(active.createFlowContext());
    })
  );
}

// src/extension/commands/create-diagram.ts
var path = __toESM(require("path"));
var vscode5 = __toESM(require("vscode"));

// package.json
var package_default = {
  name: "vizion",
  displayName: "Vizion",
  description: "Custom UML editor for .viz JSON documents with embedded AI guidance.",
  version: "0.3.0",
  publisher: "Vizionary",
  license: "MIT",
  engines: {
    vscode: "^1.90.0"
  },
  categories: [
    "Visualization",
    "Custom Editors",
    "Other"
  ],
  activationEvents: [
    "onCustomEditor:vizion.uml",
    "onCommand:vizion.newUmlDiagram",
    "onCommand:vizion.initializeCurrentDocument",
    "onCommand:vizion.addNode",
    "onCommand:vizion.addRelation",
    "onCommand:vizion.renameEntity"
  ],
  main: "./dist/extension.cjs",
  contributes: {
    languages: [
      {
        id: "json",
        filenamePatterns: [
          "*.viz"
        ]
      }
    ],
    jsonValidation: [
      {
        fileMatch: "*.viz",
        url: "./schemas/uml.schema.json"
      }
    ],
    customEditors: [
      {
        viewType: "vizion.uml",
        displayName: "UML Editor",
        priority: "default",
        selector: [
          {
            filenamePattern: "*.viz"
          }
        ]
      }
    ],
    commands: [
      {
        command: "vizion.newUmlDiagram",
        title: "New UML Diagram",
        category: "Vizion",
        icon: "$(type-hierarchy-sub)"
      },
      {
        command: "vizion.initializeCurrentDocument",
        title: "Initialize Current Empty Vizion Document",
        category: "Vizion",
        icon: "$(sparkle)"
      },
      {
        command: "vizion.openCurrentAsText",
        title: "Open Current Vizion Document as JSON Text",
        category: "Vizion",
        icon: "$(code)"
      },
      {
        command: "vizion.fitCanvasToContent",
        title: "Fit Canvas to Content",
        category: "Vizion",
        icon: "$(screen-full)"
      },
      {
        command: "vizion.resetCanvasZoom",
        title: "Reset Canvas Zoom (100%)",
        category: "Vizion",
        icon: "$(zoom-in)"
      },
      {
        command: "vizion.addNode",
        title: "Add UML Node",
        category: "Vizion",
        icon: "$(add)"
      },
      {
        command: "vizion.addRelation",
        title: "Add UML Relation",
        category: "Vizion",
        icon: "$(git-commit)"
      },
      {
        command: "vizion.renameEntity",
        title: "Rename UML Entity",
        category: "Vizion",
        icon: "$(edit)"
      }
    ],
    menus: {
      "editor/title": [
        {
          command: "vizion.openCurrentAsText",
          when: "activeCustomEditorId == 'vizion.uml'",
          group: "navigation@1"
        },
        {
          command: "vizion.fitCanvasToContent",
          when: "activeCustomEditorId == 'vizion.uml'",
          group: "navigation@2"
        }
      ]
    }
  },
  scripts: {
    build: "node scripts/build.mjs",
    watch: "node scripts/build.mjs --watch",
    typecheck: "tsc --noEmit",
    check: "svelte-check --tsconfig ./tsconfig.json",
    test: "vitest run",
    package: "vsce package --no-dependencies --allow-missing-repository"
  },
  dependencies: {
    "jsonc-parser": "^3.3.1"
  },
  devDependencies: {
    "@types/node": "^22.0.0",
    "@types/vscode": "^1.90.0",
    "@vscode/vsce": "^3.2.0",
    esbuild: "^0.24.0",
    "esbuild-svelte": "^0.8.2",
    svelte: "^5.15.0",
    "svelte-check": "^4.1.0",
    typescript: "^5.7.0",
    vitest: "^2.1.0"
  }
};

// src/shared/documents/version.ts
var EXTENSION_VERSION = package_default.version;

// src/shared/documents/templates.ts
function deriveDefaultTitle(filenameOrPath, _kind = "uml") {
  const base = filenameOrPath.split(/[\\/]/).pop() ?? "";
  const stripped = base.replace(/\.uml\.viz$/i, "").replace(/\.viz$/i, "").trim();
  if (!stripped) {
    return "Domain";
  }
  return stripped.split(/[-_.\s]+/).filter(Boolean).map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}
function createDefaultUmlDocument(title = "Domain", version = EXTENSION_VERSION) {
  return {
    format: "vizion",
    version,
    kind: "uml",
    title: title || "Domain",
    description: "Describe classes, notes, shapes, frames, and explicitly typed relationships.",
    ai: {
      interpretation: [
        'Document Structure: JSON document with schema version tracking. Root fields are: "format" ("vizion"), "version" (matching extension version), "kind" ("uml"), "title" (string), "description" (optional/recommended string describing diagram context), "defaultRouting" ("orthogonal" | "straight" | "bezier"), "ai" (guidance object with "interpretation", "editingRules"), "nodes" (array), "edges" (array), and "layout" (object with "nodes" and "edges").',
        'Node Types & Properties ("nodes[]"): Each node must have "id" (unique string) and "kind" ("class" | "shape" | "note" | "frame"). Optional common fields: "name" (display label string), "stereotype" (architectural role string, e.g. "entity", "service", "value", "aggregate", "controller"). For "note" nodes, prose is stored in "text" (markdown/plain text).',
        'Frame Containers ("kind": "frame"): Visual container grouping enclosed elements with semi-transparent background. The label floats above the top-left corner. Contained element node IDs are listed in "children". Contained elements move together with the frame. An element is added to a frame when dragged into it with the cursor over the frame, which auto-resizes the frame to fit it. Dragging an element already inside the frame does not auto-resize the frame unless Shift is held (allowing elements to be dragged out of the frame). If the cursor is not over the frame, the element can overlap without being inside. Relations can enter and leave frames and are rendered on top of the frame. Frames cannot have relations of their own.',
        'Geometric Shapes ("kind": "shape"): Must specify "shape" geometry as one of: "ellipse" | "rectangle" | "rhombus" | "trapezoid" | "parallelogram". The node "name" is rendered as the centered label.',
        'Class Members & Compartments ("kind": "class"): Supports "attributes" array and "operations" array. Section visibility can be toggled via boolean flags "showAttributes" and "showOperations" (default true).',
        'Attributes Format: Each attribute object requires "id" (unique string), "visibility" (one of: "+" [public], "-" [private], "#" [protected], "~" [package/internal]), "name" (string), and "type" (type string e.g. "string", "number", "Date").',
        'Operations Format: Each operation object requires "id" (unique string), "visibility" ("+" | "-" | "#" | "~"), "name" (method name string), "returnType" (return type string, e.g. "void", "Promise<T>", "boolean"), "signature" (e.g. "(id: string, count: number)"), and "parameters" array of argument objects ({ "id": string, "name": string, "type": string }).',
        'Relationships ("edges[]"): Defines connections between nodes. Required fields: "id" (unique string), "kind" (relationship semantic type: "association" | "dependency" | "generalization" | "realization" | "aggregation" | "composition"), "source" ({ "nodeId": string, "multiplicity"?: string }), and "target" ({ "nodeId": string, "multiplicity"?: string }). Optional "label" (string rendered at midpoint). Frames cannot be endpoints for edges.',
        'Endpoint Multiplicities: Expressed as cardinality strings on endpoints: "source.multiplicity" and "target.multiplicity" (e.g. "1", "*", "0..1", "1..*", "0..n", or omit/empty if none).',
        'Visual Presentation ("edge.visual"): Optional visual options: "line" ("solid" | "dashed"), "routing" ("straight" | "bezier" | "orthogonal"), and endpoint decorations "start" / "end" ({ "shape": "none" | "circle" | "diamond" | "square" | "triangle" | "open-arrow", "fill"?: "hollow" | "filled", "size"?: number }). Only closed shapes support "fill". Standard semantic defaults: generalization = hollow triangle end; realization = dashed with hollow triangle end; aggregation = hollow diamond start; composition = filled diamond start; dependency = dashed with open-arrow end; association = solid line with none ends.',
        'Canvas Layout ("layout.nodes"): Bounding box for every node keyed by nodeId: { "x": number, "y": number, "width": number, "height": number }. Coordinates snap to a 20px grid (multiples of 20). Width >= 100, height >= 60 for classes; width >= 80, height >= 50 for shapes; width >= 120, height >= 60 for notes; width >= 160, height >= 100 for frames.',
        "Architectural Model Scope: This diagram is a selective architectural view. Absence of elements or relationships does not imply absence in the underlying implementation code."
      ],
      editingRules: [
        "Strict JSON Conformity: Output strictly valid standard JSON with 2-space indentation. Never use JavaScript comments, trailing commas, single quotes, or unquoted identifiers.",
        'Document Versioning: The root "version" field must match the Vizion extension version. Do NOT output alternate version fields like "schemaVersion", "formatVersion", or "instructionsVersion".',
        'Referential Integrity: Every "source.nodeId" and "target.nodeId" in "edges[]" MUST exactly match an existing node "id" in "nodes[]", and cannot reference a "frame" node. When removing a node from "nodes[]", you must atomically delete all edges referencing its ID.',
        `Frame Containment & Integrity: Frame nodes cannot have edges of their own. Every node listed in a frame's "children" MUST exist in "nodes[]". Elements can overlap a frame without being in its children; a node is only contained in a frame if listed in its "children", which happens when an element is dragged into the frame with the cursor hovering over it.`,
        'Layout Synchronization: Every node added to "nodes[]" MUST have a corresponding bounding box in "layout.nodes[nodeId]" ({ "x": number, "y": number, "width": number, "height": number }) aligned to a 20px grid. When deleting a node, delete its layout entry.',
        "Node Spacing: Node elements MUST be separated by at least 10 grid cells (200px) edge-to-edge. Never place nodes closer than 10 grid cells horizontally or vertically. Overlapping or tightly packed nodes make the diagram unreadable; leave generous whitespace between unrelated nodes and between frames.",
        'Preserve Existing Identifiers: Never alter existing "id" strings when updating nodes, edges, attributes, operations, or parameters. When creating new entities, generate clean, unique kebab-case IDs (e.g., "node-order-service", "edge-order-payment-1", "order-attr-status", "order-op-cancel", "cancel-arg-reason").',
        'Allowed Enums & Data Values: Strictly use only documented enum values \u2014 node kinds: "class"|"shape"|"note"|"frame"; shapes: "ellipse"|"rectangle"|"rhombus"|"trapezoid"|"parallelogram"; edge kinds: "association"|"dependency"|"generalization"|"realization"|"aggregation"|"composition"; visibilities: "+"|"-"|"#"|"~"; endpoint shapes: "none"|"circle"|"diamond"|"square"|"triangle"|"open-arrow"; fills: "hollow"|"filled".',
        'Preserve Unknown & Custom Fields: Preserve all unrecognized top-level and nested properties, annotations, extension keys, and this "ai" section intact across edits.',
        "Non-Interference with Source Code: Do not modify repository application source code when asked to edit this architecture diagram, unless the user explicitly requests code changes."
      ]
    },
    defaultRouting: "orthogonal",
    nodes: [],
    edges: [],
    layout: {
      nodes: {},
      edges: {}
    }
  };
}
function serializeDefaultDocument(kind, filenameOrPath) {
  const title = deriveDefaultTitle(filenameOrPath, kind);
  const doc = createDefaultUmlDocument(title);
  return JSON.stringify(doc, null, 2) + "\n";
}
function isEmptyOrWhitespaceDocument(text) {
  const withoutBom = text.replace(/^\uFEFF/, "");
  return withoutBom.trim().length === 0;
}

// src/extension/commands/create-diagram.ts
async function resolveTargetFolder(contextUri) {
  if (contextUri) {
    try {
      const stat = await vscode5.workspace.fs.stat(contextUri);
      if ((stat.type & vscode5.FileType.Directory) !== 0) {
        return contextUri;
      }
      return vscode5.Uri.file(path.dirname(contextUri.fsPath));
    } catch {
    }
  }
  const firstWorkspace = vscode5.workspace.workspaceFolders?.[0];
  if (firstWorkspace) {
    return vscode5.Uri.joinPath(firstWorkspace.uri, ".vizion", "architecture");
  }
  const picked = await vscode5.window.showOpenDialog({
    canSelectFiles: false,
    canSelectFolders: true,
    canSelectMany: false,
    openLabel: "Select Folder for Vizion File"
  });
  return picked?.[0];
}
async function createAndOpenVizionFile(contextUri) {
  const suffix = ".viz";
  const defaultBase = "domain";
  const entered = await vscode5.window.showInputBox({
    title: "Vizion: New UML Diagram",
    prompt: `Enter filename (automatically appends ${suffix} if omitted)`,
    value: `${defaultBase}${suffix}`,
    validateInput: (val) => {
      const trimmed = val.trim();
      if (!trimmed) return "Filename cannot be empty.";
      if (/[<>:"/\\|?*]/.test(trimmed)) return "Filename contains invalid path characters.";
      return void 0;
    }
  });
  if (!entered) return;
  let fileName = entered.trim();
  if (!fileName.toLowerCase().endsWith(suffix)) {
    fileName = `${fileName}${suffix}`;
  }
  const folderUri = await resolveTargetFolder(contextUri);
  if (!folderUri) return;
  await vscode5.workspace.fs.createDirectory(folderUri);
  const fileUri = vscode5.Uri.joinPath(folderUri, fileName);
  try {
    await vscode5.workspace.fs.stat(fileUri);
    const overwrite = await vscode5.window.showWarningMessage(
      `File "${fileName}" already exists. Open existing file instead?`,
      "Open Existing",
      "Cancel"
    );
    if (overwrite !== "Open Existing") return;
  } catch {
    const initialJson = serializeDefaultDocument("uml", fileName);
    await vscode5.workspace.fs.writeFile(fileUri, Buffer.from(initialJson, "utf8"));
  }
  await vscode5.commands.executeCommand("vscode.openWith", fileUri, "vizion.uml");
}

// src/extension/commands/index.ts
function registerVizionCommands(context, registry) {
  context.subscriptions.push(
    vscode6.commands.registerCommand("vizion.newUmlDiagram", async (uri) => {
      await createAndOpenVizionFile(uri);
    })
  );
  registerCanvasCommands(context, registry);
}

// src/extension/coordinator/diagnostics-manager.ts
var vscode7 = __toESM(require("vscode"));
var VizionDiagnosticsManager = class {
  collection;
  constructor() {
    this.collection = vscode7.languages.createDiagnosticCollection("vizion");
  }
  updateDiagnostics(document, issues) {
    if (issues.length === 0) {
      this.collection.delete(document.uri);
      return;
    }
    const text = document.getText();
    const diagnostics = issues.map((issue) => {
      const range = this.resolveIssueRange(document, text, issue);
      const severity = issue.severity === "error" ? vscode7.DiagnosticSeverity.Error : vscode7.DiagnosticSeverity.Warning;
      const diag = new vscode7.Diagnostic(
        range,
        `[${issue.path}] ${issue.message}`,
        severity
      );
      diag.source = "Vizion";
      return diag;
    });
    this.collection.set(document.uri, diagnostics);
  }
  clearDiagnostics(uri) {
    this.collection.delete(uri);
  }
  resolveIssueRange(document, text, issue) {
    if (issue.line !== void 0 && issue.line >= 1) {
      const zeroLine = Math.min(
        Math.max(0, issue.line - 1),
        Math.max(0, document.lineCount - 1)
      );
      const zeroCol = Math.max(0, (issue.column ?? 1) - 1);
      const pos = new vscode7.Position(zeroLine, zeroCol);
      return new vscode7.Range(pos, pos.translate(0, 1));
    }
    const tailKey = issue.path.split(".").pop()?.replace(/\[\d+\]$/, "");
    if (tailKey && tailKey !== "$") {
      const needle = `"${tailKey}"`;
      const idx = text.indexOf(needle);
      if (idx !== -1) {
        const start = document.positionAt(idx);
        const end = document.positionAt(idx + needle.length);
        return new vscode7.Range(start, end);
      }
    }
    return new vscode7.Range(new vscode7.Position(0, 0), new vscode7.Position(0, 1));
  }
  dispose() {
    this.collection.dispose();
  }
};

// src/extension/coordinator/document-coordinator.ts
var vscode10 = __toESM(require("vscode"));

// node_modules/jsonc-parser/lib/esm/impl/scanner.js
function createScanner(text, ignoreTrivia = false) {
  const len = text.length;
  let pos = 0, value = "", tokenOffset = 0, token = 16, lineNumber = 0, lineStartOffset = 0, tokenLineStartOffset = 0, prevTokenLineStartOffset = 0, scanError = 0;
  function scanHexDigits(count, exact) {
    let digits = 0;
    let value2 = 0;
    while (digits < count || !exact) {
      let ch = text.charCodeAt(pos);
      if (ch >= 48 && ch <= 57) {
        value2 = value2 * 16 + ch - 48;
      } else if (ch >= 65 && ch <= 70) {
        value2 = value2 * 16 + ch - 65 + 10;
      } else if (ch >= 97 && ch <= 102) {
        value2 = value2 * 16 + ch - 97 + 10;
      } else {
        break;
      }
      pos++;
      digits++;
    }
    if (digits < count) {
      value2 = -1;
    }
    return value2;
  }
  function setPosition(newPosition) {
    pos = newPosition;
    value = "";
    tokenOffset = 0;
    token = 16;
    scanError = 0;
  }
  function scanNumber() {
    let start = pos;
    if (text.charCodeAt(pos) === 48) {
      pos++;
    } else {
      pos++;
      while (pos < text.length && isDigit(text.charCodeAt(pos))) {
        pos++;
      }
    }
    if (pos < text.length && text.charCodeAt(pos) === 46) {
      pos++;
      if (pos < text.length && isDigit(text.charCodeAt(pos))) {
        pos++;
        while (pos < text.length && isDigit(text.charCodeAt(pos))) {
          pos++;
        }
      } else {
        scanError = 3;
        return text.substring(start, pos);
      }
    }
    let end = pos;
    if (pos < text.length && (text.charCodeAt(pos) === 69 || text.charCodeAt(pos) === 101)) {
      pos++;
      if (pos < text.length && text.charCodeAt(pos) === 43 || text.charCodeAt(pos) === 45) {
        pos++;
      }
      if (pos < text.length && isDigit(text.charCodeAt(pos))) {
        pos++;
        while (pos < text.length && isDigit(text.charCodeAt(pos))) {
          pos++;
        }
        end = pos;
      } else {
        scanError = 3;
      }
    }
    return text.substring(start, end);
  }
  function scanString() {
    let result = "", start = pos;
    while (true) {
      if (pos >= len) {
        result += text.substring(start, pos);
        scanError = 2;
        break;
      }
      const ch = text.charCodeAt(pos);
      if (ch === 34) {
        result += text.substring(start, pos);
        pos++;
        break;
      }
      if (ch === 92) {
        result += text.substring(start, pos);
        pos++;
        if (pos >= len) {
          scanError = 2;
          break;
        }
        const ch2 = text.charCodeAt(pos++);
        switch (ch2) {
          case 34:
            result += '"';
            break;
          case 92:
            result += "\\";
            break;
          case 47:
            result += "/";
            break;
          case 98:
            result += "\b";
            break;
          case 102:
            result += "\f";
            break;
          case 110:
            result += "\n";
            break;
          case 114:
            result += "\r";
            break;
          case 116:
            result += "	";
            break;
          case 117:
            const ch3 = scanHexDigits(4, true);
            if (ch3 >= 0) {
              result += String.fromCharCode(ch3);
            } else {
              scanError = 4;
            }
            break;
          default:
            scanError = 5;
        }
        start = pos;
        continue;
      }
      if (ch >= 0 && ch <= 31) {
        if (isLineBreak(ch)) {
          result += text.substring(start, pos);
          scanError = 2;
          break;
        } else {
          scanError = 6;
        }
      }
      pos++;
    }
    return result;
  }
  function scanNext() {
    value = "";
    scanError = 0;
    tokenOffset = pos;
    lineStartOffset = lineNumber;
    prevTokenLineStartOffset = tokenLineStartOffset;
    if (pos >= len) {
      tokenOffset = len;
      return token = 17;
    }
    let code = text.charCodeAt(pos);
    if (isWhiteSpace(code)) {
      do {
        pos++;
        value += String.fromCharCode(code);
        code = text.charCodeAt(pos);
      } while (isWhiteSpace(code));
      return token = 15;
    }
    if (isLineBreak(code)) {
      pos++;
      value += String.fromCharCode(code);
      if (code === 13 && text.charCodeAt(pos) === 10) {
        pos++;
        value += "\n";
      }
      lineNumber++;
      tokenLineStartOffset = pos;
      return token = 14;
    }
    switch (code) {
      // tokens: []{}:,
      case 123:
        pos++;
        return token = 1;
      case 125:
        pos++;
        return token = 2;
      case 91:
        pos++;
        return token = 3;
      case 93:
        pos++;
        return token = 4;
      case 58:
        pos++;
        return token = 6;
      case 44:
        pos++;
        return token = 5;
      // strings
      case 34:
        pos++;
        value = scanString();
        return token = 10;
      // comments
      case 47:
        const start = pos - 1;
        if (text.charCodeAt(pos + 1) === 47) {
          pos += 2;
          while (pos < len) {
            if (isLineBreak(text.charCodeAt(pos))) {
              break;
            }
            pos++;
          }
          value = text.substring(start, pos);
          return token = 12;
        }
        if (text.charCodeAt(pos + 1) === 42) {
          pos += 2;
          const safeLength = len - 1;
          let commentClosed = false;
          while (pos < safeLength) {
            const ch = text.charCodeAt(pos);
            if (ch === 42 && text.charCodeAt(pos + 1) === 47) {
              pos += 2;
              commentClosed = true;
              break;
            }
            pos++;
            if (isLineBreak(ch)) {
              if (ch === 13 && text.charCodeAt(pos) === 10) {
                pos++;
              }
              lineNumber++;
              tokenLineStartOffset = pos;
            }
          }
          if (!commentClosed) {
            pos++;
            scanError = 1;
          }
          value = text.substring(start, pos);
          return token = 13;
        }
        value += String.fromCharCode(code);
        pos++;
        return token = 16;
      // numbers
      case 45:
        value += String.fromCharCode(code);
        pos++;
        if (pos === len || !isDigit(text.charCodeAt(pos))) {
          return token = 16;
        }
      // found a minus, followed by a number so
      // we fall through to proceed with scanning
      // numbers
      case 48:
      case 49:
      case 50:
      case 51:
      case 52:
      case 53:
      case 54:
      case 55:
      case 56:
      case 57:
        value += scanNumber();
        return token = 11;
      // literals and unknown symbols
      default:
        while (pos < len && isUnknownContentCharacter(code)) {
          pos++;
          code = text.charCodeAt(pos);
        }
        if (tokenOffset !== pos) {
          value = text.substring(tokenOffset, pos);
          switch (value) {
            case "true":
              return token = 8;
            case "false":
              return token = 9;
            case "null":
              return token = 7;
          }
          return token = 16;
        }
        value += String.fromCharCode(code);
        pos++;
        return token = 16;
    }
  }
  function isUnknownContentCharacter(code) {
    if (isWhiteSpace(code) || isLineBreak(code)) {
      return false;
    }
    switch (code) {
      case 125:
      case 93:
      case 123:
      case 91:
      case 34:
      case 58:
      case 44:
      case 47:
        return false;
    }
    return true;
  }
  function scanNextNonTrivia() {
    let result;
    do {
      result = scanNext();
    } while (result >= 12 && result <= 15);
    return result;
  }
  return {
    setPosition,
    getPosition: () => pos,
    scan: ignoreTrivia ? scanNextNonTrivia : scanNext,
    getToken: () => token,
    getTokenValue: () => value,
    getTokenOffset: () => tokenOffset,
    getTokenLength: () => pos - tokenOffset,
    getTokenStartLine: () => lineStartOffset,
    getTokenStartCharacter: () => tokenOffset - prevTokenLineStartOffset,
    getTokenError: () => scanError
  };
}
function isWhiteSpace(ch) {
  return ch === 32 || ch === 9;
}
function isLineBreak(ch) {
  return ch === 10 || ch === 13;
}
function isDigit(ch) {
  return ch >= 48 && ch <= 57;
}
var CharacterCodes;
(function(CharacterCodes2) {
  CharacterCodes2[CharacterCodes2["lineFeed"] = 10] = "lineFeed";
  CharacterCodes2[CharacterCodes2["carriageReturn"] = 13] = "carriageReturn";
  CharacterCodes2[CharacterCodes2["space"] = 32] = "space";
  CharacterCodes2[CharacterCodes2["_0"] = 48] = "_0";
  CharacterCodes2[CharacterCodes2["_1"] = 49] = "_1";
  CharacterCodes2[CharacterCodes2["_2"] = 50] = "_2";
  CharacterCodes2[CharacterCodes2["_3"] = 51] = "_3";
  CharacterCodes2[CharacterCodes2["_4"] = 52] = "_4";
  CharacterCodes2[CharacterCodes2["_5"] = 53] = "_5";
  CharacterCodes2[CharacterCodes2["_6"] = 54] = "_6";
  CharacterCodes2[CharacterCodes2["_7"] = 55] = "_7";
  CharacterCodes2[CharacterCodes2["_8"] = 56] = "_8";
  CharacterCodes2[CharacterCodes2["_9"] = 57] = "_9";
  CharacterCodes2[CharacterCodes2["a"] = 97] = "a";
  CharacterCodes2[CharacterCodes2["b"] = 98] = "b";
  CharacterCodes2[CharacterCodes2["c"] = 99] = "c";
  CharacterCodes2[CharacterCodes2["d"] = 100] = "d";
  CharacterCodes2[CharacterCodes2["e"] = 101] = "e";
  CharacterCodes2[CharacterCodes2["f"] = 102] = "f";
  CharacterCodes2[CharacterCodes2["g"] = 103] = "g";
  CharacterCodes2[CharacterCodes2["h"] = 104] = "h";
  CharacterCodes2[CharacterCodes2["i"] = 105] = "i";
  CharacterCodes2[CharacterCodes2["j"] = 106] = "j";
  CharacterCodes2[CharacterCodes2["k"] = 107] = "k";
  CharacterCodes2[CharacterCodes2["l"] = 108] = "l";
  CharacterCodes2[CharacterCodes2["m"] = 109] = "m";
  CharacterCodes2[CharacterCodes2["n"] = 110] = "n";
  CharacterCodes2[CharacterCodes2["o"] = 111] = "o";
  CharacterCodes2[CharacterCodes2["p"] = 112] = "p";
  CharacterCodes2[CharacterCodes2["q"] = 113] = "q";
  CharacterCodes2[CharacterCodes2["r"] = 114] = "r";
  CharacterCodes2[CharacterCodes2["s"] = 115] = "s";
  CharacterCodes2[CharacterCodes2["t"] = 116] = "t";
  CharacterCodes2[CharacterCodes2["u"] = 117] = "u";
  CharacterCodes2[CharacterCodes2["v"] = 118] = "v";
  CharacterCodes2[CharacterCodes2["w"] = 119] = "w";
  CharacterCodes2[CharacterCodes2["x"] = 120] = "x";
  CharacterCodes2[CharacterCodes2["y"] = 121] = "y";
  CharacterCodes2[CharacterCodes2["z"] = 122] = "z";
  CharacterCodes2[CharacterCodes2["A"] = 65] = "A";
  CharacterCodes2[CharacterCodes2["B"] = 66] = "B";
  CharacterCodes2[CharacterCodes2["C"] = 67] = "C";
  CharacterCodes2[CharacterCodes2["D"] = 68] = "D";
  CharacterCodes2[CharacterCodes2["E"] = 69] = "E";
  CharacterCodes2[CharacterCodes2["F"] = 70] = "F";
  CharacterCodes2[CharacterCodes2["G"] = 71] = "G";
  CharacterCodes2[CharacterCodes2["H"] = 72] = "H";
  CharacterCodes2[CharacterCodes2["I"] = 73] = "I";
  CharacterCodes2[CharacterCodes2["J"] = 74] = "J";
  CharacterCodes2[CharacterCodes2["K"] = 75] = "K";
  CharacterCodes2[CharacterCodes2["L"] = 76] = "L";
  CharacterCodes2[CharacterCodes2["M"] = 77] = "M";
  CharacterCodes2[CharacterCodes2["N"] = 78] = "N";
  CharacterCodes2[CharacterCodes2["O"] = 79] = "O";
  CharacterCodes2[CharacterCodes2["P"] = 80] = "P";
  CharacterCodes2[CharacterCodes2["Q"] = 81] = "Q";
  CharacterCodes2[CharacterCodes2["R"] = 82] = "R";
  CharacterCodes2[CharacterCodes2["S"] = 83] = "S";
  CharacterCodes2[CharacterCodes2["T"] = 84] = "T";
  CharacterCodes2[CharacterCodes2["U"] = 85] = "U";
  CharacterCodes2[CharacterCodes2["V"] = 86] = "V";
  CharacterCodes2[CharacterCodes2["W"] = 87] = "W";
  CharacterCodes2[CharacterCodes2["X"] = 88] = "X";
  CharacterCodes2[CharacterCodes2["Y"] = 89] = "Y";
  CharacterCodes2[CharacterCodes2["Z"] = 90] = "Z";
  CharacterCodes2[CharacterCodes2["asterisk"] = 42] = "asterisk";
  CharacterCodes2[CharacterCodes2["backslash"] = 92] = "backslash";
  CharacterCodes2[CharacterCodes2["closeBrace"] = 125] = "closeBrace";
  CharacterCodes2[CharacterCodes2["closeBracket"] = 93] = "closeBracket";
  CharacterCodes2[CharacterCodes2["colon"] = 58] = "colon";
  CharacterCodes2[CharacterCodes2["comma"] = 44] = "comma";
  CharacterCodes2[CharacterCodes2["dot"] = 46] = "dot";
  CharacterCodes2[CharacterCodes2["doubleQuote"] = 34] = "doubleQuote";
  CharacterCodes2[CharacterCodes2["minus"] = 45] = "minus";
  CharacterCodes2[CharacterCodes2["openBrace"] = 123] = "openBrace";
  CharacterCodes2[CharacterCodes2["openBracket"] = 91] = "openBracket";
  CharacterCodes2[CharacterCodes2["plus"] = 43] = "plus";
  CharacterCodes2[CharacterCodes2["slash"] = 47] = "slash";
  CharacterCodes2[CharacterCodes2["formFeed"] = 12] = "formFeed";
  CharacterCodes2[CharacterCodes2["tab"] = 9] = "tab";
})(CharacterCodes || (CharacterCodes = {}));

// node_modules/jsonc-parser/lib/esm/impl/string-intern.js
var cachedSpaces = new Array(20).fill(0).map((_, index) => {
  return " ".repeat(index);
});
var maxCachedValues = 200;
var cachedBreakLinesWithSpaces = {
  " ": {
    "\n": new Array(maxCachedValues).fill(0).map((_, index) => {
      return "\n" + " ".repeat(index);
    }),
    "\r": new Array(maxCachedValues).fill(0).map((_, index) => {
      return "\r" + " ".repeat(index);
    }),
    "\r\n": new Array(maxCachedValues).fill(0).map((_, index) => {
      return "\r\n" + " ".repeat(index);
    })
  },
  "	": {
    "\n": new Array(maxCachedValues).fill(0).map((_, index) => {
      return "\n" + "	".repeat(index);
    }),
    "\r": new Array(maxCachedValues).fill(0).map((_, index) => {
      return "\r" + "	".repeat(index);
    }),
    "\r\n": new Array(maxCachedValues).fill(0).map((_, index) => {
      return "\r\n" + "	".repeat(index);
    })
  }
};
var supportedEols = ["\n", "\r", "\r\n"];

// node_modules/jsonc-parser/lib/esm/impl/format.js
function format(documentText, range, options) {
  let initialIndentLevel;
  let formatText;
  let formatTextStart;
  let rangeStart;
  let rangeEnd;
  if (range) {
    rangeStart = range.offset;
    rangeEnd = rangeStart + range.length;
    formatTextStart = rangeStart;
    while (formatTextStart > 0 && !isEOL(documentText, formatTextStart - 1)) {
      formatTextStart--;
    }
    let endOffset = rangeEnd;
    while (endOffset < documentText.length && !isEOL(documentText, endOffset)) {
      endOffset++;
    }
    formatText = documentText.substring(formatTextStart, endOffset);
    initialIndentLevel = computeIndentLevel(formatText, options);
  } else {
    formatText = documentText;
    initialIndentLevel = 0;
    formatTextStart = 0;
    rangeStart = 0;
    rangeEnd = documentText.length;
  }
  const eol = getEOL(options, documentText);
  const eolFastPathSupported = supportedEols.includes(eol);
  let numberLineBreaks = 0;
  let indentLevel = 0;
  let indentValue;
  if (options.insertSpaces) {
    indentValue = cachedSpaces[options.tabSize || 4] ?? repeat(cachedSpaces[1], options.tabSize || 4);
  } else {
    indentValue = "	";
  }
  const indentType = indentValue === "	" ? "	" : " ";
  let scanner = createScanner(formatText, false);
  let hasError = false;
  function newLinesAndIndent() {
    if (numberLineBreaks > 1) {
      return repeat(eol, numberLineBreaks) + repeat(indentValue, initialIndentLevel + indentLevel);
    }
    const amountOfSpaces = indentValue.length * (initialIndentLevel + indentLevel);
    if (!eolFastPathSupported || amountOfSpaces > cachedBreakLinesWithSpaces[indentType][eol].length) {
      return eol + repeat(indentValue, initialIndentLevel + indentLevel);
    }
    if (amountOfSpaces <= 0) {
      return eol;
    }
    return cachedBreakLinesWithSpaces[indentType][eol][amountOfSpaces];
  }
  function scanNext() {
    let token = scanner.scan();
    numberLineBreaks = 0;
    while (token === 15 || token === 14) {
      if (token === 14 && options.keepLines) {
        numberLineBreaks += 1;
      } else if (token === 14) {
        numberLineBreaks = 1;
      }
      token = scanner.scan();
    }
    hasError = token === 16 || scanner.getTokenError() !== 0;
    return token;
  }
  const editOperations = [];
  function addEdit(text, startOffset, endOffset) {
    if (!hasError && (!range || startOffset < rangeEnd && endOffset > rangeStart) && documentText.substring(startOffset, endOffset) !== text) {
      editOperations.push({ offset: startOffset, length: endOffset - startOffset, content: text });
    }
  }
  let firstToken = scanNext();
  if (options.keepLines && numberLineBreaks > 0) {
    addEdit(repeat(eol, numberLineBreaks), 0, 0);
  }
  if (firstToken !== 17) {
    let firstTokenStart = scanner.getTokenOffset() + formatTextStart;
    let initialIndent = indentValue.length * initialIndentLevel < 20 && options.insertSpaces ? cachedSpaces[indentValue.length * initialIndentLevel] : repeat(indentValue, initialIndentLevel);
    addEdit(initialIndent, formatTextStart, firstTokenStart);
  }
  while (firstToken !== 17) {
    let firstTokenEnd = scanner.getTokenOffset() + scanner.getTokenLength() + formatTextStart;
    let secondToken = scanNext();
    let replaceContent = "";
    let needsLineBreak = false;
    while (numberLineBreaks === 0 && (secondToken === 12 || secondToken === 13)) {
      let commentTokenStart = scanner.getTokenOffset() + formatTextStart;
      addEdit(cachedSpaces[1], firstTokenEnd, commentTokenStart);
      firstTokenEnd = scanner.getTokenOffset() + scanner.getTokenLength() + formatTextStart;
      needsLineBreak = secondToken === 12;
      replaceContent = needsLineBreak ? newLinesAndIndent() : "";
      secondToken = scanNext();
    }
    if (secondToken === 2) {
      if (firstToken !== 1) {
        indentLevel--;
      }
      ;
      if (options.keepLines && numberLineBreaks > 0 || !options.keepLines && firstToken !== 1) {
        replaceContent = newLinesAndIndent();
      } else if (options.keepLines) {
        replaceContent = cachedSpaces[1];
      }
    } else if (secondToken === 4) {
      if (firstToken !== 3) {
        indentLevel--;
      }
      ;
      if (options.keepLines && numberLineBreaks > 0 || !options.keepLines && firstToken !== 3) {
        replaceContent = newLinesAndIndent();
      } else if (options.keepLines) {
        replaceContent = cachedSpaces[1];
      }
    } else {
      switch (firstToken) {
        case 3:
        case 1:
          indentLevel++;
          if (options.keepLines && numberLineBreaks > 0 || !options.keepLines) {
            replaceContent = newLinesAndIndent();
          } else {
            replaceContent = cachedSpaces[1];
          }
          break;
        case 5:
          if (options.keepLines && numberLineBreaks > 0 || !options.keepLines) {
            replaceContent = newLinesAndIndent();
          } else {
            replaceContent = cachedSpaces[1];
          }
          break;
        case 12:
          replaceContent = newLinesAndIndent();
          break;
        case 13:
          if (numberLineBreaks > 0) {
            replaceContent = newLinesAndIndent();
          } else if (!needsLineBreak) {
            replaceContent = cachedSpaces[1];
          }
          break;
        case 6:
          if (options.keepLines && numberLineBreaks > 0) {
            replaceContent = newLinesAndIndent();
          } else if (!needsLineBreak) {
            replaceContent = cachedSpaces[1];
          }
          break;
        case 10:
          if (options.keepLines && numberLineBreaks > 0) {
            replaceContent = newLinesAndIndent();
          } else if (secondToken === 6 && !needsLineBreak) {
            replaceContent = "";
          }
          break;
        case 7:
        case 8:
        case 9:
        case 11:
        case 2:
        case 4:
          if (options.keepLines && numberLineBreaks > 0) {
            replaceContent = newLinesAndIndent();
          } else {
            if ((secondToken === 12 || secondToken === 13) && !needsLineBreak) {
              replaceContent = cachedSpaces[1];
            } else if (secondToken !== 5 && secondToken !== 17) {
              hasError = true;
            }
          }
          break;
        case 16:
          hasError = true;
          break;
      }
      if (numberLineBreaks > 0 && (secondToken === 12 || secondToken === 13)) {
        replaceContent = newLinesAndIndent();
      }
    }
    if (secondToken === 17) {
      if (options.keepLines && numberLineBreaks > 0) {
        replaceContent = newLinesAndIndent();
      } else {
        replaceContent = options.insertFinalNewline ? eol : "";
      }
    }
    const secondTokenStart = scanner.getTokenOffset() + formatTextStart;
    addEdit(replaceContent, firstTokenEnd, secondTokenStart);
    firstToken = secondToken;
  }
  return editOperations;
}
function repeat(s, count) {
  let result = "";
  for (let i = 0; i < count; i++) {
    result += s;
  }
  return result;
}
function computeIndentLevel(content, options) {
  let i = 0;
  let nChars = 0;
  const tabSize = options.tabSize || 4;
  while (i < content.length) {
    let ch = content.charAt(i);
    if (ch === cachedSpaces[1]) {
      nChars++;
    } else if (ch === "	") {
      nChars += tabSize;
    } else {
      break;
    }
    i++;
  }
  return Math.floor(nChars / tabSize);
}
function getEOL(options, text) {
  for (let i = 0; i < text.length; i++) {
    const ch = text.charAt(i);
    if (ch === "\r") {
      if (i + 1 < text.length && text.charAt(i + 1) === "\n") {
        return "\r\n";
      }
      return "\r";
    } else if (ch === "\n") {
      return "\n";
    }
  }
  return options && options.eol || "\n";
}
function isEOL(text, offset) {
  return "\r\n".indexOf(text.charAt(offset)) !== -1;
}

// node_modules/jsonc-parser/lib/esm/impl/parser.js
var ParseOptions;
(function(ParseOptions2) {
  ParseOptions2.DEFAULT = {
    allowTrailingComma: false
  };
})(ParseOptions || (ParseOptions = {}));
function parseTree(text, errors = [], options = ParseOptions.DEFAULT) {
  let currentParent = { type: "array", offset: -1, length: -1, children: [], parent: void 0 };
  function ensurePropertyComplete(endOffset) {
    if (currentParent.type === "property") {
      currentParent.length = endOffset - currentParent.offset;
      currentParent = currentParent.parent;
    }
  }
  function onValue(valueNode) {
    currentParent.children.push(valueNode);
    return valueNode;
  }
  const visitor = {
    onObjectBegin: (offset) => {
      currentParent = onValue({ type: "object", offset, length: -1, parent: currentParent, children: [] });
    },
    onObjectProperty: (name, offset, length) => {
      currentParent = onValue({ type: "property", offset, length: -1, parent: currentParent, children: [] });
      currentParent.children.push({ type: "string", value: name, offset, length, parent: currentParent });
    },
    onObjectEnd: (offset, length) => {
      ensurePropertyComplete(offset + length);
      currentParent.length = offset + length - currentParent.offset;
      currentParent = currentParent.parent;
      ensurePropertyComplete(offset + length);
    },
    onArrayBegin: (offset, length) => {
      currentParent = onValue({ type: "array", offset, length: -1, parent: currentParent, children: [] });
    },
    onArrayEnd: (offset, length) => {
      currentParent.length = offset + length - currentParent.offset;
      currentParent = currentParent.parent;
      ensurePropertyComplete(offset + length);
    },
    onLiteralValue: (value, offset, length) => {
      onValue({ type: getNodeType(value), offset, length, parent: currentParent, value });
      ensurePropertyComplete(offset + length);
    },
    onSeparator: (sep, offset, length) => {
      if (currentParent.type === "property") {
        if (sep === ":") {
          currentParent.colonOffset = offset;
        } else if (sep === ",") {
          ensurePropertyComplete(offset);
        }
      }
    },
    onError: (error, offset, length) => {
      errors.push({ error, offset, length });
    }
  };
  visit(text, visitor, options);
  const result = currentParent.children[0];
  if (result) {
    delete result.parent;
  }
  return result;
}
function findNodeAtLocation(root, path3) {
  if (!root) {
    return void 0;
  }
  let node = root;
  for (let segment of path3) {
    if (typeof segment === "string") {
      if (node.type !== "object" || !Array.isArray(node.children)) {
        return void 0;
      }
      let found = false;
      for (const propertyNode of node.children) {
        if (Array.isArray(propertyNode.children) && propertyNode.children[0].value === segment && propertyNode.children.length === 2) {
          node = propertyNode.children[1];
          found = true;
          break;
        }
      }
      if (!found) {
        return void 0;
      }
    } else {
      const index = segment;
      if (node.type !== "array" || index < 0 || !Array.isArray(node.children) || index >= node.children.length) {
        return void 0;
      }
      node = node.children[index];
    }
  }
  return node;
}
function visit(text, visitor, options = ParseOptions.DEFAULT) {
  const _scanner = createScanner(text, false);
  const _jsonPath = [];
  let suppressedCallbacks = 0;
  function toNoArgVisit(visitFunction) {
    return visitFunction ? () => suppressedCallbacks === 0 && visitFunction(_scanner.getTokenOffset(), _scanner.getTokenLength(), _scanner.getTokenStartLine(), _scanner.getTokenStartCharacter()) : () => true;
  }
  function toOneArgVisit(visitFunction) {
    return visitFunction ? (arg) => suppressedCallbacks === 0 && visitFunction(arg, _scanner.getTokenOffset(), _scanner.getTokenLength(), _scanner.getTokenStartLine(), _scanner.getTokenStartCharacter()) : () => true;
  }
  function toOneArgVisitWithPath(visitFunction) {
    return visitFunction ? (arg) => suppressedCallbacks === 0 && visitFunction(arg, _scanner.getTokenOffset(), _scanner.getTokenLength(), _scanner.getTokenStartLine(), _scanner.getTokenStartCharacter(), () => _jsonPath.slice()) : () => true;
  }
  function toBeginVisit(visitFunction) {
    return visitFunction ? () => {
      if (suppressedCallbacks > 0) {
        suppressedCallbacks++;
      } else {
        let cbReturn = visitFunction(_scanner.getTokenOffset(), _scanner.getTokenLength(), _scanner.getTokenStartLine(), _scanner.getTokenStartCharacter(), () => _jsonPath.slice());
        if (cbReturn === false) {
          suppressedCallbacks = 1;
        }
      }
    } : () => true;
  }
  function toEndVisit(visitFunction) {
    return visitFunction ? () => {
      if (suppressedCallbacks > 0) {
        suppressedCallbacks--;
      }
      if (suppressedCallbacks === 0) {
        visitFunction(_scanner.getTokenOffset(), _scanner.getTokenLength(), _scanner.getTokenStartLine(), _scanner.getTokenStartCharacter());
      }
    } : () => true;
  }
  const onObjectBegin = toBeginVisit(visitor.onObjectBegin), onObjectProperty = toOneArgVisitWithPath(visitor.onObjectProperty), onObjectEnd = toEndVisit(visitor.onObjectEnd), onArrayBegin = toBeginVisit(visitor.onArrayBegin), onArrayEnd = toEndVisit(visitor.onArrayEnd), onLiteralValue = toOneArgVisitWithPath(visitor.onLiteralValue), onSeparator = toOneArgVisit(visitor.onSeparator), onComment = toNoArgVisit(visitor.onComment), onError = toOneArgVisit(visitor.onError);
  const disallowComments = options && options.disallowComments;
  const allowTrailingComma = options && options.allowTrailingComma;
  function scanNext() {
    while (true) {
      const token = _scanner.scan();
      switch (_scanner.getTokenError()) {
        case 4:
          handleError(
            14
            /* ParseErrorCode.InvalidUnicode */
          );
          break;
        case 5:
          handleError(
            15
            /* ParseErrorCode.InvalidEscapeCharacter */
          );
          break;
        case 3:
          handleError(
            13
            /* ParseErrorCode.UnexpectedEndOfNumber */
          );
          break;
        case 1:
          if (!disallowComments) {
            handleError(
              11
              /* ParseErrorCode.UnexpectedEndOfComment */
            );
          }
          break;
        case 2:
          handleError(
            12
            /* ParseErrorCode.UnexpectedEndOfString */
          );
          break;
        case 6:
          handleError(
            16
            /* ParseErrorCode.InvalidCharacter */
          );
          break;
      }
      switch (token) {
        case 12:
        case 13:
          if (disallowComments) {
            handleError(
              10
              /* ParseErrorCode.InvalidCommentToken */
            );
          } else {
            onComment();
          }
          break;
        case 16:
          handleError(
            1
            /* ParseErrorCode.InvalidSymbol */
          );
          break;
        case 15:
        case 14:
          break;
        default:
          return token;
      }
    }
  }
  function handleError(error, skipUntilAfter = [], skipUntil = []) {
    onError(error);
    if (skipUntilAfter.length + skipUntil.length > 0) {
      let token = _scanner.getToken();
      while (token !== 17) {
        if (skipUntilAfter.indexOf(token) !== -1) {
          scanNext();
          break;
        } else if (skipUntil.indexOf(token) !== -1) {
          break;
        }
        token = scanNext();
      }
    }
  }
  function parseString(isValue) {
    const value = _scanner.getTokenValue();
    if (isValue) {
      onLiteralValue(value);
    } else {
      onObjectProperty(value);
      _jsonPath.push(value);
    }
    scanNext();
    return true;
  }
  function parseLiteral() {
    switch (_scanner.getToken()) {
      case 11:
        const tokenValue = _scanner.getTokenValue();
        let value = Number(tokenValue);
        if (isNaN(value)) {
          handleError(
            2
            /* ParseErrorCode.InvalidNumberFormat */
          );
          value = 0;
        }
        onLiteralValue(value);
        break;
      case 7:
        onLiteralValue(null);
        break;
      case 8:
        onLiteralValue(true);
        break;
      case 9:
        onLiteralValue(false);
        break;
      default:
        return false;
    }
    scanNext();
    return true;
  }
  function parseProperty() {
    if (_scanner.getToken() !== 10) {
      handleError(3, [], [
        2,
        5
        /* SyntaxKind.CommaToken */
      ]);
      return false;
    }
    parseString(false);
    if (_scanner.getToken() === 6) {
      onSeparator(":");
      scanNext();
      if (!parseValue()) {
        handleError(4, [], [
          2,
          5
          /* SyntaxKind.CommaToken */
        ]);
      }
    } else {
      handleError(5, [], [
        2,
        5
        /* SyntaxKind.CommaToken */
      ]);
    }
    _jsonPath.pop();
    return true;
  }
  function parseObject() {
    onObjectBegin();
    scanNext();
    let needsComma = false;
    while (_scanner.getToken() !== 2 && _scanner.getToken() !== 17) {
      if (_scanner.getToken() === 5) {
        if (!needsComma) {
          handleError(4, [], []);
        }
        onSeparator(",");
        scanNext();
        if (_scanner.getToken() === 2 && allowTrailingComma) {
          break;
        }
      } else if (needsComma) {
        handleError(6, [], []);
      }
      if (!parseProperty()) {
        handleError(4, [], [
          2,
          5
          /* SyntaxKind.CommaToken */
        ]);
      }
      needsComma = true;
    }
    onObjectEnd();
    if (_scanner.getToken() !== 2) {
      handleError(7, [
        2
        /* SyntaxKind.CloseBraceToken */
      ], []);
    } else {
      scanNext();
    }
    return true;
  }
  function parseArray() {
    onArrayBegin();
    scanNext();
    let isFirstElement = true;
    let needsComma = false;
    while (_scanner.getToken() !== 4 && _scanner.getToken() !== 17) {
      if (_scanner.getToken() === 5) {
        if (!needsComma) {
          handleError(4, [], []);
        }
        onSeparator(",");
        scanNext();
        if (_scanner.getToken() === 4 && allowTrailingComma) {
          break;
        }
      } else if (needsComma) {
        handleError(6, [], []);
      }
      if (isFirstElement) {
        _jsonPath.push(0);
        isFirstElement = false;
      } else {
        _jsonPath[_jsonPath.length - 1]++;
      }
      if (!parseValue()) {
        handleError(4, [], [
          4,
          5
          /* SyntaxKind.CommaToken */
        ]);
      }
      needsComma = true;
    }
    onArrayEnd();
    if (!isFirstElement) {
      _jsonPath.pop();
    }
    if (_scanner.getToken() !== 4) {
      handleError(8, [
        4
        /* SyntaxKind.CloseBracketToken */
      ], []);
    } else {
      scanNext();
    }
    return true;
  }
  function parseValue() {
    switch (_scanner.getToken()) {
      case 3:
        return parseArray();
      case 1:
        return parseObject();
      case 10:
        return parseString(true);
      default:
        return parseLiteral();
    }
  }
  scanNext();
  if (_scanner.getToken() === 17) {
    if (options.allowEmptyContent) {
      return true;
    }
    handleError(4, [], []);
    return false;
  }
  if (!parseValue()) {
    handleError(4, [], []);
    return false;
  }
  if (_scanner.getToken() !== 17) {
    handleError(9, [], []);
  }
  return true;
}
function getNodeType(value) {
  switch (typeof value) {
    case "boolean":
      return "boolean";
    case "number":
      return "number";
    case "string":
      return "string";
    case "object": {
      if (!value) {
        return "null";
      } else if (Array.isArray(value)) {
        return "array";
      }
      return "object";
    }
    default:
      return "null";
  }
}

// node_modules/jsonc-parser/lib/esm/impl/edit.js
function setProperty(text, originalPath, value, options) {
  const path3 = originalPath.slice();
  const errors = [];
  const root = parseTree(text, errors);
  let parent = void 0;
  let lastSegment = void 0;
  while (path3.length > 0) {
    lastSegment = path3.pop();
    parent = findNodeAtLocation(root, path3);
    if (parent === void 0 && value !== void 0) {
      if (typeof lastSegment === "string") {
        value = { [lastSegment]: value };
      } else {
        value = [value];
      }
    } else {
      break;
    }
  }
  if (!parent) {
    if (value === void 0) {
      throw new Error("Can not delete in empty document");
    }
    return withFormatting(text, { offset: root ? root.offset : 0, length: root ? root.length : 0, content: JSON.stringify(value) }, options);
  } else if (parent.type === "object" && typeof lastSegment === "string" && Array.isArray(parent.children)) {
    const existing = findNodeAtLocation(parent, [lastSegment]);
    if (existing !== void 0) {
      if (value === void 0) {
        if (!existing.parent) {
          throw new Error("Malformed AST");
        }
        const propertyIndex = parent.children.indexOf(existing.parent);
        let removeBegin;
        let removeEnd = existing.parent.offset + existing.parent.length;
        if (propertyIndex > 0) {
          let previous = parent.children[propertyIndex - 1];
          removeBegin = previous.offset + previous.length;
        } else {
          removeBegin = parent.offset + 1;
          if (parent.children.length > 1) {
            let next = parent.children[1];
            removeEnd = next.offset;
          }
        }
        return withFormatting(text, { offset: removeBegin, length: removeEnd - removeBegin, content: "" }, options);
      } else {
        return withFormatting(text, { offset: existing.offset, length: existing.length, content: JSON.stringify(value) }, options);
      }
    } else {
      if (value === void 0) {
        return [];
      }
      const newProperty = `${JSON.stringify(lastSegment)}: ${JSON.stringify(value)}`;
      const index = options.getInsertionIndex ? options.getInsertionIndex(parent.children.map((p) => p.children[0].value)) : parent.children.length;
      let edit;
      if (index > 0) {
        let previous = parent.children[index - 1];
        edit = { offset: previous.offset + previous.length, length: 0, content: "," + newProperty };
      } else if (parent.children.length === 0) {
        edit = { offset: parent.offset + 1, length: 0, content: newProperty };
      } else {
        edit = { offset: parent.offset + 1, length: 0, content: newProperty + "," };
      }
      return withFormatting(text, edit, options);
    }
  } else if (parent.type === "array" && typeof lastSegment === "number" && Array.isArray(parent.children)) {
    const insertIndex = lastSegment;
    if (insertIndex === -1) {
      const newProperty = `${JSON.stringify(value)}`;
      let edit;
      if (parent.children.length === 0) {
        edit = { offset: parent.offset + 1, length: 0, content: newProperty };
      } else {
        const previous = parent.children[parent.children.length - 1];
        edit = { offset: previous.offset + previous.length, length: 0, content: "," + newProperty };
      }
      return withFormatting(text, edit, options);
    } else if (value === void 0 && parent.children.length >= 0) {
      const removalIndex = lastSegment;
      const toRemove = parent.children[removalIndex];
      let edit;
      if (parent.children.length === 1) {
        edit = { offset: parent.offset + 1, length: parent.length - 2, content: "" };
      } else if (parent.children.length - 1 === removalIndex) {
        let previous = parent.children[removalIndex - 1];
        let offset = previous.offset + previous.length;
        let parentEndOffset = parent.offset + parent.length;
        edit = { offset, length: parentEndOffset - 2 - offset, content: "" };
      } else {
        edit = { offset: toRemove.offset, length: parent.children[removalIndex + 1].offset - toRemove.offset, content: "" };
      }
      return withFormatting(text, edit, options);
    } else if (value !== void 0) {
      let edit;
      const newProperty = `${JSON.stringify(value)}`;
      if (!options.isArrayInsertion && parent.children.length > lastSegment) {
        const toModify = parent.children[lastSegment];
        edit = { offset: toModify.offset, length: toModify.length, content: newProperty };
      } else if (parent.children.length === 0 || lastSegment === 0) {
        edit = { offset: parent.offset + 1, length: 0, content: parent.children.length === 0 ? newProperty : newProperty + "," };
      } else {
        const index = lastSegment > parent.children.length ? parent.children.length : lastSegment;
        const previous = parent.children[index - 1];
        edit = { offset: previous.offset + previous.length, length: 0, content: "," + newProperty };
      }
      return withFormatting(text, edit, options);
    } else {
      throw new Error(`Can not ${value === void 0 ? "remove" : options.isArrayInsertion ? "insert" : "modify"} Array index ${insertIndex} as length is not sufficient`);
    }
  } else {
    throw new Error(`Can not add ${typeof lastSegment !== "number" ? "index" : "property"} to parent of type ${parent.type}`);
  }
}
function withFormatting(text, edit, options) {
  if (!options.formattingOptions) {
    return [edit];
  }
  let newText = applyEdit(text, edit);
  let begin = edit.offset;
  let end = edit.offset + edit.content.length;
  if (edit.length === 0 || edit.content.length === 0) {
    while (begin > 0 && !isEOL(newText, begin - 1)) {
      begin--;
    }
    while (end < newText.length && !isEOL(newText, end)) {
      end++;
    }
  }
  const edits = format(newText, { offset: begin, length: end - begin }, { ...options.formattingOptions, keepLines: false });
  for (let i = edits.length - 1; i >= 0; i--) {
    const edit2 = edits[i];
    newText = applyEdit(newText, edit2);
    begin = Math.min(begin, edit2.offset);
    end = Math.max(end, edit2.offset + edit2.length);
    end += edit2.content.length - edit2.length;
  }
  const editLength = text.length - (newText.length - end) - begin;
  return [{ offset: begin, length: editLength, content: newText.substring(begin, end) }];
}
function applyEdit(text, edit) {
  return text.substring(0, edit.offset) + edit.content + text.substring(edit.offset + edit.length);
}

// node_modules/jsonc-parser/lib/esm/main.js
var ScanError;
(function(ScanError2) {
  ScanError2[ScanError2["None"] = 0] = "None";
  ScanError2[ScanError2["UnexpectedEndOfComment"] = 1] = "UnexpectedEndOfComment";
  ScanError2[ScanError2["UnexpectedEndOfString"] = 2] = "UnexpectedEndOfString";
  ScanError2[ScanError2["UnexpectedEndOfNumber"] = 3] = "UnexpectedEndOfNumber";
  ScanError2[ScanError2["InvalidUnicode"] = 4] = "InvalidUnicode";
  ScanError2[ScanError2["InvalidEscapeCharacter"] = 5] = "InvalidEscapeCharacter";
  ScanError2[ScanError2["InvalidCharacter"] = 6] = "InvalidCharacter";
})(ScanError || (ScanError = {}));
var SyntaxKind;
(function(SyntaxKind2) {
  SyntaxKind2[SyntaxKind2["OpenBraceToken"] = 1] = "OpenBraceToken";
  SyntaxKind2[SyntaxKind2["CloseBraceToken"] = 2] = "CloseBraceToken";
  SyntaxKind2[SyntaxKind2["OpenBracketToken"] = 3] = "OpenBracketToken";
  SyntaxKind2[SyntaxKind2["CloseBracketToken"] = 4] = "CloseBracketToken";
  SyntaxKind2[SyntaxKind2["CommaToken"] = 5] = "CommaToken";
  SyntaxKind2[SyntaxKind2["ColonToken"] = 6] = "ColonToken";
  SyntaxKind2[SyntaxKind2["NullKeyword"] = 7] = "NullKeyword";
  SyntaxKind2[SyntaxKind2["TrueKeyword"] = 8] = "TrueKeyword";
  SyntaxKind2[SyntaxKind2["FalseKeyword"] = 9] = "FalseKeyword";
  SyntaxKind2[SyntaxKind2["StringLiteral"] = 10] = "StringLiteral";
  SyntaxKind2[SyntaxKind2["NumericLiteral"] = 11] = "NumericLiteral";
  SyntaxKind2[SyntaxKind2["LineCommentTrivia"] = 12] = "LineCommentTrivia";
  SyntaxKind2[SyntaxKind2["BlockCommentTrivia"] = 13] = "BlockCommentTrivia";
  SyntaxKind2[SyntaxKind2["LineBreakTrivia"] = 14] = "LineBreakTrivia";
  SyntaxKind2[SyntaxKind2["Trivia"] = 15] = "Trivia";
  SyntaxKind2[SyntaxKind2["Unknown"] = 16] = "Unknown";
  SyntaxKind2[SyntaxKind2["EOF"] = 17] = "EOF";
})(SyntaxKind || (SyntaxKind = {}));
var parseTree2 = parseTree;
var ParseErrorCode;
(function(ParseErrorCode2) {
  ParseErrorCode2[ParseErrorCode2["InvalidSymbol"] = 1] = "InvalidSymbol";
  ParseErrorCode2[ParseErrorCode2["InvalidNumberFormat"] = 2] = "InvalidNumberFormat";
  ParseErrorCode2[ParseErrorCode2["PropertyNameExpected"] = 3] = "PropertyNameExpected";
  ParseErrorCode2[ParseErrorCode2["ValueExpected"] = 4] = "ValueExpected";
  ParseErrorCode2[ParseErrorCode2["ColonExpected"] = 5] = "ColonExpected";
  ParseErrorCode2[ParseErrorCode2["CommaExpected"] = 6] = "CommaExpected";
  ParseErrorCode2[ParseErrorCode2["CloseBraceExpected"] = 7] = "CloseBraceExpected";
  ParseErrorCode2[ParseErrorCode2["CloseBracketExpected"] = 8] = "CloseBracketExpected";
  ParseErrorCode2[ParseErrorCode2["EndOfFileExpected"] = 9] = "EndOfFileExpected";
  ParseErrorCode2[ParseErrorCode2["InvalidCommentToken"] = 10] = "InvalidCommentToken";
  ParseErrorCode2[ParseErrorCode2["UnexpectedEndOfComment"] = 11] = "UnexpectedEndOfComment";
  ParseErrorCode2[ParseErrorCode2["UnexpectedEndOfString"] = 12] = "UnexpectedEndOfString";
  ParseErrorCode2[ParseErrorCode2["UnexpectedEndOfNumber"] = 13] = "UnexpectedEndOfNumber";
  ParseErrorCode2[ParseErrorCode2["InvalidUnicode"] = 14] = "InvalidUnicode";
  ParseErrorCode2[ParseErrorCode2["InvalidEscapeCharacter"] = 15] = "InvalidEscapeCharacter";
  ParseErrorCode2[ParseErrorCode2["InvalidCharacter"] = 16] = "InvalidCharacter";
})(ParseErrorCode || (ParseErrorCode = {}));
function printParseErrorCode(code) {
  switch (code) {
    case 1:
      return "InvalidSymbol";
    case 2:
      return "InvalidNumberFormat";
    case 3:
      return "PropertyNameExpected";
    case 4:
      return "ValueExpected";
    case 5:
      return "ColonExpected";
    case 6:
      return "CommaExpected";
    case 7:
      return "CloseBraceExpected";
    case 8:
      return "CloseBracketExpected";
    case 9:
      return "EndOfFileExpected";
    case 10:
      return "InvalidCommentToken";
    case 11:
      return "UnexpectedEndOfComment";
    case 12:
      return "UnexpectedEndOfString";
    case 13:
      return "UnexpectedEndOfNumber";
    case 14:
      return "InvalidUnicode";
    case 15:
      return "InvalidEscapeCharacter";
    case 16:
      return "InvalidCharacter";
  }
  return "<unknown ParseErrorCode>";
}
function modify(text, path3, value, options) {
  return setProperty(text, path3, value, options);
}
function applyEdits(text, edits) {
  let sortedEdits = edits.slice(0).sort((a, b) => {
    const diff = a.offset - b.offset;
    if (diff === 0) {
      return a.length - b.length;
    }
    return diff;
  });
  let lastModifiedOffset = text.length;
  for (let i = sortedEdits.length - 1; i >= 0; i--) {
    let e = sortedEdits[i];
    if (e.offset + e.length <= lastModifiedOffset) {
      text = applyEdit(text, e);
    } else {
      throw new Error("Overlapping edit");
    }
    lastModifiedOffset = e.offset;
  }
  return text;
}

// src/shared/documents/validator.ts
var FORBIDDEN_VERSION_KEYS = [
  "schemaVersion",
  "formatVersion",
  "instructionsVersion",
  "revision",
  "migrationVersion"
];
var VALID_RELATION_KINDS = /* @__PURE__ */ new Set([
  "association",
  "dependency",
  "generalization",
  "realization",
  "aggregation",
  "composition",
  "other",
  "none"
]);
var VALID_SHAPE_GEOMETRIES = /* @__PURE__ */ new Set([
  "ellipse",
  "rectangle",
  "rhombus",
  "trapezoid",
  "parallelogram"
]);
function offsetToLineColumn(text, offset) {
  const clamped = Math.max(0, Math.min(offset, text.length));
  let line = 1;
  let lastLineStart = 0;
  for (let i = 0; i < clamped; i++) {
    if (text.charCodeAt(i) === 10) {
      line++;
      lastLineStart = i + 1;
    }
  }
  return { line, column: clamped - lastLineStart + 1 };
}
function isPlainObject(val) {
  return typeof val === "object" && val !== null && !Array.isArray(val);
}
function isFiniteCoordinate(val) {
  return typeof val === "number" && Number.isFinite(val) && Math.abs(val) <= 1e5;
}
function validateAiGuidance(ai, issues) {
  if (!isPlainObject(ai)) {
    issues.push({
      path: "ai",
      message: 'Missing or invalid "ai" guidance object (must include interpretation and editingRules).',
      severity: "error"
    });
    return;
  }
  for (const key of FORBIDDEN_VERSION_KEYS) {
    if (key in ai) {
      issues.push({
        path: `ai.${key}`,
        message: `Forbidden version field "${key}" in AI guidance.`,
        severity: "error"
      });
    }
  }
  if (ai.purpose !== void 0 && typeof ai.purpose !== "string") {
    issues.push({
      path: "ai.purpose",
      message: "ai.purpose must be a string.",
      severity: "error"
    });
  }
  if (!Array.isArray(ai.interpretation) || !ai.interpretation.every((item) => typeof item === "string")) {
    issues.push({
      path: "ai.interpretation",
      message: "ai.interpretation must be an array of strings.",
      severity: "error"
    });
  }
  if (!Array.isArray(ai.editingRules) || !ai.editingRules.every((item) => typeof item === "string")) {
    issues.push({
      path: "ai.editingRules",
      message: "ai.editingRules must be an array of strings.",
      severity: "error"
    });
  }
}
function validateUmlDocument(raw, issues) {
  let hasUnsupportedConstructs = false;
  if (typeof raw.title !== "string" || raw.title.trim().length === 0) {
    issues.push({
      path: "title",
      message: 'Document "title" must be a non-empty string.',
      severity: "error"
    });
  }
  if (raw.description !== void 0 && typeof raw.description !== "string") {
    issues.push({
      path: "description",
      message: 'Document "description" must be a string.',
      severity: "error"
    });
  }
  if (raw.defaultRouting !== void 0) {
    if (typeof raw.defaultRouting !== "string" || !["orthogonal", "bezier", "straight"].includes(raw.defaultRouting)) {
      issues.push({
        path: "defaultRouting",
        message: 'Document "defaultRouting" must be one of: orthogonal, bezier, straight.',
        severity: "error"
      });
    }
  }
  validateAiGuidance(raw.ai, issues);
  if (!Array.isArray(raw.nodes)) {
    issues.push({
      path: "nodes",
      message: '"nodes" must be an array.',
      severity: "error"
    });
  }
  if (!Array.isArray(raw.edges)) {
    issues.push({
      path: "edges",
      message: '"edges" must be an array.',
      severity: "error"
    });
  }
  if (!isPlainObject(raw.layout)) {
    issues.push({
      path: "layout",
      message: '"layout" must be an object containing "nodes" and "edges" maps.',
      severity: "error"
    });
  } else {
    if (!isPlainObject(raw.layout.nodes)) {
      issues.push({
        path: "layout.nodes",
        message: '"layout.nodes" must be an object keyed by node ID.',
        severity: "error"
      });
    }
    if (!isPlainObject(raw.layout.edges)) {
      issues.push({
        path: "layout.edges",
        message: '"layout.edges" must be an object keyed by edge ID.',
        severity: "error"
      });
    }
  }
  const nodeIds = /* @__PURE__ */ new Set();
  if (Array.isArray(raw.nodes)) {
    if (raw.nodes.length > 1e3) {
      issues.push({
        path: "nodes",
        message: "Document exceeds maximum supported node count (1000).",
        severity: "error"
      });
    }
    raw.nodes.forEach((node, idx) => {
      const path3 = `nodes[${idx}]`;
      if (!isPlainObject(node)) {
        issues.push({ path: path3, message: "Node entry must be an object.", severity: "error" });
        return;
      }
      if (typeof node.id !== "string" || node.id.trim().length === 0) {
        issues.push({
          path: `${path3}.id`,
          message: 'Node "id" must be a non-empty string.',
          severity: "error"
        });
      } else if (nodeIds.has(node.id)) {
        issues.push({
          path: `${path3}.id`,
          message: `Duplicate node ID "${node.id}".`,
          severity: "error"
        });
      } else {
        nodeIds.add(node.id);
      }
      if (typeof node.kind !== "string" || node.kind.trim().length === 0) {
        issues.push({
          path: `${path3}.kind`,
          message: 'Node "kind" must be a non-empty string.',
          severity: "error"
        });
      } else if (!getUmlNodeKind(node.kind)) {
        hasUnsupportedConstructs = true;
        issues.push({
          path: `${path3}.kind`,
          message: `Unsupported node kind "${node.kind}". Shown in non-destructive fallback mode.`,
          severity: "warning"
        });
      }
      if (typeof node.name !== "string") {
        issues.push({
          path: `${path3}.name`,
          message: 'Node "name" must be a string.',
          severity: "error"
        });
      }
      if (node.shape !== void 0) {
        if (typeof node.shape !== "string" || !VALID_SHAPE_GEOMETRIES.has(node.shape)) {
          issues.push({
            path: `${path3}.shape`,
            message: `Node "shape" must be one of: ${Array.from(VALID_SHAPE_GEOMETRIES).join(", ")}.`,
            severity: "error"
          });
        }
      }
      if (node.attributes !== void 0) {
        if (!Array.isArray(node.attributes)) {
          issues.push({
            path: `${path3}.attributes`,
            message: 'Node "attributes" must be an array when present.',
            severity: "error"
          });
        } else {
          const attrIds = /* @__PURE__ */ new Set();
          node.attributes.forEach((attr, aIdx) => {
            if (!isPlainObject(attr) || typeof attr.id !== "string" || typeof attr.name !== "string") {
              issues.push({
                path: `${path3}.attributes[${aIdx}]`,
                message: 'Attribute must have string "id" and "name".',
                severity: "error"
              });
            } else if (attrIds.has(attr.id)) {
              issues.push({
                path: `${path3}.attributes[${aIdx}].id`,
                message: `Duplicate attribute ID "${attr.id}" on node "${node.id}".`,
                severity: "error"
              });
            } else {
              attrIds.add(attr.id);
            }
          });
        }
      }
      if (node.operations !== void 0) {
        if (!Array.isArray(node.operations)) {
          issues.push({
            path: `${path3}.operations`,
            message: 'Node "operations" must be an array when present.',
            severity: "error"
          });
        } else {
          const opIds = /* @__PURE__ */ new Set();
          node.operations.forEach((op, oIdx) => {
            if (!isPlainObject(op) || typeof op.id !== "string" || typeof op.name !== "string") {
              issues.push({
                path: `${path3}.operations[${oIdx}]`,
                message: 'Operation must have string "id" and "name".',
                severity: "error"
              });
            } else if (opIds.has(op.id)) {
              issues.push({
                path: `${path3}.operations[${oIdx}].id`,
                message: `Duplicate operation ID "${op.id}" on node "${node.id}".`,
                severity: "error"
              });
            } else {
              opIds.add(op.id);
            }
          });
        }
      }
    });
  }
  const edgeIds = /* @__PURE__ */ new Set();
  if (Array.isArray(raw.edges)) {
    if (raw.edges.length > 2e3) {
      issues.push({
        path: "edges",
        message: "Document exceeds maximum supported edge count (2000).",
        severity: "error"
      });
    }
    raw.edges.forEach((edge, idx) => {
      const path3 = `edges[${idx}]`;
      if (!isPlainObject(edge)) {
        issues.push({ path: path3, message: "Edge entry must be an object.", severity: "error" });
        return;
      }
      if (typeof edge.id !== "string" || edge.id.trim().length === 0) {
        issues.push({
          path: `${path3}.id`,
          message: 'Edge "id" must be a non-empty string.',
          severity: "error"
        });
      } else if (edgeIds.has(edge.id)) {
        issues.push({
          path: `${path3}.id`,
          message: `Duplicate edge ID "${edge.id}".`,
          severity: "error"
        });
      } else {
        edgeIds.add(edge.id);
      }
      if (typeof edge.kind !== "string" || !VALID_RELATION_KINDS.has(edge.kind)) {
        issues.push({
          path: `${path3}.kind`,
          message: `Edge "kind" must be one of: ${Array.from(VALID_RELATION_KINDS).join(", ")}.`,
          severity: "error"
        });
      }
      if (!isPlainObject(edge.source) || typeof edge.source.nodeId !== "string") {
        issues.push({
          path: `${path3}.source.nodeId`,
          message: 'Edge "source.nodeId" must be a string.',
          severity: "error"
        });
      } else if (!nodeIds.has(edge.source.nodeId)) {
        issues.push({
          path: `${path3}.source.nodeId`,
          message: `Node "${edge.source.nodeId}" does not exist.`,
          severity: "error"
        });
      }
      if (!isPlainObject(edge.target) || typeof edge.target.nodeId !== "string") {
        issues.push({
          path: `${path3}.target.nodeId`,
          message: 'Edge "target.nodeId" must be a string.',
          severity: "error"
        });
      } else if (!nodeIds.has(edge.target.nodeId)) {
        issues.push({
          path: `${path3}.target.nodeId`,
          message: `Node "${edge.target.nodeId}" does not exist.`,
          severity: "error"
        });
      }
      if (edge.visual !== void 0) {
        if (!isPlainObject(edge.visual)) {
          issues.push({
            path: `${path3}.visual`,
            message: 'Edge "visual" must be an object when present.',
            severity: "error"
          });
        } else {
          for (const endKey of ["start", "end"]) {
            const dec = edge.visual[endKey];
            if (dec !== void 0) {
              if (!isPlainObject(dec) || typeof dec.shape !== "string") {
                issues.push({
                  path: `${path3}.visual.${endKey}`,
                  message: `Endpoint "${endKey}" must be an object with a string "shape".`,
                  severity: "error"
                });
              } else {
                const shapeDesc = getEndpointShape(dec.shape);
                if (!shapeDesc) {
                  hasUnsupportedConstructs = true;
                  issues.push({
                    path: `${path3}.visual.${endKey}.shape`,
                    message: `Unknown endpoint shape "${dec.shape}". Rendering fallback marker.`,
                    severity: "warning"
                  });
                }
                if (dec.fill !== void 0 && dec.fill !== "hollow" && dec.fill !== "filled") {
                  issues.push({
                    path: `${path3}.visual.${endKey}.fill`,
                    message: 'Endpoint fill must be "hollow" or "filled".',
                    severity: "error"
                  });
                }
              }
            }
          }
        }
      }
    });
  }
  if (isPlainObject(raw.layout) && isPlainObject(raw.layout.nodes)) {
    for (const [nodeId, box] of Object.entries(raw.layout.nodes)) {
      const path3 = `layout.nodes.${nodeId}`;
      if (!nodeIds.has(nodeId)) {
        issues.push({
          path: path3,
          message: `Layout entry references non-existent node "${nodeId}".`,
          severity: "error"
        });
        continue;
      }
      if (!isPlainObject(box) || !isFiniteCoordinate(box.x) || !isFiniteCoordinate(box.y) || !isFiniteCoordinate(box.width) || !isFiniteCoordinate(box.height) || box.width < 20 || box.height < 20) {
        issues.push({
          path: path3,
          message: `Layout for node "${nodeId}" must have finite x, y and width/height >= 20.`,
          severity: "error"
        });
      }
    }
  }
  return { hasUnsupportedConstructs };
}
function parseAndValidateDocument(text, expectedKind = "uml") {
  const issues = [];
  const parseErrors = [];
  const withoutBom = text.replace(/^\uFEFF/, "");
  if (withoutBom.trim().length === 0) {
    issues.push({
      path: "$",
      message: "Document is empty.",
      line: 1,
      column: 1,
      severity: "error"
    });
    return { ok: false, issues };
  }
  parseTree2(withoutBom, parseErrors, {
    allowTrailingComma: false,
    disallowComments: true
  });
  if (parseErrors.length > 0) {
    const first = parseErrors[0];
    const pos = offsetToLineColumn(withoutBom, first.offset);
    issues.push({
      path: "$",
      message: `Invalid JSON syntax (${printParseErrorCode(first.error)}) at line ${pos.line}, column ${pos.column}.`,
      line: pos.line,
      column: pos.column,
      severity: "error"
    });
    return { ok: false, issues };
  }
  let parsed;
  try {
    parsed = JSON.parse(withoutBom);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Invalid JSON syntax";
    issues.push({
      path: "$",
      message: msg,
      line: 1,
      column: 1,
      severity: "error"
    });
    return { ok: false, issues };
  }
  if (!isPlainObject(parsed)) {
    issues.push({
      path: "$",
      message: "Document root must be a JSON object.",
      line: 1,
      column: 1,
      severity: "error"
    });
    return { ok: false, issues };
  }
  for (const key of FORBIDDEN_VERSION_KEYS) {
    if (key in parsed) {
      issues.push({
        path: key,
        message: `Forbidden version property "${key}". Vizion documents must not contain version or migration fields.`,
        severity: "error"
      });
    }
  }
  if (parsed.format !== "vizion") {
    issues.push({
      path: "format",
      message: `Expected "format": "vizion", found ${JSON.stringify(parsed.format)}.`,
      severity: "error"
    });
  }
  if (parsed.kind !== expectedKind) {
    issues.push({
      path: "kind",
      message: `Filename expects kind "${expectedKind}", but document specifies kind ${JSON.stringify(parsed.kind)}. Open as Text to inspect or rename the file.`,
      severity: "error"
    });
    return { ok: false, issues };
  }
  const { hasUnsupportedConstructs } = validateUmlDocument(parsed, issues);
  const hasError = issues.some((i) => i.severity === "error");
  return {
    ok: !hasError,
    document: !hasError ? parsed : void 0,
    issues,
    hasUnsupportedConstructs
  };
}

// src/extension/coordinator/export-service.ts
var fs = __toESM(require("node:fs"));
var os = __toESM(require("node:os"));
var path2 = __toESM(require("node:path"));
var import_node_child_process = require("node:child_process");
var vscode8 = __toESM(require("vscode"));
var ExportService = class {
  constructor(document) {
    this.document = document;
  }
  /**
   * Prompts user with native OS save dialog and saves high-resolution PNG or SVG diagram.
   */
  async exportDiagram(options) {
    const format2 = options.format;
    const defaultUri = this.resolveDefaultSaveUri(format2, options.defaultFileName);
    const filterName = format2 === "svg" ? "SVG Image" : "PNG Image";
    const filterExt = format2 === "svg" ? ["svg"] : ["png"];
    const chosenUri = await vscode8.window.showSaveDialog({
      defaultUri,
      saveLabel: `Export ${format2.toUpperCase()}`,
      title: `Export Diagram as ${format2.toUpperCase()}`,
      filters: {
        [filterName]: filterExt,
        "All Files": ["*"]
      }
    });
    if (!chosenUri) {
      return { success: false, cancelled: true };
    }
    let targetUri = chosenUri;
    const expectedExt = `.${format2}`;
    if (!targetUri.path.toLowerCase().endsWith(expectedExt)) {
      targetUri = targetUri.with({ path: `${targetUri.path}${expectedExt}` });
    }
    try {
      let bytes;
      if (format2 === "svg") {
        const svgContent = options.svgData ?? (options.base64Data ? Buffer.from(options.base64Data, "base64").toString("utf8") : "");
        if (!svgContent.trim()) {
          throw new Error("SVG export content is empty.");
        }
        bytes = Buffer.from(svgContent, "utf8");
      } else {
        const cleanBase64 = (options.base64Data ?? "").replace(/^data:image\/png;base64,/, "").trim();
        if (!cleanBase64) {
          throw new Error("PNG export image data is empty.");
        }
        bytes = Buffer.from(cleanBase64, "base64");
        if (bytes.length === 0) {
          throw new Error("Decoded image buffer is empty.");
        }
      }
      const isLarge = bytes.length > 2 * 1024 * 1024;
      if (isLarge) {
        await vscode8.window.withProgress(
          {
            location: vscode8.ProgressLocation.Notification,
            title: `Exporting diagram (${(bytes.length / (1024 * 1024)).toFixed(1)} MB)...`,
            cancellable: false
          },
          async () => {
            await vscode8.workspace.fs.writeFile(targetUri, bytes);
          }
        );
      } else {
        await vscode8.workspace.fs.writeFile(targetUri, bytes);
      }
      const relPath = vscode8.workspace.asRelativePath(targetUri);
      void vscode8.window.showInformationMessage(
        `Exported diagram ${format2.toUpperCase()} to ${relPath}`
      );
      return { success: true, targetUri };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      void vscode8.window.showErrorMessage(`Failed to export diagram: ${message}`);
      return { success: false, error: message };
    }
  }
  /**
   * Convenience alias for exporting file, returning the saved URI if successful.
   */
  async exportFile(base64Data, format2 = "png", svgData, defaultFileName) {
    const res = await this.exportDiagram({
      format: format2,
      base64Data,
      svgData,
      defaultFileName
    });
    return res.targetUri;
  }
  /**
   * Copies PNG image binary data to system clipboard in an OS-agnostic manner.
   * Supports Linux (wl-copy / xclip), macOS (osascript), Windows (PowerShell STA).
   */
  async copyImageToClipboard(base64Data) {
    const cleanBase64 = (base64Data ?? "").replace(/^data:image\/png;base64,/, "").trim();
    if (!cleanBase64) {
      void vscode8.window.showErrorMessage("Failed to copy: image data is empty.");
      return { success: false, error: "Empty image data" };
    }
    const buffer = Buffer.from(cleanBase64, "base64");
    if (buffer.length === 0) {
      void vscode8.window.showErrorMessage("Failed to copy: decoded image buffer is empty.");
      return { success: false, error: "Decoded buffer empty" };
    }
    try {
      if (process.platform === "linux") {
        await this.copyLinuxImage(buffer);
      } else if (process.platform === "darwin") {
        await this.copyMacImage(buffer);
      } else if (process.platform === "win32") {
        await this.copyWindowsImage(buffer);
      } else {
        throw new Error(`Unsupported platform for image clipboard: ${process.platform}`);
      }
      void vscode8.window.showInformationMessage("Diagram image copied to clipboard.");
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      void vscode8.window.showWarningMessage(`Could not copy image to clipboard: ${message}`);
      return { success: false, error: message };
    }
  }
  /**
   * Copies text-based content (SVG vector data or JSON AST) to system clipboard via VS Code API.
   */
  async copyTextToClipboard(content, formatName = "text") {
    if (!content) {
      void vscode8.window.showErrorMessage(`Failed to copy: ${formatName} content is empty.`);
      return { success: false, error: "Empty content" };
    }
    try {
      await vscode8.env.clipboard.writeText(content);
      void vscode8.window.showInformationMessage(`Diagram ${formatName} copied to clipboard.`);
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      void vscode8.window.showErrorMessage(`Failed to copy to clipboard: ${message}`);
      return { success: false, error: message };
    }
  }
  // ============================================================================
  // Platform-Specific Implementations
  // ============================================================================
  resolveDefaultSaveUri(format2, defaultFileName) {
    const ext = `.${format2}`;
    let baseName = defaultFileName;
    if (!baseName) {
      if (this.document.uri.scheme === "file") {
        const parsed = path2.parse(this.document.uri.fsPath);
        baseName = parsed.name.replace(/\.uml$/i, "");
      } else {
        baseName = "diagram";
      }
    }
    baseName = baseName.replace(/\.(?:png|svg|viz)$/i, "");
    const targetFileName = `${baseName}${ext}`;
    if (this.document.uri.scheme === "file") {
      const parentDir = path2.dirname(this.document.uri.fsPath);
      return vscode8.Uri.file(path2.join(parentDir, targetFileName));
    }
    const workspaceFolder = vscode8.workspace.getWorkspaceFolder(this.document.uri) ?? vscode8.workspace.workspaceFolders?.[0];
    if (workspaceFolder) {
      return vscode8.Uri.joinPath(workspaceFolder.uri, targetFileName);
    }
    return vscode8.Uri.file(targetFileName);
  }
  async copyLinuxImage(buffer) {
    const isWayland = Boolean(process.env.WAYLAND_DISPLAY);
    const primaryTool = isWayland ? "wl-copy" : "xclip";
    const secondaryTool = isWayland ? "xclip" : "wl-copy";
    const runTool = (tool) => {
      return new Promise((resolve, reject) => {
        const args = tool === "wl-copy" ? ["-t", "image/png"] : ["-selection", "clipboard", "-t", "image/png"];
        const proc = (0, import_node_child_process.spawn)(tool, args, { stdio: ["pipe", "ignore", "pipe"] });
        let stderr = "";
        const timer = setTimeout(() => {
          proc.kill("SIGKILL");
          reject(new Error(`${tool} timed out after 5000ms`));
        }, 5e3);
        proc.stderr.on("data", (d) => {
          stderr += d.toString();
        });
        proc.on("error", (err) => {
          clearTimeout(timer);
          reject(err);
        });
        proc.on("close", (code) => {
          clearTimeout(timer);
          if (code === 0) resolve();
          else reject(new Error(`${tool} exited with code ${code}: ${stderr.trim()}`));
        });
        proc.stdin.on("error", (err) => {
          clearTimeout(timer);
          reject(err);
        });
        proc.stdin.end(buffer);
      });
    };
    try {
      await runTool(primaryTool);
    } catch (err) {
      if (err?.code === "ENOENT") {
        try {
          await runTool(secondaryTool);
        } catch (err2) {
          if (err2?.code === "ENOENT") {
            throw new Error(
              'Neither "wl-copy" nor "xclip" was found. Install "wl-clipboard" (Wayland) or "xclip" (X11).'
            );
          }
          throw err2;
        }
      } else {
        throw err;
      }
    }
  }
  async copyMacImage(buffer) {
    const tmpPath = path2.join(
      os.tmpdir(),
      `vizion-clip-${Date.now()}-${Math.random().toString(36).slice(2)}.png`
    );
    await fs.promises.writeFile(tmpPath, buffer);
    try {
      await new Promise((resolve, reject) => {
        const script = `set the clipboard to (read (POSIX file "${tmpPath}") as \xABclass PNGf\xBB)`;
        const proc = (0, import_node_child_process.spawn)("osascript", ["-e", script], { stdio: ["ignore", "ignore", "pipe"] });
        let stderr = "";
        const timer = setTimeout(() => {
          proc.kill("SIGKILL");
          reject(new Error("osascript timed out after 5000ms"));
        }, 5e3);
        proc.stderr.on("data", (d) => {
          stderr += d.toString();
        });
        proc.on("error", (err) => {
          clearTimeout(timer);
          reject(err);
        });
        proc.on("close", (code) => {
          clearTimeout(timer);
          if (code === 0) resolve();
          else reject(new Error(`osascript exited with code ${code}: ${stderr.trim()}`));
        });
      });
    } finally {
      await fs.promises.unlink(tmpPath).catch(() => {
      });
    }
  }
  async copyWindowsImage(buffer) {
    const tmpPath = path2.join(
      os.tmpdir(),
      `vizion-clip-${Date.now()}-${Math.random().toString(36).slice(2)}.png`
    );
    await fs.promises.writeFile(tmpPath, buffer);
    try {
      await new Promise((resolve, reject) => {
        const escaped = tmpPath.replace(/'/g, "''");
        const psCommand = `Add-Type -AssemblyName System.Windows.Forms; $img = [System.Drawing.Image]::FromFile('${escaped}'); [System.Windows.Forms.Clipboard]::SetImage($img); $img.Dispose()`;
        const proc = (0, import_node_child_process.spawn)(
          "powershell.exe",
          ["-NoProfile", "-NonInteractive", "-STA", "-Command", psCommand],
          { stdio: ["ignore", "ignore", "pipe"] }
        );
        let stderr = "";
        const timer = setTimeout(() => {
          proc.kill("SIGKILL");
          reject(new Error("PowerShell clipboard command timed out after 5000ms"));
        }, 5e3);
        proc.stderr.on("data", (d) => {
          stderr += d.toString();
        });
        proc.on("error", (err) => {
          clearTimeout(timer);
          reject(err);
        });
        proc.on("close", (code) => {
          clearTimeout(timer);
          if (code === 0) resolve();
          else reject(new Error(`PowerShell exited with code ${code}: ${stderr.trim()}`));
        });
      });
    } finally {
      setTimeout(() => {
        fs.promises.unlink(tmpPath).catch(() => {
        });
      }, 100);
    }
  }
};

// src/extension/coordinator/workspace-edit-pipeline.ts
var vscode9 = __toESM(require("vscode"));

// src/shared/documents/json-patch.ts
function detectFormattingOptions(text) {
  const eol = text.includes("\r\n") ? "\r\n" : "\n";
  const lines = text.split(/\r?\n/);
  for (const line of lines) {
    const match = /^(\s+)\S/.exec(line);
    if (match) {
      const ws = match[1];
      if (ws.startsWith("	")) {
        return { tabSize: 2, insertSpaces: false, eol };
      }
      return { tabSize: Math.min(8, Math.max(2, ws.length)), insertSpaces: true, eol };
    }
  }
  return { tabSize: 2, insertSpaces: true, eol };
}
function computeMinimalJsonEdits(originalText, patches) {
  const formattingOptions = detectFormattingOptions(originalText);
  if (patches.length === 1) {
    const patch = patches[0];
    const edits = modify(originalText, patch.path, patch.value, {
      formattingOptions,
      isArrayInsertion: patch.isArrayInsertion
    });
    const updatedText = applyEdits(originalText, edits);
    return { updatedText, edits };
  }
  let currentText = originalText;
  for (const patch of patches) {
    const stepEdits = modify(currentText, patch.path, patch.value, {
      formattingOptions,
      isArrayInsertion: patch.isArrayInsertion
    });
    currentText = applyEdits(currentText, stepEdits);
  }
  const singleSpan = computeMinimalDiffSpan(originalText, currentText);
  return {
    updatedText: currentText,
    edits: singleSpan ? [singleSpan] : []
  };
}
function computeMinimalDiffSpan(before, after) {
  if (before === after) {
    return null;
  }
  let start = 0;
  const minLen = Math.min(before.length, after.length);
  while (start < minLen && before.charCodeAt(start) === after.charCodeAt(start)) {
    start++;
  }
  let endBefore = before.length;
  let endAfter = after.length;
  while (endBefore > start && endAfter > start && before.charCodeAt(endBefore - 1) === after.charCodeAt(endAfter - 1)) {
    endBefore--;
    endAfter--;
  }
  return {
    offset: start,
    length: endBefore - start,
    content: after.slice(start, endAfter)
  };
}

// src/shared/operations/edge-operations.ts
function resolveMatchingRelation(currentKind, line, start, end) {
  const match = detectMatchingRelationPreset(line, start, end);
  if (match) {
    return match;
  }
  const isStartAssoc = (start?.shape ?? "none") === "none" || (start?.shape ?? "none") === "open-arrow";
  const isEndAssoc = (end?.shape ?? "none") === "none" || (end?.shape ?? "none") === "open-arrow";
  if (line !== "dashed" && isStartAssoc && isEndAssoc) {
    return "association";
  }
  return "other";
}
function applyAddEdge(doc, op) {
  if (doc.edges.some((e) => e.id === op.id)) {
    return { ok: false, error: `Edge ID "${op.id}" already exists.` };
  }
  const sourceNode = doc.nodes.find((n) => n.id === op.sourceNodeId);
  if (!sourceNode) {
    return { ok: false, error: `Source node "${op.sourceNodeId}" does not exist.` };
  }
  const targetNode = doc.nodes.find((n) => n.id === op.targetNodeId);
  if (!targetNode) {
    return { ok: false, error: `Target node "${op.targetNodeId}" does not exist.` };
  }
  if (sourceNode.kind === "frame" || targetNode.kind === "frame") {
    return { ok: false, error: "Frames cannot have relationships." };
  }
  const touchesNote = sourceNode.kind === "note" || targetNode.kind === "note";
  const edgeKind = op.kind ?? (touchesNote ? "other" : "association");
  const preset = getUmlRelationPreset(edgeKind);
  const defaultLine = touchesNote ? "dashed" : preset?.line ?? "solid";
  const newEdge = {
    id: op.id,
    kind: edgeKind,
    source: {
      nodeId: op.sourceNodeId
    },
    target: {
      nodeId: op.targetNodeId
    },
    ...op.label ? { label: op.label } : {},
    visual: {
      line: op.line ?? defaultLine,
      routing: op.routing ?? preset?.routing ?? "default",
      start: { ...preset?.start ?? { shape: "none", size: 10 } },
      end: { ...preset?.end ?? { shape: "none", size: 10 } }
    }
  };
  const patches = [
    {
      path: ["edges", doc.edges.length],
      value: newEdge,
      isArrayInsertion: true
    }
  ];
  return { ok: true, patches, createdIds: [op.id] };
}
function applyUpdateEdge(doc, op) {
  const idx = doc.edges.findIndex((e) => e.id === op.edgeId);
  if (idx === -1) {
    return { ok: false, error: `Edge "${op.edgeId}" not found.` };
  }
  const existing = doc.edges[idx];
  const patches = [];
  if (op.reverseDirection) {
    patches.push({
      path: ["edges", idx, "source"],
      value: { ...existing.target }
    });
    patches.push({
      path: ["edges", idx, "target"],
      value: { ...existing.source }
    });
  }
  if (op.sourceNodeId !== void 0) {
    const sNode = doc.nodes.find((n) => n.id === op.sourceNodeId);
    if (!sNode) {
      return { ok: false, error: `Node "${op.sourceNodeId}" does not exist.` };
    }
    if (sNode.kind === "frame") {
      return { ok: false, error: "Frames cannot have relationships." };
    }
    patches.push({
      path: ["edges", idx, "source", "nodeId"],
      value: op.sourceNodeId
    });
  }
  if (op.targetNodeId !== void 0) {
    const tNode = doc.nodes.find((n) => n.id === op.targetNodeId);
    if (!tNode) {
      return { ok: false, error: `Node "${op.targetNodeId}" does not exist.` };
    }
    if (tNode.kind === "frame") {
      return { ok: false, error: "Frames cannot have relationships." };
    }
    patches.push({
      path: ["edges", idx, "target", "nodeId"],
      value: op.targetNodeId
    });
  }
  if (op.sourceMultiplicity !== void 0) {
    patches.push({
      path: ["edges", idx, "source", "multiplicity"],
      value: op.sourceMultiplicity.trim() || void 0
    });
  }
  if (op.targetMultiplicity !== void 0) {
    patches.push({
      path: ["edges", idx, "target", "multiplicity"],
      value: op.targetMultiplicity.trim() || void 0
    });
  }
  if (op.label !== void 0) {
    patches.push({
      path: ["edges", idx, "label"],
      value: op.label.trim() || void 0
    });
  }
  if (op.kind !== void 0) {
    patches.push({ path: ["edges", idx, "kind"], value: op.kind });
    const preset = getUmlRelationPreset(op.kind);
    if (preset) {
      patches.push({
        path: ["edges", idx, "visual"],
        value: {
          ...existing.visual ?? {},
          line: preset.line,
          routing: existing.visual?.routing ?? preset.routing,
          start: { ...preset.start },
          end: { ...preset.end }
        }
      });
    }
  } else if (op.line !== void 0) {
    patches.push({
      path: ["edges", idx, "visual", "line"],
      value: op.line
    });
    const nextKind = resolveMatchingRelation(
      existing.kind,
      op.line,
      existing.visual?.start,
      existing.visual?.end
    );
    if (nextKind !== existing.kind) {
      patches.push({ path: ["edges", idx, "kind"], value: nextKind });
    }
  }
  if (op.routing !== void 0) {
    patches.push({
      path: ["edges", idx, "visual", "routing"],
      value: op.routing
    });
  }
  return { ok: true, patches };
}
function applyUpdateEndpoint(doc, op) {
  const idx = doc.edges.findIndex((e) => e.id === op.edgeId);
  if (idx === -1) {
    return { ok: false, error: `Edge "${op.edgeId}" not found.` };
  }
  const shapeDesc = getEndpointShape(op.decoration.shape);
  if (!shapeDesc) {
    return {
      ok: false,
      error: `Unknown endpoint decoration shape "${op.decoration.shape}".`
    };
  }
  const existingEnd = doc.edges[idx].visual?.[op.end] ?? {};
  const cleanedDecoration = {
    ...existingEnd,
    shape: op.decoration.shape,
    size: op.decoration.size ?? existingEnd.size ?? shapeDesc.defaultSize
  };
  if (shapeDesc.supportsFill) {
    cleanedDecoration.fill = op.decoration.fill ?? existingEnd.fill ?? shapeDesc.defaultFill ?? "hollow";
  } else {
    delete cleanedDecoration.fill;
  }
  const patches = [];
  if (!doc.edges[idx].visual) {
    const preset = getUmlRelationPreset(doc.edges[idx].kind);
    patches.push({
      path: ["edges", idx, "visual"],
      value: {
        line: preset?.line ?? "solid",
        routing: preset?.routing ?? "default",
        start: op.end === "start" ? cleanedDecoration : { ...preset?.start ?? { shape: "none", size: 10 } },
        end: op.end === "end" ? cleanedDecoration : { ...preset?.end ?? { shape: "none", size: 10 } }
      }
    });
  } else {
    patches.push({
      path: ["edges", idx, "visual", op.end],
      value: cleanedDecoration
    });
  }
  const currentEdge = doc.edges[idx];
  const startDec = op.end === "start" ? cleanedDecoration : currentEdge.visual?.start;
  const endDec = op.end === "end" ? cleanedDecoration : currentEdge.visual?.end;
  const nextKind = resolveMatchingRelation(
    currentEdge.kind,
    currentEdge.visual?.line,
    startDec,
    endDec
  );
  if (nextKind !== currentEdge.kind) {
    patches.push({ path: ["edges", idx, "kind"], value: nextKind });
  }
  return { ok: true, patches };
}

// src/shared/documents/migrations.ts
var DOCUMENT_MIGRATIONS = [
  {
    id: "migrate-purpose-to-description",
    name: "Move Purpose to Root Description",
    description: 'Moves legacy "ai.purpose" to root "description" property under title.',
    shouldApply: (doc) => {
      const ai = doc.ai;
      return Boolean(ai && typeof ai.purpose === "string");
    },
    apply: (doc) => {
      const ai = doc.ai;
      if (ai && typeof ai.purpose === "string") {
        if (!doc.description) {
          doc.description = ai.purpose;
        }
        delete ai.purpose;
      }
    }
  },
  {
    id: "refresh-ai-guidance",
    name: "Update AI Guidance Rules",
    description: "Updates embedded interpretation and editing rules to the latest version.",
    shouldApply: (doc) => {
      const template = createDefaultUmlDocument(doc.title);
      const currentInterp = JSON.stringify(doc.ai?.interpretation ?? []);
      const templateInterp = JSON.stringify(template.ai.interpretation);
      const currentRules = JSON.stringify(doc.ai?.editingRules ?? []);
      const templateRules = JSON.stringify(template.ai.editingRules);
      return currentInterp !== templateInterp || currentRules !== templateRules;
    },
    apply: (doc) => {
      const template = createDefaultUmlDocument(doc.title);
      doc.ai.interpretation = [...template.ai.interpretation];
      doc.ai.editingRules = [...template.ai.editingRules];
    }
  },
  {
    id: "sync-version",
    name: "Sync Document Version",
    description: `Updates document version to current extension version (${EXTENSION_VERSION}).`,
    shouldApply: (doc) => doc.version !== EXTENSION_VERSION,
    apply: (doc) => {
      doc.version = EXTENSION_VERSION;
    }
  }
];
function runDocumentMigrations(doc) {
  const cloned = JSON.parse(JSON.stringify(doc));
  const appliedSteps = [];
  for (const step of DOCUMENT_MIGRATIONS) {
    if (step.shouldApply(cloned)) {
      step.apply(cloned);
      appliedSteps.push(step.id);
    }
  }
  cloned.version = EXTENSION_VERSION;
  return { doc: cloned, appliedSteps };
}

// src/shared/operations/metadata-operations.ts
function applyUpdateMetadata(doc, op) {
  const patches = [];
  if (op.title !== void 0 && op.title.trim().length > 0) {
    patches.push({ path: ["title"], value: op.title.trim() });
  }
  if (op.description !== void 0) {
    patches.push({ path: ["description"], value: op.description.trim() });
  } else if (op.purpose !== void 0) {
    patches.push({ path: ["description"], value: op.purpose.trim() });
  }
  if (op.defaultRouting !== void 0) {
    patches.push({ path: ["defaultRouting"], value: op.defaultRouting });
  }
  return { ok: true, patches };
}
function applyMigrateDocument(doc, _op) {
  const { doc: migratedDoc, appliedSteps } = runDocumentMigrations(doc);
  if (appliedSteps.length === 0 && doc.version === EXTENSION_VERSION) {
    return { ok: false, error: "Document is already up to date." };
  }
  const patches = [];
  patches.push({ path: ["version"], value: EXTENSION_VERSION });
  if (migratedDoc.description !== void 0) {
    patches.push({ path: ["description"], value: migratedDoc.description });
  }
  if (doc.ai && "purpose" in doc.ai) {
    patches.push({ path: ["ai", "purpose"], value: void 0 });
  }
  patches.push({ path: ["ai", "interpretation"], value: migratedDoc.ai.interpretation });
  patches.push({ path: ["ai", "editingRules"], value: migratedDoc.ai.editingRules });
  return { ok: true, patches };
}

// src/shared/operations/node-operations.ts
function generateCloneId(baseId, existingIds) {
  const cleanBase = baseId.replace(/-copy(-\d+)?$/, "");
  let candidate = `${cleanBase}-copy`;
  let counter = 2;
  while (existingIds.has(candidate)) {
    candidate = `${cleanBase}-copy-${counter}`;
    counter++;
  }
  existingIds.add(candidate);
  return candidate;
}
function applyAddNode(doc, op) {
  if (doc.nodes.some((n) => n.id === op.id)) {
    return { ok: false, error: `Node ID "${op.id}" already exists.` };
  }
  const descriptor = getUmlNodeKind(op.kind);
  const width = Math.max(60, Math.round(op.width ?? descriptor?.defaultWidth ?? 240));
  const height = Math.max(45, Math.round(op.height ?? descriptor?.defaultHeight ?? 140));
  const newNode = {
    id: op.id,
    kind: op.kind,
    name: op.name.trim() || "NewEntity"
  };
  if (descriptor?.defaultStereotype) {
    newNode.stereotype = descriptor.defaultStereotype;
  }
  if (op.kind === "note") {
    newNode.text = op.text ?? "Design note...";
  } else if (op.kind === "shape") {
    newNode.shape = op.shape ?? "rectangle";
  } else if (op.kind === "frame") {
    newNode.children = op.children ?? [];
  } else if (descriptor?.hasCompartments !== false) {
    newNode.attributes = [
      {
        id: `${op.id}-attr-1`,
        visibility: "+",
        name: "id",
        type: "string"
      }
    ];
    newNode.operations = [];
  }
  const layoutBox = {
    x: Math.round(op.x),
    y: Math.round(op.y),
    width,
    height
  };
  const patches = [
    {
      path: ["nodes", doc.nodes.length],
      value: newNode,
      isArrayInsertion: true
    },
    {
      path: ["layout", "nodes", op.id],
      value: layoutBox
    }
  ];
  return { ok: true, patches, createdIds: [op.id] };
}
function applyUpdateNode(doc, op) {
  const idx = doc.nodes.findIndex((n) => n.id === op.nodeId);
  if (idx === -1) {
    return { ok: false, error: `Node "${op.nodeId}" not found.` };
  }
  const existingNode = doc.nodes[idx];
  if (!getUmlNodeKind(existingNode.kind)) {
    return {
      ok: false,
      error: `Node "${op.nodeId}" has unsupported kind "${existingNode.kind}" and is read-only.`
    };
  }
  const patches = [];
  if (op.name !== void 0) {
    patches.push({ path: ["nodes", idx, "name"], value: op.name.trim() });
  }
  if (op.stereotype !== void 0) {
    patches.push({
      path: ["nodes", idx, "stereotype"],
      value: op.stereotype.trim() || void 0
    });
  }
  if (op.text !== void 0) {
    patches.push({ path: ["nodes", idx, "text"], value: op.text });
  }
  if (op.shape !== void 0) {
    patches.push({ path: ["nodes", idx, "shape"], value: op.shape });
  }
  if (op.children !== void 0) {
    patches.push({ path: ["nodes", idx, "children"], value: op.children });
  }
  if (op.line !== void 0) {
    patches.push({ path: ["nodes", idx, "line"], value: op.line === "solid" ? void 0 : op.line });
  }
  if (op.showAttributes !== void 0) {
    patches.push({ path: ["nodes", idx, "showAttributes"], value: op.showAttributes });
  }
  if (op.showOperations !== void 0) {
    patches.push({ path: ["nodes", idx, "showOperations"], value: op.showOperations });
  }
  if (op.attributes !== void 0) {
    patches.push({ path: ["nodes", idx, "attributes"], value: op.attributes });
  }
  if (op.operations !== void 0) {
    patches.push({ path: ["nodes", idx, "operations"], value: op.operations });
  }
  return { ok: true, patches };
}
function applyMoveResizeNodes(doc, op) {
  const patches = [];
  for (const [nodeId, box] of Object.entries(op.updates)) {
    if (!doc.nodes.some((n) => n.id === nodeId)) {
      return { ok: false, error: `Cannot move non-existent node "${nodeId}".` };
    }
    const existingLayout = doc.layout.nodes[nodeId] ?? {};
    patches.push({
      path: ["layout", "nodes", nodeId],
      value: {
        ...existingLayout,
        x: Math.round(box.x),
        y: Math.round(box.y),
        width: Math.max(60, Math.round(box.width)),
        height: Math.max(40, Math.round(box.height))
      }
    });
  }
  if (op.frameChildrenUpdates) {
    for (const [frameId, children] of Object.entries(op.frameChildrenUpdates)) {
      const idx = doc.nodes.findIndex((n) => n.id === frameId);
      if (idx !== -1) {
        patches.push({
          path: ["nodes", idx, "children"],
          value: children
        });
      }
    }
  }
  return { ok: true, patches };
}
function applyDeleteEntities(doc, op) {
  const patches = [];
  const delNodes = new Set(op.nodeIds);
  const delEdges = new Set(op.edgeIds);
  for (const edge of doc.edges) {
    if (delNodes.has(edge.source.nodeId) || delNodes.has(edge.target.nodeId)) {
      delEdges.add(edge.id);
    }
  }
  if (delNodes.size > 0) {
    const remainingNodes = doc.nodes.filter((n) => !delNodes.has(n.id)).map((n) => {
      if (n.kind === "frame" && n.children) {
        const cleanedChildren = n.children.filter((cid) => !delNodes.has(cid));
        if (cleanedChildren.length !== n.children.length) {
          return { ...n, children: cleanedChildren };
        }
      }
      return n;
    });
    patches.push({ path: ["nodes"], value: remainingNodes });
    for (const nodeId of delNodes) {
      if (nodeId in doc.layout.nodes) {
        patches.push({ path: ["layout", "nodes", nodeId], value: void 0 });
      }
    }
  }
  if (delEdges.size > 0) {
    const remainingEdges = doc.edges.filter((e) => !delEdges.has(e.id));
    patches.push({ path: ["edges"], value: remainingEdges });
    for (const edgeId of delEdges) {
      if (edgeId in doc.layout.edges) {
        patches.push({ path: ["layout", "edges", edgeId], value: void 0 });
      }
    }
  }
  return { ok: true, patches };
}
function applyDuplicateSelection(doc, op) {
  const patches = [];
  const createdIds = [];
  const selectedNodeSet = new Set(op.nodeIds);
  const existingNodeIds = new Set(doc.nodes.map((n) => n.id));
  const existingEdgeIds = new Set(doc.edges.map((e) => e.id));
  const nodeIdMap = /* @__PURE__ */ new Map();
  const offsetX = op.offsetX ?? 40;
  const offsetY = op.offsetY ?? 40;
  const stripCustom = Boolean(op.stripCustomData);
  const clonedNodes = [];
  for (const node of doc.nodes) {
    if (!selectedNodeSet.has(node.id)) continue;
    const newId = generateCloneId(node.id, existingNodeIds);
    nodeIdMap.set(node.id, newId);
    createdIds.push(newId);
    const descriptor = getUmlNodeKind(node.kind);
    if (stripCustom) {
      const nextNum = doc.nodes.length + clonedNodes.length + 1;
      const freshNameMap = {
        class: `Class${nextNum}`,
        note: `Note ${nextNum}`,
        shape: `Shape ${nextNum}`,
        frame: `Frame ${nextNum}`
      };
      const freshId = `${node.kind}-${Date.now().toString(36).slice(-4)}-${clonedNodes.length + 1}`;
      existingNodeIds.delete(newId);
      existingNodeIds.add(freshId);
      nodeIdMap.set(node.id, freshId);
      createdIds[createdIds.length - 1] = freshId;
      const defaultNode = {
        id: freshId,
        kind: node.kind,
        name: freshNameMap[node.kind] ?? `Entity${nextNum}`
      };
      if (descriptor?.defaultStereotype) {
        defaultNode.stereotype = descriptor.defaultStereotype;
      }
      if (node.kind === "note") {
        defaultNode.text = "Design note...";
      } else if (node.kind === "shape") {
        defaultNode.shape = node.shape ?? "rectangle";
      } else if (descriptor?.hasCompartments !== false) {
        defaultNode.attributes = [
          {
            id: `${freshId}-attr-1`,
            visibility: "+",
            name: "id",
            type: "string"
          }
        ];
        defaultNode.operations = [
          {
            id: `${freshId}-op-1`,
            visibility: "+",
            name: "validate",
            signature: "()",
            returnType: "boolean",
            parameters: []
          }
        ];
      }
      clonedNodes.push(defaultNode);
    } else {
      const attrCopy = node.attributes?.map((attr, idx) => ({
        ...attr,
        id: `${newId}-attr-${idx + 1}`
      }));
      const opCopy = node.operations?.map((method, idx) => ({
        ...method,
        id: `${newId}-op-${idx + 1}`,
        ...method.parameters ? {
          parameters: method.parameters.map((p, pIdx) => ({
            ...p,
            id: `${newId}-op-${idx + 1}-param-${pIdx + 1}`
          }))
        } : {}
      }));
      const clonedNode = {
        ...node,
        id: newId,
        name: `${node.name}Copy`
      };
      if (node.children) {
        clonedNode.children = node.children.map((cid) => nodeIdMap.get(cid)).filter((cid) => Boolean(cid));
      }
      if (attrCopy) clonedNode.attributes = attrCopy;
      if (opCopy) clonedNode.operations = opCopy;
      clonedNodes.push(clonedNode);
    }
    const origLayout = doc.layout.nodes[node.id] ?? {
      x: 80,
      y: 80,
      width: descriptor?.defaultWidth ?? 220,
      height: descriptor?.defaultHeight ?? 140
    };
    const targetCloneId = nodeIdMap.get(node.id) ?? newId;
    patches.push({
      path: ["layout", "nodes", targetCloneId],
      value: {
        x: Math.round((origLayout.x + offsetX) / 20) * 20,
        y: Math.round((origLayout.y + offsetY) / 20) * 20,
        width: origLayout.width,
        height: origLayout.height
      }
    });
  }
  if (clonedNodes.length > 0) {
    patches.push({
      path: ["nodes"],
      value: [...doc.nodes, ...clonedNodes]
    });
  }
  const selectedEdgeSet = new Set(op.edgeIds);
  const clonedEdges = [];
  for (const edge of doc.edges) {
    const bothEndsCloned = nodeIdMap.has(edge.source.nodeId) && nodeIdMap.has(edge.target.nodeId);
    const explicitlySelected = selectedEdgeSet.has(edge.id);
    if (!bothEndsCloned && !explicitlySelected) continue;
    if (clonedNodes.length > 0 && !bothEndsCloned) continue;
    const newEdgeId = generateCloneId(edge.id, existingEdgeIds);
    createdIds.push(newEdgeId);
    const preset = getUmlRelationPreset(edge.kind);
    clonedEdges.push({
      ...stripCustom ? {} : edge,
      id: newEdgeId,
      kind: edge.kind,
      source: {
        ...stripCustom ? {} : edge.source,
        nodeId: nodeIdMap.get(edge.source.nodeId) ?? edge.source.nodeId
      },
      target: {
        ...stripCustom ? {} : edge.target,
        nodeId: nodeIdMap.get(edge.target.nodeId) ?? edge.target.nodeId
      },
      ...stripCustom ? {
        visual: {
          line: preset?.line ?? "solid",
          routing: preset?.routing ?? "default",
          start: { ...preset?.start ?? { shape: "none", size: 10 } },
          end: { ...preset?.end ?? { shape: "none", size: 10 } }
        }
      } : {}
    });
  }
  if (clonedEdges.length > 0) {
    patches.push({
      path: ["edges"],
      value: [...doc.edges, ...clonedEdges]
    });
  }
  return { ok: true, patches, createdIds };
}

// src/shared/operations/index.ts
function applyUmlOperationToText(rawText, op) {
  const parsed = parseAndValidateDocument(rawText, "uml");
  if (!parsed.ok || !parsed.document) {
    return {
      ok: false,
      error: parsed.issues[0]?.message ?? "Cannot apply UML operation to an invalid document."
    };
  }
  const doc = parsed.document;
  let result;
  switch (op.type) {
    case "uml.updateMetadata":
      result = applyUpdateMetadata(doc, op);
      break;
    case "uml.migrateDocument":
      result = applyMigrateDocument(doc, op);
      break;
    case "uml.addNode":
      result = applyAddNode(doc, op);
      break;
    case "uml.updateNode":
      result = applyUpdateNode(doc, op);
      break;
    case "uml.moveResizeNodes":
      result = applyMoveResizeNodes(doc, op);
      break;
    case "uml.deleteEntities":
      result = applyDeleteEntities(doc, op);
      break;
    case "uml.duplicateSelection":
      result = applyDuplicateSelection(doc, op);
      break;
    case "uml.addEdge":
      result = applyAddEdge(doc, op);
      break;
    case "uml.updateEdge":
      result = applyUpdateEdge(doc, op);
      break;
    case "uml.updateEndpoint":
      result = applyUpdateEndpoint(doc, op);
      break;
    default: {
      const exhaustiveCheck = op;
      return {
        ok: false,
        error: `Unhandled operation type: ${exhaustiveCheck?.type ?? "unknown"}`
      };
    }
  }
  if (!result.ok) {
    return { ok: false, error: result.error };
  }
  const patches = result.patches;
  const createdIds = result.createdIds ?? [];
  if (patches.length === 0) {
    return { ok: true, updatedText: rawText, edits: [], createdIds };
  }
  const { updatedText, edits } = computeMinimalJsonEdits(rawText, patches);
  const revalidated = parseAndValidateDocument(updatedText, "uml");
  if (!revalidated.ok) {
    return {
      ok: false,
      error: revalidated.issues[0]?.message ?? "Operation produced an invalid UML document state and was rejected."
    };
  }
  return { ok: true, updatedText, edits, createdIds };
}

// src/extension/coordinator/workspace-edit-pipeline.ts
var WorkspaceEditPipeline = class {
  /**
   * Checks whether the underlying document is read-only (e.g. git diff, virtual file).
   */
  static isDocumentReadOnly(document) {
    const scheme = document.uri.scheme;
    return scheme !== "file" && scheme !== "untitled";
  }
  /**
   * Applies a semantic UML operation to the document atomically:
   * 1. Validates document is not read-only.
   * 2. Checks concurrency token (document.version === expectedVersion) to prevent lost updates.
   * 3. Calculates minimal JSON edits via applyUmlOperationToText.
   * 4. Re-verifies concurrency token immediately before applying edits.
   * 5. Translates TextSpanEdit[] into vscode.Range replacement spans.
   * 6. Commits vscode.workspace.applyEdit(WorkspaceEdit).
   */
  static async applyOperation(document, expectedVersion, operation) {
    if (this.isDocumentReadOnly(document)) {
      return { ok: false, applied: false, error: "Document is read-only." };
    }
    if (document.version !== expectedVersion) {
      return {
        ok: false,
        applied: false,
        staleRejected: true,
        error: "Document changed externally during gesture. View refreshed."
      };
    }
    const rawText = document.getText();
    const result = applyUmlOperationToText(rawText, operation);
    if (!result.ok || !result.edits) {
      return {
        ok: false,
        applied: false,
        error: result.error ?? "Operation failed validation."
      };
    }
    if (result.edits.length === 0) {
      return {
        ok: true,
        applied: true,
        createdIds: result.createdIds
      };
    }
    if (document.version !== expectedVersion) {
      return {
        ok: false,
        applied: false,
        staleRejected: true,
        error: "Document changed concurrently before edit could be committed."
      };
    }
    const wsEdit = new vscode9.WorkspaceEdit();
    for (const span of result.edits) {
      const range = new vscode9.Range(
        document.positionAt(span.offset),
        document.positionAt(span.offset + span.length)
      );
      wsEdit.replace(document.uri, range, span.content);
    }
    const applied = await vscode9.workspace.applyEdit(wsEdit);
    return {
      ok: applied,
      applied,
      createdIds: applied ? result.createdIds : void 0,
      error: applied ? void 0 : "VS Code rejected WorkspaceEdit."
    };
  }
  /**
   * Atomically initializes an empty document with default JSON schema content.
   */
  static async applyDefaultInitialization(document, kind) {
    if (this.isDocumentReadOnly(document)) {
      return false;
    }
    const tokenBefore = document.version;
    const textBefore = document.getText();
    if (!isEmptyOrWhitespaceDocument(textBefore)) {
      return false;
    }
    const defaultContent = serializeDefaultDocument(
      kind,
      document.uri.fsPath || document.uri.path
    );
    if (document.version !== tokenBefore || !isEmptyOrWhitespaceDocument(document.getText())) {
      return false;
    }
    const fullRange = new vscode9.Range(
      document.positionAt(0),
      document.positionAt(textBefore.length)
    );
    const edit = new vscode9.WorkspaceEdit();
    edit.replace(document.uri, fullRange, defaultContent);
    return await vscode9.workspace.applyEdit(edit);
  }
};

// src/extension/coordinator/document-coordinator.ts
var DocumentCoordinator = class {
  constructor(document, kind, diagnostics, onAllPanelsAndDocumentClosed) {
    this.document = document;
    this.kind = kind;
    this.diagnostics = diagnostics;
    this.onAllPanelsAndDocumentClosed = onAllPanelsAndDocumentClosed;
    this.uriKey = document.uri.toString();
    this.exportService = new ExportService(document);
    this.disposables.push(
      vscode10.workspace.onDidChangeTextDocument((e) => {
        if (e.document.uri.toString() === this.uriKey) {
          this.scheduleRevalidateAndBroadcast();
        }
      }),
      vscode10.workspace.onDidCloseTextDocument((closedDoc) => {
        if (closedDoc.uri.toString() === this.uriKey) {
          this.diagnostics.clearDiagnostics(closedDoc.uri);
          this.onAllPanelsAndDocumentClosed(this.uriKey);
        }
      })
    );
  }
  uriKey;
  panels = /* @__PURE__ */ new Set();
  disposables = [];
  exportService;
  initializationConsidered = false;
  isInitializing = false;
  lastValidDocument;
  operationQueue = Promise.resolve();
  validationDebounceTimer;
  get hasActivePanel() {
    for (const entry of this.panels) {
      if (entry.panel.active) return true;
    }
    return false;
  }
  get lastValidDoc() {
    return this.lastValidDocument;
  }
  attachPanel(panel) {
    const entry = { panel, ready: false };
    this.panels.add(entry);
    const msgListener = panel.webview.onDidReceiveMessage((rawMsg) => {
      void this.handleWebviewMessage(entry, rawMsg);
    });
    const viewStateListener = panel.onDidChangeViewState(() => {
      if (panel.visible && entry.ready) {
        this.sendSnapshotToPanel(entry.panel);
      }
    });
    panel.onDidDispose(() => {
      msgListener.dispose();
      viewStateListener.dispose();
      this.panels.delete(entry);
    });
  }
  broadcastCommand(command, onlyActive = false) {
    const msg = { type: "host.command", command };
    for (const entry of this.panels) {
      if (!entry.ready) continue;
      if (onlyActive && !entry.panel.active) continue;
      void entry.panel.webview.postMessage(msg);
    }
  }
  restoreFocus(panel) {
    if (!panel) return;
    void panel.webview.postMessage({
      type: "host.command",
      command: "restoreCanvasFocus"
    });
  }
  enqueueOperation(task) {
    const resultPromise = this.operationQueue.then(task, task);
    this.operationQueue = resultPromise.then(() => {
    }, () => {
    });
    return resultPromise;
  }
  async maybeAutoInitializeOnFirstOpen() {
    if (this.initializationConsidered || this.isInitializing) return;
    this.initializationConsidered = true;
    if (WorkspaceEditPipeline.isDocumentReadOnly(this.document)) return;
    if (!isEmptyOrWhitespaceDocument(this.document.getText())) return;
    await this.applyDefaultInitializationEdit();
  }
  async explicitlyInitializeEmptyDocument() {
    if (WorkspaceEditPipeline.isDocumentReadOnly(this.document)) {
      void vscode10.window.showWarningMessage("Cannot initialize a read-only Vizion document.");
      return;
    }
    if (!isEmptyOrWhitespaceDocument(this.document.getText())) {
      void vscode10.window.showWarningMessage("Document is not empty. Vizion never overwrites non-empty content.");
      return;
    }
    await this.applyDefaultInitializationEdit();
    this.revalidateAndBroadcast();
  }
  async applyDefaultInitializationEdit() {
    if (this.isInitializing) return;
    this.isInitializing = true;
    try {
      const applied = await WorkspaceEditPipeline.applyDefaultInitialization(
        this.document,
        this.kind
      );
      if (!applied) {
        void vscode10.window.showErrorMessage("Vizion could not apply default initialization to the document.");
      }
    } finally {
      this.isInitializing = false;
    }
  }
  async executeOperationRequest(requestingPanel, requestId, expectedVersion, operation) {
    const result = await WorkspaceEditPipeline.applyOperation(
      this.document,
      expectedVersion,
      operation
    );
    if (requestingPanel) {
      void requestingPanel.webview.postMessage({
        type: "host.operationResult",
        requestId,
        ok: result.ok,
        createdIds: result.createdIds,
        error: result.error,
        staleRejected: result.staleRejected
      });
      if (result.staleRejected) {
        this.sendSnapshotToPanel(requestingPanel);
      }
    }
    if (result.applied) {
      this.revalidateAndBroadcast();
    }
  }
  createFlowContext(panel, expectedVersion = this.document.version) {
    return {
      document: this.document,
      panel,
      expectedVersion,
      getLastValidDocument: () => this.lastValidDocument,
      enqueueOperation: (task) => this.enqueueOperation(task),
      executeOperation: (targetPanel, reqId, expVer, op) => this.executeOperationRequest(targetPanel, reqId, expVer, op),
      restoreFocus: (targetPanel) => this.restoreFocus(targetPanel ?? panel)
    };
  }
  async handleWebviewMessage(entry, msg) {
    if (!msg || typeof msg !== "object" || typeof msg.type !== "string") return;
    switch (msg.type) {
      case "webview.ready":
        entry.ready = true;
        await this.maybeAutoInitializeOnFirstOpen();
        this.revalidateAndBroadcast();
        break;
      case "webview.recheck":
        this.revalidateAndBroadcast();
        break;
      case "webview.openAsText":
        await vscode10.commands.executeCommand(
          "vscode.openWith",
          this.document.uri,
          "default",
          entry.panel.viewColumn
        );
        break;
      case "webview.showProblems":
        await vscode10.commands.executeCommand("workbench.actions.view.problems");
        break;
      case "webview.initializeEmpty":
        await this.explicitlyInitializeEmptyDocument();
        break;
      case "webview.operation":
        this.enqueueOperation(async () => {
          await this.executeOperationRequest(
            entry.panel,
            msg.requestId,
            msg.expectedDocumentVersion,
            msg.operation
          );
        });
        break;
      case "webview.promptAddUmlNode":
        await promptAddUmlNodeFlow(
          this.createFlowContext(entry.panel, msg.expectedDocumentVersion),
          { x: msg.x, y: msg.y, defaultKind: msg.defaultKind }
        );
        break;
      case "webview.promptAddUmlEdge":
        await promptAddUmlEdgeFlow(
          this.createFlowContext(entry.panel, msg.expectedDocumentVersion),
          {
            sourceNodeId: msg.sourceNodeId,
            targetNodeId: msg.targetNodeId,
            defaultKind: msg.defaultKind
          }
        );
        break;
      case "webview.promptEndpointDecoration":
        await promptEndpointDecorationFlow(
          this.createFlowContext(entry.panel, msg.expectedDocumentVersion),
          {
            edgeId: msg.edgeId,
            end: msg.end,
            currentDecoration: msg.currentDecoration
          }
        );
        break;
      case "webview.promptRenameEntity":
        await promptRenameEntityFlow(
          this.createFlowContext(entry.panel, msg.expectedDocumentVersion),
          {
            targetKind: msg.targetKind,
            targetId: msg.targetId,
            memberId: msg.memberId,
            currentValue: msg.currentValue
          }
        );
        break;
      case "webview.promptChangeRelationKind":
        await promptChangeRelationKindFlow(
          this.createFlowContext(entry.panel, msg.expectedDocumentVersion),
          {
            edgeId: msg.edgeId,
            currentKind: msg.currentKind
          }
        );
        break;
      case "webview.undo":
        if (!WorkspaceEditPipeline.isDocumentReadOnly(this.document)) {
          this.enqueueOperation(async () => {
            await vscode10.commands.executeCommand("undo");
          });
        }
        break;
      case "webview.redo":
        if (!WorkspaceEditPipeline.isDocumentReadOnly(this.document)) {
          this.enqueueOperation(async () => {
            await vscode10.commands.executeCommand("redo");
          });
        }
        break;
      case "webview.exportFile":
        await this.exportService.exportDiagram({
          format: msg.format,
          base64Data: msg.base64Data,
          svgData: msg.svgData,
          defaultFileName: msg.defaultFileName
        });
        break;
      case "webview.copyImageToClipboard":
        await this.exportService.copyImageToClipboard(msg.base64Data);
        break;
      case "webview.copyToClipboard":
        await this.exportService.copyTextToClipboard(msg.content, msg.format.toUpperCase());
        break;
      case "webview.checkForExtensionUpdate":
        try {
          await vscode10.commands.executeCommand("workbench.extensions.action.checkForUpdates");
          await vscode10.commands.executeCommand("workbench.extensions.search", "@installed Vizion");
        } catch {
          void vscode10.window.showInformationMessage("Please check the Extensions view for the latest Vizion update.");
        }
        break;
    }
  }
  scheduleRevalidateAndBroadcast() {
    if (this.validationDebounceTimer) {
      clearTimeout(this.validationDebounceTimer);
    }
    this.validationDebounceTimer = setTimeout(() => {
      this.revalidateAndBroadcast();
    }, 45);
  }
  revalidateAndBroadcast() {
    const snapshot = this.computeSnapshot();
    this.diagnostics.updateDiagnostics(this.document, snapshot.issues);
    for (const entry of this.panels) {
      if (entry.ready) {
        void entry.panel.webview.postMessage(snapshot);
      }
    }
  }
  sendSnapshotToPanel(panel) {
    const snapshot = this.computeSnapshot();
    void panel.webview.postMessage(snapshot);
  }
  computeSnapshot() {
    const rawText = this.document.getText();
    const isEmpty = isEmptyOrWhitespaceDocument(rawText);
    const parsed = parseAndValidateDocument(rawText, this.kind);
    if (parsed.ok && parsed.document) {
      this.lastValidDocument = parsed.document;
    }
    return {
      type: "host.snapshot",
      expectedKind: this.kind,
      documentVersion: this.document.version,
      isReadOnly: WorkspaceEditPipeline.isDocumentReadOnly(this.document),
      isEmptyDocument: isEmpty,
      canExplicitlyInitialize: isEmpty && !WorkspaceEditPipeline.isDocumentReadOnly(this.document),
      valid: parsed.ok,
      document: parsed.document,
      lastValidDocument: parsed.ok ? void 0 : this.lastValidDocument,
      issues: parsed.issues,
      hasUnsupportedConstructs: parsed.hasUnsupportedConstructs
    };
  }
  dispose() {
    if (this.validationDebounceTimer) {
      clearTimeout(this.validationDebounceTimer);
    }
    for (const d of this.disposables) {
      d.dispose();
    }
    this.disposables.length = 0;
    this.panels.clear();
  }
};

// src/extension/coordinator/coordinator-registry.ts
var CoordinatorRegistry = class {
  constructor(diagnostics) {
    this.diagnostics = diagnostics;
  }
  coordinators = /* @__PURE__ */ new Map();
  acquire(document, kind) {
    const key = document.uri.toString();
    const existing = this.coordinators.get(key);
    if (existing) {
      return existing;
    }
    const created = new DocumentCoordinator(
      document,
      kind,
      this.diagnostics,
      (closedKey) => {
        const coord = this.coordinators.get(closedKey);
        if (coord) {
          coord.dispose();
          this.coordinators.delete(closedKey);
        }
      }
    );
    this.coordinators.set(key, created);
    return created;
  }
  getActiveCoordinator() {
    for (const coord of this.coordinators.values()) {
      if (coord.hasActivePanel) {
        return coord;
      }
    }
    return void 0;
  }
  dispose() {
    for (const coord of this.coordinators.values()) {
      coord.dispose();
    }
    this.coordinators.clear();
  }
};

// src/extension/providers/uml-provider.ts
var vscode12 = __toESM(require("vscode"));

// src/extension/webviews/html.ts
var crypto = __toESM(require("crypto"));
var fs2 = __toESM(require("fs"));
var vscode11 = __toESM(require("vscode"));
function readAssetText(extensionUri, fileName) {
  try {
    const fullPath = vscode11.Uri.joinPath(extensionUri, "media", fileName).fsPath;
    return fs2.readFileSync(fullPath, "utf8");
  } catch (err) {
    return `console.error("Failed to read ${fileName}:", ${JSON.stringify(String(err))});`;
  }
}
function buildWebviewHtml(webview, extensionUri, editorKind, initialSnapshot) {
  const nonce = crypto.randomBytes(16).toString("base64");
  const styleContent = readAssetText(extensionUri, "webview.css");
  const scriptContent = readAssetText(extensionUri, "webview.js").replace(
    /<\/script>/gi,
    "<\\/script>"
  );
  const serializedSnapshot = JSON.stringify(initialSnapshot).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");
  const csp = [
    `default-src 'none'`,
    `img-src ${webview.cspSource} data: blob:`,
    `style-src ${webview.cspSource} 'unsafe-inline'`,
    `font-src ${webview.cspSource} data:`,
    `script-src 'nonce-${nonce}'`
  ].join("; ");
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="Content-Security-Policy" content="${csp}" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Vizion ${editorKind.toUpperCase()} Editor</title>
  <style nonce="${nonce}">
${styleContent}
  </style>
</head>
<body data-vizion-kind="${editorKind}">
  <div id="app">
    <div style="padding: 16px; color: var(--vscode-descriptionForeground);">Loading Vizion ${editorKind.toUpperCase()} Canvas\u2026</div>
  </div>
  <script nonce="${nonce}">
    window.__VIZION_INITIAL_SNAPSHOT__ = ${serializedSnapshot};
    window.addEventListener('error', function(e) {
      var el = document.getElementById('app');
      if (el) {
        el.innerHTML = '<div style="padding:20px;color:var(--vscode-errorForeground);font-family:monospace;"><strong>Vizion Webview Error:</strong><pre>' + (e.error && e.error.stack ? e.error.stack : e.message) + '</pre></div>';
      }
    });
  </script>
  <script nonce="${nonce}">
${scriptContent}
  </script>
</body>
</html>`;
}

// src/extension/providers/uml-provider.ts
var UmlEditorProvider = class {
  constructor(extensionUri, registry) {
    this.extensionUri = extensionUri;
    this.registry = registry;
  }
  static viewType = "vizion.uml";
  async resolveCustomTextEditor(document, webviewPanel, _token) {
    webviewPanel.webview.options = {
      enableScripts: true,
      localResourceRoots: [vscode12.Uri.joinPath(this.extensionUri, "media")]
    };
    const coordinator = this.registry.acquire(document, "uml");
    coordinator.attachPanel(webviewPanel);
    await coordinator.maybeAutoInitializeOnFirstOpen();
    const initialSnapshot = coordinator.computeSnapshot();
    webviewPanel.webview.html = buildWebviewHtml(
      webviewPanel.webview,
      this.extensionUri,
      "uml",
      initialSnapshot
    );
  }
};

// src/extension/activate.ts
function activate(context) {
  const diagnostics = new VizionDiagnosticsManager();
  const registry = new CoordinatorRegistry(diagnostics);
  context.subscriptions.push(
    diagnostics,
    registry,
    vscode13.window.registerCustomEditorProvider(
      UmlEditorProvider.viewType,
      new UmlEditorProvider(context.extensionUri, registry),
      {
        webviewOptions: {
          // Prefer rebuilding state from the authoritative host snapshot on hide/show
          // rather than keeping every hidden webview alive in memory (Section 6.4)
          retainContextWhenHidden: false
        },
        supportsMultipleEditorsPerDocument: true
      }
    )
  );
  registerVizionCommands(context, registry);
}
function deactivate() {
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
//# sourceMappingURL=extension.cjs.map
