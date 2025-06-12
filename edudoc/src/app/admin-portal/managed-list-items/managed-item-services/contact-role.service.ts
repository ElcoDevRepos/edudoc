import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IContactRole } from '@model/interfaces/contact-role';
import { MetaItemService } from '@mt-ng2/base-service';

@Injectable({ providedIn: 'root' })
export class ContactRoleService extends MetaItemService<IContactRole> {
    constructor(public http: HttpClient) {
        super('ContactRoleService', 'Contact Role', 'ContactRoleIds', '/contactRoles', http);
    }
}
