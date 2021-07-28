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
