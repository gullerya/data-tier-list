import { test } from '@gullerya/just-test';
import { getRandom } from '@gullerya/just-test/random';
import { waitNextTask } from '@gullerya/just-test/timing';
import { ties } from '@gullerya/data-tier';
import '../src/data-tier-list.js';

import 'chai';
const assert = globalThis.chai.assert;

test('shortest syntax, primitive values', async () => {
	const
		tn = getRandom(),
		e = document.createElement('div');

	ties.create(tn, ['A', 'B', 'C']);
	e.innerHTML = `
		<data-tier-list data-tie="${tn} => items">
			<div data-tie="item, item => value"></div>
		</data-tier-list>
	`;

	document.body.appendChild(e);
	await waitNextTask();
	const children = e.querySelectorAll('div');
	assert.strictEqual(4, children.length);
	assert.strictEqual('A', children[1].textContent);
	assert.strictEqual('B', children[2].textContent);
	assert.strictEqual('C', children[3].textContent);
});