export class OutletUsers {
    userName: string;
    userPhone: string;
    userRole: string;
    userEmail: string;
    isActive: boolean;
    isDeleted: boolean;
    deletedBy: string;
    deletedByUserId: string;
    id: string;
    loginId: string;
    outletId: string;
    type: string;

    static fromJson(data: any): OutletUsers {
        const r: OutletUsers = new OutletUsers();
        r['userName'] = data['name'];
        r['userPhone'] = data['phone'].split('+91')[1];
        r['userRole'] = data['role'];
        r['userEmail'] = data['email'];
        r['isActive'] = data['active'];
        r['isDeleted'] = data['is_deleted'];
        r['deletedBy'] = data['deleted_by'];
        r['deletedByUserId'] = data['deleted_by_user_id'];
        r['id'] = data['id'];
        r['loginId'] = data['login_id'];
        r['outletId'] = data['outlet_id'];
        r['type'] = data['type'];
        return r;
    }
}

export type OutletImageAction = 'EditPrimary' | 'AddAdditional' | 'EditAdditional' | 'DeleteAdditional';

export const maxFileUploadSizeAllowed: number  = 20971520 // 20 MB in bytes