import { EncounterStatuses } from '@model/enums/encounter-status.enum';

export interface IEncounterRequestDto {
    EncounterStudentId: number;
    StatusId: EncounterStatuses;
    ReasonForReturn: string;
    ReasonForAbandonment: string;
}
