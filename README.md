# ArcMock

Generates data for ARC demo pages and tests scenarios.

[![Published on NPM](https://img.shields.io/npm/v/@advanced-rest-client/arc-data-generator.svg)](https://www.npmjs.com/package/@advanced-rest-client/arc-data-generator)

[![tests](https://github.com/advanced-rest-client/arc-data-generator/actions/workflows/deployment.yml/badge.svg)](https://github.com/advanced-rest-client/arc-data-generator/actions/workflows/deployment.yml)

**Note** API surface changed in version 4.x.

## Usage

### Installation

```sh
npm install --save @advanced-rest-client/arc-data-generator
```

### In a test scenario

```js
import { assert } from '@open-wc/testing';
import { ArcMock } from '@advanced-rest-client/arc-data-generator';

describe('Action', () => {
  before(async () => {
    const generator = new ArcMock();
    await generator.store.insertSavedIfNotExists();
  });

  it('has request data', () => {
    // ...
  });
});
```

### Using the `store` namespace

The `store` namespace (or the `Store` class) requires a reference to the PouchDB database. Because PouchDB has a legacy architecture, NodeJS and a browser imports the code differently. This means that your test scenario has to import PouchDB and set the reference to the PouchDB class in the init options.

```javascript
// in NodeJS
import PouchDB from 'pouchdb';
import { ArcMock } from '@advanced-rest-client/arc-data-generator';

const mock = new ArcMock({ store: PouchDB });
```

```javascript
// in a browser
import 'pouchdb/dist/pouchdb.js';
import { ArcMock } from '@advanced-rest-client/arc-data-generator';

/* global PouchDB */

const mock = new ArcMock({ store: PouchDB });
```

## Development

```sh
git clone https://github.com/advanced-rest-client/arc-data-generator
cd arc-data-generator
npm install
```

### Running the tests

```sh
npm test
```
