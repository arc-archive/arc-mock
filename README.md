# arc-data-generator

Generates data for ARC demo pages and tests


### API components

This components is a part of [API components ecosystem](https://elements.advancedrestclient.com/)

## Usage

### Installation
```
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

### Development

```sh
git clone https://github.com/advanced-rest-client/arc-data-generator
cd arc-data-generator
npm install
```

### Running the tests
```sh
npm test
```
