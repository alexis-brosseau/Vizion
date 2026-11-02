import type { UmlShapeGeometry } from '../../shared/documents/types';

export type ShortcutCommand =
  | { type: 'undo' }
  | { type: 'redo' }
  | { type: 'copy' }
  | { type: 'paste'; stripCustomData: boolean }
  | { type: 'duplicate' }
  | { type: 'delete' }
  | { type: 'fitContent' }
  | { type: 'resetZoom' }
  | { type: 'quickCreate'; kind: 'class' | 'note' | 'shape' | 'frame'; shape?: UmlShapeGeometry };

export interface ShortcutContext {
  /** True when focus is in a text field or an inline editor is open. */
  isEditingText: boolean;
  /** True when a mouse/keyboard gesture is in progress. */
  isGestureActive: boolean;
}

function isModifier(event: KeyboardEvent): boolean {
  return event.ctrlKey || event.metaKey;
}

function isTextFieldFocused(): boolean {
  const active = document.activeElement as HTMLElement | null;
  const tag = active?.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || active?.isContentEditable === true;
}

/**
 * Maps a keyboard event to a semantic canvas command without performing side effects.
 * Returns null when the event should be left to the browser/host.
 */
export function resolveShortcut(
  event: KeyboardEvent,
  context: ShortcutContext = { isEditingText: isTextFieldFocused(), isGestureActive: false }
): ShortcutCommand | null {
  const modifier = isModifier(event);
  const key = event.key.toLowerCase();
  const activeTag = (document.activeElement as HTMLElement | null)?.tagName;

  if (activeTag === 'INPUT' || activeTag === 'TEXTAREA' || activeTag === 'SELECT') {
    if (event.key === 'Escape') return null;
    return null;
  }

  if (context.isEditingText) return null;

  if (event.key === 'Escape') return null;
  if (event.key === 'Delete' || event.key === 'Backspace') return { type: 'delete' };

  if (modifier && !event.shiftKey && key === 'z') return { type: 'undo' };
  if ((modifier && key === 'y') || (modifier && event.shiftKey && key === 'z')) return { type: 'redo' };

  if (modifier && !event.shiftKey && key === 'c') return { type: 'copy' };
  if (modifier && !event.shiftKey && key === 'v') return { type: 'paste', stripCustomData: false };
  if (modifier && event.shiftKey && key === 'v') return { type: 'paste', stripCustomData: true };
  if (modifier && key === 'd') return { type: 'duplicate' };

  if (event.altKey && !modifier) {
    if (key === 'c') return { type: 'quickCreate', kind: 'class' };
    if (key === 'n') return { type: 'quickCreate', kind: 'note' };
    if (key === 's') return { type: 'quickCreate', kind: 'shape', shape: 'rectangle' };
    if (key === 'f') return { type: 'quickCreate', kind: 'frame' };
  }

  if (modifier && event.key === '0') return { type: 'resetZoom' };

  return null;
}
