import { NgModule } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
  exports: [
    MatTabsModule,
    MatSidenavModule,
    MatListModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatDialogModule,
    MatTooltipModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatMenuModule,
    MatTableModule,
  ],
})
export class MaterialModule {}
