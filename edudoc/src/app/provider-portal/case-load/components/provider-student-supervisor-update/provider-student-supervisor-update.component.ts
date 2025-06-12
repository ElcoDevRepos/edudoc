import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { forkJoin } from 'rxjs';

import { markAllFormFieldsAsTouched } from '@mt-ng2/common-functions';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { IProviderStudentSupervisor } from '@model/interfaces/provider-student-supervisor';
import { ISelectOptions } from '@model/interfaces/custom/select-options';
import { ProviderPortalAuthService } from '@provider/provider-portal-auth.service';
import { ProviderStudentService } from '@provider/case-load/services/provider-student.service';
import { ProviderStudentSupervisorDynamicControlsPartial } from '@model/partials/provider-student-supervisor-partial.form-controls';
import { ProviderStudentSupervisorDynamicConfig } from '../provider-student-assistant-update/provider-student-assistant.dynamic-config';


@Component({
    selector: 'app-provider-student-supervisor-update',
    templateUrl: './provider-student-supervisor-update.component.html',
})
export class ProviderStudentSupervisorUpdateComponent implements OnInit {
    @Input() providerStudentSupervisor: IProviderStudentSupervisor;
    @Output() providerStudentSupervisorChange = new EventEmitter<IProviderStudentSupervisor>();
    @Input() isEditing: boolean;
    @Output() isEditingChange = new EventEmitter<boolean>();

    // abstract controls
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    abstractProviderStudentSupervisorControls: any;

    providerStudentSupervisorUpdateForm: FormGroup;
    doubleClickIsDisabled = false;
    formCreated = false;

    supervisors: ISelectOptions[];

    constructor(
        private fb: FormBuilder,
        private cdr: ChangeDetectorRef,
        private notificationsService: NotificationsService,
        private providerAuthService: ProviderPortalAuthService,
        private providerStudentService: ProviderStudentService,
    ) {}

    ngOnInit(): void {
        forkJoin(
            this.providerStudentService.getSupervisorOptions(this.providerAuthService.getProviderId())
        ).subscribe((answer) => {
            const [supervisors] = answer;
            this.supervisors = supervisors.filter(s => s.Id !== 0);

            const currentSupervisor = this.supervisors.find(s => s.Id === this.providerStudentSupervisor.SupervisorId);
            if(!currentSupervisor) {
                this.providerStudentSupervisor.SupervisorId = null;
                this.providerStudentSupervisor.Supervisor = null;
            }

            this.createForm();
        });
    }

    createForm(): void {
        this.getControls();
        this.providerStudentSupervisorUpdateForm = this.assignFormGroups();
        this.formCreated = true;
        this.cdr.detectChanges();
    }

    getControls(): void {
        this.abstractProviderStudentSupervisorControls = new ProviderStudentSupervisorDynamicControlsPartial(
            this.providerStudentSupervisor,
            { formGroup: 'ProviderStudentSupervisor' },
            [],
            this.supervisors
        ).Form;
    }

    assignFormGroups(): FormGroup {
        return this.fb.group({
            ProviderStudentSupervisor: this.fb.group({}),
        });
    }

    formSubmitted(form: FormGroup): void {
        if (form.valid) {
            this.providerStudentSupervisor.SupervisorId = form.value.ProviderStudentSupervisor.SupervisorId;
            this.providerStudentSupervisor.EffectiveStartDate = form.value.ProviderStudentSupervisor.EffectiveStartDate;
            this.providerStudentSupervisor.EffectiveEndDate = form.value.ProviderStudentSupervisor.EffectiveEndDate;
            this.saveProviderStudentSupervisor();
        } else {
            markAllFormFieldsAsTouched(form);
            this.notificationsService.error('Save failed. Please check the form and try again.');
        }
    }

    cancelClick(): void {
        this.isEditing = false;
        this.isEditingChange.emit(this.isEditing);
    }

    error(): void {
        this.notificationsService.error('Save failed. Please check the form and try again.');
    }

    success(): void {
        this.isEditing = false;
        this.isEditingChange.emit(this.isEditing);
        this.providerStudentSupervisorChange.emit(this.providerStudentSupervisor);
        this.notificationsService.success('Supervisor assignment saved successfully.');
    }

    private saveProviderStudentSupervisor(): void {
        this.providerStudentSupervisor.Supervisor = null;
        this.providerStudentService
            .updateProviderStudentSupervisor(this.providerStudentSupervisor)
            .subscribe(() => {
                this.success();
            });
    }

}
