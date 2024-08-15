import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoadingService } from '../services/loading.service';
import { inject } from '@angular/core';

export function loadingInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const loadingService = inject(LoadingService);

  loadingService.showLaoding();

  return next(req).pipe(
    tap({
      next: (event) => {
        if (event.type === 4) {
          loadingService.hideLoading();
        }
      },
      error: () => {
        loadingService.hideLoading();
      },
    })
  );
}
