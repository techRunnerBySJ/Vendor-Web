import { formatNum } from "src/app/shared/functions/modular.functions";

export class InquiryOrders{
    inquiryOrderId: number;
    customerId: string;
    storeId: string;
    status: OrderStatus;
    vendorId: string;
    vendorResponseEndTime: Date;
    vendorResponsedAt: Date;
    customerResponseEndTime: Date;
    expireAt: Date;
    orderId: string;
    updatedAt:  Date;
    customerName: string;
    isDeleted: boolean;
    progressbarWidth: number;
    isTimerAlert: boolean;
    isTimerDanger: boolean;
    timeLeft: string;
    phone: string;
    menuItems: MenuItem[] = [];
    anySpecialRequest: string;
    timerEndTime: Date;
    vendorConfirmationTimeInMilliSecs: number;
    customerConfirmationTimeInMilliSecs: number;
    createdAt: Date;

    static fromJson(data): InquiryOrders{
        const io: InquiryOrders = new InquiryOrders();
        io['inquiryOrderId'] = data['id'];
        io['customerId'] = data['customer_id'];
        io['storeId'] = data['store_id'];
        io['status'] = data['status'];
        io['vendorId'] = data['vendor_id'];
        io['customerResponseEndTime'] = new Date(data['customer_response_end_time']);
        io['expireAt'] = new Date(data['expire_at']);
        io['orderId'] = data['order_id'];
        io['customerName'] = data['customer_name'];
        io['isDeleted'] = data['is_deleted'];
        io['phone'] = data['customer_phone'];
        io['anySpecialRequest'] = data['cart_details']['any_special_request'];
        io['timerEndTime'] = new Date(data['vendor_response_end_time']);
        io['vendorConfirmationTimeInMilliSecs'] = new Date(data['vendor_response_end_time']).getTime() - new Date(data['created_at']).getTime();
        io['customerConfirmationTimeInMilliSecs'] = new Date(data['customer_response_end_time']).getTime() - new Date(data['vendor_responsed_at']).getTime();
        io['createdAt'] = new Date(data['created_at']);
        data['menu_items']?.forEach((oi, index) => {
            const menuItem: MenuItem = new MenuItem();
            menuItem['inquiryMenuItemId'] = oi['id']
            menuItem['inquiryOrderId'] = oi['inquiry_order_id'];
            menuItem['menuItemId'] = oi['menu_item_id'];
            menuItem['menuItemName'] = oi['menu_item_name'];
            menuItem['menuItemPrice'] = oi['display_price'];
            menuItem['menuItemQuantity'] = oi['quantity'];
            menuItem['menuItemFoodType'] = oi['veg_egg_non'];
            menuItem['vendorStatus'] = oi['vendor_status'];
            menuItem['customerStatus'] = oi['customer_status'];
            menuItem['masterCategoryId'] = oi['master_category_id'];
            // if sequence key exists in menuItems array then we'll get miIndex > 0 and will take item cost from menuItems of that index,
            // otherwise we'll use current menu_items's 'index' as 'miIndex' to take item cost from menuItems array
            
            const menuItems: any[] = data['menu_items'];
            let miIndex = menuItems.findIndex(mi => mi.sequence && mi.sequence === oi.sequence);
            if (miIndex < 0) {
                miIndex = index;
            }
            menuItem['menuItemFinalPrice'] = 
                menuItems[miIndex]['total_individual_food_item_cost'] 
                ? formatNum(menuItems[miIndex]['total_individual_food_item_cost']) : formatNum(menuItems[miIndex]['total_individual_item_cost']);

            if (oi['variant_groups']) {
                oi['variant_groups'].forEach(vg => {
                        const menuVariant: MenuVariant = new MenuVariant();
                        menuVariant['menuVariantGroupId'] = vg['variant_group_id'];
                        menuVariant['menuVariantGroupName'] = vg['variant_group_name'];
                        menuVariant['menuVariantId'] = vg['variant_id'];
                        menuVariant['menuVariantName'] = vg['variant_name'];
                        menuVariant['menuVariantPrice'] = vg['price'];
                        menuVariant['menuVariantFoodType'] = vg['veg_egg_non'];
                        // menuItem['menuItemFinalPrice'] = menuItem['menuItemFinalPrice'] + menuVariant['menuVariantPrice'];
                        menuItem['menuVariants'].push(menuVariant);
                })
            }
            if (oi['addon_groups']) {
                oi['addon_groups'].forEach(ag => {
                    ag['addons'].forEach(addon => {
                        const menuAddon: MenuAddOn = new MenuAddOn();
                        menuAddon['menuAddonGroupId'] = ag['addon_group_id'];
                        menuAddon['menuAddonGroupName'] = ag['addon_group_name'];
                        menuAddon['menuAddonId'] = addon['addon_id'];
                        menuAddon['menuAddonName'] = addon['addon_name'];
                        menuAddon['menuAddonPrice'] = addon['price'];
                        menuAddon['menuAddonFoodType'] = addon['veg_egg_non'];
                        // menuItem['menuItemFinalPrice'] = menuItem['menuItemFinalPrice'] + menuAddon['menuAddonPrice'];
                        menuItem['menuAddons'].push(menuAddon);
                    })
                })
            }
            if(oi['confirmed_items']) {
                oi['confirmed_items'].forEach(ci => {
                    const confirmedItems: ConfirmedItems = new ConfirmedItems();
                    confirmedItems['confirmedItemName'] = ci['menu_item_name'];
                    confirmedItems['confirmedQuantity'] = ci['quantity'];
                    confirmedItems['confirmedItemPrice'] = ci['price'];
                    if(ci['variant_groups']) {
                        ci['variant_groups'].forEach(vg => {
                            const menuVariant: MenuVariant = new MenuVariant();
                            menuVariant['menuVariantGroupId'] = vg['variant_group_id'];
                            menuVariant['menuVariantGroupName'] = vg['variant_group_name'];
                            menuVariant['menuVariantId'] = vg['variant_id'];
                            menuVariant['menuVariantName'] = vg['variant_name'];
                            menuVariant['menuVariantPrice'] = vg['price'];
                            menuVariant['menuVariantFoodType'] = vg['veg_egg_non'];
                            confirmedItems['confirmedVariants'].push(menuVariant);
                        })
                    }
                    menuItem['menuConfirmedItems'].push(confirmedItems);
                })
            }
            if(oi['replacements']) {
                oi['replacements'].forEach(ri => {
                    const replacementItem: Replacements = new Replacements();
                    replacementItem['replacementItemName'] = ri['menu_item_name'];
                    replacementItem['maxQuantity'] = ri['max_quantity'];
                    replacementItem['replecementItemPrice'] = ri['price'];
                    if(ri['variant_groups']) {
                        ri['variant_groups'].forEach(vg => {
                            const menuVariant: MenuVariant = new MenuVariant();
                            menuVariant['menuVariantGroupId'] = vg['variant_group_id'];
                            menuVariant['menuVariantGroupName'] = vg['variant_group_name'];
                            menuVariant['menuVariantId'] = vg['variant_id'];
                            menuVariant['menuVariantName'] = vg['variant_name'];
                            menuVariant['menuVariantPrice'] = vg['price'];
                            menuVariant['menuVariantFoodType'] = vg['veg_egg_non'];
                            replacementItem['replacementVariants'].push(menuVariant);
                        })
                    }
                    menuItem['menuReplacements'].push(replacementItem);
                })
            }
            io['menuItems'].push(menuItem);
        });
        return io;
    }
}

