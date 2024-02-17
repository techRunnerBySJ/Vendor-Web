import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {

  currentRoute: string;
  subscriptionNavLinks = [
    {
      route: 'subscription/plans',
      name: 'Plans'
    },
    {
      route: 'subscription/history',
      name: 'History'
    },
    {
      route: 'subscription/payment',
      name: 'Payment'
    }
  ]
  constructor(private router: Router) { 
    this.router.events.subscribe(data => {
      if (data instanceof NavigationEnd) {
        const url = data.url.split('?')[0];
        this.currentRoute = url.substring(1);
      }
    })
  }

  ngOnInit(): void {
  }

  /**
   * Method that navigates to subscription routes
   * @param link 
   */
  navigateToSubscriptionRoutes(link: string) {
    this.router.navigate([link]);
  }
}
