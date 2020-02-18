import * as DataTier from './data-tier/data-tier.min.js';

const
	LISTS_MODEL_TIE_NAME = 'listModel',
	SEQUENCE_ID_KEY = Symbol('sequence.id'),
	INDEX_PLACEHOLDER = 'dtl_index_placeholder',
	PREPARED_TEMPLATE_KEY = Symbol('prepared.template');

let sequencer = 1;

class DataTierList extends HTMLElement {
	constructor() {
		super();
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
		const t = DataTier.ties.create(LISTS_MODEL_TIE_NAME + this[SEQUENCE_ID_KEY], []);
		t.observe(changes => this.processModelChanges(changes));
	}

	disconnectedCallback() {
		DataTier.ties.remove(LISTS_MODEL_TIE_NAME + this[SEQUENCE_ID_KEY]);
	}

	get defaultTieTarget() {
		return 'items';
	}

	set items(items) {
		if (!Array.isArray(items)) {
			console.error(`array of items expected, but got '${items}'`);
			return;
		}

		const m = DataTier.ties.get(LISTS_MODEL_TIE_NAME + this[SEQUENCE_ID_KEY]);
		m.splice(0, m.length, ...items);
	}

	get items() {
		return DataTier.ties.get(LISTS_MODEL_TIE_NAME + this[SEQUENCE_ID_KEY]);
	}

	fullUpdate() {
		if (!this[PREPARED_TEMPLATE_KEY]) {
			return;
		}

		const
			targetContainer = this.resolveTargetContainer(),
			inParentAdjust = targetContainer.contains(this) ? 1 : 0,
			desiredListLength = DataTier.ties.get(LISTS_MODEL_TIE_NAME + this[SEQUENCE_ID_KEY]).length;
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
		const replaceAll = new RegExp(INDEX_PLACEHOLDER, 'g');
		while (currentListLength < desiredListLength) {
			appendContent += this[PREPARED_TEMPLATE_KEY].replace(replaceAll, currentListLength);
			currentListLength++;
		}
		if (appendContent) {
			const t = document.createElement('template');
			t.innerHTML = appendContent;
			targetContainer.appendChild(t.content);
		}
	}

	processModelChanges(changes) {
		if (changes.some(c => c.type === 'shuffle')) {
			this.fullUpdate();
		} else {
			const newItemTmp = document.createElement('template');
			const replaceAll = new RegExp(INDEX_PLACEHOLDER, 'g');
			changes.forEach(change => {
				if (change.type === 'insert') {
					let tmp = this[PREPARED_TEMPLATE_KEY].replace(replaceAll, currentListLength);
				} else if (change.type === 'delete') {

				}
			});
		}
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
		const replacer = `${LISTS_MODEL_TIE_NAME}${this[SEQUENCE_ID_KEY]}:${INDEX_PLACEHOLDER}`;
		const detached = template.cloneNode(true);
		const els = [detached];
		if (detached.childElementCount) {
			Array.prototype.push.apply(els, detached.querySelectorAll('*'));
		}
		let i = els.length, next, attr;
		while (i) {
			next = els[--i];
			attr = next.getAttribute('data-tie');
			if (attr) {
				next.setAttribute('data-tie', attr
					.replace(/item:/g, `${replacer}.`)
					.replace(/item\s*=/g, `${replacer}=`)
					.replace(/item(?![.a-zA-Z0-9])/g, `${replacer}`)
				);
			}
		}
		this[PREPARED_TEMPLATE_KEY] = detached.outerHTML;
	}
}

if (!customElements.get('data-tier-list')) {
	customElements.define('data-tier-list', DataTierList);
}
