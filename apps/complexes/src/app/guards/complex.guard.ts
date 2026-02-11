import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { catchError, map, of, tap } from 'rxjs';
import { ComplexAPIService } from '../services/complex-api.service';
import { ComplexUtilService } from '../services/complex-util.service';

export const complexIdGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const complexId = route.paramMap.get('complexId');
  const apiService = inject(ComplexAPIService);
  const util = inject(ComplexUtilService);

  if (complexId?.toUpperCase().startsWith('PDB-CPX')) {
    return true;
  }

  if (complexId?.toUpperCase().startsWith('CPX')) {
    const upperCaseComplexId = complexId.toUpperCase();
    return apiService.getSummaryForComplexData(upperCaseComplexId, 'complex_portal_id').pipe(
      map((response: any) => {
        const complexId = response.pdb_complex_id;
        if (complexId) {
          const path = `/complexes/${complexId}`;
          return router.createUrlTree([path]);
        } else {
          console.error('No valid complex ID found');
          return router.createUrlTree(['/error'], {
            queryParams: { from: 'complex' },
          });
        }
      }),
      catchError((error) => {
        console.error('API call failed', error);
        return of(
          router.createUrlTree(['/error'], {
            queryParams: { from: 'complex' },
          })
        );
      })
    );
  }

  return apiService.getComplexSummaryStats(complexId ?? '').pipe(
    map((response) => {
      const complexId = util.findComplexId(response);
      if (complexId) {
        const path = `/complexes/${complexId}`;
        return router.createUrlTree([path]);
      } else {
        console.error('No valid complex ID found');
        return router.createUrlTree(['/error'], {
          queryParams: { from: 'complex' },
        });
      }
    }),
    catchError((error) => {
      console.error('API call failed', error);
      util.setPageView('ERROR');
      return of(
        router.createUrlTree(['/error'], {
          queryParams: { from: 'complex' },
        })
      );
    })
  );
};
