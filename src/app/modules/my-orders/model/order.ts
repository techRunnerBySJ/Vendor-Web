import { formatNum } from "src/app/shared/functions/modular.functions";

//class for order details
export class Order {
    orderId: number;
    anySpecialRequest: string;
    cancellationDetails: any;
    cancellationTime: string;
    cancelledBy: CancelledBy;
    couponId: string;
    createdAt: Date;
    timerEndTime: Date;
    orderMarkedReadyTime: Date
    timeLeft: string;
    acceptanceTimeInMilliSecs: number;
    progressbarWidth: number;
    isTimerAlert: boolean = false;
    isTimerDanger: boolean = false;
    customerOrderCount: number;
    customerDetails: CustomerDetails;
    deliveryCharges: number;
    deliveryStatus: DeliveryStatus;
    deliveryTime: number;
    deliveryTip: number;
    offerDiscount: number;
    orderAcceptanceStatus: OrderAcceptanceStatus;
    orderItems: OrderItem[] = [];
    orderRating: number;
    orderStatus: OrderStatus;
    // orderItemTotalPrice: number = 0;
    packagingCharge: number;
    // totalBill: number;
    updatedAt: string;
    pickupETA: number;
    dropETA: number;
    riderName: string;
    riderContact: string;
    vendorAcceptedTime: Date;
    preparationTimerEndTime: Date;
    preparationTimeInMilliSecs: number;
    preparationTimeLeft: string;
    outletId: string;
    outletName: string;
    couponDetails: CouponDetails;
    orderReviewComments: string;
    orderReviewedTime: string;
    orderPlacedTime: string;
    refundDetails: RefundDetails;
    invoiceDetails: Invoice;
    cancellationReason: string;
    paymentStatus: string;
    isPod: boolean;
    customerInvoice: CustomerInvoiceSection = new CustomerInvoiceSection();
    vendorInvoice: VendorInvoiceSection = new VendorInvoiceSection();

