import { IDynamicConfig, IDynamicFormConfig, DynamicConfig } from '@mt-ng2/dynamic-form';

import { IVoucher } from '@model/interfaces/voucher';
import { IVoucherDynamicControlsParameters, VoucherDynamicControls } from '@model/form-controls/voucher.form-controls';
import { VoucherDynamicControlsPartial } from '@model/partials/voucher-partial.form-controls';
import { IServiceCode } from '@model/interfaces/service-code';
import { ISchoolDistrict } from '@model/interfaces/school-district';
import { IAnnualEntry } from '@model/interfaces/annual-entry';
import { IAnnualEntryStatus } from '@model/interfaces/annual-entry-status';
import { AnnualEntryDynamicControls, IAnnualEntryDynamicControlsParameters } from '@model/form-controls/annual-entry.form-controls';
import { AnnualEntryDynamicControlsPartial } from '@model/partials/annual-entry-partial.form-controls';

export class AnnualEntryDynamicConfig<T extends IAnnualEntry> extends DynamicConfig<T> implements IDynamicConfig<T> {
    constructor(
        private voucher: T,
        private annualEntryStatuses: IAnnualEntryStatus[],
        private schoolDistricts: ISchoolDistrict[],
        private configControls?: string[],
    ) {
        super();
        const additionalParams: IAnnualEntryDynamicControlsParameters = {
            schoolDistricts: schoolDistricts,
            statuses: annualEntryStatuses,
        };
        const dynamicControls = new AnnualEntryDynamicControlsPartial(this.voucher, additionalParams);
        // default form implementation can be overridden at the component level
        if (!configControls) {
            this.configControls = [ 'Year', 'StatusId', 'AllowableCosts', 'InterimPayments', 'SettlementAmount', 'Mer', 'Rmts', 'SchoolDistrictId' ];
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
