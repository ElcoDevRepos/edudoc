using System;
using System.Collections.Generic;
using indice.Edi.Serialization;

namespace EDIX12.Models
{
    /// <summary>
    /// Health Claim Response 835
    /// Classes generated based on the following documentation
    /// https://x221.x12.org/
    /// </summary>
    public class HealthClaimResponse835
    {

        #region ISA and IEA

        [EdiValue("9(2)", Path = "ISA/0", Description = "ISA01 - Authorization Information Qualifier")]
        public int AuthorizationInformationQualifier { get; set; }

        [EdiValue("X(10)", Path = "ISA/1", Description = "ISA02 - Authorization Information")]
        public string AuthorizationInformation { get; set; }

        [EdiValue("9(2)", Path = "ISA/2", Description = "ISA03 - Security Information Qualifier")]
        public string Security_Information_Qualifier { get; set; }

        [EdiValue("X(10)", Path = "ISA/3", Description = "ISA04 - Security Information")]
        public string Security_Information { get; set; }

        [EdiValue("9(2)", Path = "ISA/4", Description = "ISA05 - Interchange ID Qualifier")]
        public string ID_Qualifier { get; set; }

        [EdiValue("X(15)", Path = "ISA/5", Description = "ISA06 - Interchange Sender ID")]
        public string Sender_ID { get; set; }

        [EdiValue("9(2)", Path = "ISA/6", Description = "ISA07 - Interchange ID Qualifier")]
        public string ID_Qualifier2 { get; set; }

        [EdiValue("X(15)", Path = "ISA/7", Description = "ISA08 - Interchange Receiver ID")]
        public string Receiver_ID { get; set; }

        [EdiValue("9(6)", Path = "ISA/8", Format = "yyMMdd", Description = "I09 - Interchange Date")]
        [EdiValue("9(4)", Path = "ISA/9", Format = "HHmm", Description = "I10 - Interchange Time")]
        public DateTime Date { get; set; }

        [EdiValue("X(1)", Path = "ISA/10", Description = "ISA11 - Repetition SeparatorID")] // Was: Interchange Control Standards ID
        public string Repetition_Separator { get; set; }

        [EdiValue("9(5)", Path = "ISA/11", Description = "ISA12 - Interchange Control Version Num")]
        public int ControlVersion { get; set; }

        [EdiValue("9(9)", Path = "ISA/12", Description = "ISA13 - Interchange Control Number")]
        public string ControlNumber { get; set; }

        [EdiValue("9(1)", Path = "ISA/13", Description = "ISA14 - Acknowledgement Requested")]
        public bool? AcknowledgementRequested { get; set; }

        [EdiValue("X(1)", Path = "ISA/14", Description = "ISA15 - Usage Indicator")]
        public string Usage_Indicator { get; set; }

        [EdiValue("X(1)", Path = "ISA/15", Description = "ISA16 - Component Element Separator")]
        public char? Component_Element_Separator { get; set; }

        [EdiValue("9(1)", Path = "IEA/0", Description = "IEA01 - Num of Included Functional Grps")]
        public int GroupsCount { get; set; }

        [EdiValue("9(9)", Path = "IEA/1", Description = "IEA02 - Interchange Control Number")]
        public string TrailerControlNumber { get; set; }

        #endregion

        public FunctionalGroup Group { get; set; }

        [EdiGroup]
        public class FunctionalGroup
        {

            #region GS and GE

            [EdiValue("X(2)", Path = "GS/0", Description = "GS01 - Functional Identifier Code")]
            public string FunctionalIdentifierCode { get; set; }

            [EdiValue("X(15)", Path = "GS/1", Description = "GS02 - Application Sender's Code")]
            public string ApplicationSenderCode { get; set; }

            [EdiValue("X(7)", Path = "GS/2", Description = "GS03 - Application Receiver's Code")]
            public string ApplicationReceiverCode { get; set; }

            [EdiValue("9(8)", Path = "GS/3", Format = "yyyyMMdd", Description = "GS04 - Date")]
            [EdiValue("9(6)", Path = "GS/4", Format = "HHmmssff", Description = "GS05 - Time")]
            public DateTime Date { get; set; }

