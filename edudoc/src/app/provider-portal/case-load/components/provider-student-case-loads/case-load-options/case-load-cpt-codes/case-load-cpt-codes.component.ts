import { Component, Input, OnInit } from '@angular/core';
import { archiveConfirm, unarchiveConfirm } from '@common/mtConfirmOptions/mtConfirmOptions';
import { ICaseLoad } from '@model/interfaces/case-load';
import { ICaseLoadCptCode } from '@model/interfaces/case-load-cpt-code';
import { ICptCode } from '@model/interfaces/cpt-code';
import { AuthService } from '@mt-ng2/auth-module';
import { ExtraSearchParams, IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import { DynamicField, DynamicFieldType, DynamicFieldTypes, IDynamicFieldType } from '@mt-ng2/dynamic-form';
import { SortDirection } from '@mt-ng2/entity-list-module';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { MtSearchFilterItem } from '@mt-ng2/search-filter-select-control';
import { CaseLoadCptCodesService } from '@provider/case-load/services/case-load-cpt-codes.service';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-case-load-cpt-codes',
    templateUrl: './case-load-cpt-codes.component.html',
})
export class CaseLoadCptCodesComponent implements OnInit {
    @Input() caseLoad: ICaseLoad;
    @Input() canEdit: boolean;
    @Input() isAdding = false;

    caseLoadCptCodes: ICaseLoadCptCode[] = [];
    selectedCptCode: ICptCode;
    cptCodeOptions: MtSearchFilterItem[] = [];
    allCptCodeOptions: MtSearchFilterItem[] = [];
    cptCodeSearch: ICptCode[];

    query = '';
    total: number;
    doubleClickIsDisabled = false;
    includeArchived = false;
    isEditing = true;
    isHovered: boolean;
    isCardOpen = false;

    archiveConfirm = archiveConfirm;
    unarchiveConfirm = unarchiveConfirm;

    get nonDefaultCaseLoadCptCodes(): ICaseLoadCptCode[] {
        return this.caseLoadCptCodes.filter((code) => !code.Default);
    }

    constructor(
        private caseLoadCptCodesService: CaseLoadCptCodesService,
        private notificationService: NotificationsService,
        private authService: AuthService,
    ) {}

    ngOnInit(): void {
        this.caseLoadCptCodesService.getCptCodeOptions().subscribe((answer) => {
            this.allCptCodeOptions = answer.map((item) => {
                this.cptCodeSearch = answer;
                return new MtSearchFilterItem(
                    {
                        ...item,
                        Name: `${item.Code} - ${item.Description}`,
                    },
                    false,
                );
            });
            if (this.isAdding) {
                if (!this.caseLoad.CaseLoadCptCodes) {
                    this.caseLoad.CaseLoadCptCodes = answer.filter((code) => code.CptCodeAssocations.some((association) => association.Default)).map((code) => {
                        const newCode = this.caseLoadCptCodesService.getEmptyCaseLoadCptCode();
                        newCode.CptCodeId = code.Id;
                        newCode.CptCode = code;
                        newCode.Default = true;
                        return newCode;
                    }) || [];
                }
                this.caseLoadCptCodes = [...this.caseLoad.CaseLoadCptCodes];
                this.filterCptCodeOptions();
            } else {
                this.refreshCptCodes();
            }
        });
    }

    getCaseLoadCptCodes(): void {
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
        this.caseLoadCptCodesService.get(searchparams).subscribe((answer) => {
            this.caseLoadCptCodes = answer.body;
            this.filterCptCodeOptions();
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

    noCaseLoadCptCodes(): boolean {
        return !this.caseLoadCptCodes || this.caseLoadCptCodes.length === 0;
    }

    addCptCodes(): void {
        this.getSelectedCptCodes().forEach((cptcode) => {
            const newCaseLoadCptCode = this.caseLoadCptCodesService.getEmptyCaseLoadCptCode();

            newCaseLoadCptCode.CaseLoadId = this.caseLoad.Id;
            newCaseLoadCptCode.CreatedById = this.authService.currentUser.getValue().Id;
            newCaseLoadCptCode.CptCodeId = cptcode.Id;

            if (this.isAdding) {
                newCaseLoadCptCode.CptCode = cptcode;
                this.caseLoadCptCodes.push(newCaseLoadCptCode);
                this.caseLoad.CaseLoadCptCodes.push(newCaseLoadCptCode);
                this.filterCptCodeOptions();
            } else {
                this.saveCaseLoadCptCode(newCaseLoadCptCode);
                this.getCaseLoadCptCodes();
            }
        });

        this.clearSelectedOptions();
    }

    private saveCaseLoadCptCode(caseLoadCptCode: ICaseLoadCptCode): void {
        this.caseLoadCptCodesService
            .createWithFks(caseLoadCptCode)            .subscribe(() => {
                this.success();
            });
    }

    private success(): void {
        this.getCaseLoadCptCodes();
        this.notificationService.success('Procedure Codes saved successfully.');
    }

    clearSelectedOptions(): void {
        this.allCptCodeOptions.forEach((item) => {
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

    archiveCaseLoadCptCode(caseLoadCptCode: ICaseLoadCptCode): void {
        if (this.isAdding) {
            this.caseLoadCptCodes = this.caseLoadCptCodes.filter((clg) => clg !== caseLoadCptCode);
            this.caseLoad.CaseLoadCptCodes = this.caseLoad.CaseLoadCptCodes.filter((clg) => clg !== caseLoadCptCode);
            this.filterCptCodeOptions();
        } else {
            if (!caseLoadCptCode.Archived && this.caseLoadCptCodes.filter((x) => !x.Archived).length === 1) {
                this.notificationService.error('Cannot remove the last Procedure Code, at least one is required.');
                return;
            }
            if (caseLoadCptCode.Id === 0) {
                this.caseLoad.CaseLoadCptCodes = this.caseLoad.CaseLoadCptCodes.filter((clg) => clg !== caseLoadCptCode);
            } else {
                caseLoadCptCode.Archived = !caseLoadCptCode.Archived;
                this.caseLoadCptCodesService.update(caseLoadCptCode).subscribe(() => {
                    this.notificationService.success('Procedure Code Updated Successfully');
                    this.getCaseLoadCptCodes();
                });
            }
        }
    }

    private refreshCptCodes(): void {
        this.getCaseLoadCptCodes();
    }

    getSelectedCptCodes(): ICptCode[] {
        return this.cptCodeSearch.filter((item) => this.cptCodeOptions.some((filterItem) => filterItem.Item.Id === item.Id && filterItem.Selected));
    }

    filterCptCodeOptions(): void {
        this.cptCodeOptions = this.allCptCodeOptions.filter((item) => !this.caseLoadCptCodes.some((cptCode) => cptCode.CptCodeId === item.Item.Id));
    }
}
