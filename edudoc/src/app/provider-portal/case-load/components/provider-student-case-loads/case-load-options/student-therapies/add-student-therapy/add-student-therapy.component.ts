import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { DateTimeConverterService } from '@common/services/date-time-converter.service';
import { ITherapyScheduleHandlerResponse } from '@common/validators/validation-handlers/therapy-schedule-handlers/therapy-schedule-handler';
import { runTherapyScheduleValidationChain } from '@common/validators/validation-handlers/therapy-schedule-handlers/therapy-schedule-handler.library';
import { ValidationModalService } from '@common/validators/validation-modal/validation-modal.service';
import { IExpandableObject } from '@model/expandable-object';
import { IStudentTherapyDynamicControlsParameters } from '@model/form-controls/student-therapy.form-controls';
import { IEncounterLocation } from '@model/interfaces/encounter-location';
import { IStudentTherapy } from '@model/interfaces/student-therapy';
import { ITherapyGroup } from '@model/interfaces/therapy-group';
import { StudentTherapyDynamicControlsPartial } from '@model/partials/student-therapy-partial.form-controls';
import { AuthService } from '@mt-ng2/auth-module';
import { MetaItem } from '@mt-ng2/base-service';
import { markAllFormFieldsAsTouched } from '@mt-ng2/common-functions';
import { DynamicField, DynamicFieldType, DynamicFieldTypes, IDynamicFieldType, InputTypes, LabelPosition, LabelPositions, SelectInputTypes } from '@mt-ng2/dynamic-form';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { ITypeAheadAPI, VirtualTypeAheadGetItemsFunction } from '@mt-ng2/type-ahead-control';
import { StudentTherapyService } from '@provider/case-load/services/student-therapy.service';
import { ProviderPortalAuthService } from '@provider/provider-portal-auth.service';
import { Observable, Subscription, forkJoin } from 'rxjs';
import { debounceTime, finalize, map } from 'rxjs/operators';
import { StudentTherapyDynamicConfig } from '../student-therapy.dynamic-config';

export interface IStudentTherapyFormData {
    form: UntypedFormGroup;
    controls: IExpandableObject;
    studentTherapy: IStudentTherapy;
}

@Component({
    styles: [
        `dynamic-field.field-margin > ng-component > dynamic-form-input-wrapper > div > span {
            margin-top: -1.5em,
        }`
    ],
    selector: 'app-add-student-therapy',
    templateUrl: 'add-student-therapy.component.html',
})
export class AddStudentTherapyComponent implements OnInit {
    @Output() onClose: EventEmitter<void> = new EventEmitter<void>();
    @Output() onStudentTherapyAdded: EventEmitter<void> = new EventEmitter<void>();
    @Input() studentTherapyForArchival: IStudentTherapy;
    @Input() caseLoadId: number;
    @Input() encounterLocations: IEncounterLocation[];
    @Input() studentTherapies: IStudentTherapy[];

    formFactory: StudentTherapyDynamicConfig<IStudentTherapy>;
    studentTherapy: IStudentTherapy;
    doubleClickIsDisabled = false;

    providerId: number;

    existingGroup = true;
    showTime = true;
    groupName: string;
    sessionName: string;
    selectedGroup: ITherapyGroup;
    virtualTypeAheadControl: ITypeAheadAPI;
    getGroups: VirtualTypeAheadGetItemsFunction = this.getGroupsFunction.bind(this);
    groups: ITherapyGroup[] = [];

    // controls
    formData: IStudentTherapyFormData;

    subscriptions: Subscription;
    selectedEncounterLocationId: number;

    constructor(
        private studentTherapyService: StudentTherapyService,
        private providerPortalAuthService: ProviderPortalAuthService,
        private validationModalService: ValidationModalService,
        private authService: AuthService,
        private notificationsService: NotificationsService,
        private fb: UntypedFormBuilder,
        private dateTimeConverter: DateTimeConverterService,
    ) {
        this.subscriptions = new Subscription();
    }

