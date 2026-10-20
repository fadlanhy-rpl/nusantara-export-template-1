import { LocaleCode } from '@/types/export-config';
import en from '../../messages/en.json';
import ar from '../../messages/ar.json';
import zh from '../../messages/zh.json';
import id from '../../messages/id.json';

const dictionaries = {
  en,
  ar,
  zh,
  id,
};

export type Messages = typeof en;

export function getDictionary(locale: LocaleCode): Messages {
  return dictionaries[locale] || dictionaries.en;
}
