import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataLayerService, MaterialModule } from '@pdbc/core';

export interface DownloadOption {
  name: string;
  url: string;
  downloadable: boolean;
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

  public readonly title = input.required<string>();
  public readonly options = input.required<DownloadOption[]>();
  public readonly backgroundColor = input<string>('#FFF');
}
