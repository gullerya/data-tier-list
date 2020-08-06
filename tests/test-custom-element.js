import { getSuite } from '../node_modules/just-test/dist/just-test.js';
import * as DataTier from '../dist/data-tier/data-tier.min.js';
import '../dist/data-tier-list.js';

const suite = getSuite({ name: 'Complex cases - custom elements nested structure' });

customElements.define('list-in-ce-a', class extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' }).innerHTML = `
			<slot></slot>
		`;
	}
});

customElements.define('item-in-ce-list', class extends HTMLElement {
	constructor() {
		super();
		const sd = this.attachShadow({ mode: 'open' });
		sd.appendChild(document.createElement('slot'));
	}
});

suite.runTest({ name: 'validate list within custom element' }, async test => {
	DataTier.ties.create('testListCEA', [
		'item-a', 'item-b', 'item-c'
	]);
	const ce = document.createElement('list-in-ce-a');
	ce.innerHTML = `
		<template is="data-tier-item-template" data-tie="testListCEA">
			<item-in-ce-list data-tie="item"></item-in-ce-list>
		</template>
	`;

	//	initial insert
	document.body.appendChild(ce);
});
