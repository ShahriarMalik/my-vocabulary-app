import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { LoadingService } from '../services/loading.service';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { loadingInterceptor } from './loading.interceptor';

describe('loadingInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let loadingService: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([loadingInterceptor])),
        provideHttpClientTesting(),
        LoadingService,
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    loadingService = TestBed.inject(LoadingService);

    jest.spyOn(loadingService, 'showLoading');
    jest.spyOn(loadingService, 'hideLoading');
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no unmatched requests are pending
  });

  it('should call showLoading when request starts', () => {
    httpClient.get('/test').subscribe();
    const req = httpMock.expectOne('/test');

    expect(loadingService.showLoading).toHaveBeenCalled();
    req.flush({}); // Simulates a successful response
  });

  it('should call hideLoading when request is successful', () => {
    httpClient.get('/test').subscribe();
    const req = httpMock.expectOne('/test');

    req.flush({}); // Simulates a successful response
    expect(loadingService.hideLoading).toHaveBeenCalled();
  });

  it('should call hideLoading when request fails', () => {
    httpClient.get('/test').subscribe({
      error: () => {
        /* error callback */
      },
    });
    const req = httpMock.expectOne('/test');
    req.error(new ProgressEvent('Network error')); // Simulates a network error

    expect(loadingService.hideLoading).toHaveBeenCalled();
  });
});