    static fromJson(data): Order {
        const o: Order = new Order();

        o['anySpecialRequest'] = data['any_special_request'];
        o['cancellationDetails'] = data['cancellation_details'];
        o['cancellationTime'] = data['cancellation_time'];
        o['cancelledBy'] = CancelledBy[data['cancelled_by']];
        o['couponId'] = data['coupon_id'];
        o['createdAt'] = new Date(data['created_at']);
        o['timerEndTime'] = new Date(data['vendor_accepted_end_time']);
        if (data['vendor_ready_marked_time']) {
            o['orderMarkedReadyTime'] = new Date(data['vendor_ready_marked_time']);
        }
        o['acceptanceTimeInMilliSecs'] = new Date(data['vendor_accepted_end_time']).getTime() - new Date(data['vendor_accepted_start_time']).getTime();
        o['preparationTimeInMilliSecs'] = data['preparation_time'] * 60000 //converting mins to milli secs
        if (data['vendor_accepted_time']) {
            o['vendorAcceptedTime'] = new Date(data['vendor_accepted_time']);
            o['preparationTimerEndTime'] = new Date(o['vendorAcceptedTime'].getTime() + o['preparationTimeInMilliSecs']);
        }
        if (data['customer_address']) {
            o['customerDetails'] = CustomerDetails.fromJson(data['customer_address']);
        }
        o['customerOrderCount'] = data['customer_order_count'];
        o['deliveryCharges'] = data['delivery_charges'];
        o['deliveryStatus'] = data['delivery_status'];
        o['deliveryTime'] = data['order_delivered_at'];
        o['deliveryTip'] = data['delivery_tip'];
        o['offerDiscount'] = data['offer_discount'];
        o['orderAcceptanceStatus'] = data['order_acceptance_status'];
        o['orderId'] = data['order_id'];
        o['orderRating'] = data['order_rating'];
        o['orderStatus'] = data['order_status'];
        o['packagingCharge'] = data['packing_charges'];
        o['updatedAt'] = data['updated_at'];
        o['pickupETA'] = data['pickup_eta'];
        o['dropETA'] = data['drop_eta'];
        o['riderName'] = data['delivery_details']?.['rider_name'];
        o['riderContact'] = data['delivery_details']?.['rider_contact'];
        o['outletId'] = data['restaurant_id'] || data['store_id'] || data['outlet_id'];
        o['outletName'] = data['restaurant_details']?.['restaurant_name'] || data['store_details']?.['store_name'] || data['outlet_details']?.['outlet_name'];
        o['orderReviewComments'] = data['comments'];
        o['orderReviewedTime'] = data['reviewed_at'];
        o['orderPlacedTime'] = data['order_placed_time'];

        if (data['invoice_breakout']['coupon_details']) {
            o['couponDetails'] = CouponDetails.fromJson(data['invoice_breakout']['coupon_details']);
        }

        if (data['invoice_breakout']['refund_settlement_details']) {
            o['refundDetails'] = RefundDetails.fromJson(data['invoice_breakout']['refund_settlement_details']);
        }

        o['invoiceDetails'] = Invoice.fromJson(data['invoice_breakout']);

        data['order_items']?.forEach((oi, index) => {
            const orderItem: OrderItem = new OrderItem();
            orderItem['orderItemId'] = oi['order_item_id'];
            orderItem['orderItemName'] = oi['name'];
            orderItem['orderItemPackagingCharges'] = oi['packing_charges'];
            orderItem['orderItemPrice'] = oi['price'];
            orderItem['orderItemQuantity'] = oi['quantity'];
            orderItem['orderItemFoodType'] = oi['veg_egg_non'];
            
            // if sequence key exists in menuItems array then we'll get miIndex > 0 and will take item cost from menuItems of that index,
            // otherwise we'll use current order_items's 'index' as 'miIndex' to take item cost from menuItems array
            const menuItems: any[] = data['invoice_breakout']['menu_items'];
            let miIndex = menuItems.findIndex(mi => mi.sequence && mi.sequence === oi.sequence);
            if (miIndex < 0) {
                miIndex = index;
            }
            orderItem['orderItemFinalPrice'] = 
                menuItems[miIndex]['total_individual_food_item_cost'] 
                ? formatNum(menuItems[miIndex]['total_individual_food_item_cost']) : formatNum(menuItems[miIndex]['total_individual_item_cost']);

            if (oi['variant_groups']) {
                oi['variant_groups'].forEach(vg => {
                    vg['variants'].forEach(variant => {
                        const orderVariant: OrderVariant = new OrderVariant();
                        orderVariant['orderVariantGroupId'] = vg['variant_group_id'];
                        orderVariant['orderVariantGroupName'] = vg['variant_group_name'];
                        orderVariant['orderVaraintId'] = variant['variant_id'];
                        orderVariant['orderVaraintName'] = variant['variant_name'];
                        orderVariant['orderVariantPrice'] = variant['price'];
                        orderVariant['orderVariantFoodType'] = variant['veg_egg_non'];
                        // orderItem['orderItemFinalPrice'] = orderItem['orderItemFinalPrice'] + orderVariant['orderVariantPrice'];
                        orderItem['orderVariants'].push(orderVariant);
                    })
                })
            }
            if (oi['addon_groups']) {
                oi['addon_groups'].forEach(ag => {
                    ag['addons'].forEach(addon => {
                        const orderAddon: OrderAddOn = new OrderAddOn();
                        orderAddon['orderAddonGroupId'] = ag['addon_group_id'];
                        orderAddon['orderAddonGroupName'] = ag['addon_group_name'];
                        orderAddon['orderAddonId'] = addon['addon_id'];
                        orderAddon['orderAddonName'] = addon['addon_name'];
                        orderAddon['orderAddonPrice'] = addon['price'];
                        orderAddon['orderAddonFoodType'] = addon['veg_egg_non'];
                        // orderItem['orderItemFinalPrice'] = orderItem['orderItemFinalPrice'] + orderAddon['orderAddonPrice'];
                        orderItem['orderAddons'].push(orderAddon);
                    })
                })
            }
            // o['orderItemTotalPrice'] = o['orderItemTotalPrice'] + orderItem['orderItemFinalPrice'];
            o['orderItems'].push(orderItem);
        });
        if(data['cancellation_details']){
            o['cancellationReason'] = data['cancellation_details']['cancellation_reason'];
        }
        o['paymentStatus'] = data['payment_status'];
        o['isPod'] = data['is_pod'];

    //Display Invoice Breakout
    if(data['display_invoice_breakout']){
    const customerInvoiceSection = data['display_invoice_breakout']['vendor_invoice']['customer_section'];
    o['customerInvoice']['totalPayableAmount'] = DisplayInvoiceBreakout.fromJson(customerInvoiceSection['total_payable_amount']);
    for (const i of customerInvoiceSection['payable_amount_line_items']) {
        o['customerInvoice']['payableAmountLineItems'].push(DisplayInvoiceBreakout.fromJson(i)) ;
    }
    const vendorInvoiceSection = data['display_invoice_breakout']['vendor_invoice']['vendor_section'];
    o['vendorInvoice']['totalPayoutAmount'] = DisplayInvoiceBreakout.fromJson(vendorInvoiceSection['total_payout_amount']);
    for ( const i of vendorInvoiceSection['payout_amount_line_items']) {
        o['vendorInvoice']['payoutAmountLineItems'].push(DisplayInvoiceBreakout.fromJson(i));
    }
}
        return o;
    }
}

