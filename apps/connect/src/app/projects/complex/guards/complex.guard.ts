// complex-id.guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import { ComplexAPIService } from '../services/complex-api.service';
import { ComplexUtilService } from '../services/complex-util.service';
import { environment } from '../../../../environments/environment';

export const complexIdGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const complexId = route.paramMap.get('complexId');
  const apiService = inject(ComplexAPIService);
  const util = inject(ComplexUtilService);

  if (complexId?.includes('PDB-CPX')) {
    return true;
  }

  return apiService.getComplexSummaryStats(complexId ?? '').pipe(
    map((response) => {
      const complexId = util.findComplexId(response);
      if (complexId) {
        const hostname = document.location.hostname;
        const path = hostname === 'localhost' ? `/${complexId}` : `/pdbe-kb/complexes/${complexId}`;
        router.navigateByUrl(path);
        return false;
      } else {
        console.error('No valid complex ID found');
        router.navigateByUrl('/error');
        return false;
      }
    }),
    catchError((error) => {
      console.error('API call failed', error);
      router.navigateByUrl('/error');
      return of(false);
    })
  );
};
