import { IStudentTherapy } from '@model/interfaces/student-therapy';
import { AbstractTherapyScheduleHandler } from './therapy-schedule-handler';
import { getScheduleMinutes } from './therapy-schedule-handler.library';

/**
 * Soft Validation - Handler to chain together soft validation handlers
 */
export class SoftValidationHandler extends AbstractTherapyScheduleHandler {

    public handle(request: IStudentTherapy, errorsResponse: string[]): string[] {
        const serviceTypeHandler = new TreatmentTherapyTimeWithinRangeHandler();

        return serviceTypeHandler ? serviceTypeHandler.handle(request, errorsResponse) : [];

    }
}

/**
 * Soft Validation - All treatment/therapy  total therapy minutes > 120 or < 8 mins
 */
class TreatmentTherapyTimeWithinRangeHandler extends AbstractTherapyScheduleHandler {
    mintimeErrorResponse = 'The encounters` total time will be less than 8 minutes';
    maxTimeErrorResponse = 'The encounters` total time will exceed 120 minutes';

    public handle(request: IStudentTherapy, errorsResponse: string[]): string[] {
        const scheduleMinutes = getScheduleMinutes(request);

        if (scheduleMinutes < 8) {
            errorsResponse.push(this.mintimeErrorResponse);
        }

        if (scheduleMinutes > 120) {
            errorsResponse.push(this.maxTimeErrorResponse);
        }

        return super.handle(request, errorsResponse);

    }
}
