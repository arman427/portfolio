import { dictionaries } from './dictionary';
import { useLocalized } from './lib/localize';

export {
  defaultLocale,
  isLocale,
  locales,
  LOCALE_PENDING_CLASS,
  LOCALE_STORAGE_KEY,
  type Locale,
  type Localized,
} from './config';
export { useLocale, useLocaleStore } from './model/locale-store';
export { plural, useLocalized } from './lib/localize';
export { dictionaries, type Dictionary } from './dictionary';

/** Shared interface copy for the active locale. */
export const useDictionary = () => useLocalized(dictionaries);
