import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

import { CommonService } from '@common/services/common.service';
import { Observable } from 'rxjs';
import { AddressWithCountyDynamicFields } from './address-with-county-dynamic-fields';

/**
 * Interface defining the address object
 * @property Id
 * @property Address1
 * @property Address2
 * @property City
 * @property StateCode
 * @property Zip
 * @property CountryCode
 * @property Province
 */
export interface IAddress {
    Id: number;
    Address1: string;
    Address2: string;
    City: string;
    StateCode: string;
    Zip: string;
    CountryCode?: string;
    Province: string;
    County: string;
}

/**
 * Interface defining the array of address objects
 * @property AddressId
 * @property Address
 * @property IsPrimary
 */
export interface IAddressContainer {
    AddressId: number;
    Address: IAddress;
    IsPrimary: boolean;
}

/**
 * Interface defining the state object
 * @property StateCode
 * @property Name
 */
export interface IState {
    StateCode: string;
    Name: string;
}

/**
 * Interface defining the state service
 * @property getStates
 */
export interface IStatesService {
    getStates(): Observable<IState[]>;
}

/**
 * Interface defining the country object
 * @property CountryCode
 * @property Alpha3Code
 * @property Name
 */
export interface ICountry {
    CountryCode: string;
    Alpha3Code: string;
    Name: string;
}

/**
 * Interface defining the country service
 * @property getCountries
 */
export interface ICountriesService {
    getCountries(): Observable<ICountry[]>;
}

@Component({
    selector: 'address-with-county',
    template: `
        <div [formGroup]="parentForm">
            <div
                *ngIf="allowInternationalAddresses"
                class="dynamic-field form-select"
                [class.has-error]="countryHasError()"
                [style.marginBottom.px]="15"
            >
                <label>Country</label>
                <select #CountryCode formControlName="CountryCode" (ngModelChange)="onCountryChange($event)" class="form-control">
                    <option *ngFor="let country of countries" [ngValue]="country.CountryCode">
                        {{ country.Name }}
                    </option>
                </select>
                <div *ngIf="showRequiredCountryMessage()" class="small errortext" [style.position]="'absolute'">
                    Country is required
                </div>
            </div>
            <mt-dynamic-field [field]="fields.Address1" [form]="parentForm" [overrideForm]="true"></mt-dynamic-field>
            <mt-dynamic-field [field]="fields.Address2" [form]="parentForm" [overrideForm]="true"></mt-dynamic-field>
            <mt-dynamic-field *ngIf="!addressIsInternational" [field]="fields.City" [form]="parentForm" [overrideForm]="true"></mt-dynamic-field>
            <mt-dynamic-field
                *ngIf="addressIsInternational"
                [field]="fields.InternationalCity"
                [form]="parentForm"
                [overrideForm]="true"
            ></mt-dynamic-field>
            <mt-dynamic-field *ngIf="!addressIsInternational" [field]="fields.County" [form]="parentForm" [overrideForm]="true"></mt-dynamic-field>
            <div *ngIf="!addressIsInternational" class="dynamic-field form-select" [class.has-error]="stateHasError()" [style.marginBottom.px]="15">
                <label>State <span class="text text-danger">*</span></label>
                <select formControlName="StateCode" class="form-control">
                    <option *ngFor="let state of states" [ngValue]="state.StateCode">
                        {{ state.Name }}
                    </option>
                </select>
                <div *ngIf="showRequiredStateMessage()" class="small errortext" [style.position]="'absolute'">
                    State is required
                </div>
            </div>
            <mt-dynamic-field *ngIf="addressIsInternational" [field]="fields.Province" [form]="parentForm" [overrideForm]="true"></mt-dynamic-field>
            <mt-dynamic-field *ngIf="!addressIsInternational" [field]="fields.Zip" [form]="parentForm" [overrideForm]="true"></mt-dynamic-field>
            <mt-dynamic-field *ngIf="addressIsInternational" [field]="fields.InternationalZip" [form]="parentForm" [overrideForm]="true"></mt-dynamic-field>
            <div *ngIf="showIsPrimary" [style.marginBottom.px]="15">
                <input type="checkbox" formControlName="IsPrimary" />
                <label>Primary Address</label>
            </div>
        </div>
    `,
})
export class AddressWithCountyComponent implements OnInit {
    /**
     * address object that holds addresses and it's primary flag
     */
    @Input() addressContainer: IAddressContainer;
    /**
     * form object to attach the address component to
     */
    @Input() parentForm: UntypedFormGroup;
    /**
     * boolean to toggle the primary checkbox
     */
    @Input() showIsPrimary = true;
    /**
     * allow international addresses
     */
    @Input() allowInternationalAddresses = false;