//class for menu item details
export class MenuItem {
    inquiryMenuItemId: number;
    inquiryOrderId: number;
    menuItemId: number;
    menuItemName: string;
    menuItemPrice: number;
    menuItemFinalPrice: string;
    menuItemQuantity: number;
    menuItemFoodType: string;
    menuVariants: MenuVariant[] = [];
    menuAddons: MenuAddOn[] = [];
    vendorStatus: VendorStatus;
    customerStatus: CustomerStatus;
    menuReplacements: Replacements[] = [];
    menuConfirmedItems: ConfirmedItems[] = [];
    masterCategoryId: number;
}

//class for menu variant details
export class MenuVariant {
    menuVariantGroupId: number;
    menuVariantGroupName: string;
    menuVariantId: number;
    menuVariantName: string;
    menuVariantPrice: number;
    menuVariantFoodType: string;
}

//class for menu add on details
export class MenuAddOn {
    menuAddonGroupId: number;
    menuAddonGroupName: string;
    menuAddonId: number;
    menuAddonName: string;
    menuAddonPrice: number;
    menuAddonFoodType: string;
}

export class Replacements {
    replacementInquiryId: string;
    maxQuantity: number;
    menuItemId: number;
    replacementItemName: string;
    replecementItemPrice: string;
    replacementVariants: MenuVariant[] = [];
}

