import { TestBed } from '@angular/core/testing';

import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set loading to true when showLoading is called', (done) => {
    service.loading$.subscribe((loading) => {
      if (loading) {
        expect(loading).toBe(true);
        done();
      }
    });
    service.showLoading();
  });

  it('should set loading to false when hideLoading is called', (done) => {
    service.showLoading();

    service.loading$.subscribe((loading) => {
      if (!loading) {
        expect(loading).toBe(false);
        done();
      }
    });
    service.hideLoading();
  });
});
