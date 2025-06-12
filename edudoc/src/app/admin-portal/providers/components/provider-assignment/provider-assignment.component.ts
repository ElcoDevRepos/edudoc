import { EscService } from '@admin/escs/services/esc.service';
import { ProviderAgencyService } from '@admin/managed-list-items/managed-item-services/provider-agency.service';
import { ProviderService } from '@admin/providers/provider.service';
import { AgencyTypeService } from '@admin/providers/services/agency-type.service';
import { ProviderSchoolDistrictService } from '@admin/providers/services/provider-school-district.service';
import { SchoolDistrictService } from '@admin/school-districts/services/schooldistrict.service';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { AgencyTypes } from '@model/enums/agency-types.enum';
import { ProviderEmploymentTypes } from '@model/enums/provider-employment-types.enum';
import { IAgency } from '@model/interfaces/agency';
import { IAgencyType } from '@model/interfaces/agency-type';
import { IEsc } from '@model/interfaces/esc';
import { IProvider } from '@model/interfaces/provider';
import { IProviderEscAssignment } from '@model/interfaces/provider-esc-assignment';
import { ExtraSearchParams, IEntityExtraSearchParams, IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import { markAllFormFieldsAsTouched } from '@mt-ng2/common-functions';
import { DynamicField, DynamicFieldType, DynamicFieldTypes, IDynamicField, IDynamicFieldType, SelectInputTypes } from '@mt-ng2/dynamic-form';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { MtSearchFilterItem } from '@mt-ng2/search-filter-select-control';
import { forkJoin, Subscription } from 'rxjs';
import { ProviderEscDynamicConfig } from './provider-esc.dynamic-config';

@Component({
    selector: 'app-provider-assignment',
    styles: [
        `
            .provider-delete {
                margin-top: -1em;
            }

            li:not(:hover) > i {
                display: none;
            }
        `,
    ],
    templateUrl: './provider-assignment.component.html',
})
export class ProviderAssignmentComponent implements OnInit, OnDestroy {
    @Input() provider: IProvider;
    isEditing = false;
    form: UntypedFormGroup;
    subscriptions: Subscription;
    escDropdown: DynamicField;
    escs: IEsc[] = [];
    selectedEscId: number;
    districts: MtSearchFilterItem[] = [];
    schoolDistrictsDropdownBuilt = false;
    selectedDistrictIds: number[];
    escAssignments: IProviderEscAssignment[] = [];
    selectedEscAssignment: IProviderEscAssignment;
    formObject: DynamicField[] = [];
    providerEscFormFactory: ProviderEscDynamicConfig<IProviderEscAssignment>;
    providerEscFormBuilt = false;
    agencyTypeDropdown: DynamicField;
    agencyTypes: IAgencyType[] = [];
    selectedAgencyTypeId: number;
    districtEmploymentType = ProviderEmploymentTypes.DistrictEmployed;
    noEscAgencyTypes: IAgencyType[] = [];
    providerAgencies: IAgency[] = [];
    providerAgencyDropdownBuilt = false;
    providerAgencyDropdown: DynamicField;
    selectedAgencyId: number;
    editingDistricts: boolean;
    districtDropdown: DynamicField;

    get isAgencyValid(): boolean {
        return (
            this.provider.ProviderEmploymentTypeId === ProviderEmploymentTypes.DistrictEmployed ||
            (this.selectedAgencyTypeId > 2 && this.selectedAgencyId !== null) ||
            this.selectedAgencyTypeId < 3
        );
    }

    get isDistrictsValid(): boolean {
        return this.selectedEscAssignment.Id > 0 || this.districts.some((district) => district.Selected);
    }

    constructor(
        private escService: EscService,
        private schoolDistrictService: SchoolDistrictService,
        private providerSchoolDistrictService: ProviderSchoolDistrictService,
        private providerAgenciesService: ProviderAgencyService,
        private agencyTypesService: AgencyTypeService,
        private providerService: ProviderService,
        private fb: UntypedFormBuilder,
        private notificationsService: NotificationsService,
    ) {
        this.subscriptions = new Subscription();
    }

    ngOnInit(): void {
        const emptyEsc = this.escService.getEmptyEsc();
        emptyEsc.Id = 0;
        emptyEsc.Name = 'No ESC';
        forkJoin(this.escService.getAll(), this.providerAgenciesService.getItems(), this.agencyTypesService.getItems()).subscribe((answers) => {
            const [escs, agencies, agencyTypes] = answers;
            this.escs = [emptyEsc].concat(escs);
            this.providerAgencies = agencies;
            this.agencyTypes = agencyTypes;
            this.noEscAgencyTypes = this.agencyTypes.filter((agencyType) => !agencyType.Name.includes('ESC')); // not sure the best way to go about this
            this.providerService.providerUpdated.subscribe((id) => {
                if (id === this.provider.Id) {
                    this.buildForm();
                }
            });
            this.buildForm();
        });
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    getSchoolDistricts(selectedEscId: number): void {
        const searchParams = new SearchParams({
            query: null,
            extraParams: [
                new ExtraSearchParams({
                    name: 'escId',
                    value: selectedEscId ? selectedEscId.toString() : '0',
                }),
                new ExtraSearchParams({
                    name: 'providerId',
                    value: this.provider.Id.toString(),
                }),
                new ExtraSearchParams({
                    name: 'includeArchived',
                    value: '0',
                }),
            ],
        });
        this.schoolDistrictService.search(searchParams).subscribe((escSchoolDistricts) => {
            this.districts = escSchoolDistricts.body.map((d) => new MtSearchFilterItem(d, false));
            this.schoolDistrictsDropdownBuilt = true;
        });
    }

    handleEscDropdownCreated(control: AbstractControl): void {
        this.subscriptions.add(
            control.valueChanges.subscribe((selectedEscId: number) => {
                this.schoolDistrictsDropdownBuilt = false;
                this.providerEscFormBuilt = false;
                this.selectedEscId = selectedEscId;
                this.getSchoolDistricts(selectedEscId);
            }),
        );
    }

    buildProviderAssignmentControls(): void {
        this.providerEscFormFactory = new ProviderEscDynamicConfig(this.selectedEscAssignment);
        // using getForCreate since we don't need the view-only portion that is built by getForUpdate()
        const config = this.providerEscFormFactory.getForCreate();
        this.formObject = config.formObject?.map((x) => new DynamicField(x));
        if (this.selectedEscAssignment.Id > 0) {
            this.getSchoolDistricts(this.selectedEscAssignment.EscId);
            this.selectedAgencyTypeId = this.selectedEscAssignment.AgencyTypeId;
            this.selectedAgencyId = this.selectedEscAssignment.AgencyId;
            this.selectedEscId = this.selectedEscAssignment.EscId;
            if (this.selectedAgencyTypeId !== null) {
                this.buildProviderAgencyDropdownFromType(this.selectedAgencyTypeId);
            }
        }
        const agencyTypes = this.selectedEscId > 0 ? this.agencyTypes : this.noEscAgencyTypes;
        this.agencyTypeDropdown = new DynamicField({
            formGroup: 'Agency',
            label: 'Agency Type <span class="text text-danger">*</span>',
            name: 'AgencyType',
            options: agencyTypes,
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Select,
                inputType: SelectInputTypes.Dropdown,
            }),
            value: this.selectedEscAssignment.Id > 0 ? this.selectedEscAssignment.AgencyTypeId : null,
        });
        this.providerEscFormBuilt = true;
    }

    buildProviderAgencyDropdownFromType(selectedAgencyTypeId: number): void {
        if (this.agencyTypes.find((agencyType) => agencyType.Id === selectedAgencyTypeId).Name.includes('Agency')) {
            setTimeout(() => {
                this.buildProviderAgencyDropdown(this.providerAgencies, false);
            }, 100);
        } else {
            this.buildProviderAgencyDropdown([], true);
        }
    }

    buildProviderAgencyDropdown(options: IAgency[], isEsc: boolean): void {
        if (!isEsc) {
            this.providerAgencyDropdown = new DynamicField({
                formGroup: 'Agency',
                label: 'Agency Name <span class="text text-danger">*</span>',
                name: 'Agency',
                options: options,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: SelectInputTypes.Dropdown,
                }),
                value: this.selectedEscAssignment.Id > 0 ? this.selectedEscAssignment.AgencyId : null,
            });
            this.providerAgencyDropdownBuilt = true;
        }
    }

    handleAgencyTypeDropdownCreated(control: AbstractControl): void {
        this.subscriptions.add(
            control.valueChanges.subscribe((selectedTypeId) => {
                this.providerAgencyDropdownBuilt = false;
                this.selectedAgencyTypeId = selectedTypeId;
                this.buildProviderAgencyDropdownFromType(this.selectedAgencyTypeId);
            }),
        );
    }

    handleProviderAgencyDropdownCreated(control: AbstractControl): void {
        this.subscriptions.add(
            control.valueChanges.subscribe((selectedAgencyId) => {
                this.selectedAgencyId = selectedAgencyId;
            }),
        );
    }

    getProviderAssignments(): void {
        const searchParams = new SearchParams({
            query: null,
            extraParams: [
                {
                    name: 'providerIds',
                    valueArray: [this.provider.Id],
                },
                {
                    name: 'archivedStatus',
                    valueArray: [0],
                },
            ],
            order: 'Id',
            orderDirection: 'Asc',
        });

        this.providerSchoolDistrictService.get(searchParams).subscribe((escsResponse) => {
            this.escAssignments = escsResponse.body.sort((a, b) => {
                return new Date(a.EndDate) < new Date(b.EndDate) ? 1 : -1;
            });
        });
    }

    checkDistrictSelections(): void {
        if (this.districts.some((selection) => selection.Selected)) {
            this.providerEscFormBuilt = false;
            this.providerAgencyDropdownBuilt = false;
            this.selectedDistrictIds = this.districts
                .filter((selection) => selection.Selected)
                .map((selection) => {
                    return selection.Item.Id;
                });
            this.buildProviderAssignmentControls();
        }
    }

    editAssignmentClick(assignment: IProviderEscAssignment): void {
        this.selectedEscAssignment = assignment;
        this.selectedEscId = assignment.EscId;
        this.selectedEscAssignment.Provider = this.provider;
        this.providerAgencyDropdownBuilt = false;
        this.buildProviderAssignmentControls();
        this.isEditing = true;
    }

    editDistricts(): void {
        this.editingDistricts = true;
    }

    createClick(): void {
        this.buildForm();
        this.isEditing = true;
        this.getSchoolDistricts(0); // display district dropdown on load
    }

    buildForm(): void {
        this.schoolDistrictsDropdownBuilt = false;
        this.providerEscFormBuilt = false;
        this.providerAgencyDropdownBuilt = false;
        this.selectedEscId = null;
        this.selectedDistrictIds = null;
        this.selectedAgencyTypeId = null;
        this.selectedAgencyId = null;
        this.form = this.fb.group({
            Agency: this.fb.group({}),
            Assignment: this.fb.group({}),
            District: this.fb.group({}),
        });

        this.escDropdown = new DynamicField({
            formGroup: 'Assignment',
            label: 'ESC',
            name: 'ESC',
            options: this.escs,
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Select,
                inputType: SelectInputTypes.Dropdown,
            }),
            value: 0,
        });

        this.getProviderAssignments();
        this.selectedEscAssignment = this.providerSchoolDistrictService.getEmptyProviderEsc();
    }

    getAssignmentLabelContents(assignment: IProviderEscAssignment): string {
        const startDate = new Date(assignment.StartDate).toLocaleDateString();
        const endDate = (assignment.EndDate && ` ending ${new Date(assignment.EndDate).toLocaleDateString()}`) || '';
        let agency = '';
        const providerName = `${this.provider.ProviderUser.LastName}, ${this.provider.ProviderUser.FirstName}`;
        const agencyEscName = (assignment.Esc && assignment.Esc.Name) || '';
        const agencyName = (assignment.Agency && assignment.Agency.Name) || '';
        if (this.provider.ProviderEmploymentTypeId === ProviderEmploymentTypes.DistrictEmployed) {
            agency = `<span><strong>AGENCY:</strong></span> ${providerName}`;
        } else {
            switch (assignment.AgencyTypeId) {
                case AgencyTypes.ESCName:
                    agency = `<span><strong>AGENCY:</strong> ${agencyEscName}</span>`;
                    break;
                case AgencyTypes.ESCNameWithProviderName:
                    agency = `<span><strong>AGENCY:</strong> ${agencyEscName} ${providerName}</span>`;
                    break;
                case AgencyTypes.AgencyName:
                    agency = `<span><strong>AGENCY:</strong> ${agencyName}</span>`;
                    break;
                case AgencyTypes.AgencyNameWithProviderName:
                    agency = `<span><strong>AGENCY:</strong> ${agencyName} ${providerName}</span>`;
                    break;
                default:
                    agency = `<span><strong>AGENCY:</strong> <em>NA</em></span>`;
                    break;
            }
        }
        const providerEsc = (assignment.Esc && `<br><span><strong>ESC:</strong> ${assignment.Esc.Name}</span>`) || '';
        return `<span><strong>ASSIGNMENT:</strong> <em>${this.getDistrictNames(assignment)}</em> starting ${startDate}${endDate}</span>
        ${providerEsc}
        <br >
        ${agency}`;
    }

    getDistrictNames(assignment: IProviderEscAssignment): string {
        return assignment.ProviderEscSchoolDistricts.map((pesd) => pesd.SchoolDistrict.Name)
            .sort()
            .join(', ');
    }

    getDistrictIds(assignment: IProviderEscAssignment): number[] {
        return assignment.ProviderEscSchoolDistricts.map((pesd) => pesd.SchoolDistrict.Id);
    }

    createAssignment(): void {
        this.selectedEscAssignment.ProviderId = this.provider.Id;
        this.selectedEscAssignment.EscId = this.selectedEscId !== 0 ? this.selectedEscId : null;
        this.selectedEscAssignment.ProviderEscSchoolDistricts = [];
        for (const districtId of this.selectedDistrictIds) {
            const newDistrictAssignment = this.providerSchoolDistrictService.getEmptyProviderEscSchoolDistrict();
            newDistrictAssignment.SchoolDistrictId = districtId;
            this.selectedEscAssignment.ProviderEscSchoolDistricts.push(newDistrictAssignment);
        }
        this.providerSchoolDistrictService.createWithFks(this.selectedEscAssignment).subscribe(() => {
            this.success(true);
            this.getProviderAssignments();
            this.isEditing = false;
        });
    }

    updateDistricts(): void {
        this.selectedDistrictIds = this.form.value.District.DistrictId;

        this.providerSchoolDistrictService.delete(this.selectedEscAssignment.Id).subscribe(() => {
            this.escAssignments = this.escAssignments.filter((assignment) => assignment.Id !== this.selectedEscAssignment.Id);
            this.selectedEscAssignment.Id = 0;
            this.createAssignment();
        });
    }

    cancelClick(): void {
        this.isEditing = false;
    }

    success(create: boolean): void {
        this.notificationsService.success(create ? 'Provider successfully assigned to ESC/Districts!' : 'Provider assignment successfully updated!');
    }

    updateAssignment(): void {
        this.providerSchoolDistrictService.updateWithFks(this.selectedEscAssignment).subscribe(() => {
            this.success(false);
            this.getProviderAssignments();
            this.isEditing = false;
        });
    }

    updateAssignmentAgency(): void {
        if (this.selectedAgencyTypeId !== null) {
            const isEsc = this.agencyTypes.find((agencyType) => agencyType.Id === this.selectedAgencyTypeId).Name.includes('ESC');
            // only set the agency type if the user has selected a value from the esc or agency name dropdown
            if (!isEsc) {
                if (this.selectedAgencyId !== null) {
                    this.selectedEscAssignment.AgencyTypeId = this.selectedAgencyTypeId;
                    this.selectedEscAssignment.AgencyId = this.selectedAgencyId;
                }
            } else {
                this.selectedEscAssignment.AgencyTypeId = this.selectedAgencyTypeId;
            }
        }
    }

    providerAssignmentSubmitted(form: UntypedFormGroup): void {
        if (!form.valid && this.isDistrictsValid) {
            markAllFormFieldsAsTouched(form);
            this.notificationsService.error('Please fill in all required fields (marked with "*")');
        } else if (!this.isAgencyValid) {
            this.notificationsService.error('Please make sure the provider has an Agency Type and value(Agency name if applicable) selected.');
        } else if (!this.isDistrictsValid) {
            this.notificationsService.error('Please make sure the school districts are selected.');
        } else if (
            form.value.ProviderEscAssignment.EndDate &&
            form.value.ProviderEscAssignment.StartDate >= form.value.ProviderEscAssignment.EndDate
        ) {
            this.notificationsService.error('Start Date can not be later then or equal to the End Date');
        } else {
            this.providerEscFormFactory.assignFormValues(this.selectedEscAssignment, form.value.ProviderEscAssignment as IProviderEscAssignment);
            this.selectedEscAssignment.ProviderId = this.provider.Id;
            this.updateAssignmentAgency();
            if (this.selectedEscAssignment.Id === 0) {
                this.createAssignment();
            } else if (this.editingDistricts) {
                this.updateDistricts();
            } else {
                this.updateAssignment();
            }
        }
    }

    archiveAssignment(event: Event, assignment: IProviderEscAssignment): void {
        if (event) {
            event.stopPropagation();
        }
        assignment.Archived = true;
        assignment.Provider = this.provider;
        this.providerSchoolDistrictService.updateWithFks(assignment).subscribe(() => {
            this.getProviderAssignments();
        });
    }

    getDistrictDropdown(): IDynamicField {
        return (this.districtDropdown = new DynamicField({
            formGroup: 'District',
            label: 'Districts',
            name: 'DistrictId',
            options: this.districts.map((d) => d.Item),
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Select,
                inputType: SelectInputTypes.MultiselectDropdown,
            }),
            value: this.getDistrictIds(this.selectedEscAssignment),
        }));
    }
}
