import { getSuite } from '../node_modules/just-test/dist/just-test.js';
import '../dist/data-tier-list.js';

const suite = getSuite({ name: 'Complex cases - nested' });
const htmlTemplate = `
	<data-tier-list>
		<div data-tie="scope => scope">
			<data-tier-list data-tie="scope => items">
				<span data-tie="scope:text"></span>
			</data-tier-list>
		</div>
	</data-tier-list>
`;

suite.runTest({ name: 'complex grid content - set items' }, async test => {
	const e = document.createElement('div');
	e.innerHTML = htmlTemplate;
	e.style.cssText = 'width: 100%; height: 200px; overflow: auto';
	document.body.appendChild(e);

	e.firstElementChild.items = createGridData(10, 10);

	await test.waitNextMicrotask();

	test.assertEqual(11, e.childElementCount);
	for (let i = 1; i < e.childElementCount; i++) {
		const flChild = e.children[i];
		test.assertEqual(11, flChild.childElementCount);
		for (let j = 1; j < flChild.length; j++) {
			const slChild = flChild.children[j];
			test.assertEqual(j, slChild.textContent);
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