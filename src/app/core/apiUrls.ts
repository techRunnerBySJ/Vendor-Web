import { environment } from '../../../src/environments/environment';
import { IApiEndPoint } from '../shared/models/constants/constant.type';

//APIs Endpoint to send and verify login id and password to login in the application
export const getSendLoginIdandpasswdEndPoint = `${environment.baseUrl}/user/vendor/auth/login`;

//APIs Endpoint to send Login Id for forgot password
export const getSendLoginIdEndPoint = `${environment.baseUrl}/user/vendor/forgotPassword`;

//APIs Endpoint for validating otp
export const getValidateOtpEndPoint = `${environment.baseUrl}/user/vendor/validateOtp`;

//APIs Endpoints for resetting passowrd
export const getResetPasswordEndPoint = `${environment.baseUrl}/user/vendor/resetPassword`;

//APIs Endpoints for updating passowrd in outlet info page for account settings
export const getUpdatePasswordEndPoint = `${environment.baseUrl}/user/vendor/updatePassword`;

//APIs Endpoints for inviting and adding new user
export const getInviteNewUserEndPoint = `${environment.baseUrl}/user/vendor/createVendor`;

// API Endpoint for outlet users
export const getOutletUsersEndPoint = `${environment.baseUrl}/user/vendor/outlet_vendors`;
export const putOutletUserEndPoint = (loginId: string) => {
    return `${environment.baseUrl}/user/vendor/${loginId}`;
}
export const deleteOutletUserEndPoint = (loginId: string) => {
    return `${environment.baseUrl}/user/vendor/${loginId}`;
}
export const postChangeUserActiveStatusEndPoint = (loginId: string) => {
    return `${environment.baseUrl}/user/vendor/change_active_status/${loginId}`;
}


// API EndPoint for outlet details
export const getOutletDetailsEndPoint = (apiEndPoint: IApiEndPoint) => {
    return `${environment.baseUrl}/${apiEndPoint.service}/vendor/${apiEndPoint.prefix}`;
};
export const putOutletDetailsEndPoint = (apiEndPoint: IApiEndPoint) => {
    return `${environment.baseUrl}/${apiEndPoint.service}/vendor/${apiEndPoint.prefix}`;
};
export const postOutletHolidaySlotEndPoint = (apiEndPoint: IApiEndPoint) => {
    return `${environment.baseUrl}/${apiEndPoint.service}/vendor/${apiEndPoint.prefix}/createHolidaySlot`;
};
export const deleteOutletHolidaySlotEndPoint = (apiEndPoint: IApiEndPoint) => {
    return `${environment.baseUrl}/${apiEndPoint.service}/vendor/${apiEndPoint.prefix}/holidaySlot`;
};
// APIs Endpoint for Menu
export const getMenuEndPoint = (apiEndPoint: IApiEndPoint) => {
    return `${environment.baseUrl}/${apiEndPoint.service}/vendor/menu`;
};

// (Category)
export const getMainCategoriesEndPoint = (apiEndPoint: IApiEndPoint) => {
    return `${environment.baseUrl}/${apiEndPoint.service}/vendor/menu/main_category`;
};
export const postMainCategoryEndPoint = (apiEndPoint: IApiEndPoint) => {
    return `${environment.baseUrl}/${apiEndPoint.service}/vendor/menu/main_category`;
};
export const putMainCategoryEndPoint = (id: number, apiEndPoint: IApiEndPoint) => {
    return `${environment.baseUrl}/${apiEndPoint.service}/vendor/menu/main_category/${id}`;
}
export const deleteMainCategoryEndPoint = (id: number, apiEndPoint: IApiEndPoint) => {
    return `${environment.baseUrl}/${apiEndPoint.service}/vendor/menu/main_category/${id}`;
}

