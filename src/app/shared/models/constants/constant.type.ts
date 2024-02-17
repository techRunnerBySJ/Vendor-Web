export class ConstantType {
  id: number;
}

export interface IApiEndPoint {
  service: string;
  prefix?: string;
}

export enum Services {
  Food = 'restaurant',
  Grocery = 'store',
  Pharmacy = 'pharmacy',
  Paan = 'paan',
  Flower = 'flower',
  Pet = 'pet',
}

export type Role = 'owner' | 'manager';

export const apiEndPoints: { [key in Services]: IApiEndPoint } = {
  [Services.Food]: { service: 'food', prefix: 'restaurant' },
  [Services.Grocery]: { service: 'grocery', prefix: 'store' },
  [Services.Pharmacy]: { service: 'pharmacy', prefix: 'outlet' },
  [Services.Paan]: { service: 'paan', prefix: 'outlet' },
  [Services.Flower]: { service: 'flower', prefix: 'outlet' },
  [Services.Pet]: { service: 'pet', prefix: 'outlet'},

}

export interface IRouteAccess {
  service: Services[],
  role: Role[]
}

export const allowedRouteAccessTo: { [key: string]: IRouteAccess } = {
  '/change-password': {
    service: [Services.Food, Services.Grocery, Services.Flower, Services.Paan, Services.Pharmacy, Services.Pet],
    role: ['owner', 'manager']
  },
  '/my-orders': {
    service: [Services.Food, Services.Flower, Services.Paan, Services.Pharmacy, Services.Pet],
    role: ['owner', 'manager']
  },
  '/business': {
    service: [Services.Food, Services.Grocery, Services.Flower, Services.Paan, Services.Pharmacy, Services.Pet],
    role: ['owner']
  },
  '/order-history': {
    service: [Services.Food, Services.Grocery, Services.Flower, Services.Paan, Services.Pharmacy, Services.Pet],
    role: ['owner', 'manager']
  },
  '/menu': {
    service: [Services.Food, Services.Grocery, Services.Flower, Services.Paan, Services.Pharmacy, Services.Pet],
    role: ['owner', 'manager']
  },
  '/subscription': {
    service: [Services.Food, Services.Grocery, Services.Flower, Services.Paan, Services.Pharmacy, Services.Pet],
    role: ['owner']
  },
  '/more': {
    service: [Services.Food, Services.Grocery, Services.Flower, Services.Paan, Services.Pharmacy, Services.Pet],
    role: ['owner', 'manager']
  },
  '/delivery': {
    service: [Services.Food],
    role: ['owner', 'manager']
  },
  '/grocery-orders': {
    service: [Services.Grocery],
    role: ['owner', 'manager']
  }
}

export const posErrorMsg = 'Restaurants registered with petpooja system can not take this action from speedyy web';