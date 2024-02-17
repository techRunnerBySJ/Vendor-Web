import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HomeService } from 'src/app/shared/services/home.service';
import { Services } from 'src/app/shared/models/constants/constant.type';
import { IOutletImage, Outlet } from '../home/model/home';
import { maxFileUploadSizeAllowed, OutletImageAction } from './model/more';
import { ToastService } from 'src/app/shared/services/toast.service';
import { MenuService } from 'src/app/shared/services/menu.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { skip } from 'rxjs/operators';

@Component({
  selector: 'app-more',
  templateUrl: './more.component.html',
  styleUrls: ['./more.component.scss'],
})
export class MoreComponent implements OnInit, OnDestroy {

  outletDetails: Outlet = new Outlet();
  service: string;
  openImageActionModal: boolean;
  outletImageAction: OutletImageAction;
  fileName: string;
  readonly Services = Services;
  subscriptions: Subscription[] = [];
  openPrepTimeActionModal: boolean;

  constructor(private router: Router, private homeService: HomeService, private toastMsgService: ToastService, private menuService: MenuService,
    private sharedService: SharedService) { }

  ngOnInit(): void {
    this.service = this.homeService.service;
    this.subscriptions.push(
      this.homeService.outletDetails$.subscribe(data => {
        if (data?.has(localStorage.getItem('childOutletId') || 'primaryOutlet')) {
          this.outletDetails = data.get(localStorage.getItem('childOutletId') || 'primaryOutlet');
        }
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
    this.outletDetails = this.homeService.outletDetails.get(localStorage.getItem('childOutletId') || 'primaryOutlet');
  }

  /**
  * Method that checks whether user is uploading file with correct extn
  * and then gets url to upload the file with api call
  * @param file 
  */
  getFileUploadUrl(file: FileList, action: OutletImageAction, additionalImgIndex?: number) {
    const index = (file.item(0).name.lastIndexOf('.'))
    const fileExtn = file.item(0).name.substring(index + 1).toLowerCase();
    if (!['jpg', 'jpeg', 'png'].includes(fileExtn)) {
      this.toastMsgService.showError('Kindly choose image file')
      return;
    }
    if (file.item(0).size > maxFileUploadSizeAllowed) return this.toastMsgService.showError('Kindly check the size of file');

    this.outletImageAction = action;
    this.menuService.getFileUploadUrl(fileExtn).subscribe(res => {
      this.fileName = res['result']['file_name'];
      this.fileUpload(res['result']['uploadUrl'], file, additionalImgIndex);

    });
  }

  /**
   * Method that upload file to aws-s3 bucket with api call
   * @param uploadUrl 
   * @param file 
   */
  fileUpload(uploadUrl, file: FileList, additionalImgIndex?: number) {
    this.menuService.uploadFile(uploadUrl, file.item(0)).subscribe(res => {
      if (this.outletImageAction === 'AddAdditional') {
        this.addOutletImage();
      } else {
        this.editOutletImage(additionalImgIndex);
      }
    });
  }

  /**
   * Method that adds additional outlet image and then update outlet details through api call
   */
  addOutletImage() {
    const images: IOutletImage[] = this.outletDetails.outletAdditionalImages;
    images.push({ name: this.fileName });
    const data = this.outletImagesToJson(images);
    this.updateOutletDetails(data);
  }

  /**
   * Method that edits primary or additional outlet image and then update outlet details through api call
   * @param index 
   */
  editOutletImage(index?: number) {
    let images: IOutletImage[];

    if (this.outletImageAction === 'EditAdditional') {
      images = this.outletDetails.outletAdditionalImages;
      images[index]['name'] = this.fileName;
    }
    if (this.outletImageAction === 'EditPrimary') {
      images = [{ name: this.fileName }];
    }
    const data = this.outletImagesToJson(images);
    this.updateOutletDetails(data);
  }

  /**
   * Method that deletes additional outlet image and then update outlet details through api call
   * @param index 
   */
  deleteOutletImage(index: number) {
    const images: IOutletImage[] = this.outletDetails.outletAdditionalImages;
    images.splice(index, 1);

    const data = this.outletImagesToJson(images);
    this.updateOutletDetails(data);
  }

  /**
   * Method that updates outlet details
   * @param data 
   */
  updateOutletDetails(data: any) {
    this.homeService.updateOutletDetails(data).subscribe(res => {
      this.outletDetails.outletPrimaryImage = res['result']['image'];
      this.outletDetails.outletAdditionalImages = res['result']['images'];
      this.toastMsgService.showSuccess('Outlet image updated successfully');
    });
  }

  /**
   * Method that returns data to be sent via api call
   * @param outletImages 
   * @returns 
   */
  outletImagesToJson(outletImages: IOutletImage[]) {

    const data = {};

    if (this.outletImageAction === 'EditPrimary') {
      data['image'] = { name: outletImages[0]['name'] };
    }
    else {
      data['images'] = [];
      outletImages.forEach(img => {
        data['images'].push({ name: img.name });
      })
    }
    return data;
  }

  toggleImagesModal() {
    this.openImageActionModal = !this.openImageActionModal;
  }

  /**
   * Method to navigate to the bill printer settings page.
   */
  naviagteToBillPrinterSettings() {
    this.router.navigate(['/more/bill-printer-settings']);
  }

  /**
   * Method to navigate to the outlet info page.
   */
  naviagteToOutletInfo() {
    this.router.navigate(['/more/outlet-info']);
  }

  /**
   * Method to navigate to the outlet info page.
   */
  naviagteToRiders() {
    this.router.navigate(['/more/riders']);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subcription => {
      if (!subcription.closed) {
        subcription.unsubscribe();
      }
    });
  }
}
