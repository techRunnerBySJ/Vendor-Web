import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/shared/guards/auth.guard';
import { HomeComponent } from '../home/home.component';
import { BusinessComponent } from './business.component';
import { ViewPayoutsComponent } from './view-payouts/view-payouts.component';

const routes: Routes = [
  {
    path: '',
    component: BusinessComponent,
    data: { title: 'Business' },
    canActivate: [AuthGuard],
  },
  {
    path: 'view-payouts',
    component: ViewPayoutsComponent,
    data: { title: 'View Payouts' },
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BusinessRoutingModule { }
