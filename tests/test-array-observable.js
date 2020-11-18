import { getSuite } from '../node_modules/just-test/dist/just-test.js';
import '../dist/data-tier-list.js';
import { ties } from '../dist/data-tier/data-tier.min.js';

const suite = getSuite({ name: 'Usage - array observable' });

suite.runTest({ name: 'e2e flow - data set tied via HTML' }, async test => {
	const tn = test.getRandom(8);

	//	create model
	const m = ties.create(tn, {
		items: [{ label: 'Label A' }, { label: 'Label B' }, { label: 'Label C' }]
	});

	//	create view
	const v = document.createElement('div');
	v.innerHTML = `
		<data-tier-list data-tie="${tn}:items">
			<span class="item" data-tie="scope:label"></span>
		</data-tier-list>
	`;
	document.body.appendChild(v);

	//	asserts
	await assertCorrelation(m.items, v, test);
	test.assertEqual(m.items, v.querySelector('data-tier-list').items);

	//	direct manipulations on the model, it should be the same
	m.items[0].label = 'Label 1';
	m.items.pop();
	m.items[1] = { label: 'Label 2' };
	await assertCorrelation(m.items, v, test);
});

suite.runTest({ name: 'e2e flow - data set tied via JS API' }, async test => {
	const tn = test.getRandom(8);

	//	create model
	const m = ties.create(tn, {
		items: [{ label: 'Label A' }, { label: 'Label B' }, { label: 'Label C' }]
	});

	//	create view and assign observable model
	const v = document.createElement('div');
	v.innerHTML = `
		<data-tier-list>
			<span class="item" data-tie="scope:label"></span>
		</data-tier-list>
	`;
	v.querySelector('data-tier-list').items = m.items;
	document.body.appendChild(v);

	//	asserts
	await assertCorrelation(m.items, v, test);
	test.assertEqual(m.items, v.querySelector('data-tier-list').items);

	//	direct manipulations on the model, it should be the same
	m.items[0].label = 'Label 1';
	m.items.pop();
	m.items[1] = { label: 'Label 2' };
	await assertCorrelation(m.items, v, test);
});

async function assertCorrelation(items, view, test) {
	await test.waitNextMicrotask();
	test.assertEqual(items.length + 1, view.childElementCount);
	for (const [i, te] of Array.from(view.children).entries()) {
		if (!i) continue;
		test.assertEqual(items[i - 1].label, te.textContent);
	}
}