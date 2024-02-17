import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-riders',
  templateUrl: './riders.component.html',
  styleUrls: ['./riders.component.scss'],
})
export class RidersComponent implements OnInit {
  addRiders: boolean = false;
  constructor(private router: Router) {}

  ngOnInit(): void {}

  /**
   * Method to navigate to the more page.
   */
  navigateToMore() {
    this.router.navigate(['/more']);
  }

  /**
   * Method to open add riders modal.
   */
  openAddRidersModal() {
    this.addRiders = true;
  }

  /**
   * Method to close add riders modal.
   */
  closeAddRidersModal() {
    this.addRiders = false;
  }
}
