import { getSuite } from '../node_modules/just-test/dist/just-test.js';
import * as DataTier from '../node_modules/data-tier/dist/data-tier.js';
import '../dist/data-tier-list.js';

const suite = getSuite({ name: 'Tying syntaxes' });

suite.runTest({ name: 'shortest syntax' }, async test => {
	const tie = DataTier.ties.create('shortestSyntaxTest', [
		'A', 'B', 'C'
	]),
		e = document.createElement('div');

	e.style.outline = '2px solid red';
	e.innerHTML = `
			<template is="data-tier-item-template" data-tie="shortestSyntaxTest">
				<div data-tie="item, item => value"></div>
			</template>`;

	//	initial insert
	document.body.appendChild(e);
	await new Promise(res => setTimeout(res, 0));
	const children = e.querySelectorAll('div');
	if (children.length !== 3) test.fail('expected to have 3 items, found ' + children.length);
	if (children[0].textContent !== 'A' || children[0].value !== 'A') test.fail('item 0 is not as expected');
	if (children[1].textContent !== 'B' || children[1].value !== 'B') test.fail('item 1 is not as expected');
	if (children[2].textContent !== 'C' || children[2].value !== 'C') test.fail('item 2 is not as expected');

	DataTier.ties.remove(tie);
});