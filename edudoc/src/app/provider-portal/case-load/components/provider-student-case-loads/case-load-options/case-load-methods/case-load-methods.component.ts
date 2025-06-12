import { Component, Input, OnInit } from '@angular/core';
import { archiveConfirm, unarchiveConfirm } from '@common/mtConfirmOptions/mtConfirmOptions';
import { ICaseLoad } from '@model/interfaces/case-load';
import { ICaseLoadMethod } from '@model/interfaces/case-load-method';
import { IMethod } from '@model/interfaces/method';
import { AuthService } from '@mt-ng2/auth-module';
import { ExtraSearchParams, IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import { DynamicField, DynamicFieldType, DynamicFieldTypes, IDynamicFieldType } from '@mt-ng2/dynamic-form';
import { SortDirection } from '@mt-ng2/entity-list-module';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { MtSearchFilterItem } from '@mt-ng2/search-filter-select-control';
import { CaseLoadMethodsService } from '@provider/case-load/services/case-load-methods.service';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-case-load-methods',
    templateUrl: './case-load-methods.component.html',
})
export class CaseLoadMethodsComponent implements OnInit {
    @Input() caseLoad: ICaseLoad;
    @Input() canEdit: boolean;
    @Input() isAdding = false;

    caseLoadMethods: ICaseLoadMethod[] = [];
    selectedMethod: IMethod;
    methodOptions: MtSearchFilterItem[] = [];
    allMethodOptions: MtSearchFilterItem[] = [];

    query = '';
    total: number;
    doubleClickIsDisabled = false;
    includeArchived = false;
    isEditing = true;
    isHovered: boolean;
    isCardOpen = false;

    archiveConfirm = archiveConfirm;
    unarchiveConfirm = unarchiveConfirm;

    constructor(
        private caseLoadMethodsService: CaseLoadMethodsService,
        private notificationService: NotificationsService,
        private authService: AuthService,
    ) {}

    ngOnInit(): void {
        this.caseLoadMethodsService.getMethodOptions().subscribe(
            (answer) => {
                this.allMethodOptions = answer.map((item) => {
                    return new MtSearchFilterItem(item, false);
                });
                if (this.isAdding) {
                    if (!this.caseLoad.CaseLoadMethods) {
                        this.caseLoad.CaseLoadMethods = [];
                    }
                    this.caseLoadMethods = [...this.caseLoad.CaseLoadMethods];
                    this.filterMethodOptions();
                } else {
                    this.refreshMethods();
                }
            });
    }

    getCaseLoadMethods(): void {
        const search = this.query;
        const _extraSearchParams: ExtraSearchParams[] = this.buildSearch();

        const searchEntity: IEntitySearchParams = {
            extraParams: _extraSearchParams,
            order: 'Id',
            orderDirection: SortDirection.Desc,
            query: search && search.length > 0 ? search : '',
            take: 9999,
        };

        const searchparams = new SearchParams(searchEntity);
        this.caseLoadMethodsService.get(searchparams).subscribe((answer) => {
            this.caseLoadMethods = answer.body;
            this.filterMethodOptions();
            this.total = +answer.headers.get('X-List-Count');
        });
    }

    private buildSearch(): ExtraSearchParams[] {
        const _extraSearchParams: ExtraSearchParams[] = [];

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'CaseLoadId',
                value: this.caseLoad.Id.toString(),
            }),
        );

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'includeArchived',
                value: this.includeArchived ? '1' : '0',
            }),
        );

        return _extraSearchParams;
    }

    edit(): void {
        if (this.canEdit) {
            this.isEditing = true;
        }
    }

    toggleCardOpen(): void {
        this.isCardOpen = !this.isCardOpen;
    }

    cancelClick(): void {
        this.isEditing = false;
    }

    noCaseLoadMethods(): boolean {
        return !this.caseLoadMethods || this.caseLoadMethods.length === 0;
    }

    addMethods(): void {
        this.getSelectedMethods().forEach((method) => {
            const newCaseLoadMethod = this.caseLoadMethodsService.getEmptyCaseLoadMethod();

            newCaseLoadMethod.CaseLoadId = this.caseLoad.Id;
            newCaseLoadMethod.CreatedById = this.authService.currentUser.getValue().Id;
            newCaseLoadMethod.MethodId = method.Id;

            if (this.isAdding) {
                newCaseLoadMethod.Method = method;
                this.caseLoadMethods.push(newCaseLoadMethod);
                this.caseLoad.CaseLoadMethods.push(newCaseLoadMethod);
                this.filterMethodOptions();
            } else {
                this.saveCaseLoadMethod(newCaseLoadMethod);
                this.getCaseLoadMethods();
            }
        });

        this.clearSelectedOptions();
    }

    private saveCaseLoadMethod(caseLoadMethod: ICaseLoadMethod): void {
        this.caseLoadMethodsService
            .create(caseLoadMethod)            .subscribe(() => {
                this.success();
            });
    }

    private success(): void {
        this.getCaseLoadMethods();
        this.notificationService.success('Methods saved successfully.');
    }

    clearSelectedOptions(): void {
        this.allMethodOptions.forEach((item) => {
            item.Selected = false;
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

    archiveCaseLoadMethod(caseLoadMethod: ICaseLoadMethod): void {
        if (this.isAdding) {
            this.caseLoadMethods = this.caseLoadMethods.filter((clm) => clm !== caseLoadMethod);
            this.caseLoad.CaseLoadMethods = this.caseLoad.CaseLoadMethods.filter((clm) => clm !== caseLoadMethod);
            this.filterMethodOptions();
        } else {
            if (caseLoadMethod.Id === 0) {
                this.caseLoad.CaseLoadMethods = this.caseLoad.CaseLoadMethods.filter((clm) => clm !== caseLoadMethod);
            } else {
                caseLoadMethod.Archived = !caseLoadMethod.Archived;
                this.caseLoadMethodsService.update(caseLoadMethod).subscribe(() => {
                    this.notificationService.success('Method Updated Successfully');
                    this.getCaseLoadMethods();
                });
            }

        }
    }

    private refreshMethods(): void {
        this.getCaseLoadMethods();
    }

    getSelectedMethods(): IMethod[] {
        return this.methodOptions.filter((item) => item.Selected).map((item) => item.Item);
    }

    filterMethodOptions(): void {
        this.methodOptions = this.allMethodOptions.filter((item) => !this.caseLoadMethods.some((method) => method.MethodId === item.Item.Id));
    }
}
