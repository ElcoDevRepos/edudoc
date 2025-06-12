import { IEntity } from './base';

import { IEncounterStudent } from './encounter-student';
import { IEncounterStudentStatus } from './encounter-student-status';

export interface IEncounterStatus extends IEntity {
    Name: string;
    IsAuditable: boolean;
    IsBillable: boolean;
    ForReview: boolean;
    HpcAdminOnly: boolean;

    // reverse nav
    EncounterStudents?: IEncounterStudent[];
    EncounterStudentStatus?: IEncounterStudentStatus[];
}
