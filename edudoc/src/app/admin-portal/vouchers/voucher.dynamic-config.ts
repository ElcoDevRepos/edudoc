import { DynamicConfig, IDynamicConfig, IDynamicFormConfig } from '@mt-ng2/dynamic-form';

import { IVoucherDynamicControlsParameters } from '@model/form-controls/voucher.form-controls';
import { ISchoolDistrict } from '@model/interfaces/school-district';
import { IServiceCode } from '@model/interfaces/service-code';
import { IVoucher } from '@model/interfaces/voucher';
import { IVoucherType } from '@model/interfaces/voucher-type';
import { VoucherDynamicControlsPartial } from '@model/partials/voucher-partial.form-controls';

export class VoucherDynamicConfig<T extends IVoucher> extends DynamicConfig<T> implements IDynamicConfig<T> {
    constructor(
        private voucher: T,
        private serviceCodes: IServiceCode[],
        private schoolDistricts: ISchoolDistrict[],
        private voucherTypes: IVoucherType[],
        private configControls?: string[],
    ) {
        super();
        const additionalParams: IVoucherDynamicControlsParameters = {
            schoolDistricts: schoolDistricts,
            voucherTypes: voucherTypes,
        };
        const dynamicControls = new VoucherDynamicControlsPartial(this.voucher, additionalParams, serviceCodes);
        // default form implementation can be overridden at the component level
        if (!configControls) {
            this.configControls = [ 'VoucherAmount', 'PaidAmount', 'VoucherDate', 'VoucherTypeId', 'ServiceCode', 'SchoolDistrictId', 'SchoolYear' ];
        }
        this.setControls(this.configControls, dynamicControls);
    }

    getForUpdate(additionalConfigs?: any[]): IDynamicFormConfig {
        return {
            formObject: this.getFormObject(additionalConfigs),
            viewOnly: this.DynamicLabels,
        };
    }

    getForCreate(additionalConfigs?: any[]): IDynamicFormConfig {
        return {
            formObject: this.getFormObject(additionalConfigs),
        };
    }
}
