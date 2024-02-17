import * as moment from "moment";

export class SubscriptionPlan {
    id: string;
    name: string;
    amount: number;
    type: PlanType;
    category: PlanCategory;
    description: string;
    intervalType: PlanIntervalType;
    intervalCount: number;
    maxCycles: number;
    ordersCount: number;
    gracePeriodOrdersCount: number;
    tnc: string;
    isActive: boolean;

    static fromJson(data: any): SubscriptionPlan {
        const s: SubscriptionPlan = new SubscriptionPlan();

        s['id'] = data['id'];
        s['name'] = data['name'];
        s['amount'] = data['amount'];
        s['type'] = PlanType[data['type']];
        s['category'] = PlanCategory[data['category']];
        s['description'] = data['description'];
        s['intervalType'] = PlanIntervalType[data['interval_type']];
        s['intervalCount'] = data['intervals'];
        s['maxCycles'] = data['max_cycles'];
        s['ordersCount'] = data['no_of_orders'];
        s['gracePeriodOrdersCount'] = data['no_of_grace_period_orders'];
        s['tnc'] = data['terms_and_conditions'];
        s['isActive'] = data['active'];
        return s;
    }
}

export class Subscription {
    id: string;
    externalSubscriptionId: string;
    authAmount: number;
    authLink: string;
    authStatus: SubscriptionAuthStatus;
    cancellationReason: string;
    cancellationUserId: string;
    cancelledBy: SubscriptionCancelledBy;
    currentCycle: number;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    startDate: string;
    endDate: string;
    nextPaymentDate: string;
    planId: string;
    planName: string;
    outletId: string;
    outletName: string;
    planType: PlanType;
    status: string;
    remainingOrders: number;
    remainingGracePeriodOrders: number;
    ordersBought: number;
    allottedGracePeriodOrders: number;
    ordersConsumed: number;
    onGracePeriod: boolean;


    static fromJson(data: any): Subscription {
        const s: Subscription = new Subscription();

        s['id'] = data['id'];
        s['externalSubscriptionId'] = data['external_subscription_id'];
        s['authAmount'] = data['authorization_amount'];
        s['authLink'] = data['authorization_details']?.['authorization_link'];
        s['authStatus'] = SubscriptionAuthStatus[data['authorization_status']] || 'N/A';
        s['cancellationReason'] = data['cancellation_details']?.['cancellation_reason'];
        s['cancellationUserId'] = data['cancellation_user_id'];
        s['cancelledBy'] = SubscriptionCancelledBy[data['cancelled_by']];
        s['currentCycle'] = data['current_cycle'];
        s['customerName'] = data['customer_name'];
        s['customerPhone'] = data['customer_phone'];
        s['customerEmail'] = data['customer_email'];
        s['startDate'] = convertDate(data['start_time']);
        s['endDate'] = convertDate(data['end_time']);
        s['nextPaymentDate'] = convertDate(data['next_payment_on']);
        s['planId'] = data['plan_id'];
        s['planName'] = data['plan_name'];
        s['outletId'] = data['restaurant_id'] || data['store_id'] || data['outlet_id'];
        s['outletName'] = data['restaurant_name'];
        s['planType'] = PlanType[data['plan_type']];
        s['status'] = SubscriptionStatusList[data['status']];
        s['remainingOrders'] = data['subscription_remaining_orders'];
        s['remainingGracePeriodOrders'] = data['subscription_grace_period_remaining_orders'];
        s['ordersBought'] = data['no_of_orders_bought'];
        s['allottedGracePeriodOrders'] = data['no_of_grace_period_orders_allotted'];
        s['ordersConsumed'] = data['no_of_orders_consumed'];
        s['onGracePeriod'] = data['grace_period'];
        return s;
    }
}

export class SubscriptionPayment {
    id: number;
    subscriptionId: string;
    externalPaymentId: string;
    amount: number;
    currentCycle: number;
    failureReason: string;
    outletId: string;
    status: SubscriptionPaymentStatus;
    scheduledDate: string;
    txnDate: string;
    planName: string;
    static fromJson(data: any): SubscriptionPayment {
        const s: SubscriptionPayment = new SubscriptionPayment();

        s['id'] = data['id'];
        s['subscriptionId'] = data['subscription_id'];
        s['externalPaymentId'] = data['external_payment_id'];
        s['amount'] = data['amount'];
        s['currentCycle'] = data['cycle'];
        s['failureReason'] = data['failure_reason'];
        s['outletId'] = data['restaurant_id'] || data['store_id'] || data['outlet_id'];
        s['status'] = SubscriptionPaymentStatus[data['status']];
        s['scheduledDate'] = convertDate(data['scheduled_on']);
        s['txnDate'] = convertDate(data['transaction_time']);
        s['planName'] = data['plan_name'];
        return s;
    }
}

function convertDate(date: string) {
    if (date) return moment(date).format('DD MMM y, h:mm a');
    return 'N/A';
}

export enum PlanType {
    periodic = 'Periodic',
    free = 'Free',
}

export enum PlanCategory {
    basic = 'Basic',
    premium = 'Premium',
    advance = 'Advance',
}

export enum PlanIntervalType {
    day = 'Day',
    week = 'Week',
    month = 'Month',
    year = 'Year',
}

export enum SubscriptionAuthStatus {
    authorized = 'Authorized',
    pending = 'Pending',
    failed = 'Failed',
}

export const SubscriptionStatusList: {[key in SubscriptionStatus]: string} = {
    pending: 'Pending',
    initialized: 'Initialized',
    bank_approval_pending: 'Bank Approval Pending',
    active: 'Active',
    on_hold: 'On Hold',
    cancelled: 'Cancelled',
    failed_to_cancel: 'Failed To Cancel',
    completed: 'Completed',
}

export enum SubscriptionCancelledBy {
    admin = 'Admin',
    vendor = 'Vendor',
    partner = 'Partner',
    system = 'System',
}

export enum SubscriptionPaymentStatus {
    success = 'Success',
    pending = 'Pending',
    failed = 'Failed',
  }

export type SubscriptionStatus = 'pending' | 'initialized' | 'bank_approval_pending' | 'active' | 'on_hold' | 'cancelled' | 'failed_to_cancel' | 'completed'; 

export enum SubscriptionAction {
    Cancel = 'Cancel Subscription',
    RetryPayment = 'Retry Payment',
}