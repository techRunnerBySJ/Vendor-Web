import * as moment from "moment";

export class OutletSlot {
    slotType: TimeSlotTypes;
    timeSlots: ITimeSlot[];
    slotDays: any;

    static fromJson(data: any): OutletSlot {
        const o: OutletSlot = new OutletSlot();
        o['slotType'] = data['scheduling_type'];
        o['timeSlots'] = [];
        for (const i of data['slot_schedule']) {
            const slot = <ITimeSlot>{};
            slot['slotName'] = i['slot_name'];
            slot['openingHours'] = this.convertDate(i['start_time']); 
            slot['closingHours'] = this.convertDate(i['end_time']);
            o['timeSlots'].push(slot);
        }

        return o;
    }

    toJson() {
        const data = {};
        data['scheduling_type'] = this.slotType;
        data['slot_schedule'] = [];
        for (const i in this.slotDays) { // here i will be type of SlotNames
            for (const j of this.slotDays[i]) {
                if (j['openingHours'] && j['closingHours']) {
                    const slot = {};
                    slot['slot_name'] = i;
                    slot['start_time'] = this.convertDateToSendFormat(j['openingHours']);
                    slot['end_time'] = this.convertDateToSendFormat(j['closingHours']);
                    data['slot_schedule'].push(slot);
                }
            }
        }
        return data;
    }

    static convertDate(date: string) {
        return moment(date, 'hhmm').format('HH:mm');
    }

    convertDateToSendFormat(time: string) {
        return moment(time, 'HH:mm').format('HHmm');
    }
}

export interface ITimeSlot {
    slotName?: SlotNames;
    openingHours: string;
    closingHours: string;
}

export type TimeSlotTypes = 'all' | 'weekdays_and_weekends' | 'custom';

export const TimeSlotTypesList: { [key in TimeSlotTypes]: string } = {
    all: 'All Days',
    weekdays_and_weekends: 'Weekdays and Weekends',
    custom: 'Custom'
}

export type SlotNames = 'all' | 'weekdays' | 'weekends' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';