export const postMainCategoryHolidaySlotEndPoint = (id: number, apiEndPoint: IApiEndPoint) => {
    return `${environment.baseUrl}/${apiEndPoint.service}/vendor/menu/main_category/${id}/createHolidaySlot`;
}
// (Sub-Category)
export const getSubCategoriesByCategoryIdEndPoint = (apiEndPoint: IApiEndPoint) => {
    return `${environment.baseUrl}/${apiEndPoint.service}/vendor/menu/sub_category`;
};
export const postSubCategoryEndPoint = (apiEndPoint: IApiEndPoint) => {
    return `${environment.baseUrl}/${apiEndPoint.service}/vendor/menu/sub_category`;
}
export const putSubCategoryEndPoint = (subCategoryId: number, apiEndPoint: IApiEndPoint) => {
    return `${environment.baseUrl}/${apiEndPoint.service}/vendor/menu/sub_category/${subCategoryId}`;
}
export const deleteSubCategoryEndPoint = (subCategoryId: number, apiEndPoint: IApiEndPoint) => {
    return `${environment.baseUrl}/${apiEndPoint.service}/vendor/menu/sub_category/${subCategoryId}`;
}
export const postSubCategoryHolidaySlotEndPoint = (subCategoryId: number, apiEndPoint: IApiEndPoint) => {
    return `${environment.baseUrl}/${apiEndPoint.service}/vendor/menu/sub_category/${subCategoryId}/createHolidaySlot`;
}

// (Item)
export const getItemByIdEndPoint = (itemId: number, apiEndPoint: IApiEndPoint) => {
    return `${environment.baseUrl}/${apiEndPoint.service}/vendor/menu/menu_item/${itemId}`;
}
export const postItemEndPoint = (apiEndPoint: IApiEndPoint) => {
    return `${environment.baseUrl}/${apiEndPoint.service}/vendor/menu/menu_item`;
}
export const putItemEndPoint = (itemId: number, apiEndPoint: IApiEndPoint) => {
    return `${environment.baseUrl}/${apiEndPoint.service}/vendor/menu/menu_item/${itemId}`;
}
export const deleteItemEndPoint = (itemId: number, apiEndPoint: IApiEndPoint) => {
    return `${environment.baseUrl}/${apiEndPoint.service}/vendor/menu/menu_item/${itemId}`;
}
export const postItemHolidaySlotEndPoint = (itemId: number, apiEndPoint: IApiEndPoint) => {
    return `${environment.baseUrl}/${apiEndPoint.service}/vendor/menu/menu_item/${itemId}/createHolidaySlot`;
}

// (Add-on Group)
export const getAddonGroupListEndPoint  = (apiEndPoint: IApiEndPoint) => {
    return `${environment.baseUrl}/${apiEndPoint.service}/vendor/menu/addon_group`;
};
export const postAddonGroupEndPoint = (apiEndPoint: IApiEndPoint) => {
    return `${environment.baseUrl}/${apiEndPoint.service}/vendor/menu/addon_group`;
}
export const putAddonGroupEndPoint = (id: number, apiEndPoint: IApiEndPoint) => {
    return `${environment.baseUrl}/${apiEndPoint.service}/vendor/menu/addon_group/${id}`;
}
export const deleteAddonGroupEndPoint = (id: number, apiEndPoint: IApiEndPoint) => {
    return `${environment.baseUrl}/${apiEndPoint.service}/vendor/menu/addon_group/${id}`;
}
export const postAddonGroupHolidaySlotEndPoint = (id: number, apiEndPoint: IApiEndPoint) => {
    return `${environment.baseUrl}/${apiEndPoint.service}/vendor/menu/addon_group/${id}/in_stock`;
}


// (Add-on)
export const getAddonByAddonGroupIdEndPoint = (apiEndPoint: IApiEndPoint) => {
    return `${environment.baseUrl}/${apiEndPoint.service}/vendor/menu/addon`;
}
export const postAddonEndPoint = (apiEndPoint: IApiEndPoint) => {
    return `${environment.baseUrl}/${apiEndPoint.service}/vendor/menu/addon`;
}
export const putAddonEndPoint = (id: number, apiEndPoint: IApiEndPoint) => {
    return `${environment.baseUrl}/${apiEndPoint.service}/vendor/menu/addon/${id}`;
}
export const deleteAddonEndPoint = (id: number, apiEndPoint: IApiEndPoint) => {
    return `${environment.baseUrl}/${apiEndPoint.service}/vendor/menu/addon/${id}`;
}

export const fileUploadEndPoint = (fileExtn: string) => {
    return `${environment.baseUrl}/core/common/getUploadURL/${fileExtn}`;
};

