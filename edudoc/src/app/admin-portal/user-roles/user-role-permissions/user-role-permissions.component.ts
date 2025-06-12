import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';

import { EntityListColumn, EntityListConfig } from '@mt-ng2/entity-list-module';

import { IClaimValue } from '@model/interfaces/claim-value';
import { ISearchbarControlAPI } from '@mt-ng2/searchbar-control';
import { Permission } from './permissions.library';

@Component({
    selector: 'app-user-role-permissions',
    styles: [
        `
            h4 {
                border-bottom: 0px;
            }
            h4.permissions {
                color: #4e6365;
                font-weight: 700;
                padding-bottom: 5px;
            }
            tr.permission {
                cursor: default;
            }
            td.claim-value-buttons {
                width: 300px;
            }
            .claim-type-name {
                margin-top: 8px;
                margin-bottom: 8px;
            }
            tr.child-permission > td:nth-child(1) {
                padding-top: 15px;
            }
            tr.child-permission > td:nth-child(1) > i {
                padding-top: 4px;
                padding-left: 5px;
                padding-right: 12px;
            }
            tr.child-permission > td:nth-child(2) > div > label.btn-primary-inverse.btn.read-only {
                visibility: hidden;
            }
        `,
    ],
    templateUrl: './user-role-permissions.component.html',
})
export class UserRolePermissionsComponent {
    private _permissions: Permission[];
    searchControlApi: ISearchbarControlAPI;
    @Input('permissions')
    get permissions(): Permission[] {
        return this._permissions;
    }
    set permissions(value: Permission[]) {
        this._permissions = this.orderPermissions(value);
    }
    @Input('claimValues') claimValues: IClaimValue[];
    @Input('canEdit') canEdit: boolean;
    @Output('onPermissionUpdated') onPermissionUpdated: EventEmitter<Permission> = new EventEmitter<Permission>();

    entityListConfig: EntityListConfig = new EntityListConfig({
        columns: [
            new EntityListColumn({
                name: 'Permission',
            }),
            new EntityListColumn({
                name: 'Access',
            }),
        ],
    });
    query = '';

    get filteredPermissions(): Permission[] {
        if (!this.permissions) {
            return null;
        }
        if (!this.query) {
            return this.permissions;
        }
        return this.permissions.filter((item) => {
            // first check the name for a match
            const nameMatches = item.claimType.Name.toLowerCase().includes(this.query.toLowerCase());
            if (nameMatches) {
                return true;
            }
            // include parents when the child name matches
            const childNameMatches = this.permissions
                .filter((p) => p.claimType.ParentId === item.claimType.Id)
                .some((child) => child.claimType.Name.toLowerCase().includes(this.query.toLowerCase()));
            return childNameMatches;
        });
    }

    // child claim values are different because we want to change the wording in the UI
    childClaimValues: IClaimValue[] = [
        { Id: 1, Name: 'Has Access' },
        { Id: 2, Name: 'Read Only' }, // hidden in the UI, here only for providing easy UI spacing
        { Id: 0, Name: 'No Access' },
    ];

    constructor(public fb: UntypedFormBuilder) {}

    orderPermissions(permissionsToOrder: Permission[]): Permission[] {
        let answer: Permission[] = [];
        const parents = permissionsToOrder.filter((p) => !p.claimType.ParentId);
        parents.forEach((parent) => {
            answer.push(parent);
            const children = permissionsToOrder.filter((p) => p.claimType.ParentId === parent.claimType.Id);
            answer = answer.concat(children);
        });
        return answer;
    }

    search(query: string): void {
        this.query = query;
    }

    permissionUpdated(permission: Permission): void {
        this.onPermissionUpdated.emit(permission);
    }

    searchControlReady(searchControlApi: ISearchbarControlAPI): void {
        this.searchControlApi = searchControlApi;
        this.searchControlApi.getSearchInputElement().nativeElement.placeholder = 'Begin typing...';
    }
}
