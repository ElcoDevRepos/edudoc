import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServiceCodeService } from '@common/services/service-code.service';
import { ServiceTypeService } from '@common/services/service-type.service';
import { IDiagnosisCode } from '@model/interfaces/diagnosis-code';
import { IDiagnosisCodeAssociation } from '@model/interfaces/diagnosis-code-association';
import { IServiceCode } from '@model/interfaces/service-code';
import { IServiceType } from '@model/interfaces/service-type';
import { ExtraSearchParams, IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import { DynamicField, DynamicFieldType, DynamicFieldTypes, IDynamicFieldType } from '@mt-ng2/dynamic-form';
import { SortDirection } from '@mt-ng2/entity-list-module';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { MtSearchFilterItem } from '@mt-ng2/search-filter-select-control';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { DiagnosisCodeAssociationService } from '../../services/diagnosiscodeassociation.service';

@Component({
    selector: 'app-diagnosis-associations-list',
    templateUrl: './diagnosis-associations-list.component.html',
})
export class DiagnosisAssociationsListComponent implements OnInit {
    @Input() diagnosisCode: IDiagnosisCode;
    @Input() canEdit: boolean;
    @Input() isAdding = false;

    serviceCodes: MtSearchFilterItem<IServiceCode>[];
    serviceTypes: IServiceType[];
    selectedServiceType: IServiceType;
    diagnosisCodeAssociations: IDiagnosisCodeAssociation[] = [];

    query = '';
    total: number;
    doubleClickIsDisabled = false;
    includeArchived = false;
    isEditing = false;
    isHovered: boolean;
     

    constructor(
        private diagnosisCodeAssociationService: DiagnosisCodeAssociationService,
        private serviceCodeService: ServiceCodeService,
        private serviceTypeService: ServiceTypeService,
        private notificationService: NotificationsService,
        private route: ActivatedRoute,
    ) {}

    ngOnInit(): void {
        this.isEditing = this.isAdding;
        forkJoin(this.serviceCodeService.getAll(), this.serviceTypeService.getAll()).subscribe((forkJoinReturns) => {
            const [serviceCodes, serviceTypes] = forkJoinReturns;
            // set the serviceCodes
            this.serviceCodes = serviceCodes.map((item) => {
                return new MtSearchFilterItem(item, false);
            });
            // set the serviceTypes
            this.serviceTypes = [...serviceTypes];
        });
        this.refreshAssociations();
    }

    getDiagnosisCodeAssociations(): void {
        const search = this.query;
        const _extraSearchParams: ExtraSearchParams[] = this.buildSearch();

        const searchEntity: IEntitySearchParams = {
            extraParams: _extraSearchParams,
            order: 'Id',
            orderDirection: SortDirection.Desc,
            query: search && search.length > 0 ? search : '',
            take: 9999,
        };

        const searchparams = new SearchParams(searchEntity);
        this.diagnosisCodeAssociationService.search(searchparams).subscribe((answer) => {
            this.diagnosisCodeAssociations = answer.body;
            this.total = +answer.headers.get('X-List-Count');
        });
    }

    private buildSearch(): ExtraSearchParams[] {
        const _extraSearchParams: ExtraSearchParams[] = [];

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'DiagnosisCodeId',
                value: this.route.snapshot.paramMap.get('diagnosisCodeId'),
            }),
        );

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'includeArchived',
                value: this.includeArchived ? '1' : '0',
            }),
        );

        return _extraSearchParams;
    }

    edit(): void {
        if (this.canEdit) {
            this.isEditing = true;
        }
    }

    cancelClick(): void {
        this.isEditing = false;
    }

    noAssociations(): boolean {
        return !this.diagnosisCodeAssociations || this.diagnosisCodeAssociations.length === 0;
    }

    addAssociation(): void {
        this.getSelectedServiceCodes().forEach((servicecode) => {
            const newAssociation = this.diagnosisCodeAssociationService.getEmptyDiagnosisCodeAssociation();

            newAssociation.ServiceCode = servicecode;
            newAssociation.ServiceType = this.selectedServiceType;

            if (this.diagnosisCode.Id === 0) {
                this.diagnosisCode.DiagnosisCodeAssociations.push(newAssociation);
                // Mimics this.getDiagnosisCodeAssociations() for unsaved diagnosiscode
                this.refreshAssociations();
            } else {
                this.formatDataForSave(newAssociation);
                this.saveAssociation(newAssociation);
                this.getDiagnosisCodeAssociations();
            }
        });

        this.clearSelectedOptions();
    }

    formatDataForSave(association: IDiagnosisCodeAssociation): void {
        association.DiagnosisCodeId = this.diagnosisCode.Id;

        association.ServiceCodeId = association.ServiceCode.Id;
        association.ServiceCode = null;

        association.ServiceTypeId = association.ServiceType.Id;
        association.ServiceType = null;
    }

    saveAssociation(association: IDiagnosisCodeAssociation): void {
        this.diagnosisCodeAssociationService
            .createWithFks(association)            .subscribe(() => {
                this.success();
            });
    }

    private success(): void {
        this.getDiagnosisCodeAssociations();
        this.notificationService.success('Diagnosis Code Associations saved successfully.');
    }

    clearSelectedOptions(): void {
        this.serviceCodes.map((item) => (item.Selected = false));
        this.selectedServiceType = null;
    }

    getArchivedField(): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: 'Include Archived',
            name: 'includeArchived',
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Checkbox,
            }),
            value: this.includeArchived,
        });
    }

    archiveDiagnosisCodeAssociation(diagnosisCodeAssociation: IDiagnosisCodeAssociation): void {
        if (diagnosisCodeAssociation.Id === 0) {
            this.diagnosisCode.DiagnosisCodeAssociations = this.diagnosisCode.DiagnosisCodeAssociations.filter(
                (dca) => dca !== diagnosisCodeAssociation,
            );
        } else {
            diagnosisCodeAssociation.Archived = !diagnosisCodeAssociation.Archived;
            this.diagnosisCodeAssociationService.update(diagnosisCodeAssociation).subscribe(() => {
                this.notificationService.success('Association Updated Successfully');
                this.getDiagnosisCodeAssociations();
            });
        }
    }

    private refreshAssociations(): void {
        if (this.diagnosisCode.Id === 0) {
            this.diagnosisCodeAssociations = this.diagnosisCode.DiagnosisCodeAssociations;
        } else {
            this.getDiagnosisCodeAssociations();
        }
    }

    getSelectedServiceCodes(): IServiceCode[] {
        return this.serviceCodes.filter((item) => item.Selected).map((item) => item.Item);
    }
}
