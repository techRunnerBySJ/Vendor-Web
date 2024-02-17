import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { MyOrdersComponent } from './my-orders.component';

const routes: Routes = [
  {
    path: '',
    component: MyOrdersComponent,
    data: {title: 'My Orders'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyOrdersRoutingModule {}
