// local-complex-redirect.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  standalone: true,
  template: '',
})
export class LocalComplexRedirectComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  ngOnInit() {
    const complexId = this.route.snapshot.paramMap.get('complexId') ?? '';
    console.log('complexId', complexId);
    if (complexId.includes('PDB-CPX')) {
      this.router.navigateByUrl(`/${complexId}`);
    } else {
      this.router.navigateByUrl('/error');
    }
  }
}
