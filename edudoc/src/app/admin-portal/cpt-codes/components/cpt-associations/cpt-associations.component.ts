import { EvaluationTypeService } from '@admin/evaluation-type-management/services/evaluation-type.service';
import { ProviderTitleService } from '@admin/provider-titles/services/provider-title.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { getMetaItemNameValue } from '@common/get-meta-item-name/get-meta-item-name.library';
import { ServiceCodeService } from '@common/services/service-code.service';
import { ServiceTypeService } from '@common/services/service-type.service';
import { EncounterServiceTypes } from '@model/enums/encounter-service-types.enum';
import { IExpandableObject } from '@model/expandable-object';
import { ICptCodeAssocationDynamicControlsParameters } from '@model/form-controls/cpt-code-assocation.form-controls';
import { ICptCodeAssocation } from '@model/interfaces/cpt-code-assocation';
import { IEvaluationType } from '@model/interfaces/evaluation-type';
import { IProviderTitle } from '@model/interfaces/provider-title';
import { IServiceCode } from '@model/interfaces/service-code';
import { IServiceType } from '@model/interfaces/service-type';
import { CptCodeAssociationsDynamicControlsPartial } from '@model/partials/cpt-code-associations-partial.form-controls';
import { markAllFormFieldsAsTouched } from '@mt-ng2/common-functions';
import { DynamicField, DynamicFieldType, DynamicFieldTypes, IDynamicFieldType, SelectInputTypes } from '@mt-ng2/dynamic-form';
import { ModalService } from '@mt-ng2/modal-module';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { CptCodeAssociationsService } from './cpt-associations.service';
import { CptCodeAssociationsDynamicConfig } from './cpt-code-associations.dynamic-config';

export interface ICptAssociationFormData {
    form: UntypedFormGroup;
    controls: IExpandableObject;
    association: ICptCodeAssocation;
}

@Component({
    selector: 'app-cpt-code-associations',
    templateUrl: './cpt-associations.component.html',
})
export class CptCodeAssociationsComponent implements OnInit {
    @Input() cptCodeAssociations: ICptCodeAssocation[] = [];
    @Input() cptCodeId: number;
    serviceTypes: IServiceType[] = [];
    providerTitles: IProviderTitle[] = [];
    serviceCodes: IServiceCode[] = [];
    evaluationTypes: IEvaluationType[] = [];
    @Input() canEdit: boolean;
    @Output() onAssociationsSaved = new EventEmitter();
    isHovered: boolean;
    isEditing: boolean;
    doubleClickIsDisabled = false;
    formFactory: CptCodeAssociationsDynamicConfig<ICptCodeAssocation>;
    associationForms: ICptAssociationFormData[] = [];
    metaItemNameFunc = getMetaItemNameValue.bind(this);
    evalTypeControl: AbstractControl;

    // Bulk Add Variable
    bulkAdd = false;
    bulkForm = this.fb.group({});

    get hasAssociations(): boolean {
        return this.cptCodeAssociations.some((a) => a.Id !== 0);
    }

    constructor(
        private evaluationTypeService: EvaluationTypeService,
        private cptAssociationService: CptCodeAssociationsService,
        private fb: UntypedFormBuilder,
        private notificationsService: NotificationsService,
        private providerTitleService: ProviderTitleService,
        private serviceCodeService: ServiceCodeService,
        private serviceTypeService: ServiceTypeService,
        private modalService: ModalService,
    ) {}

    ngOnInit(): void {
        this.buildFormArray();
        forkJoin([
            this.evaluationTypeService.getAll(),
            this.providerTitleService.getAll(),
            this.serviceCodeService.getBillableServiceCodes(),
            this.serviceTypeService.getItems(),
        ]).subscribe(([evaluationTypes, providerTitles, billableServiceCodes]) => {
            this.evaluationTypes = evaluationTypes;
            this.providerTitles = providerTitles.filter((pt) => !pt.Archived);
            this.serviceCodes = billableServiceCodes;
            this.serviceTypes = this.serviceTypeService.items;
            this.bulkAdd = true;
        });
        this.isEditing = false;
    }

    ngOnChanges(): void {
        this.buildFormArray();
    }

    buildFormArray(): void {
        this.associationForms = [];
        this.cptCodeAssociations.forEach((a) => {
            this.addForm(a);
        });
    }

    addForm(association: ICptCodeAssocation): void {
        const extraParams: ICptCodeAssocationDynamicControlsParameters = {
            evaluationTypes: this.evaluationTypes,
            providerTitles: this.providerTitles,
            serviceCodes: this.serviceCodes,
            serviceTypes: this.serviceTypes,
        };
        const controls = new CptCodeAssociationsDynamicControlsPartial(association, extraParams);
        const form = this.fb.group({});
        this.associationForms.push({ form: form, controls: controls.Form, association });
    }

    handleServiceTypeChange(event: number, formData: ICptAssociationFormData): void {
        event > 1 ? this.disableControl(formData.form.get('EvaluationTypeId')) : formData.form.get('EvaluationTypeId').enable();
    }

