import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { tokenInterceptor } from './token.interceptor';
import { Observable } from 'rxjs';

describe('tokenInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([tokenInterceptor])),
        provideHttpClientTesting(),
        {
          provide: AuthService,
          useValue: {
            isLoggedIn: jest.fn(),
            getValidToken: jest.fn(),
          },
        },
        {
          provide: Router,
          useValue: {
            navigate: jest.fn(),
          },
        },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no unmatched requests are pending
  });

  it('should add Authorization header if user is logged in with valid token', () => {
    const mockToken = 'valid-token';
    (authService.isLoggedIn as jest.Mock).mockReturnValue(true);
    (authService.getValidToken as jest.Mock).mockReturnValue(mockToken);

    httpClient.get('/test').subscribe();

    const req = httpMock.expectOne('/test');
    expect(req.request.headers.get('Authorization')).toBe(
      `Bearer ${mockToken}`
    );
  });

  it('should redirect to login if user is logged in but no valid token', () => {
    (authService.isLoggedIn as jest.Mock).mockReturnValue(true);
    (authService.getValidToken as jest.Mock).mockReturnValue(null);

    httpClient.get('/test').subscribe({
      next: () => fail('Request should have been stopped'),
      error: () => fail('Request should have been stopped'),
      complete: () => {
        // This block will be called when observer.complete() is triggered
        expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
      },
    });

    httpMock.expectNone('/test'); // Ensure no HTTP request was made
  });

  it('should proceed without Authorization header if user is not logged in', () => {
    (authService.isLoggedIn as jest.Mock).mockReturnValue(false);

    httpClient.get('/test').subscribe();

    const req = httpMock.expectOne('/test');
    expect(req.request.headers.has('Authorization')).toBe(false);
  });
});
