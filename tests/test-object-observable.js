import { test } from '@gullerya/just-test';
import { getRandom } from '@gullerya/just-test/random';
import { waitNextTask } from '@gullerya/just-test/timing';
import { ties } from '@gullerya/data-tier';
import '../src/data-tier-list.js';

import 'chai';
const assert = globalThis.chai.assert;

test('e2e flow - data set tied via HTML', async () => {
	const tn = getRandom();

	//	create model
	const m = ties.create(tn, {
		items: {
			a: { label: 'Label A' },
			b: { label: 'Label B' },
			c: { label: 'Label C' }
		}
	});

	//	create view
	const v = document.createElement('div');
	v.innerHTML = `
		<data-tier-list data-tie="${tn}:items => items">
			<span class="item" data-tie="item:label"></span>
		</data-tier-list>
	`;
	document.body.appendChild(v);

	//	asserts
	await assertCorrelation(m.items, v);
	assert.strictEqual(m.items, v.querySelector('data-tier-list').items);

	//	direct manipulations on the model, it should be the same
	m.items.a.label = 'Label 1';
	delete m.items.b;
	m.items.c = { label: 'Label 2' };
	await assertCorrelation(m.items, v);
});

test('e2e flow - data set tied via JS API', async () => {
	const tn = getRandom();

	//	create model
	const m = ties.create(tn, {
		items: {
			a: { label: 'Label A' },
			b: { label: 'Label B' },
			c: { label: 'Label C' }
		}
	});

	//	create view and assign observable model
	const v = document.createElement('div');
	v.innerHTML = `
		<data-tier-list>
			<span class="item" data-tie="item:label"></span>
		</data-tier-list>
	`;
	v.querySelector('data-tier-list').items = m.items;
	document.body.appendChild(v);

	//	asserts
	await assertCorrelation(m.items, v);
	assert.strictEqual(m.items, v.querySelector('data-tier-list').items);

	//	direct manipulations on the model, it should be the same
	m.items.a.label = 'Label 1';
	delete m.items.b
	m.items.c = { label: 'Label 2' };
	await assertCorrelation(m.items, v);
});

async function assertCorrelation(items, view) {
	await waitNextTask();
	assert.strictEqual(Object.keys(items).length + 1, view.childElementCount);
	for (const [i, te] of Array.from(view.children).entries()) {
		if (!i) continue;
		assert.strictEqual(items[Object.keys(items)[i - 1]].label, te.textContent);
	}
}