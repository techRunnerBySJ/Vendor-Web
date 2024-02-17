import { Order } from "../../my-orders/model/order";

export class PayoutAccount {
    payoutAccountId: string;
    beneficiaryName: string;
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    isIfscVerified: boolean;
    isDeleted: boolean;
    isPrimary: boolean;
    status: string;

    static fromJson(data: any): PayoutAccount {
        const p: PayoutAccount = new PayoutAccount();
        p['payoutAccountId'] = data['id'];
        p['beneficiaryName'] = data['name'];
        p['accountNumber'] = data['bank_account_number'];
        p['ifscCode'] = data['ifsc_code'];
        p['bankName'] = data['bank_name'];
        p['isIfscVerified'] = data['ifsc_verified'];
        p['isDeleted'] = data['is_deleted'];
        p['isPrimary'] = data['is_primary'];
        p['status'] = data['status'];
        return p;
    }
}

export interface PayoutSummary {
    isPayoutOnHold?: boolean;
    lastPayoutAmount?: number;
    lastPayoutDate?: string;
    lastPayoutStartDate?: string;
    lastPayoutEndDate?: string;
    lastPayoutStatus?: PayoutStatus;
    upcomingPayoutAmount?: number;
    upcomingPayoutDate?: string;
    upcomingPayoutStartDate?: string;
    upcomingPayoutEndDate?: string;
    pocContactNumber?: string;
    totalAmountPaid?: number;
}

export class Payout {
    payoutId: string;
    startDate: string;
    endDate: string;
    totalOrderAmount: number;
    txnCharges: number;
    amountPaidToVendor: number;
    txnId: string;
    payoutCompletedTime: string;
    payoutStatus: PayoutStatus;
    canRetry: boolean;
    markedCompletedByAdminId: string;
    payoutGateway: string;
    isDeleted: boolean;
    accountDetails: PayoutAccount;
    outletId: string;
    outletName: string;
    payoutOrders: Order[] = [];
    txnIdByAdmin: string;

    static fromJson(data: any): Payout {
        const p: Payout = new Payout();
        p['payoutId'] = data['id'];
        p['startDate'] = data['start_time'];
        p['endDate'] = data['end_time'];
        p['totalOrderAmount'] = data['total_order_amount'];
        p['txnCharges'] = data['transaction_charges'];
        p['amountPaidToVendor'] = data['amount_paid_to_vendor'];
        p['txnId'] = data['transaction_id'];
        p['payoutCompletedTime'] = data['payout_completed_time'];
        p['payoutStatus'] = PayoutStatus[data['status']];
        p['canRetry'] = data['retry'];
        p['markedCompletedByAdminId'] = data['completed_marked_admin_id'];
        p['payoutGateway'] =data['payout_gateway'];
        p['isDeleted'] = data['is_deleted'];
        p['accountDetails'] = PayoutAccount.fromJson(data['payout_details']['account']);
        p['outletId'] = data['payout_details']['restaurant']?.['id'] || data['payout_details']['store']?.['id'] || data['payout_details']['outlet']?.['id'];
        p['outletName'] = data['payout_details']['restaurant']?.['name'] || data['payout_details']['store']?.['name'] || data['payout_details']['outlet']?.['name'];
        for (const i of data['payout_orders']) {
            p['payoutOrders'].push(Order.fromJson(i));
        }
        p['txnIdByAdmin'] = data['transaction_details']?.['transaction_id'] || "N/A";
        return p;
    }

}

export enum PayoutStatus {
    INIT = 'Initiated',
    FAILED = 'Failed', 
    COMPLETE = 'Paid', 
    PENDING = 'Pending', 
    REJECTED = 'Rejected', 
    REVERSED = 'Reversed'
}

export const months: {id: number, name: string}[] = [
    {id: 1, name: 'January'},
    {id: 2, name: 'February'},
    {id: 3, name: 'March'},
    {id: 4, name: 'April'},
    {id: 5, name: 'May'},
    {id: 6, name: 'June'},
    {id: 7, name: 'July'},
    {id: 8, name: 'August'},
    {id: 9, name: 'September'},
    {id: 10, name: 'October'},
    {id: 11, name: 'November'},
    {id: 12, name: 'December'},
]
const startYear = 2022
export const years = Array.from({length: new Date().getFullYear() - startYear + 1}, (_, index) => startYear + index);