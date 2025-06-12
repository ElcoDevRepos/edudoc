import { Validators } from '@angular/forms';
import { IAddress } from '@model/interfaces/address';
import { DynamicField, DynamicFieldType, DynamicFieldTypes } from '@mt-ng2/dynamic-form';

export interface IAddressDynamicFields {
    Address1: DynamicField;
    Address2: DynamicField;
    City: DynamicField;
    County: DynamicField;
    InternationalCity: DynamicField;
    Province: DynamicField;
    Zip: DynamicField;
    InternationalZip: DynamicField;
}
export class AddressWithCountyDynamicFields implements IAddressDynamicFields {
    Address1: DynamicField;
    Address2: DynamicField;
    City: DynamicField;
    County: DynamicField;
    InternationalCity: DynamicField;
    Province: DynamicField;
    Zip: DynamicField;
    InternationalZip: DynamicField;

    constructor(address: IAddress, private formGroup = 'Address', requireCounty: boolean) {
        this.Address1 = this.getDynamicFieldAddress1(address);
        this.Address2 = this.getDynamicFieldAddress2(address);
        this.City = this.getDynamicFieldCity(address);
        this.InternationalCity = this.getDynamicFieldCity(address, false);
        this.County = this.getDynamicFieldCounty(address, requireCounty);
        this.Province = this.getDynamicFieldProvince(address);
        this.Zip = this.getDynamicFieldZip(address);
        this.InternationalZip = this.getDynamicFieldZip(address, false);
    }

    getDynamicFieldAddress1(value: IAddress, required = true, maxLength = 50): DynamicField {
        return new DynamicField({
            formGroup: this.formGroup,
            label: 'Address 1',
            name: 'Address1',
            type: new DynamicFieldType({ fieldType: DynamicFieldTypes.Input }),
            // eslint-disable-next-line @typescript-eslint/unbound-method
            validation: required ? [Validators.required, Validators.maxLength(maxLength)] : [Validators.maxLength(maxLength)],
            validators: required ? { required: true, maxlength: maxLength } : { maxlength: maxLength },
            value: value.Address1,
        });
    }

    getDynamicFieldAddress2(value: IAddress, required = false, maxLength = 50): DynamicField {
        return new DynamicField({
            formGroup: this.formGroup,
            label: 'Address 2',
            name: 'Address2',
            type: new DynamicFieldType({ fieldType: DynamicFieldTypes.Input }),
            // eslint-disable-next-line @typescript-eslint/unbound-method
            validation: required ? [Validators.required, Validators.maxLength(maxLength)] : [Validators.maxLength(maxLength)],
            validators: required ? { required: true, maxlength: maxLength } : { maxlength: maxLength },
            value: value.Address2,
        });
    }

    getDynamicFieldCity(value: IAddress, required = true, maxLength = 50): DynamicField {
        return new DynamicField({
            formGroup: this.formGroup,
            label: 'City',
            name: 'City',
            type: new DynamicFieldType({ fieldType: DynamicFieldTypes.Input }),
            // eslint-disable-next-line @typescript-eslint/unbound-method
            validation: required ? [Validators.required, Validators.maxLength(maxLength)] : [Validators.maxLength(maxLength)],
            validators: required ? { required: true, maxlength: maxLength } : { maxlength: maxLength },
            value: value.City,
        });
    }

    getDynamicFieldCounty(value: IAddress, required = true, maxLength = 50): DynamicField {
        return new DynamicField({
            formGroup: this.formGroup,
            label: 'County',
            name: 'County',
            type: new DynamicFieldType({ fieldType: DynamicFieldTypes.Input }),
            // eslint-disable-next-line @typescript-eslint/unbound-method
            validation: required ? [Validators.required, Validators.maxLength(maxLength)] : [Validators.maxLength(maxLength)],
            validators: required ? { required: true, maxlength: maxLength } : { maxlength: maxLength },
            value: value.County,
        });
    }

    getDynamicFieldZip(value: IAddress, required = true, maxLength = 10): DynamicField {
        return new DynamicField({
            formGroup: this.formGroup,
            label: 'Zip',
            name: 'Zip',
            type: new DynamicFieldType({ fieldType: DynamicFieldTypes.Input }),
            // eslint-disable-next-line @typescript-eslint/unbound-method
            validation: required ? [Validators.required, Validators.maxLength(maxLength)] : [Validators.maxLength(maxLength)],
            validators: required ? { required: true, maxlength: maxLength } : { maxlength: maxLength },
            value: value.Zip,
        });
    }

    getDynamicFieldProvince(value: IAddress, required = false, maxLength = 50): DynamicField {
        return new DynamicField({
            formGroup: this.formGroup,
            label: 'Province',
            name: 'Province',
            type: new DynamicFieldType({ fieldType: DynamicFieldTypes.Input }),
            // eslint-disable-next-line @typescript-eslint/unbound-method
            validation: required ? [Validators.required, Validators.maxLength(maxLength)] : [Validators.maxLength(maxLength)],
            validators: required ? { required: true, maxlength: maxLength } : { maxlength: maxLength },
            value: value.Province,
        });
    }
}
