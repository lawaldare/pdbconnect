import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from './material.module';

const declarations: never[] = [];

const modules = [CommonModule, MaterialModule];

@NgModule({
  imports: modules,
  declarations: [...declarations],
  exports: [...modules, ...declarations],
})
export class CoreModule {}
