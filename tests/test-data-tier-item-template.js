import * as DataTier from '../node_modules/data-tier/dist/module/data-tier.js';
import '../dist/data-tier-list.js';

let
	suite = Utils.JustTest.createSuite({name: 'Simple cases - select'}),
	e = document.createElement('select'),
	t = DataTier.ties.create('selectA', {
		options: [
			{text: 'TEXT 1', value: 1},
			{text: 'TEXT 2', value: 2},
			{text: 'TEXT 3', value: 3}
		]
	}),
	children;

suite.addTest({name: 'validate simple select options'}, async (pass, fail) => {
	e.innerHTML = `
			<template is="data-tier-item-template" class="order" data-tie="selectA:options => items">
				<option data-tie="item:text => textContent, item:value => value"></option>
			</template>`;

	//	initial insert
	document.body.appendChild(e);
	await new Promise(res => setTimeout(res, 0));
	children = e.querySelectorAll('option');
	if (children.length !== 3) fail('expected to have 3 options, found ' + children.length);
	if (children[0].textContent !== 'TEXT 1' || children[0].value !== '1') fail('[initial] option 0 is not as expected');
	if (children[1].textContent !== 'TEXT 2' || children[1].value !== '2') fail('[initial] option 1 is not as expected');
	if (children[2].textContent !== 'TEXT 3' || children[2].value !== '3') fail('[initial] option 2 is not as expected');

	//	PUSH
	t.model.options.push({text: 'TEXT 4', value: 4});
	await new Promise(res => setTimeout(res, 0));
	children = e.querySelectorAll('option');
	if (children.length !== 4) fail('expected to have 4 options, found ' + children.length);
	if (children[0].textContent !== 'TEXT 1' || children[0].value !== '1') fail('[push] option 0 is not as expected');
	if (children[1].textContent !== 'TEXT 2' || children[1].value !== '2') fail('[push] option 1 is not as expected');
	if (children[2].textContent !== 'TEXT 3' || children[2].value !== '3') fail('[push] option 2 is not as expected');
	if (children[3].textContent !== 'TEXT 4' || children[3].value !== '4') fail('[push] option 3 is not as expected');

	//	UNSHIFT
	t.model.options.unshift({text: 'TEXT 0', value: 0});
	await new Promise(res => setTimeout(res, 0));
	children = e.querySelectorAll('option');
	if (children.length !== 5) fail('expected to have 5 options, found ' + children.length);
	if (children[0].textContent !== 'TEXT 0' || children[0].value !== '0') fail('[unshift] option 0 is not as expected');
	if (children[1].textContent !== 'TEXT 1' || children[1].value !== '1') fail('[unshift] option 1 is not as expected');
	if (children[2].textContent !== 'TEXT 2' || children[2].value !== '2') fail('[unshift] option 2 is not as expected');
	if (children[3].textContent !== 'TEXT 3' || children[3].value !== '3') fail('[unshift] option 3 is not as expected');
	if (children[4].textContent !== 'TEXT 4' || children[4].value !== '4') fail('[unshift] option 4 is not as expected');

	//	FIRST and LAST item mutation
	t.model.options[0].text = 'TEXT FIRST';
	t.model.options[4].text = 'TEXT LAST';
	children = e.querySelectorAll('option');
	if (children[0].textContent !== 'TEXT FIRST') fail('[modify] option 0 is not as expected');
	if (children[4].textContent !== 'TEXT LAST') fail('[modify] option 4 is not as expected');

	//	SHIFT
	t.model.options.shift();
	t.model.options[0].text = 'TEXT NEW FIRST';
	await new Promise(res => setTimeout(res, 0));

	children = e.querySelectorAll('option');
	if (children.length !== 4) fail('expected to have 4 options, found ' + children.length);
	if (children[0].textContent !== 'TEXT NEW FIRST' || children[0].value !== '1') fail('[shift] option 0 is not as expected');
	if (children[1].textContent !== 'TEXT 2' || children[1].value !== '2') fail('[shift] option 1 is not as expected');
	if (children[2].textContent !== 'TEXT 3' || children[2].value !== '3') fail('[shift] option 2 is not as expected');
	if (children[3].textContent !== 'TEXT LAST' || children[3].value !== '4') fail('[shift] option 3 is not as expected');

	//	POP
	t.model.options.pop();
	await new Promise(res => setTimeout(res, 0));
	children = e.querySelectorAll('option');
	if (children.length !== 3) fail('expected to have 3 options, found ' + children.length);
	if (children[0].textContent !== 'TEXT NEW FIRST' || children[0].value !== '1') fail('[pop] option 0 is not as expected');
	if (children[1].textContent !== 'TEXT 2' || children[1].value !== '2') fail('[pop] option 1 is not as expected');
	if (children[2].textContent !== 'TEXT 3' || children[2].value !== '3') fail('[pop] option 2 is not as expected');

	//	REVERSE
	t.model.options.reverse();
	await new Promise(res => setTimeout(res, 0));
	children = e.querySelectorAll('option');
	if (children.length !== 3) fail('expected to have 3 options, found ' + children.length);
	if (children[0].textContent !== 'TEXT 3' || children[0].value !== '3') fail('[reverse] option 0 is not as expected');
	if (children[1].textContent !== 'TEXT 2' || children[1].value !== '2') fail('[reverse] option 1 is not as expected');
	if (children[2].textContent !== 'TEXT NEW FIRST' || children[2].value !== '1') fail('[reverse] option 2 is not as expected');

	pass();
});

suite.run();
