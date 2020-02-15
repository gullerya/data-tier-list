import { getSuite } from '../node_modules/just-test/dist/just-test.js';
import * as DataTier from '../node_modules/data-tier/dist/data-tier.js';
import '../dist/data-tier-list.js';

const
	suite = getSuite({ name: 'Complex cases - grid' }),
	e = document.createElement('div'),
	t = window.t = DataTier.ties.create('productsComplexRepeater', { products: [] });

class Product {
	constructor(name, description, location, available, amount, price) {
		this.name = name;
		this.description = description;
		this.location = location;
		this.available = available;
		this.amount = amount;
		this.price = price;
	}
}

suite.runTest({ name: 'validate complex grid content (2000)' }, async test => {
	e.innerHTML = `
		<data-tier-list class="order" data-tie="productsComplexRepeater:products => items">
			<div>
				<span data-tie="item:name => textContent"></span>
				<span data-tie="item:description"></span>
				<input type="checkbox" data-tie="item:available"/>
				<span data-tie="item:amount"></span>
				<span>$<span data-tie="item:price"></span></span>
				<div>
					<span data-tie="item:location.city => textContent"></span>
					<span data-tie="item:location.street"></span>
					<span data-tie="item:location.number"></span>
				</div>
			</div>
		</data-tier-list>
	`;
	e.style.cssText = 'width: 100%; height: 200px; overflow: auto';

	//	initial insert
	document.body.appendChild(e);

	//	add products data one by one
	let i = 2000;

	const ep = new Promise(resolve => {
		function addProduct() {
			window.requestAnimationFrame(() => {
				let cycles = 16;
				while (--cycles && i > 0) {
					t.products.push(new Product(
						'name ' + i,
						'description ' + i,
						{ city: 'Nowhere', street: 'Emptiness', number: i },
						i % 5 !== 0,
						i % 5,
						1000 + i
					));
					i--;
					if (i && i % 180 === 0) {
						t.products.splice(0);
					}
				}
				if (i > 0) addProduct();
				else resolve();
			});
		}

		addProduct();
	});

	await ep;
});