import { Component, OnInit, Inject } from '@angular/core';
import { InquiryOrderService } from 'src/app/shared/services/inquiry-order.service';
import { InquiryOrderAction, MenuItemsInMenu } from '../model/inquiry-orders';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-menu-dialog',
  templateUrl: './menu-dialog.component.html',
  styleUrls: ['./menu-dialog.component.scss']
})
export class MenuDialogComponent implements OnInit {
  masterCategoryId: number;
  menuList: MenuItemsInMenu[] = [];
  term: string;
  orderAction: InquiryOrderAction;
  selectedItem: number | null = null;
  selectedItemDetails: MenuItemsInMenu;
  selectedItems: boolean[] = [];
  repSelectedItemsDetails: MenuItemsInMenu[] = [];
  replacements = [];
  variantGroups = [];
  menuItemName: string[] = [];
  newItems = [];
  selectAlt: [] = [];
  addNewItem: [] = [];

  constructor(
    private inquiryOrderService: InquiryOrderService,
    public dialogRef: MatDialogRef<MenuDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toasterMsgService: ToastService
  ) {
    this.orderAction = data.action;
    this.masterCategoryId = data.masterCategoryId;
    this.selectAlt = data.selectAlt;
    this.addNewItem = data.addNewItem;
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
  }
  /**
   * Searches for items based on the master category and search text.
   * If the action is 'select alt', it filters by master category ID.
   * Updates the menu list and shows an error message if no items are found.
   * @param searchText 
   */
  searchItemFromMasterCategory(searchText) {
    const data = {
      search_text: searchText
    };
    if (this.orderAction === 'select alt') data['master_category_id'] = this.masterCategoryId;
    this.inquiryOrderService.getMenuByMasterCategoryIdForSelectingAlternatives(data).subscribe(res => {
      this.inquiryOrderService.newsItemsToAdd = [...this.inquiryOrderService.newsItemsToAdd, ...this.menuList.filter(item => this.selectedItems[item.itemId])];

      this.menuList = res['result'].map(i => ({ ...MenuItemsInMenu.formJson(i), quantity: 1 }));

      if (!this.menuList.length) this.toasterMsgService.showError('No Items Found !!!');
    });
  }

  /**
   * Closes the dialog without taking any action.
   */
  onDismiss() {
    this.dialogRef.close({ flag: false });
  }

  /**
   * Handles the confirmation action based on the order action.
   * Checks for existing items, adds new items, and resets the selected items array.
   */
  onConfirm() {
    const newItemsToAdd = [
      ...this.inquiryOrderService.newsItemsToAdd,
      ...this.menuList.filter(item => this.selectedItems[item.itemId])
    ];
   
    const existingItems = this.inquiryOrderService.addNewSelectedItemsDetails.filter(existingItem =>
      newItemsToAdd.some(newItem => newItem.itemId === existingItem.itemId)
    );
      this.inquiryOrderService.addNewSelectedItemsDetails = [
        ...this.inquiryOrderService.addNewSelectedItemsDetails,
        ...newItemsToAdd.map(newItem => ({
          ...newItem,
          quantity: newItem.quantity,
          menu_item_name: newItem.itemName,
          ...(this.variantGroups.some(variant => variant.itemId === newItem.itemId && variant.length > 0) && { variantGroups: this.variantGroups.filter(variant => variant.itemId === newItem.itemId) })
        }))
      ];
      this.newItems = newItemsToAdd.map(newItem => {
        const variantGroups = this.variantGroups.filter(variant => variant.itemId === newItem.itemId && variant.length > 0);
        return {
          menu_item_id: newItem.itemId,
          max_quantity: newItem.quantity,
          menu_item_name: newItem.itemName,
          display_price: newItem.displayPrice,
          ...(this.variantGroups.length > 0 && { variant_groups : this.variantGroups })

        };
      });
      if (this.newItems.length){
        const successMsg = this.orderAction === 'add new item' ? 'New Item Added Successfully !!!' : 'Alternative Item Added Successfully !!!';
        this.orderAction === 'add new item' ? this.dialogRef.close({ flag: true, newItems: this.newItems }) : this.dialogRef.close({ flag: true, replacements: this.newItems });
        this.toasterMsgService.showSuccess(successMsg);
        this.selectedItems = [];
      }
      else {
        this.toasterMsgService.showWarning('No Items Selected');
      }
  }
  
  
  

  /**
   * Records the selected variant details for an item.
   * @param variantGroupId 
   * @param variantId 
   * @param variantName 
   * @param itemId 
   */
  selectedVariant(variantGroupId: number, variantId: number, variantName: string, itemId: number) {
    this.variantGroups = [{ variant_group_id: variantGroupId, variant_id: variantId, variant_name: variantName, itemId }];
  }

  /**
   * Edits the maximum quantity of an item based on the action ('increase' or 'decrease').
   * @param action 
   * @param item 
   */
  editMaximumItem(action: string, item: any) {
    if (action === 'increase') {
      item.quantity++;
    }
    if (action === 'decrease' && item.quantity > 1) {
      item.quantity--;
    }
  }
}
