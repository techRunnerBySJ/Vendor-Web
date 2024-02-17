import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { apiEndPoints } from '../models';
import * as apiUrls from '../../core/apiUrls';
import { HomeService } from './home.service';
import { MenuItemsInMenu } from 'src/app/modules/inquiry-orders/model/inquiry-orders';

@Injectable({
  providedIn: 'root'
})
export class InquiryOrderService {

  service: string;
  addNewSelectedItemsDetails: MenuItemsInMenu[] =[];
  newsItemsToAdd: MenuItemsInMenu[] =[];
  constructor(private http: HttpClient, private homeService: HomeService) { 
    this.homeService.service$.subscribe(data => this.service = data);
  }

  /**
   * Method that gets all the inquiry orders
   * @param data 
   * @returns response
   */
  postInquiryOrdersFilter(data: any): Observable<any>{
    return this.http.post(apiUrls.postInquiryFilterOrdersEndPoint(apiEndPoints[this.service]),data).pipe(
      map(response =>{
        return response;
      })
    )
  }

  /**
   * Method that get inquiry order details
   * @returns response
   */
  getInquiryOrdersDetails(inquiryOrderId: number): Observable<any> {
    return this.http.get(apiUrls.getInquiryOrderDetailsEndPoint(apiEndPoints[this.service], inquiryOrderId)).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that edit and sends inquiry order details
   * @param inquiryOrderId 
   * @param data 
   * @returns response
   */
  putInquiryOrdersDetails(inquiryOrderId: number, data: any): Observable<any>{
    return this.http.put(apiUrls.putInquiryOrderDetailsEndPoint(apiEndPoints[this.service], inquiryOrderId), data).pipe(
      map((response) => {
        return response;
      })
      )
  }

  /**
   * Method that get menu by master category id for selecting alternatives in inquiry order details
   * @param data 
   * @returns response
   */
  getMenuByMasterCategoryIdForSelectingAlternatives(data: any): Observable<any>{
    return this.http.post(apiUrls.postGetItemsBySearch(apiEndPoints[this.service]), data).pipe(
      map((response) =>{
        return response;
      })
    );
  }
  removeSelectedItemDetails(item: any): void {
    const index = this.addNewSelectedItemsDetails.findIndex(selectedItem => selectedItem.itemId === item.menu_item_id);
    if (index !== -1) {
        this.addNewSelectedItemsDetails.splice(index, 1);
    }
}
}