            [EdiValue("9(9)", Path = "GS/5", Description = "GS06 - Group Control Number")]
            public string GroupControlNumber { get; set; }

            [EdiValue("X(2)", Path = "GS/6", Description = "GS07 Responsible Agency Code")]
            public string AgencyCode { get; set; }

            [EdiValue("X(12)", Path = "GS/7", Description = "GS08 Version / Release / Industry Identifier Code")]
            public string Version { get; set; }

            public List<Validation> Validations { get; set; }


            [EdiValue("9(1)", Path = "GE/0", Description = "GE01 - Number of Transaction Sets Included")]
            public int TransactionsCount { get; set; }

            [EdiValue("9(9)", Path = "GE/1", Description = "GE02 Group Control Number")]
            public string GroupTrailerControlNumber { get; set; }

            #endregion
        }

        [EdiSegment, EdiSegmentGroup("ST", SequenceEnd = "GE")]
        public class Validation
        {
            #region Header - ST

            [EdiValue("X(3)", Path = "ST/0", Description = "ST01 - Transaction set ID code")]
            public string TransactionSetCode { get; set; }

            [EdiValue("9(4)", Path = "ST/1", Description = "ST02 - Transaction set control number")]
            public string TransactionSetControlNumber { get; set; }

            public FinancialInformation FinancialInformation { get; set; }

            public ReassociationTraceNumber ReassociationTraceNumber { get; set; }

            public ReceiverIdentification ReceiverIdentification { get; set; }

            public ProductionDate ProductionDate { get; set; }

            #endregion

            [EdiCondition("PR", Path = "N1/0")]
            public PayerIdentification PayerIdentification { get; set; }

            [EdiCondition("PE", Path = "N1/0")]
            public PayeeIndentification PayeeIdentification { get; set; }

            #region Trailer - SE

            [EdiValue(Path = "SE/0", Description = "SE01 - Number of included segments")]
            public int SegmentsCounts { get; set; }

            [EdiValue("9(4)", Path = "SE/1", Description = "SE02 - Transaction set control number (same as ST02)")]
            public string TrailerTransactionSetControlNumber { get; set; }

            #endregion

        }

        [EdiSegment, EdiPath("BPR")]
        public class FinancialInformation
        {
            #region FINANCIAL INFORMATION - BHP

            [EdiValue("X(2)", Path = "BPR/0", Description = "BPR01 - Trans. Handling Code")]
            public string TransHandlingCode { get; set; }

            [EdiValue("X(18)", Path = "BPR/1", Description = "BPR02 - Monetary Amount")]
            public string MonetaryAmount { get; set; }

            [EdiValue("X(1)", Path = "BPR/2", Description = "BPR03 - Credit/Debit Flag Code")]
            public string FinancialFlagCode { get; set; }

            [EdiValue("X(3)", Path = "BPR/3", Description = "BPR04 - Payment Method Code")]
            public string PaymentMethodCode { get; set; }

            [EdiValue("9(8)", Path = "BPR/15", Format = "yyyyMMdd", Description = "BPR16 - Date")]
            public DateTime Date { get; set; }
            #endregion
        }

        [EdiSegment, EdiPath("TRN")]
        public class ReassociationTraceNumber
        {
            #region REASSOCIATION TRACE NUMBER

            [EdiValue("X(2)", Path = "TRN/0", Description = "TRN01 - Trace Type Code - {1: Current Transaction Trace Numbers}")]
            public string TraceTypeCode { get; set; }

            [EdiValue("X(50)", Path = "TRN/1", Description = "TRN02 - Reference Identification - Transaction Trace Number")]
            public string ReferenceID { get; set; }

            [EdiValue("X(10)", Path = "TRN/2", Description = "TRN03 - Originating Company Identifier")]
            public string OriginatorID { get; set; }

            #endregion
        }

        [EdiSegment, EdiPath("REF")]
        public class ReceiverIdentification
        {
            #region REF - RECEIVER IDENTIFICATION

            [EdiValue("X(3)", Path = "REF/0", Description = "REF01 - Reference ID Qualifier - {EV: Receiver Identification Number}")]
            public string ReferenceIDQlfr { get; set; }

