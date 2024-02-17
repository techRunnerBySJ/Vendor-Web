import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HomeService } from './home.service';
import * as apiUrls from '../../core/apiUrls';
import { apiEndPoints } from '../models';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  service: string;
  constructor(private http: HttpClient, private homeService: HomeService) {
    this.homeService.service$.subscribe(data => this.service = data);
  }
  /**
 * Method that filters all subscription plans
 * @param data 
 * @returns 
 */
   filterSubscriptionPlans(): Observable<any> {
    return this.http.post(apiUrls.postFilterSubscriptionPlansEndPoint(apiEndPoints[this.service]), {}).pipe(
      map((response) => {
        return response;
      })
    )
  }
  /**
   * Method that filters subscriptions of the outlet based on filter params
   * @param data 
   * @returns 
   */
  filterSubscriptions(data: any): Observable<any> {
    return this.http.post(apiUrls.postFilterSubcriptionsEndPoint(apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }
  /**
   * Method that creates new subscription for the outlet
   * @param data 
   * @returns 
   */
  createSubscription(data: any): Observable<any> {
    return this.http.post(apiUrls.postSubscriptionEndPoint(apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }
  /**
   * Method that cancel existing subscription
   * @param subscriptionId 
   * @param data 
   * @returns 
   */
  cancelSubscription(subscriptionId: string, data: any): Observable<any> {
    return this.http.post(apiUrls.postCancelSubscriptionEndPoint(subscriptionId, apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }
  /**
   * Method that filters subscription payment based on filter params
   * @param data 
   * @returns 
   */
  filterSubscriptionPayment(data: any): Observable<any> {
    return this.http.post(apiUrls.postFilterSubscriptionPaymentEndPoint(apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }
   /**
   * Method that retry payment for any subscription that is on hold
   * @param subscriptionId 
   * @param data 
   * @returns 
   */
   retrySubscriptionPayment(subscriptionId: string, data: any): Observable<any> {
    return this.http.post(apiUrls.postRetrySubscriptionPaymentByIdEndPoint(subscriptionId, apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }
}
