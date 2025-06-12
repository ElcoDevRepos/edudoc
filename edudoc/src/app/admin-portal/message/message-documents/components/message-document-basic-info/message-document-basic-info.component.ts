import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { saveAs } from 'file-saver';
import { forkJoin, Observable } from 'rxjs';

import { markAllFormFieldsAsTouched } from '@mt-ng2/common-functions';
import { NotificationsService } from '@mt-ng2/notifications-module';

import { EscService } from '@admin/escs/services/esc.service';
import { MessageService } from '@admin/message/messages/services/message.service';
import { ProviderTitleService } from '@admin/provider-titles/services/provider-title.service';
import { ProviderService } from '@admin/providers/provider.service';
import { SchoolDistrictService } from '@admin/school-districts/services/schooldistrict.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { MessageFilterTypeService } from '@common/services/message-filter-type.service';
import { ServiceCodeService } from '@common/services/service-code.service';
import { TrainingTypeService } from '@common/services/training-types.service';
import { MessageFilterTypeEnums } from '@model/enums/message-filter-types.enum';
import { TrainingTypes } from '@model/enums/training-types.enum';
import { IExpandableObject } from '@model/expandable-object';
import { IMessageDocument } from '@model/interfaces/message-document';
import { IMessageFilterType } from '@model/interfaces/message-filter-type';
import { IProvider } from '@model/interfaces/provider';
import { IProviderTitle } from '@model/interfaces/provider-title';
import { ISchoolDistrict } from '@model/interfaces/school-district';
import { IServiceCode } from '@model/interfaces/service-code';
import { ITrainingType } from '@model/interfaces/training-type';
import { MessageDocumentDynamicControlsPartial } from '@model/partials/message-document-partial.form-controls';
import { IDocument } from '@mt-ng2/entity-components-documents';
import { ISelectedItemsEvent, MtSearchFilterItem } from '@mt-ng2/search-filter-select-control';
import { FileItem } from 'ng2-file-upload';
import { MessageDocumentDynamicConfig } from '../../message-document.dynamic-config';
import { MessageDocumentService } from '../../services/message-document.service';

@Component({
    animations: [
        trigger('itemAnim', [
            transition(':enter', [style({ height: 0, opacity: 0 }), animate('500ms ease-out', style({ height: '*', opacity: 1 }))]),
        ]),
    ],
    selector: 'app-message-document-basic-info',
    templateUrl: './message-document-basic-info.component.html',
})
export class MessageDocumentBasicInfoComponent implements OnInit, OnDestroy {
    messageDocument: IMessageDocument;
    @Input() canEdit: boolean;
    @Input() isProviderTraining: boolean;

    formRenderd = false;
    isHovered: boolean;
    formFactory: MessageDocumentDynamicConfig<IMessageDocument>;
    doubleClickIsDisabled = false;

    escs: MtSearchFilterItem[];
    schoolDistricts: ISchoolDistrict[];
    filteredSchoolDistricts: MtSearchFilterItem[];
    serviceCodes: IServiceCode[];
    filteredServiceCodes: MtSearchFilterItem[];
    providerTitles: IProviderTitle[];
    filteredProviderTitles: MtSearchFilterItem[];
    providers: IProvider[];
    filteredProviders: MtSearchFilterItem[];
    trainingTypes: ITrainingType[];
    showDueDate = false;
    noSelections = true;

    documentForm: UntypedFormGroup;
    abstractDocumentControls: IExpandableObject;
    selectedFilterTypeId: number;
    messageFilterTypeEnums = MessageFilterTypeEnums;
    messageFilterTypes: IMessageFilterType[];
    mandatory: boolean;

