import * as DataTier from './data-tier/data-tier.min.js';

const
	SEQUENCE_ID_KEY = Symbol('sequence.id'),
	BOUND_UPDATER_KEY = Symbol('bound.updater'),
	ITEMS_KEY = Symbol('items.key'),
	PREPARED_TEMPLATE_KEY = Symbol('prepared.template');

let sequencer = 1;

class DataTierList extends HTMLElement {
	constructor() {
		super();
		this[SEQUENCE_ID_KEY] = sequencer++;
		this[BOUND_UPDATER_KEY] = this.fullUpdate.bind(this);
		this.attachShadow({ mode: 'open' }).innerHTML = '<slot></slot>';
		this.shadowRoot.firstElementChild.addEventListener('slotchange', event => {
			const templateNodes = event.target.assignedNodes().filter(n => n.nodeType === Node.ELEMENT_NODE);
			if (templateNodes.length !== 1) {
				console.error(`list item template MUST have onle 1 root element, got ${templateNodes.length}`);
				return;
			}
			this.preprocessTemplate(templateNodes[0]);
			this.fullUpdate();
		});
	}

	connectedCallback() {
		this.style.display = 'none';
		this.setAttribute('data-tier-blackbox', '1');
	}

	get defaultTieTarget() {
		return 'items';
	}

	set items(items) {
		if (!Array.isArray(items)) {
			console.error(`array of items expected, but got '${items}'`);
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

	fullUpdate() {
		if (!this[PREPARED_TEMPLATE_KEY]) {
			return;
		}

		const
			targetContainer = this.resolveTargetContainer(),
			inParentAdjust = targetContainer.contains(this) ? 1 : 0,
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

		Array.from(targetContainer.children).forEach((c, i) => {
			if (i - inParentAdjust < currentListLength) {
				return;
			}

			const m = DataTier.ties.get(c);
			if (!m) {
				DataTier.ties.create(c, items[i - inParentAdjust]);
			} else if (m !== items[i - inParentAdjust]) {
				DataTier.ties.update(c, items[i - inParentAdjust]);
			}
		});
	}

	resolveTargetContainer() {
		let result = this.parentElement;
		const attr = this.getAttribute('data-list-target');
		if (attr) {
			result = this.getRootNode().querySelector(attr);
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
