import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { archiveConfirm, unarchiveConfirm } from '@common/mtConfirmOptions/mtConfirmOptions';
import { DateTimeConverterService } from '@common/services/date-time-converter.service';
import { ICptCode } from '@model/interfaces/cpt-code';
import { IEncounter } from '@model/interfaces/encounter';
import { IEncounterStudent } from '@model/interfaces/encounter-student';
import { IEncounterStudentCptCode } from '@model/interfaces/encounter-student-cpt-code';
import { AuthService } from '@mt-ng2/auth-module';
import { ExtraSearchParams, IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import { DynamicField, DynamicFieldType, DynamicFieldTypes, IDynamicFieldType } from '@mt-ng2/dynamic-form';
import { SortDirection } from '@mt-ng2/entity-list-module';
import { INamedEntity } from '@mt-ng2/multiselect-control';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { MtSearchFilterItem } from '@mt-ng2/search-filter-select-control';
import { EncounterStudentCptCodesService } from '@provider/encounters/services/encounter-student-cpt-codes.service';
import { EncounterService } from '@provider/encounters/services/encounter.service';
import { ProviderPortalAuthService } from '@provider/provider-portal-auth.service';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

type IsGroupCptCodes = {
    Item: {
        Id: number;
        Name: string;
    };
    IsGroup: boolean;
    Selected?: boolean;
    Archived?: boolean;
};

function transformToMtSearchFilterItem(item: IsGroupCptCodes): MtSearchFilterItem<INamedEntity> {
    return new MtSearchFilterItem(item.Item, item.Selected || false);
}

@Component({
    selector: 'app-encounter-student-cpt-codes',
    templateUrl: './encounter-student-cpt-codes.component.html',
    styleUrls: ['./encounter-student-cpt-codes.component.less'],
})
export class EncounterStudentCptCodesComponent implements OnInit {
    @Input() isEditingStudent: boolean;
    @Input() encounterStudent: IEncounterStudent;
    @Input() studentForm: AbstractControl;
    @Input() encounter: IEncounter;
    @Input() canEdit: boolean;
    @Input() isNursingProvider: boolean;
    @Input() encounterStudentCptCodes: IEncounterStudentCptCode[];
    @Output() encounterStudentCptCodesChange = new EventEmitter<IEncounterStudentCptCode[]>();
    @Output() cptCodesUpdated = new EventEmitter<IEncounterStudentCptCode[]>();

    cptCodes: ICptCode[];
    cptCodeOptions: IsGroupCptCodes[] = [];
    cptCodeFilterItems: MtSearchFilterItem[];

    query = '';
    total: number;
    doubleClickIsDisabled = false;
    includeArchived = false;
    isEditing = false;
    isHovered: boolean;

    searchIsGroup: IsGroupCptCodes[] = [];

    archiveConfirm = archiveConfirm;
    unarchiveConfirm = unarchiveConfirm;

    subscriptions: Subscription;

    isCardOpen = true;

    get isRn(): boolean {
        const providerTitle = this.providerPortalAuthService.getProviderTitle().toLowerCase();
        return providerTitle.includes('rn') || providerTitle.includes('registered nurse');
    }

    get isLpn(): boolean {
        return this.providerPortalAuthService.providerIsLPN();
    }

    get hasSingleCode(): boolean {
        return this.encounterStudentCptCodes.length === 1;
    }

    get noEncounterStudentCptCodes(): boolean {
        return !this.encounterStudentCptCodes || this.encounterStudentCptCodes.length === 0;
    }

    constructor(
        private encounterStudentCptCodesService: EncounterStudentCptCodesService,
        private encounterService: EncounterService,
        private notificationService: NotificationsService,
        private authService: AuthService,
        private providerPortalAuthService: ProviderPortalAuthService,
        private dateTimeConverter: DateTimeConverterService,
    ) {
        this.subscriptions = new Subscription();
    }

    ngOnInit(): void {
        this.encounterStudentCptCodesService
            .getCptCodeOptions(this.encounter.ServiceTypeId, this.providerPortalAuthService.getProviderServiceCode())
            .subscribe((answer) => {
                this.cptCodes = answer;
                this.searchIsGroup = this.cptCodes
                    .filter((sds) => !sds.Archived)
                    .map((sd) => ({
                        Item: {
                            Id: sd.Id,
                            Name: `${sd.Code} - ${sd.Description.substr(0, 50)}`,
                        },
                        IsGroup: sd.CptCodeAssocations.some(
                            (association) => association.IsGroup && association.ServiceTypeId === this.encounter.ServiceTypeId,
                        ),
                    }));
                this.subscriptions.add(
                    this.encounterStudentCptCodesService.cptCodeUpdated$.subscribe(() => {
                        this.filterCptCodeOptionsByGroupStatus();
                        this.getEncounterStudentCptCodes();
                    }),
                );
                this.filterCptCodeOptionsByGroupStatus();
                this.getEncounterStudentCptCodes();
            });
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    toggleCardOpen(): void {
        this.isCardOpen = !this.isCardOpen;
    }

    filterCptCodeOptionsByGroupStatus(): void {
        this.cptCodeOptions = this.searchIsGroup.filter((options) => options.IsGroup === this.encounter.IsGroup);
    }

    getEncounterStudentCptCodes(): void {
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
        this.encounterStudentCptCodesService.get(searchparams).subscribe((answer) => {
            this.encounterStudentCptCodes = answer.body;
            this.encounterStudent.EncounterStudentCptCodes = answer.body;
            this.encounterStudentCptCodesChange.emit(this.encounterStudent.EncounterStudentCptCodes);
            this.total = +answer.headers.get('X-List-Count');
            this.filterSelectedCptCodes();
        });
    }

    private buildSearch(): ExtraSearchParams[] {
        const _extraSearchParams: ExtraSearchParams[] = [];

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'EncounterStudentId',
                value: this.encounterStudent.Id.toString(),
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

    cancelClick(): void {
        this.isEditing = false;
    }

    addCptCodes(): void {
        if (this.canEdit) {
            const newCodes: IEncounterStudentCptCode[] = [];
            const codesToAdd = this.getSelectedCptCodes();
            codesToAdd.forEach((cptcode) => {
                const newEncounterStudentCptCode = this.encounterStudentCptCodesService.getEmptyEncounterStudentCptCode();
                newEncounterStudentCptCode.CptCodeId = cptcode.Id;
                newEncounterStudentCptCode.CreatedById = this.authService.currentUser.getValue().Id;
                newEncounterStudentCptCode.CptCode = { ...this.cptCodes.find((c) => c.Id === cptcode.Id) };
                if (this.noEncounterStudentCptCodes && codesToAdd.length === 1) {
                    const student = this.studentForm && this.studentForm.value.EncounterStudent.EncounterStartTime  ? this.studentForm.value.EncounterStudent as IEncounterStudent : this.encounterStudent;
                    newEncounterStudentCptCode.Minutes = this.dateTimeConverter.getTimeDurationInMins(student.EncounterStartTime, student.EncounterEndTime);
                }
                newCodes.push(newEncounterStudentCptCode);
            });

            newCodes.map((cptcode) => {
                cptcode.EncounterStudentId = this.encounterStudent.Id;
            });
            this.saveEncounterStudentCptCodes(newCodes);
        }

        this.cptCodeOptions.forEach((item) => {
            item.Selected = false;
        });
    }

    filterSelectedCptCodes(): void {
        if (this.isEditingStudent) {
            const selectedCptCodeIds = this.encounterStudentCptCodes.map((item) => item.CptCodeId);
            if (selectedCptCodeIds && selectedCptCodeIds.length > 0) {
                this.cptCodeOptions = this.searchIsGroup.filter(
                    (options) => options.IsGroup === this.encounter.IsGroup && !selectedCptCodeIds.some((id) => id === options.Item.Id),
                );
            } else {
                this.filterCptCodeOptionsByGroupStatus();
            }

            this.cptCodeOptions.forEach((item) => {
                item.Selected = false;
            });

            // autofill time for existing cpt codes
            if (this.encounterStudentCptCodes?.length === 1 && !this.encounterStudentCptCodes[0].Minutes) {
                    const student = this.studentForm && this.studentForm.value.EncounterStudent.EncounterStartTime ? this.studentForm.value.EncounterStudent as IEncounterStudent : this.encounterStudent;
                    if (student.EncounterStartTime.length && student.EncounterEndTime.length) {
                        this.encounterStudentCptCodes[0].Minutes =
                            this.dateTimeConverter.getTimeDurationInMins(student.EncounterStartTime, student.EncounterEndTime);
                        this.encounterStudentCptCodesService.update(this.encounterStudentCptCodes[0]).subscribe();
                    }
            } else if (this.encounterStudentCptCodes.length > 1 && this.encounterStudentCptCodes.some((cpt) => !cpt.Minutes)) {
                // autofill 0 minutes
                const allActions: Observable<unknown>[] = [];
                this.encounterStudentCptCodes.forEach((cpt) => {
                    if (cpt.Minutes === null) {
                        cpt.Minutes = 0;
                        allActions.push(this.encounterStudentCptCodesService.update(cpt));
                    }
                });
                forkJoin(allActions)
                    .pipe(finalize(() => (this.doubleClickIsDisabled = false)))
                    .subscribe();
            }
        }
    }

    saveEncounterStudentCptCodes(encounterStudentCptCodes: IEncounterStudentCptCode[]): void {
        const allCodes: Observable<number>[] = [];
        encounterStudentCptCodes.forEach((encounterStudentCptCode: IEncounterStudentCptCode) => {
            allCodes.push(this.encounterStudentCptCodesService.create(encounterStudentCptCode));
        });
        forkJoin(...allCodes)
            .pipe()
            .subscribe(() => {
                this.getEncounterStudentCptCodes();
                this.success();
            });
    }

    private success(): void {
        this.notificationService.success('Procedure Codes saved successfully.');
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

    archiveEncounterStudentCptCode(encounterStudentCptCode: IEncounterStudentCptCode): void {
        if (encounterStudentCptCode.Id === 0) {
            this.encounterStudentCptCodes = this.encounterStudentCptCodes.filter((clg) => clg !== encounterStudentCptCode);
            this.filterSelectedCptCodes();
        } else {
            encounterStudentCptCode.Archived = !encounterStudentCptCode.Archived;
            this.encounterStudentCptCodesService.update(encounterStudentCptCode).subscribe(() => {
                this.notificationService.success('Procedure Code Updated Successfully');
                this.getEncounterStudentCptCodes();
            });
        }
    }

    getSelectedCptCodes(): ICptCode[] {
        this.cptCodeFilterItems = this.cptCodeOptions.map(transformToMtSearchFilterItem);
        return this.cptCodes.filter((item) => this.cptCodeFilterItems.some((filterItem) => filterItem.Item.Id === item.Id && filterItem.Selected));
    }
}
