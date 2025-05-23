// complex-id.guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const complexIdGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const complexId = route.paramMap.get('complexId');

  if (complexId?.includes('PDB-CPX')) {
    return true;
  } else {
    router.navigateByUrl('/error');
    return false;
  }
};
