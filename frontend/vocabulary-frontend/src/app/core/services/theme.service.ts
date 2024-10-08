/**
 * ThemeService handles the application's theme (light or dark) based on user preference.
 *
 * - On initialization, it loads the saved theme from localStorage or defaults to the light theme.
 * - Provides methods to toggle between light and dark themes, persist the user's preference,
 *   and apply the appropriate theme classes to the document body.
 * - Exposes an observable for components to subscribe to theme changes.
 */
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private darkTheme: boolean = false;
  private themeSubject = new BehaviorSubject<boolean>(this.darkTheme);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = window.localStorage.getItem('savedTheme');
      if (savedTheme) {
        this.darkTheme = savedTheme === 'dark';
      } else {
        // Default theme can be set here if nothing is saved
        this.darkTheme = false; // Light theme by default
      }
      this.applyTheme();
    } else {
      // On the server side, apply the default theme (light theme)
      this.darkTheme = false;
    }
  }

  setDarkTheme() {
    if (isPlatformBrowser(this.platformId)) {
      this.darkTheme = true;
      this.applyTheme();
      window.localStorage.setItem('savedTheme', 'dark');
      document.cookie = 'theme=dark; path=/';
      this.themeSubject.next(this.darkTheme);
    }
  }

  setLightTheme() {
    if (isPlatformBrowser(this.platformId)) {
      this.darkTheme = false;
      this.applyTheme();
      window.localStorage.setItem('savedTheme', 'light');
      document.cookie = 'theme=light; path=/';
      this.themeSubject.next(this.darkTheme);
    }
  }

  toggleTheme() {
    if (isPlatformBrowser(this.platformId)) {
      this.darkTheme = !this.darkTheme;
      this.applyTheme();
      window.localStorage.setItem(
        'savedTheme',
        this.darkTheme ? 'dark' : 'light'
      );
      this.themeSubject.next(this.darkTheme);
    }
  }

  private applyTheme() {
    if (isPlatformBrowser(this.platformId)) {
      const body = document.body;

      if (this.darkTheme) {
        body.classList.add('dark-theme');
        body.classList.remove('light-theme');
      } else {
        body.classList.add('light-theme');
        body.classList.remove('dark-theme');
      }
    }
  }

  isDarkTheme(): boolean {
    return this.darkTheme;
  }

  getThemeObservable() {
    return this.themeSubject.asObservable();
  }
}
