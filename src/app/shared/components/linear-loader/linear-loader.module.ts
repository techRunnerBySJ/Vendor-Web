import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LinearLoaderComponent } from './linear-loader.component';
import { LinearLoaderService } from './linear-loader.service';

@NgModule({
  imports: [
      CommonModule
    ],
  providers: [
    LinearLoaderService,
  ],
  exports: [
    LinearLoaderComponent
  ],
  declarations: [
      LinearLoaderComponent
    ]
})
export class LinearLoaderModule { }