export class ConfirmedItems{
    confirmedInquiryId: string;
    confirmedQuantity: number;
    menuItemId: string;
    confirmedItemName: string;
    confirmedItemPrice: string;
    confirmedVariants: MenuVariant[] = [];
}
export type OrderStatus = 'customer_created' | 'vendor_accepted' | 'vendor_rejected' | 'vendor_modified' | 'customer_confirmed' | 'placed';

export type VendorStatus = 'pending' | 'available' | 'not_available' | 'vendor_added'

export type CustomerStatus = 'pending' | 'confirmed'

export class SubCategory{
    subCategoryId: number;
    subCategoryname: string;
    menuItems: MenuItemsInMenu[] =[]
}

export class MenuItemsInMenu {
    itemId: number;
    itemName: string;
    itemInStock: boolean;
    itemPrice: number;
    description: string;
    itemImage: string;
    itemImageUrl: string;
    foodType: string;
    subCategoryId: number;
    packagingCharges: number;
    isSpicy: boolean;
    servesHowMany: number;
    serviceCharges: number;
    gst: number;
    isGstInclusive: boolean;
    allowLongDistance: boolean;
    variantGroupRow: VariantGroup[] = [];
    addOnRow: AddonGroup[] = [];
    sequence: number;
    discountRate: string;
    displayPrice: number;
    weightGrams: string;
    quantity: number;

    static formJson(data): MenuItemsInMenu {
        const m: MenuItemsInMenu = new MenuItemsInMenu();
        m['itemId'] = data['menu_item_id'];
        m['itemName'] = data['menu_item_name'];
        m['description'] = data['description'];
        m['itemPrice'] = data['price'];
        m['foodType'] = data['veg_egg_non'];
        m['packagingCharges'] = data['packing_charges'];
        m['serviceCharges'] = data['service_charges'];
        m['servesHowMany'] = data['serves_how_many'];
        m['allowLongDistance'] = data['allow_long_distance'];
        m['isSpicy'] = data['is_spicy'];
        m['isGstInclusive'] = data['item_inclusive'];
        m['gst'] = data['item_cgst'] + data['item_sgst_utgst'];
        m['sequence'] = data['sequence'];
        m['discountRate'] = data['discount_rate'];
        m['displayPrice'] = data['display_price'];
        m['weightGrams'] = data['weight_grams'];
        m['quantity'] = data['quantity'];

        if (data['image']) {
            m['itemImage'] = data['image']['name'];
            m['itemImageUrl'] = data['image']['url'];
        }

        if (data['variant_groups']) {
            for (const i of data['variant_groups']) {
                const variantGroup: VariantGroup = new VariantGroup();
                variantGroup['variantGroupName'] = i['variant_group_name'];
                variantGroup['sequence'] = i['sequence'];
                variantGroup['variantGroupId'] = i['variant_group_id'];

                for (const j of i['variants']) {
                    const variant: Variant = new Variant();
                    variant['variantName'] = j['variant_name'];
                    variant['variantType'] = j['veg_egg_non'];
                    variant['additionalPrice'] = j['price'];
                    variant['isDefault'] = j['is_default'];
                    variant['inStock'] = j['in_stock'];
                    variant['servesHowMany'] = j['serves_how_many'];
                    variant['sequence'] = j['sequence'];
                    variant['variantId'] = j['variant_id'];
                    variant['variantGroupId'] = j['variant_group_id'];

                    variantGroup['variantRow'].push(variant);
                }
                m['variantGroupRow'].push(variantGroup);
            }
        }

        if (data['addon_groups']) {
            for (const i of data['addon_groups']) {
                const addonGroup: AddonGroup = new AddonGroup();
                addonGroup['addonGroupId'] = i['addon_group_id'];
                addonGroup['addonGroupName'] = i['addon_group_name'];
                addonGroup['minLimit'] = i['min_limit'];
                addonGroup['maxLimit'] = i['max_limit'];

                for (const j of i['addons']) {
                    addonGroup['addonId'] = j['addon_id'];
                    addonGroup['addonName'] = j['addon_name']
                }
                m['addOnRow'].push(addonGroup);
            }
        }

        return m;
    }
}
export class AddonGroup {
    addonGroupId: number;
    addonGroupName: string;
    addons: Addon[] = [];
    addonGroupInStock: boolean;
    minLimit: number;
    maxLimit: number;
}

export class Addon {
    addonId: number;
    addonName: string;
    addonInStock: boolean;
    addonGroupId: number;
    sequence: number;
    addonPrice: number;
    foodType: string;
    isGstInclusive: boolean;
    gst: number;
}

