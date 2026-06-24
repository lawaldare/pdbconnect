import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject, PLATFORM_ID, TransferState, makeStateKey } from '@angular/core';
import { isPlatformServer, isPlatformBrowser } from '@angular/common';
import { catchError, throwError } from 'rxjs';

// Create a unique key for tracking server-side API errors
const SSR_ERRORS_KEY = makeStateKey<any[]>('ssr_api_failures');

export const ssrBrowserLogInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  const transferState = inject(TransferState);

  // --- 1. SERVER PASS ---
  if (isPlatformServer(platformId)) {
    return next(req).pipe(
      catchError((error: HttpErrorResponse) => {
        // Retrieve existing errors or initialize a empty array
        const currentErrors = transferState.get(SSR_ERRORS_KEY, []) as any[];

        // Push the broken API metadata into the state array
        currentErrors.push({
          url: req.urlWithParams,
          method: req.method,
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          timestamp: new Date().toLocaleTimeString(),
        });

        transferState.set(SSR_ERRORS_KEY, currentErrors);
        return throwError(() => error);
      })
    );
  }

  // --- 2. BROWSER PASS ---
  if (isPlatformBrowser(platformId)) {
    // Check if the server left any error presents in the transfer state
    if (transferState.hasKey(SSR_ERRORS_KEY)) {
      const failedServerApis = transferState.get(SSR_ERRORS_KEY, []);

      if (failedServerApis.length > 0) {
        console.group(`%c🛑 [SSR SERVER-SIDE API FAILURES DETECTED]`, 'color: #ff0033; font-weight: bold; font-size: 13px;');
        failedServerApis.forEach((api: any) => {
          console.error(`🔴 Failed Call:  [${api.method}] ${api.url}`);
          console.warn(`   Status Code:  ${api.status} (${api.statusText})`);
          console.warn(`   Error Trace:  ${api.message}`);
          console.log(`--------------------------------------------------`);
        });
        console.groupEnd();
      }

      // Clean up the key so subsequent client navigation doesn't re-log them
      transferState.remove(SSR_ERRORS_KEY);
    }
  }

  return next(req);
};