            [EdiValue("X(50)", Path = "REF/1", Description = "REF02 - Receiver Identifier")]
            public string ReceiverId { get; set; }

            #endregion
        }

        [EdiSegment, EdiPath("DTM")]
        public class ProductionDate
        {
            #region DTM - PRODUCTION DATE

            [EdiValue("X(3)", Path = "DTM/0", Description = "DTM01 - Date/Time Qualifier - Hardcoded 405")]
            public string DateTimeQlfr { get; set; }

            [EdiValue("X(8)", Path = "DTM/1", Description = "DTM02 - PRODUCTION DATE")]
            public string Date { get; set; }

            #endregion
        }

        [EdiSegment, EdiSegmentGroup("N1")]
        public class PayerIdentification
        {
            #region N1 - PAYER IDENTIFICATION

            [EdiValue(Path = "N1/0", Description = "N101 - Entity ID Code ")]
            public string EntityIdCode { get; set; }

            [EdiValue(Path = "N1/1", Description = "N102 - Entity Type Qualifier")]
            public string EntityTypeQualifier { get; set; }

            #endregion

            public PayerAddress PayerAddress { get; set; }

            public PayerAdditionalAddressInformation PayerRelatedEntityInformation { get; set; }

            [EdiCondition("CX", Path = "PER/0")]
            public PayerRelatedEntityInformation BusinessContact { get; set; }

            [EdiCondition("BL", Path = "PER/0")]
            public PayerRelatedEntityInformation TechnicalContact { get; set; }

            [EdiCondition("IC", Path = "PER/0")]
            public PayerRelatedEntityInformation Website { get; set; }

        }

        [EdiSegment, EdiPath("N3")]
        public class PayerAddress
        {
            #region N3 - PAYER ADDRESS

            [EdiValue(Path = "N3/0", Description = "N301 - Address Information")]
            public string AddressInfo { get; set; }

            #endregion

        }

        [EdiSegment, EdiPath("N4")]
        public class PayerAdditionalAddressInformation
        {
            #region N4 - PAYER CITY, STATE, ZIP CODE

            [EdiValue("X(30)", Path = "N4/0", Description = "N401 - City Name ")]
            public string City { get; set; }

            [EdiValue("X(2)", Path = "N4/1", Description = "N402 - State or Province Code")]
            public string State { get; set; }

            [EdiValue("X(15)", Path = "N4/2", Description = "N402 - Postal Code")]
            public string PostalCode { get; set; }

            #endregion

        }

        /// <summary>
        /// PER - PAYER BUSINESS CONTACT INFORMATION
        /// PER - PAYER TECHNICAL CONTACT INFORMATION
        /// PER - PAYER WEB SITE
        /// </summary>
        [EdiSegment, EdiPath("PER")]
        public class PayerRelatedEntityInformation
        {
            #region PER - PAYER RELATED ENTITY CONTACT INFORMATION

            [EdiValue("X(2)", Path = "PER/0", Description = "PER01 - Contact Function Code - {CX: Payers Claim Office, BL: Technical Department, IC: Information Contact }")]
            public string ContactFunctionCode { get; set; }

            [EdiValue("X(60)", Path = "PER/1", Description = "PER02 - Name")]
            public string Name { get; set; }

            [EdiValue("X(2)", Path = "PER/2", Description = "PER03 - Communication Number Qualifier")]
            public string CommunicationNumberQlfr { get; set; }

            [EdiValue(Path = "PER/3", Description = "PER04 - Communication Number")]
            public string CommunicationNumber { get; set; }

            #endregion

        }

        [EdiSegment, EdiSegmentGroup("N1")]
        public class PayeeIndentification
        {
            #region N1 - PAYER IDENTIFICATION

            [EdiValue("X(3)", Path = "N1/0", Description = "N101 - Entity ID Code ")]
            public string EntityIdCode { get; set; }

            [EdiValue("X(60)", Path = "N1/1", Description = "N102 - Name")]
            public string Name { get; set; }

            [EdiValue("X(2)", Path = "N1/2", Description = "N103 - IDCode Qualifier")]
            public string IDCodeQualifier { get; set; }

            [EdiValue("X(80)", Path = "N1/3", Description = "N104 - IDCode")]
            public string IDCode { get; set; }

