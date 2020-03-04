import { getSuite } from '../node_modules/just-test/dist/just-test.js';
import '../dist/data-tier-list.js';

const suite = getSuite({ name: 'Complex cases - nested' });
const htmlTemplate = `
	<data-tier-list>
		<div>
			<data-tier-list data-tie="scope => scope">
				<span data-tie="scope"></span>
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
});

function createGridData(n, m) {
	const items = [];
	for (let i = 1; i <= n; i++) {
		const nextRow = [];
		for (let j = 1; j <= m; j++) {
			nextRow.push(j);
		}
		items.push(nextRow);
	}
	return items;
}