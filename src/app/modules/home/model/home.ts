import { IRouteAccess } from './../../../shared/models/constants/constant.type';
import * as moment from "moment";
import { Role, Services } from "src/app/shared/models";
import { DeliveryStatus, OrderAcceptanceStatus, OrderStatus } from "../../my-orders/model/order";

export class NotificationData {
    id: number;
    title: string;
    body: string;
    orderId: number; // temporary => you might want to create seprate interface for 'content -> notification -> data' [coming from backend]
    markAsRead: boolean;
    priority: string;
    createdAt: string;
    updatedAt: string;
    inquireOrderId: number;

    static fromJson(data: any): NotificationData {
        const n: NotificationData = new NotificationData();
        n['id'] = data['id'];
        n['title'] = data['content']['notification']['title'];
        n['body'] = data['content']['notification']['body'];
        n['orderId'] = data['content']['notification']['data']['order_id'];
        n['markAsRead'] = data['mark_as_read'];
        n['priority'] = data['priority'];
        n['createdAt'] = moment(data['created_at']).fromNow();
        n['updatedAt'] = data['updated_at'];
        n['inquireOrderId'] = data['content']['notification']['data']['inquiry_order_id'];

        return n;
    }
}

export interface INavLink {
    name: string;
    icon?: string;
    route?: string;
    allowedRouteAccessTo: IRouteAccess;
}

export const navLinks: INavLink[] = [
    {
        name: 'my orders',
        route: 'my-orders',
        icon: 'assets/icons/my-orders-icon.svg',
        allowedRouteAccessTo:{
            service:[Services.Food, Services.Flower, Services.Paan, Services.Pharmacy, Services.Pet],
            role:['owner', 'manager']
        }
    },
    {
        name: 'my orders',
        route: 'grocery-orders',
        icon: 'assets/icons/my-orders-icon.svg',
        allowedRouteAccessTo:{
            service:[Services.Grocery],
            role:['owner', 'manager']
        }
    },
    {
        name: 'business',
        route: 'business',
        icon: 'assets/icons/business-icon.svg',
        allowedRouteAccessTo:{
            service:[Services.Food, Services.Flower, Services.Grocery, Services.Paan, Services.Pharmacy, Services.Pet],
            role:['owner']
        }
    },
    {
        name: 'Delivery',
        route: 'delivery',
        icon: 'assets/icons/rider-icon.svg',
        allowedRouteAccessTo:{
            service:[Services.Food],
            role:['owner', 'manager']
        }
    },
    {
        name: 'Order history',
        route: 'order-history',
        icon: 'assets/icons/history-icon.svg',
        allowedRouteAccessTo:{
            service:[Services.Food, Services.Flower, Services.Grocery, Services.Paan, Services.Pharmacy, Services.Pet],
            role:['owner', 'manager']
        }
    },
    {
        name: 'menu',
        route: 'menu',
        icon: 'assets/icons/menu-icon.svg',
        allowedRouteAccessTo:{
            service:[Services.Food, Services.Flower, Services.Grocery, Services.Paan, Services.Pharmacy, Services.Pet],
            role:['owner', 'manager']
        }
    },
    // {
    //     name: 'subscription',
    //     route: 'subscription',
    //     icon: 'assets/icons/subscription-icon.svg',
    //     allowedRouteAccessTo: ['owner']
    // },
    {
        name: 'more',
        route: 'more',
        icon: 'assets/icons/more-icon.svg',
        allowedRouteAccessTo:{
            service:[Services.Food, Services.Flower, Services.Grocery, Services.Paan, Services.Pharmacy, Services.Pet],
            role:['owner', 'manager']
        }
    },
    
];

