import { Component, Input, OnInit } from '@angular/core';
import { archiveConfirm, unarchiveConfirm } from '@common/mtConfirmOptions/mtConfirmOptions';
import { ICaseLoad } from '@model/interfaces/case-load';
import { ICaseLoadGoal } from '@model/interfaces/case-load-goal';
import { IGoal } from '@model/interfaces/goal';
import { AuthService } from '@mt-ng2/auth-module';
import { ExtraSearchParams, IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import { DynamicField, DynamicFieldType, DynamicFieldTypes, IDynamicFieldType } from '@mt-ng2/dynamic-form';
import { SortDirection } from '@mt-ng2/entity-list-module';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { MtSearchFilterItem } from '@mt-ng2/search-filter-select-control';
import { CaseLoadGoalsService } from '@provider/case-load/services/case-load-goals.service';
import { ProviderPortalAuthService } from '@provider/provider-portal-auth.service';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-case-load-goals',
    templateUrl: './case-load-goals.component.html',
})
export class CaseLoadGoalsComponent implements OnInit {
    @Input() caseLoad: ICaseLoad;
    @Input() canEdit: boolean;
    @Input() isAdding = false;

    caseLoadGoals: ICaseLoadGoal[] = [];
    selectedGoal: IGoal;
    goalOptions: MtSearchFilterItem[] = [];
    allGoalOptions: MtSearchFilterItem[] = [];
    serviceCodeId: number;
    goalSearch: IGoal[] = [];

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
        private caseLoadGoalsService: CaseLoadGoalsService,
        private notificationService: NotificationsService,
        private authService: AuthService,
        private providerAuthService: ProviderPortalAuthService,
    ) {}

    ngOnInit(): void {
        this.serviceCodeId = this.providerAuthService.getProviderServiceCode();

        this.caseLoadGoalsService.getGoalOptions().subscribe(
            (answer) => {
                this.goalSearch = answer;
                this.allGoalOptions = answer.map((item) => {
                    return new MtSearchFilterItem(
                        {
                            ...item,
                            Name: item.Description,
                        },
                        false,
                    );
                });
                if (this.isAdding) {
                    if (!this.caseLoad.CaseLoadGoals) {
                        this.caseLoad.CaseLoadGoals = [];
                    }
                    this.caseLoadGoals = [...this.caseLoad.CaseLoadGoals];
                    this.filterGoalOptions();
                } else {
                    this.refreshGoals();
                }
            });
    }

    getCaseLoadGoals(): void {
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
        this.caseLoadGoalsService.get(searchparams).subscribe((answer) => {
            this.caseLoadGoals = answer.body;
            this.filterGoalOptions();
            this.caseLoad.CaseLoadGoals = answer.body;
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
                name: 'ServiceCodeId',
                value: this.serviceCodeId.toString(),
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

    noCaseLoadGoals(): boolean {
        return !this.caseLoadGoals || this.caseLoadGoals.length === 0;
    }

    addGoals(): void {
        this.getSelectedGoals().forEach((goal) => {
            const newCaseLoadGoal = this.caseLoadGoalsService.getEmptyCaseLoadGoal();

            newCaseLoadGoal.CaseLoadId = this.caseLoad.Id;
            newCaseLoadGoal.CreatedById = this.authService.currentUser.getValue().Id;
            newCaseLoadGoal.GoalId = goal.Id;

            if (this.isAdding) {
                newCaseLoadGoal.Goal = goal;
                this.caseLoadGoals.push(newCaseLoadGoal);
                this.caseLoad.CaseLoadGoals.push(newCaseLoadGoal);
                this.filterGoalOptions();
            } else {
                this.saveCaseLoadGoal(newCaseLoadGoal);
                this.getCaseLoadGoals();
            }
        });

        this.clearSelectedOptions();
    }

    private saveCaseLoadGoal(caseLoadGoal: ICaseLoadGoal): void {
        this.caseLoadGoalsService
            .createWithFks(caseLoadGoal)            .subscribe(() => {
                this.success();
            });
    }

    private success(): void {
        this.getCaseLoadGoals();
        this.notificationService.success('Goals saved successfully.');
    }

    clearSelectedOptions(): void {
        this.allGoalOptions.forEach((item) => {
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

    archiveCaseLoadGoal(caseLoadGoal: ICaseLoadGoal): void {
        if (this.isAdding) {
            this.caseLoadGoals = this.caseLoadGoals.filter((clg) => clg !== caseLoadGoal);
            this.caseLoad.CaseLoadGoals = this.caseLoad.CaseLoadGoals.filter((clg) => clg !== caseLoadGoal);
            this.filterGoalOptions();
        } else {
            if (!caseLoadGoal.Archived && this.caseLoadGoals.filter((x) => !x.Archived).length === 1) {
                this.notificationService.error('Cannot remove the last Goal, at least one is required.');
                return;
            }
            if (caseLoadGoal.Id === 0) {
                this.caseLoad.CaseLoadGoals = this.caseLoad.CaseLoadGoals.filter((clg) => clg !== caseLoadGoal);
            } else {
                caseLoadGoal.Archived = !caseLoadGoal.Archived;
                this.caseLoadGoalsService.update(caseLoadGoal).subscribe(() => {
                    this.notificationService.success('Goal Updated Successfully');
                    this.getCaseLoadGoals();
                });
            }
        }
    }

    private refreshGoals(): void {
        this.getCaseLoadGoals();
    }

    getSelectedGoals(): IGoal[] {
        return this.goalSearch.filter((item) => this.goalOptions.some((filterItem) => filterItem.Item.Id === item.Id && filterItem.Selected));
    }


    filterGoalOptions(): void {
        this.goalOptions = this.allGoalOptions.filter((item) => !this.caseLoadGoals.some((goal) => goal.GoalId === item.Item.Id));
    }
}
