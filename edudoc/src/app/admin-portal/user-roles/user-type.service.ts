import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUserType } from '@model/interfaces/user-type';
import { StaticMetaItemService } from '@mt-ng2/base-service';

@Injectable({ providedIn: 'root' })
export class UserTypeService extends StaticMetaItemService<IUserType> {
    constructor(public http: HttpClient) {
        super('UserTypeService', 'User Type', 'UserTypeIds', '/userTypes', http);
    }
}
