import { IAddress } from './address';

export interface IEntity {
    Id: number;
}

export interface IMetaItem extends IEntity {
    Name: string;
}

export interface IVersionable {
    Version: number[];
}

export interface IDocument extends IEntity {
    Name: string;
    DateUpload: Date;
    UploadedBy?: number;
    FilePath: string;
}

export interface INote extends IEntity {
    Title: string;
    NoteText: string;
}

export interface IPhone {
    Phone: string;
    Extension: string;
    PhoneTypeId: number;
    IsPrimary: boolean;
}

export interface IPhoneType extends IEntity {
    Name: string;
}

export interface IAddressContainer {
    AddressId: number;
    Address: IAddress;
    IsPrimary: boolean;
}

