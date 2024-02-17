import { FormErrorMsgComponent } from './form-error-msg/form-error-msg.component';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ActionButtonComponent} from './action-button/action-button.component';
import {ActionModalComponent} from './action-modal/action-modal.component';
import {ConfirmationModalModule} from './confirmation-modal/confirmation-modal.module';
import {LinearLoaderModule} from './linear-loader/linear-loader.module';
import { MessageDialogComponent } from './message-dialog/message-dialog.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { OrderDetailsDialogComponent } from './order-details-dialog/order-details-dialog.component'
import { HelpDialogComponent } from './help-dialog/help-dialog.component';
import { MaterialModule } from 'src/material.module';
import { HolidaySlotsDialogComponent } from './holiday-slots-dialog/holiday-slots-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { ServerErrorPageComponent } from './server-error-page/server-error-page.component';
import { Page404Component } from './page404/page404.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { PrintInvoiceComponent } from './print-invoice/print-invoice.component';
import { InquiryOrderDetailsDialogComponent } from './inquiry-order-details-dialog/inquiry-order-details-dialog.component';


@NgModule({
  declarations: [
    ActionButtonComponent,
    ActionModalComponent,
    FormErrorMsgComponent,
    MessageDialogComponent,
    ConfirmationDialogComponent,
    OrderDetailsDialogComponent,
    HelpDialogComponent,
    HolidaySlotsDialogComponent,
    ServerErrorPageComponent,
    Page404Component,
    ChangePasswordComponent,
    PrintInvoiceComponent,
    InquiryOrderDetailsDialogComponent
  ],
  imports: [
    CommonModule,
    ConfirmationModalModule,
    LinearLoaderModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaterialTimepickerModule
  ],
  exports: [
    ActionButtonComponent,
    ActionModalComponent,
    LinearLoaderModule,
    FormErrorMsgComponent,
    OrderDetailsDialogComponent,
    HelpDialogComponent,
    HolidaySlotsDialogComponent,
    ChangePasswordComponent,
    InquiryOrderDetailsDialogComponent
  ]
})
export class ComponentsModule {
}
