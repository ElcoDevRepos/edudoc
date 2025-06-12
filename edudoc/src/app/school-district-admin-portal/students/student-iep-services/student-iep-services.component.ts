import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { markAllFormFieldsAsTouched } from '@mt-ng2/common-functions';
import { NotificationsService } from '@mt-ng2/notifications-module';

import { IIepService } from '@model/interfaces/iep-service';
import { DynamicField, DynamicLabel } from '@mt-ng2/dynamic-form';
import { StudentIEPServicesService } from '../services/student-iep-services.service';
import { StudentIEPServicesDynamicConfig } from './student-iep-services.dynamic-config';

@Component({
    selector: 'app-student-iep-services',
    templateUrl: './student-iep-services.component.html',
})
export class StudentIepServicesComponent implements OnInit {
    @Input() iepService: IIepService;
    @Input() canEdit: boolean;

    isEditing: boolean;
    isHovered: boolean;
    viewOnly: DynamicLabel[] = [];
    formObject: DynamicField[] = [];
    formFactory: StudentIEPServicesDynamicConfig<IIepService>;
    doubleClickIsDisabled = false;

    constructor(
        private studentIEPService: StudentIEPServicesService,
        private notificationsService: NotificationsService,
        ) {}

    ngOnInit(): void {
        this.isEditing = false;
        this.setConfig();
    }

    setConfig(): void {
        this.formFactory = new StudentIEPServicesDynamicConfig<IIepService>(this.iepService);
        const config = this.iepService.Id === 0 ? this.formFactory.getForCreate() : this.formFactory.getForUpdate();
        this.viewOnly = config?.viewOnly?.map((x) => new DynamicLabel(x));
        this.formObject = config?.formObject?.map((x) => new DynamicField(x));

        if (this.iepService.Id === 0) {
            // new services
            this.isEditing = true;
        }
    }

    edit(): void {
        if (this.canEdit) {
            this.isEditing = true;
        }
    }

    cancelClick(): void {
        this.isEditing = false;
    }

    formSubmitted(form: UntypedFormGroup): void {
        if (form.valid) {
            this.formFactory.assignFormValues(this.iepService, form.value.IepService as IIepService);
            if (!this.iepService.Id || this.iepService.Id === 0) {
                // handle new student save
                this.studentIEPService
                    .create(this.iepService)                    .subscribe((answer) => {
                        this.iepService.Id = answer;
                        this.success();
                        this.studentIEPService.emitChange(this.iepService);
                        this.setConfig();
                    });
            } else {
                // handle existing services save
                this.studentIEPService
                    .update(this.iepService)                    .subscribe(() => {
                        this.success();
                        this.studentIEPService.emitChange(this.iepService);
                        this.setConfig();
                    });
            }
        } else {
            markAllFormFieldsAsTouched(form);
            this.error();
        }
    }

    error(): void {
        this.notificationsService.error('Save failed.  Please check the form and try again.');
    }

    success(): void {
        this.notificationsService.success('IEP Services saved successfully.');
        this.isEditing = false;
    }
}
