import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionRoutingModule } from './subscription-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { SubscriptionPlansComponent } from './subscription-plans/subscription-plans.component';
import { SubscriptionHistoryComponent } from './subscription-history/subscription-history.component';
import { SubscriptionPaymentComponent } from './subscription-payment/subscription-payment.component';
import { SubscriptionComponent } from './subscription.component';
import { SubscriptionDialogComponent } from './subscription-dialog/subscription-dialog.component';


@NgModule({
  declarations: [
    SubscriptionPlansComponent, 
    SubscriptionHistoryComponent, 
    SubscriptionPaymentComponent, 
    SubscriptionComponent, 
    SubscriptionDialogComponent
  ],
  imports: [
    CommonModule,
    SubscriptionRoutingModule,
    SharedModule
  ]
})
export class SubscriptionModule { }
