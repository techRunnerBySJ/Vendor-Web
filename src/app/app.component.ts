import { LinearLoaderService } from './shared/components/linear-loader/linear-loader.service';
import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { HomeService } from './shared/services/home.service';
import { Outlet } from './modules/home/model/home';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Angular-Starter';
  showLoader = false;
  isDesktopScreen: boolean = true;
  outletDetails: Outlet;
  subscriptions: Subscription[] = [];
  constructor(private progressBar: LinearLoaderService, private router: Router,
    private activatedRoute: ActivatedRoute, private titleService: Title, private homeService: HomeService) { }
  ngOnInit(): void {
    window.innerWidth <= 1024 ? (this.isDesktopScreen = false) : (this.isDesktopScreen = true);

    this.subscriptions.push(this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.setDynamicTitle();
      }
    }));

    this.subscriptions.push(this.homeService.outletDetails$.subscribe(data => {
      this.outletDetails = data?.get('primaryOutlet');
      if (this.outletDetails) {
        this.setDynamicTitle(); //calling this method again to add outlet name in title when this observable emits data
      }
    }));
  }

  /**
   * Method that sets dynamic title based on current route
   */
  setDynamicTitle() {
    const ar: ActivatedRoute = this.getChild(this.activatedRoute);
    const title = this.outletDetails ? `${this.outletDetails.name} | ${ar.snapshot.data.title}` : ar.snapshot.data.title;
    this.titleService.setTitle(title);
  }

  /**
   * Method that returns last child of active route
   * @param activatedRoute 
   * @returns 
   */
  getChild(activatedRoute: ActivatedRoute) {
    if (activatedRoute.firstChild) return this.getChild(activatedRoute.firstChild);

    return activatedRoute;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    window.innerWidth <= 1024
      ? (this.isDesktopScreen = false)
      : (this.isDesktopScreen = true);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subcription => {
      if (!subcription.closed) {
        subcription.unsubscribe();
      }
    });
  }
}
