[![NPM](https://img.shields.io/npm/v/data-tier-list.svg?label=npm%20data-tier-list)](https://www.npmjs.com/package/data-tier-list)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](./license.md)


![Quality pipeline](https://github.com/gullerya/data-tier-list/workflows/Quality%20pipeline/badge.svg)
[![Codecov](https://img.shields.io/codecov/c/github/gullerya/data-tier-list/master.svg)](https://codecov.io/gh/gullerya/data-tier-list/branch/master)
[![Codacy](https://img.shields.io/codacy/grade/056de1a3a7c740678d517a0ee0b41b4f.svg?logo=codacy)](https://app.codacy.com/app/gullerya/data-tier-list)

# `data-tier-list`

`data-tier-list` is a WebComponent, that provides repetative view functionality given any HTML template and a data set.

Main features and concepts:
- supported data set types: `Array`, `Object`
- if a provided data set is is not an [observable](https://github.com/gullerya/object-observer/blob/master/docs/observable.md), it is transformed (cloned) into such one
- data set mutations are observed and reflected
- template mutations are observed and reflected
- uniformity of a data items __is not__ validated/enforced

`data-tier-list` relies on a [data-tier](https://github.com/gullerya/data-tier) library for the model-view tying part.

`data-tier-list`'s HTML binding declaration API adheres to the `data-tier`'s one [here](https://github.com/gullerya/data-tier/blob/main/docs/api-tying-declaration.md). See specific details below, in [API section](#api).

#### Changelog is [here](docs/changelog.md).

## Preview

For a preview/playground you are welcome to:
TBD

## Install

Use regular `npm install data-tier-list --save-prod` to use the library from your local environment:
```js
import 'node_modules/data-tier-list/dist/data-tier-list.min.js';
```

Alternatively, a __CDN__ deployment available (AWS driven), so one can import it directly:
```js
import 'https://libs.gullerya.com/data-tier-list/x.y.z/data-tier-list.min.js';
```

> Note: replace the `x.y.z` by the desired version, one of the listed in the [changelog](docs/changelog.md).

CDN features:
- HTTPS only, no untrusted man-in-the-middle
- highly available (with many geo spread edges)
- agressive caching setup

## API

`data-tier-list`'s HTML binding declaration API adheres to the `data-tier`'s one [here](https://github.com/gullerya/data-tier/blob/main/docs/api-tying-declaration.md).

### Data
The dataset of items is set/updated via the `items` property of the `data-tier-list` element, for example:
```js
<data tier list>.items = [ 1, 2, 3 ];
```

`items` elements can be anything from primitive values to complex object structures.
Each item will be shown according to the __item template__.

### View

Light DOM of the `data-tier-list` serves as a __template__ for a single item.

`data-tier-list` element self and its light DOM __are not__ displayed.

Details:
- within a template use binding declaration syntax is as [here](https://github.com/gullerya/data-tier/blob/main/docs/api-tying-declaration.md), with `item` as scope key (see examples below)
- template is observed for any changes; replacement of it or a change of its child/ren triggers a __full (re)render__ of the list
- template may have __at most__ one top level element (any nested elements tree allowed)
- template removal cleans the list
- template errors (eg more than one child) leave list untouched

### Examples

#### List of bands

```html
<data-tier-list>
	<div>
		<span data-tie="item:title"></span>
		<span data-tie="item:fromYear"></span>
		<span data-tie="item:albumsTotal"></span>
	</div>
</data-tier-list>
```

And then supply data:
```js
const dtl = document.querySelector('data-tier-list');
dtl.items = [
	{ title: '..', fromYear: 1991, albumsTotal: 3 },
	{ title: '..', fromYear: 1992, albumsTotal: 5 },
	{ title: '..', fromYear: 1993, albumsTotal: 7 }
]
```