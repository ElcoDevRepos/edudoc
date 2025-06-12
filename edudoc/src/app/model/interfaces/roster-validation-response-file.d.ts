import { IEntity } from './base';

import { IRosterValidationFile } from './roster-validation-file';
import { IUser } from './user';

export interface IRosterValidationResponseFile extends IEntity {
    Name: string;
    DateUploaded: Date;
    FilePath: string;
    UploadedById?: number;
    RosterValidationFileId: number;

    // foreign keys
    RosterValidationFile?: IRosterValidationFile;
    User?: IUser;
}
