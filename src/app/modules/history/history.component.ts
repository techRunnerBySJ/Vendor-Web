import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MyOrdersService } from 'src/app/shared/services/my-orders.service';
import { Order, OrderStatus } from '../my-orders/model/order';
import * as moment from 'moment'
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/shared/services/shared.service';
import { skip } from 'rxjs/operators';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit, OnDestroy {

  ordersList: Order[] = [];
  totalOrders: number;
  orderStatus: OrderStatus = 'completed';
  currentPage: number = 1
  pageSize: number = 8;
  maxDate = new Date();

  search = new FormControl();
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  subscriptions: Subscription[] = [];
  constructor(private myordersService: MyOrdersService, private sharedService: SharedService, private toasterMsgService: ToastService) { }

  ngOnInit(): void {
    this.getHistoryData();

    this.subscriptions.push(
      this.sharedService.resetData$.pipe(skip(1)).subscribe(flag => {
        if (flag) this.reinitializeData();
      })
    )
  }

  /**
   * Method that will invokes when user changes 
   * outlet from home-component and it will recalls 
   * methods to update data for the selected outlet
   */
   reinitializeData() {
    this.getHistoryData();
  }

  /**
   * Method that gets orders data based on filter
   */
  getHistoryData() {
    const data = {};
    data['filter'] = {
      order_status: [this.orderStatus]
    }
    data['pagination'] = {
      page_index: this.currentPage - 1,
      page_size: this.pageSize
    }
    if (this.search.value) {
      data['search_text'] = this.search.value;
    }
    if (this.startDate && !this.endDate) {
      this.toasterMsgService.showError('Enter end date');
    }if (!this.startDate && this.endDate) {
      this.toasterMsgService.showError('Enter start date');
    }
    const startDate = moment(this.startDate).format('YYYY-MM-DD');
      const startTime = moment(this.startTime, 'h:mm A').format('HH:mm:ss');
      const endDate = moment(this.endDate).format('YYYY-MM-DD');
      const endTime = moment(this.endTime,'h:mm A').format('HH:mm:ss');
      const startDateTime = new Date(startDate + ' ' + startTime);
      const endDateTime = new Date(endDate + ' ' + endTime);
    if (this.startDate && this.endDate) {
      const endDate = new Date (moment(this.endDate).format('YYYY-MM-DD') + ' ' + '23:59:59');
      data['filter']['duration'] = {
        start_date: this.startTime? moment(startDateTime).unix() : moment(startDate).unix(),
        end_date: this.endTime? moment(endDateTime).unix() : moment(endDate).unix()
      }
    }
    this.subscriptions.push(this.myordersService.getOrdersData(data, localStorage.getItem('childOutletId')).subscribe(res => {
      this.totalOrders = res['result']['total_records'];
      this.ordersList = [];
      for (const i of res['result']['records']) {
        this.ordersList.push(Order.fromJson(i));
      }

    }));
  }

  /**
  * Method that opens order-details modal
  * @param orderId 
  */
  openOrderDetailsModal(orderId: number) {
    this.sharedService.setOrderDetailsModal(true, orderId);
  }

  /**
   * Method that sets value of orderStatus variable and make API call based on that status
   * @param status 
   */
  onOrderStatusButtonClick(status: OrderStatus) {
    if (this.orderStatus !== status) {
      this.orderStatus = status;
      this.resetFilterControls('');
    }
  }

  /**
   * Method that reset filter form fields values and make API call for orders Data
   */
  resetFilterControls(field: string) {
    if (field === 'date') {
      this.startDate = this.endDate = this.startTime = this.endTime = null;
    } else if(field === 'startTime') {
      this.startTime = null;
    } else if(field === 'endTime') {
      this.endTime = null;
    }
    this.currentPage = 1;
    this.search.reset();
    this.getHistoryData();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      if (!subscription.closed) {
        subscription.unsubscribe();
      }
    });
  }
}
