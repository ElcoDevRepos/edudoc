import { IAuthUserDTO } from '@model/interfaces/custom/auth-user.dto';
import { IProvider } from '@model/interfaces/provider';
import { IUser } from '@model/interfaces/user';

export interface IProviderDTO {
    AuthUser: IAuthUserDTO;
    User: IUser;
    Provider: IProvider;
    SendEmail: boolean;
    OldEmploymentTypeId: number;
    UserTypeId: number;
}
