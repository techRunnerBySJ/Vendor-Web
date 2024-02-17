import { ToastService } from 'src/app/shared/services/toast.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { AddNewDialogComponent } from './menu-dialogs/add-new-dialog/add-new-dialog.component';
import { MenuService } from 'src/app/shared/services/menu.service';
import { Addon, AddonGroup, Category, FoodTypes, Menu, MenuItem, SubCategory, VariantGroup } from './model/menu';
import { Subscription } from 'rxjs';
import { HolidaySlotsDialogComponent } from 'src/app/shared/components/holiday-slots-dialog/holiday-slots-dialog.component';
import { CategoryFilterPipe } from 'src/app/shared/pipes/category-filter.pipe';
import { posErrorMsg, Services } from 'src/app/shared/models/constants/constant.type';
import { AddonGroupFilterPipe } from 'src/app/shared/pipes/addon-group-filter.pipe';
import { HomeService } from 'src/app/shared/services/home.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { originalOrder } from 'src/app/shared/functions/modular.functions';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { skip } from 'rxjs/operators';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  providers: [CategoryFilterPipe, AddonGroupFilterPipe]
})
export class MenuComponent implements OnInit, OnDestroy {
  openedCategoryPanels = {};
  openedSubCategoryPanels = {};
  openedAddonsPanels = {};
  isToggle = true
  showAddons: boolean = false;
  showAddNewSubCategoryModal: boolean;
  isAddSubCategory: boolean;
  menuList: Menu[] = [];
  addonGroupList: AddonGroup[] = [];
  term: string;
  categoryList: Category[] = [];
  showAddNewItemModal: boolean;
  itemModalData: any;
  showAddNewAddOnModal: boolean;
  addonModalData: any;
  displayedColumns = ['image', 'itemName', 'itemPrice', 'foodType', 'status', 'actions'];
  addOnsDisplayedColumns = ['addonName', 'addonPrice', 'foodType', 'status', 'actions'];
  // foodTypeSelection = 'non-veg';
  selectedFoodTypes = Object.keys(FoodTypes);
  selectedFoodTypesInString = JSON.stringify(this.selectedFoodTypes);
  noCategoryData: boolean;
  noAddonGroupData: boolean;
  subscriptions: Subscription[] = [];
  service: string;
  readonly Services = Services;
  readonly foodTypes = FoodTypes;
  readonly originalOrder = originalOrder;
  isCategorySequenceModalVisible: boolean;
  isSubCategorySequenceModalVisible: boolean;
  isItemsSequenceModalVisible: boolean;
  openSequenceModal: boolean;
  categoryData: Category[];
  subCategoriesList: SubCategory[];
  menuItemsList: MenuItem[];
  categoryId: number;
  subCategoryId: number;
  itemId: number;
  subCategoryActionForm = new FormGroup({
    categoryId: new FormControl('', [Validators.required]),
    subCategoryId: new FormControl({ disabled: true, value: '' }),
    subCategoryName: new FormControl('', [Validators.required]),
  });

  constructor(private router: Router, private dialog: MatDialog, private activeRoute: ActivatedRoute, private menuService: MenuService,
    private toastMsgService: ToastService, private categoryFilterPipe: CategoryFilterPipe, private addonGroupFilterPipe: AddonGroupFilterPipe,
    private homeService: HomeService, private sharedService: SharedService) {
    this.activeRoute.data.subscribe((data) => {
      if (data.kind === 'add-on-groups') {
        this.showAddons = true;
      }
    });
  }

  ngOnInit(): void {
    this.service = this.menuService.service;
    if (!this.showAddons) {
      this.setMenu();
      this.setMasterCategories();
    }
    this.setMainCategories();
    this.setAddonGroups();
    this.subscriptions.push(this.menuService.categoryList$.subscribe(data => this.categoryList = data))
    this.subscriptions.push(this.menuService.addonGroupList$.subscribe(data => {
      if (data) this.addonGroupList = data;
    }));

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
    if (!this.showAddons) {
      this.setMenu();
    }
    this.setMainCategories();
    this.setAddonGroups();
  }

