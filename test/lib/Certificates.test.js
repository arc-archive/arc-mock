import { assert } from '@open-wc/testing';
import sinon from 'sinon';
import { Certificates } from '../../index.js';

/** @typedef {import('@advanced-rest-client/arc-types').ClientCertificate.Certificate} Certificate */

describe('Certificates', () => {
  describe('toStore()', () => {
    /** @type Certificates */
    let certs;

    before(() => { certs = new Certificates(); });

    it('returns the same cert when data is string', () => {
      const cert = certs.certificate({
        binary: false,
      });
      const result = certs.toStore(cert);
      assert.deepEqual(result, cert);
    });

    it('transfers buffer data to string', () => {
      const cert = certs.certificate({
        binary: true,
      });
      const result = /** @type Certificate */ (certs.toStore(cert));
      assert.notDeepEqual(result, cert, 'returns altered object');
      assert.typeOf(result.data, 'string', 'cert data is a string');
      assert.equal(result.type, 'buffer', 'adds type property');
    });
  });

  describe('clientCertificate()', () => {
    /** @type Certificates */
    let certs;

    before(() => { certs = new Certificates(); });

    it('returns an object', () => {
      const result = certs.clientCertificate();
      assert.typeOf(result, 'object');
    });

    [
      ['type', 'String'],
      ['cert', 'object'],
      ['key', 'object'],
      ['name', 'string'],
      ['created', 'number'],
    ].forEach(([prop, type]) => {
      it(`has the ${prop} property of a type ${type}`, () => {
        const result = certs.clientCertificate();
        assert.typeOf(result[prop], type);
      });
    });

    it('uses passed type', () => {
      const result = certs.clientCertificate({
        type: 'p12'
      });
      assert.equal(result.type, 'p12');
    });

    it('creates binary data on a certificate', () => {
      const result = certs.clientCertificate({
        binary: true
      });
      // @ts-ignore
      assert.typeOf(result.cert.data, 'Uint8Array');
    });

    it('adds passphrase to a certificate by default', () => {
      const result = certs.clientCertificate({});
      // @ts-ignore
      assert.typeOf(result.cert.passphrase, 'string');
    });

    it('ignores passphrase on a certificate', () => {
      const result = certs.clientCertificate({
        noPassphrase: true
      });
      // @ts-ignore
      assert.isUndefined(result.cert.passphrase);
    });
  });

  describe('clientCertificates()', () => {
    /** @type Certificates */
    let certs;

    before(() => { certs = new Certificates(); });

    it('Returns an array', () => {
      const result = certs.clientCertificates();
      assert.typeOf(result, 'array');
    });

    it('List has default number of items', () => {
      const result = certs.clientCertificates();
      assert.lengthOf(result, 15);
    });

    it('Returns requested number of items', () => {
      const result = certs.clientCertificates(5);
      assert.lengthOf(result, 5);
    });

    it('Calls clientCertificate()', () => {
      const spy = sinon.spy(certs, 'clientCertificate');
      certs.clientCertificates(5);
      assert.equal(spy.callCount, 5);
    });
  });

  describe('exportClientCertificate()', () => {
    /** @type Certificates */
    let certs;

    before(() => { certs = new Certificates(); });

    it('returns an object', () => {
      const result = certs.exportClientCertificate();
      assert.typeOf(result, 'object');
    });

    it('calls clientCertificate()', () => {
      const spy = sinon.spy(certs, 'clientCertificate');
      certs.exportClientCertificate();
      assert.isTrue(spy.calledOnce);
    });

    it('adds kind property', () => {
      const result = certs.exportClientCertificate();
      assert.equal(result.kind, 'ARC#ClientCertificate');
    });

    it('adds key property', () => {
      const result = certs.exportClientCertificate();
      assert.typeOf(result.key, 'string');
    });

    it('moves old key to pKey property', () => {
      const result = certs.exportClientCertificate();
      assert.typeOf(result.pKey, 'object');
    });

    it('ignores pKey when nmo key data', () => {
      const result = certs.exportClientCertificate({
        noKey: true,
      });
      assert.isUndefined(result.pKey);
    });
  });

  describe('exportClientCertificates()', () => {
    /** @type Certificates */
    let certs;

    before(() => { certs = new Certificates(); });

    it('returns an array', () => {
      const result = certs.exportClientCertificates();
      assert.typeOf(result, 'array');
    });

    it('has the default number of items', () => {
      const result = certs.exportClientCertificates();
      assert.lengthOf(result, 15);
    });

    it('returns requested number of items', () => {
      const result = certs.exportClientCertificates(5);
      assert.lengthOf(result, 5);
    });

    it('calls exportClientCertificate()', () => {
      const spy = sinon.spy(certs, 'exportClientCertificate');
      certs.exportClientCertificates(5);
      assert.equal(spy.callCount, 5);
    });
  });
});
