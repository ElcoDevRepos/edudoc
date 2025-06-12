using System;
using System.Collections.Generic;
using indice.Edi.Serialization;

namespace EDIX12.Models
{
    /// <summary>
    /// Roster Validation response 271
    /// Classes generated based on the following documentation
    /// https://x279.x12.org/
    /// </summary>
    public class RosterValidationResponse271
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

            public Validation Validation { get; set; }


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

            [EdiValue("X(12)", Path = "ST/2", Description = "ST03 - Implementation Convention Reference")]
            public string ImplementationConventionReference { get; set; }
            
            #endregion

            #region Hierarchical Transaction - BHT

            [EdiValue("X(5)", Path = "BHT/0", Description = "BHT01 - Trans. Set Id Code")]
            public string TransSetIdentifierCode { get; set; }


            [EdiValue("X(2)", Path = "BHT/1", Description = "BHT02 - Trans. Set Purpose Code")]
            public string TransSetPurposeCode { get; set; }

            [EdiValue("X(50)", Path = "BHT/2", Description = "BHT03 - Originator Application Transaction Identifier")]
            public string OriginatorAppTransId { get; set; }

            [EdiValue("9(8)", Path = "BHT/3", Format = "yyyyMMdd", Description = "BHT04 - Validation Date")]
            [EdiValue("9(4)", Path = "BHT/4", Format = "HHmm", Description = "BHT05 - Validation Time")]
            public DateTime ValidationDate { get; set; }
            #endregion

            [EdiCondition("20", Path = "HL/2")]
            public SourceHierarchicalLevel_2000A Source { get; set; }

            [EdiCondition("21", Path = "HL/2")]
            public List<InfoReceiverHierarchicalLevel_Loop2000B> InfoReceiver{ get; set; }

            #region Trailer - SE

            [EdiValue(Path = "SE/0", Description = "SE01 - Number of included segments")]
            public int SegmentsCounts { get; set; }

            [EdiValue("9(4)", Path = "SE/1", Description = "SE02 - Transaction set control number (same as ST02)")]
            public string TrailerTransactionSetControlNumber { get; set; }

