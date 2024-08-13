import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private defaultLanguage = 'en';

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    if (isPlatformBrowser(this.platformId)) {
      const savedLanguage = window.localStorage.getItem('selectedLanguage');
      if (savedLanguage) {
        this.setLanguage(savedLanguage);
      } else {
        this.setLanguage(this.defaultLanguage);
      }
    }
  }

  setLanguage(language: string): void {
    if (isPlatformBrowser(this.platformId)) {
      window.localStorage.setItem('selectedLanguage', language);
    }
  }

  getCurrentLanguage(): string {
    if (isPlatformBrowser(this.platformId)) {
      return (
        window.localStorage.getItem('selectedLanguage') || this.defaultLanguage
      );
    }
    return this.defaultLanguage;
  }
}
