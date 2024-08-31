import { TestBed } from '@angular/core/testing';
import { LanguageService } from './language.service';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

// Mock isPlatformBrowser
jest.mock('@angular/common', () => ({
  ...jest.requireActual('@angular/common'),
  isPlatformBrowser: jest.fn(),
}));

const mockedIsPlatformBrowser = isPlatformBrowser as jest.Mock;

describe('LanguageService', () => {
  let service: LanguageService;
  let router: Router;

  const createService = () => {
    return TestBed.inject(LanguageService);
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: PLATFORM_ID, useValue: 'browser' },
        {
          provide: Router,
          useValue: { navigate: jest.fn() },
        },
      ],
    });

    router = TestBed.inject(Router);

    // Mock isPlatformBrowser to return true by default
    mockedIsPlatformBrowser.mockReturnValue(true);

    // Directly mock localStorage using Object.defineProperty
    const store: { [key: string]: string } = {};

    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn((key: string) => store[key] || null),
        setItem: jest.fn((key: string, value: string) => {
          store[key] = value;
        }),
        removeItem: jest.fn((key: string) => {
          delete store[key];
        }),
        clear: jest.fn(() => {
          for (const key in store) {
            delete store[key];
          }
        }),
      },
      writable: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should be created', () => {
    service = createService();
    expect(service).toBeTruthy();
  });

  describe('setLanguage', () => {
    it('should set the language and redirect when redirect is true', () => {
      service = createService();
      const spy = jest.spyOn(service as any, 'redirectToLanguage');
      service.setLanguage('de', true);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'selectedLanguage',
        'de'
      );
      expect(spy).toHaveBeenCalledWith('de');
    });

    it('should set the language without redirect when redirect is false', () => {
      service = createService();
      const spy = jest.spyOn(service as any, 'redirectToLanguage');
      service.setLanguage('de', false);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'selectedLanguage',
        'de'
      );
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('getCurrentLanguage', () => {
    it('should return the current language from localStorage', () => {
      (localStorage.getItem as jest.Mock).mockReturnValue('de');
      service = createService();
      expect(service.getCurrentLanguage()).toBe('de');
    });

    it('should return the default language if no language is set', () => {
      (localStorage.getItem as jest.Mock).mockReturnValue(null);
      service = createService();
      expect(service.getCurrentLanguage()).toBe('en');
    });
  });

  describe('initialization', () => {
    it('should initialize with the saved language from localStorage', () => {
      (localStorage.getItem as jest.Mock).mockReturnValue('de');
      const spy = jest.spyOn(LanguageService.prototype, 'setLanguage');
      service = createService();
      expect(spy).toHaveBeenCalledWith('de', false);
    });

    it('should initialize with the default language if no language is saved', () => {
      (localStorage.getItem as jest.Mock).mockReturnValue(null);
      const spy = jest.spyOn(LanguageService.prototype, 'setLanguage');
      service = createService();
      expect(spy).toHaveBeenCalledWith('en', false);
    });
  });
});
