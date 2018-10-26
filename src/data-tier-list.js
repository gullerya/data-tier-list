const
	ITEMS_KEY = Symbol('data.tier.items.key');

class DataTierItemTemplate extends HTMLTemplateElement {
	constructor() {
		super();
		this[ITEMS_KEY] = [];
	}

	get items() {
		return this[ITEMS_KEY];
	}

	set items(newItemsList) {
		if (!Array.isArray(newItemsList)) {
			throw new Error('valid array expected but got ' + newItemsList)
		}

		this[ITEMS_KEY] = newItemsList;

		let container = this.parentNode, ruleData,
			fceDataSet,
			templateItemAid,
			desiredListLength = newItemsList.length;

		fceDataSet = this.content.firstElementChild.dataset;
		templateItemAid = fceDataSet.dtListItemAid;
		if (!templateItemAid) {
			templateItemAid = new Date().getTime();
			fceDataSet.dtListItemAid = templateItemAid;
		}

		//	adjust list elements size to the data length
		let existingList = container.querySelectorAll('[data-dt-list-item-aid="' + templateItemAid + '"]'),
			existingListLength = existingList.length;

		if (existingListLength > desiredListLength) {
			while (existingListLength > desiredListLength) container.removeChild(existingList[--existingListLength]);
		}

		//	run update on the whole list (in future attempt to get the change's content and optimize this one)
		DataTierItemTemplate.updateExistingContent(this, container, existingListLength);

		if (existingListLength < desiredListLength) {
			ruleData = DataTierItemTemplate.extractControllerParameters(this.dataset.tie);
			DataTierItemTemplate.insertNewContent(container, this, ruleData, existingListLength, desiredListLength);
		}
	}

	static extractControllerParameters(paramValue) {
		let procParam;
		if (paramValue) {
			procParam = paramValue.trim().split(/\s+=>\s+/);
			if (!procParam || procParam.length !== 2) {
				throw new Error('invalid DataTier configuration');
			}
		}
		return procParam;
	}

	static insertNewContent(container, template, controllerParameters, from, to) {
		let result = null, optimizationMap, tmpContent, tmpTemplate, index = from, i, i1, tmp,
			prefix = controllerParameters[0] + '.', optTmpIdx,
			views, view;
		tmpContent = template.content;
		optimizationMap = DataTierItemTemplate.prepareOptimizationMap(template, 'item:', prefix);
		optTmpIdx = optimizationMap.index;

		for (; index < to; index++) {
			tmpTemplate = tmpContent.cloneNode(true);
			views = tmpTemplate.querySelectorAll('*');
			i = optTmpIdx.length;
			while (i--) {
				tmp = optTmpIdx[i];
				view = views[tmp];
				view.dataset.tie = view.dataset.tie.replace(/item:/g, prefix + index + '.');
			}
			index === from ? result = tmpTemplate : result.appendChild(tmpTemplate);
		}

		container.appendChild(result);
	}

	static updateExistingContent(template, container, required) {
		let allBluePrintElements = template.content.querySelectorAll('*'),
			tieProcsMap = [], i;
		i = allBluePrintElements.length;
		while (i--) {
			tieProcsMap[i] = Object.keys(allBluePrintElements[i].dataset).filter(key => key === 'tie');
		}

		let done = 0, i1, i2, child,
			descendants, descendant,
			keys;
		i = 0;
		while (done < required) {
			child = container.childNodes[i++];
			if (child !== template && (child.nodeType === Node.DOCUMENT_NODE || child.nodeType === Node.ELEMENT_NODE) && child.dataset.dtListItemAid) {
				descendants = child.querySelectorAll('*');
				i1 = tieProcsMap.length;
				while (i1--) {
					descendant = i1 ? descendants[i1 - 1] : child;
					keys = tieProcsMap[i1];
					i2 = keys.length;
					// while (i2--) {
					// 	viewsService.updateView(descendant, keys[i2]);
					// }
				}
				done++;
			}
		}
	}

	//	extract and index all the data-tied elements from the template so that on each clone the pre-processing will be based on this index
	//	we just need to know which elements (index of array-like, outcome of 'querySelectorAll(*)') are relevant
	static prepareOptimizationMap(template) {
		let result = {index: []},
			views = template.content.querySelectorAll('*'),
			i = views.length, view;
		while (i--) {
			view = views[i];
			if (view.dataset && typeof view.dataset.tie === 'string') {
				result.index.push(i);
			}
		}
		return result;
	}
}

customElements.define('data-tier-item-template', DataTierItemTemplate, {extends: 'template'});
