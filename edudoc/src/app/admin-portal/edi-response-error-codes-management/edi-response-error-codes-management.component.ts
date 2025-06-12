import { ISelectedItem } from '@admin/billing-schedules/components/billing-schedule-detail/billing-schedule-detail.component';
import { BillingScheduleAdminNotificationService } from '@admin/billing-schedules/services/Inclusions/billing-schedule-admin-notification.service';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { EdiResponseTypeService } from '@common/services/edi-response-type.service';
import { ISelectOptions } from '@model/interfaces/custom/select-options';
import { IEdiErrorCode } from '@model/interfaces/edi-error-code';
import { IEdiErrorCodeAdminNotification } from '@model/interfaces/edi-error-code-admin-notification';
import { IMetaItem } from '@mt-ng2/base-service';
import {
    DynamicField,
    DynamicFieldType,
    DynamicFieldTypes, IDynamicField, IDynamicFieldType,
    InputTypes,
    SelectInputTypes
} from '@mt-ng2/dynamic-form';
import { IModalOptions } from '@mt-ng2/modal-module';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { forkJoin } from 'rxjs';
import { EdiResponseErrorCodesLabelGenerator } from './label-generators/edi-error-codes-entity-label-generator';
import { EdiErrorCodeAdminNotificationService } from './services/edi-error-code-admin-notification.service';
import { EdiResponseErrorCodesService } from './services/edi-response-error-codes.service';

@Component({
    selector: 'app-edi-response-error-codes-management',
    styles: [
        `
            .border-right {
                border-right: 1px solid #00456d;
            }
        `,
    ],
    templateUrl: './edi-response-error-codes-management.component.html',
})
export class EdiResponseErrorCodesManagementComponent implements OnInit {
    currentErrorCodes: IEdiErrorCode[];
    selectedErrorCodes: IEdiErrorCode[];
    selectedErrorCode: IEdiErrorCode;
    selectedResponseTypeId: number;
    ediResponseTypes: IMetaItem[];

    form: UntypedFormGroup;
    errorCodeField: DynamicField;
    errorDescriptionField: DynamicField;

    // Admin Notifications
    canEdit = true;
    cardName = 'EDI ERROR CODE ADMIN NOTIFICATION';
    adminOptions: ISelectOptions[] = [];
    adminIds: number[];
    adminInclusions: ISelectedItem[] = [];

    // Entity Modal
    modalOptions: IModalOptions = {
        customClass: {
            title: 'text-center',
        },
        showCloseButton: true,
        showConfirmButton: false,
        width: '75%',
    };
    showModal = false;
    entityMap = {
        admins: 5,
        cptCodes: 4,
        districts: 1,
        providers: 2,
        serviceCodes: 3,
    };
    entityType: number;
    modalOptionEntities: IMetaItem[];
    modalOptionEntitiesFiltered: IMetaItem[];
    modalSelectedEntities: ISelectedItem[];
    modalSelectedEntitiesFiltered: ISelectedItem[];
    modalEntityName: string;
    modalOptionsTotal: number;
    searchOptionsControl: AbstractControl;
    searchSelectionsControl: AbstractControl;

    constructor(
        private fb: UntypedFormBuilder,
        private notificationsService: NotificationsService,
        private ediResponseErrorCodesService: EdiResponseErrorCodesService,
        private ediResponseTypeService: EdiResponseTypeService,
        public entityLabelGenerator: EdiResponseErrorCodesLabelGenerator,
        private adminNotificationInclusionService: BillingScheduleAdminNotificationService,
        private ediErrorCodeAdminNotificationService: EdiErrorCodeAdminNotificationService,
    ) {}

    ngOnInit(): void {
        forkJoin(
            this.ediResponseErrorCodesService.getAll(),
            this.ediResponseTypeService.getAll(),
            this.adminNotificationInclusionService.getSelectOptions(),
        ).subscribe(
            ([currentErrorCodes, ediResponseTypes, admins]) => {
                this.currentErrorCodes = currentErrorCodes;
                this.ediResponseTypes = ediResponseTypes.map(
                    (type) =>
                        ({
                            Id: type.Id,
                            Name: `${type.EdiFileFormat} - ${type.Name}`,
                        }),
                );
                this.adminOptions = admins.filter((admin)  => !admin.Archived);
                this.buildForm();
                this.assignMetaItems();
            },
        );
    }

