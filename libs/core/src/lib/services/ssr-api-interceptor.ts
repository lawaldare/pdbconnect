import { isPlatformServer } from '@angular/common';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ssrErrors } from './ssr-errors';

export const apiErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (isPlatformServer(platformId)) {
        ssrErrors.push({
          url: req.urlWithParams,
          method: req.method,
          status: error.status,
          message: error.message,
        });
      }

      return throwError(() => error);
    })
  );
};