  /**
   * Method that sets restaurant menu
   */
  setMenu() {
    this.subscriptions.push(this.menuService.getMenu().subscribe((res) => {
      this.menuList = [];
      for (const i of res['result']) {
        this.menuList.push(Menu.fromJson(i));
      }
    }))
  }

  /**
   * Method that sets master categories
   */
  setMasterCategories() {
    if (this.service === Services.Grocery) {
      this.subscriptions.push(this.menuService.getMasterCategories().subscribe())
    }
  }

  /**
   * Method that makes API call to set all categories of the restaurant
   */
  setMainCategories() {
    this.subscriptions.push(this.menuService.getMainCategories().subscribe());
  }

  /**
   * Method that makes API call to set addon-groups of the restaurant
   */
  setAddonGroups() {
    this.subscriptions.push(this.menuService.getAddonGroups().subscribe());
  }

  /**
   * Method that sets addons in addon-group by addonGroupId
   * @param addonGroupId 
   * @param index 
   */
  setAddons(addonGroupId: number) {
    const index = this.addonGroupList.findIndex(addonGrp => addonGrp.addonGroupId === addonGroupId);
    if (this.addonGroupList[index]['addons'].length === 0) {
      this.subscriptions.push(this.menuService.getAddonByAddonGroupId(addonGroupId).subscribe((res) => {
        for (const i of res['result']) {
          this.addonGroupList[index]['addons'].push(Addon.fromJson(i))
        }
      }))
    }
  }

