import { AdminSchoolDistrictDynamicControls, IAdminSchoolDistrictDynamicControlsParameters } from '@model/form-controls/admin-school-district.form-controls';
import { IAdminSchoolDistrict } from '@model/interfaces/admin-school-district';
import { IUser } from '@model/interfaces/user';
import { DynamicField, DynamicFieldTypes, DynamicLabel, SelectInputTypes } from '@mt-ng2/dynamic-form';
import { ISchoolDistrict } from '../interfaces/school-district';

export class AdminSchoolDistrictDynamicControlsPartial extends AdminSchoolDistrictDynamicControls {
    constructor(
        configControls: string[],
        adminschooldistrictPartial?: IAdminSchoolDistrict,
        additionalParameters?: IAdminSchoolDistrictDynamicControlsParameters,
        schoolDistricts?: ISchoolDistrict[],
        admins?: IUser[],
    ) {
        super(adminschooldistrictPartial, additionalParameters);
        if (configControls.indexOf('AdminId') > -1) {
            (<DynamicField>this.Form.AdminId).placeholder = 'Begin typing...';
            (<DynamicField>this.Form.AdminId).type.fieldType = DynamicFieldTypes.Select;
            (<DynamicField>this.Form.AdminId).type.inputType = SelectInputTypes.TypeAhead;
            (<DynamicField>this.Form.AdminId).options = admins;
            (<DynamicField>this.Form.AdminId).labelHtml = `<label>HPC Admin</label>`;
            (<DynamicLabel>this.View.AdminId).label = `HPC Admin`;
        }
        if (configControls.indexOf('SchoolDistrictId') > -1) {
            (<DynamicField>this.Form.SchoolDistrictId).placeholder = 'Begin typing...';
            (<DynamicField>this.Form.SchoolDistrictId).type.fieldType = DynamicFieldTypes.Select;
            (<DynamicField>this.Form.SchoolDistrictId).type.inputType = SelectInputTypes.TypeAhead;
            (<DynamicField>this.Form.SchoolDistrictId).options = schoolDistricts;
        }
    }
}
