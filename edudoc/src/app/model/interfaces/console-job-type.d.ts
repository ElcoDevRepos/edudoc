import { IEntity } from './base';

import { IConsoleJobLog } from './console-job-log';

export interface IConsoleJobType extends IEntity {
    Name: string;

    // reverse nav
    ConsoleJobLogs?: IConsoleJobLog[];
}
