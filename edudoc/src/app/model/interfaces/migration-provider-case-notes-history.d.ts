import { IEntity } from './base';

import { IProvider } from './provider';
import { IStudent } from './student';

export interface IMigrationProviderCaseNotesHistory extends IEntity {
    ProviderId: number;
    StudentId: number;
    EncounterNumber: string;
    EncounterDate: Date;
    StartTime: Date;
    EndTime: Date;
    ProviderNotes: string;

    // foreign keys
    Provider?: IProvider;
    Student?: IStudent;
}
