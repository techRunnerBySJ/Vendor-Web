import { Component, EventEmitter, HostListener, Injectable, Input, OnDestroy, OnInit, Output, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { MessageDialogComponent } from 'src/app/shared/components/message-dialog/message-dialog.component';
import { ToastService } from 'src/app/shared/services/toast.service';
import { MenuService } from 'src/app/shared/services/menu.service';
import { Addon, AddonGroup, FoodTypes } from '../model/menu';
import { originalOrder } from 'src/app/shared/functions/modular.functions';
import { HomeService } from 'src/app/shared/services/home.service';
import { Outlet } from '../../home/model/home';

@Component({
  selector: 'app-add-new-add-on',
  templateUrl: './add-new-add-on.component.html',
  styleUrls: ['./add-new-add-on.component.scss'],
})

export class AddNewAddOnComponent implements OnInit, OnDestroy {
  showAddNewAddOnModal: boolean;
  isAddAddon: boolean;
  addonGroupList: AddonGroup[] = [];
  addonActionForm = new FormGroup({
    addonGroupId: new FormControl('', [Validators.required]),
    addonId: new FormControl({ disabled: true, value: '' }),
    addonName: new FormControl('', [Validators.required]),
    foodType: new FormControl(null, [Validators.required]),
    addonPrice: new FormControl('', [Validators.required]),
    isGstInclusive: new FormControl(null, [Validators.required]),
    gst: new FormControl('', [Validators.required]),
  });

  readonly foodTypes = FoodTypes;
  readonly originalOrder = originalOrder;
  flags = [
    { id: true, name: 'Yes' },
    { id: false, name: 'No' },
  ];

  subscriptions: Subscription[] = [];
  @Input() modalData: any;
  @Output() closeModal = new EventEmitter<any>();
  outletDetails: Outlet;
  constructor(private dialog: MatDialog, private menuService: MenuService, private renderer: Renderer2, private toastMsgService: ToastService, private homeService: HomeService) { }

  ngOnInit(): void {
    this.homeService.outletDetails$.subscribe(data => {
      this.outletDetails = data.get('primaryOutlet');
      if(this.outletDetails.gstCategory === 'hybrid'){
        this.addonActionForm['controls']['gst'].enable();
      }
    });
    this.subscriptions.push(this.menuService.addonGroupList$.subscribe(data => this.addonGroupList = data));
    if (this.modalData.actionType === 'ADD') {
      this.isAddAddon = true;
      this.addonActionForm.patchValue({
        addonGroupId: this.modalData.addonGroupId,
      });
    } else if (this.modalData.actionType === 'EDIT' || this.modalData.actionType === 'VIEW') {
      this.isAddAddon = false;
      this.addonActionForm.patchValue({
        addonGroupId: this.modalData.addonGroupId,
        addonId: this.modalData.addon.addonId,
        addonName: this.modalData.addon.addonName,
        foodType: this.modalData.addon.foodType,
        addonPrice: this.modalData.addon.addonPrice,
        isGstInclusive: this.modalData.addon.isGstInclusive,
        gst: this.modalData.addon.gst,
      })
      if (this.addonActionForm.get('isGstInclusive').value) {
        this.addonActionForm.get('gst').disable();
      }
      if (this.modalData.disableAll) {
        this.addonActionForm.disable();
      }
    }
    this.renderer.addClass(document.body, 'overlay-enabled');
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(document.body, 'overlay-enabled');
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  /**
   * Method that warns user in case of unsaved data and then emits event to toggle modal
   * @returns 
   */
  close() {
    if (this.addonActionForm.dirty) {
      this.renderer.removeClass(document.body, 'overlay-enabled');
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        data: {
          message: 'Unsaved data will be lost. Do you still want to continue?',
          confirmBtnText: 'OK',
          dismissBtnText: 'Cancel'
        }
      });

      dialogRef.afterClosed().subscribe(res => {
        this.renderer.addClass(document.body, 'overlay-enabled');
        if (res) {
          this.closeModal.emit();
        }
      });
      return;
    }
    this.closeModal.emit();
  }

  /**
   * Method that submits addon
   * @returns 
   */
  submitAddon() {
    if (this.addonActionForm.status === 'INVALID') {
      this.addonActionForm.markAllAsTouched();
      return;
    }
    const data: Addon = new Addon();
    const formValues = this.addonActionForm.getRawValue();
    Object.assign(data, formValues);

    if (this.isAddAddon) {
      this.subscriptions.push(this.menuService.addAddon(data.toJson()).subscribe(res => {
        this.closeModal.emit('close');
        this.toastMsgService.showSuccess(`Addon: ${res['result']['name']} added successfully`);
      }));
    } else {
      this.subscriptions.push(this.menuService.editAddon(data['addonId'], data.toJson()).subscribe(res => {
        this.closeModal.emit('close');
        this.toastMsgService.showSuccess(`Addon: ${res['result']['name']} updated successfully`);
      }));
    }
  }

  /**
   * Method that enable/disable and set value of gst field
   * based on selection
   */
  gstSelectionChange() {
    if (this.addonActionForm.get('isGstInclusive').value) {
      this.addonActionForm.get('gst').setValue(0);
      this.addonActionForm.get('gst').disable();
    } else {
      if (this.outletDetails.gstCategory === 'restaurant') {
        this.addonActionForm.get('gst').setValue('5');
      }
      if (this.outletDetails.gstCategory === 'non_restaurant') {
        this.addonActionForm.get('gst').setValue('18');
      }
      else {
        this.addonActionForm.get('gst').setValue('');
      }
      this.addonActionForm.get('gst').enable();
    }

    // if (this.addonActionForm.get('isGstInclusive').value) {
    //   this.addonActionForm.get('gst').setValue(0);
    // }else {
    //   this.addonActionForm.get('gst').setValue(5);
    // }
  }

  /**
   * Method that shows confirmation dialog on refresh page or on closing of tab 
   * @param event 
   */
  @HostListener("window:beforeunload")
  reloadHandler(event: Event) {
    if (this.addonActionForm.dirty)
      event.stopPropagation();
  }

  /**
   * Method that adds the new add on to the menu
   */
  addTheAddOn() {
    const dialogRef = this.dialog.open(MessageDialogComponent, {
      data:
      {
        type: 'success',
        message: 'Add On submitted for review',
        showStatus: true,
        buttonText: 'Add another Add On',
      } 
    });
    dialogRef.afterClosed().subscribe(response => {
      response ? this.addonActionForm.reset() : this.close();
    })
  }
}
