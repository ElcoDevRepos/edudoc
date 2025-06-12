export enum ManagedListTypeIds {
    ProviderTitle = 1,
    ContactRole = 2,
    ProviderAgency = 3,
    EncounterLocation = 4,
    Methods = 5,
    ReturnReasonCategory = 6,
    DisabilityCodes = 7,
    StudentDeviationReasons = 8,
    DocumentType = 9,
    NonMspService = 10,
    VoucherType = 11,
}

export interface IManagedListConfig {
    DynamicConfig: string;
    Id: ManagedListTypeIds;
    Name: string;
    Service: string;
}