            #endregion
            public PayeeIdentificationN1 PayeeIdentificationN1 { get; set; }

            public PayeeAddress PayeeAddress { get; set; }

            public PayeeAdditionalAddressInformation PayeeAdditionalAddressInformation { get; set; }

            [EdiCondition("TJ", Path = "REF/0")]
            public PayeeAdditionalIdentification PayeeAdditionalIdentification { get; set; }

            // Not sure what this refers to. Likely used by Medicaid
            [EdiCondition("PQ", Path = "REF/0")]
            public PayeeAdditionalIdentification PayeeAdditionalIdentificationTJ { get; set; }

            public ClaimInformation_Loop2000 ClaimHeader { get; set; }

        }

        [EdiSegment, EdiPath("N1")]
        public class PayeeIdentificationN1
        {
            #region N1 - PAYER IDENTIFICATION

            [EdiValue("X(3)", Path = "N1/0", Description = "N101 - Entity ID Code ")]
            public string EntityIdCode { get; set; }

            [EdiValue("X(60)", Path = "N1/1", Description = "N102 - Name")]
            public string Name { get; set; }

            [EdiValue("X(2)", Path = "N1/2", Description = "N103 - IDCode Qualifier")]
            public string IDCodeQualifier { get; set; }

            [EdiValue("X(80)", Path = "N1/3", Description = "N104 - IDCode")]
            public string IDCode { get; set; }

            #endregion
        }

        [EdiSegment, EdiPath("N3")]
        public class PayeeAddress
        {
            #region N3 - PAYER ADDRESS

            [EdiValue("X(55)", Path = "N3/0", Description = "N301 - Address Information")]
            public string AddressInfo { get; set; }

            #endregion

        }

        [EdiSegment, EdiPath("N4")]
        public class PayeeAdditionalAddressInformation
        {
            #region N4 - PAYER CITY, STATE, ZIP CODE

            [EdiValue("X(30)", Path = "N4/0", Description = "N401 - City Name ")]
            public string City { get; set; }

            [EdiValue("X(2)", Path = "N4/1", Description = "N402 - State or Province Code")]
            public string State { get; set; }

            [EdiValue("X(15)", Path = "N4/2", Description = "N402 - Postal Code")]
            public string PostalCode { get; set; }

            #endregion

        }

        [EdiSegment, EdiPath("REF")]
        public class PayeeAdditionalIdentification
        {
            #region REF - PAYEE ADDITIONAL IDENTIFICATION

            [EdiValue("X(3)", Path = "REF/0", Description = "REF01 - Reference ID Qualifier - {EV: Receiver Identification Number}")]
            public string ReferenceIDQlfr { get; set; }

            [EdiValue("X(50)", Path = "REF/1", Description = "REF02 - Receiver Identifier")]
            public string ReceiverId { get; set; }

            #endregion
        }

        [EdiSegment, EdiSegmentGroup("LX", SequenceEnd = "SE")]
        public class ClaimInformation_Loop2000
        {
            #region LX - HEADER NUMBER

            [EdiValue("9(6)", Path = "LX/0", Description = "LX01 - Assigned Number")]
            public string AssignedNumber { get; set; }

            #endregion
            //public HeaderNumber HeaderNumber { get; set; }

            public ProviderSummaryInfo ProviderSummaryInfo { get; set; }

            public List<ClaimPaymentInformation_Loop2100> Claims { get; set; }

        }

        [EdiSegment, EdiPath("LX")]
        public class HeaderNumber
        {
            #region LX - HEADER NUMBER

            [EdiValue("9(6)", Path = "LX/0", Description = "LX01 - Assigned Number")]
            public string AssignedNumber { get; set; }

            #endregion
        }

        [EdiSegment, EdiPath("TS3")]
        public class ProviderSummaryInfo
        {
            #region TS3 - PROVIDER SUMMARY INFORMATION

            [EdiValue("X(50)", Path = "TS3/0", Description = "TS301 - Reference Identification")]
            public string ReferenceID { get; set; }

            [EdiValue("X(2)", Path = "TS3/1", Description = "TS302 - Facility Code Value")]
            public string FacilityCode { get; set; }

