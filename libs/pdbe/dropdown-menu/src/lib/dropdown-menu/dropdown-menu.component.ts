import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@pdbc/core';

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
  public readonly title = input.required<string>();
  public readonly options = input.required<DownloadOption[]>();
  public readonly backgroundColor = input<string>('#FFF');
}
