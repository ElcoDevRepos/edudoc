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
using Model.Enums;
using System.Globalization;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using Service.Auth.Models;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace Service.HealthCareClaims
{
    public class HealthCareClaimResponsesService : CRUDBaseService, IHealthCareClaimResponsesService
    {
        private readonly IPrimaryContext _context;
        private readonly IEmailHelper _emailHelper;
        private readonly IConfigurationSettings _configurationSettings;
        private readonly IConfiguration _configuration;
        private readonly IEDIParser _parser;
        private readonly IDocumentHelper _documentHelper;
        private readonly ILogger<HealthCareClaimResponsesService> _logger;
        private Dictionary<string, int> _ediErrorCodesDict;

        public HealthCareClaimResponsesService(IPrimaryContext context,
                                      IEmailHelper emailHelper,
                                      IConfigurationSettings configurationSettings,
                                      IDocumentHelper documentHelper,
                                      IConfiguration configuration,
                                      ILogger<HealthCareClaimResponsesService> logger
                                      ) : base(context, new ValidationService(context, emailHelper))
        {
            _ediErrorCodesDict = new Dictionary<string, int>();
            _context = context;
            _emailHelper = emailHelper;
            _documentHelper = documentHelper;
            _configurationSettings = configurationSettings;
            _configuration = configuration;
            _parser = new EDIParser();
            _logger = logger;
        }

        public void HandleBillingResponseFileProcessing()
        {
            var responseFilesToProcess = _context.BillingResponseFiles.Where(bfr => bfr.DateProcessed == null).ToList();
            foreach (var file in responseFilesToProcess)
            {
                ProcessHealthCareClaimResponse(file.Id, file.Name, (int)ProtectedAuthUsers.AdminUser);
            }
        }

        public BillingResponseFile ProcessHealthCareClaimResponse(int healthCareClaimResponseId, string fileName, int userId)
        {
            try
            {
                var startTime = DateTime.UtcNow;

                var healthCareClaimResponseJobToAdd = new JobsAudit()
                {
                    StartDate = startTime,
                    CreatedById = userId,
                    FileType = 835,
                };

                _context.JobsAudits.Add(healthCareClaimResponseJobToAdd);

                var healthCareClaimResponse = _context.BillingResponseFiles.FirstOrDefault(x => x.Id == healthCareClaimResponseId);

                ParseBillingResponseFile(healthCareClaimResponse);

                healthCareClaimResponseJobToAdd.EndDate = DateTime.UtcNow;
                _context.SaveChanges();

                return healthCareClaimResponse;
            }
            catch (Exception e)
            {
                this._logger.LogError(e, "Exception in ProcessHealthCareClaimResponse");
                DiscardHealthCareClaimResponse(healthCareClaimResponseId, fileName, e);
                return null;
            }

        }

        private void ParseBillingResponseFile(BillingResponseFile healthCareClaimResponseFile)
        {
            HealthClaimResponse835 data = _parser.Parse835File(_documentHelper.PrependDocsPath(healthCareClaimResponseFile.FilePath));
            List<UnmatchedClaimRespons> unmatchedClaims = new List<UnmatchedClaimRespons>();
            List<EncounterStudentStatus> encounterStudentStatusLogs = new List<EncounterStudentStatus>();

            foreach (var district in data.Group.Validations)
            {
                Dictionary<string, BySchoolYearObj> bySchoolYear = new Dictionary<string, BySchoolYearObj>();

                // For generating vouchers
                var financialInformation = district.FinancialInformation;
                decimal monetaryAmount = decimal.Parse(financialInformation.MonetaryAmount);

                DateTime bprVoucherDate = financialInformation.Date.Date.AddHours(12);
                SchoolDistrict schoolDistrict = _context.SchoolDistricts
                    .FirstOrDefault(sd => !sd.Archived && (sd.NpiNumber == district.PayeeIdentification.IDCode || sd.Name == district.PayeeIdentification.Name));

                var districtMatched = schoolDistrict != null;
                UnmatchedClaimDistrict unmatchedDistrict = null;

                if (!districtMatched)
                {
                    unmatchedDistrict = _context.UnmatchedClaimDistricts.FirstOrDefault(x => x.DistrictOrganizationName == district.PayeeIdentification.Name);

                    if (unmatchedDistrict == null)
                    {
                        unmatchedDistrict =
                            new UnmatchedClaimDistrict
                            {
                                ResponseFileId = healthCareClaimResponseFile.Id,
                                IdentificationCode = district.PayeeIdentification.IDCode,
                                DistrictOrganizationName = district.PayeeIdentification.Name,
                                Address = district.PayeeIdentification.PayeeAddress.AddressInfo,
                                City = district.PayeeIdentification.PayeeAdditionalAddressInformation.City,
                                State = district.PayeeIdentification.PayeeAdditionalAddressInformation.State,
                                PostalCode = district.PayeeIdentification.PayeeAdditionalAddressInformation.PostalCode,
                                EmployerId = district.PayeeIdentification.PayeeAdditionalIdentification.ReceiverId,
                            };
                        _context.UnmatchedClaimDistricts.Add(unmatchedDistrict);
                        _context.SaveChanges();
                    }
                }

                int schoolDistrictId = districtMatched ? schoolDistrict.Id : unmatchedDistrict.Id;
                decimal totalPaidAmount = 0; // Total paid amount from claims

                foreach (var claim in district.PayeeIdentification.ClaimHeader.Claims)
                {
                    string serviceCode = Regex.Replace(claim.SubmitterId, @"[\d-]", string.Empty);

                    // If HCONB then grab provider title from claim encounter
                    var submitterId = claim.SubmitterId
                        .Replace("NB", "")
                        .Replace("HCC", "")
                        .Replace("HCN", "")
                        .Replace("HCO", "")
                        .Replace("HCP", "")
                        .Replace("HCS", "")
                        .Replace("HCY", "")
                        .Replace("HCA", "")
                        .TrimStart(new Char[] { '0' });

                    bool isValidServiceCode = CommonFunctions.IsBillableServiceCode(serviceCode);

                    ClaimsEncounterWithServiceCode claimsEncounterWithServiceCode = isValidServiceCode ?
                        _context.ClaimsEncounters.Where(x => x.Id.ToString() == submitterId).Select(ce =>
                            new ClaimsEncounterWithServiceCode
                            {
                                Claim = ce,
                                Code = serviceCode
                            }).FirstOrDefault()
                        : _context.ClaimsEncounters.Where(x => x.Id.ToString() == submitterId).Select(ce =>
                            new ClaimsEncounterWithServiceCode
                            {
                                Claim = ce,
                                Code = ce.EncounterStudent.Encounter.Provider.ProviderTitle.ServiceCode.Code
                            }).FirstOrDefault();

                    ClaimsEncounter healthCareClaimEncounter = claimsEncounterWithServiceCode?.Claim ?? null;

                    var claimMatched = !claim.SubmitterId.Contains("NB") && healthCareClaimEncounter != null;
                    UnmatchedClaimRespons unmatchedClaimResponse = null;

                    if (claimMatched)
                    {
                        var encounterStudent = _context.EncounterStudents.FirstOrDefault(x => x.Id == healthCareClaimEncounter.EncounterStudentId);

                        if (!healthCareClaimEncounter.Response)
                        {
                            if (string.IsNullOrWhiteSpace(claim.PaymentAmount) || double.Parse(claim.PaymentAmount) == 0)
                            {
                                encounterStudent.EncounterStatusId = (int)EncounterStatuses.Invoiced_and_Denied;
                            }
                            else
                            {
                                encounterStudent.EncounterStatusId = (int)EncounterStatuses.Invoiced_and_Paid;
                            };

                        }

                        if (healthCareClaimEncounter.ReversedClaimId != null)
                        {
                            encounterStudent.EncounterStatusId = (int)EncounterStatuses.PAID_AND_REVERSED;
                        }

                        healthCareClaimEncounter.Response = true;
                        healthCareClaimEncounter.ClaimId = claim.ReferenceId;
                        healthCareClaimEncounter.PaidAmount = claim.PaymentAmount;
                        healthCareClaimEncounter.ReferenceNumber =
                            claim.ServicePaymentInformation_Loop2110.RenderingProviderInformation?.RenderingProviderID ??
                            claim.ServicePaymentInformation_Loop2110.LineItemControlNumber.ControlNumber;

                        var adjReasonCode = claim.ServicePaymentInformation_Loop2110.ServiceAdjustment?.AdjustmentReasonCode;
                        if (adjReasonCode != null)
                        {
                            healthCareClaimEncounter.EdiErrorCodeId = GetEdiErrorCodeId(adjReasonCode);
                            healthCareClaimEncounter.AdjustmentReasonCode = adjReasonCode;
                            healthCareClaimEncounter.AdjustmentAmount = claim.ServicePaymentInformation_Loop2110.ServiceAdjustment.AdjustmentAmount;
                            if (CommonFunctions.GetEDIErrorCodeExceptions().Contains(healthCareClaimEncounter.AdjustmentReasonCode)
                                && (string.IsNullOrWhiteSpace(claim.PaymentAmount) || double.Parse(claim.PaymentAmount) == 0)
                                && healthCareClaimEncounter.ReversedClaimId == null)
                            {
                                encounterStudent.EncounterStatusId = (int)EncounterStatuses.Invoiced_and_Paid;
                            }
                        }

                        _context.SetEntityState(encounterStudent, EntityState.Modified);
                        var statusLog = new EncounterStudentStatus()
                        {
                            EncounterStatusId = encounterStudent.EncounterStatusId,
                            EncounterStudentId = encounterStudent.Id,
                            CreatedById = (int)ProtectedAuthUsers.AdminUser,
                            DateCreated = DateTime.UtcNow,
                        };
                        encounterStudentStatusLogs.Add(statusLog);

                        DateTime dateTime;
                        DateTime.TryParseExact(claim.StatementDateProcessed.Date, "yyyyMMdd", CultureInfo.InvariantCulture, DateTimeStyles.None, out dateTime);
                        healthCareClaimEncounter.VoucherDate = dateTime;
                        decimal currentClaimPaidAmount = decimal.Parse(healthCareClaimEncounter.PaidAmount);

                        // Get school year based on encounter date
                        DateTime date = encounterStudent.EncounterDate;
                        string schoolYear = (date.Month >= 7 ? date.Year + 1 : date.Year).ToString();

                        // Add entry for school year if not exist
                        if (!bySchoolYear.ContainsKey(schoolYear))
                        {
                            bySchoolYear.Add(schoolYear, new BySchoolYearObj());
                        }

                        // Add to paid amounts based on service code and school year
                        BySchoolYearObj bySchoolYearDict = bySchoolYear.GetValueOrDefault(schoolYear);

                        string code = isValidServiceCode ? serviceCode : claimsEncounterWithServiceCode.Code;
                        if (!bySchoolYearDict.Dict.ContainsKey(code) || code == "")
                        {
                            bySchoolYearDict.Dict[""].PaidAmount += currentClaimPaidAmount;
                        }
                        else
                        {
                            bySchoolYearDict.Dict[code].PaidAmount += currentClaimPaidAmount;
                        }
                        totalPaidAmount += currentClaimPaidAmount;
                    }
                    else
                    {
                        DateTime dateTime;
                        DateTime.TryParseExact(claim.StatementDateFrom.Date, "yyyyMMdd", CultureInfo.InvariantCulture, DateTimeStyles.None, out dateTime);
                        unmatchedClaimResponse =
                            new UnmatchedClaimRespons
                            {
                                ResponseFileId = healthCareClaimResponseFile.Id,
                                ProcedureIdentifier = claim.ServicePaymentInformation_Loop2110.CompositeMedicalProcedureId,
                                ClaimAmount = claim.TotalChargeAmount,
                                PaidAmount = claim.PaymentAmount,
                                ServiceDate = dateTime,
                                PatientFirstName = claim.PatientName.PatientFirstName,
                                PatientLastName = claim.PatientName.PatientLastName,
                                PatientId = claim.PatientName.IDCode,
                                ClaimId = claim.SubmitterId,
                                VoucherDate = dateTime,
                                DistrictId = districtMatched ? schoolDistrictId : null,
                                UnmatchedDistrictId = districtMatched ? null : schoolDistrictId,
                                ReferenceNumber =
                                    claim.ServicePaymentInformation_Loop2110.RenderingProviderInformation?.RenderingProviderID ??
                                    claim.ServicePaymentInformation_Loop2110.LineItemControlNumber?.ControlNumber ??
                                    claim.SubmitterId,
                            };

                        var adjReasonCode = claim.ServicePaymentInformation_Loop2110.ServiceAdjustment?.AdjustmentReasonCode;
                        if (adjReasonCode != null)
                        {
                            unmatchedClaimResponse.EdiErrorCodeId = GetEdiErrorCodeId(adjReasonCode);
                            unmatchedClaimResponse.AdjustmentReasonCode = adjReasonCode;
                            unmatchedClaimResponse.AdjustmentAmount = claim.ServicePaymentInformation_Loop2110.ServiceAdjustment.AdjustmentAmount;
                        }

                        decimal currentClaimPaidAmount = decimal.Parse(unmatchedClaimResponse.PaidAmount);
                        string schoolYear = (dateTime.Month >= 7 ? dateTime.Year + 1 : dateTime.Year).ToString();
                        // Add entry for school year if not exist
                        if (!bySchoolYear.ContainsKey(schoolYear))
                        {
                            bySchoolYear.Add(schoolYear, new BySchoolYearObj());
                        }

                        // Add to paid amounts based on service code and school year
                        BySchoolYearObj bySchoolYearDict = bySchoolYear.GetValueOrDefault(schoolYear);

                        string code = isValidServiceCode ? serviceCode : serviceCode.Replace("NB", "");
                        if (!bySchoolYearDict.Dict.ContainsKey(code) || code == "")
                        {
                            bySchoolYearDict.Dict[""].PaidAmount += currentClaimPaidAmount;
                        }
                        else
                        {
                            bySchoolYearDict.Dict[code].PaidAmount += currentClaimPaidAmount;
                        }
                        totalPaidAmount += currentClaimPaidAmount;

                        unmatchedClaims.Add(unmatchedClaimResponse);
                    }
                }
                _context.EncounterStudentStatus.AddRange(encounterStudentStatusLogs);
                GenerateVouchersFromClaims(monetaryAmount, totalPaidAmount, bprVoucherDate, schoolDistrictId, healthCareClaimResponseFile.Id, bySchoolYear, districtMatched);
            }
            _context.UnmatchedClaimRespons.AddRange(unmatchedClaims);
            healthCareClaimResponseFile.DateProcessed = DateTime.UtcNow;
            _context.SaveChanges();
        }

        private int GetEdiErrorCodeId(string adjReasonCode)
        {
            int errorCodeId = 0;
            if (_ediErrorCodesDict.ContainsKey(adjReasonCode))
            {
                errorCodeId = _ediErrorCodesDict[adjReasonCode];
            }
            else
            {
                EdiErrorCode errorCode = _context.EdiErrorCodes.FirstOrDefault(e => e.ErrorCode.Equals(adjReasonCode));
                if (errorCode != null)
                {
                    errorCodeId = errorCode.Id;
                    _ediErrorCodesDict.Add(adjReasonCode, errorCodeId);
                }
            }
            if (errorCodeId > 0) return errorCodeId;
            else
            {
                // Edi Error Code not found, create new error code and send email notif
                int ediErrorCodeId = CreateNewEdiErrorCode(adjReasonCode);

                var emailList = _context.EdiErrorCodeAdminNotifications
                    .Include(adminNotif => adminNotif.User)
                    .Where(admin => admin.User.Email != null)
                    .Select(admin => admin.User.Email).ToList();
                var adminNotifications = emailList.Append("edudoc@HPCoh.com");

                foreach (var email in adminNotifications)
                {
                    _emailHelper.SendEmail(new Utilities.Models.EmailParams()
                    {
                        From = _configurationSettings.GetDefaultEmailFrom(),
                        To = email,
                        Subject = "835 Billing File Response Unknown Edi Error Code",
                        Body = "Unknown Edi Error Code found: " + adjReasonCode
                    });
                }
                _ediErrorCodesDict.Add(adjReasonCode, ediErrorCodeId);
                return ediErrorCodeId;
            }
        }

        private int CreateNewEdiErrorCode(string adjReasonCode)
        {
            var newEdiErrorCode = _context.EdiErrorCodes.Add(
                    new EdiErrorCode
                    {
                        ErrorCode = adjReasonCode,
                        Name = "",
                        EdiFileTypeId = (int)EdiFileTypes.HealthCareClaimResponse835
                    });
            _context.SaveChanges();
            return newEdiErrorCode.Id;
        }

        private void DiscardHealthCareClaimResponse(int healthCareClaimResponseId, string fileName, Exception error)
        {
            // Log error time
            var log = new ConsoleJobLog
            {
                ConsoleJobTypeId = (int)ConsoleJobTypes.BILLING_RESPONSE,
                Date = DateTime.Now,
                RelatedEntityId = healthCareClaimResponseId,
                StackTrace = error.StackTrace,
                ErrorMessage = error.Message,
                IsError = true,
            };
            _context.ConsoleJobLogs.Add(log);

            var discardedResponse = _context.BillingResponseFiles.FirstOrDefault(x => x.Id == healthCareClaimResponseId);

            // Remove objects associated with billing response file
            var unmatchedClaimResponses = _context.UnmatchedClaimRespons.Where(x => x.ResponseFileId == healthCareClaimResponseId);
            _context.UnmatchedClaimRespons.RemoveRange(unmatchedClaimResponses);

            var unmatchedClaimDistricts = _context.UnmatchedClaimDistricts.Where(x => x.ResponseFileId == healthCareClaimResponseId);
            _context.UnmatchedClaimDistricts.RemoveRange(unmatchedClaimDistricts);

            var vouchers = _context.Vouchers.Where(x => x.VoucherBillingResponseFiles.Any(y => y.BillingResponseFileId == healthCareClaimResponseId));
            var voucherBillingResponseFiles = _context.VoucherBillingResponseFiles.Where(x => x.BillingResponseFileId == healthCareClaimResponseId);
            _context.VoucherBillingResponseFiles.RemoveRange(voucherBillingResponseFiles);
            _context.Vouchers.RemoveRange(vouchers);

            File.Delete(_documentHelper.PrependDocsPath(discardedResponse.FilePath));
            _context.BillingResponseFiles.Remove(discardedResponse);
            _context.SaveChanges();

            _emailHelper.SendEmail(new Utilities.Models.EmailParams()
            {
                From = _configurationSettings.GetDefaultEmailFrom(),
                To = _configuration["SystemErrorEmails"],
                Subject = "835 Billing File Response Error",
                Body = "HealthCareClaimResponseId: " + healthCareClaimResponseId + Environment.NewLine +
                        "FileName: " + fileName + Environment.NewLine +
                        "Message: " + error.Message + Environment.NewLine +
                        "Stack Trace: " + error.StackTrace.ToString(),
                IsHtml = false
            });
        }

        private void GenerateVouchersFromClaims(
            decimal monetaryAmount,
            decimal totalPaidAmount,
            DateTime bprVoucherDate,
            int schoolDistrictId,
            int billingResponseFileId,
            Dictionary<string, BySchoolYearObj> bySchoolYear,
            bool districtMatched = true
        )
        {
            bprVoucherDate = bprVoucherDate.Date.AddHours(12);
            // Archive existing vouchers for that date and school district
            IQueryable<Voucher> existingVouchers = districtMatched ?
                _context.Vouchers.Where(v => DbFunctions.TruncateTime(v.VoucherDate) == DbFunctions.TruncateTime(bprVoucherDate) && v.SchoolDistrictId == schoolDistrictId) :
                _context.Vouchers.Where(v => DbFunctions.TruncateTime(v.VoucherDate) == DbFunctions.TruncateTime(bprVoucherDate) && v.UnmatchedClaimDistrictId == schoolDistrictId);
            foreach (Voucher voucher in existingVouchers)
            {
                voucher.Archived = true;
            }

            List<Voucher> newVouchers = new List<Voucher>();
            // Loop through each school year and generate vouchers for valid service codes
            foreach (KeyValuePair<string, BySchoolYearObj> entry in bySchoolYear)
            {
                string schoolYear = entry.Key;
                List<Voucher> vouchers = entry.Value.Dict.Where(dict => dict.Value.PaidAmount != 0 && dict.Key.Length > 0)
                    .Select(dict => new Voucher
                    {
                        VoucherDate = bprVoucherDate,
                        VoucherAmount = monetaryAmount.ToString(),
                        PaidAmount = dict.Value.PaidAmount.ToString(),
                        ServiceCode = dict.Value.ServiceCode,
                        SchoolDistrictId = districtMatched ? schoolDistrictId : null,
                        UnmatchedClaimDistrictId = districtMatched ? null : schoolDistrictId,
                        SchoolYear = schoolYear,
                        VoucherTypeId = (int)VoucherTypes.ServiceCode,
                    }).ToList();
                newVouchers.AddRange(vouchers);
            }

            bool hasInvalidServiceCode = bySchoolYear.Any(x => x.Value.Dict[""].PaidAmount != 0);
            // Create unknown voucher if all the claims paid amounts do not total up to voucher amount
            // or if there is an invalid service code
            if (totalPaidAmount != monetaryAmount || hasInvalidServiceCode)
            {
                decimal unknownPaidAmount = hasInvalidServiceCode ? bySchoolYear.Sum(x => x.Value.Dict[""].PaidAmount) : 0;
                newVouchers.Add(new Voucher
                {
                    VoucherDate = bprVoucherDate,
                    VoucherAmount = monetaryAmount.ToString(),
                    PaidAmount = (monetaryAmount - totalPaidAmount + unknownPaidAmount < 0 ? "-" : "") + Math.Abs(totalPaidAmount - monetaryAmount + unknownPaidAmount).ToString(),
                    ServiceCode = "Unknown",
                    SchoolDistrictId = districtMatched ? schoolDistrictId : null,
                    UnmatchedClaimDistrictId = districtMatched ? null : schoolDistrictId,
                    SchoolYear = bySchoolYear.First().Key,
                    VoucherTypeId = (int)VoucherTypes.Unknown,
                });
            }

            _context.Vouchers.AddRange(newVouchers);
            _context.SaveChanges();

            // Create association to billing response file
            IEnumerable<VoucherBillingResponseFile> voucherBillingResponseFiles = newVouchers.Select(v => new VoucherBillingResponseFile
            {
                VoucherId = v.Id,
                BillingResponseFileId = billingResponseFileId
            });
            _context.VoucherBillingResponseFiles.AddRange(voucherBillingResponseFiles);
            _context.SaveChanges();
        }

        private BillingResponseFile StoreResponseFile(string fileName, byte[] bytes, int userId)
        {
            var ext = fileName.Split('.').Last();

            var data = new BillingResponseFile { UploadedById = userId };
            data.FilePath = _documentHelper.CreateDocFileBaseName() + _documentHelper.CheckExtensionDot(ext);
            data.Name = fileName;

            bool fileExists = _context.BillingResponseFiles.Any(file => file.Name == data.Name);

            if (!fileExists)
            {
                _context.BillingResponseFiles.Add(data);
                _context.SaveChanges();

                var absolutePath = _documentHelper.PrependDocsPath(data.FilePath);
                System.IO.File.WriteAllBytes(absolutePath, bytes);
            }
            else
            {
                throw new FileAlreadyExistsException(fileName);
            }

            return data;
        }

        public async Task StoreResponseFiles(IEnumerable<IFormFile> files, int userId)
        {
            var transaction = (_context as PrimaryContext).Database.BeginTransaction();
            foreach (var file in files)
            {
                byte[] bytes;
                using (var memoryStream = new MemoryStream())
                {
                    await file.CopyToAsync(memoryStream);
                    bytes = memoryStream.ToArray();
                }

                try
                {
                    var storedFile = StoreResponseFile(file.FileName, bytes, userId);
                } catch {
                    transaction.Rollback();
                    throw;
                }
            }
            transaction.Commit();
        }


    }

    public class FileAlreadyExistsException : Exception
    {
        public string FileName { get; set; }
        public FileAlreadyExistsException(string fileName) : base()
        {
            FileName = fileName;
        }
    }

    public class ServiceCodePaidAmount
    {
        public string ServiceCode { get; set; }
        public decimal PaidAmount { get; set; }
        public ServiceCodePaidAmount(string serviceCode, decimal paidAmount)
        {
            ServiceCode = serviceCode;
            PaidAmount = paidAmount;
        }
    }

    public class BySchoolYearObj
    {
        public Dictionary<string, ServiceCodePaidAmount> Dict { get; set; } =
            new Dictionary<string, ServiceCodePaidAmount> {
                    { "HCC", new ServiceCodePaidAmount("Counseling/Social Work", 0) },
                    { "HCN", new ServiceCodePaidAmount("Nursing", 0) },
                    { "HCO", new ServiceCodePaidAmount("Occupational Therapy", 0) },
                    { "HCP", new ServiceCodePaidAmount("Physical Therapy", 0) },
                    { "HCS", new ServiceCodePaidAmount("Speech Therapy", 0) },
                    { "HCY", new ServiceCodePaidAmount("Psychology", 0) },
                    { "HCA", new ServiceCodePaidAmount("Audiology", 0) },
                    { "", new ServiceCodePaidAmount("Unknown", 0) },
                };
    }

    public class ClaimsEncounterWithServiceCode
    {
        public ClaimsEncounter Claim { get; set; }
        public string Code { get; set; }
    }
}
