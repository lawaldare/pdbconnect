import { CanActivateFn, Router } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import { ComplexAPIService } from '../services/complex-api.service';
import { ComplexUtilService } from '../services/complex-util.service';
import { isPlatformBrowser } from '@angular/common';

export const complexIdGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const complexId = route.paramMap.get('complexId');
  const apiService = inject(ComplexAPIService);
  const util = inject(ComplexUtilService);
  const platformId = inject(PLATFORM_ID);
  const isBrowser = isPlatformBrowser(platformId);

  if (!complexId) {
    console.error('No complex ID provided in route');
    return of(router.createUrlTree(['/error']));
  }

  if (complexId?.toUpperCase().startsWith('PDB-CPX')) {
    return true;
  }

  if (!isBrowser) {
    return true;
  }

  if (complexId?.toUpperCase().startsWith('CPX')) {
    const upperCaseComplexId = complexId.toUpperCase();
    return apiService.getSummaryForComplexData(upperCaseComplexId, 'complex_portal_id').pipe(
      map((response: any) => {
        const complexId = response.pdb_complex_id;
        if (complexId) {
          const path = `/${complexId}`;
          return router.createUrlTree([path]);
        } else {
          console.error('No valid complex ID found');
          return router.createUrlTree(['/error']);
        }
      }),
      catchError((error) => {
        console.error('API call failed', error);
        return of(router.createUrlTree(['/error']));
      })
    );
  }

  return apiService.getComplexSummaryStats(complexId ?? '').pipe(
    map((response) => {
      const complexId = util.findComplexId(response);
      if (complexId) {
        const path = `/${complexId}`;
        return router.createUrlTree([path]);
      } else {
        console.error('No valid complex ID found');
        return router.createUrlTree(['/error']);
      }
    }),
    catchError((error) => {
      console.error('API call failed', error);
      util.setPageView('ERROR');
      return of(router.createUrlTree(['/error']));
    })
  );
};
