import { test } from '@gullerya/just-test';
import { getRandom } from '@gullerya/just-test/random';
import { waitNextTask } from '@gullerya/just-test/timing';
import { ties } from '@gullerya/data-tier';
import '../src/data-tier-list.js';

import 'chai';
const assert = globalThis.chai.assert;

test('validate simple select options', async () => {
	const
		tn = getRandom(),
		t = ties.create(tn, [
			{ text: 'TEXT 1', value: 1 },
			{ text: 'TEXT 2', value: 2 },
			{ text: 'TEXT 3', value: 3 }
		]),
		e = document.createElement('select');
	let children;
	e.className = tn;
	document.body.appendChild(e);

	const r = document.createElement('data-tier-list');
	r.dataset.tie = `${tn} => items`;
	r.setAttribute('data-list-target', `.${tn}`);
	r.innerHTML = `
		<option data-tie="item:text => textContent, item:value => value"></option>
	`;

	//	initial insert
	document.body.appendChild(r);
	await waitNextTask();
	children = e.querySelectorAll('option');
	if (children.length !== 3) assert.fail('expected to have 3 options, found ' + children.length);
	if (children[0].textContent !== 'TEXT 1' || children[0].value !== '1') assert.fail('[initial] option 0 is not as expected');
	if (children[1].textContent !== 'TEXT 2' || children[1].value !== '2') assert.fail('[initial] option 1 is not as expected');
	if (children[2].textContent !== 'TEXT 3' || children[2].value !== '3') assert.fail('[initial] option 2 is not as expected');

	//	PUSH
	t.push({ text: 'TEXT 4', value: 4 });
	await waitNextTask();
	children = e.querySelectorAll('option');
	if (children.length !== 4) assert.fail('expected to have 4 options, found ' + children.length);
	if (children[0].textContent !== 'TEXT 1' || children[0].value !== '1') assert.fail('[push] option 0 is not as expected');
	if (children[1].textContent !== 'TEXT 2' || children[1].value !== '2') assert.fail('[push] option 1 is not as expected');
	if (children[2].textContent !== 'TEXT 3' || children[2].value !== '3') assert.fail('[push] option 2 is not as expected');
	if (children[3].textContent !== 'TEXT 4' || children[3].value !== '4') assert.fail('[push] option 3 is not as expected');

	//	UNSHIFT
	t.unshift({ text: 'TEXT 0', value: 0 });
	await waitNextTask();
	children = e.querySelectorAll('option');
	if (children.length !== 5) assert.fail('expected to have 5 options, found ' + children.length);
	if (children[0].textContent !== 'TEXT 0' || children[0].value !== '0') assert.fail('[unshift] option 0 is not as expected');
	if (children[1].textContent !== 'TEXT 1' || children[1].value !== '1') assert.fail('[unshift] option 1 is not as expected');
	if (children[2].textContent !== 'TEXT 2' || children[2].value !== '2') assert.fail('[unshift] option 2 is not as expected');
	if (children[3].textContent !== 'TEXT 3' || children[3].value !== '3') assert.fail('[unshift] option 3 is not as expected');
	if (children[4].textContent !== 'TEXT 4' || children[4].value !== '4') assert.fail('[unshift] option 4 is not as expected');

	//	FIRST and LAST item mutation
	t[0].text = 'TEXT FIRST';
	t[4].text = 'TEXT LAST';
	children = e.querySelectorAll('option');
	if (children.length !== 5) assert.fail('expected to have 5 options, found ' + children.length);
	if (children[0].textContent !== 'TEXT FIRST') assert.fail('[modify] option 0 is not as expected');
	if (children[1].textContent !== 'TEXT 1' || children[1].value !== '1') assert.fail('[modify] option 1 is not as expected');
	if (children[2].textContent !== 'TEXT 2' || children[2].value !== '2') assert.fail('[modify] option 2 is not as expected');
	if (children[3].textContent !== 'TEXT 3' || children[3].value !== '3') assert.fail('[modify] option 3 is not as expected');
	if (children[4].textContent !== 'TEXT LAST') assert.fail('[modify] option 4 is not as expected');

	//	SHIFT
	t.shift();
	t[0].text = 'TEXT NEW FIRST';
	await waitNextTask();
	children = e.querySelectorAll('option');
	if (children.length !== 4) assert.fail('expected to have 4 options, found ' + children.length);
	if (children[0].textContent !== 'TEXT NEW FIRST' || children[0].value !== '1') assert.fail('[shift] option 0 is not as expected');
	if (children[1].textContent !== 'TEXT 2' || children[1].value !== '2') assert.fail('[shift] option 1 is not as expected');
	if (children[2].textContent !== 'TEXT 3' || children[2].value !== '3') assert.fail('[shift] option 2 is not as expected');
	if (children[3].textContent !== 'TEXT LAST' || children[3].value !== '4') assert.fail('[shift] option 3 is not as expected');

	//	POP
	t.pop();
	await waitNextTask();
	children = e.querySelectorAll('option');
	if (children.length !== 3) test.fail('expected to have 3 options, found ' + children.length);
	if (children[0].textContent !== 'TEXT NEW FIRST' || children[0].value !== '1') test.fail('[pop] option 0 is not as expected');
	if (children[1].textContent !== 'TEXT 2' || children[1].value !== '2') test.fail('[pop] option 1 is not as expected');
	if (children[2].textContent !== 'TEXT 3' || children[2].value !== '3') test.fail('[pop] option 2 is not as expected');

	//	REVERSE
	t.reverse();
	await waitNextTask();
	children = e.querySelectorAll('option');
	if (children.length !== 3) assert.fail('expected to have 3 options, found ' + children.length);
	if (children[0].textContent !== t[0].text || children[0].value !== '3') assert.fail('[reverse] option 0 is not as expected');
	if (children[1].textContent !== t[1].text || children[1].value !== '2') assert.fail('[reverse] option 1 is not as expected');
	if (children[2].textContent !== t[2].text || children[2].value !== '1') assert.fail('[reverse] option 2 is not as expected');

	//	all still works well after the reverse
	t[2].text = 'THIS IS THE LAST ONE';
	children = e.querySelectorAll('option');
	if (children[2].textContent !== 'THIS IS THE LAST ONE') assert.fail('change option 2 [after reverse] is not as expected');
});

