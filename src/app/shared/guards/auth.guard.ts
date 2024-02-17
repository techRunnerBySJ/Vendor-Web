import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { HomeService } from '../services/home.service';
import jwt_decode from 'jwt-decode';
import { Services, allowedRouteAccessTo } from '../models/constants/constant.type';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  currentUrl: string;
  forceResetPassword: boolean;
  constructor(private router: Router, private homeService: HomeService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    this.currentUrl = state.url;
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwt_decode(token);
      this.homeService.role = decoded['data']['role'];
      this.homeService.service$.next(decoded['data']['type']);
      this.forceResetPassword = decoded['data']['force_reset_password'];
      sessionStorage.setItem('service', this.homeService.service);
    }
    if (!token && this.currentUrl !== '/login') {
      this.router.navigate(['login']);
      return false;
    }
    else if (token && this.forceResetPassword && this.currentUrl !== '/change-password') {
      this.router.navigate(['change-password']);
      return false;
    } 
    else if (token && (this.currentUrl === '/login' || this.currentUrl === '/') && this.homeService.service !== Services.Grocery) {
      this.router.navigate(['my-orders']);
      return false;
    }
    else if (token && (this.currentUrl === '/login' || this.currentUrl === '/') && this.homeService.service === Services.Grocery) {
      this.router.navigate(['grocery-orders']);
      return false;
    }
    else if (token && !allowedRouteAccessTo[this.processUrl(this.currentUrl)].role.includes(this.homeService.role)
      && !allowedRouteAccessTo[this.processUrl(this.currentUrl)].service.includes(this.homeService.service as Services)) {
      this.homeService.service !== Services.Grocery? this.router.navigate(['my-orders']) : this.router.navigate(['grocery-orders']);
      return false;
    }

    return true;
  }

  /**
   * Method that return url after removing dynamic routing from it
   * @param url
   * @returns
   */
  processUrl(url: string) {
    url = url.split('?')[0];
    if (allowedRouteAccessTo[url]) return url;

    return url.substring(0, url.lastIndexOf('/'));
  }
  
  //   /**
  //  * Method that returns true if the current route is allowed based on the allowedRouteAccess.
  //  */
  //   isRouteAllowed(): boolean {
  //     const routeAccess = allowedRouteAccessTo[this.processUrl(this.currentUrl)];
  //     if (!routeAccess) {
  //       return false;
  //     }
  //     return routeAccess.role.includes(this.homeService.role) && routeAccess.service.includes(this.homeService.service as Services);
  //   }
}
