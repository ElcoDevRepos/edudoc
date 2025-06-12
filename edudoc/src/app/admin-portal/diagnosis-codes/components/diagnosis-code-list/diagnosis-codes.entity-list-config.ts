import { DeleteEntityCellComponent } from '@common/delete-entity-cell-component/delete-entity-cell.component';
import { EncounterServiceTypes } from '@model/enums/encounter-service-types.enum';
import { IDiagnosisCode } from '@model/interfaces/diagnosis-code';
import { EntityListColumn, EntityListConfig, IEntityListConfig } from '@mt-ng2/entity-list-module';

export class DiagnosisCodesEntityListConfig extends EntityListConfig {
    constructor() {
        const listConfig: IEntityListConfig = {
            columns: [
                new EntityListColumn({
                    name: 'Code',
                }),
                new EntityListColumn({
                    accessorFunction: function (diagnosisCode: IDiagnosisCode): string {
                        return diagnosisCode.Description.length > 50 ?
                                            `<i data-toggle="tooltip"
                                                [title]="diagnosisCode.Description"
                                            >
                                                ${ diagnosisCode.Description.substr(0, 50) + '...'}
                                            </i>` : diagnosisCode.Description;
                    },
                    bindToInnerHtml: true,
                    name: 'Description',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (diagnosisCode: IDiagnosisCode): string {
                        let serviceCodes = diagnosisCode.DiagnosisCodeAssociations?.filter((da) => !da.Archived &&
                            da.ServiceTypeId === EncounterServiceTypes.Treatment_Therapy)
                                .map((da) => da.ServiceCode?.Name);

                        serviceCodes = serviceCodes.filter((value, index, self) => {
                            return self.indexOf(value) === index;
                        });

                        return serviceCodes.sort().join(', ').length > 0 ? serviceCodes.join(', ') : '<em>No Associations</em>';
                    },
                    bindToInnerHtml: true,
                    name: 'Treatment/Therapy',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (diagnosisCode: IDiagnosisCode): string {
                        let serviceCodes = diagnosisCode.DiagnosisCodeAssociations?.filter((da) => !da.Archived &&
                            da.ServiceTypeId === EncounterServiceTypes.Evaluation_Assessment)
                                .map((da) => da.ServiceCode?.Name);

                        serviceCodes = serviceCodes.filter((value, index, self) => {
                            return self.indexOf(value) === index;
                        });

                        return serviceCodes.sort().join(', ').length > 0 ? serviceCodes.join(', ') : '<em>No Associations</em>';
                    },
                    bindToInnerHtml: true,
                    name: 'Evaluation / Assessment',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (diagnosisCode: IDiagnosisCode): string {
                        let serviceCodes = diagnosisCode.DiagnosisCodeAssociations?.filter((da) => !da.Archived &&
                            da.ServiceTypeId === EncounterServiceTypes.Other_Non_Billable)
                                .map((da) => da.ServiceCode?.Name);

                        serviceCodes = serviceCodes.filter((value, index, self) => {
                            return self.indexOf(value) === index;
                        });

                        return serviceCodes.sort().join(', ').length > 0 ? serviceCodes.join(', ') : '<em>No Associations</em>';
                    },
                    bindToInnerHtml: true,
                    name: 'Other (Non-Billable)',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    accessors: ['EffectiveDateFrom'],
                    name: 'Effective Date From',
                    pipes: ['date'],
                }),
                new EntityListColumn({
                    accessors: ['EffectiveDateTo'],
                    name: 'Effective Date To',
                    pipes: ['date'],
                }),
                new EntityListColumn({
                    component: DeleteEntityCellComponent,
                    name: 'Archive',
                    sort: { disableSort: true },
                    style: { width: 50 },
                }),
            ],
            rowClass: (entity: IDiagnosisCode) => (entity.Archived ? 'archived' : null),
        };
        super(listConfig);
    }
}