    disableControl(control: AbstractControl): void {
        control.setValue(null);
        control.disable();
    }

    addRowsForNewAssociations(): void {
        const emptyRows = Array.from(Array(5), () => this.cptAssociationService.getEmptyCptCodeAssociation());
        this.cptCodeAssociations.push(...emptyRows);
    }

    edit(): void {
        this.addRowsForNewAssociations();
        this.buildFormArray();
        this.isEditing = true;
    }

    addRow(): void {
        this.addForm(this.cptAssociationService.getEmptyCptCodeAssociation());
    }

    archiveRow(index: number): void {
        this.associationForms.splice(index, 1);
        this.cptCodeAssociations.splice(index, 1);
        if (!this.associationForms.length) {
            this.isEditing = false;
        }
    }

    validateForm(): boolean {
        this.associationForms.forEach((form) => {
            if (!form.form.pristine) {
                markAllFormFieldsAsTouched(form.form);
            }
        });
        return !this.associationForms.some((form) => form.form.invalid && !form.form.pristine);
    }

    formSubmitted(): void {
        if (!this.associationForms.every((form) => form.form.pristine)) {
            const formIsValid = this.validateForm();
            if (formIsValid) {
                this.saveCptCodeAssociations(this.associationForms);
            } else {
                this.modalService.showModal({
                    cancelButtonColor: '#d33',
                    cancelButtonText: 'Cancel',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Save anyway',
                    focusConfirm: false,
                    html: 'Some rows have validation errors. These rows will not be saved. To ignore these rows and save valid rows click save.',
                    showCancelButton: true,
                    showCloseButton: false,
                    showConfirmButton: true,
                    title: 'Validation Errors',
                    width: 800,
                }).subscribe((result) => {
                    const shouldSaveForm = result;
                    if (shouldSaveForm.value) {
                        const validForms = this.associationForms.filter((d) => d.form.valid);
                        this.saveCptCodeAssociations(validForms);
                    } else {
                        setTimeout(() => (this.doubleClickIsDisabled = false));
                        return;
                    }
                });
            }
        } else {
            setTimeout(() => (this.doubleClickIsDisabled = false));
        }
    }

    saveCptCodeAssociations(formData: ICptAssociationFormData[]): void {
        const associationsToSave = this.assignFormValues(formData.filter((d) => !d.form.pristine));
        this.cptAssociationService
            .updateCptCodeAssociations(associationsToSave)            .subscribe(() => {
                this.isEditing = false;
                this.onAssociationsSaved.emit();
                this.associationForms = [];
                this.notificationsService.success('Associations updated successfully');
            });
    }

    assignFormValues(formData: ICptAssociationFormData[]): ICptCodeAssocation[] {
        formData.forEach((d) => {
            d.association.CptCodeId = this.cptCodeId;
            d.association.Archived = d.association.Id > 0 ? d.form.get('Archived').value : 0;
            d.association.EvaluationTypeId = d.form.get('EvaluationTypeId').value;
            d.association.ProviderTitleId = d.form.get('ProviderTitleId').value;
            d.association.ServiceCodeId = d.form.get('ServiceCodeId').value;
            d.association.ServiceTypeId = d.form.get('ServiceTypeId').value;
            d.association.IsTelehealth = d.form.get('IsTelehealth').value;
            d.association.IsGroup = d.form.get('IsGroup').value;
            d.association.Default = d.form.get('Default').value;
        });
        return formData.map((d) => d.association);
    }

    cancelClick(): void {
        this.associationForms = this.associationForms.filter((a) => a.association.Id > 0);
        this.cptCodeAssociations = this.cptCodeAssociations.filter((a) => a.Id !== 0);
        this.isEditing = false;
    }

    // BULK FORMS

    getBulkServiceTypeIdsField(): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: 'Service Types',
            name: 'serviceTypes',
            options: this.serviceTypes,
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Select,
                inputType: SelectInputTypes.MultiselectDropdown,
                maxToShowInSelectedText: 1,
            }),
            // eslint-disable-next-line @typescript-eslint/unbound-method
            // eslint-disable-next-line @typescript-eslint/unbound-method
validation: [ Validators.required ],
            validators: { 'required': true },
            value: null,
        });
    }

    getBulkServiceCodeIdsField(): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: 'Service Codes',
            name: 'serviceCodes',
            options: this.serviceCodes,
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Select,
                inputType: SelectInputTypes.MultiselectDropdown,
                maxToShowInSelectedText: 1,
            }),
            // eslint-disable-next-line @typescript-eslint/unbound-method
            // eslint-disable-next-line @typescript-eslint/unbound-method
validation: [ Validators.required ],
            validators: { 'required': true },
            value: null,
        });
    }

    getBulkEvaluationTypeIdsField(): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: 'Evaluation Types',
            name: 'evaluationTypes',
            options: this.evaluationTypes,
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Select,
                inputType: SelectInputTypes.MultiselectDropdown,
                maxToShowInSelectedText: 1,
            }),
            // eslint-disable-next-line @typescript-eslint/unbound-method
            // eslint-disable-next-line @typescript-eslint/unbound-method
