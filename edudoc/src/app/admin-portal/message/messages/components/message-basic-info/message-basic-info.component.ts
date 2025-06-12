import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';
import { debounceTime, finalize, map } from 'rxjs/operators';

import { EscService } from '@admin/escs/services/esc.service';
import { ProviderTitleService } from '@admin/provider-titles/services/provider-title.service';
import { ProviderService } from '@admin/providers/provider.service';
import { SchoolDistrictService } from '@admin/school-districts/services/schooldistrict.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { SafePipe } from '@common/safe-pipe';
import { MessageFilterTypeService } from '@common/services/message-filter-type.service';
import { ServiceCodeService } from '@common/services/service-code.service';
import { MessageFilterTypeEnums } from '@model/enums/message-filter-types.enum';
import { IExpandableObject } from '@model/expandable-object';
import { ILinkSelectorDTO } from '@model/interfaces/custom/link-selector.dto';
import { IMessage } from '@model/interfaces/message';
import { IProvider } from '@model/interfaces/provider';
import { IProviderTitle } from '@model/interfaces/provider-title';
import { ISchoolDistrict } from '@model/interfaces/school-district';
import { IServiceCode } from '@model/interfaces/service-code';
import { MessageDynamicControlsPartial } from '@model/partials/message-partial.form-controls';
import { AuthService } from '@mt-ng2/auth-module';
import { markAllFormFieldsAsTouched } from '@mt-ng2/common-functions';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { ISelectedItemsEvent, MtSearchFilterItem } from '@mt-ng2/search-filter-select-control';
import { ISelectionChangedEvent, VirtualTypeAheadGetItemsFunction } from '@mt-ng2/type-ahead-control';
import { IWysiwygComponentConfig } from '@mt-ng2/wysiwyg-control';
import { MessageDynamicConfig } from '../../message.dynamic-config';
import { MessageService } from '../../services/message.service';

@Component({
    animations: [
        trigger('itemAnim', [
            transition(':enter', [style({ height: 0, opacity: 0 }), animate('500ms ease-out', style({ height: '*', opacity: 1 }))]),
        ]),
    ],
    selector: 'app-message-basic-info',
    templateUrl: './message-basic-info.component.html',
})
export class MessageBasicInfoComponent implements OnInit, OnDestroy {
    message: IMessage;
    @Input() canEdit: boolean;

    formRenderd = false;
    isHovered: boolean;
    formFactory: MessageDynamicConfig<IMessage>;
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
    noSelections = true;

    messageForm: UntypedFormGroup;
    abstractMessageControls: IExpandableObject;
    selectedFilterTypeId: number;
    messageFilterTypeEnums = MessageFilterTypeEnums;
    isLoginMessage = false;

    noteWysiwygConfig: IWysiwygComponentConfig = {
        //toolbar: ['bold', 'italic', 'underline', 'strike', 'link', 'bullet-list', 'align', 'font-size'],
        height: 400, // in pixels
    };

    getLinks: VirtualTypeAheadGetItemsFunction = this.getLinksFunction.bind(this);
    text: string;

    get isNewMessage(): boolean {
        return this.message && this.message.Id ? false : true;
    }

    get districtsSelected(): boolean {
        return this.filteredSchoolDistricts.some((x) => x.Selected);
    }

    constructor(
        private messageService: MessageService,
        private escService: EscService,
        private messageFilterTypeService: MessageFilterTypeService,
        private providerService: ProviderService,
        private providerTitleService: ProviderTitleService,
        private schoolDistrictService: SchoolDistrictService,
        private serviceCodeService: ServiceCodeService,
        private notificationsService: NotificationsService,
        private formBuilder: UntypedFormBuilder,
        private SafePipe: SafePipe,
        private authService: AuthService,
    ) {}

    ngOnDestroy(): void {
        this.messageService.setMessage(this.messageService.getEmptyMessage());
    }

    ngOnInit(): void {
        this.messageService.getMessage().subscribe((messageDoc) => {
            this.formRenderd = false;
            this.message = messageDoc;
            this.SafePipe.transform(this.message.Body, 'html');
            this.text = this.message.Body;
            const user = this.authService.currentUser.getValue();
            if (user.Id) {
                this.setConfig();
            }
        });
    }

