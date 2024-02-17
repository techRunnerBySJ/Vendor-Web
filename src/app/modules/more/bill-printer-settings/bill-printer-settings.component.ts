import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bill-printer-settings',
  templateUrl: './bill-printer-settings.component.html',
  styleUrls: ['./bill-printer-settings.component.scss']
})
export class BillPrinterSettingsComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
  }
 
  /**
   * Method to navigate to the more page.
   */
   navigateToMore() {
    this.router.navigate(['/more']);
  }
}
