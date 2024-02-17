import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Order } from 'src/app/modules/my-orders/model/order';
import { MyOrdersService } from '../../services/my-orders.service';
import { HomeService } from '../../services/home.service';
import { Outlet } from 'src/app/modules/home/model/home';
import { Services } from '../../models';
@Component({
  selector: 'app-print-invoice',
  templateUrl: './print-invoice.component.html',
  styleUrls: ['./print-invoice.component.scss']
})
export class PrintInvoiceComponent implements OnInit, AfterViewInit{
  @Input() orderDetails: Order;
  outletName: string;
  outletAddress: string;
  originalContents;
  service: string;
  readonly Services = Services;
  constructor(private myOrderService: MyOrdersService, private homeService: HomeService) { }
  ngOnInit(): void {
    this.service = this.myOrderService.service;
    let outletDetails: Outlet;
    if(this.homeService.outletDetails.has(this.orderDetails.outletId)) {
      outletDetails = this.homeService.outletDetails.get(this.orderDetails.outletId);
    } else {
      outletDetails = this.homeService.outletDetails.get('primaryOutlet');
    }
    this.outletName = outletDetails.name;
    this.outletAddress = outletDetails.address
    this.originalContents = document.body.innerHTML;
  }
  
  ngAfterViewInit(){
    if(this.myOrderService.billType === 'kot'){
    const printContents = document.getElementById('kot-invoice').innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    location.reload();
    }
    if(this.myOrderService.billType=='bill'){
      const printContents = document.getElementById('bill').innerHTML;
      document.body.innerHTML = printContents;
      window.print();
      location.reload();
    }
  }
  
}
