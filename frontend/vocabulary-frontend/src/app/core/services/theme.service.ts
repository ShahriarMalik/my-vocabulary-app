import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private darkTheme: boolean = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = window.localStorage.getItem('savedTheme');
      if (savedTheme) {
        this.darkTheme = savedTheme === 'dark';
        this.applyTheme();
      }
    }
  }

  setDarkTheme() {
    if (isPlatformBrowser(this.platformId)) {
      this.darkTheme = true;
      this.applyTheme();
      window.localStorage.setItem('savedTheme', 'dark');
    }
  }

  setLightTheme() {
    if (isPlatformBrowser(this.platformId)) {
      this.darkTheme = false;
      this.applyTheme();
      window.localStorage.setItem('savedTheme', 'light');
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
}
