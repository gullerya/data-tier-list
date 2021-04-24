import { ties } from './data-tier/data-tier.min.js';
import { Observable } from './data-tier/object-observer.min.js';

const
	DATA_TIER_LIST = 'data-tier-list',
	SELF_TEMPLATE = `<slot id="template"></slot>`,
	ITEM_KEY = Symbol('item.key'),
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
		//	TODO: replace the below one with MutationObserver
		this.shadowRoot.querySelector('#template').addEventListener('slotchange', () => this[TEMPLATE_PROCESSOR_KEY]());
	}

	connectedCallback() {
		this.hidden = true;
		this[TEMPLATE_PROCESSOR_KEY]();
	}

	get defaultTieTarget() {
		return 'items';
	}

	set items(items) {
		if (this[ITEMS_KEY] === items) {
			return;
		}

		if (items === null || items === '') {
			if (this[ITEMS_KEY]) {
				this[ITEMS_KEY].unobserve(this[OBSERVER_KEY]);
				this[ITEMS_KEY] = null;
				this[FULL_UPDATER_KEY]();
			}
		} else if (typeof items === 'object') {
			if (this[ITEMS_KEY]) {
				this[ITEMS_KEY].unobserve(this[OBSERVER_KEY]);
			}

			this[ITEMS_KEY] = Observable.from(items);
			this[ITEMS_KEY].observe(this[OBSERVER_KEY], { pathsOf: '' });
			this[FULL_UPDATER_KEY]();
		} else {
			console.error(`items MAY ONLY be set to an object, got '${items}'`);
		}
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
		const templateNodes = this.children;
		let newTemplate = null;
		if (templateNodes.length === 1) {
			newTemplate = templateNodes[0].outerHTML;
		} else {
			console.error(`list item template MAY have 1 root element only, got ${templateNodes.length}`);
			return;
		}

		if (templateNodes[0] === this.__currentTemplate) {
			return;
		}

		//	scoping the template self to prevent shadowing
		if (this.__currentTemplate) {
			ties.remove(this.__currentTemplate);
		}
		ties.create(templateNodes[0]);
		this.__currentTemplate = templateNodes[0];

		//	TODO: any preprocessing/optimisations go here
		this[TEMPLATE_KEY] = newTemplate;
		this[FULL_UPDATER_KEY]();
	}

	[OBSERVER_KEY](changes) {
		for (const change of changes) {
			if (change.type === 'shuffle' || change.type === 'reverse') {
				this[FULL_UPDATER_KEY]();
			} else {
				this[PART_UPDATER_KEY](change);
			}
		}
	}

	[FULL_UPDATER_KEY]() {
		if (!this[TEMPLATE_KEY] || !this.items) {
			return;
		}

		const
			targetContainer = this[CONTAINER_RESOLVER_KEY](),
			inParentAdjust = targetContainer.contains(this) ? 1 : 0;

		const
			keys = Object.keys(this.items),
			desiredListLength = keys.length,
			currentListLength = targetContainer.childElementCount - inParentAdjust;

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
			c[ITEM_KEY] = keys[i - inParentAdjust];
			ties.update(c, this.items[keys[i - inParentAdjust]]);
		}
	}

	[PART_UPDATER_KEY](change) {
		if (!this[TEMPLATE_KEY] || !this.items) {
			return;
		}

		const
			targetContainer = this[CONTAINER_RESOLVER_KEY](),
			inParentAdjust = targetContainer.contains(this) ? 1 : 0;

		const t = document.createElement('template');
		if (change.path.length > 1) {
			return;
		}
		if (Array.isArray(this.items)) {
			const affectedIndex = parseInt(change.path[0], 10);
			if (change.type === 'insert') {
				t.innerHTML = this[TEMPLATE_KEY];
				ties.create(t.content.firstElementChild, change.value);
				targetContainer.insertBefore(t.content, targetContainer.children[affectedIndex + inParentAdjust]);
			} else if (change.type === 'update') {
				ties.update(targetContainer.children[affectedIndex + inParentAdjust], change.value);
			} else if (change.type === 'delete') {
				targetContainer.removeChild(targetContainer.children[affectedIndex + inParentAdjust]);
			} else if (change.type === 'reverse') {
				for (var i = inParentAdjust + 1, l = targetContainer.children.length - inParentAdjust / 2; i < l; i++) {
					targetContainer.insertBefore(targetContainer.children[i], targetContainer.children[i - 1]);
				}
			} else {
				console.warn(`unsupported change type ${change.type}`);
			}
		} else {
			const itemKeys = Object.keys(this.items);
			const affectedIndex = itemKeys.indexOf(change.path[0]);
			if (change.type === 'insert') {
				t.innerHTML = this[TEMPLATE_KEY];
				ties.create(t.content.firstElementChild, change.value);
				//	TODO: add test that breaks and fix it for object
				targetContainer.insertBefore(t.content, targetContainer.children[change.path[0] + inParentAdjust]);
			} else if (change.type === 'update') {
				ties.update(targetContainer.children[affectedIndex + inParentAdjust], change.value);
			} else if (change.type === 'delete') {
				for (const child of targetContainer.children) {
					if (child[ITEM_KEY] === change.path[0]) {
						child.remove();
						break;
					}
				}
			} else {
				console.warn(`unsupported change type ${change.type}`);
			}
		}
	}
}

if (!customElements.get(DATA_TIER_LIST)) {
	customElements.define(DATA_TIER_LIST, DataTierList);
} else {
	console.warn(`'${DATA_TIER_LIST}' is already defined in this environment, won't redefine`);
}
