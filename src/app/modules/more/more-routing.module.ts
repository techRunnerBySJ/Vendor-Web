import { OutletInfoComponent } from './outlet-info/outlet-info.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { BillPrinterSettingsComponent } from './bill-printer-settings/bill-printer-settings.component';
import { MoreComponent } from './more.component';
import { PrepTimeComponent } from './prep-time/prep-time.component';
import { RidersComponent } from './riders/riders.component';
import { SlotTimeComponent } from './slot-time/slot-time.component';

const routes: Routes = [
      {
        path: '',
        component: MoreComponent,
        data: {title: 'More'}
      },
      { 
        path: 'prep-time', 
        component: PrepTimeComponent,
        data: {title: 'prep-time'} 
      },
      { 
        path: 'bill-printer-settings', 
        component: BillPrinterSettingsComponent 
      },
      { 
        path: 'outlet-info', 
        component: OutletInfoComponent,
        data: {title: 'outlet-info'}
      },
      { 
        path: 'riders', 
        component: RidersComponent
      },
      {
        path: 'slot-time',
        component: SlotTimeComponent,
        data: {title: 'slot-time'}
      }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MoreRoutingModule {}
