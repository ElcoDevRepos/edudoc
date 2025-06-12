import { CalendarEvent } from "angular-calendar";
import { IStudent } from "../student";

export interface IEncounterForCalendarDto {
    EncounterId: number;
    IsEsigned: boolean;
    isDeviated: boolean;
    IsSchedule: boolean;
    IsGroup: boolean;
    IsFuture: boolean;
    EncounterDate: Date;
    StartTime: Date;
    EndTime: Date;
    Students: IStudent[];
    StudentTherapyScheduleId: number;
    TherapyGroupId: number;
    SessionName: string;
    EncounterServiceTypeId: number;
    DateESigned: Date;
    EncounterStatusId: number;
}

export interface CalendarEventWithSchedule extends CalendarEvent {
    isSchedule: boolean;
    isFuture: boolean;
    encounterServiceTypeId: number;
    encounterId: number;
    dateESigned: Date;
    isEsigned: boolean;
    isDeviated: boolean;
    encounterStatusId: number;
    studentTherapyScheduleId: number;
}
