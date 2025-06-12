import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { finalize, forkJoin } from 'rxjs';

import { markAllFormFieldsAsTouched } from '@mt-ng2/common-functions';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { ProviderStudentService } from '@provider/case-load/services/provider-student.service';
import { ProviderPortalAuthService } from '@provider/provider-portal-auth.service';
import { ISelectOptions } from '@model/interfaces/custom/select-options';
import { IProviderStudentSupervisor } from '@model/interfaces/provider-student-supervisor';
import { ProviderStudentSupervisorDynamicControlsPartial } from '@model/partials/provider-student-supervisor-partial.form-controls';


@Component({
    selector: 'app-provider-student-assistant-update',
    templateUrl: './provider-student-assistant-update.component.html',
})
export class ProviderStudentAssistantUpdateComponent implements OnInit {
    @Input() providerStudentSupervisor: IProviderStudentSupervisor;
    @Output() providerStudentSupervisorChange = new EventEmitter<IProviderStudentSupervisor>();
    @Input() isEditing: boolean;
    @Output() isEditingChange = new EventEmitter<boolean>();

    // abstract controls
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    abstractProviderStudentSupervisorControls: any;

    providerStudentSupervisorForm: FormGroup;
    doubleClickIsDisabled = false;
    formCreated = false;

    assistants: ISelectOptions[];

    constructor(
        private fb: FormBuilder,
        private cdr: ChangeDetectorRef,
        private providerStudentService: ProviderStudentService,
        private providerAuthService: ProviderPortalAuthService,
        private notificationsService: NotificationsService,
    ) {}

    ngOnInit(): void {
        forkJoin(
            this.providerStudentService.getAssistantOptions(this.providerAuthService.getProviderId())
        ).subscribe((answer) => {
            const [assistants] = answer;
            this.assistants = assistants.filter(a => a.Id !== 0);
            const currentAssistant = this.assistants.find(a => a.Id === this.providerStudentSupervisor.AssistantId);
            if(!currentAssistant) {
                this.providerStudentSupervisor.AssistantId = null;
                this.providerStudentSupervisor.Assistant = null;
            }
            this.createForm();
        });
    }

    createForm(): void {
        this.getControls();
        this.providerStudentSupervisorForm = this.assignFormGroups();
        this.formCreated = true;
        this.cdr.detectChanges();
    }

    getControls(): void {
        this.abstractProviderStudentSupervisorControls = new ProviderStudentSupervisorDynamicControlsPartial(
            this.providerStudentSupervisor,
            { formGroup: 'ProviderStudentSupervisor' },
            this.assistants,
        ).Form;
    }

    assignFormGroups(): FormGroup {
        return this.fb.group({
            ProviderStudentSupervisor: this.fb.group({}),
        });
    }

    formSubmitted(form: FormGroup): void {
        if (form.valid) {
            this.providerStudentSupervisor.AssistantId = form.value.ProviderStudentSupervisor.AssistantId;
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
        this.notificationsService.error('Save failed.  Please check the form and try again.');
    }

    success(): void {
        this.isEditing = false;
        this.isEditingChange.emit(this.isEditing);
        this.providerStudentSupervisorChange.emit(this.providerStudentSupervisor);
        this.notificationsService.success('Assistant assignment saved successfully.');
    }

    private saveProviderStudentSupervisor(): void {
        this.providerStudentSupervisor.Assistant = null;
        this.providerStudentService
            .updateProviderStudentSupervisor(this.providerStudentSupervisor)            .subscribe(() => {
                this.success();
            });
    }
}