            [EdiValue("9(8)", Path = "TS3/2", Format = "yyyyMMdd", Description = "TS303 - Date")]
            public DateTime Date { get; set; }

            [EdiValue("X(8)", Path = "TS3/3", Description = "TS304 - Quantity")]
            public string Quantity { get; set; }

            [EdiValue("X(15)", Path = "TS3/4", Description = "TS305 - Monetary Amount")]
            public string MonetaryAmount { get; set; }

            #endregion
        }

        [EdiSegment, EdiSegmentGroup("CLP")]
        public class ClaimPaymentInformation_Loop2100
        {
            #region CLP - CLAIM PAYMENT INFORMATION

            [EdiValue("X(50)", Path = "CLP/0", Description = "CLP01 - Claim Submitter's Identifier")]
            public string SubmitterId { get; set; }

            [EdiValue("X(2)", Path = "CLP/1", Description = "CLP02 - Claim Status Code")]
            public string StatusCode { get; set; }

            [EdiValue("X(18)", Path = "CLP/2", Description = "CLP03 - Total Claim Charge Amount")]
            public string TotalChargeAmount { get; set; }

            [EdiValue("X(18)", Path = "CLP/3", Description = "CLP04 - Claim Payment Amount")]
            public string PaymentAmount { get; set; }

            [EdiValue("X(18)", Path = "CLP/4", Description = "CLP05 - Patient Responsibility Amount")]
            public string PatientResponsibilityAmount { get; set; }

            [EdiValue("X(2)", Path = "CLP/5", Description = "CLP06 - Claim Filing Indicator Code")]
            public string FilingCode { get; set; }

            [EdiValue("X(50)", Path = "CLP/6", Description = "CLP07 - Reference Identification")]
            public string ReferenceId { get; set; }

            [EdiValue("X(2)", Path = "CLP/7", Description = "CLP08 - Facility Type Code")]
            public string FacilityCode { get; set; }

            [EdiValue("X(1)", Path = "CLP/8", Description = "CLP09 - Claim Frequency Code")]
            public string FrequencyCode { get; set; }

            #endregion
            //public ClaimPaymentInfo ClaimPaymentInfo { get; set; }

            [EdiCondition("QC", Path = "NM1/0")]
            public PatientName PatientName { get; set; }

            [EdiCondition("82", Path = "NM1/0")]
            public ServiceProviderName ServiceProviderName { get; set; }

            [EdiCondition("232", Path = "DTM/0")]
            public StatementDate StatementDateFrom { get; set; }

            [EdiCondition("233", Path = "DTM/0")]
            public StatementDate StatementDateTo { get; set; }

            [EdiCondition("050", Path = "DTM/0")]
            public StatementDate StatementDateProcessed { get; set; }

            public ServicePaymentInformation_Loop2110 ServicePaymentInformation_Loop2110 { get; set; }


        }

        [EdiSegment, EdiPath("CLP")]
        public class ClaimPaymentInfo
        {
            #region CLP - CLAIM PAYMENT INFORMATION

            [EdiValue("X(50)", Path = "CLP/0", Description = "CLP01 - Claim Submitter's Identifier")]
            public string SubmitterId { get; set; }

            [EdiValue("X(2)", Path = "CLP/1", Description = "CLP02 - Claim Status Code")]
            public string StatusCode { get; set; }

            [EdiValue("X(18)", Path = "CLP/2", Description = "CLP03 - Total Claim Charge Amount")]
            public string TotalChargeAmount { get; set; }

            [EdiValue("X(18)", Path = "CLP/3", Description = "CLP04 - Claim Payment Amount")]
            public string PaymentAmount { get; set; }

            [EdiValue("X(18)", Path = "CLP/4", Description = "CLP05 - Patient Responsibility Amount")]
            public string PatientResponsibilityAmount { get; set; }

            [EdiValue("X(2)", Path = "CLP/5", Description = "CLP06 - Claim Filing Indicator Code")]
            public string FilingCode { get; set; }

            [EdiValue("X(50)", Path = "CLP/6", Description = "CLP07 - Reference Identification")]
            public string ReferenceId { get; set; }

            [EdiValue("X(2)", Path = "CLP/7", Description = "CLP08 - Facility Type Code")]
            public string FacilityCode { get; set; }

