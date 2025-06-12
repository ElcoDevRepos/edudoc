using Service.Core.Utilities;
using Service.Core.Utilities;
using BreckServiceBase.Utilities.Interfaces;
using EDIX12.Models;
using Microsoft.Extensions.Configuration;
using Model;
using System.Data.Entity;
using System.Linq;
using Service.Base;
using Service.EDIParse;
using Service.Utilities;
using System;
using System.IO;
using Service.Encounters;
using Model.Enums;

namespace Service.RosterValidations
{
    public class RosterValidationResponsesService : CRUDBaseService, IRosterValidationResponsesService
    {
        private readonly IPrimaryContext _context;
        private readonly IEmailHelper _emailHelper;
        private readonly IConfigurationSettings _configurationSettings;
        private readonly IConfiguration _configuration;
        private readonly IEDIParser _parser;
        private readonly IDocumentHelper _documentHelper;
        private readonly IEncounterStudentStatusService _encounterStudentStatusService;

        public RosterValidationResponsesService(IPrimaryContext context,
                                      IEmailHelper emailHelper,
                                      IConfigurationSettings configurationSettings,
                                      IDocumentHelper documentHelper,
                                      IConfiguration configuration,
                                      IEncounterStudentStatusService encounterStudentStatusService
                                      ) : base(context, new ValidationService(context, emailHelper))
        {
            _context = context;
            _emailHelper = emailHelper;
            _documentHelper = documentHelper;
            _configurationSettings = configurationSettings;
            _configuration = configuration;
            _encounterStudentStatusService = encounterStudentStatusService;
            _parser = new EDIParser();
        }

        public RosterValidationResponseFile ProcessRosterValidationResponse(int rosterValidationResponseId, int rosterValidationFileId, int userId)
        {
            try
            {
                var startTime = DateTime.UtcNow;

                var rosterValidationResponseJobToAdd = new JobsAudit()
                {
                    StartDate = startTime,
                    CreatedById = userId,
                    FileType = 271,
                };

                _context.JobsAudits.Add(rosterValidationResponseJobToAdd);

                var rosterValidationResponse = _context.RosterValidationResponseFiles.Include(x => x.RosterValidationFile).Include(x => x.RosterValidationFile.RosterValidation).FirstOrDefault(x => x.Id == rosterValidationResponseId);

                int controlNumber = rosterValidationFileId < 1000000 ? rosterValidationFileId + 1000000 : rosterValidationFileId;
                ParseRosterValidationResponseFile(controlNumber.ToString(), rosterValidationResponse);

                rosterValidationResponseJobToAdd.EndDate = DateTime.UtcNow;

                _context.SaveChanges();

                return rosterValidationResponse;
            }
            catch (Exception e)
            {
                DiscardRosterValidationResponse(rosterValidationResponseId, e);
                return null;
            }

        }

        private void ParseRosterValidationResponseFile(string controlNumber, RosterValidationResponseFile rosterValidationResponseFile)
        {
            RosterValidationResponse271 data = _parser.Parse271File(_documentHelper.PrependDocsPath(rosterValidationResponseFile.FilePath));

            if (data.Groups[0].GroupControlNumber != controlNumber)
                throw new ArgumentException($"Could not match RosterValidationResponseFile record with GroupControlNumber = {data.Groups[0].GroupControlNumber}", "GroupControlNumber");

            foreach (var district in data.Groups[0].Validation.InfoReceiver)
            {
                foreach(var student in district.Students)
                {
                    var rosterValidationStudent = _context.RosterValidationStudents.FirstOrDefault(x => x.ReferenceId == student.ReferencedTransaction.ReferenceID
                            && x.RosterValidationDistrict.RosterValidationId == rosterValidationResponseFile.RosterValidationFile.RosterValidationId);

                    if (rosterValidationStudent != null)
                    {
                        rosterValidationStudent.RejectReasonCode = student.StudentInfo.Subscriber_Request_Validation?.RejectReasonCode;
                        rosterValidationStudent.FollowUpActionCode = student.StudentInfo.Subscriber_Request_Validation?.FollowUpActionCode;
                        if (rosterValidationStudent.RejectReasonCode == null)
                        {
                            rosterValidationStudent.IsSuccessfullyProcessed = true;
                        }

                        if(student.StudentInfo.SubscriberMedicaidNumber?.Length > 0 && rosterValidationStudent.IdentificationCode != student.StudentInfo.SubscriberMedicaidNumber)
                        {
                            var studentForMedicaidUpdate = _context.Students
                                .Include(s => s.EncounterStudents)
                                .First(s => s.Id == rosterValidationStudent.StudentId);
                            studentForMedicaidUpdate.MedicaidNo = student.StudentInfo.SubscriberMedicaidNumber;
                            studentForMedicaidUpdate.DateModified = DateTime.UtcNow;
                            studentForMedicaidUpdate.ModifiedById = 1;

                            _context.SaveChanges();

                            var encounterStudents = studentForMedicaidUpdate.EncounterStudents
                                .Where(es => es.EncounterStatusId == (int)EncounterStatuses.MISSING_MEDICAID_NUMBER).ToList();
                            foreach (EncounterStudent es in encounterStudents) 
                            {
                                _encounterStudentStatusService.CheckEncounterStudentStatus(es.Id, 1);
                            }
                        }
                    }
                }
            }

            _context.SaveChanges();
            
        }

        private void DiscardRosterValidationResponse(int rosterValidationResponseId, Exception error)
        {

            var discardedResponse = _context.RosterValidationResponseFiles.FirstOrDefault(x => x.Id == rosterValidationResponseId);
            File.Delete(_documentHelper.PrependDocsPath(discardedResponse.FilePath));
            _context.RosterValidationResponseFiles.Remove(discardedResponse);
            _context.SaveChanges();

            _emailHelper.SendEmail(new Utilities.Models.EmailParams()
            {
                From = _configurationSettings.GetDefaultEmailFrom(),
                To = _configuration["SystemErrorEmails"],
                Subject = "271 Roster Validation Response Error",
                Body = "RosterValidationResponseId: " + rosterValidationResponseId + Environment.NewLine +
                        "Message: " + error.Message + Environment.NewLine +
                        "Stack Trace: " + error.StackTrace.ToString(),
                IsHtml = false
            });

        }

    }
}
