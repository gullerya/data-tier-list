import { getSuite } from '../node_modules/just-test/dist/just-test.js';
import { ties } from '../node_modules/data-tier/dist/data-tier.min.js';
import '../src/data-tier-list.js';

const suite = getSuite({ name: 'Test data-tier-list with upper tying' });

suite.runTest({ name: 'tied with a simple (non-scoped) tie' }, async test => {
	const tn = test.getRandom(8);
	const e = document.createElement('div');
	e.innerHTML = `
		<data-tier-list data-tie="${tn} => items">
			<div data-tie="item:text"></div>
		</data-tier-list>
	`;
	document.body.appendChild(e);

	test.assertEqual(1, e.childElementCount);

	const m = ties.create(tn, [{ text: '1' }, { text: '2' }, { text: '3' }]);
	await test.waitNextMicrotask();

	test.assertEqual(4, e.childElementCount);
	for (const [i, te] of Array.from(e.children).entries()) {
		if (!i) continue;
		test.assertEqual(m[i - 1].text, te.textContent);
	}
});

suite.runTest({ name: 'scoped tying with overlapping (shadowing property)' }, async test => {
	const tn = test.getRandom(8);
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

	await test.waitNextMicrotask();

	test.assertEqual(1, e.childElementCount);
	test.assertEqual(2, e.children[0].childElementCount);
	test.assertEqual('Title', titleElement.textContent);
	test.assertEqual(4, listElement.childElementCount);
	test.assertEqual('[original non-touched content]', templateElement.textContent);

	await test.waitNextMicrotask();

	test.assertEqual('[original non-touched content]', templateElement.textContent);
	for (const [i, te] of Array.from(listElement.children).entries()) {
		if (te.matches('[hidden]')) continue;
		test.assertEqual(m.items[i - 1].title, te.textContent);
	}
});