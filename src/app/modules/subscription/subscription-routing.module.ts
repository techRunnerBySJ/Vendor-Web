import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/shared/guards/auth.guard';
import { SubscriptionHistoryComponent } from './subscription-history/subscription-history.component';
import { SubscriptionPaymentComponent } from './subscription-payment/subscription-payment.component';
import { SubscriptionPlansComponent } from './subscription-plans/subscription-plans.component';
import { SubscriptionComponent } from './subscription.component';

const routes: Routes = [
  {
    path: '',
    component: SubscriptionComponent,
    children: [
      {
        path: '',
        redirectTo: 'plans',
        pathMatch: 'full',
      },
      {
        path: 'plans',
        component: SubscriptionPlansComponent,
        data: {title: 'Subscription Plans'},
        canActivate: [AuthGuard]
      },
      {
        path: 'history',
        component: SubscriptionHistoryComponent,
        data: {title: 'Subscription History'},
        canActivate: [AuthGuard]
      },
      {
        path: 'payment',
        component: SubscriptionPaymentComponent,
        data: {title: 'Subscription Payment'},
        canActivate: [AuthGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubscriptionRoutingModule { }
