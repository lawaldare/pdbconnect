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
    const activeTab = this.route.snapshot.data['activeTab']; // 👈 from route data

    if (entryId && activeTab) {
      this.router.navigate([`/pdb/${entryId}`], {
        queryParams: { activeTab },
        replaceUrl: true,
      });
    } else {
      this.router.navigate(['/error'], { replaceUrl: true });
    }
  }
}
