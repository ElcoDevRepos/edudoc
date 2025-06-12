using Model;
using Model.DTOs;
using Model.Enums;
using Service.Utilities;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;

namespace Service.Vouchers
{
    public class VoucherService : BaseService, IVoucherService
    {
        private readonly IPrimaryContext _context;
        private readonly Dictionary<string, int> _serviceCodes;

        public VoucherService(IPrimaryContext context) : base(context)
        {
            _context = context;
            _serviceCodes = CommonFunctions.GetServiceCodeIdForVouchers();
        }

        public int CreateVoucher(Voucher voucher)
        {

            ValidateAndThrow(voucher, new VoucherValidator());
            // If there is an existing voucher that has the same voucher date, school district,
            // service code and total, add to existing voucher's paid amount.
            // Else create a new voucher
            List<Voucher> existingVouchers = _context.Vouchers
                .Where(v => !v.Archived && DbFunctions.TruncateTime(v.VoucherDate) == DbFunctions.TruncateTime(voucher.VoucherDate) &&
                v.SchoolDistrictId == voucher.SchoolDistrictId &&
                v.VoucherAmount == voucher.VoucherAmount).ToList();

            if (existingVouchers.Any())
            {
                Voucher sameServiceCodeVoucher = existingVouchers.FirstOrDefault(v =>
                    v.ServiceCode == voucher.ServiceCode &&
                    v.VoucherTypeId == voucher.VoucherTypeId
                );

                if (sameServiceCodeVoucher != null)
                {
                    sameServiceCodeVoucher.PaidAmount = (decimal.Parse(sameServiceCodeVoucher.PaidAmount)
                        + decimal.Parse(voucher.PaidAmount)).ToString();
                }
                else
                {
                    _context.Vouchers.Add(voucher);
                }
            }
            else
            {
                _context.Vouchers.Add(voucher);
            }
            _context.SaveChanges();
            return voucher.Id;
        }

        public int UpdateVoucher(int id, Voucher voucher)
        {
            Voucher existingSameServiceCodeVoucher = _context.Vouchers
                .FirstOrDefault(v =>
                    v.ServiceCode == voucher.ServiceCode &&
                    v.VoucherTypeId == voucher.VoucherTypeId &&
                    !v.Archived &&
                    DbFunctions.TruncateTime(v.VoucherDate) == DbFunctions.TruncateTime(voucher.VoucherDate) &&
                    v.SchoolDistrictId == voucher.SchoolDistrictId &&
                    v.VoucherAmount == voucher.VoucherAmount &&
                    v.SchoolYear == voucher.SchoolYear &&
                    v.Id != voucher.Id
                );

            Voucher existingVoucher = _context.Vouchers.FirstOrDefault(v => v.Id == id);

            // If there is an existing voucher that has the same voucher date, school district,
            // service code and school year, add to existing voucher's paid amount and remove current voucher
            if (existingSameServiceCodeVoucher != null)
            {
                existingSameServiceCodeVoucher.PaidAmount = (decimal.Parse(existingSameServiceCodeVoucher.PaidAmount)
                        + decimal.Parse(voucher.PaidAmount)).ToString();
                existingVoucher.Archived = true;
            }
            else
            {
                // Else update existing voucher
                existingVoucher.PaidAmount = voucher.PaidAmount;
                existingVoucher.ServiceCode = voucher.ServiceCode;
                existingVoucher.VoucherTypeId = voucher.VoucherTypeId;
                existingVoucher.SchoolYear = voucher.SchoolYear;
            }
            _context.SaveChanges();
            return voucher.Id;
        }

        public int CheckForUnknownVouchers(Voucher voucher)
        {
            // Check that with updated amounts, does an unknown voucher need to be created or removed
            List<Voucher> vouchers = _context.Vouchers
                .Where(v =>
                    !v.Archived &&
                    v.VoucherAmount == voucher.VoucherAmount &&
                    v.SchoolDistrictId == voucher.SchoolDistrictId &&
                    DbFunctions.TruncateTime(v.VoucherDate) == DbFunctions.TruncateTime(voucher.VoucherDate) &&
                    v.VoucherTypeId != (int)VoucherTypes.Unknown
                ).ToList();

            decimal paidAmount = vouchers.Select(v => decimal.Parse(v.PaidAmount)).Sum();
            decimal voucherAmount = decimal.Parse(vouchers.FirstOrDefault()?.VoucherAmount ?? voucher.VoucherAmount ?? "0");

            Voucher unknown = _context.Vouchers
                .FirstOrDefault(v =>
                    !v.Archived &&
                    v.VoucherTypeId == (int)VoucherTypes.Unknown
                    && v.SchoolDistrictId == voucher.SchoolDistrictId
                    && v.VoucherAmount == voucher.VoucherAmount
                    && DbFunctions.TruncateTime(v.VoucherDate) == DbFunctions.TruncateTime(voucher.VoucherDate)
                );

            if (!voucher.Archived && paidAmount != voucherAmount && unknown == null)
            {
                // There is difference between amounts, create unknown voucher
                _context.Vouchers.Add(new Voucher
                {
                    VoucherDate = voucher.VoucherDate,
                    VoucherAmount = voucher.VoucherAmount,
                    PaidAmount = (voucherAmount - paidAmount < 0 ? "-" : "") + Math.Abs(voucherAmount - paidAmount).ToString(),
                    ServiceCode = null,
                    SchoolDistrictId = voucher.SchoolDistrictId,
                    SchoolYear = voucher.SchoolYear,
                    VoucherTypeId = (int)VoucherTypes.Unknown,
                });
            }
            else if (!voucher.Archived && paidAmount != voucherAmount && unknown != null)
            {
                // Update paid amount on unknown voucher
                unknown.PaidAmount = (voucherAmount - paidAmount < 0 ? "-" : "") + Math.Abs(voucherAmount - paidAmount).ToString();
            }
            else if (paidAmount == voucherAmount && unknown != null)
            {
                // Remove existing unknown voucher since paid amounts and voucher amounts are the same
                unknown.Archived = true;
            }

            _context.SaveChanges();
            return voucher.Id;
        }