export const postAddonHolidaySlotEndPoint = (id: number, apiEndPoint: IApiEndPoint) => {
    return `${environment.baseUrl}/${apiEndPoint.service}/vendor/menu/addon/${id}/in_stock`;
}

// APIs Endpoints for Order
export const postOrderFilterEndPoint = (apiEndPoint: IApiEndPoint) => {
    return `${environment.baseUrl}/${apiEndPoint.service}/vendor/order/filter`;
}
export const getOrderByIdEndPoint = (id: number, apiEndPoint: IApiEndPoint) => {
    return `${environment.baseUrl}/${apiEndPoint.service}/vendor/order/${id}`;
}
export const postOrderAcceptanceStatusEndPoint = (id: number, apiEndPoint: IApiEndPoint) => {
    return `${environment.baseUrl}/${apiEndPoint.service}/vendor/order/${id}/accept`;
}
export const postOrderReadyStatusEndPoint = (id: number, apiEndPoint: IApiEndPoint) => {
    return `${environment.baseUrl}/${apiEndPoint.service}/vendor/order/${id}/ready`;
}
export const postCancelOrderEndPoint = (id: number, apiEndPoint: IApiEndPoint) => {
    return `${environment.baseUrl}/${apiEndPoint.service}/vendor/order/${id}/cancel`;
}
export const getCancellationReasonsEndPoint = (apiEndPoint: IApiEndPoint) => {
    return `${environment.baseUrl}/${apiEndPoint.service}/vendor/order/cancellation_reason`;
}

// APIs Endpoints for Discounts
export const postCouponEndPoint = (apiEndPoint: IApiEndPoint) => {
    return `${environment.baseUrl}/${apiEndPoint.service}/vendor/coupon`;
}
export const getOngoingCouponsEndPoint = (apiEndPoint: IApiEndPoint) => {
    return `${environment.baseUrl}/${apiEndPoint.service}/vendor/coupon/${apiEndPoint.prefix}`;
}
export const getNewAvailableCouponsEndPoint = (apiEndPoint: IApiEndPoint) => {
    return `${environment.baseUrl}/${apiEndPoint.service}/vendor/coupon/available_for_optin`;
}
export const postRestaurantOptinEndPoint = (apiEndPoint: IApiEndPoint) => {
    return `${environment.baseUrl}/${apiEndPoint.service}/vendor/coupon/${apiEndPoint.prefix}/optin`;
}
export const postRestaurantOptoutEndPoint = (apiEndPoint: IApiEndPoint) => {
    return `${environment.baseUrl}/${apiEndPoint.service}/vendor/coupon/${apiEndPoint.prefix}/optout`;
}
export const getAllCouponsEndPoint = (apiEndPoint: IApiEndPoint) => {
    return `${environment.baseUrl}/${apiEndPoint.service}/vendor/coupon/all`;
}

//API for Discount Sequence
export const putDiscountSequenceEndPoint = (apiEndPoint: IApiEndPoint) => {
    return `${environment.baseUrl}/${apiEndPoint.service}/vendor/coupon/${apiEndPoint.prefix}/sequence`;
}

// APIs Endpoints for Payouts
export const getPayoutAccountsDetailsEndPoint = (apiEndPoint: IApiEndPoint) => {
    return `${environment.baseUrl}/${apiEndPoint.service}/vendor/payout_account`;
}
export const postPayoutAccountEndPoint = (apiEndPoint: IApiEndPoint) => {
    return `${environment.baseUrl}/${apiEndPoint.service}/vendor/payout_account`;
}
export const getPayoutAccountDetailsByIdEndPoint = (id: string, apiEndPoint: IApiEndPoint) => {
    return `${environment.baseUrl}/${apiEndPoint.service}/vendor/payout_account/${id}`;
}
export const deletePayoutAccountDetailsByIdEndPoint = (id: string, apiEndPoint: IApiEndPoint) => {
    return `${environment.baseUrl}/${apiEndPoint.service}/vendor/payout_account/${id}`;
}
export const putVerifyPayoutAccountIfscCodeByIdEndPoint = (id: string, apiEndPoint: IApiEndPoint) => {
    return `${environment.baseUrl}/${apiEndPoint.service}/vendor/payout_account/${id}/verifyIfsc`;
}
export const putMakePrimaryPayoutAccountByIdEndPoint = (id: string, apiEndPoint: IApiEndPoint) => {
    return `${environment.baseUrl}/${apiEndPoint.service}/vendor/payout_account/${id}/makePrimary`;
}
export const postFilterPayoutsEndPoint = (apiEndPoint: IApiEndPoint) => {
    return `${environment.baseUrl}/${apiEndPoint.service}/vendor/payout/filter`;
}
export const postFilterPayoutSummaryEndPoint = (apiEndPoint: IApiEndPoint) => {
    return `${environment.baseUrl}/${apiEndPoint.service}/vendor/payout/summary`;
}
export const getPayoutDetailsByIdEndPoint = (id: string, apiEndPoint: IApiEndPoint) => {
    return `${environment.baseUrl}/${apiEndPoint.service}/vendor/payout/${id}`;
}

