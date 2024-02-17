import { Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, Renderer2 } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { MessageDialogComponent } from 'src/app/shared/components/message-dialog/message-dialog.component';
import { ToastService } from 'src/app/shared/services/toast.service';
import { MenuService } from 'src/app/shared/services/menu.service';
import { Addon, AddonGroup, Category, FoodTypes, IPackagingChargesSlab, MenuItem, SubCategory, VariantGroup } from '../model/menu';
import { Services } from 'src/app/shared/models/constants/constant.type';
import { HomeService } from 'src/app/shared/services/home.service';
import { Outlet, PackagingChargesTypes } from '../../home/model/home';
import { originalOrder } from 'src/app/shared/functions/modular.functions';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Variant } from '../model/menu';
import {MatTooltipModule} from '@angular/material/tooltip';


@Component({
  selector: 'app-add-new-item',
  templateUrl: './add-new-item.component.html',
  styleUrls: ['./add-new-item.component.scss']
})
export class AddNewItemComponent implements OnInit, OnDestroy {
  isAddItem: boolean;
  categoryList: Category[] = [];
  subCategoryList: SubCategory[] = [];
  addonGroupList: AddonGroup[] = [];
  addonList: Addon[] = [];
  selectedAddonGroups = [];
  itemImageUrl
  intermediateItemImageName: string;
  service: string;
  packagingChargesType: PackagingChargesTypes;
  packagingChargesSlabs: IPackagingChargesSlab[];
  readonly Services = Services;
  itemFileUploadMaxSizeAllowed: number = 5242880 // 5 MB in bytes
  isVariantGroupSequenceModalVisible: boolean;
  isVariantSequenceModalVisible: boolean;
  variantGroupList: VariantGroup[];
  itemDetails: MenuItem;
  variantList: Variant[];
  variantGroupId: number;



  itemActionForm = new FormGroup({
    categoryId: new FormControl('', [Validators.required]),
    subCategoryId: new FormControl('', [Validators.required]),
    itemId: new FormControl({ disabled: true, value: '' }, [Validators.required]),
    itemName: new FormControl('', [Validators.required]),
    foodType: new FormControl(null, [Validators.required]),
    description: new FormControl(null),
    itemPrice: new FormControl('', [Validators.required]),
    packagingCharges: new FormControl('', [Validators.required]),
    servesHowMany: new FormControl('', [Validators.required]),
    allowLongDistance: new FormControl(null, [Validators.required]),
    isSpicy: new FormControl(null, [Validators.required]),
    isGstInclusive: new FormControl(null, [Validators.required]),
    itemImage: new FormControl(''),
    addVariantsChoice: new FormControl(null, [Validators.required]),
    variantGroupRow: this.formBuilder.array([]),
    addAddOnsChoice: new FormControl(null, [Validators.required]),
    addOnRow: this.formBuilder.array([]),
    gst: new FormControl({disabled:true, value: ''}, [Validators.required]),
    discountRate: new FormControl({disabled:true, value: ''}),
    weightGrams: new FormControl('',[Validators.required])
  });

  readonly foodTypes = FoodTypes;
  readonly originalOrder = originalOrder;
  flags = [
    { id: true, name: 'Yes' },
    { id: false, name: 'No' }
  ];
  subscriptions: Subscription[] = [];
  @Input() modalData: any;
  @Output() closeModal = new EventEmitter<any>();
  outletDetails: Outlet;
  showPackagingCharges: boolean;
  
  constructor(private router: Router, private dialog: MatDialog, private formBuilder: FormBuilder, public sanitizer: DomSanitizer,
    private menuService: MenuService, private renderer: Renderer2, private toastMsgService: ToastService,
    private homeService: HomeService) { }