            [EdiValue("X(1)", Path = "CLP/8", Description = "CLP09 - Claim Frequency Code")]
            public string FrequencyCode { get; set; }

            #endregion
        }


        [EdiSegment, EdiPath("NM1")]
        public class PatientName
        {
            #region NM1 - PATIENT NAME

            [EdiValue("X(3)", Path = "NM1/0", Description = "NM101 - Entity ID Code - QC")]
            public string EntityIdCode { get; set; }

            [EdiValue("X(1)", Path = "NM1/1", Description = "NM102 - Entity Type Qualifier - {1: Person}")]
            public string EntityTypeQualifier { get; set; }

            [EdiValue("X(60)", Path = "NM1/2", Description = "NM103 - Patient Last Name")]
            public string PatientLastName { get; set; }

            [EdiValue("X(35)", Path = "NM1/3", Description = "NM104 - Patient First Name")]
            public string PatientFirstName { get; set; }

            [EdiValue("X(2)", Path = "NM1/7", Description = "NM108 - Identification Code Qualifier")]
            public string IDCodeQlfr { get; set; }

            [EdiValue("X(80)", Path = "NM1/8", Description = "NM109 - Patient Identifier")]
            public string IDCode { get; set; }

            #endregion
        }

        [EdiSegment, EdiPath("NM1")]
        public class ServiceProviderName
        {
            #region NM1 - SERVICE PROVIDER NAME

            [EdiValue("X(3)", Path = "NM1/0", Description = "NM101 - Entity ID Code - 82")]
            public string EntityIdCode { get; set; }

            [EdiValue("X(1)", Path = "NM1/1", Description = "NM102 - Entity Type Qualifier - {2: Non-Person}")]
            public string EntityTypeQualifier { get; set; }

            [EdiValue("X(60)", Path = "NM1/2", Description = "NM103 - Rendering Provider Last Name")]
            public string RenderingProviderLastName { get; set; }

            [EdiValue("X(35)", Path = "NM1/3", Description = "NM104 - Rendering Provider First Name")]
            public string RenderingProviderFirstName { get; set; }

            [EdiValue("X(2)", Path = "NM1/7", Description = "NM108 - Identification Code Qualifier")]
            public string IDCodeQlfr { get; set; }

            [EdiValue("X(80)", Path = "NM1/8", Description = "NM109 - Patient Identifier")]
            public string IDCode { get; set; }

            #endregion
        }

        [EdiSegment, EdiPath("DTM")]
        public class StatementDate
        {
            #region DTM - STATEMENT FROM OR TO DATE

            [EdiValue("X(3)", Path = "DTM/0", Description = "DTM01 - Date/Time Qualifier - {232: Period Start, 233: Period End}")]
            public string DateTimeQlfr { get; set; }

            [EdiValue("X(8)", Path = "DTM/1", Description = "DTM02 - Claim Date")]
            public string Date { get; set; }

            #endregion
        }

        [EdiSegment, EdiSegmentGroup("SVC")]
        public class ServicePaymentInformation_Loop2110
        {
            #region SVC - SERVICE PAYMENT INFORMATION

            [EdiValue(Path = "SVC/0", Description = "SVC01 - Composite Medical Procedure Identifier")]
            public string CompositeMedicalProcedureId { get; set; }

            [EdiValue("X(18)", Path = "SVC/1", Description = "SVC02 - Product or Service ID Qualifier")]
            public string ServiceIDQlfr { get; set; }

            [EdiValue("X(18)", Path = "SVC/2", Description = "SVC03 - Adjudicated Procedure Code")]
            public string AdjudicatedProcedureCode { get; set; }

            [EdiValue("X(15)", Path = "SVC/4", Description = "SVC05 - Units of Service Paid Count")]
            public string ServiceUnitsPaid { get; set; }

            [EdiValue("X(15)", Path = "SVC/6", Description = "SVC07 - Original Units of Service Count")]
            public string ServiceUnitsCharged { get; set; }

            #endregion
            //public ServicePaymentInfo ServicePaymentInfo { get; set; }

            public ServiceDate ServiceDate { get; set; }

