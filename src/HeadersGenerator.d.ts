declare interface HeaderSchemaItem {
  group: string;
  request: boolean;
  response: boolean;
  generate: (type?: string) => string;
}

declare interface HeadersSchema {
  date: HeaderSchemaItem;
  'cache-control': HeaderSchemaItem;
  connection: HeaderSchemaItem;
  age: HeaderSchemaItem;
  expires: HeaderSchemaItem;
  pragma: HeaderSchemaItem;
  'last-modified': HeaderSchemaItem;
  etag: HeaderSchemaItem;
  'if-match': HeaderSchemaItem;
  'if-none-match': HeaderSchemaItem;
  'if-modified-since': HeaderSchemaItem;
  accept: HeaderSchemaItem;
  'accept-charset': HeaderSchemaItem;
  'accept-encoding': HeaderSchemaItem;
  cookie: HeaderSchemaItem;
  'set-cookie': HeaderSchemaItem;
  'access-control-allow-origin': HeaderSchemaItem;
  origin: HeaderSchemaItem;
  'content-length': HeaderSchemaItem;
  'content-type': HeaderSchemaItem;
  'content-encoding': HeaderSchemaItem;
  'transfer-encoding': HeaderSchemaItem;
  link: HeaderSchemaItem;
}

export declare const HeadersSchema: HeadersSchema;

export declare class HeadersGenerator {
  static generateContentType(): string;

  /**
   * Generates a list of request or response headers
   * @param type Either `request` or `response`
   * @param ct A content type to add.
   */
  static generateHeaders(type: string, ct?: string): string;
  /**
   * @returns A value for the `location` header
   */
  static generateLink(): string;
}