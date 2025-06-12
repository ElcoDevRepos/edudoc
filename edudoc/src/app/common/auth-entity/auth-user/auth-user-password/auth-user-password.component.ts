import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { catchError, finalize } from 'rxjs/operators';

import { AuthService } from '@mt-ng2/auth-module';
import { NotificationsService } from '@mt-ng2/notifications-module';

import { FormGroup } from '@angular/forms';
import { IAuthUser } from '@model/interfaces/auth-user';
import { markAllFormFieldsAsTouched } from '@mt-ng2/common-functions';
import { DynamicField, DynamicLabel } from '@mt-ng2/dynamic-form';
import { of } from 'rxjs';
import { AuthEntityService } from '../../auth-entity.service';
import { AuthUserDynamicConfig } from '../auth-user.dynamic-config';

@Component({
    selector: 'app-auth-user-password',
    templateUrl: './auth-user-password.component.html',
})
export class AuthUserPasswordComponent implements OnInit {
    @Input('AuthUser') authUser: IAuthUser;
    @Input('canEdit') canEdit: boolean;
    @Output('updateVersion') updateVersion: EventEmitter<string | void> = new EventEmitter<string | void>();
    viewOnly: DynamicLabel[] = [];
    formObject: DynamicField[] = [];
    formFactory: AuthUserDynamicConfig<IAuthUser>;
    doubleClickIsDisabled = false;
    isEditing: boolean;

    configControls: string[] = ['CurrentPassword', 'Password', 'ConfirmPassword'];

    constructor(private notificationsService: NotificationsService, private authEntityService: AuthEntityService, private authService: AuthService) {}

    ngOnInit(): void {
        this.isEditing = false;
        this.setConfig();
    }

    setConfig(): void {
        this.formFactory = new AuthUserDynamicConfig<IAuthUser>(this.authUser, this.configControls);
        const config = this.formFactory.getForUpdate();
        this.viewOnly = config?.viewOnly?.map((x) => new DynamicLabel(x));
        this.formObject = config?.formObject?.map((x) => new DynamicField(x));
    }

    edit(): void {
        if (this.canEdit) {
            this.isEditing = true;
        }
    }

    cancel(): void {
        this.isEditing = false;
    }

    formSubmitted(form: FormGroup): void {
        if (this.authService.matchPassword(form)) {
            if (form.valid) {
                this.authEntityService
                    .savePassword(
                        this.authUser.Id,
                        form.value.AuthUser.Password as string,
                        form.value.AuthUser.CurrentPassword as string,
                        form.value.AuthUser.ConfirmPassword as string,
                    )
                    .pipe(
                        catchError(() => {
                            this.error('Please make sure you enter the correct password');
                            return of('Error!');
                        }),
                        finalize(() => (this.doubleClickIsDisabled = false)),
                    )
                    .subscribe((answer) => {
                        if (answer !== 'Error!') {
                            this.success();
                            this.isEditing = false;
                            this.updateVersion.emit(answer);
                        }
                    });
            } else {
                markAllFormFieldsAsTouched(form);
                this.error();
            }
        } else {
            this.error('Passwords do not match.');
        }
    }

    error(msg?: string): void {
        if (!msg) {
            this.notificationsService.error('Password save failed.  Please check the form and try again.');
        } else {
            this.notificationsService.error(msg);
        }
    }

    success(): void {
        this.notificationsService.success('Password Updated Successfully');
    }
}
