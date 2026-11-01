import { mount } from 'svelte';
import type { VizionDocumentKind } from '../shared/documents/types';
import App from './App.svelte';
import './styles.css';

const initialKind: VizionDocumentKind = 'uml';

const target = document.getElementById('app');
if (target) {
  target.innerHTML = '';
  mount(App, {
    target,
    props: { initialKind }
  });
}
