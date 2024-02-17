export class SponsoredOrders {
    orderId: string;
    clientOrderStatus: OrderStatus;
    createdAt: Date;
    deliveryStatus: string;
    updatedAt: string;
    orderSurrenderTime: string;
    progressbarWidth: number;
    isTimerAlert: boolean = false;
    isTimerDanger: boolean = false;
    timerEndTime: Date;
    timeLeft: string;
    acceptanceTimeInMilliSecs: number;

    static fromJson(data): SponsoredOrders {
        const s: SponsoredOrders = new SponsoredOrders();
        s['orderId'] = data['id'];
        s['clientOrderStatus'] = data['client_order_status'];
        s['createdAt'] = new Date(data['created_at']);
        s['deliveryStatus'] = data['delivery_status'];
        s['updatedAt'] = data['updated_at'];
        s['timerEndTime'] = new Date(data['order_surrender_time']);
        s['acceptanceTimeInMilliSecs'] = new Date(data['order_surrender_time']).getTime() - new Date(data['created_at']).getTime();
        return s;
    }
}

export class SponsoredRiders {
    riderId: string;
    riderName: string;
    distance: string;
    riderNameAndDistance: string;
     
    static fromJson(data): SponsoredRiders {
        const r: SponsoredRiders = new SponsoredRiders();
        r['riderId'] = data['rider_id'];
        r['riderName'] = data['rider_name'];
        r['distance'] = data['distance'];
        r['riderNameAndDistance'] = `${data['rider_name']} - ${data['distance']} kms`;
        return r;
    }
}
export type OrderStatus = 'pending' | 'placed' | 'completed' | 'cancelled';
