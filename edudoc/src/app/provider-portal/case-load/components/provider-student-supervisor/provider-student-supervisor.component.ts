import { Component, Input, OnInit } from '@angular/core';

import { ISelectOptions } from '@model/interfaces/custom/select-options';
import { IProviderStudentSupervisor } from '@model/interfaces/provider-student-supervisor';
import { IStudent } from '@model/interfaces/student';
import {
    DynamicField,
    DynamicFieldType,
    DynamicFieldTypes,
    DynamicLabel,
    InputTypes,
    LabelPosition,
    LabelPositions,
    SelectInputTypes,
} from '@mt-ng2/dynamic-form';
import { IModalOptions } from '@mt-ng2/modal-module';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { ProviderStudentService } from '@provider/case-load/services/provider-student.service';
import { ProviderPortalAuthService } from '@provider/provider-portal-auth.service';

@Component({
    selector: 'app-provider-student-supervisor',
    templateUrl: './provider-student-supervisor.component.html',
})
export class ProviderStudentSupervisorComponent implements OnInit {
    @Input() student: IStudent;
    @Input() canEdit: boolean;
    @Input() schoolId = 0;

    currentSupervisors: IProviderStudentSupervisor[];
    pastSupervisors: IProviderStudentSupervisor[];
    supervisorOptions: ISelectOptions[] = [];
    selectedSupervisor: ISelectOptions;
    selectedStartDate: Date;
    selectedEndDate: Date;
    tomorrow: number;

    isAssistant: boolean;
    isAdding: boolean;
    isHovered: boolean;
    viewOnly: DynamicLabel[] = [];
    formObject: DynamicField[] = [];
    isCardOpen = false;
    isEditing = false;
    providerStudentSupervisor: IProviderStudentSupervisor;

    doubleClickIsDisabled = false;
    archiveConfirm: IModalOptions = {
        cancelButtonText: 'Delete',
        confirmButtonText: 'Yes, I am sure!',
        denyButtonText: '',
        icon: 'warning',
        showCancelButton: true,
        showConfirmButton: true,
        showDenyButton: false,
        text: `Are you sure you want to unassign this supervisor?`,
        title: 'Unassign Supervisor',
    };

    constructor(
        private providerStudentService: ProviderStudentService,
        private providerAuthService: ProviderPortalAuthService,
        private notificationsService: NotificationsService,
    ) {}

    ngOnInit(): void {
        this.isAdding = false;
        this.tomorrow = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).valueOf();
        this.setData();
        this.providerStudentService.getSupervisorOptions(this.providerAuthService.getProviderId()).subscribe((answer) => {
            this.supervisorOptions = answer;
        });
    }

    noCurrentSupervisors(): boolean {
        return !this.currentSupervisors || this.currentSupervisors.length === 0;
    }

    noPastSupervisors(): boolean {
        return !this.pastSupervisors || this.pastSupervisors.length === 0;
    }

    setData(): void {
        this.currentSupervisors = this.student.ProviderStudentSupervisors.filter(
            (supervisors) => supervisors.EffectiveEndDate === null || new Date(supervisors.EffectiveEndDate).valueOf() >= this.tomorrow,
        );
        this.pastSupervisors = this.student.ProviderStudentSupervisors.filter(
            (supervisors) => supervisors.EffectiveEndDate !== null && new Date(supervisors.EffectiveEndDate).valueOf() < this.tomorrow,
        );
    }

    getSupervisorsField(): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: 'Select Supervisor',
            name: 'supervisorId',
            options: this.supervisorOptions,
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

    supervisorSelected(selectedSupervisor: number): void {
        if (selectedSupervisor) {
            this.selectedSupervisor = this.supervisorOptions.find((n) => n.Id === selectedSupervisor);
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

    getSupervisorName(providerStudentSupervisor: IProviderStudentSupervisor): string {
        const providerUser = providerStudentSupervisor.Supervisor?.ProviderUser;
        const fallbackName = this.supervisorOptions.find((o) => o.Id === providerStudentSupervisor.SupervisorId)?.Name;
        const name = providerUser ? `${providerUser.FirstName} ${providerUser.LastName}` : fallbackName ?? 'ERROR';
        return name;
    }

    cancelClick(): void {
        this.isAdding = false;
    }

    toggleCardOpen(): void {
        this.isCardOpen = !this.isCardOpen;
    }

    success(): void {
        this.notificationsService.success('Supervisor saved successfully!');
        this.isAdding = false;
    }

    addSupervisor(): void {
        this.isAdding = true;
    }

    saveSupervisor(): void {
        if (this.selectedSupervisor) {
            const newAssignment = this.providerStudentService.getEmptyProviderStudentSupervisor();
            newAssignment.AssistantId = this.providerAuthService.getProviderId();
            newAssignment.StudentId = this.student.Id;
            newAssignment.SupervisorId = this.selectedSupervisor.Id;
            newAssignment.EffectiveStartDate = this.selectedStartDate;
            newAssignment.EffectiveEndDate = this.selectedEndDate;
            this.providerStudentService.assignStudentSupervisor(newAssignment).subscribe((answer) => {
                this.student.ProviderStudentSupervisors.push(answer);
                this.setData();
                this.providerStudentService.emitStudentSupervisorChange(this.student);
                this.success();
            });
        } else {
            this.notificationsService.error('No supervisor selected. Please select a supervisor and try again.');
        }
    }

    editSupervisorAssignment(supervisor: IProviderStudentSupervisor) {
        this.isEditing = true;
        this.providerStudentSupervisor = supervisor;
    }

    removeSupervisorAssignment(supervisor: IProviderStudentSupervisor): void {
        this.providerStudentService.unassignProviderStudentSupervisor(supervisor.Id).subscribe((answer: IProviderStudentSupervisor) => {
            this.currentSupervisors.splice(this.currentSupervisors.indexOf(supervisor), 1);
            this.pastSupervisors.push(answer);
            this.notificationsService.success('Supervisor unassigned successfully!');
        });
    }

    currentSupervisorChange($event: IProviderStudentSupervisor): void {
        Object.assign(
            this.currentSupervisors.find((a) => a.Id === $event.Id),
            $event,
        );
        if ($event.EffectiveEndDate !== null && new Date($event.EffectiveEndDate).valueOf() < this.tomorrow) {
            this.pastSupervisors.push($event);
            this.currentSupervisors = this.currentSupervisors.filter(
                (s) => (s.EffectiveEndDate === null || new Date(s.EffectiveEndDate).valueOf() >= this.tomorrow) && s.SupervisorId > 0,
            );
        }
    }
}
