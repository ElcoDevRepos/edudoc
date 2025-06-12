import { IEntity } from './base';

import { ICptCodeAssocation } from './cpt-code-assocation';
import { IDiagnosisCodeAssociation } from './diagnosis-code-association';
import { IEncounter } from './encounter';
import { IPendingReferral } from './pending-referral';

export interface IServiceType extends IEntity {
    Name: string;
    Code: string;

    // reverse nav
    CptCodeAssocations?: ICptCodeAssocation[];
    DiagnosisCodeAssociations?: IDiagnosisCodeAssociation[];
    Encounters?: IEncounter[];
    PendingReferrals?: IPendingReferral[];
}
