import { Component, Input, OnInit } from '@angular/core';

import { ISelectOptions } from '@model/interfaces/custom/select-options';
import { IProviderStudentSupervisor } from '@model/interfaces/provider-student-supervisor';
import { IStudent } from '@model/interfaces/student';
import { DynamicField, DynamicFieldType, DynamicFieldTypes, DynamicLabel, InputTypes, LabelPosition, LabelPositions, SelectInputTypes } from '@mt-ng2/dynamic-form';
import { IModalOptions } from '@mt-ng2/modal-module';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { ProviderStudentService } from '@provider/case-load/services/provider-student.service';
import { ProviderPortalAuthService } from '@provider/provider-portal-auth.service';

@Component({
    selector: 'app-provider-student-assistant',
    templateUrl: './provider-student-assistant.component.html',
})
export class ProviderStudentAssistantComponent implements OnInit {
    @Input() student: IStudent;
    @Input() canEdit: boolean;
    @Input() schoolId = 0;

    currentAssistants: IProviderStudentSupervisor[];
    providerStudentSupervisors: IProviderStudentSupervisor[];
    assistantOptions: ISelectOptions[] = [];
    selectedAssistant: ISelectOptions;
    selectedStartDate: Date;
    selectedEndDate: Date;
    tomorrow: number;

    isAssistant: boolean;
    isAdding: boolean;
    isHovered: boolean;
    viewOnly: DynamicLabel[] = [];
    formObject: DynamicField[] = [];
    isCardOpen = false;

    doubleClickIsDisabled = false;

    archiveConfirm: IModalOptions = {
        cancelButtonText: 'Delete',
        confirmButtonText: 'Yes, I am sure!',
        denyButtonText: '',
        icon: 'warning',
        showCancelButton: true,
        showConfirmButton: true,
        showDenyButton: false,
        text: `Are you sure you want to unassign this assistant?`,
        title: 'Unassign Assistant',
    };

    isEditing = false;
    providerStudentSupervisor: IProviderStudentSupervisor;

    constructor(
        private providerStudentService: ProviderStudentService,
        private providerAuthService: ProviderPortalAuthService,
        private notificationsService: NotificationsService,
    ) {}

