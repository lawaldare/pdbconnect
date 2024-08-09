import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { switchMap, catchError, EMPTY, tap } from 'rxjs';
import { PlaygroundService } from '../../services/playground.service';

@Component({
  selector: 'pdbe-entry-citation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './entry-citation.component.html',
  styleUrl: './entry-citation.component.scss',
})
export class EntryCitationComponent {
  private readonly playgroundService = inject(PlaygroundService);

  private route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  public loadingText = signal('Loading...');

  public entryPublication$ = this.route.params.pipe(
    switchMap((params) => {
      const entryId = params['entryId'].toLowerCase();
      return this.playgroundService.getPrimaryPublicationAbstract(entryId);
    }),
    tap((data) => console.log(data)),
    catchError(() => {
      this.loadingText.set('No data available!');
      return EMPTY;
    }),
    takeUntilDestroyed(this.destroyRef)
  );
}
