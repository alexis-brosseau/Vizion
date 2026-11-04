import { mount } from 'svelte';
import type { VizionDocumentKind } from '../shared/documents/types';
import App from './App.svelte';
import './styles/tokens.css';
import './styles/base.css';
import './styles/canvas.css';
import './styles/legacy-base.css';
import './styles/sidebar.css';
import './styles/menus.css';
import './styles/nodes.css';
import './styles/endpoints.css';
import './styles/visibility.css';
import './styles/inspector.css';
import './styles/chrome.css';

const initialKind: VizionDocumentKind = 'uml';

const target = document.getElementById('app');
if (target) {
  target.innerHTML = '';
  mount(App, {
    target,
    props: { initialKind }
  });
}
