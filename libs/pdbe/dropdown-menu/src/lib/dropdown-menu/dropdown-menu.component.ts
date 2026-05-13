import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataLayerService, GoogleAnalyticsService, MaterialModule } from '@pdbc/core';

export interface DownloadOption {
  name: string;
  url: string;
  downloadable: boolean;
}

export interface DownloadOptionWithData<TCustomData> extends DownloadOption {
  data: TCustomData;
}

@Component({
  selector: 'lib-dropdown-menu',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './dropdown-menu.component.html',
  styleUrl: './dropdown-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownMenuComponent {
  public readonly dlService = inject(DataLayerService);
  public readonly googleAnalyticsService = inject(GoogleAnalyticsService);

  public readonly title = input.required<string>();
  public readonly options = input.required<any[] | undefined>();
  public readonly backgroundColor = input<string>('#FFF');
}
