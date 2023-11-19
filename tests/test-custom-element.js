import { test } from '@gullerya/just-test';
import { getRandom } from '@gullerya/just-test/random';
import { ties } from '@gullerya/data-tier';
import '../src/data-tier-list.js';

import 'chai';
const assert = globalThis.chai.assert;

customElements.define('x-suite', class extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' }).innerHTML = `
			<div data-tie="scope:name"></div>
			<div data-tie="scope:duration"></div>
			<div data-tie="scope:tests.length"></div>
			<div>
			<data-tier-list data-tie="scope:tests => items">
				<x-test data-tie="item => scope"></x-test>
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

test('validate list within custom element', async () => {
	const tieKey = getRandom();
	const model = ties.create(tieKey, {
		suites: []
	});
	const ce = document.createElement('div');
	ce.innerHTML = `
		<div data-tie="${tieKey}:suites.length"></div>
		<div>
		<data-tier-list data-tie="${tieKey}:suites => items">
			<x-suite data-tie="item => scope"></x-suite>
		</data-tier-list>
		</div>
	`;

	//	initial insert
	document.body.appendChild(ce);

	model.suites = [
		{ name: 'suite-a', duration: 2.3, tests: [{ name: 'test-a', status: 'pass' }, { name: 'test-b', status: 'pass' }, { name: 'test-c', status: 'pass' }] },
		{ name: 'suite-b', duration: 12.6, tests: [{ name: 'test-1', status: 'pass' }, { name: 'test-2', status: 'fail' }] }
	];

	//	TODO: assertions
	// assert.fail('not yet implemented');
});