// APIs for customer reviews
export const postFilterRestaurantReviewsEndPoint = (apiEndPoint: IApiEndPoint) => {
    return `${environment.baseUrl}/${apiEndPoint.service}/vendor/${apiEndPoint.prefix}/review/filter`;
}

// API for Sales report
export const postFilterSalesReportEndPoint = (apiEndPoint: IApiEndPoint) => {
    return `${environment.baseUrl}/${apiEndPoint.service}/vendor/report/${apiEndPoint.prefix}/sales`;
}

// APIs for PUSH Notifications
export const postTokenForPushNotificationEndPoint = `${environment.baseUrl}/user/vendor/token`;
export const deleteTokenForPushNotificationEndPoint = (deviceId: string) => {
    return `${environment.baseUrl}/user/vendor/token/${deviceId}`;
}
export const postFilterPushNotificationsEndPoint = `${environment.baseUrl}/notification/vendor/push_notification/filter`;
export const postChangePushNotificationReadStatusEndPoint = `${environment.baseUrl}/notification/vendor/push_notification/change_read_status`;

// API for Refresh Token
export const postRefreshTokenEndPoint = `${environment.baseUrl}/user/token/refresh`;

// APIs for subscriptions
export const postFilterSubscriptionPlansEndPoint = (apiEndPoint: IApiEndPoint) => {
    return `${environment.baseUrl}/${apiEndPoint.service}/vendor/subscription/plan/filter`;
}
export const postFilterSubcriptionsEndPoint = (apiEndPoint: IApiEndPoint) => {
    return `${environment.baseUrl}/${apiEndPoint.service}/vendor/subscription/filter`;
}
export const postSubscriptionEndPoint = (apiEndPoint: IApiEndPoint) => {
    return `${environment.baseUrl}/${apiEndPoint.service}/vendor/subscription`;
}
export const postCancelSubscriptionEndPoint = (id: string, apiEndPoint: IApiEndPoint) => {
    return `${environment.baseUrl}/${apiEndPoint.service}/vendor/subscription/${id}/cancel`;
}
export const postFilterSubscriptionPaymentEndPoint = (apiEndPoint: IApiEndPoint) => {
    return `${environment.baseUrl}/${apiEndPoint.service}/vendor/subscription/payment/filter`;
}
export const postRetrySubscriptionPaymentByIdEndPoint = (id: string, apiEndPoint: IApiEndPoint) => {
    return `${environment.baseUrl}/${apiEndPoint.service}/vendor/subscription/${id}/retry_payment`;
}

// APIs for Slot time
export const getOutletSlotTimeEndPoint = (apiEndPoint: IApiEndPoint) => {
    return `${environment.baseUrl}/${apiEndPoint.service}/vendor/${apiEndPoint.prefix}/slot`;
}
export const putOutletSlotTimeEndPoint = (apiEndPoint: IApiEndPoint) => {
    return `${environment.baseUrl}/${apiEndPoint.service}/vendor/${apiEndPoint.prefix}/slot`;
}

// API for Global Var
export const getGlobalVarEndPoint = (apiEndPoint: IApiEndPoint) => {
    return `${environment.baseUrl}/${apiEndPoint.service}/vendor/globalVar`;
}

