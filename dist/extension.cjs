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
var vscode6 = __toESM(require("vscode"));

// src/extension/commands/index.ts
var path = __toESM(require("path"));
var vscode = __toESM(require("vscode"));

// src/shared/documents/templates.ts
function deriveDefaultTitle(filenameOrPath, _kind = "uml") {
  const base = filenameOrPath.split(/[\\/]/).pop() ?? "";
  const stripped = base.replace(/\.uml\.viz$/i, "").replace(/\.viz$/i, "").trim();
  if (!stripped) {
    return "Domain";
  }
  return stripped.split(/[-_.\s]+/).filter(Boolean).map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}
function createDefaultUmlDocument(title = "Domain") {
  return {
    format: "vizion",
    kind: "uml",
    title: title || "Domain",
    ai: {
      purpose: "Describe classes, notes, shapes, and explicitly typed relationships.",
      interpretation: [
        'Document Structure: Standalone unversioned JSON document. Root required fields are: "format" (must be "vizion"), "kind" (must be "uml"), "title" (string), "ai" (guidance object with "purpose", "interpretation", "editingRules"), "nodes" (array), "edges" (array), and "layout" (object with "nodes" and "edges"). NEVER add version fields like "version" or "schemaVersion".',
        'Node Types & Properties ("nodes[]"): Each node must have "id" (unique string) and "kind" ("class" | "shape" | "note"). Optional common fields: "name" (display label string), "stereotype" (architectural role string, e.g. "entity", "service", "value", "aggregate", "controller"). For "note" nodes, prose is stored in "text" (markdown/plain text).',
        'Geometric Shapes ("kind": "shape"): Must specify "shape" geometry as one of: "ellipse" | "rectangle" | "rhombus" | "trapezoid" | "parallelogram". The node "name" is rendered as the centered label.',
        'Class Members & Compartments ("kind": "class"): Supports "attributes" array and "operations" array. Section visibility can be toggled via boolean flags "showAttributes" and "showOperations" (default true).',
        'Attributes Format: Each attribute object requires "id" (unique string), "visibility" (one of: "+" [public], "-" [private], "#" [protected], "~" [package/internal]), "name" (string), and "type" (type string e.g. "string", "number", "Date").',
        'Operations Format: Each operation object requires "id" (unique string), "visibility" ("+" | "-" | "#" | "~"), "name" (method name string), "returnType" (return type string, e.g. "void", "Promise<T>", "boolean"), "signature" (e.g. "(id: string, count: number)"), and "parameters" array of argument objects ({ "id": string, "name": string, "type": string }).',
        'Relationships ("edges[]"): Defines connections between nodes. Required fields: "id" (unique string), "kind" (relationship semantic type: "association" | "dependency" | "generalization" | "realization" | "aggregation" | "composition"), "source" ({ "nodeId": string, "multiplicity"?: string }), and "target" ({ "nodeId": string, "multiplicity"?: string }). Optional "label" (string rendered at midpoint).',
        'Endpoint Multiplicities: Expressed as cardinality strings on endpoints: "source.multiplicity" and "target.multiplicity" (e.g. "1", "*", "0..1", "1..*", "0..n", or omit/empty if none).',
        'Visual Presentation ("edge.visual"): Optional visual options: "line" ("solid" | "dashed"), "routing" ("straight" | "bezier"), and endpoint decorations "start" / "end" ({ "shape": "none" | "circle" | "diamond" | "square" | "triangle" | "open-arrow", "fill"?: "hollow" | "filled", "size"?: number }). Only closed shapes support "fill". Standard semantic defaults: generalization = hollow triangle end; realization = dashed with hollow triangle end; aggregation = hollow diamond start; composition = filled diamond start; dependency = dashed with open-arrow end; association = solid line with none ends.',
        'Canvas Layout ("layout.nodes"): Bounding box for every node keyed by nodeId: { "x": number, "y": number, "width": number, "height": number }. Coordinates snap to a 20px grid (multiples of 20). Width >= 100, height >= 60 for classes; width >= 80, height >= 50 for shapes; width >= 120, height >= 60 for notes.',
        "Architectural Model Scope: This diagram is a selective architectural view. Absence of elements or relationships does not imply absence in the underlying implementation code."
      ],
      editingRules: [
        "Strict JSON Conformity: Output strictly valid standard JSON with 2-space indentation. Never use JavaScript comments, trailing commas, single quotes, or unquoted identifiers.",
        'Never Add Versioning: This format is permanently unversioned. Do NOT output "version", "schemaVersion", "formatVersion", or "instructionsVersion" at root or in any sub-object.',
        'Referential Integrity: Every "source.nodeId" and "target.nodeId" in "edges[]" MUST exactly match an existing node "id" in "nodes[]". When removing a node from "nodes[]", you must atomically delete all edges referencing its ID.',
        'Layout Synchronization: Every node added to "nodes[]" MUST have a corresponding bounding box in "layout.nodes[nodeId]" ({ "x": number, "y": number, "width": number, "height": number }) aligned to a 20px grid. When deleting a node, delete its layout entry.',
        'Preserve Existing Identifiers: Never alter existing "id" strings when updating nodes, edges, attributes, operations, or parameters. When creating new entities, generate clean, unique kebab-case IDs (e.g., "node-order-service", "edge-order-payment-1", "order-attr-status", "order-op-cancel", "cancel-arg-reason").',
        'Allowed Enums & Data Values: Strictly use only documented enum values \u2014 node kinds: "class"|"shape"|"note"; shapes: "ellipse"|"rectangle"|"rhombus"|"trapezoid"|"parallelogram"; edge kinds: "association"|"dependency"|"generalization"|"realization"|"aggregation"|"composition"; visibilities: "+"|"-"|"#"|"~"; endpoint shapes: "none"|"circle"|"diamond"|"square"|"triangle"|"open-arrow"; fills: "hollow"|"filled".',
        'Preserve Unknown & Custom Fields: Preserve all unrecognized top-level and nested properties, annotations, extension keys, and this "ai" section intact across edits.',
        "Non-Interference with Source Code: Do not modify repository application source code when asked to edit this architecture diagram, unless the user explicitly requests code changes."
      ]
    },
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

// src/extension/commands/index.ts
async function resolveTargetFolder(contextUri) {
  if (contextUri) {
    try {
      const stat = await vscode.workspace.fs.stat(contextUri);
      if ((stat.type & vscode.FileType.Directory) !== 0) {
        return contextUri;
      }
      return vscode.Uri.file(path.dirname(contextUri.fsPath));
    } catch {
    }
  }
  const firstWorkspace = vscode.workspace.workspaceFolders?.[0];
  if (firstWorkspace) {
    return vscode.Uri.joinPath(firstWorkspace.uri, ".vizion", "architecture");
  }
  const picked = await vscode.window.showOpenDialog({
    canSelectFiles: false,
    canSelectFolders: true,
    canSelectMany: false,
    openLabel: "Select Folder for Vizion File"
  });
  return picked?.[0];
}
async function createAndOpenVizionFile(contextUri) {
  const suffix = ".uml.viz";
  const defaultBase = "domain";
  const entered = await vscode.window.showInputBox({
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
    fileName = fileName.replace(/\.viz$/i, "") + suffix;
  }
  const folderUri = await resolveTargetFolder(contextUri);
  if (!folderUri) return;
  await vscode.workspace.fs.createDirectory(folderUri);
  const fileUri = vscode.Uri.joinPath(folderUri, fileName);
  try {
    await vscode.workspace.fs.stat(fileUri);
    const overwrite = await vscode.window.showWarningMessage(
      `File "${fileName}" already exists. Open existing file instead?`,
      "Open Existing",
      "Cancel"
    );
    if (overwrite !== "Open Existing") return;
  } catch {
    const initialJson = serializeDefaultDocument("uml", fileName);
    await vscode.workspace.fs.writeFile(fileUri, Buffer.from(initialJson, "utf8"));
  }
  await vscode.commands.executeCommand("vscode.openWith", fileUri, "vizion.uml");
}
function registerVizionCommands(context, registry) {
  context.subscriptions.push(
    vscode.commands.registerCommand("vizion.newUmlDiagram", async (uri) => {
      await createAndOpenVizionFile(uri);
    }),
    vscode.commands.registerCommand("vizion.initializeCurrentDocument", async () => {
      const active = registry.getActiveCoordinator();
      if (active) {
        await active.explicitlyInitializeEmptyDocument();
        return;
      }
      const editor = vscode.window.activeTextEditor;
      if (editor && editor.document.fileName.endsWith(".uml.viz")) {
        const coord = registry.acquire(editor.document, "uml");
        await coord.explicitlyInitializeEmptyDocument();
      } else {
        void vscode.window.showInformationMessage(
          "Focus an empty .uml.viz document first."
        );
      }
    }),
    vscode.commands.registerCommand("vizion.openCurrentAsText", async () => {
      const active = registry.getActiveCoordinator();
      if (active) {
        await vscode.commands.executeCommand("vscode.openWith", active.document.uri, "default");
      }
    }),
    vscode.commands.registerCommand("vizion.fitCanvasToContent", () => {
      const active = registry.getActiveCoordinator();
      active?.broadcastCommand("fitContent", true);
    }),
    vscode.commands.registerCommand("vizion.resetCanvasZoom", () => {
      const active = registry.getActiveCoordinator();
      active?.broadcastCommand("resetZoom", true);
    }),
    vscode.commands.registerCommand("vizion.exportCurrentSvg", () => {
      const active = registry.getActiveCoordinator();
      active?.broadcastCommand("requestSvgExport", true);
    })
  );
}

// src/extension/documents/diagnostics.ts
var vscode2 = __toESM(require("vscode"));
var VizionDiagnosticsManager = class {
  collection;
  constructor() {
    this.collection = vscode2.languages.createDiagnosticCollection("vizion");
  }
  updateDiagnostics(document, issues) {
    if (issues.length === 0) {
      this.collection.delete(document.uri);
      return;
    }
    const text = document.getText();
    const diagnostics = issues.map((issue) => {
      const range = this.resolveIssueRange(document, text, issue);
      const severity = issue.severity === "error" ? vscode2.DiagnosticSeverity.Error : vscode2.DiagnosticSeverity.Warning;
      const diag = new vscode2.Diagnostic(
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
      const pos = new vscode2.Position(zeroLine, zeroCol);
      return new vscode2.Range(pos, pos.translate(0, 1));
    }
    const tailKey = issue.path.split(".").pop()?.replace(/\[\d+\]$/, "");
    if (tailKey && tailKey !== "$") {
      const needle = `"${tailKey}"`;
      const idx = text.indexOf(needle);
      if (idx !== -1) {
        const start = document.positionAt(idx);
        const end = document.positionAt(idx + needle.length);
        return new vscode2.Range(start, end);
      }
    }
    return new vscode2.Range(new vscode2.Position(0, 0), new vscode2.Position(0, 1));
  }
  dispose() {
    this.collection.dispose();
  }
};

// src/extension/documents/coordinator.ts
var vscode3 = __toESM(require("vscode"));

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
function findNodeAtLocation(root, path2) {
  if (!root) {
    return void 0;
  }
  let node = root;
  for (let segment of path2) {
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
  const path2 = originalPath.slice();
  const errors = [];
  const root = parseTree(text, errors);
  let parent = void 0;
  let lastSegment = void 0;
  while (path2.length > 0) {
    lastSegment = path2.pop();
    parent = findNodeAtLocation(root, path2);
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
function modify(text, path2, value, options) {
  return setProperty(text, path2, value, options);
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

// src/shared/registry/uml-registry.ts
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
  return relationPresetRegistry.get(kind);
}
function listUmlRelationPresets() {
  return Array.from(relationPresetRegistry.values());
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
  defaultWidth: 210,
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
registerUmlRelationPreset({
  kind: "association",
  label: "Association",
  description: "Structural link between classes (solid line, no endpoint markers by default)",
  line: "solid",
  routing: "bezier",
  start: { shape: "none", size: 10 },
  end: { shape: "none", size: 10 }
});
registerUmlRelationPreset({
  kind: "dependency",
  label: "Dependency",
  description: "Uses/depends-on relationship (dashed line, open arrow at target)",
  line: "dashed",
  routing: "bezier",
  start: { shape: "none", size: 10 },
  end: { shape: "open-arrow", size: 11 }
});
registerUmlRelationPreset({
  kind: "generalization",
  label: "Generalization (Inheritance)",
  description: "Subclasses a general classifier (solid line, hollow triangle at target)",
  line: "solid",
  routing: "bezier",
  start: { shape: "none", size: 10 },
  end: { shape: "triangle", fill: "hollow", size: 12 }
});
registerUmlRelationPreset({
  kind: "realization",
  label: "Realization (Implements)",
  description: "Implements a specification contract (dashed line, hollow triangle at target)",
  line: "dashed",
  routing: "bezier",
  start: { shape: "none", size: 10 },
  end: { shape: "triangle", fill: "hollow", size: 12 }
});
registerUmlRelationPreset({
  kind: "aggregation",
  label: "Aggregation",
  description: "Whole-part weak ownership (solid line, hollow diamond at source)",
  line: "solid",
  routing: "bezier",
  start: { shape: "diamond", fill: "hollow", size: 13 },
  end: { shape: "none", size: 10 }
});
registerUmlRelationPreset({
  kind: "composition",
  label: "Composition",
  description: "Whole-part strong lifecycle ownership (solid line, filled diamond at source)",
  line: "solid",
  routing: "bezier",
  start: { shape: "diamond", fill: "filled", size: 13 },
  end: { shape: "none", size: 10 }
});

// src/shared/documents/validator.ts
var FORBIDDEN_VERSION_KEYS = [
  "version",
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
  "composition"
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
      message: 'Missing or invalid "ai" guidance object (must include purpose, interpretation, and editingRules).',
      severity: "error"
    });
    return;
  }
  for (const key of FORBIDDEN_VERSION_KEYS) {
    if (key in ai) {
      issues.push({
        path: `ai.${key}`,
        message: `Forbidden version field "${key}" in AI guidance. Vizion documents are unversioned.`,
        severity: "error"
      });
    }
  }
  if (typeof ai.purpose !== "string" || ai.purpose.trim().length === 0) {
    issues.push({
      path: "ai.purpose",
      message: "ai.purpose must be a non-empty string.",
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
      const path2 = `nodes[${idx}]`;
      if (!isPlainObject(node)) {
        issues.push({ path: path2, message: "Node entry must be an object.", severity: "error" });
        return;
      }
      if (typeof node.id !== "string" || node.id.trim().length === 0) {
        issues.push({
          path: `${path2}.id`,
          message: 'Node "id" must be a non-empty string.',
          severity: "error"
        });
      } else if (nodeIds.has(node.id)) {
        issues.push({
          path: `${path2}.id`,
          message: `Duplicate node ID "${node.id}".`,
          severity: "error"
        });
      } else {
        nodeIds.add(node.id);
      }
      if (typeof node.kind !== "string" || node.kind.trim().length === 0) {
        issues.push({
          path: `${path2}.kind`,
          message: 'Node "kind" must be a non-empty string.',
          severity: "error"
        });
      } else if (!getUmlNodeKind(node.kind)) {
        hasUnsupportedConstructs = true;
        issues.push({
          path: `${path2}.kind`,
          message: `Unsupported node kind "${node.kind}". Shown in non-destructive fallback mode.`,
          severity: "warning"
        });
      }
      if (typeof node.name !== "string") {
        issues.push({
          path: `${path2}.name`,
          message: 'Node "name" must be a string.',
          severity: "error"
        });
      }
      if (node.shape !== void 0) {
        if (typeof node.shape !== "string" || !VALID_SHAPE_GEOMETRIES.has(node.shape)) {
          issues.push({
            path: `${path2}.shape`,
            message: `Node "shape" must be one of: ${Array.from(VALID_SHAPE_GEOMETRIES).join(", ")}.`,
            severity: "error"
          });
        }
      }
      if (node.attributes !== void 0) {
        if (!Array.isArray(node.attributes)) {
          issues.push({
            path: `${path2}.attributes`,
            message: 'Node "attributes" must be an array when present.',
            severity: "error"
          });
        } else {
          const attrIds = /* @__PURE__ */ new Set();
          node.attributes.forEach((attr, aIdx) => {
            if (!isPlainObject(attr) || typeof attr.id !== "string" || typeof attr.name !== "string") {
              issues.push({
                path: `${path2}.attributes[${aIdx}]`,
                message: 'Attribute must have string "id" and "name".',
                severity: "error"
              });
            } else if (attrIds.has(attr.id)) {
              issues.push({
                path: `${path2}.attributes[${aIdx}].id`,
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
            path: `${path2}.operations`,
            message: 'Node "operations" must be an array when present.',
            severity: "error"
          });
        } else {
          const opIds = /* @__PURE__ */ new Set();
          node.operations.forEach((op, oIdx) => {
            if (!isPlainObject(op) || typeof op.id !== "string" || typeof op.name !== "string") {
              issues.push({
                path: `${path2}.operations[${oIdx}]`,
                message: 'Operation must have string "id" and "name".',
                severity: "error"
              });
            } else if (opIds.has(op.id)) {
              issues.push({
                path: `${path2}.operations[${oIdx}].id`,
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
      const path2 = `edges[${idx}]`;
      if (!isPlainObject(edge)) {
        issues.push({ path: path2, message: "Edge entry must be an object.", severity: "error" });
        return;
      }
      if (typeof edge.id !== "string" || edge.id.trim().length === 0) {
        issues.push({
          path: `${path2}.id`,
          message: 'Edge "id" must be a non-empty string.',
          severity: "error"
        });
      } else if (edgeIds.has(edge.id)) {
        issues.push({
          path: `${path2}.id`,
          message: `Duplicate edge ID "${edge.id}".`,
          severity: "error"
        });
      } else {
        edgeIds.add(edge.id);
      }
      if (typeof edge.kind !== "string" || !VALID_RELATION_KINDS.has(edge.kind)) {
        issues.push({
          path: `${path2}.kind`,
          message: `Edge "kind" must be one of: ${Array.from(VALID_RELATION_KINDS).join(", ")}.`,
          severity: "error"
        });
      }
      if (!isPlainObject(edge.source) || typeof edge.source.nodeId !== "string") {
        issues.push({
          path: `${path2}.source.nodeId`,
          message: 'Edge "source.nodeId" must be a string.',
          severity: "error"
        });
      } else if (!nodeIds.has(edge.source.nodeId)) {
        issues.push({
          path: `${path2}.source.nodeId`,
          message: `Node "${edge.source.nodeId}" does not exist.`,
          severity: "error"
        });
      }
      if (!isPlainObject(edge.target) || typeof edge.target.nodeId !== "string") {
        issues.push({
          path: `${path2}.target.nodeId`,
          message: 'Edge "target.nodeId" must be a string.',
          severity: "error"
        });
      } else if (!nodeIds.has(edge.target.nodeId)) {
        issues.push({
          path: `${path2}.target.nodeId`,
          message: `Node "${edge.target.nodeId}" does not exist.`,
          severity: "error"
        });
      }
      if (edge.visual !== void 0) {
        if (!isPlainObject(edge.visual)) {
          issues.push({
            path: `${path2}.visual`,
            message: 'Edge "visual" must be an object when present.',
            severity: "error"
          });
        } else {
          for (const endKey of ["start", "end"]) {
            const dec = edge.visual[endKey];
            if (dec !== void 0) {
              if (!isPlainObject(dec) || typeof dec.shape !== "string") {
                issues.push({
                  path: `${path2}.visual.${endKey}`,
                  message: `Endpoint "${endKey}" must be an object with a string "shape".`,
                  severity: "error"
                });
              } else {
                const shapeDesc = getEndpointShape(dec.shape);
                if (!shapeDesc) {
                  hasUnsupportedConstructs = true;
                  issues.push({
                    path: `${path2}.visual.${endKey}.shape`,
                    message: `Unknown endpoint shape "${dec.shape}". Rendering fallback marker.`,
                    severity: "warning"
                  });
                }
                if (dec.fill !== void 0 && dec.fill !== "hollow" && dec.fill !== "filled") {
                  issues.push({
                    path: `${path2}.visual.${endKey}.fill`,
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
      const path2 = `layout.nodes.${nodeId}`;
      if (!nodeIds.has(nodeId)) {
        issues.push({
          path: path2,
          message: `Layout entry references non-existent node "${nodeId}".`,
          severity: "error"
        });
        continue;
      }
      if (!isPlainObject(box) || !isFiniteCoordinate(box.x) || !isFiniteCoordinate(box.y) || !isFiniteCoordinate(box.width) || !isFiniteCoordinate(box.height) || box.width < 20 || box.height < 20) {
        issues.push({
          path: path2,
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

// src/shared/operations/index.ts
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
function applyUmlOperationToText(rawText, op) {
  const parsed = parseAndValidateDocument(rawText, "uml");
  if (!parsed.ok || !parsed.document) {
    return {
      ok: false,
      error: parsed.issues[0]?.message ?? "Cannot apply UML operation to an invalid document."
    };
  }
  const doc = parsed.document;
  const patches = [];
  const createdIds = [];
  switch (op.type) {
    case "uml.updateMetadata": {
      if (op.title !== void 0 && op.title.trim().length > 0) {
        patches.push({ path: ["title"], value: op.title.trim() });
      }
      if (op.purpose !== void 0) {
        patches.push({ path: ["ai", "purpose"], value: op.purpose.trim() });
      }
      break;
    }
    case "uml.addNode": {
      if (doc.nodes.some((n) => n.id === op.id)) {
        return { ok: false, error: `Node ID "${op.id}" already exists.` };
      }
      const descriptor = getUmlNodeKind(op.kind);
      const width = Math.max(60, Math.round(op.width ?? descriptor?.defaultWidth ?? 210));
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
      } else if (descriptor?.hasCompartments !== false) {
        newNode.attributes = [
          {
            id: `${op.id}-attr-1`,
            visibility: "+",
            name: "id",
            type: "string"
          }
        ];
        newNode.operations = [
          {
            id: `${op.id}-op-1`,
            visibility: "+",
            name: "validate",
            signature: "()",
            returnType: "boolean",
            parameters: []
          }
        ];
      }
      const layoutBox = {
        x: Math.round(op.x),
        y: Math.round(op.y),
        width,
        height
      };
      patches.push({
        path: ["nodes", doc.nodes.length],
        value: newNode,
        isArrayInsertion: true
      });
      patches.push({
        path: ["layout", "nodes", op.id],
        value: layoutBox
      });
      createdIds.push(op.id);
      break;
    }
    case "uml.updateNode": {
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
      break;
    }
    case "uml.moveResizeNodes": {
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
      break;
    }
    case "uml.deleteEntities": {
      const delNodes = new Set(op.nodeIds);
      const delEdges = new Set(op.edgeIds);
      for (const edge of doc.edges) {
        if (delNodes.has(edge.source.nodeId) || delNodes.has(edge.target.nodeId)) {
          delEdges.add(edge.id);
        }
      }
      if (delNodes.size > 0) {
        const remainingNodes = doc.nodes.filter((n) => !delNodes.has(n.id));
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
      break;
    }
    case "uml.duplicateSelection": {
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
            shape: `Shape ${nextNum}`
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
            width: stripCustom ? descriptor?.defaultWidth ?? 210 : origLayout.width,
            height: stripCustom ? descriptor?.defaultHeight ?? 140 : origLayout.height
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
              routing: preset?.routing ?? "bezier",
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
      break;
    }
    case "uml.addEdge": {
      if (doc.edges.some((e) => e.id === op.id)) {
        return { ok: false, error: `Edge ID "${op.id}" already exists.` };
      }
      if (!doc.nodes.some((n) => n.id === op.sourceNodeId)) {
        return { ok: false, error: `Source node "${op.sourceNodeId}" does not exist.` };
      }
      if (!doc.nodes.some((n) => n.id === op.targetNodeId)) {
        return { ok: false, error: `Target node "${op.targetNodeId}" does not exist.` };
      }
      const preset = getUmlRelationPreset(op.kind);
      const newEdge = {
        id: op.id,
        kind: op.kind,
        source: {
          nodeId: op.sourceNodeId
        },
        target: {
          nodeId: op.targetNodeId
        },
        ...op.label ? { label: op.label } : {},
        visual: {
          line: preset?.line ?? "solid",
          routing: preset?.routing ?? "bezier",
          start: { ...preset?.start ?? { shape: "none", size: 10 } },
          end: { ...preset?.end ?? { shape: "none", size: 10 } }
        }
      };
      patches.push({
        path: ["edges", doc.edges.length],
        value: newEdge,
        isArrayInsertion: true
      });
      createdIds.push(op.id);
      break;
    }
    case "uml.updateEdge": {
      const idx = doc.edges.findIndex((e) => e.id === op.edgeId);
      if (idx === -1) {
        return { ok: false, error: `Edge "${op.edgeId}" not found.` };
      }
      const existing = doc.edges[idx];
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
        if (!doc.nodes.some((n) => n.id === op.sourceNodeId)) {
          return { ok: false, error: `Node "${op.sourceNodeId}" does not exist.` };
        }
        patches.push({
          path: ["edges", idx, "source", "nodeId"],
          value: op.sourceNodeId
        });
      }
      if (op.targetNodeId !== void 0) {
        if (!doc.nodes.some((n) => n.id === op.targetNodeId)) {
          return { ok: false, error: `Node "${op.targetNodeId}" does not exist.` };
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
      }
      if (op.line !== void 0) {
        patches.push({
          path: ["edges", idx, "visual", "line"],
          value: op.line
        });
      }
      if (op.routing !== void 0) {
        patches.push({
          path: ["edges", idx, "visual", "routing"],
          value: op.routing
        });
      }
      break;
    }
    case "uml.updateEndpoint": {
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
      if (!doc.edges[idx].visual) {
        const preset = getUmlRelationPreset(doc.edges[idx].kind);
        patches.push({
          path: ["edges", idx, "visual"],
          value: {
            line: preset?.line ?? "solid",
            routing: preset?.routing ?? "bezier",
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
      break;
    }
  }
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

// src/extension/documents/coordinator.ts
var DocumentCoordinator = class {
  constructor(document, kind, diagnostics, onAllPanelsAndDocumentClosed) {
    this.document = document;
    this.kind = kind;
    this.diagnostics = diagnostics;
    this.onAllPanelsAndDocumentClosed = onAllPanelsAndDocumentClosed;
    this.uriKey = document.uri.toString();
    this.disposables.push(
      vscode3.workspace.onDidChangeTextDocument((e) => {
        if (e.document.uri.toString() === this.uriKey) {
          this.scheduleRevalidateAndBroadcast();
        }
      }),
      vscode3.workspace.onDidCloseTextDocument((closedDoc) => {
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
  /**
   * Tracks whether one-time empty initialization has already been considered during this
   * live `TextDocument`'s lifetime. Splitting the editor, reloading a webview, or undoing
   * back to empty will NOT re-initialize automatically.
   */
  initializationConsidered = false;
  isInitializing = false;
  lastValidDocument;
  operationQueue = Promise.resolve();
  validationDebounceTimer;
  undoStack = [];
  redoStack = [];
  get hasActivePanel() {
    for (const entry of this.panels) {
      if (entry.panel.active) {
        return true;
      }
    }
    return false;
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
  isDocumentReadOnly() {
    const scheme = this.document.uri.scheme;
    if (scheme !== "file" && scheme !== "untitled") {
      return true;
    }
    return false;
  }
  async handleWebviewMessage(entry, msg) {
    if (!msg || typeof msg !== "object" || typeof msg.type !== "string") {
      return;
    }
    switch (msg.type) {
      case "webview.ready": {
        entry.ready = true;
        await this.maybeAutoInitializeOnFirstOpen();
        this.revalidateAndBroadcast();
        break;
      }
      case "webview.recheck": {
        this.revalidateAndBroadcast();
        break;
      }
      case "webview.openAsText": {
        await vscode3.commands.executeCommand(
          "vscode.openWith",
          this.document.uri,
          "default",
          entry.panel.viewColumn
        );
        break;
      }
      case "webview.showProblems": {
        await vscode3.commands.executeCommand("workbench.actions.view.problems");
        break;
      }
      case "webview.initializeEmpty": {
        await this.explicitlyInitializeEmptyDocument();
        break;
      }
      case "webview.operation": {
        this.enqueueOperation(async () => {
          await this.executeOperationRequest(
            entry.panel,
            msg.requestId,
            msg.expectedDocumentVersion,
            msg.operation
          );
        });
        break;
      }
      case "webview.promptAddUmlNode": {
        await this.promptAddUmlNodeFlow(
          entry.panel,
          msg.expectedDocumentVersion,
          msg.x,
          msg.y,
          msg.defaultKind
        );
        break;
      }
      case "webview.promptAddUmlEdge": {
        await this.promptAddUmlEdgeFlow(
          entry.panel,
          msg.expectedDocumentVersion,
          msg.sourceNodeId,
          msg.targetNodeId,
          msg.defaultKind
        );
        break;
      }
      case "webview.promptEndpointDecoration": {
        await this.promptEndpointDecorationFlow(
          entry.panel,
          msg.expectedDocumentVersion,
          msg.edgeId,
          msg.end,
          msg.currentDecoration
        );
        break;
      }
      case "webview.promptRenameEntity": {
        await this.promptRenameEntityFlow(
          entry.panel,
          msg.expectedDocumentVersion,
          msg.targetKind,
          msg.targetId,
          msg.currentValue
        );
        break;
      }
      case "webview.promptChangeRelationKind": {
        await this.promptChangeRelationKindFlow(
          entry.panel,
          msg.expectedDocumentVersion,
          msg.edgeId,
          msg.currentKind
        );
        break;
      }
      case "webview.undo": {
        this.enqueueOperation(async () => {
          await this.performUndo();
        });
        break;
      }
      case "webview.redo": {
        this.enqueueOperation(async () => {
          await this.performRedo();
        });
        break;
      }
      case "webview.exportSvgContent": {
        await this.saveExportedSvg(msg.svgContent);
        break;
      }
    }
  }
  /**
   * Implements Section 5.2 Initialization Algorithm:
   * - Runs at most once per live `TextDocument` lifetime.
   * - Re-checks text and concurrency token immediately before applying.
   * - Applies a single standard WorkspaceEdit (marks dirty, respects normal VS Code Save/Undo).
   */
  async maybeAutoInitializeOnFirstOpen() {
    if (this.initializationConsidered || this.isInitializing) {
      return;
    }
    this.initializationConsidered = true;
    if (this.isDocumentReadOnly()) {
      return;
    }
    const initialText = this.document.getText();
    if (!isEmptyOrWhitespaceDocument(initialText)) {
      return;
    }
    await this.applyDefaultInitializationEdit();
  }
  async explicitlyInitializeEmptyDocument() {
    if (this.isDocumentReadOnly()) {
      void vscode3.window.showWarningMessage(
        "Cannot initialize a read-only Vizion document."
      );
      return;
    }
    if (!isEmptyOrWhitespaceDocument(this.document.getText())) {
      void vscode3.window.showWarningMessage(
        "Document is not empty. Vizion never overwrites non-empty content."
      );
      return;
    }
    await this.applyDefaultInitializationEdit();
    this.revalidateAndBroadcast();
  }
  async applyDefaultInitializationEdit() {
    if (this.isInitializing) return;
    this.isInitializing = true;
    try {
      const tokenBefore = this.document.version;
      const textBefore = this.document.getText();
      if (!isEmptyOrWhitespaceDocument(textBefore)) {
        return;
      }
      const defaultContent = serializeDefaultDocument(
        this.kind,
        this.document.uri.fsPath || this.document.uri.path
      );
      if (this.document.version !== tokenBefore || !isEmptyOrWhitespaceDocument(this.document.getText())) {
        return;
      }
      const fullRange = new vscode3.Range(
        this.document.positionAt(0),
        this.document.positionAt(textBefore.length)
      );
      const edit = new vscode3.WorkspaceEdit();
      edit.replace(this.document.uri, fullRange, defaultContent);
      const applied = await vscode3.workspace.applyEdit(edit);
      if (!applied) {
        void vscode3.window.showErrorMessage(
          "Vizion could not apply default initialization to the document."
        );
      }
    } finally {
      this.isInitializing = false;
    }
  }
  enqueueOperation(task) {
    this.operationQueue = this.operationQueue.then(task, task);
  }
  async executeOperationRequest(requestingPanel, requestId, expectedVersion, operation) {
    if (this.isDocumentReadOnly()) {
      void requestingPanel.webview.postMessage({
        type: "host.operationResult",
        requestId,
        ok: false,
        error: "Document is read-only."
      });
      return;
    }
    if (this.document.version !== expectedVersion) {
      void requestingPanel.webview.postMessage({
        type: "host.operationResult",
        requestId,
        ok: false,
        staleRejected: true,
        error: "Document changed externally during gesture. View refreshed."
      });
      this.sendSnapshotToPanel(requestingPanel);
      return;
    }
    const rawText = this.document.getText();
    const result = applyUmlOperationToText(rawText, operation);
    if (!result.ok || !result.edits) {
      void requestingPanel.webview.postMessage({
        type: "host.operationResult",
        requestId,
        ok: false,
        error: result.error ?? "Operation failed validation."
      });
      return;
    }
    if (result.edits.length === 0) {
      void requestingPanel.webview.postMessage({
        type: "host.operationResult",
        requestId,
        ok: true,
        createdIds: result.createdIds
      });
      return;
    }
    if (this.document.version !== expectedVersion) {
      void requestingPanel.webview.postMessage({
        type: "host.operationResult",
        requestId,
        ok: false,
        staleRejected: true,
        error: "Document changed concurrently before edit could be committed."
      });
      this.sendSnapshotToPanel(requestingPanel);
      return;
    }
    const wsEdit = new vscode3.WorkspaceEdit();
    for (const span of result.edits) {
      const range = new vscode3.Range(
        this.document.positionAt(span.offset),
        this.document.positionAt(span.offset + span.length)
      );
      wsEdit.replace(this.document.uri, range, span.content);
    }
    const applied = await vscode3.workspace.applyEdit(wsEdit);
    if (applied) {
      this.undoStack.push(rawText);
      if (this.undoStack.length > 200) {
        this.undoStack.shift();
      }
      this.redoStack.length = 0;
      this.revalidateAndBroadcast();
    }
    void requestingPanel.webview.postMessage({
      type: "host.operationResult",
      requestId,
      ok: applied,
      createdIds: applied ? result.createdIds : void 0,
      error: applied ? void 0 : "VS Code rejected WorkspaceEdit."
    });
  }
  async performUndo() {
    if (this.isDocumentReadOnly()) return;
    if (this.undoStack.length === 0) {
      await vscode3.commands.executeCommand("undo");
      this.revalidateAndBroadcast();
      return;
    }
    const targetText = this.undoStack.pop();
    const currentText = this.document.getText();
    const diff = computeMinimalDiffSpan(currentText, targetText);
    if (!diff) {
      return;
    }
    const wsEdit = new vscode3.WorkspaceEdit();
    const range = new vscode3.Range(
      this.document.positionAt(diff.offset),
      this.document.positionAt(diff.offset + diff.length)
    );
    wsEdit.replace(this.document.uri, range, diff.content);
    const applied = await vscode3.workspace.applyEdit(wsEdit);
    if (applied) {
      this.redoStack.push(currentText);
      this.revalidateAndBroadcast();
    }
  }
  async performRedo() {
    if (this.isDocumentReadOnly()) return;
    if (this.redoStack.length === 0) {
      await vscode3.commands.executeCommand("redo");
      this.revalidateAndBroadcast();
      return;
    }
    const targetText = this.redoStack.pop();
    const currentText = this.document.getText();
    const diff = computeMinimalDiffSpan(currentText, targetText);
    if (!diff) {
      return;
    }
    const wsEdit = new vscode3.WorkspaceEdit();
    const range = new vscode3.Range(
      this.document.positionAt(diff.offset),
      this.document.positionAt(diff.offset + diff.length)
    );
    wsEdit.replace(this.document.uri, range, diff.content);
    const applied = await vscode3.workspace.applyEdit(wsEdit);
    if (applied) {
      this.undoStack.push(currentText);
      this.revalidateAndBroadcast();
    }
  }
  // ============================================================================
  // Native VS Code Picker & Input Box Workflows (Section 2.3 & 9.5)
  // ============================================================================
  async promptAddUmlNodeFlow(panel, expectedVersion = this.document.version, x = 120, y = 100, preselectedKind) {
    if (this.kind !== "uml" || this.isDocumentReadOnly()) return;
    let chosenKind = preselectedKind;
    if (!chosenKind) {
      const kindItems = listUmlNodeKinds().map((desc) => ({
        label: desc.label,
        description: desc.kind,
        detail: desc.description,
        kindValue: desc.kind
      }));
      const picked = await vscode3.window.showQuickPick(kindItems, {
        title: "Vizion UML: Choose Node Kind",
        placeHolder: "Select class, note, or shape"
      });
      if (!picked) {
        this.restoreFocus(panel);
        return;
      }
      chosenKind = picked.kindValue;
    }
    const defaultName = chosenKind === "note" ? "Architecture Note" : chosenKind === "shape" ? "Shape" : "DomainEntity";
    const enteredName = await vscode3.window.showInputBox({
      title: `Vizion UML: New ${chosenKind.toUpperCase()} Name`,
      prompt: chosenKind === "note" ? "Enter note text or summary" : `Enter ${chosenKind} identifier`,
      value: defaultName,
      validateInput: (val) => val.trim().length === 0 ? "Name cannot be empty" : void 0
    });
    this.restoreFocus(panel);
    if (!enteredName || enteredName.trim().length === 0) {
      return;
    }
    if (this.document.version !== expectedVersion) {
      void vscode3.window.showWarningMessage(
        "Document changed while the picker was open. Please retry adding the node."
      );
      return;
    }
    const baseSlug = enteredName.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || chosenKind;
    const uniqueId = `${baseSlug}-${Date.now().toString(36).slice(-4)}`;
    this.enqueueOperation(async () => {
      const targetPanel = panel ?? Array.from(this.panels)[0]?.panel;
      if (!targetPanel) return;
      await this.executeOperationRequest(targetPanel, `host-add-${uniqueId}`, expectedVersion, {
        type: "uml.addNode",
        id: uniqueId,
        kind: chosenKind,
        name: enteredName.trim(),
        x,
        y,
        text: chosenKind === "note" ? enteredName.trim() : void 0
      });
    });
  }
  async promptAddUmlEdgeFlow(panel, expectedVersion, sourceNodeId, targetNodeId, defaultKind) {
    const presetItems = listUmlRelationPresets().map((preset) => ({
      label: preset.label,
      description: preset.kind,
      detail: preset.description,
      picked: preset.kind === (defaultKind ?? "association"),
      presetKind: preset.kind
    }));
    const picked = await vscode3.window.showQuickPick(presetItems, {
      title: `Vizion UML: Relation Kind (${sourceNodeId} > ${targetNodeId})`,
      placeHolder: "Choose semantic relationship kind"
    });
    this.restoreFocus(panel);
    if (!picked) {
      return;
    }
    if (this.document.version !== expectedVersion) {
      void vscode3.window.showWarningMessage(
        "Document changed while choosing relation kind. Connection cancelled."
      );
      return;
    }
    const edgeId = `edge-${sourceNodeId}-${targetNodeId}-${Date.now().toString(36).slice(-4)}`;
    this.enqueueOperation(async () => {
      await this.executeOperationRequest(panel, `host-edge-${edgeId}`, expectedVersion, {
        type: "uml.addEdge",
        id: edgeId,
        kind: picked.presetKind,
        sourceNodeId,
        targetNodeId
      });
    });
  }
  /**
   * Implements Section 9.5 Endpoint Editing Flow:
   * 1. Identifies start or end explicitly in the Quick Pick title.
   * 2. Opens native Quick Pick for decoration shape (none, circle, diamond, square, triangle, open-arrow).
   * 3. For closed shapes (`supportsFill: true`), offers hollow / filled selection.
   * 4. Commits the complete choice as a single atomic operation, or cancels without mutating.
   */
  async promptEndpointDecorationFlow(panel, expectedVersion, edgeId, end, currentDecoration) {
    const endLabel = end === "start" ? "START (Source)" : "END (Target)";
    const shapeItems = listEndpointShapes().map((shape) => ({
      label: shape.label,
      description: currentDecoration?.shape === shape.kind ? `${shape.kind} (current)` : shape.kind,
      detail: shape.description,
      shapeDescriptor: shape
    }));
    const pickedShape = await vscode3.window.showQuickPick(shapeItems, {
      title: `Vizion UML: Customize ${endLabel} Endpoint Shape`,
      placeHolder: `Select decoration shape for ${endLabel} endpoint of relation "${edgeId}"`
    });
    if (!pickedShape) {
      this.restoreFocus(panel);
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
      const pickedFill = await vscode3.window.showQuickPick(fillItems, {
        title: `Vizion UML: Choose ${endLabel} ${pickedShape.shapeDescriptor.label} Fill Mode`,
        placeHolder: "Select Hollow or Filled appearance"
      });
      if (!pickedFill) {
        this.restoreFocus(panel);
        return;
      }
      chosenFill = pickedFill.fillValue;
    }
    this.restoreFocus(panel);
    if (this.document.version !== expectedVersion) {
      void vscode3.window.showWarningMessage(
        "Document changed while endpoint picker was open. Endpoint update cancelled."
      );
      return;
    }
    const decoration = {
      shape: pickedShape.shapeDescriptor.kind,
      size: currentDecoration?.size ?? pickedShape.shapeDescriptor.defaultSize,
      ...chosenFill ? { fill: chosenFill } : {}
    };
    this.enqueueOperation(async () => {
      await this.executeOperationRequest(
        panel,
        `host-endpoint-${edgeId}-${end}`,
        expectedVersion,
        {
          type: "uml.updateEndpoint",
          edgeId,
          end,
          decoration
        }
      );
    });
  }
  async promptChangeRelationKindFlow(panel, expectedVersion, edgeId, currentKind) {
    const items = listUmlRelationPresets().map((preset) => ({
      label: preset.label,
      description: preset.kind === currentKind ? `${preset.kind} (current)` : preset.kind,
      detail: preset.description,
      presetKind: preset.kind
    }));
    const picked = await vscode3.window.showQuickPick(items, {
      title: `Vizion UML: Change Relation Kind (${edgeId})`,
      placeHolder: "Select relation semantic kind and reset notation preset"
    });
    this.restoreFocus(panel);
    if (!picked) return;
    if (this.document.version !== expectedVersion) {
      void vscode3.window.showWarningMessage(
        "Document changed while picker was open. Operation cancelled."
      );
      return;
    }
    this.enqueueOperation(async () => {
      await this.executeOperationRequest(panel, `host-relkind-${edgeId}`, expectedVersion, {
        type: "uml.updateEdge",
        edgeId,
        kind: picked.presetKind
      });
    });
  }
  async promptRenameEntityFlow(panel, expectedVersion, targetKind, targetId, currentValue) {
    const titleMap = {
      node: "Rename UML Node",
      edgeLabel: "Edit Relation Label",
      documentTitle: "Rename Document Title"
    };
    const nextValue = await vscode3.window.showInputBox({
      title: `Vizion: ${titleMap[targetKind]}`,
      value: currentValue,
      prompt: targetKind === "edgeLabel" ? "Enter relation label (leave empty to clear)" : "Enter new text"
    });
    this.restoreFocus(panel);
    if (nextValue === void 0) {
      return;
    }
    if (this.document.version !== expectedVersion) {
      void vscode3.window.showWarningMessage(
        "Document changed while input box was open. Edit cancelled."
      );
      return;
    }
    this.enqueueOperation(async () => {
      if (targetKind === "node") {
        if (!nextValue.trim()) return;
        await this.executeOperationRequest(panel, `rename-node-${targetId}`, expectedVersion, {
          type: "uml.updateNode",
          nodeId: targetId,
          name: nextValue.trim()
        });
      } else if (targetKind === "edgeLabel") {
        await this.executeOperationRequest(panel, `rename-edge-${targetId}`, expectedVersion, {
          type: "uml.updateEdge",
          edgeId: targetId,
          label: nextValue.trim()
        });
      } else if (targetKind === "documentTitle") {
        if (!nextValue.trim()) return;
        await this.executeOperationRequest(panel, `rename-doc`, expectedVersion, {
          type: "uml.updateMetadata",
          title: nextValue.trim()
        });
      }
    });
  }
  async saveExportedSvg(svgContent) {
    const defaultUri = vscode3.Uri.file(
      this.document.uri.fsPath.replace(/\.uml\.viz$/i, ".svg")
    );
    const targetUri = await vscode3.window.showSaveDialog({
      title: "Export Vizion Diagram as SVG",
      defaultUri,
      filters: { "SVG Vector Image": ["svg"] }
    });
    if (!targetUri) return;
    await vscode3.workspace.fs.writeFile(targetUri, Buffer.from(svgContent, "utf8"));
    void vscode3.window.showInformationMessage(
      `Exported SVG to ${vscode3.workspace.asRelativePath(targetUri)}`
    );
  }
  restoreFocus(panel) {
    if (!panel) return;
    void panel.webview.postMessage({
      type: "host.command",
      command: "restoreCanvasFocus"
    });
  }
  // ============================================================================
  // Validation & Snapshot Broadcasting
  // ============================================================================
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
      isReadOnly: this.isDocumentReadOnly(),
      isEmptyDocument: isEmpty,
      canExplicitlyInitialize: isEmpty && !this.isDocumentReadOnly(),
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
  }
};

// src/extension/documents/registry.ts
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
var vscode5 = __toESM(require("vscode"));

// src/extension/webviews/html.ts
var crypto = __toESM(require("crypto"));
var fs = __toESM(require("fs"));
var vscode4 = __toESM(require("vscode"));
function readAssetText(extensionUri, fileName) {
  try {
    const fullPath = vscode4.Uri.joinPath(extensionUri, "media", fileName).fsPath;
    return fs.readFileSync(fullPath, "utf8");
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
    `img-src ${webview.cspSource} data:`,
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
      localResourceRoots: [vscode5.Uri.joinPath(this.extensionUri, "media")]
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
    vscode6.window.registerCustomEditorProvider(
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
