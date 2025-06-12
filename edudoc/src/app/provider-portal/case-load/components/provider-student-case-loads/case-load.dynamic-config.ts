import { IDynamicConfig, IDynamicFormConfig, DynamicConfig } from '@mt-ng2/dynamic-form';
import { ICaseLoadDynamicControlsParameters } from '@model/form-controls/case-load.form-controls';
import { ICaseLoad } from '@model/interfaces/case-load';
import { IMetaItem } from '@mt-ng2/base-service';
import { IStudentType } from '@model/interfaces/student-type';
import { CaseLoadDynamicControlsPartial } from '@model/partials/case-load-partial.form-controls';
import { IDisabilityCode } from '@model/interfaces/disability-code';
import { IGoal } from '@model/interfaces/goal';
import { ICptCode } from '@model/interfaces/cpt-code';

export class CaseLoadDynamicConfig<T extends ICaseLoad> extends DynamicConfig<T> implements IDynamicConfig<T> {
    constructor(
        private caseLoad: T,
        private billableStudentTypes?: IStudentType[],
        private nonBillableStudentTypes?: IStudentType[],
        private diagnosisCodes?: IMetaItem[],
        private disabilityCodes?: IDisabilityCode[],
        private usesDisabilityCodes?: boolean,
        private isNursingProvider?: boolean,
        private iepDatesRequired?: boolean,
        private configControls?: string[],
    ) {
        super();
        const additionalParams: ICaseLoadDynamicControlsParameters = {};
        const dynamicControls = new CaseLoadDynamicControlsPartial(
            this.caseLoad,
            additionalParams,
            this.billableStudentTypes,
            this.nonBillableStudentTypes,
            this.diagnosisCodes,
            this.disabilityCodes,
            this.usesDisabilityCodes,
            this.iepDatesRequired
        );

        // default form implementation can be overridden at the component level
        if (!configControls) {
            this.configControls = [
                'BillableStudentTypeId',
                'NonBillableStudentTypeId',
                isNursingProvider ? undefined : 'DiagnosisCodeId',
                'IepStartDate',
                'IepEndDate',
            ];
            if (this.usesDisabilityCodes) {
                this.configControls.push('DisabilityCodeId');
            }
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
