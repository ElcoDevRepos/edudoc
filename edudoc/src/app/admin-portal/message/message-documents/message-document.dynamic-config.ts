import { IDynamicConfig, IDynamicFormConfig, DynamicConfig } from '@mt-ng2/dynamic-form';
import { IMessageDocument } from '@model/interfaces/message-document';
import { IUser } from '@model/interfaces/user';
import { IMessageDocumentDynamicControlsParameters } from '@model/form-controls/message-document.form-controls';
import { IMessageFilterType } from '@model/interfaces/message-filter-type';
import { IEsc } from '@model/interfaces/esc';
import { IProviderTitle } from '@model/interfaces/provider-title';
import { IProvider } from '@model/interfaces/provider';
import { ISchoolDistrict } from '@model/interfaces/school-district';
import { IServiceCode } from '@model/interfaces/service-code';
import { MessageDocumentDynamicControlsPartial } from '@model/partials/message-document-partial.form-controls';

export class MessageDocumentDynamicConfig<T extends IMessageDocument> extends DynamicConfig<T> implements IDynamicConfig<T> {
    constructor(
        private messageDocument: T,
        private createdBies: IUser[],
        private escs: IEsc[],
        private messageFilterTypes: IMessageFilterType[],
        private modifiedBies: IUser[],
        private providerTitles: IProviderTitle[],
        private providers: IProvider[],
        private schoolDistricts: ISchoolDistrict[],
        private serviceCodes: IServiceCode[],
        private configControls?: string[],
    ) {
        super();
        const additionalParams: IMessageDocumentDynamicControlsParameters = {
            createdBies: this.createdBies,
            escs: this.escs,
            messageFilterTypes: this.messageFilterTypes,
            modifiedBies: this.modifiedBies,
            providers: this.providers,
            providerTitles: this.providerTitles,
            schoolDistricts: this.schoolDistricts,
            serviceCodes: this.serviceCodes,
        };
        const dynamicControls = new MessageDocumentDynamicControlsPartial(this.messageDocument, additionalParams);
        // default form implementation can be overridden at the component level
        if (!configControls) {
            this.configControls = ['Description', 'FilePath', 'ServiceCodeId', 'MessageFilterTypeId'];
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