  /**
   * Method that adds or edits category/Add on group
   * and then makes API call based on that
   * @param isEdit
   * @param id
   * @param name
   */
  openAddNewDialog(isEdit: boolean, id?: number, name?: string, sequence?: number) {
    if (this.sharedService.isPosOutlet()) return this.toastMsgService.showInfo(posErrorMsg);

    const dialogRef = this.dialog.open(AddNewDialogComponent, {
      data: {
        openedFrom: this.showAddons ? 'add-on' : 'category',
        isEdit: isEdit,
        name: isEdit ? name : '',
        sequence: isEdit ? sequence : null,
      },
      autoFocus: false,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((response) => {
      if (response.flag) {
        const data = {
          name: response.name,
          master_category_id: response.masterCategory, //will have value only for addAction='category' and service='grocery'
          sequence: response.sequence,
        };
        const sequenceData = {
          sortedId: []
        }
        if (response.addAction === 'category') {
          if (!isEdit) {
            this.subscriptions.push(this.menuService.addMainCategory(data).subscribe((res) => {
              // For Category List
              this.categoryList.push(Category.fromJson(res['result']));
              this.menuService.categoryList$.next(this.categoryList);

              // For Menu List
              this.menuList.push(Menu.fromJson(res['result']))
              // this.setMenu();
              this.toastMsgService.showSuccess(`Category: ${res['result']['name']} added successfully`);
            }));
          } else {
            this.subscriptions.push(this.menuService.editMainCategory(id, data).subscribe((res) => {
              // For Category List
              let index = this.categoryList.findIndex(obj => obj['categoryId'] === res['result']['id']);
              this.categoryList[index]['categoryName'] = res['result']['name'];
              this.categoryList[index]['sequence'] = res['result']['sequence'];
              this.menuService.categoryList$.next(this.categoryList);

              // For Menu List
              index = this.menuList.findIndex(obj => obj['categoryId'] === res['result']['id']);
              this.menuList[index]['categoryName'] = res['result']['name'];
              this.menuList[index]['sequence'] = res['result']['sequence'];
              // this.setMenu();
              this.toastMsgService.showSuccess(`Category: ${res['result']['name']} updated successfully`);
            }));

          }
        } else {
          if (!isEdit) {
            this.subscriptions.push(this.menuService.addAddonGroup(data).subscribe((res) => {
              this.addonGroupList.push(AddonGroup.fromJson(res['result']));
              this.menuService.addonGroupList$.next(this.addonGroupList);
              this.toastMsgService.showSuccess(`Addon-Group: ${res['result']['name']} added successfully`);
            }));
          } else {
            this.subscriptions.push(this.menuService.editAddonGroup(id, data).subscribe((res) => {
              const index = this.addonGroupList.findIndex(obj => obj['addonGroupId'] === res['result']['id']);
              this.addonGroupList[index]['addonGroupName'] = res['result']['name'];
              this.menuService.addonGroupList$.next(this.addonGroupList);
              this.toastMsgService.showSuccess(`Addon-Group: ${res['result']['name']} updated successfully`);
            }));
          }
        }
      }
    });
  }

  /**
   * Method that toggles add new sub category modal
   * @param actionType
   * @param category
   * @param index
   */
  toggleAddNewSubCategoryModal(actionType: string, category?: Menu, index?: number) {
    if (this.sharedService.isPosOutlet()) return this.toastMsgService.showInfo(posErrorMsg);

    if (actionType === 'ADD') {
      this.isAddSubCategory = true;
      this.subCategoryActionForm.patchValue({
        categoryId: category.categoryId,
        subCategoryId: '',
        subCategoryName: '',
      });
    } else if (actionType === 'EDIT') {
      this.isAddSubCategory = false;
      this.subCategoryActionForm.patchValue({
        categoryId: category.categoryId,
        subCategoryId: category.subCategories[index]['subCategoryId'],
        subCategoryName: category.subCategories[index]['subCategoryName'],
      });
    }
    this.showAddNewSubCategoryModal = !this.showAddNewSubCategoryModal;
  }

  /**
   * Methods that adds/edits sub category
   */
  submitSubCategory() {
    if (this.subCategoryActionForm.status === 'INVALID') {
      this.subCategoryActionForm.markAllAsTouched();
      return;
    }
    const data = {
      main_category_id: this.subCategoryActionForm['controls']['categoryId'].value,
      name: this.subCategoryActionForm['controls']['subCategoryName'].value,
    };
    if (this.isAddSubCategory) {
      this.subscriptions.push(this.menuService.addSubCategory(data).subscribe((res) => {
        this.setMenu();
        this.toggleAddNewSubCategoryModal('');
        this.toastMsgService.showSuccess(`Sub-Category: ${res['result']['name']} added successfully`);
      }));
    } else {
      const subCategoryId = this.subCategoryActionForm['controls']['subCategoryId'].value;
      this.subscriptions.push(this.menuService.editSubCategory(subCategoryId, data).subscribe((res) => {
        this.setMenu();
        this.toggleAddNewSubCategoryModal('');
        this.toastMsgService.showSuccess(`Sub-Category: ${res['result']['name']} updated successfully`);
      }));
    }
  }

  /**
   * Method that toggles add-new-item-modal
   * @param actionType 
   * @param categoryId 
   * @param subCategoryId 
   * @param itemId 
   */
  toggleAddNewItemModal(actionType: string, categoryId?: number, subCategoryId?: number, itemId?: number) {
    if (this.sharedService.isPosOutlet() && (actionType === 'ADD' || actionType === 'EDIT')) {
      return this.toastMsgService.showInfo(posErrorMsg);
    }
    this.itemModalData = {
      actionType: actionType,
      categoryId: categoryId,
      subCategoryId: subCategoryId,
      itemId: itemId,
      disableAll: actionType === 'VIEW' ? true : false,
    }
    if (actionType === 'close') {
      this.setMenu();
    }
    this.showAddNewItemModal = !this.showAddNewItemModal;
  }

  /**
   * Method that navigates to the add new add on form page.
   */
  toggleAddNewAddOnModal(actionType: string, addonGroupId?: string, addon?: Addon) {
    if (this.sharedService.isPosOutlet() && (actionType === 'ADD' || actionType === 'EDIT')) {
      return this.toastMsgService.showInfo(posErrorMsg);
    }
    this.addonModalData = {
      actionType: actionType,
      addonGroupId: addonGroupId,
      addon: addon,
      disableAll: actionType === 'VIEW' ? true : false,
    }
    if (actionType === 'close') {
      this.setAddonGroups();
    }
    this.showAddNewAddOnModal = !this.showAddNewAddOnModal;
  }
  /**
  * Method that deletes category/sub-category/item/addon-group/add-on
  * @param term
  * @param id
  */
  removeAction(term: string, id: number, name: string) {
    if (this.sharedService.isPosOutlet()) return this.toastMsgService.showInfo(posErrorMsg);

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        confirmBtnText: 'remove',
        dismissBtnText: 'not now',
        message: `Do you want to remove the ${term}, ${name} ?`,
      },
    });

