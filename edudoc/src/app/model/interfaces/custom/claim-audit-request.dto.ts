import { EncounterStatuses } from '@model/enums/encounter-status.enum';

export interface IClaimAuditRequestDto {
    EncounterStudentId: number;
    StatusId: EncounterStatuses;
    ReasonForReturn: string;
    ReasonForAbandonment: string;
}
