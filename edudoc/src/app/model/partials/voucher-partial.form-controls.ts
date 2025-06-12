import { IServiceCode } from '@model/interfaces/service-code';
import { DynamicField, DynamicFieldTypes, DynamicLabel, SelectInputTypes } from '@mt-ng2/dynamic-form';
import { DAYS_OF_WEEK } from 'angular-calendar';
import { IVoucherDynamicControlsParameters, VoucherDynamicControls } from '../form-controls/voucher.form-controls';
import { IVoucher } from '../interfaces/voucher';

export class VoucherDynamicControlsPartial extends VoucherDynamicControls {

    constructor(voucherPartial?: IVoucher, additionalParameters?: IVoucherDynamicControlsParameters, serviceCodes?: IServiceCode[]) {
        super(voucherPartial, additionalParameters);

        (<DynamicField>this.Form.VoucherTypeId).type.inputType = SelectInputTypes.Dropdown;
        (<DynamicField>this.Form.VoucherTypeId).options.sort((a,b) => a.Sort - b.Sort);

        (<DynamicField>this.Form.ServiceCode).type.fieldType = DynamicFieldTypes.Select;
        (<DynamicField>this.Form.ServiceCode).type.inputType = SelectInputTypes.Dropdown;
        (<DynamicField>this.Form.ServiceCode).options = serviceCodes;
        (<DynamicField>this.Form.ServiceCode).labelHtml = '<label>Service Area</label>';
        (<DynamicField>this.Form.ServiceCode).value = serviceCodes.find(sc => sc.Name === voucherPartial.ServiceCode)?.Id ?? 0;

        (<DynamicField>this.Form.SchoolDistrictId).type.fieldType = DynamicFieldTypes.Select;
        (<DynamicField>this.Form.SchoolDistrictId).type.inputType = SelectInputTypes.Dropdown;
        (<DynamicField>this.Form.SchoolDistrictId).options = additionalParameters.schoolDistricts;

        (<DynamicLabel>this.View.ServiceCode).label = 'Service Area';
        (<DynamicLabel>this.View.PaidAmount).value = `$${voucherPartial.PaidAmount}`;
        (<DynamicLabel>this.View.VoucherTypeId).value = `${additionalParameters.voucherTypes.find(vt => vt.Id === voucherPartial.VoucherTypeId)?.Name || 'Not Selected'}`;
        (<DynamicLabel>this.View.VoucherAmount).value = `$${voucherPartial.VoucherAmount}`;
        (<DynamicField>this.View.SchoolDistrictId).value = `${voucherPartial.SchoolDistrict?.Name ?? voucherPartial.UnmatchedClaimDistrict?.DistrictOrganizationName}`;


        (<DynamicField>this.Form.VoucherDate).type.datepickerOptions = { firstDayOfTheWeek: DAYS_OF_WEEK.SUNDAY};

        // Disable Voucher Amount field when updating vouchers
        (<DynamicField>this.Form.VoucherAmount).disabled = voucherPartial.Id > 0;
        (<DynamicField>this.Form.VoucherDate).disabled = voucherPartial.Id > 0;
        (<DynamicField>this.Form.SchoolDistrictId).disabled = voucherPartial.Id > 0;
        (<DynamicField>this.Form.SchoolDistrictId).value = voucherPartial.SchoolDistrict?.Name ?? voucherPartial.UnmatchedClaimDistrict?.DistrictOrganizationName;
        (<DynamicField>this.Form.VoucherTypeId).disabled = voucherPartial.VoucherTypeId === 1;
        (<DynamicField>this.Form.ServiceCode).disabled = voucherPartial.VoucherTypeId > 1;

        if (voucherPartial.VoucherTypeId > 1)
        {
            delete this.View.ServiceCode;
        }

    }
}
