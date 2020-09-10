import { getSuite } from '../node_modules/just-test/dist/just-test.js';
import * as DataTier from '../node_modules/data-tier/dist/data-tier.js';
import '../dist/data-tier-list.js';

const suite = getSuite({ name: 'Tying syntaxes' });

suite.runTest({ name: 'shortest syntax, primitive values', skip: true }, async test => {
	const
		tn = test.getRandom(8),
		tie = DataTier.ties.create(tn, [
			'A', 'B', 'C'
		]),
		e = document.createElement('div');

	e.style.outline = '2px solid red';
	e.innerHTML = `
		<data-tier-list data-tie="${tn}">
			<div data-tie="scope, scope => value"></div>
		</data-tier-list>
	`;

	//	initial insert
	document.body.appendChild(e);
	await new Promise(res => setTimeout(res, 0));
	const children = e.querySelectorAll('div');
	test.assertEqual(4, children.length);
	if (children[1].textContent !== 'A' || children[1].value !== 'A') test.fail('item 0 is not as expected');
	if (children[2].textContent !== 'B' || children[2].value !== 'B') test.fail('item 1 is not as expected');
	if (children[3].textContent !== 'C' || children[3].value !== 'C') test.fail('item 2 is not as expected');

	DataTier.ties.remove(tie);
});