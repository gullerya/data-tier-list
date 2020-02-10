const
	OPTIMIZATION_MAP_KEY = Symbol('optimization.map.key');

class DataTierItemTemplate extends HTMLTemplateElement {
	get defaultTieTarget() {
		return 'items';
	}

	set items(newItemsList) {
		if (!Array.isArray(newItemsList)) {
			return;
		}

		const
			container = this.parentNode,
			fceDataSet = this.content.firstElementChild.dataset,
			desiredListLength = newItemsList.length;

		let
			ruleData,
			templateItemAid;

		templateItemAid = fceDataSet.dtListItemAid;
		if (!templateItemAid) {
			templateItemAid = new Date().getTime();
			fceDataSet.dtListItemAid = templateItemAid;
		}

		//	adjust list elements size to the data length
		const existingList = container.querySelectorAll('[data-dt-list-item-aid="' + templateItemAid + '"]');
		let existingListLength = existingList.length;

		//	remove extra items, if any
		if (existingListLength > desiredListLength) {
			while (existingListLength > desiredListLength) container.removeChild(existingList[--existingListLength]);
		}

		//	add missing items, if any
		if (existingListLength < desiredListLength) {
			ruleData = DataTierItemTemplate.extractControllerParameters(this.dataset.tie);
			DataTierItemTemplate.insertNewContent(container, this, ruleData, existingListLength, desiredListLength);
		}
	}

	static extractControllerParameters(paramValue) {
		let procParam;
		if (paramValue) {
			procParam = paramValue.trim().split(/\s+=>\s+/);
			if (!procParam || !procParam.length) {
				throw new Error('invalid DataTier configuration');
			}
		}
		return procParam;
	}

	static insertNewContent(container, template, controllerParameters, from, to) {
		const
			prefix = controllerParameters[0] + (controllerParameters[0].indexOf(':') < 0 ? ':' : '.'),
			optimizationMap = DataTierItemTemplate.getOptimizationMap(template),
			optTmpIdx = optimizationMap.index,
			tmpContent = template.content;

		let result = null, tmpTemplate, index = from, i, tmp, views, view;

		for (; index < to; index++) {
			tmpTemplate = tmpContent.cloneNode(true);
			views = tmpTemplate.querySelectorAll('*');
			i = optTmpIdx.length;
			while (i--) {
				tmp = optTmpIdx[i];
				view = views[tmp];
				view.dataset.tie = view.dataset.tie
					.replace(/item:/g, prefix + index + '.')
					.replace(/item\s*=/g, prefix + index + '=')
					.replace(/item(?![.a-zA-Z0-9])/g, prefix + index);
			}
			if (index === from) {
				result = tmpTemplate;
			} else {
				result.appendChild(tmpTemplate);
			}
		}

		container.appendChild(result);
	}

	//	extract and index all the data-tied elements from the template so that on each clone the pre-processing will be based on this index
	//	we just need to know which elements (index of array-like, outcome of 'querySelectorAll(*)') are relevant
	static getOptimizationMap(template) {
		let result = template[OPTIMIZATION_MAP_KEY];
		if (!result) {
			result = { index: [] };
			const views = template.content.querySelectorAll('*');
			let i = views.length, view;
			while (i) {
				i--;
				view = views[i];
				if (view.dataset && typeof view.dataset.tie === 'string') {
					result.index.push(i);
				}
			}
			template[OPTIMIZATION_MAP_KEY] = result;
		}
		return result;
	}
}

if (!customElements.get('data-tier-list')) {
	customElements.define('data-tier-list', DataTierItemTemplate, { extends: 'template' });
}