//class for customer details
export class CustomerDetails {
    id: string;
    name: string;
    phone: string;
    alternatePhone: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    country: string;
    pinCode: string;
    addressId: string;
    directions: string;
    lat: string;
    long: string;

    static fromJson(data: any): CustomerDetails {
        const c: CustomerDetails = new CustomerDetails();
        c['id'] = data['customer_id'];
        c['name'] = data['customer_name'];
        c['phone'] = data['phone'];
        c['alternatePhone'] = data['alternate_phone'];
        c['addressLine1'] = data['house_flat_block_no'];
        c['addressLine2'] = data['apartment_road_area'];
        c['city'] = data['city'];
        c['state'] = data['state'];
        c['country'] = data['country'];
        c['pinCode'] = data['pincode'];
        c['addressId'] = data['id'];
        c['directions'] = data['directions'];
        c['lat'] = data['latitude'];
        c['long'] = data['longitude'];
        return c;
    }
}

export class CouponDetails {
    couponId: number;
    couponCode: string;
    discountAmount: string;
    discountPercentage: number;
    speedyyDiscountShareAmount: string;
    speedyyDiscountSharePercentage: number;
    vendorDiscountShareAmount: string;
    vendorDiscountSharePercentage: number;
    discountLevel: string;
    discountType: string;
    maxDiscountAmount: string;
    minOrderValue: number;

    static fromJson(data: any): CouponDetails {
        const c: CouponDetails = new CouponDetails();
        c['couponId'] = data['coupon_id'];
        c['couponCode'] = data['code'];
        c['discountAmount'] = formatNum(data['discount_amount_applied']);
        c['discountPercentage'] = data['discount_percentage'];
        c['speedyyDiscountShareAmount'] = formatNum(data['discount_share_amount_speedyy']);
        c['speedyyDiscountSharePercentage'] = data['discount_share_percentage_speedyy'];
        c['vendorDiscountShareAmount'] = formatNum(data['discount_share_amount_vendor']);
        c['vendorDiscountSharePercentage'] = data['discount_share_percentage_vendor'];
        c['discountLevel'] = data['level'];
        c['discountType'] = data['type'];
        c['maxDiscountAmount'] = formatNum(data['max_discount_rupees']);
        c['minOrderValue'] = data['min_order_value_rupees'];
        return c;
    }
}

export class RefundDetails {
    vendorPayoutAmount: string;
    deliveryPartnerAmount: string;
    customerRefundableAmount: string;
    remarksForVendor: string;
    remarksForDeliveryPartner: string;
    remarksForCustomer: string;

    static fromJson(data: any): RefundDetails {
        const r: RefundDetails = new RefundDetails();
        r['vendorPayoutAmount'] = formatNum(data['refund_settled_vendor_payout_amount']);
        r['deliveryPartnerAmount'] = formatNum(data['refund_settled_delivery_charges']);
        r['customerRefundableAmount'] = formatNum(data['refund_settled_customer_amount']);
        r['remarksForVendor'] = data['refund_settlement_note_to_vendor'];
        r['remarksForDeliveryPartner'] = data['refund_settlement_note_to_delivery_partner'];
        r['remarksForCustomer'] = data['refund_settlement_note_to_customer'];
        return r;
    }
}

export class Invoice {
    version: string;
    totalCustomerPayable: string;
    totalItemCost: string;
    totalPackingCharges: string;
    totalTax: string;
    txnCharges: string;
    txnChargesRate: number;
    deliveryCharges: string;
    deliveryChargesPaidBy: string;
    vendorPayoutAmount: string;
    isSpeedyyChargesApplied: boolean;
    transactionChargesPaidBy: string;
    totalSpeedyyCharges: string; //amount + taxes
    speedyyChargesForCustomer: string; // Currently only for PAAN
    deliveryBreakoutCustomerSharingAmount: string;
    deliveryBreakoutVendorSharingAmount: string;
    deliveryBreakoutSpeedyySharingAmount: string;

