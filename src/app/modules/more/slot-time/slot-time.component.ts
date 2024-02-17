import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { skip } from 'rxjs/operators';
import { originalOrder } from 'src/app/shared/functions/modular.functions';
import { HomeService } from 'src/app/shared/services/home.service';
import { MoreService } from 'src/app/shared/services/more.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { OutletSlot, SlotNames, TimeSlotTypes, TimeSlotTypesList } from '../model/time-slot';

@Component({
  selector: 'app-slot-time',
  templateUrl: './slot-time.component.html',
  styleUrls: ['./slot-time.component.scss']
})
export class SlotTimeComponent implements OnInit, OnDestroy {

  outletSlots: OutletSlot;
  days: Map<SlotNames, string> = new Map<SlotNames, string>()
  showDayTypeHeading: boolean;
  subscriptions: Subscription[] = [];
  readonly timeSlotTypesList = TimeSlotTypesList;

  slotsForm = new FormGroup({
    slotType: new FormControl(null, [Validators.required]),
    slotDays: new FormGroup({}) // will add form arrays dynamically based on slotType selection
  })

  readonly originalOrder = originalOrder;
  constructor(private toastMsgService: ToastService, private moreService: MoreService, private formBuilder: FormBuilder,
    private homeService: HomeService, private sharedService: SharedService) { }

  ngOnInit(): void {
    this.getOutletSlots();

    this.subscriptions.push(
      this.sharedService.resetData$.pipe(skip(1)).subscribe(flag => {
        if (flag) this.reinitializeData();
      })
    )
  }

  /**
   * Method that will invokes when user changes 
   * outlet from home-component and it will recalls 
   * methods to update data for the selected outlet
   */
   reinitializeData() {
    this.getOutletSlots();
  }

  /**
   * Method that gets outlet's slot details
   */
  getOutletSlots() {
    this.moreService.getOutletSlotDetails().subscribe(res => {
      this.outletSlots = OutletSlot.fromJson(res['result']);
      this.fillupForm();
    })
  }

  /**
   * Method that invokes on slot type selection change
   * @param slotType 
   */
  slotTypeSelectionChange(slotType: TimeSlotTypes) {
    const fg = this.slotsForm.get('slotDays') as FormGroup;
    for (const slotName of this.days.keys()) {
      fg.removeControl(slotName);
    }
    if (slotType === 'all') {
      this.days = new Map([
        ['all', 'alldays']
      ]);
      this.showDayTypeHeading = false;
    } else if (slotType === 'weekdays_and_weekends') {
      this.days = new Map([
        ['weekdays', 'weekdays'],
        ['weekends', 'weekend']
      ]);
      this.showDayTypeHeading = true;
    } else {
      this.days = new Map([
        ['mon', 'monday'],
        ['tue', 'tuesday'],
        ['wed', 'wednesday'],
        ['thu', 'thursday'],
        ['fri', 'friday'],
        ['sat', 'saturday'],
        ['sun', 'sunday']
      ]);
      this.showDayTypeHeading = true;
    }
    this.createSlotControls();
  }

  /**
   * Method that returns formgroup with 2 formControls
   * @returns 
   */
  initSlot() {
    return this.formBuilder.group({
      openingHours: new FormControl(),
      closingHours: new FormControl(),
    }, { validators: [this.customTimeValidator] })
  }

  /**
   * Method that creates form arrays based on slotType selection
   */
  createSlotControls() {
    const fg = this.slotsForm.get('slotDays') as FormGroup;
    for (const slotName of this.days.keys()) {
      fg.addControl(slotName, this.formBuilder.array([this.initSlot()]))
    }
  }

  /**
   * Method that adds formGroup of slot in a particular formArray
   * @param event 
   */
  addSlot(event: SlotNames) {
    const arr = this.getFormArray(event);
    if (arr.controls.length < 3) {
      arr.push(this.initSlot())
    }
  }

