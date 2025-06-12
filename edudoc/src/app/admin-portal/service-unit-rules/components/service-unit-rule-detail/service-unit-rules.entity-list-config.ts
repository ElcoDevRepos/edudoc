import { DatePipe } from '@angular/common';
import { IServiceUnitRule } from '@model/interfaces/service-unit-rule';
import { EntityListColumn, EntityListConfig, IEntityListConfig } from '@mt-ng2/entity-list-module';
import { EffectiveTillCellDynamicCellComponent } from './effective-till-cell/effective-till-cell.component';

export class ServiceUnitRulesEntityListConfig extends EntityListConfig {
    constructor() {
        const listConfig: IEntityListConfig = {
            columns: [
                new EntityListColumn({
                    name: 'Name',
                }),
                new EntityListColumn({
                    name: 'Description',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (response: IServiceUnitRule): string {
                        return response.CptCode?.Code || 'None Selected';
                    },
                    name: 'Crossover',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (response: IServiceUnitRule): string {
                        return new DatePipe('en-US').transform(response.EffectiveDate, 'MMM d, y', 'UTC');
                    },
                    name: 'Valid Until',
                    pipes: ['date'],
                    sort: { disableSort: true },
                }),
                new EntityListColumn({
                    columnClass: 'effective-till-cell',
                    component: EffectiveTillCellDynamicCellComponent,
                    excludeFromExport: true,
                    fireOnColumnSelected: false,
                    name: 'Archive',
                    sort: {
                        disableSort: true,
                    },
                }),
            ],
        };
        super(listConfig);
    }
}
