using EDIX12.Models;
using indice.Edi;
using Model;
using Service.Utilities;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace Service.EDIGenerators
{

    public static class RosterValidationFileGenerator
    {

        private static string createSpace(string str, int n)
        {
            return str.PadRight(n);
        }

        public static RosterValidationFile Generate270(string envUsageIndicator, RosterValidationFile rosterValidationFile, string absolutePath, EdiMetaData metaData, List<RosterValidationDistrict> districts, RosterValidationStudent[] students)
        {

            var RV = new RosterValidation270();
            RV.Groups = new List<RosterValidation270.FunctionalGroup>();

            // Create 7 digit control number
            int controlNumber = rosterValidationFile.Id < 1000000 ? rosterValidationFile.Id + 1000000 : rosterValidationFile.Id;

            // ISA
            RV.AuthorizationInformation = createSpace("", 10);
            RV.Security_Information_Qualifier = "00";
            RV.Security_Information = createSpace("", 10);
            RV.ID_Qualifier = "ZZ";
            RV.Sender_ID = createSpace(CommonFunctions.PadStringValue(7, true, metaData.SenderId.ToString()), 15);
            RV.ID_Qualifier2 = "ZZ";
            RV.Receiver_ID = createSpace(metaData.ReceiverId.ToString(), 15);
            RV.Date = DateTime.Now;
            RV.Repetition_Separator = "^";
            RV.ControlVersion = 00501;
            RV.ControlNumber = CommonFunctions.PadStringValue(9, true, controlNumber.ToString());
            RV.AcknowledgementRequested = false;
            RV.Usage_Indicator = envUsageIndicator;
            RV.Component_Element_Separator = ':';

            //IEA
            RV.GroupsCount = 1;
            RV.TrailerControlNumber = CommonFunctions.PadStringValue(9, true, controlNumber.ToString());

            //GS
            var GS = new RosterValidation270.FunctionalGroup();

            GS.FunctionalIdentifierCode = "HS";
            GS.ApplicationSenderCode = CommonFunctions.PadStringValue(7, true, metaData.SenderId.ToString());
            GS.ApplicationReceiverCode = metaData.ReceiverId;
            GS.Date = DateTime.Now;
            GS.GroupControlNumber = controlNumber.ToString();
            GS.AgencyCode = "X";
            GS.Version = metaData.RosterValidationImplementationReference;

            //GE
            GS.TransactionsCount = 1;
            GS.GroupTrailerControlNumber = controlNumber.ToString();

            RV.Groups.Add(GS);


            var validation = new RosterValidation270.Validation();

            // ST
            validation.TransactionSetCode = "270";
            validation.TransactionSetControlNumber = controlNumber.ToString();
            validation.ImplementationConventionReference = metaData.RosterValidationImplementationReference;

            // BHT
            validation.TransSetIdentifierCode = "0022";
            validation.TransSetPurposeCode = "13";
            validation.OriginatorAppTransId = controlNumber.ToString();
            validation.ValidationDate = DateTime.Now;

            // HL
            var hierarchyTally = 1;
            var submitterHierarchy = new RosterValidation270.SubmitterHierarchicalLevel_Loop1000A();
            submitterHierarchy.HierarchicalID = hierarchyTally.ToString();
            submitterHierarchy.HierarchicalLevelCode = "20";
            submitterHierarchy.HierarchicalChildCode = "1";

            // NM1
            var submitter = new RosterValidation270.Submitter_Loop1000A();
            submitter.EntityIdCode = "PR";
            submitter.EntityTypeQualifier = "2";
            submitter.SubmitterLastOrOrganizationName = "ODJFS";
            submitter.SubmitterIDCodeQlfr = "46";
            submitter.SubmitterID = "MMISODJFS";

            submitterHierarchy.Submitter = submitter;
            validation.Submitter = submitterHierarchy;
            validation.SubscriberHierarchy = new List<RosterValidation270.SubscriberHierarchicalLevel_Loop2000A>();

            var segmentsCount = 4;

            // For Each ClaimsDistrict
            foreach (var (district, districtIndex) in districts.WithIndex())
            {
                hierarchyTally++;
                var subscriberHierarchy = new RosterValidation270.SubscriberHierarchicalLevel_Loop2000A();

                //HL
                subscriberHierarchy.HierarchicalID = hierarchyTally.ToString();
                subscriberHierarchy.HierarchicalParentID = "1";
                subscriberHierarchy.HierarchicalLevelCode = "21";
                subscriberHierarchy.HierarchicalChildCode = "1";

                var districtInformation = new RosterValidation270.DistrictInformation_Loop2010A();

                // NM1
                districtInformation.DistrictIdCode = "1P";
                districtInformation.DistrictQualifier = "2";
                districtInformation.DistrictLast = district.DistrictOrganizationName.Trim();
                districtInformation.DistrictIDCodeQlfr = "XX";
                districtInformation.DistrictID = CommonFunctions.PadStringValue(10, true, district.IdentificationCode);

                segmentsCount += 2;

                subscriberHierarchy.DistrictInformation = districtInformation;
                subscriberHierarchy.Students = new List<RosterValidation270.SubscriberHierarchicalLevel_Loop2000B>();

                var distHierarchy = hierarchyTally;
                foreach (var (rosterStudent, studentIndex) in students.Where(s => s.RosterValidationDistrictId == district.Id).WithIndex())
                {
                    hierarchyTally++;
                    var student = new RosterValidation270.SubscriberHierarchicalLevel_Loop2000B();

                    // HL
                    student.HierarchicalID = hierarchyTally.ToString();
                    student.HierarchicalParentID = distHierarchy.ToString();
                    student.HierarchicalLevelCode = "22";
                    student.HierarchicalChildCode = "0";

                    // TRN - ex. TRN*1*8106748*1346000187~
                    // TODO SD: Need answers
                    student.TraceTypeCode = "1";
                    student.ReferenceID = rosterStudent.ReferenceId;
                    student.OriginatorID = "1" + district.EmployerId; // EmployerId is taken from district's EinNumber 

                    var studentInfo = new RosterValidation270.Subscriber_Loop2010BA();

                    // NM1
                    studentInfo.EntityIdCode = "IL";
                    studentInfo.EntityTypeQualifier = "1";
                    studentInfo.SubscriberLastName = rosterStudent.LastName.Trim();
                    studentInfo.SubscriberFirst = rosterStudent.FirstName.Trim();
                    //studentInfo.SubscriberIDCodeQlfr = "MI";
                    //studentInfo.SubscriberID = rosterStudent.IdentificationCode;

                    // DMG
                    studentInfo.BirthDateFormat = "D8";
                    studentInfo.BirthDate = rosterStudent.InsuredDateTimePeriod;

                    // DTP - ex. DTP*291*RD8*20200501-20210331~
                    studentInfo.DateTimeQlfr = "291";
                    studentInfo.DateTimePeriodFormatQlfr = "RD8";
                    string startDate = DateTime.Now.AddMonths(-11).ToString("yyyyMMdd");
                    string endDate = DateTime.Now.ToString("yyyyMMdd");
                    studentInfo.SubscriberDate = $"{startDate}-{endDate}";

                    // EQ
                    studentInfo.ServiceTypeCode = "30";

                    segmentsCount += 6;

                    student.StudentInfo = studentInfo;

                    subscriberHierarchy.Students.Add(student);
                }

                validation.SegmentsCounts = segmentsCount + 1;

                validation.SubscriberHierarchy.Add(subscriberHierarchy);

                validation.TrailerTransactionSetControlNumber = controlNumber.ToString();

                RV.Groups[0].Validation = validation;
            }

            using (var textWriter = new StreamWriter(File.Open(absolutePath, FileMode.Create)))
            {
                using (var ediWriter = new EdiTextWriter(textWriter, EdiGrammar.NewX12()))
                {
                    new EdiSerializer().Serialize(ediWriter, RV);

                }
            }

            return new RosterValidationFile();

        }
    }
}
