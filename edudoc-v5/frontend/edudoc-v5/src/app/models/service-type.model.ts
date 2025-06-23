export enum ServiceTypeId {
  EvaluationAssessment = 1,
  OtherNonBillable = 2,
  TreatmentTherapy = 3,
}

export const ServiceTypeNames: Record<ServiceTypeId, string> = {
  [ServiceTypeId.EvaluationAssessment]: 'Evaluation/Assessment',
  [ServiceTypeId.OtherNonBillable]: 'Other (Non-Billable)',
  [ServiceTypeId.TreatmentTherapy]: 'Treatment/Therapy',
}; 