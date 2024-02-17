import { KeyValue } from "@angular/common";

/**
 * Method that display entity in the same order as in object/enum while using keyvalue pipe
 * @param a 
 * @param b 
 * @returns 
 */
export const originalOrder = (a: KeyValue<string, string>, b: KeyValue<string, string>): number => {
  return 0;
}

/**
 * Method that convert number into a string with 2 decimal points and currency icon
 * @param num 
 * @returns 
 */
export const formatNum = (num: number) => {
  const obj = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
  return obj.format(num);
}