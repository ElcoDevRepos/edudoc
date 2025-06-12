import { IEscDynamicControlsParameters } from '@model/form-controls/esc.form-controls';
import { IEsc } from '@model/interfaces/esc';
import { IEscSchoolDistrict } from '@model/interfaces/esc-school-district';
import { ISchoolDistrict } from '@model/interfaces/school-district';
import { IUser } from '@model/interfaces/user';
import { EscSchoolDistrictDynamicControlsPartial } from '@model/partials/esc-school-district-partial.form-controls';
import { DynamicConfig, IDynamicConfig, IDynamicFormConfig } from '@mt-ng2/dynamic-form';

export class EscSchoolDistrictDynamicConfig<T extends IEscSchoolDistrict> extends DynamicConfig<T> implements IDynamicConfig<T> {
    constructor(
        private escSchoolDistrict: T,
        private schoolDistricts: ISchoolDistrict[],
        private escs: IEsc[],
        private createdBies?: IUser[],
        private modifiedBies?: IUser[],
        private configControls?: string[],
    ) {
        super();
        const additionalParams: IEscDynamicControlsParameters = {
            createdBies: this.createdBies,
            modifiedBies: this.modifiedBies,
        };
        const dynamicControls = new EscSchoolDistrictDynamicControlsPartial(
            this.configControls,
            this.escSchoolDistrict,
            additionalParams,
            this.schoolDistricts.filter((sds) => !sds.Archived),
            this.escs,
        );
        // default form implementation can be overridden at the component level
        if (!configControls) {
            this.configControls = ['SchoolDistrictId', 'EscId', 'CreatedById', 'Archived'];
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
