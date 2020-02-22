import * as DataTier from './data-tier/data-tier.min.js';

const
	SEQUENCE_ID_KEY = Symbol('sequence.id'),
	PREPARED_TEMPLATE_KEY = Symbol('prepared.template');

let sequencer = 1;

class DataTierList extends HTMLElement {
	constructor() {
		super();
		const model = DataTier.ties.create(this, []);
		model.observe(() => this.fullUpdate());
		this[SEQUENCE_ID_KEY] = sequencer++;
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

		const model = DataTier.ties.get(this);
		model.splice(0, model.length, ...items);
		this.fullUpdate();
	}

	get items() {
		return DataTier.ties.get(this);
	}

	fullUpdate() {
		if (!this[PREPARED_TEMPLATE_KEY]) {
			return;
		}

		console.log('some');

		const
			targetContainer = this.resolveTargetContainer(),
			inParentAdjust = targetContainer.contains(this) ? 1 : 0,
			items = this.items,
			desiredListLength = items.length;
		let currentListLength = targetContainer.childElementCount - inParentAdjust,
			lastElementChild;

		while (currentListLength > desiredListLength) {
			lastElementChild = targetContainer.lastElementChild;
			if (lastElementChild !== this) {
				targetContainer.removeChild(lastElementChild);
			}
			currentListLength--;
		}

		let appendContent = '';
		while (currentListLength < desiredListLength) {
			appendContent += this[PREPARED_TEMPLATE_KEY];
			currentListLength++;
		}
		if (appendContent) {
			const t = document.createElement('template');
			t.innerHTML = appendContent;
			targetContainer.appendChild(t.content);
		}

		Array.from(targetContainer.children).forEach((c, i) => {
			if (inParentAdjust && i === 0) {
				return;
			}

			const m = DataTier.ties.get(c);
			if (m) {
				Object.assign(m, items[i - inParentAdjust]);
			} else {
				DataTier.ties.create(c, items[i - inParentAdjust]);
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
		template.setAttribute('data-tie-scope', '1');
		this[PREPARED_TEMPLATE_KEY] = template.outerHTML;
	}
}

if (!customElements.get('data-tier-list')) {
	customElements.define('data-tier-list', DataTierList);
}
