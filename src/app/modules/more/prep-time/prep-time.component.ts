import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HomeService } from 'src/app/shared/services/home.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-prep-time',
  templateUrl: './prep-time.component.html',
  styleUrls: ['./prep-time.component.scss']
})
export class PrepTimeComponent implements OnInit, OnDestroy {

  @Input() prepTime: number;
  isEdit: boolean = false;
  updatedPrepTime: number;
  subscriptions: Subscription[] = [];
  showPrepTimeModal: boolean = true;

  constructor(private router: Router, private homeService: HomeService, private toastMsgService: ToastService) { }

  ngOnInit(): void {
    
  }

  /**
   * Method to navigate to the more page.
   */
  navigateToMore() {
    this.router.navigate(['/more']);
  }

  /**
   * Method that edit preparation time
   * @returns 
   */
  editPrepTime() {
    if (!this.updatedPrepTime) return this.toastMsgService.showError('Enter Preparation Time');
    if (this.updatedPrepTime < 5) return this.toastMsgService.showError('Preparation Time should not be less than 5 mins');
    const data = { default_preparation_time: this.updatedPrepTime }
    this.subscriptions.push(this.homeService.updateOutletDetails(data).subscribe(res => {
      this.prepTime = this.updatedPrepTime;
      this.isEdit = false;
      const defaultPrepTime = res['result']['default_preparation_time'];
      const key = localStorage.getItem('childOutletId') || 'primaryOutlet';
      const val = { ...this.homeService.outletDetails.get(key), defaultPrepTime }
      this.homeService.outletDetails.set(key, val);
      this.homeService.outletDetails$.next(this.homeService.outletDetails);
      this.toastMsgService.showSuccess('Preparation Time updated successfully');
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      if (!subscription.closed) {
        subscription.unsubscribe();
      }
    })
  }

  togglePrepTimeModal() {
    this.showPrepTimeModal = !this.showPrepTimeModal;
  }
}
