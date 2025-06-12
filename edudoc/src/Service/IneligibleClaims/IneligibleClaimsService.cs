using BreckServiceBase.Utilities.Interfaces;
using DocumentFormat.OpenXml.Spreadsheet;
using Microsoft.Extensions.Configuration;
using Model;
using Model.DTOs;
using Model.Enums;
using Service.EDIGenerators;
using Service.HealthCareClaims;
using Service.Utilities;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace Service.IneligibleClaims
{
    public interface IIneligibleClaimsService
    {
        (IEnumerable<ClaimsEncounter> result, int count) GetIneligibleClaims(Model.Core.CRUDSearchParams csp);
        IneligibleClaimsSummaryDTO GetIneligibleClaimSummary();
    }

    public class IneligibleClaimsService : BaseService, IIneligibleClaimsService
    {
        private readonly IPrimaryContext _context;

        public IneligibleClaimsService(IPrimaryContext context) : base(context)
        {
            _context = context;
        }

        public (IEnumerable<ClaimsEncounter> result, int count) GetIneligibleClaims(Model.Core.CRUDSearchParams csp)
        {
            var fiscalYearStart = CommonFunctions.GetFiscalYearStart();
            var fiscalYearEnd = CommonFunctions.GetFiscalYearEnd();
            var baseQuery = _context.ClaimsEncounters.Include(ce => ce.EdiErrorCode).Where(e => e.EdiErrorCodeId != null &&
                e.ServiceDate >= fiscalYearStart && e.ServiceDate <= fiscalYearEnd).AsQueryable();

            if (!CommonFunctions.IsBlankSearch(csp.Query))
            {
                string[] terms = CommonFunctions.SplitTerms(csp.Query.Trim().ToLower());
                foreach (string t in terms)
                {
                    baseQuery = baseQuery.Where(s =>
                                                        s.ClaimAmount.ToLower().StartsWith(t) ||
                                                        s.ReferringProviderFirstName.ToLower().StartsWith(t) ||
                                                        s.ReferringProviderLastName.ToLower().StartsWith(t) ||
                                                        s.ProcedureIdentifier.ToLower().StartsWith(t)
                                                    );
                }
            }

            if (!string.IsNullOrEmpty(csp.extraparams))
            {
                var extras = System.Web.HttpUtility.ParseQueryString(WebUtility.UrlDecode(csp.extraparams));

                if (extras["EdiErrorCodeIds"] != null && extras["EdiErrorCodeIds"] != "0")
                {
                    var ediErrorCodeParamsList = CommonFunctions.GetIntListFromExtraParams(csp.extraparams, "EdiErrorCodeIds");
                    var ediErrorCodeIds = ediErrorCodeParamsList["EdiErrorCodeIds"];

                    if (ediErrorCodeIds.Count > 0)
                        baseQuery = baseQuery.Where(encounterStudent => ediErrorCodeIds.Contains((int)encounterStudent.EdiErrorCodeId));
                }
                if (extras["StartDate"] != null)
                {
                    var startDate = DateTime.Parse(extras["StartDate"]);
                    baseQuery = baseQuery.Where(encounterStudent => DbFunctions.TruncateTime(encounterStudent.ServiceDate) >= DbFunctions.TruncateTime(startDate));
                }
                if (extras["EndDate"] != null)
                {
                    var endDate = DateTime.Parse(extras["EndDate"]);
                    baseQuery = baseQuery.Where(encounterStudent => DbFunctions.TruncateTime(encounterStudent.ServiceDate) <= DbFunctions.TruncateTime(endDate));
                }
            }
            var count = baseQuery.Count();
            var result = baseQuery.OrderByDescending(e => e.ServiceDate)
                .Skip(csp.skip.GetValueOrDefault())
                .Take(csp.take.GetValueOrDefault())
                .AsEnumerable();
            return (result, count);
        }
        public IneligibleClaimsSummaryDTO GetIneligibleClaimSummary()
        {
            var fiscalYearStart = CommonFunctions.GetFiscalYearStart();
            var fiscalYearEnd = CommonFunctions.GetFiscalYearEnd();
            var claims = _context.ClaimsEncounters.Where(e => e.EdiErrorCodeId != null &&
                e.ServiceDate >= fiscalYearStart && e.ServiceDate <= fiscalYearEnd)
                .Include(e => e.EncounterStudent)
                .Include(e => e.EncounterStudent.Encounter)
                .Include(e => e.EncounterStudent.Encounter.Provider)
                .Include(e => e.EncounterStudent.Encounter.Provider.ProviderTitle)
                .ToList();

            var dto = new IneligibleClaimsSummaryDTO
            {
                TotalIneligibleClaims = claims.Count(),
                SpeechTherapy = 0,
                Psychology = 0,
                OccupationalTherapy = 0,
                PhysicalTherapy = 0,
                Nursing = 0,
                NonMSPService = 0,
                Counseling = 0,
                Audiology = 0
            };

            foreach (var claim in claims)
            {
                var encServiceCode = claim.EncounterStudent.Encounter.Provider.ProviderTitle.ServiceCodeId;
                switch (encServiceCode)
                {
                    case (int)ServiceCodes.Speech_Therapy:
                        dto.SpeechTherapy++;
                        break;
                    case (int)ServiceCodes.Psychology:
                        dto.Psychology++;
                        break;
                    case (int)ServiceCodes.Occupational_Therapy:
                        dto.OccupationalTherapy++;
                        break;
                    case (int)ServiceCodes.Physical_Therapy:
                        dto.PhysicalTherapy++;
                        break;
                    case (int)ServiceCodes.Nursing:
                        dto.Nursing++;
                        break;
                    case (int)ServiceCodes.Non_Msp_Service:
                        dto.NonMSPService++;
                        break;
                    case (int)ServiceCodes.Counseling_Social_Work:
                        dto.Counseling++;
                        break;
                    case (int)ServiceCodes.Audiology:
                        dto.Audiology++;
                        break;
                    default: break;
                }
            }
            return dto;
        }
    }
}
