import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { IUserRole } from '@model/interfaces/user-role';
import { markAllFormFieldsAsTouched } from '@mt-ng2/common-functions';
import { DynamicField, DynamicLabel } from '@mt-ng2/dynamic-form';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { finalize } from 'rxjs/operators';
import { UserRoleDynamicConfig } from '../user-role.dynamic-config';
import { UserRoleService } from '../user-role.service';
import { UserTypeService } from '../user-type.service';

@Component({
    selector: 'app-user-role-basic-info',
    templateUrl: './user-role-basic-info.component.html',
})
export class UserRoleBasicInfoComponent implements OnInit {
    @Input() userRole: IUserRole;
    @Input() canEdit: boolean;
    roles: IUserRole[];
    isEditing: boolean;
    isHovered: boolean;
    viewOnly: DynamicLabel[] = [];
    formObject: DynamicField[] = [];
    userRoleForm: UntypedFormGroup;
    formFactory: UserRoleDynamicConfig<IUserRole>;
    doubleClickIsDisabled = false;

    constructor(
        private userRoleService: UserRoleService,
        private userTypeService: UserTypeService,
        private notificationsService: NotificationsService,
        private router: Router,
    ) {}

    ngOnInit(): void {
        this.isEditing = false;
         
        this.userTypeService.getItems().subscribe(() => {
            this.setConfig();
        });
    }

    setConfig(): void {
        this.formFactory = new UserRoleDynamicConfig<IUserRole>(this.userRole, this.userTypeService.items);
        const config = this.userRole.Id === 0 ? this.formFactory.getForCreate() : this.formFactory.getForUpdate();
        this.viewOnly = config?.viewOnly?.map((x) => new DynamicLabel(x));
        this.formObject = config?.formObject?.map((x) => new DynamicField(x));
        
        if (this.userRole.Id === 0) {
            this.isEditing = true;
        } 
    }

    edit(): void {
        if (this.canEdit) {
            this.isEditing = true;
        }
    }

    cancelClick(): void {
        if (this.userRole.Id === 0) {
            void this.router.navigate(['/roles']);
        } else {
            this.isEditing = false;
        }
    }
    formSubmitted(form: UntypedFormGroup): void {
        if (form.valid) {
            this.formFactory.assignFormValues(this.userRole, form.value.UserRole as IUserRole);
            this.userRoleService
                .saveUserRole(this.userRole)
                .pipe()
                .subscribe((answer) => {
                    this.success();
                    this.userRoleService.emitChange(this.userRole);
                    if (this.userRole.Id === 0) {
                        void this.router.navigate([`/roles/${answer.Id}`]);
                    } else {
                        this.isEditing = false;
                        this.setConfig();
                    }
                });
        } else {
            markAllFormFieldsAsTouched(form);
            this.error();
        }
    }

    error(): void {
        this.notificationsService.error('Save failed.  Please check the form and try again.');
    }

    success(): void {
        this.notificationsService.success('User Role saved successfully.');
    }
}
