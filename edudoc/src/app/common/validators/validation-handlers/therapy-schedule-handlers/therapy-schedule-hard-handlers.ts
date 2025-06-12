import { IStudentTherapy } from '@model/interfaces/student-therapy';
import { AbstractTherapyScheduleHandler } from './therapy-schedule-handler';
import { getScheduleMinutes, isDateOverlap, isDayOverlap, isStartTimeLessThanEndTime, isTimeOverlap, isNotValidStartEndTime } from './therapy-schedule-handler.library';

/**
 * Hard Validation - Handler to chain together hard validation handlers
 */
export class HardValidationHandler extends AbstractTherapyScheduleHandler {

    public handle(request: IStudentTherapy, errorsResponse: string[], studentTherapies: IStudentTherapy[],
        therapyScheduleToUpdateId: number): string[] {
        const lessThan1Minute = new LessThan1MinuteHandler();
        const greaterThan8Hours = new GreaterThan8HoursHandler();
        const startTimeLessThanEndTime = new StartTimeLessThanEndTimeHandler();
        const noOverlappingSchedule = new NoOverlappingScheduleHandler();
        const validStartEndTime = new ValidStartEndTimeHandler();

        // Chain hard validation handlers
        lessThan1Minute
        .setNext(greaterThan8Hours)
        .setNext(startTimeLessThanEndTime)
        .setNext(noOverlappingSchedule)
        .setNext(validStartEndTime);

        return lessThan1Minute.handle(request, errorsResponse, studentTherapies, therapyScheduleToUpdateId);

    }
}

/**
 * Hard Validation - Handler to validate session is longer than 1 minute
 */
class LessThan1MinuteHandler extends AbstractTherapyScheduleHandler {
    errorResponse = 'The encounter duration must be greater than 1 minute';

    public handle(request: IStudentTherapy, errorsResponse: string[], studentTherapies: IStudentTherapy[], therapyScheduleToUpdateId: number): string[] {

        const scheduleMinutes = getScheduleMinutes(request);

        if (scheduleMinutes < 1) {
            errorsResponse.push(this.errorResponse);
        }
        return super.handle(request, errorsResponse, studentTherapies, therapyScheduleToUpdateId);

    }
}

/**
 * Hard Validation - Handler to validate session is less than 8 hours
 */
class GreaterThan8HoursHandler extends AbstractTherapyScheduleHandler {
    errorResponse = 'The encounter duration must not be greater than 8 hours';

    public handle(request: IStudentTherapy, errorsResponse: string[], studentTherapies: IStudentTherapy[], therapyScheduleToUpdateId: number): string[] {

        const scheduleMinutes = getScheduleMinutes(request);

        if (scheduleMinutes > 480) {
            errorsResponse.push(this.errorResponse);
        }
        return super.handle(request, errorsResponse, studentTherapies, therapyScheduleToUpdateId);

    }
}

/**
 * Hard Validation - Handler to validate start time is lesser than end time
 */
class StartTimeLessThanEndTimeHandler extends AbstractTherapyScheduleHandler {
    errorResponse = 'Start time must be lesser than end time';

    public handle(request: IStudentTherapy, errorsResponse: string[], studentTherapies: IStudentTherapy[], therapyScheduleToUpdateId: number): string[] {

        if (isStartTimeLessThanEndTime(request)) {
            errorsResponse.push(this.errorResponse);
        }
        return super.handle(request, errorsResponse, studentTherapies, therapyScheduleToUpdateId);

    }
}

/**
 * Hard Validation - Handler to validate there are no overlapping encounter schedules
 */
class NoOverlappingScheduleHandler extends AbstractTherapyScheduleHandler {
    errorResponse = 'Encounter schedule date and time must not overlap with existing schedule';

    public handle(request: IStudentTherapy, errorsResponse: string[], studentTherapies: IStudentTherapy[], therapyScheduleToUpdateId: number): string[] {

        if (isStartTimeLessThanEndTime(request)) {
            errorsResponse.push(this.errorResponse);
        }
        studentTherapies = therapyScheduleToUpdateId ? studentTherapies.filter((st) => st.Id !== therapyScheduleToUpdateId) : studentTherapies;
        for (let i = 0; i < studentTherapies.length; i++) {
            const schedule = studentTherapies[i];
            if (isDateOverlap(request, schedule) && isTimeOverlap(request, schedule) && isDayOverlap(request, schedule)) {
                errorsResponse.push(this.errorResponse);
                break;
            }
        }
        return super.handle(request, errorsResponse, studentTherapies, therapyScheduleToUpdateId);
    }
}

/**
 * Hard Validation - Handler to validate encounter times are not between 12am and 4am
 */
class ValidStartEndTimeHandler extends AbstractTherapyScheduleHandler {
    errorResponse = 'Start and end times cannot be between 12am and 4am.';

    public handle(request: IStudentTherapy, errorsResponse: string[], studentTherapies: IStudentTherapy[], therapyScheduleToUpdateId: number): string[] {
        if (isNotValidStartEndTime(request)) {
            errorsResponse.push(this.errorResponse);
        }
        return super.handle(request, errorsResponse, studentTherapies, therapyScheduleToUpdateId);
    }
}
