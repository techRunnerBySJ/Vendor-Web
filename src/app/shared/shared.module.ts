import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from './components/components.module';
import { MaterialModule } from 'src/material.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgToggleModule } from 'ng-toggle-button';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { PipesModule } from './pipes/pipes.module';
import { NgxImgModule } from 'ngx-img';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { DirectivesModule } from './directives/directives.module';
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MaterialModule,
    ComponentsModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    NgToggleModule,
    NgxMaterialTimepickerModule,
    PipesModule,
    NgxImgModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    DirectivesModule,
  ],
  exports: [
    MaterialModule,
    ComponentsModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    NgToggleModule,
    NgxMaterialTimepickerModule,
    PipesModule,
    NgxImgModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    DirectivesModule,
  ],
})
export class SharedModule {}
