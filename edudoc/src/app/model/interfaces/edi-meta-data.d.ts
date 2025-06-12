import { IEntity } from './base';


export interface IEdiMetaData extends IEntity {
    SenderId: number;
    ReceiverId: string;
    ClaimImplementationReference: string;
    RosterValidationImplementationReference: string;
    SubmitterOrganizationName: string;
    SubmitterQlfrId: string;
    SubmitterName: string;
    SubmitterPhone: string;
    SubmitterPhoneAlt: string;
    SubmitterEmail: string;
    ReceiverOrganizationName: string;
    ProviderCode: string;
    ReferenceQlfrId: string;
    ProviderOrganizationName: string;
    ServiceLocationCode: string;
    ClaimNoteDescription: string;
    FacilityCode: string;
}
