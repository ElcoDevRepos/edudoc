import { IProvider } from '@model/interfaces/provider';
import { EntityListColumn, EntityListConfig, IEntityListConfig } from '@mt-ng2/entity-list-module';

export class ProvidersEntityListConfig extends EntityListConfig {
    constructor() {
        super({
            columns: [
                new EntityListColumn({
                    accessorFunction: function (provider: IProvider): string {
                        return `${provider.ProviderUser.LastName}, ${provider.ProviderUser.FirstName}`;
                    },
                    name: 'Name',
                    sort: {
                        sortProperty: 'ProviderUser.LastName',
                    },
                }),
                new EntityListColumn({
                    accessors: ['Id'],
                    name: 'Id',
                }),
                new EntityListColumn({
                    accessorFunction: function (provider: IProvider): string {
                        return `${provider.ProviderTitle.Name}`;
                    },
                    name: 'Title',
                    sort: {
                        sortProperty: 'ProviderTitle.Name',
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (provider: IProvider): string {
                        return `${provider.ProviderUser.Email}`;
                    },
                    name: 'Email',
                    sort: {
                        sortProperty: 'ProviderUser.Email',
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (provider: IProvider): string {
                        let escs = provider.ProviderEscAssignments?.filter((pe) => !pe.Archived).map((pe) => pe.Esc?.Name);

                        escs = escs.filter((value, index, self) => {
                            return self.indexOf(value) === index;
                        });

                        return escs.sort().join(', ').length > 0 ? escs.join(', ') : '<em>No Assignments</em>';
                    },
                    bindToInnerHtml: true,
                    name: 'ESCs',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (provider: IProvider): string {
                        const assignments = provider.ProviderEscAssignments?.filter((pe) => !pe.Archived).map((pe) => pe.ProviderEscSchoolDistricts);

                        let distinct = [];

                        for (const district of assignments) {
                            distinct = distinct.concat(district.map((pesd) => pesd.SchoolDistrict.Name));
                        }

                        distinct = distinct.filter((value, index, self) => {
                            return self.indexOf(value) === index;
                        });

                        return distinct.sort().join(', ').length > 0 ? distinct.join(', ') : '<em>No Assignments</em>';
                    },
                    bindToInnerHtml: true,
                    name: 'School Districts',
                    sort: {
                        disableSort: true,
                    },
                }),
            ],
            rowClass: (entity: IProvider) => (entity.Archived ? 'archived' : null),
        });
    }
}
