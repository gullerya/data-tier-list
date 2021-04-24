[![NPM](https://img.shields.io/npm/v/data-tier-list.svg?label=npm%20data-tier-list)](https://www.npmjs.com/package/data-tier-list)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](./license.md)


![Quality pipeline](https://github.com/gullerya/data-tier-list/workflows/Quality%20pipeline/badge.svg)
[![Codecov](https://img.shields.io/codecov/c/github/gullerya/data-tier-list/master.svg)](https://codecov.io/gh/gullerya/data-tier-list/branch/master)
[![Codacy](https://img.shields.io/codacy/grade/056de1a3a7c740678d517a0ee0b41b4f.svg?logo=codacy)](https://app.codacy.com/app/gullerya/data-tier-list)

# `data-tier-list`

`data-tier-list` is a WebComponent, that provides repetative view functionality given any HTML template and a data set.

Main features and concepts:
* supported data set types: `Array`, `Object`
* if a provided data set is is not an [observable](https://github.com/gullerya/object-observer/blob/master/docs/observable.md), it is transformed (cloned) into such one
* data set mutations are observed and reflected
* template mutations are observed and reflected
* uniformity of a data items **is not** validated/enforced

`data-tier-list` relies on a [data-tier](https://github.com/gullerya/data-tier) library for the model-view tying part.

#### Changelog is [here](docs/changelog.md)

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

# APIs and conditions

- `data-tier-list` element self and it's light DOM __are not__ displayed
- light DOM of the `data-tier-list` is taken as a __template__ for a single item
	- template is observed for any changes; replacement of it or a change of its child/ren triggers a __full (re)render__ of the list
	- template may have __at most__ one top level element (any nested elements tree allowed)
	- template removal cleans the list
	- template error (eg more than one child) throws, list remains untouched
