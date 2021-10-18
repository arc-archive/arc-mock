import { Lorem, Random, Types, Utils } from '@pawel-up/data-mock';

/** @typedef {import('../../types').ArcDataMockInit} ArcDataMockInit */
/** @typedef {import('@advanced-rest-client/events').ClientCertificate.Certificate} Certificate */
/** @typedef {import('@advanced-rest-client/events').ClientCertificate.CertificateIndex} CertificateIndex */
/** @typedef {import('@advanced-rest-client/events').ClientCertificate.RequestCertificate} RequestCertificate */
/** @typedef {import('@advanced-rest-client/events').ClientCertificate.ClientCertificate} ClientCertificate */
/** @typedef {import('@advanced-rest-client/events').ClientCertificate.ARCRequestCertificate} ARCRequestCertificate */
/** @typedef {import('@advanced-rest-client/events').ClientCertificate.ARCCertificateIndex} ARCCertificateIndex */
/** @typedef {import('@advanced-rest-client/events').DataExport.ExportArcClientCertificateData} ExportArcClientCertificateData */
/** @typedef {import('../../types').CertificateCreateInit} CertificateCreateInit */

export class Certificates {
  /**
   * @param {ArcDataMockInit=} init 
   */
  constructor(init={}) {
    this.lorem = new Lorem(init);
    this.types = new Types(init.seed);
    this.random = new Random(init.seed);
  }

  /**
   * Creates a certificate definition.
   * 
   * @param {CertificateCreateInit=} opts
   * @returns {Certificate}
   */
  certificate(opts = {}) {
    const data = this.lorem.paragraph();
    const result = /** @type Certificate */ ({
      data,
    });
    if (opts.binary) {
      result.data = Utils.strToBuffer(data);
    }
    if (!opts.noPassphrase) {
      result.passphrase = this.lorem.word();
    }
    return result;
  }

  /**
   * Generates a Client Certificate index object.
   * @param {CertificateCreateInit=} opts Create options
   * @returns {CertificateIndex}
   */
  certificateIndex(opts = {}) {
    const type = opts.type ? opts.type : this.random.pickOne(['p12', 'pem']);
    const result = /** @type CertificateIndex */ ({
      type,
      name: this.lorem.word(),
    });
    if (!opts.noCreated) {
      result.created = this.types.datetime().getTime();
    }
    return result;
  }

  /**
   * @param {CertificateCreateInit=} opts Create options
   * @returns {RequestCertificate}
   */
  requestCertificate(opts = {}) {
    const type = opts.type ? opts.type : this.random.pickOne(['p12', 'pem']);
    const cert = this.certificate(opts);
    const name = this.lorem.word();
    const result = /** @type RequestCertificate */ ({
      type,
      name,
      cert,
    });
    if (!opts.noKey) {
      result.key = this.certificate(opts);
    }
    return result;
  }

  /**
   * Creates a ClientCertificate object that is used to create a new certificate.
   * @param {CertificateCreateInit=} opts Create options
   * @return {ClientCertificate}
   */
  clientCertificate(opts = {}) {
    const index = this.certificateIndex(opts);
    const data = this.requestCertificate(opts);
    const result = /** @type ClientCertificate */ ({
      ...index,
      cert: data.cert,
    });
    if (data.key) {
      result.key = data.key;
    }
    return result;
  }

  /**
   * Creates a list of ClientCertificate objects that are used to create a new certificates.
   * 
   * @param {number=} size The number of certificates to generate.
   * @param {CertificateCreateInit=} opts Create options
   * @return {ClientCertificate[]}
   */
  clientCertificates(size = 15, opts = {}) {
    const result = [];
    for (let i = 0; i < size; i++) {
      result[result.length] = this.clientCertificate(opts);
    }
    return result;
  }

  /**
   * Creates a ClientCertificate transformed to the export object.
   *
   * @param {CertificateCreateInit=} opts
   * @return {ExportArcClientCertificateData}
   */
  exportClientCertificate(opts = {}) {
    const item = /** @type any */ (this.clientCertificate(opts));
    if (item.key) {
      item.pKey = item.key;
    }
    item.key = this.types.uuid();
    item.kind = 'ARC#ClientCertificate';
    return item;
  }

  /**
   * Creates a list of ClientCertificates transformed for the export object.
   *
   * @param {CertificateCreateInit=} opts
   * @return {ExportArcClientCertificateData[]}
   */
  exportClientCertificates(size = 15, opts = {}) {
    const result = [];
    for (let i = 0; i < size; i++) {
      result[result.length] = this.exportClientCertificate(opts);
    }
    return result;
  }

  /**
   * @param {Certificate|Certificate[]} cert Certificate definition. See class description.
   * @return {Certificate|Certificate[]}
   */
  toStore(cert) {
    if (Array.isArray(cert)) {
      return /** @type Certificate[] */ (cert.map(info => this.toStore(info)));
    }
    if (typeof cert.data === 'string') {
      return cert;
    }
    const data = Utils.bufferToBase64(cert.data);
    const copy = { ...cert, type: 'buffer', data };
    return copy;
  }
}
