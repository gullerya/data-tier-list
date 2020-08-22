import * as DataTier from './data-tier/data-tier.min.js';

const
	SELF_TEMPLATE = `
		<style>:host {display: none;}</style>
		<slot></slot>
	`,
	BOUND_UPDATER_KEY = Symbol('bound.updater'),
	ITEMS_KEY = Symbol('items.key'),
	PREPARED_TEMPLATE_KEY = Symbol('prepared.template');

class DataTierList extends HTMLElement {
	constructor() {
		super();
		this[BOUND_UPDATER_KEY] = this.fullUpdate.bind(this);
		this.attachShadow({ mode: 'open' }).innerHTML = SELF_TEMPLATE;
		this.shadowRoot.querySelector('slot').addEventListener('slotchange', event => {
			const templateNodes = event.target.assignedNodes().filter(n => n.nodeType === Node.ELEMENT_NODE);
			if (!templateNodes.length) {
			} else if (templateNodes.length !== 1) {
				throw new Error(`list item template MAY have 1 root element only, got ${templateNodes.length}`);
			}
			this.preprocessTemplate(templateNodes[0]);
			this.fullUpdate();
		});
	}

	get defaultTieTarget() {
		return 'items';
	}

	set items(items) {
		//	not an Array - exit early
		if (!Array.isArray(items)) {
			console.error(`array of items expected, but got '${items}'`);
			return;
		}

		//	same value set - exit early
		if (this[ITEMS_KEY] === items) {
			return;
		}

		//	remove old model (should be conditional?)
		if (this[ITEMS_KEY]) {
			this[ITEMS_KEY].unobserve(this[BOUND_UPDATER_KEY]);
			if (DataTier.ties.get(this)) {
				DataTier.ties.remove(this);
			}
		}

		//	create new model
		let im;
		if (typeof items.observe === 'function' && typeof items.unobserve === 'function') {
			im = items;
		} else {
			im = DataTier.ties.create(this, items);
		}

		im.observe(this[BOUND_UPDATER_KEY]);
		this[ITEMS_KEY] = im;
		this.fullUpdate();
	}

	get items() {
		return this[ITEMS_KEY];
	}

	fullUpdate(changes) {
		if (!this[PREPARED_TEMPLATE_KEY] || !this[ITEMS_KEY]) {
			return;
		}

		const
			targetContainer = this.resolveTargetContainer(),
			inParentAdjust = targetContainer.contains(this) ? 1 : 0;
		if (changes) {
			const t = document.createElement('template');
			changes.forEach(c => {
				if (c.path.length > 1) {
					return;
				}
				if (c.type === 'insert') {
					t.innerHTML = this[PREPARED_TEMPLATE_KEY];
					targetContainer.insertBefore(t.content, targetContainer.children[c.path[0] + inParentAdjust]);
				} else if (c.type === 'delete') {
					targetContainer.removeChild(targetContainer.children[c.path[0] + inParentAdjust]);
				} else if (c.type === 'reverse') {
					for (var i = inParentAdjust + 1, l = targetContainer.children.length - inParentAdjust / 2; i < l; i++) {
						targetContainer.insertBefore(targetContainer.children[i], targetContainer.children[i - 1]);
					}
				} else {
					console.warn(`unsupported change type ${c.type}`);
				}
			});
		} else {
			const
				items = this.items,
				currentListLength = targetContainer.childElementCount - inParentAdjust,
				desiredListLength = items.length;
			let llc = currentListLength,
				lastElementChild;

			while (llc > desiredListLength) {
				lastElementChild = targetContainer.lastElementChild;
				if (lastElementChild !== this) {
					targetContainer.removeChild(lastElementChild);
				}
				llc--;
			}

			let appendContent = '';
			while (llc < desiredListLength) {
				appendContent += this[PREPARED_TEMPLATE_KEY];
				llc++;
			}
			if (appendContent) {
				const t = document.createElement('template');
				t.innerHTML = appendContent;
				targetContainer.appendChild(t.content);
			}

			for (let i = inParentAdjust, l = targetContainer.children.length; i < l; i++) {
				const c = targetContainer.children[i];
				const m = DataTier.ties.get(c);
				if (!m) {
					DataTier.ties.create(c, items[i - inParentAdjust]);
				} else if (m !== items[i - inParentAdjust]) {
					DataTier.ties.update(c, items[i - inParentAdjust]);
				}
			}
		}
	}

	resolveTargetContainer() {
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

	preprocessTemplate(template) {
		this[PREPARED_TEMPLATE_KEY] = template.outerHTML;
	}
}

if (!customElements.get('data-tier-list')) {
	customElements.define('data-tier-list', DataTierList);
}
