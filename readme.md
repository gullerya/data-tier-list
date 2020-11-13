[![NPM](https://img.shields.io/npm/v/data-tier-list.svg?label=npm%20data-tier-list)](https://www.npmjs.com/package/data-tier-list)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](./license.md)


[![Travis](https://img.shields.io/travis/gullerya/data-tier-list.svg)](https://travis-ci.org/gullerya/data-tier-list)
[![Codecov](https://img.shields.io/codecov/c/github/gullerya/data-tier-list/master.svg)](https://codecov.io/gh/gullerya/data-tier-list/branch/master)
[![Codacy](https://img.shields.io/codacy/grade/056de1a3a7c740678d517a0ee0b41b4f.svg?logo=codacy)](https://app.codacy.com/app/gullerya/data-tier-list)

# Overview

`data-tier-list` is a WebComponent, that provides repetative view functionality - given a UI template for a single item and a tied data set, it'll reflect that set in UI continuously, including any further changes to the data set.

`data-tier-list` supports the following data structures:
* `Array`
* `Object`

Uniformity of a data items **is not** validated/enforced, implying it being a consumer's concern.

`data-tier-list` based on a [data-tier](https://github.com/gullerya/data-tier) library for the model-view tying part.

# APIs and conditions

* `data-tier-list` element self and it's light DOM are **not** displayed

* light DOM of the `data-tier-list` is taken as an **item-template** for a single item
	* item-template is observed for any changes; replacement of it or a change of its child/ren triggers a **full (re)render** of the list
	* item-template may have **at most** one top level element (any nested elements tree allowed)
	* item-template removal cleans the list
	* item-template error (eg more than one child) throws, list remains untouched

# Latest changelog

TBD