export class VariantGroup {
    variantGroupId: number;
    variantGroupName: string;
    variantRow: Variant[] = [];
    sequence: number;
}

export class Variant {
    variantId: number;
    variantGroupId: number;
    variantName: string;
    additionalPrice: number;
    isDefault: boolean;
    inStock: boolean;
    variantType: string;
    servesHowMany: number;
    sequence: number;

}

export class MasterCategory {
    id: number;
    name: string;
    desc: string;
    imageName: string;
    imageurl: string;
    sequence: number;

    static fromJson(data: any): MasterCategory {
        const m: MasterCategory = new MasterCategory();
        m['id'] = data['id'];
        m['name'] = data['name'];
        m['imageName'] = data['image']?.['name'];
        m['imageurl'] = data['image']?.['url'];
        m['sequence'] = data['sequence'];
        return m;
    }
}

export enum FoodTypes {
    'veg' = 'Veg',
    'egg' = 'Egg',
    'non-veg' = 'Non Veg'
}


export class Menu{
    mainCategoryId: number;
    mainCategoryName: string;
    discountRate: number;
    masterCategoryId: number;
    subCategory: SubCategory[] = [];
    static fromJson(data): Menu {
        const m: Menu = new Menu();
        m['mainCategoryId'] = data['main_category_id'];
        m['mainCategoryName'] = data['main_category_name'];
        m['discountRate'] = data['discount_rate'];
        m['masterCategoryId'] = data['master_category_id'];
        if (data['sub_category']) {
            for (const i of data['sub_categories']) {
                const subCategory: SubCategory = new SubCategory();
                subCategory['subCategoryId'] = i['sub_category_id'];
                subCategory['subCategoryName'] = i['sub_category_name'];
                subCategory['discountRate'] = i['discount_rate'];

                if (i['menu_item']) {
                    for (const j of i['menu_item']) {
                        const items: MenuItemsInMenu = new MenuItemsInMenu();
                        items['menuItemId'] = j['menu_item_id'];
                        items['menuItemName'] = j['menu_item_name'];
                        items['inStock'] = j['in_stock'];
                        items['price'] = j['price'];
                        items['description'] = j['description'];
                        items['discountRate'] = j['discount_rate'];
                        items['displayPrice'] = j['display_price'];
                        items['quantity'] = j['quantity'];
                        if (j['image']) {
                            items['itemImageUrl'] = j['image']['url'];
                        }
                        items['foodType'] = j['veg_egg_non'];
                        if (j['variant_groups']) {
                            j['variant_groups'].forEach(vg => {
                                vg['variants'].forEach(variant => {
                                    const menuVariant: MenuVariant = new MenuVariant();
                                    menuVariant['menuVariantGroupId'] = vg['variant_group_id'];
                                    menuVariant['menuVariantGroupName'] = vg['variant_group_name'];
                                    menuVariant['menuVariantId'] = variant['variant_id'];
                                    menuVariant['menuVariantName'] = variant['variant_name'];
                                    menuVariant['menuVariantPrice'] = variant['price'];
                                    menuVariant['menuVariantFoodType'] = variant['veg_egg_non'];
                                    // menuItem['menuItemFinalPrice'] = menuItem['menuItemFinalPrice'] + menuVariant['menuVariantPrice'];
                                    items['variantGroup'].push(menuVariant);
                                })
                            })
                        }
                        if (j['addon_groups']) {
                            j['addon_groups'].forEach(ag => {
                                ag['addons'].forEach(addon => {
                                    const menuAddon: MenuAddOn = new MenuAddOn();
                                    menuAddon['menuAddonGroupId'] = ag['addon_group_id'];
                                    menuAddon['menuAddonGroupName'] = ag['addon_group_name'];
                                    menuAddon['menuAddonId'] = addon['addon_id'];
                                    menuAddon['menuAddonName'] = addon['addon_name'];
                                    menuAddon['menuAddonPrice'] = addon['price'];
                                    menuAddon['menuAddonFoodType'] = addon['veg_egg_non'];
                                    // menuItem['menuItemFinalPrice'] = menuItem['menuItemFinalPrice'] + menuAddon['menuAddonPrice'];
                                    items['addOnGroups'].push(menuAddon);
                                })
                            })
                        }
                        subCategory['menuItems'].push(items);
                    }
                }
                m['subCategories'].push(subCategory);
            }
        }

        return m;
    }
}
export type InquiryOrderAction = 'edit quant' | 'select alt' | 'out of stock' | 'add new item';
export type PendingYourConfirmationOrderAction = 'confirm' | 'reject';
