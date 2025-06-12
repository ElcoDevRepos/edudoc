import { IEntity } from './base';

import { IEncounterStudent } from './encounter-student';
import { IStudentTherapy } from './student-therapy';

export interface IEncounterLocation extends IEntity {
    Name: string;

    // reverse nav
    EncounterStudents?: IEncounterStudent[];
    StudentTherapies?: IStudentTherapy[];
}
