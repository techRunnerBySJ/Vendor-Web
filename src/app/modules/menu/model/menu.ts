import { Services } from "src/app/shared/models";

export class Menu {
    categoryId: number;
    categoryName: string;
    categoryInStock: boolean;
    sequence: number;
    discountRate: string;
    masterCategoryId: number; //for grocery only
    masterCategoryName: string; //for grocery only
    subCategories: SubCategory[] = [];

    static fromJson(data): Menu {
        const m: Menu = new Menu();
        m['categoryId'] = data['id'];
        m['categoryName'] = data['name'];
        m['categoryInStock'] = data['in_stock'];
        m['sequence'] = data['sequence'];
        m['discountRate'] = data['discount_rate'];
        m['masterCategoryId'] = data['master_category_id'];
        m['masterCategoryName'] = data['master_category_name'];

        if (data['sub_categories']) {
            for (const i of data['sub_categories']) {
                const subCategory: SubCategory = new SubCategory();
                subCategory['subCategoryId'] = i['id'];
                subCategory['subCategoryName'] = i['name'];
                subCategory['subCategoryInStock'] = i['in_stock'];
                subCategory['sequence'] = i['sequence'];
                subCategory['discountRate'] = i['discount_rate'];

                if (i['menu_items']) {
                    for (const j of i['menu_items']) {
                        const items: MenuItem = new MenuItem();
                        items['itemId'] = j['id'];
                        items['itemName'] = j['name'];
                        items['itemInStock'] = j['in_stock'];
                        items['itemPrice'] = j['price'];
                        items['description'] = j['description'];
                        items['discountRate'] = j['discount_rate'];
                        items['displayPrice'] = j['display_price'];
                        if (j['image']) {
                            items['itemImageUrl'] = j['image']['url'];
                        }
                        items['foodType'] = j['veg_egg_non'];

                        subCategory['menuItems'].push(items);
                    }
                }
                m['subCategories'].push(subCategory);
            }
        }

        return m;
    }
}

export class Category {
    categoryId: number;
    categoryName: string;
    sequence: number;

    static fromJson(data): Category {
        const c: Category = new Category();
        c['categoryId'] = data['id'];
        c['categoryName'] = data['name'];
        c['sequence'] = data['sequence'];
        return c;
    }
}

export class SubCategory {
    subCategoryId: number;
    subCategoryName: string;
    subCategoryInStock: boolean;
    menuItems: MenuItem[] = [];
    sequence: number;
    discountRate: string;


    static fromJson(data): SubCategory {
        const c: SubCategory = new SubCategory();
        c['subCategoryId'] = data['id'];
        c['subCategoryName'] = data['name'];
        c['sequence'] = data['sequence'];
        c['discountRate'] = data['discount_rate'];

        return c;
    }
}

export class MenuItem {
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

    static formJson(data): MenuItem {
        const m: MenuItem = new MenuItem();
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

        if (data['image']) {
            m['itemImage'] = data['image']['name'];
            m['itemImageUrl'] = data['image']['url'];
        }

        if (data['variant_groups']) {
            for (const i of data['variant_groups']) {
                const variantGroup: VariantGroup = new VariantGroup();
                variantGroup['variantGroupName'] = i['variant_group_name'];
                variantGroup['sequence'] = i['sequence'];
                variantGroup['variantGroupId'] = i['id'];

                for (const j of i['variants']) {
                    const variant: Variant = new Variant();
                    variant['variantName'] = j['variant_name'];
                    variant['variantType'] = j['veg_egg_non'];
                    variant['additionalPrice'] = j['price'];
                    variant['isDefault'] = j['is_default'];
                    variant['inStock'] = j['in_stock'];
                    variant['servesHowMany'] = j['serves_how_many'];
                    variant['sequence'] = j['sequence'];
                    variant['variantId'] = j['id'];

                    variantGroup['variantRow'].push(variant);
                }
                m['variantGroupRow'].push(variantGroup);
            }
        }

        if (data['addon_groups']) {
            for (const i of data['addon_groups']) {
                const addonGroup: AddonGroup = new AddonGroup();
                addonGroup['addonGroupId'] = i['id'];
                addonGroup['minLimit'] = i['min_limit'];
                addonGroup['maxLimit'] = i['max_limit'];

                for (const j of i['addons']) {
                    addonGroup['addonIds'].push(j['id']);
                }
                m['addOnRow'].push(addonGroup);
            }
        }

        return m;
    }

