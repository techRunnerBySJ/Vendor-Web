export class CustomerReview {
    orderId: number;
    orderRating: number;
    orderPlacedTime: string;
    orderReviewedTime: string;
    orderReviewComments: string;
    customerName: string;
    voteType: number;


    static fromJson(data: any): CustomerReview {
        const c: CustomerReview = new CustomerReview();
        c['orderId'] = data['id'];
        c['orderRating'] = data['order_rating'];
        c['orderPlacedTime'] = data['order_placed_time'];
        c['orderReviewedTime'] = data['reviewed_at'];
        c['orderReviewComments'] = data['comments'];
        c['customerName'] = data['customer_name'];
        c['voteType'] = VoteType[data['vote_type']];
        return c;
    }

}

export const VoteType = {
    '1': 'like',
    '0': 'no-review',
    '-1': 'dislike'
}