        public (IEnumerable<ClaimVoucherDTO> vouchers, int count) SearchForVouchers(Model.Core.CRUDSearchParams csp)
        {
            var baseQuery = _context.Vouchers
                .Include(v => v.VoucherType)
                .Where(v => !v.Archived)
                .Where(v => !v.SchoolDistrict.Archived)
                .Select(v => new ClaimVoucherDTO
                    {
                        ClaimEncounterId  = null,
                        VoucherId = v.Id,
                        VoucherAmount = v.VoucherAmount,
                        PaidAmount = v.PaidAmount,
                        VoucherDate = v.VoucherDate,
                        ServiceCodeId = 0,
                        ServiceCode = v.ServiceCode ?? v.VoucherType.Name,
                        SchoolYear = v.SchoolYear,
                        SchoolDistrict = v.SchoolDistrict.Name ?? v.UnmatchedClaimDistrict.DistrictOrganizationName,
                        SchoolDistrictId = v.SchoolDistrictId,
                        Unmatched = v.UnmatchedClaimDistrictId != null,
                        VoucherType = v.VoucherType,
                });

            if (!CommonFunctions.IsBlankSearch(csp.Query))
            {
                string[] terms = CommonFunctions.SplitTerms(csp.Query.Trim().ToLower());
                foreach (string t in terms)
                {
                    baseQuery = baseQuery.Where(v => v.VoucherAmount.StartsWith(t) || v.SchoolYear.StartsWith(t) || v.SchoolDistrict.StartsWith(t));
                }
            }
            if (!string.IsNullOrEmpty(csp.extraparams))
            {
                var extras = System.Web.HttpUtility.ParseQueryString(WebUtility.UrlDecode(csp.extraparams));

                if (extras["ServiceCodeIds"] != null && extras["ServiceCodeIds"] != "0")
                {
                    var serviceCodeIdsParamList = CommonFunctions.GetIntListFromExtraParams(csp.extraparams, "ServiceCodeIds");
                    var serviceCodeIds = serviceCodeIdsParamList["ServiceCodeIds"];

                    if (serviceCodeIds.Count > 0)
                    {
                        var serviceCodeNames = _serviceCodes.Where(sc => serviceCodeIds.Contains(sc.Value)).Select(sc => sc.Key).ToList();
                        baseQuery = baseQuery.Where(voucher => serviceCodeNames.Contains(voucher.ServiceCode));
                    }
                }
                if (extras["SchoolDistrictIds"] != null && extras["SchoolDistrictIds"] != "0")
                {
                    var schoolDistrictIdsParamList = CommonFunctions.GetIntListFromExtraParams(csp.extraparams, "SchoolDistrictIds");
                    var schoolDistrictIds = schoolDistrictIdsParamList["SchoolDistrictIds"];

                    // for unmatched districts
                    var npiNumbersParamList = CommonFunctions.GetIntListFromExtraParams(csp.extraparams, "NpiNumbers");
                    var npiNumbers = npiNumbersParamList["NpiNumbers"];

                    var unmatchedDistricts = Context.UnmatchedClaimDistricts
                                                        .Where(ucd => npiNumbers.Any(npi => npi.ToString() == ucd.IdentificationCode))
                                                        .Select(ucd => ucd.DistrictOrganizationName)
                                                        .ToList();

                    if (schoolDistrictIds.Count > 0)
                        baseQuery = baseQuery.Where(voucher => (voucher.SchoolDistrictId != null && schoolDistrictIds.Contains((int)voucher.SchoolDistrictId))
                                                                || unmatchedDistricts.Contains(voucher.SchoolDistrict));
                }
                if (extras["StartDate"] != null)
                {
                    var startDate = DateTime.Parse(extras["StartDate"]);
                    baseQuery = baseQuery.Where(vouchers => DbFunctions.TruncateTime(vouchers.VoucherDate) >= DbFunctions.TruncateTime(startDate));
                }
                if (extras["EndDate"] != null)
                {
                    var endDate = DateTime.Parse(extras["EndDate"]);
                    baseQuery = baseQuery.Where(vouchers => DbFunctions.TruncateTime(vouchers.VoucherDate) <= DbFunctions.TruncateTime(endDate));
                }
            }

            if (csp.order == "VoucherDate")
            {
                if (csp.orderdirection == "desc")
                {
                    baseQuery = baseQuery.OrderByDescending(v => v.VoucherDate)
                        .ThenBy(v => v.SchoolDistrict).ThenBy(v => v.SchoolYear).ThenBy(v => v.ServiceCode);
                }
                else
                {
                    baseQuery = baseQuery.OrderBy(v => v.VoucherDate)
                        .ThenBy(v => v.SchoolDistrict).ThenBy(v => v.SchoolYear).ThenBy(v => v.ServiceCode);
                }
            }
            else
            {
                baseQuery = baseQuery.OrderBy(v => v.SchoolDistrict).ThenBy(v => v.ServiceCodeId).ThenBy(v => v.SchoolYear);
            }

            var count = baseQuery.Count();
            if (csp.take.GetValueOrDefault() > 0)
            {
                baseQuery = baseQuery
                        .Skip(csp.skip.GetValueOrDefault())
                        .Take(csp.take.GetValueOrDefault());
            }

            return (baseQuery.AsEnumerable(), count);
        }

