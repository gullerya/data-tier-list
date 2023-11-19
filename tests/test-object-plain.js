import { test } from '@gullerya/just-test';
import { waitNextTask } from '@gullerya/just-test/timing';
import '../src/data-tier-list.js';

import 'chai';
const assert = globalThis.chai.assert;

test('e2e flow - data set via JS API', async () => {
	//	create model
	const mBase = {
		a: { label: 'Label A' },
		b: { label: 'Label B' },
		c: { label: 'Label C' }
	};

	//	create view
	const v = document.createElement('div');
	v.innerHTML = `
		<data-tier-list>
			<span class="item" data-tie="item:label"></span>
		</data-tier-list>
	`;
	v.querySelector('data-tier-list').items = mBase;
	document.body.appendChild(v);
	const m = v.querySelector('data-tier-list').items;

	//	asserts
	await assertCorrelation(mBase, v);
	assert.notStrictEqual(mBase, m);

	//	get model (it's not the same) and manipulate
	m.a.label = 'Label 1';
	delete m.b;
	m.c = { label: 'Label 2' };
	await assertCorrelation(m, v);
});

async function assertCorrelation(items, view) {
	await waitNextTask();
	assert.strictEqual(Object.keys(items).length + 1, view.childElementCount);
	for (const [i, te] of Array.from(view.children).entries()) {
		if (!i) continue;
		assert.strictEqual(items[Object.keys(items)[i - 1]].label, te.textContent);
	}
}