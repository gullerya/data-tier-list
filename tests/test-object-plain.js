import { getSuite } from '../node_modules/just-test/dist/just-test.js';
import '../src/data-tier-list.js';

const suite = getSuite({ name: 'Usage - object plain' });

suite.runTest({ name: 'e2e flow - data set via JS API' }, async test => {
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
	await assertCorrelation(mBase, v, test);
	test.assertNotEqual(mBase, m);

	//	get model (it's not the same) and manipulate
	m.a.label = 'Label 1';
	delete m.b;
	m.c = { label: 'Label 2' };
	await assertCorrelation(m, v, test);
});

async function assertCorrelation(items, view, test) {
	await test.waitNextMicrotask();
	test.assertEqual(Object.keys(items).length + 1, view.childElementCount);
	for (const [i, te] of Array.from(view.children).entries()) {
		if (!i) continue;
		test.assertEqual(items[Object.keys(items)[i - 1]].label, te.textContent);
	}
}