            #endregion

        }

        [EdiSegment, EdiSegmentGroup("HL")]
        public class SourceHierarchicalLevel_2000A
        {
            #region 	HL - INFORMATION SOURCE LEVEL

            [EdiValue(Path = "HL/0", Description = "HL01 - Hierarchical ID Number")]
            public string HierarchicalID { get; set; }

            [EdiValue(Path = "HL/2", Description = "HL03 - Hierarchical Level Code")]
            public string HierarchicalLevelCode { get; set; }

            [EdiValue(Path = "HL/3", Description = "HL04 - Hierarchical Child Code")]
            public string HierarchicalChildCode { get; set; }

            public Source_Loop2100A Source { get; set; }

            #endregion

        }

        [EdiSegment, EdiPath("NM1")]
        public class Source_Loop2100A
        {
            #region NM1 - INFORMATION SOURCE NAME

            [EdiValue(Path = "NM1/0", Description = "NM101 - Entity ID Code ")]
            public string EntityIdCode { get; set; }

            [EdiValue(Path = "NM1/1", Description = "NM102 - Entity Type Qualifier")]
            public string EntityTypeQualifier { get; set; }

            [EdiValue(Path = "NM1/2", Description = "NM103 - Source Last Or OrganizationName")]
            public string SourceLastOrOrganizationName { get; set; }

            [EdiValue(Path = "NM1/7", Description = "NM108 - Source ID Code Qualifier")]
            public string SourceIDCodeQlfr { get; set; }

            [EdiValue(Path = "NM1/8", Description = "NM109 - Source ID")]
            public string SourceID { get; set; }

            #endregion

        }

        [EdiSegment, EdiSegmentGroup("HL")]
        public class InfoReceiverHierarchicalLevel_Loop2000B
        {
            #region HL - INFORMATION RECEIVER LEVEL

            [EdiValue(Path = "HL/0", Description = "HL01 - Hierarchical ID Number")]
            public string HierarchicalID { get; set; }

            [EdiValue(Path = "HL/1", Description = "HL02 - Hierarchical Parent ID Number")]
            public string HierarchicalParentID { get; set; }

            [EdiValue(Path = "HL/2", Description = "HL03 - Hierarchical Level Code")]
            public string HierarchicalLevelCode { get; set; }

            [EdiValue(Path = "HL/3", Description = "HL04 - Hierarchical Child Code")]
            public string HierarchicalChildCode { get; set; }

            [EdiCondition("1P", Path = "NM1/0")]
            public DistrictInformation_Loop2010A DistrictInformation { get; set; }

            public List<SubscriberHierarchicalLevel_Loop2000C> Students { get; set; }

            #endregion
        }

        [EdiSegment, EdiSegmentGroup("NM1", SequenceEnd = "HL")]
        public class DistrictInformation_Loop2010A
        {
            #region NM1 - District Information

            [EdiValue(Path = "NM1/0", Description = "NM101 - District ID Code")]
            public string DistrictIdCode { get; set; }

            [EdiValue(Path = "NM1/1", Description = "NM102 - District Qualifier")]
            public string DistrictQualifier { get; set; }

            [EdiValue(Path = "NM1/2", Description = "NM103 - District Last Name")]
            public string DistrictLast { get; set; }

            [EdiValue(Path = "NM1/7", Description = "NM108 - ID Code Qualifier")]
            public string DistrictIDCodeQlfr { get; set; }

            [EdiValue(Path = "NM1/8", Description = "NM109 - ID Code")]
            public string DistrictID { get; set; }

            public District_Additional_Identification District_Additional_Identification { get; set; }

            #endregion
        }

        [EdiSegment, EdiPath("REF")]
        public class District_Additional_Identification
        {
            #region REF - DISTRICT ADDITIONAL IDENTIFICATION

            [EdiValue(Path = "REF/0", Description = "REF01 - Reference ID Qualifier - {EO: Submitter Identification Number}")]
            public string ReferenceIDQlfr { get; set; }

            [EdiValue(Path = "REF/1", Description = "REF02 - District Tax ID")]
            public string DistrictTaxID { get; set; }

            #endregion
        }

        [EdiSegment, EdiSegmentGroup("HL")]
        public class SubscriberHierarchicalLevel_Loop2000C
        {

            [EdiValue(Path = "HL/0", Description = "HL01 - Hierarchical ID Number")]
            public string HierarchicalID { get; set; }

            [EdiValue(Path = "HL/1", Description = "HL02 - Hierarchical Parent ID Number")]
            public string HierarchicalParentID { get; set; }

            [EdiValue(Path = "HL/2", Description = "HL03 - Hierarchical Level Code")]
            public string HierarchicalLevelCode { get; set; }

            [EdiValue(Path = "HL/3", Description = "HL04 - Hierarchical Child Code")]
            public string HierarchicalChildCode { get; set; }

            [EdiCondition("2", Path = "TRN/0")]
            public TransactionData ReferencedTransaction { get; set; }

            [EdiCondition("1", Path = "TRN/0")]
            public TransactionData CurrentTransaction { get; set; }

            public Subscriber_Loop2100C StudentInfo { get; set; }

        }

        [EdiSegment, EdiPath("TRN")]
        public class TransactionData
        {

            #region Transaction Information

            [EdiValue(Path = "TRN/0", Description = "TRN01 - Trace Type Code - {1: Current Transaction Trace Numbers, 2: Referenced Transaction Trace Numbers}")]
            public string TraceTypeCode { get; set; }

            [EdiValue(Path = "TRN/1", Description = "TRN02 - Reference Identification - Transaction Trace Number")]
            public string ReferenceID { get; set; }

            [EdiValue(Path = "TRN/2", Description = "TRN03 - Originating Company Identifier")]
            public string OriginatorID { get; set; }

            #endregion

        }

        [EdiSegment, EdiSegmentGroup("NM1")]
        public class Subscriber_Loop2100C
        {
            #region NM1 - SUBSCRIBER NAME

            [EdiValue(Path = "NM1/0", Description = "NM101 - Entity ID Code - IL")]
            public string EntityIdCode { get; set; }

            [EdiValue(Path = "NM1/1", Description = "NM102 - Entity Type Qualifier - {1: Person}")]
            public string EntityTypeQualifier { get; set; }

            [EdiValue(Path = "NM1/2", Description = "NM103 - Subscriber Last Or Organization Name")]
            public string SubscriberLastName { get; set; }

            [EdiValue(Path = "NM1/3", Description = "NM104 - Subscriber First Name")]
            public string SubscriberFirstName { get; set; }

            [EdiValue(Path = "NM1/4", Description = "NM105 - Subscriber Middle Initial")]
            public string SubscriberMiddleInitial { get; set; }

            [EdiValue(Path = "NM1/8", Description = "NM109 - Subscriber Medicaid Number")]
            public string SubscriberMedicaidNumber { get; set; }

            #endregion

            public Subscriber_Additional_Identification Additional_Identification { get; set; }
            public Subscriber_Request_Validation Subscriber_Request_Validation { get; set; }
            public Subscriber_Demographic_Info Subscriber_Demographic_Info { get; set; }
            public Subscriber_Relationship Subscriber_Relationship { get; set; }
            public Subscriber_Date Subscriber_Date { get; set; }

            public List<Subscriber_Loop2110C> EligibilityInformation { get; set; }

        }

        [EdiSegment, EdiPath("REF")]
        public class Subscriber_Additional_Identification
        {
            #region REF - SUBSCRIBER ADDITIONAL IDENTIFICATION

            [EdiValue(Path = "REF/0", Description = "REF01 - Reference Identification Qualifier - SY")]
            public string ReferenceIDQlfr { get; set; }

            [EdiValue(Path = "REF/1", Description = "REF02 - Reference Identification")]
            public string ReferenceID { get; set; }

            #endregion
        }

        [EdiSegment, EdiPath("AAA")]
        public class Subscriber_Request_Validation
        {
            #region SUBSCRIBER REQUEST VALIDATION - AAA

            [EdiValue(Path = "AAA/0", Description = "AAA01 - Yes/No Condition or Response Code")]
            public string ResponseCode { get; set; }

            [EdiValue(Path = "AAA/1", Description = "AAA02 - Agency Qualifier Code")]
            public string AgencyQlfrCode { get; set; }

            [EdiValue(Path = "AAA/2", Description = "AAA03 - Reject Reason Code - {33: Input Errors, 75: Subscriber/Insured Not Found}")]
            public string RejectReasonCode { get; set; }

            [EdiValue(Path = "AAA/3", Description = "AAA04 - Follow-up Action Code - {C: Please Correct and Resubmit}")]
            public string FollowUpActionCode { get; set; }

            #endregion
        }

        [EdiSegment, EdiPath("DMG")]
        public class Subscriber_Demographic_Info
        {
            #region DMG - SUBSCRIBER DEMOGRAPHIC INFORMATION

            [EdiValue("X(2)", Path = "DMG/0", Description = "DMG01 - Birth Date Format - D8")]
            public string BirthDateFormat { get; set; }

            [EdiValue("9(8)", Path = "DMG/1", Format = "yyyyMMdd", Description = "DMG02 - Birth Date")]
            public DateTime BirthDate { get; set; }

            #endregion
        }


        [EdiSegment, EdiPath("INS")]
        public class Subscriber_Relationship
        {
            #region INS - SUBSCRIBER RELATIONSHIP

            [EdiValue("X(1)", Path = "INS/0", Description = "INS01 - Yes/No Condition or Response Code - Y")]
            public string RelationshipResponseCode { get; set; }

            [EdiValue("9(2)", Path = "INS/1", Description = "DMG02 - Individual Relationship Code")]
            public string IndividualRelationshipCode { get; set; }

            [EdiValue("9(3)", Path = "INS/2", Description = "INS03 - Maintenance Type Code - 001")]
            public string MaintenanceTypeCode { get; set; }

            [EdiValue("9(3)", Path = "INS/3", Description = "INS04 - Maintenance Reason Code - 25")]
            public string MaintenanceReasonCode { get; set; }

            #endregion
        }

        [EdiSegment, EdiPath("DTP")]
        public class Subscriber_Date
        {
            #region DTP - SUBSCRIBER DATE

            [EdiValue("X(3)", Path = "DTP/0", Description = "DTP01 - Date/Time Qualifier - Hardcoded 291")]
            public string DateTimeQlfr { get; set; }

            [EdiValue("X(3)", Path = "DTP/1", Description = "DTP02 - Date Time Period Format Qualifier - Hardcoded RD8")]
            public string DateTimePeriodFormatQlfr { get; set; }

            [EdiValue(Path = "DTP/2", Description = "DTP03 - Subscriber Date")]
            public string SubscriberDate { get; set; }

            #endregion
        }


        [EdiSegment, EdiSegmentGroup("EB")]
        public class Subscriber_Loop2110C
        {
            #region EB - SUBSCRIBER ELIGIBILITY OR BENEFIT INFORMATION

            [EdiValue("X(3)", Path = "EB/0", Description = "EB01 - Eligibility or Benefit Information Code")]
            public string EligibilityInformationCode { get; set; }

            [EdiValue("X(3)", Path = "EB/1", Description = "EB02 - Coverage Level Code")]
            public string CoverageLevelCode { get; set; }

            [EdiValue("X(2)", Path = "EB/2", Description = "EB03 - Service Type Code")]
            public string ServiceTypeCode { get; set; }

            [EdiValue("X(3)", Path = "EB/3", Description = "EB04 - Insurance Type Code")]
            public string InsuranceTypeCode { get; set; }

            [EdiValue("X(50)", Path = "EB/4", Description = "EB05 - Plan Coverage Description")]
            public string PlanCoverageDescription { get; set; }

            [EdiValue("9(2)", Path = "EB/5", Description = "EB06 - Time Period Qualifier")]
            public string TimePeriodQualifier { get; set; }

            [EdiValue("X(18)", Path = "EB/6", Description = "EB07 - Monetary Amount")]
            public string MonetaryAmount { get; set; }

            [EdiValue("X(10)", Path = "EB/7", Description = "EB08 - Percentage as Decimal")]
            public string Percentage { get; set; }

            [EdiValue("X(3)", Path = "EB/8", Description = "EB09 - Quantity Qualifier")]
            public string QtyQualifier { get; set; }

            [EdiValue("X(15)", Path = "EB/9", Description = "EB10 - Quantity")]
            public string Quantity { get; set; }

            [EdiValue("X(1)", Path = "EB/10", Description = "EB11 - Authorization or Certification Indicator")]
            public string AuthorizationOrCertificationIndicator { get; set; }

            [EdiValue("X(1)", Path = "EB/11", Description = "EB12 - Yes/No Condition or Response Code")]
            public string EBResponseCode { get; set; }

            #endregion

            #region DTP - SUBSCRIBER ELIGIBILITY/BENEFIT DATE

            [EdiValue("X(3)", Path = "DTP/0", Description = "DTP01 - Date/Time Qualifier - Hardcoded 307")]
            public string DateTimeQlfr { get; set; }

            [EdiValue("X(3)", Path = "DTP/1", Description = "DTP02 - Date Time Period Format Qualifier - Hardcoded RD8")]
            public string DateTimePeriodFormatQlfr { get; set; }

            [EdiValue(Path = "DTP/2", Description = "DTP03 - Subscriber Date")]
            public string SubscriberDate { get; set; }

            #endregion

            #region MSG - MESSAGE TEXT

            [EdiValue(Path = "MSG/0", Description = "MSG01 - Free-form Message Text - Partial")]
            public string Message { get; set; }

            #endregion

            public Subscriber_Loop2115C EligibilityAdditionalInfo { get; set; }

        }

        [EdiSegment, EdiSegmentGroup("LS")]
        public class Subscriber_Loop2115C
        {

            [EdiValue("X(4)", Path = "LS/0", Description = "LS01 - Loop Identifier Code")]
            public string LoopHeaderIdCode { get; set; }

            public List<SubscriberBenefitRelatedEntityName_Loop2120C> SubscriberNames { get; set; }

            [EdiValue("X(4)", Path = "LE/0", Description = "LE01 - Loop Identifier Code")]
            public string LoopTrailerIdCode { get; set; }

        }

        [EdiSegment, EdiSegmentGroup("NM1", SequenceEnd = "LE")]
        public class SubscriberBenefitRelatedEntityName_Loop2120C
        {
            #region NM1 - SUBSCRIBER BENEFIT RELATED ENTITY NAME

            [EdiValue("X(3)", Path = "NM1/0", Description = "NM101 - Benefit  ID Code - 1P")]
            public string BenefitID { get; set; }

            [EdiValue("9(1)", Path = "NM1/1", Description = "NM102 - Benefit Qualifier - 2")]
            public string BenefitQualifier { get; set; }

            [EdiValue("X(60)", Path = "NM1/2", Description = "NM103 - Benefit Last Name")]
            public string BenefitLast { get; set; }

            [EdiValue("X(2)", Path = "NM1/7", Description = "NM108 - ID Code Qualifier - SV")]
            public string ServiceProviderIDCodeQlfr { get; set; }

            [EdiValue(Path = "NM1/8", Description = "NM109 - Service Provider ID Code")]
            public string ServiceProviderID { get; set; }

            #endregion

            #region PER - SUBSCRIBER BENEFIT RELATED ENTITY CONTACT INFORMATION

            [EdiValue("X(2)", Path = "PER/0", Description = "PER01 - Contact Function Code - {IC: Information Contact}")]
            public string ContactFunctionCode { get; set; }

            [EdiValue("X(60)", Path = "PER/1", Description = "PER02 - Name")]
            public string Name { get; set; }

            [EdiValue("X(2)", Path = "PER/2", Description = "PER02 - Communication Number Qualifier")]
            public string CommunicationNumberQlfr { get; set; }

            [EdiValue(Path = "PER/3", Description = "PER02 - Communication Number")]
            public string CommunicationNumber { get; set; }

            #endregion
        }

        #region Edi Enumerations
        #endregion
    }
}
