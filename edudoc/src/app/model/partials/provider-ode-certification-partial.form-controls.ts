import { ProviderOdeCertificationDynamicControls, IProviderOdeCertificationDynamicControlsParameters } from '../form-controls/provider-ode-certification.form-controls';
import { IProviderOdeCertification } from '../interfaces/provider-ode-certification';
import { IProvider } from '../interfaces/provider';
import { DynamicField } from '@mt-ng2/dynamic-form';

export class ProviderOdeCertificationDynamicControlsPartial extends ProviderOdeCertificationDynamicControls {

    constructor(providerodecertificationPartial?: IProviderOdeCertification, additionalParameters?: IProviderOdeCertificationDynamicControlsParameters) {
        super(providerodecertificationPartial, additionalParameters);

        (<DynamicField>this.Form.CertificationNumber).setRequired(true);
    }
}
