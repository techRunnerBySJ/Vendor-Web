import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuRoutingModule } from './menu-routing.module';
import { MenuComponent } from './menu.component';
import { AddNewItemComponent } from './add-new-item/add-new-item.component';
import { AddNewAddOnComponent } from './add-new-add-on/add-new-add-on.component';
import { AddNewDialogComponent } from './menu-dialogs/add-new-dialog/add-new-dialog.component';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { SharedModule } from 'src/app/shared/shared.module';
@NgModule({
  declarations: [MenuComponent, AddNewItemComponent, AddNewAddOnComponent, AddNewAddOnComponent, AddNewDialogComponent],
  imports: [
    CommonModule,
    MenuRoutingModule,
    SharedModule,
    DirectivesModule,
  ]
})
export class MenuModule { }