    dialogRef.afterClosed().subscribe((response) => {
      if (response) {
        if (term === 'category') {
          this.subscriptions.push(this.menuService.deleteMainCategory(id).subscribe((res) => {
            // For Category List
            let index = this.categoryList.findIndex(obj => obj['categoryId'] === res['result']['id']);
            this.categoryList.splice(index, 1)
            this.menuService.categoryList$.next(this.categoryList);

            // For Menu List
            index = this.menuList.findIndex(obj => obj['categoryId'] === res['result']['id']);
            this.menuList.splice(index, 1)
            // this.setMenu();
            this.toastMsgService.showSuccess(`Category: ${name} deleted successfully`);
          }));
        } else if (term === 'sub-category') {
          this.subscriptions.push(this.menuService.deleteSubCategory(id).subscribe((res) => {
            this.setMenu();
            this.toastMsgService.showSuccess(`Sub-Category: ${name} deleted successfully`);
          }));
        } else if (term === 'item') {
          this.subscriptions.push(this.menuService.deleteItem(id).subscribe((res) => {
            this.setMenu();
            this.toastMsgService.showSuccess(`Item: ${name} deleted successfully`);
          }));
        } else if (term === 'addon-group') {
          this.subscriptions.push(this.menuService.deleteAddonGroup(id).subscribe((res) => {
            const index = this.addonGroupList.findIndex(obj => obj['addonGroupId'] === res['result']['id']);
            this.addonGroupList.splice(index, 1)
            this.menuService.addonGroupList$.next(this.addonGroupList);
            this.toastMsgService.showSuccess(`Addon-Group: ${name} deleted successfully`);
          }));
        } else if (term === 'addon') {
          this.subscriptions.push(this.menuService.deleteAddon(id).subscribe((res) => {
            this.setAddonGroups();
            this.toastMsgService.showSuccess(`Addon: ${name} deleted successfully`);
          }))
        }
      }
    });
  }

  /**
   * Method that navigates to the add-ons page 
   * (which is the different route to this component)
   */
  navigateToAddOnsPage() {
    this.router.navigate(['/menu/add-ons']);
  }

  /**
    * Method that moves back to the previous item page
   */
  navigateToItemPage() {
    this.router.navigate(['/menu']);
  }

  /**
   * Method that add/remove holiday slots for category
   * @param category 
   */
  createCategoryHolidaySlot(category: Menu) {
    if (this.sharedService.isPosOutlet()) return this.toastMsgService.showInfo(posErrorMsg);

    let hasItems: boolean = false;
    for (const i of category.subCategories) {
      if (i['menuItems'].length > 0) {
        hasItems = true;
        break;
      }
    }
    if (!hasItems) {
      this.toastMsgService.showInfo('This category has no items');
      return;
    }

    if (category.categoryInStock) {
      const dialogRef = this.dialog.open(HolidaySlotsDialogComponent, {
        data: {
          openedFor: 'category'
        }
      });
      dialogRef.afterClosed().subscribe(response => {
        if (response.flag) {
          const data = { end_epoch: response.endDate }
          this.subscriptions.push(this.menuService.addMainCategoryHolidaySlot(category.categoryId, data).subscribe(res => {
            category.categoryInStock = false;
            category.subCategories.forEach(sub => {
              sub.subCategoryInStock = false;
              sub.menuItems.forEach(item => {
                item.itemInStock = false;
              })
            })
            this.toastMsgService.showSuccess(`${category.categoryName} added to holiday slot`);
          }
          ));
        }
      })
    } else {
      const data = { end_epoch: null }
      this.subscriptions.push(this.menuService.addMainCategoryHolidaySlot(category.categoryId, data).subscribe(res => {
        category.categoryInStock = true;
        category.subCategories.forEach(sub => {
          sub.subCategoryInStock = true;
          sub.menuItems.forEach(item => {
            item.itemInStock = true;
          })
        })
        this.toastMsgService.showSuccess(`${category.categoryName} removed from holiday slot`);
      }));
    }
  }

  /**
   *  Method that add/remove holiday slots for subCategory
   * @param subCategory 
   * @param category 
   */
  createSubCategoryHolidaySlot(subCategory: SubCategory, category: Menu) {
    if (this.sharedService.isPosOutlet()) return this.toastMsgService.showInfo(posErrorMsg);

    if (subCategory.menuItems.length === 0) {
      this.toastMsgService.showInfo('This sub-category has no items');
      return;
    }
    if (subCategory.subCategoryInStock) {
      const dialogRef = this.dialog.open(HolidaySlotsDialogComponent, {
        data: {
          openedFor: 'sub-category'
        }
      });
      dialogRef.afterClosed().subscribe(response => {
        if (response.flag) {
          const data = { end_epoch: response.endDate }
          this.subscriptions.push(this.menuService.addSubCategoryHolidaySlot(subCategory.subCategoryId, data).subscribe(res => {
            subCategory.subCategoryInStock = false;
            subCategory.menuItems.forEach(item => {
              item.itemInStock = false;
            })
            let count = 0;
            category.subCategories.forEach(sub => {
              if (!sub.subCategoryInStock) {
                count++
              }
            })
            if (category.subCategories.length === count) {
              category.categoryInStock = false;
            }
            this.toastMsgService.showSuccess(`${subCategory.subCategoryName} added to holiday slot`);
          }
          ));
        }
      })
    } else {
      const data = { end_epoch: null }
      this.subscriptions.push(this.menuService.addSubCategoryHolidaySlot(subCategory.subCategoryId, data).subscribe(res => {
        subCategory.subCategoryInStock = true;
        subCategory.menuItems.forEach(item => {
          item.itemInStock = true;
        })
        category.categoryInStock = true;
        this.toastMsgService.showSuccess(`${subCategory.subCategoryName} removed from holiday slot`);
      }));
    }
  }

  /**
   *  Method that add/remove holiday slots for item
   * @param item 
   * @param subCategory 
   * @param category 
   */
  createItemHolidaySlot(item: MenuItem, subCategory: SubCategory, category: Menu) {
    if (this.sharedService.isPosOutlet()) return this.toastMsgService.showInfo(posErrorMsg);

    if (item.itemInStock) {
      const dialogRef = this.dialog.open(HolidaySlotsDialogComponent, {
        data: {
          openedFor: 'item'
        }
      });
      dialogRef.afterClosed().subscribe(response => {
        if (response.flag) {
          const data = { end_epoch: response.endDate }
          this.subscriptions.push(this.menuService.addItemHolidaySlot(item.itemId, data).subscribe(res => {
            item.itemInStock = false;

            let count = 0;
            subCategory.menuItems.forEach(menuItem => {
              if (!menuItem.itemInStock) {
                count++;
              }
            })
            if (subCategory.menuItems.length === count) {
              subCategory.subCategoryInStock = false;
            }

            count = 0;
            category.subCategories.forEach(sub => {
              if (!sub.subCategoryInStock) {
                count++;
              }
            })
            if (category.subCategories.length === count) {
              category.categoryInStock = false;
            }
            this.toastMsgService.showSuccess(`${item.itemName} added to holiday slot`);
          }))
        }
      })
    } else {
      const data = { end_epoch: null }
      this.subscriptions.push(this.menuService.addItemHolidaySlot(item.itemId, data).subscribe(res => {
        item.itemInStock = true;
        subCategory.subCategoryInStock = true;
        category.categoryInStock = true;
        this.toastMsgService.showSuccess(`${item.itemName} removed from holiday slot`);
      }))
    }
  }

  /**
   * Method that add/remove holiday slots for addongroup
   * @param addonGroup 
   */
  createAddonGroupHolidaySlot(addonGroup: AddonGroup) {
    if (this.sharedService.isPosOutlet()) return this.toastMsgService.showInfo(posErrorMsg);

    if (addonGroup.addonGroupInStock) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        data: {
          confirmBtnText: 'Yes',
          dismissBtnText: 'not now',
          message: `Do you want to continue ?`,
        },
      });
      dialogRef.afterClosed().subscribe(response => {
        if (response) {
          const data = { in_stock: false }
          this.subscriptions.push(this.menuService.addAddonGroupHolidaySlot(addonGroup.addonGroupId, data).subscribe(res => {
            addonGroup.addonGroupInStock = false;
            addonGroup.addons.forEach(addon => {
              addon.addonInStock = false;
            })
            this.toastMsgService.showSuccess(`${addonGroup.addonGroupName} added to holiday slot`);
          }
          ));
        }
      })
    } else {
      const data = { in_stock: true }
      this.subscriptions.push(this.menuService.addAddonGroupHolidaySlot(addonGroup.addonGroupId, data).subscribe(res => {
        addonGroup.addonGroupInStock = true;
        addonGroup.addons.forEach(addon => {
          addon.addonInStock = true;
        })
        this.toastMsgService.showSuccess(`${addonGroup.addonGroupName} removed from holiday slot`);
      }));
    }
  }

  /**
   * Method that add/remove holiday slots for addon
   * @param addon 
   * @param addonGroup 
   */
  createAddonHolidaySlot(addon: Addon, addonGroup: AddonGroup) {
    if (this.sharedService.isPosOutlet()) return this.toastMsgService.showInfo(posErrorMsg);

    if (addon.addonInStock) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        data: {
          confirmBtnText: 'Yes',
          dismissBtnText: 'not now',
          message: `Do you want to continue ?`,
        },
      });
      dialogRef.afterClosed().subscribe(response => {
        if (response) {
          const data = { in_stock: false }
          this.subscriptions.push(this.menuService.addAddonHolidaySlot(addon.addonId, data).subscribe(res => {
            addon.addonInStock = false;
            let count = 0;
            addonGroup.addons.forEach(addon => {
              if (!addon.addonInStock) {
                count++;
              }
            })
            if (addonGroup.addons.length === count) {
              addonGroup.addonGroupInStock = false;
            }
            this.toastMsgService.showSuccess(`${addon.addonName} added to holiday slot`);
          }
          ));
        }
      })
    } else {
      const data = { in_stock: true };
      this.subscriptions.push(this.menuService.addAddonHolidaySlot(addon.addonId, data).subscribe(res => {
        addon.addonInStock = true;
        addonGroup.addonGroupInStock = true;
        this.toastMsgService.showSuccess(`${addon.addonName} removed from holiday slot`);
      }))
    }
  }

  /**
   * Method that prevent unchecking all checkboxes
   * @param event 
   * @returns 
   */
  preventUncheckingAllFoodTypeCheckboxes(event: Event) {
    const target = event.target as HTMLInputElement;
    if (!target.checked && this.selectedFoodTypes.length <= 1) return event.preventDefault();
  }

  /**
   * Method that sets foodTypes for filter
   */
  onFoodTypeSelectionChange(event: Event) {
    const target = event.target as HTMLInputElement
    if (target.checked) {
      this.selectedFoodTypes.push(target.value);
    } else {
      this.selectedFoodTypes.splice(this.selectedFoodTypes.indexOf(target.value), 1)
    }
    // change detection hook can't detect changes in array. so converting array into a string
    // and then pipe for category/sub-category/item/addonGrp/addon will convert it into an array to filter based on that
    this.selectedFoodTypesInString = JSON.stringify(this.selectedFoodTypes);
    this.evaluateFilteredData();

  }

  /**
   * Method that 
   * evaluates filtered data with filter-pipe. If no data available after filter
   * it displays no data found in html
   */
  evaluateFilteredData() {
    let filteredData: any[];
    if (!this.showAddons) {
      filteredData = this.categoryFilterPipe.transform(this.menuList, this.selectedFoodTypesInString);
      filteredData.length ? this.noCategoryData = false : this.noCategoryData = true;
    }
    else {
      filteredData = this.addonGroupFilterPipe.transform(this.addonGroupList, this.selectedFoodTypesInString);
      filteredData.length ? this.noAddonGroupData = false : this.noAddonGroupData = true;
    }
  }

  /**
   * Method that adds info of category panel opened or not
   * @param id 
   * @param flag 
   */
  setOpenedCategorypanel(id, flag) {
    this.openedCategoryPanels[id] = flag;
  }

  /**
   * Method that returns if particular category panel is opened or not
   * @param id 
   * @returns 
   */
  isCategoryPanelOpened(id) {
    return this.openedCategoryPanels[id];
  }

  /**
   * Method that adds info of sub-category panel opened or not
   * @param id 
   * @param flag 
   */
  setopenedSubCategoryPanel(id, flag) {
    this.openedSubCategoryPanels[id] = flag;
  }

  /**
   * Method that returns if particular sub-category panel is opened or not
   * @param id 
   * @returns 
   */
  isSubCategoryPanelOpened(id) {
    return this.openedSubCategoryPanels[id]
  }

  /**
   * Method that adds info of addon-group panel opened or not
   * @param id 
   * @param flag 
   */
  setopenedAddonsPanel(id, flag) {
    this.openedAddonsPanels[id] = flag;
  }

  /**
   * Method that returns if particular addon-group panel is opened or not
   * @param id 
   * @returns 
   */
  isAddonsPanelOpened(id) {
    return this.openedAddonsPanels[id]
  }

  /**
   * Method that expand/collapses expansion panel based on search term
   * @param event 
   * @returns 
   */
  onSearchTermChange(event: string) {
    this.term = event;
    if (!this.term) {
      this.openedCategoryPanels = {};
      this.openedSubCategoryPanels = {};
      this.openedAddonsPanels = {};
      return;
    };
    if (!this.showAddons) {
      for (const category of this.menuList) {
        for (const subCategory of category.subCategories) {
          for (const menuItem of subCategory.menuItems) {
            if (menuItem.itemName.toLowerCase().includes(this.term.toLowerCase())) {
              this.setOpenedCategorypanel(category.categoryId, true);
              this.setopenedSubCategoryPanel(subCategory.subCategoryId, true);
              break;
            }
          }
          if (subCategory.subCategoryName.toLowerCase().includes(this.term.toLowerCase())) {
            this.setOpenedCategorypanel(category.categoryId, true);
            break;
          }
        }
      }
    }
    else {
      for (const addonGroup of this.addonGroupList) {
        for (const addon of addonGroup.addons) {
          if (addon.addonName.toLowerCase().includes(this.term.toLowerCase())) {
            this.setopenedAddonsPanel(addonGroup.addonGroupId, true);
            break;
          }
        }
      }
    }
  }

  /**
   * Method that adds placeholder image if menu image not found
   * @param event 
   */
  onMenuImgError(event: Event) {
    const source = (event.target) as HTMLImageElement
    if (source.src !== this.homeService.globalVar.get('DUMMY_MENU_ITEM_IMAGE')) {
      source.src = this.homeService.globalVar.get('DUMMY_MENU_ITEM_IMAGE');
    }
  }
  /**
 * Opens the modal for changing the sequence of main categories in the menu.
 */
  openCategorySequenceModal() {
    this.isCategorySequenceModalVisible = true;
    this.isSubCategorySequenceModalVisible = false;
    this.isItemsSequenceModalVisible = false;
  }
  /**
 * Updates the sequence of categories in a menu list after a category is dropped.
 * @param event The drag and drop event containing the previous and current indices of the category.
 */
  dropCategorySequence(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.menuList, event.previousIndex, event.currentIndex);
  }
  /**
 * Saves the sequence of the main categories by updating the sequence value and sending a PUT request.
 * Shows a success message using toast message service upon successful response.
 */
  saveCategorySequence() {
    this.menuList.forEach((item, i) => {
      item.sequence = i + 1;
    });
    const sequenceData = {
      sorted_ids: this.menuList.map(category => (
        category.categoryId
      ))
    };
    this.menuService.putMenuCategorySequence(sequenceData).subscribe(response => {
      this.toastMsgService.showSuccess('Category sequence updated successfully');
      this.closeSequenceModal();
    });
  }

  /**
 * Opens the modal for changing the sequence of subcategories in a main category of the menu.
 * @param categoryId The ID of the category whose subcategory sequence is to be modified.
 */
  openSubCategorySequenceModal(categoryId?: number) {
    this.isSubCategorySequenceModalVisible = true;
    this.isCategorySequenceModalVisible = false;
    this.isItemsSequenceModalVisible = false;
    this.categoryId = categoryId;
    this.changeSubCategoriesSequenceBasedOnCategory(categoryId);
  }
  /**
  * Updates the sequence of subcategories in a list after a subcategory is dropped.
  * @param event The drag and drop event containing the previous and current indices of the subcategory.
  */
  dropSubCategorySequence(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.subCategoriesList, event.previousIndex, event.currentIndex);
  }
  /**
 * Changes the sequence of subcategories based on the category ID.
 * @param categoryId The ID of the category to update the subcategory sequence for.
 */
  changeSubCategoriesSequenceBasedOnCategory(categoryId: number) {
    this.menuList.forEach((menu) => {
      if (menu.categoryId === categoryId) {
        this.subCategoriesList = menu.subCategories;
      }
    });
  }

  /**
   * This method saves the sequence of subcategories in a given category.
   */
  saveSubCategorySequence() {
    this.subCategoriesList.forEach((item, i) => {
      item.sequence = i + 1;
    });
    const sequenceData = {
      sorted_ids: this.subCategoriesList.map(subCategory => (
        subCategory.subCategoryId
      ))
    };
    this.menuService.putMenuSubCategorySequence(sequenceData, this.categoryId)
      .subscribe(response => {
        this.toastMsgService.showSuccess('Sub Category sequence updated successfully');
        this.closeSequenceModal();
      });
  }

  /**
 * Updates the sequence of menu items in a list after a menu item is dropped.
 * @param event The drag and drop event containing the previous and current indices of the menu item.
 */
  dropItemsSequence(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.menuItemsList, event.previousIndex, event.currentIndex);
  }

  /**
* Opens the modal for changing the sequence of menu items based on a given subcategory ID.
* @param subCategoryId The ID of the subcategory to base the item sequence change on.
* @returns void.
*/
  openItemsSequenceModal(subCategoryId?: number): void {
    this.isItemsSequenceModalVisible = true;
    this.isCategorySequenceModalVisible = false;
    this.isSubCategorySequenceModalVisible = false;
    this.subCategoryId = subCategoryId;
    this.changeItemsSequenceBasedOnSubCategory(subCategoryId);
  }

  /**
* Changes the sequence of menu items based on the subcategory ID.
* @param subCategoryId The ID of the subcategory to update the menu item sequence for.
*/
  changeItemsSequenceBasedOnSubCategory(subCategoryId: number) {
    this.menuList.forEach((menu) => {
      menu.subCategories.forEach((subCategory) => {
        if (subCategory.subCategoryId === subCategoryId) {
          this.menuItemsList = subCategory.menuItems;
        }
      });
    });
  }
  /**
* The Method Save the sequence of items in a menu subcategory.
*/
  saveItemsSequence(): void {
    this.menuItemsList.forEach((item, i) => {
      item.sequence = i + 1;
    });
    const sequenceData = {
      sorted_ids: this.menuItemsList.map(items => (
        items.itemId
      ))
    };
    this.menuService.putMenuItemSequence(sequenceData, this.subCategoryId)
      .subscribe(response => {
        this.toastMsgService.showSuccess('Items sequence updated successfully');
        this.closeSequenceModal();
      });
  }

  /**
  * Closes the menu sequence modal by hiding all sequence modals.
  */
  closeSequenceModal() {
    this.isCategorySequenceModalVisible = false;
    this.isSubCategorySequenceModalVisible = false;
    this.isItemsSequenceModalVisible = false;
  }

  clearSearch() {
    this.term = '';
    this.openedCategoryPanels = {};
    this.openedSubCategoryPanels = {};
    this.openedAddonsPanels = {};
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      if (!subscription.closed) {
        subscription.unsubscribe();
      }
    });
  }
}