    toJson(service: string) {
        const data = {};
        data['sub_category_id'] = this.subCategoryId;
        data['name'] = this.itemName;
        data['price'] = this.itemPrice;
        data['veg_egg_non'] = this.foodType;
        data['description'] = this.description || null;
        data['packing_charges'] = this.packagingCharges;
        data['is_spicy'] = this.isSpicy;
        data['serves_how_many'] = this.servesHowMany;
        data['service_charges'] = 5;
        data['item_sgst_utgst'] = this.gst / 2;
        data['item_cgst'] = this.gst / 2;
        data['item_igst'] = 0; //TODO currently ignoring igst as per business/backend requirement
        data['item_inclusive'] = this.isGstInclusive;
        data['allow_long_distance'] = this.allowLongDistance;
        data['external_id'] = 'ght-128978912bkj129';
        data['sequence'] = this.sequence;
        if(service === Services.Grocery) data['weight_grams'] = this.weightGrams;
        this.itemImage ? data['image'] = { name: this.itemImage } : data['image'] = null;
        if (this.variantGroupRow.length > 0) {

            data['variant_groups'] = [];
            for (const i of this.variantGroupRow) {
                const variantGroup = {};
                variantGroup['name'] = i['variantGroupName'];
                if(i['variantGroupId'])
                variantGroup['id'] = i['variantGroupId'];
                variantGroup['variants'] = [];
                for (const j of i['variantRow']) {
                    const variant = {};
                    variant['name'] = j['variantName'];
                    variant['price'] = j['additionalPrice'];
                    variant['veg_egg_non'] = j['variantType'];
                    variant['is_default'] = j['isDefault'];
                    variant['in_stock'] = j['inStock'];
                    variant['serves_how_many'] = j['servesHowMany'];
                    variant['sequence'] = j['sequence'];
                    if(j['variantId'])
                    variant['id'] = j['variantId'];
                    variantGroup['variants'].push(variant);
                }
                data['variant_groups'].push(variantGroup);
            }
        }
        if (this.addOnRow.length > 0) {
            data['addon_groups'] = [];
            for (const i of this.addOnRow) {
                const addOnGroup = {};
                addOnGroup['id'] = i['addonGroupId'];
                addOnGroup['max_limit'] = i['maxLimit'];
                addOnGroup['min_limit'] = i['minLimit'];
                addOnGroup['free_limit'] = -1;
                addOnGroup['sequence'] = 90;
                addOnGroup['addons'] = [];
                for (const j of i['addonIds']) {
                    const addon = {};
                    addon['id'] = j;
                    addOnGroup['addons'].push(addon);
                }
                data['addon_groups'].push(addOnGroup)
            }
        }

        return data;
    }
}
export class AddonGroup {
    addonGroupId: number;
    addonGroupName: string;
    addons: Addon[] = [];
    addonGroupInStock: boolean;

    addonIds: number[] = [];
    minLimit: number;
    maxLimit: number;

    static fromJson(data): AddonGroup {
        const a: AddonGroup = new AddonGroup();

        a['addonGroupId'] = data['id'];
        a['addonGroupName'] = data['name'];
        a['addonGroupInStock'] = data['in_stock'];
        return a;
    }
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

    static fromJson(data): Addon {
        const a: Addon = new Addon();

        a['addonId'] = data['id'];
        a['addonName'] = data['name'];
        a['addonInStock'] = data['in_stock'];
        a['addonGroupId'] = data['addon_group_id'];
        a['foodType'] = data['veg_egg_non'];
        a['addonPrice'] = data['price'];
        a['isGstInclusive'] = data['gst_inclusive'];
        a['gst'] = data['cgst_rate'] + data['sgst_rate'];
        a['sequence'] = data['sequence'];
        return a;
    }

    toJson() {
        const data = {}
        data['addon_group_id'] = this.addonGroupId;
        data['name'] = this.addonName;
        data['sequence'] = 95;
        data['price'] = this.addonPrice;
        data['veg_egg_non'] = this.foodType;
        data['sgst_rate'] = this.gst / 2;
        data['cgst_rate'] = this.gst / 2;
        data['igst_rate'] = 0; //TODO currently ignoring igst as per business/backend requirement 
        data['gst_inclusive'] = this.isGstInclusive;
        data['external_id'] = 'ght-128978912bkj129';

        return data;
    }
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

export interface IPackagingChargesSlab {
    minPrice: number;
    maxPrice: number;
    maxCharges: number;
}