export interface IEncounterEsign {
    AssistantSigning: boolean;
    DateESigned?: Date;
    ESignatureText?: string;
    ESignedById?: number;
    EncounterStatusId: number;
    SupervisorDateESigned?: Date;
    SupervisorESignatureText?: string;
    SupervisorESignedById?: number;
}
