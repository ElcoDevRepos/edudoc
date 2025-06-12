using API.Core.Claims;
using API.Common;
using API.CRUD;
using Microsoft.AspNetCore.Mvc;
using Model;
using Model.DTOs;
using Service.Base;
using Service.Vouchers;
using System.Linq;

namespace API.Vouchers
{
    [Route("api/v1/vouchers")]
    [Restrict(ClaimTypes.Vouchers, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
    public class VouchersController : CrudBaseController<Voucher>
    {
        private readonly IVoucherService _voucherService;
        public VouchersController(ICRUDService crudService, IVoucherService voucherService) : base(crudService)
        {
            Getbyincludes = new[] { "VoucherType", "SchoolDistrict", "UnmatchedClaimDistrict" };
            Searchchildincludes = new[] { "" };
            _voucherService = voucherService;
        }

        public override IActionResult Create([FromBody] Voucher voucher)
        {
            return ExecuteValidatedAction(() =>
            {
                _voucherService.CreateVoucher(voucher);
                _voucherService.CheckForUnknownVouchers(voucher);
                return Ok(voucher.Id);
            });
        }

        public override IActionResult Update([FromRoute] int id, [FromBody] Voucher data)
        {
            _voucherService.UpdateVoucher(id, data);
            _voucherService.CheckForUnknownVouchers(data);
            return Ok();
        }

        [HttpGet]
        [Route("get-vouchers")]
        [Restrict(ClaimTypes.Vouchers, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
        public IActionResult GetVouchersList([FromQuery] Model.Core.CRUDSearchParams csp)
        {
            var searchResults = _voucherService.SearchForVouchers(csp);
            return Ok(
                        searchResults.vouchers
                        .AsQueryable()
                        .ToSearchResults(searchResults.count)
                        .Respond(this)
                    );
        }

        [HttpGet]
        [Route("get-by-id/{id:int}")]
        [Restrict(ClaimTypes.Vouchers, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
        public IActionResult GeVoucherById(int id)
        {
            return Ok(Crudservice.GetById<Voucher>(id, Getbyincludes));
        }

        [HttpPost]
        [Route("archive/{id:int}")]
        [Restrict(ClaimTypes.Vouchers, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
        public IActionResult ArchiveVoucher(int id)
        {
            return Ok(_voucherService.ArchiveVoucher(id));
        }

        [HttpPost]
        [Route("remove-claim/{id:int}")]
        [Restrict(ClaimTypes.Vouchers, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
        public IActionResult RemoveClaimVoucher(int id)
        {
            return Ok(_voucherService.RemoveClaimVoucher(id));
        }
    }
}
