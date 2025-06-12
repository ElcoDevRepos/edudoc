import { IDynamicConfig, IDynamicFormConfig, DynamicConfig } from '@mt-ng2/dynamic-form';
import { IUser } from '@model/interfaces/user';
import { ISchoolDistrict } from '@model/interfaces/school-district';
import { IAdminSchoolDistrict } from '@model/interfaces/admin-school-district';
import { AdminSchoolDistrictDynamicControlsPartial } from '@model/partials/admin-school-district-partial.form-controls';
import { IAdminSchoolDistrictDynamicControlsParameters } from '@model/form-controls/admin-school-district.form-controls';

export class AdminSchoolDistrictDynamicConfig<T extends IAdminSchoolDistrict> extends DynamicConfig<T> implements IDynamicConfig<T> {
    constructor(
        private adminSchoolDistrict: T,
        private schoolDistricts: ISchoolDistrict[],
        private admins: IUser[],
        private createdBies?: IUser[],
        private modifiedBies?: IUser[],
        private configControls?: string[],
    ) {
        super();
        const additionalParams: IAdminSchoolDistrictDynamicControlsParameters = {
            createdBies: this.createdBies,
            modifiedBies: this.modifiedBies,
        };
        const dynamicControls = new AdminSchoolDistrictDynamicControlsPartial(
            this.configControls,
            this.adminSchoolDistrict,
            additionalParams,
            this.schoolDistricts,
            this.admins,
        );
        // default form implementation can be overridden at the component level
        if (!configControls) {
            this.configControls = ['SchoolDistrictId', 'AdminId', 'CreatedById', 'Archived'];
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
