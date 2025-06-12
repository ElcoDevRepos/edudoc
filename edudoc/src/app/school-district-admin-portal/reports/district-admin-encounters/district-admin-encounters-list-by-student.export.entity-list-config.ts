import { EncounterResponseDtoService } from '@common/services/encounter-response-dto.service';
import { IEncounterResponseDto } from '@model/interfaces/custom/encounter-response.dto';
import { EntityListColumn, EntityListConfig, IEntityListConfig } from '@mt-ng2/entity-list-module';

export class EncounterExportEntityListConfig extends EntityListConfig {
    constructor(encounterResponseDtoService: EncounterResponseDtoService) {
        const listConfig: IEntityListConfig = {
            columns: [
                new EntityListColumn({
                    accessorFunction: (e: IEncounterResponseDto) => e.StudentName,
                    name: 'Student Name',
                }),
                new EntityListColumn({
                    accessorFunction: (e: IEncounterResponseDto) => e.StudentId.toString(),
                    name: 'Student Id',
                }),
                new EntityListColumn({
                    accessorFunction: (e: IEncounterResponseDto) => e.StudentCode,
                    name: 'Student Code',
                }),
                new EntityListColumn({
                    accessorFunction: (e: IEncounterResponseDto) => new Date(e.DateOfBirth).toDateString(),
                    name: 'Student Date Of Birth',
                }),
                new EntityListColumn({
                    accessorFunction: (e: IEncounterResponseDto) => e.ProviderName,
                    name: 'Provider Name',
                }),
                new EntityListColumn({
                    accessorFunction: (e: IEncounterResponseDto) => e.EncounterNumber,
                    name: 'Encounter #',
                }),
                new EntityListColumn({
                    accessorFunction: (e: IEncounterResponseDto) => e.CurrentStatus,
                    name: 'Encounter Status',
                }),
                new EntityListColumn({
                    accessorFunction: (e: IEncounterResponseDto) => new Date(e.EncounterDate).toDateString(),
                    name: 'Encounter Date',
                }),
                new EntityListColumn({
                    accessorFunction: (e: IEncounterResponseDto) => e.StartTime,
                    name: 'Encounter Start Time',
                }),
                new EntityListColumn({
                    accessorFunction: (e: IEncounterResponseDto) => e.EndTime,
                    name: 'Encounter End Time',
                }),
                new EntityListColumn({
                    accessorFunction: (e: IEncounterResponseDto) => e.NumStudentsInEncounter.toString(),
                    name: 'Grouping',
                }),
                new EntityListColumn({
                    accessorFunction: (e: IEncounterResponseDto) => e.ServiceType,
                    name: 'Type of Service',
                }),
                new EntityListColumn({
                    accessorFunction: (e: IEncounterResponseDto) => e.ServiceArea,
                    name: 'Service Areas',
                }),
                new EntityListColumn({
                    accessorFunction: (e: IEncounterResponseDto) => e.ReasonForService,
                    name: 'Reason For Service',
                }),
                new EntityListColumn({
                    accessorFunction: (e: IEncounterResponseDto) => encounterResponseDtoService.convertCptCodesToCommaSeparatedList(e.CptCodes),
                    name: 'CPT Codes',
                }),
                new EntityListColumn({
                    accessorFunction: (e: IEncounterResponseDto) => encounterResponseDtoService.convertMethodsToCommaSeparatedList(e.Methods),
                    name: 'Methods',
                }),
                new EntityListColumn({
                    accessorFunction: (e: IEncounterResponseDto) => encounterResponseDtoService.convertGoalsToCommaSeparatedList(e.Goals),
                    name: 'Plan Goals',
                }),
                new EntityListColumn({
                    accessorFunction: (e: IEncounterResponseDto) => e.TreatmentNotes,
                    name: 'Treatment Notes',
                }),
                new EntityListColumn({
                    accessorFunction: (e: IEncounterResponseDto) => e.AbandonmentNotes,
                    name: 'Notes For Abandonment',
                }),
            ],
            export: {
                exportName: 'encounters_by_student'
            }
        };
        super(listConfig);
    }
}
