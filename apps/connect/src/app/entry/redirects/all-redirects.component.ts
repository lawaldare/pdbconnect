import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  standalone: true,
  template: '',
})
export class TabRedirectComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  constructor() {
    const entryId = this.route.snapshot.paramMap.get('entryId');
    const activeTab = this.route.snapshot.data['activeTab']; // from route data
    const entityId = this.route.snapshot.paramMap.get('entityId');
    const boundId = this.route.snapshot.paramMap.get('boundId');

    const id = entityId ?? boundId?.split('#')[0];

    if (entryId && activeTab) {
      const queryParams: { activeTab: string; id?: string } = { activeTab };
      if (id) queryParams.id = id;

      this.router.navigate([`/pdb/${entryId}`], {
        queryParams,
        replaceUrl: true,
      });
    } else {
      this.router.navigate(['/error'], { replaceUrl: true });
    }
  }
}
