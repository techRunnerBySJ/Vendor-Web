import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CancellationPolicy, CancellationReason } from 'src/app/modules/my-orders/model/order';
import * as apiUrls from '../../core/apiUrls'
import { apiEndPoints } from '../models/constants/constant.type';
import { HomeService } from './home.service';
@Injectable({
  providedIn: 'root'
})
export class MyOrdersService {
  service: string;
  cancellationReasons: CancellationReason[]; // for cancelling order in reject-order-dialog
  cancellationPolicy: CancellationPolicy; // for cancelling order in reject-order-dialog
  billType: string;
  constructor(private http: HttpClient, private homeService: HomeService) { 
    this.homeService.service$.subscribe(data => this.service = data);
  }
  /**
   * Method that makes API call to fetch orders data based on parameter passed
   * @param data 
   * @returns 
   */
  getOrdersData(data: any, childOutletId?: string): Observable<any> {
    const headers = new HttpHeaders({
      child_outlet_id: childOutletId || ''
    });
    return this.http.post(apiUrls.postOrderFilterEndPoint(apiEndPoints[this.service]), data, { headers }).pipe(
      map((response) => {
        return response;
      })
    )
  }
  /**
   * Method that makes API call to fetch order details
   * of passed orderId in parameter
   * @param orderId 
   * @returns 
   */
  getOrderDetailsById(orderId: number): Observable<any> {
    const headers = new HttpHeaders({
      ignore_child_outletId: 'true',
    });
    return this.http.get(apiUrls.getOrderByIdEndPoint(orderId, apiEndPoints[this.service]), { headers }).pipe(
      map((response) => {
        return response;
      })
    )
  }
  /**
   * Method that sends accept/reject status of order by vendor
   * @param orderId 
   * @param data 
   * @returns 
   */
  sendOrderAcceptanceStatus(orderId: number, data: any): Observable<any> {
    const headers = new HttpHeaders({
      ignore_child_outletId: 'true',
    });
    return this.http.post(apiUrls.postOrderAcceptanceStatusEndPoint(orderId, apiEndPoints[this.service]), data, { headers }).pipe(
      map((response) => {
        return response;
      })
    )
  }
  /**
   * Method that sends order ready status
   * @param orderId 
   * @param data 
   * @returns 
   */
  sendOrderReadyStatus(orderId: number): Observable<any> {
    const headers = new HttpHeaders({
      ignore_child_outletId: 'true',
    });
    return this.http.post(apiUrls.postOrderReadyStatusEndPoint(orderId, apiEndPoints[this.service]), {}, { headers }).pipe(
      map((response) => {
        return response;
      })
    )
  }
  /**
   * Method that cancels order after vendor has accepted it
   * @param orderId 
   * @param data 
   * @returns 
   */
  postCancelOrder(orderId: number, data: any): Observable<any> {
    const headers = new HttpHeaders({
      ignore_child_outletId: 'true',
    });
    return this.http.post(apiUrls.postCancelOrderEndPoint(orderId, apiEndPoints[this.service]), data, { headers }).pipe(
      map((response) => {
        return response;
      })
    )
  }
  /**
   * Method that get cancellation reasons for vendor
   * @param id 
   * @returns 
   */
   getCancellationReasons(): Observable<any> {
    return this.http.get(apiUrls.getCancellationReasonsEndPoint(apiEndPoints[this.service])).pipe(
      map((response) => {
        this.cancellationPolicy = CancellationPolicy.fromJson(response['result']['cancellation_policy']);
        this.cancellationReasons = [];
        for (const i of response['result']['reasons']) {
          this.cancellationReasons.push(CancellationReason.fromJson(i));
        }
      })
    )
  }

  /**
   * Method that get sponsored rider orders
   * @returns response
   */
  getSponsoredRiderOrders(): Observable<any> {
    return this.http.get(apiUrls.getSponsoredRiderOrdersEndPoint(apiEndPoints[this.service])).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that get available sponsored riders
   * @param orderId 
   * @returns response
   */
  getSponsoredAvailableRiders(orderId: string): Observable<any> {
    return this.http.get(apiUrls.getSponsoredAvailableRidersEndPont(apiEndPoints[this.service], orderId)).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that assign order to sponsored rider
   * @param orderId 
   * @param data 
   * @returns response
   */
  postAssignOrderToSponsoredRider(orderId: string, data: any): Observable<any> {
    return this.http.post(apiUrls.postAssignOrderToSponsoredRiderEndPoint(apiEndPoints[this.service], orderId),data).pipe(
      map((response) => {
        return response
      })
    )
  }

  /**
   * Method that surrender sponsored rider
   * @param orderId 
   * @param data 
   * @returns response
   */
  postSurrenderSponsoredOrder(orderId: string, data: any): Observable<any> {
    return this.http.post(apiUrls.postSurrenderSponsoredOrderEndPoint(apiEndPoints[this.service], orderId),data).pipe(
      map((response) => {
        return response
      })
    )
  }

  /**
   * Method that remove rider from order
   * @param orderId 
   * @param data 
   * @returns response
   */
  postRemoveSponsoredRiderEndPoint(orderId: string, data: any): Observable<any> {
    return this.http.post(apiUrls.postRemoveSponsoredRiderEndPoint(apiEndPoints[this.service], orderId), data).pipe(
      map((response) => {
        return response;
      })
    )
  }
}
