import { DeleteEntityCellComponent } from '@common/delete-entity-cell-component/delete-entity-cell.component';
import { ICptCode } from '@model/interfaces/cpt-code';
import { EntityListColumn, EntityListConfig, IEntityListConfig } from '@mt-ng2/entity-list-module';

export class CptCodeEntityListConfig extends EntityListConfig {
    constructor() {
        const listConfig: IEntityListConfig = {
            columns: [
                new EntityListColumn({
                    accessors: ['Code'],
                    name: 'Code',
                }),
                new EntityListColumn({
                    accessors: ['Description'],
                    name: 'Description',
                }),
                new EntityListColumn({
                    accessorFunction: function (cptCode: ICptCode): string {
                        const assocations = cptCode.CptCodeAssocations?.filter((cca) => !cca.Archived)
                            .map((cca) => cca.ServiceCode);

                        let distinct = [];

                        for (const assocation of assocations) {
                            distinct = distinct.concat(assocation.Name);
                        }

                        distinct = distinct.filter((value, index, self) => {
                            return self.indexOf(value) === index;
                        });

                        return distinct.sort().join(', ').length > 0 ? distinct.join(', ') : '<em>None</em>';
                    },
                    bindToInnerHtml: true,
                    name: 'Service Codes',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    accessors: ['BillAmount'],
                    name: 'Bill Amount',
                }),
                new EntityListColumn({
                    component: DeleteEntityCellComponent,
                    name: 'Archive',
                    sort: { disableSort: true },
                    style: { width: 50 },
                }),
            ],
            rowClass: (entity: ICptCode) => (entity.Archived ? 'archived' : null),
        };
        super(listConfig);
    }
}
