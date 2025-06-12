import { IEntity } from './base';

import { IConsoleJobType } from './console-job-type';

export interface IConsoleJobLog extends IEntity {
    Date: Date;
    IsError: boolean;
    StackTrace?: string;
    ErrorMessage?: string;
    ConsoleJobTypeId: number;
    RelatedEntityId?: number;

    // foreign keys
    ConsoleJobType?: IConsoleJobType;
}
