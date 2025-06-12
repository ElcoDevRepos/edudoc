import { ReturnReasonCategoryService } from '@admin/managed-list-items/managed-item-services/return-reason-category.service';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { IEncounterReasonForReturn } from '@model/interfaces/encounter-reason-for-return';
import { IMetaItem } from '@mt-ng2/base-service';
import {
    DynamicField,
    DynamicFieldType,
    DynamicFieldTypes, IDynamicField, IDynamicFieldType,
    InputTypes,
    SelectInputTypes
} from '@mt-ng2/dynamic-form';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { EncounterReasonForReturnService } from './services/my-reasons-for-return.service';

@Component({
    selector: 'app-my-reasons-for-return-management',
    styles: [
        `
            .border-right {
                border-right: 1px solid #00456d;
            }
        `,
    ],
    templateUrl: './my-reasons-for-return-management.component.html',
})
export class MyReasonsForReturnManagementComponent implements OnInit {
    currentReasons: IEncounterReasonForReturn[];
    selectedReasons: IEncounterReasonForReturn[];
    selectedReasonForReturn: IEncounterReasonForReturn;
    selectedCategoryId: number;
    reasonForReturnCategories: IMetaItem[];

    doubleClickIsDisabled = false;
    form: UntypedFormGroup;
    reasonForReturnField: DynamicField;

    constructor(
        private fb: UntypedFormBuilder,
        private notificationsService: NotificationsService,
        private reasonsForReturnService: EncounterReasonForReturnService,
        private reasonsForReturnCategoryService: ReturnReasonCategoryService,
    ) {}

    ngOnInit(): void {
        forkJoin(this.reasonsForReturnService.getByUserId(), this.reasonsForReturnCategoryService.getAll()).subscribe(
            ([currentReasons, reasonForReturnCategories]) => {
                this.currentReasons = currentReasons;
                this.reasonForReturnCategories = reasonForReturnCategories.map(
                    (category) =>
                        ({
                            Id: category.Id,
                            Name: category.Name,
                        }),
                );
                this.buildForm();
            },
        );
    }

    private buildForm(): void {
        this.form = this.fb.group({
            Form: this.fb.group({}),
        });

        this.reasonForReturnField = new DynamicField({
            formGroup: 'Form',
            label: 'Reason For Return',
            name: 'reasonForReturn',
            options: null,
            placeholder: 'Enter your new reason for return.',
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Input,
                inputType: InputTypes.Textarea,
            }),
            value: this.selectedReasonForReturn ? this.currentReasons.find((r) => r.Id === this.selectedReasonForReturn.Id).Name : null,
        });
    }

    getReasonForReturnCategoriesField(): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: 'Categories',
            name: 'reasonForReturnCategories',
            options: this.reasonForReturnCategories,
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Select,
                inputType: SelectInputTypes.Dropdown,
            }),
            value: null,
        });
    }

    categorySelected(evt: number): void {
        this.selectedCategoryId = evt;
        this.filterSelectedReasons();
    }

    filterSelectedReasons(): void {
        this.selectedReasons = this.currentReasons.filter((reason) => reason.ReturnReasonCategoryId === this.selectedCategoryId);
    }

    saveReason(): void {
        if (!this.form.valid) {
            this.notificationsService.error('Please make sure the reason for return is not empty.');
        } else {
            const newReasonForReturn: IEncounterReasonForReturn = this.reasonsForReturnService.getEmptyReasonForReturn();
            newReasonForReturn.Name = this.form.controls.Form.get('reasonForReturn').value;
            newReasonForReturn.ReturnReasonCategoryId = this.selectedCategoryId;
            this.reasonsForReturnService
                .create(newReasonForReturn)                .subscribe((answer) => {
                    newReasonForReturn.Id = answer;
                    this.currentReasons.push(newReasonForReturn);
                    this.filterSelectedReasons();
                    this.notificationsService.success('Reason For Return created successfully!');
                });
        }
    }

    archiveReason(returnReasonId: number): void {
        this.reasonsForReturnService.delete(returnReasonId).subscribe(() => {
            this.currentReasons = this.currentReasons.filter((reason) => reason.Id !== returnReasonId);
            this.filterSelectedReasons();
        });
    }
}
