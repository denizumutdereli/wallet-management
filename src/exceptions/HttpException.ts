import i18n from '@/i18n';

export interface ErrorInterface {
  error?: Error | string;
  status: number;
  internalCode: number;
  detail: Error | string;
  debug: any;
  getStatus(): number;
  serialize(): any;
}

export class ErrorHandler extends Error {
  public error?: Error | string;
  public status: number;
  public internalCode = -1;
  public detail = '';
  public debug: Error | string[] | string;
  public message: string;
  private _captureInSentry = false;

  constructor(error?: Error | string, status?: number, internalCode = -1, detail = '', debug = '', message?: string) {
    super(message);
    this.message = message;
    this.error = error;
    this.status = status;
    this.internalCode = internalCode;
    this.detail = detail;
    this.debug = debug ? debug.toString().split('\n') : null;
  }

  captureInSentry(): ErrorHandler {
    this._captureInSentry = true;
    return this;
  }

  getStatus() {
    return this.status;
  }

  serialize() {
    if (this._captureInSentry) {
      // send to sentry
    }
    return {
      status: false,
      error: this.error,
      internalCode: this.internalCode,
      detail: this.detail,
      debug: this.debug,
    };
  }
}

// add capture for all necessary errors
export const errs = {
  INTERNAL_SERVER: (detail: Error): ErrorInterface => {
    return new ErrorHandler(i18n.t('ERROR').INTERNALSERVER, 500, 1500, detail.message, detail.stack).captureInSentry();
  },

  UNAUTHORIZED: (message: any = `${i18n.t('ERROR').AUTHFAILED}`, detail?: string): ErrorInterface => {
    return new ErrorHandler(message, 401, 1401, detail).captureInSentry();
  },

  BAD_REQUEST: (message = `${i18n.t('ERROR').BADREQUEST}`, detail?: any): ErrorInterface => {
    return new ErrorHandler(message, 400, 1400, detail);
  },

  FORBIDDEN: (message = `${i18n.t('ERROR').NOTALLOWED}`, detail?: any): ErrorInterface => {
    return new ErrorHandler(message, 403, 1403, detail);
  },

  VALIDATION: (message = `${i18n.t('ERROR').VALIDATION}`, detail?: string): ErrorInterface => {
    return new ErrorHandler(message, 422, 1422, detail);
  },

  NOT_FOUND: (message = `${i18n.t('ERROR').NOTFOUND}`, detail?: string): ErrorInterface => {
    return new ErrorHandler(message, 404, 1404, detail);
  },

  HEADER_REQUIRED: (headerName: string, detail?: string): ErrorInterface => {
    return new ErrorHandler(`${i18n.t('HEADERREQUIRED', { name: headerName })}`, 400, 4100, detail);
  },

  REQ_OLD: (detail?: string): ErrorInterface => {
    return new ErrorHandler(`${i18n.t('REQOLD')}`, 400, 4004, detail);
  },

  TOOMANYCONNECTION: (detail?: string): ErrorInterface => {
    return new ErrorHandler(`${i18n.t('TOOMANYCONNECTION')}`, 429, 4429, detail);
  },
};
