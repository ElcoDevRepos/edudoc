import { IEntity } from './base';

import { IAuthUser } from './auth-user';
import { IUserRoleClaim } from './user-role-claim';
import { IUser } from './user';
import { IUserType } from './user-type';

export interface IUserRole extends IEntity {
    Name: string;
    Description: string;
    IsEditable: boolean;
    UserTypeId: number;
    CreatedById?: number;
    ModifiedById?: number;
    DateCreated?: Date;
    DateModified?: Date;
    Archived: boolean;

    // reverse nav
    AuthUsers?: IAuthUser[];
    UserRoleClaims?: IUserRoleClaim[];

    // foreign keys
    CreatedBy?: IUser;
    ModifiedBy?: IUser;
    UserType?: IUserType;
}
