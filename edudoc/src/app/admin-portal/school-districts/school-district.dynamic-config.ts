import { DynamicConfig, IDynamicConfig, IDynamicFormConfig } from '@mt-ng2/dynamic-form';

import { ISchoolDistrictDynamicControlsParameters } from '@model/form-controls/school-district.form-controls';
import { IAddress } from '@model/interfaces/address';
import { IMetaItem } from '@model/interfaces/base';
import { ISchoolDistrict } from '@model/interfaces/school-district';
import { SchoolDistrictDynamicControlsPartial } from '@model/partials/school-district-partial.form-controls';

export class SchoolDistrictDynamicConfig<T extends ISchoolDistrict> extends DynamicConfig<T> implements IDynamicConfig<T> {
    constructor(
        private schoolDistrict: T,
        private accountAssistants?: IMetaItem[],
        private accountManagers?: IMetaItem[],
        private treasurers?: IMetaItem[],
        private addresses?: IAddress[],
        private configControls?: string[],
    ) {
        super();
        const additionalParams: ISchoolDistrictDynamicControlsParameters = {
            addresses: this.addresses,
        };
        const dynamicControls = new SchoolDistrictDynamicControlsPartial(this.schoolDistrict, this.accountAssistants, this.accountManagers, this.treasurers, additionalParams);
        // default form implementation can be overridden at the component level
        if (!configControls) {
            this.configControls = [
                'Name',
                'Code',
                'EiNumber',
                'IrNumber',
                'NpiNumber',
                'ProviderNumber',
                'ProgressReports',
                'RequireNotesForAllEncounterSet',
                'Notes',
                'CreatedById',
                'Archived',
            ];
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
