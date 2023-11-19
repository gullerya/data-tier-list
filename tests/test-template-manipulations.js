import { test } from '@gullerya/just-test';
import { getRandom } from '@gullerya/just-test/random';
import { waitNextTask } from '@gullerya/just-test/timing';
import '../src/data-tier-list.js';

import 'chai';
const assert = globalThis.chai.assert;

test('template change (top level) reflected', async () => {
	const lid = 'a' + getRandom();
	const tid = 'a' + getRandom();
	let template = document.createElement('template');
	template.innerHTML = `
		<div id="${tid}"></div>
		<data-tier-list id="${lid}" data-list-target="#${tid}">
			<span data-tie="item"></span>
		</data-tier-list>
	`;
	document.body.appendChild(template.content);
	const le = document.querySelector(`#${lid}`);
	le.items = ['a', 'b', 'c'];
	await waitNextTask();

	const te = document.querySelector(`#${tid}`);
	assert.strictEqual(3, te.childElementCount);
	Array.from(te.children).forEach((c, i) => {
		assert.strictEqual('span', c.localName);
		assert.strictEqual(le.items[i], c.textContent);
	});

	le.innerHTML = '<div data-tie="item"></div>';
	await waitNextTask();

	assert.strictEqual(3, te.childElementCount);
	Array.from(te.children).forEach((c, i) => {
		assert.strictEqual('div', c.localName);
		assert.strictEqual(le.items[i], c.textContent);
	});
});

test('template change (nested child) reflected', async () => {
	const lid = 'a' + getRandom();
	const tid = 'a' + getRandom();
	let template = document.createElement('template');
	template.innerHTML = `
		<div id="${tid}"></div>
		<data-tier-list id="${lid}" data-list-target="#${tid}">
			<div>
				<span data-tie="item"></span>
			</div>
		</data-tier-list>
	`;
	document.body.appendChild(template.content);
	const le = document.querySelector(`#${lid}`);
	le.items = ['a', 'b', 'c'];
	await waitNextTask();

	const te = document.querySelector(`#${tid}`);
	assert.strictEqual(3, te.childElementCount);
	Array.from(te.children).forEach((c, i) => {
		assert.strictEqual('div', c.localName);
		assert.strictEqual('span', c.firstElementChild.localName);
		assert.strictEqual(le.items[i], c.firstElementChild.textContent);
	});

	le.firstElementChild.innerHTML = '<div data-tie="item"></div>';
	await waitNextTask();

	assert.strictEqual(3, te.childElementCount);
	Array.from(te.children).forEach((c, i) => {
		assert.strictEqual('div', c.localName);
		assert.strictEqual('div', c.firstElementChild.localName);
		assert.strictEqual(le.items[i], c.firstElementChild.textContent);
	});
});