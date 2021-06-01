# arc-data-generator

Generates data for ARC demo pages and tests

[![Published on NPM](https://img.shields.io/npm/v/@advanced-rest-client/arc-data-generator.svg)](https://www.npmjs.com/package/@advanced-rest-client/arc-data-generator)

[![tests](https://github.com/advanced-rest-client/arc-data-generator/actions/workflows/deployment.yml/badge.svg)](https://github.com/advanced-rest-client/arc-data-generator/actions/workflows/deployment.yml)

## Usage

### Installation

```sh
npm install --save @advanced-rest-client/arc-data-generator
```

### In a test scenario

```js
import { assert } from '@open-wc/testing';
import { DataGenerator } from '@advanced-rest-client/arc-data-generator/arc-data-generator.js';

describe('Action', () => {
  before(async () => {
    await DataGenerator.insertSavedIfNotExists();
  });

  it('Has request data', () => {
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
