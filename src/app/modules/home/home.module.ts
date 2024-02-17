import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {HomeRoutingModule} from './home-routing.module';
import {HomeComponent} from './home.component';
import { SharedModule } from 'src/app/shared/shared.module';
@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,
  ],
  declarations: [
    HomeComponent,
  ]
})
export class HomeModule {
}
