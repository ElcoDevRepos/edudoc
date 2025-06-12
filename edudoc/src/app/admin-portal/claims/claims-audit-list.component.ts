import { ReturnReasonCategoryService } from '@admin/managed-list-items/managed-item-services/return-reason-category.service';
import { EncounterReasonForReturnService } from '@admin/my-reasons-for-return-management/services/my-reasons-for-return.service';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, Validators } from '@angular/forms';
import { DateTimeConverterService } from '@common/services/date-time-converter.service';
import { entityListModuleConfig } from '@common/shared.module';
import { EncounterStatuses } from '@model/enums/encounter-status.enum';
import { ICptCode } from '@model/interfaces/cpt-code';
import { IClaimAuditRequestDto } from '@model/interfaces/custom/claim-audit-request.dto';
import { IClaimAuditResponseDto } from '@model/interfaces/custom/claim-audit-response.dto';
import { ICptCodeWithMinutesDto, IEncounterResponseDto } from '@model/interfaces/custom/encounter-response.dto';
import { IEncounterStudentStatusesLogDto } from '@model/interfaces/custom/encounter-student-statuses-log.dto';
import { IEncounterReasonForReturn } from '@model/interfaces/encounter-reason-for-return';
import { IGoal } from '@model/interfaces/goal';
import { IMetaItem } from '@mt-ng2/base-service';
import { ExtraSearchParams, IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import {
    DynamicField,
    DynamicFieldType,
    DynamicFieldTypes,
    IDynamicFieldType,
    InputTypes,
    LabelPositions,
    SelectInputTypes
} from '@mt-ng2/dynamic-form';
import { IModalOptions } from '@mt-ng2/modal-module';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ClaimsAuditEntityListConfig } from './claims-audit.entity-list-config';
import { ClaimsAuditService } from './services/claims-audit.service';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-claims-audit-list',
    styles: [
        `
            p {
                white-space: pre-wrap;
            }
        `,
    ],
    templateUrl: './claims-audit-list.component.html',
})
export class ClaimsAuditComponent implements OnInit {
    claims: IClaimAuditResponseDto[];
    currentPage = 1;
    query = '';
    total: number;
    entityListConfig = new ClaimsAuditEntityListConfig();
    order = this.entityListConfig.getDefaultSortProperty();
    orderDirection: string = this.entityListConfig.getDefaultSortDirection();
    encounterStatuses = EncounterStatuses;
    modalOptions: IModalOptions = {
        customClass: {
            title: 'text-center',
        },
        showCloseButton: true,
        showConfirmButton: false,
        width: '50%',
    };
    showEsignModal = false;
    showStatusesModal = false;
    showAbandonedNotesModal = false;
    encounterIdForModal: number;
    encounterStudentStatusesForModal: IEncounterStudentStatusesLogDto[];
    doubleClickDisabled = false;
    abandonedNotesValue = this.getAbandonedNotesField().value;

    // Modal parameters
    reasonForReturnControl: AbstractControl;
    reasonForAbandonmentControl: AbstractControl;
    myReasons: IEncounterReasonForReturn[];
    reasonForReturnCategories: IMetaItem[];
    selectedReasons: IEncounterReasonForReturn[];
    reasonSelected: IEncounterReasonForReturn;
    selectedCategoryId: number;

    constructor(
        private claimsAuditService: ClaimsAuditService,
        private notificationService: NotificationsService,
        private reasonsForReturnService: EncounterReasonForReturnService,
        private reasonsForReturnCategoryService: ReturnReasonCategoryService,
        private dateTimeConverter: DateTimeConverterService,
    ) {}

    ngOnInit(): void {
        forkJoin([this.reasonsForReturnService.getByUserId(), this.reasonsForReturnCategoryService.getAll()]).subscribe(
            ([myReasons, reasonForReturnCategories]) => {
                this.myReasons = myReasons;
                this.reasonForReturnCategories = reasonForReturnCategories.map(
                    (category) =>
                        ({
                            Id: category.Id,
                            Name: category.Name,
                        }),
                );
                this.getClaims();
            },
        );
    }

    toggleEsignModal(encounterId?: number): void {
        this.encounterIdForModal = encounterId;
        this.showEsignModal = !this.showEsignModal;
    }

    toggleStatusModal(encounterStudentStatuses?: IEncounterStudentStatusesLogDto[]): void {
        this.encounterStudentStatusesForModal = encounterStudentStatuses;
        this.showStatusesModal = !this.showStatusesModal;
    }

    toggleAbandonedNotesModal(encounterStudentId?: number): void {
        this.encounterIdForModal = encounterStudentId;
        this.showAbandonedNotesModal = !this.showAbandonedNotesModal;
    }