    ngOnInit(): void {
        this.providerId = this.providerPortalAuthService.getProviderId();
        this.studentTherapyService.getGroupOptions(this.providerId, { query: '' }).subscribe((res) => {
            this.groups = res.body;
            this.setConfig();
        });
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    setConfig(): void {
        if (this.studentTherapyForArchival !== undefined) {
            this.studentTherapy = {...this.studentTherapyForArchival};
            this.existingGroup = this.studentTherapy.TherapyGroupId > 0;
            this.selectedGroup = this.studentTherapy.TherapyGroup !== null ? this.studentTherapy.TherapyGroup : null;
            this.buildFormData(this.studentTherapy);
        } else {
            this.studentTherapy = this.studentTherapyService.getEmptyStudentTherapy();
            this.studentTherapy.CaseLoadId = this.caseLoadId;
            this.buildFormData(this.studentTherapy);
        }
    }

    buildFormData(studentTherapy: IStudentTherapy): void {
        const extraParams: IStudentTherapyDynamicControlsParameters = {
            encounterLocations: this.encounterLocations,
        };
        const controls = new StudentTherapyDynamicControlsPartial(this.studentTherapy, extraParams);
        const form = this.fb.group({StudentTherapy: this.fb.group({})});
        this.formData = { form: form, controls: controls.Form, studentTherapy };
    }

    getExistingGroupField(): DynamicField {
        return new DynamicField({
            disabled: this.studentTherapyForArchival !== undefined,
            formGroup: null,
            label: 'Add to Existing Session or Create New Session?',
            name: 'existingGroup',
            options: [new MetaItem(1, 'Existing'), new MetaItem(0, 'New')],
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Select,
                inputType: SelectInputTypes.RadioButtonList,
            }),
            labelPosition: new LabelPosition({
                position: LabelPositions.Left,
                colsForLabel: 4,
            }),
            value: this.existingGroup ? 1 : 0,
        });
    }

    getGroupField(): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: 'Select Group',
            name: 'group',
            options: this.groups,
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Select,
                inputType: SelectInputTypes.Dropdown,
            }),
            labelPosition: new LabelPosition({
                position: LabelPositions.Left,
                colsForLabel: 4,
            }),
            validation: [],
            validators: {},
            value: null,
        });
    }

    getNewGroupNameField(): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: 'Session Name',
            name: 'newGroup',
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Input,
                inputType: InputTypes.Textbox,
            }),
            labelPosition: new LabelPosition({
                position: LabelPositions.Left,
                colsForLabel: 4,
            }),
            // eslint-disable-next-line @typescript-eslint/unbound-method
            validation: [Validators.maxLength(50)],
            validators: { maxlength: 50, minlength: 1 },
            value: this.studentTherapyForArchival?.TherapyGroup ? this.studentTherapyForArchival.TherapyGroup.Name : null,
        });
    }

    handleGroupStatusChange(event: number): void {
        setTimeout(() => {
            this.existingGroup = event === 0 ? false : true;
            this.selectedGroup = event === 0 ? null : this.selectedGroup;
            this.sessionName = event === 0 ? this.sessionName : null;
        });
    }

    handleLocationChange(event: number): void {
        this.selectedEncounterLocationId = event;
    }

    handleExistingStatusChange(event: number): void {
        setTimeout(() => {
            this.existingGroup = event === 0 ? false : true;
            this.selectedGroup = event === 0 ? null : this.selectedGroup;
            this.groupName = event === 1 ? null : this.groupName;
        });
    }

    groupSelected(event: number): void {
        const selectedGroup = this.groups.find(g => g.Id === event);
        if (selectedGroup) {
            this.selectedGroup = selectedGroup;
            this.assignGroupValuesToSchedule(this.selectedGroup);
            this.formData = null;
            setTimeout(() => {
                this.buildFormData(this.studentTherapy);
            });
        }
    }

    assignGroupValuesToSchedule(group: ITherapyGroup): void {
        this.studentTherapy.EncounterLocationId = this.selectedEncounterLocationId;
        this.studentTherapy.TherapyGroupId = group.Id;
        this.studentTherapy.StartDate = group.StartDate;
        this.studentTherapy.EndDate = group.EndDate;
        this.studentTherapy.Monday = group.Monday;
        this.studentTherapy.Tuesday = group.Tuesday;
        this.studentTherapy.Wednesday = group.Wednesday;
        this.studentTherapy.Thursday = group.Thursday;
        this.studentTherapy.Friday = group.Friday;
        this.studentTherapy.ProviderId = this.providerId;
    }

    virtualTypeAheadControlReady(controlApi: ITypeAheadAPI): void {
        this.virtualTypeAheadControl = controlApi;
    }

    private getGroupsFunction(searchText: string): Observable<ITherapyGroup[]> {
        return this.studentTherapyService
            .getGroupOptions(this.providerId, {
                query: searchText,
            })
            .pipe(
                debounceTime(300),
                map((resp) => resp.body),
            );
    }

    validateForm(form: UntypedFormGroup): boolean {
        markAllFormFieldsAsTouched(form);
        return !(form.invalid);
    }

    formSubmitted(): void {
        const form = this.formData.form;
        const formIsValid = this.validateForm(form);
        if (formIsValid) {
            const validationSchedule = JSON.parse(JSON.stringify(this.studentTherapy)) as IStudentTherapy;
            this.assignFormValues(form , validationSchedule);
            const handlerResponse: ITherapyScheduleHandlerResponse = runTherapyScheduleValidationChain(validationSchedule, this.studentTherapies, this.studentTherapyForArchival?.Id);

            this.subscriptions.add(
                this.validationModalService.saved.subscribe(() => {
                    this.proceedWithForm(form);
                }),
            );

            this.subscriptions.add(
                this.validationModalService.cancelled.subscribe(() => {
                    setTimeout(() => (this.doubleClickIsDisabled = false));
                    this.subscriptions.unsubscribe();
                    this.subscriptions.closed = false;
                }),
            );

            this.validationModalService.showModal(handlerResponse.isHardValidation, handlerResponse.errorsResponse);
        } else {
            markAllFormFieldsAsTouched(form);
            this.notificationsService.error('Please check form and try again.');
            setTimeout(() => (this.doubleClickIsDisabled = false));
        }
    }

    proceedWithForm(form: UntypedFormGroup): void {
        this.subscriptions.unsubscribe();
        this.subscriptions.closed = false;
        this.assignFormValues(form, this.studentTherapy);
        const allActions: Observable<object | number>[] = [] ;
        if (this.studentTherapy.EncounterLocation) {
            this.studentTherapy.EncounterLocation = null;
        }
        if (this.studentTherapy.Id > 0) {
            this.studentTherapyForArchival = { ...this.studentTherapy };
            allActions.push(this.studentTherapyService.updateWithFks(this.studentTherapyForArchival));
        } else {
            allActions.push(this.studentTherapyService.createWithFks(this.studentTherapy));
        }
        forkJoin(...allActions)            .subscribe(() => {
                this.success(this.studentTherapyForArchival !== null);
                this.onStudentTherapyAdded.emit();
                this.onClose.emit();
            });
    }

    success(isEditing = true): void {
        this.notificationsService.success(isEditing ? 'Student Therapy updated successfully!' : 'Student Therapy saved successfully!');
    }

    assignFormValues(form: UntypedFormGroup, studentTherapy: IStudentTherapy): void {
        studentTherapy.CaseLoadId = this.caseLoadId;

        const formControl = form.controls.StudentTherapy ;

        studentTherapy.CreatedById = this.authService.currentUser.value.Id;
        studentTherapy.EncounterLocationId = formControl.get('EncounterLocationId').value;
        studentTherapy.StartDate = this.dateTimeConverter.appendTimeSpanToDate(formControl.get('StartDate').value as Date, form.controls.startTime.value as string);
        studentTherapy.EndDate = this.dateTimeConverter.appendTimeSpanToDate(formControl.get('EndDate').value as Date, form.controls.endTime.value as string);
        studentTherapy.Monday = !!formControl.get('Monday').value;
        studentTherapy.Tuesday = !!formControl.get('Tuesday').value;
        studentTherapy.Wednesday = !!formControl.get('Wednesday').value;
        studentTherapy.Thursday = !!formControl.get('Thursday').value;
        studentTherapy.Friday = !!formControl.get('Friday').value;
        studentTherapy.ProviderId = this.providerId;

        if (!this.existingGroup) {
            studentTherapy.TherapyGroup = this.buildNewGroup(studentTherapy);
        }
    }

    buildNewGroup(studentTherapy: IStudentTherapy): ITherapyGroup {
        const newGroup = this.studentTherapyService.getEmptyTherapyGroup();

        newGroup.Name = this.groupName;
        newGroup.CreatedById = this.authService.currentUser.value.Id;
        newGroup.ProviderId = this.providerId;
        newGroup.StartDate = studentTherapy.StartDate;
        newGroup.EndDate = studentTherapy.EndDate;
        newGroup.Monday = studentTherapy.Monday;
        newGroup.Tuesday = studentTherapy.Tuesday;
        newGroup.Wednesday = studentTherapy.Wednesday;
        newGroup.Thursday = studentTherapy.Thursday;
        newGroup.Friday = studentTherapy.Friday;

        return newGroup;
    }

    close(): void {
        this.onClose.emit();
    }
}
