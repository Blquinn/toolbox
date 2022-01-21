import App from './App.svelte';

import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';

const app = new App({
	target: document.body,
	props: {
		name: 'world'
	}
});

export default app;
