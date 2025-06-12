import { Component, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { SettingDynamicControls } from '@model/form-controls/setting.form-controls';
import { ISetting } from '@model/interfaces/setting';
import { DynamicField, LabelPosition, LabelPositions } from '@mt-ng2/dynamic-form';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { AppSettingsService } from './app-settings.service';

@Component({
    selector: 'app-settings',
    templateUrl: './app-settings.component.html',
})
export class AppSettingsComponent implements OnInit {
    settings: ISetting[] = [];
    form: UntypedFormGroup;
    formArray: UntypedFormArray;
    settingsDynamicForm = new SettingDynamicControls(null).Form;

    constructor(private appSettingsService: AppSettingsService, private notificationsService: NotificationsService, private fb: UntypedFormBuilder) {}

    ngOnInit(): void {
        this.setForm();
        this.appSettingsService.getAll().subscribe((answer) => {
            this.settings = answer;
            this.setForm();
        });
    }

    setForm(): void {
        this.form = this.fb.group({});
        const formGroups = this.settings.map((item) => this.fb.group(item));
        this.formArray = this.fb.array(formGroups);
        this.form.addControl('Settings', this.formArray);
    }

    get currentFormArray(): UntypedFormArray {
        return this.form.get('Settings') as UntypedFormArray;
    }

    getLabel(form: UntypedFormGroup): string {
        const fieldName = 'Name';
        return form.controls[fieldName].value;
    }

    getField(form: UntypedFormGroup): DynamicField {
        const fieldName = 'Value';
        const fieldToCopy = <DynamicField>{ ...this.settingsDynamicForm[fieldName] };
        const dynamicField: DynamicField = new DynamicField(
            {
                formGroup: fieldToCopy.formGroup,
                label: fieldToCopy.label,
                name: fieldToCopy.name,
                options: fieldToCopy.options,
                placeholder: fieldToCopy.placeholder,
                type: fieldToCopy.type,
                validation: fieldToCopy.validation,
                validators: fieldToCopy.validators,
                value: form.controls[fieldName].value,
            },
        );
        dynamicField.labelPosition = new LabelPosition({ position: LabelPositions.Hidden });
        dynamicField.insideBoxValidation = true;
        return dynamicField;
    }

    save(): void {
        this.appSettingsService.updateSettings(this.form.value.Settings as ISetting[]).subscribe(() => {
            this.notificationsService.success('Settings Saved Successfully');
        });
    }
}
