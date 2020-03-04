import { getSuite } from '../node_modules/just-test/dist/just-test.js';
import * as DataTier from '../dist/data-tier/data-tier.min.js';
import '../dist/data-tier-list.js';

const suite = getSuite({ name: 'Complex cases - tied usage' });
const htmlTemplate = `
	<data-tier-list>
		<div>
			<span data-tie="scope:name => textContent"></span>
			<input type="text" data-tie="scope:description"/>
			<input type="checkbox" data-tie="scope:available"/>
			<span data-tie="scope:amount"></span>
			<div style="display: inline-block">
				<span data-tie="scope:location.city => textContent"></span>
				<span data-tie="scope:location.street"></span>
				<input type="text" data-tie="scope:location.number"/>
			</div>
		</div>
	</data-tier-list>
`;

class Product {
	constructor(name, description, location, available, amount) {
		this.name = name;
		this.description = description;
		this.available = available;
		this.amount = amount;
		this.location = location;
	}
}

suite.runTest({ name: 'complex grid content - set items' }, async test => {
	const e = document.createElement('div');
	e.innerHTML = htmlTemplate;
	e.style.cssText = 'width: 100%; height: 200px; overflow: auto';
	document.body.appendChild(e);

	//	insert 20 items as a single inject
	const tn = test.getRandom(8);
	const model = DataTier.ties.create(tn, createNItems(20));

	e.firstElementChild.dataset.tie = `${tn}`
	await test.waitNextMicrotask();
	test.assertEqual('Name 1', e.children[1].children[0].textContent);
	test.assertEqual('Description 11', e.children[11].children[1].value);
	test.assertEqual(12 % 3 === 0, e.children[12].children[2].checked);
	test.assertEqual('City 14', e.children[14].children[4].children[0].textContent);
	test.assertEqual('20', e.children[20].children[4].children[2].value);

	e.children[6].children[1].value = 'Description New';
	e.children[6].children[1].dispatchEvent(new Event('change'));
	e.children[3].children[4].children[2].value = '12';
	e.children[3].children[4].children[2].dispatchEvent(new Event('change'));

	await test.waitNextMicrotask();
	test.assertEqual('Description New', model[5].description);
	test.assertEqual('12', model[2].location.number);
});

function createNItems(n) {
	const items = [];
	for (let i = 1; i <= n; i++) {
		items.push(new Product(
			'Name ' + i,
			'Description ' + i,
			{
				city: 'City ' + i,
				street: 'Street ' + i,
				number: i
			},
			i % 3 === 0,
			1000 * Math.random()
		));
	}
	return items;
}