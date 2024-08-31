import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// Mock isPlatformBrowser
jest.mock('@angular/common', () => ({
  ...jest.requireActual('@angular/common'),
  isPlatformBrowser: jest.fn(),
}));

const mockedIsPlatformBrowser = isPlatformBrowser as jest.Mock;

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ThemeService, { provide: PLATFORM_ID, useValue: 'browser' }],
    });

    // Mock isPlatformBrowser to return true
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

    // Mock document.body.classList for applying themes
    document.body.classList.add = jest.fn();
    document.body.classList.remove = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('initialization', () => {
    it('should initialize with saved dark theme', () => {
      (localStorage.getItem as jest.Mock).mockReturnValue('dark');

      // Re-inject the service after mocking localStorage
      service = TestBed.inject(ThemeService);

      expect(service.isDarkTheme()).toBe(true);
      expect(document.body.classList.add).toHaveBeenCalledWith('dark-theme');
      expect(document.body.classList.remove).toHaveBeenCalledWith(
        'light-theme'
      );
    });

    it('should initialize with light theme when no theme is saved', () => {
      (localStorage.getItem as jest.Mock).mockReturnValue(null);

      // Re-inject the service after mocking localStorage
      service = TestBed.inject(ThemeService);

      expect(service.isDarkTheme()).toBe(false);
      expect(document.body.classList.add).toHaveBeenCalledWith('light-theme');
      expect(document.body.classList.remove).toHaveBeenCalledWith('dark-theme');
    });
  });

  describe('setDarkTheme', () => {
    beforeEach(() => {
      service = TestBed.inject(ThemeService);
    });

    it('should set dark theme and persist preference', () => {
      service.setDarkTheme();

      expect(service.isDarkTheme()).toBe(true);
      expect(localStorage.setItem).toHaveBeenCalledWith('savedTheme', 'dark');
      expect(document.body.classList.add).toHaveBeenCalledWith('dark-theme');
      expect(document.body.classList.remove).toHaveBeenCalledWith(
        'light-theme'
      );
    });
  });

  describe('setLightTheme', () => {
    beforeEach(() => {
      service = TestBed.inject(ThemeService);
    });

    it('should set light theme and persist preference', () => {
      service.setLightTheme();

      expect(service.isDarkTheme()).toBe(false);
      expect(localStorage.setItem).toHaveBeenCalledWith('savedTheme', 'light');
      expect(document.body.classList.add).toHaveBeenCalledWith('light-theme');
      expect(document.body.classList.remove).toHaveBeenCalledWith('dark-theme');
    });
  });

  describe('toggleTheme', () => {
    beforeEach(() => {
      service = TestBed.inject(ThemeService);
    });

    it('should toggle to dark theme when currently light', () => {
      service.setLightTheme(); // Ensure it's light first
      service.toggleTheme();

      expect(service.isDarkTheme()).toBe(true);
      expect(localStorage.setItem).toHaveBeenCalledWith('savedTheme', 'dark');
      expect(document.body.classList.add).toHaveBeenCalledWith('dark-theme');
      expect(document.body.classList.remove).toHaveBeenCalledWith(
        'light-theme'
      );
    });

    it('should toggle to light theme when currently dark', () => {
      service.setDarkTheme(); // Ensure it's dark first
      service.toggleTheme();

      expect(service.isDarkTheme()).toBe(false);
      expect(localStorage.setItem).toHaveBeenCalledWith('savedTheme', 'light');
      expect(document.body.classList.add).toHaveBeenCalledWith('light-theme');
      expect(document.body.classList.remove).toHaveBeenCalledWith('dark-theme');
    });
  });

  describe('getThemeObservable', () => {
    beforeEach(() => {
      service = TestBed.inject(ThemeService);
    });

    it('should allow subscription to theme changes', (done) => {
      service.getThemeObservable().subscribe((isDarkTheme) => {
        if (isDarkTheme) {
          expect(isDarkTheme).toBe(true);
          done();
        }
      });

      service.setDarkTheme();
    });
  });
});