  /**
   * Method that delete time slot based on parameter
   * @param event 
   * @param index 
   */
  deleteSlot(event: SlotNames, index: number) {
    const arr = this.getFormArray(event);
    if (arr.controls.length > 1) {
      arr.removeAt(index);
    }
  }

  /**
   * Metohd that updates time slots
   */
  saveSlotChanges() {
    if (this.customValidatorForAllSlots()) {
      const formValues = this.slotsForm.getRawValue() as OutletSlot;
      const data: OutletSlot = new OutletSlot();
      Object.assign(data, formValues);
      this.moreService.putOutletSlotDetails(data.toJson()).subscribe(res => {
        this.outletSlots = OutletSlot.fromJson(res['result']);
        this.fillupForm();

        this.homeService.getOutletDetails(localStorage.getItem('childOutletId')).subscribe(); // to update 'online' status in header after updating the slots
      })
    }
  }

  /**
   * Method that undo changes made in form
   */
  clearSlotChanges() {
    this.fillupForm();
  }

  /**
   * Method that assignes values of outlet's slot details to form
   */
  fillupForm() {
    this.slotsForm['controls']['slotType'].setValue(this.outletSlots.slotType);
    this.slotTypeSelectionChange(this.outletSlots.slotType);

    for (const slotName of this.days.keys()) {
      const formArray = this.getFormArray(slotName);
      formArray.clear();
    }
    this.outletSlots.timeSlots.forEach(slot => {
      const formArray = this.getFormArray(slot['slotName']);
      this.addSlot(slot['slotName']);
      formArray.at(formArray.length - 1).patchValue({ ...slot });
    })

    this.slotsForm.disable();
  }

  /**
   * Method that enables form for editing
   */
  editForm() {
    this.slotsForm.enable();
  }

  /**
   * Method that checks if slot is available in formarray
   * @param event 
   * @returns 
   */
  checkSlotControlExistInArray(event: SlotNames) {
    const arr = this.getFormArray(event);
    return arr.length;
  }

  /**
   * Method that returns formArray based on parameter passed
   * @param event 
   * @returns 
   */
  getFormArray(event: SlotNames) {
    return this.slotsForm['controls']['slotDays']['controls'][event] as FormArray
  }

  /**
   * 
   * @param fg Method that validates opening and closing time
   */
  customTimeValidator(fg: AbstractControl) {
    if (fg['controls']['openingHours']['value'] && fg['controls']['closingHours']['value']) {
      let openingTime = moment(fg['controls']['openingHours']['value'], 'h:mm a').format('HH:mm');
      let closingTime = moment(fg['controls']['closingHours']['value'], 'h:mm a').format('HH:mm');

      if (openingTime >= closingTime) {
        fg['controls']['openingHours'].setErrors({ ...{ 'openingTimeMore': true } })
      } else {
        fg['controls']['openingHours'].setErrors(null)
      }
    }
  }

  /**
  * Method that validates all slots of opening and closing hours
  * @returns boolean
  */
  customValidatorForAllSlots() {
    for (const slotName of this.days.keys()) {
      const arr = this.getFormArray(slotName);
      for (let i = 0; i < arr['controls'].length - 1; i++) {
        const nextSlotOpeningHours = moment(arr['controls'][i + 1]['controls']['openingHours']['value'], 'h:mm a').format('HH:mm');
        const currentSlotClosingHours = moment(arr['controls'][i]['controls']['closingHours']['value'], 'h:mm a').format('HH:mm');
        // if (nextSlotOpeningHours && currentSlotClosingHours && (nextSlotOpeningHours <= currentSlotClosingHours)) {
        //   this.toastMsgService.showError('Opening hours in each slot should be greater than closing hour in previous slot')
        //   return false;
        // }
      }
    }
    return true;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      if (!subscription.closed) {
        subscription.unsubscribe();
      }
    });
  }
}
