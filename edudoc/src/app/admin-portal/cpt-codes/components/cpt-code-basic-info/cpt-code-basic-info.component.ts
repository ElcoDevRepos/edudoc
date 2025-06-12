import { CptCodeDynamicConfig } from '@admin/cpt-codes/cpt-code.dynamic-config';
import { CptCodeService } from '@admin/cpt-codes/services/cpt-code.service';
import { ServiceUnitRuleService } from '@admin/service-unit-rules/services/service-unit-rule.service';
import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ServiceCodeEnums } from '@model/enums/service-code.enum';
import { ICptCode } from '@model/interfaces/cpt-code';
import { ISelectOptions } from '@model/interfaces/custom/select-options';
import { markAllFormFieldsAsTouched } from '@mt-ng2/common-functions';
import { DynamicField, DynamicFieldType, DynamicFieldTypes, DynamicLabel, IDynamicFieldType } from '@mt-ng2/dynamic-form';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-cpt-code-basic-info',
    templateUrl: './cpt-code-basic-info.component.html',
})
export class CptCodeBasicInfoComponent implements OnInit {
    @Input() cptCode: ICptCode;
    @Input() canEdit: boolean;

    isEditing: boolean;
    isHovered: boolean;
    viewOnly: DynamicLabel[] = [];
    formObject: DynamicField[] = [];
    formFactory: CptCodeDynamicConfig<ICptCode>;
    doubleClickIsDisabled = false;
    serviceUnitRules: ISelectOptions[];

    get hasNursing(): boolean {
        return this.cptCode.CptCodeAssocations?.some((association) => association.ServiceCodeId === ServiceCodeEnums.NURSING);
    }

    constructor(
        private notificationsService: NotificationsService,
        private router: Router,
        private cptCodeService: CptCodeService,
        private serviceUnitRulesService: ServiceUnitRuleService) {}

    ngOnInit(): void {
        this.serviceUnitRulesService.getSelectOptions().subscribe((rules) => {
            rules.unshift({
                Archived: false,
                Id: null,
                Name: 'None',
            });
            this.serviceUnitRules = rules;
            this.isEditing = false;
            this.setConfig();
        });
    }

    setConfig(): void {
        this.formFactory = new CptCodeDynamicConfig<ICptCode>(this.cptCode, this.serviceUnitRules, null, null, null);
        const config = this.cptCode.Id === 0 ? this.formFactory.getForCreate() : this.formFactory.getForUpdate();
        this.viewOnly = config?.viewOnly?.map((x) => new DynamicLabel(x));
        this.formObject = config?.formObject?.map((x) => new DynamicField(x));

        if (this.cptCode.Id === 0) {
            // new cpt code
            this.isEditing = true;
        }
    }

    edit(): void {
        if (this.canEdit) {
            this.isEditing = true;
        }
    }

    cancelClick(): void {
        if (this.cptCode.Id === 0) {
            void this.router.navigate(['/cpt-codes']);
        } else {
            this.isEditing = false;
        }
    }

    formSubmitted(form: UntypedFormGroup): void {
        if (form.valid) {
            this.formFactory.assignFormValues(this.cptCode, form.value.CptCode as ICptCode);
            if (!this.cptCode.Id || this.cptCode.Id === 0) {
                this.cptCodeService
                    .create(this.cptCode)                    .subscribe((answer) => {
                        void this.router.navigate([`/cpt-codes/${answer}`]);
                        this.success();
                        this.cptCodeService.emitChange(this.cptCode);
                    });
            } else {
                this.cptCodeService
                    .update(this.cptCode)                    .subscribe(() => {
                        this.isEditing = false;
                        this.success();
                        this.cptCodeService.emitChange(this.cptCode);
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

    getRNDefaultField(): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: 'RN Default',
            name: 'rnDefault',
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Checkbox,
            }),
            value: this.cptCode.RnDefault,
        });
    }

    getLPNDefaultField(): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: 'LPN Default',
            name: 'lpnDefault',
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Checkbox,
            }),
            value: this.cptCode.LpnDefault,
        });
    }

}
