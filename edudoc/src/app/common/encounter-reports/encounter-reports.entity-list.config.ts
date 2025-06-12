import { EncounterResponseDtoService } from '@common/services/encounter-response-dto.service';
import { IDetailedEncounterFullData } from '@model/dtos/encounter-data';
import { EntityListConfig } from '@mt-ng2/entity-list-module';

export class EncounterBasicReportEntityListConfig extends EntityListConfig {
    constructor() {
        super({
            columns: [
                {
                    name: 'District Name',
                    accessors: ['DistrictData', 'DistrictName'],
                },
                {
                    name: 'Provider Name',
                    accessors: ['GroupData', 'ProviderName'],
                },
                {
                    name: 'Student Info',
                    accessors: ['GroupData', 'StudentInfo'],
                },
                {
                    name: 'IEP Start Date',
                    accessors: ['GroupData', 'IEPStartDate'],
                    pipes: ["date:'MM/dd/YYYY'"],
                },
                {
                    name: 'Total Minutes',
                    accessors: ['GroupData', 'TotalMinutes'],
                },
                {
                    name: 'Encounter Number',
                    accessors: ['LineData', 'EncounterNumber'],
                },
                {
                    name: 'Status',
                    accessors: ['LineData', 'Status'],
                },
                {
                    name: 'Grouping',
                    accessors: ['LineData', 'Grouping'],
                },
                {
                    name: 'Additional Students',
                    accessors: ['LineData', 'AdditionalStudents'],
                },
                {
                    name: 'Encounter Date',
                    accessors: ['LineData', 'EncounterDate'],
                    pipes: ["date:'MM/dd/YYYY'"],
                },
                {
                    name: 'Service Type',
                    accessors: ['LineData', 'ServiceType'],
                },
                {
                    name: 'Start Time',
                    accessors: ['LineData', 'StartTime'],
                },
                {
                    name: 'End Time',
                    accessors: ['LineData', 'EndTime'],
                },
                {
                    name: 'Total Minutes',
                    accessors: ['LineData', 'TotalMinutes'],
                },
                {
                    name: 'Is Telehealth',
                    accessors: ['LineData', 'IsTelehealth'],
                },
            ],
            export: {
                exportName: 'basic encounters',
            },
        });
    }
}

export class EncounterDetailedReportEntityListConfig extends EncounterBasicReportEntityListConfig {
    constructor(encounterResponseDtoService: EncounterResponseDtoService) {
        super();
        this.columns = [
            ...this.columns,

            {
                name: 'Reason For Service',
                accessors: ['LineData', 'ReasonForService'],
            },
            {
                name: 'Reason For Deviation',
                accessors: ['LineData', 'ReasonForDeviation'],
            },
            {
                name: 'Methods',
                accessorFunction: (v: IDetailedEncounterFullData) =>
                    encounterResponseDtoService.convertMethodsToCommaSeparatedList(v.LineData.Methods),
            },
            {
                name: 'Goals',
                accessorFunction: (v: IDetailedEncounterFullData) => encounterResponseDtoService.convertGoalsToCommaSeparatedList(v.LineData.Goals),
            },
            {
                name: 'Procedure Codes',
                accessorFunction: (v: IDetailedEncounterFullData) =>
                    encounterResponseDtoService.convertCptCodesToCommaSeparatedList(v.LineData.ProcedureCodes),
            },

            {
                name: 'Notes',
                accessors: ['LineData', 'Notes'],
            },
            {
                name: 'Entry Date',
                accessors: ['LineData', 'EntryDate'],
                pipes: ["date:'MM/dd/YYYY'"],
            },
        ];
        this.export = {
            exportName: 'detailed encounters',
        };
    }
}
