using System;
using System.Collections.Generic;
using indice.Edi.Serialization;

namespace EDIX12.Models
{
    /// <summary>
    /// Health Claim 837P
    /// Classes generated based on the following documentation
    /// https://docs.google.com/spreadsheets/d/1GmM9M3VqfN0VC9XiwuKxL6LCycl2niUZ/edit#gid=1947385482
    /// </summary>
    public class HealthClaim837P
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

        [EdiValue("X(1)", Path = "ISA/10", Description = "ISA11 - Repetition SeparatorD")] // Was: Interchange Control Standards ID
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

        public List<FunctionalGroup> Groups { get; set; }

        [EdiGroup]
        public class FunctionalGroup
        {

            [EdiValue("X(2)", Path = "GS/0", Description = "GS01 - Functional Identifier Code")]
            public string FunctionalIdentifierCode { get; set; }

            [EdiValue("X(15)", Path = "GS/1", Description = "GS02 - Application Sender's Code")]
            public string ApplicationSenderCode { get; set; }

            [EdiValue("X(7)", Path = "GS/2", Description = "GS03 - Application Receiver's Code")]
            public string ApplicationReceiverCode { get; set; }

            [EdiValue("9(8)", Path = "GS/3", Format = "yyyyMMdd", Description = "GS04 - Date")]
            [EdiValue("9(4)", Path = "GS/4", Format = "HHmmss", Description = "GS05 - Time")]
            public DateTime Date { get; set; }

            [EdiValue("9(9)", Path = "GS/5", Description = "GS06 - Group Control Number")]
            public string GroupControlNumber { get; set; }

            [EdiValue("X(2)", Path = "GS/6", Format = "HHmm", Description = "GS07 Responsible Agency Code")]
            public string AgencyCode { get; set; }

            [EdiValue("X(2)", Path = "GS/7", Format = "HHmm", Description = "GS08 Version / Release / Industry Identifier Code")]
            public string Version { get; set; }

            public List<Claim> Claims { get; set; }


            [EdiValue("9(1)", Path = "GE/0", Description = "GE01 - Number of Transaction Sets Included")]
            public int TransactionsCount { get; set; }

            [EdiValue("9(9)", Path = "GE/1", Description = "GE02 Group Control Number")]
            public string GroupTrailerControlNumber { get; set; }
        }

        [EdiMessage]
        public class Claim
        {
            #region Header Trailer

            [EdiValue("X(3)", Path = "ST/0", Description = "ST01 - Transaction set ID code")]
            public string TransactionSetCode { get; set; }

            [EdiValue("9(4)", Path = "ST/1", Description = "ST02 - Transaction set control number")]
            public string TransactionSetControlNumber { get; set; }

            [EdiValue("X(12)", Path = "ST/2", Description = "ST03 - Implementation Convention Reference")]
            public string ImplementationConventionReference { get; set; }

            [EdiValue(Path = "SE/0", Description = "SE01 - Number of included segments")]
            public int SegmentsCounts { get; set; }

            [EdiValue("9(4)", Path = "SE/1", Description = "SE02 - Transaction set control number (same as ST02)")]
            public string TrailerTransactionSetControlNumber { get; set; }
            #endregion

            #region Hierarchical Transaction

            [EdiValue("X(5)", Path = "BHT/0", Description = "BHT01 - Trans. Set Id Code")]
            public string TransSetIdentifierCode { get; set; }


            [EdiValue("X(2)", Path = "BHT/1", Description = "BHT02 - Trans. Set Purpose Code")]
            public string TransSetPurposeCode { get; set; }

            [EdiValue("X(20)", Path = "BHT/2", Description = "BHT03 - Originator Application Transaction Identifier")]
            public string OriginatorAppTransId { get; set; }

            [EdiValue("9(8)", Path = "BHT/3", Format = "yyyyMMdd", Description = "BHT04 - Claim Date")]
            [EdiValue("9(4)", Path = "BHT/4", Format = "HHmmss", Description = "BHT05 - Claim Time")]
            public DateTime ClaimDate { get; set; }

            [EdiValue("X(2)", Path = "BHT/5", Description = "BHT06 - Claim Identifier")]
            public string ClaimId { get; set; }

            public Submitter_Loop1000A Submitter { get; set; }
            public SubmitterContactInformation_Loop1000A SubmitterInfo { get; set; }
            public Receiver_Loop1000B Receiver { get; set; }

