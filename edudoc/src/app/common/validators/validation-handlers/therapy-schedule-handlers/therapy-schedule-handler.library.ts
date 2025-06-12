import { IStudentTherapy } from '@model/interfaces/student-therapy';
import { ITherapyScheduleHandlerResponse } from './therapy-schedule-handler';
import { HardValidationHandler } from './therapy-schedule-hard-handlers';
import { SoftValidationHandler } from './therapy-schedule-soft-handlers';

export function runTherapyScheduleValidationChain(scheduleTherapy: IStudentTherapy, studentTherapies: IStudentTherapy[], therapyScheduleToUpdateId: number): ITherapyScheduleHandlerResponse {

    const response: ITherapyScheduleHandlerResponse = {
        errorsResponse: [],
        isHardValidation: false,
    };

    const hardValidation = new HardValidationHandler();
    response.errorsResponse = hardValidation.handle(scheduleTherapy, response.errorsResponse, studentTherapies, therapyScheduleToUpdateId);
    response.isHardValidation = response.errorsResponse.length > 0;

    if (!response.isHardValidation) {
        const softValidation = new SoftValidationHandler();
        response.errorsResponse = softValidation.handle(scheduleTherapy, response.errorsResponse);
    }

    return response;
}

export function getScheduleMinutes(request: IStudentTherapy): number {
    const startDate = extractTimeFromDateToNewDate(request.StartDate);
    const endDate = extractTimeFromDateToNewDate(request.EndDate);

    let sumTime = 0;
    const millisecondsToMinutes = 60000;
    const startTime = startDate.getTime();
    const endTime = endDate.getTime();

    sumTime += (endTime - startTime);

    return Math.trunc(sumTime / millisecondsToMinutes);
}

function extractTimeFromDateToNewDate(date: Date): Date {
    const dateConvert = new Date(date);
    const today = new Date();
    return new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        dateConvert.getHours(),
        dateConvert.getMinutes(),
    );
}

function extractDateToNewDate(date: Date): Date {
    const d = new Date(date);
    return new Date(
        d.getFullYear(),
        d.getMonth(),
        d.getDate(),
    );
}

export function isStartTimeLessThanEndTime(request: IStudentTherapy): boolean {
    const startTime = extractTimeFromDateToNewDate(request.StartDate);
    const endTime = extractTimeFromDateToNewDate(request.EndDate);

    return startTime > endTime;
}

export function isDateOverlap(request: IStudentTherapy, existingSchedule: IStudentTherapy): boolean {
    const startDate = extractDateToNewDate(request.StartDate);
    const endDate = extractDateToNewDate(request.EndDate);
    const start = extractDateToNewDate(existingSchedule.StartDate);
    const end = extractDateToNewDate(existingSchedule.EndDate);
    return ((startDate >= start && startDate <= end) || (endDate >= startDate && endDate <= end));
}

export function isTimeOverlap(request: IStudentTherapy, existingSchedule: IStudentTherapy): boolean {
    const startTime = extractTimeFromDateToNewDate(request.StartDate);
    const endTime = extractTimeFromDateToNewDate(request.EndDate);
    const start = extractTimeFromDateToNewDate(existingSchedule.StartDate);
    const end = extractTimeFromDateToNewDate(existingSchedule.EndDate);
    return (startTime >= start && startTime < end) || (endTime > start && endTime <= end);
}

export function isDayOverlap(request: IStudentTherapy, existingSchedule: IStudentTherapy): boolean {
    return ((request.Monday && existingSchedule.Monday) || (request.Tuesday && existingSchedule.Tuesday) ||
        (request.Wednesday && existingSchedule.Wednesday) || (request.Thursday && existingSchedule.Thursday) ||
        (request.Friday && existingSchedule.Friday));
}

export function isNotValidStartEndTime(request: IStudentTherapy): boolean {
    const startTime = extractTimeFromDateToNewDate(request.StartDate).getHours();
    const endTime = extractTimeFromDateToNewDate(request.EndDate).getHours();
    return startTime < 4 || endTime < 4;
}
