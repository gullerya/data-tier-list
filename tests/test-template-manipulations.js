import { getSuite } from '../node_modules/just-test/dist/just-test.js';
import '../dist/data-tier-list.js';

const suite = getSuite({ name: 'Template manupulations' });
const randomIDSource = 'abcdefghijklmnopqrstuvwxyz';

suite.runTest({ name: 'template first, data last' }, async () => {
});

suite.runTest({ name: 'template last, data first' }, async () => {
});

suite.runTest({ name: 'template change (top level) reflected' }, async test => {
	const lid = test.getRandom(8, [randomIDSource]);
	const tid = test.getRandom(8, [randomIDSource]);
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
	await test.waitNextMicrotask();

	const te = document.querySelector(`#${tid}`);
	test.assertEqual(3, te.childElementCount);
	Array.from(te.children).forEach((c, i) => {
		test.assertEqual('span', c.localName);
		test.assertEqual(le.items[i], c.textContent);
	});

	le.innerHTML = '<div data-tie="item"></div>';
	await test.waitNextMicrotask();

	test.assertEqual(3, te.childElementCount);
	Array.from(te.children).forEach((c, i) => {
		test.assertEqual('div', c.localName);
		test.assertEqual(le.items[i], c.textContent);
	});
});

suite.runTest({ name: 'template change (nested child) reflected' }, async test => {
	const lid = test.getRandom(8, [randomIDSource]);
	const tid = test.getRandom(8, [randomIDSource]);
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
	await test.waitNextMicrotask();

	const te = document.querySelector(`#${tid}`);
	test.assertEqual(3, te.childElementCount);
	Array.from(te.children).forEach((c, i) => {
		test.assertEqual('div', c.localName);
		test.assertEqual('span', c.firstElementChild.localName);
		test.assertEqual(le.items[i], c.firstElementChild.textContent);
	});

	le.firstElementChild.innerHTML = '<div data-tie="item"></div>';
	await test.waitNextMicrotask();

	test.assertEqual(3, te.childElementCount);
	Array.from(te.children).forEach((c, i) => {
		test.assertEqual('div', c.localName);
		test.assertEqual('div', c.firstElementChild.localName);
		test.assertEqual(le.items[i], c.firstElementChild.textContent);
	});
});

suite.runTest({ name: 'template clear reflected' }, async () => {
});

suite.runTest({ name: 'template error reflected' }, async () => {
});