import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

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
import { IMessageFilterType } from '@model/interfaces/message-filter-type';
import { IMessageLink } from '@model/interfaces/message-link';
import { IProvider } from '@model/interfaces/provider';
import { IProviderTitle } from '@model/interfaces/provider-title';
import { ISchoolDistrict } from '@model/interfaces/school-district';
import { IServiceCode } from '@model/interfaces/service-code';
import { ITrainingType } from '@model/interfaces/training-type';
import { MessageLinkDynamicControlsPartial } from '@model/partials/message-link-partial.form-controls';
import { ISelectedItemsEvent, MtSearchFilterItem } from '@mt-ng2/search-filter-select-control';
import { MessageLinkDynamicConfig } from '../../message-link.dynamic-config';
import { MessageLinkService } from '../../services/message-link.service';

@Component({
    animations: [
        trigger('itemAnim', [
            transition(':enter', [style({ height: 0, opacity: 0 }), animate('500ms ease-out', style({ height: '*', opacity: 1 }))]),
        ]),
    ],
    selector: 'app-message-link-basic-info',
    templateUrl: './message-link-basic-info.component.html',
})
export class MessageLinkBasicInfoComponent implements OnInit, OnDestroy {
    messageLink: IMessageLink;
    @Input() canEdit: boolean;
    @Input() isProviderTraining: boolean;

    formRenderd = false;
    isHovered: boolean;
    formFactory: MessageLinkDynamicConfig<IMessageLink>;
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

    linkForm: UntypedFormGroup;
    abstractLinkControls: IExpandableObject;
    selectedFilterTypeId: number;
    messageFilterTypeEnums = MessageFilterTypeEnums;
    messageFilterTypes: IMessageFilterType[];
    mandatory: boolean;

    get isNewMessageLink(): boolean {
        return this.messageLink && this.messageLink.Id ? false : true;
    }

    get districtsSelected(): boolean {
        return this.filteredSchoolDistricts.some((x) => x.Selected);
    }

    constructor(
        private messageLinkService: MessageLinkService,
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
    ) {}

    ngOnDestroy(): void {
        this.messageLinkService.setMessageLink(this.messageLinkService.getEmptyMessageLink());
    }

