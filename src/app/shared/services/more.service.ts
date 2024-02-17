import * as apiUrls from '../../core/apiUrls';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HomeService } from './home.service';
import { apiEndPoints } from '../models';
@Injectable({
  providedIn: 'root',
})
export class MoreService {
  service: string;
  constructor(private http: HttpClient, private homeService: HomeService) {
    this.homeService.service$.subscribe(data => this.service = data);
  }
  /**
   * Method that sends login id, old password and new password for updating password
   * @param loginId
   * @param oldPassword
   * @param newPassword
   * @returns
   */
  updatePassword(oldPassword: string, newPassword: string) {
    const data = {
      old_password: oldPassword,
      password: newPassword,
    };
    return this.http.post(apiUrls.getUpdatePasswordEndPoint, data).pipe(
      map((response) => {
        return response['status'];
      })
    );
  }
  /**
   * Method that sends email id, role, name, phone number for inviting new user
   * @param email
   * @param role
   * @param name
   * @param phone
   * @returns
   */
  inviteNewUser(data: any): Observable<any> {
    return this.http.post(apiUrls.getInviteNewUserEndPoint, data).pipe(
      map((response) => {
        return response['status'];
      })
    );
  }
  /**
   * Method that get all venodor list of the restaurant
   * @returns 
   */
  getOutletUsersDetails(): Observable<any> {
    return this.http.get(apiUrls.getOutletUsersEndPoint).pipe(
      map((response) => {
        return response;
      })
    )
  }
  /**
   * Method that changes the active status of vendor
   * @param loginId 
   * @param data 
   * @returns 
   */
  changeUserStatus(loginId: string, data: any): Observable<any> {
    return this.http.post(apiUrls.postChangeUserActiveStatusEndPoint(loginId), data).pipe(
      map((response) => {
        return response;
      })
    )
  }
  /**
   * Method that updates user details
   * @param loginId 
   * @param data 
   * @returns 
   */
  updateUserDetails(loginId: string, data: any): Observable<any> {
    return this.http.put(apiUrls.putOutletUserEndPoint(loginId), data).pipe(
      map((response) => {
        return response;
      })
    )
  }
  /**
   * Method that deletes user
   * @param loginId 
   * @returns 
   */
  deleteUserDetails(loginId: string): Observable<any> {
    return this.http.delete(apiUrls.deleteOutletUserEndPoint(loginId)).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that gets outlet time slots
   * @returns 
   */
  getOutletSlotDetails(): Observable<any> {
    return this.http.get(apiUrls.getOutletSlotTimeEndPoint(apiEndPoints[this.service])).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that updates outlet time slots
   * @returns 
   */
  putOutletSlotDetails(data: any): Observable<any> {
    return this.http.put(apiUrls.putOutletSlotTimeEndPoint(apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }
}
