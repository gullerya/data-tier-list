[![NPM](https://img.shields.io/npm/v/data-tier-list.svg?label=npm%20data-tier-list)](https://www.npmjs.com/package/data-tier-list)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](./license.md)


[![Travis](https://img.shields.io/travis/gullerya/data-tier-list.svg)](https://travis-ci.org/gullerya/data-tier-list)
[![Codecov](https://img.shields.io/codecov/c/github/gullerya/data-tier-list/master.svg)](https://codecov.io/gh/gullerya/data-tier-list/branch/master)
[![Codacy](https://img.shields.io/codacy/grade/056de1a3a7c740678d517a0ee0b41b4f.svg?logo=codacy)](https://app.codacy.com/app/gullerya/data-tier-list)

# Summary

`data-tier-list` is a WebComponent, that provides repetative view functionality given any HTML template and a data set.

Main features and concepts:
* supported data set types: `Array`, `Object`
* if a provided data set is is not an [observable](https://github.com/gullerya/object-observer/blob/master/docs/observable.md), it is transformed (cloned) into such one
* data set mutations are observed and reflected
* template mutations are observed and reflected
* uniformity of a data items **is not** validated/enforced

`data-tier-list` relies on a [data-tier](https://github.com/gullerya/data-tier) library for the model-view tying part.

# APIs and conditions

* `data-tier-list` element self and it's light DOM **are not** displayed

* light DOM of the `data-tier-list` is taken as an **template** for a single item
	* template is observed for any changes; replacement of it or a change of its child/ren triggers a **full (re)render** of the list
	* template may have **at most** one top level element (any nested elements tree allowed)
	* template removal cleans the list
	* template error (eg more than one child) throws, list remains untouched

# Latest changelog

TBD
