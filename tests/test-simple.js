import { getSuite } from '../node_modules/just-test/dist/just-test.js';
import * as DataTier from '../node_modules/data-tier/dist/data-tier.js';
import '../dist/data-tier-list.js';

const suite = getSuite({ name: 'Simple cases - select' });

suite.runTest({ name: 'validate simple select options' }, async test => {
	let t = DataTier.ties.create('selectA', {
		options: [
			{ text: 'TEXT 1', value: 1 },
			{ text: 'TEXT 2', value: 2 },
			{ text: 'TEXT 3', value: 3 }
		]
	}),
		e = document.createElement('select'),
		children;
	e.innerHTML = `
			<template is="data-tier-item-template" class="order" data-tie="selectA:options => items">
				<option data-tie="item:text => textContent, item:value => value"></option>
			</template>`;

	//	initial insert
	document.body.appendChild(e);
	await new Promise(res => setTimeout(res, 0));
	children = e.querySelectorAll('option');
	if (children.length !== 3) test.fail('expected to have 3 options, found ' + children.length);
	if (children[0].textContent !== 'TEXT 1' || children[0].value !== '1') test.fail('[initial] option 0 is not as expected');
	if (children[1].textContent !== 'TEXT 2' || children[1].value !== '2') test.fail('[initial] option 1 is not as expected');
	if (children[2].textContent !== 'TEXT 3' || children[2].value !== '3') test.fail('[initial] option 2 is not as expected');

	//	PUSH
	t.options.push({ text: 'TEXT 4', value: 4 });
	await new Promise(res => setTimeout(res, 0));
	children = e.querySelectorAll('option');
	if (children.length !== 4) test.fail('expected to have 4 options, found ' + children.length);
	if (children[0].textContent !== 'TEXT 1' || children[0].value !== '1') test.fail('[push] option 0 is not as expected');
	if (children[1].textContent !== 'TEXT 2' || children[1].value !== '2') test.fail('[push] option 1 is not as expected');
	if (children[2].textContent !== 'TEXT 3' || children[2].value !== '3') test.fail('[push] option 2 is not as expected');
	if (children[3].textContent !== 'TEXT 4' || children[3].value !== '4') test.fail('[push] option 3 is not as expected');

	//	UNSHIFT
	t.options.unshift({ text: 'TEXT 0', value: 0 });
	await new Promise(res => setTimeout(res, 0));
	children = e.querySelectorAll('option');
	if (children.length !== 5) test.fail('expected to have 5 options, found ' + children.length);
	if (children[0].textContent !== 'TEXT 0' || children[0].value !== '0') test.fail('[unshift] option 0 is not as expected');
	if (children[1].textContent !== 'TEXT 1' || children[1].value !== '1') test.fail('[unshift] option 1 is not as expected');
	if (children[2].textContent !== 'TEXT 2' || children[2].value !== '2') test.fail('[unshift] option 2 is not as expected');
	if (children[3].textContent !== 'TEXT 3' || children[3].value !== '3') test.fail('[unshift] option 3 is not as expected');
	if (children[4].textContent !== 'TEXT 4' || children[4].value !== '4') test.fail('[unshift] option 4 is not as expected');

	//	FIRST and LAST item mutation
	t.options[0].text = 'TEXT FIRST';
	t.options[4].text = 'TEXT LAST';
	children = e.querySelectorAll('option');
	if (children[0].textContent !== 'TEXT FIRST') test.fail('[modify] option 0 is not as expected');
	if (children[4].textContent !== 'TEXT LAST') test.fail('[modify] option 4 is not as expected');

	//	SHIFT
	t.options.shift();
	t.options[0].text = 'TEXT NEW FIRST';
	await new Promise(res => setTimeout(res, 0));

	children = e.querySelectorAll('option');
	if (children.length !== 4) test.fail('expected to have 4 options, found ' + children.length);
	if (children[0].textContent !== 'TEXT NEW FIRST' || children[0].value !== '1') test.fail('[shift] option 0 is not as expected');
	if (children[1].textContent !== 'TEXT 2' || children[1].value !== '2') test.fail('[shift] option 1 is not as expected');
	if (children[2].textContent !== 'TEXT 3' || children[2].value !== '3') test.fail('[shift] option 2 is not as expected');
	if (children[3].textContent !== 'TEXT LAST' || children[3].value !== '4') test.fail('[shift] option 3 is not as expected');

	//	POP
	t.options.pop();
	await new Promise(res => setTimeout(res, 0));
	children = e.querySelectorAll('option');
	if (children.length !== 3) test.fail('expected to have 3 options, found ' + children.length);
	if (children[0].textContent !== 'TEXT NEW FIRST' || children[0].value !== '1') test.fail('[pop] option 0 is not as expected');
	if (children[1].textContent !== 'TEXT 2' || children[1].value !== '2') test.fail('[pop] option 1 is not as expected');
	if (children[2].textContent !== 'TEXT 3' || children[2].value !== '3') test.fail('[pop] option 2 is not as expected');

	//	REVERSE
	t.options.reverse();
	await new Promise(res => setTimeout(res, 0));
	children = e.querySelectorAll('option');
	if (children.length !== 3) test.fail('expected to have 3 options, found ' + children.length);
	if (children[0].textContent !== 'TEXT 3' || children[0].value !== '3') test.fail('[reverse] option 0 is not as expected');
	if (children[1].textContent !== 'TEXT 2' || children[1].value !== '2') test.fail('[reverse] option 1 is not as expected');
	if (children[2].textContent !== 'TEXT NEW FIRST' || children[2].value !== '1') test.fail('[reverse] option 2 is not as expected');
});

suite.runTest({ name: 'validate binding item as a whole' }, async test => {
	let tie = DataTier.ties.create('wholeItem', [
		'A', 'B', 'C'
	]),
		e = document.createElement('select'),
		children;

	e.innerHTML = `
			<template is="data-tier-item-template" data-tie="wholeItem => items">
				<option class="whole-item-bind" data-tie="item => textContent, item => value"></option>
			</template>`;

	//	initial insert
	document.body.appendChild(e);
	await new Promise(res => setTimeout(res, 0));
	children = e.querySelectorAll('.whole-item-bind');
	if (children.length !== 3) test.fail('expected to have 3 options, found ' + children.length);
	if (children[0].textContent !== 'A' || children[0].value !== 'A') test.fail('option 0 is not as expected');
	if (children[1].textContent !== 'B' || children[1].value !== 'B') test.fail('option 1 is not as expected');
	if (children[2].textContent !== 'C' || children[2].value !== 'C') test.fail('option 2 is not as expected');
});