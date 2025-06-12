import { IEntity } from './base';

import { IRosterValidationResponseFile } from './roster-validation-response-file';
import { IRosterValidation } from './roster-validation';
import { IUser } from './user';

export interface IRosterValidationFile extends IEntity {
    Name: string;
    DateCreated: Date;
    FilePath: string;
    PageNumber: number;
    CreatedById?: number;
    RosterValidationId: number;

    // reverse nav
    RosterValidationResponseFiles?: IRosterValidationResponseFile[];

    // foreign keys
    RosterValidation?: IRosterValidation;
    User?: IUser;
}
