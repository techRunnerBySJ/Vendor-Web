import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MenuDialogComponent } from 'src/app/modules/inquiry-orders/menu-dialog/menu-dialog.component';
import { ActionDialogComponent } from 'src/app/modules/inquiry-orders/action-dialog/action-dialog.component';
import { InquiryOrders } from 'src/app/modules/inquiry-orders/model/inquiry-orders';
import { InquiryOrderService } from '../../services/inquiry-order.service';
import { SharedService } from '../../services/shared.service';
import { ToastService } from '../../services/toast.service';
import { RejectOrderDialogComponent } from 'src/app/modules/my-orders/reject-order-dialog/reject-order-dialog.component';

@Component({
  selector: 'app-inquiry-order-details-dialog',
  templateUrl: './inquiry-order-details-dialog.component.html',
  styleUrls: ['./inquiry-order-details-dialog.component.scss']
})
export class InquiryOrderDetailsDialogComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];
  inquiryOrderDetails: InquiryOrders;
  outOfStock: any = [];
  editQuantity: any = [];
  selectAlt: any = [];
  addNewItem = [];
  isQuantityEdited: boolean;
  isAlternativeSelected: boolean;
  isOutOfStock: boolean;
  isNewItemAdded: boolean;
  orderId: number;
  openedFrom: string;

  constructor(
    private sharedService: SharedService,
    private router: Router,
    private inquiryOrderService: InquiryOrderService,
    private toastMsgService: ToastService,
    private dialog: MatDialog,
    private renderer: Renderer2,
  ) {}

  ngOnInit(): void {
    this.renderer.addClass(document.body, 'overlay-enabled');
    this.subscriptions.push(
      this.sharedService.inquiryOrderId$.subscribe(inquiryOrderId => {
        this.router.navigate([], { queryParams: { inquiryOrderId } })
        if (inquiryOrderId) this.getInquiryOrderDetails(inquiryOrderId);
        this.orderId = inquiryOrderId;
      })
    );

    this.sharedService.openedFrom$.subscribe(openedFrom => {
      this.openedFrom = openedFrom;
    });
  }

  /**
   * Method that gets inquiry order details
   * @param orderId 
   */
  getInquiryOrderDetails(orderId: number): void {
    this.inquiryOrderService.getInquiryOrdersDetails(orderId).subscribe(res => {
      this.inquiryOrderDetails = InquiryOrders.fromJson(res['result']);
    });
  }

  /**
   * Method that closes the modal
   */
  closeModal(): void {
    this.sharedService.setInquiryOrderDetailsModal(false);
    this.router.navigate([], { queryParams: { orderId: null } });
  }

  /**
   * Method that confirms the order
   * Constructs a data object based on changes in quantity, new items, alternative selections, or out-of-stock items.
   */
  confirmOrder(): void {
    let data = {};
  
    if (this.isQuantityEdited || this.isNewItemAdded || this.isAlternativeSelected || this.isOutOfStock) {
      data = {
        "status": "vendor_modified"
      };
  
      const inquiryItems = [];
  
      for (const i of this.inquiryOrderDetails['menuItems']) {
        const inquiryItemId = i['inquiryMenuItemId'];
  
        // Check if inquiryItemId is not present in any of the arrays
        const isNotPresent = !(
          this.editQuantity.some(item => item.inquiry_item_id === inquiryItemId) ||
          this.addNewItem.some(item => item.inquiry_item_id === inquiryItemId) ||
          this.selectAlt.some(item => item.inquiry_item_id === inquiryItemId) ||
          this.outOfStock.some(item => item.inquiry_item_id === inquiryItemId)
        );
  
        if (isNotPresent) {
          inquiryItems.push({ inquiry_item_id: inquiryItemId, status: "available" });
        }
      }
  
      if (this.outOfStock.length !== 0) {
        for (const o of this.outOfStock) {
          inquiryItems.push(o);
        }
      }
  
      if (this.addNewItem.length !== 0) {
        data['new_items'] = this.addNewItem;
      }
  
      if ((this.editQuantity).length !== 0) {
        for (const e of this.editQuantity) {
          inquiryItems.push(e);
        }
      }
  
      if ((this.selectAlt).length !== 0) {
        for (const s of this.selectAlt) {
          inquiryItems.push(s);
        }
      }
  
      if (inquiryItems.length > 0) {
        data['inquiry_items'] = inquiryItems;
      }
    } else {
      data = {
        "status": "vendor_accepted"
      };
      data['inquiry_items'] = [];
      
      for (const i of this.inquiryOrderDetails['menuItems']) {
        data['inquiry_items'].push({ inquiry_item_id: i['inquiryMenuItemId'], status: "available" });
      }
    }
  
    this.inquiryOrderService.putInquiryOrdersDetails(this.inquiryOrderDetails.inquiryOrderId, data).subscribe(res => {
      this.toastMsgService.showSuccess(`Order Id: ${this.inquiryOrderDetails.inquiryOrderId} is confirmed successfully`);
      this.sharedService.pendingYourConfirmationOrderActionEventEmitter.emit('confirm');
      this.closeModal();
    });
  
    if (this.orderId) this.getInquiryOrderDetails(this.orderId);
  }
  
  

  /**
   * Method that rejects the order 
   * Constructs a data object with the status set to 'vendor_rejected'.
   */
  rejectOrder(): void {const dialogRef = this.dialog.open(RejectOrderDialogComponent, {
    data: {
      action: 'reject'
    },
    autoFocus: false
  });
  dialogRef.afterClosed().subscribe((response) => {
    if (response.flag) {
      const data = {
        status: 'vendor_rejected',
        reject_reason: response.reason
      }
      this.inquiryOrderService.putInquiryOrdersDetails(this.inquiryOrderDetails.inquiryOrderId, data).subscribe(res => {
        this.toastMsgService.showSuccess(`Inquiry Order Id: ${this.inquiryOrderDetails.inquiryOrderId} is rejected successfully`);
        this.sharedService.pendingYourConfirmationOrderActionEventEmitter.emit('reject');
          this.closeModal();
        });
    }
  })
    
  }

  /**
   * Method that opens up menu dialog component to add new item
   */
  addMenuItem(): void {
    const dialogRef = this.dialog.open(MenuDialogComponent, {
      data: {
        action: 'add new item',
        addNewItem: this.addNewItem
      },
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe((response) => {
      if (response.flag) {
        // this.addNewItem = (response.newItems);
        this.addNewItem.push(...response.newItems)
        const outOfStockItems = this.addNewItem.filter(item => this.isOutOfStockForItem(item.itemId));
        if (outOfStockItems.length > 0) {
          this.toastMsgService.showError("Some items are marked out of stock. Please mark them as in stock before adding to the order.");
          return;
        }
      }

      if (this.addNewItem.length) {
        this.isNewItemAdded = true;
      }
    });
  }

  /**
   * Method that opens action dialog component and edit the quantity
   * @param inquiryMenuItemId 
   * @param menuItemId 
   * @param menuItemName 
   * @returns 
   */
  editQuantityOfMenuItems(inquiryMenuItemId: number, menuItemId: number, menuItemName: string, quant:number, variantGroup:[], displayPrice: number): void {
    if (this.isOutOfStockForItem(inquiryMenuItemId) || this.isItemAltSelected(inquiryMenuItemId)) {  
      this.toastMsgService.showError("This item is marked out of stock or alternative selected. Please mark it as in stock or remove alternatives before editing qunatity.");
      return;
    }
    const dialogRef = this.dialog.open(ActionDialogComponent, {
      data: {
        showEditQuantityDialog: true,
        maxQuantity: quant
      },
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe((response) => {
      if (response.flag) {
        this.toastMsgService.showSuccess("Quantity added successfully !!!");
        const existingIndex = this.editQuantity.findIndex(edit => edit.inquiry_item_id === inquiryMenuItemId);
        const newEditQuantity = {
          "inquiry_item_id": inquiryMenuItemId,
          "status": "not_available",
          "replacements": [
            {
              "menu_item_id": menuItemId,
              "max_quantity": response.maximumItemQuantity,
              "menu_item_name": menuItemName,
              "display_price": displayPrice,
              ...(variantGroup.length > 0 && { 
                "variant_groups": variantGroup.map(({ menuVariantGroupId, menuVariantId,menuVariantName }) => ({
                  "variant_group_id": menuVariantGroupId,
                  "variant_id": menuVariantId,
                  "variant_name": menuVariantName
                }))
              } )
            }
          ]
        };

        if (existingIndex !== -1) {
          this.editQuantity.splice(existingIndex, 1);
        }

        this.editQuantity.push(newEditQuantity);

        if (this.editQuantity.length > 0) {
          this.isQuantityEdited = true;
        }
      }
    });
  }

  /**
   * Method that opens menu dialog and selects the alternatives
   * @param masterCategoryId 
   * @param inquiryItemId 
   * @param menuItemId 
   * @returns 
   */
  selectAlternativeMenuItems(masterCategoryId: number, inquiryItemId: number, menuItemId: number): void {
    if (this.isOutOfStockForItem(inquiryItemId) || this.isItemQuantityEdited(inquiryItemId)) {
      this.toastMsgService.showError("This item is marked out of stock or quantity edited. Please mark it as in stock or remove edited quantity before selecting alternatives.");
      return;
    }

    const dialogRef = this.dialog.open(MenuDialogComponent, {
      data: {
        action: 'select alt',
        masterCategoryId: masterCategoryId,
        selectAlt: this.selectAlt
      },
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe((response) => {
      if (response.flag) {
        const selectAlt = {
          "inquiry_item_id": inquiryItemId,
          "status": "not_available",
        };
        if(response.replacements.length){
          selectAlt['replacements'] = response.replacements
        }
        this.selectAlt.push(selectAlt);
        if (this.selectAlt.length > 0) {
          this.isAlternativeSelected = true;
        }
      }
    });
  }

  /**
   * Method that opens action dialog and marks the item as out of stock
   * @param inquiryMenuItemId 
   * @returns 
   */
  markOutOfStockMenuItems(inquiryMenuItemId: number): void {
    const existingEditIndex = this.editQuantity.findIndex(edit => edit.inquiry_item_id === inquiryMenuItemId);
    const existingAltIndex = this.selectAlt.findIndex(alt => alt.inquiry_item_id === inquiryMenuItemId);
    if (this.isItemQuantityEdited(inquiryMenuItemId) || this.isItemAltSelected(inquiryMenuItemId)) {
      this.toastMsgService.showError("This item is not marked out of stock. Please remove edits or alternatives before marking it out of stock.");
      return;
    }
    const dialogRef = this.dialog.open(ActionDialogComponent, {
      data: {
        showOutOfStockDialog: true
      },
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe((response) => {
      if (response.flag) {
        const outOfStock = {
          "inquiry_item_id": inquiryMenuItemId,
          "status": "not_available"
        };

        this.outOfStock.push(outOfStock);

        if (this.outOfStock.length > 0) {
          this.isOutOfStock = true;
        }
      }
    });
  }

  /**
   * Method to check if an item alreday has alternative
   * @param inquiryItemId 
   * @returns 
   */
  isAlternativeSelectedForItem(inquiryItemId: number): boolean {
    return this.selectAlt.some((alt) => alt.inquiry_item_id === inquiryItemId);
  }

  /**
   * Method to check if an item is marked out of stock
   * @param inquiryItemId 
   * @returns 
   */
  isOutOfStockForItem(inquiryItemId: number): boolean {
    return this.outOfStock.some((outOfStock) => outOfStock.inquiry_item_id === inquiryItemId);
  }

  /**
   * Method to check if an item qunatity is added
   * @param itemId 
   * @returns 
   */
  isItemQuantityEdited(itemId: number): boolean {
    return this.editQuantity.some(item => item.inquiry_item_id === itemId);
  }

  /**
   * Method to check if an item alternative is selected
   * @param itemId 
   * @returns 
   */
  isItemAltSelected(itemId: number): boolean {
    return this.selectAlt.some(item => item.inquiry_item_id === itemId);
  }

    /**
   * Method to check if an item is marked out of stock
   * @param itemId 
   * @returns 
   */
  isItemOutOfStock(itemId: number): boolean {
    return this.outOfStock.some(item => item.inquiry_item_id === itemId);
  }

  /**
   * Method to remove new item if already slected
   * @param inquiryMenuItemId 
   */
  removeFromNewItem(inquiryMenuItemId: number): void {
    this.removeFromArray(this.addNewItem, inquiryMenuItemId,'new item');
  }

  /**
   * Method to remove from alt item array if changes are made
   * @param inquiryMenuItemId 
   */
  removeFromAltItem(inquiryMenuItemId: number): void {
    this.removeFromArray(this.selectAlt, inquiryMenuItemId,'replacement');
  }

  /**
   * Method to remove from edit quantity array if there is any same previous reposne and update it
   * @param inquiryMenuItemId 
   */
  removeFromEditQuantity(inquiryMenuItemId: number): void {
    this.removeFromArray(this.editQuantity, inquiryMenuItemId);
  }

  /**
   * Method to mark in stock if it is marked out of stock
   * @param inquiryMenuItemId 
   */
  markInStockMenuItems(inquiryMenuItemId: number): void {
    this.removeFromArray(this.outOfStock, inquiryMenuItemId);
  }

  /**
   * Removing items from array
   * @param array 
   * @param inquiryMenuItemId 
   */
  removeFromArray(array: any[], inquiryMenuItemId: number, type?: any): void {
    const index = array.findIndex(item => {
      if (item.menu_item_id === inquiryMenuItemId) {
        return true;
      } else if (item.inquiry_item_id === inquiryMenuItemId) {
        return true;
      } else if (item.replacements && Array.isArray(item.replacements)) {
        if (type === "replacement") {
          const replacementIndex = item.replacements.findIndex(replacement => replacement.menu_item_id === inquiryMenuItemId);
          if (replacementIndex !== -1) {
            array.splice(replacementIndex, 1);
            const newAddIndex = this.inquiryOrderService.addNewSelectedItemsDetails.findIndex(rep => rep.itemId === inquiryMenuItemId);
          if(newAddIndex !== -1){
          this.inquiryOrderService.addNewSelectedItemsDetails.splice(newAddIndex,1)
          }
            return true;
          }
        }
      }
      return false;
    });
  
    if (index !== -1 && type !== "replacement") {
      array.splice(index, 1);
    }
  }


  ngOnDestroy(): void {
    this.inquiryOrderService.addNewSelectedItemsDetails = [];
    this.renderer.removeClass(document.body, 'overlay-enabled');
    this.subscriptions.forEach((subscription) => {
      if (!subscription.closed) {
        subscription.unsubscribe();
      }
    });
  }
}
