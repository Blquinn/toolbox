import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/merge/merge.css';

import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';

import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {}
});

export default app;