            public SubscriberHierarchicalLevel_Loop2000A SubscriberHierarchy { get; set; }

            #endregion

        }

        [EdiSegment, EdiSegmentGroup("NM1", SequenceEnd = "PER")]
        public class Submitter_Loop1000A
        {

            [EdiValue(Path = "NM1/0", Description = "NM101 - Entity ID Code - NM1")]
            public string EntityIdCode { get; set; }

            [EdiValue(Path = "NM1/1", Description = "NM102 - Entity Type Qualifier")]
            public string EntityTypeQualifier { get; set; }

            [EdiValue(Path = "NM1/2", Description = "NM103 - Submitter Last Or OrganizationName")]
            public string SubmitterLastOrOrganizationName { get; set; }

            [EdiValue(Path = "NM1/7", Description = "NM108 - Submitter ID Code Qualifier")]
            public string SubmitterIDCodeQlfr { get; set; }

            [EdiValue(Path = "NM1/8", Description = "NM109 - Submitter ID")]
            public string SubmitterID { get; set; }

        }

        [EdiSegment, EdiSegmentGroup("PER")]
        public class SubmitterContactInformation_Loop1000A
        {

            [EdiValue(Path = "PER/0", Description = "PER01 - Submitter Type Code Qualifier")]
            public string SubmitterCodeType { get; set; }

            [EdiValue(Path = "PER/1", Description = "PER02 - Submitter Contact Name")]
            public string SubmitterName { get; set; }

            [EdiValue(Path = "PER/2", Description = "PER03 - Communication Number Qualifier")]
            public string SubmitterPhoneQlfr { get; set; }

            [EdiValue(Path = "PER/3", Description = "PER04 - Communication Number")]
            public string SubmitterPhone { get; set; }

            [EdiValue(Path = "PER/4", Description = "PER05 - Alternate Communication Number Qualifier")]
            public string SubmitterPhoneAltQlfr { get; set; }

            [EdiValue(Path = "PER/5", Description = "PER06 - Alternate Communication Number ")]
            public string SubmitterPhoneAlt { get; set; }

            [EdiValue(Path = "PER/6", Description = "PER07 - Email Qualifier")]
            public string SubmitterEmailQlfr { get; set; }

            [EdiValue(Path = "PER/7", Description = "PER08 - EmailAddress")]
            public string SubmitterEmail { get; set; }

        }

        [EdiSegment, EdiSegmentGroup("NM1")]
        public class Receiver_Loop1000B
        {

            [EdiValue(Path = "NM1/0", Description = "NM101 - Entity ID Code")]
            public string EntityIdCode { get; set; }

            [EdiValue(Path = "NM1/1", Description = "NM102 - Entity Type Qualifier")]
            public string EntityTypeQualifier { get; set; }

            [EdiValue(Path = "NM1/2", Description = "NM103 - Receiver Last Or OrganizationName")]
            public string ReceiverLastOrOrganizationName { get; set; }

            [EdiValue(Path = "NM1/3", Description = "NM104 - Receiver First Name")]
            public string ReceiverFirst { get; set; }

            [EdiValue(Path = "NM1/4", Description = "NM105 - Receiver Middle Name")]
            public string ReceiverMiddle { get; set; }

            [EdiValue(Path = "NM1/7", Description = "NM108 - Receiver ID Code Qualifier")]
            public string ReceiverIDCodeQlfr { get; set; }

            [EdiValue(Path = "NM1/8", Description = "NM109 - Receiver ID")]
            public string ReceiverID { get; set; }

        }



        [EdiSegment, EdiSegmentGroup("NM1")]
        public class BillingProviderName_Loop2010A
        {

            [EdiValue(Path = "NM1/0", Description = "NM108 - Billing Provider ID Code Qualifier")]
            public string BillingProviderIDCodeQlfr { get; set; }

            [EdiValue(Path = "NM1/1", Description = "NM109 - Billing Provider ID")]
            public string BillingProviderID { get; set; }

            [EdiValue(Path = "N4/2", Description = "N403 - Country Code")]
            public string Zip { get; set; }

            [EdiValue(Path = "REF/1", Description = "REF01 - Reference ID Qualifier")]
            public string ReferenceIDQlfr { get; set; }

            [EdiValue(Path = "REF/2", Description = "REF02 - Billing Provider Tax ID")]
            public string BillingProviderTaxID { get; set; }

        }

