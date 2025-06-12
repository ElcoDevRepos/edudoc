import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import moment from 'moment-timezone';
/* This is a work around - based on the following issue (https://gitlab.4miles.com/Engineering/Breckenridge/issues/91) resolution we should update the references to this class with the new implementation */

@Injectable({
    providedIn: 'root',
})
export class DateTimeConverterService {
    constructor(private datePipe: DatePipe) {}
    convertToUTC(dateTime: Date): Date {
        const date = new Date(dateTime);
        return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes()));
    }

    convertUtcToLocal(dateTime: Date): Date {
        const date = new Date(dateTime);
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes() - date.getTimezoneOffset());
    }

    GetDateTimeForTimeZone(date: Date, TimeZone: string): moment.Moment {
        return moment.tz(date, TimeZone);
    }

    convertDateToBrowserTimeZoneString(dateTime: Date): string | moment.Moment {
        return this.datePipe.transform(dateTime, 'MMMM d, yyyy, hh:mm a');
    }

    convertTimeToBrowserTimeZoneString(time: string, encounterDate: Date): string {
        const date = new Date(encounterDate);
        const utc_date = this.appendTimeSpanToDate(new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
        date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds())), time);
        return this.datePipe.transform(this.convertUtcToLocal(utc_date), 'HH:mm:ss');
    }

    convertToDate(dateTime: Date): string {
        return this.datePipe.transform(dateTime, 'MMMM d, yyyy');
    }

    convertToDateSlashes(dateTime: Date): string {
        return this.datePipe.transform(dateTime, 'MM/dd/yyyy', 'UTC');
    }

    convertToTimeString(time: string): string {
        const today = new Date();
        const date = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
            Number.parseInt(time.slice(0, 2), null),
            Number.parseInt(time.slice(3, 5), null));
        return this.datePipe.transform(date, 'h:mm a');
    }

    assumeLocalTimeForUTCDateObject(value: Date): Date {
        if (!value) {
            return null;
        }
        const dateAsString = value.toString();
        return new Date(dateAsString.substring(0, dateAsString.length - 1));
    }

    appendTimeSpanToDate(date: Date, time: string): Date {
        const response = new Date(date);
        const timeSegments = time.split(':');
        const hours = timeSegments[0];
        const minutes = timeSegments[1];
        response.setHours(Number(hours));
        response.setMinutes(Number(minutes));
        response.setSeconds(0);

        return response;
    }

    getDateDurationInMins(start: Date, end: Date): number {
        const minutesDiff = moment(end).diff(moment(start), 'minutes');

        return minutesDiff;
    }

    getTimeDurationInMins(start: string, end: string): number {
        const startMoment = moment(this.appendTimeSpanToDate(new Date(), start));
        const endMoment = moment(this.appendTimeSpanToDate(new Date(), end));
        const minutesDiff = endMoment.diff(startMoment, 'minutes');

        return minutesDiff;
    }

    convertToEasternTimezone(time: string, date: Date | string): string {
        // If no date or time, return original time
        if (!date || !time) {
            return time;
        }

        // Get user's timezone
        const userTimezone = moment.tz.guess();
        
        // If user is already in Eastern time, no adjustment needed
        if (userTimezone === 'America/New_York') {
            return time;
        }

        try {
            const dateObject = typeof date === 'string' ? new Date(date) : date;
            // Parse the time, handling both HH:mm and HH:mm:ss formats
            const timeParts = time.split(':');
            if (timeParts.length < 2) {
                return time; // Return original if invalid format
            }

            const hours = parseInt(timeParts[0], 10);
            const minutes = parseInt(timeParts[1], 10);

            if (isNaN(hours) || isNaN(minutes)) {
                return time; // Return original if parsing fails
            }

            // Create a moment object in the user's timezone with the specified date and time
            const userTime = moment.tz({
                year: dateObject.getFullYear(),
                month: dateObject.getMonth(),
                date: dateObject.getDate(),
                hour: hours,
                minute: minutes,
                second: 0
            }, userTimezone);
            
            // Convert to Eastern time and format as HH:mm
            return userTime.clone().tz('America/New_York').format('HH:mm:ss');
        } catch (error) {
            console.error('Error adjusting time for Eastern timezone:', error);
            return time; // Return original time if any error occurs
        }
    }

    convertFromEasternToLocal(time: string, date: Date | string): string {
        // If no date or time, return original time
        if (!date || !time) {
            return time;
        }

        // Get user's timezone
        const userTimezone = moment.tz.guess();
        
        // If user is already in Eastern time, no adjustment needed
        if (userTimezone === 'America/New_York') {
            return time;
        }

        try {
            const dateObject = typeof date === 'string' ? new Date(date) : date;
            // Parse the time, handling both HH:mm and HH:mm:ss formats
            const timeParts = time.split(':');
            if (timeParts.length < 2) {
                return time; // Return original if invalid format
            }

            const hours = parseInt(timeParts[0], 10);
            const minutes = parseInt(timeParts[1], 10);

            if (isNaN(hours) || isNaN(minutes)) {
                return time; // Return original if parsing fails
            }

            // Create a moment object in Eastern timezone with the specified date and time
            const easternTime = moment.tz({
                year: dateObject.getFullYear(),
                month: dateObject.getMonth(),
                date: dateObject.getDate(),
                hour: hours,
                minute: minutes,
                second: 0
            }, 'America/New_York');
            
            // Convert to user's local time and format as HH:mm:ss
            return easternTime.clone().tz(userTimezone).format('HH:mm:ss');
        } catch (error) {
            console.error('Error converting from Eastern to local timezone:', error);
            return time; // Return original time if any error occurs
        }
    }
}
