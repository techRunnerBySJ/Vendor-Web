import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Category, AddonGroup, MasterCategory } from 'src/app/modules/menu/model/menu';
import * as apiUrls from '../../core/apiUrls';
import { HomeService } from './home.service';
import { apiEndPoints } from '../models/constants/constant.type';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  categoryList$: BehaviorSubject<Category[]> = new BehaviorSubject<Category[]>(null);
  addonGroupList$: BehaviorSubject<AddonGroup[]> = new BehaviorSubject<AddonGroup[]>(null);
  masterCategoryList$: BehaviorSubject<MasterCategory[]> = new BehaviorSubject<MasterCategory[]>(null);
  service: string;

  constructor(private http: HttpClient, private homeService: HomeService) {
    this.homeService.service$.subscribe((data) => (this.service = data));
  }

  /**
   * Method that gets menu of restaurant
   * @returns api response
   */
  getMenu(): Observable<any> {
    return this.http
      .get(apiUrls.getMenuEndPoint(apiEndPoints[this.service]))
      .pipe(
        map((response) => {
          return response;
        })
      );
  }
  
  /**
   * Method that gets all master category of grocery
   * @returns 
   */
   getMasterCategories(): Observable<any> {
    return this.http.get(apiUrls.getMasterCategoriesEndPoint).pipe(
      map((response) => {
        const data: MasterCategory[] = [];
        for (const i of response['result']) {
          data.push(MasterCategory.fromJson(i));
        }
        this.masterCategoryList$.next(data);
        return response;
      })
    )
  }

  /**
   * Method that gets All Main Categories of restaurant and stores it in a observable
   */
  getMainCategories(): Observable<any> {
    return this.http
      .get(apiUrls.getMainCategoriesEndPoint(apiEndPoints[this.service]))
      .pipe(
        map((response) => {
          const data: Category[] = [];
          for (const i of response['result']) {
            data.push(Category.fromJson(i));
          }
          this.categoryList$.next(data);
        })
      );
  }

  /**
   * Method that adds category
   * @param data
   * @returns
   */
  addMainCategory(data: any): Observable<any> {
    return this.http
      .post(apiUrls.postMainCategoryEndPoint(apiEndPoints[this.service]), data)
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  /**
   * Method that edits category
   * @param id
   * @param data
   * @returns
   */
  editMainCategory(id: number, data: any): Observable<any> {
    return this.http
      .put(
        apiUrls.putMainCategoryEndPoint(id, apiEndPoints[this.service]),
        data
      )
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  /**
   * Method that deletes category
   * @param id
   * @returns
   */
  deleteMainCategory(id: number): Observable<any> {
    return this.http
      .delete(
        apiUrls.deleteMainCategoryEndPoint(id, apiEndPoints[this.service])
      )
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  /**
   * Method that add/remove category from holiday slot
   * @param id
   * @param data
   * @returns
   */
  addMainCategoryHolidaySlot(id: number, data: any): Observable<any> {
    return this.http
      .post(
        apiUrls.postMainCategoryHolidaySlotEndPoint(
          id,
          apiEndPoints[this.service]
        ),
        data
      )
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  /**
   * Method that gets All Sub-Categories based on category id
   * @param categoryId
   * @returns
   */
  getSubCategories(categoryId: number): Observable<any> {
    let params = new HttpParams();
    params = params.append('main_category_id', categoryId.toString());
    return this.http
      .get(
        apiUrls.getSubCategoriesByCategoryIdEndPoint(
          apiEndPoints[this.service]
        ),
        { params }
      )
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  /**
   * Method that adds sub-category in category of restaurant menu
   * @param data
   * @returns
   */
  addSubCategory(data: any): Observable<any> {
    return this.http
      .post(apiUrls.postSubCategoryEndPoint(apiEndPoints[this.service]), data)
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  /**
   * Method that edits sub-category in category of restaurant menu
   * @param id
   * @param data
   * @returns
   */
  editSubCategory(subCategoryId: number, data: any): Observable<any> {
    return this.http
      .put(
        apiUrls.putSubCategoryEndPoint(
          subCategoryId,
          apiEndPoints[this.service]
        ),
        data
      )
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  /**
   * Method that deletes sub-category in category of restaurant menu
   * @param subCategoryId
   * @returns
   */
  deleteSubCategory(subCategoryId: number): Observable<any> {
    return this.http
      .delete(
        apiUrls.deleteSubCategoryEndPoint(
          subCategoryId,
          apiEndPoints[this.service]
        )
      )
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  /**
   * Method that add/remove sub-category from holiday slot
   * @param subCategoryId
   * @param data
   * @returns
   */
  addSubCategoryHolidaySlot(subCategoryId: number, data: any): Observable<any> {
    return this.http
      .post(
        apiUrls.postSubCategoryHolidaySlotEndPoint(
          subCategoryId,
          apiEndPoints[this.service]
        ),
        data
      )
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  /**
   * Method that gets all the Items based on item id
   * @param itemId
   * @returns
   */
  getItem(itemId: number): Observable<any> {
    return this.http
      .get(apiUrls.getItemByIdEndPoint(itemId, apiEndPoints[this.service]))
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  /**
   * Method that adds items of restaurant menu
   * @param data
   * @returns
   */
  addItem(data: any): Observable<any> {
    return this.http
      .post(apiUrls.postItemEndPoint(apiEndPoints[this.service]), data)
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  /**
   * Method that edits items of restaurant menu
   * @param itemId
   * @param data
   * @returns
   */
  editItem(itemId: number, data: any): Observable<any> {
    return this.http
      .put(apiUrls.putItemEndPoint(itemId, apiEndPoints[this.service]), data)
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  /**
   * Method that deletes items of restaurant menu
   * @param itemId
   * @returns
   */
  deleteItem(itemId: number): Observable<any> {
    return this.http
      .delete(apiUrls.deleteItemEndPoint(itemId, apiEndPoints[this.service]))
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  /**
   * Method that add/remove item from holiday slot
   * @param itemId
   * @param data
   * @returns
   */
  addItemHolidaySlot(itemId: number, data: any): Observable<any> {
    return this.http
      .post(
        apiUrls.postItemHolidaySlotEndPoint(itemId, apiEndPoints[this.service]),
        data
      )
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  /**
   * Method that gets all addon groups of this restaurant and stores it in a observable
   * @returns Api response
   */
  getAddonGroups(): Observable<any> {
    return this.http.get(apiUrls.getAddonGroupListEndPoint(apiEndPoints[this.service])).pipe(
      map((response) => {
        const data: AddonGroup[] = [];
        for (const i of response['result']) {
          data.push(AddonGroup.fromJson(i));
        }
        this.addonGroupList$.next(data);
      })
    );
  }

  /**
   * Method that adds addon group to the restaurant
   * @param data
   * @returns Api response
   */
  addAddonGroup(data: object): Observable<any> {
    return this.http.post(apiUrls.postAddonGroupEndPoint(apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  /**
   * Method that edits addon group based on id
   * @param id
   * @param data
   * @returns Api response
   */
  editAddonGroup(id: number, data: object): Observable<any> {
    return this.http.put(apiUrls.putAddonGroupEndPoint(id, apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  /**
   * Method that delets addon group based on id
   * @param id
   * @returns Api response
   */
  deleteAddonGroup(id: number): Observable<any> {
    return this.http.delete(apiUrls.deleteAddonGroupEndPoint(id, apiEndPoints[this.service])).pipe(
      map((response) => {
        return response;
      })
    );
  }

  /**
   * Method that add/remove addongroup from holiday slot
   * @param id
   * @param data
   * @returns
   */
  addAddonGroupHolidaySlot(id: number, data: any): Observable<any> {
    return this.http
      .post(apiUrls.postAddonGroupHolidaySlotEndPoint(id, apiEndPoints[this.service]), data)
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  /**
   * Method that get all addons by addon-group id
   * @param addonGroupId
   * @returns Api response
   */
  getAddonByAddonGroupId(addonGroupId: number): Observable<any> {
    let params = new HttpParams();
    params = params.append('addon_group_id', addonGroupId.toString());
    return this.http
      .get(apiUrls.getAddonByAddonGroupIdEndPoint(apiEndPoints[this.service]), { params })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  /**
   * Method that add addon to addon-group
   * @param data
   * @returns Api response
   */
  addAddon(data: object): Observable<any> {
    return this.http.post(apiUrls.postAddonEndPoint(apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  /**
   * Method that edits add on
   * @param id
   * @param data
   * @returns Api response
   */
  editAddon(id: number, data: object): Observable<any> {
    return this.http.put(apiUrls.putAddonEndPoint(id, apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  /**
   * Method that deletes add on
   * @param id
   * @returns Api response
   */
  deleteAddon(id: number): Observable<any> {
    return this.http.delete(apiUrls.deleteAddonEndPoint(id, apiEndPoints[this.service])).pipe(
      map((response) => {
        return response;
      })
    );
  }

  /**
   * Method that add/remove addon from holiday slot
   * @param id
   * @param data
   * @returns
   */
  addAddonHolidaySlot(id: number, data: any): Observable<any> {
    return this.http.post(apiUrls.postAddonHolidaySlotEndPoint(id, apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  /**
   * Method that gets file upload url to upload file
   * @param file
   * @returns response
   */
  public getFileUploadUrl(fileExtn): Observable<any> {
    return this.http.get(apiUrls.fileUploadEndPoint(fileExtn)).pipe(
      map((response) => {
        return response;
      })
    );
  }

  /**
   * Method that upload file to aws-s3 bucket
   * @param uploadUrl
   * @param file
   * @returns
   */
  public uploadFile(uploadUrl, file): Observable<any> {
    const headers = new HttpHeaders({
      ignore_headers: 'true',
    });
    return this.http.put(uploadUrl, file, { headers }).pipe(
      map((response) => {
        return response;
      })
    );
  }

 /**
 * Updates the sequence of the main categories in a menu using HTTP PUT request.
 * @param data The data to be sent in the PUT request.
 * @returns An Observable that sends the updated response object result.
 */
putMenuCategorySequence(data: any): Observable<any> {
  return this.http.put(
    apiUrls.putMainCategorySequenceEndPoint(apiEndPoints[this.service]),
    data
  ).pipe(
    map((response) => {
      return response['result'];
    })
  );
}

/**
 * Updates the sequence of a subcategory in a menu using HTTP PUT request.
 * @param data The data to be sent in the PUT request.
 * @param id The ID of the subcategory to be updated.
 * @returns An Observable that sends the updated response object.
 */
putMenuSubCategorySequence(data: any, id: number): Observable<any> {
  return this.http.put(
    apiUrls.putMenuSubCategorySequenceEndPoint(apiEndPoints[this.service], id), data).pipe(
      map((response) => {
        return response;
      })
    );
}

/**
 * Updates the sequence of a menu item using an HTTP PUT request with the provided data and ID.
@param data The data to be sent in the PUT request.
@param id The ID of the menu item to be updated.
@returns An Observable that sends the updated response object.
 */
putMenuItemSequence(data: any, id:number): Observable<any> {
  return this.http.put(apiUrls.putMenuItemSequenceEndPoint(apiEndPoints[this.service], id), data).pipe(
    map((response) => {
      return response;
    })
  );
}

/** Updates the sequence of a variant group using HTTP PUT request.
@param data The data to be sent in the PUT request.
@param id The ID of the variant group to be updated.
@returns An Observable that sends the updated response object.
 */
putVariantGroupSequence(data: any, id:number): Observable<any> {
  return this.http.put(apiUrls.putVariantGroupSequenceEndPoint(apiEndPoints[this.service], id), data).pipe(
    map((response) => {
      return response;
    })
  );
}

/**Updates the sequence of an item variant using HTTP PUT request.
@param data The data to be sent in the PUT request.
@param id The ID of the item variant to be updated.
@returns An Observable that sends the updated response object.
 */
putItemVariantSequence(data: any, id:number): Observable<any> {
  return this.http.put(apiUrls.putItemVariantSequenceEndPoint(apiEndPoints[this.service], id), data).pipe(
    map((response) => {
      return response;
    })
  );
}
  
}
