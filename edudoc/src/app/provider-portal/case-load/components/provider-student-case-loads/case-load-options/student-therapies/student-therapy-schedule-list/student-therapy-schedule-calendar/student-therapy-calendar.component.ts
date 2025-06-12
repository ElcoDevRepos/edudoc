import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EncounterServiceTypes } from '@model/enums/encounter-service-types.enum';
import { EncounterStatuses } from '@model/enums/encounter-status.enum';
import { CalendarEventWithSchedule } from '@model/interfaces/custom/encounter-for-calendar.dto';
import { ExtraSearchParams, IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import { DynamicField, DynamicFieldType, DynamicFieldTypes, IDynamicField, IDynamicFieldType, InputTypes } from '@mt-ng2/dynamic-form';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { NgbDatepickerNavigateEvent } from '@ng-bootstrap/ng-bootstrap';
import { StudentTherapyScheduleService } from '@provider/case-load/services/student-therapy-schedule.service';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { Observable, Subject } from 'rxjs';

@Component({
    selector: 'student-therapy-calendar',
    templateUrl: 'student-therapy-calendar.component.html',
})
export class StudentTherapyScheduleCalendarComponent {
    view: CalendarView = CalendarView.Week;

    CalendarView = CalendarView;

    viewDate: Date = new Date();

    modalData: {
        action: string;
        event: CalendarEvent;
    };

    refresh: Subject<string> = new Subject();

    scheduledTherapies: CalendarEventWithSchedule[] = [];

    activeDayIsOpen = true;

    showFullDay = false;

    dateField: DynamicField;

    get isDayView(): boolean {
        return this.view === CalendarView.Day;
    }
    get isWeekView(): boolean {
        return this.view === CalendarView.Week;
    }
    get isMonthView(): boolean {
        return this.view === CalendarView.Month;
    }

    constructor(
        private studentTherapyScheduleService: StudentTherapyScheduleService,
        private router: Router,
        private notificationService: NotificationsService
    ) {}

    ngOnInit(): void {
        this.getStudentTherapySchedules();
    }

    getStudentTherapySchedulesCall(): Observable<CalendarEventWithSchedule[]> {
        const dates = this.startAndEndDates;
        const startDate = dates.start;
        const endDate = dates.end;
        const _extraSearchParams: ExtraSearchParams[] = [];
        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'IncludeArchived',
                value: '0',
            }),
        );

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'StartDate',
                value: startDate.toISOString(),
            }),
        );

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'EndDate',
                value: endDate.toISOString(),
            }),
        );

        const searchEntity: IEntitySearchParams = {
            extraParams: _extraSearchParams,
            order: 'StartTime',
            orderDirection: 'desc',
            query: '',
        };

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'ForDocumentationCalendar',
                value: '1',
            }),
        );

        const searchparams = new SearchParams(searchEntity);
        return this.studentTherapyScheduleService.getForCalendar(searchparams);
    }

    get startAndEndDates(): { start: Date; end: Date } {
        const date = new Date(this.viewDate);
        if (this.view === CalendarView.Week) {
            const day = date.getDay();
            const diff = date.getDate() - day;
            const startDate = new Date(date.setDate(diff));
            const endDate = new Date(date.setDate(startDate.getDate() + 6));
            return { start: startDate, end: endDate };
        } else if (this.view === CalendarView.Month) {
            const startDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1);
            const endDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() + 1, 0);
            return { start: startDate, end: endDate };
        } else { // Day view
            const startDate = new Date(this.viewDate);
            const endDate = new Date(this.viewDate);
            return { start: startDate, end: endDate };
        }
    }

    getStudentTherapySchedules(): void {
        this.getStudentTherapySchedulesCall().subscribe((answer) => {
            this.scheduledTherapies = answer;
        });
    }

    changeWeek(): void {
        this.getStudentTherapySchedules();
        this.activeDayIsOpen = false;
    }

    changeView(view: CalendarView) {
        this.view = view;
        this.getStudentTherapySchedules();
    }

    setViewDate($event: { day: { date: Date } }): void {
        const date = $event.day.date;
        this.viewDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }

    setViewDateToday(): void {
        this.viewDate = new Date();
    }

    goToEncounter($event: { event: CalendarEventWithSchedule }): void {
        let path = "";
        const currentTime = new Date();

        const scheduledTherapy = this.scheduledTherapies.find(
            (therapy) => therapy.encounterId === $event.event.encounterId
        );

        if (scheduledTherapy) {
            const dateESigned = scheduledTherapy.dateESigned;
            const isEsigned = scheduledTherapy.isEsigned;
            const encounterStatusId = $event.event.encounterStatusId;

            const billedStatuses = [
                EncounterStatuses.Invoiced,
                EncounterStatuses.Invoiced_and_Paid,
                EncounterStatuses.Invoiced_and_Denied,
                EncounterStatuses.Invoice_0_service_units,
                EncounterStatuses.Abandoned
            ];

            // Check if the encounter is in a billed status
            if (billedStatuses.includes(encounterStatusId)) {
                this.notificationService.info("Encounter has been billed, for more information contact HPC.");
                return;
            }

            if ($event.event.isFuture) {
                this.notificationService.info("This encounter has not been created from the daily job yet.");
                return;
            }

            const FORTY_EIGHT_HOURS_IN_MS = 48 * 60 * 60 * 1000;
            if (isEsigned && dateESigned && (currentTime.getTime() - dateESigned.getTime()) > FORTY_EIGHT_HOURS_IN_MS) {
                this.notificationService.info("48-hour window to revise encounter has closed; Contact HPC for assistance");
                return;
            }

            if ($event.event.isSchedule) {
                path = "add-from-schedule";
            } else {
                switch ($event.event.encounterServiceTypeId) {
                    case EncounterServiceTypes.Treatment_Therapy:
                        path = "treatment-therapy";
                        break;
                    case EncounterServiceTypes.Evaluation_Assessment:
                        path = "evaluation";
                        break;
                    case EncounterServiceTypes.Other_Non_Billable:
                        path = "non-msp";
                        break;
                    default:
                        break;
                }
            }

            if (!path.length) {
                this.notificationService.error("Cannot find encounter.");
            } else {
                if ($event.event.isSchedule) {
                    const studentTherapyScheduleId = String(scheduledTherapy.studentTherapyScheduleId);
                    void this.router.navigate([`/provider/encounters/${path}/${studentTherapyScheduleId}`]);
                } else {
                    void this.router.navigate([`/provider/encounters/${path}/${$event.event.encounterId}`]);
                }
            }
        }
    }

    showFullDayView(): void {
        this.showFullDay = !this.showFullDay;
    }

    getDateField(): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: '',
            name: '',
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Input,
                inputType: InputTypes.DateInput,
                dateInputOptions: {
                    maxDate: '9999-01-01'
                },
            } as IDynamicFieldType),
            value: this.viewDate,
        } as IDynamicField);
    }

    handleDateSelection($event: Date): void {
        if ($event) {
            // Date being passed in is always one day before for some reason. Gonna add one day for now
            this.viewDate = new Date($event.getFullYear(), $event.getMonth(), $event.getDate() + 1);
        }
    }

    handleMonthSelection($event: NgbDatepickerNavigateEvent) {
        this.viewDate = new Date($event.next.year, $event.next.month - 1, 1);
    }
}
