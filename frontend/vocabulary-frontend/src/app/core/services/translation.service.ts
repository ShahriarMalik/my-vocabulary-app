// import { Injectable } from '@angular/core';
// import { TranslateService } from '@ngx-translate/core';
// import { HttpClient } from '@angular/common/http';
// import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// // Factory function for TranslateHttpLoader
// export function HttpLoaderFactory(http: HttpClient) {
//   return new TranslateHttpLoader(http, './assets/i18n/', '.json');
// }

// @Injectable({
//   providedIn: 'root',
// })
// export class TranslationService {
//   constructor(private translateService: TranslateService) {
//     // Initialize the translation service with a default language or saved language
//     const defaultLanguage = 'en';
//     this.translateService.setDefaultLang(defaultLanguage);
//   }

//   // Initialize the translation service with a specific language
//   initializeTranslation(language: string): void {
//     this.translateService.use(language);
//   }

//   // This method can be used to load additional languages dynamically
//   loadLanguage(language: string): void {
//     this.translateService.use(language);
//   }
// }
