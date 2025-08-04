import { tr } from './tr';

export type TranslationKey = keyof typeof tr;

class LocalizationService {
  private currentLanguage = 'tr';
  private translations = { tr };

  t(key: string): string {
    const keys = key.split('.');
    let value: any = this.translations[this.currentLanguage as keyof typeof this.translations];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  }

  getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  setLanguage(language: string): void {
    this.currentLanguage = language;
  }
}

export const localization = new LocalizationService();
export const t = (key: string) => localization.t(key);