    getReasonForReturnCategoryField(): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: 'Return Category',
            name: 'reasonForReturnCategory',
            options: this.reasonForReturnCategories,
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Select,
                inputType: SelectInputTypes.Dropdown,
            }),
            validation: [],
            validators: {},
            value: null,
        });
    }

    handleCategorySelection(evt: number): void {
        this.selectedCategoryId = evt;
        this.filterSelectedReasons();
    }

    filterSelectedReasons(): void {
        this.reasonSelected = null;
        this.selectedReasons = this.myReasons.filter((reason) => reason.ReturnReasonCategoryId === this.selectedCategoryId);
    }

    insertReasonText(selectedReason): void {
        if (selectedReason) {
            this.reasonForReturnControl.setValue(selectedReason.Name);
        }
    }

    getReasonForReturnField(): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: '',
            labelPosition: { position: LabelPositions.Hidden, colsForLabel: null },
            name: 'reasonForReturn',
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Input,
                inputType: InputTypes.Textarea,
            }),
            // eslint-disable-next-line @typescript-eslint/unbound-method
            validation: [Validators.required, Validators.minLength(1), Validators.maxLength(250)],
            validators: { required: true, maxlength: 250, minlength: 250 },
            value: null,
        });
    }

    getAbandonedNotesField(): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: '',
            labelPosition: { position: LabelPositions.Hidden, colsForLabel: null },
            name: 'reasonForAbandonment',
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Input,
                inputType: InputTypes.Textarea,
            }),
            // eslint-disable-next-line @typescript-eslint/unbound-method
            validation: [Validators.minLength(1), Validators.maxLength(250)],
            validators: { maxlength: 250, minlength: 250 },
            value: null,
        });
    }

    getClaims(): void {
        const search = this.query;
        const _extraSearchParams: ExtraSearchParams[] = [];
        const searchEntity: IEntitySearchParams = {
            extraParams: _extraSearchParams,
            order: this.order,
            orderDirection: this.orderDirection,
            query: search && search.length > 0 ? search : '',
            skip: (this.currentPage - 1) * entityListModuleConfig.itemsPerPage,
            take: entityListModuleConfig.itemsPerPage,
        };

        const searchparams = new SearchParams(searchEntity);
        this.claimsAuditService.getClaimsForAudit(searchparams).subscribe((answer) => {
            this.claims = answer.body.map((response) => {
                response.StartDateTime = this.dateTimeConverter.appendTimeSpanToDate(response.EncounterDate, response.StartTime);
                response.EndDateTime = this.dateTimeConverter.appendTimeSpanToDate(response.EncounterDate, response.EndTime);
                response.EncounterDate = new Date(new DatePipe('en-Us').transform(response.EncounterDate, 'yyyy-MM-ddThh:mm:ss', 'UTC'));
                return response;
            });
            this.total = +answer.headers.get('X-List-Count');
        });
    }

    updateClaimStatus(encounterStudentId: number, status: EncounterStatuses): void {
        // handle existing student save
        // TODO: This is missing the ReasonForAbandonment field. Why?
        const request = {
            EncounterStudentId: encounterStudentId,
            ReasonForReturn: this.reasonForReturnControl ? this.reasonForReturnControl.value : null,
            StatusId: status,
        } as IClaimAuditRequestDto;
        this.doubleClickDisabled = true;
        this.claimsAuditService
            .updateStatus(request)
            .pipe(finalize(() => (this.doubleClickDisabled = false)))
            .subscribe(() => {
                this.success();
                this.getClaims();
                if (this.showEsignModal) {
                    this.toggleEsignModal();
                }
            });
    }

    convertItemsToCommaSeparatedList(items: IGoal[] & ICptCode[]): string {
        if (!items || !items.length) {
            return '';
        }
        return items.map((g) => g.Description).join(', ');
    }

    convertCptCodesToCommaSeparatedList(items: ICptCodeWithMinutesDto[]): string {
        if (!items || !items.length) {
            return '';
        }
        return items.length > 1 ? items.map((c) => `${c.CptCode.Description}: ${c.Minutes} mins`).join(', \r\n')
            : items.map((c) => c.CptCode.Description).join('');
    }

    success(): void {
        this.notificationService.success('Claim status updated successfully.');
    }

    search(query: string): void {
        this.query = query;
        this.getClaims();
    }

    encounterStatusLogSelected(encounterStudent: IEncounterResponseDto): void {
        this.toggleStatusModal(encounterStudent.EncounterStudentStatuses);
    }
}
