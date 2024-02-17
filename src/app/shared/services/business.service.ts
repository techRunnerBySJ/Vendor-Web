import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as apiUrls from 'src/app/core/apiUrls';
import { HomeService } from './home.service';
import { apiEndPoints } from '../models/constants/constant.type';

@Injectable({
  providedIn: 'root',
})
export class BusinessService {
  service: string;
  constructor(private http: HttpClient, private homeService: HomeService) {
    this.homeService.service$.subscribe((data) => (this.service = data));
  }

  /**
   * Method that makes API call to create new coupon
   * @param data
   * @returns
   */
  createCoupon(data: any): Observable<any> {
    return this.http
      .post(apiUrls.postCouponEndPoint(apiEndPoints[this.service]), data)
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  /**
   * Method that gets ongoing/active coupons of restaurant
   * @returns
   */
  getOngoingCoupons(): Observable<any> {
    return this.http
      .get(apiUrls.getOngoingCouponsEndPoint(apiEndPoints[this.service]))
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  /**
   * Method that gets new-avalaible coupons for restaurant to opt-in
   * @returns
   */
  getNewAvailableCoupons(): Observable<any> {
    return this.http
      .get(apiUrls.getNewAvailableCouponsEndPoint(apiEndPoints[this.service]))
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  /**
   * Method that maps restaurant to particular coupon
   * @param data
   * @returns
   */
  postRestaurantOptin(data: any): Observable<any> {
    return this.http
      .post(
        apiUrls.postRestaurantOptinEndPoint(apiEndPoints[this.service]),
        data
      )
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  /**
   * Method that removes mapping of restaurant to particular coupon
   * @param data
   * @returns
   */
  postRestaurantOptout(data: any): Observable<any> {
    return this.http
      .post(
        apiUrls.postRestaurantOptoutEndPoint(apiEndPoints[this.service]),
        data
      )
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  /**
   * Method that gets active, expire, upcoming coupons data
   * @returns
   */
  getAllCoupons(): Observable<any> {
    return this.http
      .get(apiUrls.getAllCouponsEndPoint(apiEndPoints[this.service]))
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  /**
   * Method that put coupons sequence
   * @param data 
   * @returns 
   */
  toChangeDiscountSequence(data: any): Observable<any> {
    return this.http.put(apiUrls.putDiscountSequenceEndPoint(apiEndPoints[this.service]),
      data).pipe(map((response) => {
        return response;
      }));
  }

  // Payout APIs

  /**
   * Method that gets all bank account details of vendor
   * @returns
   */
  getPayoutAccounts(): Observable<any> {
    return this.http
      .get(apiUrls.getPayoutAccountsDetailsEndPoint(apiEndPoints[this.service]))
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  /**
   * Method that adds new account details
   * @param data
   * @returns
   */
  postPayoutAccount(data: any): Observable<any> {
    return this.http
      .post(apiUrls.postPayoutAccountEndPoint(apiEndPoints[this.service]), data)
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  /**
   * Method that gets bank account details of particular accountid
   * @param payoutAccountId
   * @returns
   */
  getPayoutAccountDetailsById(payoutAccountId: string): Observable<any> {
    return this.http
      .get(
        apiUrls.getPayoutAccountDetailsByIdEndPoint(
          payoutAccountId,
          apiEndPoints[this.service]
        )
      )
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  /**
   * Method that deletes bank account
   * @param payoutAccountId
   * @returns
   */
  deletePayoutAccountDetailsById(payoutAccountId: string): Observable<any> {
    return this.http
      .delete(
        apiUrls.deletePayoutAccountDetailsByIdEndPoint(
          payoutAccountId,
          apiEndPoints[this.service]
        )
      )
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  /**
   * Method that verifies IFSC Code of bank account
   * @param payoutAccountId
   * @param ifscCode
   * @returns
   */
  verifyPayoutAccountIfscCode(
    payoutAccountId: string,
    ifscCode
  ): Observable<any> {
    const data = { ifsc_code: ifscCode };
    return this.http
      .put(
        apiUrls.putVerifyPayoutAccountIfscCodeByIdEndPoint(
          payoutAccountId,
          apiEndPoints[this.service]
        ),
        data
      )
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  /**
   * Method that makes particular bank account as primary
   * @param payoutAccountId
   * @returns
   */
  makePrimaryPayoutAccount(payoutAccountId: string): Observable<any> {
    return this.http
      .put(
        apiUrls.putMakePrimaryPayoutAccountByIdEndPoint(
          payoutAccountId,
          apiEndPoints[this.service]
        ),
        {}
      )
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  /**
   * Method that filters payouts data based on parameters passes
   * @param data
   * @returns API Response
   */
  getPayoutsData(data: any): Observable<any> {
    return this.http
      .post(apiUrls.postFilterPayoutsEndPoint(apiEndPoints[this.service]), data)
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  /**
   * Method that filters payout summary of restaurant based on parameter passed
   * @param data
   * @returns API Response
   */
  getPayoutSummary(data: any): Observable<any> {
    return this.http
      .post(
        apiUrls.postFilterPayoutSummaryEndPoint(apiEndPoints[this.service]),
        data
      )
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  /**
   * Method that get payout details by Id
   * @param payoutId
   * @returns
   */
  getPayoutDetailsById(payoutId: string): Observable<any> {
    return this.http
      .get(
        apiUrls.getPayoutDetailsByIdEndPoint(
          payoutId,
          apiEndPoints[this.service]
        )
      )
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  // Customer Reviews
  /**
   * Method that gets customer reviews
   * @param data
   * @returns
   */
  getCustomerReviews(data: any): Observable<any> {
    return this.http
      .post(
        apiUrls.postFilterRestaurantReviewsEndPoint(apiEndPoints[this.service]),
        data
      )
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  // Sales Report

  /**
   * Method that gets sales report of outlet
   * @param data
   * @returns
   */
  getSalesReport(data: any): Observable<any> {
    return this.http
      .post(
        apiUrls.postFilterSalesReportEndPoint(apiEndPoints[this.service]),
        data
      )
      .pipe(
        map((response) => {
          return response;
        })
      );
  }
}
