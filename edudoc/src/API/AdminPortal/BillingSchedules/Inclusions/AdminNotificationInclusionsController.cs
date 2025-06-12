using API.Core.Claims;
using API.CRUD;
using Microsoft.AspNetCore.Mvc;
using Model;
using Model.DTOs;
using Service.Base;
using System.Collections.Generic;
using System.Linq;

namespace API.BillingSchedules
{
    [Route("api/v1/admin-notification-inclusions")]
    [Restrict(ClaimTypes.BillingSchedules, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
    public class AdminNotificationInclusionsController : CrudBaseController<BillingScheduleAdminNotification>
    {
        public AdminNotificationInclusionsController(ICRUDService crudService) : base(crudService)
        {
        }

    }
}
