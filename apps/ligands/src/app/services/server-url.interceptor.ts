import { HttpInterceptorFn } from '@angular/common/http';

export const serverUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const publicDevUrl = 'https://wwwdev.ebi.ac.uk';
  const publicProdUrl = 'https://www.ebi.ac.uk';
  const internalClusterUrl = 'http://pdbe-aggregated-api-nginx';

  // If the server pass is trying to hit the public domains, rewrite it to the internal service mesh
  if (req.url.startsWith(publicDevUrl)) {
    const apiRequest = req.clone({
      url: req.url.replace(publicDevUrl, internalClusterUrl),
    });
    return next(apiRequest);
  }

  if (req.url.startsWith(publicProdUrl)) {
    const apiRequest = req.clone({
      url: req.url.replace(publicProdUrl, internalClusterUrl),
    });
    return next(apiRequest);
  }

  return next(req);
};
