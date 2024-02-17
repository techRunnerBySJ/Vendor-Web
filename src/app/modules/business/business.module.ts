import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusinessRoutingModule } from './business-routing.module';
import { BusinessComponent } from './business.component';
import { ViewPayoutsComponent } from './view-payouts/view-payouts.component';
import { ViewPointOfContactDialogComponent } from './view-point-of-contact-dialog/view-point-of-contact-dialog.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { OptInDialogComponent } from './opt-in-dialog/opt-in-dialog.component';
import { ViewDiscountDialogComponent } from './view-discount-dialog/view-discount-dialog.component';
import { DiscountSequenceDialogComponent } from './discount-sequence-dialog/discount-sequence-dialog.component';

@NgModule({
  declarations: [
    BusinessComponent,
    ViewPayoutsComponent,
    ViewPointOfContactDialogComponent,
    OptInDialogComponent,
    ViewDiscountDialogComponent,
    DiscountSequenceDialogComponent,
  ],
  imports: [CommonModule, BusinessRoutingModule, SharedModule],
})
export class BusinessModule {}