        [EdiSegment, EdiSegmentGroup("HL")]
        public class SubscriberHierarchicalLevel_Loop2000A
        {

            [EdiValue(Path = "HL/0", Description = "HL01 - Hierarchical ID Number")]
            public string HierarchicalID { get; set; }

            [EdiValue(Path = "HL/2", Description = "HL03 - Hierarchical Level Code")]
            public string HierarchicalLevelCode { get; set; }

            [EdiValue(Path = "HL/3", Description = "HL04 - Hierarchical Child Code")]
            public string HierarchicalChildCode { get; set; }

            #region Provider Information

            [EdiValue(Path = "PRV/0", Description = "PRV01 - Provider Code")]
            public string ProviderCode { get; set; }

            [EdiValue(Path = "PRV/1", Description = "PRV02 - Reference ID Qualifier")]
            public string ReferenceIDQlfr { get; set; }

            [EdiValue(Path = "PRV/2", Description = "PRV03 - Reference ID")]
            public string ReferenceID { get; set; }

            #endregion

            public BillingProvider_Loop2010A BillingProvider { get; set; }

            public List<SubscriberHierarchicalLevel_Loop2000B> Students { get; set; }
        }

        [EdiSegment, EdiSegmentGroup("HL")]
        public class BillingProvider_Loop2010A
        {
            #region Billing Provider Information
            [EdiValue(Path = "NM1/0", Description = "NM101 - Billing Provider ID Code")]
            public string BillingProviderIdCode { get; set; }

            [EdiValue(Path = "NM1/1", Description = "NM102 - Billing Provider Qualifier")]
            public string BillingProviderQualifier { get; set; }

            [EdiValue(Path = "NM1/2", Description = "NM103 - Billing Provider Last Name")]
            public string BillingProviderLast { get; set; }

            [EdiValue(Path = "NM1/7", Description = "NM108 - ID Code Qualifier")]
            public string BillingProviderIDCodeQlfr { get; set; }

            [EdiValue(Path = "NM1/8", Description = "NM109 - ID Code")]
            public string BillingProviderID { get; set; }


            #endregion

            #region Billing Provider Address

            [EdiValue(Path = "N3/0", Description = "N301 - Billing Provider Address 1")]
            public string BillingProviderAddress1 { get; set; }

            [EdiValue(Path = "N4/0", Description = "N401 - Billing Provider City")]
            public string BillingProviderCity { get; set; }

            [EdiValue(Path = "N4/1", Description = "N402 - Billing Provider State Or Province")]
            public string BillingProviderState { get; set; }

            [EdiValue(Path = "N4/2", Description = "N403 - Billing Provider Zip")]
            public string BillingProviderZip { get; set; }

            #endregion

            [EdiValue(Path = "REF/0", Description = "REF01 - Reference ID Qualifier")]
            public string ReferenceIDQlfr { get; set; }

            [EdiValue(Path = "REF/1", Description = "REF02 - Billing Provider Tax ID")]
            public string BillingProviderTaxID { get; set; }

        }

        [EdiSegment, EdiSegmentGroup("HL")]
        public class SubscriberHierarchicalLevel_Loop2000B
        {

            [EdiValue(Path = "HL/0", Description = "HL01 - Hierarchical ID Number")]
            public string HierarchicalID { get; set; }

            [EdiValue(Path = "HL/1", Description = "HL02 - Hierarchical Parent ID Number")]
            public string HierarchicalParentID { get; set; }

            [EdiValue(Path = "HL/2", Description = "HL03 - Hierarchical Level Code")]
            public string HierarchicalLevelCode { get; set; }

            [EdiValue(Path = "HL/3", Description = "HL04 - Hierarchical Child Code")]
            public string HierarchicalChildCode { get; set; }

            #region Subscriber Information

            [EdiValue(Path = "SBR/0", Description = "SBR01 - Provider Code")]
            public string ProviderCode { get; set; }

            [EdiValue(Path = "SBR/1", Description = "SBR02 - Reference ID Qualifier")]
            public string ReferenceIDQlfr { get; set; }

            [EdiValue(Path = "SBR/8", Description = "SBR09 - Claim Filing Indicator Code")]
            public string ClaimFilingIDCode { get; set; }

            #endregion

            public Subscriber_Loop2010BA StudentInfo { get; set; }

            public Payer_Loop2010BB PayerInfo { get; set; }

            public List<ClaimInformation_Loop2300> Encounters { get; set; }


        }