//API for Menu Sequence
export const putMainCategorySequenceEndPoint = (apiEndPoint: IApiEndPoint) => {
    return `${environment.baseUrl}/${apiEndPoint.service}/vendor/menu/main_category/sequence`;
}
export const putMenuSubCategorySequenceEndPoint = (apiEndPoint: IApiEndPoint,id:number) => {
    return `${environment.baseUrl}/${apiEndPoint.service}/vendor/menu/sub_category/sequence/${id}`;
}
export const putMenuItemSequenceEndPoint = (apiEndPoint: IApiEndPoint,id:number) => {
    return `${environment.baseUrl}/${apiEndPoint.service}/vendor/menu/menu_item/sequence/${id}`;
}
export const putVariantGroupSequenceEndPoint = (apiEndPoint: IApiEndPoint,id:number) => {
    return `${environment.baseUrl}/${apiEndPoint.service}/vendor/menu/item_variant_group/sequence/${id}`;
}
export const putItemVariantSequenceEndPoint = (apiEndPoint: IApiEndPoint,id:number) => {
    return `${environment.baseUrl}/${apiEndPoint.service}/vendor/menu/item_variant/sequence/${id}`;
}

// APIs for parent-child
export const getParentOutletEndPoint = (apiEndPoint: IApiEndPoint) => {
    return `${environment.baseUrl}/${apiEndPoint.service}/vendor/${apiEndPoint.prefix}/parent`; 
}
export const getChildOutletsEndPoint = (apiEndPoint: IApiEndPoint) => {
    return `${environment.baseUrl}/${apiEndPoint.service}/vendor/${apiEndPoint.prefix}/child`; 
}
// APIs for client logs
export const postClientLog = `${environment.baseUrl}/core/client_log`;

// API for grocery Master Category
export const getMasterCategoriesEndPoint = `${environment.baseUrl}/grocery/vendor/masterCategory`;

//APIs for sponsored rider
export const getSponsoredRiderOrdersEndPoint = (apiEndPoints: IApiEndPoint) => {
    return `${environment.baseUrl}/${apiEndPoints.service}/vendor/order/getSponsoredRiderOrders`;
}
export const getSponsoredAvailableRidersEndPont = (apiEndPoints: IApiEndPoint, orderId: string) => {
    return `${environment.baseUrl}/${apiEndPoints.service}/vendor/order/${orderId}/getSponsoredAvailableRiders`;
}
export const postAssignOrderToSponsoredRiderEndPoint = (apiEndPoints: IApiEndPoint, orderId: string) => {
    return `${environment.baseUrl}/${apiEndPoints.service}/vendor/order/${orderId}/assignOrderToSponsoredRider`;
}
export const postSurrenderSponsoredOrderEndPoint = (apiEndPoints: IApiEndPoint, orderId: string) => {
    return `${environment.baseUrl}/${apiEndPoints.service}/vendor/order/${orderId}/surrenderSponsoredOrder`;
}
export const postRemoveSponsoredRiderEndPoint = (apiEndPoints: IApiEndPoint, orderId: string) => {
    return `${environment.baseUrl}/${apiEndPoints.service}/vendor/order/${orderId}/removeSponsoredRider`
}

//APIs for grocery inquiry orders
export const postInquiryFilterOrdersEndPoint = (apiEndPoints: IApiEndPoint) => {
    return `${environment.baseUrl}/${apiEndPoints.service}/vendor/order/inquiry/filter`;
}
export const getInquiryOrderDetailsEndPoint = (apiEndPoints: IApiEndPoint, inquiryOrderId: number) => {
    return `${environment.baseUrl}/${apiEndPoints.service}/vendor/order/inquiry/${inquiryOrderId}`;
}
export const putInquiryOrderDetailsEndPoint = (apiEndPoints: IApiEndPoint, inquiryOrderId: number) => {
    return `${environment.baseUrl}/${apiEndPoints.service}/vendor/order/inquiry/${inquiryOrderId}`;
}
export const postGetItemsBySearch = (apiEndPoints: IApiEndPoint) => {
    return `${environment.baseUrl}/${apiEndPoints.service}/vendor/menu/search`
}