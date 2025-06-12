import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { StudentParentalConsentService } from '@common/student-parental-consents-list/student-parental-consent.service';
import { ParentalConsentTypesEnum } from '@model/enums/parental-consent-types.enum';
import { IStudentParentalConsentDynamicControlsParameters } from '@model/form-controls/student-parental-consent.form-controls';
import { IStudentParentalConsent } from '@model/interfaces/student-parental-consent';
import { IStudentParentalConsentType } from '@model/interfaces/student-parental-consent-type';
import { markAllFormFieldsAsTouched } from '@mt-ng2/common-functions';
import { DynamicField, DynamicLabel } from '@mt-ng2/dynamic-form';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { StudentParentalConsentTypeService } from '../studentparentalconsenttype.service';
import { StudentParentalConsentDynamicConfig } from './parental-consent.dynamic-config';
import { StudentParentalConsentLabelGenerator } from './student-parental-consent-label-generator';

@Component({
    selector: 'student-parental-consent',
    templateUrl: './student-parental-consent.component.html',
})
export class StudentParentalConsentComponent implements OnInit, OnDestroy {
    private _parentalConsents: IStudentParentalConsent[];
    @Input('parentalConsents')
    set parentalConsents(val: IStudentParentalConsent[]) {
        this._parentalConsents = val
            .sort((a, b) => new Date(b.ParentalConsentDateEntered).getTime() - new Date(a.ParentalConsentDateEntered).getTime())
            .reduce((acc, curr) => {
                if (acc.length === 0) {
                    return [curr];
                }
                // When there are multiple pending consents in a row, we only want to show the oldest one.
                const front = acc.pop();
                // We've already sorted them by date entered, so we don't need to check if it's older. It will be 100% of the time
                if (
                    front.ParentalConsentTypeId === ParentalConsentTypesEnum.PendingConsent &&
                    curr.ParentalConsentTypeId === ParentalConsentTypesEnum.PendingConsent
                ) {
                    return [...acc, curr];
                } else {
                    // If they weren't both pending, put the one you took out back
                    return [...acc, front, curr];
                }
            }, [] as IStudentParentalConsent[]);
    }
    get parentalConsents(): IStudentParentalConsent[] {
        return this._parentalConsents;
    }
    @Input('studentId') studentId;
    isEditing = false;
    doubleClickIsDisabled = false;
    labelGenerator: StudentParentalConsentLabelGenerator = new StudentParentalConsentLabelGenerator();
    formFactory: StudentParentalConsentDynamicConfig<IStudentParentalConsent>;
    viewOnly: DynamicLabel[] = [];
    formObject: DynamicField[] = [];
    parentalConsentTypes: IStudentParentalConsentType[];
    controlSubscription: Subscription;
    consentForUpdate: IStudentParentalConsent;

    constructor(
        private studentParentalConsentService: StudentParentalConsentService,
        private studentParentalConsentTypeService: StudentParentalConsentTypeService,
        private notificationsService: NotificationsService,
    ) {}

    ngOnInit(): void {
        this.studentParentalConsentTypeService.getItems().subscribe((types) => (this.parentalConsentTypes = types));
    }

    ngOnDestroy(): void {
        if (this.controlSubscription) {
            this.controlSubscription.unsubscribe();
        }
    }
    setConfig(): void {
        const parentalConsent = this.consentForUpdate || this.studentParentalConsentService.getEmptyStudentParentalConsent();
        const additionalParams: IStudentParentalConsentDynamicControlsParameters = { parentalConsentTypes: this.parentalConsentTypes };
        this.formFactory = new StudentParentalConsentDynamicConfig<IStudentParentalConsent>(parentalConsent, null, additionalParams);
        this.isEditing = true;
        const config = this.formFactory.getForUpdate();
        this.viewOnly = config?.viewOnly?.map((x) => new DynamicLabel(x));
        this.formObject = config?.formObject?.map((x) => new DynamicField(x));
    }

    subscribeToControl(form: UntypedFormGroup): void {
        this.controlSubscription = form
            .get('StudentParentalConsent.ParentalConsentTypeId')
            .valueChanges.subscribe((val) =>
                form.get('StudentParentalConsent.ParentalConsentEffectiveDate').mtSetRequired(val !== ParentalConsentTypesEnum.PendingConsent),
            );
    }

    formSubmitted(form: UntypedFormGroup): void {
        const parentalConsent = this.consentForUpdate || this.studentParentalConsentService.getEmptyStudentParentalConsent();
        this.formFactory.assignFormValues(parentalConsent, form.value.StudentParentalConsent as IStudentParentalConsent);
        parentalConsent.StudentParentalConsentType = this.parentalConsentTypes.find((t) => t.Id === parentalConsent.ParentalConsentTypeId);
        if (form.valid) {
            if (!this.consentForUpdate) {
                parentalConsent.StudentId = this.studentId;
                this.studentParentalConsentService.create(parentalConsent).subscribe((answer) => {
                    this.isEditing = false;
                    parentalConsent.Id = answer;
                    this._parentalConsents.push(parentalConsent);
                    this.success();
                });
            } else {
                this.studentParentalConsentService.update(parentalConsent).subscribe(() => {
                    this.isEditing = false;
                    this.consentForUpdate = null;
                    this.success();
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
        this.notificationsService.success('Parental Consent saved successfully.');
    }
}
