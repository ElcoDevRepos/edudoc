using System;
using System.Collections.Generic;
using indice.Edi.Serialization;

namespace EDIX12.Models
{
    /// <summary>
    /// Roster Validation 270
    /// Classes generated based on the following documentation
    /// https://drive.google.com/file/d/1QttfQgpk15Ph6iJ4Oophl54q9bdKW1K-/view
    /// </summary>
    public class RosterValidation270
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

        [EdiValue("X(7)", Path = "ISA/5", Description = "ISA06 - Interchange Sender ID")]
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
            [EdiValue("9(4)", Path = "GS/4", Format = "HHmm", Description = "GS05 - Time")]
            public DateTime Date { get; set; }

            [EdiValue("9(9)", Path = "GS/5", Description = "GS06 - Group Control Number")]
            public string GroupControlNumber { get; set; }

            [EdiValue("X(2)", Path = "GS/6", Format = "HHmm", Description = "GS07 Responsible Agency Code")]
            public string AgencyCode { get; set; }

            [EdiValue("X(2)", Path = "GS/7", Format = "HHmm", Description = "GS08 Version / Release / Industry Identifier Code")]
            public string Version { get; set; }

            public Validation Validation { get; set; }


            [EdiValue("9(1)", Path = "GE/0", Description = "GE01 - Number of Transaction Sets Included")]
            public int TransactionsCount { get; set; }

            [EdiValue("9(9)", Path = "GE/1", Description = "GE02 Group Control Number")]
            public string GroupTrailerControlNumber { get; set; }
        }

        [EdiMessage]
        public class Validation
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

            [EdiValue("9(8)", Path = "BHT/3", Format = "yyyyMMdd", Description = "BHT04 - Validation Date")]
            [EdiValue("9(4)", Path = "BHT/4", Format = "HHmm", Description = "BHT05 - Validation Time")]
            public DateTime ValidationDate { get; set; }

            public SubmitterHierarchicalLevel_Loop1000A Submitter { get; set; }

            public List<SubscriberHierarchicalLevel_Loop2000A> SubscriberHierarchy { get; set; }

            #endregion

        }

        [EdiSegment, EdiSegmentGroup("HL")]
        public class SubmitterHierarchicalLevel_Loop1000A
        {

            [EdiValue(Path = "HL/0", Description = "HL01 - Hierarchical ID Number")]
            public string HierarchicalID { get; set; }

            [EdiValue(Path = "HL/2", Description = "HL03 - Hierarchical Level Code")]
            public string HierarchicalLevelCode { get; set; }

            [EdiValue(Path = "HL/3", Description = "HL04 - Hierarchical Child Code")]
            public string HierarchicalChildCode { get; set; }

            public Submitter_Loop1000A Submitter { get; set; }

        }

        [EdiSegment, EdiSegmentGroup("NM1")]
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

        [EdiSegment, EdiSegmentGroup("HL")]
        public class SubscriberHierarchicalLevel_Loop2000A
        {

            [EdiValue(Path = "HL/0", Description = "HL01 - Hierarchical ID Number")]
            public string HierarchicalID { get; set; }

            [EdiValue(Path = "HL/1", Description = "HL02 - Hierarchical Parent ID Number")]
            public string HierarchicalParentID { get; set; }

            [EdiValue(Path = "HL/2", Description = "HL03 - Hierarchical Level Code")]
            public string HierarchicalLevelCode { get; set; }

            [EdiValue(Path = "HL/3", Description = "HL04 - Hierarchical Child Code")]
            public string HierarchicalChildCode { get; set; }

            public DistrictInformation_Loop2010A DistrictInformation { get; set; }

            public List<SubscriberHierarchicalLevel_Loop2000B> Students { get; set; }
        }

        [EdiSegment, EdiSegmentGroup("NM1")]
        public class DistrictInformation_Loop2010A
        {
            #region District Information
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


            #endregion
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

            #region Transaction Information

            [EdiValue(Path = "TRN/0", Description = "TRN01 - Trace Type Code - {1: Current Transaction Trace Numbers}")]
            public string TraceTypeCode { get; set; }

            [EdiValue(Path = "TRN/1", Description = "TRN02 - Reference Identification - Transaction Trace Number")]
            public string ReferenceID { get; set; }

            [EdiValue(Path = "TRN/2", Description = "TRN03 - Originating Company Identifier")]
            public string OriginatorID { get; set; }

            #endregion

            public Subscriber_Loop2010BA StudentInfo { get; set; }

        }

        [EdiSegment, EdiSegmentGroup("NM1")]
        public class Subscriber_Loop2010BA
        {

            [EdiValue(Path = "NM1/0", Description = "NM101 - Entity ID Code - IL")]
            public string EntityIdCode { get; set; }

            [EdiValue(Path = "NM1/1", Description = "NM102 - Entity Type Qualifier - {1: Person}")]
            public string EntityTypeQualifier { get; set; }

            [EdiValue(Path = "NM1/2", Description = "NM103 - Subscriber Last Or Organization Name")]
            public string SubscriberLastName { get; set; }

            [EdiValue(Path = "NM1/3", Description = "NM104 - Subscriber First Name")]
            public string SubscriberFirst { get; set; }

            //[EdiValue(Path = "NM1/7", Description = "NM108 - Subscriber ID Code Qualifier")]
            //public string SubscriberIDCodeQlfr { get; set; }

            //[EdiValue(Path = "NM1/8", Description = "NM109 - Subscriber ID")]
            //public string SubscriberID { get; set; }

            // REF: SITUATIONAL -  Social Security Number WE DONT USE THIS

            #region Subscriber Demographic Information 2010B A

            [EdiValue("X(2)", Path = "DMG/0", Description = "DMG01 - Birth Date Format - D8")]
            public string BirthDateFormat { get; set; }

            [EdiValue("9(8)", Path = "DMG/1", Format = "yyyyMMdd", Description = "DMG02 - Birth Date")]
            public string BirthDate { get; set; }

            #endregion

            // DTP
            #region Subscriber Date Loop 2400

            [EdiValue("X(3)", Path = "DTP/0", Description = "DTP01 - Date/Time Qualifier - Hardcoded 291")]
            public string DateTimeQlfr { get; set; }

            [EdiValue("X(2)", Path = "DTP/1", Description = "DTP02 - Date Time Period Format Qualifier - Hardcoded RD8")]
            public string DateTimePeriodFormatQlfr { get; set; }

            [EdiValue(Path = "DTP/2", Description = "DTP03 - Subscriber Date")]
            public string SubscriberDate { get; set; }

            #endregion

            // EQ

            #region Line Item Control Number Loop 2400

            [EdiValue(Path = "EQ/0", Description = "EQ01 - Service Type Code - {30: Health Benefit Plan Coverage}")]
            public string ServiceTypeCode { get; set; }

            #endregion
        }

        #region Edi Enumerations
        #endregion
    }
}
