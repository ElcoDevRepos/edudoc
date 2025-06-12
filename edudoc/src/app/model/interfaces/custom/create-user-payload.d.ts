import { IUser } from '../user';

export interface ICreateUserPayload {
    Password: string;
    SendEmail: boolean;
    User: IUser;
    Username: string;
    UserTypeId: number;
}
