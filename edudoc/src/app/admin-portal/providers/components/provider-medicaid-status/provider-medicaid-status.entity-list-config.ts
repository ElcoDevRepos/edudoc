import { unique } from '@common/array-utils';
import { IProvider } from '@model/interfaces/provider';
import { EntityListColumn, EntityListConfig } from '@mt-ng2/entity-list-module';

export class ProviderMedicaidStatusEntityListConfig extends EntityListConfig {
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
                    accessorFunction: function (provider: IProvider): string {
                        return `${provider.ProviderTitle.Name}`;
                    },
                    name: 'Provider Title',
                    sort: {
                        sortProperty: 'ProviderTitle.Name',
                    },
                }),
                new EntityListColumn({
                    name: 'Districts',
                    accessorFunction: (provider: IProvider) =>
                        unique(
                            provider.ProviderEscAssignments.map((esc) => esc.ProviderEscSchoolDistricts.map((sd) => sd.SchoolDistrict.Name)).reduce(
                                (acc, curr) => acc.concat(...curr),
                                [],
                            ),
                        ).join(', '),
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    accessors: ['Npi'],
                    name: 'NPI',
                }),
                new EntityListColumn({
                    accessorFunction: function (provider: IProvider): string {
                        return provider.VerifiedOrp && provider.OrpApprovalDate !== null
                            ? 'Confirmed'
                            : provider.OrpApprovalRequestDate !== null && provider.OrpDenialDate === null
                            ? 'Pending'
                            : 'No Acknowledgement';
                    },
                    bindToInnerHtml: true,
                    name: 'Medicaid Status',
                    sort: {
                        disableSort: true,
                    },
                }),
            ],
        });
    }
}