    assignMetaItems(): void {
        this.ediErrorCodeAdminNotificationService.getAdmins().subscribe((result) => {
            this.adminInclusions = result.map((a) => ({
                Id: a.Id,
                Name: `${a.User.FirstName} ${a.User.LastName}`,
                OptionId: a.AdminId,
            }));
        });
    }

    private buildForm(): void {
        this.form = this.fb.group({
            Form: this.fb.group({}),
        });

        this.errorCodeField = new DynamicField({
            formGroup: 'Form',
            label: 'Error Code',
            name: 'errorCode',
            options: null,
            placeholder: 'Enter your error`s code.',
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Input,
                inputType: InputTypes.Textarea,
            }),
            // eslint-disable-next-line @typescript-eslint/unbound-method
            validation: [Validators.required],
            value: this.selectedErrorCode ? this.currentErrorCodes.find((r) => r.Id === this.selectedErrorCode.Id).ErrorCode : null,
        });

        this.errorDescriptionField = new DynamicField({
            formGroup: 'Form',
            label: 'Error Description',
            name: 'errorDescription',
            options: null,
            placeholder: 'Enter your error`s description.',
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Input,
                inputType: InputTypes.Textarea,
            }),
            // eslint-disable-next-line @typescript-eslint/unbound-method
            validation: [Validators.required],
            value: this.selectedErrorCode ? this.currentErrorCodes.find((r) => r.Id === this.selectedErrorCode.Id).Name : null,
        });
    }

    getEdiResponseTypesField(): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: 'Response Type',
            name: 'ediResponseTypes',
            options: this.ediResponseTypes,
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Select,
                inputType: SelectInputTypes.Dropdown,
            }),
            value: null,
        });
    }

    responseTypeSelected(evt: number): void {
        this.selectedResponseTypeId = evt;
        this.filterSelectedErrorCodes();
    }

    filterSelectedErrorCodes(): void {
        this.selectedErrorCodes = this.currentErrorCodes.filter((code) => code.EdiFileTypeId === this.selectedResponseTypeId);
    }

    saveErrorCode(): void {
        if (!this.form.valid) {
            this.notificationsService.error('Please make sure all fields are filled before submitting.');
        } else if (this.selectedErrorCode && this.selectedErrorCode.Id) {
            const errorCode = { ...this.selectedErrorCode }
            errorCode.ErrorCode = this.form.controls.Form.get('errorCode').value;
            errorCode.Name = this.form.controls.Form.get('errorDescription').value;
            this.ediResponseErrorCodesService
                .update(errorCode)
                .subscribe(() => {
                    this.currentErrorCodes = this.currentErrorCodes.filter(e => e.Id !== errorCode.Id);
                    this.currentErrorCodes.push(errorCode);
                    this.clearForm();
                    this.filterSelectedErrorCodes();
                    this.notificationsService.success('Error Code updated successfully!');
                },
                () => {
                    this.notificationsService.error('Error Code and Description must be unique');
                });
        } else {
            const newErrorCode: IEdiErrorCode = this.ediResponseErrorCodesService.getEmptyEdiErrorCode();
            newErrorCode.ErrorCode = this.form.controls.Form.get('errorCode').value;
            newErrorCode.Name = this.form.controls.Form.get('errorDescription').value;
            newErrorCode.EdiFileTypeId = this.selectedResponseTypeId;
            this.ediResponseErrorCodesService
                .create(newErrorCode)
                .subscribe((answer) => {
                    newErrorCode.Id = answer;
                    this.currentErrorCodes.push(newErrorCode);
                    this.filterSelectedErrorCodes();
                    this.form.controls.Form.get('errorCode').setValue(null);
                    this.form.controls.Form.get('errorDescription').setValue(null);
                    this.notificationsService.success('Error Code created successfully!');
                },
                () => {
                    this.notificationsService.error('Error Code and Description must be unique');
                },);
        }
    }

    archiveErrorCode(errorCodeId: number): void {
        this.ediResponseErrorCodesService.delete(errorCodeId).subscribe(() => {
            this.currentErrorCodes = this.currentErrorCodes.filter((code) => code.Id !== errorCodeId);
            this.filterSelectedErrorCodes();
        });
    }

    getSearchField(): DynamicField {
        return new DynamicField({
            formGroup: 'null',
            label: 'Search',
            name: 'search',
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Input,
                inputType: InputTypes.Textarea,
            }),
            validation: [],
            value: null,
        });
    }

    filterModal(event: string, options: boolean): void {
        if (options) {
            this.modalOptionEntitiesFiltered = this.modalOptionEntities.filter((option) => option.Name.toLowerCase().includes(event.toLowerCase()));
        } else {
            this.modalSelectedEntitiesFiltered = this.modalSelectedEntities.filter((selected) => selected.Name.toLowerCase().includes(event.toLowerCase()));
        }
    }

    addNewAdminNotificationInclusion(): void {
        this.adminNotificationInclusionService.getSelectOptions().subscribe((admins) => {
            this.modalOptionEntities = admins.filter((admin) => !this.adminInclusions.some((inclusion) => inclusion.OptionId === admin.Id));
            this.modalOptionsTotal = admins.length;
            this.modalSelectedEntities = this.adminInclusions;
            this.setFilteredEntities();
            this.modalEntityName = 'ADMIN NOTIFICATION INCLUSIONS';
            this.entityType = this.entityMap.admins;
            this.showModal = true;
        });
    }

    setFilteredEntities(): void {
        this.modalOptionEntitiesFiltered = [...this.modalOptionEntities];
        this.modalSelectedEntitiesFiltered = [...this.modalSelectedEntities];
    }

    toggleModal(): void {
        this.showModal = !this.showModal;
        this.modalOptionEntities = [];
    }

    saveEntity(evt: IMetaItem): void {
        // TODO: Id field missing. Make sure we can set it to 0 or null, or make create method take in an object without the ID field.
        const adminToInclude = ({
            AdminId: evt.Id,
            Archived: false,
        } as IEdiErrorCodeAdminNotification);
        this.ediErrorCodeAdminNotificationService.create(adminToInclude).subscribe((id) => {
            adminToInclude.Id = id;
            this.modalSelectedEntities.push(
                {
                    Archived: false,
                    Id: id,
                    Name: evt.Name,
                    OptionId: evt.Id,
                } as ISelectedItem,
            );
            this.sortModal(evt, true);
        });
    }

    sortModal(evt: IMetaItem | ISelectedItem, adding: boolean): void {
        if (adding) {
            this.modalSelectedEntities.sort(function (a, b): number {
                if (a.Name < b.Name) { return -1; }
                if (a.Name > b.Name) { return 1; }
                return 0;
            });
            this.modalOptionEntities = this.modalOptionEntities.filter((entity) => entity !== evt);
            this.setFilteredEntities();
        } else {
            this.modalOptionEntities.sort(function (a, b): number {
                if (a.Name < b.Name) { return -1; }
                if (a.Name > b.Name) { return 1; }
                return 0;
            });
            this.modalSelectedEntities = this.modalSelectedEntities.filter((entity) => entity !== evt);
            this.setFilteredEntities();
        }

    }

    deleteEntity(evt: ISelectedItem): void {
        const option: IMetaItem = {
            Id: evt.OptionId,
            Name: evt.Name,
        };

        this.ediErrorCodeAdminNotificationService.delete(evt.Id).subscribe(() => {
            this.modalOptionEntities.push(option);
            this.sortModal(evt, false);
            this.adminInclusions = this.modalSelectedEntities;
        });
    }

    selectErrorCode(errorCode: IEdiErrorCode): void {
        const form = this.form.controls.Form as UntypedFormGroup;
        this.selectedErrorCode = errorCode;
        form.controls.errorCode.setValue(errorCode.ErrorCode);
        form.controls.errorDescription.setValue(errorCode.Name);
    }

    clearForm(): void {
        this.form.controls.Form.get('errorCode').setValue(null);
        this.form.controls.Form.get('errorDescription').setValue(null);
        this.selectedErrorCode = null;
    }
}
