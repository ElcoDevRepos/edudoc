import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { entityListModuleConfig } from '@common/shared.module';
import { ClaimTypes } from '@model/ClaimTypes';
import { IUserRole } from '@model/interfaces/user-role';
import { ClaimsService, ClaimValues } from '@mt-ng2/auth-module';
import { ExtraSearchParams, IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import { MtSearchFilterItem } from '@mt-ng2/search-filter-select-control';
import { debounceTime } from 'rxjs/operators';
import { UserRoleService } from '../user-role.service';
import { UserTypeService } from '../user-type.service';

@Component({
    selector: 'app-user-roles',
    templateUrl: './user-roles.component.html',
})
export class UserRolesComponent implements OnInit {
    searchControl = new UntypedFormControl();
    userRoles: IUserRole[];
    userTypeSearchFilterItems: MtSearchFilterItem[] = [];
    currentPage = 1;
    total: number;
    canAddRole = false;
    itemsPerPage = entityListModuleConfig.itemsPerPage;

    constructor(
        private userRoleService: UserRoleService,
        private claimService: ClaimsService,
        private userTypeService: UserTypeService,
        ) {}

    ngOnInit(): void {
        this.searchControl.valueChanges.pipe(debounceTime(300)).subscribe(() => this.getUserRoles());
        this.userTypeService.getSearchFilterItems().subscribe((answer) => (this.userTypeSearchFilterItems = answer));
        this.canAddRole = this.claimService.hasClaim(ClaimTypes.HPCUserAccess, [ClaimValues.FullAccess]);
        this.getUserRoles();
    }

    getUserRoles(): void {
        const search = this.searchControl.value;

        const _extraSearchParams: ExtraSearchParams[] = [
            new ExtraSearchParams({
                name: 'typeids',
                valueArray: this.userTypeSearchFilterItems.filter((item) => item.Selected).map((item) => item.Item.Id),
            }),
        ];

        const searchEntity: IEntitySearchParams = {
            extraParams: _extraSearchParams,
            query: search && search.length > 0 ? search : '',
            skip: (this.currentPage - 1) * entityListModuleConfig.itemsPerPage,
            take: entityListModuleConfig.itemsPerPage,
        };
        const searchparams = new SearchParams(searchEntity);

        this.userRoleService.get(searchparams).subscribe((answer) => {
            this.userRoles = answer.body;
            this.total = +answer.headers.get('X-List-Count');
        });
    }

    clearSearch(): void {
        this.searchControl.setValue('');
    }

    noRoles(): boolean {
        return !this.userRoles || this.userRoles.length === 0;
    }

    pagingNeeded(): boolean {
        return this.total > this.itemsPerPage;
    }

}
