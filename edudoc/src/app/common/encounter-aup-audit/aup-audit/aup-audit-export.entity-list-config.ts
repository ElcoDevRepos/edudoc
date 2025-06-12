import { DatePipe } from '@angular/common';
import { EncounterResponseDtoService } from '@common/services/encounter-response-dto.service';
import { IEncounterResponseDto } from '@model/interfaces/custom/encounter-response.dto';
import { EntityListColumn, EntityListConfig, IEntityListConfig } from '@mt-ng2/entity-list-module';

export class AupAuditExportEntityListConfig extends EntityListConfig {
    constructor(private encounterResponseDtoService: EncounterResponseDtoService) {
        super({
            columns: [
                new EntityListColumn({
                    accessors: ['StudentName'],
                    name: 'StudentName',
                }),
                new EntityListColumn({
                    accessors: ['SchoolDistrict'],
                    name: 'School District',
                }),
                new EntityListColumn({
                    accessors: ['ProviderName'],
                    name: 'Provider',
                }),
                new EntityListColumn({
                    accessorFunction: function (encounter: IEncounterResponseDto): string {
                        return encounter.MedicaidNo ?? '';
                    },
                    name: 'Medicaid No.',
                }),
                new EntityListColumn({
                    accessors: ['EncounterNumber'],
                    name: 'Encounter Number',
                }),
                new EntityListColumn({
                    accessorFunction: function (encounter: IEncounterResponseDto): string {
                        return encounter.ClaimIds.join(',');
                    },
                    name: 'Claim Ids',
                }),
                new EntityListColumn({
                    accessors: ['CurrentStatus'],
                    name: 'Current Status',
                }),
                new EntityListColumn({
                    accessorFunction: function (encounter: IEncounterResponseDto): string {
                        return new DatePipe('en-US').transform(encounter.EncounterDate, 'shortDate');
                    },
                    name: 'Encounter Date',
                }),
                new EntityListColumn({
                    accessorFunction: function (encounter: IEncounterResponseDto): string {
                        return new DatePipe('en-US').transform(encounter.StartDateTime, 'shortTime');
                    },
                    name: 'Start Time',
                }),
                new EntityListColumn({
                    accessorFunction: function (encounter: IEncounterResponseDto): string {
                        return new DatePipe('en-US').transform(encounter.EndDateTime, 'shortTime');
                    },
                    name: 'End Time',
                }),
                new EntityListColumn({
                    accessorFunction: function (encounter: IEncounterResponseDto): string {
                        return encounterResponseDtoService.getSessionMinutes(encounter).toString();
                    },
                    name: 'Total Minutes',
                }),
                new EntityListColumn({
                    accessors: ['NumStudentsInEncounter'],
                    name: 'Grouping',
                }),
                new EntityListColumn({
                    accessors: ['ServiceArea'],
                    name: 'Service Area',
                }),
                new EntityListColumn({
                    accessors: ['ReasonForService'],
                    name: 'Reason For Service',
                }),
                new EntityListColumn({
                    accessorFunction: function (encounter: IEncounterResponseDto): string {
                        return encounterResponseDtoService.convertCptCodesToCommaSeparatedList(encounter.CptCodes).toString();
                    },
                    name: 'CPT Code (Procedure Code)',
                }),
                new EntityListColumn({
                    accessorFunction: function (encounter: IEncounterResponseDto): string {
                        return encounterResponseDtoService.convertMethodsToCommaSeparatedList(encounter.Methods).toString();
                    },
                    name: 'Methods',
                }),
                new EntityListColumn({
                    accessorFunction: function (encounter: IEncounterResponseDto): string {
                        return encounterResponseDtoService.convertGoalsToCommaSeparatedList(encounter.Goals).toString();
                    },
                    name: 'Plan Goals',
                }),
                new EntityListColumn({
                    accessors: ['TreatmentNotes'],
                    name: 'Treatment Notes',
                }),
                new EntityListColumn({
                    accessorFunction: function (encounter: IEncounterResponseDto): string {
                        const comment = encounter.SupervisorComments;
                        return comment && comment.length > 50 ? `${comment.substring(0, 50)}...` : comment ?? ``;
                    },
                    name: 'Supervisor Comments',
                }),
                new EntityListColumn({
                    accessorFunction: function (encounter: IEncounterResponseDto): string {
                        return encounter.AbandonmentNotes ?? '';
                    },
                    name: 'Abandonment Notes',
                }),
                new EntityListColumn({
                    accessorFunction: function (encounter: IEncounterResponseDto): string {
                        return `My Signature attests to the validity of the services delivered to the child/ children as specified on this document.\nESign Provider/Title: ${encounter.ProviderName}/ ${encounter.ProviderTitle}`;
                    },
                    name: 'E-Sign',
                }),
            ],
        });
    }
}
