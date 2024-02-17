import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SponsoredOrderComponent } from './sponsored-order.component';

const routes: Routes = [
  {
    path: '',
    component: SponsoredOrderComponent,
    data: {title: 'Sponsored Orders'}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SponsoredOrderRoutingModule { }