        [EdiSegment, EdiSegmentGroup("NM1")]
        public class Subscriber_Loop2010BA
        {

            [EdiValue(Path = "NM1/0", Description = "NM101 - Entity ID Code")]
            public string EntityIdCode { get; set; }

            [EdiValue(Path = "NM1/1", Description = "NM102 - Entity Type Qualifier")]
            public string EntityTypeQualifier { get; set; }

            [EdiValue(Path = "NM1/2", Description = "NM103 - Subscriber Last Or Organization Name")]
            public string SubscriberLastName { get; set; }

            [EdiValue(Path = "NM1/3", Description = "NM104 - Subscriber First Name")]
            public string SubscriberFirst { get; set; }

            [EdiValue(Path = "NM1/7", Description = "NM108 - Subscriber ID Code Qualifier")]
            public string SubscriberIDCodeQlfr { get; set; }

            [EdiValue(Path = "NM1/8", Description = "NM109 - Subscriber ID")]
            public string SubscriberID { get; set; }

            #region Billing Provider Address 2010B A

            [EdiValue(Path = "N3/0", Description = "N301 - Billing Provider Address 1")]
            public string BillingProviderAddress1 { get; set; }

            [EdiValue(Path = "N4/0", Description = "N401 - Billing Provider City")]
            public string BillingProviderCity { get; set; }

            [EdiValue(Path = "N4/1", Description = "N402 - Billing Provider State Or Province")]
            public string BillingProviderState { get; set; }

            [EdiValue(Path = "N4/2", Description = "N403 - Billing Provider Zip")]
            public string BillingProviderZip { get; set; }

            #endregion

            #region Subscriber Demographic Information 2010B A

            [EdiValue("X(2)", Path = "DMG/0", Description = "DMG01 - Birth Date Format - D8")]
            public string BirthDateFormat { get; set; }

            [EdiValue("9(8)", Path = "DMG/1", Format = "yyyyMMdd", Description = "DMG02 - Birth Date")]
            public string BirthDate { get; set; }

            [EdiValue(Path = "DMG/2", Description = "DMG03 - Gender")]
            public string Gender { get; set; }

            #endregion

        }

        [EdiSegment, EdiSegmentGroup("NM1")]
        public class Payer_Loop2010BB
        {

            [EdiValue("X(2)", Path = "NM1/0", Description = "NM101 - Entity ID Code")]
            public string EntityIdCode { get; set; }

            [EdiValue("9(1)", Path = "NM1/1", Description = "NM102 - Entity Type Qualifier")]
            public string EntityTypeQualifier { get; set; }

            [EdiValue(Path = "NM1/2", Description = "NM103 - Payer Last Or Organization Name")]
            public string PayerLastName { get; set; }

            [EdiValue(Path = "NM1/7", Description = "NM108 - Payer ID Code Qualifier")]
            public string PayerIDCodeQlfr { get; set; }

            [EdiValue(Path = "NM1/8", Description = "NM109 - Payer ID")]
            public string PayerID { get; set; }

        }

        [EdiMessage, EdiSegmentGroup("CLM")]
        public class ClaimInformation_Loop2300
        {

            #region Claim Information Loop 2300

            [EdiValue("X(3)", Path = "CLM/0", Description = "CLM01 - Patient Control Number")]
            public string PatientControlNumber { get; set; }

            [EdiValue("9(4)", Path = "CLM/1", Description = "CLM02 - Total Claim Charge Amount")]
            public string TotalClaimChargeAmount { get; set; }

            [EdiValue(Path = "CLM/4", Description = "CLM05 - Service Location Code")]
            public string ServiceLocationCode { get; set; }

            [EdiValue("9(4)", Path = "CLM/5", Description = "CLM06 - Provider Signature Indicator")]
            public string ProviderSignatureIndicator { get; set; }

            [EdiValue("X(5)", Path = "CLM/6", Description = "CLM07 - Medicare Assignment Code ")]
            public string MedicareAssignmentCode { get; set; }

            [EdiValue("X(2)", Path = "CLM/7", Description = "CLM08 - Benefits Assignment Certification Indicator ")]
            public string BenefitsAssignmentCertIndicator { get; set; }

            [EdiValue("X(20)", Path = "CLM/8", Description = "CLM09 - Release of Information Code")]
            public string ReleaseOfInformationCode { get; set; }

            #endregion

            #region Billing Note Loop 2300