export class Outlet {
    id: string;
    name: string;
    // ratingOrderCount: number;
    isLongDistanceAllowed: boolean;
    isOpen: boolean;
    isInHolidaySlot: boolean;
    holidaySlotCreatedBy: string;
    nextOpensAt: string;
    closingAt: string;
    bankAccountNumber: string;
    bankIfscCode: string;
    bankDocName: string;
    bankDocUrl: string;
    businessName: string;
    businessAddress: string;
    city: string;
    contactNumber: string;
    costOfTwo: number;
    defaultPrepTime: number;
    fssaiCertNumber: string;
    fssaiCertUrl: string;
    fssaiAckNumber: string;
    fssaiAckUrl: string;
    fssaiFirmName: string;
    fssaiFirmAddress: string;
    gstUrl: string;
    outletPrimaryImage: IOutletImage = <IOutletImage>{};
    outletAdditionalImages: IOutletImage[] = [];
    invoiceEmailId: string;
    kycDocName: string;
    kycDocUrl: string;
    address: string;
    ownerContactNumber: string;
    ownerEmailId: string;
    managerContactNumber: string;
    managerEmailId: string;
    panNumber: string;
    panDocName: string;
    panDocUrl: string;
    panOwnerName: string;
    rating: number;
    packagingChargesType: PackagingChargesTypes;
    customItemLevalPackagingCharges: boolean;
    posId: string;
    posPartner:string;
    likeCount: number;
    dislikeCount: number;
    deliveryChargesPaidBy: DeliveryChargesPaidBy;
    branchName: string;
    parentOrChild: ParentOrChild;
    discountRate: number;
    hasFssaiCertificate: boolean;
    type: string;
    isDeliveryChargesPaidByOutlet: boolean;
    minOrderValForFreeDeliveryByOutlet: number;
    gstCategory: string;
    hasSponsoredRider: boolean;
    turnDebugModeOn: boolean;
    packgingChargeSlabApplied: boolean;

    static fromJson(data: any, service: string): Outlet {
        const o: Outlet = new Outlet();

        o['id'] = data['id'];
        o['name'] = data['name'];
        // o['ratingOrderCount'] = data['all_time_rating_order_count'];
        o['isLongDistanceAllowed'] = data['allow_long_distance'];
        o['isOpen'] = data['availability']['is_open'];
        o['isInHolidaySlot'] = data['availability']['is_holiday']
        o['holidaySlotCreatedBy'] = data['availability']['created_by']
        o['nextOpensAt'] = data['availability']['next_opens_at']
        o['closingAt'] = data['availability']['closing_at']
        o['bankAccountNumber'] = data['bank_account_number'];
        o['bankIfscCode'] = data['ifsc_code'];
        o['bankDocName'] = data['bank_document']['name'];
        o['bankDocUrl'] = data['bank_document']['url'];
        o['businessName'] = data['business_name'];
        o['businessAddress'] = data['business_address'];
        o['city'] = data['city'];
        o['contactNumber'] = data['contact_number'];
        o['costOfTwo'] = data['cost_of_two'];
        o['defaultPrepTime'] = data['default_preparation_time'];
        o['fssaiCertNumber'] = data['fssai_cert_number'];
        o['fssaiCertUrl'] = data['fssai_cert_document']?.['url'];
        o['fssaiAckNumber'] = data['fssai_ack_number'];
        o['fssaiAckUrl'] = data['fssai_ack_document']?.['url'];
        o['fssaiFirmName'] = data['fssai_firm_name'];
        o['fssaiFirmAddress'] = data['fssai_firm_address'];
        o['gstUrl'] = data['gstin_document']?.['url'];
        o['outletPrimaryImage']['name'] = data['image']?.['name'];
        o['outletPrimaryImage']['url'] = data['image']?.['url'];
        data['images']?.forEach(i => {
            const image = <IOutletImage>{};
            image['name'] = i['name'];
            image['url'] = i['url'];
            o['outletAdditionalImages'].push(image);
        })
        o['invoiceEmailId'] = data['invoice_email'];
        o['kycDocName'] = data['kyc_document']['name'];
        o['kycDocUrl'] = data['kyc_document']['url'];
        o['address'] = data['location'];
        o['ownerContactNumber'] = data['owner_contact_number'];
        o['ownerEmailId'] = data['owner_email'];
        o['managerContactNumber'] = data['manager_contact_number'];
        o['managerEmailId'] = data['manager_email'];
        o['panNumber'] = data['pan_number'];
        o['panDocName'] = data['pan_document']['name'];
        o['panDocUrl'] = data['pan_document']['url'];
        o['panOwnerName'] = data['pan_owner_name'];
        o['rating'] = data['rating'];
        o['packagingChargesType'] = data['packing_charge_type'];
        o['customItemLevalPackagingCharges'] = data['custom_packing_charge_item'];
        o['posId'] = data['pos_id'];
        o['pospartner'] = data['pos_partner']
        o['likeCount'] = data['like_count'];
        o['dislikeCount'] = data['dislike_count'];
        o['deliveryChargesPaidBy'] = data['delivery_charge_paid_by'];
        o['branchName'] = data['branch_name'];
        o['parentOrChild'] = data['parent_or_child'];
        o['discountRate'] = data['discount_rate'];
        o['hasFssaiCertificate'] = data['fssai_has_certificate'];
        o['type'] = outletTypeList[data['type']];
        o['isDeliveryChargesPaidByOutlet'] = data['delivery_charge_paid_by_restaurant'] ?? data['delivery_charge_paid_by_store'];
        o['minOrderValForFreeDeliveryByOutlet'] = data['min_order_value_for_restaurant_free_delivery'] || data['min_order_value_for_store_free_delivery'];
        o['gstCategory'] = data['gst_category'];
        o['hasSponsoredRider'] = data['has_sponsored_rider'];
        if(service === Services.Food){
        o['turnDebugModeOn'] = data['turn_debug_mode_on'];
        o['packgingChargeSlabApplied'] = data['packging_charge_slab_applied'];
        }
        return o;
    }

}