test('validate binding item as a whole', async () => {
	const tn = getRandom();
	ties.create(tn, [
		{ text: 'A' },
		{ text: 'B' },
		{ text: 'C' }
	]);
	const e = document.createElement('div');
	e.innerHTML = `
		<data-tier-list data-tie="${tn} => items">
			<span data-tie="item:text"></span>
		</data-tier-list>
	`;

	//	initial insert
	document.body.appendChild(e);
	await waitNextTask();
	let children = Array.from(e.children).filter(c => c.nodeName === 'SPAN');
	if (children.length !== 3) assert.fail('expected to have 3 spans, found ' + children.length);
	if (children[0].textContent !== 'A') assert.fail('span 0 is not as expected');
	if (children[1].textContent !== 'B') assert.fail('span 1 is not as expected');
	if (children[2].textContent !== 'C') assert.fail('span 2 is not as expected');
});

test('validate binding primitives', async () => {
	const tn = getRandom();
	ties.create(tn, ['A', 'B', 'C']);
	const e = document.createElement('div');
	e.innerHTML = `
		<data-tier-list data-tie="${tn} => items">
			<span data-tie="item"></span>
		</data-tier-list>
	`;

	//	initial insert
	document.body.appendChild(e);
	await waitNextTask();
	let children = Array.from(e.children).filter(c => c.nodeName === 'SPAN');
	if (children.length !== 3) assert.fail('expected to have 3 spans, found ' + children.length);
	if (children[0].textContent !== 'A') assert.fail('span 0 is not as expected');
	if (children[1].textContent !== 'B') assert.fail('span 1 is not as expected');
	if (children[2].textContent !== 'C') assert.fail('span 2 is not as expected');
});