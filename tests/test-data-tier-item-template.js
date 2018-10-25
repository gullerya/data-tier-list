import * as DataTier from '../node_modules/data-tier/dist/data-tier.js';

let
	suite = Utils.JustTest.createSuite({name: 'Simple cases - select'});

suite.addTest({name: 'validate simple select options'}, (pass, fail) => {
	let e = document.createElement('div'),
		t = DataTier.ties.create('selectA', []);

	e.textContent = `
		<select>
			<template class="order" data-tie="selectA:options => ">
				<option data-tie="option:text => textContent, option:value => value"></option>
			</template>
		</select>`;
});

suite.run();
