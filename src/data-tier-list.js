import { ties } from './data-tier/data-tier.min.js';

const
	DATA_TIER_LIST = 'data-tier-list',
	SELF_TEMPLATE = `
		<style>:host {display: none;}</style>
		<slot></slot>
	`,
	ITEMS_KEY = Symbol('items.key'),
	TEMPLATE_KEY = Symbol('template'),

	OBSERVER_KEY = Symbol('observer'),
	FULL_UPDATER_KEY = Symbol('full.updater'),
	PART_UPDATER_KEY = Symbol('part.updater'),
	CONTAINER_RESOLVER_KEY = Symbol('container.resolver'),
	TEMPLATE_PROCESSOR_KEY = Symbol('template.processor');

class DataTierList extends HTMLElement {
	constructor() {
		super();
		this[ITEMS_KEY] = null;
		this[TEMPLATE_KEY] = null;
		this[OBSERVER_KEY] = this[OBSERVER_KEY].bind(this);
		this.attachShadow({ mode: 'open' }).innerHTML = SELF_TEMPLATE;
		this.shadowRoot.querySelector('slot').addEventListener('slotchange', () => this[TEMPLATE_PROCESSOR_KEY]());
	}

	get defaultTieTarget() {
		return 'items';
	}

	set items(items) {
		//	not an Array - exit eagerly
		if (!Array.isArray(items)) {
			if (this[ITEMS_KEY] && this[ITEMS_KEY].length) {
				console.warn(`array of items expected (empty array or null allowed), but got '${items}'; nor further action taken`);
			}
			return;
		}

		//	same value set - exit eagerly
		if (this[ITEMS_KEY] === items) {
			return;
		}

		//	remove old model
		if (this[ITEMS_KEY]) {
			this[ITEMS_KEY].unobserve(this[OBSERVER_KEY]);
			if (ties.get(this)) {
				ties.remove(this);
			}
		}

		//	create/update model
		const im = ties.update(this, items);
		im.observe(this[OBSERVER_KEY], { pathsOf: '' });
		this[ITEMS_KEY] = im;
		this[FULL_UPDATER_KEY]();
	}

	get items() {
		return this[ITEMS_KEY];
	}

	[CONTAINER_RESOLVER_KEY]() {
		let result;
		const attr = this.getAttribute('data-list-target');
		if (attr) {
			result = this.getRootNode().querySelector(attr);
			if (!result) {
				throw new Error(`failed to resolve target container by the given query '${attr}'`);
			}
		} else {
			result = this.parentNode;
		}
		return result;
	}

	[TEMPLATE_PROCESSOR_KEY]() {
		const templateNodes = this.shadowRoot.querySelector('slot').assignedNodes().filter(n => n.nodeType === Node.ELEMENT_NODE);
		let newTemplate = null;
		if (templateNodes.length === 1) {
			newTemplate = templateNodes[0].outerHTML;
		} else {
			throw new Error(`list item template MAY have 1 root element only, got ${templateNodes.length}`);
		}

		//	TODO: any preprocessing/optimisations go here
		this[TEMPLATE_KEY] = newTemplate;
		this[FULL_UPDATER_KEY]();
	}

	[OBSERVER_KEY](changes) {
		for (const change of changes) {
			if (change.type === 'shuffle') {
				this[FULL_UPDATER_KEY]();
			} else {
				this[PART_UPDATER_KEY](change);
			}
		}
	}

	[FULL_UPDATER_KEY]() {
		if (!this[TEMPLATE_KEY] || !this[ITEMS_KEY]) {
			return;
		}

		const
			targetContainer = this[CONTAINER_RESOLVER_KEY](),
			inParentAdjust = targetContainer.contains(this) ? 1 : 0;

		const
			items = this.items,
			currentListLength = targetContainer.childElementCount - inParentAdjust,
			desiredListLength = items.length;

		let llc = currentListLength,
			lastElementChild;

		while (llc > desiredListLength) {
			lastElementChild = targetContainer.lastElementChild;
			if (lastElementChild !== this) {
				lastElementChild.remove();
			}
			llc--;
		}

		let appendContent = '';
		while (llc < desiredListLength) {
			appendContent += this[TEMPLATE_KEY];
			llc++;
		}
		if (appendContent) {
			const t = document.createElement('template');
			t.innerHTML = appendContent;
			targetContainer.appendChild(t.content);
		}

		for (let i = inParentAdjust, l = targetContainer.children.length; i < l; i++) {
			const c = targetContainer.children[i];
			ties.update(c, items[i - inParentAdjust]);
		}
	}

	[PART_UPDATER_KEY](change) {
		if (!this[TEMPLATE_KEY] || !this[ITEMS_KEY]) {
			return;
		}

		const
			targetContainer = this[CONTAINER_RESOLVER_KEY](),
			inParentAdjust = targetContainer.contains(this) ? 1 : 0;

		const t = document.createElement('template');
		if (change.path.length > 1) {
			return;
		}
		if (change.type === 'insert') {
			t.innerHTML = this[TEMPLATE_KEY];
			ties.create(t.content.firstElementChild, change.value);
			targetContainer.insertBefore(t.content, targetContainer.children[change.path[0] + inParentAdjust]);
		} else if (change.type === 'update') {
			//	TODO
		} else if (change.type === 'delete') {
			targetContainer.removeChild(targetContainer.children[change.path[0] + inParentAdjust]);
		} else if (change.type === 'reverse') {
			for (var i = inParentAdjust + 1, l = targetContainer.children.length - inParentAdjust / 2; i < l; i++) {
				targetContainer.insertBefore(targetContainer.children[i], targetContainer.children[i - 1]);
			}
		} else {
			console.warn(`unsupported change type ${change.type}`);
		}
	}
}

if (!customElements.get(DATA_TIER_LIST)) {
	customElements.define(DATA_TIER_LIST, DataTierList);
} else {
	console.warn(`'${DATA_TIER_LIST}' is already defined in this environment, won't redefine`);
}
