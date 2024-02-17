import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/shared/guards/auth.guard';
import { HomeComponent } from './home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'my-orders',
        loadChildren: () => import('../../modules/my-orders/my-orders.module').then(m => m.MyOrdersModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'business',
        loadChildren: () => import('../../modules/business/business.module').then(m => m.BusinessModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'order-history',
        loadChildren: () => import('../../modules/history/history.module').then(m => m.HistoryModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'more',
        loadChildren: () => import('../../modules/more/more.module').then(m => m.MoreModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'menu',
        loadChildren: () => import('../../modules/menu/menu.module').then(m => m.MenuModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'delivery',
        loadChildren: () => import('../../modules/sponsored-order/sponsored-order.module').then(m => m.SponsoredOrderModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'grocery-orders',
        loadChildren: () => import('../../modules/inquiry-orders/inquiry-orders.module').then(m => m.InquiryOrdersModule),
        canActivate: [AuthGuard]
      },
      // {
      //   path: 'subscription',
      //   loadChildren: () => import('../../modules/subscription/subscription.module').then(m => m.SubscriptionModule),
      //   canActivate: [AuthGuard]
      // }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {
}
