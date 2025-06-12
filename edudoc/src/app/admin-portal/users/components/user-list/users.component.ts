import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService, ClaimsService, ClaimValues } from '@mt-ng2/auth-module';
import { ExtraSearchParams, SearchParams } from '@mt-ng2/common-classes';
import { IColumnSortedEvent, IItemDeletedEvent, IItemSelectedEvent, SortDirection } from '@mt-ng2/entity-list-module';

import { UserService } from '@admin/users/services/user.service';
import { entityListModuleConfig } from '@common/shared.module';
import { ClaimTypes } from '@model/ClaimTypes';
import { UserTypesEnum } from '@model/enums/user-types.enum';
import { IUser } from '@model/interfaces/user';
import { IEntitySearchParams } from '@mt-ng2/common-classes';
import { DynamicField, DynamicFieldType, DynamicFieldTypes, IDynamicFieldType } from '@mt-ng2/dynamic-form';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { ISearchbarControlAPI } from '@mt-ng2/searchbar-control';
import { UsersEntityListConfig } from './users.entity-list-config';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
})
export class UsersComponent implements OnInit {
    title: string;
    pathRoot: string;
    userTypeFilter: UserTypesEnum;
    searchControl = new UntypedFormControl();
    canArchive: boolean;
    users: IUser[];
    currentPage = 1;
    query = '';
    total: number;
    canAddUser = false;
    includeArchived = false;

    entityListConfig = new UsersEntityListConfig();
    order = this.entityListConfig.getDefaultSortProperty();
    orderDirection: string = this.entityListConfig.getDefaultSortDirection();
    searchControlApi: ISearchbarControlAPI;

    constructor(
        private userService: UserService,
        private authService: AuthService,
        private claimsService: ClaimsService,
        private notificationsService: NotificationsService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
    ) {}

    ngOnInit(): void {
        const data = this.activatedRoute.snapshot.data;
        this.title = data.title;
        this.userTypeFilter = data.userTypeFilter;
        this.canArchive = this.userTypeFilter === UserTypesEnum.Admin;
        this.entityListConfig = new UsersEntityListConfig(this.canArchive);
        this.pathRoot = `/${this.activatedRoute.snapshot.url[0].path }`;
        this.canAddUser = this.claimsService.hasClaim(ClaimTypes.Users, [ClaimValues.FullAccess]);

        this.getUsers();
    }

    getUsers(): void {
        const search = this.query;

        const extraParams: ExtraSearchParams[] = [
            new ExtraSearchParams({
                name: 'UserTypeId',
                value: this.userTypeFilter.toString(),
            }),
            new ExtraSearchParams({
                name: 'ArchivedStatus',
                valueArray: this.includeArchived ? [0, 1] : [0],
            }),
        ];
        const searchEntity: IEntitySearchParams = {
            extraParams: extraParams,
            order: this.order,
            orderDirection: this.orderDirection,
            query: search && search.length > 0 ? search : '',
            skip: (this.currentPage - 1) * entityListModuleConfig.itemsPerPage,
            take: entityListModuleConfig.itemsPerPage,
        };

        const searchparams = new SearchParams(searchEntity);

        this.userService.get(searchparams).subscribe((answer) => {
            this.users = answer.body;
            this.total = +answer.headers.get('X-List-Count');
        });
    }

    getArchivedField(): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: 'Include Archived',
            name: 'includeArchived',
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Checkbox,
            }),
            value: this.includeArchived,
        });
    }

    search(query: string): void {
        this.query = query;
        this.getUsers();
    }

    columnSorted(event: IColumnSortedEvent): void {
        this.order = event.column.sort.sortProperty;
        this.orderDirection = event.column.sort.direction === SortDirection.Desc ? 'desc' : 'asc';
        this.getUsers();
    }

    userSelected(event: IItemSelectedEvent): void {
        void this.router.navigate([this.pathRoot, event.entity.Id]);
    }

    userDeleted(event: IItemDeletedEvent): void {
        const selectedUser = event.entity as IUser;
        const defaultAdminUserId = 1;
        if (selectedUser.Id !== defaultAdminUserId) {
            selectedUser.Archived = !selectedUser.Archived;
            selectedUser.ModifiedById = this.authService.currentUser.getValue().Id;
            selectedUser.DateModified = new Date();
            this.userService.updateVersion(selectedUser).subscribe(() => {
                this.notificationsService.success('User updated successfully');
                this.getUsers();
            });
        } else {
            this.notificationsService.error('User cannot be archived');
        }
    }

    searchControlReady(searchControlApi: ISearchbarControlAPI): void {
        this.searchControlApi = searchControlApi;
        this.searchControlApi.getSearchInputElement().nativeElement.placeholder = 'Begin typing...';
    }
}
