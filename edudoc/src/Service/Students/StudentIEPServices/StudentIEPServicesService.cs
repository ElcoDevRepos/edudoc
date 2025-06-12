using FluentValidation;
using Model;
using Model.DTOs;
using Model.Enums;
using Service.Utilities;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;

namespace Service.Students.StudentIEPServices
{
    public class StudentIEPServicesService : BaseService, IStudentIEPServicesService
    {
        private readonly IPrimaryContext _context;
        public StudentIEPServicesService(IPrimaryContext context) : base(context)
        {
            _context = context;
        }

        public (IEnumerable<IEPServiceDTO> items, int count) GetList(Model.Core.CRUDSearchParams csp, int userId) 
        {
            var baseQuery = _context.IepServices
                .Include("Student")
                .AsQueryable();
            var districtId = _context.Users.FirstOrDefault(u => u.Id == userId)?.SchoolDistrictId;
            if (districtId == null) throw new ValidationException("Only school district admins can access this page.");
            
            baseQuery = baseQuery.Where(iep => iep.Student.School.SchoolDistrictsSchools.Any(y => y.SchoolDistrictId == districtId));

            if (!CommonFunctions.IsBlankSearch(csp.Query))
            {
                string[] terms = CommonFunctions.SplitTerms(csp.Query.Trim().ToLower());
                foreach (string t in terms)
                {
                    baseQuery = baseQuery.Where(s =>
                                    s.Student.FirstName.ToLower().StartsWith(t) ||
                                    s.Student.LastName.ToLower().StartsWith(t) ||
                                    s.Student.Id.ToString().ToLower().StartsWith(t)
                                );
                }
            }

            var serviceOverTotalMinutes = false;
            if (!string.IsNullOrEmpty(csp.extraparams))
            {
                var extras = System.Web.HttpUtility.ParseQueryString(WebUtility.UrlDecode(csp.extraparams));

                if (extras["studentId"] != null && extras["studentId"] != "0")
                {
                    int studentId = int.Parse(extras["studentId"]);
                    baseQuery = baseQuery.Where(iep => iep.StudentId == studentId);
                }
                if (extras["StartDate"] != null)
                {
                    var startDate = DateTime.Parse(extras["StartDate"]);
                    baseQuery = baseQuery.Where(iep => DbFunctions.TruncateTime(iep.StartDate) >= DbFunctions.TruncateTime(startDate));
                }
                if (extras["EndDate"] != null)
                {
                    var endDate = DateTime.Parse(extras["EndDate"]);
                    baseQuery = baseQuery.Where(iep => DbFunctions.TruncateTime(iep.EndDate) <= DbFunctions.TruncateTime(endDate));
                }
                if (extras["serviceOverTotalMinutes"] != null && extras["serviceOverTotalMinutes"] == "1")
                {
                    serviceOverTotalMinutes = true;
                }
                if (extras["iepExpiring"] != null)
                {
                    var paramList = CommonFunctions.GetIntListFromExtraParams(csp.extraparams, "iepExpiring");
                    var iepExpiring = paramList["iepExpiring"];

                    if (iepExpiring.Contains((int)IepExpiring.ExpiringIn60Days))
                    {
                        DateTime date = DateTime.Now.AddDays(60);
                        baseQuery = baseQuery.Where(iep => iep.EndDate <= date);
                    }
                    else if (iepExpiring.Contains((int)IepExpiring.ExpiringIn30Days))
                    {
                        DateTime date = DateTime.Now.AddDays(30);
                        baseQuery = baseQuery.Where(iep => iep.EndDate <= date);
                    }
                }
            }

            var serviceCodes = _context.ServiceCodes.AsNoTracking().AsEnumerable();
            var result = new List<IEPServiceDTO>();
            foreach (var item in baseQuery.AsEnumerable())
            {
                var encounterQuery = _context.EncounterStudents.Where(
                        es => es.StudentId == item.StudentId &&
                        !es.Archived &&
                        es.Encounter.ServiceTypeId == (int)ServiceTypes.Treatment_Therapy &&
                        es.EncounterDate >= item.StartDate && es.EncounterDate <= item.EndDate
                    ).AsNoTracking();
                foreach (var serviceCode in serviceCodes)
                {
                    var dto = new IEPServiceDTO
                    {
                        StudentId = item.StudentId,
                        StudentName = $"{item.Student.LastName}, {item.Student.FirstName}",
                        DateOfBirth = item.Student.DateOfBirth,
                        IEPStartDate = item.StartDate,
                        IEPEndDate = item.EndDate,
                        ETRExpirationDate = item.EtrExpirationDate,
                        ServiceArea = serviceCode.Name,
                    };
                    var serviceCodeQuery = encounterQuery
                        .Where(es => es.Encounter.Provider.ProviderTitle.ServiceCodeId == serviceCode.Id).AsNoTracking();
                    var totalMinutes = serviceCodeQuery
                            .Select(es => es.EncounterStudentCptCodes.Where(cpt => cpt.Minutes != null).Sum(cpt => cpt.Minutes))
                            .Where(min => min != null);
                    dto.MinutesUsed = totalMinutes.Any() ? totalMinutes.Sum(minutes => (int)minutes) : 0;
                    switch (serviceCode.Id)
                    {
                        case (int)ServiceCodes.Speech_Therapy:
                            dto.TotalMinutes = (int)item.StpTotalMinutes;
                            break;
                        case (int)ServiceCodes.Psychology:
                            dto.TotalMinutes = (int)item.PsyTotalMinutes;
                            break;
                        case (int)ServiceCodes.Occupational_Therapy:
                            dto.TotalMinutes = (int)item.OtpTotalMinutes;
                            break;
                        case (int)ServiceCodes.Physical_Therapy:
                            dto.TotalMinutes = (int)item.PtTotalMinutes;
                            break;
                        case (int)ServiceCodes.Nursing:
                            dto.TotalMinutes = (int)item.NursingTotalMinutes;
                            break;
                        case (int)ServiceCodes.Non_Msp_Service:
                            dto.TotalMinutes = (int)item.CcTotalMinutes;
                            break;
                        case (int)ServiceCodes.Counseling_Social_Work:
                            dto.TotalMinutes = (int)item.SocTotalMinutes;
                            break;
                        case (int)ServiceCodes.Audiology:
                            dto.TotalMinutes = (int)item.AudTotalMinutes;
                            break;
                        default: break;
                    }
                    if (!serviceOverTotalMinutes || (serviceOverTotalMinutes && dto.MinutesUsed > dto.TotalMinutes))
                    {
                        result.Add(dto);
                    }
                }
            }

            var res = CommonFunctions.OrderByDynamic(result.AsQueryable(), csp.order ?? "StudentName", csp.orderdirection == "desc");

            if (csp.skip.GetValueOrDefault() != 0 || csp.skip.GetValueOrDefault() != 0)
            {
                return (res
                    .Skip(csp.skip.GetValueOrDefault())
                    .Take(csp.take.GetValueOrDefault()), res.Count());
            }
            else
            {
                return (res, res.Count());
            }
        }
    }
}
