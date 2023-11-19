import { test } from '@gullerya/just-test';
import { getRandom } from '@gullerya/just-test/random';
import { waitNextTask } from '@gullerya/just-test/timing';
import { ties } from '@gullerya/data-tier';
import '../src/data-tier-list.js';

import 'chai';
const assert = globalThis.chai.assert;

test('tied with a simple (non-scoped) tie', async () => {
	const tn = getRandom();
	const e = document.createElement('div');
	e.innerHTML = `
		<data-tier-list data-tie="${tn} => items">
			<div data-tie="item:text"></div>
		</data-tier-list>
	`;
	document.body.appendChild(e);

	assert.strictEqual(1, e.childElementCount);

	const m = ties.create(tn, [{ text: '1' }, { text: '2' }, { text: '3' }]);
	await waitNextTask();

	assert.strictEqual(4, e.childElementCount);
	for (const [i, te] of Array.from(e.children).entries()) {
		if (!i) continue;
		assert.strictEqual(m[i - 1].text, te.textContent);
	}
});

test('scoped tying with overlapping (shadowing property)', async () => {
	const tn = getRandom();
	const m = ties.create(tn, {
		title: 'Title',
		items: [{ title: '1' }, { title: '2' }, { title: '3' }]
	});

	const e = document.createElement('div');
	e.innerHTML = `
		<div data-tie="${tn} => scope">
			<div class="title" data-tie="scope:title"></div>
			<div class="list">
				<data-tier-list data-tie="scope:items => items">
					<div class="template" data-tie="item:title">[original non-touched content]</div>
				</data-tier-list>
			</div>
		</div>
	`;
	document.body.appendChild(e);
	const titleElement = e.querySelector('.title');
	const listElement = e.querySelector('.list');
	const templateElement = e.querySelector('.template');

	await waitNextTask();

	assert.strictEqual(1, e.childElementCount);
	assert.strictEqual(2, e.children[0].childElementCount);
	assert.strictEqual('Title', titleElement.textContent);
	assert.strictEqual(4, listElement.childElementCount);
	assert.strictEqual('[original non-touched content]', templateElement.textContent);

	await waitNextTask();

	assert.strictEqual('[original non-touched content]', templateElement.textContent);
	for (const [i, te] of Array.from(listElement.children).entries()) {
		if (te.matches('[hidden]')) continue;
		assert.strictEqual(m.items[i - 1].title, te.textContent);
	}
});