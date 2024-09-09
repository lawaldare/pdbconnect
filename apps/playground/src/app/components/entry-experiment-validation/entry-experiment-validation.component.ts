import { Component, DestroyRef, EventEmitter, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PlaygroundService } from '../../services/playground.service';
import { catchError, EMPTY, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'pdbe-entry-experiment-validation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './entry-experiment-validation.component.html',
  styleUrl: './entry-experiment-validation.component.scss',
})
export class EntryExperimentValidationComponent {
  @Output() switchTab = new EventEmitter<string>();
  private readonly playgroundService = inject(PlaygroundService);

  private route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  public loadingText = signal('Loading...');

  public entryElementData$ = this.route.queryParams.pipe(
    switchMap((params) => {
      const entryId = params['entryId'].toLowerCase();
      return this.playgroundService.getEntryEcmExperiment(entryId);
    }),
    catchError(() => {
      this.loadingText.set('No data available!');
      return EMPTY;
    }),
    takeUntilDestroyed(this.destroyRef)
  );

  public selectTab(name: string) {
    this.switchTab.emit(name);
  }
}
