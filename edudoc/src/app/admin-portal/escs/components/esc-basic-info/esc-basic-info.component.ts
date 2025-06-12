import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { markAllFormFieldsAsTouched } from '@mt-ng2/common-functions';
import { NotificationsService } from '@mt-ng2/notifications-module';

import { IEsc } from '@model/interfaces/esc';
import { DynamicField, DynamicLabel } from '@mt-ng2/dynamic-form';
import { EscDynamicConfig } from '../../esc.dynamic-config';
import { EscService } from '../../services/esc.service';

@Component({
    selector: 'app-esc-basic-info',
    templateUrl: './esc-basic-info.component.html',
})
export class EscBasicInfoComponent implements OnInit {
    @Input() esc: IEsc;
    @Input() canEdit: boolean;

    isEditing: boolean;
    isHovered: boolean;
    viewOnly: DynamicLabel[] = [];
    formObject: DynamicField[] = [];
    formFactory: EscDynamicConfig<IEsc>;
    doubleClickIsDisabled = false;

    constructor(private escService: EscService, private notificationsService: NotificationsService, private router: Router) {}

    ngOnInit(): void {
        this.isEditing = false;
        this.setConfig();
    }

    setConfig(): void {
        const controls = ['Name', 'Code', 'Notes'];
        this.formFactory = new EscDynamicConfig<IEsc>(this.esc, null, null, null, controls);
        const config = this.esc.Id === 0 ? this.formFactory.getForCreate() : this.formFactory.getForUpdate();
        this.viewOnly = config?.viewOnly?.map((x) => new DynamicLabel(x));
        this.formObject = config?.formObject?.map((x) => new DynamicField(x));

        if (this.esc.Id === 0) {
            // new esc
            this.isEditing = true;
        } 
    }

    edit(): void {
        if (this.canEdit) {
            this.isEditing = true;
        }
    }

    cancelClick(): void {
        if (this.esc.Id === 0) {
            void this.router.navigate(['/escs']);
        } else {
            this.isEditing = false;
        }
    }

    formSubmitted(form: UntypedFormGroup): void {
        if (form.valid) {
            this.formFactory.assignFormValues(this.esc, form.value.Esc as IEsc);
            if (!this.esc.Id || this.esc.Id === 0) {
                // handle new esc save
                this.escService
                    .create(this.esc)                    .subscribe((answer) => {
                        void this.router.navigate([`/escs/${answer}`]);
                        this.success();
                        this.escService.emitChange(this.esc);
                    });
            } else {
                // handle existing esc save
                this.escService
                    .update(this.esc)                    .subscribe(() => {
                        this.isEditing = false;
                        this.success();
                        this.escService.emitChange(this.esc);
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
        this.notificationsService.success('ESC saved successfully.');
    }
}