        public int ArchiveVoucher(int id)
        {
            var voucher = _context.Vouchers.FirstOrDefault(v => v.Id == id);
            ThrowIfNull(voucher);
            voucher.Archived = true;
            _context.SaveChanges();
            CheckForUnknownVouchers(voucher);
            return id;
        }
        public int RemoveClaimVoucher(int id)
        {
            var claimVoucher = _context.ClaimsEncounters.FirstOrDefault(v => v.Id == id);
            if (claimVoucher != null)
            {
                claimVoucher.PaidAmount = null;
                claimVoucher.VoucherDate = null;
            }
            _context.SaveChanges();
            return id;
        }
        public ClaimsEncounter GetClaimVoucher(int id)
        {
            return _context.ClaimsEncounters
                .Include(ce => ce.EncounterStudent)
                .Include(ce => ce.EncounterStudent.Encounter)
                .Include(ce => ce.EncounterStudent.Encounter.Provider)
                .Include(ce => ce.EncounterStudent.Encounter.Provider.ProviderTitle)
                .Include(ce => ce.EncounterStudent.Encounter.Provider.ProviderTitle.ServiceCode)
                .Include(ce => ce.ClaimsStudent)
                .Include(ce => ce.ClaimsStudent.ClaimsDistrict)
                .Include(ce => ce.ClaimsStudent.ClaimsDistrict.SchoolDistrict)
                .FirstOrDefault(ce => ce.Id == id);
        }

        public ClaimsEncounter UpdateClaimVoucher(ClaimVoucherUpdateDTO dto)
        {
            var claim = _context.ClaimsEncounters
                .Include(ce => ce.ClaimsStudent)
                .Include(ce => ce.ClaimsStudent.ClaimsDistrict)
                .Include(ce => ce.ClaimsStudent.ClaimsDistrict.SchoolDistrict)
                .FirstOrDefault(c => c.Id == dto.Id);
            claim.ClaimAmount = dto.VoucherAmount;
            claim.PaidAmount = dto.PaidAmount;
            claim.ServiceDate = new DateTime(Int32.Parse(dto.SchoolYear), claim.ServiceDate.Month, claim.ServiceDate.Day);
            claim.ClaimsStudent.ClaimsDistrict.SchoolDistrictId = dto.SchoolDistrictId;
            var providerTitle = _context.ProviderTitles
                .Where(pt => pt.Providers.Any(p =>
                    p.Encounters.Any(e => e.EncounterStudents.Any(es =>
                        es.ClaimsEncounters.Any(ce => ce.Id == dto.Id)))))
                .FirstOrDefault();

            if (providerTitle != null)
            {
                providerTitle.ServiceCodeId = dto.ServiceCodeId;
            }
            _context.SaveChanges();

            return _context.ClaimsEncounters
                .Include(ce => ce.EncounterStudent)
                .Include(ce => ce.EncounterStudent.Encounter)
                .Include(ce => ce.EncounterStudent.Encounter.Provider)
                .Include(ce => ce.EncounterStudent.Encounter.Provider.ProviderTitle)
                .Include(ce => ce.EncounterStudent.Encounter.Provider.ProviderTitle.ServiceCode)
                .Include(ce => ce.ClaimsStudent)
                .Include(ce => ce.ClaimsStudent.ClaimsDistrict)
                .Include(ce => ce.ClaimsStudent.ClaimsDistrict.SchoolDistrict)
                .FirstOrDefault(c => c.Id == dto.Id);
        }
    }
}

