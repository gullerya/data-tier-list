import { getSuite } from '../node_modules/just-test/dist/just-test.js';
import * as DataTier from '../node_modules/data-tier/dist/data-tier.js';
import '../src/data-tier-list.js';

const suite = getSuite({ name: 'Tying syntaxes' });

suite.runTest({ name: 'shortest syntax, primitive values' }, async test => {
	const
		tn = test.getRandom(8),
		e = document.createElement('div');

	DataTier.ties.create(tn, ['A', 'B', 'C']);
	e.innerHTML = `
		<data-tier-list data-tie="${tn} => items">
			<div data-tie="item, item => value"></div>
		</data-tier-list>
	`;

	document.body.appendChild(e);
	await test.waitNextMicrotask();
	const children = e.querySelectorAll('div');
	test.assertEqual(4, children.length);
	test.assertEqual('A', children[1].textContent);
	test.assertEqual('B', children[2].textContent);
	test.assertEqual('C', children[3].textContent);
});