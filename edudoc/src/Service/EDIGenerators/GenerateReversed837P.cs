using EDIX12.Models;
using indice.Edi;
using Microsoft.Extensions.Configuration;
using Model;
using Model.DTOs;
using Service.Utilities;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace Service.EDIGenerators
{

    public static class ReversedClaimFileGenerator
    {
        private static string createSpace(string str, int n)
        {
            return str.PadRight(n);
        }

        public static List<BillingFile> GenerateReversed837P(string envUsageIndicator, BillingFile billingFile, string absolutePath, EdiMetaData metaData, List<ReversalClaimsDistrictDTO> districts, List<ReversalClaimsStudentDTO> students, ClaimsEncounter[] claims)
        {

            var HC = new ReversedHealthClaim837P();
            HC.Groups = new List<ReversedHealthClaim837P.FunctionalGroup>();

            // ISA
            HC.AuthorizationInformation = createSpace("", 10);
            HC.Security_Information_Qualifier = "00";
            HC.Security_Information = createSpace("", 10);
            HC.ID_Qualifier = "ZZ";
            HC.Sender_ID = createSpace(CommonFunctions.PadStringValue(7, true, metaData.SenderId.ToString()), 15);
            HC.ID_Qualifier2 = "ZZ";
            HC.Receiver_ID = createSpace(metaData.ReceiverId.ToString(), 15);
            HC.Date = DateTime.Now;
            HC.Repetition_Separator = "^";
            HC.ControlVersion = 00501;
            HC.ControlNumber = CommonFunctions.PadStringValue(9, true, billingFile.Id.ToString());
            HC.AcknowledgementRequested = false;
            HC.Usage_Indicator = envUsageIndicator;
            HC.Component_Element_Separator = ':';

            HC.GroupsCount = 1;
            HC.TrailerControlNumber = CommonFunctions.PadStringValue(9, true, billingFile.Id.ToString());

            //GS
            var GS = new ReversedHealthClaim837P.FunctionalGroup();

            GS.FunctionalIdentifierCode = "HC";
            GS.ApplicationSenderCode = CommonFunctions.PadStringValue(7, true, metaData.SenderId.ToString());
            GS.ApplicationReceiverCode = metaData.ReceiverId;
            GS.Date = DateTime.Now;
            GS.GroupControlNumber = billingFile.Id.ToString();
            GS.AgencyCode = "X";
            GS.Version = metaData.ClaimImplementationReference;

            GS.TransactionsCount = districts.Count;
            GS.GroupTrailerControlNumber = billingFile.Id.ToString();

            HC.Groups.Add(GS);

            HC.Groups[0].Claims = new List<ReversedHealthClaim837P.Claim>();

            // For Each ClaimsDistrict
            foreach (var (district, districtIndex) in districts.WithIndex())
            {
                var claim = new ReversedHealthClaim837P.Claim();

                // ST
                claim.TransactionSetCode = "837";
                claim.TransactionSetControlNumber = CommonFunctions.PadStringValue(4, true, (districtIndex + 1).ToString());
                claim.ImplementationConventionReference = metaData.ClaimImplementationReference;

                // BHT
                claim.TransSetIdentifierCode = "0019";
                claim.TransSetPurposeCode = "00";
                claim.OriginatorAppTransId = $"{CommonFunctions.PadStringValue(9, true, billingFile.Id.ToString())}-{CommonFunctions.PadStringValue(4, true, (districtIndex + 1).ToString())}-{DateTime.Now.ToString("yyyyMMdd")}";
                claim.ClaimDate = DateTime.Now;
                claim.ClaimId = "CH";

                // NM1
                var submitter = new ReversedHealthClaim837P.Submitter_Loop1000A();
                submitter.EntityIdCode = "41";
                submitter.EntityTypeQualifier = "2";
                submitter.SubmitterLastOrOrganizationName = metaData.SubmitterOrganizationName;
                submitter.SubmitterIDCodeQlfr = "46";
                submitter.SubmitterID = CommonFunctions.PadStringValue(7, true, metaData.SenderId.ToString());

                claim.Submitter = submitter;

                // PER
                var submitterInfo = new ReversedHealthClaim837P.SubmitterContactInformation_Loop1000A();
                submitterInfo.SubmitterCodeType = metaData.SubmitterQlfrId;
                submitterInfo.SubmitterName = metaData.SubmitterName;
                submitterInfo.SubmitterPhoneQlfr = "TE";
                submitterInfo.SubmitterPhone = metaData.SubmitterPhone;
                submitterInfo.SubmitterPhoneAltQlfr = "FX";
                submitterInfo.SubmitterPhoneAlt = metaData.SubmitterPhoneAlt;
                submitterInfo.SubmitterEmailQlfr = "EM";
                submitterInfo.SubmitterEmail = metaData.SubmitterEmail;

                claim.SubmitterInfo = submitterInfo;

                // NM1
                var receiver = new ReversedHealthClaim837P.Receiver_Loop1000B();
                receiver.EntityIdCode = "40";
                receiver.EntityTypeQualifier = "2";
                receiver.ReceiverLastOrOrganizationName = metaData.ReceiverOrganizationName;
                receiver.ReceiverFirst = "";
                receiver.ReceiverMiddle = "";
                receiver.ReceiverIDCodeQlfr = "46";
                receiver.ReceiverID = metaData.ReceiverId;

                claim.Receiver = receiver;

                var subscriberHierarchy = new ReversedHealthClaim837P.SubscriberHierarchicalLevel_Loop2000A();

                // HL
                subscriberHierarchy.HierarchicalID = "1";
                subscriberHierarchy.HierarchicalLevelCode = "20";
                subscriberHierarchy.HierarchicalChildCode = "1";

                // PRV - Provider Information
                subscriberHierarchy.ProviderCode = "BI";
                subscriberHierarchy.ReferenceIDQlfr = "PXC";
                subscriberHierarchy.ReferenceID = "251300000X";

                var billingProvider = new ReversedHealthClaim837P.BillingProvider_Loop2010A();

                // NM1
                billingProvider.BillingProviderIdCode = "85";
                billingProvider.BillingProviderQualifier = "2";
                billingProvider.BillingProviderLast = district.DistrictOrganizationName;
                billingProvider.BillingProviderIDCodeQlfr = "XX";
                billingProvider.BillingProviderID = district.IdentificationCode;

                // N3
                billingProvider.BillingProviderAddress1 = district.Address;

                // N4
                billingProvider.BillingProviderCity = district.City;
                billingProvider.BillingProviderState = district.State;
                billingProvider.BillingProviderZip = district.PostalCode;

                // REF
                billingProvider.ReferenceIDQlfr = "EI";
                billingProvider.BillingProviderTaxID = district.EmployerId;

                var segmentsCount = 11;

                subscriberHierarchy.BillingProvider = billingProvider;
                subscriberHierarchy.Students = new List<ReversedHealthClaim837P.SubscriberHierarchicalLevel_Loop2000B>();

                foreach (var (claimsStudent, studentIndex) in students.Where(s => district.ClaimsDistrictIds.Any(id => s.ClaimsDistrictIds.Contains(id))).WithIndex())
                {
                    var student = new ReversedHealthClaim837P.SubscriberHierarchicalLevel_Loop2000B();

                    // HL
                    student.HierarchicalID = (studentIndex + 2).ToString();
                    student.HierarchicalParentID = "1";
                    student.HierarchicalLevelCode = "22";
                    student.HierarchicalChildCode = "0";

                    // SBR
                    student.ProviderCode = "P";
                    student.ReferenceIDQlfr = "18";
                    student.ClaimFilingIDCode = "MC";

                    var studentInfo = new ReversedHealthClaim837P.Subscriber_Loop2010BA();

                    // NM1
                    studentInfo.EntityIdCode = "IL";
                    studentInfo.EntityTypeQualifier = "1";
                    studentInfo.SubscriberLastName = claimsStudent.LastName;
                    studentInfo.SubscriberFirst = claimsStudent.FirstName;
                    studentInfo.SubscriberIDCodeQlfr = "MI";
                    studentInfo.SubscriberID = claimsStudent.IdentificationCode;

                    // N3
                    studentInfo.BillingProviderAddress1 = claimsStudent.Address;

                    // N4
                    studentInfo.BillingProviderCity = claimsStudent.City;
                    studentInfo.BillingProviderState = claimsStudent.State;
                    studentInfo.BillingProviderZip = claimsStudent.PostalCode;

                    // DMG
                    studentInfo.BirthDateFormat = "D8";
                    studentInfo.BirthDate = claimsStudent.InsuredDateTimePeriod;
                    studentInfo.Gender = "U";

                    student.StudentInfo = studentInfo;

                    var payerInfo = new ReversedHealthClaim837P.Payer_Loop2010BB();

                    // NM1
                    payerInfo.EntityIdCode = "PR";
                    payerInfo.EntityTypeQualifier = "2";
                    payerInfo.PayerLastName = metaData.ReceiverOrganizationName;
                    payerInfo.PayerIDCodeQlfr = "PI";
                    payerInfo.PayerID = metaData.ReceiverId;

                    student.PayerInfo = payerInfo;

                    segmentsCount += 7;

                    var encounters = new List<ReversedHealthClaim837P.ClaimInformation_Loop2300>();

                    foreach (var (claimsEncounter, encounterIndex) in claims.Where(c => claimsStudent.ClaimsStudentIds.Contains((int)c.ClaimsStudentId) && c.Response).WithIndex())
                    {

                        var encounter = new ReversedHealthClaim837P.ClaimInformation_Loop2300();

                        // CLM
                        encounter.PatientControlNumber = claimsEncounter.ReferenceNumber;
                        encounter.TotalClaimChargeAmount = claimsEncounter.ClaimAmount;

                        // Replace 1 in "03:B:1" with 8
                        var serviceLocationCode = metaData.ServiceLocationCode;
                        var reversalServiceLocationCode = serviceLocationCode.Substring(0, serviceLocationCode.Length - 1) + "8";
                        encounter.ServiceLocationCode = reversalServiceLocationCode;
                        encounter.ProviderSignatureIndicator = "Y";
                        encounter.MedicareAssignmentCode = "A";
                        encounter.BenefitsAssignmentCertIndicator = "Y";
                        encounter.ReleaseOfInformationCode = "Y";

                        // REF
                        encounter.ReferenceReversed = "F8";
                        encounter.LineItemControlNumberReversed = claimsEncounter.ClaimId;

                        // NTE
                        encounter.NoteReferenceCode = "CER";
                        encounter.ClaimNoteText = "ATTEST YES";

                        // HI
                        encounter.PrincipalDiagnosisCode = $"ABK:{claimsEncounter.ReasonForServiceCode}";

                        if (claimsEncounter.ReferringProviderId.Length > 0)
                        {
                            var referingProvider = new ReversedHealthClaim837P.ReferingProvider_Loop2010BB();

                            // NM1
                            referingProvider.ReferingProviderIdCode = "DN";
                            referingProvider.ReferingProviderQualifier = "1";
                            referingProvider.ReferingProviderLast = claimsEncounter.ReferringProviderLastName;
                            referingProvider.ReferingProviderFirst = claimsEncounter.ReferringProviderFirstName;
                            referingProvider.ReferingProviderIDCodeQlfr = "XX";
                            referingProvider.ReferingProviderID = claimsEncounter.ReferringProviderId;

                            // SD 10MAY2024: Commented out ReferringProvider2 until we determine if it's needed. Was basically a duplicate of #1
                            // var referingProvider2 = new ReversedHealthClaim837P.ReferingProvider_Loop2010BB();

                            // // Additional NM1
                            // referingProvider2.ReferingProviderIdCode = "82";
                            // referingProvider2.ReferingProviderQualifier = "1";
                            // referingProvider2.ReferingProviderLast = claimsEncounter.ReferringProviderLastName;
                            // referingProvider2.ReferingProviderFirst = claimsEncounter.ReferringProviderFirstName;
                            // referingProvider2.ReferingProviderIDCodeQlfr = "XX";
                            // referingProvider2.ReferingProviderID = claimsEncounter.ReferringProviderId;

                            encounter.ReferingProvider = referingProvider;
                            //encounter.ReferingProvider2 = referingProvider2;

                            segmentsCount += 1;
                        }

                        var service = new ReversedHealthClaim837P.ProfessionalService_Loop2400();

                        // LX
                        service.AssignedNumber = "1";

                        // SV1
                        service.CompositeMedicalProcedureID = $"HC:{claimsEncounter.ProcedureIdentifier}";
                        service.LineItemChargeAmount = claimsEncounter.ClaimAmount;
                        service.UnitOfMeasurement = "UN";
                        service.ServiceUnitCount = claimsEncounter.BillingUnits;
                        service.PlaceOfServiceCode = "08";
                        service.CompositeDiagnosisCodePointer = "1";

                        // DTP
                        service.NoteReferenceCode = "472";
                        service.DateTimePeriodFormatQlfr = "D8";
                        service.ServiceDate = claimsEncounter.ServiceDate;

                        // REF
                        service.ReferenceIDQlfr = "6R";
                        service.LineItemControlNumber = claimsEncounter.ClaimId;

                        //encounter.ReferingProvider2 = referingProvider2;
                        encounter.ProfessionalService = service;
                        encounters.Add(encounter);

                        segmentsCount += 8;
                    }

                    student.Encounters = encounters;
                    subscriberHierarchy.Students.Add(student);
                }

                claim.SubscriberHierarchy = subscriberHierarchy;

                // SE
                claim.SegmentsCounts = segmentsCount + 1;
                claim.TrailerTransactionSetControlNumber = CommonFunctions.PadStringValue(4, true, (districtIndex + 1).ToString());

                HC.Groups[0].Claims.Add(claim);
            }

            using (var textWriter = new StreamWriter(File.Open(absolutePath, FileMode.Create)))
            {
                using (var ediWriter = new EdiTextWriter(textWriter, EdiGrammar.NewX12()))
                {
                    new EdiSerializer().Serialize(ediWriter, HC);
                }
            }

            return new List<BillingFile>();

        }
    }
}
