import { DatePipe } from '@angular/common';
import { IClaimsEncounter } from '@model/interfaces/claims-encounter';
import { EntityListColumn, EntityListConfig, IEntityListConfig } from '@mt-ng2/entity-list-module';

export class RejectedEncountersEntityListConfig extends EntityListConfig {
    constructor() {
        const listConfig: IEntityListConfig = {
            columns: [
                new EntityListColumn({
                    accessorFunction: function (voucher: IClaimsEncounter): string {
                        return new Date(new DatePipe('en-Us').transform(voucher.VoucherDate, 'yyyy-MM-ddThh:mm:ss', 'UTC')).toLocaleDateString();
                    },
                    name: 'Voucher Date',
                    sort: {
                        sortProperty: 'VoucherDate',
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (encounter: IClaimsEncounter): string {
                        return new Date(new DatePipe('en-Us').transform(encounter.EncounterStudent.Encounter.EncounterDate, 'yyyy-MM-ddThh:mm:ss', 'UTC')).toLocaleDateString();
                    },
                    name: 'Session Date',
                    sort: {
                        sortProperty: 'EncounterStudent.Encounter.EncounterDate',
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (encounter: IClaimsEncounter): string {
                        return encounter.EncounterStudent.EncounterNumber;
                    },
                    name: 'Encounter Number',
                    sort: {
                        sortProperty: 'EncounterStudent.EncounterNumber',
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (encounter: IClaimsEncounter): string {
                        return encounter.AdjustmentReasonCode && encounter.EdiErrorCode ?
                            (encounter.EdiErrorCode.Name.length ? `${encounter.AdjustmentReasonCode}: ${encounter.EdiErrorCode.Name}`
                                : `${encounter.AdjustmentReasonCode}: Unknown Error Code`)
                            : (encounter.AdjustmentReasonCode ? `Adjustment Reason Code: ${encounter.AdjustmentReasonCode.toString()}`
                                : `Claim Paid Amount: 0`);
                    },
                    name: 'Failure Reason',
                    sort: {
                        sortProperty: 'ClaimsStudent.ResponseRejectReason',
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (encounter: IClaimsEncounter): string {
                        return `${encounter.EncounterStudent.Student.LastName}, ${encounter.EncounterStudent.Student.FirstName}\n(${new DatePipe('en-US').transform(encounter.EncounterStudent.Student.DateOfBirth, 'MM/dd/yyyy')})`;

                    },
                    name: 'Student',
                    sort: {
                        sortProperty: 'EncounterStudent.Student.LastName',
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (encounter: IClaimsEncounter): string {
                        return encounter.ReferenceNumber ? `${encounter.ReferenceNumber}` : '';
                    },
                    name: 'EDI Claim No.',
                    sort: {
                        sortProperty: 'ReferenceNumber',
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (encounter: IClaimsEncounter): string {
                        return encounter.ClaimId ? `${encounter.ClaimId}`: '';
                    },
                    name: 'TCN',
                    sort: {
                        sortProperty: 'ClaimId',
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (encounter: IClaimsEncounter): string {
                        return `${encounter.EncounterStudent.Encounter.Provider.Npi}`;
                    },
                    name: 'NPI No.',
                    sort: {
                        sortProperty: 'EncounterStudent.Encounter.Provider.NPI',
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (encounter: IClaimsEncounter): string {
                        return `${encounter.EncounterStudent.Student.MedicaidNo}`;
                    },
                    name: 'Medicaid No.',
                    sort: {
                        sortProperty: 'EncounterStudent.Student.MedicaidNo',
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (encounter: IClaimsEncounter): string {
                        return `${encounter.ProcedureIdentifier}`;
                    },
                    name: 'CPT Code',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (encounter: IClaimsEncounter): string {
                        return `${encounter.EncounterStudent.Encounter.Provider.ProviderUser.LastName}, ${encounter.EncounterStudent.Encounter.Provider.ProviderUser.FirstName}`;
                    },
                    name: 'Provider Name',
                    sort: {
                        sortProperty: 'EncounterStudent.Encounter.Provider.ProviderUser.LastName',
                    },
                }),
            ],
        };
        super(listConfig);
    }
}
