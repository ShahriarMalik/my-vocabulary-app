import { Component, Inject, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { ThemeService } from '../../../core/services/theme.service';
import { LanguageService } from '../../../core/services/language.service';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { platformBrowser } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule,
    RouterLink,
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = true;
  currentLanguage!: string;

  private themeService = inject(ThemeService);
  private languageService = inject(LanguageService);
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  ngOnInit(): void {
    this.currentLanguage = this.languageService.getCurrentLanguage();
    this.authService.isLoggedIn$.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });
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

  onLogout() {
    this.authService.logout()?.subscribe({
      next: () => {
        console.log('Logged out successfully');
        this.router.navigate(['/auth/home']);
      },
    });
  }
}
