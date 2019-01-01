import * as DataTier from '../node_modules/data-tier/dist/data-tier.js';
import '../dist/data-tier-list.js';

let
	suite = Utils.JustTest.createSuite({name: 'Complex cases - grid'}),
	e = document.createElement('div'),
	t = DataTier.ties.create('productsComplexRepeater', {products: []}),
	children;

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

suite.addTest({name: 'validate complex grid content (2000)'}, async (pass, fail) => {
	e.innerHTML = `
			<template is="data-tier-item-template" class="order" data-tie="productsComplexRepeater:products => items">
				<div>
					<span data-tie="item:name => textContent"></span>
					<span data-tie="item:description => textContent"></span>
					<input type="checkbox" data-tie="item:available => value"/>
					<span data-tie="item:amount => textContent"></span>
					<span>$<span data-tie="item:price => textContent"></span></span>
					<div>
						<span data-tie="item:location.city => textContent"></span>
						<span data-tie="item:location.street => textContent"></span>
						<span data-tie="item:location.number => textContent"></span>
					</div>
				</div>
			</template>`;
	e.style.cssText = 'width: 100%; height: 200px; overflow: auto';

	//	initial insert
	document.body.appendChild(e);

	//	add products data one by one
	let i = 2000;

	function addProduct() {
		window.requestAnimationFrame(() => {
			let cycles = 5;
			while (--cycles) {
				t.model.products.push(new Product(
					'name ' + i,
					'description ' + i,
					{city: 'Nowhere', street: 'Emptiness', number: i},
					i % 5 !== 0,
					i % 5,
					1000 + i
				));
				i--;
			}
			if (i) addProduct();
		});
	}

	addProduct();

	pass();
});

suite.run();
