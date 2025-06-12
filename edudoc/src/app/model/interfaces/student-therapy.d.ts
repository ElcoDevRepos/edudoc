import { IEntity } from './base';

import { IStudentTherapySchedule } from './student-therapy-schedule';
import { ICaseLoad } from './case-load';
import { IEncounterLocation } from './encounter-location';
import { IProvider } from './provider';
import { ITherapyGroup } from './therapy-group';
import { IUser } from './user';

export interface IStudentTherapy extends IEntity {
    CaseLoadId: number;
    ProviderId?: number;
    EncounterLocationId: number;
    TherapyGroupId?: number;
    StartDate: Date;
    EndDate: Date;
    Monday: boolean;
    Tuesday: boolean;
    Wednesday: boolean;
    Thursday: boolean;
    Friday: boolean;
    SessionName?: string;
    Archived: boolean;
    CreatedById: number;
    ModifiedById?: number;
    DateCreated?: Date;
    DateModified?: Date;

    // reverse nav
    StudentTherapySchedules?: IStudentTherapySchedule[];

    // foreign keys
    CaseLoad?: ICaseLoad;
    EncounterLocation?: IEncounterLocation;
    Provider?: IProvider;
    TherapyGroup?: ITherapyGroup;
    CreatedBy?: IUser;
    ModifiedBy?: IUser;
}
