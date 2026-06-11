import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError, timeout } from 'rxjs';

export const serverUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const publicDevUrl = 'https://wwwdev.ebi.ac.uk';
  const publicProdUrl = 'https://www.ebi.ac.uk';
  const internalClusterUrl = 'http://pdbe-aggregated-api-nginx';

  // 1. Handle absolute public dev domain matches
  if (req.url.startsWith(publicDevUrl)) {
    const newUrl = req.url.replace(publicDevUrl, internalClusterUrl);
    console.log(`[SSR INTERCEPTOR] Dev Swap: ${req.url} ===> ${newUrl}`);
    return next(req.clone({ url: newUrl })).pipe(
      timeout(2000),
      catchError((error) => {
        if (error.name === 'TimeoutError') {
          console.error(`[SSR ERROR] The request to ${newUrl} TIMED OUT after 2000ms! Connection is hanging.`);
        } else if (error instanceof HttpErrorResponse) {
          console.error(`[SSR ERROR] Failed with Status ${error.status}: ${error.message}`);
        } else {
          console.error('[SSR ERROR] Unknown network exception:', error);
        }
        return throwError(() => error);
      })
    );
  }

  // 2. Handle absolute public production domain matches
  if (req.url.startsWith(publicProdUrl)) {
    const newUrl = req.url.replace(publicProdUrl, internalClusterUrl);
    console.log(`[SSR INTERCEPTOR] Prod Swap: ${req.url} ===> ${newUrl}`);
    return next(req.clone({ url: newUrl }));
  }

  // 3. Handle relative endpoint requests (/pdbe/api/...)
  if (req.url.startsWith('/')) {
    const newUrl = `${internalClusterUrl}${req.url}`;
    console.log(`[SSR INTERCEPTOR] Relative Swap: ${req.url} ===> ${newUrl}`);
    return next(req.clone({ url: newUrl }));
  }

  // If it doesn't match anything, pass the original request straight through
  return next(req);
};
