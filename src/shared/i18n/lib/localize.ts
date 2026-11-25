import { useLocale } from '../model/locale-store';
import type { Locale, Localized } from '../config';

/** Picks the current locale's variant of a `Localized` content object. */
export function useLocalized<T>(content: Localized<T>): T {
  return content[useLocale()];
}

type PluralForms = { one: string; few?: string; many?: string; other: string };

const pluralRules = new Map<Locale, Intl.PluralRules>();

/**
 * Locale-aware plural form: plural('ru', 4, { one: 'проект', few: 'проекта', many: 'проектов', other: 'проекта' }).
 */
export function plural(locale: Locale, count: number, forms: PluralForms) {
  let rules = pluralRules.get(locale);
  if (!rules) {
    rules = new Intl.PluralRules(locale);
    pluralRules.set(locale, rules);
  }
  const category = rules.select(count) as keyof PluralForms;
  return forms[category] ?? forms.other;
}
