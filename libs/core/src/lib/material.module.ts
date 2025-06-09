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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSortModule } from '@angular/material/sort';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';

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
    MatCheckboxModule,
    MatSortModule,
    MatExpansionModule,
    MatBottomSheetModule,
    MatSlideToggleModule,
    MatIconModule,
  ],
})
export class MaterialModule {}