    @Input('requireCounty') requireCounty: boolean;

    states: IState[] = [];
    countries: ICountry[] = [];
    fields: AddressWithCountyDynamicFields;

    private _addressIsInternational = false;
    get addressIsInternational(): boolean {
        return this._addressIsInternational;
    }
    set addressIsInternational(value: boolean) {
        this._addressIsInternational = value;
        this.changeDetectorRef.detectChanges();
    }

    constructor(
        private fb: UntypedFormBuilder,
        private changeDetectorRef: ChangeDetectorRef,
        private commonService: CommonService,
        ) {}

    ngOnInit(): void {
        this.loadForm();
        this.getStates();
        this.getCountries();
    }

    loadForm(): void {
        if (!this.parentForm) {
            this.parentForm = this.fb.group({});
        }

        if (this.addressContainer.Address.Id) {
            this.parentForm.addControl('Id', new UntypedFormControl(this.addressContainer.Address.Id));
        }
        if (this.addressContainer.AddressId) {
            this.parentForm.addControl('AddressId', new UntypedFormControl(this.addressContainer.AddressId));
        }

        // eslint-disable-next-line @typescript-eslint/unbound-method
        this.parentForm.addControl('StateCode', new UntypedFormControl(this.addressContainer.Address.StateCode, Validators.required));
        // eslint-disable-next-line @typescript-eslint/unbound-method
        this.parentForm.addControl('CountryCode', new UntypedFormControl(this.addressContainer.Address.CountryCode, Validators.required));
        // eslint-disable-next-line @typescript-eslint/unbound-method
        this.parentForm.addControl('County', new UntypedFormControl(this.addressContainer.Address.County, Validators.required));

        if (!this.requireCounty) {
            this.parentForm.get('County').clearValidators();
        }

        if (this.showIsPrimary) {
            this.parentForm.addControl('IsPrimary', new UntypedFormControl(this.addressContainer.IsPrimary ? true : false));
        }

        this.fields = new AddressWithCountyDynamicFields(this.addressContainer.Address, null, this.requireCounty);

        this.addressIsInternational = this.addressContainer.Address.CountryCode !== 'US';
    }

    getStates(): void {
        this.commonService.getStates().subscribe((answer) => {
            this.states = answer;
        });
    }

    getCountries(): void {
        this.commonService.getCountries().subscribe((answer) => {
            const countries: ICountry[] = answer;
            // let index = countries.findIndex((item) => item.CountryCode === 'US');
            // if (index > -1) {
            //     countries.splice(index, 1);
            // }
            this.countries = countries;
        });
    }

    onCountryChange($event): void {
        this.addressIsInternational = $event !== 'US';
    }

    showRequiredCountryMessage(): boolean {
        const control = this.parentForm.get('CountryCode');
        return control.hasError('required') && control.touched;
    }

    countryHasError(): boolean {
        const control = this.parentForm.get('CountryCode');
        return control.hasError('*') && control.touched;
    }

    showRequiredStateMessage(): boolean {
        const control = this.parentForm.get('StateCode');
        return control.hasError('required') && control.touched;
    }

    stateHasError(): boolean {
        const control = this.parentForm.get('StateCode');
        return control.hasError('*') && control.touched;
    }
}