            [EdiValue("X(3)", Path = "NTE/0", Description = "NTE01 - Note Reference Code - CER")]
            public string NoteReferenceCode { get; set; }

            [EdiValue("X(80)", Path = "NTE/1", Description = "NTE02 - Claim Note Text - ATTEST YES")]
            public string ClaimNoteText { get; set; }

            #endregion

            #region Health Care Diagnosis Code Loop 2300

            [EdiValue(Path = "HI/0", Description = "HI01-2 - Principal Diagnosis Code ")]
            public string PrincipalDiagnosisCode { get; set; }

            public ReferingProvider_Loop2010BB ReferingProvider { get; set; }

            #endregion
            public ProfessionalService_Loop2400 ProfessionalService { get; set; }

        }

        [EdiMessage, EdiSegmentGroup("SV1")]
        public class ProfessionalService_Loop2400
        {
            [EdiValue(Path = "LX/0", Description = "LX01 - Assigned Number - Conditionally Shown")]
            public string AssignedNumber { get; set; }

            #region Professional Service Loop 2400

            [EdiValue("X(3)", Path = "SV1/0", Description = "SV101 - Composite Medical Procedure Identifier")]
            public string CompositeMedicalProcedureID { get; set; }

            [EdiValue("X(3)", Path = "SV1/1", Description = "SV102 - Line Item Charge Amount")]
            public string LineItemChargeAmount { get; set; }

            [EdiValue("X(2)", Path = "SV1/2", Description = "SV103 - Unit or Basis of Measurement Code")]
            public string UnitOfMeasurement { get; set; }

            [EdiValue("9(5)", Path = "SV1/3", Description = "SV104 - Service Unit Count")]
            public string ServiceUnitCount { get; set; }

            [EdiValue("9(5)", Path = "SV1/4", Description = "SV105 - Place of Service Code - Harcoded 08")]
            public string PlaceOfServiceCode { get; set; }

            [EdiValue("9(5)", Path = "SV1/6", Description = "SV107 - Composite Diagnosis Code Pointer")]
            public string CompositeDiagnosisCodePointer { get; set; }
            
            [EdiValue("9(5)", Path = "SV1/8", Description = "SV109 - Yes/ No Condition or Response Code")]
            public string YesNoConditionResponseCode { get; set; }

            #endregion

            #region Service Date Loop 2400

            [EdiValue("X(3)", Path = "DTP/0", Description = "DTP01 - Note Reference Code - Hardcoded 472")]
            public string NoteReferenceCode { get; set; }

            [EdiValue("X(2)", Path = "DTP/1", Description = "DTP02 - Date Time Period Format Qualifier - Hardcoded D8")]
            public string DateTimePeriodFormatQlfr { get; set; }

            [EdiValue("9(8)", Path = "DTP/2", Format = "yyyyMMdd", Description = "DTP03 - Service Date")]
            public DateTime ServiceDate { get; set; }

            #endregion

            #region Line Item Control Number Loop 2400

            [EdiValue(Path = "REF/0", Description = "REF01 - Reference ID Qualifier - 6R")]
            public string ReferenceIDQlfr { get; set; }

            [EdiValue(Path = "REF/1", Description = "REF02 - Line Item Control Number")]
            public string LineItemControlNumber { get; set; }

            #endregion

        }

        [EdiMessage, EdiSegmentGroup("NM")]
        public class ReferingProvider_Loop2010BB
        {
            [EdiValue(Path = "NM1/0", Description = "NM101 - Refering Provider ID Code")]
            public string ReferingProviderIdCode { get; set; }

            [EdiValue(Path = "NM1/1", Description = "NM102 - Refering Provider Qualifier")]
            public string ReferingProviderQualifier { get; set; }

            [EdiValue(Path = "NM1/2", Description = "NM103 - Refering Provider Last Name")]
            public string ReferingProviderLast { get; set; }

            [EdiValue(Path = "NM1/3", Description = "NM104 - Refering Provider First Name")]
            public string ReferingProviderFirst { get; set; }

            [EdiValue(Path = "NM1/7", Description = "NM108 - Refering Provider ID Code Qualifier")]
            public string ReferingProviderIDCodeQlfr { get; set; }

            [EdiValue(Path = "NM1/8", Description = "NM109 - Refering Provider ID Code")]
            public string ReferingProviderID { get; set; }

        }

        #region Edi Enumerations
        #endregion
    }
}
