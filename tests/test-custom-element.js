import { getSuite } from '../node_modules/just-test/dist/just-test.js';
import * as DataTier from 'data-tier';
import '../dist/data-tier-list.js';

const suite = getSuite({ name: 'Complex cases - custom elements nested structure (suite-test scenario)' });

customElements.define('x-suite', class extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' }).innerHTML = `
			<div data-tie="scope:name"></div>
			<div data-tie="scope:duration"></div>
			<div data-tie="scope:tests.length"></div>
			<div>
			<data-tier-list data-tie="scope:tests">
				<x-test data-tie="scope => scope"></x-test>
			</data-tier-list>
			</div>
		`;
	}
});

customElements.define('x-test', class extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' }).innerHTML = `
			<span data-tie="scope:name"></span>
			<span data-tie="scope:status"></span>
		`;
	}
});

suite.runTest({ name: 'validate list within custom element' }, async test => {
	const tieKey = test.getRandom(8);
	const model = DataTier.ties.create(tieKey, {
		suites: []
	});
	const ce = document.createElement('div');
	ce.innerHTML = `
		<div data-tie="${tieKey}:suites.length"></div>
		<div>
		<data-tier-list data-tie="${tieKey}:suites">
			<x-suite data-tie="scope => scope"></x-suite>
		</data-tier-list>
		</div>
	`;

	//	initial insert
	document.body.appendChild(ce);

	model.suites = [
		{ name: 'suite-a', duration: 2.3, tests: [{ name: 'test-a', status: 'pass' }, { name: 'test-b', status: 'pass' }, { name: 'test-c', status: 'pass' }] },
		{ name: 'suite-b', duration: 12.6, tests: [{ name: 'test-1', status: 'pass' }, { name: 'test-2', status: 'fail' }] }
	];
	console.log('here');
});