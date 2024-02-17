import { Component, Input } from '@angular/core';
import {
  AbstractControl,
  AbstractControlDirective,
  FormControl,
} from '@angular/forms';

@Component({
  selector: 'app-form-error-msg',
  template: `
    <ul *ngIf="shouldShowErrors()">
      <li style="color: red;" *ngFor="let error of listOfErrors(); let i = index">
      <span *ngIf="i < 1">{{ error }} </span>
      </li>
    </ul>
  `,
})
export class FormErrorMsgComponent {
  @Input('controls') controls: FormControl;
  @Input() private control: AbstractControlDirective | AbstractControl;

  /**
   * Method that shows validation messages
   */
  private static readonly errorMessages = {
    required: () => '* This field is required',
    pattern: (params) => '* Entered value is Invalid. ',
    maxlength: (params) =>
      '* Enter maximun ' + params.requiredLength + ' characters.',
    minlength: (params) =>
      '* Enter minimum ' + params.requiredLength + ' characters.',
    openingTimeMore: () =>
      '* Opening hours can not be greater than closing hours.',
    email: () => '* Please enter valid email address',
    passwordMismatch: () => '* Password is mismatched',
    minMaxSelection: () => '* Select correct min,max limit',
    dateTime: () => '* End time is less than current time',
    defaultVariant: () => '* 1 variant should be default in each variant group',
    maxUseCount: () => '* max use count should be between 1 and 20',
    max: (params) => '* Enter value upto ' + params.max,
    startTimeMore: () => '* Start date and time should be greater than current time',
    endTimeMore: () => '* End date and time should be greater than start date and time',
    itemPackagingCharges: () => '* Enter packaging charges as per slab',
    matDatepickerMin: () => 'Invalid Date selected',
    matDatepickerMax: () => 'Invalid Date selected'
  };

  /**
   * Method that should show errors
   * @returns boolean
   */
  shouldShowErrors(): boolean {
    return (
      this.control &&
      this.control.errors &&
      (this.control.dirty || this.control.touched)
    );
  }

  /**
   * Method that holds list of errors
   * @returns string[]
   */
  listOfErrors(): string[] {
    return Object.keys(this.control.errors).map((field) =>
      this.getMessage(field, this.control.errors[field])
    );
  }

  /**
   * Method that gets the error messages
   * @param type
   * @param params
   * @returns FormErrorMsgComponent.errorMessages[type](params)
   */
  private getMessage(type: string, params: any) {
    return FormErrorMsgComponent.errorMessages[type](params);
  }
}