    ngOnInit(): void {
        this.isAdding = false;
        this.tomorrow = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1).valueOf();
        this.setData();
        this.providerStudentService
            .getAssistantOptions(this.providerAuthService.getProviderId())
            .subscribe((answer) => (this.assistantOptions = answer));
    }

    setData(): void {
        this.providerStudentSupervisors = this.student.ProviderStudentSupervisors.filter((assistants) => assistants.EffectiveEndDate !== null && new Date(assistants.EffectiveEndDate).valueOf() < this.tomorrow);
        this.currentAssistants = this.student.ProviderStudentSupervisors.filter((assistants) => assistants.EffectiveEndDate === null || new Date(assistants.EffectiveEndDate).valueOf() >= this.tomorrow);
    }

    getAssistantsField(): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: 'Select Assistant',
            name: 'assistantId',
            options: this.assistantOptions,
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Select,
                inputType: SelectInputTypes.Dropdown,
            }),
            labelPosition: new LabelPosition({
                position: LabelPositions.Left,
                colsForLabel: 4,
            }),
            value: null,
        });
    }

    getEffectiveStartDateControl(): DynamicField {
        const today = new Date();
        return new DynamicField({
            formGroup: null,
            label: 'Effective Start Date',
            name: 'EffectiveStartDate',
            options: null,
            type: new DynamicFieldType({
                datepickerOptions: {
                    maxDate: {
                        day: today.getDate(),
                        month: today.getMonth() + 1,
                        year: today.getFullYear(),
                    },
                },
                fieldType: DynamicFieldTypes.Input,
                inputType: InputTypes.Datepicker,
                scale: null,
            }),
            labelPosition: new LabelPosition({
                position: LabelPositions.Left,
                colsForLabel: 4,
            }),
            validation: [],
            validators: {},
            value: new Date(),
        });
    }

    getEffectiveEndDateControl(): DynamicField {
        const today = new Date();
        return new DynamicField({
            formGroup: null,
            label: 'Effective End Date',
            name: 'EffectiveEndDate',
            options: null,
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Input,
                inputType: InputTypes.Datepicker,
                scale: null,
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

    assistantSelected(selectedAssistant: number): void {
        if (selectedAssistant) {
            this.selectedAssistant = this.assistantOptions.find((n) => n.Id === selectedAssistant);
        }
    }

    effectiveStartDateSelected(selectedStartDate: Date): void {
        if (selectedStartDate) {
            this.selectedStartDate = selectedStartDate;
        }
    }

    effectiveEndDateSelected(selectedEndDate: Date): void {
        if (selectedEndDate) {
            this.selectedEndDate = selectedEndDate;
        }
    }

    getAssistantName(providerStudentSupervisor: IProviderStudentSupervisor): string {
        const assistant = providerStudentSupervisor.Assistant?.ProviderUser;
        const fallbackName = this.assistantOptions.find((o) => o.Id === providerStudentSupervisor.AssistantId)?.Name;
        const name = assistant ? `${assistant.FirstName} ${assistant.LastName}` : fallbackName ?? 'ERROR';
        return `${name}`;
    }

    cancelClick(): void {
        this.isAdding = false;
    }

    toggleCardOpen(): void {
        this.isCardOpen = !this.isCardOpen;
    }

    success(): void {
        this.notificationsService.success('Assistant saved successfully!');
        this.isAdding = false;
    }

    addAssistant(): void {
        this.isAdding = true;
    }

    saveAssistant(): void {
        if (this.selectedAssistant) {
            const newAssignment = this.providerStudentService.getEmptyProviderStudentSupervisor();
            newAssignment.SupervisorId = this.providerAuthService.getProviderId();
            newAssignment.StudentId = this.student.Id;
            newAssignment.AssistantId = this.selectedAssistant.Id;
            newAssignment.EffectiveStartDate = this.selectedStartDate;
            newAssignment.EffectiveEndDate = this.selectedEndDate;
            this.providerStudentService.assignStudentAssistant(newAssignment).subscribe((answer) => {
                this.student.ProviderStudentSupervisors.push(answer);
                this.setData();
                this.success();
            });
        } else {
            this.notificationsService.error('No assistant selected. Please select an assistant and try again.');
        }
    }

    removeAssistantAssignment(assistant: IProviderStudentSupervisor): void {
        this.providerStudentService.unassignProviderStudentSupervisor(assistant.Id).subscribe((answer) => {
            this.currentAssistants.splice(this.currentAssistants.indexOf(assistant), 1);
            this.providerStudentSupervisors.push(answer);
            this.notificationsService.success('Assistant unassigned successfully!');
        });
    }

    noProviderStudentSupervisors(): boolean {
        return !this.providerStudentSupervisors || this.providerStudentSupervisors.length === 0;
    }

    noCurrentAssistants(): boolean {
        return !this.currentAssistants || this.currentAssistants.length === 0;
    }

    editAssistantAssignment(providerStudentSupervisor: IProviderStudentSupervisor) {
        this.isEditing = true;
        this.providerStudentSupervisor = providerStudentSupervisor;
    }

    currentAssistantChange($event: IProviderStudentSupervisor): void {
        Object.assign(this.currentAssistants.find(a => a.Id === $event.Id), $event);
        if ($event.EffectiveEndDate !== null && new Date($event.EffectiveEndDate).valueOf() < this.tomorrow) {
            this.providerStudentSupervisors.push($event);
            this.currentAssistants = this.currentAssistants.filter((a) => (a.EffectiveEndDate === null || new Date(a.EffectiveEndDate).valueOf() >= this.tomorrow) && a.SupervisorId > 0);
        }
    }
}
