import { default as i18n } from 'i18next';
import i18nextMiddleware from 'i18next-http-middleware';
import Backend from 'i18next-fs-backend';
import { DEFAULT_LANGUAGE, AVAILABLE_LANGUAGES } from '@/config';

const I18n = i18n.createInstance();

const customDetector = {
  name: 'customDetector',
  lookup: req => {
    const lang = (req.params.lang || req.query.lang || req.body.lang) ?? process.env.DEFAULT_LANGUAGE;
    if (lang !== DEFAULT_LANGUAGE) return lang;
  },
};

const languageDetector = new i18nextMiddleware.LanguageDetector();
languageDetector.addDetector(customDetector);

const i18nextOptions = {
  supportedLngs: AVAILABLE_LANGUAGES.split(','),
  preload: [DEFAULT_LANGUAGE],
  fallbackLng: DEFAULT_LANGUAGE,
  saveMissing: false,
  debug: false,
  detection: {
    order: ['customDetector', 'path', 'querystring', 'header' /*'session','cookie'*/],
    lookupQuerystring: 'lang',
    //lookupCookie: 'i18next',
    lookupHeader: 'Accept-Language',
    lookupHeaderRegex: /(([a-z]{2})-?([A-Z]{2})?)\s*;?\s*(q=([0-9.]+))?/gi,
    //lookupSession: 'lng',
    lookupPath: 'lang',
    lookupFromPathIndex: 0,
    //caches: false, // ['cookie']
    ignoreCase: true, // ignore case of detected language
    // cookieExpirationDate: new Date(),
    // cookieDomain: 'myDomain',
    // cookiePath: '/my/path',
    // cookieSecure: true, // if need secure cookie
    // cookieSameSite: 'strict', // 'strict', 'lax' or 'none'
  },
  backend: {
    // eslint-disable-next-line no-path-concat
    loadPath: __dirname + '/locales/{{lng}}/{{ns}}.json',
    // eslint-disable-next-line no-path-concat
    addPath: __dirname + '/locales/{{lng}}/{{ns}}.missing.json',
  },
};

I18n.use(Backend).use(languageDetector).init(i18nextOptions);

const t = (key: string, args?: {}): any => {
  return I18n.t(key, args);
};

export default { I18n, t };
