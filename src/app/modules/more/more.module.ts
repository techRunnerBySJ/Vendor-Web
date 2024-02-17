import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoreRoutingModule } from './more-routing.module';
import { MoreComponent } from './more.component';
import { PrepTimeComponent } from './prep-time/prep-time.component';
import { BillPrinterSettingsComponent } from './bill-printer-settings/bill-printer-settings.component';
import { OutletInfoComponent } from './outlet-info/outlet-info.component';
import { RidersComponent } from './riders/riders.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { IvyCarouselModule } from 'angular-responsive-carousel';
import { SlotTimeComponent } from './slot-time/slot-time.component';

@NgModule({
  declarations: [
    MoreComponent, 
    PrepTimeComponent, 
    BillPrinterSettingsComponent, 
    OutletInfoComponent, 
    RidersComponent, SlotTimeComponent,
  ],
  imports: [
    CommonModule,
    MoreRoutingModule,
    SharedModule,
    IvyCarouselModule
  ]
})
export class MoreModule { }