    allowedMimeType: string[] = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ];
    fileData: FormData;
    hasFileDataError = false;
    showUploadArea = false;
    documentArray: IDocument[] = [];
    showFileList = false;

    get isNewMessageDocument(): boolean {
        return this.messageDocument && this.messageDocument.Id ? false : true;
    }

    get districtsSelected(): boolean {
        return this.filteredSchoolDistricts.some((x) => x.Selected);
    }

    constructor(
        private messageDocumentService: MessageDocumentService,
        private messageService: MessageService,
        private escService: EscService,
        private trainingTypeService: TrainingTypeService,
        private messageFilterTypeService: MessageFilterTypeService,
        private providerService: ProviderService,
        private providerTitleService: ProviderTitleService,
        private schoolDistrictService: SchoolDistrictService,
        private serviceCodeService: ServiceCodeService,
        private notificationsService: NotificationsService,
        private formBuilder: UntypedFormBuilder,
        private cdr: ChangeDetectorRef,
    ) {}

    ngOnDestroy(): void {
        this.messageDocumentService.setMessageDocument(this.messageDocumentService.getEmptyMessageDocument());
        this.documentArray = [];
    }

    ngOnInit(): void {
        this.messageDocumentService.getMessageDocument().subscribe((messageDoc) => {
            this.formRenderd = false;
            this.documentArray = [];
            this.messageDocument = messageDoc;
            if (this.messageDocument.FilePath.length > 0) {
                this.documentArray.push({
                    DateUpload: this.messageDocument.DateCreated,
                    FilePath: this.messageDocument.FilePath,
                    Id: this.messageDocument.Id,
                    Name: this.messageDocument.FileName,
                });
                this.showFileList = true;
            } else {
                this.showFileList = false;
            }
            this.setConfig();
        });
    }

    setConfig(): void {
        forkJoin(
            this.escService.getSelectOptions(),
            this.schoolDistrictService.getAllForMessages(),
            this.serviceCodeService.getItems(),
            this.providerTitleService.getAllForMessages(),
            this.providerService.getAllForMessages(),
            this.messageFilterTypeService.getItems(),
            this.trainingTypeService.getItems(),
        ).subscribe((answers) => {
            const [escs, schoolDistricts, serviceCodes, providerTitles, providers, messageFilterTypes, trainingTypes] = answers;
            this.escs = escs
                .filter((item) => !item.Archived)
                .sort(function (a, b): number {
                    if (a.Name < b.Name) {
                        return -1;
                    }
                    if (a.Name > b.Name) {
                        return 1;
                    }
                    return 0;
                })
                .map((p) => new MtSearchFilterItem(p, this.messageDocument.EscId ? p.Id === this.messageDocument.EscId : true));
            this.escs.unshift(this.messageService.getEmptySelectOption());
            this.schoolDistricts = schoolDistricts;
            this.filteredSchoolDistricts = schoolDistricts.map(
                (p) => new MtSearchFilterItem(p, this.messageDocument.SchoolDistrictId ? p.Id === this.messageDocument.SchoolDistrictId : true),
            );
            this.serviceCodes = serviceCodes;
            this.filteredServiceCodes = serviceCodes.map(
                (p) => new MtSearchFilterItem(p, this.messageDocument.ServiceCodeId ? p.Id === this.messageDocument.ServiceCodeId : true),
            );
            this.providerTitles = providerTitles;
            this.trainingTypes = trainingTypes;
            this.filteredProviderTitles = providerTitles.map(
                (p) => new MtSearchFilterItem(p, this.messageDocument.ProviderTitleId ? p.Id === this.messageDocument.ProviderTitleId : true),
            );
            this.providers = providers;
            this.filteredProviders = providers.map(
                (p) =>
                    new MtSearchFilterItem(
                        {
                            Id: p.Id,
                            Name: `${p.ProviderUser.LastName}, ${p.ProviderUser.FirstName}`,
                        },
                        this.messageDocument.ProviderId ? p.Id === this.messageDocument.ProviderId : true,
                    ),
            );
            this.noSelections = false;
            this.messageFilterTypes = messageFilterTypes;

            if (!this.isNewMessageDocument) {
                const filterTypeId = this.messageDocument.MessageFilterTypeId;
                let evtId = 0;
                switch (filterTypeId) {
                    case this.messageFilterTypeEnums.Esc:
                        evtId = this.messageDocument.EscId;
                        break;
                    case this.messageFilterTypeEnums.SchoolDistrict:
                        evtId = this.messageDocument.SchoolDistrictId;
                        break;
                    case this.messageFilterTypeEnums.ServiceCode:
                        evtId = this.messageDocument.ServiceCodeId;
                        break;
                    case this.messageFilterTypeEnums.ProviderTitle:
                        evtId = this.messageDocument.ProviderTitleId;
                        break;
                    case this.messageFilterTypeEnums.Provider:
                        evtId = this.messageDocument.ProviderId;
                        break;
                    default:
                        break;
                }
                this.handleFilterSelections(this.messageDocument.MessageFilterTypeId, {
                    selectedItems: [
                        {
                            Id: evtId,
                            Name: '',
                        },
                    ],
                });
            }
            this.buildForm();
        });
    }

    buildForm(): void {
        this.documentForm = this.formBuilder.group({
            MessageDocument: this.formBuilder.group({}),
        });

        this.formFactory = new MessageDocumentDynamicConfig<IMessageDocument>(this.messageDocument, null, null, null, null, null, null, null, null);

        this.abstractDocumentControls = new MessageDocumentDynamicControlsPartial(this.messageDocument, {
            formGroup: 'MessageDocument',
            trainingTypes: this.trainingTypes,
        }).Form;

        this.showUploadArea = this.isNewMessageDocument;
        this.formRenderd = true;

        if (this.isProviderTraining) {
            const trainingTypeControl = this.abstractDocumentControls.TrainingTypeId;
            // eslint-disable-next-line @typescript-eslint/unbound-method
            (trainingTypeControl.validation = [Validators.required]), (trainingTypeControl.validators = { required: true, showRequired: true });
        }
    }

    formSubmitted(form: UntypedFormGroup): void {
        this.hasFileDataError = !((this.fileData && this.isNewMessageDocument) || !this.isNewMessageDocument);
        if (form.valid && !this.hasFileDataError && !this.noSelections) {
            this.createMessageDocuments(form);
        } else if (this.noSelections) {
            this.notificationsService.error('No Selections');
        } else {
            markAllFormFieldsAsTouched(form);
            this.notificationsService.error(
                !this.hasFileDataError
                    ? 'Save failed. Please check the form and try again.'
                    : 'Save failed. Please check the uploaded document and try again.',
            );
        }
    }

    createMessageDocuments(form: FormGroup): void {
        this.getFilterType();
        const allActions: Observable<number>[] = [];
        if (this.selectedFilterTypeId === this.messageFilterTypeEnums.Provider) {
            const providerIds = this.getSelectedFilters(this.filteredProviders);
            for (const id of providerIds) {
                let messageDocument = this.messageDocumentService.getEmptyMessageDocument();
                messageDocument = this.patchValue(messageDocument, form);
                messageDocument.ProviderId = id;
                messageDocument.MessageFilterTypeId = this.selectedFilterTypeId;
                allActions.push(this.saveMessageDocumentCall(messageDocument));
            }
        } else if (this.selectedFilterTypeId === this.messageFilterTypeEnums.ProviderTitle) {
            const providerTitleIds = this.getSelectedFilters(this.filteredProviderTitles);
            for (const id of providerTitleIds) {
                let messageDocument = this.messageDocumentService.getEmptyMessageDocument();
                messageDocument = this.patchValue(messageDocument, form);
                messageDocument.ProviderTitleId = id;
                messageDocument.MessageFilterTypeId = this.selectedFilterTypeId;
                allActions.push(this.saveMessageDocumentCall(messageDocument));
            }
        } else if (this.selectedFilterTypeId === this.messageFilterTypeEnums.ServiceCode) {
            const serviceCodeIds = this.getSelectedFilters(this.filteredServiceCodes);
            for (const id of serviceCodeIds) {
                let messageDocument = this.messageDocumentService.getEmptyMessageDocument();
                messageDocument = this.patchValue(messageDocument, form);
                messageDocument.ServiceCodeId = id;
                messageDocument.MessageFilterTypeId = this.selectedFilterTypeId;
                allActions.push(this.saveMessageDocumentCall(messageDocument));
            }
        } else if (this.selectedFilterTypeId === this.messageFilterTypeEnums.SchoolDistrict) {
            const schoolDistrictIds = this.getSelectedFilters(this.filteredSchoolDistricts);
            for (const id of schoolDistrictIds) {
                let messageDocument = this.messageDocumentService.getEmptyMessageDocument();
                messageDocument = this.patchValue(messageDocument, form);
                messageDocument.SchoolDistrictId = id;
                messageDocument.MessageFilterTypeId = this.selectedFilterTypeId;
                allActions.push(this.saveMessageDocumentCall(messageDocument));
            }
        } else {
            this.messageDocument = this.patchValue(this.messageDocument, form);
            this.messageDocument.MessageFilterTypeId = this.selectedFilterTypeId;
            allActions.push(this.saveMessageDocumentCall(this.messageDocument));
        }
        if (this.isNewMessageDocument) {
            forkJoin(allActions).subscribe((answers) => {
                const uploadActions: Observable<number>[] = [];
                for (const answer of answers) {
                    this.messageDocument.Id = answer;
                    uploadActions.push(this.messageDocumentService.upload(this.messageDocument.Id, this.fileData));
                }
                forkJoin(uploadActions).subscribe(() => {
                    this.success();
                });
            });
        } else {
            this.messageDocument.Archived = true;
            forkJoin([this.messageDocumentService.update(this.messageDocument), ...allActions]).subscribe(([_, ...answers]) => {
                const uploadActions: Observable<number>[] = [];
                for (const answer of answers) {
                    if (answer && this.fileData) {
                        this.messageDocument.Id = answer;
                        uploadActions.push(this.messageDocumentService.upload(this.messageDocument.Id, this.fileData));
                    }
                }
                this.success();
                forkJoin(uploadActions).subscribe();
            });
        }
    }

    private patchValue(messageDocument: IMessageDocument, form: FormGroup): IMessageDocument {
        this.formFactory.assignFormValues(messageDocument, form.value.MessageDocument as IMessageDocument);
        messageDocument.FilePath = this.documentArray.length ? this.documentArray[0].FilePath : '';
        messageDocument.FileName = this.documentArray.length ? this.documentArray[0].Name : '';
        messageDocument.Archived = this.messageDocument.Id === 0;
        return messageDocument;
    }

    private saveMessageDocumentCall(messageDocument: IMessageDocument): Observable<number> {
        messageDocument.Mandatory = this.isProviderTraining;
        return this.messageDocumentService.create(messageDocument);
    }

    onWhenAddingFileFailed(error: string): void {
        this.notificationsService.error(error);
    }

    onAddDocument(file: FileItem): void {
        this.hasFileDataError = false;
        this.fileData = new FormData();
        this.fileData.append('file', file._file, file._file.name);
        this.showFileList = true;
        this.documentArray = [];
        this.documentArray.push({
            DateUpload: new Date(),
            FilePath: file._file.name,
            Id: 0,
            Name: file._file.name,
        });
        this.showUploadArea = this.isNewMessageDocument;
    }

    editExistingFile(): void {
        this.showFileList = false;
    }

    download(): void {
        this.messageDocumentService.download(this.messageDocument).subscribe((resultBlob: Blob) => {
            const fileContents = new Blob([resultBlob], {
                type: 'application/octet-stream',
            });
            saveAs(fileContents, this.messageDocument.FileName);
        });
    }

    private success(): void {
        this.messageDocumentService.setMessageDocument(this.messageDocumentService.getEmptyMessageDocument());
        this.notificationsService.success('Document saved successfully.');
    }

    trainingTypeUpdated(trainingTypeId: number): void {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        (this.abstractDocumentControls.DueDate.validation = trainingTypeId === TrainingTypes.Updated ? [Validators.required] : null),
            (this.abstractDocumentControls.DueDate.validators =
                trainingTypeId === TrainingTypes.Updated ? { required: true, showRequired: true } : null);
        this.showDueDate = trainingTypeId === TrainingTypes.Updated;
        this.cdr.detectChanges();
    }

    private handleFilterSelections(filterTypeId: number, evt: ISelectedItemsEvent): void {
        this.noSelections = !evt.selectedItems.length;

        switch (filterTypeId) {
            case this.messageFilterTypeEnums.Esc:
                this.filteredSchoolDistricts = this.schoolDistricts
                    .filter(
                        (sd) =>
                            (evt.selectedItems.some((x) => x.Id === null) && !sd.EscSchoolDistricts.length) ||
                            sd.EscSchoolDistricts.some((esd) => evt.selectedItems.map((s) => s.Id).includes(esd.EscId)),
                    )
                    .map((p) => new MtSearchFilterItem(p, true));

                this.filterProviders();
                break;
            case this.messageFilterTypeEnums.SchoolDistrict:
                this.filterProviders();
                break;
            case this.messageFilterTypeEnums.ServiceCode:
                this.filteredProviderTitles = this.providerTitles
                    .filter((pt) => evt.selectedItems.map((s) => s.Id).includes(pt.ServiceCodeId))
                    .map((p) => new MtSearchFilterItem(p, true));
                this.filterProviders();
                break;
            case this.messageFilterTypeEnums.ProviderTitle:
                this.filterProviders();
                break;
            default:
                break;
        }
    }

    private filterProviders(): void {
        const escIds: number[] = this.getSelectedFilters(this.escs);
        const districtIds: number[] = this.getSelectedFilters(this.filteredSchoolDistricts);
        const serviceCodeIds: number[] = this.getSelectedFilters(this.filteredServiceCodes);
        const providerTitleIds: number[] = this.getSelectedFilters(this.filteredProviderTitles);

        this.filteredProviders = this.providers
            .filter(
                (p) =>
                    p.ProviderEscAssignments.some((pea) => escIds.includes(pea.EscId)) &&
                    p.ProviderEscAssignments.some((pea) =>
                        pea.ProviderEscSchoolDistricts.some((pesd) => districtIds.includes(pesd.SchoolDistrictId)),
                    ) &&
                    serviceCodeIds.includes(p.ProviderTitle.ServiceCodeId) &&
                    providerTitleIds.includes(p.TitleId),
            )
            .map(
                (p) =>
                    new MtSearchFilterItem(
                        {
                            Id: p.Id,
                            Name: `${p.ProviderUser.LastName}, ${p.ProviderUser.FirstName}`,
                        },
                        true,
                    ),
            );
    }

    private getSelectedFilters(filterObj: MtSearchFilterItem[]): number[] {
        return filterObj.filter((item) => item.Selected).map((item) => item.Item.Id);
    }

    private getFilterType(): void {
        if (this.filteredProviders.some((p) => !p.Selected)) {
            this.selectedFilterTypeId = this.messageFilterTypeEnums.Provider;
        } else if (this.filteredProviderTitles.some((p) => !p.Selected)) {
            this.selectedFilterTypeId = this.messageFilterTypeEnums.ProviderTitle;
        } else if (this.filteredServiceCodes.some((p) => !p.Selected)) {
            this.selectedFilterTypeId = this.messageFilterTypeEnums.ServiceCode;
        } else if (this.filteredSchoolDistricts.some((p) => !p.Selected)) {
            this.selectedFilterTypeId = this.messageFilterTypeEnums.SchoolDistrict;
        } else if (this.escs.some((p) => !p.Selected)) {
            this.selectedFilterTypeId = this.messageFilterTypeEnums.Esc;
        } else {
            this.selectedFilterTypeId = this.messageFilterTypeEnums.All;
        }
    }
}
