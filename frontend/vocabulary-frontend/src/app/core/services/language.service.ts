import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private defaultLanguage = 'en';

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private router: Router
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const savedLanguage = window.localStorage.getItem('selectedLanguage');
      if (savedLanguage) {
        this.setLanguage(savedLanguage, false); // No redirection on initialization
      } else {
        this.setLanguage(this.defaultLanguage, false); // No redirection on initialization
      }
    }
  }

  setLanguage(language: string, redirect: boolean = true): void {
    if (isPlatformBrowser(this.platformId)) {
      window.localStorage.setItem('selectedLanguage', language);

      if (redirect) {
        // Perform a hard redirect instead of Angular navigation
        this.redirectToLanguage(language);
      }
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

  private redirectToLanguage(language: string): void {
    const currentUrl = window.location.href;
    if (language === 'de') {
      if (language === 'de' && currentUrl.includes('/de')) return;
      // If the user is not already on the German site
      if (!currentUrl.includes('/de')) {
        // Redirect to the root of the German site
        window.location.href = 'https://vokabelprofi.shahriar-malik.de/de/';
      }
    } else if (language === 'en') {
      if (language === 'en' && currentUrl.includes('/en')) return;
      // If the user is not already on the English site
      if (!currentUrl.includes('/en')) {
        // Redirect to the root of the English site
        window.location.href = 'https://vokabelprofi.shahriar-malik.de/en/';
      }
    }
  }
}
