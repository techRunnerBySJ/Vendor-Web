import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { AddNewAddOnComponent } from './add-new-add-on/add-new-add-on.component';
import { AddNewItemComponent } from './add-new-item/add-new-item.component';
import { MenuComponent } from './menu.component';

const routes: Routes = [
      {
        path: '',
        component: MenuComponent, data: {kind: 'categories', title: 'Outlet Menu'}
      },
      {
        path: 'add-ons',
        component: MenuComponent, data: {kind: 'add-on-groups', title: 'Add-ons'}
      },
      { 
        path: 'add-new-item', 
        component: AddNewItemComponent 
      },
      { 
        path: 'add-new-add-on', 
        component: AddNewAddOnComponent
      }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenuRoutingModule { }
