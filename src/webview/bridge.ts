import type { WebviewToHostMessage } from '../shared/messages';
import type { ViewportTransform } from '../shared/geometry';

export interface PersistedViewPreferences {
  viewport?: ViewportTransform;
  sidebarWidth?: number;
  elementsPaneHeight?: number;
}

interface VsCodeWebviewApi<TState = PersistedViewPreferences> {
  postMessage(message: WebviewToHostMessage): void;
  getState(): TState | undefined;
  setState(newState: TState): TState;
}

declare function acquireVsCodeApi<TState = PersistedViewPreferences>(): VsCodeWebviewApi<TState>;

let vscodeApiInstance: VsCodeWebviewApi | undefined;

function getVsCodeApi(): VsCodeWebviewApi {
  if (!vscodeApiInstance) {
    if (typeof acquireVsCodeApi === 'function') {
      vscodeApiInstance = acquireVsCodeApi();
    } else {
      // Fallback mock for unit/component tests outside VS Code host
      let memoryState: PersistedViewPreferences | undefined;
      vscodeApiInstance = {
        postMessage: () => {},
        getState: () => memoryState,
        setState: (s) => {
          memoryState = s;
          return s;
        }
      };
    }
  }
  return vscodeApiInstance;
}

export function postToHost(message: WebviewToHostMessage): void {
  // Always strip any Svelte 5 `$state` Proxy wrappers before calling postMessage
  // to prevent `DataCloneError: [object Object] could not be cloned`.
  const plainPayload = JSON.parse(JSON.stringify(message)) as WebviewToHostMessage;
  getVsCodeApi().postMessage(plainPayload);
}

export function loadViewPreferences(): PersistedViewPreferences {
  return getVsCodeApi().getState() ?? {};
}

export function saveViewPreferences(partial: Partial<PersistedViewPreferences>): void {
  const api = getVsCodeApi();
  const current = api.getState() ?? {};
  api.setState({ ...current, ...partial });
}
