using API.ManagedListItems.Base;
using Microsoft.AspNetCore.Mvc;
using Model;
using Service.Base;

namespace API.ManagedListItems
{
    [Route("api/v1/voucherTypes")]
    public class VoucherTypesController : ManagedListItemBaseController<VoucherType, Voucher>
    {
        public VoucherTypesController(ICRUDService crudService)
            : base("VoucherTypeId", "Voucher Type", crudService)
        {
            UpdateFunc = ManagedListItemUtilities.GetDefaultNamedMappingFunction<VoucherType>();
        }
    }
}
