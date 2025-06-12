import { IEntity } from './base';

import { IEdiErrorCode } from './edi-error-code';

export interface IEdiFileType extends IEntity {
    EdiFileFormat: string;
    Name: string;
    IsResponse: boolean;

    // reverse nav
    EdiErrorCodes?: IEdiErrorCode[];
}
