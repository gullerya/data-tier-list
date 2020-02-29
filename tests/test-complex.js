import { getSuite } from '../node_modules/just-test/dist/just-test.js';
import * as DataTier from '../dist/data-tier/data-tier.js';
import '../dist/data-tier-list.js';

const suite = getSuite({ name: 'Complex cases - grid' });

class Product {
	constructor(name, description, location, available, amount, price) {
		this.name = name;
		this.description = description;
		this.available = available;
		this.amount = amount;
		this.location = location;
	}
}

suite.runTest({ name: 'complex grid content - direct usage' }, async test => {
	const e = document.createElement('div');
	e.innerHTML = `
		<data-tier-list>
			<div>
				<span data-tie="scope:name => textContent"></span>
				<input type="text" data-tie="scope:description"/>
				<input type="checkbox" data-tie="scope:available"/>
				<span data-tie="scope:amount"></span>
				<div>
					<span data-tie="scope:location.city => textContent"></span>
					<span data-tie="scope:location.street"></span>
					<input type="number" data-tie="scope:location.number"/>
				</div>
			</div>
		</data-tier-list>
	`;
	e.style.cssText = 'width: 100%; height: 200px; overflow: auto';
	document.body.appendChild(e);

	//	insert 20 items as a single inject
	const items = [];
	for (let i = 1; i <= 20; i++) {
		items.push(new Product(
			'Name ' + i,
			'Description ' + i,
			{
				city: 'City ' + i,
				street: 'Street ' + i,
				number: i
			},
			i % 3 === 0,
			1000 * Math.random(),
			1000 + i * 10
		));
	}
	e.firstElementChild.items = items;
	await test.waitNextMicrotask();
	test.assertEqual('Name 1', e.children[1].children[0].textContent);
	test.assertEqual('Description 11', e.children[11].children[1].value);
	test.assertEqual(12 % 3 === 0, e.children[12].children[2].checked);
	test.assertEqual('City 14', e.children[14].children[4].children[0].textContent);
	test.assertEqual('20', e.children[20].children[4].children[2].value);

	//	perform some changes MV and VM


	//	add few items to the end

	//	perform some changes MV and VM

	//	add few items to the beginning

	//	perform some changes MV and VM on the new elements

	//	preform some changes MV and VM on the old elements

	//	add few items in the middle

	//	perform some changes MV and VM on the new elements

	//	perform some changes MV and VM on the old elements

	//	remove some elements from the middle

	//	perform some changes MV and VM on the rest elements

});