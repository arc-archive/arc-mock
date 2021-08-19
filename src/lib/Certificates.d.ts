import { ExportArcClientCertificateData } from '@advanced-rest-client/arc-types/src/dataexport/DataExport';
import { Certificate, CertificateIndex, ClientCertificate, RequestCertificate } from '@advanced-rest-client/arc-types/src/models/ClientCertificate';
import { Lorem, Random, Types } from '@pawel-up/data-mock';
import { ArcDataMockInit, CertificateCreateInit } from '../../types';

export declare class Certificates {
  lorem: Lorem;
  types: Types;
  random: Random;

  constructor(init?: ArcDataMockInit);

  /**
   * Creates a certificate definition.
   */
  certificate(opts?: CertificateCreateInit): Certificate;

  /**
   * Generates a Client Certificate index object.
   * @param opts Create options
   */
  certificateIndex(opts?: CertificateCreateInit): CertificateIndex;

  /**
   * @param opts Create options
   */
  requestCertificate(opts?: CertificateCreateInit): RequestCertificate;

  /**
   * Creates a ClientCertificate object that is used to create a new certificate.
   * @param opts Create options
   */
  clientCertificate(opts?: CertificateCreateInit): ClientCertificate;

  /**
   * Creates a list of ClientCertificate objects that are used to create a new certificates.
   * @param opts Create options
   */
  clientCertificates(size?: number, opts?: CertificateCreateInit): ClientCertificate[];

  /**
   * Creates a ClientCertificate transformed to the export object.
   */
  exportClientCertificate(opts?: CertificateCreateInit): ExportArcClientCertificateData;

  /**
   * Creates a list of ClientCertificates transformed for the export object.
   */
  exportClientCertificates(size?: number, opts?: CertificateCreateInit): ExportArcClientCertificateData[];

  /**
   * @param cert The certificate definition.
   */
  toStore(cert: Certificate|Certificate[]): Certificate|Certificate[];
}
