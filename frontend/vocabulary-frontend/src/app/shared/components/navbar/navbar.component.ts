import { Component, inject, ViewEncapsulation } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ThemeService } from '../../../core/services/theme.service';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  isLoggedIn: boolean = true;
  currentLanguage!: string;

  private themeService = inject(ThemeService);
  private languageService = inject(LanguageService);

  constructor() {
    this.currentLanguage = this.languageService.getCurrentLanguage();
  }

  setTheme(theme: string): void {
    if (theme === 'dark') {
      this.themeService.setDarkTheme();
    } else {
      this.themeService.setLightTheme();
    }
  }

  isDarkTheme(): boolean {
    return this.themeService.isDarkTheme();
  }

  changeLanguage(lang: string): void {
    this.languageService.setLanguage(lang);
    this.currentLanguage = lang;
  }
}