validation: [ Validators.required ],
            validators: { 'required': true },
            value: null,
        });
    }

    getBulkProviderTitleIdsField(): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: 'Provider Titles',
            name: 'providerTitles',
            options: this.providerTitles,
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Select,
                inputType: SelectInputTypes.MultiselectDropdown,
                maxToShowInSelectedText: 1,
            }),
            // eslint-disable-next-line @typescript-eslint/unbound-method
            validation: [ Validators.required ],
            validators: { 'required': true },
            value: null,
        });
    }

    getBulkIsTelehealthsField(): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: 'Is Telehealth',
            name: 'isTelehealth',
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Checkbox,
            }),
            value: null,
        });
    }

    getBulkIsGroupField(): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: 'Is Group',
            name: 'isGroup',
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Checkbox,
            }),
            value: null,
        });
    }

    getBulkDefaultField(): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: 'Group Default',
            name: 'default',
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Checkbox,
            }),
            value: null,
        });
    }

    bulkFormSubmitted(): void {
        if (this.bulkForm.valid) {
            this.saveBulkCptCodeAssociations(this.bulkForm);
        } else {
            this.bulkForm.markAllAsTouched();
            this.notificationsService.error('Please check the bulk form and make sure each field has at least one selection.');
        }
    }

    saveBulkCptCodeAssociations(form: UntypedFormGroup): void {
        const associationsToSave = this.assignBulkFormValues(form);
        this.cptAssociationService
            .updateCptCodeAssociations(associationsToSave)
            .subscribe(() => {
                this.isEditing = false;
                this.onAssociationsSaved.emit();
                this.bulkAdd = false;
                setTimeout(() => (this.bulkAdd = true));
                this.notificationsService.success('Associations updated successfully');
            });
    }

    assignBulkFormValues(formData: UntypedFormGroup): ICptCodeAssocation[] {
        const newAssociations = [];
        const serviceTypeIds = formData.get('serviceTypes').value;
        const serviceCodeIds = formData.get('serviceCodes').value;
        const evaluationTypeIds = formData.get('evaluationTypes').value;
        const providerTitleIds = formData.get('providerTitles').value;
        const isTelehealth = formData.get('isTelehealth').value;
        const isGroup = formData.get('isGroup').value;
        const isDefault = formData.get('default').value;
        for (const serviceTypeId of serviceTypeIds) {
            for (const serviceCodeId of serviceCodeIds) {
                if (evaluationTypeIds) {
                    for (const evaluationTypeId of evaluationTypeIds) {
                        for (const providerTitleId of providerTitleIds.filter((id) => this.providerTitles.some((pt) => pt.Id == id && pt.ServiceCodeId == serviceCodeId))) {
                            const newAssociation = this.cptAssociationService.getEmptyCptCodeAssociation();
                            newAssociation.ServiceCodeId = serviceCodeId;
                            newAssociation.ServiceTypeId = serviceTypeId;
                            newAssociation.EvaluationTypeId = serviceTypeId === 1 ? evaluationTypeId : null;
                            newAssociation.ProviderTitleId = providerTitleId;
                            newAssociation.IsTelehealth = isTelehealth || false;
                            newAssociation.IsGroup = isGroup || false;
                            newAssociation.Default = isDefault || false;
                            newAssociation.CptCodeId = this.cptCodeId;
                            newAssociations.push(newAssociation);
                        }
                    }

                } else {
                    for (const providerTitleId of providerTitleIds.filter((id) => this.providerTitles.some((pt) => pt.Id == id && pt.ServiceCodeId == serviceCodeId))) {
                        if (this.providerTitles.some((pt) => pt.Id == providerTitleId && pt.ServiceCodeId == serviceCodeId))
                        {
                            const newAssociation = this.cptAssociationService.getEmptyCptCodeAssociation();
                            newAssociation.ServiceCodeId = serviceCodeId;
                            newAssociation.ServiceTypeId = serviceTypeId;
                            newAssociation.EvaluationTypeId = null;
                            newAssociation.ProviderTitleId = providerTitleId;
                            newAssociation.IsTelehealth = isTelehealth || false;
                            newAssociation.IsGroup = isGroup || false;
                            newAssociation.Default = isDefault || false;
                            newAssociation.CptCodeId = this.cptCodeId;
                            newAssociations.push(newAssociation);
                        }
                    }
                }

            }

        }
        return newAssociations;
    }

    clearBulkFields(): void {
        this.bulkAdd = false;
        setTimeout(() => (this.bulkAdd = true));
    }

    handleServiceTypeSelection(evt: number[]): void {
        if (this.evalTypeControl !== null && evt && evt.length === 1 && evt[0] === EncounterServiceTypes.Treatment_Therapy) {
            this.evalTypeControl.disable();
        } else if (this.evalTypeControl !== null && this.evalTypeControl.disabled) {
            this.evalTypeControl.enable();
        }
    }

}
