import { applyEdits, modify, type Edit, type FormattingOptions, type JSONPath } from 'jsonc-parser';

export interface TextSpanEdit {
  offset: number;
  length: number;
  content: string;
}

export interface JsonMutationPatch {
  path: JSONPath;
  value: unknown;
  isArrayInsertion?: boolean;
}

/**
 * Detects indentation and EOL conventions of an existing JSON document
 * so minimal edits respect user formatting and produce surgical Git diffs.
 */
export function detectFormattingOptions(text: string): FormattingOptions {
  const eol = text.includes('\r\n') ? '\r\n' : '\n';
  const lines = text.split(/\r?\n/);

  for (const line of lines) {
    const match = /^(\s+)\S/.exec(line);
    if (match) {
      const ws = match[1];
      if (ws.startsWith('\t')) {
        return { tabSize: 2, insertSpaces: false, eol };
      }
      return { tabSize: Math.min(8, Math.max(2, ws.length)), insertSpaces: true, eol };
    }
  }

  return { tabSize: 2, insertSpaces: true, eol };
}

/**
 * Applies a sequence of JSONPath mutations to a JSON string, returning both the updated text
 * and the minimal range edits (compatible with VS Code WorkspaceEdit) while preserving
 * all unrelated keys, unknown fields, and existing formatting.
 */
export function computeMinimalJsonEdits(
  originalText: string,
  patches: JsonMutationPatch[]
): { updatedText: string; edits: TextSpanEdit[] } {
  const formattingOptions = detectFormattingOptions(originalText);

  if (patches.length === 1) {
    const patch = patches[0];
    const edits: Edit[] = modify(originalText, patch.path, patch.value, {
      formattingOptions,
      isArrayInsertion: patch.isArrayInsertion
    });
    const updatedText = applyEdits(originalText, edits);
    return { updatedText, edits };
  }

  // When multiple patches are needed in a single atomic operation (e.g. adding a node AND its layout entry,
  // or deleting a node AND its incident edges), apply sequentially to compute the final string, then
  // compute the minimal diff span between originalText and currentText so WorkspaceEdit applies as 1 undo step.
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

/**
 * Computes the single smallest contiguous replacement span between `before` and `after`.
 */
export function computeMinimalDiffSpan(before: string, after: string): TextSpanEdit | null {
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
  while (
    endBefore > start &&
    endAfter > start &&
    before.charCodeAt(endBefore - 1) === after.charCodeAt(endAfter - 1)
  ) {
    endBefore--;
    endAfter--;
  }

  return {
    offset: start,
    length: endBefore - start,
    content: after.slice(start, endAfter)
  };
}

