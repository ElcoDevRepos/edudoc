import { ICptCode } from '../cpt-code';
import { IServiceUnitTimeSegment } from '../service-unit-time-segment';

export interface IServiceUnitRuleResponseDTO {
    TimeSegments: IServiceUnitTimeSegment;
    Crossover?: ICptCode;
    CrossoverTimeSegments?: IServiceUnitTimeSegment;
}
