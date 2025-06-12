import { IEntity } from './base';

import { IEncounterStatus } from './encounter-status';
import { IEncounterStudent } from './encounter-student';
import { IUser } from './user';

export interface IEncounterStudentStatus extends IEntity {
    EncounterStudentId: number;
    EncounterStatusId: number;
    CreatedById: number;
    DateCreated?: Date;

    // foreign keys
    EncounterStatus?: IEncounterStatus;
    EncounterStudent?: IEncounterStudent;
    CreatedBy?: IUser;
}
