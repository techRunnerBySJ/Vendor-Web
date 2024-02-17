import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InquiryOrdersComponent } from './inquiry-orders.component';

const routes: Routes = [
  {
    path: '',
    component: InquiryOrdersComponent,
    data: {title: 'My Orders'}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InquiryOrdersRoutingModule {}
