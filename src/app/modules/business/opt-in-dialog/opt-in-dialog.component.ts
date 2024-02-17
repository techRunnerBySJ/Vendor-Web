import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { Coupon } from '../model/coupon';

@Component({
  selector: 'app-opt-in-dialog',
  templateUrl: './opt-in-dialog.component.html',
  styleUrls: ['./opt-in-dialog.component.scss']
})
export class OptInDialogComponent implements OnInit {

  minStartDate: Date = new Date();
  minEndDate: Date;
  maxDate: Date;
  custonDurationForm = new FormGroup({
    startDate: new FormControl(),
    startTime: new FormControl(),
    endDate: new FormControl(),
    endTime: new FormControl()
  }, { validators: [this.dateTimeValidator()] })
  constructor(public dialogRef: MatDialogRef<OptInDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Coupon) { dialogRef.disableClose = true; }

  ngOnInit(): void {
    if (new Date(this.data.couponStartTime) > new Date()) this.minStartDate = new Date(this.data.couponStartTime);
    this.minEndDate = this.minStartDate;
    this.maxDate = new Date(this.data.couponEndTime);
  }

  /**
* Method that validates start,end date and time
* @returns 
*/
  dateTimeValidator(): ValidatorFn {
    return (group: FormGroup): ValidationErrors => {
      if (this.custonDurationForm) {
        let startDate = group['controls']['startDate']['value'];
        let startTime = group['controls']['startTime']['value'];
        let endDate = group['controls']['endDate']['value'];
        let endTime = group['controls']['endTime']['value'];
        startDate = moment(startDate).format('YYYY-MM-DD');
        startTime = moment(startTime, 'h:mm A').format('HH:mm:ss');
        const startDateTime = new Date(startDate + ' ' + startTime);

        endDate = moment(endDate).format('YYYY-MM-DD');
        endTime = moment(endTime, 'h:mm A').format('HH:mm:ss');
        const endDateTime = new Date(endDate + ' ' + endTime);

        if (new Date() > startDateTime) {
          group['controls']['startTime'].setErrors({ startTimeMore: true });
        }
        else if (startDateTime > endDateTime) {
          group['controls']['endTime'].setErrors({ endTimeMore: true });
        }
        else {
          group['controls']['startTime'].setErrors(null);
          group['controls']['endTime'].setErrors(null);
        }
        return;
      }
    };
  }

  /**
   * Method that invokes when change in start date
   * @param event 
   */
  onStartDateChange(event: MatDatepickerInputEvent<Date>) {
    this.minEndDate = event.value;
  }
  /**
   * Method that gets invoked when user clicks on confirm button 
   * @returns 
   */
  onConfirm() {
    if (this.custonDurationForm.status === 'INVALID') {
      return;
    }
    const startDate = this.custonDurationForm.get('startDate').value
    const startTime = this.custonDurationForm.get('startTime').value
    const endDate = this.custonDurationForm.get('endDate').value
    const endTime = this.custonDurationForm.get('endTime').value
    if (startDate && startTime && endDate && endTime) {
      let date = moment(startDate).format('YYYY-MM-DD');
      let time = moment(startTime, 'h:mm A').format('HH:mm:ss');
      const startDateTime = new Date(date + ' ' + time);

      date = moment(endDate).format('YYYY-MM-DD');
      time = moment(endTime, 'h:mm A').format('HH:mm:ss');
      const endDateTime = new Date(date + ' ' + time);

      this.dialogRef.close({ flag: true, duration: { epochStartTime: moment(startDateTime).unix(), epochEndTime: moment(endDateTime).unix() } })
    } else {
      this.dialogRef.close({ flag: true })
    }

  }

  /**
   * Method that gets invoked when user clicks on dismiss button 
   */
  onDismiss() {
    this.dialogRef.close({ flag: false })
  }

}