export type PackagingChargesTypes = 'item' | 'order' | 'none';

export type DeliveryChargesPaidBy = 'customer' | 'restaurant';

export type ParentOrChild = 'parent' | 'child';

export interface IOutletImage {
    name: string;
    url?: string;
}

export interface ISocketEventEmitter {
    type: SocketEventTypes;
    socketData?: SocketOrderDetails;
}

export type SocketEventTypes = 'ORDER_PLACED' | 'DELIVERY_ORDER_STATUS' | 'DELIVERY_RIDER_STATUS' | 'ORDER_CANCELLED' | 'RIDER_ORDER_REJECTED' | 'RIDER_ORDER_IGNORED' | 'RIDER_ORDER_ACCEPTED' | 'NEW_ORDER_INQUIRY'


export class SocketOrderDetails {
    orderId: number | string;
    orderAcceptanceStatus: OrderAcceptanceStatus;
    orderStatus: OrderStatus;
    deliveryStatus: DeliveryStatus;
    pickupETA: number;
    dropETA: number;
    riderId: string;
    riderName: string;
    riderContact: string;
    riderLat: number;
    riderLong: number;
    cancelledBy: string;
    cancellationReason: string;
    sponsorOrderId: number
    
    static fromJson(data: any): SocketOrderDetails {
        const s: SocketOrderDetails = new SocketOrderDetails();

        s['orderId'] = data['order_id'];
        s['orderAcceptanceStatus'] = data['order_acceptance_status'];
        s['orderStatus'] = data['order_status'];
        s['deliveryStatus'] = data['delivery_status'];
        s['pickupETA'] = data['pickup_eta'];
        s['dropETA'] = data['drop_eta'];
        s['riderId'] = data['rider_id'];
        s['riderName'] = data['rider_name'];
        s['riderContact'] = data['rider_contact'];
        s['riderLat'] = data['rider_latitude'];
        s['riderLong'] = data['rider_longitude'];
        s['cancelledBy'] = data['cancelled_by'];
        s['cancellationReason'] = data['cancellation_details']?.['cancellation_reason'];
        s['sponsorOrderId'] = data['order']?.['id'];

        return s;
    }
}

export interface IProfileDropdownLink {
    name: string;
    route: string;
    icon: string;
    allowedRouteAccessTo: Role[];
}

export const profileDropdownLinks: IProfileDropdownLink[] = [
    {
        name: 'profile',
        route: 'more',
        icon: 'assets/icons/profile-icon.svg',
        allowedRouteAccessTo: ['owner', 'manager']
    },
    {
        name: 'payouts',
        route: 'business/view-payouts',
        icon: 'assets/icons/payout.svg',
        allowedRouteAccessTo: ['owner']
    },
    {
        name: 'slot time',
        route: 'more/slot-time',
        icon: 'assets/icons/slot-time.svg',
        allowedRouteAccessTo: ['owner', 'manager']
    },
    {
        name: 'outlet info',
        route: 'more/outlet-info',
        icon: 'assets/icons/outlet-info-icons.svg',
        allowedRouteAccessTo: ['owner', 'manager']
    }
];
export type OutletType ='restaurant' | 'tea_and_coffee' | 'bakery';
export const outletTypeList: { [key in OutletType]: string } = {
  restaurant: 'Restaurant',
  tea_and_coffee: 'Tea & Coffee',
  bakery: 'Bakery',
};