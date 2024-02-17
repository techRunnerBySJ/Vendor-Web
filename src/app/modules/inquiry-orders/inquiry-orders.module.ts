import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InquiryOrdersRoutingModule } from './inquiry-orders-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { InquiryOrdersComponent } from './inquiry-orders.component';
import { ActionDialogComponent } from './action-dialog/action-dialog.component';
import { MenuDialogComponent } from './menu-dialog/menu-dialog.component';



@NgModule({
  declarations: [InquiryOrdersComponent, ActionDialogComponent, MenuDialogComponent],
  imports: [
    CommonModule,
    InquiryOrdersRoutingModule,
    SharedModule
  ],
  exports: [
    
  ]
})
export class InquiryOrdersModule { }
