import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyOrdersRoutingModule } from './my-orders-routing.module';
import { MyOrdersComponent } from './my-orders.component';
import { RejectOrderDialogComponent } from './reject-order-dialog/reject-order-dialog.component';
import { ConfirmOrderDialogComponent } from './confirm-order-dialog/confirm-order-dialog.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    MyOrdersComponent,
    RejectOrderDialogComponent, 
    ConfirmOrderDialogComponent,
  ],
  imports: [
    CommonModule,
    MyOrdersRoutingModule,
    SharedModule
  ]
})
export class MyOrdersModule { }
