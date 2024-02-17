import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SponsoredOrderComponent } from './sponsored-order.component';
import { SponsoredOrderRoutingModule } from './sponsored-order-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { SponsoredRiderDialogComponent } from './sponsored-rider-dialog/sponsored-rider-dialog.component';



@NgModule({
  declarations: [SponsoredOrderComponent,SponsoredRiderDialogComponent],
  imports: [
    CommonModule,
    SponsoredOrderRoutingModule,
    SharedModule,
    FormsModule
  ]
})
export class SponsoredOrderModule { }
