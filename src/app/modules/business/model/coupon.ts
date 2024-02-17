import * as moment from 'moment';

export class Coupon {
    couponId: number;
    couponName: string;
    couponHeader: string;
    couponDesc: string;
    couponStartDate: Date
    couponStartTime: string;
    couponEndDate: Date;
    couponEndTime: string;
    mappingDetails: CouponMapping[] = [];
    couponLevel: string;
    termsAndConditions: string | string[];
    discountType: string;
    discount: number; //in rupees or percentage
    discountSharePercentage: number;
    minOrderValue: number;
    maxDiscountUpto: number;
    maxUseCount: number;
    campaignUsageIntervalinMins: number;
    discountSponseredBy: string;
    isCampaignOver: boolean;

    static fromJson(data): Coupon {
        const c: Coupon = new Coupon();
        c['couponId'] = data['id']
        c['couponName'] = data['code'];
        c['couponHeader'] = data['header'];
        c['couponDesc'] = data['description'];
        c['termsAndConditions'] = data['terms_and_conditions'].split('\n');
        c['discountType'] = data['type'];
        if (data['type'] === 'upto') {
            c['discount'] = data['discount_percentage'];
        } else {
            c['discount'] = data['discount_amount_rupees'];
        }
        c['couponStartTime'] = convertDateWithTime(data['start_time']);
        c['couponEndTime'] = convertDateWithTime(data['end_time']);
        if (data['mapping_details']) {
            for (const i of data['mapping_details']) {
                c['mappingDetails'].push(CouponMapping.fromJson(i));
            }
        }
        c['couponLevel'] = data['level'];
        c['maxUseCount'] = data['max_use_count'];
        c['campaignUsageIntervalinMins'] = data['coupon_use_interval_minutes'];
        c['minOrderValue'] = data['min_order_value_rupees'];
        c['maxDiscountUpto'] = data['max_discount_rupees'];
        c['discountSharePercentage'] = data['discount_share_percent'];
        c['discountSponseredBy'] = data['discount_sponsered_by'];
        c['isCampaignOver'] = data['is_deleted'];
        return c
    }

    toJson() {
        const data = {};
        data['code'] = this.couponName;
        data['header'] = this.couponHeader;
        data['description'] = this.couponDesc;
        data['terms_and_conditions'] = this.termsAndConditions;
        data['type'] = this.discountType;
        if (this.discountType === 'upto') {
            data['discount_percentage'] = this.discount;
            data['max_discount_rupees'] = this.maxDiscountUpto;
        } else {
            data['discount_amount_rupees'] = this.discount;
        }
        data['start_time'] = this.convertDateToEpoch(this.couponStartDate, this.couponStartTime);
        data['end_time'] = this.convertDateToEpoch(this.couponEndDate, this.couponEndTime);;
        data['max_use_count'] = this.maxUseCount;
        data['min_order_value_rupees'] = this.minOrderValue;
        if (this.maxUseCount > 1) {
            data['coupon_use_interval_minutes'] = this.campaignUsageIntervalinMins;
        }
        return data;
    }

    convertDateToEpoch(date: Date, time: string) {
        const convertedDate = moment(date).format('YYYY-MM-DD');
        const convertedTime = moment(time, 'h:mm A').format('HH:mm:ss');
        return moment(new Date(`${convertedDate} ${convertedTime}`)).unix();
    }
    
}

export class CouponMapping {
    id: number;
    couponId: number;
    startDate: string;
    endDate: string;
    outletId: string;
    mappedBy: string;
    mappedByUserId: string;
    isDeleted: boolean;
    sequence: number;

    static fromJson(data: any): CouponMapping {
        const c: CouponMapping = new CouponMapping();
        c['id'] = data['id'];
        c['couponId'] = data['coupon_id'];
        c['startDate'] = convertDateWithTime(data['start_time']);
        c['endDate'] = convertDateWithTime(data['end_time']);
        c['outletId'] = data['restaurant_id'] || data['store_id'] || data['outlet_id'];
        c['mappedBy'] = data['mapped_by'];
        c['mappedByUserId'] = data['mapped_by_user_id'];
        c['isDeleted'] = data['is_deleted'];
        c['sequence'] = data['sequence'];
        return c;
    }
}

function convertDate(date: string) {
    return moment(date).format('DD MMM, y');
}

function convertDateWithTime(date: string) {
    return moment(date).format('DD MMM y, h:mm a');
}

export const discountTypeOptions = [
    { id: 'flat', name: 'Flat' },
    { id: 'upto', name: 'Upto' },
]

export enum DiscountTabs {
    Ongoing = 'ongoing',
    Upcoming = 'upcoming',
    NewAvailable = 'new available',
    Expired = 'expired'
}

export interface IDiscountSequence {
    couponName: string;
    couponMappingId: number;
    discountSequence: number;

}