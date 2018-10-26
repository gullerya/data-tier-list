import * as DataTier from '../node_modules/data-tier/dist/module/data-tier.js';
import '../dist/data-tier-list.js';

let
	suite = Utils.JustTest.createSuite({name: 'Simple cases - select'});

suite.addTest({name: 'validate simple select options'}, (pass, fail) => {
	let e = document.createElement('div'),
		t = DataTier.ties.create('selectA', {
			options: [
				{text: 'TEXT 1', value: 1},
				{text: 'TEXT 2', value: 2},
				{text: 'TEXT 3', value: 3}
			]
		});

	e.innerHTML = `<select>
			<template is="data-tier-item-template" class="order" data-tie="selectA:options => items">
				<option data-tie="item:text => textContent, item:value => value"></option>
			</template>
		</select>`;

	document.body.appendChild(e);
	//	TODO: verify

	t.model.options.push({text: 'TEXT 4', value: 4});
	//	TODO: verify

	t.model.options.unshift({text: 'TEXT 0', value: 0});
	//	TODO: verify

	t.model.options[4].text = 'TEXT LAST';
	//	TODO: verify

	t.model.options[0].text = 'TEXT FIRST';
	//	TODO: verify

	t.model.options.shift();
	t.model.options[0].text = 'TEXT NEW FIRST';
	//	TODO: verify

	t.model.options.pop();
	//	TODO: verify

	t.model.options.reverse();
	//	TODO: verify

	pass();
});

suite.run();