    ngOnInit(): void {
        this.messageLinkService.getMessageLink().subscribe((messageDoc) => {
            this.formRenderd = false;
            this.messageLink = messageDoc;
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
                .map((p) => new MtSearchFilterItem(p, this.messageLink.EscId ? p.Id === this.messageLink.EscId : true));
            this.escs.unshift(this.messageService.getEmptySelectOption());
            this.schoolDistricts = schoolDistricts;
            this.filteredSchoolDistricts = schoolDistricts.map(
                (p) => new MtSearchFilterItem(p, this.messageLink.SchoolDistrictId ? p.Id === this.messageLink.SchoolDistrictId : true),
            );
            this.serviceCodes = serviceCodes;
            this.filteredServiceCodes = serviceCodes.map(
                (p) => new MtSearchFilterItem(p, this.messageLink.ServiceCodeId ? p.Id === this.messageLink.ServiceCodeId : true),
            );
            this.providerTitles = providerTitles;
            this.trainingTypes = trainingTypes;
            this.filteredProviderTitles = providerTitles.map(
                (p) => new MtSearchFilterItem(p, this.messageLink.ProviderTitleId ? p.Id === this.messageLink.ProviderTitleId : true),
            );
            this.providers = providers;
            this.filteredProviders = providers.map(
                (p) =>
                    new MtSearchFilterItem(
                        {
                            Id: p.Id,
                            Name: `${p.ProviderUser.LastName}, ${p.ProviderUser.FirstName}`,
                        },
                        this.messageLink.ProviderId ? p.Id === this.messageLink.ProviderId : true,
                    ),
            );
            this.noSelections = false;
            this.messageFilterTypes = messageFilterTypes;

            if (!this.isNewMessageLink) {
                const filterTypeId = this.messageLink.MessageFilterTypeId;
                let evtId = 0;
                switch (filterTypeId) {
                    case this.messageFilterTypeEnums.Esc:
                        evtId = this.messageLink.EscId;
                        break;
                    case this.messageFilterTypeEnums.SchoolDistrict:
                        evtId = this.messageLink.SchoolDistrictId;
                        break;
                    case this.messageFilterTypeEnums.ServiceCode:
                        evtId = this.messageLink.ServiceCodeId;
                        break;
                    case this.messageFilterTypeEnums.ProviderTitle:
                        evtId = this.messageLink.ProviderTitleId;
                        break;
                    case this.messageFilterTypeEnums.Provider:
                        evtId = this.messageLink.ProviderId;
                        break;
                    default:
                        break;
                }
                this.handleFilterSelections(this.messageLink.MessageFilterTypeId, {
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
        this.linkForm = this.formBuilder.group({
            MessageLink: this.formBuilder.group({}),
        });

        this.formFactory = new MessageLinkDynamicConfig<IMessageLink>(this.messageLink, null, null, null, null, null, null, null, null);

        this.abstractLinkControls = new MessageLinkDynamicControlsPartial(this.messageLink, {
            formGroup: 'MessageLink',
            trainingTypes: this.trainingTypes,
        }).Form;

        this.formRenderd = true;

        if (this.isProviderTraining) {
            const trainingTypeControl = this.abstractLinkControls.TrainingTypeId;
            // eslint-disable-next-line @typescript-eslint/unbound-method
            (trainingTypeControl.validation = [Validators.required]), (trainingTypeControl.validators = { required: true, showRequired: true });
        }
    }

    formSubmitted(form: UntypedFormGroup): void {
        if (form.valid && !this.noSelections) {
            this.createMessageLinks(form);
        } else if (this.noSelections) {
            this.notificationsService.error('No Selections');
        } else {
            markAllFormFieldsAsTouched(form);
            this.notificationsService.error('Save failed. Please check the form and try again.');
        }
    }

    createMessageLinks(form: FormGroup): void {
        this.getFilterType();
        const formMessageLink = form.value.MessageLink as IMessageLink;
        const allActions: Observable<object | number>[] = [];
        if (this.selectedFilterTypeId === this.messageFilterTypeEnums.Provider) {
            const providerIds = this.getSelectedFilters(this.filteredProviders);
            for (const id of providerIds) {
                const messageLink = this.messageLinkService.getEmptyMessageLink();
                this.formFactory.assignFormValues(messageLink, formMessageLink);
                messageLink.ProviderId = id;
                messageLink.MessageFilterTypeId = this.selectedFilterTypeId;
                allActions.push(this.saveMessageLinkCall(messageLink));
            }
        } else if (this.selectedFilterTypeId === this.messageFilterTypeEnums.ProviderTitle) {
            const providerTitleIds = this.getSelectedFilters(this.filteredProviderTitles);
            for (const id of providerTitleIds) {
                const messageLink = this.messageLinkService.getEmptyMessageLink();
                this.formFactory.assignFormValues(messageLink, formMessageLink);
                messageLink.ProviderTitleId = id;
                messageLink.MessageFilterTypeId = this.selectedFilterTypeId;
                allActions.push(this.saveMessageLinkCall(messageLink));
            }
        } else if (this.selectedFilterTypeId === this.messageFilterTypeEnums.ServiceCode) {
            const serviceCodeIds = this.getSelectedFilters(this.filteredServiceCodes);
            for (const id of serviceCodeIds) {
                const messageLink = this.messageLinkService.getEmptyMessageLink();
                this.formFactory.assignFormValues(messageLink, formMessageLink);
                messageLink.ServiceCodeId = id;
                messageLink.MessageFilterTypeId = this.selectedFilterTypeId;
                allActions.push(this.saveMessageLinkCall(messageLink));
            }
        } else if (this.selectedFilterTypeId === this.messageFilterTypeEnums.SchoolDistrict) {
            const schoolDistrictIds = this.getSelectedFilters(this.filteredSchoolDistricts);
            for (const id of schoolDistrictIds) {
                const messageLink = this.messageLinkService.getEmptyMessageLink();
                this.formFactory.assignFormValues(messageLink, formMessageLink);
                messageLink.SchoolDistrictId = id;
                messageLink.MessageFilterTypeId = this.selectedFilterTypeId;
                allActions.push(this.saveMessageLinkCall(messageLink));
            }
        } else {
            this.formFactory.assignFormValues(this.messageLink, formMessageLink);
            this.messageLink.MessageFilterTypeId = this.selectedFilterTypeId;
            allActions.push(this.saveMessageLinkCall(this.messageLink));
        }
        if (this.isNewMessageLink) {
            forkJoin(allActions).subscribe(() => {
                this.success();
            });
        } else {
            allActions.push(this.messageLinkService.delete(this.messageLink.Id));
            forkJoin(allActions).subscribe(() => {
                this.success();
            });
        }
    }

    private saveMessageLinkCall(messageLink: IMessageLink): Observable<number> {
        messageLink.Mandatory = this.isProviderTraining;
        return this.messageLinkService.create(messageLink);
    }

    private success(): void {
        this.messageLinkService.setMessageLink(this.messageLinkService.getEmptyMessageLink());
        this.notificationsService.success('Link saved successfully.');
    }

    trainingTypeUpdated(trainingTypeId: number): void {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        (this.abstractLinkControls.DueDate.validation = trainingTypeId === TrainingTypes.Updated ? [Validators.required] : null),
            (this.abstractLinkControls.DueDate.validators = trainingTypeId === TrainingTypes.Updated ? { required: true, showRequired: true } : null);
        this.showDueDate = trainingTypeId === TrainingTypes.Updated;
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
