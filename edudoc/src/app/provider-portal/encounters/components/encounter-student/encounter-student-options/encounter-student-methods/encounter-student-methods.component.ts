import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { archiveConfirm, unarchiveConfirm } from '@common/mtConfirmOptions/mtConfirmOptions';
import { IEncounterHandlerResponse } from '@common/validators/validation-handlers/encounter-handlers/encounter-handler';
import { runEncounterMethodsValidationChain } from '@common/validators/validation-handlers/encounter-handlers/encounter-handler.library';
import { ValidationModalService } from '@common/validators/validation-modal/validation-modal.service';
import { IEncounter } from '@model/interfaces/encounter';
import { IEncounterStudent } from '@model/interfaces/encounter-student';
import { IEncounterStudentMethod } from '@model/interfaces/encounter-student-method';
import { IMethod } from '@model/interfaces/method';
import { AuthService } from '@mt-ng2/auth-module';
import { ExtraSearchParams, IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import { DynamicField, DynamicFieldType, DynamicFieldTypes, IDynamicFieldType } from '@mt-ng2/dynamic-form';
import { SortDirection } from '@mt-ng2/entity-list-module';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { MtSearchFilterItem } from '@mt-ng2/search-filter-select-control';
import { EncounterStudentMethodsService } from '@provider/encounters/services/encounter-student-methods.service';
import { Observable, Subscription, forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-encounter-student-methods',
    templateUrl: './encounter-student-methods.component.html',
})
export class EncounterStudentMethodsComponent implements OnInit {
    @Input() encounter: IEncounter;
    @Input() encounterStudent: IEncounterStudent;
    @Input() canEdit: boolean;
    @Input() providerServiceCode: number;
    @Output() methodsUpdated = new EventEmitter<IEncounterStudentMethod[]>();

    encounterStudentMethods: IEncounterStudentMethod[] = [];
    selectedMethod: IMethod;
    methodOptions: MtSearchFilterItem[];
    allMethodOptions: MtSearchFilterItem[];

    query = '';
    total: number;
    doubleClickIsDisabled = false;
    includeArchived = false;
    isEditing = false;
    isHovered: boolean;

    archiveConfirm = archiveConfirm;
    unarchiveConfirm = unarchiveConfirm;

    subscriptions: Subscription;
    methods: IMethod[];

    isCardOpen = true;

    get noEncounterStudentMethods(): boolean {
        return !this.encounterStudentMethods || this.encounterStudentMethods.length === 0;
    }

    constructor(
        private encounterStudentMethodsService: EncounterStudentMethodsService,
        private validationModalService: ValidationModalService,
        private notificationService: NotificationsService,
        private authService: AuthService,
    ) {
        this.subscriptions = new Subscription();
    }

    ngOnInit(): void {
        this.encounterStudentMethodsService.getMethodOptions().subscribe((answer) => {
            this.allMethodOptions = answer.map((item) => {
                this.methods = answer;
                return new MtSearchFilterItem(item, false);
            });
            this.methodOptions = [...this.allMethodOptions];
            this.getEncounterStudentMethods();
        });
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    toggleCardOpen(): void {
        this.isCardOpen = !this.isCardOpen;
    }

    getEncounterStudentMethods(): void {
        if (this.encounterStudent) {
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
            this.encounterStudentMethodsService.get(searchparams).subscribe((answer) => {
                this.encounterStudentMethods = answer.body;
                this.encounterStudent.EncounterStudentMethods = answer.body;
                this.methodsUpdated.emit(this.encounterStudent.EncounterStudentMethods);
                this.total = +answer.headers.get('X-List-Count');
                this.filterSelectedMethods();
            });
        }
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

    addMethods(): void {
        if (this.canEdit) {
            const newMethods: IEncounterStudentMethod[] = [];
            this.getSelectedMethods().forEach((method) => {
                const newEncounterStudentMethod = this.encounterStudentMethodsService.getEmptyEncounterStudentMethod();
                newEncounterStudentMethod.MethodId = method.Id;
                newEncounterStudentMethod.CreatedById = this.authService.currentUser.getValue().Id;
                newEncounterStudentMethod.Method = { ...this.methods.find((m) => m.Id === method.Id) };
                newMethods.push(newEncounterStudentMethod);
            });

            newMethods.map((method) => {
                method.EncounterStudentId = this.encounterStudent.Id;
            });
            this.saveEncounterStudentMethods(newMethods);
        }

        this.methodOptions.forEach((item) => {
            item.Selected = false;
        });
    }

    filterSelectedMethods(): void {
        const selectedMethodIds = this.encounterStudentMethods.map((item) => item.MethodId);
        if (selectedMethodIds && selectedMethodIds.length > 0) {
            this.methodOptions = this.allMethodOptions.filter((item) => !selectedMethodIds.some((id) => id === item.Item.Id));
        } else {
            this.methodOptions = this.allMethodOptions;
        }
        this.methodOptions.forEach((item) => {
            item.Selected = false;
        });
    }

    saveEncounterStudentMethods(encounterStudentMethods: IEncounterStudentMethod[]): void {
        const allMethods: Observable<number>[] = [];
        encounterStudentMethods.forEach((encounterStudentMethod: IEncounterStudentMethod) => {
            allMethods.push(this.encounterStudentMethodsService.create(encounterStudentMethod));
        });
        forkJoin(...allMethods)
            .pipe()
            .subscribe(() => {
                this.getEncounterStudentMethods();
                this.success();
            });
    }

    private success(): void {
        this.notificationService.success('Methods saved successfully.');
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

    archiveEncounterStudentMethod(encounterStudentMethod: IEncounterStudentMethod): void {
        if (encounterStudentMethod.Id === 0) {
            this.encounterStudentMethods = this.encounterStudentMethods.filter((clg) => clg !== encounterStudentMethod);
            if (this.encounterStudent.Id === 0) {
                this.encounterStudent.EncounterStudentMethods = this.encounterStudent.EncounterStudentMethods.filter(
                    (clg) => clg !== encounterStudentMethod,
                );
            }
            this.filterSelectedMethods();
        } else {
            // Using spread operator so as to not alter the original array before performing Crud Operations
            const studentForValidation = [{ ...this.encounterStudent }];
            studentForValidation[0].EncounterStudentMethods = this.encounterStudentMethods.filter((esm) => esm.Id !== encounterStudentMethod.Id);

            const handlerResponse: IEncounterHandlerResponse = runEncounterMethodsValidationChain(
                0,
                studentForValidation,
                this.encounter.ServiceTypeId,
                this.providerServiceCode,
            );

            this.subscriptions.add(
                this.validationModalService.saved.subscribe(() => {
                    this.subscriptions.unsubscribe();
                    this.subscriptions.closed = false;
                    encounterStudentMethod.Archived = !encounterStudentMethod.Archived;
                    this.encounterStudentMethodsService.update(encounterStudentMethod).subscribe(() => {
                        this.notificationService.success('Method Updated Successfully');
                        this.getEncounterStudentMethods();
                    });
                }),
            );

            this.subscriptions.add(
                this.validationModalService.cancelled.subscribe(() => {
                    this.subscriptions.unsubscribe();
                    this.subscriptions.closed = false;
                }),
            );

            setTimeout(() => {
                this.validationModalService.showModal(
                    handlerResponse.isHardValidation,
                    handlerResponse.errorsResponse.map((response) => response.message),
                );
            });
        }
    }

    getSelectedMethods(): IMethod[] {
        return this.methodOptions.filter((item) => item.Selected).map((item) => item.Item);
    }
}
