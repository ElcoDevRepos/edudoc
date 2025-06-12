import { IEntity } from './base';

import { IEncounterStudent } from './encounter-student';

export interface IDocumentType extends IEntity {
    Name: string;

    // reverse nav
    EncounterStudents?: IEncounterStudent[];
}
