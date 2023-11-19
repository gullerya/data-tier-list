import { test } from '@gullerya/just-test';
import { waitNextTask } from '@gullerya/just-test/timing';
import '../src/data-tier-list.js';

import 'chai';
const assert = globalThis.chai.assert;

const htmlTemplate = `
	<data-tier-list>
		<div data-tie="scope => scope">
			<data-tier-list data-tie="scope => items">
				<span data-tie="item:text"></span>
			</data-tier-list>
		</div>
	</data-tier-list>
`;

test('complex grid content - set items', async () => {
	const e = document.createElement('div');
	e.innerHTML = htmlTemplate;
	e.style.cssText = 'width: 100%; height: 200px; overflow: auto';
	document.body.appendChild(e);

	e.firstElementChild.items = createGridData(10, 10);

	await waitNextTask();

	assert.strictEqual(11, e.childElementCount);
	for (let i = 1; i < e.childElementCount; i++) {
		const flChild = e.children[i];
		assert.strictEqual(11, flChild.childElementCount);
		for (let j = 1; j < flChild.length; j++) {
			const slChild = flChild.children[j];
			assert.strictEqual(j, slChild.textContent);
		}
	}
});

function createGridData(n, m) {
	const items = [];
	for (let i = 1; i <= n; i++) {
		const nextRow = [];
		for (let j = 1; j <= m; j++) {
			nextRow.push({ text: j });
		}
		items.push(nextRow);
	}
	return items;
}