export interface ISelectOptions {
    Id: number;
    Name: string;
    Archived: boolean;
}

export interface ISelectOptionsWithProviderId {
    Id: number;
    Name: string;
    ProviderIds: number[];
}