    setConfig(): void {
        forkJoin(
            this.escService.getSelectOptions(),
            this.schoolDistrictService.getAllForMessages(),
            this.serviceCodeService.getItems(),
            this.providerTitleService.getAllForMessages(),
            this.providerService.getAllForMessages(),
        ).subscribe((answers) => {
            const [escs, schoolDistricts, serviceCodes, providerTitles, providers] = answers;
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
                .map((p) => new MtSearchFilterItem(p, this.message.EscId ? p.Id === this.message.EscId : true));
            this.escs.unshift(this.messageService.getEmptySelectOption());
            this.schoolDistricts = schoolDistricts;
            this.filteredSchoolDistricts = schoolDistricts.map(
                (p) => new MtSearchFilterItem(p, this.message.SchoolDistrictId ? p.Id === this.message.SchoolDistrictId : true),
            );
            this.serviceCodes = serviceCodes;
            this.filteredServiceCodes = serviceCodes.map(
                (p) => new MtSearchFilterItem(p, this.message.ServiceCodeId ? p.Id === this.message.ServiceCodeId : true),
            );
            this.providerTitles = providerTitles;
            this.filteredProviderTitles = providerTitles.map(
                (p) => new MtSearchFilterItem(p, this.message.ProviderTitleId ? p.Id === this.message.ProviderTitleId : true),
            );
            this.providers = providers;
            this.filteredProviders = providers.map(
                (p) =>
                    new MtSearchFilterItem(
                        {
                            Id: p.Id,
                            Name: `${p.ProviderUser.LastName}, ${p.ProviderUser.FirstName}`,
                        },
                        this.message.ProviderId ? p.Id === this.message.ProviderId : true,
                    ),
            );
            this.noSelections = false;
            if (!this.isNewMessage) {
                const filterTypeId = this.message.MessageFilterTypeId;
                let evtId = 0;
                switch (filterTypeId) {
                    case this.messageFilterTypeEnums.Esc:
                        evtId = this.message.EscId;
                        break;
                    case this.messageFilterTypeEnums.SchoolDistrict:
                        evtId = this.message.SchoolDistrictId;
                        break;
                    case this.messageFilterTypeEnums.ServiceCode:
                        evtId = this.message.ServiceCodeId;
                        break;
                    case this.messageFilterTypeEnums.ProviderTitle:
                        evtId = this.message.ProviderTitleId;
                        break;
                    case this.messageFilterTypeEnums.Provider:
                        evtId = this.message.ProviderId;
                        break;
                    default:
                        break;
                }
                this.handleFilterSelections(this.message.MessageFilterTypeId, {
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

    private getLinksFunction(searchText: string): Observable<IMessage[]> {
        return this.messageService
            .searchLinks({
                query: searchText,
            })
            .pipe(
                debounceTime(300),
                map((resp) => resp.body),
            );
    }

    handleLinkSelection(event: ISelectionChangedEvent): void {
        if (event.selection) {
            const selBox = document.createElement('textarea');
            selBox.style.position = 'fixed';
            selBox.style.left = '0';
            selBox.style.top = '0';
            selBox.style.opacity = '0';
            selBox.value = (<ILinkSelectorDTO>event.selection).Link;
            document.body.appendChild(selBox);
            selBox.focus();
            selBox.select();
            document.execCommand('copy');
            document.body.removeChild(selBox);
            this.copySuccess();
        }
    }

    buildForm(): void {
        this.messageForm = this.formBuilder.group({
            Message: this.formBuilder.group({}),
        });

        this.formFactory = new MessageDynamicConfig<IMessage>(this.message, null, null, null, null, null, null, null, null);

        this.abstractMessageControls = new MessageDynamicControlsPartial(this.message, { formGroup: 'Message' }).Form;

        this.formRenderd = true;
    }

    formSubmitted(form: UntypedFormGroup): void {
        if (form.valid && !this.noSelections) {
            this.createMessages(form);
        } else if (this.noSelections) {
            this.notificationsService.error('No Selections');
        } else {
            markAllFormFieldsAsTouched(form);
            this.notificationsService.error('Save failed. Please check the form and try again.');
        }
    }

    createMessages(form: FormGroup): void {
        this.getFilterType();
        const allActions: Observable<object | number>[] = [];
        const formMessage = form.value.Message as IMessage;

        if (this.selectedFilterTypeId === this.messageFilterTypeEnums.Provider) {
            const providerIds = this.getSelectedFilters(this.filteredProviders);
            for (const id of providerIds) {
                const message = this.messageService.getEmptyMessage();
                this.formFactory.assignFormValues(message, formMessage);
                message.Body = this.decodeHtml(this.text);
                message.ProviderId = id;
                message.MessageFilterTypeId = this.selectedFilterTypeId;
                allActions.push(this.saveMessageCall(message));
            }
        } else if (this.selectedFilterTypeId === this.messageFilterTypeEnums.ProviderTitle) {
            const providerTitleIds = this.getSelectedFilters(this.filteredProviderTitles);
            for (const id of providerTitleIds) {
                const message = this.messageService.getEmptyMessage();
                this.formFactory.assignFormValues(message, formMessage);
                message.Body = this.decodeHtml(this.text);
                message.ProviderTitleId = id;
                message.MessageFilterTypeId = this.selectedFilterTypeId;
                allActions.push(this.saveMessageCall(message));
            }
        } else if (this.selectedFilterTypeId === this.messageFilterTypeEnums.ServiceCode) {
            const serviceCodeIds = this.getSelectedFilters(this.filteredServiceCodes);
            for (const id of serviceCodeIds) {
                const message = this.messageService.getEmptyMessage();
                this.formFactory.assignFormValues(message, formMessage);
                message.Body = this.decodeHtml(this.text);
                message.ServiceCodeId = id;
                message.MessageFilterTypeId = this.selectedFilterTypeId;
                allActions.push(this.saveMessageCall(message));
            }
        } else if (this.selectedFilterTypeId === this.messageFilterTypeEnums.SchoolDistrict) {
            const schoolDistrictIds = this.getSelectedFilters(this.filteredSchoolDistricts);
            for (const id of schoolDistrictIds) {
                const message = this.messageService.getEmptyMessage();
                this.formFactory.assignFormValues(message, formMessage);
                message.Body = this.decodeHtml(this.text);
                message.SchoolDistrictId = id;
                message.MessageFilterTypeId = this.selectedFilterTypeId;
                allActions.push(this.saveMessageCall(message));
            }
        } else if (this.selectedFilterTypeId === this.messageFilterTypeEnums.Esc) {
            const escIds = this.getSelectedFilters(this.escs);
            for (const id of escIds) {
                const message = this.messageService.getEmptyMessage();
                this.formFactory.assignFormValues(message, formMessage);
                message.Body = this.decodeHtml(this.text);
                message.EscId = id;
                message.MessageFilterTypeId = this.selectedFilterTypeId;
                allActions.push(this.saveMessageCall(message));
            }
        } else {
            this.formFactory.assignFormValues(this.message, formMessage);
            this.message.Body = this.decodeHtml(this.text);
            this.message.MessageFilterTypeId = this.selectedFilterTypeId;
            allActions.push(this.saveMessageCall(this.message));
        }
        if (this.isNewMessage) {
            forkJoin(allActions).subscribe(() => {
                this.success();
            });
        } else {
            allActions.push(this.messageService.delete(this.message.Id));
            forkJoin(allActions).subscribe(() => {
                this.success();
            });
        }
    }

    decodeHtml(html: string): string {
        const txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    }

    private saveMessageCall(message: IMessage): Observable<number> {
        return this.messageService.create(message);
    }

    private success(): void {
        this.messageService.setMessage(this.messageService.getEmptyMessage());
        this.notificationsService.success('Message(s) saved successfully.');
        this.isLoginMessage = false;
    }

    private copySuccess(): void {
        this.notificationsService.success('Link copied successfully.');
    }

    private copyError(): void {
        this.notificationsService.error('Link copy error.');
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
        if (this.isLoginMessage) {
            this.selectedFilterTypeId = this.messageFilterTypeEnums.Login;
        } else if (this.filteredProviders.some((p) => !p.Selected) && !this.message.ForDistrictAdmins) {
            this.selectedFilterTypeId = this.messageFilterTypeEnums.Provider;
        } else if (this.filteredProviderTitles.some((p) => !p.Selected) && !this.message.ForDistrictAdmins) {
            this.selectedFilterTypeId = this.messageFilterTypeEnums.ProviderTitle;
        } else if (this.filteredServiceCodes.some((p) => !p.Selected) && !this.message.ForDistrictAdmins) {
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
