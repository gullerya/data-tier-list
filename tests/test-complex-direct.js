import { getSuite } from '../node_modules/just-test/dist/just-test.js';
import '../dist/data-tier-list.js';

const suite = getSuite({ name: 'Complex cases - direct usage' });
const htmlTemplate = `
	<data-tier-list>
		<div>
			<span data-tie="item:name => textContent"></span>
			<input type="text" data-tie="item:description"/>
			<input type="checkbox" data-tie="item:available"/>
			<span data-tie="item:amount"></span>
			<div style="display: inline-block">
				<span data-tie="item:location.city => textContent"></span>
				<span data-tie="item:location.street"></span>
				<input type="text" data-tie="item:location.number"/>
			</div>
		</div>
	</data-tier-list>
`;

class Product {
	constructor(pName, pDescription, pLocation, pAvailable, pAmount) {
		this.name = pName;
		this.description = pDescription;
		this.available = pAvailable;
		this.amount = pAmount;
		this.location = pLocation;
	}
}

suite.runTest({ name: 'complex grid content - set items' }, async test => {
	const e = document.createElement('div');
	e.innerHTML = htmlTemplate;
	e.style.cssText = 'width: 100%; height: 200px; overflow: auto';
	document.body.appendChild(e);

	//	insert 20 items as a single inject
	const items = createNItems(20);
	e.firstElementChild.items = items;
	await test.waitNextMicrotask();
	test.assertEqual(21, e.childElementCount);
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
	test.assertEqual('Description New', e.firstElementChild.items[5].description);
	test.assertEqual('12', e.firstElementChild.items[2].location.number);
});

suite.runTest({ name: 'complex grid content - add to the end' }, async test => {
	const e = document.createElement('div');
	e.innerHTML = htmlTemplate;
	e.style.cssText = 'width: 100%; height: 200px; overflow: auto';
	document.body.appendChild(e);

	const items = createNItems(5);
	e.firstElementChild.items = items;
	await test.waitNextMicrotask();

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