import { EncounterResponseDtoService } from '@common/services/encounter-response-dto.service';
import { IEncounterResponseDto } from '@model/interfaces/custom/encounter-response.dto';
import { EntityListColumn, EntityListConfig, IEntityListConfig } from '@mt-ng2/entity-list-module';

export class EncounterExportEntityListConfig extends EntityListConfig {
    constructor(encounterResponseDtoService: EncounterResponseDtoService) {
        const listConfig: IEntityListConfig = {
            columns: [
                new EntityListColumn({
                    name: 'Name',
                    accessorFunction: (e: IEncounterResponseDto) => e.StudentName,
                }),
                new EntityListColumn({
                    name: 'District',
                    accessorFunction: (e: IEncounterResponseDto) => e.SchoolDistrict,
                }),
                new EntityListColumn({
                    name: 'Provider',
                    accessorFunction: (e: IEncounterResponseDto) => e.ProviderName,
                }),
                new EntityListColumn({
                    name: 'Medicaid #',
                    accessorFunction: (e: IEncounterResponseDto) => e.MedicaidNo,
                }),
                new EntityListColumn({
                    name: 'Encounter #',
                    accessorFunction: (e: IEncounterResponseDto) => e.EncounterNumber,
                }),
                new EntityListColumn({
                    name: 'Claim Ids',
                    accessorFunction: (e: IEncounterResponseDto) => e.ClaimIds.join(','),
                }),
                new EntityListColumn({
                    accessors: ['CurrentStatus'],
                    name: 'Status',
                }),
                new EntityListColumn({
                    name: 'Date',
                    accessorFunction: (e: IEncounterResponseDto) => new Date(e.EncounterDate).toDateString(),
                }),
                new EntityListColumn({
                    name: 'Start',
                    accessorFunction: (e: IEncounterResponseDto) => new Date(e.StartDateTime).toTimeString(),
                }),
                new EntityListColumn({
                    name: 'End',
                    accessorFunction: (e: IEncounterResponseDto) => new Date(e.EndDateTime).toTimeString(),
                }),
                new EntityListColumn({
                    name: 'Total Minutes',
                    accessorFunction: (e: IEncounterResponseDto) =>
                        ((new Date(e.EndDateTime).getTime() - new Date(e.StartDateTime).getTime()) / 1000 / 60).toString(),
                }),
                new EntityListColumn({
                    name: 'Grouping',
                    accessorFunction: (e: IEncounterResponseDto) => e.NumStudentsInEncounter.toString(),
                }),
                new EntityListColumn({
                    name: 'Service Areas',
                    accessorFunction: (e: IEncounterResponseDto) => e.ServiceArea,
                }),
                new EntityListColumn({
                    name: 'Reason For Service',
                    accessorFunction: (e: IEncounterResponseDto) => e.ReasonForService,
                }),
                new EntityListColumn({
                    name: 'CPT Code',
                    accessorFunction: (e: IEncounterResponseDto) => encounterResponseDtoService.convertCptCodesToCommaSeparatedList(e.CptCodes),
                }),
                new EntityListColumn({
                    name: 'Methods',
                    accessorFunction: (e: IEncounterResponseDto) => encounterResponseDtoService.convertMethodsToCommaSeparatedList(e.Methods),
                }),
                new EntityListColumn({
                    name: 'Plan Goals',
                    accessorFunction: (e: IEncounterResponseDto) => encounterResponseDtoService.convertGoalsToCommaSeparatedList(e.Goals),
                }),
                new EntityListColumn({
                    name: 'Treatment Notes',
                    accessorFunction: (e: IEncounterResponseDto) => e.TreatmentNotes,
                }),
                new EntityListColumn({
                    name: 'Supervisor Comments',
                    accessorFunction: (e: IEncounterResponseDto) => e.SupervisorComments,
                }),
                new EntityListColumn({
                    name: 'Abandonment Notes',
                    accessorFunction: (e: IEncounterResponseDto) => e.AbandonmentNotes,
                }),
            ],
            export: {
                exportName: 'Encounters',
            },
        };
        super(listConfig);
    }
}
