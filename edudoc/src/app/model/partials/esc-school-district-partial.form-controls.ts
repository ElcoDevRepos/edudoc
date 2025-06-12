import { DynamicField, DynamicFieldTypes, DynamicLabel, SelectInputTypes } from '@mt-ng2/dynamic-form';
import { EscSchoolDistrictDynamicControls, IEscSchoolDistrictDynamicControlsParameters } from '../form-controls/esc-school-district.form-controls';
import { IEsc } from '../interfaces/esc';
import { IEscSchoolDistrict } from '../interfaces/esc-school-district';
import { ISchoolDistrict } from '../interfaces/school-district';

export class EscSchoolDistrictDynamicControlsPartial extends EscSchoolDistrictDynamicControls {
    constructor(
        configControls: string[],
        escschooldistrictPartial?: IEscSchoolDistrict,
        additionalParameters?: IEscSchoolDistrictDynamicControlsParameters,
        schoolDistricts?: ISchoolDistrict[],
        escs?: IEsc[],
    ) {
        super(escschooldistrictPartial, additionalParameters);
        if (configControls.indexOf('EscId') > -1) {
            (<DynamicField>this.Form.EscId).placeholder = 'Begin typing...';
            (<DynamicField>this.Form.EscId).type.fieldType = DynamicFieldTypes.Select;
            (<DynamicField>this.Form.EscId).type.inputType = SelectInputTypes.TypeAhead;
            (<DynamicField>this.Form.EscId).options = escs;
            (<DynamicField>this.Form.EscId).labelHtml = `<label>ESC</label>`;
            (<DynamicLabel>this.View.EscId).label = `ESC`;
        }
        if (configControls.indexOf('SchoolDistrictId') > -1) {
            (<DynamicField>this.Form.SchoolDistrictId).placeholder = 'Begin typing...';
            (<DynamicField>this.Form.SchoolDistrictId).type.fieldType = DynamicFieldTypes.Select;
            (<DynamicField>this.Form.SchoolDistrictId).type.inputType = SelectInputTypes.TypeAhead;
            (<DynamicField>this.Form.SchoolDistrictId).options = schoolDistricts;
        }
    }
}
