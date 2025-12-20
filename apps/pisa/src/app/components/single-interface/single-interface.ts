import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@pdbc/core';
import { PisaUtilService } from '../../services/pisa-util.service';
import { PisaApiService } from '../../services/pisa-api.service';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { PisaSelectors } from '../../store/pisa.selectors';
import { filter } from 'rxjs';
import { MolstarComponent } from '@pdbe-lib/molstar-for-apps';
import { PisaActions } from '../../store/pisa.actions';
import { SingleInterfaceDetailsComponent } from './components/single-interface-details/single-interface-details';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'pisa-single-interface',
  imports: [CommonModule, FormsModule, MaterialModule, ReactiveFormsModule, MolstarComponent, SingleInterfaceDetailsComponent, NgxPaginationModule],
  templateUrl: './single-interface.html',
  styleUrl: './single-interface.scss',
})
export class SingleInterfaceComponent implements OnInit {
  public pisaUtilService = inject(PisaUtilService);
  public pisaAPIService = inject(PisaApiService);
  private pisaStore = inject(Store);

  public readonly interface = signal<any | null>(null);
  public readonly selectedComplexData = toSignal(this.pisaStore.select(PisaSelectors.selectedComplexData));

  public config!: any;
  public height = '400px';

  public selectedInterfaceRow = signal<any>({});
  public startNumber = signal<number>(1);

  ngOnInit(): void {
    this.pisaStore
      .select(PisaSelectors.interfaceResultForInterfaceId)
      .pipe(filter(Boolean))
      .subscribe((response) => {
        this.interface.set(response);
        const selectedInterfaceId = response.interface_id;

        console.log('Interface:', this.interface());
        console.log('Selected complex data:', this.selectedComplexData());

        const selectedinterfaceData = this.selectedComplexData()?.interfaces.find((row: any) => row.interface_id === selectedInterfaceId);
        if (selectedinterfaceData) {
          this.selectedInterfaceRow.set(selectedinterfaceData);
        }
      });

    this.config = {
      moleculeId: '1a0u',
      bgColor: { r: 255, g: 255, b: 255 },
      assemblyId: '1',
      hideControls: true,
      hideCanvasControls: ['expand', 'animation', 'controlToggle'],
      landscape: true,
    };
  }

  public goBackToComplexes() {
    this.pisaUtilService.setComplexesTabView('INITIAL');
  }

  public onInterfaceRowClick(rowData: any) {
    this.selectedInterfaceRow.set(rowData);
    this.pisaStore.dispatch(PisaActions.getInterfaceResultForInterfaceId({ interfaceId: rowData.interface_id }));
  }

  public onChangePage(num: number): void {
    const p = (num - 1) * 10;
    this.startNumber.set(num);
    this.selectedInterfaceRow.set(this.selectedComplexData().interfaces[p]);
    this.pisaStore.dispatch(PisaActions.getInterfaceResultForInterfaceId({ interfaceId: this.selectedComplexData().interfaces[p].interface_id }));
    // this.loadSelectionFromTable(this.selectedComplexData().interfaces[p].index);
  }
}
