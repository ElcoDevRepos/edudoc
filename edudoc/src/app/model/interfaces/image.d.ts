import { IEntity } from './base';

import { IUser } from './user';

export interface IImage extends IEntity {
    Name: string;
    ImagePath: string;
    ThumbnailPath: string;

    // reverse nav
    Users?: IUser[];
}
