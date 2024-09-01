import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { ThemeService } from '../../../core/services/theme.service';
import { LanguageService } from '../../../core/services/language.service';
import { AuthService } from '../../../core/services/auth.service';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let themeService: ThemeService;
  let languageService: LanguageService;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    const mockThemeService = {
      setDarkTheme: jest.fn(),
      setLightTheme: jest.fn(),
      isDarkTheme: jest.fn().mockReturnValue(false),
    };

    const mockLanguageService = {
      getCurrentLanguage: jest.fn().mockReturnValue('en'),
      setLanguage: jest.fn(),
    };

    const mockAuthService = {
      isLoggedIn$: of(true),
      getUserRole: jest.fn().mockReturnValue('user'),
      logout: jest.fn().mockReturnValue(of(null)),
    };

    const mockRouter = {
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { data: {} } },
        },
        { provide: ThemeService, useValue: mockThemeService },
        { provide: LanguageService, useValue: mockLanguageService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    themeService = TestBed.inject(ThemeService);
    languageService = TestBed.inject(LanguageService);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with the correct language and user role', () => {
    expect(component.currentLanguage).toBe('en');
    expect(component.isLoggedIn).toBe(true);
    expect(component.userRole).toBe('user');
  });

  it('should set dark theme', () => {
    component.setTheme('dark');
    expect(themeService.setDarkTheme).toHaveBeenCalled();
  });

  it('should set the light theme', () => {
    component.setTheme('light');
    expect(themeService.setLightTheme).toHaveBeenCalled();
  });

  it('should change language and update currentLanguage', () => {
    component.changeLanguage('de');
    expect(languageService.setLanguage).toHaveBeenCalledWith('de');
    expect(component.currentLanguage).toBe('de');
  });

  it('shold navigate to home on logout', () => {
    component.onLogout();
    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['']);
  });
});
