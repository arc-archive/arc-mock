# ArcMock

Generates data for ARC demo pages and tests scenarios.

[![Published on NPM](https://img.shields.io/npm/v/@advanced-rest-client/arc-mock.svg)](https://www.npmjs.com/package/@advanced-rest-client/arc-mock)

[![tests](https://github.com/advanced-rest-client/arc-mock/actions/workflows/deployment.yml/badge.svg)](https://github.com/advanced-rest-client/arc-mock/actions/workflows/deployment.yml)

**Note** API surface changed in version 4.x.

## Usage

### Installation

```sh
npm install --save @advanced-rest-client/arc-mock
```

### In a test scenario

```js
import { assert } from '@open-wc/testing';
import { ArcMock } from '@advanced-rest-client/arc-mock';

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
git clone https://github.com/advanced-rest-client/arc-mock
cd arc-mock
npm install
```

### Running the tests

```sh
npm test
```