            public ServiceAdjustment ServiceAdjustment { get; set; }

            [EdiCondition("6R", Path = "REF/0")]
            public LineItemControlNumber LineItemControlNumber { get; set; }

            [EdiCondition("HPI", Path = "REF/0")]
            public RenderingProviderInformation RenderingProviderInformation { get; set; }

            public HealthCareRemarks HealthCareRemarks { get; set; }


        }

        [EdiSegment, EdiPath("SVC")]
        public class ServicePaymentInfo
        {
            #region SVC - SERVICE PAYMENT INFORMATION

            [EdiValue(Path = "SVC/0", Description = "SVC01 - Composite Medical Procedure Identifier")]
            public string CompositeMedicalProcedureId { get; set; }

            [EdiValue("X(18)", Path = "SVC/1", Description = "SVC02 - Product or Service ID Qualifier")]
            public string ServiceIDQlfr { get; set; }

            [EdiValue("X(18)", Path = "SVC/2", Description = "SVC03 - Adjudicated Procedure Code")]
            public string AdjudicatedProcedureCode { get; set; }

            [EdiValue("X(15)", Path = "SVC/4", Description = "SVC05 - Units of Service Paid Count")]
            public string ServiceUnitsPaid { get; set; }

            [EdiValue("X(15)", Path = "SVC/6", Description = "SVC07 - Original Units of Service Count")]
            public string ServiceUnitsCharged { get; set; }

            #endregion
        }

        [EdiSegment, EdiPath("DTM")]
        public class ServiceDate
        {
            #region DTM - SERVICE DATE

            [EdiValue("X(3)", Path = "DTM/0", Description = "DTM01 - Date/Time Qualifier - {232: Period Start, 233: Period End}")]
            public string DateTimeQlfr { get; set; }

            [EdiValue("X(8)", Path = "DTM/1", Description = "DTM02 - Service Date")]
            public string Date { get; set; }

            #endregion
        }

        [EdiSegment, EdiPath("CAS")]
        public class ServiceAdjustment
        {
            #region CAS - SERVICE ADJUSTMENT

            [EdiValue("X(2)", Path = "CAS/0", Description = "CAS01 - Claim Adjustment Group Code")]
            public string GroupCode { get; set; }

            [EdiValue("X(5)", Path = "CAS/1", Description = "CAS02 - Adjustment Reason Code")]
            public string AdjustmentReasonCode { get; set; }

            [EdiValue("X(18)", Path = "CAS/2", Description = "CAS03 - Adjustment Amounte")]
            public string AdjustmentAmount { get; set; }

            #endregion
        }

        [EdiSegment, EdiPath("REF")]
        public class LineItemControlNumber
        {
            #region REF - LINE ITEM CONTROL NUMBER

            [EdiValue("X(3)", Path = "REF/0", Description = "REF01 - Reference ID Qualifier - {6R: Provider Control Number}")]
            public string ReferenceIDQlfr { get; set; }

            [EdiValue("X(50)", Path = "REF/1", Description = "REF02 - Line Item Control Number")]
            public string ControlNumber { get; set; }

            #endregion
        }

        [EdiSegment, EdiPath("REF")]
        public class RenderingProviderInformation
        {
            #region REF - RENDERING PROVIDER INFORMATION

            [EdiValue("X(3)", Path = "REF/0", Description = "REF01 - Reference ID Qualifier - {HPI: Centers for Medicare and Medicaid Services National Provider Identifier}")]
            public string ReferenceIDQlfr { get; set; }

            [EdiValue("X(50)", Path = "REF/1", Description = "REF02 - Rendering Provider Identifier")]
            public string RenderingProviderID { get; set; }

            #endregion
        }

        [EdiSegment, EdiPath("LQ")]
        public class HealthCareRemarks
        {
            #region LQ - HEALTH CARE REMARK CODES

            [EdiValue("X(3)", Path = "LQ/0", Description = "LQ01 - Code List Qualifier Code")]
            public string AssignedNumber { get; set; }

            [EdiValue("X(30)", Path = "LQ/1", Description = "LQ02 - Remark Code")]
            public string RemarkCode { get; set; }

            #endregion
        }


        #region Edi Enumerations
        #endregion
    }
}
