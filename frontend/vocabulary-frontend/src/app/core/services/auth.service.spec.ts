import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { jwtDecode } from 'jwt-decode';

// Mock jwtDecode
jest.mock('jwt-decode', () => ({
  jwtDecode: jest.fn(),
}));

// Mock isPlatformBrowser
jest.mock('@angular/common', () => ({
  ...jest.requireActual('@angular/common'),
  isPlatformBrowser: jest.fn(),
}));

const mockedIsPlatformBrowser = isPlatformBrowser as jest.Mock;
const mockJwtDecode = jwtDecode as jest.Mock;

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService, { provide: PLATFORM_ID, useValue: 'browser' }],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

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
    httpMock.verify(); // Ensure that no outstanding requests are pending
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('checkEmailExists', () => {
    it('should check if email exists', () => {
      const email = 'test@example.com';
      const mockResponse = { exists: true };

      service.checkEmailExists(email).subscribe((exists) => {
        expect(exists).toBe(true);
      });

      const req = httpMock.expectOne(`${service['apiUrl']}/check-email`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ email });
      req.flush(mockResponse);
    });
  });

  describe('login', () => {
    it('should login and store tokens', () => {
      const credentials = {
        email: 'test@example.com',
        password: 'password123',
      };
      const mockResponse = {
        jwt: 'mock-jwt-token',
        'refresh-token': 'mock-refresh-token',
        role: 'admin',
      };

      service.login(credentials).subscribe((response) => {
        expect(response).toEqual(mockResponse);
        expect(localStorage.setItem).toHaveBeenCalledWith(
          'jwt',
          mockResponse.jwt
        );
        expect(localStorage.setItem).toHaveBeenCalledWith(
          'refresh-token',
          mockResponse['refresh-token']
        );
        expect(localStorage.setItem).toHaveBeenCalledWith(
          'role',
          mockResponse.role
        );
      });

      const req = httpMock.expectOne(`${service['apiUrl']}/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(credentials);
      req.flush(mockResponse);

      // Check if loggedIn BehaivourSubject was updated
      service.isLoggedIn$.subscribe((loggedIn) => {
        expect(loggedIn).toBe(true);
      });
    });
  });

  describe('logout', () => {
    it('should logout and clear tokens when refresh token exists', () => {
      (localStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === 'refresh_token') {
          return 'mock-refresh-token';
        }
        return null;
      });
      service.logout()?.subscribe((response) => {
        expect(response).toEqual({});
        expect(localStorage.removeItem).toHaveBeenCalledWith('jwt');
        expect(localStorage.removeItem).toHaveBeenCalledWith('refresh_token');
        expect(localStorage.removeItem).toHaveBeenCalledWith('role');

        // Check if loggedIn BehaviourSubject was updated
        service.isLoggedIn$.subscribe((loggedIn) => {
          expect(loggedIn).toBe(false);
        });
      });

      // Handle the logout POST request
      const req = httpMock.expectOne(`${service['apiUrl']}/logout`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ refresh_token: 'mock-refresh-token' });
      req.flush({});
    });

    it('should logout and not send HTTP request when no refresh token exists', () => {
      (localStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === 'refresh_token') {
          return null;
        }

        return 'mock-value';
      });

      const result = service.logout();
      expect(result).toBeUndefined();
      expect(localStorage.removeItem).toHaveBeenCalledWith('jwt');
      expect(localStorage.removeItem).toHaveBeenCalledWith('refresh_token');
      expect(localStorage.removeItem).toHaveBeenCalledWith('role');

      service.isLoggedIn$.subscribe((loggedIn) => {
        expect(loggedIn).toBe(false);
      });

      // No HTTP requst should be made
      httpMock.expectNone(`${service['apiUrl']}/logout`);
    });
  });

  describe('isLoggedIn', () => {
    it('should return true if JWT exists', () => {
      (localStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === 'jwt') {
          return 'mock-jwt-token';
        }

        return null;
      });
      expect(service.isLoggedIn()).toBe(true);
    });
    it('should return false if JWT does not exist', () => {
      (localStorage.getItem as jest.Mock).mockImplementation(() => null);
      expect(service.isLoggedIn()).toBe(false);
    });
  });

  describe('requestPasswordReset', () => {
    it('should request password reset', () => {
      const email = 'test@example.com';
      const mockResponse = {
        message:
          'If your email is registered, you will receive a password reset link shortly.',
      };

      service.requestPasswordReset(email).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(
        `${service['apiUrl']}/request-password-reset`
      );
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ email });
      req.flush(mockResponse);
    });
  });

  describe('signUp', () => {
    it('should sign up a new user', () => {
      const credentials = {
        username: 'newuser',
        email: 'newuser@gmail.com',
        password: 'password123',
      };
      const mockResponse = { message: 'User registered successfully' };

      service.signUp(credentials).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });
      const req = httpMock.expectOne(`${service['apiUrl']}/register`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(credentials);
      req.flush(mockResponse);
    });
  });

  describe('getValidTOken', () => {
    it('should return the valid token if not expired', () => {
      const mockToken = 'valid-json-token';
      const decodedToken = { exp: (Date.now() + 100000) / 1000 }; // Expires in future
      (localStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === 'jwt') {
          return mockToken;
        }
        return null;
      });

      // Mock jwtDecode to return the decoded token
      mockJwtDecode.mockReturnValue(decodedToken);

      const token = service.getValidToken();
      expect(token).toBe(mockToken);
      expect(jwtDecode).toHaveBeenCalledWith(mockToken);
    });

    it('should logout and return empty string if token is expired', () => {
      const mockToken = 'expired-jwt-token';
      const decodedToken = { exp: (Date.now() - 10000) / 1000 }; // expired token
      (localStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === 'jwt') {
          return mockToken;
        }
        return null;
      });

      // Mock jwtDecode to return the decoded token
      mockJwtDecode.mockReturnValue(decodedToken);

      const logoutSpy = jest
        .spyOn(service, 'logout')
        .mockReturnValue(undefined);

      const token = service.getValidToken();
      expect(jwtDecode).toHaveBeenCalledWith(mockToken);
      expect(logoutSpy).toHaveBeenCalled();
      expect(token).toBe('');
    });
  });

  describe('getUserRole', () => {
    it('should return the user role from localStorge', () => {
      (localStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === 'role') {
          return 'admin';
        }
        return null;
      });

      const role = service.getUserRole();
      expect(role).toBe('admin');
    });

    it('shoud default to "user" if role is not set', () => {
      (localStorage.getItem as jest.Mock).mockImplementation(() => null);
      const role = service.getUserRole();
      expect(role).toBe('user');
    });

    it('should return the "user" if role is not admin', () => {
      (localStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === 'role') {
          return 'user';
        }
        return null;
      });
      const role = service.getUserRole();
      expect(role).toBe('user');
    });
  });

  describe('getUserIdFromToken', () => {
    it('should return user ID from valid token', () => {
      const mockToken = 'valid-jwt-token';
      const decodedToken = { user_id: '12', exp: (Date.now() + 10000) / 1000 };

      (localStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === 'jwt') {
          return mockToken;
        }
        return null;
      });

      mockJwtDecode.mockReturnValue(decodedToken);

      const userId = service.getUserIdFromToken();
      expect(jwtDecode).toHaveBeenCalledWith(mockToken);
      expect(userId).toBe('12');
    });

    it('should return null if no token exists', () => {
      (localStorage.getItem as jest.Mock).mockImplementation(() => null);
      const userId = service.getUserIdFromToken();
      expect(userId).toBeNull();
    });
  });
});
