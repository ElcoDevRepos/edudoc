export interface IAuthUserDTO {
    Username: string;
    Password: string;
    RoleId: number;
}

export const emptyAuthUserDTO: IAuthUserDTO = {
    Password: '',
    RoleId: 0,
    Username: '',
};