  ngOnInit(): void {
    this.homeService.outletDetails$.subscribe(data => {
      this.outletDetails = data.get('primaryOutlet');
      if(this.outletDetails.gstCategory === 'hybrid'){
        this.itemActionForm['controls']['gst'].enable();
      }
    });
    this.service = this.menuService.service;
    this.subscriptions.push(this.menuService.categoryList$.subscribe(data => this.categoryList = data))
    this.subscriptions.push(this.menuService.addonGroupList$.subscribe(data => this.addonGroupList = data));
    this.setSubCategories(this.modalData.categoryId);
    this.subscriptions.push(this.homeService.outletDetails$.subscribe(data => {
      this.packagingChargesType = data.get(localStorage.getItem('childOutletId') || 'primaryOutlet').packagingChargesType;
    }))
    this.packagingChargesSlabs = this.homeService.globalVar.get('ITEM_PACKAGING_CHARGES_SLAB');
    if (this.modalData.actionType === 'ADD') {
      this.isAddItem = true;
      this.itemActionForm.patchValue({
        categoryId: this.modalData.categoryId,
        subCategoryId: this.modalData.subCategoryId,
      });
      if (this.packagingChargesType !== 'item') {
        this.itemActionForm.get('packagingCharges').setValue(0); //setting packing charges = 0 for packagingChargesType = 'order'/'none'
      }
    }

    else if (this.modalData.actionType === 'EDIT' || this.modalData.actionType === 'VIEW') {
      this.isAddItem = false;
      this.subscriptions.push(this.menuService.getItem(this.modalData.itemId).subscribe(res => {
        const itemDetails = MenuItem.formJson(res['result']);
        this.itemActionForm.patchValue({
          categoryId: this.modalData.categoryId,
          subCategoryId: this.modalData.subCategoryId,
          itemId: itemDetails['itemId'],
          itemName: itemDetails['itemName'],
          description: itemDetails['description'],
          itemPrice: itemDetails['displayPrice'] ? itemDetails['displayPrice'] : itemDetails['itemPrice'],
          discountRate: itemDetails['discountRate'],
          foodType: itemDetails['foodType'],
          packagingCharges: itemDetails['packagingCharges'],
          servesHowMany: itemDetails['servesHowMany'],
          allowLongDistance: itemDetails['allowLongDistance'],
          isSpicy: itemDetails['isSpicy'],
          isGstInclusive: itemDetails['isGstInclusive'],
          gst: itemDetails['gst'],
          itemImage: itemDetails['itemImage'],
          addVariantsChoice: itemDetails['variantGroupRow'].length > 0 ? true : false,
          addAddOnsChoice: itemDetails['addOnRow'].length > 0 ? true : false,
          weightGrams: itemDetails['weightGrams']
        });
        if (this.itemActionForm.get('isGstInclusive').value) {
          this.itemActionForm.get('gst').disable();
        }
        for (const i in itemDetails['variantGroupRow']) {
          this.addVariantGroup();
          this.itemActionForm['controls']['variantGroupRow']['controls'][i]['controls']['variantGroupName']
            .setValue(itemDetails['variantGroupRow'][i]['variantGroupName']);
          this.itemActionForm['controls']['variantGroupRow']['controls'][i]['controls']['variantGroupId']
            .setValue(itemDetails['variantGroupRow'][i]['variantGroupId']);
          const arr = this.itemActionForm['controls']['variantGroupRow']['controls'][i]['controls']['variantRow'] as FormArray;
          arr.clear();
          for (const j in itemDetails['variantGroupRow'][i]['variantRow']) {
            arr.push(this.initVariantRows());
            arr['controls'][j].patchValue({
              variantId: itemDetails['variantGroupRow'][i]['variantRow'][j]['variantId'],
              variantName: itemDetails['variantGroupRow'][i]['variantRow'][j]['variantName'],
              variantType: itemDetails['variantGroupRow'][i]['variantRow'][j]['variantType'],
              additionalPrice: itemDetails['variantGroupRow'][i]['variantRow'][j]['additionalPrice'],
              isDefault: itemDetails['variantGroupRow'][i]['variantRow'][j]['isDefault'],
              inStock: itemDetails['variantGroupRow'][i]['variantRow'][j]['inStock'],
              servesHowMany: itemDetails['variantGroupRow'][i]['variantRow'][j]['servesHowMany'],
            })
          }
        }

        for (const i in itemDetails['addOnRow']) {
          this.addAddOns();
          this.setAddons(itemDetails['addOnRow'][i]['addonGroupId'], i);
          this.itemActionForm['controls']['addOnRow']['controls'][i].patchValue({
            addonGroupId: itemDetails['addOnRow'][i]['addonGroupId'],
            addonIds: itemDetails['addOnRow'][i]['addonIds'],
            minLimit: itemDetails['addOnRow'][i]['minLimit'],
            maxLimit: itemDetails['addOnRow'][i]['maxLimit']
          })
        }
        this.itemImageUrl = itemDetails['itemImageUrl'];
        this.itemDetails = itemDetails;
        if (this.modalData.disableAll) {
          this.itemActionForm.disable();
        }
      }))
    }

    this.renderer.addClass(document.body, 'overlay-enabled');
    if(this.service !== Services.Grocery) {
      this.itemActionForm.get('weightGrams').disable();
    }
    if (this.outletDetails.packagingChargesType === 'item' && (this.service !== Services.Food || this.service === Services.Food && !this.outletDetails.packgingChargeSlabApplied)) {
      this.showPackagingCharges = false;
    }
    else{
      this.showPackagingCharges = true;
      this.itemActionForm.setValidators(this.customItemPackagingChargesValidator());
    }
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(document.body, 'overlay-enabled');
    this.variantGroupArr.clear();
    this.addOnArr.clear();
    this.itemActionForm.reset();
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  /**
   * Method that sets sub-categories based on categoryId
   * @param categoryId 
   */
  setSubCategories(categoryId: number) {
    this.itemActionForm['controls']['subCategoryId'].setValue(null);
    this.subscriptions.push(this.menuService.getSubCategories(categoryId).subscribe((res) => {
      this.subCategoryList = [];
      for (const i of res['result']) {
        this.subCategoryList.push(SubCategory.fromJson(i));
      }
    }));
  }

  /**
   * Method that sets all addons based on addonGroupID
   * @param addonGroupId 
   * @param index 
   */
  setAddons(addonGroupId: number, index: number | string) {
    this.addOnArr['controls'][index]['controls']['addonIds'].setValue('');
    this.subscriptions.push(this.menuService.getAddonByAddonGroupId(addonGroupId).subscribe((res) => {
      const addons = [];
      for (const i of res['result']) {
        addons.push(Addon.fromJson(i));
      }
      this.addonList[index] = addons;
      this.selectedAddonGroups = []
      for (const i in this.addOnArr['controls']) {
        this.selectedAddonGroups.push(this.addOnArr['controls'][i]['controls']['addonGroupId']['value'])
      }
    }))
  }

  get variantGroupArr() {
    return this.itemActionForm.get('variantGroupRow') as FormArray;
  }
  get variantArr() {
    return this.itemActionForm['controls']['variantGroupRow']['controls']['variantRow'] as FormArray;
  }
  get addOnArr() {
    return this.itemActionForm.get('addOnRow') as FormArray;
  }

  /**
   * Method that creates new formGroup for item array
   * @returns formGroup
   */
  initVariantGroupRows() {
    return this.formBuilder.group({
      variantGroupName: new FormControl('', [Validators.required]),
      variantRow: this.formBuilder.array([this.initVariantRows()]),
      variantGroupId: new FormControl(''),
    }, { validators: [this.customVariantIsDefaultValidator()] });
  }

  /**
   * Method that creates new formGroup for variant array
   * @returns formGroup
   */
  initVariantRows() {
    return this.formBuilder.group({
      variantId: new FormControl(''),
      variantName: new FormControl('', [Validators.required]),
      variantType: new FormControl(null, [Validators.required]),
      additionalPrice: new FormControl('', [Validators.required]),
      isDefault: new FormControl(null, [Validators.required]),
      inStock: new FormControl(null, [Validators.required]),
      servesHowMany: new FormControl('', [Validators.required]),
    });
  }

  /**
   * Method that creates new formGroup for add-on array
   * @returns formGroup
   */
  initAddOnRows() {
    return this.formBuilder.group({
      addonGroupId: new FormControl(null, [Validators.required]),
      addonIds: new FormControl(null, [Validators.required]),
      minLimit: new FormControl(null, [Validators.required]),
      maxLimit: new FormControl(null, [Validators.required]),
    }, { validators: [this.customAddonSelectionValidator()] });
  }

  /**
   * Method that adds newly created formGroup to the formArray
   */
  addVariantGroup() {
    this.variantGroupArr.push(this.initVariantGroupRows());
  }

  /**
   * Method that add Variant to the formArray
   * @param index
   */
  addVariant(index) {
    const arr = this.itemActionForm['controls']['variantGroupRow']['controls'][index]['controls']['variantRow'] as FormArray;
    arr.push(this.initVariantRows());
  }

  /**
   * Method that adds add-on to the formArray
   */
  addAddOns() {
    this.addOnArr.push(this.initAddOnRows());
  }

  /**
   * Method that deletes control from item array
   * @param index
   */
  deleteVariantGroup(index: number) {
    if (this.variantGroupArr.controls.length > 1) {
      this.variantGroupArr.removeAt(index);
    }
  }

  /**
   * Method that deletes variant from variant array
   * @param i
   * @param j
   */
  deleteVariant(i: number, j: number) {
    const arr = this.itemActionForm['controls']['variantGroupRow']['controls'][i]['controls']['variantRow'] as FormArray;
    if (arr.controls.length > 1) {
      arr.removeAt(j);
    }
  }

  /**
   * Method that deletes add-on from add-on array
   * @param index
   */
  deleteAddOn(index: number) {
    if (this.addOnArr.controls.length > 1) {
      this.addOnArr.removeAt(index);
    }
  }

  /**
   * Method that adds variant fields to the item form
   */
  onAddVariantsSelection() {
    this.itemActionForm.get('addVariantsChoice').value ? this.addVariantGroup() : this.variantGroupArr.clear();
  }

  /**
  * Method that adds add-on fields to the form
  */
  onAddOnsSelection() {
    this.itemActionForm.get('addAddOnsChoice').value ? this.addAddOns() : this.addOnArr.clear();
  }

  /**
   * Method that checks length of 'variantGroupArr'
   * @returns boolean
   */
  checkVariantGroupArrLength() {
    return this.variantGroupArr.length > 0;
  }

  /**
   * Method that checks length of 'addOnArr'
   * @returns boolean
   */
  checkaddOnArrLength() {
    return this.addOnArr.length > 0;
  }

  /**
   * Method that validates only 1 vairant in each variant group should be default
   * @returns 
   */
  customVariantIsDefaultValidator(): ValidatorFn {
    return (group: FormGroup): ValidationErrors => {
      let count = 0;
      const variantRow = group['controls']['variantRow']['controls']
      variantRow.forEach(obj => {
        if (obj['controls']['isDefault']['value']) {
          count++;
        }
      })
      variantRow.forEach(obj => {
        if (count !== 1) {

          obj['controls']['isDefault'].setErrors({ defaultVariant: true });
        }
        else {
          obj['controls']['isDefault'].setErrors(null);
        }
      })
      return
    };
  }

  /**
   * Method that validates min & max limit of each addonRow
   */
  customAddonSelectionValidator(): ValidatorFn {
    return (group: FormGroup): ValidationErrors => {
      const addonIds = group['controls']['addonIds']['value'];
      const minLimit = group['controls']['minLimit']['value'];
      const maxLimit = group['controls']['maxLimit']['value'];
        if (minLimit > addonIds?.length) {
          group['controls']['minLimit'].setErrors({ ...{ 'minMaxSelection': true } })
        }
        else if (maxLimit > addonIds?.length) {
          group['controls']['maxLimit'].setErrors({ ...{ 'minMaxSelection': true } })
        }
        else if (Number(maxLimit) !== -1 && minLimit > maxLimit) {
          group['controls']['minLimit'].setErrors({ ...{ 'minMaxSelection': true } })
        }
        else {
          group['controls']['minLimit'].setErrors(null)
          group['controls']['maxLimit'].setErrors(null)
        }
      
      return
    }

  }

  /**
  * Method that checks whether user is uploading file with correct extn
  * and then gets url to upload the file with api call
  * @param file 
  */
  getFileUploadUrl(file: FileList) {
    const index = (file.item(0).name.lastIndexOf('.'))
    const fileExtn = file.item(0).name.substring(index + 1)
    if (!['jpg', 'jpeg', 'png'].includes(fileExtn)) {
      this.toastMsgService.showError('Kindly choose correct file')
      return;
    }
    if (file.item(0).size > this.itemFileUploadMaxSizeAllowed) return this.toastMsgService.showError('Kindly check the size of file');

    this.subscriptions.push(this.menuService.getFileUploadUrl(fileExtn).subscribe(data => {
      const res = data;
      this.intermediateItemImageName = res['result']['file_name'];
      this.fileUpload(res['result']['uploadUrl'], file);

    }));
  }

  /**
   * Method that upload file to aws-s3 bucket with api call
   * @param uploadUrl 
   * @param file 
   */
  fileUpload(uploadUrl, file) {
    this.subscriptions.push(this.menuService.uploadFile(uploadUrl, file.item(0)).subscribe(data => {
      const res = data;
      this.itemActionForm['controls']['itemImage'].setValue(this.intermediateItemImageName);
      this.itemImageUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file.item(0)))  //to show image preview
    }));
  }

  /**
   * Method that warns user in case of unsaved data and then emits event to toggle modal
   * @returns 
   */
  close() {
    if (this.itemActionForm.dirty) {
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
   * Method that submit item
   * @returns 
   */
  submitItem() {
    if (this.itemActionForm.status === 'INVALID') {
      this.toastMsgService.showWarning('Kindly fill up all the fields');
      this.itemActionForm.markAllAsTouched();
      return;
    }
    const formValues = this.itemActionForm.getRawValue();
    const data: MenuItem = new MenuItem();
    Object.assign(data, formValues);

    if (this.isAddItem) {
      this.subscriptions.push(this.menuService.addItem(data.toJson(this.service)).subscribe((res) => {
        this.closeModal.emit('close');
        this.toastMsgService.showSuccess(`Item: ${res['result']['menu_item_name']} added successfully`);
      }));
    } else {
      this.subscriptions.push(this.menuService.editItem(data['itemId'], data.toJson(this.service)).subscribe((res) => {
        this.closeModal.emit('close');
        this.toastMsgService.showSuccess(`Item: ${res['result']['menu_item_name']} updated successfully`);
      }));
    }
  }

  /**
   * Method that enable/disable and set value of gst field
   * based on selection
   */
  gstSelectionChange() {
    if (this.itemActionForm.get('isGstInclusive').value) {
      this.itemActionForm.get('gst').setValue(0);
      this.itemActionForm.get('gst').disable();
    } else {
      if (this.outletDetails.gstCategory === 'restaurant') {
        this.itemActionForm.get('gst').setValue('5');
      }
      if (this.outletDetails.gstCategory === 'non_restaurant') {
        this.itemActionForm.get('gst').setValue('18');
      }
      else {
        this.itemActionForm.get('gst').setValue('');
      }
      this.itemActionForm.get('gst').enable();
    }

    // if (this.itemActionForm.get('isGstInclusive').value) {
    //   this.itemActionForm.get('gst').setValue(0);
    // } else {
    //   this.itemActionForm.get('gst').setValue(5);
    // }
  }

  /**
   * Method that validates packing charges lies b/w slab
   * @returns 
   */
  customItemPackagingChargesValidator(): ValidatorFn {
    return (group: FormGroup): ValidationErrors => {
      const itemPrice = group['controls']['itemPrice']['value'];
      const itemPackagingCharges = group['controls']['packagingCharges']['value'];

      if (itemPrice && itemPackagingCharges && this.packagingChargesType === 'item') {
        for (const i of this.packagingChargesSlabs) {
          if (itemPrice >= i['minPrice'] && itemPrice <= i['maxPrice']) {
            if (itemPackagingCharges > i['maxCharges']) {
              group['controls']['packagingCharges'].setErrors({ itemPackagingCharges: true })
            }
            else {
              group['controls']['packagingCharges'].setErrors(null)
            }
          }
        }
      }
      return
    }
  }

  /**
   * Method that shows confirmation dialog on refresh page or on closing of tab 
   * @param event 
   */
  @HostListener("window:beforeunload")
  reloadHandler(event: Event) {
    if (this.itemActionForm.dirty)
      event.stopPropagation();
  }

  /**
   * Method that adds item to the menu.
   */
  addTheItem() {
    const dialogRef = this.dialog.open(MessageDialogComponent, {
      data:
      {
        type: 'success',
        message: 'Item submitted for review',
        showStatus: true,
        buttonText: 'Add another item',
      }
    });
    dialogRef.afterClosed().subscribe(response => {
      response ? this.itemActionForm.reset() : this.close();
    })
  }

  /**
   * Method that pop ups the confirmation dialog to remove the item from the menu.
   */
  removeItem() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data:
      {
        confirmBtnText: 'remove',
        dismissBtnText: 'not now',
        message: 'Do you want to remove this item ?',
      }
    });
  }

  /**
  * Handles drag and drop functionality for variant group sequence
  * @param event The drag and drop event object
  */
  dropVariantGroupSequence(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.itemDetails.variantGroupRow, event.previousIndex, event.currentIndex);
  }
  /**
 * Open the variant group sequence modal and close the variant sequence modal.
 */
  openVariantGroupSequenceModal() {
    this.isVariantGroupSequenceModalVisible = true;
    this.isVariantSequenceModalVisible = false;
  }
  /**
 * Updates the sequence of variant groups and sends a PUT request to the server.
 */
  saveVariantGroupSequence() {
    this.itemDetails.variantGroupRow.forEach((item, i) => {
      item.sequence = i + 1;
    });
    const sequenceData = {
      sorted_ids: this.itemDetails.variantGroupRow.map(variantGroup => (
        variantGroup.variantGroupId
      ))
    };
    this.menuService.putVariantGroupSequence(sequenceData, this.itemDetails.itemId)
      .subscribe(response => {
        this.toastMsgService.showSuccess('Variant groups sequence updated successfully');
        this.closeSequenceModal();
      });
  }

  /**
   * Handles the drop event for reordering the variants list.
   * @param event - The event object containing the previous and current indexes of the dragged item.
   */
  dropVariantSequence(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.variantList, event.previousIndex, event.currentIndex);
  }

  /**
   * Changes the sequence of variants based on the selected variant group ID.
   * @param variantGroupId - The ID of the selected variant group.
   */
  changeVariantSequenceBasedOnVariantGroup(variantGroupId: number) {
    this.itemDetails.variantGroupRow.forEach((variantGroup) => {
      if (variantGroup.variantGroupId === variantGroupId) {
        this.variantList = variantGroup.variantRow;
      }
    })
  }

  /**
   * Opens the variant sequence modal for a specific variant group.
   * @param variantGroupId - The ID of the variant group for which to open the variant sequence modal.
   */
  openVariantSequenceModal(variantGroupId: number) {
    this.isVariantSequenceModalVisible = true;
    this.isVariantGroupSequenceModalVisible = false;
    this.variantGroupId = variantGroupId;
    this.changeVariantSequenceBasedOnVariantGroup(variantGroupId);
  }

  /**
   * Updates the sequence of variants and sends the updated sequence to the server
   */
  saveVariantSequence() {
    this.variantList.forEach((item, i) => {
      item.sequence = i + 1;
    });
    const sequenceData = {
      sorted_ids: this.variantList.map(variant => (
        variant.variantId
      ))
    };
    this.menuService.putItemVariantSequence(sequenceData, this.variantGroupId)
      .subscribe(response => {
        if (response) {
          this.toastMsgService.showSuccess('Variants sequence updated successfully');
          this.closeSequenceModal();
        }
      });
  }

  /**
 * Closes the variant group sequence modal.
 */
  closeSequenceModal() {
    this.isVariantGroupSequenceModalVisible = false;
    this.isVariantSequenceModalVisible = false;
  }

}