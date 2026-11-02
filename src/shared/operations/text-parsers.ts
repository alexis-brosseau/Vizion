import type {
  UmlAttribute,
  UmlOperation,
  UmlParameter,
  UmlVisibility
} from '../documents/types';

/**
 * Formats UML visibility symbols using fullwidth plus (`＋`) and fullwidth hyphen-minus (`-`).
 */
export function formatVisibilitySign(vis?: UmlVisibility): string {
  switch (vis ?? '+') {
    case '+':
      return '＋';
    case '-':
      return '－';
    case '#':
      return '#';
    case '~':
      return '~';
  }
}

/**
 * Extracts structured `UmlParameter[]` from an operation, falling back to parsing `op.signature`
 * (e.g. `"(items: LineItem[], discount: number)"`) when `op.parameters` is not yet populated.
 */
export function extractOperationParameters(op: UmlOperation): UmlParameter[] {
  if (Array.isArray(op.parameters)) {
    return op.parameters;
  }
  const sig = (op.signature ?? '').trim();
  const inner = sig.replace(/^\(/, '').replace(/\)$/, '').trim();
  if (!inner) {
    return [];
  }
  return inner
    .split(',')
    .map((part, idx) => {
      const trimmed = part.trim();
      const colonIdx = trimmed.indexOf(':');
      if (colonIdx === -1) {
        return {
          id: `${op.id}-param-${idx + 1}`,
          name: trimmed,
          type: ''
        };
      }
      return {
        id: `${op.id}-param-${idx + 1}`,
        name: trimmed.slice(0, colonIdx).trim(),
        type: trimmed.slice(colonIdx + 1).trim()
      };
    })
    .filter((p) => p.name.length > 0);
}

/**
 * Builds the canonical UML operation signature string `(name: type, ...)` from a parameter array.
 */
export function buildOperationSignature(params: UmlParameter[]): string {
  const formatted = params
    .filter((p) => p.name.trim().length > 0)
    .map((p) => (p.type && p.type.trim().length > 0 ? `${p.name.trim()}: ${p.type.trim()}` : p.name.trim()));
  return `(${formatted.join(', ')})`;
}

/**
 * Formats a list of attributes into line-by-line UML format.
 */
export function formatAttributesToText(attributes?: UmlAttribute[]): string {
  return (attributes ?? [])
    .map((attr) => {
      const vis = attr.visibility ?? '+';
      const typeStr = attr.type ? `: ${attr.type}` : '';
      return `${vis} ${attr.name}${typeStr}`;
    })
    .join('\n');
}

/**
 * Parses attributes line-by-line from text, removing non-matching lines.
 */
export function parseAttributesFromText(
  text: string,
  nodeId: string,
  existingAttrs: UmlAttribute[] = []
): UmlAttribute[] {
  const lines = text.split(/\r?\n/);
  const result: UmlAttribute[] = [];
  const ATTR_REGEX = /^\s*([+\-#~＋－])?\s*([a-zA-Z_$][\w$-]*)(?:\s*:\s*(.+?))?\s*$/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const match = line.match(ATTR_REGEX);
    if (!match) continue; // remove non matching lines

    let rawVis = match[1];
    let vis: UmlVisibility = '+';
    if (rawVis === '-' || rawVis === '－') vis = '-';
    else if (rawVis === '#') vis = '#';
    else if (rawVis === '~') vis = '~';
    else vis = '+';

    const name = match[2].trim();
    const type = match[3] ? match[3].trim() : undefined;

    const existing = existingAttrs[result.length];
    const id = existing?.id ?? `${nodeId}-attr-${Date.now().toString(36)}-${result.length + 1}`;

    result.push({
      id,
      visibility: vis,
      name,
      ...(type ? { type } : {})
    });
  }
  return result;
}

/**
 * Formats a list of operations into line-by-line UML format.
 */
export function formatOperationsToText(operations?: UmlOperation[]): string {
  return (operations ?? [])
    .map((op) => {
      const vis = op.visibility ?? '+';
      const sig =
        op.parameters && op.parameters.length > 0
          ? buildOperationSignature(op.parameters)
          : (op.signature ?? '()');
      const retStr = op.returnType ? `: ${op.returnType}` : '';
      return `${vis} ${op.name}${sig}${retStr}`;
    })
    .join('\n');
}

/**
 * Parses operations line-by-line from text, removing non-matching lines.
 */
export function parseOperationsFromText(
  text: string,
  nodeId: string,
  existingOps: UmlOperation[] = []
): UmlOperation[] {
  const lines = text.split(/\r?\n/);
  const result: UmlOperation[] = [];
  const OP_REGEX = /^\s*([+\-#~＋－])?\s*([a-zA-Z_$][\w$-]*)\s*(?:\((.*?)\))?(?:\s*:\s*(.+?))?\s*$/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const match = line.match(OP_REGEX);
    if (!match) continue; // remove non matching lines

    let rawVis = match[1];
    let vis: UmlVisibility = '+';
    if (rawVis === '-' || rawVis === '－') vis = '-';
    else if (rawVis === '#') vis = '#';
    else if (rawVis === '~') vis = '~';
    else vis = '+';

    const name = match[2].trim();
    const rawParams = match[3];
    const returnType = match[4] ? match[4].trim() : undefined;

    const existing = existingOps[result.length];
    const id = existing?.id ?? `${nodeId}-op-${Date.now().toString(36)}-${result.length + 1}`;

    const parameters: UmlParameter[] = [];
    if (rawParams !== undefined && rawParams.trim().length > 0) {
      const parts = rawParams.split(',');
      for (let pIdx = 0; pIdx < parts.length; pIdx++) {
        const pTrimmed = parts[pIdx].trim();
        if (!pTrimmed) continue;
        const colonIdx = pTrimmed.indexOf(':');
        let pName = pTrimmed;
        let pType = '';
        if (colonIdx !== -1) {
          pName = pTrimmed.slice(0, colonIdx).trim();
          pType = pTrimmed.slice(colonIdx + 1).trim();
        }
        if (pName.length > 0) {
          parameters.push({
            id: `${id}-param-${pIdx + 1}`,
            name: pName,
            ...(pType ? { type: pType } : {})
          });
        }
      }
    }

    const signature =
      rawParams !== undefined
        ? `(${parameters.map((p) => (p.type ? `${p.name}: ${p.type}` : p.name)).join(', ')})`
        : '()';

    result.push({
      id,
      visibility: vis,
      name,
      signature,
      ...(returnType ? { returnType } : {}),
      parameters
    });
  }
  return result;
}
