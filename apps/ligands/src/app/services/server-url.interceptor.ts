import { HttpInterceptorFn } from '@angular/common/http';

export const serverUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const publicDevUrl = 'https://wwwdev.ebi.ac.uk';
  const publicProdUrl = 'https://www.ebi.ac.uk';
  const internalClusterUrl = 'http://pdbe-aggregated-api-nginx';

  // 1. Handle absolute public dev domain matches
  if (req.url.startsWith(publicDevUrl)) {
    const newUrl = req.url.replace(publicDevUrl, internalClusterUrl);
    console.log(`[SSR INTERCEPTOR] Dev Swap: ${req.url} ===> ${newUrl}`);
    return next(req.clone({ url: newUrl }));
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