    static fromJson(data: any): Invoice {
        const i: Invoice = new Invoice();
        i['version'] = data['description']['version'];
        i['totalCustomerPayable'] = formatNum(data['total_customer_payable']);
        i['totalItemCost'] = formatNum(data['total_food_cost']) || formatNum(data['total_cost']);
        i['totalPackingCharges'] = formatNum(data['total_packing_charges']);
        i['totalTax'] = formatNum(data['total_tax']);
        i['txnCharges'] = formatNum(data['transaction_charges']);
        i['txnChargesRate'] = data['transaction_charges_rate'];
        i['deliveryCharges'] = formatNum(data['delivery_charges']);
        i['deliveryChargesPaidBy'] = data['delivery_charge_paid_by'];
        i['vendorPayoutAmount'] = formatNum(data['vendor_payout_amount']);
        i['isSpeedyyChargesApplied'] = data['speedyy_charge_applied'];
        i['transactionChargesPaidBy'] = data['transaction_charges_paid_by'];
        if (data['speedyy_charge_applied']) i['totalSpeedyyCharges'] = formatNum(data['speedyy_charge_amount_with_tax']);
        i['speedyyChargesForCustomer'] = formatNum(data['speedyy_charge_for_customer']);
        // i['deliveryBreakoutCustomerSharingAmount'] = formatNum(data['delivery_breakout']['applied_details']['amounts']['customer_share_amount']);
        // i['deliveryBreakoutSpeedyySharingAmount'] = formatNum(data['delivery_breakout']['applied_details']['amounts']['speedyy_share_amount']);
        // i['deliveryBreakoutVendorSharingAmount'] = formatNum(data['delivery_breakout']['applied_details']['amounts']['vendor_share_amount']);
        return i;
    }
}

//class for order item details
export class OrderItem {
    orderItemId: number;
    orderItemName: string;
    orderItemPackagingCharges: number;
    orderItemPrice: number;
    orderItemFinalPrice: string;
    orderItemQuantity: number;
    orderItemFoodType: string;
    orderVariants: OrderVariant[] = [];
    orderAddons: OrderAddOn[] = [];
}

//class for order variant details
export class OrderVariant {
    orderVariantGroupId: number;
    orderVariantGroupName: string;
    orderVaraintId: number;
    orderVaraintName: string;
    orderVariantPrice: number;
    orderVariantFoodType: string;
}

//class for order add on details
export class OrderAddOn {
    orderAddonGroupId: number;
    orderAddonGroupName: string;
    orderAddonId: number;
    orderAddonName: string;
    orderAddonPrice: number;
    orderAddonFoodType: string;
}

export class CancellationReason {
    id: number;
    userType: string;
    cancellationReason: string;

    static fromJson(data): CancellationReason {
        const c: CancellationReason = new CancellationReason();

        c['id'] = data['id'];
        c['userType'] = data['user_type'];
        c['cancellationReason'] = data['cancellation_reason'];
        return c;
    }
}

export class CancellationPolicy {
    note: string;
    tnc: string;

    static fromJson(data: any): CancellationPolicy {
        const c: CancellationPolicy = new CancellationPolicy();

        c['note'] = data['note'];
        c['tnc'] = data['terms_conditions'];
        return c;
    }
}

export type OrderAction = 'accept' | 'reject' | 'mark ready' | 'cancel';

export type OrderAcceptanceStatus = 'pending' | 'accepted' | 'rejected';
export type OrderStatus = 'pending' | 'placed' | 'completed' | 'cancelled';
export type DeliveryStatus = 'pending' | 'accepted' | 'rejected' | 'allocated' 
    | 'arrived' | 'dispatched' | 'arrived_customer_doorstep' | 'delivered' | 'cancelled';

export enum CancelledBy {
    vendor = 'Vendor',
    admin = 'Admin',
    customer = 'Customer',
    delivery_service = 'Delivery Partner',

}

class DisplayInvoiceBreakout {
    displayLabel: string;
    displayLabelColor: string;
    amount: number;
    amountColor: string;
    isStrikethrough: boolean;
    breakoutLabel: string;
    breakoutDetails: [];

    static fromJson(data): DisplayInvoiceBreakout {
        const d: DisplayInvoiceBreakout =new DisplayInvoiceBreakout();

        d['displayLabel'] = data['display_label'];
        d['displayLabelColor'] = data['display_label_color'];
        d['amount'] = data['amount'];
        d['amountColor'] = data['amount_color'];
        d['isStrikethrough'] = data['is_strikethrough'];
        d['breakoutLabel'] = data['breakout_label'];
        d['breakoutDetails'] = data['breakout_details'];
        return d
    }
}

class CustomerInvoiceSection {
    totalPayableAmount: DisplayInvoiceBreakout = new DisplayInvoiceBreakout();
    payableAmountLineItems: DisplayInvoiceBreakout[] = [];
}

class VendorInvoiceSection {
    totalPayoutAmount: DisplayInvoiceBreakout = new DisplayInvoiceBreakout();
    payoutAmountLineItems: DisplayInvoiceBreakout[] = [];
}
